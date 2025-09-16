// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Gestore comunicazione con server
// ************************************************

// ******************************************************
// Classe OWAMessagePump : rappresenta l'entita' che 
// gestisce l'offline (OWA)
// ******************************************************
function OWAMessagePump()
{
  this.LastOnlineCheck = new Date();  // Usato per le verifiche periodiche di ripristino connessione
  this.OnlineReq = null;
}

// *********************************************************************************************
// Gestione eventi periodici della coda dei messaggi
// *********************************************************************************************
OWAMessagePump.prototype.Tick = function()
{
	this.OnTick();
	//
  // Verifico se devo riprovare a tornare online
  // (non lo faccio se sto gia' facendo un tentativo)
  if (this.OnlineReq==null && new Date()-this.LastOnlineCheck > RD3_ClientParams.OWAOfflineCheck*1000)
  {
    // E' ora di ricontrollare se posso tornare online
    this.LastOnlineCheck = new Date();
    //
    // Provo ad inviare un messaggio DUMMY al server... Se mi risponde allora chiedo se posso provare
    var MP = RD3_DesktopManager.MessagePump;
    this.OnlineReq = MP.CreateRequest();
    this.OnlineReq.StartTime = new Date();
    //
    var url = MP.ServerURL.substring(0, MP.ServerURL.indexOf('?'));
    this.OnlineReq.open("POST", url, true);
    this.OnlineReq.onreadystatechange = new Function("return RD3_DesktopManager.MessagePump.OWAMessagePump.CheckResponse(1);");
    this.OnlineReq.setRequestHeader("Content-Type", "text/xml");
    this.OnlineReq.send();
  }
}
    
// *****************************************************************
// Metodo chiamato da ogni richiesta al variare del suo stato: 
// se e' completa la accoda nella lista delle richieste completate
// ******************************************************************
OWAMessagePump.prototype.CheckResponse = function(reqType)
{
  // Se la richiesta e' stata elaborata correttamente
  if (this.OnlineReq.readyState == 4)
  {
    // Se e' la richiesta DUMMY per verificare lo stato della connettivita'
    if (reqType == 1)
    {
      // Se il server ha risposto OK e l'utente vuole provare a tornare online
      if (this.OnlineReq.status == 200 && confirm(ClientMessages.WEP_OWA_CANON))
      {
        // Ci provo.
        var MP = RD3_DesktopManager.MessagePump;
        this.OnlineReq = MP.CreateRequest();
        this.OnlineReq.StartTime = new Date();
        //
        // Creo il documento XML da inviare al server
        var reqxml = MP.CreateXMLDoc("rd3");
        var root = reqxml.getElementsByTagName("rd3")[0];
        //
        // Segnalo che e' una richiesta di tipo owabackonline
        root.setAttribute("num", "owa");
        //
        // Aggiungo tutti gli eventi alla richiesta XML
        var applName = RD3_DesktopManager.AppName;
        var smaxID = localStorage[applName + "_maxID"];
        var maxID = (smaxID ? parseInt(smaxID, 10) : 1);
        for (var i=1; i<maxID; i++)
        {
          // Ricarico l'evento dal LocalStorage
          var ev = new IDEvent();
          ev.LoadFromString(localStorage[applName + "_EVT" + i]);
          //
          // E lo scrivo in XML
          ev.WriteXmlNode(root, reqxml);
        }
        //
        // Invio la richiesta
        var url = MP.ServerURL.substring(0, MP.ServerURL.indexOf('?')) + '?CMD=OWABackOnline';
        this.OnlineReq.open("POST", url, true);
        this.OnlineReq.onreadystatechange = new Function("return RD3_DesktopManager.MessagePump.OWAMessagePump.CheckResponse(2);");
        this.OnlineReq.setRequestHeader("Content-Type", "text/xml");
        this.OnlineReq.send(reqxml);
        //
        return;
      }
    }
    else if (reqType == 2)
    {
      // Se il server ha risposto OK
      if (this.OnlineReq.status == 200 && this.OnlineReq.responseText == "OK")
      {
      	// Segnalo che sono tornato online 
      	this.AfterBackOnline();
      	//
        RD3_DesktopManager.MessagePump.OWAMessagePump = null;
        //
        // Rimuovo i dati OWA
        var applName = RD3_DesktopManager.AppName;
        localStorage.removeItem(applName + "_start");
        //
        var smaxID = localStorage[applName + "_maxID"];
        var maxID = (smaxID ? parseInt(smaxID, 10) : 1);
        for (var i=1; i<maxID; i++)
          localStorage.removeItem(applName + "_EVT" + i);
        //
        localStorage.removeItem(applName + "_maxID");
        //
        // Ricarico l'applicazione
        window.location.reload(true);
      }
      else
        alert(ClientMessages.WEP_OWA_NOON);
    }
    //
    this.OnlineReq = null;
  }
}

// *********************************************************************************************
// Ripristina l'applicazione utilizzando il localStorage
// *********************************************************************************************
OWAMessagePump.prototype.restoreFromStorage = function()
{
  var applName = RD3_DesktopManager.AppName;
  var xml = localStorage[applName + "_start"];
  var xmldoc;
  if (RD3_Glb.IsIE())
  {
    xmldoc = RD3_DesktopManager.MessagePump.CreateXMLDoc("rd3");
    xmldoc.loadXML(xml);
  }
  else
    xmldoc = (new DOMParser()).parseFromString(xml, "text/xml");
  //
  // Avvio l'applicazione
  RD3_DesktopManager.ProcessXmlDoc(xmldoc);
  //
  // Ora faccio il replay degli eventi
  var smaxID = localStorage[applName + "_maxID"];
  var maxID = (smaxID ? parseInt(smaxID, 10) : 1);
  for (var i=1; i<maxID; i++)
  {
    // Ricarico l'evento dal localStorage
    var ev = new IDEvent();
    ev.LoadFromString(localStorage[applName + "_EVT" + i]);
    //
    // E lo ri-playo
    this.ReplayEvent(ev);
  }
  //
  this.AfterReplay();
}

// *********************************************************************************************
// Arrivato un nuovo evento da gestire
// *********************************************************************************************
OWAMessagePump.prototype.AddEvent = function(e)
{
  if (e.Tipo == "chg")
  {
    var obj = RD3_DesktopManager.ObjectMap[e.ObjId];
    if (obj && obj instanceof PValue)
    {
      // Appendo il nome della tabella/classe sottesa al pannello
      var pf = obj.ParentField;
      var pp = pf.ParentPanel;
      e.Tag = pp.TableName + "|" + pf.DBCode + "|";
      //
      // Appendo il valore di tutti i campi PK
      for (var i=0; i<pp.Fields.length; i++)
      {
        var f = pp.Fields[i];
        if (f.IsPK)
        {
          // Questo campo e' una PK... Prelevo il valore corrente
          if (e.Tag.substring(e.Tag.length-1, e.Tag.length)!='|')
            e.Tag += ",";
          e.Tag += f.DBCode + "=" + f.PValues[obj.Index].Text;
        }
      }
    }
  }
  //
  // Notifico l'evento all'utente
  // Lo aggiungo alla lista di quelli da inviare quando torno online solo se
  // l'utente non ha detto di non farlo (OnEvent che torna TRUE)
  if (!this.OnEvent(e))
  {
    // Decido se metterlo nel local Storage... ci sono alcuni eventi che sono 
    // completamente inutili quando torno online
    if (e.Tipo!="fev" && e.Tipo!="start" && e.Tipo!="resize" && e.Tipo!="sound")
    {
      // Lo metto nel local Storage (e' da inviare quando torno online)
      var applName = RD3_DesktopManager.AppName;
      var smaxID = localStorage[applName + "_maxID"];
      var maxID = (smaxID ? parseInt(smaxID, 10) : 1);
      //
      var ok = true;
      var et = 0;
      var msg = "";
      //
      try
      {
      	var s = e.ToString();
      	localStorage[applName + "_EVT" + maxID] = s;
      	//
      	// Rileggo il contenuto del local storage per essere certi
      	// che e' corretto
      	var r = localStorage[applName + "_EVT" + maxID];
      	if (r!=s)
      	{
      		et = 1;
      		ok = false;
      	}
      	else
      	{
      		// Provo a ricreare l'IDEvent senza eccezioni
      		et = 2;
      		var ev = new IDEvent();
			    ev.LoadFromString(r);
      	}
      	//
      	if (ok)
      	{
      		maxID++;
      		localStorage[applName + "_maxID"] = maxID;
      	}
      }
      catch(ex)
      {
      	ok = false;
      	msg = ex;
      }
      //
      if (!ok)
      {
      	alert("ATTENZIONE: tornare ONLINE appena possibile. Errore "+et+": "+msg);
      }
    }
  }
}

// *********************************************************************************************
// Replay di un singolo event
// *********************************************************************************************
OWAMessagePump.prototype.ReplayEvent = function(e)
{
  if (e.Tipo == "chg")
  {
    var obj = RD3_DesktopManager.ObjectMap[e.ObjId];
    if (obj && obj instanceof PValue)
    {
      obj.Text = e.Par1;
      obj.UpdateScreen();
    }
  }
  //
  // Notifico l'evento
  this.OnReplayEvent(e);
}


// *********************************************************************************************
// Gestore predefinito del singolo evento
// Ritornare TRUE se l'evento e' stato gestito lato client e non occorre inviarlo al server
// *********************************************************************************************
OWAMessagePump.prototype.OnEvent = function(e)
{
}

// *********************************************************************************************
// Evento notificato durante il "risveglio" di un'applicazione offline: replay eventi memorizzati
// *********************************************************************************************
OWAMessagePump.prototype.OnReplayEvent = function(e)
{

}

// *********************************************************************************************
// Evento di tick personalizzato
// *********************************************************************************************
OWAMessagePump.prototype.OnTick= function()
{

}

// *********************************************************************************************
// Evento completamento ritorno offline personalizzato
// *********************************************************************************************
OWAMessagePump.prototype.AfterReplay= function()
{
  // Avviso che siamo offline
  setTimeout("alert(ClientMessages.WEP_OWA_OFFLINE);", 500);	
}


// *********************************************************************************************
// Evento completamento ritorno online personalizzato
// *********************************************************************************************
OWAMessagePump.prototype.AfterBackOnline= function()
{
}

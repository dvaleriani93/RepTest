// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Gestore comunicazione con server
// ************************************************

// ******************************************************
// Classe MessagePump : rappresenta l'entita' che 
// contiene la coda degli eventi e li invia al Server
// Perche' funzioni e' necessario che lo script Desktop.js
// sia caricato prima
// ******************************************************
function MessagePump()
{
  this.Requests = new HashTable(true);  // Lista delle delle richieste (con elenco item attivato)
  this.Responses = new Array();  // Coda delle risposte arrivate
  this.EventQueue = new Array(); // Coda degli eventi che devono essere inviati al server
  this.RequestNumber = 1;
  //
  // La url del server a qui inviare le richieste
  this.ServerURL = window.location.href.replace(window.location.search,"");
  //
  // Se l'URL conteneva un ancora me la devo mangiare
  if (this.ServerURL.indexOf("#") > 0)
    this.ServerURL = this.ServerURL.substring(0, this.ServerURL.indexOf("#"));
  //
  this.ServerURL = this.ServerURL + '?WCI=RD3';
  //
  // Blocking panel
  this.BlockBox = document.createElement("div");
  this.BlockBox.setAttribute("id", "block-box");
  document.body.appendChild(this.BlockBox);
  //
  // Delaydlg
  this.DelayDlg = new PopupDelay();
  //
  // Le coordinate dell'ultimo click del mouse
  this.XPos = 0;
  this.YPos = 0;
  //
  // Booleano per la gestione dell'icona delle richieste
  this.LoadVisible = false;
  //
  // Gestore dell'offline (OWA)
  this.OWAMessagePump = null;
}
  
// ************************************************
// Aggiunge un evento alla coda locale degli eventi
// che verra' poi inviata al server. Restituisce TRUE
// se l'evento e' stato aggiunto oppure FALSE se non e'
// stato possibile farlo. La coda infatti potrebbe essere
// bloccata a causa di una richiesta sincrona
// ************************************************
MessagePump.prototype.AddEvent = function(evento)
{
	// Controllo se c'e' un evento uguale, nel caso lo sostituisco
	var toadd = true;
	var n = this.EventQueue.length;
	for (var i=0; i<n; i++)
	{
		var e = this.EventQueue[i];
		if (e.IsEqual(evento))
		{
			e.CopyFrom(evento);
			toadd = false;
			break;
		}
		//
		// Metodo avanzato 2: se trovo un evento dello stesso tipo ritardo anche lui..
		if (this.EventQueue[i].DelayCopies && this.EventQueue[i].Tipo==evento.Tipo)
		  this.EventQueue[i].StartTime = evento.StartTime;
	}
	//
	// Se l'evento aveva delle coordinate me le memorizzo come ultimo del mouse cliccato
	if (evento.XPosAbs)
	  this.XPos = evento.XPosAbs;
	if (evento.YPosAbs)
	  this.YPos = evento.YPosAbs;
	//
	// Se non c'era lo aggiungo
	if (toadd)
  	this.EventQueue.push(evento);
  //
  return true;
}


// **********************************************
// Invia tutti gli eventi in sospeso al server
// **********************************************
MessagePump.prototype.SendEvents = function()
{
	// Basta annullare i tempi di ritardo
  var n = this.EventQueue.length;
	for (var i=0; i<n; i++)
	{
		this.EventQueue[i].DelayTime = 0;
	}	
}

// ************************************************
// Recupera una richiesta dalla lista
// ************************************************
MessagePump.prototype.GetRequest = function(reqcode)
{
  return this.Requests[reqcode];
}


// ************************************************
// Rimuove una richiesta dalla coda
// ************************************************
MessagePump.prototype.RemoveRequest = function(reqcode)
{
	this.Requests.remove(reqcode);
}


// *********************************************************************************************
// Gestione eventi periodici della coda dei messaggi
// *********************************************************************************************
MessagePump.prototype.Tick = function()
{
	// Vediamo se e' possibile inviare almeno una richiesta
	if (this.Requests.length<RD3_ClientParams.MaxOpenRequests)
	{
		// Invio le richieste se necessario
		if (this.EventsToSend())
	  	this.SendRequest();
	}
	//
	// Se ci sono richieste in coda mostro l'indicatore.
	var w = RD3_DesktopManager.WebEntryPoint;
	if (RD3_ClientParams.ShowAjaxIndicator && w && w.Realized && w.ComImg)
	{
  	if (this.Requests.length>0)
  	{
  	  if (!this.LoadVisible)
  	  {
	      w.ComImg.style.visibility = "";
	      this.LoadVisible = true;
	    }
  	}
    else
    {
      if (this.LoadVisible)
  	  {
        w.ComImg.style.visibility = "hidden";
        this.LoadVisible = false;
      }
    }
  }
	//
	// Se la richiesta piu' vecchia e' aperta da troppo tempo, mostro una finestra di delay
	var t = 0;
	if (this.Requests.length>0)
	{
	  t = (RD3_ClientParams.MaxOpenRequests==1 ? this.LastReqStartTime : this.Requests.GetItem(0).StartTime);
	}
	if (t>0 && (new Date()-t)>RD3_ClientParams.DelayDlgTime && w && w.Realized)
	{
	  if (!this.DelayDlg.Opened)
		  this.DelayDlg.Open(RD3_ServerParams.DelayDefaultMessage, RD3_Glb.DELAY);
		else
		  this.DelayDlg.AdaptLayout();
	}
	else
	{
	  if (this.DelayDlg.Opened)
		  this.DelayDlg.Close();
	}
	//
	// Verifichiamo se c'e' una richiesta bloccante in corso
	var b = this.IsBlocking();
	if (b && this.BlockBox.style.display=="")
	{
		this.BlockBox.style.display = "block";
		RD3_KBManager.CheckFocus = false;
		document.body.focus();
	}
	if (!b && this.BlockBox.style.display=="block")
	{
		// "Muovo" il cursore per evitare che rimanga la clessidra
		this.BlockBox.style.cursor = "default";
		this.BlockBox.style.display = "";
		this.BlockBox.style.cursor = "";
	}
	//
	// Ora gestisco eventuali risposte
	this.HandleResponses();
	//
	// Se sono offline, dispatcho il tick alla OWAMessagePump
	if (this.OWAMessagePump)
	  this.OWAMessagePump.Tick();
}

// *********************************************************************************************
// Torna TRUE se ci sono richieste BLOCKING in corso
// *********************************************************************************************
MessagePump.prototype.IsBlocking = function()
{
	var n = this.Requests.length;
	for (var i=0; i<n; i++)
	{
	  if (RD3_ClientParams.MaxOpenRequests==1 ? this.LastReqBlocking : this.Requests.GetItem(i).Blocking)
	    return true;
	}
	return false;
}


// *********************************************************************************************
// Se ci sono eventi in coda, li invio al server generando un'unica richiesta
// *********************************************************************************************
MessagePump.prototype.SendRequest = function()
{
  // Verifico se ci sono eventi da lanciare
  if (this.EventQueue.length > 0)
  {
    // Se sono in stato offline, giro gli eventi all'OWAMessagePump
    if (this.OWAMessagePump)
    {
      var n = this.EventQueue.length;
      for (var i=0; i<n; i++)
      {
        var e = this.EventQueue.shift();
        this.OWAMessagePump.AddEvent(e);
      }
    }
    else
    {
      // Ogni volta che invio una comunicazione al server resetto il refreshinterval
      if (RD3_DesktopManager && RD3_DesktopManager.WebEntryPoint)
        RD3_DesktopManager.WebEntryPoint.SetRefreshInterval();
      //
      // Creo la richiesta e le memorizzo nell'HashTable
      var req = this.CreateRequest();
      if (RD3_ClientParams.MaxOpenRequests==1)
        this.LastReqStartTime = new Date();
      else
        req.StartTime = new Date();
      //
      // Genero un codice casuale per identificare la richiesta
      var rnd = Math.floor(Math.random() * 1111111);
      var rdcode = "r"+rnd;
      this.Requests.add(rdcode, req);
      //
      // Creo il documento XML da inviare al server
      var reqxml = this.CreateXMLDoc("rd3");
  		var rootlist = reqxml.getElementsByTagName("rd3");
      var root = rootlist[0];
      root.setAttribute("num",  this.RequestNumber);
      this.RequestNumber++;
      //
      // Eventi che spedisco... se non ci riesco mi servono
      var canOWA = (RD3_DesktopManager && RD3_DesktopManager.WebEntryPoint && RD3_DesktopManager.WebEntryPoint.CanOWA);
      if (canOWA)
        req.sentEvents = new Array();
      //
      // Estraggo gli eventi e li aggiungo alla richiesta XML
      var urg = false;
      var skipClearTempMessages = true;
      var n = this.EventQueue.length;
      for(var i=0; i<n; i++)
      {
        var e = this.EventQueue.shift();
        //
        // Chiedo all'evento di scriversi nell'XML
        e.WriteXmlNode(root, reqxml);
        if (e.IsBlocking)
        	urg = true;
        //
        // Mi ricordo degli eventi che invio
        if (canOWA)
          req.sentEvents.push(e);
        //
        skipClearTempMessages = skipClearTempMessages && e.ShouldSkipTempMessageClear();
      }
      //
      // Se la richiesta e' formata da tutti eventi per cui non bisogna rimuovere i messaggi temporanei lo memorizzo
      req.SkipClearTempMessages = skipClearTempMessages;
      //
      // Attacco alla richiesta il flag di blocking
      if (RD3_ClientParams.MaxOpenRequests==1)
        this.LastReqBlocking = urg;
      else
        req.Blocking = urg;
      //
      // Se e' la prima richiesta, invio le info relative alla shell
      var qry = "";
      if (this.RequestNumber == 2) 
        qry = RD3_ShellObject.SendInfo();
      if (RD3_Glb.IsIpad() || RD3_Glb.IsIphone())
        qry += "&RNDID="+rdcode;
      //
      // Invio la richiesta
      req.open("POST", this.ServerURL+qry, true);
      req.onreadystatechange = function() { RD3_DesktopManager.MessagePump.CheckResponse(rdcode); };
      req.setRequestHeader("Content-Type", "text/xml");
      req.send(reqxml);
    }
  }
}

// *****************************************************************
// Metodo chiamato da ogni richiesta al variare del suo stato: 
// se e' completa la accoda nella lista delle richieste completate
// ******************************************************************
MessagePump.prototype.CheckResponse = function(reqcode)
{
  var req = this.GetRequest(reqcode);
	//
  // Vediamo se la richiesta e' stata elaborata dal server
  if (req && req.readyState == 4)
  {
    // Se la richiesta e' stata elaborata la aggiungo alla coda delle richieste da elaborare e chiamo la funzione di gestione
    this.Responses.push(reqcode);
    this.HandleResponses();
  }
}

// *****************************************************************************************
// Funzione di gestione delle richieste complete: se c'e' una animazione bloccante in corso 
// rimanda l'elaborazione delle richieste, altrimenti prende dalla coda la prima richiesta
// e la elabora
// *****************************************************************************************
MessagePump.prototype.HandleResponses = function()
{
  // Se non ci sono animazioni bloccanti in atto..
  if (!RD3_GFXManager.Blocking())
  {
    // Posso elaborare le richieste: parto dalla prima
    if (this.Responses.length != 0)
    {
      var n = this.Responses.length;
      //
      for (var i = 0; i<n; i++)
      {
        // Prendo la richiesta completa e la elaboro
        RD3_DesktopManager.ProcessResponse(this.Responses[i]);
      }
      //
      // Una volta gestite tutte le richieste svuoto l'array
      this.Responses.splice(0, n);
    }
  }
}


// *************************************************
// Metodo che crea una XMLHttpRequest
// *************************************************
MessagePump.prototype.CreateRequest = function()
{
  var req = null;
  //
  // Cerco un oggetto nativo (safari, mozilla, opera, chrome, IE7, IE8)
  if (window.XMLHttpRequest) 
  {
    try 
    {
      req = new XMLHttpRequest();
    } 
    catch(e) 
    {
      req = null;
    }
  } // altrimenti cerco un oggetto active X (IE6, IE5.5)
  else if (window.ActiveXObject) 
  {
    try 
    {
      req = new ActiveXObject("Msxml2.XMLHTTP");
      //
      // In questo caso attivo la modalita' richiesta singola, perche' mi comporto come IE6
      RD3_ClientParams.MaxOpenRequests = 1;
    }
    catch(e) 
    {
      try 
      {
        req = new ActiveXObject("Microsoft.XMLHTTP"); // IE5
      } 
      catch(e) 
      {
        req = null;
      }
    }
  }
  //
  return req;
}


// ********************************************************
// Metodo che crea un documento XML
// ********************************************************
MessagePump.prototype.CreateXMLDoc =  function(rootname) 
{
  var doc = null;
  //
  if (document.implementation && document.implementation.createDocument) 
  {
    // Creiamo il documento con il modello standard W3C (Chrome, Mozilla, Opera)
    doc = document.implementation.createDocument("", rootname, null);
    var dompi = doc.createProcessingInstruction("xml", "version='1.0' encoding='UTF-8'");
    doc.insertBefore(dompi, doc.firstChild);
    return doc;
  }
  else // Altrimenti lo creiamo con il metodo per IE
  { 
    doc = new ActiveXObject("MSXML2.DOMDocument"); 
    //
    // Inizializziamo il documento
    var text = "<" + rootname + "/>";
    doc.loadXML(text);
    //
    var dompi = doc.createProcessingInstruction("xml", "version='1.0' encoding='UTF-8'");
    doc.insertBefore(dompi, doc.firstChild);
    return doc;
  }
}


// *********************************************************************************************
// Ritorna True se c'e' almeno un evento che si puo' lanciare
// *********************************************************************************************
MessagePump.prototype.EventsToSend = function()
{
  // Se devo fare il redirect, non mando piu' niente
  if (RD3_DesktopManager && RD3_DesktopManager.WebEntryPoint && RD3_DesktopManager.WebEntryPoint.Redirecting) 
    return false;
  //
  // Se sono OFFLINE, giro subito gli eventi all'OWAManager
  if (this.OWAMessagePump)
    return true;
  //
	// Ogni evento controlla se e' passato abbastanza tempo
	// per poter essere lanciato-
	var n = this.EventQueue.length;
	var d = new Date();
	for (var i=0; i<n; i++)
	{
		if (this.EventQueue[i].CanBeFired(d))
			return true;
	}	
	return false;
}


// *********************************************************************************************
// Ritorna True se c'e' in coda un evento relativo all'oggetto
// *********************************************************************************************
MessagePump.prototype.GetEvent = function(obj,evt)
{
	var id = obj.Identifier?obj.Identifier:obj;
	var n = this.EventQueue.length;
	for (var i=0; i<n; i++)
	{
		var ev = this.EventQueue[i];
		if ((ev.ObjId==id || id=="") && (!evt || evt==ev.Tipo))
			return ev;
	}	
}


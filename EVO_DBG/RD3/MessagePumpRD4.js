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
function MessagePumpRD4()
{
  this.Requests = new HashTable(true);  // Lista delle delle richieste (con elenco item attivato)
  this.Responses = new Array();  // Coda delle risposte arrivate
  this.EventQueue = new Array(); // Coda degli eventi che devono essere inviati al server
  this.RequestNumber = 1;
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
}
  
// ************************************************
// Aggiunge un evento alla coda locale degli eventi
// che verra' poi inviata al server. Restituisce TRUE
// se l'evento e' stato aggiunto oppure FALSE se non e'
// stato possibile farlo. La coda infatti potrebbe essere
// bloccata a causa di una richiesta sincrona
// ************************************************
MessagePumpRD4.prototype.AddEvent = function(evento)
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
MessagePumpRD4.prototype.SendEvents = function()
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
MessagePumpRD4.prototype.GetRequest = function(reqcode)
{
  return this.Requests[reqcode];
}


// ************************************************
// Rimuove una richiesta dalla coda
// ************************************************
MessagePumpRD4.prototype.RemoveRequest = function(reqcode)
{
  this.Requests.remove(reqcode);
}


// *********************************************************************************************
// Gestione eventi periodici della coda dei messaggi
// *********************************************************************************************
MessagePumpRD4.prototype.Tick = function()
{
  // Vediamo se e' possibile inviare almeno una richiesta
  if (this.Requests.length < RD3_ClientParams.MaxOpenRequests)
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
    if (this.Requests.length > 0)
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
  if (this.Requests.length > 0)
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
}

// *********************************************************************************************
// Torna TRUE se ci sono richieste BLOCKING in corso
// *********************************************************************************************
MessagePumpRD4.prototype.IsBlocking = function()
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
MessagePumpRD4.prototype.SendRequest = function()
{
  // Verifico se ci sono eventi da lanciare
  if (this.EventQueue.length > 0)
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
    this.Requests.add("r"+rnd, req);
    //
    // Creo il documento XML da inviare al server
    var reqxml = this.CreateXMLDoc("rd3");
    var rootlist = reqxml.getElementsByTagName("rd3");
    var root = rootlist[0];
    root.setAttribute("num",  this.RequestNumber);
    this.RequestNumber++;
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
    // Invio la richiesta
    req.ID = "r" + rnd;
    req.Referrer = document.referrer;
    //
    if (reqxml.xml)
      req.InputStream = reqxml.xml // XML to String for IE
    else
      req.InputStream = new XMLSerializer().serializeToString(reqxml); // XML to String for Firefox,etc browsers
    //
    RD4_ApplicationManager.postMessage(req);
  }
}

// *****************************************************************
// Metodo chiamato da ogni richiesta al variare del suo stato: 
// se e' completa la accoda nella lista delle richieste completate
// ******************************************************************
MessagePumpRD4.prototype.CheckResponse = function(response)
{
  var req = this.GetRequest(response.Request.ID);
  //
  // Vediamo se la richiesta e' stata elaborata dal server
  if (req)
  {
    // Se la richiesta e' stata elaborata la aggiungo alla coda delle richieste da elaborare e chiamo la funzione di gestione
    if (response.responseXML)
    {
      req.responseXML = this.CreateXMLDoc("rd3");
      req.responseXML.loadXML(response.responseXML);
      req.responseText = response.responseXML;
    }
    else
      req.responseText = response.responseText;
    ///
    this.Responses.push(response.Request.ID);
    this.HandleResponses();
  }
}

// *****************************************************************************************
// Funzione di gestione delle richieste complete: se c'e' una animazione bloccante in corso 
// rimanda l'elaborazione delle richieste, altrimenti prende dalla coda la prima richiesta
// e la elabora
// *****************************************************************************************
MessagePumpRD4.prototype.HandleResponses = function()
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
        RD3_DesktopManager.ProcessResponseRD4(this.Responses[i]);
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
MessagePumpRD4.prototype.CreateRequest = function()
{
  return {};
}


// ********************************************************
// Metodo che crea un documento XML
// ********************************************************
MessagePumpRD4.prototype.CreateXMLDoc =  function(rootname) 
{
  var doc = null;
  //
  if (document.implementation && document.implementation.createDocument) 
  {
    // Creiamo il documento con il modello standard W3C (Chrome, Mozilla, Opera)
    doc = document.implementation.createDocument("", rootname, null);
    var dompi = doc.createProcessingInstruction("xml", "version='1.0' encoding='UTF-8'");
    doc.insertBefore(dompi, doc.firstChild);
    //
    // Implemento la loadXML
    if (Document.prototype.loadXML == undefined)
    {
      Document.prototype.loadXML = function(s)
      {
        try
        {
          // parse the string to a new doc
          var doc2 = (new DOMParser()).parseFromString(s, "text/xml");
          //
          // remove all initial children
          while (this.hasChildNodes())
            this.removeChild(this.lastChild);
          //
          // insert and import nodes
          for (var i = 0; i < doc2.childNodes.length; i++)
            this.appendChild(this.importNode(doc2.childNodes[i], true));
          //
          return true;
        }
        catch(e)
        {
          return false;
        }
      };
    }
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
MessagePumpRD4.prototype.EventsToSend = function()
{
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
MessagePumpRD4.prototype.GetEvent = function(obj,evt)
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

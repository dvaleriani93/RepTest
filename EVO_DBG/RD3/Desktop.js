// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Controller applicazione RD3
// ************************************************


// *******************************************************
// Variabili globali per la gestione dell'RD3
// queste variabili sono globali, visibili a tutto il
// codice Javascript del framework e non
// *******************************************************
var RD3_DesktopManager; // L'istanza del controller del desktop con cui tutti possono interagire
var RD3_Glb;            // Costanti globali
var RD3_ClientParams;   // Parametri del client che non vengono comunicati dal server
var RD3_ClientEvents;   // Oggetto che gestisce le callback locali degli eventi
var RD3_GFXManager;     // Oggetto che gestisce gli effetti grafici visuali
var RD3_Debugger;       // Debugger locale
var RD3_DDManager;      // Gestione Drag & Drop
var RD3_KBManager;      // Gestione Tastiera e fuoco
var RD3_TooltipManager; // Gestione Tooltip
var RD3_ServerParams;   // Parametri del client che vengono comunicati dal server
var RD3_ShellObject;    // Interfaccia verso la shell

// ********************************************************
// Inizializzazione del RD3. Questa funzione viene chiamata
// all'avvio dell'applicazione e tutte le volte che l'utente
// richiede un refresh della pagina del browser
// ********************************************************
function InitRD3()
{
  // Se i cookie non sono abilitati non posso proseguire
  if (!navigator.cookieEnabled)
  {
    document.getElementById("wait-box-text").innerHTML = "Enable cookies to continue";
    return;
  }
  //
  // Se non sono una app embeddata
  if (window.top == window.self)
  {
    // Pulisco l'URL se per caso contiene ?IWLogin o quan'altro (se sono offline lascio passare i CMD)
    var p = window.location.href.indexOf('?');
    if (p != -1 && (!window.RD4_Enabled || window.location.href.substring(p, p+5).toUpperCase() != '?CMD='))
    {
      window.location.href = window.location.href.substring(0, p);
      return;
    }
  }
  //
  // Creo gli oggetti. Se erano gia' stati creati, 
  // le vecchie copie vengono perse.
  RD3_Glb = new GlobalObject();
  //
  // Spengo il controllo ortografico automatico su Chrome, Safari e IE11+
  if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari() || RD3_Glb.IsIE(11, true))
    document.body.setAttribute("spellcheck", "false");
  //
  // Controllo browser caso mobile
  if (RD3_Glb.IsMobile() && (!(RD3_Glb.IsWebKit() || RD3_Glb.IsIE(10, true))))
  {
    var msg = "<br><br>This application requires a mobile browser. Please install <a href='http://www.google.com/chrome'>Google Chrome</a> or <a href='http://support.apple.com/kb/DL1531'>Safari</a>.";
    msg += "<br><br>Questa applicazione richiede un browser mobile oppure <a href='http://www.google.com/chrome'>Google Chrome</a> o <a href='http://support.apple.com/kb/DL1531'>Safari</a>.";
    var box = document.getElementById("wait-box");
    box.className = "wait-box-error";
    box.innerHTML = msg;
    return;
  }
  //
  RD3_ClientParams = new ClientParams();
  RD3_ClientEvents = new ClientEvents();
  RD3_GFXManager = new GFXManager();
  RD3_DesktopManager = new DesktopManager();
  RD3_Debugger = new DebuggerManager();
  RD3_DDManager = new DDManager();
  RD3_ServerParams = new ServerParams();
  RD3_KBManager = new KBManager();
  RD3_TooltipManager = new TooltipManager();
  RD3_ShellObject = new Shell();
  //
  // su iOS7 serve anche height=device-height
  if (RD3_Glb.IsMobile() && (RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7)) && RD3_ShellObject.IsInsideShell())
  {
    var viewport = document.querySelector("meta[name=viewport]");
    var content = "width=device-width, height=device-height, minimum-scale=1, maximum-scale=1, user-scalable=no";
    if (RD3_Glb.IsIphone(12))
      content = "width=device-width, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
    viewport.setAttribute('content', content);
  }
  //
  // Controllo browser per app offline
  if (window.RD4_Enabled)
  {
    var ok = false;
    if (RD3_Glb.IsSafari() || RD3_Glb.IsChrome())       // Safari e Chrome vanno sempre bene
      ok = true;
    else if (RD3_Glb.IsMobile())  // Se non e' safari ne' chrome e l'app e' mobile devo essere dentro alla SHELL
      ok = RD3_ShellObject.IsInsideShell();
    else                          // Se non e' safari ne' chrome e l'app e' "desktop" il browser deve essere per forza essere una shell... non posso controllare IsInsideShell perche' non sempre funziona nelle app desktop offline
      ok = RD3_Glb.IsTouch();     // pero' posso controllare che sia un dispositivo touch
    //
    if (!ok)
    {
      var msg = "<br><br>This application is offline and requires a native shell, Chrome or <a href='http://support.apple.com/kb/DL1531'>Safari</a>.";
      msg += "<br><br>Questa applicazione &egrave; offline e richiede una shell nativa, Chrome oppure <a href='http://support.apple.com/kb/DL1531'>Safari</a>.";
      var box = document.getElementById("wait-box");
      box.className = "wait-box-error";
      box.innerHTML = msg;
      return;
    }
  }
  //
  // Inizializzo gli oggetti
  RD3_DesktopManager.Init();
  RD3_TooltipManager.Init();
  //
  // Eseguo inizializzazione personalizzata
  RD3_CustomInit();
  //
  // IE6 ha qualche problema con le multi-richieste
  if (RD3_Glb.IsIE(6))
    RD3_ClientParams.MaxOpenRequests = 1;
  //
  // Se sono offline e nell'URL c'e' CMD= lo passo all'applicazione
  if (window.RD4_Enabled)
  {
    var p = window.location.href.toUpperCase().indexOf('?CMD=');
    if (p != -1)
    {
      // Separo CMD e parametri
      var cmd = window.location.href.substring(p+5);
      var params = '';
      p = cmd.indexOf('&');
      if (p != -1)
      {
        params = cmd.substring(p+1);
        cmd = cmd.substring(0, p);
      }
      //
      // Se sono dentro alla shell, lo giro a lei che, a sua volta, lo gira al servizio
      // (operazione necessaria per le autenticazioni OAUTH tipo Dropbox, ...)
      if (RD3_ShellObject.IsInsideShell())
        RD3_ShellObject.SendCmd("SVCCMD", {URL:window.location.href, CMD:cmd, PARAMS:params});
      else
        RD3_SendCommand(cmd, params);
    }
  }
}

// ********************************************************
// Funzione da sovrascrivere in custom3.js per
// effettuare inizializzazione personalizzata
// ********************************************************
function RD3_CustomInit()
{
}

// ********************************************************
// Funzione da inviare comandi all'applicazione dall'esterno
// ********************************************************
function RD3_SendCommand(cmd, params)
{
  var s = cmd;
  if (params)
    s += "&" + params;
  var ev = new IDEvent("cmd", this.WebEntryPoint.Identifier, null, RD3_Glb.EVENT_ACTIVE, s);
}

// *****************************************************
// Classe DesktopManager
// Controller dell'applicazione RD3
// *****************************************************
function DesktopManager() 
{
  // Variabili del controller
  //
  this.TickID = 0;              // ID del timer che il controller riceve per la gestione di eventi periodici
  this.AppName = "";            // Nome dell'applicazione (usato per lo storage OWA)
  this.MessagePump = null;      // Oggetto che gestisce la comunicazione con il server RD3
  this.MessagePumpRD4 = null;   // Oggetto che gestisce la comunicazione con il server RD4
  this.WebEntryPoint = null;    // Root della gerarchia di oggetti (model) che descrivono l'UI locale
  this.ObjectMap = null;        // Mappa degli oggetti (model) utilizzata per accedere velocemente ad essi per ID
  this.PDFPrints = new Array(); // Elenco dei file PDF da trattare
  this.CurrentRequest = null;
  this.CurrentRequestBlocking = false;  // La richiesta che sto trattando attualmente e' bloccante?
}
  
// ******************************************
// Inizializzazione del controller
// ******************************************
DesktopManager.prototype.Init = function() 
{
  // Carico il JS giusto a seconda del browser
  if (RD3_Glb.IsFirefox())
    RD3_Glb.LoadJsCssFile("firefox.css");
  else if (RD3_Glb.IsTouch())
  {
    if (RD3_Glb.IsIE(10, true))
      RD3_Glb.LoadJsCssFile("ie10.css");
    if (RD3_Glb.IsEdge())
      RD3_Glb.LoadJsCssFile("edge.css");
    //
    if (!RD3_Glb.IsMobile() || RD3_Glb.IsSmartPhone())
      RD3_Glb.LoadJsCssFile("iphone.css");
    var newel = document.createElement("link")
    newel.setAttribute("rel", "apple-touch-icon")
    newel.setAttribute("href", "images/appicon.png")
    document.getElementsByTagName("head")[0].appendChild(newel);
    newel = document.createElement("link")
    newel.setAttribute("rel", "apple-touch-startup-image")
    if (RD3_Glb.IsIpad())
      newel.setAttribute("href", "images/startupipad.png")
    else
      newel.setAttribute("href", "images/startup.png")
    document.getElementsByTagName("head")[0].appendChild(newel);
    //
    if (RD3_Glb.IsAndroid())
    {
      if (RD3_Glb.IsAndroid(4,4,0))
        RD3_Glb.LoadJsCssFile("kitkat.css");
      else
        RD3_Glb.LoadJsCssFile("android.css");
    }
  }
  else if (RD3_Glb.IsSmartPhone())
  {
    if (RD3_Glb.IsIE(10, true))
      RD3_Glb.LoadJsCssFile("ie10.css");
    //
    RD3_Glb.LoadJsCssFile("iphone.css");
    if (RD3_Glb.IsChrome())
      RD3_Glb.LoadJsCssFile("chrome.css");
  }
  else if (RD3_Glb.IsSafari())
    RD3_Glb.LoadJsCssFile("safari.css");
  else if (RD3_Glb.IsChrome()) {
    RD3_Glb.LoadJsCssFile("chrome.css");
    //
    if (RD3_Glb.IsEdge())
      RD3_Glb.LoadJsCssFile("edge.css");
  }
  else if (RD3_Glb.IsIE(10, true))
    RD3_Glb.LoadJsCssFile("ie10.css");
  //
  // Attivo il timer che mi garantisce di poter agire mentre l'utente lavora
  // 15 ms e' il numero piu' compatibile fra i vari browsers
  this.TickID = setTimeout("RD3_DesktopManager.Tick()", 15);
  this.MessagePump = new MessagePump();
  this.MessagePumpRD4 = new MessagePumpRD4();
  this.ObjectMap = new HashTable();
  //
  // Mostro la progress di avvio applicazione
  var wb = document.getElementById("wait-box-text");
  if (wb)
  {
    wb.innerHTML = (RD3_StartAppMsg ? RD3_StartAppMsg : "Starting application...");
    Size = 0;
  }
  //
  // Calcolo il nome dell'applicazione
  var p1 = window.location.href.lastIndexOf('/');
  if (p1 > 1)
  {
    var p2 = window.location.href.lastIndexOf('/', p1-1);
    if (p2 > 1)
      this.AppName = window.location.href.substring(p2+1, p1);
  }
  //
  // Se c'e' lo start nel localStorage parto da li'
  var useOWA = false;
  try
  {
    if (window.localStorage && window.localStorage[this.AppName + "_start"])
      useOWA = true;
  }
  catch (e) { useOWA = false; }
  //
  if (useOWA)
  {
    this.MessagePump.OWAMessagePump = new OWAMessagePump();
    this.MessagePump.OWAMessagePump.restoreFromStorage();
  }
  else
  {
    // Se non richiesto, chiamo subito l'evento
    var start = new IDEvent("start", "", null, RD3_Glb.EVENT_ACTIVE);
  }
}


// ***************************************************
// Il server ha risposto ad un nostro evento con una
// nuova serie di eventi oppure con una gerarchia di
// oggetti. Aggiorniamo la UI locale in base a quello
// che e' avvenuto lato server.
// Il parametro Request rappresenta l'oggetto XMLRequest
// utilizzato per effettuare la chiamata AJAX.
// La struttura del documento ricevuto dal server e' la seguente:
// <rd3>
//   <start >
//     descrizione dell'intera UI locale
//   </start>
// <chg /> ogni nodo chg rappresenta il cambiamento di un'oggetto
// <chg />
// </rd3>
// ***************************************************
DesktopManager.prototype.ProcessResponse = function(reqcode)
{
  var start = new Date();
  //
  var req = this.MessagePump.GetRequest(reqcode);
  //
  // Vediamo se la richiesta e' stata elaborata dal server
  if (req && req.readyState == 4)
  {
    // Intanto la rimuovo perche' non devo piu' trattarla...
    this.MessagePump.RemoveRequest(reqcode);
    //
    // Se e' OK, la elaboro
    if (req.status == 200)
    {
      this.CurrentRequest = reqcode;
      this.SkipClearTempMessages = req.SkipClearTempMessages;
      //
      if (RD3_ClientParams.MaxOpenRequests==1)
        this.CurrentRequestBlocking = this.MessagePump.LastReqBlocking;
      else
        this.CurrentRequestBlocking = req.Blocking;
      //
      var xmldoc = req.responseXML;
      var ok = false;
      //
      if (xmldoc)  
        ok = this.ProcessXmlDoc(xmldoc);
      //
      var end = new Date();
      var reqStart = (RD3_ClientParams.MaxOpenRequests==1 ? this.MessagePump.LastReqStartTime : req.StartTime);
      defaultStatus = "Time: "+(start-reqStart)+" + "+(end-start)+" = "+(end-reqStart)+" ms";
      //
      // Se ci sono stati problemi... meglio ricaricare la pagina
      if (!ok)
      {
        // Vediamo perche' non ci sono riuscito. Se e' HTML, ricarico il tutto
        // altrimenti c'e' un errore
        if (req.responseText.toLowerCase().indexOf('<html')!=-1)
          window.location.reload(true);
        else
        {
          // IE non carica bene il documento XML se il server
          // non invia ContentType=text/xml o ContentType=application/xml... e a volte non succede!!!
          // Allora gli faccio ricaricare il documento mangiando l'intestazione del documento XML...
          if (RD3_Glb.IsIE() && xmldoc && xmldoc.childNodes && xmldoc.childNodes.length==0)
          {
            var xml = req.responseText;
            if (xml.indexOf("\n")!=-1)
              xml = xml.substring(xml.indexOf("\n")+1);
            //
            if (xmldoc.loadXML(xml))
              ok = this.ProcessXmlDoc(xmldoc);
          }
          //
          if (!ok)
          {
            // Se la risposta e' vuota
            if (req.responseText=="")
            {
              // Se sono su CHROME, so che puo' succedere... provo a 
              // risolvere il problema
              if (RD3_Glb.IsChrome())
                ok = this.FixChromeEmptyRequest(req);
              //
              // Se non sono riuscito a patchare do' l'errore
              if (!ok)
                alert('Internal browser error');
            }
            else
            {
              // Provo a rimuovere eventuali caratteri non ammessi nell'XML
              this.ProcessXmlText(this.RemoveInvalidCharacter(req.responseText));
            }
          }
        }
        //
        delete this.SkipClearTempMessages;
        //
        return ok;
      }
      //
      delete this.SkipClearTempMessages;
    }
    else
    {
      // C'e' stato un problema... Se l'applicazione gestisce l'OWA
      if (this.WebEntryPoint && this.WebEntryPoint.CanOWA)
      {
        // Se non sono ancora offline chiedo conferma all'utente...
        // Se sono gia' offline potrebbe essere successo che mi trovo qui perche'
        // c'erano 2 richieste in coda
        if (!this.MessagePump.OWAMessagePump && confirm(ClientMessages.WEP_OWA_CANOFF))
          this.MessagePump.OWAMessagePump = new OWAMessagePump();
        //
        // Se sono offline, giro all'offline manager i messaggi e finisco
        if (this.MessagePump.OWAMessagePump)
        {
          // Giro tutti gli eventi alll'handler OWA per informarlo che questa richiesta ha dato errore
          // Questi saranno eventi che inviero' al server appena torno online
          var n = req.sentEvents.length;
          for (var i=0; i<n; i++)
            this.MessagePump.OWAMessagePump.AddEvent(req.sentEvents[i]);
          //
          return true;
        }
        //
        // L'applicazione gestisce l'offline, ma l'utente non ha voluto andarci... continuo con la gestione normale
      }
      //
      // Calcolo il messaggio da mostrare
      var msg = 'Invalid response from server: ResponseCode = ' + req.status + ' - ' + req.statusText + '\n\nPress the OK button to retry.\n\nIf the problem persists contact Technical Support and report this problem';
      if (req.status == 12029 || (req.status==0 && RD3_Glb.IsTouch()))
        msg = ClientMessages.WEP_SRV_NOTFOUND;
      else if (req.status==0 && RD3_Glb.IsChrome()) // Chrome, delle volte, va in pappa
        msg = '';
      //
      // Se non devo chiedere nulla, o l'utente preme OK
      if (msg=='' || confirm(msg))
        window.location.reload(true);
      else if (RD3_ShellObject.IsInsideShell())
        window.close();
      //
      return false;
    }
  }
}


// ***************************************************
// Il server RD4 ha risposto ad un nostro evento con una
// nuova serie di eventi oppure con una gerarchia di
// oggetti. Aggiorniamo la UI locale in base a quello
// che e' avvenuto lato server.
// Il parametro Request rappresenta l'oggetto XMLRequest
// utilizzato per effettuare la chiamata AJAX.
// La struttura del documento ricevuto dal server e' la seguente:
// <rd3>
//   <start >
//     descrizione dell'intera UI locale
//   </start>
// <chg /> ogni nodo chg rappresenta il cambiamento di un'oggetto
// <chg />
// </rd3>
// ***************************************************
DesktopManager.prototype.ProcessResponseRD4 = function(reqcode)
{
  var start = new Date();
  //
  var req = this.MessagePumpRD4.GetRequest(reqcode);
  //
  // Vediamo se la richiesta e' stata elaborata dal server
  if (req)
  {
    // Intanto la rimuovo perche' non devo piu' trattarla...
    this.MessagePumpRD4.RemoveRequest(reqcode);
    //
    // Se e' OK, la elaboro
    this.CurrentRequest = reqcode;
    //
    if (RD3_ClientParams.MaxOpenRequests==1)
      this.CurrentRequestBlocking = this.MessagePumpRD4.LastReqBlocking;
    else
      this.CurrentRequestBlocking = req.Blocking;
    //
    var xmldoc = req.responseXML;
    var ok = false;
    //
    if (xmldoc)
      ok = this.ProcessXmlDoc(xmldoc);
    //
    var end = new Date();
    var reqStart = (RD3_ClientParams.MaxOpenRequests==1 ? this.MessagePumpRD4.LastReqStartTime : req.StartTime);
    defaultStatus = "Time: "+(start-reqStart)+" + "+(end-start)+" = "+(end-reqStart)+" ms";
    //
    // Se ci sono stati problemi...
    if (!ok)
    {
      // Vediamo perche' non ci sono riuscito. Se e' HTML, ricarico il tutto
      // altrimenti c'e' un errore
      if (req.responseText.toLowerCase().indexOf('<html')!=-1)
      {
        document.clear();
        document.write(req.responseText);
      }
      else
      {
        // Provo a rimuovere eventuali caratteri non ammessi nell'XML
        this.ProcessXmlText(this.RemoveInvalidCharacter(req.responseText));
      }
    }
    //
    return ok;
  }
}

// ***************************************************
// Processa un documento XML arrivato come risposta
// ***************************************************
DesktopManager.prototype.ProcessXmlDoc = function(xmldoc)
{
  var rootlist = xmldoc.getElementsByTagName("rd3");
  //
  // Se il file ricevuto non contiene RD3... forse e' vuoto
  // oppure e' un errore.
  var root = rootlist.item(0);
  if (!root || (root.firstChild && root.firstChild.tagName == "parsererror"))
  {
/*
    var res = confirm('Invalid response from server: can\'t find RD3 node\n\nPress the OK button to retry.\n\nIf the problem persists contact Technical Support and report this problem');
    if (res)
      window.location.reload(true);
*/
    //
    return false;
  }
  //
  // Blocco gli eventi di change in questa fase perche' se scattano degli eventi di change durante la gestione della risposta del
  // server non sono di sicuro dovuti all'utente, ma potrebbero essere degli eventi di cambiamento rimasti appesi ma gia' gestiti
  //(es: gestione layout automatica passando da qbe a data con F3 oppure tutte le gestioni delle FK)
  RD3_KBManager.StopChange = true;
  //
  // Invio messaggio a WEP per dire che sta per iniziare la gestione di una risposta del server
  if (this.WebEntryPoint)
    this.WebEntryPoint.BeforeProcessResponse();
  //
  // Gestione risposta
  var n = root.childNodes.length; 
  for (var i=0; i<n; i++)
  {
    // Estraggo gli eventi arrivati dal server, uno alla volta
    var evnode = root.childNodes[i];
    var evname = evnode.nodeName;
    //
    // In base al tipo di evento chiamo il relativo gestore
    switch (evname)
    {
      case "start":
        this.HandleStart(evnode);
      break;

      case "chg":
        this.HandleChange(evnode);
      break;

      case "ins":
        this.HandleInsert(evnode);
      break;

      case "del":
        this.HandleDelete(evnode);
      break;

      case "close":
        this.HandleClose(evnode);
      break;

      case "open":
        this.HandleOpen(evnode);
      break;

      case "activateform":
        this.HandleActivateForm(evnode);
      break;

      case "msgbox":
        this.HandleMessageBox(evnode);
      break;

      case "error":
        this.HandleError(evnode);
      break;

      case "redirect":
        this.HandleRedirect(evnode);
      break;

      case "opendoc":
        this.HandleOpenDocument(evnode);
      break;

      case "rcache":
        this.HandleResetCache(evnode);
      break;

      case "mulsel":
        this.HandleMultipleSelection(evnode);
      break;

      case "printpdf":
        this.HandlePdfPrint(evnode);
      break;

      case "popup":
        this.HandlePopup(evnode);
      break;

      case "preview":
        this.HandlePreview(evnode);
      break;

      case "traylet":
        this.HandleTraylet(evnode);
      break;

      case "focus":
        this.HandleFocus(evnode);
      break;

      case "exe":
        this.HandleExecute(evnode);
      break;

      case "sound":
        this.HandleSound(evnode);
      break;

      case "tooltip":
        RD3_TooltipManager.HandleTooltip(evnode);
      break;

      case "restip":
        RD3_TooltipManager.ResetTooltip(evnode);
      break;

      case "rstgrp":
        this.HandleResetGroups(evnode);
      break;

      case "expgrp":
        this.HandleExpandGroups(evnode);
      break;

      case "dbg":
        this.HandleDebug(evnode);
      break;

      case "shell":
        this.HandleShell(evnode);
      break;

      case "resetTree":
        this.HandleResetTree(evnode);
      break;

      case "searchval":
        this.HandleSearchValue(evnode);
      break;  

      case "edcmd":
        this.HandleEditorCommand(evnode);
      break;
    }
  }
  //
  // Invio messaggio a WEP per dire che e' terminata la gestione di una risposta
  if (this.WebEntryPoint)
    this.WebEntryPoint.AfterProcessResponse();
  //
  // Invio messaggio anche al dragdrop manager che puo' noascondere il clone
  // se era stato salvato
  RD3_DDManager.AfterProcessResponse();
  //
  RD3_KBManager.StopChange = false;
  //
  return true;
}


// ***************************************************
// Processa un testo XML arrivato come risposta
// ***************************************************
DesktopManager.prototype.ProcessXmlText = function(xmltext)
{
  // Creo un documento xml e poi lo processo
  var doc = null;
  //
  if (document.implementation && document.implementation.createDocument) 
  {
    // Creiamo il documento con il modello standard W3C (Chrome, Mozilla, Opera)
    doc = document.implementation.createDocument("", "", null);
    var parser=new DOMParser();
    doc=parser.parseFromString(xmltext,"text/xml");
  }
  else // Altrimenti lo creiamo con il metodo per IE
  { 
    doc = new ActiveXObject("MSXML2.DOMDocument"); 
    doc.async="false";
    doc.loadXML(xmltext);
  }
  //
  // Battezzo questa richiesta con un codice random: essendo arrivata dal flash non ha fatto il solito giro ajax ed 
  // e' di sicuro diversa da quella di prima; in questo modo riesco a gestire correttamente i messaggi temporanei
  var rnd = Math.floor(Math.random() * 1111111);
  this.CurrentRequest = "r"+rnd;
  //
  if (!this.ProcessXmlDoc(doc))
  {
    if (xmltext=="")
      alert('Empty XML response');
    else
      alert('Invalid XML format:\n\n' + xmltext);
  }
}


// **********************************************
// Lancia un evento generato localmente al server
// **********************************************
DesktopManager.prototype.AddEvent = function(Evento)
{
  if (window.RD4_Enabled)
    this.MessagePumpRD4.AddEvent(Evento);
  else
    this.MessagePump.AddEvent(Evento);
  //
  // Siccome ho aggiunto l'evento, e' meglio controllare il fuoco che potrebbe essersi perso
  // Lo faccio solo se l'evento non e' un evento di CHANGE... in quel caso non e' bene
  // ricontrollare il fuoco mentre scatta... per esempio nel caso di campi attivi se clicco
  // sulla toolbar puo' succedere di tutto: MouseDown/LostFocus/OnChange/AddEvent/KBManager.Tick e 
  // poiche' la tick fuoca l'active element non mi arriva il MouseUp ed il ToolbarClick del pannello.
  if (Evento.Tipo != "chg" && Evento.Tipo != "grlexp" && Evento.Tipo != "panscr" && Evento.Tipo != "fev" && Evento.Tipo != "fldlistvis")
    RD3_KBManager.CheckFocus = true;
}


// **********************************************
// Invia tutti gli eventi in sospeso al server
// **********************************************
DesktopManager.prototype.SendEvents = function(immediate)
{
  this.MessagePump.SendEvents();
  this.MessagePumpRD4.SendEvents();
  if (immediate)
  {
    this.MessagePump.Tick();
    this.MessagePumpRD4.Tick();
  }
}


// *****************************************************
// Evento periodico che da al controller la possibliita'
// di gestire operazioni periodiche
// *****************************************************
DesktopManager.prototype.Tick = function()
{
  // Su iOS7 sbaglia ad impostare lo scrollTop del body.. per sicurezza lo impostiamo noi al valore massimo giusto (altezza della tastiera)
  if ((RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7)) && RD3_Glb.IsMobile())
  {
    
    var portrait = window.orientation==0 || window.orientation == 180;
    //
    if (RD3_Glb.IsIpad(7))
    {
      var hkey = 395;
      if (RD3_Glb.IsIpad(8))
        hkey = 430;
      var pkey = 307;
      if (RD3_Glb.IsIpad(8))
        pkey = 342;
      //
      if (document.body.scrollTop>hkey && !portrait)
        document.body.scrollTop = hkey;
      if (document.body.scrollTop>pkey && portrait)
        document.body.scrollTop = pkey;
    }
    if (RD3_Glb.IsIphone(7))
    {
      var hkey = 206;
      if (RD3_Glb.IsIphone(8))
        hkey = 236;
      var pkey = 260;
      if (RD3_Glb.IsIphone(8))
        pkey = 290;
      //
      if (document.body.scrollTop>hkey && !portrait)
        document.body.scrollTop = hkey;
      if (document.body.scrollTop>pkey && portrait)
        document.body.scrollTop = pkey;
    }
  }
  //
  // Rigenero il timeout prima dell'esecuzione
  // Garantisce migliori prestazioni su IE
  this.TickID = setTimeout(function() { RD3_DesktopManager.Tick(); }, 15);
  //
  // Anche il gestiore della comunicazione con il server
  // deve gestire attivita' periodiche
  this.MessagePump.Tick();
  this.MessagePumpRD4.Tick();
  //
  // Faccio avanzare gli effetti grafici
  RD3_GFXManager.Tick();
  //
  // Controllo fuoco
  RD3_KBManager.Tick();
  //
  // Le azioni seguenti vengono eseguite solo se non ci
  // sono effetti grafici in essere.
  if (!RD3_GFXManager.Animating())
  {
    // Vediamo se devo stampare dei file PDF
    var n = this.PDFPrints.length;
    for (var i=n-1; i>=0; i--)
    {
      // Controllo se ha finito...
      if (this.PDFPrints[i].Tick())
      {
        // Lo rimuovo dall'elenco
        this.PDFPrints.splice(i,1);
      }
    }  
    //
    // Creazione prototipi visual styles e scroll del menu
    if (this.WebEntryPoint)
    {
      // Se e' realizzato, gli giro il TimerTick
      if (this.WebEntryPoint.Realized)
        this.WebEntryPoint.Tick();
      //
      this.WebEntryPoint.VSList.Tick();
      //
      this.WebEntryPoint.ScrollingMenu();
    }
  }
}


// ***************************************************************
// Gestore dell'evento di start: ricrea l'intero albero degli oggetti
// rimuovendo prima tutti gli oggetti eventualmente presenti sia
// dal modello UI in memoria, sia dal DOM del browser
// ***************************************************************
DesktopManager.prototype.HandleStart = function(node)
{
  // Se questa e' la risposta di attivazione dell'OfflineMode (OWA)
  // la memorizzo nel localStorage
  if (node.getAttribute("owa") == "1")
  {
    if (window.localStorage)
    {
      // Memorizzo la richiesta senza l'attributo OWA
      node.removeAttribute("owa");
      //
      var xml = (RD3_Glb.IsIE() ? node.ownerDocument.xml : (new XMLSerializer()).serializeToString(node.ownerDocument));
      window.localStorage[this.AppName + "_start"] = xml;
    }
    else
      alert('This browser does not support offline mode');
    //
    // e poi riavvio l'applicazione che partira' in modalita' offline se possibile
    window.location.reload(true);
    return;
  }
  //
  // Se c'era gia' un modello in memoria, lo informo che sta per
  // essere distrutto
  if (this.WebEntryPoint!=null)
  {
    this.WebEntryPoint.Unrealize();
  }
  //
  // Creo il nuovo modello in memoria
  this.WebEntryPoint = new WebEntryPoint();
  //
  // Sto gestendo una chiamata dal server.
  this.WebEntryPoint.InResponse = true;
  //
  // Carico dal file XML arrivato dal server la gerarchia degli oggetti UI
  if(node.hasChildNodes())
  {
    var wepn = node.childNodes[0];
    //
    // IE e FFX caricano in modo diverso il file XML, in particolare
    // FFX considera gli acapo come nodi testo, che devono essere saltati
    // fino a prendere il primo element
    if (wepn.nodeType != 1)
      wepn = node.childNodes[1];
    //
    this.WebEntryPoint.LoadFromXml(wepn);
  }
  //
  // Al termine del caricamento del modello, gli oggetti devono creare
  // i corrispondenti oggetti DOM e poi eseguire l'adattamento del layout
  this.WebEntryPoint.Realize(document.body);
  this.WebEntryPoint.AfterStart = true;  
  //
  // Se sono dentro alla shell, la informo che il servizio e' partito
  if (RD3_ShellObject.IsInsideShell())
    RD3_ShellObject.SendCmd("SERVICESTARTED");
}


// ***************************************************************
// Gestore dell'evento lato server che comunica il cambiamento di
// una proprieta' di un oggetto del modello
// ***************************************************************
DesktopManager.prototype.HandleChange = function(node)
{
  // Cerco l'oggetto dentro la mappa
  var chgid = node.getAttribute("id");
  var obj = this.ObjectMap[chgid];
  //
  // Se c'e' gli dico di cambiare
  if(obj!=null)
    obj.ChangeProperties(node);
}


// ***************************************************************
// Gestore dell'evento lato server che comunica l'inserimento di
// un nuovo oggetto
// ***************************************************************
DesktopManager.prototype.HandleInsert = function(node)
{
  // Cerco l'oggetto dentro la mappa
  var parid = node.getAttribute("parid");
  var parobj = this.ObjectMap[parid];
  //
  if (parid=="cmh")
    parobj = this.WebEntryPoint.CmdObj;
  else if (parid=="tmh")
    parobj = this.WebEntryPoint.TimerObj;
  else if (parid=="inh")
    parobj = this.WebEntryPoint.IndObj;
  //
  // Se c'e' gli dico di cambiare
  if (parobj!=null)
    parobj.InsertChild(node);
}

// ***************************************************************
// Gestore dell'evento lato server che comunica il cambiamento di
// una proprieta' di un oggetto del modello
// ***************************************************************
DesktopManager.prototype.HandleDelete = function(node)
{
  // Cerco l'oggetto dentro la mappa
  var delid = node.getAttribute("id");
  var obj = this.ObjectMap[delid];
  //
  // Se c'e' gli dico di morire
  if(obj!=null)
  {
    // Se deve fare qualcosa prima di morire glielo faccio fare
    if (obj.OnDeleteObject)
      obj.OnDeleteObject();
    //
    // Ora muore!
    obj.Unrealize();
  }
}


// ***************************************************************
// Gestore dell'evento lato server che comunica la chiusura di
// una form
// ***************************************************************
DesktopManager.prototype.HandleClose = function(node)
{
  // Chiedo al webentrypoint di farlo
  var id = node.getAttribute("id");
  this.WebEntryPoint.CloseForm(id);
}


// ***************************************************************
// Apre una message box
// ***************************************************************
DesktopManager.prototype.HandleMessageBox = function(node)
{
  var text = node.getAttribute("id");
  var type = node.getAttribute("type");
  var options = node.getAttribute("opts");
  var voice = node.getAttribute("voice");
  //
  // Se e' una messagebox conseguente ad un comando vocale, passo l'informazione al VoiceObj
  if (voice && type == "0")   // Vera Message box con comandi vocali
  {
    this.WebEntryPoint.VoiceObj.HandleMessageBox(text, parseInt(type), options);
  }
  else
  {
    var m = new MessageBox(text, parseInt(type), true, options);
    //
    m.Blocking = this.CurrentRequestBlocking;
    //
    // Se devo fuocare qualcuno, posticipo l'apertura della MessageBox
    // perche' durante l'apertura della MessageBox vado a guardare l'activeElement
    if (RD3_KBManager.FocusFieldTimerId)
    {
      this.MB2Open = m;
      window.setTimeout("RD3_DesktopManager.MB2Open.Open();RD3_DesktopManager.MB2Open = null;", 20);
    }
    else
      m.Open();
    //
    // Se e' una messagebox conseguente ad un comando vocale, passo la messagebox al VoiceObj
    // In questo modo, se l'operatore parlera', il VoiceObj potra' operare sulla MessageBox
    if (voice)
      this.WebEntryPoint.VoiceObj.HandleMessageBox(text, parseInt(type), options, m);
  }
}


// ***************************************************************
// Apre la popup degli errori
// ***************************************************************
DesktopManager.prototype.HandleError = function(node)
{
  // Chiedo al popupframe di farlo
  if (RD3_Glb.IsMobile())
  {
    var title = node.getAttribute("hdr");
    var text = node.getAttribute("des");
    //
    var m = new MessageBox(text, RD3_Glb.MSG_BOX);
    m.Open();
    m.CaptionBox.innerHTML = title;
  }
  else
  {
    var m = new PopupError(node);
    m.Open();
  }
}


// ***************************************************************
// Gestore dell'evento lato server che comunica
// l'apertura di una form
// ***************************************************************
DesktopManager.prototype.HandleOpen = function(node)
{
  // Dentro all'evento c'e' la definizione della form
  var objlist = node.childNodes;
  var n = objlist.length;
  //
  // Ci dovrebbe essere solo una form, ma intanto che ci sono carico tutto
  // Ciclo su tutti i nodi che rappresentano oggetti figli
  for (var i=0; i<n; i++) 
  {
    var objnode = objlist.item(i);
    var nome = objnode.nodeName;
    //
    // In base al tipo di oggetto, invio il messaggio di caricamento
    switch (nome)
    {
      case "frm":
      {
        this.WebEntryPoint.OpenForm(objnode,parseInt(node.getAttribute("openas")));
      }
      break;        
    }
  }
}


// ***************************************************************
// Gestore dell'evento lato server che comunica l'attivazione 
// di una form
// ***************************************************************
DesktopManager.prototype.HandleActivateForm = function(node)
{
  // Chiedo al webentrypoint di farlo
  var id = node.getAttribute("id");
  this.WebEntryPoint.ActivateForm(id);
}


// **********************************************
// Gestisce comando di redirect
// **********************************************
DesktopManager.prototype.HandleRedirect = function(node)
{
  var url = node.getAttribute("id");
  if (this.WebEntryPoint)
    this.WebEntryPoint.Redirecting = true;
  //
  var fx = new GFX("redirect", true, document.body, false);
  fx.Url = url;
  //
  // Blocco tutte le animazioni pendenti
  RD3_GFXManager.FinishAllGFX();
  RD3_GFXManager.AddEffect(fx);
  if (this.WebEntryPoint)
    this.WebEntryPoint.SoundAction("logoff","play");
  //
  // Non accetto altre animazioni
  RD3_GFXManager.StopAnimation = true;
}


// **********************************************
// Gestisce comando di Open Document
// **********************************************
DesktopManager.prototype.HandleOpenDocument = function(node)
{
  var url = node.getAttribute("id");
  var fea = node.getAttribute("fea");
  if (fea==undefined || fea==null)
    fea="";
  this.OpenDocument(url, "", fea);
}


// **********************************************
// Gestisce comando di Reset Cache
// **********************************************
DesktopManager.prototype.HandleResetCache = function(node)
{
  var id = node.getAttribute("id");
  //
  // Chiamo la ResetCache sull'oggetto
  this.CallEventHandler(id, "ResetCache", null, node);
}

// **********************************************
// Gestisce comando di Reset di un albero
// **********************************************
DesktopManager.prototype.HandleResetTree = function(node)
{
  var id = node.getAttribute("id");
  //
  // Chiamo la ResetTree sull'oggetto
  this.CallEventHandler(id, "ResetTree", null, node);
}

// *******************************************************
// Gestisce comando di Reset dei gruppi di un pannello
// *******************************************************
DesktopManager.prototype.HandleResetGroups = function(node)
{
  var id = node.getAttribute("id");
  //
  // Chiamo la ResetGroups sull'oggetto
  this.CallEventHandler(id, "ResetGroups", null, node);
}

// *******************************************************
// Gestisce comando di Espansione di un gruppo in lista
// *******************************************************
DesktopManager.prototype.HandleExpandGroups = function(node)
{
  var id = node.getAttribute("id");
  var exp = node.getAttribute("exp");
  //
  // Chiamo la SetExpanded sull'oggetto
  this.CallEventHandler(id, "SetExpandedEx", null, (exp==1));
}

// **********************************************
// Gestisce comando di Reset Cache
// **********************************************
DesktopManager.prototype.HandleMultipleSelection = function(node)
{
  var id = node.getAttribute("id");
  //
  // Chiamo la ResetCache sull'oggetto
  this.CallEventHandler(id, "MultipleSelection", null, node);
}


// **********************************************
// Gestisce comando di Open Document
// **********************************************
DesktopManager.prototype.HandlePdfPrint= function(node)
{
  // Creo e aggiungo alla lista l'oggetto PDF da stampare...
  var p = new PDFPrint(node);
  this.PDFPrints.push(p);
}


// **********************************************
// Gestisce comando di Open Document
// **********************************************
DesktopManager.prototype.HandlePopup = function(node)
{
  // Prelevo il command set
  var id = node.getAttribute("id");
  var obj = this.ObjectMap[id];
  //
  // Apro il popup
  if (obj)
    obj.Popup(node);
}


// **********************************************
// Gestisce comando di Open Preview Popup
// **********************************************
DesktopManager.prototype.HandlePreview = function(node)
{
  // Prelevo l'url da aprire e il testo della caption
  var addr = node.getAttribute("addr");
  var capt = node.getAttribute("capt");
  //
  // Apro la finestra
  var m = new PopupPreview(addr, capt);
  m.Open();
}


// **********************************************
// Gestisce comando di refresh traylet
// **********************************************
DesktopManager.prototype.HandleTraylet = function(node)
{
  // Prelevo il comando
  var cmd = node.getAttribute("id");
  var ifr = '<iframe id=traylet style="width:1px;height:1px" src="' + cmd + '"></iframe>';
  //
  // lo invio alla traylet
  this.WebEntryPoint.TrayletBox.innerHTML = ifr;
}

// **********************************************
// Gestisce comando di fuocatura campo
// **********************************************
DesktopManager.prototype.HandleFocus = function(node)
{
  var sels = node.getAttribute("sels");
  //
  if (sels && sels!="")
  {
    var sele = node.getAttribute("sele");
    //
    this.SelSt = sels;
    this.SelEn = sele;
    this.SelFld = node.getAttribute("id");
  }
  //
  // Adatto la riga arrivata dal server nel caso di pannelli gruppati
  var obj = this.ObjectMap[node.getAttribute("id")];
  var clientRow = node.getAttribute("row");
  var absRow = node.getAttribute("absrow");
  if (obj && obj.TranslateServerRow)
    clientRow = obj.TranslateServerRow(clientRow, absRow);
  //
  this.HandleFocus2(node.getAttribute("id"), clientRow);
}

DesktopManager.prototype.HandleFocus2 = function(id, row)
{
  // Segnalo che per questa richiesta il fuoco e' gia' gestito
  if (this.WebEntryPoint && this.WebEntryPoint.InResponse)
    RD3_KBManager.DontCheckFocus = true;
  if (RD3_KBManager.FocusFieldTimerId)
    window.clearTimeout(RD3_KBManager.FocusFieldTimerId);
  RD3_KBManager.FocusFieldTimerId = 0;
  //
  // Se il webbox e' ancora nascosto, devo aspettare un po' di piu'
  if (this.WebEntryPoint && this.WebEntryPoint.Realized && this.WebEntryPoint.WepBox.style.visibility=="hidden")
  {
    // Dico al manager delle animazioni la stringa da impostare, poi ci pensa lui alla fine dell'animazione..
    RD3_GFXManager.FocusFldId = id;
    RD3_GFXManager.FocusFldRow = row;
    //
    return;
  }
  //
  // Attivo l'oggetto (dopo aver eseguito tutto lo script...)
  RD3_KBManager.FocusFieldTimerId = window.setTimeout(function() 
  {
    RD3_KBManager.FocusFieldTimerId = 0;
    RD3_DesktopManager.CallEventHandler(id, 'Focus', null, row); 
  }, 10);
}

// **********************************************
// Gestisce comando di esecuzione js
// **********************************************
DesktopManager.prototype.HandleExecute = function(node)
{
  var cmd = node.getAttribute("cmd");
  //
  // Se il comando inizia con * lo aggiungo alla lista dei comandi ritardati, altrimenti lo eseguo subito.
  if (cmd.indexOf('*')==0)
    this.WebEntryPoint.ExecuteRitardati.push(cmd.substring(1));
  else
  {
    try
    {
      eval(cmd);
    }
    catch (e)
    {
      console.error(e);
    }
  }
}

// **********************************************
// Apertura debug da RD4
// **********************************************
DesktopManager.prototype.HandleDebug = function(node)
{
  var sess = node.getAttribute("SESS");
  var dbgWin = null;
  //
  var usePopupFrame = (RD3_Glb.IsTouch() || RD3_ShellObject.IsInsideShell());
  if (sess != "" && sess != null)
  {
    var create = false;
    if (!this.WebEntryPoint[sess+"Dbg"])
      create = true;
    if (!create && (usePopupFrame && !this.WebEntryPoint[sess+"Dbg"].Realized))
      create = true;
    if (!create && (!usePopupFrame && this.WebEntryPoint[sess+"Dbg"].closed))
      create = true;
    //
    if (create)
    {
      if (usePopupFrame)
      {
        this.WebEntryPoint[sess+"Dbg"] = new PopupPreview("", "SESSION "+ sess);
        this.WebEntryPoint[sess+"Dbg"].AutoClose = true;
        this.WebEntryPoint[sess+"Dbg"].DebugPreview = true;
        this.WebEntryPoint[sess+"Dbg"].Realize("-popover");
        this.WebEntryPoint[sess+"Dbg"].PreviewFrame.contentWindow.name = "DTTSESSNAME"+sess;
        this.WebEntryPoint[sess+"Dbg"].Open();
      }
      else
      {
        this.WebEntryPoint[sess+"Dbg"] = window.open("","DTTSESSNAME"+sess);  
      }
    }
    //
    dbgWin = usePopupFrame ? this.WebEntryPoint[sess+"Dbg"].PreviewFrame.contentWindow : this.WebEntryPoint[sess+"Dbg"];
  }
  else
  {
    var create = false;
    if (this.WebEntryPoint.dbgWindow==null)
      create = true;
    if (!create && (usePopupFrame && !this.WebEntryPoint.dbgWindow.Realized))
      create = true;
    if (!create && (!usePopupFrame && this.WebEntryPoint.dbgWindow.closed))
      create = true;
    //
    if (create)
    {
      // Su Touch devo usare il popupFrame
      if (usePopupFrame)
      {
        this.WebEntryPoint.dbgWindow = new PopupPreview("", "DEBUG");
        this.WebEntryPoint.dbgWindow.AutoClose = true;
        this.WebEntryPoint.dbgWindow.DebugPreview = true;
        this.WebEntryPoint.dbgWindow.Realize("-popover");
        this.WebEntryPoint.dbgWindow.PreviewFrame.contentWindow.name = "DTT";
        this.WebEntryPoint.dbgWindow.Open();
      }
      else
      {
        this.WebEntryPoint.dbgWindow = window.open("","DTTWINDOW");
      }
    }
    //
    dbgWin = usePopupFrame ? this.WebEntryPoint.dbgWindow.PreviewFrame.contentWindow : this.WebEntryPoint.dbgWindow;
  }
  //
  var content = node.getAttribute("main");
  if (content)
  {
    dbgWin.document.close();
    dbgWin.document.write(content);
    if (usePopupFrame)
      this.WebEntryPoint.dbgWindow.OnReadyStateChange();
  }
  //
  var itl = node.getAttribute("ItemList");
  var cmf = node.getAttribute("CmdForm");
  var dtl = node.getAttribute("Detail");
  var rqt = node.getAttribute("ReqTop");
  var rqr = node.getAttribute("ReqRef");
  var rqp = node.getAttribute("ReqPrc");
  //
  if (dbgWin.frames)
  {
    for (var i=0; i<dbgWin.frames.length; i++)
    {
      var fr = dbgWin.frames[i];
      if (fr.name=="ItemList" && itl)
      {
        fr.document.close();
        fr.document.write(itl);
      }
      if (fr.name=="CmdForm" && cmf)
      {
        fr.document.close();
        fr.document.write(cmf);
      }
      if (fr.name=="Detail")
      {
        if (dtl)
        {
          fr.document.close();
          fr.document.write(dtl);
        }
        //
        for (var j=0; j<fr.frames.length; j++)
        {
          var fr2 = fr.frames[j];
          //
          if (fr2.name=="ReqTop" && rqt)
          {
            fr2.document.close();
            fr2.document.write(rqt);
          }
          if (fr2.name=="ReqRef" && rqr)
          {
            fr2.document.close();
            fr2.document.write(rqr);
          }
          if (fr2.name=="ReqPrc" && rqp)
          {
            fr2.document.close();
            fr2.document.write(rqp);
          }
        }
      }
    }
  }
}


// **********************************************
// Interfaccia verso la shell
// **********************************************
DesktopManager.prototype.HandleShell = function(node)
{
  var cmd = node.getAttribute("cmd");
  var par = node.getAttribute("params");
  if (RD3_ShellObject.IsInsideShell())
  {
    var resp = RD3_ShellObject.SendCmd(cmd, par);
    //
    // Invio la risposta al server
    if (resp)
      var ev = new IDEvent("shell", "", null, RD3_Glb.EVENT_ACTIVE, "shell", cmd, par, resp);
  }
}

// **********************************************
// Gestione della search box mobile
// **********************************************
DesktopManager.prototype.HandleSearchValue = function(node)
{
  var idFr = node.getAttribute("id");
  var sbVal = node.getAttribute("val");
  //
  // Accedo all'oggetto
  var obj = this.ObjectMap[idFr];
  //
  // Verifico se esiste l'oggetto e se esiste la funzione
  if (obj!=null && obj.SetSearchBoxValue)
    obj.SetSearchBoxValue(sbVal);
}

// **********************************************
// Gestione dei comandi dell'editor lato server
// **********************************************
DesktopManager.prototype.HandleEditorCommand = function(node)
{
  var idFr = node.getAttribute("id");
  var cmd = node.getAttribute("CMD");
  var cmdVal = node.getAttribute("VAL");
  var restSel = (node.getAttribute("RES")=="-1");
  //
  // Accedo all'oggetto
  var obj = this.ObjectMap[idFr];
  //
  // Verifico se esiste l'oggetto e se esiste la funzione
  if (obj!=null && obj.OnServerEditorCommand)
    obj.OnServerEditorCommand(cmd, cmdVal, restSel);
}

// ********************************************************************************
// Invoca l'event handler sull'oggetto rappresentato dal parametro ID
// parametro: un eventuale parametro da passare all'EvHandler (puo' essere tralasciato)
// *********************************************************************************
DesktopManager.prototype.CallEventHandler = function(id, ehname, evento, parametro)
{
  var eve = window.event ? window.event : evento;
  //
  // A volte evento contiene oggetti, oppure elementi
  if (evento && (evento.tagName || evento.Identifier))
    eve = evento;
  //
  // Accedo all'oggetto
  var obj = this.ObjectMap[id];
  //
  // Verifico se esiste l'oggetto e se esiste la funzione
  if (obj!=null)
  {
    var funct = obj[ehname];
    if (funct!=null)
    {
      // Invoco la funzione
      return funct.call(obj, eve, parametro);
    }
  }
}


// **********************************************
// Gestisce apertura di nuova finestra documento
// **********************************************
DesktopManager.prototype.OpenDocument = function(docurl, docname, features)
{
  var newdoc = window.open(docurl, docname, features);
  //
  // Non e' detto che sia stata aperta una nuova finestra del browser
  // ad esempio se l'url inizia con "mailto:"
  if (newdoc)
  {
    try
    {
      newdoc.focus();
    }
    catch(ex)
    {}
  }
  else if (!RD3_Glb.IsIE(10, false))
  {
    // Se la finestra e' stata bloccata, la apro con un redirect
    var ok = docurl.indexOf("mailto:")==-1;
    //
    if (ok)
    {
      if (RD3_ClientParams.RedirectWhenBlocked)
      {
        // Eseguo una ridirect secca
        document.location.assign(docurl);
      }
      else
      {
        if (RD3_ClientParams.AlertWhenBlocked)
        {
          var m = new MessageBox(ClientMessages.WEP_POPUP_Blocked, RD3_Glb.MSG_BOX, false);
          m.Open();
        }
      }
    }
  }
}


// **********************************************
// Gestione del bug di connessione di CHROME (EmptyRequest)
// **********************************************
DesktopManager.prototype.FixChromeEmptyRequest = function(req)
{
  // Invio una richiesta di resend al volo
  var ResendReq = this.MessagePump.CreateRequest();
  ResendReq.StartTime = new Date();
  ResendReq.ID = -req.ID;
  //
  // Creo il documento XML da inviare al server
  var reqxml = this.MessagePump.CreateXMLDoc("rd3");
  var rootlist = reqxml.getElementsByTagName("rd3");
  var root = rootlist[0];
  //
  // Inserisco la richiesta di RESEND
  var myNode = reqxml.createElement("resend");
  root.appendChild(myNode);              
  //
  // Faccio MAX 5 giri
  var giro = 1;
  while (giro<=5)
  {
    // Invio la richiesta
    ResendReq.open("POST", this.MessagePump.ServerURL, false);
    ResendReq.setRequestHeader("Content-Type", "text/xml");
    ResendReq.send(reqxml);
    //
    // Se ho ottenuto una risposta, la gestisco e se ci riesco
    // ho finito
    if (ResendReq.responseXML && this.ProcessXmlDoc(ResendReq.responseXML))
      return true;
    //
    // Niente da fare... altro tentativo
    giro++;
  }
  //
  // Niente da fare!
  return false;
}


// ***************************************************************
// Gestisce un azione su un suono
// ***************************************************************
DesktopManager.prototype.HandleSound = function(node)
{
  var name = node.getAttribute("id");
  var action = node.getAttribute("action");
  var volume = node.getAttribute("volume");
  if (volume!=null)
    volume=parseInt(volume);
  var t1 = node.getAttribute("t1");
  if (t1!=null)
    t1=parseInt(t1);
  var t2 = node.getAttribute("t2");
  if (t2!=null)
    t2=parseInt(t2);    
  var nof = node.getAttribute("notify")=="1";
  var nop = node.getAttribute("progress")=="1";
  var vid = node.getAttribute("video");
  if (vid!=null)
  {
    // Specificato video: azione differita per consentire agli oggetti di spostarsi prima che
    // si apra il video stesso
    var s = "RD3_DesktopManager.WebEntryPoint.SoundAction('"+name+"','"+action+"',"+volume+","+t1+","+t2+","+nof+","+nop+",'"+vid+"')";
    window.setTimeout(s,10);
  }
  else
  {
    // Azione diretta
    this.WebEntryPoint.SoundAction(name,action,volume,t1,t2,nof,nop);
  }
}

// ***************************************************************
// Metodo per rimuovere caratteri non ammessi da un XML
// http://www.w3.org/TR/2006/REC-xml-20060816/#charsets
// ***************************************************************
DesktopManager.prototype.RemoveInvalidCharacter = function(value)
{
  for (var i = 0; i < value.length; i++)
  {
    var ch = value.charAt(i);
    if (ch == '&' && i < value.length - 1 && value.charAt(i + 1) == '#')
    {
      var j = i;
      //
      // Cerco il ; e memorizzo quanto ho visto fin'ora
      var sb = "";
      for (i += 2; i < value.length; i++)
      {
        if (value.charAt(i) != ';')
          sb += value.charAt(i);
        else
          break;
      }
      //
      var c = "";
      if (sb.charAt(0) == "x")
        c = parseInt(sb.substr(1), 16);
      else
        c = parseInt(sb, 10);
      //
      if (!(c == 0x9 || c == 0xA || c == 0xD || (c >= 0x20  & c <= 0xD7FF) || (c >= 0xE000 && c <= 0xFFFD))) // | [#x10000-#x10FFFF]
      {
        value = value.substr(0, j) + value.substr(i + 1);
        i -= 2 + sb.length + 1;
      }
    }
  }
  //
  return value;
}

// ********************************************************
// Inizializzazione del RD4. Questa funzione viene chiamata
// all'avvio dell'applicazione e tutte le volte che l'utente
// richiede un refresh della pagina del browser
// ********************************************************
function InitRD4()
{
  // Controllo browser caso RD4
  if (!self.Worker)
  {
    var msg = "<br><br>This application requires a webkit browser. Please install <a href='http://www.google.com/chrome'>Google Chrome</a> or <a href='http://www.apple.com/safari'>Safari</a>.";
    msg += "<br><br>Questa applicazione richiede un browser webkit. Si prega di installare <a href='http://www.google.com/chrome'>Google Chrome</a> o <a href='http://www.apple.com/it/safari'>Safari</a>.";
    var box = document.getElementById("wait-box");
    box.className = "wait-box-error";
    box.innerHTML = msg;
    return;
  }
  //
  window.RD4_Enabled = true;
  //
  // Eseguo l'applicazione RD4 nel worker
  window.RD4_ApplicationManager = new Worker("?WCI=RD3&WCE=GZ&FN=JScript/full.js");
  window.RD4_ApplicationManager.onmessage = OnWorkerMessage;
  window.RD4_ApplicationManager.onerror = OnWorkerError;
  //
  // Tengo una mappa delle Server Session
  window.ServerSessions = new HashTable();
  //
  GlobalObject.SendCookies();
  //
  // Se ho dei comandi da eseguire subito dopo la creazione del worker, li invio ora
  if (window.RD4_PreInit)
  {
    for (var i=0; i<window.RD4_PreInit.length; i++)
      ExecuteOnWorker(window.RD4_PreInit[i]);
  }
  //
  // Inizializzo l'RD3
  InitRD3();
}

function InitServerSession(name)
{
  // Se sono dentro alla shell, avviso che sto per avviare un nuovo worker
  if (RD3_ShellObject.IsInsideShell())
    RD3_ShellObject.SendCmd("NEWSS", {NAME:name});
  //
  // Eseguo la Server Session in un worker ...
  var ss = new Worker("?WCI=RD3&WCE=GZ&FN=JScript/full.js");
  ss.onmessage = OnWorkerMessage;
  ss.onerror = OnWorkerError;
  //
  // ... e la aggiungo alla mappa
  ServerSessions[name] = ss;
  //
  // Se la shell mi ha dato del lavoro da fare eseguire alla server session, glielo faccio eseguire
  if (RD3_ShellObject.IsInsideShell() && window.RD4_PreInit)
  {
    for (var i=0; i<window.RD4_PreInit.length; i++)
      ss.postMessage({ type : 'EXEC', message : window.RD4_PreInit[i] });
  }
}

// ********************************************************
// Ricezione di un messaggio dal worker.
// ********************************************************
function OnWorkerMessage(message)
{
  switch (message.data.type)
  {
    case "debug":
      WriteToConsole(message.data.message, message.data.channel);
      break;

    case "progress":
      RD4_ApplicationManager.progress = message.data.message;
      break;

    case "SSM": // Messaggi da girare alle Server Session
    {
      switch (message.data.message)
      {
        case "Start":
        {
          InitServerSession(message.data.name);
          ServerSessions[message.data.name].postMessage(message.data);
          break;
        }
          
        case "End":
        {
          if (message.data.kill)
            ServerSessions[message.data.name].terminate();
          else
            ServerSessions[message.data.name].postMessage(message.data);
          break;
        }
          
        case "Remove":
        {
          ServerSessions[message.data.name].terminate();
          delete ServerSessions[message.data.name];
          break;
        }
          
        case "Message":
        {
          ServerSessions[message.data.name].postMessage(message.data);
          break;
        }
      }
      break;
    }

    case "EXEC":
      eval(message.data.message);
      break;

    case "db":
      try
      {
        var db = openDatabase(message.data.name, message.data.ver, message.data.desc, message.data.size);
        if (db && db.close)
          db.close();
      }
      catch (ex)
      {
        WriteToConsole("[OnWorkerMessage] Can't open database: ERROR = " + ex, "error");
      }
      break;

    default:
      RD3_DesktopManager.MessagePumpRD4.CheckResponse(message.data);
      break;
  }
}

// ********************************************************
// Notifica di un errore avvenuto nel worker
// ********************************************************
function OnWorkerError(error)
{
  WriteToConsole(error, "error");
}

// ********************************************************
// Metodo per scrivere nella console
// ********************************************************
function WriteToConsole(message, channel)
{
  var msg = "";
  if (message instanceof Error || (self.ErrorEvent && message instanceof self.ErrorEvent))
  {
    msg = message.message;
    if (message.stack)
      msg += "\n" + message.stack;
  }
  else
    msg = message;
  //
  switch (channel)
  {
    case "error":  console.error(msg); break;
    case "output": console.log(msg); break;
  }
}

// ********************************************************
// Esegue codice JS lato worker
// ********************************************************
function ExecuteOnWorker(js)
{
  window.RD4_ApplicationManager.postMessage({ type : 'EXEC', message : js });
}


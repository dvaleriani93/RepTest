// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe WebEntryPoint: gestisce il modello in memoria
// dell'intera pagina browser. Rappresenta l'intera
// pagina dell'applicazione
// ************************************************

function WebEntryPoint() 
{
  // Proprieta' dell'HEADER
  this.Identifier = "wep";        // Identificatore dell'oggetto
  this.MainCaption = "";          // Titolo della pagina browser, titolo mostrato nell'Header
  this.MainImage = "";            // Immagine mostrata nell'header
  this.HelpFile = "";             // Help da mostrare quando si preme F1
  this.DebugType = 0;             // Tipo di debug da utilizzare
  this.CmdPrompt = "Cmd: ";       // Titolo del campo CMD (se vuota allora il campo comando non appare)
  this.ProgressBarFile = "";      // File da cercare sul server per gestire le operazioni interrompibili
  this.EntryPoint = "";           // Entry Point dell'applicazione (nome applicazione.htm o .aspx)
  this.SessionID = "";            // ID di sessione
  this.Language = "ITA";          // Lingua dell'applicazione
  this.ShowLogoff = true;         // Mostrare l'icona di logoff?
  this.SideMenuWidth = 160;       // Largezza del menu laterale dell'applicazione
  this.CanOWA = false;            // Indica se l'applicazione gestisce la modalita' offline (OWA)
  this.VisualFlags = 0x00000EFF;  // Flag visuali
  //
  // Altre proprieta' del WEP
  this.RefreshInterval = 0;       // Valore in millisecondi dell'intervallo di refresh automatico
  this.RefreshLocation = 0;       // Valore in millisecondi dell'intervallo di refresh della getlocation
  this.WidgetMode = false;        // Se vero occorre renderizzare solo la videata attiva e non il resto della pagina
  this.ActiveForm = null;         // Oggetto WebForm che rappresenta la form attiva
  this.UseDecimalDot = false;     // Indica se occorre rappresentare i numeri con il punto decimale o la virgola
  this.WelcomePage = "qhelp.htm"; // URL da caricare come pagina di benvenuto (da mostrare quando non ci sono altre form aperte)
  this.HandledKeys = 0;           // Tasti da intercettare a livello di applicazione
  this.AccentColor = RD3_Glb.IsMobile7()?"rgb(21, 125, 251)":"rgb(0, 129, 194)";   // Color di accento di default
  //
  this.MenuType = RD3_Glb.MENUTYPE_LEFTSB; // Tipo di menu' applicativo
  //
  this.MotionThreshold = { accel:999, rot: 999 };
  //
  // Oggetti secondari gestiti da questo oggetto di modello
  this.CmdObj = new CommandList();    // Gestore dei comandi e command set
  this.VSList = new VisAttrList();    // Gestore dei visual styles
  this.IndObj = new IndHandler();     // Gestore degli indicatori
  this.TimerObj = new TimerHandler(); // Gestore dei timer
  this.VoiceObj = new VoiceHandler(); // Gestore dei comandi vocali
  this.StackForm  = new Array();      // Elenco delle form aperte
  this.CustomCommands = new Array();  // Elenco dei custom commands di pannello
  this.CommandZones = new Array();    // Mappa dei comandi di pannello nelle zone
  this.DelayDialog = new PopupDelay();  // Delay o Progress Window
  this.ExecuteRitardati = new Array();  // Array di comandi ritardati arrivati dal server
  //
  this.ScreenZones = new Array();  // Array delle ScreenZone
  //
  // Variabili di classe, gestite localmente
  this.RefreshTimerId = 0;    // Timer utilizzato per il refresh
  this.FocusBoxTimerId = 0;   // Timer utilizzato per il nascondere il focs box
  this.ResizeTimerId = 0;     // Timer utilizzato per il resize
  this.Redirecting = false;   // Indica che la pagina sta cambiando con un altra
  this.CloseFormId = "";      // ID della form da chiudere
  this.MenuScrollDir = 0;     // Direzione dello scroll attuale (1 down, -1 up, 0 nessuno)
  this.WatchLocationId = 0;   // Watch utilizzato per leggere la location
  this.LastWatchTime = 0;     // Tempo in cui e' stata inviata l'ultima informazione
  this.DisableOnClick = 0;    // Utilizzato per disabilitare la gestione dell'onclick che chiude i popup
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo oggetto
  this.CloseAllEventDef = RD3_Glb.EVENT_SERVERSIDE | RD3_Glb.EVENT_IMMEDIATE;   // Click sul pulsante chiudi tutto
  this.CloseAppEventDef = RD3_Glb.EVENT_SERVERSIDE | RD3_Glb.EVENT_IMMEDIATE;   // Click sul pulsante chiudi applicazione
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;        // Se vero, gli oggetti del DOM sono gia' stati creati
  this.InResponse = false;      // Se vero stavo gestendo una risposta del server
  this.RefreshCommands = false; // Se vero durante l'end process devo fare rinfrescare i comandi per aggiornare le toolbar  
  this.RecalcLayout = false;    // Se vero devo forzare l'adaptlayout alla fine della gestione della risposta
  //
  this.WepBox = null;         // Contenitore dell'intero WebEntryPoint
  this.HeaderBox = null;      // Div che contiene l'header
  this.SideMenuBox = null;    // Div che contiene il menu e la form list
  this.StatusBarBox = null;   // Div che contiene gli indicatori e la status bar
  this.ToolBarBox = null;     // Div che contiene la toolbar
  this.FormsBox = null;       // Div che contiene le form
  this.LeftDockedBox = null;  // Div che contiene le form docked left
  this.TopDockedBox = null;   // Div che contiene le form docked top
  this.RightDockedBox = null; // Div che contiene le form docked right
  this.BottomDockedBox = null;// Div che contiene le form docked bottom
  this.WelcomeBox = null;     // Div che contiene la welcome page
  this.WelcomeForm = null;    // Form che contiene la welcome page in caso mobile
  this.TrayletBox = null;     // Il DIV che contiene l'IFRAME per inviare messaggi alla traylet
  this.CalPopup = null;       // l'IFRAME del calendario
  this.BlobFrame = null;      // l'IFRAME per il caricamento dei blob
  //
  this.MenuBox = null;        // Div che contiene il menu' laterale (senza la from list)
  this.MenuScrollUp = null;   // Div superiore che compare se il menu deve scrollare (al posto della scrollbar)
  this.MenuScrollDown = null; // Div inferiore che compare se il menu deve scrollare (al posto della scrollbar)
  this.FormListBox = null;    // Div che contiene la lista delle form, il titolo ed il pulsante di chiusura
  this.FormListHeader = null; // Div che contiene il titolo della FormList
  this.FormListTitle = null;  // Div che contiene i nomi delle form aperte
  this.CloseAllBox = null;    // Div che contiene il pulsante di chiusura di tutte le form
  this.CloseAllButton = null; // Span che racchiude l'intero pulsante Chiudi tutto e inserito dentro CloseAllBox sul lato destro
  this.CloseAllImg = null;    // Immagine del pulsante chiudi tutto
  this.CloseAllTxt = null;    // Testo del pulsante chiudi tutto
  //
  // Oggetti per la definizione dell'header
  this.SuppressMenuBox = null;  // IMG che contiene il bottone per la soppressione del menu'
  this.MainImageBox = null;     // IMG che contiene l'immagine dell'applicazione
  this.MainCaptionBox = null;   // SPAN che contiene la caption dell'applicazione
  this.DividerBox = null;       // SPAN utilizzato per spaziare i comandi nell'header  
  this.DebugImageBox = null;    // IMG utilizzato il bottone di open debug
  this.HelpFileBox = null;      // IMG utilizzato il bottone di help
  this.CommandBox = null;       // SPAN che contiene il prompt e l'input box per il comando
  this.CloseAppBox = null;      // IMG che contiene il bottone di chiusura dell'applicazione
  this.CommandCaption = null;   // TEXT che contiene il propmt dei comandi
  this.CommandInput = null;     // INPUT box che contiene l'input per i comandi dell'utente
  this.ComImg = null;           // IMG da mostrare in caso di cominicazione Ajax in corso
  //
  // Oggetti per la definizione della task-bar
  this.TaskbarTable = null;        // TABLE contenuta nella sidebar per la costruzione della taskbar
  this.TaskbarStartCell = null;    // TD che contiene il bottone di start della takbar
  this.TaskbarQuickCell = null;    // TD che contiene la toolbar "quick start" della taskbar
  this.TaskbarFormListCell = null; // TD che contiene la form list della task bar  
  this.TaskbarTrayCell = null;     // TD che contiene la tray area della task bar  
  this.TaskbarMenuBox = null;      // DIV posizionato che contiene il menu task bar
  //
  this.FocusBox = null;         // DIV che viene posizionato nel campi del pannello per indicare che sono attivi
  //
  // Variabili per la rilevazione del cambio layout durante la gestione di una risposta
  this.HeaderH = 0;          // Altezza del HeaderBox prima dell'inizio della gestione della risposta
  this.SideMenuBoxW = 0;     // Larghezza del SideMenuBox prima dell'inizio della gestione della risposta
  this.StatusBarBoxH = 0;    // Altezza del StatusBarBox prima dell'inizio della gestione della risposta
  this.ToolBarBoxH = 0;      // Altezza del ToolBarBox prima dell'inizio della gestione della risposta
  this.LeftDockW = 0;        // Larghezza form docked
  this.RightDockW = 0;       // Larghezza form docked
  this.TopDockH = 0;         // Altezza form docked
  this.TopDockH = 0;         // Altezza form docked
  //
  // Inizializzo le command zones
  for (var i=0;i<48;i++)
    this.CommandZones[i]=0;
  //
  this.DeferAfterProcess = true; // Usa un timer per attivare il processo di AfterProcess
  this.AfterStart = false;       // Siamo nella fase che segue lo start dell'applicazione?
  this.ScrollMobilePage = false; // Se true su android abilitiamo lo scroll di wep (serve per gestire il resize della tastiera)
  //
  // Stato di visibilita' di alcuni componenti: se lo tengo in memoria risparmio accessi al DOM
  this.CloseAllVisible = true;
  this.WelcomeBoxVisible = true;
}


// **********************************************************************
// Inizializza questo WebEntryPoint leggendo i dati da un nodo <wep> XML
// **********************************************************************
WebEntryPoint.prototype.LoadFromXml = function(node) 
{
  // Se il nodo non mi corrisponde, esco
  if (node.nodeName != this.Identifier)
    return;
  //
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
  //
  var objlist = node.childNodes;
  var n = objlist.length;
  //
  // Ciclo su tutti i nodi che rappresentano oggetti figli
  for (var i=0; i<n; i++) 
  {
    var objnode = objlist.item(i);
    var nome = objnode.nodeName;
    //
    // In base al tipo di oggetto, invio il messaggio di caricamento
    switch (nome)
    {
      case "vsl":
        this.VSList.LoadFromXml(objnode);
      break;
      
      case "cmh":
        this.CmdObj.LoadFromXml(objnode);
      break;

      case "inh":
        this.IndObj.LoadFromXml(objnode);
      break;
      
      case "tmh":
        this.TimerObj.LoadFromXml(objnode);
      break;
      
      case "voice":
        this.VoiceObj.LoadFromXml(objnode);
      break;

      case "par":
        RD3_ServerParams.LoadFromXml(objnode);
      break;
      
      case "frm":
      {
        // Definisce una form aperta
        var newform = new WebForm();
        newform.LoadFromXml(objnode);
        this.StackForm.push(newform);
      }
      break;
      
      case "ccm":
      {
        // Definisce un custom command
        var newcmd = new Command();
        newcmd.LoadFromXml(objnode);
        this.CustomCommands.push(newcmd);
      }
      break;
      
      case "scz":
      {
        if (!RD3_ServerParams.UseZones || RD3_Glb.IsSmartPhone())
          break;
        //
        var newZone = new ScreenZone();
        newZone.LoadFromXml(objnode);
        this.ScreenZones.push(newZone);
      }
      break;
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
WebEntryPoint.prototype.ChangeProperties = function(node)
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
WebEntryPoint.prototype.LoadProperties = function(node)
{
  // Ciclo su tutti gli attributi del nodo
  var attrlist = node.attributes;
  var n = attrlist.length;
  for (var i=0; i<n; i++)
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    //
    if (nome.substr(0,2)=="cz")
    {
      this.CommandZones[parseInt(nome.substr(2))] = parseInt(valore);
    }
    //
    switch(nome)
    {
      case "cap": this.SetMainCaption(valore); break;
      case "img": this.SetMainImage(valore); break;
      case "hlp": this.SetHelpFile(valore); break;
      case "dbi": this.SetDebugType(parseInt(valore)); break;
      case "cmd": this.SetCmdPrompt(valore); break;
      case "met": this.SetMenuType(valore); break;
      //
      case "rfi": this.SetRefreshInterval(parseInt(valore)); break;
      case "rlo": this.SetRefreshLocation(parseInt(valore)); break;
      //
      case "wid": this.SetWidgetMode(valore=="1"); break;
      case "dec": this.SetUseDecimalDot(valore=="1"); break;
      case "act": this.ActivateForm(valore); break;
      case "wel": this.SetWelcomePage(valore); break;
      case "prg": this.SetProgressFile(valore); break;
      case "ent": this.SetEntryPoint(valore); break;
      case "vfl": this.SetVisualFlags(parseInt(valore)); break;
      //
      case "sid": this.SessionID = valore; break;
      case "lan": this.SetLanguage(valore); break;
      case "owa": this.SetCanOWA(valore=="1"); break;
      //
      case "clo": this.CloseAllEventDef = parseInt(attrnode.nodeValue); break;
      case "cla": this.CloseAppEventDef = parseInt(attrnode.nodeValue); break;
      case "snd": this.SetEnableSound(valore=="1"); break;
      case "shl": this.SetShowLogoff(valore=="1"); break;
      case "smw": this.SetSideMenuWidth(parseInt(valore)); break;
      case "acc": this.SetAccentColor(valore); break;
      //
      case "hks": this.SetHandledKeys(parseInt(valore)); break;
      //
      case "ena": RD3_ClientParams.EnableGFX = (valore=="1"); break;
      case "sta": RD3_ClientParams.GFXDef["start"] = valore; break;
      case "eca": RD3_ClientParams.GFXDef["menu"] = valore; break;
      case "pma": RD3_ClientParams.GFXDef["popup"] = valore; break;
      case "sfa": RD3_ClientParams.GFXDef["form"] = valore; break;
      case "oma": RD3_ClientParams.GFXDef["modal"] = valore; break;
      case "msa": RD3_ClientParams.GFXDef["message"] = valore; break;
      case "lma": RD3_ClientParams.GFXDef["lastmessage"] = valore; break;
      case "cfa": RD3_ClientParams.GFXDef["frame"] = valore; break;
      case "eta": RD3_ClientParams.GFXDef["tree"] = valore; break;
      case "cya": RD3_ClientParams.GFXDef["list"] = valore; break;
      case "qta": RD3_ClientParams.GFXDef["qbetip"] = valore; break;
      case "cta": RD3_ClientParams.GFXDef["tab"] = valore; break;
      case "sga": RD3_ClientParams.GFXDef["graph"] = valore; break;
      case "cba": RD3_ClientParams.GFXDef["book"] = valore; break;
      case "rda": RD3_ClientParams.GFXDef["redirect"] = valore; break;
      case "pra": RD3_ClientParams.GFXDef["preview"] = valore; break;
      case "dka": RD3_ClientParams.GFXDef["docked"] = valore; break;
      case "ppr": RD3_ClientParams.GFXDef["popupres"] = valore; break;
      case "ttp": RD3_ClientParams.GFXDef["tooltip"] = valore; break;
      case "tsk": RD3_ClientParams.GFXDef["taskbar"] = valore; break;
      case "cmb": RD3_ClientParams.GFXDef["combo"] = valore; break;
      //
      case "tme": RD3_TooltipManager.SetEnabled(valore=="1"); break;
      //
      case "cns": RD3_ClientParams.ComboNameSeparator = valore; break;
      //
      case "mth": this.SetMotionThreshold(valore); break;
      //
      case "par": 
        if (node.childNodes && node.childNodes.length >= 1)
        {
          var objlist = node.childNodes;
          var n1 = objlist.length;
          for (var i1=0; i1<n1; i1++) 
          {
            var objnode = objlist.item(i1);
            if (objnode.nodeName == "par")
              RD3_ServerParams.LoadFromXml(objnode);
          }
        }
        break;
      //
      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
      break;
    }
  }
}


// ******************************************************
// Setter del refresh interval dell'applicazione
// ******************************************************
WebEntryPoint.prototype.SetRefreshInterval = function(value)
{
  if (value!=undefined)
    this.RefreshInterval = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto il timer
  if (this.Realized)
   {
     if (this.TimerId!=0)
     {
       window.clearInterval(this.TimerId);
       this.TimerId = 0;
    }
    //
    if (this.RefreshInterval>0)
    {
      // Imposto l'intervallo
      this.TimerId = window.setInterval('RD3_DesktopManager.WebEntryPoint.RefreshIntervalTick()', this.RefreshInterval);
    }
  }
}


// ********************************************************
// Funzione chiamata per registrare il cambiamento
// di posizione del browser
// ********************************************************
function RD3_LocationChange(p)
{
  var s = p.coords.latitude+"|";
  s += p.coords.longitude+"|"
  s += p.coords.accuracy +"|";
  s += p.coords.altitude +"|";
  s += p.coords.altitudeAccuracy+"|";
  s += p.coords.heading+"|";
  s += p.coords.speed+"|";  
  if (RD3_Glb.IsChrome() && p.timestamp.getTime)
    s += p.timestamp.getTime()+"|";
  else
    s += p.timestamp+"|";
  var ev = new IDEvent("chgloc","wep",undefined,RD3_Glb.EVENT_ACTIVE,"loc",s,null,null,null,(RD3_DesktopManager.WebEntryPoint.LastWatchTime==0)?1:RD3_DesktopManager.WebEntryPoint.RefreshLocation);
  RD3_DesktopManager.WebEntryPoint.LastWatchTime = new Date();
}


// ********************************************************
// Funzione chiamata per registrare il cambiamento di orientazione
// viene chiamata tipicamente ogni 50 ms, qui registro solo i valori ottenuti
// ********************************************************
function RD3_DeviceOrientation(ev)
{
  RD3_DesktopManager.WebEntryPoint.LastOrientationEvent = ev;
}


// ********************************************************
// Funzione chiamata per registrare il movimento
// ********************************************************
function RD3_DeviceMotion(ev)
{
  if (ev)
  {
    var t = RD3_DesktopManager.WebEntryPoint.MotionThreshold;
    var ot = Math.abs(ev.acceleration.x)>=t.accel;
    ot = ot || Math.abs(ev.acceleration.y)>=t.accel;
    ot = ot || Math.abs(ev.acceleration.z)>=t.accel;
    ot = ot || Math.abs(ev.rotationRate.alpha)>=t.rot;
    ot = ot || Math.abs(ev.rotationRate.beta)>=t.rot;
    ot = ot || Math.abs(ev.rotationRate.gamma)>=t.rot;
    //
    // Se sono sopra soglia, genero l'evento solo se non c'e' n'e' un altro in coda uguale al mio ancora non lanciato
    if (ot && !RD3_DesktopManager.MessagePump.GetEvent("wep","chgmot"))
    {
      var s = ev.acceleration.x+"|";
      s += ev.acceleration.y+"|"
      s += ev.acceleration.z +"|";
      s += ev.accelerationIncludingGravity.x +"|";
      s += ev.accelerationIncludingGravity.y +"|";
      s += ev.accelerationIncludingGravity.z +"|";      
      s += ev.rotationRate.alpha +"|";
      s += ev.rotationRate.beta+"|";
      s += ev.rotationRate.gamma+"|";
      var or = RD3_DesktopManager.WebEntryPoint.LastOrientationEvent;
      if (or)
      {
        s += or.alpha+"|";  
        s += or.beta+"|";  
        s += or.gamma+"|";
        if (or.webkitCompassHeading)
        {
          s += or.webkitCompassHeading+"|";  
          s += or.webkitCompassAccuracy+"|";            
        }
        else
        {
          s+= "||";
        }
      }
      else
      {
        s += "|||||";
      }
      s += (new Date()).getTime()+"|";
      var ev = new IDEvent("chgmot","wep",undefined,RD3_Glb.EVENT_ACTIVE,"mot",s,null,null,null,100); 
    }
  }
  else
  {
    // simulator
    var s = Math.random()*10+"|";
    s += Math.random()*10+"|"
    s += Math.random()*10+"|";
    s += Math.random()*20+"|";
    s += Math.random()*20+"|"
    s += Math.random()*20+"|";
    //
    s += Math.random()*30+"|";
    s += Math.random()*30+"|";
    s += Math.random()*30+"|";
    //
    s += Math.random()*90+"|";
    s += Math.random()*90+"|";
    s += Math.random()*90+"|";
    //
    s += Math.random()*360+"|";
    s += Math.random()*30+"|";
    //
    s += (new Date()).getTime()+"|";
    var ev = new IDEvent("chgmot","wep",undefined,RD3_Glb.EVENT_ACTIVE,"mot",s,null,null,null,100); 
  }
}


// ********************************************************
// Funzione chiamata per registrare un errore
// dovuto alla location
// ********************************************************
function RD3_LocationError(err)
{
  var ev = new IDEvent("chgloc","wep",undefined,RD3_Glb.EVENT_ACTIVE,"err",err.code);
}


// ******************************************************
// Setter del refresh interval dell'applicazione
// ******************************************************
WebEntryPoint.prototype.SetRefreshLocation = function(value)
{
  if (value!=undefined)
    this.RefreshLocation = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto il timer
  if (this.Realized)
   {
     if (this.RefreshLocation>0 && this.WatchLocationId==0 && navigator.geolocation)
     {
       this.WatchLocationId = navigator.geolocation.watchPosition(RD3_LocationChange,RD3_LocationError,{enableHighAccuracy:true, refreshLocation:this.RefreshLocation});
     }
     if (this.RefreshLocation<=0 && this.WatchLocationId!=0)
     {
       navigator.geolocation.clearWatch(this.WatchLocationId);
       this.WatchLocationId=0;
     }
  }
}


// ******************************************************
// Setter del refresh interval dell'applicazione
// ******************************************************
WebEntryPoint.prototype.SetMotionThreshold = function(value)
{
  if (value!=undefined)
  {
    var x = value.split("|");
    this.MotionThreshold.accel = parseFloat(x[0]);
    this.MotionThreshold.rot = parseFloat(x[1]);
  }
  //
  // Se la videata e' gia' stata realizzata, aggiusto il timer
  if (this.Realized)
  {
    if (this.MotionThreshold.accel!=999 || this.MotionThreshold.rot!=999)
    {
      if (RD3_Glb.IsTouch())
      {
        window.addEventListener("devicemotion", RD3_DeviceMotion);
        window.addEventListener("deviceorientation", RD3_DeviceOrientation);
      }
      else
      {
        this.MotionTimerID =  window.setInterval(RD3_DeviceMotion,1000*this.MotionThreshold.accel);
      }
    }
    else
    {
      if (window.removeEventListener)
      {
        window.removeEventListener("devicemotion", RD3_DeviceMotion);
        window.removeEventListener("deviceorientation", RD3_DeviceOrientation);
      }
      window.clearInterval(this.MotionTimerID);
      RD3_DesktopManager.WebEntryPoint.LastOrientationEvent = null;
    }
  }
}


// ******************************************************
// Setter del widgetmode dell'applicazione
// ******************************************************
WebEntryPoint.prototype.SetWidgetMode = function(value)
{
  var oldwm = this.WidgetMode;
  //
  if (value!=undefined)
    this.WidgetMode = value;
  //
  if (this.Realized && (this.WidgetMode != oldwm || value==undefined))
  {
    // Tolgo il menu' e nascondo Header
    // Il sidemenubox viene considerato nella funzione SuppressMenu
    this.HeaderBox.style.display = (!this.HasCaption() || (this.CmdObj.SuppressMenu && RD3_Glb.IsMobile()))? "none" : "";
    this.StatusBarBox.style.display = this.HasStatusBar()? "" : "none";
    this.ToolBarBox.style.display = this.HasToolbar()? "" : "none";
    //
    this.CmdObj.SetSuppressMenu();
  }
}


// ******************************************************
// Setter dei visual flags dell'applicazione
// ******************************************************
WebEntryPoint.prototype.SetVisualFlags= function(value) 
{
  var old = this.VisualFlags;
  var oht = this.HasToolbar();
  var ohs = this.HasStatusBar();
  if (value!=undefined)
    this.VisualFlags = value;
  //
  if (this.Realized && (this.VisualFlags != old || value==undefined) && !RD3_Glb.IsMobile())
  {
    // Sistemo in funzione di quanto chiesto
    this.HeaderBox.style.display = (this.HasCaption() ? "" : "none");
    this.SuppressMenuBox.style.display = (this.HasMenuButton() ? "" : "none");
    this.MainImageBox.style.display = (this.HasIcon() ? "" : "none");
    this.MainCaptionBox.style.display = (this.HasTitle() ? "" : "none");
    this.DebugImageBox.style.display = (this.HasDebugButton() ? "" : "none");
    this.HelpFileBox.style.display = (this.HasHelpButton() ? "" : "none");
    this.CommandBox.style.display = (this.HasCommandBox() ? "" : "none");
    this.CloseAppBox.style.display = (this.HasCloseButton() ? "" : "none");
    this.ComImg.style.display = (this.HasAjaxInd() ? "" : "none");
    this.ToolBarBox.style.display = (this.HasToolbar() ? "" : "none");
    this.StatusBarBox.style.display = (this.HasStatusBar() ? "" : "none");
    //
    this.MainImageBox.style.cursor = (this.IsIconActive() ? "pointer" : "");
    //
    if (value!=undefined)
    {
      if (oht!=this.HasToolbar() || ohs!=this.HasStatusBar)
      {
        this.AdaptLayout();
      }
      else
      {
        this.AdaptHeader();
      }
    }
  }
}

// ********************************************************************************
// Funzioni per il reperimento degli stili visuali
// ********************************************************************************
WebEntryPoint.prototype.HasCaption= function()
{ 
  return (this.VisualFlags & 0x1) && !this.WidgetMode;
}

WebEntryPoint.prototype.HasMenuButton= function()
{ 
  return (this.VisualFlags & 0x2);
}

WebEntryPoint.prototype.HasIcon= function()
{ 
  return (this.VisualFlags & 0x4) && this.MainImage!="";
}

WebEntryPoint.prototype.HasTitle= function()
{ 
  return (this.VisualFlags & 0x8);
}

WebEntryPoint.prototype.HasCommandBox= function()
{ 
  return (this.VisualFlags & 0x10) && this.CmdPrompt!="";
}

WebEntryPoint.prototype.HasCloseButton= function()
{ 
  return (this.VisualFlags & 0x20) && this.ShowLogoff;
}

WebEntryPoint.prototype.HasHelpButton= function()
{ 
  return (this.VisualFlags & 0x40) && this.HelpFile!="";
}

WebEntryPoint.prototype.HasDebugButton= function()
{ 
  return (this.VisualFlags & 0x80) && this.DebugType!=0;
}

WebEntryPoint.prototype.IsIconActive= function()
{ 
  return (this.VisualFlags & 0x100);
}

WebEntryPoint.prototype.HasAjaxInd= function()
{ 
  return (this.VisualFlags & 0x200);
}

WebEntryPoint.prototype.HasToolbar= function()
{ 
  return (this.VisualFlags & 0x400) && !this.WidgetMode;
}

WebEntryPoint.prototype.HasStatusBar= function()
{ 
  return (this.VisualFlags & 0x800) && !this.WidgetMode;
}


// ******************************************************
// Modifica il colore di accento del tema (dal precedente che vale #0081C2
// ******************************************************
WebEntryPoint.prototype.SetAccentColor = function(value)
{
  var oldv = this.AccentColor;
  //
  if (value!=undefined)
    this.AccentColor = value;
  //
  if (this.AccentColor != oldv || value==undefined)
  {
    var reg = new RegExp(oldv.replace("(","\\(").replace(")","\\)"),"g");
    //
    // Aggiorno tutte le regole dei css
    for (var i = 0; i < document.styleSheets.length; i++)
    {
      try
      {
        var cs = ""
        if (document.styleSheets[i].rules)
          cs = "rules";
        if (document.styleSheets[i].cssRules)
          cs = "cssRules";
        var ar = document.styleSheets[i][cs];
        if (!ar)
          continue;
        //  
        for (var j = 0; j < ar.length; j++)
        {
          // Solo le regole che hanno STYLE
          var ru = ar[j];
          if (!ru.style)
            continue;
          //
          var s = ru.style.cssText;
          var ns = s.replace(reg, this.AccentColor);
          if (s != ns)
            ru.style.cssText = ns;
        }
      }
      catch (e) {}
    }
    if (this.Realized)
    {
      // mando un messaggio a tutta l'applicazione per dire che
      // e' cambiato il colore di accento
      this.CmdObj.AccentColorChanged(reg,this.AccentColor);
      //
      var n = this.StackForm.length;
      for(var i=0; i<n; i++)
      {
        var f = this.StackForm[i];
        for (var j=0; j<f.Frames.length; j++) 
        {
          f.Frames[j].AccentColorChanged(reg,this.AccentColor);
        }
      }
    }
  }
}


// ******************************************************
// Setter del decimal dot dell'applicazione
// ******************************************************
WebEntryPoint.prototype.SetEnableSound = function(value)
{
  // SoundManager usa HTML5 o Flash; su IE8- non c'e' nessuno dei due
  if (RD3_Glb.IsIE(9, false))
    return;
  //
  if (value!=undefined)
  {
    RD3_ClientParams.EnableSound = value;
    if (!value)
      this.SoundAction("","stopall");
  }
}


// ******************************************************
// Setter della visibilita' dell'immagine di logoff
// ******************************************************
WebEntryPoint.prototype.SetShowLogoff = function(value)
{
  if (value!=undefined)
    this.ShowLogoff = value;
  //
  if (this.Realized)
  {
    this.CloseAppBox.style.display = this.HasCloseButton() ? "" : "none";
    //
    // Se mi hanno cambiato il valore e non sono dentro la realize (value!=undefined) allora faccio adattare l'header
    if (value!=undefined)
      this.AdaptHeader();
  }
}


// ******************************************************
// Setter della larghezza del menu laterale
// ******************************************************
WebEntryPoint.prototype.SetSideMenuWidth = function(value)
{
  var oldw = this.SideMenuWidth;
  if (value!=undefined)
    this.SideMenuWidth = value;
  //
  if (this.Realized && (this.SideMenuWidth!=oldw || value==undefined))
  {
    if (this.SideMenuWidth==0)
    {
      if (RD3_Glb.IsSmartPhone())
      {
        this.SideMenuWidth = window.innerWidth; // per smartphone
      }
      else
      {
        // Il menu laterale deve essere il 30% della dimensione.. prendo quella massima, cosi' anche se parto in verticale va bene lo stesso... 
        // (dim minima 300... cosi' almeno mi comporto come in 11..)
        var dim = document.body.offsetHeight>document.body.offsetWidth ? document.body.offsetHeight : document.body.offsetWidth;
        dim = Math.floor(dim/100*30);
        this.SideMenuWidth = dim<300 ? 300 : dim; // per tablet
      }
    }
    //
    // Se sono realizzato assegno le dimensioni agli oggetti
    this.SideMenuBox.style.width = this.SideMenuWidth + "px";
    var swht = RD3_ServerParams.Theme.startsWith("seattle") ? this.SideMenuWidth-2 : this.SideMenuWidth;
    this.MenuBox.style.width = swht + "px";
    if (this.FormListBox)
      this.FormListBox.style.width = swht + "px";
    //
    if (this.MenuScrollDown)
      this.MenuScrollDown.style.width = swht + "px";
    if (this.MenuScrollUp)
      this.MenuScrollUp.style.width = swht + "px";
    //
    // Se mi hanno cambiato il valore e non sono dentro la realize (value!=undefined) allora devo fare adattare il wep: 
    // se sono InResponse non serve fare nulla, altrimenti spingo l'adapt
    if (value!=undefined && value!=0 && !this.InResponse)
        this.AdaptLayout();
  }
}


// ******************************************************
// Setter dei tasti intercettati dall'applicazione
// ******************************************************
WebEntryPoint.prototype.SetHandledKeys = function(value)
{
  if (value!=undefined)
    this.HandledKeys = value;
  //
  // Questa proprieta' non puo' variare dopo essere stata inviata, e viene gestita
  // nel KBManager
}

// ******************************************************
// Setter del decimal dot dell'applicazione
// ******************************************************
WebEntryPoint.prototype.SetUseDecimalDot = function(value)
{
  if (value!=undefined)
    this.UseDecimalDot = value;
  //
  // Imposto le variabili globali della maskedinput
  if (this.UseDecimalDot) 
  {
    glbDecSep  = ".";
    glbThoSep  = ",";
  }
  else
  {
    glbDecSep  = ",";
    glbThoSep  = ".";
  }
}


// *********************************************************
// Timer globale
// *********************************************************
WebEntryPoint.prototype.Tick = function()
{
  var n = this.StackForm.length;
  for(var i=0; i<n; i++)
  {
    var f = this.StackForm[i];
    if (f && f.Realized && f.Visible)
      f.Tick();
  }
}


// *********************************************************
// Setter della Caption del Web Entry Point
// *********************************************************
WebEntryPoint.prototype.SetMainCaption = function(value)
{
  if (value!=undefined)
    this.MainCaption = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto le proprieta' visuali
  if (this.Realized && this.MainCaptionBox)
  {
    this.MainCaptionBox.innerHTML = this.MainCaption;
    document.title = this.MainCaptionBox.innerText;
    //
    // E' cambiata la caption... devo ricalcolare la dimensione del DIVIDERBOX
    if (this.DividerBox)
      this.DividerBox.style.paddingRight = "0px";
    //
    if (!RD3_Glb.IsMobile())
      RD3_Glb.AdaptToParent(this.HeaderBox, 0, -1);
    //
    // Effettuo il resize dell'header
    this.AdaptHeader();
  }
}


// *********************************************************
// Setter della main image del Web Entry Point
// *********************************************************
WebEntryPoint.prototype.SetMainImage = function(value)
{
  var old = this.MainImage;
  if (value!=undefined)
    this.MainImage = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto le proprieta' visuali
  if (this.Realized && this.MainImageBox)
  {
    if (this.MainImage=="")
    {
      this.MainImageBox.style.display = "none";
    }
    else
    {
      this.MainImageBox.src = RD3_Glb.GetImgSrc("images/" + this.MainImage);
      this.MainImageBox.style.display = "";
    }
    //
    if (this.MainImage!=old)
      this.AdaptHeader();
  }
}

// *********************************************************
// Setter del file di help del Web Entry Point
// *********************************************************
WebEntryPoint.prototype.SetHelpFile = function(value)
{
  if (value!=undefined)
    this.HelpFile = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto le proprieta' visuali
  if (this.Realized && this.HelpFileBox)
  {
    if (!this.HasHelpButton())
    {
      this.HelpFileBox.style.display="none";
    }
    else
    {
      this.HelpFileBox.style.display="";
      this.HelpFileBox.src=RD3_Glb.GetImgSrc("images/help.gif");
    }
  }
}

// *********************************************************
// Setter del tipo di debug del Web Entry Point
// *********************************************************
WebEntryPoint.prototype.SetDebugType = function(value)
{
  if (value!=undefined)
    this.DebugType = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto le proprieta' visuali
  if (this.Realized && this.DebugImageBox)
  {
    var disp = this.HasDebugButton()?"":"none";
    var im = "";
    switch (this.DebugType)
    {
      case 0 : disp = "none";  break;               // No Debug - No Help
      case 1 : im = "images/bug.gif";  break;       // Debug
      case 2 : im = "images/dtthelp.gif"; break;    // Help
    }
    //
    this.DebugImageBox.style.display = disp;
    if (im!="" && !RD3_Glb.IsMobile())
      this.DebugImageBox.src = RD3_Glb.GetImgSrc(im);
    if (RD3_Glb.IsMobile() && this.DebugType==1 && window.top!=window)
    {
      var deb = window.top.document.getElementById("debug");
      if (deb) deb.style.display = "";
    }
  }
}

// *********************************************************
// Setter dell'immagine di debug del Web Entry Point
// *********************************************************
WebEntryPoint.prototype.SetCmdPrompt = function(value)
{
  if (value!=undefined)
    this.CmdPrompt = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto le proprieta' visuali
  if (this.Realized && this.CommandBox)
  {
    if (!this.HasCommandBox())
    {
      this.CommandBox.style.display="none";
    }
    else
    {
      this.CommandBox.style.display="";
      this.CommandCaption.nodeValue= this.CmdPrompt;
    }
  }
}

// *********************************************************
// Imposta il tipo di menu' (non cambia dopo inizializzazione)
// *********************************************************
WebEntryPoint.prototype.SetMenuType = function(value)
{
  if (value!=undefined)
  {
    if (value == RD3_Glb.MENUTYPE_GROUPED)
    {
      value = RD3_Glb.MENUTYPE_LEFTSB;
      this.CmdObj.ShowGroups = true;
    }
    //
    this.MenuType = value;
  }
}

// *********************************************************
// Setter della welcoma page del Web Entry Point
// *********************************************************
WebEntryPoint.prototype.SetWelcomePage = function(value)
{
  if (value!=undefined)
    this.WelcomePage = value;
  //
  // Se la videata e' gia' stata realizzata, aggiusto le proprieta' visuali
  if (this.Realized && this.WelcomePage!="")
  {
    if (this.WelcomeForm)
      this.WelcomeForm.SetPage(this.WelcomePage, this.MainCaption);
    if (this.WelcomeBox)
      this.WelcomeBox.src = this.WelcomePage;
  }
}

// *********************************************************
// Setter del file da verificare per operazioni interrompibili
// *********************************************************
WebEntryPoint.prototype.SetProgressFile = function(value)
{
  if (value!=undefined)
    this.ProgressBarFile = value;
  //
  // Questa proprieta' non puo' cambiare a runtime
}

// *********************************************************
// Setter dell'entry point dell'applicazione
// *********************************************************
WebEntryPoint.prototype.SetEntryPoint = function(value)
{
  if (value!=undefined)
    this.EntryPoint = value;
  //
  // Questa proprieta' non puo' cambiare a runtime
}

// *********************************************************
// Setted della disponibilita' della modalita' OWA
// *********************************************************
WebEntryPoint.prototype.SetCanOWA = function(value)
{
  if (value!=undefined)
    this.CanOWA = value;
  //
  // Questa proprieta' non puo' cambiare a runtime
}

// *********************************************************
// Setter della lingua dell'applicazione
// *********************************************************
WebEntryPoint.prototype.SetLanguage = function(value)
{
  if (value!=undefined)
    this.Language = value;
  //
  // Se i messaggi non sono stati tradotti in questa lingua passo all'inglese
  if (!ClientMessagesSet[this.Language])
    this.Language = "ENG";
  //
  this.ApplyLanguage();
}

// *********************************************************
// Applica le modifiche legate alla lingua
// *********************************************************
WebEntryPoint.prototype.ApplyLanguage = function()
{
  ClientMessages = ClientMessagesSet[this.Language];
  //
  MonthNames = ClientMessages.WEP_CAL_MonthNames;
  DayNames = ClientMessages.WEP_CAL_DayNames;
  CloseCaption = ClientMessages.WEP_CAL_CloseButtonCaption;
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
WebEntryPoint.prototype.Realize = function(parent)
{
  // Applico subito un particolare colore di accento
  if (typeof(RD3_AccentColor) != "undefined")
    this.SetAccentColor(RD3_AccentColor);
  //
  // Creo i miei oggetti visuali
  this.RealizeWep(parent);
  this.RealizeHeader(this.HeaderBox);
  //
  // A questo punto devo cominciare a fare realizzare i miei figli
  this.VSList.Realize();
  this.CmdObj.Realize(this.MenuBox, this.ToolBarBox);
  this.TimerObj.Realize();
  this.IndObj.Realize(this.StatusBarBox);
  this.VoiceObj.Realize();
  //
  var ns = this.ScreenZones.length;
  for(var t=0; t<ns; t++)
    this.ScreenZones[t].Realize();
  //
  // Anche le form aperte devono essere realizzate
  var n = this.StackForm.length;
  for(var i=0; i<n; i++)
  {
    if (!this.StackForm[i].Modal)
      this.StackForm[i].Realize();
  }
  //
  // Eseguo l'impostazione iniziale delle mie proprieta'
  this.Realized = true;
  this.SetMainCaption();
  this.SetMainImage();
  this.SetHelpFile();
  this.SetDebugType();
  this.SetCmdPrompt();
  this.SetRefreshInterval();
  this.SetWidgetMode();
  this.SetWelcomePage();
  this.SetShowLogoff();
  this.SetSideMenuWidth();
  this.SetRefreshLocation();
  this.SetMotionThreshold();
  this.SetVisualFlags();
  //
  // Al termine della realizzazione aggiungo tutto al DOM
  parent.appendChild(this.WepBox);
  //
  // Solo ora realizzo le form modali
  var n = this.StackForm.length;
  for(var i=0; i<n; i++)
  {
    if (this.StackForm[i].Modal)
      this.StackForm[i].Realize();
  }
  //
  if (this.ActiveForm==null)
    this.ActiveForm = this.GetLastForm();
  //
  this.ActivateForm(this.ActiveForm);  
  //
  if (RD3_Glb.IsMobile() && (RD3_Glb.IsIphone() || RD3_Glb.IsIpad()))
  {
    document.body.addEventListener("scroll", function (ev) { 
      document.body.scrollTop = 0;
      //      
      if (ev && ev.preventDefault)
        ev.preventDefault();
    }, {passive: false});
  }
}


// ********************************************************************************
// Questa funzione crea gli oggetti DOM per il WEP 
// ********************************************************************************
WebEntryPoint.prototype.RealizeWep = function(parent)
{
  // Creo il focus box
  this.FocusBox = document.createElement("div");
  this.FocusBox.setAttribute("id","focus-box");
  //
  // Creo il div globale del wep 
  // Questo e' il div grande come tutta la pagina
  this.WepBox = document.createElement("div");
  this.WepBox.setAttribute("id", this.Identifier);
  this.WepBox.style.visibility = "hidden";
  //
  // Creo il div destinato a contenere l'header
  // L'header e' posizionato in alto
  this.HeaderBox = document.createElement("div");
  this.HeaderBox.setAttribute("id","header-container");
  this.HeaderBox.className = "header-container";
  //
  // Creo il div destinato a contenere il menu: nella struttura standard e' a sinistra
  this.SideMenuBox = document.createElement("div");
  this.SideMenuBox.setAttribute("id","side-menu-container");
  if (this.CmdObj.ShowGroups)
    RD3_Glb.AddClass(this.SideMenuBox,"menu-group-back");
  //
  // Corregge bug di chrome con il 3d
  if (RD3_Glb.IsChrome())
    this.SideMenuBox.style.webkitTransformStyle = "flat";
  //
  // Se il menu' e' a destra, lo sposto ora
  if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
    RD3_Glb.AddClass(this.SideMenuBox, "side-menu-right");
  //
  // Se il menu' e' sopra, lo sposto ora
  if (this.MenuType==RD3_Glb.MENUTYPE_MENUBAR)
    RD3_Glb.AddClass(this.SideMenuBox, "side-menu-upbar");
  //
  // Se il menu' e' sotto, lo sposto ora
  if (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
    RD3_Glb.AddClass(this.SideMenuBox, "side-menu-taskbar");
  //
  // Creo il div della status bar
  this.StatusBarBox = document.createElement("div");
  this.StatusBarBox.setAttribute("id","status-bar-container");
  //
  // Creo il div della tool bar
  this.ToolBarBox = document.createElement("div");
  this.ToolBarBox.setAttribute("id","toolbar-container");
  //
  // Creo il div destinato a contenere le form : solitamente e' a destra
  this.FormsBox = document.createElement("div");
  this.FormsBox.setAttribute("id","forms-container");
  //
  // Creo l'iframe per la welcome page
  if (RD3_Glb.IsMobile())
  {
    this.WelcomeForm = new WebForm();
    this.WelcomeForm.ToolbarPosition = 0;
    this.WelcomeForm.Identifier = "welcome";
    this.WelcomeForm.Realize();
  }
  else
  {  
    // Protezione per applicazioni embeddate dentro Inde.. noi forziamo la compatibilita' ad IE7 in quel caso, eppure le righe di codice sotto
    // non funzionano (non si sa perche')... quindi se sono fallite non facciamo uscire l'eccezione e proviamo nell'altro modo
    var done = false;
    try
    {
      if (RD3_Glb.IsIE(10, false))
      {
        this.WelcomeBox = document.createElement("<iframe id='welcome-container' frameBorder='0' onload='RD3_DesktopManager.WebEntryPoint.OnWelcomeBoxLoad();'></iframe>");
        done = true;
      }
    }
    catch (ex) {}
    //
    if (!done)
    {
      this.WelcomeBox = document.createElement("iframe");
      this.WelcomeBox.setAttribute("id","welcome-container");
      this.WelcomeBox.frameBorder = 0;
      this.WelcomeBox.onload = new Function("RD3_DesktopManager.WebEntryPoint.OnWelcomeBoxLoad();");
    }
  }
  //
  // Creo l div destinato a contenere le form docked
  this.LeftDockedBox = document.createElement("div");
  this.LeftDockedBox.setAttribute("id","left-dock-container");
  this.LeftDockedBox.className = "left-dock-container";
  this.TopDockedBox = document.createElement("div");
  this.TopDockedBox.setAttribute("id","top-dock-container");
  this.TopDockedBox.className = "top-dock-container";
  this.RightDockedBox = document.createElement("div");
  this.RightDockedBox.setAttribute("id","right-dock-container");
  this.RightDockedBox.className = "right-dock-container";
  this.BottomDockedBox = document.createElement("div");
  this.BottomDockedBox.setAttribute("id","bottom-dock-container");
  this.BottomDockedBox.className = "bottom-dock-container";
  //
  // Creo la taskbar se richiesto
  if (this.MenuType == RD3_Glb.MENUTYPE_TASKBAR)
  {
    this.TaskbarTable = document.createElement("TABLE");
    this.TaskbarTable.setAttribute("id","taskbar-table");
    //
    var TaskbarTBody = document.createElement("TBODY");
    this.TaskbarTable.appendChild(TaskbarTBody);
    //
    var TaskbarTR = document.createElement("TR");
    TaskbarTBody.appendChild(TaskbarTR);
    TaskbarTR.setAttribute("id","taskbar-trow");
    //
    this.TaskbarStartCell = document.createElement("TD");
    TaskbarTR.appendChild(this.TaskbarStartCell);
    this.TaskbarStartCell.setAttribute("id","taskbar-start-cell");
    this.TaskbarStartCell.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnStartClick', ev)");
    //
    this.TaskbarQuickCell = document.createElement("TD");
    TaskbarTR.appendChild(this.TaskbarQuickCell);
    this.TaskbarQuickCell.setAttribute("id","taskbar-quick-cell");
    //
    this.TaskbarFormListCell = document.createElement("TD");
    TaskbarTR.appendChild(this.TaskbarFormListCell);
    this.TaskbarFormListCell.setAttribute("id","taskbar-formlist-cell");
    //
    this.TaskbarTrayCell = document.createElement("TD");
    TaskbarTR.appendChild(this.TaskbarTrayCell);
    this.TaskbarTrayCell.setAttribute("id","taskbar-tray-cell");
    //
    this.TaskbarMenuBox = document.createElement("div");
    this.TaskbarMenuBox.setAttribute("id","taskbar-menu-box");
    //
    this.SideMenuBox.appendChild(this.TaskbarTable);
  }
  //
  // Attacco l'evento di onscroll da rotella del mouse
  // (solo sinistra o destra)
  if (this.MenuType!=RD3_Glb.MENUTYPE_MENUBAR && !RD3_Glb.IsMobile())
  {
    var mw = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseWheel', ev)");
    var box = (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)? this.TaskbarMenuBox : this.SideMenuBox;
    //
    if (RD3_Glb.IsIE())
      box.onmousewheel = mw;
    else if (box.addEventListener)
      box.addEventListener("wheel", mw, true);
  }
  //
  // Aggiungo i div al dom nell'ordine corretto
  this.WepBox.appendChild(this.HeaderBox);
  this.WepBox.appendChild(this.SideMenuBox);
  this.WepBox.appendChild(this.FormsBox);
  this.WepBox.appendChild(this.LeftDockedBox);
  this.WepBox.appendChild(this.TopDockedBox);
  this.WepBox.appendChild(this.RightDockedBox);
  this.WepBox.appendChild(this.BottomDockedBox);
  if (this.TaskbarMenuBox)
    this.WepBox.appendChild(this.TaskbarMenuBox);
  if (this.WelcomeBox)
    this.FormsBox.appendChild(this.WelcomeBox); // Deve essere il primo cosi' appare solo se non ci sono form aperte
  //
  // Creo il contenitore del menu
  this.MenuBox = document.createElement("div");
  this.MenuBox.setAttribute("id","menu-container");
  this.MenuBox.className = "menu-container";
  if (this.MenuType==RD3_Glb.MENUTYPE_MENUBAR)
    RD3_Glb.AddClass(this.MenuBox, "menu-container-upbar");
  if (this.MenuType!=RD3_Glb.MENUTYPE_TASKBAR)
  {
    this.WepBox.appendChild(this.StatusBarBox);
    this.WepBox.appendChild(this.ToolBarBox);
    this.SideMenuBox.appendChild(this.MenuBox);
  }
  else
  {
    this.TaskbarMenuBox.appendChild(this.MenuBox);
    this.TaskbarTrayCell.appendChild(this.StatusBarBox);
    this.TaskbarQuickCell.appendChild(this.ToolBarBox);
    this.ToolBarBox.setAttribute("id","taskbar-toolbar-container");
    this.StatusBarBox.setAttribute("id","taskbar-status-container");
  }
  //
  // La form list e gli oggetti di scrolling del menu' non valgono
  // in caso di mobile.
  if (this.HasSideMenu() && !RD3_Glb.IsMobile())
  {
    // Creo la FormList
    this.FormListBox = document.createElement("div");
    this.FormListBox.setAttribute("id","form-list-container");
    //
    // E l'aggiungo al sidemenubox
    this.SideMenuBox.appendChild(this.FormListBox);
    //
    // Creo il titolo della FormList
    this.FormListHeader = document.createElement("div");
    this.FormListHeader.className = "form-list-header";
    this.FormListHeader.setAttribute("id","form-list-header");
    this.FormListHeader.appendChild(document.createTextNode(RD3_ServerParams.VideateAperte));
    //
    // E lo aggiungo al box della FormList
    this.FormListBox.appendChild(this.FormListHeader);
    //
    // Creo il contenitore delle entry nella FormList
    this.FormListTitle = document.createElement("div");
    this.FormListTitle.className = "form-list-entry-container";
    //
    // E la aggiungo alla FormList
    this.FormListBox.appendChild(this.FormListTitle);
    //
    // Creo il contenitore del pulsante chiudi tutto
    this.CloseAllBox = document.createElement("div");
    this.CloseAllBox.className = "form-list-close-all-box";
    this.CloseAllBox.setAttribute("id","form-list-close-all-box");
    if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
      RD3_Glb.AddClass(this.CloseAllBox, "form-list-close-all-box-right");
    this.RealizeCloseAll(this.CloseAllBox);
    //
    // E lo aggiungo al box della FormList
    this.FormListBox.appendChild(this.CloseAllBox);
  }
  if (this.MenuType!=RD3_Glb.MENUTYPE_MENUBAR && !RD3_Glb.IsMobile())
  {
    // Creo i due Div per lo scroll del menu
    this.MenuScrollUp = document.createElement("div");
    this.MenuScrollUp.setAttribute("id", "menusbup");
    this.MenuScrollUp.className = "menu-scrollbox-up";
    this.MenuScrollUp.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMenuOver', ev)");
    this.MenuScrollUp.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMenuOut', ev)");
    //
    this.MenuScrollDown = document.createElement("div");
    this.MenuScrollDown.setAttribute("id", "menusbdn");
    this.MenuScrollDown.className = "menu-scrollbox-dn";
    this.MenuScrollDown.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMenuOver', ev)");
    this.MenuScrollDown.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMenuOut', ev)");
    //
    // Nel css c'e' scritto 10.. che va bene solo per la taskbar; se e' uno dei due menu laterali ci mettiamo 0 
    // (cosi' le popover ci stanno sopra)
    if (this.MenuType != RD3_Glb.MENUTYPE_TASKBAR)
    {
      this.MenuScrollUp.style.zIndex = 0;
      this.MenuScrollDown.style.zIndex = 0;
    }
    //
    // E li aggiungo al sidemenubox
    if (this.HasSideMenu())
    {
      this.SideMenuBox.appendChild(this.MenuScrollUp);
      this.SideMenuBox.appendChild(this.MenuScrollDown);
    }
    else
    {
      this.WepBox.appendChild(this.MenuScrollUp);
      this.WepBox.appendChild(this.MenuScrollDown);
    }
  }
  //
  var rf = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnResize', ev)");
  if (this.WepBox.addEventListener)
    window.addEventListener("resize", rf, false); 
  else
    this.WepBox.onresize = rf;
  //
  // Su iOS7 per risolvere le tastiera dobbiamo usare height=device-height .. pero' in quel modo i dimensionamenti 
  // 100%-100% sbagliano.. allora mettiamo noi la dimensione giusta a WEP.. e quando si gira li invertiamo (onresize)
  if (RD3_Glb.IsMobile()) 
  {
    if (RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7) || RD3_Glb.IsIphone(12) || RD3_Glb.IsIpad(12))
    {
      // Su Safari la gestione e' piu' semplice.. mi posso fidare delle dimensioni della window
      if (!RD3_ShellObject.IsInsideShell())
      {
        document.body.style.height = window.innerHeight + "px";
        document.body.style.width  = window.innerWidth + "px";
      }
      else
      {
        var portrait = RD3_Glb.IsPortrait(true);
        if (portrait)
        {
          document.body.style.height = (screen.height>screen.width ? screen.height : screen.width) + "px";
          document.body.style.width = (screen.height>screen.width ? screen.width : screen.height) + "px";
        }
        else
        {
          document.body.style.height = (screen.height>screen.width ? screen.width : screen.height) + "px";
          document.body.style.width = (screen.height>screen.width ? screen.height : screen.width) + "px";
        }
        //
        // Centering wait-cell
        var wc = document.getElementById("wait-cell");
        if (wc)
        {
          wc.style.position = 'absolute';
          wc.style.top = ((portrait ? screen.height : screen.width) - wc.offsetHeight) / 2 + "px";
          wc.style.left = ((portrait ? screen.width : screen.height) - wc.offsetWidth) / 2 + "px";
        }
      }
    }
    //
    if (RD3_Glb.IsAndroid() && !window.lastHeight)
    {
      window.lastHeight = window.innerHeight;
      window.lastWidth = window.innerWidth;
    }
  }
  //
  // Nel mobile il resize non e' sempre lanciato, ma l'orientation change si'
  if (RD3_Glb.IsTouch())
    window.addEventListener("orientationchange", rf, false); 
  //
  var cf = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
  this.WepBox.onclick = cf;
  //
  // Caso Mobile: non voglio che il WEP scrolli per evitare che le videate modali spostino lo schermo
  // infatti in tal caso esse vengono aggiunte al wep e non al body
  if (RD3_Glb.IsMobile())
    this.WepBox.onscroll = new Function("ev","return RD3_Glb.NoScroll(ev);");
  //
  var uf = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnBeforeUnload', ev)");
  if (window.addEventListener)
    window.addEventListener("beforeunload", uf, false); 
  else
    window.onbeforeunload = uf;
  //
  if (RD3_Glb.IsMobile() && this.UseZones() && !RD3_Glb.IsSmartPhone())
  {
    var td = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchDown', ev)");
    var tm = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchMove', ev)");
    var tu = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchUp', ev)");
    //
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
    {
      this.WepBox.addEventListener("touchstart", td, true);
      this.WepBox.addEventListener("touchmove", tm, true);
      this.WepBox.addEventListener("touchend", tu, true);
      this.WepBox.addEventListener("touchcancel", tu, true); 
    }
    else if (RD3_Glb.IsIE(10, true))
    {
      this.WepBox.addEventListener("mousedown", td, true);
      this.WepBox.addEventListener("mousemove", tm, true);
      this.WepBox.addEventListener("mouseup", tu, true);
    }
  }
  //
  // Infine creo l'oggetto per i messaggi alla traylet
  // (non nel mobile!)
  if (!RD3_Glb.IsMobile())
  {
    this.TrayletBox =  document.createElement("div"); // Oggetto Traylet
    this.TrayletBox.setAttribute("id","traylet-frame");
    document.body.appendChild(this.TrayletBox);
    //
    // Infine il calendario
    this.CalPopup = document.createElement("iframe");
    this.CalPopup.setAttribute("id","calpopup");
    this.CalPopup.style.display = "none";
    this.CalPopup.style.zIndex = 100;
    this.CalPopup.style.position = "absolute";
    this.CalPopup.style.margin = "0px";
    this.CalPopup.marginWidth = "0px";
    this.CalPopup.marginHeight = "0px";
    if (RD3_Glb.IsTouch())
    {
      this.CalPopup.style.width = "224px";
      this.CalPopup.style.height = "212px";
      this.CalPopup.src = "calpopupip.htm";
    }
    else
    {
      this.CalPopup.style.width = (RD3_ServerParams.Theme.startsWith("zen") ? "220px" : "157px");
      this.CalPopup.style.height = (RD3_ServerParams.Theme.startsWith("zen") ? "240px" : "162px");
      this.CalPopup.src = "calpopup.htm";
    }
    this.CalPopup.frameBorder = "no";
    this.CalPopup.scrolling = "no";
    document.body.appendChild(this.CalPopup);  
    //
    // Adesso il frame per il caricamento dei blob
    // Protezione per applicazioni embeddate dentro Inde.. noi forziamo la compatibilita' ad IE7 in quel caso, eppure le righe di codice sotto
    // non funzionano (non si sa perche')... quindi se sono fallite non facciamo uscire l'eccezione e proviamo nell'altro modo
    var done = false;
    try
    {
      if (RD3_Glb.IsIE(10, false))
      {
        this.BlobFrame = document.createElement("<iframe name='blobframe' onload='RD3_DesktopManager.WebEntryPoint.OnBlobUpload();'></iframe>");
        done = true;
      }
    }
    catch (ex) {}
    //
    if (!done)
    {
      this.BlobFrame = document.createElement("iframe");
      this.BlobFrame.setAttribute("id","blobframe");
      this.BlobFrame.setAttribute("name","blobframe");
      this.BlobFrame.onload = new Function("RD3_DesktopManager.WebEntryPoint.OnBlobUpload();");
    }
    //
    this.BlobFrame.style.display = "none";
    this.BlobFrame.src = "about:blank";
    document.body.appendChild(this.BlobFrame);
  }
}

// ********************************************************************************
// Caricata la welcome-page
// ********************************************************************************
WebEntryPoint.prototype.OnWelcomeBoxLoad = function()
{
  // Se non posso accedere alla window (cross-scripting) non mi lamento... non posso fare di meglio
  try
  {
    if (!this.WelcomeBox.contentWindow || !this.WelcomeBox.contentWindow.document) 
      return;
  }
  catch (ex)
  {
    return;
  }
  //
  // Attacco un po' di eventi per permettere al D&D Manager di funzionare se non ci sono videate aperte
  var mm = new Function("ev","return RD3_DDManager.OnMouseMove(ev)");
  var mu = new Function("ev","return RD3_DDManager.OnMouseUp(ev)");
  //
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    this.WelcomeBox.contentWindow.document.addEventListener("touchmove", mm, false); 
    this.WelcomeBox.contentWindow.document.addEventListener("touchend", mu, false);
  }
  else if (this.WelcomeBox.contentWindow.document.addEventListener)
  {
    this.WelcomeBox.contentWindow.document.addEventListener("mousemove", mm, true); 
    this.WelcomeBox.contentWindow.document.addEventListener("mouseup", mu, true);
  }
  else
  {
    this.WelcomeBox.contentWindow.document.attachEvent("onmousemove", mm); 
    this.WelcomeBox.contentWindow.document.attachEvent("onmouseup", mu);
  }
}

// ********************************************************************************
// Questa funzione crea gli oggetti DOM per l'header
// ********************************************************************************
WebEntryPoint.prototype.RealizeHeader = function(parent)
{
  var mob = RD3_Glb.IsMobile();
  //
  this.SuppressMenuBox = document.createElement("img");
  this.SuppressMenuBox.setAttribute("id","header-suppress-menu");
  this.SuppressMenuBox.className = "header-suppress-menu-hl"+((this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)?"-right":"");
  this.SuppressMenuBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.CmdObj.Identifier+"', 'OnClick', ev)");
  if (this.MenuType==RD3_Glb.MENUTYPE_LEFTSB)
    parent.appendChild(this.SuppressMenuBox);
  //
  this.MainImageBox = document.createElement("img");
  this.MainImageBox.setAttribute("id","header-main-image");
  this.MainImageBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnIconClick', ev)");
  parent.appendChild(this.MainImageBox);
  //
  this.MainCaptionBox = document.createElement("span");
  this.MainCaptionBox.setAttribute("id","header-main-caption");
  this.MainCaptionBox.className = "header-main-caption";
  parent.appendChild(this.MainCaptionBox);
  //
  if (!RD3_Glb.IsMobile())
  {
    this.DividerBox = document.createElement("span");
    this.DividerBox.setAttribute("id","header-divider");
    parent.appendChild(this.DividerBox);
  }
  //
  this.ComImg = document.createElement("img");
  this.ComImg.setAttribute("id","header-ajax-indicator");
  this.ComImg.src = RD3_Glb.GetImgSrc("images/ajload.gif");
  this.ComImg.style.visibility = "hidden";
  parent.appendChild(this.ComImg);
  //
  this.CommandBox = document.createElement("span");
  this.CommandBox.setAttribute("id","header-command-box");
  if (RD3_Glb.IsIE(10, false) && RD3_ServerParams.Theme.startsWith("seattle"))
    this.CommandBox.style.verticalAlign = "auto";
  parent.appendChild(this.CommandBox);
  //
  this.CommandCaption = document.createTextNode("");
  this.CommandBox.appendChild(this.CommandCaption);
  //
  this.CommandInput = document.createElement("input");
  this.CommandInput.setAttribute("id","header-command-input");
  this.CommandInput.maxLength = 6;
  this.CommandInput.accessKey = "C";
  RD3_Glb.AutocompleteOff(this.CommandInput);
  var oc = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCommand', ev)");
  if (document.addEventListener)
    this.CommandInput.addEventListener("keypress", oc, true);
  else
   this.CommandInput.attachEvent("onkeypress", oc); 
  this.CommandBox.appendChild(this.CommandInput);
  //
  this.HelpFileBox = document.createElement("img");
  this.HelpFileBox.setAttribute("id","header-help-button");
  this.HelpFileBox.className = "header-help-button-hl";
  this.HelpFileBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnHelpButton', ev)");
  parent.appendChild(this.HelpFileBox);
  //
  this.DebugImageBox = document.createElement("img");
  this.DebugImageBox.setAttribute("id","header-debug-image");
  this.DebugImageBox.className = "header-debug-image-hl";
  this.DebugImageBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnDebug', ev)");
  parent.appendChild(this.DebugImageBox);
  //
  // In caso di menu' right, lo attacco qui
  if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
  {
    parent.appendChild(this.SuppressMenuBox);
  }
  //
  this.CloseAppBox = document.createElement("img");
  this.CloseAppBox.setAttribute("id","header-close-app");
  this.CloseAppBox.className = "header-close-app-hl";
  if (!mob) this.CloseAppBox.src = RD3_Glb.GetImgSrc("images/closex.gif");
  this.CloseAppBox.removeAttribute("width");
  this.CloseAppBox.removeAttribute("height");
  RD3_TooltipManager.SetObjTitle(this.CloseAppBox, RD3_ServerParams.ChiudiAppl);
  this.CloseAppBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCloseApp', ev)");
  parent.appendChild(this.CloseAppBox);
  //
  // Per gli altri browser devo gestire l'onload per calcolare bene il layout
  if (!RD3_Glb.IsIE(10, false))
  {
    this.ComImg.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
    this.HelpFileBox.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
    this.DebugImageBox.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
    this.CloseAppBox.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
  }
  //
  // Chiamata per customizzazione header
  this.CustomizeHeader(parent);
}

// ********************************************************************************
// Dummy function per customizzazione header... puo' essere ridefinita in CUSTOM3.JS
// ********************************************************************************
WebEntryPoint.prototype.CustomizeHeader = function(parent)
{
}


// ********************************************************************************
// Questa funzione crea gli oggetti DOM per il pulsante chiudi tutto
// ********************************************************************************
WebEntryPoint.prototype.RealizeCloseAll = function(parent)
{
  var mob = RD3_Glb.IsMobile();
  //
  // Creo gli elementi del DOM
  this.CloseAllButton = document.createElement("span");
  this.CloseAllButton.setAttribute("id", "wep:clo");
  this.CloseAllImg = document.createElement("img");       // Immagine del pulsante
  this.CloseAllTxt = document.createElement("span");      // Testo del pulsante
  //
  // Assegno le classi
  this.CloseAllButton.className = "form-list-close-all-button";
  if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
    RD3_Glb.AddClass(this.CloseAllButton, "form-list-close-all-button-right");
  this.CloseAllImg.className = "form-list-close-all-img";
  //
  // Configuro gli elementi
  if (!mob) this.CloseAllImg.src = RD3_Glb.GetImgSrc("images/clall.gif");
  this.CloseAllTxt.appendChild(document.createTextNode(RD3_ServerParams.ChiudiTutto));
  this.CloseAllTxt.className = "form-list-close-all-text";
  //
  // Gestisco i click e gli eventi di hilight
  this.CloseAllButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCloseAll', ev)");
  //
  // Aggiungo gli elementi al DOM
  this.CloseAllButton.appendChild(this.CloseAllImg);
  this.CloseAllButton.appendChild(this.CloseAllTxt);
  parent.appendChild(this.CloseAllButton);
  //
  // Gestisco la visibilita' iniziale del pulsante chiudi tutto
  this.HandleCloseAllVisibility();
}


// ********************************************************************************
// Imposta le dimensioni del FormListBox perche'
// 1: Non ci sia dello spazio vuoto dopo
// 2: Mantenga comunque una dimensione sufficiente per tutto l'elenco delle form aperte
// ********************************************************************************
WebEntryPoint.prototype.AdaptFormListBox = function()
{
  if (this.FormListBox)
  {
    // Ridimensiono il FormListBox perche' non ci siano buchi
    RD3_Glb.AdaptToParent(this.FormListBox, -1, this.MenuBox.offsetHeight);
    //
    // se il contenuto e' piu' grande della dimensione impostata l'allargo, ci pensa
    // poi l'oggetto padre ad avere la scrollbar
    var contentH = this.FormListHeader.offsetHeight + this.CloseAllBox.offsetHeight + this.FormListTitle.offsetHeight;
    if (contentH > this.FormListBox.offsetHeight)
      this.FormListBox.style.height = (contentH + 10) + "px";
    else
      this.SideMenuBox.style.overflowY = "hidden";
  }
  //
  if (this.TaskbarFormListCell)
  {
    // Se ci sono troppe form, essa va a capo, in questo caso devo restringere i vari span
    var n = this.StackForm.length;
    var c = 0;
    for(var i=0; i<n; i++)
    {
      if (this.StackForm[i].FLBox)
        c++;
    }
    //
    if (this.TaskbarFormListCell.scrollHeight>this.SideMenuBox.offsetHeight && c>0)
    {
      var mw = Math.floor(this.TaskbarFormListCell.clientWidth / c) - 10;
      for(var i=0; i<n; i++)
      {
        if (this.StackForm[i].FLBox)
          this.StackForm[i].FLBox.style.width=mw+"px";
      }
    }
    else
    {
      // rimetto dimensione standard
      for(var i=0; i<n; i++)
      {
        if (this.StackForm[i].FLBox)
          this.StackForm[i].FLBox.style.width="";
      }
    }
  }
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
WebEntryPoint.prototype.AdaptLayout = function()
{ 
  if (!this.UseZones())
  {
    if (RD3_Glb.IsMobile() && this.CmdObj.AutoSuppress)
    {
      // Prima gestisco la docked, poi il menu'
      var tosup = RD3_Glb.IsPortrait();
      //
      var fd = this.GetDockedForm(RD3_Glb.FORMDOCK_LEFT, tosup);
      if (fd && fd.Visible==tosup)
        fd.SetVisible(!tosup);
      //
      var oldsup = this.CmdObj.SuppressMenu;
      this.CmdObj.SetSuppressMenu("auto");
      //
      this.CmdObj.ShowMenuButton();
    }
  }
  else if (RD3_Glb.IsMobile())
  {
    // In verticale le zone destra e sinistra se sono pinned devono diventare unpinned.. a meno che la zona non contenga il menu e 
    // sia configurata per mantenere il vecchio comportamento
    if (RD3_Glb.IsPortrait())
    {
      var numz = this.ScreenZones.length;
      for (var idz=0; idz<numz; idz++)
      {
        var scz = this.ScreenZones[idz];
        //
        if (scz && scz.ZoneState==RD3_Glb.SCRZONE_PINNEDZONE && scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALCOLLAPSE)
        {
          scz.OldZoneState = scz.ZoneState;
          scz.OldSelectedForm = scz.SelectedForm;
          scz.SetZoneState(RD3_Glb.SCRZONE_UNPINNEDZONE);
        }
        //
        if (scz && scz.ZoneState==RD3_Glb.SCRZONE_UNPINNEDZONE && scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE)
        {
          scz.OldZoneState = scz.ZoneState;
          scz.OldSelectedForm = scz.SelectedForm;
          scz.SetZoneState(RD3_Glb.SCRZONE_PINNEDZONE);
          scz.SelectFirstForm();
        }
      }
    }
    else
    {
      // In orizzontale devo ripristinare lo stato delle zone se l'ho modificato da framework
      var numz = this.ScreenZones.length;
      for (var idz=0; idz<numz; idz++)
      {
        var scz = this.ScreenZones[idz];
        //
        if (scz && scz.OldZoneState != null)
        {
          scz.SetZoneState(scz.OldZoneState);
          scz.OldZoneState = null;
          //
          if (scz.SelectedForm == RD3_Glb.SCRZONE_SELECTEDNONE)
            scz.SetSelectedForm(scz.OldSelectedForm);
          scz.OldSelectedForm = null;
        }
      }
    }
  }
  //
  if (RD3_Glb.IsMobile())
  {
    if (!window.lastHeight && RD3_Glb.IsIE(10, true))
    {
      window.lastHeight = window.innerHeight;
      window.lastWidth = window.innerWidth;
    }
    //
    // Dimensiono side menu smartphone
    if (RD3_Glb.IsSmartPhone())
    {
      var olds = this.SideMenuWidth;
      this.SetSideMenuWidth(0);
      if (this.SideMenuWidth!=olds)
      {
        if (this.CmdObj.ActiveCommand)
           this.CmdObj.ActiveCommand.SetMenuClass();
      }
    }
    // Dimensiono header box caso mobile
    this.HeaderBox.style.width = this.SideMenuWidth + "px";
  }
  //
  // Devo posizionare le mie box, che dipendono le une dalle altre
  // 1) l'header e' inamovibile
  //
  // In caso di menu' laterale...
  if (this.HasSideMenu())
  {
    // 2) calcolo l'altezza della barra laterale e sistemo i menu'
    //    dopo averlo fatto adatto l'altezza della form list
    var h = this.WepBox.offsetHeight - this.HeaderBox.offsetHeight;
    //
    var p1 = RD3_Glb.GetStyleProp(this.SideMenuBox,"paddingTop");
    var p2 = RD3_Glb.GetStyleProp(this.SideMenuBox,"paddingBottom");
    h = h - (p1?parseInt(p1):0) - (p2?parseInt(p2):0);
    //
    if (h<0) h=0;
    this.SideMenuBox.style.height = h+"px";
    this.CmdObj.AdaptLayout();
    //
    this.AdaptFormListBox();
    //
    this.AdaptScrollBox();
  }
  else
  {
    var h = this.WepBox.offsetHeight - this.HeaderBox.offsetHeight - this.SideMenuBox.offsetHeight;
    //
    // Il menu' e' in alto/basso adatto l'altezza e la posizione della menu bar
    RD3_Glb.AdaptToParent(this.SideMenuBox, 0, -1);
    if (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
      this.SideMenuBox.style.marginTop = h+"px";
    //
    this.CmdObj.AdaptLayout();
  }
  //
  // La sidebar potrebbe essere a destra, oppure in alto...
  // il posizionamento delle altre box ne dipende.
  var SideBarLeft = this.SideMenuBox.offsetWidth;
  var SideBarRight = 0;
  var SideBarTop = this.HeaderBox.offsetHeight;
  var SideBarBottom = 0;
  //
  if (this.UseZones() && RD3_Glb.IsMobile())
  {
    if (this.MenuType == RD3_Glb.MENUTYPE_LEFTSB)
      SideBarLeft = 0;
    if (this.MenuType == RD3_Glb.MENUTYPE_RIGHTSB)
      SideBarRight = this.SideMenuBox.offsetWidth;
    //
    SideBarTop = 0;
  }
  else
  {
    if (this.MenuType!=RD3_Glb.MENUTYPE_LEFTSB)
      SideBarLeft = 0;
    if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
      SideBarRight = this.SideMenuBox.offsetWidth;
    if (this.MenuType==RD3_Glb.MENUTYPE_MENUBAR)
      SideBarTop += this.SideMenuBox.offsetHeight;
    if (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
      SideBarBottom += this.SideMenuBox.offsetHeight;
  }
  //
  // 3) sistemo la status bar e sistemo gli indicatori
  if (this.MenuType!=RD3_Glb.MENUTYPE_TASKBAR)
  {
    this.StatusBarBox.style.top = SideBarTop + "px";
    this.StatusBarBox.style.left = SideBarLeft + "px";
    RD3_Glb.AdaptToParent(this.StatusBarBox, SideBarLeft+SideBarRight+1, -1);
    //
    if (this.HasStatusBar())
      this.IndObj.AdaptLayout();
    //
    // 4) sistemo la toolbar bar e sistemo i bottoni della stessa
    if (this.StatusBarBox.offsetHeight>0 && RD3_ServerParams.Theme.startsWith("seattle"))
      this.ToolBarBox.style.paddingTop = "2px";
    var t = SideBarTop;
    if (this.HasStatusBar())
      t = this.StatusBarBox.offsetTop + this.StatusBarBox.offsetHeight;
    if (RD3_Glb.IsIE(6) && this.StatusBarBox.offsetHeight==2)
      t -= 2;
    this.ToolBarBox.style.top = t + "px";
    this.ToolBarBox.style.left = SideBarLeft + "px";
    RD3_Glb.AdaptToParent(this.ToolBarBox, SideBarLeft+SideBarRight+1, -1);
  }
  else
  {
    // E' la taskbar... devo comunque gestire il layout degli indicatori
    this.IndObj.AdaptLayout();
  }
  //
  var tbbot = SideBarTop;
  if (this.HasToolbar())
    tbbot = this.ToolBarBox.offsetTop + this.ToolBarBox.offsetHeight;
  else if (this.HasStatusBar())
    tbbot = this.StatusBarBox.offsetTop + this.StatusBarBox.offsetHeight;
  //
  // Raramente puo succedere che la toolbar diventi figlia di document (errore del browser): in quel caso l'offsetTop diventa 0
  // anche se non lo dovrebbe essere : allora quando e' 0 proviamo a ricalcolarlo correttamente prendendo le dimensioni della status bar (la toolbar 
  // e' sotto la status bar)
  if (this.HasToolbar() && this.ToolBarBox.offsetTop==0 && this.MenuType!=RD3_Glb.MENUTYPE_TASKBAR)
  {
    // Se non ho la status bar allora parto dall'altezza dell'Header + altezza toolbar (che dovrebbe essere 0)
    if (this.HasStatusBar())
      tbbot = this.StatusBarBox.offsetTop + this.StatusBarBox.offsetHeight + this.ToolBarBox.offsetHeight;
    else
      tbbot = SideBarTop + this.ToolBarBox.offsetHeight;
  }
  //
  var tophei = 0;
  if (this.HasStatusBar())
    tophei = this.StatusBarBox.offsetHeight+this.ToolBarBox.offsetHeight;
  if (RD3_Glb.IsIE(6))
  {
    if (this.ToolBarBox.offsetHeight==2) 
    {
      tbbot -= 2;
      tophei -= 2;
    }
    if (this.StatusBarBox.offsetHeight==2)
      tophei -= 2;
  }
  //
  if (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
  {
    tbbot=SideBarTop;
    tophei=0;
  }
  if (RD3_Glb.IsMobile())
  {
    tbbot=0;
    tophei=0;
  }
  //
  var oldDockLwidth = this.LeftDockedBox.offsetWidth;
  var oldDockTheight = this.TopDockedBox.offsetHeight;
  var oldDockRwidth = this.RightDockedBox.offsetWidth;
  var oldDockBheight = this.BottomDockedBox.offsetHeight;
  //
  // Chiedo alle form docked di adattare il contenitore.
  if (!this.UseZones())
  {
    var n = this.StackForm.length;
    for (var i=0; i<n; i++)
    {
      var f = this.StackForm[i];
      f.AdaptDocked();
    }
  }
  else
  {
    var nz = this.ScreenZones.length;
    for (var iz=0; iz<nz; iz++)
    {
      var sz = this.ScreenZones[iz];
      sz.AdaptDocked();
    }
  }
  //
  // 5) Sistemo le docked forms (la prima DOCK e' in alto!)
  try
  {
    this.TopDockedBox.style.top = tbbot + "px";
    this.TopDockedBox.style.left = SideBarLeft + "px";
    RD3_Glb.AdaptToParent(this.TopDockedBox, SideBarLeft+SideBarRight+1, -1);
    //
    // 6) Sistemo le docked forms (la seconda DOCK e' in basso!)
    var t = this.WepBox.offsetHeight-this.BottomDockedBox.offsetHeight-SideBarBottom;
    if (RD3_Glb.IsIE(6) && this.BottomDockedBox.offsetHeight==2)
      t += 2;
    this.BottomDockedBox.style.top = t + "px";
    this.BottomDockedBox.style.left = this.TopDockedBox.style.left;
    RD3_Glb.AdaptToParent(this.BottomDockedBox, SideBarLeft+SideBarRight+1, -1);
  } catch(ex) {}
  //
  // 7) Sistemo le docked forms (la terza DOCK e' a sinistra)
  try
  {
    var t = this.TopDockedBox.offsetTop + this.TopDockedBox.offsetHeight;
    //
    if (this.UseZones())
    {
      // Nel caso le zone siano unpinned devo posizionare la Zona parzialmente sotto..
      var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_TOP);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.TopDockedBox.offsetHeight > RD3_ClientParams.ZoneUnpinnedSize(false))
        t = this.TopDockedBox.offsetTop + RD3_ClientParams.ZoneUnpinnedSize(false);
      //
      if (RD3_Glb.IsAndroid())
        t = t>0 ? t+1 : t;
    }
    if (RD3_Glb.IsIE(6) && this.TopDockedBox.offsetHeight==2)
      t -= 2;
    this.LeftDockedBox.style.top = t + "px";
    this.LeftDockedBox.style.left = SideBarLeft + "px";
    //
    var botH = this.BottomDockedBox.offsetHeight;
    if (this.UseZones())
    {
      var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_BOTTOM);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
        botH = botH==0 ? 0 : RD3_ClientParams.ZoneUnpinnedSize(false)-1;
      else
        botH = botH==0 ? 0 : botH-1;
      if (RD3_Glb.IsAndroid())
        botH = botH>0 ? botH+1 : botH;
    }
    //
    RD3_Glb.AdaptToParent(this.LeftDockedBox, -1, t+1+SideBarBottom+botH);
    //
    // 8) Sistemo le docked forms (la quarta DOCK e' a destra)
    var w = this.WepBox.offsetWidth - this.RightDockedBox.offsetWidth - SideBarRight;
    if (RD3_Glb.IsIE(6) && this.RightDockedBox.offsetWidth==2)
      w += 2;
    this.RightDockedBox.style.top = this.LeftDockedBox.style.top;
    this.RightDockedBox.style.left = w + "px";
    var t = this.TopDockedBox.offsetTop+this.TopDockedBox.offsetHeight;
    if (this.UseZones() && RD3_Glb.IsAndroid())
        t = t>0 ? t+1 : t;
    if (RD3_Glb.IsIE(6) && this.TopDockedBox.offsetHeight==2)
      t -= 2;
    RD3_Glb.AdaptToParent(this.RightDockedBox, -1, t+1+SideBarBottom+botH);
  } catch(ex) {}
  //
  // 9) Sistemo lo spazio per le form e le adatto
  try
  {
    var t = this.TopDockedBox.offsetTop + this.TopDockedBox.offsetHeight;
    var w = this.LeftDockedBox.offsetLeft + this.LeftDockedBox.offsetWidth;
    //
    if (this.UseZones())
    {
      // Nel caso le zone siano unpinned devo posizionare l'MDI parzialmente sotto..
      var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_TOP);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.TopDockedBox.offsetHeight > RD3_ClientParams.ZoneUnpinnedSize(false))
        t = this.TopDockedBox.offsetTop + RD3_ClientParams.ZoneUnpinnedSize(false);
      if (RD3_Glb.IsAndroid())
        t = t>0 ? t+1 : t;
      //
      scz = this.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.LeftDockedBox.offsetWidth > RD3_ClientParams.ZoneUnpinnedSize(true))
        w = this.LeftDockedBox.offsetLeft + RD3_ClientParams.ZoneUnpinnedSize(true);
      else if (scz.HasMobileMenu && (scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE || scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALPOPOVER) && RD3_Glb.IsPortrait())
        w = 0;
      if (RD3_Glb.IsAndroid())
        w = w>0 ? w+1 : w;
    }
    //
    if (RD3_Glb.IsSmartPhone())
    {
      t=0;
      w=0;
    }
    //
    if (RD3_Glb.IsIE(6))
    {
      if (this.TopDockedBox.offsetHeight==2) t -= 2;
      if (this.LeftDockedBox.offsetWidth==2) w -= 2;
    }
    this.FormsBox.style.top = t + "px";
    this.FormsBox.style.left = w + "px";
    //
    w = this.LeftDockedBox.offsetWidth+this.RightDockedBox.offsetWidth;
    t = this.BottomDockedBox.offsetHeight+this.TopDockedBox.offsetHeight;
    //
    if (this.UseZones())
    {
      t = 0;
      w = 0;
      //
      // Nel caso le zone siano unpinned devo posizionare l'MDI parzialmente sotto..
      var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_BOTTOM);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.BottomDockedBox.offsetHeight > RD3_ClientParams.ZoneUnpinnedSize(false))
        t += RD3_ClientParams.ZoneUnpinnedSize(false);
      else
        t += this.BottomDockedBox.offsetHeight;
      //
      scz = this.GetScreenZone(RD3_Glb.FORMDOCK_TOP);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.TopDockedBox.offsetHeight > RD3_ClientParams.ZoneUnpinnedSize(false))
        t += RD3_ClientParams.ZoneUnpinnedSize(false);
      else
        t += this.TopDockedBox.offsetHeight;
      if (RD3_Glb.IsAndroid())
        t = t>0 ? t+1 : t;
      //
      scz = this.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.LeftDockedBox.offsetWidth > RD3_ClientParams.ZoneUnpinnedSize(true))
        w += RD3_ClientParams.ZoneUnpinnedSize(true);
      else if (scz.HasMobileMenu && (scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE || scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALPOPOVER) && RD3_Glb.IsPortrait())
        w += 0;
      else
        w += this.LeftDockedBox.offsetWidth;
      //
      scz = this.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
      if (scz.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.RightDockedBox.offsetWidth > RD3_ClientParams.ZoneUnpinnedSize(true))
        w += RD3_ClientParams.ZoneUnpinnedSize(true);
      else if (scz.HasMobileMenu && (scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE || scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALPOPOVER) && RD3_Glb.IsPortrait())
        w += 0;
      else
        w += this.RightDockedBox.offsetWidth;
      //
      if (RD3_Glb.IsAndroid())
        w = w>0 ? w+1 : w;
    }
    //
    if (RD3_Glb.IsIE(6))
    {
      if (this.LeftDockedBox.offsetWidth==2) w -= 2;
      if (this.RightDockedBox.offsetWidth==2) w -= 2;
      if (this.TopDockedBox.offsetHeight==2) t -= 2;
      if (this.BottomDockedBox.offsetHeight==2) t -= 2;
    }
    if (!RD3_Glb.IsMobile())
      tophei+=SideBarTop+1;
    if (RD3_Glb.IsSmartPhone())
      RD3_Glb.AdaptToParent(this.FormsBox, 0, 0);
    else
      RD3_Glb.AdaptToParent(this.FormsBox, SideBarLeft+SideBarRight+w+1, t+tophei+SideBarBottom);
    if (this.WelcomeBox)
      RD3_Glb.AdaptToParent(this.WelcomeBox);
  } catch(ex) {}
  //
  // 10) Sistemo il divider box nell'header (faccio i controlli per verificare la presenza degli oggetti: 
  //     l'utente potrebbe aver customizzato l'header..)
  this.AdaptHeader();
  //
  // Aggiorno le dimensioni della MDI area sul server
  this.SendResize();
  //
  if (this.UseZones())
  {
    var nz = this.ScreenZones.length;
    for (var iz=0; iz<nz; iz++)
    {
      var sz = this.ScreenZones[iz];
      sz.AdaptLayout();
    }
  }
  //
  // 11) Ora tocca alle form aperte
  var n = this.StackForm.length;
  for (var i=0; i<n; i++)
  {
    var f = this.StackForm[i];
    //
    // Se la form e' massimizzata, allora vedo se deve essere spostata
    if (f.Modal && f.WindowState == RD3_Glb.WS_MAXIMIZE)
      f.SetWindowState();
    //
    f.AdaptLayout();
  }
  //
  this.AdaptFormListBox();
  //
  this.VoiceObj.AdaptLayout();
  //
  // Se siamo su mobile animiamo qui le Zone
  if (RD3_Glb.IsMobile() && this.UseZones())
  {
    var sczs = this.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
    sczs.SlideZone(oldDockLwidth, this.LeftDockedBox.offsetWidth);
    //
    sczs = this.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
    sczs.SlideZone(oldDockRwidth, this.RightDockedBox.offsetWidth);
    //
    sczs = this.GetScreenZone(RD3_Glb.FORMDOCK_TOP);
    sczs.SlideZone(oldDockTheight, this.TopDockedBox.offsetHeight);
    //
    sczs = this.GetScreenZone(RD3_Glb.FORMDOCK_BOTTOM);
    sczs.SlideZone(oldDockBheight, this.BottomDockedBox.offsetHeight);
  }
}


// ********************************************************************************
// Adatta l'Header
// ********************************************************************************
WebEntryPoint.prototype.AdaptHeader = function()
{
  if (this.DividerBox)
    this.DividerBox.style.paddingRight = "0px";
  //
  if (!RD3_Glb.IsMobile())
    RD3_Glb.AdaptToParent(this.HeaderBox, 0, -1);
  //
  if (this.DividerBox)
  {
    // Calcolo la coordinata piu' a destra dei figli dell'header box che seguono il DIVIDER
    var n = this.HeaderBox.childNodes.length;
    var maxx = -10000;
    var mobj = null;
    for (var i=0; i<n; i++) 
    {
      var c = this.HeaderBox.childNodes[i];
      //
      // Se questo oggetto e' piu' a destra del DIVIDER, allora ne tengo conto
      if (c!==this.DividerBox && (c.offsetLeft >= this.DividerBox.offsetLeft) && (c.style.display!="none"))
      {
        var mx = c.offsetLeft+c.offsetWidth;
        //
        // Se presente devo considerare anche il margine
        if (!isNaN(parseFloat(RD3_Glb.GetStyleProp(c, "marginRight"), 10)))
          mx += parseFloat(RD3_Glb.GetStyleProp(c, "marginRight"), 10);
        //
        // Memorizzo la massima coordinata RIGHT dell'oggetto
        if (maxx < mx) 
        {
          maxx = mx;
          mobj = c;
        }
      }
    }
    //
    // Se l'oggetto piu' a destra e' il command box, impongo un diverso margine destro
    this.CommandBox.style.marginRight = (mobj==this.CommandBox)?"8px":"";
    if (mobj==this.CommandBox)
      maxx += 8;
    //
    // Ora posso calcolare quanto e' largo il DIVIDER
    var offR = this.HeaderBox.clientWidth - maxx;
    if (offR<8) offR = 8;
    this.DividerBox.style.paddingRight = (offR - 8) + "px";
  }
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
WebEntryPoint.prototype.Unrealize = function()
{ 
  // Tolgo gli eventi motion
  if (window.removeEventListener)
  { 
    window.removeEventListener("devicemotion", RD3_DeviceMotion);
    window.removeEventListener("deviceorientation", RD3_DeviceOrientation);
  }
  //
  // Tolgo WepBox dal DOM
  this.WepBox.parentNode.removeChild(this.WepBox);
  //
  // Mi tolgo dalla mappa degli oggetti
  RD3_DesktopManager.ObjectMap[this.Identifier] = null;
  //
  // Passo il comando a tutti i miei figli
  this.IndObj.Unrealize();
  this.CmdObj.Unrealize();
  this.TimerObj.Unrealize();
  this.VSList.Unrealize();
  this.VoiceObj.Unrealize();
  //
  var n = this.StackForm.length;
  for (var i = 0; i < n; i++)
  {
    this.StackForm[i].Unrealize();
  }
  //
  // Distruggo la DelayDialog
  this.DelayDialog.Unrealize();
  //
  // Rimuovo i collegamenti al DOM
  this.WepBox = null;  
  this.HeaderBox = null;
  this.SideMenuBox = null;
  this.StatusBarBox = null;
  this.ToolBarBox = null;
  this.FormsBox = null;
  this.MenuBox = null;
  this.FormListBox = null;
  this.FormListHeader = null;
  this.FormListTitle = null;
  this.CloseAllBox = null;
  this.CloseAllButton = null;
  //
  this.Realized = false;
}


// ********************************************************************************
// Devo segnarmi che sto iniziando la gestione di una riposta del server
// ********************************************************************************
WebEntryPoint.prototype.BeforeProcessResponse= function()
{ 
  if (this.Realized)
  {
    this.InResponse = true;
    this.HeaderH = this.HeaderBox.offsetHeight;
    this.SideMenuBoxW = this.SideMenuBox.offsetWidth;
    this.StatusBarBoxH = this.StatusBarBox.offsetHeight;
    this.ToolBarBoxH = this.ToolBarBox.offsetHeight;
    this.LeftDockW = this.LeftDockedBox.offsetWidth;
    this.RightDockW = this.RightDockedBox.offsetWidth;
    this.TopDockH = this.TopDockedBox.offsetHeight;
    this.BottomDockH = this.BottomDockedBox.offsetHeight;
  }
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
WebEntryPoint.prototype.AfterProcessResponse= function(force)
{ 
  if (this.DeferAfterProcess || RD3_GFXManager.Animating())
  {
    this.DeferAfterProcess = false;
    //
    window.setTimeout("RD3_DesktopManager.WebEntryPoint.AfterProcessResponse("+force+")", 20);
    return;
  }
  //
  if (this.InResponse || force)
  {
    var recalc = false;
    //
    recalc = recalc || (this.HeaderH != this.HeaderBox.offsetHeight);
    recalc = recalc || (this.SideMenuBoxW != this.SideMenuBox.offsetWidth);
    recalc = recalc || (this.StatusBarBoxH != this.StatusBarBox.offsetHeight);
    recalc = recalc || (this.ToolBarBoxH != this.ToolBarBox.offsetHeight);
    recalc = recalc || (this.LeftDockW != this.LeftDockedBox.offsetWidth);
    recalc = recalc || (this.RightDockW != this.RightDockedBox.offsetWidth);
    recalc = recalc || (this.TopDockH != this.TopDockedBox.offsetHeight);
    recalc = recalc || (this.BottomDockH != this.BottomDockedBox.offsetHeight);
    recalc = recalc || this.RecalcLayout;
    //
    // Mi e' stato chiesto di rinfrescare le toolbar?
    if (this.RefreshCommands)
    {
      this.CmdObj.ActiveFormChanged();
      this.IndObj.ActiveFormChanged();
      //
      this.RefreshCommands = false;
    }
    //
    this.RecalcLayout = false;
    if (recalc || force)
    {
      this.AdaptLayout();
    }
    //
    // Se necessario faccio rimettere a posto anche la toolbar della welcome mobile
    if (RD3_Glb.IsMobile() && this.WelcomeForm && this.WelcomeForm.Realized && this.WelcomeForm.AdaptToolbar)
      this.WelcomeForm.AdaptToolbarLayout();
    //
    // Giro il messaggio alle form aperte
    var n = this.StackForm.length;
    for (var i=0; i<n; i++)
      this.StackForm[i].AfterProcessResponse();
    //
    // Giro il messaggio al KBManager
    RD3_KBManager.AfterProcessResponse();
    if (this.UseZones())
    {
      for (var szi=0; szi < this.ScreenZones.length; szi++)
        this.ScreenZones[szi].AfterProcessResponse();
    }
    //
    // Rendo visibile il wep se era ancora nascosto
    if (this.WepBox.style.visibility == "hidden")
    {
      this.WepBox.style.visibility = "";
      //
      // Blocco il timer di animazione caricamento se presente
      if (typeof(WaitTimer)!= "undefined" && WaitTimer)
      {
        window.clearTimeout(WaitTimer);
        WaitTimer = null;
      }
      //
      // Elimino il wait box se presente
      var wb = document.getElementById("wait-box");
      if (wb)
      {
        if (RD3_Glb.IsMobile())
        {
          this.WepBox.style.opacity = 1;
          wb.style.opacity = 0;
          window.setTimeout("document.getElementById('wait-box').parentNode.removeChild(document.getElementById('wait-box'))",500);
        }
        else
        {
          wb.parentNode.removeChild(wb);
        }
      }
      //
      // Inizio effetto iniziale fading
      if (!RD3_Glb.IsMobile())
      {
        var fx = new GFX("start", true, document.body, false);
        RD3_GFXManager.AddEffect(fx);
      }
      this.SoundAction("login","play");
      //
      // Finche' e' invisibile safari non aggiusta bene l'header
      if (RD3_Glb.IsSafari() || RD3_Glb.IsChrome() || RD3_Glb.IsFirefox(4) || RD3_Glb.IsIE(8))
        this.OnResize();
      //
      // Dico che e' ora di dare il fuoco a qualcuno
      RD3_KBManager.CheckFocus = true;
    }  
    //
    // Se ho dei comandi ritardati li eseguo ora
    while (this.ExecuteRitardati.length > 0)
    {
      try
      {
        eval(this.ExecuteRitardati.shift());
      }
      catch(e)
      {
        console.error(e);
      }
    }
    //
    RD3_KBManager.ActiveButton = null;
    //
    this.InResponse = false;
  }
}


// ********************************************************************************
// Il browser e' stato ridimensionato
// ********************************************************************************
WebEntryPoint.prototype.OnResize = function(evento)
{ 
  // Devo gestire in modo particolare la tastiera
  if (RD3_Glb.IsMobile())
  {
    if (RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7) || RD3_Glb.IsIphone(12) || RD3_Glb.IsIpad(12))
    {
      // Dentro Safari e' tutto piu' semplice: posso fidarmi delle dimensioni della window
      if (!RD3_ShellObject.IsInsideShell())
      {
        document.body.style.height = window.innerHeight + "px";
        document.body.style.width = window.innerWidth + "px";
        //
        // Azzeriamo lo scroll.. ogni tanto ios lo tiene quanche px troppo in alto
        document.body.scrollTop = 0;
      }
      else
      {
        // Resize su iOS7 con la tastiera chiusa: allora e' un vero resize dovuto al cambio di orientamento..
        // devo dimensionare wep bene (scambio i valori.. non li richiedo perche' potrebbero essere incasinati dalla tastiera..)
        var portrait = RD3_Glb.IsPortrait(true);
        var h = parseInt(document.body.style.height);
        var w = parseInt(document.body.style.width);
        var maj = h>w ? h : w;
        var min = h>w ? w : h;
        //
        if (portrait)
        {
          document.body.style.height = maj + "px";
          document.body.style.width = min + "px";
        }
        else
        {
          document.body.style.height = min + "px";
          document.body.style.width = maj + "px";
        }
      }
    }
    //
    if (RD3_Glb.IsAndroid() || RD3_Glb.IsIE(10, true))
    {
      var noResize = false;
      //
      if (!window.lastHeight)
      {
        window.lastHeight = window.innerHeight;
        window.lastWidth = window.innerWidth;
      }
      else
      {
        // Blocco i resize dovuti all'accorciarsi della View con lo stesso orientamento
        noResize = (window.innerWidth == window.lastWidth && window.innerHeight < window.lastHeight);
      }
      //
      if (window.pageYOffset>0 || noResize)
      {
        // e' un resize dovuto all'apertura della tastiera: se c'e' un campo fuocato dobbiamo scrollare per portarlo nella porzione
        // visibile
        if (document.activeElement)
        {
          var yb = RD3_Glb.GetScreenTop(document.activeElement,true) + document.activeElement.offsetHeight;
          var dy = window.innerHeight;
          //
          if (yb>dy && this.WepBox.scrollTop != yb-dy)
          {
            this.ScrollMobilePage = true;
            this.WepBox.scrollTop = yb-dy;
          }
        }
        //
        // Ora sappiamo che la tastiera e' aperta
        this.openKeyboard = true;
        //
        // Qui dobbiamo saltare il resize: la tastiera e' aperta
        return;
      }
      else
      {
        window.lastHeight = window.innerHeight;
        window.lastWidth = window.innerWidth;
        //
        // e' un resize standard: devo eliminare lo scroll se presente
        if (this.WepBox.scrollTop != 0)
        {
          this.ScrollMobilePage = true;
          this.WepBox.scrollTop = 0;
        }
        //
        // Sono mobile e ho una tastiera aperta con combo aperta, al prossimo resize non devo chiudere la combo perche'
        // il resize e' dato dalla chiusura della tastiera
        if (RD3_Glb.IsMobile() && RD3_DDManager.OpenCombo && this.openKeyboard)
          this.notCloseComboOnResize = true;
        this.openKeyboard = false;
        //
        // Devo verificare se quando si e' chiusa la tastiera e c'era un PopupControl aperto.
        // In quel caso devo riposizionarlo nel punto giusto
        if (RD3_Glb.IsSmartPhone() && this.OpenPopupControl && (this.OpenPopupControl.ObjToAttach || this.OpenPopupControl.Cell))
          this.OpenPopupControl.AttachTo(this.OpenPopupControl.ObjToAttach ? this.OpenPopupControl.ObjToAttach : this.OpenPopupControl.Cell.IntCtrl);
      }
    }
    else
    {
      // Sono su IOS: se c'e' la tastiera aperta salto il resize
      if (window.pageYOffset>0 && RD3_ShellObject.IsInsideShell())
        return;
    }
  }
  //
  // Resize, chiudo anche i popup aperti che potrebbero andare fuori posto
  this.CmdObj.ClosePopup();
  //
  if (RD3_Glb.IsMobile() && !RD3_Glb.IsIE())
  {
    // Caso mobile: resize immediato
    this.TickResize();
  }
  else
  {
    // ritardato
    if (this.ResizeTimerId>0)
      window.clearTimeout(this.ResizeTimerId);
    this.ResizeTimerId = window.setTimeout("RD3_DesktopManager.WebEntryPoint.TickResize()", 200);
  }
}


// ********************************************************************************
// Il browser e' stato ridimensionato
// ********************************************************************************
WebEntryPoint.prototype.TickResize = function(delayed)
{ 
  if (delayed==undefined)
    delayed = false;
  //
  if (this.ResizeTimerId)
    window.clearTimeout(this.ResizeTimerId);
  this.ResizeTimerId = 0;
  if (!this.InResponse)
  {
    if (RD3_Glb.IsAndroid() && !delayed)
    {
      this.ResizeTimerId = window.setTimeout("RD3_DesktopManager.WebEntryPoint.TickResize(true)", 250);
      return;
    }
    //
    // Se faccio un resize perdo l'eventuale OnChanges: allora lo forzo dando il fuoco al wep, memorizzandomi l'elemento che
    // aveva il fuoco
    var oldfoc = RD3_KBManager.ActiveElement;
    this.WepBox.focus();
    //
    this.InResize = true;
    this.AdaptLayout();
    this.InResize = false;
    //
    // Se c'e' una combo aperta, chiudo anche quella
    if (RD3_DDManager.OpenCombo && !this.notCloseComboOnResize)
    {
      // Se sono su mobile e la combo non e' popover)
      if (RD3_Glb.IsMobile() && !RD3_DDManager.OpenCombo.UsePopover)
        RD3_DDManager.OpenCombo.AdaptMobileCombo();
      else
        RD3_DDManager.OpenCombo.Close();
    }
    else if (RD3_DDManager.OpenCombo && this.notCloseComboOnResize) {
      // IN questo caso e' necessario fare il blur dell'input (o dare il fuoco al body)
      // in modo che allo scroll non si riapra la tastiera
      if (RD3_DDManager.OpenCombo.ComboPopupInput)
        RD3_DDManager.OpenCombo.ComboPopupInput.blur();
      RD3_KBManager.activeElement = null;
    }
    RD3_DDManager.ClosePopup();
    //
    // Ripristino l'elemento che aveva il fuoco in precedenza
    RD3_KBManager.ActiveElement = oldfoc;
    this.notCloseComboOnResize = false;
  }
  else
  {
    this.ResizeTimerId = window.setTimeout("RD3_DesktopManager.WebEntryPoint.TickResize()", 50);
  }
}


// ********************************************************************************
// Manda al server un evento di resize di Wep
// ********************************************************************************
WebEntryPoint.prototype.SendResize = function()
{
  // Per dare al server le dimensioni corrette devo conoscere i padding..
  var padr = 0;
  var padl = 0;
  var padt = 0;
  var padb = 0;
  try
  {
    padr = parseInt(RD3_Glb.GetStyleProp(this.FormsBox, "paddingRight"));
    padl = parseInt(RD3_Glb.GetStyleProp(this.FormsBox, "paddingLeft"));
    padt = parseInt(RD3_Glb.GetStyleProp(this.FormsBox, "paddingTop"));
    padb = parseInt(RD3_Glb.GetStyleProp(this.FormsBox, "paddingBottom"));
  }
  catch(ex)
  {
  }
  //
  var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, null, this.FormsBox.clientWidth-padr, this.FormsBox.clientHeight-padb, RD3_Glb.GetScreenLeft(this.FormsBox)+padl, RD3_Glb.GetScreenTop(this.FormsBox)+padt, null, false, this.WepBox.clientWidth, this.WepBox.clientHeight);
}


// ********************************************************************************
// Una form deve essere aperta
// ********************************************************************************
WebEntryPoint.prototype.OpenForm = function(objnode, openas)
{ 
  // Definisce una form aperta
  var newform = new WebForm();
  //
  // Verifico se ho previsto la chiusura della form che devo aprire.. qui 
  // posso gestire solo le Form MDI, le form modali, docked o popup fanno partire 
  // subito la loro animazione di chiusura
  if (this.CloseFormId!="" && this.CloseFormId==objnode.getAttribute("id"))  
  {
    // Faccio subito l'unrealize della form da chiudere, altrimenti 
    // sovrascriverei gli oggetti nella mappa con la mia loadfromxml
    var ftc = RD3_DesktopManager.ObjectMap[this.CloseFormId];
    if (ftc)
      ftc.Unrealize();
    //
    // La tolgo dallo stack delle form
    var n = this.StackForm.length;
    for (var i=0; i<n; i++)
    {
      var f = this.StackForm[i];
      if (f.Identifier==this.CloseFormId)
      {
        this.StackForm.splice(i, 1);
        break;
      } 
    }
    //
    // Elimino gli eventuali puntatori alla form che ho chiuso
    if (this.ActiveForm && this.ActiveForm.Identifier==this.CloseFormId)
      this.ActiveForm = null;
    if (this.VisibleForm && this.VisibleForm.Identifier==this.CloseFormId)
      this.VisibleForm = null;
    //
    // Annullo la chiusura della form (l'ho chiusa io senza animazione..)
    this.CloseFormId = "";
  }
  //
  // Nel caso sia una form modale o popup devo gestire eventuali close
  // fatte prima di me terminandole
  if (objnode.getAttribute("mod")!="0")
    RD3_GFXManager.FinishModalClosing(objnode.getAttribute("id"));
  //
  newform.LoadFromXml(objnode);
  this.StackForm.push(newform); // Anche le form modali vanno qui
  //
  if (openas)
    newform.Modal = openas;
  //
  newform.Realize();
  //
  // Attivo la form appena aperta portandola in primo piano (solo se e' visibile!)
  if (newform.Visible)
  {
    this.SoundAction("open","play");
    //
    if (this.UseZones() && newform.Docked)
    {
      this.ActivateForm(newform, true);
    }
    else
    {
      var lastForm = (newform.Owner && newform.HasBackButton() ? RD3_DesktopManager.ObjectMap[newform.Owner] : null);
      if (lastForm && lastForm.Modal == 0 && newform.Modal == 0)
      {
        newform.AdaptLayout();
        RD3_DesktopManager.WebEntryPoint.AnimateForms(lastForm.Identifier, newform.Identifier, true);
      }
      else
      {
        this.ActivateForm(newform, true);
      }
    }
  }
  //
  if (RD3_Glb.IsMobile())
    this.CmdObj.SetSuppressMenu("auto");
}


// ********************************************************************************
// Una form deve essere chiusa
// ********************************************************************************
WebEntryPoint.prototype.CloseForm = function(ident)
{ 
  // Se sto chiudendo la form attualmente visibile la chiudo con animazione, altrimenti la chiudo normalmente
  var n = this.StackForm.length;
  for (var i=0; i<n; i++)
  {
    var f = this.StackForm[i];
    if (f.Identifier==ident)
    {
      if (this.UseZones() && f.Docked)
      {
        this.CloseForm2(f);
        break;
      }
      else
      {
        // Uso l'animazione di ritorno (Mobile, per form aperta da altra form) solo se la form a cui devo ritornare non
        // e' gia' stata chiusa: in quel caso mi chiudo e basta..
        var lastForm = (f.Owner && f.HasBackButton() ? RD3_DesktopManager.ObjectMap[f.Owner] : null);
        if (lastForm && lastForm.Realized && lastForm.Modal == 0 && f.Modal == 0 && this.ActiveForm && f.Identifier==this.ActiveForm.Identifier)
          this.AnimateForms(lastForm.Identifier, f.Identifier,false);
        else
          this.CloseForm2(f);
        break;
      }
    }
  }
}


// ********************************************************************************
// Una form deve essere chiusa
// ********************************************************************************
WebEntryPoint.prototype.CloseForm2 = function(f)
{ 
  // Ritrovo l'indice della form
  var i=0;
  for (i=0; i<this.StackForm.length; i++)
  {
    if (this.StackForm[i]==f)
      break;
  }
  //
  // Trovata la form da chiudere: la chiudo con animazione se non e' dockata ne' modale ed e' visibile, 
  // altrimenti la chiudo
  if ((!f.Docked && !f.Modal) && f.FormBox.style.display != "none")
  {
    // Nel tema mobile a causa dell'animazione di BackButton puo' succedere che venga chiamata la CloseForm2 di piu' Form
    // e siano entrambe visibili.. (in seattle c'e' sempre una ed una sola form principale visibile.. tranne durante l'animazione che viene fatta alla fine di tutto - activate, 
    // in Mobile l'animazione parte subito se c'e' il backbutton.. questo implica che mentre stiamo elaborando la risposta del server ci sono due form visibili..)
    // Allora se mi sono segnato di chiudere una Form all'activate devo chiuderla qui.
    if (RD3_Glb.IsMobile() && this.CloseFormId != "" && this.CloseFormId != f.Identifier && (!this.ActiveForm || this.ActiveForm.Identifier != this.CloseFormId))
    {
      var j=0;
      var closingF;
      for (j=0; j<this.StackForm.length; j++)
      {
        if (this.StackForm[j].Identifier == this.CloseFormId)
        {
          closingF = this.StackForm[j];
          break;
        }
      }
      //
      if (closingF)
      {
        // Gestisco la chiusura di timer di form
        this.TimerObj.FormClosed(closingF);
        //
        // La distruggo
        closingF.Unrealize();
        //
        // Tolgo la form dallo stackform
        this.StackForm.splice(j, 1);
      } 
    }
    //
    // Mi memorizzo l'id della form da chiudere
    this.CloseFormId = f.Identifier;
  }
  else
  {
    // Se e' modale la chiudo con l'animazione corretta
    if (f.Modal)
    {
      // Tolgo la form dallo stackform
      this.StackForm.splice(i, 1);
      //
      // Se sono la form attiva elimino il riferimento
      if(this.ActiveForm && this.ActiveForm.Identifier == f.Identifier)
      {  
        this.ActiveForm = null;
        //
        this.CmdObj.ActiveFormChanged();
        this.IndObj.ActiveFormChanged();
      }
      //
      if (RD3_Glb.IsMobile())
      {
        // Chiude la form con animazione...
        f.PopupFrame.Close();
      }
      else
      {
        var fx = new GFX("modal", false, f, false, null, f.ModalAnimDef);
        fx.CloseFormAnimation = true;
        RD3_GFXManager.AddEffect(fx);
      }
    }
    //
    if (f.Docked)
    {
      if (!this.UseZones())
      {
        // Gestisco la chiusura di timer di form
        this.TimerObj.FormClosed(f);
        //
        // Se sono la form attiva elimino il riferimento
        if(this.ActiveForm && this.ActiveForm.Identifier == f.Identifier)
          this.ActiveForm = null;
        //
        var fx = new GFX("docked", false, f, false);
        fx.IdxForm = f.Identifier;
        fx.CloseFormAnimation = true;
        RD3_GFXManager.AddEffect(fx);
      }
      else
      {
        var scz = this.GetScreenZone(f.DockType);
        scz.CloseForm(f);
      }
    }
    //
    if (!f.Docked && !f.Modal)
    {
      // Gestisco la chiusura di timer di form
      this.TimerObj.FormClosed(f);
      //
      // Se sono la form attiva elimino il riferimento
      if(this.ActiveForm && this.ActiveForm.Identifier == f.Identifier)
        this.ActiveForm = null;
      //
      // La distruggo
      f.Unrealize();
      //
      // Tolgo la form dallo stackform
      this.StackForm.splice(i, 1);
    }
  }
  //
  this.SoundAction("close","play");
}

// ********************************************************************************
// Una form deve essere attivata
// ********************************************************************************
WebEntryPoint.prototype.ActivateForm = function(ident, isopening)
{
  // Se c'e' in corso un animazione, non posso proseguire adesso...
  if (this.AniForm1)
  {
    this.FormToActivate = ident;
    //
    // L'unica cosa che posso fare e' gestire il MenuButton.. altrimenti compare a fine animazione ed e' bruttino..
    var nf = (ident && ident.Identifier)?ident:RD3_DesktopManager.ObjectMap[ident];
    if (nf && nf.Realized)
    {
      if (RD3_Glb.IsMobile() && nf.Modal==0 && !nf.Docked)
      {
        // Assegno alla form da attivare il menuButton.. tanto se lo prenderebbe comunque a fine animazione
        nf.CaptureToolbarButton(RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton);
        if (RD3_DesktopManager.WebEntryPoint.InResponse)
          nf.AdaptToolbar = true;
        else
          nf.AdaptToolbarLayout();
      }
    }
    return;
  }
  //
  if (!isopening)
    isopening = false;
  //
  if (this.Realized)
  {
    // nf e' la nuova form da attivare
    var nf = (ident && ident.Identifier)?ident:RD3_DesktopManager.ObjectMap[ident];
    //
    // Se sto attivando una form non docked, chiudo l'eventuale popover aperto
    if (RD3_Glb.IsMobile() && nf && !nf.Docked)
      RD3_DDManager.ClosePopup();
    //
    // Era gia' attiva... non faccio nulla
    if (nf==this.ActiveForm && this.ActiveForm)
      return;
    //
    var m = nf?nf.Modal!=0:false;
    var d = nf?nf.Docked:false;
    //
    // Attivazione di una MODALE
    if (m)
    {
      this.ActiveForm = nf;
      //
      var fx = new GFX("modal", true, nf, !isopening, null, nf.ModalAnimDef);
      RD3_GFXManager.AddEffect(fx);
      //
      return;
    }
    //
    // Attivazione di una DOCKED
    if (d)
    {
      this.ActiveForm = nf;
      //
      if (!this.UseZones())
      {
        // Se non c'e' l'animazione iniziale faccio l'animazione di apertura docked
        if (this.ActiveForm && this.WepBox.style.visibility!="hidden")
        {
          // Se devo aprire una docked sinistra ma il popover e' gia' aperto allora devo farlo in modo speciale
          if (RD3_Glb.IsMobile() && !RD3_Glb.IsSmartPhone() && this.CmdObj.PopupObj != null && this.ActiveForm.DockType==RD3_Glb.FORMDOCK_LEFT)
          {
            var popupObj = this.CmdObj.PopupObj;
            //
            // Nascondo la docked e la rendo Popover
            this.ActiveForm.SetVisible(false);
            this.CmdObj.ConvertFormPopover(true, this.ActiveForm);
            this.CmdObj.SetMenuButtonCaption(this.ActiveForm.Caption);
            //
            // Rimetto a posto il vecchio contenuto
            try
            {
              if (popupObj.OrgContentParent)
              {
                while(popupObj.ContentBox.firstChild)
                {
                  var objV = popupObj.ContentBox.firstChild;
                  popupObj.ContentBox.removeChild(objV);
                  popupObj.OrgContentParent.appendChild(objV);
                }
              }
              //
              // Rimetto a posto la vecchia Caption
              if (popupObj.OrgHeaderParent)
              {
                var objCpt = popupObj.CaptionBox.firstChild;
                popupObj.CaptionBox.removeChild(objCpt);
                popupObj.OrgHeaderParent.insertBefore(objCpt, popupObj.OrgHeaderSibling);
              }
            }
            catch (ex) { }
            //
            // Adesso il Popup puo' prendere la nuova Form
            popupObj.HostForm(this.ActiveForm);
          }
          else
          {
            var fx = new GFX("docked", true, nf, false, null, nf.DockedAnimDef);
            RD3_GFXManager.AddEffect(fx);
          }
        }
        else  // Ci sara' l'animazione iniziale: la docked deve comparire subito..
        {
          nf.SetActive(true,true);
          //
          this.CmdObj.ActiveFormChanged();
          this.IndObj.ActiveFormChanged();
          this.TimerObj.ActiveFormChanged();
          //
          // Se il pulsante chiudi tutto e' nascosto lo devo mostrare
          this.HandleCloseAllVisibility();
          //
          if (this.ActiveForm)
            RD3_DesktopManager.HandleFocus2(this.ActiveForm.Identifier,0);
        }
      }
      else
      {
        var scz = this.GetScreenZone(nf.DockType);
        scz.ActivateForm(nf);
      }
      //
      return;
    }
    //
    // Attivazione di una FORM PRINCIPALE
    if (!m && !d)
    {
      var finidx = 1000;   // Indice della form da aprire nello stackform
      var foutidx = 0;     // indice della form da fare uscire nello stackform
      //
      this.ActiveForm = nf;
      var fin = nf;
      var fout = this.VisibleForm;
      //
      // Se non devo animare nessuna form in ingresso animo il welcome box se e' nescosto
      if (!fin && this.WelcomeBox && this.WelcomeBox.style.display=="none")
      {
        fin = this.WelcomeBox;
        finidx = -1000;
      }
      if (!fin && this.WelcomeForm)
      {
        fin = this.WelcomeForm;
        finidx = -1000;
        //
        // Se non ci sono piu' form visibili e sono in uno smartphone devo aggiornare il layout
        if (RD3_Glb.IsSmartPhone())
          this.RecalcLayout = true;
      }
      //
      // Se non ho trovato nessun candidato valido allora animo in uscita il WelcomeBox se e' visibile
      if (!fout && this.WelcomeBox && this.WelcomeBox.style.display!="none")
        fout = this.WelcomeBox;
      //
      // Trovo gli indici delle form
      var n = this.StackForm.length;
      for (var i=0;i<n;i++)
      {
        var f = this.StackForm[i];
        //
        if (f==fin)
          finidx = i;
        //
        if (f == fout)
          foutidx = i;
      }
      //
      // Per eseguire l'animazione ho bisogno di due oggetti differenti, se non si verifica questa condizione salto l'animazione
      var skip = false;
      if ((fin == fout) || !fout || !fin)
        skip = true;
      //
      // Se non sto facendo l'animazione di fade iniziale
      if (fin && this.WepBox.style.visibility!="hidden")
      {
        var dir = true; // Direzione dello scroll verticale: true da up a dn, false il contrario
        if (fout)
          dir = (finidx < foutidx); // Imposto la direzione dello scroll se ci sono due form  
        //
        var fx = new GFX("form", dir, fin, skip, (fout ? fout : null), fin.ShowAnimDef);
        //
        // Se devo chiudere una form lo comunico all'animazione
        if (this.CloseFormId != "")
          fx.CloseFormAnimation = true;
        //
        RD3_GFXManager.AddEffect(fx);
      }
      else    // Sto facendo l'animazione di fade iniziale: non faccio animazioni
      {
        // In questo caso se ho una form da attivare la faccio comparire..
        if (nf)
        {
          // Forzo le altre form a nascondersi
          var n = this.StackForm.length;
          for (var i=0;i<n;i++)
          {
            var fo = this.StackForm[i];
            //
            // Nascondo solo le form principali
            if (!fo.Modal && !fo.Docked)
              fo.SetActive(false, true);
          }
          //
          nf.SetActive(true, true);
          if (!m && !d)
            this.VisibleForm = nf;
          this.ActiveForm = nf;
          //
          // Imposto i flag di animazione, in modo da bloccare l'animazione dei messaggi alla comparsa..
          this.ActiveForm.Animating = true;
          var nf = this.StackForm.length;
          for (var t=0;t<nf;t++)
          {
            if (this.StackForm[t].Docked)
              this.StackForm[t].Animating = true;
          }
          //
          this.CmdObj.ActiveFormChanged();
          this.IndObj.ActiveFormChanged();
          this.TimerObj.ActiveFormChanged();
          //
          // Se il pulsante chiudi tutto e' nascosto lo devo mostrare
          this.HandleCloseAllVisibility();
          //
          RD3_DesktopManager.HandleFocus2(this.ActiveForm.Identifier,0);
        } 
      }
    }
  }
  else
  {
     // Memorizzo l'identificativo della form attiva
    this.ActiveForm = ident;
  }
}


// ********************************************************************************
// Gestore dell click sul pulsante chiudi tutto
// ********************************************************************************
WebEntryPoint.prototype.OnCloseAll = function(evento)
{
  var ev = new IDEvent("claclk", this.Identifier, evento, this.CloseAllEventDef);
}


// ********************************************************************************
// Gestore dell click sul pulsante chiudi tutto
// ********************************************************************************
WebEntryPoint.prototype.OnCloseApp = function(evento)
{
  var ev = new IDEvent("clk", "cloapp", evento, this.CloseAppEventDef);
}


// ********************************************************************************
// Apre il file di help in una nuova finestra
// ********************************************************************************
WebEntryPoint.prototype.OnHelpButton = function(evento)
{
  var ok = RD3_ClientEvents.OnHelp(this);
  //
  if (ok)
  {
    RD3_DesktopManager.OpenDocument(this.HelpFile, "help", "");
  }
}


// ********************************************************************************
// Metodo che gestisce la visibilita' del pulsante chiudi tutto:
// se ci sono form nella lista form e' visibile, altrimenti no
// ********************************************************************************
WebEntryPoint.prototype.HandleCloseAllVisibility = function()
{
  var mdi = this.GetLastForm();
  var popup = this.GetLastForm(true);
  //
  // Decido se devono essere visibili o meno
  var clallvis = popup ? true : false;
  var welvis = mdi ? false : true;
  //
  // Confronto con lo stato attuale: lo cambio solo devo
  if (clallvis != this.CloseAllVisible)
  {
    if (this.CloseAllBox)
      this.CloseAllBox.style.display = clallvis?"":"none";
    this.CloseAllVisible = clallvis;
  }
  //
  if (welvis != this.WelcomeBoxVisible)
  {
    if (this.WelcomeBox)
      this.WelcomeBox.style.display = welvis?"":"none";
    if (this.WelcomeForm)
    {
      this.WelcomeForm.SetVisible(welvis);
      this.WelcomeForm.SetActive(welvis);
    }
    this.WelcomeBoxVisible = welvis;
  }
  //
  // Ridimensiono il FormListBox, se necessario viene messa o tolta la scrollbar
  this.AdaptFormListBox();
}


// ********************************************************************************
// Ritorna l'ultima form aperta che non sia modale o docked e che sia visibile
// se flPopup = TRUE allora considera anche i popup
// ********************************************************************************
WebEntryPoint.prototype.GetLastForm = function(flPopup)
{
  var n = this.StackForm.length;
  for (var i=n-1;i>=0;i--)
  {
    var f = this.StackForm[i];
    //
    if (f.Modal!=0 && !flPopup)
      continue;
    //
    if (!f.IsModalPopup() && !f.Docked && f.Visible)
      return f;
  }
  //
  return null;
}


// ********************************************************************************
// Questa funzione cerca di convincere l'utente che non deve andare via dalla
// pagina prima di premere il pulsante "CHIUDI"
// ********************************************************************************
WebEntryPoint.prototype.OnBeforeUnload = function(ev)
{
  if (!this.Redirecting)
  {
    if (ev && RD3_ServerParams.UnloadMessage)
    {
      ev.preventDefault();
      ev.returnValue = RD3_ServerParams.UnloadMessage;
    }
    return RD3_ServerParams.UnloadMessage;
  }
}


// ********************************************************************************
// L'utente ha premuto il tasto DEBUG o TRACE
// pagina prima di premere il pulsante "CHIUDI"
// ********************************************************************************
WebEntryPoint.prototype.OnDebug = function(ev)
{
  var ok = RD3_ClientEvents.OnDebug(this);
  //
  if (ok)
  {
    if (ev.ctrlKey)
    {
      RD3_Debugger.Show();
    }
    else
    {
      switch (this.DebugType)
      {
        case 1 : // Debug
        {
          if (window.RD4_Enabled)
            var ev = new IDEvent("IWDTT", "", ev, RD3_Glb.EVENT_ACTIVE);
          else
            RD3_DesktopManager.OpenDocument(location.href + "?WCI=IWDTT&WCE=", "debug", "");  break;       
        }
        case 2 : // Trace
        {
          var ev = new IDEvent("cmd", this.Identifier, ev, RD3_Glb.EVENT_ACTIVE, "DTTHELP");
        }
        break;    
      }
    } 
  }
}


// ********************************************************************************
// Ho cliccato da qualche parte...
// ********************************************************************************
WebEntryPoint.prototype.OnClick = function(ev)
{
  if (this.DisableOnClick>0)
  {
    this.DisableOnClick--;
    return;
  }
  //
  // Non considero il click sulla menubox di task bar
  var srcobj = (window.event)?window.event.srcElement:ev.explicitOriginalTarget;
  if (srcobj==this.TaskbarMenuBox)
    return;
  //
  // Chiudo tutti i popup
  this.CmdObj.ClosePopup();
}


// ********************************************************************************
// Devo dare il fuoco a qualcosa... torno true se ci riesco
// ********************************************************************************
WebEntryPoint.prototype.Focus= function()
{
  var ok = false;
  //
  // Recupero la form attiva (sia stringa che oggetto)
  var f = this.ActiveForm;
  if (f && !f.Identifier)
    f = RD3_DesktopManager.ObjectMap[f];
  //
  if (f)
    ok = f.Focus();
  //
  if (!ok)
  {
    // Nessuno ha voluto il fuoco, lo daro' al command input
    if (this.CommandInput)
    {
      this.CommandInput.focus();
      ok = (RD3_KBManager.GetActiveElement() == this.CommandInput);
    }
  }
  //
  return ok;
}


// ********************************************************************************
// Ultimato caricamento del blob?
// ********************************************************************************
WebEntryPoint.prototype.OnBlobUpload= function(response)
{
  var s = "";
  if (response)
    s = response;
  else
  {
    try
    {
      var bod = RD3_DesktopManager.WebEntryPoint.BlobFrame.contentWindow.document.body;
      //
      if (bod.innerText)
        s = bod.innerText;
      if (bod.textContent)
        s = bod.textContent;
    }
    catch(ex)
    {
    }
  }
  //
  if (s && s!="")
  {
    // tolgo i 256 "p" messi per ingannare il browser
    s = s.substr(256,s.length-256);
    //
    this.DelayDialog.Close();
    //
    // Carico una richiesta con questo testo dentro...
    RD3_DesktopManager.ProcessXmlText(s);
  }
}


// ********************************************************************************
// L'utente ha scritto un valore nell'input dei comandi
// ********************************************************************************
WebEntryPoint.prototype.OnCommand = function(ev)
{
  // Verifico se il pulsante premuto e' un INVIO, se lo e' mando il comando al server e svuoto il campo
  var code = (ev.charCode)? ev.charCode: ev.keyCode;
  if (code == 13)
  {
    // Attivo su richiesta il debugger javascript
    var s = this.CommandInput.value.toUpperCase();
    if (s=="JSDEB")
      IEDebug();
    if (s=="ANI-" || s=="ANIOFF")
      RD3_ClientParams.EnableGFX = false;
    if (s=="AWK-" || s=="AWKOFF")
      RD3_ClientParams.UseWebKitGFX = false;
    if (s=="ANI+" || s=="ANION")
      RD3_ClientParams.EnableGFX = true;
    if (s=="AWK+" || s=="AWKON")
      RD3_ClientParams.UseWebKitGFX = true;
    if (s=="SOUND-" || s=="SND-" || s=="SNDOFF")
      RD3_ClientParams.EnableSound = false;
    if (s=="SOUND+" || s=="SND+" || s=="SNDON")
      RD3_ClientParams.EnableSound = true;
    //
    // Mando il comando al server
    var ev = new IDEvent("cmd", this.Identifier, ev, RD3_Glb.EVENT_ACTIVE, s);
    //
    // Svuoto l'input
    this.CommandInput.value = "";
  }
}

// **********************************************************************
// Gestisco la pressione dei tasti FK a partire dalla form
// **********************************************************************
WebEntryPoint.prototype.HandleFunctionKeys = function(eve)
{
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var ok = false;
  //
  // Verifico i comandi generali
  ok = RD3_DesktopManager.WebEntryPoint.CmdObj.HandleFunctionKeys(eve, -1, -1);
  //
  return ok;
}


// **********************************************************************
// Il WEP deve prendere il fuoco, lo do alla form oppure al cmd
// **********************************************************************
WebEntryPoint.prototype.Focus = function()
{
  // Provo a darlo alla form attiva (se c'e')
  if (this.ActiveForm && this.ActiveForm.Focus && this.ActiveForm.Focus())
    return true;
  //
  // Lo do al comando 
  var ok = false;
  try
  {
    this.CommandInput.focus();
    ok = true;
  }
  catch(ex)
  {
  }
  //
  return ok;
}


// **********************************************************************
// Imposta il timer che nascondera' il focus box
// **********************************************************************
WebEntryPoint.prototype.SetHideFocusBox = function()
{
  this.FocusBoxTimerId = window.setTimeout("RD3_DesktopManager.WebEntryPoint.HideFocusBox();", 200);
}

// **********************************************************************
// Imposta il timer che nascondera' il focus box
// **********************************************************************
WebEntryPoint.prototype.ResetHideFocusBox = function()
{
  window.clearTimeout(this.FocusBoxTimerId);
}

// **********************************************************************
// Toglie il focus box dal campo
// **********************************************************************
WebEntryPoint.prototype.HideFocusBox = function()
{
  if (this.FocusBox.parentNode)
    this.FocusBox.parentNode.removeChild(this.FocusBox);
}


// **********************************************************************
// Il mouse e' stato mosso su una delle icone di scroll del menu laterale
// **********************************************************************
WebEntryPoint.prototype.OnScrollMenuOver = function(evento)
{
  // Se Il menu laterale non e' visibile non faccio nulla
  if (this.SuppressMenu)
    return;
  //
  // Leggo l'origine
  var srcobj = (window.event)?window.event.srcElement:evento.explicitOriginalTarget;
  //
  if (srcobj == this.MenuScrollDown)
  {
    this.ScrollMenu(1);
  }
  else if (srcobj == this.MenuScrollUp)  // Sono sull'icona di Scroll Up
  {
    this.ScrollMenu(-1);
  }
}


// **********************************************************************
// Il mouse e' uscito da una delle icone di scroll del menu laterale
// **********************************************************************
WebEntryPoint.prototype.OnScrollMenuOut = function(evento)
{
  this.ScrollMenu(0);
}


// ********************************************************************************
// Inizio lo scrolling
// ********************************************************************************
WebEntryPoint.prototype.ScrollMenu = function(dir)
{ 
  this.MenuScrollDir = dir;
  if (dir == 0)
    this.AdaptScrollBox();
}


// ********************************************************************************
// Effettuo scrolling della toolbar
// ********************************************************************************
WebEntryPoint.prototype.ScrollingMenu = function()
{ 
  if (this.MenuScrollDir == 0)
    return;
  //
  var box = (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)? this.TaskbarMenuBox : this.SideMenuBox;
  //  
  var old = box.scrollTop;
  box.scrollTop+=this.MenuScrollDir*(RD3_Glb.IsIE()?8:4);
  //
  // Se non si e' spostata, allora fermo lo scroll
  if (box.scrollTop==old)
  {
    this.ScrollMenu(0);
  }
}


// ********************************************************************************
// Posiziona e mostra lo scrollbox se necessario
// ********************************************************************************
WebEntryPoint.prototype.AdaptScrollBox = function()
{ 
  if (this.MenuType==RD3_Glb.MENUTYPE_MENUBAR)
    return;
  //
  var box = (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)? this.TaskbarMenuBox : this.SideMenuBox;
  //
  // Se il contenuto e' piu' grande del menu gestisco le immagini, altrimenti nascondo tutto
  if (!this.SuppressMenu && box.scrollHeight-1>box.clientHeight)
  {
    if (this.MenuScrollDown)
    {
      // Se non sono in fondo mostro l'immagine per scrollare
      if (!this.SuppressMenu && box.scrollHeight-box.scrollTop>box.clientHeight+4)
      {
        this.MenuScrollDown.style.display = "block";
        this.MenuScrollDown.style.top = (box.offsetHeight + box.offsetTop  - this.MenuScrollDown.offsetHeight) + "px";
        this.MenuScrollDown.style.width = (this.MenuBox.offsetWidth) + "px";
      }
      else
      {
        this.MenuScrollDown.style.display = "none";
      }
    }
    //
    if (this.MenuScrollUp)
    {
      // Se non sono in cima mostro l'immagine per scrollare
      if (!this.SuppressMenu && box.scrollTop>0)
      {
        this.MenuScrollUp.style.display = "block";
        this.MenuScrollUp.style.top = box.offsetTop + "px";
        this.MenuScrollUp.style.width = (this.MenuBox.offsetWidth) + "px";
      }
      else
      {
        this.MenuScrollUp.style.display = "none";
      }
    }
  }
  else
  {
    // Se non c'e' bisogno di scrollare o il menu e' nascosto nascondo tutte le immagini e riposiziono correttamente 
    // il menu laterale
    if (this.MenuScrollDown)
      this.MenuScrollDown.style.display = "none";
    //
    if (this.MenuScrollUp)
      this.MenuScrollUp.style.display = "none";
    //
    if (box)  
      box.scrollTop = 0;
  }
}


// *******************************************************
// Metodo che gestisce il cambio dello stato dell'immagine
// *******************************************************
WebEntryPoint.prototype.OnReadyStateChange = function()
{
  this.AdaptHeader();
}


// ********************************************************************************
// Gestore del mouse over su un oggetto di wep
// ********************************************************************************
WebEntryPoint.prototype.OnMouseOverObj = function(ev, obj)
{ 
  if (obj == this.SuppressMenuBox)
    this.SuppressMenuBox.className = "header-suppress-menu-hover"+((this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)?"-right":"");
  if (obj == this.DebugImageBox)
    this.DebugImageBox.className = "header-debug-image-hover";
  if (obj == this.HelpFileBox)
    this.HelpFileBox.className = "header-help-button-hover";
  if (obj == this.CloseAppBox)
    this.CloseAppBox.className = "header-close-app-hover";
  //
  if (obj == this.CloseAllButton || obj == this.CloseAllImg || obj == this.CloseAllTxt)
  {
    this.CloseAllImg.className = "form-list-close-all-img-hover";
    this.CloseAllButton.className = "form-list-close-all-button-hl";
    if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
      RD3_Glb.AddClass(this.CloseAllButton, "form-list-close-all-button-right");
  }
}


// ********************************************************************************
// Gestore del mouse out su un oggetto di wep
// ********************************************************************************
WebEntryPoint.prototype.OnMouseOutObj = function(ev, obj)
{ 
  if (obj == this.SuppressMenuBox)
    this.SuppressMenuBox.className = "header-suppress-menu-hl"+((this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)?"-right":"");
  if (obj == this.DebugImageBox)
    this.DebugImageBox.className = "header-debug-image-hl";
  if (obj == this.HelpFileBox)
    this.HelpFileBox.className = "header-help-button-hl";
  if (obj == this.CloseAppBox)
    this.CloseAppBox.className = "header-close-app-hl";
  //
  //
  if (obj == this.CloseAllButton || obj == this.CloseAllImg || obj == this.CloseAllTxt)
  {
    this.CloseAllImg.className = "form-list-close-all-img";
    this.CloseAllButton.className = "form-list-close-all-button";
    if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
      RD3_Glb.AddClass(this.CloseAllButton, "form-list-close-all-button-right");
  }
}


// ********************************************************************************
// Gestore del mouse down su un oggetto di wep
// ********************************************************************************
WebEntryPoint.prototype.OnMouseDownObj = function(ev, obj)
{ 
  if (obj == this.SuppressMenuBox)
    this.SuppressMenuBox.className = "header-suppress-menu-down"+((this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)?"-right":"");
  if (obj == this.DebugImageBox)
    this.DebugImageBox.className = "header-debug-image-down";
  if (obj == this.HelpFileBox)
    this.HelpFileBox.className = "header-help-button-down";
  if (obj == this.CloseAppBox)
    this.CloseAppBox.className = "header-close-app-down";
  //
  //
  if (obj == this.CloseAllButton || obj == this.CloseAllImg || obj == this.CloseAllTxt)
  {
    this.CloseAllImg.className = "form-list-close-all-img-down";
  }
}


// ********************************************************************************
// Evento di scrolling del menu
// ********************************************************************************
WebEntryPoint.prototype.OnMouseWheel = function(ev)
{
  var box = (this.MenuType==RD3_Glb.MENUTYPE_TASKBAR)? this.TaskbarMenuBox : this.SideMenuBox;
  //
  // Vediamo se lo scroll e' necessario
  if (!box)
    return false;
  //
  // Se il menu' ci sta tutto non scrollo
  if (this.SuppressMenu || box.scrollHeight-1<=box.clientHeight)
    return false;
  //
  var eve = window.event ? window.event : ev;
  var srcElement = eve.srcElement ? eve.srcElement : eve.target;
  var delta = eve.wheelDelta != undefined ? eve.wheelDelta : (eve.deltaMode == 0 ? -eve.deltaY : -eve.deltaY*40);
  //
  // Eseguo scrolling
  box.scrollTop -= delta/2;
  //
  // Aggiorno lo stato delle immaginette di scrolling
  this.AdaptScrollBox();
  //
  RD3_Glb.StopEvent(ev);
  return false;
}



// ********************************************************************************
// Mostra o nasconde le form dello stack in base alla form attiva
// ********************************************************************************
WebEntryPoint.prototype.HandleFormStack = function()
{
  // Se ci sono Form
  if (this.StackForm.length>0)
  {
    var m = this.ActiveForm ? this.ActiveForm.IsModalPopup() : false;
    var d = this.ActiveForm ? this.ActiveForm.Docked : false;
    var mdi = this.ActiveForm ? this.ActiveForm.Modal==0 : true;
    //
    var n = this.StackForm.length;
    for (var i=0;i<n;i++)
    {
      var f = this.StackForm[i];
      //
      // Se la form e' da attivare la attivo, altrimenti la nascondo
      if (f==this.ActiveForm)
      {
        f.SetActive(true, true);
        this.ActiveForm.AlreadyVisible = true;
        //
        // Se la form attiva e' MDI la memorizzo come form di background
        if (f.Modal == 0 && !d)
          this.VisibleForm = f;
      }
      else
      {
        // Non la faccio sparire se quella che ho aperto e' popup
        f.SetActive(false, mdi);
      }
    }
  }
  //
  this.HandleCloseAllVisibility();
  this.AdaptScrollBox();
}



// ********************************************************************************
// Ritorna il rettangolo che contiene l'area di massimizzazione della form
// ********************************************************************************
WebEntryPoint.prototype.GetMaximizeArea = function()
{
  if (false)
  {
    // Qui ritorna l'intero browser
    var r = new Rect(0,0,document.body.clientWidth,document.body.clientHeight);
    return r;
  }
  else
  {
    // Dimensione padding mdi area
    var bs = 0;
    var bd = 4;
    if (RD3_ServerParams.Theme.startsWith("seattle"))
    {
      bs = 5;
      bd = 10;
    }
    else if (RD3_ServerParams.Theme.startsWith("zen"))
    {
      bs = 10;
      bd = 22;
    }
    //
    // Qui ritorna la MDI area
    var fbx = this.FormsBox;
    var r = new Rect(RD3_Glb.GetScreenLeft(fbx)+bs,RD3_Glb.GetScreenTop(fbx)+bs,fbx.clientWidth-bd,fbx.clientHeight-bd);
    return r;
  }
}


// ********************************************************************************
// Ritorna TRUE se il menu' e' laterale
// ********************************************************************************
WebEntryPoint.prototype.HasSideMenu = function()
{
  return this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB || this.MenuType==RD3_Glb.MENUTYPE_LEFTSB;
}


// ********************************************************************************
// Devo far apparire il menu' della taskbar
// ********************************************************************************
WebEntryPoint.prototype.OnStartClick = function(eve)
{
  // Mostro o nascondo...
  if (this.TaskbarMenuBox.style.display == "block")
  {
    // Se e' visibile nascondo il menu
    this.CmdObj.ClosePopup();
  }
  else
  {
    // Se e' nascosto lo devo mostrare
    //
    this.CmdObj.ClosePopup();
    this.TaskbarMenuBox.style.display = "block";
    //
    var mh = this.SideMenuBox.offsetTop - this.HeaderBox.offsetHeight - 10;
    var h = this.MenuBox.offsetHeight;
    if (h<300)
      h = 300;
    if (h>mh)
      h = mh;
    //
    this.TaskbarMenuBox.style.height = h + "px";
     this.TaskbarMenuBox.style.top = (this.SideMenuBox.offsetTop - this.TaskbarMenuBox.offsetHeight) + "px";
     this.TaskbarMenuBox.scrollTop = 0;
     //
     if (RD3_Glb.IsTouch())
       this.TaskbarStartCell.style.backgroundPosition="0px -40px";
     else
       this.TaskbarStartCell.style.backgroundPosition="0px -30px";
     //
     this.MenuBox.style.width = "100%";
     this.CmdObj.AdaptLayout();
     //
     // Attivo l'animazione ora che ho impostato tutte le dimensioni e fatto adattare il menu..
    var fx = new GFX("taskbar", true, this.TaskbarMenuBox, false);
    RD3_GFXManager.AddEffect(fx);
  }
  //
  // Se no lo chiude subito il close popup...
  RD3_Glb.StopEvent(eve);
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
WebEntryPoint.prototype.GetTooltip = function(tip, obj)
{
  if (obj == this.CloseAppBox)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_ChiudiAppl);
    tip.SetText(RD3_ServerParams.ChiudiAppl);
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj), RD3_Glb.GetScreenTop(obj) + (obj.offsetHeight/2));
    tip.SetPosition(3);
    return true;
  }
  //
  if (obj == this.SuppressMenuBox)
  {
    if (this.CmdObj.SuppressMenu)
    {
      tip.SetTitle(ClientMessages.TIP_TITLE_MostraMenu);
      tip.SetText(RD3_ServerParams.MostraMenu);
    }
    else
    {
      tip.SetTitle(ClientMessages.TIP_TITLE_NascondiMenu);
      tip.SetText(RD3_ServerParams.NascondiMenu);
    }
    //
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + obj.offsetWidth, RD3_Glb.GetScreenTop(obj) + (obj.offsetHeight/2));
    //
    if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
      tip.SetPosition(3);
    else
      tip.SetPosition(1);
    //
    return true;
  }
  else if (obj == this.DebugImageBox)
  {
    // Attualmente non hanno un title
  }
  else if (obj == this.HelpFileBox)
  {
    // Attualmente non hanno un title
  }
  //
  return false;
}


// **********************************************************************
// Esegue un azione su un suono
// **********************************************************************
WebEntryPoint.prototype.SoundAction = function(soundname, action, volume, t1, t2, notify, progress, videodiv) 
{
  if (!RD3_ClientParams.EnableSound)
    return;
  //
  var name = RD3_ClientParams.SoundDef[soundname];
  if (!name)
    name = soundname;
  //
  if (name.indexOf(".")>0 && name.indexOf("/")==-1)
  {
    // aggiungo percorso assoluto + mmedia
    var l = window.location.href;
    var p = l.lastIndexOf("/");
    if (p>0)
      l = l.substr(0,p) + "/mmedia/";
    name = l+name;
  }
  //
  // Nome non definito, non punta ad un file...
  if (name.indexOf(".")==-1 && name.indexOf("/")==-1)
    return;
  //
  if (RD3_Glb.IsIpad())
  {
    //this.SoundAction5(name, action, volume, t1, t2, notify, progress, videodiv);
    return;
  }
  //
  // Sound manager non presente o non inizializzato ancora
  if (!window.soundManager || !soundManager.supported())
    return; 
  //
  if (videodiv)
  {
    var div = document.getElementById(videodiv);
    if (!div)
    {
      // Recupero il div dato l'oggetto
      var obj = RD3_DesktopManager.ObjectMap[videodiv];
      if (obj && obj.GetDOMObj)
        div = obj.GetDOMObj();
    }
    if (div)
    {
      // sovrappongo il div del video a quello dato
      var vdiv = document.getElementById("sm2-container");
      if (vdiv)
      {
        vdiv.style.left = RD3_Glb.GetScreenLeft(div) + "px";
        vdiv.style.top= RD3_Glb.GetScreenTop(div) + "px";
        vdiv.style.width= div.clientWidth + "px";
        vdiv.style.height= div.clientHeight + "px";
      }
    }
  }
  //
  switch(action)
  {
    case "play":
      var sm = (videodiv)? soundManager.createVideo({id: soundname, url: name}) : soundManager.createSound({id: soundname, url: name}); 
      //
      // Oggetto audiovideo non creato...
      if (!sm)
        return;
      //
      if (volume!=undefined && volume!=null)
        sm.setVolume(volume);
      //
      var zol;
      if (t1!=undefined && t1!=null)
      {
        zol = new Function("this.setPosition("+t1+");");
        //
        // Per riposizionare un video gia' caricato e' necessario "scaricarlo"
        // probabilmente un bug del sound manager
        if (videodiv)
          sm.unload();
        //
        sm.setPosition(t1);
      }
      var zop;
      if ((t2!=undefined && t2!=null) || progress)
      {
        var s = "";
        if ((t2!=undefined && t2!=null))
          s+="if (this.position>"+t2+") this.stop();";
        if (progress)
          s+= "var e = new IDEvent('sound',this.url,null,RD3_Glb.EVENT_ACTIVE,'progress',this.position,this.duration,null,null,1000);";
        zop = new Function(s);
      }
      var zof;
      if (notify)
        zof = new Function("var e = new IDEvent('sound',this.url,null,RD3_Glb.EVENT_ACTIVE,'finish');");
      //
      sm.play({ onload: zol, whileplaying: zop, onfinish: zof, onstop: zof});
    break;
    
    case "stop":
      soundManager.stop(soundname); 
      var vdiv = document.getElementById("sm2-container");
      if (vdiv)
      {
        vdiv.style.left = "-9999px";
        vdiv.style.top= "-9999px";
      }
    break;
    
    case "pause":
      soundManager.pause(soundname);
    break;

    case "continue":
      soundManager.resume(soundname);
    break;
      
    case "stopall":
      soundManager.stopAll();
      var vdiv = document.getElementById("sm2-container");
      if (vdiv)
      {
        vdiv.style.left = "-9999px";
        vdiv.style.top= "-9999px";
      }
    break;
  }
}


// **********************************************************************
// Esegue un azione su un suono usando HTML5
// **********************************************************************
WebEntryPoint.prototype.SoundAction5 = function(soundurl, action, volume, t1, t2, notify, progress, videodiv) 
{
  // Prelevo l'oggetto audio
  var obj = this.GetSoundObject5(soundurl, action=="play");
  //
  switch(action)
  {
    case "play":
    {
      if (obj)
      {
        // Imposto volume 
        if (volume!=undefined && volume!=null)
        {
          if (volume>1)
            volume = volume/100;
          if (volume>1)
            volume=1;
          if (volume<0)
            volume=0;
          obj.volume = volume;
        }
        //
        // Faccio partire il suono
        var theEvent = document.createEvent('MouseEvents');
        theEvent.initEvent('click', true, true);
        obj.dispatchEvent(theEvent);
      }
    }
    break;
    
    case "pause":
    {
      if (obj)
        obj.pause();
    }
    break;
    
    case "stop":
    {
      if (obj)
        obj.pause();
    }
    break;

    case "continue":
    {
      if (obj)
        obj.play();
    }
    break;
    
    case "stopall":
    {
      var i;
      for (i=0; i<this.SoundObjects.length; i++)
        this.SoundObjects.getItem(i).pause();
    }
    break;
  }
}


// **********************************************************************
// Ritorna l'oggetto audio per il file cercato
// **********************************************************************
function RD3_AudioPlay(ev) 
{
  // Torno all'inizio...
  try
  {
    ev.srcElement.currentTime=0;
  }
  catch(ex) {; }
  //
  ev.srcElement.play();
}


// **********************************************************************
// Ritorna l'oggetto audio per il file cercato
// **********************************************************************
WebEntryPoint.prototype.GetSoundObject5 = function(soundurl, flcreate) 
{
  if (!this.SoundObjects)
    this.SoundObjects = new HashTable(true);
  //
  var obj = this.SoundObjects[soundurl];
  if (!obj && flcreate)
  {
    obj = new Audio(soundurl);
    //obj.setAttribute("controls","true");
    obj.style.display = "none";
    obj.style.position = "absolute";
    obj.style.left = "0px";
    obj.style.top = "0px";
    obj.addEventListener("click", RD3_AudioPlay, true);
    document.body.appendChild(obj);
    this.SoundObjects[soundurl]=obj;
  }
  return obj;
}


// *********************************************************
// Ritorna l'insieme degli oggetti da tirare
// *********************************************************
WebEntryPoint.prototype.GetDropList = function(dragobj)
{
  var a = new Array();
  var dl = new Array();
  //
  // Vediamo di quali form devo calcolare gli oggetti da droppare
  if (this.ActiveForm && this.ActiveForm.IsModalPopup())
  {
    // Form popup modale... solo lei
    a.push(this.ActiveForm);
  }
  else
  {
    // Tutte le form visibili
    var n = this.StackForm.length;
    for(var i=0; i<n; i++)
    {
      var f = this.StackForm[i];
      if (f && f.Realized && f.FormBox.style.display!="none")
      {
        a.push(f);
      }
    }
    //
    // Se ci sono delle form POPUP di mezzo le devo 'ordinare' in base allo z-index
    // in realta' e' un informazione che non ho, quindi faccio cosi':
    // prima metto tutte le form non popup
    // poi metto le form popup non attive
    // per ultima metto la form popup attiva
    // In questo modo il D&D (che lavora partendo dall'ultima) funziona bene
    //
    // Parto dall'inizio del ciclo, se trovo una popup la sposto in fondo
    // (in questo modo ho prima tutte le form main e poi le popup, in ordine di stack)
    a.sort(function (fa, fb) {
      var faPopup = fa.Modal && !fa.IsModalPopup();
      var fbPopup = fb.Modal && !fb.IsModalPopup();
      //
      // Se sono tutte e due popup torno 0 (le lascio in quell'ordine)
      if (faPopup == true && fbPopup == true)
        return 0;
      //
      // Se la prima e' popup e la seconda no la prima deve andare dopo la seconda
      if (faPopup && !fbPopup)
        return 1;
      //
      // Se la prima non e' popup e la seconda e' popup la seconda deve andare prima
      if (!faPopup && fbPopup)
        return -1;
    });
    //
    // Ora che sono ordinate posso spostare per ultima la Form Popup attiva (se c'e')
    for(var j=0; j<a.length; j++) 
    {
      if (a[j].Modal && !a[j].IsModalPopup() && this.ActiveForm == a[j]) 
      {
        var fj = a.splice(j, 1);
        a.push(fj[0]);
        break;
      } 
    }
  }
  //
  // Tutti i frame di tutte le form dichiarate
  var n = a.length;
  for(var i=0; i<n; i++)
  {
    a[i].ComputeDropList(dl,dragobj);
  }
  //
  this.CmdObj.ComputeDropList(dl,dragobj);
  //
  return dl;
}


// *********************************************************
// Gestione generic drop
// *********************************************************
WebEntryPoint.prototype.OnDrop = function(dropobj, dragobj, evento)
{
  if (!dropobj || !dragobj)
    return;
  //
  // Comincio ad identificare gli oggetti
  var iddropobj = dropobj.GetDOMObj().id;
  var iddragobj = dragobj.GetDOMObj().id;
  //
  // Identifico bottone
  var b = evento.button;
  if (RD3_Glb.IsIE())
  {
    if (b & 0x01)
      b=0;
    else if (b & 0x02)
      b=2;
    else if (b & 0x04)
      b=1;
  }
  //
  // Coordinate browser
  var xb = evento.clientX;
  var yb = evento.clientY;
  var x = xb;
  var y = yb;
  //
  // In caso di pannello o tree, x e y sono rispetto al frame (+ eventuali scrollbar)
  if (dropobj.GetParentFrame)
  {
    var dropfr = dropobj.GetParentFrame();
    x = xb - RD3_Glb.GetScreenLeft(dropfr.FrameBox);
    y = yb - RD3_Glb.GetScreenTop(dropfr.FrameBox);
  }
  //
  // Convertiamo le coordinate rispetto alla box nella UM del book
  if (dropobj instanceof BookBox)
  {
    x = xb - RD3_Glb.GetScreenLeft(dropobj.BoxBox);
    y = yb - RD3_Glb.GetScreenTop(dropobj.BoxBox);
    var r = new Rect(x,y,0,0);
    dropobj.AdaptCoords(r);
    x = r.x;
    y = r.y;
  }
  //
  var par6 = null;
  if (dropobj instanceof PCell && dropobj.PValue && dropobj.ParentField && dropobj.ParentField.ParentPanel.IsGrouped() && dropobj.ParentField.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST)
  {
    // Mando la posizione assoluta, cosi' il documento puo' essere recuperato dalla collection
    par6 = dropobj.PValue.Index;
  }
  //
  // Lancio evento
  var ev = new IDEvent("gdd", iddropobj, evento, RD3_Glb.EVENT_ACTIVE, iddragobj, b, Math.floor(xb), Math.floor(yb), Math.floor(x), null, false, Math.floor(y), par6);  
  return true;
}


// *********************************************************************************************
// Completa la chiusura di una form alla fine dell'animazione del GFX
// lastform : false se l'animazione fa comparire una nuova form, true se e' la chiusura dell'ultima form
// *********************************************************************************************
WebEntryPoint.prototype.CompleteCloseFormAnimation = function(webform, lastform) 
{ 
  // Gestisco la chiusura di timer di form
  this.TimerObj.FormClosed(webform);
  //
  // Tolgo la form dallo stackform
  for (var i=0; i<this.StackForm.length; i++)
  {
    if (this.StackForm[i] == webform)
    {
      this.StackForm.splice(i, 1);
      break;
    }
  }
  //
  // La distruggo
  webform.Unrealize();
  //
  // Se non e' entrata nessuna form devo annullare i puntatori alla form visibile
  if (lastform)
  {
    this.VisibleForm = null;
    this.ActiveForm = null;
  }
  //
  this.CloseFormId = "";
}

// *********************************************************************************************
// Tocchi finali della fine di un animazione riguardante una form MDI, modale o docked
// *********************************************************************************************
WebEntryPoint.prototype.HandleFinishFormAnimation = function(mustadapt) 
{
  this.HandleFormStack();
  //
  // Gestisco il cambio di form attiva..
  this.CmdObj.ActiveFormChanged();
  this.IndObj.ActiveFormChanged();
  this.TimerObj.ActiveFormChanged();
  //
  var acf = this.ActiveForm;
  if (acf)
  {
    // Faccio l'adapt alla fine se sono arrivato qui saltando lo start e l'oggetto da animare non era gia' a video..
    if (mustadapt)
      acf.RecalcLayout = true;
    //
    if (RD3_Glb.IsMobile() && mustadapt && !this.InResponse)
      acf.AdaptLayout();
    //
    // Se il fuoco non e' gia' stato gestito in questa richiesta allora lo gestisco adesso 
    if (!RD3_KBManager.DontCheckFocus && !RD3_Glb.IsMobile())
      RD3_DesktopManager.HandleFocus2(acf.Identifier, 0);
  }
}

WebEntryPoint.prototype.IsTransformable= function(id) 
{
  if ((id == "forms-container" || id.indexOf("dock-container")!=-1) && RD3_ServerParams.EnableFrameResize)
    return true;
  else
    return false;
}

WebEntryPoint.prototype.DragObj= function(id, obj, x, y) 
{
  if (id == "forms-container" || id.indexOf("dock-container")!=-1)
  {
    var ox = x - RD3_Glb.GetScreenLeft(obj);
    var oy = y - RD3_Glb.GetScreenTop(obj);
    //
    var pos = 0;
    if (ox<=10)
      pos = RD3_Glb.FORMDOCK_LEFT;  // LEFT
    else if (ox>=(obj.offsetWidth-10))
      pos = RD3_Glb.FORMDOCK_RIGHT; // RIGTH
    else if (oy<=10)
      pos = RD3_Glb.FORMDOCK_TOP; // UP
    else if (oy>=(obj.offsetHeight-10))
      pos = RD3_Glb.FORMDOCK_BOTTOM; // DOWN
    //
    var mousePos = pos;
    //
    // Quella che ho impostato finora e' la posizione del mouse ripetto all'oggetto, che va bene se l'oggetto e' il form-container
    // ma se siamo su uno dei contenitori docked la posizione deve dipendere dal contenitore (non sempre: se siamo sulla docked sinistra ci interessa solo se il mouse e' a destra o sinistra, se e' sopra o sotto dobbiamo prendere
    // le docked sopra o sotto (ed in questo caso pos==mousePos))
    if (id.indexOf("left")!=-1 && mousePos!=RD3_Glb.FORMDOCK_TOP && mousePos!=RD3_Glb.FORMDOCK_BOTTOM)
      pos = RD3_Glb.FORMDOCK_LEFT;  // LEFT
    else if (id.indexOf("bottom")!=-1 && mousePos!=RD3_Glb.FORMDOCK_LEFT && mousePos!=RD3_Glb.FORMDOCK_RIGHT)
      pos = RD3_Glb.FORMDOCK_BOTTOM; // DOWN
    else if (id.indexOf("right")!=-1 && mousePos!=RD3_Glb.FORMDOCK_TOP && mousePos!=RD3_Glb.FORMDOCK_BOTTOM)
      pos = RD3_Glb.FORMDOCK_RIGHT; // RIGHT
    else if (id.indexOf("top")!=-1 && mousePos!=RD3_Glb.FORMDOCK_LEFT && mousePos!=RD3_Glb.FORMDOCK_RIGHT)
      pos = RD3_Glb.FORMDOCK_TOP; // UP
    //
    // Prendo la docked dal lato che mi serve
    var df = null;
    var nf = this.StackForm.length;
    for (var t=0;t<nf;t++)
    {
      var f = this.StackForm[t];
      if (f.Docked && f.DockType==pos)
      {
        df = f;
        break;
      }
    }
    //
    var a = null;
    switch(pos)
    {
      case RD3_Glb.FORMDOCK_LEFT :  // LEFT
      {
        // Se sono sulla sinistra del form-container e ho una docked sinistra draggo quella, altrimenti draggo la SideBar
        if (id == "forms-container")
        {
          if (df)
            a =  df.CanResize()!=0 ? df : null;
          else
            a = (this.MenuType==RD3_Glb.MENUTYPE_LEFTSB && RD3_ClientParams.SideMenuResizable) ? this : null;
        }
        else if (id.indexOf("dock-container")!=-1 && id.indexOf("right")==-1 && this.MenuType==RD3_Glb.MENUTYPE_LEFTSB && mousePos==RD3_Glb.FORMDOCK_LEFT) // Se sono su una docked diversa da quella destra e sono sulla sua sinistra: draggo la sidebar
          a = RD3_ClientParams.SideMenuResizable ? this : null;
        else if (id=="left-dock-container")
          a = df.CanResize()!=0 ? df : null;
      }
      break;
      
      case RD3_Glb.FORMDOCK_RIGHT : // RIGTH
      {
        if (id == "forms-container")
        {
          // Se sono a destra della form principale e ho una docked destra draggo quella, altrimenti draggo il menu
          if (df)
            a =  df.CanResize()!=0 ? df : null;
          else
            a = (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB && RD3_ClientParams.SideMenuResizable) ? this : null;
        }
        else if (id.indexOf("dock-container")!=-1 && id.indexOf("left")==-1 && this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB && mousePos==RD3_Glb.FORMDOCK_RIGHT) // Se sono su una docked diversa da quella sinistra e sono sulla sua destra: draggo la sidebar
          a = RD3_ClientParams.SideMenuResizable ? this : null;
        else if (id=="right-dock-container")
          a = df.CanResize()!=0 ? df : null;
      }
      break;
      
      case RD3_Glb.FORMDOCK_TOP : // UP
      {
        // Se sono sopra il form container e ho una docked sopra draggo quella
        if (id == "forms-container" && df && df.CanResize()!=0)
          a = df;
        else if (id.indexOf("dock-container")!=-1 && (id.indexOf("left")==-1 || id.indexOf("right")==-1) && df && df.CanResize()!=0)
        {
          // sono sopra il dock container sinistro o destro: se ho una docked sopra draggo quella..
          a = df;
        }
      }
      break;
      
      case RD3_Glb.FORMDOCK_BOTTOM : // DOWN
      {
        // Se sono sotto il form container e ho una docked sotto draggo quella
        if (id == "forms-container" && df && df.CanResize()!=0)
          a = df;
        else if (id.indexOf("dock-container")!=-1 && (id.indexOf("left")==-1 || id.indexOf("right")==-1) && df && df.CanResize()!=0)
        {
          // sono sotto il dock container sinistro o destro: se ho una docked sopra draggo quella..
          a = df;
        }
      }
      break;
    }
    //
    return a;
  }
}


// **************************************************
// L'oggetto da dimensionare e' il menu laterale
// **************************************************
WebEntryPoint.prototype.DropElement= function() 
{
  return this.SideMenuBox;
}


// **************************************************
// Applico il cursore del resize all'oggetto giusto
// **************************************************
WebEntryPoint.prototype.ApplyCursor= function(cn) 
{
  // A chi devo mettere il cursore?
  // - se il menu e' a sinistra o alla docked sinistra o al form container
  // - se il menu e' destra o alla docked destra o al form container
  if (this.MenuType==RD3_Glb.MENUTYPE_LEFTSB)
  {
    // Se trovo una docked che non sia destra gli applico il cursore
    var fnd = false;
    var nf = RD3_DesktopManager.WebEntryPoint.StackForm.length;
    for (var t=0;t<nf;t++)
    {
      var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
      if (f.Docked)
      {
        switch (f.DockType)
        {
          case RD3_Glb.FORMDOCK_LEFT :
            fnd=true;
            this.LeftDockedBox.style.cursor=cn;
          break;
          
          case RD3_Glb.FORMDOCK_TOP :
            this.TopDockedBox.style.cursor=cn;
          break;
          
          case RD3_Glb.FORMDOCK_BOTTOM :
            this.BottomDockedBox.style.cursor=cn;
          break;
        }
      }
    }
    //
    // Se non ho trovato nemmeno una docked allora lo applico alla form
    if (!fnd)
      this.FormsBox.style.cursor=cn;
    //
    this.SideMenuBox.style.cursor=cn;
  }
  //
  if (this.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
  {
    var fnd = false;
    var nf = RD3_DesktopManager.WebEntryPoint.StackForm.length;
    for (var t=0;t<nf;t++)
    {
      var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
      if (f.Docked)
      {
        switch (f.DockType)
        {
          case RD3_Glb.FORMDOCK_RIGHT :
            fnd=true;
            this.RightDockedBox.style.cursor=cn;
          break;
          
          case RD3_Glb.FORMDOCK_TOP :
            this.TopDockedBox.style.cursor=cn;
          break;
          
          case RD3_Glb.FORMDOCK_BOTTOM :
            this.BottomDockedBox.style.cursor=cn;
          break;
        }
      }
    }
    //
    // Se non ho trovato nemmeno una docked allora lo applico alla form
    if (!fnd)
      this.FormsBox.style.cursor=cn;
    //
    this.SideMenuBox.style.cursor=cn;
  }
}

// ***************************************
// Metodi per gestire il tipo di resize
// ***************************************
WebEntryPoint.prototype.CanResizeW= function() 
{
  return true;
}
WebEntryPoint.prototype.CanResizeH= function() 
{
  return false;
}
WebEntryPoint.prototype.CanResizeL= function() 
{
  return true;
}
WebEntryPoint.prototype.CanResizeR= function() 
{
  return true;
}
WebEntryPoint.prototype.CanResizeT= function() 
{
  return false;
}
WebEntryPoint.prototype.CanResizeD= function() 
{
  return false;
}

// **************************************************
// Ridimensiono il menu laterale
// **************************************************
WebEntryPoint.prototype.OnTransform = function(x, y, w, h, evento)
{
  if (w<RD3_ClientParams.SideMenuMinWidth)
    w=RD3_ClientParams.SideMenuMinWidth;
  //
  // Per prima cosa accodo il messaggio di resize del menu: infatti l'impostazione della dimensione fa scattare i resize,
  // quindi dopo e' troppo tardi per inviare l'evento (finirebbe dopo i resize, mentre va gestito prima, cosi' negli eventi il server ha gia'
  // il valore corretto)
  var ev = new IDEvent("menures", this.Identifier, evento, RD3_Glb.EVENT_SERVERSIDE, w);
  this.SetSideMenuWidth(w);
}


// **************************************************
// Gestione del Refresh Interval
// **************************************************
WebEntryPoint.prototype.RefreshIntervalTick = function()
{
  var ev = new IDEvent("rfi", this.Identifier, null, RD3_Glb.EVENT_ACTIVE);
}


// **************************************************
// Ritorna la prima docked del tipo considerato
// se flvisible=true, torna solo le dock visibili
// **************************************************
WebEntryPoint.prototype.GetDockedForm = function(docktype, flvisible)
{
  for (var i=0; i<this.StackForm.length; i++)
  {
    var f = this.StackForm[i];
    if (f.Docked && f.DockType==docktype)
    {
      if (!flvisible || f.Visible)
        return f;
    }
  }
}


// **************************************************
// Esegue animazione forms
// **************************************************
WebEntryPoint.prototype.AnimateForms = function(frm1ident, frm2ident, fldx)
{
  var frm1 = RD3_DesktopManager.ObjectMap[frm1ident];
  var frm2 = RD3_DesktopManager.ObjectMap[frm2ident];
  //
  frm1.EnableIDScroll(false);
  frm2.EnableIDScroll(false);
  //
  frm1.FormBox.style.display="";
  frm2.FormBox.style.display="";
  RD3_Glb.SetTransitionProperty(frm1.FormBox, "-webkit-transform");
  RD3_Glb.SetTransitionProperty(frm2.FormBox, "-webkit-transform");
  RD3_Glb.SetTransitionDuration(frm1.FormBox, "0ms");
  RD3_Glb.SetTransitionDuration(frm2.FormBox, "0ms");
  //
  var pini = 0;
  var pfin = 0;
  var cini = 0;
  var cfin = 0;
  //
  if (fldx)
  {
    // frm1 a video, frm2 entra da destra
    f1ini = 0;
    f1fin = -this.FormsBox.offsetWidth;
    f2ini = this.FormsBox.offsetWidth;
    f2fin = 0;
  }
  else
  {
    // frm1 a video, frm2 entra da sinistra
    f1ini = -this.FormsBox.offsetWidth;
    f1fin = 0;
    f2ini = 0;
    f2fin = this.FormsBox.offsetWidth;
  }
  //
  // Posiziono gli elementi usando il 3d
  RD3_Glb.SetTransform(frm1.FormBox, "translate3d("+f1ini+"px,0px,0px)");
  RD3_Glb.SetTransform(frm2.FormBox, "translate3d("+f2ini+"px,0px,0px)");
  //
  // Eseguo l'animazione
  var sc = "RD3_Glb.SetTransitionDuration(document.getElementById('"+ frm1.FormBox.id+"'), '250ms');";
  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ frm2.FormBox.id+"'), '250ms');";  
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ frm1.FormBox.id+"'), 'translate3d("+f1fin+"px,0px,0px)');";
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ frm2.FormBox.id+"'), 'translate3d("+f2fin+"px,0px,0px)');";
  //
  if (!this.ea)
    this.ea = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)");
  RD3_Glb.AddEndTransaction(frm1.FormBox, this.ea, false);
  window.setTimeout(sc,30);
  //
  this.AniForm1 = frm1;
  this.AniForm2 = frm2;
  this.AniMode = fldx;
}


// *******************************************************************
// Gestisce animazione combo mobile
// *******************************************************************
WebEntryPoint.prototype.OnEndAnimation = function(ev) 
{
  if (RD3_Glb.GetTransitionDuration(this.AniForm1.FormBox)=="0ms")
    return;
  // 
  RD3_Glb.RemoveEndTransaction(this.AniForm1.FormBox, this.ea, false);
  RD3_Glb.SetTransitionProperty(this.AniForm1.FormBox, "");
  RD3_Glb.SetTransitionProperty(this.AniForm2.FormBox, "");
  RD3_Glb.SetTransitionDuration(this.AniForm1.FormBox, "");
  RD3_Glb.SetTransitionDuration(this.AniForm2.FormBox, "");
  RD3_Glb.SetTransform(this.AniForm1.FormBox, "");
  RD3_Glb.SetTransform(this.AniForm2.FormBox, "");
  this.AniForm1.EnableIDScroll(true);
  this.AniForm2.EnableIDScroll(true);
  //
  if (this.AniMode)
  {
    // E' entrata la form 2 da destra, quindi form 1 deve essere deattivata
    this.ActivateForm(this.AniForm2, true);
  }
  else
  {
    // E' entrata la form 1 da sinistra, quindi form 2 deve essere chiusa
    this.CloseForm2(this.AniForm2);
    //
    // Siccome sono tornato indietro, i pannelli della form1 perdono hiliterow
    for (var i=0; i<this.AniForm1.Frames.length; i++) 
    {
      if (this.AniForm1.Frames[i] instanceof IDPanel)
        this.AniForm1.Frames[i].HiliteRow(0);
    }
  }
  //
  this.AniForm1 = undefined;
  this.AniForm2 = undefined;
  this.AniMode = undefined;
  //
  if (this.FormToActivate)
  {
    var f = this.FormToActivate;
    this.FormToActivate = null;
    this.ActivateForm(f);
  }
}

//*******************************************************************
// Gestione del bottone back per Android
//*******************************************************************
WebEntryPoint.prototype.OnBackButton = function() 
{
  // Se la finestra di attesa e' aperta non faccio nulla
  var msgPump = RD3_DesktopManager.MessagePump;
  if (window.RD4_Enabled)
    msgPump = RD3_DesktopManager.MessagePumpRD4;
  //
  if (msgPump.DelayDlg.Opened)
      return true;
  //
  // Se c'e' una combo aperta, la chiudo
  if (RD3_DDManager.OpenCombo)
  {
    RD3_DDManager.OpenCombo.Close();
    return true;
  }
  //
  var lastObjID = this.WepBox.lastChild.id;
  if (lastObjID.substr(0,6) == "MSGBOX" || lastObjID.substr(0,5) == "POPUP")
  {
    var obj = RD3_DesktopManager.ObjectMap[lastObjID.substr(0,lastObjID.lastIndexOf(':'))];
    if (obj instanceof MessageBox)
    {
      // Se c'e' un MessageBox, lo chiudo confermando
      if (obj.Type == RD3_Glb.MSG_BOX)
        obj.OnOKClick({});
      // Se c'e' un MessageConfirm o un InputBox, lo chiudo annullando
      else if (obj.CancelButton && obj.CancelButton.style.display == "")
        obj.OnCancelClick({});
      //
      // In ogni caso non faccio altro
      return true;
    }
    //
    // Se c'e' un PopupControl aperto, lo chiudo
    if (obj instanceof PopupControl)
    {
      obj.Close();
      return true;
    }
  }
  //
  // Se c'e' il menu' a tutto schermo, si torna al livello superiore
  if (RD3_Glb.IsSmartPhone() && this.SideMenuBox && this.SideMenuBox.style.display == "")
  {
    // Menu smartPhone: se c'e' un commandset attivo allora lo chiudo direttamente
    if (this.CmdObj.ActiveCommand && this.CmdObj.ActiveCommand.IsCmdSet)
    {
      this.CmdObj.ActiveCommand.OnBack({});
      return true;
    }
    //
    if (this.CmdObj.HandleBackButton())
      return true;
  }
  //
  if (!RD3_Glb.IsSmartPhone() && this.CmdObj.MenuButton && this.CmdObj.MenuButton.style.display == "")
  {
    for (var i=0;i<RD3_DDManager.iOpenPopup.length;i++)
    {
      // Se c'e' il menu' aperto come popup
      if (RD3_DDManager.iOpenPopup[i].ObjToAttach == this.CmdObj.MenuButton)
      {
        // Se non sono al primo livello, si torna al livello superiore
        if (this.CmdObj.ActiveCommand && this.CmdObj.ActiveCommand.IsCmdSet)
        {
          this.CmdObj.ActiveCommand.OnBack({});
          return true;
        }
        else // Se sono al primo livello, chiudo il popup
        {
          RD3_DDManager.iOpenPopup[i].OnClickOut({});
          return true;
        }
      }
    }
  }
  //
  // Se c'e' una form attiva chiedo a lei se vuole tornare indietro su qualcosa
  if (this.ActiveForm && this.ActiveForm.OnBackButton())
    return true;
  //
  // Se c'e' il menu' presente a video: si torna al livello superiore.
  if (!RD3_Glb.IsSmartPhone() && this.SideMenuBox && this.SideMenuBox.style.display == "")
  {
    if (this.CmdObj.ActiveCommand && this.CmdObj.ActiveCommand.IsCmdSet)
    {
      this.CmdObj.ActiveCommand.OnBack({});
      return true;
    }
  }
  //
  // Chiudo l'app
  if (RD3_ShellObject.IsInsideShell())
    RD3_ShellObject.SendCmd("EXIT");
  else
    top.close();
}

//********************************************************************
// Restituisce la ScreenZone corrispondente alla posizione richiesta
//********************************************************************
WebEntryPoint.prototype.GetScreenZone = function(zonePos) 
{
  for (var i=0; i<this.ScreenZones.length; i++)
  {
    var scz = this.ScreenZones[i];
    if (scz && scz.Position==zonePos)
      return scz;
  }
  //
  return null;
}


// ********************************************************************************
// Il browser e' stato ridimensionato
// ********************************************************************************
WebEntryPoint.prototype.OnIconClick = function(evento)
{ 
  if (this.IsIconActive())
    RD3_SendCommand("IconClick"); 
}

WebEntryPoint.prototype.OnTouchDown = function(ev)
{
  var initX = 0;
  var initY = 0;
  //
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    initX = ev.targetTouches[0].screenX;
    initY = ev.targetTouches[0].screenY;
  }
  else if (RD3_Glb.IsIE(10, true))
  {
    initX = (window.event)?window.event.screenX:ev.screenX;
    initY = (window.event)?window.event.screenY:ev.screenY;
  }
  //
  // Detect swipe direction
  if (initX <= 40) // Swipe parte da sinistra
  {
    this.SwipeSide = RD3_Glb.SWIPE_LEFT;
    this.SwipeIn = true;
  }
  else if (initX >= this.WepBox.offsetWidth-40) // Swipe destro
  {
    this.SwipeSide = RD3_Glb.SWIPE_RIGHT;
    this.SwipeIn = true;
  }
  else if (initY <= 40) // Swipe in alto
  {
    this.SwipeSide = RD3_Glb.SWIPE_TOP;
    this.SwipeIn = true;
  }
  else if (initY >= this.WepBox.offsetHeight-40) // Swipe dal basso
  {
    this.SwipeSide = RD3_Glb.SWIPE_BOTTOM;
    this.SwipeIn = true;
  }
  else if (initX<=300)
  {
    // detect swipe out
    if (initY>=0 && initY<=300)  // swipe out top-left
      this.SwipeSide = RD3_Glb.SWIPE_TOPLEFT;
    else if (initY>=this.WepBox.offsetHeight-300)  // swipe out bottom-left
      this.SwipeSide = RD3_Glb.SWIPE_BOTTOMLEFT;
    else  // swipe out left
      this.SwipeSide = RD3_Glb.SWIPE_LEFT;
    //
    this.SwipeIn = false;
  }
  else if (initX>=this.WepBox.offsetWidth-300)
  {
    // detect swipe out
    if (initY<=300)  // swipe out top-right
      this.SwipeSide = RD3_Glb.SWIPE_TOPRIGHT;
    else if (initY>=this.WepBox.offsetHeight-300)  // swipe out bottom-right
      this.SwipeSide = RD3_Glb.SWIPE_BOTTOMRIGHT;
    else  // swipe out right
      this.SwipeSide = RD3_Glb.SWIPE_RIGHT;
    //
    this.SwipeIn = false;
  }
  else if(initY<=300)
  {
    this.SwipeSide = RD3_Glb.SWIPE_TOP;
    this.SwipeIn = false;
  }
  else if(initY>=this.WepBox.offsetHeight-300)
  {
    this.SwipeSide = RD3_Glb.SWIPE_BOTTOM;
    this.SwipeIn = false;
  }
  //
  if (this.SwipeSide && (this.SwipeSide>=RD3_Glb.SWIPE_LEFT && this.SwipeSide<=RD3_Glb.SWIPE_BOTTOMRIGHT))
  {
    this.TouchOrgX = initX;
    this.TouchOrgY = initY;
    this.TrackMove = true;
  }
  //
  return true;
}

WebEntryPoint.prototype.OnTouchMove = function(ev)
{
  if (this.TrackMove)
  {
    var actX = 0;
    var actY = 0;
    //
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
    {
      actX = ev.targetTouches[0].screenX;
      actY = ev.targetTouches[0].screenY;
    }
    else if (RD3_Glb.IsIE(10, true))
    {
      actX = (window.event)?window.event.screenX:ev.screenX;
      actY = (window.event)?window.event.screenY:ev.screenY;
    }
    //
    if (this.SwipeIn)
    {
      switch (this.SwipeSide)
      {
        case RD3_Glb.SWIPE_LEFT :
          if ((actX-this.TouchOrgX > RD3_Glb.SwipeDelta) && (actY>=this.TouchOrgY-RD3_Glb.SwipeLimit && actY<=this.TouchOrgY+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
        
        case RD3_Glb.SWIPE_RIGHT :
          if ((actX <= this.TouchOrgX-RD3_Glb.SwipeDelta) && (actY>=this.TouchOrgY-RD3_Glb.SwipeLimit && actY<=this.TouchOrgY+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
        
        case RD3_Glb.SWIPE_TOP :
          if ((actY-this.TouchOrgY > RD3_Glb.SwipeDelta) && (actX>=this.TouchOrgX-RD3_Glb.SwipeLimit && actX<=this.TouchOrgX+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_TOP);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
        
        case RD3_Glb.SWIPE_BOTTOM :
          if ((actY<= this.TouchOrgY-RD3_Glb.SwipeDelta) && (actX>=this.TouchOrgX-RD3_Glb.SwipeLimit && actX<=this.TouchOrgX+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_BOTTOM);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
      }
    }
    else // SWIPE OUT
    {
      switch (this.SwipeSide)
      {
        case RD3_Glb.SWIPE_LEFT :
          if ((this.TouchOrgX-actX >= RD3_Glb.SwipeDelta) && (actY>=this.TouchOrgY-RD3_Glb.SwipeLimit && actY<=this.TouchOrgY+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
        
        case RD3_Glb.SWIPE_RIGHT :
          if ((actX-this.TouchOrgX >= RD3_Glb.SwipeDelta) && (actY>=this.TouchOrgY-RD3_Glb.SwipeLimit && actY<=this.TouchOrgY+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
        
        case RD3_Glb.SWIPE_TOP :
          if ((this.TouchOrgY-actY >= RD3_Glb.SwipeDelta) && (actX>=this.TouchOrgX-RD3_Glb.SwipeLimit && actX<=this.TouchOrgX+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_TOP);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
        
        case RD3_Glb.SWIPE_BOTTOM :
          if ((actY-this.TouchOrgY >= RD3_Glb.SwipeDelta) && (actX>=this.TouchOrgX-RD3_Glb.SwipeLimit && actX<=this.TouchOrgX+RD3_Glb.SwipeLimit))
          {
            this.TrackMove = false;
            //
            var scz = this.GetScreenZone(RD3_Glb.FORMDOCK_BOTTOM);
            if (scz)
              scz.OnSwipeZone(this.SwipeIn);
          }
        break;
        
        case RD3_Glb.SWIPE_TOPLEFT :
          //
          // In questo punto devo capire se sta andando verso sopra o verso sinistra..
          var leftSwipe = this.TouchOrgX-actX;
          var topSwipe = this.TouchOrgY-actY;
          //
          if (leftSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_LEFT;
            this.OnTouchMove(ev);
          }
          else if (topSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_TOP;
            this.OnTouchMove(ev);
          }
        break;
        
        case RD3_Glb.SWIPE_BOTTOMLEFT :
          //
          // In questo punto devo capire se sta andando verso sotto o verso sinistra..
          var leftSwipe = this.TouchOrgX-actX;
          var bottomSwipe = actY-this.TouchOrgY;
          //
          if (leftSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_LEFT;
            this.OnTouchMove(ev);
          }
          else if (bottomSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_BOTTOM;
            this.OnTouchMove(ev);
          }
        break;
        
        case RD3_Glb.SWIPE_TOPRIGHT :
          //
          // In questo punto devo capire se sta andando verso sopra o verso destra..
          var rightSwipe = actX-this.TouchOrgX;
          var topSwipe = this.TouchOrgY-actY;
          //
          if (rightSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_RIGHT;
            this.OnTouchMove(ev);
          }
          else if (topSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_TOP;
            this.OnTouchMove(ev);
          }
        break;
        
        case RD3_Glb.SWIPE_BOTTOMRIGHT :
          //
          // In questo punto devo capire se sta andando verso sotto o verso sinistra..
          var rightSwipe = actX-this.TouchOrgX;
          var bottomSwipe = actY-this.TouchOrgY;
          //
          if (rightSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_RIGHT;
            this.OnTouchMove(ev);
          }
          else if (bottomSwipe>=RD3_Glb.SwipeDelta)
          {
            this.SwipeSide = RD3_Glb.SWIPE_BOTTOM;
            this.OnTouchMove(ev);
          }
        break;
      }
    }
  }
  //
  return true;
}

WebEntryPoint.prototype.OnTouchUp = function(ev)
{
  this.TrackMove = false;
  this.SwipeSide = null;
  //
  return true;
}

WebEntryPoint.prototype.UseZones = function()
{
  return RD3_ServerParams.UseZones && !RD3_Glb.IsSmartPhone() && this.ScreenZones.length>0;
}
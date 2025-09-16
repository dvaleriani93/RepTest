// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PopupDelay: Implementa la finestra
// di attesa
// Estende PopupFrame
// ************************************************

function PopupDelay()
{
  this.MessageText = RD3_ServerParams.DelayDefaultMessage; // Il testo del messaggio da mostrare
  this.Progress = 0;                    // Intero da 0 a 100 che indica la percentuale di completamento
                                        // (se il tipo e' delay viene impostato autometicamente, se e' progress cambiando questo valore
                                        // cambia la lunghezza della linea)
  this.Total = -1;                      // Valore totale della progress bar calcolata dal server: serve per poter impostare il progresso in percentuale                                        
  this.Present = -1;                    // Valore attuale della progress bar impostata dal server: serve per calcolare il valore percentuale
  this.CanAbort = false;                // Mostrare o meno il pulsante di abort?
  this.DelayType = RD3_Glb.DELAY;       // 0 - delay 1 - progress
  //
  this.Identifier = "DELAY" + Math.floor(Math.random() * 100);  // Identificatore per gestire il timer
                                                                // (ci puo' essere un solo PopupDelay per volta, basterebbe anche una stringa fissa per identificatore)
  // Altre variabili di questo oggetto di modello
  this.Opened = false;
  this.Hidden = false;  // Per le delay a doppia comparsa indica se sono aperte ma ancora invisibili
  //
  // Elementi visuali della PopupDelay
  this.TextBox = null;               // Span contenente il testo del messaggio
  this.ProgressBoxContainer = null;  // Div che contiene tutta la progress bar
  this.ProgressBox = null;           // Div che lo stato si avanzamento
  this.InnerProgress = null;         // Div interno della progress Bar
  this.AbortButton = null;           // Pulsante di abort per le operazioni interrompibili
  //
  // Altre variabili di questo oggetto
  this.Interval = null;           // Timer per gestire l'aggiornamento automatico della delay, scatta ogni 200 milli
  this.AnimationInterval = null;  // Timer per gestire l'animazione dell'avanzamento, scatta sempre
  this.ProgressTimer = null;      // Timer per gestire il controllo di progresso lato server
  this.XmlReq = null;             // Oggetto che gestisce la richiesta al server del file XML
}
// Definisco l'estensione della classe
PopupDelay.prototype = new PopupFrame();


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
PopupDelay.prototype.Realize = function()
{
  // Impostazioni iniziali 
  this.Centered = true;
  this.Modal = true;
  this.HasCaption = false;
  this.CanMove = true;
  this.CanResize = false;
  this.Height = 0;
  this.Width = 0;
  //
  // Se il bordo e' quello di default, allora non cambio il funzionamento esistente, 
  // altrimenti e' quello che mi ha chiesto lo sviluppatore
  if (RD3_ServerParams.BorderType == RD3_Glb.BORDER_DEFAULT)
  {
    if (RD3_ServerParams.Theme.startsWith("seattle"))
      this.Borders = RD3_Glb.BORDER_THICK;
    else
      this.Borders = RD3_Glb.BORDER_THIN;
  }
  else
    this.Borders = RD3_ServerParams.BorderType;
  //
  // Chiamo la classe base
  PopupFrame.prototype.Realize.call(this,"-message-box", this.UseDoubleMode());
  //
  // Crea il testo
  this.TextBox = document.createElement("div");
  this.TextBox.className = "popup-delay-text";
  //
  // Crea la progress bar esterna
  this.ProgressBoxContainer = document.createElement("div");
  this.ProgressBoxContainer.className = "popup-delay-progress-container";
  this.ProgressBox = document.createElement("div");
  this.ProgressBox.className = "popup-delay-progress-box";
  //
  // Crea la progressBar interna
  this.InnerProgress = document.createElement("div");
  this.InnerProgress.className = "popup-delay-inner-progress-box";
  //
  // Crea il pulsante di annullamento
  this.AbortButton = document.createElement("input");
  this.AbortButton.type = "button";
  this.AbortButton.value = ClientMessages.MSG_POPUP_CancelButton;
  this.AbortButton.className = "popup-progress-abortbutton";
  this.AbortButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'Abort', ev)");;
  //
  // Inserisce gli elementi nel DOM
  this.ProgressBox.appendChild(this.InnerProgress);
  this.ProgressBoxContainer.appendChild(this.ProgressBox);
  this.ContentBox.appendChild(this.TextBox);
  this.ContentBox.appendChild(this.ProgressBoxContainer);
  this.ContentBox.appendChild(this.AbortButton);
  //
  // Inpostazioni iniziali
  this.SetType();
  this.SetText();
  this.SetCanAbort();
  //
  if (this.UseDoubleMode() && !this.AutoClose)
  {
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
      this.ModalBox.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnModalMouseDown', ev)");
    else
      this.ModalBox.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnModalMouseDown', ev)");
  }
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PopupDelay.prototype.Unrealize = function()
{
  if (this.Realized)
  {
    // Chiamo la classe base
    PopupFrame.prototype.Unrealize.call(this);  
    //
    // Cancello i riferimenti al DOM
    this.TextBox = null;          
    this.ProgressBox = null;      
    this.InnerProgress = null;
    this.AbortButton = null;
    //
    if (this.Interval)
      clearInterval(this.Interval);
    this.Interval = null;
  }
}

// ***************************************************
// Dimensiono la Box in base al contenuto
// ***************************************************
PopupDelay.prototype.AdaptLayout = function()
{
  if (this.Hidden)
    return;
  //
  // Calcolo la dimensione da usare per il popup
  var usedw = this.TextBox.offsetWidth;
  var minw = (this.Type == RD3_Glb.MSG_INPUT) ? RD3_ClientParams.PopupInputMinW : RD3_ClientParams.PopupDlgMinW;
  //
  //La larghezza massina e' meta' del WepBox, ma sui dispositivi touch e' pari all'80%
  var maxw = 800;
  if (RD3_DesktopManager.WebEntryPoint) 
  {
    var maxp = RD3_Glb.IsTouch()?0.8:0.5;
    maxw = Math.max(RD3_DesktopManager.WebEntryPoint.WepBox.clientWidth * maxp, minw);
  }
  //
  var w;              // larghezza totale del popup
  //
  // Gestisco dimensioni minime e massime
  w = (usedw < minw) ? minw : usedw;
  w = (w > maxw) ? maxw : w;
  //
  // Dimensiono gli oggetto del DOM
  this.SetWidth(w);
  RD3_Glb.AdaptToParent(this.ContentBox, 0, -1);
  //
  // Dimensiono il contenitore della progress bar
  this.ProgressBoxContainer.style.width = (w - 20) + "px";
  if (this.ProgressBoxContainer.offsetWidth > (w - 20))
    this.ProgressBoxContainer.style.width = (this.ProgressBoxContainer.offsetWidth - (this.ProgressBoxContainer.offsetWidth - this.ProgressBoxContainer.clientWidth)) + "px";
  this.ProgressBoxContainer.style.top = this.TextBox.offsetTop + this.TextBox.offsetHeight + "px";
  this.ProgressBoxContainer.style.left = (w-this.ProgressBoxContainer.offsetWidth)/2 + "px";
  //
  // Dimensiono l'indicatore dello stato di avanzamento
  RD3_Glb.AdaptToParent(this.ProgressBox, -1, 0);
  //
  // Dimensiono l'animazione interna alla progress bar
  RD3_Glb.AdaptToParent(this.InnerProgress, -1, 0);
  //
  // Se e' una delay la progress bar e' sempre al massimo e c'e' solamente l'animazione
  if (this.DelayType == RD3_Glb.DELAY && !RD3_Glb.IsMobile())
    RD3_Glb.AdaptToParent(this.ProgressBox, 0, 0);
  //
  // Posiziono il pulsante di annullamento
  this.AbortButton.style.top = this.ProgressBoxContainer.offsetTop + this.ProgressBoxContainer.offsetHeight + 5 + "px";
  this.AbortButton.style.left = (w - this.AbortButton.clientWidth)/2 + "px";
  //
  // Dimensiono verticalmente il popup
  var hbut = 0;
  if (this.CanAbort)
    hbut = this.AbortButton.offsetHeight + 5;
  this.SetHeight(this.TextBox.offsetTop + this.TextBox.offsetHeight + this.ProgressBoxContainer.offsetHeight + (this.CaptionBox?this.CaptionBox.offsetHeight:0) + hbut + 10);
  //
  // Chiamo l'adapt della classe padre
  PopupFrame.prototype.AdaptLayout.call(this);
  //
  // Dopo aver aperto la form centrata, resetto il flag in modo da poter gestire
  // la videata a piacimento
  this.Centered = false;
}


// ********************************************************************************
// Realizza e mostra a video questa popup
// side: 0 lato client, 1 o undefined lato server (usato solo per tipo delay,
// indica se deve andare sul server a verificare se gli e' stato richiesto di diventare
// una progress bar)
// ********************************************************************************
PopupDelay.prototype.Open = function(text, type, side)
{ 
  if (text!=undefined)
    this.SetText(text);
  if (type!=undefined)
    this.SetType(type);
  //
  if (!side)
    side = 1;
  //
  // Chiamo la classe base
  PopupFrame.prototype.Open.call(this);  
  //
  if (this.UseDoubleMode())
  {
    this.PopupBox.style.visibility = "hidden";
    this.Hidden = true;
    //
    // Nessuna animazione per ora
    if (this.AnimationInterval)
    {
      clearInterval(this.AnimationInterval);
      this.AnimationInterval = null;
    }
    //
    this.DelayShowTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnModalMouseDown')", RD3_ClientParams.DelayDlgShowTime);
  }
  //
  this.PopupBox.style.display = "";
  this.ModalBox.style.display = "";
  //
  // Delay Dialog: se non e' attivo attivo il timer di aggiornamento
  if (this.DelayType == RD3_Glb.DELAY)
  {
    if (!this.AnimationInterval && !this.UseDoubleMode())
    {
      this.AnimationInterval = window.setInterval("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'AnimateProgress')", 10);
    }
    //
    // Attivo il timer per controllare se il server ha richiesto che diventi una progress bar
    if (side == 1)
      this.ProgressTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'RefreshProgressBar')", 500);
  }
  //
  this.Opened = true;
}


// ********************************************************************************
// Chiude la finestra
// ********************************************************************************
PopupDelay.prototype.Close = function()
{ 
  if (!this.Realized)
    return;
  //
  // Se c'e' un timer pendente lo cancello
  if (this.Interval)
  {
    clearInterval(this.Interval);
    this.Interval = null;
  }
  //
  if (this.AnimationInterval)
  {
    clearInterval(this.AnimationInterval);
    this.AnimationInterval = null;
  }
  //
  if (this.ProgressTimer)
  {
    clearTimeout(this.ProgressTimer);
    this.ProgressTimer = null;
  }
  //
  if (this.DelayShowTimer)
  {
    clearTimeout(this.DelayShowTimer);
    this.DelayShowTimer = null;
  }
  //
  // Svuoto la progress bar
  this.SetProgress(0);
  this.SetCanAbort(false);
  this.SetTotal(-1);
  this.SetPresent(-1);
  //
  // Nascondo i box
  this.PopupBox.style.display = "none";
  this.ModalBox.style.display = "none";
  this.InnerProgress.style.left = "0px";
  //
  // Distruggo tutto
  this.Unrealize();
  //
  this.Opened = false;
}


// ********************************************************************************
// Cambia il valore del testo del messaggio
// ********************************************************************************
PopupDelay.prototype.SetText = function(value)
{ 
  if (value != undefined)
    this.MessageText = value;
  //
  if (this.Realized)
  {
    var txt = this.MessageText;
    if (!txt || txt == "")
      txt = RD3_ServerParams.DelayDefaultMessage;
    //
    this.TextBox.innerHTML = txt;
  }
}


// ********************************************************************************
// Imposta il tipo di delay: delay pura o progress bar
// ********************************************************************************
PopupDelay.prototype.SetType = function(value)
{ 
  if (value != undefined)
    this.DelayType = value;
  //
  if (this.Realized)
  {
    if (this.DelayType == RD3_Glb.DELAY)
    {
      ;
    }
    else
    {
      // Progress Bar: se e' attivo disattivo il timer di aggiornamento e azzero la progress bar
      if (this.Interval)
      {
        window.clearInterval(this.Interval);
        this.Interval = null;
      }
      //
      // Azzero la progress bar
      this.SetProgress(0);
      //
      if (this.Hidden)
      {
        window.setTimeout("document.getElementById('"+this.ModalBox.id+"').style.opacity = 1", 5);
        window.setTimeout("RD3_Glb.SetTransform(document.getElementById('"+this.PopupBox.id+"'), 'scale3d(1,1,1)');", 5);
        this.PopupBox.style.visibility = "visible";
        this.Hidden = false;
        //
        if (this.DelayShowTimer)
        {
          clearTimeout(this.DelayShowTimer);
          this.DelayShowTimer = null;
        }
      }
    }
    //
    if (!this.AnimationInterval)
      this.AnimationInterval = window.setInterval("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'AnimateProgress')", 10);
  }
}


// ********************************************************************************
// Imposta il livello di progresso e se necessario aggiorna la visualizzazione
// Value e' la percentuale di completamento (intero da 0 a 100)
// ********************************************************************************
PopupDelay.prototype.SetProgress = function(value)
{ 
  // Aggiorno il valore del conteggio (se e' > 100 faccio il modulo)
  this.Progress = value>100 ? value%100 : value;
  // 
  // Allargo il div rappresentante lo stato di avanzamento
  this.ProgressBox.style.width = (this.ProgressBoxContainer.clientWidth/100*this.Progress) + "px";
}


PopupDelay.prototype.SetTotal = function(value)
{ 
  this.Total = value;
}

PopupDelay.prototype.SetPresent = function(value)
{ 
  this.Present = value;
}

PopupDelay.prototype.SetCanAbort = function(value)
{ 
  if (value != undefined)
    this.CanAbort = value;
  //
  if (this.Realized)
  {
    this.AbortButton.style.display = this.CanAbort ? "" : "none";
    //
    // Devo portare in primo piano la finestra di delay, dandogli uno z-index superiore a quella
    // del div che blocca l'interfaccia utente, se no non si preme il pulsante
    if (RD3_Glb.IsMobile())
    {
      this.PopupBox.style.zIndex = this.CanAbort?10000:"";
    }
    else
    {
      if (this.CanAbort)
      {
        this.PopupBox.className = "popup-frame-container-abortible";
        this.PopupBox.style.zIndex = "";
      }
      else
      {
        this.PopupBox.className = "popup-frame-container";
        this.PopupBox.style.zIndex = 300;
      }
    }
  }
}
// ******************************************************************
// Gestisce l'animazione dell'avanzamento della richiesta
// ******************************************************************
PopupDelay.prototype.AnimateProgress = function()
{
  var l = this.InnerProgress.offsetLeft;
  l = (l) ? l : 0;
  //
  // Nascondo la stellina 2 giri su 3
  if (this.InnerProgress.offsetLeft > (this.ProgressBox.clientWidth*3))
    this.InnerProgress.style.left = (0 - this.InnerProgress.offsetWidth) + "px";
  else
    this.InnerProgress.style.left = (l + RD3_ClientParams.PopupProgressSpeed) +"px";
}

// ********************************************************************************
// Metodo chiamato dal timer della Delay per aggiornare la ProgressBar
// ********************************************************************************
PopupDelay.prototype.ProgressTick = function()
{ 
  if (this.DelayType == RD3_Glb.DELAY && this.Realized && !RD3_Glb.IsMobile())
  {
    // Aggiorno il valore della progress bar di 10
    this.SetProgress(this.Progress + 10);
  } 
}

// ********************************************************************************
// Metodo chiamato per verificare la presenza sul server del file necessario per le
// operazioni interrompibili
// ********************************************************************************
PopupDelay.prototype.RefreshProgressBar = function()
{ 
  this.ProgressTimer = null;
  //
  if (window.RD4_Enabled)
    this.ProcessRequestChange();
  else
  {
    // Verifico la presenza del file XML facendo una richiesta
    this.XmlReq = RD3_DesktopManager.MessagePump.CreateRequest();
    //
    this.XmlReq.onreadystatechange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'ProcessRequestChange', ev)");
    //
    // Invio la richiesta
    if (this.XmlReq.overrideMimeType)
      this.XmlReq.overrideMimeType('text/xml');
    this.XmlReq.open("GET", "temp/" + RD3_DesktopManager.WebEntryPoint.ProgressBarFile + "?NOCACHE=" + Math.random(), true);
    this.XmlReq.send("");
  }
}

// ********************************************************************************
// Metodo che scatta alla risposta da parte del server della lettura del file xml
// ********************************************************************************
PopupDelay.prototype.ProcessRequestChange = function()
{
  var ok = false;
  if (window.RD4_Enabled)
  { 
    ok = true;
    if (RD4_ApplicationManager.progress)
    {
      this.SetPresent(RD4_ApplicationManager.progress.present);
      this.SetTotal(RD4_ApplicationManager.progress.total);
      this.SetCanAbort(RD4_ApplicationManager.progress.canAbort);
      this.SetText(RD4_ApplicationManager.progress.message);
    }
  }
  else
  {
    // only if req shows "loaded"
    if (this.XmlReq.readyState == 4)
    {
      // only if "OK"
      if (this.XmlReq.status == 200 && this.XmlReq.responseXML)
      {
        // IE PATCH
        if (this.XmlReq.responseXML.childNodes.length==0 && document.all)
        {
          // IE non carica bene il documento XML se il server
          // non invia ContentType=text/xml... e a volte non succede!!!
          var xml = this.XmlReq.responseText;
          if (xml.indexOf("\n")!=-1)
            xml = xml.substring(xml.indexOf("\n")+1);
          this.XmlReq.responseXML.loadXML(xml);
        }
        //
        var xmlDoc = this.XmlReq.responseXML;
        this.ParseXML(xmlDoc);
        ok = true;
      }
      else
      {
        // alert("There was a problem retrieving the XML data:\n" + req.statusText);
        this.ProgressTimer = null;
      }
    }
  }
  //
  if (ok)
  {
    // Se non sono una progress bar lo divento
    if (this.DelayType != RD3_Glb.PROGRESS)
      this.SetType(RD3_Glb.PROGRESS);
    //
    // Imposto il progresso percentuale
    this.SetProgress((this.Present/this.Total)*100);
    //
    // Rieffettuo la chiamata al server se sono ancora aperto
    if (this.Realized)
      this.ProgressTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'RefreshProgressBar')",2000);
  }
}

// ********************************************************************************
// Metodo che elabora il file XML letto dal server
// ********************************************************************************
PopupDelay.prototype.ParseXML = function(xmldoc)
{ 
  var xmlNode = null;
  if (xmldoc.childNodes.length > 0)
  {
    xmlNode = xmldoc.childNodes[xmldoc.childNodes.length-1];
    for (var i=0; i<xmlNode.childNodes.length; i++)
    {
      var k = xmlNode.childNodes[i];
      switch (k.nodeName)
      {
        case "PRESENT":  this.SetPresent(parseInt(k.firstChild.nodeValue)); break;
        case "TOTAL":    this.SetTotal(parseInt(k.firstChild.nodeValue)); break;
        case "CANABORT": this.SetCanAbort(k.firstChild.nodeValue == "-1"); break;
        case "MESSAGE":  this.SetText(k.firstChild == null ? "" : k.firstChild.nodeValue); break;
      }
    }
  }
}


// ********************************************************
// Annulla l'operazione in corso
// ********************************************************
PopupDelay.prototype.Abort = function()
{
  // Se sto mostrando l'avanzamento di un upload
  if (this.FlashUploading)
  {
    // Disabilito il pulsante di abort
    this.AbortButton.disabled = true;
    //
    // Fermo il caricamento del file in corso
    this.FlashUploading.cancelUpload();
    //
    return;
  }
  //
  if (confirm(ClientMessages.DLG_DELAY_Abort))
  {
    // Disabilito il pulsante di abort
    this.AbortButton.disabled = true;
    //
    if (window.RD4_Enabled)
    {
      try
      {
        if (Shell.UseShellForSS())
          Shell.SendSSCmd("", "SetProgress", { aborted: true });
        else
        {
          var SSDBName = "SSManager";
          var db = openDatabase(SSDBName, "", SSDBName, 5*1024*1024);
          var SQL = "UPDATE Sessions SET Aborted = -1 WHERE SessionName = ''";
          try
          {
            db.transaction(function(tr) {tr.executeSql(SQL)});
          }
          catch (e)
          {
            throw e;
          }
          finally
          {
            if (db && db.close)
              db.close();
          }
        }
      }
      catch (e)
      {
        WriteToConsole("Error while aborting progress of main session", "error");
      }
    }
    else
    {
      var prfile = RD3_DesktopManager.WebEntryPoint.ProgressBarFile;
      var server = RD3_DesktopManager.WebEntryPoint.EntryPoint;
      //
      var flCSharp = (server.indexOf(".aspx")>0);
      if (flCSharp)
        server = "D_"+server;
      //
      this.XmlReq = RD3_DesktopManager.MessagePump.CreateRequest();
      this.XmlReq.open("GET", server + "?FN=" + prfile.substring(0, prfile.length-4) + "&NOCACHE=" + Math.floor(Math.random() * 1000000), true);
      this.XmlReq.send("");
    }
    //
    // Fermo un eventuale altra richiesta in coda
    if (this.ProgressTimer)
      window.clearTimeout(this.ProgressTimer);
  }
}

//**************************************************************************
// Attivo o meno la delay a doppio tocco
//**************************************************************************
PopupDelay.prototype.UseDoubleMode = function(ev)
{
  return (RD3_Glb.IsMobile() && RD3_ClientParams.DelayDlgShowTime>RD3_ClientParams.DelayDlgTime && this.DelayType==RD3_Glb.DELAY);
}

//************************************************************************************
// Click sul modal box in versione doppio tocco: devo far comparire la vera progress
//************************************************************************************
PopupDelay.prototype.OnModalMouseDown = function(ev)
{
  if (this.Hidden == false)
    return;
  //
  if (this.DelayShowTimer)
  {
    clearTimeout(this.DelayShowTimer);
    this.DelayShowTimer = null;
  }
  //
  window.setTimeout("document.getElementById('"+this.ModalBox.id+"').style.opacity = 1", 5);
  window.setTimeout("RD3_Glb.SetTransform(document.getElementById('"+this.PopupBox.id+"'), 'scale3d(1,1,1)');", 5);
  this.PopupBox.style.visibility = "visible";
  this.Hidden = false;
  //
  // Delay Dialog: se non e' attivo attivo il timer di aggiornamento
  if (!this.AnimationInterval)
    this.AnimationInterval = window.setInterval("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'AnimateProgress')", 10);
}
// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe MessageBox: implementa il funzionamento della
// MessageBox, della MessageConfirm e della InputBox
// Estende PopupFrame
// ************************************************

function MessageBox(text, type, snd, options)
{
  this.MessageText = text;  // Il testo del messaggio da mostrare
  this.Type = type;         // Il tipo di box (vedi GlobalObj)
  this.Send = true;         // True se la risposta deve andare al server, false se e' una confirm lato client
  if (snd != undefined)
    this.Send = snd;
  this.Options = "";        // Eventuali bottoni impostati dall'utente
  if (options != undefined && options != null)
    this.Options = options;
  //
  this.Identifier = "MSGBOX" + Math.floor(Math.random() * 100);  // Identificatore per gestire il click 
                                                                 // (ci puo' essere un solo Msgbox attivo per volta, basterebbe anche una stringa fissa per identificatore)
  //
  // Variabili interne della MessageBox
  this.CallBackFunction = null;       // Funzione Callback da chiamare alla pressione di uno dei tasti
  this.UserResponse = "";             // Risposta dell'utente (Y o N se MsgConfirm, Stringa se MsgInput)
  this.Blocking = false;              // Il messaggio inviato al server deve essere bloccante?
  //
  // Elementi visuali delle messageBox
  this.MsgTxt = null;                 // DIV contenente il messaggio
  this.ButtonBox = null;              // DIV contenente i pulsanti
  this.ConfirmButton = null;          // Pulsante di OK o di CONFIRM
  this.CancelButton = null;           // Pulsante di Cancel
  this.MsgInputDiv = null;            // DIV contenente l'input del messaggio
  this.MsgInput = null;               // Input del messaggio
  this.MsgIconDiv = null;             // DIV contenente l'icona
  this.MsgIcon = null;                // IMG dell'icona da associare al messaggio
  //this.OptionsButtons = new Array() // Array dei bottoni personalizzati
}

// Definisco l'estensione della classe
MessageBox.prototype = new PopupFrame();


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
MessageBox.prototype.Realize = function()
{
  var mob = RD3_Glb.IsMobile();
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
  PopupFrame.prototype.Realize.call(this, "-message-box");
  //
  // Imposto lo zIndex per fare in modo che i tooltip rimangano sotto
  this.PopupBox.style.zIndex = 300;
  //
  // Creo gli oggetti nel DOM uguali per tutti i tipi di Message Box
  // DIV per l'immagine e immagine stessa
  this.MsgIconDiv = document.createElement("div");
  this.MsgIconDiv.className = "popup-icon-div";
  this.MsgIcon = document.createElement("img");
  this.MsgIcon.className = "popup-icon";
  //
  // Testo del messaggio vero e proprio
  this.MsgTxt = document.createElement("span");
  this.MsgTxt.className = "popup-text";
  //
  if (this.MessageText.indexOf("cls=") == 0 && this.MessageText.indexOf(",") != -1)
  {
    // Il testo contiene una classe CSS, la uso
    var cls = this.MessageText.split(",")[0].substring(4);
    this.MsgTxt.innerHTML = this.MessageText.split(",")[1];
    RD3_Glb.AddClass(this.PopupBox, cls);
  }
  else
    this.MsgTxt.innerHTML = this.MessageText;
  //
  // Se c'e' un solo nodo di tipo TEXT allora e' testo puro. Cambio i \n in <br/>
  if (this.MsgTxt.childNodes.length==1 && !this.MsgTxt.childNodes[0].tagName)
    this.MsgTxt.innerHTML = this.MsgTxt.innerHTML.replace(/\n/g, "<br/>");
  //
  // DIV contenente l'eventuale input per l'InputBox
  this.MsgInputDiv = document.createElement("div");
  this.MsgInputDiv.style.height = "10px";
  //
  // DIV che contiene i bottone del message box
  this.ButtonBox = document.createElement("div");
  this.ButtonBox.className = "popup-button-div";
  //
  // Devo renderizzarmi in maniera differente in base al tipo, inserisco alcuni oggetti
  // diversi e modifico alcune proprieta' di oggetti esistenti
  //
  // Devo creare una message confirm con due pulsanti: Yes e Annulla
  if (this.Type == RD3_Glb.MSG_CONFIRM)
  {
    this.CaptionBox.innerHTML = ClientMessages.MSG_POPUP_MsgConfirmCaption;
    //
    if (!mob) this.MsgIcon.src = RD3_Glb.GetImgSrc("images/dlg_ask.gif");
    //
    if (this.Options == "")
    {
      // Creo i pulsanti per confermare o annullare
      this.ConfirmButton = document.createElement("button");
      this.ConfirmButton.innerHTML = ClientMessages.MSG_POPUP_YesButton;
      this.ConfirmButton.className = "popup-button popup-button-yes";
      this.ConfirmButton.id = this.Identifier + ":yes";
      //
      this.CancelButton = document.createElement("button");
      this.CancelButton.innerHTML = ClientMessages.MSG_POPUP_NoButton;
      this.CancelButton.className = "popup-button popup-button-no";
      this.CancelButton.id = this.Identifier + ":no";
      //
      RD3_Glb.AddClass(RD3_ClientParams.DefaultButton?this.ConfirmButton:this.CancelButton,"popup-button-default");
      //
      // Gestisco il click sui pulsanti
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
      {
        this.ConfirmButton.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOKClick', ev)");
        this.CancelButton.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCancelClick', ev)");
      }
      else
      {
        this.ConfirmButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOKClick', ev)");
        this.CancelButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCancelClick', ev)");
      }
      //
      // Inserisco gli elementi nel DOM
      this.ButtonBox.appendChild(this.ConfirmButton);
      this.ButtonBox.appendChild(this.CancelButton);
    }
    else
    {
      this.OptionsButtons = new Array();
      var opts = this.Options.split(";");
      //
      for (var i=0; i<opts.length; i++)
      {
        var optButton = document.createElement("button");
        optButton.innerHTML = opts[i];
        optButton.className = (RD3_ServerParams.Theme.startsWith("zen") ? "popup-button " : "") + "popup-button-opt";
        optButton.id = this.Identifier + ":opt" + i;
        if (RD3_Glb.IsMobile7())
          optButton.style.width = (100/opts.length) + "%";
        //
        if (i == 0)
          RD3_Glb.AddClass(optButton, "popup-button-default");
        //
        // Gestisco il click sui pulsanti
        if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
          optButton.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOptionClick', ev," + (i+1) + ")");
        else
          optButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOptionClick', ev," + (i+1) + ")");
        //
        // Inserisco gli elementi nel DOM
        this.ButtonBox.appendChild(optButton);
        this.OptionsButtons[i] = optButton;
      }
    }
  }
  else if (this.Type == RD3_Glb.MSG_INPUT) // Devo creare una Input Box con due pulsanti: CONFIRM e CANCEL e un input
  {
    this.CaptionBox.innerHTML = ClientMessages.MSG_POPUP_MsgInputCaption;
    //
    if (!mob) this.MsgIcon.src = RD3_Glb.GetImgSrc("images/dlg_ask.gif");
    //
    // Creo l'input
    this.MsgInput = document.createElement("input");
    this.MsgInput.type = "text";
    this.MsgInput.id = this.Identifier + ":inp";
    this.MsgInput.className = "popup-input";
    this.MsgInputDiv.className = "popup-input-div";
    RD3_Glb.AutocompleteOff(this.MsgInput);
    this.MsgInputDiv.appendChild(this.MsgInput);
    this.MsgInputDiv.style.height = "";
    //
    // Se c'e' un valore di default lo configuro e lo pre-seleziono
    if (this.Options)
    {
      this.MsgInput.value = this.Options;
      this.MsgInput.select();
    }
    //
    // Su iOS7 non si rimette a posto lo scroll quando la tastiera e' chiusa
    if (mob && (RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7)))
      this.MsgInput.onblur = new Function("ev","document.body.scrollTop = 0;");
    //
    // Creo i pulsanti  per confermare o annullare
    this.ConfirmButton = document.createElement("button");
    this.ConfirmButton.innerHTML = ClientMessages.MSG_POPUP_OkButton;
    this.ConfirmButton.className = "popup-button popup-button-yes";
    this.ConfirmButton.id = this.Identifier + ":yes";
    //
    this.CancelButton = document.createElement("button");
    this.CancelButton.innerHTML = ClientMessages.MSG_POPUP_CancelButton;
    this.CancelButton.className = "popup-button popup-button-no";
    this.CancelButton.id = this.Identifier + ":no";
    //
    RD3_Glb.AddClass(RD3_ClientParams.DefaultButton?this.ConfirmButton:this.CancelButton,"popup-button-default");
    //
    // Gestisco il click sui pulsanti
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
    {
      this.ConfirmButton.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOKClick', ev)");
      this.CancelButton.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCancelClick', ev)");
    }
    else
    {
      this.ConfirmButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOKClick', ev)");
      this.CancelButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCancelClick', ev)");
    }
    //
    // Inserisco gli elementi nel DOM
    this.ButtonBox.appendChild(this.ConfirmButton);
    this.ButtonBox.appendChild(this.CancelButton);
  }
  else // Devo creare una semplice MessageBox
  {
    this.CaptionBox.innerHTML = ClientMessages.MSG_POPUP_MsgBoxCaption;
    //
    if (!mob) this.MsgIcon.src = RD3_Glb.GetImgSrc("images/dlg_warn.gif");
    //
    // Creo il pulsante di chiusura message box
    this.ConfirmButton = document.createElement("button");
    this.ConfirmButton.innerHTML = "<span>" + ClientMessages.MSG_POPUP_OkButton + "</span>";
    this.ConfirmButton.className = "popup-button popup-button-yes";
    this.ConfirmButton.id = this.Identifier + ":yes";
    //
    // Gestisco il click sul pulsante
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
      this.ConfirmButton.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOKClick', ev)");
    else
      this.ConfirmButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnOKClick', ev)");
    //
    // Inserisco gli elementi nel DOM
    this.ButtonBox.appendChild(this.ConfirmButton);
  }
  //
  // Inserisco nel DOM tutta la gerarchia
  this.MsgIconDiv.appendChild(this.MsgIcon);
  this.ContentBox.appendChild(this.MsgIconDiv);
  this.ContentBox.appendChild(this.MsgTxt);
  this.ContentBox.appendChild(this.MsgInputDiv);
  this.ContentBox.appendChild(this.ButtonBox);
  //
  // Gestisco il KeyPress
  this.PopupBox.onkeydown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyPress', ev)");
  this.ModalBox.onkeydown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyPress', ev)");
  //
  // Solo IE permette di attaccare OnKeyDown su DIV
  // Gli altri solo su BODY, IMG, A, INPUT e TEXTAREA
  if (!RD3_Glb.IsIE(10, false))
  {
    var ku = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyPress', ev)");
    if (document.addEventListener)
      document.body.addEventListener("keypress", ku, true);
    else
      document.body.attachEvent("keypress", ku);
  }
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
MessageBox.prototype.Unrealize = function()
{
  // Chiamo la classe base
  PopupFrame.prototype.Unrealize.call(this);
  //
  // Rimuovo i riferimenti al DOM
  this.MsgTxt = null;
  this.ButtonBox = null;
  this.ConfirmButton = null;
  this.MsgInput = null;
  if (this.OptionsButtons)
    this.OptionsButtons = null;
  //
  // Avviso il VoiceObj che una messagebox e' stata chiusa
  RD3_DesktopManager.WebEntryPoint.VoiceObj.OnCloseMessageBox(this);
  //
  // Solo IE permette di attaccare OnKeyDown su DIV
  // Gli altri solo su BODY, IMG, A, INPUT e TEXTAREA
  if (!RD3_Glb.IsIE(10, false))
  {
    var ku = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyPress', ev)");
    if (document.addEventListener)
      document.body.removeEventListener("keyup", ku, true);
  }
}

// ***************************************************
// Dimensiono la Box in base al contenuto
// ***************************************************
MessageBox.prototype.AdaptLayout = function()
{
  var mob = RD3_Glb.IsMobile();
  //
  // Calcolo la dimensione minima e massima
  var minw = (this.Type == RD3_Glb.MSG_INPUT) ? RD3_ClientParams.PopupInputMinW : RD3_ClientParams.PopupDlgMinW;
  if (this.OptionsButtons && minw<300)
    minw = 300;
  if (mob)
  {
    if (this.Type == RD3_Glb.MSG_CONFIRM && minw<300)
      minw=300;
  }
  //
  //La larghezza massina e' meta' del WepBox, ma sui dispositivi touch e' pari all'80%
  var maxp = RD3_Glb.IsTouch()?0.8:0.5;
  var maxw = RD3_DesktopManager.WebEntryPoint.WepBox.clientWidth * maxp; 
  if (maxw<300)
    maxw=300;
  //
  var w; // larghezza totale del popup
  //
  // Per prima cosa uso tutto lo spazio a disposizione
  this.ContentBox.style.width = maxw + "px";
  //
  // Poi scelgo quale dimensione definitiva usare valutando la dimensione 
  // realmente occupata dal testo e i limiti appena calcolati
  var usedw = this.MsgTxt.offsetWidth + this.MsgIconDiv.offsetWidth;
  this.MsgTxt.style.left = this.MsgIconDiv.offsetWidth + "px";
  w = (usedw < minw) ? minw : usedw;
  w = (w > maxw) ? maxw : w;
  //
  // Dimensiono gli oggetti del DOM
  this.SetWidth(w);
  RD3_Glb.AdaptToParent(this.CaptionBox, 0, -1);
  RD3_Glb.AdaptToParent(this.ContentBox, 0, -1);
  this.ButtonBox.style.width = this.ContentBox.offsetWidth + "px";
  //
  // Posiziono sempre e comunque tutto
  this.MsgTxt.style.top =  "0px";
  this.MsgIconDiv.style.top = this.MsgTxt.offsetTop + "px";
  this.MsgInputDiv.style.top = (this.MsgTxt.offsetTop + this.MsgTxt.offsetHeight) + "px";
  this.MsgInputDiv.style.left = this.MsgTxt.offsetLeft + "px";
  this.MsgInputDiv.style.width = (this.ContentBox.offsetWidth - this.MsgTxt.offsetLeft - 20) + "px";
  //
  // Se sono un input dimensiono anche l'input vero e proprio
  if (this.MsgInput)
  {
    if (!mob) this.MsgIcon.src = RD3_Glb.GetImgSrc("images/dlg_input.gif");
    RD3_Glb.AdaptToParent(this.MsgInput, 0, -1);
  }
  //
  // Se ho delle opzioni faccio in modo che la loro larghezza minima sia 70 px
  if (this.OptionsButtons)
  {
    for (var optidx=0;optidx<this.OptionsButtons.length; optidx++)
      if (this.OptionsButtons[optidx].offsetWidth<70) this.OptionsButtons[optidx].style.width = "70px";
  }
  //
  // Posiziono i bottonie dimensiono verticalmente in popup
  this.ButtonBox.style.top = (this.MsgTxt.offsetTop + this.MsgTxt.offsetHeight + this.MsgInputDiv.offsetHeight + (this.Options==""? 0 : 15)) + "px";
  this.SetHeight(this.ButtonBox.offsetTop + this.ButtonBox.offsetHeight + this.CaptionBox.offsetHeight);
  //
  // Chiamo la classe base (La chiamo adesso perche' prima imposto le dimensioni cosi'
  // posso centrare correttamente la box)
  PopupFrame.prototype.AdaptLayout.call(this);
  //
  // Dopo aver aperto la form centrata, resetto il flag in modo da poter gestire
  // la videata a piacimento
  this.Centered = false;
  //
  // Do il focus al pulsante di default corretto
  switch(this.Type)
  {
    case RD3_Glb.MSG_BOX:
      this.ConfirmButton.focus();
    break;

    case RD3_Glb.MSG_CONFIRM:
      if (this.Options == "")
      {
        if (!RD3_ClientParams.DefaultButton)
          this.CancelButton.focus();
        else
          this.ConfirmButton.focus();
      }
      else
        this.OptionsButtons[0].focus();
    break;

    case RD3_Glb.MSG_INPUT:
      if (!RD3_Glb.IsMobile())
        this.MsgInput.focus();
    break;
  }
  //
  // Ho dato il il fuoco ai bottoni... non faccio altro
  RD3_KBManager.CheckFocus = false;
  RD3_KBManager.DontCheckFocus = true;
}


// ********************************************************
// Gestore del click sul pulsante Ok o di conferma
// ********************************************************
MessageBox.prototype.OnOKClick = function(evento)
{
  // Leggo il risultato
  var msg = "";
  if (this.Type == RD3_Glb.MSG_CONFIRM)
    msg = "Y";
  if (this.Type == RD3_Glb.MSG_INPUT)
    msg = this.MsgInput.value;
  //
  if (this.Type != RD3_Glb.MSG_BOX && this.Send)
  {
    // Devo mandare un messaggio al server prima di chiudermi 
    var ev = new IDEvent("msgcfr", this.Identifier, evento, (this.Blocking? RD3_Glb.EVENT_URGENT : RD3_Glb.EVENT_ACTIVE), this.MessageText, msg);
  }
  //
  // Gestione lato client
  if (this.CallBackFunction)
  {
    this.UserResponse = msg;
    this.CallBackFunction();
  }
  //
  // Chiudo la popup
  this.Close();
}


// ********************************************************
// Gestore del click sul pulsante Annulla o No
// ********************************************************
MessageBox.prototype.OnCancelClick = function(evento)
{
  var msg = "";
  if (this.Type == RD3_Glb.MSG_CONFIRM)
    msg = "N";
  //
  if (this.Type != RD3_Glb.MSG_BOX && this.Send)
  {
    // Devo mandare un messaggio al server prima di chiudermi
    var ev = new IDEvent("msgcfr", this.Identifier, evento, (this.Blocking? RD3_Glb.EVENT_URGENT : RD3_Glb.EVENT_ACTIVE), this.MessageText, msg);
  }
  //
  // Gestione lato client
  if (this.CallBackFunction)
  {
    this.UserResponse = msg;
    this.CallBackFunction();
  }
  //
  // Chiudo la popup
  this.Close();
}

// ********************************************************
// Gestore del click su di una opzione generica
// ********************************************************
MessageBox.prototype.OnOptionClick = function(evento, optIndex)
{
  if (this.Type == RD3_Glb.MSG_CONFIRM && this.Send)
  {
    // Devo mandare un messaggio al server prima di chiudermi
    var ev = new IDEvent("msgcfr", this.Identifier, evento, (this.Blocking? RD3_Glb.EVENT_URGENT : RD3_Glb.EVENT_ACTIVE), this.MessageText, optIndex);
  }
  //
  // Gestione lato client
  if (this.CallBackFunction)
  {
    this.UserResponse = optIndex;
    this.CallBackFunction();
  }
  //
  // Chiudo la popup
  this.Close();
}


// ********************************************************
// Gestore della pressione di un pulsante
// ********************************************************
MessageBox.prototype.OnKeyPress = function(evento)
{
  var code = (evento.charCode)?evento.charCode:evento.keyCode;
  var srcobj = (window.event)?evento.srcElement:evento.explicitOriginalTarget;
  //
  // se ho premuto Invio faccio scattare il pulsante di default
  // se ho premuto SPAZIO (e non sono su una INPUT box) e' come se avessi premuto Invio
  if (code == 13 || (code == 32 && this.Type != RD3_Glb.MSG_INPUT))
  {
    if (this.Type != RD3_Glb.MSG_BOX)
    {
      if (this.Options == "")
      {
        if (!RD3_ClientParams.DefaultButton)
          this.OnCancelClick(evento);
        else
        {
          var objfoc = RD3_KBManager.GetActiveElement();
          if (objfoc == this.CancelButton)
            this.OnCancelClick(evento);
          else
            this.OnOKClick(evento);
        }
      }
      else
      {
        for (var optidx=0; optidx<this.OptionsButtons.length; optidx++)
        {
          if (srcobj==this.OptionsButtons[optidx])
          {
            this.OnOptionClick(evento, optidx+1);
            break;
          } 
        }
      }
    }
    else
      this.OnOKClick(evento);
  }
  //
  // Se ho premuto esc faccio scattare il pulsante non di default
  if (code == 27)
  {
    if (this.Type != RD3_Glb.MSG_BOX)
    {
      if (this.Options == "")
      {
        if (!RD3_ClientParams.DefaultButton)
          this.OnOKClick(evento);
        else
          this.OnCancelClick(evento);
      }
      else
      {
        this.OnOptionClick(evento, this.OptionsButtons.length);
      }
    }
    else
      this.OnOKClick(evento);
  }
  //
  // Se e' TAB, switcho tra i vari pulsanti
  if (code == 9)
  {
    // Su firefox, anche se cancello l'evento KeyDown, mi viene comunque notificato il KeyPress
    if (RD3_Glb.IsFirefox() && evento.type == "keypress")
      return false;
    //
    var objToFocus = null;
    var objfoc = RD3_KBManager.GetActiveElement();
    var shiftKey = window.event ? window.event.shiftKey : evento.shiftKey;
    //
    if (this.Type == RD3_Glb.MSG_CONFIRM)
    {
      if (this.Options == "")
      {
        if (objfoc == this.CancelButton)
          objToFocus = this.ConfirmButton;
        else
          objToFocus = this.CancelButton;
      }
      else
      {
        for (var i=0; i<this.OptionsButtons.length; i++)
        {
          if (this.OptionsButtons[i] == objfoc)
          {
            if (i == this.OptionsButtons.length - 1 && !shiftKey)
              objToFocus = this.OptionsButtons[0];
            else if (i == 0 && shiftKey)
              objToFocus = this.OptionsButtons[this.OptionsButtons.length - 1]; 
            else
              objToFocus = this.OptionsButtons[(shiftKey ? i-1 : i+1)];
            break;
          }
        }
      }
    }
    else if (this.Type == RD3_Glb.MSG_INPUT)
    {
      if (objfoc == this.ConfirmButton)
      {
        if (shiftKey)
          objToFocus = this.MsgInput;
        else
          objToFocus = this.CancelButton;
      }
      else if (objfoc == this.CancelButton)
      {
        if (shiftKey)
          objToFocus = this.ConfirmButton;
        else
          objToFocus = this.MsgInput;
      }
      else if (objfoc == this.MsgInput)
      {
        if (shiftKey)
          objToFocus = this.CancelButton;
        else
          objToFocus = this.ConfirmButton;
      }
    }
    //
    // Se ho trovato qualcuno
    if (objToFocus)
    {
      objToFocus.focus();
      //
      // Hack per forzare l'aggiornamento visuale del bottone
      if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
      {
        // Se e' una messageConfirm la prima volta il fuoco non se ne va dal primo bottone...
        // L'unico modo che ho trovato e' cambiargli la larghezza togliendogli 1px... Dalla seconda volta in
        // poi ripristino la larghezza e non lo faccio piu'.
        if (!this.HackDone && this.Type == RD3_Glb.MSG_CONFIRM && objfoc == this.ConfirmButton)
        {
          this.HackDone = true;
          objfoc.style.width = (parseInt(objfoc.clientWidth) + 3) + "px";   // Ci sono 2px di bordo predefiniti nei bottoni
        }
        //
        // "Sposto" l'outline sul nuovo oggetto... non si vede ma Chrome ridisegna il bottone e si vede il fuoco
        objfoc.style.outline = "none";
        objToFocus.style.outline = "transparent solid 0px";
      }
    }
    //
    RD3_Glb.StopEvent(evento);
    return false;
  }
  //
  return true;
}


// ********************************************************************************
// Suona se deve e apre la popup
// ********************************************************************************
MessageBox.prototype.Open = function()
{ 
  // Chiamo la classe base
  PopupFrame.prototype.Open.call(this);
  //
  // Negli inputBox l'oggetto col fuoco e' l'input
  if (this.Type == RD3_Glb.MSG_INPUT)
    RD3_KBManager.ActiveElement = this.MsgInput;
  //
  // Suono
  switch(this.Type)
  {
    case RD3_Glb.MSG_BOX:
      RD3_DesktopManager.WebEntryPoint.SoundAction("info","play");
    break;

    case RD3_Glb.MSG_CONFIRM:
    case RD3_Glb.MSG_INPUT:
      RD3_DesktopManager.WebEntryPoint.SoundAction("warning","play");
    break;
  }
}


// ********************************************************************************
// Chiude la finestra
// ********************************************************************************
MessageBox.prototype.Close = function()
{ 
  // Metto il fuoco fuori dall'input, per sperare di chiudere la tastiera
  if(this.Type==RD3_Glb.MSG_INPUT)
  {
    this.MsgInput.blur();
    //
    // Non lo faccio per android se no il bottone si illumina
    // anche se in questo momento non deve
    if (!RD3_Glb.IsAndroid())
      this.ConfirmButton.focus();
  }
  //
  // Chiamo la classe base
  PopupFrame.prototype.Close.call(this);
}

// ********************************************************************************
// Arrivato comando vocale
// ********************************************************************************
MessageBox.prototype.OnVoiceCommand = function(text)
{
  if (this.Type == RD3_Glb.MSG_CONFIRM)
  {
    // Tolgo lo spazio in piu' all'inizio e rendo maiuscola la prima lettera
    var t = text.trim().charAt(0).toUpperCase() + text.trim().slice(1);
    //
    if (this.Options == "")
    {
      if (this.ConfirmButton && this.ConfirmButton.value == t)
        this.ConfirmButton.click();
      else if (this.CancelButton && this.CancelButton.value == t)
        this.CancelButton.click();
    }
    else
    {
      this.OptionsButtons = new Array();
      var opts = this.Options.split(";");
      //
      for (var i=0; i<opts.length; i++)
      {
        var optButton = document.createElement("input");
        if (optButton.value == t)
        {
          optButton.click();
          break;
        }
      }
    }
  }
  else if (this.Type == RD3_Glb.MSG_INPUT) // Devo creare una Input Box con due pulsanti: CONFIRM e CANCEL e un input
  {
    if (this.CancelButton && this.CancelButton.value == t)
      this.CancelButton.click();
    else
    {
      this.MsgInput.value = t;
      this.ConfirmButton.click();
    }
  }
  else // Devo creare una semplice MessageBox
  {
    // Non faccio nulla poiche' e' gia' stata gestita prima dal VoiceObj
    // (vedi Desktop::HandleMessageBox)
  }
}
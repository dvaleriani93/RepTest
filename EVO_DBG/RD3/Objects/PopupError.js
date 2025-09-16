// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PopupError: implementa il funzionamento della
// Videate che mostra gli errori avvenuti lato server
// Estende PopupFrame
// ************************************************

function PopupError(node)
{
	// Recupero i parametri dell'errore
	this.ErrorHeader = node.getAttribute("hdr");
	this.ErrorNumber = node.getAttribute("num");
	this.ErrorDescription = node.getAttribute("des");
	this.ErrorEffects = node.getAttribute("eff");
	this.ErrorActions = node.getAttribute("act");
	this.ErrorSource = node.getAttribute("src");
	this.ErrorException = node.getAttribute("exc") ? node.getAttribute("exc") : "";
	this.ErrorMessage = node.getAttribute("erm") ? node.getAttribute("erm") : "";
	this.Identifier = "PopupError" + Math.floor(Math.random() * 100);
	//
	// Oggetti DOM riguardanti l'errore
	this.HeaderDiv = null;          // Div che contiene l'icona e l'header
	this.ErrorIcon = null;          // Elemento IMG che contiene l'icona dell'errore
	this.CaptionTxt = null;         // Elemento SPAN che contiene il testo dell'header dell'errore
	//
	this.ErrorNumTitle = null;      // SPAN del titolo della riga del numero di errore
	this.ErrorNumTxt = null;        // SPAN del numero di errore
	//
	this.ErrorDescTitle = null;      // SPAN del titolo della riga di descrizione errore
	this.ErrorDescTxt = null;        // SPAN della descrizione dell'errore
	//
	this.ErrorEffTitle = null;      // SPAN del titolo della riga di effetti errore
	this.ErrorEffTxt = null;        // SPAN degli effetti dell'errore
	//
	this.ErrorActTitle = null;      // SPAN del titolo della riga di azioni
	this.ErrorActTxt = null;        // SPAN delle azioni
	//
	this.ErrorSrcTitle = null;      // SPAN del titolo della sorgente
	this.ErrorSrcTxt = null;        // SPAN della sorgente
	//
	this.ErrorButton = null;        // Pulsante di ritorno all'applicazione: DIV se tema classic, altrimenti IMG
	//
	this.ErrorMessageTitle = null;  // SPAN del titolo del messaggio di errore
	this.ErrorMessageTxt = null;    // SPAN dello messaggio di errore
	//
	this.ErrorStackTitle = null;    // SPAN del titolo dello stack
	this.ErrorStackTxt = null;      // SPAN dello Stack
}
//
// Definisco l'estensione della classe
PopupError.prototype = new PopupFrame();


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
PopupError.prototype.Realize = function()
{
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
	PopupFrame.prototype.Realize.call(this);
  //
  // Imposto lo zIndex per fare in modo che i tooltip rimangano sotto
  this.PopupBox.style.zIndex = 300;
	//
	// Assegno le classi corrette
	this.PopupBox.className = "popup-error-frame-container";
	this.CaptionBox.className = "popup-error-frame-caption";
	this.ContentBox.className = "popup-error-frame-content";
	//
	// Creo la caption
	this.CaptionBox.innerHTML = ClientMessages.MSG_POPUP_MsgErrorCaption;
	//
	// Creo l'icona dell'Errore
	this.ErrorIcon = document.createElement("img");
	this.ErrorIcon.src = RD3_Glb.GetImgSrc("images/errpg.gif");
	this.ErrorIcon.removeAttribute("width");
  this.ErrorIcon.removeAttribute("height");
	this.ErrorIcon.className = "popup-error-icon";
	//
	// Imposto l'header
	this.CaptionTxt = document.createElement("span");
	this.CaptionTxt.innerHTML = this.ErrorHeader;
	this.CaptionTxt.className = "popup-error-caption-text";
	//
	// Inserisco l'header nel DOM
	this.HeaderDiv = document.createElement("div");
	this.HeaderDiv.appendChild(this.ErrorIcon);
	this.HeaderDiv.appendChild(this.CaptionTxt);
	this.ContentBox.appendChild(this.HeaderDiv);
	//
	// Creo la linea del numero di errore
	this.ErrorNumTitle = document.createElement("span");
	this.ErrorNumTxt = document.createElement("div");
	//
	this.ErrorNumTitle.className = "popup-error-content-title";
	this.ErrorNumTxt.className = "popup-error-content-title";
	this.ErrorNumTitle.innerHTML = RD3_ServerParams.ErrorNum;
	this.ErrorNumTxt.innerHTML = this.ErrorNumber;
	//
	this.ContentBox.appendChild(this.ErrorNumTitle);
	this.ContentBox.appendChild(this.ErrorNumTxt);
	//
	// Creo la linea della descrizione
	if (this.ErrorDescription.length > 0)
	{
  	this.ErrorDescTitle = document.createElement("span");
  	this.ErrorDescTxt = document.createElement("div");
  	//
  	this.ErrorDescTitle.className = "popup-error-content-title";
  	this.ErrorDescTxt.className = "popup-error-content-txt";
  	this.ErrorDescTitle.innerHTML = "";
  	this.ErrorDescTxt.innerHTML = this.ErrorDescription;
  	//
  	this.ContentBox.appendChild(this.ErrorDescTitle);
  	this.ContentBox.appendChild(this.ErrorDescTxt);
  }
	//
	// Creo la linea degli effetti
	if (this.ErrorEffects.length > 0)
	{
  	this.ErrorEffTitle = document.createElement("span");
  	this.ErrorEffTxt = document.createElement("div");
  	//
  	this.ErrorEffTitle.className = "popup-error-content-title";
  	this.ErrorEffTxt.className = "popup-error-content-txt";
  	this.ErrorEffTitle.innerHTML = RD3_ServerParams.ErrorEffects;
  	this.ErrorEffTxt.innerHTML = this.ErrorEffects;
  	//
  	this.ContentBox.appendChild(this.ErrorEffTitle);
  	this.ContentBox.appendChild(this.ErrorEffTxt);
  }
	//
	// Creo la linea delle azioni
	if (this.ErrorActions.length > 0)
	{
  	this.ErrorActTitle = document.createElement("span");
  	this.ErrorActTxt = document.createElement("div");
  	//
  	this.ErrorActTitle.className = "popup-error-content-title";
  	this.ErrorActTxt.className = "popup-error-content-txt";
  	this.ErrorActTitle.innerHTML = RD3_ServerParams.ErrorAction;
  	this.ErrorActTxt.innerHTML = this.ErrorActions;
  	//
  	this.ContentBox.appendChild(this.ErrorActTitle);
  	this.ContentBox.appendChild(this.ErrorActTxt);
  }
	//
	// Creo la linea della sorgente
	if (this.ErrorSource.length > 0)
	{
  	this.ErrorSrcTitle = document.createElement("span");
  	this.ErrorSrcTxt = document.createElement("div");
  	//
  	this.ErrorSrcTitle.className = "popup-error-content-title";
  	this.ErrorSrcTxt.className = "popup-error-content-txt";
  	this.ErrorSrcTitle.innerHTML = RD3_ServerParams.ErrorSrc;
  	this.ErrorSrcTxt.innerHTML = this.ErrorSource;
  	//
  	this.ContentBox.appendChild(this.ErrorSrcTitle);
  	this.ContentBox.appendChild(this.ErrorSrcTxt);
  }
  // 
  // Creo il pulsante di ritorno all'applicazione
  if (RD3_ServerParams.Theme.startsWith("Classic"))
  {
    // Se e' classic il pulsante e' un DIV
    this.ErrorButton = document.createElement("div");
    this.ErrorButton.innerHTML = RD3_ServerParams.ErrorButton;
  }
  else
  {
    this.ErrorButton = document.createElement("div");
    if (!RD3_ServerParams.Theme.startsWith("zen"))
      this.ErrorButton.style.background = "url(" + RD3_Glb.GetImgSrc("images/errbk.gif") + ")";
    this.ErrorButton.innerHTML = RD3_ServerParams.ErrorButton;
  }
  this.ErrorButton.className = "popup-error-button";
  this.ErrorButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClickEB', ev)");
  this.ContentBox.appendChild(this.ErrorButton);
  //
  // Nel caso touch, tutta la popup e' cliccabile e si chiude subito
  if (RD3_Glb.IsTouch())
  	this.ContentBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClickEB', ev)");
  //
	// Creo la linea del messaggio di errore
	if (this.ErrorMessage.length > 0)
	{
  	this.ErrorMessageTitle = document.createElement("span");
  	this.ErrorMessageTxt = document.createElement("div");
  	//
  	this.ErrorMessageTitle.className = "popup-error-content-title";
  	this.ErrorMessageTxt.className = "popup-error-content-txt";
  	this.ErrorMessageTitle.innerHTML = "Error Details:";
  	this.ErrorMessageTxt.innerHTML = this.ErrorMessage;
  	//
  	this.ContentBox.appendChild(this.ErrorMessageTitle);
  	this.ContentBox.appendChild(this.ErrorMessageTxt);
  }
	//
	// Creo la linea dello stack trace
	if (this.ErrorException.length > 0)
	{
  	this.ErrorStackTitle = document.createElement("span");
  	this.ErrorStackTxt = document.createElement("div");
  	//
  	this.ErrorStackTitle.className = "popup-error-content-title";
  	this.ErrorStackTxt.className = "popup-error-content-txt";
  	this.ErrorStackTitle.innerHTML = "Stack Trace:";
  	this.ErrorStackTxt.innerHTML = this.ErrorException;
  	//
  	this.ContentBox.appendChild(this.ErrorStackTitle);
  	this.ContentBox.appendChild(this.ErrorStackTxt);
  }
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
    	document.body.addEventListener("keyup", ku, true);
    else
      document.body.attachEvent("onkeyup", ku);
  }
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PopupError.prototype.Unrealize = function()
{
  // Chiamo la classe base
	PopupFrame.prototype.Unrealize.call(this);	
	//
	// Rimuovo i riferimenti al DOM
	this.ErrorIcon = null;     
	this.CaptionTxt = null;      
	this.ErrorNumTitle = null;   
	this.ErrorNumTxt = null;   
	this.ErrorDescTitle = null;  
	this.ErrorDescTxt = null;    
	this.ErrorEffTitle = null;    
	this.ErrorEffTxt = null;      
	this.ErrorActTitle = null;     
	this.ErrorActTxt = null;     
	this.ErrorSrcTitle = null;    
	this.ErrorSrcTxt = null;    
	this.ErrorButton = null;   
	this.ErrorMessageTitle = null;  
	this.ErrorMessageTxt = null;
	this.ErrorStackTitle = null;
	this.ErrorStackTxt = null;
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
// Posiziona gli elementi del frame e lo dimensiona
// ***************************************************
PopupError.prototype.AdaptLayout = function()
{
  // Posiziono il contenitore
  var hcap = RD3_Glb.CalcBottom(this.CaptionBox) + 5;
  this.ContentBox.style.top = hcap + "px";
  //
  // Posiziono correttamente i div del contenuto
  var hpos = this.HeaderDiv.offsetHeight;
  //
  this.ErrorNumTitle.style.top = hpos + "px";
  this.ErrorNumTitle.style.left = "10px";
  this.ErrorNumTxt.style.top = hpos + "px";
  this.ErrorNumTxt.style.left = "100px";
  //
  hpos = Math.max(RD3_Glb.CalcBottom(this.ErrorNumTitle), RD3_Glb.CalcBottom(this.ErrorNumTxt)) + 20;
  //
  if (this.ErrorDescription.length > 0)
  {
    this.ErrorDescTitle.style.top = hpos + "px";
    this.ErrorDescTitle.style.left = "10px";
    this.ErrorDescTxt.style.top = hpos + "px";
    this.ErrorDescTxt.style.left = "100px";
    //
    hpos = Math.max(RD3_Glb.CalcBottom(this.ErrorDescTitle), RD3_Glb.CalcBottom(this.ErrorDescTxt)) + 20;
  }
  //
  if (this.ErrorEffects.length > 0)
  {
    this.ErrorEffTitle.style.top = hpos + "px";
    this.ErrorEffTitle.style.left = "10px";
    this.ErrorEffTxt.style.top = hpos + "px";
    this.ErrorEffTxt.style.left = "100px";
    //
    hpos = Math.max(RD3_Glb.CalcBottom(this.ErrorEffTitle), RD3_Glb.CalcBottom(this.ErrorEffTxt)) + 20;
  }
  //
  if (this.ErrorActions.length > 0)
  {
    this.ErrorActTitle.style.top = hpos + "px";
    this.ErrorActTitle.style.left = "10px";
    this.ErrorActTxt.style.top = hpos + "px";
    this.ErrorActTxt.style.left = "100px";
    //
    hpos = Math.max(RD3_Glb.CalcBottom(this.ErrorActTitle), RD3_Glb.CalcBottom(this.ErrorActTxt)) + 20;
  }
  //
  if (this.ErrorSource.length > 0)
  {
    this.ErrorSrcTitle.style.top = hpos + "px";
    this.ErrorSrcTitle.style.left = "10px";
    this.ErrorSrcTxt.style.top = hpos + "px";
    this.ErrorSrcTxt.style.left = "100px";
    //
    hpos = Math.max(RD3_Glb.CalcBottom(this.ErrorSrcTitle), RD3_Glb.CalcBottom(this.ErrorSrcTxt)) + 20;
  }
  //
  this.ErrorButton.style.top = hpos + "px";
  this.ErrorButton.style.left = "10px";
  hpos = RD3_Glb.CalcBottom(this.ErrorButton) + 40;
  //
  if (this.ErrorMessage.length > 0)
  {
    this.ErrorMessageTitle.style.top = hpos + "px";
    this.ErrorMessageTitle.style.left = "10px";
    this.ErrorMessageTxt.style.top = hpos + "px";
    this.ErrorMessageTxt.style.left = "100px";
    //
    hpos = Math.max(RD3_Glb.CalcBottom(this.ErrorMessageTitle), RD3_Glb.CalcBottom(this.ErrorMessageTxt)) + 20;
  }
  //
  if (this.ErrorException.length > 0)
  {
    this.ErrorStackTitle.style.top = hpos + "px";
    this.ErrorStackTitle.style.left = "10px";
    this.ErrorStackTxt.style.top = hpos + "px";
    this.ErrorStackTxt.style.left = "100px";
    //
    hpos = Math.max(RD3_Glb.CalcBottom(this.ErrorStackTitle), RD3_Glb.CalcBottom(this.ErrorStackTxt)) + 20;
  }
  //
  this.ContentBox.style.width = "550px";
  this.ContentBox.style.height = "370px";
  //
  this.SetWidth(600);
  this.SetHeight(400);
  this.SetLeft((document.body.offsetWidth - this.Width) / 2);
  this.SetTop((document.body.offsetHeight - this.Height) / 2);
  //
  // Chiamo la classe base
  PopupFrame.prototype.AdaptLayout.call(this);
  //
  // Dopo aver aperto la form centrata, resetto il flag in modo da poter gestire
  // la videata a piacimento
  this.Centered = false;
}


// ********************************************************
// Gestore del click sul pulsante torna all'applicazione
// ********************************************************
PopupError.prototype.OnClickEB = function(evento)
{
  // Chiudo la popup
  this.Close();
}


// ********************************************************
// Gestore della pressione di un pulsante
// ********************************************************
PopupError.prototype.OnKeyPress = function(evento)
{
  var code = (evento.charCode)?evento.charCode:evento.keyCode;
  //
  // se ho premuto invio,esc o spazio faccio chiudere il popup
  if (code == 13 || code == 32 || code == 27)
  {
    this.Close();
  }
  //
  return true;
}

// ********************************************************************************
// Suona se deve e apre la popup
// ********************************************************************************
PopupError.prototype.Open = function()
{ 
	// Chiamo la classe base
	PopupFrame.prototype.Open.call(this);
	//
	// Suono
	RD3_DesktopManager.WebEntryPoint.SoundAction("error","play");
}

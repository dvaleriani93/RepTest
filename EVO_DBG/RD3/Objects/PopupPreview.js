// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PopupPreview: Implementa una finestra modale
// da utilizzare per mostrare un'URL
// Estende PopupFrame
// ************************************************

function PopupPreview(address, capt, mime)
{
  this.PreviewUrl = address;       // L'URL da mostrare nel frame
  this.PreviewCaption = capt;   // Il testo della caption
  this.PreviewMime = mime;
  //
  this.Identifier = "POPPRE" + Math.floor(Math.random() * 100);  // Identificatore per gestire il click sul pulsante di chiusura 
                                                                 // (ci puo' essere un solo Msgbox attivo per volta, basterebbe anche una stringa fissa per identificatore)
  //
  // Altre variabili di questo oggetto di modello
  this.Loaded = false;            // L'iframe e' stato caricato?
  this.IE = false;                // Caching del tipo di browser
  //
  // Elementi visuali della PopupPreview
  this.CloseButton = null;        // IMG che contiene il pulsante di chiusura
  this.CaptionTxt = null;         // SPAN che contiene il testo della caption
  this.PreviewFrame = null;       // IFrame che contiene il documento esterno
}
// Definisco l'estensione della classe
PopupPreview.prototype = new PopupFrame();


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
PopupPreview.prototype.Realize = function(cls)
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
  this.Width = 300;
  this.Height = 170;
  //
	// Chiamo la classe base
	PopupFrame.prototype.Realize.call(this, cls);
	//
	// Aggiungo la classe nel caso di modifiche per iphone
	RD3_Glb.AddClass(this.CaptionBox, "popup-preview-caption");
	//
	// L'anteprima di un documento deve avere subito le dimensioni corrette...
	// allora la faccio apparire nascosta e la apro non appena arriva il file
	this.PopupBox.style.visibility = "hidden";
	//
	this.ContentBox.className = "popup-preview-content-frame";
	this.CaptionTxt = document.createElement("span");
	var txtelm = document.createTextNode(this.PreviewCaption);
	this.CaptionTxt.appendChild(txtelm);
	//
	this.PreviewFrame = document.createElement("iframe");
	this.PreviewFrame.src = this.PreviewUrl;
	this.PreviewFrame.className = "popup-preview-iframe";
	//
	this.IE = RD3_Glb.IsIE(10, false);
	if (this.IE)
	  this.PreviewFrame.onreadystatechange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
  else if (RD3_Glb.IsIE(10, true) && this.PreviewMime && this.PreviewMime == "application/pdf") 
  {
    // SU IE 10 il load per i PDF non scatta.. faccio subito l'adapt
    this.Loaded = true;
    var pthis = this;
    var f = function () { pthis.AdaptLayout(); };
    window.setTimeout(f, 0);
	  this.PopupBox.style.visibility = "";
  }
	else
	  this.PreviewFrame.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
	//
	this.CloseButton = document.createElement("img");
	this.CloseButton.className = "popup-preview-close";
	this.CloseButton.src = RD3_Glb.GetImgSrc("images/closef.gif");
	this.CloseButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCloseClick', ev)");
	//
	// Inserisco gli elementi nel DOM
	this.ContentBox.appendChild(this.PreviewFrame);
	if (!RD3_Glb.IsMobile() || cls != "-popover")
	  this.CaptionBox.appendChild(this.CloseButton);
	this.CaptionBox.appendChild(this.CaptionTxt);
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PopupPreview.prototype.Unrealize = function()
{
	// Chiamo la classe base
	PopupFrame.prototype.Unrealize.call(this);	
	//
	// Rimuovo i riferimenti al DOM
	this.CloseButton = null;
	this.CaptionTxt = null;
  this.PreviewFrame = null;
}

// ***************************************************
// Dimensiono la Box in base al contenuto
// ***************************************************
PopupPreview.prototype.AdaptLayout = function()
{
  if (this.Loaded)
  {
    // Leggo la dimensione verticale della caption
    var caph = this.CaptionBox.offsetHeight;
    //
    var maxw = RD3_DesktopManager.WebEntryPoint.WepBox.clientWidth;
    var maxh = RD3_DesktopManager.WebEntryPoint.WepBox.clientHeight;
    if (this.DebugPreview)
      maxw = Math.floor((maxw/10)*9);
    else
      maxw = Math.floor((maxw/3)*2);
    maxh = Math.floor((maxh/10)*9);
    //
    // tento di leggere le dimensioni del contenuto
    var w = -1;
    var h = -1;
    //
    try
    {
      // Il Plugin dei PDf non dice le dimensioni, andiamo al 90%
      if (!this.DebugPreview && !(this.PreviewMime && this.PreviewMime == "application/pdf"))
      {
      	w = this.PreviewFrame.contentWindow.document.body.scrollWidth+10;
      	h = this.PreviewFrame.contentWindow.document.body.scrollHeight+10;
      }
    }
    catch(ex)
    {
    }
    //
    // Se non le ho reperite oppure sono troppo grandi...
    if (w==-1 || w>maxw)
    	w = maxw;
    if (h==-1 || h>maxh)
    	h = maxh;
    //
    // Dimensiono il popup
    this.SetWidth(w);
    this.SetHeight(h+caph);
    //
    // Dimensiono tutto il resto di conseguenza
    RD3_Glb.AdaptToParent(this.ContentBox, 0, 0);
    RD3_Glb.AdaptToParent(this.CaptionBox, 0, -1);
    RD3_Glb.AdaptToParent(this.PreviewFrame, 0, caph);
    //
    // Ricentro correttamente il popup dato che sono cambiate le dimensioni
    this.Centered = true;
  }
  //
  PopupFrame.prototype.AdaptLayout.call(this);
	//
  // Dopo aver aperto la form centrata, resetto il flag in modo da poter gestire
  // la videata a piacimento
  this.Centered = false;
}


// ***************************************************
// Click sul pulsante di close
// ***************************************************
PopupPreview.prototype.OnCloseClick = function()
{
	// Chiudo la popup
	this.Close();
}


// *******************************************************
// Metodo che gestisce il cambio dello stato dell'IFrame
// *******************************************************
PopupPreview.prototype.OnReadyStateChange = function()
{
  var ok = true;
  if (this.IE && this.PreviewFrame.readyState != "complete")
  {
    ok = false;
    //
    // Se e' "INTERACTIVE" vuol dire che l'utente puo' gia' interagire con l'iframe
    // E' meglio farlo apparire dato che se scarico uno ZIP non ricevo piu'
    // l'evento OnReadytateChange con COMPLETE
    if (this.PreviewFrame.readyState == "interactive")
  	  this.PopupBox.style.visibility="";
  }
  //
	if (ok)
	{
	  this.Loaded = true;
	  this.AdaptLayout();  
	  this.PopupBox.style.visibility="";
	}
}

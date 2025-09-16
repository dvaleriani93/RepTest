// ****************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PPage: Rappresenta la pagina di un pannello
// ***************************************************
function PPage(ppanel)
{
  this.VisualStyle = -1;              // Visual Style della pagina: per ora non usato
  this.Flags = 0;                     // Flag della pagine
  this.Image = "";                    // Immagine della pagina
  this.Header = "";                   // Caption della pagina
  this.Tooltip = "";                  // Tooltip della pagina
  this.Style = 0;                     // Indice dello stile CSS della linguetta della pagina
  this.Index = 0;                     // Indice della pagina
  this.Badge = "";                    // Badge della Pagina
  //
  this.Identifier = "";               // Identificatore della pagina
  //
  // Altre variabili di modello...
  this.ParentPanel = ppanel;            // L'oggetto pannello cui il gruppo appartiene
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; 				        // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi al gruppo
  this.PageContainer = null;      // DIV contenitore dell'intera pagina
  this.LeftSpan = null;           // Span sinistro separatore delle varie pagine
  this.CaptionContainer = null;   // Span contenitore del resto della caption, per impostare il colore di sfondo
	this.LeftImage = null;          // Immagine sinistra della caption
	this.HeaderCont = null;         // Span contenitore del nome della Tab e dell'immagine
	this.PageImg = null;            // Immagine della caption
	this.CaptionTxt = null;         // Testo della caption
	this.RightSpan = null;          // Span destro separatore delle varie pagine
	this.RightImage = null;         // Immagine destra della Caption
	this.BadgeObj = null;           // Immagine del Badge
	//
	//this.TempImg = null;          // Elemento Img attualmente mostrato nella Page (IE10+)
	//this.ImgSrc = null;           // Immagine attualmente mostrata nella Page (IE10+)
}


// *******************************************************************
// Inizializza questo PField leggendo i dati da un nodo XML
// *******************************************************************
PPage.prototype.LoadFromXml = function(node) 
{
	// Inizializzo le proprieta' locali
	this.LoadProperties(node);
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
PPage.prototype.ChangeProperties = function(node)
{
	// Normale cambio di proprieta'
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
PPage.prototype.LoadProperties = function(node)
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
    switch(nome)
    {
    	case "sty": this.SetVisualStyle(parseInt(attrnode.nodeValue)); break;
      case "flg": this.SetFlags(parseInt(attrnode.nodeValue)); break;
    	case "img": this.SetImage(attrnode.nodeValue); break;
    	case "cap": this.SetHeader(attrnode.nodeValue); break;
    	case "tip": this.SetTooltip(attrnode.nodeValue); break;
    	case "pst": this.SetStyle(parseInt(attrnode.nodeValue)); break;
    	case "ind": this.SetIndex(parseInt(attrnode.nodeValue)); break;
    	case "bdg": this.SetBadge(attrnode.nodeValue); break;
    	
    	case "id": 
    		this.Identifier = valore;
    		RD3_DesktopManager.ObjectMap.add(valore, this);
    		
    	break;
    }
  }
}


// *******************************************************************
// Setter delle proprieta' 
// ******************************************************************* 
PPage.prototype.SetVisualStyle = function(value) 
{ 
  if (value != undefined) 
    this.VisualStyle = value; 
    // 
    // Per ora il visual style non viene usato... 
}

PPage.prototype.SetFlags = function(value)
{
	var old = this.Flags;
	//
  if (value != undefined)
    this.Flags = value;
  //
  if (this.Realized)
  {
		// Vediamo cosa e' cambiato
		// Controllo visibilita'
		var wasvis = old & 0x02; // OBJ_VISIBLE
		var isvis  = this.Flags & 0x02;
		//
		if (wasvis!=isvis || value==undefined)
			this.UpdateVisibility();
		//
		// Controllo abilitazione
		var wasena = old & 0x01; // OBJ_ENABLED
		var isena  = this.Flags & 0x01;
		//
		if (wasena!=isena || value==undefined)
			this.ParentPanel.UpdatePageEnability(this.Index);
  }
}

PPage.prototype.UpdateVisibility = function()
{
	// Aggiorno la visibilita' della pagina
  var s = this.IsVisible() ? "" : "none";
  //
  if (this.PageContainer && !RD3_Glb.IsMobile())
    this.PageContainer.style.display = s;
  else if (this.CaptionContainer)
    this.CaptionContainer.style.display = s;
  //
  if (this.ParentPanel.PanelPage == this.Index)
  	this.ParentPanel.SetPanelPage();
  //
  // In ogni caso spingo il ricalcolo del layout del pannello.
  this.ParentPanel.RecalcLayout = true;
}

PPage.prototype.SetImage = function(value)
{
  if (value != undefined)
    this.Image = value;
  //
  if (this.Realized)
  {
    if (RD3_Glb.IsMobile())
  	{
  		var img = this.Image;
  		//
  		if (!RD3_Glb.IsIE(10, true) && !RD3_Glb.IsEdge())
  		{
  		  // Se l'utente non mi ha dato l'immagine custom, allora ne metto una di default
  	  	if (img=="")
    		{
    			img = (this.ParentPanel.PanelPage == this.Index ? "tabsel.png" : "tabunsel.png");
          if (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro())
          {
    	  		this.PageImg.style.webkitMaskImage = "url("+RD3_Glb.GetAbsolutePath()+RD3_Glb.GetImgSrc("images/" + img)+")";
    	  		this.PageImg.style.webkitMaskSize = "25px 25px";
    	  		this.PageImg.style.width = "30px";
  	  		  this.PageImg.style.height = "30px";
    	  	}
    	  	else
   	  		  this.PageImg.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+RD3_Glb.GetImgSrc("images/" + img)+")";
  	  	}
  	  	else
  	  	{
  	  		this.PageImg.style.webkitMaskImage = "url("+RD3_Glb.GetAbsolutePath()+RD3_Glb.GetImgSrc("images/" + img)+")";
  	  		//
          if (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro())
          {
            // Se passo da una mia immagine a una immagine dell'utente devo annullare le dimensioni che ho fissato prima
       	    this.PageImg.style.width = "";
        	  this.PageImg.style.height = "";
            this.PageImg.style.webkitMaskSize = "";
            //
            // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
            if (RD3_Glb.Adapt4Retina(this.Identifier, img, 25))
           	  this.PageImg.style.webkitMaskSize = "0px 0px";
          }
  	  	}
  	  }
  	  else
  	  {
  	    // Per IE10 devo disegnare il Canvas.. purtroppo lo devo dipingere ogni volta da 0.. perche' il cambio della proprieta'
  	    // selected deve cambiare il colore e non ho modo di rimuovere un layer specifico ma solo l'intera immagine
  	    if (img=="")
    			img = (this.ParentPanel.PanelPage == this.Index ? "tabsel.png" : "tabunsel.png");
    	  //
    		if (this.ImgSrc != img)
    		{
    		  // e' cambiata l'immagine da disegnare: devo fare ricreare l'oggetto DOM da cui copiare
    		  this.TempImg = document.createElement("img");
    	    this.TempImg.src = RD3_Glb.GetImgSrc("images/" + img);
    	    if (!RD3_Glb.IsIE(10, false))
       	    this.TempImg.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
    	    else
     	      this.TempImg.onreadystatechange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
    	    //
    	    this.ImgSrc = img;
    	    return;
    		}
    	  //
    	  // Ora devo ridisegnare il Canvas, per prima cosa lo svuoto
        var ctx = this.PageImg.getContext("2d");
        ctx.globalCompositeOperation="source-over";
        ctx.clearRect(0, 0, RD3_ClientParams.ComboImageSize, RD3_ClientParams.ComboImageSize);
        //
        // Ora lo riempio con il colore che deve trasparire
        this.PageImg.style.backgroundColor = "";
        ctx.fillStyle = RD3_Glb.GetStyleProp(this.PageImg, "background-color");
        this.PageImg.style.backgroundColor = "transparent";
        ctx.fillRect(0, 0, RD3_ClientParams.ComboImageSize, RD3_ClientParams.ComboImageSize);
        //
        // Ed infine imposto l'operazione di mascheratura e disegno l'immagine
        ctx.globalCompositeOperation="destination-in";
        ctx.drawImage(this.TempImg, 0, 0, 30, 30);
  	  }
  	}
  	else
  	{
      if (this.Image != "")
      {
        this.PageImg.src = RD3_Glb.GetImgSrc("images/" + this.Image);
        this.PageImg.style.display = "";
      }
      else
        this.PageImg.style.display = "none";
    }
  }
}

PPage.prototype.SetHeader = function(value)
{
  if (value != undefined)
    this.Header = value;
  //
  if (this.Realized)
  {
    if (this.CaptionTxt)
    	this.CaptionTxt.nodeValue = this.Header
    else
    	this.HeaderCont.innerHTML = this.Header;
  }
}

PPage.prototype.SetTooltip = function(value)
{
  if (value != undefined)
    this.Tooltip = value;
  //
  if (this.Realized && !RD3_Glb.IsMobile())
    RD3_TooltipManager.SetObjTitle(this.PageContainer, this.Tooltip);
}

PPage.prototype.SetBadge = function(value)
{
  if (value != undefined)
    this.Badge = value;
  //
  if (this.Realized)
  {
    if (this.Badge == "")
    {
      if (this.BadgeObj != null && this.BadgeObj.parentNode)
        this.BadgeObj.parentNode.removeChild(this.BadgeObj);
      //
      this.BadgeObj = null;
    }
    else
    {
      if (this.BadgeObj == null)
      {
        var mob = RD3_Glb.IsMobile();
        //
        this.BadgeObj = document.createElement("DIV");
        this.BadgeObj.className = "badge-red" + (mob ? " badge-min" : "");
        this.BadgeObj.style.position = mob ? "absolute" : "static";
        //
        if (mob)
        {
          this.BadgeObj.style.top = "2px";
          this.BadgeObj.style.marginLeft = (66 - RD3_Glb.GetBadgeWidth(this.Badge, "red badge-min")) + "px";
          //
          if (RD3_Glb.IsChrome() || RD3_Glb.IsIpad(7) || RD3_Glb.IsIphone(7))
            this.BadgeObj.style.marginLeft = "12px";
          //
          this.CaptionContainer.appendChild(this.BadgeObj);
        }
        else
        {
          this.BadgeObj.style.marginLeft = "4px";
          //
          this.HeaderCont.appendChild(this.BadgeObj);
        }
      }
      //
      this.BadgeObj.innerHTML = this.Badge;
    }
  }
}

PPage.prototype.SetStyle = function(value)
{
  if (value != undefined)
    this.Style = value;
  //
  if (this.Realized)
  {
    this.HeaderCont.className = ((this.ParentPanel.PanelPage == this.Index) ? "selected-" : "") + "page-header-container-" + this.Style;
		this.PageImg.className = "page-icon-" + this.Style;
		//
		if (!RD3_Glb.IsMobile())
		{
  		this.LeftSpan.className = "page-left-separator-" + this.Style;
  		this.LeftImage.className = ((this.ParentPanel.PanelPage == this.Index) ? "selected-" : "") + "page-left-image-" + this.Style;
  		this.RightSpan.className = "page-right-separator-" + this.Style;
  		this.RightImage.className = "right-image-" + this.Style;
  	}
		//
		this.UpdateSelection();
  }
}

PPage.prototype.SetIndex = function(value)
{
  if (value != undefined)
    this.Index = value;
  //
  // L'indice non puo' cambiare dopo la realizzazione
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
PPage.prototype.Realize = function(parent)
{
  var mob = RD3_Glb.IsMobile();
  //
	// Creo gli oggetti del DOM
  this.CaptionContainer = document.createElement(mob?"div":"span");
  this.CaptionContainer.setAttribute("id", this.Identifier+":cap");
  this.HeaderCont = document.createElement(mob?"div":"span");
  //
  // Su IE>=10 devo usare il Canvas per i temi mobile
  if (mob && RD3_Glb.IsIE(10, true))
  {
    this.PageImg = document.createElement("canvas");
    //
    this.PageImg.width = RD3_ClientParams.ComboImageSize;
    this.PageImg.height = RD3_ClientParams.ComboImageSize;
  }
  else
  {
	  this.PageImg = document.createElement(mob?"div":"img");
	}
	//
  if (!mob)
  {
    this.PageContainer = document.createElement("span");
    this.LeftImage = document.createElement("img");  
    this.LeftSpan = document.createElement("span");
    this.CaptionTxt =document.createTextNode("");
    this.RightImage = document.createElement("img");
    this.RightSpan = document.createElement("span");
    //
    this.LeftImage.src = RD3_Glb.GetImgSrc("images/pgleft.gif");
  	this.LeftImage.removeAttribute("width");
  	this.LeftImage.removeAttribute("height");
  	this.RightImage.src = RD3_Glb.GetImgSrc("images/pgright.gif");
  	this.RightImage.removeAttribute("width");
  	this.RightImage.removeAttribute("height");
  }
	//
	var fn = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
	//
	if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
 	{
  		this.HeaderCont.ontouchstart = fn;
  		this.PageImg.ontouchstart = fn;
  }
  else
  {
  	if (mob)
  		this.CaptionContainer.onmousedown = fn;
  	else
  		this.CaptionContainer.onclick = fn;
 	}
	//
	// Inserisco gli elementi nel DOM
	if (!mob)
	{
  	this.HeaderCont.appendChild(this.PageImg);
  	this.HeaderCont.appendChild(this.CaptionTxt);
  	this.LeftSpan.appendChild(this.LeftImage);
  	this.CaptionContainer.appendChild(this.LeftSpan);
  	this.CaptionContainer.appendChild(this.HeaderCont);
  	this.RightSpan.appendChild(this.RightImage);
  	this.CaptionContainer.appendChild(this.RightSpan);
  	this.PageContainer.appendChild(this.CaptionContainer);
  	parent.appendChild(this.PageContainer);
  }
  else
  {
    // Caso Mobile, piu' semplice
    this.CaptionContainer.appendChild(this.PageImg);
    this.CaptionContainer.appendChild(this.HeaderCont);
    parent.appendChild(this.CaptionContainer);
  }
	//
	// Inizializzazione visuale
	this.Realized = true;
	//
	this.SetVisualStyle();
	this.SetFlags();
	this.SetImage();
	this.SetHeader();
	this.SetTooltip();
	this.SetBadge();
	//
	this.SetStyle(); // Questa chiamata aggiusta le classi e aggiorna la visualizzazione
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PPage.prototype.Unrealize = function()
{ 
	// Rimuovo la pagina dal DOM
	
	//
	// Mi tolgo dalla mappa degli oggetti
	RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Elimino i riferimenti al DOM
  
  //
  this.Realized = false; 
}


// ********************************************************************************
// Aggiorna gli stili della pagina a seconda se e' selezionata o meno
// ********************************************************************************
PPage.prototype.UpdateSelection = function()
{ 
	if (this.CaptionContainer)
	{
	  var mob = RD3_Glb.IsMobile();
	  //
	  var s = "";
	  //
		if (this.ParentPanel.PanelPage == this.Index)
		  s = "selected-";
		//
    this.CaptionContainer.className = s + "page-container-" + this.Style;
    this.HeaderCont.className = s + "page-header-container-" + this.Style;
    //
    if (!mob)
      this.LeftImage.className = s + "page-left-image-" + this.Style;
    //
    // In caso mobile aggiorno l'immagine
    if (mob)
    {
      this.PageImg.className = s + "page-icon-" + this.Style;
    	this.SetImage();
    }
	}
}


// ********************************************************************************
// Gestore evento di click su una pagina
// ********************************************************************************
PPage.prototype.OnClick= function(evento)
{ 
	if (this.ParentPanel.PanelPage != this.Index)
	{
		// Posso lanciare il click!
		var ev = new IDEvent("panpg", this.Identifier, evento, this.ParentPanel.PageClickEventDef, this.ParentPanel.Identifier);
		//
		if (ev.ClientSide)
    {
			// Durante la gestione locale del cambio di pagina possono avvenire molte cose,
    	// e' meglio che il server sia avvertito il piu' in fretta possibile
    	RD3_DesktopManager.SendEvents();
			//
			this.ParentPanel.SetPanelPage(this.Index, true);
		}
	}
}


// ********************************************************************************
// Restituisce true se questo pagina e' visibile
// ********************************************************************************
PPage.prototype.IsVisible = function()
{
	return (this.Flags & 0x2) != 0; // OBJ_VISIBLE
}


// ********************************************************************************
// Restituisce true se questo pagina e' visibile
// ********************************************************************************
PPage.prototype.IsEnabled = function()
{
	return (this.Flags & 0x1) != 0; // OBJ_ENABLED
}


// ********************************************************************************
// Gestore evento di mouse over su una pagina
// ********************************************************************************
PPage.prototype.OnMouseOverObj= function(evento, obj)
{ 
  if (this.CaptionContainer && (this.ParentPanel.PanelPage!=this.Index) && !RD3_Glb.IsMobile())
	{
    this.CaptionContainer.className = "page-container-hl-" + this.Style;
	}
}


// ********************************************************************************
// Gestore evento di mouse out su una pagina
// ********************************************************************************
PPage.prototype.OnMouseOutObj= function(evento, obj)
{ 
  if (this.CaptionContainer && (this.ParentPanel.PanelPage!=this.Index) && !RD3_Glb.IsMobile())
	{
    this.CaptionContainer.className = "page-container-" + this.Style; 
	}
}


// ********************************************************************************
// Gestore evento di mouse down su una pagina
// ********************************************************************************
PPage.prototype.OnMouseDownObj= function(evento, obj)
{ 
  
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
PPage.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "")
    return false;
  //
  tip.SetObj(this.PageContainer);
  obj = this.PageContainer;
  //
  tip.SetTitle(this.Header);
  tip.SetText(this.Tooltip);
  tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + (obj.offsetWidth/2), RD3_Glb.GetScreenTop(obj));
  tip.SetPosition(0);
  return true;
}

// *******************************************************
// Metodo che gestisce il cambio dello stato dell'immagine
// *******************************************************
PPage.prototype.OnReadyStateChange = function()
{
  if (RD3_Glb.IsIE(10, false))
  {
    if (this.TempImg.readyState == "complete")
      this.SetImage();
  }
  else
    this.SetImage();
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
PPage.prototype.OnAdaptRetina = function(w, h, par)
{
	if (this.PageImg)
	{
	  this.PageImg.width = w+5;
 	  this.PageImg.height = h+5;
		this.PageImg.style.webkitMaskSize = w+"px "+h+"px";
	}
}

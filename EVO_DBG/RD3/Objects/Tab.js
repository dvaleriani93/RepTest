// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Tab: Rappresenta una tab di una TabbedView
// ************************************************

function Tab(pview)
{
  // Proprieta' di questo oggetto di modello
  this.Image = "";          // Immagine della entry nella lista delle tab
  this.Header = "";         // Caption della entry nella lista delle tab
  this.Tooltip = "";        // Tooltip della entry nella lista delle tab
  this.Style = 0;           // Stile della tab
  this.Badge = "";          // Badge della Tab
  this.TabView = pview;     // Tabview padre
  this.Content = null;      // WebFrame contenuto in questa Tab: inizialmente viene inviato dal server un identificatore,
                            // poi nella realize viene caricato l'oggetto corretto
  //
  // Variabili di questo oggetto
  this.Selected = false;        // Se la tab e' selezionata o meno
  this.Visible = true;          // Se la tab e' visibile o meno (la visibilita' di una tab e' definita dalla visibilita' del suo contenuto)
  this.RecalcLayout = false;    // Se e' necessario rieseguire l'adapt del layout
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;    // Se vero, gli oggetti del DOM sono gia' stati creati  
  //
  // Oggetti DOM di questa Tab
  this.CaptionBox = null;         // Contenitore della caption della pagina
  this.LeftSpan = null;           // Span contenitore dell'immagine sinistra
  this.LeftImage = null;          // Immagine sinistra della caption
  this.HeaderCont = null;         // Span contenitore del nome della Tab e dell'immagine
  this.TabImg = null;             // Immagine della caption
  this.HeaderTxt = null;          // Testo della caption
  this.RightImage = null;         // Immagine destra della Caption
  this.BadgeObj = null;
  this.RefreshExposed = false;    // Devo inviare il messaggio di esposizione al contenuto?
  //
  this.ContentBox = null;         // Div in cui verra' renderizzato il contenuto  
  //
  // Altre Variabili necessarie per gestire questo oggetto
  this.AlreadySelected = false;   // False se questa Tab non e' mai stata selezionata
  //
	//this.TempImg = null;          // Elemento Img attualmente mostrat0 nella Tab (IE10+)
	//this.ImgSrc = null;           // Immagine attualmente mostrata nella Tab (IE10+)
}


// *******************************************************************
// Inizializza questo oggetto leggendo i dati da un nodo XML
// *******************************************************************
Tab.prototype.LoadFromXml = function(node) 
{
  this.LoadProperties(node);
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
Tab.prototype.ChangeProperties = function(node)
{
  // Proseguo con il cambio di proprieta'
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
Tab.prototype.LoadProperties = function(node)
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
      case "img": this.SetImage(attrnode.nodeValue); break;
      case "cap": this.SetHeader(attrnode.nodeValue); break;
      case "tip": this.SetTooltip(attrnode.nodeValue); break;
      case "sty": this.SetStyle(parseInt(attrnode.nodeValue)); break;
      case "con": this.SetContent(attrnode.nodeValue); break;
      case "dcl": this.DeletePage(attrnode.nodeValue); break;
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
Tab.prototype.SetImage= function(value) 
{
  if (value!=undefined)
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
        if (img == "$")
        {
          // Se l'utente non vuole un'immagine, la nascondo
          this.TabImg.style.display = "none";
          //
          // Faccio il pulsante grande, altrimenti non e' facile cliccarlo
					this.HeaderCont.style.marginTop = "33px";
        }
        else if (img=="")
    		{
    			img = this.Selected?"tabsel.png":"tabunsel.png";
          if (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro())
          {
	  	  		this.TabImg.style.webkitMaskImage = "url("+RD3_Glb.GetAbsolutePath()+RD3_Glb.GetImgSrc("images/" + img)+")";
  	  		  this.TabImg.style.webkitMaskSize = "25px 25px";
  	  		  this.TabImg.style.width = "30px";
  	  		  this.TabImg.style.height = "30px";
    			}
    			else
  	  		  this.TabImg.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+RD3_Glb.GetImgSrc("images/" + img)+")";
  	  	}
  	  	else
  	  	{
  	  		this.TabImg.style.webkitMaskImage = "url("+RD3_Glb.GetAbsolutePath()+RD3_Glb.GetImgSrc("images/" + img)+")";
          //          
          if (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro())
          {
            // Se passo da una mia immagine a una immagine dell'utente devo annullare le dimensioni che ho fissato prima
            this.TabImg.style.width = "";
            this.TabImg.style.height = "";
            this.TabImg.style.webkitMaskSize = "";
            //
            // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
            if (RD3_Glb.Adapt4Retina(this.Identifier, img, 25))
         	    this.TabImg.style.webkitMaskSize = "0px 0px";
          }
  	  	}
  	  }
  	  else
  	  {
  	    // Per IE10 devo disegnare il Canvas.. purtroppo lo devo dipingere ogni volta da 0.. perche' il cambio della proprieta'
  	    // selected deve cambiare il colore e non ho modo di rimuovere un layer specifico ma solo l'intera immagine
  	    if (img=="")
    			img = this.Selected?"tabsel.png":"tabunsel.png";
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
        var ctx = this.TabImg.getContext("2d");
        ctx.globalCompositeOperation="source-over";
        ctx.clearRect(0, 0, RD3_ClientParams.ComboImageSize, RD3_ClientParams.ComboImageSize);
        //
        // Ora lo riempio con il colore che deve trasparire
        this.TabImg.style.backgroundColor = "";
        ctx.fillStyle = RD3_Glb.GetStyleProp(this.TabImg, "background-color");
        this.TabImg.style.backgroundColor = "transparent";
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
	      // Mostro l'immagine corretta
	      this.TabImg.src = RD3_Glb.GetImgSrc("images/" + this.Image);
	      //
	      // Quando arriva l'immagine devo rimettere a posto il filler.. (Da IE10 in poi non lo lanciano piu'..)
	      if (!RD3_Glb.IsIE(10, false))
          this.TabImg.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
        else
          this.TabImg.onreadystatechange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
	      //
	      this.TabImg.style.display = "";
	    }
	    else
	      this.TabImg.style.display = "none";
	  }
    //
    this.TabView.RecalcLayout = true;
  }
}

Tab.prototype.SetHeader= function(value) 
{
  if (value!=undefined)
    this.Header = value;
  //
  if (this.Realized)
  {
  	if (this.HeaderTxt)
    	this.HeaderTxt.innerHTML = this.Header;
    else
    	this.HeaderCont.innerHTML = this.Header;
    //
    this.TabView.RecalcLayout = true;
  }
}

Tab.prototype.SetTooltip= function(value) 
{
  if (value!=undefined)
    this.Tooltip = value;
  //
  if (this.Realized)
    RD3_TooltipManager.SetObjTitle(this.CaptionBox, this.Tooltip);
}

Tab.prototype.SetBadge= function(value) 
{
  if (value!=undefined)
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
          if (!RD3_Glb.IsIE())
            this.BadgeObj.style.marginLeft = "12px";
          //
          this.CaptionBox.appendChild(this.BadgeObj);
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

Tab.prototype.SetStyle= function(value) 
{
  if (value!=undefined)
    this.Style = value;
  //
  if (this.Realized)
  {
    // Imposto le classi corrette dei vari oggetti dom
    this.SelectPage(this.Selected);
    //
    this.RecalcLayout = true;
  }
}

Tab.prototype.SetContent= function(value) 
{
  // Questa proprieta' non puo' cambiare a Run time
  this.Content = value;
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// contbox : oggetto in cui realizzare il contenuto della tab
// captcont : oggetto in cui realizzare la caption della tab
// ***************************************************************
Tab.prototype.Realize = function(contbox, captcont, blockMessage)
{
	var mob = RD3_Glb.IsMobile();
	//
  // Per prima cosa carico il contenuto corretto
  if (!this.Content.Identifier)
    this.Content = RD3_DesktopManager.ObjectMap[this.Content];
  //
  // Informo il contenuto che io sono suo padre
  this.Content.ParentTab = this;
  this.Content.ParentFrame = this.TabView;
  //
  // Creo gli oggetti Dom relativi alla caption
  this.CaptionBox = document.createElement(mob?"div":"span");
  this.CaptionBox.id = this.Identifier+":cap";
  this.HeaderCont = document.createElement(mob?"div":"span");
  //
  // Su IE>=10 devo usare il Canvas per i temi mobile
  if (mob && RD3_Glb.IsIE(10, true))
  {
    this.TabImg = document.createElement("canvas");
    //
    // Il canvas ha bisogno degli attributi width ed height.. altrimenti i browser lo disegnano male..
    this.TabImg.width = RD3_ClientParams.ComboImageSize;
    this.TabImg.height = RD3_ClientParams.ComboImageSize;
  }
  else
  {
    this.TabImg = document.createElement(mob?"div":"img");
  }
  //
  if (!mob)
  {
    if (!RD3_ServerParams.Theme.startsWith("zen"))
    {
  	  this.LeftImage = document.createElement("img");
	    this.LeftSpan  = document.createElement("span");
  	  this.RightImage = document.createElement("img");
    }
	  this.HeaderTxt = document.createElement("span");
	}
	//
	var suf = "";
	switch (this.TabView.Placement)
	{
	  case RD3_Glb.TABOR_BOTTOM : suf = RD3_Glb.IsMobile() ? "" : "tabbottom-"; break;
	  case RD3_Glb.TABOR_LEFT : suf = "tableft-"; break;
	  case RD3_Glb.TABOR_RIGHT : suf = RD3_Glb.IsMobile() ? "tabright-" : ""; break;
	}
  //
  // Assegno le classi agli oggetti della caption
  this.CaptionBox.className = "tab-caption-container-" + suf + this.Style;
  this.HeaderCont.className = "tab-caption-" + suf + this.Style;
  this.TabImg.className = "tab-img-" + this.Style;  
  //
  // Assegno gli eventi agli oggetti della caption
  var fn = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
 	{
		this.CaptionBox.ontouchstart = fn;
		this.TabImg.ontouchstart = fn;
  }
  else
  {
  	if (mob)
  		this.CaptionBox.onmousedown = fn;
  	else
  		this.CaptionBox.onclick = fn;
 	}
  //
  // Creo il contenitore del contenuto
  this.ContentBox = document.createElement("div");
  this.ContentBox.className = "tab-contentbox-" + this.Style;
  this.ContentBox.id = this.Identifier;
  //
  // Assegno la classe al contenitore del frame e le immagini corrette alla tab
  if (!mob)
  {
    if (!RD3_ServerParams.Theme.startsWith("zen"))
    {
	    this.LeftImage.src = RD3_Glb.GetImgSrc("images/pgleft.gif");
	    this.LeftImage.removeAttribute("width");
	    this.LeftImage.removeAttribute("height");
	    this.RightImage.src = RD3_Glb.GetImgSrc("images/pgright.gif");
	    this.RightImage.removeAttribute("width");
	    this.RightImage.removeAttribute("height");
	    this.LeftSpan.className = "tab-left"  + suf + "-0";
	    this.RightImage.className="tab-right"  + suf + "-0";
	    if (RD3_Glb.IsTouch())
		  {
		    this.LeftImage.setAttribute("height","32px");
		    this.RightImage.setAttribute("height","32px");
		  }
    }
	  //
	  // Aggiungo gli oggetti visuali al DOM
	  if (this.TabView.Placement == RD3_Glb.TABOR_LEFT)
	  {
	    this.HeaderCont.appendChild(this.HeaderTxt);
	    this.HeaderCont.appendChild(this.TabImg);
	  }
	  else
	  {
	    this.HeaderCont.appendChild(this.TabImg);
	    this.HeaderCont.appendChild(this.HeaderTxt);
	  }
	  //
    if (!RD3_ServerParams.Theme.startsWith("zen"))
    {
  	  this.LeftSpan.appendChild(this.LeftImage);
	    this.CaptionBox.appendChild(this.LeftSpan);
    }
	  this.CaptionBox.appendChild(this.HeaderCont);
    if (!RD3_ServerParams.Theme.startsWith("zen"))
	    this.CaptionBox.appendChild(this.RightImage);
	}
	else
	{
		// Caso Mobile, piu' semplice
		this.CaptionBox.appendChild(this.TabImg);
		this.CaptionBox.appendChild(this.HeaderCont);
	}
  //
  captcont.appendChild(this.CaptionBox);
  contbox.appendChild(this.ContentBox);
  //
  // Inizializzo questo oggetto
  this.Realized = true;
  this.SetImage();
  this.SetHeader();
  this.SetTooltip();
  this.SetStyle();
  this.SetBadge();
  //
  // Se ho un contenuto valido e questo non e' stato realizzato imposto da qua la mia visibilita'
  if (this.Content && !this.Content.Realized && !blockMessage)
  {
    this.SetVisible(this.Content.Visible);
  }
}


// *****************************************************************
// Rimuove gli oggetti dom e i riferimenti di questo oggetto perche'
// sta per essere distrutto
// *****************************************************************
Tab.prototype.Unrealize = function (blockMessage) 
{
  // Passo il messaggio al mio contenuto
  if (!blockMessage) 
  {
    if (this.Content.Unrealize)
      this.Content.Unrealize();
    else if (RD3_DesktopManager.ObjectMap[this.Content])
      RD3_DesktopManager.ObjectMap[this.Content].Unrealize();
  }
  //
  // Rimuovo i riferimenti dal DOM
  if (this.CaptionBox) 
  {
    this.CaptionBox.parentNode.removeChild(this.CaptionBox);
    this.ContentBox.parentNode.removeChild(this.ContentBox);
  }
  //
  // Mi rimuovo dalla mappa degli oggetti
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Annullo i riferimenti
  this.CaptionBox = null;
  this.LeftSpan = null;
  this.LeftImage = null;
  this.HeaderCont = null;
  this.TabImg = null;
  this.HeaderTxt = null;
  this.RightImage = null;
  this.ContentBox = null;
  this.BadgeObj = null;
  //
  this.Realized = false;
}


// ***************************************************************
// Gestisce il dimensionamento di questo oggetto
// ***************************************************************
Tab.prototype.AdaptLayout = function()
{
  // Chiamo l'AdaptLayout del mio contenuto
  if (this.Content.Realized)
  {
    // Ridimensiono il contenuto del tab per occupare tutto lo spazio disponibile
    RD3_Glb.AdaptToParent(this.ContentBox);
    //
    // Adatto solo quella visibile, in questo modo risparmio tempo
    // FORCED = true per le tab di ScreenZone su IE
    if (this.Selected)
      this.Content.AdaptLayout((RD3_Glb.IsMobile() && this.TabView && this.TabView.ZoneTabView && RD3_Glb.IsIE()));
    //
    // Se devo inviare il messaggio di cambio esposizione al contenitore, lo faccio ora
		if (this.RefreshExposed)
			this.RefreshExposition();
    //
    // Certifico che ho adattato il contenuto
    this.RecalcLayout = false;
  }
}


// ***************************************************************
// Metodo che rende questa pagina selezionata o meno
// ***************************************************************
Tab.prototype.SelectPage = function(sel)
{
	var mob = RD3_Glb.IsMobile();
  this.Selected = sel;
  //
  var suf = "";
	switch (this.TabView.Placement)
	{
	  case RD3_Glb.TABOR_BOTTOM : 
	    suf = RD3_Glb.IsMobile() ? "" : "tabbottom-";
	  break;
	  
	  case RD3_Glb.TABOR_LEFT : 
	    suf = "tableft-"; 
	  break;
	  
	  case RD3_Glb.TABOR_RIGHT : 
	    suf = RD3_Glb.IsMobile() ? "tabright-" : ""; 
	  break;
	}
  //
  // Se la pagina e' selezionata devo mostrare il contenuto e impostare le classi corrette
  var pop = (this.TabView.ToolbarBox.className.indexOf("popover")>-1)?"popover-":"";
  if (this.Selected)
  {
    // Mi memorizzo che questa Tab e' stata gia' selezionata una volta: da adesso in poi 
    // si puo' fare la gestione del click lato client
    this.AlreadySelected = true;
    //
    // Imposto le classi corrette
    this.CaptionBox.className = "selected-tab-caption-container-"+ pop + suf + this.Style;
    this.HeaderCont.className = "selected-tab-caption-" + suf + this.Style;
    this.TabImg.className = "selected-tab-img-" + this.Style + ((mob && RD3_Glb.IsIE() && RD3_Glb.IsSmartPhone()) ? "-ie" : "");
    if (!mob)
    {
	    this.HeaderTxt.className = "selected-tab-text-" + suf + this.Style;
      if (!RD3_ServerParams.Theme.startsWith("zen"))
      {
	      this.LeftSpan.className = "selected-tab-left-" + suf + this.Style;
	      this.LeftImage.className = "selected-tab-left-img-" + suf + this.Style;
	      this.RightImage.className="selected-tab-right-" + suf + this.Style;
      }
	  }
  }
  else
  {
    // Nascondo il contenuto
    this.ContentBox.style.display = "none";
    //
    // Imposto le classi corrette
    this.CaptionBox.className = "tab-caption-container-" + pop + suf + this.Style;
    this.HeaderCont.className = "tab-caption-" + suf + this.Style;
    this.TabImg.className = "tab-img-" + this.Style;
    if (!mob)
    {
	    this.HeaderTxt.className = "tab-text-" + suf + this.Style;
      if (!RD3_ServerParams.Theme.startsWith("zen"))
      {
	      this.LeftSpan.className = "tab-left-" + suf + this.Style;
	      this.LeftImage.className = "tab-left-img-" + suf + this.Style;
	      this.RightImage.className="tab-right-" + suf + this.Style;
      }
	  }
  }
  //
  // In caso mobile aggiorno la caption ed il resto
  if (mob)
  {
  	if (this.Content.Realized)
  		this.RefreshExposition();
  	else
  		this.RefreshExposed = true;
  }
}

// ***************************************************************
// Metodo che rende la entry di questa tab visibile o meno: 
// non dipende direttamente da questo oggetto ma viene chiamata dalla
// set visible del suo contenuto
// ***************************************************************
Tab.prototype.SetVisible = function(value)
{
  this.Visible = value;
  //
  if (this.Realized)
  {
    if (this.Visible)
    {
      // Rendo visibile la caption
      this.CaptionBox.style.display = "";
      //
      // Se e' selezionata rendo visibile il suo contenuto
      if (this.Selected)
        this.ContentBox.style.display = "";
    }
    else
    {
      // Nascondo la caption
      this.CaptionBox.style.display = "none";
      //
      // Nascondo il contenuto
      this.ContentBox.style.display = "none";
    }
    //
    this.TabView.RecalcLayout = true;
  }
}

// ********************************************************************************
// Gestore evento di mouse over su una Tab
// ********************************************************************************
Tab.prototype.OnMouseOverObj= function(evento, obj)
{ 
  if (!this.Selected && !RD3_Glb.IsMobile())
  {
    var suf = "";
  	if (this.TabView.Placement == RD3_Glb.TABOR_LEFT)
  	  suf = " tab-caption-hl-tableft-0";
    //
    this.HeaderCont.className = "tab-caption-hl-" + this.Style + suf;
  }
}


// ********************************************************************************
// Gestore evento di mouse out su una Tab
// ********************************************************************************
Tab.prototype.OnMouseOutObj= function(evento, obj)
{ 
  if (!this.Selected && !RD3_Glb.IsMobile())
  {
    var suf = "";
  	switch (this.TabView.Placement)
  	{
  	  case RD3_Glb.TABOR_BOTTOM : 
  	    suf = RD3_Glb.IsMobile() ? "" : "tabbottom-";
  	  break;
  	  
  	  case RD3_Glb.TABOR_LEFT : 
  	    suf = "tableft-";
  	  break;
  	}
    //
    this.HeaderCont.className = "tab-caption-" + suf + this.Style;
  }
}


// ********************************************************************************
// Gestore evento di mouse down su una Tab
// ********************************************************************************
Tab.prototype.OnMouseDownObj= function(evento, obj)
{ 
  
}


// ********************************************************************************
// Gestore evento di click su una Tab
// ********************************************************************************
Tab.prototype.OnClick= function(evento)
{ 
  if (!this.Selected && this.Visible && !RD3_GFXManager.Blocking())
  {
    // Posso lanciare il click!
    //
    var ev = new IDEvent("tab", this.Identifier, evento, this.TabView.ClickEventDef, this.TabView.Identifier);
    if (ev.ClientSide && this.AlreadySelected)
    {
      // Durante la gestione locale del cambio di pagina possono avvenire molte cose,
      // e' meglio che il server sia avvertito il piu' in fretta possibile
      RD3_DesktopManager.SendEvents();
      //
      this.TabView.SetSelectedPage(this.TabView.FindTabIndex(this));
    }
  }
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
Tab.prototype.AfterProcessResponse= function()
{ 
  if (this.RecalcLayout)
    this.AdaptLayout();
  //
  // Certifico che ho effettuato il recalc
  this.RecalcLayout = false;
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
Tab.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "")
    return false;
  //
  tip.SetObj(this.CaptionBox);
  obj = this.CaptionBox;
  //
  tip.SetTitle(this.Header);
  tip.SetText(this.Tooltip);
  tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + (obj.offsetWidth/2), RD3_Glb.GetScreenTop(obj));
  tip.SetPosition(0);
  //
  return true;
}

// *********************************************************
// Elimina una pagina
// *********************************************************
Tab.prototype.DeletePage = function(value, blockMessage)
{
  // Mi cerco nell'array di mio padre
  var n = this.TabView.Tabs.length;
  for (var i=0; i<n; i++)
  {
    if (this.TabView.Tabs[i] == this)
    {
      // Prima elimino il mio Content
      if (this.Content && this.Content.DeleteFrame && !blockMessage)
        this.Content.DeleteFrame();
      //
      // Poi proseguo con me stesso
      this.TabView.Tabs.splice(i, 1);
      //
      this.Unrealize(blockMessage);
      this.TabView.SetPlacement();
      //
      // Se, per caso, e' arrivato un comando di cambio pagina e la pagina che sto distruggendo
      // era coinvolta nell'animazione, riprogammo il cambio pagina!
      var lastGFX = RD3_GFXManager.ActiveEffects[RD3_GFXManager.ActiveEffects.length-1];
      if (lastGFX && lastGFX.Classe == "tab" && lastGFX.ObjOut == this)
      {
        // Sostituisco l'animazione con qualcosa di meglio
        RD3_GFXManager.ActiveEffects.splice(RD3_GFXManager.ActiveEffects.length-1, 1);
        //
        this.TabView.SetSelectedPage();
      }
      break;
    }
  }
}

// **********************************************************************
// Deve tornare vero se l'oggetto e' draggabile
// **********************************************************************
Tab.prototype.IsDraggable = function(id)
{
  // La draggabilita' di una pagina dipende dalla tabbedview
  return this.TabView.CanDrag;
}

// **********************************************************************
// Restituisce l'oggetto Dom a cui associare un Popup Menu
// **********************************************************************
Tab.prototype.GetDOMObj = function()
{
  return this.CaptionBox;
}

// *****************************************************************************
// Restituisce l'oggetto visuale su cui deve venire applicata l'HL per il drag
// *****************************************************************************
Tab.prototype.DropElement = function()
{
  return this.CaptionBox;
}

// ********************************************************************************
// Compone la lista di drop della box
// ********************************************************************************
Tab.prototype.ComputeDropList = function(list, dragobj)
{
  if (!this.Realized)
    return;
  //
  // Questa pagina vuole essere droppata da dragobj?
  // Si da per scontato che la TabbedView abbia DragDrop attivo (lo controlla lei)
  if (this!=dragobj)
  {
    list.push(this);
    //
    // Calcolo le coordinate assolute...
    this.AbsLeft = RD3_Glb.GetScreenLeft(this.CaptionBox,true);
    this.AbsTop = RD3_Glb.GetScreenTop(this.CaptionBox,true);
    if (!RD3_Glb.IsIE())
    {
      // Sugli altri browser devo tenere conto della scrollbar...
      this.AbsLeft -= this.TabView.ContentBox.scrollLeft;
      this.AbsTop -= this.TabView.ContentBox.scrollTop;
    }
    //
    this.AbsRight = this.AbsLeft + this.CaptionBox.offsetWidth - 1;
    this.AbsBottom = this.AbsTop + this.CaptionBox.offsetHeight - 1;
  }
}

// *********************************************************
// Aggiorna lo stato di esposizione del contenuto
// *********************************************************
Tab.prototype.RefreshExposition = function()
{
	this.RefreshExposed = false;
	this.SetImage();
  //
  // Se sono una form normale, prendo i back button e li gestisco
  var wf = this.TabView.WebForm;
  if (wf.Modal==0 && !wf.Docked && this.Selected)
	{
	 // Mi prendo il menu' button e lo metto nella prima caption disponibile
	 if (wf.HasBackButton() && wf.BackButtonTxt && wf.BackButtonTxt.length>0)
	 	wf.CaptureToolbarButton(wf.BackButtonCnt);
	 wf.CaptureToolbarButton(RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton);		 
	}
	//
  // Chiamo la gestione specifica
  if (this.Content && this.Content.ChangeExpose)
    this.Content.ChangeExpose(this.Selected);		
}

// *******************************************************
// Metodo che gestisce il cambio dello stato dell'immagine
// *******************************************************
Tab.prototype.OnReadyStateChange = function()
{
  // Su mobile devo spingere l'aggiornamento dell'immagine
  if (RD3_Glb.IsMobile())
  {
    if (!this.TempImg.readyState || this.TempImg.readyState == "complete")
      this.SetImage();
  }
  else 
  {
    // Su desktop il filler va ricalcolato quando arriva l'immagine
    if (!RD3_Glb.IsIE(10, false) || this.TabImg.readyState == "complete")
      this.TabView.AdaptLayout();
  }
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
Tab.prototype.OnAdaptRetina = function(w, h, par)
{
	if (this.TabImg)
	{
	  this.TabImg.width = w+5;
 	  this.TabImg.height = h+5;
		this.TabImg.style.webkitMaskSize = w+"px "+h+"px";
	}
}
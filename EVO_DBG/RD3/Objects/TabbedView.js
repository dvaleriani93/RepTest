// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe TabbedView: gestisce una serie di frame
// in modalita' Tabbed
// ************************************************

function TabbedView(pform)
{
  // Chiamo il costruttore superiore
  WebFrame.call(this,pform); 
  //
	// Proprieta' di questo oggetto di modello
  this.SelectedPage = 0;         // Indice della pagina selezionata
  this.Placement = 0;           // Posizione delle linguette (Non modificabile a RunTime)
  this.HiddenTabs = false;      // Mostrare le linguette? (Toolbar)
  this.AutoSize = false;        // Dimensionare la tab come pagina mostrata attualmente
  this.Tabs = new Array();      // Array delle Pagine interne
  this.OnlyTabs = false;        // Se True la TabbedView si dimensionera' in modo da mostrare solo le Tab
	//
  // Struttura per la definizione degli eventi di questa tabbed
  this.ClickEventDef = RD3_Glb.EVENT_ACTIVE; // Click su una tab  
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
	//
	// Oggetti DOM di questa TabView
	this.TabFiller = null;        // Riempitore, creato dopo l'ultima tab di 
	                              // lunghezza pari alla toolbarbox - la lunghezza delle tab, serve per
	                              // creare la striscia della tab completa
}
//
// Definisco l'estensione della classe
TabbedView.prototype = new WebFrame();


// *******************************************************************
// Inizializza questo oggetto leggendo i dati da un nodo XML
// *******************************************************************
TabbedView.prototype.LoadFromXml = function(node) 
{
	// Chiamo la classe base
	WebFrame.prototype.LoadFromXml.call(this,node);
	//
	// Carico le tab
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
			case "tab":
			{
				// Leggo il nodo di primo livello, e poi passo il messaggio
				// di caricamento
				var newtab = new Tab(this);
				newtab.LoadFromXml(objnode);
				this.Tabs.push(newtab);
				//
				// Se sono gia' stata realizzata, realizzo subito la pagina
				if (this.Realized)
				{
          newtab.Realize(this.ContentBox, this.ToolbarBox);
          this.SetPlacement();
          //
          // Se dovevo selezionare questa tab, lo faccio ora che e' arrivata
          if (this.DelayedSelPage < this.Tabs.length)
          {
            this.SetSelectedPage();
            this.DelayedSelPage = undefined;
          }
        }
			}
			break;
		}
	}
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
TabbedView.prototype.ChangeProperties = function(node)
{
	// Semplicemente setto le proprieta' a partire dal nodo + verifico oggetti figli, come nuove pagine
  this.LoadFromXml(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
TabbedView.prototype.LoadProperties = function(node)
{
  // Chiamo la classe base
	WebFrame.prototype.LoadProperties.call(this,node);
	//
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
    	case "sel": this.SetSelectedPage(parseInt(attrnode.nodeValue) - 1); break;
    	case "pla": this.SetPlacement(parseInt(attrnode.nodeValue)); break;
    	case "hid": this.SetHiddenTabs(attrnode.nodeValue == "1"); break;
    	case "asz": this.SetAutoSize(attrnode.nodeValue == "1"); break;

    	case "clk": this.ClickEventDef = parseInt(attrnode.nodeValue); break;

    	case "cpa": this.ChangePageAnimDef = valore; break;

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
TabbedView.prototype.SetSelectedPage= function(value, skipAnim) 
{
  if (skipAnim == undefined)
    skipAnim = false;
  //
	var old = this.SelectedPage;
	if (value!=undefined)
		this.SelectedPage = value; // Nel server l'array inizia da 1
	//
	if (this.Realized && (old!=this.SelectedPage || value==undefined))
	{ 
	  // Se il server ha richiesto una pagina che non c'e'... forse deve ancora arrivare
	  // Mi ricordo che quando arriva devo selezionare la pagina!
	  if (this.SelectedPage >= this.Tabs.length)
	  {
	    this.DelayedSelPage = this.SelectedPage;
	    return;
	  }
	  //
		// Trovo la Tab attualmente selezionata
		var sel = null;
		var n = this.Tabs.length;
		var pos = 0;
    for (var i=0; i<n; i++)
    {
      if(this.Tabs[i].Selected)
      {
        sel = this.Tabs[i];
        pos = i;
      }
      else
      {
        // Nascondo tutte le tab non selezionate
        if (i != this.SelectedPage)
          this.Tabs[i].SelectPage(false);
      }
    }
    //
    // Il server e' 1-based, noi siamo 0-based. Se il server dice "pagina 0" intende "nessuna pagina" e a noi arriva value=-1
    if (this.SelectedPage != -1)
    {
	    // Applico l'animazione: la salto se non ho un value oppure se non ho una pagina attualmente selezionata
		  var fx = new GFX("tab", pos>=this.SelectedPage, this.Tabs[this.SelectedPage], (value==undefined)||(!sel) || (sel == this.Tabs[this.SelectedPage])||skipAnim , sel, this.ChangePageAnimDef);
	    RD3_GFXManager.AddEffect(fx);
	  }
	  else if (sel)
	  {
	    // Se necessario deseleziono la pagina selezionata
	    sel.SelectPage(false);
	  }
	}
}

TabbedView.prototype.SetPlacement= function(value) 
{
	if (value!=undefined)
		this.Placement = value;
	//
	if (this.Realized)
	{
		if (this.Placement == RD3_Glb.TABOR_RIGHT)
		{
		  if (!RD3_Glb.IsMobile())
		  {
			  this.ToolbarBox.style.position = "absolute";
			  this.ContentBox.style.position = "absolute";
			}
			//
			this.ToolbarBox.className = "toolstrip-container-right";
			//
		  // Devo spostare il filler dall'inizio alla fine (solo se e' gia' stato aggiunto al DOM)
		  if (this.TabFiller.parentNode)
		    this.ToolbarBox.removeChild(this.TabFiller);
		  this.ToolbarBox.appendChild(this.TabFiller);
	  }
	  if (this.Placement == RD3_Glb.TABOR_LEFT)
		{
		  if (!RD3_Glb.IsMobile())
		  {
			  this.ToolbarBox.style.position = "absolute";
			  this.ContentBox.style.position = "absolute";
			}
			//
			this.TabFiller.className = "tab-filler-tabbottom";
			this.ToolbarBox.className = "toolstrip-container-left";
			//
		  // Devo spostare il filler dall'inizio alla fine (solo se e' gia' stato aggiunto al DOM)
		  if (this.TabFiller.parentNode)
		    this.ToolbarBox.removeChild(this.TabFiller);
		  this.ToolbarBox.appendChild(this.TabFiller);
	  }
	  //	  
		if (this.Placement == RD3_Glb.TABOR_BOTTOM)
		{
			// Scambio di posto il content e la toolbar box
			var p = this.ToolbarBox.parentNode;
			p.removeChild(this.ToolbarBox);
			p.appendChild(this.ToolbarBox);
			//
			if (!RD3_Glb.IsMobile())
			{
			  this.TabFiller.className = "tab-filler-tabbottom";
			  this.ToolbarBox.style.position = "absolute";
			}
			//
		  // Devo spostare il filler dall'inizio alla fine (solo se e' gia' stato aggiunto al DOM)
		  if (this.TabFiller.parentNode)
		    this.ToolbarBox.removeChild(this.TabFiller);
		  this.ToolbarBox.appendChild(this.TabFiller);
		}
		//
		if (this.Placement == RD3_Glb.TABOR_TOP)
		{
		  // Allineo gli elementi a sinistra
		  this.ToolbarBox.style.textAlign = "";
		  //
		  // Devo spostare il filler dall'inizio alla fine (solo se e' gia' stato aggiunto al DOM)
		  if (this.TabFiller.parentNode)
		    this.ToolbarBox.removeChild(this.TabFiller);
		  this.ToolbarBox.appendChild(this.TabFiller);
	  }
	}
}

TabbedView.prototype.SetHiddenTabs= function(value) 
{
	if (value!=undefined)
		this.HiddenTabs = value;
	//
	if (this.Realized)
	{
	  if (this.HiddenTabs)
	  {
		  this.ToolbarBox.style.display = "none";
		  //
		  // Se nascondo le linguette tolgo il margine sopra, in modo che non ci siano scalini con frame a destra o sinistra..
		  this.ContentBox.style.marginTop = "0px";
		}
		else
		{
		  this.ToolbarBox.style.display = "";
		  this.ContentBox.style.marginTop = RD3_ClientParams.StandardPadding + "px";
		}
	}
}

TabbedView.prototype.SetAutoSize= function(value) 
{
	if (value!=undefined)
		this.AutoSize = value;
	//
	if (this.Realized)
	{
		// TODO
	}
}

TabbedView.prototype.SetOnlyTabs= function(value) 
{
  if (value!=undefined)
		this.OnlyTabs = value;
  //
  if (this.Realized)
	{
		this.ContentBox.style.display = this.OnlyTabs ? "none" : "";
	}
}

// *******************************************************************
// Setter delle proprieta' ridefinite (ridefiniscono i metodi base,
// che darebbero errore in caso di tabbed perche' non esistono
// gli oggetti)
// *******************************************************************

TabbedView.prototype.SetCollapsible= function(value) 
{
  // Proprieta' non gestita in una Tabbed
	if (value!=undefined)
		this.Collapsible = value;
}

TabbedView.prototype.SetCollapsed= function(value) 
{
  // Proprieta' non gestita in una Tabbed
	if (value!=undefined)
		this.Collapsed = value;
}

TabbedView.prototype.SetImage= function(value) 
{
  // Proprieta' non gestita in una Tabbed
  if (value!=undefined)
		this.Image = value;
}

TabbedView.prototype.SetCaption= function(value) 
{
  // Proprieta' non gestita in una Tabbed
  if (value!=undefined)
		this.Caption = value;
}

TabbedView.prototype.SetSmallIcon= function(value) 
{
  // Proprieta' non gestita in una Tabbed
  if (value!=undefined)
		this.SmallIcons = value;
}

TabbedView.prototype.SetWidth= function(value)
{
  // Chiamo il metodo base
  WebFrame.prototype.SetWidth.call(this,value);
}

TabbedView.prototype.SetHeight= function(value)
{
  // Chiamo il metodo base
  WebFrame.prototype.SetHeight.call(this,value);
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
TabbedView.prototype.Realize = function(parent)
{
	// Chiamo la classe base
	if (!this.Realized)
		WebFrame.prototype.Realize.call(this,parent);
  //
  if (this.ZoneTabView)
    this.ContentBox.className = this.ContentBox.className + " zone-tab-view";
	//
	// Il margine non lo devo dare a questo frame, lo avranno comunque quelli interni
	// Lascio il margine superiore perche' voglio che la tab strip abbia uno spazio sotto
	this.ContentBox.style.marginLeft = "0px";
	this.ContentBox.style.marginRight = "0px";
	this.ContentBox.style.marginBottom = "0px";
	//
	// E' il contenuto che prende le scrollbar, se deve
	this.ContentBox.style.overflowX = "hidden";
	this.ContentBox.style.overflowY = "hidden";
  //
  // Faccio realizzare i miei figli nella pagina contenitore
  var n = this.Tabs.length;
  for (var i=0; i<n; i++)
  {
    this.Tabs[i].Realize(this.ContentBox, this.ToolbarBox);
  }
  //
  // Creo il riempitore e gli assegno la classe
  this.TabFiller = document.createElement("span");
  this.TabFiller.className = "tab-filler";
  //
  // Aggiungo il filler al DOM
  //this.ToolbarBox.appendChild(this.TabFiller);
  //
  // Inizializzazione iniziale
  this.Realized = true;
  this.SetSelectedPage();
  this.SetPlacement();
  this.SetHiddenTabs();
  this.SetAutoSize();
}


// *****************************************************************
// Rimuove gli oggetti dom e i riferimenti di questo oggetto perche'
// sta per essere distrutto
// *****************************************************************
TabbedView.prototype.Unrealize = function()
{
	// Chiamo la classe base
	WebFrame.prototype.Unrealize.call(this);
	//
	// Passo il messaggio anche alle Tab che cosi' possono gestire i subframes
	var n = this.Tabs.length;
	for (var i=0; i<n; i++)
	{
		this.Tabs[i].Unrealize();
	}	
}


// ***************************************************************
// Gestisce il dimensionamento di questo oggetto
// ***************************************************************
TabbedView.prototype.AdaptLayout = function()
{
  var n = this.Tabs.length;    // Numero di tab
	//	
	if (this.SendResize)
	{
		// Imposto il resize anche delle tabbed contenute
		for (var i=0; i<n; i++)
  	{
  		var t = this.Tabs[i];
  		if (t.Realized && t.Content)
  		{
  			t.Content.SendResize = true;
  			t.Content.DeltaW += this.DeltaW;
  			t.Content.DeltaH += this.DeltaH;
  		}
	  }
	  //
	  this.DeltaW = 0;
	  this.DeltaH = 0;
	}
	//
	// Azzero la larghezza del filler perche' la riduzione dello spazio disponibile
	// potrebbe far andare a capo "temporaneamente" la toolbar, rubando troppo spazio
	// al contenuto della tabbed.
	this.TabFiller.style.width = "0px";
	//	
	// Chiamo la classe base
  WebFrame.prototype.AdaptLayout.call(this);
  //
  var thinpage = false;         // True se le linguette devono essere piccole per cercare di stare su una sola riga
  var availablew = 0;           // Spazio disponibile
  var usedw;                    // Spazio attualmente occupato
  //
  // Dimensiono il contenitore delle linguette perche' usi tutto lo spazio orizzontale di cui puo' disporre
  // Mostro il contenitore delle linguette, potrebbe essere stato nascosto ma devo mostrarlo perche' se non non da' i valori di dimensione giusti
  this.ToolbarBox.style.display = "";
  //
	if (this.Placement == RD3_Glb.TABOR_LEFT)
	{
	  // La Toolbar deve essere ruotata in verticale, quindi deve essere dimensionata con la H e non con la W
	  // su dektop usiamo la rotazione, su mobile no
	  this.ToolbarBox.style.width = "";
	  RD3_Glb.AdaptToParent(this.ToolbarBox, -1, 0);
	  if (!RD3_Glb.IsMobile())
	  {
  	  this.ToolbarBox.style.width = this.ToolbarBox.style.height;
  	  this.ToolbarBox.style.height = "";
  	}
	}
	//
	if (this.Placement == RD3_Glb.TABOR_RIGHT)
	{
	  // La Toolbar deve essere ruotata in verticale, quindi deve essere dimensionata con la H e non con la W
	  // su dektop usiamo la rotazione, su mobile no
	  this.ToolbarBox.style.width = "";
	  RD3_Glb.AdaptToParent(this.ToolbarBox, -1, 0);
	  if (!RD3_Glb.IsMobile())
	  {
  	  this.ToolbarBox.style.width = this.ToolbarBox.style.height;
  	  this.ToolbarBox.style.height = "";
  	}
	}
	//
	availablew = this.ToolbarBox.clientWidth;
  //
  // Adatto tutte le linguette
  var vistabs = 0;
  usedw = 0;
  for (var i=0; i<n; i++)
  {
    // La variabile thinpage mi dice quale dimensione minima usare come larghezza della linguetta
    var w = ((thinpage) ? RD3_ClientParams.TabWidthThin : RD3_ClientParams.TabWidth);
    //
    // Se il tab e' visibile allora dimensiono la sua linguetta
    var t = this.Tabs[i];
    if (t.Content.Visible)
    {
      vistabs++;
      //
      // Se devo usare la dimensione piu' piccola riazzero la larghezza di CaptionBox impostata da questo stesso ciclo
      t.HeaderCont.style.width = "";
      //
      // Se devo imposto la dimensione minima alla linguetta
      if (!RD3_Glb.IsMobile())
     	{
	      if (t.HeaderCont.offsetWidth <= w && t.HeaderCont.offsetWidth > 0)
	        t.HeaderCont.style.width = w + "px";
	    }
      //
      // Calcolo lo spazio occupato fin'ora
      usedw += t.CaptionBox.offsetWidth;
      //
      // Se ho sforato quella a disposizione per le linguette
      if (usedw > availablew)
      {
        // Se non ho ancora usando la dimensione piccola per le linguette, faccio in modo 
        // che il ciclo riparta con alcune variabili modificate
        if (!thinpage)
        {
          // Resetto l'indice del ciclo per ripassare da tutte le linguette
          // e imposto thinpage per utilizzare la dimensione minima piu' piccola,
          // e azzero anche la dimensione utilizzata
          i = -1;
          thinpage = true;
          usedw = 0;
          continue;
        }
        else  // Ho appena cambiato riga, quindi lo spazio occupato e' solo quello di questa linguetta
        {
          usedw = t.CaptionBox.offsetWidth;
          continue;
        }
      }
    }
	  //
	  // Ridimensiono il filler dell'ultima riga tenendo anche conto di eventuali errori di dimensionamento
	  var w = (availablew - usedw);
	  if (w<0) w=0;
	  this.TabFiller.style.width = w + "px";
	  var fillerw = ((this.TabFiller.scrollWidth>this.TabFiller.offsetWidth && RD3_Glb.IsIE()) ? this.TabFiller.scrollWidth : this.TabFiller.offsetWidth);
	  if (fillerw > (availablew - usedw))
	  {
	    w = ((availablew - usedw) - (fillerw - (availablew - usedw)));
	    if (w<0) w=0;
	      this.TabFiller.style.width = w + "px";	
	  }
	  //
	  // Firefox, a volte sbaglia... nonostante sia tutto preciso al pixel puo' mandare a capo il filler per 1px
	  if (RD3_Glb.IsFirefox() && this.TabFiller.offsetLeft==0)
	    this.TabFiller.style.width = (parseInt(this.TabFiller.style.width)-1) + "px";	
	}
	//
  // Nascondo o mostro il contenitore delle linguette se ce ne sono di visibili
  // (vistabs potrebbe essere superiore al numero di tab se sono stati fatti piu' giri di adattamento, ma a me interessa che sia maggiore di 0..)
  this.ToolbarBox.style.display = (vistabs>0 && !this.HiddenTabs) ? "" : "none";
	//
	// La toolbar potrebbe essere andata su piu' righe.. allora devo far ricalcolare la dimensione del contenuto
	RD3_Glb.AdaptToParent(this.ContentBox, this.GetHContentOffset(), this.GetContentOffset());
	//
	// Chiamo l'AdaptLayout dei miei figli
  var n = this.Tabs.length;
  for (var i=0; i<n; i++)
  {
    this.Tabs[i].AdaptLayout();
  }
  //
  // Se e' sotto, posiziono la toolbarbox
	if (this.Placement == RD3_Glb.TABOR_BOTTOM)
	{
		this.ToolbarBox.style.top = (this.Height - this.ToolbarBox.offsetHeight)+"px";
		//
		if (RD3_Glb.IsMobile() && this.Switched)
		{
		  // Impostato a true in CMDList::ConvertFormPopover
		  this.Switched = false;
		  //
		  // Safari ha un baco nel reflow quando una tabbed passa da popupframe a form normale (es docked)
		  // l'unico modo per aggirarlo e' togliere e rimettere la box delle linguette nel dom
  		var sib = this.ToolbarBox.nextSibling;
  		var par = this.ToolbarBox.parentNode;
  		par.removeChild(this.ToolbarBox);
  		par.insertBefore(this.ToolbarBox, sib);
  	}
	}
	if (this.Placement == RD3_Glb.TABOR_LEFT)
	{
	  this.ToolbarBox.style.left = RD3_Glb.IsMobile() ? "0px" : this.ToolbarBox.offsetHeight + "px";
	  this.ToolbarBox.style.top = "0px";
	  if (this.HiddenTabs)
	    this.ContentBox.style.left = "0px";
	  else
	    this.ContentBox.style.left = RD3_Glb.IsMobile() ? this.ToolbarBox.offsetWidth + "px" : this.ToolbarBox.offsetHeight + "px";
	  this.ContentBox.style.top = "0px";
	}
	if (this.Placement == RD3_Glb.TABOR_RIGHT)
	{
	  this.ToolbarBox.style.left = RD3_Glb.IsMobile() ? this.ContentBox.offsetWidth + "px" : (this.ContentBox.offsetWidth + this.ToolbarBox.offsetHeight) + "px";
	  this.ToolbarBox.style.top = "0px";
	  this.ContentBox.style.left = "0px";
	  this.ContentBox.style.top = "0px";
	}
}

// ***************************************************************
// Crea gli oggetti DOM relativi alla Toolbar della Tabbed
// ***************************************************************
TabbedView.prototype.RealizeToolbar = function()
{
  // Creo solo il contenitore esterno delle Tabbed, tutto il resto verra' fatto dalla
  // realize delle Tab
  this.ToolbarBox = document.createElement("div");
  this.ToolbarBox.setAttribute("id", "tl:" + this.Identifier);
  this.ToolbarBox.className = "toolstrip-container";
  //
  if (this.ZoneTabView && !RD3_Glb.IsMobile())
    this.ToolbarBox.style.paddingTop = "0px";
  //
  this.FrameBox.appendChild(this.ToolbarBox);
}


// *******************************************************************
// Ritorna l'indice di una tabbed
// *******************************************************************
TabbedView.prototype.FindTabIndex= function(tab) 
{
	var n = this.Tabs.length;
  for (var i=0; i<n; i++)
  {
    if (this.Tabs[i]==tab)
    	return i;
  }
	//
	return -1;
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
TabbedView.prototype.AfterProcessResponse= function()
{ 
  // Chiamo la classe base
  WebFrame.prototype.AfterProcessResponse.call(this);
  //
  // Passo il messaggio anche alle Tab
  var n = this.Tabs.length;
	for (var i=0;i<n;i++)
		this.Tabs[i].AfterProcessResponse();
}


// ********************************************************************************
// Risistema il layout dei frame figli
// ********************************************************************************
TabbedView.prototype.SetChildLayout = function()
{ 
	;
}


// ********************************************************************************
// Torna il frame attualmente visibile
// ********************************************************************************
TabbedView.prototype.GetSelectedFrame= function()
{
	var t = this.Tabs[this.SelectedPage];
	if (t)
		return t.Content;
	return null;
}


// *********************************************************
// E' arrivato un click a livello di frame
// *********************************************************
TabbedView.prototype.OnFrameClick = function(evento, dbl, btn, x, y, xb, yb, tget)
{
	// Risalgo allo SPAN della tab se esiste
	var id = tget?RD3_Glb.GetRD3ObjectId(tget):null;
	//
	var ev = new IDEvent("rawclk", this.Identifier, evento, dbl?this.MouseDoubleClickEventDef:this.MouseClickEventDef, dbl, btn, Math.floor(xb)+"-"+Math.floor(yb), Math.floor(x)+"-"+Math.floor(y), id);
}

// ********************************************************************************
// Compone la lista di drop per le pagine
// ********************************************************************************
TabbedView.prototype.ComputeDropList = function(list, dragobj)
{
  // Se non sono stato realizzato ... niente DropList
  if (!this.Realized)
    return;
  //
  if (!this.CanDrop)
    return;
  //
  list.push(this);
  //
  // Calcolo le coordinate assolute...
  var o = this.ToolbarBox;
  this.AbsLeft = RD3_Glb.GetScreenLeft(o,true);
  this.AbsTop = RD3_Glb.GetScreenTop(o,true);
  if (!RD3_Glb.IsIE())
  {
    // Sugli altri browser devo tenere conto della scrollbar...
    this.AbsLeft -= this.ToolbarBox.scrollLeft;
    this.AbsTop -= this.ToolbarBox.scrollTop;
  }
  //
  this.AbsRight = this.AbsLeft + o.offsetWidth - 1;
  this.AbsBottom = this.AbsTop + o.offsetHeight - 1;
  //
  // Giro su tutte le pagine e lo chiedo a loro
  var n = this.Tabs.length;
  for (var i = 0; i<n; i++)
  {
    this.Tabs[i].ComputeDropList(list, dragobj);
  }
}

TabbedView.prototype.OnMouseUp = function(evento)
{
  // Chiamo la classe base
  WebFrame.prototype.OnMouseUp.call(this, evento);
  //
  // Su Touch se sono una tabbed arriva direttamente a me il rawclick, non passando
  // dal contenuto.. quindi in questo caso lo giro alla pagina selezionata...
  // uso MouseDown/MouseUp in modo che anche la pagina controlli l'oggetto e faccia scattare il click solo se e' uno dei suoi
  // figli
  if (RD3_Glb.IsTouch())
  {
    var frm = this.GetSelectedFrame();
    if (frm)
    {
      frm.OnMouseUp(evento);
    }
  }
}

TabbedView.prototype.OnMouseDown = function(evento)
{
  // Chiamo la classe base
  WebFrame.prototype.OnMouseDown.call(this, evento);
  //
  // Su Touch se sono una tabbed arriva direttamente a me il rawclick, non passando
  // dal contenuto.. quindi in questo caso lo giro alla pagina selezionata...
  // uso MouseDown/MouseUp in modo che anche la pagina controlli l'oggetto e faccia scattare il click solo se e' uno dei suoi
  // figli
  if (RD3_Glb.IsTouch())
  {
    var frm = this.GetSelectedFrame();
    if (frm)
    {
      frm.OnMouseDown(evento);
    }
  }
}

TabbedView.prototype.GetContentOffset = function()
{ 
  if (this.Placement == RD3_Glb.TABOR_BOTTOM || this.Placement == RD3_Glb.TABOR_TOP)
    return this.ToolbarBox.offsetHeight;
  //
  return 0;
}

// ********************************************************************************
// Indica quanto il contenuto deve essere piu' stretto del frame.. (per tabbed 
// verticali)
// ********************************************************************************
TabbedView.prototype.GetHContentOffset = function()
{ 
  if (this.Placement == RD3_Glb.TABOR_RIGHT || this.Placement == RD3_Glb.TABOR_LEFT)
  {
    var ret = 0;
    //
    if (RD3_Glb.IsMobile())
      ret = this.ToolbarBox.offsetWidth;
    else
      ret = this.ToolbarBox.offsetHeight;
    //
    // Devo farlo perche' magari il display e' stato messo a none ma ancora le dimensioni non sono state aggiornate..
    if (this.ToolbarBox.style.display == "none")
      ret = 0;
    //
    return ret;
  }
  //
  return 0;
}
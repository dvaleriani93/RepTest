// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Tree: Rappresenta un frame di tipo
// Tree
// ************************************************

function Tree(pform)
{
  // Chiamo il costruttore superiore
  WebFrame.call(this,pform); 
  //
	// Proprieta' di questo oggetto di modello
  this.PopupMenu = null;				   // L'oggetto command set da mostrare come popupmenu
  this.MultipleSelection = false;  // L'albero e' multiselezionabile?
  this.DragDrop = false;           // L'albero e' modificabile con il D&D?
  this.ActivateOnExpand = true;    // Se true, un nodo viene attivato anche quando viene espanso
  this.CheckActive = false;        // La modifica della selezione multipla deve essere comunicata subito al Server?
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo nodo
  this.ClickEventDef = RD3_Glb.EVENT_ACTIVE;  		// Il click sul nodo deve avvenire come evento server asincrono
  this.ExpandEventDef = RD3_Glb.EVENT_ACTIVE;     // L'expand/collapse sul nodo deve avvenire come evento client
  this.FirstExpandDef = RD3_Glb.EVENT_ACTIVE; 		// La prima espansione deve avvenire lato server
  this.CheckEventDef = RD3_Glb.EVENT_CLIENTSIDE|RD3_Glb.EVENT_SERVERSIDE;  // Attivo la procedura locale del Check?
  //
	// Oggetti secondari gestiti da questo oggetto di modello
	this.RootNodes = new Array();    // Lista degli oggetti TreeNode di primo livello
	this.SelectedNode = null;        // Il nodo attualmente attivo
	this.Prevsel = null;             // Nodo selezionato precedentemente (per gestire il cambio di selezione)
  this.NodeBox = null;     				 // Il DIV complessivo dei nodi radice in caso mobile
	//
	// Variabili per la gestione di questo oggetto
	this.RefreshSelected = "";      // Identificatore del nodo da selezionare DOPO aver fatto un refresh DO (vedi SetSelectedNode)
  this.RecenterTree = false;      // Occorre ricentrare l'albero dopo la selezione di un nodo?
}
//
// Definisco l'estensione della classe
Tree.prototype = new WebFrame();


// *******************************************************************
// Inizializza questo Tree leggendo i dati da un nodo <wfr> XML
// *******************************************************************
Tree.prototype.LoadFromXml = function(node) 
{
	// Chiamo la classe base
	WebFrame.prototype.LoadFromXml.call(this,node);
	//
	// Carico nodi dell'albero
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
			case "trn":
			{
				// Leggo il nodo di primo livello, e poi passo il messaggio
				// di caricamento
				var newnode = new TreeNode(this,null);
				newnode.LoadFromXml(objnode);
				this.RootNodes.push(newnode);
			}
			break;
		}
	}		
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
Tree.prototype.LoadProperties = function(node)
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
    	case "mul": this.SetMultipleSelection(attrnode.nodeValue=="1"); break;
    	case "ded": this.SetDragDrop(attrnode.nodeValue=="1"); break;
    	case "aoe": this.SetActivateOnExpand(attrnode.nodeValue=="1"); break;
    	case "cms": this.SetPopupMenu(attrnode.nodeValue); break;
    	case "sel": this.SetSelectedNode(attrnode.nodeValue); break;
    	case "act": this.SetCheckActive(attrnode.nodeValue=="1"); break;
    	
    	case "clk": this.ClickEventDef = parseInt(attrnode.nodeValue); break;
    	case "xpc": this.ExpandEventDef = parseInt(attrnode.nodeValue); break;
    	case "fex": this.FirstExpandDef = parseInt(attrnode.nodeValue); break;
    	case "chc": this.CheckEventDef = parseInt(attrnode.nodeValue); break;

    	case "exa": this.ExpandAnimDef = valore; break;
    }
  }
}

// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
Tree.prototype.ChangeProperties = function(node)
{
	// Vediamo se nel nodo di cambiamento sono indicati nuovi valori per i nodi radice
	var objlist = node.childNodes;
	//
	// In IE il primo nodo e' gia' l'elemento, negli altri il primo nodo e' un "\n"
	var trn = RD3_Glb.HasNode(node, "trn");
	//
	if (objlist.length>0 && trn)
	{
		// In questo caso elimino i figli miei e poi carico gli altri
		this.ResetCache();
	  this.LoadFromXml(node);
	  //
	  if (this.Realized)
	  {
    	var cnt = this.ContentBox;
    	if (RD3_Glb.IsMobile())
    		cnt = this.NodeBox;
    	//
		  var n=this.RootNodes.length;
		  for (var i=0; i<n; i++)
		  {
		  	this.RootNodes[i].Realize(cnt);
		  }
		  //
		  // Tento di riselezionare il nodo corretto nell'albero
		  if (this.SelectedNode)
		    this.SetSelectedNode(this.SelectedNode);
		  //
    	// Nel caso mobile ora verifico se ci sono dei nodi da espandere: la realize non lo fa
    	if (RD3_Glb.IsMobile())
    	{
    	  for (var i=0; i<n; i++)
        {
          if (this.RootNodes[i].ExpandSkipped && this.RootNodes[i].Expanded)
        	  this.RootNodes[i].SetExpanded(this.RootNodes[i].Expanded, true, true);
        }
    	}
		}
	}
	//
	// Proseguo con il cambio di proprieta'
	this.LoadProperties(node);
	
}


// *******************************************************************
// Setter delle proprieta'
// *******************************************************************
Tree.prototype.SetMultipleSelection= function(value) 
{
  var old = this.MultipleSelection;
	if (value!=undefined)
		this.MultipleSelection = value;
	//
  // Se e' stata spenta la multi-selezione, si perde il nodo attivo
  if (old != this.MultipleSelection && !this.MultipleSelection)
	  this.ActiveNode = null;
  //
	if (this.Realized)
	{
	  // Mando un messaggio ai miei figli per comunicargli il cambiamento di stato
		var n = this.RootNodes.length;
	  for (var i=0; i<n; i++)
	  {
		  this.RootNodes[i].MultipleSelectionChanged();
	  }
	}
}

Tree.prototype.SetDragDrop= function(value) 
{
	// Nessuna modifica all'aspetto visuale richiesta...
	this.DragDrop = value;
}

Tree.prototype.SetActivateOnExpand= function(value) 
{
	// Nessuna modifica all'aspetto visuale richiesta...
	this.ActivateOnExpand = value;
}

Tree.prototype.SetCheckActive= function(value) 
{
	// Nessuna modifica all'aspetto visuale richiesta...
	this.CheckActive = value;
	this.CheckEventDef = (this.CheckActive) ? RD3_Glb.EVENT_ACTIVE : RD3_Glb.DEFERRED;
}

Tree.prototype.SetPopupMenu= function(value) 
{
	// Prendo l'oggetto command set dalla mappa per sapere quale menu' contestuale aprire
	if (!value.Identifier)
	{
	  this.PopupMenu = RD3_DesktopManager.ObjectMap[value];
	  //
	  // Se il PopupMenu non e' nella mappa mi memorizzo comunque l'identificatore
	  if (this.PopupMenu == undefined && value != undefined)
	    this.PopupMenu = value;
	}
	else
	  this.PopupMenu = value;
}

Tree.prototype.SetSelectedNode= function(value) 
{
  // Mi memorizzo il nodo selezionato precedente (se esiste)
  if (!this.Prevsel && this.SelectedNode)
    this.Prevsel = this.SelectedNode;
  //
	// Prendo il nodo attuale dalla mappa, poi aggiusto l'aspetto visuale
	this.SelectedNode = RD3_DesktopManager.ObjectMap[value];
	//
	if (this.Realized)
	{
	  if (this.SelectedNode)
	  {
	    this.RefreshSelected = "";
	    //
		  // Seleziono il nodo anche visualmente
		  if (this.SelectedNode.NodeText)
		  	this.SelectedNode.NodeText.className = "tree-selected-node-text";
      else if (RD3_Glb.IsMobile() && (this.SelectedNode.AlreadyExpanded && this.SelectedNode.Nodes.length == 0))
        RD3_Glb.AddClass(this.SelectedNode.CaptionBox, "tree-node-selected-node");
		  //
		  // Dopo un refresh arriva un selected node che e' uguale a quello precedente: in questo caso non devo
		  // togliere la selezione
		  if (this.Prevsel && this.Prevsel.Realized && this.Prevsel.Identifier!=this.SelectedNode.Identifier)
		  {
		  	if (this.Prevsel.NodeText)
		    	this.Prevsel.NodeText.className = "tree-node-text";
				else if (RD3_Glb.IsMobile())
          RD3_Glb.RemoveClass(this.Prevsel.CaptionBox, "tree-node-selected-node");
		    this.Prevsel = null;
		  }
		  else
		  {
		    // Il nodo selezionato precedentemente potrebbe esistere ma essere stato distrutto
		    if (this.Prevsel && !this.Prevsel.Realized)
		      this.Prevsel = null;
		  }
		  //
		  // Al termine della richiesta devo ricordarmi di verificare se occorre ricentrare l'albero
		  // a seguito della selezione di un nodo che non era visibile
		  this.RecenterTree = true;
		}
		else if (value=="")
		{
			// Gestisco deselezione avvenuta lato server
		  if (this.Prevsel && this.Prevsel.Realized)
		  {
		  	if (this.Prevsel.NodeText)
		    	this.Prevsel.NodeText.className = "tree-node-text";
		    this.Prevsel = null;
		  }
		}
	  else
	  {
	    // Se sono in un refresh puo' succedere che il nodo selezionato non sia stato ancora creato (i nodi relativi al nodo 
	    // sono dopo nell'xml), allora mi salvo il valore del nodo selezionato
	    // ed ogni nodo padre che ricostruisce i suoi figli richiamera' questa funzione, fino a quando non verra' trovato il nodo 
	    // selezionato
	    this.RefreshSelected = value;
	  }
	}
  else
  {
    // Se non sono realizzato controllo il valore del nodo selezionato: se non esiste mi memorizzo il valore del nodo selezionato
    // poi nella realize lo cerchero' nella mappa
    if (!this.SelectedNode)
     this.SelectedNode = value;
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
Tree.prototype.Realize = function(parent)
{
	// Chiamo la classe base
	WebFrame.prototype.Realize.call(this,parent);
	//
	// cambio la classe e ridimensiono nuovamente il ContentBox per tenere conto di eventuali bordi
	this.ContentBox.className = "tree-container";
	//
	// Ora realizzo i nodi root nel ContentBox
	var cnt = this.ContentBox;
	//
	// Inizializzo altri oggetti
	if (RD3_Glb.IsMobile())
	{
		// Creo il div per i nodi radice, creo e inizializzo lo scroller
		this.NodeBox = document.createElement("div");
		this.NodeBox.setAttribute("id", this.Identifier+":box");
		this.NodeBox.className = "tree-node-container";
		cnt = this.NodeBox;
		this.ContentBox.appendChild(cnt);
    this.IDScroll = new IDScroll(this.Identifier, this.NodeBox, this.ContentBox, this);		
	}
	//
	var n = this.RootNodes.length;
	for (var i=0; i<n; i++)
	{
		this.RootNodes[i].Realize(cnt);
	}
	//
	// Inizializzazione
	this.Realized = true;
	this.SetSelectedNode(this.SelectedNode);
	//
	// Se quando ho mappato il popupmenu questo non esisteva e mi sono memorizzato l'identifier riprovo a cercarcarlo nella mappa
	if (this.PopupMenu != undefined && !this.PopupMenu.Identifier)
	  this.SetPopupMenu(this.PopupMenu);
	//
	// Nel caso mobile ora verifico se ci sono dei nodi da espandere: la realize non lo fa
	if (RD3_Glb.IsMobile())
	{
	  for (var i=0; i<n; i++)
    {
      if (this.RootNodes[i].ExpandSkipped && this.RootNodes[i].Expanded)
    	  this.RootNodes[i].SetExpanded(this.RootNodes[i].Expanded, true, true);
    }
    //
    // Applico le impostazioni della scrollbar (lo fa anche WebFrame.Realize, ma quando la chiamiamo ancora non c'e' IDScroll)
    this.SetScrollbar();
	}
}


// *****************************************************************
// Rimuove gli oggetti dom e i riferimenti di questo oggetto perche'
// sta per essere distrutto
// *****************************************************************
Tree.prototype.Unrealize = function()
{
	// Chiamo la classe base
	WebFrame.prototype.Unrealize.call(this);
	//
	// Passo il messaggio anche ai nodi
	var n = this.RootNodes.length;
	for (var i=0; i<n; i++)
	{
		this.RootNodes[i].Unrealize();
	}	
}

// **********************************************************************
// Metodo che svuota la cache dei nodi radice
// **********************************************************************
Tree.prototype.ResetCache = function()
{
  var n = this.RootNodes.length;
  var m = RD3_Glb.IsMobile();
	for (var i=0; i<n; i++)
	{
		var tn = this.RootNodes[i];
		//
		if (m && tn.Expanded)
			tn.ResetCache();
		//
		tn.Unrealize();
	}
  //
  this.RootNodes.splice(0, this.RootNodes.length);
}

// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
Tree.prototype.AdaptLayout = function()
{
  // Chiamo la classe base
	WebFrame.prototype.AdaptLayout.call(this);
	//
	// L'albero ha un ulteriore padding di 2px per staccarlo dal frame container
	var ofs = RD3_Glb.IsMobile()?0:4;
	RD3_Glb.AdaptToParent(this.ContentBox, ofs, this.GetContentOffset()+ofs);
	//
	if (RD3_Glb.IsMobile())
	{
		// Se c'era un nodo attivo sistemo quello
		if (this.ActiveNode)
		{
			this.ActiveNode.SetNodeClass(this.ActiveNode.Expanded);
		}
		else if (this.SelectedNode)
		{
			this.SelectedNode.SetNodeClass(this.SelectedNode.Expanded);
		}
		else if (this.RootNodes.length>0)
		{
			this.RootNodes[0].SetNodeClass(false);
		}
	}
}


// ********************************************************************************
// Compone la lista di drop per i nodi
// ********************************************************************************
Tree.prototype.ComputeDropList = function(list, dragobj)
{
	if ((!this.DragDrop && !this.CanDrop) || !this.Enabled)
		return;
	//
	var n = this.RootNodes.length;
	for (var i = 0; i<n; i++)
	{
		this.RootNodes[i].ComputeDropList(list, dragobj);
	}
}


Tree.prototype.SetEnabled= function(value) 
{
	// Chiamo la classe base
	WebFrame.prototype.SetEnabled.call(this, value);
	//
	// Aggiorno tutti i nodi
	var n = this.RootNodes.length;
	for (var i = 0; i<n; i++)
	{
		this.RootNodes[i].SetEnabled(value);
	}
}

// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
Tree.prototype.AfterProcessResponse= function()
{ 
	// Chiamo la classe base che esegue un recalc layout se richiesto
	WebFrame.prototype.AfterProcessResponse.call(this);
	//
  // Se c'e' un nodo selezionato e occorre verificare che sia visibile ...
	if (this.SelectedNode && this.RecenterTree && !RD3_Glb.IsMobile())
	{
	  this.RecenterTree = false;
	  //
    var tn = this.SelectedNode.CaptionBox; // TreeNode selezionato
    var offsetTN = tn.offsetTop;           // offetTop del TreeNode selezionato
    //
    // !IE calcolano l'offsetTop a partire dal primo padre con position absolute
    // In tal caso il primo oggetto, a partire dal frame-container,
    // che mi contiene e con position non absolute e' il tree-container
    if (!RD3_Glb.IsIE())
      offsetTN -= this.ContentBox.offsetTop
    //
    // Se il nodo selezionato si trova nella parte superiore non visibile nell'albero
    if (offsetTN < this.ContentBox.scrollTop)
    {
      // Scrollo l'albero per rendere visibile il nodo selezionato e il precedente
	    this.ContentBox.scrollTop = offsetTN - tn.offsetHeight;
    }
    // Se il nodo selezionato si trova nella parte inferiore non visibile nell'albero
    else if (offsetTN + tn.offsetHeight > this.ContentBox.scrollTop + this.ContentBox.clientHeight)
    {
      // Scrollo l'albero per rendere visibile il nodo selezionato e il successivo
	    this.ContentBox.scrollTop = offsetTN + (2*tn.offsetHeight) - this.ContentBox.clientHeight;
    }
  }
}


// *********************************************************
// E' arrivato un click a livello di frame
// *********************************************************
Tree.prototype.OnFrameClick = function(evento, dbl, btn, x, y, xb, yb, tget)
{
	// Risalgo alla DIV del nodo se esiste
	while (tget && tget.tagName!="DIV" && !RD3_Glb.HasClass(tget,"tree-node-container"))
		tget = tget.parentNode;
	//
	// calcolo box alla quale e' avvenuto il click
	var id = tget?RD3_Glb.GetRD3ObjectId(tget):null;
	//
	var ev = new IDEvent("rawclk", this.Identifier, evento, dbl?this.MouseDoubleClickEventDef:this.MouseClickEventDef, dbl, btn, Math.floor(xb)+"-"+Math.floor(yb), Math.floor(x)+"-"+Math.floor(y), id);
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
Tree.prototype.GetTooltip = function(tip, obj)
{
  return WebFrame.prototype.GetTooltip.call(this, tip, obj);
}


// ********************************************************************************
// Evento di inizio tocco sul book
// ********************************************************************************
Tree.prototype.OnTouchStart = function(e)
{ 
  // Chiamo la classe base
  WebFrame.prototype.OnTouchStart.call(this, e);
	//
	// Inizio lo scrolling solo se uno un solo dito
	if (e.targetTouches.length != 1)
		return false;
	//
	e.preventDefault();
	//
	// Memorizzo la posizione
	this.TouchStartX = e.targetTouches[0].clientX;
	this.TouchStartY = e.targetTouches[0].clientY;
	this.TouchOrgX   = e.targetTouches[0].clientX;
	this.TouchOrgY   = e.targetTouches[0].clientY;
	//
	this.TouchNode   = RD3_DDManager.GetObject(RD3_Glb.ElementFromPoint(this.TouchStartX,this.TouchStartY).id);
	if (this.TouchNode instanceof TreeNode)
	{
		this.TouchNode.OnMouseOverObj(e);
	}
	//
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
	this.TouchTimes  = new Array();
	this.TouchPosY   = new Array();
	this.TouchPosX   = new Array();
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  //
	this.TouchMoved  = false; // Indica che il dito si e' mosso
	this.ClearTouchScrollTimer();
	//
	return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
Tree.prototype.OnTouchMove = function(e)
{ 
	// Non era per me, continuo il giro
	if (this.TouchStartX==-1)
		return false;
	//
	// Prevent the browser from doing its default thing (scroll, zoom)
	e.preventDefault();
	//
	// Don't track motion when multiple touches are down in this element (that's a gesture)
  if (e.targetTouches.length != 1)
    return false;
  //
	var xd = e.targetTouches[0].clientX - this.TouchStartX;
	var yd = e.targetTouches[0].clientY - this.TouchStartY;
	var tt = new Date();
  //
  // Memorizzo la nuova posizione
  this.TouchStartX = e.targetTouches[0].clientX;
  this.TouchStartY = e.targetTouches[0].clientY;
  if (Math.abs(this.TouchStartX-this.TouchOrgX)>RD3_ClientParams.TouchMoveLimit || Math.abs(this.TouchStartY-this.TouchOrgY)>RD3_ClientParams.TouchMoveLimit)
	{
  	this.TouchMoved = true;
		if (this.TouchNode instanceof TreeNode)
			this.TouchNode.OnMouseOutObj(e);
  }
  //
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
  	return false;  
  //
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  if (this.TouchTimes.length>3)
  {
  	this.TouchTimes.shift();
  	this.TouchPosY.shift();
  	this.TouchPosX.shift();
  }
	//
	// Allora posso spostare il content box se avesse bisogno delle scrollbar
	var oldx = this.ContentBox.scrollLeft;
	var oldy = this.ContentBox.scrollTop;
	this.ContentBox.scrollLeft -= xd;
	this.ContentBox.scrollTop -= yd;
	//
	// non scrollo la form se ho appena scrollato l'albero in se
	this.FormScroll = this.FormScroll && oldx==this.ContentBox.scrollLeft && oldy==this.ContentBox.scrollTop;
	//
	// Chiamo la classe base
  WebFrame.prototype.OnTouchMove.call(this, e);
	//
	return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
Tree.prototype.OnTouchEnd = function(e)
{ 
	if (this.TouchNode instanceof TreeNode)
	{
		this.TouchNode.OnMouseOutObj(e);
		this.TouchNode = null;
	}
	//
	// Non era per me, continuo il giro
	if (this.TouchStartX==-1)
		return false;
	//
	// Prevent the browser from doing its default thing (scroll, zoom)
	e.preventDefault();
	//
	// Stop tracking when the last finger is removed from this element
  if (e.targetTouches.length != 0 && e.changedTouches.length!=1)
    return false;
  //
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
  	return false;    
	//
	// Simulo il click se non mi ero mosso.
	if (!this.TouchMoved)
	{
		var sx = e.changedTouches[0].clientX;
		var sy = e.changedTouches[0].clientY;
		var doubletap = false;
		this.FormScroll = false;
		//
		// Vediamo se e' un singolo o doppio click
		if (new Date()-this.SingleTapTime<300 && Math.abs(sx-this.SingleTapX)<16 && Math.abs(sy-this.SingleTapY)<16)
		{
			doubletap = true;
			this.SingleTapTime = 0;
			this.SingleTapX = -100;
			this.SingleTapY = -100;
		}
		else
		{
			this.SingleTapTime = new Date();
			this.SingleTapX = sx;
			this.SingleTapY = sy;
		}
		//
		var theTarget = RD3_Glb.ElementFromPoint(sx, sy);
		//
		var obj = null;
		var canact = false;
		if (theTarget)
		{
			canact = (theTarget.tagName=="IMG" || theTarget.tagName=="INPUT");
			//
			// Click solo su nome del nodo, altrimenti non lo posso tirare in giro
			if (theTarget.tagName=="SPAN")
			{
				obj = RD3_DDManager.GetObject(theTarget.id);
				if (obj instanceof TreeNode)
					canact = true;
			}
		}
		//
		if (canact)
		{
			var theEvent = document.createEvent('MouseEvents');
			theEvent.initMouseEvent(doubletap?'dblclick':'click', true, true, window, 1, sx, sy, sx, sy);
			theTarget.dispatchEvent(theEvent);
		}
	}
	else if (this.TouchTimes.length==3)
	{
		// Se stavo spostando il content box, verifico le velocita'
		var dt = this.TouchTimes[2]-this.TouchTimes[0];
		var dx = this.TouchPosX[0]-this.TouchPosX[2];
		var dy = this.TouchPosY[0]-this.TouchPosY[2];
		if (new Date()-this.TouchTimes[2]<100 && dt>0)
		{
			var vy = dy / dt;
			var vx = dx / dt;
			//
			// Attivo il timer e passo i dati
			if (Math.abs(vx)>0.3 || Math.abs(vy)>0.3)
			{
	      this.TouchScrollTimerId = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TouchScrollTimer', null, ["+vx+","+vy+",0])", 10);
			}
		}
	}
	//
  // Chiamo la classe base
  WebFrame.prototype.OnTouchEnd.call(this, e);
	//
	this.TouchStartX=-1;
	this.TouchStartY=-1;
	this.TouchMoved = false;
	this.TouchMove = false;
	//
	return false;
}


// ********************************************************************************
// Gestisce lo scroll via touch del pannello.
// v e' la velocita' di scroll in ms, il segno indica la direzione
// n e' il numero di volte che e' stata eseguita la funzione
// ********************************************************************************
Tree.prototype.TouchScrollTimer = function(dummy, ap)
{ 
	// Caso scrolling content box
	if (ap.length==3)
	{
		var vx = ap[0];
		var vy = ap[1];
		var n  = ap[2];
		//
		this.ContentBox.scrollLeft += vx*10;
		this.ContentBox.scrollTop += vy*10;
		//
		if (n<40)
		{
			vx = vx*0.97;
			vy = vy*0.97;
			this.TouchScrollTimerId = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TouchScrollTimer', null, ["+vx+","+vy+","+(n+1)+"])", 10);
		}
	}
}


// ********************************************************************************
// Annulla timer di scroll
// ********************************************************************************
Tree.prototype.ClearTouchScrollTimer = function()
{
	if (this.TouchScrollTimerId>0)
	{
		window.clearTimeout(this.TouchScrollTimerId);
		this.TouchScrollTimerId=0;
		this.TouchScroll=0;
	}
}

// ********************************************************************************
// Nasconde o mostra i pulsanti di Back dell'albero nel caso mobile (chiamata da Tab::SelectPage)
// ********************************************************************************
Tree.prototype.ChangeExpose  = function(exposed)
{
  // Chiamo la classe base
  WebFrame.prototype.ChangeExpose.call(this, exposed);
	//	
  var n = this.RootNodes.length;
  for (var i=0; i<n; i++)
  {
    this.RootNodes[i].ChangeExpose(exposed);
  }
}


// *******************************************************************
// Chiamato quando cambia il colore di accento
// *******************************************************************
Tree.prototype.AccentColorChanged = function(reg, newc) 
{
	// Modifico lo stile di tutti i nodi se sono selezionati
	var n = this.RootNodes.length;
	for (var i=0; i<n; i++)
		this.RootNodes[i].AccentColorChanged(reg, newc);
}

//**********************************************************
// Questo evento forza l'albero mobile a tornare alla Root 
// collassando in maniera immediata tutti i nodi
//***********************************************************
Tree.prototype.ResetTree = function() 
{
	var n = this.RootNodes.length;
  for (var i=0; i<n; i++)
    this.RootNodes[i].CollapseBranch();
}

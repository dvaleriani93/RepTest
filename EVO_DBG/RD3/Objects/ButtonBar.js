// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe ButtonBar: Rappresenta un frame di tipo
// Button Bar
// ************************************************

function ButtonBar(pform)
{
  // Chiamo il costruttore superiore
  WebFrame.call(this,pform); 
  //
	// Proprieta' di questo oggetto di modello
  this.CommandSet = null;				// L'oggetto command set da mostrare come buttonbar
  this.VerticalLayout = false;  // Bottoni in verticale o in orizzontale?  
  //
  // Oggetti visuali relativi alla ButtonBar
  this.ButtonBarContainer = null;   // Contenitore esterno dell'intera Button Bar
}
//
// Definisco l'estensione della classe
ButtonBar.prototype = new WebFrame();


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
ButtonBar.prototype.LoadProperties = function(node)
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
    	case "bvr": this.SetVerticalLayout(attrnode.nodeValue == "1"); break;
    	case "cms": this.SetCommandSet(attrnode.nodeValue); break;
    }
  }
}


// *******************************************************************
// Setter delle proprieta'
// *******************************************************************
ButtonBar.prototype.SetVerticalLayout= function(value) 
{
	// Devo solo impostare il valore in quanto questa proprieta'
	// non puo' cambiare dopo che l'oggetto e' stato realizzato
	this.VerticalLayout = value;
}

ButtonBar.prototype.SetCommandSet= function(value) 
{
	// Prendo l'oggetto command set dalla mappa
	this.CommandSet = RD3_DesktopManager.ObjectMap[value];
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
ButtonBar.prototype.Realize = function(parent)
{
	// Chiamo la classe base
	WebFrame.prototype.Realize.call(this,parent);
	//
	// Ora realizzo i bottoni nel mio frame
	this.CommandSet.RealizeButtonBar(this);
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
ButtonBar.prototype.AdaptLayout = function()
{ 
  // Se sono vuota, non faccio altro
  if (!this.ButtonBarContainer)
    return;
  //
	// Chiamo la classe base
	WebFrame.prototype.AdaptLayout.call(this);
	//
	// Forzo il ridisegno del button container a causa di problemi nei browser
	RD3_Glb.AdaptToParent(this.ButtonBarContainer);
	//
	// Chiamo quella del command set
	this.CommandSet.AdaptLayout();
}


// ***************************************************************
// Elimino gli oggetti Dom
// ***************************************************************
ButtonBar.prototype.Unrealize = function()
{
	// Chiamo la classe base
	WebFrame.prototype.Unrealize.call(this,parent);
	//
	// Ora elimino miei figli
	this.CommandSet.UnrealizeButtonBar();
}


// ********************************************************************************
// Evento di inizio tocco sulla lista bottoni
// lo uso solo per scrollare la lista
// ********************************************************************************
ButtonBar.prototype.OnTouchStart = function(e)
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
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
	this.TouchTimes  = new Array();
	this.TouchPosY   = new Array();
	this.TouchPosX   = new Array();
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  //
	this.ClearTouchScrollTimer();
	//
	return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
ButtonBar.prototype.OnTouchMove = function(e)
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
	// Il ditino si e' mosso in orizzontale?
	if (!RD3_DDManager.IsDragging && !RD3_DDManager.IsResizing)
	{
		// Allora posso spostare il content box se avesse bisogno delle scrollbar
		var oldx = this.ContentBox.scrollLeft;
		var oldy = this.ContentBox.scrollTop;
		//
		if (this.VerticalLayout)
			this.ContentBox.scrollTop -= yd;
		else
			this.ContentBox.scrollLeft -= xd;
		//
		// non scrollo la form se ho appena scrollato il book in se
		this.FormScroll = this.FormScroll && oldx==this.ContentBox.scrollLeft && oldy==this.ContentBox.scrollTop;
	}
	//
  // Chiamo la classe base
  WebFrame.prototype.OnTouchMove.call(this, e);
	//
	return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
ButtonBar.prototype.OnTouchEnd = function(e)
{ 
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
	if (this.TouchTimes.length==3)
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
ButtonBar.prototype.TouchScrollTimer = function(dummy, ap)
{ 
	// Caso scrolling content box
	if (ap.length==3)
	{
		var vx = ap[0];
		var vy = ap[1];
		var n  = ap[2];
		//
		if (this.VerticalLayout)
			this.ContentBox.scrollTop += vy*10;
		else
			this.ContentBox.scrollLeft += vx*10;			
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
ButtonBar.prototype.ClearTouchScrollTimer = function()
{
	if (this.TouchScrollTimerId>0)
	{
		window.clearTimeout(this.TouchScrollTimerId);
		this.TouchScrollTimerId=0;
		this.TouchScroll=0;
	}
}

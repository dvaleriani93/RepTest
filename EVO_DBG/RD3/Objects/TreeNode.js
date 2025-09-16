// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe TreeNode: Rappresenta un nodo in un
// frame di tipo Tree
// ************************************************

function TreeNode(ptree,pnode)
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = null;				// Identificatore del nodo (univoco anche rispetto alla form/tree)
  this.Caption = "";						// Nome del nodo
  this.Tooltip = "";						// Tooltip del nodo
  this.Image = "";							// Icona del nodo
  this.Selected = false;        // Nodo multiselezionato?
  this.CanBeChecked = true;     // Il nodo puo' essere multiselezionato?
  this.Expanded = false;     		// Il nodo e' attualmente espanso?
  this.AlreadyExpanded = false; // Il nodo e' mai stato espanso?
  this.Badge = "";              // Testo del Badge da assegnare al nodo
  this.ClassName;               // Classe aggiuntiva da applicare al nodo (this.CaptionBox)
  //
  // Oggetti figli di questo nodo
  this.Nodes = new Array();     // Elenco dei nodi figli di questo
  //
  // Altre variabili di modello...
  this.ParentTree = ptree;      // L'oggetto albero a cui appartengo
  this.ParentNode = pnode;      // L'oggetto nodo a cui appartengo
  this.WaitForChildren = false; // Sono in attesa dei miei figli (prima espansione..)
  this.ExecuteGFX = true;       // Flag che permette di disabilitare l'animazione di fold in alcuni casi
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi al nodo
  this.NodeBox = null;     // Il DIV complessivo del nodo
  this.CaptionBox = null;  // Il DIV della sola barra del titolo del nodo
  this.ExpandImg = null;   // Immagine da mostrare se il nodo ha dei figli e che indica l'espansione
  this.ChildImg = null;    // Immagine mostrata se il nodo non ha figli
  this.CheckBox = null;    // CheckBox del Nodo
  this.Filler = null;      // Filler per fare le righine verticali dei nodi padri
  this.NodeContent = null; // Span che contiene l'icona e il testo del nodo
  this.NodeImg = null;     // Immagine associata al nodo
  this.NodeText = null;    // Span contente il testo della caption del nodo
  this.ChildrenBox = null; // Il DIV che contiene i figli del nodo
  this.BadgeObj = null;    // Il DIV che mostra il Badge
  //
  //this.Ea = null;        // Funzione di End Animation mobile
}


// *******************************************************************
// Inizializza questo TreeNode leggendo i dati da un nodo <trn> XML
// *******************************************************************
TreeNode.prototype.LoadFromXml = function(node) 
{
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
      case "trn":
      {
        var newnode = new TreeNode(this.ParentTree,this);
        newnode.LoadFromXml(objnode);
        //
        this.Nodes.push(newnode);
      }
      break;
    }
  }    
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
TreeNode.prototype.ChangeProperties = function(node)
{
  // Vediamo se nel nodo di cambiamento sono indicati anche nodi figli...
  var objlist = node.childNodes;
  //
  // In IE il primo nodo e' gia' l'elemento, negli altri il primo nodo e' un "\n"
  var trn = RD3_Glb.HasNode(node, "trn");
  //
  if (objlist.length>0 && trn)
  {
    // In questo caso elimino i figli miei e poi carico gli altri
    this.RemoveChildren();
    this.LoadFromXml(node);
    //
    if (this.Realized && !RD3_Glb.IsMobile())
    {
      var n=this.Nodes.length;
      for (var i=0; i<n; i++)
      {
        this.Nodes[i].Realize(this.ChildrenBox);
      }
      //
      // Tento di riselezionare il nodo corretto nell'albero
      if (!this.ParentTree.SelectedNode && this.ParentTree.RefreshSelected != "")
        this.ParentTree.SetSelectedNode(this.ParentTree.RefreshSelected);
    }
    //
    // Se ero in attesa di miei figli mi allora mi memorizzo che sono arrivati ed eseguo l'animazione di folding,
    // se non ero in attesa di figli e me ne sono arrivati salto l'animazione e vado subito in stato finale..
    if (this.WaitForChildren)
      this.WaitForChildren = false;
    else
      this.ExecuteGFX = false;
    //
    // Ricalcolo il tipo di immagine da mostrare
    this.HandleExpandable();
    this.ExecuteGFX = true;
    if (RD3_Glb.IsMobile() && this.Expanded)
    	this.LoadNestedNode(true);
  }
  else
  {
    // Normale cambio di proprieta'
    this.LoadProperties(node);
    //
    // Se stavo aspettando dei figli devo eseguire l'handle dell'espansione anche se non ci sono figli, in modo da togliere
    // l'immagine di attesa figli
    if (this.WaitForChildren)
    {
      this.WaitForChildren = false;
      this.HandleExpandable();
    }
  }
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
TreeNode.prototype.LoadProperties = function(node)
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
      case "aex": this.SetAlreadyExpanded(attrnode.nodeValue=="1"); break;
      case "exp": this.SetExpanded(attrnode.nodeValue=="1"); break;
      case "cap": this.SetCaption(attrnode.nodeValue); break;
      case "tip": this.SetTooltip(attrnode.nodeValue); break;
      case "img": this.SetImage(attrnode.nodeValue); break;
      case "cch": this.SetCanCheck(attrnode.nodeValue=="1"); break;
      case "sel": this.SetSelected(attrnode.nodeValue=="1"); break;
      case "bdg": this.SetBadge(attrnode.nodeValue); break;
      case "cln": this.SetClassName(attrnode.nodeValue); break;
                  
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
TreeNode.prototype.SetAlreadyExpanded= function(value) 
{
  var old = this.AlreadyExpanded;
  this.AlreadyExpanded = value;
  //
  if (this.Realized && old != this.AlreadyExpanded)
  {
    this.HandleExpandable();
  }
}

TreeNode.prototype.SetExpanded= function(value, immediate, force) 
{
  var old = this.Expanded;
  this.Expanded = value;
  //
  if (this.Realized && (old != this.Expanded || force))
  {
    this.HandleExpandable();
    if (RD3_Glb.IsMobile() && (!this.Expanded || this.Nodes.length>0))
   		this.LoadNestedNode(this.Expanded, immediate, force);
    //
    if (this.ExpandSkipped)
      this.ExpandSkipped = false;
  }
  else if (this.Expanded)
  {
    // Mi memorizzo che il nodo va espanso..
    this.ExpandSkipped = true;
  }
}

TreeNode.prototype.SetCaption= function(value) 
{
  this.Caption = value;
  //
  if (this.Realized)
  {
  	if (this.NodeText)
    	this.NodeText.innerHTML = this.Caption;
    else
    	this.CaptionBox.innerHTML = this.Caption;
  }
}

TreeNode.prototype.SetTooltip= function(value) 
{
  this.Tooltip = value;
  //
  if (this.Realized)
  {
  	if (RD3_Glb.IsMobile())
  	{
  		if (value!="")
  		{
	  		// Realizzo uno span all'interno della caption
	  		this.CaptionBox.innerHTML = this.Caption+"<div class='tree-node-tooltip'>"+this.Tooltip+"</div>";
	  		RD3_Glb.AddClass(this.CaptionBox, "tree-node-with-tooltip");
	  	}
  	}
  	else
    	RD3_TooltipManager.SetObjTitle(this.CaptionBox, this.Tooltip);
  }
}

TreeNode.prototype.SetImage= function(value) 
{
  this.Image = value;
  //
  if (this.Realized)
  {
  	// Nel caso mobile l'immagine va insieme al bottone di espansione e anche ai check-boxes
  	if (RD3_Glb.IsMobile())
  	{
  		this.HandleExpandable();
  	}
  	else
  	{
	    if (this.Image != "")
	    {
	      this.NodeImg.style.display = "";    
	      this.NodeImg.src = RD3_Glb.GetImgSrc("images/" + this.Image);
	    }
	    else
	      this.NodeImg.style.display = "none";
	  }
  }
}

TreeNode.prototype.SetCanCheck= function(value) 
{
  this.CanBeChecked = value;
  //
  if (this.Realized)
  {
  	if (RD3_Glb.IsMobile())
  	{
  		// Nel caso mobile, i check boxes sono parte dell immagine di background
  		this.HandleExpandable();
  	}
  	else
  	{
	    // I check vanno mostrati se io li posso mostrare e il mio albero li puo' mostrare
	    if (this.CanBeChecked && this.ParentTree.MultipleSelection)
	      this.CheckBox.style.display = "";
	    else
	      this.CheckBox.style.display = "none";
	  }
  }
}

TreeNode.prototype.SetSelected= function(value) 
{
  this.Selected = value;
  //
  if (this.Realized)
  {
  	if (RD3_Glb.IsMobile())
  	{
  		// Nel caso mobile, i check boxes sono parte dell immagine di background
  		this.HandleExpandable(true);
  	}
  	else
  	{
	    if (this.Selected)
	      this.CheckBox.checked = true;
	    else
	      this.CheckBox.checked = false;
	  }
  }
}

TreeNode.prototype.SetBadge= function(value) 
{
  this.Badge = value;
  //
  if (this.Realized)
  {
    if (this.Badge == "" && this.BadgeObj != null)
    {
      this.BadgeObj.parentElement.removeChild(this.BadgeObj);
      this.BadgeObj = null;
    }
    else if (this.Badge != "")
    {
      if (this.BadgeObj == null)
      {
	      this.BadgeObj = document.createElement("div");
	      this.BadgeObj.setAttribute("id", this.Identifier+":bdg");
	      this.BadgeObj.className = "badge-" + (RD3_Glb.IsMobile() ? "grey badge-right" : "red");
	      if (RD3_Glb.IsMobile())
  	      this.BadgeObj.style.marginRight = "10px";
  	    else
	        this.BadgeObj.style.marginLeft = "10px";
	      //
	      this.CaptionBox.appendChild(this.BadgeObj);
	    }
	    //
	    this.BadgeObj.innerHTML = this.Badge;
	    this.BadgeObj.style.top = RD3_Glb.IsMobile() ? "-4px" : "-2px";
    }
  }
}

// *******************************************************************
// Applico la classe
// *******************************************************************
TreeNode.prototype.SetClassName = function(cls)
{
  var old = this.ClassName;
  if (cls != undefined)
    this.ClassName = cls;
  //
  if (this.Realized && (old != this.ClassName || !cls)) 
  {
    // Rimuovo la classe precedente
    if (old != "") 
      RD3_Glb.RemoveClass2(this.CaptionBox, old);
    //
    // Applico la nuova classe alla fine della lista
    if (this.ClassName && this.ClassName != "")
      RD3_Glb.AddClass(this.CaptionBox, this.ClassName);
  }
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
TreeNode.prototype.Realize = function(parent)
{
	if (RD3_Glb.IsMobile())
	{
		// Nel caso mobile la struttura dell'albero e' piuttosto diversa
		// Infatti si usa solo NODEBOX per i figli e CAPTIONBOX per il nodo attuale
		// Inoltre, non realizzo adesso i nodi figli, ma solo al momento dell'espansione
	  this.CaptionBox = document.createElement("div");
	  this.CaptionBox.setAttribute("id", this.Identifier+":cap");
	  this.CaptionBox.className = "tree-node-caption";
	  //
	  parent.appendChild(this.CaptionBox);
	}
	else
	{
	  // realizzo i miei oggetti visuali
	  // Creo il mio contenitore globale
	  this.NodeBox = document.createElement("div");
	  this.NodeBox.setAttribute("id", this.Identifier);
	  this.NodeBox.className = "tree-node-container";
	  //
	  this.CaptionBox = document.createElement("div");
	  this.CaptionBox.setAttribute("id", this.Identifier+":cap");
	  this.CaptionBox.className = "tree-node-caption";
	  //
	  this.ExpandImg = document.createElement("img");
	  this.ExpandImg.className = "tree-exp-img";
	  //
	  this.ChildImg = document.createElement("img");
	  this.ChildImg.src = RD3_Glb.GetImgSrc("images/tn.gif");
	  this.ChildImg.className = "tree-child-img";
	  //
	  this.CheckBox = document.createElement("input");
	  this.CheckBox.type = "checkbox";
	  this.CheckBox.className = "tree-node-check";
	  //
	  this.NodeContent = document.createElement("span");
	  //
	  this.NodeImg = document.createElement("img");
	  this.NodeImg.className = "tree-node-img";
	  //
	  this.NodeText = document.createElement("span");
	  this.NodeText.setAttribute("id", this.Identifier+":txt");
	  this.NodeText.className = "tree-node-text";
	  //
	  // Solo su SEATTLE, faccio gli alberi belli!
	  if ((RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen")) && this.ParentNode)
	  {
	    // Risalgo la catena dei padri per calcolare la dimensione totale del filler
	    var npar = 0;
	    var nparemptySX = 0;   // Buchi a sinistra
	    var nparemptyDX = 0;   // Buchi a destra
	    var emptyDX = true;    // Mi dice se sto contando i buchi a destra o a sinistra
	    //
	    var p = this.ParentNode;
	    while (p && p.Nodes)
	    {
	      // Incremento il numero dei padri
	      npar++;
	      //
	      // Se il nodo e' l'ultimo tra i suoi fratelli non mi serve la righina
	      if (p.IsLastChild())
	      {
	        if (emptyDX)
	          nparemptyDX++;
	        else
	          nparemptySX++;
	      }
	      else
	      {
	        // Ho trovato un nodo che non e' l'ultimo... mi servira' la righina... Da
	        // ora in poi conto i buchini a sinistra
	        emptyDX = false;
	      }
	      //
	      // Risalgo
	      p = p.ParentNode;
	    }
	    //
	    // Se ho padri
	    if (npar)
	    {
	      this.Filler = document.createElement("img");
	      if (RD3_Glb.IsFirefox() && npar-nparemptySX-nparemptyDX==0 && (nparemptySX || nparemptyDX))
	      {
	        // Firefox ha un comportamento particolare: se l'immagine e' larga 0 non considera il marginLeft!
	        // In questo caso dichiaro l'immagine larga 1px e sottraggo 1px al marginLeft.
	        this.Filler.style.width = "1px";
	        this.Filler.style.marginLeft = (nparemptySX*19 - 1) + "px";
	      }
	      else
	      {
	        this.Filler.style.width = ((npar-nparemptySX-nparemptyDX)*19) + "px";
	        this.Filler.style.marginLeft = (nparemptySX*19) + "px";
	      }
	      this.Filler.style.marginRight = (nparemptyDX*19) + "px";
	      this.Filler.src = RD3_Glb.GetImgSrc("images/empty.gif");
	      this.Filler.className = "tree-node-filler";
	      //
	      this.CaptionBox.appendChild(this.Filler);
	    }
	  }
	  //
	  this.NodeContent.appendChild(this.NodeImg);
	  this.NodeContent.appendChild(this.NodeText);
	  //
	  this.CaptionBox.appendChild(this.ExpandImg);
	  this.CaptionBox.appendChild(this.ChildImg);
	  this.CaptionBox.appendChild(this.CheckBox);
	  this.CaptionBox.appendChild(this.NodeContent);
	  //
	  this.ChildrenBox = document.createElement("div");
	  this.ChildrenBox.setAttribute("id", this.Identifier+":chi");
	  this.ChildrenBox.className = "tree-node-children";
	  //
	  this.NodeBox.appendChild(this.CaptionBox);
	  this.NodeBox.appendChild(this.ChildrenBox);
	  //
	  // Gestisco il click e l'expand
	  var parentContext = this;
	  this.CaptionBox.onclick = function(ev) { parentContext.OnClickNode(ev); };
	  this.ExpandImg.onclick = function(ev) { parentContext.OnExpandNode(ev); };
	  this.CheckBox.onclick = function(ev) { parentContext.OnCheckNode(ev); };
	  this.CheckBox.onkeypress = function(ev) { parentContext.OnKeyPress(ev); };
	  //
	  parent.appendChild(this.NodeBox);
	  //
	  // Poi chiedo ai miei figli di realizzarsi
	  var n = this.Nodes.length;
	  for(var i=0; i<n; i++)
	  {
	    this.Nodes[i].Realize(this.ChildrenBox);
	  }
	}
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  this.HandleExpandable();
  this.SetCaption(this.Caption);
  this.SetTooltip(this.Tooltip);
  this.SetExpanded(this.Expanded);
  this.SetAlreadyExpanded(this.AlreadyExpanded);
  this.SetImage(this.Image);
  this.SetExpanded(this.Expanded);
  this.SetCanCheck(this.CanBeChecked);
  this.SetSelected(this.Selected);
  this.SetEnabled(this.ParentTree.Enabled);
  this.SetBadge(this.Badge);
  this.SetClassName();
}


// ********************************************************************************
// Gestore evento di click su nodo?
// ********************************************************************************
TreeNode.prototype.OnClickNode= function(evento)
{ 
  if (!this.ParentTree.Enabled)
    return;
  //
  if (window.event && evento==undefined)
    evento = window.event;
  //
  var ev = new IDEvent("clk", this.Identifier, evento, this.ParentTree.ClickEventDef);
  //
  if (ev.ClientSide)
  {
    this.ParentTree.SetSelectedNode(this.Identifier);
  }
}



// ********************************************************************************
// Gestore evento di click destro su caption
// ********************************************************************************
TreeNode.prototype.OnRightClick= function(evento)
{ 
  if (!this.ParentTree.Enabled)
    return false;
  //
  if (RD3_Glb.IsTouch())
  {
    var x = RD3_Glb.GetScreenLeft(this.NodeText);
    var w = this.NodeText.offsetWidth;
    if (evento.clientX<x || evento.clientX>x+w)
      return false;
  }
  //  
  if (this.ParentTree.PopupMenu)
  {
    this.ParentTree.TouchMoved = true;
    this.ParentTree.TouchStartX = -1;
    //
    var ev = new IDEvent("rclk", this.Identifier, evento, this.ParentTree.ClickEventDef, "", this.ParentTree.PopupMenu.Identifier);
    this.OnMouseOutObj(evento);
    //
    // Disabilito click 
    return true;
  }
  //
  return false;
}

// ********************************************************************************
// Gestore evento di mouse over
// ********************************************************************************
TreeNode.prototype.OnMouseOverObj= function(evento, obj)
{ 
  if (this.CaptionBox && !RD3_Glb.IsMobile())
  {
    RD3_Glb.SwitchClass(this.CaptionBox, "tree-node-caption", "tree-node-caption-hl", true);
  }
}


// ********************************************************************************
// Gestore evento di mouse out
// ********************************************************************************
TreeNode.prototype.OnMouseOutObj= function(evento, obj)
{ 
  if (this.CaptionBox && !RD3_Glb.IsMobile())
  {
    RD3_Glb.SwitchClass(this.CaptionBox, "tree-node-caption-hl", "tree-node-caption", true);
  }
}

// ********************************************************************************
// Gestore evento di click su caption
// ********************************************************************************
TreeNode.prototype.OnExpandNode= function(evento)
{ 
  if (!this.ParentTree.Enabled)
    return;
  //
  if (window.event && evento==undefined)
    evento = window.event;
  //
  //
  if (!this.AlreadyExpanded || this.Nodes.length == 0)
  {
    var ev = new IDEvent("trnexp", this.Identifier, evento, this.ParentTree.FirstExpandDef);
    this.WaitForChildren = true;
    //
    if (this.ExpandImg)
    {
	    this.ExpandImg.src = RD3_Glb.GetImgSrc("images/trnload.gif");
	    this.ExpandImg.className = "tree-node-loading-img";
	  }
  }
  else
  {
    var ev = new IDEvent("trnexp", this.Identifier, evento, this.ParentTree.ExpandEventDef);
    if (ev.ClientSide)
      this.SetExpanded(!this.Expanded);
  }
  //
  // Dato che fermero' il bubbling dell'evento faccio scattare io l'onclick di webentrypoint
  // perche' altrimenti verrebbe saltato
  RD3_DesktopManager.WebEntryPoint.OnClick(evento);
  //
  // Devo fermare il bubbling dell'evento, in modo da non fare scattare il click sul nodo
  RD3_Glb.StopEvent(evento);
  return false;
}


// ********************************************************************************
// Gestore evento di check del nodo
// ********************************************************************************
TreeNode.prototype.OnCheckNode= function(evento)
{ 
  if (!this.ParentTree.Enabled)
    return;
  //
  if (window.event && evento==undefined)
    evento = window.event;
  //
  var value;
  var def = this.ParentTree.CheckEventDef;
  if (RD3_Glb.IsMobile())
  {
  	value = this.Selected ? "" : "on";
  	def = RD3_Glb.EVENT_ACTIVE;
  }
  else
  {
  	value = this.CheckBox.checked ? "on" : "";
  }
  var ev = new IDEvent("chg", this.Identifier, evento, def, "check", value);
  //
  // Devo fermare il bubbling dell'evento, in modo da non fare scattare il click sul nodo
  if (evento.stopPropagation)
    evento.stopPropagation();
  else
    evento.cancelBubble = true;
  //
  return true;
}


// ********************************************************************************
// Gestore evento di check del nodo
// ********************************************************************************
TreeNode.prototype.OnKeyPress= function(evento)
{ 
  if (window.event && evento==undefined)
    evento = window.event;
  //
  if (evento.keyCode == 13)
  {
    // Invio variazione immediata
    RD3_DesktopManager.SendEvents();
  }
}


// **********************************************************************
// Rimuove i figli di questo nodo
// **********************************************************************
TreeNode.prototype.RemoveChildren = function()
{
  var n=this.Nodes.length;
  for (var i=0; i<n; i++)
  {
    this.Nodes[i].Unrealize();
  }
}


// **********************************************************************
// Rimuove questo nodo
// **********************************************************************
TreeNode.prototype.Unrealize = function()
{
  // Tolgo l'oggetto dalla mappa comune
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Passo il messaggio ai figli
  var n=this.Nodes.length;
  for (var i=0; i<n; i++)
  {
    this.Nodes[i].Unrealize();
  }
  //
  // Elimino gli oggetti visuali
  if (RD3_Glb.IsMobile() && this.CaptionBox && this.CaptionBox.parentNode)
    this.CaptionBox.parentNode.removeChild(this.CaptionBox);
  if (this.NodeBox && this.NodeBox.parentNode)
    this.NodeBox.parentNode.removeChild(this.NodeBox);
  if (this.BackArrowImg && this.BackArrowImg.parentNode)
    this.BackArrowImg.parentNode.removeChild(this.BackArrowImg);
  if (this.BackImg && this.BackImg.parentNode)
    this.BackImg.parentNode.removeChild(this.BackImg);
  //
  // Annullo i riferimenti
  this.NodeBox = null;
  this.CaptionBox = null; 
  this.ExpandImg = null;  
  this.ChildImg = null; 
  this.CheckBox = null; 
  this.NodeImg = null;
  this.NodeText = null; 
  this.ChildrenBox = null;
  this.BadgeObj = null;
  //
  this.Realized = false;
}


// **********************************************************************
// Deve tornare vero se l'oggetto e' draggabile
// **********************************************************************
TreeNode.prototype.IsDraggable = function(id)
{
  // i nodi si prendono solo dal testo
  var exit = (id.substr(id.length-4) != ":txt" ? true : false);
  //
  if (RD3_Glb.IsMobile() && id.substr(id.length-4) == ":cap")
    exit = false;
  //
  if (exit)
    return false;
  //
  // La draggabilita' di un nodo dipende dall'albero: se l'albero e' draggabile il nodo e' draggabile
  return (this.ParentTree.DragDrop || this.ParentTree.CanDrag) && this.ParentTree.Enabled;
}


// **********************************************************************
// Drop effettuato sull'oggetto
// **********************************************************************
TreeNode.prototype.OnDrop = function(obj, evento)
{
  // Non lancio evento se:
  // 1) E' stata attivata la nuova gestione drop
  // 2) L'albero non e' attivo
  // 3) Non c'e' la vecchia vesione drop
  // 4) Non e' stato tirato un treenode
  if (this.CanDrop || !this.ParentTree.Enabled || !this.ParentTree.DragDrop || !(obj instanceof TreeNode))
    return false;
  //
  // Invio semplicemente l'evento di drop
  var ev = new IDEvent("drp", this.Identifier, evento, RD3_Glb.EVENT_ACTIVE, obj.Identifier);
  return true;
}


// **********************************************************************
// Metodo che valuta in base ai figli e allo stato di espansione se
// mostrare o meno l'immagine di espansione o l'immagine del nodo 
// senza figli
// **********************************************************************
TreeNode.prototype.HandleExpandable= function(flup) 
{
  if (this.Realized && RD3_Glb.IsMobile())
	{
		// Caso mobile... uso i background
		var bi = ""; var bp = ""; var pl = ""; var pr = ""; var bs = "";
		var ipl = 48; var ibp = 7;
		var act = true;
		//
		if (this.CanBeChecked)
		{
		  if (this.ParentTree.MultipleSelection)
		  {
  			ipl = 40;
  			bi = "url("+RD3_Glb.GetAbsolutePath()+"images/chk" +(this.Selected?1:0)+".png)";
  			bp = ibp+"px";
  			pl = ipl+"px";
  			bs = "25px 25px";
  			ipl+= 38;
  			ibp+= 31;
  			act = false;
  			if (this.Selected || (this==this.ParentTree.ActiveNode && !flup))
      		RD3_Glb.AddClass(this.CaptionBox, "tree-node-selected");
  			else
      		RD3_Glb.RemoveClass(this.CaptionBox, "tree-node-selected");			
    	}
      else if (this.Selected) // Se il pannello non mostra la multiselezione ma io sono selezionato rimuovo la classe (potrebbe aver messo e tolto la multisel)
      {
        RD3_Glb.RemoveClass(this.CaptionBox, "tree-node-selected");
      }	
		}
		if (this.Image!="")
		{
			if (bi!="")
			{
				bi += ",";
				bp += ",";
				bs += ",";
			}
			bi += "url("+RD3_Glb.GetAbsolutePath()+"images/" + encodeURI(this.Image)+")";
			bp += ibp+"px";
			pl = ipl+"px";
      bs += "IMGSIZE"; // Questa dimensione non ce l'ho... la devo calcolare
		}
		if (this.Nodes.length>0 || !this.AlreadyExpanded)
		{
			if (bi!="")
			{
				bi += ",";
				bp += ",";
				bs += ",";
			}
			bi += "url("+RD3_Glb.GetAbsolutePath()+"images/detail"+(this.IsActiveNode()&&act?"w":"")+".png)";
			bp += (this.ParentTree.Width-20)+"px";
		  bs += "10px 16px";
			pr = "24px";
		}
		if (act && this.IsActiveNode())
		{
			if (bi!="")
			{
				bi += ",";
				bp += ",";
				bs += ",";
			}
			if (RD3_Glb.IsIE(10, true))
			  bi += "linear-gradient(180deg, "+RD3_ClientParams.GetColorHL1()+", "+RD3_ClientParams.GetColorHL2()+")";
			else
			  bi += "-webkit-gradient(linear, 0% 0%, 0% 100%, from("+RD3_ClientParams.GetColorHL1()+"), to("+RD3_ClientParams.GetColorHL2()+"))";
			//
			bp += "0px 0px";  	
			bs += "100%";		
		}
		//
		// Controllo che il parentNode sia visibile,
		// altrimenti lo faro' dopo quando apparira' a video
		if (this.CaptionBox.parentNode.style.display=="")
		{
			var s = this.CaptionBox.style;
			s.backgroundImage = bi;
			s.backgroundPosition = bp;
			s.paddingLeft = pl;
			s.paddingRight = pr;
			//
			if (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro())
   		{		  
	  		s.backgroundRepeat = "no-repeat";
        //
        // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
        if (RD3_Glb.Adapt4Retina(this.Identifier, this.Image, 43, bs))
          s.backgroundSize = "0px 0px";
        else
     		  s.backgroundSize = bs.replace("IMGSIZE", "25px 25px");
	  	}
		}
	}
	//
	// Caso normale
  if (this.Realized && !RD3_Glb.IsMobile())
  {
    var exp = true;
    var n = this.Nodes.length;
    if (!this.AlreadyExpanded || (!this.Expanded && n > 0))
    {
      // Sono collassato, mostro l'immagine di espansione
      this.ExpandImg.style.display = "";
      this.ChildImg.style.display = "none";
      exp = false;
    }
    else if (this.AlreadyExpanded && this.Expanded && n > 0)
    {
      // Sono espanso, mostro l'immagine di collassamento
      this.ExpandImg.style.display = "";
      this.ChildImg.style.display = "none";
      exp = true;
    }
    else
    {
      // Altrimenti nascondo l'immagine di espansione e mostro quella del figlio singolo
      this.ExpandImg.style.display = "none";
      this.ChildImg.style.display = "";
      exp = false;
    }
    //
    var des = "";       // Desinenza da usare per il nome dell'immagine in seattle
    if (RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen"))
    {
      // Se sono un nodo radice, uso l'icona F
      if (!this.ParentNode)
        des = "f";
      //
      // Se sono l'ultimo, uso l'icona
      if (this.IsLastChild())
        des += "l";
      //
      // Se sono l'ultimo nodo radice devo usare l'icona FL... ma l'icona FL con il + (nodo non espanso) non c'e'
      // In questo caso uso l'icona F (radice) che va bene lo stesso
      if (des == "fl")
        des = "f";
    }
    //
    // In base allo stato (espanso o meno) mostro i miei figli
    if (!this.WaitForChildren)
    {
      // Se non ho figli non eseguo nessuna animazione ma vado subito nello stato finale
      var fx = new GFX("tree", exp, this.ChildrenBox, (n<=0)||(!this.ExecuteGFX), null, this.ParentTree.ExpandAnimDef);
      RD3_GFXManager.AddEffect(fx);
    }
    //
    // In base allo stato scelgo l'immagine di espansione giusta
    if (exp)
      this.ExpandImg.src = RD3_Glb.GetImgSrc("images/tm" + des + ".gif");
    else
      this.ExpandImg.src = RD3_Glb.GetImgSrc("images/tp" + des + ".gif");
    //
    if (!this.WaitForChildren)
      this.ExpandImg.className = "tree-exp-img";
    //
    // Gestisco la desinenza anche per l'immagine figlia
    this.ChildImg.src = RD3_Glb.GetImgSrc("images/tn" + des + ".gif");
  }
}


// **********************************************************************
// Lo stato del flag mosta check box dell'albero e' cambiato:
// questo metodo aggiorna la visualizzazione di questo nodo
// **********************************************************************
TreeNode.prototype.MultipleSelectionChanged = function()
{
  // Mostro o meno i miei checkbox
  this.SetCanCheck(this.CanBeChecked);
  //
  // Passo il messaggio ai miei figli
  var n = this.Nodes.length;
  for (var i=0; i<n; i++)
  {
    this.Nodes[i].MultipleSelectionChanged();
  }
  //
  // Se sono passato da multi-selezione a non multi-selezione
  // perdo la selezione corrente
  if (!this.ParentTree.MultipleSelection)
  	this.SetNodeClass(false, true);
}


// **********************************************************************
// Metodo che svuota la cache del nodo
// **********************************************************************
TreeNode.prototype.ResetCache = function()
{
	// Se sono nel mobile e il nodo attivo e' mio figlio, mi collasso
	if (RD3_Glb.IsMobile())
	{
		var n = this.ParentTree.SelectedNode;
		while (n && n!=this)
		{
			n = n.ParentNode;
		}
		if (n==this)
		{
			// Ero io o mio figlio
			this.SetExpanded(false, true);
		}
	}
	//
  // Svuoto la cache dei miei figli
  this.RemoveChildren();
  //
  this.Nodes.splice(0, this.Nodes.length);
}


// **********************************************************************
// Restituisce l'oggetto Dom a cui associare un Popup Menu
// **********************************************************************
TreeNode.prototype.GetDOMObj = function()
{
  return this.NodeText?this.NodeText:this.CaptionBox;
}


// *****************************************************************************
// Restituisce l'oggetto visuale su cui deve venire applicata l'HL per il drag
// *****************************************************************************
TreeNode.prototype.DropElement = function()
{
  return this.NodeContent?this.NodeContent:this.CaptionBox;
}


// ********************************************************************************
// Compone la lista di drop della box
// ********************************************************************************
TreeNode.prototype.ComputeDropList = function(list, dragobj)
{
  if (!this.Realized)
    return;
  //
  // Questa box vuole essere droppata da dragobj?
  // Si da per scontato che l'albero abbia DragDrop attivo (lo controlla lui)
  if (this!=dragobj)
  {
    list.push(this);
    //
    var drObj = (this.NodeContent ? this.NodeContent : this.CaptionBox);
    //
    // Calcolo le coordinate assolute...
    this.AbsLeft = RD3_Glb.GetScreenLeft(drObj, true);
    this.AbsTop = RD3_Glb.GetScreenTop(drObj, true);
    if (!RD3_Glb.IsIE(10, false))
    {
      // Sugli altri browser devo tenere conto della scrollbar...
      this.AbsLeft -= this.ParentTree.ContentBox.scrollLeft;
      this.AbsTop -= this.ParentTree.ContentBox.scrollTop;
    }
    //
    this.AbsRight = this.AbsLeft + drObj.offsetWidth - 1;
    this.AbsBottom = this.AbsTop + drObj.offsetHeight - 1;
  }
  //
  // ora i sottonodi
  if (this.Expanded && this.Nodes)
  {
    var n = this.Nodes.length;
    for (var i = 0; i<n; i++)
    {
      this.Nodes[i].ComputeDropList(list, dragobj);
    }
  }
}


// **********************************************************************
// Ritorna il frame che contiene il nodo
// **********************************************************************
TreeNode.prototype.GetParentFrame = function()
{
  return this.ParentTree;
}


// **********************************************************************
// Abilita o disabilita il nodo
// **********************************************************************
TreeNode.prototype.SetEnabled = function(value)
{
  if (this.CheckBox)
    this.CheckBox.disabled = !value;
  //
  if (this.CaptionBox)
    RD3_Glb.ApplyCursor(this.CaptionBox, value?"pointer":"default");
  //
  // Aggiorno tutti i sottonodi
  var n = this.Nodes.length;
  for (var i = 0; i<n; i++)
  {
    this.Nodes[i].SetEnabled(value);
  }
}

// **********************************************************************
// Ritorna TRUE se il nodo e' l'ultimo nella collection del padre
// **********************************************************************
TreeNode.prototype.IsLastChild = function()
{
  if (this.ParentNode)
  {
    if (this.ParentNode.Nodes && this==this.ParentNode.Nodes[this.ParentNode.Nodes.length-1])
      return true;
  }
  else if (this.ParentTree.RootNodes && this==this.ParentTree.RootNodes[this.ParentTree.RootNodes.length-1])
    return true;
  //
  return false;
}


// ****************************************************************************
// Usato nel D&D: restituisce l'offset left da usare durante il posizionamento
// tenendo conto delle scrollbar e del browser
// ****************************************************************************
TreeNode.prototype.AccountOverFlowX = function()
{
  // Se IE non devo tenere conto delle scrollbar, sugli altri browser si
  return RD3_Glb.IsIE(10, false) ? 0 : this.ParentTree.ContentBox.scrollLeft;
}


// ****************************************************************************
// Usato nel D&D: restituisce l'offset top da usare durante il posizionamento
// tenendo conto delle scrollbar e del browser
// ****************************************************************************
TreeNode.prototype.AccountOverFlowY = function()
{
  // Se IE non devo tenere conto delle scrollbar, sugli altri browser si
  return RD3_Glb.IsIE(10, false) ? 0 : this.ParentTree.ContentBox.scrollTop;
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
TreeNode.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "" || RD3_Glb.IsMobile())
    return false;
  //
  tip.SetObj(this.NodeBox);
  tip.SetTitle(this.Caption);
  tip.SetText(this.Tooltip);
  tip.SetAutoAnchor(true);
  tip.SetPosition(2);
  return true;
}


// ********************************************************************************
// Il comando e' stato toccato dall'utente
// ********************************************************************************
TreeNode.prototype.OnTouchDown= function(evento)
{ 
	if (!this.ParentTree.Expanding)
	{
		if (this.ParentTree.Enabled)
			this.ParentTree.ActiveNode = this;
		this.SetNodeClass(false, true);
		return true;
	}
}

// ********************************************************************************
// Il comando e' stato smesso di toccare dall'utente
// ********************************************************************************
TreeNode.prototype.OnTouchUp= function(evento, click)
{ 
	if (!this.ParentTree.Expanding)
	{
		if (click && this.ParentTree.Enabled)
		{
			if (this.CanBeChecked && this.ParentTree.MultipleSelection)
				this.OnCheckNode(evento);
			else if (!this.AlreadyExpanded || this.Nodes.length>0)
				this.OnExpandNode(evento);
			else
				this.OnClickNode(evento);
      //
      // Anche qui tolgo l'evidenziazione, ci pensera' l'activate
      this.ParentTree.ActiveNode = null;
      this.SetNodeClass(false, true);	  
		}
		else
		{
			this.ParentTree.ActiveNode = null;
			this.SetNodeClass(false, true);	
		}
		return true;
	}
}


// ********************************************************************************
// Elimina la classe hover da tutto il menu', escluso l'oggetto indicato
// ********************************************************************************
TreeNode.prototype.SetNodeClass= function(mycmd, onlyNode)
{ 
	var x = null;
	//
	// Se devo cambiare solo il nodo corrente (io) prendo solo me stesso
	if (onlyNode)
	  x = new Array(this);
	else if (mycmd)
		x = this.Nodes;
	else if (this.ParentNode)
		x = this.ParentNode.Nodes;
	else
		x = this.ParentTree.RootNodes;
	//
	var n = x.length;
	for (var i=0; i<n; i++)
	{
		var mb = x[i].CaptionBox;
		if (mb)
		{
			if (this.CanBeChecked && this.ParentTree.MultipleSelection)
			{
				// Se ci sono i check, non posso impostare la classe qui
			}
			else
			{
				if (x[i]==this.ParentTree.ActiveNode)
	    		RD3_Glb.AddClass(mb, "tree-node-hover");
				else
	    		RD3_Glb.RemoveClass(mb, "tree-node-hover");
	    }
    	//
    	x[i].HandleExpandable();
    }
	}
}


// ********************************************************************************
// Torna true se questo elemento e' quello attivo nell'albero
// ********************************************************************************
TreeNode.prototype.IsActiveNode= function()
{ 
	return this.ParentTree.ActiveNode == this;
}


// ********************************************************************************
// Carica la lista successiva in caso di menu' mobile
// ********************************************************************************
TreeNode.prototype.LoadNestedNode= function(flInner, immediate, recursive)
{ 
  var parentContext = this;
  //
	// Creo il div del menu' se non lo avevo ancora fatto.
	if (flInner && !this.NodeBox)
	{
		this.NodeBox = document.createElement("div");
    this.NodeBox.setAttribute("id", this.Identifier+":box");
    this.NodeBox.className = "tree-node-container";
    this.ParentTree.ContentBox.appendChild(this.NodeBox);
    if (this.Ea == null)
      this.Ea = function(ev) { parentContext.OnEndAnimation(ev); };
    //
    // Dico ai miei nodi di realizzarsi la'
   	var n = this.Nodes.length;
		for (var i = 0; i < n; i++)
		  this.Nodes[i].Realize(this.NodeBox);
		//
		var btncnt = this.ParentTree.WebForm.GetFirstToolbar();
		if (btncnt)
		{
			var supp = btncnt.className.indexOf("popover")>-1;
			//
			// Creo il bottone per tornare indietro
			this.BackArrowImg = document.createElement("div");
			this.BackArrowImg.setAttribute("id", this.Identifier+":bka");
			this.BackArrowImg.className = supp?"popover-back-button-arrow":"menu-back-button-arrow";
			if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        this.BackArrowImg.ontouchend = function(ev) { parentContext.OnBack(ev); };
      else
			  this.BackArrowImg.onclick = function(ev) { parentContext.OnBack(ev); };
			btncnt.appendChild(this.BackArrowImg);
			//
			this.BackImg = document.createElement("div");
			this.BackImg.setAttribute("id", this.Identifier+":bk");
			this.BackImg.className = supp?"popover-back-button":"menu-back-button";
			//
			var obj = RD3_KBManager.GetObject(btncnt, true);
			if (obj && obj.Caption)
				this.BackImg.innerHTML = this.ParentNode?this.ParentNode.Caption:obj.Caption;
			//
			if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        this.BackImg.ontouchend = function(ev) { parentContext.OnBack(ev); };
      else
			  this.BackImg.onclick = function(ev) { parentContext.OnBack(ev); };
			btncnt.appendChild(this.BackImg);
		}
  }
  //
  // Ora prendo il menu'box del mio parent, il mio e li sposto verso sinistra
  var boxp = (this.ParentNode)?this.ParentNode.NodeBox:this.ParentTree.NodeBox;
  var boxn = this.NodeBox;
  //
  if (boxn && boxp)
  {
    if (this.ParentNode && this.ParentNode.MobExpanding)
      this.ParentNode.EndMOBAnimation();
    this.MobExpanding = true;
    //
    if (this.Ea)
      RD3_Glb.AddEndTransaction(this.NodeBox, this.Ea, false);
    //
	  // Posiziono i due foglietti
	  boxn.style.display = "";
	  boxp.style.display = "";
	  RD3_Glb.SetTransitionProperty(boxn, "-webkit-transform");
	  RD3_Glb.SetTransitionProperty(boxp, "-webkit-transform");
	  RD3_Glb.SetTransitionDuration(boxn, "0ms");
	  RD3_Glb.SetTransitionDuration(boxp, "0ms");
	  RD3_Glb.SetTransitionTimingFunction(boxn, "ease");
	  RD3_Glb.SetTransitionTimingFunction(boxp, "ease");
	  this.ParentTree.Expanding = true;	
	  //
	  var w = this.ParentTree.ContentBox.offsetWidth;
	  //
	  var p1ini = flInner?w:0;
	  var p2ini = flInner?0:-w;
	  //
	  var p1fin = flInner?0:w;
	  var p2fin = flInner?-w:0;
	  //
	  var y1 = RD3_Glb.TranslateY(boxn);
	  var y2 = RD3_Glb.TranslateY(boxp);
	  //
	  RD3_Glb.SetTransform(boxn, "translate3d("+p1ini+"px,"+y1+"px,0px)");
  	RD3_Glb.SetTransform(boxp, "translate3d("+p2ini+"px,"+y2+"px,0px)");
		//
		var duration = (immediate && recursive ? 0 : 250);
    var sc = "";
	  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ boxn.id+"'), '"+duration+"ms');";
	  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ boxp.id+"'), '"+duration+"ms');";
	  sc += "RD3_Glb.SetTransform(document.getElementById('"+ boxn.id+"'), 'translate3d("+p1fin+"px,"+y1+"px,0px)');";
	  sc += "RD3_Glb.SetTransform(document.getElementById('"+ boxp.id+"'), 'translate3d("+p2fin+"px,"+y2+"px,0px)');";
	  //
	  // Animo i bottoni
	  if (this.BackImg)
	  {
	  	var sepp = (this.ParentNode)?this.ParentNode.BackImg:null;
	  	var sepi = (this.ParentNode)?this.ParentNode.BackArrowImg:null;
      //
      // Se il nodo ha un parent sposta il suo backbutton, se non ha parent deve vedere se c'e' il backbutton di form (o di menu)  e muovere quello
      if (!this.ParentNode) 
      {
        var parentTool = this.ParentTree.WebForm.GetFirstToolbar();
        if (RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton && RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton.parentNode == parentTool && RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton.style.display !== "none") 
        {
          sepp = RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton;
        }
        else if (this.ParentTree.WebForm.BackButtonCnt && this.ParentTree.WebForm.BackButtonCnt.parentNode == parentTool) 
        {
          sepp = this.ParentTree.WebForm.BackButtonCnt;
        }
      }
  		//
  		if (sepp)
  			RD3_Glb.SetTransform(sepp, "translate3d("+p2fin+"px,0px,0px)");
  		if (sepi)
  			RD3_Glb.SetTransform(sepi, "translate3d("+p2fin+"px,0px,0px) rotate(45deg)");
	  	//
	  	var p3 = this.BackImg.parentNode.offsetWidth/2-this.BackImg.offsetWidth/2;
	  	var p4 = 0;
	  	var p5 = 1;
	  	if (flInner)
	  	{
	  		RD3_Glb.SetTransform(this.BackImg, "translate3d("+p3+"px,0px,0px)");
	  		RD3_Glb.SetTransitionProperty(this.BackImg, "-webkit-transform, opacity");
	  		RD3_Glb.SetTransform(this.BackArrowImg, "translate3d("+p3+"px,0px,0px) rotate(45deg)");
	  		RD3_Glb.SetTransitionProperty(this.BackArrowImg, "-webkit-transform ,opacity");
	  	}
	  	else
	  	{
	  		p4 = p3;
	  		p5 = 0;
	  	}
	  	//
	  	this.BackImg.style.display = "";
	  	this.BackArrowImg.style.display = "";
	  	//
	  	sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.BackArrowImg.id+"'), '"+duration+"ms');";
	  	sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.BackArrowImg.id+"'), 'translate3d("+p4+"px,0px,0px) rotate(45deg)');";
	  	sc += "document.getElementById('"+ this.BackArrowImg.id+"').style.opacity="+p5+";";
	  	sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.BackImg.id+"'), '"+duration+"ms');";
	  	sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.BackImg.id+"'), 'translate3d("+p4+"px,0px,0px)');";
	  	sc += "document.getElementById('"+ this.BackImg.id+"').style.opacity="+p5+";";
	  }
	  //
	  // Disabilito la scrollbar per 300 ms
		if (this.ParentTree.IDScroll && duration!=0)
    	this.ParentTree.IDScroll.SetDisableTimer(300);
   	//
	  if (immediate)
	  {
	  	eval(sc);
	  	this.OnEndAnimation();
	  }
	  else
	  {
	    this.MOBFunct = sc;
			this.MOBAnimTimer = window.setTimeout(sc,30);
		}
		//
		// regolo lo scroller sul nuovo menu'
		// ma solo se io appartengo ad una serie di nodi attualmente davvero espansi
		// e visibili a video
		var pn = this.ParentNode;
		var ok = true;
		while (ok && pn)
		{
			if (!pn.Expanded)
				ok = false;
			pn = pn.ParentNode;
		}
		if (ok)
			this.ParentTree.IDScroll.SetBox(flInner?boxn:boxp);
	  //
	  if (recursive)
	  {
	    var n = this.Nodes.length;
  		for (var i = 0; i < n; i++)
  		{
  		  if (this.Nodes[i].ExpandSkipped && this.Nodes[i].Expanded)
    	    this.Nodes[i].SetExpanded(this.Nodes[i].Expanded, immediate, true);
  		}
	  }
	}
}


// ********************************************************************************
// Gestore evento di BACK del BOTTONE
// ********************************************************************************
TreeNode.prototype.OnBack= function(evento)
{ 
  // Torno al livello inferiore
  this.OnExpandNode(evento);
}


// ********************************************************************************
// Gestore evento di BACK del BOTTONE
// ********************************************************************************
TreeNode.prototype.OnEndAnimation= function(evento)
{ 
  if (RD3_Glb.GetTransitionDuration(this.NodeBox)=="0ms" && evento)
    return;
  //
	if (this.Expanded)
	{
		// Mi hanno espanso, nascondo i figli di mio padre, cioe' il box in cui sono io ora
		if (this.ParentNode)
			this.ParentNode.NodeBox.style.display = "none";
		else
			this.ParentTree.NodeBox.style.display = "none";
	}
	else
	{
		// mi hanno collassato, quindi nascondo i miei nodi figli
		this.ParentTree.ActiveNode = null;
		this.SetNodeClass(false, true);
		this.NodeBox.style.display = "none";
		if (this.BackImg)
			this.BackImg.style.display = "none";
		if (this.BackArrowImg)
			this.BackArrowImg.style.display = "none";
	}
	//
	// Solo alla fine posso impostare la caption dell'applicazione
	// in quando adesso i bottoni sono tutti nascosti o mostrati
	if (this.Realized && this.BackImg)
	{
		var c = (this.Expanded)?this.Caption:this.BackImg.textContent;
		var obj = RD3_KBManager.GetObject(this.BackImg.parentNode, true);
		if (obj && obj.SetWebCaption)
		{
			obj.SetWebCaption(c);
	    obj.AdaptToolbarLayout();
		}
		else if (obj && obj.SetCaption)
			obj.SetCaption(c);
	}
	//
	this.ParentTree.Expanding = false;
	this.MobExpanding = false;
	this.MOBAnimTimer = null;
	this.MOBFunct = null;
  if (this.Ea)
  	RD3_Glb.RemoveEndTransaction(this.NodeBox, this.Ea, false);
}

TreeNode.prototype.EndMOBAnimation= function(evento)
{
  if (!this.MobExpanding)
    return; 
  //
  // Anticipo l'esecuzione se era posticipata
  if (this.MOBAnimTimer)
  {
    window.clearTimeout(this.MOBAnimTimer);
    this.MOBAnimTimer = null;
    if (this.MOBFunct)
      eval(this.MOBFunct);
    this.MOBFunct = null;
  }
  //
  // Adesso annullo un'eventuale animazione in corso
  var boxp = (this.ParentNode)?this.ParentNode.NodeBox:this.ParentTree.NodeBox;
  var boxn = this.NodeBox;
  if (boxn && boxp)
  {
    RD3_Glb.SetTransitionDuration(boxn, "0ms");
	  RD3_Glb.SetTransitionDuration(boxp, "0ms");
	  //
	  if (this.BackImg)
	  {
	  	RD3_Glb.SetTransitionDuration(this.BackArrowImg, '0ms');
	  	RD3_Glb.SetTransitionDuration(this.BackImg, '0ms');
	  }
	  //
	  this.OnEndAnimation();
  }
}
// **************************************************************************************************
// Nasconde o mostra i pulsanti di Back dell'albero nel caso mobile (chiamata da Tree::ChangeExpose)
// **************************************************************************************************
TreeNode.prototype.ChangeExpose= function(exposed)
{ 
  if (this.Expanded)
  {
   if (this.BackImg)
			this.BackImg.style.display = exposed ? "" : "none";
	 if (this.BackArrowImg)
			this.BackArrowImg.style.display = exposed ? "" : "none";
	  //
	  var n = this.Nodes.length;
	  for (var i=0; i<n; i++)
	  {
	    this.Nodes[i].ChangeExpose(exposed);
	  }
	}
}


// *******************************************************************
// Chiamato quando cambia il colore di accento
// *******************************************************************
TreeNode.prototype.AccentColorChanged = function(reg, newc) 
{
	// Modifico lo stile di tutti i comandi se sono selezionati
	if (this.Nodes)
	{
		var n = this.Nodes.length;
		for (var i=0; i<n; i++)
			this.Nodes[i].AccentColorChanged(reg, newc);
	}
	//
	if (this.CaptionBox)
	{
		var s = this.CaptionBox.style.cssText;
	  var ns = s.replace(reg,newc);
	  if (s!=ns)
	  	this.CaptionBox.style.cssText = ns;
	}
}

// **************************************************************************************************
// Collassa l'intero ramo dell'albero
// **************************************************************************************************
TreeNode.prototype.CollapseBranch= function()
{ 
  if (this.Expanded)
  {
    // Per prima cosa collasso tutti i miei figli: in questo modo il collassamento avviene deep-first
    var n = this.Nodes.length;
    for (var i=0; i<n; i++)
	    this.Nodes[i].CollapseBranch();
	  //
	  // Mi collasso in maniera immediata
	  this.SetExpanded(false, true, false, true);
	}
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
TreeNode.prototype.OnAdaptRetina = function(w, h, par)
{
  if (this.CaptionBox)
    this.CaptionBox.style.backgroundSize = par.replace("IMGSIZE", w+"px "+h+"px");
}

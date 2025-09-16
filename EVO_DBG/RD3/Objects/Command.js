// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Command: gestisce un comando o command set
// di tutti i tipi (menu', toolbar, popup...)
// ************************************************

function Command()
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = "";         // Identificatore del comando o command set
  this.FormIndex = 0;           // Indice della form a cui appartiene il command set (0=globale)
  this.Caption = "";            // Titolo del command set o comando
  this.Tooltip = "";            // Tooltip del command set o comando
  this.Index = 0;               // Indice del comando o command set all'interno del parent
  this.FKNum = 0;               // Numero di tasto funzione per attivare questo comando
  this.Expanded = false;        // Se Vero indica che il command set e' espanso
  this.Level = 1;               // Livello del comando o command set
  this.IsMenu = true;           // Indica che questo command set e' parte del menu' laterale
  this.IsToolbar = false;       // Indica che questo command set genera una toolbar 
  this.ShowNames = false;       // Se vero indica che nella toolbar occorre mostrare il nome dei comandi e non solo l'icona
  this.RequireConf = false;     // Se vero indica che prima di inviare il comando al server occorre chiedere conferma all'utente
  this.ConfText = "";           // Testo della richiesta di conferma (se RequireConf = true)
  this.ToolName = "";           // Nome da mostrare nella toolbar quando ShowNames = true
  this.Image = "";              // Icona del command o command set
  this.CommandCode = "";        // Codice del comando
  this.Enabled = true;          // Comando / Command set abilitato
  this.Visible = true;          // Comando / Command set visibile
  this.ToolCont = -1;           // -1 = toolbar globale, 0 = toolbar di form, > 0 = toolbar di frame
  this.UseHL = false;           // Hilight della toolbar?
  this.FormList = false;        // Form List?
  this.Accell = "";             // Tasto Acceleratore?
  this.CommandCanDrag = false;  // Il comando puo' essere draggato?
  this.CommandCanDrop = false;  // Il comando puo' accettare Drag?
  this.Badge = "";              // Badge del comando
  this.ClassName = "";          // Classe del comando
  //this.Width = 0;             // Larghezza calcolata da IN.DE solo per button bar
  //
  // Oggetti secondari gestiti da questo oggetto di modello
  this.Commands = new Array();  // Elenco dei comandi o command set di livello successivo
  //
  // Variabili per la gestione di questo oggetto di modello
  this.BBParent = null;               // Oggetto Button Bar padre di questo command set durante la visualizzazione in Button Bar
  this.ToolTimer = null;              // 
  this.IsClosing = false;             // true se c'e' una animazione di chiusura su questo menu popup
  this.Gfx = null;                    // Animazione attualmente attiva sul menu
  this.ParentCmdSet = null;           // CmdSet Padre
  this.RecalcSeparatorLayout = false; // True se devo ricalcolare la visibilita' dei separatori figli perche' la visibilita' di uno dei comandi e' cambiata
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo comando o command set
  this.ClickEventDef = RD3_Glb.EVENT_URGENT;
  this.ExpandEventDef = RD3_Glb.EVENT_CLIENTSIDE;
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi alla visualizzazione in Menu
  this.MyBox = null;          // Div che contiene tutto il command set / command
  this.CmdBox = null;         // Div che contiene la riga singola (testata del command set oppure command)
  this.MenuBox = null;        // Div che contiene tutti gli altri comandi
  this.BranchImg = null;      // Immagine che rappresenta il ramo dell'albero dei comandi
  this.CommandLink = null;    // Link del comando
  this.CommandImg = null;     // immagine relativa al comando / command set
  this.CommandImgDX = null;   // immagine relativa al comando / command set e posizionata a destra
  this.CommandText = null;    // nodo testuale del comando
  this.MenuSep = null;        // Separatore dal menu' precedente (solo menu' primo livello)
  this.MenuSepImg = null;     // Immagine nel separatore (solo menu' primo livello)
  this.BadgeObj = null;       // Badge del comando
  //
  // Oggetti visuali relativi alla visualizzazione in Toolbar
  this.MyToolBox = null;  // Span contenitore del comando o del command set
  this.ToolImg = null;    // Immagine del comando
  this.ToolText = null;   // Span che coniene il nome di un comando in toolbar
  //
  // Oggetti visuali relativi alla visualizzazione in Button Bar
  this.ButtonBox = null;  // Box contenitore del comando o dei comandi figli nella renderizzazione in ButtonBar
  this.Button = null;     // Pulsante realizzato in Button bar
  //
  // Oggetti visuali relativi alla visualizzazione in popup
  this.PopupContainerBox = null; // Box che contiene l'intero menu' popup
  this.PopupItemBox = null;      // Box (tr) che contiene l'item della singola linea in popup
  this.PopupIconCell = null;     // td che contiene l'icona della riga del menu'
  this.PopupTextCell = null;     // td che contiene l'icona della caption del menu'
  this.PopupText = null;         // Span che contiene il testo
  this.PopupImageBox = null;     // Icona del menu' popup
  //
  this.PopupTimer = 0;           // Timer per l'apertura dei popup di secondo livello
  //this.DragMenu = true;        // E' stato fatto un drag sul menu o sulla toolbar?
  //this.CallBackFunction = null;// Eventuale funzione callback da chiamare se il comando e' lato client
}


// *******************************************************************
// Inizializza questo CommandList leggendo i dati da un nodo <cmh> XML
// *******************************************************************
Command.prototype.LoadFromXml = function(node) 
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
      case "cmd":
      {
        var cmd = new Command();
        cmd.LoadFromXml(objnode);
         //
         // Memorizzo il comando in cui e' contenuto
        cmd.ParentCmdSet = this;
        //
        // "spengo" IsMenu o IsToolbar se io non li ho
        cmd.IsToolbar = (cmd.IsToolbar && this.IsToolbar);
        cmd.IsMenu = (cmd.IsMenu && this.IsMenu);
        //
        // Informo il nuovo comando figlio della form per cui valgo io
        cmd.FormIndex = this.FormIndex;
        //
        this.Commands.push(cmd);
      	//
      	// Se il padre (io) e' gia' stato realizzato realizzo subito il nuovo figlio
      	if (this.Realized)
        {
      	  cmd.Realize(this.MenuBox, this.MyToolBox);
          //
          // Se appartiene ad una form, devo riadattare la toolbar
          if (cmd.FormIndex)
          {
            var f = RD3_DesktopManager.ObjectMap["frm:"+cmd.FormIndex];
            if (f)
              f.RecalcCommands = true;
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
Command.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta'
  this.LoadFromXml(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
Command.prototype.LoadProperties = function(node)
{
  // Ciclo su tutti gli attributi del nodo
  var attrlist = node.attributes;
  var n = attrlist.length;
  //
  for (var i=0; i<n; i++)
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    //
    switch(nome)
    {
      case "frm": this.SetFormIndex(parseInt(attrnode.nodeValue)); break;
      case "cap": this.SetCaption(attrnode.nodeValue); break;
      case "tip": this.SetTooltip(attrnode.nodeValue); break;
      case "idx": this.SetIndex(attrnode.nodeValue); break;
      case "exp": this.SetExpanded(attrnode.nodeValue=="1"); break;
      case "lev": this.SetLevel(parseInt(attrnode.nodeValue)); break;
      case "ism": this.SetMenu(attrnode.nodeValue=="1"); break;
      case "ist": this.SetToolbar(attrnode.nodeValue=="1"); break;
      case "shn": this.SetShowNames(attrnode.nodeValue=="1"); break;
      case "rqc": this.SetRequireConfirmation(attrnode.nodeValue=="1"); break;
      case "rqt": this.SetConfirmationText(attrnode.nodeValue); break;
      case "tnm": this.SetToolName(attrnode.nodeValue); break;
      case "img": this.SetImage(attrnode.nodeValue); break;
      case "ena": this.SetEnabled(attrnode.nodeValue == "1"); break;
      case "vis": this.SetVisible(attrnode.nodeValue == "1"); break;
      case "cnt": this.SetToolCont(parseInt(attrnode.nodeValue)); break;
      case "fkn": this.SetFKNum(parseInt(attrnode.nodeValue)); break;
      case "cco": this.SetCommandCode(attrnode.nodeValue); break;
      case "wid": this.SetWidth(parseInt(attrnode.nodeValue)); break;
      case "thl": this.SetUseHL(attrnode.nodeValue=="1"); break;
      case "fli": this.SetFormList(attrnode.nodeValue=="1"); break;
      case "acc": this.SetAccell(attrnode.nodeValue); break;
      case "cdg": this.SetCanDrag(attrnode.nodeValue=="1"); break;
      case "cdp": this.SetCanDrop(attrnode.nodeValue=="1"); break;
      case "bdg": this.SetBadge(attrnode.nodeValue); break;
      case "cln": this.SetClassName(attrnode.nodeValue); break;
      case "del": this.DeleteCommand(); break;

      case "clk": this.ClickEventDef = parseInt(attrnode.nodeValue); break;
      case "exe": this.ExpandEventDef = parseInt(attrnode.nodeValue); break;
      
      case "exa": this.ExpandAnimDef = valore; break;
      case "poa": this.PopupAnimDef = valore; break;
      case "cmds":this.IsCmdSet = true; break;
      
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
Command.prototype.SetFormIndex= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.FormIndex = value;
}

Command.prototype.SetIndex= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.Index = value;
}

Command.prototype.SetFKNum= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.FKNum = value;
}

Command.prototype.SetAccell= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.Accell = value;
}

Command.prototype.SetFormList= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.FormList = value;
}

Command.prototype.SetWidth= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.Width = value;
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsMobile())
    this.Width = value*1.3;
}

Command.prototype.SetUseHL= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.UseHL = value;
}

Command.prototype.SetFKNum= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.FKNum = value;
}

Command.prototype.SetLevel= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.Level = value;
}

Command.prototype.SetMenu= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.IsMenu = value;
}

Command.prototype.SetToolbar= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.IsToolbar = value;
}

Command.prototype.SetShowNames= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.ShowNames = value;
}

Command.prototype.SetRequireConfirmation= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.RequireConf = value;
}

Command.prototype.SetConfirmationText= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.ConfText = value;
}

Command.prototype.SetToolCont= function(value) 
{
  if (value!=undefined)
    this.ToolCont = value;
  //
  // Questa proprieta' puo' cambiare anche dopo, in quanto e' quando il pannello
  // si apre che il command set viene a sapere che gli appartiene
  if (this.Realized)
  {
    this.ActiveFormChanged();
  }
}

Command.prototype.SetToolName= function(value) 
{
  this.ToolName = value;
  //
  if (this.Realized && !this.IsSeparator())
  {
    // Se sono in una toolbar e devo mostrare la caption
    if (this.ToolText != null)
      this.ToolText.nodeValue = this.Caption;
  }
}

Command.prototype.SetCommandCode= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.CommandCode = value;
}


Command.prototype.SetCaption= function(value) 
{
  var old = this.Caption;
  if (value!=undefined)
    this.Caption = value;
  //
  if (this.Realized && !this.IsSeparator())
  {
    var s = this.Caption;
    if (this.ShowAccell())
    {
      var p = s.toUpperCase().indexOf(this.Accell);
      if (p>-1)
        s = s.substr(0,p)+"<u>"+s.substr(p,1)+"</u>"+s.substr(p+1);
    }
    //
    if (this.CommandText)
      this.CommandText.nodeValue = this.Caption;
    else if (this.MyBox)
      this.MyBox.innerHTML = s;
    //
    // Gestisco la Button Bar
    if (this.Button)
      this.Button.value = this.Caption;
    //
    if (this.PopupText)
      this.PopupText.innerHTML = s;
    //
    // Gestisco i bottoni senza immagine
    if (this.Image == "" && this.ToolImg)
    {
      this.ToolImg.value = this.Caption;
      //
      // E' stato cambiato il testo di un comando. Se e' un comando di toolbar di form
      // recupero la form e se la sua toolbar e' allineata a destra, le dico di ricalcolare 
      // il layout alla fine
      if (this.ParentCmdSet && this.ParentCmdSet.IsToolbar && this.ParentCmdSet.ToolCont==0 && this.ParentCmdSet.FormIndex)
      {
        var f = RD3_DesktopManager.ObjectMap["frm:"+this.ParentCmdSet.FormIndex];
        if (f)
          f.AdaptToolbar = true;
      }
    }
    //
    // Se sono un CmdSet di menu' ed e' cambiato il testo, devo riadattarmi
    if (old != this.Caption && this.MyBox)
      this.AdaptLayout();
  }
}

Command.prototype.SetTooltip= function(value) 
{
  if (value!=undefined)
    this.Tooltip = value;
  //
  if (this.Realized && !this.IsSeparator())
  {
    var s = RD3_KBManager.GetFKTip(this.FKNum);
    if (s=="" && this.CommandCode!="")
      s = " ("+ this.CommandCode+")";
    //
    if (this.CommandLink)
      RD3_TooltipManager.SetObjTitle(this.CommandLink, this.Tooltip+s);
    //
    if (this.MyToolBox)
      RD3_TooltipManager.SetObjTitle(this.MyToolBox, this.Tooltip+s);
    //
    if (this.Button)
      RD3_TooltipManager.SetObjTitle(this.Button, this.Tooltip+s);
    //
    if (this.PopupText)
      RD3_TooltipManager.SetObjTitle(this.PopupText, this.Tooltip+s);
    //
    // Gestisco i bottoni senza immagine
    if (this.Image == "" && this.ToolImg)
      RD3_TooltipManager.SetObjTitle(this.ToolImg, this.Tooltip+s);
  }
}

Command.prototype.SetBadge= function(value) 
{
  if (value!=undefined)
    this.Badge = value;
  //
  if (this.Realized && !this.IsSeparator() && this.ShowBadge())
  {
    if (this.Badge=="")
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
        this.BadgeObj = document.createElement("DIV");
        this.BadgeObj.className = (RD3_Glb.IsMobile() ? "badge-grey": "badge-red badge-min badge-right");
        this.BadgeObj.style.position = (RD3_Glb.IsMobile() ? "absolute": "static");
        //
        if (!RD3_Glb.IsMobile())
        {
          if (this.CmdBox.firstChild)
            this.CmdBox.insertBefore(this.BadgeObj, this.CmdBox.firstChild);
          else
            this.CmdBox.appendChild(this.BadgeObj);
        }
        else
        {
          this.MyBox.parentNode.insertBefore(this.BadgeObj, this.MyBox);
        }
      }
      //
      if (RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.SideMenuWidth>0)
      {
        var lft = RD3_DesktopManager.WebEntryPoint.SideMenuWidth - 10 - RD3_Glb.GetBadgeWidth(this.Badge, "grey");
        if (this.IsCmdSet)
          lft = lft - 24;
        if (this.Level>1)
          lft = lft - 4;
        //
        this.BadgeObj.style.left = lft + "px";
        //
        this.BadgeObj.style.marginTop = "10px";
      }
      //
      this.BadgeObj.innerHTML = this.Badge;
      //
      // adesso tocca alla visibilita': se sono visibile il Badge e' visibile, altrimenti e' nascosto
      // poi tocchera' alla SetVisible renderlo visibile quando il comando verra' mostrato
      this.BadgeObj.style.display = this.IsVisible() ? "" : "none";
    }
  }
}

Command.prototype.ShowBadge= function(value) 
{
  var supportsBadge = false;
  //
  // Su mobile tutti i menu supportano il badge
  if (RD3_Glb.IsMobile())
    supportsBadge = true;
  //
  // Su WebApp solo i menu supportano il badge
  if (this.IsMenu && !RD3_Glb.IsMobile() && !this.IsCmdSet)
    supportsBadge = true;
  //
  if (RD3_Glb.IsMobile() && this.IsCmdSet && this.ShowGroupedMenu())
    supportsBadge = false;
  //
  if (!this.IsMenu)
    supportsBadge = false;
  //
  return supportsBadge;
}

Command.prototype.SetClassName = function (value) 
{
  var old = this.ClassName;
  if (value != undefined)
    this.ClassName = value;
  //
  if (this.Realized && (old != this.ClassName || !value))
  {
    // nel caso di SetClassName() non devo rimuovere il vecchio valore (che e' uguale all'attuale)
    if (old && this.ClassName != old) 
    {
      RD3_Glb.RemoveClass2(this.MyBox, old);
      RD3_Glb.RemoveClass2(this.MyToolBox, old);
      RD3_Glb.RemoveClass2(this.PopupContainerBox, old);
      RD3_Glb.RemoveClass2(this.PopupItemBox, old);
    }
    if (this.ClassName) 
    {
      RD3_Glb.AddClass(this.MyBox, this.ClassName);
      RD3_Glb.AddClass(this.MyToolBox, this.ClassName);
      RD3_Glb.AddClass(this.PopupContainerBox, this.ClassName);
      RD3_Glb.AddClass(this.PopupItemBox, this.ClassName);
    }
  }
}

Command.prototype.SetExpanded= function(value) 
{
  var old = this.Expanded;
  if (value!=undefined)
    this.Expanded = value;
  //
  if (this.Realized && this.IsCmdSet && this.IsMenu)
  {
    var fx = null;
    //
    if (this.Expanded)	
    {
    	if (RD3_Glb.IsMobile())
    	{
    		if (this.Expanded!=old || value==undefined)
    			this.LoadNestedMenu(true);
    	}
    	else
    	{
	      if (this.CommandImg && this.Image=="")
	        this.CommandImg.src = RD3_Glb.GetImgSrc((RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen")) ? "images/openedslev" + this.Level + ".gif" : "images/opened.gif");
	      if (this.CommandImgDX)
	      {
	        this.CommandImgDX.src = RD3_Glb.GetImgSrc((RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen")) ? "images/openedslev" + this.Level + ".gif" : "images/opened.gif");
	        if (!RD3_Glb.IsIE(10, false))
	          this.CommandImgDX.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
	      }
	      if (this.MenuBox && (old!=this.Expanded || value==undefined))
	      {
	        var fx = new GFX("menu", true, this.MenuBox, value==undefined, null, this.ExpandAnimDef);
	        RD3_GFXManager.AddEffect(fx);
	      }
	    }
    }
    else
    {
    	if (RD3_Glb.IsMobile())
    	{
    		if (this.Expanded!=old)
    		{
	    		this.LoadNestedMenu(false);
	    		RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand = null;
   				this.SetMenuClass(true);
	    	}
    	}
    	else
    	{
	      if (this.CommandImg && this.Image=="")
	        this.CommandImg.src = RD3_Glb.GetImgSrc((RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen")) ? "images/closedslev" + this.Level + ".gif" : "images/closed.gif");
	      if (this.CommandImgDX)
	      {
	        this.CommandImgDX.src = RD3_Glb.GetImgSrc((RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen")) ? "images/closedslev" + this.Level + ".gif" : "images/closed.gif");
	        if (!RD3_Glb.IsIE(10, false))
	          this.CommandImgDX.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
	      }
	      if (this.MenuBox && (old!=this.Expanded || value==undefined))
	      {
	        var fx = new GFX("menu", false, this.MenuBox, value==undefined, null, this.ExpandAnimDef);
	        RD3_GFXManager.AddEffect(fx);
	      }
	    }
    }
  }
}


// ********************************************************************************
// Resituisce il popupframe in cui questo menu' e' incluso
// ********************************************************************************
Command.prototype.GetPopover= function()
{ 
	var obj = this;
	while (obj)
	{
		if (obj.Popover)
			return obj.Popover;
		obj = obj.ParentCmdSet;
	}
}


// ********************************************************************************
// Carica la lista successiva in caso di menu' mobile
// ********************************************************************************
Command.prototype.LoadNestedMenu= function(flInner, flpopover)
{ 
	// Creo il popup frame se non lo avevo gia'
	if (flpopover && !this.Popover)
	{
		// Creo il popupframe che conterra' il menu'
		this.Popover = new PopupFrame(null, this);
		this.Popover.Borders = RD3_Glb.BORDER_THIN;
		this.Popover.Centered = false;
		this.Popover.CanMove = false;
		this.Popover.AutoClose = true;
		this.Popover.WepClick = false;
		this.Popover.ModalAnim = RD3_Glb.IsSmartPhone();
		this.Popover.Owner = this;
    this.Popover.Realize("-popover");
    //
    if (this.ClassName)
      RD3_Glb.AddClass(this.Popover.PopupBox, this.ClassName);
	}
	//
  var p = this.GetPopover();
	var hb = p?p.CaptionBox:RD3_DesktopManager.WebEntryPoint.HeaderBox;
	//
	// Creo il div del menu' se non lo avevo ancora fatto.
	if (flInner && !this.MenuBox)
	{
		var supp = RD3_DesktopManager.WebEntryPoint.CmdObj.SuppressMenu || p;
		//
		this.MenuBox = document.createElement("div");
    this.MenuBox.setAttribute("id", this.Identifier+":sub");
    this.MenuBox.className = "menu-container";
    if (!flpopover && RD3_DesktopManager.WebEntryPoint.CmdObj.ShowGroups)
    {	
    	this.MenuBox.className += " menu-group-cont";
      if (RD3_Glb.IsMobile())
        this.MenuBox.style.marginTop = "-1px";
    }
    if (flpopover)
    {
			this.PopupMobileBox = document.createElement("div");
			this.PopupMobileBox.appendChild(this.MenuBox);
    }
    else
    {
    	if (p)
    		p.ContentBox.appendChild(this.MenuBox);
    	else
    		RD3_DesktopManager.WebEntryPoint.MenuBox.parentNode.appendChild(this.MenuBox);
   		RD3_Glb.AddEndTransaction(this.MenuBox, new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)"), false);
   	}
    //
    // Dico ai miei sotto-comandi di realizzarsi la'
   	var n = this.Commands.length;
		for (var i = 0; i < n; i++)
		{
			// Se sto aprendo un popover, rendo i comandi interni parte del menu'
			if (p)
				this.Commands[i].IsMenu = true;
			//
		  this.Commands[i].Realize(this.MenuBox);
		}
		//
		// Creo il bottone per tornare indietro
		if (!flpopover)
		{
			this.MenuSepImg = document.createElement("div");
			this.MenuSepImg.setAttribute("id", this.Identifier+":spi");
			this.MenuSepImg.className = supp?"popover-back-button-arrow":"menu-back-button-arrow";
			this.MenuSepImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnBack', ev)");  
			hb.appendChild(this.MenuSepImg);
			//
			this.MenuSep = document.createElement("div");
			this.MenuSep.setAttribute("id", this.Identifier+":sep");
			this.MenuSep.className = supp?"popover-back-button":"menu-back-button";
			//
			this.MenuSep.innerHTML = (this.ParentCmdSet)?this.ParentCmdSet.Caption:RD3_DesktopManager.WebEntryPoint.MainCaption;
			//
			this.MenuSep.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnBack', ev)");  
			hb.appendChild(this.MenuSep);
		}
  }
	//  
  if (!flpopover)
  {
	  // Ora prendo il menu'box del mio parent, il mio e li sposto verso sinistra
	  var boxp = (!this.IsFirstLevel())?this.ParentCmdSet.MenuBox:RD3_DesktopManager.WebEntryPoint.MenuBox;
	  //
	  if (this.MenuBox && boxp)
	  {
		  RD3_DesktopManager.WebEntryPoint.CmdObj.Expanding = true;
		  //
		  // Posiziono i due foglietti
		  this.MenuBox.style.display = "";
		  boxp.style.display = "";
		  //
		  var mw = p?p.Width:RD3_DesktopManager.WebEntryPoint.SideMenuWidth;
		  if (mw==0)
		  	mw = 320;
		  //
			var y1 = RD3_Glb.TranslateY(this.MenuBox);
			var y2 = RD3_Glb.TranslateY(boxp);
		  var i1 = flInner?mw:0;
		  var i2 = flInner?0:-mw;
		  //
		  RD3_Glb.SetTransform(this.MenuBox, "translate3d("+i1+"px,"+y1+"px,0px)");
	  	RD3_Glb.SetTransform(boxp, "translate3d("+i2+"px,"+y2+"px,0px)");
			//
			// Predispongo animazione punto finale		
		  var p1 = flInner?0:mw;
		  var p2 = flInner?-mw:0;
			//
		  var sc = "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.MenuBox.id+"'), '300ms');";
		  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ boxp.id+"'), '300ms');";
		  sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.MenuBox.id+"'), 'translate3d("+p1+"px,"+y1+"px,0px)');";
		  sc += "RD3_Glb.SetTransform(document.getElementById('"+ boxp.id+"'), 'translate3d("+p2+"px,"+y2+"px,0px)');";
		  //
		  // Animo i bottoni
		  if (this.MenuSep)
		  {
		  	var sepp = (!this.IsFirstLevel())?this.ParentCmdSet.MenuSep:null;
		  	var sepi = (!this.IsFirstLevel())?this.ParentCmdSet.MenuSepImg:null;
	  		//
	  		if (sepp)
	  			RD3_Glb.SetTransform(sepp, "translate3d("+p2+"px,0px,0px)");
	  		if (sepi)
	  			RD3_Glb.SetTransform(sepi, "translate3d("+p2+"px,0px,0px) rotate(45deg)");
		  	//
		  	var p3 = hb.offsetWidth/2-this.MenuSep.offsetWidth/2;
		  	var p4 = 0;
		  	var p5 = 1;
		  	if (flInner)
		  	{
		  		RD3_Glb.SetTransform(this.MenuSep, "translate3d("+p3+"px,0px,0px)");
		  		RD3_Glb.SetTransitionProperty(this.MenuSep, "-webkit-transform, opacity");
		  		RD3_Glb.SetTransform(this.MenuSepImg, "translate3d("+p3+"px,0px,0px) rotate(45deg)");
		  		RD3_Glb.SetTransitionProperty(this.MenuSepImg, "-webkit-transform, opacity");
		  	}
		  	else
		  	{
		  		p4 = p3;
		  		p5 = 0;
		  	}
		  	sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.MenuSepImg.id+"'), '300ms');";
		  	sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.MenuSepImg.id+"'), 'translate3d("+p4+"px,0px,0px) rotate(45deg)');";
		  	sc += "document.getElementById('"+ this.MenuSepImg.id+"').style.opacity="+p5+";";
		  	sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.MenuSep.id+"'), '300ms');";
		  	sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.MenuSep.id+"'), 'translate3d("+p4+"px,0px,0px)');";
		  	sc += "document.getElementById('"+ this.MenuSep.id+"').style.opacity="+p5+";";
		  	//
		  	// Nel caso quadro mostro o nascondo i bottoni, cosi' mi permettono di posizionare la toolbar
		  	// correttamente (lo faccio qualche riga sotto)
		  	if (RD3_Glb.IsQuadro())
		  	{
		  		this.MenuSep.style.display = flInner?"":"none";
		  		this.MenuSepImg.style.display = flInner?"":"none";
		  		if (sepp)
		  		{
			  		sepp.style.display = flInner?"none":"";
			  		sepi.style.display = flInner?"none":"";
			  	}
		  	}
		  }
		  //
			window.setTimeout(sc,0);
		}
		//
		// Ho un PopupContainer ma sono stato chiamato con flpopover a false; quindi il menu popup si e' aperto poi stiamo navigando al suo interno..
		// in questo caso devo ricalcolare io la sua dimensione in modo che riesca a mostrare tutti i comandi
		if (p)
		{
		  var comm = flInner ? this : this.ParentCmdSet;
		  if (comm)
		  {
		    var nvis = 0;
    		for (var i=0;i<comm.Commands.length;i++)
    		{
    			if (comm.Commands[i].IsVisible())
    				nvis++;
    		}
    		if (nvis==0)
    			nvis=1;
    		//
    		var h = nvis*44+48;
    		//
    		// Sul tema mobile i commandset di secondo livello hanno un margine di 4 px intorno
    		if (comm.ParentCmdSet && !RD3_Glb.IsQuadro() && !RD3_Glb.IsMobile7())
    		  h += 8;
    		//
    		var maxh = RD3_DesktopManager.WebEntryPoint.WepBox.offsetHeight*(RD3_Glb.IsSmartPhone()?0.8:0.5);
    		if (h>maxh)
    			h=maxh;
    		//
    		p.SetHeight(h);
    		p.AdaptLayout();
		  }
		}
	}
	//
	// Imposto la caption dell'applicazione/della popupframe
	if (this.Realized)
	{
		var c = this.Caption;
		if (!flInner)
			c = (!this.IsFirstLevel())?this.ParentCmdSet.Caption:RD3_DesktopManager.WebEntryPoint.MainCaption;
		if (p)
			p.SetCaption(c);
		else
			RD3_DesktopManager.WebEntryPoint.MainCaptionBox.innerHTML = c;
	}
	//
	// e regolo lo scroller sul nuovo menu'
	if (p)
	{
		if (p.IDScroll)
			p.IDScroll.SetBox(flInner?this.MenuBox:boxp);
	}
	else
	{
		RD3_DesktopManager.WebEntryPoint.CmdObj.IDScroll.SetBox(flInner?this.MenuBox:boxp);	
	}
}


Command.prototype.SetImage= function(value, force) 
{
  var old = this.Image;
  if (value!=undefined)
    this.Image = value;
  //
  // La politica di setting dell'immagine cambia a seconda del caso mobile o meno...
  var ok = this.Realized && (!this.IsCmdSet || force || (this.IsCmdSet && this.Image!="")) && !this.IsSeparator();
  if (RD3_Glb.IsMobile())
  	ok = this.Realized && (value==undefined || this.Image != old || force) && !this.IsSeparator();
  //
  if (ok)
  {
  	if (RD3_Glb.IsMobile())
  	{
  		// Nel caso force devo controllare se lo devo fare davvero
  		var todo = !force;
			//
  		// Caso mobile... uso i background
  		var bi = "";
  		var bp = "";
  		var pl = "";
  		var pr = "";
  		if (this.Image!="" && this.MyBox && this.MyBox.className != "menu-group-header")
  		{
  		  bi = "url("+RD3_Glb.GetAbsolutePath()+"images/" + encodeURI(this.Image)+")";
  			bp = (RD3_Glb.IsMobile7() ? "10px" : "7px");
  	    pl = (RD3_Glb.IsMobile7() ? "50px" : "48px");
  		}
  		if (this.IsCmdSet)
  		{
  			if (bi!="")
  			{
  			  bi += ",";
  				bp += ",";
  			}
  			bi += "url("+RD3_Glb.GetAbsolutePath()+"images/detail"+(this.IsActiveMenu()?"w":"")+".png)";
  			bp += "96%";
  			pr = "24px";
  		}
  		if (this.IsActiveMenu())
  		{
  			if (bi!="")
  			{
  				bi += ",";
  				bp += ",";
  			}
  			if (RD3_Glb.IsIE(10, true))
  			  bi += "linear-gradient(180deg, "+RD3_ClientParams.GetColorHL1()+", "+RD3_ClientParams.GetColorHL2()+")";
  			else
  			  bi += "-webkit-gradient(linear, 0% 0%, 0% 100%, from("+RD3_ClientParams.GetColorHL1()+"), to("+RD3_ClientParams.GetColorHL2()+"))";
  			//
  			bp += "0px 0px";
  			//
  			if (this.MyBox)
  				todo = todo || this.MyBox.style.backgroundImage.indexOf("gradient")==-1;
  		}
  		else
  		{
  			if (this.MyBox)
	  			todo = todo || this.MyBox.style.backgroundImage.indexOf("gradient")>-1;
  		}
  		//  		
  		if (this.MyBox && todo)
  		{
	  		var s = this.MyBox.style;
	  		s.backgroundImage = bi;
	  		s.backgroundPosition = bp;
	  		s.paddingLeft = pl;
	  		s.paddingRight = pr;
	  		s.backgroundSize = "auto";
	  		//
	  		if (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro())
   	    {
   		    // immagine attivatore, background color evidenziazione
 	        if (this.IsCmdSet)
 	        {
     	      s.backgroundSize = (this.Image=="" ? "" : "auto,");
   	        s.backgroundSize += (!this.IsActiveMenu() ? " 10px 16px" : " 10px 16px, 100%");
   	      }
   	      //
          // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
          if (RD3_Glb.Adapt4Retina(this.Identifier, this.Image, 43, this.IsCmdSet))
            this.MyBox.style.backgroundSize = "0px 0px";
          s.backgroundRepeat = "no-repeat";
       	}  		
	  	}
  		if (this.IsToolbar && this.ToolImg != null && this.Image!="")
      {
      	if (RD3_Glb.IsMobile7())
      	{
          var usemask = !(RD3_Glb.IsAndroid() || RD3_Glb.IsIE() || RD3_Glb.IsEdge()) || RD3_Glb.IsAndroid(4,4,0);
          if (usemask) 
          {
            this.ToolImg.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/" + this.Image)+"')";
            //
            // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro 		      
            if (RD3_Glb.Adapt4Retina(this.Identifier, this.Image, 43))
            {
              this.ToolImg.style.minWidth = "0px";
              this.ToolImg.style.webkitMaskSize = "0px 0px";
            }
          }
          else {
            var locImg = this.Image;
            var extIdx = this.Image.lastIndexOf(".");
            if (extIdx >= 0)
              locImg = this.Image.substring(0, extIdx) + "-i" + this.Image.substring(extIdx);
            this.ToolImg.src = RD3_Glb.GetImgSrc("images/" + locImg);
            if (RD3_Glb.Adapt4Retina(this.Identifier, locImg, 43))
              this.ToolImg.style.display = "none";
          }
	      }
      	else
  	      this.ToolImg.src = RD3_Glb.GetImgSrc("images/"+this.Image);
	      //
        // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro 		      
	      if (RD3_Glb.IsQuadro() && RD3_Glb.Adapt4Retina(this.Identifier, this.Image, 43))
          this.ToolImg.style.display = "none";
	      else
          this.ToolImg.style.display = "";
      }
  	}
  	else
  	{
	    if (this.Image == "")
	    {
	      if (this.CommandImg)
	        this.CommandImg.style.display = "none";
	      if (this.CommandImgDX  && !(this.IsCmdSet && this.Image!=""))
	        this.CommandImgDX.style.display = "none";
	      //
	      if (this.Button)
	        this.Button.removeAttribute("src");
	      //
	      if (this.PopupImageBox)
	      {
	        this.PopupImageBox.style.display = "none";
	        this.PopupIconCell.style.minWidth = "";
	      }
	    }
	    else
	    {
	      if (this.CommandImg)
	      {
	        this.CommandImg.src = RD3_Glb.GetImgSrc("images/"+this.Image);
	        this.CommandImg.style.display = "inline";
	      }
	      if (this.CommandImgDX && !(this.IsCmdSet && this.Image!=""))
	      {
	        this.CommandImgDX.src = RD3_Glb.GetImgSrc("images/"+this.Image);
	        this.CommandImgDX.style.display = "inline";
	        if (!RD3_Glb.IsIE(10, false))
	          this.CommandImgDX.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnReadyStateChange', ev)");
	      }
	      //
	      if (this.IsToolbar && this.ToolImg != null)
	      {
          if (this.ToolImg.tagName != "IMG") 
          {
            // Sono passato da un button a un image, devo gestire il caso
            var newToolImg = document.createElement("img");
            newToolImg.setAttribute("id", this.Identifier+":img");
            newToolImg.className = "toolbar-image" + (this.UseHL ? "-hl" : "");
            this.ToolImg.parentNode.insertBefore(newToolImg, this.ToolImg);
            this.ToolImg.parentNode.removeChild(this.ToolImg);
            this.ToolImg = newToolImg;
          }
          //
	        this.ToolImg.src = RD3_Glb.GetImgSrc("images/"+this.Image);
	        this.ToolImg.style.display = "";
	      }
	      //
	      if (this.Button)
	        this.Button.src = RD3_Glb.GetImgSrc("images/"+this.Image);
	      //
	      if (this.PopupImageBox)
	      {
	        this.PopupImageBox.src = RD3_Glb.GetImgSrc("images/"+this.Image);
	        this.PopupImageBox.style.display = "";
	        this.PopupIconCell.style.minWidth = "16px";
	      }
	    }
	  }
  }
}

Command.prototype.SetEnabled= function(value) 
{
  var old = this.Enabled;
  if (value!=undefined)
    this.Enabled = value;
  //
  if (this.Realized && !this.IsSeparator())
  {
    // Comando abilitato: imposto le classi corrette
    if (this.Enabled)
    {
      if (this.IsMenu)
      {
        if (this.CommandLink)
        {
          RD3_Glb.RemoveClass(this.CmdBox, "menu-item-disabled");
          if (this.IsCmdSet)
          {
            if (this.MenuBox && this.Expanded)
              this.MenuBox.style.display = "";
          }
        }
        else
        {
          // E' un comando a tendina, rimuovo la classe disabled
          RD3_Glb.RemoveClass(this.MyBox,"menu-bar-disabled");
        }
      }
      //
      if (this.IsToolbar && this.MyToolBox)  
      {
        // Devo ripristinare le classi giuste
        if (!this.IsCmdSet)
        {
          var t = (this.ParentCmdSet)?this.ParentCmdSet.ToolCont : -1;
          if (!this.IsSeparator())
          {
            // Sistemo la classe del contenitore del comando (TOOLBOX)
            if (!this.ShowNames)
            {
              if (t==0)
                this.MyToolBox.className = "toolbar-form-command";
              else if (t==-1)
                this.MyToolBox.className = ((RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)?"taskbar-":"")+"toolbar-command";
              else
                this.MyToolBox.className = "toolbar-frame-command" + (this.UseSmallIcon() ? "-small" : "");              
            }
            else
            {
              this.MyToolBox.className = "toolbar-command-showcaption";
            }
            //
            // Sistemo la classe dell'immagine del comando (TOOLIMG)
            if (t==0)
            {
              if (this.Image != "")
                this.ToolImg.className = "toolbar-form-image" + (this.UseHL ? "-hl" : "");
              else
                this.ToolImg.className = "toolbar-button toolbar-form-button";
            }
            else if (t==-1)
            {
              if (this.Image != "")
                this.ToolImg.className = "toolbar-image" + (this.UseHL ? "-hl" : "");
              else
                this.ToolImg.className = "toolbar-button toolbar-main-button";
            }
            else
            {
              if (this.Image != "")
                this.ToolImg.className = "toolbar-frame-image" + ((this.UseHL) ? "-hl" : "") + (this.UseSmallIcon() ? "-small" : "");
              else
                this.ToolImg.className = "toolbar-button toolbar-frame-button" + (this.UseSmallIcon() ? "-small" : "");
            }
          }
          else
          {
            if (t==0)
              this.MyToolBox.className = "toolbar-form-separator";
            else if (t==-1)
              this.MyToolBox.className = "toolbar-separator";
            else
              this.MyToolBox.className = "toolbar-frame-separator" + (this.UseSmallIcon() ? "-small" : "");
          }
        }
        else  // Sono un ToolBox
        {
          if (this.ToolCont<0)
            this.MyToolBox.className = ((RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)?"taskbar-":"")+"toolbar-container";
          else if (this.ToolCont==0)
            this.MyToolBox.className = "toolbar-form-container";
          else
            this.MyToolBox.className = "toolbar-frame-container" + (this.UseSmallIcon() ? "-small" : "");
        }
        //
        // Solo se e' stato fornito un valore
        if (old != this.Enabled)
          this.MyToolBox.style.display = "";
      }
      //
      // Gestisco la Button Bar: Se sono un bottone mi disabilito, 
      // se sono un contenitore di bottoni (commandset) nascondo tutti i bottoni 
      if (this.Button)
        this.Button.disabled = "";
      if (this.ButtonBox && this.IsCmdSet)
        this.ButtonBox.style.display = "";
      //
      // gestisco il popup menu
      if (this.PopupText && !this.IsSeparator())
      {
        RD3_Glb.RemoveClass(this.PopupText, "popup-menu-disabled");
      }
    }
    else  // Comando disabilitato
    {
      if (this.IsMenu)
      {
        if (this.CommandLink)
        {
          // Differenzio in base a comando/commandset (l'enabled non influenza un separatore)
          if (!this.IsCmdSet)
          {
            if (!this.IsSeparator())
              RD3_Glb.AddClass(this.CmdBox, "menu-item-disabled");
          }
          else
          {
            RD3_Glb.AddClass(this.CmdBox, "menu-item-disabled");
            if (this.MenuBox)
              this.MenuBox.style.display = "none";
          }
        }
        else
        {
          // E' un comando a tendina, metto la classe disabled
          RD3_Glb.AddClass(this.MyBox,"menu-bar-disabled");
        }
      }
      //
      if (this.IsToolbar && this.MyToolBox)  
      {
        // Devo solo nascondermi (come da documentazione dell'expanded in VCE)
        if (this.Image != "")
          this.MyToolBox.style.display = "none";
        else if (!this.IsCmdSet) // Solo se e' un comando
        {
          var t = (this.ParentCmdSet)?this.ParentCmdSet.ToolCont : -1;
          if (t==-1)
          {
            this.MyToolBox.className = ((RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)?"taskbar-":"")+"toolbar-command";
            this.ToolImg.className = "toolbar-button toolbar-main-button";
          }
          else if (t==0)
          {
            this.MyToolBox.className = "toolbar-form-command";
            this.ToolImg.className = "toolbar-button toolbar-form-button";
          }
          else
          {
            this.MyToolBox.className = "toolbar-frame-command" + (this.UseSmallIcon() ? "-small" : "");              
            this.ToolImg.className = "toolbar-button toolbar-frame-button" + (this.UseSmallIcon() ? "-small" : "");
          }
        }
      }
      //
      // Gestisco la Button Bar
      if (this.Button)
        this.Button.disabled = "disabled";
      if (this.ButtonBox && this.IsCmdSet)
        this.ButtonBox.style.display = "none";
      //
      // E il popup menu'
      if (this.PopupText)
        RD3_Glb.AddClass(this.PopupText, "popup-menu-disabled");
    }
    //
    // Di sicuro ho rimosso il className dal mio box, lo rimetto
    if (this.ClassName && this.MyToolBox)
      RD3_Glb.AddClass(this.MyToolBox, this.ClassName);
  }
}

Command.prototype.SetVisible= function(value) 
{
  var old = this.Visible;
  //
  if (value!=undefined)
    this.Visible = value;
  //
  if (this.Realized && (old!=this.Visible || value==undefined))
  {
    var vis = this.IsVisible();
    var dis = vis? "" : "none";
    //
    if (this.MyBox)
    {
      // Se la visibilita' non e' quella giusta
      if (this.MyBox.style.display != dis)
      {
        // La cambio
        this.MyBox.style.display = dis;
        //
        // Se sono diventato visibile, mi adatto... potrei non averlo mai fatto!
        if (dis == "")
          this.AdaptLayout();
        //
        // Inoltre devo ricalcolare l'altezza del FormListContainer... che si comporta come un filler
        RD3_DesktopManager.WebEntryPoint.AdaptFormListBox();
      }
      //
      if (this.Level==1 && this.IsCmdSet && this.MenuSep && !RD3_Glb.IsMobile())
      {
        this.MenuSep.style.display = dis;
        //
        // Faccio riadattare i separatori di primo livello tra i comandi, ma solo se la 
        // visibilita' e' cambiata (in questo modo non lo faccio durante la fase di realize 
        // iniziale dell'applicazione, altrimenti girerebbe troppe volte..)
        if (old!=this.Visible)
          RD3_DesktopManager.WebEntryPoint.CmdObj.AdaptFirstLevelSeparator();
      }
    }
    //
    if (this.MyToolBox)
    {
      // Non devo cambiare la visibilita' della toolbarbox di wep, viene usata per il posizionamento
      // di altri oggetti nel wep
      if (this.MyToolBox != RD3_DesktopManager.WebEntryPoint.ToolBarBox)
      {
        if (this.MyToolBox.style.display != dis)
        {
          this.MyToolBox.style.display = dis;
          //
          // E' stato nascosto/mostrato un comando. Se e' un comando di toolbar di form
          // recupero la form e se la sua toolbar e' alineata a destra, le dico di ricalcolare 
          // il layout alla fine
          if (this.ParentCmdSet && this.ParentCmdSet.IsToolbar && this.ParentCmdSet.ToolCont==0 && this.ParentCmdSet.FormIndex)
          {
            var f = RD3_DesktopManager.ObjectMap["frm:"+this.ParentCmdSet.FormIndex];
            if (f && f.Realized)
              f.AdaptToolbarLayout();
          }
        }
      }
    }
    //
    // Gestisco la Button Bar
    if (this.ButtonBox)
      this.ButtonBox.style.display = dis;
    //
    // Gestisco il popup menu
    if (this.PopupItemBox)
      this.PopupItemBox.style.display = dis;
    //
    // Gestisco il badge
    if (this.BadgeObj)
      this.BadgeObj.style.display = dis;
    //
    // Dico al cmd set di ricalcolare i separatori se la mia visibilita' e' cambiata
    // non lo devo fare se all'avvio sono visibile (undefined e visible=true) perche' sarebbe inutile
    if (this.ParentCmdSet && !(value==undefined && this.Visible==true))  
      this.ParentCmdSet.RecalcSeparatorLayout = true;
    //
    // E' cambiata la visibilita' di uno dei commandset di primo livello, se sono Mobile ed il menu e' in modalita' verticale 
    // potrebbe essere cambiata o meno la visibita' del MenuButton, quindi devo forzare una verifica
    if (RD3_Glb.IsMobile() && this.Level==1 && this.IsCmdSet)
      RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
  }
}


Command.prototype.SetCanDrag= function(value) 
{
  if (value!=undefined)
    this.CommandCanDrag = value;
  //
  // Non puo' cambiare dopo l'inizializzazione
}


Command.prototype.SetCanDrop= function(value) 
{
  if (value!=undefined)
    this.CommandCanDrop = value;
  //
  // Non puo' cambiare dopo l'inizializzazione
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
Command.prototype.Realize = function(parentm, parentt)
{
  // realizzo i miei oggetti visuali
  if (RD3_Glb.IsMobile())
  {
  	// Nel caso mobile creo l'elemento della lista innestata del mio parent
  	// a meno di non dover mostrare anche i comandi interni
  	if (this.IsMenu)
  	{
  		if (this.ShowGroupedMenu())
		  	this.RealizeGroupedMenu(parentm);
  		else
		  	this.RealizeMenuBar(parentm);
	  }
	}
	else
	{
	  if (this.IsMenu)
	  {
	    // Non realizzo i separatori nei dispositivi touch
	    if (RD3_Glb.IsTouch() && this.IsSeparator())
	      return;
	    //
	     if (RD3_DesktopManager.WebEntryPoint.MenuType!=RD3_Glb.MENUTYPE_MENUBAR)
	     {
	      this.RealizeSideMenu(parentm);
	    }
	    else
	    {
	      if (this.Level==1)
	        this.RealizeMenuBar(parentm);
	    }  
	  }
	  if (this.IsToolbar)
		{
	    this.RealizeToolbar(parentt);
	  }
	  //
	  // Poi chiedo ai miei figli di realizzarsi
	  var n = this.Commands.length;
	  for(var i=0; i<n; i++)
	  {
	    // Se sono un commandset di secondo livello contenuto in un cmdset di primo livello il mio 
	    // flag IsToolbar e' sempre false, non creo un mio oggetto visuale e passo ai miei figli il parentt
	    if (this.MyToolBox == null)
	      this.MyToolBox = parentt;
	    //
	    this.Commands[i].Realize(this.MenuBox, this.MyToolBox);
	  }
	}
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  this.SetCaption();
  this.SetTooltip();
  this.SetToolName();
  this.SetExpanded();
  this.SetImage();
  this.SetEnabled();
  this.SetVisible();
  this.SetBadge();
  this.SetClassName();
}


// ***************************************************************
// Crea gli oggetti DOM per il menu
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
Command.prototype.RealizeMenuBar = function(parent)
{
  if (!parent)
    return;
  //
  // Nel caso MenuBar, e' sufficiente creare gli span per il
  // solo primo livello...
  this.MyBox = document.createElement("span");
  this.MyBox.setAttribute("id", this.Identifier);
  this.MyBox.className = "menu-bar-command";
  //
  // Gestisco il click, ma non se e' mobile che usa il touch
  if (!RD3_Glb.IsMobile())
  	this.MyBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");  
  //
  this.UseHL = true;
  //
  parent.appendChild(this.MyBox);
}


// ***************************************************************
// Nel caso mobile crea un menu'
// ***************************************************************
Command.prototype.RealizeGroupedMenu = function(parent)
{
  if (!parent)
    return;
  //
  // Creo intestazione menu
  this.MyBox = document.createElement("span");
  this.MyBox.setAttribute("id", this.Identifier);
  this.MyBox.className = "menu-group-header";
  this.UseHL = true;
  //
  parent.appendChild(this.MyBox);	
  //
  // Realizzo al volo tutti i comandi interni
	this.MenuBox = document.createElement("div");
  this.MenuBox.setAttribute("id", this.Identifier+":sub");
  this.MenuBox.className = "menu-group-cont";
  parent.appendChild(this.MenuBox);	
  //
	for (var i = 0; i < this.Commands.length; i++)
	{
		if (this.Commands[i].IsSeparator())
		{
			this.MenuBox = document.createElement("div");
		  this.MenuBox.setAttribute("id", this.Identifier+":sub");
		  this.MenuBox.className = "menu-group-cont";
		  parent.appendChild(this.MenuBox);	
		}
		else
	  	this.Commands[i].Realize(this.MenuBox);
	}
}


// ***************************************************************
// Crea gli oggetti DOM per il menu
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
Command.prototype.RealizeSideMenu = function(parent)
{
  if(!parent)
    return;
  //
  // Creo il mio contenitore globale
  this.MyBox = document.createElement("div");
  this.MyBox.setAttribute("id", this.Identifier);
  this.MyBox.className = "menu-container-level-"+this.Level;
  //
  if (this.Level==1 && this.IsCmdSet)
   {
     // I command set di primo livello sono separati da un'immagine
     // Carico allora un div "menusep" con l'immagine per separarli
    this.MenuSep = document.createElement("div");
    this.MenuSep.setAttribute("id", this.Identifier+":menusep");
    this.MenuSep.className = "menu-separator-level-1";
    //
    if (!RD3_ServerParams.Theme.startsWith("seattle"))
    {
       this.MenuSepImg = document.createElement("img");
       this.MenuSepImg.src = RD3_Glb.GetImgSrc("images/menusep.gif");
       this.MenuSepImg.className = "menu-separator-img";
       this.MenuSep.appendChild(this.MenuSepImg);
    }
    //
    this.MyBox.appendChild(this.MenuSep);
  }
  //
  // Creo il div per la testata del comando
  this.CmdBox = document.createElement("div");
  this.CmdBox.setAttribute("id", this.Identifier+":header");
  //
  // Creo l'immagine per rappresentare i rami dell'albero dei comandi
  this.BranchImg = document.createElement("img");
  this.BranchImg.className = "menu-" + (this.IsCmdSet?"commandset":"command") + "-branchimage-level-" + this.Level;
  if (this.Level>1)
    this.BranchImg.src = RD3_Glb.GetImgSrc("images/cmdmlev" + this.Level + ".gif");
  else
    this.BranchImg.removeAttribute("src");
  this.BranchImg.removeAttribute("width");
  this.BranchImg.removeAttribute("height");
  //
  // gestisco il caso di separatore
  if (this.IsSeparator())
  {
    this.CmdBox.className = "menu-separator-level-"+this.Level;
  }
  else
  {
    var tb = RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR;
    if (this.IsCmdSet)
      this.CmdBox.className = "menu-commandset-level-"+this.Level+((tb)?" taskbar-commandset-level-"+this.Level:"");
    else
      this.CmdBox.className = "menu-command-level-"+this.Level+((tb)?" taskbar-command-level-"+this.Level:"");
    //
    // Creo il link, che poi conterra' anche l'immagine e il testo
    this.CommandLink = document.createElement("a");
    this.CommandLink.setAttribute("id", this.Identifier+":link");
    if (this.IsCmdSet)
      this.CommandLink.className = "menu-commandset-link-level-"+this.Level;
    else
      this.CommandLink.className = "menu-command-link-level-"+this.Level;  
    //
    // Gestisco il click
    this.CmdBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
    //
    // e gli eventi di highlight
    RD3_Glb.AddHLEvents(this.CmdBox, this.Identifier);
    //
    // Creo l'immagine di espansione o del comando
    this.CommandImg = document.createElement("img");
    this.CommandImg.setAttribute("id", this.Identifier+":image");
    if (this.IsCmdSet && this.Image=="")
      this.CommandImg.className = "menu-commandset-image-level-"+this.Level;
    else
      this.CommandImg.className = "menu-command-image-level-"+this.Level;
    //
    // Creo l'immagine di espansione o del comando
    this.CommandImgDX = document.createElement("img");
    this.CommandImgDX.setAttribute("id", this.Identifier+":image");
    if (this.IsCmdSet)
      this.CommandImgDX.className = "menu-commandset-imagedx-level-"+this.Level;
    else
      this.CommandImgDX.className = "menu-command-imagedx-level-"+this.Level;
    //
    this.CommandText = document.createTextNode("");
    //
    // Creo il box che conterra' i sottocomandi
    this.MenuBox = document.createElement("div");
    this.MenuBox.setAttribute("id", this.Identifier+":sub");
    this.MenuBox.className = "submenu-container-level-"+this.Level;
     //
     // Aggiungo al DOM i vari oggetti nell'ordine giusto
     this.CommandLink.appendChild(this.CommandText);
     //
     this.CmdBox.appendChild(this.BranchImg);
     this.CmdBox.appendChild(this.CommandImg);
     this.CmdBox.appendChild(this.CommandLink);
     this.CmdBox.appendChild(this.CommandImgDX);
  }
  //
   this.MyBox.appendChild(this.CmdBox);
   if (this.IsCmdSet)
    this.MyBox.appendChild(this.MenuBox);
   parent.appendChild(this.MyBox);
}


// ***************************************************************
// Crea gli oggetti DOM per la toolbar
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
Command.prototype.RealizeToolbar = function(parent)
{
  if (!parent)
    return;
  //
  // Sono un command set
  if (this.IsCmdSet)
  {
    // Sono un CommandSet: devo verificare se sono un CommandSet di primo livello
    // Se non sono un CmdSet di primo livello non devo creare nessun elemento nel DOM
    if (this.Level == 1)
    {
       // Creo l'unico oggetto visuale necessario
       this.MyToolBox = document.createElement("span");
       //
       // Assegno la classe. Se toolbar di form/frame sara' modificata
      this.MyToolBox.className = ((RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)?"taskbar-":"")+"toolbar-container";
       //
       // Inserisco gli oggetti nel DOM
       parent.appendChild(this.MyToolBox);
    }
  }
  else // sono un comando
  {
    if (this.IsSeparator())
    {
      // Gestisco il caso separatore: creo il Div e assegno la classe
      this.MyToolBox = document.createElement("span");
      this.MyToolBox.className = "toolbar-separator";
      //
      parent.appendChild(this.MyToolBox);
    }
    else
    {
      // Sono un comando: creo gli oggetti DOM comuni
      this.MyToolBox = document.createElement("span");
      this.MyToolBox.setAttribute("id", this.Identifier);
      if (this.Image != "")
      {
        this.ToolImg = document.createElement("img");
      }
      else
      {
        this.ToolImg = document.createElement("input");
        this.ToolImg.type = "button";
        this.ToolImg.disabled = !this.Enabled;
        this.ToolImg.value = this.Caption;
        if (this.Enabled)
          this.ToolImg.style.cursor = "pointer";
        //
        this.MyToolBox.style.cursor = "default";
      }
      this.ToolImg.setAttribute("id", this.Identifier+":img");
      //
      // Assegno le classi agli oggetti DOM comuni
      this.MyToolBox.className = ((RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)?"taskbar-":"")+"toolbar-command";
      this.ToolImg.className = "toolbar-image" + (this.UseHL ? "-hl" : "");
      //
      // Gestisco il click e l'hilight
      this.MyToolBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
      //
      // Inserisco gli oggetti nel DOM
      this.MyToolBox.appendChild(this.ToolImg);
      parent.appendChild(this.MyToolBox);
      //
      // Gestisco le impostazioni relative al nome del comando se deve essere mostrata
      // Non ha senso mostrare il nome se non ho l'immagine, in questo caso viene gia' mostrato!
      if (this.ShowNames && this.Image != "")
      {
        this.ToolText = document.createTextNode("");
        this.MyToolBox.className = "toolbar-command-showcaption";
        //
        this.MyToolBox.appendChild(this.ToolText);
        //
        // Se ho shownames + immagine devo fare qualcosa di diverso...
        // devo mostrare un bottone con immagine e testo, altrimenti ottengo un effetto grafico brutto
        this.ToolButton = document.createElement("button");
        this.ToolButton.className = "toolbar-button toolbar-frame-button toolbar-showname-button";
        this.ToolButton.appendChild(this.ToolImg);
        this.ToolButton.appendChild(this.ToolText);
        this.MyToolBox.appendChild(this.ToolButton);
      }
    }
  }
}


// ***************************************************************
// Crea gli oggetti DOM per la button bar (crea dei bottoni)
// Parent e' l'oggetto ButtonBar che contiene questo CommandSet
// ***************************************************************
Command.prototype.RealizeButtonBar = function(parent)
{
  if (this.IsCmdSet)
  {
    // Creo gli elementi del DOM
    parent.ButtonBarContainer = document.createElement("div");
    parent.ButtonBarContainer.className = "button-bar-container";
    if (parent.VerticalLayout)
	    RD3_Glb.AddClass(parent.ButtonBarContainer,"button-bar-vertical");
    //
    // Sono un commandSet: devo fare realizzare tutti i miei figli come bottoni
    var n = this.Commands.length;
    for(var i=0; i<n; i++)
    {
      this.Commands[i].RealizeButtonBar(parent);
    }
    //
    // Inserisco gli elementi nel DOM e mi memorizzo i riferimenti
    parent.ContentBox.appendChild(parent.ButtonBarContainer);
    this.ButtonBox = parent.ButtonBarContainer;
    //
    this.SetVisible(this.Visible);
    this.SetEnabled(this.Enabled);
  }
  else
  {
    if (this.IsSeparator())
    {
      // Sono un separatore 
      this.ButtonBox = document.createElement(parent.VerticalLayout?"div":"span");
      this.ButtonBox.className = "button-bar-" + (parent.VerticalLayout?"vertical":"horizontal") + "-separator";
      parent.ButtonBarContainer.appendChild(this.ButtonBox);
    }
    else if (parent.ButtonBarContainer)
    {
      // Sono un Comando: mi devo realizzare come Bottone
      this.ButtonBox = document.createElement(parent.VerticalLayout?"div":"span");
      this.Button = document.createElement("input");
      this.Button.setAttribute("id", this.Identifier);
      //
      // Assegno le classi ed i tipi corretti
      this.ButtonBox.className = "button-bar-button-box";
      this.Button.className = "button-bar-button";
      this.Button.type = "button";
      //
      if (this.Width)
        this.Button.style.width = this.Width + "px";
      //
      // Assegno gli eventi
      this.Button.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnButtonBarClick', ev)");
      RD3_Glb.AddHLEvents(this.Button, this.Identifier, "OnBBMouseOver", "OnBBMouseOut");
      //
      // Aggiungo i componenti al DOM
      this.ButtonBox.appendChild(this.Button);
      parent.ButtonBarContainer.appendChild(this.ButtonBox);
      //
      this.Realized = true;
      // 
      // Impostazioni iniziali
      this.SetCaption(this.Caption);
      this.SetTooltip(this.Tooltip);
      this.SetImage(this.Image);
      this.SetEnabled(this.Enabled);
      this.SetVisible(this.Visible); 
    }
  }
  //
  // Mi memorizzo in ogni caso il riferimento al padre
  this.BBParent = parent;
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// Adapt Layput non vuole parametri: calcolarli 
// ********************************************************************************
Command.prototype.AdaptLayout = function()
{ 
  // Gestisco il caso ButtonBar 
  if (this.Button)
  {
    // Se la Button Bar e' verticale devo impostare la larghezza dei pulsanti
    if (this.BBParent.VerticalLayout)
    {
      var ofs = 0;
      if (RD3_Glb.IsTouch())
        ofs = 4;
      if (RD3_Glb.IsMobile())
        ofs = 8;
      this.Button.style.width = (this.BBParent.ContentBox.clientWidth-ofs) + "px";
    }
  }
  //
  // Faccio adattare i miei figli
  var menuwidth = 0;
  var n = this.Commands.length;
  var lastcmd = null;
  for(var i=0; i<n; i++)
  {
    var cmd = this.Commands[i];
    cmd.AdaptLayout();
    //
    // Se e' visibile lo segno come l'ultimo comando stampato
    if (cmd.IsVisible())
      lastcmd = cmd;
  }
  //
  // Se ho trovato l'ultimo comando gli cambio l'immagine che rappresenta il ramo dell'albero dei comandi
  if (lastcmd != null && lastcmd.BranchImg != null && this.Level > 1)
  {
    lastcmd.BranchImg.src = RD3_Glb.GetImgSrc("images/cmdmlev" + lastcmd.Level + "end.gif");
    lastcmd = null;
  }
  //
  // Se c'e' anche l'icona a destra del comando
  if (this.CommandImgDX && this.CommandImgDX.src && !RD3_DesktopManager.WebEntryPoint.CmdObj.SuppressMenu)  
  {
    this.CommandImgDX.style.marginLeft = (this.CmdBox.offsetWidth - this.CommandImg.offsetWidth - this.CommandImgDX.offsetWidth - this.CommandLink.offsetWidth - 4) + "px";
  }
  //
  if (RD3_Glb.IsSmartPhone() && this.IsCmdSet && this.Realized)
  {
  	this.SetImage();
	}
	//
	if (RD3_Glb.IsMobile() && this.Realized)
	  this.SetBadge();
}

// *******************************************************
// Metodo che gestisce il cambio dello stato dell'immagine
// *******************************************************
Command.prototype.OnReadyStateChange = function()
{
  if (this.CommandImgDX && this.CommandImgDX.src && !RD3_DesktopManager.WebEntryPoint.CmdObj.SuppressMenu)  
  {
    this.CommandImgDX.style.marginLeft = (this.CmdBox.offsetWidth - this.CommandImg.offsetWidth - this.CommandImgDX.offsetWidth - this.CommandLink.offsetWidth - 4) + "px";
  }
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
Command.prototype.Unrealize = function(flonlydom)
{ 
  // Se ero collegato a mio padremi stacco
  if (this.ParentCmdSet && !flonlydom)
    this.ParentCmdSet = null;
  //
  if (this.MyBox)
    this.MyBox.parentNode.removeChild(this.MyBox);
  //
  if (this.MyToolBox && this.MyToolBox.parentNode)
    this.MyToolBox.parentNode.removeChild(this.MyToolBox);
  //
  if (this.ButtonBox)
    this.ButtonBox.parentNode.removeChild(this.ButtonBox);
  //
  if (this.Popover)
    this.Popover.Unrealize();
  //
  if (!flonlydom)
  {
	  // Mi tolgo dalla mappa degli oggetti
	  RD3_DesktopManager.ObjectMap[this.Identifier] = null;
	  this.Commands = new Array();
	}
  //
  // Passo il messaggio ai miei figli
  var n = this.Commands.length;
  for(var i=0; i<n; i++)
  {
    this.Commands[i].Unrealize(flonlydom);
  }
  //
  // Elimino i riferimenti al DOM
  this.MyBox = null;   
  this.CmdBox = null;
  this.MenuBox = null;   
  this.CommandLink = null; 
  this.CommandImg = null; 
  this.CommandText = null; 
  this.MenuSep = null;    
  this.MenuSepImg = null; 
  //
  this.MyToolBox = null; 
  this.ToolImg = null; 
  this.ToolText = null; 
  //
  this.ButtonBox = null;
  this.Button = null;
  this.BBParent = null;
  this.Expanded = false;
  this.BadgeObj = null;
  //
  this.Realized = false; 
}


// ********************************************************************************
// Toglie gli elementi visuali della Button Bar, senza eliminare questo command
// set
// ********************************************************************************
Command.prototype.UnrealizeButtonBar = function()
{ 
  // Rimuovo il mio box
  if (this.ButtonBox)
    this.ButtonBox.parentNode.removeChild(this.ButtonBox);
  //
  // Passo il messaggio ai miei figli
  var n = this.Commands.length;
  for(var i=0; i<n; i++)
  {
    this.Commands[i].UnrealizeButtonBar();
  }
  //
  // Elimino i riferimenti al DOM
  this.ButtonBox = null;
  this.Button = null;
  this.BBParent = null;
}


// ********************************************************************************
// Ritorna vero se e' visibile
// ********************************************************************************
Command.prototype.IsVisible = function()
{ 
  var vis = this.Visible;
  //
  // Se l'impostazione visible e' true devo verificare se sono globale (e quindi conta visible) oppure se sono di form
  // (Allora la visibilita' deve essere condizionata alla attivazione della form)
  if (vis)
  {
    // Verifico se sono globale o di form
    if (this.FormIndex > 0 && (this.IsMenu || this.IsToolbar)) 
    {
      // Dato che sono di form devo verificare se la mia form e' quella attiva
      var fnd = false;
      var actf = RD3_DesktopManager.WebEntryPoint.ActiveForm;
      if (actf && actf.IdxForm == this.FormIndex)
        fnd = true;
      //
      var nf = fnd ? 0 : RD3_DesktopManager.WebEntryPoint.StackForm.length;
      for (var t=0;t<nf;t++)
      {
        var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
        if (f.Docked && f.IdxForm == this.FormIndex)
        {
          fnd = true;
          break;
        }
      }
      //
      if (!fnd)
        fnd = this.CheckSubForm();
      //
      if (!fnd)
        vis = false;
      //
      // Sono di form e la mia form non e' ne' quella attiva ne' quella docked...
      // Verifico se il comando e' gia' contenuto nella form... Se lo e' gia' allora sono visibile... 
      // tanto se la si nasconde (es: minimizza) lei porta nel limbo anche me
      // NPQ 1185: questo e' vero solo se il comando non e' anche un menu.. perche' in quel caso e' fuori dalla form e quindi si deve nascondere
      if (!vis && !this.IsMenu && this.IsToolbar && this.MyToolBox && this.MyToolBox.parentNode && this.MyToolBox.parentNode != RD3_DesktopManager.WebEntryPoint.ToolBarBox)
        vis = true;
    }
    //
    // Se sono di frame, sono visibile se il frame e' non collassato
    if (this.ToolCont > 0 && vis)
    {
      var f = RD3_DesktopManager.ObjectMap["frm:"+this.FormIndex];
      if (f)
      {
        var fr = f.Frames[this.ToolCont-1];
        if (fr && (fr.Collapsed || !fr.Visible || !fr.Realized))
        {
          vis = false;
        }    
      }
    }
  }
  //
  return vis;
}


// ********************************************************************************
// Ritorna vero se e' abilitato
// ********************************************************************************
Command.prototype.IsEnabled = function()
{ 
  var en = this.Enabled;
  //
  // Se sono abilitato verifico se sono globale (e quindi abilitato) oppure se sono di form
  // (Allora l'abilitazione deve essere condizionata alla attivazione della form)
  if (en)
  {
    // Se sono un comando di form: verifico se la mia form e' la form attiva
    if (this.FormIndex > 0 && (this.IsMenu || this.IsToolbar))
    {
      var fnd = false;
      var actf = RD3_DesktopManager.WebEntryPoint.ActiveForm;
      if (actf && actf.IdxForm == this.FormIndex)
        fnd = true;
      //
      var nf = fnd ? 0 : RD3_DesktopManager.WebEntryPoint.StackForm.length;
      for (var t=0;t<nf;t++)
      {
        var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
        if (f.Docked && f.IdxForm == this.FormIndex)
        {
          fnd = true;
          break;
        }
      }
      //
      if (!fnd)
        fnd = this.CheckSubForm();
      //
      // La form non e' stata trovata tra quelle attive, ma io sono abilitato e sono visibile: allora faccio passare il click
      if (!fnd && !this.IsMenu && this.IsToolbar && this.MyToolBox && this.MyToolBox.parentNode && this.MyToolBox.parentNode != RD3_DesktopManager.WebEntryPoint.ToolBarBox)
        fnd = true;
      //
      if (!fnd)
        en = false; 
      //
      // Bottone di form: non controllo la form attiva
      if (this.BBParent)
        en = true;
    }
  }
  //
  return en;
}


// ********************************************************************************
// Ritorna vero se e' un separatore
// ********************************************************************************
Command.prototype.IsSeparator= function()
{ 
  return this.Caption=="";
}


// ********************************************************************************
// Gestore evento di click
// ********************************************************************************
Command.prototype.OnClick= function(evento, confirmed)
{ 
	var wep = RD3_DesktopManager.WebEntryPoint;
	//
	// Voglio evitare un doppio click sugli oggetti
	if (RD3_Glb.IsAndroid())
		RD3_DDManager.ChompClick();
	//
  // Chiudo eventuali popup aperti, filtrando me ed i miei padri se dovro' aprire un altro popup
  // Nel mobile passa un onclick quando clicco in un menu popover, quindi il codice
  // seguente evita che si chiudano tutti i popover
  if (this.IsCmdSet && RD3_Glb.IsMobile() && this.GetPopover)
  	RD3_DesktopManager.WebEntryPoint.DisableOnClick++;
	// 
  wep.CmdObj.ClosePopup(this.IsCmdSet?this:null);
  //
  // Chiudo anche il popover se ero un comando
  if (!this.IsCmdSet && this.FormIndex==0)
  	RD3_DDManager.ClosePopup(true);
  //
  // Se ho dato un comando, non devo piu' mostrare la menu bar
  if (RD3_Glb.IsSmartPhone() && !this.IsCmdSet && this.FormIndex==0)
  {
  	if (wep.CmdObj.ForceMenuBar)
  	{
  		wep.CmdObj.ForceMenuBar = false;
  		wep.RecalcLayout = true;
  	}
  }
  //
  if (this.IsVisible() && this.IsEnabled())
  {
    if (this.RequireConf && !confirmed)
    {
      // Chiedo conferma per il comando
      this.MsgBox = new MessageBox(this.Caption + ": " + RD3_ServerParams.ConfirmMenu, RD3_Glb.MSG_CONFIRM, false);
      this.MsgBox.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev, true)");    
      this.MsgBox.Open();
      return;
    }
    if (this.RequireConf && confirmed)
    {
      if (this.MsgBox.UserResponse != "Y")
        return;
    }
    //    
    // Notifico l'evento...
    var evt = this.IsCmdSet ? this.ExpandEventDef : this.ClickEventDef;
    var ev = new IDEvent("clk", this.Identifier, evento, evt);
    if (!this.IsCmdSet)
      wep.SoundAction("command","play");
    //
    // Se sono mobile sistemo l'elemento attivo
    if (RD3_Glb.IsMobile())
   	{
		  wep.CmdObj.ActiveCommand = this;
   		this.SetMenuClass();
   		//
   		if (this.IsToolbar)
   		{
   		  var srcobj = (window.event)?evento.srcElement:evento.explicitOriginalTarget;
   		  if (srcobj == this.ToolImg)
          RD3_KBManager.ActiveButton = srcobj;
   		}
   	}
    //
    if (ev.ClientSide)
    {
      if (this.IsCmdSet || (this.FormList && RD3_DesktopManager.WebEntryPoint.StackForm.length > 0))
      {
        if (wep.MenuType!=RD3_Glb.MENUTYPE_MENUBAR && !this.PopupTextCell && !RD3_Glb.IsMobile())
        {
          // L'esecuzione locale di un evento di espansione apre o chiude il command set
          // Se e' un menu laterale...
          this.SetExpanded(!this.Expanded);
          //
          // Non voglio far fluire l'evento al WEP se no chiude di nuovo i popup!!!
          if (evento && wep.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
            RD3_Glb.StopEvent(evento);
        }
        else
        {
          // Sono mobile, tolgo la classe dagli altri della mia lista
          // e poi carico la lista nidificata
          if (RD3_Glb.IsMobile())
         	{
  	        this.SetExpanded(!this.Expanded);
         	}
          else
          {
  	        // Devo aprire il command set in popup!!!
  	        // ed evidenziare la voce di menu' nella barra
  	        if (this.MyBox)
  	          RD3_Glb.AddClass(this.MyBox, "menu-bar-hover");
  	        if (this.PopupTextCell)
  	          RD3_Glb.AddClass(this.PopupTextCell, "popup-menu-hover");
  	        this.Popup(this);
  	        wep.CmdObj.MenuBarOpen = true;
  	      }
  	      //
          // Non voglio far fluire l'evento al WEP se no chiude di nuovo i popup!!!
          if (evento)
            RD3_Glb.StopEvent(evento);
        }
      }
      else if (this.CallBackFunction)
        this.CallBackFunction();
    }
  }
}


// ********************************************************************************
// Gestore evento di BACK del BOTTONE
// ********************************************************************************
Command.prototype.OnBack= function(evento)
{ 
	// Voglio evitare che il popover si chiuda
	if (this.GetPopover())
		RD3_DesktopManager.WebEntryPoint.DisableOnClick++;
	//
  var ev = new IDEvent("clk", this.Identifier, evento, this.ExpandEventDef);
	//
  // Torno al livello inferiore
  this.SetExpanded(false);
}


// ********************************************************************************
// Gestore evento di BACK del BOTTONE
// ********************************************************************************
Command.prototype.OnEndAnimation= function(evento)
{ 
  if (RD3_Glb.GetTransitionDuration(this.MenuBox)=="")
		return;
  //
  var boxp = (!this.IsFirstLevel())?this.ParentCmdSet.MenuBox:RD3_DesktopManager.WebEntryPoint.MenuBox;
  RD3_Glb.SetTransitionDuration(this.MenuBox, "");
	RD3_Glb.SetTransitionDuration(boxp, "");
  this.MenuBox.style.display = this.Expanded?"":"none";
  boxp.style.display = this.Expanded?"none":"";
	//
	if (!this.Expanded)
	{
		RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand = null;
		this.SetMenuClass();
	}
	RD3_DesktopManager.WebEntryPoint.CmdObj.Expanding = false;
}


// ********************************************************************************
// Elimina la classe hover da tutto il menu', escluso l'oggetto indicato
// ********************************************************************************
Command.prototype.SetMenuClass= function(mycmd)
{ 
	var x = null;
	if (mycmd)
	{
		x = this.Commands;
	}
	else if (RD3_DesktopManager.WebEntryPoint.CmdObj.ShowGroups && this.ParentCmdSet && this.ParentCmdSet.FormIndex==0 && this.ParentCmdSet.Level==1)
	{
	  // Se il menu e' gruppato ed il mio commandset padre e' di primo livello allora non devo cercare solo su i suoi figli, ma su 
	  // tutti i comandi figli dei cmdset di primo livello
		var n = RD3_DesktopManager.WebEntryPoint.CmdObj.CommandSets.length;
		x = new Array();
		//
		for (var i=0; i<n; i++)
		{
		  var cmds = RD3_DesktopManager.WebEntryPoint.CmdObj.CommandSets[i];
		  //
		  if (cmds.FormIndex==0)
		  {
		    for (var cm=0; cm<cmds.Commands.length; cm++)
		      x.push(cmds.Commands[cm]);
		  }
		}
	}
	else if (this.ParentCmdSet)
	{
		x = this.ParentCmdSet.Commands;
	}
	else
	{
		x = RD3_DesktopManager.WebEntryPoint.CmdObj.CommandSets;
	}
	//
	var n = x.length;
	for (var i=0; i<n; i++)
	{
		var mb = x[i].MyBox;
		if (mb)
		{
			if (x[i]==RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand)
    		RD3_Glb.AddClass(mb, "menu-bar-hover");
			else
    		RD3_Glb.RemoveClass(mb, "menu-bar-hover");
    	//
    	x[i].SetImage(undefined, true);
    }
	}
}


// ********************************************************************************
// Gestore evento di mouse over su uno degli oggetti di questo comando
// ********************************************************************************
Command.prototype.OnMouseOverObj= function(evento, obj)
{ 
  if (this.IsSeparator() || !this.Enabled)
    return;
  //
  // Se l'oggetto e' della toolbar eseguo l'hiligth sulla toolbar
  if (this.IsToolbar && ((obj==this.MyToolBox || obj==this.ToolImg || obj==this.ToolText) && this.UseHL))
  {
    var t = (this.ParentCmdSet)?this.ParentCmdSet.ToolCont : -1;
    if (t==0)
      RD3_Glb.AddClass(this.ToolImg, "form-caption-hover");
    else if (t==-1)
      RD3_Glb.AddClass(this.ToolImg, "toolbar-image-hover");
    else
      RD3_Glb.AddClass(this.ToolImg, "frame-caption-hover"+(this.UseSmallIcon() ? "-small" : ""));
  }
  //
  // Toolbar di tipo bottone
  if (this.IsToolbar && obj==this.ToolImg && this.Image=="")
  {
    var t = (this.ParentCmdSet)?this.ParentCmdSet.ToolCont : -1;
    if (t==-1)
      RD3_Glb.AddClass(this.ToolImg, "main-button-hover");
    else if (t==0)
      RD3_Glb.AddClass(this.ToolImg, "form-button-hover");
    else
      RD3_Glb.AddClass(this.ToolImg, "frame-button-hover");
  }
  //
  if (this.IsMenu && this.Level==1 && obj==this.MyBox && this.Enabled && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_MENUBAR)
  {
    RD3_Glb.AddClass(this.MyBox, "menu-bar-hover");
    //
    // Se avevo aperto la tendina, solo andando sopra ai menu'
    // e' opportuno riaprire le altre tendine
    if (RD3_DesktopManager.WebEntryPoint.CmdObj.MenuBarOpen && !this.PopupContainerBox)
    {
      this.OnClick();
    }
  }  
  //
  if (obj==this.PopupTextCell || obj==this.PopupText)
  {
    RD3_Glb.AddClass(this.PopupTextCell, "popup-menu-hover");
    if (this.IsCmdSet && !this.PopupContainerBox && this.PopupTimer==0 && (!this.ParentCmdSet || !this.ParentCmdSet.IsClosing)) // Non se mio padre si sta chiudendo!
    {
      // Attivo timer apertura cmdset secondo livello
      this.PopupTimer = window.setTimeout(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev, true)"), 500);
    }
    //
    // Se un cmdset di secondo livello era stato aperto, allora lo chiudo
    this.CloseOtherPopup();
  }
  //
  // IE6 non supporta HOVER
  if ((RD3_Glb.IsIE(6) || RD3_Glb.IsTouch()) && this.IsMenu && (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_LEFTSB || RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_RIGHTSB))
  {
    if (this.IsCmdSet)
      RD3_Glb.AddClass(this.MyBox, "menu-commandset-level-"+this.Level+"-hover");
    else
      RD3_Glb.AddClass(this.MyBox, "menu-command-level-"+this.Level+"-hover");
  }
}


// ********************************************************************************
// Gestore evento di mouse out su uno degli oggetti di questo comando
// ********************************************************************************
Command.prototype.OnMouseOutObj= function(evento, obj)
{ 
  if (this.IsSeparator())
    return;
  //
  // Se l'oggetto e' della toolbar eseguo l'hiligth sulla toolbar
  if (this.IsToolbar && (obj==this.MyToolBox || obj==this.ToolImg || obj==this.ToolText))
  {
    RD3_Glb.RemoveClass(this.ToolImg, "form-caption-hover");
    RD3_Glb.RemoveClass(this.ToolImg, "form-caption-press");
    RD3_Glb.RemoveClass(this.ToolImg, "frame-caption-hover");
    RD3_Glb.RemoveClass(this.ToolImg, "frame-caption-press");
    RD3_Glb.RemoveClass(this.ToolImg, "frame-caption-hover-small");
    RD3_Glb.RemoveClass(this.ToolImg, "frame-caption-press-small");
    RD3_Glb.RemoveClass(this.ToolImg, "toolbar-image-hover");
    RD3_Glb.RemoveClass(this.ToolImg, "toolbar-image-press");    
    RD3_Glb.RemoveClass(this.ToolImg, "main-button-hover");
    RD3_Glb.RemoveClass(this.ToolImg, "form-button-hover");
    RD3_Glb.RemoveClass(this.ToolImg, "frame-button-hover");
  }
  //
  if (this.IsMenu && this.Level==1 && (this.PopupContainerBox==null || this.IsClosing) && obj==this.MyBox && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_MENUBAR)
  {
    RD3_Glb.RemoveClass(this.MyBox, "menu-bar-hover");
  }  
  //
  if (this.IsMenu && obj==this.PopupTextCell && (this.PopupContainerBox==null || this.IsClosing))
  {
    RD3_Glb.RemoveClass(this.PopupTextCell, "popup-menu-hover");
    if (this.PopupTimer!=0)
    {
      // DISattivo timer apertura cmdset secondo livello
      window.clearTimeout(this.PopupTimer);
      this.PopupTimer = 0;
    }    
  }
  //
  // IE6 non supporta HOVER
  if ((RD3_Glb.IsIE(6) || RD3_Glb.IsTouch()) && this.IsMenu && (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_LEFTSB || RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_RIGHTSB))
  {
    if (this.IsCmdSet)
      RD3_Glb.RemoveClass(this.MyBox, "menu-commandset-level-"+this.Level+"-hover");
    else
      RD3_Glb.RemoveClass(this.MyBox, "menu-command-level-"+this.Level+"-hover");
  }
}


// ********************************************************************************
// Gestore evento di mouse down su uno degli oggetti di questo comando
// ********************************************************************************
Command.prototype.OnMouseDownObj= function(evento, obj)
{ 
  if (this.IsSeparator())
    return;
  //
  // Se l'oggetto e' della toolbar eseguo il mouse down sulla toolbar
  if (this.IsToolbar && (obj==this.MyToolBox || obj==this.ToolImg || obj==this.ToolText) && this.UseHL)
  {
    var t = (this.ParentCmdSet)?this.ParentCmdSet.ToolCont : -1;
    if (t==0)
      RD3_Glb.AddClass(this.ToolImg, "form-caption-press");
    else if (t==-1)
      RD3_Glb.AddClass(this.ToolImg, "toolbar-image-press");
    else
      RD3_Glb.AddClass(this.ToolImg, "frame-caption-press" + (this.UseSmallIcon() ? "-small" : ""));
  }
  //
  // Toolbar di tipo bottone
  if (this.IsToolbar && obj==this.ToolImg && this.Image=="" && this.Enabled)
  {
    var t = (this.ParentCmdSet)?this.ParentCmdSet.ToolCont : -1;
    if (t==-1)
      RD3_Glb.AddClass(this.ToolImg, "main-button-press");
    else if (t==0)
      RD3_Glb.AddClass(this.ToolImg, "form-button-press");
    else
      RD3_Glb.AddClass(this.ToolImg, "frame-button-press");
    //
    // Se IE, do' il fuoco da qualche altra parte e se non ci riesco non mi lamento
     if (RD3_Glb.IsIE())
     {
       try { RD3_DesktopManager.WebEntryPoint.CommandInput.focus(); } catch(ex) {;}
     }
     //
    window.setTimeout(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseUpObj')"), 300);
  }
}


// ********************************************************************************
// Gestore evento di mouse up su uno degli oggetti di questo comando
// ********************************************************************************
Command.prototype.OnMouseUpObj= function()
{
  // Se l'oggetto e' della toolbar eseguo il mouse up sulla toolbar
  RD3_Glb.RemoveClass(this.ToolImg, "main-button-press");
  RD3_Glb.RemoveClass(this.ToolImg, "form-button-press");
  RD3_Glb.RemoveClass(this.ToolImg, "frame-button-press");
  //
  if (RD3_Glb.IsIE())
  {
    try { RD3_DesktopManager.WebEntryPoint.CommandInput.focus(); } catch(ex) {;}
  }
}


// ********************************************************************************
// Metodo chiamato quando cambia la form attiva: rifa' il controllo della visibilita'
// del comando
// ********************************************************************************
Command.prototype.ActiveFormChanged = function()
{ 
  // Attenzione: questa toolbar e' di form... mettiamo i comandi nel posto giusto
  // Opero solo per toolbar globali
  if (this.ToolCont >= 0 && this.IsToolbar)
  {
    // Se e' di form la metto nella toolbar sopra la formcaption
    if (this.ToolCont == 0)
    {
      var f = RD3_DesktopManager.ObjectMap["frm:"+this.FormIndex];
      if (f && f.Realized)
      {
        if (!this.MyToolBox && RD3_Glb.IsMobile())
        {
        	// Nel caso mobile, la toolbar di frame non e' inizializzata. Lo faccio ora
          this.RealizeToolbar(f.CaptionBox);
          this.SetClassName();
          //
				  for(var i=0; i<this.Commands.length; i++)
				  {
				  	this.Commands[i].RealizeToolbar(this.MyToolBox);
				  	this.Commands[i].Realize(this.MenuBox, this.MyToolBox);
				  }
        }
        f.AttachToolbar(this);
        //
        if (!this.IsToolBarLoaded()) 
        {
          // Le immagini della toolbar non sono state ancora caricate: attivo un timer che ogni 500 milli
          // controlla se sono state caricate: se lo sono rifaccio l'adaptLayout della form
          this.ToolTimer = window.setTimeout(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'ToolbarLoadedUpdate', ev, true)"), 100);
        }
      }
    }
    //
    // Se e' legata a un pannello la metto nella toolbar del pannello stesso
    if (this.ToolCont > 0)
    {
      var f = RD3_DesktopManager.ObjectMap["frm:"+this.FormIndex];
      if (f)
      {
        var fr = f.Frames[this.ToolCont-1];
        //
        if (fr && fr.ToolbarBox && !this.MyToolBox && RD3_Glb.IsMobile())
        {
        	// Nel caso mobile, la toolbar di frame non e' inizializzata. Lo faccio ora
          this.RealizeToolbar(fr.ToolbarBox);
          this.SetClassName();
          //
				  for(var i=0; i<this.Commands.length; i++)
				  {
				  	this.Commands[i].RealizeToolbar(this.MyToolBox);
				  	this.Commands[i].Realize(this.MenuBox, this.MyToolBox);
				  }
        }
        //
        if (fr && fr.ToolbarBox && this.MyToolBox && this.MyToolBox.parentNode != fr.ToolbarBox)
        {
          if (this.MyToolBox.parentNode)
            this.MyToolBox.parentNode.removeChild(this.MyToolBox);
          //
          // Nel caso di pannello devo tenere conto delle zone
          if (fr instanceof IDPanel)
            fr.AppendCmsToToolbar(this.MyToolBox);
          else
            fr.ToolbarBox.appendChild(this.MyToolBox);
        }
      }
    }
  }
  //
  this.SetVisible();
  this.SetEnabled();
  //
  var cmdl = this.Commands.length;
  for (var i = 0; i<cmdl; i++ )
  {
    this.Commands[i].ActiveFormChanged();
  }
}


// ********************************************************************************
// Gestore evento di mouse over sul pulsante Collapse della Toolbar
// ********************************************************************************
Command.prototype.OnBBMouseOver= function(evento)
{ 

}


// ********************************************************************************
// Gestore evento di mouse out sul pulsante Collapse della Toolbar
// ********************************************************************************
Command.prototype.OnBBMouseOut= function(evento)
{ 

}


// ********************************************************************************
// Gestore evento di click sul pulsante Collapse della Toolbar
// ********************************************************************************
Command.prototype.OnButtonBarClick= function(evento)
{ 
  if (this.IsVisible() && this.IsEnabled())
  {
    var ev = new IDEvent("btb",this.BBParent.Identifier, evento, this.ClickEventDef, this.Identifier);
  }
}

// ********************************************************************************
// Apro il command set di tipo popup
// ********************************************************************************
Command.prototype.Popup= function(node)
{ 
  // Se il popup era gia' aperto non posso aprirlo ancora
  if (this.PopupContainerBox!=null)
    this.ClosePopup();
  //
  if (this.PopupTimer)
  {
    window.clearTimeout(this.PopupTimer);
    this.PopupTimer = 0;
  }
  //
  if (RD3_Glb.IsMobile())
  {
  	var wep = RD3_DesktopManager.WebEntryPoint;
  	//
  	// Realizzo il sottomenu' e il popover
  	wep.CmdObj.ActiveCommand = null;
  	this.LoadNestedMenu(true, true);
  	//
  	// Imposto e apro il popover
		var w = (RD3_Glb.IsSmartPhone()?wep.WepBox:wep.SideMenuBox).offsetWidth;
		if (w==0 || (RD3_Glb.IsPortrait() && !RD3_Glb.IsSmartPhone()))
			w = 300;
		//
		var nvis = 0;
		for (var i=0;i<this.Commands.length;i++)
		{
			if (this.Commands[i].IsVisible())
				nvis++;
		}
		if (nvis==0)
			nvis=1;
		//
		var h = nvis*44+48;
		var maxh = wep.WepBox.offsetHeight*(RD3_Glb.IsSmartPhone()?0.8:0.5);
		if (h>maxh)
			h=maxh;
		//
		this.Popover.SetWidth(w);
		this.Popover.SetHeight(h);
		var obj = this.GetObjToAttach(node);
    //
		if (obj == null)
		{
		  var x = parseInt(node.getAttribute("xpos"));
      var y = parseInt(node.getAttribute("ypos"));
      //
      obj = new Object();
      obj.offsetWidth = 0;
      obj.offsetHeight = 0;
      obj.x = x;
      obj.y = y;
      obj.Point = true;
		}
		//
		this.Popover.AttachTo(obj);
		this.Popover.Host(null, this.PopupMobileBox, true);
		//
		RD3_DDManager.AddPopup(this.Popover);
		this.Popover.Open();
  }
  else
  {
	  //
	  if (this.IsClosing && this.Gfx)
	    this.Gfx.SetFinished();
	  //
	  // La realizzazione del popup viene fatta dall'animazione
	  this.Gfx = new GFX("popup", true, this, false, null, this.PopupAnimDef);
	  this.Gfx.Node = node;
	  RD3_GFXManager.AddEffect(this.Gfx);
	}
}


// ***************************************************************
// Crea gli oggetti DOM per il popup
// ***************************************************************
Command.prototype.RealizePopupItem = function(parent)
{
  // Creo il div della linea del menu'
  this.PopupItemBox = document.createElement("tr");
  this.PopupItemBox.setAttribute("id", this.Identifier+":tr");
  this.PopupItemBox.className = "popup-menu-item";
  this.PopupItemBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
  //
  // Creo la cella dell'icona
  this.PopupIconCell = document.createElement("td");
  this.PopupIconCell.setAttribute("id", this.Identifier+":tdi");
  this.PopupIconCell.className = "popup-cell-icon";
  //
  // Creo l'img dell'icona
  this.PopupImageBox = document.createElement("img");
  this.PopupImageBox.setAttribute("id", this.Identifier+":pm");
  this.PopupImageBox.className = "popup-menu-image";
  if (this.IsSeparator())
    this.PopupImageBox.style.display="none";
  //
  // Creo la cella del testo
  this.PopupTextCell = document.createElement("td");
  this.PopupTextCell.setAttribute("id", this.Identifier+":txt");
  this.PopupTextCell.className = "popup-cell-text"+(this.IsSeparator()?"-sep":"");
  if (this.IsCmdSet)
    RD3_Glb.AddClass(this.PopupTextCell, "popup-menu-popup");
  //
  // Creo la linea di testo
  this.PopupText = document.createElement("span");
  this.PopupText.setAttribute("id", this.Identifier+":cap");
  this.PopupText.className = "popup-menu-text"+(this.IsSeparator()?"-sep":"");
  //
  // Creo la struttura
  this.PopupIconCell.appendChild(this.PopupImageBox);
  this.PopupTextCell.appendChild(this.PopupText);
  this.PopupItemBox.appendChild(this.PopupIconCell);
  this.PopupItemBox.appendChild(this.PopupTextCell);
  parent.appendChild(this.PopupItemBox);
  //
  // Imposto le varie proprieta' grafiche...
  this.SetVisible();
  this.SetCaption();
  this.SetTooltip();
  this.SetImage(undefined, true);
  this.SetEnabled();
  this.SetClassName();
}


// ********************************************************************************
// Vediamo se il popup e' aperto
// ********************************************************************************
Command.prototype.ClosePopup= function(filtobj)
{ 
  // Vediamo se lo devo chiudere veramente
  var ok = true;
  //
  var v = filtobj;
  while (v && ok)
  {
    if (v==this)
      ok = false
    v = v.ParentCmdSet;
  }
  //
  if (!ok)
    return;
  //
  // Cancello un eventuale timer di apertura...
  if (this.PopupTimer)
  {
    window.clearTimeout(this.PopupTimer);
    this.PopupTimer = 0;
  }  
  //
	// Caso mobile
	if (this.Popover)
	{
		this.Popover.Close();
		return;
	}
  //
  // Se ho un popup aperto lo chiudo con l'animazione
  if (this.PopupContainerBox != null && !this.IsClosing)
  {
    this.IsClosing = true;
    this.Gfx = new GFX("popup", false, this, false, null, this.PopupAnimDef);
    RD3_GFXManager.AddEffect(this.Gfx);
    //
    // Avendo chiuso il popup, se esso originava da una tendina e'
    // opportuno ripristonare gli stili giusti
    this.OnMouseOutObj(null, this.MyBox);
    //
    // Passo il messaggio ai comandi figli
    var n = this.Commands.length;
    for(var i=0; i<n; i++)
    {
      this.Commands[i].ClosePopup(filtobj);
    }
  }
}


// ********************************************************************************
// Ritorna l'oggetto principale del DOM
// ********************************************************************************
Command.prototype.GetDOMObj= function(type)
{ 
  if (type=="toolbar")
    return this.MyToolBox;
  //
  // default=menu
  if (this.CommandLink)
    return this.CommandLink;
  //
  if (this.Level>1 && this.PopupItemBox)
    return this.PopupItemBox;
  //
  return this.MyBox ? this.MyBox : this.MyToolBox;
}


// **********************************************************************
// Gestisco la pressione dei tasti FK
// formidx: indice della form, se -1 allora tutte le form
// frameidx: indice del frame, se -1 allora tutti i frame
// **********************************************************************
Command.prototype.HandleFunctionKeys = function(eve, formidx, frameidx)
{
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var ok = false;
  //
  // Calcolo il numero di FK da 1 a 48
  var fkn = (code-111) + (eve.shiftKey? 12 : 0)  + (eve.ctrlKey? 24 : 0);
  //
  // Sono io?
  ok = fkn==this.FKNum; // deve essere uguale al mio FK
  ok = ok && (this.IsMenu || this.IsToolbar); // deve essere o un menu' o una toolbar
  if (formidx>-1 && frameidx==-1) // Toolbar di form?
    ok = ok && (this.ToolCont==-1 && formidx==this.FormIndex)
  if (formidx>-1 && frameidx>-1) // Toolbar di frame?
    ok = ok && (this.ToolCont==frameidx && formidx==this.FormIndex)
  //
  if (ok)
    this.OnClick(eve);
  //
  // Passo il messaggio a tutti i command figli
  var cmdl = this.Commands.length;
  for (var i = 0; i<cmdl && !ok; i++ )
  {
    ok = this.Commands[i].HandleFunctionKeys(eve, formidx, frameidx);
  }
  //
  return ok;
}


// ********************************************************************************
//  Metodo che verifica se le immagini della toolbar sono state caricate
// ********************************************************************************
Command.prototype.IsToolBarLoaded = function()
{
  var n = this.Commands.length;
  for (var i = 0; i<n; i++ )
  {
    var cmd = this.Commands[i];
    if (cmd.ToolImg && cmd.Image!=""  && !cmd.ToolImg.complete)
      return false;
  }
  //
  return true;
}


// ********************************************************************************
// Metodo chiamato periodicamente: se le immagini della toolbar sono state caricate
// rifa' adattare la form, altrimenti si reimposta per scattare dopo 500 milli
// ********************************************************************************
Command.prototype.ToolbarLoadedUpdate = function()
{ 
  // Verifico se la form c'e' ancora: se non c'e' non faccio nulla e non mi reimposto
  var f = RD3_DesktopManager.ObjectMap["frm:"+this.FormIndex];
  if (f)
  {
    if (this.IsToolBarLoaded())
    {
      // Potrebbe essere stata chiamata da Command::OnAdaptRetina ed esserci un timer pendente, se le immagini ci sono tutte lo annullo
      if (this.ToolTimer)
        window.clearTimeout(this.ToolTimer);
      this.ToolTimer = null;
      //
      f.AdaptToolbarLayout();
      //
      // E' una toolbar di Frame (lo faccio solo per Q e Mob7 dove ho visto dei problemi causati dal retina)
      if (this.ToolCont > 0 && (RD3_Glb.IsQuadro() || RD3_Glb.IsMobile7()))
      {
        var fr = f.Frames[this.ToolCont-1];
        if (fr && fr.UpdateToolbar)
          fr.UpdateToolbar();
      }
    }
    else
    {
      this.ToolTimer = window.setTimeout(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'ToolbarLoadedUpdate', ev, true)"), 100);
    }
  }
}

// ****************************************************************
// Ritorna TRUE se il comando e' un bottone di una toolbar collegata
// ad un frame che utilizza le icone piccole
// ****************************************************************
Command.prototype.UseSmallIcon = function()
{
  var cmd = this;
  if (this.ParentCmdSet)
    cmd = this.ParentCmdSet;
  //
  if (cmd.ToolCont > 0)
  {
    var f = RD3_DesktopManager.ObjectMap["frm:"+cmd.FormIndex];
    if (f)
    {
      var fr = f.Frames[cmd.ToolCont-1];
      if (fr)
        return fr.SmallIcons;
    }
  }
  //
  return false;
}


// ****************************************************************
// Ricalcola la visibilita' dei separatori in base a quella dei menu
// ****************************************************************
Command.prototype.RecalcSeparator = function()
{
  // Se non sono realizzato non faccio nulla
  if (!this.Realized)
    return false;
  //
  // se non sono un CmdSet non faccio nulla
  if (!this.IsCmdSet)
    return;
  //
  if (this.RecalcSeparatorLayout)
  {
    var vis = false;
    //
    // Ciclo su tutti i miei figli: se trovo un menu visibile metto vis a true;
    // se trovo un separatore imposto la sua visibilia' a vis e rimetto vis a false    
    var n = this.Commands.length;
    for (var i=0; i<n; i++)
    {
      var cmd = this.Commands[i];
      //
      if (cmd && !cmd.IsSeparator() && cmd.IsVisible())
        vis = true;
      //
      if (cmd && cmd.IsSeparator())
      {
        // Verifico se dopo questo separatore c'e' un comando visibile: se si allora posso farlo diventare visibile, altrimenti lo nascondo..
        var nextVis = false;
        for (var i2=i+1; i2<n; i2++)
        {
           var cmdNext = this.Commands[i2];
           if (cmdNext && !cmdNext.IsSeparator() && cmdNext.IsVisible())
           {
             nextVis = true;
             break;
           }
        }
        //
        if (vis && !nextVis)
          vis = false;
        //
        // Rendo visibile o invisibile il separatore
        cmd.SetVisible(vis);
        //
        vis = false;
      }
    }
  }
  //
  // Passo la palla ai miei cmdset figli
  var n = this.Commands.length;
  for (var i=0; i<n; i++)
  {
    this.Commands[i].RecalcSeparator();
  }
}


// ****************************************************************
// Torna true se il comando deve mostrare l'acceleratore
// ****************************************************************
Command.prototype.ShowAccell= function() 
{
  return (this.IsMenu && !RD3_DesktopManager.WebEntryPoint.HasSideMenu() && this.Accell!="" && !RD3_Glb.IsTouch());
}


// **********************************************************************
// Gestisco la pressione dell'acceleratore
// **********************************************************************
Command.prototype.HandleAccell = function(eve, code, force)
{
  var ok = false;
  //
  // Solo CMS primo livello
  if ((this.Level>1 || !this.IsMenu || !this.IsCmdSet) && !force)
    return false;
  //
  // Se ho il menu' aperto, provo con loro...
  if (this.PopupContainerBox)
  {
    var n = this.Commands.length;
    for (var i=0; i<n && !ok; i++)
    {
      ok = this.Commands[i].HandleAccell(eve,code,true);
    }
    //
    if (!ok && this.FormList && code>48 && code<=57)
    {
      // Vediamo se e' una formlist...
      var sf = RD3_DesktopManager.WebEntryPoint.StackForm;
      var nn = sf.length;
      var c = 0;
      for(var ii=0; ii<nn && !ok; ii++)
      {
        if (sf[ii].HasFormList())
          c++;
        if (c==(code-48))
        {
          sf[ii].OnFLClick(eve);
          RD3_DesktopManager.WebEntryPoint.CmdObj.ClosePopup();
          ok = true;
        }
      }
    }
  }
  //
  // Gia' gestito...
  if (ok)
    return ok;
  //
  // Vediamo se sono io...
  if (this.Accell!="" && this.Accell.charCodeAt(0)==code)
    ok = true;
  //
  if (ok)
    this.OnClick(eve);
  //
  return ok;
}


// **********************************************************************
// Realizza gli oggetti dell'intero popup menu'
// Ritorno il TBODY per poter aggiungere ulteriori comandi facilmente
// **********************************************************************
Command.prototype.RealizePopupMenu = function()
{
  this.PopupContainerBox = document.createElement("div");
  this.PopupContainerBox.setAttribute("id", this.Identifier+":pp");
  this.PopupContainerBox.className = "popup-menu-container";
  //
  // Se il menu e' TaskBar il popup deve avere z-index 10, in modo da potersi vedere anche sopra alle form modali..
  if (!RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
    this.PopupContainerBox.style.zIndex = 10;
  //
  // Dentro al DIV ci va una table
  var PopupTable = document.createElement("table");
  PopupTable.setAttribute("id", this.Identifier+":pt");
  PopupTable.className = "popup-menu-table";
  //
  var PopupTableBody = document.createElement("tbody");
  PopupTable.appendChild(PopupTableBody);
  //
  // Renderizzo tutti i comandi all'interno della table
  var n = this.Commands.length;
  for (var i = 0; i<n; i++ )
  {
    this.Commands[i].RealizePopupItem(PopupTableBody);
  }
  //
  this.PopupContainerBox.appendChild(PopupTable);
  //
  this.SetClassName();
  //
  return PopupTableBody;
}


// ********************************************************************************
// Chiude gli altri popup del padre a parte questo
// ********************************************************************************
Command.prototype.CloseOtherPopup= function()
{ 
  var n = this.ParentCmdSet.Commands.length;
  for (var i = 0; i<n; i++ )
  {
    var c = this.ParentCmdSet.Commands[i];
    //
    if (c!=this)
    {
      c.ClosePopup();      
      RD3_Glb.RemoveClass(c.PopupTextCell, "popup-menu-hover");
    }
  }
}

// *********************************************************
// Imposta il tooltip
// *********************************************************
Command.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "")
    return false;
  //
  var s = RD3_KBManager.GetFKTip(this.FKNum);
  if (s=="" && this.CommandCode!="")
    s = " ("+ this.CommandCode+")";
  //
  tip.SetTitle(this.Caption);
  tip.SetText(this.Tooltip+s);
  //
  // E' stato chiesto il tooltip per la toolbar
  if (obj == this.MyToolBox || obj == this.ToolImg || obj == this.ToolText)
  {
    tip.SetObj(this.MyToolBox);
    obj = this.MyToolBox;
    //
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + ((obj.offsetWidth-(this.ShowNames?0:4))/2), RD3_Glb.GetScreenTop(obj));
    tip.SetPosition(0);
    //
    return true;
  }
  //
  // E' stato chiesto il tooltip per il menu
  if (obj == this.CmdBox || obj == this.CommandLink || obj == this.CommandImg || obj == this.CommandImgDX || obj == this.BranchImg)
  {
    tip.SetObj(this.CmdBox);
    obj = this.CmdBox;
    //
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + obj.offsetWidth, RD3_Glb.GetScreenTop(obj) + ((obj.offsetHeight)/2));
    tip.SetPosition(1);
    return true;
  }
  //
  // E' stato chiesto il tooltip per il popup
  if (obj == this.PopupItemBox || obj == this.PopupIconCell || obj == this.PopupImageBox || obj == this.PopupTextCell || obj == this.PopupText)
  {
    tip.SetObj(this.PopupItemBox);
    obj = this.PopupItemBox;
    //
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + obj.offsetWidth, RD3_Glb.GetScreenTop(obj) + (obj.offsetHeight/2));
    tip.SetPosition(1);
    return true;
  }
  //
  // E' stato chiesto il tooltip per la button bar
  if (this.Button)
  {
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + (obj.clientWidth/2), RD3_Glb.GetScreenTop(obj) + obj.clientHeight);
    tip.SetPosition(2);
    return true;
  }
}


// ***********************************************
// Trova l'oggetto a cui attaccare il popup menu
// ***********************************************
Command.prototype.GetObjToAttach = function(node)
{
  var id = ""
	if (node instanceof Command)
    id = node.Identifier;
  else
    id = node.getAttribute("objid");
  //    
  // Dovrei identificare l'oggetto per sapere dove aprirlo
  // Vediamo a quale oggetto devo essere attaccato
  var obj = RD3_DesktopManager.ObjectMap[id];
  var dobj = (obj && obj.GetDOMObj)? obj.GetDOMObj((obj.IsToolbar)?"toolbar":""):null;
  //
  // Se non ho trovato l'oggetto nella mappa provo a cercarlo nel DOM
  if (!obj)
    dobj = document.getElementById(id);
  //
  return dobj;
}


// ***********************************************
// Realizza un Popup Menu
// Chiamato dal GFX
// ***********************************************
Command.prototype.RealizePopup = function(node)
{
  var dir = 0;
  var form = "";
  var id = ""
  var x = 0;
  var y = 0;
  var fl = false;
  //
  if (!node)
    return;
  //
  if (node instanceof Command)
  {
    id = node.Identifier;
    dir = (node.Level==1)?1:0;
    fl = node.FormList;
  }
  else
  {
    dir = parseInt(node.getAttribute("dir"));      
    form = node.getAttribute("form");
    id = node.getAttribute("objid");
    x = parseInt(node.getAttribute("xpos"));
    y = parseInt(node.getAttribute("ypos"));
  }
  //    
  // Dovrei identificare l'oggetto per sapere dove aprirlo
  // Vediamo a quale oggetto devo essere attaccato
  var obj = RD3_DesktopManager.ObjectMap[id];
  var dobj = (obj && obj.GetDOMObj)? obj.GetDOMObj((obj.IsToolbar)?"toolbar":""):null;
  //
  // Il server manda i val: riferendosi alle righe visibili del pannello, quindi se la riga base e' 50 comunque ci arriva un val:2 per la seconda riga, invece di un val:52.
  // Questo da' problemi solo se si fa il refresh: facendolo si cancellano i valori vecchi e se il pannello e' scrollato poi non si trova niente.. 
  // In questo caso dobbiamo provare a risalire al pannello, vedere in che posizione si trova e poi provare a cercare il valore giusto..
  if (!obj && id && id.substring(0, 4)=== "val:") 
  {
    var components = id.split(":");
    if (components.length == 5) 
    {
      var pan = RD3_DesktopManager.ObjectMap[("pan:" + components[3] + ":" + components [4])];
      var fld = RD3_DesktopManager.ObjectMap[("fld:" + components[2] + ":" + components[3] + ":" + components [4])];
      if (pan && fld)
      {
        obj = RD3_DesktopManager.ObjectMap[("val:" + (pan.ActualPosition + parseInt(components[1]) - 1) + ":" + components[2] + ":" + components[3] + ":" + components [4])];
        //
        // Non posso usare GetDOMObj perche' e' fatta per essere chiamata solo per i PValue da 0 a VisibleRows, quindi devo essere io 
        // a cercare nel campo la cella giusta (solo se sono in LISTA + LISTLIST
        if (pan.PanelMode != RD3_Glb.PANEL_FORM && fld.ListList)
          dobj = fld.PListCells[parseInt(components[1]) - 1].GetDOMObj();
      }
    }
  }
  //
  // Se non ho trovato l'oggetto nella mappa provo a cercarlo nel DOM
  if (!obj)
  {
    dobj = document.getElementById(id);
    if (dobj)
      obj = RD3_KBManager.GetObject(dobj);
  }
  //
  // Adesso apro il popup, creandolo
  var tbody = this.RealizePopupMenu();
  //
  // Devo aggiungere la form list
  if (fl)
  {
    var sf = RD3_DesktopManager.WebEntryPoint.StackForm;
    var nn = sf.length;
    var c=0;
    for(var ii=0; ii<nn; ii++)
    {
      if (sf[ii].HasFormList())
        sf[ii].RealizeFormListPopup(tbody, ++c);
    }
  }
  //
  // calcolo in base all'oggetto
  var mx = RD3_DesktopManager.WebEntryPoint.WepBox.offsetWidth;
  var my = RD3_DesktopManager.WebEntryPoint.WepBox.offsetHeight;  
  //
  // Visualizzo il popup all'interno del WEPBOX, altrimenti non calcola le dimensioni
  this.PopupContainerBox.style.visibility = "hidden";
  document.body.appendChild(this.PopupContainerBox);
  //
  if (dobj)
  {
    var ancora = true;
    var giro = 0;
    while (ancora)
    {
      ancora = false;
      giro++;
      //
      // Tengo conto anche di eventuali offset dovuti alle scrollbar, chiedendoli all'oggetto di modello
      // (per ora AccountOverFlowX e AccountOverFlowY ce li ha solo il TreeNode che li usava per il D&D)
      var ovx = obj.AccountOverFlowX ? obj.AccountOverFlowX() : 0;
      var ovy = obj.AccountOverFlowY ? obj.AccountOverFlowY() : 0;
      //
      x = RD3_Glb.GetScreenLeft(dobj) - ovx;
      y = RD3_Glb.GetScreenTop(dobj) - ovy;
      //
      // Interpreto la direzione
      switch (dir)
      {
        case 0: // Right
          x += dobj.offsetWidth;
        break;
        
        case 1: // Bottom
          y += dobj.offsetHeight;
        break;
        
        case 2: // Left
          x -= this.PopupContainerBox.offsetWidth;
        break;
        
        case 3: // Top
          y -= this.PopupContainerBox.offsetHeight;
        break;
      }
      //
      // Controllo di non essere uscito dallo schermo
      // faccio al max 2 giri per far prevalere quello che ci sta meglio
      // oppure l'impostazione dell'utente
      if (giro<3)
      {
        if (dir==1 && y+this.PopupContainerBox.offsetHeight>my)
        {
          dir=3;
          ancora = true;
        }
        if (dir==3 && y<0)
        {
          dir=1;
          ancora = true;
        }
        if (dir==0 && x+this.PopupContainerBox.offsetWidth>mx)
        {
          dir=2;
          ancora = true;
        }
        if (dir==2 && x<0)
        {
          dir=0;
          ancora = true;
        }
      }
      else {
        // Sono arrivato all'ultimo giro, in questo caso mi assicuro comunque di non essere uscito dallo schermo
        if (dir == 1 || dir == 3) 
        {
          if (y+this.PopupContainerBox.offsetHeight>my)
           y = y - (y + this.PopupContainerBox.offsetHeight - my);
          if (y < 0)
            y = 0;
        }
      }
    }    
  }
  //
  // Mi memorizzo la direzione: verra' utilizzata per l'animazione
  this.Direction = dir;
  //
  this.PopupContainerBox.style.left = x+"px";
  this.PopupContainerBox.style.top =  y+"px";
  if (this.PopupContainerBox.firstChild)
    this.PopupContainerBox.style.width = this.PopupContainerBox.firstChild.clientWidth+"px";
  //
  this.PopupContainerBox.style.visibility = "visible";
  //
  // Gestisco la visibilita' dei separatori
  this.RecalcSeparator();
  //
  this.AdaptLayout();
  //
  // Riverifico la posizione dopo aver dimensionato correttamente il menu popup
  if (dir==1 || dir==3) // Top o Bottom
  {
    // L'impostazione bottom o top verifica se usciamo dallo schermo in basso o in alto.. ma dobbiamo considerare anche se
    // usciamo a destra o sinistra..
    if (x+this.PopupContainerBox.offsetWidth>mx) 
    {
      // Sforiamo sulla destra.. dobbiamo spostare la X per recuperare spazio
      x -= x + this.PopupContainerBox.offsetWidth - mx;
      this.PopupContainerBox.style.left = x+"px";
    }
    if (x<0) 
    {
      // Sforiamo sulla sinistra.. dobbiamo spostare la X
      x = 0;
      this.PopupContainerBox.style.left = x+"px";
    }
  }
  if (dir==0 || dir==2) // Rigth o Left
  {
    // L'impostazione right o left verifica se usciamo dallo schermo a destra o sinistra, dobbiamo verificare se 
    // sforiamo anche in basso o in alto
    if (y+this.PopupContainerBox.offsetHeight>my) 
    {
      // Sforiamo in basso.. dobbiamo spostare la Y per recuperare spazio
      y -= y+this.PopupContainerBox.offsetHeight - my;
      this.PopupContainerBox.style.top =  y+"px";
    }
    if (y<0) 
    {
      // Sforiamo in alto.. dobbiamo spostare la Y
      y = 0;
      this.PopupContainerBox.style.top =  y+"px";
    }
  }
}

// *******************************************************************************
// Metodo chiamato dal DDManager quando viene iniziato un D&D
// ident: id dell'oggetto su cui l'utente ha cliccato per iniziare il D&D
// *******************************************************************************
Command.prototype.IsDraggable = function (ident)
{
  // il comando e' draggabile se:
  // - candrag del commandset padre e' attivo
  // - non e' un commandset
  var ok = !this.IsCmdSet && this.ParentCmdSet && this.ParentCmdSet.CommandCanDrag;
  //
  // Mi devo memorizzare se vengo da Toolbar o Comando..
  if (ok)
  {
    if (ident.indexOf(":header")!=-1 || ident.indexOf(":image")!=-1 || ident.indexOf(":link")!=-1 || (RD3_Glb.IsMobile() && ident==this.Identifier))
      this.DragMenu = true;
    else
      this.DragMenu = false;
  }
  return ok;
}

// *************************************************
// Restituisce l'oggetto da trascinare
// *************************************************
Command.prototype.DropElement = function ()
{
  if (this.DragMenu)
    return this.CmdBox ? this.CmdBox : this.MyBox;
  else if (this.MyToolBox)
    return this.MyToolBox;
  //
  return this.CmdBox;
}


// *************************************************
// Verifica se il comando puo' essere draggato 
// *************************************************
Command.prototype.ComputeDropList = function(list, dragobj) 
{
  // Un CommandSet deve solo passare il messaggio ai suoi figli
  if (this.IsCmdSet)
  {
    var n = this.Commands.length;
    for(var i=0; i<n; i++)
    {
      this.Commands[i].ComputeDropList(list, dragobj);
    }
  }
  else
  {
    // Se non sono visibile o mio padre non accetta il drag ho finito
    if (!this.ParentCmdSet.CommandCanDrop || !this.IsVisible() || (this.IsMenu && RD3_DesktopManager.WebEntryPoint.MenuType == RD3_Glb.MENUTYPE_MENUBAR))
      return;
    //
    list.push(this);
    //
    // Aggiungo le mie coordinate (sia come menu che come toolbar)
    if (this.IsMenu)
    {
      var o = this.CmdBox ? this.CmdBox : this.MyBox;
      this.AbsLeft = RD3_Glb.GetScreenLeft(o,true);
      this.AbsTop = RD3_Glb.GetScreenTop(o,true);
      this.AbsRight = this.AbsLeft + o.offsetWidth - 1;
      this.AbsBottom = this.AbsTop + o.offsetHeight - 1;
    }
    //
    if (this.IsToolbar)
    {
      var o = this.MyToolBox;
      this.AbsLeft2 = RD3_Glb.GetScreenLeft(o);
      this.AbsTop2 = RD3_Glb.GetScreenTop(o);
      this.AbsRight2 = this.AbsLeft2 + o.offsetWidth - 1;
      this.AbsBottom2 = this.AbsTop2 + o.offsetHeight - 1;
    }
  }
}


// ********************************************************************************
// Torna true se questo elemento e' quello attivo nel menu' principale mobile
// ********************************************************************************
Command.prototype.IsActiveMenu= function()
{ 
	return RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand == this;
}


// ********************************************************************************
// Il comando e' stato toccato dall'utente
// ********************************************************************************
Command.prototype.OnTouchDown= function(evento)
{ 
	if (!RD3_DesktopManager.WebEntryPoint.CmdObj.Expanding && !this.ShowGroupedMenu())
	{
		RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand = this;
		this.SetMenuClass();	
	}
	return true;
}

// ********************************************************************************
// Il comando e' stato smesso di toccare dall'utente
// ********************************************************************************
Command.prototype.OnTouchUp= function(evento, click)
{ 
	if (!RD3_DesktopManager.WebEntryPoint.CmdObj.Expanding && !this.ShowGroupedMenu())
	{
		if (click)
		{
			this.OnClick(evento);
		}
		else
		{
			RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand = null;
			this.SetMenuClass();	
		}
	}
	return true;
}

// ********************************************************************************
// Se il popup si e' chiuso, mi dimentico della mia referenza
// ********************************************************************************
Command.prototype.OnClosePopup= function(popup)
{ 
	if (popup==this.Popover)
	{
		this.Popover = null;
		//
		// Derealizzo tutti i comandi contenuti
		// per ripartire da una situazione "pulita"
	  for(var i=0; i<this.Commands.length; i++)
	    this.Commands[i].Unrealize(true);
	  //
	  // Distruggo il menu box
	  if (this.MenuBox)
	  {
			this.MenuBox.parentNode.removeChild(this.MenuBox);
			this.MenuBox = null;
		}
		if (this.PopupMobileBox)
	  {
	  	if (this.PopupMobileBox.parentNode)
				this.PopupMobileBox.parentNode.removeChild(this.PopupMobileBox);
			this.PopupMobileBox = null;
		}		
	}
}


// ********************************************************************************
// Torna vero se questo command set deve mostrare i comandi interni
// come menu' raggruppato
// ********************************************************************************
Command.prototype.ShowGroupedMenu= function()
{ 
  // Mostro il menu raggruppato solo se sono di primo livello, l'applicazione ha il menu raggruppato e sono un menu (no toolbar e no menu popup)
	return this.ParentCmdSet==null && RD3_DesktopManager.WebEntryPoint.CmdObj.ShowGroups && this.IsMenu;
}

// ********************************************************************************
// Rispondo true se sono al primo livello
// ********************************************************************************
Command.prototype.IsFirstLevel= function()
{ 
	return this.ParentCmdSet==null || this.ParentCmdSet.ShowGroupedMenu();
}


// ********************************************************************************
// Ritorna True se il comando appartiene ad una SubForm e questa e' visibile
// ********************************************************************************
Command.prototype.CheckSubForm= function()
{ 
	if (this.FormIndex < 65536)
	  return false;
	//
	var frmId = "frm:"+this.FormIndex;
	var frm = RD3_DesktopManager.ObjectMap[frmId];
	//
	if (frm == null)
	  return false;
	//
	var masterFrm = frm.GetMasterForm();
  if (masterFrm.Realized && !frm.Realized)
    return false;
  //
  var fnd = false;
  var actf = RD3_DesktopManager.WebEntryPoint.ActiveForm;
  if (actf && actf.IdxForm == masterFrm.IdxForm)
    fnd = true;
  //
  var nf = fnd ? 0 : RD3_DesktopManager.WebEntryPoint.StackForm.length;
  for (var t=0;t<nf;t++)
  {
    var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
    if (f.Docked && f.IdxForm == masterFrm.IdxForm)
    {
      fnd = true;
      break;
    }
  }
  //
  return fnd;
}

// *******************************************************************
// Gestisce il comando back girandolo eventualmente ai figli; 
// ritorna True se e' stato gestito
// *******************************************************************
Command.prototype.HandleBackButton = function() 
{
  // Se non sono espanso o sono un comando non faccio nulla
  if (!this.Expanded || !this.IsCmdSet || !this.IsMenu)
    return false;
  //
  // Sono espanso: per prima cosa verifico i miei figli.. in questo modo
  // il back lavora sempre sulle foglie..
  var n = this.Commands.length;
	for  (var i=0; i<n; i++)
	{
		var c = this.Commands[i];
		if (c.HandleBackButton())
		  return true;
	}
	//
	// Nessuno dei miei figli ha gestito il back.. o sono dei comandi o non sono espansi..
	this.OnBack({});
	return true;
}


// *******************************************************************
// Chiamato quando cambia il colore di accento
// *******************************************************************
Command.prototype.AccentColorChanged = function(reg, newc) 
{
	// Modifico lo stile di tutti i comandi se sono selezionati
	if (this.Commands)
	{
		var n = this.Commands.length;
		for (var i=0; i<n; i++)
			this.Commands[i].AccentColorChanged(reg, newc);
	}
	//
	if (this.MyBox)
	{
		var s = this.MyBox.style.cssText;
	  var ns = s.replace(reg,newc);
	  if (s!=ns)
	  	this.MyBox.style.cssText = ns;
	}
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
Command.prototype.OnAdaptRetina = function(w, h, par)
{
  if (this.MyBox)
    this.MyBox.style.backgroundSize = w + "px " + h +"px" + (par?", 10px 16px":"") + (this.IsActiveMenu()?", 100%":"");
  //
  if (this.ToolImg)
  {
    var usemask = !(RD3_Glb.IsAndroid() || RD3_Glb.IsIE() || RD3_Glb.IsEdge()) || RD3_Glb.IsAndroid(4,4,0);
    if (RD3_Glb.IsMobile7() && usemask)
    {
      this.ToolImg.width = w;
      this.ToolImg.height = h;
      this.ToolImg.style.webkitMaskSize = w + "px " + h +"px";
      this.ToolImg.style.webkitMaskRepeat = "no-repeat";
    }
    else if (RD3_Glb.IsQuadro() || (RD3_Glb.IsMobile7() && !usemask))
    {
      this.ToolImg.width = w;
      this.ToolImg.height = h;
      this.ToolImg.style.display = "";
    }
    //
    // Sono arrivate le immagini di una Toolbar, devo far aggiornare la Form o il Frame
    if ((RD3_Glb.IsQuadro() || RD3_Glb.IsMobile7()) && this.IsToolbar && !this.IsCmdSet && this.ParentCmdSet!=null)
      this.ParentCmdSet.ToolbarLoadedUpdate();
  }
}

// *******************************************************************
// Chiamato quando il server chiede di rimuovere il comando/commandset
// *******************************************************************
Command.prototype.DeleteCommand = function()
{
  if (this.ParentCmdSet)
  {
    // Mi rimuovo da mio padre, lo devo fare prima dell'urealize perche' altrimenti perdo il puntatore
    var parentIdx = this.ParentCmdSet.Commands.indexOf(this);
    if (parentIdx >= 0)
      this.ParentCmdSet.Commands.splice(parentIdx, 1);
  }
  else 
  {
    // Provo a cercarmi nell'array globale e a togliermi da li'
    var cmsIdx = RD3_DesktopManager.WebEntryPoint.CmdObj.CommandSets.indexOf(this);
    if (cmsIdx >= 0)
      RD3_DesktopManager.WebEntryPoint.CmdObj.CommandSets.splice(cmsIdx, 1);
  }
  //
  // Rimuovo i miei figli se presenti (la Unrealize in questo caso particolare non passerebbe il messaggio)
  for(var i=0; i<this.Commands.length; i++)
    this.Commands[i].Unrealize();
  //
  // Mi rimuovo
  this.Unrealize();
}

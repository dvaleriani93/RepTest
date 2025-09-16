// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe CmdList: gestisce la lista in memoria
// di tutti i command set dell'applicazione
// ************************************************

function CommandList() 
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = "cmh";        // Identificatore di questo oggetto
  this.SuppressMenu = false;      // Se vero il menu' laterale non sara' visibile
  this.AutoSuppress = true;       // vero se in caso mobile il menu' si sopprime quando si gira il dispositivo
  this.ForceVerticalMenu = false; // vero se vogliamo forzare il menu verticale anche con l'app mobile orizzontale
  //
  this.MenuButton = null;     // Bottone per far apparire il menu' principale (o la form docked) in caso di menu' soppresso
  //
  // Oggetti secondari gestiti da questo oggetto di modello
  this.CommandSets = new Array(); // Elenco dei command set (di primo livello)
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo oggetto
  this.ClickEventDef = RD3_Glb.EVENT_CLIENTSIDE; // Il click sul suppressmenu deve avvenire come evento server asincrono
  //
  // Variabili di questo oggetto
  this.ToolbarHeight = 0;         // Altezza della Toolbar, impostata nell'AdaptLayout
  this.MenuBarOpen = false;       // Vera se la menubar e' aperta o meno
  this.ForceMenuBar = false;      // Vera se la menubar e' aperta nello smartphone
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Indica quale comando e' attivo nel menu' principale di tipo mobile
  this.ActiveCommand = null;
  this.IDScroll = null;           // Oggetto scroller per mobile
  this.Expanding = false;         // Vero durante l'espansione o il collassamento di un menu'
  this.ShowGroups = false;       // Menu' mobile a gruppi?
  //
  this.ClientCommands = new HashTable(true); // Lista dei command set creati lato client (popup client)
}


// *******************************************************************
// Inizializza questo CommandList leggendo i dati da un nodo <cmh> XML
// *******************************************************************
CommandList.prototype.LoadFromXml = function(node, torealize) 
{
  if (node.nodeName != this.Identifier)
    return;
  //
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
      case "cms":
      {
        // Leggo il commandset contenuto (potrebbe gia' esistere)
        var newcmd = RD3_DesktopManager.ObjectMap[objnode.getAttribute("id")];
        if (newcmd)
        {
          // Lo sostituisco, quindi dovro' derealizzare il precedente
          if (torealize)
            newcmd.Unrealize();
        }
        else
        {          
          // Creo il nuovo timer
          newcmd = new Command();
          this.CommandSets.push(newcmd);
        }
        newcmd.LoadFromXml(objnode);
        //
        if (torealize)
          newcmd.Realize(RD3_DesktopManager.WebEntryPoint.MenuBox, RD3_DesktopManager.WebEntryPoint.ToolBarBox);
      }
      break;
    }
  }    
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
CommandList.prototype.ChangeProperties = function(node)
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
CommandList.prototype.LoadProperties = function(node)
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
      case "sup": this.SetSuppressMenu(valore=="1", true); break;
      
      case "clk": this.ClickEventDef = parseInt(attrnode.nodeValue); break;
      
      case "sma": RD3_ClientParams.GFXDef["sidebar"] = valore; break;
      
      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
      break;
    }
  }
}


// ***************************************************************
// Aggiunge un nuovo figlio a questo oggetto
// ***************************************************************
CommandList.prototype.InsertChild = function(node)
{
  var objlist = node.childNodes;
  var n = objlist.length;
  //
  // Ciclo su tutti i nodi che rappresentano oggetti figli
  for (var i=0; i<n; i++) 
  {
    var objnode = objlist.item(i);
    var nome = objnode.nodeName;
    if (nome == "cms")
    {  
      var wasMenu = this.HasMenu();
      //
      // Creo il nuovo command set
      var newcmd = new Command();
      this.CommandSets.push(newcmd);
      newcmd.LoadFromXml(objnode);
      //
      if (this.Realized)
        newcmd.Realize(RD3_DesktopManager.WebEntryPoint.MenuBox, RD3_DesktopManager.WebEntryPoint.ToolBarBox);
      //
      // Se il comando e' di form, lo comunico
      if (newcmd.ToolCont != -1)
        this.ActiveFormChanged();
      //
      // Se e' il primo menu (sono passato da non averlo ad averne uno) "spingo" il suppress menu cosi'
      // il menu "appare"
      if (!wasMenu && this.HasMenu())
        this.SetSuppressMenu();
    }
  }
}


// *******************************************************************
// Setter del SuppressMenu
// *******************************************************************
CommandList.prototype.SetSuppressMenu = function(value, fromSrv) 
{
  if (fromSrv)
    this.ForceVerticalMenu = value;
  //
  if (value == "auto" && this.AutoSuppress)
  {
    if (!RD3_DesktopManager.WebEntryPoint.UseZones())
      value = this.ShouldSuppressMenu();
    else
      value = false;
    //
    this.Expanding = false;
  }
  //
  var old = this.SuppressMenu;
  if (value!=undefined)
    this.SuppressMenu = value;
  //
  // Se la lista dei command set e' gia' stata realizzata, aggiusto l'aspetto visuale 
  if (this.Realized)
  {
    // Considero anche il widgetmode
    var sup = (this.SuppressMenu || RD3_DesktopManager.WebEntryPoint.WidgetMode);
    //
    // In effetti mostro la barra solo se c'e' almeno un comando di menu' visibile
    var vis = this.HasMenu();
    if (!sup && !vis)
      sup = true;
    //
    // Il SuppressMenuBox potrebbe non esserci: l'utente potrebbe aver customizzato l'header
    var box = RD3_DesktopManager.WebEntryPoint.SuppressMenuBox;
    if (box)
    {
      // Se il menu' e' a dx, le immagini sono al contrario
      if (!RD3_Glb.IsMobile())
      {
        if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_LEFTSB)
          box.src = RD3_Glb.GetImgSrc((this.SuppressMenu)?"images/showmenu.gif":"images/hidemenu.gif");
        else
          box.src = RD3_Glb.GetImgSrc((this.SuppressMenu)?"images/hidemenu.gif":"images/showmenu.gif");
      }
      RD3_TooltipManager.SetObjTitle(box, (this.SuppressMenu)?RD3_ServerParams.MostraMenu:RD3_ServerParams.NascondiMenu);
    }
    // 
    // Animo solo se sono nella Realize oppure se e' cambiato il valore di suppressmenu
    // Caso particolare, siccome il valore di sup cambia anche a seconda della visibilta' dei comandi ma questa informazione non viene cachata da nessuna parte
    // potrebbe succedere che il suppressmenu non e' cambiato ma comunque bisogna mostrare il menu, perchè in realtà era nascosto..
    var forceMenu = (this.SuppressMenu==old && !sup && RD3_Glb.IsMobile() && !RD3_Glb.IsSmartPhone() && RD3_DesktopManager.WebEntryPoint.SideMenuBox.style.display=="none");
    if (this.SuppressMenu!=old || value==undefined || forceMenu)
    {
      // Faccio lo skip dell'animazione se non c'e' nessun comando visibile oppure se sono nella Realize (value==undefined)
      // oppure se il menu e' sopra o sotto
      if (RD3_Glb.IsSmartPhone())
      {
        // Nel caso phone, avviene un animazione
        this.SlideMenu(!sup);
      }
      else
      {
        var skipanim = (value==undefined) || !vis || RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_MENUBAR || RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR;
        var fx = new GFX("sidebar", !sup, RD3_DesktopManager.WebEntryPoint.SideMenuBox, skipanim);
        RD3_GFXManager.AddEffect(fx);
        //
        // In caso mobile devo nascondere anche la barra dell'applicazione
        if (RD3_Glb.IsMobile())
        {
         RD3_DesktopManager.WebEntryPoint.HeaderBox.style.display = sup?"none":"";
         this.ShowMenuButton();
        }
      }
    }
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM, mentre parenttool indica dove devono
// essere realizzati se si tratta di Toolbar
// ***************************************************************
CommandList.prototype.Realize = function(parent, parenttool)
{
  // Io non ho oggetti visuali quindi passo subito a fare realizzare i miei figli
  if (RD3_Glb.IsMobile())
  {
    // In caso mobile creo la lista dei commandset di primo livello
    // all'interno del menu' container
    this.RealizeMobileMenu(this.CommandSets, parent);
    //
    if (this.AutoSuppress)
    {
      this.MenuButton = document.createElement("div");
      if (RD3_Glb.IsSmartPhone())
      {
        // Menu' button con freccia indietro
        this.MenuButton.id = "menu-button-container";
        this.MenuButtonArrow = document.createElement("div");
        this.MenuButtonButton = document.createElement("div");
        this.MenuButtonArrow.className = "menu-back-button-arrow";
        this.MenuButtonButton.className = "menu-back-button";
        this.MenuButton.appendChild(this.MenuButtonArrow);
        this.MenuButton.appendChild(this.MenuButtonButton);
      }
      else
      {
        // Menu' button "semplice"
        this.MenuButton.id = "menu-button";
      }
      //
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        this.MenuButton.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMenuButton', ev)");
      else
        this.MenuButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMenuButton', ev)");
      //
      // MenuButton viene aggiunto e posizionato dalla prima finestra attiva
    }
  }
  else
  {
    var n = this.CommandSets.length;
    for(var i=0; i<n; i++)
    {
      this.CommandSets[i].Realize(parent, parenttool);
    }
  }
  //
  // Eseguo l'impostazione iniziale delle mie proprieta'
  this.Realized = true;
  this.SetSuppressMenu();
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
CommandList.prototype.AdaptLayout = function()
{ 
  var sgt = false;      // true per mostrare la toolbar globale
  //
  // Leggo l'altezza della toolbar
  this.ToolbarHeight = RD3_DesktopManager.WebEntryPoint.ToolBarBox.offsetHeight;
  //
  // Aggiusto le immagini nei separatori fra i menu' di primo livello
  this.AdaptFirstLevelSeparator();
  //
  // Faccio adattare i miei figli
  var n = this.CommandSets.length;  
  for(var i=0; i<n; i++)
  {
    var c = this.CommandSets[i];
    //
    // Faccio adattare i miei figli
    c.AdaptLayout();
    //
    // Verifico se occorre mostrare la toolbar globale o no
    // Considero i CommandSet globali di tipo toolbar
    if (!sgt && c.IsToolbar && c.ToolCont < 0)
      sgt = sgt || c.IsVisible();
  }
  //
  RD3_DesktopManager.WebEntryPoint.ToolBarBox.className = (sgt) ? "" : "toolbar-container-invisible";
  this.ToolbarHeight = RD3_DesktopManager.WebEntryPoint.ToolBarBox.offsetHeight;
}


// ********************************************************************
// Aggiusta le immagini nei separatori fra i menu' di primo livello
// ********************************************************************
CommandList.prototype.AdaptFirstLevelSeparator = function()
{
  var n = this.CommandSets.length;
  var first = true;
  for(var i=0; i<n; i++)
  {
    var c = this.CommandSets[i];
    //
    // Aggiusto le immagini nei separatori fra i menu' di primo livello
    // La prima immagine deve essere nascosta, le altre visibili
    if (c.IsVisible() && c.IsMenu && !RD3_Glb.IsMobile())
    {
      if (c.MenuSep)
        c.MenuSep.className = "menu-separator-" + ((first) ? "first" : "level-"+c.Level);
      if (c.MenuSepImg)
        c.MenuSepImg.className = "menu-separator-img" + ((first) ? "-first" : "");
      first = false;
    }
  }
}

// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
CommandList.prototype.Unrealize = function()
{ 
  if (this.IDScroll)
    this.IDScroll.Unrealize();
  //  
  // Passo il messaggio a tutti i miei figli
  var n = this.CommandSets.length;
  for (var i = 0; i < n; i++)
  {
    this.CommandSets[i].Unrealize();
  }
  //
  this.ClosePopup();
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  this.Realized = false;
}


// ********************************************************************************
// Chiude gli eventuali popup aperti
// ********************************************************************************
CommandList.prototype.ClosePopup = function(filtobj)
{ 
  // Passo il messaggio a tutti i miei figli
  var n = this.CommandSets.length;
  for (var i = 0; i < n; i++)
  {
    this.CommandSets[i].ClosePopup(filtobj);
  }
  //
  // Nascondo anche il calendario
  if (RD3_DesktopManager.WebEntryPoint.CalPopup)
  {
    if (RD3_DesktopManager.WebEntryPoint.CalPopup.getAttribute("idjustopened")=="1")
      RD3_DesktopManager.WebEntryPoint.CalPopup.setAttribute("idjustopened", "");
    else    
      RD3_DesktopManager.WebEntryPoint.CalPopup.style.display = "none";
  }
  //
  // e il task bar menu
  if (RD3_DesktopManager.WebEntryPoint.TaskbarMenuBox && filtobj==null)
  {
    var fx = new GFX("taskbar", false, RD3_DesktopManager.WebEntryPoint.TaskbarMenuBox, false);
    RD3_GFXManager.AddEffect(fx);
  }
  //
  n = this.ClientCommands.length;
  for (var i=0; i<n; i++)
    this.ClientCommands.GetItem(i).ClosePopup(filtobj);
  //
  this.MenuBarOpen = false;
}


// ********************************************************************************
// Segnala che la form attiva e' cambiata: cicla su tutti i figli passandogli il 
// messaggio
// ********************************************************************************
CommandList.prototype.ActiveFormChanged = function()
{ 
  var n = this.CommandSets.length;
  for(var i=0; i<n; i++)
  {
    var c = this.CommandSets[i];
    //
    c.ActiveFormChanged();
  }
}


// ********************************************************************************
// Gestore evento di click sul bottone suppressmenu
// ********************************************************************************
CommandList.prototype.OnClick= function(evento)
{ 
  var ev = new IDEvent("clk", this.SuppressMenu?"cmh.exp":"cmh.con", evento, this.ClickEventDef);
  //
  if (ev.ClientSide)
  {
    // L'esecuzione locale apre o chiude l'intera menu' bar
    this.SetSuppressMenu(!this.SuppressMenu);
    //
    // Forzo il ricalcolo se cambia la larghezza della pagina
    RD3_DesktopManager.WebEntryPoint.AfterProcessResponse(true);
  }
}


// **********************************************************************
// Gestisco la pressione dei tasti FK
// formidx: indice della form, se -1 allora tutte le form
// frameidx: indice del frame, se -1 allora tutti i frame
// **********************************************************************
CommandList.prototype.HandleFunctionKeys = function(eve, formidx, frameidx)
{
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var ok = false;
  //
  // Passo il messaggio a tutti i cmdset
  var n = this.CommandSets.length;
  for(var i=0; i<n && !ok; i++)
  {
    var c = this.CommandSets[i];
    //
    ok = c.HandleFunctionKeys(eve, formidx, frameidx);
  }
  //
  return ok;
}


// *******************************************************************
// Gestione acceleratori
// *******************************************************************
CommandList.prototype.HandleAccell = function(eve, code) 
{
  // Acceleratori gestiti solo se menu' TOP
  if (RD3_DesktopManager.WebEntryPoint.MenuType!=RD3_Glb.MENUTYPE_MENUBAR)
    return false;
  //
  // Se c'e' la tendina aperta e premo ESC, allora la chiudo
  if (this.MenuBarOpen && code==27)
  {
    this.ClosePopup();
    return true;
  }
  //
  var ok = false;
  //
  // Passo il messaggio a tutti i cmdset
  var n = this.CommandSets.length;
  for(var i=0; i<n && !ok; i++)
  {
    var c = this.CommandSets[i];
    //
    ok = c.HandleAccell(eve, code);
  }
  //
  return ok;
}


// *******************************************************************
// Gestione Drop generico
// *******************************************************************
CommandList.prototype.ComputeDropList = function(list, dragobj) 
{
  // Passo il messaggio a tutti i cmdset
  var n = this.CommandSets.length;
  for(var i=0; i<n; i++)
  {
    this.CommandSets[i].ComputeDropList(list, dragobj);
  }
}


// *************************************************************************
// Una form multipla si e' chiusa: devo fare l'Unrealize dei suoi commandSet
// *************************************************************************
CommandList.prototype.CloseMultipleForm = function(FormIdx) 
{
  // Passo il messaggio a tutti i miei figli
  var n = this.CommandSets.length;
  for (var i = n-1; i >= 0; i--)
  {
    if (this.CommandSets[i].FormIndex==FormIdx)
    {
      this.CommandSets[i].Unrealize();
      this.CommandSets.splice(i,1);
    }
  }
}


// *************************************************************************
// Realizza la lista innestata per il menu' mobile
// *************************************************************************
CommandList.prototype.RealizeMobileMenu = function(cmdlist, parentdiv) 
{
  // Creo lo scroller (prima di realizzare i menu' che potrebbero usarlo)
  this.IDScroll = new IDScroll(this.Identifier, parentdiv, RD3_DesktopManager.WebEntryPoint.SideMenuBox);
  //
  var n = cmdlist.length;
  for (var i = 0; i < n; i++)
  {
    cmdlist[i].Realize(parentdiv);
  }
}


// ********************************************************************************
// Gestore evento di click sul bottone suppressmenu
// ********************************************************************************
CommandList.prototype.OnMenuButton= function(evento)
{ 
  var wep = RD3_DesktopManager.WebEntryPoint;
  var fd = wep.GetDockedForm(RD3_Glb.FORMDOCK_LEFT);
  //
  var scz = null;
  if (wep.UseZones())
  {
    scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
    if (!scz.HasMobileMenu)
      scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
    //
    if (scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE)
    {
      var origDim = (scz.Position==RD3_Glb.FORMDOCK_LEFT || scz.Position==RD3_Glb.FORMDOCK_RIGHT ? scz.ParentContainer.offsetWidth : scz.ParentContainer.offsetHeight);
      //
      scz.AdaptDocked(true);
      scz.AdaptLayout();
      scz.PortraitShown = true;
      //
      var destDim = (scz.Position==RD3_Glb.FORMDOCK_LEFT || scz.Position==RD3_Glb.FORMDOCK_RIGHT ? scz.ParentContainer.offsetWidth : scz.ParentContainer.offsetHeight);
      scz.SlideZone(origDim, destDim, true);
      //
      // Nel caso VERTICALHIDE la zona si deve mostrare.. ma non nel popover!
      return;
    }
  }    
  //
  // Resetto flag expanding che in alcuni casi puo' rimanere impostato
  this.Expanding = false;
  //
  // Indico che ho aperto la menu bar
  this.ForceMenuBar = true;
  //
  // Nel caso smartphone, faccio apparire il menu'
  if (RD3_Glb.IsSmartPhone())
  {
    this.SetSuppressMenu(false);
    return;
  }
  //
  // Apro un popup (di tipo popover) e poi gli infilo dentro il menu' laterale
  var p = new PopupFrame(null, this);
  p.Borders = RD3_Glb.BORDER_THIN;
  //
  if (wep.UseZones())
  {
    scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
    if (!scz.HasMobileMenu)
      scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
    //
    if (scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALPOPOVER)
    {
      p.SetWidth(scz.ZoneSize);
      p.HasCaption = false;
    }
  }
  else
  {
    p.SetWidth(304);
  }
  //
  var hPop = 748;
  if (this.ForceVerticalMenu)
    hPop = RD3_Glb.IsPortrait(true) ? hPop : RD3_DesktopManager.WebEntryPoint.WepBox.offsetHeight-60;
  p.SetHeight(hPop);
  //
  p.Centered = false;
  p.AutoClose = true;
  p.AttachTo(this.MenuButton);
  p.Realize("-popover");
  if ((this.ShowGroups || RD3_Glb.IsQuadro()) && !RD3_Glb.IsMobile7())
  {    
    if (RD3_Glb.IsIE(10, true))
      p.ContentBox.style.background = "linear-gradient(180deg, "+RD3_ClientParams.GetColorMenu1()+", "+RD3_ClientParams.GetColorMenu2()+")";
    else
      p.ContentBox.style.background = "-webkit-gradient(linear, left top, left bottom, from("+RD3_ClientParams.GetColorMenu1()+"), to("+RD3_ClientParams.GetColorMenu2()+"))";
  }
  //
  if (!wep.UseZones())
  {
    if (fd && !fd.Visible)
    {
      // Mostro la form docked come popover
      this.ConvertFormPopover(true);
      p.HostForm(fd);
    }
    else
    {
      // Mostro il menu' principale come popover
      this.ConvertClassPopover(true);
      p.Host(wep.HeaderBox, wep.SideMenuBox);
      this.IDScroll.SetContainer(p.ContentBox);
      wep.HeaderBox.style.display = "";
    }
  }
  else
  {
    scz.ConvertPopover(true);
    p.Host(null, scz.ParentContainer);
  }
  //
  RD3_DDManager.AddPopup(p);
  p.Open();
  //
  this.PopupObj = p;
}


// ********************************************************************************
// Ho chiuso il menu' principale aperto nel popover
// ********************************************************************************
CommandList.prototype.OnClosePopup= function(popup)
{ 
  var wep = RD3_DesktopManager.WebEntryPoint;
  //
  if (!wep.UseZones())
  {
    this.ConvertFormPopover(false);
    if (this.SuppressMenu)
      RD3_DesktopManager.WebEntryPoint.HeaderBox.style.display = "none";
    this.IDScroll.SetContainer(RD3_DesktopManager.WebEntryPoint.SideMenuBox);
    this.ConvertClassPopover(false);
  }
  else
  {
    var scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
    if (!scz.HasMobileMenu)
      scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
    //
    this.IDScroll.SetContainer(RD3_DesktopManager.WebEntryPoint.SideMenuBox);
    scz.ConvertPopover(false);
  }
  //
  this.PopupObj = null;
}


// ********************************************************************************
// Converto gli stili di una form per essere di tipo popover
// ********************************************************************************
CommandList.prototype.ConvertFormPopover= function(fl, fd)
{
  var wep = RD3_DesktopManager.WebEntryPoint;
  if (!fd) 
    fd = wep.GetDockedForm(RD3_Glb.FORMDOCK_LEFT);
  if (fd)
  {
    // Converto la prima caption e i bottoni in essa contenuti
    var tb = fd.GetFirstToolbar();
    if (tb)
    {
      var c1 = fd.HasCaption()?"form-caption-container":"frame-toolbar-container";
      var c2 = "popup-frame-caption-popover";
      RD3_Glb.SwitchClass(tb,c1,c2,fl);
      //
      // Converto i bottoni      
      var obj = tb.firstChild;
      c1 = "form-caption-image";
      c2 = "popover-form-button";
      while (obj)
      {
        RD3_Glb.SwitchClass(obj,c1,c2,fl);
        RD3_Glb.SwitchClass(obj,"menu-back-button-arrow","popover-back-button-arrow",fl);
        RD3_Glb.SwitchClass(obj,"menu-back-button","popover-back-button",fl);
        obj = obj.nextSibling;
      }
    }
    //
    // Se nei frame ci sono delle button bar, converto anche quelle
    for (var i=0; i<fd.Frames.length; i++)
    {
      var fr = fd.Frames[i];
      if (fr instanceof ButtonBar)
      {
        RD3_Glb.SwitchClass(fr.ButtonBarContainer,"button-bar-container","button-bar-popover-container",fl);        
        for (var j=0;j<fr.CommandSet.Commands.length; j++)
        {
          var cmd = fr.CommandSet.Commands[j];
          RD3_Glb.SwitchClass(cmd.Button,"button-bar-button","button-bar-popover-button",fl);        
        }
      }
      if (fr instanceof TabbedView)
      {
        var suf = "";
        switch (fr.Placement)
        {
          case RD3_Glb.TABOR_RIGHT : suf = "-right"; break;
          case RD3_Glb.TABOR_LEFT : suf = "-left"; break;
        }
        //
        RD3_Glb.SwitchClass(fr.ToolbarBox,"toolstrip-container"+suf,"toolstrip-container-popover"+suf,fl);
        //
        if (suf.length > 0)
          suf = "tab" + suf.substring(1) + "-";
        for (var j=0;j<fr.Tabs.length; j++)
        {
          var tab = fr.Tabs[j];
          RD3_Glb.SwitchClass(tab.CaptionBox,"selected-tab-caption-container-"+suf+"0","selected-tab-caption-container-popover-"+suf+"0",fl);
          RD3_Glb.SwitchClass(tab.CaptionBox,"tab-caption-container-"+suf+"0","tab-caption-container-popover-"+suf+"0",fl);
        }
        //
        // Per correggere un baco di safari e' necessario togliere e rimettere la toolbar nell'adaptLayout; dato che non lo possiamo
        // fare sempre usiamo questo semaforo per attivare questo comportamento
        if (!fl)
          fr.Switched = true;
      }
      //
      // Se ci sono delle pagine
      if (fr instanceof IDPanel && fr.PagesBox)
      {
        RD3_Glb.SwitchClass(fr.PagesBox,"pages-container","pages-container-popover",fl);
        for (var j=0;j<fr.Pages.length; j++)
        {
          var page = fr.Pages[j];
          RD3_Glb.SwitchClass(page.CaptionContainer,"selected-page-container-0","selected-page-container-popover-0",fl);
          RD3_Glb.SwitchClass(page.CaptionContainer,"page-container-0","page-container-popover-0",fl);
        }
      }
    }    
    //
    // Spingo un adaptlayout ritardato della form che sta per tornare al suo posto
    if (!fl || !fd.WasAdapted)
      window.setTimeout("RD3_DesktopManager.CallEventHandler('"+fd.Identifier+"', 'AdaptLayout', "+(!fd.WasAdapted)+");",50);
  }
}



// ********************************************************************************
// Ho chiuso il menu' principale aperto nel popover
// ********************************************************************************
CommandList.prototype.ConvertClassPopover= function(fl)
{ 
  // Converto HEADER
  var obj = RD3_DesktopManager.WebEntryPoint.HeaderBox;
  var c1 = "header-container";
  var c2 = "popup-frame-caption-popover";
  RD3_Glb.SwitchClass(obj,c1,c2,fl);
  //
  // Converto i bottoni
  obj = obj.firstChild;
  c1 = "menu-back-button";
  c2 = "popover-back-button";
  var c3 = "menu-back-button-arrow";
  var c4 = "popover-back-button-arrow";
  while (obj)
  {
    RD3_Glb.SwitchClass(obj,c3,c4,fl);
    RD3_Glb.SwitchClass(obj,c1,c2,fl);
    obj = obj.nextSibling;
  }
  //
  // Converto TESTO
  obj = document.getElementById("header-main-caption");
  c1 = "header-main-caption";
  c2 = "popup-frame-caption-text";
  RD3_Glb.SwitchClass(obj,c1,c2,fl);
}


// ********************************************************************************
// Devo sopprimere il menu'?
// ********************************************************************************
CommandList.prototype.ShouldSuppressMenu= function()
{ 
  // Vediamo se devo gestire auto-suppress menu'
  var wep = RD3_DesktopManager.WebEntryPoint;
  if (!wep.Realized)
    return;
  //
  var tosup = RD3_Glb.IsPortrait();
  //
  if (RD3_Glb.IsSmartPhone())
  {
    if (this.ForceMenuBar)
      return false;
    tosup = wep.StackForm.length>0;
  }
  //
  // Se c'e' una docked sinistra, allora devo nascondere il menu'
  if (!tosup && wep.GetDockedForm(RD3_Glb.FORMDOCK_LEFT, true) && !wep.UseZones())
    tosup = true;
  return tosup;
}


// ********************************************************************************
// Mostra o meno il bottone, in funzione della docked e del menu
// ********************************************************************************
CommandList.prototype.ShowMenuButton= function()
{ 
  if (this.MenuButton)
  {
    var wep = RD3_DesktopManager.WebEntryPoint;
    //
    var tosup = RD3_Glb.IsPortrait();
    if (RD3_Glb.IsSmartPhone())
      tosup = wep.StackForm.length>0;
    //
    // In WidgetMode non si vede mai il menu
    if (tosup && RD3_DesktopManager.WebEntryPoint.WidgetMode)
      tosup = false;
    //
    var toshow = false;
    //
    if (tosup)
    {
      if (!wep.UseZones())
      {
        // Siamo in una condizione di mostrare il bottone... vediamo per chi
        var fd = wep.GetDockedForm(RD3_Glb.FORMDOCK_LEFT);
        if (fd && !fd.Visible)
        {
          toshow = true;
          this.SetMenuButtonCaption(fd.Caption);
        }
        else
        {
          if (this.SuppressMenu)
          {
            toshow = this.HasMenu();
            this.SetMenuButtonCaption(RD3_DesktopManager.WebEntryPoint.MainCaption);
          }
        }
      }
      else
      {
        var scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_LEFT);
        if (!scz.HasMobileMenu)
          scz = wep.GetScreenZone(RD3_Glb.FORMDOCK_RIGHT);
        //
        toshow = this.HasMenu() || (scz.GetForms().length > 0 && (scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALPOPOVER || scz.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE) && scz.ZoneState==RD3_Glb.SCRZONE_PINNEDZONE);
        this.SetMenuButtonCaption(RD3_DesktopManager.WebEntryPoint.MainCaption);
      }
    }
    //    
    this.MenuButton.style.display = toshow?"":"none";
    //
    var objp = RD3_KBManager.GetObject(this.MenuButton);
    if (objp && objp instanceof IDPanel)
    {
      objp.RefreshToolbar = true;
      //
      // Nel caso quadro, spingo subito gli adattamenti per evitare sfarfallii
      if (RD3_Glb.IsQuadro())
        objp.UpdateToolbar();
    }
    //
    // Nel caso quadro, spingo l'aggiornamento della toolbar subito, sia per
    // la form welcome (che ne ha bisogno) sia per evitare sfarfallii
    if (objp && objp instanceof WebForm && RD3_Glb.IsQuadro())
      objp.AdaptToolbarLayout();
  }
}

// ********************************************************************************
// Imposta la caption del menu' button
// ********************************************************************************
CommandList.prototype.SetMenuButtonCaption= function(txt)
{ 
  var o = RD3_Glb.IsSmartPhone()?this.MenuButtonButton:this.MenuButton;
  o.textContent = txt;
}


// ********************************************************************************
// Mostra o nasconde il menu' usando un'animazione slide
// ********************************************************************************
CommandList.prototype.SlideMenu = function(show)
{
  var mo1 = RD3_DesktopManager.WebEntryPoint.SideMenuBox;
  var mo2 = RD3_DesktopManager.WebEntryPoint.HeaderBox;
  //
  var fo1 = RD3_DesktopManager.WebEntryPoint.FormsBox;
  //
  var w = RD3_DesktopManager.WebEntryPoint.WepBox.offsetWidth;
  //
  // Se non ho il menu e devo nasconderlo oppure se devo nascondere il menu durante l'apertura iniziale dell'applicazione lo faccio direttamente, senza animazione che e' brutto
  if (!show && (!this.HasMenu() || RD3_DesktopManager.WebEntryPoint.WepBox.style.visibility=="hidden"))
  {
    mo1.style.display = (this.SuppressMenu)?"none":"";
    mo2.style.display = (this.SuppressMenu)?"none":"";
    fo1.style.display = (this.SuppressMenu)?"":"none";
    this.ShowMenuButton();
    //
    return;
  }
  //
  // Mostro e posiziono gli oggetti
  mo1.style.display = "";
  mo2.style.display = "";
  fo1.style.display = "";
  //
  var mini = 0;
  var mfin = 0;
  var fini = 0;
  var ffin = 0;
  if (show)
  {
    // Devo far apparire il menu', che era nascosto
    mini = -w;
    mfin = 0;
    fini = 0;
    ffin = w;    
  }
  else
  {
    // Devo far andare via il menu'
    mini = 0;
    mfin = -w;
    fini = w;
    ffin = 0;    
  }
  //
  // Posiziono gli elementi usando il 3d
  RD3_Glb.SetTransform(mo1, "translate3d("+mini+"px,0px,0px)");
  RD3_Glb.SetTransform(mo2, "translate3d("+mini+"px,0px,0px)");
  RD3_Glb.SetTransform(fo1, "translate3d("+fini+"px,0px,0px)");
  //
  // Eseguo l'animazione
  var sc = "RD3_Glb.SetTransitionDuration(document.getElementById('"+ mo1.id+"'), '250ms');";
  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ mo2.id+"'), '250ms');";
  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ fo1.id+"'), '250ms');";
  //
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ mo1.id+"'), 'translate3d("+mfin+"px,0px,0px)');";
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ mo2.id+"'), 'translate3d("+mfin+"px,0px,0px)');";
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ fo1.id+"'), 'translate3d("+ffin+"px,0px,0px)');";
  //
  if (!this.ea)
    this.ea = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)");
  //
  RD3_Glb.AddEndTransaction(mo1, this.ea, false);
  //
  window.setTimeout(sc,30);
}


// *******************************************************************
// Gestisce animazione combo mobile
// *******************************************************************
CommandList.prototype.OnEndAnimation = function(ev) 
{
  var mo1 = RD3_DesktopManager.WebEntryPoint.SideMenuBox;
  var mo2 = RD3_DesktopManager.WebEntryPoint.HeaderBox;
  var fo1 = RD3_DesktopManager.WebEntryPoint.FormsBox;
  //
  if (RD3_Glb.GetTransitionDuration(mo1)=="")
    return;
  //
  RD3_Glb.RemoveEndTransaction(mo1, this.ea, false);
  RD3_Glb.SetTransitionDuration(mo1, "");
  RD3_Glb.SetTransitionDuration(mo2, "");
  RD3_Glb.SetTransitionDuration(fo1, "");
  //
  // Eseguo soppressione
  mo1.style.display = (this.SuppressMenu)?"none":"";
  mo2.style.display = (this.SuppressMenu)?"none":"";
  fo1.style.display = (this.SuppressMenu)?"":"none";
  //
  this.ShowMenuButton();
  //
  // Deseleziono ultimo comando attivo
  var ac = RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand;
  if (ac && !this.SuppressMenu)
  {
    RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveCommand = null;
    ac.SetMenuClass();
  }
  RD3_DesktopManager.WebEntryPoint.AdaptLayout();
}


// *******************************************************************
// Torna vero se c'e' almeno un menu' visibile
// *******************************************************************
CommandList.prototype.HasMenu = function() 
{
  var n = this.CommandSets.length;
  for  (var i=0; i<n; i++)
  {
    var c = this.CommandSets[i];
    if (c.IsMenu && c.ToolCont<0 && c.IsVisible())
      return true;
  }
  //
  return false;
}

// *******************************************************************
// Gestisce il comando back girandolo ai commandset; 
// ritorna True se e' stato gestito
// *******************************************************************
CommandList.prototype.HandleBackButton = function() 
{
  var n = this.CommandSets.length;
  for  (var i=0; i<n; i++)
  {
    var c = this.CommandSets[i];
    if (c.HandleBackButton())
      return true;
  }
  //
  return false;
}


// *******************************************************************
// Chiamato quando cambia il colore di accento
// *******************************************************************
CommandList.prototype.AccentColorChanged = function(reg, newc) 
{
  // Modifico lo stile di tutti i comandi se sono selezionati
  var n = this.CommandSets.length;
  for (var i=0; i<n; i++)
    this.CommandSets[i].AccentColorChanged(reg, newc);
}

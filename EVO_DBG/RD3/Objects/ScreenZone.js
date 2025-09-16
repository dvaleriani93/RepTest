function ScreenZone() 
{
  this.Identifier = "";
  this.Position;
  this.TabVisibility = RD3_Glb.SCRZONE_AUTTAB;
  this.ShowPin = true;
  this.ZoneState = RD3_Glb.SCRZONE_PINNEDZONE;
  this.SelectedForm = RD3_Glb.SCRZONE_SELECTEDNONE;
  this.ZoneSize = 240;
  this.VerticalBehavour = RD3_Glb.SCRZONE_VERTICALCOLLAPSE;
  this.TabPosition;
  this.HasMobileMenu = false;
  this.SwipeMode = RD3_Glb.SCRZONE_SWIPECOLLAPSABLE;
  
  // Struttura per la definizione degli eventi di questa zona
  this.SelectEventDef = RD3_Glb.EVENT_ACTIVE; // Click su una tab  
  this.SwipeEventDef = RD3_Glb.EVENT_ACTIVE; // Click su una tab  
  
  this.Realized = false;
  
  this.TabView = null;
  this.ParentContainer = null;
  
  this.VisibileZone = false;
  this.RepinOnSelection = false; // Se la zona e' UNPINNED e seleziono una Tab devo tornare PINNED (se orizzontale)
  this.PortraitShown = false;
}

// *******************************************************************
// Inizializza questa ScreenZone leggendo i dati da un nodo <scz> XML
// *******************************************************************
ScreenZone.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
}

// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
ScreenZone.prototype.ChangeProperties = function(node)
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadFromXml(node);
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
ScreenZone.prototype.LoadProperties = function(node)
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
      case "pos": this.SetPosition(parseInt(valore)); break;
      case "tvs": this.SetTabVisibility(parseInt(valore)); break;
      case "spn": this.SetShowPin(valore=="1"); break;
      case "zst": this.SetZoneState(parseInt(valore)); break;
      case "sel": this.SetSelectedForm(parseInt(valore)); break;
      case "siz": this.SetZoneSize(parseInt(valore)); break;
      case "vbh": this.SetVerticalBehaviour(valore); break;
      case "tps": this.SetTabPosition(parseInt(valore)); break;
      case "hmm": this.SetHasMobileMenu(valore=="1"); break;
      case "swm": this.SetSwipeMode(parseInt(valore)); break;

      case "sle": this.SelectEventDef = parseInt(valore); break;
      case "swe": this.SwipeEventDef = parseInt(valore); break;
      
      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
      break;
    }
  }
}

ScreenZone.prototype.SetPosition = function(value)
{
  if (value!=undefined)
    this.Position = value;
}

ScreenZone.prototype.SetTabVisibility = function(value)
{
  if (value!=undefined)
    this.TabVisibility = value;
  //
  if (this.Realized)
  {
    // Per prima cosa se le devo nascondere non le mostro mai
    var hideTabs = (this.TabVisibility == RD3_Glb.SCRZONE_HIDTAB);
    //
    // Se la gestione e' automatica invece verifico le form che contengo
    if (this.TabVisibility == RD3_Glb.SCRZONE_AUTTAB && this.ZoneState == RD3_Glb.SCRZONE_PINNEDZONE)
    {
      var frms = this.GetForms();
      hideTabs = (frms.length <= 1);
    }
    //
    var old = this.TabView.HiddenTabs;
    this.TabView.SetHiddenTabs(hideTabs);
    //
    // Se mostro/nascondo le Tab devo mostrare o meno il bordo delle form
    if (!RD3_Glb.IsMobile() && old != this.TabView.HiddenTabs)
    {
      var n = this.TabView.Tabs.length;
      for (var i=0; i<n; i++)
      {
        var frm = this.TabView.Tabs[i].Content;
        if (frm && frm.Realized && frm instanceof WebForm)
          this.RemoveFormBorder(frm.FormBox);
      }
    }
  }
}

ScreenZone.prototype.SetShowPin = function(value)
{
  if (value!=undefined)
    this.ShowPin = value;
}

ScreenZone.prototype.SetZoneState = function(value)
{
  if (value!=undefined)
    this.ZoneState = value;
  //
  if (this.Realized)
  {
    if (this.ZoneState == RD3_Glb.SCRZONE_HIDDENZONE)
    {
      this.VisibileZone = false;
      RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
    }
    else if (this.ZoneState == RD3_Glb.SCRZONE_PINNEDZONE)
    {
      this.TabView.SetOnlyTabs(false);
      //
      this.VisibileZone = true;
      RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
    }
    else
    {
      if(this.SelectedForm==RD3_Glb.SCRZONE_SELECTEDNONE)
        this.TabView.SetOnlyTabs(true);
      else
        this.TabView.SetOnlyTabs(false);
      //
      this.VisibileZone = true;
      RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
    }
  }
}

ScreenZone.prototype.SetSelectedForm = function(value)
{
  var old = this.SelectedForm;
  if (value!=undefined)
    this.SelectedForm = value;
  //
  if (this.Realized)
  {
    var skipAnim = false;
    var idx = 0;
    //
    // Trovo la Tab da selezionare
    var n = this.TabView.Tabs.length;
    for (var i=0; i<n; i++)
    {
      var f = this.TabView.Tabs[i].Content;
      //
      if (f && f.IdxForm == this.SelectedForm)
      {
        // Se la Tab non e' mai stata mostrata a video allora non la animo ma la mostro direttamente
        // (quando la apro viene sempre selezionata, quindi puo' essere False solo alla prima apertura..
        // elimino l'animazione perche' in questo caso e' bruttina..)
        skipAnim = this.TabView.Tabs[i].JustAdded;
        idx = i;
        break;
      }
    }
    //
    if(this.SelectedForm == RD3_Glb.SCRZONE_SELECTEDNONE)
      idx = -1;
    //
    // Se la zona e' Unpinned e devo chiuderla non la deseleziono ora (altrimenti la pagina diventa invisibile prima del'aniomazione)
    // lo fara' l'animazione alla fine
    if (!(idx == -1 && this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE))
    {
      // Se la pagina e' gia' selezionata ma non era ancora arrivata quando la abbiamo selezionata
      // la dobbiamo riselezionare
      if (this.TabView.SelectedPage == idx)
        this.TabView.SetSelectedPage();
      else
        this.TabView.SetSelectedPage(idx, skipAnim);
    }
    //
    RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
    //
    // L'animazione di comparsa della zona la devo fare solo se passo da mostrare una form a non mostrarne nessuna o viceversa
    if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && old != this.SelectedForm && (old==RD3_Glb.SCRZONE_SELECTEDNONE || this.SelectedForm==RD3_Glb.SCRZONE_SELECTEDNONE))
    {
      if (this.SelectedForm != RD3_Glb.SCRZONE_SELECTEDNONE && this.SelectedForm != old)
        this.TabView.SetOnlyTabs(false);
      //
      var animEnter = (this.SelectedForm!=RD3_Glb.SCRZONE_SELECTEDNONE);
      var immediate = (old != RD3_Glb.SCRZONE_SELECTEDNONE && this.SelectedForm != RD3_Glb.SCRZONE_SELECTEDNONE);
      //
      // Animazione Desktop
      if (!RD3_Glb.IsMobile())
      {
        var fx = new GFX("unpinned", animEnter, this.ParentContainer, immediate, null, "scroll:250!");
        fx.ZonePos = this.Position;
        RD3_GFXManager.AddEffect(fx);
      }
    }
  }
}

ScreenZone.prototype.SetZoneSize = function(value)
{
  if (value!=undefined)
    this.ZoneSize = value;
  //
  if (this.Realized)
    RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
}

ScreenZone.prototype.SetSwipeMode = function(value)
{
  if (value!=undefined)
    this.SwipeMode = value;
}

ScreenZone.prototype.SetVerticalBehaviour = function(value)
{
  if (value!=undefined)
    this.VerticalBehavour = value;
}

ScreenZone.prototype.SetTabPosition = function(value)
{
  if (value!=undefined)
    this.TabPosition = value;
  //
  if (this.Realized)
    this.TabView.SetPlacement(this.TabPosition);
}

ScreenZone.prototype.SetHasMobileMenu = function(value)
{
  if (value!=undefined)
    this.HasMobileMenu = value;
  //
  if (this.Realized)
  {
    // Se contengo il menu me lo prendo (un volta che ho il menu non posso perderlo..)
    if (this.HasMobileMenu)
    {
      // Creo una form fittizia in cui metto il menu e l'header
      this.MenuForm = new WebForm();
      this.MenuForm.ToolbarPosition = 0;
      this.MenuForm.Identifier = "menuform";
      this.MenuForm.IdxForm = RD3_Glb.SCRZONE_SELECTEDMENU;
      this.MenuForm.Docked = true;
      this.MenuForm.DockType = this.Position;
      this.MenuForm.Caption = RD3_DesktopManager.WebEntryPoint.MainCaption;
      this.MenuForm.Realize();
      //
      this.MenuForm.Host(RD3_DesktopManager.WebEntryPoint.SideMenuBox, RD3_DesktopManager.WebEntryPoint.HeaderBox);
    }
  }
}

//****************************************************************
// Restituisce le Form appartenenti a questa Zona
//****************************************************************
ScreenZone.prototype.GetForms = function()
{
  var ret = new Array();
  var wep = RD3_DesktopManager.WebEntryPoint;
  //
  var n = wep.StackForm.length;
  for (var i=0; i<n; i++)
  {
    var f = wep.StackForm[i];
    //
    if (f.Docked && f.DockType == this.Position)
      ret.push(f);
  }
  //
  // Se il menu e' presente aggiungo la MenuForm alla lista delle form, se e' nascosto allora non lo aggiungo.
  if (this.MenuForm && RD3_DesktopManager.WebEntryPoint.CmdObj.HasMenu())
    ret.push(this.MenuForm);
  //
  return ret;
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
ScreenZone.prototype.Realize = function()
{
  // Imposto il parent (il mio contenitore)
  switch (this.Position)
  {
    case RD3_Glb.FORMDOCK_LEFT :
      this.ParentContainer = RD3_DesktopManager.WebEntryPoint.LeftDockedBox;
    break;
    
    case RD3_Glb.FORMDOCK_TOP :
      this.ParentContainer = RD3_DesktopManager.WebEntryPoint.TopDockedBox;
    break;
    
    case RD3_Glb.FORMDOCK_RIGHT :
      this.ParentContainer = RD3_DesktopManager.WebEntryPoint.RightDockedBox;
    break;
    
    case RD3_Glb.FORMDOCK_BOTTOM :
      this.ParentContainer = RD3_DesktopManager.WebEntryPoint.BottomDockedBox;
    break;
  }
  //
  // Creo una Form Fittizia, la TabView ne ha bisogno
  this.TempFrm = new WebForm();
  this.TempFrm.Identifier = this.Identifier + ":" + Math.floor(Math.random() * 1000);
  this.TabView = new TabbedView(this.TempFrm);
  this.TabView.Identifier = this.Identifier + ":tbv:" + Math.floor(Math.random() * 1000);
  this.TabView.ClickEventDef = RD3_Glb.EVENT_CLIENTSIDE;
  this.TabView.ZoneTabView = true;
  this.TabView.Realize(this.ParentContainer);
  //
  // Le animazioni fanno scrollare la tabbed su desktop.. non lo deve fare
  if (!RD3_Glb.IsMobile())
    this.TabView.ContentBox.onscroll = new Function("ev","return RD3_Glb.NoScroll(ev);");
  //
  this.Realized = true;
  //
  this.SetTabVisibility();
  this.SetZoneState();
  this.SetSelectedForm();
  this.SetTabPosition();
  this.SetHasMobileMenu();
}

ScreenZone.prototype.AdaptDocked = function(isPopover)
{
  // Auto-adatto la dimensione ad 1/3 dello spazio necessario, se nessuno mi ha detto niente
  if (this.ZoneSize == -10 && RD3_Glb.IsMobile())
  {
    if (this.Position==RD3_Glb.FORMDOCK_LEFT || this.Position==RD3_Glb.FORMDOCK_RIGHT)
    {
      var dim = document.body.offsetHeight>document.body.offsetWidth ? document.body.offsetHeight : document.body.offsetWidth;
      dim = Math.floor(dim/100*30);
      this.ZoneSize = dim<300 ? 300 : dim; // per tablet
    }
    else
    {
      var dim = document.body.offsetHeight<document.body.offsetWidth ? document.body.offsetHeight : document.body.offsetWidth;
      dim = Math.floor(dim/100*30);
      this.ZoneSize = dim<300 ? 300 : dim; // per tablet
    }
  }
  //
  if (RD3_Glb.IsMobile())
  {
    if (this.ea)
      RD3_Glb.RemoveEndTransaction(this.ParentContainer, this.ea, false);
    //
    // Riparto da 0, eliminando eventuali transizioni presenti
  	RD3_Glb.RemoveEndTransaction(this.ParentContainer, this.ea, false);
    RD3_Glb.RemoveEndTransaction(this.TabView.ContentBox, this.ea, false);
  	RD3_Glb.SetTransitionDuration(this.ParentContainer, "");
  	RD3_Glb.SetTransitionDuration(this.TabView.ContentBox, "");
  	RD3_Glb.SetTransitionProperty(this.ParentContainer, "");
  	RD3_Glb.SetTransitionProperty(this.TabView.ContentBox, "");
  	RD3_Glb.SetTransform(this.ParentContainer, "");
  	RD3_Glb.SetTransform(this.TabView.ContentBox, "");
  	//
  	this.ParentContainer.removeAttribute("destDim");
    this.ParentContainer.removeAttribute("startDim");
  	//
  	// Se c'e' un'animazione da fare la annullo
  	if (this.AnimTimer)
  	{
  	  window.clearTimeout(this.AnimTimer);
  	  this.AnimTimer = null;
  	}
  }
  //
  var wdt = this.ZoneSize;
  var suffix = "-visible";
  //
  // Se sono Unpinned e senza nessuna videata visibile allora la zona e' collassata
  if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.SelectedForm == RD3_Glb.SCRZONE_SELECTEDNONE)
  {
    wdt = RD3_ClientParams.ZoneUnpinnedSize(this.Position==RD3_Glb.FORMDOCK_LEFT || this.Position==RD3_Glb.FORMDOCK_RIGHT);
    //
    // Se sono unpinned senza videata selezionata ma senza Tab sono comunque alto/largo 0
    if (this.TabVisibility == RD3_Glb.SCRZONE_HIDTAB)
      wdt = 0;
  }
  //
  // Mostro o meno le Tab (serve solo per l'automatico..)
  this.SetTabVisibility();
  //
  // Se non ci sono form appartenenti alla zona questa non deve essere visibile
  var sethidden = false;
  if (!RD3_Glb.IsPortrait())
    this.PortraitShown = false;
  //
  if (this.GetForms().length == 0)
    sethidden = true;
  //
  // Se la Zona contiene il menu e sono verticale devo nasconderla comunque
  if (!isPopover && (this.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE || this.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALPOPOVER))
  {
    RD3_DesktopManager.WebEntryPoint.CmdObj.ShowMenuButton();
    sethidden = sethidden || (RD3_Glb.IsPortrait() && !this.PortraitShown);
  }
  //
  // Se sono hidden... mi nascondo..
  if (this.ZoneState == RD3_Glb.SCRZONE_HIDDENZONE)
  {
    wdt = 0;
    sethidden = true;
  }
  //
  if (sethidden)
  {
    wdt = 0;
    suffix = "";
  }
  //
  // Assegno le dimensioni
  var contName = "";
  switch (this.Position)
  {
    case RD3_Glb.FORMDOCK_LEFT :
      contName = "left";
      this.ParentContainer.style.width = wdt + "px";
    break;
    
    case RD3_Glb.FORMDOCK_TOP :
      contName = "top";
      this.ParentContainer.style.height = wdt + "px";
    break;
    
    case RD3_Glb.FORMDOCK_RIGHT :
      contName = "right";
      this.ParentContainer.style.width = wdt + "px";
    break;
    
    case RD3_Glb.FORMDOCK_BOTTOM :
      contName = "bottom";
      this.ParentContainer.style.height = wdt + "px";
      this.TabView.Height = wdt;
    break;
  }
  //
  // Adesso gestisco le classi
  this.VisibileZone = !sethidden;
  var pinclass = this.ZoneState == RD3_Glb.SCRZONE_PINNEDZONE ? " zone-pinned" : "";
  pinclass = this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE ? " zone-unpinned" : pinclass;
  //
  this.ParentContainer.className = contName + "-dock-container" + suffix + pinclass;
}

ScreenZone.prototype.AdaptLayout = function()
{
  // Per la zona Hidden non serve Adapt
  if (this.ZoneState == RD3_Glb.SCRZONE_HIDDENZONE)
    return;
  //
  // Se contengo il menu devo mostrare la tab o nasconderla a seconda se il menu e' visibile o meno
  if (this.HasMobileMenu && this.MenuForm)
  {
    var n = this.TabView.Tabs.length;
    for (var i=0; i<n; i++)
    {
      var t = this.TabView.Tabs[i];
      if (t.Content == this.MenuForm)
        t.SetVisible(RD3_DesktopManager.WebEntryPoint.CmdObj.HasMenu());
    }
  }
  //
  // Niente resize, la Tab deve essere contenuta nel padre
  RD3_Glb.AdaptToParent(this.TabView.FrameBox, 0, 0);
  //
  // H e W sono necessari per calcolare correttamente le posizioni della toolbar
  this.TabView.Height = this.TabView.FrameBox.clientHeight
  this.TabView.Width = this.TabView.FrameBox.clientWidth;
  //
  this.TabView.AdaptLayout();
  //
  // Se contengo il menu devo anche dire ad idscroll di ricalcolare i suoi limiti.. magari sono diventata piu' corta
  if (RD3_Glb.IsMobile() && this.HasMobileMenu && RD3_DesktopManager.WebEntryPoint.CmdObj.IDScroll)
    RD3_DesktopManager.WebEntryPoint.CmdObj.IDScroll.CalcLimits();
}

//*********************************************************************
// Una form si vuole aggiungere alla zona (chiamata dalla sua realize)
//**********************************************************************
ScreenZone.prototype.AddForm = function(frm)
{
  var newtab = new Tab(this.TabView);
  newtab.Identifier = this.Identifier + ":tab:" + Math.floor(Math.random() * 1000);
  RD3_DesktopManager.ObjectMap.add(newtab.Identifier, newtab);
  //
  // Imposto il contenuto e la callback del click sulla Tab
	newtab.SetContent(frm);
	newtab.OnClick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTabClick', ev, this);");
	//
	this.TabView.Tabs.push(newtab);
	//
	// Se sono gia' stata realizzata, realizzo subito la pagina
	if (this.Realized)
    newtab.Realize(this.TabView.ContentBox, this.TabView.ToolbarBox, true);
  //
  // Rimetto a posto il filler
  this.TabView.SetPlacement();
  this.SetSelectedForm();
  newtab.JustAdded = true;
  //
  if (frm.Realized)
    this.RemoveFormBorder(frm.formBox);
  //
  return newtab.ContentBox;
}

//*********************************************************************
// Una form si vuole togliere alla zona (chiamata dalla sua unrealize)
//**********************************************************************
ScreenZone.prototype.RemoveForm = function(frm)
{
  var n = this.TabView.Tabs.length;
  var tab = null;
  var idx = -1;
  for (var i=0; i<n; i++)
  {
    var f = this.TabView.Tabs[i].Content;
    //
    if (f.IdxForm == frm.IdxForm)
    {
      idx = i;
      tab = this.TabView.Tabs[i];
      break;
    }
  }
  //
  if (tab)
    tab.DeletePage("", true);
}

//*****************************************************************************
// Il server ha chiesto di rendere attiva una Form appartenente a questa zona
//******************************************************************************
ScreenZone.prototype.ActivateForm = function(frm)
{
  if (this.ZoneState == RD3_Glb.SCRZONE_HIDDENZONE)
    return;
  //
  if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
  {
    if (this.GetForms().length == 1)
    {
      // c'e' solo una form Docked (non posso che essere io..): in questo caso uso l'animazione
      // Ho solo una Form: per fare correttamente l'animazione mi serve che sia attiva..
      // visto che l'attivazione arriva dopo la attivo io.. do per scontato che se ho una sola form questa sia quella attiva
      this.SetSelectedForm(frm.IdxForm);
      //
      var fx = new GFX("zone", true, frm, false, null, frm.DockedAnimDef);
      fx.ZonePos = this.Position;
      RD3_GFXManager.AddEffect(fx);
    }
    else if (this.GetForms().length == 2)
    {
      // Se ci sono due form aperte normalmente non dovrei fare nulla.. ma una delle due potrebbe essere in procinto di chiudersi: in questo caso faccio subito terminare l'animazione
      var n = RD3_GFXManager.ActiveEffects.length;
      for(var i=0; i<n; i++)
      {
        var lastGFX = RD3_GFXManager.ActiveEffects[i];
        if (lastGFX && lastGFX.Classe == "zone" && lastGFX.ZonePos == this.Position && !lastGFX.Flin)
          lastGFX.SetFinished();
      }
    }
  }
}

ScreenZone.prototype.CloseForm = function(frm)
{
  var wep = RD3_DesktopManager.WebEntryPoint;
  //
  // Gestisco la chiusura di timer di form
  wep.TimerObj.FormClosed(frm);
  //
  // Se sono la form attiva elimino il riferimento
  if(wep.ActiveForm && wep.ActiveForm.Identifier == frm.Identifier)
    wep.ActiveForm = null;
  //
  // C'e' una sola form: chiudrla significa nascondere la zona.. allora uso l'animazione
  if (this.GetForms().length == 1)
  {
    var fx = new GFX("zone", false, frm, false);
    fx.IdxForm = frm.Identifier;
    fx.ZonePos = this.Position;
    fx.CloseFormAnimation = true;
    RD3_GFXManager.AddEffect(fx);
  }
  else
  {
    // Non devo fare nulla se non chiudere effettivamente la Form
    // Distruggo la form
  	frm.Unrealize();
  	//
  	// Tolgo la form dallo stackform
    var n = wep.StackForm.length;
    for (var i=0; i<n; i++)
    {
      var f = wep.StackForm[i];
      if (f.Identifier==frm.Identifier)
      {
        wep.StackForm.splice(i, 1);
        break;
      } 
    }
  }
}

ScreenZone.prototype.OnTabClick = function(evento, tab)
{
  var n = this.TabView.Tabs.length;
  for (var i=0; i<n; i++)
  {
    if (this.TabView.Tabs[i] == tab)
    {
      var frmIdx = this.TabView.Tabs[i].Content.IdxForm;
      //
      var ev = new IDEvent("sczsel", this.Identifier, evento, this.SelectEventDef, frmIdx);
      if (ev.ClientSide && this.SelectedForm != frmIdx)
      {
        if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE && this.RepinOnSelection && !RD3_Glb.IsPortrait())
          this.SetZoneState(RD3_Glb.SCRZONE_PINNEDZONE);
        //
        // Durante la gestione locale del cambio di pagina possono avvenire molte cose,
        // e' meglio che il server sia avvertito il piu' in fretta possibile
        RD3_DesktopManager.SendEvents();
        //
        this.SetSelectedForm(frmIdx);
      }
    }
  }
}

ScreenZone.prototype.ConvertPopover = function(isPopover)
{
  var cmd = RD3_DesktopManager.WebEntryPoint.CmdObj;
  cmd.ConvertFormPopover(isPopover, this.TempFrm);
	cmd.ConvertClassPopover(isPopover);
	//
	this.PortraitShown = isPopover;
  this.AdaptDocked(isPopover);
  this.AdaptLayout();
  //
  // Il popover si prende la 'zona'.. quindi il container deve essere nascosto, altimenti fa schifo..
  if (isPopover)
  {
    if (this.Position==RD3_Glb.FORMDOCK_LEFT || this.Position==RD3_Glb.FORMDOCK_RIGHT)
      this.ParentContainer.style.width = "0px";
    if (this.Position==RD3_Glb.FORMDOCK_TOP || this.Position==RD3_Glb.FORMDOCK_BOTTOM)
      this.ParentContainer.style.height = "0px";
  }
}

ScreenZone.prototype.OnMouseDown = function(ev, outside)
{
  if (outside == undefined)
    outside = false;
  //
  // Se sono Unpinned e sto mostrando una form devo verificare se il click e' avvenuto su di me o meno..
  // se e' fuori devo deselezionare la Form
  var stopHandle = false;
  var pinnedShown = this.ZoneState == RD3_Glb.SCRZONE_PINNEDZONE && this.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE && RD3_Glb.IsPortrait() && this.VisibileZone;
  if ((this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE || pinnedShown) && this.SelectedForm!=RD3_Glb.SCRZONE_SELECTEDNONE)
  {
    var isinside = false;
    //
    if (outside == false)
    {
      var srcobj = (window.event)?window.event.srcElement:ev.explicitOriginalTarget;
      //
      while (srcobj && srcobj!=document.body)
      {
        if (srcobj == this.ParentContainer)
        {
          isinside = true;
          break;
        }
        //
        srcobj = srcobj.parentNode;
      }
      //
      // Se c'e' una combo aperta non faccio nulla (se c'e' ed io sono aperta puo' solo essere stata aperta da me..)
      if (RD3_DDManager.OpenCombo)
        isinside = true;
    }
    //
    var closePinnedZone = false;
    if (!isinside)
    {
      if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
      {
        var ev = new IDEvent("sczsel", this.Identifier, ev, this.SelectEventDef, RD3_Glb.SCRZONE_SELECTEDNONE);
        //
        this.SetSelectedForm(RD3_Glb.SCRZONE_SELECTEDNONE);
      }
      else
      {
        stopHandle = true;
        closePinnedZone = true;
      }
    }
    else if (pinnedShown && this.HasMobileMenu && this.SelectedForm==RD3_Glb.SCRZONE_SELECTEDMENU)
    {
      // Se clicco un comando di una zona mostrata in modalita' IOS7 in verticale che mostra il MENU allora devo chiudere la zona
      var srcobj = (window.event)?window.event.srcElement:ev.explicitOriginalTarget;
      var obj = RD3_KBManager.GetObject(srcobj);
      //
      if (obj && obj instanceof Command && !obj.IsCmdSet)
        closePinnedZone = true;
    }
    //
    if (closePinnedZone)
    {
      // Mi e' scattato il click per una zona unpinned.. posso essere solo una zona in modalita' apertura IOS7
      var origDim = (this.Position==RD3_Glb.FORMDOCK_LEFT || this.Position==RD3_Glb.FORMDOCK_RIGHT ? this.ParentContainer.offsetWidth : this.ParentContainer.offsetHeight);
      //
      this.PortraitShown = false;
      this.AdaptDocked(false);
      this.AdaptLayout();
      //
  	  var destDim = (this.Position==RD3_Glb.FORMDOCK_LEFT || this.Position==RD3_Glb.FORMDOCK_RIGHT ? this.ParentContainer.offsetWidth : this.ParentContainer.offsetHeight);
  	  this.SlideZone(origDim, destDim);
    }
  }
  //
  if (stopHandle)
    return false;
  else
    return true;
}

//****************************************************
// Gestione dello swipe sulla zona
//****************************************************
ScreenZone.prototype.OnSwipeZone = function(inside)
{
  if (this.SwipeMode == RD3_Glb.SCRZONE_SWIPENONE)
    return;
  //
  switch (this.ZoneState)
  {
    case RD3_Glb.SCRZONE_PINNEDZONE :
      if (!inside)
      {
        if (this.SwipeMode == RD3_Glb.SCRZONE_SWIPECOLLAPSABLE)
        {
          this.SetZoneState(RD3_Glb.SCRZONE_UNPINNEDZONE);
          this.SetSelectedForm(RD3_Glb.SCRZONE_SELECTEDNONE);
          this.RepinOnSelection = true;
        }
        else
        {
          this.SetZoneState(RD3_Glb.SCRZONE_HIDDENZONE);
        }
      }
    break;
    
    case RD3_Glb.SCRZONE_HIDDENZONE :
      if (inside)
      {
        if (RD3_Glb.IsPortrait())
        {
          this.SetZoneState(RD3_Glb.SCRZONE_UNPINNEDZONE);
        } 
        else
        {
          this.SetZoneState(RD3_Glb.SCRZONE_PINNED);
          //
          this.SelectFirstForm();
        }
      }
    break;
    
    case RD3_Glb.SCRZONE_UNPINNEDZONE :
      if (inside)
      {
        if (RD3_Glb.IsPortrait())
          return;
        //
        this.SetZoneState(RD3_Glb.SCRZONE_PINNED);
        //
        this.SelectFirstForm();
      }
    break;
  }
}

ScreenZone.prototype.SelectFirstForm = function()
{
  if (this.SelectedForm == RD3_Glb.SCRZONE_SELECTEDNONE && this.TabView.Tabs.length>0)
  {
    var frmIdx = this.TabView.Tabs[0].Content.IdxForm;
    var ev = new IDEvent("sczsel", this.Identifier, null, this.SelectEventDef, frmIdx);
    this.SetSelectedForm(frmIdx);
  }
}

ScreenZone.prototype.SlideZone = function(startDim, destDim, ispopover)
{
  // Se l'animanzione non e' utile o la sto gia'facendo non faccio nulla..
  if (startDim == destDim || (startDim==this.ParentContainer.startDim && destDim==this.ParentContainer.destDim))
   return;
  //
  if (this.HasMobileMenu)
  {
    if ((RD3_Glb.IsQuadro() || RD3_Glb.IsMobile7()) && (RD3_Glb.IsIpad() || RD3_Glb.IsIphone()))
    {
      // Safari su dispositivo ha un problema nel rimettere a posto qwuesto oggetto nei temi in cui il
      // background viene cambiato a run-time con l'accent color. L'unico modo per farli rimettere a posto bene e' toglierli
      // e rimetterli.
      var par = RD3_DesktopManager.WebEntryPoint.HeaderBox.parentNode;
      par.removeChild(RD3_DesktopManager.WebEntryPoint.HeaderBox);
      par.insertBefore(RD3_DesktopManager.WebEntryPoint.HeaderBox, par.firstChild);
    }
    //
    // Salto l'animazione per il menu nascosto in verticale che torna visibile in orizzontale..
    var skip = this.ZoneState==RD3_Glb.SCRZONE_PINNEDZONE && this.VerticalBehavour==RD3_Glb.SCRZONE_VERTICALHIDE && !RD3_Glb.IsPortrait();
    skip = skip && startDim==0 && destDim==this.ZoneSize;
    if (skip)
      return;
  }
  //
  // Animazione per un'apertura da popover
  if (ispopover==undefined)
    ispopover = false;
  //
  // Apertura/Chiusura zona unpinned
  var unpinnedExpanding = destDim == this.ZoneSize;
  var zinx = 0;
  var ziny = 0;
  var zfinx = 0;
  var zfiny = 0;
  var contName = "";
  var prop = "";
  //
  switch (this.Position)
  {
    case RD3_Glb.FORMDOCK_LEFT :
      contName = "left";
      prop = "width";
      //
      if (startDim == 0)
      { 
        zinx = -destDim;
      }
      else if (destDim == 0)
      {
        zfinx = -startDim;
      }
      else if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
      {
        if (unpinnedExpanding)
        {
          zfinx = 0;
          zinx = startDim-destDim;
        }
        else
        {
          zfinx = destDim-startDim;
          zinx = 0;
        }
      }
      else if (this.ZoneState == RD3_Glb.SCRZONE_PINNEDZONE)
      {
        if (destDim<startDim)
        {
          // La zona si sta restringendo
          zfinx = destDim-startDim;
          zinx = 0;
        }
        else
        {
          // La zona si sta allargando
          zinx = startDim-destDim;
          zfinx = 0;
        }
      }
    break;
    
    case RD3_Glb.FORMDOCK_RIGHT :
      contName = "right";
      prop = "width";
      //
      if (startDim == 0)
      {
        zinx = destDim;
        zfinx = 0;
      }
      else if (destDim == 0)
      {
        zinx = -startDim;
        zfinx = 0;
      }
      else if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
      {
        if (unpinnedExpanding)
        {
          zinx = destDim;
          zfinx = 0;
          
        }
        else
        {
          zfinx = 0;
          zinx = destDim-startDim;
        }
      }
    break;
    
    case RD3_Glb.FORMDOCK_TOP :
      contName = "top";
      prop = "height";
      //
      if (startDim == 0)
      {
        ziny = -destDim;
      }
      else if (destDim == 0)
      {
        zfiny = -startDim;
      }
      else if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
      {
        if (unpinnedExpanding)
        {
          zfiny = 0;
          ziny = startDim-destDim;
        }
        else
        {
          zfiny = destDim-startDim;
          ziny = 0;
        }
      }
    break;
    
    case RD3_Glb.FORMDOCK_BOTTOM :
      contName = "bottom";
      prop = "height";
      //
      if (startDim == 0)
      {
        ziny = destDim;
        zfiny = 0;
      }
      else if (destDim == 0)
      {
        ziny = -startDim;
        zfiny = 0;
      }
      else if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
      {
        if (unpinnedExpanding)
        {
          ziny = destDim;
          zfiny = 0;
          
        }
        else
        {
          zfiny = 0;
          ziny = -destDim;
        }
      }
    break;
  }
  //
  // Dimensiono i container nel modo corretto
  if (startDim == 0)
  {
    if (this.Position==RD3_Glb.FORMDOCK_RIGHT || this.Position==RD3_Glb.FORMDOCK_LEFT)
      this.ParentContainer.style.width = destDim+"px";
    if (this.Position==RD3_Glb.FORMDOCK_TOP || this.Position==RD3_Glb.FORMDOCK_BOTTOM)
      this.ParentContainer.style.height = destDim+"px";
  }
  else if (destDim == 0 || startDim>destDim)
  {
    if (this.Position==RD3_Glb.FORMDOCK_RIGHT || this.Position==RD3_Glb.FORMDOCK_LEFT)
      this.ParentContainer.style.width = startDim+"px";
    if (this.Position==RD3_Glb.FORMDOCK_TOP || this.Position==RD3_Glb.FORMDOCK_BOTTOM)
      this.ParentContainer.style.height = startDim+"px";
    //
    if (this.Position==RD3_Glb.FORMDOCK_RIGHT || this.Position==RD3_Glb.FORMDOCK_BOTTOM)
    {
      this.ParentContainer.style.overflow = "visible";
      this.TabView.FrameBox.style.overflow = "visible";
    }
  }
  //
  var sc = "";
  var transTarget = this.ParentContainer;
  if (destDim == 0 || startDim == 0)
  {
    // Rimetto a posto la dimensione e la classe
    RD3_Glb.RemoveClass(this.ParentContainer, contName + "-dock-container");
    RD3_Glb.AddClass(this.ParentContainer, contName + "-dock-container-visible");
    //
    // Forzo nuovamente l'adapt dei miei figli.. altrimenti vengono nascosti..
    this.AdaptLayout();
    //
    // Posiziono gli elementi usando il 3d
    RD3_Glb.SetTransform(this.ParentContainer, "translate3d("+zinx+"px,"+ziny+"px,0px)");
    //
    // Eseguo l'animazione
    sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.ParentContainer.id+"'), '250ms');";
    sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.ParentContainer.id+"'), 'translate3d("+zfinx+"px,"+zfiny+"px,0px)');";
  }
  else
  {
    // Se mi restringo i miei figli si sono gia' adattati, quindi non li vedrei comunque..
    // in questo caso devo farli riadattare alla nuova dimensione.. se mi allargo invece devo fare in modo che i figli siano 
    // gia' adattati alla dimensione di destinazione..
    this.AdaptLayout();
    //
    if (this.ZoneState == RD3_Glb.SCRZONE_UNPINNEDZONE)
    {
      RD3_Glb.AddClass(this.TabView.ContentBox, "zone-unpinned");
      this.ParentContainer.style.background = "transparent";
      //
      RD3_Glb.SetTransform(this.TabView.ContentBox, "translate3d("+zinx+"px,"+ziny+"px,0px)");
      //
      if (this.Position==RD3_Glb.FORMDOCK_RIGHT && !unpinnedExpanding)
        this.TabView.ToolbarBox.style.left = "0px";
      if (this.Position==RD3_Glb.FORMDOCK_BOTTOM && !unpinnedExpanding)
        this.TabView.ToolbarBox.style.top = "0px";
    }
    else if (this.ZoneState == RD3_Glb.SCRZONE_PINNEDZONE)
    {
      this.ParentContainer.style.background = "transparent";
      RD3_Glb.SetTransform(this.TabView.ContentBox, "translate3d("+zinx+"px,"+ziny+"px,0px)");
    }
    //
    // Eseguo l'animazione
    sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.TabView.ContentBox.id+"'), '250ms');";
    sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.TabView.ContentBox.id+"'), 'translate3d("+zfinx+"px,"+zfiny+"px,0px)');";
    //
    transTarget = this.TabView.ContentBox;
  }
  //
  this.ParentContainer.startDim = startDim;
  this.ParentContainer.destDim = destDim;
  //
  if (!this.ea)
    this.ea = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)");
  //
  this.PopoverAnim = ispopover;
  RD3_Glb.AddEndTransaction(transTarget, this.ea, false);
  this.AnimTimer = window.setTimeout(sc,30);
}

ScreenZone.prototype.OnEndAnimation = function(ev) 
{
  this.ParentContainer.removeAttribute("destDim");
  this.ParentContainer.removeAttribute("startDim");
  //
  this.AnimTimer = null;
  RD3_Glb.RemoveEndTransaction(this.ParentContainer, this.ea, false);
  RD3_Glb.RemoveEndTransaction(this.TabView.ContentBox, this.ea, false);
	RD3_Glb.SetTransitionDuration(this.ParentContainer, "");
	RD3_Glb.SetTransitionDuration(this.TabView.ContentBox, "");
	RD3_Glb.SetTransitionProperty(this.ParentContainer, "");
	RD3_Glb.SetTransitionProperty(this.TabView.ContentBox, "");
	RD3_Glb.SetTransform(this.ParentContainer, "");
	RD3_Glb.SetTransform(this.TabView.ContentBox, "");
	//
	RD3_Glb.RemoveClass(this.TabView.ContentBox, "zone-unpinned");
	this.ParentContainer.style.background = "";
	//
	if (this.Position==RD3_Glb.FORMDOCK_RIGHT || this.Position==RD3_Glb.FORMDOCK_BOTTOM)
  {
    this.ParentContainer.style.overflow = "";
    this.TabView.FrameBox.style.overflow = "";
  }
	//
	this.AdaptDocked(this.PopoverAnim);
	this.AdaptLayout();
}

ScreenZone.prototype.AfterProcessResponse = function(ev) 
{
  var n = this.TabView.Tabs.length;
  for (var i=0; i<n; i++)
  {
    this.TabView.Tabs[i].JustAdded = false;
  }
}

//*************************************************************
// Rimuove il bordo dalla form nel lato dove si trovano le Tab
//*************************************************************
ScreenZone.prototype.RemoveFormBorder = function(formBox) 
{
  if (RD3_Glb.IsMobile())
    return;
  //
  // Prima li annullo tutti (potrebbe esserci una vecchia impostazione)
  formBox.style.borderLeft = "";
  formBox.style.borderTop = "";
  formBox.style.borderBottom = "";
  formBox.style.borderRight = "";
  //
  // Se le tab sono nascoste allora si devono vedere i bordi della Form
  if (this.TabView.HiddenTabs)
    return;
  //
  // Elimino il bordo dal lato delle Tab se visibili
  switch (this.TabPosition)
  {
    case RD3_Glb.TABOR_LEFT :
      formBox.style.borderLeft = "0px none transparent";
    break;
    
    case RD3_Glb.TABOR_RIGHT :
      formBox.style.borderRight = "0px none transparent";
    break;
    
    case RD3_Glb.TABOR_BOTTOM :
      formBox.style.borderBottom = "0px none transparent";
    break;
    
    case RD3_Glb.TABOR_TOP :
      formBox.style.borderTop = "0px none transparent";
    break;
  }
}

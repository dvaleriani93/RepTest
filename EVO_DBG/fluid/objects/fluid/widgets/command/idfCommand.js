/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A simple command or a commands set
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfCommand = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    expanded: false,
    clickEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.URGENT : undefined),
    expandEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.CLIENTSIDE : undefined),
    expandAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("menu"),
    popupAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("popup"),
    toolCont: -1, // -1 = global, 0 = form toolbar, > 0 = frame toolbar (frame index)
    vertical: false,
    enabled: true,
    visible: true,
    isMenu: true,
    isToolbar: false,
    level: 1,
    isFormList: false,
    accelerator: "",
    form: 0,
    typeCommandSet: false
  }, widget);
  //
  if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.GROUPED) {
    // When grouped start not expanded BUT don't handle this status at the start, the grouped menu handling is special and must be done
    // Only by a commandset when the user clicks it (the first level are Expanded by default)
    widget.expanded = this.level === 1 ? true : undefined;
    this.expanded = false;
  }
  //
  if (!Client.mainFrame.isIDF) {
    // A COMMANDSET that is child of a View or Frame must have different default for the isMenu flag
    // (only on Cloud)
    if (widget.type === Client.IdfCommand.types.COMMANDSSET && (parent instanceof Client.IdfView || parent instanceof Client.IdfFrame)) {
      widget.isMenu = false;
      widget.toolCont = widget.toolCont === -1 ? 0 : widget.toolCont;
    }
    //
    // On Cloud we copy the configuration of the parent
    if (widget.type === Client.IdfCommand.types.COMMAND && parent instanceof Client.IdfCommand) {
      widget.isMenu = parent.isMenu;
      widget.isToolbar = parent.isToolbar;
    }
  }
  //
  // On IDF all commands set are children of command list that is child of WebEntryPoint.
  // But some of these commands set have to be realized as children of another widget (for example an IdfButtonBar).
  // These kind of commands set have "form" property. So if a commands set belongs to a form, I don't have to realize it now.
  if (this.isCommandSet(widget) && widget.form) {
    this.children = widget.children;
    this.conf = widget;
    this.skipRealize = true;
  }
  //
  // For the top menu we must render the first level commandsets, and the second level commands.
  // 3nd level commands will be shown only by a popup when clicking the 2nd level commandset
  if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR &&
          ((widget.toolCont !== -1) || (widget.type === Client.IdfCommand.types.COMMAND && widget.isMenu)))
    this.skipRealize = true;
  //
  Client.Widget.call(this, widget, parent, view);
  //
  delete this.skipRealize;
};


// Make Client.IdfCommand extend Client.Widget
Client.IdfCommand.prototype = new Client.Widget();


Client.IdfCommand.transPropMap = {
  frm: "form",
  exp: "expanded",
  exe: "expandEventDef",
  exa: "expandAnimationDef",
  poa: "popupAnimationDef",
  idx: "index",
  lev: "level",
  ism: "isMenu",
  ist: "isToolbar",
  img: "image",
  ena: "enabled",
  vis: "visible",
  cnt: "toolCont",
  fli: "isFormList",
  fkn: "fknum",
  acc: "accelerator",
  cdg: "canDrag",
  cdp: "canDrop",
  rqc: "requireConf",
  cmds: "typeCommandSet",
  shn: "showNames",
  cco: "commandCode",
  del: "delete"
};


Client.IdfCommand.types = {
  COMMANDSSET: "cms",
  COMMAND: "cmd"
};

// Enables the old feature of RD3 that the image property of the command creates an IMG on the toolbar, so the image will strecth the button with his width and height
Client.IdfCommand.useToolbarIMG = false;


/**
 * Create element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfCommand.createConfigFromXml = function (xml)
{
  // Set type ("cms" or "cmd")
  return {type: xml.nodeName};
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfCommand.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfCommand.transPropMap.exp:
      case Client.IdfCommand.transPropMap.fli:
      case Client.IdfCommand.transPropMap.ism:
      case Client.IdfCommand.transPropMap.ist:
      case Client.IdfCommand.transPropMap.cdg:
      case Client.IdfCommand.transPropMap.cdp:
      case Client.IdfCommand.transPropMap.ena:
      case Client.IdfCommand.transPropMap.vis:
      case Client.IdfCommand.transPropMap.rqc:
      case Client.IdfCommand.transPropMap.cmds:
      case Client.IdfCommand.transPropMap.del:
        props[p] = props[p] === "1";
        break;

      case Client.IdfCommand.transPropMap.idx:
      case Client.IdfCommand.transPropMap.exe:
      case Client.IdfCommand.transPropMap.clk:
      case Client.IdfCommand.transPropMap.cnt:
      case Client.IdfCommand.transPropMap.lev:
      case Client.IdfCommand.transPropMap.fkn:
      case Client.IdfCommand.transPropMap.frm:
        props[p] = parseInt(props[p]);
        break;
    }
  }
};


/**
 * Create elements configuration
 * @param {Object} widget
 */
Client.IdfCommand.prototype.createElementsConfig = function (widget)
{
  if (this.isCommandSet()) {
    if (this.isMenu) {
      this.listConf = this.createElementConfig({c: "IonList", className: "main-menu-list collapsible-container cmd-level-" + this.level});
      this.listConf.animations = [{trigger: "animation", prop: "collapseElement", duration: (widget.expandAnimationDef.indexOf("none") === 0 ? 0 : 250)},
        {trigger: "animation", prop: "expandElement", duration: (widget.expandAnimationDef.indexOf("none") === 0 ? 0 : 250)}];
      //
      this.headerConf = this.createElementConfig({c: "IonItem", type: "header", className: "generic-item main-menu-header", events: ["onClick"]});
      this.listConf.children.push(this.headerConf);
      //
      this.labelConf = this.createElementConfig({c: "IonLabel"});
      this.headerConf.children.push(this.labelConf);
      //
      this.expandButtonConf = this.createElementConfig({c: "IonButton", className: "generic-btn extra-small main-menu-expand-btn", icon: "arrow-dropup"});
      this.headerConf.children.push(this.expandButtonConf);
      //
      this.commandsContainerConf = this.createElementConfig({c: "Container", className: "main-menu-items-container"});
      if (Client.mainFrame.wep?.menuType !== Client.IdfWebEntryPoint.menuTypes.GROUPED || this.level === 1)
        this.listConf.children.push(this.commandsContainerConf);
      if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.GROUPED) {
        // In the grouped menu the first level is already expanded, clicking its header must do nothing
        if (this.level <= 1)
          this.headerConf.events = [];
        this.expandButtonConf.icon = "play";
        this.expandButtonConf.className = "generic-btn small main-menu-expand-btn";
      }
      //
      if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR && this.level === 1) {
        this.listConf.className = "main-menu-list top-menu";
        this.expandButtonConf.visible = false;
      }
    }
    //
    // Realize the toolbar container
    if (this.isToolbar)
      this.toolBox = this.createElementConfig({c: "IonButtons", className: "main-menu-toolbar-list"});
  }
  else if (this.type === Client.IdfCommand.types.COMMAND) {
    if (this.isMenu || this.parent instanceof Client.IdfButtonBar) {
      let itemClass = "";
      if (this.parent instanceof Client.IdfCommand)
        itemClass = "main-menu-item";
      else if (this.parent instanceof Client.IdfButtonBar)
        itemClass = "button-bar-item";
      //
      if (!widget.caption)
        itemClass += " menu-separator";
      //
      this.itemConf = this.createElementConfig({c: "IonItem", type: "button", className: "generic-item " + itemClass, events: ["onClick"]});
      this.labelConf = this.createElementConfig({c: "IonLabel"});
      this.itemConf.children.push(this.labelConf);
    }
    //
    // Realize the toolbar button
    if (this.isToolbar)
      this.toolbarButton = this.createElementConfig({c: "IonButton", className: `toolbar-cmd-btn ${widget.caption ? '' : 'tool-separator'}`, events: ["onClick"], useHTML: true});
  }
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfCommand.prototype.realize = function (widget, parent, view)
{
  if (this.skipRealize)
    return;
  //
  // Create elements configuration
  this.createElementsConfig(widget);
  //
  if (this.isCommandSet()) {
    if (this.isMenu)
      this.realizeMenuCommandSet();
    if (this.isToolbar)
      this.realizeToolbarCommandSet();
    //
    this.createChildren(widget);
  }
  else if (this.type === Client.IdfCommand.types.COMMAND) {
    if (this.parent instanceof Client.IdfButtonBar)
      this.mainObjects.push(this.parent.getRootObject(true).insertBefore({child: this.itemConf}));
    else if (this.isMenu && this.parent.isMenu) {
      // The GROUPED menu submenus have a different container/layout
      if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.GROUPED && this.parent.level !== 1)
        this.mainObjects.push(Client.eleMap[this.parent.commandsContainerConf.id].insertBefore({child: this.itemConf}));
      else
        this.mainObjects.push(Client.eleMap[this.parent.listConf.id].elements[1].insertBefore({child: this.itemConf}));
    }
    //
    // In this case I must create myself into the parent toolbar toolContainer
    if (this.isToolbar && this.parent?.toolBox)
      this.mainObjects.push(Client.eleMap[this.parent.toolBox.id].insertBefore({child: this.toolbarButton}));
  }
};


/**
 * Realize menu command set
 */
Client.IdfCommand.prototype.realizeMenuCommandSet = function ()
{
  // Create IonList and its children
  let listEl = this.parent.getRootObject(true).insertBefore({child: this.listConf, sib: this.parent.openViewsListConf?.id});
  //
  // Children have to be created inside the first IonList -> itemsContainer
  if (Client.mainFrame.wep?.menuType !== Client.IdfWebEntryPoint.menuTypes.GROUPED || this.level === 1)
    this.mainObjects.push(listEl);
  else {
    // In a grouped menu the commandsContainerConf must be created into the
    // level page of the main menu, the header into the parent
    this.commandsContainerConf.visible = false;
    let contentEl = this.view.createElement(this.commandsContainerConf, Client.eleMap[Client.mainFrame.wep.commandList["menuPage" + (this.level - 1)].id], this.view);
    this.mainObjects.push(contentEl);
  }
};


/**
 * Realize toolbar command set
 */
Client.IdfCommand.prototype.realizeToolbarCommandSet = function ()
{
  // TODO
  // In IDF prendiamo i dati che ci arrivano dal server, in IDC
  // non li abbiamo ma li decidiamo qui in base al padre (siamo direttamente figli dell'oggetto giusto)
  let toolCont = this.toolCont;
  let form = this.form;
  if (!Client.mainFrame.isIDF) {
    if (this.parent instanceof Client.IdfView) {
      toolCont = 0;
      form = 1;
    }
    if (parent instanceof Client.IdfFrame) {
      toolCont = 1;
      form = 1;
    }
  }
  //
  // Global Toolbar
  if (toolCont === -1)
    Client.mainFrame.wep.realizeCommandSet(this.toolBox);
  else if (toolCont === 0 && form > 0) { // Form Toolbar
    let idfView = Client.mainFrame.isIDF ? Client.eleMap["frm:" + form] : this.parent;
    idfView?.realizeCommandSet(this.toolBox);
  }
  else if (toolCont > 0 && form > 0) { // Frame Toolbar
    let frame;
    //
    if (Client.mainFrame.isIDF) {
      let firstIdx, index, lastIdx;
      let flist = Client.eleMap["frm:" + form].getFrameList();
      //
      for (let f = 0; f < flist.length; f++) {
        // frame id format :  [book||pan||tbv||gra]:INDEX:FORMINDEX
        if (!flist[f].id)
          continue;
        //
        firstIdx = flist[f].id.indexOf(":");
        lastIdx = flist[f].id.lastIndexOf(":");
        index = parseInt(flist[f].id.substring(firstIdx + 1, lastIdx));
        if (index === toolCont) {
          frame = flist[f];
          break;
        }
      }
    }
    else
      frame = this.parent;
    //
    frame?.realizeCommandSet(this.toolBox);
  }
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfCommand.prototype.createChildren = function (el)
{
  if (el.children) {
    // Check if the child is already present, if not create it by calling the widget createChildren, otherwise
    // check if the child is present but if is a child of toolbar form or frame check if the toolbar button is created.
    // if not maybe it was realized and destroyed by a form previous close. In that case re-realize it
    this.elements = this.elements || [];
    for (let i = 0; i < el.children.length; i++) {
      let child = Client.eleMap[el.children[i].id];
      if (!child) {
        let prevId = el.children[i].previd;
        delete el.children[i].previd;
        delete el.children[i].parid;
        child = this.view.createElement(el.children[i], this, this.view);
        //
        // During the differential update of the books, children are added in specific positions
        if (prevId)
          this.elements.splice(this.elements.findIndex(e => e.id === prevId), 0, child);
        else
          this.elements.push(child);
      }
      else {
        let reRealize = (child && (this.isMenu || this.isToolbar) && this.form !== 0 && !child.mainObjects?.length);
        //
        // Don't realize the commands of a menu commandset in MENUBAR mode, they will be created by the popup
        if (this.isMenu && Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR && this.isCommandSet())
          reRealize = false;
        if (reRealize) {
          // The realize uses only the caption property to add the separator class if empty caption
          // we need to set a value so the command will not be considered a separator (that may be hidden)
          child.realize({caption: child.caption}, child.parent, child.view);
          //
          // After the re-realization we need to set the properties needed for this child, so we
          // - memorize all the needed properties in an object
          // - use that object to reseed the updateelement
          // we cannot use the el.children[i] because they are DESIGN TIME properties, and the user can have changed them and sent those changes
          // in an already processed request
          let reconfig = {};
          let cmdProps = [];
          for (let x in Client.IdfCommand.transPropMap)
            cmdProps.push(Client.IdfCommand.transPropMap[x]);
          for (let x1 in Client.Widget.transPropMap)
            cmdProps.push(Client.Widget.transPropMap[x1]);
          for (let p in child)
            if (cmdProps.indexOf(p) > 0)
              reconfig[p] = child[p];
          //
          child.realizing = true;
          child.updateElement(reconfig);
          delete child.realizing;
        }
        else {
          // Otherwise recursively create its children and then update it
          child.createChildren(el.children[i]);
          child.updateElement(el.children[i]);
        }
      }
    }
  }
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfCommand.prototype.updateElement = function (props)
{
  if (this.skipRealize)
    return;
  //
  props = props || {};
  //
  let oldProps;
  //
  // Some toolbar commands (for example IdfPanel toolbar commands) are realized only when the object they belong to is shown.
  // Since in the widget constructor all the initial properties are attached to "this", the updateElement after realizing wouldn't have effect
  // because Client.Widget.prototype.updateElement would purge properties that are not changed.
  // So in this case I have to ensure props are updated even if they are as same as before
  if (this.toRealizeToolbar)
    oldProps = Object.assign({}, props);
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (oldProps)
    props = oldProps;
  //
  let handleImage = false;
  if (props.caption !== undefined) {
    handleImage = true;
    //
    // Extract the image from the caption if present
    let {caption, icon, color} = Client.Widget.extractCaptionData(this.caption);
    //
    // If there is an icon, set it as image and set its color
    if (icon) {
      this.image = icon;
      this.iconColor = color || "primary";
    }
    //
    if (this.isMenu || this.buttonBarId || this.parent instanceof Client.IdfButtonBar) {
      let el = Client.eleMap[this.buttonBarId] || Client.eleMap[this.labelConf?.id];
      el?.updateElement({innerHTML: this.getCaptionWithAccelerator()});
      //
      // I'm not a separator anymore
      if (this.itemConf)
        Client.Widget.updateElementClassName(Client.eleMap[this.itemConf.id], "menu-separator", true);
    }
    if (this.isToolbar && this.toolbarButton) {
      let el = Client.eleMap[this.toolbarButton.id];
      el?.updateElement({label: Client.Widget.getHTMLForCaption(this.caption)});
    }
  }
  //
  if (props.enabled !== undefined) {
    this.enabled = props.enabled;
    //
    if (this.isToolbar && this.toolbarButton) {
      let el = Client.eleMap[this.toolbarButton.id];
      el?.updateElement({enabled: props.enabled});
    }
  }
  //
  if (props.visible !== undefined) {
    this.visible = props.visible;
    if (this.isMenu || this.parent instanceof Client.IdfButtonBar) {
      let el = this.itemConf ? Client.eleMap[this.itemConf.id] : Client.eleMap[this.listConf.id];
      el?.updateElement({visible: props.visible});
      //
      Client.mainFrame.wep?.commandList?.checkMobileMenu();
    }
    //
    if (this.isToolbar) {
      let el = this.toolbarButton ? Client.eleMap[this.toolbarButton.id] : Client.eleMap[this.toolBox?.id];
      el?.updateElement({visible: props.visible});
    }
  }
  //
  if (props.type !== undefined)
    this.type = props.type;
  if (props.requireConf !== undefined)
    this.requireConf = props.requireConf;
  if (props.showNames !== undefined)
    this.showNames = props.showNames;
  if (props.commandCode !== undefined)
    this.commandCode = props.commandCode;
  //
  if (props.toolCont !== undefined) {
    this.toolCont = props.toolCont;
    //
    // When we should have realized the toolCont value was not set (-2) in that case we
    if (this.toRealizeToolbar && this.isToolbar && this.form !== 0 && this.toolCont > 0) {
      // Check if the frame is already realized in the view, maybe toolCont is a subframe
      let frameFound = Client.eleMap["frm:" + this.form]?.getFrameByIndex(this.toolCont);
      if (!frameFound)
        toRealize = false;
      if (frameFound) {
        this.realize(this.conf, this.parent, this.view);
        this.updateElement(JSON.parse(JSON.stringify(this.conf)));
        delete this.toRealizeToolbar;
      }
    }
  }
  //
  if (props.expanded !== undefined) {
    // Handle changes on expanded property just in case of command set
    if (this.isCommandSet() && this.isMenu) {
      this.expanded = props.expanded;
      this.handleExpansion();
    }
  }
  //
  if (props.image !== undefined) {
    this.image = props.image;
    handleImage = true;
  }
  if (props.badge !== undefined) {
    if (this.badge) {
      if (this.type === Client.IdfCommand.types.COMMAND && (this.isMenu || this.parent instanceof Client.IdfButtonBar)) {
        if (!this.menuBadge) {
          let prntObjConf = this.headerConf || this.itemConf;
          let parEl = Client.eleMap[prntObjConf.id];
          if (parEl) {
            let badgeConf = this.createElementConfig({c: "IonBadge", className: "generic-badge"});
            this.menuBadge = parEl.insertBefore({child: badgeConf});
          }
        }
        //
        if (this.menuBadge)
          this.menuBadge.updateElement({visible: true, innerText: this.badge});
      }
    }
    else {
      if (this.menuBadge)
        this.menuBadge.updateElement({visible: false});
    }
  }
  if (props.tooltip !== undefined) {
    let {caption, icon, color} = Client.Widget.extractCaptionData(this.caption);
    let tooltip = Client.Widget.getHTMLTooltip(caption, this.tooltip, this.fknum, this.commandCode);
    //
    if (this.headerConf) {
      let el = Client.eleMap[this.headerConf.id];
      el.updateElement({tooltip});
    }
    if (this.itemConf) {
      let el = Client.eleMap[this.itemConf.id];
      el.updateElement({tooltip});
    }
    if (this.toolbarButton) {
      let el = Client.eleMap[this.toolbarButton.id];
      el?.updateElement({tooltip});
    }
  }
  if (props.className !== undefined) {
    let oldClassName = this.className || "";
    this.className = props.className;
    handleImage = true;
    //
    let el;
    if (this.isCommandSet()) {
      if (this.isMenu)
        el = Client.eleMap[this.listConf.id];
      else if (this.isToolbar)
        el = Client.eleMap[this.toolBox.id];
    }
    else {
      if (this.isMenu || this.parent instanceof Client.IdfButtonBar)
        el = Client.eleMap[this.itemConf.id];
      else if (this.isToolbar)
        el = Client.eleMap[this.toolbarButton.id];
    }
    //
    Client.Widget.updateElementClassName(el, oldClassName, true);
    Client.Widget.updateElementClassName(el, this.className);
  }
  if (props.fknum !== undefined)
    this.fknum = props.fknum;
  if (props.accelerator !== undefined)
    this.accelerator = props.accelerator;
  //
  if (props.canDrag !== undefined)
    this.canDrag = props.canDrag;
  if (props.canDrop !== undefined)
    this.canDrop = props.canDrop;
  //
  if (props.expandEventDef !== undefined)
    this.expandEventDef = props.expandEventDef;
  //
  if (handleImage)
    this.handleImage();
  //
  if (props.delete) {
    this.close(true, false);
    //
    if (this.parent.conf?.children) {
      // We must be removed also from the configuration
      let idx = this.parent.conf.children.findIndex((el) => el.id === this.id);
      if (idx > -1)
        this.parent.conf.children.splice(idx, 1);
    }
    //
    // Remove from the elements of the parent
    let idx = this.parent?.elements?.indexOf(this) ?? -1;
    if (idx > -1)
      this.parent.elements.splice(idx, 1);
  }
};


Client.IdfCommand.prototype.getCaptionWithAccelerator = function ()
{
  let {caption, icon, color} = Client.Widget.extractCaptionData(this.caption);
  if (!this.accelerator)
    return caption;
  //
  let cpt = caption;
  let p = cpt.toUpperCase().indexOf(this.accelerator);
  if (p > -1)
    cpt = cpt.substr(0, p) + "<u>" + cpt.substr(p, 1) + "</u>" + cpt.substr(p + 1);
  return cpt;
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfCommand.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      events.push(...this.handleClick(event));
      break;
  }
  //
  return events;
};


/**
 * Handle popup response
 * @param {Object} event
 */
Client.IdfCommand.prototype.handlePopupResponse = function (event)
{
  if (Client.mainFrame.wep)
    delete Client.mainFrame.wep.menuBarOpened;
  //
  let events = [];
  //
  // Search the clicked command
  let fnd = false;
  for (let j = 0; j < this.elements.length; j++) {
    let cmd = this.elements[j];
    //
    // Let the command handle the click
    if (cmd.id === event.content.res) {
      event.id = "onClick";
      events.push(...cmd.onEvent(event));
      fnd = true;
    }
    else if (Client.mainFrame.isIDF && cmd.children?.length > 0 && (cmd.getChildList().indexOf(event.content.res) >= 0)) {
      // A child command was clicked (on all level)
      fnd = true;
      events.push({
        id: "clk",
        def: this.clickEventDef,
        content: {
          oid: event.content.res
        }
      });
    }
  }
  //
  if (this.isFormList && !fnd) {
    let flist = Client.mainFrame.wep?.commandList;
    if (flist) {
      event.id = "onClick";
      event.obj = event.content.res;
      events.push(...flist.onEvent(event));
    }
  }
  //
  this.closePopup();
  //
  return events;
};


/**
 * Handle click
 * @param {Object} event
 */
Client.IdfCommand.prototype.handleClick = function (event)
{
  let events = [];
  //
  if (this.isCommandSet())
    events.push(...this.handleCommandSetClick(event));
  else if (this.type === Client.IdfCommand.types.COMMAND)
    events.push(...this.handleCommandClick(event));
  //
  return events;
};


/**
 * Open menu bar
 */
Client.IdfCommand.prototype.openMenubar = function ()
{
  let cmdList = [];
  let hasImageBackground = false;
  //
  // Add commands
  for (let i = 0; i < this.elements.length; i++) {
    let cmd = this.elements[i];
    if (!cmd.visible)
      continue;
    //
    let {it, hasBackground} = this.createCommandPopupConfiguration(cmd);
    cmdList.push(it);
    hasImageBackground = hasImageBackground || hasBackground;
  }
  //
  // Add open views
  if (this.isFormList) {
    let flist = Client.mainFrame.wep?.commandList?.openViews || [];
    for (let i = 0; i < flist.length; i++)
      cmdList.push({
        id: flist[i].viewId,
        html: true,
        title: `<u>${i + 1}</u> ${flist[i].viewName}`
      });
  }
  //
  if (cmdList.length) {
    Client.mainFrame.wep.menuBarOpened = this;
    Client.mainFrame.popup({
      options: {
        type: "menu",
        refObj: this.headerConf.id,
        offset: 15,
        style: "top-menu-popup" + (hasImageBackground ? " with-background" : ""),
        items: cmdList,
        callback: res => Client.mainFrame.sendEvents(this.handlePopupResponse({id: "popupCallback", content: {res}}))
      }
    });
  }
};

/**
 * Create the configuration for the popup
 * @param {idfCommand} cmd
 */
Client.IdfCommand.prototype.createCommandPopupConfiguration = function (cmd)
{
  let hasBackground = false;
  let {caption, icon, color} = Client.Widget.extractCaptionData(cmd.caption);
  let it = {
    id: cmd.id,
    html: true,
    title: cmd.getCaptionWithAccelerator ? cmd.getCaptionWithAccelerator() : caption
  };
  if (icon)
    it.icon = icon;
  if (color)
    it.color = color;
  if (cmd.tooltip)
    it.tooltip = cmd.tooltip + Client.Widget.getFKTip(cmd.fknum, cmd.commandCode);
  //
  if (cmd.image) {
    let img = cmd.image;
    if (Client.Widget.isIconImage(img))
      it.icon = img;
    else {
      hasBackground = true;
      let src = (Client.mainFrame.isIDF ? "images/" : "") + img;
      it.style = "background-image: url('" + src + "');";
    }
  }
  //
  if (cmd.children?.length) {
    it.children = [];
    for (let i = 0; i < cmd.children.length; i++) {
      let cmd2 = cmd.children[i];
      if (cmd2.visible === false)
        continue;
      //
      let ret = this.createCommandPopupConfiguration(cmd2);
      it.children.push(ret.it);
      hasBackground = hasBackground || ret.hasBackground;
    }
  }
  //
  return {it, hasBackground};
}

/**
 * Handle click on command set
 * @param {Object} event
 */
Client.IdfCommand.prototype.handleCommandSetClick = function (event)
{
  let events = [];
  //
  // If user clicks on command set expand button
  if (event.obj === this.headerConf?.id) {
    // Top  Menu : Click on a CommandSet header -> show the commands by using a popup
    if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR)
      this.openMenubar();
    //
    // If I'm on IDF, change expansion status just if expand event has to be handled client side too
    if (!Client.mainFrame.isIDF || Client.IdfMessagesPump.isClientSideEvent(this.expandEventDef))
      this.updateElement({expanded: !this.expanded});
    //
    // Give event the IDF format
    if (Client.mainFrame.isIDF) {
      events.push({
        id: "clk",
        def: this.expandEventDef,
        content: {
          oid: this.id
        }
      });
    }
    else { // On IDC send onExpand event
      events.push({
        id: "onExpand",
        obj: this.id,
        content: this.expanded
      });
    }
  }
  //
  return events;
};


/**
 * Handle click on command
 * @param {Object} event
 */
Client.IdfCommand.prototype.handleCommandClick = function (event)
{
  let events = [];
  //
  // On mobile and taskbar close the menu when handling a command
  // also in responsive mode when the menu is smartphone mode (exposed == false)
  let splitObj = Client.eleMap[Client.mainFrame.wep?.mainContainerConf.id];
  let responsivemode = splitObj && Client.mainFrame.wep?.defaultResponsiveClass !== "" && Client.mainFrame.wep?.defaultResponsiveClass !== undefined;
  if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.TASKBAR || (Client.mainFrame.idfMobile && !this.isToolbar) || (responsivemode && !splitObj?.exposed)) {
    let flist = Client.mainFrame.wep?.commandList;
    if (flist) {
      if (Client.mainFrame.idfMobile || Client.mainFrame.wep?.menuType !== Client.IdfWebEntryPoint.menuTypes.TASKBAR)
        flist.toggleMenu();
      else
        flist.hideMenu();
    }
  }
  //
  let addEvent = true;
  if (this.requireConf)
    addEvent = confirm(this.caption + ": " + Client.mainFrame.wep?.SRV_MSG_Confirm);
  //
  if (!addEvent)
    return events;
  //
  // Give event the IDF format
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "clk",
      def: this.clickEventDef,
      content: {
        oid: this.id
      }
    });
    Client.mainFrame.wep?.soundAction(Client.IdfWebEntryPoint.soundDef.command);
  }
  else { // On IDC send onClick event as is. Just change object on which to fire the event
    event.obj = this.id;
    events.push(event);
  }
  //
  return events;
};


/**
 * Expand/collapse command set
 */
Client.IdfCommand.prototype.handleExpansion = function ()
{
  // Get elements
  let expandButton = Client.eleMap[this.expandButtonConf.id];
  let commandsContainer = Client.eleMap[this.listConf.id];
  //
  // Update expand button icon
  let icon = this.expanded ? "arrow-dropup" : "arrow-dropdown";
  if (Client.mainFrame.wep?.menuType !== Client.IdfWebEntryPoint.menuTypes.GROUPED)
    expandButton.updateElement({icon: icon});
  //
  // Expand or collapse commands container
  if (Client.mainFrame.wep?.menuType !== Client.IdfWebEntryPoint.menuTypes.GROUPED || this.level === 1) {
    let expc = this.expanded ? " expanded" : " collapsed";
    let className = `main-menu-list collapsible-container cmd-level-${this.level} ${expc}`;
    commandsContainer.updateElement({className});
  }
  else {
    commandsContainer = Client.eleMap[this.commandsContainerConf.id];
    commandsContainer.updateElement({visible: this.expanded});
    //
    let altContainer = Client.eleMap[Client.mainFrame.wep.commandList.menuInnerConf.id];
    let menuheader = Client.eleMap[Client.mainFrame.wep.commandList.menuHeaderConf.id];
    altContainer.updateElement({selectedPage: this.expanded ? this.level - 1 : this.level - 2});
    menuheader.updateElement({backButton: this.expanded || this.level > 2});
    //
    if (this.expanded)
      Client.mainFrame.wep.commandList.expandedMenus.push(this);
  }
};


/**
 * Remove the element and its children from the element map
 */
Client.IdfCommand.prototype.clearElements = function ()
{
  if (this.toolBox && Client.eleMap[this.toolBox.id])
    Client.eleMap[this.toolBox.id].close(true);
  if (this.toolbarButton && Client.eleMap[this.toolbarButton.id])
    Client.eleMap[this.toolbarButton.id].close(true);
  //
  if (this.listConf && Client.eleMap[this.listConf.id])
    Client.eleMap[this.listConf.id].close(true);
  if (this.itemConf && Client.eleMap[this.itemConf.id])
    Client.eleMap[this.itemConf.id].close(true);
  //
  for (let j = 0; j < this.elements.length; j++)
    this.elements[j].clearElements();
  //
  // Remove also the mainobjects pointers (they should be closed already, but the check is worthwile)
  for (let j = 0; j < this.mainObjects.length; j++)
    if (Client.eleMap[this.mainObjects[j].id])
      this.mainObjects[j].close(true);
  this.mainObjects = [];
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfCommand.prototype.close = function (firstLevel, triggerAnimation)
{
  Client.Widget.prototype.close.call(this, firstLevel, triggerAnimation);
  //
  // Remove the toolbar elements
  if (this.toolBox && Client.eleMap[this.toolBox.id])
    Client.eleMap[this.toolBox.id].close(firstLevel);
  if (this.toolbarButton && Client.eleMap[this.toolbarButton.id])
    Client.eleMap[this.toolbarButton.id].close(firstLevel);
};


Client.IdfCommand.prototype.handleImage = function ()
{
  let onlyIcon = this.image && (this.caption?.trim() === "");
  let onlyCaption = !this.image;
  //
  // Toolbar IMAGE (only for images, icon images are already handled by the innerHTML caption)
  if (this.toolbarButton && Client.eleMap[this.toolbarButton.id] && !Client.Widget.isIconImage(this.image)) {
    let el = Client.eleMap[this.toolbarButton.id];
    let label;
    let addNoBackgroundClass;
    //
    // Hide the label if the server has sent a real image and the commandset has not the
    // shownames property set
    if (this.image && !Client.Widget.isIconImage(this.image) && !this.parent.showNames) {
      label = "";
      if (Client.IdfCommand.useToolbarIMG) {
        label = `<img src='${(Client.mainFrame.isIDF ? "images/" : "") + this.image}' />`;
        addNoBackgroundClass = true;
      }
    }
    //
    Client.Widget.updateElementClassName(el, "no-background", !addNoBackgroundClass);
    Client.Widget.updateObject(el, {label});
    //
    if (!Client.IdfCommand.useToolbarIMG)
      Client.Widget.setIconImage({image: this.image, el, color: this.iconColor});
  }
  //
  if (this.isMenu || this.parent instanceof Client.IdfButtonBar) {
    let prntObjConf = this.headerConf || this.itemConf;
    let parEl = Client.eleMap[prntObjConf.id];
    //
    // for example if the menu is toolbar the commands are not realized, they are created
    // only when the commandset is clicked in a popup
    if (!parEl)
      return;
    //
    if (this.image) {
      let imgType = Client.Widget.isIconImage(this.image) ? "IonIcon" : "Container";
      //
      // Check if the image object exists and has the corret type
      let classParam = this.menuImageConf?.class ? "class" : "c";
      if (!this.menuImageConf || (this.menuImageConf && this.menuImageConf[classParam] !== imgType) || (this.menuImageConf && !Client.eleMap[this.menuImageConf.id])) {
        if (this.menuImageConf) {
          let el = Client.eleMap[this.menuImageConf.id];
          if (el) {
            // Remove from parEl elements list
            if (parEl.elements.indexOf(el) !== -1)
              parEl.elements.splice(parEl.elements.indexOf(el), 1);
            //
            el.close(true);
          }
        }
        //
        this.menuImageConf = this.createElementConfig({c: imgType, className: "menu-img-obj"});
        let el = this.view.createElement(this.menuImageConf, this.parent, this.view);
        parEl.appendChildObject(el, el.domObj);
        parEl.elements.push(el);
      }
      //
      // Set the image
      let el = Client.eleMap[this.menuImageConf.id];
      Client.Widget.setIconImage({image: this.image, el, innerObj: el.getRootObject(), color: this.iconColor});
    }
    else if (this.menuImageConf) {
      // Hide the image object
      let el = Client.eleMap[this.menuImageConf.id];
      el.updateElement({visibile: false});
    }
  }
};


/**
 * A command set could be an object of type commandset or a command object with the flag typeCommandSet
 * set to true. This is valid only for second-level commandsets.
 *
 * @param {object} widget - the configuration, if set we will use that for search
 */
Client.IdfCommand.prototype.isCommandSet = function (widget)
{
  if (widget)
    return widget.type === Client.IdfCommand.types.COMMANDSSET || widget.typeCommandSet;
  //
  return this.type === Client.IdfCommand.types.COMMANDSSET || this.typeCommandSet;
};


Client.IdfCommand.prototype.getRootObject = function (el)
{
  let ele = this.mainObjects[0];
  if (!ele && this.isToolbar)
    ele = Client.eleMap[this.isCommandSet() ? this.toolBox.id : this.toolbarButton.id];
  return el ? ele : ele?.domObj;
};


Client.IdfCommand.prototype.acceptsDrop = function (element)
{
  return this.isCommandSet() ? false : this.parent.canDrop;
};


Client.IdfCommand.prototype.isDraggable = function (element)
{
  return this.isCommandSet() ? false : this.parent.canDrag;
};


/**
 * Handle function keys
 * @param {Object} event
 * @param {Number} formIdx
 * @param {Number} frameIdx
 */
Client.IdfCommand.prototype.handleFunctionKeys = function (event, formIdx, frameIdx)
{
  // Calculate the number of FKs from 1 to 48
  let fkn = (event.content.keyCode - 111) + (event.content.shiftKey ? 12 : 0) + (event.content.ctrlKey ? 24 : 0);
  //
  let ok = fkn === this.fknum; // must be the same as my fknum
  ok = ok && (this.isMenu || this.isToolbar); // it must be either a menu or a toolbar
  //
  if (formIdx > -1)
    ok = ok && formIdx === this.form && this.toolCont === frameIdx;
  //
  let events = [];
  if (ok) {
    events.push(...this.handleClick(event));
    if (events.length > 0) {
      event.content.srcEvent.preventDefault();
      return events;
    }
  }
  //
  // I pass the message to all child commands
  for (let i = 0; i < this.elements.length && events.length === 0; i++)
    events.push(...this.elements[i].handleFunctionKeys(event, formIdx, frameIdx));
  //
  return events;
};


/**
 * Handle accelerator keys
 * @param {Object} event
 * @param {Boolean} force
 */
Client.IdfCommand.prototype.handleAcceleratorKeys = function (event, force)
{
  let events = [];
  //
  // First level commandSet only
  if ((this.level > 1 || !this.isMenu || !this.isCommandSet()) && !force)
    return events;
  //
  // If I have the menu open, I'll try them...
  let code = event.content.keyCode;
  if (Client.mainFrame.wep.menuBarOpened) {
    for (var i = 0; i < this.elements.length && events.length === 0; i++)
      events.push(...this.elements[i].handleAcceleratorKeys(event, true));
    //
    if (events.length === 0 && this.isFormList && code > 48 && code <= 57) {
      // Vediamo se e' una formlist...
      let flist = Client.mainFrame.wep?.commandList?.openViews || [];
      let flItem = flist[code - 49];
      if (flItem)
        events.push(...this.handlePopupResponse({id: "popupCallback", content: {res: flItem.id}}));
    }
  }
  //
  if (events.length === 0) {
    // Vediamo se sono io...
    if (this.accelerator?.charCodeAt(0) === code) {
      if (Client.mainFrame.wep.menuBarOpened)
        events.push(...this.parent.handlePopupResponse({id: "popupCallback", content: {res: this.id}}));
      else
        events.push(...this.handleClick({obj: this.headerConf?.id}));
    }
  }
  //
  if (events.length > 0)
    event.content.srcEvent.preventDefault();
  //
  return events;
};


Client.IdfCommand.prototype.closePopup = function ()
{
  let popovers = document.getElementsByTagName("ion-popover");
  popovers.item(popovers.lnegth - 1)?.click();
};


Client.IdfCommand.prototype.isPopupMenu = function ()
{
  return this.isCommandSet() && !this.isToolbar && !this.isMenu && !this.buttonBarId;
};


/*
 * Get all the children and all the child children
 */
Client.IdfCommand.prototype.getChildList = function ()
{
  let list = [];
  list.push(...this.children);
  for (let j = 0; j < list.length; j++) {
    if (list[j].children?.length > 0)
      list.push(...list[j].children);
  }
  //
  let ret = [];
  for (let j = 0; j < list.length; j++)
    ret.push(list[j].id);
  //
  return ret;
};

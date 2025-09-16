/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class Base class for every object in the client
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfWebEntryPoint = function (widget, parent, view)
{
  Client.mainFrame.wep = this;
  //
  // For the mobile shell, it calls RD3_DesktopManager.WebEntryPoint. ....
  RD3_DesktopManager = {};
  RD3_DesktopManager.WebEntryPoint = this;
  //
  // Set default values
  let animationDefs = {};
  Object.entries(Client.IdfWebEntryPoint.animationDefs).forEach(e => animationDefs[`${e[0]}AnimationDef`] = e[1]);
  //
  widget = Object.assign({
    menuType: Client.IdfWebEntryPoint.menuTypes.LEFT,
    showDisabledIcons: false,
    showSmartLookupIcon: false,
    rightAlignedIcons: false,
    showFieldImageInValue: true,
    animationsEnabled: true,
    soundEnabled: true,
    language: "ENG",
    debugType: Client.IdfWebEntryPoint.debugTypes.NONE,
    visualFlags: 0x00000EFF,
    showLogoff: true,
    decimalDot: false,
    sideMenuWidth: 160,
    comboNameSeparator: "; ",
    currencyMask: "#,###,###,##0.00",
    dateMask: "dd/mm/yyyy",
    timeMask: "hh:nn",
    floatMask: "#,###,###,###.####",
    panelLikeSearch: true,
    panelLikeMode: 1, // 1 STARTS - 2 CONTAINS
    welcomeURL: (Client.mainFrame.isIDF ? "qhelp.htm" : undefined),
    globalToolbarPosition: Client.IdfWebEntryPoint.globalTlbPos.HEADER,
    appDarkTheme: "AUTO",
    resizableFrames: false,
    motionThreshold: {acceleration: 999, rotation: 999},
    //
    closeAllEventDef: (Client.mainFrame.isIDF ? (Client.IdfMessagesPump.eventTypes.SERVERSIDE | Client.IdfMessagesPump.eventTypes.IMMEDIATE) : undefined),
    closeAppEventDef: (Client.mainFrame.isIDF ? (Client.IdfMessagesPump.eventTypes.SERVERSIDE | Client.IdfMessagesPump.eventTypes.IMMEDIATE) : undefined),
    //
    ...animationDefs
  }, widget);
  //
  // Commands zones refer to panel toolbar
  this.commandsZones = [];
  //
  // If I'm on IDF, server gives me commands zones. Use "0-th" zone as default zone
  if (Client.mainFrame.isIDF) {
    for (let i = 0; i < 48; i++)
      this.commandsZones[i] = widget["cz" + i] || 0;
  }
  //
  // Stack of opened views
  this.navStack = [];
  //
  // Modals and docked views
  this.secondaryViews = [];
  //
  // Detect responsive support in theme
  this.defaultResponsiveClass = Client.Utils.getCSSVarValue("--default-responsive-class");
  //
  this.tooltips = [];
  //
  let realHandledKeys = widget.handledKeys;
  widget.handledKeys = -1;
  //
  Client.Widget.call(this, widget, parent, view);
  //
  this.handledKeys = realHandledKeys;
};


// Make Client.IdfWebEntryPoint extend Client.Widget
Client.IdfWebEntryPoint.prototype = new Client.Widget();


Client.IdfWebEntryPoint.transPropMap = {
  thm: "theme",
  act: "activeViewId",
  clo: "closeAllEventDef",
  cla: "closeAppEventDef",
  met: "menuType",
  shd: "showDisabledIcons",
  sli: "showSmartLookupIcon",
  rai: "rightAlignedIcons",
  sfi: "showFieldImageInValue",
  ena: "animationsEnabled",
  lan: "language",
  dbi: "debugType",
  hlp: "helpURL",
  cmd: "commandPrompt",
  rfi: "refreshInterval",
  rlo: "refreshLocation",
  wid: "widgetMode",
  dec: "decimalDot",
  wel: "welcomeURL",
  shl: "showLogoff",
  smw: "sideMenuWidth",
  cns: "comboNameSeparator",
  vfl: "visualFlags",
  prg: "progressFile",
  ent: "entryPoint",
  cmk: "currencyMask",
  dmk: "dateMask",
  tmk: "timeMask",
  fmk: "floatMask",
  pls: "panelLikeSearch",
  plm: "panelLikeMode",
  snd: "soundEnabled",
  gtp: "globalToolbarPosition",
  img: "mainImage",
  acc: "primaryColor",
  scl: "secondaryColor",
  dcl: "dangerColor",
  dcd: "darkColor",
  lcl: "lightColor",
  bcl: "brightColor",
  vcl: "vibrantColor",
  dmt: "appDarkTheme",
  frs: "resizableFrames",
  mth: "motionThreshold",
  //
  // Animation definitions
  sta: "startAnimationDef",
  sma: "sidebarAnimationDef",
  eca: "menuAnimationDef",
  pma: "popupAnimationDef",
  sfa: "formAnimationDef",
  oma: "modalAnimationDef",
  msa: "messageAnimationDef",
  lma: "lastMessageAnimationDef",
  cfa: "frameAnimationDef",
  eta: "treeAnimationDef",
  cya: "listAnimationDef",
  qta: "qbeTipAnimationDef",
  cta: "tabAnimationDef",
  sga: "graphAnimationDef",
  cba: "bookAnimationDef",
  rda: "redirectAnimationDef",
  pra: "previewAnimationDef",
  dka: "dockedAnimationDef",
  ppr: "popupResizeAnimationDef",
  ttp: "tooltipAnimationDef",
  tsk: "taskbarAnimationDef",
  cmb: "comboAnimationDef",
  ent1: "tabWithEnter",
  //
  // Server messages
  M001: "SRV_MSG_UpdateView", M002: "SRV_MSG_ResetQBE", M003: "SRV_MSG_BackToApp", M004: "SRV_MSG_RequiredValue", M005: "SRV_MSG_DeleteDoc",
  M006: "SRV_MSG_LoadDoc", M007: "SRV_MSG_CloseView", M008: "SRV_MSG_CloseModal", M009: "SRV_MSG_CloseApp", M010: "SRV_MSG_CloseAll",
  M011: "SRV_MSG_Attach", M012: "SRV_MSG_Comments", M013: "SRV_MSG_ConfirmDelete", M014: "SRV_MSG_ConfirmChoice", M015: "SRV_MSG_CreatePDF",
  M016: "SRV_MSG_Confirm", M017: "SRV_MSG_Print", M018: "SRV_MSG_OpenDoc", M019: "SRV_MSG_ChooseDoc", M020: "SRV_MSG_ShowMenu",
  M021: "SRV_MSG_ShowFrame", M022: "SRV_MSG_HideMenu", M023: "SRV_MSG_HideFrame", M024: "SRV_MSG_PageNumOf", M025: "SRV_MSG_PanelPrevPage",
  M026: "SRV_MSG_BookPrevPage", M027: "SRV_MSG_PanelNextPage", M028: "SRV_MSG_BookNextPage", M029: "SRV_MSG_StatusData1", M030: "SRV_MSG_StatusData2",
  M031: "SRV_MSG_StatusInsert", M032: "SRV_MSG_StatusQBE", M033: "SRV_MSG_StatusUpdated", M034: "SRV_MSG_Cancel", M035: "SRV_MSG_Search",
  M036: "SRV_MSG_Delete", M037: "SRV_MSG_UnselectAllRows", M038: "SRV_MSG_Duplicate", M039: "SRV_MSG_FormList", M040: "SRV_MSG_Insert",
  M041: "SRV_MSG_Lock", M042: "SRV_MSG_ShowMultiSel", M043: "SRV_MSG_ShowRowSel", M044: "SRV_MSG_Reload", M045: "SRV_MSG_SelectAllRows",
  M046: "SRV_MSG_Find", M047: "SRV_MSG_Unlock", M048: "SRV_MSG_Update", M049: "SRV_MSG_BookEnd", M050: "SRV_MSG_PanelEnd", M051: "SRV_MSG_PanelStart",
  M052: "SRV_MSG_BookStart", M053: "SRV_MSG_OpenViews", M054: "SRV_MSG_ShowDoc", M055: "SRV_MSG_RowNum", M056: "SRV_MSG_RowNumOf", M057: "SRV_MSG_Export",
  M058: "SRV_MSG_ErrorNum", M059: "SRV_MSG_ErrorEffects", M060: "SRV_MSG_ErrorAction", M061: "SRV_MSG_ErrorSource", M062: "SRV_MSG_ErrorButton",
  M063: "SRV_MSG_Wait", M064: "SRV_MSG_Group", M065: "SRV_MSG_ShowSelCommands"
};


Client.IdfWebEntryPoint.menuTypes = {
  LEFT: 1,
  RIGHT: 2,
  MENUBAR: 3,
  TASKBAR: 4,
  GROUPED: 5
};

Client.IdfWebEntryPoint.debugTypes = {
  NONE: 0,
  DEBUG: 1,
  HELP: 2
};


Client.IdfWebEntryPoint.globalTlbPos = {
  HEADER: 1,
  STRIP: 2
};


Client.IdfWebEntryPoint.soundDef = {
  close: "close.mp3",
  open: "open.mp3",
  delete: "delete.mp3",
  update: "update.mp3",
  login: "login.mp3",
  logoff: "logoff.mp3",
  command: "command.mp3",
  info: "info.mp3",
  warning: "warning.mp3",
  error: "error.mp3"
};


Client.IdfWebEntryPoint.soundActions = {
  PLAY: "play",
  STOP: "stop",
  PAUSE: "pause",
  CONTINUE: "continue",
  STOPALL: "stopall"
};


Client.IdfWebEntryPoint.animationDefs = {
  start: "fade:250",
  sidebar: "scroll:250",
  menu: "fold:250",
  popup: "scroll:250",
  form: "scroll-v:250!",
  modal: "zoom:250!",
  message: "fold:250",
  lastMessage: "fade:250",
  frame: "fold:250!",
  tree: "fold:250",
  list: "scroll-h:250!",
  qbeTip: "fade:250",
  tab: "scroll-h:250!",
  graph: "fade:250",
  book: "scroll:250!",
  redirect: "fade:250!",
  preview: "scroll:250!",
  docked: "scroll:250!",
  popupResize: "fold:250!",
  tooltip: "fade:250",
  taskbar: "fold:250",
  combo: "scroll:250",
  group: "fold:250"
};


Client.IdfWebEntryPoint.redirectWhenBlocked = false;
Client.IdfWebEntryPoint.alertWhenBlocked = true;


Object.defineProperty(Client.IdfWebEntryPoint.prototype, "activeView", {
  get: function () {
    return Client.eleMap[this.activeViewId];
  },
  set: function (viewId) {
    if (viewId === this.activeViewId && !this.realizing)
      return;
    //
    if (this.activeView)
      this.activeView.deactivate();
    //
    this.activeViewId = viewId;
    if (!this.activeViewId)
      return;
    //
    // Adjust navStack: activeView must be the last
    let navIndex = this.navStack.findIndex(view => view.elements[0] === this.activeView);
    if (navIndex !== -1 && navIndex !== this.navStack.length - 1)
      this.navStack.push(this.navStack.splice(navIndex, 1)[0]);
    //
    this.commandList?.activateViewOpenItem(this.activeView);
    //
    if (!this.activeView.modal && !this.activeView.docked) {
      let viewsContainer = Client.eleMap[this.viewsContainerConf.id];
      viewsContainer.updateElement({selectedPage: this.getPageOfView(this.activeView)});
    }
    //
    this.activeView.activate(this.activeViewChangedServerSide);
  }
});


/**
 * Create element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfWebEntryPoint.createConfigFromXml = function (xml)
{
  let attrList, attrNode;
  let config = {};
  config.customCommands = [];
  //
  // Look for "ccm" (custom commands) nodes into wep children
  for (let i = 0; i < xml.childNodes.length; i++) {
    let child = xml.childNodes[i];
    //
    if (child.nodeName === "ccm") {
      // Create a new custom command
      let customCommand = {};
      //
      // Add "ccm" node attributes as custom command properties
      attrList = child.attributes;
      for (let j = 0; j < attrList.length; j++) {
        attrNode = attrList[j];
        customCommand[attrNode.nodeName] = attrNode.nodeValue;
      }
      //
      // Translate specific configuration properties names
      Client.mainFrame.translateProperties(customCommand, Client.IdfCommand.transPropMap);
      //
      // Translate base configuration properties names
      Client.mainFrame.translateProperties(customCommand, Client.Widget.transPropMap);
      //
      // Convert specific configuration properties values
      Client.IdfCommand.convertPropValues(customCommand);
      //
      // Convert base configuration properties values
      Client.Widget.convertPropValues(customCommand);
      //
      config.customCommands.push(customCommand);
    }
    else if (child.nodeName === "par") { // Add "par" node attributes as configuration properties
      // Some parameters have the same code as wep properties, in that case add an "1" to them..
      attrList = child.attributes;
      let skipPar = ["ent"];
      for (let j = 0; j < attrList.length; j++) {
        attrNode = attrList[j];
        config[(skipPar.indexOf(attrNode.nodeName) >= 0 ? attrNode.nodeName + "1" : attrNode.nodeName)] = attrNode.nodeValue;
        //
        // On IDF "theme" is a string, while on IDC it's an object having "idfTheme" property as theme name. So use this form on IDF too
        if (attrNode.nodeName === "thm" && config.thm)
          config.thm = {idfTheme: config.thm, idfMobile: ["ionic", "quadro"].includes(config.thm).toString()};
      }
    }
  }
  //
  return config;
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfWebEntryPoint.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfWebEntryPoint.transPropMap.clo:
      case Client.IdfWebEntryPoint.transPropMap.cla:
      case Client.IdfWebEntryPoint.transPropMap.met:
      case Client.IdfWebEntryPoint.transPropMap.dbi:
      case Client.IdfWebEntryPoint.transPropMap.vfl:
      case Client.IdfWebEntryPoint.transPropMap.smw:
      case Client.IdfWebEntryPoint.transPropMap.rfi:
      case Client.IdfWebEntryPoint.transPropMap.rlo:
      case Client.IdfWebEntryPoint.transPropMap.plm:
      case Client.IdfWebEntryPoint.transPropMap.gtp:
      case Client.IdfWebEntryPoint.transPropMap.frs:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfWebEntryPoint.transPropMap.shd:
      case Client.IdfWebEntryPoint.transPropMap.rai:
      case Client.IdfWebEntryPoint.transPropMap.sfi:
      case Client.IdfWebEntryPoint.transPropMap.ena:
      case Client.IdfWebEntryPoint.transPropMap.wid:
      case Client.IdfWebEntryPoint.transPropMap.shl:
      case Client.IdfWebEntryPoint.transPropMap.dec:
      case Client.IdfWebEntryPoint.transPropMap.pls:
      case Client.IdfWebEntryPoint.transPropMap.snd:
      case Client.IdfWebEntryPoint.transPropMap.ent1:
      case Client.IdfWebEntryPoint.transPropMap.ena:
        props[p] = props[p] === "1";
        break;

      case Client.IdfWebEntryPoint.transPropMap.sli:
        props[p] = props[p] !== "NO";
        break;

      case Client.IdfWebEntryPoint.transPropMap.mth:
        let x = props[p].split("|");
        props[p] = {acceleration: parseFloat(x[0]), rotation: parseFloat(x[1])};
        break;

      default:
        // If property is a command zone, push its value into commands zones array
        if (p.substr(0, 2) === "cz")
          props[p] = parseInt(props[p]);
        break;
    }
  }
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfWebEntryPoint.prototype.getRootObject = function (el)
{
  return el ? this.mainObjects[1] : this.mainObjects[1].domObj;
};


/**
 * Create elements configuration
 */
Client.IdfWebEntryPoint.prototype.createElementsConfig = function ()
{
  // Create header
  this.headerConf = this.createElementConfig({c: "IonHeader", className: "main-header"});
  //
  // Create navbar
  this.navbarConf = this.createElementConfig({c: "IonNavBar", menuButton: true, events: ["onMenuButton"]});
  this.headerConf.children.push(this.navbarConf);
  //
  // Create navbar container
  this.navbarContainerConf = this.createElementConfig({c: "Container", className: "navbar-container"});
  this.navbarConf.children.push(this.navbarContainerConf);
  //
  // Create main title
  this.titleConf = this.createElementConfig({c: "IonTitle", customid: "header-main-caption"});
  this.navbarContainerConf.children.push(this.titleConf);
  //
  // Create inputs container
  let inputsContainerConf = this.createElementConfig({c: "Container", className: "main-header-cmd"});
  this.navbarContainerConf.children.push(inputsContainerConf);
  //
  // Create cmdInput
  this.cmdInputConf = this.createElementConfig({c: "IonInput", className: "main-header-cmd-input", labelPosition: "hidden", placeholder: Client.IdfResources.t("COMMAND_PLACEHOLDER"), events: ["onChange"]});
  inputsContainerConf.children.push(this.cmdInputConf);
  //
  // Create buttons container
  let buttonsContainerConf = this.createElementConfig({c: "Container", className: "main-header-buttons"});
  this.navbarContainerConf.children.push(buttonsContainerConf);
  //
  // Create help app button
  this.helpAppButtonConf = this.createElementConfig({c: "IonButton", icon: "help", iconPosition: "only", className: "generic-btn help-app-btn", visible: false, events: ["onClick"], customid: "header-help-button"});
  buttonsContainerConf.children.push(this.helpAppButtonConf);
  //
  // Create debug app button
  this.debugAppButtonConf = this.createElementConfig({c: "IonButton", icon: "bug", iconPosition: "only", className: "generic-btn debug-app-btn", visible: false, events: ["onClick"], customid: "header-debug-image"});
  buttonsContainerConf.children.push(this.debugAppButtonConf);
  //
  // Create close app button
  this.closeAppButtonConf = this.createElementConfig({c: "IonButton", icon: "close", iconPosition: "only", className: "generic-btn close-app-btn", events: ["onClick"], customid: "header-close-app"});
  buttonsContainerConf.children.push(this.closeAppButtonConf);
  //
  // Create split pane
  if (this.hasSideMenu()) {
    this.mainContainerConf = this.createElementConfig({c: "IonSplitPane", className: "main-split-pane", when: (Client.mainFrame.idfMobile || this.defaultResponsiveClass !== "") ? "lg" : "xs"});
    if (this.menuType === Client.IdfWebEntryPoint.menuTypes.RIGHT)
      this.mainContainerConf.className = "main-split-pane menu-right";
  }
  else {
    // Taskbar or activity bar : we need a vertical layout
    this.mainContainerConf = this.createElementConfig({c: "Container", className: "main-vertical-pane container-main-vertical"});
    this.navbarConf.menuButton = false;
    //
    if (this.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR)
      this.navbarContainerConf.className += " vertical-menu";
  }
  //
  // Create page
  this.pageConf = this.createElementConfig({c: "IonPage"});
  this.pageHeaderConf = this.createElementConfig({c: "IonHeader", className: "main-view-box-header"});
  let pageFooterConf = this.createElementConfig({c: "IonFooter"});
  this.pageContentConf = this.createElementConfig({c: "IonContent", className: "main-view-grid"});
  this.pageConf.children.push(this.pageHeaderConf);
  this.pageConf.children.push(pageFooterConf);
  this.pageConf.children.push(this.pageContentConf);
  this.mainContainerConf.children.push(this.pageConf);
  //
  // Create the grid for the docked views
  this.topGridConf = this.createElementConfig({c: "Container", className: "grid-top"});
  this.leftGridConf = this.createElementConfig({c: "Container", className: "grid-left"});
  this.centerGridConf = this.createElementConfig({c: "Container", className: "grid-center"});
  this.rightGridConf = this.createElementConfig({c: "Container", className: "grid-right"});
  this.bottomGridConf = this.createElementConfig({c: "Container", className: "grid-bottom"});
  this.pageContentConf.children.push(this.topGridConf);
  this.pageContentConf.children.push(this.leftGridConf);
  this.pageContentConf.children.push(this.centerGridConf);
  this.pageContentConf.children.push(this.rightGridConf);
  this.pageContentConf.children.push(this.bottomGridConf);
  //
  // Create views container (in the center cell of the grid)
  this.viewsContainerConf = this.createElementConfig({c: "IonNavController", className: "center-view-container"});
  this.centerGridConf.children.push(this.viewsContainerConf);
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfWebEntryPoint.prototype.realize = function (widget, parent, view)
{
  // Hide the main wait-box if present (only for IDF)
  let wb = document.getElementById("wait-box");
  if (wb) {
    wb.style.display = "none";
    //
    // Block loading animation timer if present
    clearTimeout(window.WaitTimer);
    window.WaitTimer = null;
  }
  //
  // Create elements configuration
  this.createElementsConfig();
  this.customizeHeader();
  //
  // Create IonHeader
  this.mainObjects.push(view.createElement(this.headerConf, parent, view));
  //
  // Create IonSplitPane
  let mainContainer = view.createElement(this.mainContainerConf, parent, view);
  this.mainObjects.push(mainContainer);
  //
  // Remove the views opened at start, we must create them later, when the structure is already set
  let views = [];
  for (let ch = 0; ch < widget.children.length; ch++) {
    let c = widget.children[ch];
    if (c.c === "IdfView") {
      views.push(c);
      widget.children.splice(ch, 1);
      ch--;
    }
  }
  //
  // Create its children
  this.createChildren(widget);
  //
  // Add proper css classes to split pane components
  if (this.hasSideMenu()) {
    mainContainer.domObj.childNodes[0]?.classList.add("split-pane-side");
    mainContainer.domObj.childNodes[1]?.classList.remove("split-pane-side");
    mainContainer.domObj.childNodes[1]?.classList.add("split-pane-main");
  }
  //
  for (let ch = 0; ch < views.length; ch++) {
    this.insertBefore({
      child: {
        elements: [views[ch]],
        type: "view",
        id: (Client.mainFrame.isIDF ? "view-" : "") + views[ch].id
      }
    });
  }
  //
  // On IDF we must handle the device events ourselves
  if (Client.mainFrame.isIDF)
    Client.mainFrame.device.parentWidget = this;
  //
  if (Client.mainFrame.idfMobile) {
    let el = Client.eleMap[this.mainContainerConf.id];
    el?.checkWidth();
    if (el.exposed)
      this.commandList?.toggleMenu();
  }
  //
  this.getRootObject(true).focus();
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfWebEntryPoint.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (props.visualFlags !== undefined) {
    this.visualFlags = props.visualFlags;
    //
    props.showToolbar = (this.visualFlags & 0x400) !== 0;
    props.showStatusbar = (this.visualFlags & 0x800) !== 0;
    props.showCaption = (this.visualFlags & 0x1) !== 0;
    props.showMenuButton = (this.visualFlags & 0x2) !== 0;
    props.showIcon = (this.visualFlags & 0x4) !== 0;
    props.showTitle = (this.visualFlags & 0x8) !== 0;
    props.showDebugButton = (this.visualFlags & 0x80) !== 0;
    props.showHelpButton = (this.visualFlags & 0x40) !== 0;
    props.showCommandBox = (this.visualFlags & 0x10) !== 0;
    props.showCloseButton = (this.visualFlags & 0x20) !== 0;
    props.iconActive = (this.visualFlags & 0x100) !== 0;
  }
  //
  let updateThemeColors = false;
  let updateCaptionVisibility = false;
  let updateHelpButtonVisibility = false;
  let updateDebugButtonVisibility = false;
  let updateLogoffButtonVisibility = false;
  for (let p in props) {
    let v = props[p];
    //
    // Check if some server message is changed
    if (p.indexOf("SRV_MSG") !== -1)
      this[p] = v;
    //
    if (p.endsWith("Color")) {
      updateThemeColors = true;
      Client.mainFrame.theme[p.replace("Color", "")] = v;
    }
    //
    switch (p) {
      case "caption":
        this.setMainCaption(v);
        break;

      case  "mainImage":
        this.setMainImage(v);
        break;

      case "activeViewId":
        this.activeViewChangedServerSide = true;
        this.activeView = v;
        delete this.activeViewChangedServerSide;
        break;

      case "closeAllEventDef":
        this.closeAllEventDef = v;
        break;

      case "closeAppEventDef":
        this.closeAppEventDef = v;
        break;

      case "globalToolbarPosition":
        this.globalToolbarPosition = v;
        Client.Widget.updateElementClassName(Client.eleMap[this.titleConf.id], "expand", this.isGlbToolbarHeader());
        break;

      case "language":
        this.setLanguage(v);
        break;

      case "widgetMode":
        updateCaptionVisibility = true;
        this.setWidgetMode(v);
        break;

      case "helpURL":
        updateHelpButtonVisibility = true;
        this.helpURL = v;
        break;

      case "debugType":
        updateDebugButtonVisibility = true;
        this.setDebugType(v);
        break;

      case "commandPrompt":
        this.setCommandPrompt(v);
        break;

      case "showLogoff":
        updateLogoffButtonVisibility = true;
        this.showLogoff = v;
        break;

      case "showToolbar":
        this.showToolbar = v;
        break;

      case "showStatusbar":
        this.setShowStatusbar(v);
        break;

      case "showCaption":
        updateCaptionVisibility = true;
        this.showCaption = v;
        break;

      case "showMenuButton":
        this.setShowMenuButton(v);
        break;

      case "showIcon":
        this.showIcon = v;
        break;

      case "showTitle":
        this.setShowTitle(v);
        break;

      case "showDebugButton":
        updateDebugButtonVisibility = true;
        this.showDebugButton = v;
        break;

      case "showHelpButton":
        updateHelpButtonVisibility = true;
        this.showHelpButton = v;
        break;

      case "showCommandBox":
        this.setShowCommandBox(v);
        break;

      case "showCloseButton":
        updateLogoffButtonVisibility = true;
        this.showCloseButton = v;
        break;

      case "iconActive":
        this.iconActive = v;
        break;

      case "decimalDot":
        this.decimalDot = v;
        //
        if (this.decimalDot) {
          glbDecSep = ".";
          glbThoSep = ",";
        }
        else {
          glbDecSep = ",";
          glbThoSep = ".";
        }
        break;

      case "sideMenuWidth":
        this.setSideMenuWidth(v);
        break;

      case "comboNameSeparator":
        this.comboNameSeparator = v;
        break;

      case "welcomeURL":
        this.setWelcomeURL(v);
        break;

      case "refreshInterval":
        this.setRefreshInterval(v);
        break;

      case "refreshLocation":
        this.refreshLocation = v;
        Client.mainFrame.device.shell.postMessage({obj: "device-geolocation", id: (this.refreshLocation > 0 ? "watchPosition" : "clearWatch")});
        break;

      case "progressFile":
        this.progressFile = v;
        break;

      case "entryPoint":
        this.entryPoint = v;
        break;

      case "soundEnabled":
        this.setSoundEnabled(v);
        break;

      case "appDarkTheme":
        this.setDarkTheme(props);
        if (this.appDarkTheme === "YES")
          updateThemeColors = true;
        break;

      case "resizableFrames":
        this.resizableFrames = v;
        break;

      case "animationsEnabled":
        this.animationsEnabled = v;
        break;

      case "motionThreshold":
        this.setMotionThreshold(v);
        break;
    }
  }
  //
  if (updateThemeColors)
    this.updateThemeColors();
  //
  if (updateCaptionVisibility)
    this.updateCaptionVisibility();
  //
  if (updateHelpButtonVisibility)
    this.updateHelpButtonVisibility();
  //
  if (updateDebugButtonVisibility)
    this.updateDebugButtonVisibility();
  //
  if (updateLogoffButtonVisibility)
    this.updateLogoffButtonVisibility();
};


Client.IdfWebEntryPoint.prototype.setMainCaption = function (value)
{
  let innerHTML = Client.Widget.getHTMLForCaption(this.caption);
  Client.eleMap[this.titleConf.id].updateElement({innerHTML});
  //
  if (this.menuType === Client.IdfWebEntryPoint.menuTypes.GROUPED)
    Client.eleMap[this.commandList?.menuTitleConf.id]?.updateElement({innerHTML});
  //
  Client.eleMap[this.welcomeTitleConf?.id]?.updateElement({innerHTML});
  //
  document.title = Client.eleMap[this.titleConf.id].getRootObject().textContent;
};


Client.IdfWebEntryPoint.prototype.setMainImage = function (value)
{
  this.mainImage = value;
  //
  if (!this.mainImgConf) {
    this.mainImgConf = this.createElementConfig({c: (Client.Widget.isIconImage(this.mainImage) ? "IonIcon" : "Container"), className: "header-main-img"});
    Client.eleMap[this.navbarContainerConf.id].insertBefore({child: this.mainImgConf});
  }
  //
  let el = Client.eleMap[this.mainImgConf.id];
  el.updateElement({visible: !!this.mainImage});
  if (this.mainImage)
    Client.Widget.setIconImage({image: this.mainImage, el, innerObj: el.getRootObject()});
};


Client.IdfWebEntryPoint.prototype.setLanguage = function (value)
{
  this.language = value;
  //
  // Add a protection for an undefined language (jump to ENG if not present)
  if (!Client.IdfResources.languagesMap[this.language])
    this.language = "ENG";
};


Client.IdfWebEntryPoint.prototype.setWidgetMode = function (value)
{
  this.widgetMode = value;
  Client.Widget.updateElementClassName(Client.eleMap[this.mainContainerConf.id], "widget-mode", !this.widgetMode);
};


Client.IdfWebEntryPoint.prototype.setDebugType = function (value)
{
  this.debugType = value;
  //
  let el = Client.eleMap[this.debugAppButtonConf.id];
  el.updateElement({icon: (this.debugType === Client.IdfWebEntryPoint.debugTypes.HELP ? "help-buoy" : "bug")});
  //
  // If I am in preview I show the debug button
  if (this.debugType === Client.IdfWebEntryPoint.debugTypes.DEBUG && top !== window) {
    let deb = top.document.getElementById("debug");
    if (deb)
      deb.style.display = "";
  }
};


Client.IdfWebEntryPoint.prototype.setCommandPrompt = function (value)
{
  this.commandPrompt = value;
  Client.eleMap[this.cmdInputConf.id].updateElement({value: this.commandPrompt});
};


Client.IdfWebEntryPoint.prototype.setShowStatusbar = function (value)
{
  this.showStatusbar = value;
  this.statusbar?.updateElement({visible: this.showStatusbar});
};


Client.IdfWebEntryPoint.prototype.setShowMenuButton = function (value)
{
  this.showMenuButton = value;
  if (this.hasSideMenu())
    Client.eleMap[this.navbarConf.id].updateElement({menuButton: this.showMenuButton});
};


Client.IdfWebEntryPoint.prototype.setShowTitle = function (value)
{
  this.showTitle = value;
  Client.eleMap[this.titleConf.id].updateElement({visible: this.showTitle});
};


Client.IdfWebEntryPoint.prototype.setShowCommandBox = function (value)
{
  this.showCommandBox = value;
  Client.eleMap[this.cmdInputConf.id].updateElement({visible: this.showCommandBox});
};


Client.IdfWebEntryPoint.prototype.setSideMenuWidth = function (value)
{
  this.sideMenuWidth = value;
  //
  if (this.hasSideMenu() && this.sideMenuWidth) {
    let rootObject = this.getRootObject(true);
    if (rootObject.domObj.childNodes.length > 1) {
      setTimeout(() => {
        let el = Client.eleMap[this.mainContainerConf.id];
        el?.updateElement({sidePaneMaxWidth: this.sideMenuWidth});
        rootObject.domObj.childNodes[0].style.setProperty("max-width", this.sideMenuWidth + "px");
        rootObject.domObj.childNodes[0].style.setProperty("min-width", this.sideMenuWidth + "px");
      }, 10);
    }
  }
};


Client.IdfWebEntryPoint.prototype.setWelcomeURL = function (value)
{
  this.welcomeURL = value;
  //
  if (!this.welcomePageFrameConf && this.welcomeURL) {
    this.welcomePageFrameConf = this.createElementConfig({c: "IonPage", className: "welcome-main-container"});
    //
    let welcomeHeaderConf = this.createElementConfig({c: "IonHeader", className: "welcome-header", visible: Client.mainFrame.idfMobile});
    this.welcomePageFrameConf.children.push(welcomeHeaderConf);
    //
    this.welcomeNavbarConf = this.createElementConfig({c: "IonNavBar", className: "welcome-navbar", menuButton: true});
    welcomeHeaderConf.children.push(this.welcomeNavbarConf);
    //
    this.welcomeTitleConf = this.createElementConfig({c: "IonTitle", className: "welcome-title", innerText: this.caption});
    this.welcomeNavbarConf.children.push(this.welcomeTitleConf);
    //
    let welcomeContentConf = this.createElementConfig({c: "IonContent", className: "welcome-content"});
    this.welcomePageFrameConf.children.push(welcomeContentConf);
    //
    this.welcomePageFrameIntConf = this.createElementConfig({c: "Iframe", className: "welcome-container", src: this.welcomeURL});
    welcomeContentConf.children.push(this.welcomePageFrameIntConf);
    //
    let welif = this.view.createElement(this.welcomePageFrameConf, this.parent, this.view);
    //
    let welframe = Client.eleMap[this.welcomePageFrameIntConf.id].getRootObject();
    welframe.onload = () => {
      let contentDocument = welframe.contentWindow.document;
      //
      // I need to handle the DD operartions also when moving over the iframe
      contentDocument.addEventListener("touchmove", ev => Client.Widget.ddMouseMove(ev, welframe.getBoundingClientRect()), false);
      contentDocument.addEventListener("mousemove", ev => Client.Widget.ddMouseMove(ev, welframe.getBoundingClientRect()), false);
      /*
       // No needed
       contentDocument.addEventListener("touchdown", ev => Client.Widget.ddMouseDown(ev, welframe.getBoundingClientRect()), false);
       contentDocument.addEventListener("mousedown", ev => Client.Widget.ddMouseDown(ev, welframe.getBoundingClientRect()), false);
       */
      contentDocument.addEventListener("touchup", ev => Client.Widget.ddMouseUp(ev, welframe.getBoundingClientRect()), false);
      contentDocument.addEventListener("mouseup", ev => Client.Widget.ddMouseUp(ev, welframe.getBoundingClientRect()), false);
      contentDocument.addEventListener("touchcancel", Client.Widget.ddClearOperation, false);
    };
    //
    Client.eleMap[this.centerGridConf.id].insertBefore({child: welif});
  }
  else if (this.welcomePageFrameConf)
    Client.eleMap[this.welcomePageFrameIntConf.id].updateElement({src: this.welcomeURL});
  //
  this.checkWelcomePage();
};


Client.IdfWebEntryPoint.prototype.setRefreshInterval = function (value)
{
  this.refreshInterval = value;
  //
  if (!Client.mainFrame.isIDF)
    return;
  //
  if (this.refreshTimerId) {
    clearInterval(this.refreshTimerId);
    delete this.refreshTimerId;
  }
  //
  if (this.refreshInterval > 0) {
    // Imposto l'intervallo
    this.refreshTimerId = setInterval(() => {
      Client.mainFrame.sendEvents([{id: "rfi", def: Client.IdfMessagesPump.eventTypes.ACTIVE, content: {oid: "wep"}}]);
    }, this.refreshInterval);
  }
};


Client.IdfWebEntryPoint.prototype.setDarkTheme = function (props)
{
  if (this.theme.idfTheme !== "ionic")
    return;
  //
  this.appDarkTheme = props.appDarkTheme;
  //
  if (this.appDarkTheme === "YES") {
    // If the user has activated the dark color AND set his customized colors we must use them
    // else if he uses the default colors we must desaturate them (simply not set the dark color, the ionic system
    // will auto-desaturate the defaults colors)
    if (props.primaryColor && props.primaryColor !== "rgb(56, 126, 245)")
      Client.mainFrame.theme.darkPrimary = props.primaryColor;
    if (props.secondaryColor && props.secondaryColor !== "rgb(50, 219, 100)")
      Client.mainFrame.theme.darkSecondary = props.secondaryColor;
    if (props.dangerColor && props.dangerColor !== "rgb(245, 61, 61)")
      Client.mainFrame.theme.darkDanger = props.dangerColor;
    if (props.darkColor && props.darkColor !== "rgb(34, 34, 34)")
      Client.mainFrame.theme.darkDark = props.darkColor;
    if (props.lightColor && props.lightColor !== "rgb(244, 244, 244)")
      Client.mainFrame.theme.darkLight = props.lightColor;
    if (props.brightColor && props.brightColor !== "rgb(255, 193, 37)")
      Client.mainFrame.theme.darkBright = props.brightColor;
    if (props.vibrantColor && props.vibrantColor !== "rgb(102, 51, 153)")
      Client.mainFrame.theme.darkVibrant = props.vibrantColor;
  }
  else if (this.appDarkTheme === "AUTO") {
    this.appDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "YES" : "NO";
    //
    // If the user has supplied his colors they are related to the light theme, so we need to desaturate them AND give them to the theme system,
    // otherwise the theme system USES the default color
    if (this.appDarkTheme === "YES") {
      let perc = (Client.mainFrame.theme.darkPercent !== undefined) ? parseFloat(Client.mainFrame.theme.darkPercent) : 0.30;
      if (props.primaryColor)
        Client.mainFrame.theme.darkPrimary = Client.IonHelper.shadeRGBColor(props.primaryColor, perc);
      if (props.secondaryColor)
        Client.mainFrame.theme.darkSecondary = Client.IonHelper.shadeRGBColor(props.secondaryColor, perc);
      if (props.dangerColor)
        Client.mainFrame.theme.darkDanger = Client.IonHelper.shadeRGBColor(props.dangerColor, perc);
      if (props.darkColor)
        Client.mainFrame.theme.darkDark = Client.IonHelper.shadeRGBColor(props.darkColor, perc);
      if (props.lightColor)
        Client.mainFrame.theme.darkLight = Client.IonHelper.shadeRGBColor(props.lightColor, perc);
      if (props.brightColor)
        Client.mainFrame.theme.darkBright = Client.IonHelper.shadeRGBColor(props.brightColor, perc);
      if (props.vibrantColor)
        Client.mainFrame.theme.darkVibrant = Client.IonHelper.shadeRGBColor(props.vibrantColor, perc);
    }
  }
  //
  Client.mainFrame.theme.darkMode = this.appDarkTheme === "YES";
};


Client.IdfWebEntryPoint.prototype.setMotionThreshold = function (value)
{
  this.motionThreshold = value;
  //
  if (this.motionThreshold.acceleration !== 999 || this.motionThreshold.rotation !== 999) {
    addEventListener("devicemotion", Client.IdfWebEntryPoint.onDeviceMotion);
    addEventListener("deviceorientation", Client.IdfWebEntryPoint.onDeviceOrientation);
  }
  else {
    removeEventListener("devicemotion", Client.IdfWebEntryPoint.onDeviceMotion);
    removeEventListener("deviceorientation", Client.IdfWebEntryPoint.onDeviceOrientationChange);
    delete Client.IdfWebEntryPoint.lastOrientationEvent;
  }
};

Client.IdfWebEntryPoint.onDeviceOrientationChange = function (ev)
{
  Client.IdfWebEntryPoint.lastOrientationEvent = ev;
};


Client.IdfWebEntryPoint.onDeviceMotion = function (ev)
{
  let t = Client.eleMap["wep"].motionThreshold;
  let ot = Math.abs(ev.acceleration.x) >= t.acceleration;
  ot = ot || Math.abs(ev.acceleration.y) >= t.acceleration;
  ot = ot || Math.abs(ev.acceleration.z) >= t.acceleration;
  ot = ot || Math.abs(ev.rotationRate.alpha) >= t.rotation;
  ot = ot || Math.abs(ev.rotationRate.beta) >= t.rotation;
  ot = ot || Math.abs(ev.rotationRate.gamma) >= t.rotation;
  if (!ot)
    return;
  //
  let or = Client.IdfWebEntryPoint.lastOrientationEvent;
  let data = [
    ev.acceleration.x,
    ev.acceleration.y,
    ev.acceleration.z,
    ev.accelerationIncludingGravity.x,
    ev.accelerationIncludingGravity.y,
    ev.accelerationIncludingGravity.z,
    ev.rotationRate.alpha,
    ev.rotationRate.beta,
    ev.rotationRate.gamma,
    or?.alpha,
    or?.beta,
    or?.gamma,
    or?.webkitCompassHeading,
    or?.webkitCompassAccuracy,
    (new Date()).getTime()
  ];
  //
  Client.mainFrame.sendEvents([{
      id: "chgmot",
      def: Client.IdfMessagesPump.eventTypes.ACTIVE,
      content: {
        oid: "wep",
        obn: "mot",
        par1: data.join("|")
      }
    }]);
}
;


Client.IdfWebEntryPoint.prototype.updateCaptionVisibility = function ()
{
  let showCaption = this.showCaption && !this.widgetMode;
  Client.eleMap[this.headerConf.id].updateElement({visible: showCaption});
  //
  // If caption is visible remove no-header class from split pane. Otherwise add it
  Client.Widget.updateElementClassName(Client.eleMap[this.mainContainerConf.id], "no-header", showCaption);
  //
  this.onResize();
};


Client.IdfWebEntryPoint.prototype.updateHelpButtonVisibility = function ()
{
  Client.eleMap[this.helpAppButtonConf.id].updateElement({visible: this.helpURL && this.showHelpButton});
};


Client.IdfWebEntryPoint.prototype.updateDebugButtonVisibility = function ()
{
  let el = Client.eleMap[this.debugAppButtonConf.id];
  el.updateElement({visible: (this.debugType !== Client.IdfWebEntryPoint.debugTypes.NONE && this.showDebugButton)});
};


Client.IdfWebEntryPoint.prototype.updateLogoffButtonVisibility = function ()
{
  let el = Client.eleMap[this.closeAppButtonConf.id];
  el.updateElement({visible: (this.showLogoff && this.showCloseButton)});
};


/**
 * Realize status bar
 */
Client.IdfWebEntryPoint.prototype.realizeStatusbar = function ()
{
  let statusBarConf = this.createElementConfig({c: "Container", className: "status-bar-container"});
  //
  if (this.menuType === Client.IdfWebEntryPoint.menuTypes.TASKBAR) {
    statusBarConf.className += " bottom";
    this.statusbar = this.commandList.realizeStatusbar(statusBarConf);
  }
  else
    this.statusbar = Client.eleMap[this.pageHeaderConf.id].insertBefore({child: statusBarConf, sib: this.globalToolbar?.id});
};


/**
 * Realize global command set
 * @param {Object} cmsConf
 */
Client.IdfWebEntryPoint.prototype.realizeCommandSet = function (cmsConf)
{
  // If I don't have a global toolbar, create it
  if (!this.globalToolbar) {
    let globalToolbarConf = this.createElementConfig({c: "Container", className: "main-global-toolbar"});
    //
    if (this.menuType === Client.IdfWebEntryPoint.menuTypes.TASKBAR) {
      globalToolbarConf.className += " bottom";
      this.globalToolbar = this.commandList.realizeTaskBarToolbar(globalToolbarConf);
    }
    else {
      let containerConf = this.pageHeaderConf;
      if (this.isGlbToolbarHeader())
        containerConf = this.navbarContainerConf;
      //
      this.globalToolbar = Client.eleMap[containerConf.id].insertBefore({child: globalToolbarConf});
    }
  }
  //
  this.globalToolbar.insertBefore({child: cmsConf});
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfWebEntryPoint.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "chgProp":
      if (event.obj === this.cmdInputConf.id && event.content.name === "value")
        events.push(...this.handleCommandInputChange(event));
      break;

    case "onMenuButton":
      // If user clicks on my navbar menu button, route event to commandList
      if (event.obj === this.navbarConf.id && this.commandList)
        events.push(...this.commandList.onEvent(event));
      break;

    case "onClick":
      // If user clicks on close app button
      if (event.obj === this.closeAppButtonConf.id)
        events.push(...this.handleCloseAppButtonClick(event));
      //
      // If user clicks on help app button
      if (event.obj === this.helpAppButtonConf.id)
        this.handleHelpButtonClick(event);
      //
      // Click on the debug button (only on IDF)
      if (event.obj === this.debugAppButtonConf.id)
        events.push(...this.handleDebugButtonClick(event));
      break;

    case "onPosition":
      events.push(...this.handlePositionChange(event));
      break;

    case "onKey":
      events.push(...this.handleFunctionKeys(event));
      events.push(...this.handleAcceleratorKeys(event));
      break;
  }
  //
  // Custom event handler
  if (Client.mainFrame.isIDF)
    events.push(...this.handleCustomEvent(event));
  //
  return events;
};


Client.IdfWebEntryPoint.prototype.handleCommandInputChange = function (event)
{
  let events = [];
  let cmd = event.content.value.toUpperCase();
  switch (cmd) {
    case "ANI-":
    case "ANIOFF":
      this.animationsEnabled = false;
      break;

    case "ANI+":
    case "ANION":
      this.animationsEnabled = true;
      break;

    case "SOUND-":
    case "SND-":
    case "SNDOFF":
      this.setSoundEnabled(false);
      break;

    case "SOUND+":
    case "SND+":
    case "SNDON":
      this.setSoundEnabled(true);
      break;
  }
  //
  // Send command to the server
  Client.IdfWebEntryPoint.sendCommand(cmd);
  //
  // Clear the cmdInput
  Client.eleMap[this.cmdInputConf.id].updateElement({value: ""});
  return events;
};


Client.IdfWebEntryPoint.prototype.handleCloseAppButtonClick = function (event)
{
  let events = [];
  if (Client.mainFrame.isIDF) {
    // Give event the IDF format
    events.push({
      id: "clk",
      def: this.closeAppEventDef,
      content: {
        oid: "cloapp",
        xck: event?.content.offsetX,
        yck: event?.content.offsetY
      }
    });
  }
  else {
    // TODO
    //event = {id: "terminate", obj: ""};
  }
  //
  return events;
};


Client.IdfWebEntryPoint.prototype.handleHelpButtonClick = function (event)
{
  open(this.helpURL, "help");
};


Client.IdfWebEntryPoint.prototype.handleDebugButtonClick = function (event)
{
  let events = [];
  if (!Client.mainFrame.isIDF)
    return events;
  //
  switch (this.debugType) {
    case Client.IdfWebEntryPoint.debugTypes.HELP:
      events.push({
        id: "cmd",
        def: this.closeAppEventDef,
        content: {
          oid: "wep",
          obn: "DTTHELP"
        }
      });
      break;

    case Client.IdfWebEntryPoint.debugTypes.DEBUG:
      if (Client.idfOffline) {
        events.push({
          id: "IWDTT",
          def: Client.IdfMessagesPump.eventTypes.ACTIVE,
          content: {}
        });
      }
      else
        open(location.href + "?WCI=IWDTT&WCE=", "debug");
      break;
  }
  //
  return events;
};


Client.IdfWebEntryPoint.prototype.handlePositionChange = function (event)
{
  let events = [];
  //
  // Send the event only if the refresh location time is passed, otherwise ignore it
  if (!this.lastWatchTime || ((new Date() - this.lastWatchTime) >= this.refreshLocation)) {
    let pos = "";
    pos += event.content.latitude + "|";
    pos += event.content.longitude + "|";
    pos += event.content.accuracy + "|";
    pos += event.content.altitude + "|";
    pos += event.content.altitudeAccuracy + "|";
    pos += event.content.heading + "|";
    pos += event.content.speed + "|";
    //
    events.push({
      id: "chgloc",
      def: Client.IdfMessagesPump.eventTypes.ACTIVE,
      content: {
        oid: "wep",
        obn: "loc",
        par1: pos
      }
    });
  }
  //
  this.lastWatchTime = new Date();
  return events;
};


/**
 * Handle function keys
 * @param {Object} event
 */
Client.IdfWebEntryPoint.prototype.handleFunctionKeys = function (event)
{
  // I check the general commands
  return this.commandList?.handleFunctionKeys(event, -1, -1) || [];
};


/**
 * Handle accelerator keys
 * @param {Object} event
 */
Client.IdfWebEntryPoint.prototype.handleAcceleratorKeys = function (event)
{
  return this.commandList?.handleAcceleratorKeys(event) || [];
};


/**
 * Insert a child element before another element
 * @param {Object} content - contains the element to insert and the id of the existing element. The new element is inserted before this element
 */
Client.IdfWebEntryPoint.prototype.insertBefore = function (content)
{
  // let's see if we can handle requirements
  if (!Client.mainFrame.loadClientRequirements(content.child))
    return;
  //
  if (content?.child.type !== "view")
    return;
  //
  let view;
  let idfView = content.child.elements[0];
  if (idfView.modal) {
    // MODAL OR POPUP VIEW
    let autoclose = (idfView.modal === Client.IdfView.modalMode.MODAL && Client.mainFrame.idfMobile && idfView.closeOnSelection) || idfView.relatedTo;
    content.child.options = {mode: "popup", modal: true, extcls: (idfView.modal === Client.IdfView.modalMode.POPUP ? "popup-modal-view" : "modal-modal-view"), autoclose: autoclose};
    view = new Client.View(content.child);
    this.secondaryViews.push(view);
  }
  else if (idfView.docked) {
    // DOCKED VIEW
    let dockList = ["", "", this.leftGridConf.id, this.rightGridConf.id, this.topGridConf.id, this.bottomGridConf.id];
    let viewsContainer = Client.eleMap[dockList[idfView.dockType]];
    view = viewsContainer.insertBefore(content);
    //
    this.secondaryViews.push(view);
  }
  else {
    // MAIN VIEW
    let viewsContainer = Client.eleMap[this.viewsContainerConf.id];
    view = viewsContainer.insertBefore(content);
    //
    this.navStack.push(view);
    //
    this.checkWelcomePage();
  }
  //
  this.elements.push(view);
  //
  // When a form is opened, the server does not change the activeView
  if (!idfView.docked)
    this.updateElement({activeViewId: idfView.id});
  //
  this.calcDockGridLayout();
};


/**
 * Remove a child from the widget
 * @param {Object} content - info of child to remove
 */
Client.IdfWebEntryPoint.prototype.removeChild = function (content)
{
  Client.Element.prototype.removeChild.call(this, content);
  //
  // Remove view from views container
  let viewsContainer = Client.eleMap[this.viewsContainerConf.id];
  viewsContainer.removeChild(content);
  //
  let childId = content.id.replace("view-", "");
  //
  // Tell IDC to close view instance server side
  if (!Client.mainFrame.isIDF)
    Client.mainFrame.sendEvents([{obj: childId, id: "close"}]);
  else {
    let child = Client.eleMap[childId];
    if (child)
      child.close(true);
  }
  //
  // Remove view from nav stack
  let idfView;
  let inStack = false;
  for (let i = 0; i < this.navStack.length; i++) {
    idfView = this.navStack[i].elements[0];
    if (idfView.id === childId) {
      inStack = true;
      this.navStack.splice(i, 1);
      break;
    }
  }
  //
  // Maybe is a secondary form, check and remove the pointer
  if (!inStack) {
    for (let i = 0; i < this.secondaryViews.length; i++) {
      let view = this.secondaryViews[i];
      idfView = view.elements[0];
      if (idfView.id === childId) {
        view.close(true);
        this.secondaryViews.splice(i, 1);
        break;
      }
    }
  }
  //
  this.checkWelcomePage();
  //
  // Remove view open item
  this.commandList?.removeViewOpenItem(idfView);
  //
  // Activate last view item (if any)
  let lastIdfView = this.navStack[this.navStack.length - 1]?.elements[0];
  if (lastIdfView)
    this.updateElement({activeViewId: lastIdfView.id});
  //
  // If the view wasn't on stack we must not change the active main view
  if (inStack)
    viewsContainer.updateElement({selectedPage: this.getPageOfView(lastIdfView)});
  //
  this.calcDockGridLayout();
};


/**
 * Check if need to show welcome page
 */
Client.IdfWebEntryPoint.prototype.checkWelcomePage = function ()
{
  if (!this.welcomePageFrameConf)
    return;
  //
  // Show the welcome page if the navstack is empty (no views visible)
  let el = Client.eleMap[this.welcomePageFrameConf.id];
  el.updateElement({visible: this.welcomeURL && !this.navStack.find(v => v.elements[0].idfVisible)});
};


/**
 * Close all views
 */
Client.IdfWebEntryPoint.prototype.closeAllViews = function ()
{
  while (this.navStack.length)
    this.removeChild(this.navStack[this.navStack.length - 1]);
};


/**
 * Get widget requirements
 * @param {Object} w
 */
Client.IdfWebEntryPoint.getRequirements = function (w)
{
  let prefix = Client.mainFrame.isIDF ? "fluid/" : "";
  //
  let req = {};
  //
  let ionicPlatform = "md";
  //
  // Use ios as ionic platform if needed
  if ((window.top !== window.self && window.localStorage?.getItem("platform") === "ios") || Client.mainFrame.device.operatingSystem === "ios")
    ionicPlatform = "ios";
  //
  // Add bundles
  req[prefix + "objects/fluid/bundles/idf.css"] = {type: "cs", name: "idfcss"};
  //
  // Add Ionic requirements
  req[prefix + "objects/ionic/bundles/extra.css"] = {type: "cs", name: "extracss"};
  req[prefix + `objects/ionic/bundles/ionic.${ionicPlatform}.min.css`] = {type: "cs", name: "ionincss"};
  req[prefix + "objects/ionic/bundles/ionicons4.css"] = {type: "cs", name: "ionicons"};
  req[prefix + "objects/ionic/bundles/ionicons4.svg"] = {type: "sv", name: "ionicons5"};
  req[prefix + `objects/ionic/ionic-${ionicPlatform}.js`] = {type: "jc", name: "ionicplat"};
  req[prefix + "objects/ionic/ionic.min.js"] = {type: "jc", name: "ionmin"};
  //
  return req;
};


/**
 * Get zone for given command
 * @param {Integer} commandIndex
 */
Client.IdfWebEntryPoint.prototype.getCommandZone = function (commandIndex)
{
  return this.commandsZones[commandIndex];
};



/**
 * Returns true if we have a sidemenu
 */
Client.IdfWebEntryPoint.prototype.hasSideMenu = function ()
{
  return [Client.IdfWebEntryPoint.menuTypes.LEFT, Client.IdfWebEntryPoint.menuTypes.RIGHT, Client.IdfWebEntryPoint.menuTypes.GROUPED].includes(this.menuType);
};


/**
 * Returns true if the global toolbars must be in the header
 */
Client.IdfWebEntryPoint.prototype.isGlbToolbarHeader = function ()
{
  return this.globalToolbarPosition === Client.IdfWebEntryPoint.globalTlbPos.HEADER;
};


/**
 * Get the rect of the MDI area
 */
Client.IdfWebEntryPoint.prototype.getMDIRect = function ()
{
  let el = Client.eleMap[this.pageContentConf.id];
  if (el)
    return el.domObj.firstChild.getBoundingClientRect();
  //
  return {left: 0, top: 0, width: document.body.offsetWidth, height: document.body.offsetHeight};
};


/**
 * Get the rect of the MDI area
 */
Client.IdfWebEntryPoint.prototype.calcDockGridLayout = function ()
{
  let hl = {top: 0, left: 0, right: 0, bottom: 0};
  for (let i = 0; i < this.secondaryViews.length; i++) {
    let idfView = this.secondaryViews[i].elements[0];
    if (idfView.docked) {
      // If the view is resizable it has a border that the user can use to handle the resize, in that case we must
      // enlarge the area by the border size to show the view correctly
      let cstyle = window.getComputedStyle(Client.eleMap[idfView.pageConf.id].domObj);
      let topBorder = cstyle.borderTopWidth;
      let leftBorder = cstyle.borderLeftWidth;
      let rightBorder = cstyle.borderRightWidth;
      let bottomBorder = cstyle.borderBottomWidth;
      //
      switch (idfView.dockType) {
        case Client.IdfView.dockType.LEFT :
          hl.left = (idfView.width !== -1 ? idfView.width : 250) + (idfView.canResize ? parseInt("0" + rightBorder, 10) : 0);
          break;

        case Client.IdfView.dockType.RIGHT:
          hl.right = (idfView.width !== -1 ? idfView.width : 250) + (idfView.canResize ? parseInt("0" + leftBorder, 10) : 0);
          break;

        case Client.IdfView.dockType.TOP:
          hl.top = (idfView.height !== -1 ? idfView.height : 250) + (idfView.canResize ? parseInt("0" + bottomBorder, 10) : 0);
          break;

        case Client.IdfView.dockType.BOTTOM:
          hl.bottom = (idfView.height !== -1 ? idfView.height : 250) + (idfView.canResize ? parseInt("0" + topBorder, 10) : 0);
          break;
      }
    }
  }
  //
  let grid = Client.eleMap[this.pageContentConf.id];
  //
  grid.scrollContent.style.gridTemplateColumns = hl.left + "px 1fr " + hl.right + "px";
  grid.scrollContent.style.gridTemplateRows = hl.top + "px 1fr " + hl.bottom + "px";
  //
  this.onResize();
};


/**
 * Show a messagebox
 * @param {Object} options ->
 *   type
 *   text
 *   buttons
 *   voice
 * @param {function} callback
 */
Client.IdfWebEntryPoint.prototype.showMessageBox = function (options, callback)
{
  Client.Widget.showMessageBox(options, callback);
};


/**
 * Show a messagebox
 * @param {Object} errorDetail
 */
Client.IdfWebEntryPoint.prototype.showErrorBox = function (errorDetail)
{
  let htmlMessage = "";
  htmlMessage += `<div class="row-error row-red"><span><img src="images/errpg.gif"></span><span>${errorDetail.errorHeader}</span></div>`;
  htmlMessage += `<div class="row-error"><span>${this.SRV_MSG_ErrorNum}</span><span>${errorDetail.errorNumber}</span></div>`;
  if (errorDetail.errorDescription)
    htmlMessage += `<div class="row-error"><span></span><span>${errorDetail.errorDescription}</span></div>`;
  if (errorDetail.errorEffects)
    htmlMessage += `<div class="row-error"><span>${this.SRV_MSG_ErrorEffects}</span><span>${errorDetail.errorEffects}</span></div>`;
  if (errorDetail.errorActions)
    htmlMessage += `<div class="row-error"><span>${this.SRV_MSG_ErrorAction}</span><span>${errorDetail.errorActions}</span></div>`;
  if (errorDetail.errorSource)
    htmlMessage += `<div class="row-error"><span>${this.SRV_MSG_ErrorSource}</span><span>${errorDetail.errorSource}</span></div>`;
  if (errorDetail.errorMessage)
    htmlMessage += `<div class="row-error"><span>Error Details:</span><span>${errorDetail.errorMessage}</span></div>`;
  if (errorDetail.errorException)
    htmlMessage += `<div class="row-error"><span>Stack Trace:</span><span>${errorDetail.errorException}</span></div>`;
  //
  let def = {
    type: "alert",
    title: Client.IdfResources.t("MSG_POPUP_MsgErrorCaption"),
    message: htmlMessage,
    style: "error-message-popup",
    buttons: [{text: this.SRV_MSG_ErrorButton, cancel: true}]
  };
  //
  Client.IonHelper.createAlert(def, function (r, values) {});
  //
  this.soundAction(Client.IdfWebEntryPoint.soundDef.error);
};


/**
 * Show a preview frame
 * @param {String} title
 * @param {String} address
 */
Client.IdfWebEntryPoint.prototype.showPreview = function (title, address)
{
  Client.Widget.showPreview(title, address);
};



/**
 * Show a popup menu
 * @param {Object} options :
 *                 {
 *                  commandsetId - commandset to show
 *                  direction - direction
 *                  targetId - object to attach OR
 *                  x - position to show
 *                  y
 *                 }
 */
Client.IdfWebEntryPoint.prototype.showPopup = function (options)
{
  let cmset = Client.eleMap[options.commandsetId];
  //
  let hasImageBackground = false;
  let cmdList = [];
  for (let j = 0; j < cmset.elements.length; j++) {
    let cmd = cmset.elements[j];
    if (!(cmd instanceof Client.IdfCommand) || !cmd.visible)
      continue;
    //
    let {caption, icon, color} = Client.Widget.extractCaptionData(cmd.caption);
    let it = {id: cmd.id, title: caption, tooltip: cmd.tooltip || ""};
    //
    if (icon)
      it.icon = icon;
    if (color)
      it.color = color;
    if (cmd.image) {
      if (Client.Widget.isIconImage(cmd.image))
        it.icon = cmd.image;
      else {
        hasImageBackground = true;
        let src = (Client.mainFrame.isIDF ? "images/" : "") + cmd.image;
        it.style = "background-image: url('" + src + "'); ";
      }
    }
    //
    cmdList.push(it);
  }
  //
  let refId;
  if (options.targetId) {
    // In case of field, targetId could be a string that refers to a particular object: form value (fv), list value (lv1...99) or captions (lc, fc)
    // So remove last part in order to eventually get field id
    let rawTargetId = options.targetId.replace("\:fv", "").replace("\:lv\d+", "").replace("\:lc", "").replace("\:fc", "");
    //
    let target = Client.eleMap[rawTargetId];
    if (rawTargetId.startsWith("val:")) {
      let idParts = rawTargetId.split(":");
      let index = parseInt(idParts[1]);
      let field = Client.eleMap["fld:" + idParts.slice(2).join(":")];
      //
      if (field?.parent) {
        index = index + field.parent.actualPosition - 1;
        index = field.parent.hasGroupedRows() ? field.parent.groupedRowsRoot.realIndexToGroupedIndex(index) : index;
        target = field.getValueByIndex(index);
      }
    }
    //
    if (target)
      target = target.getPopupTarget(options.targetId);
    else {
      target = document.getElementById(options.targetId);
      if (!target)
        target = document.body.querySelector("[customid='" + options.targetId.replace(/:/g, "_") + "']");
    }
    //
    // Get the relative dom id
    refId = target?.id;
  }
  //
  if (cmdList.length > 0) {
    let opt = {
      options: {
        type: "menu",
        offset: 2,
        style: "menu-popup" + (hasImageBackground ? " with-background" : ""),
        items: cmdList,
        animation: false,
        callback: res => {
          Client.mainFrame.sendEvents(cmset.handlePopupResponse({id: "popupCallback", content: {res}}));
        }
      }
    };
    //
    if (refId) {
      opt.options.refObj = refId;
      opt.options.position = this.getPopupPosition(options.direction);
    }
    else if (options.x && options.y)
      opt.options.rect = {top: options.y + "px", left: options.x + "px"};
    //
    Client.mainFrame.popup(opt);
  }
};


/**
 * Show a tooltip
 * @param {Object} options :
 *                 {
 *                   id: dom or element id
 *                   title: title of the tooltip (optional)
 *                   text: text of the tooltip (suppports HTML)
 *                   anchorx: position of the anchor (if id not set)
 *                   anchorx: position of the anchor (if id not set)
 *                   position: top|left|right|bottom
 *                   showdelay: delay
 *                   hidedelay: delay
 *                   showoninactivity: NOT SUPPORTED
 *                   haswhisker: boolean
 *                   width: max width of the tooltip
 *                   height:  NOT SUPPORTED
 *                   style: info|warning|error
 *                   image:  NOT SUPPORTED
 *                 };
 */
Client.IdfWebEntryPoint.prototype.showTooltip = function (options)
{
  if (Client.mainFrame.idfMobile) {
    // When we are using the mobile themes we need to show the tooltip as temporary toasts
    Client.IonHelper.createToast({
      html: true,
      message: options.text.replace(/\n/g, "<br/>"),
      duration: options.hidedelay || 4000
    });
    return;
  }
  //
  let target = options.anchorx && options.anchory ? document.body : document.getElementById(options.id);
  if (!target && options.id) {
    if (options.id.indexOf(":lv") > 0) {
      // The server sends relative IDs, in the client we have absolute id, no problem, we need only to absolutize the server ones
      let fld = Client.eleMap[options.id.substring(0, options.id.indexOf(":lv"))];
      let rel = parseInt(options.id.substring(options.id.indexOf(":lv") + 3));
      let base = fld.parent.actualPosition + rel;
      options.id = fld.id + ":lv" + base;
    }
    //
    try {
      target = document.querySelector(`[customid=${options.id.replace(/:/g, "_") }]`);
      if (!target)
        target = document.querySelector(`[customid=${options.id}]`);
    }
    catch (ex) {
    }
    //
    if (!target)
      target = Client.eleMap[options.id]?.getRootObject();
  }
  //
  // No target found
  if (!target)
    return;
  //
  // Set manual (immediate) or on mouse over trigger
  let trigger = "manual";
  if (options.showdelay === -1) {
    trigger = "mouseenter focus";
    options.showdelay = 0;
  }
  var opt = {
    inlinePositioning: true,
    delay: [options.showdelay, 0],
    allowHTML: true,
    content: Client.Widget.getHTMLTooltip(options.title, options.text).content,
    placement: ["top", "right", "bottom", "left"][options.position],
    arrow: options.haswhisker,
    trigger: trigger,
    maxWidth: options.width || 350,
    theme: options.style
  };
  //
  // Set the absolute position on the body
  if (options.anchorx && options.anchory) {
    opt.offset = options.anchorx + ", " + options.anchory;
    opt.placement = opt.placement + "-start";
    opt.flip = false;
  }
  //
  // If the trigger is immediate we need to set the hide timer (tippy doesn't have a real duration)
  // and destroy/remove the tooltip when hidden (this is a one-shot tooltip)
  if (trigger === "manual") {
    opt.onShown = function (instance) {
      // if the trigger is manual create a timeout to close it
      setTimeout(() => {
        instance.hide();
      }, options.hidedelay);
    };
    opt.onHidden = function (instance) {
      // if the trigger is manual destroy/remove the instance when closed
      if (Client.mainFrame.wep.tooltips.indexOf(instance) >= 0)
        Client.mainFrame.wep.tooltips.splice(Client.mainFrame.wep.tooltips.indexOf(instance), 1);
      instance.destroy();
    };
  }
  //
  // instance data:
  // ttp.reference -> target dom obj
  // ttp.props -> options (not all)
  let ttp = tippy(target, opt);
  if (!ttp)
    return;
  //
  if (trigger === "manual")
    ttp.show();
  //
  this.tooltips.push(ttp);
};


/*
 * Removes all the tooltips relative to a view
 */
Client.IdfWebEntryPoint.prototype.resetTooltips = function (options)
{
  let viewDomObj = Client.eleMap[options.id]?.getRootObject();
  if (!viewDomObj)
    return;
  //
  for (let i = 0; i < this.tooltips.length; i++) {
    if (Client.Utils.isMyParent(this.tooltips[i].reference, viewDomObj.id)) {
      this.tooltips[i].destroy();
      this.tooltips.splice(i, 1);
      i--;
    }
  }
};


/**
 * Get popup position by given direction
 * @param {Integer} direction
 */
Client.IdfWebEntryPoint.prototype.getPopupPosition = function (direction)
{
  let position;
  //
  switch (direction) {
    case 0:
      position = "right-top";
      break;

    case 1:
      position = "bottom-left";
      break;

    case 2:
      position = "left-top";
      break;

    default:
      position = "top-left";
      break;
  }
  //
  return position;
};


Client.IdfWebEntryPoint.prototype.setSoundEnabled = function (value)
{
  if (!value)
    this.soundAction("", Client.IdfWebEntryPoint.soundActions.STOPALL);
  this.soundEnabled = value;
};


Client.IdfWebEntryPoint.prototype.soundAction = function (url, action, options)
{
  if (!this.soundEnabled)
    return;
  //
  options = options || {};
  action = action || Client.IdfWebEntryPoint.soundActions.PLAY;
  url = Client.IdfWebEntryPoint.soundDef[url] || url;
  if (url.includes(".") && !url.includes("/")) {
    // I add absolute path + mmedia
    let l = location.href;
    let p = l.lastIndexOf("/");
    if (p > 0)
      l = l.substr(0, p) + "/mmedia/";
    url = l + url;
  }
  //
  function mediaAction(action, args) {
    Client.mainFrame.processRequest([{id: action, obj: "device-media", cnt: {src: url, ...args}}]);
  }
  //
  // Undefined name, does not point to a file ...
  if (!url.includes(".") && !url.includes("/"))
    return;
  //
  if (!isNaN(options.volume))
    mediaAction("setVolume", {volume: Math.min(100, Math.max(0, options.volume)) / 100});
  //
  switch (action) {
    case Client.IdfWebEntryPoint.soundActions.PLAY:
      this.audioMap = this.audioMap || {};
      this.audioMap[url] = url;
      mediaAction("stop");
      mediaAction("play");
      break;

    case Client.IdfWebEntryPoint.soundActions.PAUSE:
      mediaAction("pause");
      break;

    case Client.IdfWebEntryPoint.soundActions.CONTINUE:
      mediaAction("play");
      break;

    case Client.IdfWebEntryPoint.soundActions.STOP:
      mediaAction("stop");
      mediaAction("remove");
      delete this.audioMap[url];
      break;

    case Client.IdfWebEntryPoint.soundActions.STOPALL:
      for (url in this.audioMap)
        this.soundAction(url, Client.IdfWebEntryPoint.soundActions.STOP);
      delete this.audioMap;
      break;
  }
};

Client.IdfWebEntryPoint.getAnimationByDef = function (def)
{
  if (Client.mainFrame.wep && !Client.mainFrame.wep.animationsEnabled)
    return;
  //
  // TODO: ! -> isBlocking
  let [type, duration] = def.replace("!", "").split(":");
  //
  let from;
  [type, from] = type.split("-");
  switch (from) {
    case "v":
      from = "top";
      break;
    case "h":
      from = "left";
      break;
  }
  //
  switch (type) {
    case "fade":
      type = "fade";
      break;
    case "fold":
      // TODO
      break;
    case "scroll":
      type = "slide";
      break;
    case "none":
      break;
  }
  if (type)
    return {type, from, easing: "ease", duration: parseInt(duration), delay: 0};
};

Client.IdfWebEntryPoint.getAnimationDefault = function (name)
{
  if (Client.mainFrame.wep)
    return Client.mainFrame.wep[`${name}AnimationDef`];
  else
    return Client.IdfWebEntryPoint.animationDefs[name];
};


Client.IdfWebEntryPoint.prototype.updateThemeColors = function ()
{
  // Get the default values of the colors
  let computedStyle = getComputedStyle(document.documentElement, null);
  let primary = computedStyle.getPropertyValue('--col-primary').trim();
  let secondary = computedStyle.getPropertyValue('--col-secondary').trim();
  let danger = computedStyle.getPropertyValue('--col-danger').trim();
  let dark = computedStyle.getPropertyValue('--col-dark').trim();
  let light = computedStyle.getPropertyValue('--col-light').trim();
  let bright = computedStyle.getPropertyValue('--col-bright').trim();
  let vibrant = computedStyle.getPropertyValue('--col-vibrant').trim();
  //
  // set the defaults to handle the change to the selected values
  if (primary) {
    Client.IonHelper.defaultThemeColors.primary = primary;
    Client.IonHelper.defaultThemeColors.primaryShade1 = Client.IonHelper.shadeRGBColor(primary, -0.05);
    Client.IonHelper.defaultThemeColors.primaryShade2 = Client.IonHelper.shadeRGBColor(primary, -0.1);
    Client.IonHelper.defaultThemeColors.primaryShade3 = Client.IonHelper.shadeRGBColor(primary, -0.2);
  }
  if (secondary) {
    Client.IonHelper.defaultThemeColors.secondary = secondary;
    Client.IonHelper.defaultThemeColors.secondaryShade1 = Client.IonHelper.shadeRGBColor(secondary, -0.05);
    Client.IonHelper.defaultThemeColors.secondaryShade2 = Client.IonHelper.shadeRGBColor(secondary, -0.1);
    Client.IonHelper.defaultThemeColors.secondaryShade3 = Client.IonHelper.shadeRGBColor(secondary, -0.2);
  }
  if (danger) {
    Client.IonHelper.defaultThemeColors.danger = danger;
    Client.IonHelper.defaultThemeColors.dangerShade1 = Client.IonHelper.shadeRGBColor(danger, -0.05);
    Client.IonHelper.defaultThemeColors.dangerShade2 = Client.IonHelper.shadeRGBColor(danger, -0.1);
    Client.IonHelper.defaultThemeColors.dangerShade3 = Client.IonHelper.shadeRGBColor(danger, -0.2);
  }
  if (dark) {
    Client.IonHelper.defaultThemeColors.dark = dark;
    Client.IonHelper.defaultThemeColors.darkShade1 = Client.IonHelper.shadeRGBColor(dark, 0.05);
    Client.IonHelper.defaultThemeColors.darkShade2 = Client.IonHelper.shadeRGBColor(dark, 0.1);
    Client.IonHelper.defaultThemeColors.darkShade3 = Client.IonHelper.shadeRGBColor(dark, 0.2);
  }
  if (light) {
    Client.IonHelper.defaultThemeColors.light = light;
    Client.IonHelper.defaultThemeColors.lightShade1 = Client.IonHelper.shadeRGBColor(light, -0.05);
    Client.IonHelper.defaultThemeColors.lightShade2 = Client.IonHelper.shadeRGBColor(light, -0.1);
    Client.IonHelper.defaultThemeColors.lightShade3 = Client.IonHelper.shadeRGBColor(light, -0.2);
  }
  if (bright) {
    Client.IonHelper.defaultThemeColors.bright = bright;
    Client.IonHelper.defaultThemeColors.brightShade1 = Client.IonHelper.shadeRGBColor(bright, -0.05);
    Client.IonHelper.defaultThemeColors.brightShade2 = Client.IonHelper.shadeRGBColor(bright, -0.1);
    Client.IonHelper.defaultThemeColors.brightShade3 = Client.IonHelper.shadeRGBColor(bright, -0.2);
  }
  if (vibrant) {
    Client.IonHelper.defaultThemeColors.vibrant = vibrant;
    Client.IonHelper.defaultThemeColors.vibrantShade1 = Client.IonHelper.shadeRGBColor(vibrant, 0.05);
    Client.IonHelper.defaultThemeColors.vibrantShade2 = Client.IonHelper.shadeRGBColor(vibrant, 0.1);
    Client.IonHelper.defaultThemeColors.vibrantShade3 = Client.IonHelper.shadeRGBColor(vibrant, 0.2);
  }
  //
  Client.mainFrame.cssUpdated = true;
  Client.mainFrame.updateTheme({theme: {}});
};


/**
 * Called by the shell when the backbutton on android is pressed by the user
 */
Client.IdfWebEntryPoint.prototype.OnBackButton = function ()
{
  // Passages:
  // Check if there is a progress bar, if true do nothing
  let msgPump = Client.mainFrame.messagesPump;
  if (msgPump.delayDlg.open)
    return true;
  //
  // Close open combo
  let comboWrappers = document.getElementsByClassName("ion-modal-cmp ion-autocomplete-cmp");
  if (comboWrappers.length > 0) {
    for (let c = 0; c < comboWrappers.length; c++) {
      if (comboWrappers[c].style.display !== "block")
        continue;
      //
      let combo = Client.eleMap[comboWrappers[c].getAttribute("parentcombo")];
      combo?.closeCombo(true);
      return true;
    }
  }
  //
  // Close open popup (date and number editor)
  let popup = document.querySelector("ion-popover[parentdate], ion-picker-cmp[parentdate]");
  if (popup) {
    let date = Client.eleMap[popup.getAttribute("parentdate")];
    date?.closePicker(true);
    return true;
  }
  popup = document.querySelector("ion-popover.popover-num-keyboard[for], ion-picker-cmp.numpad[for]");
  if (popup) {
    let numpad = Client.eleMap[popup.getAttribute("for")];
    numpad?.closeNumericKeyboard(true);
    return true;
  }
  //
  // Close message box (click on the last default button)
  // alert -> only a default button
  // input -> primary + default , the default is the undo
  // confirm -> primary + default , the default is the undo
  // confirm with custom buttons -> primary + default + default... in this case we cannot know what is the undo button, we can only hope that the user set them in order
  popup = document.querySelector("ion-alert.class-alertbox button:last-child.alert-button-default");
  if (popup) {
    popup.click();
    return true;
  }
  //
  // Side menu: if open and at second level go back
  // TODO: not supported on mobile ionic
  //
  // Close side menu
  if (Client.mainFrame.idfMobile && this.commandList) {
    let menu = Client.eleMap[this.commandList.menuConf.id];
    if (menu?.parent?.exposed === false && menu?.visible) {
      menu.setVisible(false, true);
      return true;
    }
  }
  // If a view is open send the message
  if (this.activeView?.onHardwareBackButton())
    return true;
  //
  // Close the App
  if (Client.Shell.isInsideShell)
    Client.Shell.sendCmd("EXIT");
  //else
  //top.close();
};


/**
 * onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.IdfWebEntryPoint.prototype.onResize = function (ev)
{
  Client.mainFrame.sendEvents(this.handleResize());
  //
  Client.Widget.prototype.onResize.call(this, ev);
  //
  this.secondaryViews.forEach(v => v.onResize(ev));
};


/**
 * Handle a resize event
 */
Client.IdfWebEntryPoint.prototype.handleResize = function ()
{
  let events = [];
  if (!Client.mainFrame.isIDF)
    return events;
  //
  let rootObject = Client.eleMap[this.centerGridConf.id].getRootObject();
  let rootRect = rootObject.getBoundingClientRect();
  //
  if (rootRect.width !== this.lastRect?.width || rootRect.height !== this.lastRect?.height || rootRect.left !== this.lastRect?.left || rootRect.top !== this.lastRect?.top) {
    events.push({
      id: "resize",
      def: Client.IdfMessagesPump.eventTypes.SERVERSIDE,
      content: {
        oid: this.id,
        par1: Math.floor(rootRect.width),
        par2: Math.floor(rootRect.height),
        par3: Math.floor(rootRect.left),
        par4: Math.floor(rootRect.top),
        par5: Math.floor(document.body.offsetWidth),
        par6: Math.floor(document.body.offsetHeight)
      }
    });
    //
    this.lastRect = rootRect;
  }
  //
  return events;
};


Client.IdfWebEntryPoint.prototype.getPageOfView = function (view)
{
  let viewsContainer = Client.eleMap[this.viewsContainerConf.id];
  return viewsContainer.elements.findIndex(e => e.elements[0] === view);
};


Client.IdfWebEntryPoint.sendCommand = function (cmd, params)
{
  let events = [];
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "cmd",
      def: Client.IdfMessagesPump.eventTypes.ACTIVE,
      content: {
        oid: "wep",
        obn: cmd + (params ? "&" + params : "")
      }
    });
  }
  else {
    // TODO
  }
  //
  Client.mainFrame.sendEvents(events);
};
RD3_SendCommand = Client.IdfWebEntryPoint.sendCommand;

/*
 * Empty function to help users to personalize the header of the application
 */
Client.IdfWebEntryPoint.prototype.customizeHeader = function ()
{

};

Client.IdfWebEntryPoint.prototype.handleCustomEvent = function (event)
{
  /*
   let events = [];
   events.push({
   id: "cmd",
   def: Client.IdfMessagesPump.eventTypes.ACTIVE,
   content: {
   oid: "wep",
   obn: "command&param1=val1"
   }
   });
   return events;
   */
  return [];
};

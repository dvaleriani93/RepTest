/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};
/**
 * @class A frame object of type panel
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfPanel = function (widget, parent, view)
{
  this.fields = [];
  this.groups = [];
  this.pages = [];
  this.newFields = [];
  this.multiSelStatus = [];
  this.visibleAggregateFields = [];
  this.viewportListFields = [];
  this.listGridRows = [];
  this.formGridRows = [];
  this.rows = [];
  this.detachedRows = {};
  this.commandsZones = [4, 4, 4, 6, 5, 4, 4, 6, 6, 0, 0, 0, 0, 0, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0, 0, 3, 0, 1, 1, 2, 9, 2, 8, 8, 8, 8, 8, 8, 8, 8, 0, 0, 0];
  this.customCommands = [];
  this.showFieldImageInValue = Client.mainFrame.wep?.showFieldImageInValue !== undefined ? Client.mainFrame.wep.showFieldImageInValue : true;
  //
  // Set default values
  widget = Object.assign({
    showStatusbar: true,
    gridHeight: parent.height,
    gridTop: 0,
    gridLeft: 0,
    headerHeight: Client.IdfPanel.defaultHeaderHeight,
    layout: Client.IdfPanel.layouts.list,
    status: Client.mainFrame.isEditing() ? Client.IdfPanel.statuses.data : Client.IdfPanel.statuses.qbe,
    showRowSelector: true,
    showMultipleSelection: false,
    enableMultipleSelection: true,
    selectOnlyVisibleRows: false,
    hasList: true,
    hasForm: true,
    rowHeightResize: false,
    canUpdate: true,
    canDelete: true,
    canInsert: true,
    canSearch: true,
    canSort: true,
    canGroup: false,
    showGroups: false,
    confirmDelete: true,
    highlightDelete: true,
    totalRows: 0,
    actualPosition: 1,
    actualRow: 0,
    resizeWidth: Client.IdfPanel.resizeModes.stretch,
    resizeHeight: Client.IdfPanel.resizeModes.stretch,
    fixedColumns: 0,
    blockingCommands: 0,
    enabledCommands: -1,
    extEnabledCommands: -1,
    automaticLayout: false,
    searchMode: Client.IdfPanel.searchModes.toolbar,
    allowNavigationWhenModified: true,
    enableInsertWhenLocked: false,
    hasBook: false,
    isDO: false,
    hasDocTemplate: false,
    DOMaster: false,
    DOModified: false,
    DOSingleDoc: false,
    DOCanSave: true,
    activateOnRightClick: false,
    pullToRefresh: true,
    activePage: 0,
    advancedTabOrder: false,
    canReorderColumn: false,
    canResizeColumn: false,
    searchInContent: true,
    toolbarEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    scrollEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    rowSelectEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    pageClickEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    multiSelEventDef: Client.IdfMessagesPump?.eventTypes.DEFERRED,
    focusEventDef: Client.IdfMessagesPump?.eventTypes.CLIENTSIDE,
    selectionChangeEventDef: Client.IdfMessagesPump?.eventTypes.DEFERRED,
    changeLayoutAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("list"),
    qbeTipAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("qbeTip")
  }, widget);
  //
  if (widget.disableAnimations) {
    widget.changeLayoutAnimationDef = "none:250";
    widget.collapseAnimationDef = "none:250";
  }
  //
  // Set original dimensions and position
  let newHeight = (parent instanceof Client.IdfTab ? parent.parent.height : widget.height) || 0;
  this.orgGridHeight = widget.gridHeight - (newHeight - widget.originalHeight);
  this.orgGridWidth = widget.gridWidth + Client.IdfPanel.scrollbarWidth;
  widget.gridHeight = this.orgGridHeight;
  //
  this.orgGridTop = widget.gridTop;
  this.orgGridLeft = widget.gridLeft;
  //
  this.gridStyle = {};
  this.gridColStyle = {};
  this.rowSelectorStyle = {};
  this.aggregateRowSelectorStyle = {};
  //
  // Create rows inside IDC editor
  if (Client.mainFrame.isEditing()) {
    widget.totalRows = Client.IdfPanel.maxReusableRows;
    widget.data = {};
    widget.dataBlockStart = 1;
    widget.dataBlockEnd = widget.totalRows;
  }
  //
  if (view?.parent instanceof Client.IonNavController) {
    let parentStyle = view.parent?.domObj?.style;
    if (parentStyle && !parentStyle.height)
      parentStyle.height = "100%";
  }
  //
  this.numSubRows = 1;
  this.wrapRows = [];
  //
  if (Client.mainFrame.isIDF)
    Client.IdfPanel.handleListTabOrder(widget);
  //
  Client.IdfFrame.call(this, widget, parent, view);
};


// Make Client.IdfPanel extend Client.IdfFrame
Client.IdfPanel.prototype = new Client.IdfFrame();

Client.IdfPanel.getRequirements = Client.IdfFrame.getRequirements;

Client.IdfPanel.transPropMap = Object.assign({}, Client.IdfFrame.transPropMap, {
  mod: "layout",
  sta: "status",
  num: "numRows",
  mor: "moreRows",
  mhr: "maxRowHeight",
  hds: "headerHeight",
  srs: "showRowSelector",
  sms: "showMultipleSelection",
  ems: "enableMultipleSelection",
  sov: "selectOnlyVisibleRows",
  hli: "hasList",
  hfo: "hasForm",
  upd: "canUpdate",
  del: "canDelete",
  ins: "canInsert",
  sea: "canSearch",
  sor: "canSort",
  grn: "canGroup",
  sgr: "showGroups",
  cde: "confirmDelete",
  hde: "highlightDelete",
  lle: "gridLeft",
  lto: "gridTop",
  lwi: "gridWidth",
  lhe: "gridHeight",
  atr: "actualRow",
  vre: "resizeHeight",
  hre: "resizeWidth",
  fix: "fixedColumns",
  qtp: "qbeTip",
  acp: "actualPosition",
  tot: "totalRows",
  cbk: "blockingCommands",
  enc: "enabledCommands",
  eec: "extEnabledCommands",
  qbf: "automaticLayout",
  lqb: "searchMode",
  rhr: "rowHeightResize",
  amp: "allowNavigationWhenModified",
  eil: "enableInsertWhenLocked",
  bok: "hasBook",
  ido: "isDO",
  hdt: "hasDocTemplate",
  dom: "DOModified",
  mst: "DOMaster",
  csa: "DOCanSave",
  sdo: "DOSingleDoc",
  arc: "activateOnRightClick",
  pag: "activePage",
  tck: "toolbarEventDef",
  sck: "scrollEventDef",
  rck: "rowSelectEventDef",
  pck: "pageClickEventDef",
  mse: "multiSelEventDef",
  fed: "focusEventDef",
  tsk: "selectionChangeEventDef",
  cla: "changeLayoutAnimationDef",
  qta: "qbeTipAnimationDef",
  rsc: "canResizeColumn",
  rcl: "canReorderColumn",
  pre: "pullToRefresh",
  ata: "advancedTabOrder",
  vfl: "visualFlags",
  tor: "tooltipOnEachRow",
  ssc: "searchInContent"
});


Client.IdfPanel.defaultHeaderHeight = 32;
Client.IdfPanel.defaultListRowHeight = 32;
Client.IdfPanel.defaultRowSelectorWidth = 40;
Client.IdfPanel.rowSelectorOffset = 20;
Client.IdfPanel.maxToolbarZones = 11;
Client.IdfPanel.maxReusableRows = 70;
Client.IdfPanel.scrollbarWidth = 14;

// If scroll movement (in terms of rows) exceeds this number
// it means it's a hard scroll, i.e. performed by dragging scrollbar thumb
Client.IdfPanel.hardScrollLimit = 20;

// Standard functional keys
Client.IdfPanel.FKActField = 2;   // Single field activator (F2)
Client.IdfPanel.FKEnterQBE = 3;   // Key enters QBE (F3)
Client.IdfPanel.FKFindData = 3;   // Find data key (F3)
Client.IdfPanel.FKFormList = 4;   // Form/list key (F4)
Client.IdfPanel.FKRefresh = 6;    // Refresh key (F6)
Client.IdfPanel.FKCancel = 6;     // Cancel key (F6)
Client.IdfPanel.FKInsert = 7;     // Inert key (F7)
Client.IdfPanel.FKDelete = 8;     // Delete key (F8)
Client.IdfPanel.FKUpdate = 9;     // Update key (F9)
Client.IdfPanel.FKLocked = 11;    // Lock/unlock key (F11)
Client.IdfPanel.FKActRow = 12;    // Row activator key (F12)
Client.IdfPanel.FKSelAll = 14;    // Select all key (SHIFT+F2)
Client.IdfPanel.FKSelNone = 15;   // Cancel selection key (SHIFT+F3)
Client.IdfPanel.FKSelTog = 16;    // Shows selection key (SHIFT+F4)
Client.IdfPanel.FKDuplicate = 19; // Duplicate key (SHIFT+F7)
Client.IdfPanel.FKCloseView = 26; // Close view key (CTRL+F2) (because CTRL+F4 closes the browser!)
Client.IdfPanel.FKPrint = 36;     // Print key (CTRL+F12)


Client.IdfPanel.commands = {
  // Commands indexes to handle commands zones
  CZ_FORMLIST: 0, CZ_SEARCH: 1, CZ_FIND: 2, CZ_INSERT: 3, CZ_DELETE: 4, CZ_CANCEL: 5, CZ_REQUERY: 6, CZ_UPDATE: 7, CZ_DUPLICATE: 8, CZ_LOOKUP: 9,
  CZ_BLOBEDIT: 10, CZ_BLOBDELETE: 11, CZ_BLOBNEW: 12, CZ_BLOBSAVEAS: 13, CZ_PRINT: 14, CZ_GROUP: 15, CZ_ATTACH: 16, CZ_CSV: 17, CZ_CUSTOM1: 18,
  CZ_CUSTOM2: 19, CZ_CUSTOM3: 20, CZ_CUSTOM4: 21, CZ_CUSTOM5: 22, CZ_CUSTOM6: 23, CZ_CUSTOM7: 24, CZ_CUSTOM8: 25, CZ_NAVIGATE: 30, CZ_COLLAPSE: 32,
  CZ_LOCK: 33, CZ_STATUSBAR: 34, CZ_CMDSET: 35, CZ_QBETIP: 36,
  //
  // Commands values to handle enable commands
  CMD_FORMLIST: 0x1, CMD_SEARCH: 0x2, CMD_FIND: 0x4, CMD_INSERT: 0x8, CMD_DELETE: 0x10, CMD_CANCEL: 0x20, CMD_REFRESH: 0x40, CMD_SAVE: 0x80,
  CMD_DUPLICATE: 0x100, CMD_LOOKUP: 0x200, CMD_BLOBEDIT: 0x400, CMD_BLOBDELETE: 0x800, CMD_BLOBNEW: 0x1000, CMD_BLOBSAVEAS: 0x2000, CMD_PRINT: 0x4000,
  CMD_ATTACH: 0x10000, CMD_CSV: 0x20000, CMD_GROUP: 0x8000, CMD_CUSTOM1: -0x1, CMD_CUSTOM2: -0x2, CMD_CUSTOM3: -0x4, CMD_CUSTOM4: -0x8,
  CMD_CUSTOM5: -0x16, CMD_CUSTOM6: -0x32, CMD_CUSTOM7: -0x64, CMD_CUSTOM8: -0x128, CMD_NAVIGATION: 0x40000000
};


Client.IdfPanel.resizeModes = {
  none: 1,
  move: 2,
  stretch: 3
};


Client.IdfPanel.statuses = {
  qbe: 1,
  data: 2,
  updated: 3
};


Client.IdfPanel.layouts = {
  list: 0,
  form: 1
};


Client.IdfPanel.searchModes = {
  toolbar: 0,
  header: -1,
  row: -2
};


Client.IdfPanel.editOperations = {
  drag: 1,
  resize: 2,
  movegrid: 3
};


/**
 * Create element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfPanel.createConfigFromXml = function (xml)
{
  let config = {};
  //
  let dataChange = false;
  let dataBlockStart;
  let dataBlockEnd;
  //
  // Look into panel children (i.e. fields) in order to find start and end index of given block of data
  for (let i = 0; i < xml.childNodes.length; i++) {
    let child = xml.childNodes[i];
    //
    if (child.nodeName === "lsg") {
      config.groupedRows = true;
      continue;
    }
    //
    let fieldConfig = Client.Widget.createConfigFromXml(child);
    if (!fieldConfig || !Client.Widget.isFieldClass(fieldConfig.c))
      continue;
    //
    if (!fieldConfig.valuesConfig.length)
      continue;
    //
    dataChange = true;
    //
    if (dataBlockStart === undefined)
      dataBlockStart = parseInt(fieldConfig.valuesConfig[0].idx);
    //
    if (dataBlockEnd === undefined)
      dataBlockEnd = parseInt(fieldConfig.valuesConfig[fieldConfig.valuesConfig.length - 1].idx);
  }
  //
  if (dataChange) {
    config.dataBlockStart = dataBlockStart || 1;
    config.dataBlockEnd = dataBlockEnd || 1;
    //
    // An IDC panel receives data into "data" property, while an IDF panel gets its data at creation time.
    // Since I populate panel grid on "data" property change (see IdfPanel.updateElement method), set dummy "data" property on IDF panel too.
    config.data = {};
  }
  //
  return config;
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfPanel.convertPropValues = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.convertPropValues(props);
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfPanel.transPropMap.mod:
      case Client.IdfPanel.transPropMap.sta:
      case Client.IdfPanel.transPropMap.num:
      case Client.IdfPanel.transPropMap.hds:
      case Client.IdfPanel.transPropMap.tot:
      case Client.IdfPanel.transPropMap.lwi:
      case Client.IdfPanel.transPropMap.lhe:
      case Client.IdfPanel.transPropMap.lle:
      case Client.IdfPanel.transPropMap.lto:
      case Client.IdfPanel.transPropMap.hre:
      case Client.IdfPanel.transPropMap.vre:
      case Client.IdfPanel.transPropMap.atr:
      case Client.IdfPanel.transPropMap.acp:
      case Client.IdfPanel.transPropMap.cbk:
      case Client.IdfPanel.transPropMap.enc:
      case Client.IdfPanel.transPropMap.eec:
      case Client.IdfPanel.transPropMap.lqb:
      case Client.IdfPanel.transPropMap.pag:
      case Client.IdfPanel.transPropMap.tck:
      case Client.IdfPanel.transPropMap.sck:
      case Client.IdfPanel.transPropMap.rck:
      case Client.IdfPanel.transPropMap.pck:
      case Client.IdfPanel.transPropMap.mse:
      case Client.IdfPanel.transPropMap.rsc:
      case Client.IdfPanel.transPropMap.rcl:
      case Client.IdfPanel.transPropMap.fix:
      case Client.IdfPanel.transPropMap.vfl:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfPanel.transPropMap.srs:
      case Client.IdfPanel.transPropMap.mor:
      case Client.IdfPanel.transPropMap.sms:
      case Client.IdfPanel.transPropMap.ems:
      case Client.IdfPanel.transPropMap.sov:
      case Client.IdfPanel.transPropMap.hli:
      case Client.IdfPanel.transPropMap.hfo:
      case Client.IdfPanel.transPropMap.upd:
      case Client.IdfPanel.transPropMap.del:
      case Client.IdfPanel.transPropMap.ins:
      case Client.IdfPanel.transPropMap.sea:
      case Client.IdfPanel.transPropMap.sor:
      case Client.IdfPanel.transPropMap.grn:
      case Client.IdfPanel.transPropMap.sgr:
      case Client.IdfPanel.transPropMap.cde:
      case Client.IdfPanel.transPropMap.hde:
      case Client.IdfPanel.transPropMap.amp:
      case Client.IdfPanel.transPropMap.eil:
      case Client.IdfPanel.transPropMap.qbf:
      case Client.IdfPanel.transPropMap.bok:
      case Client.IdfPanel.transPropMap.ido:
      case Client.IdfPanel.transPropMap.dom:
      case Client.IdfPanel.transPropMap.mst:
      case Client.IdfPanel.transPropMap.csa:
      case Client.IdfPanel.transPropMap.sdo:
      case Client.IdfPanel.transPropMap.arc:
      case Client.IdfPanel.transPropMap.pre:
      case Client.IdfPanel.transPropMap.ata:
      case Client.IdfPanel.transPropMap.tor:
      case Client.IdfPanel.transPropMap.ssc:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfPanel.prototype.getRootObject = function (el)
{
  if (this.moving)
    return Client.IdfFrame.prototype.getRootObject.call(this, el);
  //
  let rootObject = Client.eleMap[this.panelContainerConf.id];
  return el ? rootObject : rootObject.domObj;
};


/**
 * Create elements configuration
 * @param {Object} widget
 */
Client.IdfPanel.prototype.createElementsConfig = function (widget)
{
  Client.IdfFrame.prototype.createElementsConfig.call(this, widget);
  let isVela = Client.mainFrame.idfTheme === "vela";
  //
  // Create pages container configuration and put it between toolbar and content
  this.pagesContainerConf = this.createElementConfig({c: "Container", className: "panel-pages-container", visible: false});
  this.mainContainerConf.children.splice(1, 0, this.pagesContainerConf);
  //
  // Create an alternate container configuration that will contain two pages: one for list mode and another one for form mode
  this.panelContainerConf = this.createElementConfig({c: "AltContainer", selectedPage: widget.layout || 0, className: "panel-container"});
  let a = Client.IdfWebEntryPoint.getAnimationByDef(this.changeLayoutAnimationDef);
  if (a && !isVela)
    this.panelContainerConf.animations = [{trigger: "change", ...a}];
  this.contentContainerConf.children.push(this.panelContainerConf);
  //
  // Create list page configuration (first page)
  let page1 = this.createElementConfig({c: "Container", style: {width: "100%", height: "100%"}});
  //
  // Create list container configuration
  this.listContainerConf = this.createElementConfig({c: "IonGrid", className: "panel-list-container"});
  //
  // Create grid configuration
  this.createGridConfig();
  //
  page1.children.push(this.listContainerConf);
  page1.children.push(this.extGridConf);
  this.panelContainerConf.children.push(page1);
  //
  // Create form page configuration (second page)
  let page2 = this.createElementConfig({c: "Container", style: {width: "100%", height: "100%"}});
  //
  // Create form container configuration
  this.formContainerConf = this.createElementConfig({c: "IonGrid", className: "panel-form-container"});
  //
  page2.children.push(this.formContainerConf);
  this.panelContainerConf.children.push(page2);
};


/**
 * Create grid configuration
 */
Client.IdfPanel.prototype.createGridConfig = function ()
{
  // Create the external ion-list configuration
  this.extGridConf = this.createElementConfig({c: "IonContent", className: "panel-list-ext-grid", noBounce: true});
  //
  this.extGridListConf = this.createElementConfig({c: "IonList", className: "panel-list-ext-grid", events: ["onRefresh"], pullText: " ", refreshText: " "});
  this.extGridConf.children.push(this.extGridListConf);
  //
  // Create grid configuration
  this.gridConf = this.createElementConfig({c: "IonGrid", className: "panel-list-grid"});
  this.extGridListConf.children.push(this.gridConf);
  //
  // Create grid header configuration
  this.gridHeaderConf = this.createElementConfig({c: "IonRow", className: "panel-list-row panel-list-header-row", noWrap: true});
  this.gridConf.children.push(this.gridHeaderConf);
  //
  // Create row selector column configuration
  let offsetCol = this.getHeaderOffset() ? " offset-col" : "";
  this.rowSelectorColumnConf = this.createElementConfig({c: "IonCol", className: "panel-list-col row-selector-col" + offsetCol, xs: "auto", visible: false});
  this.gridHeaderConf.children.push(this.rowSelectorColumnConf);
  //
  // Create multiselection button configuration
  this.multiSelButtonConf = this.createElementConfig({c: "IonButton", icon: "checkbox", className: "generic-btn panel-multisel-button", events: ["onClick"]});
  this.rowSelectorColumnConf.children.push(this.multiSelButtonConf);
  //
  this.windowScrollerConf = this.createElementConfig({c: "Container", className: "panel-list-scroller"});
  this.gridConf.children.push(this.windowScrollerConf);
  //
  this.windowConf = this.createElementConfig({c: "Container", className: "panel-list-window"});
  this.windowScrollerConf.children.push(this.windowConf);
  //
  // Create aggregate row configuration
  this.aggregateRowConf = this.createElementConfig({c: "IonRow", className: "panel-list-row panel-list-aggregate-row", noWrap: true});
  this.gridConf.children.push(this.aggregateRowConf);
  //
  // Create row selector configuration for aggregate row
  this.aggregateRowSelectorConf = this.createElementConfig({c: "IonCol", className: "panel-list-col row-selector-col", xs: "auto"});
  this.aggregateRowConf.children.push(this.aggregateRowSelectorConf);
  //
  if (!Client.mainFrame.isIDF) {
    // Create no results row configuration
    this.noResultsRowConf = this.createElementConfig({c: "IonRow", className: "panel-list-noresults-row", noWrap: true, visible: false});
    this.gridConf.children.push(this.noResultsRowConf);
    //
    // Create no results col configuration
    let noResultsColConf = this.createElementConfig({c: "IonCol", xs: "auto"});
    this.noResultsRowConf.children.push(noResultsColConf);
    //
    // Create no results col configuration
    this.noResultsTextConf = this.createElementConfig({c: "Span", className: "panel-list-noresults-text"});
    noResultsColConf.children.push(this.noResultsTextConf);
  }
};


/**
 * Create toolbar configuration
 * @param {Object} widget
 */
Client.IdfPanel.prototype.createToolbarConfig = function (widget)
{
  Client.IdfFrame.prototype.createToolbarConfig.call(this, widget);
  this.hasFAB = widget.className?.toUpperCase()?.indexOf("FAB") >= 0 && Client.mainFrame.idfMobile;
  //
  // Create toolbar zones configuration
  this.toolbarZonesConfig = [];
  for (let i = 0; i < Client.IdfPanel.maxToolbarZones; i++) {
    if (Client.mainFrame.idfMobile)
      this.toolbarZonesConfig[i] = this.toolbarConf;
    else {
      // Create zone configuration (the first one is not visible)
      this.toolbarZonesConfig[i] = this.createElementConfig({c: "Container", className: "panel-toolbar-zone"});
      this.toolbarConf.children.push(this.toolbarZonesConfig[i]);
    }
  }
  //
  let zoneIdx, commandIdx;
  //
  // Move collapse button to collapse command zone
  commandIdx = this.toolbarConf.children.indexOf(this.collapseButtonConf);
  this.toolbarConf.children.splice(commandIdx, 1);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_COLLAPSE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.collapseButtonConf);
  this.collapseButtonConf.className += " panel-toolbar-btn";
  //
  // Move menu button to collapse command zone
  commandIdx = this.toolbarConf.children.indexOf(this.menuButtonConf);
  this.toolbarConf.children.splice(commandIdx, 1);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_COLLAPSE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.menuButtonConf);
  this.menuButtonConf.className += " panel-toolbar-btn";
  //
  // Move lock button to lock command zone
  commandIdx = this.toolbarConf.children.indexOf(this.lockButtonConf);
  this.toolbarConf.children.splice(commandIdx, 1);
  this.lockButtonConf.className += " panel-toolbar-btn";
  if (this.hasFAB) {
    this.lockButtonConf.fab = "bottom";
    this.lockButtonConf.fabAlignment = "right";
    this.mainContainerConf.children.push(this.lockButtonConf);
  }
  else {
    zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_LOCK);
    this.toolbarZonesConfig[zoneIdx].children.push(this.lockButtonConf);
  }
  //
  // Move icon to status bar command zone
  commandIdx = this.toolbarConf.children.indexOf(this.iconButtonConf);
  this.toolbarConf.children.splice(commandIdx, 1);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_STATUSBAR);
  this.toolbarZonesConfig[zoneIdx].children.push(this.iconButtonConf);
  this.iconButtonConf.className += " panel-toolbar-btn";
  //
  // Move title to status bar command zone
  commandIdx = this.toolbarConf.children.indexOf(this.titleConf);
  this.toolbarConf.children.splice(commandIdx, 1);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_STATUSBAR);
  this.toolbarZonesConfig[zoneIdx].children.push(this.titleConf);
  //
  // Create status bar configuration
  this.statusbarConf = this.createElementConfig({c: "Span", className: "panel-statusbar"});
  this.titleConf.children.push(this.statusbarConf);
  //
  // Create qbe button configuration
  this.qbeButtonConf = this.createElementConfig({c: "IonButton", icon: "information-circle-outline", className: "generic-btn panel-toolbar-btn qbe-tip-btn"});
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_STATUSBAR);
  this.toolbarZonesConfig[zoneIdx].children.push(this.qbeButtonConf);
  //
  // Create navigation buttons
  //
  // Create top button configuration
  this.topButtonConf = this.createElementConfig({c: "IonButton", icon: "rewind", className: "generic-btn panel-toolbar-btn top-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_top"});
  this.topButtonConf.tooltip = this.getTooltip(this.topButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_NAVIGATE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.topButtonConf);
  //
  // Create previous button configuration
  this.prevButtonConf = this.createElementConfig({c: "IonButton", icon: "play", className: "generic-btn panel-toolbar-btn prev-btn", events: ["onClick"]});
  this.prevButtonConf.tooltip = this.getTooltip(this.prevButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_NAVIGATE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.prevButtonConf);
  //
  // Create next button configuration
  this.nextButtonConf = this.createElementConfig({c: "IonButton", icon: "play", className: "generic-btn panel-toolbar-btn next-btn", events: ["onClick"]});
  this.nextButtonConf.tooltip = this.getTooltip(this.nextButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_NAVIGATE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.nextButtonConf);
  //
  // Create bottom button configuration
  this.bottomButtonConf = this.createElementConfig({c: "IonButton", icon: "fastforward", className: "generic-btn panel-toolbar-btn bottom-btn", events: ["onClick"]});
  this.bottomButtonConf.tooltip = this.getTooltip(this.bottomButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_NAVIGATE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.bottomButtonConf);
  //
  // Create search button configuration
  this.searchButtonConf = this.createElementConfig({c: "IonButton", icon: "search", className: "generic-btn panel-toolbar-btn search-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_search"});
  this.searchButtonConf.tooltip = this.getTooltip(this.searchButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_SEARCH);
  this.toolbarZonesConfig[zoneIdx].children.push(this.searchButtonConf);
  //
  // Create find button configuration
  this.findButtonConf = this.createElementConfig({c: "IonButton", icon: "flash", className: "generic-btn panel-toolbar-btn find-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_find"});
  this.findButtonConf.tooltip = this.getTooltip(this.findButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_FIND);
  this.toolbarZonesConfig[zoneIdx].children.push(this.findButtonConf);
  //
  // Create form/list button configuration
  this.formListButtonConf = this.createElementConfig({c: "IonButton", icon: Client.mainFrame.idfMobile ? "arrow-back" : "list", className: "generic-btn panel-toolbar-btn formlist-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_formlist"});
  this.formListButtonConf.tooltip = this.getTooltip(this.formListButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_FORMLIST);
  this.toolbarZonesConfig[zoneIdx].children.push(this.formListButtonConf);
  //
  // Create form/list button configuration for automatic layout. Add it to collapse command zone (as first button of that zone)
  this.formListAutoButtonConf = this.createElementConfig({c: "IonButton", icon: "arrow-back", visible: false, className: "generic-btn panel-toolbar-btn formlist-auto-btn", events: ["onClick"]});
  this.formListAutoButtonConf.tooltip = this.getTooltip(this.formListAutoButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_COLLAPSE);
  this.toolbarZonesConfig[zoneIdx].children.unshift(this.formListAutoButtonConf);
  //
  // Create cancel button configuration
  this.cancelButtonConf = this.createElementConfig({c: "IonButton", icon: "undo", className: "generic-btn panel-toolbar-btn undo-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_cancel"});
  this.cancelButtonConf.tooltip = this.getTooltip(this.cancelButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_CANCEL);
  this.toolbarZonesConfig[zoneIdx].children.push(this.cancelButtonConf);
  //
  // Create refresh button configuration
  this.refreshButtonConf = this.createElementConfig({c: "IonButton", icon: "refresh", className: "generic-btn panel-toolbar-btn refresh-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_refresh"});
  this.refreshButtonConf.tooltip = this.getTooltip(this.refreshButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_REQUERY);
  this.toolbarZonesConfig[zoneIdx].children.push(this.refreshButtonConf);
  //
  // Create delete button configuration
  this.deleteButtonConf = this.createElementConfig({c: "IonButton", icon: "trash", className: "generic-btn panel-toolbar-btn delete-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_del"});
  this.deleteButtonConf.tooltip = this.getTooltip(this.deleteButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_DELETE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.deleteButtonConf);
  //
  // Create insert button configuration
  this.insertButtonConf = this.createElementConfig({c: "IonButton", icon: "add", className: "generic-btn panel-toolbar-btn insert-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_new"});
  this.insertButtonConf.tooltip = this.getTooltip(this.insertButtonConf.id);
  if (this.hasFAB) {
    this.insertButtonConf.fab = "bottom";
    this.insertButtonConf.fabAlignment = "right";
    this.mainContainerConf.children.push(this.insertButtonConf);
  }
  else {
    zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_INSERT);
    this.toolbarZonesConfig[zoneIdx].children.push(this.insertButtonConf);
  }
  //
  // Create multiple selection mobile button configuration (visibile only on mobile themes when the multiselection is enabled)
  this.multipleMobileButtonConf = this.createElementConfig({c: "IonButton", icon: "done-all", visible: !!(this.enableMultipleSelection && Client.mainFrame.idfMobile), className: "generic-btn panel-toolbar-btn multiple-mob-btn", events: ["onClick"]});
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_INSERT);
  this.toolbarZonesConfig[zoneIdx].children.push(this.multipleMobileButtonConf);
  //
  // Create duplicate button configuration
  this.duplicateButtonConf = this.createElementConfig({c: "IonButton", icon: "copy", className: "generic-btn panel-toolbar-btn duplicate-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_dupl"});
  this.duplicateButtonConf.tooltip = this.getTooltip(this.duplicateButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_DUPLICATE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.duplicateButtonConf);
  //
  // Create save button configuration
  this.saveButtonConf = this.createElementConfig({c: "IonButton", icon: "save", className: "generic-btn panel-toolbar-btn save-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_save"});
  this.saveButtonConf.tooltip = this.getTooltip(this.saveButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_UPDATE);
  this.toolbarZonesConfig[zoneIdx].children.push(this.saveButtonConf);
  //
  // Create print button configuration
  this.printButtonConf = this.createElementConfig({c: "IonButton", icon: "print", className: "generic-btn panel-toolbar-btn print-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_print"});
  this.printButtonConf.tooltip = this.getTooltip(this.printButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_PRINT);
  this.toolbarZonesConfig[zoneIdx].children.push(this.printButtonConf);
  //
  // Create csv button configuration
  this.csvButtonConf = this.createElementConfig({c: "IonButton", icon: "open", className: "generic-btn panel-toolbar-btn csv-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_csv"});
  this.csvButtonConf.tooltip = this.getTooltip(this.csvButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_CSV);
  this.toolbarZonesConfig[zoneIdx].children.push(this.csvButtonConf);
  //
  // Create attach button configuration
  this.attachButtonConf = this.createElementConfig({c: "IonButton", icon: "attach", className: "generic-btn panel-toolbar-btn attach-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_attach"});
  this.attachButtonConf.tooltip = this.getTooltip(this.attachButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_ATTACH);
  this.toolbarZonesConfig[zoneIdx].children.push(this.attachButtonConf);
  //
  // Create group button configuration
  this.groupButtonConf = this.createElementConfig({c: "IonButton", icon: "grid", className: "generic-btn panel-toolbar-btn group-btn", events: ["onClick"], customid: this.id.replace(/:/g, "_") + "_group"});
  this.groupButtonConf.tooltip = this.getTooltip(this.groupButtonConf.id);
  zoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_GROUP);
  this.toolbarZonesConfig[zoneIdx].children.push(this.groupButtonConf);
  //
  // Create custom buttons configuration
  this.customButtonsConf = [];
  Client.mainFrame.wep?.customCommands.forEach(cc => this.addCustomCommand(cc));
  //
  // Remove empty zones
  // (not the commandsets, they can be created after this phase)
  for (let i = 0; i < this.toolbarZonesConfig.length; i++) {
    if (!this.toolbarZonesConfig[i].children.length)
      this.toolbarZonesConfig[i].visible = false;
  }
  //
  // After configuring the toolbar if a searchbar is needed we need to wrap the toolbar with an header
  // so we can create a brother
  if (Client.mainFrame.idfMobile && this.canSearch && this.searchMode === Client.IdfPanel.searchModes.toolbar && this.hasList && !this.searchInContent) {
    // Create the wrapper
    let wrapConf = this.createElementConfig({c: "IonHeader", className: "frame-toolbar mobile-toolbar-vertical-container"});
    wrapConf.children.push(this.toolbarConf);
    //
    // Move the configured toolbar into the wrapper and change the pointers
    this.toolbarFirstZoneConf = this.toolbarConf;
    this.toolbarConf = wrapConf;
    //
    // Set the wrapper as the child of the main frame object
    let tIdx = this.mainContainerConf.children.indexOf(this.toolbarFirstZoneConf);
    this.mainContainerConf.children[tIdx] = this.toolbarConf;
    //
    // Create the searchbar
    let wrapToolbarConf = this.createElementConfig({c: "IonToolbar", className: ""});
    this.toolbarConf.children.push(wrapToolbarConf);
    this.toolbarSearchConf = this.createElementConfig({c: "IonSearchbar", className: "toolbar-mobile-search-bar", events: ["onChange"]});
    wrapToolbarConf.children.push(this.toolbarSearchConf);
  }
};


/**
 * Clone data row
 * @param {Integer} index
 * @param {Integer} baseIndex
 */
Client.IdfPanel.prototype.cloneDataRow = function (index, baseIndex)
{
  // Get base row
  let baseRow = this.getRow(baseIndex);
  //
  if (!baseRow)
    return;
  //
  let newRow = baseRow.clone();
  newRow.parent = baseRow.parent;
  newRow.parentWidget = baseRow.parentWidget;

  if (this.reuseRows)
    newRow.getRootObject().style.order = index;
  //
  // Relink objects ids and set parentWidget on cloned elements
  let colIndex = 0;
  let inListFields = this.fields.filter(f => f.isShown() && f.isInList());
  for (let i = 0; i < inListFields.length; i++) {
    let field = inListFields[i];
    let fieldValue = field.getValueByIndex(index);
    let col = newRow.elements[colIndex];
    //
    // Relink row selector
    if (i === 0) {
      fieldValue.rowSelectorId = col.id;
      col.parentWidget = fieldValue;
      colIndex++;
      //
      col = newRow.elements[colIndex];
    }
    //
    // Relink row breaker
    if (field.rowBreakBefore) {
      fieldValue.rowBreakerId = col.id;
      col.parentWidget = fieldValue;
      colIndex++;
      //
      col = newRow.elements[colIndex];
    }
    //
    // Relink group objects
    let goToNextCol = true;
    if (field.group) {
      col.parentWidget = field.group;
      //
      let groupRow = col.elements[0];
      groupRow.parentWidget = field.group;
      //
      let groupFields = field.group.fields.filter(f => f.isShown() && f.isInList());
      let groupFieldIndex = groupFields.findIndex(f => f.id === field.id);
      if (groupFieldIndex !== groupFields.length - 1)
        goToNextCol = false;
      //
      let groupFieldValueCol = groupRow.elements[groupFieldIndex];
      groupFieldValueCol.parentWidget = fieldValue;
      //
      if (!field.group.listContainersConf[index]) {
        field.group.listContainersConf[index] = {id: col.id};
        field.group.listColumnStyles[index] = {...field.group.listColumnsStyles?.[baseIndex]};
      }
      //
      col = groupFieldValueCol;
    }
    //
    // Relink field value objects
    fieldValue.listContainerId = col.id;
    fieldValue.listControlId = col.elements.find(el => el instanceof Client.IdfControl)?.id;
    //
    col.parentWidget = fieldValue;
    //
    if (goToNextCol)
      colIndex++;
  }
  //
  return newRow;
};


/**
 * Create index-th data row configuration
 * @param {Integer} index
 * @param {Integer} baseIndex
 */
Client.IdfPanel.prototype.createDataRowConfig = function (index, baseIndex)
{
  let dataRow = this.getRow(index);
  //
  let isQbeRow = index === 0 && this.canUseRowQbe();
  //
  // If index-th data row does not exists, create new row configuration
  let createSwiper = false;
  let rowConf;
  if (!dataRow) {
    let newRow = this.cloneDataRow(index, baseIndex);
    if (newRow)
      return newRow;
    //
    rowConf = this.createElementConfig({c: "IonRow", className: "panel-list-row", noWrap: true});
    rowConf.style = {};
    //
    if (isQbeRow) {
      rowConf.className += " panel-list-qbe-row";
      //
      // Qbe row position is "sticky" as well as header row.
      // Thus I have to set its top to header height since I want it to be placed under header row
      rowConf.style = {top: (this.getHeaderHeight() * this.numSubRows) + "px"};
    }
    else if (this.hasGroupedRows()) {
      let rowsGroup = this.getRowsGroupByIndex(index);
      if (rowsGroup)
        rowConf.className += " panel-rows-group-header level" + Math.min(rowsGroup.level, 2);
    }
    else
      rowConf.className += " panel-list-data-row";
    //
    rowConf.style.order = index;
    //
    if (this.fixedColumns) {
      rowConf.minWidth = this.rowMinWidth;
      rowConf.style.minWidth = this.rowMinWidth + "px";
    }
    //
    if (this.numSubRows > 1) {
      // We need to create the subrows and the ioncol
      let parCol = this.createElementConfig({c: "IonCol", className: "col-subrow-parent subrow-body", xs: "auto"});
      rowConf.children.push(parCol);
      //
      for (let c = 1; c <= this.numSubRows; c++) {
        let subrow = this.createElementConfig({c: "IonRow", className: "panel-list-row panel-list-subrow", noWrap: true});
        parCol.children.push(subrow);
        //
        if (c > 1) {
          // We need to create the 'fake' rowselectors to fill the row
          let offsetCol = this.getHeaderOffset() ? " offset-col" : "";
          let subrowsel = this.createElementConfig({c: "IonCol", className: "panel-list-col row-selector-col row-selector-subrow" + offsetCol, xs: "auto", visible: this.showRowSelector});
          subrow.children.push(subrowsel);
        }
      }
    }
    //
    if (this.canDelete && Client.mainFrame.idfMobile)
      createSwiper = true;
  }
  //
  let firstInListFieldIndex = this.getFirstInListFieldIndex();
  for (let i = 0; i < this.fields.length; i++) {
    let curDataRow = dataRow;
    let curRowConf = rowConf;
    //
    let field = this.fields[i];
    //
    if (this.numSubRows > 1) {
      if (rowConf)
        curRowConf = rowConf.children[0].children[this.wrapRows[field.id] - 1];
      if (dataRow)
        curDataRow = dataRow.elements[0].elements[this.wrapRows[field.id] - 1];
    }
    //
    // If current field is not inside the list, continue.
    // Otherwise create a value configuration (i.e. a col) and add it to current row configuration
    if (!field.isInList())
      continue;
    //
    let fieldValue = field.getValueByIndex(index);
    //
    // If I have no value yet, continue.
    // This happens when a field is not shown in form mode and panel starts in form mode.
    // In this case server sends just the field without any value (that will be sent as soon as panel switches mode)
    // Also continue if field value exists and it's already rendered
    if (!fieldValue || fieldValue.listContainerId)
      continue;
    //
    let nextSiblingId;
    //
    // If index-th row exists, I have to fill its missing columns (if any). So I have to find the next sibling for column I'm going to create
    if (curDataRow) {
      for (let j = i + 1; j < this.fields.length; j++) {
        let nextField = this.fields[j];
        // If current field is not in list, continue
        if (!nextField.isInList())
          continue;
        //
        // Get index-th value
        let nextValue = nextField.getValueByIndex(index);
        //
        // If value does not exists or it's not rendered yet, continue
        if (!nextValue || !nextValue.listContainerId)
          continue;
        //
        nextSiblingId = nextValue.listContainerId;
        break;
      }
    }
    //
    if (firstInListFieldIndex === i) {
      // The first in list field values have to handle row selectors too
      if (!fieldValue.rowSelectorId) {
        let rowSelectorConf = fieldValue.createRowSelectorConfig();
        if (!curDataRow)
          curRowConf.children.push(rowSelectorConf);
        else
          curDataRow.insertBefore({child: rowSelectorConf, sib: nextSiblingId});
      }
      //
      // The first in list field values have to handle rows group header too
      if (!fieldValue.rowsGroupHeaderId && !isQbeRow) {
        let rowsGroupHeaderConf = fieldValue.createRowsGroupHeaderConfig();
        if (!curDataRow)
          curRowConf.children.push(rowsGroupHeaderConf);
        else
          curDataRow.insertBefore({child: rowsGroupHeaderConf, sib: fieldValue.rowSelectorId});
      }
    }
    //
    let valueCol = null;
    //
    // Create value configuration
    let valueConf = fieldValue.createListConfig();
    //
    // If field belongs to a group, I have to create value container into group container
    if (field.group) {
      let groupConf = field.group.listContainersConf[index];
      if (!groupConf) {
        groupConf = field.group.createListConfig(index);
        if (!curDataRow)
          curRowConf.children.push(groupConf);
        else
          curDataRow.insertBefore({child: groupConf, sib: nextSiblingId});
      }
      //
      if (!curDataRow)
        groupConf.children[0].children.push(valueConf);
      else {
        let groupEl = Client.eleMap[groupConf.id];
        if (!groupEl) {
          groupConf.children[0].children.push(valueConf);
          curDataRow.insertBefore({child: groupConf, sib: nextSiblingId});
        }
        else
          valueCol = groupEl.elements[0].insertBefore({child: valueConf, sib: nextSiblingId});
      }
    }
    else {
      if (!curDataRow)
        curRowConf.children.push(valueConf);
      else
        valueCol = curDataRow.insertBefore({child: valueConf, sib: nextSiblingId});
    }
    //
    // If I created fieldValue column, update fieldValue controls
    if (valueCol)
      fieldValue.updateControls({all: true});
  }
  //
  if (rowConf && createSwiper) {
    // on mobile add the swiper to delete to the list row
    // BUT we need it to be in the last position, otherwise all the searches and indexes are broken
    let swiperConf = this.createElementConfig({c: "SwipeMenu", visible: true, commands: [{n: Client.IdfResources.t("TIP_TITLE_Delete"), v: "DELETE", s: "danger"}], events: ["onSwipeSelected"]});
    rowConf.children.push(swiperConf);
  }
  //
  return rowConf;
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfPanel.prototype.createChildren = function (el)
{
  if (!el.children)
    return;
  //
  // On IDC, fields belonging to a page/group are children of that page/group.
  // On IDF, the page/group and the fields belonging to it are siblings.
  // I want IDC behaves like IDF
  if (!Client.mainFrame.isIDF) {
    [Client.Widget.transXmlNodeMap.ppg, Client.Widget.transXmlNodeMap.grp].forEach(cls => {
      // Get IdfPage/IdfGroup children
      let objects = el.children.filter(obj => obj.c === cls || obj.class === cls);
      //
      for (let i = 0; i < objects.length; i++) {
        let obj = objects[i];
        obj.children = obj.children || [];
        let index = el.children.findIndex(c => c.id === obj.id);
        let sib = obj.sib;
        //
        // Remove fields from pages/groups and push them into panel children array, at page/group's old position.
        // if the group has a sib the fields must take that sib (the sib is a field thing)
        while (obj.children.length > 0) {
          let chg = obj.children.shift();
          if (sib)
            chg.sib = sib;
          el.children.splice(index++, 0, chg);
        }
        delete obj.sib;
        //
        // If i've no child i'll try to memorize the sib, when the first child will be created it will use this value
        if (sib && obj.children.length === 0 && Client.mainFrame.isEditing())
          obj.fsib = sib;
        //
        // I'm a page and i've a sib, that sib should be set on my children, because the sib is a field.
        // BUT also i need to move the page before some other page, in this case i must find the next field, if it has a page i must
        // before that page into the pages array. If the field is not paged i must navigate the array and if another page is present my new sib must become the page sib
        if (cls === Client.Widget.transXmlNodeMap.ppg && sib && Client.mainFrame.isEditing()) {
          let cindex = this.elements.findIndex(c => c.id === sib);
          if (cindex >= 0) {
            let nextpage;
            for (let j = cindex; j < this.elements.length && !nextpage; j++) {
              let c = this.elements[j];
              if (c instanceof Client.IdfPage && c.id !== obj.id)
                nextpage = c.id;
              else if (c.page && c.page.id !== obj.id)
                nextpage = c.page.id;
            }
            if (nextpage)
              obj.sib = nextpage;
          }
        }
        //
        // Since I want pages/groups after fields, remove pages/groups from panel children array and push them again at the end
        obj = el.children.splice(index, 1)[0];
        el.children.push(obj);
      }
    });
  }
  //
  // Get IdfPage children
  let pages = el.children.filter(obj => obj.c === Client.Widget.transXmlNodeMap.ppg || obj.class === Client.Widget.transXmlNodeMap.ppg);
  //
  // Since I want pages to be the last children, remove them from children array and push them again at the end
  for (let i = 0; i < pages.length; i++) {
    let index = el.children.findIndex(obj => obj.id === pages[i].id);
    let page = el.children.splice(index, 1)[0];
    el.children.push(page);
  }
  //
  el.hasPages = !!pages.length;
  //
  this.creatingChildren = true;
  Client.Widget.prototype.createChildren.call(this, el);
  delete this.creatingChildren;
  //
  // Handle sib (next field/element id)
  for (let i = 0; i < el.children.length; i++) {
    let child = el.children[i];
    if (child.sib) {
      let ele = Client.eleMap[child.id];
      //
      // Remove the created element from the array
      let index = this.elements.findIndex(c => c.id === child.id);
      if (index >= 0)
        this.elements.splice(index, 1);
      //
      // Set the element in the correct position
      index = this.elements.findIndex(c => c.id === child.sib);
      if (index >= 0)
        this.elements.splice(index, 0, ele);
      //
      if (ele instanceof Client.IdfField) {
        let index = this.fields.findIndex(c => c.id === child.id);
        if (index >= 0)
          this.fields.splice(index, 1);
        //
        // Set the element in the correct position
        index = this.fields.findIndex(c => c.id === child.sib);
        if (index >= 0)
          this.fields.splice(index, 0, ele);
        else
          this.fields.push(ele);
      }
      //
      if (ele instanceof Client.IdfPage && Client.mainFrame.isEditing()) {
        let index = this.pages.findIndex(c => c.id === child.id);
        if (index >= 0)
          this.pages.splice(index, 1);
        //
        // Set the element in the correct position
        index = this.pages.findIndex(c => c.id === child.sib);
        if (index >= 0)
          this.pages.splice(index, 0, ele);
        //
        try {
          Client.eleMap[this.pagesContainerConf.id].getRootObject().insertBefore(this.pages[index].getRootObject(), this.pages[index + 1].getRootObject());
        }
        catch (ex) {

        }
      }
    }
  }
  //
  if (el.hasPages && Client.mainFrame.isEditing()) {
    // Align the pages indexes and clear the active page
    this.updatePagesFields();
    //
    let activePage = 0;
    this.pages.forEach((p, i) => {
      if (p.isActive)
        activePage = i;
    });
    //
    this.activePage = activePage;
    this.updateActivePage();
  }
  //
  if (el.hasPages)
    this.updateObjects({pagesContainer: true});
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfPanel.prototype.realize = function (widget, parent, view)
{
  Client.IdfFrame.prototype.realize.call(this, widget, parent, view);
  //
  // Before the first updateStructure check if the server sent the structure to use, in that case apply it
  if (widget.formStructure !== undefined) {
    this.formStruct = JSON.parse(widget.formStructure);
    delete widget.formStructure;
    delete this.formStructure;
    delete this.clientGeneratedFormStructure;
  }
  //
  this.updateActivePage();
  this.updateStructure();
  this.initializeListFilters();
  //
  if (this.gridConf && this.hasListLayout()) {
    let grid = Client.eleMap[this.gridConf.id].getRootObject();
    //
    // Define scroll handler
    grid.onscroll = () => this.handleScroll();
    //
    // Define intersection observer
    this.intersectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        let el = Client.Widget.getElementByObj(entry.target);
        let rootBounds = entry.rootBounds;
        let targetBounds = entry.boundingClientRect;
        let isIntersecting = targetBounds.left <= rootBounds.right && targetBounds.right >= rootBounds.left && targetBounds.top <= rootBounds.bottom && targetBounds.bottom >= rootBounds.top;
        //
        this.updateViewportListFields(el?.parentWidget, isIntersecting);
      });
    }, {root: grid});
    //
    this.fields.forEach(f => {
      if (f.isShown() && f.isInList())
        this.intersectionObserver.observe(Client.eleMap[f.listContainerId].getRootObject());
    });
  }
  //
  this.resizeObserver = new ResizeObserver(() => {
    clearTimeout(this.observeTimeout);
    //
    // Wait a little bit before handling resize in order to prevent sending multiple resize event
    this.observeTimeout = setTimeout(() => {
      delete this.observeTimeout;
      Client.mainFrame.sendEvents(this.handleResize());
    }, 100);
  });
  //
  // Observe resize on list and form containers
  let altContainer = Client.eleMap[this.panelContainerConf.id];
  if (this.hasListLayout())
    this.resizeObserver.observe(altContainer.elements[0].getRootObject());
  if (this.hasFormLayout())
    this.resizeObserver.observe(altContainer.elements[1].getRootObject());
};


/**
 * Add given field to fields array
 * @param {IdfField} field
 */
Client.IdfPanel.prototype.addField = function (field)
{
  this.fields.push(field);
  this.newFields.push(field);
};


/**
 * Add given group to groups array
 * @param {IdfGroup} group
 */
Client.IdfPanel.prototype.addGroup = function (group)
{
  this.groups.push(group);
};


/**
 * Add given page to pages array
 * @param {IdfPage} page
 */
Client.IdfPanel.prototype.addPage = function (page)
{
  this.pages.push(page);
};


/**
 * Detach grid, fields and groups dom objects from their old columns.
 * Then destroy and recreate grid structure and finally place grid, fields and groups dom objects to their new columns
 */
Client.IdfPanel.prototype.updateStructure = function ()
{
  this.resetCachedStyles();
  //
  let grid = Client.eleMap[this.gridConf?.id]?.getRootObject();
  let oldScrollTop = grid?.scrollTop;
  let oldScrollLeft = grid?.scrollLeft;
  //
  // Since I'm going to destroy main grid structure, detach grid, groups and out of list fields.
  // They will be placed in the new structure
  this.unplace();
  //
  if (this.hasListLayout()) {
    let listContainer = Client.eleMap[this.listContainerConf.id];
    //
    // Remove old list rows
    this.removeGridRows();
    //
    this.checkWrapRow();
    //
    this.updateListHeaderStructure();
    //
    // Create new list structure
    this.listGridRows = this.createStructure();
    for (let i = 0; i < this.listGridRows.length; i++) {
      let listRow = this.view.createElement(this.listGridRows[i].conf, listContainer, this.view);
      listContainer.elements.push(listRow);
    }
  }
  //
  if (this.hasFormLayout()) {
    let formContainer = Client.eleMap[this.formContainerConf.id];
    //
    // Remove old form rows
    this.removeGridRows(true);
    //
    // Create new form structure
    this.formGridRows = this.createStructure(true);
    for (let i = 0; i < this.formGridRows.length; i++) {
      let formRow = this.view.createElement(this.formGridRows[i].conf, formContainer, this.view);
      formContainer.elements.push(formRow);
    }
  }
  //
  // Place grid, groups and out of list fields in the new structure
  this.place();
  //
  if (grid) {
    grid.scrollTop = oldScrollTop;
    grid.scrollLeft = oldScrollLeft;
  }
};


/**
 * Updates the header structure
 */
Client.IdfPanel.prototype.updateListHeaderStructure = function ()
{
  let headerRowSelCol = Client.eleMap[this.rowSelectorColumnConf.id];
  //
  // If we are not in IDE and we have already handled the multiple rows we can skip this
  // to know if we have already handled the multiple rows we can check the parent of the header rowselector
  if (!Client.mainFrame.isEditing() && (this.numSubRows === 1 || (this.numSubRows > 1 && headerRowSelCol.parent.id !== this.gridHeaderConf.id)))
    return;
  //
  // Remove the Row selector container from the header row (DOM and element)
  let headerRowSelColEl = headerRowSelCol?.getRootObject();
  headerRowSelColEl?.parentNode?.removeChild(headerRowSelColEl);
  //
  let index = headerRowSelCol?.parent?.elements?.findIndex(el => el.id === headerRowSelCol.id);
  if (index >= 0)
    headerRowSelCol.parent.elements.splice(index, 1);
  //
  // Create the new children and structure
  this.gridHeaderConf.children = [];
  this.gridHeaderConf.className = "panel-list-row panel-list-header-row";
  this.gridHeaderConf.noWrap = true;
  if (this.numSubRows > 1) {
    let parCol = this.createElementConfig({c: "IonCol", className: "col-subrow-parent col-header", xs: "auto"});
    this.gridHeaderConf.children.push(parCol);
    //
    for (let c = 1; c <= this.numSubRows; c++) {
      let subrow = this.createElementConfig({c: "IonRow", className: "panel-list-row panel-list-header-row panel-list-header-subrow", noWrap: true});
      parCol.children.push(subrow);
      //
      if (c > 1) {
        // We need to create the 'fake' rowselectors to fill the row
        let offsetCol = this.getHeaderOffset() ? " offset-col" : "";
        let subrowsel = this.createElementConfig({c: "IonCol", className: "panel-list-col row-selector-col panel-subrow-rowselector" + offsetCol, xs: "auto", visible: headerRowSelCol.visible});
        subrow.children.push(subrowsel);
      }
    }
  }
  // Empty the header row, removing all its children and subrows (actual field headers are removed by the unplce - done before)
  let headerRow = Client.eleMap[this.gridHeaderConf.id];
  headerRow.close(true);
  index = headerRow?.parent?.elements?.findIndex(el => el.id === headerRow.id);
  if (index >= 0)
    headerRow.parent.elements.splice(index, 1);
  //
  // Recreate the header row in the correct position
  let grid = Client.eleMap[this.gridConf.id];
  grid.insertBefore({child: this.gridHeaderConf, sib: this.qbeRowConf ? this.qbeRowConf.id : this.windowScrollerConf.id});
  //
  // Restore the rowselector in the correct parent
  let rowselParent;
  if (this.numSubRows > 1)
    rowselParent = Client.eleMap[this.gridHeaderConf.children[0].children[0].id];
  else
    rowselParent = Client.eleMap[this.gridHeaderConf.id];
  rowselParent.appendChildObject(undefined, headerRowSelColEl);
  rowselParent.elements.push(headerRowSelCol);
  headerRowSelCol.parent = rowselParent;
};


/**
 * Remove form/list grid rows
 * @param {Boolean} form
 */
Client.IdfPanel.prototype.removeGridRows = function (form)
{
  let rows = form ? this.formGridRows : this.listGridRows;
  let rowsContainer = form ? Client.eleMap[this.formContainerConf.id] : Client.eleMap[this.listContainerConf.id];
  //
  for (let i = 0; i < rows.length; i++) {
    rowsContainer.removeChild(rows[i].conf);
    rows.splice(i--, 1);
  }
};


/**
 * Append grid, fields and groups dom objects to their own columns
 */
Client.IdfPanel.prototype.place = function ()
{
  // Get grid parent column
  let parentColumn = this.getListFieldColumn(this.id);
  //
  if (this.hasListLayout() && parentColumn) {
    this.gridColConf = parentColumn.conf;
    //
    // Set its className
    this.gridColConf.className = "panel-list-grid-col";
    //
    let gridCol = Client.eleMap[this.gridColConf.id];
    let grid = Client.eleMap[this.extGridConf.id];
    //
    gridCol.appendChildObject(undefined, grid.getRootObject());
    gridCol.elements.push(grid);
    grid.parent = gridCol;
  }
  //
  for (let i = 0; i < this.fields.length; i++)
    this.fields[i].place();
  //
  for (let i = 0; i < this.groups.length; i++)
    this.groups[i].place();
};


/**
 * Remove grid, fields and groups dom objects from their parent columns
 */
Client.IdfPanel.prototype.unplace = function ()
{
  if (this.hasListLayout()) {
    let grid = Client.eleMap[this.extGridConf.id];
    for (let i = 0; i < grid.parent.elements.length; i++) {
      if (grid.parent.elements[i].id === grid.id) {
        grid.parent.elements.splice(i, 1);
        grid.getRootObject().remove();
        break;
      }
    }
  }
  //
  for (let i = 0; i < this.groups.length; i++)
    this.groups[i].unplace();
  //
  for (let i = 0; i < this.fields.length; i++)
    this.fields[i].unplace();
};


/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfPanel.prototype.updateElement = function (props)
{
  this.lastActiveRowIndex = this.getActiveRowIndex();
  //
  let objectsToUpdate = {};
  //
  props = props || {};
  //
  if (props.data && props.dataBlockStart === undefined && props.dataBlockEnd === undefined)
    delete props.data;
  //
  // While scrolling, ignore the actualPosition updates from the server
  if (this.scrollingTo && "actualPosition" in props && "actualRow" in props && props.actualPosition + props.actualRow === this.getActiveRowIndex(true)) {
    if (this.scrollingTo === props.actualPosition)
      delete this.scrollingTo;
    delete props.actualPosition;
    delete props.actualRow;
  }
  //
  // If server sends totalRows, update toolbar in order to show/hide "No data" container
  if (props.totalRows !== undefined || props.layout !== undefined) {
    this.noDataLoaded = (props.totalRows ?? this.totalRows) === 0;
    objectsToUpdate.toolbar = true;
  }
  //
  // Skip widget applyVisualStyle otherwise I would execute it twice if visualStyle property is changed
  props.skipWidgetApplyVisualStyle = true;
  //
  Client.IdfFrame.prototype.updateElement.call(this, props);
  //
  delete props.skipWidgetApplyVisualStyle;
  //
  // Since visualStyle property is handled by widget, it tells me if I have to apply visual style.
  // Also IdfFrame can tell me to apply visual style
  objectsToUpdate.visualStyle = props.applyVisualStyle;
  delete props.applyVisualStyle;
  //
  if (props.calcLayout) {
    delete props.calcLayout;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.updateToolbar) {
    delete props.updateToolbar;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.updateStructure) {
    delete props.updateStructure;
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.totalRows !== undefined) {
    this.totalRows = props.totalRows;
    objectsToUpdate.toolbar = true;
    objectsToUpdate.multiSel = true;
    objectsToUpdate.bufferVideo = true;
  }
  //
  if (props.moreRows !== undefined) {
    this.moreRows = props.moreRows;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.activePage !== undefined) {
    this.activePage = props.activePage;
    objectsToUpdate.activePage = true;
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.headerHeight !== undefined) {
    this.headerHeight = props.headerHeight;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.rowHeightResize !== undefined) {
    this.rowHeightResize = props.rowHeightResize;
    objectsToUpdate.calcLayout = true;
    //
    this.fields.forEach(f => f.updateControls({rowHeightResize: true}));
  }
  //
  if (props.dataBlockStart !== undefined)
    this.dataBlockStart = props.dataBlockStart;
  //
  if (props.dataBlockEnd !== undefined)
    this.dataBlockEnd = props.dataBlockEnd;
  //
  if (props.canResizeColumn !== undefined)
    this.canResizeColumn = props.canResizeColumn;
  if (props.canReorderColumn !== undefined)
    this.canReorderColumn = props.canReorderColumn;
  //
  if (props.groupedRows !== undefined || props.showGroups) {
    this.groupedRows = true;
    objectsToUpdate.groupedRows = true;
    objectsToUpdate.bufferVideo = true;
  }
  //
  if (props.data !== undefined) {
    this.data = props.data;
    objectsToUpdate.data = true;
    objectsToUpdate.bufferVideo = true;
    objectsToUpdate.calcLayout = true;
    objectsToUpdate.multiSel = true;
    objectsToUpdate.toolbar = true;
    objectsToUpdate.visualStyle = true;
    objectsToUpdate.activeRow = true;
    objectsToUpdate.skipScroll = true;
  }
  //
  let checkActiveRow;
  if (props.actualRow !== undefined && (props.actualRow !== this.actualRow || this.realizing)) {
    this.actualRow = props.actualRow;
    checkActiveRow = true;
  }
  //
  if (props.actualPosition !== undefined && (props.actualPosition !== this.actualPosition || this.realizing)) {
    // Update scroll up since no one will do that when actualPosition comes from server
    this.scrollUp = this.actualPosition > props.actualPosition;
    this.actualPosition = props.actualPosition;
    checkActiveRow = true;
  }
  //
  if (checkActiveRow) {
    if (this.hasGroupedRows() && !props.fromClient) {
      this.groupedActualPosition = this.getGroupedActualPosition();
      this.groupedActualRow = this.getGroupedActualRow();
    }
    //
    let activeRowChanged = (this.lastActiveRowIndex !== this.getActiveRowIndex() || this.realizing);
    objectsToUpdate.activeRow = true;
    objectsToUpdate.calcLayout = objectsToUpdate.calcLayout || activeRowChanged;
    objectsToUpdate.toolbar = objectsToUpdate.toolbar || activeRowChanged;
    objectsToUpdate.bufferVideo = true;
    objectsToUpdate.scrollbar = ("actualPosition" in props);
    objectsToUpdate.skipScroll = false;
    if (this.lastFocusedFieldValueInList?.index > 0)
      this.lastFocusedFieldValueInList = this.lastFocusedFieldValueInList?.parentField.getValueByIndex(this.getActiveRowIndex());
  }
  //
  if (props.skipScroll)
    objectsToUpdate.skipScroll = true;
  //
  if (props.showRowSelector !== undefined) {
    this.showRowSelector = props.showRowSelector;
    objectsToUpdate.rowSelectors = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  let multiSelButton = Client.eleMap[this.multiSelButtonConf?.id];
  if (props.showMultipleSelection !== undefined) {
    this.showMultipleSelection = props.showMultipleSelection;
    objectsToUpdate.multiSel = true;
    objectsToUpdate.statusbar = true;
    objectsToUpdate.className = true;
    //
    Client.Widget.updateObject(multiSelButton, {tooltip: this.getTooltip(this.multiSelButtonConf?.id)});
  }
  //
  if (props.enableMultipleSelection !== undefined) {
    this.enableMultipleSelection = props.enableMultipleSelection;
    //
    Client.Widget.updateObject(multiSelButton, {visible: this.enableMultipleSelection});
  }
  //
  if (props.selectOnlyVisibleRows !== undefined)
    this.selectOnlyVisibleRows = props.selectOnlyVisibleRows;
  //
  if (props.gridHeight !== undefined) {
    this.gridHeight = isNaN(props.gridHeight) ? undefined : props.gridHeight;
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.gridLeft !== undefined) {
    this.gridLeft = isNaN(props.gridLeft) ? undefined : props.gridLeft;
    this.orgGridLeft = this.gridLeft;
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.gridTop !== undefined) {
    this.gridTop = isNaN(props.gridTop) ? undefined : props.gridTop;
    this.orgGridTop = this.gridTop;
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.resizeWidth !== undefined) {
    this.resizeWidth = props.resizeWidth;
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.resizeHeight !== undefined) {
    this.resizeHeight = props.resizeHeight;
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  if (props.fixedColumns !== undefined) {
    this.fixedColumns = props.fixedColumns;
    objectsToUpdate.fixedColumns = true;
  }
  //
  if (props.hasList !== undefined) {
    this.hasList = props.hasList;
    objectsToUpdate.toolbar = true;
    objectsToUpdate.qbeRow = true;
    //
    if (!this.hasList && Client.mainFrame.isEditing())
      props.layout = Client.IdfPanel.layouts.form;
  }
  //
  if (props.hasForm !== undefined) {
    this.hasForm = props.hasForm;
    objectsToUpdate.toolbar = true;
    //
    if (!this.hasForm && Client.mainFrame.isEditing())
      props.layout = Client.IdfPanel.layouts.list;
  }
  //
  if (props.layout !== undefined && (props.layout !== this.layout || this.realizing)) {
    this.layout = props.layout;
    //
    objectsToUpdate.layout = true;
    objectsToUpdate.toolbar = true;
    objectsToUpdate.className = true;
    objectsToUpdate.visualStyle = true;
    objectsToUpdate.activeRow = true;
  }
  //
  // In bootstrap theme (IDF), server sends numRows = 1 when panel changes layout to FORM.
  // Since numRows is a LIST specific property, ignore it if current layout is FORM
  if (props.numRows !== undefined && (props.numRows !== 1 || this.layout === Client.IdfPanel.layouts.list))
    this.numRows = props.numRows;
  //
  if (props.status !== undefined) {
    this.status = props.status;
    objectsToUpdate.toolbar = true;
    objectsToUpdate.visualStyle = true;
    //
    this.adjustScrollbar();
    //
    // Tell my children that status is changed
    for (let i = 0; i < this.fields.length; i++)
      this.fields[i].onPanelStatusChange();
  }
  //
  if (props.canUpdate !== undefined) {
    this.canUpdate = props.canUpdate;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.canDelete !== undefined) {
    this.canDelete = props.canDelete;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.canInsert !== undefined) {
    this.canInsert = props.canInsert;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.canSearch !== undefined) {
    this.canSearch = props.canSearch;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.canSort !== undefined) {
    this.canSort = props.canSort;
    objectsToUpdate.toolbar = true;
    objectsToUpdate.qbeRow = true;
  }
  //
  if (props.canGroup !== undefined) {
    this.canGroup = props.canGroup;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.showGroups !== undefined) {
    this.showGroups = props.showGroups;
    objectsToUpdate.toolbar = true;
    //
    if (this.showGroups) {
      this.groupedActualPosition = this.getGroupedActualPosition();
      this.groupedActualRow = this.getGroupedActualRow();
    }
  }
  //
  if (props.enableInsertWhenLocked !== undefined) {
    this.enableInsertWhenLocked = props.enableInsertWhenLocked;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.qbeTip !== undefined) {
    this.qbeTip = props.qbeTip;
    //
    this.qbeTip = this.qbeTip.replace(/QBEF1/g, "qbe-field");
    this.qbeTip = this.qbeTip.replace(/QBEF2/g, "qbe-value");
    //
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.automaticLayout !== undefined) {
    this.automaticLayout = props.automaticLayout;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.searchMode !== undefined) {
    this.searchMode = props.searchMode;
    objectsToUpdate.toolbar = true;
    objectsToUpdate.qbeRow = true;
  }
  //
  if (props.isDO !== undefined) {
    this.isDO = props.isDO;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.hasDocTemplate !== undefined) {
    this.hasDocTemplate = props.hasDocTemplate;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.DOModified !== undefined) {
    this.DOModified = props.DOModified;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.DOMaster !== undefined) {
    this.DOMaster = props.DOMaster;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.DOCanSave !== undefined) {
    this.DOCanSave = props.DOCanSave;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.DOSingleDoc !== undefined) {
    this.DOSingleDoc = props.DOSingleDoc;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.pullToRefresh !== undefined) {
    this.pullToRefresh = props.pullToRefresh;
    //
    if (this.hasListLayout()) {
      let el = Client.eleMap[this.extGridListConf.id];
      //
      // Nasty bug of the refresher: is activated when set !== undefined, so true or false will activate it...
      // The scrolling element is INSIDE the list, not outside as the standard layout of Ionic
      if (this.pullToRefresh && (Client.mainFrame.device.isMobile || Client.mainFrame.idfMobile || Client.mainFrame.device.isMobilePreview)) {
        el.swipingElement = Client.eleMap[this.gridConf.id].domObj;
        el.updateElement({refresher: true});
      }
    }
  }
  //
  if (props.searchInContent !== undefined) {
    this.searchInContent = props.searchInContent;
    //
    objectsToUpdate.toolbar = true;
    objectsToUpdate.qbeRow = true;
  }
  //
  if (props.advancedTabOrder !== undefined)
    this.advancedTabOrder = props.advancedTabOrder;
  //
  if (props.hasPages !== undefined)
    objectsToUpdate.pagesContainer = true;
  //
  // "visualFlags" property exists just on IDF. Thus, transform variation on visualFlags into variations on each single property
  if (props.visualFlags !== undefined) {
    this.visualFlags = props.visualFlags;
    //
    props.hidePages = (this.visualFlags & 0x4000) !== 0;
  }
  //
  if (props.hidePages !== undefined) {
    this.hidePages = props.hidePages;
    objectsToUpdate.pagesContainer = true;
  }
  //
  if (props.tooltipOnEachRow !== undefined)
    this.tooltipOnEachRow = props.tooltipOnEachRow;
  //
  if (props.formStructure !== undefined) {
    this.formStruct = JSON.parse(props.formStructure);
    delete props.formStructure;
    delete this.formStructure;
    delete this.clientGeneratedFormStructure;
    delete this.fieldsFormOrder;
    //
    objectsToUpdate.structure = true;
    objectsToUpdate.calcLayout = true;
  }
  //
  // Sent by App.IdfPanel
  if (props.rowError !== undefined)
    this.fields.forEach(f => f.setRowError(props.rowError));
  //
  if (props.headerStyle !== undefined)
    this.applyStyleProp([Client.eleMap[this.toolbarConf.id]], "headerStyle", props.headerStyle);
  if (props.contentStyle !== undefined)
    this.applyStyleProp([Client.eleMap[this.panelContainerConf.id]], "contentStyle", props.contentStyle);
  //
  if (props.toolbarEventDef !== undefined)
    this.toolbarEventDef = props.toolbarEventDef;
  //
  if (props.scrollEventDef !== undefined)
    this.scrollEventDef = props.scrollEventDef;
  //
  if (props.rowSelectEventDef !== undefined)
    this.rowSelectEventDef = props.rowSelectEventDef;
  //
  if (props.pageClickEventDef !== undefined)
    this.pageClickEventDef = props.pageClickEventDef;
  //
  if (props.multiSelEventDef !== undefined)
    this.multiSelEventDef = props.multiSelEventDef;
  //
  if (props.focusEventDef !== undefined)
    this.focusEventDef = props.focusEventDef;
  //
  if (props.selectionChangeEventDef !== undefined)
    this.selectionChangeEventDef = props.selectionChangeEventDef;
  //
  if (props.enabledCommands) {
    this.enabledCommands = props.enabledCommands;
    objectsToUpdate.toolbar = true;
  }
  //
  if (props.extEnabledCommands) {
    this.extEnabledCommands = props.extEnabledCommands;
    objectsToUpdate.toolbar = true;
  }
  //
  // If there's something to update, do it now
  if (Object.keys(objectsToUpdate).length)
    this.updateObjects(objectsToUpdate);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfPanel.prototype.onEvent = function (event)
{
  let events = Client.IdfFrame.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      switch (event.obj) {
        case this.multiSelButtonConf?.id: // If user clicks on multiple selection button
          events.push(...this.handleMultiSelClick(event));
          break;

        case this.lockButtonConf.id: // If user clicks on lock button
        case this.formListButtonConf.id: // If user clicks on form/list button
        case this.formListAutoButtonConf.id: // If user clicks on form/list button (in case of automatic layout on IDC)
        case this.topButtonConf.id:
        case this.prevButtonConf.id:
        case this.nextButtonConf.id:
        case this.bottomButtonConf.id: // If user clicks on a navigation button
        case this.saveButtonConf.id: // If user clicks on save button
        case this.cancelButtonConf.id: // If user clicks on cancel button
        case this.refreshButtonConf.id: // If user clicks on refresh button
        case this.insertButtonConf.id: // If user clicks on insert button
        case this.deleteButtonConf.id: // If user clicks on delete button
        case this.searchButtonConf.id: // If user clicks on search button
        case this.findButtonConf.id: // If user clicks on find button
        case this.duplicateButtonConf.id: // If user clicks on duplicate button
        case this.csvButtonConf.id: // If user clicks on export button
        case this.printButtonConf.id: // If user clicks on print button
        case this.attachButtonConf.id: // If user clicks on attach button
        case this.groupButtonConf.id: // If user clicks on group button
        case this.multipleMobileButtonConf.id: // If the user clicks on the mobile selection button
          events.push(...this.handleToolbarClick(event));
          break;

        default:
          // Otherwise check if user clicks on a custom button
          for (let i = 0; i < this.customButtonsConf.length; i++) {
            let customButtonId = this.customButtonsConf[i].id;
            if (event.obj === customButtonId) {
              events.push(...this.handleToolbarClick(event));
              break;
            }
          }
          break;
      }
      break;

    case "onRefresh":
      let el = Client.eleMap[this.extGridListConf.id];
      el.refreshCompleted();
      //
      event.obj = this.refreshButtonConf.id;
      events.push(...this.handleToolbarClick(event));
      break;

    case "onKey":
      events.push(...this.handleFunctionKeys(event));
      if (!Client.mainFrame.isIDF) {
        let e = Object.assign({}, event);
        e.obj = this.id;
        events.push(e);
      }
      break;

    case "onFocusin":
      // If the panel has been focused but not a field,
      // I call focus to restore focus to the field that was focused
      let element = Client.Widget.getElementByObj(event.content?.srcEvent?.target);
      if (element?.className?.includes("row-selector")) {
        let rowIndex = element.parentWidget?.getIndex(true);
        this.focusRow(rowIndex);
      }
      else {
        let field = Client.Widget.getWidgetByElement(element)?.getParentWidgetByClass(Client.IdfField);
        if (!field)
          this.focus({skipScroll: true});
      }
      break;

    case "onChange":
      if (this.toolbarSearchConf && event.obj === this.toolbarSearchConf.id) {
        let search = Client.eleMap[this.toolbarSearchConf.id];
        let value = search.inputObj.value;
        //
        events.push({
          id: "srcbox",
          def: Client.IdfMessagesPump.eventTypes.ACTIVE,
          content: {
            oid: this.id,
            obn: value
          }
        });
        //
        search.inputObj.blur();
      }
      break;

    case "onSwipeSelected":
      if (event.content === "DELETE") {
        // Delete the row, but wich row?
        let swiper = Client.eleMap[event.obj];
        let rowIndex = swiper.parent.elements[1]?.parentWidget?.getIndex(true);
        //
        // Change row and the delete the row
        if (rowIndex) {
          events.push(...this.handleRowChange(rowIndex, false));
          event.obj = this.deleteButtonConf.id;
          events.push(...this.handleToolbarClick(event));
        }
      }
      break;
  }
  //
  return events;
};


/**
 * Update objects
 * @param {Object} objectsToUpdate
 */
Client.IdfPanel.prototype.updateObjects = function (objectsToUpdate)
{
  let activeRowIndex = this.getActiveRowIndex();
  //
  if (objectsToUpdate.activePage)
    this.updateActivePage();
  //
  // In order to update panel structure I have to:
  // 1) detach grid, fields and groups dom objects from their old columns
  // 2) destroy and recreate structure (rows and columns)
  // 3) place grid, fields and groups dom objects to their new columns
  // 4) calculate layout
  if (objectsToUpdate.structure && !this.realizing)
    this.updateStructure();
  //
  if (objectsToUpdate.qbeRow) {
    if (this.canUseRowQbe())
      this.attachRow(0);
    else
      this.resetCache({from: 0, to: 0, skipBufferVideo: true});
  }
  //
  if (objectsToUpdate.groupedRows)
    this.updateGroupedRows();
  //
  // If I have to update row selectors visibility, do it now
  if (objectsToUpdate.rowSelectors)
    this.updateRowSelectorsVisibility();
  //
  if (objectsToUpdate.layout)
    this.updateLayout();
  //
  // If I have to fill buffer video, do it now
  if (objectsToUpdate.bufferVideo)
    this.fillBufferVideo();
  //
  // If I have to set active row, do it now
  if (objectsToUpdate.activeRow)
    this.setActiveRow(objectsToUpdate.skipScroll);
  //
  // If I have to scroll to actual position, do it now
  if (objectsToUpdate.scrollbar && !objectsToUpdate.skipScroll)
    this.scrollToDataRow(this.actualPosition, true);
  //
  // If I have to calculate layout, do it now
  if (objectsToUpdate.calcLayout || objectsToUpdate.fixedColumns) {
    let index = objectsToUpdate.activeRow && !objectsToUpdate.data && !objectsToUpdate.fixedColumns ? activeRowIndex : undefined;
    this.calcLayout(index);
    //
    if (this.canUseRowQbe())
      this.calcLayout(0);
  }
  //
  // If I have to update toolbar, do it now
  if (objectsToUpdate.toolbar)
    this.updateToolbar();
  //
  // If I have to update className, do it now
  if (objectsToUpdate.className)
    this.updateClassName();
  //
  // If I have to apply visual style, do it now
  if (objectsToUpdate.visualStyle)
    this.applyVisualStyle();
  //
  // If I have to update multiple selection checkboxes visibility, do it now
  if (objectsToUpdate.multiSel) {
    let firstField = this.getFirstInListField();
    //
    if (firstField) {
      firstField.updateMultiSelVisibility(this.showMultipleSelection);
      //
      if (this.showMultipleSelection) {
        let totalRows = this.getTotalRows();
        for (let i = 1; i <= totalRows; i++)
          firstField.selectRow(this.multiSelStatus[i], i);
      }
    }
  }
  //
  // If I have to update statusbar, do it now
  if (objectsToUpdate.statusbar)
    this.updateStatusbar();
  //
  if (objectsToUpdate.data) {
    delete this.data;
    delete this.dataBlockStart;
    delete this.dataBlockEnd;
  }
  //
  // If I have to update pages container, do it now
  if (objectsToUpdate.pagesContainer) {
    let vis = !!this.pages.length && !this.hidePages;
    Client.Widget.updateObject(Client.eleMap[this.pagesContainerConf.id], {visible: vis, className: "panel-pages-container" + (vis ? " pages-visible" : "")});
  }
};


/**
 * Set active row
 * @param {Boolean} skipScroll
 */
Client.IdfPanel.prototype.setActiveRow = function (skipScroll)
{
  let index = this.getActiveRowIndex();
  //
  // Assign shared out list value container and form value container to index-th value. Now it is the temporary owner
  for (let i = 0; i < this.fields.length; i++) {
    let field = this.fields[i];
    field.assignControls(index);
    field.writeValue(index, true);
    //
    field.applyVisualStyle(this.lastActiveRowIndex);
    field.applyVisualStyle(index);
  }
  //
  // When user selects a row by clicking on it, skip scroll because that row is already visibile.
  // Instead, if this is not a row click, show row scrolling grid container (if I'm in list mode)
  if (!skipScroll && (this.layout === Client.IdfPanel.layouts.list || (this.isNewRow(index) && this.automaticLayout)))
    this.scrollToDataRow(index);
  else
    this.focus({ifJustFocused: true});
  //
  // If the screen still doesn't have any focused widget, I give it to myself
  if (!this.realizing && (!Client.Element.lastFocusedElement?.parentWidget || !Client.Utils.isMyParentEl(Client.Element.lastFocusedElement, this.view)))
    this.focus();
};


/**
 * Handle click on data row (called by IdfFieldValue)
 * @param {Object} event
 * @param {IdfFieldValue} fieldValue
 */
Client.IdfPanel.prototype.handleDataRowClick = function (event, fieldValue)
{
  let events = [];
  //
  if (this.status === Client.IdfPanel.statuses.qbe)
    return events;
  //
  if (!fieldValue.parentField.isInList() || this.layout === Client.IdfPanel.layouts.form)
    return events;
  //
  let rowSelector = event && event.obj === fieldValue.rowSelectorId;
  //
  if (fieldValue.isRowQbe) {
    this.lastFocusedFieldValueInList = fieldValue;
    if (rowSelector) {
      if (Client.mainFrame.isIDF) {
        events.push({
          id: "qbeclall",
          def: Client.IdfMessagesPump.eventTypes.URGENT,
          content: {
            oid: this.id
          }
        });
      }
      else
        this.fields.forEach(f => events.push(...f.handleQbeFilter({content: {name: "value", value: ""}})));
    }
  }
  else {
    // Tell server that selected row is changed
    let isDoubleClick = event?.id === "onDblclick";
    let isRowSelectorClick = rowSelector || isDoubleClick;
    events.push(...this.handleRowChange(fieldValue.index, isRowSelectorClick));
    //
    // In case of mobile, if panel has form and automatic layout, change mode on data row click
    let isMobile = Client.mainFrame.device.isMobile || Client.mainFrame.idfMobile || Client.mainFrame.device.isMobilePreview;
    //
    // If there is automatic layout, switch to form on mobile or on double click if I'm locked (only IDC)
    if (!this.showMultipleSelection && this.automaticLayout && this.hasForm && (isMobile || (!Client.mainFrame.isIDF && isDoubleClick && this.locked)))
      events.push(...this.onEvent({
        id: "onClick",
        obj: this.formListButtonConf.id,
        content: {
          offsetX: 0,
          offsetY: 0
        }
      }));
  }
  //
  return events;
};


/**
 * Handle click on multiple selection button
 * @param {Object} event
 */
Client.IdfPanel.prototype.handleMultiSelClick = function (event)
{
  let events = [];
  //
  let obn;
  //
  // If I'm not showing multiple selection, tell server to toggle it
  if (!this.showMultipleSelection)
    obn = "seltog";
  else {
    // Get eventual popup box result
    obn = event.content.res;
    //
    // If popup box returned an unexpected value, return no events
    if (event.id === "popupCallback" && !["selnone", "selreverse", "selall", "seltog"].includes(obn))
      return events;
  }
  //
  // If I have an obn to send to server, send it
  if (obn) {
    if (Client.mainFrame.isIDF) {
      events.push({
        id: "pantb",
        def: this.toolbarEventDef,
        content: {
          oid: this.id,
          obn
        }
      });
    }
    else {
      if (obn === "seltog") {
        events.push({
          id: "chgProp",
          obj: this.id,
          content: {
            name: "showMultipleSelection",
            value: !this.showMultipleSelection,
            clid: Client.id
          }
        });
      }
      else
        events.push({
          id: "fireOnSelectionChanging",
          obj: this.id,
          content: {
            action: ["selnone", "selreverse", "selall"].indexOf(obn)
          }
        });
    }
    //
    // If I'm on IDF, do operation just if toolbar events have to be handled client side too
    let isClientSide;
    if (Client.mainFrame.isIDF)
      isClientSide = Client.IdfMessagesPump.isClientSideEvent(this.toolbarEventDef);
    else
      isClientSide = !this.events.includes(obn === "seltog" ? "onMultipleSelectionShowing" : "onSelectionChanging");
    //
    if (isClientSide) {
      switch (obn) {
        case "selnone":
          this.updateMultiSel();
          break;

        case "selall":
          this.updateMultiSel({value: true});
          break;

        case "seltog":
          this.updateElement({showMultipleSelection: !this.showMultipleSelection});
          break;
      }
    }
  }
  else { // Otherwise open popup with three options: select all, unselect all, show row selectors
    let items = [];
    if (this.status !== Client.IdfPanel.statuses.qbe) {
      let selectedRows = this.getSelectedDataRows();
      //
      let totalRows = this.getTotalRows(true);
      let showSelAll = Client.mainFrame.isIDF || selectedRows !== totalRows;
      let showSelNone = Client.mainFrame.isIDF || selectedRows !== 0;
      let showSelReverse = !Client.mainFrame.isIDF && selectedRows > 0 && selectedRows < totalRows;
      //
      if (showSelAll)
        items.push({id: "selall", title: Client.IdfResources.t("TIP_TITLE_SelectAll"), icon: "checkbox"});
      //
      if (showSelNone)
        items.push({id: "selnone", title: Client.IdfResources.t("TIP_TITLE_UnselectAll"), icon: "square-outline"});
      //
      if (showSelReverse)
        items.push({id: "selreverse", title: Client.IdfResources.t("TIP_TITLE_ReverseSelection"), icon: "repeat"});
    }
    //
    items.push({id: "seltog", title: Client.IdfResources.t("TIP_TITLE_HideMultiSel"), icon: "arrow-round-forward"});
    //
    let buttonRects = Client.eleMap[this.multiSelButtonConf.id].getRootObject().getBoundingClientRect();
    let rect = {left: buttonRects.left + "px", top: buttonRects.bottom + "px"};
    //
    Client.mainFrame.popup({
      options: {
        type: "menu",
        style: "menu-popup multisel-popup",
        rect,
        items,
        callback: res => {
          Client.mainFrame.sendEvents(this.handleMultiSelClick({id: "popupCallback", content: {res}}));
          this.focus();
        }
      }
    });
  }
  //
  return events;
};


/**
 * Handle click on toolbar button
 * @param {Object} event
 */
Client.IdfPanel.prototype.handleToolbarClick = function (event)
{
  let updateProps = {};
  let updateMultiSel;
  //
  let totalRows = this.getTotalRows(true);
  //
  // Count selected row if multiple selection is active
  let selectedRows = this.showMultipleSelection ? this.getSelectedDataRows() : 0;
  //
  let type = Client.Widget.msgTypes.CONFIRM;
  let msg, buttons;
  let commandName, commandValue, delta, numRows = this.getNumRows();
  let isClientSide = !this.events.includes("onCommand");
  switch (event.obj) {
    case this.lockButtonConf.id:
      commandName = this.locked ? "unlock" : "lock";
      updateProps.locked = !this.locked;
      isClientSide = isClientSide && !this.events.includes("onLockingChanging");
      break;

    case this.formListButtonConf.id:
    case this.formListAutoButtonConf.id:
      // With automaticLayout disable double-click to change layout from list
      if (event.obj === this.formListAutoButtonConf.id && !this.locked && this.automaticLayout && this.layout === Client.IdfPanel.layouts.list)
        return [];
      //
      commandName = "list";
      commandValue = Client.IdfPanel.commands.CMD_FORMLIST;
      //
      // Change mode just if toolbar events have to be handled client side too
      updateProps.layout = this.layout === Client.IdfPanel.layouts.list ? Client.IdfPanel.layouts.form : Client.IdfPanel.layouts.list;
      if (updateProps.layout === Client.IdfPanel.layouts.list)
        updateProps.actualPosition = this.actualPosition;
      //
      isClientSide = isClientSide && !this.events.includes("onLayoutChanging");
      break;

    case this.saveButtonConf.id:
      commandName = "save";
      commandValue = Client.IdfPanel.commands.CMD_SAVE;
      break;

    case this.cancelButtonConf.id:
      commandName = "cancel";
      commandValue = Client.IdfPanel.commands.CMD_CANCEL;
      break;

    case this.refreshButtonConf.id:
      commandName = "refresh";
      commandValue = Client.IdfPanel.commands.CMD_REFRESH;
      break;

    case this.insertButtonConf.id:
      commandName = "insert";
      commandValue = Client.IdfPanel.commands.CMD_INSERT;
      //
      isClientSide = isClientSide && !this.events.includes("onLockingChanging");
      if (this.locked)
        updateProps.locked = false;
      //
      this.scrollUp = false;
      break;

    case this.deleteButtonConf.id:
      commandName = "delete";
      commandValue = Client.IdfPanel.commands.CMD_DELETE;
      //
      // If multiple selection is enabled, remember I have to update it after delete
      updateMultiSel = this.showMultipleSelection;
      //
      if (this.confirmDelete) {
        this.hiliteDelete(true);
        //
        // Prepare buttons
        buttons = [
          {text: Client.IdfResources.t("MSG_POPUP_DeleteButton"), destructive: true},
          {text: Client.IdfResources.t("MSG_POPUP_NoButton")}
        ];
        //
        // Calculate message to show
        if (!this.showMultipleSelection)
          msg = Client.IdfResources.t("PAN_MSG_ConfirmDeleteRS", [this.caption]);
        else {
          if (selectedRows === 0) {
            type = Client.Widget.msgTypes.ALERT;
            msg = Client.IdfResources.t("PAN_MSG_ConfirmDeleteNR", [this.caption]);
            //
            // In this case I want to use default buttons, so delete the custom ones
            buttons = undefined;
          }
          else if (selectedRows === 1)
            msg = Client.IdfResources.t("PAN_MSG_ConfirmDeleteRS", [this.caption]);
          else if (selectedRows < totalRows)
            msg = Client.IdfResources.t("PAN_MSG_ConfirmDeleteRR", [this.caption, selectedRows]);
          else
            msg = Client.IdfResources.t("PAN_MSG_ConfirmDeleteAR", [this.caption]);
        }
      }
      break;

    case this.searchButtonConf.id:
      commandName = "search";
      commandValue = Client.IdfPanel.commands.CMD_SEARCH;
      //
      isClientSide = isClientSide && !this.events.includes("onLayoutChanging");
      if (this.automaticLayout)
        updateProps.layout = Client.IdfPanel.layouts.form;
      break;

    case this.findButtonConf.id:
      commandName = "find";
      commandValue = Client.IdfPanel.commands.CMD_FIND;
      break;

    case this.duplicateButtonConf.id:
      commandName = "dupl";
      commandValue = Client.IdfPanel.commands.CMD_DUPLICATE;
      //
      // If multiple selection is active but there are no selected rows, ask user for confirmation about duplicate
      if (this.showMultipleSelection && !selectedRows)
        msg = Client.IdfResources.t("PAN_MSG_ConfirmDuplicateNR", [this.caption]);
      //
      this.scrollUp = false;
      break;

    case this.csvButtonConf.id:
      commandName = "csv";
      commandValue = Client.IdfPanel.commands.CMD_CSV;
      //
      // If multiple selection is active but there are no selected rows, ask user for confirmation about duplicate/export
      if (this.showMultipleSelection && !selectedRows)
        msg = Client.IdfResources.t("PAN_MSG_ConfirmExportNR", [this.caption]);
      break;

    case this.printButtonConf.id:
      commandName = "print";
      commandValue = Client.IdfPanel.commands.CMD_PRINT;
      break;

    case this.attachButtonConf.id:
      commandName = "attach";
      commandValue = Client.IdfPanel.commands.CMD_ATTACH;
      break;

    case this.groupButtonConf.id:
      commandName = "group";
      commandValue = Client.IdfPanel.commands.CMD_GROUP;
      break;

    case this.multipleMobileButtonConf.id:
      updateProps.showRowSelector = !this.showMultipleSelection;
      updateProps.showMultipleSelection = !this.showMultipleSelection;
      break;

    case this.topButtonConf.id:
      commandName = "top";
      commandValue = Client.IdfPanel.commands.CMD_NAVIGATION;
      //
      updateProps.actualRow = 0;
      updateProps.actualPosition = 1;
      //
      this.scrollUp = true;
      break;

    case this.prevButtonConf.id:
    {
      commandName = "prev";
      commandValue = Client.IdfPanel.commands.CMD_NAVIGATION;
      //
      delta = this.layout === Client.IdfPanel.layouts.form ? 1 : numRows - 1;
      updateProps.actualPosition = Math.max(this.actualPosition - delta, 1);
      updateProps.actualRow = 0;
      //
      this.scrollUp = true;
      break;
    }

    case this.nextButtonConf.id:
      commandName = "next";
      commandValue = Client.IdfPanel.commands.CMD_NAVIGATION;
      //
      delta = this.layout === Client.IdfPanel.layouts.form ? 1 : numRows - 1;
      updateProps.actualPosition = Math.min(this.actualPosition + delta, totalRows - delta);
      updateProps.actualRow = 0;
      //
      this.scrollUp = false;
      break;

    case this.bottomButtonConf.id:
      commandName = "bottom";
      commandValue = Client.IdfPanel.commands.CMD_NAVIGATION;
      //
      delta = (this.layout === Client.IdfPanel.layouts.form ? 0 : numRows - 1);
      updateProps.actualPosition = totalRows - delta;
      updateProps.actualRow = delta;
      //
      this.scrollUp = false;
      break;

    default:
      for (let i = 0; i < this.customButtonsConf.length; i++) {
        if (event.obj === this.customButtonsConf[i].id) {
          commandName = "cb" + i;
          commandValue = Client.IdfPanel.commands["CMD_CUSTOM" + (i + 1)];
          break;
        }
      }
      break;
  }
  //
  let events = [];
  let isBlocking;
  let eventDef;
  if (Client.mainFrame.isIDF) {
    isBlocking = (this.blockingCommands & commandValue);
    eventDef = this.toolbarEventDef | (isBlocking ? Client.IdfMessagesPump.eventTypes.BLOCKING : 0);
    //
    isClientSide = Client.IdfMessagesPump.isClientSideEvent(eventDef) && !isBlocking;
    //
    events.push({
      id: "pantb",
      def: eventDef,
      content: {
        oid: this.id,
        obn: commandName
      }
    });
  }
  else {
    events.push({
      id: "fireOnCommand",
      obj: this.id,
      content: {
        command: commandName
      }
    });
  }
  //
  if (["top", "prev", "next", "bottom"].includes(commandName)) {
    if (!Client.mainFrame.isIDF)
      isClientSide = false;
    //
    this.dataBlockStart = updateProps.actualPosition;
    this.dataBlockEnd = Math.min(updateProps.actualPosition + numRows - 1, totalRows);
  }
  //
  // Update panel's properties just if toolbar events have to be handled client side too
  if (Object.keys(updateProps).length > 0 && isClientSide)
    this.updateElement(updateProps);
  //
  // If no confirm is required, return event
  if (!msg) {
    if (updateMultiSel)
      this.updateMultiSel();
    //
    return events;
  }
  //
  // Show confirm message and eventually send event on user confirm
  Client.Widget.showMessageBox({type, text: msg, buttons}, result => {
    this.hiliteDelete(false);
    if (result === 1) {
      if (updateMultiSel)
        this.updateMultiSel();
      //
      Client.mainFrame.sendEvents(events);
    }
  });
  //
  return [];
};


/**
 * Handle function keys
 * @param {Object} event
 */
Client.IdfPanel.prototype.handleFunctionKeys = function (event)
{
  let events = [];
  if (event.content.type !== "keydown")
    return events;
  //
  if (event.content.keyCode < 112 || event.content.keyCode > 123)
    return events;
  //
  // I check the commands related to the fields
  for (let i = 0; i < this.elements.length && events.length === 0; i++) {
    let el = this.elements[i];
    if (el instanceof Client.IdfField)
      events.push(...el.handleFunctionKeys(event));
  }
  //
  if (events.length > 0)
    return events;
  //
  events.push(...Client.IdfFrame.prototype.handleFunctionKeys.call(this, event));
  if (events.length > 0)
    return events;
  //
  // Calculate the number of FKs from 1 to 48
  let fkn = (event.content.keyCode - 111) + (event.content.shiftKey ? 12 : 0) + (event.content.ctrlKey ? 24 : 0);
  //
  // Let's see if it matches one of my default keys
  let button;
  switch (fkn) {
    case Client.IdfPanel.FKEnterQBE:
    case Client.IdfPanel.FKFindData:
      if (this.showSearchButton())
        button = this.searchButtonConf;
      else if (this.showFindButton())
        button = this.findButtonConf;
      break;

    case Client.IdfPanel.FKFormList:
      if (this.showFormListButton(this.automaticLayout, true))
        button = this.formListButtonConf;
      break;

    case Client.IdfPanel.FKCancel:
    case Client.IdfPanel.FKRefresh:
      // If cancel button is not active, go to next case (FKRefresh) because these two commands are alternative
      if (this.showCancelButton())
        button = this.cancelButtonConf;
      else if (this.showRefreshButton())
        button = this.refreshButtonConf;
      break;

    case Client.IdfPanel.FKInsert:
      if (this.showInsertButton())
        button = this.insertButtonConf;
      break;

    case Client.IdfPanel.FKDelete:
      if (this.showDeleteButton())
        button = this.deleteButtonConf;
      break;

    case Client.IdfPanel.FKUpdate:
      if (this.showSaveButton())
        button = this.saveButtonConf;
      break;

    case Client.IdfPanel.FKDuplicate:
      if (this.showDuplicateButton())
        button = this.duplicateButtonConf;
      break;

    case Client.IdfPanel.FKPrint:
      if (this.showPrintButton())
        button = this.printButtonConf;
      break;

    case Client.IdfPanel.FKLocked:
      if (this.showLockButton())
        button = this.lockButtonConf;
      break;

    default:
    for (let i = 0; i < this.customCommands.length; i++) {
      if (Client.eleMap[this.customButtonsConf[i].id].fknum === fkn) {
        if (this.showCustomButton(i))
          button = this.customButtonsConf[i];
        break;
      }
    }
  }
  //
  if (button) {
    // I blur to let the changes take over
    document.activeElement.blur();
    this.focus();
    //
    events.push(...this.handleToolbarClick({obj: button.id}));
  }
  //
  if (this.enableMultipleSelection) {
    let res;
    if (this.showMultipleSelection) {
      if (fkn === Client.IdfPanel.FKSelAll)
        res = "selall";
      else if (fkn === Client.IdfPanel.FKSelNone)
        res = "selnone";
    }
    else if (fkn === Client.IdfPanel.FKSelTog)
      res = "seltog";
    //
    if (res)
      events.push(...this.handleMultiSelClick({content: {res}}));
  }
  //
  if (fkn === Client.IdfPanel.FKActRow)
    events.push(...this.handleDataRowClick({id: "onDblclick"}, this.fields[0].getValueByIndex(this.getActiveRowIndex())));
  //
  if (events.length > 0)
    event.content.srcEvent.preventDefault();
  //
  return events;
};


/**
 * Handle click on lock button
 * @param {Object} event
 */
Client.IdfPanel.prototype.handlePageClick = function (event)
{
  let events = [];
  let pageIndex = event.page.index;
  //
  // If click occurred on a page that is already active, do nothing
  if (pageIndex === this.activePage)
    return events;
  //
  // Give event the IDF format
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "panpg",
      def: this.pageClickEventDef,
      content: {
        oid: event.page.id,
        obn: this.id,
        xck: event.content.offsetX,
        yck: event.content.offsetY
      }
    });
  }
  else { // On IDC send onPageChanging event
    events.push({
      id: "fireOnActivePageChanging",
      obj: this.id,
      content: {
        newPage: pageIndex
      }
    });
  }
  //
  let isClientSide;
  if (Client.mainFrame.isIDF)
    isClientSide = Client.IdfMessagesPump.isClientSideEvent(this.pageClickEventDef);
  else
    isClientSide = !this.events.includes("onActivePageChanging");
  //
  if (isClientSide)
    this.updateElement({activePage: pageIndex});
  //
  return events;
};


/**
 * Apply visual style
 */
Client.IdfPanel.prototype.applyVisualStyle = function ()
{
  // Set visual style on panel container
  this.addVisualStyleClasses(Client.eleMap[this.contentContainerConf.id], {objType: "panel"});
  //
  if (this.hasList) {
    // Set panel visual style on grid header row and aggregate row too
    this.addVisualStyleClasses(Client.eleMap[this.gridHeaderConf.id], {objType: "panel"});
    this.addVisualStyleClasses(Client.eleMap[this.aggregateRowConf.id], {objType: "panel"});
    //
    // Set visual style on row selector header
    this.addVisualStyleClasses(Client.eleMap[this.rowSelectorColumnConf.id], {objType: "fieldHeader", list: true});
  }
  //
  // Apply visual style on fields
  for (let i = 0; i < this.fields.length; i++)
    this.fields[i].applyVisualStyle();
  //
  // Apply visual style on groups
  for (let i = 0; i < this.groups.length; i++)
    this.groups[i].applyVisualStyle();
};


/**
 * Get index-th row
 * @param {Integer} index
 */
Client.IdfPanel.prototype.getRow = function (index)
{
  return Client.eleMap[this.rows[index]?.id];
};


/**
 * Get id of next existing row after index-th row
 * @param {Integer} index
 */
Client.IdfPanel.prototype.getNextRowId = function (index)
{
  let nextRowId;
  //
  let rowsCount = this.getMaxRows();
  for (let i = index + 1; i <= rowsCount; i++) {
    let currentRowId = this.rows[i]?.id;
    //
    // If current row exists and it's not detached, it is the row I was finding
    if (currentRowId && !this.isRowDetached(i)) {
      nextRowId = currentRowId;
      break;
    }
  }
  //
  return nextRowId;
};


/**
 * Get most similar row to index-th row
 * @param {Integer} index
 */
Client.IdfPanel.prototype.getMostSimilarRowIndex = function (index)
{
  return;
  //
  // Look for a base row in order to clone it. Skip row having index 0 (qbe row) and 1 (the previous row could be qbe row)
  if (index <= 1)
    return;
  //
  let baseIndex = index - 1;
  //
  // Get previous row
  let baseRow = this.getRow(baseIndex);
  //
  // If no previous row, try to get the next one
  if (!baseRow) {
    baseIndex = index + 1;
    baseRow = this.getRow(baseIndex);
  }
  //
  if (baseRow)
    return baseIndex;
};


/**
 * Check if index-th row is detached
 * @param {Integer} index
 */
Client.IdfPanel.prototype.isRowDetached = function (index)
{
  return this.detachedRows[this.rows[index]?.id];
};


/**
 * Attach index-th row
 * @param {Integer} index
 * @param {Boolean} fill
 */
Client.IdfPanel.prototype.attachRow = function (index, fill)
{
  // If panel uses row qbe and it has not been created yet, I have to create it, not just to fill it
  if (index === 0) {
    if (this.canUseRowQbe())
      fill = !!this.qbeRowConf;
    else
      return;
  }
  //
  let detachedRow = this.isRowDetached(index);
  let newRow;
  let updateFieldValues = fill;
  //
  // Since current position is free, try to attach a row. It can be a detached row, a group header row or a new placeholder row
  if (detachedRow)
    newRow = detachedRow;
  else
    newRow = this.createPlaceholderRowConf(index);
  //
  let rowsContainer = Client.eleMap[this.windowConf.id];
  //
  let nextRow = Client.eleMap[this.getNextRowId(index)];
  //
  if (!fill && newRow) {
    // If row to attach is a detached one, I have to insert it directly on DOM
    if (detachedRow) {
      if (nextRow)
        rowsContainer.getRootObject().insertBefore(newRow, nextRow.getRootObject());
      else
        rowsContainer.getRootObject().appendChild(newRow);
      //
      // Now it's no more detached
      delete this.detachedRows[detachedRow.id];
    }
    else { // Otherwise create a new row
      // Insert qbe row before second row, if any (first row is the header)
      if (index === 0) {
        rowsContainer = Client.eleMap[this.gridConf.id];
        nextRow = this.windowScrollerConf;
        this.qbeRowConf = newRow;
      }
      //
      newRow = rowsContainer.insertBefore({child: newRow, sib: nextRow?.id});
      this.rows[index] = {id: newRow.id};
      //
      // Update first and last row indexes
      this.updateFirstRowIndex();
      this.updateLastRowIndex();
      //
      updateFieldValues = true;
      //
      // A new row has just been created, but index-th fieldValues may already exist. So I have to reset their styles
      if (!newRow.cloned)
        this.resetCachedStyles(index);
    }
  }
  //
  if (this.getRow(index) && updateFieldValues) {
    // Update new fieldValues just created
    for (let f of this.fields) {
      if (!f.isInList())
        continue;
      //
      let fieldValue = f.getValueByIndex(index);
      if (!fieldValue)
        continue;
      //
      fieldValue.applyVisualStyle();
      //
      let style = this.canUseRowQbe() && index === 0 ? f.listQbeValueStyle : f.listValueStyle;
      let listLayout = {};
      listLayout.style = {...style};
      listLayout.xs = Client.eleMap[f.listContainerId]?.xs;
      fieldValue.setListLayout(listLayout);
      fieldValue.updateVisibility();
      //
      // If I've just created qbeRow, update qbe filter
      if (Client.mainFrame.isIDF && fieldValue.index === 0 && !fill)
        fieldValue.updateQbeFilter();
      //
      fieldValue.updateControls({all: true});
    }
  }
};


/**
 * Detach index-th row
 * @param {Integer} index
 * @param {Boolean} deleted
 */
Client.IdfPanel.prototype.detachRow = function (index, deleted)
{
  let rowEl = this.getRow(index);
  //
  // If row does not exist or it's already detached, do nothing
  if (!rowEl)
    return;
  //
  if (!this.isRowDetached(index)) {
    let rootObject = rowEl.getRootObject();
    //
    // Remove current row from dom
    rootObject.remove();
    //
    this.detachedRows[rowEl.id] = rootObject;
  }
  //
  // If current row is deleted, remove it from rows
  if (deleted) {
    rowEl.close(true);
    delete this.rows[index];
    delete this.detachedRows[rowEl.id];
    //
    // Reset styles for deleted rows
    this.resetCachedStyles(index);
    //
    if (index === 0)
      delete this.qbeRowConf;
    //
    // Update first and last row indexes
    this.updateFirstRowIndex();
    this.updateLastRowIndex();
    //
    if (this.firstRow < 0)
      delete this.firstRow;
    if (this.lastRow < 0)
      delete this.lastRow;
  }
};


/**
 * Reuse a row
 * @param {Object} options
 */
Client.IdfPanel.prototype.reuseRow = function (options)
{
  let {row, oldIndex, newIndex} = options;
  //
  if (!row)
    return;
  //
  // Before reusing the row I must cancel pending focuses on the elements
  // I am about to reuse otherwise a spurious row change could occur
  row.clearPendingFocus();
  //
  let elements = row.elements;
  if (this.numSubRows > 1) {
    // We Have the subrows, so the elements are in them
    elements = [];
    for (let i = 0; i < this.numSubRows; i++) {
      let subRow = row.elements[0].elements[i];
      //
      // For the first subrow get all the elements (withs the row-selector), for the other rows get all the elements
      // skipping the fake rowselector
      elements.push(...subRow.elements.slice(i === 0 ? 0 : 1));
    }
  }
  //
  let rowsGroup = this.hasGroupedRows() ? this.getRowsGroupByIndex(newIndex) : undefined;
  //
  // Add/remove panel-rows-group-header class
  if (rowsGroup) {
    let level = Math.min(rowsGroup.level, 2);
    //
    // The row I'm reusing is going to become a rows group header. But it could already be a rows group header. So I remove classes that refer to levels other than mine
    Client.Widget.updateElementClassName(row, ["level0", "level1", "level2"].filter((el, i) => i !== level).join(" "), true);
    //
    // Now add specific level class
    Client.Widget.updateElementClassName(row, "panel-rows-group-header level" + level);
  }
  else
    Client.Widget.updateElementClassName(row, "panel-rows-group-header level0 level1 level2", true);
  //
  //
  for (let i = 0; i < elements.length; i++) {
    let col = elements[i];
    //
    if (col.parentWidget instanceof Client.IdfGroup) {
      let colRows = col.elements;
      for (let j = 0; j < colRows.length; j++)
        this.reuseRow({row: colRows[j], oldIndex, newIndex});
      //
      // Reuse group list column style and container
      col.parentWidget.listColumnStyles[newIndex] = col.parentWidget.listColumnStyles[oldIndex];
      col.parentWidget.listContainersConf[newIndex] = col.parentWidget.listContainersConf[oldIndex];
      delete col.parentWidget.listColumnStyles[oldIndex];
      delete col.parentWidget.listContainersConf[oldIndex];
    }
    else if (Client.SwipeMenu && col instanceof Client.SwipeMenu) {
      // The swipe menu is a mobile implement that is special and doesn't have a field/value
      //continue;
    }
    else {
      let oldFieldValue = col.parentWidget;
      //
      // Get newIndex-th field value
      let parentField = oldFieldValue.parentField;
      let newFieldValue = parentField.getValueByIndex(newIndex);
      //
      // If new fieldValue does not exist yet, create it
      if (!newFieldValue)
        newFieldValue = parentField.createFieldValue(newIndex, true);
      //
      if (!oldFieldValue.listContainerId)
        continue;
      //
      // Recursively update parentWidget on current column and its children
      this.reparentFieldValueElements(col, newFieldValue);
      //
      // First and second columns are row selector and rowsGroup header columns.
      // Since they are handled by first in list field, skip them
      if ((i === 0 || i === 1) && !(row.parentWidget instanceof Client.IdfGroup))
        continue;
      //
      // Assign objects references to newFieldValue
      newFieldValue.listContainerId = oldFieldValue.listContainerId;
      newFieldValue.listControlId = oldFieldValue.listControlId;
      newFieldValue.rowSelectorId = oldFieldValue.rowSelectorId;
      newFieldValue.multiSelCheckbox = oldFieldValue.multiSelCheckbox;
      newFieldValue.rowsGroupHeaderId = oldFieldValue.rowsGroupHeaderId;
      newFieldValue.rowsGroupHeaderTextId = oldFieldValue.rowsGroupHeaderTextId;
      newFieldValue.expandRowsGroupButtonId = oldFieldValue.expandRowsGroupButtonId;
      //
      // Delete them from oldFieldValue
      delete oldFieldValue.listContainerId;
      delete oldFieldValue.listControlId;
      delete oldFieldValue.rowSelectorId;
      delete oldFieldValue.multiSelCheckbox;
      delete oldFieldValue.rowsGroupHeaderId;
      delete oldFieldValue.rowsGroupHeaderTextId;
      delete oldFieldValue.expandRowsGroupButtonId;
      //
      // Now update newFieldValue style, it may be different from oldFieldValue one.
      newFieldValue.listStyle = {...oldFieldValue.listStyle, ...newFieldValue.listStyle};
      //
      // I also need to reset custom style properties that were set in old field value but they're not in the new one.
      // Don't reset them if they are set in listStyle
      oldFieldValue.listCustomStyle = oldFieldValue.listCustomStyle || {};
      newFieldValue.listCustomStyle = newFieldValue.listCustomStyle || {};
      for (let p in oldFieldValue.listCustomStyle) {
        if (!newFieldValue.listCustomStyle[p] && (!parentField.listValueStyle[p] || !oldFieldValue.listStyle[p]))
          newFieldValue.listCustomStyle[p] = "";
      }
      //
      if (newFieldValue.rowSelectorId)
        newFieldValue.rowSelectorStyle = {...oldFieldValue.rowSelectorStyle, ...newFieldValue.rowSelectorStyle};
      //
      if (newFieldValue.rowsGroupHeaderId)
        newFieldValue.rowsGroupHeaderStyle = {...oldFieldValue.rowsGroupHeaderStyle};
      //
      newFieldValue.setListLayout({style: {...oldFieldValue.listStyle}});
      newFieldValue.applyVisualStyle();
      newFieldValue.updateRowSelectorIcon();
      newFieldValue.updateMultiSelVisibility(this.showMultipleSelection);
      if (this.showMultipleSelection)
        newFieldValue.selectRow(!!this.multiSelStatus[newIndex]);
      //
      // Update error status
      if (oldFieldValue.errorText !== newFieldValue.errorText || oldFieldValue.rowErrorText !== newFieldValue.rowErrorText)
        newFieldValue.updateErrorStatus();
      //
      // If old field value has custom children, reuse them on new field value
      if (oldFieldValue.customChildrenConf)
        this.reuseCustomChildren(oldFieldValue, newFieldValue);
      //
      // If old field value has an in list subFrame (i.e. a subForm), remove it from dom.
      // Then, when newFieldValue will update its controls, newFieldValue subFrame will be appended
      if (oldFieldValue.subFrameConf && oldFieldValue.customElement?.subFrameId) {
        let subFrame = Client.eleMap[oldFieldValue.subFrameConf.id];
        if (subFrame) {
          subFrame.moving = true;
          subFrame.getRootObject().remove();
          delete subFrame.moving;
        }
      }
      //
      // Update rowsGroup header text
      newFieldValue.updateRowsGroupHeader({label: true});
      //
      // If new fieldValue only exists client side (i.e. server doesn't send it yet)
      // and it's not part of a rowsGroup (since server will never send rowsGroup fieldValue)
      // I don't need to update controls. I just need to copy all old fieldValue properties
      if (newFieldValue.clientSide && !newFieldValue.rowsGroup) {
        for (let p of Client.IdfFieldValue.cloneProps) {
          let oldValue = oldFieldValue[p];
          if (oldValue && typeof oldValue === "object")
            oldValue = JSON.parse(JSON.stringify(oldValue));
          newFieldValue[p] = oldValue;
        }
        //
        newFieldValue.updateElement({text: ""});
      }
      else // Otherwise update controls
        newFieldValue.updateControls({all: true});
    }
    //
    // Set order so that current row is moved to its proper position
    if (row.order !== newIndex && !(row.parentWidget instanceof Client.IdfGroup)) {
      row.updateElement({style: {order: newIndex}});
      row.order = newIndex;
    }
  }
};


/**
 * Reuse customChildren
 * @param {Client.IdfFieldValue} oldFieldValue
 * @param {Client.IdfFieldValue} newFieldValue
 */
Client.IdfPanel.prototype.reuseCustomChildren = function (oldFieldValue, newFieldValue)
{
  for (let j = 0; j < oldFieldValue.customChildrenConf.length; j++) {
    let customChildConf = oldFieldValue.customChildrenConf[j];
    let idParts = customChildConf.id.split(":");
    //
    idParts[1] = oldFieldValue.index;
    //
    let oldChildId = idParts.join(":");
    customChildConf.id = oldChildId;
    let customChild = Client.eleMap[oldChildId];
    delete Client.eleMap[oldChildId];
    //
    idParts[1] = newFieldValue.index;
    //
    let newChildId = idParts.join(":");
    //
    if (customChild) {
      customChild.id = newChildId;
      Client.eleMap[newChildId] = customChild;
    }
    //
    if (!newFieldValue.customChildrenConf)
      newFieldValue.customChildrenConf = [];
    //
    let newCustomChildConf = {...customChildConf};
    newCustomChildConf.id = newChildId;
    let boundProperty = newCustomChildConf.boundProperty;
    if (boundProperty) {
      let newBoundPropertyValue = customChild[boundProperty] === null ? "" : null;
      newCustomChildConf[boundProperty] = newBoundPropertyValue;
      if (newFieldValue.clientSide) {
        let update = {};
        update[boundProperty] = newBoundPropertyValue;
        Client.Widget.updateObject(customChild, update);
      }
    }
    //
    let childIndex = newFieldValue.customChildrenConf.findIndex(child => child.id === newChildId);
    if (childIndex === -1)
      newFieldValue.customChildrenConf.push(newCustomChildConf);
  }
};


/**
 * Update grouped rows
 */
Client.IdfPanel.prototype.updateGroupedRows = function ()
{
  if (!this.groupedRowsRoot)
    return;
  //
  // Existing rows have an index that doesn't take in account groups. So convert it to grouped format
  let newRows = [];
  for (let i = 0; i < this.rows.length; i++) {
    let row = this.rows[i];
    if (!row)
      continue;
    //
    // If row has an order, remove it
    let rowEl = this.getRow(i);
    if (rowEl)
      rowEl.getRootObject().style.order = "";
    //
    let groupedIndex = this.groupedRowsRoot.realIndexToGroupedIndex(i);
    newRows[groupedIndex] = row;
  }
  //
  // Replace rows array with its grouped version
  this.rows = newRows.slice();
};


/**
 * Translate scroller container in order to be aligned with panel grid scrollbar
 */
Client.IdfPanel.prototype.adjustScrollbar = function ()
{
  if (!this.hasListLayout())
    return;
  //
  let totalRows = this.getMaxRows(true);
  //
  // Get list row height
  let listRowHeight = this.getListRowHeight() + this.getListRowOffset();
  //
  // Calculate offset y
  let firstRow = this.firstRow || 0;
  let emptyRows = 0;
  //
  if (this.hasGroupedRows()) {
    let rowsOutOfGroups = this.getTotalRows(true) - this.groupedRowsRoot.groupedIndexToRealIndex(this.groupedRowsRoot.groupedEndingRow);
    totalRows = Math.max(this.groupedRowsRoot.getVisibleRowsCount() + rowsOutOfGroups + this.getNewRows(), 0);
    //
    firstRow = this.getVisibleGroupedRows({end: firstRow});
    emptyRows = Object.keys(this.rows).filter(key => this.rows[key] === undefined).length;
    if (firstRow < emptyRows)
      emptyRows = 0;
  }
  //
  let offsetY = Math.max(((firstRow - 1 + emptyRows) * listRowHeight), 0);
  //
  let translatableEl = Client.eleMap[this.windowConf.id];
  if (offsetY !== translatableEl.offsetY) {
    translatableEl.offsetY = offsetY;
    translatableEl.updateElement({style: {transform: "translateY(" + offsetY + "px)"}});
  }
  //
  // Set scroller height
  let windowScroller = Client.eleMap[this.windowScrollerConf.id];
  if (windowScroller.totalRows !== totalRows) {
    windowScroller.totalRows = totalRows;
    windowScroller.updateElement({style: {minHeight: (totalRows * listRowHeight) + "px"}});
  }
  //
  // Hide scrollbar if panel cannot navigate
  if (this.gridStyle.overflowY === undefined)
    this.gridStyle.overflowY = "";
  //
  let canNavigate = this.canNavigate();
  let needScrollbar = this.getNumRows() < this.getTotalRows();
  let overflowY = "";
  let paddingRight = 0;
  if (!canNavigate || (Client.mainFrame.isIDF && !needScrollbar)) {
    overflowY = "hidden";
    if (!Client.mainFrame.device.isMobile && !Client.mainFrame.idfMobile)
      paddingRight = Client.IdfPanel.scrollbarWidth;
  }
  //
  Client.Widget.updateStyle(Client.eleMap[this.gridConf.id], this.gridStyle, {overflowY});
  Client.Widget.updateStyle(Client.eleMap[this.gridColConf?.id], this.gridColStyle, {paddingRight: paddingRight + "px"});
};


/**
 * Scroll grid to index-th row
 * @param {Integer} index
 * @param {Boolean} force
 */
Client.IdfPanel.prototype.scrollToDataRow = function (index, force)
{
  let grid = Client.eleMap[this.gridConf?.id]?.getRootObject();
  if (!grid)
    return;
  //
  let headerHeight = this.getHeaderHeight();
  let qbeRowHeight = this.getQbeRowHeight();
  let defaultRowHeight = this.getListRowHeight();
  let rowOffset = this.getListRowOffset();
  let rowY = 0;
  //
  for (let i = 1; i < index; i++) {
    rowY += (this.getRow(i)?.getRootObject().clientHeight || defaultRowHeight);
    rowY += rowOffset;
  }
  //
  if (rowY < 0)
    rowY = 0;
  //
  let startVisibleArea = grid.scrollTop;
  let endVisibleArea = startVisibleArea + grid.clientHeight - headerHeight - qbeRowHeight;
  let rowHeight = this.getRow(index)?.getRootObject().clientHeight || defaultRowHeight;
  //
  // If row is entirely visible, do nothing
  if (rowY >= startVisibleArea && (rowY + rowHeight) <= endVisibleArea && !force) {
    this.focus({ifJustFocused: true});
    return;
  }
  //
  // Apply scrollTop after a while
  this.firstScrollTimer = setTimeout(() => {
    delete this.firstScrollTimer;
    //
    // I don't want to send "panscr" event if scroll is not performed by user
    if (grid.scrollTop !== rowY) {
      grid.scrollTop = rowY;
      this.focus({ifJustFocused: true});
    }
    else
      this.setActiveRow(true);
    return;
    //
    // TODO
    if (rowY < startVisibleArea)
      grid.scrollTop -= (startVisibleArea - rowY);
    else
      grid.scrollTop += ((rowY + rowHeight) - endVisibleArea);
  }, 0);
};


/**
 * Update first row index
 * @param {Integer} newIndex
 */
Client.IdfPanel.prototype.updateFirstRowIndex = function (newIndex)
{
  this.firstRow = newIndex ?? this.rows.findIndex((el, j) => j !== 0 && !!el && !this.isRowDetached(j));
};


/**
 * Update last row index
 * @param {Integer} newIndex
 */
Client.IdfPanel.prototype.updateLastRowIndex = function (newIndex)
{
  this.lastRow = newIndex ?? this.rows.findLastIndex((el, j) => !!el && !this.isRowDetached(j));
};


/**
 * Handle multiple selection of data row
 * @param {Boolean} value
 * @param {Integer} index
 */
Client.IdfPanel.prototype.handleDataRowSelection = function (value, index)
{
  let events = [];
  //
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "panms",
      def: this.multiSelEventDef,
      content: {
        oid: this.id,
        obn: index - this.actualPosition, // I have to send index 0 based!
        par1: value ? "-1" : "0"
      }
    });
  }
  else {
    events.push({
      id: "fireOnSelectionChanging",
      obj: this.id,
      content: {
        row: index - 1,
        selected: value
      }
    });
  }
  //
  // Select row just if multi selection event has to be handled client side too
  let isClientSide;
  if (Client.mainFrame.isIDF)
    isClientSide = Client.IdfMessagesPump.isClientSideEvent(this.multiSelEventDef);
  else
    isClientSide = !this.events.includes("onSelectionChanging");
  //
  if (isClientSide)
    this.updateMultiSel({value, index});
  //
  return events;
};


/**
 * Get selected data rows count
 */
Client.IdfPanel.prototype.getSelectedDataRows = function ()
{
  let selectedRows = 0;
  this.multiSelStatus.forEach(status => selectedRows += (status ? 1 : 0));
  //
  return selectedRows;
};


/**
 * Get list field parent column configuration
 * @param {String} fieldId
 * @param {Boolean} aggregate - true if I have to get aggregate container of given field
 */
Client.IdfPanel.prototype.getListFieldColumn = function (fieldId, aggregate)
{
  // fieldId could be also the panel id. In this case it means I want to find the column for list grid
  let field = Client.eleMap[fieldId];
  let inList = field.id !== this.id ? field.isInList() : false;
  //
  if (inList) {
    let parentGroup = Client.eleMap[field.groupId];
    if (aggregate)
      return {conf: parentGroup ? parentGroup.aggregateRowConf : this.aggregateRowConf};
    else {
      // If there are subrows we need to get the correct row to insert the headers in
      // we can do this by using the wrapRows map [field id][row number] ( -1 because the children are 0-based )
      let headerRow = this.gridHeaderConf;
      if (this.numSubRows > 1)
        headerRow = this.gridHeaderConf.children[0].children[this.wrapRows[fieldId] - 1];
      return {conf: parentGroup ? parentGroup.listContentConf : headerRow};
    }
  }
  else if (field instanceof Client.IdfField && field.aggregateOfField !== -1) {
    let parentField = field.getAggregatedFieldParent();
    return {conf: parentField.aggregateContainerConf};
  }
  //
  for (let i = 0; i < this.listGridRows.length; i++) {
    let row = this.listGridRows[i];
    for (let j = 0; j < row.cols.length; j++) {
      let fieldCol = this.recursivelyFindFieldColumn(field.id, row.cols[j]);
      //
      if (fieldCol)
        return fieldCol;
    }
  }
};


/**
 * Get form field parent column configuration
 * @param {String} fieldId
 */
Client.IdfPanel.prototype.getFormFieldColumn = function (fieldId)
{
  for (let i = 0; i < this.formGridRows.length; i++) {
    let row = this.formGridRows[i];
    for (let j = 0; j < row.cols.length; j++) {
      let fieldCol = this.recursivelyFindFieldColumn(fieldId, row.cols[j]);
      //
      if (fieldCol)
        return fieldCol;
    }
  }
};


/**
 * Find field column configuration
 * @param {String} fieldId
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelyFindFieldColumn = function (fieldId, col)
{
  if (col.fields.length === 1 && col.fields[0].id === fieldId && (!col.rows.length || col.fields[0].isGroup))
    return col;
  //
  for (let i = 0; i < col.rows.length; i++) {
    let row = col.rows[i];
    for (let j = 0; j < row.cols.length; j++) {
      let fieldCol = this.recursivelyFindFieldColumn(fieldId, row.cols[j]);
      //
      if (fieldCol)
        return fieldCol;
    }
  }
};


/**
 * Reset edge column properties (isMostLeft, isMostRight, isMostTop, isMostBottom)
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelyResetEdgeColumn = function (col)
{
  if (!col)
    return;
  //
  col.isMostLeft = false;
  col.isMostRight = false;
  col.isMostTop = false;
  col.isMostBottom = false;
  //
  for (let i = 0; i < col.rows.length; i++) {
    let row = col.rows[i];
    //
    for (let j = 0; j < row.cols.length; j++)
      this.recursivelyResetEdgeColumn(row.cols[j]);
  }
};


/**
 * Find and mark most right columns
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelySetMostRightColumn = function (col)
{
  if (!col)
    return;
  //
  if (!col.rows.length || (col.fields[0] && col.fields[0].isGroup)) {
    col.isMostRight = true;
    return;
  }
  //
  for (let i = 0; i < col.rows.length; i++) {
    let row = col.rows[i];
    //
    // Get last visible column
    let lastVisibleCol = row.cols[row.cols.length - 1];
    for (let j = row.cols.length - 1; j >= 0; j--) {
      if (row.cols[j].visible) {
        lastVisibleCol = row.cols[j];
        break;
      }
    }
    //
    this.recursivelySetMostRightColumn(lastVisibleCol);
  }
};


/**
 * Find and mark most left columns
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelySetMostLeftColumn = function (col)
{
  if (!col)
    return;
  //
  if (!col.rows.length || (col.fields[0] && col.fields[0].isGroup)) {
    col.isMostLeft = true;
    return;
  }
  //
  for (let i = 0; i < col.rows.length; i++) {
    let row = col.rows[i];
    this.recursivelySetMostLeftColumn(row.cols[0]);
  }
};


/**
 * Find and mark most bottom columns
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelySetMostBottomColumn = function (col)
{
  if (!col)
    return;
  //
  if (!col.rows.length || (col.fields[0] && col.fields[0].isGroup)) {
    col.isMostBottom = true;
    return;
  }
  //
  // Get last row having at least a visible column
  let lastVisibleRow = col.rows[col.rows.length - 1];
  let found;
  for (let i = col.rows.length - 1; i >= 0; i--) {
    let colRow = col.rows[i];
    for (let j = 0; j < colRow.cols.length; j++) {
      if (colRow.cols[j].visible) {
        lastVisibleRow = colRow;
        found = true;
        break;
      }
    }
    //
    if (found)
      break;
  }
  //
  for (let i = 0; i < lastVisibleRow.cols.length; i++)
    this.recursivelySetMostBottomColumn(lastVisibleRow.cols[i]);
};


/**
 * Find and mark most top columns
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelySetMostTopColumn = function (col)
{
  if (!col)
    return;
  //
  if (!col.rows.length || (col.fields[0] && col.fields[0].isGroup)) {
    col.isMostTop = true;
    return;
  }
  //
  let firstRow = col.rows[0];
  for (let i = 0; i < firstRow.cols.length; i++)
    this.recursivelySetMostTopColumn(firstRow.cols[i]);
};


/**
 * Recursively set flex grow on non-leaf columns
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelySetColumnsGrow = function (col)
{
  // If col is a leaf column, return its width adaptable status
  if (!col.rows.length)
    return col.canAdaptWidth && col.visible;
  //
  // A non-leaf column has to grow if one of its children grows
  let canAdaptWidth = false;
  for (let i = 0; i < col.rows.length; i++) {
    let row = col.rows[i];
    //
    for (let j = 0; j < row.cols.length; j++) {
      canAdaptWidth = this.recursivelySetColumnsGrow(row.cols[j]);
      if (canAdaptWidth)
        break;
    }
    //
    if (canAdaptWidth)
      break;
  }
  //
  // Set flex grow on given column
  let el = Client.eleMap[col.conf.id];
  let flexGrow = canAdaptWidth ? "1" : "0";
  if (el.flexGrow !== flexGrow) {
    el.flexGrow = flexGrow;
    el.updateElement({style: {flexGrow}});
  }
  //
  return canAdaptWidth;
};


/**
 * Recursively set flex grow on rows
 * @param {Object} row
 */
Client.IdfPanel.prototype.recursivelySetRowsGrow = function (row)
{
  let canAdaptHeight = false;
  for (let i = 0; i < row.cols.length; i++) {
    let col = row.cols[i];
    //
    // If a leaf column grows in height, parent row has to grow in height too
    if (!col.rows.length && col.canAdaptHeight && col.visible)
      canAdaptHeight = true;
    else { // Otherwise recursively check if some column's row has to grow in height
      for (let j = 0; j < col.rows.length; j++) {
        let hasToGrow = this.recursivelySetRowsGrow(col.rows[j]);
        if (hasToGrow)
          canAdaptHeight = true;
      }
    }
  }
  //
  // Set flex grow on given row
  let el = Client.eleMap[row.conf.id];
  let flexGrow = canAdaptHeight ? "1" : "0";
  if (el.flexGrow !== flexGrow) {
    el.flexGrow = flexGrow;
    el.updateElement({style: {flexGrow}});
  }
  //
  return canAdaptHeight;
};


/**
 * Recursively set columns visible property
 * @param {Object} col
 */
Client.IdfPanel.prototype.recursivelySetColumnsVisible = function (col)
{
  // If col is a leaf column, return its visibility
  if (!col.rows.length)
    return col.visible;
  //
  // A non-leaf column is visible if one of its children is
  let visible = false;
  for (let i = 0; i < col.rows.length; i++) {
    let row = col.rows[i];
    //
    for (let j = 0; j < row.cols.length; j++) {
      visible = this.recursivelySetColumnsVisible(row.cols[j]);
      if (visible)
        break;
    }
    //
    if (visible)
      break;
  }
  //
  // Set visible property
  col.visible = visible;
  //
  return visible;
};


/**
 * Calculate layout rules to handle resize mode
 * @param {Integer} index
 */
Client.IdfPanel.prototype.calcLayout = function (index)
{
  Client.IdfFrame.prototype.calcLayout.call(this);
  //
  // Tell my groups to update their visibility
  for (let i = 0; i < this.groups.length; i++)
    this.groups[i].updateVisibility(index);
  //
  // Tell my fields to update their visibility
  for (let i = 0; i < this.fields.length; i++)
    this.fields[i].updateVisibility(index);
  //
  // Set visible property on all parent columns with the same value as leaf column visible property
  this.setColumnsVisible();
  //
  // Set edge columns because they may have changed.
  // For example, a most right column that becomes not visible is no more the "most right" column.
  // The new most right column for that row will be previous column (if any)
  this.setEdgeColumns();
  this.setEdgeColumns(true);
  //
  // Get grid parent column
  let gridColumn = this.getListFieldColumn(this.id);
  //
  // If I have a list, calculate grid layout
  if (this.hasListLayout() && this.gridColConf && gridColumn) {
    // Get grid width
    this.gridWidth = this.getGridWidth();
    //
    let gridStyle = {};
    let gridColStyle = {};
    let rowSelectorStyle = {height: this.getHeaderHeight() + "px"};
    //
    let canAdaptWidth = this.canAdaptWidth();
    let fixedWidth = this.gridWidth + this.rowSelectorWidth;
    //
    gridColStyle.flexBasis = Client.mainFrame.isIDF ? fixedWidth + "px" : "100%";
    gridColStyle.flexGrow = canAdaptWidth ? "1" : "0";
    //
    if (Client.mainFrame.isIDF)
      gridColStyle.width = !canAdaptWidth ? fixedWidth + "px" : "";
    //
    let gridHeight = this.gridHeight;
    let canAdaptHeight = this.canAdaptHeight();
    //
    gridColStyle.height = canAdaptHeight ? "auto" : gridHeight + "px";
    gridStyle.height = canAdaptHeight ? "100%" : gridHeight + "px";
    //
    // Tell grid column if it can adapt its width and height
    gridColumn.canAdaptWidth = canAdaptWidth;
    gridColumn.canAdaptHeight = canAdaptHeight;
    //
    // Calculate margin left
    let gridColumnLeft = gridColumn.rect.left || 0;
    let deltaLeft = this.gridLeft - gridColumnLeft;
    gridColStyle.marginLeft = gridColumn.isMostLeft ? this.gridLeft + "px" : deltaLeft + "px";
    //
    // Calculate margin right
    let deltaRight = gridColumn.isMostRight ? (this.getContainerWidth() - this.orgGridWidth - this.rowSelectorWidth - this.gridLeft) : gridColumn.rect.deltaRight;
    gridColStyle.marginRight = deltaRight + "px";
    //
    // Calculate margin top
    let gridColumnTop = gridColumn.rect.top || 0;
    let deltaTop = this.gridTop - gridColumnTop;
    gridColStyle.marginTop = gridColumn.isMostTop ? this.gridTop + "px" : deltaTop + "px";
    //
    // Calculate margin bottom
    let deltaBottom = gridColumn.isMostBottom ? (this.getContainerHeight() - this.gridHeight - this.gridTop) : gridColumn.rect.deltaBottom;
    deltaBottom = deltaBottom >= 0 ? deltaBottom : 0;
    if (canAdaptHeight) {
      deltaBottom -= this.gridHeightGap;
      this.lastGridHeightGap = this.gridHeightGap;
    }
    gridColStyle.marginBottom = deltaBottom + "px";
    //
    // Update grid column style
    let gridCol = Client.eleMap[this.gridColConf.id];
    Client.Widget.updateStyle(gridCol, this.gridColStyle, gridColStyle);
    Client.Widget.updateObject(gridCol, {xs: "auto"});
    //
    // Update grid style
    Client.Widget.updateStyle(Client.eleMap[this.gridConf.id], this.gridStyle, gridStyle);
    //
    rowSelectorStyle.left = this.fixedColumns > 0 ? 0 : undefined;
    //
    // Update row selector style
    let el = Client.eleMap[this.rowSelectorColumnConf.id];
    Client.Widget.updateStyle(el, this.rowSelectorStyle, rowSelectorStyle);
    Client.Widget.updateElementClassName(el, "fixed-col", !this.fixedColumns);
    //
    // Update aggregate row selector style
    el = Client.eleMap[this.aggregateRowSelectorConf.id];
    let newAggregateRowSelectorStyle = Object.assign({}, rowSelectorStyle);
    newAggregateRowSelectorStyle.height = "";
    Client.Widget.updateStyle(el, this.aggregateRowSelectorStyle, newAggregateRowSelectorStyle);
    Client.Widget.updateElementClassName(el, "fixed-col", !this.fixedColumns);
  }
  //
  // Tell my groups to calculate their layout
  for (let i = 0; i < this.groups.length; i++)
    this.groups[i].calcLayout();
  //
  // Tell my fields to calculate their layout
  for (let i = 0; i < this.fields.length; i++)
    this.fields[i].calcLayout(index);
  //
  // Set rows min width in order to handle fixed columns properly
  if (this.hasListLayout() && this.fixedColumns)
    this.setRowsMinWidth();
  //
  // To properly handle resize, I have to set flex-grow on structure rows and columns.
  // In fact, if a leaf column has to adapt its width, all its parent columns have to grow horizontally.
  // And if a leaf column has to adapt its height, all its parent rows have to grow vertically.
  this.setFlexGrow();
};


/**
 * Calculate objects dimensions
 */
Client.IdfPanel.prototype.calcDimensions = function ()
{
  if (!Client.mainFrame.isIDF && this.collapsed)
    return;
  //
  Client.IdfFrame.prototype.calcDimensions.call(this);
  //
  let compStyle;
  //
  let pagesContainerEl = Client.eleMap[this.pagesContainerConf.id];
  let pagesContainer = pagesContainerEl.getRootObject();
  //
  let oldPagesContainerHeight = this.pagesContainerHeight;
  this.pagesContainerHeight = pagesContainer.offsetHeight;
  if (this.pagesContainerHeight !== 0) {
    compStyle = getComputedStyle(pagesContainer);
    this.pagesContainerHeight += (parseInt(compStyle.marginTop) || 0) + (parseInt(compStyle.marginBottom) || 0);
  }
  else if (pagesContainerEl.visible && oldPagesContainerHeight)
    this.pagesContainerHeight = oldPagesContainerHeight;
  //
  if (this.formContainerConf) {
    let formContainer = Client.eleMap[this.formContainerConf.id].getRootObject();
    compStyle = getComputedStyle(formContainer);
    //
    this.formContainerVerticalMargins = 0;
    this.formContainerVerticalMargins += (parseInt(compStyle.marginTop) || 0) + (parseInt(compStyle.marginBottom) || 0);
    this.formContainerVerticalMargins += (parseInt(compStyle.paddingTop) || 0) + (parseInt(compStyle.paddingBottom) || 0);
    //
    this.formContainerHorizontalMargins = 0;
    this.formContainerHorizontalMargins += (parseInt(compStyle.marginLeft) || 0) + (parseInt(compStyle.marginRight) || 0);
    this.formContainerHorizontalMargins += (parseInt(compStyle.paddingLeft) || 0) + (parseInt(compStyle.paddingRight) || 0);
  }
  //
  if (this.listContainerConf) {
    let listContainer = Client.eleMap[this.listContainerConf.id].getRootObject();
    compStyle = getComputedStyle(listContainer);
    //
    this.listContainerVerticalMargins = 0;
    this.listContainerVerticalMargins += (parseInt(compStyle.marginTop) || 0) + (parseInt(compStyle.marginBottom) || 0);
    this.listContainerVerticalMargins += (parseInt(compStyle.paddingTop) || 0) + (parseInt(compStyle.paddingBottom) || 0);
    //
    this.listContainerHorizontalMargins = 0;
    this.listContainerHorizontalMargins += (parseInt(compStyle.marginLeft) || 0) + (parseInt(compStyle.marginRight) || 0);
    this.listContainerHorizontalMargins += (parseInt(compStyle.paddingLeft) || 0) + (parseInt(compStyle.paddingRight) || 0);
  }
  //
  if (this.gridConf) {
    let grid = Client.eleMap[this.gridConf.id].getRootObject();
    let headerRow = Client.eleMap[this.gridHeaderConf.id].getRootObject();
    let qbeRow = Client.eleMap[this.qbeRowConf?.id]?.getRootObject();
    let aggregateRow = Client.eleMap[this.aggregateRowConf.id].getRootObject();
    //
    this.calculatedGridWidth = grid.clientWidth;
    //
    let gridHeight = grid.clientHeight;
    let gridScrollHeight = grid.scrollHeight;
    let headerRowHeight = this.getHeaderHeight() + this.getHeaderOffset();
    let qbeRowHeight = this.getQbeRowHeight();
    let listRowHeight = this.getListRowHeight() + this.getListRowOffset();
    let aggregateRowHeight = this.visibleAggregateFields.length ? listRowHeight : 0;
    //
    // Header row may be not fully rendered yet, so I can't trust is height
    gridHeight = gridHeight - headerRow.clientHeight + headerRowHeight;
    //
    // Qbe row may be not fully rendered yet, so I can't trust is height
    if (this.canUseRowQbe())
      gridHeight = gridHeight - qbeRow.clientHeight + qbeRowHeight;
    //
    // Aggregate row may be not fully rendered yet, so I can't trust is height
    gridHeight = gridHeight - aggregateRow.clientHeight + aggregateRowHeight;
    //
    // When wep is realizing, browser fails to calculate gridHeight since it also add wep statusbar height!
    // So I need to remove it
    if (Client.mainFrame.wep?.realizing) {
      let statusbarHeight = Client.mainFrame.wep.statusbar?.getRootObject()?.clientHeight || 0;
      gridHeight -= statusbarHeight;
    }
    //
    let lastGridHeightGap = this.lastGridHeightGap || 0;
    this.calculatedGridHeight = gridHeight - lastGridHeightGap;
    this.gridHeightGap = this.getGridHeightGap(gridScrollHeight - gridHeight);
    //
    // Apply new gap if needed
    if (!this.realizing && this.gridHeightGap !== this.lastGridHeightGap)
      this.calcLayout(-1);
  }
};


/**
 * Set flex grow on rows and columns in order to properly handle resize
 */
Client.IdfPanel.prototype.setFlexGrow = function ()
{
  if (this.hasListLayout()) {
    for (let i = 0; i < this.listGridRows.length; i++) {
      let listRow = this.listGridRows[i];
      //
      // Set flex-grow on rows in order to handle vertical resize
      this.recursivelySetRowsGrow(listRow);
      //
      // Set flex-grow on columns in order to handle horizontal resize
      for (let j = 0; j < listRow.cols.length; j++)
        this.recursivelySetColumnsGrow(listRow.cols[j]);
    }
  }
  //
  if (this.hasFormLayout()) {
    for (let i = 0; i < this.formGridRows.length; i++) {
      let formRow = this.formGridRows[i];
      //
      // Set flex-grow on rows in order to handle vertical resize
      this.recursivelySetRowsGrow(formRow);
      //
      // Set flex-grow on columns in order to handle horizontal resize
      for (let j = 0; j < formRow.cols.length; j++)
        this.recursivelySetColumnsGrow(formRow.cols[j]);
    }
  }
};


/**
 * Set visible property on columns in order to properly handle resize
 */
Client.IdfPanel.prototype.setColumnsVisible = function ()
{
  if (this.hasListLayout()) {
    for (let i = 0; i < this.listGridRows.length; i++) {
      let listRow = this.listGridRows[i];
      //
      for (let j = 0; j < listRow.cols.length; j++)
        this.recursivelySetColumnsVisible(listRow.cols[j]);
    }
  }
  //
  if (this.hasFormLayout()) {
    for (let i = 0; i < this.formGridRows.length; i++) {
      let formRow = this.formGridRows[i];
      //
      for (let j = 0; j < formRow.cols.length; j++)
        this.recursivelySetColumnsVisible(formRow.cols[j]);
    }
  }
};


/**
 * Set edge columns in order to make calcLayout method to apply proper margins
 * @param {Boolean} form
 * @param {Client.IdfGroup} group
 */
Client.IdfPanel.prototype.setEdgeColumns = function (form, group)
{
  if (form && !this.hasFormLayout())
    return;
  //
  if (!form && !this.hasListLayout())
    return;
  //
  let rows;
  if (form)
    rows = group ? this.getFormFieldColumn(group.id)?.rows || [] : this.formGridRows;
  else
    rows = group ? this.getListFieldColumn(group.id)?.rows || [] : this.listGridRows;
  //
  // Get first row having at least a visible column
  let firstVisibleRowIndex = rows.findIndex(r => r.cols.find(c => c.visible));
  //
  // Get last row having at least a visible column
  let lastVisibleRowIndex = rows.findLastIndex(r => r.cols.find(c => c.visible));
  //
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    //
    // First of all, reset all columns edge properties (isMostLeft, isMostRight, isMostTop, isMostBottom)
    row.cols.forEach(c => this.recursivelyResetEdgeColumn(c));
    //
    // Find and mark most left column. It must be in the first visible col of actual row
    let firstVisibleRowCol = row.cols.find(c => c.visible);
    this.recursivelySetMostLeftColumn(firstVisibleRowCol);
    //
    // Find and mark most right column. It must be in the last visible col of actual row
    let lastVisibleRowCol = row.cols.findLast(c => c.visible);
    this.recursivelySetMostRightColumn(lastVisibleRowCol);
    //
    // Find and mark most top and most bottom columns.
    row.cols.forEach(c => {
      // Most top column must be in the first row having at least one visible column
      if (i === firstVisibleRowIndex)
        this.recursivelySetMostTopColumn(c);
      //
      // Most bottom column must be in the last row having at least one visible column
      if (i === lastVisibleRowIndex)
        this.recursivelySetMostBottomColumn(c);
    });
  }
};


/**
 * Check if panel grid can adapt its width
 */
Client.IdfPanel.prototype.canAdaptWidth = function ()
{
  let adaptableFields;
  //
  // Check if at least one of visible in list fields is adaptable
  for (let i = 0; i < this.fields.length; i++) {
    let field = this.fields[i];
    if (!field.isInList())
      continue;
    //
    if (field.canAdaptWidth() && field.isVisible()) {
      adaptableFields = true;
      break;
    }
  }
  //
  return this.parentIdfView?.resizeWidth !== Client.IdfView.resizeModes.NONE && this.resizeWidth === Client.IdfPanel.resizeModes.stretch && adaptableFields;
};


/**
 * Check if panel grid can apdapt its height
 */
Client.IdfPanel.prototype.canAdaptHeight = function ()
{
  return this.parentIdfView?.resizeHeight !== Client.IdfView.resizeModes.NONE && this.resizeHeight === Client.IdfPanel.resizeModes.stretch;
};


/**
 * Check if panel grid can move left
 */
Client.IdfPanel.prototype.canMoveLeft = function ()
{
  return this.parentIdfView?.resizeWidth !== Client.IdfView.resizeModes.NONE && this.resizeWidth === Client.IdfPanel.resizeModes.move;
};


/**
 * Check if panel grid can move top
 */
Client.IdfPanel.prototype.canMoveTop = function ()
{
  return this.parentIdfView?.resizeHeight !== Client.IdfView.resizeModes.NONE && this.resizeHeight === Client.IdfPanel.resizeModes.move;
};


/**
 * Show or hide row selectors
 */
Client.IdfPanel.prototype.updateRowSelectorsVisibility = function ()
{
  if (!this.hasListLayout())
    return;
  //
  // On Mobile we don't use the header multiple selection button
  if (!Client.mainFrame.idfMobile) {
    // Update header row selector visibility
    Client.Widget.updateObject(Client.eleMap[this.rowSelectorColumnConf.id], {visible: this.showRowSelector && !!this.fields.length});
    //
    if (this.numSubRows > 1) {
      // Update also the other fake row selectors of the header
      for (let r = 1; r < this.numSubRows; r++)
        Client.Widget.updateObject(Client.eleMap[this.gridHeaderConf.children[0].children[r].children[0].id], {visible: this.showRowSelector && !!this.fields.length});
    }
  }
  //
  // Update row selector width
  this.rowSelectorWidth = this.showRowSelector ? Client.eleMap[this.rowSelectorColumnConf.id].getRootObject().offsetWidth : 0;
  //
  // Update aggregate row selector visibility
  Client.Widget.updateObject(Client.eleMap[this.aggregateRowSelectorConf.id], {visible: this.showRowSelector});
  //
  for (let i = 0; i <= this.rows.length; i++) {
    let row = this.rows[i];
    //
    if (!row)
      continue;
    //
    if (this.hasGroupedRows() && this.getRowsGroupByIndex(i))
      continue;
    //
    if (this.numSubRows === 1)
      Client.Widget.updateObject(this.getRow(i).elements[0], {visible: this.showRowSelector});
    else {
      // Update the real row selector and also the fake rowselectors
      for (let r = 0; r < this.numSubRows; r++)
        Client.Widget.updateObject(this.getRow(i).elements[0].elements[r].elements[0], {visible: this.showRowSelector});
    }
  }
};


/**
 * Get start position of last received data block
 */
Client.IdfPanel.prototype.getDataBlockStart = function ()
{
  let dataBlockStart = this.dataBlockStart || (this.canUseRowQbe() ? 0 : 1);
  if (dataBlockStart && this.hasGroupedRows())
    dataBlockStart = this.groupedRowsRoot.realIndexToGroupedIndex(dataBlockStart);
  //
  return dataBlockStart;
};


/**
 * Get end position of last received data block
 */
Client.IdfPanel.prototype.getDataBlockEnd = function ()
{
  let dataBlockEnd = this.dataBlockEnd || this.getTotalRows(true);
  if (dataBlockEnd && this.hasGroupedRows())
    dataBlockEnd = this.groupedRowsRoot.realIndexToGroupedIndex(dataBlockEnd);
  //
  return dataBlockEnd;
};


/**
 * Calculate grid width as fields width sum
 */
Client.IdfPanel.prototype.getGridWidth = function ()
{
  let gridWidth = 0;
  //
  // Add in list fields width
  for (let i = 0; i < this.fields.length; i++) {
    let field = this.fields[i];
    if (!field.isInList())
      continue;
    //
    gridWidth += field.getRects({checkVisibility: true}).width;
  }
  //
  gridWidth += Client.IdfPanel.scrollbarWidth;
  //
  return gridWidth;
};


/**
 * Get pixels gap that makes grid show an half of a row at the bottom
 * @param {Integer} scrollGap - difference between grid scrollHeight and clientHeight
 */
Client.IdfPanel.prototype.getGridHeightGap = function (scrollGap)
{
  if (!Client.mainFrame.isIDF)
    return 0;
  //
  if (!this.calculatedGridHeight)
    return 0;
  //
  if (this.hasDynamicHeightRows())
    return (this.getNumRows() > this.getTotalRows() ? scrollGap : 0);
  //
  // Get listRow height and offset
  let listRowHeight = this.getListRowHeight();
  let listRowOffset = this.getListRowOffset();
  let totalListRowHeight = listRowHeight + listRowOffset;
  //
  // Get header height
  let headerHeight = this.getHeaderHeight() + this.getHeaderOffset() + this.getQbeRowHeight();
  //
  // Calculate visible rows height
  let visibleRowsHeight = this.calculatedGridHeight - headerHeight;
  //
  // Calculate numRows
  let numRows = Math.floor(visibleRowsHeight / totalListRowHeight);
  //
  let gap = (numRows * totalListRowHeight) - visibleRowsHeight;
  //
  if (Client.mainFrame.isIDF)
    gap += (this.visibleAggregateFields.length ? totalListRowHeight : 0);
  //
  return gap;
};


/**
 * Get first in list field
 */
Client.IdfPanel.prototype.getFirstInListField = function ()
{
  return this.fields.find(f => f.isShown() && f.isInList());
};


/**
 * Get first in list field index
 */
Client.IdfPanel.prototype.getFirstInListFieldIndex = function ()
{
  return this.fields.findIndex(f => f.isShown() && f.isInList());
};


/**
 * Get first visible field
 * @param {Object} options
 */
Client.IdfPanel.prototype.getFirstVisibleField = function (options)
{
  options = options || {};
  //
  if (options.inList && options.checkRowSelector && this.showRowSelector)
    return;
  //
  return this.fields.find(f => f.isShown(options.form) && (!options.inList || f.isInList()) && f.isVisible(options.form));
};


/**
 * Get last visible field
 * @param {Object} options
 */
Client.IdfPanel.prototype.getLastVisibleField = function (options)
{
  options = options || {};
  //
  return this.fields.findLast(f => f.isShown(options.form) && (!options.inList || f.isInList()) && f.isVisible(options.form));
};


/**
 * Get fields rect
 * @param {Boolean} form
 * @param {Client.IdfGroup} group
 */
Client.IdfPanel.prototype.getFieldsRect = function (form, group)
{
  let sortChildren = function (children) {
    children.sort(function (a, b) {
      if (a.rect.top === b.rect.top) {
        return a.rect.left - b.rect.left;
      }
      //
      return a.rect.top - b.rect.top;
    });
  };
  //
  let children = [];
  let child;
  let field;
  //
  let fields = [];
  if (group)
    fields = group.fields;
  else {
    // Reset grid dimensions and position
    this.gridHeight = this.orgGridHeight;
    this.gridTop = this.orgGridTop;
    this.gridLeft = this.orgGridLeft;
    //
    // Get first level parent children (i.e. groups and fields belonging to any group)
    for (let i = 0; i < this.elements.length; i++) {
      let el = this.elements[i];
      //
      let isField = el instanceof Client.IdfField;
      let isGroup = el instanceof Client.IdfGroup;
      //
      // I just want fields and groups. So if el is neither, skip it.
      // Moreover, also skip field if:
      // 1) it belongs to a group
      // 2) it's a values aggregation of another field and I'm getting rects for list mode. In this case there's no need for a column for it in the main grid
      if ((!isField || el.groupId || (el.aggregateOfField !== -1 && !form)) && !isGroup)
        continue;
      //
      fields.push(el);
    }
  }
  //
  let gridWidth = 0;
  //
  // Add default row selector width to grid width
  gridWidth += (this.showRowSelector ? Client.IdfPanel.defaultRowSelectorWidth : 0);
  //
  // Add all out of list fields and groups as children
  for (let i = 0; i < fields.length; i++) {
    field = fields[i];
    //
    if (!field.isShown(form))
      continue;
    //
    let isGroup = field instanceof Client.IdfGroup;
    //
    // Reset list dimensions and position
    if (!form) {
      field.listWidth = field.orgListWidth;
      field.listHeight = field.orgListHeight;
      field.listLeft = field.orgListLeft;
      field.listTop = field.orgListTop;
      //
      // IDC handles listWidthPerc for groups too
      if (!isGroup || !Client.mainFrame.isIDF)
        field.listWidthPerc = field.orgListWidthPerc;
      //
      // Just fields handle percentage dimensions
      if (!isGroup) {
        field.listHeightPerc = field.orgListHeightPerc;
        field.listLeftPerc = field.orgListLeftPerc;
        field.listTopPerc = field.orgListTopPerc;
      }
    }
    else { // Reset form dimensions and position
      field.formWidth = field.orgFormWidth;
      field.formHeight = field.orgFormHeight;
      field.formLeft = field.orgFormLeft;
      field.formTop = field.orgFormTop;
      //
      // Just fields handle percentage dimensions
      if (!isGroup) {
        field.formWidthPerc = field.orgFormWidthPerc;
        field.formHeightPerc = field.orgFormHeightPerc;
        field.formLeftPerc = field.orgFormLeftPerc;
        field.formTopPerc = field.orgFormTopPerc;
      }
    }
    //
    let width, height, left, top;
    //
    let parentWidth = field.isInList() ? this.gridWidth : this.originalWidth;
    let parentHeight = field.isInList() ? this.gridHeight : this.originalHeight;
    //
    // Use width percentage or normal width
    let widthPerc = form ? field.formWidthPerc : field.listWidthPerc;
    if (widthPerc !== undefined)
      width = (parentWidth * widthPerc / 100);
    else
      width = form ? field.formWidth : field.listWidth;
    //
    // Use height percentage or normal height
    let heightPerc = form ? field.formHeightPerc : field.listHeightPerc;
    if (heightPerc !== undefined)
      height = (parentHeight * heightPerc / 100);
    else
      height = form ? field.formHeight : field.listHeight;
    //
    // On IDF, panel grid has a left offset of 20px when row selector is visible.
    // This offset is not taken in account by out list field's left, so add it manually
    if (Client.mainFrame.isIDF && !form && !field.isInList() && this.showRowSelector) {
      // Don't add row selector offset in case of group, because group left already takes in account it
      if (!isGroup)
        field.listLeft += Client.IdfPanel.rowSelectorOffset;
      //
      if (field.listLeftPerc !== undefined) {
        field.listLeftPerc += (Client.IdfPanel.rowSelectorOffset * 100) / this.originalWidth;
        //
        if (!isGroup)
          field.listLeftPerc += (Client.IdfPanel.rowSelectorOffset * 100) / this.originalWidth;
      }
    }
    //
    // Use left percentage or normal left
    let leftPerc = form ? field.formLeftPerc : field.listLeftPerc;
    if (leftPerc !== undefined)
      left = (this.originalWidth * leftPerc / 100);
    else
      left = form ? field.formLeft : field.listLeft;
    //
    // Use top percentage or normal top
    let topPerc = form ? field.formTopPerc : field.listTopPerc;
    if (topPerc !== undefined)
      top = (this.originalHeight * topPerc / 100);
    else
      top = form ? field.formTop : field.listTop;
    //
    if (!form && field.isInList()) {
      gridWidth += width;
      continue;
    }
    //
    child = {};
    child.id = field.id;
    child.isGroup = isGroup;
    child.gridClass = field.gridClass ? field.gridClass : this.defaultGridClass;
    child.rect = {};
    child.rect.top = top || 0;
    child.rect.bottom = child.rect.top + (height || (isGroup ? 0 : Client.IdfField.defaultHeight));
    child.rect.left = left || 0;
    child.rect.right = child.rect.left + width;
    child.rect.width = width;
    child.rect.height = height;
    //
    children.push(child);
  }
  //
  // If I'm creating main list structure (i.e. not group structure), add also grid as child
  if (!form && !group) {
    child = {};
    child.id = this.id;
    child.rect = {};
    child.rect.top = this.gridTop;
    child.rect.bottom = child.rect.top + this.gridHeight;
    child.rect.left = this.gridLeft;
    child.rect.right = child.rect.left + gridWidth;
    child.rect.width = gridWidth;
    child.rect.height = this.gridHeight;
    //
    children.push(child);
  }
  //
  let completeIntersections = true;
  let strongConnections = true;
  //
  // Check if there are complete intersections or strong connections between children and iterate until they are not resolved
  while (completeIntersections || strongConnections) {
    // Sort children by top and left
    sortChildren(children);
    //
    completeIntersections = this.checkCompleteIntersections(children, form);
    strongConnections = this.checkStrongConnections(children, form);
  }
  //
  // Sort children by top and left
  sortChildren(children);
  //
  return children;
};


/**
 * Update child rect
 * @param {Object} options
 */
Client.IdfPanel.prototype.updateChildRect = function (options)
{
  let child = options.child;
  let newLeft = options.left;
  let newTop = options.top;
  let form = options.form;
  //
  // If current child is the panel itself I have to update its gridTop and gridLeft properties (just if I'm not creating form structure)
  if (child.id === this.id) {
    if (!form) {
      this.gridTop = newTop;
      this.gridLeft = newLeft;
    }
  }
  else { // Otherwise find the corresponding field/group and update its formTop/listTop and formLeft/listLeft properties
    let field = Client.eleMap[child.id];
    //
    if (form) {
      if (field.fromTopPerc !== undefined)
        field.formTopPerc = ((newTop * 100) / this.parent.height);
      else
        this.updateChildCoordinate({prop: "formTop", value: newTop, child: field});
      //
      if (field.formLeftPerc !== undefined)
        field.formLeftPerc = ((newLeft * 100) / this.parent.width);
      else
        this.updateChildCoordinate({prop: "formLeft", value: newLeft, child: field});
    }
    else {
      if (field.listTopPerc !== undefined)
        field.listTopPerc = ((newTop * 100) / this.parent.height);
      else
        this.updateChildCoordinate({prop: "listTop", value: newTop, child: field});
      //
      if (field.listLeftPerc !== undefined)
        field.listLeftPerc = ((newLeft * 100) / this.parent.width);
      else
        this.updateChildCoordinate({prop: "listLeft", value: newLeft, child: field});
    }
  }
};


/*
 * Update child coordinate, by accounting the delta on the children if the object is a group
 * @param {Object} options
 */
Client.IdfPanel.prototype.updateChildCoordinate = function (options)
{
  let prop = options.prop;
  let value = options.value;
  let child = options.child;
  //
  let oldValue = child[prop];
  child[prop] = value;
  //
  if (child instanceof Client.IdfGroup && ["formTop", "formLeft", "listTop", "listLeft"].indexOf(prop) >= 0) {
    // We need to update the child property by the same delta - also for the org property
    let delta = value - oldValue;
    child.fields.forEach(f => {
      f[prop] += delta;
      f["org" + prop.substring(0, 1).toUpperCase() + prop.substring(1)] += delta;
    });
  }
};


/**
 * Look for complete intersections and resolve them if any
 * @param {Array} children
 * @param {Boolean} form
 */
Client.IdfPanel.prototype.checkCompleteIntersections = function (children, form)
{
  let found = false;
  //
  // Check if two children intersect each other. I have to avoid this behaviour
  for (let i = 0; i < children.length; i++) {
    let child1 = children[i];
    //
    for (let j = i + 1; j < children.length; j++) {
      let rightMove = false;
      let child2 = children[j];
      //
      // Check if child1 and child2 could intersect in given layout
      if (!this.checkPossibleIntersection(child1, child2, form))
        continue;
      //
      // Check if child1 and child2 intersect each other both horizontally and vertically
      let completeIntersection = this.rectIntersection(child1.rect, child2.rect) && this.rectIntersection(child1.rect, child2.rect, true);
      //
      // If child1 and child2 don't completely intersect each other, do nothing
      if (!completeIntersection)
        continue;
      //
      found = true;
      //
      // Calculate intersection coordinates
      let intersectionLeft = child1.rect.left > child2.rect.left ? child1.rect.left : child2.rect.left;
      let intersectionRight = child1.rect.right > child2.rect.right ? child2.rect.right : child1.rect.right;
      let intersectionTop = child1.rect.top > child2.rect.top ? child1.rect.top : child2.rect.top;
      let intersectionBottom = child1.rect.bottom > child2.rect.bottom ? child2.rect.bottom : child1.rect.bottom;
      //
      // Calculate intersection width and height
      let intersectionWidth = intersectionRight - intersectionLeft;
      let intersectionHeight = intersectionBottom - intersectionTop;
      //
      // If intersection is higher than wider, move the second child at first child right (add 2 to make the two children don't touch each other)
      if (intersectionHeight > intersectionWidth) {
        child2.rect.leftGap = true;
        child2.rect.left = child1.rect.right + 2;
        child2.rect.right = child2.rect.left + child2.rect.width;
        rightMove = true;
      }
      else { // Otherwise move the second child at first child bottom (add 2 to make the two children don't touch each other)
        child2.rect.topGap = true;
        child2.rect.top = child1.rect.bottom + 2;
        child2.rect.bottom = child2.rect.top + child2.rect.height;
      }
      //
      let newLeft = child2.rect.left - (child2.rect.leftGap ? 2 : 0);
      let newTop = child2.rect.top - (child2.rect.topGap ? 2 : 0);
      delete child2.rect.leftGap;
      delete child2.rect.topGap;
      //
      this.updateChildRect({child: child2, left: newLeft, top: newTop, form});
      //
      // I just moved a field/group on right side of another field/group. But what if I moved it on another field/group? I have another intersection!
      // And if this field/group has a top value smaller than field/group I moved (i.e. it's above the moved field),
      // no one will handle this intersection because I order children by their top values and this means I already handled that field/group.
      // So in this case I have to handle children again starting from 0
      if (rightMove) {
        i = -1;
        //
        // Sort children by top and left
        children.sort(function (a, b) {
          if (a.rect.top === b.rect.top) {
            return a.rect.left - b.rect.left;
          }
          //
          return a.rect.top - b.rect.top;
        });
        //
        break;
      }
    }
  }
  //
  return found;
};


/**
 * Look for strong connections and resolve them if any
 * @param {Array} children
 * @param {Boolean} form
 */
Client.IdfPanel.prototype.checkStrongConnections = function (children, form)
{
  let intersectionsMap = this.getIntersectionsMap(children, form);
  //
  for (let i = 0; i < children.length; i++) {
    let child1 = children[i];
    //
    for (let j = i + 1; j < children.length; j++) {
      let child2 = children[j];
      //
      // Check if child1 and child2 could intersect in given layout and thus be part of a strong connection
      if (!this.checkPossibleIntersection(child1, child2, form))
        continue;
      //
      // If child1 and child2 are not part of a strong connection, do nothing
      let child4 = this.checkStrongConnection(child1, child2, intersectionsMap);
      if (!child4)
        continue;
      //
      // Strong connection: move child2 to child1 right and child4 to child1 left. This resolves the strong connection
      child2.rect.left = child1.rect.right;
      child2.rect.right = child2.rect.left + child2.rect.width;
      child4.rect.left = child1.rect.left;
      child4.rect.right = child4.rect.left + child4.rect.width;
      //
      this.updateChildRect({child: child2, left: child2.rect.left, top: child2.rect.top, form});
      this.updateChildRect({child: child4, left: child4.rect.left, top: child4.rect.top, form});
      //
      return true;
    }
  }
};


/**
 * Check if child1 and child2 belong to same page
 * @param {Object} child1
 * @param {Object} child2
 */
Client.IdfPanel.prototype.checkSamePage = function (child1, child2)
{
  let child1PageIndex = Client.eleMap[child1.id]?.pageIndex;
  let child2PageIndex = Client.eleMap[child2.id]?.pageIndex;
  //
  // If child1/child2 is the grid, look for an in list field belonging to the same page as child2/child1
  if (child1.id === this.id)
    return this.fields.find(el => el.isInList() && (el.pageIndex === child2PageIndex || child2PageIndex === -1));
  else if (child2.id === this.id)
    return this.fields.find(el => el.isInList() && (el.pageIndex === child1PageIndex || child1PageIndex === -1));
  else
    return child1PageIndex === child2PageIndex || child1PageIndex === -1 || child2PageIndex === -1;
};


/**
 * Check if given rects intersect each other in given direction
 * @param {Object} r1 - {top, bottom, left, right}
 * @param {Object} r2 - {top, bottom, left, right}
 * @param {boolean} vertical
 */
Client.IdfPanel.prototype.rectIntersection = function (r1, r2, vertical)
{
  // Look for a vertical intersection
  if (vertical) {
    if (r1.top <= r2.bottom && r1.top >= r2.top)
      return true;
    if (r1.bottom >= r2.top && r2.top >= r1.top)
      return true;
    if (r2.top >= r1.top && r2.bottom <= r1.bottom)
      return true;
    if (r1.top >= r2.top && r1.bottom <= r2.bottom)
      return true;
  }
  else { // Otherwise look for a horizontal intersection
    if (r1.left < r2.right && r1.left >= r2.left)
      return true;
    if (r1.right > r2.left && r2.left >= r1.left)
      return true;
    if (r2.left >= r1.left && r2.right <= r1.right)
      return true;
    if (r1.left >= r2.left && r1.right <= r2.right)
      return true;
  }
  //
  return false;
};


/**
 * Check if given rects intersect each other in given direction and get that interesection degree
 * @param {Object} r1 - {top, bottom, left, right}
 * @param {Object} r2 - {top, bottom, left, right}
 * @param {boolean} vertical
 */
Client.IdfPanel.prototype.rectIntersectionDegree = function (r1, r2, vertical)
{
  // Look for a vertical intersection
  if (vertical) {
    if (r1.top <= r2.bottom && r1.top >= r2.top)
      return r1.top - r2.bottom;
    if (r1.bottom >= r2.top && r2.top >= r1.top)
      return r2.top - r1.bottom;
    if (r2.top >= r1.top && r2.bottom <= r1.bottom)
      return 10000; // totally internal
    if (r1.top >= r2.top && r1.bottom <= r2.bottom)
      return 10000; // totally internal
  }
  else { // Otherwise look for a horizontal intersection
    if (r1.left < r2.right && r1.left >= r2.left)
      return 10000; // totally internal
    if (r1.left > r2.left && r2.right >= r1.right)
      return r2.right - r1.left;
    if (r2.left >= r1.left && r2.right <= r1.right)
      return 10000; // totally internal
    if (r1.left >= r2.left && r1.right <= r2.right)
      return r2.right - r1.right;
  }
  //
  return 0;
};


/**
 * Get intersections map
 * @param {Object} children
 * @param {Boolean} form
 */
Client.IdfPanel.prototype.getIntersectionsMap = function (children, form)
{
  let intersections = {};
  //
  for (let i = 0; i < children.length; i++) {
    let child1 = children[i];
    intersections[child1.id] = intersections[child1.id] || {hor: [], ver: []};
    //
    for (let j = 0; j < children.length; j++) {
      if (j === i)
        continue;
      //
      let child2 = children[j];
      //
      // Check if child1 and child2 could intersect in given layout
      if (!this.checkPossibleIntersection(child1, child2, form))
        continue;
      //
      if (this.rectIntersection(child1.rect, child2.rect))
        intersections[child1.id].hor.push(child2);
      if (this.rectIntersection(child1.rect, child2.rect, true))
        intersections[child1.id].ver.push(child2);
    }
  }
  //
  return intersections;
};


/**
 * Check if child1 and child2 are part of a strongly connected group of fields
 * @param {Object} child1
 * @param {Object} child2
 * @param {Object} intersectionsMap
 */
Client.IdfPanel.prototype.checkStrongConnection = function (child1, child2, intersectionsMap)
{
  // If child2 does not belong to child1 horizontal intersections, do nothing
  if (!intersectionsMap[child1.id].hor.find(c => c.id === child2.id))
    return;
  //
  let child3, child4;
  //
  // Get child2 horizontal intersections
  let horChild2 = intersectionsMap[child2.id].hor;
  for (let j = 0; j < horChild2.length; j++) {
    let hor = horChild2[j];
    //
    // Look for a child2 horizontal intersection (different from child1) that vertically intersects child1
    if (hor.id === child1.id || !intersectionsMap[hor.id].ver.find(c => c.id === child1.id))
      continue;
    //
    // Now I have to check if current child2 horizontal intersection vertically intersects child1
    if (child2.rect.left < hor.rect.right && child1.rect.left < child2.rect.right) {
      child3 = hor;
      break;
    }
  }
  //
  // If third component of strongly connected fields is missing, there's no strong connection
  if (!child3)
    return;
  //
  // Get child2 vertical intersections
  let verChild2 = intersectionsMap[child2.id].ver;
  for (let j = 0; j < verChild2.length; j++) {
    let ver = verChild2[j];
    //
    // Look for a child2 vertical intersection (different from child1) that vertically intersects child1
    if (ver.id === child1.id)
      continue;
    //
    // If child4 candidate (ver) vertically intersects child1 and horizontally intersects child3
    if (intersectionsMap[ver.id].ver.find(c => c.id === child1.id) && intersectionsMap[ver.id].hor.find(c => c.id === child3.id) && child3.rect.left < ver.rect.left) {
      child4 = ver;
      break;
    }
    //
    // If child4 candidate (ver) horizontally intersects child1 and vertically intersects child3
    if (intersectionsMap[ver.id].hor.find(c => c.id === child1.id) && intersectionsMap[ver.id].ver.find(c => c.id === child3.id) && child3.rect.top < ver.rect.top) {
      child4 = ver;
      break;
    }
  }
  //
  // If fourth component of strongly connected fields is missing, there's no strong connection
  return child4;
};


/**
 * Create a grid structure made of rows and columns in which place each panel child based on its rect
 * @param {Boolean} form
 * @param {Object} groupConf - group for which to create structure
 */
Client.IdfPanel.prototype.createStructure = function (form, groupConf)
{
  if (form && !Client.mainFrame.isIDF)
    return this.getCloudFormStructure(groupConf);
  //
  let group = groupConf ? Client.eleMap[groupConf.id] : undefined;
  let fields = this.getFieldsRect(form, group);
  //
  let rows = [];
  //
  // Place fields/groups inside rows based on rows and fields/groups rects
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    //
    // If current field is not visible in given layout, skip it
    if (!Client.eleMap[field.id].isVisible(form) && Client.mainFrame.isIDF)
      continue;
    //
    let found = false;
    for (let j = 0; j < rows.length; j++) {
      // If current field do not vertically intersects current row, this is not the right row for it
      if (!this.rectIntersection(rows[j].rect, field.rect, true))
        continue;
      //
      // If field is placed above the row, its top becomes row's new top
      if (rows[j].rect.top > field.rect.top)
        rows[j].rect.top = field.rect.top;
      //
      // If it's placed under the row, its bottom becomes row's new bottom
      if (rows[j].rect.bottom < field.rect.bottom)
        rows[j].rect.bottom = field.rect.bottom;
      //
      // If it's placed at row left, its left becomes row's new left
      if (rows[j].rect.left > field.rect.left)
        rows[j].rect.left = field.rect.left;
      //
      // If it's placed at row right, its right becomes row's new right
      if (rows[j].rect.right < field.rect.right)
        rows[j].rect.right = field.rect.right;
      //
      // Add current field/group to current row
      rows[j].fields.push(field);
      found = true;
      break;
    }
    //
    // If I didn't found a row that intersects current field, I have to create a new row for it
    if (!found) {
      // Give new row the same rect as field rect, then add field to row
      let newRow = {};
      newRow.rect = {...field.rect};
      newRow.fields = [field];
      newRow.cols = [];
      //
      // New row top has to be equal to last row bottom. In case of first row it has to be 0 if row doesn't belong to any group, otherwise it has to be equal to group top
      // New row left is 0 if row belongs to any group, otherwise it's group left
      let lastRow = rows[rows.length - 1];
      newRow.rect.top = lastRow ? lastRow.rect.bottom : (groupConf ? groupConf.rect.top : 0);
      newRow.rect.left = groupConf ? groupConf.rect.left : 0;
      //
      // Create row configuration
      newRow.conf = this.createElementConfig({c: "IonRow", className: "panel-structure-row", noWrap: true});
      //
      rows.push(newRow);
    }
  }
  //
  // Split each row into columns and assign each field to proper column
  for (let i = 0; i < rows.length; i++)
    this.assignFieldsToColumns(form, rows[i]);
  //
  return rows;
};


/**
 * Split given column into rows and assign each field to proper row
 * @param {Boolean} form
 * @param {Object} col
 */
Client.IdfPanel.prototype.assignFieldsToRows = function (form, col)
{
  let rows = [];
  //
  // Order column fields by their top
  col.fields.sort(function (a, b) {
    return a.rect.top - b.rect.top;
  });
  //
  for (let i = 0; i < col.fields.length; i++) {
    let field = col.fields[i];
    //
    let found = false;
    for (let j = 0; j < rows.length; j++) {
      // If current field do not vertically intersects current row, this is not the right row for it
      if (!this.rectIntersection(rows[j].rect, field.rect, true))
        continue;
      //
      // If field is placed above the row, its top becomes row's new top
      if (rows[j].rect.top > field.rect.top)
        rows[j].rect.top = field.rect.top;
      //
      // If it's placed under the row, its bottom becomes row's new bottom
      if (rows[j].rect.bottom < field.rect.bottom)
        rows[j].rect.bottom = field.rect.bottom;
      //
      // If it's placed above at row left, its left becomes row's new left
      if (rows[j].rect.left > field.rect.left)
        rows[j].rect.left = field.rect.left;
      //
      // If it's placed at row right, its right becomes row's new bottom
      if (rows[j].rect.right < field.rect.right)
        rows[j].rect.right = field.rect.right;
      //
      // Add current field to current row
      rows[j].fields.push(field);
      found = true;
      break;
    }
    //
    // If I didn't found a row that intersects current field, I have to create a new row for it
    if (!found) {
      // Give new row the same rect as field rect, then add field to row
      let newRow = {};
      newRow.rect = {...field.rect};
      newRow.fields = [field];
      newRow.cols = [];
      //
      let lastRow = rows[rows.length - 1];
      newRow.rect.top = lastRow ? lastRow.rect.bottom : col.rect.top;
      newRow.rect.bottom = field.rect.bottom;
      newRow.rect.left = col.rect.left;
      newRow.rect.right = col.rect.right;
      //
      // Create row configuration and add it to column configuration
      newRow.conf = this.createElementConfig({c: "IonRow", className: "panel-structure-row", noWrap: true});
      col.conf.children.push(newRow.conf);
      //
      // Add new row to column rows
      rows.push(newRow);
    }
  }
  //
  // Sort rows by theri top
  rows.sort(function (a, b) {
    return (a.rect && b.rect) ? a.rect.top - b.rect.top : 0;
  });
  //
  // Split each row into columns and assign each field to proper column
  col.rows = rows;
  for (let j = 0; j < rows.length; j++)
    this.assignFieldsToColumns(form, rows[j]);
};


/**
 * Check if given two children could intersect each other in given layout
 * @param {Object} child1
 * @param {Object} child2
 * @param {Boolean} form
 */
Client.IdfPanel.prototype.checkPossibleIntersection = function (child1, child2, form)
{
  return this.checkSamePage(child1, child2) && Client.eleMap[child1.id]?.isVisible(form) && Client.eleMap[child2.id]?.isVisible(form);
};


/**
 * Split given row into columns and assign each field to proper column
 * @param {Boolean} form
 * @param {Object} row
 */
Client.IdfPanel.prototype.assignFieldsToColumns = function (form, row)
{
  let cols = [];
  //
  row.fields.sort(function (a, b) {
    return a.rect.left - b.rect.left;
  });
  //
  for (let i = 0; i < row.fields.length; i++) {
    let field = row.fields[i];
    //
    let found = false;
    for (let j = 0; j < cols.length; j++) {
      let col = cols[j];
      let differentPage = !!col.fields.find(f => !this.checkPossibleIntersection(f, field, form));
      //
      // If current field do not horizontally intersects current column, this is not the right column for it
      if (!this.rectIntersection(col.rect, field.rect, false) || differentPage)
        continue;
      //
      // If field is placed above the column, its top becomes column's new top
      if (col.rect.top > field.rect.top)
        col.rect.top = field.rect.top;
      //
      // If it's placed under the column, its bottom becomes column's new bottom
      if (col.rect.bottom < field.rect.bottom)
        col.rect.bottom = field.rect.bottom;
      //
      // If it's placed at column left, its left becomes column's new left
      if (col.rect.left > field.rect.left)
        col.rect.left = field.rect.left;
      //
      // If it's placed at column right, its right becomes column's new right
      if (col.rect.right < field.rect.right)
        col.rect.right = field.rect.right;
      //
      // Add current field to current column
      col.fields.push(field);
      found = true;
      break;
    }
    //
    // If I didn't found a column that intersects current field, I have to create a new column for it
    if (!found) {
      // Give new column the same rect as field rect, then add field to column
      let newCol = {};
      newCol.rect = {...field.rect};
      newCol.fields = [field];
      newCol.rows = [];
      newCol.visible = true;
      //
      // Get last column that contains an object belonging to the same page as current field
      let lastCol = cols.findLast(c => c.fields.findLast(f => this.checkSamePage(f, field)));
      //
      newCol.rect.left = lastCol ? lastCol.rect.right : row.rect.left;
      newCol.rect.right = field.rect.right;
      newCol.rect.top = row.rect.top;
      newCol.rect.bottom = field.rect.bottom;
      //
      // Create new column configuration and add it to row configuration
      newCol.conf = this.createElementConfig({c: "IonCol", className: "panel-structure-col"});
      newCol.conf.parentRowId = row.conf.id;
      row.conf.children.push(newCol.conf);
      //
      // Add new column to row columns
      cols.push(newCol);
      //
      // For each column calculate delta right and delta bottom. I will use these values in "calcLayout" method of both IdfPanel and IdfField
      for (let k = 0; k < cols.length; k++) {
        // If parent row has just a column, calculate distance from parent row right
        cols[k].rect.deltaRight = cols.length === 1 ? row.rect.right - cols[k].rect.right : 0;
        //
        // If current column has no rows (that means it is a leaf column) calculate distance from parent row bottom
        cols[k].rect.deltaBottom = !cols[k].rows.length ? row.rect.bottom - cols[k].rect.bottom : 0;
      }
    }
  }
  //
  // Order columns by their left
  cols.sort(function (a, b) {
    if (a.rect.left === b.rect.left)
      return 0;
    else if (b.rect.left > a.rect.left)
      return -1;
    else
      return 1;
  });
  //
  row.cols = cols;
  for (let i = 0; i < cols.length; i++) {
    // If current column contains more than one field, split it into rows and assign each field to proper row
    if (cols[i].fields.length > 1)
      this.assignFieldsToRows(form, cols[i]);
    else {
      let obj = cols[i].fields[0];
      //
      // Check if the Field has a responsive set-up and update it
      if (obj.gridClass)
        cols[i].conf.className = cols[i].conf.className + " " + obj.gridClass;
      //
      // If current column contains a group, create structure for that group
      if (obj.isGroup) {
        cols[i].rows = this.createStructure(form, obj);
        for (let j = 0; j < cols[i].rows.length; j++)
          cols[i].conf.children.push(cols[i].rows[j].conf);
      }
    }
  }
};


/**
 * Return true if panel has list layout
 */
Client.IdfPanel.prototype.hasListLayout = function ()
{
  return this.hasList || Client.mainFrame.isEditing();
};


/**
 * Return true if panel has form layout
 */
Client.IdfPanel.prototype.hasFormLayout = function ()
{
  return this.hasForm || Client.mainFrame.isEditing();
};


/**
 * Return true if panel has dynamic height rows
 */
Client.IdfPanel.prototype.hasDynamicHeightRows = function ()
{
  return !!this.rowHeightResize;
};


/**
 * Return true if some field has filters
 */
Client.IdfPanel.prototype.hasFilters = function ()
{
  return !!this.fields.find(f => f.isInList() && f.qbeFilter);
};


/**
 * Get active row index
 * @param {Boolean} real - get real index even if there are grouped rows
 */
Client.IdfPanel.prototype.getActiveRowIndex = function (real)
{
  let activeRowIndex = this.actualPosition + this.actualRow;
  if (!real && this.hasGroupedRows())
    activeRowIndex = this.groupedRowsRoot.realIndexToGroupedIndex(activeRowIndex);
  //
  return activeRowIndex;
};


/**
 * Get total rows
 * @param {Boolean} real - get real total rows even if there are grouped rows
 */
Client.IdfPanel.prototype.getTotalRows = function (real)
{
  let totalRows = this.totalRows;
  if (!real && this.hasGroupedRows())
    totalRows = this.groupedRowsRoot.realIndexToGroupedIndex(totalRows);
  //
  return totalRows;
};


/**
 * Handle scroll
 */
Client.IdfPanel.prototype.handleScroll = function ()
{
  clearTimeout(this.horizontalTimeout);
  //
  // Get grid element
  let gridEl = Client.eleMap[this.gridConf.id].getRootObject();
  //
  let gridHeight = gridEl.clientHeight;
  let newScrollTop = gridEl.scrollTop;
  let newScrollLeft = gridEl.scrollLeft;
  //
  if (this.lastScrollLeft !== undefined && newScrollLeft !== this.lastScrollLeft) {
    this.lastScrollLeft = newScrollLeft;
    //
    this.horizontalTimeout = setTimeout(() => {
      // Update viewport list fields
      for (let i = 0; i < this.viewportListFields.length; i++)
        Client.eleMap[this.viewportListFields[i]].updateControls({all: true}, {from: this.firstRow, to: this.lastRow});
      //
      // Start update all other fields requesting animation frames
      this.updateOutViewportListFields(true);
    }, 50);
    //
    return;
  }
  //
  // Check if I'm scrolling up
  this.scrollUp = this.lastScrollTop > newScrollTop;
  //
  this.lastScrollTop = newScrollTop;
  this.lastScrollLeft = newScrollLeft;
  //
  let rowsTotHeight = 0;
  let rowHeight;
  let defaultRowHeight = this.getListRowHeight();
  let dataWindowHeight = 0;
  let dataWindowStart = -1;
  //
  let visibleRowsHeight = gridHeight - this.getHeaderHeight() - this.getQbeRowHeight();
  //
  let maxRows = this.getMaxRows();
  let hasGroupedRows = this.hasGroupedRows();
  //
  // Calculate row index to request to server
  for (let i = 1; i <= maxRows; i++) {
    // In case of grouped rows, skip rows belonging to collapsed groups
    if (hasGroupedRows && !this.groupedRowsRoot.isRowVisible(i))
      continue;
    //
    // If current data row exists get its height.
    // Otherwise in this position there is an empty space (or a placeholder row) waiting for a data row. So get default row height
    rowHeight = this.getRow(i)?.getRootObject().clientHeight || defaultRowHeight;
    //
    // Add row height to total height
    rowsTotHeight += rowHeight;
    //
    // If rows height is greater than grid scroll top, I found data window start
    if (dataWindowStart === -1 && rowsTotHeight > newScrollTop) {
      dataWindowStart = i;
      //
      // On IDF, the server side buffer video never has half rows, while it can happen on the client side.
      // In the worst scenario I have half of a row at the top and half of a row at the bottom.
      // In this case I'd have numRows + 1 visible rows client side, but the server still sends me 20 rows at a time. And so I could have some empty rows.
      // So if I see less than half of a row as first row, get the next one (scroll down) or the previous one (scroll up) as dataWindowStart
      if (Client.mainFrame.isIDF && rowsTotHeight - newScrollTop <= Math.floor(rowHeight / 2))
        dataWindowStart += this.scrollUp ? -1 : 1;
    }
    //
    // If I found data window start
    if (dataWindowStart !== -1) {
      dataWindowHeight += rowHeight;
      //
      // If I reach data window end, exit
      if (dataWindowHeight >= visibleRowsHeight)
        break;
    }
  }
  //
  // If I have dynamic height rows, prevent dataWindowEnd to be greater tha totalRows
  if (Client.mainFrame.isIDF && (this.hasDynamicHeightRows() || this.numSubRows > 1)) {
    let totalRows = this.getTotalRows() + this.getNewRows();
    //
    let dataWindowEnd = dataWindowStart + this.getNumRows();
    if (dataWindowEnd > totalRows)
      dataWindowStart -= (dataWindowEnd - totalRows - 1);
  }
  //
  let actualPosition = this.hasGroupedRows() ? this.groupedActualPosition : this.actualPosition;
  if (dataWindowStart !== actualPosition) {
    Client.mainFrame.sendEvents(this.handlePanelScroll(dataWindowStart, this.scrollUp));
    //
    // Setting order property on rows cause scrollTop to change.
    // In most cases the browser knows that it's not a real scrollTop change and so restore it to its initial value.
    // But in some cases (for example when reusing a ProgressBar that removes DOM nodes while updating some of its properties)
    // browser is not able to restore scrollTop value. So I do it by myself
    if (gridEl.scrollTop !== this.lastScrollTop)
      gridEl.scrollTop = this.lastScrollTop;
    //
    // Start update not visible fields requesting animation frames
    this.updateOutViewportListFields(true);
  }
};


/**
 * Return true if qbe button needs to be shown
 */
Client.IdfPanel.prototype.showQbeButton = function ()
{
  if (!this.qbeTip)
    return false;
  //
  if (this.status !== Client.IdfPanel.statuses.data)
    return false;
  //
  if (!this.showStatusbar)
    return false;
  //
  if (this.collapsed)
    return false;
  //
  return true;
};


/**
 * Return true if nav buttons need to be shown
 */
Client.IdfPanel.prototype.showNavButtons = function ()
{
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_NAVIGATION))
    return false;
  //
  if (!this.canNavigate())
    return false;
  //
  let numRows = this.layout === Client.IdfPanel.layouts.list ? this.getNumRows() : 1;
  if (this.getTotalRows() <= numRows && this.actualPosition === 1)
    return false;
  //
  return true;
};


/**
 * Return true if search button needs to be shown
 */
Client.IdfPanel.prototype.showSearchButton = function ()
{
  if (!this.canSearch)
    return false;
  //
  if (this.searchMode !== Client.IdfPanel.searchModes.toolbar)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_SEARCH))
    return false;
  //
  if (!this.canNavigate())
    return false;
  //
  return true;
};


/**
 * Return true if find button needs to be shown
 */
Client.IdfPanel.prototype.showFindButton = function ()
{
  if (!this.canSearch)
    return false;
  //
  if (this.status !== Client.IdfPanel.statuses.qbe)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_FIND))
    return false;
  //
  return true;
};


/**
 * Return true if formList button needs to be shown
 * @param {Boolean} auto
 * @param {Boolean} fromKeyboard - if set to true the check comes from a FK handler, so we need to reduce the controls.
 *                                 particularly we don't need to check the form visibility
 */
Client.IdfPanel.prototype.showFormListButton = function (auto, fromKeyboard)
{
  if (!this.hasList || !this.hasForm)
    return false;
  //
  if (this.automaticLayout && this.status !== Client.IdfPanel.statuses.data)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_FORMLIST))
    return false;
  //
  if (!this.canNavigate() && this.status !== Client.IdfPanel.statuses.qbe)
    return false;
  //
  if (fromKeyboard)
    return true;
  //
  if (Client.mainFrame.isIDF)
    return !auto;
  else
    return auto ? this.automaticLayout && this.layout === Client.IdfPanel.layouts.form : !this.automaticLayout;
};


/**
 * Return true if cancel button needs to be shown
 */
Client.IdfPanel.prototype.showCancelButton = function ()
{
  if (!(((this.status === Client.IdfPanel.statuses.updated || (Client.mainFrame.idfMobile && !this.locked && this.lockable)) && (this.canUpdate || this.canInsert)) || this.status === Client.IdfPanel.statuses.qbe || this.DOModified))
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_CANCEL))
    return false;
  //
  return true;
};


/**
 * Return true if refresh button needs to be shown
 */
Client.IdfPanel.prototype.showRefreshButton = function ()
{
  if (this.status === Client.IdfPanel.statuses.qbe)
    return false;
  //
  if (this.isDO && !this.hasDocTemplate)
    return false;
  //
  if (((this.status === Client.IdfPanel.statuses.updated || (Client.mainFrame.idfMobile && !this.locked && this.lockable)) && (this.canUpdate || this.canInsert)) || this.status === Client.IdfPanel.statuses.qbe || this.DOModified)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_REFRESH))
    return false;
  //
  return true;
};


/**
 * Return true if delete button needs to be shown
 */
Client.IdfPanel.prototype.showDeleteButton = function ()
{
  if (!this.canDelete)
    return false;
  //
  if (this.locked && !Client.mainFrame.idfMobile)
    return false;
  //
  if (this.status !== Client.IdfPanel.statuses.data)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_DELETE))
    return false;
  //
  return true;
};


/**
 * Return true if insert button needs to be shown
 */
Client.IdfPanel.prototype.showInsertButton = function ()
{
  if (!this.canInsert)
    return false;
  //
  if (this.locked && !this.enableInsertWhenLocked && !(this.isDO && this.DOSingleDoc && this.isNewRow() && Client.mainFrame.isIDF))
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_INSERT))
    return false;
  //
  if (this.status !== Client.IdfPanel.statuses.qbe && !this.canNavigate())
    return false;
  //
  return true;
};


/**
 * Return true if duplicate button needs to be shown
 */
Client.IdfPanel.prototype.showDuplicateButton = function ()
{
  if (!this.canInsert)
    return false;
  //
  if (this.locked)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_DUPLICATE))
    return false;
  //
  if (!this.canNavigate())
    return false;
  //
  if (this.isNewRow())
    return false;
  //
  return true;
};


/**
 * Return true if save button needs to be shown
 */
Client.IdfPanel.prototype.showSaveButton = function ()
{
  if (!this.canInsert && !this.canUpdate && !(this.DOModified && this.DOCanSave))
    return false;
  //
  if (this.locked)
    return false;
  //
  if (this.status === Client.IdfPanel.statuses.qbe)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_SAVE))
    return false;
  //
  return true;
};


/**
 * Return true if print button needs to be shown
 */
Client.IdfPanel.prototype.showPrintButton = function ()
{
  if (!Client.mainFrame.isIDF)
    return false;
  //
  if (!this.hasBook)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_PRINT))
    return false;
  //
  if (!this.canNavigate())
    return false;
  //
  return true;
};


/**
 * Return true if group button needs to be shown
 */
Client.IdfPanel.prototype.showGroupButton = function ()
{
  if (this.status !== Client.IdfPanel.statuses.data)
    return false;
  //
  if (this.layout !== Client.IdfPanel.layouts.list)
    return false;
  //
  if (!this.canGroup)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_GROUP))
    return false;
  //
  return true;
};


/**
 * Return true if csv button needs to be shown
 */
Client.IdfPanel.prototype.showCsvButton = function ()
{
  if (this.layout !== Client.IdfPanel.layouts.list)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_CSV))
    return false;
  //
  if (!this.canNavigate())
    return false;
  //
  return true;
};


/**
 * Return true if attach button needs to be shown
 */
Client.IdfPanel.prototype.showAttachButton = function ()
{
  if (!Client.mainFrame.isIDF)
    return false;
  //
  if (!this.isCommandEnabled(Client.IdfPanel.commands.CMD_ATTACH))
    return false;
  //
  return true;
};


/**
 * Return true if given custom button needs to be shown
 * @param {String} cmd
 */
Client.IdfPanel.prototype.showCustomButton = function (cmd)
{
  let command = (cmd < 8 ? 262144 : -1) * Math.pow(2, cmd < 8 ? cmd : cmd - 8);
  //
  return this.isCommandEnabled(command);
};


/**
 * Show clear filters button
 */
Client.IdfPanel.prototype.showClearFiltersButton = function ()
{
  if (!this.canUseRowQbe())
    return;
  //
  // Check if there is at least a field having active filter
  let show = this.hasFilters();
  //
  this.fields.forEach(f => f.isInList() ? f.showClearFiltersButton(show) : undefined);
};


Client.IdfPanel.prototype.showLockButton = function ()
{
  return Client.IdfFrame.prototype.showLockButton.call(this) && this.status !== Client.IdfPanel.statuses.updated;
};


/**
 * Update toolbar
 */
Client.IdfPanel.prototype.updateToolbar = function ()
{
  Client.IdfFrame.prototype.updateToolbar.call(this);
  //
  // Update status bar
  this.updateStatusbar();
  //
  // Update qbe button
  let qbeButton = Client.eleMap[this.qbeButtonConf.id];
  Client.Widget.updateObject(qbeButton, {visible: this.showQbeButton(), tooltip: this.getTooltip(this.qbeButtonConf.id)});
  //
  // Update navigation buttons
  let showNavButtons = this.showNavButtons();
  //
  let topButton = Client.eleMap[this.topButtonConf.id];
  let prevButton = Client.eleMap[this.prevButtonConf.id];
  let nextButton = Client.eleMap[this.nextButtonConf.id];
  let bottomButton = Client.eleMap[this.bottomButtonConf.id];
  Client.Widget.updateObject(topButton, {visible: showNavButtons});
  Client.Widget.updateObject(prevButton, {visible: showNavButtons});
  Client.Widget.updateObject(nextButton, {visible: showNavButtons});
  Client.Widget.updateObject(bottomButton, {visible: showNavButtons});
  //
  // Update search button
  let searchButton = Client.eleMap[this.searchButtonConf.id];
  Client.Widget.updateObject(searchButton, {visible: this.showSearchButton()});
  //
  // Update find button
  let findButton = Client.eleMap[this.findButtonConf.id];
  Client.Widget.updateObject(findButton, {visible: this.showFindButton()});
  //
  // Update formList button
  let formListButton = Client.eleMap[this.formListButtonConf.id];
  Client.Widget.updateObject(formListButton, {visible: this.showFormListButton(false)});
  //
  // Update automatic layout formList button
  let formListAutoButton = Client.eleMap[this.formListAutoButtonConf.id];
  Client.Widget.updateObject(formListAutoButton, {visible: this.showFormListButton(true)});
  //
  // Update cancel button
  let cancelButton = Client.eleMap[this.cancelButtonConf.id];
  Client.Widget.updateObject(cancelButton, {visible: this.showCancelButton(), tooltip: this.getTooltip(cancelButton.id)});
  //
  // Update refresh button
  let refreshButton = Client.eleMap[this.refreshButtonConf.id];
  Client.Widget.updateObject(refreshButton, {visible: this.showRefreshButton()});
  //
  // Update delete button
  let deleteButton = Client.eleMap[this.deleteButtonConf.id];
  Client.Widget.updateObject(deleteButton, {visible: this.showDeleteButton()});
  //
  // Update insert button
  let insertButton = Client.eleMap[this.insertButtonConf.id];
  Client.Widget.updateObject(insertButton, {visible: this.showInsertButton()});
  //
  // Update duplicate button
  let duplicateButton = Client.eleMap[this.duplicateButtonConf.id];
  Client.Widget.updateObject(duplicateButton, {visible: this.showDuplicateButton()});
  //
  // Update save button
  let saveButton = Client.eleMap[this.saveButtonConf.id];
  Client.Widget.updateObject(saveButton, {visible: this.showSaveButton()});
  //
  // Update print button
  let printButton = Client.eleMap[this.printButtonConf.id];
  Client.Widget.updateObject(printButton, {visible: this.showPrintButton()});
  //
  // Update group button
  let groupButton = Client.eleMap[this.groupButtonConf.id];
  Client.Widget.updateObject(groupButton, {visible: this.showGroupButton(), icon: this.showGroups ? "contract" : "grid"});
  //
  // Update csv button
  let csvButton = Client.eleMap[this.csvButtonConf.id];
  Client.Widget.updateObject(csvButton, {visible: this.showCsvButton()});
  //
  // Update attach button
  let attachButton = Client.eleMap[this.attachButtonConf.id];
  Client.Widget.updateObject(attachButton, {visible: this.showAttachButton()});
  //
  // Update custom buttons
  let small = this.smallIcons ? " small" : "";
  for (let i = 0; i < this.customCommands.length; i++) {
    let customButton = Client.eleMap[this.customButtonsConf[i].id];
    //
    let className;
    let {caption, image} = this.customCommands[i];
    if (image)
      Client.Widget.setIconImage({image, el: customButton});
    //
    className = "generic-btn panel-toolbar-btn " + (Client.Widget.isIconImage(image) ? "" : " image") + " custom-btn" + (i + 1) + small;
    //
    Client.Widget.updateObject(customButton, {label: caption, tooltip: this.getTooltip(this.customButtonsConf[i].id), className, visible: this.showCustomButton(i)});
  }
  //
  // Update mobile search visibility (only in list)
  if (this.toolbarFirstZoneConf) {
    let searchToolbar = Client.eleMap[this.toolbarConf.children[1].id];
    Client.Widget.updateObject(searchToolbar, {visible: this.layout === Client.IdfPanel.layouts.list});
    //
    searchToolbar = Client.eleMap[this.toolbarConf.id];
    Client.Widget.updateElementClassName(searchToolbar, "mobile-toolbar-vertical-container", this.layout !== Client.IdfPanel.layouts.list);
  }
  //
  // Update fields blob controls
  for (let j = 0; j < this.fields.length; j++)
    this.fields[j].updateBlob();
  //
  // Check mobile buttons
  this.parentIdfView?.checkMobileButtons();
};


/**
 * Get zone for given command
 * @param {Integer} commandIndex
 */
Client.IdfPanel.prototype.getCommandZone = function (commandIndex)
{
  if (Client.mainFrame.isIDF)
    return Client.mainFrame.wep.getCommandZone(commandIndex);
  //
  return this.commandsZones[commandIndex];
};


/**
 * Return true if navigating panel data using navigation button is allowed
 */
Client.IdfPanel.prototype.canNavigate = function ()
{
  if (Client.mainFrame.isIDF)
    return this.status === Client.IdfPanel.statuses.data && (this.allowNavigationWhenModified || !this.DOModified);
  else
    return this.status !== Client.IdfPanel.statuses.qbe;
};


/**
 * Return true if given command is enabled
 * @param {Integer} cmd
 */
Client.IdfPanel.prototype.isCommandEnabled = function (cmd)
{
  // If cmd is a common command
  if (cmd > 0) {
    let blobCommands = [Client.IdfPanel.commands.CMD_BLOBEDIT, Client.IdfPanel.commands.CMD_BLOBDELETE, Client.IdfPanel.commands.CMD_BLOBNEW, Client.IdfPanel.commands.CMD_BLOBSAVEAS];
    return !!(this.enabledCommands & cmd) && (this.showToolbar || blobCommands.includes(cmd)) && !this.collapsed;
  }
  else // Otherwise if is a custom command
    return !!(this.extEnabledCommands & Math.abs(cmd)) && this.showToolbar && !this.collapsed;
};


/**
 * Handle small icons changing css classes to toolbar elements
 */
Client.IdfPanel.prototype.handleSmallIcons = function ()
{
  Client.IdfFrame.prototype.handleSmallIcons.call(this);
  //
  for (let i = 0; i < this.toolbarZonesConfig.length; i++) {
    let toolbarZone = Client.eleMap[this.toolbarZonesConfig[i].id];
    if (!toolbarZone)
      continue;
    //
    // Set "small" class on current toolbar zone children
    for (let j = 0; j < toolbarZone.elements.length; j++) {
      let el = toolbarZone.elements[j];
      Client.Widget.updateElementClassName(el, "small", !this.smallIcons);
    }
  }
  //
  // Set "small" class on status bar
  let statusbar = Client.eleMap[this.statusbarConf.id];
  Client.Widget.updateElementClassName(statusbar, "small", !this.smallIcons);
};


/**
 * Get tooltip for given object
 * @param {String} objId
 */
Client.IdfPanel.prototype.getTooltip = function (objId)
{
  let tooltip = Client.IdfFrame.prototype.getTooltip.call(this, objId);
  //
  if (tooltip)
    return tooltip;
  //
  let wep = Client.mainFrame.wep;
  let title, content, fknum;
  //
  switch (objId) {
    case this.qbeButtonConf.id:
      if (this.qbeTip) {
        title = Client.IdfResources.t("TIP_TITLE_QbeTip");
        content = this.qbeTip;
      }
      break;

    case this.topButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_PanelStart");
      content = wep?.SRV_MSG_PanelStart || Client.IdfResources.t("SRV_MSG_PanelStart");
      break;

    case this.prevButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_PanelPrevPage");
      content = wep?.SRV_MSG_PanelPrevPage || Client.IdfResources.t("SRV_MSG_PanelPrevPage");
      break;

    case this.nextButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_PanelNextPage");
      content = wep?.SRV_MSG_PanelNextPage || Client.IdfResources.t("SRV_MSG_PanelNextPage");
      break;

    case this.bottomButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_PanelEnd");
      content = wep?.SRV_MSG_PanelEnd || Client.IdfResources.t("SRV_MSG_PanelEnd");
      break;

    case this.searchButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Search");
      content = wep?.SRV_MSG_Search || Client.IdfResources.t("SRV_MSG_Search");
      fknum = Client.IdfPanel.FKEnterQBE;
      break;

    case this.findButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Find");
      content = wep?.SRV_MSG_Find || Client.IdfResources.t("SRV_MSG_Find");
      fknum = Client.IdfPanel.FKFindData;
      break;

    case this.formListButtonConf.id:
    case this.formListAutoButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_FormList");
      content = wep?.SRV_MSG_FormList || Client.IdfResources.t("SRV_MSG_FormList");
      if (objId === this.formListAutoButtonConf?.id)
        content = Client.IdfResources.t("SRV_MSG_FormListAuto");
      fknum = Client.IdfPanel.FKFormList;
      break;

    case this.cancelButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Cancel");
      content = wep?.SRV_MSG_Cancel || Client.IdfResources.t("SRV_MSG_Cancel");
      //
      if (this.status === Client.IdfPanel.statuses.qbe && !Client.mainFrame.isIDF)
        content = Client.IdfResources.t("SRV_MSG_ClearFilters");
      //
      fknum = Client.IdfPanel.FKCancel;
      break;

    case this.refreshButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Reload");
      content = wep?.SRV_MSG_Reload || Client.IdfResources.t("SRV_MSG_Reload");
      fknum = Client.IdfPanel.FKRefresh;
      break;

    case this.deleteButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Delete");
      content = wep?.SRV_MSG_Delete || Client.IdfResources.t("SRV_MSG_Delete");
      fknum = Client.IdfPanel.FKDelete;
      break;

    case this.insertButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Insert");
      content = wep?.SRV_MSG_Insert || Client.IdfResources.t("SRV_MSG_Insert");
      fknum = Client.IdfPanel.FKInsert;
      break;

    case this.duplicateButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Duplicate");
      content = wep?.SRV_MSG_Duplicate || Client.IdfResources.t("SRV_MSG_Duplicate");
      fknum = Client.IdfPanel.FKDuplicate;
      break;

    case this.saveButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Update");
      content = wep?.SRV_MSG_Update || Client.IdfResources.t("SRV_MSG_Update");
      fknum = Client.IdfPanel.FKUpdate;
      break;

    case this.printButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Print");
      content = wep?.SRV_MSG_Print || Client.IdfResources.t("SRV_MSG_Print");
      fknum = Client.IdfPanel.FKPrint;
      break;

    case this.csvButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Export");
      content = wep?.SRV_MSG_Export || Client.IdfResources.t("SRV_MSG_Export");
      break;

    case this.attachButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Attach");
      content = wep?.SRV_MSG_Attach || Client.IdfResources.t("SRV_MSG_Attach");
      break;

    case this.groupButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Group");
      content = wep?.SRV_MSG_Group || Client.IdfResources.t("SRV_MSG_Group");
      break;

    default:
      if (objId === this.multiSelButtonConf?.id) {
        title = Client.IdfResources.t("TIP_TITLE_ShowMultiSel");
        //
        let resourceName = this.showMultipleSelection ? "SRV_MSG_ShowSelCommands" : "SRV_MSG_ShowMultiSel";
        content = wep?.[resourceName] || Client.IdfResources.t(resourceName);
      }
      else {
        for (let i = 0; i < this.customButtonsConf.length; i++) {
          if (this.customButtonsConf[i].id === objId) {
            title = this.customCommands[i].caption;
            content = this.customCommands[i].tooltip;
            fknum = this.customCommands[i].fknum;
            break;
          }
        }
      }
      break;
  }
  //
  tooltip = Client.Widget.getHTMLTooltip(title, content, fknum);
  //
  return tooltip;
};


/**
 * Update status bar
 */
Client.IdfPanel.prototype.updateStatusbar = function ()
{
  let visible = (this.showStatusbar && !this.collapsed);
  let innerText = "";
  let className = "";
  let noResultsText = "";
  //
  let status = (this.DOModified && this.DOMaster) ? Client.IdfPanel.statuses.updated : this.status;
  //
  // Get status bar text
  switch (status) {
    case Client.IdfPanel.statuses.qbe:
      innerText = Client.IdfResources.t("SRV_MSG_StatusQBE");
      className = "qbe";
      break;

    case Client.IdfPanel.statuses.data:
      let totalRows = this.getTotalRows(true);
      let activeRowIndex = this.getActiveRowIndex(true);
      //
      if (this.hasList && !this.lastRow && !Client.mainFrame.isIDF) {
        if (this.noDataLoaded) {
          innerText = Client.IdfResources.t("MSG_StatusNoRows");
          //
          noResultsText = Client.IdfResources.t("MSG_NoRows");
          let secondaryText = "";
          if (this.canUseRowQbe() && this.hasFilters() && this.canInsert)
            secondaryText = Client.IdfResources.t("MSG_NoRowsClearInsert");
          else if (this.canUseRowQbe() && this.hasFilters())
            secondaryText = Client.IdfResources.t("MSG_NoRowsClear");
          else if (!this.hasFilters() && this.canInsert)
            secondaryText = Client.IdfResources.t("MSG_NoRowsInsert");
          //
          if (secondaryText) {
            let iconText;
            let captionData = Client.Widget.extractCaptionData(secondaryText);
            //
            // Replace first icon
            if (captionData.icon) {
              iconText = "{{icon-" + captionData.icon.replace("fa ", "") + "}}";
              secondaryText = secondaryText.replace(iconText, this.getHTMLIcon(secondaryText, true));
            }
            //
            captionData = Client.Widget.extractCaptionData(secondaryText);
            //
            // Replace second icon
            if (captionData.icon) {
              iconText = "{{icon-" + captionData.icon.replace("fa ", "") + "}}";
              secondaryText = secondaryText.replace(iconText, this.getHTMLIcon(secondaryText, true));
            }
            //
            noResultsText = "<div>" + noResultsText + ".</div>" + "<div>" + secondaryText + "</div>";
          }
        }
      }
      else if (this.isNewRow()) {
        if (this.canInsert)
          innerText = Client.IdfResources.t("SRV_MSG_StatusInsert");
        else
          innerText = Client.IdfResources.t("SRV_MSG_StatusData1", [activeRowIndex]);
      }
      else if (!this.showMultipleSelection || this.layout === Client.IdfPanel.layouts.form)
        innerText = Client.IdfResources.t("SRV_MSG_RowNumOf", [activeRowIndex, totalRows + (this.moreRows ? "+" : "")]);
      else {
        let selectedRows = this.showMultipleSelection ? this.getSelectedDataRows() : 0;
        if (selectedRows === 1)
          innerText = Client.IdfResources.t("PAN_STBAR_SelRow", [totalRows]);
        else
          innerText = Client.IdfResources.t("PAN_STBAR_SelRows", [totalRows, selectedRows]);
      }
      break;

    case Client.IdfPanel.statuses.updated:
      innerText = Client.IdfResources.t("SRV_MSG_StatusUpdated");
      className = "updated";
      break;
  }
  //
  // In case of single doc remove text and className (I don't want to see "Row 1 of 1)
  if (this.DOSingleDoc && (!this.DOMaster || !this.DOModified)) {
    innerText = "";
    className = "";
  }
  //
  // Update status bar element
  let statusbar = Client.eleMap[this.statusbarConf.id];
  Client.Widget.updateObject(statusbar, {innerText, visible});
  //
  Client.Widget.updateElementClassName(statusbar, "updated", className !== "updated");
  Client.Widget.updateElementClassName(statusbar, "qbe", className !== "qbe");
  //
  // Update no results elements
  if (!Client.mainFrame.isIDF && this.hasList) {
    let noResultsTextContainer = Client.eleMap[this.noResultsTextConf.id];
    Client.Widget.updateObject(noResultsTextContainer, {innerHTML: noResultsText});
    //
    let noResultsContainer = Client.eleMap[this.noResultsRowConf.id];
    Client.Widget.updateObject(noResultsContainer, {visible: !this.lastRow});
  }
};


/**
 * Update layout (list/form)
 */
Client.IdfPanel.prototype.updateLayout = function ()
{
  if (this.layout === Client.IdfPanel.layouts.list) {
    this.setActiveRow(true);
    //
    if (!this.numRows)
      this.scrollToDataRow(this.getActiveRowIndex());
  }
  else
    this.scrollToDataRow(this.getActiveRowIndex());
  //
  let hadFocus = this.hasFocus(true);
  let done = () => {
    if (hadFocus)
      this.focus();
  };
  //
  let panelContainer = Client.eleMap[this.panelContainerConf.id];
  if (panelContainer.selectedPage === this.layout)
    done();
  else {
    // Update selected page
    panelContainer.updateElement({selectedPage: this.layout});
    //
    // During slide animation, the scrollbars would appear. So set overflow to hidden and reset it after animation end
    let contentEl = Client.eleMap[this.contentContainerConf.id];
    contentEl.updateElement({style: {overflow: "hidden"}});
    //
    // During the animation we cannot handle the focus, otherwise the browser will move the scroll and break the animation.
    // so we wait the end of animation to focus the panel.
    panelContainer.onEndAnimation = () => {
      delete panelContainer.onEndAnimation;
      contentEl.updateElement({style: {overflow: ""}});
      done();
    };
  }
  //
  let isClientSide;
  if (Client.mainFrame.isIDF)
    isClientSide = Client.IdfMessagesPump.isClientSideEvent(this.toolbarEventDef) && Client.mainFrame.idfMobile;
  else
    isClientSide = !this.events.includes("onCommand") && !this.events.includes("onLockingChanging");
  //
  if (this.automaticLayout && this.layout === Client.IdfPanel.layouts.list && isClientSide)
    this.updateElement({locked: true});
};


/**
 * Update multiple selection
 * @param {Object} options
 */
Client.IdfPanel.prototype.updateMultiSel = function (options)
{
  options = options || {};
  //
  let totalRows = this.getTotalRows(true);
  //
  let index = options.index;
  let value = !!options.value;
  //
  let start = index ?? 1;
  let end = index ?? totalRows;
  //
  if (index === undefined && this.selectOnlyVisibleRows && !options.force) {
    start = this.actualPosition;
    end = this.actualPosition + this.getNumRows() - 1;
    //
    if (end > totalRows)
      end = totalRows;
  }
  //
  let hasGroupedRows = this.hasGroupedRows();
  if (hasGroupedRows) {
    start = this.groupedRowsRoot.realIndexToGroupedIndex(start);
    end = this.groupedRowsRoot.realIndexToGroupedIndex(end);
  }
  //
  for (let i = start; i <= end; i++) {
    let rowIndex = i;
    //
    if (hasGroupedRows) {
      // If current row is a rows group header, continue
      if (this.getRowsGroupByIndex(i))
        continue;
      //
      rowIndex = this.groupedRowsRoot.realIndexToGroupedIndex(i);
    }
    //
    this.multiSelStatus[i] = options.reverse ? !this.multiSelStatus[i] : value;
    this.fields.forEach(f => f.selectRow(this.multiSelStatus[i], rowIndex));
  }
  //
  // If I have no index it means I have to update multiple selection on all rows.
  // Since sometimes multiSelStatus length could be greater than totalRows (for example, just after deleting some rows), truncate it at totalRows
  if (index === undefined)
    this.multiSelStatus.length = (this.status !== Client.IdfPanel.statuses.qbe ? this.getTotalRows() + 1 : 1);
  //
  this.updateStatusbar();
};


/**
 * Get list/form container width
 */
Client.IdfPanel.prototype.getContainerWidth = function (form)
{
  let width = this.originalWidth;
  //
  // Remove idfView's frames container margins
  width -= (this.parentIdfView?.getFramesContainerHorizontalMargins() || 0);
  //
  // Remove container margins and paddings
  if (form && this.formContainerConf)
    width -= this.formContainerHorizontalMargins;
  else if (!form && this.listContainerConf)
    width -= this.listContainerHorizontalMargins;
  //
  return width;
};


/**
 * Get list/form container height
 */
Client.IdfPanel.prototype.getContainerHeight = function (form)
{
  let height = this.originalHeight;
  //
  // Remove toolbar height
  height -= this.getToolbarHeight();
  //
  // Remove pages container height
  height -= this.getPagesContainerHeight();
  //
  // Remove idfView's frames container margins
  height -= (this.parentIdfView?.getFramesContainerVerticalMargins() || 0);
  //
  // Remove tabbar height if I'm inside an IdfTab
  if (this.parent instanceof Client.IdfTab)
    height -= this.parent.parent.getTabbarHeight();
  //
  // Remove container vertical margins and paddings
  if (form && this.formContainerConf)
    height -= this.formContainerVerticalMargins;
  else if (!form && this.listContainerConf)
    height -= this.listContainerVerticalMargins;
  //
  return height;
};


/**
 * Get header height
 */
Client.IdfPanel.prototype.getHeaderHeight = function ()
{
  return this.headerHeight;
};


/**
 * Get QBE row height
 */
Client.IdfPanel.prototype.getQbeRowHeight = function ()
{
  return this.canUseRowQbe() ? this.getListRowHeight() : 0;
};


/**
 * Get header offset from visual style
 */
Client.IdfPanel.prototype.getHeaderOffset = function ()
{
  let visualStyle = Client.IdfVisualStyle.getByIndex(this.visualStyle);
  //
  return visualStyle ? visualStyle.getHeaderOffset() || 0 : 0;
};


/**
 * Get height of a list row
 * If selField param is set and the panel has multiple subrows we must return the max height of the subrow wich contains the field
 * If selField param is NOT set and the panel has multiple subrows we must return the sum of the max values of the single subrows
 * @param {Client.IdfField} selField
 */
Client.IdfPanel.prototype.getListRowHeight = function (selField)
{
  let height = Client.IdfPanel.defaultListRowHeight;
  //
  // If panel has dynamic height rows, list rows have not a specific height.
  // So when I need to know the row height I use the default one
  // (for example when I have to calculate margin top and bottom between two data blocks in the list)
  if (this.hasDynamicHeightRows())
    return height;
  //
  let totalSumMaxFieldHeight = 0;
  let maxFieldHeight = -1;
  //
  let fieldList = this.fields;
  if (selField && this.numSubRows > 1) {
    let row = this.wrapRows[selField.id];
    fieldList = fieldList.filter((fieldElement) => this.wrapRows[fieldElement.id] === row);
  }
  //
  // Ask fields their heights and get the max
  for (let i = 0; i < fieldList.length; i++) {
    let field = fieldList[i];
    if (field.isInList()) {
      if (field.rowBreakBefore && !selField) {
        // new subRow, reset the max to -1 and add the total of the current subrow
        totalSumMaxFieldHeight += maxFieldHeight;
        maxFieldHeight = -1;
      }
      //
      let fieldHeight = field.getRects().height;
      //
      if (fieldHeight > maxFieldHeight)
        maxFieldHeight = fieldHeight;
    }
  }
  //
  // Add the last row
  if (this.numSubRows > 1 && !selField)
    totalSumMaxFieldHeight += maxFieldHeight;
  //
  // If there is a valid max field height, this is the list row height
  if (maxFieldHeight >= 0 || totalSumMaxFieldHeight > 0) {
    height = maxFieldHeight;
    //
    if (this.numSubRows > 1 && !selField && totalSumMaxFieldHeight > 0)
      height = totalSumMaxFieldHeight;
  }
  //
  return height;
};


/**
 * Get row offset from visual style
 */
Client.IdfPanel.prototype.getListRowOffset = function ()
{
  let visualStyle = Client.IdfVisualStyle.getByIndex(this.visualStyle);
  //
  return visualStyle ? visualStyle.getRowOffset() || 0 : 0;
};


/**
 * Get number of visible rows
 */
Client.IdfPanel.prototype.getNumRows = function ()
{
  if (this.numRows !== undefined)
    return this.numRows;
  //
  let numRows = 0;
  //
  // Get grid element
  let gridDomObj = Client.eleMap[this.gridConf.id].getRootObject();
  //
  // Get visible rows top and bottom
  let visibleRowsTop = gridDomObj.scrollTop + this.getHeaderHeight() + this.getQbeRowHeight();
  let visibleRowsBottom = gridDomObj.scrollTop + gridDomObj.clientHeight;
  //
  let listRowOffset = this.getListRowOffset();
  //
  let hasGroupedRows = this.hasGroupedRows();
  let totalRows = this.getTotalRows();
  //
  for (let i = 1; i <= totalRows; i++) {
    // If current data row exists
    let rowEl = this.getRow(i);
    if (!rowEl)
      continue;
    //
    // In case of grouped rows, skip rows belonging to collapsed groups
    if (hasGroupedRows && !this.groupedRowsRoot.isRowVisible(i))
      continue;
    //
    let rowDom = rowEl.getRootObject();
    //
    // Get current row top and bottom
    let rowOffset = i === 1 ? 0 : listRowOffset;
    let rowTop = rowDom.offsetTop + rowOffset;
    let rowBottom = rowDom.offsetTop + rowDom.clientHeight;
    //
    // If current row is visible
    if (rowTop >= visibleRowsTop && rowBottom <= visibleRowsBottom)
      numRows++;
    //
    // If I'm out of visible rows window, exit
    if (rowTop > visibleRowsBottom)
      break;
  }
  //
  return numRows;
};


/**
 * Get maximum number of rows
 * @param {Boolean} skipNumRows
 */
Client.IdfPanel.prototype.getMaxRows = function (skipNumRows)
{
  // Get index of last data row
  let inListField = this.fields.find(f => f.isInList() && f.isVisible());
  let lastValueIndex = inListField?.values.findLastIndex(val => !!val) ?? -1;
  //
  let totalRows = this.getTotalRows();
  //
  // Last value index can be greater than total rows count when there are new rows, so get the max among the two values
  let maxIndex = Math.max(totalRows, lastValueIndex);
  //
  return maxIndex + (skipNumRows ? 0 : this.getNumRows());
};


Client.IdfPanel.prototype.getFrameList = function (flist)
{
  // TODO:
  // Get all subframes and push them into the list
  // -> the panel is already pushed
};


/**
 * Realize toolbar command set
 * @param {Object} cmsConf
 */
Client.IdfPanel.prototype.realizeCommandSet = function (cmsConf)
{
  // Get commands set zone
  let cmsZoneIdx = this.getCommandZone(Client.IdfPanel.commands.CZ_CMDSET);
  let cmsZoneConf = this.toolbarZonesConfig[cmsZoneIdx];
  let cmsZone = Client.eleMap[cmsZoneConf.id];
  //
  // Since empty zones are created invisible, set it visible
  cmsZone.updateElement({visible: true});
  //
  // Create command set
  cmsZone.insertBefore({child: cmsConf});
};


/**
 * Handle reset cache command
 * @param {Object} options
 */
Client.IdfPanel.prototype.resetCache = function (options)
{
  // In case of grouped rows, convert indexes into grouped form
  if (this.hasGroupedRows()) {
    if (options.from)
      options.from = this.groupedRowsRoot.realIndexToGroupedIndex(options.from);
    //
    if (options.to)
      options.to = this.groupedRowsRoot.realIndexToGroupedIndex(options.to);
    //
    if (options.dataBlockStart)
      options.dataBlockStart = this.groupedRowsRoot.realIndexToGroupedIndex(options.dataBlockStart);
    //
    if (options.dataBlockEnd)
      options.dataBlockEnd = this.groupedRowsRoot.realIndexToGroupedIndex(options.dataBlockEnd);
  }
  //
  // Tell my groups to reset cache
  for (let i = 0; i < this.groups.length; i++)
    this.groups[i].resetCache(options);
  //
  // Tell my fields to reset cache
  for (let i = 0; i < this.fields.length; i++)
    this.fields[i].resetCache(options);
  //
  let from = options.from ?? 1;
  let to = options.to ?? this.getMaxRows(true);
  let dataBlockStart = options.dataBlockStart;
  let dataBlockEnd = options.dataBlockEnd;
  //
  // Delete old rows range
  if (options.from === undefined && this.firstRow)
    from = this.firstRow;
  if (options.to === undefined && this.lastRow)
    to = this.lastRow;
  //
  // I check if there is a pending focus on a row (duplication case)
  // to restore the focus after destroying the rows
  let focusingFieldValue;
  if (Client.Element.lastFocusedElement?.focusTimeout && this.getRootObject().contains(Client.Element.lastFocusedElement.getRootObject()))
    focusingFieldValue = Client.Widget.getWidgetByElement(Client.Element.lastFocusedElement)?.getParentWidgetByClass(Client.IdfFieldValue);
  //
  // Remove rows elements from dom
  for (let i = from; i <= to; i++) {
    // If I have a data block coming after reset cache, I don't have to remove rows belonging to that block. It's better to reuse them
    if (i >= dataBlockStart && i <= dataBlockEnd) {
      this.resetCachedStyles(i);
      continue;
    }
    //
    let row = this.rows[i];
    if (!row)
      continue;
    //
    this.detachRow(i, true);
  }
  //
  for (let i = dataBlockStart; i <= dataBlockEnd; i++) {
    let row = this.rows[i];
    if (!row)
      this.resetCachedStyles(i);
  }
  //
  if (!options.skipBufferVideo)
    this.fillBufferVideo({start: dataBlockStart, end: dataBlockEnd, maxReusableRows: dataBlockEnd});
  //
  if (focusingFieldValue)
    focusingFieldValue.parentField.focus({absoluteRow: focusingFieldValue.index});
};


/**
 * Return true if current row is new
 * @param {Integer} index
 */
Client.IdfPanel.prototype.isNewRow = function (index)
{
  return (index ?? this.getActiveRowIndex()) > this.getTotalRows();
};


/**
 * Update active page
 */
Client.IdfPanel.prototype.updateActivePage = function ()
{
  for (let i = 0; i < this.pages.length; i++) {
    let page = this.pages[i];
    page.updateElement({isActive: page.index === this.activePage});
  }
  //
  if (!this.lastFocusedFieldInForm?.isVisible(true))
    delete this.lastFocusedFieldInForm;
  //
  if (this.lastFocusedFieldValueInList?.parentField.isVisible())
    delete this.lastFocusedFieldValueInList;
  //
  this.focus({ifJustFocused: true});
};


/**
 * Check if this panel can use row QBE
 */
Client.IdfPanel.prototype.canUseRowQbe = function ()
{
  return this.searchMode === Client.IdfPanel.searchModes.row && this.canSearch && this.hasList;
};


/**
 * Handle a resize event
 */
Client.IdfPanel.prototype.handleResize = function ()
{
  let events = [];
  //
  // Skip resize when a parent is invisible
  if (!this.isVisible())
    return events;
  //
  events.push(...Client.IdfFrame.prototype.handleResize.call(this));
  //
  if (this.hasListLayout() && this.layout === Client.IdfPanel.layouts.list) {
    // If the list has the horizontal scrollbar the flex system with the subrows is screwed,
    // is impossibile to have the subrows with the same width.
    // In that case we need to clear the old value, measure the rows and force them to the max width
    this.updateSubRowsWidth();
    //
    this.calcDimensions();
    //
    let width = this.calculatedGridWidth;
    let height = this.calculatedGridHeight;
    //
    if (!width || !height)
      return [];
    //
    if (width !== this.lastGridWidth) {
      if (Client.mainFrame.isIDF) {
        if (this.canAdaptWidth()) {
          events.push({
            id: "resize",
            def: Client.IdfMessagesPump.eventTypes.ACTIVE,
            content: {
              oid: this.id,
              obn: "listwidth",
              par1: width,
              par2: 0
            }
          });
        }
      }
      else {
        // TODO
      }
    }
    //
    // Get listRow height and offset
    let listRowHeight = this.getListRowHeight();
    let listRowOffset = this.getListRowOffset();
    let totalListRowHeight = listRowHeight + listRowOffset;
    //
    // Get aggregate row height
    let aggregateRowHeight = this.visibleAggregateFields.length ? listRowHeight : 0;
    //
    // Calculate list container height
    let headerHeight = this.getHeaderHeight() + this.getHeaderOffset() + this.getQbeRowHeight();
    let listContainerHeight = height - headerHeight - aggregateRowHeight;
    //
    // Calculate numRows and then adjust height to make server (IDF) handle half rows properly
    let round = Client.mainFrame.isIDF ? Math.floor : Math.ceil;
    let numRows = round(listContainerHeight / totalListRowHeight);
    //
    this.adjustScrollbar();
    //
    if (height !== this.lastGridHeight) {
      if (Client.mainFrame.isIDF) {
        if (this.canAdaptHeight()) {
          events.push({
            id: "resize",
            def: Client.IdfMessagesPump.eventTypes.ACTIVE,
            content: {
              oid: this.id,
              obn: "height",
              par1: height,
              par2: numRows
            }
          });
        }
      }
      else {
        this.updateElement({numRows});
        //
        events.push({
          id: "chgProp",
          obj: this.id,
          content: {
            name: "numRows",
            value: numRows,
            clid: Client.id
          }
        });
      }
    }
    //
    this.lastGridWidth = width;
    this.lastGridHeight = height;
  }
  //
  // TODO: il ridimensionamento degli oggetti interni al pannello (griglia e campi) viene gestito automaticamente tramite il flex-grow.
  // Quindi per adesso non gestiamo il resize sugli oggetti interni al pannello (griglia e campi)
  // e ci pensiamo quando gestiremo il resize e lo spostamento dei campi a run time.
  //
  // Call handleResize method on my fields too if my parent column is the most right column
  if (this.getListFieldColumn(this.id)?.isMostRight) {
    for (let i = 0; i < this.fields.length; i++)
      events.push(...this.fields[i].handleResize());
  }
  //
  return events;
};


/**
 * Give focus to the element
 * @param {Object} options
 */
Client.IdfPanel.prototype.focus = function (options)
{
  if (this.collapsed || Client.mainFrame.idfMobile)
    return;
  //
  options = options || {};
  //
  if (options.ifJustFocused && !this.hasFocus(true))
    return;
  //
  // If I'm already focusing one of my children (and it's in the correct layout) that's fine
  if (Client.Element.lastFocusedElement?.focusTimeout) {
    let layoutContainer = Client.eleMap[(this.layout === Client.IdfPanel.layouts.list ? this.listContainerConf : this.formContainerConf).id];
    if (Client.Utils.isMyParentEl(Client.Element.lastFocusedElement, layoutContainer))
      return;
  }
  //
  // When search mode is "row" we can set the focus to the QBE row (if there isn't another focused row)
  if (this.layout === Client.IdfPanel.layouts.list && !this.lastFocusedFieldValueInList) {
    if (!options.absoluteRow && this.canUseRowQbe())
      options.absoluteRow = 0;
    //
    options.absoluteRow = options.absoluteRow ?? this.getActiveRowIndex();
  }
  //
  let fieldToFocus;
  let fieldsFocusable = this.getFocusableFields();
  if (this.layout === Client.IdfPanel.layouts.form) {
    if (this.lastFocusedFieldInForm?.canHaveFocus())
      fieldToFocus = this.lastFocusedFieldInForm;
    else {
      if (!Client.mainFrame.isIDF) {
        fieldsFocusable = [];
        //
        // Each formStruc row has a list of objects (fields) that can be both IdfGroup and IdfField.
        // In case of IdfGroup I have to iterate over its fields and push them into fieldsFocusable array.
        // In case of IdfField simply push it
        this.formStruct?.forEach(row => {
          fieldsFocusable.push(...row.fields.flatMap(obj => {
            return Client.eleMap[obj.id] instanceof Client.IdfGroup ? Client.eleMap[obj.id].fields.map(f => Client.eleMap[f.id]) : Client.eleMap[obj.id];
          }));
        });
      }
    }
  }
  else {
    if (this.lastFocusedFieldValueInList?.parentField.canHaveFocus()) {
      fieldToFocus = this.lastFocusedFieldValueInList.parentField;
      options.absoluteRow = options.absoluteRow ?? this.lastFocusedFieldValueInList.index;
    }
  }
  //
  if (!fieldToFocus) {
    let form = this.layout === Client.IdfPanel.layouts.form;
    fieldToFocus = fieldsFocusable.find(f => f?.isVisible(form) && f?.isEnabled() && !f?.isStatic());
    if (!fieldToFocus)
      fieldToFocus = fieldsFocusable.find(f => f?.isVisible(form) && !f?.isStatic());
  }
  //
  if (fieldToFocus?.focus(options))
    return;
  //
  this.mainObjects[0].focus();
};


/**
 * Focus near control
 * @param {Object} options
 */
Client.IdfPanel.prototype.focusNearControl = function (options)
{
  let events = [];
  //
  let focusOptions = {
    selectionStart: options.selectionStart,
    selectionEnd: options.selectionEnd,
    skipAnimationCheck: true
  };
  //
  // In form I don't move between the rows
  if (options.row && this.layout === Client.IdfPanel.layouts.form) {
    options.column = options.row;
    delete options.row;
  }
  //
  let field = options.fieldValue.parentField;
  let row = options.fieldValue.index;
  if (options.column) {
    let fields = this.getFocusableFields(row);
    let nearIdx = fields.findIndex(f => f === field) + options.column;
    //
    // In the form layout I keep cycling through the fields
    if (this.layout === Client.IdfPanel.layouts.form)
      nearIdx = nearIdx % fields.length;
    //
    let nearField = fields[nearIdx];
    if (nearField) {
      // Focus near field
      nearField.focus(Object.assign({absoluteRow: row}, focusOptions));
      return events;
    }
    //
    // I got to the first or last column ... change row
    nearField = fields[options.column > 0 ? 0 : fields.length - 1];
    return this.focusNearControl(Object.assign({fieldValue: nearField.values[row], row: options.column}, focusOptions));
  }
  //
  // I don't change line in layout form
  if (this.layout === Client.IdfPanel.layouts.form)
    return events;
  //
  let scrollUp = options.row < 0;
  while (true) {
    row += options.row;
    let fv = field.getValueByIndex(row);
    if (!fv || fv.isVisible())
      break;
  }
  //
  if (this.hasGroupedRows() && this.showGroups)
    row = this.getNextGroupedVisibleRow({start: row, scrollUp});
  //
  // I can't get out of the panel rows
  if (!this.isRowBetweenLimits(row))
    return events;
  //
  let rowToScroll = row + ((scrollUp ? -1 : 1) * 5);
  //
  if (this.hasGroupedRows() && this.showGroups)
    rowToScroll = this.getNextGroupedVisibleRow({start: rowToScroll, scrollUp});
  //
  if (this.isRowBetweenLimits(rowToScroll)) {
    // I ask the server to send it to me and I raise the row change event
    if (!field.values[rowToScroll]) {
      events.push(...this.handlePanelScroll(rowToScroll, scrollUp));
      Client.mainFrame.messagesPump?.sendEvents(true);
    }
  }
  //
  // If the row I need to move to isn't there yet
  // Focus the field on the near row
  let nearFieldValue = field.getValueByIndex(row);
  if (nearFieldValue) {
    field.focus(Object.assign({absoluteRow: row}, focusOptions));
    if (scrollUp)
      this.scrollToDataRow(row);
  }
  //
  return events;
};


/**
 * Get focusable fields
 * @param {Number} row
 */
Client.IdfPanel.prototype.getFocusableFields = function (row)
{
  row = row ?? this.getActiveRowIndex();
  //
  let fields = this.fields.filter(f => f.canHaveFocus(row));
  if (this.advancedTabOrder) {
    let layout = this.layout === Client.IdfPanel.layouts.form ? "form" : "list";
    fields.sort((f1, f2) => f1[layout + "TabOrderIndex"] - f2[layout + "TabOrderIndex"]);
  }
  //
  // If i'm in form and we are not on foundation and we have the formstrucutre we nned to navigate that
  // to create the field structure
  if (!Client.mainFrame.isIDF && this.layout === Client.IdfPanel.layouts.form && this.formStruct) {
    // Cache the tab order, will be deleted if the structure changes
    if (!this.fieldsFormOrder) {
      this.fieldsFormOrder = [];
      //
      let getFieldsFromRows = (r, fls) => {
        r.cols.forEach(c => getFieldsFromCols(c, fls));
      };
      let getFieldsFromCols = (c, fls) => {
        c.rows?.forEach(gr => getFieldsFromRows(gr, fls));
        //
        if (c.fields?.length > 0 && !c.isGroup)
          fls.push(Client.eleMap[c.fields[0].id]);
      };
      //
      this.formStruct.forEach(r => getFieldsFromRows(r, this.fieldsFormOrder));
    }
    //
    fields = this.fieldsFormOrder.filter(f => f?.canHaveFocus(row));
  }
  //
  return fields;
};


/**
 * Check if row is between limits
 * @param {Number} row
 */
Client.IdfPanel.prototype.isRowBetweenLimits = function (row)
{
  return row >= (this.canUseRowQbe() ? 0 : 1) && row <= this.getMaxRows(true);
};


/**
 * Focus a row
 * @param {Number} row
 */
Client.IdfPanel.prototype.focusRow = function (row)
{
  if (this.hasGroupedRows())
    row = this.groupedRowsRoot.realIndexToGroupedIndex(row);
  //
  this.focus({absoluteRow: row});
};


/**
 * Update the mainContainerConf classes
 */
Client.IdfPanel.prototype.updateClassName = function ()
{
  let el = Client.eleMap[this.mainContainerConf.id];
  //
  let isListLayout = this.layout === Client.IdfPanel.layouts.list;
  //
  Client.Widget.updateElementClassName(el, "mode-list", !isListLayout);
  Client.Widget.updateElementClassName(el, "mode-form", isListLayout);
  Client.Widget.updateElementClassName(el, "has-list", !this.hasList);
  Client.Widget.updateElementClassName(el, "has-form", !this.hasForm);
  Client.Widget.updateElementClassName(el, "show-mulsel", !this.showMultipleSelection);
};


/**
 * Get click detail
 * @param {Object} event
 * @param {Widget} srcWidget
 */
Client.IdfPanel.prototype.getClickDetail = function (event, srcWidget)
{
  let detail = Client.IdfFrame.prototype.getClickDetail.call(this, event);
  //
  if (srcWidget instanceof Client.IdfControl)
    srcWidget = srcWidget.parentWidget;
  //
  let field;
  let row = -1;
  if (srcWidget instanceof Client.IdfFieldValue) {
    field = srcWidget.parentField.index;
    row = srcWidget.getIndex(true);
  }
  else if (srcWidget instanceof Client.IdfField)
    field = srcWidget.index;
  //
  if (srcWidget && Client.Utils.isMyParent(event?.content?.srcEvent?.target, srcWidget.rowSelectorId))
    field = undefined;
  //
  if (Client.mainFrame.isIDF) {
    detail.par4 = field ?? -1;
    detail.par5 = row;
  }
  else {
    detail.field = field;
    detail.row = row - 1;
  }
  //
  return detail;
};


/**
 * Create placeholder rows in order to avoid empty spaces on scrolling before new rows coming
 * @param {Object} options
 */
Client.IdfPanel.prototype.fillBufferVideo = function (options)
{
  options = options || {};
  //
  let {start, end} = options;
  delete options.start;
  delete options.end;
  //
  let actualPosition = this.hasGroupedRows() ? this.groupedActualPosition : this.actualPosition;
  let numRows = this.getNumRows();
  //
  // Set start row
  if (!start)
    start = actualPosition;
  //
  // Set end row
  if (!end)
    end = this.hasGroupedRows() ? this.getNextGroupedVisibleRow({start: actualPosition, iterations: numRows}) : actualPosition + numRows;
  //
  let maxIndex = this.getMaxRows(true);
  //
  options.placeholderStart = this.hasGroupedRows() ? this.getNextGroupedVisibleRow({start, iterations: numRows, scrollUp: true}) : start - numRows;
  options.placeholderEnd = this.hasGroupedRows() ? this.getNextGroupedVisibleRow({start: end, iterations: numRows}) : end + numRows;
  //
  if (options.placeholderStart < 1)
    options.placeholderStart = 1;
  if (options.placeholderEnd > maxIndex)
    options.placeholderEnd = maxIndex;
  //
  this.handleRowsReuse(options);
  //
  // Fill rows adding any missing columns
  if (this.newFields.length) {
    if (this.getRow(0))
      this.attachRow(0, true);
    for (let i = this.firstRow; i <= this.lastRow; i++) {
      if (this.getRow(i))
        this.attachRow(i, true);
    }
  }
  //
  // Reset new fields
  this.newFields = [];
  //
  this.adjustScrollbar();
};


/**
 * Set reusable rows
 * @param {Object} options
 */
Client.IdfPanel.prototype.setReusableRows = function (options)
{
  let {rowsGroup} = options;
  //
  let start, end;
  let rowsToAttach = 0, rowsToDetach = 0;
  //
  let maxRows = options.maxReusableRows ?? this.getMaxRows(true);
  //
  let hasGroupedRows = this.hasGroupedRows();
  //
  // Check how many rows can be reused
  let reusableRows = Client.mainFrame.isEditing() ? Client.IdfPanel.maxReusableRows : Math.max(Client.IdfPanel.maxReusableRows, (this.getNumRows() * 2) + 1);
  this.reusableRows = Math.min(reusableRows, maxRows);
  //
  // Check how many rows currently exist
  let existingRows = this.getExistingRows();
  //
  this.updateFirstRowIndex(this.firstRow || 0);
  this.updateLastRowIndex(this.lastRow || 0);
  //
  // If I'm collapsing a rows group having "reusableRows" rows
  if (existingRows === this.reusableRows && rowsGroup && !rowsGroup.expanded) {
    // Count existing group rows
    for (let i = rowsGroup.groupedStartingRow; i <= rowsGroup.groupedEndingRow; i++)
      rowsToDetach += this.rows[i] ? 1 : 0;
    //
    // If after collapsing group the visible rows are greater than reusable rows, I have to detach no rows. I have to reuse them instead, in order to make collapsed group rows disappear
    if (this.groupedRowsRoot.getVisibleRowsCount() >= this.reusableRows)
      rowsToDetach = 0;
    //
    start = rowsGroup.groupedEndingRow;
    end = rowsGroup.groupedStartingRow;
  }
  else if (existingRows < this.reusableRows) { // If there are fewer rows than reusable count, attach the missing ones
    if (rowsGroup && !rowsGroup.expanded) {
      // Count existing group rows
      for (let i = rowsGroup.groupedStartingRow; i <= rowsGroup.groupedEndingRow; i++)
        rowsToDetach += this.rows[i] ? 1 : 0;
      //
      start = rowsGroup.groupedEndingRow;
      end = rowsGroup.groupedStartingRow;
    }
    else {
      rowsToAttach = this.reusableRows - existingRows;
      //
      start = rowsGroup?.groupedStartingRow ?? this.lastRow + 1;
      end = rowsGroup?.groupedEndingRow ?? maxRows;
    }
  }
  else if (existingRows > this.reusableRows) { // Otherwise I have to detach some rows
    rowsToDetach = existingRows - this.reusableRows;
    //
    start = rowsGroup?.groupedEndingRow ?? this.lastRow;
    end = rowsGroup?.groupedStartingRow ?? 1;
  }
  //
  if (rowsToDetach) {
    for (let i = start; i >= end; i--) {
      if (!rowsToDetach)
        break;
      //
      if (hasGroupedRows && !this.getRow(i))
        continue;
      //
      this.detachRow(i, !hasGroupedRows);
      //
      rowsToDetach--;
      existingRows--;
    }
  }
  else if (rowsToAttach) {
    // Attach rows after last row
    for (let i = start; i <= end; i++) {
      if (!rowsToAttach)
        break;
      //
      if (hasGroupedRows && !this.groupedRowsRoot.isRowVisible(i))
        continue;
      //
      this.attachRow(i);
      rowsToAttach--;
      existingRows++;
    }
    //
    // If there are still rows to attach, attach them before first row
    if (rowsToAttach) {
      for (let i = this.firstRow - 1; i >= 1; i--) {
        if (!rowsToAttach)
          break;
        //
        if (hasGroupedRows && !this.groupedRowsRoot.isRowVisible(i))
          continue;
        //
        this.attachRow(i);
        rowsToAttach--;
        existingRows++;
      }
    }
  }
  //
  // Update first and last rows indexes
  this.updateFirstRowIndex();
  this.updateLastRowIndex();
  //
  // On IDF I try to fill buffer video with empty rows when panel has grouped rows
  if (hasGroupedRows && Client.mainFrame.isIDF && false) {
    let numRows = this.getNumRows();
    let fillingRows = numRows - existingRows;
    //
    // If I need empty rows, attach them
    if (fillingRows > 0) {
      let startInsert = maxRows + 1;
      let endInsert = maxRows + fillingRows;
      for (let i = startInsert; i <= endInsert; i++)
        this.attachRow(i);
    }
    else { // Otherwise maybe I need to delete some empty rows
      let newRows = this.getNewRows();
      //
      if (newRows) {
        let toDelete = Math.min(Math.abs(fillingRows), newRows);
        let startDelete = this.lastRow;
        let endDelete = this.lastRow - toDelete + 1;
        //
        for (let i = startDelete; i >= endDelete; i--) {
          if (this.fields[0].values[i] && !this.fields[0].values[i].clientSide)
            continue;
          //
          for (let j = 0; j < this.fields.length; j++)
            this.fields[j].resetCache({from: i, to: i});
          //
          this.detachRow(i, true);
        }
      }
    }
    //
    // Update first and last rows indexes
    this.updateFirstRowIndex();
    this.updateLastRowIndex();
  }
  //
  if (this.firstRow < 0)
    delete this.firstRow;
  if (this.lastRow < 0)
    delete this.lastRow;
};


/**
 * Handle rows reuse
 * @param {Object} options
 */
Client.IdfPanel.prototype.handleRowsReuse = function (options)
{
  options = options || {};
  let {placeholderStart, placeholderEnd, rowsGroup} = options;
  delete options.placeholderStart;
  delete options.placeholderEnd;
  //
  let groupedStart = rowsGroup?.groupedStartingRow;
  let groupedEnd = rowsGroup?.groupedEndingRow;
  //
  let existingRows = this.getExistingRows();
  //
  this.setReusableRows(options);
  //
  let hasGroupedRows = this.hasGroupedRows();
  let maxIndex = options.maxReusableRows ?? this.getMaxRows(true);
  let limit, offset, start, scrollUp = this.scrollUp;
  //
  let rowsAffected = 0, rowsInGroup = 0;
  if (rowsGroup) {
    let newExistingRows = this.getExistingRows();
    if (newExistingRows < this.reusableRows)
      return;
    //
    rowsAffected = this.getVisibleGroupedRows({start: groupedStart, end: groupedEnd, checkPhysicalRow: true});
    rowsInGroup = this.getVisibleGroupedRows({start: groupedStart, end: groupedEnd});
    if (rowsGroup.expanded) {
      let rowsAdded = newExistingRows - existingRows;
      //
      // If all group rows have been added, do nothing
      if (rowsAdded && rowsAffected === rowsAdded)
        return;
      //
      rowsAffected = Math.max(rowsInGroup - rowsAffected - rowsAdded - 1, 0);
      //
      // Otherwise I have to reuse those group rows that not have been added
      groupedStart = this.getNextGroupedVisibleRow({start: groupedStart, scrollUp, iterations: rowsAdded});
    }
    //
    scrollUp = this.getVisibleGroupedRows({end: groupedStart, checkPhysicalRow: true}) < parseInt(this.getVisibleGroupedRows({checkPhysicalRow: true}) / 2);
    placeholderStart = groupedStart;
    placeholderEnd = groupedEnd;
    //
    if (scrollUp && this.lastRow < placeholderEnd)
      this.lastRow = placeholderEnd;
    //
    if (!scrollUp && this.firstRow > placeholderStart)
      this.firstRow = placeholderStart;
  }
  //
  if (!scrollUp && placeholderStart >= this.firstRow) {
    if (rowsGroup) {
      limit = this.getNextGroupedVisibleRow({start: this.firstRow, iterations: rowsAffected});
      offset = this.getNextGroupedVisibleRow({start: groupedStart - 1, scrollUp: true});
    }
    else {
      if (placeholderStart - 1 + this.reusableRows > maxIndex)
        placeholderStart -= (placeholderStart - 1 + this.reusableRows) - maxIndex;
      //
      let prevPlaceholderStart = hasGroupedRows ? this.getNextGroupedVisibleRow({start: placeholderStart - 1, scrollUp: true}) : placeholderStart - 1;
      limit = Math.min(this.lastRow, prevPlaceholderStart);
      offset = Math.max(this.lastRow, prevPlaceholderStart);
    }
    //
    for (let i = this.firstRow; i <= limit; i++) {
      if (hasGroupedRows) {
        if (rowsGroup && !rowsGroup.expanded) {
          start = this.getNextGroupedVisibleRow({start: ((start || i) - 1), scrollUp: true});
          offset = this.getNextGroupedVisibleRow({start: offset + 1, checkPhysicalRow: true});
        }
        else {
          start = this.getNextGroupedVisibleRow({start: i, checkPhysicalRow: true});
          offset = this.getNextGroupedVisibleRow({start: offset + 1});
        }
        //
        if (offset > groupedEnd || offset > maxIndex)
          break;
        //
        if (start > limit || start > maxIndex)
          break;
      }
      else {
        start = i;
        offset++;
      }
      //
      let oldIndex = rowsGroup && !rowsGroup.expanded ? offset : start;
      let newIndex = rowsGroup && !rowsGroup.expanded ? start : offset;
      //
      let oldRow = this.rows[oldIndex];
      this.reuseRow({row: Client.eleMap[oldRow?.id], oldIndex, newIndex});
      //
      delete this.rows[oldIndex];
      this.rows[newIndex] = oldRow;
    }
    //
    this.updateFirstRowIndex(hasGroupedRows ? undefined : placeholderStart);
    this.updateLastRowIndex(hasGroupedRows ? undefined : offset);
  }
  else if (scrollUp && placeholderEnd <= this.lastRow) {
    if (rowsGroup) {
      limit = this.getNextGroupedVisibleRow({start: this.lastRow, scrollUp: true, iterations: rowsAffected});
      offset = this.getNextGroupedVisibleRow({start: groupedEnd + 1});
    }
    else {
      let range = hasGroupedRows ? this.getVisibleGroupedRows({start: placeholderStart, end: placeholderEnd}) : placeholderEnd - placeholderStart;
      if (range < this.reusableRows) {
        if (hasGroupedRows)
          placeholderEnd = Math.min(this.getNextGroupedVisibleRow({start: placeholderEnd, iterations: this.reusableRows - range}), maxIndex + 1);
        else
          placeholderEnd = Math.min(placeholderEnd + (this.reusableRows - range), maxIndex + 1);
      }
      //
      placeholderEnd = hasGroupedRows ? this.getNextGroupedVisibleRow({start: placeholderEnd}) : placeholderEnd;
      limit = Math.max(this.firstRow, placeholderEnd);
      offset = Math.min(this.firstRow, placeholderEnd);
    }
    //
    for (let i = this.lastRow; i >= limit; i--) {
      if (hasGroupedRows) {
        if (rowsGroup && !rowsGroup.expanded) {
          start = this.getNextGroupedVisibleRow({start: (start || i) + 1});
          offset = this.getNextGroupedVisibleRow({start: offset - 1, scrollUp: true, checkPhysicalRow: true});
        }
        else {
          start = this.getNextGroupedVisibleRow({start: i, scrollUp: true, checkPhysicalRow: true});
          offset = this.getNextGroupedVisibleRow({start: offset - 1, scrollUp: true});
        }
        //
        if (offset < groupedStart || offset > maxIndex)
          break;
        //
        if (start < limit || start > maxIndex)
          break;
      }
      else {
        start = i;
        offset--;
      }
      //
      // Don't reuse 0-th row
      if (offset < 1) {
        offset = 1;
        break;
      }
      //
      let oldIndex = rowsGroup && !rowsGroup.expanded ? offset : start;
      let newIndex = rowsGroup && !rowsGroup.expanded ? start : offset;
      //
      let oldRow = this.rows[oldIndex];
      this.reuseRow({row: Client.eleMap[oldRow?.id], oldIndex, newIndex});
      //
      delete this.rows[oldIndex];
      this.rows[newIndex] = oldRow;
    }
    //
    this.updateFirstRowIndex(hasGroupedRows ? undefined : offset);
    this.updateLastRowIndex(hasGroupedRows ? undefined : placeholderEnd - 1);
  }
};


/**
 * Create placeholder row configuration
 * @param {Integer} index
 */
Client.IdfPanel.prototype.createPlaceholderRowConf = function (index)
{
  let baseIndex;
  if (!this.getRow(index))
    baseIndex = this.getMostSimilarRowIndex(index);
  //
  let inListFields = this.fields.filter(f => f.isShown() && f.isInList());
  for (let f of inListFields)
    f.createFieldValue(index, baseIndex);
  //
  return this.createDataRowConfig(index, baseIndex);
};


/**
 * Called when a Field is moved, movedfield will be moved before nextField
 * @param {Client.IdfField} movedField
 * @param {Client.IdfField} nextField
 * @param {Boolean} notupdate
 */
Client.IdfPanel.prototype.reorderList = function (movedField, nextField, notupdate)
{
  // If movedField and nextField are the same, do nothing
  if (movedField === nextField)
    return;
  //
  // When dragging a field on another group the target must be the first field of the group
  if (nextField.group && movedField.group !== nextField.group)
    nextField = nextField.group.fields[0];
  //
  // If I moved a group field ALL the group fields MUST be moved
  let movedEntireGroup;
  let mFields = [];
  if (movedField.group && movedField.group !== nextField.group) {
    movedField.group.fields.forEach(element => mFields.push(element));
    movedEntireGroup = movedField.group;
  }
  else
    mFields.push(movedField);
  //
  // Check if next field is fixed
  let isNextFixed = this.isFixedField(nextField);
  //
  let events = [];
  for (let i = 0; i < mFields.length; i++) {
    // Check if moved field is fixed
    let isMovedFixed = this.isFixedField(mFields[i]);
    //
    // If I move a not fixed field before a fixed field, it becomes fixed too.
    // Otherwise if I move a fixed field before a not fixed field, it becomes not fixed too
    if (!isMovedFixed && isNextFixed)
      this.fixedColumns++;
    else if (isMovedFixed && !isNextFixed)
      this.fixedColumns--;
    //
    // First: handle the fields array, remove the target and insert him before the nextfield
    this.fields.splice(this.fields.indexOf(mFields[i]), 1);
    this.fields.splice(this.fields.indexOf(nextField), 0, mFields[i]);
    //
    // Then: same thing with the elements array
    this.elements.splice(this.elements.indexOf(mFields[i]), 1);
    this.elements.splice(this.elements.indexOf(nextField), 0, mFields[i]);
    //
    // If the target AND the source are in the same groups we need to do the same thing on the group
    if (nextField.group && mFields[i].group === nextField.group) {
      // First: handle the fields array
      nextField.group.fields.splice(nextField.group.fields.indexOf(mFields[i]), 1);
      nextField.group.fields.splice(nextField.group.fields.indexOf(nextField), 0, mFields[i]);
      //
      // Then: same thing with the elements array
      nextField.group.elements.splice(nextField.group.elements.indexOf(mFields[i]), 1);
      nextField.group.elements.splice(nextField.group.elements.indexOf(nextField), 0, mFields[i]);
    }
    //
    // Now reorder values rows
    if (!movedEntireGroup)
      for (let j = 0; j < mFields[i].values.length; j++) {
        // Get j-th values of both moved and next fields
        let movedValue = mFields[i].values[j];
        let nextValue = nextField.values[j];
        //
        // If one of them does not exits, do nothing
        if (!movedValue || !nextValue)
          continue;
        //
        // Move movedValue before nextValue
        let movedValueDomObj = Client.eleMap[movedValue.listContainerId]?.getRootObject();
        let nextValueDomObj = Client.eleMap[nextValue.listContainerId]?.getRootObject();
        if (movedValueDomObj && nextValueDomObj)
          movedValueDomObj.parentNode.insertBefore(movedValueDomObj, nextValueDomObj);
      }
    //
    if (Client.mainFrame.isIDF)
      events.push({
        id: "rdcol",
        def: Client.IdfMessagesPump.eventTypes.ACTIVE,
        content: {
          oid: this.id,
          obn: "",
          par1: mFields[i].id,
          par2: nextField.id
        }
      });
    else
      events.push({
        id: "fireOnFieldReordered",
        obj: this.id,
        content: {
          sourceField: mFields[i].id,
          targetField: nextField.id
        }
      });
  }
  //
  if (movedEntireGroup) {
    // We need also to reorder the group array if i moved a group before another group
    if (nextField.group && movedField.group && nextField.group !== movedField.group) {
      this.groups.splice(this.groups.indexOf(movedField.group), 1);
      this.groups.splice(this.groups.indexOf(nextField.group), 0, movedField.group);
    }
    //
    for (let j = 0; j < nextField.values.length; j++) {
      // Get j-th values of both moved and next fields
      let movedValue = movedEntireGroup.listContainersConf[j];
      let nextValue = nextField.values[j];
      //
      // If one of them does not exits, do nothing
      if (!movedValue || !nextValue)
        continue;
      //
      // Move movedValue before nextValue
      let movedValueDomObj = Client.eleMap[movedValue.id]?.getRootObject();
      let nextValueDomObj = Client.eleMap[nextValue.listContainerId]?.getRootObject();
      //
      if (nextValueDomObj && nextField.group)
        nextValueDomObj = nextValueDomObj.parentNode.parentNode; // Move the entire group row
      //
      if (movedValueDomObj && nextValueDomObj)
        movedValueDomObj.parentNode.insertBefore(movedValueDomObj, nextValueDomObj);
    }
  }
  //
  // Enable advanced tab order and adjust it
  this.advancedTabOrder = true;
  this.fields.forEach((f, i) => f.listTabOrderIndex = i);
  //
  // Now we can send the message to the server AND recreate all the client
  Client.mainFrame.sendEvents(events);
  //
  if (!notupdate) {
    this.updateStructure();
    this.calcLayout();
  }
};


/**
 * Handle row change
 * @param {number} rowIndex
 * @param {Boolean} rowSelectorClick
 */
Client.IdfPanel.prototype.handleRowChange = function (rowIndex, rowSelectorClick)
{
  let events = [];
  //
  if (rowSelectorClick && this.showMultipleSelection)
    return events;
  //
  let hasGroupedRows = this.hasGroupedRows();
  if (hasGroupedRows) {
    this.groupedActualRow = rowIndex - this.groupedActualPosition;
    rowIndex = this.groupedRowsRoot.groupedIndexToRealIndex(rowIndex);
  }
  //
  // If this is not a real data row change, do nothing
  if (!rowSelectorClick && (rowIndex === 0 || rowIndex === this.getActiveRowIndex(true)))
    return events;
  //
  this.updateElement({actualRow: rowIndex - this.actualPosition, skipScroll: true, fromClient: true});
  //
  if (rowSelectorClick) {
    if (Client.mainFrame.isIDF) {
      events.push({
        id: "panrs",
        def: this.rowSelectEventDef,
        content: {
          oid: this.id,
          obn: this.actualRow,
          par1: hasGroupedRows ? rowIndex : 0
        }
      });
    }
    else {
      events.push({
        id: "fireOnRowActivated",
        obj: this.id,
        content: {
          row: this.getActiveRowIndex(true) - 1
        }
      });
    }
  }
  else {
    if (Client.mainFrame.isIDF) {
      events.push({
        id: "chgrow",
        def: this.scrollEventDef,
        content: {
          oid: this.id,
          par1: this.actualRow,
          par2: hasGroupedRows ? rowIndex : 0
        }
      });
    }
    else {
      events.push({
        id: "chgProp",
        obj: this.id,
        content: {
          name: "position",
          value: this.getActiveRowIndex(true) - 1,
          clid: Client.id
        }
      });
    }
  }
  //
  return events;
};


/**
 * Handle panel scroll
 * @param {number} rowIndex
 * @param {boolean} scrollUp
 */
Client.IdfPanel.prototype.handlePanelScroll = function (rowIndex, scrollUp)
{
  clearTimeout(this.hardScrollTimeout);
  //
  // Request data starting from newActualPosition using a negative or positive offset depending on whether I'm scrolling up or down
  // In this way I avoid empty space while scrolling smoothly
  let newActualPosition = rowIndex;
  let newActualRow = this.getActiveRowIndex() - newActualPosition;
  //
  let scrollDelta = 0;
  if (this.hasGroupedRows()) {
    let start = this.groupedActualPosition, end = newActualPosition;
    if (this.groupedActualPosition > newActualPosition) {
      start = newActualPosition;
      end = this.groupedActualPosition;
    }
    //
    for (let i = start; i < end; i++)
      scrollDelta += this.groupedRowsRoot.isRowVisible(i) ? 1 : 0;
    //
    this.groupedActualPosition = newActualPosition;
    this.groupedActualRow = newActualRow;
    //
    newActualPosition = this.groupedRowsRoot.groupedIndexToRealIndex(newActualPosition);
    newActualRow = this.getActiveRowIndex(true) - newActualPosition;
  }
  else
    scrollDelta = Math.abs(this.actualPosition - newActualPosition);
  //
  delete this.scrollingTo;
  this.updateElement({actualPosition: newActualPosition, actualRow: newActualRow, skipScroll: true, fromClient: true});
  //
  this.setActiveRow(true);
  //
  let events = [];
  if (Client.mainFrame.isIDF) {
    if (this.layout === Client.IdfPanel.layouts.list) {
      events.push({
        id: "panscr",
        def: this.scrollEventDef,
        content: {
          oid: this.id,
          par1: this.actualPosition,
          par2: (scrollUp ? -1 : 1) * this.getNumRows()
        }
      });
    }
  }
  else {
    this.scrollingTo = this.actualPosition;
    let scrollPositionEvent = {
      id: "chgProp",
      obj: this.id,
      content: {
        name: "scrollPosition",
        value: this.actualPosition - 1,
        clid: Client.id
      }
    };
    //
    // If scroll delta is a small number (linear scroll), immediately send new actual position to server
    if (scrollDelta < Client.IdfPanel.hardScrollLimit)
      events.push(scrollPositionEvent);
    else // Otherwise it means user is dragging scrollbar thumb, so posticipate event sending
      this.hardScrollTimeout = setTimeout(() => Client.mainFrame.sendEvents([scrollPositionEvent]), 50);
  }
  //
  return events;
};


/**
 * Check if given field is fixed
 * @param {Client.IdfField} field
 */
Client.IdfPanel.prototype.isFixedField = function (field)
{
  // If there aren't fixed columns, field is not fixed
  if (!this.fixedColumns)
    return;
  //
  // Get fields that can be fixed
  let canBeFixed = this.fields.filter(f => f.isInList() && f.isVisible());
  //
  // Prevent fixedColumns to be greater than number of fields that can be fixed
  let fixedColumns = Math.min(canBeFixed.length, this.fixedColumns);
  //
  for (let i = 0; i < fixedColumns; i++) {
    let f = canBeFixed[i];
    //
    // If current field can adapt in width, it cannot be fixed.
    // Since it interrupts the consecutive fixed fields row and I didn't find given field yet, it's not fixed
    if (f.canAdaptWidth())
      return;
    //
    // If I found given field, it means it's fixed
    if (f === field)
      return true;
  }
};


/**
 * If given field is fixed, get its left
 * @param {Client.IdfField} field
 */
Client.IdfPanel.prototype.getFixedFieldLeft = function (field)
{
  let fixedFieldsWidth = this.rowSelectorWidth;
  //
  for (let i = 0; i < this.fields.length; i++) {
    let f = this.fields[i];
    //
    // If I reach the field I was looking for, eventually add row selector width and then break
    if (f === field)
      break;
    //
    // Add current field width to fixed fields width
    if (this.isFixedField(f))
      fixedFieldsWidth += f.getRects({checkVisibility: true}).width;
  }
  //
  return fixedFieldsWidth;
};


/**
 * Set rows min width in order to handle fixed columns properly
 */
Client.IdfPanel.prototype.setRowsMinWidth = function ()
{
  let gridEl = Client.eleMap[this.gridConf.id];
  if (!gridEl)
    return;
  //
  let rowMinWidth = 0;
  //
  for (let i = 0; i < this.fields.length; i++) {
    let field = this.fields[i];
    //
    // The panel has the fixed columns OR the breaking row, so when we find the first breaking field we can safely stop calculating the min width
    if (!this.fixedColumns && field.rowBreakBefore)
      break;
    //
    if (!field.isInList())
      continue;
    //
    rowMinWidth += field.canAdaptWidth() ? Client.IdfField.minWidth : field.getRects({checkVisibility: true}).width;
  }
  //
  if (this.rowMinWidth !== rowMinWidth) {
    this.rowMinWidth = rowMinWidth;
    //
    for (let i = 0; i < gridEl.elements.length; i++) {
      let row = gridEl.elements[i];
      //
      row.minWidth = this.rowMinWidth;
      row.getRootObject().style.minWidth = this.rowMinWidth + "px";
    }
  }
};


/**
 * Check if among xmlNode siblings there is a "chg" node referring to a panel
 * @param {XmlNode} xmlNode
 */
Client.IdfPanel.getDataRange = function (xmlNode)
{
  let start;
  let end;
  //
  let panelId = xmlNode.getAttribute("id");
  //
  // After a reset cache command on a panel, server may sends a block of data.
  // Reset cache on a panel should remove values whose index is included into given range ("from" and "to" properties).
  // But if after an "rcache" command there is a "chg" command on the same panel containing some values, I have to avoid removing those values.
  // So look for a "chg" command referring to same panel as "rcache" command and find the range of values that don't have to be removed
  for (let i = 0; i < xmlNode.parentNode.childNodes.length; i++) {
    let sib = xmlNode.parentNode.childNodes[i];
    //
    // If current sibling is not "chg", continue
    if (sib.nodeName !== "chg")
      continue;
    //
    // Get sibling id
    let id = sib.getAttribute("id");
    //
    // If current sibling doesn't refers to a panel or refers to another panel, continue
    if (!id?.startsWith("pan") || id !== panelId)
      continue;
    //
    // Get dataBlockStart and dataBlockEnd from panel configuration
    let panelConf = Client.IdfPanel.createConfigFromXml(sib);
    if (panelConf) {
      start = panelConf.dataBlockStart;
      end = panelConf.dataBlockEnd;
      break;
    }
  }
  //
  return {start, end};
};


/*
 * Called ONE time at the inizialization, decides to show the list filter OR the icon to handle the list field choice
 */
Client.IdfPanel.prototype.initializeListFilters = function ()
{
  this.showListVisisiblityControls = false;
  if (!Client.mainFrame.idfMobile) {
    for (let i = 0; i < this.fields.length; i++)
      this.showListVisisiblityControls ||= this.fields[i].canHideInList;
  }
  //
  let el = Client.eleMap[this.mainContainerConf.id].getRootObject();
  if (this.showListVisisiblityControls)
    el.setAttribute("has-list-hide", "true");
  else if (this.searchMode === Client.IdfPanel.searchModes.header)
    el.setAttribute("has-list-filter", "true");
};


/**
 * Set given rows group as root
 * @param {Client.IdfRowsGroup} rowsGroup
 */
Client.IdfPanel.prototype.setGroupedRowsRoot = function (rowsGroup)
{
  this.groupedRowsRoot = rowsGroup;
};


/**
 * Check if panel is showing rows groups
 */
Client.IdfPanel.prototype.hasGroupedRows = function ()
{
  return !!this.groupedRowsRoot;
};


/**
 * Reset rows groups
 */
Client.IdfPanel.prototype.resetGroupedRows = function ()
{
  // Tell my groups to reset cache
  for (let j = 0; j < this.groups.length; j++)
    this.groups[j].resetCache({from: 1, to: this.rows.length});
  //
  // Tell my fields to reset cache
  for (let j = 0; j < this.fields.length; j++)
    this.fields[j].resetCache({from: 1, to: this.rows.length});
  //
  // Detach groups headers
  for (let i = 1; i < this.rows.length; i++)
    this.detachRow(i, true);
  //
  // Reset rows
  this.rows = [];
  //
  // Close groups
  this.groupedRowsRoot?.close();
  //
  // Reset grouping properties
  this.groupedRows = false;
  delete this.groupedRowsRoot;
  delete this.firstRow;
  delete this.lastRow;
};


/**
 * Get rows group by index
 * @param {Integer} index
 */
Client.IdfPanel.prototype.getRowsGroupByIndex = function (index)
{
  return Client.eleMap[this.groupedRowsRoot.groupsIds[index]];
};


/**
 * Get number of visible rows in grouped mode
 * @param {Object} options
 */
Client.IdfPanel.prototype.getVisibleGroupedRows = function (options)
{
  let checkPhysicalRow = options?.checkPhysicalRow;
  let start = options?.start || 1;
  let end = options?.end || this.groupedRowsRoot.groupedEndingRow;
  let visibleRows = 0;
  //
  for (let i = start; i <= end; i++) {
    if ((!checkPhysicalRow && this.groupedRowsRoot.isRowVisible(i)) || (checkPhysicalRow && this.rows[i]))
      visibleRows++;
  }
  //
  return visibleRows;
};


/**
 * Get index of next grouped visible row starting from start
 * @param {Object} options
 */
Client.IdfPanel.prototype.getNextGroupedVisibleRow = function (options)
{
  let {start, scrollUp, iterations, checkPhysicalRow} = options;
  //
  if (start < 1)
    return start;
  //
  let maxRows = this.getMaxRows(true);
  //
  if (start > maxRows)
    return start;
  //
  let rowIndex = start;
  //
  // Search first visible data row starting from rowIndex
  while ((!checkPhysicalRow && !this.groupedRowsRoot.isRowVisible(rowIndex)) || (checkPhysicalRow && !this.rows[rowIndex])) {
    rowIndex = scrollUp ? rowIndex - 1 : rowIndex + 1;
    //
    if (rowIndex < 0 || rowIndex > maxRows)
      return rowIndex;
  }
  //
  if (iterations > 0) {
    iterations--;
    return this.getNextGroupedVisibleRow({start: rowIndex + (scrollUp ? -1 : 1), scrollUp, iterations});
  }
  else
    return rowIndex;
};


/**
 * Open list control popup
 * @param {Client.IdfField} selectedField
 */
Client.IdfPanel.prototype.openControlListPopup = function (selectedField)
{
  // Calculate position
  let fieldListObj = Client.eleMap[selectedField.listContainerId].getRootObject();
  let listRect = fieldListObj.getBoundingClientRect();
  let top = listRect.top + listRect.height;
  let left = listRect.left;
  let width = listRect.width;
  //
  // Handle overflow
  if (left + width >= document.body.offsetWidth)
    left = document.body.offsetWidth - width - 5;
  if (left < 0)
    left = this.showRowSelector ? Client.IdfPanel.defaultRowSelectorWidth : 2;
  //
  let buttons = [];
  let inputs = [];
  let alertOpts = {
    style: "popup-list-controls",
    inputs,
    buttons,
    rect: {
      top,
      left,
      width
    }
  };
  //
  // Add the command to show the filter
  if (this.status === Client.IdfPanel.statuses.data && !this.DOModified && this.searchMode === Client.IdfPanel.searchModes.header && this.canSearch && selectedField.enabledInQbe && !selectedField.isStatic() && selectedField.dataType !== Client.IdfField.dataTypes.BLOB)
    buttons.push({id: 1, text: Client.IdfResources.t("LFIL_FILTER_CAPT"), icon: "funnel"});
  if (selectedField.canSort) {
    buttons.push({id: 2, text: Client.IdfResources.t("LFIL_SORT_DESC"), icon: "arrow-dropdown", tooltip: Client.IdfResources.t("TIP_TITLE_PopupSort", [selectedField.listHeader])});
    buttons.push({id: 3, text: Client.IdfResources.t("LFIL_SORT_ASC"), icon: "arrow-dropup", tooltip: Client.IdfResources.t("TIP_TITLE_PopupSort", [selectedField.listHeader])});
    if (selectedField.sortMode !== Client.IdfField.sortModes.NONE)
      buttons.push({id: 4, text: Client.IdfResources.t("LFIL_SORT_CLEAR"), icon: "close-circle-outline", tooltip: Client.IdfResources.t("TIP_TITLE_PopupSortNone")});
    //
    if (this.canGroup && this.showGroups) {
      buttons.push({id: 5, text: Client.IdfResources.t("LFIL_GROUP_LBL"), icon: "arrow-dropdown"});
      buttons.push({id: 6, text: Client.IdfResources.t("LFIL_GROUP_LBL_D"), icon: "arrow-dropup"});
      buttons.push({id: 7, text: Client.IdfResources.t("LFIL_DEGROUP_LBL"), icon: "close-circle-outline"});
    }
    //
    alertOpts.keydowncallback = function (ev, options) {
      if (ev.key === "Shift") {
        // Change tooltip text
        let b = document.getElementById("b2");
        b._tippy.setContent(Client.IdfResources.t("TIP_TITLE_PopupSortShift", [selectedField.listHeader]));
        b = document.getElementById("b3");
        b._tippy.setContent(Client.IdfResources.t("TIP_TITLE_PopupSortShift", [selectedField.listHeader]));
      }
    };
    alertOpts.keyupcallback = function (ev, options) {
      if (ev.key === "Shift") {
        // restore button text
        let b = document.getElementById("b2");
        b._tippy.setContent(Client.IdfResources.t("TIP_TITLE_PopupSort", [selectedField.listHeader]));
        b = document.getElementById("b3");
        b._tippy.setContent(Client.IdfResources.t("TIP_TITLE_PopupSort", [selectedField.listHeader]));
      }
    };
  }
  //
  // Add a Label (is a stylized button, the alert doesn't have the labels)
  if (this.fields.length > 0)
    buttons.push({id: 89, text: Client.IdfResources.t("LFIL_VIS_LBL"), cssClass: "list-label-button"});
  //
  for (let i = 0; i < this.fields.length; i++) {
    let f = this.fields[i];
    if (f.isInList() && f.visible && f.canHideInList)
      inputs.push({id: f.id, type: "checkbox", label: f.listHeader, checked: !f.hiddenInList, value: f.id});
  }
  //
  Client.IonHelper.createAlert(alertOpts, (r, values, ev) => {
    let events = [];
    //
    // Check the resut : if r is NULL the user clicked outside the popup to close it, in this case we need to apply the field visibility
    // 1 - open filter popup
    if (r === 1)
      selectedField.openFilterPopup();
    else if (r === 2)
      events.push(...selectedField.handleSort({sortMode: Client.IdfField.sortModes.DESC, resetAll: !ev.shiftKey, add: true}));
    else if (r === 3)
      events.push(...selectedField.handleSort({sortMode: Client.IdfField.sortModes.ASC, resetAll: !ev.shiftKey, add: true}));
    else if (r === 4)
      events.push(...selectedField.handleSort({sortMode: Client.IdfField.sortModes.NONE, resetAll: !ev.shiftKey, add: !ev.shiftKey}));
    else if (r === 5)
      events.push(...selectedField.handleGrouping(Client.IdfField.groupingModes.DESC));
    else if (r === 6)
      events.push(...selectedField.handleGrouping(Client.IdfField.groupingModes.ASC));
    else if (r === 7)
      events.push(...selectedField.handleGrouping(Client.IdfField.groupingModes.NONE));
    else if (!r) {
      // Apply the field configurations
      for (let k in values) {
        let f = Client.eleMap[k];
        f.hiddenInList = !values[k];
        //
        if (Client.mainFrame.isIDF)
          events.push({
            id: "fldlistvis",
            def: Client.IdfMessagesPump.eventTypes.DEFERRED,
            content: {
              oid: f.id,
              par1: f.hiddenInList ? "-1" : "0"
            }
          });
        else {
          events.push({
            id: "chgProp",
            obj: f.id,
            content: {
              name: "hiddenInList",
              value: f.hiddenInList,
              clid: Client.id
            }
          });
        }
      }
      //
      this.updateStructure();
      this.calcLayout();
    }
    //
    if (events.length > 0)
      Client.mainFrame.sendEvents(events);
  });
};


/**
 * Show a preview frame
 * @param {String} address
 */
Client.IdfPanel.prototype.showPreview = function (address)
{
  Client.Widget.showPreview("", address);
};


/**
 * Reset cached styles
 * @param {Integer} index
 */
Client.IdfPanel.prototype.resetCachedStyles = function (index)
{
  if (index === undefined) {
    this.gridStyle = {};
    this.gridColStyle = {};
    this.rowSelectorStyle = {};
    this.aggregateRowSelectorStyle = {};
  }
  //
  this.fields.forEach(f => f.resetCachedStyles(index));
  this.groups.forEach(g => g.resetCachedStyles(index));
};


/**
 * One of my children element has been removed
 * @param {Element} child
 */
Client.IdfPanel.prototype.onRemoveChildObject = function (child)
{
  if (!Client.mainFrame.isEditing())
    return;
  //
  // Remove from children and elements
  let objIndex = this.children.findIndex(c => c.id === child.id);
  if (objIndex !== -1)
    this.children.splice(objIndex, 1);
  //
  // Remove from fields, pages and groups
  objIndex = this.fields.findIndex(f => f.id === child.id);
  if (objIndex !== -1) {
    if (this.fields[objIndex].group) {
      let g = this.fields[objIndex].group;
      let fIndex = g.fields.findIndex(f => f.id === child.id);
      if (fIndex !== -1)
        g.fields.splice(fIndex, 1);
      //
      if (g.fields.length === 0)
        g.resetGroup();
    }
    //
    if (this.fields[objIndex].page) {
      let p = this.fields[objIndex].page;
      let fIndex = p.fields.findIndex(f => f.id === child.id);
      if (fIndex !== -1)
        p.fields.splice(fIndex, 1);
    }
    //
    this.fields.splice(objIndex, 1);
    return;
  }
  //
  objIndex = this.groups.findIndex(g => g.id === child.id);
  if (objIndex !== -1) {
    this.groups.splice(objIndex, 1);
    return;
  }
  //
  objIndex = this.pages.findIndex(p => p.id === child.id);
  if (objIndex !== -1) {
    this.pages.splice(objIndex, 1);
    return;
  }
};


Client.IdfPanel.prototype.acceptsDrop = function (widget, targetDomElement)
{
  if (Client.mainFrame?.isEditing() && (widget instanceof Client.IdfControl || widget instanceof Client.IdfField || widget instanceof Client.IdfGroup))
    return true;
  //
  return false;
};

Client.IdfPanel.prototype.handleDrop = function (dragWidget, droppedElement, x, y, ev, options)
{
  if (Client.mainFrame?.isEditing() && (dragWidget instanceof Client.IdfControl || dragWidget instanceof Client.IdfField || dragWidget instanceof Client.IdfGroup)) {
    let draggedField = dragWidget instanceof Client.IdfControl ? dragWidget.parentWidget?.parent : dragWidget;
    //
    // The grid is dragged by an IDFControl of a ListList field (when the panel layout is in list)
    if (draggedField.parent === this)
      this.handleEditOperation(Client.IdfPanel.editOperations.drag, [draggedField], this, {x, y, deltaX: options.deltaX, deltaY: options.deltaY}, ev);
  }
  else if (Client.mainFrame.isIDF && this.canDrop) // If foundation let the system handle the generic drag
    return true;
};


/**
 *
 * @param {Client.IdfPanel.editOperations} operation operation to apply
 * @param {Array} movedFields list of dragged/resized Client.IdfField
 * @param {Client.IdfField || Client.IdfPanel} targetWidget target
 * @param {Object} options
 *                    x - absolute X of the mouse cursor
 *                    y - absolute Y of the mouse cursor
 *                    deltaX - delta movement
 *                    deltaY - delta movement
 * @returns
 */
Client.IdfPanel.prototype.handleEditOperation = function (operation, movedFields, targetWidget, options)
{
  if ((!movedFields || movedFields.length === 0) && (operation === Client.IdfPanel.editOperations.drag || operation === Client.IdfPanel.editOperations.resize))
    return;
  //
  let formScrollTop = Client.eleMap[this.formContainerConf.id]?.getRootObject()?.scrollTop || 0;
  //
  let source;
  let reorder = [];
  let newStruct = [];
  let panelRect = Client.eleMap[this.panelContainerConf.id]?.getRootObject()?.getBoundingClientRect() || {top: 0, left: 0, width: 100, height: 100};
  if (this.layout === Client.IdfPanel.layouts.form) {
    panelRect.width = Client.eleMap[this.formContainerConf.id]?.getRootObject()?.clientWidth;
    panelRect.height = Client.eleMap[this.formContainerConf.id]?.getRootObject()?.clientHeight;
  }
  //
  // If we have multiple fields selected, we need to add them to the list of moved fields
  if (operation === Client.IdfPanel.editOperations.drag || operation === Client.IdfPanel.editOperations.resize) {
    source = movedFields[0];
    movedFields = Client.ViewEdit.getEditorSelectedElements(source);
  }
  //
  if (operation === Client.IdfPanel.editOperations.drag) {
    let x = options.x;
    let y = options.y + this.getHeaderHeight();
    //
    // Adapt Absolute Coordinates (needed only for moving out of list)
    //x = x - panelRect.left;
    //y = y - panelRect.top;
    //
    // Detect drop operation
    let dropsType = {listReorder: 0, movedField: 3};
    let op = dropsType.movedField;
    //
    if (this.layout === Client.IdfPanel.layouts.list) {
      if (targetWidget instanceof Client.IdfField && source instanceof Client.IdfField && targetWidget.isInList() && source.isInList())
        op = dropsType.listReorder;
    }
    //
    if (op !== dropsType.listReorder && (x < 0 || y < 0))
      return;
    //
    // No UpdateElement because we don't need an updatestructure for each field, we set all the coordinates and then call a single UpdateStructure
    //
    switch (op) {
      case dropsType.listReorder:
        // The reordering must be done by using the reverse list field order, otherwise the list will be out of sync
        let tgid = targetWidget.id;
        for (let ifx = this.fields.length - 1; ifx >= 0; ifx--) {
          let found = movedFields.find(el => el.id === this.fields[ifx].id);
          if (found) {
            reorder.push({src: this.fields[ifx].id, tgt: tgid});
            tgid = this.fields[ifx].id;
          }
        }
        break;

      default:
        let operationTypeL = {
          createRowBefore: -1,
          createColInRow: 0,
          createRowAfter: 1
        };
        //
        let targetRowId, targetColumnId;
        let operationType = operationTypeL.createRowAfter;
        let ele = document.elementFromPoint(x, y);
        //
        if (targetWidget instanceof Client.IdfField) {
          // Drop on the same row of this field
          operationType = operationTypeL.createColInRow;
          let col = Client.eleMap[targetWidget.formControlId].getRootObject();
          while (col) {
            if (col.tagName === "ION-COL")
              break;
            //
            col = col.parentNode;
          }
          let row = col;
          while (row) {
            if (row.tagName === "ION-ROW")
              break;
            //
            row = row.parentNode;
          }
          //
          targetRowId = row.id;
          targetColumnId = col.id;
        }
        else {
          let row = ele;
          //
          // Get the parent IonRow
          while (row) {
            if (row.tagName === "ION-ROW")
              break;
            //
            row = row.parentNode;
          }
          //
          if (row) {
            // We can add to this row OR create another row under/over that
            // If
            // - we dragged into directly a row : in this case we dragged on an "hole" in the row, so we add INTO that row
            // - otherwise we create a new row
            //   - before if the y is <50% of the row
            //   - after if the y is >50% of the row
            let bounds = row.getBoundingClientRect();
            targetRowId = row.id;
            if (ele.tagName === "ION-ROW") {
              // Drop on an ION-ROW, two cases:
              // - maybe the row is not horizontal complete (has an 'hole') and we have dropped into it, we need to create a new col
              // - maybe the row HAS a marginTOP on its cells and the HOLE is over, in this case we must create a new row
              let mgTop = this.getMarginTopInRow(row);
              operationType = y < bounds.top + mgTop ? operationTypeL.createRowBefore : operationTypeL.createColInRow;
            }
            else
              operationType = y < (bounds.top + bounds.height / 4) ? operationTypeL.createRowBefore : operationTypeL.createRowAfter;
          }
        }
        //
        // Enable drop on the panel grid OR a current row
        if (ele.tagName === "ION-GRID" && ele.classList.contains("panel-form-container"))
          targetRowId = "NEW";
        if (targetRowId)
          this.updateStructureForEdit(movedFields, targetRowId, targetColumnId, operationType);
        break;
    }
    //
    // Update the client structure
    this.updateStructure();
    this.setActiveRow();
    let widget = {};
    widget.totalRows = Client.IdfPanel.maxReusableRows;
    widget.data = {};
    widget.dataBlockStart = 1;
    widget.dataBlockEnd = widget.totalRows;
    this.updateElement(widget);
  }
  else if (operation === Client.IdfPanel.editOperations.resize) {
    // Resize operation
    let deltaLeft = options.x - options.ox;
    let deltaTop = options.y - options.oy;
    let deltaWidth = options.w - options.ow;
    let deltaHeight = options.h - options.oh;
    //
    let deltaLeftPerc = options.y / panelRect.width * 100;
    let deltaTopPerc = options.y / panelRect.height * 100;
    let deltaWidthPerc = options.w / panelRect.width * 100;
    let deltaHeightPerc = options.h / panelRect.height * 100;
    //
    if (this.layout === Client.IdfPanel.layouts.list) {
      movedFields.forEach(el => {
        if (el.isInList())
          return;
        //
        if (!el.listHeaderAbove) {
          // If the header is at left and we move left apply the left to the listHeaderSize and clear the with delta
          if (deltaLeft !== 0) {
            deltaWidth = 0;
            deltaWidthPerc = -1;
            deltaHeightPerc = -1;
          }
        }
        else {
          // If the header is above is the delta Top that moves the header
          if (deltaTop !== 0) {
            deltaHeight = 0;
            deltaHeightPerc = -1;
            deltaWidthPerc = -1;
          }
        }
        //
        if (el.listHeaderSize)
          el.listHeaderSize = el.listHeaderSize + (!el.listHeaderAbove ? deltaLeft : deltaTop);
        if (el.listTop && !el.listHeaderAbove) {
          el.listTop = el.listTop + deltaTop;
          el.orgListTop = el.listTop;
        }
        if (el.listHeaderAbove && deltaLeft !== 0) {
          el.listLeft = el.listLeft + deltaLeft;
          el.orgListLeft = el.listLeft;
        }
        if (el.listHeight) {
          el.listHeight = el.listHeight + deltaHeight;
          el.orgListHeight = el.listHeight;
        }
        if (el.listWidth) {
          el.listWidth = el.listWidth + deltaWidth;
          //el.listWidth = el.listWidth + deltaWidthPerc / 100 * (el.listWidth - el.listHeaderSize);
          el.orgListWidth = el.listWidth;
        }
        if (el.listTopPerc) {
          el.listTopPerc = deltaTopPerc;
          el.orgListTopPerc = el.listTopPerc;
        }
        if (el.listHeightPerc && deltaHeightPerc > 0) {
          el.listHeightPerc = deltaHeightPerc;
          el.orgListHeightPerc = el.listHeightPerc;
        }
        if (el.listWidthPerc && deltaWidthPerc > 0) {
          el.listWidthPerc = deltaWidthPerc;
          el.orgListWidthPerc = el.listWidthPerc;
        }
      });
    }
    else {
      movedFields.forEach(el => {
        if (!el.formHeaderAbove) {
          // If the header is at left and we move left apply the left to the listHeaderSize and clear the with delta
          if (deltaLeft !== 0) {
            deltaWidth = 0;
            deltaHeightPerc = -1;
            deltaWidthPerc = -1;
          }
        }
        else {
          // If the header is above is the delta Top that moves the header
          if (deltaTop !== 0) {
            deltaHeight = 0;
            deltaHeightPerc = -1;
            deltaWidthPerc = -1;
          }
        }
        //
        if (el.formHeaderSize)
          el.formHeaderSize = el.formHeaderSize + (!el.formHeaderAbove ? deltaLeft : deltaTop);
        if (el.formTop && !el.formHeaderAbove) {
          el.formTop = el.formTop + deltaTop;
          el.orgFormTop = el.formTop;
        }
        if (el.formHeaderAbove && deltaLeft !== 0) {
          el.formLeft = el.formLeft + deltaLeft;
          el.orgFormLeft = el.formLeft;
        }
        if (el.formHeight) {
          el.formHeight = el.formHeight + deltaHeight;
          el.orgFormHeight = el.formHeight;
        }
        if (el.formWidth) {
          el.formWidth = el.formWidth + deltaWidth;
          el.orgFormWidth = el.formWidth;
        }
        if (el.formTopPerc) {
          el.formTopPerc = deltaTopPerc;
          el.orgFormTopPerc = el.formTopPerc;
        }
        if (el.formHeightPerc && deltaHeightPerc > 0) {
          el.formHeightPerc = deltaHeightPerc;
          el.orgFormHeightPerc = el.formHeightPerc;
        }
        if (el.formWidthPerc && deltaWidthPerc > 0) {
          el.formWidthPerc = deltaWidthPerc;
          el.orgFormWidthPerc = el.formWidthPerc;
        }
      });
    }
    //
    this.updateStructure();
    this.calcLayout();
  }
  //
  // Prepare the message to the server
  this.fields.forEach(f => {
    let str = {id: f.id, groupId: (f.groupId || "")};
    if (f.showInList && f.isShown()) {
      if (f.listTop)
        str.listTop = Math.round(f.listTop);
      if (f.listLeft)
        str.listLeft = Math.round(f.listLeft);
      if (f.listHeight)
        str.listHeight = Math.round(f.listHeight);
      if (f.listWidth)
        str.listWidth = Math.round(f.listWidth);
      //
      if (f.listTopPerc)
        str.listTopPerc = Math.round(f.listTopPerc);
      if (f.listLeftPerc)
        str.listLeftPerc = Math.round(f.listLeftPerc);
      if (f.listHeightPerc)
        str.listHeightPerc = Math.round(f.listHeightPerc);
      if (f.listWidthPerc)
        str.listWidthPerc = Math.round(f.listWidthPerc);
      //
      if (f.listHeaderSize)
        str.listHeaderSize = Math.round(f.listHeaderSize);
    }
    if (f.showInForm && f.isShown(true)) {
      if (f.formTop || f.formTop === 0)
        str.formTop = Math.round(f.formTop);
      if (f.formLeft || f.formLeft === 0)
        str.formLeft = Math.round(f.formLeft);
      if (f.formHeight)
        str.formHeight = Math.round(f.formHeight);
      if (f.formWidth)
        str.formWidth = Math.round(f.formWidth);
      //
      if (f.formTopPerc)
        str.formTopPerc = Math.round(f.formTopPerc);
      if (f.formLeftPerc)
        str.formLeftPerc = Math.round(f.formLeftPerc);
      if (f.formHeightPerc)
        str.formHeightPerc = Math.round(f.formHeightPerc);
      if (f.formWidthPerc)
        str.formWidthPerc = Math.round(f.formWidthPerc);
      //
      if (f.formHeaderSize)
        str.formHeaderSize = Math.round(f.formHeaderSize);
      //
      if (f.formRight !== undefined)
        str.formRight = f.formRight;
      if (f.formBottom !== undefined)
        str.formBottom = f.formBottom;
    }
    newStruct.push(str);
  });
  //
  delete this.fieldsFormOrder;
  //
  //
  // Send the message to the proxy
  Client.eleMap["editm"].editProxy?.appCmd([{id: this.id, c: "editDone", newStruct, reorder, formstructure: this.formStruct}]);
  //
  let fc = Client.eleMap[this.formContainerConf.id]?.getRootObject();
  if (fc)
    fc.scrollTop = formScrollTop;
};


Client.IdfPanel.prototype.getPanelGridStructure = function ()
{
  return {
    listGridRows: this.listGridRows,
    formGridRows: this.formGridRows,
    panrect: Client.eleMap[this.mainContainerConf?.id]?.getRootObject()?.getBoundingClientRect()
  };
};


/*
 * When executing into the view editor the transactions are sent to the client and foreach update the panel will recalc its layout.
 * In this case we block the updating by setting the realizing flag and at the end the panel will send the final commit to exdcute only a relayout
 */
Client.IdfPanel.prototype.editorStartRealizing = function ()
{
  this.realizing = true;
  this.fields.forEach(e => e.realizing = true);
  this.groups.forEach(e => e.realizing = true);
  this.pages.forEach(e => e.realizing = true);
};


/*
 * Update structure and layout in order to apply new dimensions calculated on panel resize
 */
Client.IdfPanel.prototype.editorCompleteRealize = function ()
{
  this.realizing = false;
  this.fields.forEach(e => e.realizing = false);
  this.groups.forEach(e => e.realizing = false);
  this.pages.forEach(e => e.realizing = false);
  //
  this.updateObjects({structure: true, calcLayout: true});
};


Client.IdfPanel.prototype.insertBefore = function (content)
{
  if (Client.mainFrame.isEditing()) {
    this.tempWChildren = this.tempWChildren || {children: []};
    this.tempWChildren.children.push(content.child);
    if (content.sib)
      content.child.sib = content.sib;
    delete content.child;
    if (this.editInsertTimeout)
      clearTimeout(this.editInsertTimeout);
    //
    this.editInsertTimeout = setTimeout(() => {
      this.createChildren(this.tempWChildren);
      this.restoreRowSelectors();
      //
      // If the formstructure comes from the server the addin handles the add/remove of fields
      // if the structure is auto-genertaed by the client the addin does nothing so
      // the client must recreate it when adding an object
      if (this.clientGeneratedFormStructure) {
        delete this.formStruct;
        this.groups.forEach(g => delete g.formStruct);
      }
      //
      delete this.tempWChildren;
      delete this.editInsertTimeout;
      this.updateStructure();
      //
      this.updateElement({
        totalRows: Client.IdfPanel.maxReusableRows,
        data: {},
        dataBlockStart: 1,
        dataBlockEnd: Client.IdfPanel.maxReusableRows,
        activePage: this.activePage
      });
    }, 30);
  }
  else {
    if (["IdfPage", "IdfGroup"].includes(content.child.c)) {
      if (content.child.children) {
        for (let c of content.child.children)
          this.insertBefore({child: c});
        delete content.child.children;
      }
    }
    //
    let el = Client.Element.prototype.insertBefore.call(this, content);
    //
    if (el instanceof Client.IdfField && el.isShown() && el.isInList())
      this.intersectionObserver?.observe(Client.eleMap[el.listContainerId].getRootObject());
    //
    this.fields = this.elements.filter(e => e instanceof Client.IdfField);
    this.groups = this.elements.filter(e => e instanceof Client.IdfGroup);
    this.pages = this.elements.filter(e => e instanceof Client.IdfPage);
    //
    this.restoreRowSelectors();
  }
};


Client.IdfPanel.prototype.updateStructureForEdit = function (changedFields, targetRowId, targetColumnId, operationType)
{
  let operationTypeL = {
    createRowBefore: -1,
    createColInRow: 0,
    createRowAfter: 1
  };
  //
  // Find the row into the structure
  // we have two strucures:
  // - this.formStruct that the server sent to us with the conf
  // - this.formGridRows that is the same structure with the config
  // this is needed because we cannot send to the server the config (cannot parse) AND the panel
  // clears the formGridRows when recreating the structure (so we need two objects, a template and the real structure)
  // The ID are in the formGridRows but not in formStruct, so we need to:
  // - find the row in formGridRows
  // - find the same row in the formStruct by using another id saved into the conf object
  // - update the formStruct
  let ionrowfid = Client.eleMap[targetRowId?.substring(4)]?.domObj.fid;
  //
  let clearRowFromField = function (rows, field) {
    if (!rows)
      return;
    //
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      //
      // Clear the sub-rows
      row.cols.forEach(c => clearRowFromField(c.rows, field));
      //
      // Check if this row contains the dragged field, we need to remove it
      let fldIndex = row.fields.findIndex(fc => fc.id === field.id);
      if (fldIndex >= 0) {
        // Remove from field array
        row.fields.splice(fldIndex, 1);
        //
        // Remove its col
        let oldCol;
        let colIndex = row.cols.findIndex(c => c.fields.find(fcc => fcc.id === field.id) !== undefined);
        if (colIndex >= 0)
          oldCol = row.cols.splice(colIndex, 1);
        //
        // Save the old group structure to keep it
        if (field instanceof Client.IdfGroup && oldCol && oldCol[0])
          field.formStruct = oldCol[0].rows;
        //
        // If the row is empty remove it
        // But not if the row is the target row, in that case mantain it empty
        if (row.fields.length === 0 && row.config.fid !== ionrowfid)
          rows.splice(i, 1);
        //
        // Adapt the old row fields width (if i remove a field from a row the other fields must fill the row)
        if (row.fields.length > 0) {
          // Get the widths
          let w = Math.floor(100 / row.fields.length);
          let last = 100 % row.fields.length;
          let fields = [];
          //
          // The fields array of the row is not ordered, so we need to iterate over the columns
          row.cols.forEach(cls => fields.push(...cls.fields));
          //
          fields.forEach((f, ix) => {
            let fld = Client.eleMap[f.id];
            if (fld instanceof Client.IdfField) {
              fld.formWidth = "";
              fld.formWidthPerc = w + (ix === row.fields.length - 1 ? last : 0);
              fld.formResizeWidth = Client.IdfPanel.resizeModes.none;
              fld.formLeft = 20;
              fld.formRight = (ix === row.fields.length - 1) ? "20" : "";
            }
          });
        }
        //
        break;
      }
    }
  };
  //
  if (!ionrowfid && targetRowId !== "NEW")
    return;
  //
  // We must split the moved fields array in an array of array, with the fields in the same row in the same slot
  let fieldsSlots = [];
  let changedFieldsCopy = [...changedFields];
  while (changedFieldsCopy.length > 0) {
    let f = changedFieldsCopy[0];
    changedFieldsCopy.splice(0, 1);
    let slot = [];
    slot.push(f);
    //
    // Get the row of this field/group
    let frow = f.getWidgetFormRow();
    //
    // Check if the other fields in the array are in the same row, if true we need to set them in the same slot
    for (let ix = 0; ix < changedFieldsCopy.length; ix++) {
      let cf = changedFieldsCopy[ix];
      let cfrow = cf.getWidgetFormRow();
      //
      if (cfrow === frow) {
        slot.push(cf);
        changedFieldsCopy.splice(ix, 1);
        ix--;
      }
    }
    //
    fieldsSlots.push(slot);
  }
  //
  for (let fi = fieldsSlots.length - 1; fi >= 0; fi--) {
    let flist = fieldsSlots[fi];
    flist.forEach(f => clearRowFromField(this.formStruct, f));
    this.addFieldsIntoStructRow(this.formStruct, flist, targetRowId, targetColumnId, operationType);
    flist.forEach(f => {
      f.formTop = 20;
    });
  }
  //
  // Fix the formBottom of all the fields, the last row must have 20 and the others none
  this.formStruct.forEach((fr, i) => {
    let rwfields = [];
    //
    // The fields array of the row is not ordered, so we need to iterate over the columns
    fr.cols.forEach(cls => rwfields.push(...cls.fields));
    //
    rwfields.forEach((f, c) => {
      let field = Client.eleMap[f.id];
      if (field) {
        field.formBottom = i === this.formStruct.length - 1 ? "20" : "";
        field.formRight = (c === rwfields.length - 1) ? "20" : "";
      }
    });
    //
    // For each col we need to check the sub-rows and set their values
    fr.cols.forEach(c => {
      c.rows.forEach((gr, i) => {
        gr.fields.forEach((fr, ri) => {
          let field = Client.eleMap[fr.id];
          if (field) {
            // For the last row
            field.formBottom = (i === c.rows.length - 1) ? "20" : "";
            //
            // Rightmost field of the row
            field.formRight = (ri === gr.fields.length - 1) ? "20" : "";
            //
            // All rows of the group
            field.formTop = (i === 0) ? 10 : 20;
          }
        });
      });
    });
  });
};


Client.IdfPanel.prototype.addFieldsIntoStructRow = function (rows, fieldList, targetRowId, targetColumnId, operationType)
{
  if (!rows)
    return;
  //
  let operationTypeL = {
    createRowBefore: -1,
    createColInRow: 0,
    createRowAfter: 1
  };
  //
  let ionrowfid = Client.eleMap[targetRowId?.substring(4)]?.domObj.fid;
  let ioncolfid = Client.eleMap[targetColumnId?.substring(4)]?.domObj.fid;
  //
  if (targetRowId === "NEW") {
    // Create a new row after the last
    ionrowfid = rows[rows.length - 1]?.config.fid;
    operationType = operationTypeL.createRowAfter;
  }
  //
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    //
    if (row.config.fid === ionrowfid) {
      // This is the target row, we can create the new col OR create a new row before OR after
      if (operationType === operationTypeL.createColInRow) {
        fieldList.forEach(field => {
          let isGroup = field instanceof Client.IdfGroup;
          //
          // Create the new COL for this field
          let newCol = {
            fields: [{id: field.id}],
            rows: [],
            visible: true,
            config: {
              c: "IonCol",
              className: "panel-structure-col",
              fid: Client.Utils.generateRandomId()
            }
          };
          //
          if (isGroup) {
            newCol.rows = field.formStruct;
            newCol.isGroup = true;
            newCol.fields[0].isGroup = true;
            newCol.rect = {};
          }
          //
          // Add new column to row columns
          let colIndex = row.cols.findIndex(cls => cls.config.fid === ioncolfid);
          if (ioncolfid && colIndex >= 0)
            row.cols.splice(colIndex + 1, 0, newCol);
          else
            row.cols.push(newCol);
          //
          row.fields.push({id: field.id});
        });
        //
        // Adapt fields withs
        let w = Math.floor(100 / row.fields.length);
        let last = 100 % row.fields.length;
        let fields = [];
        //
        // The fields array of the row is not ordered, so we need to iterate over the columns
        row.cols.forEach(cls => fields.push(...cls.fields));
        //
        let colGroupId, colGroupGroup;
        fields.forEach((f, i) => {
          let fld = Client.eleMap[f.id];
          if (fld instanceof Client.IdfField) {
            fld.formWidth = "";
            fld.formWidthPerc = w + (i === row.fields.length - 1 ? last : 0);
            fld.formResizeWidth = Client.IdfPanel.resizeModes.none;
            fld.formLeft = 20;
            fld.formRight = (i === row.fields.length - 1) ? "20" : "";
            //
            // Check if the field is in a group, if true all the fields in this col must be in the same group
            if (fld.groupId)
              colGroupId = fld.groupId;
            if (fld.group)
              colGroupGroup = fld.group;
          }
        });
        //
        fieldList.forEach(field => {
          // A field is moved into a group row, go into the group
          if (colGroupId && !field.groupId) {
            field.groupId = colGroupId;
            field.group = colGroupGroup;
            colGroupGroup.fields.push(field);
          }
          else if (colGroupId && field.groupId && field.groupId !== colGroupId) {
            // Move from a group to another group
            let idxFg = field.group.fields.indexOf(field);
            if (idxFg >= 0)
              field.group.splice(idxFg, 1);
            //
            field.groupId = colGroupId;
            field.group = colGroupGroup;
            colGroupGroup.fields.push(field);
          }
          else if (field.groupId && !colGroupId) {
            // Move outside the group
            let idxFg = field.group.fields.indexOf(field);
            if (idxFg >= 0)
              field.group.fields.splice(idxFg, 1);
            delete field.groupId;
            delete field.group;
          }
        });
      }
      else {
        // Create the new ROW/COL for this field
        let newRow = {
          fields: [],
          cols: [],
          //
          // Create row configuration
          config: {
            c: "IonRow",
            className: "panel-structure-row",
            noWrap: true,
            fid: Client.Utils.generateRandomId()
          }
        };
        //
        let fw = Math.floor(100 / fieldList.length);
        let lastfw = 100 % fieldList.length;
        //
        fieldList.forEach((field, fix) => {
          let isGroup = field instanceof Client.IdfGroup;
          //
          newRow.fields.push({id: field.id});
          let myCol = {
            fields: [{id: field.id}],
            rows: [],
            visible: true,
            config: {
              c: "IonCol",
              className: "panel-structure-col",
              fid: Client.Utils.generateRandomId()
            }
          };
          newRow.cols.push(myCol);
          //
          if (isGroup) {
            myCol.rows = field.formStruct;
            myCol.isGroup = true;
            myCol.fields[0].isGroup = true;
            myCol.rect = {};
          }
          else {
            field.formWidth = "";
            field.formWidthPerc = fw + (fix === fieldList.length - 1 ? lastfw : 0);
            //
            // Check if the row is relative to a group, in this case we can move the field into the group/remove
            let gr = Client.eleMap[row.fields[0]?.id]?.group;
            if (gr && !field.groupId) {
              field.groupId = gr.id;
              field.group = gr;
              gr.fields.push(field);
            }
            else if (gr && field.groupId && field.group !== gr) {
              // Move from a group to another group
              let idxFg = field.group.fields.indexOf(field);
              if (idxFg >= 0)
                field.group.fields.splice(idxFg, 1);
              //
              field.groupId = gr.id;
              field.group = gr;
              gr.fields.push(field);
            }
            else if (field.groupId && !gr) {
              // Move outside the group
              let idxFg = field.group.fields.indexOf(field);
              if (idxFg >= 0)
                field.group.fields.splice(idxFg, 1);
              delete field.groupId;
              delete field.group;
            }
          }
        });
        //
        rows.splice(operationType === operationTypeL.createRowBefore ? i : i + 1, 0, newRow);
      }
      //
      break;
    }
    else {
      // Try to add into the sub-rows
      row.cols.forEach(c => this.addFieldsIntoStructRow(c.rows, fieldList, targetRowId, targetColumnId, operationType));
    }
  }
};



Client.IdfPanel.prototype.getMarginTopInRow = function (row)
{
  let rowbounds = row.getBoundingClientRect();
  let marginTop = 10000;
  for (let c = 0; c < row.childNodes.length; c++) {
    let colbounds = row.childNodes[c].getBoundingClientRect();
    let mtop = colbounds.top - rowbounds.top;
    if (mtop < marginTop)
      marginTop = mtop;
  }
  //
  return marginTop;
};


/**
 * Create a grid structure made of rows and columns in which place each panel child based on its rect
 * @param {Object} groupConf - group for which to create structure
 */
Client.IdfPanel.prototype.getCloudFormStructure = function (groupConf)
{
  let group = groupConf ? Client.eleMap[groupConf.id] : undefined;
  //
  if (group?.formStruct)
    return group.formStruct;
  if (this.formStruct)
    return this.completeFormStructure(this.formStruct);
  //
  let fields = [];
  if (group)
    fields = group.fields;
  else {
    // Get all the groups and all the fields outside a group, the groups are created at the end of the grid
    this.fields.forEach(f => {
      if (!f.group)
        fields.push(f);
    });
    (this.groups || []).forEach(g => {
      fields.push(g);
    });
  }
  //
  let rows = [];
  //
  // We need to calculate the form structure
  // for each field create a row and a COL
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    //
    let isGroup = field instanceof Client.IdfGroup;
    if (!isGroup && !field.isShown(true))
      continue;
    //
    let newRow = {};
    newRow.fields = [{id: field.id}];
    newRow.cols = [];
    //
    // Create row configuration
    newRow.config = {c: "IonRow", className: "panel-structure-row", noWrap: true, fid: Client.Utils.generateRandomId()};
    //
    rows.push(newRow);
    //
    let newCol = {};
    newCol.fields = [{id: field.id}];
    newCol.rows = [];
    newCol.rect = {};
    newCol.visible = true;
    //
    newCol.config = {c: "IonCol", className: "panel-structure-col", fid: Client.Utils.generateRandomId()};
    //
    // Add new column to row columns
    newRow.cols.push(newCol);
    //
    if (isGroup) {
      newCol.isGroup = true;
      newCol.fields[0].isGroup = true;
      newCol.rows = this.getCloudFormStructure({id: field.id});
    }
  }
  //
  if (group)
    group.formStruct = rows;
  else
    this.formStruct = rows;
  //
  /*if (Client.mainFrame.isEditing()) {
   // Send the message to the proxy
   Client.eleMap["editm"].editProxy?.appCmd([{id: group ? group.id : this.id, c: "updateFormStucture", structure: rows}]);
   }*/
  //
  this.clientGeneratedFormStructure = true;
  //
  return groupConf ? rows : this.completeFormStructure(rows);
};


/**
 * The structure created by getCloudFormStructure doesn't have the conf widget property, only the config.
 * this is for let the system stringify it. When we ask for the structure we must create the config. We need to clone the structure so
 * that remains stringifyable.
 *
 * @param {*} structure
 * @returns
 */
Client.IdfPanel.prototype.completeFormStructure = function (structure)
{
  if (!structure)
    return;
  //
  let str = JSON.parse(JSON.stringify(structure));
  //
  let restoreRow = row => {
    row.conf = this.createElementConfig(row.config);
    //
    row.cols.forEach((col, j) => {
      col.conf = this.createElementConfig(col.config);
      col.conf.parentRowId = row.conf.id;
      row.conf.children.push(col.conf);
      //
      // SPECIAL : The config is sent from the server with ALL its field visibile (design time), but if client side the field is hidden
      // we need to update it
      if (col.fields?.length === 1) {
        let fld = Client.eleMap[col.fields[0].id];
        if (fld && !fld.isShown(true))
          row.cols.splice(j, 1);
      }
      //
      col.rows?.forEach(rws => restoreRow(rws));
      for (let j = 0; j < col.rows.length; j++)
        col.conf.children.push(col.rows[j].conf);
    });
  };
  //
  str.forEach(row => restoreRow(row));
  //
  return str;
};


Client.IdfPanel.prototype.removeFieldFromCloudRow = function (rws, field)
{
  if (!this.formStruct || !field.showInForm)
    return;
  //
  let rows = rws || this.formStruct;
  for (let j = 0; j < rows.length; j++) {
    let fIndex = rows[j].fields.findIndex(f => f.id === field.id);
    if (fIndex !== -1) {
      // Remove from cols AND the fields list
      this.removeFieldFromCloudCol(rows[j], field);
      rows[j].fields.splice(fIndex, 1);
      //
      // If the row is empty remove it
      if (rows[j].fields.length === 0)
        rows.splice(j, 1);
      break;
    }
    //
    if (field.groupId) {
      fIndex = rows[j].fields.findIndex(f => f.id === field.groupId);
      if (fIndex !== -1) {
        // Remove from cols
        this.removeFieldFromCloudCol(rows[j], field);
        break;
      }
    }
  }
};


Client.IdfPanel.prototype.removeFieldFromCloudCol = function (row, field)
{
  let cols = row.cols;
  for (let j = 0; j < cols.length; j++) {
    let fIndex = cols[j].fields.findIndex(f => f.id === field.id || f.id === field.groupId);
    if (fIndex !== -1) {
      if (cols[j].rows.length > 0) {
        // This col has the group, so we must remove the field from that
        this.removeFieldFromCloudRow(cols[j].rows, field);
      }
      else {
        // Remove the col from the row
        cols.splice(j, 1);
      }
      break;
    }
  }
};


Client.IdfPanel.prototype.restoreRowSelectors = function ()
{
  if (!this.showRowSelector)
    return;
  //
  // A list field was moved to a new position, we must ensure that the first list field has the row selectors and the rowsGroup headers
  let firstListField = this.getFirstInListField();
  let rowSelField = this.fields.find(f => f.isShown() && f.values.find(v => v?.rowSelectorId !== undefined));
  if (rowSelField && firstListField !== rowSelField) {
    // Move the rowselector from the second field to the new first field
    rowSelField.values.forEach((val, i) => {
      if (firstListField.values[i]) {
        firstListField.values[i].rowSelectorId = val.rowSelectorId;
        firstListField.values[i].rowsGroupHeaderId = val.rowsGroupHeaderId;
      }
      else if (i === 0) {
        Client.eleMap[val.rowSelectorId]?.close(true);
        Client.eleMap[val.rowsGroupHeaderId]?.close(true);
      }
      //
      delete val.rowSelectorId;
      delete val.rowsGroupHeaderId;
    });
  }
  else if (!rowSelField && firstListField) {
    // No row selectors, maybe we have deleted the field with the row selectors, in this case we need to recreate them (panel.createDataRow
    // doesn't work on already created rows/fields)
    firstListField.values.forEach((val, i) => {
      if (!val)
        return;
      //
      let dataRow = Client.eleMap[this.rows[i]?.id];
      if (!dataRow)
        return;
      //
      let rowSelectorConf = val.createRowSelectorConfig();
      dataRow.insertBefore({child: rowSelectorConf, sib: val.listContainerId});
      //
      let rowsGroupHeaderConf = val.createRowsGroupHeaderConfig();
      dataRow.insertBefore({child: rowsGroupHeaderConf, sib: rowSelectorConf.id});
    });
  }
};


/**
 * Add a custom commnad
 * @param {Object} options
 */
Client.IdfPanel.prototype.addCustomCommand = function (options)
{
  let i = this.customCommands.length;
  //
  // Positions for "1-8" custom commands are "18-25"
  // Positions for "9-16" custom commands are "37-45"
  let ofs = 18 + i;
  if (i >= 8)
    ofs = 37 + i - 8;
  //
  let conf = this.createElementConfig({c: "IonButton", className: "generic-btn panel-toolbar-btn custom-btn" + (i + 1), events: ["onClick"], customid: (this.id.replace(/:/g, "_") + "_custom" + i)});
  this.customButtonsConf.push(conf);
  //
  this.customCommands.push(options);
  //
  if (this.realizing)
    this.toolbarZonesConfig[this.getCommandZone(ofs)].children.push(conf);
  else {
    let zone = Client.eleMap[this.toolbarZonesConfig[this.getCommandZone(ofs)].id];
    zone.updateElement({visible: true});
    zone.insertBefore({child: conf});
    this.updateToolbar();
  }
};


/**
 * Updates the fields and the groups contained into the pages
 */
Client.IdfPanel.prototype.updatePagesFields = function ()
{
  // Align the pages indexes and clear the active page
  let pan = this;
  this.pages.forEach((p, i) => {
    p.index = i;
    //
    // Get page's fields from parent panel
    p.fields = [];
    for (let i = 0; i < pan.fields.length; i++) {
      let field = pan.fields[i];
      if (field.pageIndex === p.index) {
        field.page = p;
        p.fields.push(field);
      }
    }
    //
    // Get page's groups from parent panel
    p.groups = [];
    for (let i = 0; i < pan.groups.length; i++) {
      let group = pan.groups[i];
      if (group.pageIndex === p.index) {
        group.page = p;
        p.groups.push(group);
      }
    }
  });
};


/**
 * Get child flex grow value
 * @param {Client.IdfField/Client.IdfGroup} child
 */
Client.IdfPanel.prototype.getChildFlexGrow = function (child)
{
  let usePerc = !!child.listWidthPerc;
  //
  let adaptableFields = [];
  let adaptableGroups = [];
  //
  // If child belongs to a group, get group adaptable fields
  if (child.group)
    adaptableFields = child.group.fields.filter(f => f.canAdaptWidth() && f.isVisible() && (usePerc ? !!f.listWidthPerc : !f.listWidthPerc));
  else { // Otherwise get first level adaptable fields and groups
    adaptableFields = this.fields.filter(f => f.canAdaptWidth() && !f.group && f.isVisible() && (usePerc ? !!f.listWidthPerc : !f.listWidthPerc));
    adaptableGroups = this.groups.filter(g => g.canAdaptWidth() && g.isVisible() && (usePerc ? !!g.listWidthPerc : !g.listWidthPerc));
  }
  //
  let adaptableObjects = adaptableFields.concat(adaptableGroups);
  //
  let widths = [];
  adaptableObjects.forEach(o => widths.push(o.listWidthPerc || o.listWidth));
  //
  let flexGrow = 0;
  if (child.canAdaptWidth())
    flexGrow = (usePerc ? child.listWidthPerc : child.listWidth) / Math.min(...widths);
  //
  return flexGrow;
};


/**
 * Get toolbar height
 */
Client.IdfPanel.prototype.getToolbarHeight = function ()
{
  // If not toolbar return 0
  if (this.onlyContent)
    return 0;
  //
  // if 0 or not defined return 40/54
  return this.toolbarHeight || (this.smallIcons ? 40 : 54);
};


/**
 * Get pages container height
 */
Client.IdfPanel.prototype.getPagesContainerHeight = function ()
{
  return this.pagesContainerHeight || 0;
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfPanel.prototype.close = function (firstLevel, triggerAnimation)
{
  clearTimeout(this.firstScrollTimer);
  clearTimeout(this.editInsertTimeout);
  //
  delete this.firstScrollTimer;
  delete this.editInsertTimeout;
  //
  this.resizeObserver?.disconnect();
  delete this.resizeObserver;
  //
  this.intersectionObserver?.disconnect();
  delete this.intersectionObserver;
  //
  Client.IdfFrame.prototype.close.call(this, firstLevel, triggerAnimation);
};


/**
 * Show or hides the hilite for the selected rows during delete
 * @param {boolean} show - show the hilite
 */
Client.IdfPanel.prototype.hiliteDelete = function (show)
{
  if (show) {
    // During multiselection call the function for each selected row, otherwise call it a single time
    // with the current selected row index
    let showFn = (selected, index) => {
      if (!selected)
        return;
      //
      let selRow = this.getRow(index);
      if (selRow)
        selRow.getRootObject().classList.add("deleting-row");
    };
    //
    if (this.showMultipleSelection)
      this.multiSelStatus.forEach(showFn);
    else
      showFn(true, this.getActiveRowIndex());
  }
  else {
    let deletingRows = Client.eleMap[this.gridConf?.id]?.getRootObject().getElementsByClassName("deleting-row");
    while (deletingRows?.length > 0)
      deletingRows[0].classList.remove("deleting-row");
  }
};


/**
 * Update visible aggregate fields
 * @param {String} fieldId
 * @param {Boolean} remove
 */
Client.IdfPanel.prototype.updateVisibleAggregateFields = function (fieldId, remove)
{
  let index = this.visibleAggregateFields.indexOf(fieldId);
  if (!remove && index === -1)
    this.visibleAggregateFields.push(fieldId.id);
  else if (remove && index !== -1)
    this.visibleAggregateFields.splice(index, 1);
};


/**
 * Change parent to field value elements
 * @param {Client.Widget} el
 * @param {Client.Widget} newParentWidget
 */
Client.IdfPanel.prototype.reparentFieldValueElements = function (el, newParentWidget)
{
  if (!el)
    return;
  //
  if (el.parentWidget instanceof Client.IdfFieldValue)
    el.parentWidget = newParentWidget;
  //
  let children = el.elements || [];
  for (let i = 0; i < children.length; i++)
    this.reparentFieldValueElements(children[i], newParentWidget);
};


/**
 * Update Wrap row configuration
 */
Client.IdfPanel.prototype.checkWrapRow = function ()
{
  let curRow = 1;
  let wrapRows = {};
  for (let i = 0; i < this.fields.length; i++) {
    if (this.fields[i].rowBreakBefore)
      curRow++;
    //
    wrapRows[this.fields[i].id] = curRow;
  }
  //
  if (curRow > 1) {
    this.numSubRows = curRow;
    this.wrapRows = wrapRows;
  }
  else {
    this.numSubRows = 1;
    this.wrapRows = [];
  }
};


/**
 * If the list has the horizontal scrollbar the flex system with the subrows is screwed,
 * is impossibile to have the subrows with the same width.
 * In that case we need to clear the old value, measure the rows and force them to the max width
 */
Client.IdfPanel.prototype.updateSubRowsWidth = function ()
{
  if (!this.hasListLayout())
    return;
  //
  let grid = Client.eleMap[this.gridConf.id].getRootObject();
  //
  if (this.numSubRows === 1 || grid.scrollWidth <= grid.clientWidth)
    return;
  //
  let headerRow = Client.eleMap[this.gridHeaderConf.id];
  //
  // Clear previous configuration
  for (let sr = 0; sr < this.numSubRows; sr++)
    headerRow.elements[0].elements[sr].getRootObject().style.width = "";
  if (this.qbeRowConf) {
    let qbeRw = Client.eleMap[this.qbeRowConf.id];
    for (let sr = 0; sr < this.numSubRows; sr++)
      qbeRw.elements[0].elements[sr].getRootObject().style.width = "";
  }
  for (let i = this.firstRow; i <= this.lastRow; i++) {
    let rw = this.getRow(i);
    for (let sr = 0; sr < this.numSubRows; sr++)
      rw.elements[0].elements[sr].getRootObject().style.width = "";
  }
  //
  // Calculate the max by using the header row
  let maxwh = 0;
  for (let sr = 0; sr < this.numSubRows; sr++)
    maxwh = Math.max(maxwh, headerRow.elements[0].elements[sr].getRootObject().scrollWidth);
  //
  for (let sr = 0; sr < this.numSubRows; sr++)
    if (headerRow.elements[0].elements[sr].getRootObject().scrollWidth < maxwh)
      headerRow.elements[0].elements[sr].getRootObject().style.width = maxwh + "px";
  //
  if (this.qbeRowConf) {
    let qbeRw = Client.eleMap[this.qbeRowConf.id];
    for (let sr = 0; sr < this.numSubRows; sr++)
      if (qbeRw.elements[0].elements[sr].getRootObject().scrollWidth < maxwh)
        qbeRw.elements[0].elements[sr].getRootObject().style.width = maxwh + "px";
  }
  //
  for (let i = this.firstRow; i <= this.lastRow; i++) {
    let rw = this.getRow(i);
    for (let sr = 0; sr < this.numSubRows; sr++)
      if (rw.elements[0].elements[sr].getRootObject().scrollWidth < maxwh)
        rw.elements[0].elements[sr].getRootObject().style.width = maxwh + "px";
  }
};


Client.IdfPanel.prototype.getClientState = function (states)
{
  let state = {id: this.id};
  state.activePage = this.activePage;
  state.layout = this.layout;
  //
  if (this.formContainerConf) {
    let ele = Client.eleMap[this.formContainerConf.id]?.getRootObject(true);
    state.formScrollTop = ele?.scrollTop || 0;
    state.formScrollLeft = ele?.scrollLeft || 0;
  }
  if (this.listContainerConf) {
    let ele = Client.eleMap[this.listContainerConf.id]?.getRootObject(true);
    state.listScrollTop = ele?.scrollTop || 0;
    state.listScrollLeft = ele?.scrollLeft || 0;
  }
  //
  states.push(state);
};


Client.IdfPanel.prototype.restoreClientState = function (state)
{
  if (state.id !== this.id)
    return;
  //
  this.updateElement(state);
  //
  let fcont = Client.eleMap[this.formContainerConf?.id]?.getRootObject(true);
  if (fcont) {
    fcont.scrollLeft = state.formScrollLeft || 0;
    fcont.scrollTop = state.formScrollTop || 0;
  }
  let lcont = Client.eleMap[this.listContainerConf?.id]?.getRootObject(true);
  if (lcont) {
    lcont.scrollLeft = state.listScrollTop || 0;
    lcont.scrollTop = state.listScrollLeft || 0;
  }
};


/**
 * Add or remove given field from viewport fields array
 * @param {Client.IdfField} field
 * @param {Boolean} add
 */
Client.IdfPanel.prototype.updateViewportListFields = function (field, add)
{
  if (!field)
    return;
  //
  let exists = this.viewportListFields.includes(field.id);
  if (add && !exists) {
    this.viewportListFields.push(field.id);
    //
    // Update fields that are in viewport at panel creation and start update other fields requesting animation frames
    if (!field.firstUpdate) {
      field.firstUpdate = true;
      if (this.canUseRowQbe())
        field.updateControls({all: true}, {index: 0});
      //
      field.updateControls({all: true}, {from: this.firstRow, to: this.lastRow});
      //
      this.updateOutViewportListFields(true);
    }
  }
  else if (!add && exists)
    this.viewportListFields.splice(this.viewportListFields.indexOf(field.id), 1);
};


/**
 * Update out viewport list fields
 * @param {Boolean} resetBoundaries
 */
Client.IdfPanel.prototype.updateOutViewportListFields = function (resetBoundaries)
{
  // At animation frame, update some fields on first field left and some fields on last field right (up to a max of 10 at a time)
  cancelAnimationFrame(this.outViewportRAF);
  //
  if (resetBoundaries) {
    delete this.lowerFieldsBound;
    delete this.upperFieldsBound;
  }
  //
  // If all fields have been updated, do nothing
  if (this.lowerFieldsBound === 0 && this.upperFieldsBound === this.fields.length)
    return;
  //
  this.outViewportRAF = requestAnimationFrame(() => {
    // Initialize lower and upper fields bound
    if (!this.lowerFieldsBound && !this.upperFieldsBound) {
      let firstViewportFieldIndex = this.fields.indexOf(Client.eleMap[this.viewportListFields[0]]);
      let lastViewportFieldIndex = firstViewportFieldIndex + (this.viewportListFields.length - 1);
      //
      this.lowerFieldsBound = Math.max(0, firstViewportFieldIndex - 1);
      this.upperFieldsBound = Math.min(this.fields.length - 1, lastViewportFieldIndex + 1);
    }
    //
    let fieldsLength = this.fields.length;
    let field;
    //
    // Calculate how many fields to update (up to "max") on the left of first viewport field and on the right of last viewport field
    let max = 10;
    let halfMax = max / 2;
    let maxLowerUpdatable = Math.min(this.lowerFieldsBound, max);
    let maxUpperUpdatable = Math.min(fieldsLength - this.upperFieldsBound, max);
    //
    // By default update half max fields on the left and half max on the right
    let lowerUpdatable = upperUpdatable = halfMax;
    //
    // If there's not enough room on the left, update more fields on the right
    if (maxLowerUpdatable < halfMax) {
      lowerUpdatable = maxLowerUpdatable;
      upperUpdatable = Math.min(max - lowerUpdatable, maxUpperUpdatable);
    }
    else if (maxUpperUpdatable < halfMax) { // Otherwise update more fields on the left
      upperUpdatable = maxUpperUpdatable;
      lowerUpdatable = Math.min(max - upperUpdatable, maxLowerUpdatable);
    }
    //
    // Update lower fields
    while (this.lowerFieldsBound > 0 && lowerUpdatable > 0) {
      field = this.fields[this.lowerFieldsBound];
      field.updateControls({all: true}, {from: this.firstRow, to: this.lastRow, force: true});
      //
      lowerUpdatable--;
      this.lowerFieldsBound--;
    }
    //
    // Update upper fields
    while (this.upperFieldsBound < fieldsLength && upperUpdatable > 0) {
      field = this.fields[this.upperFieldsBound];
      field.updateControls({all: true}, {from: this.firstRow, to: this.lastRow, force: true});
      //
      upperUpdatable--;
      this.upperFieldsBound++;
    }
    //
    // Request a new animation frame to update next fields
    this.updateOutViewportListFields();
  });
};


/**
 * Get new rows count
 */
Client.IdfPanel.prototype.getNewRows = function ()
{
  let maxRows = this.getMaxRows(true);
  //
  let newRows = 0;
  for (let i = maxRows; i > 0; i--) {
    if (this.isNewRow(i))
      newRows++;
    else
      break;
  }
  //
  return newRows;
};


/**
 * Get existing rows count
 */
Client.IdfPanel.prototype.getExistingRows = function ()
{
  let existingRows = 0;
  //
  if (this.hasGroupedRows()) {
    existingRows = 0;
    for (let index in this.rows)
      existingRows += index !== "0" && this.rows[index] && !this.isRowDetached(index) ? 1 : 0;
  }
  else if (this.firstRow && this.lastRow)
    existingRows = this.lastRow - this.firstRow + 1;
  //
  return existingRows;
};


/**
 * Get grouped actual row
 */
Client.IdfPanel.prototype.getGroupedActualRow = function ()
{
  return this.groupedRowsRoot.realIndexToGroupedIndex(this.getActiveRowIndex(true)) - this.groupedActualPosition;
};


/**
 * Get grouped actual position
 */
Client.IdfPanel.prototype.getGroupedActualPosition = function ()
{
  let groupedActualPosition = this.groupedRowsRoot.realIndexToGroupedIndex(this.actualPosition);
  if (this.groupedRowsRoot.isRowVisible(groupedActualPosition))
    return groupedActualPosition;
  //
  for (let i = groupedActualPosition; i >= 1; i--) {
    if (this.groupedRowsRoot.isRowVisible(i) && this.getRowsGroupByIndex(i)) {
      groupedActualPosition = i;
      break;
    }
  }
  //
  return groupedActualPosition;
};


/**
 * Handle list tab order
 * @param {Object} config
 */
Client.IdfPanel.handleListTabOrder = function (config)
{
  // Get idfFields
  let idfFields = config.children.filter(child => child.c === "IdfField");
  //
  // Sort by list tab order index
  idfFields.sort((a, b) => a.listTabOrderIndex - b.listTabOrderIndex);
  //
  // Insert idfFields into sorted position
  let idfFieldIndex = 0;
  config.children = config.children.map(child => {
    if (child.c === "IdfField")
      return idfFields[idfFieldIndex++];
    //
    return child;
  });
};
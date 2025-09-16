/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A panel field
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfField = function (widget, parent, view)
{
  // Add this field to panel fields array
  parent.addField(this);
  parent.updateRowSelectorsVisibility();
  //
  this.values = [];
  //
  // Set default values
  widget = Object.assign({
    dataType: Client.IdfField.dataTypes.TEXT,
    listTop: 0,
    listLeft: 0,
    formTop: 0,
    formLeft: 0,
    maxLength: Client.mainFrame.isIDF ? 255 : undefined,
    sortMode: Client.IdfField.sortModes.NONE,
    groupingMode: Client.IdfField.groupingModes.NONE,
    searchMode: Client.IdfField.searchModes.STARTSWITH,
    type: Client.IdfField.types.MASTER,
    visible: true,
    showInList: true,
    showInForm: true,
    inList: true,
    showListHeader: true,
    listHeaderAbove: false,
    showFormHeader: true,
    listNumRows: 1,
    formNumRows: 1,
    formHeaderAbove: !Client.mainFrame.isIDF,
    causeValidation: true,
    canActivate: false,
    hasValueSource: false,
    alignment: Client.IdfVisualStyle.alignments.AUTO,
    enabled: true,
    activableDisabled: false,
    superActive: false,
    unbound: false,
    canSort: true,
    editorType: Client.IdfField.editorTypes.NORMAL,
    scale: 0,
    showHtmlEditorToolbar: true,
    multiUpload: false,
    maxUploadSize: 10 * 1024 * 1024,
    maxUploadFiles: 0,
    uploadExtensions: "*.*",
    image: "",
    mask: "",
    qbeFilter: "",
    imageResizeMode: Client.mainFrame.isIDF ? Client.IdfField.stretches.REPEAT : Client.IdfField.stretches.CENTER,
    autoLookup: false,
    smartLookup: false,
    optional: true,
    pageIndex: 0,
    enabledInQbe: true,
    comboMultiSel: true,
    comboSeparator: ";",
    notifySelectionChange: false,
    aggregateOfField: -1,
    listTabOrderIndex: -1,
    formTabOrderIndex: -1,
    controlType: !Client.mainFrame.isIDF ? Client.IdfField.controlTypes.AUTO : undefined,
    clickEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    changeEventDef: Client.IdfMessagesPump?.eventTypes.DEFERRED,
    QBELike: true
  }, widget);
  //
  if (widget.events?.includes("onActivated"))
    widget.canActivate = true;
  //
  // Check if there is a dimension property with '%' in his value, in that case we set the relative Perc property
  if (!Client.mainFrame.isIDF) {
    let dimNames = [
      "listLeft", "listTop", "formLeft", "formTop",
      "listWidth", "listHeight",
      "formWidth", "formHeight"
    ];
    for (let p in widget) {
      if (dimNames.indexOf(p) >= 0) {
        if (widget[p]?.indexOf && widget[p]?.indexOf("%") > 0) {
          widget[p + "Perc"] = parseInt(widget[p].replace('%', ''));
          delete widget[p];
        }
        else if (widget[p]?.indexOf)
          widget[p] = parseInt(widget[p]);
      }
    }
    //
    if (widget.children?.length) {
      widget.customChildrenConf = widget.children.slice();
      delete widget.children;
    }
  }
  //
  // Set original dimensions and position
  this.orgListWidth = widget.listWidth;
  this.orgListWidthPerc = widget.listWidthPerc;
  this.orgListHeight = widget.listHeight;
  this.orgListHeightPerc = widget.listHeightPerc;
  this.orgListLeft = widget.listLeft;
  this.orgListLeftPerc = widget.listLeftPerc;
  this.orgListTop = widget.listTop;
  this.orgListTopPerc = widget.listTopPerc;
  this.orgFormWidth = widget.formWidth;
  this.orgFormWidthPerc = widget.formWidthPerc;
  this.orgFormHeight = widget.formHeight;
  this.orgFormHeightPerc = widget.formHeightPerc;
  this.orgFormLeft = widget.formLeft;
  this.orgFormLeftPerc = widget.formLeftPerc;
  this.orgFormTop = widget.formTop;
  this.orgFormTopPerc = widget.formTopPerc;
  //
  this.listHeaderStyle = {};
  this.listValueStyle = {};
  this.listQbeValueStyle = {};
  this.outListHeaderStyle = {};
  this.outListValueStyle = {};
  this.outListParentColStyle = {};
  this.formHeaderStyle = {};
  this.formValueStyle = {};
  this.formParentColStyle = {};
  this.aggregateContainerStyle = {};
  //
  this.listHeaderCustomStyle = {};
  this.listCustomStyle = {};
  this.formHeaderCustomStyle = {};
  this.formCustomStyle = {};
  //
  widget.children = widget.children || [];
  //
  // If this is a static field, create a child IdfFieldValue (IDF do not send me a value in this case)
  if (widget.type === Client.IdfField.types.STATIC)
    this.prepareStaticField(widget, parent);
  //
  Client.Widget.call(this, widget, parent, view);
  //
  // Append the subframe between my children after the base constructor
  // because elements are initialized in it
  if (this.subFrame)
    this.elements.push(this.subFrame);
};


// Make Client.IdfField extend Client.Widget
Client.IdfField.prototype = new Client.Widget();


Client.IdfField.transPropMap = {
  idx: "index",
  vis: "visible",
  inl: "showInList",
  inf: "showInForm",
  pag: "pageIndex",
  lli: "inList",
  hdr: "header",
  lih: "listHeader",
  lwi: "listWidth",
  lhe: "listHeight",
  lle: "listLeft",
  lto: "listTop",
  lhr: "listResizeWidth",
  lvr: "listResizeHeight",
  foh: "formHeader",
  fwi: "formWidth",
  fhe: "formHeight",
  fle: "formLeft",
  fto: "formTop",
  fhr: "formResizeWidth",
  fvr: "formResizeHeight",
  hdl: "showListHeader",
  hla: "listHeaderAbove",
  lhs: "listHeaderSize",
  hdf: "showFormHeader",
  hfa: "formHeaderAbove",
  fhs: "formHeaderSize",
  lnr: "listNumRows",
  fnr: "formNumRows",
  dat: "dataType",
  max: "maxLength",
  smo: "sortMode",
  gro: "groupingMode",
  idp: "type",
  cva: "causeValidation",
  act: "canActivate",
  aci: "activatorImage",
  acw: "activatorWidth",
  qvs: "hasValueSource",
  aln: "alignment",
  bkc: "backColor",
  frc: "color",
  msk: "mask",
  ftm: "fontModifiers",
  ena: "enabled",
  acd: "activableDisabled",
  sac: "superActive",
  unb: "unbound",
  srt: "canSort",
  edi: "editorType",
  fsc: "scale",
  uet: "showHtmlEditorToolbar",
  mup: "multiUpload",
  mus: "maxUploadSize",
  muf: "maxUploadFiles",
  uex: "uploadExtensions",
  img: "image",
  irm: "imageResizeMode",
  alo: "autoLookup",
  lke: "smartLookup",
  opt: "optional",
  sub: "subFrameId",
  gru: "groupId",
  qen: "enabledInQbe",
  cms: "comboMultiSel",
  aof: "aggregateOfField",
  qbf: "qbeFilter",
  vfl: "visualFlags",
  cvs: "comboSeparator",
  chg: "changeEventDef",
  wtm: "placeholder",
  uts: "notifySelectionChange",
  lta: "listTabOrderIndex",
  fta: "formTabOrderIndex",
  oqbf: "needFilterPopup",
  ocb: "needToOpenCombo",
  cmd: "command",
  fbr: "rowBreakBefore",
  qbl: "QBELike"
};


Client.IdfField.resizeModes = {
  NONE: 1,
  MOVE: 2,
  STRETCH: 3,
  GROW: 4
};


Client.IdfField.types = {
  STATIC: -1,
  MASTER: 0,
  LOOKUP: 1
};


Client.IdfField.editorTypes = {
  NORMAL: 0,
  HTMLEDITOR: 1
};


Client.IdfField.dataTypes = {
  UNSPECIFIED: 0,
  INTEGER: 1,
  FLOAT: 2,
  DECIMAL: 3,
  CURRENCY: 4,
  CHARACTER: 5,
  DATE: 6,
  TIME: 7,
  DATETIME: 8,
  TEXT: 9,
  BLOB: 10,
  BOOLEAN: 11,
  FIXED_CHARACTER: 12,
  OBJECT: 13
};


Client.IdfField.stretches = {
  REPEAT: 1,
  CENTER: 2,
  FIT: 3
};


Client.IdfField.sortModes = {
  ASC: -1,
  NONE: 0,
  DESC: 1
};


Client.IdfField.groupingModes = {
  ASC: -1,
  NONE: 0,
  DESC: 1
};


Client.IdfField.searchModes = {
  NOLIKE: 0,
  EQUALS: 1,
  STARTSWITH: 2,
  CONTAINS: 3
};


Client.IdfField.comboTypes = {
  NOAUTOLOOKUP: 1,
  AUTOLOOKUP: 2,
  SMARTLOOKUP: 3
};


Client.IdfField.activationReasons = {
  ACTIVATOR_CLICK: 0,
  ACTIVATOR_RIGHTCLICK: 1,
  DOUBLECLICK: 2,
  RIGHTCLICK: 3,
  FUNCTIONKEY: 4
};


Client.IdfField.defaultHeight = 32;
Client.IdfField.minWidth = 20;

Client.IdfField.controlTypes = {AUTO: 1, EDIT: 2, COMBO: 3, CHECK: 4, OPTION: 5, BUTTON: 6, HTMLEDITOR: 7, CUSTOM: 8, BLOB: 10, CHECKLIST: 11, LISTGROUPHEADER: 111};


/**
 * Create element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfField.createConfigFromXml = function (xml)
{
  let config = {};
  //
  let attrList = xml.attributes;
  for (let i = 0; i < attrList.length; i++) {
    if (attrList[i].nodeName === "pdp") {
      // Array of properties that handle percentage dimensions
      let percNames = [
        "listLeftPerc", "listTopPerc", "formLeftPerc", "formTopPerc",
        "listWidthPerc", "listHeightPerc", "listHeaderSizePerc",
        "formWidthPerc", "formHeightPerc", "formHeaderSizePerc"
      ];
      //
      // Get percentage values
      let percValues = attrList[i].nodeValue.split(",");
      //
      // Assign percentage value to the equivalent percentage name, skipping "-1" values
      for (let j = 0; j < percValues.length; j++) {
        let perc = parseInt(percValues[j]);
        if (perc === -1)
          continue;
        //
        // Server sends me "110" for "11%", so divide value by 10 to obtain percentage value
        config[percNames[j]] = perc / 10;
      }
      break;
    }
  }
  //
  // Pre-calculate values config to make it easier for IdfPanel to find the beginning and end block indexes
  // when a new set of data comes from server
  config.valuesConfig = [];
  for (let i = 0; i < xml.childNodes.length; i++) {
    let child = xml.childNodes[i];
    //
    // I'm only interested in "val" nodes
    if (child.nodeName !== "val")
      continue;
    //
    // Create val configuration
    let valConfig = {};
    attrList = child.attributes;
    for (let j = 0; j < attrList.length; j++) {
      let attrNode = attrList[j];
      valConfig[attrNode.nodeName] = attrNode.nodeValue;
    }
    //
    // Push it into valuesConfig
    config.valuesConfig.push(valConfig);
  }
  //
  return config;
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfField.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfField.transPropMap.idx:
      case Client.IdfField.transPropMap.pag:
      case Client.IdfField.transPropMap.max:
      case Client.IdfField.transPropMap.smo:
      case Client.IdfField.transPropMap.gro:
      case Client.IdfField.transPropMap.idp:
      case Client.IdfField.transPropMap.lwi:
      case Client.IdfField.transPropMap.lhe:
      case Client.IdfField.transPropMap.lle:
      case Client.IdfField.transPropMap.lto:
      case Client.IdfField.transPropMap.lhr:
      case Client.IdfField.transPropMap.lvr:
      case Client.IdfField.transPropMap.lhs:
      case Client.IdfField.transPropMap.fwi:
      case Client.IdfField.transPropMap.fhe:
      case Client.IdfField.transPropMap.fle:
      case Client.IdfField.transPropMap.fto:
      case Client.IdfField.transPropMap.fhr:
      case Client.IdfField.transPropMap.fvr:
      case Client.IdfField.transPropMap.fhs:
      case Client.IdfField.transPropMap.lnr:
      case Client.IdfField.transPropMap.fnr:
      case Client.IdfField.transPropMap.dat:
      case Client.IdfField.transPropMap.acw:
      case Client.IdfField.transPropMap.aln:
      case Client.IdfField.transPropMap.edi:
      case Client.IdfField.transPropMap.mus:
      case Client.IdfField.transPropMap.muf:
      case Client.IdfField.transPropMap.irm:
      case Client.IdfField.transPropMap.vfl:
      case Client.IdfField.transPropMap.chg:
      case Client.IdfField.transPropMap.fsc:
      case Client.IdfField.transPropMap.lta:
      case Client.IdfField.transPropMap.fta:
      case Client.IdfField.transPropMap.aof:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfField.transPropMap.vis:
      case Client.IdfField.transPropMap.inl:
      case Client.IdfField.transPropMap.inf:
      case Client.IdfField.transPropMap.lli:
      case Client.IdfField.transPropMap.hdl:
      case Client.IdfField.transPropMap.hla:
      case Client.IdfField.transPropMap.hdf:
      case Client.IdfField.transPropMap.hfa:
      case Client.IdfField.transPropMap.cva:
      case Client.IdfField.transPropMap.act:
      case Client.IdfField.transPropMap.qvs:
      case Client.IdfField.transPropMap.ena:
      case Client.IdfField.transPropMap.acd:
      case Client.IdfField.transPropMap.sac:
      case Client.IdfField.transPropMap.unb:
      case Client.IdfField.transPropMap.srt:
      case Client.IdfField.transPropMap.uet:
      case Client.IdfField.transPropMap.mup:
      case Client.IdfField.transPropMap.alo:
      case Client.IdfField.transPropMap.lke:
      case Client.IdfField.transPropMap.opt:
      case Client.IdfField.transPropMap.qen:
      case Client.IdfField.transPropMap.cms:
      case Client.IdfField.transPropMap.uts:
      case Client.IdfField.transPropMap.oqbf:
      case Client.IdfField.transPropMap.ocb:
      case Client.IdfField.transPropMap.fbr:
      case Client.IdfField.transPropMap.qbl:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Create elements configuration
 * @param {Object} widget
 */
Client.IdfField.prototype.createElementsConfig = function (widget)
{
  // Each field has a "list" and a "form" configuration
  let config = {};
  //
  // 1) Create list container configuration
  if (this.isShown()) {
    config.list = this.createContainerConfig();
    config.aggregate = this.createAggregateContainerConfig();
  }
  //
  // 2) Create form container configuration
  if (this.isShown(true))
    config.form = this.createContainerConfig(true);
  //
  return config;
};


/**
 * Create elements configuration for list/form mode
 * @param {Boolean} form
 */
Client.IdfField.prototype.createContainerConfig = function (form)
{
  let containerConf, headerConf, headerButtonConf, headerTextConf;
  let customId = this.id.replace(/:/g, "_");
  //
  if (!form && this.isInList()) {
    // Create list container configuration
    let offsetCol = this.parent.getHeaderOffset() ? " offset-col" : "";
    containerConf = this.createElementConfig({c: "IonCol", className: "panel-list-col" + offsetCol, tabIndex: 0, customid: customId + "_lc", events: ["onClick"]});
    //
    // Create list header configuration
    headerButtonConf = this.createElementConfig({c: "IonButton", className: "generic-btn field-header-btn", visible: false});
    containerConf.children.push(headerButtonConf);
    //
    headerTextConf = this.createElementConfig({c: "IonText", type: "span"});
    containerConf.children.push(headerTextConf);
    //
    // Save elements ids
    this.listContainerId = containerConf.id;
    this.listHeaderButtonId = headerButtonConf.id;
    this.listHeaderTextId = headerTextConf.id;
  }
  else if (!form && this.aggregateOfField !== -1) {
    let parentField = this.getAggregatedFieldParent();
    //
    let controlConfig = this.createControlConfig();
    containerConf = this.createElementConfig(controlConfig.control);
    //
    this.outListContainerId = parentField.aggregateContainerId;
    this.outListValueId = parentField.aggregateContainerId;
    this.outListControlId = containerConf.id;
  }
  else {
    // Create out list container configuration
    containerConf = this.createElementConfig({c: "Container", className: "panel-form-row"});
    //
    // Create out list header configuration (static field has no header)
    if (!this.isStatic(true)) {
      headerConf = this.createElementConfig({c: "Container", className: "panel-form-col-header", customid: customId + "_fc"});
      containerConf.children.push(headerConf);
      //
      headerButtonConf = this.createElementConfig({c: "IonButton", className: "generic-btn field-header-btn", visible: false});
      headerConf.children.push(headerButtonConf);
      //
      headerTextConf = this.createElementConfig({c: "IonText", type: "span"});
      headerConf.children.push(headerTextConf);
    }
    //
    let controlConfig = this.createControlConfig(form);
    //
    // Create out list value container configuration
    let valueContainerConf = this.createElementConfig(controlConfig.container);
    containerConf.children.push(valueContainerConf);
    //
    let outListControlConf = this.createElementConfig(controlConfig.control);
    valueContainerConf.children.push(outListControlConf);
    //
    // Save elements ids
    if (form) {
      this.formContainerId = containerConf.id;
      this.formHeaderId = headerConf?.id;
      this.formHeaderButtonId = headerButtonConf?.id;
      this.formHeaderTextId = headerTextConf?.id;
      this.formValueId = valueContainerConf.id;
      this.formControlId = outListControlConf.id;
    }
    else {
      this.outListContainerId = containerConf.id;
      this.outListHeaderId = headerConf?.id;
      this.outListHeaderButtonId = headerButtonConf?.id;
      this.outListHeaderTextId = headerTextConf?.id;
      this.outListValueId = valueContainerConf.id;
      this.outListControlId = outListControlConf.id;
    }
  }
  //
  return containerConf;
};


/**
 * Create aggregate container configuration
 */
Client.IdfField.prototype.createAggregateContainerConfig = function ()
{
  if (!this.isInList())
    return;
  //
  // Create aggregate container
  this.aggregateContainerConf = this.createElementConfig({c: "IonCol", className: "panel-list-col"});
  this.aggregateContainerId = this.aggregateContainerConf.id;
  //
  return this.aggregateContainerConf;
};


/**
 * Create control configuration
 * @param {Boolean} form
 * @param {Number} index
 */
Client.IdfField.prototype.createControlConfig = function (form, index)
{
  let config = {};
  //
  // Define base control configuration
  config.control = {c: "IdfControl", dataType: this.dataType};
  //
  if (!form && this.isInList()) {
    // Define list container configuration
    let offsetCol = this.parent.getListRowOffset() ? " offset-col" : "";
    let cid = this.id.replace(/:/g, "_") + "_lv" + index;
    config.container = {c: "IonCol", className: "panel-list-col" + offsetCol, customid: cid, tabIndex: 0};
    //
    // Set specific in list control properties
    config.control.badgeInside = true;
  }
  else {
    let isStatic = this.isStatic();
    let cid = this.id.replace(/:/g, "_") + (form ? "_fv" : (isStatic ? "_lc" : "_lv0"));
    config.container = {c: "Container", className: "panel-form-col-value" + (isStatic ? " static-field" : ""), customid: cid, tabIndex: 0};
    config.control.badgeInside = !Client.mainFrame.isIDF;
  }
  //
  config.container.events = ["onClick", "onDblclick", "onContextmenu", "onFocusin", "onFocusout", "onDragover"];
  //
  return config;
};


/**
 * Check if given data type is a text one
 * @param {Integer} dt
 */
Client.IdfField.isText = function (dt)
{
  return [
    Client.IdfField.dataTypes.UNSPECIFIED,
    Client.IdfField.dataTypes.TEXT,
    Client.IdfField.dataTypes.CHARACTER,
    Client.IdfField.dataTypes.FIXED_CHARACTER
  ].includes(dt);
};


/**
 * Check if given data type is a numeric one
 * @param {Integer} dt
 */
Client.IdfField.isNumeric = function (dt)
{
  return [
    Client.IdfField.dataTypes.INTEGER,
    Client.IdfField.dataTypes.FLOAT,
    Client.IdfField.dataTypes.DECIMAL,
    Client.IdfField.dataTypes.CURRENCY
  ].includes(dt);
};


/**
 * Check if given data type is date
 * @param {Integer} dt
 */
Client.IdfField.isDate = function (dt)
{
  return [
    Client.IdfField.dataTypes.DATE,
    Client.IdfField.dataTypes.DATETIME
  ].includes(dt);
};


/**
 * Check if given data type is time
 * @param {Integer} dt
 */
Client.IdfField.isTime = function (dt)
{
  return [
    Client.IdfField.dataTypes.TIME,
    Client.IdfField.dataTypes.DATETIME
  ].includes(dt);
};


/**
 * Check if given data type is date, time or datetime
 * @param {Integer} dt
 */
Client.IdfField.isDateOrTime = function (dt)
{
  return [
    Client.IdfField.dataTypes.DATE,
    Client.IdfField.dataTypes.TIME,
    Client.IdfField.dataTypes.DATETIME
  ].includes(dt);
};


/**
 * Get widget requirements
 * @param {Object} widget
 */
Client.IdfField.getRequirements = function (widget)
{
  let prefix = Client.mainFrame.isIDF ? "fluid/" : "";
  let req = {};
  //
  if ((widget.editorType === Client.IdfField.editorTypes.HTMLEDITOR) || (widget.controlType === Client.IdfField.controlTypes.HTMLEDITOR)) {
    // Add Html editor requirements
    req[prefix + "jquery.min.js"] = {type: "jc", name: "JQuery"};
    req[prefix + "objects/htmleditor/htmlEditor.js"] = {type: "jc", name: "htmlEditorJS"};
    req[prefix + "objects/htmleditor/plugins/emoji/emojify/emojify.css"] = {type: "cs", name: "emojifyCSS"};
    req[prefix + "objects/htmleditor/plugins/emoji/emojify/emojify.js"] = {type: "jc", name: "emojifyJS"};
    req[prefix + "objects/htmleditor/trumbowyg.min.js"] = {type: "jc", name: "trumbowygJS"};
    req[prefix + "objects/htmleditor/ui/icons.svg"] = {type: "sv", name: "trumbowygSVG"};
    req[prefix + "objects/htmleditor/ui/trumbowyg.min.css"] = {type: "cs", name: "trumbowygCSS"};
  }
  //
  return req;
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfField.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  let config = this.createElementsConfig(widget);
  //
  let fieldEl;
  //
  // Create list version of this field
  if (config.list) {
    // Create field element and append it to parent (panel rootObject). Then it will be appended in the proper object
    fieldEl = view.createElement(config.list, parent, view);
    this.mainObjects.push(fieldEl);
    //
    // Create aggregate field element and append it to parent (panel rootObject). Then it will be appended in the proper object
    if (config.aggregate) {
      let aggregateFieldEl = view.createElement(config.aggregate, parent, view);
      this.mainObjects.push(aggregateFieldEl);
    }
  }
  //
  // Create form version of this field
  if (config.form) {
    // Create field element and append it to parent (panel rootObject). Then it will be appended in the proper object
    fieldEl = view.createElement(config.form, parent, view);
    this.mainObjects.push(fieldEl);
  }
  //
  if (Client.mainFrame.isEditing()) {
    widget.children.push(...this.createFakeFieldsValues());
  }
  //
  // Create widget children
  this.createChildren(widget);
  //
  if (Client.mainFrame.isEditing() && this.isInList())
    this.parent.intersectionObserver?.observe(Client.eleMap[this.listContainerId].getRootObject());
};


/**
 * Append field dom objects to their own column
 */
Client.IdfField.prototype.place = function ()
{
  if (this.isShown() && this.parent.getListFieldColumn(this.id)) {
    this.placeListForm();
    //
    // If field is in list also place its aggregate container
    if (this.isInList())
      this.placeListForm({aggregate: true});
  }
  //
  if (this.isShown(true) && this.parent.getFormFieldColumn(this.id))
    this.placeListForm({form: true});
};


/**
 * Append list/form field dom object to its own column
 * @param {Object} options
 *                        - form
 *                        - aggregate: true if I have to place aggregate container
 */
Client.IdfField.prototype.placeListForm = function (options)
{
  options = options || {};
  let form = options.form;
  let aggregate = options.aggregate;
  //
  // If I'm an aggregation of field, aggregate field owns and places my container
  if (!form && this.aggregateOfField !== -1)
    return;
  //
  let parentColumnId, fieldContainerId, rowBreakerId;
  if (!form) {
    let parentColumnConf = this.parent.getListFieldColumn(this.id, aggregate).conf;
    parentColumnId = parentColumnConf.id;
    //
    if (!aggregate)
      this.listParentColConf = parentColumnConf;
    //
    fieldContainerId = this.isInList() ? (aggregate ? this.aggregateContainerId : this.listContainerId) : this.outListContainerId;
  }
  else {
    this.formParentColConf = this.parent.getFormFieldColumn(this.id).conf;
    parentColumnId = this.formParentColConf.id;
    //
    fieldContainerId = this.formContainerId;
  }
  //
  // Get field parent column
  let fieldCol = Client.eleMap[parentColumnId];
  let fieldEl = Client.eleMap[fieldContainerId];
  //
  // Append field to its parent column
  fieldCol.getRootObject().appendChild(fieldEl.getRootObject());
  fieldCol.elements.push(fieldEl);
  fieldEl.parent = fieldCol;
};


/**
 * Remove field dom objects from their parent column
 */
Client.IdfField.prototype.unplace = function ()
{
  if (this.isShown()) {
    this.unplaceListForm();
    //
    // If field is in list, also unplace its aggregate container
    if (this.isInList())
      this.unplaceListForm({aggregate: true});
  }
  //
  if (this.isShown(true))
    this.unplaceListForm({form: true});
};


/**
 * Remove field dom object from its parent column
 * @param {Object} options
 *                        - form
 *                        - aggregate: true if I have to place aggregate container
 */
Client.IdfField.prototype.unplaceListForm = function (options)
{
  options = options || {};
  let form = options.form;
  let aggregate = options.aggregate;
  //
  // If I'm an aggregation of field, aggregate field owns and unplaces my container
  if (!form && this.aggregateOfField !== -1)
    return;
  //
  // Get proper field container configuration
  let fieldContainerId;
  if (!form)
    fieldContainerId = this.isInList() ? (aggregate ? this.aggregateContainerId : this.listContainerId) : this.outListContainerId;
  else
    fieldContainerId = this.formContainerId;
  //
  // Get field element and its root object
  let fieldEl = Client.eleMap[fieldContainerId];
  let fieldRootObject = fieldEl?.getRootObject();
  //
  // Detach root object
  fieldRootObject?.remove();
  //
  // Remove field element from parent
  let index = fieldEl?.parent?.elements?.findIndex(el => el.id === fieldEl.id);
  if (index >= 0)
    fieldEl.parent.elements.splice(index, 1);
};


/**
 * Write index-th value on field dom objects
 * @param {Object} widget
 * @param {Object} parent
 */
Client.IdfField.prototype.prepareStaticField = function (widget, parent)
{
  // With RTC enabled dataType values 1: must be ignored
  widget.dataType = Client.IdfField.dataTypes.UNSPECIFIED;
  //
  // Static field doesn't have to show activator
  widget.activatorWidth = 0;
  //
  if (!Client.mainFrame.isEditing()) {
    let customChildrenConf = widget.customChildrenConf || [];
    let childrenConf = [];
    for (let j = 0; j < customChildrenConf.length; j++) {
      let childConf = Object.assign({}, customChildrenConf[j]);
      childConf._skipUpdate = true;
      childrenConf.push(childConf);
    }
    //
    let fieldValue = this.createElementConfig({c: "IdfFieldValue", id: widget.id + ":1", index: 1, customChildrenConf: childrenConf.length ? childrenConf : undefined});
    widget.children.push(fieldValue);
  }
};


/**
 * Write index-th value on field dom objects
 * @param {Integer} index
 * @param {Boolean} skipInList
 */
Client.IdfField.prototype.writeValue = function (index, skipInList)
{
  this.updateControls({text: true, skipInList}, {index});
};


/**
 * Assign out list value container and form value container to index-th value
 * @param {Integer} index
 */
Client.IdfField.prototype.assignControls = function (index)
{
  // Since static fields have just one value, I always have to assign controls to it
  if (this.isStatic())
    index = 1;
  //
  let lastActiveValue = this.values[this.parent.lastActiveRowIndex];
  if (lastActiveValue) {
    // If current layout is form, custom children and sub frame of last active value have to be moved to list layout
    if (this.isInList() && this.parent.layout === Client.IdfPanel.layouts.form)
      lastActiveValue.updateControls({customChildrenConf: true, subFrameConf: true});
    //
    // Clear last value out list and form controls
    lastActiveValue.clearControls();
  }
  //
  // If index-th values does not exist, do nothing
  if (!this.values[index])
    return;
  //
  let params = {};
  //
  if (this.isShown() && !this.isInList()) {
    params.outListContainer = Client.eleMap[this.outListValueId];
    params.outListControl = Client.eleMap[this.outListControlId];
  }
  //
  if (this.isShown(true)) {
    params.formContainer = Client.eleMap[this.formValueId];
    params.formControl = Client.eleMap[this.formControlId];
  }
  //
  this.values[index].assignControls(params);
};


/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfField.prototype.updateElement = function (props)
{
  props = props || {};
  //
  // Check if there are some requirements to load
  let req = Client.IdfField.getRequirements(props);
  if (Object.keys(req).length > 0 && !Client.mainFrame.loadClientRequirements({req}))
    return;
  //
  let qbeFilter = props.qbeFilter;
  let calcLayout, updateStructure, applyVisualStyle, updateListHeader, updateFormHeader, updateTooltip, updateSubRows;
  let propsToUpdate = {};
  //
  // Skip widget applyVisualStyle otherwise I would execute it twice if visualStyle property is changed
  props.skipWidgetApplyVisualStyle = true;
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  delete props.skipWidgetApplyVisualStyle;
  //
  // Since visualStyle property is handled by widget, it tells me if I have to apply visual style
  applyVisualStyle = props.applyVisualStyle;
  delete props.applyVisualStyle;
  //
  // In case of qbe status I always want to set qbe filter, even though it has not changed
  if (this.parent.status === Client.IdfPanel.statuses.qbe && !Client.mainFrame.isIDF)
    props.qbeFilter = qbeFilter;
  //
  // Check if there is a dimension property with '%' in his value, in that case we set the relative Perc property
  if (!Client.mainFrame.isIDF) {
    let dimNames = [
      "listLeft", "listTop", "formLeft", "formTop",
      "listWidth", "listHeight",
      "formWidth", "formHeight"
    ];
    for (let p in props) {
      if (dimNames.indexOf(p) >= 0) {
        if (props[p]?.indexOf && props[p]?.indexOf("%") > 0) {
          props[p + "Perc"] = parseInt(props[p].replace('%', ''));
          delete props[p];
        }
        else if (props[p]?.indexOf)
          props[p] = parseInt(props[p]);
      }
    }
  }
  //
  if (props.visible !== undefined) {
    this.visible = props.visible;
    updateStructure = true;
  }
  //
  if (props.showInList !== undefined) {
    this.showInList = props.showInList;
    updateStructure = true;
    updateSubRows = true;
  }
  //
  if (props.showInForm !== undefined) {
    this.showInForm = props.showInForm;
    updateStructure = true;
  }
  //
  if (props.dataType !== undefined) {
    this.dataType = props.dataType;
    propsToUpdate.dataType = true;
  }
  //
  if (props.maxLength !== undefined) {
    this.maxLength = props.maxLength;
    propsToUpdate.maxLength = true;
  }
  //
  if (props.sortMode !== undefined) {
    this.sortMode = props.sortMode;
    this.updateSortMode();
  }
  //
  if (props.groupingMode !== undefined) {
    this.groupingMode = props.groupingMode;
    this.updateSortMode();
  }
  //
  if (props.searchMode !== undefined)
    this.searchMode = props.searchMode;
  //
  if (props.pageIndex !== undefined)
    this.pageIndex = props.pageIndex;
  //
  if (props.scale !== undefined) {
    this.scale = props.scale;
    propsToUpdate.scale = true;
  }
  //
  if (props.type !== undefined) {
    this.type = props.type;
    propsToUpdate.type = true;
    propsToUpdate.text = Client.mainFrame.isEditing();
    propsToUpdate.mask = true;
    //
    calcLayout = true;
    updateListHeader = true;
    updateFormHeader = true;
    applyVisualStyle = true;
  }
  //
  if (props.isPassword !== undefined) {
    this.isPassword = props.isPassword;
    propsToUpdate.isPassword = true;
  }
  //
  if (props.inList !== undefined)
    this.inList = props.inList;
  //
  if (props.tooltip !== undefined)
    updateTooltip = true;
  //
  if (props.listHeader !== undefined) {
    this.listHeader = props.listHeader;
    updateListHeader = true;
    updateTooltip = true;
  }
  //
  if (props.formHeader !== undefined) {
    this.formHeader = props.formHeader;
    updateFormHeader = true;
    updateTooltip = true;
  }
  //
  // It's the IDC version of "header"
  if (props.innerHtml !== undefined) {
    props.header = props.innerHtml;
    delete props.innerHtml;
    delete this.innerHtml;
  }
  //
  if (props.header !== undefined) {
    this.header = props.header;
    updateListHeader = true;
    updateFormHeader = true;
    updateTooltip = true;
  }
  //
  if (props.showListHeader !== undefined) {
    this.showListHeader = props.showListHeader;
    this.showHeader();
    //
    if (this.group)
      this.group.updateHeader();
  }
  //
  if (props.showFormHeader !== undefined) {
    this.showFormHeader = props.showFormHeader;
    this.showHeader(true);
  }
  //
  if (props.listHeaderAbove !== undefined) {
    this.listHeaderAbove = props.listHeaderAbove;
    this.setHeaderAbove();
    calcLayout = true;
  }
  //
  if (props.formHeaderAbove !== undefined) {
    this.formHeaderAbove = props.formHeaderAbove;
    this.setHeaderAbove(true);
    calcLayout = true;
  }
  //
  if (props.listHeaderSize !== undefined) {
    this.listHeaderSize = isNaN(props.listHeaderSize) ? undefined : props.listHeaderSize;
    calcLayout = true;
  }
  //
  if (props.listHeaderSizePerc !== undefined) {
    this.listHeaderSizePerc = isNaN(props.listHeaderSizePerc) ? undefined : props.listHeaderSizePerc;
    calcLayout = true;
  }
  //
  if (props.formHeaderSize !== undefined) {
    this.formHeaderSize = isNaN(props.formHeaderSize) ? undefined : props.formHeaderSize;
    calcLayout = true;
  }
  //
  if (props.formHeaderSizePerc !== undefined) {
    this.formHeaderSizePerc = isNaN(props.formHeaderSizePerc) ? undefined : props.formHeaderSizePerc;
    calcLayout = true;
  }
  //
  if (props.listWidth !== undefined) {
    this.listWidth = isNaN(props.listWidth) ? undefined : props.listWidth;
    this.orgListWidth = this.listWidth;
    updateStructure = true;
    updateSubRows = true;
    //
    if (!Client.mainFrame.isIDF && this.listWidthPerc) {
      delete this.listWidthPerc;
      delete this.orgListWidthPerc;
    }
  }
  //
  if (props.listWidthPerc !== undefined) {
    this.listWidthPerc = isNaN(props.listWidthPerc) ? undefined : props.listWidthPerc;
    this.orgListWidthPerc = this.listWidthPerc;
    updateStructure = true;
    updateSubRows = true;
  }
  //
  if (props.listResizeWidth !== undefined) {
    this.listResizeWidth = props.listResizeWidth;
    updateStructure = true;
    calcLayout = true;
    updateSubRows = true;
  }
  //
  if (props.listHeight !== undefined) {
    this.listHeight = isNaN(props.listHeight) ? undefined : props.listHeight;
    this.orgListHeight = this.listHeight;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF && this.listHeightPerc) {
      delete this.listHeightPerc;
      delete this.orgListHeightPerc;
    }
  }
  //
  if (props.listHeightPerc !== undefined) {
    this.listHeightPerc = isNaN(props.listHeightPerc) ? undefined : props.listHeightPerc;
    this.orgListHeightPerc = this.listHeightPerc;
    updateStructure = true;
  }
  //
  if (props.listResizeHeight !== undefined) {
    this.listResizeHeight = props.listResizeHeight;
    updateStructure = true;
    calcLayout = true;
  }
  //
  if (props.listLeft !== undefined) {
    this.listLeft = isNaN(props.listLeft) ? undefined : props.listLeft;
    this.orgListLeft = this.listLeft;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF && this.listLeftPerc) {
      delete this.listLeftPerc;
      delete this.orgListLeftPerc;
    }
  }
  //
  if (props.listLeftPerc !== undefined) {
    this.listLeftPerc = isNaN(props.listLeftPerc) ? undefined : props.listLeftPerc;
    this.orgListLeftPerc = this.listLeftPerc;
    updateStructure = true;
  }
  //
  if (props.listTop !== undefined) {
    this.listTop = isNaN(props.listTop) ? undefined : props.listTop;
    this.orgListTop = this.listTop;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF && this.listTopPerc) {
      delete this.listTopPerc;
      delete this.orgListTopPerc;
    }
  }
  //
  if (props.listTopPerc !== undefined) {
    this.listTopPerc = isNaN(props.listTopPerc) ? undefined : props.listTopPerc;
    this.orgListTopPerc = this.listTopPerc;
    updateStructure = true;
  }
  //
  if (props.formWidth !== undefined) {
    this.formWidth = isNaN(props.formWidth) ? undefined : props.formWidth;
    this.orgFormWidth = this.formWidth;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF && this.formWidthPerc) {
      delete this.formWidthPerc;
      delete this.orgFormWidthPerc;
    }
  }
  //
  if (props.formWidthPerc !== undefined) {
    this.formWidthPerc = isNaN(props.formWidthPerc) ? undefined : props.formWidthPerc;
    this.orgFormWidthPerc = this.formWidthPerc;
    updateStructure = true;
  }
  //
  if (props.formResizeWidth !== undefined) {
    this.formResizeWidth = props.formResizeWidth;
    updateStructure = true;
    calcLayout = true;
  }
  //
  if (props.formHeight !== undefined) {
    this.formHeight = isNaN(props.formHeight) ? undefined : props.formHeight;
    this.orgFormHeight = this.formHeight;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF && this.formHeightPerc) {
      delete this.formHeightPerc;
      delete this.orgFormHeightPerc;
    }
  }
  //
  if (props.formHeightPerc !== undefined) {
    this.formHeightPerc = isNaN(props.formHeightPerc) ? undefined : props.formHeightPerc;
    this.orgFormHeightPerc = this.formHeightPerc;
    updateStructure = true;
  }
  //
  if (props.formResizeHeight !== undefined) {
    this.formResizeHeight = props.formResizeHeight;
    updateStructure = true;
    calcLayout = true;
  }
  //
  if (props.formLeft !== undefined) {
    this.formLeft = isNaN(props.formLeft) ? undefined : props.formLeft;
    this.orgFormLeft = this.formLeft;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF && this.formLeftPerc) {
      delete this.formLeftPerc;
      delete this.orgFormLeftPerc;
    }
  }
  //
  if (props.formLeftPerc !== undefined) {
    this.formLeftPerc = isNaN(props.formLeftPerc) ? undefined : props.formLeftPerc;
    this.orgFormLeftPerc = this.formLeftPerc;
    updateStructure = true;
  }
  //
  if (props.formTop !== undefined) {
    this.formTop = isNaN(props.formTop) ? undefined : props.formTop;
    this.orgFormTop = this.formTop;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF && this.formTopPerc) {
      delete this.formTopPerc;
      delete this.orgFormTopPerc;
    }
  }
  //
  if (props.formTopPerc !== undefined) {
    this.formTopPerc = isNaN(props.formTopPerc) ? undefined : props.formTopPerc;
    this.orgFormTopPerc = this.formTopPerc;
    updateStructure = true;
  }
  //
  if (props.formRight !== undefined) {
    this.formRight = isNaN(parseInt(props.formRight)) ? undefined : props.formRight;
    updateStructure = true;
  }
  if (props.formBottom !== undefined) {
    this.formBottom = isNaN(parseInt(props.formBottom)) ? undefined : props.formBottom;
    updateStructure = true;
  }
  //
  if (props.aggregateOfField !== undefined) {
    this.aggregateOfField = props.aggregateOfField;
    updateStructure = true;
  }
  //
  // Only for IDC. Convert listMultiRows to listNumRows
  if (props.listMultiRows !== undefined) {
    props.listNumRows = props.listMultiRows ? 2 : 1;
    //
    delete props.listMultiRows;
    delete this.listMultiRows;
  }
  //
  if (props.listNumRows !== undefined) {
    this.listNumRows = props.listNumRows;
    propsToUpdate.listNumRows = true;
    //
    calcLayout = true;
  }
  //
  // Only for IDC. Convert formMultiRows to formNumRows
  if (props.formMultiRows !== undefined) {
    props.formNumRows = props.formMultiRows ? 2 : 1;
    //
    delete props.formMultiRows;
    delete this.formMultiRows;
  }
  //
  if (props.formNumRows !== undefined) {
    this.formNumRows = props.formNumRows;
    propsToUpdate.formNumRows = true;
    //
    calcLayout = true;
  }
  //
  if (props.rowBreakBefore !== undefined) {
    let old = this.rowBreakBefore;
    this.rowBreakBefore = props.rowBreakBefore;
    //
    // If the value is changed AFTER the creation of the field
    // -> we can use the object pointers to detect if the realize is already done,
    //    if they are there the value is changed AFTER the realize so we need to
    // - create the header breaker if needed
    // - remove the haeader breaker if already present (remove also from the parent)
    // - ask the parent to recreate its rows
    if (!Client.mainFrame.isIDF && old !== this.rowBreakBefore && this.listContainerId && this.parent.hasList && this.showInList) {
      this.parent.updateStructure();
      this.parent.resetCache({from: this.parent.canUseRowQbe() ? 0 : 1, to: this.parent.rows.length});
      if (this.parent.canUseRowQbe())
        this.parent.attachRow(0, true);
      this.parent.calcLayout();
    }
  }
  //
  if (props.dataType !== undefined)
    this.dataType = props.dataType;
  //
  if (props.valueList !== undefined) {
    // If value list is for qbe, I don't have to update field value list
    if (props.valueList.qbe) {
      // If there's a filter popup that requested the value list, give to it
      let filterPopup = Client.eleMap[props.valueList.popup];
      if (props.valueList.popup && filterPopup)
        filterPopup.updateValueList(props.valueList);
      else if (this.parent.canUseRowQbe() && this.isInList()) // Otherwise give it to row qbe fieldValue
        this.values[0].updateElement({valueList: props.valueList});
    }
    else {
      this.valueList = props.valueList;
      propsToUpdate.valueList = true;
    }
  }
  //
  if (props.smartLookup !== undefined) {
    this.smartLookup = props.smartLookup;
    propsToUpdate.smartLookup = true;
  }
  //
  if (props.hasValueSource !== undefined) {
    this.hasValueSource = props.hasValueSource;
    propsToUpdate.hasValueSource = true;
  }
  //
  if (props.autoLookup !== undefined) {
    this.autoLookup = props.autoLookup;
    propsToUpdate.autoLookup = true;
  }
  //
  if (props.optional !== undefined) {
    this.optional = props.optional;
    propsToUpdate.optional = true;
  }
  //
  if (props.enabled !== undefined) {
    this.enabled = props.enabled;
    propsToUpdate.enabled = true;
    //
    applyVisualStyle = true;
  }
  //
  if (props.enabledInQbe !== undefined) {
    this.enabledInQbe = props.enabledInQbe;
    propsToUpdate.enabled = true;
    //
    applyVisualStyle = true;
  }
  //
  if (props.QBELike !== undefined) {
    this.QBELike = props.QBELike;
  }
  //
  if (props.activableDisabled !== undefined) {
    this.activableDisabled = props.activableDisabled;
    propsToUpdate.activableDisabled = true;
  }
  //
  if (props.canActivate !== undefined) {
    this.canActivate = props.canActivate;
    propsToUpdate.canActivate = true;
  }
  //
  if (props.superActive !== undefined) {
    this.superActive = props.superActive;
    propsToUpdate.superActive = true;
  }
  //
  if (props.canSort !== undefined) {
    this.canSort = props.canSort;
    updateListHeader = true;
    propsToUpdate.canSort = true;
  }
  //
  if (props.alignment !== undefined) {
    this.alignment = props.alignment;
    //
    if (this.isStatic())
      this.values[1].updateElement({alignment: this.alignment});
    //
    updateListHeader = true;
    updateFormHeader = true;
    propsToUpdate.alignment = true;
  }
  //
  if (props.backColor !== undefined) {
    this.backColor = props.backColor;
    propsToUpdate.backColor = true;
  }
  //
  if (props.color !== undefined) {
    this.color = props.color;
    propsToUpdate.color = true;
  }
  //
  if (props.mask !== undefined) {
    this.mask = props.mask;
    propsToUpdate.mask = true;
  }
  //
  if (props.fontModifiers !== undefined) {
    this.fontModifiers = props.fontModifiers;
    propsToUpdate.fontModifiers = true;
  }
  //
  if (props.className !== undefined) {
    this.className = props.className;
    //
    // The className can have a responsive grid, in that case we must extract it
    let cls = Client.Widget.extractGridClasses(this.className);
    this.className = cls.className;
    this.gridClass = cls.gridClass;
    //
    // There are special classes that must be set also on the list header
    if (this.isInList() && (this.className.indexOf("lg-visible") >= 0 || this.className.indexOf("md-visible") >= 0)) {
      let hl = Client.eleMap[this.listHeaderTextId];
      Client.Widget.updateElementClassName(hl, this.className.indexOf("md-visible") >= 0 ? "md-visible" : "lg-visible");
    }
    //
    propsToUpdate.className = true;
    //
    if (Client.mainFrame.isIDF) {
      props.formHeaderClassName = props.className;
      props.listHeaderClassName = props.className;
      props.listClassName = props.className;
    }
  }
  if (props.formHeaderClassName !== undefined) {
    updateFormHeader = true;
    this.oldFormHeaderClassName = this.formHeaderClassName || "";
    this.formHeaderClassName = props.formHeaderClassName;
  }
  if (props.listHeaderClassName !== undefined) {
    updateListHeader = true;
    this.oldListHeaderClassName = this.listHeaderClassName || "";
    this.listHeaderClassName = props.listHeaderClassName;
  }
  if (props.listClassName !== undefined) {
    this.listClassName = props.listClassName;
    propsToUpdate.listClassName = true;
  }
  //
  if (props.badge !== undefined)
    propsToUpdate.badge = true;
  //
  if (props.activatorWidth !== undefined) {
    this.activatorWidth = props.activatorWidth;
    propsToUpdate.activatorWidth = true;
  }
  //
  if (props.activatorImage !== undefined) {
    this.activatorImage = props.activatorImage;
    propsToUpdate.activatorImage = true;
  }
  //
  if (props.editorType !== undefined) {
    this.editorType = props.editorType;
    propsToUpdate.editorType = true;
  }
  //
  if (props.showHtmlEditorToolbar !== undefined) {
    this.showHtmlEditorToolbar = props.showHtmlEditorToolbar;
    propsToUpdate.showHtmlEditorToolbar = true;
  }
  //
  if (props.multiUpload !== undefined) {
    this.multiUpload = props.multiUpload;
    propsToUpdate.multiUpload = true;
  }
  //
  if (props.uploadExtensions !== undefined) {
    this.uploadExtensions = props.uploadExtensions;
    propsToUpdate.uploadExtensions = true;
  }
  //
  if (props.comboMultiSel !== undefined) {
    this.comboMultiSel = props.comboMultiSel;
    propsToUpdate.comboMultiSel = true;
  }
  //
  if (props.comboSeparator !== undefined) {
    this.comboSeparator = props.comboSeparator;
    propsToUpdate.comboSeparator = true;
  }
  //
  if (props.customChildrenConf !== undefined) {
    this.customChildrenConf = props.customChildrenConf;
    //
    if (this.customChildrenConf?.length) {
      props.controlType = Client.IdfField.controlTypes.CUSTOM;
      this.oldControlType = this.controlType;
    }
    else {
      props.controlType = this.oldControlType;
      delete this.customChildrenConf;
    }
  }
  //
  if (props.controlType !== undefined) {
    this.controlType = this.customChildrenConf ? Client.IdfField.controlTypes.CUSTOM : props.controlType || Client.IdfField.controlTypes.AUTO;
    propsToUpdate.controlType = true;
    //
    // In IDC editor, recalculate value list when control type changes
    if (!Client.mainFrame.isIDF && Client.mainFrame.isEditing()) {
      this.valueList = this.getEditorValueList();
      propsToUpdate.valueList = true;
    }
  }
  //
  if (props.qbeFilter !== undefined) {
    this.qbeFilter = props.qbeFilter;
    //
    let qbeValue = this.getValueByIndex(this.parent.status === Client.IdfPanel.statuses.qbe ? 1 : 0);
    qbeValue?.updateQbeFilter();
    //
    this.parent.showClearFiltersButton();
    //
    if (this.parent.searchMode === Client.IdfPanel.searchModes.header)
      updateListHeader = true;
  }
  //
  // "visualFlags" property exists just on IDF. Thus, transform variation on visualFlags into variations on each single property
  if (props.visualFlags !== undefined) {
    this.visualFlags = props.visualFlags;
    //
    props.canSortFlag = (this.visualFlags & 0x1) !== 0;
    props.showOnlyIcon = (this.visualFlags & 0x8) !== 0;
    props.showActivator = (this.visualFlags & 0x10) !== 0;
    props.isHyperLink = (this.visualFlags & 0x80) !== 0;
    props.slidePad = (this.visualFlags & 0x40) !== 0;
    props.autoTab = (this.visualFlags & 0x200) !== 0;
    props.usePlaceholderasNull = (this.visualFlags & 0x00000400) !== 0;
    props.handleTabOrder = (this.visualFlags & 0x00000800) !== 0;
    props.canHideInList = (this.visualFlags & 0x00001000) !== 0;
    props.hiddenInList = (this.visualFlags & 0x00002000) !== 0;
  }
  //
  if (props.canSortFlag !== undefined) {
    this.canSortFlag = props.canSortFlag;
    updateListHeader = true;
    propsToUpdate.canSort = true;
  }
  //
  if (props.showOnlyIcon !== undefined) {
    this.showOnlyIcon = props.showOnlyIcon;
    propsToUpdate.showOnlyIcon = true;
  }
  //
  if (props.showActivator !== undefined)
    this.showActivator = props.showActivator;
  //
  if (props.isHyperLink !== undefined) {
    this.isHyperLink = props.isHyperLink;
    propsToUpdate.isHyperLink = true;
  }
  //
  if (props.slidePad !== undefined)
    this.slidePad = props.slidePad;
  //
  if (props.autoTab !== undefined)
    this.autoTab = props.autoTab;
  //
  if (props.usePlaceholderasNull !== undefined)
    this.usePlaceholderasNull = props.usePlaceholderasNull;
  //
  if (props.handleTabOrder !== undefined)
    this.handleTabOrder = props.handleTabOrder;
  //
  if (props.canHideInList !== undefined)
    this.canHideInList = props.canHideInList;
  //
  if (props.hiddenInList !== undefined) {
    this.hiddenInList = props.hiddenInList;
    calcLayout = true;
    updateSubRows = true;
  }
  //
  if (props.image !== undefined) {
    this.image = props.image;
    //
    // If image has to be shown in value, simply remember to update control image
    if (this.parent.showFieldImageInValue)
      propsToUpdate.image = true;
    else { // Otherwise show image in header
      if (this.isShown())
        this.updateImage();
      //
      if (this.isShown(true))
        this.updateImage(true);
    }
  }
  //
  if (props.imageResizeMode !== undefined) {
    this.imageResizeMode = props.imageResizeMode;
    propsToUpdate.imageResizeMode = true;
    //
    // If image has not to be shown in value, update header image resize mode
    if (!this.parent.showFieldImageInValue) {
      if (this.isShown())
        this.updateImageResizeMode();
      //
      if (this.isShown(true))
        this.updateImageResizeMode(true);
    }
  }
  //
  if (props.placeholder !== undefined) {
    this.placeholder = props.placeholder;
    propsToUpdate.placeholder = true;
  }
  //
  if (props.aggregationLabel !== undefined) {
    this.aggregationLabel = props.aggregationLabel;
    propsToUpdate.aggregationLabel = true;
  }
  //
  if (props.notifySelectionChange !== undefined)
    this.notifySelectionChange = props.notifySelectionChange;
  //
  if (props.listTabOrderIndex !== undefined)
    this.listTabOrderIndex = props.listTabOrderIndex;
  //
  if (props.formTabOrderIndex !== undefined)
    this.formTabOrderIndex = props.formTabOrderIndex;
  //
  if (props.needFilterPopup !== undefined)
    this.openFilterPopup();
  //
  if (props.needToOpenCombo !== undefined)
    this.openCombo();
  //
  if (props.changeEventDef !== undefined)
    this.changeEventDef = props.changeEventDef;
  //
  if (props.listStyle !== undefined) {
    Client.Widget.updateCustomStyle({styleToUpdate: this.listCustomStyle, newStyle: props.listStyle});
    calcLayout = true;
  }
  if (props.formStyle !== undefined) {
    Client.Widget.updateCustomStyle({styleToUpdate: this.formCustomStyle, newStyle: props.formStyle});
    calcLayout = true;
  }
  if (props.listHeaderStyle !== undefined) {
    Client.Widget.updateCustomStyle({styleToUpdate: this.listHeaderCustomStyle, newStyle: props.listHeaderStyle});
    calcLayout = true;
  }
  if (props.formHeaderStyle !== undefined) {
    Client.Widget.updateCustomStyle({styleToUpdate: this.formHeaderCustomStyle, newStyle: props.formHeaderStyle});
    calcLayout = true;
  }
  if (props.subFrameId !== undefined) {
    this.subFrameId = props.subFrameId;
    //
    let subFrameConf = this.parent.parentIdfView?.getSubFrame(this.subFrameId);
    if (subFrameConf) {
      this.subFrameConf = subFrameConf;
      this.subFrameConf.isSubFrame = true;
      propsToUpdate.subFrameConf = true;
    }
  }
  //
  // If I have to update parent panel structure and layout, do it now
  if (!this.realizing) {
    this.parent.updateObjects({structure: updateStructure, calcLayout: calcLayout || updateStructure});
    //
    if (updateSubRows && this.isInList())
      this.parent.updateSubRowsWidth();
  }
  //
  // If I have to apply visual style, do it now
  if (applyVisualStyle)
    this.applyVisualStyle();
  //
  if (updateListHeader)
    this.updateHeader();
  //
  if (updateFormHeader)
    this.updateHeader(true);
  //
  if (updateTooltip) {
    if (this.parent.tooltipOnEachRow)
      propsToUpdate.tooltip = true;
    else
      this.updateTooltip();
  }
  //
  // Update controls
  this.updateControls(propsToUpdate);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfField.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      if (event.obj === this.listContainerId && !Client.mainFrame?.isEditing()) {
        if (this.parent.showListVisisiblityControls)
          this.parent.openControlListPopup(this);
        else if (this.parent.searchMode === Client.IdfPanel.searchModes.header)
          this.openFilterPopup();
        else if (this.parent.canGroup && this.parent.showGroups)
          events.push(...this.handleGrouping());
        else if (this.isSortable())
          events.push(...this.handleSort({add: !event.content.ctrlKey, resetAll: event.content.ctrlKey || !event.content.shiftKey}));
      }
      break;
  }
  //
  return events;
};


/**
 * Apply visual style
 * @param {Integer} index
 */
Client.IdfField.prototype.applyVisualStyle = function (index)
{
  // I don't need to apply visual style while field is realizing. When parent panel will be realized,
  // it will apply visual style to itself and to its children (i.e. fields and groups)
  if (this.realizing)
    return;
  //
  // Apply header visual style on both list and form layout
  if (!index) {
    this.applyHeaderVisualStyle();
    this.applyHeaderVisualStyle(true);
  }
  //
  // Apply visual style on field values
  let isStatic = this.isStatic(true);
  let start = isStatic ? 1 : (index ?? this.parent.getDataBlockStart());
  let end = isStatic ? 1 : (index ?? this.getDataBlockEnd());
  //
  for (let i = start; i <= end; i++) {
    if (!this.values[i])
      continue;
    //
    this.values[i].applyVisualStyle();
  }
};


/**
 * Apply visual style on header
 * @param {Boolean} form
 */
Client.IdfField.prototype.applyHeaderVisualStyle = function (form)
{
  // I don't need to apply visual style while field is realizing. When parent panel will be realized,
  // it will apply visual style to itself and to its children (i.e. fields and groups)
  if (this.realizing)
    return;
  //
  if (!this.isShown(form))
    return;
  //
  if (this.isStatic(true))
    return;
  //
  let notNull = !this.optional && this.parent.status !== Client.IdfPanel.statuses.qbe && !this.parent.locked && !this.isStatic();
  //
  // Get field header alignment
  let headerAlignment = this.getHeaderAlignment(form);
  headerAlignment = Client.IdfVisualStyle.getTextAlign(headerAlignment);
  //
  let visOptions = {objType: "fieldHeader", notNull, alignment: headerAlignment};
  visOptions.list = form ? false : this.isInList();
  //
  let headerContainerId = form ? this.formHeaderId : (this.isInList() ? this.listContainerId : this.outListHeaderId);
  let headerContainer = Client.eleMap[headerContainerId];
  this.addVisualStyleClasses(headerContainer, visOptions);
  //
  // Set field header alignment
  let headerId = form ? this.formHeaderTextId : (this.isInList() ? this.listHeaderTextId : this.outListHeaderTextId);
  this.addVisualStyleClasses(Client.eleMap[headerId], {alignment: headerAlignment});
  //
  if (!form && this.isInList() && this.aggregateOfField === -1) {
    let aggregateContainer = Client.eleMap[this.aggregateContainerId];
    this.addVisualStyleClasses(aggregateContainer, {objType: "panel"});
  }
};


/**
 * Update values controls
 * @param {Object} propsToUpdate - example {visualStyle: true, editorType: true, ...}
 * @param {Object} options
 */
Client.IdfField.prototype.updateControls = function (propsToUpdate, options)
{
  options = options || {};
  //
  let {index, from, to} = options;
  let start = index ?? from ?? this.parent.getDataBlockStart();
  let end = index ?? to ?? this.getDataBlockEnd();
  //
  for (let i = start; i <= end; i++) {
    let value = this.values[i];
    if (!value)
      continue;
    //
    value.updateControls(propsToUpdate, options);
  }
};


/**
 * Return true if I'm right aligned
 */
Client.IdfField.prototype.isRightAligned = function ()
{
  // Get my visual style
  let vis = Client.IdfVisualStyle.getByIndex(this.getVisualStyle());
  //
  // Get my alignment
  let alignment = this.alignment;
  //
  // If I have no specific alignment, ask visual style for value alignment (see IdfVisualStyle.getAlignment without parameters)
  if (alignment === -1)
    alignment = vis ? vis.getAlignment() : -1;
  //
  // If my alignment is RIGHT, I'm right aligned
  if (alignment === Client.IdfVisualStyle.alignments.RIGHT)
    return true;
  //
  // If I'm not numeric, I'm not right aligned
  if (!Client.IdfField.isNumeric(this.dataType))
    return false;
  //
  // On IDC just EDIT or AUTO control can be right aligned
  if (!Client.mainFrame.isIDF && ![Client.IdfField.controlTypes.EDIT, Client.IdfField.controlTypes.AUTO].includes(this.controlType))
    return false;
  //
  // A control different from EDIT with an associated value list is not right aligned
  if (this.valueList && vis?.getControlType() !== Client.IdfField.controlTypes.EDIT)
    return false;
  //
  // Autolookup fields are not right aligned
  if (this.autoLookup)
    return false;
  //
  // If alignment is not auto, it's not right alignment
  if (alignment !== Client.IdfVisualStyle.alignments.AUTO)
    return false;
  //
  return true;
};


/**
 * Return true if this field is in list
 */
Client.IdfField.prototype.isInList = function ()
{
  return this.inList;
};


/**
 * Calculate layout rules to handle resize mode
 * @param {Integer} index
 */
Client.IdfField.prototype.calcLayout = function (index)
{
  // Calculate layout for list mode
  if (this.isShown() && this.parent.getListFieldColumn(this.id))
    this.calcListFormLayout(false, index);
  //
  // Calculate layout for form mode
  if (this.isShown(true) && this.parent.getFormFieldColumn(this.id))
    this.calcListFormLayout(true, index);
};


/**
 * Calculate layout for list or form mode
 * @param {Boolean} form
 * @param {Integer} index
 */
Client.IdfField.prototype.calcListFormLayout = function (form, index)
{
  // If I'm an aggregation of field, aggregate field owns and handles my container. So do nothing
  if (!form && this.aggregateOfField !== -1)
    return;
  //
  let headerStyle = {};
  let fieldStyle = {};
  let outListColStyle = {};
  //
  let xs = this.canAdaptWidth(form) ? "" : "auto";
  //
  let rects = this.getRects({form});
  let width = rects.width, height = rects.height, left = rects.left, top = rects.top;
  //
  let parentWidth = (!form && this.isInList()) ? this.parent.gridWidth : this.parent.getContainerWidth(form);
  let parentHeight = (!form && this.isInList()) ? this.parent.gridHeight : this.parent.getContainerHeight(form);
  let listRowHeight = this.parent.getListRowHeight(this);
  //
  // Use flex to handle width resize. Aggregate of field behaves like an in list field
  if (!form && this.isInList()) {
    if (!Client.mainFrame.isIDF) {
      fieldStyle.flexBasis = this.listWidthPerc ? this.listWidthPerc + "%" : (width !== undefined ? width + "px" : "auto");
      fieldStyle.flexGrow = this.parent.getChildFlexGrow(this);
      fieldStyle.flexShrink = this.listResizeWidth === Client.IdfField.resizeModes.GROW ? "0" : "";
    }
    else {
      fieldStyle.flexGrow = this.canAdaptWidth() ? "1" : "0";
      fieldStyle.flexShrink = this.canAdaptWidth() ? "1" : "0";
      fieldStyle.flexBasis = width !== undefined ? width + "px" : "auto";
    }
    //
    fieldStyle.minWidth = "";
    if (width !== undefined && this.group && !this.canAdaptWidth())
      fieldStyle.minWidth = width + "px";
    //
    // If panel hasn't dynamic height rows, assign fixed height to field
    if (!this.parent.hasDynamicHeightRows()) {
      fieldStyle.height = listRowHeight + "px";
      fieldStyle.minHeight = "";
      fieldStyle.overflow = this.listNumRows > 1 ? "auto" : "";
    }
    else {
      fieldStyle.height = "";
      fieldStyle.minHeight = listRowHeight + "px";
      fieldStyle.overflow = "";
    }
    //
    // Assign fixed height to field header
    headerStyle = Object.assign({}, fieldStyle);
    //
    // If this field belongs to a group, field has no height. Group has
    headerStyle.height = this.group ? "" : this.parent.getHeaderHeight() + "px";
    headerStyle.minHeight = this.group ? "" : this.parent.getHeaderHeight() + "px";
    headerStyle.overflow = "hidden";
  }
  else {
    let headerAbove = ((form && this.formHeaderAbove) || (!form && this.listHeaderAbove));
    //
    // Use percentage header size or normal one
    let headerSize;
    let headerSizePerc = form ? this.formHeaderSizePerc : this.listHeaderSizePerc;
    if (headerSizePerc !== undefined)
      headerSize = (this.parent.originalWidth * headerSizePerc / 100);
    else
      headerSize = form ? this.formHeaderSize : this.listHeaderSize;
    //
    // If header is above value, set header size as min-height
    if (headerAbove) {
      let gap = Client.mainFrame.isIDF ? 4 : 0;
      headerStyle.minHeight = headerSize ? (headerSize + gap) + "px" : "";
      headerStyle.width = "";
    }
    else { // Otherwise set it as width
      headerStyle.width = headerSize ? headerSize + "px" : "";
      headerStyle.minHeight = "";
    }
    //
    outListColStyle.padding = "0px";
    if (form && !Client.mainFrame.isIDF) {
      outListColStyle.flexBasis = this.formWidthPerc ? this.formWidthPerc + "%" : (width !== undefined ? width + "px" : "auto");
      outListColStyle.flexGrow = ((this.canAdaptWidth(form) && !this.formWidthPerc) || this.formResizeWidth === Client.IdfField.resizeModes.GROW) ? "1" : "0";
      outListColStyle.flexShrink = (this.formWidthPerc || this.formResizeWidth === Client.IdfField.resizeModes.GROW) ? "0" : "";
      outListColStyle.minWidth = this.canAdaptWidth(form) ? "0" : width + "px";

    }
    else {
      outListColStyle.flexBasis = width !== undefined ? width + "px" : "auto";
      outListColStyle.flexGrow = this.canAdaptWidth(form) ? "1" : "0";
      outListColStyle.minWidth = this.canAdaptWidth(form) ? "0" : width + "px";
    }
    //
    // Default col height is "auto"
    outListColStyle.height = "auto";
    fieldStyle.height = "";
    fieldStyle.minHeight = "";
    fieldStyle.overflow = "";
    //
    // Set absolute height if there is an height and this field cannot adapt its height
    if (height !== undefined) {
      let innerheight = height;
      if (headerAbove && headerSize)
        innerheight = innerheight - headerSize - (Client.mainFrame.isIDF ? 4 : 0);
      //
      if (!this.canAdaptHeight(form)) {
        outListColStyle.height = height + "px";
        fieldStyle.height = innerheight + "px";
      }
      else if (form && this.formResizeHeight === Client.IdfField.resizeModes.GROW)
        outListColStyle.minHeight = height + "px";
    }
    //
    let numRows = form ? this.formNumRows : this.listNumRows;
    if (numRows > 1) {
      fieldStyle.height = headerAbove ? "auto" : "";
      fieldStyle.overflow = "auto";
    }
    //
    // Get field's group dimensions and position
    let groupLeft = 0;
    let groupTop = 0;
    if (this.group) {
      groupLeft = form ? this.group.formLeft : this.group.listLeft;
      groupTop = form ? this.group.formTop : this.group.listTop;
      //
      parentWidth = form ? this.group.formWidth : this.group.listWidth;
      parentHeight = form ? this.group.formHeight : this.group.listHeight;
    }
    //
    // Get field parent column
    let fieldColumn = form ? this.parent.getFormFieldColumn(this.id) : this.parent.getListFieldColumn(this.id);
    //
    // Tell field column if it can adapt its width and height
    fieldColumn.canAdaptWidth = this.canAdaptWidth(form);
    fieldColumn.canAdaptHeight = this.canAdaptHeight(form);
    //
    if (form && !Client.mainFrame.isIDF) {
      outListColStyle.paddingLeft = this.formLeftPerc ? this.formLeftPerc + "%" : this.formLeft + "px";
      outListColStyle.marginTop = this.formTopPerc ? this.formTopPerc + "%" : this.formTop + "px";
      //
      outListColStyle.paddingRight = "";
      outListColStyle.marginBottom = "";
      if (this.formRight)
        outListColStyle.paddingRight = this.formRight.indexOf("%") >= 0 ? (parseInt(this.formRight) + "%") : (parseInt(this.formRight) + "px");
      if (this.formBottom)
        outListColStyle.marginBottom = this.formBottom.indexOf("%") >= 0 ? (parseInt(this.formBottom) + "%") : (parseInt(this.formBottom) + "px");
    }
    else {
      // Calculate margin left
      let fieldColumnLeft = fieldColumn.rect.left || 0;
      let deltaLeft = fieldColumn.isMostLeft ? left - groupLeft : left - fieldColumnLeft;
      outListColStyle.marginLeft = deltaLeft + "px";
      //
      // Calculate margin right
      let deltaRight = fieldColumn.rect.deltaRight;
      if (fieldColumn.isMostRight) {
        deltaRight = this.group ? (parentWidth - width - (left - groupLeft)) : (parentWidth - width - left);
        deltaRight = deltaRight < 0 ? 0 : deltaRight;
      }
      outListColStyle.marginRight = deltaRight + "px";
      //
      // Calculate margin top
      let fieldColumnTop = fieldColumn.rect.top || 0;
      let deltaTop = fieldColumn.isMostTop ? top - groupTop : top - fieldColumnTop;
      outListColStyle.marginTop = deltaTop + "px";
      //
      // Calculate margin bottom
      let deltaBottom = fieldColumn.rect.deltaBottom;
      if (fieldColumn.isMostBottom) {
        deltaBottom = this.group ? (parentHeight - height - (top - groupTop)) : (parentHeight - height - top);
        deltaBottom = deltaBottom < 0 ? 0 : deltaBottom;
      }
      outListColStyle.marginBottom = deltaBottom + "px";
    }
  }
  //
  // Update in list field
  if (!form && this.isInList()) {
    // Update field column element
    let el = Client.eleMap[this.listContainerId];
    if (el) {
      let fixedLeft = this.parent.isFixedField(this) ? this.parent.getFixedFieldLeft(this) + "px" : "";
      //
      headerStyle.left = fixedLeft;
      fieldStyle.left = fixedLeft;
      //
      Client.Widget.updateStyle(el, this.listHeaderStyle, headerStyle);
      Client.Widget.updateStyle(el, this.listHeaderStyle, this.listHeaderCustomStyle);
      Client.Widget.updateObject(el, {xs});
      Client.Widget.updateElementClassName(el, "fixed-col", !fixedLeft);
      //
      // Use header style as base for aggregated field style
      let aggregatedFieldStyle = Object.assign({}, headerStyle);
      //
      // Give fixed height to aggregated field column if there are aggregated fields
      let hasAggregatedField = !!this.parent.visibleAggregateFields.length;
      aggregatedFieldStyle.height = hasAggregatedField ? listRowHeight + "px" : "0";
      aggregatedFieldStyle.minHeight = hasAggregatedField ? listRowHeight + "px" : "0";
      aggregatedFieldStyle.padding = hasAggregatedField ? "2px 0 0 0" : "0";
      //
      // Update aggregate column element
      el = Client.eleMap[this.aggregateContainerId];
      Client.Widget.updateStyle(el, this.aggregateContainerStyle, aggregatedFieldStyle);
      Client.Widget.updateObject(el, {xs});
      Client.Widget.updateElementClassName(el, "fixed-col", !fixedLeft);
    }
    //
    if (this.parent.canUseRowQbe()) {
      let qbeValueStyle = Object.assign({}, fieldStyle);
      qbeValueStyle.height = listRowHeight + "px";
      qbeValueStyle.minHeight = "";
      qbeValueStyle.overflow = "";
      //
      Client.Widget.updateStyle(undefined, this.listQbeValueStyle, qbeValueStyle);
    }
    //
    Client.Widget.updateStyle(undefined, this.listValueStyle, fieldStyle);
    Client.Widget.updateStyle(undefined, this.listValueStyle, this.listCustomStyle);
    //
    // Update field values elements
    let start = index ?? this.parent.getDataBlockStart();
    let end = index ?? this.getDataBlockEnd();
    for (let i = start; i <= end; i++) {
      if (!this.values[i])
        continue;
      //
      let fieldValueStyle = (this.parent.canUseRowQbe() && i === 0 ? this.listQbeValueStyle : this.listValueStyle);
      this.values[i].setListLayout({style: fieldValueStyle, xs});
    }
  }
  else { // Otherwise update out list field
    let numRows = form ? this.formNumRows : this.listNumRows;
    //
    // Update header style (static field has no header)
    if (!this.isStatic(true)) {
      let headerAbove = form ? this.formHeaderAbove : this.listHeaderAbove;
      //
      let headerId = form ? this.formHeaderId : this.outListHeaderId;
      let headerStyleObj = form ? this.formHeaderStyle : this.outListHeaderStyle;
      let headerCustomStyleObj = form ? this.formHeaderCustomStyle : this.outListHeaderCustomStyle;
      Client.Widget.updateStyle(Client.eleMap[headerId], headerStyleObj, headerStyle);
      Client.Widget.updateStyle(Client.eleMap[headerId], headerStyleObj, headerCustomStyleObj);
      Client.Widget.updateElementClassName(Client.eleMap[headerId], "fixed-height-col", numRows > 1 && !headerAbove);
    }
    //
    let valueContainerId = form ? this.formValueId : this.outListValueId;
    let parentColId = form ? this.formParentColConf.id : this.listParentColConf.id;
    let valueStyle = form ? this.formValueStyle : this.outListValueStyle;
    let valueCustomStyle = form ? this.formCustomStyle : this.outListCustomStyle;
    let parentColStyle = form ? this.formParentColStyle : this.outListParentColStyle;
    //
    let el = Client.eleMap[valueContainerId];
    Client.Widget.updateStyle(el, valueStyle, fieldStyle);
    Client.Widget.updateStyle(el, valueStyle, valueCustomStyle);
    Client.Widget.updateElementClassName(el, "fixed-height-col", numRows > 1);
    //
    el = Client.eleMap[parentColId];
    Client.Widget.updateStyle(el, parentColStyle, outListColStyle);
  }
};


/**
 * Check if this field can apdapt its list/form width
 * @param {Boolean} form
 */
Client.IdfField.prototype.canAdaptWidth = function (form)
{
  let resizeWidth = form ? this.formResizeWidth : this.listResizeWidth;
  //
  // A field can adapt its width if it and its parent view have an adaptable width
  let canAdapt = this.parentIdfView?.resizeWidth !== Client.IdfView.resizeModes.NONE && (resizeWidth === Client.IdfField.resizeModes.STRETCH || resizeWidth === Client.IdfField.resizeModes.GROW);
  //
  // If field is in list, I need also panel to have an adaptable width
  if (!form && this.isInList())
    canAdapt = canAdapt && this.parent.resizeWidth === Client.IdfPanel.resizeModes.stretch;
  //
  return canAdapt;
};


/**
 * Check if this field can apdapt its list/form height
 * @param {Boolean} form
 */
Client.IdfField.prototype.canAdaptHeight = function (form)
{
  let resizeHeight = form ? this.formResizeHeight : this.listResizeHeight;
  //
  // A field can adapt its height if it and its parent view have an adaptable height
  let canAdapt = this.parentIdfView?.resizeHeight !== Client.IdfView.resizeModes.NONE && (resizeHeight === Client.IdfField.resizeModes.STRETCH || resizeHeight === Client.IdfField.resizeModes.GROW);
  //
  // If field is in list, it can't adapt its height
  if (!form && this.isInList())
    canAdapt = false;
  //
  // If field belongs to a collapsed group, it can't adapt its height
  if (this.group?.collapsed)
    canAdapt = false;
  //
  return canAdapt;
};


/**
 * Check if this field can move left
 */
Client.IdfField.prototype.canMoveLeft = function ()
{
  // A field can move left if it's parent view has an adaptable width and it has MOVE has resize width mode
  let canMove = this.parentIdfView?.resizeWidth !== Client.IdfView.resizeModes.NONE && this.listResizeWidth === Client.IdfField.resizeModes.MOVE;
  //
  // If field is in list, it can't move left
  if (this.isInList())
    canMove = false;
  //
  return canMove;
};


/**
 * Check if this field can move top
 */
Client.IdfField.prototype.canMoveTop = function ()
{
  // A field can move top if it's parent view has an adaptable height and it has MOVE has resize height mode
  let canMove = this.parentIdfView?.resizeHeight !== Client.IdfView.resizeModes.NONE && this.listResizeHeight === Client.IdfField.resizeModes.MOVE;
  //
  // If field is in list, it can't move top
  if (this.isInList())
    canMove = false;
  //
  return canMove;
};


/**
 * Get field rects
 * @param {Object} options
 *                  - form
 *                  - real: true if need browser rects
 *                  - checkVisibility
 */
Client.IdfField.prototype.getRects = function (options)
{
  options = options || {};
  //
  let form = options.form;
  //
  if (options.checkVisibility && !this.isVisible(form))
    return {width: 0, height: 0, left: 0, top: 0};
  //
  let width, height, left, top;
  //
  let parentWidth = (!form && this.isInList()) ? this.parent.gridWidth : this.parent.originalWidth;
  let parentHeight = (!form && this.isInList()) ? this.parent.gridHeight : this.parent.originalHeight;
  //
  // Use width percentage or normal width
  let widthPerc = form ? this.formWidthPerc : this.listWidthPerc;
  if (widthPerc !== undefined)
    width = (parentWidth * widthPerc / 100);
  else
    width = form ? this.formWidth : this.listWidth;
  //
  // Use height percentage or normal height
  let heightPerc = form ? this.formHeightPerc : this.listHeightPerc;
  if (heightPerc !== undefined)
    height = (parentHeight * heightPerc / 100);
  else
    height = form ? this.formHeight : this.listHeight;
  //
  // Use left percentage or normal left
  let leftPerc = form ? this.formLeftPerc : this.listLeftPerc;
  if (leftPerc !== undefined)
    left = (this.parent.originalWidth * leftPerc / 100);
  else
    left = form ? this.formLeft : this.listLeft;
  //
  // Use top percentage or normal top
  let topPerc = form ? this.formTopPerc : this.listTopPerc;
  if (topPerc !== undefined)
    top = (this.parent.originalHeight * topPerc / 100);
  else
    top = form ? this.formTop : this.listTop;
  //
  if (options.real) {
    // In case of in list field I cannot get real height, top and left values because they are different for every values.
    // I just can get real width, if required, because every values of in list field have the same width
    if (!form && this.isInList())
      width = Client.eleMap[this.listContainerId].getRootObject().clientWidth;
    else {
      let fieldContainerId = form ? this.formContainerId : this.outListContainerId;
      let rootObject = Client.eleMap[fieldContainerId].getRootObject();
      //
      let fieldRects = rootObject.getBoundingClientRect();
      let panelRects = this.parent.getRootObject().getBoundingClientRect();
      //
      width = rootObject.clientWidth;
      height = rootObject.clientHeight;
      left = fieldRects.left - panelRects.left;
      top = fieldRects.top - panelRects.top;
    }
  }
  //
  return {width, height, left, top};
};


/**
 * Get index-th value
 * @param {Integer} index
 */
Client.IdfField.prototype.getValueByIndex = function (index)
{
  return this.values[index];
};


/**
 * Get data block end. I need this to handle empty values that are not included into panel totalRows property
 */
Client.IdfField.prototype.getDataBlockEnd = function ()
{
  let totalRows = this.parent.getTotalRows();
  //
  let dataBlockEnd = this.parent.getDataBlockEnd();
  if (dataBlockEnd === totalRows)
    dataBlockEnd = Math.max(totalRows, this.values.length);
  //
  return dataBlockEnd;
};


/**
 * Get header alignment
 * @param {Boolean} form
 */
Client.IdfField.prototype.getHeaderAlignment = function (form)
{
  // Default header alignment is left
  let headerAlignment = Client.IdfVisualStyle.alignments.LEFT;
  //
  // In case of "out list" field, header is right aligned just if it's above value and value is right aligned
  if (!form && !this.isInList()) {
    headerAlignment = this.isRightAligned() && this.listHeaderAbove ? Client.IdfVisualStyle.alignments.RIGHT : Client.IdfVisualStyle.alignments.LEFT;
    return headerAlignment;
  }
  //
  // Get header alignment
  headerAlignment = this.alignment;
  //
  // If I have not specific alignment or it's AUTO, ask to visual style
  if (headerAlignment === -1 || headerAlignment === Client.IdfVisualStyle.alignments.AUTO) {
    let vis = Client.IdfVisualStyle.getByIndex(this.getVisualStyle());
    headerAlignment = vis ? vis.getAlignment(form ? "formHeader" : "listHeader") : -1;
  }
  //
  // If there isn't an alignment yet or it's AUTO again, get the default one based on data type and control type
  if (headerAlignment === -1 || headerAlignment === Client.IdfVisualStyle.alignments.AUTO) {
    if (!Client.mainFrame.isIDF && this.controlType === Client.IdfField.controlTypes.CHECK && !form)
      headerAlignment = Client.IdfVisualStyle.alignments.CENTER;
    else
      headerAlignment = this.isRightAligned() && !form && this.isInList() ? Client.IdfVisualStyle.alignments.RIGHT : Client.IdfVisualStyle.alignments.LEFT;
  }
  //
  return headerAlignment;
};


/**
 * Update my tooltip
 */
Client.IdfField.prototype.updateTooltip = function ()
{
  let tooltip = null;
  //
  // Update list tooltip
  if (this.isShown()) {
    let listHeader = this.isInList() ? Client.eleMap[this.listContainerId] : Client.eleMap[this.outListHeaderId];
    tooltip = this.tooltip ? Client.Widget.getHTMLTooltip(this.listHeader, this.tooltip) : null;
    Client.Widget.updateObject(listHeader, {tooltip});
  }
  //
  // Update form tooltip
  if (this.isShown(true)) {
    tooltip = this.tooltip ? Client.Widget.getHTMLTooltip(this.formHeader, this.tooltip) : null;
    Client.Widget.updateObject(Client.eleMap[this.formHeaderId], {tooltip});
  }
};


/**
 * Update my header
 * @param {Boolean} form
 */
Client.IdfField.prototype.updateHeader = function (form)
{
  // If I have to update header for a form/list field and parent panel has not form/list or field is not visible in form/list, do nothing
  if (!this.isShown(form))
    return;
  //
  this.applyHeaderVisualStyle(form);
  //
  // If this is a static field, I have to update text of its unique value
  if (this.isStatic())
    this.values[1].updateElement({text: this.header});
  else { // Otherwise update innerText of header container
    let headerContainer, headerText, headerButton;
    //
    if (!form && this.isInList()) {
      headerContainer = Client.eleMap[this.listContainerId];
      headerText = Client.eleMap[this.listHeaderTextId];
      headerButton = Client.eleMap[this.listHeaderButtonId];
      //
      Client.Widget.updateElementClassName(headerContainer, "field-header-clickable", !this.isSortable());
    }
    else {
      headerContainer = form ? Client.eleMap[this.formHeaderId] : Client.eleMap[this.outListHeaderId];
      headerText = form ? Client.eleMap[this.formHeaderTextId] : Client.eleMap[this.outListHeaderTextId];
      headerButton = form ? Client.eleMap[this.formHeaderButtonId] : Client.eleMap[this.outListHeaderButtonId];
    }
    //
    // Extract the image from the caption if present
    let {caption, icon, color} = Client.Widget.extractCaptionData(form ? this.formHeader : this.listHeader);
    //
    // If there is an icon, set it into header button
    if (icon)
      Client.Widget.setIconImage({image: icon, el: headerButton, color});
    //
    Client.Widget.updateObject(headerButton, {visible: !!icon});
    Client.Widget.updateObject(headerText, {innerHTML: caption, visible: !!caption});
    //
    // Update ClassName
    let oldClassName = (form ? this.oldFormHeaderClassName : this.oldListHeaderClassName) || "";
    let newClassName = (form ? this.formHeaderClassName : this.listHeaderClassName) || "";
    if (oldClassName !== newClassName) {
      Client.Widget.updateElementClassName(headerContainer, oldClassName, true);
      Client.Widget.updateElementClassName(headerContainer, newClassName);
    }
    //
    if (!form)
      Client.Widget.updateElementClassName(headerContainer, "field-has-filter", !this.qbeFilter);
    //
    if (form)
      delete this.oldFormHeaderClassName;
    else
      delete this.oldListHeaderClassName;
  }
};


/**
 * Show/hide header
 * @param {Boolean} form
 */
Client.IdfField.prototype.showHeader = function (form)
{
  // If I have to show header for a form/list field and parent panel has not form/list or field is not visible in form/list, do nothing
  if (!this.isShown(form))
    return;
  //
  // Static field has no header
  if (this.isStatic(true))
    return;
  //
  let show = (form ? this.showFormHeader : this.showListHeader && this.parent.getHeaderHeight() > 0) && this.isVisible(form);
  //
  if (this.isStatic())
    show = false;
  //
  let headerContainer;
  //
  if (form)
    headerContainer = Client.eleMap[this.formHeaderId];
  else
    headerContainer = this.isInList() ? Client.eleMap[this.listContainerId] : Client.eleMap[this.outListHeaderId];
  //
  let headerStyle, newHeaderStyle;
  if (!form && this.isInList()) {
    // If field is visible use "visibility" style property because header has to take up space also when it's not visible
    headerStyle = this.listHeaderStyle;
    if (this.isVisible())
      newHeaderStyle = {display: "flex", visibility: show ? "visible" : "hidden"};
    else // Otherwise use "display" property to make it totally disappear when not visible
      newHeaderStyle = {visibility: "visible", display: show ? "flex" : "none"};
  }
  else {
    headerStyle = form ? this.formHeaderStyle : this.outListHeaderStyle;
    newHeaderStyle = {display: show ? "flex" : "none"};
  }
  //
  Client.Widget.updateStyle(headerContainer, headerStyle, newHeaderStyle);
};


/**
 * Set header above value
 * @param {Boolean} form
 */
Client.IdfField.prototype.setHeaderAbove = function (form)
{
  // If I have to set header above for a form/list field and parent panel has not form/list or field is "in-list" or it's not visible in form/list, do nothing
  if (!this.isShown(form) || (!form && this.isInList()))
    return;
  //
  // Static field has no header
  if (this.isStatic(true))
    return;
  //
  // Get row container
  let rowContainer = form ? Client.eleMap[this.formContainerId] : Client.eleMap[this.outListContainerId];
  //
  // Add/remove header above class
  let headerAbove = form ? this.formHeaderAbove : this.listHeaderAbove;
  Client.Widget.updateElementClassName(rowContainer, "header-above", !headerAbove);
};


/**
 * Show clear filters button
 * @param {Boolean} show
 */
Client.IdfField.prototype.showClearFiltersButton = function (show)
{
  this.values[0]?.showClearFiltersButton(show);
};


/**
 * Update my image
 * @param {Boolean} form
 */
Client.IdfField.prototype.updateImage = function (form)
{
  // If I have to update header image for a form/list field and parent panel has not form/list or field is not visible in form/list, do nothing
  if (!this.isShown(form))
    return;
  //
  // Static field has no header
  if (this.isStatic(true))
    return;
  //
  let headerContainer, headerStyle;
  //
  if (form) {
    headerStyle = this.formHeaderStyle;
    headerContainer = Client.eleMap[this.formHeaderId];
  }
  else {
    headerStyle = this.isInList() ? this.listHeaderStyle : this.outListHeaderStyle;
    headerContainer = this.isInList() ? Client.eleMap[this.listContainerId] : Client.eleMap[this.outListHeaderId];
  }
  //
  let src = (Client.mainFrame.isIDF ? "images/" : "") + this.image;
  Client.Widget.updateStyle(headerContainer, headerStyle, {backgroundImage: "url('" + src + "')"});
};


/**
 * Update image resize mode
 * @param {Boolean} form
 */
Client.IdfField.prototype.updateImageResizeMode = function (form)
{
  // Static field has no header
  if (this.isStatic(true))
    return;
  //
  let headerContainer;
  //
  if (form)
    headerContainer = Client.eleMap[this.formHeaderId];
  else
    headerContainer = this.isInList() ? Client.eleMap[this.listContainerId] : Client.eleMap[this.outListHeaderId];
  //
  let className = headerContainer.className || headerContainer.getRootObject().className;
  //
  // Get old resize mode class
  let oldResizeMode = className.split(" ").find(c => c.startsWith("control-blob-img"));
  //
  let newResizeMode;
  switch (this.imageResizeMode) {
    case Client.IdfField.stretches.FIT:
      newResizeMode = "control-blob-img-fill";
      break;

    case Client.IdfField.stretches.CENTER:
      newResizeMode = "control-blob-img-enlarge";
      break;
  }
  //
  if (oldResizeMode !== newResizeMode) {
    Client.Widget.updateElementClassName(headerContainer, oldResizeMode, true);
    Client.Widget.updateElementClassName(headerContainer, newResizeMode);
  }
};


/**
 * Update sort mode
 */
Client.IdfField.prototype.updateSortMode = function ()
{
  let listHeaderText = Client.eleMap[this.listHeaderTextId];
  if (!listHeaderText)
    return;
  //
  let sortMode = this.sortMode || this.groupingMode;
  if (this.parent.status === Client.IdfPanel.statuses.qbe)
    sortMode = Client.IdfField.sortModes.NONE;
  //
  Client.Widget.updateElementClassName(listHeaderText, "sort-field-indicator-up", sortMode !== Client.IdfField.sortModes.ASC);
  Client.Widget.updateElementClassName(listHeaderText, "sort-field-indicator-down", sortMode !== Client.IdfField.sortModes.DESC);
};


/**
 * Handle sort
 * @param {Object} options
 */
Client.IdfField.prototype.handleSort = function (options)
{
  let events = [];
  //
  if (this.parent.status === Client.IdfPanel.statuses.qbe)
    return events;
  //
  // If I don't have new sort mode, calculate it
  if (options.sortMode === undefined) {
    switch (this.sortMode) {
      case Client.IdfField.sortModes.NONE:
        options.sortMode = Client.IdfField.sortModes.ASC;
        break;

      case Client.IdfField.sortModes.ASC:
        options.sortMode = Client.IdfField.sortModes.DESC;
        break;

      case Client.IdfField.sortModes.DESC:
        options.sortMode = Client.IdfField.sortModes.ASC;
        break;
    }
  }
  //
  // Apply sort
  if (Client.mainFrame.isIDF) {
    let yck, shp, ctp;
    switch (options.sortMode) {
      case Client.IdfField.sortModes.NONE:
        shp = "-1";
        ctp = "-1";
        break;

      case Client.IdfField.sortModes.ASC:
        yck = 20;
        break;

      case Client.IdfField.sortModes.DESC:
        yck = 10;
        break;
    }
    //
    events.push({
      id: "clk",
      def: this.clickEventDef,
      content: {
        oid: this.id,
        par1: "cap",
        yck,
        shp,
        ctp
      }
    });
  }
  else {
    this.parent.fields.forEach(f => {
      if (!options.resetAll && f !== this)
        return;
      //
      let newSortMode = options.resetAll ? Client.IdfField.sortModes.NONE : options.sortMode;
      if (options.add && f === this)
        newSortMode = options.sortMode;
      //
      if (newSortMode === f.sortMode)
        return;
      //
      f.updateElement({sortMode: newSortMode});
      events.push({
        id: "chgProp",
        obj: f.id,
        content: {
          name: "sortMode",
          value: newSortMode,
          clid: Client.id
        }
      });
    });
    events.push({
      id: "fireOnSort",
      obj: this.parent.id
    });
  }
  //
  return events;
};


/**
 * Handle grouping
 * @param {Integer} groupingMode
 */
Client.IdfField.prototype.handleGrouping = function (groupingMode)
{
  let events = [];
  //
  // If I don't have new grouping mode, calculate it
  if (groupingMode === undefined) {
    switch (this.groupingMode) {
      case Client.IdfField.groupingModes.NONE:
        groupingMode = Client.IdfField.groupingModes.DESC;
        break;

      case Client.IdfField.groupingModes.ASC:
        groupingMode = Client.IdfField.groupingModes.DESC;
        break;

      case Client.IdfField.groupingModes.DESC:
        groupingMode = Client.IdfField.groupingModes.ASC;
        break;
    }
  }
  //
  let yck;
  //
  switch (groupingMode) {
    case Client.IdfField.groupingModes.NONE:
      yck = 2;
      break;

    case Client.IdfField.groupingModes.ASC:
      yck = 1;
      break;

    case Client.IdfField.groupingModes.DESC:
      yck = 30;
      break;
  }
  //
  // Apply grouping
  if (Client.mainFrame.isIDF)
    events.push({
      id: "clk",
      def: this.clickEventDef,
      content: {
        oid: this.id,
        par1: "cap",
        yck
      }});
  else {
    this.updateElement({groupingMode});
    events.push({
      id: "chgProp",
      obj: this.id,
      content: {
        name: "groupingMode",
        value: groupingMode,
        clid: Client.id
      }
    });
    events.push({
      id: "fireOnSort",
      obj: this.parent.id,
      content: {
        grouping: true
      }
    });
  }
  //
  return events;
};


/**
 * Check if there is a field having this field as aggregateOfField
 */
Client.IdfField.prototype.hasAggregatedField = function ()
{
  return !!this.parent.fields.find(f => f.aggregateOfField === this.index);
};


/**
 * Get aggregated field
 */
Client.IdfField.prototype.getAggregatedFieldParent = function ()
{
  return this.parent.fields.find(f => f.index === this.aggregateOfField);
};


/**
 * Return true if I'm enabled
 * @param {Integer} valueIndex - for in list field, index of value to check if it's enabled
 */
Client.IdfField.prototype.isEnabled = function (valueIndex)
{
  if (this.isStatic())
    return true;
  //
  let qbeStatus = this.parent.status === Client.IdfPanel.statuses.qbe;
  let rowQbe = this.parent.searchMode === Client.IdfPanel.searchModes.row;
  //
  // If I have a value index to check and panel status is QBE or
  // value index is "0" and qbe mode is ROW
  if ((qbeStatus && valueIndex !== undefined) || (rowQbe && valueIndex === 0)) {
    // Just values belonging to first row are enabled in QBE status
    if (qbeStatus && valueIndex > 1)
      return false;
    //
    // If I'm a simple lookup field (not auto lookup nor smart lookup), I'm not enabled
    if (this.isLookup() && !this.autoLookup && !this.smartLookup)
      return false;
    //
    // Check if I'm enabled when status is QBE
    if (!this.enabledInQbe)
      return false;
    //
    return true;
  }
  //
  // If parent panel is locked, I'm not enabled
  if (this.parent.locked && this.causeValidation)
    return false;
  //
  // If I belong to a page that is not enabled, I'm not enabled
  if (this.page && !this.page.isEnabled())
    return false;
  //
  // If I belong to a group that is not enabled, I'm not enabled
  if (this.group && !this.group.isEnabled())
    return false;
  //
  let enabled = this.enabled;
  //
  // If I have to check a specific row index, check if value is enabled
  if (enabled && valueIndex) {
    // If value is not enabled, I'm not enabled
    let val = this.getValueByIndex(valueIndex);
    if (val && !val.isEnabled())
      return false;
    //
    // Check if value index refers to a new row
    let isNew = this.parent.isNewRow(valueIndex);
    //
    // If parent panel can insert but it cannot update, check if value index refers to a row having an inserted document.
    // In this case I have to consider that row as a new row. Use row selector type to check it
    if (!isNew && this.parent.canInsert && !this.parent.canUpdate) {
      // Row selector belongs to first field, so get it
      let firstField = this.parent.fields[0];
      let firstFieldVal = firstField.getValueByIndex(valueIndex);
      //
      // If first field value has an "inserted document" row selector, consider valueIndex-th row as new
      if (firstFieldVal) {
        let isInsertedDoc = firstFieldVal.rowSelectorType === Client.IdfFieldValue.rowSelectorTypes.INSERTED_DOC_ERROR;
        isInsertedDoc = isInsertedDoc || firstFieldVal.rowSelectorType === Client.IdfFieldValue.rowSelectorTypes.INSERTED_DOC_UPDATED;
        //
        if (isInsertedDoc)
          isNew = true;
      }
    }
    //
    // If parent panel cannot update, I'm not enabled for not new rows
    if (!isNew && !this.parent.canUpdate && !this.parent.DOModified)
      enabled = false;
    //
    // If parent panel cannot insert, I'm not enabled for new rows
    if (isNew && !this.parent.canInsert)
      enabled = false;
    //
    // Cannot update unbound column on row inserting
    if (isNew && this.unbound)
      enabled = false;
  }
  //
  return enabled;
};


/**
 * Return true if I'm visible in given layout
 * @param {Boolean} form
 * @param {Boolean} skipGroup
 */
Client.IdfField.prototype.isVisible = function (form, skipGroup)
{
  if (Client.mainFrame.isEditing()) {
    if (form && (!this.parent.hasForm || !this.showInForm))
      return false;
    //
    if (!form && (!this.parent.hasList || !this.showInList))
      return false;
  }
  //
  if (!this.isShown(form))
    return false;
  //
  if (!this.visible)
    return false;
  //
  if (!form && this.hiddenInList)
    return false;
  //
  // If I belong to a page that is not visible, I'm not visible
  if (this.page && !this.page.isVisible())
    return false;
  //
  // If I belong to a group that is not visible, I'm not visible
  if (!skipGroup && this.group && !this.group.isVisible(form))
    return false;
  //
  return true;
};


/**
 * Return true if this field is static
 * @param {Boolean} checkFormEditor
 */
Client.IdfField.prototype.isStatic = function (checkFormEditor)
{
  // In the form editor, sometimes static field has to act as normal field
  if (checkFormEditor && Client.mainFrame.isEditing())
    return false;
  //
  return this.type === Client.IdfField.types.STATIC;
};


/**
 * Return true if this is a lookup field
 */
Client.IdfField.prototype.isLookup = function ()
{
  return this.type >= Client.IdfField.types.LOOKUP;
};


/**
 * Return true if this is a combo field
 */
Client.IdfField.prototype.isCombo = function ()
{
  let controlType = this.getControlType();
  //
  if (controlType === Client.IdfField.controlTypes.AUTO) {
    if (this.valueList || this.hasValueSource || this.smartLookup)
      return true;
    //
    if (this.parent.canUseRowQbe() && this.values[0].valueList)
      return true;
  }
  //
  return (controlType === Client.IdfField.controlTypes.COMBO);
};


/**
 * Return true if this is a button field
 * @param {Client.IdfFieldValue} fieldValue
 */
Client.IdfField.prototype.isButton = function (fieldValue)
{
  return this.getControlType(fieldValue) === Client.IdfField.controlTypes.BUTTON;
};


/**
 * Return the control type
 * @param {Client.IdfFieldValue} fieldValue
 */
Client.IdfField.prototype.getControlType = function (fieldValue)
{
  if (this.controlType)
    return this.controlType;
  //
  let visualStyle = fieldValue?.getVisualStyle() ?? this.visualStyle;
  return Client.IdfVisualStyle.getByIndex(visualStyle).getControlType();
};


/**
 * Add given value to values array
 * @param {IdfFieldValue} value
 */
Client.IdfField.prototype.addValue = function (value)
{
  this.values[value.index] = value;
};


/**
 * Show or hide multiple selection checkbox
 * @param {Boolean} show
 */
Client.IdfField.prototype.updateMultiSelVisibility = function (show)
{
  for (let i = 1; i <= this.values.length; i++) {
    if (!this.values[i])
      continue;
    //
    this.values[i].updateMultiSelVisibility(show);
  }
};


/**
 * Select or unselect index-th row
 * @param {Boolean} value
 * @param {Integer} index
 */
Client.IdfField.prototype.selectRow = function (value, index)
{
  let fieldValue = this.values[index];
  if (!fieldValue)
    return;
  //
  fieldValue.selectRow(value);
};


/**
 * Check if this field can sort
 */
Client.IdfField.prototype.isSortable = function ()
{
  return this.parent.canSort && this.canSort && (!Client.mainFrame.isIDF || this.canSortFlag);
};


/**
 * Check if this field can use header QBE
 */
Client.IdfField.prototype.canUseHeaderQbe = function ()
{
  let headerQbe = this.parent.searchMode === Client.IdfPanel.searchModes.header;
  let enabledInQbe = this.enabledInQbe && (!this.isLookup() || this.autoLookup || this.smartLookup);
  //
  return headerQbe && this.parent.canSearch && (this.isSortable() || enabledInQbe) && this.dataType !== Client.IdfField.dataTypes.BLOB;
};


/**
 * Check if this field can use row QBE
 */
Client.IdfField.prototype.canUseRowQbe = function ()
{
  return this.parent.searchMode === Client.IdfPanel.searchModes.row && this.parent.canSearch && this.dataType !== Client.IdfField.dataTypes.BLOB;
};


/**
 * Activate combo
 * @param {Object} event
 */
Client.IdfField.prototype.activateCombo = function (event)
{
  let events = [];
  //
  let control = Client.eleMap[event.obj];
  if (!control)
    return events;
  //
  let parentWidget = control.parentWidget;
  if (!(control instanceof Client.IdfControl) && parentWidget instanceof Client.IdfFieldValue)
    control = parentWidget.getSourceControl(event);
  //
  let isFilterPopup = parentWidget instanceof Client.IdfFilterPopup;
  //

  if (isFilterPopup || parentWidget.isRowQbe)
    events.push(...this.handleQbeCombo({popupId: isFilterPopup ? parentWidget.id : undefined}));
  else if (this.smartLookup) {
    control.waitingForList = true;
    //
    event.immediate = true;
    event.content.value = "*";
    event.obj = control.id;
    //
    events.push(...parentWidget.handleChange(event));
  }
  else if (this.hasValueSource)
    events.push(...parentWidget.activateField(event, {waitingForList: true}));
  else if (!Client.mainFrame.isIDF) {
    control.waitingForList = true;
    control.activateCombo();
  }
  //
  return events;
};


/**
 * Handle filter combo
 * @param {Object} event
 */
Client.IdfField.prototype.handleComboFilter = function (event)
{
  let events = [];
  //
  let control = Client.eleMap[event.obj];
  if (!control)
    return events;
  //
  let parentWidget = control.parentWidget;
  if (!(control instanceof Client.IdfControl) && parentWidget instanceof Client.IdfFieldValue)
    control = parentWidget.getSourceControl(event);
  //
  let isFilterPopup = parentWidget instanceof Client.IdfFilterPopup;
  //
  let valueToSend = event.content.value;
  //
  // When filter is "", avoid sending filter and reset qbe filter instead
  if (valueToSend === "" && control.isCombo()) {
    if (control.isComboOpen()) {
      events.push(...this.activateCombo(event));
      return events;
    }
    //
    // Cancel combo opening: I don't want to open a closed combo when filter is ""
    control.cancelComboOpening();
  }
  //
  if (Client.mainFrame.isIDF || valueToSend === "") {
    if (isFilterPopup || parentWidget.isRowQbe) {
      if (valueToSend !== "" && (this.smartLookup || !Client.mainFrame.isIDF))
        events.push(...this.handleQbeCombo({text: valueToSend, popupId: isFilterPopup ? parentWidget.id : undefined}));
      else
        events.push(...this.handleQbeFilter({obj: control.id, content: {name: "value", value: valueToSend}}));
    }
    else {
      let immediate;
      //
      // Smart lookup has to sent filter when it's open or filter is ""
      // Value source has to sent filter when it's closed and filter is ""
      if (this.smartLookup)
        immediate = control.isComboOpen() || valueToSend === "";
      else if (this.hasValueSource)
        immediate = !control.isComboOpen() && valueToSend === "";
      //
      events.push(...parentWidget.handleChange({obj: control.id, content: {name: "value", value: valueToSend}, isComboFilter: true, immediate}));
    }
    //
    return events;
  }
  //
  // Send onFilter event on IDC
  control.waitingForList = true;
  //
  events.push({
    id: "fireEvent",
    obj: this.id,
    content: {
      srcId: "onFilter",
      row: parentWidget instanceof Client.IdfFieldValue ? parentWidget.getIndex(true) : parentWidget.index,
      srcObjId: parentWidget.id,
      filter: valueToSend
    }
  });
  //
  return events;
};


/**
 * Handle qbe filter
 * @param {Object} event
 */
Client.IdfField.prototype.handleQbeFilter = function (event)
{
  let events = [];
  //
  let filter = (event.content.value ?? "") + "";
  filter = filter.trim();
  //
  if (filter === this.qbeFilter)
    return events;
  //
  let control = Client.eleMap[event.obj];
  if (control?.isCombo())
    control.cancelComboOpening();
  //
  if (Client.mainFrame.isIDF) {
    let eventContent = {oid: this.id, par1: filter};
    //
    // In case of value, send a "qbeset" event having "qbefilter" as object name
    if (event.content.name === "value") {
      eventContent.obn = event.content.clear ? "clear" : "qbefilter";
      //
      // In case of rowQbe smart lookup, I have to send to server rValues instead of values
      if (this.smartLookup && !event.content.filterPopup && control) {
        let newQbeFilter = control.getComboRValueFromValue(filter);
        eventContent.par1 = newQbeFilter;
        //
        // Update my qbe filter
        this.updateElement({qbeFilter: newQbeFilter});
      }
    }
    //
    events.push({
      id: "qbeset",
      def: !this.hasValueSource || event.content.filterPopup ? Client.IdfMessagesPump.eventTypes.URGENT : Client.IdfMessagesPump.eventTypes.DEFERRED,
      content: eventContent
    });
  }
  else {
    events.push({
      id: "chgProp",
      obj: this.id,
      content: {
        name: "qbeFilter",
        value: filter,
        clid: Client.id
      }
    });
    //
    if (this.isCombo() && !this.valueList)
      events.push(...this.handleQbeCombo({load: true}));
  }
  //
  return events;
};


/**
 * Handle qbe combo
 * @param {Object} options
 */
Client.IdfField.prototype.handleQbeCombo = function (options)
{
  let events = [];
  //
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "qbecombo",
      def: Client.IdfMessagesPump.eventTypes.URGENT,
      content: {
        oid: this.id,
        obn: options?.popupId,
        par1: options?.text || (this.smartLookup ? "*" : "")
      }
    });
  }
  else {
    events.push({
      id: "fireEvent",
      obj: this.id,
      content: {
        srcId: "onQBECombo",
        srcObjId: this.id + ":" + (this.parent.searchMode === Client.IdfPanel.searchModes.toolbar ? "1" : "0"),
        row: 0,
        load: options?.load,
        popup: options?.popupId,
        text: options?.text || ""
      }
    });
  }
  //
  return events;
};


/**
 * Request data for combo in QBE
 */
Client.IdfField.prototype.requestQBECombo = function ()
{
  // In case of combo without valueList (IDC) or autolookup (IDF)
  // ask server for value list if my parent does not have one
  if ((!Client.mainFrame.isIDF && this.isCombo() && !this.valueList)
          || (Client.mainFrame.isIDF && this.autoLookup))
    Client.mainFrame.sendEvents(this.handleQbeCombo({load: !Client.mainFrame.isIDF}));
};

/**
 * Handle reset cache command
 * @param {Object} options
 */
Client.IdfField.prototype.resetCache = function (options)
{
  if (this.isStatic())
    return;
  //
  let from = options.from ?? 1;
  let to = options.to ?? this.values.length;
  //
  for (let i = from; i <= to; i++) {
    let value = this.values[i];
    if (!value)
      continue;
    //
    // If I have a data block coming after reset cache, I don't have to remove values belonging to that block. It's better to reuse them, emptying their text
    if (i >= options.dataBlockStart && i <= options.dataBlockEnd)
      continue;
    //
    // Clear controls assigned to current value
    value.clearControls();
    //
    // Close current value and remove it from values array
    value.close(true);
    this.values[i] = undefined;
  }
};


/**
 * Reset cached styles
 * @param {Integer} index
 */
Client.IdfField.prototype.resetCachedStyles = function (index)
{
  if (index === undefined) {
    this.listHeaderStyle = {};
    this.listValueStyle = {};
    this.outListHeaderStyle = {};
    this.outListValueStyle = {};
    this.outListParentColStyle = {};
    this.formHeaderStyle = {};
    this.formValueStyle = {};
    this.formParentColStyle = {};
    this.aggregateContainerStyle = {};
  }
  //
  let start = index ?? 0;
  let end = index ?? this.values.length;
  for (let i = start; i <= end; i++) {
    if (!this.values[i])
      continue;
    //
    this.values[i].resetCachedStyles();
  }
};


/**
 * Set error on given row
 * @param {Object} error
 */
Client.IdfField.prototype.setRowError = function (error)
{
  this.values[error.row]?.updateElement({rowErrorText: error.text});
};


/**
 * Update blob controls
 */
Client.IdfField.prototype.updateBlob = function ()
{
  // If data type is not BLOB, do nothing
  if (this.dataType !== Client.IdfField.dataTypes.BLOB)
    return;
  //
  this.updateControls({updateBlobCommands: true});
};


/**
 * Update visibility
 * @param {Integer} index
 */
Client.IdfField.prototype.updateVisibility = function (index)
{
  let modes = ["list", "form"];
  //
  for (let i = 0; i < modes.length; i++) {
    let form = modes[i] === "form";
    let parentColumn = form ? this.parent.getFormFieldColumn(this.id) : this.parent.getListFieldColumn(this.id);
    //
    if (!this.isShown(form) || !parentColumn)
      continue;
    //
    // Update header visibility
    this.showHeader(form);
    //
    // Update aggregate container visibility
    if (!form) {
      let aggregateContainerId;
      let oldAggregateStyle;
      let newAggregateStyle = {};
      //
      if (this.aggregateOfField !== -1) {
        let parentField = this.getAggregatedFieldParent();
        aggregateContainerId = parentField.aggregateContainerId;
        oldAggregateStyle = parentField.aggregateContainerStyle;
        //
        let parentFieldVisible = parentField.isVisible();
        newAggregateStyle.display = parentFieldVisible ? "flex" : "none";
        newAggregateStyle.visibility = this.isVisible() ? "visible" : "hidden";
        //
        // Add/remove parentField id from parent visibleAggregateFields
        this.parent.updateVisibleAggregateFields(parentField.id, !parentFieldVisible);
      }
      else if (!this.hasAggregatedField()) {
        aggregateContainerId = this.aggregateContainerId;
        oldAggregateStyle = this.aggregateContainerStyle;
        //
        newAggregateStyle.display = this.isVisible() ? "flex" : "none";
        newAggregateStyle.visibility = "visible";
      }
      //
      Client.Widget.updateStyle(Client.eleMap[aggregateContainerId], oldAggregateStyle, newAggregateStyle);
    }
    //
    // Update values visibility
    let start = index ?? this.parent.getDataBlockStart();
    let end = index ?? this.getDataBlockEnd();
    for (let j = start; j <= end; j++) {
      if (!this.values[j])
        continue;
      //
      this.values[j].updateVisibility(form);
    }
  }
};


/**
 * Notified on parent panel status change
 */
Client.IdfField.prototype.onPanelStatusChange = function ()
{
  if (this.isInList())
    this.updateSortMode();
  //
  this.updateControls({isInQbe: true});
};


/**
 * Return true if this field is shown in given layout
 * @param {Boolean} form
 */
Client.IdfField.prototype.isShown = function (form)
{
  if (Client.mainFrame.isEditing())
    return true;
  //
  if (form)
    return this.parent.hasForm && this.showInForm;
  else
    return this.parent.hasList && this.showInList;
};


/**
 * Handle resize
 */
Client.IdfField.prototype.handleResize = function ()
{
  // I need to handle resize just for visible in list fields on IDF when layout is list
  let events = [];
  if (!Client.mainFrame.isIDF)
    return events;
  //
  // The subframe resize must be handled in list and in form
  if (this.subFrameId && Client.eleMap[this.subFrameId])
    events.push(...Client.eleMap[this.subFrameId].handleResize());
  //
  if (this.parent.layout === Client.IdfPanel.layouts.form)
    return events;
  //
  if (!this.isInList())
    return events;
  //
  if (!this.isVisible())
    return events;
  //
  let rects;
  let width, height, left, top;
  //
  rects = this.getRects({real: true});
  width = isNaN(rects.width) ? undefined : Math.floor(rects.width);
  height = isNaN(rects.height) ? undefined : Math.floor(rects.height);
  left = isNaN(rects.left) ? undefined : Math.floor(rects.left);
  top = isNaN(rects.top) ? undefined : Math.floor(rects.top);
  //
  if (width && height) {
    if (this.lastListWidth !== width || this.lastListHeight !== height || this.lastListLeft !== left || this.lastListTop !== top) {
      events.push({
        id: "resize",
        def: Client.IdfMessagesPump.eventTypes.ACTIVE,
        content: {
          oid: this.id,
          obn: "list",
          par1: width,
          par2: height,
          par3: left,
          par4: top
        }
      });
    }
    //
    this.lastListWidth = width;
    this.lastListHeight = height;
    this.lastListLeft = left;
    this.lastListTop = top;
  }
  //
  return events;
};


/**
 * Handle selection change event
 * @param {Object} event
 */
Client.IdfField.prototype.handleSelectionChange = function (event)
{
  let events = [];
  //
  if ((!this.notifySelectionChange && Client.mainFrame.isIDF) || this.parent.status === Client.IdfPanel.statuses.qbe)
    return events;
  //
  let range = document.getSelection().getRangeAt(0);
  if (Client.mainFrame.isIDF)
    events.push({
      id: "txtsel",
      def: this.parent.selectionChangeEventDef,
      delay: 250,
      content: {
        oid: this.id,
        par1: range.startOffset,
        par2: range.endOffset
      }
    });
  else
    events.push({
      id: "onTextSelectionChanged",
      obj: this.id,
      content: {
        start: range.startOffset,
        end: range.endOffset
      }
    });
  //
  return events;
};


/**
 * Give focus to the element
 * @param {Object} options
 */
Client.IdfField.prototype.focus = function (options)
{
  options = options || {};
  //
  let row;
  if (options.absoluteRow !== undefined)
    row = options.absoluteRow;
  else if (options.row === undefined || this.parent.layout === Client.IdfPanel.layouts.form || !this.isInList()) {
    if (this.parent.layout === Client.IdfPanel.layouts.list && this.parent.canUseRowQbe() && !this.parent.getTotalRows(true))
      row = 0; // QBE row
    else
      row = this.parent.getActiveRowIndex();
  }
  else
    row = this.parent.actualPosition + options.row;
  //
  delete options.row;
  delete options.absoluteRow;
  //
  if (this.values[row]) {
    this.values[row].focus(options);
    return true;
  }
};


Client.IdfField.prototype.isDraggable = function (element)
{
  // A Field is draggable IF
  // - you can reorder the columns AND you are on the list header
  // - the panel can drag AND you are on a disablef field (form/list)
  if ((this.parent.canReorderColumn || Client.mainFrame?.isEditing()) && this.isInList() && Client.Utils.isMyParent(element.getRootObject(), this.listContainerId))
    return true;
  //
  return false;
};


Client.IdfField.prototype.canResizeW = function (element)
{
  if ((this.parent.canResizeColumn || Client.mainFrame?.isEditing()) && this.isInList() && Client.Utils.isMyParent(element.getRootObject(), this.listContainerId))
    return true;
  //
  // Let resize the static fields or the list headers/ form headers out of list
  if (this.isStatic() && this.formHeaderId && this.parent.layout === Client.IdfPanel.layouts.form && Client.Utils.isMyParent(element.getRootObject(), this.formHeaderId))
    return true;
  //
  return false;
};


Client.IdfField.prototype.canResizeH = function (element)
{
  // Let resize the static fields or the list headers/ form headers out of list
  if (Client.mainFrame?.isEditing() && (this.isStatic() && this.formHeaderId && this.parent.layout === Client.IdfPanel.layouts.form && Client.Utils.isMyParent(element.getRootObject(), this.formHeaderId)))
    return true;
  //
  return false;
};


Client.IdfField.prototype.applyDragDropCursor = function (cursor)
{
  // Apply the resize cursor only on the list header
  let obj = Client.eleMap[this.listContainerId]?.getRootObject();
  //
  // During the editing phase consider also the form/outlist header
  if (Client.mainFrame?.isEditing())
    obj = this.parent.layout === Client.IdfPanel.layouts.form ? Client.eleMap[this.formHeaderId]?.getRootObject() : (this.inList ? Client.eleMap[this.listContainerId]?.getRootObject() : Client.eleMap[this.outListHeaderId]?.getRootObject());
  if (!obj)
    return;
  //
  if (["e-resize", "w-resize", "s-resize", "n-resize"].includes(cursor)) {
    obj.setAttribute("opnt", "dd");
    obj.style.cursor = cursor;
    obj.classList.add("system-cursor");
    //
    // Clear the cursor on mouse leave
    if (!obj.onmouseleave)
      obj.onmouseleave = Client.Widget.ddClearPointer;
  }
  else if (obj.getAttribute("opnt")) {
    // I already set a cursor on the object BUT now i have no operation : clear the cursor
    obj.style.cursor = "";
    obj.setAttribute("opnt", "");
    obj.classList.remove("system-cursor");
  }
};


Client.IdfField.prototype.canBeDroppedOn = function (widget, targetDomElement, draggedDomElement)
{
  // If the drag operation was started from the list header and the panel can reorder columns we can drop only onto other fields list headers
  if (this.isInList() && (this.parent.canReorderColumn || Client.mainFrame?.isEditing()) && Client.Utils.isMyParentEl(draggedDomElement, Client.eleMap[this.listContainerId])) {
    if (widget instanceof Client.IdfField && widget.isInList() && this.parent === widget.parent && Client.Utils.isMyParentEl(targetDomElement, Client.eleMap[widget.listContainerId]))
      return true;
    else
      return false;
  }
  //
  // Normally we can drop everywhere
  return true;
};


Client.IdfField.prototype.acceptsDrop = function (widget, targetDomElement)
{
  // A field can accept the drop if
  // - the widget is a list field, i'm a list field AND the panel can reorder list and we are of the same panel and the target IS the field header
  // - the panel accepts a generic drop
  if ((this.parent.canReorderColumn || Client.mainFrame?.isEditing()) && widget instanceof Client.IdfField && this.isInList() && widget.isInList() && widget.parent === this.parent && Client.Utils.isMyParentEl(targetDomElement, Client.eleMap[this.listContainerId]))
    return true;
  //
  // Special : in editing we enable the drop of a OUTLIST field (IDFControl) on an InList
  if (Client.mainFrame?.isEditing() && widget instanceof Client.IdfControl && this.isInList() && !widget.parentWidget?.parent.isInList() && widget.parentWidget?.parent.parent === this.parent && Client.Utils.isMyParentEl(targetDomElement, Client.eleMap[this.listContainerId]))
    return true;
  //
  // Special: enable drop of a IDFControl on the header of a oulist or form field
  if (Client.mainFrame?.isEditing() && widget instanceof Client.IdfControl && widget.parentWidget?.parent.parent === this.parent && (Client.Utils.isMyParentEl(targetDomElement, Client.eleMap[this.formHeaderId]) || Client.Utils.isMyParentEl(targetDomElement, Client.eleMap[this.outListHeaderId])))
    return true;
  //
  if (Client.mainFrame?.isEditing() && widget instanceof Client.IdfGroup && widget.parent === this.parent && Client.Utils.isMyParentEl(targetDomElement, Client.eleMap[this.formContainerId]))
    return true;
  //
  return false;
};


Client.IdfField.prototype.handleDrop = function (dragWidget, droppedElement, x, y, ev, options)
{
  if (Client.mainFrame?.isEditing()) {
    let draggedField = dragWidget instanceof Client.IdfControl ? dragWidget.parentWidget?.parent : dragWidget;
    //
    // Now notify the panel the editing operation
    this.parent.handleEditOperation(Client.IdfPanel.editOperations.drag, [draggedField], this, {x, y, deltaX: options.deltaX, deltaY: options.deltaY}, ev);
    return;
  }
  //
  this.parent.reorderList(dragWidget, this);
};


Client.IdfField.prototype.getSupportedTransformOperation = function (x, y, element, root)
{
  let rt = root || (this.parent.layout === Client.IdfPanel.layouts.list ? (this.isInList() ? Client.eleMap[this.listContainerId]?.getRootObject() : Client.eleMap[this.outListHeaderId]?.getRootObject()) : Client.eleMap[this.formHeaderId]?.getRootObject());
  let op = Client.Widget.prototype.getSupportedTransformOperation.call(this, x, y, element, rt);
  //
  // When editing and resizing the header of a list field don't let the left resize
  if (Client.mainFrame?.isEditing() && this.parent.layout === Client.IdfPanel.layouts.list && this.inList && op === Client.Widget.transformOperation.RESIZELEFT)
    op = Client.Widget.transformOperation.NONE;
  //
  return op;
};


Client.IdfField.prototype.getTransformOperationTargetObj = function (operation, element)
{
  return (this.parent.layout === Client.IdfPanel.layouts.list ? (this.isInList() ? Client.eleMap[this.listContainerId]?.getRootObject() : Client.eleMap[this.outListContainerId]?.getRootObject()) : Client.eleMap[this.formContainerId]?.getRootObject());
};


Client.IdfField.prototype.onTransform = function (options)
{
  // Resize in list OR resize of the header
  if (Client.mainFrame?.isEditing()) {
    let list = this.parent.layout === Client.IdfPanel.layouts.list;
    let struct = [];
    if (list) {
      let panelRect = Client.eleMap[list && this.group ? this.group.listContainerConf.id : this.parent.panelContainerConf.id]?.getRootObject()?.getBoundingClientRect() || {top: 0, left: 0, width: 100, height: 100};
      let deltaWidthPerc = options.w / panelRect.width * 100;
      //
      let resizedFields = Client.ViewEdit.getEditorSelectedElements(this);
      resizedFields.forEach(f => {
        let rect = {id: f.id};
        if (f.listWidthPerc)
          rect.listWidthPerc = Math.round(deltaWidthPerc);
        else
          rect.listWidth = options.w;
        rect.listResizeWidth = "1";
        struct.push(rect);
      });
      //
      Client.eleMap["editm"].editProxy?.appCmd([{id: this.parent.id, c: "editDone", newStruct: struct, reorder: [], grid: {}}]);
    }
    return;
  }
  //
  let width = options.w < 50 ? 50 : Math.ceil(options.w);
  //
  // tell the server the new dimensions
  let events = [];
  if (Client.mainFrame.isIDF)
    events.push({
      id: "rescol",
      def: Client.IdfMessagesPump.eventTypes.ACTIVE,
      content: {
        oid: this.id,
        obn: "",
        par1: width
      }
    });
  else
    events.push({
      id: "fireOnFieldResized",
      obj: this.parent.id,
      content: {
        field: this.index,
        oldWidth: this.listWidth,
        newWidth: width
      }
    });
  //
  Client.mainFrame.sendEvents(events);
  //
  this.updateElement({listWidth: width});
};


/**
 * Sometimes the server sends an ID with this format:
 * this.id +
 *           ":fv" - the form value control
 *           ":lv1 ... :lv99" - the list control of the requested ROW
 *           ":lc" - list caption
 *           ":fc" - form caption
 * @param {String} id
 *
 * @returns {DomNode} the domObj relative to the ID
 */
Client.IdfField.prototype.getDomObjFromId = function (id)
{
  if (id.includes(":fv") || (id.includes(":fc") && this.isStatic()))
    return Client.eleMap[this.formValueId].getRootObject();
  else if (id.includes(":fc"))
    return Client.eleMap[this.formHeaderId].getRootObject();
  else if (id.includes(":lc"))
    return Client.eleMap[this.listContainerId].getRootObject();
  else if (id.includes(":lv")) {
    let pos = parseInt(id.substring(id.indexOf(":lv") + 3));
    return Client.eleMap[this.values[pos].listContainerId].getRootObject();
  }
};


/**
 * Return the target to use for opening a popup on this widget
 * @param {String} targetId
 * @returns {DomNode}
 */
Client.IdfField.prototype.getPopupTarget = function (targetId)
{
  // targetId could be a string that refers to a particular object: form value (fv), list value (lv1...99) or captions (lc, fc)
  // So if there is a targetId and its different from my id, I have to get the proper object
  if (targetId && targetId !== this.id)
    return this.getDomObjFromId(targetId);
  //
  if (this.isStatic())
    return this.values[1].getPopupTarget();
};


/**
 * Return true if the field can be focused
 * @param {Number} row
 */
Client.IdfField.prototype.canHaveFocus = function (row)
{
  row = row ?? this.parent.getActiveRowIndex();
  //
  if (this.group && !this.group.canHaveFocus())
    return false;
  //
  // Row "0" is the search row. In this case check focus just if current layout is list and field is in list
  if (row === 0 && this.parent.layout === Client.IdfPanel.layouts.list && !this.isInList())
    return false;
  //
  if (this.dataType === Client.IdfField.dataTypes.BLOB)
    return false;
  //
  // Since static field has just one field value, check that value
  row = this.isStatic() ? 1 : row;
  //
  let fieldValue = this.getValueByIndex(row);
  if (!fieldValue?.isVisible(this.parent.layout))
    return false;
  //
  return true;
};


/**
 * Open filter popup
 */
Client.IdfField.prototype.openFilterPopup = function ()
{
  if (Client.mainFrame.isEditing())
    return;
  //
  // If I cannot use header or row qbe, don't open popup
  if (!this.canUseHeaderQbe() && !this.canUseRowQbe())
    return;
  //
  // If panel mode is LIST and I'm not shown in list mode, don't open popup
  if (this.parent.layout === Client.IdfPanel.layouts.list && !this.isShown())
    return;
  //
  // If panel mode is FORM and I'm not shown in form mode, don't open popup
  if (this.parent.layout === Client.IdfPanel.layouts.form && !this.isShown(true))
    return;
  //
  // Open filter popup
  new Client.IdfFilterPopup({id: "filter-popup", field: this}, this.view, this.view);
};


/**
 * Open combo
 */
Client.IdfField.prototype.openCombo = function ()
{
  // If panel mode is LIST and I'm not shown in list mode, don't open combo
  if (this.parent.layout === Client.IdfPanel.layouts.list && !this.isShown())
    return;
  //
  // If panel mode is FORM and I'm not shown in form mode, don't open combo
  if (this.parent.layout === Client.IdfPanel.layouts.form && !this.isShown(true))
    return;
  //
  // Get active row field value and open combo
  let activeValue = this.values[this.parent.getActiveRowIndex()];
  activeValue.openCombo();
};


/**
 * Handle function keys
 * @param {Object} event
 */
Client.IdfField.prototype.handleFunctionKeys = function (event)
{
  // If I have a command attached, I see if the key is for it
  let events = [];
  //
  let form = this.parent.layout === Client.IdfPanel.layouts.form;
  if (this.command && this.isEnabled(form) && this.isVisible(form) && !this.isStatic())
    events.push(...Client.eleMap[this.command].handleFunctionKeys(event, -1, -1));
  //
  return events;
};


/**
 * Create fake fields value to fill panel in the view editor
 */
Client.IdfField.prototype.createFakeFieldsValues = function ()
{
  let fieldsValues = [];
  //
  let limit = this.isStatic(true) ? 1 : Client.IdfPanel.maxReusableRows;
  //
  // Create values
  let customChildrenConf = this.customChildrenConf || [];
  //
  for (let i = 1; i <= limit; i++) {
    // Add custom children if any
    let childrenConf = [];
    for (let j = 0; j < customChildrenConf.length; j++) {
      let childConf = Object.assign({}, customChildrenConf[j]);
      childConf.id = this.id + ":" + i + ":el" + (j + 1);
      childConf._skipUpdate = true;
      childrenConf.push(childConf);
    }
    //
    let valueConfig = {
      id: this.id + ":" + i,
      c: "IdfFieldValue",
      index: i,
      text: this.getEditorText(i),
      customChildrenConf: childrenConf.length ? childrenConf : undefined
    };
    //
    valueConfig = this.createElementConfig(valueConfig);
    fieldsValues.push(valueConfig);
  }
  //
  return fieldsValues;
};


/**
 * Create index-th field value
 * @param {Integer} index
 * @param {Integer} baseIndex
 */
Client.IdfField.prototype.createFieldValue = function (index, baseIndex)
{
  let rowsGroup;
  if (this.parent.hasGroupedRows() && index !== 0) {
    rowsGroup = this.parent.getRowsGroupByIndex(index);
    //
    if (!rowsGroup)
      index = this.parent.groupedRowsRoot.groupedIndexToRealIndex(index);
  }
  //
  let id = (rowsGroup ? "rowsgroup:" : "") + (Client.mainFrame.isIDF ? "val:" + index + (this.id.replace("fld", "")) : this.id + ":" + index);
  if (Client.eleMap[id])
    return;
  //
  let baseFieldValue = this.getValueByIndex(baseIndex);
  let newFieldValue;
  //
  // If I have a base field value, I can clone it
  if (baseFieldValue)
    newFieldValue = baseFieldValue.clone({id, index, clientSide: true});
  else // Otherwise create a new field value
    newFieldValue = new Client.IdfFieldValue({id, index, class: "IdfFieldValue", clientSide: true, rowsGroup}, this, this.view);
  //
  this.elements.push(newFieldValue);
  //
  return newFieldValue;
};

/**
 * Get valueList for editor based on control type
 */
Client.IdfField.prototype.getEditorValueList = function ()
{
  if (this.valueList)
    return this.valueList;
  //
  let valueList = null;
  //
  switch (this.controlType) {
    case Client.IdfField.controlTypes.COMBO:
      valueList = {items: []};
      //
      let limit = this.isStatic(true) ? 1 : 9;
      //
      for (let i = 1; i <= limit; i++)
        valueList.items.push({name: this.listHeader + i, value: this.listHeader + i});
      break;

    case Client.IdfField.controlTypes.CHECK:
      valueList = {items: []};
      //
      valueList.items.push({name: "true", value: -1});
      valueList.items.push({name: "false", value: 0});
      break;

    case Client.IdfField.controlTypes.OPTION:
      valueList = {items: []};
      //
      for (let i = 1; i <= 2; i++)
        valueList.items.push({name: "option" + i, value: "option" + i});
      break;
  }
  //
  return valueList;
};


/**
 * Get text for editor based on data type
 * @param {Integer} index
 */
Client.IdfField.prototype.getEditorText = function (index)
{
  let text = "";
  //
  if (this.valueList?.items)
    text = this.valueList.items[Math.floor(Math.random() * this.valueList.items.length)].value;
  else if (Client.IdfField.isNumeric(this.dataType) && this.controlType !== Client.IdfField.controlTypes.COMBO && !this.valueList)
    text = this.dataType === Client.IdfField.dataTypes.INTEGER ? index : 1234;
  else if (Client.IdfField.isDateOrTime(this.dataType))
    text = new Date().toISOString();
  else if (this.dataType !== Client.IdfField.dataTypes.BLOB)
    text = this.isStatic() ? this.header : this.listHeader + index;
  //
  return text;
};


Client.IdfField.prototype.getEditorHilightObject = function ()
{
  if (this.parent.layout === Client.IdfPanel.layouts.list)
    return this.isInList() ? Client.eleMap[this.listContainerId].getRootObject() : Client.eleMap[this.outListContainerId].getRootObject();
  else
    return Client.eleMap[this.formContainerId].getRootObject();
};


Client.IdfField.prototype.reInit = function ()
{
  this.values = [];
  let widget = {children: []};
  //
  for (p in Client.IdfField.transPropMap) {
    if (this[Client.IdfField.transPropMap[p]] !== undefined)
      widget[Client.IdfField.transPropMap[p]] = this[Client.IdfField.transPropMap[p]];
  }
  for (p in Client.Widget.transPropMap) {
    if (this[Client.Widget.transPropMap[p]] !== undefined)
      widget[Client.Widget.transPropMap[p]] = this[Client.Widget.transPropMap[p]];
  }
  //
  this.close(true);
  Client.eleMap[this.id] = this;
  this.realizing = true;
  this.elements = [];
  this.children = [];
  this.realize(widget, this.parent, this.view);
  this.updateElement(widget);
  delete this.realizing;
};


/**
 * Insert new element
 * @param {Object} content - contains the element to insert and the id of the existing element. The new element is inserted before this element
 */
Client.IdfField.prototype.insertBefore = function (content)
{
  if (Client.mainFrame.isIDF)
    return Client.Element.prototype.insertBefore.call(this, content);
  //
  let customChildrenConf = this.customChildrenConf?.slice() || [];
  //
  if (!customChildrenConf.find(el => el.id === content.child.id)) {
    customChildrenConf.push(content.child);
    this.updateElement({customChildrenConf});
  }
  //
  for (let i = 1; i <= this.values.length; i++) {
    if (!this.values[i])
      continue;
    //
    this.values[i].insertBefore(content);
  }
};


/**
 * Remove a child from the element
 * @param {Object} content - an object with the id of the element to remove
 */
Client.IdfField.prototype.removeChild = function (content)
{
  if (Client.mainFrame.isIDF)
    return Client.Element.prototype.insertBefore.call(this, content);
  //
  let customChildrenConf = this.customChildrenConf?.slice() || [];
  //
  let childIndex = customChildrenConf.findIndex(el => el.id === content.id);
  if (childIndex === -1)
    return;
  //
  for (let i = 1; i <= this.values.length; i++) {
    if (!this.values[i])
      continue;
    //
    this.values[i].removeChild(content);
  }
  //
  customChildrenConf.splice(childIndex, 1);
  this.updateElement({customChildrenConf});
};


/**
 * Update field values templates
 * @param {Object} content
 */
Client.IdfField.prototype.updateTemplate = function (content)
{
  let customChildrenConf = this.customChildrenConf?.slice() || [];
  //
  let childIndex = customChildrenConf.findIndex(el => el.id === content.obj);
  if (childIndex === -1)
    return;
  //
  for (let i = 1; i <= this.values.length; i++) {
    if (!this.values[i])
      continue;
    //
    this.values[i].updateTemplate(content);
  }
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfField.prototype.close = function (firstLevel, triggerAnimation)
{
  // Clear values
  this.resetCache({});
  //
  Client.Widget.prototype.close.call(this, firstLevel, triggerAnimation);
  //
  if (this.isInList()) {
    this.parent.restoreRowSelectors();
    //
    this.parent.updateViewportListFields(this);
    //
    if (Client.eleMap[this.listContainerId])
      this.parent.intersectionObserver?.unobserve(Client.eleMap[this.listContainerId].getRootObject());
  }
};



Client.IdfField.prototype.getResizeTooltip = function (width, height)
{
  let myPanel = this.parent;
  let form = myPanel?.layout === Client.IdfPanel.layouts.form;
  //
  if (!this.panRectTtp) {
    let rt = Client.eleMap[form ? myPanel.formContainerConf.id : (this.group ? this.group.listContainerConf.id : myPanel.listContainerConf.id)]?.getRootObject();
    this.panRectTtp = {
      width: rt?.clientWidth || 0,
      height: rt?.clientHeight || 0
    };
  }
  //
  let ttp = "";
  if (width)
    ttp += "width: " + (this[form ? "formWidthPerc" : "listWidthPerc"] ? Math.round(width / this.panRectTtp.width * 100) + "%" : width);
  if (height)
    ttp += "height: " + (this[form ? "formHeightPerc" : "listHeightPerc"] ? Math.round(height / this.panRectTtp.height * 100) + "%" : height);
  //
  return ttp;
};


Client.IdfField.prototype.clearResizeTooltip = function ()
{
  delete this.panRectTtp;
};


Client.IdfField.prototype.getComboType = function ()
{
  if (this.smartLookup)
    return Client.IdfField.comboTypes.SMARTLOOKUP;
  else if (this.autoLookup)
    return Client.IdfField.comboTypes.AUTOLOOKUP;
  else if (this.hasValueSource)
    return Client.IdfField.comboTypes.NOAUTOLOOKUP;
};

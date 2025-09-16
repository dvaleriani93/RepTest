/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};
/**
 * @class Base class for widget object
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.Widget = function (widget, parent, view)
{
  // If no widget do nothing
  if (!widget)
    return;
  //
  if (!Client.Widget.ddOperationInited) {
    Client.Widget.initDDOperations();
    Client.Widget.ddOperationInited = true;
  }
  //
  if (widget.id === undefined)
    widget.id = Client.mainFrame.generateCounter() + "_";
  //
  this.realizing = true;
  //
  this.name = widget.name;
  this.id = widget.id;
  this.view = view;
  this.parent = parent;
  this.elements = [];
  this.mainObjects = [];
  //
  for (let p in widget) {
    if (widget[p]?.constructor === Array)
      this[p] = widget[p].slice();
    else if (widget[p]?.constructor === Object)
      this[p] = Object.assign({}, widget[p]);
    else
      this[p] = widget[p];
  }
  //
  // Add it to eleMap
  Client.eleMap[this.id] = this;
  //
  if (!this.cloned) {
    // Realize widget
    this.realize(widget, parent, view);
    //
    // Update its properties
    this.updateElement(widget);
  }
  //
  delete this.realizing;
};

// Make Client.Widget extend Client.Element
Client.Widget.prototype = new Client.Element();


Client.Widget.transPropMap = {
  cap: "caption",
  wid: "width",
  hei: "height",
  maw: "maxWidth",
  mah: "maxHeight",
  sty: "visualStyle",
  bdg: "badge",
  cln: "className",
  tip: "tooltip",
  hks: "handledKeys",
  clk: "clickEventDef"
};


Client.Widget.transXmlNodeMap = {
  start: "start",
  open: "open",
  wep: "IdfWebEntryPoint",
  cmh: "IdfCommandList",
  cms: "IdfCommand",
  cmd: "IdfCommand",
  vis: "IdfVisualStyle",
  vsl: "IdfVisualStyleList",
  tmh: "IdfTimerList",
  tim: "IdfTimer",
  frm: "IdfView",
  suf: "IdfFrame",
  wfr: "IdfFrame",
  bbr: "IdfButtonBar",
  pan: "IdfPanel",
  ppg: "IdfPage",
  grp: "IdfGroup",
  lsg: "IdfRowsGroup",
  fld: "IdfField",
  fvl: "IdfField",
  val: "IdfFieldValue",
  tbv: "IdfTabbedView",
  tab: "IdfTab",
  gra: "IdfChart",
  tre: "IdfTree",
  trn: "IdfTreeNode",
  book: "IdfBook",
  pag: "IdfBookPage",
  sec: "IdfSection",
  box: "IdfBox",
  spn: "IdfSpan",
  msg: "IdfMessage",
  cse: "IdfCustomElement",
  inh: "IdfIndicatorList",
  ind: "IdfIndicator"
};


Client.Widget.themes = {
  ZEN: "zen",
  CUSTOM: "custom"
};

Client.Widget.transUpdatingPropMap = {
  tooltip: "tooltipContent"
};

Client.Widget.keyClasses = {
  ENTERESC: 1, // Enter/Esc keys
  MOVEMENT: 2, // Movement keys (cursor keys + pgdown / pgup + end / home + del / cancel + tab)
  ALPHANUMERICAL: 4 // Alphanumeric keys (numbers + letters)
};

Client.Widget.transformOperation = {
  NONE: 0,
  DRAG: 1,
  MOVE: 2,
  MOVEX: 12,
  MOVEY: 13,
  RESIZETOP: 3,
  RESIZELEFT: 4,
  RESIZERIGHT: 5,
  RESIZEBOTTOM: 6,
  RESIZETOPLEFT: 7,
  RESIZETOPRIGHT: 8,
  RESIZEBOTTOMLEFT: 10,
  RESIZEBOTTOMRIGHT: 11
};


Client.Widget.msgTypes = {
  ALERT: 0,
  CONFIRM: 1,
  INPUT: 2
};

Client.Widget.visRegEx = /^vis\d+.*/;

/**
 * Convert properties values
 * @param {Object} props
 */
Client.Widget.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.Widget.transPropMap.wid:
      case Client.Widget.transPropMap.hei:
      case Client.Widget.transPropMap.maw:
      case Client.Widget.transPropMap.mah:

      // Common event definitions
      case Client.Widget.transPropMap.sty:
      case Client.Widget.transPropMap.hks:
      case Client.Widget.transPropMap.clk:
        props[p] = parseInt(props[p]);
        break;
    }
  }
};


/**
 * Create view/element configuration from xml
 * @param {XmlNode} xml
 */
Client.Widget.createConfigFromXml = function (xml)
{
  // If I don't have a class name, do nothing
  let className = Client.Widget.transXmlNodeMap[xml.nodeName];
  if (!className)
    return;
  //
  // Create widget configuration
  let widgetConfig = {};
  let widgetChildren = [];
  //
  // Add node attributes as configuration properties
  let attrList = xml.attributes;
  for (let i = 0; i < attrList.length; i++) {
    let attrNode = attrList[i];
    widgetConfig[attrNode.nodeName] = attrNode.nodeValue;
  }
  //
  // If this is the app start or an open view, create view configuration
  if (["start", "open"].includes(className)) {
    // "start" node doesn't have an id, so I have to create it.
    // "open" node has the same id as its first child (i.e. "frm" node). So I add a prefix to distinguish the view from its first child
    widgetConfig.id = className === "start" ? "MainView" : "view-" + widgetConfig.id;
    widgetConfig.type = "view";
    widgetConfig.elements = widgetChildren;
  }
  else { // Otherwise create a child configuration
    widgetConfig.c = className;
    widgetConfig.children = widgetChildren;
  }
  //
  for (let i = 0; i < xml.childNodes.length; i++) {
    let child = xml.childNodes[i];
    let childNodeName = child.nodeName;
    //
    // A value list node has usually "vls" as name. But when it's child of a span node, it has "val" as name!
    // This is a problem because field's values have "val" as name too. So change "val" to "vls" if value list node parent is a span node
    if (childNodeName === "val" && child.parentNode.nodeName === "spn")
      childNodeName = "vls";
    //
    // Skip #text nodes
    if (childNodeName === "#text")
      continue;
    else if (childNodeName === "vls" || childNodeName === "vnl") // Create value list and add it as widget property
      widgetConfig.valueList = Client.Widget.createValueList(child);
    else { // Otherwise create child node config
      let childConfig = Client.Widget.createConfigFromXml(child);
      //
      if (childConfig)
        widgetChildren.push(childConfig);
    }
  }
  //
  if (Client[className]) {
    // If a class define a specific configuration, get it and add it to main configuration
    if (Client[className].createConfigFromXml) {
      let specificConfig = Client[className].createConfigFromXml(xml);
      for (let prop in specificConfig)
        widgetConfig[prop] = specificConfig[prop];
    }
    //
    // Translate specific configuration properties names
    Client.mainFrame.translateProperties(widgetConfig, Client[className].transPropMap || {});
    //
    // Translate base configuration properties names
    Client.mainFrame.translateProperties(widgetConfig, Client.Widget.transPropMap);
    //
    // Convert specific configuration properties values
    if (Client[className].convertPropValues)
      Client[className].convertPropValues(widgetConfig);
    //
    // Convert base configuration properties values
    Client.Widget.convertPropValues(widgetConfig);
  }
  //
  return widgetConfig;
};


/**
 * Create element configuration
 * @param {Object} params
 */
Client.Widget.prototype.createElementConfig = function (params)
{
  let el = {};
  //
  // I need to add a special charachter in order to avoid collisions with ids generated server side
  el.id = params.id || Client.mainFrame.generateCounter() + "_";
  //
  if (!Client.mainFrame.isIDF && !params.id)
    el.id = this.id + "_" + el.id;
  //
  el.parentWidget = this;
  el.children = [];
  //
  if (params.children) {
    for (let i = 0; i < params.children.length; i++)
      el.children.push(this.createElementConfig(params.children[i]));
    //
    delete params.children;
  }
  //
  for (let p in params)
    el[p] = params[p];
  //
  return el;
};


Object.defineProperty(Client.Widget.prototype, "parentIdfView", {
  get: function () {
    if (this.parent instanceof Client.IdfView)
      return this.parent;
    else if (this.parent instanceof Client.Widget)
      return this.parent.parentIdfView;
    else
      return this.parent?.parentWidget?.parentIdfView;
  }
});


Object.defineProperty(Client.Widget.prototype, "parentIdfFrame", {
  get: function () {
    if (this.parent instanceof Client.IdfFrame)
      return this.parent;
    else if (this.parent instanceof Client.Widget)
      return this.parent.parentIdfFrame;
    else
      return this.parent?.parentWidget?.parentIdfFrame;
  }
});


Object.defineProperty(Client.Widget.prototype, "parentWidget", {
  get: function () {
    if (this.parent instanceof Client.Widget)
      return this.parent;
    else
      return this.parent?.parentWidget;
  }
});


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.Widget.prototype.realize = function (widget, parent, view)
{
};


/**
 * Define updateElement method
 * @param {Object} props
 */
Client.Widget.prototype.updateElement = function (props)
{
  if (!this.realizing) {
    let p = Object.keys(props);
    for (let i = 0; i < p.length; i++) {
      let propName = p[i];
      if (propName === "id" || propName === "subFrameConf" || propName === "config")
        continue;
      //
      if (Client.Widget.isEqual(this[propName], props[propName])) {
        delete props[propName];
        continue;
      }
    }
  }
  //
  // Set common properties
  if (props.visualStyle !== undefined) {
    this.visualStyle = props.visualStyle;
    //
    // If I have to skip base applyVisualStyle, remember I have to call it on extended object
    if (props.skipWidgetApplyVisualStyle) {
      delete props.skipWidgetApplyVisualStyle;
      props.applyVisualStyle = true;
    }
    else if (this.applyVisualStyle) // Otherwise apply visual style immediately
      this.applyVisualStyle();
  }
  //
  if (props.caption !== undefined)
    this.caption = props.caption;
  //
  if (props.badge !== undefined)
    this.badge = props.badge;
  //
  if (props.tooltip !== undefined)
    this.tooltip = props.tooltip;
  //
  if (props.valueList !== undefined) {
    if (props.valueList && !props.valueList.items)
      props.valueList = {items: props.valueList.map(i => {
          return {value: i.v, name: i.n};
        })};
  }
  //
  if (props.handledKeys !== undefined)
    this.setHandledKeys(props.handledKeys);
  //
  // Set common event definitions
  if (props.clickEventDef !== undefined)
    this.clickEventDef = props.clickEventDef;
};


/**
 * Update className
 * @param {Object} options
 */
Client.Widget.prototype.updateClassName = function (options)
{
  let el = options.el || this.getRootObject(true);
  let oldClassName = (options.oldClassName || "").split(" ");
  let newClassName = (options.newClassName || "").split(" ");
  //
  let classesToRemove = oldClassName.filter(c => !newClassName.includes(c));
  classesToRemove.forEach(c => Client.Widget.updateElementClassName(el, c, true));
  //
  let classesToAdd = newClassName.filter(c => !oldClassName.includes(c));
  classesToAdd.forEach(c => Client.Widget.updateElementClassName(el, c));
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.Widget.prototype.onEvent = function (event)
{
  let events = [];
  //
  switch (event.id) {
    case "onKey":
      events.push(...this.handleKeyPress(event));
      break;
  }
  //
  return events;
};


/**
 * Return a copy of the element
 * @param {Object} config
 * @param {Client.Element} parent
 * @param {Map} referencesMap
 */
Client.Widget.prototype.clone = function (config, parent, referencesMap)
{
  let widget = Client.Element.prototype.clone.call(this, config, parent, referencesMap);
  //
  if (this.mainObjects) {
    widget.mainObjects = [];
    for (let obj of this.mainObjects) {
      let domObj = referencesMap.get(obj.domObj);
      let newObj = Client.eleMap[domObj.id];
      if (!newObj?.cloned || newObj === obj)
        newObj = obj.clone(undefined, parent, referencesMap);
      newObj.parentWidget = widget;
      widget.mainObjects.push(newObj);
    }
  }
  //
  return widget;
};


/**
 * Handle a keyPress
 * @param {Object} event
 */
Client.Widget.prototype.handleKeyPress = function (event)
{
  let events = [];
  if (event.content.srcEvent.justHandled)
    return events;
  //
  let eventType = event.content.type;
  let key = event.content.keyCode;
  //
  // Determine the event class to which the pressed button belongs
  let keyClass = -1;
  if (key === 13) {  // Enter
    // The Enter key comes to me from both the KeyDown and the KeyPress;
    // I only care when it comes from KeyDown
    if (eventType === "keyup")
      keyClass = Client.Widget.keyClasses.ENTERESC;
  }
  else if (key === 27 || (key >= 112 && key <= 123)) // Esc, F1-F12
    keyClass = Client.Widget.keyClasses.ENTERESC;
  else if (key === 8 || key === 9 || key === 46 || (key >= 33 && key <= 40))  // BackSpace, Tab, Canc, PageUp, PageDown, End, Home, Left, Top, Right, Bottom
    keyClass = Client.Widget.keyClasses.MOVEMENT;
  else if (eventType === "keyup")
    keyClass = Client.Widget.keyClasses.ALPHANUMERICAL;
  //
  if (keyClass === -1)
    return events;
  //
  // If I have found anyone interested then I send the event
  if (this.handledKeys & keyClass) {
    event.content.srcEvent.justHandled = true;
    //
    if (Client.mainFrame.isIDF)
      events.push({
        id: "keypress",
        def: Client.IdfMessagesPump.eventTypes.ACTIVE, // TODO: RD3_ClientParams.KeyPressEventType
        delayCopies: true,
        content: {
          oid: this.id,
          obn: key,
          par1: keyClass
        }
      });
    else {
      // Nothing to do: use onKey event
    }
  }
  //
  return events;
};


/**
 * Get widget node name by its class name
 * @param {Number} value
 */
Client.Widget.prototype.setHandledKeys = function (value)
{
  this.handledKeys = value;
  if (!this.handledKeys)
    return;
  //
  this.mainObjects.forEach(mainObj => {
    mainObj.updateElement({tabIndex: 0});
    mainObj.enableKeyEvent({inputs: true, type: "down"});
    mainObj.enableKeyEvent({inputs: true, type: "up"});
  });
};


/**
 * Get theme
 * @param {String} themeName
 * @param {String} themeUrl
 */
Client.Widget.getThemeUrl = function (themeName, themeUrl)
{
  let url;
  //
  // If the theme is custom, get its url
  if (themeName === Client.Widget.themes.CUSTOM)
    url = themeUrl;
  else if (themeName) // Otherwise get local theme url using its name
    url = (Client.mainFrame.isIDF ? "fluid/" : "") + "objects/fluid/themes/" + themeName + ".css";
  //
  return url;
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.Widget.prototype.getRootObject = function (el)
{
  return el ? this.mainObjects[0] : this.mainObjects[0]?.domObj;
};


/**
 * Define findElementToActivate method
 */
Client.Widget.prototype.findElementToActivate = function ()
{
};


/**
 * Get root object elements by type
 * @param {Class} type
 */
Client.Widget.prototype.getElements = function (type)
{
  return this.getRootObject(true)?.getElements(type) || [];
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.Widget.prototype.createChildren = function (el)
{
  if (!el.children)
    return;
  //
  for (let i = 0; i < el.children.length; i++) {
    let child = Client.eleMap[el.children[i].id];
    //
    // If child does not exist yet, create it and push it into parent elements array
    if (!child) {
      let prevId = el.children[i].previd;
      delete el.children[i].previd;
      delete el.children[i].parid;
      child = this.view.createElement(el.children[i], this, this.view);
      //
      // During the differential update of the books, children are added in specific positions
      if (prevId) {
        let nextIdx = this.elements.findIndex(e => e.id === prevId);
        let nextEl = this.elements[nextIdx];
        this.getRootObject(true).insertBefore({child: child.getRootObject(true), sib: nextEl.getRootObject(true).id});
        this.elements.splice(nextIdx, 0, child);
      }
      else
        this.elements.push(child);
    }
    else {
      // Otherwise recursively create its children and then update it
      child.createChildren(el.children[i]);
      child.updateElement(el.children[i]);
    }
  }
};


/**
 * Append a child DOM Object to root object DOM
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.Widget.prototype.appendChildObject = function (child, domObj)
{
  let rootObject = this.getRootObject(true);
  //
  if (rootObject instanceof Client.IonContent)
    rootObject.scrollContent.appendChild(domObj);
  else
    rootObject.appendChildObject(child, domObj);
  //
  rootObject.elements.push(child);
  child.parent = rootObject;
};


/**
 * Remove a child from the element
 * @param {Object} content - an object with the id of the element to remove
 */
Client.Widget.prototype.removeChild = function (content)
{
  // I try to remove the child's rootObject from my rootObject
  // if the widget is simple is ok, otherwise element will call its close that should do the work
  try {
    this.getRootObject(true).removeChild(Client.eleMap[content.id].getRootObject(true));
  }
  catch (ex) {

  }
  //
  // I call the base method
  Client.Element.prototype.removeChild.call(this, content);
};


/**
 * Remove this widget from his parent
 * - used by the DEL command
 */
Client.Widget.prototype.removeFromParent = function ()
{
  this.parent?.removeChild(this);
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.Widget.prototype.close = function (firstLevel, triggerAnimation)
{
  // Tell my parent
  this.parent?.onRemoveChildObject(this);
  //
  // Close children widgets
  this.elements.slice().forEach(e => e.close(firstLevel));
  //
  // Close each widget main object
  while (this.mainObjects.length) {
    this.mainObjects[0].close(firstLevel);
    this.mainObjects.splice(0, 1);
  }
  //
  delete Client.eleMap[this.id];
};


/**
 * Return widget visual style
 */
Client.Widget.prototype.getVisualStyle = function ()
{
  return this.visualStyle;
};


/**
 * Add visual style classes to element domObj
 * @param {Object} el
 * @param {Object} options
 */
Client.Widget.prototype.addVisualStyleClasses = function (el, options)
{
  // If no element, do nothing
  if (!el)
    return;
  //
  options = options || {};
  //
  if (options.alignment !== undefined) {
    // Remove alignment class
    ["left", "center", "right", "justify"].forEach(al => {
      let alClass = al + "-aligned";
      //
      // Remove old alignment class
      if (options.alignment !== al)
        Client.Widget.updateElementClassName(el, alClass, true);
      else if (options.alignment) // Add the new one (if any)
        Client.Widget.updateElementClassName(el, alClass);
    });
  }
  //
  if (options.objType === "field") {
    if (options.list)
      Client.Widget.updateElementClassName(el, "panel-active-row", !options.activeRow || options.qbe);
    //
    Client.Widget.updateElementClassName(el, "panel-qbe-row", !options.qbe);
    Client.Widget.updateElementClassName(el, "field-disabled-value", !options.readOnly);
  }
  else if (options.objType === "rowsgroup") {
    Client.Widget.updateElementClassName(el, "panel-active-row", true);
    Client.Widget.updateElementClassName(el, "field-disabled-value", true);
  }
  //
  // Get old visual style classes
  let classList = (el.className || "").split(" ");
  let oldVisualStyleClasses = classList.filter(c => Client.Widget.visRegEx.test(c));
  //
  // If there is a specific visual style to use, use that.
  // Otherwise use widget visual style
  let visIndex = options.visualStyleIndex || this.getVisualStyle();
  delete options.visualStyleIndex;
  //
  let vis = Client.IdfVisualStyle.getByIndex(visIndex);
  //
  // If there isn't a visual style, do nothing
  if (!vis)
    return;
  //
  // Get new visual style css classes
  let visClasses = (vis.getCssClasses(options) || "").trim();
  let newVisualStyleClasses = visClasses.split(" ");
  //
  let classesToRemove = oldVisualStyleClasses.filter(c => !newVisualStyleClasses.includes(c)).join(" ");
  let classesToAdd = newVisualStyleClasses.filter(c => !classList.includes(c)).join(" ");
  //
  Client.Widget.updateElementClassName(el, classesToRemove, true);
  Client.Widget.updateElementClassName(el, classesToAdd);
};


/**
 * Create a tooltip with given title and content
 * @param {String} title
 * @param {String} content
 * @param {Number} fknum
 * @param {String} code
 */
Client.Widget.getHTMLTooltip = function (title, content, fknum, code)
{
  if (!title && !content)
    return;
  //
  let html = "<div>";
  if (title)
    html += "<div class='tooltip-title'>" + Client.Widget.getHTMLForCaption(title) + "</div>";
  //
  if (content)
    html += "<div class='tooltip-content'>" + Client.Widget.getHTMLForCaption(content + Client.Widget.getFKTip(fknum, code)) + "</div>";
  //
  html += "</div>";
  //
  return {content: html};
};


Client.Widget.getFKTip = function (fknum, code)
{
  if (!fknum && !code)
    return "";
  //
  let s = "";
  if (fknum) {
    if (fknum > 24) {
      s += "Ctrl+";
      fknum -= 24;
    }
    if (fknum > 12) {
      s += "Shift+";
      fknum -= 12;
    }
    s += "F" + fknum;
  }
  else
    s += code;
  //
  return " (" + s + ")";
};


/**
 * Get widget node name by its class name
 */
Client.Widget.prototype.getXMLNodeByClass = function ()
{
  // cms and cmd nodes are both translated as IdfCommand. So in this case use type properties
  if (this.class === "IdfCommand")
    return this.type;
  //
  let nodesNames = Object.keys(Client.Widget.transXmlNodeMap);
  //
  for (let i = 0; i < nodesNames.length; i++) {
    let className = Client.Widget.transXmlNodeMap[nodesNames[i]];
    if (className === this.class)
      return nodesNames[i];
  }
};


/**
 * Return the target to use for opening a popup on this widget
 * @returns {DomNode}
 */
Client.Widget.prototype.getPopupTarget = function ()
{
  return this.getRootObject();
};


/**
 * Create value list object from vls/vnl node
 * @param {XmlNode} node
 */
Client.Widget.createValueList = function (node)
{
  // Define translate map for value list
  let transPropMap = {hdr: "headers", dcc: "decodeColumn", typ: "type", popup: "popup"};
  //
  // Initialize value list
  let valueList = {items: [], qbe: node.nodeName === "vnl"};
  //
  // Get value list node attributes
  let attributes = node.attributes;
  for (let i = 0; i < attributes.length; i++) {
    // Translate property name
    let propName = transPropMap[attributes[i].nodeName];
    //
    // Get property value
    let propValue = attributes[i].nodeValue;
    //
    // Convert property value if needed
    if (propName === "decodeColumn" || propName === "type")
      propValue = parseInt(attributes[i].nodeValue);
    //
    // Set property on value list
    valueList[propName] = propValue;
  }
  //
  // Define translate map for value list items
  transPropMap = {txt: "name", val: "value", img: "image", tip: "tooltip", ena: "enabled", gru: "group", rval: "rValue", lkes: "lkeSel"};
  //
  for (let i = 0; i < node.childNodes.length; i++) {
    let child = node.childNodes[i];
    //
    // If child node is not a value list item, continue
    if (child.nodeName !== "vli")
      continue;
    //
    let valueListItem = {};
    //
    attributes = child.attributes;
    for (let j = 0; j < attributes.length; j++) {
      // Translate property name
      let propName = transPropMap[attributes[j].nodeName];
      //
      // Get property value
      let propValue = attributes[j].nodeValue;
      //
      // Convert property value if needed
      if (propName === "lkeSel")
        propValue = attributes[j].nodeValue === "-1";
      //
      // Set property on value list item
      valueListItem[propName] = propValue;
    }
    //
    // Server sends me "enabled" property on value list item just in case of "false".
    // So if I don't have "enabled" property, I have to consider it as "true"
    valueListItem.enabled = (valueListItem.enabled === "0" ? false : true);
    //
    valueList.items.push(valueListItem);
  }
  //
  return valueList;
};


/**
 * Return true if given class is a frame class
 * @param {String} cls
 */
Client.Widget.isFrameClass = function (cls)
{
  return [
    Client.Widget.transXmlNodeMap.wfr,
    Client.Widget.transXmlNodeMap.book,
    Client.Widget.transXmlNodeMap.bbr,
    Client.Widget.transXmlNodeMap.gra,
    Client.Widget.transXmlNodeMap.pan,
    Client.Widget.transXmlNodeMap.tbv,
    Client.Widget.transXmlNodeMap.tre
  ].includes(cls);
};


/**
 * Return true if given class is a field class
 * @param {String} cls
 */
Client.Widget.isFieldClass = function (cls)
{
  return [
    Client.Widget.transXmlNodeMap.fld,
    Client.Widget.transXmlNodeMap.fvl
  ].includes(cls);
};


/**
 * Return true if given string contains in IonIcon string or an image
 * @param {String} image
 */
Client.Widget.isIconImage = function (image)
{
  return !image?.includes(".");
};


/**
 * Set an image on the element
 * @param {Object} options
 *                 - image
 *                 - el
 *                 - innerObj: if true the background image is set on the firstChild of the element, for complex ionic elements
 *                 - color
 */
Client.Widget.setIconImage = function (options)
{
  let {image, el, innerObj, color} = options;
  let objectConf = {};
  //
  // Since icon can be also expressed as "{{icon-...}}", try to extract it from given image
  let data = Client.Widget.extractCaptionData(image);
  image = data?.icon || image;
  //
  let isIcon = Client.Widget.isIconImage(image);
  let backgroundImage = "";
  if (isIcon) {
    objectConf.icon = image;
    if (color !== undefined)
      objectConf.color = color;
  }
  else {
    // Although I have to set the background image, I set an icon otherwise icon object doesn't have dimensions
    objectConf.icon = "trash";
    //
    if (image)
      backgroundImage = `url(${encodeURI((Client.mainFrame.isIDF ? "images/" : "") + image)})`;
  }
  //
  // Update element
  Client.Widget.updateObject(el, objectConf);
  if (isIcon && el instanceof Client.IonButton && color && image) {
    // The IonButton doesn't apply the color of the icon to the icon but only to himself, so we need to do it ourselves
    el.iconObj.setAttribute(color, "");
  }
  //
  // Apply background image on innerObj
  innerObj = innerObj || el.iconObj;
  //
  if (innerObj && el.lastInnerImage !== backgroundImage) {
    innerObj.style.backgroundImage = backgroundImage;
    el.lastInnerImage = backgroundImage;
  }
  //
  // Add/remove "image" class base on image type (real image or icon)
  if (el instanceof Client.IonTab) {
    if (isIcon)
      el.linkObj.classList.remove("image");
    else
      el.linkObj.classList.add("image");
  }
  else
    Client.Widget.updateElementClassName(el, "image", isIcon);
};


/**
 * Extract data from caption (caption, icon, iconColor)
 * @param {Object} options
 */
Client.Widget.getIconString = function (options)
{
  let {icon, format} = options;
  //
  if (format === "combo") {
    let prefix = "ion:";
    if (icon.startsWith("fa "))
      prefix = "fai:";
    else if (icon.startsWith("icon-vela "))
      prefix = "vel:";
    //
    icon = prefix + icon;
  }
  else {
    if (icon.startsWith("fa-"))
      icon = "fa " + icon;
    else if (icon.startsWith("vela-"))
      icon = "icon-vela " + icon.replace("vela", "icon");
    else
      icon = format === "html" ? `icon-${Client.Ionic.platform} ion-${Client.Ionic.platform}-${icon}` : icon;
  }
  //
  return icon;
};


/**
 * Extract data from caption (caption, icon, iconColor)
 * @param {String} caption
 *
 * @returns {Object} { caption, icon, iconColor }
 */
Client.Widget.extractCaptionData = function (caption)
{
  caption = (caption || "").toString();
  //
  // If there isn't an icon inside caption, caption data contain just the caption
  let icon = "";
  let color = "";
  if (caption.includes("{{icon-")) {
    // Extract icon from caption
    icon = caption.substring(caption.indexOf("{{") + 7, caption.indexOf("}}"));
    caption = caption.replace("{{icon-" + icon + "}}", "").trim();
    //
    icon = Client.Widget.getIconString({icon});
    //
    // Extract icon color if any
    if (icon.includes("|")) {
      color = icon.substring(icon.indexOf("|") + 1);
      icon = icon.substring(0, icon.indexOf("|"));
    }
  }
  //
  return {caption, icon, color};
};


/**
 * Extract data from classname (class & grid)
 * @param {String} className
 *
 * @returns {Object} { className, gridClass }
 */
Client.Widget.extractGridClasses = function (className)
{
  // If there isn't a gridclass inside className, className data contain just the className
  if (!(className.includes("{{") && className.includes("}}")))
    return {className, gridClass: ""};
  //
  // Extract gridclass from caption
  let gridClass = className.substring(className.indexOf("{{") + 2, className.indexOf("}}"));
  className = className.replace("{{" + gridClass + "}}", "").trim();
  //
  if (gridClass.indexOf("col-xs-") >= 0)
    gridClass = "col-xs-12";
  else if (gridClass.indexOf("col-sm-") >= 0)
    gridClass = "col-sm-12";
  else if (gridClass.indexOf("col-md-") >= 0)
    gridClass = "col-md-12";
  else if (gridClass.indexOf("col-lg-") >= 0)
    gridClass = "col-lg-12";
  //
  return {className, gridClass};
};


/**
 * Return an ionicon HTML
 * @param {String} text
 */
Client.Widget.getHTMLForCaption = function (text)
{
  let txt = text || "";
  //
  while (txt.indexOf && txt.indexOf("{{icon-") != -1) {
    let begin = txt.indexOf("{{");
    let end = txt.indexOf("}}", begin + 2);
    //
    if (end < 0)
      break;
    //
    let icon = txt.substring(begin + 7, end);
    let color = "";
    if (icon.includes("|")) {
      color = icon.substring(icon.indexOf("|") + 1);
      icon = icon.substring(0, icon.indexOf("|"));
    }
    //
    icon = Client.Widget.getIconString({icon, format: "html"});
    //
    txt = txt.substring(0, begin) + `<ion-icon class='${icon}'${color ? " " + color : ""}></ion-icon>` + txt.substring(end + 2);
  }
  //
  return txt;
};


Client.Widget.prototype.getHTMLIcon = function (text, skipCaption)
{
  // If value contains an icon, create an ion-button containing that icon
  let {caption, icon, color} = Client.Widget.extractCaptionData(text);
  if (!icon)
    return text;
  //
  let rootObject = this.getRootObject(true);
  if (!rootObject)
    rootObject = this.parentIdfFrame.getRootObject(true);
  //
  // Create an ionButton element
  let ionButtonConf = this.createElementConfig({c: "IonButton", className: "generic-btn field-value-btn", visible: false});
  let ionButton = rootObject.insertBefore({child: ionButtonConf});
  rootObject.removeChild(ionButtonConf);
  ionButton.updateElement({visible: true});
  //
  // Set its icon
  Client.Widget.setIconImage({image: icon, el: ionButton, color: (color || "primary")});
  //
  // Get its outer HTML
  return ionButton.getRootObject().outerHTML + (caption && !skipCaption ? " " + caption : "");
};


/**
 * Check if given values are the same
 * @param {String} oldValue
 * @param {String} newValue
 */
Client.Widget.isEqual = function (oldValue, newValue)
{
  let equals = false;
  if (newValue && typeof newValue === "object" && Object.getPrototypeOf(newValue) === Object.prototype)
    equals = JSON.stringify(oldValue) === JSON.stringify(newValue);
  else
    equals = oldValue === newValue;
  //
  return equals;
};


/**
 * Add css class
 * @param {Element} el
 * @param {String} className
 * @param {Boolean} remove
 */
Client.Widget.updateElementClassName = function (el, className, remove)
{
  if (!el || !className)
    return;
  //
  let update;
  //
  // Get class list
  let rootObject = el.getRootObject();
  let classList = (el.className || rootObject.className).trim().split(" ");
  //
  // Split given css class string and add/remove each class
  className = className.trim().split(" ");
  className.forEach(c => {
    let exists = classList.includes(c);
    if (remove && exists) {
      classList.splice(classList.indexOf(c), 1);
      update = true;
    }
    else if (!remove && !exists) {
      classList.push(c);
      update = true;
    }
  });
  //
  // Update element className
  if (update)
    Client.Widget.updateObject(el, {className: classList.join(" ").trim()});
};


/**
 * Update given object purging properties that are not changed
 * @param {Element} obj
 * @param {Object} props
 */
Client.Widget.updateObject = function (obj, props)
{
  if (!obj)
    return;
  //
  props = props || {};
  //
  let newValues = {};
  let names = Object.keys(props);
  let updateCount = names.length;
  //
  for (let i = 0; i < names.length; i++) {
    let realName = names[i];
    let n = Client.Widget.transUpdatingPropMap[realName] || realName;
    //
    // Skip properties which new value is same as old value
    if (Client.Widget.isEqual(obj[n], props[realName])) {
      delete props[realName];
      updateCount--;
      continue;
    }
    else
      newValues[n] = props[realName];
  }
  //
  // If there are no properties to update, do nothing
  if (!updateCount)
    return;
  //
  // Update object properties
  obj.updateElement(props);
  //
  // Some properties are just applied on dom, but I need to save them on the object
  // in order to make Client.Widget.updateObject works properly
  for (let p in newValues)
    obj[p] = newValues[p];
};


/**
 * Update given object style
 * @param {Element} el
 * @param {Object} oldStyle
 * @param {Object} newStyle
 */
Client.Widget.updateStyle = function (el, oldStyle, newStyle)
{
  if (!oldStyle || !newStyle)
    return;
  //
  let styleToApply = {};
  for (let p in newStyle) {
    if (oldStyle[p] !== newStyle[p]) {
      oldStyle[p] = newStyle[p];
      styleToApply[p] = newStyle[p];
    }
  }
  //
  if (Object.keys(styleToApply).length)
    el?.updateElement({style: styleToApply});
};


/**
 * Update a custom style (for IDC)
 * @param {Object} options
 */
Client.Widget.updateCustomStyle = function (options)
{
  let styleToUpdate = options?.styleToUpdate;
  let newStyle = options?.newStyle;
  //
  newStyle = newStyle || {};
  if (typeof newStyle === "string")
    newStyle = JSON.parse(newStyle);
  //
  let isEditing = Client.mainFrame.isEditing();
  for (p in styleToUpdate) {
    if (isEditing)
      styleToUpdate[p] = "";
    else
      newStyle[p] = newStyle[p] || "";
  }
  //
  Client.Widget.updateStyle(undefined, styleToUpdate, newStyle);
};


Client.Widget.prototype.saveScrollbarPosition = function (restore)
{
  if (!restore) {
    this.scrolledElements = [];
    this.getRootObject()?.querySelectorAll("*").forEach(e => {
      if (e.scrollTop || e.scrollLeft)
        this.scrolledElements.push({e, scrollTop: e.scrollTop, scrollLeft: e.scrollLeft});
    });
  }
  else {
    this.scrolledElements.forEach(obj => {
      obj.e.scrollTop = obj.scrollTop;
      obj.e.scrollLeft = obj.scrollLeft;
    });
    delete this.scrolledElements;
  }
};


/**
 *
 */
Client.Widget.initDDOperations = function ()
{
  document.addEventListener("touchmove", Client.Widget.ddMouseMove);
  document.addEventListener("mousemove", Client.Widget.ddMouseMove);
  document.addEventListener("touchstart", Client.Widget.ddMouseDown);
  document.addEventListener("mousedown", Client.Widget.ddMouseDown);
  document.addEventListener("touchend", Client.Widget.ddMouseUp);
  document.addEventListener("mouseup", Client.Widget.ddMouseUp);
  document.addEventListener("touchcancel", Client.Widget.ddClearOperation);
  //document.addEventListener("mouseleave", Client.Widget.ddClearPointer);
  document.addEventListener("keydown", Client.Widget.globalKeyDown);
  document.addEventListener("selectionchange", Client.Widget.onSelectionChange);
};


/**
 *
 * @param {MouseEvent/Touchevent} ev
 * @param {boxRect} offsetrect : value passed when moving on the welcome page, we need to add this value to calculate the absolute coordinates
 *                               related to the entire window
 */
Client.Widget.ddMouseDown = function (ev, offsetrect)
{
  let startx = (ev.targetTouches?.[0]?.clientX ?? ev.clientX) + (offsetrect ? offsetrect.x : 0);
  let starty = (ev.targetTouches?.[0]?.clientY ?? ev.clientY) + (offsetrect ? offsetrect.y : 0);
  let {el, widget} = Client.Widget.getDDTargetWidget(ev);
  //
  // Cannot detect a widget linked to the object
  if (!widget)
    return;
  //
  // DETECTION PHASE
  let operation = widget.getSupportedTransformOperation(startx, starty, el);
  let startDomObj = widget.getTransformOperationTargetObj(operation, el);
  if (!startDomObj)
    startDomObj = ev.target;
  //
  if (operation) {
    let stw = widget.getTransformOperationTargetWidget(operation, el);
    let unitH = stw.getGritUnit();
    let unitV = stw.getGritUnit(true);
    //
    Client.Widget.ddOperation = {
      startx,
      starty,
      operation,
      startWidget: stw,
      el,
      startDomObj,
      startRect: startDomObj.getBoundingClientRect(),
      started: false, // we have detected the operation, but it must be executed ONLY if we have moved over the threshold
      unit: unitH,
      unitV: unitV
    };
    //
    ev.preventDefault();
  }
};


/**
 *
 * @param {MouseEvent/Touchevent} ev
 * @param {boxRect} offsetrect : value passed when moving on the welcome page, we need to add this value to calculate the absolute coordinates
 *                               related to the entire window
 */
Client.Widget.ddMouseMove = function (ev, offsetrect)
{
  if (!Client.mainFrame)
    return;
  //
  let x = (ev.targetTouches?.[0]?.clientX ?? ev.clientX) + (offsetrect ? offsetrect.x : 0);
  let y = (ev.targetTouches?.[0]?.clientY ?? ev.clientY) + (offsetrect ? offsetrect.y : 0);
  let {el, widget} = Client.Widget.getDDTargetWidget(ev);
  //
  if (Client.Widget.ddOperation) {
    // OPERATION PHASE
    let origX = Client.Widget.ddOperation.startx;
    let origY = Client.Widget.ddOperation.starty;
    let deltaX = x - origX;
    let deltaY = y - origY;
    //
    // we have detected the operation, but it must be executed ONLY if we have moved over the threshold
    if (!Client.Widget.ddOperation.started && (Math.abs(deltaX) >= 6 || Math.abs(deltaY) >= 6)) {
      let operation = Client.Widget.ddOperation.operation;
      let tgt = Client.Widget.ddOperation.startDomObj;
      let boundary = Client.Widget.ddOperation.startRect;
      //
      if (operation === Client.Widget.transformOperation.DRAG ||
              operation === Client.Widget.transformOperation.MOVE ||
              operation === Client.Widget.transformOperation.MOVEX ||
              operation === Client.Widget.transformOperation.MOVEY) {
        Client.Widget.ddOperation.cloneObj = tgt.cloneNode(true);
        Client.Widget.ddOperation.cloneObj.classList.add("dd-dragging-element");
        //
        // Add a class to hide the dragged object
        if (operation === Client.Widget.transformOperation.DRAG)
          tgt.classList.add("dd-dragged-element");
        else
          tgt.classList.add("dd-moved-element");
      }
      else {
        // RESIZE
        Client.Widget.ddOperation.cloneObj = document.createElement("DIV");
        Client.Widget.ddOperation.cloneObj.classList.add("dd-resizing-element");
        //
        if (tgt.style.paddingLeft || tgt.style.paddingRight) {
          Client.Widget.ddOperation.cloneObj.style.paddingLeft = tgt.style.paddingLeft;
          Client.Widget.ddOperation.cloneObj.style.paddingRight = tgt.style.paddingRight;
          Client.Widget.ddOperation.cloneObj.setAttribute("pad", "pad");
        }
      }
      //
      Client.Widget.ddOperation.cloneObj.style.top = boundary.top + "px";
      Client.Widget.ddOperation.cloneObj.style.left = boundary.left + "px";
      Client.Widget.ddOperation.cloneObj.style.width = boundary.width + "px";
      Client.Widget.ddOperation.cloneObj.style.height = boundary.height + "px";
      document.body.appendChild(Client.Widget.ddOperation.cloneObj);
      //
      Client.Widget?.initDDMultipleClones(Client.Widget.ddOperation);
      //
      Client.Widget.ddOperation.started = true;
      document.body.classList.add("dd-operation-in-progress");
    }
    if (!Client.Widget.ddOperation.started)
      return;
    //
    switch (Client.Widget.ddOperation.operation) {
      case Client.Widget.transformOperation.DRAG:
        // Check if the mouse during the drag operation is on a scrollbar and move the object
        Client.Widget.checkScrollbar({
          domTarget: ev.target,
          x,
          y,
          event: ev
        });
        //
        let oldDrObjs = document.getElementsByClassName("dd-droppable-element");
        while (oldDrObjs.length > 0)
          oldDrObjs[0].classList.remove("dd-droppable-element");
        //
        // Move the cloned object
        Client.Widget.ddOperation.cloneObj.style.top = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.top + deltaY) + "px";
        Client.Widget.ddOperation.cloneObj.style.left = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.left + deltaX) + "px";
        //
        // Check if the target accepts the drop
        if (widget?.acceptsDrop(Client.Widget.ddOperation.startWidget, el) && Client.Widget.ddOperation.startWidget.canBeDroppedOn(widget, el, Client.Widget.ddOperation.startElement)) {
          let tgt = widget.getTransformOperationTargetObj(Client.Widget.ddOperation.operation, el);
          tgt.classList.add("dd-droppable-element");
        }
        break;

      case Client.Widget.transformOperation.MOVE:
      case Client.Widget.transformOperation.MOVEX:
      case Client.Widget.transformOperation.MOVEY:
        // Move the cloned object
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.MOVE ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.MOVEY)
          Client.Widget.ddOperation.cloneObj.style.top = (Client.Widget.ddOperation.startRect.top + deltaY) + "px";
        //
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.MOVE ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.MOVEX)
          Client.Widget.ddOperation.cloneObj.style.left = (Client.Widget.ddOperation.startRect.left + deltaX) + "px";
        break;

      case Client.Widget.transformOperation.RESIZETOP:
      case Client.Widget.transformOperation.RESIZELEFT:
      case Client.Widget.transformOperation.RESIZERIGHT:
      case Client.Widget.transformOperation.RESIZEBOTTOM:
      case Client.Widget.transformOperation.RESIZETOPLEFT:
      case Client.Widget.transformOperation.RESIZETOPRIGHT:
      case Client.Widget.transformOperation.RESIZEBOTTOMLEFT:
      case Client.Widget.transformOperation.RESIZEBOTTOMRIGHT:
        let t, h, w, l;
        //
        // Move the cloned object
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZETOP ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZETOPLEFT ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZETOPRIGHT) {
          t = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.top + deltaY, Client.Widget.ddOperation.unitV);
          h = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.height - deltaY, Client.Widget.ddOperation.unitV);
        }
        //
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOM ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMLEFT ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMRIGHT) {
          h = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.height + deltaY, Client.Widget.ddOperation.unitV);
        }
        //
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZELEFT ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZETOPLEFT ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMLEFT) {
          l = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.left + deltaX, Client.Widget.ddOperation.unitH);
          w = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.width - deltaX, Client.Widget.ddOperation.unitH);
        }
        //
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZERIGHT ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZETOPRIGHT ||
                Client.Widget.ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMRIGHT) {
          w = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.width + deltaX, Client.Widget.ddOperation.unitH);
        }
        //
        if (t)
          Client.Widget.ddOperation.cloneObj.style.top = t + "px";
        if (h)
          Client.Widget.ddOperation.cloneObj.style.height = h + "px";
        if (w)
          Client.Widget.ddOperation.cloneObj.style.width = w + "px";
        if (l)
          Client.Widget.ddOperation.cloneObj.style.left = l + "px";
        //
        Client.Widget.ddOperation.cloneObj.setAttribute("dims", Client.Widget.ddOperation.startWidget.getResizeTooltip(w, h));
        break;
    }
    //
    Client.Widget?.handleDDMultipleClones(Client.Widget.ddOperation, deltaX, deltaY);
  }
  else if (!ev.targetTouches?.[0] && widget) {
    // DETECTION PHASE
    // (SKIP on touch, in this case the detection is done on the pointerdown)
    let operation = widget.getSupportedTransformOperation(x, y, el);
    let wdg = widget.getTransformOperationTargetWidget(operation, el);
    let cn = ["",
      "move",
      "move",
      "n-resize",
      "w-resize",
      "e-resize",
      "s-resize",
      "nw-resize",
      "ne-resize",
      "sw-resize",
      "sw-resize",
      "se-resize",
      "move",
      "move"];
    wdg.applyDragDropCursor(cn[operation]);
  }
};


/**
 *
 * @param {MouseEvent/Touchevent} ev
 * @param {boxRect} offsetrect : value passed when moving on the welcome page, we need to add this value to calculate the absolute coordinates
 *                               related to the entire window
 */
Client.Widget.ddMouseUp = function (ev, offsetrect)
{
  let x = (ev.targetTouches?.[0]?.clientX ?? ev.clientX) + (offsetrect ? offsetrect.x : 0);
  let y = (ev.targetTouches?.[0]?.clientY ?? ev.clientY) + (offsetrect ? offsetrect.y : 0);
  let {el, widget} = Client.Widget.getDDTargetWidget(ev);
  //
  if (Client.Widget.ddOperation?.started) {
    document.body.classList.remove("dd-operation-in-progress");
    //
    // OPERATION PHASE
    let origX = Client.Widget.ddOperation.startx;
    let origY = Client.Widget.ddOperation.starty;
    let deltaX = x - origX;
    let deltaY = y - origY;
    //
    switch (Client.Widget.ddOperation.operation) {
      case Client.Widget.transformOperation.DRAG:
        // The drop operation ended on an object without an associated widget, in this case
        // the drop is automatically rejected
        if (!widget)
          break;
        //
        // Calculate new coordinates applying a 4px grid
        let newTop = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.top + deltaY);
        let newLeft = Client.Widget.gridValue(Client.Widget.ddOperation.startRect.left + deltaX);
        //
        // Check if the target accepts the drop
        widget = widget.getTransformOperationTargetWidget(Client.Widget.ddOperation, el);
        if (widget.acceptsDrop(Client.Widget.ddOperation.startWidget, el) && Client.Widget.ddOperation.startWidget.canBeDroppedOn(widget, el, Client.Widget.ddOperation.startElement)) {
          let gen = widget.handleDrop(Client.Widget.ddOperation.startWidget, el, newLeft, newTop, ev, {deltaX: Client.Widget.gridValue(deltaX), deltaY: Client.Widget.gridValue(deltaY)});
          if (gen)
            Client.Widget.onGenericDrop(Client.Widget.ddOperation.startWidget, widget, newLeft, newTop, ev, {deltaX: Client.Widget.gridValue(deltaX), deltaY: Client.Widget.gridValue(deltaY)});
        }
        break;

      case Client.Widget.transformOperation.MOVE:
      case Client.Widget.transformOperation.MOVEX:
      case Client.Widget.transformOperation.MOVEY:
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.MOVEY)
          deltaX = 0;
        if (Client.Widget.ddOperation.operation === Client.Widget.transformOperation.MOVEX)
          deltaY = 0;
        //
        Client.Widget.ddOperation.startWidget.onTransform({
          x: Client.Widget.ddOperation.startRect.left + deltaX,
          y: Client.Widget.ddOperation.startRect.top + deltaY,
          w: Client.Widget.ddOperation.startRect.width,
          h: Client.Widget.ddOperation.startRect.height,
          operation: Client.Widget.ddOperation.operation
        });
        break;

      case Client.Widget.transformOperation.RESIZETOP:
      case Client.Widget.transformOperation.RESIZELEFT:
      case Client.Widget.transformOperation.RESIZERIGHT:
      case Client.Widget.transformOperation.RESIZEBOTTOM:
      case Client.Widget.transformOperation.RESIZETOPLEFT:
      case Client.Widget.transformOperation.RESIZETOPRIGHT:
      case Client.Widget.transformOperation.RESIZEBOTTOMLEFT:
      case Client.Widget.transformOperation.RESIZEBOTTOMRIGHT:
        let boundary = Client.Widget.ddOperation.cloneObj.getBoundingClientRect();
        Client.Widget.ddOperation.startWidget.onTransform({
          x: boundary.x,
          y: boundary.y,
          w: boundary.width,
          h: boundary.height,
          operation: Client.Widget.ddOperation.operation,
          ox: Client.Widget.ddOperation.startRect.left,
          oy: Client.Widget.ddOperation.startRect.top,
          ow: Client.Widget.ddOperation.startRect.width,
          oh: Client.Widget.ddOperation.startRect.height
        });
        break;
    }
  }
  //
  Client.Widget.ddClearOperation();
};


/**
 * Clears the dd operation
 */
Client.Widget.ddClearOperation = function ()
{
  if (Client.mainFrame.scrollTimerID) {
    clearInterval(Client.mainFrame.scrollTimerID);
    Client.mainFrame.scrollTimerID = 0;
  }
  //
  if (Client.Widget.ddOperation?.startWidget) {
    Client.Widget.ddOperation.startWidget?.clearResizeTooltip();
    delete Client.Widget.ddOperation.startWidget;
  }
  //
  if (Client.Widget.ddOperation?.cloneObj)
    document.body.removeChild(Client.Widget.ddOperation.cloneObj);
  Client.Widget?.clearDDMultipleClones(Client.Widget.ddOperation);
  delete Client.Widget.ddOperation;
  //
  let oldDrObjs = document.getElementsByClassName("dd-droppable-element");
  while (oldDrObjs.length > 0)
    oldDrObjs[0].classList.remove("dd-droppable-element");
  //
  oldDrObjs = document.getElementsByClassName("dd-dragged-element");
  while (oldDrObjs.length > 0)
    oldDrObjs[0].classList.remove("dd-dragged-element");
  //
  oldDrObjs = document.getElementsByClassName("dd-moved-element");
  while (oldDrObjs.length > 0)
    oldDrObjs[0].classList.remove("dd-moved-element");
  //
  oldDrObjs = document.getElementsByClassName("system-cursor");
  while (oldDrObjs.length > 0) {
    oldDrObjs[0].style.cursor = "";
    oldDrObjs[0].setAttribute("opnt", "");
    oldDrObjs[0].onmouseleave = null;
    oldDrObjs[0].classList.remove("system-cursor");
  }
};


/**
 * Clears the pointer when the pointer EXITS from an object
 * @param {Object} ev
 */
Client.Widget.ddClearPointer = function (ev)
{
  if (ev.target.getAttribute("opnt")) {
    ev.target.style.cursor = "";
    ev.target.setAttribute("opnt", "");
    ev.target.classList.remove("system-cursor");
  }
  ev.target.onmouseleave = null;
};


Client.Widget.prototype.getSupportedTransformOperation = function (x, y, element, root)
{
  if (!this.isTransformable(element) && !this.isDraggable(element))
    return Client.Widget.transformOperation.NONE;
  //
  let mainObj = root ?? this.getRootObject();
  let boundary = mainObj.getBoundingClientRect();
  let threshold = 10;
  //
  // Check if the coordinates are in the boundary
  if ((boundary.left <= x && x <= boundary.right) && (boundary.top <= y && y <= boundary.bottom)) {
    if (this.isResizable(element)) {
      // Check the treshold to detect the resize side OR the MOVE/DRAG
      let h = 0;
      let v = 0;
      //
      // LEFT SIDE
      if (x <= boundary.left + threshold)
        h = -1;
      //
      // RIGHT SIDE
      if (x >= boundary.right - threshold)
        h = 1;
      //
      // TOP SIDE
      if (y <= boundary.top + threshold)
        v = -1;
      //
      // BOTTOM SIDE
      if (y >= boundary.bottom - threshold)
        v = 1;
      //
      // Check the admitted resize types and clear the resize if is not permitted
      if ((h === 1 || h === -1) && !this.canResizeW(element))
        h = 0;
      if ((v === 1 || v === -1) && !this.canResizeH(element))
        v = 0;
      //
      switch (h) {
        case - 1:
          switch (v) {
            case - 1:
              return Client.Widget.transformOperation.RESIZETOPLEFT;
              break;
            case 0:
              return Client.Widget.transformOperation.RESIZELEFT;
              break;
            case 1:
              return Client.Widget.transformOperation.RESIZEBOTTOMLEFT;
              break;
          }
          break;

        case 0:
          switch (v) {
            case - 1:
              return Client.Widget.transformOperation.RESIZETOP;
              break;
            case 0:
              if (this.isDraggable(element))
                return Client.Widget.transformOperation.DRAG;
              if (this.isMoveable(element)) {
                if (this.canMoveX() && this.canMoveY())
                  return Client.Widget.transformOperation.MOVE;
                else if (this.canMoveX())
                  return Client.Widget.transformOperation.MOVEX;
                else
                  return Client.Widget.transformOperation.MOVEY;
              }
              break;
            case 1:
              return Client.Widget.transformOperation.RESIZEBOTTOM;
              break;
          }
          break;

        case 1:
          switch (v) {
            case - 1:
              return Client.Widget.transformOperation.RESIZETOPRIGHT;
              break;
            case 0:
              return Client.Widget.transformOperation.RESIZERIGHT;
              break;
            case 1:
              return Client.Widget.transformOperation.RESIZEBOTTOMRIGHT;
              break;
          }
          break;
      }
    }
    else {
      if (this.isDraggable(element))
        return Client.Widget.transformOperation.DRAG;
      if (this.isMoveable(element)) {
        if (this.canMoveX() && this.canMoveY())
          return Client.Widget.transformOperation.MOVE;
        else if (this.canMoveX())
          return Client.Widget.transformOperation.MOVEX;
        else
          return Client.Widget.transformOperation.MOVEY;
      }
    }
  }
  //
  return Client.Widget.transformOperation.NONE;
};

Client.Widget.prototype.canResizeW = function (element)
{
  return false;
};

Client.Widget.prototype.canResizeH = function (element)
{
  return false;
};

Client.Widget.prototype.canMoveX = function ()
{
  return false;
};

Client.Widget.prototype.canMoveY = function ()
{
  return false;
};

Client.Widget.prototype.isMoveable = function (element)
{
  return this.canMoveX() || this.canMoveY();
};

Client.Widget.prototype.isResizable = function (element)
{
  return this.canResizeW(element) || this.canResizeH(element);
};

Client.Widget.prototype.isDraggable = function (element)
{
  return false;
};

Client.Widget.prototype.isTransformable = function (element)
{
  return this.isResizable(element) || this.isMoveable(element);
};

/**
 * Sometimes is the draging widget that must be able to decide if the target widget is suitable,
 * in this case we can use this to handle that case
 * @param {DomNode} widget
 * @param {DomNode} targetDomElement
 * @param {DomNode} draggedDomElement
 * @returns
 */
Client.Widget.prototype.canBeDroppedOn = function (widget, targetDomElement, draggedDomElement)
{
  return true;
};

/*
 * Returns true if this widget accepts the drop from the other
 */
Client.Widget.prototype.acceptsDrop = function (widget, targetDomElement)
{
  return false;
};

/*
 * Maybe this widget needs to handle the drop, returns true if we sholud proceded with the standard generic drop
 */
Client.Widget.prototype.handleDrop = function (dragWidget, droppedElement, x, y, ev, options)
{
  return true;
};


/**
 * @param {Object} options -
 *
 * {
 *   x
 *   y
 *   w
 *   h
 *   operation
 *  }
 *
 */
Client.Widget.prototype.onTransform = function (options)
{
  return false;
};


Client.Widget.prototype.applyDragDropCursor = function (cursor)
{
  // No default implemetation, no cursor
};


/**
 * Maybe the transform operation on this object must be done really on another (ex: the span must be handled bi the box)
 * @param {int} operation
 * @param {Client.Element} element - element touched/clicked/mousemoved
 * @returns {Client.Widget}
 */
Client.Widget.prototype.getTransformOperationTargetWidget = function (operation, element)
{
  return this;
};


/**
 * Returns the dom object to apply the operation
 * @param {int} operation
 * @param {Client.Element} element - element touched/clicked/mousemoved
 * @returns {DomNode}
 */
Client.Widget.prototype.getTransformOperationTargetObj = function (operation, element)
{
  return this.getRootObject();
};

/**
 * Get the widget relative to a mouse/touch event
 * @param {Event} ev
 * @returns {Client.Widget}
 */
Client.Widget.getDDTargetWidget = function (ev)
{
  let ret = {};
  if (!Client.eleMap)
    return ret;
  let tgt = ev.target;
  if ((ev.type === "touchmove" || ev.type === "touchend") && ev.targetTouches?.length > 0) {
    // The touch events are strange, the event target IS NOT the object currently touched by the user but the first element touched
    // in the touchstart/touchmove/touchend chain
    // So to know the real element under the thumb we need to get it with the coordinates
    tgt = document.elementFromPoint(ev.targetTouches[0].clientX, ev.targetTouches[0].clientY);
    if (tgt?.nodeType === 3)
      tgt = tgt.parentNode;
  }
  //
  ret.el = Client.Widget.getElementByObj(tgt);
  ret.widget = Client.Widget.getWidgetByElement(ret.el);
  //
  return ret;
};


Client.Widget.onGenericDrop = function (dragWidget, dropWidget, x, y, ev)
{
  let iddropobj = dropWidget.id;
  let iddragobj = dragWidget.id;
  let button = ev.button;
  //
  // Mouse coordinates : absolute relative to borswer AND relative to the parent frame of the object
  let xb = x;
  let yb = y;
  let xc = xb;
  let yc = yb;
  //
  if (dropWidget instanceof Client.IdfFieldValue)
    iddropobj = dropWidget.parentField.id + (dropWidget.parentIdfFrame.layout === Client.IdfPanel.layouts.list ? ":lv" + (dropWidget.index - dropWidget.parentIdfFrame.actualPosition) : ":fv");
  if (dragWidget instanceof Client.IdfFieldValue)
    iddragobj = dragWidget.parentField.id + (dragWidget.parentIdfFrame.layout === Client.IdfPanel.layouts.list ? ":lv" + (dragWidget.index - dropWidget.parentIdfFrame.actualPosition) : ":fv");
  if (dropWidget instanceof Client.IdfControl && dropWidget.parentWidget instanceof Client.IdfFieldValue)
    iddropobj = dropWidget.parentWidget.parentField.id + (dropWidget.parentWidget.parentIdfFrame.layout === Client.IdfPanel.layouts.list ? ":lv" + (dropWidget.parentWidget.index - dropWidget.parentWidget.parentIdfFrame.actualPosition) : ":fv");
  if (dragWidget instanceof Client.IdfControl && dragWidget.parentWidget instanceof Client.IdfFieldValue)
    iddragobj = dragWidget.parentWidget.parentField.id + (dragWidget.parentWidget.parentIdfFrame.layout === Client.IdfPanel.layouts.list ? ":lv" + (dragWidget.parentWidget.index - dragWidget.parentWidget.parentIdfFrame.actualPosition) : ":fv");
  //
  if (dropWidget instanceof Client.IdfBox) {
    // The X - y must be RELATIVE TO THE BOX, not the frame BUT in MM or PT (boook UM)
    let boxRect = dropWidget.getRootObject().getBoundingClientRect();
    let um = dropWidget.page.unitOfMeasure;
    //
    xc = Client.IdfBookPage.convertFromPx(xb, um) - Client.IdfBookPage.convertFromPx(boxRect.x, um);
    yc = Client.IdfBookPage.convertFromPx(yb, um) - Client.IdfBookPage.convertFromPx(boxRect.y, um);
  }
  else {
    let pf = dropWidget instanceof Client.IdfFrame ? dropWidget : dropWidget.parentIdfFrame;
    let r = pf?.getClickDetail({content: {clientX: x, clientY: y}}) ?? {x: x, y: y};
    xc = r.x;
    yc = r.y;
  }
  //
  // Absolute row if we are dragging/dropping a list cell/form cell
  let abs;
  //
  let events = [];
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "gdd",
      def: Client.IdfMessagesPump.eventTypes.ACTIVE,
      content: {
        oid: iddropobj,
        obn: iddragobj,
        par1: button,
        par2: Math.floor(xb),
        par3: Math.floor(yb),
        par4: Math.floor(xc),
        par5: Math.floor(yc),
        par6: abs ? Math.floor(abs) : null
      }
    });
  }
  else {
    // TODO
  }
  Client.mainFrame.sendEvents(events);
};


Client.Widget.checkScrollbar = function (options)
{
  let {x, y, event} = options;
  //
  // Skip on touch
  if (event?.targetTouches?.[0] !== undefined)
    return;
  //
  if (Client.mainFrame.scrollTimerID) {
    clearInterval(Client.mainFrame.scrollTimerID);
    Client.mainFrame.scrollTimerID = 0;
  }
  //
  let threshold = 25;
  let tgt = options.domTarget;
  let scrollDirection = Client.Widget.transformOperation.NONE;
  while (tgt) {
    // No scrollbar, move along
    if (tgt.scrollWidth === tgt.offsetWidth && tgt.scrollHeight === tgt.offsetHeight)
      tgt = tgt.parentNode;
    else {
      // This object Has a scrollbar, check if the mouse position is on it
      let boundary = tgt.getBoundingClientRect();
      if ((boundary.left <= x && x <= boundary.left + threshold) && (tgt.scrollWidth >= tgt.offsetWidth) && (tgt.scrollLeft > 0)) {
        // On the left side
        scrollDirection = Client.Widget.transformOperation.RESIZELEFT;
        break;
      }
      if ((boundary.right - threshold <= x && x <= boundary.right) && (tgt.scrollWidth >= tgt.offsetWidth)) {
        // On the left side
        scrollDirection = Client.Widget.transformOperation.RESIZERIGHT;
        break;
      }
      if ((boundary.top <= y && y <= boundary.top + threshold) && (tgt.scrollHeight >= tgt.offsetHeight) && (tgt.scrollTop > 0)) {
        // On the left side
        scrollDirection = Client.Widget.transformOperation.RESIZETOP;
        break;
      }
      if ((boundary.bottom - threshold <= y && y <= boundary.bottom) && (tgt.scrollHeight >= tgt.offsetHeight)) {
        // On the left side
        scrollDirection = Client.Widget.transformOperation.RESIZEBOTTOM;
        break;
      }
      //
      // I'm not on this object scrollbar, try with the parent
      tgt = tgt.parentNode;
    }
  }
  //
  // Activate the timer to scroll the object
  if (tgt && scrollDirection !== Client.Widget.transformOperation.NONE) {
    // too many dom object with scrollbar, we scroll only the frames BUT not the toolstrip of the TabbedView
    // (that thing is scrollable and is impossibile to know why)
    let el = Client.Widget.getElementByObj(tgt);
    let widget = Client.Widget.getWidgetByElement(el);
    if (!(widget instanceof Client.IdfFrame) || (widget instanceof Client.IdfTabbedView))
      return;
    //
    Client.mainFrame.scrollTimerID = setInterval(() => {
      switch (scrollDirection) {
        case Client.Widget.transformOperation.RESIZELEFT:
          tgt.scrollLeft = tgt.scrollLeft - 12;
          break;

        case Client.Widget.transformOperation.RESIZERIGHT:
          tgt.scrollLeft = tgt.scrollLeft + 12;
          break;

        case Client.Widget.transformOperation.RESIZETOP:
          tgt.scrollTop = tgt.scrollTop - 12;
          break;

        case Client.Widget.transformOperation.RESIZEBOTTOM:
          tgt.scrollTop = tgt.scrollTop + 12;
          break;
      }
    }, 25);
  }
};


/**
 * Apply a 4px grid to given value
 * @param {Integer} value
 */
Client.Widget.gridValue = function (value, unit)
{
  return !unit ? Math.round(value / 4) * 4 : Math.round(value / unit) * unit;
};


Client.Widget.prototype.getGritUnit = function (vertical)
{
  return 4;
};


/**
 * Find an parent widget by class
 * @param {Function} cls
 * @returns {Client.Widget|undefined}
 */
Client.Widget.prototype.getParentWidgetByClass = function (cls)
{
  let w = this;
  while (w && !(w instanceof cls))
    w = w.parentWidget;
  return w;
};


/**
 * Find an Client.Element from a dom object
 * @param {HTMLElement} obj - the dom object of the element to find
 * @returns {Client.Element|undefined}
 */
Client.Widget.getElementByObj = function (obj)
{
  while (obj) {
    if (obj?.getAttribute && obj?.getAttribute("for")) {
      let el = Client.eleMap[obj?.getAttribute("for")];
      if (el)
        return el;
    }
    //
    if (obj.id) {
      var oid = obj.id.indexOf("dmo_") !== -1 ? obj.id.substring(4, obj.id.length) : obj.id;
      let el = Client.eleMap[oid];
      if (el)
        return el;
    }
    obj = obj.parentNode;
  }
};


/**
 * Find an Client.Widget from an alement
 * @param {Client.Element} el - element of the element to find
 * @returns {Client.Widget|undefined}
 */
Client.Widget.getWidgetByElement = function (el)
{
  while (el) {
    if (el instanceof Client.View && el.elements[0] instanceof Client.IdfView)
      return el.elements[0];
    //
    if (el instanceof Client.Widget)
      return el;
    //
    // Get the parent widget
    if (el.parentWidget)
      return el.parentWidget;
    //
    el = el.parent;
  }
};


Client.Widget.globalKeyDown = function (ev)
{
  // KeyCode is deprecated, the standard now is the key property
  // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
  //
  // ESC = Abort operation
  if (ev.key === "Escape" && Client.Widget.ddOperation)
    Client.Widget.ddClearOperation();
};


Client.Widget.onSelectionChange = function (ev)
{
  let el = Client.Widget.getElementByObj(document.getSelection().focusNode);
  let widget = Client.Widget.getWidgetByElement(el);
  if (widget)
    Client.mainFrame.sendEvents(widget.handleSelectionChange(ev));
};


/**
 * Handle selection change event
 * @param {Object} event
 */
Client.Widget.prototype.handleSelectionChange = function (event)
{
  return [];
};


/**
 * Handle selection change event
 * @param {Object} options
 */
Client.Widget.prototype.focusNearControl = function (options)
{
  return [];
};


/**
 * Show a messagebox
 * @param {Object} options ->
 *   type
 *   text
 *   buttons
 *   voice
 *
 * @param {function} callback
 */
Client.Widget.showMessageBox = function (options, callback)
{
  let style = "";
  let message = options.text;
  if (options.text.startsWith("cls=") && options.text.includes(",")) {
    // Extract the css class from the text
    style = options.text.split(",")[0].substring(4);
    message = options.text.split(",")[1];
  }
  //
  message = Client.Widget.getHTMLForCaption(message);
  //
  let def = {type: "alert", message, style};
  def.style += (def.style.length > 0 ? " " : "") + "class-alertbox";
  //
  let sound;
  switch (options.type) {
    case Client.Widget.msgTypes.ALERT:
      sound = Client.IdfWebEntryPoint?.soundDef.info;
      def.title = Client.IdfResources.t("MSG_POPUP_MsgBoxCaption");
      //
      // TODO: Activate when the alert supports an array of classes
      //def.style += " class-messagebox";
      def.buttons = [{text: Client.IdfResources.t("MSG_POPUP_OkButton")}];
      break;

    case Client.Widget.msgTypes.CONFIRM:
      sound = Client.IdfWebEntryPoint?.soundDef.warning;
      def.title = Client.IdfResources.t("MSG_POPUP_MsgConfirmCaption");
      //
      // TODO: Activate when the alert supports an array of classes
      //def.style += " class-messageconfirm";
      if (options.buttons) {
        def.buttons = [];
        let buttons = options.buttons;
        for (let i = 0; i < buttons.length; i++) {
          let btn = buttons[i];
          btn.cssClass = btn.cssClass || (i === 0 && !btn.destructive ? "alert-button-primary" : "");
          def.buttons.push(btn);
        }
      }
      else
        def.buttons = [
          {text: Client.IdfResources.t("MSG_POPUP_YesButton"), cssClass: "alert-button-primary"},
          {text: Client.IdfResources.t("MSG_POPUP_NoButton")}
        ];
      break;

    case Client.Widget.msgTypes.INPUT:
      sound = Client.IdfWebEntryPoint?.soundDef.warning;
      def.title = Client.IdfResources.t("MSG_POPUP_MsgInputCaption");
      //
      // TODO: Activate when the alert supports an array of classes
      //def.style += " class-messageinput";
      def.inputs = [{id: "result", type: "text", focus: true, value: options.defaultValue}];
      def.buttons = [
        {text: Client.IdfResources.t("MSG_POPUP_OkButton"), cssClass: "alert-button-primary", defaultClick: true},
        {text: Client.IdfResources.t("MSG_POPUP_CancelButton")}];
      break;
  }
  //
  Client.IonHelper.createAlert(def, (r, values) => {
    // r is the index of the button clicked, depends on the order of the buttons array
    let result;
    switch (options.type) {
      case Client.Widget.msgTypes.CONFIRM:
        if (!options.buttons && options.server)
          result = (r === 0 ? "Y" : "N");
        else
          result = (r !== null ? r + 1 : def.buttons.length);
        break;

      case Client.Widget.msgTypes.INPUT:
        result = r === 0 ? values.result : "";
        break;
    }
    //
    if (callback)
      callback(result, options.text);
  });
  //
  Client.mainFrame.wep?.soundAction(sound);
};


/**
 * Show a preview frame
 * @param {String} title
 * @param {String} address
 */
Client.Widget.showPreview = function (title, address)
{
  if (!title)
    title = Client.IdfResources.t("SRV_MSG_ShowDoc");
  //
  let frameId = "POPUP" + Math.floor(Math.random() * 100);
  let def = {
    type: "alert",
    title,
    message: `<iframe id="${frameId}" ></iframe>`,
    style: "frame-preview-popup",
    buttons: [{text: Client.IdfResources.t("TIP_TITLE_ChiudiForm"), cancel: true}]
  };
  //
  // Create the alert
  Client.IonHelper.createAlert(def, () => {
  });
  //
  // Set the src of the frame AND the function to resize it by the frame content
  setTimeout(() => {
    let frame = document.getElementById(frameId);
    frame.src = address;
    //
    // After the loading resize the frame to its content
    frame.onload = () => {
      let w, h = -1;
      try {
        w = frame.contentWindow.document.body.scrollWidth;
        h = frame.contentWindow.document.body.scrollHeight;
      }
      catch (ex) {
      }
      //
      if (w <= 0 || isNaN(w))
        w = 400;
      if (h <= 0 || isNaN(h))
        h = 400;
      //
      frame.style.width = w + "px";
      frame.style.height = h + "px";
    };
  }, 100);
};


Client.Widget.initDDMultipleClones = function (ddOperation)
{
  if (!Client.mainFrame?.isEditing() || !(ddOperation?.startWidget instanceof Client.IdfControl))
    return;
  //
  // Get all the selected widgets
  ddOperation.clonesNodes = [];
  let startField = ddOperation.startWidget.parentWidget.parent;
  let panel = startField.parent;
  let list = panel.layout === Client.IdfPanel.layouts.list;
  let selFields = Client.ViewEdit.getEditorSelectedElements();
  let operation = ddOperation.operation;
  //
  // We need to mantain the vertical order of the fields no matter what field i've moved, so we reorder them by the top
  selFields.sort((a, b) => {
    return a[list ? "listTop" : "formTop"] - b[list ? "listTop" : "formTop"];
  });
  //
  selFields.forEach((field, i) => {
    if (field === startField) {
      // This is the moving widget, so we don't clone it.
      // but if is not the topmpost widget we set the opacity on its clone,
      // so the user can know that it's not the real object to apply its transformation
      if (i !== 0 && (operation === Client.Widget.transformOperation.DRAG ||
              operation === Client.Widget.transformOperation.MOVE ||
              operation === Client.Widget.transformOperation.MOVEX ||
              operation === Client.Widget.transformOperation.MOVEY))
        ddOperation.cloneObj.style.opacity = "0.3";
      //
      return;
    }
    //
    let obj = field.getEditorHilightObject();
    let clone;
    if (operation === Client.Widget.transformOperation.DRAG ||
            operation === Client.Widget.transformOperation.MOVE ||
            operation === Client.Widget.transformOperation.MOVEX ||
            operation === Client.Widget.transformOperation.MOVEY) {
      clone = obj.cloneNode(true);
      clone.classList.add("dd-dragging-element");
      //
      if (i !== 0)
        clone.style.opacity = "0.3";
    }
    else {
      // RESIZE
      clone = document.createElement("DIV");
      clone.classList.add("dd-resizing-element");
      //
      if (obj.style.paddingLeft || obj.style.paddingRight) {
        clone.style.paddingLeft = obj.style.paddingLeft;
        clone.style.paddingRight = obj.style.paddingRight;
        clone.cloneObj.setAttribute("pad", "pad");
      }
    }
    //
    let rect = obj.getBoundingClientRect();
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    //
    document.body.appendChild(clone);
    ddOperation.clonesNodes.push({clone: clone, startRect: rect});
  });
};

Client.Widget.handleDDMultipleClones = function (ddOperation, deltaX, deltaY)
{
  if (!Client.mainFrame?.isEditing() || !ddOperation?.clonesNodes?.length)
    return;
  //
  ddOperation.clonesNodes.forEach(clone => {
    switch (ddOperation.operation) {
      case Client.Widget.transformOperation.DRAG:
        // Move the cloned object
        clone.clone.style.top = Client.Widget.gridValue(clone.startRect.top + deltaY, ddOperation.unitV) + "px";
        clone.clone.style.left = Client.Widget.gridValue(clone.startRect.left + deltaX, ddOperation.unitH) + "px";
        break;

      case Client.Widget.transformOperation.MOVE:
      case Client.Widget.transformOperation.MOVEX:
      case Client.Widget.transformOperation.MOVEY:
        // Move the cloned object
        if (ddOperation.operation === Client.Widget.transformOperation.MOVE ||
                ddOperation.operation === Client.Widget.transformOperation.MOVEY)
          clone.clone.style.top = (clone.startRect.top + deltaY) + "px";
        //
        if (ddOperation.operation === Client.Widget.transformOperation.MOVE ||
                ddOperation.operation === Client.Widget.transformOperation.MOVEX)
          clone.clone.style.left = (clone.startRect.left + deltaX) + "px";
        break;

      case Client.Widget.transformOperation.RESIZETOP:
      case Client.Widget.transformOperation.RESIZELEFT:
      case Client.Widget.transformOperation.RESIZERIGHT:
      case Client.Widget.transformOperation.RESIZEBOTTOM:
      case Client.Widget.transformOperation.RESIZETOPLEFT:
      case Client.Widget.transformOperation.RESIZETOPRIGHT:
      case Client.Widget.transformOperation.RESIZEBOTTOMLEFT:
      case Client.Widget.transformOperation.RESIZEBOTTOMRIGHT:
        // Move the cloned object
        if (ddOperation.operation === Client.Widget.transformOperation.RESIZETOP ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZETOPLEFT ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZETOPRIGHT) {
          clone.clone.style.top = Client.Widget.gridValue(clone.startRect.top + deltaY, ddOperation.unitV) + "px";
          clone.clone.style.height = Client.Widget.gridValue(clone.startRect.height - deltaY, ddOperation.unitV) + "px";
        }
        //
        if (ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOM ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMLEFT ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMRIGHT) {
          clone.clone.style.height = Client.Widget.gridValue(clone.startRect.height + deltaY, ddOperation.unitV) + "px";
        }
        //
        if (ddOperation.operation === Client.Widget.transformOperation.RESIZELEFT ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZETOPLEFT ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMLEFT) {
          clone.clone.style.left = Client.Widget.gridValue(clone.startRect.left + deltaX, ddOperation.unitH) + "px";
          clone.clone.style.width = Client.Widget.gridValue(clone.startRect.width - deltaX, ddOperation.unitH) + "px";
        }
        //
        if (ddOperation.operation === Client.Widget.transformOperation.RESIZERIGHT ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZETOPRIGHT ||
                ddOperation.operation === Client.Widget.transformOperation.RESIZEBOTTOMRIGHT) {
          clone.clone.style.width = Client.Widget.gridValue(clone.startRect.width + deltaX, ddOperation.unitH) + "px";
        }
        break;
    }
  });
};


/**
 * Clear drag&drop clones
 * @param {Object} ddoperation
 */
Client.Widget.clearDDMultipleClones = function (ddoperation)
{
  if (!Client.mainFrame?.isEditing() || !ddoperation?.clonesNodes?.length)
    return;
  //
  ddoperation.clonesNodes.forEach(clone => {
    document.body.removeChild(clone.clone);
    clone.clone = null;
    clone.startRect = null;
  });
  //
  delete ddoperation.clonesNodes;
};


/**
 * Get resize tooltip
 * @param {Integer} width
 * @param {Integer} height
 */
Client.Widget.prototype.getResizeTooltip = function (width, height)
{
  return (height ? "height: " + height : "") + " " + (width ? "width: " + width : "");
};


/**
 * Clear resize tooltip
 */
Client.Widget.prototype.clearResizeTooltip = function ()
{
};


/**
 * Get the widget form row if present
 */
Client.Widget.prototype.getWidgetFormRow = function ()
{
  let main = Client.eleMap[this instanceof Client.IdfGroup ? this.formContainerId : this.formControlId]?.getRootObject();
  if (!main)
    return null;
  //
  let col = main;
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
  return row;
};


/**
 * Get animation root
 */
Client.Widget.prototype.getAnimationRoot = function ()
{
  return this.getRootObject();
};


/**
 * Check if control background has already been applied
 */
Client.Widget.prototype.isBackgroundApplied = function ()
{
};
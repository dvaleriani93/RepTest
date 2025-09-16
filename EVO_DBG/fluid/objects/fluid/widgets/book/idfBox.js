/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A box of a page
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfBox = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    xPos: 0, // Left position of the box
    yPos: 0, // Top position of the box
    width: 0, // Width of the box
    height: 0, // Height of the box
    visualStyle: null, // Visual Style associated with this box
    image: "", // Background image to show
    interline: 0, // Interline
    stretch: Client.IdfBox.stretches.AUTO, // Type of stretch to apply to the image
    visible: true, // Box is visible?
    canDrag: false, // Drag is possible?
    canDrop: false, // Drop is possible?
    canTransform: false, // Movement / resizing is possible?
    canScroll: false, // Is it possible to scroll the content?
    canClick: false, // Is it possible to click on the box?
    tooltip: "", // Tooltip to show
    graphFile: "", // Image file of the graph to show
    graphMap: "", // Click map of the graph
    numRows: 1, // Number of lines of input that can be contained in this text
    visualFlags: -1, // Visual flags
    subForm: null, // Possible sub-form (if present)
    badge: "", // Text of the badge to be assigned to the box
    className: "", // Additional class
    backColor: "", // Background color
    color: "", // Foreground color
    fontModifiers: "",
    horizontalAlignment: Client.IdfVisualStyle.alignments.AUTO,
    verticalAlignment: Client.IdfVisualStyle.alignments.AUTO,
    clickEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE, // The click on the box or on a point of the graph
    dropEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE, // Drop on the box
    transformEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE // Movement / Resizing of the box
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfBox extend Client.Widget
Client.IdfBox.prototype = new Client.Widget();


Object.defineProperty(Client.IdfBox.prototype, "page", {
  get: function () {
    if (this.parent instanceof Client.IdfBookPage)
      return this.parent;
    else if (this.parent instanceof Client.IdfSection)
      return this.parent.page;
  }
});


Client.IdfBox.transPropMap = {
  xp: "xPos",
  yp: "yPos",
  img: "image",
  int: "interline",
  str: "stretch",
  vis: "visible",
  vfl: "visualFlags",
  dra: "canDrag",
  dro: "canDrop",
  tra: "canTransform",
  scr: "canScroll",
  act: "canClick",
  grf: "graphFile",
  grm: "graphMap",
  num: "numRows",
  csf: "subForm",
  bkc: "backColor",
  frc: "color",
  ftm: "fontModifiers",
  aln: "horizontalAlignment",
  valn: "verticalAlignment"
};


Client.IdfBox.stretches = {
  AUTO: 1,
  NONE: 2,
  FILL: 3,
  ENLARGE: 4,
  CROP: 5
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfBox.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfBox.transPropMap.int:
      case Client.IdfBox.transPropMap.str:
      case Client.IdfBox.transPropMap.vfl:
      case Client.IdfBox.transPropMap.num:
      case Client.IdfBox.transPropMap.csf:
      case Client.IdfBox.transPropMap.aln:
      case Client.IdfBox.transPropMap.valn:
      case Client.IdfBox.transPropMap.clk:
      case Client.IdfBox.transPropMap.xp:
      case Client.IdfBox.transPropMap.yp:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfBox.transPropMap.vis:
      case Client.IdfBox.transPropMap.dra:
      case Client.IdfBox.transPropMap.dro:
      case Client.IdfBox.transPropMap.tra:
      case Client.IdfBox.transPropMap.scr:
      case Client.IdfBox.transPropMap.act:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfBox.prototype.createChildren = function (el)
{
  // Before creating the children I have to remove the old subForm
  // because the new one could arrive with the same id
  this.setSubForm();
  //
  if (el.subForm && Client.eleMap[el.children[0].id])
    Client.eleMap[el.children[0].id].close();
  //
  Client.Widget.prototype.createChildren.call(this, el);
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfBox.prototype.realize = function (widget, parent, view)
{
  // Create the main container
  let conf = this.createElementConfig({c: "Container", className: "book-box", events: ["onClick"]});
  this.mainObjects.push(view.createElement(conf, parent, view));
  //
  // Create widget children
  this.createChildren(widget);
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfBox.prototype.updateElement = function (props)
{
  Client.Widget.prototype.updateElement.call(this, props);
  //
  let adjustPadding = false;
  let el = {style: {}};
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "xPos":
        Client.IdfSection.prototype.setXPos.call(this, v, el);
        break;

      case "yPos":
        Client.IdfSection.prototype.setYPos.call(this, v, el);
        break;

      case "width":
        Client.IdfSection.prototype.setWidth.call(this, v, el);
        break;

      case "height":
        Client.IdfSection.prototype.setHeight.call(this, v, el);
        break;

      case "image":
        adjustPadding = true;
        this.setImage(v, el);
        break;

      case "interline":
        this.setInterline(v, el);
        break;

      case "stretch":
        this.setStretch(v, el);
        break;

      case "visible":
        Client.IdfSection.prototype.setVisible.call(this, v, el);
        break;

      case "canDrag":
        this.setCanDrag(v, el);
        break;

      case "canDrop":
        this.setCanDrop(v, el);
        break;

      case "canTransform":
        this.canTransform = v;
        break;

      case "canScroll":
        this.setCanScroll(v, el);
        break;

      case "canClick":
        this.setCanClick(v, el);
        break;

      case "tooltip":
        this.setTooltip(v, el);
        break;

      case "graphFile":
        adjustPadding = true;
        this.setGraphFile(v, el);
        break;

      case "graphMap": // Unmanaged: needed for JFreeChart
        break;

      case "numRows":
        this.setNumRows(v);
        break;

      case "visualFlags":
        // I just have to set the value, because it is only used at run-time
        this.visualFlags = v;
        break;

      case "subForm":
        adjustPadding = true;
        this.setSubForm(v);
        break;

      case "badge":
        this.setBadge(v);
        break;

      case "className":
        Client.IdfSection.prototype.setClassName.call(this, v, el);
        break;

      case "backColor":
        this.setBackColor(v, el);
        break;

      case "color":
        this.setColor(v, el);
        break;

      case "fontModifiers":
        this.setFontModifiers(v, el);
        break;

      case "horizontalAlignment":
        this.setHorizontalAlignment(v, el);
        break;

      case "verticalAlignment":
        this.setVerticalAlignment(v, el);
        break;

      case "adjustPadding":
      case "visualStyle":
        adjustPadding = true;
        break;
    }
  }
  //
  if (adjustPadding)
    this.adjustPadding(el);
  //
  this.getRootObject(true).updateElement(el);
};


Client.IdfBox.prototype.setImage = function (value, el)
{
  this.image = value;
  el.style.backgroundImage = this.image ? `url('${this.image}')` : "";
};


Client.IdfBox.prototype.setInterline = function (value, el)
{
  this.interline = value;
  el.style.lineHeight = this.interline ? this.interline + "pt" : "";
};


Client.IdfBox.prototype.setStretch = function (value, el)
{
  let rootObject = this.getRootObject(true);
  Client.Widget.updateElementClassName(rootObject, this.getClassForStretch(), true);
  this.stretch = value;
  Client.Widget.updateElementClassName(rootObject, this.getClassForStretch());
};
Client.IdfBox.prototype.getClassForStretch = function ()
{
  switch (this.stretch) {
    case Client.IdfBox.stretches.NONE:
      return "";
      break;
    case Client.IdfBox.stretches.CROP:
      return "book-box-img-crop";
      break;
    case Client.IdfBox.stretches.AUTO:
    case Client.IdfBox.stretches.FILL:
      return "book-box-img-fill";
      break;
    case Client.IdfBox.stretches.ENLARGE:
      return "book-box-img-enlarge";
      break;
  }
};


Client.IdfBox.prototype.setTooltip = function (value, el)
{
  el.tooltip = Client.Widget.getHTMLTooltip(null, value);
};


Client.IdfBox.prototype.setGraphFile = function (value, el)
{
  this.graphFile = value;
  this.setImage(value || this.image, el);
};


Client.IdfBox.prototype.setCanDrag = function (value, el)
{
  this.canDrag = value;
  //
  // If the book has the canDrag property set it will use the generic DD system, in that case we don't need to use the class
  if (!(this.parentIdfFrame.canDrag || this.parentIdfFrame.canDrop)) {
    el.draggable = value;
    Client.Widget.updateElementClassName(this.getRootObject(true), "book-box-draggable", !this.canDrag);
  }
};


Client.IdfBox.prototype.setCanDrop = function (value, el)
{
  this.canDrop = value;
  //
  // If the book has the canDrag proprty set it will use the generic DD system, in that case we don't need to use the class
  if (!(this.parentIdfFrame.canDrag || this.parentIdfFrame.canDrop))
    Client.Widget.updateElementClassName(this.getRootObject(true), "book-box-droppable", !this.canDrop);
};


Client.IdfBox.prototype.setCanScroll = function (value, el)
{
  this.canScroll = value;
  el.style.overflow = value ? "auto" : "";
};


Client.IdfBox.prototype.setCanClick = function (value, el)
{
  this.canClick = value;
  Client.Widget.updateElementClassName(this.getRootObject(true), "book-box-clickable", !this.canClick);
};


Client.IdfBox.prototype.setNumRows = function (value)
{
  this.numRows = value;
  this.elements.forEach(child => {
    if (child instanceof Client.IdfSpan)
      child.updateElement({numRows: this.numRows});
  });
};


Client.IdfBox.prototype.setSubForm = function (value)
{
  if (this.subForm) {
    this.removeChild(this.subForm);
    delete this.subForm;
  }
  //
  if (value !== 0 && this.elements[0] instanceof Client.IdfView)
    this.subForm = this.elements[0];
};


Client.IdfBox.prototype.setBadge = function (value)
{
  if (!this.badge) {
    // If I had a badge, I don't need it anymore
    if (this.badgeObj) {
      this.getRootObject(true).removeChild(this.badgeObj);
      delete this.badgeObj;
    }
  }
  else {
    // Create badge
    if (!this.badgeObj) {
      let badgeConf = this.createElementConfig({c: "IonBadge", className: "generic-badge"});
      this.badgeObj = this.getRootObject(true).insertBefore({child: badgeConf});
    }
    //
    this.badgeObj.updateElement({innerText: this.badge});
  }
};


Client.IdfBox.prototype.setBackColor = function (value, el)
{
  this.backColor = value;
  el.style.backgroundColor = this.backColor || "";
};


Client.IdfBox.prototype.setColor = function (value, el)
{
  this.color = value;
  el.style.color = this.color || "";
};


Client.IdfBox.prototype.setFontModifiers = function (value, el)
{
  this.fontModifiers = value;
  el.style.fontWeight = value.indexOf("B") > -1 ? "bold" : "";
  el.style.fontStyle = value.indexOf("I") > -1 ? "italic" : "";
  if (value.indexOf("U") > -1)
    el.style.textDecoration = "underline";
  else if (value.indexOf("S") > -1)
    el.style.textDecoration = "line-through";
  else
    el.style.textDecoration = "";
};


Client.IdfBox.prototype.setHorizontalAlignment = function (value, el)
{
  this.horizontalAlignment = value;
  switch (value) {
    case Client.IdfVisualStyle.alignments.LEFT:
      el.style.justifyContent = "left";
      break;
    case Client.IdfVisualStyle.alignments.CENTER:
      el.style.justifyContent = "center";
      break;
    case Client.IdfVisualStyle.alignments.RIGHT:
      el.style.justifyContent = "right";
      break;
    case Client.IdfVisualStyle.alignments.JUSTIFY:
      el.style.justifyContent = "justify";
      break;
    default:
      el.style.justifyContent = "";
      break;
  }
  //
  this.elements.forEach(child => {
    if (child instanceof Client.IdfSpan)
      child.updateElement({alignment: this.horizontalAlignment});
  });
};


Client.IdfBox.prototype.setVerticalAlignment = function (value, el)
{
  this.verticlaAlignment = value;
  switch (value) {
    case 1:
      el.style.alignItems = "";
      break;
    case 2:
      el.style.alignItems = "center";
      break;
    case 3:
      el.style.alignItems = "end";
      break;
  }
};


Client.IdfBox.prototype.canResizeW = function ()
{
  return (this.visualFlags & 0x1) && this.canTransform;
};

Client.IdfBox.prototype.canResizeH = function ()
{
  return (this.visualFlags & 0x2) && this.canTransform;
};

Client.IdfBox.prototype.canMoveX = function ()
{
  return (this.visualFlags & 0x4) && this.canTransform;
};

Client.IdfBox.prototype.canMoveY = function ()
{
  return (this.visualFlags & 0x8) && this.canTransform;
};

Client.IdfBox.prototype.canCancelMove = function ()
{
  return (this.visualFlags & 0x10);
};

Client.IdfBox.prototype.isMoveable = function ()
{
  return this.canMoveX() || this.canMoveY();
};

Client.IdfBox.prototype.isResizable = function ()
{
  return this.canResizeW() || this.canResizeH();
};

Client.IdfBox.prototype.isClickable = function ()
{
  return this.visualFlags & 0x20;
};

Client.IdfBox.prototype.isDraggable = function ()
{
  // Mastro BOXES are not draggable or transformable
  return this.page.parent.canDrag && this.canDrag;
};

Client.IdfBox.prototype.isTransformable = function ()
{
  return this.canTransform;
};

Client.IdfBox.prototype.acceptsDrop = function (widget)
{
  return this.page.parent.canDrop && this.canDrop;
};

/**
 * Apply visual style
 */
Client.IdfBox.prototype.applyVisualStyle = function ()
{
  let alternate = this.parent instanceof Client.IdfSection && this.parent.recordNumber % 2 === 0;
  let visOptions = {objType: "field", list: true, alternate: alternate, bookBox: true};
  this.addVisualStyleClasses(this.getRootObject(true), visOptions);
};


/**
 * Apply padding
 * @param {Object} el
 */
Client.IdfBox.prototype.adjustPadding = function (el)
{
  let needPadding = true;
  if (this.subForm || this.graphFile || this.image)
    needPadding = false;
  else
  {
    let containsText = false;
    if (this.elements && this.elements[0] instanceof Client.IdfSpan)
      containsText = !this.elements[0].mimeType || this.elements[0].mimeType.startsWith("text/");
    //
    let hasBorders = false;
    if (this.visualStyle) {
      let vs = Client.IdfVisualStyle.getByIndex(this.visualStyle);
      if (![Client.IdfVisualStyle.borderTypes.CUSTOM, Client.IdfVisualStyle.borderTypes.NONE].includes(vs.getPropertyValue(Client.IdfVisualStyle.transPropMap.bor1)))
        hasBorders = true;
    }
    //
    needPadding = containsText && hasBorders;
  }
  //
  Client.Widget.updateElementClassName(this.getRootObject(true), "book-box-text", !needPadding);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfBox.prototype.onEvent = function (event)
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
 * Handle click on the box
 * @param {Object} event
 */
Client.IdfBox.prototype.handleClick = function (event)
{
  let events = [];
  //
  if (!this.canClick)
    return events;
  //
  events.push({
    id: "clk",
    def: this.clickEventDef,
    content: {
      oid: this.id
    }
  });
  //
  return events;
};


Client.IdfBox.prototype.applyDragDropCursor = function (cursor)
{
  let obj = this.getRootObject();
  if (cursor) {
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


Client.IdfBox.prototype.onTransform = function (options)
{
  let x = options.x;
  let y = options.y;
  let w = options.w;
  let h = options.h;
  //
  // The X and Y coords are absolute, we must
  // - adapt them to the container
  // - convert into UM
  let page = this.page;
  let rct = this.parent.getRootObject().getBoundingClientRect();
  let xc = Client.IdfBookPage.convertFromPx(x - rct.x, page.unitOfMeasure);
  let yc = Client.IdfBookPage.convertFromPx(y - rct.y, page.unitOfMeasure);
  //
  // Convert from px into UM width and height
  let wc = Client.IdfBookPage.convertFromPx(w, page.unitOfMeasure);
  let hc = Client.IdfBookPage.convertFromPx(h, page.unitOfMeasure);
  //
  // **********************************************
  // Changes under 1mm/equivalent are not useful
  //
  // This is really obscure, but it is what RD3 is doing and since we must send the same values
  // we need to do it anyway....
  // **********************************************
  let chg = 1;
  if (page.unitOfMeasure === Client.IdfBookPage.unitsOfMeasure.INCHES)
    chg = 1 / 0.04;
  xc = Math.round(xc * chg) / chg;
  yc = Math.round(yc * chg) / chg;
  wc = Math.round(wc * chg) / chg;
  hc = Math.round(hc * chg) / chg;
  //
  let events = [];
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "trasf",
      def: this.transformEventDef,
      content: {
        oid: this.id,
        obn: "",
        par1: xc,
        par2: yc,
        par3: wc,
        par4: hc
      }
    });
  }
  else {
    // TODO
  }
  Client.mainFrame.sendEvents(events);
};

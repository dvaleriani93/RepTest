/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A frame object
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfFrame = function (widget, parent, view)
{
  // If no widget do nothing.
  // I need this protection because there are some classes (ex: idfButtonBar) that extend this class
  if (!widget)
    return;
  //
  this.children = widget.children;
  //
  // Set default values
  widget = Object.assign({
    caption: "",
    icon: "",
    vertical: false,
    onlyContent: !this.isLeaf(),
    showBorder: false,
    collapsible: true,
    collapsed: false,
    lockable: !Client.mainFrame.isIDF,
    locked: !Client.mainFrame.isIDF,
    visible: true,
    enabled: true,
    showToolbar: true,
    showStatusbar: false,
    showScrollbar: Client.IdfFrame.scrollbarTypes.both,
    smallIcons: false,
    className: "",
    canDrag: false,
    canDrop: false,
    //
    // Set default events definition
    collapseEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.ACTIVE : undefined),
    mouseClickEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.CLIENTSIDE : undefined),
    mouseDoubleClickEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.CLIENTSIDE : undefined),
    collapseAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("frame")
  }, widget);
  //
  this.defaultGridClass = Client.mainFrame?.wep?.defaultResponsiveClass || Client.Utils.getCSSVarValue("--default-responsive-class");
  //
  let realHandledKeys = widget.handledKeys;
  widget.handledKeys = -1;
  //
  // A frame into an IdfTab may have 0 as both originalWidth and originalHeight. In this case get them from IdfTabbedView
  if (parent instanceof Client.IdfTab) {
    widget.originalWidth = widget.originalWidth || parent.parent.originalWidth;
    widget.originalHeight = widget.originalHeight || parent.parent.originalHeight;
  }
  //
  Client.Widget.call(this, widget, parent, view);
  //
  this.handledKeys = realHandledKeys;
};


// Make Client.IdfFrame extend Client.Widget
Client.IdfFrame.prototype = new Client.Widget();


Client.IdfFrame.transPropMap = {
  ver: "vertical",
  fr1: "frame1",
  fr2: "frame2",
  orw: "originalWidth",
  orh: "originalHeight",
  miw: "minWidth",
  mih: "minHeight",
  maw: "maxWidth",
  mah: "maxHeight",
  cms: "commandSet",
  ocn: "onlyContent",
  frb: "showBorder",
  clp: "collapsible",
  col: "collapsed",
  lkb: "lockable",
  lok: "locked",
  vis: "visible",
  ena: "enabled",
  img: "icon",
  stb: "showToolbar",
  ssb: "showStatusbar",
  smi: "smallIcons",
  scr: "showScrollbar",
  dcl: "deleteFrame",
  clc: "collapseEventDef",
  mck: "mouseClickEventDef",
  mdk: "mouseDoubleClickEventDef",
  cla: "collapseAnimationDef",
  dra: "canDrag",
  dro: "canDrop"
};


Client.IdfFrame.scrollbarTypes = {
  none: 0,
  horizontal: 1,
  vertical: 2,
  both: 3
};


/**
 * Create element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfFrame.createConfigFromXml = function (xml)
{
  return {isSubFrame: xml.nodeName === "suf"};
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfFrame.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfFrame.transPropMap.ver:
      case Client.IdfFrame.transPropMap.ocn:
      case Client.IdfFrame.transPropMap.frb:
      case Client.IdfFrame.transPropMap.clp:
      case Client.IdfFrame.transPropMap.col:
      case Client.IdfFrame.transPropMap.lkb:
      case Client.IdfFrame.transPropMap.lok:
      case Client.IdfFrame.transPropMap.vis:
      case Client.IdfFrame.transPropMap.ena:
      case Client.IdfFrame.transPropMap.stb:
      case Client.IdfFrame.transPropMap.ssb:
      case Client.IdfFrame.transPropMap.dcl:
      case Client.IdfFrame.transPropMap.dra:
      case Client.IdfFrame.transPropMap.dro:
        props[p] = props[p] === "1";
        break;

      case Client.IdfFrame.transPropMap.orw:
      case Client.IdfFrame.transPropMap.orh:
      case Client.IdfFrame.transPropMap.miw:
      case Client.IdfFrame.transPropMap.mih:
      case Client.IdfFrame.transPropMap.maw:
      case Client.IdfFrame.transPropMap.mah:
      case Client.IdfFrame.transPropMap.clc:
      case Client.IdfFrame.transPropMap.scr:
      case Client.IdfFrame.transPropMap.mck:
      case Client.IdfFrame.transPropMap.mdk:
        props[p] = parseInt(props[p]);
        break;
    }
  }
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfFrame.prototype.getRootObject = function (el)
{
  let rootObject = this.moving ? this.mainObjects[0] : this.mainObjects[0].elements[1];
  return el ? rootObject : rootObject.domObj;
};


/**
 * Get root object used by handleResize
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfFrame.prototype.getResizeRootObject = function (el)
{
  let mainContainer = Client.eleMap[this.mainContainerConf.id];
  return el ? mainContainer : mainContainer.getRootObject();
};


/**
 * Create elements configuration
 * @param {Object} widget
 */
Client.IdfFrame.prototype.createElementsConfig = function (widget)
{
  // Create main container configuration
  let className = "frame-container collapsible-container";
  if (!this.isLeaf())
    className += " wireframe";
  if (this.isSubFrame)
    className += " subframe-container";
  if (this.inPreview)
    className += " inpreview";
  //
  this.mainContainerConf = this.createElementConfig({c: "Container", className, events: ["onClick", "onDblclick", "onContextmenu", "onFocusin"]});
  this.mainContainerConf.animations = [
    {trigger: "animation", prop: "collapseElement", duration: (widget.collapseAnimationDef.indexOf("none") === 0 ? 0 : 250)},
    {trigger: "animation", prop: "expandElement", duration: (widget.collapseAnimationDef.indexOf("none") === 0 ? 0 : 250)}
  ];
  //
  // Create toolbar configuration
  this.createToolbarConfig(widget);
  //
  // Create content container configuration
  this.contentContainerConf = this.createElementConfig({c: "Container", className: "frame-content"});
  this.mainContainerConf.children.push(this.contentContainerConf);
};


/**
 * Create toolbar configuration
 * @param {Object} widget
 */
Client.IdfFrame.prototype.createToolbarConfig = function (widget)
{
  // Create toolbar configuration
  this.toolbarConf = this.createElementConfig({c: "IonItem", type: "header", className: "frame-toolbar" + (this.isSubFrame ? " subframe-toolbar" : "")});
  this.mainContainerConf.children.push(this.toolbarConf);
  //
  // Create menubutton configuration
  this.menuButtonConf = this.createElementConfig({c: "IonButton", icon: "menu", className: "generic-btn frame-toolbar-btn frame-menu-btn", events: ["onClick"], visible: false});
  this.toolbarConf.children.push(this.menuButtonConf);
  //
  // Create collapse button configuration
  this.collapseButtonConf = this.createElementConfig({c: "IonButton", icon: "arrow-dropup", className: "generic-btn frame-toolbar-btn frame-collapse-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.collapseButtonConf);
  //
  // Create lock button configuration
  this.lockButtonConf = this.createElementConfig({c: "IonButton", icon: "lock", className: "generic-btn frame-toolbar-btn frame-lock-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.lockButtonConf);
  //
  // Create icon button configuration
  this.iconButtonConf = this.createElementConfig({c: "IonButton", className: "generic-btn frame-toolbar-btn frame-icon-btn"});
  this.toolbarConf.children.push(this.iconButtonConf);
  //
  // Create title configuration
  this.titleConf = this.createElementConfig({c: "IonLabel", className: "frame-title"});
  this.toolbarConf.children.push(this.titleConf);
  //
  // Create caption configuration
  this.captionConf = this.createElementConfig({c: "Span", className: "frame-caption"});
  this.titleConf.children.push(this.captionConf);
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfFrame.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  this.createElementsConfig(widget);
  //
  // Create the main container
  this.mainObjects.push(view.createElement(this.mainContainerConf, parent, view));
  this.mainObjects[0].getRootObject()?.setAttribute("spellcheck", "false");
  //
  // Create widget children
  this.createChildren(widget);
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfFrame.prototype.createChildren = function (el)
{
  Client.Widget.prototype.createChildren.call(this, el);
  //
  if (this.elements[0] instanceof Client.IdfCustomElement) {
    let controlConf = this.createElementConfig({c: "IdfControl", customElement: this.customElement, container: this.getRootObject(true)});
    this.control = this.insertBefore({child: controlConf});
  }
  //
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfFrame.prototype.updateElement = function (props)
{
  let methodsToCall = {};
  //
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  let mainContainer = Client.eleMap[this.mainContainerConf.id];
  //
  // If width changes at run-time server (IDF) will send width, minWidth and maxWidth with the same value.
  // In this case I also have to update originalWidth
  let fixedWidth, fixedHeight;
  if (props.width !== undefined && props.width === props.minWidth && props.minWidth === props.maxWidth) {
    props.originalWidth = props.width;
    fixedWidth = true;
  }
  //
  // If height changes at run-time server (IDF) will send height, minHeight and maxHeight with the same value.
  // In this case I also have to update originalHeight
  if (props.height !== undefined && props.height === props.minHeight && props.minHeight === props.maxHeight) {
    props.originalHeight = props.height;
    fixedHeight = true;
  }
  //
  // In case of fixed width/height, add borders width to width/height to avoid unwanted scrollbars
  if (fixedWidth || fixedHeight) {
    let computedStyle = getComputedStyle(this.getResizeRootObject());
    let bordersWidth;
    //
    if (fixedWidth) {
      bordersWidth = parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth);
      props.width += bordersWidth;
      props.minWidth += bordersWidth;
      props.maxWidth += bordersWidth;
    }
    //
    if (fixedHeight) {
      bordersWidth = parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth);
      props.height += bordersWidth;
      props.minHeight += bordersWidth;
      props.maxHeight += bordersWidth;
    }
  }
  //
  if (props.width !== undefined) {
    this.width = isNaN(props.width) ? undefined : props.width;
    methodsToCall.calcLayout = true;
  }
  //
  if (props.height !== undefined) {
    this.height = isNaN(props.height) ? undefined : props.height;
    methodsToCall.calcLayout = true;
  }
  if (props.originalWidth !== undefined) {
    this.originalWidth = isNaN(props.originalWidth) ? undefined : props.originalWidth;
    methodsToCall.calcLayout = true;
  }
  //
  if (props.originalHeight !== undefined) {
    this.originalHeight = isNaN(props.originalHeight) ? undefined : props.originalHeight;
    methodsToCall.calcLayout = true;
  }
  //
  if (props.minWidth !== undefined) {
    this.minWidth = isNaN(props.minWidth) ? undefined : props.minWidth;
    methodsToCall.calcLayout = true;
  }
  //
  if (props.minHeight !== undefined) {
    this.minHeight = isNaN(props.minHeight) ? undefined : props.minHeight;
    methodsToCall.calcLayout = true;
  }
  //
  if (props.maxWidth !== undefined) {
    this.maxWidth = isNaN(props.maxWidth) ? undefined : props.maxWidth;
    methodsToCall.calcLayout = true;
  }
  //
  if (props.maxHeight !== undefined) {
    this.maxHeight = isNaN(props.maxHeight) ? undefined : props.maxHeight;
    methodsToCall.calcLayout = true;
  }
  //
  if (props.caption !== undefined)
    methodsToCall.updateToolbar = true;
  //
  if (props.vertical !== undefined) {
    this.vertical = props.vertical;
    //
    let el = Client.eleMap[this.contentContainerConf.id];
    Client.Widget.updateElementClassName(el, "horizontal", props.vertical);
    Client.Widget.updateElementClassName(el, "vertical", !props.vertical || !this.frame1);
  }
  //
  if (props.onlyContent !== undefined) {
    this.onlyContent = props.onlyContent;
    //
    let el = Client.eleMap[this.toolbarConf.id];
    el.updateElement({visible: !props.onlyContent});
  }
  //
  if (props.showBorder !== undefined) {
    this.showBorder = props.showBorder;
    Client.Widget.updateElementClassName(mainContainer, "frame-border", !this.showBorder);
  }
  //
  if (props.collapsible !== undefined) {
    this.collapsible = props.collapsible;
    methodsToCall.updateToolbar = true;
  }
  //
  if (props.collapsed !== undefined) {
    this.setCollapsed(props.collapsed);
    methodsToCall.updateToolbar = true;
  }
  //
  if (props.lockable !== undefined) {
    this.lockable = props.lockable;
    methodsToCall.updateToolbar = true;
  }
  //
  if (props.locked !== undefined) {
    // Remove old class
    Client.Widget.updateElementClassName(mainContainer, this.locked ? "locked" : "unlocked", true);
    //
    this.locked = props.locked;
    methodsToCall.updateToolbar = true;
    //
    // Add new class
    Client.Widget.updateElementClassName(mainContainer, this.locked ? "locked" : "unlocked");
    //
    methodsToCall.applyVisualStyle = true;
  }
  //
  if (props.visible !== undefined) {
    this.visible = props.visible;
    //
    this.setFrameVisible(this.visible);
    //
    // Update the layout of the view
    this.parentIdfView?.calcLayout();
    //
    methodsToCall.updateStructure = true;
  }
  //
  if (props.enabled !== undefined)
    this.enabled = props.enabled;
  if (props.canDrag !== undefined)
    this.canDrag = props.canDrag;
  if (props.canDrop !== undefined)
    this.canDrop = props.canDrop;
  //
  if (props.icon !== undefined) {
    this.icon = props.icon;
    methodsToCall.updateToolbar = true;
  }
  //
  if (props.showToolbar !== undefined) {
    this.showToolbar = props.showToolbar;
    methodsToCall.updateToolbar = true;
  }
  //
  if (props.showStatusbar !== undefined) {
    this.showStatusbar = props.showStatusbar;
    methodsToCall.updateToolbar = true;
  }
  //
  if (props.smallIcons !== undefined) {
    this.smallIcons = props.smallIcons;
    this.handleSmallIcons();
    methodsToCall.calcLayout = true;
  }
  if (props.showScrollbar !== undefined) {
    // Remove old class
    let scrollClasses = ["scroll-none", "scroll-horizontal", "scroll-vertical", "scroll-both"];
    Client.Widget.updateElementClassName(mainContainer, scrollClasses[this.showScrollbar], true);
    //
    this.showScrollbar = props.showScrollbar;
    //
    // Add new class
    Client.Widget.updateElementClassName(mainContainer, scrollClasses[this.showScrollbar]);
  }
  //
  if (props.className !== undefined) {
    // Remove old class
    Client.Widget.updateElementClassName(mainContainer, this.className, true);
    if (this.gridClass)
      Client.Widget.updateElementClassName(mainContainer, this.gridClass, true);
    //
    this.className = props.className;
    //
    // The className can have a responsive grid, in that case we must extract it
    let cls = Client.Widget.extractGridClasses(this.className);
    this.className = cls.className;
    this.gridClass = cls.gridClass || this.defaultGridClass;
    //
    // Add new class
    Client.Widget.updateElementClassName(mainContainer, this.className);
    if (this.gridClass)
      Client.Widget.updateElementClassName(mainContainer, this.gridClass);
  }
  //
  if (props.collapseEventDef !== undefined)
    this.collapseEventDef = props.collapseEventDef;
  if (props.mouseClickEventDef !== undefined)
    this.mouseClickEventDef = props.mouseClickEventDef;
  if (props.mouseDoubleClickEventDef !== undefined)
    this.mouseDoubleClickEventDef = props.mouseDoubleClickEventDef;
  //
  let methods = Object.keys(methodsToCall);
  for (let i = 0; i < methods.length; i++) {
    let method = methods[i];
    //
    if (method === "calcLayout" || method === "updateStructure") {
      // Skip calcLayout if I'm realizing and my parent is a frame or a view.
      // In this case my parent will calculate layout when all children will have been created
      if (this.realizing && (this.parent instanceof Client.IdfFrame || this.parent instanceof Client.IdfView))
        continue;
    }
    //
    // If I'm an extended class having current method defined in my prototype, I'll call that method during my updateElement
    if (this[method] !== Client.IdfFrame.prototype[method])
      props[method] = true;
    else if (this[method]) // Otherwise call base method
      this[method]();
  }
  //
  if (props.deleteFrame)
    this.close(true);
  //
  if (props.style && props.fromanim) {
    // This is the altcontainer animation style set
    let tgt = this.getAnimationRoot();
    //
    if (props.style !== "") {
      if (typeof props.style === "string") {
        try {
          props.style = JSON.parse(props.style);
        }
        catch (ex) {
        }
      }
      //
      // Set new style
      var kk = Object.keys(props.style);
      for (var j = 0; j < kk.length; j++) {
        var pr = kk[j];
        var v = props.style[pr];
        //
        if (Client.Utils.requireAbs(pr))
          v = Client.Utils.absStyle(v);
        //
        // If the user wrote !important in the value we should use the setProperty (no IE<9)
        if (v && v.indexOf && v.indexOf("!important") > 0)
          tgt.style.setProperty(pr, v.replace("!important", ""), "important");
        else
          tgt.style[pr] = v;
      }
    }
    else {
      // Resetting object style
      tgt.style.cssText = "";
    }
  }
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfFrame.prototype.onEvent = function (event)
{
  let events = [];
  //
  if (event.content instanceof Array && this.customElement) {
    events.push(...this.customElement.onEvent(event));
    events.forEach(e => e.content.oid = this.id);
  }
  else {
    events.push(...Client.Widget.prototype.onEvent.call(this, event));
    //
    switch (event.id) {
      case "chgProp":
        if (this.customElement)
          events.push(...this.customElement.onEvent(event));
        break;

      case "onClick":
      case "onDblclick":
      case "onContextmenu":
        events.push(...this.handleFrameClick(event));
        //
        if (event.id === "onClick") {
          if (event.obj === this.collapseButtonConf.id)
            events.push(...this.handleCollapseButtonClick(event));
          //
          if (event.obj === this.menuButtonConf.id)
            events.push(...this.handleMenuButtonClick(event));
        }
        break;

      case "onFocusin":
        if (event.content?.srcEvent?.target !== document.activeElement)
          this.focus();
        break;
    }
  }
  //
  return events;
};


/**
 * Handle click on collapse button
 * @param {Object} event
 */
Client.IdfFrame.prototype.handleCollapseButtonClick = function (event)
{
  let events = [];
  //
  let collapsed = this.collapsed;
  //
  // If I'm on IDF, change collapsed status just if collapse event has to be handled client side too
  if (!this.events.includes("onCollapseChanging") || (Client.mainFrame.isIDF && Client.IdfMessagesPump.isClientSideEvent(this.collapseEventDef)))
    this.updateElement({collapsed: !collapsed});
  //
  // Send collapse event
  if (Client.mainFrame.isIDF)
    events.push({
      id: "col",
      def: this.collapseEventDef,
      content: {
        oid: this.id,
        obn: !collapsed ? "col" : "exp",
        xck: event.content.offsetX,
        yck: event.content.offsetY
      }
    });
  else
    events.push({
      id: "chgProp",
      obj: this.id,
      content: {
        name: "collapsed",
        value: !collapsed,
        clid: Client.id
      }
    });
  //
  return events;
};


/**
 * Handle click on menu button
 * @param {Object} event
 */
Client.IdfFrame.prototype.handleMenuButtonClick = function (event)
{
  let events = [];
  //
  if (this.parentIdfView) {
    if (!this.parentIdfView.owner && !this.parentIdfView.backButtonText) // Menu button: Show the menu
      Client.mainFrame.wep?.commandList.toggleMenu();
    else   // BackButton: close this view
      events.push(...this.parentIdfView.handleCloseButtonClick());
  }
  //
  return events;
};


/**
 * Get widget requirements
 * @param {Object} w
 */
Client.IdfFrame.getRequirements = function (w)
{
  return Client.IdfView.getRequirements(w);
};


/**
 * Calculate layout rules to handle resize mode
 */
Client.IdfFrame.prototype.calcLayout = function ()
{
  if (this.realizing || this.toolbarHeight === undefined)
    this.calcDimensions();
  //
  if (Client.mainFrame.isIDF && !this.isLeaf()) {
    // Check wireframe frame visibility: if all children are not visibile this frame need to be hidden
    let vis = this.isFrameVisible();
    if (vis !== this.visible) {
      this.setFrameVisible(vis);
      this.visible = vis;
    }
    //
    // No need to layout me and all my children
    if (!vis)
      return;
  }
  //
  let style = {};
  //
  // Get default min height
  let minHeight = this.onlyContent ? 0 : this.getToolbarHeight();
  //
  if (this.isSubFrame && this.parent instanceof Client.IdfPanel)
    style.minHeight = minHeight + "px";
  else {
    let isStaticFieldChild = (this.parentWidget?.parentWidget instanceof Client.IdfField) && this.parentWidget.parentWidget.isStatic();
    //
    // If there is a width, set it using resize mode rules
    if (this.originalWidth && !isStaticFieldChild) {
      if (this.parentIdfView?.resizeWidth === Client.IdfView.resizeModes.NONE) {
        style.maxWidth = this.originalWidth + "px";
        style.width = this.originalWidth + "px";
      }
      else if (this.parentIdfView?.resizeWidth === Client.IdfView.resizeModes.EXTEND && !this.isLeaf())
        style.minWidth = this.originalWidth + "px";
    }
    //
    // If width has not be set, set it using percentage
    if (!style.width) {
      let widthPerc = 100;
      //
      if (this.parent.getChildPercentageWidth)
        widthPerc = this.parent.getChildPercentageWidth(this.originalWidth);
      //
      style.width = widthPerc + "%";
      style.maxWidth = widthPerc + "%";
      //
      // If my parent is horizontal and my brother has the maxWidth property in this phase i must set my max-width to 100%.
      if (!this.parent.vertical && this.parent instanceof Client.IdfFrame) {
        // Check my brother maxWidth property
        let brother = Client.eleMap[this.parent.frame1] === this ? Client.eleMap[this.parent.frame2] : Client.eleMap[this.parent.frame1];
        if (brother?.hasMaxWidth())
          style.maxWidth = "100%";
      }
      //
      if (!this.isLeaf() && !this.vertical && this.hasMaxWidth()) {
        // If all my child frame have a max width i must apply their sum to me
        style.maxWidth = this.getMaxWidth() + "px";
      }
      //
      this.width = (widthPerc * (this.parent.originalWidth || this.parent.width || this.calculatedWidth)) / 100;
    }
    //
    // If there is a height, set it using resize mode rules
    if (this.originalHeight) {
      if (this.parentIdfView?.resizeHeight === Client.IdfView.resizeModes.NONE) {
        style.height = this.originalHeight + "px";
        style.maxHeight = this.originalHeight + "px";
      }
      else if (this.parentIdfView?.resizeHeight === Client.IdfView.resizeModes.EXTEND && !this.isLeaf())
        style.minHeight = (this.originalHeight < minHeight ? minHeight : this.originalHeight) + "px";
    }
    //
    // If min height has not be set, set it using default one
    if (!style.minHeight)
      style.minHeight = minHeight + "px";
    //
    // If height has not be set, set it using percentage
    if (!style.height) {
      let heightPerc = 100;
      //
      if (this.parent.getChildPercentageHeight)
        heightPerc = this.parent.getChildPercentageHeight(this.originalHeight);
      //
      style.height = heightPerc + "%";
      //
      this.height = (heightPerc * (this.parent.height || this.calculatedHeight)) / 100;
      //
      if (!this.isLeaf() && !style.maxHeight && this.vertical && this.hasMaxHeight()) {
        // If all my child frame have a max width i must apply their sum to me
        style.maxHeight = this.getMaxHeight() + "px";
      }
    }
  }
  //
  // Set max/min width/height (if any)
  if (this.minWidth)
    style.minWidth = this.minWidth + "px";
  if (this.minHeight)
    style.minHeight = this.minHeight + "px";
  if (this.maxWidth)
    style.maxWidth = this.maxWidth + "px";
  if (this.maxHeight)
    style.maxHeight = this.maxHeight + "px";
  //
  // Update main container style
  this.mainStyle = this.mainStyle || {};
  Client.Widget.updateStyle(Client.eleMap[this.mainContainerConf.id], this.mainStyle, style);
  //
  // Don't calculate children layout in case of IdfPanel. The panel itself will handle its children
  if (this instanceof Client.IdfPanel)
    return;
  //
  // Tell my children to calculate their layout
  for (let i = 0; i < this.elements.length; i++) {
    if (this.elements[i].calcLayout)
      this.elements[i].calcLayout();
  }
};


/**
 * Get child width as a percentage of parent width
 * @param {Integer} childWidth
 * @param {Integer} parentWidth
 */
Client.IdfFrame.prototype.getChildPercentageWidth = function (childWidth, parentWidth)
{
  parentWidth = parentWidth || this.originalWidth;
  if (parentWidth === undefined) {
    let mainContainer = Client.eleMap[this.mainContainerConf.id].getRootObject();
    parentWidth = mainContainer.clientWidth;
  }
  //
  // If child has not an explicit width, calculate it
  if (childWidth === undefined) {
    // If this frame has an horizontal alignment, assign an equal portion of residual width to all children having no width
    if (!this.vertical) {
      let noWidthChildren = 0;
      //
      // Calculate residual width subtracting children widths from parent width
      let residualWidth = parentWidth;
      for (let i = 0; i < this.elements.length; i++) {
        let frame = this.elements[i];
        residualWidth -= (frame.width || 0);
        //
        // Count children having no width
        if (frame.width === undefined)
          noWidthChildren++;
      }
      //
      // Set child width as a portion of residual width
      childWidth = residualWidth / noWidthChildren;
    }
    else // Otherwise use parent width has child width
      childWidth = parentWidth;
  }
  //
  // I have to distribute invisible frames width to visible ones
  let visibleFrames = 0;
  let notVisibleWidth = 0;
  this.elements.forEach(el => {
    if (el instanceof Client.IdfFrame) {
      let vis = el.isFrameVisible();
      visibleFrames += vis ? 1 : 0;
      notVisibleWidth += !vis ? el.originalWidth : 0;
    }
  });
  //
  // If there are a width to distribute, do it
  if (notVisibleWidth)
    childWidth += (notVisibleWidth / visibleFrames);
  //
  let percentageWidth = 100;
  if (parentWidth)
    percentageWidth = (childWidth / parentWidth) * 100;
  //
  percentageWidth = Math.min(percentageWidth, 100);
  //
  return percentageWidth;
};


/**
 * Get child height as a percentage of parent height
 * @param {Integer} childHeight
 * @param {Integer} parentHeight
 */
Client.IdfFrame.prototype.getChildPercentageHeight = function (childHeight, parentHeight)
{
  parentHeight = parentHeight || this.height;
  if (parentHeight === undefined) {
    let mainContainer = Client.eleMap[this.mainContainerConf.id].getRootObject();
    parentHeight = mainContainer.clientHeight;
  }
  //
  // If child has not an explicit height, calculate it
  if (childHeight === undefined) {
    // If this frame has a vertical alignment, assign an equal portion of residual heigth to all children having no height
    if (this.vertical) {
      let noHeightChildren = 0;
      //
      // Calculate residual height subtracting children heights from parent height
      let residualHeight = parentHeight;
      for (let i = 0; i < this.elements.length; i++) {
        let elHeight = this.elements[i].height;
        residualHeight -= (elHeight || 0);
        //
        // Count children having no height
        if (elHeight === undefined)
          noHeightChildren++;
      }
      //
      // Set child height as a portion of residual height
      childHeight = residualHeight / noHeightChildren;
    }
    else // Otherwise use parent height has child height
      childHeight = parentHeight;
  }
  //
  // I have to distribute invisible frames height to visible ones
  let visibleFrames = 0;
  let notVisibleHeight = 0;
  this.elements.forEach(el => {
    if (el instanceof Client.IdfFrame) {
      let vis = el.isFrameVisible();
      visibleFrames += vis ? 1 : 0;
      notVisibleHeight += !vis ? el.originalHeight : 0;
    }
  });
  //
  // If there are a height to distribute, do it
  if (notVisibleHeight)
    childHeight += (notVisibleHeight / visibleFrames);
  //
  let percentageHeight = 100;
  if (parentHeight)
    percentageHeight = (childHeight / parentHeight) * 100;
  //
  // If there is only one child, it has to fill all available height
  if (this.elements.length === 1)
    percentageHeight = 100;
  //
  percentageHeight = Math.min(percentageHeight, 100);
  //
  return percentageHeight;
};


/**
 * Returns true if this frame is a leaf
 */
Client.IdfFrame.prototype.isLeaf = function ()
{
  let isLeaf = true;
  //
  // If at least on of my children is an IdfFrame (or a derived class), it means I'm not a leaf
  let children = this.children || [];
  for (let i = 0; i < children.length; i++) {
    if (Client.Widget.isFrameClass(children[i].c) || Client.Widget.isFrameClass(children[i].class)) {
      isLeaf = false;
      break;
    }
  }
  //
  return isLeaf;
};


/**
 * Get toolbar height
 */
Client.IdfFrame.prototype.getToolbarHeight = function ()
{
  return this.toolbarHeight;
};


/**
 * Calculate objects dimensions
 */
Client.IdfFrame.prototype.calcDimensions = function ()
{
  let mainContainer = Client.eleMap[this.mainContainerConf.id].getRootObject();
  this.calculatedWidth = mainContainer.clientWidth;
  this.calculatedHeight = mainContainer.clientHeight;
  //
  let toolbar = Client.eleMap[this.toolbarConf.id].getRootObject();
  this.toolbarHeight = toolbar.offsetHeight;
  if (this.toolbarHeight !== 0) {
    let compStyle = getComputedStyle(toolbar);
    this.toolbarHeight += (parseInt(compStyle.marginTop) || 0) + (parseInt(compStyle.marginBottom) || 0);
  }
};


/**
 * Collapse/expand frame content
 * @param {Boolean} collapsed
 */
Client.IdfFrame.prototype.setCollapsed = function (collapsed)
{
  let mainContainer = Client.eleMap[this.mainContainerConf.id];
  //
  if (this.minHeight && collapsed) {
    // If this frame has a min-height during the animation we need to change its value to the default (toolbar height)
    // and restore if expanding
    let minHeight = this.onlyContent ? 0 : this.getToolbarHeight();
    mainContainer.updateElement({style: {minHeight: minHeight + "px"}});
  }
  //
  // Remove old class
  Client.Widget.updateElementClassName(mainContainer, this.collapsed ? "collapsed" : "expanded", true);
  //
  this.collapsed = collapsed;
  //
  // Add new class
  Client.Widget.updateElementClassName(mainContainer, this.collapsed ? "collapsed" : "expanded");
  //
  let realizing = this.realizing;
  clearTimeout(this.overflowTimer);
  this.overflowTimer = setTimeout(() => {
    if (this.minHeight && !collapsed) {
      // If this frame has a min-height during the animation we need to change its value to the default (toolbar height)
      // and restore if expanding
      mainContainer.updateElement({style: {minHeight: this.minHeight + "px"}});
    }
    //
    delete this.overflowTimer;
    let contentEl = Client.eleMap[this.contentContainerConf.id];
    contentEl.updateElement({style: {overflow: this.collapsed ? "hidden" : ""}});
    //
    if (!realizing)
      setTimeout(() => this.parentIdfView?.onResize(), 100);
    //
    if (this.collapsed) {
      if (this.inPreview)
        this.parent.removeChild(this);
    }
    else
      this.focus({ifJustFocused: true});
  }, 250);
};


Client.IdfFrame.prototype.showLockButton = function ()
{
  return this.lockable && !this.collapsed;
};


/**
 * Update toolbar
 */
Client.IdfFrame.prototype.updateToolbar = function ()
{
  let tooltip;
  //
  // Update collapse button
  let collapsible = this.collapsible;
  //
  // If my parent is an IdfTabbedView, I can never collapse
  if (this.parent instanceof Client.IdfTab || Client.mainFrame.idfMobile)
    collapsible = false;
  //
  let collapseButton = Client.eleMap[this.collapseButtonConf.id];
  Client.Widget.updateObject(collapseButton, {visible: collapsible, icon: this.collapsed ? "arrow-dropdown" : "arrow-dropup"});
  //
  // Update collapse button tooltip
  tooltip = this.getTooltip(this.collapseButtonConf.id);
  if (tooltip?.content !== collapseButton.tooltip?.props?.content)
    Client.Widget.updateObject(collapseButton, {tooltip});
  //
  // Update lock button
  let lockButton = Client.eleMap[this.lockButtonConf.id];
  Client.Widget.updateObject(lockButton, {visible: this.showLockButton(), icon: this.locked ? "lock" : "unlock"});
  //
  // Update lock button tooltip
  tooltip = this.getTooltip(this.lockButtonConf.id);
  if (tooltip?.content !== lockButton.tooltip?.props?.content)
    Client.Widget.updateObject(lockButton, {tooltip});
  //
  // Update icon button
  let iconButton = Client.eleMap[this.iconButtonConf.id];
  //
  if (this.icon) {
    Client.Widget.setIconImage({image: this.icon, el: iconButton});
    Client.Widget.updateElementClassName(iconButton, "small", !this.smallIcons);
  }
  //
  // If there is an icon and I'm not collapsed, show icon element
  Client.Widget.updateObject(iconButton, {visible: !!this.icon && !this.collapsed});
  //
  // Update caption
  let caption = this.caption;
  //
  // If I have a caption and status bar is visible and I'm not collapsed, add ":" to caption
  if (this.caption && this.showStatusbar && !this.collapsed)
    caption += ":";
  //
  // Set caption on caption element
  let captionEl = Client.eleMap[this.captionConf.id];
  Client.Widget.updateObject(captionEl, {innerHTML: this.getHTMLIcon(caption)});
};


/**
 * Handle small icons changing css classes to toolbar elements
 */
Client.IdfFrame.prototype.handleSmallIcons = function ()
{
  // Set "small" class on toolbar
  let toolbar = Client.eleMap[this.toolbarConf.id];
  Client.Widget.updateElementClassName(toolbar, "small", !this.smallIcons);
  //
  // Set "small" class on toolbar children
  for (let i = 0; i < toolbar.elements.length; i++)
    Client.Widget.updateElementClassName(toolbar.elements[i], "small", !this.smallIcons);
  //
  // Set "small" class on title
  Client.Widget.updateElementClassName(Client.eleMap[this.titleConf.id], "small", !this.smallIcons);
  //
  // Set "small" class on caption
  Client.Widget.updateElementClassName(Client.eleMap[this.captionConf.id], "small", !this.smallIcons);
};


/**
 * Get tooltip for given object
 * @param {String} objId
 */
Client.IdfFrame.prototype.getTooltip = function (objId)
{
  let wep = Client.mainFrame.wep;
  let tooltip;
  //
  let title, content, fknum;
  switch (objId) {
    case this.collapseButtonConf.id:
      if (this.collapsed) {
        title = Client.IdfResources.t("TIP_TITLE_ShowFrame");
        content = wep?.SRV_MSG_ShowFrame || Client.IdfResources.t("SRV_MSG_ShowFrame");
      }
      else {
        title = Client.IdfResources.t("TIP_TITLE_HideFrame");
        content = wep?.SRV_MSG_HideFrame || Client.IdfResources.t("SRV_MSG_HideFrame");
      }
      break;

    case this.lockButtonConf.id:
      fknum = Client.IdfPanel.FKLocked;
      if (this.locked) {
        title = Client.IdfResources.t("TIP_TITLE_Unlock");
        content = wep?.SRV_MSG_Unlock || Client.IdfResources.t("SRV_MSG_Unlock");
      }
      else {
        title = Client.IdfResources.t("TIP_TITLE_Lock");
        content = wep?.SRV_MSG_Lock || Client.IdfResources.t("SRV_MSG_Lock");
      }
      break;
  }
  //
  tooltip = Client.Widget.getHTMLTooltip(title, content, fknum);
  //
  return tooltip;
};


/**
 * Apply visual style
 */
Client.IdfFrame.prototype.applyVisualStyle = function ()
{
};


/**
 * Get frame list
 * @param {Array} flist
 */
Client.IdfFrame.prototype.getFrameList = function (flist)
{
  for (let f = 0; f < this.elements.length; f++) {
    if (this.elements[f] instanceof Client.IdfFrame) {
      flist.push(this.elements[f]);
      this.elements[f].getFrameList(flist);
    }
    else if (this.elements[f] instanceof Client.IdfTab && this.elements[f].elements && this.elements[f].elements.length > 0) {
      flist.push(this.elements[f].elements[0]);
      this.elements[f].elements[0].getFrameList(flist);
    }
  }
};


/**
 * Realize toolbar command set
 * @param {Object} cmsConf
 */
Client.IdfFrame.prototype.realizeCommandSet = function (cmsConf)
{
  Client.eleMap[this.toolbarConf.id].insertBefore({child: cmsConf});
};


/**
 * Handle click on frame container
 * @param {Object} event
 */
Client.IdfFrame.prototype.handleFrameClick = function (event)
{
  let events = [];
  double = (event.id === "onDblclick");
  //
  // If the event is client side do nothing
  if (Client.mainFrame.isIDF && ((!double && this.mouseClickEventDef === Client.IdfMessagesPump.eventTypes.CLIENTSIDE) || (double && this.mouseDoubleClickEventDef === Client.IdfMessagesPump.eventTypes.CLIENTSIDE)))
    return events;
  //
  // Skip click occurred out of main container
  let currentTarget = event.content.srcEvent?.currentTarget;
  if (!Client.eleMap[this.mainContainerConf.id].getRootObject().contains(currentTarget) && currentTarget?.id !== this.mainContainerConf.id)
    return events;
  //
  let srcWidget;
  let srcElement = event.content.srcEvent?.srcElement;
  while (srcElement) {
    srcWidget = Client.eleMap[srcElement.id]?.parentWidget;
    if (srcWidget === this || srcWidget?.parentIdfFrame === this)
      break;
    //
    srcElement = srcElement.parentNode;
  }
  //
  let detail = this.getClickDetail(event, srcWidget || this);
  //
  // Give event IDF format
  if (Client.mainFrame.isIDF)
    events.push({
      id: "rawclk",
      def: (double ? this.mouseDoubleClickEventDef : this.mouseClickEventDef),
      content: {
        oid: this.id,
        obn: double,
        par1: (event.content.button || 0),
        par2: Math.floor(detail.xb) + "-" + Math.floor(detail.yb),
        par3: Math.floor(detail.x) + "-" + Math.floor(detail.y),
        par4: detail.par4,
        par5: detail.par5
      }
    });
  else {
    let ev = {
      obj: this.id,
      id: "fireOnClick",
      content: {
        double,
        ...event.content,
        ...detail
      }
    };
    delete ev.content.srcEvent;
    //
    events.push(ev);
  }
  //
  return events;
};


/**
 * Handle function keys
 * @param {Object} event
 */
Client.IdfFrame.prototype.handleFunctionKeys = function (event)
{
  let events = [];
  if (event.content.type !== "keydown")
    return events;
  //
  // First I check the frame toolbar
  events.push(...Client.mainFrame.wep?.commandList.handleFunctionKeys(event, this.parentIdfView.index/*, this.parentIdfView.getFrameIndex(this) + 1*/) || []);
  return events;
};


/**
 * Get click detail
 * @param {Object} event
 * @param {Widget} srcWidget
 */
Client.IdfFrame.prototype.getClickDetail = function (event, srcWidget)
{
  event.content = event.content || {};
  //
  let scrX = event.content.clientX;
  let scrY = event.content.clientY;
  let ret = {
    xb: scrX,
    yb: scrY,
    x: 0,
    y: 0
  };
  //
  if (ret.x < 0)
    ret.x = 0;
  if (ret.y < 0)
    ret.y = 0;
  //
  return ret;
};


/**
 * Update internal controls
 * @param {Object} propsToUpdate - example {visualStyle: true, editorType: true, ...}
 */
Client.IdfFrame.prototype.updateControls = function (propsToUpdate)
{
  if (!this.control)
    return false;
  //
  propsToUpdate = propsToUpdate || {};
  //
  let controlProps = {};
  Object.keys(propsToUpdate).forEach(p => controlProps[p] = this.customElement[p]);
  //
  this.control.updateElement(controlProps);
  return true;
};


/**
 * onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.IdfFrame.prototype.onResize = function (ev)
{
  this.calcDimensions();
  //
  Client.mainFrame.sendEvents(this.handleResize());
  Client.Widget.prototype.onResize.call(this, ev);
};


/**
 * Handle a resize event
 */
Client.IdfFrame.prototype.handleResize = function ()
{
  delete this.delayResize;
  //
  let events = [];
  if (!Client.mainFrame.isIDF)
    return events;
  //
  if (this.inPreview)
    return events;
  //
  // If the tab is not exposed don't send its resize info to the server, send it when selected
  if (this.parent instanceof Client.IdfTab && !this.parent.isActiveTab()) {
    this.delayResize = true;
    return events;
  }
  //
  let rootObject = this.getResizeRootObject();
  //
  let compStyle = getComputedStyle(rootObject);
  //
  let width = parseInt(rootObject.clientWidth) || 0;
  let height = parseInt(rootObject.clientHeight) || 0;
  //
  // When wep is realizing, browser fails to calculate gridHeight since it also add wep statusbar height!
  // So I need to remove it
  if (Client.mainFrame.wep?.realizing) {
    let statusbarHeight = Client.mainFrame.wep.statusbar?.getRootObject()?.clientHeight || 0;
    height -= statusbarHeight;
  }
  //
  let paddingLeft = parseInt(compStyle.paddingLeft) || 0;
  let paddingRight = parseInt(compStyle.paddingRight) || 0;
  let paddingTop = parseInt(compStyle.paddingTop) || 0;
  let paddingBottom = parseInt(compStyle.paddingBottom) || 0;
  //
  let marginLeft = parseInt(compStyle.marginLeft) || 0;
  let marginRight = parseInt(compStyle.marginRight) || 0;
  let marginTop = parseInt(compStyle.marginTop) || 0;
  let marginBottom = parseInt(compStyle.marginBottom) || 0;
  //
  width -= paddingLeft + paddingRight;
  width -= marginLeft + marginRight;
  height -= paddingTop + paddingBottom;
  height -= marginTop + marginBottom;
  if (width !== this.lastWidth || height !== this.lastHeight) {
    if (Client.mainFrame.isIDF) {
      events.push({
        id: "resize",
        def: Client.IdfMessagesPump.eventTypes.ACTIVE,
        content: {
          oid: this.id,
          par1: width,
          par2: height
        }
      });
    }
    else {
      // TODO
    }
    //
    this.lastWidth = width;
    this.lastHeight = height;
    //
    if (this.parent instanceof Client.IdfTab && this.originalWidth === 0)
      this.updateElement({width: width, height: height, originalWidth: width, originalHeight: height});
  }
  //
  return events;
};


Client.IdfFrame.prototype.acceptsDrop = function (element)
{
  return this.canDrop;
};


Client.IdfFrame.prototype.canResizeW = function (element)
{
  return this.isLeaf() && Client.mainFrame.wep?.resizableFrames && this.parent instanceof Client.IdfFrame && !this.parent.vertical;
};


Client.IdfFrame.prototype.canResizeH = function (element)
{
  return this.isLeaf() && Client.mainFrame.wep?.resizableFrames && this.parent instanceof Client.IdfFrame && this.parent.vertical;
};


Client.IdfFrame.prototype.getSupportedTransformOperation = function (x, y, element, root)
{
  let op = Client.Widget.prototype.getSupportedTransformOperation.call(this, x, y, element, Client.eleMap[this.mainContainerConf.id].getRootObject());
  //
  // I need to check if i'm the first or second child of my parent
  let firstChild = false;
  let children = this.parent.children || [];
  for (let i = 0; i < children.length; i++) {
    if (Client.Widget.isFrameClass(children[i].c) || Client.Widget.isFrameClass(children[i].class)) {
      firstChild = children[i].id === this.id;
      break;
    }
  }
  //
  // The TOP resize is admitted only on the second child of a !vertical frame
  // (the vertical thing is already checked by the resize, so we need only to check the result operation)
  if (op === Client.Widget.transformOperation.RESIZETOP && firstChild)
    op = Client.Widget.transformOperation.NONE;
  //
  // The BOTTOM resize is admitted only on the first child of a !vertical frame
  if (op === Client.Widget.transformOperation.RESIZEBOTTOM && !firstChild)
    op = Client.Widget.transformOperation.NONE;
  //
  // The LEFT resize is admitted only on the second child of a vertical frame
  if (op === Client.Widget.transformOperation.RESIZELEFT && firstChild)
    op = Client.Widget.transformOperation.NONE;
  //
  // The RIGHT resize is admitted only on the first child of a vertical frame
  if (op === Client.Widget.transformOperation.RESIZERIGHT && !firstChild)
    op = Client.Widget.transformOperation.NONE;
  //
  return op;
};


Client.IdfFrame.prototype.getTransformOperationTargetWidget = function (operation, element)
{
  return operation !== Client.Widget.transformOperation.DRAG && this.parent instanceof Client.IdfTab ? this.parent.parent : this;
};


Client.IdfFrame.prototype.getTransformOperationTargetObj = function (operation, element)
{
  return Client.eleMap[this.mainContainerConf.id].getRootObject();
};


Client.IdfFrame.prototype.applyDragDropCursor = function (cursor)
{
  // Apply the resize cursor only on the list header
  let obj = Client.eleMap[this.mainContainerConf.id].getRootObject();
  //
  if (cursor) {
    obj.setAttribute("opnt", "dd");
    obj.style.cursor = cursor;
    //
    // Clear the cursor on mouse leave
    if (!obj.onmouseleave)
      obj.onmouseleave = Client.Widget.ddClearPointer;
  }
  else if (obj.getAttribute("opnt")) {
    // I already set a cursor on the object BUT now i have no operation : clear the cursor
    obj.style.cursor = "";
    obj.setAttribute("opnt", "");
  }
};


Client.IdfFrame.prototype.onTransform = function (options)
{
  if (!(this.parent instanceof Client.IdfFrame))
    return;
  //
  // Get the delta
  let currentRect = Client.eleMap[this.mainContainerConf.id].getRootObject().getBoundingClientRect();
  let deltaH = options.h - currentRect.height;
  let deltaW = options.w - currentRect.width;
  //
  // The delta is calculated on the current dimensions that are not the height of the frames that the calcLayout uses to derive
  // the percentages, so we need to calculate the delta as a percentage of the current dimension AND then recalculate it by converting
  // the percentage of the server height
  let deltaHperc = (deltaH / currentRect.height) * 100;
  deltaH = (this.originalHeight / 100) * deltaHperc;
  let deltaWperc = (deltaW / currentRect.width) * 100;
  deltaW = (this.originalWidth / 100) * deltaWperc;
  //
  // Get my brother
  let bro;
  let children = this.parent.elements || [];
  children.forEach((ele) => {
    if (!bro && Client.Widget.isFrameClass(ele.class) && ele.id !== this.id)
      bro = ele;
  });
  //
  if (bro)
    bro.resizeFrame(-deltaH, -deltaW);
  this.resizeFrame(deltaH, deltaW);
  //
  // Update the layout of the view
  this.parentIdfView?.calcLayout();
};


Client.IdfFrame.prototype.resizeFrame = function (deltaH, deltaW)
{
  this.height = this.height + deltaH;
  this.originalHeight = this.height;
  //
  this.width = this.width + deltaW;
  this.originalWidth = this.width;
  //
  let frames = [];
  let children = this.elements || [];
  children.forEach((ele) => {
    if (Client.Widget.isFrameClass(ele.class))
      frames.push(ele);
  });
  //
  if (frames.length > 0) {
    let chDeltaH = this.vertical ? Math.round(deltaH / frames.length) : deltaH;
    let chDeltaW = this.vertical ? deltaW : Math.round(deltaW / frames.length);
    //
    frames.forEach((ele) => {
      ele.resizeFrame(chDeltaH, chDeltaW);
    });
  }
};


Client.IdfFrame.prototype.getAnimationRoot = function ()
{
  return Client.eleMap[this.mainContainerConf.id].getRootObject();
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfFrame.prototype.close = function (firstLevel, triggerAnimation)
{
  clearTimeout(this.overflowTimer);
  delete this.overflowTimer;
  //
  Client.Widget.prototype.close.call(this, firstLevel, triggerAnimation);
};


/**
 * Give focus to the element
 * @param {Object} options
 */
Client.IdfFrame.prototype.focus = function (options)
{
  // Do nothing: frame base don't have nothing to focus
};


/**
 * Check the frame visibility
 */
Client.IdfFrame.prototype.isFrameVisible = function ()
{
  if (this.isLeaf() || !Client.mainFrame.isIDF)
    return this.visible;
  //
  // Check children visibility, if a children is visibile i'm visibile, otherwise i'm hidden
  let vis = false;
  for (let i = 0; i < this.elements.length; i++) {
    if (this.elements[i].isFrameVisible)
      vis = vis || this.elements[i].isFrameVisible();
  }
  //
  return vis;
};

/**
 * Set the frame visibility
 * @param {boolean} vis
 */
Client.IdfFrame.prototype.setFrameVisible = function (vis)
{
  let mainContainer = Client.eleMap[this.mainContainerConf.id];
  mainContainer.updateElement({visible: vis});
  mainContainer.setAttribute("frame_visible", vis);
  if (this.parent instanceof Client.IdfTab)
    this.parent.updateElement({visible: this.visible});
};


/**
 * Return true if this frame has the max height, checkin also its children
 * a !leaf frame has a max height only if all its visible children have the max height set
 * a leaf frame has a max height only if its max height is set
 * @return {boolean}
 */
Client.IdfFrame.prototype.hasMaxHeight = function ()
{
  if (this.isLeaf())
    return this.maxHeight > 0;
  //
  // Wireframe: i've a max heigth only if all my visibile child have the maxwith proprerty set
  let hasMax = true;
  for (let i = 0; i < this.elements.length; i++) {
    // use the isFrameVisible to detect an IdfFrame
    if (this.elements[i].isFrameVisible)
      hasMax = hasMax && (this.elements[i].isFrameVisible() && this.elements[i].hasMaxHeight());
  }
  //
  return hasMax;
};


/**
 * Calculate the max height of the frame, checkin also its children
 * a !leaf frame has the max height set to the sum of its children
 * @return {boolean}
 */
Client.IdfFrame.prototype.getMaxHeight = function ()
{
  if (this.isLeaf())
    return this.maxHeight;
  //
  // Wireframe: i've a max heigth only if all my visibile child have the maxwith proprerty set
  let max = 0;
  for (let i = 0; i < this.elements.length; i++) {
    // use the isFrameVisible to detect an IdfFrame
    if (this.elements[i].isFrameVisible) {
      if (this.vertical)
        max = max + (this.elements[i].isFrameVisible() ? this.elements[i].getMaxHeight() : 0);
      else
        max = Math.max(max, (this.elements[i].isFrameVisible() ? this.elements[i].getMaxHeight() : 0));
    }
  }
  //
  return max;
};


/**
 * Return true if this frame has the max width, checkin also its children
 * a !leaf frame has a max width only if all its visible children have the max width set
 * a leaf frame has a max width only if its max width is set
 * @return {boolean}
 */
Client.IdfFrame.prototype.hasMaxWidth = function ()
{
  if (this.isLeaf())
    return this.maxWidth > 0;
  //
  // Wireframe: i've a max heigth only if all my visibile child have the maxwith proprerty set
  let hasMax = true;
  for (let i = 0; i < this.elements.length; i++) {
    // use the isFrameVisible to detect an IdfFrame
    if (this.elements[i].isFrameVisible)
      hasMax = hasMax && (this.elements[i].isFrameVisible() && this.elements[i].hasMaxWidth());
  }
  //
  return hasMax;
};


/**
 * Calculate the max height of the frame, checkin also its children
 * a !leaf frame has the max height set to the sum of its children
 * @return {boolean}
 */
Client.IdfFrame.prototype.getMaxWidth = function ()
{
  if (this.isLeaf())
    return this.maxWidth;
  //
  // Wireframe: i've a max heigth only if all my visibile child have the maxwith proprerty set
  let max = 0;
  for (let i = 0; i < this.elements.length; i++) {
    // use the isFrameVisible to detect an IdfFrame
    if (this.elements[i].isFrameVisible) {
      if (!this.vertical)
        max = max + (this.elements[i].isFrameVisible() ? this.elements[i].getMaxWidth() : 0);
      else
        max = Math.max(max, (this.elements[i].isFrameVisible() ? this.elements[i].getMaxWidth() : 0));
    }
  }
  //
  return max;
};


/**
 * Handle a delayed update
 */
Client.IdfFrame.prototype.handleDelayedUpdate = function ()
{
  delete this.delayedUpdate;
};

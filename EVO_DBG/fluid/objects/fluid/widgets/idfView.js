/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A view object
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfView = function (widget, parent, view)
{
  this.subFrames = [];
  //
  // Set default values
  widget = Object.assign({
    resizeWidth: Client.IdfView.resizeModes.STRETCH,
    resizeHeight: Client.IdfView.resizeModes.STRETCH,
    visualFlags: -1,
    formTop: -1,
    formLeft: -1,
    borderType: Client.IdfView.borderType.DEFAULT,
    windowState: Client.IdfView.windowStates.NORMAL,
    toolbarPosition: Client.IdfView.toolbarStatuses.LEFT,
    modal: Client.IdfView.modalMode.MDI,
    closeOnSelection: false,
    idfVisible: true,
    //
    // Set default events definition
    clickEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    clickViewListEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    resizeEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    //
    showAnimationDef: Client.IdfWebEntryPoint?.getAnimationDefault("form"),
    modalAnimationDef: Client.IdfWebEntryPoint?.getAnimationDefault("modal"),
    messageAnimationDef: Client.IdfWebEntryPoint?.getAnimationDefault("message"),
    lastMessageAnimDef: Client.IdfWebEntryPoint?.getAnimationDefault("lastMessage"),
    previewAnimationDef: Client.IdfWebEntryPoint?.getAnimationDefault("preview"),
    dockedAnimationDef: Client.IdfWebEntryPoint?.getAnimationDefault("docked"),
    popupResizeAnimationDef: Client.IdfWebEntryPoint?.getAnimationDefault("popupResize")
  }, widget);
  //
  // If IdfView has not a width, get it from its first child (usually an IdfFrame)
  if (!widget.width)
    widget.width = widget.children[0]?.originalWidth;
  //
  // If IdfView has not a height, get it from its first child (usually an IdfFrame)
  if (!widget.height)
    widget.height = widget.children[0]?.originalHeight;
  //
  let realHandledKeys = widget.handledKeys;
  widget.handledKeys = -1;
  //
  Client.Widget.call(this, widget, parent, view);
  //
  this.handledKeys = realHandledKeys;
};


// Make Client.IdfView extend Client.Widget
Client.IdfView.prototype = new Client.Widget();


Client.IdfView.transPropMap = {
  rew: "resizeWidth",
  reh: "resizeHeight",
  flc: "clickViewListEventDef",
  lef: "formLeft",
  top: "formTop",
  mod: "modal",
  doc: "docked",
  dot: "dockType",
  tbp: "toolbarPosition",
  bdt: "borderType",
  vfl: "visualFlags",
  wst: "windowState",
  idx: "index",
  bbt: "backButtonText",
  own: "owner",
  cls: "closeOnSelection",
  sha: "showAnimationDef",
  mda: "modalAnimatonDef",
  mga: "messageAnimationDef",
  lma: "lastMessageAnimationDef",
  pra: "previewAnimationDef",
  dka: "dockedAnimationDef",
  ppr: "popResAnimationDef",
  wcp: "webCaption",
  img: "image",
  pre: "frameInPreview",
  vis: "idfVisible",
  res: "resizeEventDef",
  rlt: "relatedTo",
  rlp: "relatedPosition"
};


Client.IdfView.resizeModes = {
  NONE: 1,
  EXTEND: 2,
  STRETCH: 3
};

Client.IdfView.modalMode = {
  MDI: 0,
  MODAL: 1,
  POPUP: 2
};

Client.IdfView.borderType = {
  DEFAULT: 0,
  NONE: 1,
  THIN: 2,
  THICK: 3
};

Client.IdfView.windowStates = {
  NORMAL: 0,
  MAXIMIZE: 1,
  MINIMIZE: 2
};

Client.IdfView.toolbarStatuses = {
  NONE: 0, // No toolbar buttons
  LEFT: 1, // Left toolbar buttons
  RIGHT: 2, // Right toolbar buttons
  DISTRIB: 3  // Left Confirm and right close
};


Client.IdfView.dockType = {
  NONE: 1,
  LEFT: 2,
  RIGHT: 3,
  TOP: 4,
  BOTTOM: 5
};

Client.IdfView.relatedPlacement = {
  BELOW: 0,
  ABOVE: 1
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfView.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfView.transPropMap.rew:
      case Client.IdfView.transPropMap.reh:
      case Client.IdfView.transPropMap.flc:
      case Client.IdfView.transPropMap.lef:
      case Client.IdfView.transPropMap.top:
      case Client.IdfView.transPropMap.dot:
      case Client.IdfView.transPropMap.tbp:
      case Client.IdfView.transPropMap.bdt:
      case Client.IdfView.transPropMap.vfl:
      case Client.IdfView.transPropMap.wst:
      case Client.IdfView.transPropMap.idx:
      case Client.IdfView.transPropMap.rlp:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfView.transPropMap.mod:
        props[p] = Math.abs(parseInt(props[p]));
        break;

      case Client.IdfView.transPropMap.cls:
      case Client.IdfView.transPropMap.doc:
      case Client.IdfView.transPropMap.vis:
        props[p] = props[p] === "1";
        break;
    }
  }
};


Object.defineProperty(Client.IdfView.prototype, "isSubView", {
  get: function () {
    return !(this.parent instanceof Client.View);
  }
});


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfView.prototype.getRootObject = function (el)
{
  // Set frames container as root object
  let rootObject = Client.eleMap[this.framesContainerConf.id];
  return el ? rootObject : rootObject.domObj;
};


/**
 * Create elements configuration
 */
Client.IdfView.prototype.createElementsConfig = function ()
{
  this.pageConf = this.createElementConfig({c: "IonPage", className: "view-main-container", events: ["onClick"]});
  //
  // Create header configuration
  this.headerConf = this.createElementConfig({c: "IonHeader", className: "view-header"});
  this.pageConf.children.push(this.headerConf);
  //
  // Create navbar configuration
  this.navbarConf = this.createElementConfig({c: "IonNavBar", className: "view-navbar", events: ["onBackButton", "onMenuButton"]});
  this.headerConf.children.push(this.navbarConf);
  //
  // Create the message bar
  this.messagesBoxConf = this.createElementConfig({c: "IonToolbar", className: "view-message-toolbar", visible: false});
  this.headerConf.children.push(this.messagesBoxConf);
  //
  this.messagesBoxListConf = this.createElementConfig({c: "IonList", className: "view-message-toolbar-list"});
  this.messagesBoxConf.children.push(this.messagesBoxListConf);
  //
  // Create title configuration
  this.titleConf = this.createElementConfig({c: "IonTitle", className: "view-title"});
  this.navbarConf.children.push(this.titleConf);
  //
  // Create buttons configuration
  this.buttonsConf = this.createElementConfig({c: "IonButtons", className: "view-navbar-buttons"});
  this.navbarConf.children.push(this.buttonsConf);
  //
  // Create left buttons configuration
  this.leftButtonsConf = this.createElementConfig({c: "IonButtons", className: "view-navbar-buttons", visible: false});
  this.navbarConf.children.push(this.leftButtonsConf);
  //
  // Create close button configuration
  this.closeButtonConf = this.createElementConfig({c: "IonButton", icon: "close", className: "view-close-button", events: ["onClick"]});
  this.buttonsConf.children.push(this.closeButtonConf);
  //
  // Create footer configuration
  let footerConf = this.createElementConfig({c: "IonFooter", className: "view-footer"});
  this.pageConf.children.push(footerConf);
  //
  // Create content configuration
  this.contentConf = this.createElementConfig({c: "IonContent", className: "view-content"});
  this.pageConf.children.push(this.contentConf);
  //
  // Create frames container configuration
  this.framesContainerConf = this.createElementConfig({c: "Container", className: "frames-container"});
  this.contentConf.children.push(this.framesContainerConf);
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfView.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  this.createElementsConfig();
  //
  // Create IonPage
  this.mainObjects.push(view.createElement(this.pageConf, parent, view));
  //
  // Create widget children
  this.createChildren(widget);
  //
  // Check if i must show the backbutton OR the menu button and then wich frame show it
  this.checkMobileButtons();
  //
  if (!this.isSubView) {
    if (this.idfVisible)
      Client.mainFrame.wep?.soundAction(Client.IdfWebEntryPoint.soundDef.open);
  }
  else if (Client.mainFrame.isIDF && this.getMainIdfView()) {
    // I'm a SubView but the view doesn't have its main IdfView yet. This means that they are in the initial realization phase and
    // this subview was not created at run-time but at design time (it is part of the initial structure of the main IdfView).
    // In this case I don't need to realize my commands, everything will be managed by the activate of the main IdfView.
    //
    // if instead i have a getMainIdfView it means that the main IdfView has already been created and in a subsequent request I was created.
    // Then I have to deal with creating my own commands, since the active IdfView has already done so
    Client.mainFrame.wep.commandList?.realizeViewCommandsets(this);
  }
  //
  this.calcDimensions();
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfView.prototype.createChildren = function (el)
{
  if (Client.mainFrame.isIDF) {
    if (el.frameInPreview) {
      el.children.forEach(child => {
        if (child.id === el.frameInPreview)
          child.inPreview = true;
      });
      delete el.frameInPreview;
    }
    //
    // All frames are children of IdfView, at same level.
    // In fact, frames hierarchy is expressed by "frame1" and "frame2" properties on a parent frame.
    // So reconstruct real hierarchy using those properties
    let oldFrameElements = this.elements.filter(el => el instanceof Client.IdfFrame);
    let newFrameChildren = el.children.filter(child => Client.Widget.isFrameClass(child.c));
    if (oldFrameElements.length || newFrameChildren.length > 1) {
      for (let i = el.children.length - 1; i >= 0; i--) {
        let childFrame = el.children[i];
        if (!Client.Widget.isFrameClass(childFrame.c))
          continue;
        //
        // Clone the children array and add all TAB elements to it, so we can get the correct structure
        let frames = el.children.slice();
        frames.forEach(frame => {
          if (frame.c === Client.Widget.transXmlNodeMap.tbv)
            frames.push(...frame.children);
        });
        //
        let parentFrame = frames.find(parent => {
          return (childFrame.id === parent.frame1 || childFrame.id === parent.frame2 || childFrame.id === parent.contentId);
        });
        //
        // If current frame has a parent frame, remove it from IdfView children and add it to its parent frame
        if (parentFrame) {
          el.children.splice(i, 1);
          parentFrame.children.splice(0, 0, childFrame);
        }
        else if (i !== 0 || childFrame.isSubFrame) {
          // Otherwise if it's a sub frame, remove it from IdfView children and add it to sub frames array.
          // It will be create by widget that owns it (example: IdfField in case of subframe inside a static field)
          el.children.splice(i, 1);
          this.subFrames.splice(0, 0, childFrame);
        }
      }
    }
  }
  //
  Client.Widget.prototype.createChildren.call(this, el);
};


/**
 * Append a child DOM Object to root object DOM
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.IdfView.prototype.appendChildObject = function (child, domObj)
{
  let rootObject = this.getRootObject(true);
  //
  if (child.parentWidget instanceof Client.IdfMessage) {
    if (Client.mainFrame.idfMobile) {
      // On mobile we don't add the messages to the container but show it as a toast
      Client.IonHelper.createToast({});
      //
      let tws = document.getElementById("app-ui").getElementsByClassName("toast-message");
      let tw = tws && tws.length > 0 ? tws.item(tws.length - 1) : null;
      if (tw)
        tw.appendChild(domObj);
      //
      return;
    }
    //
    rootObject = Client.eleMap[this.messagesBoxListConf.id];
  }
  //
  if (rootObject instanceof Client.IonContent)
    rootObject.scrollContent.appendChild(domObj);
  else
    rootObject.appendChildObject(child, domObj);
  //
  rootObject.elements.push(child);
  child.parent = rootObject;
  //
  if (child.parentWidget instanceof Client.IdfMessage && !Client.mainFrame.idfMobile) {
    if (this.posTimer)
      clearTimeout(this.posTimer);
    //
    this.posTimer = setTimeout(() => {
      delete this.posTimer;
      Client.eleMap[this.contentConf.id].positionContent();
    }, 0);
  }
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfView.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (props.visualFlags !== undefined) {
    this.visualFlags = props.visualFlags;
    //
    props.showCaption = (this.visualFlags & 0x1) !== 0;
    props.canResize = (this.visualFlags & 0x2) !== 0;
    props.canMove = (this.visualFlags & 0x4) !== 0;
    props.showMinButton = (this.visualFlags & 0x8) !== 0;
    props.showMaxButton = (this.visualFlags & 0x10) !== 0;
    props.showCloseButton = (this.visualFlags & 0x20) !== 0;
    props.showConfirmButton = (this.visualFlags & 0x40) !== 0;
    props.showHelpButton = (this.visualFlags & 0x80) !== 0;
    props.showDebugButton = (this.visualFlags & 0x100) !== 0;
    props.showIcon = (this.visualFlags & 0x200) !== 0;
    props.showMessages = (this.visualFlags & 0x400) !== 0;
    props.showBackButton = (this.visualFlags & 0x800) !== 0;
    props.showViewList = (this.visualFlags & 0x1000) !== 0;
  }
  //
  // webCaption = "" HIDES the caption and overwrites ALL OTHERS configurations
  if (props.webCaption !== undefined && !props.webCaption)
    props.showCaption = false;
  //
  let calcLayout = false;
  let updateMobileButtons = false;
  let updateDockClasses = false;
  let updateIcon = false;
  for (let p in props) {
    let v = props[p];
    //
    switch (p) {
      case "index":
      case "modal":
      case "owner":
      case "closeOnSelection":
      case "backButtonText":
      case "canMove":
      case "showBackButton":
      case "showViewList":
      case "relatedTo":
      case "relatedPosition":
      case "clickViewListEventDef":
      case "resizeEventDef":
      case "relatedTo":
      case "relatedPosition":
        this[p] = v;
        break;

      case "visible":
        this.setVisible(v);
        break;

      case "webCaption":
        this.webCaption = v;
        this.setCaption(v);
        break;

      case "docked":
      case "dockType":
      case "canResize":
        this[p] = v;
        updateDockClasses = true;
        break;

      case "width":
      case "height":
      case "formTop":
      case "formLeft":
        this[p] = isNaN(v) ? undefined : v;
        calcLayout = true;
        break;

      case "resizeWidth":
      case "resizeHeight":
        this[p] = v;
        calcLayout = true;
        break;

      case "className":
        this.setClassName(v);
        break;

      case "image":
      case "showIcon":
        this[p] = v;
        updateIcon = true;
        break;

      case "toolbarPosition":
        this.setToolbarPosition(v);
        break;

      case "showCaption":
        this.setShowCaption(v);
        updateMobileButtons = true;
        break;

      case "showMinButton":
        this.setShowMinButton(v);
        break;

      case "showMaxButton":
        this.setShowMaxButton(v);
        break;

      case "showCloseButton":
        this.setShowCloseButton(v);
        break;

      case "showConfirmButton":
        this.setShowConfirmButton(v);
        break;

      case "showHelpButton":
        this.setShowHelpButton(v);
        break;

      case "showDebugButton":
        this.setShowDebugButton(v);
        break;

      case "showMessages":
        this.setShowMessages(v);
        break;

      case "borderType":
        this.setBorderType(v);
        break;

      case "windowState":
        if (this.setWindowState(v))
          calcLayout = true;
        break;
    }
  }
  //
  // I manage the visibility basically because it depends on some properties (showViewList and caption)
  if ("idfVisible" in props)
    this.setIdfVisible(props.idfVisible);
  //
  if (calcLayout)
    this.calcLayout();
  if (updateDockClasses)
    this.updateDockClasses();
  if (updateIcon)
    this.updateIcon();
  //
  if (updateMobileButtons && this.elements.length > 0)
    this.checkMobileButtons();
};


/**
 * Calculate objects dimensions
 */
Client.IdfView.prototype.calcDimensions = function ()
{
  let framesContainer = Client.eleMap[this.framesContainerConf.id].getRootObject();
  let compStyle = getComputedStyle(framesContainer);
  //
  // Add vertical margins and paddings
  this.framesContainerVerticalMargins = 0;
  this.framesContainerVerticalMargins += (parseInt(compStyle.paddingTop) || 0) + (parseInt(compStyle.paddingBottom) || 0);
  this.framesContainerVerticalMargins += (parseInt(compStyle.marginTop) || 0) + (parseInt(compStyle.marginBottom) || 0);
  //
  // Add horizontal margins and paddings
  this.framesContainerHorizontalMargins = 0;
  this.framesContainerHorizontalMargins += (parseInt(compStyle.paddingLeft) || 0) + (parseInt(compStyle.paddingRight) || 0);
  this.framesContainerHorizontalMargins += (parseInt(compStyle.marginLeft) || 0) + (parseInt(compStyle.marginRight) || 0);
};


/**
 * Get frames container vertical margins
 */
Client.IdfView.prototype.getFramesContainerVerticalMargins = function ()
{
  return this.framesContainerVerticalMargins || 0;
};


/**
 * Get frames container horizontal margins
 */
Client.IdfView.prototype.getFramesContainerHorizontalMargins = function ()
{
  return this.framesContainerHorizontalMargins || 0;
};


Client.IdfView.prototype.setVisible = function (value)
{
  this.visible = value;
  Client.eleMap[this.pageConf.id].updateElement({visible: this.visible});
};


Client.IdfView.prototype.setCaption = function (value)
{
  Client.eleMap[this.titleConf.id].updateElement({innerHTML: Client.Widget.getHTMLForCaption(value)});
};


Client.IdfView.prototype.setClassName = function (value)
{
  let el = Client.eleMap[this.pageConf.id];
  //
  // Remove the old classname
  Client.Widget.updateElementClassName(el, this.className, true);
  //
  // Set the new classname
  this.className = value;
  Client.Widget.updateElementClassName(el, this.className);
};


Client.IdfView.prototype.updateIcon = function ()
{
  let headerContainer = Client.eleMap[this.navbarConf.id];
  //
  if (this.image && this.showIcon) {
    if (!this.imageObj) {
      // Create image container
      let imageBoxConf = this.createElementConfig({c: "Container", className: "view-image-ext"});
      this.imageObj = headerContainer.insertBefore({child: imageBoxConf, sib: this.titleConf.id});
    }
    //
    if (Client.Widget.isIconImage(this.image)) {
      if (!this.iconObj)
        this.iconObj = this.imageObj.insertBefore({child: this.createElementConfig({c: "IonIcon"})});
      //
      this.iconObj.updateElement({icon: this.image});
      this.imageObj.updateElement({style: {backgroundImage: ""}});
    }
    else {
      if (this.iconObj) {
        this.imageObj.removeChild(this.iconObj);
        delete this.iconObj;
      }
      let src = (Client.mainFrame.isIDF ? "images/" : "") + this.image;
      this.imageObj.updateElement({style: {backgroundImage: "url(" + src + ")"}});
    }
  }
  else {
    if (this.imageObj) {
      headerContainer.removeChild(this.imageObj);
      delete this.imageObj;
    }
  }
};


Client.IdfView.prototype.setToolbarPosition = function (value)
{
  this.toolbarPosition = value;
  //
  let buttons = Client.eleMap[this.buttonsConf.id];
  switch (this.toolbarPosition) {
    case Client.IdfView.toolbarStatuses.NONE:
      // Hide the buttons
      buttons.updateElement({visible: false});
      break;

    case Client.IdfView.toolbarStatuses.LEFT:
      // This is the default, nothing to do
      break;

    case Client.IdfView.toolbarStatuses.RIGHT:
      buttons.updateElement({className: "view-navbar-buttons right-buttons"});
      break;

    case Client.IdfView.toolbarStatuses.DISTRIB:
      // Move the main buttons to the right and create e ne buttons container to the left
      buttons.updateElement({className: "view-navbar-buttons right-buttons"});
      Client.eleMap[this.leftButtonsConf.id].updateElement({visible: true});
      break;
  }
};


Client.IdfView.prototype.setShowCaption = function (value)
{
  this.showCaption = value;
  //
  Client.eleMap[this.navbarConf.id].updateElement({visible: this.showCaption});
  //
  // In an IonPage, the scrollContent has a margin top (usually 56px) if the page shows header.
  // So if caption is not visible, that margin top should be removed.
  // The IonContent itself removes it (see Client.IonContent.prototype.positionContent) using a setTimeout.
  // But since I want other widgets to be informed immediately, I set it to 0 manually
  if (!this.showCaption)
    Client.eleMap[this.contentConf.id].scrollContent.style.marginTop = 0;
  //
  this.onResize();
};


Client.IdfView.prototype.setShowMinButton = function (value)
{
  this.showMinButton = value;
  //
  if (!this.minButtonConf && this.modal === Client.IdfView.modalMode.POPUP) {
    this.minButtonConf = this.createElementConfig({c: "IonButton", icon: "remove", className: "view-minimize-button", events: ["onClick"]});
    this.createElementFromConfig(this.minButtonConf, this.buttonsConf.id);
  }
  //
  if (this.minButtonConf)
    Client.eleMap[this.minButtonConf.id].updateElement({visible: this.showMinButton});
};


Client.IdfView.prototype.setShowMaxButton = function (value)
{
  this.showMaxButton = value;
  //
  if (!this.maxButtonConf && (this.modal === Client.IdfView.modalMode.MODAL || this.modal === Client.IdfView.modalMode.POPUP)) {
    this.maxButtonConf = this.createElementConfig({c: "IonButton", icon: "browsers", className: "view-maximize-button", events: ["onClick"]});
    this.createElementFromConfig(this.maxButtonConf, this.buttonsConf.id);
  }
  //
  if (this.maxButtonConf)
    Client.eleMap[this.maxButtonConf.id].updateElement({visible: this.showMaxButton});
};


Client.IdfView.prototype.setShowCloseButton = function (value)
{
  this.showCloseButton = value;
  Client.eleMap[this.closeButtonConf.id].updateElement({visible: this.showCloseButton});
};


Client.IdfView.prototype.setShowConfirmButton = function (value)
{
  this.showConfirmButton = value;
  //
  if (this.modal !== Client.IdfView.modalMode.MODAL)
    return;
  //
  if (!this.confirmButtonConf) {
    this.confirmButtonConf = this.createElementConfig({c: "IonButton", icon: "checkmark", className: "view-confirm-button", events: ["onClick"]});
    //
    let container = (this.toolbarPosition === Client.IdfView.toolbarStatuses.DISTRIB ? this.leftButtonsConf : this.buttonsConf);
    this.createElementFromConfig(this.confirmButtonConf, container.id, true);
  }
  //
  Client.eleMap[this.confirmButtonConf.id].updateElement({visible: this.showConfirmButton});
};


Client.IdfView.prototype.setShowHelpButton = function (value)
{
  this.showHelpButton = value;
  //
  if (!this.helpButtonConf && Client.mainFrame.wep?.debugType === Client.IdfWebEntryPoint.debugTypes.HELP && (this.modal === Client.IdfView.modalMode.MODAL || this.modal === Client.IdfView.modalMode.POPUP)) {
    this.helpButtonConf = this.createElementConfig({c: "IonButton", icon: "help-circle-outline", className: "view-confirm-button", events: ["onClick"]});
    this.createElementFromConfig(this.helpButtonConf, this.buttonsConf.id);
  }
  //
  if (this.helpButtonConf)
    Client.eleMap[this.helpButtonConf.id].updateElement({visible: this.showHelpButton});
};


Client.IdfView.prototype.setShowDebugButton = function (value)
{
  this.showDebugButton = value;
  //
  if (!this.debugButtonConf && Client.mainFrame.wep?.debugType === Client.IdfWebEntryPoint.debugTypes.DEBUG && (this.modal === Client.IdfView.modalMode.MODAL || this.modal === Client.IdfView.modalMode.POPUP)) {
    this.debugButtonConf = this.createElementConfig({c: "IonButton", icon: "bug", className: "view-debug-button", events: ["onClick"]});
    this.createElementFromConfig(this.debugButtonConf, this.buttonsConf.id);
  }
  //
  if (this.debugButtonConf)
    Client.eleMap[this.debugButtonConf.id].updateElement({visible: this.showDebugButton});
};


Client.IdfView.prototype.setShowMessages = function (value)
{
  this.showMessages = value;
  Client.eleMap[this.messagesBoxConf.id].updateElement({visible: this.showMessages});
};


Client.IdfView.prototype.setBorderType = function (value)
{
  this.borderType = value;
  //
  if (!this.modal)
    return;
  //
  let dk = this.parent.domObj;
  switch (this.borderType) {
    case Client.IdfView.borderType.NONE:
      dk.classList.add("modal-border-none");
      break;

    case Client.IdfView.borderType.THIN:
      dk.classList.add("modal-border-thin");
      break;

    case Client.IdfView.borderType.THICK:
      dk.classList.add("modal-border-thick");
      break;

    default :
      dk.classList.add("modal-border-default");
      break;
  }
};


Client.IdfView.prototype.setWindowState = function (value)
{
  let oldWstate = this.windowState;
  this.windowState = value;
  //
  if (oldWstate === this.windowState || !this.modal)
    return;
  //
  if (this.maxButtonConf && this.windowState === Client.IdfView.windowStates.NORMAL || this.windowState === Client.IdfView.windowStates.MAXIMIZE) {
    let el = Client.eleMap[this.maxButtonConf.id];
    el.updateElement({icon: this.windowState === Client.IdfView.windowStates.NORMAL ? "browsers" : "albums"});
  }
  //
  // Save the old status to return later
  if (this.windowState === Client.IdfView.windowStates.MINIMIZE)
    this.oldWstate = oldWstate;
  else
    delete this.oldWstate;
  //
  return true;
};


Client.IdfView.prototype.setIdfVisible = function (value)
{
  this.idfVisible = value;
  //
  if (this.modal === Client.IdfView.modalMode.POPUP)
    this.view.dialog.updateElement({visible: this.idfVisible});
  //
  if (this.modal !== Client.IdfView.modalMode.MODAL && !this.isSubView) {
    if (this.idfVisible)
      Client.mainFrame.wep?.commandList?.addViewOpenItem(this);
    else
      Client.mainFrame.wep?.commandList?.removeViewOpenItem(this);
  }
  //
  Client.eleMap[this.pageConf.id].updateElement({visible: this.idfVisible});
  //
  Client.mainFrame.wep?.checkWelcomePage();
};


Client.IdfView.prototype.updateDockClasses = function ()
{
  if (this.docked)
    Client.Widget.updateElementClassName(Client.eleMap[this.pageConf.id], `docked-view-${Object.keys(Client.IdfView.dockType)[this.dockType - 1]}${this.canResize ? '-rs' : ''}`);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfView.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onMenuButton":
      Client.mainFrame.wep?.commandList?.toggleMenu();
      break;

    case "onClick":
    case "onBackButton":
      // The click on the bck button on mobile is the same as the close
      if (event.id === "onBackButton")
        event.obj = this.closeButtonConf.id;
      //
      switch (event.obj) {
        case this.closeButtonConf.id:
        case this.confirmButtonConf?.id:
          events.push(...this.handleCloseButtonClick(event));
          break;

        case this.debugButtonConf?.id:
        case this.helpButtonConf?.id:
          events.push(...Client.mainFrame.wep?.handleDebugButtonClick(event) || []);
          break;

        case this.pageConf.id:
          // Click on main page I must be activated
          if (!this.docked && Client.mainFrame.wep)
            Client.mainFrame.wep.activeView = this.getMainIdfView()?.id || Client.mainFrame.wep.activeView;
          break;

        case this.maxButtonConf?.id:
        case this.minButtonConf?.id:
          events.push(...this.handleMinMaxButtonClick(event));
          break;
      }
      break;

    case "onKey":
      events.push(...this.handleFunctionKeys(event));
      break;
  }
  //
  return events;
};


Client.IdfView.prototype.handleCloseButtonClick = function (event)
{
  let events = [];
  if (Client.mainFrame.isIDF)
    // Give event IDF format
    events.push({
      id: (event?.obj === this.confirmButtonConf?.id ? "confirm" : "close"),
      def: this.clickEventDef,
      content: {
        oid: this.id,
        xck: event?.content.offsetX,
        yck: event?.content.offsetY
      }
    });
  else // On IDC ask wep to remove view
    Client.mainFrame.wep?.removeChild({id: this.view.id});
  //
  return events;
};


Client.IdfView.prototype.handleMinMaxButtonClick = function (event)
{
  let newWindowState;
  if (event.obj === this.maxButtonConf?.id) {
    if (this.windowState === Client.IdfView.windowStates.MAXIMIZE)
      newWindowState = Client.IdfView.windowStates.NORMAL;
    else
      newWindowState = Client.IdfView.windowStates.MAXIMIZE;
  }
  //
  if (event.obj === this.minButtonConf?.id)
    newWindowState = Client.IdfView.windowStates.MINIMIZE;
  //
  return this.handleWindowStateChange(newWindowState);
};


Client.IdfView.prototype.handleWindowStateChange = function (newWindowState, fromServer)
{
  this.updateElement({windowState: newWindowState});
  //
  let events = [];
  if (!fromServer) {
    if (Client.mainFrame.isIDF)
      events.push({
        id: "chgwst",
        def: this.clickEventDef,
        content: {
          oid: this.id,
          par1: this.windowState
        }
      });
    else
      events.push({
        obj: this.id,
        id: "onChangeState",
        content: this.windowState
      });
  }
  //
  return events;
};


/**
 * Handle function keys
 * @param {Object} event
 */
Client.IdfView.prototype.handleFunctionKeys = function (event)
{
  let events = [];
  //
  // I check the form toolbar
  events.push(...Client.mainFrame.wep.commandList.handleFunctionKeys(event, this.index, -1));
  if (events.length > 0)
    return events;
  //
  // Calculate the number of FKs from 1 to 48
  let fkn = (event.content.keyCode - 111) + (event.content.shiftKey ? 12 : 0) + (event.content.ctrlKey ? 24 : 0);
  //
  // Let's see if it matches one of my default keys
  if (fkn === Client.IdfPanel.FKCloseView) {
    events.push(...this.handleCloseButtonClick(event));
    event.content.srcEvent.preventDefault();
  }
  //
  return events;
};


/**
 * Realize toolbar command set
 * @param {Object} cmsConf
 */
Client.IdfView.prototype.realizeCommandSet = function (cmsConf)
{
  let navbar = Client.eleMap[this.navbarConf.id];
  let cmsContainer = navbar.insertBefore({child: cmsConf});
  //
  cmsContainer.updateElement({position: "start"});
};


/**
 * Calculate layout rules to handle resize mode
 */
Client.IdfView.prototype.calcLayout = function ()
{
  let style = {};
  style.width = "100%";
  style.height = "100%";
  //
  // If there is a width, set it using resize mode rules
  if (this.width !== undefined) {
    if (this.resizeWidth === Client.IdfView.resizeModes.NONE) {
      style["max-width"] = this.width + "px";
      style.width = this.width + "px";
    }
    else {
      if (this.resizeWidth === Client.IdfView.resizeModes.EXTEND)
        style["min-width"] = this.width + "px";
    }
  }
  //
  // If there is a height, set it using resize mode rules
  if (this.height !== undefined) {
    if (this.resizeHeight === Client.IdfView.resizeModes.NONE) {
      style["max-height"] = this.height + "px";
      style.height = this.height + "px";
    }
    else {
      if (this.resizeHeight === Client.IdfView.resizeModes.EXTEND)
        style["min-height"] = this.height + "px";
    }
  }
  //
  if ((this.modal === Client.IdfView.modalMode.MODAL || this.modal === Client.IdfView.modalMode.POPUP)) {
    let parentStyle = {};
    switch (this.windowState) {
      case Client.IdfView.windowStates.NORMAL:
        let el = Client.eleMap[this.headerConf.id];
        let hgt = this.height + (this.showCaption ? el.domObj.offsetHeight : 0);
        //
        let w = this.width > document.body.offsetWidth * 0.9 ? document.body.offsetWidth * 0.9 : this.width;
        let h = hgt > document.body.offsetHeight * 0.9 ? document.body.offsetHeight * 0.9 : hgt;
        //
        if (w > 0)
          parentStyle.width = w + "px";
        if (h > 0)
          parentStyle.height = h + "px";
        if (this.formTop === -1 && h > 0)
          parentStyle.top = "calc(50% - (" + h + "px/2))";
        else if (this.formTop > 0)
          parentStyle.top = this.formTop + "px";
        if (this.formLeft === -1 && w > 0)
          parentStyle.left = "calc(50% - (" + w + "px/2))";
        else
          parentStyle.left = this.formLeft + "px";
        //
        if (this.relatedTo) {
          // The relatedTo IS a Field, but the server sends a custom strings that can reference the form value (fv), a list value (lv1...99), and the captions (lc, fc)
          // So we need to remove the ending and get the field, and then ASK to it the domObj linked to the server id
          let rc = this.relatedTo.replace("\:fv", "").replace("\:lv\d+", "").replace("\:lc", "").replace("\:fc", "");
          let ref = Client.eleMap[rc]?.getDomObjFromId(this.relatedTo)?.getBoundingClientRect();
          parentStyle.top = ref?.bottom + "px";
          parentStyle.left = ref?.left + "px";
          //
          if (this.relatedPosition === Client.IdfView.relatedPlacement.ABOVE && (ref?.top - h) > 0)
            parentStyle.top = (ref?.top - h) + "px";
        }
        //
        if (parentStyle.width)
          this.parent.domObj.style.width = parentStyle.width;
        if (parentStyle.height)
          this.parent.domObj.style.height = parentStyle.height;
        if (parentStyle.top)
          this.parent.domObj.style.top = parentStyle.top;
        if (parentStyle.left)
          this.parent.domObj.style.left = parentStyle.left;
        this.parent.domObj.style.opacity = "1";
        //
        // this.parent is a Client.View so it hasn't an updateElement, we must accesso directly its
        // domobj
        //this.parent.updateElement({ style: parentStyle });
        break;

      case Client.IdfView.windowStates.MAXIMIZE:
      {
        let rc = Client.mainFrame.wep?.getMDIRect();
        //
        if (rc) {
          this.parent.domObj.style.opacity = "1";
          this.parent.domObj.style.left = rc.left + "px";
          this.parent.domObj.style.top = rc.top + "px";
          this.parent.domObj.style.width = rc.width + "px";
          this.parent.domObj.style.height = rc.height + "px";
        }
        //
        break;
      }

      case Client.IdfView.windowStates.MINIMIZE:
      {
        this.parent.domObj.style.left = "0%";
        this.parent.domObj.style.top = "50%";
        this.parent.domObj.style.width = "0px";
        this.parent.domObj.style.height = "0px";
        this.parent.domObj.style.opacity = "0";
        //
        break;
      }
    }
  }
  //
  // Update frames container style
  let el = Client.eleMap[this.framesContainerConf.id];
  if (el)
    el.updateElement({style: style});
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
 */
Client.IdfView.prototype.getChildPercentageWidth = function (childWidth)
{
  let parentWidth = this.width;
  if (parentWidth === undefined) {
    let framesContainer = Client.eleMap[this.framesContainerConf.id].getRootObject();
    parentWidth = framesContainer.clientWidth;
  }
  //
  // If child has not an explicit width, give it parent width
  if (childWidth === undefined)
    childWidth = parentWidth;
  //
  let percentageWidth = 100;
  if (parentWidth)
    percentageWidth = (childWidth / parentWidth) * 100;
  //
  return percentageWidth;
};


/**
 * Get child height as a percentage of parent height
 * @param {Integer} childHeight
 */
Client.IdfView.prototype.getChildPercentageHeight = function (childHeight)
{
  let parentHeight = this.height;
  if (parentHeight === undefined) {
    let framesContainer = Client.eleMap[this.framesContainerConf.id].getRootObject();
    parentHeight = framesContainer.clientHeight;
  }
  //
  // If child has not an explicit height, give it parent height
  if (childHeight === undefined)
    childHeight = parentHeight;
  //
  let percentageHeight = 100;
  if (parentHeight)
    percentageHeight = (childHeight / parentHeight) * 100;
  //
  // If there is only one child, it has to fill all available height
  if (this.elements.length === 1)
    percentageHeight = 100;
  //
  return percentageHeight;
};


Client.IdfView.prototype.activate = function (fromServer)
{
  if (this.modal === Client.IdfView.modalMode.POPUP) {
    Client.Widget.updateElementClassName(Client.eleMap[this.pageConf.id], "popup-inactive", true);
    //
    // Bring the dialog to top
    this.saveScrollbarPosition();
    this.view.dialog.rootObj.parentNode.appendChild(this.view.dialog.rootObj);
    this.saveScrollbarPosition(true);
  }
  //
  let events = [];
  if (this.modal === Client.IdfView.modalMode.POPUP && this.windowState === Client.IdfView.windowStates.MINIMIZE) {
    let newWindowState = this.oldWstate || Client.IdfView.windowStates.NORMAL;
    events.push(...this.handleWindowStateChange(newWindowState, fromServer));
  }
  //
  if (!fromServer && Client.mainFrame.isIDF)
    events.push({
      id: "flclk",
      def: this.clickViewListEventDef,
      content: {
        oid: this.id
      }
    });
  //
  Client.mainFrame.sendEvents(events);
};


Client.IdfView.prototype.deactivate = function ()
{
  if (this.modal === Client.IdfView.modalMode.POPUP)
    Client.Widget.updateElementClassName(Client.eleMap[this.pageConf.id], "popup-inactive");
};


/**
 * Get widget requirements
 * @param {Object} w
 */
Client.IdfView.getRequirements = function (w)
{
  return Client.IdfWebEntryPoint.getRequirements(w);
};


Client.IdfView.prototype.getFrameList = function ()
{
  let flist = [];
  //
  for (let f = 0; f < this.elements.length; f++) {
    if (this.elements[f] instanceof Client.IdfFrame) {
      flist.push(this.elements[f]);
      this.elements[f].getFrameList(flist);
    }
  }
  //
  for (let f = 0; f < this.subFrames.length; f++) {
    if (Client.eleMap[this.subFrames[f]?.id]) {
      flist.push(Client.eleMap[this.subFrames[f].id]);
      Client.eleMap[this.subFrames[f].id].getFrameList(flist);
    }
  }
  //
  return flist;
};


/**
 * @param {Object} config - config of the object
 * @param {*} parentId - id of the parent into wich append
 * @param {*} first true if the object must be appended as the first, false to use appendChild
 */
Client.IdfView.prototype.createElementFromConfig = function (config, parentId, first)
{
  let el = Client.eleMap[parentId];
  let obj = this.view.createElement(config, el, this.view);
  if (first && el.domObj.firstChild)
    el.domObj.insertBefore(obj.domObj, el.domObj.firstChild);
  else
    el.appendChildObject(obj, obj.domObj);
  el.elements.push(obj);
  obj.parent = el;
};



/**
 * @param {String} reqCode - code of the current request
 */
Client.IdfView.prototype.startRequest = function (reqCode, request)
{
  if (request.skipClearMessages)
    return;
  //
  // Clear the temporary messages
  for (let i = 0; i < this.elements.length; i++) {
    let el = this.elements[i];
    if (el instanceof Client.IdfMessage) {
      if (el.temporary && el.requestId !== reqCode) {
        el.close(true);
        this.elements.splice(i--, 1);
      }
    }
  }
};


/**
 * Get sub frame by id
 * @param {String} subFrameId
 */
Client.IdfView.prototype.getSubFrame = function (subFrameId)
{
  return this.subFrames.find(f => f.id === subFrameId);
};


Client.IdfView.prototype.closeIdfView = function ()
{
  Client.mainFrame.sendEvents(this.handleCloseButtonClick());
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfView.prototype.close = function (firstLevel, triggerAnimation)
{
  // Remove all my tooltips (this needs the DOM Obj, so must be done before the widget close)
  Client.mainFrame.wep?.resetTooltips({id: this.id});
  //
  Client.Widget.prototype.close.call(this, firstLevel, triggerAnimation);
  //
  // I'm a multiple view, remove my commands
  if (Client.mainFrame.isIDF)
    Client.mainFrame.wep?.commandList?.closeViewCommandsets(this.id, this.index <= 65536);
  //
  if (!this.isSubView && this.idfVisible)
    Client.mainFrame.wep?.soundAction(Client.IdfWebEntryPoint.soundDef.close);
};


/**
 * Check if the view must show the mobile back or menu button and in wich frame show it
 */
Client.IdfView.prototype.checkMobileButtons = function ()
{
  if (!Client.mainFrame.idfMobile || this.docked)
    return;
  //
  // Default: if the server sent the backbutton show it, otherwise show the menu
  // In a modal view we must show the backbutton, in this case it will close the view
  let showBackButton = this.backButtonText ? true : false;
  let showMenu = !showBackButton;
  if (this.owner) {
    showMenu = false;
    showBackButton = true;
  }
  //
  // If i must show the backbutton but i can't there is nothing to do
  if (showBackButton && !this.showBackButton)
    showBackButton = false;
  //
  // Check if there is a menu to show
  if (!Client.mainFrame.wep?.commandList?.hasMainMenu())
    showMenu = false;
  //
  if (this.showCaption) {
    // If the Form has the caption show the menu/backbutton on it
    let el = Client.eleMap[this.navbarConf.id];
    el.updateElement({menuButton: showMenu, backButton: showBackButton, backbuttonText: this.backButtonText});
  }
  else {
    // Get the first frame toolbar
    let frames = this.getFrameList();
    for (let f = 0; f < frames.length; f++) {
      // skip tab, tabbed and frames without toolbar
      if (frames[f] instanceof Client.IdfTab || frames[f] instanceof Client.IdfTabbedView || frames[f].onlyContent)
        continue;
      //
      // A FORM panel doesn't show the back button or the menu button if it has the list, the buttons are shown only in list layout
      if (frames[f] instanceof Client.IdfPanel && frames[f].layout === Client.IdfPanel.layouts.form && frames[f].hasList) {
        showBackButton = false;
        showMenu = false;
      }
      //
      // A Mobile tree has its backbutton, so don't show the mainmenu/backbutton if the tree is on an expanded node
      if (frames[f] instanceof Client.IdfTree && Client.mainFrame.idfMobile) {
        let el = Client.eleMap[frames[f].treeContainerConf.id];
        if (el.selectedPage !== 0) {
          showBackButton = false;
          showMenu = false;
        }
      }
      //
      // Here we get the first frame with toolbar
      let el = Client.eleMap[frames[f].menuButtonConf.id];
      el.updateElement({visible: (showMenu || showBackButton), icon: showMenu ? "menu" : "arrow-round-back"});
      //
      break;
    }
  }
};


Client.IdfView.prototype.onResize = function (ev)
{
  if (Client.mainFrame?.wep.activeView === this || this.docked || this.isSubView)
    Client.Widget.prototype.onResize.call(this, ev);
  //
  if (Client.mainFrame.isIDF) {
    let content = Client.eleMap[this.framesContainerConf.id].getRootObject();
    Client.mainFrame.sendEvents([{
        id: "resize",
        def: this.resizeEventDef,
        content: {
          oid: this.id,
          obn: "",
          par1: content.offsetWidth,
          par2: content.offsetHeight
        }
      }]);
  }
};


Client.IdfView.prototype.canResizeW = function ()
{
  return this.canResize && (this.modal !== Client.IdfView.modalMode.MDI || (this.docked && (this.dockType === Client.IdfView.dockType.LEFT || this.dockType === Client.IdfView.dockType.RIGHT)));
};

Client.IdfView.prototype.canResizeH = function ()
{
  return this.canResize && (this.modal !== Client.IdfView.modalMode.MDI || (this.docked && (this.dockType === Client.IdfView.dockType.TOP || this.dockType === Client.IdfView.dockType.BOTTOM)));
};

Client.IdfView.prototype.canMoveX = function ()
{
  return this.canMove && this.modal !== Client.IdfView.modalMode.MDI;
};

Client.IdfView.prototype.canMoveY = function ()
{
  return this.canMove && this.modal !== Client.IdfView.modalMode.MDI;
};

Client.IdfView.prototype.isMoveable = function (element)
{
  // Accept move only if the cursor is on the caption
  return this.canMove && this.modal !== Client.IdfView.modalMode.MDI && element && Client.Utils.isMyParent(element.getRootObject(), this.navbarConf.id);
};

Client.IdfView.prototype.getSupportedTransformOperation = function (x, y, element, root)
{
  return Client.Widget.prototype.getSupportedTransformOperation.call(this, x, y, element, this.parent.domObj);
};

Client.IdfView.prototype.getTransformOperationTargetObj = function (operation, element)
{
  return this.parent.domObj;
};

Client.IdfView.prototype.onTransform = function (options)
{
  if (this.modal === Client.IdfView.modalMode.POPUP || this.modal === Client.IdfView.modalMode.MODAL) {
    // Some mingling so the view doesn't exit the screen. We mantain ALWAYS 50px visible
    if (options.y < 0)
      options.y = 0;
    if (options.y > document.body.clientHeight - 50)
      options.y = document.body.clientHeight - 50;
    if (options.x < 0)
      options.x = 0;
    if (options.x > document.body.clientWidth - 50)
      options.x = document.body.clientWidth - 50;
    //
    let topBorder = window.getComputedStyle ? window.getComputedStyle(this.parent.domObj).borderTopWidth : this.parent.domObj.currentStyle['borderTopWidth'];
    let btBorder = window.getComputedStyle ? window.getComputedStyle(this.parent.domObj).borderBottomWidth : this.parent.domObj.currentStyle['borderBottomWidth'];
    options.h = options.h - parseInt("0" + topBorder, 10) - parseInt("0" + btBorder, 10);
    //
    let leftBorder = window.getComputedStyle ? window.getComputedStyle(this.parent.domObj).borderLeftWidth : this.parent.domObj.currentStyle['borderLeftWidth'];
    let rightBorder = window.getComputedStyle ? window.getComputedStyle(this.parent.domObj).borderRightWidth : this.parent.domObj.currentStyle['borderRightWidth'];
    options.w = options.w - parseInt("0" + leftBorder, 10) - parseInt("0" + rightBorder, 10);
    //
    options.x = Math.round(options.x);
    options.y = Math.round(options.y);
    options.w = Math.round(options.w);
    options.h = Math.round(options.h);
    //
    // The height is internal, we must remove the caption height
    let el = Client.eleMap[this.headerConf.id];
    options.h = options.h - (this.showCaption ? el.domObj.offsetHeight : 0);
    //
    let notifyRepos = options.x !== this.formLeft || options.y !== this.formTop;
    let notifyResize = options.w !== this.width || options.h !== this.height;
    //
    // client positioning
    // we must do the repos WITHOUT the transisions so:
    //   - add a class that removes the trasnitions
    //   - move
    //   - remove the class
    this.parent.domObj.style.setProperty("transition", "none", "important");
    this.updateElement({formLeft: options.x, formTop: options.y, height: options.h, width: options.w});
    let hh = this.parent.domObj.offsetHeight; // Needed to apply the new position immediately without the transition
    this.parent.domObj.style.transition = "";
    //
    // tell the server the new position/dimensions
    let events = [];
    if (Client.mainFrame.isIDF) {
      if (notifyRepos)
        events.push({
          id: "repos",
          def: this.resizeEventDef,
          content: {
            oid: this.id,
            obn: "",
            par1: options.x,
            par2: options.y
          }
        });
      if (notifyResize)
        events.push({
          id: "resize",
          def: this.resizeEventDef,
          content: {
            oid: this.id,
            obn: "",
            par1: options.w,
            par2: options.h
          }
        });
    }
    else {
      // TODO
    }
    Client.mainFrame.sendEvents(events);
  }
  else if (this.docked) {
    this.width = options.w;
    this.height = options.h;
    Client.mainFrame.wep.calcDockGridLayout();
  }
};


Client.IdfView.prototype.applyDragDropCursor = function (cursor)
{
  // Apply the resize cursor only on the list header
  let obj = this.parent.domObj;
  if (!obj)
    return;
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


Client.IdfView.prototype.getFrameByIndex = function (frameIndex)
{
  let flist = this.getFrameList();
  let frameFound = flist.find(f => {
    let index = parseInt(f.id.substring(f.id.indexOf(":") + 1, f.id.lastIndexOf(":")));
    return index === frameIndex;
  });
  //
  return frameFound;
};


Client.IdfView.prototype.getAllSubViews = function ()
{
  // The subviews cold be in:
  // - as subframes
  // - as tabbedview pages
  // - as fields child
  //
  // But they all link to a IdfFrame (suf:...:...) that has the subView as the 0 Element
  // -> the subview can also have a CUSTOMELEMENT as the first child..
  //
  // Get all the subframes
  let subviews = [];
  let flist = this.getFrameList();
  flist.forEach(f => {
    if (f.id.indexOf("suf:") === 0 && f.elements.length && f.elements[0]?.id?.indexOf("frm:") === 0)
      subviews.push(f.elements[0]);
  });
  //
  // the subviews can include other subviews..
  subviews.forEach(f => {
    if (f.getAllSubViews)
      subviews.push(...f.getAllSubViews());
  });
  //
  return subviews;
};


Client.IdfView.prototype.getMainIdfView = function ()
{
  // This way we avoid having to go back up the chain to the first IdfView but:
  // -> if you are in the process of realizing this.view.elements still has 0 elements. It will have them at the end of the birth of the main IdfView
  //
  // Used this way by IdfView.Realize to know what stage we are in:
  //   design-time = isSubForm && !getMainIdfView()
  //   run-time = isSubForm && getMainIdfView()
  //
  // If you change it, you will need to test the realizing flag of the main IdFView to know whether to realize our commands or not
  return this.isSubView ? this.view.elements[0] : this;
};


Client.IdfView.prototype.onHardwareBackButton = function ()
{
  // Begin with the panels, if a panel is in form and locked we can return to the list
  for (let f = 0; f < this.elements.length; f++) {
    let frame = this.elements[f];
    //
    if (frame instanceof Client.IdfPanel) {
      // Check if the panel is active and shown in its tabbed view, if is hidden we can't use it
      if (frame.parent instanceof Client.IdfTab && !frame.parent.isActiveTab())
        continue;
      //
      // If a panel has the formlist button and is in form and is locked we can return to the list
      if (frame.layout === Client.IdfPanel.layouts.form && frame.locked && frame.hasList && frame.showFormListButton(false)) {
        Client.mainFrame.sendEvents(frame.onEvent({id: "onClick", obj: frame.formListButtonConf.id}));
        return true;
      }
    }
  }
  //
  // Check if there is a view backbutton to click
  if (this.showBackButton && this.backButtonText) {
    Client.mainFrame.sendEvents(this.onEvent({id: "onBackButton", content: {offsetX: 0, offsetY: 0}}));
    return true;
  }
  //
  // If the view is modal and has the close button we can close it
  if (this.modal !== Client.IdfView.modalMode.MDI && this.showCloseButton && this.showCaption) {
    Client.mainFrame.sendEvents(this.onEvent({id: "onClick", obj: frame.closeButtonConf.id, content: {offsetX: 0, offsetY: 0}}));
    return true;
  }
  //
  return false;
};

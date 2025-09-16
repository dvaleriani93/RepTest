/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A book
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfBook = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    showStatusbar: true,
    selectedPage: -1, // Selected page in the preview
    totalPages: 0, // Total number of pages of the book
    totalPagesConfirmed: false, // Is the total number of pages the final one?
    hideBorder: false, // Should I hide the page border?
    enabledCommands: -5, // Mask of enabled commands (all except export)
    cacheSize: 1, // Number of pages present on the client at the same time
    fixedWidth: 0, // Fixed area on the left in the pages
    fixedHeight: 0, // Fixed area at the top of the pages
    scrollDirections: Client.IdfBook.scrollDirections.HORIZONTAL,
    snapToPage: true,
    optimizeDOM: false, // If true organizes iBook-style scrolling
    toolbarEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.ACTIVE : undefined),
    changePageAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("book")
  }, widget);
  //
  Client.IdfFrame.call(this, widget, parent, view);
  //
  // I notify the initial resize
  Client.mainFrame.sendEvents(this.handleResize());
};


// Make Client.IdfBook extend Client.IdfFrame
Client.IdfBook.prototype = new Client.IdfFrame();


Client.IdfBook.transPropMap = Object.assign({}, Client.IdfFrame.transPropMap, {
  pag: "selectedPage",
  ptt: "totalPages",
  pcf: "totalPagesConfirmed",
  hib: "hideBorder",
  enc: "enabledCommands",
  dgp: "deletePage",
  csz: "cacheSize",
  fiw: "fixedWidth",
  fih: "fixedHeight",
  scd: "scrollDirection",
  fsn: "forceSnap",
  opt: "optimizeDOM",
  tck: "toolbarEventDef",
  cpa: "changePageAnimationDef"
});


Client.IdfBook.scrollDirections = {
  HORIZONTAL: 0,
  VERTICAL: 1
};


Client.IdfBook.commands = {
  // Commands values to handle enable commands
  CMD_PRINT: 0x1,
  CMD_NAVIGATION: 0x2,
  CMD_CSV: 0x4
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfBook.convertPropValues = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.convertPropValues(props);
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfBook.transPropMap.pag:
      case Client.IdfBook.transPropMap.dgp:
        props[p] = parseInt(props[p]) - 1;
        break;

      case Client.IdfBook.transPropMap.ptt:
      case Client.IdfBook.transPropMap.enc:
      case Client.IdfBook.transPropMap.csz:
      case Client.IdfBook.transPropMap.fiw:
      case Client.IdfBook.transPropMap.fih:
      case Client.IdfBook.transPropMap.scd:
      case Client.IdfBook.transPropMap.tck:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfBook.transPropMap.pcf:
      case Client.IdfBook.transPropMap.hib:
      case Client.IdfBook.transPropMap.fsn:
      case Client.IdfBook.transPropMap.opt:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Get widget requirements
 * @param {Object} w
 */

Client.IdfBook.getRequirements = function (w)
{
  let prefix = Client.mainFrame.isIDF ? "fluid/" : "";
  let req = Client.IdfFrame.getRequirements(w);
  //
  // Add Swiper requirements
  if (Client.mainFrame.idfMobile) {
    req[prefix + "objects/swiper/swadapter.js"] = {type: "jc", name: "adapter"};
    req[prefix + "objects/swiper/swiper.min.js"] = {type: "jc", name: "swiper"};
    req[prefix + "objects/swiper/swiper.min.css"] = {type: "cs", name: "css"};
  }
  //
  return req;
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfBook.prototype.getRootObject = function (el)
{
  if (this.moving)
    return Client.IdfFrame.prototype.getRootObject.call(this, el);
  //
  let rootObject = Client.eleMap[this.bookContainerConf.id];
  return el ? rootObject : rootObject.domObj;
};


/**
 * Get root object used by handleResize
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfBook.prototype.getResizeRootObject = function (el)
{
  return this.getRootObject(el);
};


/**
 * Create elements configuration
 * @@param {Object} widget
 */
Client.IdfBook.prototype.createElementsConfig = function (widget)
{
  Client.IdfFrame.prototype.createElementsConfig.call(this, widget);
  //
  let w = {events: ["onDragstart", "onDragenter", "onDragover", "onDragleave", "onDragend", "onDrop"]};
  if (Client.mainFrame.idfMobile) {
    w.c = "Swiper";
    w.options = {noSwipingClass: "book-box-draggable"};
    w.events.push("onChange");
  }
  else
    w.c = "AltContainer";
  //
  this.bookContainerConf = this.createElementConfig(w);
  this.contentContainerConf.children.push(this.bookContainerConf);
  //
  // Set animation (if required)
  let a = Client.IdfWebEntryPoint.getAnimationByDef(this.changePageAnimationDef);
  if (a)
    this.bookContainerConf.animations = [{trigger: "change", ...a}];
  //
  // Create status bar configuration
  this.statusbarConf = this.createElementConfig({c: "Span", className: "panel-statusbar"});
  this.titleConf.children.push(this.statusbarConf);
  //
  // Create top button configuration
  this.topButtonConf = this.createElementConfig({c: "IonButton", icon: "rewind", className: "generic-btn panel-toolbar-btn top-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.topButtonConf);
  //
  // Create previous button configuration
  this.prevButtonConf = this.createElementConfig({c: "IonButton", icon: "play", className: "generic-btn panel-toolbar-btn prev-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.prevButtonConf);
  //
  // Create next button configuration
  this.nextButtonConf = this.createElementConfig({c: "IonButton", icon: "play", className: "generic-btn panel-toolbar-btn next-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.nextButtonConf);
  //
  // Create bottom button configuration
  this.bottomButtonConf = this.createElementConfig({c: "IonButton", icon: "fastforward", className: "generic-btn panel-toolbar-btn bottom-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.bottomButtonConf);

  // Create print button configuration
  this.printButtonConf = this.createElementConfig({c: "IonButton", icon: "print", className: "generic-btn panel-toolbar-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.printButtonConf);
  //
  // Create csv button configuration
  this.csvButtonConf = this.createElementConfig({c: "IonButton", icon: "open", className: "generic-btn panel-toolbar-btn", events: ["onClick"]});
  this.toolbarConf.children.push(this.csvButtonConf);
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfBook.prototype.createChildren = function (el)
{
  // The page delete command arrives as an attribute.
  // Since the new pages are created before managing the variations and the sections do not have a unique id,
  // I have to manage the deletion of the page here.
  if (el.deletePage) {
    this.deletePage(this.elements.find(p => p.number === el.deletePage));
    delete el.deletePage;
  }
  //
  // I look for the correct position for each page
  el.children.forEach((newPage, index) => {
    if (index === 0) {
      for (let i = this.elements.length - 1; i >= 0; i--) {
        let page = this.elements[i];
        if (page.number === newPage.number) {
          this.replacingPage = true;
          this.removeChild(page);
          delete this.replacingPage;
        }
        else if (page.number < newPage.number) {
          newPage.previd = page.id;
          break;
        }
      }
    }
    else
      newPage.previd = el.children[index - 1].id;
  });
  //
  Client.Widget.prototype.createChildren.call(this, el);
  //
  if (el.children.find(p => p.number === el.selectedPage))
    this.selectedPage = -1;
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfBook.prototype.updateElement = function (props)
{
  Client.IdfFrame.prototype.updateElement.call(this, props);
  //
  let el = {};
  let updateFixedZones = false;
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "selectedPage":
        this.setSelectedPage(v, el);
        break;

      case "totalPages":
        this.setTotalPages(v, el);
        break;

      case "totalPagesConfirmed":
        this.setTotalPagesConfirmed(v, el);
        break;

      case "hideBorder":
        this.setHideBorder(v, el);
        break;

      case "enabledCommands":
        this.setEnabledCommands(v);
        break;

      case "cacheSize":
        this.cacheSize = v;
        break;

      case "fixedWidth":
        this.fixedWidth = v;
        updateFixedZones = true;
        break;

      case "fixedHeight":
        this.fixedHeight = v;
        updateFixedZones = true;
        break;

      case "scrollDirection":
        this.scrollDirection = v;
        this.refreshMobileContainer = true;
        break;

      case "snapToPage":
        this.snapToPage = v;
        this.refreshMobileContainer = true;
        break;

      case "optimizeDOM":
        this.optimizeDOM = v;
        this.refreshMobileContainer = true;
        break;
    }
  }
  //
  if (el.updateStatusbar) {
    delete el.updateStatusbar;
    this.updateStatusbar();
  }
  //
  this.getRootObject(true).updateElement(el);
  //
  if (this.refreshMobileContainer)
    this.updateMobileContainer();
  //
  // If I need to update the fixed zone, I do
  if (updateFixedZones)
    this.updateFixedZones();
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfBook.prototype.onEvent = function (event)
{
  let events = Client.IdfFrame.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
    {
      let newPage = "page" in event ? event.page : this.selectedPage;
      let button = event.button;
      switch (event.obj) {
        case this.topButtonConf.id:
          button = "top";
          newPage = 0;
          break;

        case this.prevButtonConf.id:
          button = "prev";
          if (this.selectedPage > 0)
            newPage = this.selectedPage - 1;
          break;

        case this.nextButtonConf.id:
          button = "next";
          if (!this.totalPagesConfirmed || this.selectedPage < this.totalPages - 1)
            newPage = this.selectedPage + 1;
          break;

        case this.bottomButtonConf.id:
          button = "bottom";
          newPage = (this.totalPagesConfirmed ? this.totalPages - 1 : -1);
          break;

        case this.printButtonConf.id:
          button = "print";
          break;

        case this.csvButtonConf.id:
          button = "csv";
          break;
      }
      //
      // If I don't have the page in cache I send the event immediately
      let eventDef = this.toolbarEventDef;
      if (button !== "csv" && button !== "print") {
        // I decide whether to operate on the client side
        if (!this.getPageByIndex(newPage) || this.cacheSize !== 1)
          eventDef |= Client.IdfMessagesPump.eventTypes.IMMEDIATE;
      }
      //
      if (button)
        events.push({
          id: "booktb",
          def: eventDef,
          content: {
            oid: this.id,
            obn: button,
            par1: newPage + 1,
            xck: event.content?.offsetX,
            yck: event.content?.offsetY
          }
        });
      //
      // If the event can be handled on the client side and I have the page in cache I'll show it
      if (this.selectedPage !== newPage && newPage !== -1 && (!Client.mainFrame.isIDF || Client.IdfMessagesPump.isClientSideEvent(eventDef)))
        this.updateElement({selectedPage: newPage});
      break;
    }

    case "onChange":
      return this.onEvent({
        id: "onClick",
        button: "goto",
        page: this.elements[event.content.activeIndex].number
      });

    case "onDragstart":
      this.handleDragStart(event);
      break;

    case "onDragenter":
      this.handleDragEnter(event);
      break;

    case "onDragover":
      this.handleDragOver(event);
      break;

    case "onDragleave":
      this.handleDragLeave(event);
      break;

    case "onDragend":
      this.handleDragEnd(event);
      break;

    case "onDrop":
      events.push(...this.handleDrop(event));
      break;
  }
  //
  return events;
};


/**
 * Get the droppable box's div referred a target object
 * @param {Object} target
 */
Client.IdfBook.getDroppableBoxOver = function (target)
{
  while (target && target !== document) {
    if (target.classList.contains("book-box-droppable"))
      return target;
    //
    if (target.classList.contains("book-box"))
      return;
    //
    target = target.parentNode;
  }
};


Client.IdfBook.prototype.handleDragStart = function (event)
{
  let srcEvent = event.content.srcEvent;
  //
  // Set the ID of the dragged box
  let draggedBox = Client.eleMap[srcEvent.target.id].parentWidget;
  srcEvent.dataTransfer.setData("text", draggedBox.id);
  srcEvent.dataTransfer.effectAllowed = "move";
  //
  // I apply the class late to give the system time to clone the object
  setTimeout(() => srcEvent.target.classList.add("book-box-dragged"));
};


Client.IdfBook.prototype.handleDragEnter = function (event)
{
  let srcEvent = event.content.srcEvent;
  let droppableBox = Client.IdfBook.getDroppableBoxOver(srcEvent.target);
  if (!droppableBox)
    return;
  //
  // Enable the drag
  srcEvent.preventDefault();
  //
  // Set the class to hilight the target
  droppableBox.classList.add("book-box-drop-hover");
  //
  // Change the cursor
  srcEvent.dataTransfer.dropEffect = "move";
};


Client.IdfBook.prototype.handleDragOver = function (event)
{
  let srcEvent = event.content.srcEvent;
  if (!Client.IdfBook.getDroppableBoxOver(srcEvent.target))
    return;
  //
  srcEvent.preventDefault();
  srcEvent.dataTransfer.dropEffect = "move";
};


Client.IdfBook.prototype.handleDragLeave = function (event)
{
  let srcEvent = event.content.srcEvent;
  //
  // Clear the drop effect classes
  let leavedBox = Client.IdfBook.getDroppableBoxOver(srcEvent.toElement);
  let enteredBox = Client.IdfBook.getDroppableBoxOver(srcEvent.fromElement);
  if (leavedBox && (!enteredBox || leavedBox !== enteredBox))
    leavedBox.classList.remove("book-box-drop-hover");
};


Client.IdfBook.prototype.handleDragEnd = function (event)
{
  let srcEvent = event.content.srcEvent;
  //
  // Clear all the drag effect classes
  srcEvent.target.classList.remove("book-box-dragged");
};


Client.IdfBook.prototype.handleDrop = function (event)
{
  let srcEvent = event.content.srcEvent;
  let draggedBox = Client.eleMap[srcEvent.dataTransfer.getData("text")];
  let droppedBox = Client.eleMap[Client.IdfBook.getDroppableBoxOver(srcEvent.target).id].parentWidget;
  //
  // Clear all the drop effect classes
  droppedBox.getRootObject().classList.remove("book-box-drop-hover");
  //
  let events = [];
  events.push({
    id: "drp",
    def: droppedBox.dropEventDef,
    content: {
      oid: droppedBox.id,
      obn: draggedBox.id
    }
  });
  //
  return events;
};


/**
 * Return true if given command is enabled
 * @param {Integer} cmd
 */
Client.IdfBook.prototype.isCommandEnabled = function (cmd)
{
  return (this.enabledCommands & cmd) && this.showToolbar && !this.collapsed;
};


/**
 * Update toolbar
 */
Client.IdfBook.prototype.updateToolbar = function ()
{
  Client.IdfFrame.prototype.updateToolbar.call(this);
  //
  // Update status bar
  this.updateStatusbar();
  //
  // Update navigation buttons
  let showNavButtons = !!this.isCommandEnabled(Client.IdfBook.commands.CMD_NAVIGATION);
  Client.eleMap[this.topButtonConf.id].updateElement({visible: showNavButtons, tooltip: this.getTooltip(this.topButtonConf.id)});
  Client.eleMap[this.prevButtonConf.id].updateElement({visible: showNavButtons, tooltip: this.getTooltip(this.prevButtonConf.id)});
  Client.eleMap[this.nextButtonConf.id].updateElement({visible: showNavButtons, tooltip: this.getTooltip(this.nextButtonConf.id)});
  Client.eleMap[this.bottomButtonConf.id].updateElement({visible: showNavButtons, tooltip: this.getTooltip(this.bottomButtonConf.id)});
  //
  // Update print button
  let showPrintButton = !!this.isCommandEnabled(Client.IdfBook.commands.CMD_PRINT);
  Client.eleMap[this.printButtonConf.id].updateElement({visible: showPrintButton, tooltip: this.getTooltip(this.printButtonConf.id)});
  //
  // Update csv button
  let showCsvButton = !!this.isCommandEnabled(Client.IdfBook.commands.CMD_CSV);
  Client.eleMap[this.csvButtonConf.id].updateElement({visible: showCsvButton, tooltip: this.getTooltip(this.csvButtonConf.id)});
};


/**
 * Get tooltip for given object
 * @param {String} objId
 */
Client.IdfBook.prototype.getTooltip = function (objId)
{
  let tooltip = Client.IdfFrame.prototype.getTooltip.call(this, objId);
  if (tooltip)
    return tooltip;
  //
  let wep = Client.mainFrame.wep;
  let title, content;
  //
  switch (objId) {
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

    case this.printButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Print");
      content = wep?.SRV_MSG_CreatePDF || Client.IdfResources.t("SRV_MSG_CreatePDF");
      break;

    case this.csvButtonConf.id:
      title = Client.IdfResources.t("TIP_TITLE_Export");
      content = wep?.SRV_MSG_Export || Client.IdfResources.t("SRV_MSG_Export");
      break;
  }
  //
  return Client.Widget.getHTMLTooltip(title, content);
};


/**
 * Update status bar
 */
Client.IdfBook.prototype.updateStatusbar = function ()
{
  let visible = this.showStatusbar && !this.collapsed;
  let text = Client.IdfResources.t("SRV_MSG_PageNumOf", [this.selectedPage + 1, this.totalPages + (this.totalPagesConfirmed ? "" : "+")]);
  //
  // Update status bar element
  Client.eleMap[this.statusbarConf.id].updateElement({innerText: text, visible});
};


Client.IdfBook.prototype.setSelectedPage = function (value, el)
{
  this.selectedPage = value;
  //
  // I look for the page currently selected and the one to select
  this.refreshMobileContainer = true;
  //
  // Change the page selected
  let propToUpdate = Client.mainFrame.idfMobile ? "index" : "selectedPage";
  if (this.selectedPage >= 0) {
    let realPageIndex = this.elements.findIndex(page => page.number === this.selectedPage);
    if (realPageIndex >= 0)
      el[propToUpdate] = realPageIndex;
  }
  else
    el[propToUpdate] = 0;
  //
  el.updateStatusbar = true;
};


Client.IdfBook.prototype.setTotalPages = function (value, el)
{
  if (this.totalPages === value)
    return;
  //
  this.totalPages = value;
  this.refreshMobileContainer = true;
  //
  // If I was showing a page and there are no more pages
  if (this.totalPages === 0) {
    // I remove all pages
    while (this.elements.length > 0)
      this.removeChild(this.elements[0]);
    //
    // I go to page -1
    this.setSelectedPage(-1, el);
  }
  //
  el.updateStatusbar = true;
};


Client.IdfBook.prototype.setTotalPagesConfirmed = function (value, el)
{
  if (this.totalPagesConfirmed === value)
    return;
  //
  this.totalPagesConfirmed = value;
  this.refreshMobileContainer = true;
  el.updateStatusbar = true;
};


Client.IdfBook.prototype.setHideBorder = function (value, el)
{
  // Remove previous className
  let rootObject = this.getRootObject(true);
  Client.Widget.updateElementClassName(rootObject, this.getClassForHideBorder(), true);
  //
  // Apply new className
  this.hideBorder = value;
  Client.Widget.updateElementClassName(rootObject, this.getClassForHideBorder());
  this.onResize();
};
Client.IdfBook.prototype.getClassForHideBorder = function ()
{
  return "book-container" + (this.hideBorder ? "-noborder" : "");
};


Client.IdfBook.prototype.setEnabledCommands = function (value)
{
  this.enabledCommands = value;
  this.updateToolbar();
};


Client.IdfBook.prototype.getPageByIndex = function (index)
{
  return this.elements.find(page => page.number === index);
};


/**
 * Update fixed zones
 */
Client.IdfBook.prototype.updateFixedZones = function ()
{
  // I check all the pages
  this.elements.forEach(p => p.updateFixedZones());
};


/**
 * Delete page
 * @param {Client.IdfBookPage} page
 */
Client.IdfBook.prototype.deletePage = function (page)
{
  this.removeChild(page);
};


/**
 * Handle reset cache command
 * @param {Object} options
 */
Client.IdfBook.prototype.resetCache = function (options)
{
  let from = (this.cacheSize === 1 ? 0 : options.from);
  let to = (this.cacheSize === 1 ? 0 : options.to);
  //
  // I delete all invisible pages from the cache ...
  // I keep the one currently visible so I can work in differential
  for (let i = 0; i < this.elements.length; i++) {
    let page = this.elements[i];
    let toRemove = false;
    //
    // Single-page: delete all pages except the active one
    if (this.cacheSize === 1 || from === 0 || to === 0)
      toRemove = (page.number !== this.selectedPage);
    else // Multi-page: delete all pages outside the range communicated by the server
      toRemove = (page.number < from || page.number > to);
    //
    if (toRemove) {
      this.deletePage(page);
      i--;
    }
  }
};


Client.IdfBook.prototype.updateMobileContainer = function ()
{
  delete this.refreshMobileContainer;
  if (!Client.mainFrame.idfMobile || this.replacingPage)
    return;
  //
  let realPageIndex = this.elements.findIndex(page => page.number === this.selectedPage);
  if (this.selectedPage > 0 && !this.elements[realPageIndex - 1])
    this.createPagePlaceHolder(this.selectedPage - 1, this.elements[realPageIndex].id);
  //
  if (this.selectedPage >= 0 && (this.selectedPage < this.totalPages - 1 || !this.totalPagesConfirmed) && !this.elements[realPageIndex + 1])
    this.createPagePlaceHolder(this.selectedPage + 1);
  //
  if (this.totalPagesConfirmed) {
    // I remove all the placeHolder pages at the bottom
    for (let i = this.elements.length - 1; i >= 0; i--) {
      let lastPage = this.elements[i];
      //
      // I stop as soon as I find a real page
      if (!lastPage.isPlaceHolder)
        break;
      //
      this.removeChild(lastPage);
    }
  }
};


Client.IdfBook.prototype.createPagePlaceHolder = function (number, sib)
{
  let aPage = this.elements[0];
  let newPageConf = this.createElementConfig({
    c: "IdfBookPage",
    number,
    width: aPage._width,
    height: aPage._height,
    unitOfMeasure: aPage.unitOfMeasure,
    fitMode: aPage.fitMode,
    isPlaceHolder: true
  });
  let newPage = this.insertBefore({child: newPageConf, sib});
  newPage.getRootObject(true).updateElement({
    className: "book-page-placeholder " + newPage.getRootObject().className,
    innerText: number + 1
  });
  return newPage;
};


/**
 * Get click detail
 * @param {Object} event
 * @param {Widget} srcWidget
 */
Client.IdfBook.prototype.getClickDetail = function (event, srcWidget)
{
  let detail = Client.IdfFrame.prototype.getClickDetail.call(this, event, srcWidget);
  //
  if (srcWidget instanceof Client.IdfControl)
    srcWidget = srcWidget.parent;
  if (srcWidget instanceof Client.IdfSpan)
    srcWidget = srcWidget.parent;
  //
  let box = -1;
  if (srcWidget instanceof Client.IdfBox) {
    let compStyle = getComputedStyle(srcWidget.getRootObject());
    detail.x = Math.round(Client.IdfBookPage.convertFromPx(event.content.offsetX + parseInt(compStyle.borderLeftWidth), srcWidget.page.unitOfMeasure));
    detail.y = Math.round(Client.IdfBookPage.convertFromPx(event.content.offsetY + parseInt(compStyle.borderTopWidth), srcWidget.page.unitOfMeasure));
    box = srcWidget.id;
  }
  //
  if (Client.mainFrame.isIDF)
    detail.par4 = box;
  else
    detail.box = box;
  //
  return detail;
};


/*
 * A book doesn't accept the generic Drop on himself, only on its boxes..
 */
Client.IdfBook.prototype.acceptsDrop = function (element)
{
  return false;
};

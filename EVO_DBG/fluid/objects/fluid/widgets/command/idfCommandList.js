/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A list of commands set
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfCommandList = function (widget, parent, view)
{
  Client.mainFrame.wep.commandList = this;
  this.expandedMenus = []; // Only for grouped menu
  //
  // Set default events definition
  widget = Object.assign({
    clickEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.CLIENTSIDE : undefined),
    sidebarAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("sidebar")
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfCommandList extend Client.Widget
Client.IdfCommandList.prototype = new Client.Widget();


Client.IdfCommandList.transPropMap = {
  sma: "sidebarAnimationDef",
  sup: "suppressMenu"
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfCommandList.convertPropValues = function (props) {
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfCommandList.transPropMap.sup:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfCommandList.prototype.getRootObject = function (el)
{
  let top = (this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR);
  let boxId = this.parent.hasSideMenu() ? this.menuPage0.id : (top ? this.menuConf.id : this.menuIntConf.id);
  let rootObject = Client.eleMap[boxId];
  return el ? rootObject : rootObject.domObj;
};


/**
 * Create elements configuration
 */
Client.IdfCommandList.prototype.createElementsConfig = function ()
{
  if (this.parent.hasSideMenu()) {
    this.menuConf = this.createElementConfig({c: "IonMenu", className: "main-menu main-menu-vertical", animate: true, visible: !Client.mainFrame.idfMobile});
    if (this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.RIGHT)
      this.menuConf.side = "right";
    //
    this.menuHeaderConf = this.createElementConfig({c: "IonNavBar", className: "main-menu-header", visible: (this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.GROUPED), events: ["onBackButton"]});
    this.menuConf.children.push(this.menuHeaderConf);
    this.menuTitleConf = this.createElementConfig({c: "IonTitle", className: "main-menu-header-title"});
    this.menuHeaderConf.children.push(this.menuTitleConf);
    //
    this.menuContentConf = this.createElementConfig({c: "IonContent", className: "main-menu-content"});
    this.menuConf.children.push(this.menuContentConf);
    //
    this.menuInnerConf = this.createElementConfig({c: "AltContainer", className: "main-menu-inner-content", selectedPage: 0});
    this.menuInnerConf.animations = [{trigger: "change", type: "slide", easing: "ease", duration: 350, delay: 0, from: "left"}];
    this.menuContentConf.children.push(this.menuInnerConf);
    //
    this.menuPage0 = this.createElementConfig({c: "Container", className: "main-menu-inner-page"});
    this.menuPage1 = this.createElementConfig({c: "Container", className: "main-menu-inner-page"});
    this.menuPage2 = this.createElementConfig({c: "Container", className: "main-menu-inner-page"});
    this.menuPage3 = this.createElementConfig({c: "Container", className: "main-menu-inner-page"});
    this.menuInnerConf.children.push(this.menuPage0);
    this.menuInnerConf.children.push(this.menuPage1);
    this.menuInnerConf.children.push(this.menuPage2);
    this.menuInnerConf.children.push(this.menuPage3);
    //
    // Create open views list
    this.openViewsListConf = this.createElementConfig({c: "IonList", className: "main-menu-list open-views-box"});
    //
    let headerConf = this.createElementConfig({c: "IonItem", type: "header", className: "generic-item main-menu-header open-views-header", customid: "form-list-header"});
    this.openViewsListConf.children.push(headerConf);
    //
    let headerLabelConf = this.createElementConfig({c: "IonLabel", t: Client.IdfResources.t("SRV_MSG_OpenViews")});
    headerConf.children.push(headerLabelConf);
    //
    this.openViewsContainerConf = this.createElementConfig({c: "Container"});
    this.openViewsListConf.children.push(this.openViewsContainerConf);
    //
    this.closeAllItemConf = this.createElementConfig({c: "IonItem", type: "button", className: "generic-item main-menu-item close-all-views-item", events: ["onClick"], visible: false, customid: "form-list-close-all-box"});
    this.openViewsListConf.children.push(this.closeAllItemConf);
    //
    let closeAllIconConf = this.createElementConfig({c: "IonIcon", icon: "close"});
    this.closeAllItemConf.children.push(closeAllIconConf);
    //
    let closeAllLabelConf = this.createElementConfig({c: "IonLabel", t: Client.IdfResources.t("SRV_MSG_CloseAll")});
    this.closeAllItemConf.children.push(closeAllLabelConf);
    //
    if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.GROUPED) {
      this.openViewsListConf.visible = false;
      this.menuContentConf.className += " grouped-menu";
      //
      // Needed for the menu altcontainer animation
      this.visible = true;
    }
  }
  else {
    let top = Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR;
    this.menuConf = this.createElementConfig({c: "Container", className: "main-menu-horizontal container-main-horizontal" + (top ? "" : " bottom"), visible: true});
    //
    if (!top) {
      // We need : the button to open the menu
      this.buttonContainer = this.createElementConfig({c: "IonButton", className: "main-menu-button", icon: "menu", clear: "true", iconPosition: "only", events: ["onClick"], customid: "taskbar-start-cell"});
      this.menuConf.children.push(this.buttonContainer);
      //
      this.menuIntBack = this.createElementConfig({c: "Container", className: "main-menu-background hidden", animate: true, visible: true, events: ["onClick"]});
      this.menuConf.children.push(this.menuIntBack);
      //
      this.menuIntConf = this.createElementConfig({c: "Container", className: "main-menu hidden", animate: true, visible: true});
      this.menuConf.children.push(this.menuIntConf);
      //
      this.openViewsContainerConf = this.createElementConfig({c: "Container", className: "bottom-view-list-container"});
      this.menuConf.children.push(this.openViewsContainerConf);
    }
  }
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfCommandList.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  this.createElementsConfig();
  //
  // Create IonMenu
  let menu;
  //
  // In this case the IonMenu must be created into the hader, not in the mainObject of Wep
  if (Client.mainFrame.wep?.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR && Client.mainFrame.wep.isGlbToolbarHeader())
    menu = Client.eleMap[Client.mainFrame.wep.navbarContainerConf.id].insertBefore({child: this.menuConf});
  else
    menu = Client.mainFrame.wep.getRootObject(true).insertBefore({child: this.menuConf, sib: Client.mainFrame.wep.pageConf.id});
  //
  this.mainObjects.push(menu);
  //
  // Create widget children
  this.createChildren(widget);
  //
  if (this.parent.hasSideMenu())
    Client.eleMap[this.menuPage0.id].insertBefore({child: this.openViewsListConf});
  //
  if (this.sidebarAnimationDef.indexOf("none") > -1) {
    let splitObj = Client.eleMap[this.parent.mainContainerConf.id];
    splitObj.updateElement({className: splitObj.className + " notr"});
  }
  //
  this.checkMobileMenu(true);
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfCommandList.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (props.suppressMenu !== undefined) {
    this.suppressMenu = props.suppressMenu;
    //
    if (Client.mainFrame.idfMobile) {
      // On Mobile the suppress menu handles the type of the menu (overflow or automatic)
      let splitObj = Client.eleMap[this.parent.mainContainerConf.id];
      splitObj?.updateElement({when: this.suppressMenu ? "never" : "lg"});
    }
    else {
      this.toggleMenu(!this.suppressMenu);
    }  
  }
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfCommandList.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      // If close all item has been clicked, close all views
      if (this.closeAllItemConf && event.obj === this.closeAllItemConf.id) {
        if (Client.mainFrame.isIDF)
          events.push({
            id: "claclk",
            def: this.parent.closeAllEventDef,
            content: {
              oid: this.parent.id,
              xck: event.content.offsetX,
              yck: event.content.offsetY
            }
          });
        else
          this.parent.closeAllViews();
      }
      else if (this.buttonContainer && event.obj === this.buttonContainer.id)
        this.showMenu();
      else if (this.menuIntBack && event.obj === this.menuIntBack.id)
        this.hideMenu();
      else {
        // Must be an entry on the form list
        let itlist = this.openViews ? this.openViews : this.openViewsContainerConf.children;
        //
        // Check if clicked item is one of open views items
        for (let i = 0; i < itlist.length; i++) {
          let itemConf = itlist[i];
          //
          // If open view item has been clicked
          if (event.obj === itemConf.id) {
            let view = Client.eleMap[itemConf.viewId];
            //
            // If I'm on IDF, activate view just if click on a view list item has to be handled client side too
            if (!Client.mainFrame.isIDF || Client.IdfMessagesPump.isClientSideEvent(view.clickViewListEventDef))
              this.parent.activeView = itemConf.viewId;
            break;
          }
        }
      }
      break;

    case "onMenuButton":
      // If I'm on IDF, show/hide the menu if event has to be handled client side too
      if (!Client.mainFrame.isIDF || Client.IdfMessagesPump.isClientSideEvent(this.clickEventDef))
        this.toggleMenu();
      //
      // Give event the IDF format
      if (Client.mainFrame.isIDF)
        events.push({
          id: "clk",
          def: this.clickEventDef,
          content: {
            oid: this.id,
            xck: event.content.offsetX,
            yck: event.content.offsetY
          }
        });
      else {
        // On IDC send onMenuButton event as is. Just change object on which to fire the event
        event.obj = this.id;
        events.push(event);
      }
      //
      break;

    case "onBackButton":
      let lastMenu = this.expandedMenus.pop();
      event.id = "onClick";
      event.obj = lastMenu.headerConf.id;
      events.push(...lastMenu.onEvent(event));
      break;
  }
  //
  return events;
};


/**
 * Realize taskbar toolbar
 * @param {Object} toolbarConf
 */
Client.IdfCommandList.prototype.realizeTaskBarToolbar = function (toolbarConf)
{
  return Client.eleMap[this.menuConf.id].insertBefore({child: toolbarConf, sib: this.openViewsContainerConf.id});
};


/**
 * Realize statusbar
 * @param {Object} statusbarConf
 */
Client.IdfCommandList.prototype.realizeStatusbar = function (statusbarConf)
{
  return Client.eleMap[this.menuConf.id].insertBefore({child: statusbarConf});
};


/**
 * Show/hide menu (only for sideMenu)
 * @param {Boolean} show
 */
Client.IdfCommandList.prototype.toggleMenu = function (show)
{
  if (this.parent.hasSideMenu()) {
    let menuObj = Client.eleMap[this.menuConf.id];
    let splitObj = Client.eleMap[this.parent.mainContainerConf.id];
    let toShow = show ?? !menuObj.visible;
    //
    // When responsive the menu can became overlay, we can check it by using the exposed flag.
    // If is in overlay mode the button doesn't need to do anything
    //
    // No need to do this in mobile, the ionmenu handles the reveal
    if (Client.mainFrame.idfMobile || (Client.mainFrame.wep.defaultResponsiveClass != "" && !splitObj.exposed)) {
      // If the splitobj is exposed (forever visible) we CANNOT hide it
      // -> handle the animate AND a visibility timer if already set
      // -> for the animate check SplitPane.updateElement -> exposed
      if (splitObj.exposed) {
        toShow = true;
        menuObj.animate = false;
        if (menuObj.showTimer) {
          clearTimeout(menuObj.showTimer);
          delete menuObj.showTimer;
        }
      }
      menuObj.updateElement({visible: toShow});
      menuObj.animate = true;
    }
    else {
      // No need to do anything
      if (menuObj.visible === toShow)
        return;
      //
      if (this.sidebarAnimationDef.indexOf("fold") >= 0)
        this.toggleMenuFold(toShow);
      else
        this.toggleMenuScroll(toShow);
    }
  }
};


Client.IdfCommandList.prototype.toggleMenuScroll = function (toShow)
{
  let menuObj = Client.eleMap[this.menuConf.id];
  let splitObj = Client.eleMap[this.parent.mainContainerConf.id];
  splitObj.animate = false;
  //
  if (toShow) {
    // Clear the trasition and set the stage: show the menu and enlarge the split
    splitObj.domObj.style.transition = "left 0ms ease 0s, right 0ms ease 0s";
    menuObj.navObj.style.display = "";
    menuObj.navObj.classList.toggle("hidden", false);
    //
    if (this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.RIGHT)
      splitObj.domObj.style.right = "-" + (this.parent.sideMenuWidth ? this.parent.sideMenuWidth : 200) + "px";
    else
      splitObj.domObj.style.left = "-" + (this.parent.sideMenuWidth ? this.parent.sideMenuWidth : 200) + "px";
    //
    // Restore the transition to 200ms (default) and do the animation
    setTimeout(() => {
      splitObj.domObj.style.transition = "";
      splitObj.domObj.style.left = "0";
      splitObj.domObj.style.right = "0";
    }, 30);
    //
    // At the end of the animation reset the menu
    setTimeout(() => menuObj.updateElement({visible: toShow}), 260);
  }
  else {
    // HIDE the side menu
    splitObj.domObj.style.transition = "";
    //
    if (this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.RIGHT)
      splitObj.domObj.style.right = "-" + (this.parent.sideMenuWidth ? this.parent.sideMenuWidth : 200) + "px";
    else
      splitObj.domObj.style.left = "-" + (this.parent.sideMenuWidth ? this.parent.sideMenuWidth : 200) + "px";
    //
    // restore the standard dims after the animation
    setTimeout(() => {
      splitObj.domObj.style.transition = "left 0ms ease 0s, right 0ms ease 0s";
      menuObj.navObj.style.display = "none";
      splitObj.domObj.style.left = "0";
      splitObj.domObj.style.right = "0";
      menuObj.updateElement({visible: toShow});
      menuObj.navObj.classList.toggle("hidden", !toShow);
    }, 260);
  }
};


Client.IdfCommandList.prototype.toggleMenuFold = function (toShow)
{
  let menuObj = Client.eleMap[this.menuConf.id];
  //
  if (toShow) {
    menuObj.updateElement({visible: toShow});
    menuObj.navObj.classList.toggle("hidden", !toShow);
    menuObj.navObj.className = "has-scrollbar show-menu split-pane-side folding";
    setTimeout(() => menuObj.navObj.className = "has-scrollbar show-menu split-pane-side", 260);
  }
  else {
    menuObj.navObj.className = "has-scrollbar show-menu split-pane-side folding folded";
    setTimeout(() => {
      menuObj.updateElement({visible: toShow});
      menuObj.navObj.classList.toggle("hidden", !toShow);
    }, 260);
  }
};

/**
 * Show the menu (only for TASKBAR MENU)
 */
Client.IdfCommandList.prototype.showMenu = function ()
{
  let menubackObj = Client.eleMap[this.menuIntBack.id];
  menubackObj.updateElement({className: "main-menu-background"});
  //
  let menuIntObj = Client.eleMap[this.menuIntConf.id];
  //
  // Set the menu height
  let rootObject = menuIntObj.getRootObject(true);
  rootObject.style.height = "";
  let h = rootObject.offsetHeight;
  rootObject.style.height = h + "px";
  //
  // Show the menu
  menuIntObj.updateElement({className: "main-menu"});
};


/**
 * Hide the menu (only for taskbar)
 */
Client.IdfCommandList.prototype.hideMenu = function ()
{
  let menubackObj = Client.eleMap[this.menuIntBack.id];
  menubackObj.updateElement({className: "main-menu-background hidden"});
  //
  let menuIntObj = Client.eleMap[this.menuIntConf.id];
  menuIntObj.updateElement({className: "main-menu hidden"});
};



/**
 * Add an item to views open list
 * @param {IdfView} view
 */
Client.IdfCommandList.prototype.addViewOpenItem = function (view)
{
  if (view.showViewList && !view.docked) {
    if (this.parent.hasSideMenu() || this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.TASKBAR) {
      // Create item configuration
      let itemConf = this.createElementConfig({c: "IonItem", type: "button", className: "generic-item open-views-item", events: ["onClick"]});
      if (!this.parent.hasSideMenu())
        itemConf = this.createElementConfig({c: "Container", className: "open-views-item-taskbar", events: ["onClick"]});
      //
      // Remember this item is linked to given viewId.
      itemConf.viewId = view.id;
      //
      // Add item to open views container
      this.openViewsContainerConf.children.push(itemConf);
      //
      // Create a item label configuration
      let innerHTML = Client.Widget.getHTMLForCaption(view.caption);
      let labelConf = this.createElementConfig({c: "IonLabel", innerHTML});
      if (!this.parent.hasSideMenu())
        labelConf = this.createElementConfig({c: "Container", tag: "span", innerHTML});
      itemConf.children.push(labelConf);
      //
      // Create item element and append it to open views container
      let openViewsContainer = Client.eleMap[this.openViewsContainerConf.id];
      let e = this.view.createElement(itemConf, openViewsContainer, this.view);
      openViewsContainer.elements.push(e);
      //
      // Show close all item
      if (this.parent.hasSideMenu()) {
        let closeAllItem = Client.eleMap[this.closeAllItemConf.id];
        closeAllItem.updateElement({visible: true});
      }
    }
    else if (this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR) {
      if (!this.openViews)
        this.openViews = [];
      //
      let {caption, icon} = Client.Widget.extractCaptionData(view.caption);
      this.openViews.push({id: view.id, viewId: view.id, viewName: caption, icon});
    }
  }
  //
  // Activate newborn item
  if (view === Client.mainFrame.wep.activeView)
    this.activateViewOpenItem(view);
};


/**
 * Remove an item from views open list
 * @param {IdfView} view
 */
Client.IdfCommandList.prototype.removeViewOpenItem = function (view)
{
  if (this.parent.hasSideMenu() || this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.TASKBAR) {
    for (let i = 0; i < this.openViewsContainerConf.children.length; i++) {
      let itemConf = this.openViewsContainerConf.children[i];
      //
      // If open view item has been clicked, activate it and show linked view
      if (view.id === itemConf.viewId) {
        let openViewsEl = Client.eleMap[this.openViewsContainerConf.id];
        openViewsEl.removeChild({id: itemConf.id});
        //
        this.openViewsContainerConf.children.splice(i, 1);
        //
        // Show close all item
        if (this.parent.hasSideMenu() && !this.openViewsContainerConf.children.length) {
          let closeAllItem = Client.eleMap[this.closeAllItemConf.id];
          closeAllItem.updateElement({visible: false});
        }
        break;
      }
    }
  }
  else if (this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.MENUBAR) {
    if (!this.openViews)
      return;
    //
    for (let i = 0; i < this.openViews.length; i++)
      if (this.openViews[i].viewId === view.id) {
        this.openViews.splice(i, 1);
        break;
      }
  }
};


/**
 * Activate item linked to given view id
 * @param {IdfView} view
 */
Client.IdfCommandList.prototype.activateViewOpenItem = function (view)
{
  if (this.parent.hasSideMenu() || this.parent.menuType === Client.IdfWebEntryPoint.menuTypes.TASKBAR) {
    for (let i = 0; i < this.openViewsContainerConf.children.length; i++) {
      let itemConf = this.openViewsContainerConf.children[i];
      //
      // Get item element
      let itemEl = Client.eleMap[itemConf.id];
      //
      // Make item element not active
      itemEl.updateElement({className: this.parent.hasSideMenu() ? "generic-item open-views-item" : "open-views-item-taskbar"});
      //
      // If current item refers to given viewId, make it active
      if (itemConf.viewId === view.id)
        itemEl.updateElement({className: this.parent.hasSideMenu() ? "generic-item open-views-item active" : "open-views-item-taskbar active"});
    }
  }
  //
  if (Client.mainFrame.isIDF)
    this.realizeViewCommandsets(view);
};


Client.IdfCommandList.prototype.realizeViewCommandsets = function (view)
{
  let viewsId = [view.id];
  let subViews = view.getAllSubViews();
  subViews.forEach(v => {
    viewsId.push(v.id);
  });
  //
  for (let i = 0; i < this.elements.length; i++) {
    let ch = this.elements[i];
    if (viewsId.includes("frm:" + ch.form) && ch.conf) {
      if (ch.isToolbar || ch.isMenu) {
        // Form Commandset (toolbar), realize into the view (if not already realized)
        //
        // Only for IDF, in Cloud the commandset/command are children of the Form/Frame so we don't need this path to create them
        // (in IDF we have the commandset before we have the view, so we need to attach/realize them when the form is opened/created)
        // We need to realize if:
        //   - the commandset wasn't realized before
        //   - the commandset was realized before but its element is missing, maybe the view was opend and closed, killing the commandset elements with it
        let toRealize = (!ch.mainObjects?.length);
        if (toRealize && ch.isToolbar && !ch.isMenu) {
          // The commandset if is only toolbar hasn't the mainObjects. we must check if the toolbar container is created
          toRealize = Client.eleMap[ch.toolBox?.id] ? false : true;
        }
        //
        if (toRealize && ch.isToolbar) {
          if (ch.form !== 0 && ch.toolCont === -2) {
            // -2 is a special value of toolCont. It means that the server doesn't have calculated it.
            // In that case the server will resend it to the client with a chg - updateElement after the view is opened.
            // So we will do the realize WHEN that UpdateElement will arrive
            ch.toRealizeToolbar = true;
            toRealize = false;
          }
          //
          if (ch.toolCont > 0) {
            // Check if the frame is already realized in the view, maybe toolCont is a subframe
            let frameFound = view.getFrameByIndex(ch.toolCont);
            if (!frameFound)
              toRealize = false;
          }
        }
        //
        if (toRealize) {
          ch.realize(ch.conf, ch.parent, ch.view);
          ch.realizing = true;
          ch.updateElement(JSON.parse(JSON.stringify(ch.conf)));
          delete ch.realizing;
        }
      }
      //
      if (ch.isPopupMenu()) {
        // THIS IS A FORM/FRAME POPUP MENU
        ch.realize(ch.conf, ch.parent, ch.view);
        ch.updateElement(ch.conf);
        delete ch.conf;
        delete ch.children;
      }
    }
  }
};


/**
 * Closes and removes all the commands of the multiple view
 * @param {String} viewId
 * @param {Boolean} clear - true remove the commands view elements BUT keep the widget, so they can be recreated if the view will be re-opened
 *                          (the server sends the commands of the view only at the start)
 */
Client.IdfCommandList.prototype.closeViewCommandsets = function (viewId, clear)
{
  for (let i = 0; i < this.elements.length; i++) {
    let ch = this.elements[i];
    if (ch && ("frm:" + ch.form) === viewId) {
      if (clear)
        ch.clearElements();
      else {
        ch.close(true);
        this.elements.splice(i--, 1);
      }
    }
  }
};


Client.IdfCommandList.prototype.canResizeW = function (element)
{
  return this.parent.hasSideMenu() && Client.mainFrame.wep.resizableFrames;
};


Client.IdfCommandList.prototype.applyDragDropCursor = function (cursor)
{
  // Apply the resize cursor only on the list header
  let obj = this.getRootObject();
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


Client.IdfCommandList.prototype.onTransform = function (options)
{
  this.parent.updateElement({sideMenuWidth: options.w});
};


/**
 * Handle function keys
 * @param {Object} event
 * @param {Number} formIdx
 * @param {Number} frameIdx
 */
Client.IdfCommandList.prototype.handleFunctionKeys = function (event, formIdx, frameIdx)
{
  let events = [];
  //
  // Passo il messaggio a tutti i cmdset
  for (let i = 0; i < this.elements.length && events.length === 0; i++)
    events.push(...this.elements[i].handleFunctionKeys(event, formIdx, frameIdx));
  //
  return events;
};


/**
 * Handle accelerator keys
 * @param {Object} event
 */
Client.IdfCommandList.prototype.handleAcceleratorKeys = function (event)
{
  let events = [];
  //
  // Controllo ALT + tasto in caso di menu a tendina (anche tasto ESC)
  let code = event.content.keyCode;
  if (!(event.content.altKey || Client.mainFrame.wep.menuBarOpened) || ((code < 48 || code > 90) && code !== 27))
    return events;
  //
  // Acceleratori gestiti solo se menu' TOP
  if (Client.mainFrame.wep.menuType !== Client.IdfWebEntryPoint.menuTypes.MENUBAR)
    return events;
  //
  // Se c'e' la tendina aperta e premo ESC, allora la chiudo
  if (Client.mainFrame.wep.menuBarOpened && code === 27)
  {
    Client.mainFrame.wep.menuBarOpened.closePopup();
    return events;
  }
  //
  // Passo il messaggio a tutti i cmdset
  for (let i = 0; i < this.elements.length && events.length === 0; i++)
    events.push(...this.elements[i].handleAcceleratorKeys(event));
  //
  return events;
};


/**
 * Returns true if there is the main menu:
 * - has commandsets that are menu and not related to views
 */
Client.IdfCommandList.prototype.hasMainMenu = function ()
{
  if (!this.elements || this.elements.length === 0)
    return false;
  //
  let cms = [];
  this.elements.forEach(el => {
    if (el.isMenu && !el.form && el.visible)
      cms.push(el);
  });
  //
  return cms.length > 0;
};


/**
 * Check if the menu bar must be hidden in the mobile layout
 * @param {Boolean} immediate
 */
Client.IdfCommandList.prototype.checkMobileMenu = function (immediate)
{
  if (!Client.mainFrame.idfMobile)
    return;
  //
  if (!immediate) {
    if (!this.checkMenuTimer)
      this.checkMenuTimer = setTimeout(() => this.checkMobileMenu(true), 50);
    //
    return;
  }
  //
  delete this.checkMenuTimer;
  let el = Client.eleMap[this.menuConf.id];
  //
  // Cannot use updateElementClassName because the menu getRootObj returns the navObj but the updatelement sets the classname on the domObj.
  // Client.Widget.updateElementClassName(el, "main-menu-empty", this.hasMainMenu());
  //
  el.navObj.classList.toggle("main-menu-empty", !this.hasMainMenu());
  //
  Client.mainFrame.wep?.activeView?.checkMobileButtons();
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for the entire ionic page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonPage = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  Client.IonHelper.updateCssRules();
  //
  this.navObj = document.createElement("ion-nav");
  if (!Client.mainFrame.device.isMobile)
    this.navObj.className = "has-scrollbar";
  this.domObj = document.createElement("ion-page");
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  this.navObj.appendChild(this.domObj);
  parent.appendChildObject(this, this.navObj);
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);
};

Client.IonPage.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonPage.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null;
  //
  // specific class name
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "show-page";
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * Return the dom root object of this element
 * @returns {DomElement}
 */
Client.IonPage.prototype.getRootObject = function ()
{
  return this.navObj;
};


/**
 * @class A container for the entire ionic page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonHeader = function (element, parent, view)
{
  element.tag = "ion-header";
  Client.Container.call(this, element, parent, view);
  //
  this.updateContentPosition();
};

Client.IonHeader.prototype = new Client.Container();

Client.IonHeader.prototype.insertBefore = function (content)
{
  var o = Client.Container.prototype.insertBefore.call(this, content);
  this.updateContentPosition();
  //
  return o;
};

/**
 * When editing call the positionContent of a IonContent, used when adding content to the Header when the view is already created
 */
Client.IonHeader.prototype.updateContentPosition = function ()
{
  if (this.parent instanceof Client.IonPage && Client.mainFrame.isEditing()) {
    // Check if the parent has already a child that is a Client.IonContent, in that case call
    // the positionContent function
    for (var i = 0; i < this.parent.ne(); i++)
      if (this.parent.elements[i] instanceof Client.IonContent) {
        this.parent.elements[i].positionContent();
        break;
      }
  }
};

/**
 * @class A container for the entire ionic page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonFooter = function (element, parent, view)
{
  element.tag = "ion-footer";
  Client.Container.call(this, element, parent, view);
  //
  this.updateContentPosition();
};

Client.IonFooter.prototype = new Client.Container();

Client.IonFooter.prototype.insertBefore = function (content)
{
  var o = Client.Container.prototype.insertBefore.call(this, content);
  this.updateContentPosition();
  //
  return o;
};

/**
 * When editing call the positionContent of a IonContent, used when adding content to the Header when the view is already created
 */
Client.IonFooter.prototype.updateContentPosition = function ()
{
  if (this.parent instanceof Client.IonPage && Client.mainFrame.isEditing()) {
    // Check if the parent has already a child that is a Client.IonContent, in that case call
    // the positionContent function
    for (var i = 0; i < this.parent.ne(); i++)
      if (this.parent.elements[i] instanceof Client.IonContent) {
        this.parent.elements[i].positionContent();
        break;
      }
  }
};


/**
 * @class A container for the entire ionic page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonContent = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-content");
  //
  this.scrollContent = document.createElement("scroll-content");
  //
  this.positionContent();
  //
  // Scrollbar handling do not use class overflows any more
  // if (!Client.mainFrame.device.isMobile)
  //   this.applyClassOnContentOverflow();
  //
  this.domObj.appendChild(this.scrollContent);
  //
  // During testauto or telecollaboration always send onScroll event
  if (Client.isTestAuto || Client.clientType) {
    element.events = element.events || [];
    element.events.push("onScroll");
  }
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);
};

Client.IonContent.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonContent.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null;
  //
  this.purgeMyProp(el);
  //
  // specific class name
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  // specific class name
  if (el.padding !== undefined) {
    this.domObj.removeAttribute(this.padding);
    this.domObj.setAttribute(el.padding, "");
    this.padding = el.padding;
    delete el.padding;
  }
  //
  // specific class name
  if (el.outer !== undefined) {
    this.outer = el.outer;
    update = true;
    delete el.outer;
  }
  //
  // bounce / nobounce
  if (el.noBounce !== undefined) {
    if (el.noBounce)
      this.domObj.setAttribute("no-bounce", "");
    else
      this.domObj.removeAttribute("no-bounce");
    delete el.noBounce;
  }
  //
  // Move scrolltop (with animation if required)
  if (el.scrollTop !== undefined) {
    this.scrollSetTime = new Date();
    this.scrollWithAnimation(this.scrollContent, el.scrollTop);
    delete el.scrollTop;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "";
    if (this.outer)
      cs += " outer-content";
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonContent.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var idx = events.indexOf("onScroll");
  if (idx >= 0) {
    events.splice(idx, 1);
    //
    this.scrollContent.onscroll = function (ev) {
      if (this.scrollTimerId)
        return;
      if (this.scrollSetTime && new Date() - this.scrollSetTime < 200)
        return;
      //
      this.scrollTimerId = setTimeout(function () {
        delete this.scrollTimerId;
        var e = [];
        e.push({obj: this.id, id: "chgProp", content: {name: "scrollTop", value: this.scrollContent.scrollTop, clid: Client.id}});
        e.push({obj: this.id, id: "onScroll", content: this.saveEvent(ev)});
        Client.mainFrame.sendEvents(e);
      }.bind(this), 200);
    }.bind(this);
    //
  }
  //
  Client.Container.prototype.attachEvents.call(this, events);
};


/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child child element that requested the insertion
 * @param {HTMLElement} domObj child DOM object to add
 */
Client.IonContent.prototype.appendChildObject = function (child, domObj)
{
  this.scrollContent.appendChild(domObj);
};


/**
 */
Client.IonContent.prototype.applyClassOnContentOverflow = function ()
{
  // Select the div
  let div = this.scrollContent;
  //
  // Function to check if the content's height is greater than the div's height
  let checkHeight = function () {
    if (this.parentWidget)
      return;
    //
    div.classList.toggle("overflows", div.scrollHeight > div.clientHeight);
  }.bind(this);
  // Create a MutationObserver to monitor changes in the div's content
  let mutationObserver = new MutationObserver(checkHeight);
  // Configure the observer to monitor changes to the div's content
  mutationObserver.observe(div, {childList: true, subtree: true});
  // Create a ResizeObserver to monitor changes in the div's size
  let resizeObserver = new ResizeObserver(checkHeight);
  // Start observing the div for size changes
  resizeObserver.observe(div);
  //
  this.obsContent = [mutationObserver, resizeObserver];
};


/**
 * Update top margin
 */
Client.IonContent.prototype.positionContent = function (options)
{
  var t = this.parent.domObj.childNodes;
  var toth = 0;
  var totf = 0;
  var ok = true;
  //
  options = options || {};
  var keyboardOpen = Client.IonHelper.scrollLayer !== undefined;
  var obscls = typeof ResizeObserver === "function" ? "ResizeObserver" : "MutationObserver";
  //
  var config;
  if (!this.obs) {
    this.obs = [];
    config = {childList: true, attributes: true};
  }
  //
  for (var i = 0; i < t.length; i++) {
    var b = false;
    if (t[i].tagName === "ION-HEADER") {
      b = true;
      toth += t[i].clientHeight;
      //
      if (t[i].getClientRects && !t[i].getClientRects().length) {
        var cs = window.getComputedStyle(t[i]);
        if (cs.display !== "none")
          ok = false;
      }
    }
    if (t[i].tagName === "ION-FOOTER") {
      b = true;
      //
      // Reset footer top "lock" position when the device is rotated
      // because now we need to reposition the footer. Only if the keyboard is closed
      if (options.resetTop && !keyboardOpen)
        t[i].style.top = "";
      //
      var h = t[i].clientHeight;
      //
      var cs = window.getComputedStyle(t[i]);
      //
      // If the footer is "fixed", we do not take it into account when the keyboard is open,
      // and when it is closed, we fix the top position on android, so when the keyboard is open
      // the footer does not move
      if (cs.position === "fixed") {
        if (keyboardOpen) {
          h = 0;
        }
        else {
          if (h > 0 && Client.mainFrame.device.operatingSystem === "android") {
            t[i].style.top = (t[i].offsetTop + t[i].offsetHeight - h) + "px";
          }
        }
      }
      //
      totf += h;
      //
      if (t[i].getClientRects && !t[i].getClientRects().length) {
        if (cs.display !== "none")
          ok = false;
      }
    }
    if (config && b) {
      var o = new window[obscls](function () {
        if (!this.positionTimerID) {
          this.positionTimerID = setTimeout(function () {
            this.positionContent();
          }.bind(this), 10);
        }
      }.bind(this));
      o.observe(t[i], config);
      this.obs.push(o);
    }
  }
  //
  // Take tabbar into account
  var p = this.parent;
  while (p) {
    if (Client.IonTabs && p instanceof Client.IonTabs && !p.ignoreTabbar) {
      if (p.placement === "top") {
        toth += p.tabbar.clientHeight;
      }
      else {
        // The tabbar is at bottom of page
        //
        // Reset tabbar top "lock" position when the device is rotated
        // because now we need to reposition the tabbar. Only if the keyboard is closed
        if (options.resetTop && !keyboardOpen)
          p.tabbar.style.top = "";
        //
        var h = p.tabbar.clientHeight;
        var cs = window.getComputedStyle(p.tabbar);
        //
        // We do not take a bottom tabbar into account when the keyboard is open,
        // and when it is closed, we fix the top position on android, so when the keyboard is open
        // the tabbar does not move
        if (keyboardOpen) {
          h = 0;
        }
        else {
          if (h > 0 && Client.mainFrame.device.operatingSystem === "android") {
            p.tabbar.style.top = (p.tabbar.offsetTop + p.tabbar.offsetHeight - h) + "px";
          }
        }
        totf += h;
      }
      if (config) {
        var o = new window[obscls](function () {
          if (!this.positionTimerID) {
            this.positionTimerID = setTimeout(function () {
              this.positionContent();
            }.bind(this), 10);
          }
        }.bind(this));
        o.observe(p.tabbar, config);
        this.obs.push(o);
      }
    }
    p = p.parent;
  }
  //
  if (ok) {
    this.scrollContent.style.marginTop = toth + "px";
    this.scrollContent.style.marginBottom = totf + "px";
  }
  delete this.positionTimerID;
};


/**
 * onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.IonContent.prototype.onResize = function (ev)
{
  // Reset footer e tabbar position when the device rotate
  this.positionContent({resetTop: true});
  Client.Element.prototype.onResize.call(this, ev);
};


/**
 * Close the content
 */
Client.IonContent.prototype.close = function ()
{
  Client.Element.prototype.close.call(this);
  //
  if (this.obs) {
    for (var i = 0; i < this.obs.length; i++) {
      this.obs[i].disconnect();
    }
    delete this.obs;
  }
  if (this.obsContent) {
    for (var i = 0; i < this.obsContent.length; i++) {
      this.obsContent[i].disconnect();
    }
    delete this.obsContent;
  }
};


/**
 * @class A container for the navigation bar
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonNavBar = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-navbar");
  //
  this.backButtonText = "<Back";
  this.navBack = document.createElement("div");
  this.navBack.className = "toolbar-background";
  this.domObj.appendChild(this.navBack);
  //
  this.contentObj = document.createElement("div");
  this.contentObj.className = "toolbar-content";
  this.domObj.appendChild(this.contentObj);
  //
  if (element.menuButton === undefined && this.getMenu())
    element.menuButton = true;
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);
  //
  // Reupdate class as we need to be attached to the DOM to see if we need statusbar padding
  this.updateElement();
};

Client.IonNavBar.prototype = new Client.Container();

Client.IonNavBar.needsFullscreenPadding = true;

/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child child element that requested the insertion
 * @param {HTMLElement} domObj child DOM object to add
 */
Client.IonNavBar.prototype.appendChildObject = function (child, domObj)
{
  if (Client.IonButtons && child instanceof Client.IonButtons)
    this.domObj.appendChild(domObj);
  else
    this.contentObj.appendChild(domObj);
};


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonNavBar.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null || !el;
  if (!el)
    el = {};
  //
  // specific class name
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, undefined);
    delete el.color;
  }
  if (el.noBorderBottom !== undefined) {
    if (el.noBorderBottom)
      this.domObj.setAttribute("no-border-bottom", "");
    else
      this.domObj.removeAttribute("no-border-bottom");
    delete el.noBorderBottom;
  }
  if (el.noBorderTop !== undefined) {
    if (el.noBorderTop)
      this.domObj.setAttribute("no-border-top", "");
    else
      this.domObj.removeAttribute("no-border-top");
    delete el.noBorderTop;
  }
  if (el.backButtonText !== undefined) {
    this.backButtonText = el.backButtonText;
    var ico = this.calcBBIcon();
    var txt = this.calcBBText();
    //
    if (this.backButton) {
      var ic = this.backButton.getElementsByTagName("ION-ICON")[0];
      ic.style.display = ico ? "" : "none";
      Client.IonHelper.setIonIcon(ico, ic, "back-button-icon");
    }
    //
    if (this.bbTextObj)
      this.bbTextObj.textContent = txt;
    //
    delete el.backButtonText;
  }
  if (el.backButton !== undefined) {
    if (el.backButton && !this.backButton) {
      this.backButton = document.createElement("button");
      this.backButton.className = "back-button disable-hover bar-button bar-button-default show-back-button" +
              (Client.Ionic.platform === "md" ? " bar-button-icon-only" : "");
      this.backButton.onclick = function (ev) {
        this.onBackButton(ev);
      }.bind(this);
      //
      var ico = this.calcBBIcon();
      var txt = this.calcBBText();
      //
      var sp = document.createElement("span");
      sp.className = "button-inner";
      this.backButton.appendChild(sp);
      var ic = document.createElement("ion-icon");
      ic.style.display = ico ? "" : "none";
      Client.IonHelper.setIonIcon(ico, ic, "back-button-icon");
      sp.appendChild(ic);
      //
      if (Client.Ionic.platform === "ios") {
        this.bbTextObj = document.createElement("span");
        this.bbTextObj.className = "back-button-text";
        this.bbTextObj.textContent = txt;
        sp.appendChild(this.bbTextObj);
      }
      //
      this.domObj.insertBefore(this.backButton, this.contentObj);
      Client.IonHelper.registerClickListener(this, this.backButton);
    }
    if (this.backButton && !el.backButton) {
      this.backButton.remove();
      delete this.backButton;
      delete this.bbTextObj;
    }
  }
  if (el.menuButton !== undefined) {
    if (el.menuButton && !this.menuButton) {
      this.menuButton = document.createElement("button");
      this.menuButton.className = "disable-hover bar-button bar-button-default bar-button-menutoggle bar-button-icon-only";
      this.menuButton.onclick = function (ev) {
        if (this.sendMenuButton) {
          var x = [{obj: this.id, id: "onMenuButton", content: this.saveEvent(ev)}];
          Client.mainFrame.sendEvents(x);
        }
        else {
          var m = this.getMenu();
          if (m)
            m.setVisible(true, true);
        }
      }.bind(this);
      var sp = document.createElement("span");
      sp.className = "button-inner";
      this.menuButton.appendChild(sp);
      var ic = document.createElement("ion-icon");
      Client.IonHelper.setIonIcon(Client.mainFrame.theme.ionIcons === "5" ? "svg_menu" : "menu", ic, "back-button-icon");
      sp.appendChild(ic);
      this.domObj.insertBefore(this.menuButton, this.contentObj);
      Client.IonHelper.registerClickListener(this, this.menuButton);
    }
    if (this.menuButton && !el.menuButton) {
      this.menuButton.remove();
      delete this.menuButton;
    }
  }
  if (el.showTitleContent !== undefined) {
    this.showTitleContent = el.showTitleContent;
    if ((this.showTitleContent === "auto" && Client.mainFrame.device.operatingSystem === "ios") || this.showTitleContent === "enabled") {
      window.setTimeout(this.EnableContentTitleScroll.bind(this), 0);
    }
    delete el.showTitleContent;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "toolbar show-navbar";
    //
    if (Client.IonHelper.needsPadding(this))
      cs += " statusbar-padding";
    //
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * Calculate back button icon based on text
 */
Client.IonNavBar.prototype.calcBBIcon = function ()
{
  var bt = this.backButtonText;
  var res = Client.IonHelper.getIconSet();
  //
  if (Client.mainFrame.theme.ionIcons === "5") {
    res = "svg_";
    var hasIcon = (Client.Ionic.platform === "ios" && bt[0] === "<") || (bt[0] === "x" || bt[0] === "X") && (bt.length === 1 || bt[1] === " ");
    if (hasIcon)
      res += (bt[0] === "<" ? "chevron-back" : "close");
    else if (Client.Ionic.platform === "md")
      res += "chevron-back";
    else
      res = "";
  }
  else {
    // L'icona back è troppo caratteristica, ci vuole quella IOS
    if (Client.Ionic.platform === "ios" && bt[0] === "<")
      res = "ios";
    //
    var hasIcon = (Client.Ionic.platform === "ios" && bt[0] === "<") || (bt[0] === "x" || bt[0] === "X") && (bt.length === 1 || bt[1] === " ");
    if (hasIcon)
      res += (bt[0] === "<" ? "-arrow-back" : "-close");
    else if (Client.Ionic.platform === "md")
      res += "-arrow-back";
    else
      res = "";
  }
  //
  return res;
};


/**
 * Calculate back button text based on text
 */
Client.IonNavBar.prototype.calcBBText = function ()
{
  var bt = this.backButtonText;
  var hasIcon = (Client.Ionic.platform === "ios" && bt[0] === "<") || (bt[0] === "x" || bt[0] === "X") && (bt.length === 1 || bt[1] === " ");
  if (hasIcon)
    bt = bt.substring(1).trim();
  return bt;
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonNavBar.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var idx = events.indexOf("onBackButton");
  if (idx >= 0) {
    events.splice(idx, 1);
    this.sendBackButton = true;
  }
  var idx = events.indexOf("onMenuButton");
  if (idx >= 0) {
    events.splice(idx, 1);
    this.sendMenuButton = true;
  }
  //
  Client.Container.prototype.attachEvents.call(this, events);
};


/**
 * Returns the first IonMenu in this view
 */
Client.IonNavBar.prototype.getMenu = function ()
{
  if (!Client.IonMenu)
    return;
  //
  var m = this.view.getElements(Client.IonMenu);
  if (m && m.length)
    return m[0];
};


/**
 * Send back button
 * @param {Object} ev - event
 */
Client.IonNavBar.prototype.onBackButton = function (ev)
{
  if (this.sendBackButton) {
    var x = [{obj: this.id, id: "onBackButton", content: this.saveEvent(ev)}];
    Client.mainFrame.sendEvents(x);
  }
  else {
    // In case of febe or telecollaboration mode I have two iframes inside the same page.
    // The browser history seems to have some troubles in this scenario because browser
    // doesn't fire popstate event on history back. So I need to fire popstate event manually
    var navController;
    var ok = false;
    try {
      var frames = window.top.document.getElementsByTagName("iframe");
      //
      // If I have more than one iframe and theirs contentWindow location is "preview.html", I'm in febe/telecollaboration mode
      if (frames && frames.length > 1 && frames[0].contentWindow && frames[1].contentWindow &&
              frames[0].contentWindow.location.pathname.indexOf("/app/client/preview.html") !== -1 &&
              frames[1].contentWindow.location.pathname.indexOf("/app/client/preview.html") !== -1) {
        ok = true;
        //
        // Search IonNavController among backButton's parents
        var p = this.parent;
        while (p) {
          if (p instanceof Client.IonNavController) {
            navController = p;
            break;
          }
          p = p.parent;
        }
        //
        // If I didn't find it, get the first IonNavController into eleMap
        if (!navController) {
          var eleKeys = Object.keys(Client.eleMap);
          for (var i = 0; i < eleKeys.length; i++) {
            if (Client.eleMap[eleKeys[i]] instanceof Client.IonNavController) {
              navController = Client.eleMap[eleKeys[i]];
              break;
            }
          }
        }
      }
    }
    catch (ex) {
    }
    //
    // If I have a navController, fire popstate event manually
    if (navController && ok)
      navController.popstateCB(ev);
    else // Otherwise let browser handle history
      window.history.back();
  }
};


/**
 * Enable iOS "title in content" feature
 */
Client.IonNavBar.prototype.EnableContentTitleScroll = function () {
  // Get
  // The IonTitle
  // The IonContent
  var title;
  var content;
  var i;
  //
  for (i = 0; i < this.elements.length; i++) {
    if (this.elements[i] instanceof Client.IonTitle) {
      title = this.elements[i];
      break;
    }
  }
  //
  var page = this.parent ? this.parent.parent : null;
  if (page) {
    for (i = 0; i < page.elements.length; i++) {
      if (page.elements[i] instanceof Client.IonContent) {
        content = page.elements[i];
        break;
      }
    }
  }
  if (!content || !title)
    return;
  //
  var header = this.parent;
  var toolbar;
  if (header) {
    for (i = 0; i < header.elements.length; i++) {
      if (header.elements[i] instanceof Client.IonToolbar) {
        toolbar = header.elements[i];
        break;
      }
    }
  }
  //
  // Now i can
  // - create the fake title in the ionContent
  // - add the scroll functions
  // - add the class to hide the title text
  var ionLargeTitle = title.innerTitle.cloneNode(true);
  ionLargeTitle.classList.add("toolbar-title-large");
  title.innerTitle.classList.add("toolbar-title-hidden");
  title.largeTitle = ionLargeTitle;
  //
  if (content.scrollContent.firstChild)
    content.scrollContent.insertBefore(ionLargeTitle, content.scrollContent.firstChild);
  else
    content.scrollContent.appendChild(ionLargeTitle);
  //
  if (toolbar) {
    content.scrollContent.insertBefore(toolbar.domObj, ionLargeTitle.nextSibling);
    this.domObj.removeAttribute("no-border-bottom");
  }
  //
  content.scrollContent.addEventListener("scroll", function () {
    title.innerTitle.classList.toggle("toolbar-title-hidden", (this.scrollTop < ionLargeTitle.offsetHeight));
  });
};


/**
 * @class A container for a navigation controller
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonNavController = function (element, parent, view)
{
  window.addEventListener("popstate", function (ev) {
    this.popstateCB(ev);
  }.bind(this));
  //
  Client.mainFrame.edgeGesture = function (side)
  {
    if (!Client.IonHelper.hasPopup()) {
      var x = [{obj: this.id, id: "onEdgeSwipe", content: {side: side}}];
      Client.mainFrame.sendEvents(x);
    }
  }.bind(this);
  //
  Client.AltContainer.call(this, element, parent, view);
};

Client.IonNavController.prototype = new Client.AltContainer();


/**
 * Animates a change page transition
 * @param {int} oldSelectedPage - old page
 * @param {Object} animation - the animation to play
 */
Client.IonNavController.prototype.animateChangePage = function (oldSelectedPage, animation)
{
  // Prevent Click during Animation
  var anim = animation ? animation : this.changePageAnimation;
  var duration = anim.duration !== undefined ? anim.duration : 250;
  Client.mainFrame.preventClick(duration);
  //
  Client.AltContainer.prototype.animateChangePage.call(this, oldSelectedPage, animation);
};


/**
 * Handle popstate event
 * @param {Object} ev
 */
Client.IonNavController.prototype.popstateCB = function (ev)
{
  // Check if there are open popups, such as:
  // select, datetime, popups
  var appui = document.getElementById("app-ui");
  var li = appui.getElementsByTagName("ION-PICKER-CMP");
  if (li.length === 0)
    li = appui.getElementsByTagName("ION-ALERT");
  if (li.length === 0)
    li = appui.getElementsByTagName("ION-ACTION-SHEET");
  if (li.length === 0) {
    li = [];
    var li2 = appui.getElementsByTagName("ION-POPOVER");
    for (var i = 0; i < li2.length; i++) {
      if (li2[i].classList.contains("ion-menu"))
        li.push(li2[i]);
    }
    li2 = undefined;
  }
  if (li.length > 0) {
    var obj = li[li.length - 1];
    var bd = obj.getElementsByTagName("ION-BACKDROP");
    if (bd.length) {
      bd[bd.length - 1].click();
    }
    window.history.pushState({}, "");
  }
  else {
    //
    // check if the current page wants the back button
    var ok = true;
    //
    // Select the front modal page or the current page inside me
    var el = this.elements ? this.elements[this.selectedPage] : undefined;
    var li = appui.getElementsByTagName("ION-MODAL");
    var li2 = appui.getElementsByTagName("ION-POPOVER");
    //
    var lia = [];
    //
    // Purge elements that are not actually modal dialogs
    for (var i = 0; i < li.length; i++) {
      var obj = Client.eleMap[li[i].id];
      if (obj && obj instanceof Client.IonModal) {
        lia.push(li[i]);
      }
    }
    for (var i = 0; i < li2.length; i++) {
      var obj = Client.eleMap[li2[i].id];
      if (obj && obj instanceof Client.IonModal) {
        lia.push(li2[i]);
      }
    }
    //
    if (lia.length > 0) {
      var obj = lia[lia.length - 1];
      li = obj.getElementsByTagName("ION-PAGE");
      if (li.length > 0) {
        var page = Client.eleMap[li[0].id];
        if (page)
          el = page;
      }
    }
    //
    if (el) {
      var nbs = el.getElements(Client.IonNavBar);
      if (nbs && nbs.length) {
        var nb = nbs[0];
        if (nb.sendBackButton) {
          nb.onBackButton(ev);
          ok = false;
        }
      }
    }
    if (ok) {
      var x = [{obj: this.id, id: "onBack", content: this.saveEvent(ev)}];
      Client.mainFrame.sendEvents(x);
    }
    else {
      window.history.pushState({}, "");
    }
  }
};


/**
 * @class A container for the navigation bar
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonToolbar = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-toolbar");
  //
  this.toolBack = document.createElement("div");
  this.toolBack.className = "toolbar-background";
  this.domObj.appendChild(this.toolBack);
  //
  this.contentObj = document.createElement("div");
  this.contentObj.className = "toolbar-content";
  this.domObj.appendChild(this.contentObj);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);

};

Client.IonToolbar.prototype = new Client.Container();

Client.IonToolbar.needsFullscreenPadding = true;

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonToolbar.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null;
  //
  // specific class name
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, undefined);
    delete el.color;
  }
  if (el.noBorderBottom !== undefined) {
    if (el.noBorderBottom)
      this.domObj.setAttribute("no-border-bottom", "");
    else
      this.domObj.removeAttribute("no-border-bottom");
    delete el.noBorderBottom;
  }
  if (el.noBorderTop !== undefined) {
    if (el.noBorderTop)
      this.domObj.setAttribute("no-border-top", "");
    else
      this.domObj.removeAttribute("no-border-top");
    delete el.noBorderTop;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "toolbar";
    //
    if (Client.IonHelper.needsPadding(this))
      cs += " statusbar-padding";
    //
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child child element that requested the insertion
 * @param {HTMLElement} domObj child DOM object to add
 */
Client.IonToolbar.prototype.appendChildObject = function (child, domObj)
{
  if (Client.IonButtons && child instanceof Client.IonButtons)
    this.domObj.appendChild(domObj);
  else
    this.contentObj.appendChild(domObj);
};


/**
 * @class A container for the ionic grid
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonGrid = function (element, parent, view)
{
  element.tag = "ion-grid";
  Client.Container.call(this, element, parent, view);
};

Client.IonGrid.prototype = new Client.Container();

Client.IonGrid.needsFullscreenPadding = true;

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonGrid.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var idx = events.indexOf("onNavigation");
  if (idx >= 0) {
    events.splice(idx, 1);
    this.sendNavigation = true;
  }
  //
  Client.Container.prototype.attachEvents.call(this, events);
};


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonGrid.prototype.updateElement = function (el)
{
  // Force update for the first time
  var update = this.domObj.parentNode === null;
  //
  if (el.fixed !== undefined) {
    if (el.fixed)
      this.domObj.setAttribute("fixed", "");
    else
      this.domObj.removeAttribute("fixed");
    delete el.fixed;
  }
  //
  if (el.noPadding !== undefined) {
    if (el.noPadding)
      this.domObj.setAttribute("no-padding", "");
    else
      this.domObj.removeAttribute("no-padding");
    delete el.noPadding;
  }
  //
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  if (el.navigation !== undefined) {
    this.enableNavigation(el.navigation);
    delete el.navigation;
  }
  //
  if (update) {
    //
    var cs = "grid";
    //
    if (this.className)
      cs += " " + this.className;
    //
    this.setClassName(cs);
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
};


/**
 * Enable keyboard navigation for this grid
 * @param {bool} status
 */
Client.IonGrid.prototype.enableNavigation = function (status)
{
  this.navigation = status;
  if (status) {
    if (!this.navkd) {
      this.navkd = function (ev) {
        if (ev.defaultPrevented)
          return;
        //
        // Get target element
        var domObj = ev.target;
        var el = undefined;
        var col = undefined;
        var row = undefined;
        while (domObj && !el) {
          if (domObj.id)
            el = Client.eleMap[domObj.id];
          domObj = domObj.parentNode;
        }
        col = el;
        while (col && !(col instanceof Client.IonCol)) {
          col = col.parent;
        }
        row = col;
        while (row && !(row instanceof Client.IonRow)) {
          row = row.parent;
        }
        if (!el || !col || !row)
          return;
        //
        var from = col;
        //
        // Get cursor current position
        var hasSelection = ev.target.selectionStart !== ev.target.selectionEnd;
        var curPos = hasSelection ? -1 : ev.target.selectionStart;
        var atStart = ev.target.value !== undefined ? curPos === 0 : true;
        var atEnd = ev.target.value !== undefined ? curPos === ev.target.value.length : true;
        //
        // Disable atStart / atEnd because of input type selection restriction
        if (ev.target.value !== undefined) {
          atStart = false;
          atEnd = false;
        }
        if (!Client.Utils.isNodeEditable(ev.target)) {
          atStart = true;
          atEnd = true;
        }
        //
        // Calc header rows
        var hdrRows = 0;
        if (typeof this.navigation === "number") {
          hdrRows = this.navigation;
        }
        //
        // Search for hidden rows
        while (hdrRows < this.elements.length) {
          let r = this.elements[hdrRows];
          if (r.domObj.clientHeight > 0)
            break;
          hdrRows++;
        }
        //
        var navigate = false;
        var next = false;
        var prev = false;
        var up = false;
        var down = false;
        var edit = false;
        var abort = false;
        //
        // ESC
        if (ev.key === "Escape") {
          // exit edit mode if data is not modified or ask user if it is
          abort = true;
          navigate = true;
        }
        //
        // SPACE
        if (ev.key === " ") {
          // Controllo di non essere su un controllo editabile, in tal caso lo spazio deve passare
          var editing = (Client.Utils.isNodeEditable(ev.target) && !ev.target.disabled && !ev.target.readOnly);
          if (!editing) {
            navigate = true;
            edit = true;
          }
        }
        //
        // TAB / SHIFT+TAB
        if (ev.key === "Tab" && !ev.ctrlKey && !ev.metaKey) {
          navigate = true;
          next = !ev.shiftKey;
          prev = !!ev.shiftKey;
          //
          // If cursor is in an input element, we check if another input is in the same cell
          if (Client.Utils.isNodeEditable(ev.target)) {
            let s = next ? ev.target.nextSibling : ev.target.previousSibling;
            if (Client.Utils.isNodeEditable(s) && s.style.display !== "none")
              navigate = false;
          }
        }
        //
        if (!ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
          // ENTER (no textarea)
          if (ev.key === "Enter" && ev.target.tagName !== "TEXTAREA") {
            navigate = true;
            next = true;
          }
          // LEFT OR UP (when cursor is at the beginning of the text)
          if ((atStart && ev.key === "ArrowLeft") || (ev.key === "ArrowUp" && ev.target.tagName !== "TEXTAREA")) {
            navigate = true;
            prev = ev.key === "ArrowLeft";
            up = !prev;
          }
          // DOWN OR RIGHT (when cursor is at the end of the text)
          if ((atEnd && ev.key === "ArrowRight") || (ev.key === "ArrowDown" && ev.target.tagName !== "TEXTAREA")) {
            navigate = true;
            next = ev.key === "ArrowRight";
            down = !next;
          }
          //
          // navigation is disabled if a combo is open
          var comboOpen = el.comboObj && el.comboObj.style.display !== "none" && el.listObj && el.listObj.style.opacity === "1";
          if (comboOpen) {
            navigate = false;
            abort = false;
            if (ev.key === "Tab") {
              navigate = true;
            }
          }
        }
        //
        if (navigate) {
          //
          // search next ioncol (cell) to focus
          var dir = edit ? "edit" : "";
          dir = dir || (abort ? "abort" : "");
          var orgDown = down;
          var orgUp = up;
          //
          for (let cnt = 0; cnt < 1000 && !edit; cnt++) {
            var colIdx = row.elements.indexOf(col);
            var rowIdx = this.elements.indexOf(row);
            //
            down = orgDown;
            up = orgUp;
            //
            var lastCol = col;
            var lastRow = row;
            //
            if (next) {
              dir = dir || "next";
              if (colIdx === row.elements.length - 1) {
                down = true;
                colIdx = 0;
              }
              else {
                col = row.elements[colIdx + 1];
              }
            }
            if (prev) {
              dir = dir || "prev";
              if (colIdx === 0) {
                up = true;
                colIdx = row.elements.length - 1;
              }
              else {
                col = row.elements[colIdx - 1];
              }
            }
            if (down) {
              dir = dir || "down";
              if (rowIdx < this.elements.length - 1) {
                row = this.elements[rowIdx + 1];
                // jump over row without col
                if (!row.elements)
                  row = this.elements[rowIdx + 2];
                col = row.elements[colIdx];
              }
            }
            if (up) {
              dir = dir || "up";
              if (rowIdx > hdrRows) {
                row = this.elements[rowIdx - 1];
                // jump over row without col
                if (!row.elements)
                  row = this.elements[rowIdx - 2];
                col = row.elements[colIdx];
              }
            }
            //
            // If col is visible exit, else remain here
            if (col.domObj.clientWidth > 0) {
              break;
            }
            //
            // Already on boundaries?
            if (lastRow === row && lastCol === col) {
              break;
            }
          }
          //
          ev.preventDefault();
          ev.stopPropagation();
          this._eatNextKey = true;
          //
          col.focus();
          //
          if (this.sendNavigation) {
            var ee = [{obj: this.id, id: "onNavigation", content: {from: from.domObj.id, to: col.domObj.id, dir: dir}}];
            Client.mainFrame.sendEvents(ee);
          }
          //
          return false;
        }
      }.bind(this);
      //
      this.navku = function (ev) {
        if (this._eatNextKey) {
          this._eatNextKey = false;
          ev.preventDefault();
          ev.stopPropagation();
          return false;
        }
      }.bind(this);
      //
      this.domObj.addEventListener("keydown", this.navkd, true);
      this.domObj.addEventListener("keyup", this.navku, true);
      var c = this.getElements(Client.IonCol);
      for (var i = 0; i < c.length; i++) {
        c[i].domObj.setAttribute("tabindex", "0");
      }
    }
  }
  else {
    if (this.navkd) {
      this.domObj.removeEventListener("keydown", this.navkd, true);
      this.domObj.removeEventListener("keyup", this.navku, true);
      this.navkd = undefined;
      this.navku = undefined;
      var c = this.getElements(Client.IonCol);
      for (var i = 0; i < c.length; i++) {
        c[i].domObj.removeAttribute("tabindex");
      }
    }
  }
};


/**
 * @class A container for the ionic grid
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonRow = function (element, parent, view)
{
  element.tag = "ion-row";
  Client.Container.call(this, element, parent, view);
};

Client.IonRow.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonRow.prototype.updateElement = function (el)
{
  // Force update for the first time
  var update = this.domObj.parentNode === null;
  //
  if (el.verticalAlign !== undefined) {
    if (this.verticalAlign)
      this.domObj.removeAttribute(this.verticalAlign);
    if (el.verticalAlign)
      this.domObj.setAttribute(el.verticalAlign, "");
    this.verticalAlign = el.verticalAlign;
    delete el.verticalAlign;
  }
  if (el.noWrap !== undefined) {
    if (el.noWrap)
      this.domObj.setAttribute("nowrap", "");
    else
      this.domObj.removeAttribute("nowrap");
    delete el.noWrap;
  }
  if (el.wrapReverse !== undefined) {
    if (el.wrapReverse)
      this.domObj.setAttribute("wrap-reverse", "");
    else
      this.domObj.removeAttribute("wrap-reverse");
    delete el.wrapReverse;
  }
  if (el.alignItems !== undefined) {
    this.domObj.removeAttribute("align-items-" + this.alignItems);
    if (el.alignItems)
      this.domObj.setAttribute("align-items-" + el.alignItems, "");
    this.alignItems = el.alignItems;
    delete el.alignItems;
  }
  if (el.justifyContent !== undefined) {
    this.domObj.removeAttribute("justify-content-" + this.justifyContent);
    if (el.justifyContent)
      this.domObj.setAttribute("justify-content-" + el.justifyContent, "");
    this.justifyContent = el.justifyContent;
    delete el.justifyContent;
  }
  //
  // specific class name for this layout
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  if (update) {
    //
    var cs = "row";
    //
    if (this.className)
      cs += " " + this.className;
    //
    this.setClassName(cs);
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
};



/**
 * @class A container for the ionic grid
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonCol = function (element, parent, view)
{
  element.tag = "ion-col";
  Client.Container.call(this, element, parent, view);
};

Client.IonCol.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonCol.prototype.updateElement = function (el)
{
  // Force update for the first time
  var update = this.domObj.parentNode === null;
  //
  if (el.alignSelf !== undefined) {
    this.domObj.removeAttribute("align-self-" + this.alignSelf);
    if (el.alignSelf)
      this.domObj.setAttribute("align-self-" + el.alignSelf, "");
    this.alignSelf = el.alignSelf;
    delete el.alignSelf;
  }
  //
  // width/offset
  if (el.xs !== undefined) {
    this.updateCol("col", this.xs, false);
    this.xs = el.xs;
    this.updateCol("col", this.xs, true);
    delete el.xs;
  }
  if (el.sm !== undefined) {
    this.updateCol("col-sm", this.sm, false);
    this.sm = el.sm;
    this.updateCol("col-sm", this.sm, true);
    delete el.sm;
  }
  if (el.md !== undefined) {
    this.updateCol("col-md", this.md, false);
    this.md = el.md;
    this.updateCol("col-md", this.md, true);
    delete el.md;
  }
  if (el.lg !== undefined) {
    this.updateCol("col-lg", this.lg, false);
    this.lg = el.lg;
    this.updateCol("col-lg", this.lg, true);
    delete el.lg;
  }
  if (el.xl !== undefined) {
    this.updateCol("col-xl", this.xl, false);
    this.xl = el.xl;
    this.updateCol("col-xl", this.xl, true);
    delete el.xl;
  }
  if (el.offsetXs !== undefined) {
    this.updateCol("offset", this.offsetXs, false);
    this.offsetXs = el.offsetXs;
    this.updateCol("offset", this.offsetXs, true);
    delete el.offsetXs;
  }
  if (el.offsetSm !== undefined) {
    this.updateCol("offset-sm", this.offsetSm, false);
    this.offsetSm = el.offsetSm;
    this.updateCol("offset-sm", this.offsetSm, true);
    delete el.offsetSm;
  }
  if (el.offsetMd !== undefined) {
    this.updateCol("offset-md", this.offsetMd, false);
    this.offsetMd = el.offsetMd;
    this.updateCol("offset-md", this.offsetMd, true);
    delete el.offsetMd;
  }
  if (el.offsetLg !== undefined) {
    this.updateCol("offset-lg", this.offsetLg, false);
    this.offsetLg = el.offsetLg;
    this.updateCol("offset-lg", this.offsetLg, true);
    delete el.offsetLg;
  }
  if (el.offsetXl !== undefined) {
    this.updateCol("offset-xl", this.offsetXl, false);
    this.offsetXl = el.offsetXl;
    this.updateCol("offset-xl", this.offsetXl, true);
    delete el.offsetXl;
  }
  //
  // specific class name for this layout
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  if (update) {
    //
    var cs = "col";
    //
    if (this.className)
      cs += " " + this.className;
    //
    this.setClassName(cs);
    //
    // if this col is inside an navigation-enabled iongrid, set tabindex
    var p = this.parent;
    while (p && !(p instanceof Client.IonGrid)) {
      p = p.parent;
    }
    if (p && p.navigation)
      this.domObj.setAttribute("tabindex", "0");
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
};


/**
 * Update element properties
 * @param {String} prefix
 * @param {String} value
 * @param {Bool} flset
 */
Client.IonCol.prototype.updateCol = function (prefix, value, flset)
{
  var v = prefix + (value === "fluid" ? "" : "-" + value);
  if (flset)
    this.domObj.setAttribute(v, "");
  else
    this.domObj.removeAttribute(v);
};

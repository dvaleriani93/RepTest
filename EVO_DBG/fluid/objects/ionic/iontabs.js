/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for a tab bar
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonTabs = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-tabs");
  //
  this.tabbar = document.createElement("ion-tabbar");
  this.tabbar.className = "show-tabbar";
  //
  // iOS needs a kick to show the tabbar
  setTimeout(function () {
    var d = document.createElement("div");
    this.tabbar.appendChild(d);
    setTimeout(function () {
      d.remove();
    }, 0);
  }.bind(this), 500);
  this.domObj.appendChild(this.tabbar);
  //
  this.tabhl = document.createElement("tab-highlight");
  this.tabbar.appendChild(this.tabhl);
  //
  var sp = element.selectedPage || 0;
  if (!element.placement)
    element.placement = Client.Ionic.platform === "ios" ? "bottom" : "top";
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  this.createChildren(element);
  //
  if (sp !== undefined)
    this.selectPage(sp);
};

Client.IonTabs.prototype = new Client.Container();

Client.IonTabs.needsFullscreenPadding = true;

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonTabs.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  var update = this.domObj.parentNode === null;
  //
  // specific class name
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  if (el.placement !== undefined) {
    this.placement = el.placement;
    if (el.placement)
      this.domObj.setAttribute("tabsPlacement", el.placement);
    else
      this.domObj.removeAttribute("tabsPlacement");
    delete el.placement;
  }
  if (el.layout !== undefined) {
    this.layout = el.layout;
    if (el.layout)
      this.domObj.setAttribute("tabsLayout", el.layout);
    else
      this.domObj.removeAttribute("tabsLayout");
    for (var i = 0; i < this.ne(); i++) {
      var e = this.elements[i];
      if (e.updateLinkClass)
        e.updateLinkClass();
    }
    delete el.layout;
  }
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, "");
    delete el.color;
  }
  if (el.selectedPage !== undefined) {
    this.selectPage(el.selectedPage);
    delete el.selectedPage;
  }
  if (el.ignoreTabbar !== undefined) {
    this.ignoreTabbar = el.ignoreTabbar;
    delete el.ignoreTabbar;
  }
  Client.Element.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "tabs-basic";
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
Client.IonTabs.prototype.appendChildObject = function (child, domObj)
{
  if (child instanceof Client.IonTab) {
    var a = child.linkObj = document.createElement("a");
    a.setAttribute("for", child.id);
    a.style.display = child.visible !== false ? "" : "none";
    a.addEventListener("click", function (ev) {
      this.selectPage(child);
      child.sendClick(ev);
      this.sendPage(ev);
    }.bind(this));
    Client.IonHelper.registerClickListener(child, a);
    //
    var s = child.titleObj = document.createElement("span");
    s.className = "tab-button-text";
    s.textContent = child.title;
    a.appendChild(s);
    //
    var i = child.iconObj = document.createElement("ion-icon");
    Client.IonHelper.setIonIcon(child.icon, i, "tab-button-icon");
    if (this.layout === "iconBottom" || this.layout === "iconRight")
      a.appendChild(i);
    else
      a.insertBefore(i, s);
    //
    var b = child.badgeObj = document.createElement("ion-badge");
    b.className = "tab-badge badge-" + (child.badgecolor || "danger");
    if (child.badge)
      b.textContent = child.badge;
    a.appendChild(b);
    //
    this.tabbar.appendChild(a);
    //
    child.updateLinkClass();
  }
  //
  Client.Element.prototype.appendChildObject.call(this, child, domObj);
};


/**
 * Insert a child tab before another tab
 * @param {Object} content - contains the element to insert and the id of the existing element. The new element is inserted before this element
 */
Client.IonTabs.prototype.insertBefore = function (content)
{
  // let's see if we can handle requirements
  if (!Client.mainFrame.loadClientRequirements(content.child))
    return;
  //
  var newEl = Client.Element.prototype.insertBefore.call(this, content);
  //
  if (newEl instanceof Client.IonTab && content.sib && newEl.linkObj) {
    // Move the tab link before the sibling tab link
    for (i = 0; i < this.ne(); i++) {
      var el = this.elements[i];
      if (el.id === content.sib) {
        newEl.linkObj.parentNode.insertBefore(newEl.linkObj, el.linkObj);
      }
    }
  }
}


/**
 * select a different page
 * @param {Object} page - page index
 */
Client.IonTabs.prototype.selectPage = function (page)
{
  this.oldSelectedPage = this.selectedPage;
  this.selectedPage = undefined;
  //
  var pageEmpty = true;
  var allEmpty = true;
  var c = 0;
  for (var i = 0; i < this.ne(); i++) {
    var e = this.elements[i];
    if (e instanceof Client.IonTab) {
      if (e.ne())
        allEmpty = false;
      if (c === page || e === page) {
        if (e.ne())
          pageEmpty = false;
      }
      c++;
    }
  }
  //
  if (this.changePageAnimation && !pageEmpty && !allEmpty && this.oldSelectedPage !== undefined) {
    // In this case we can use the animation to change the page
    // First: we must get the pages (search only IonTab)
    c = 0;
    var oldPage, newPage;
    for (var i = 0; i < this.ne(); i++) {
      var e = this.elements[i];
      if (e instanceof Client.IonTab) {
        if ((c === page || e === page)) {
          this.selectedPage = c;
          newPage = e;
        }
        if ((c === this.oldSelectedPage || e === this.oldSelectedPage))
          oldPage = e;
        c++;
      }
    }
    //
    if (oldPage && newPage && oldPage !== newPage)
      this.animateChangePage(oldPage, newPage);
  }
  else {
    c = 0;
    for (var i = 0; i < this.ne(); i++) {
      var e = this.elements[i];
      if (e instanceof Client.IonTab) {
        e.selected = (c === page || e === page);
        //
        if (!pageEmpty || allEmpty)
          e.updateElement({icon: "*"});
        //
        if (e.selected) {
          this.selectedPage = c;
          this.tabhl.style.transform = "translate3d(" + e.linkObj.offsetLeft + "px,0,0) scaleX(" + e.linkObj.clientWidth + ")";
          this.tabhl.className = "animate";
          //
          if (this.placement === "top")
            this.setTabbarMarginTop(e);
          //
          // Send the skipped resize event
          if (this.lastResizeEvent)
            e.onResize(this.lastResizeEvent);
        }
        //
        c++;
      }
    }
  }
};

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonTabs.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onChangePage");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendChange = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};

/**
 * Attach events handler
 * @param {object} ev
 */
Client.IonTabs.prototype.sendPage = function (ev)
{
  var x = [{obj: this.id, id: "chgProp", content: {name: "selectedPage", value: this.selectedPage, clid: Client.id}}];
  if (this.sendChange)
    x.push({obj: this.id, id: "onChangePage", content: {oldPage: this.oldSelectedPage, newPage: this.selectedPage}});
  Client.mainFrame.sendEvents(x);
};


/**
 * Adds an animation with a change trigger
 * @param {Object} animation - animation definition object
 */
Client.IonTabs.prototype.addChangeTrigger = function (animation)
{
  // Memorize that the changePage must use the animation
  if (!this.changePageAnimation)
    this.changePageAnimation = animation;
};


/**
 * Animates a change page transition
 * @param {Client.IonTab} oldPage - the current page
 * @param {Client.IonTab} newPage - the new page to go
 */
Client.IonTabs.prototype.animateChangePage = function (oldPage, newPage)
{
  var duration = this.changePageAnimation.duration !== undefined ? this.changePageAnimation.duration : 250;
  var easing = this.changePageAnimation.easing !== undefined ? this.changePageAnimation.easing : "easeTo";
  //
  // Remove the focused element if is contained in an animating page
  if (document.activeElement && (Client.Utils.isMyParent(document.activeElement, oldPage.id) || Client.Utils.isMyParent(document.activeElement, newPage.id)))
    document.activeElement.blur();
  //
  // Detect direction of entering/exiting
  var enterDirection = this.selectedPage > this.oldSelectedPage ? "right" : "left";
  var exitDirection = this.selectedPage > this.oldSelectedPage ? "left" : "right";
  //
  // Check if there is another pageAnimation running, in that case stop that..
  // Stop with true sets the animation in the final status and calls the callback, so the pages are in the correct status
  if (this.exitingPage)
    this.exitingPage.stopAnimation(true);
  if (this.enteringPage)
    this.enteringPage.stopAnimation(true);
  //
  // Create the animation for the oldPage (exiting)
  var from = {};
  var to = {};
  from["style_transform"] = "translate3d(0px, 0px, 0px)";
  to["style_transform"] = "translate3d(" + (exitDirection === "right" ? "100%" : "-100%") + ", 0px, 0px)";
  var exitAnim = {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing}]};
  //
  // Create the animation for the newPage (entering)
  from = {};
  to = {};
  var starting = {};
  from["style_transform"] = "translate3d(" + (enterDirection === "right" ? "100%" : "-100%") + ", 0px, 0px)";
  to["style_transform"] = "translate3d(0px, 0px, 0px)";
  starting["style_transform"] = from["style_transform"];
  var enterAnim = {repetitions: 1, startingState: starting, segments: [{from: from, to: to, duration: duration, easing: easing}]};
  //
  // Set the callback of an animation to be called, in that callback we set the final status setting the visibility of the elements
  enterAnim.endcallback = function () {
    this.onEndChangePageAnimation();
  }.bind(this);
  //
  // Show the new page (only set the display, it will be hidden because it has 'translateY(-200%)' in the CSS)
  // is temporary, it will be updated at the end of the animation in the callback
  newPage.domObj.style.display = "";
  //
  // Call and play the animation
  this.exitingPage = oldPage;
  this.enteringPage = newPage;
  this.exitingPage.playAnimation(exitAnim);
  this.enteringPage.playAnimation(enterAnim);
};


/*
 * Callback called when an animation of change page is finished
 */
Client.IonTabs.prototype.onEndChangePageAnimation = function ()
{
  // Clear the transient animation and the pointers
  if (this.exitingPage) {
    this.exitingPage.domObj.style.transform = "";
    delete this.exitingPage;
  }
  if (this.enteringPage) {
    this.enteringPage.domObj.style.transform = "";
    delete this.enteringPage;
  }
  //
  // Now we must reset all the objects
  var c = 0;
  for (var i = 0; i < this.ne(); i++) {
    var e = this.elements[i];
    if (e instanceof Client.IonTab) {
      e.selected = (c === this.selectedPage);
      //
      // After the animation the display property is already set to "", but the system uses its value to decide if notify the changedVisibility
      // so we set that to none to trigger the event
      if (e.selected)
        e.domObj.style.display = "none";
      e.updateElement({icon: "*"});
      //
      if (e.selected) {
        this.tabhl.style.transform = "translate3d(" + e.linkObj.offsetLeft + "px,0,0) scaleX(" + e.linkObj.clientWidth + ")";
        this.tabhl.className = "animate";
        //
        if (this.placement === "top")
          this.setTabbarMarginTop(e);
        //
        // Send the skipped resize event
        if (this.lastResizeEvent)
          e.onResize(this.lastResizeEvent);
      }
      //
      c++;
    }
  }
  //
  // Send the event to the server
  this.sendPage();
  this.onEndAnimation(0, true, false, this.changePageAnimation.id);
};


/**
 * Add to this element an animation definition
 * @param {Array} animationsList - array of animations
 */
Client.IonTabs.prototype.attachAnimations = function (animationsList)
{
  // Call the base class
  Client.Container.prototype.attachAnimations.call(this, animationsList);
  //
  // Now search if there is a 'specific' animation for this object
  for (var i = 0; i < this.animations.length; i++) {
    var def = this.animations[i];
    if (def.trigger === "swipe") {
      // Memorize the animation, the triggers will be attached by default
      if (!this.swipePageAnimation)
        this.swipePageAnimation = def;
      //
      Client.IonHelper.registerPointerEvents(this.domObj, undefined, this, false, "pm");
    }
  }
};


/**
 * touchstart, mousedown event listener
 * @param {event} ev
 */
Client.IonTabs.prototype.pointerStart = function (ev)
{
  this.startY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  this.startX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  this.startTime = new Date();
  this.swiping = false;
  //
  return true;
};


/**
 * touchmove, mousemove event listener
 * @param {event} ev
 */
Client.IonTabs.prototype.pointerMove = function (ev)
{
  if (this.startY === undefined || !this.swipePageAnimation)
    return;
  //
  //  Check the list scroll + swipe
  if (!this.swiping && Client.mainFrame.isClickPrevented()) {
    // Do nothing, another one is handling swipe..
    delete this.startX;
    delete this.startY;
    return;
  }
  //
  var currentY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  var currentX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  var dy = Math.abs(currentY - this.startY);
  var dx = this.startX - currentX;
  //
  if (!this.swiping) {
    // Detect if we must start the swipe experience
    if (dy > Math.abs(dx) && dy > 10) {
      // Moved y during the starting phase, do nothing
      delete this.startX;
      delete this.startY;
    }
    else if (dx > 10 && this.canSwipe("left")) {
      this.swiping = true;
      this.swipingSide = "left";
    }
    else if (dx < -10 && this.canSwipe("right")) {
      this.swiping = true;
      this.swipingSide = "right";
    }
    //
    if (this.swiping) {
      // I have the control now, no click and no scroll
      Client.mainFrame.preventClick();
      ev.preventDefault();
      //
      this.startX = currentX;
      //
      // now i must prepare the swipe selecting the new page and positionig/showing it at the side chosen
      var newPage = this.elements[(this.swipingSide === "left" ? this.selectedPage + 1 : this.selectedPage - 1)];
      newPage.domObj.style.transform = "translate3d(" + (this.swipingSide === "left" ? "" : "-") + this.domObj.offsetWidth + "px, 0px, 0px)";
      newPage.domObj.style.display = "";
      newPage.domObj.className = "";
      this.elements[this.selectedPage].domObj.className = "";
      //
      // Memorize the pages
      this.swipingPageEntering = newPage;
      this.swipingPageExiting = this.elements[this.selectedPage];
    }
  }
  else {
    // No scroll, i've the control now
    ev.preventDefault();
    //
    var mx = this.startX - currentX;
    if (mx > 0 && this.swipingSide === "right")
      mx = mx / 3;
    if (mx < 0 && this.swipingSide === "left")
      mx = mx / 3;
    //
    this.tx = mx;
    //
    // Move the pages
    this.swipingPageEntering.domObj.style.transform = "translate3d(" + ((this.swipingSide === "left" ? this.domObj.offsetWidth : -this.domObj.offsetWidth) - this.tx) + "px, 0px, 0px)";
    this.swipingPageExiting.domObj.style.transform = "translate3d(" + (-this.tx) + "px, 0px, 0px)";
  }
  //
  this.lastX = currentX;
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonTabs.prototype.pointerEnd = function (ev)
{
  if (this.startY === undefined || !this.swipePageAnimation)
    return;
  //
  var currentX = ev.changedTouches ? ev.changedTouches[0].screenX : ev.screenX;
  //
  if (this.swiping) {
    var dt = new Date() - this.startTime;
    var dx = Math.abs(currentX - this.startX);
    var v = dx / dt;
    var dir = currentX > this.startX ? "right" : "left";
    //
    var toChangePage = false;
    //
    // Fast swiping: open or close depending on direction
    if (v > 0.2)
      toChangePage = dir === this.swipingSide;
    else
      toChangePage = Math.abs(this.tx) > this.domObj.offsetWidth / 2; // More than half open?
    //
    this.completeSwipingPageAnimation(toChangePage);
  }
  //
  delete this.swiping;
  delete this.startX;
  delete this.startY;
  delete this.startTime;
  delete this.lastX;
  delete this.tx;
};



Client.IonTabs.prototype.completeSwipingPageAnimation = function (changePage)
{
  if (changePage) {
    // We must make a complete animation to the new page, after that we can select the new page
    this.swipingPageEntering.domObj.className = "complete-swipe";
    this.swipingPageExiting.domObj.className = "complete-swipe";
    //
    var a = this.swipingPageEntering.domObj.offsetTop;
    a = this.swipingPageExiting.domObj.offsetTop;
    //
    this.swipingPageEntering.domObj.style.transform = "translate3d(0px, 0px, 0px)";
    this.swipingPageExiting.domObj.style.transform = this.swipingSide === "left" ? "translate3d(-100%, 0px, 0px)" : "translate3d(100%, 0px, 0px)";
    //
    // Attach the end animation
    this.endTransitionFunction = function (ev) {
      this.swipingPageExiting.domObj.className = "";
      this.swipingPageExiting.domObj.style.display = "none";
      this.swipingPageExiting.domObj.style.transform = "";
      this.swipingPageExiting.selected = false;
      this.swipingPageExiting.updateElement({icon: "*"});
      //
      this.swipingPageEntering.domObj.className = "show-tab";
      this.swipingPageEntering.domObj.style.transform = "";
      this.swipingPageEntering.domObj.removeEventListener("transitionend", this.endTransitionFunction);
      delete this.endTransitionFunction;
      this.swipingPageEntering.selected = true;
      this.selectedPage = this.elements.indexOf(this.swipingPageEntering);
      this.swipingPageEntering.updateElement({icon: "*"});
      //
      this.tabhl.style.transform = "translate3d(" + this.swipingPageEntering.linkObj.offsetLeft + "px,0,0) scaleX(" + this.swipingPageEntering.linkObj.clientWidth + ")";
      this.tabhl.className = "animate";
      if (this.placement === "top")
        this.setTabbarMarginTop(this.swipingPageEntering);
      //
      delete this.swipingSide;
      delete this.swipingPageEntering;
      delete this.swipingPageExiting;
      //
      this.sendPage(ev);
    }.bind(this);
    //
    this.swipingPageEntering.domObj.addEventListener("transitionend", this.endTransitionFunction);
  }
  else {
    // We must make a complete animation to the current page
    this.swipingPageEntering.domObj.className = "complete-swipe";
    this.swipingPageExiting.domObj.className = "complete-swipe";
    //
    var b = this.swipingPageEntering.domObj.offsetTop;
    b = this.swipingPageExiting.domObj.offsetTop;
    //
    this.swipingPageEntering.domObj.style.transform = this.swipingSide === "left" ? "translate3d(100%, 0px, 0px)" : "translate3d(-100%, 0px, 0px)";
    this.swipingPageExiting.domObj.style.transform = "translate3d(0px, 0px, 0px)";
    //
    this.endTransitionFunction = function () {
      // Clear the mess
      this.swipingPageEntering.domObj.className = "";
      this.swipingPageEntering.domObj.style.display = "none";
      this.swipingPageEntering.domObj.style.transform = "";
      this.swipingPageEntering.domObj.removeEventListener("transitionend", this.endTransitionFunction);
      delete this.endTransitionFunction;
      //
      this.swipingPageExiting.domObj.className = "show-tab";
      this.swipingPageExiting.domObj.style.transform = "";
      //
      delete this.swipingSide;
      delete this.swipingPageEntering;
      delete this.swipingPageExiting;
    }.bind(this);
    //
    this.swipingPageEntering.domObj.addEventListener("transitionend", this.endTransitionFunction);
  }
};


/**
 * Check if the page can be swiper in the selected side
 * @param {string} side
 */
Client.IonTabs.prototype.canSwipe = function (side)
{
  if (!this.swipePageAnimation)
    return false;
  //
  if (side === "left")
    return this.selectedPage < this.ne() - 1;
  else
    return this.selectedPage > 0;
};


/**
 * onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.IonTabs.prototype.onResize = function (ev)
{
  if (this.elements) {
    let slpage = this.elements[this.selectedPage];
    //
    slpage.onResize(ev);
    //
    this.lastResizeEvent = ev;
  }
};


/**
 * Get selected tab
 */
Client.IonTabs.prototype.getSelectedTab = function ()
{
  for (let i = 0; i < this.ne(); i++) {
    let e = this.elements[i];
    if (e instanceof Client.IonTab && e.selected)
      return e;
  }
};


/**
 * Set tabbar margin top
 * @param {Element} headerParentEl
 */
Client.IonTabs.prototype.setTabbarMarginTop = function (headerParentEl)
{
  if (!headerParentEl)
    return;
  //
  let marginTop = 0;
  //
  let ionHeaders = headerParentEl.domObj.getElementsByTagName("ION-HEADER");
  for (let i = 0; i < ionHeaders.length; i++)
    marginTop += ionHeaders[i].clientHeight;
  //
  this.tabbar.style.marginTop = marginTop + "px";
};


/**
 * Handle fullscreen
 */
Client.IonTabs.prototype.handleFullscreen = function ()
{
  if (this.placement === "top")
    this.setTabbarMarginTop(this.getSelectedTab());
};


/**
 * @class A container for a tab page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonTab = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-tab");
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  this.createChildren(element);
};

Client.IonTab.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonTab.prototype.updateElement = function (el)
{
  if (el.title !== undefined) {
    this.title = el.title;
    if (this.titleObj)
      this.titleObj.innerHTML = el.title;
    delete el.title;
  }
  if (el.icon !== undefined) {
    this.icon = el.icon === "*" ? this.icon : el.icon;
    if (this.iconObj) {
      var noOutline = this.selected || Client.Ionic.platform === "md" || Client.mainFrame.theme.ionIcons != "3";
      Client.IonHelper.setIonIcon(this.icon + (noOutline ? "" : "-outline"), this.iconObj, "tab-button-icon");
    }
    if (el.icon === "*") {
      var old = this.domObj.style.display;
      this.domObj.style.display = this.visible !== false && this.selected ? "" : "none";
      this.domObj.classList.toggle("show-tab", this.selected);
      if (this.linkObj)
        this.linkObj.setAttribute("aria-selected", this.selected);
      if (this.selected) {
        // Recalc tab content position
        var x = this.getElements(Client.IonContent);
        for (var i = 0; i < x.length; i++)
          x[i].positionContent();
      }
      //
      if (this.domObj.style.display !== old) {
        this.visibilityChanged(this.domObj.style.display === "");
      }
    }
    delete el.icon;
  }
  if (el.badge !== undefined) {
    this.badge = el.badge;
    if (this.badgeObj)
      this.badgeObj.textContent = el.badge;
    delete el.badge;
    this.updateLinkClass();
  }
  if (el.disabled !== undefined) {
    this.disabled = el.disabled;
    delete el.disabled;
    this.updateLinkClass();
  }
  if (el.visible !== undefined) {
    if (this.linkObj)
      this.linkObj.style.display = el.visible ? "" : "none";
  }
  if (el.badgecolor !== undefined) {
    this.badgecolor = el.badgecolor;
    if (this.badgeObj)
      this.badgeObj.className = "tab-badge badge-" + el.badgecolor;
    delete el.badgecolor;
  }
  if (el.tooltip !== undefined) {
    // Close previous instance
    if (this.tooltip)
      this.tooltip.destroy();
    //
    if (el.tooltip) {
      // Set the tooltip on the link
      let opt = {inlinePositioning: true, duration: 100, delay: [750, 100], content: el.tooltip };
      Object.assign(opt, Client.mainFrame.theme.tippy);
      this.tooltip = tippy(this.linkObj, opt);
    }
    //
    delete el.tooltip;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IonTab.prototype.close = function (firstLevel, triggerAnimation)
{
  if (this.linkObj && this.linkObj.parentNode)
    this.linkObj.parentNode.removeChild(this.linkObj);
  //
  Client.Container.prototype.close.call(this, firstLevel, triggerAnimation);
};


/**
 * Remove the element and its children from the element map
 */
Client.IonTab.prototype.updateLinkClass = function ()
{
  if (this.linkObj) {
    var cs = "tab-button";
    if (this.parent.layout !== "icon-hide")
      cs += " has-icon";
    else
      cs += " has-title-only";
    if (this.parent.layout !== "title-hide")
      cs += " has-title";
    else
      cs += " has-icon-only";
    if (this.badge)
      cs += " has-badge";
    if (this.disabled)
      cs += " tab-disabled";
    //
    cs += " disable-hover";
    this.linkObj.className = cs;
  }
};

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonTab.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onClick");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendOnClick = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};

/**
 * Attach events handler
 * @param {object} ev
 */
Client.IonTab.prototype.sendClick = function (ev)
{
  if (this.sendOnClick)
    Client.mainFrame.sendEvents([{obj: this.id, id: "onClick", content: this.saveEvent(ev)}]);
};


/**
 * onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.IonTab.prototype.onResize = function (ev)
{
  if (ev === this.lastResizeEvent)
    return;
  //
  this.lastResizeEvent = ev;
  //
  Client.Element.prototype.onResize.call(this, ev);
};
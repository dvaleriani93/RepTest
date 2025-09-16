/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for a menu page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonMenu = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.navObj = document.createElement("ion-menu");
  this.navObj.className = "has-scrollbar show-menu";
  this.navObj.setAttribute("side", "left");
  Client.IonHelper.registerPointerEvents(this.navObj, "nav", this);
  this.domObj = document.createElement("div");
  if (!element.type)
    element.type = (Client.Ionic.platform === "md") ? "overlay" : "reveal";
  //
  this.backObj = document.createElement("ion-backdrop");
  this.backObj.setAttribute("tappable", "");
  this.backObj.setAttribute("disable-activated", "");
  this.backObj.className = "show-backdrop";
  //
  // Default menu editing
  this.navObj.style.display = "none";
  this.backObj.style.opacity = "0.01";
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  this.navObj.appendChild(this.domObj);
  this.navObj.appendChild(this.backObj);
  parent.appendChildObject(this, this.navObj);
  //
  this.addEventsListeners();
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);
};

Client.IonMenu.prototype = new Client.Container();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonMenu.prototype.updateElement = function (el)
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
  if (el.visible !== undefined) {
    this.visible = el.visible;
    //
    if (this.hideTimer) {
      window.clearTimeout(this.hideTimer);
      delete this.hideTimer;
    }
    //
    if (this.animate === false) {
      // Reveal immediately
      this.navObj.style.display = this.visible ? "" : "none";
      this.backObj.style.display = "none";
      //
      if (this.type === "overlay") {
        this.domObj.style.transform = this.visible ? "translate3d(0, 0, 0)" : "translate3d(" + (this.side && this.side === "right" ? "100%" : "-100%") + ", 0, 0)";
      }
      if (this.type === "reveal") {
        var page = this.getPage();
        if (page) {
          page.style.transition = "";
          page.style.transform = "translate3d(0,0,0)";
        }
      }
    }
    else {
      // Standard animation
      if (this.visible) {
        this.navObj.style.display = "";
        this.backObj.style.display = "block";
      }
      this.showTimer = setTimeout(function () {
        delete this.showTimer;
        if (this.type === "overlay") {
          this.domObj.style.transform = this.visible ? "translate3d(0, 0, 0)" : "translate3d(" + (this.side && this.side === "right" ? "100%" : "-100%") + ", 0, 0)";
          this.backObj.style.opacity = this.visible ? "0.35" : "0.01";
        }
        if (this.type === "reveal") {
          var page = this.getPage();
          if (page) {
            page.style.transition = "transform 200ms ease";
            page.style.transform = "translate3d(" + (this.visible ? this.domObj.offsetWidth : 0) + "px,0,0)";
            page.appendChild(this.backObj);
            // The following line enable "instant" animation without another timer
            this.backObj.offsetTop;
            this.backObj.style.opacity = this.visible ? "0.26" : "0.01";
          }
        }
      }.bind(this), 10);
      if (!el.visible) {
        this.hideTimer = setTimeout(function () {
          this.navObj.style.display = "none";
          this.backObj.style.display = "none";
          delete this.hideTimer;
        }.bind(this), 250);
      }
      delete el.visible;
    }
  }
  if (el.side !== undefined) {
    this.side = el.side;
    this.navObj.setAttribute("side", el.side);
  }
  //
  if (el.type !== undefined) {
    this.type = el.type;
    this.navObj.setAttribute("type", el.type);
    //
    // Changing transitions
    this.backObj.style.transition = "opacity 200ms ease";
    if (this.type === "overlay") {
      this.domObj.style.transition = "transform 200ms ease";
      this.domObj.style.transform = "translate3d(" + (this.side && this.side === "right" ? "100%" : "-100%") + ", 0, 0)";
    }
    if (this.type === "reveal") {
      this.domObj.style.transform = "translate3d(0, 0, 0)";
      this.backObj.style.zIndex = 100;
      Client.IonHelper.registerPointerEvents(this.backObj, "back", this);
    }
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "menu-inner";
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * Add events listeners
 */
Client.IonMenu.prototype.addEventsListeners = function ()
{
  this.backObj.ontouchmove = (ev) => ev.preventDefault();
  //
  this.backObj.onclick = () => {
    // Click are disabled? No action
    if (!Client.mainFrame.isEditing() && !Client.mainFrame.isClickPrevented(500))
      this.setVisible(false, true);
  };
};


/**
 * Return the dom root object of this element
 * @returns {DomElement}
 */
Client.IonMenu.prototype.getRootObject = function ()
{
  return this.navObj;
};


/**
 * Returns first app page object
 */
Client.IonMenu.prototype.getPage = function ()
{
  var pages = this.navObj.parentNode.getElementsByTagName("ION-NAV");
  if (!pages.length)
    pages = this.navObj.parentNode.getElementsByTagName("ION-PAGE");
  if (pages.length) {
    return pages[0];
  }
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonMenu.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onVisibilityChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendOnChange = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};



/**
 * touchstart, mousedown event listener
 * @param {event} ev
 */
Client.IonMenu.prototype.pointerStart = function (ev)
{
  // Do not handle touch events if the menu is exposed in a splitview
  if (Client.IonSplitPane && this.parent && this.parent instanceof Client.IonSplitPane) {
    if (this.parent.exposed && this.getRootObject().classList.contains("split-pane-side"))
      return;
  }
  //
  this.startY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  this.startX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  this.swiping = false;
  //
  if (this.type === "reveal") {
    var page = this.getPage();
    if (page)
      page.style.transition = "";
  }
  return true;
};


/**
 * touchmove, mousemove event listener
 * @param {event} ev
 */
Client.IonMenu.prototype.pointerMove = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  var currentY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  var currentX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  var dy = Math.abs(currentY - this.startY);
  var dx = Math.abs(currentX - this.startX);
  //
  // swipe down disable menu swiping
  if (!this.swiping)
    if (dy > dx * 2 && dy > 20) {
      delete this.startX;
      delete this.startY;
    }
    else if (dx > 10) {
      this.swiping = true;
      this.startX = currentX;
      this.domObj.classList.add("swiping");
    }
  //
  if (this.swiping) {
    var mx = this.startX - currentX;
    if (mx < 0)
      mx = 0;
    if (this.type === "overlay") {
      this.domObj.style.transform = "translate3d(-" + mx + "px, 0, 0)";
    }
    else {
      this.backObj.parentNode.style.transform = "translate3d(" + (this.domObj.offsetWidth - mx) + "px, 0, 0)";
    }
    if (this.lastX < currentX)
      this.closing = false;
    else
      this.closing = (mx > Math.min(this.domObj.offsetWidth / 2, 40));
  }
  this.lastX = currentX;
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonMenu.prototype.pointerEnd = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  if (this.type === "reveal") {
    var page = this.getPage();
    if (page)
      page.style.transition = "transform 200ms ease";
  }
  //
  this.domObj.classList.remove("swiping");
  if (this.swiping) {
    Client.mainFrame.preventClick();
    this.setVisible(!this.closing, true);
  }
  //
  delete this.closing;
  delete this.swiping;
  delete this.startX;
  delete this.lastX;
  delete this.startY;
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonMenu.prototype.pointerOut = function (ev)
{
  var x = ev.toElement;
  var out = true;
  while (x) {
    if (x === this.navObj) {
      out = false;
      break;
    }
    x = x.parentNode;
  }
  if (out)
    this.pointerEnd(ev);
};


/**
 * changevisibility
 * @param {bool} flag
 * @param {bool} emitChanges
 */
Client.IonMenu.prototype.setVisible = function (flag, emitChanges)
{
  this.updateElement({visible: flag});
  if (emitChanges) {
    var x = [{obj: this.id, id: "chgProp", content: {name: "visible", value: this.visible, clid: Client.id}, warn: false}];
    if (this.sendOnChange)
      x.push({obj: this.id, id: "onVisibilityChange", warn: false});
    Client.mainFrame.sendEvents(x);
  }
};

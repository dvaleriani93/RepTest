/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for an ionic list
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonList = function (element, parent, view)
{
  element.tag = element.itemGroup ? "ion-item-group" : "ion-list";
  Client.Container.call(this, element, parent, view);
};

Client.IonList.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonList.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  if (el.noLines !== undefined) {
    this.domObj.removeAttribute("no-lines");
    if (el.noLines)
      this.domObj.setAttribute("no-lines", "");
    delete el.noLines;
  }
  if (el.inset !== undefined) {
    this.domObj.removeAttribute("inset");
    if (el.inset)
      this.domObj.setAttribute("inset", "");
    delete el.inset;
  }
  if (el.itemGroup !== undefined) {
    this.changeTag(el.itemGroup ? "ion-item-group" : "ion-list");
    delete el.itemGroup;
  }
  if (el.radioGroup !== undefined) {
    if (el.radioGroup)
      this.domObj.setAttribute("radio-group", true);
    else
      this.domObj.removeAttribute("radio-group");
  }
  if (el.value !== undefined) {
    if (el.value !== this.value) {
      var pthis = this;
      setTimeout(function () {
        var ar = pthis.getElements(Client.IonRadio);
        for (var i = 0; i < ar.length; i++)
          ar[i].updateElement({checked: ar[i].domObj.value === pthis.value});
        //
        var x = [];
        x.push({obj: pthis.id, id: "chgProp", content: {name: "errorText", value: "", clid: Client.id}});
        x.push({obj: pthis.id, id: "chgProp", content: {name: "value", value: pthis.value, clid: Client.id}});
        if (pthis.sendOnChange)
          x.push({obj: pthis.id, id: "onChange"});
        Client.mainFrame.sendEvents(x);
      }, 0);
    }
    //
    this.value = el.value;
    delete el.value;
  }
  //
  if (el.moreRows !== undefined && Client.IonContent && this.parent instanceof Client.IonContent) {
    if (this.moreRows === undefined) {
      this.moreRows = false;
      this.parent.scrollContent.addEventListener("scroll", function (ev) {
        //
        // Reset scroll top when content shrink to eliminate page bouncing
        if (this.parent.scrollContent.scrollTop > this.domObj.offsetHeight + this.domObj.offsetTop)
          this.parent.scrollContent.scrollTop = this.domObj.offsetHeight + this.domObj.offsetTop;
        //
        this.getNextPage(ev);
      }.bind(this), {passive: true});
    }
  }
  //
  if (el.refresher !== undefined && !this.refreshed) {
    //
    // Find the element that will be moved
    if (!this.swipingElement) {
      var t = this.parent.domObj.childNodes;
      for (var i = 0; i < t.length; i++) {
        var tagname = t[i].tagName;
        if (tagname === "SCROLL-CONTENT") {
          this.swipingElement = t[i];
          break;
        }
      }
      //
      // Refresher cannot be used without a scroll-content element
      if (!this.swipingElement)
        return;
    }
    //
    // Define refresher state constants
    this.STATE_INACTIVE = 'inactive';
    this.STATE_PULLING = 'pulling';
    this.STATE_READY = 'ready';
    this.STATE_REFRESHING = 'refreshing';
    this.state = this.STATE_INACTIVE;
    //
    this.pullMin = 60;
    this.pullMax = this.pullMin + 90;
    var refreshText = el.refreshText || "Refreshing...";
    var pullText = el.pullText || "Pull to refresh...";
    //
    // Add the refresher element
    this.parent.domObj.classList.add("has-refresher");
    this.refresher = document.createElement("ion-refresher");
    this.refresher.style.top = this.swipingElement.style.marginTop;
    this.parent.domObj.appendChild(this.refresher);
    //
    this.refresherContent = document.createElement("ion-refresher-content");
    this.refresherContent.setAttribute("pullingtext", refreshText);
    this.refresherContent.setAttribute("refreshingtext", pullText);
    this.refresherContent.setAttribute("state", "inactive");
    this.refresher.appendChild(this.refresherContent);
    //
    var pulling = document.createElement("div");
    pulling.className = "refresher-pulling";
    this.refresherContent.appendChild(pulling);
    //
    var pullingIcon = document.createElement("div");
    pullingIcon.className = "refresher-pulling-icon";
    pulling.appendChild(pullingIcon);
    //
    var ionPullingIcon = document.createElement("ion-icon");
    ionPullingIcon.setAttribute("role", "img");
    ionPullingIcon.setAttribute("aria-label", "arrow-down");
    Client.IonHelper.setIonIcon((Client.mainFrame.theme.ionIcons === "5" ? "svg_" : "") + "arrow-down", ionPullingIcon, "icon-ios");
    pullingIcon.appendChild(ionPullingIcon);
    //
    var pullingText = document.createElement("div");
    pullingText.className = "refresher-pulling-text";
    pullingText.innerHTML = pullText;
    pulling.appendChild(pullingText);
    //
    var refreshing = document.createElement("div");
    refreshing.className = "refresher-refreshing";
    this.refresherContent.appendChild(refreshing);
    //
    var refreshingIcon = document.createElement("div");
    refreshingIcon.className = "refresher-refreshing-icon";
    refreshingIcon.innerHTML = Client.IonHelper.createSpinner();
    refreshing.appendChild(refreshingIcon);
    //
    var refreshingText = document.createElement("div");
    refreshingText.className = "refresher-pulling-text";
    refreshingText.innerHTML = refreshText;
    refreshing.appendChild(refreshingText);
    //
    Client.IonHelper.registerPointerEvents(this.swipingElement, undefined, this, true, "pm");
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  this.domObj.classList.add("list-" + Client.Ionic.platform);
};

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonList.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onChange");
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
Client.IonList.prototype.pointerStart = function (ev)
{
  // The refresher is already doing something...calm down
  if (this.state && this.state !== this.STATE_INACTIVE)
    return;
  if (this.swipingElement.scrollTop > 0)
    return;
  //
  this.startY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  this.startX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  this.listMoved = false;
  this.startTime = new Date();
};

/**
 * touchmove, mousemove event listener
 * @param {event} ev
 */
Client.IonList.prototype.pointerMove = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  if (Client.mainFrame.isClickPrevented()) {
    delete this.startY;
    return;
  }
  // Let's see if there is a swipe / reorder in place
  var obj = ev.srcElement;
  var ok = true;
  while (ok && obj && obj.id !== "app-ui") {
    if (obj.classList.contains("active-slide"))
      ok = false;
    obj = obj.parentNode;
  }
  //
  if (!ok) {
    this.swipingElement.style.transition = "";
    this.swipingElement.style.transform = "";
    this.state = this.STATE_INACTIVE;
    delete this.startY;
    this.listMoved = false;
    return;
  }
  //
  var currentY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  var dy = currentY - this.startY;
  //
  if (Math.abs(dy) > 10)
    this.listMoved = true;
  //
  if (this.state === this.STATE_INACTIVE) {
    // Not enought to start
    if (dy < 10)
      return;
    else {
      this.startY = currentY - 1;
      dy = 1;
      //
      // Set refresher state
      this.state = this.STATE_PULLING;
      this.refresherContent.setAttribute("state", this.state);
      this.refresher.classList.add("refresher-active");
    }
  }
  //
  // Cannot swipe up
  if (dy <= 0)
    return;
  //
  if (this.state !== this.STATE_REFRESHING) {
    // Pulled farther than the max, so kick off the refresh
    if (dy > this.pullMax) {
      this.pointerEnd(ev);
    }
    else {
      // Move the list to its new position
      this.ty = -(this.startY - currentY);
      this.swipingElement.style.transition = "none";
      this.swipingElement.style.transform = "translate3d(0," + this.ty + "px, 0)";
      ev.preventDefault();
      //
      // Pulled farther than the pull min, I put the refresher in the "ready" state
      if (dy > this.pullMin) {
        this.state = this.STATE_READY;
        this.refresherContent.setAttribute("state", this.state);
      }
      else {  // Stay in the pulling state
        if (this.state !== this.STATE_PULLING) {
          this.state = this.STATE_PULLING;
          this.refresherContent.setAttribute("state", this.state);
        }
      }
    }
  }
};

/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonList.prototype.pointerEnd = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  this.swipingElement.style.transition = "";
  //
  // If the state is "ready", refresh
  if (this.state === this.STATE_READY)
    this.doRefresh();
  else if (this.state !== this.STATE_REFRESHING) {
    // If it's not refreshing, reset it
    this.resetRefresh();
  }
  //
  if (this.listMoved)
    Client.mainFrame.preventClick();
  //
  delete this.startY;
  delete this.startTime;
  delete this.lastX;
  delete this.tx;
  delete this.listMoved;
};

/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonList.prototype.pointerOut = function (ev)
{
  var x = ev.toElement;
  var out = true;
  while (x) {
    if (x === this.domObj) {
      out = false;
      break;
    }
    x = x.parentNode;
  }
  if (out)
    this.pointerEnd(ev);
};

/**
 * Put the refresher in the "refreshing" state
 */
Client.IonList.prototype.doRefresh = function ()
{
  Client.mainFrame.preventClick();
  //
  // Set the state
  this.state = this.STATE_REFRESHING;
  //
  this.swipingElement.style.transition = "";
  this.refresherContent.setAttribute("state", this.state);
  //
  // Move the list
  this.swipingElement.style.transform = "translate3d(0," + this.pullMin + "px, 0)";
  //
  // Send the event
  var e = [{obj: this.id, id: "onRefresh", content: {}}];
  Client.mainFrame.sendEvents(e);
  //
  Client.IonHelper.hapticFeedback({type: ">m"});
};

/**
 * Put the the refresher in its initial state
 */
Client.IonList.prototype.resetRefresh = function ()
{
  // Set the state
  this.state = this.STATE_INACTIVE;
  this.refresherContent.setAttribute("state", this.state);
  this.refresher.classList.remove("refresher-active");
  //
  // Move the list
  this.swipingElement.style.transform = "translate3d(0,0,0)";
};

/**
 * Called by the user when the refresh operation is completed
 */
Client.IonList.prototype.refreshCompleted = function ()
{
  this.resetRefresh();
};

/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child child element that requested the insertion
 * @param {HTMLElement} domObj child DOM object to add
 */
Client.IonList.prototype.appendChildObject = function (child, domObj)
{
  // Adding an header or a divider to a list? update last item class to get a better visual
  if (this.elements && this.elements.length && child instanceof Client.IonItem && child.isDivider()) {
    var last = this.elements[this.elements.length - 1];
    if (last instanceof Client.IonItem && !last.isDivider())
      last.getRootObject().setAttribute("last-before-" + child.type, "");
  }
  //
  this.domObj.appendChild(domObj);
};


/**
 * One of my children element has been removed
 * @param {Element} child
 */
Client.IonList.prototype.onRemoveChildObject = function (child)
{
  // Handle last-before-attribute
  var la = ["last-before-header", "last-before-divider"];
  var root = child.getRootObject();
  for (var i = 0; i < la.length; i++) {
    if (root.hasAttribute(la[i]))
      break;
  }
  if (i < la.length) {
    var idx = this.elements.indexOf(child);
    if (idx >= 0) {
      var prev = this.elements[idx - 1];
      if (prev instanceof Client.IonItem && !prev.isDivider())
        prev.getRootObject().setAttribute(la[i], "");
    }
  }
  //
  if (child instanceof Client.IonItem && child.isDivider()) {
    var idx = this.elements.indexOf(child);
    if (idx >= 0) {
      var prev = this.elements[idx - 1];
      if (prev instanceof Client.IonItem)
        prev.getRootObject().removeAttribute("last-before-" + child.type);
    }
  }
  //
  Client.Container.prototype.onRemoveChildObject.call(this, child);
};


/**
 * One of my children element has been moved by the insertBefore function as the sibling position was required
 * The child object was first added to this object, then it is positioned at the right place
 * @param {int} position
 */
Client.IonList.prototype.onPositionChildObject = function (position)
{
  if (position === 0)
    return;
  //
  var newEl = this.elements[position];
  var prevEl = this.elements[position - 1];
  //
  if (newEl instanceof Client.IonItem && prevEl instanceof Client.IonItem) {
    if (newEl.isDivider() && !prevEl.isDivider()) {
      prevEl.getRootObject().setAttribute("last-before-" + newEl.type, "");
    }
    if (!newEl.isDivider() && !prevEl.isDivider()) {
      var la = ["last-before-header", "last-before-divider"];
      var prevRoot = prevEl.getRootObject();
      var newRoot = newEl.getRootObject();
      for (var i = 0; i < la.length; i++) {
        if (prevRoot.hasAttribute(la[i])) {
          newRoot.setAttribute(la[i], "");
          prevRoot.removeAttribute(la[i]);
        }
      }
    }
  }
  //
  Client.Container.prototype.onPositionChildObject.call(this, position);
};


/**
 * @class A container for an ionic list item
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonItem = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.type = element.type;
  this.domObj = document.createElement(this.getTag());
  //
  if (element.inner !== false) {
    this.innerItem = document.createElement("div");
    this.innerItem.className = "item-inner";
  }
  delete element.inner;
  //
  if (element.wrapper !== false) {
    this.inputWrapper = document.createElement("div");
    this.inputWrapper.className = "input-wrapper";
  }
  delete element.wrapper;
  //
  if (this.innerItem && this.inputWrapper)
    this.innerItem.appendChild(this.inputWrapper);
  if (this.innerItem)
    this.domObj.appendChild(this.innerItem);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  // First create children, then attach the entire item to the list
  this.createChildren(element);
  //
  parent.appendChildObject(this, this.getRootObject());
  //
  this.addEventsListeners();
};

Client.IonItem.prototype = new Client.Container();

Client.IonItem.needsFullscreenPadding = true;

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonItem.prototype.updateElement = function (el)
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
  if (el.detail !== undefined) {
    if (this.detail)
      this.domObj.removeAttribute("detail-" + this.detail);
    this.detail = el.detail;
    if (this.detail)
      this.domObj.setAttribute("detail-" + this.detail, "");
    delete el.detail;
  }
  if (el.type !== undefined) {
    this.type = el.type;
    //
    var slip = this.domObj.getAttribute("slip");
    //
    this.changeTag(this.getTag());
    //
    if (this.type === "button")
      Client.IonHelper.registerClickListener(this);
    //
    if (this.color)
      this.domObj.setAttribute(this.color, undefined);
    if (this.detail)
      this.domObj.setAttribute("detail-" + this.detail, "");
    if (slip)
      this.domObj.setAttribute("slip", slip);
    //
    update = true;
    delete el.type;
  }
  if (el.wrapText !== undefined) {
    if (el.wrapText)
      this.domObj.setAttribute("text-wrap", "");
    else
      this.domObj.removeAttribute("text-wrap");
    delete el.wrapText;
  }
  if (el.sticky !== undefined) {
    this.sticky = el.sticky;
    update = true;
    delete el.sticky;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = this.getClass();
    if (this.sticky)
      cs += " item-sticky";
    if (this.className)
      cs += " " + this.className;
    //
    cs += " §"; // server-added class boundary
    //
    // Search for client-added classes
    var d = this.domObj.className;
    var idx = d.indexOf("§");
    if (idx > -1)
      cs += d.substring(idx + 1);
    //
    this.setClassName(cs);
  }
};


/**
 * Return a copy of the element
 * @param {Object} config
 * @param {Client.Element} parent
 * @param {Map} referencesMap
 */
Client.IonItem.prototype.clone = function (config, parent, referencesMap)
{
  let el = Client.Element.prototype.clone.call(this, config, parent, referencesMap);
  //
  // Since I just cloned the element, its swipe close event listener is not valid. It will be added on swipe menu open
  delete el.swipeCloseListener;
  //
  return el;
};


/**
 * Add events listeners
 */
Client.IonItem.prototype.addEventsListeners = function ()
{
  if (!this.inputWrapper)
    return;
  //
  // If this item contains a real input tag, focus it on click
  let v = this.inputWrapper.getElementsByTagName("INPUT");
  if (v?.length) {
    this.domObj.addEventListener("click", (ev) => {
      if (!Client.Utils.isNodeEditable(document.activeElement))
        v[0].focus();
    });
  }
};


/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child child element that requested the insertion
 * @param {HTMLElement} domObj child DOM object to add
 */
Client.IonItem.prototype.appendChildObject = function (child, domObj)
{
  if (Client.IonSwipe && child instanceof Client.IonSwipe) {
    if (!this.rootObj) {
      this.rootObj = document.createElement("ion-item-sliding");
      this.rootObj.className = "item-wrapper";
      //
      // I need to reparent the item, so we need the actual parent. During costruction there is no need of this
      var parent = this.domObj.parentNode;
      this.rootObj.appendChild(this.domObj);
      if (parent && Client.mainFrame && Client.mainFrame.isEditing && Client.mainFrame.isEditing())
        parent.appendChild(this.rootObj);
      //
      Client.IonHelper.registerPointerEvents(this.rootObj, undefined, this, false, "pm");
    }
    this.rootObj.appendChild(domObj);
    return;
  }
  //
  if (Client.IonHelper.isInput(child)) {
    var hasInput = false;
    for (var i = 0; i < this.ne() && !hasInput; i++) {
      hasInput = Client.IonHelper.isInput(this.elements[i]);
    }
    if (hasInput)
      this.domObj.classList.add("item-multiple-inputs");
  }
  //
  if ((Client.IonInput && child instanceof Client.IonInput) ||
          (Client.IonAutoComplete && child instanceof Client.IonAutoComplete) ||
          (Client.IonDateTime && child instanceof Client.IonDateTime) ||
          (Client.IonSelect && child instanceof Client.IonSelect) ||
          (Client.IonRange && child instanceof Client.IonRange)) {
    if (this.inputWrapper)
      this.inputWrapper.appendChild(domObj);
    return;
  }
  //
  var reqPos = true;
  if (Client.SwipeMenu && child instanceof Client.SwipeMenu)
    reqPos = false;
  if (Client.IonSelect && child instanceof Client.IonSelect)
    reqPos = false;
  //
  var pos = "left";
  var del = "right";
  //
  for (var i = 0; i < this.ne(); i++) {
    if (Client.IonLabel && this.elements[i] instanceof Client.IonLabel) {
      pos = "right";
      del = "left";
      break;
    }
  }
  //
  if (child.itemSide) {
    if (child.itemSide.indexOf("left") > -1) {
      reqPos = true;
      pos = "left";
      del = "right";
    }
    if (child.itemSide.indexOf("right") > -1) {
      reqPos = true;
      pos = "right";
      del = "left";
    }
  }
  //
  if (reqPos) {
    domObj.removeAttribute("item-" + del);
    domObj.setAttribute("item-" + pos, "");
  }
  //
  var okToPos = true;
  //
  if (child.itemSide) {
    if (child.itemSide.indexOf("wrapper") > -1 && this.inputWrapper) {
      okToPos = false;
      if (pos === "left")
        this.inputWrapper.insertBefore(domObj, this.inputWrapper.firstChild);
      else
        this.inputWrapper.appendChild(domObj);
    }
    if (child.itemSide.indexOf("inner") > -1 && this.innerItem) {
      okToPos = false;
      if (pos === "left")
        this.innerItem.insertBefore(domObj, this.innerItem.firstChild);
      else
        this.innerItem.appendChild(domObj);
    }
    if (child.itemSide.indexOf("outer") > -1) {
      okToPos = false;
      if (pos === "left")
        this.domObj.insertBefore(domObj, this.domObj.firstChild);
      else
        this.domObj.appendChild(domObj);
    }
  }
  //
  if (okToPos) {
    if (Client.IonLabel && child instanceof Client.IonLabel && this.inputWrapper) {
      this.inputWrapper.appendChild(domObj);
    }
    else if (this.innerItem) {
      if (pos === "left")
        this.domObj.insertBefore(domObj, this.innerItem);
      else
        this.innerItem.appendChild(domObj);
    }
    else {
      this.domObj.appendChild(domObj);
    }
  }
};

/**
 * Return the tag for this item
 */
Client.IonItem.prototype.getTag = function ()
{
  switch (this.type) {
    case "button":
      return "button";
    case "header":
      return "ion-list-header";
    case "divider":
      return "ion-item-divider";
  }
  //
  return "ion-item";
};


/**
 * Return the tag for this item
 */
Client.IonItem.prototype.getClass = function ()
{
  switch (this.type) {
    case "header":
    case "divider":
      return "";
  }
  //
  return "item";
};


/**
 * Return true if the item divide the list
 */
Client.IonItem.prototype.isDivider = function ()
{
  return this.type === "header" || this.type === "divider";
};


/**
 * Return the dom root object of this element
 * @returns {DomElement}
 */
Client.IonItem.prototype.getRootObject = function ()
{
  return this.rootObj || this.domObj;
};


/**
 * Return the dom root object of this element
 * @param {string} side
 */
Client.IonItem.prototype.canSwipe = function (side)
{
  for (var i = 0; i < this.elements.length; i++) {
    var e = this.elements[i];
    if (Client.IonSwipe && e instanceof Client.IonSwipe) {
      if (e.visible && e.side === side)
        return true;
    }
  }
};


/**
 * Calculate the side of any swipe menu on this side
 * @param {string} side
 */
Client.IonItem.prototype.calcSwipeWidth = function (side)
{
  var s = 0;
  for (var i = 0; i < this.elements.length; i++) {
    var e = this.elements[i];
    if (Client.IonSwipe && e instanceof Client.IonSwipe) {
      if (e.visible && e.side === side)
        s += e.calcSwipeWidth();
    }
  }
  return s;
};


/**
 * Calculate the side of any swipe menu on this side
 * @param {string} side
 */
Client.IonItem.prototype.getDefaultValue = function (side)
{
  for (var i = 0; i < this.elements.length; i++) {
    var e = this.elements[i];
    if (Client.IonSwipe && e instanceof Client.IonSwipe) {
      if (e.visible && e.side === side && e.defaultValue)
        return e;
    }
  }
};


/**
 * Return true if one of the swipe menu has the long press function enabled
 */
Client.IonItem.prototype.hasLongPress = function ()
{
  for (var i = 0; i < this.elements.length; i++) {
    var e = this.elements[i];
    if (Client.IonSwipe && e instanceof Client.IonSwipe) {
      if (e.visible && e.longPress)
        return true;
    }
  }
};


/**
 * show the long press menu
 */
Client.IonItem.prototype.onLongPress = function ()
{
  var items = [];
  var title = "";
  for (var i = 0; i < this.elements.length; i++) {
    var e = this.elements[i];
    if (Client.IonSwipe && e instanceof Client.IonSwipe) {
      if (e.visible && e.longPress && e.options) {
        for (var j = 0; j < e.options.length; j++) {
          var smitem = e.options[j];
          //
          // Extract command properties
          var icon = smitem.src || smitem.img || smitem.icon;
          var label = smitem.n || smitem.name || smitem.label;
          var code = smitem.v || smitem.code || smitem.cmd;
          var style = smitem.s || smitem.style || smitem.class || smitem.cls || smitem.className || "";
          //
          var destructive = (style.indexOf("danger") > -1);
          if (style.indexOf(":"))
            style = "";
          //
          items.push({icon: icon, cssClass: style, text: label, id: j + 1, destructive: destructive, code: code, swipeElement: e});
        }
      }
    }
    //
    if (Client.ListSorter && e instanceof Client.ListSorter) {
      // Cancel reorder actions if any
      e.cancel();
    }
    //
    if (!title && Client.IonLabel && e instanceof Client.IonLabel) {
      // Show a title in the context menu
      title = e.domObj.innerText;
    }
  }
  //
  Client.IonHelper.hapticFeedback({type: ">m"});
  //
  Client.IonHelper.createActionSheet({title: title, buttons: items}, function (r) {
    var item = items[r - 1];
    if (item && item.swipeElement) {
      var e = [{obj: item.swipeElement.id, id: "onSwipeSelected", content: item.code}];
      Client.mainFrame.sendEvents(e);
    }
  }.bind(this));
};


/**
 * touchstart, mousedown event listener
 * @param {event} ev
 */
Client.IonItem.prototype.pointerStart = function (ev)
{
  this.startY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  this.startX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  this.startTime = new Date();
  this.swiping = false;
  if (this.hasLongPress() && !this.longPressTimedId) {
    this.longPressTimedId = setTimeout(function () {
      this.onLongPress();
    }.bind(this), 600);
  }
  return true;
};


/**
 * touchmove, mousemove event listener
 * @param {event} ev
 */
Client.IonItem.prototype.pointerMove = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  if (Client.mainFrame.isClickPrevented()) {
    if (this.swiping)
      this.resetSwipeMenu();
    delete this.startX;
    delete this.startY;
    clearTimeout(this.longPressTimedId);
    delete this.longPressTimedId;
    return;
  }
  //
  var currentY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  var currentX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  var dy = Math.abs(currentY - this.startY);
  var dx = this.startX - currentX;
  //
  // Reset long press on move
  if (this.longPressTimedId && (Math.abs(dx) > 8 || dy > 8)) {
    clearTimeout(this.longPressTimedId);
    delete this.longPressTimedId;
  }
  //
  // swipe down disable menu swiping
  if (!this.swiping) {
    if (this.swipeOpen) {
      if (Math.abs(dx) > 10) {
        this.swiping = true;
      }
    }
    else if (dy > Math.abs(dx) && dy > 10) {
      delete this.startX;
      delete this.startY;
    }
    else if (dx > 10 && this.canSwipe("right")) {
      this.swiping = true;
      this.swipingSide = "right";
    }
    else if (dx < -10 && this.canSwipe("left")) {
      this.swiping = true;
      this.swipingSide = "left";
    }
    //
    if (this.swiping) {
      if (this.swipeTimerId) {
        clearTimeout(this.swipeTimerId);
        delete this.swipeTimerId;
      }
      this.startX = currentX;
      this.rootObj.classList.add("active-slide");
      this.rootObj.classList.add("active-options-" + this.swipingSide);
      this.swipingWidth = this.calcSwipeWidth(this.swipingSide);
      this.swipeDefaultValue = this.getDefaultValue(this.swipingSide);
      this.swipeMaxWidth = this.rootObj.clientWidth;
      this.domObj.classList.remove("activated");
    }
  }
  //
  if (this.swiping) {
    var mx = this.startX - currentX;
    if (this.swipeOpen) {
      if (this.swipingSide === "right")
        mx += this.swipingWidth;
      else
        mx -= this.swipingWidth;
    }
    //
    if (mx < 0 && this.swipingSide === "right")
      mx = 0;
    else if (mx > this.swipingWidth && !this.swipeDefaultValue)
      mx -= (mx - this.swipingWidth) / 2;
    //
    if (mx > 0 && this.swipingSide === "left")
      mx = 0;
    else if (mx < -this.swipingWidth && !this.swipeDefaultValue)
      mx += (-mx - this.swipingWidth) / 2;
    //
    // Default value management
    if (this.swipeDefaultValue) {
      //
      // Calc first limit
      if (!this.swipeActiveLimit)
        this.swipeActiveLimit = Math.max(this.swipingWidth + 20, this.swipeMaxWidth / 2 - 20);
      //
      // Swipe default is not acitve
      if (!this.swipeActiveTime) {
        // 20px above limit: activate it!
        if (Math.abs(mx) - this.swipeActiveLimit > 20) {
          this.rootObj.classList.add("active-swipe-" + this.swipingSide);
          this.swipeActiveTime = new Date();
          Client.IonHelper.hapticFeedback({type: ">m"});
        }
        else {
          // Restore limit low value if necessary
          var min = Math.max(this.swipingWidth + 20, this.swipeMaxWidth / 2 - 20);
          if (Math.abs(mx) < this.swipeActiveLimit)
            this.swipeActiveLimit = Math.max(Math.abs(mx), min);
        }
      }
      //
      // Swipe default is active
      if (this.swipeActiveTime) {
        //
        // Register the new maximum as limit
        if (Math.abs(mx) > this.swipeActiveLimit)
          this.swipeActiveLimit = Math.abs(mx);
        //
        // Under low limit? Deactivate it
        if (this.swipeActiveLimit - Math.abs(mx) > 20) {
          this.domObj.style.transition = "";
          this.rootObj.classList.remove("active-swipe-" + this.swipingSide);
          delete this.swipeActiveTime;
          this.waitTransition = new Date() + 200;
          Client.IonHelper.hapticFeedback({type: ">m"});
        }
      }
    }
    //
    if (this.swipeActiveTime)
      this.tx = (this.swipingSide === "left" ? 0.95 : -0.95) * this.swipeMaxWidth;
    else
      this.tx = -mx;
    //
    this.domObj.style.transform = "translate3d(" + this.tx + "px, 0, 0)";
    if ((new Date()).getTime() - (this.waitTransition || 0) > 500)
      this.domObj.style.transition = "none";
    //
    ev.preventDefault();
  }
  this.lastX = currentX;
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonItem.prototype.pointerEnd = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  var currentX = ev.changedTouches ? ev.changedTouches[0].screenX : ev.screenX;
  //
  if (this.swiping) {
    var dt = new Date() - this.startTime;
    var dx = Math.abs(currentX - this.startX);
    var v = dx / dt;
    var dir = currentX > this.startX ? "left" : "right";
    this.domObj.style.transition = "";
    //
    var toOpen = false;
    //
    // Fast swiping: open or close depending on direction
    if (v > 0.2)
      toOpen = dir === this.swipingSide;
    else
      toOpen = Math.abs(this.tx) > this.swipingWidth / 2; // More than half open?
    //
    this.openSwipeMenu(toOpen);
    //
    // Send default click
    if (this.swipeDefaultValue && this.rootObj.classList.contains("active-swipe-" + this.swipingSide)) {
      if (new Date() - this.swipeActiveTime > 200)
        this.swipeDefaultValue.myClick({default: true});
      else {
        // too fast! remove swipe after a while
        setTimeout(function () {
          this.rootObj.classList.remove("active-swipe-left");
          this.rootObj.classList.remove("active-swipe-right");
        }.bind(this), 200);
      }
    }
  }
  //
  clearTimeout(this.longPressTimedId);
  delete this.longPressTimedId;
  delete this.swiping;
  delete this.startX;
  delete this.startY;
  delete this.startTime;
  delete this.lastX;
  delete this.tx;
  delete this.swipeDefaultValue;
  delete this.swipeActiveLimit;
  delete this.waitTransition;
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonItem.prototype.pointerOut = function (ev)
{
  var x = ev.toElement;
  var out = true;
  while (x) {
    if (x === this.rootObj) {
      out = false;
      break;
    }
    x = x.parentNode;
  }
  if (out)
    this.pointerEnd(ev);
};


/**
 * opens or closes the swipe menu
 * @param {bool} flag
 */
Client.IonItem.prototype.openSwipeMenu = function (flag, side)
{
  if (side) {
    // Called from code
    if (this.swipeOpen)
      return;
    this.swipingSide = side;
    this.rootObj.classList.add("active-slide");
    this.rootObj.classList.add("active-options-" + this.swipingSide);
    this.swipingWidth = this.calcSwipeWidth(this.swipingSide);
  }
  //
  Client.mainFrame.preventClick();
  clearTimeout(this.longPressTimedId);
  delete this.longPressTimedId;
  //
  var appui = document.getElementById("app-ui");
  //
  if (!this.swipeCloseListener) {
    this.swipeCloseListener = function (ev) {
      var x = ev.srcElement;
      var out = true;
      while (x) {
        if (x === this.rootObj) {
          out = false;
          break;
        }
        x = x.parentNode;
      }
      if (out)
        this.openSwipeMenu(false);
    }.bind(this);
  }
  //
  if (flag) {
    var tx = this.swipingSide === "right" ? -this.swipingWidth : this.swipingWidth;
    this.domObj.style.transform = "translate3d(" + tx + "px,0,0)";
    this.swipeOpen = flag;
    appui.addEventListener("scroll", this.swipeCloseListener, {passive: true, capture: true});
    appui.addEventListener("touchstart", this.swipeCloseListener, {passive: true, capture: true});
    appui.addEventListener("mousedown", this.swipeCloseListener, {passive: true, capture: true});
  }
  else {
    delete this.swipeOpen;
    delete this.swipingWidth;
    delete this.swipingSide;
    //
    this.domObj.style.transform = "translate3d(0,0,0)";
    appui.removeEventListener("scroll", this.swipeCloseListener, {passive: true, capture: true});
    appui.removeEventListener("touchstart", this.swipeCloseListener, {passive: true, capture: true});
    appui.removeEventListener("mousedown", this.swipeCloseListener, {passive: true, capture: true});
    this.swipeTimerId = setTimeout(function () {
      this.resetSwipeMenu();
    }.bind(this), 500);
  }
};


/**
 * Resets everything
 */
Client.IonItem.prototype.resetSwipeMenu = function ()
{
  this.domObj.style.transform = "";
  this.domObj.style.transition = "";
  this.rootObj.classList.remove("active-slide");
  this.rootObj.classList.remove("active-options-right");
  this.rootObj.classList.remove("active-options-left");
  this.rootObj.classList.remove("active-swipe-left");
  this.rootObj.classList.remove("active-swipe-right");
  //
  clearTimeout(this.longPressTimedId);
  delete this.longPressTimedId;
  delete this.swiping;
  delete this.startX;
  delete this.startY;
  delete this.startTime;
  delete this.lastX;
  delete this.tx;
  delete this.swipeDefaultValue;
  delete this.swipeActiveLimit;
  delete this.waitTransition;
};

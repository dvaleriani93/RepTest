/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A view object
 * @param {Object} view - element description
 * @param {Element} parentElement - the parent element
 */
Client.View = function (view, parentElement)
{
  this.id = view.id;
  Client.eleMap[this.id] = this;
  //
  // If there is a parent element use it
  if (parentElement) {
    this.parent = parentElement;
    this.domObj = parentElement.domObj;
  }
  else if (view.options && view.options.mode === "popup") {
    //If it's a popup make the view a Dialog
    this.domObj = document.getElementById("app-ui");
    var el = {name: "dialog", id: this.id + "-modal", class: Client.View.dialogClass, options: view.options};
    this.dialog = this.createElement(el, this, this);
    this.domObj = this.dialog.domObj;
  }
  else
    this.domObj = document.getElementById("app-ui");
  //
  // Create children
  this.elements = [];
  //
  // view is the definition, so no new() call here
  for (var i = 0; i < view.elements.length; i++) {
    // startHidden is a property set on the element definition, only if the element has an enter animation and is
    // visibile that property is handled by the real element by hiding himself so we can later show him and trigger
    // the animation
    if (view.elements[i].child) {
      view.elements[i].child.startHidden = true;
      this.insertBefore(view.elements[i]);
    }
    else {
      view.elements[i].startHidden = true;
      var e = this.createElement(view.elements[i], this, this);
      this.elements.push(e);
    }
  }
  //
  // If it's a popup, position it
  if (this.dialog) {
    this.dialog.positionElement();
    //
    if (view.options?.draggable && this.elements) {
      let dragChild = this.dialog.wrapperObj.querySelector(".modal-drag-area");
      if (!dragChild) {
        dragChild = this.dialog.wrapperObj.querySelector("ion-navbar");
        if (dragChild)
          dragChild.classList.add("modal-drag-area");
      }
      if (!dragChild)
        dragChild = this.elements[0].getRootObject();
      //
      // Last protection: set an id to the object if there isn't
      if (!dragChild.id)
        dragChild.id = "drag-modal-" + this.id;
      //
      this.dragTargetId = dragChild.id;
      //
      let dType = !Client.mainFrame.device.isMobilePreview ? Client.mainFrame.device.type : Client.mainFrame.device.viewportParams.devicetype;
      if (dType !== "smartphone")
        Client.IonHelper.registerPointerEvents(this.dialog.rootObj, null, this, true, "pspmpe");
    }
  }
  //
  // If there are some elements that are hidden because they want a 'creation' animation animate them now by setting their visibility to true
  for (i = 0; i < this.ne(); i++) {
    if (this.elements[i].startHidden) {
      delete this.elements[i].startHidden;
      this.elements[i].updateElement({visible: true});
    }
  }
  //
  if (Client.mainFrame.feedbackEnabled) {
    if (parent && parent.postMessage)
      parent.postMessage({type: "viewChanged", viewId: this.id}, "*");
  }
};


/**
 * Name of the element used to open popups & modals
 */
Client.View.dialogClass = "Dialog";

/**
 * Create an element
 * @param {Object} el - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the element
 */
Client.View.prototype.createElement = function (el, parent, view)
{
  // If the element to create is a view
  if (el.type === "view") {
    // Create it and exit
    return new Client.View(el, parent);
  }
  //
  // Decompressing element properties before creating it
  var k = Object.keys(el);
  for (var i = 0; i < k.length; i++) {
    var p = k[i];
    //
    // Get the complete name of the property to set
    var t = Client.transPropMap[p];
    if (t) {
      // Set the property
      el[t] = el[p];
      //
      // Remove the property with the shortened name
      delete el[p];
    }
    //
    // If setting style
    if (t === "style") {
      // Get the style
      var s = el[t];
      var kk = Object.keys(s);
      for (var j = 0; j < kk.length; j++) {
        var ps = kk[j];
        //
        // Get the complete name of the style property to set
        t = Client.transStyleMap[ps];
        if (t) {
          // Set the property
          s[t] = s[ps];
          //
          // Remove the property with the shortened name
          delete s[ps];
        }
      }
    }
  }
  //
  if (!el.events)
    el.events = [];
  //
  // In Editing check if the class is present, if not throw an exception with the name of the class (for debug purposes)
  if (Client[el.class] === undefined) {
    if (Client.mainFrame.isEditing())
      throw "Class " + el.class + " not found";
    else
      console.error("Class " + el.class + " not found");
  }
  let newEl = new Client[el.class](el, parent, view);
  //
  if (Client.mainFrame.device.fullscreen)
    newEl.handleFullscreen();
  //
  return newEl;
};


/**
 * Close a view
 */
Client.View.prototype.close = function ()
{
  // Already closed
  if (!Client.eleMap[this.id])
    return;
  //
  // Tell my parent
  if (this.parent)
    this.parent.onRemoveChildObject(this);
  //
  if (this.dialog) {
    // If it's a dialog, close it
    // the dialog will re-close the view after a while
    this.dialog.close();
  }
  else {
    // Close all the children
    for (var i = 0; i < this.ne(); i++) {
      this.elements[i].close(true);
    }
    //
    // Remove the view from the elements map
    delete Client.eleMap[this.id];
    //
    // Remove from mainFrame / views
    var i = Client.mainFrame.views.indexOf(this);
    if (i >= 0)
      Client.mainFrame.views.splice(i, 1);
    //
    // reset last*Event source if not in body anymore
    // as we don't want to retain an entire dom structure in memory
    if (Client.mainFrame.lastScrollEvent &&
            !document.body.contains(Client.mainFrame.lastScrollEvent.srcElement))
      Client.mainFrame.lastScrollEvent = undefined;
    //
    if (Client.mainFrame.lastTouchEvent &&
            !document.body.contains(Client.mainFrame.lastTouchEvent.srcElement))
      Client.mainFrame.lastTouchEvent = undefined;
    //
    if (Client.mainFrame.feedbackEnabled) {
      if (parent && parent.postMessage)
        parent.postMessage({type: "viewChanged"}, "*");
    }
  }
};


/**
 * Activate a view
 */
Client.View.prototype.activate = function ()
{
  if (this.activeElement)
    this.activeElement.activate();
};


/**
 * Append a child to the element
 * @param {Element} child - the element to append
 */
Client.View.prototype.appendChild = function (child)
{
  // Create the child element
  var e = this.createElement(child, this, this);
  //
  // Insert the new element in the array of child elements
  this.elements.push(e);
};


/**
 * Insert a child element before another element
 * @param {Object} content - contains the element to insert and the id of the existing element. The new element is inserted before this element
 */
Client.View.prototype.insertBefore = function (content)
{
  // let's see if we can handle requirements
  if (!Client.mainFrame.loadClientRequirements(content.child))
    return;
  //
  var e;
  if (content.child.type === "view") {
    e = new Client.View(content.child, this);
    //
    if (content.id) {
      // the ID of this subview is MY ID as I'm the reference to it.
      delete Client.eleMap[e.id];
      e.id = content.id;
    }
    //
    Client.eleMap[e.id] = e;
  }
  else { // Create the child element
    e = this.createElement(content.child, this, this);
  }
  //
  // Search the existing element indicated in the content parameter
  for (var i = 0; i < this.ne(); i++) {
    var el = this.elements[i];
    if (el.id === content.sib) {
      // Insert the child in the rigth position in the elements array
      this.elements.splice(i, 0, e);
      //
      // Insert the child in the rigth position in the document
      var sibling = this.domObj.childNodes.item(i);
      this.domObj.insertBefore(e.domObj, sibling);
      break;
    }
  }
  //
  // If I can't insert the child before any element, append it
  if (i >= this.ne())
    this.elements.push(e);
};

/**
 * Remove a child from the view
 * @param {String} childid - id of the element to remove
 */
Client.View.prototype.removeChild = function (childid)
{
  // Search the element to remove in the child elements of the view
  for (var i = 0; i < this.ne(); i++) {
    // If I found the element to remove
    if (this.elements[i].id === childid)
    {
      // Close the element
      this.elements[i].close(true);
      //
      // Remove the element from the array of child elements
      this.elements.splice(i, 1);
      break;
    }
  }
};


/**
 * Find the element to activate
 * @param {String} key - activation key
 * @param {Object} checkedElems - elements already checked
 * @returns {Client.Element|undefined}
 */
Client.View.prototype.findElementToActivate = function (key, checkedElems)
{
  if (!checkedElems)
    checkedElems = {};
  //
  checkedElems[this.id] = true;
  //
  // Check if the active element of the current view is the element to activate
  var elemToAct;
  if (this.activeElement && this.activeElement.cmdKey === key) {
    // If the active element should be activated but it's not visible or not enabled, don't activate it
    if (this.activeElement.visible === false || this.activeElement.enabled === false)
      return;
    //
    elemToAct = this.activeElement;
  }
  //
  // If the view active element is not the element to activate
  if (!elemToAct) {
    // The active element was already checked
    if (this.activeElement)
      checkedElems[this.activeElement.id] = true;
    //
    // Check the other elements of the view
    for (var i = 0; i < this.ne(); i++) {
      elemToAct = this.elements[i].findElementToActivate(key, checkedElems);
      if (elemToAct)
        break;
    }
  }
  //
  // Search in the parent's children
  if (!elemToAct) {
    var p = this.parent;
    if (p) {
      var f = p.view ? p.view : p;
      while (f && checkedElems[f.id]) {
        f = f.parent;
        if (f && f.view)
          f = f.view;
      }
      if (f)
        elemToAct = f.findElementToActivate(key, checkedElems);
    }
  }
  //
  return elemToAct;
};


/**
 * Set the active element
 * @param {Client.Element} el - the active element
 */
Client.View.prototype.setActiveElement = function (el)
{
  this.activeElement = el;
};


/**
 * onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.View.prototype.onResize = function (ev)
{
  for (var i = 0; i < this.ne(); i++) {
    this.elements[i].onResize(ev);
  }
};


/**
 * Append a child DOM Object to this view DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.View.prototype.appendChildObject = function (child, domObj)
{
  if (this.parent && this.parent.appendChildObject)
    this.parent.appendChildObject(child, domObj);
  else
    this.domObj.appendChild(domObj);
};


/**
 * One of my children element has been removed
 * @param {Element} child
 */
Client.View.prototype.onRemoveChildObject = function (child)
{
};


/**
 * @returns {integen} children count
 */
Client.View.prototype.ne = function ()
{
  return this.elements.length;
};


/**
 * Return any elements
 * @param {object} type
 * @returns {array} any elements that match criteria
 */
Client.View.prototype.getElements = function (type)
{
  var ar = [];
  if (!type || this instanceof type)
    ar.push(this);
  if (this.elements) {
    for (var i = 0; i < this.elements.length; i++) {
      var a = this.elements[i].getElements(type);
      for (var j = 0; j < a.length; j++)
        ar.push(a[j]);
    }
  }
  return ar;
};


/**
 * Return the dom root object of this view
 * @returns {DomElement}
 */
Client.View.prototype.getRootObject = function ()
{
  return this.elements && this.elements[0] ? this.elements[0].getRootObject() : undefined;
};


/**
 * @returns {Client.View} the main view (for a subview returns the parent view into wich is created)
 */
Client.View.prototype.getRootView = function ()
{
  if (!this.parent || !this.parent.view || this.parent.view === this)
    return this;
  else
    return this.parent.view.getRootView();
};


/**
 * Tell to the children that the visibility has changed
 * @param {Boolean} visible
 */
Client.View.prototype.visibilityChanged = function (visible)
{
  if (!this.elements)
    return;
  //
  for (var i = 0; i < this.elements.length; i++)
    this.elements[i].visibilityChanged(visible);
};


/**
 * Called by a child with autoFocus; the first time respond 'true', otherwise respond false
 */
Client.View.prototype.canAutoFocus = function ()
{
  if (!Client.mainFrame.device.isMobile && !this.alreadyAutoFocused) {
    this.alreadyAutoFocused = true;
    return true;
  }
  //
  return false;
};


/**
 * touchstart, mousedown event listener
 * @param {event} ev
 */
Client.View.prototype.pointerStart = function (ev)
{
  // Start the operation only when clicking on the navbar
  let target = ev.target;
  if (!Client.Utils.isMyParent(target,this.dragTargetId))
    return;
  //
  this.startY = (ev.touches ? ev.touches[0].screenY : ev.screenY);
  this.startX = (ev.touches ? ev.touches[0].screenX : ev.screenX);
  this.startRect = this.dialog.wrapperObj.getBoundingClientRect();
  //
  return true;
};


/**
 * touchmove, mousemove event listener
 * @param {event} ev
 */
Client.View.prototype.pointerMove = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  if (Client.mainFrame.isClickPrevented()) {
    delete this.startX;
    delete this.startY;
    delete this.startRect;
    return;
  }
  //
  let currentY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  let currentX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  let dy = currentY - this.startY;
  let dx = currentX - this.startX;
  //
  this.dialog.wrapperObj.style.top = (this.startRect.top + dy) + "px"
  this.dialog.wrapperObj.style.left = (this.startRect.left + dx) + "px"
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.View.prototype.pointerEnd = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  // Send the event
  let endRect = this.dialog.wrapperObj.getBoundingClientRect();
  Client.mainFrame.sendEvents([{obj: this.id, id: "onResize", content: { left: endRect.left, top: endRect.top }}]);
  //
  delete this.startX;
  delete this.startY;
  delete this.startRect;
};


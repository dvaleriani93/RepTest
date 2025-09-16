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
Client.IonSplitPane = function (element, parent, view)
{
  element.tag = "ion-split-pane";
  this.minWidth = 768;
  this.resCB = this.checkWidth.bind(this);
  Client.Container.call(this, element, parent, view);
  //
  // Push a check first time. 125ms is enough to calm DOM down
  setTimeout(this.resCB, 125);
};

Client.IonSplitPane.prototype = new Client.Container();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonSplitPane.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null;
  //
  if (el.exposed !== undefined) {
    this.exposed = el.exposed;
    this.domObj.classList.toggle("split-pane-visible", this.exposed);
    //
    if (this.ne()) {
      var side = this.elements[0];
      side.getRootObject().style.maxWidth = this.sidePaneMaxWidth && this.exposed ? this.sidePaneMaxWidth + "px" : "";
      var a = side.animate;
      side.animate = false;
      if (side.setVisible)
        side.setVisible(this.exposed, true);
      else
        side.updateElement({visible: this.exposed});
      side.animate = a;
    }
    delete el.exposed;
  }
  if (el.sidePaneMaxWidth !== undefined) {
    this.sidePaneMaxWidth = el.sidePaneMaxWidth;
    delete el.sidePaneMaxWidth;
    if (this.exposed) {
      setTimeout(function () {
        if (this.ne() && this.exposed)
          this.elements[0].getRootObject().style.maxWidth = this.sidePaneMaxWidth + "px";
      }.bind(this), 0);
    }
  }
  //
  if (el.when) {
    if (isNaN(parseInt(el.when))) {
      switch (el.when) {
        case "xs":
          this.minWidth = 0;
          break;
        case "sm":
          this.minWidth = 576;
          break;
        case "md":
          this.minWidth = 768;
          break;
        case "lg":
          this.minWidth = 992;
          break;
        case "xl":
          this.minWidth = 1200;
          break;
        case "never":
          this.minWidth = 9999;
          break;
      }
    }
    else {
      this.minWidth = parseInt(el.when);
    }
    this.checkWidth();
    delete el.when;
  }
  //
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "split-pane-" + Client.Ionic.platform;
    //
    if (this.exposed)
      cs += " split-pane-visible";
    //
    if (this.className)
      cs += " " + this.className;
    //
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
Client.IonSplitPane.prototype.appendChildObject = function (child, domObj)
{
  // First child is the side element, the second one is the main one
  if (!this.elements.length)
    domObj.classList.add("split-pane-side");
  else
    domObj.classList.add("split-pane-main");
  this.domObj.appendChild(domObj);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonSplitPane.prototype.attachEvents = function (events)
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
  //
  window.addEventListener('resize', this.resCB, false);
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of removing
 */
Client.IonSplitPane.prototype.close = function (firstLevel, triggerAnimation)
{
  Client.Container.prototype.close.call(this, firstLevel, triggerAnimation);
  window.removeEventListener('resize', this.resCB, false);
};


/**
 * Check if side pane should be visible
 */
Client.IonSplitPane.prototype.checkWidth = function ()
{
  var appui = document.getElementById("app-ui");
  var exp = appui.clientWidth > this.minWidth;
  if (exp !== this.exposed) {
    this.updateElement({exposed: exp});
    var x = [{obj: this.id, id: "chgProp", content: {name: "exposed", value: this.exposed, clid: Client.id}}];
    if (this.sendOnChange)
      x.push({obj: this.id, id: "onChange"});
    Client.mainFrame.sendEvents(x);
  }
};


/**
 * Check for exposition
 * @param {string} cbId - callback id
 */
Client.IonSplitPane.prototype.isExposed = function (cbId)
{
  this.checkWidth();
  var e = [{obj: this.id, id: "cb", content: {res: this.exposed, cbId: cbId}}];
  Client.mainFrame.sendEvents(e);
};

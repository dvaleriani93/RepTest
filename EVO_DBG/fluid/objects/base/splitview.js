/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container that used to model iPad splitview
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the container
 * @extends Client.Element
 */
Client.SplitView = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  if (element === undefined)
    return;
  //
  this.domObj = document.createElement("div");
  this.domObj.className = "splitview-backpanel";
  this.leftWidth = "300px";
  this.leftVisibility = "auto";
  //
  this.leftPanel = document.createElement("div");
  this.leftPanel.className = "splitview-leftpanel";
  //
  this.rightPanel = document.createElement("div");
  this.rightPanel.className = "splitview-rightpanel";
  //
  var pthis = this;
  if (Client.mainFrame.isEditing()) {

    this.clickcount = 0;
    this.rightPanel.ondblclick = function () {
      pthis.clickcount++;
      pthis.showLeftPanel(pthis.clickcount % 2 === 1);
    };
  }
  else {
    this.rightPanel.onclick = function () {
      if (((pthis.leftVisibility === "auto" && pthis.portrait) || pthis.leftVisibility === "never") && !pthis.leftPanel.style.display)
        pthis.showLeftPanel(false);
    };
  }
  //
  this.domObj.appendChild(this.leftPanel);
  this.domObj.appendChild(this.rightPanel);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  parent.appendChildObject(this, this.domObj);
  //
  // Create children after attaching element as external components often rely on dom structure
  this.createChildren(element);
  //
  this.adaptLayout();
};


// Make Client.AltContainer extend Client.Container
Client.SplitView.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.SplitView.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  if (el.leftWidth) {
    this.leftWidth = el.leftWidth;
    this.prepareLayout();
    delete el.leftWidth;
  }
  //
  if (el.leftVisibility) {
    this.leftVisibility = el.leftVisibility;
    this.prepareLayout();
    delete el.leftVisibility;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.SplitView.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onOrientationChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendOrientation = true;
  }
  //
  pos = events.indexOf("onVisibilityChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendVisibility = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.SplitView.prototype.appendChildObject = function (child, domObj)
{
  if (this.elements && this.elements.length === 0)
    this.leftPanel.appendChild(domObj);
  else
    this.rightPanel.appendChild(domObj);
};


/**
 * onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.SplitView.prototype.onResize = function (ev)
{
  this.adaptLayout();
  Client.Element.prototype.onResize.call(this, ev);
};


/**
 * adapt layout basing of screen orientation / delayed call
 */
Client.SplitView.prototype.prepareLayout = function ()
{
  var pthis = this;
  if (!this.layoutTimer) {
    this.layoutTimer = window.setTimeout(function () {
      pthis.layoutTimer = 0;
      pthis.adaptLayout();
    }, 0);
  }
};


/**
 * Adapt layout basing of screen orientation
 * @param {bool} leftVisible - if true request left panel to be visible
 */
Client.SplitView.prototype.adaptLayout = function (leftVisible)
{
  var appui = document.getElementById("app-ui");
  this._portrait = this.portrait;
  this.portrait = (appui.clientWidth < appui.clientHeight);
  //
  var override = false;
  var e;
  //
  // If the left panel is not forced to be visible or hidden, let's see if it should
  if (leftVisible === undefined) {
    //
    var forceVisible = this._portrait === undefined && this.portrait &&
            (this.leftVisibility === "device" || this.leftVisibility === "auto");
    //
    // The "device" value for the leftVisibility property is changed to "auto", "always" or "never"
    // depending on the device type of the client. This is done the first time here
    if (this.leftVisibility === "device") {
      this.leftVisibility = "auto";
      switch (Client.mainFrame.device.type) {
        case "desktop":
          this.leftVisibility = "always";
          break;
        case "smartphone":
          this.leftVisibility = "never";
          break;
      }
      //
      // Send property change to server
      e = [{obj: this.id, id: "chgProp", content: {name: "leftVisibility", value: this.leftVisibility, clid: Client.id}}];
      Client.mainFrame.sendEvents(e);
    }
    //
    // Let's see if the left panel should be visible in the current conditions
    switch (this.leftVisibility) {
      case "auto":
        leftVisible = !this.portrait;
        break;
      case "never":
        leftVisible = false;
        break;
      case "always":
        leftVisible = true;
        break;
    }
    //
    if (forceVisible) {
      leftVisible = true;
      if (!this._leftWidth)
        this._leftWidth = this.leftWidth;
    }
  }
  else {
    // Here we have a request for the left panel to be visible.
    // Even in this case there is a chance to ovveride the request
    if (((this.leftVisibility === "auto" && this.portrait) || this.leftVisibility === "never") && leftVisible) {
      override = true;
      if (!this._leftWidth)
        this._leftWidth = this.leftWidth;
    }
  }
  //
  // Adapting splitview layout
  var w = override ? this._leftWidth : this.leftWidth;
  //
  if (!override) {
    this.rightPanel.style.marginLeft = leftVisible ? w : "";
    this.rightPanel.style.width = leftVisible ? "calc(100% - " + w + ")" : "100%";
  }
  //
  this.leftPanel.style.display = leftVisible ? "" : "none";
  this.leftPanel.style.width = w;
  //
  if (this.leftVisibility === "auto" && !this.portrait && leftVisible)
    this._leftWidth = this.leftPanel.clientWidth + "px";
  //
  if (this.portrait !== this._portrait) {
    e = [{obj: this.id, id: "chgProp", content: {name: "portrait", value: this.portrait, clid: Client.id}}];
    if (this.sendOrientation) {
      var x = {};
      x.width = this.domObj.clientWidth;
      x.height = this.domObj.clientHeight;
      e.push({obj: this.id, id: "onOrientationChange", content: x});
    }
    Client.mainFrame.sendEvents(e);
  }
  //
  if (leftVisible !== this._leftVisible) {
    if (this.sendVisibility)
      Client.mainFrame.sendEvents([{obj: this.id, id: "onVisibilityChange", content: {visible: leftVisible}}]);
    this._leftVisible = leftVisible;
  }
  //
  if (this.layoutTimer) {
    window.clearTimeout(this.layoutTimer);
    this.layoutTimer = 0;
  }
};


/**
 * show of hide left panel
 * @param {Bool} status
 */
Client.SplitView.prototype.showLeftPanel = function (status)
{
  this.adaptLayout(status);
  if (status)
    Client.Element.prototype.onResize.call(this);
};

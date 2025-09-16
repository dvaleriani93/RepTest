/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */


/**
 * @class A container for a search bar
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonSearchbar = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-searchbar");
  //
  this.cntObj = document.createElement("div");
  this.cntObj.className = "searchbar-input-container";
  this.domObj.appendChild(this.cntObj);
  //
  this.cancelObj = document.createElement("button");
  this.cancelObj.className = "searchbar-" + Client.Ionic.platform + "-cancel disable-hover button button-clear";
  this.cancelTextObj = document.createElement("span");
  this.cancelTextObj.className = "button-inner";
  this.cancelObj.appendChild(this.cancelTextObj);
  //
  if (Client.Ionic.platform === "ios") {
    this.cancelTextObj.textContent = "Cancel";
    this.domObj.appendChild(this.cancelObj);
  }
  else {
    this.cancelObj.classList.add("button-clear-dark");
    this.cancelIcon = document.createElement("ion-icon");
    Client.IonHelper.setIonIcon("arrow-back", this.cancelIcon);
    this.cancelTextObj.appendChild(this.cancelIcon);
    this.cntObj.appendChild(this.cancelObj);
  }
  //
  this.searchIcon = document.createElement("div");
  this.searchIcon.className = "searchbar-search-icon";
  this.cntObj.appendChild(this.searchIcon);
  //
  this.inputObj = document.createElement("input");
  this.inputObj.type = "text";
  this.inputObj.className = "searchbar-input";
  this.inputObj.placeholder = "Search";
  this.cntObj.appendChild(this.inputObj);
  //
  this.clearObj = document.createElement("button");
  this.clearObj.className = "searchbar-clear-icon disable-hover button button-clear";
  this.cntObj.appendChild(this.clearObj);
  //
  this.addEventsListeners();
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  this.positionElements();
  //
  parent.appendChildObject(this, this.domObj);
};

Client.IonSearchbar.prototype = new Client.Element();

Client.IonSearchbar.needsFullscreenPadding = true;

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonSearchbar.prototype.updateElement = function (el)
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
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, undefined);
    delete el.color;
  }
  if (el.placeholder !== undefined) {
    this.inputObj.placeholder = el.placeholder;
    this.positionElements();
    delete el.placeholder;
  }
  if (el.clearOnFocus !== undefined) {
    this.clearOnFocus = el.clearOnFocus;
    delete el.clearOnFocus;
  }
  if (el.preventClick !== undefined) {
    this.preventClick = el.preventClick;
    delete el.preventClick;
  }
  if (el.disabled !== undefined) {
    if (el.disabled)
      this.inputObj.setAttribute("disabled", "true");
    else
      this.inputObj.removeAttribute("disabled");
    delete el.disabled;
  }
  if (el.value !== undefined) {
    this.inputObj.value = el.value;
    this.domObj.classList.toggle("searchbar-has-value", el.value + "");
    this.positionElements();
    delete el.value;
  }
  if (el.cancelText !== undefined) {
    if (Client.Ionic.platform === "ios")
      this.cancelTextObj.textContent = el.cancelText;
    delete el.cancelText;
  }
  if (el.showCancel !== undefined) {
    this.showCancel = el.showCancel;
    update = true;
    delete el.showCancel;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = (this.showCancel ? "searchbar-show-cancel " : "") + "searchbar-active";
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * Position internal element
 */
Client.IonSearchbar.prototype.positionElements = function ()
{
  if (Client.Ionic.platform !== "ios")
    return;
  //
  // Position the input placeholder & search icon
  this.positionInputPlaceholder(this.inputObj, this.searchIcon);
  // Position the cancel button
  this.positionCancelButton(this.cancelObj);
  // Add or remove class
  this.domObj.classList.toggle("searchbar-left-aligned", this.shouldAlignLeft());
};

/**
 * @private
 * Calculates the amount of padding/margin left for the elements
 * in order to center them based on the placeholder width
 */
Client.IonSearchbar.prototype.positionInputPlaceholder = function (inputEle, iconEle)
{
  if (this.shouldAlignLeft()) {
    inputEle.removeAttribute("style");
    iconEle.removeAttribute("style");
  }
  else {
    // Create a dummy span to get the placeholder width
    var tempSpan = document.createElement('span');
    tempSpan.innerHTML = this.inputObj.placeholder;
    document.body.appendChild(tempSpan);
    //
    // Get the width of the span then remove it
    var textWidth = tempSpan.offsetWidth;
    tempSpan.remove();
    //
    // Set the input padding left
    var inputLeft = "calc(50% - " + (textWidth / 2) + "px)";
    inputEle.style.paddingLeft = inputLeft;
    //
    // Set the icon margin left
    var iconLeft = "calc(50% - " + ((textWidth / 2) + 30) + "px)";
    iconEle.style.marginLeft = iconLeft;
  }
};

/**
 * @private
 * Show the iOS Cancel button on focus, hide it offscreen otherwise
 */
Client.IonSearchbar.prototype.positionCancelButton = function (cancelButtonEle)
{
  if (cancelButtonEle.offsetWidth > 0) {
    if (this.domObj.classList.contains("searchbar-has-focus")) {
      cancelButtonEle.style.marginRight = "0";
    }
    else {
      cancelButtonEle.style.marginRight = -cancelButtonEle.offsetWidth + "px";
    }
  }
};

/**
 * @private
 * Align the input placeholder left on focus or if a value exists
 */
Client.IonSearchbar.prototype.shouldAlignLeft = function ()
{
  return (this.inputObj.value || this.domObj.classList.contains("searchbar-has-focus"));
};


/**
 * Add events listeners
 */
Client.IonSearchbar.prototype.addEventsListeners = function ()
{
  this.cancelObj.onmousedown = (ev) => {
    this.clearValue(ev);
    Client.mainFrame.sendEvents([{obj: this.id, id: "onCancel", content: this.saveEvent(ev)}]);
  };
  //
  this.cancelObj.ontouchstart = (ev) => {
    this.clearValue(ev);
    Client.mainFrame.sendEvents([{obj: this.id, id: "onCancel", content: this.saveEvent(ev)}]);
  };
  //
  this.inputObj.onkeydown = (ev) => {
    if (ev.which === 9 && this.handleCustomNavigation())
      ev.preventDefault();
  };
  //
  this.inputObj.onkeyup = (ev) => {
    if (ev.which === 13 || ev.which === 9) {
      if (this.handleCustomNavigation()) {
        this.inputObj.blur();
        Client.IonHelper.focusNextInput(this.view, this.inputObj, (ev.which === 9 && ev.shiftKey));
      }
      else if (ev.which === 13)
        this.inputObj.blur();
    }
  };
  //
  this.inputObj.addEventListener("focus", (ev) => {
    this.domObj.classList.add("searchbar-has-focus");
    //
    if (this.clearOnFocus)
      this.clearValue(ev, true, true);
    //
    this.positionElements();
    //
    // lock generic ui click if required
    if (this.preventClick)
      Client.mainFrame.preventClick(24 * 60 * 60 * 1000);
  });
  //
  this.inputObj.addEventListener("blur", (ev) => {
    this.domObj.classList.remove("searchbar-has-focus");
    this.positionElements();
    //
    // unlock generic ui click if required
    if (this.preventClick)
      Client.mainFrame.preventClick();
  });
  //
  this.inputObj.addEventListener("input", (ev) => {
    if (this.inputObj.value)
      this.domObj.classList.add("searchbar-has-value");
    else
      this.domObj.classList.remove("searchbar-has-value");
    this.positionElements();
  });
  //
  this.clearObj.addEventListener("mousedown", (ev) => {
    this.skipBlur = new Date();
    this.clearValue(ev, true);
    Client.mainFrame.sendEvents([{obj: this.id, id: "onClear", content: this.saveEvent(ev)}]);
    ev.stopPropagation();
    return false;
  }, true);
  //
  this.clearObj.addEventListener("touchstart", (ev) => {
    this.skipBlur = new Date();
    this.clearValue(ev, true);
    Client.mainFrame.sendEvents([{obj: this.id, id: "onClear", content: this.saveEvent(ev)}]);
    ev.stopPropagation();
    return false;
  }, true);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonSearchbar.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onChange");
  if (pos >= 0) {
    this.sendOnChange = true;
    events.splice(pos, 1);
    this.inputObj.addEventListener("change", (function (ev) {
      var e = [{obj: this.id, id: "chgProp", content: {name: "value", value: this.inputObj.value, clid: Client.id}}];
      e.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    }).bind(this));
  }
  //
  pos = events.indexOf("onInput");
  if (pos >= 0) {
    this.sendOnInput = true;
    events.splice(pos, 1);
    this.inputObj.addEventListener("input", (function (ev) {
      var e = [{obj: this.id, id: "chgProp", content: {name: "value", value: this.inputObj.value, clid: Client.id}}];
      e.push({obj: this.id, id: "onInput", content: this.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    }).bind(this));
  }
  //
  pos = events.indexOf("onFocus");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.inputObj.addEventListener("focus", (function (ev) {
      if (new Date() - this.skipBlur < 200)
        return;
      //
      var e = [];
      e.push({obj: this.id, id: "onFocus", content: this.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    }).bind(this));
  }
  //
  pos = events.indexOf("onBlur");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.inputObj.addEventListener("blur", (function (ev) {
      if (new Date() - this.skipBlur < 200)
        return;
      //
      var e = [];
      e.push({obj: this.id, id: "onBlur", content: this.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    }).bind(this));
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Clear value
 */
Client.IonSearchbar.prototype.clearValue = function (ev, refocus, force)
{
  if (refocus && !force) {
    this.inputObj.focus();
    setTimeout(function () {
      this.inputObj.focus();
    }.bind(this), 50);
  }
  //
  var ev = this.saveEvent(ev ? ev : {});
  if (document.activeElement === this.inputObj)
    ev.hasFocus = true;
  //
  if (this.inputObj.value || force) {
    this.updateElement({value: ""});
    var e = [{obj: this.id, id: "chgProp", content: {name: "value", value: this.inputObj.value, clid: Client.id}}];
    if (this.sendOnInput)
      e.push({obj: this.id, id: "onInput", content: ev});
    if (this.sendOnChange) {
      if (refocus)
        ev.clear = true;
      //
      e.push({obj: this.id, id: "onChange", content: ev});

    }
    Client.mainFrame.sendEvents(e);
  }
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A swipe menu element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonSwipe = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-item-options");
  this.side = "right";
  this.visible = true;
  this.autoClose = true;
  this.longPress = (Client.Ionic.platform === "md");
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonSwipe.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonSwipe.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  if (el.side !== undefined) {
    this.side = el.side;
    this.domObj.setAttribute("side", this.side);
    delete el.side;
  }
  //
  if (el.visible !== undefined) {
    this.visible = el.visible;
  }
  //
  if (el.autoClose !== undefined) {
    this.autoClose = el.autoClose;
    delete el.autoClose;
  }
  //
  if (el.longPress !== undefined) {
    this.longPress = el.longPress;
    delete el.longPress;
  }
  //
  if (el.iconPosition !== undefined) {
    this.iconPosition = el.iconPosition;
    if (this.iconPosition === "left")
      this.domObj.setAttribute("icon-left", "");
    else
      this.domObj.removeAttribute("icon-left");
    delete el.iconPosition;
  }
  //
  if (el.commands) {
    //
    // If el.list is a string make it a json object
    if (typeof el.commands === "string")
      el.commands = JSON.parse(el.commands);
    //
    // Remove element children
    this.options = el.commands;
    //
    // Remove previous options
    delete this.swipeWidth;
    while (this.domObj.firstChild)
      this.domObj.removeChild(this.domObj.firstChild);
    //
    // Base class must not use the list property
    delete el.commands;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonSwipe.prototype.attachEvents = function (events)
{
  // Add the onSwipeSelected event, if needed
  if (events) {
    var idx = events.indexOf("onSwipeSelected");
    if (idx > -1) {
      events.splice(idx, 1);
      this.sendSelected = true;
    }
  }
};


/**
 * Calculate the width of this swipe menu
 */
Client.IonSwipe.prototype.calcSwipeWidth = function ()
{
  // Create button now
  if (this.swipeWidth === undefined) {
    //
    // Create the menu items
    this.swipeWidth = 0;
    delete this.defaultValue;
    for (var i = 0; i < this.options.length; i++) {
      var smitem = this.options[i];
      //
      // Extract command properties
      var icon = smitem.src || smitem.img || smitem.icon;
      var label = smitem.n || smitem.name || smitem.label;
      var code = smitem.v || smitem.code || smitem.cmd;
      var style = smitem.s || smitem.style || smitem.class || smitem.cls || smitem.className || "";
      //
      var item = document.createElement("button");
      item.value = code;
      item.className = "disable-hover button button-icon-left" + (this.iconPosition === "only" ? " button-icon-only" : "");
      Client.IonHelper.registerClickListener(this, item);
      //
      var spanObj = document.createElement("span");
      spanObj.className = "button-inner";
      item.appendChild(spanObj);
      //
      if (icon) {
        var iconObj = document.createElement("ion-icon");
        spanObj.appendChild(iconObj);
        Client.IonHelper.setIonIcon(icon, iconObj);
      }
      //
      if (label && this.iconPosition !== "only") {
        var labelObj = document.createTextNode(label);
        spanObj.appendChild(labelObj);
      }
      //
      //
      // Add style / class
      if (typeof style === "object") {
        for (var s in style)
          item.style[s] = style[s];
      }
      else if (typeof style === "string") {
        if (style.indexOf(":") > 0)
          item.style.cssText = style;
        else {
          var cl = style.split(" ");
          for (var j = 0; j < cl.length; j++) {
            var s = cl[j];
            switch (s) {
              case "primary":
              case "secondary":
              case "danger":
              case "light":
              case "dark":
              case "bright":
              case "vibrant":
                s = "button-" + s;
                break;

              case "default":
                s = "button-expandable";
                this.defaultValue = true;
                break;
            }
            //
            if (s)
              item.classList.add(s);
          }
        }
      }
      //
      this.domObj.appendChild(item);
      this.swipeWidth += item.offsetWidth;
    }
  }
  //
  return this.swipeWidth;
};


/**
 * An element was clicked
 * @param {event} ev
 */
Client.IonSwipe.prototype.myClick = function (ev)
{
  if (this.sendSelected) {
    //
    if (ev.default) {
      ev.target = this.domObj.getElementsByClassName("button-expandable")[0];
    }
    //
    var obj = ev.target;
    while (obj && !obj.value) {
      obj = obj.parentNode;
    }
    var v = obj ? obj.value : undefined;
    //
    var e = [{obj: this.id, id: "onSwipeSelected", content: v}];
    Client.mainFrame.sendEvents(e);
  }
  //
  if (this.autoClose)
    this.parent.openSwipeMenu(false);
};


/**
 * open or close this swipe menu
 * @param {bool} flag
 */
Client.IonSwipe.prototype.show = function (flag)
{
  if (Client.IonItem && this.parent instanceof Client.IonItem) {
    if (!flag) {
      this.parent.openSwipeMenu(false);
    }
    else {
      if (!this.parent.swipeOpen)
        this.parent.openSwipeMenu(true, this.side);
    }
  }
};

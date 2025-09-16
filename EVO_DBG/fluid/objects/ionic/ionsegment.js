/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for a segmented button
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonSegment = function (element, parent, view)
{
  element.tag = "ion-segment";
  Client.Container.call(this, element, parent, view);
};

Client.IonSegment.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonSegment.prototype.updateElement = function (el)
{
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, undefined);
    delete el.color;
  }
  if (el.value !== undefined) {
    setTimeout(function () {
      var ar = this.getElements(Client.IonSegmentButton);
      for (var i = 0; i < ar.length; i++) {
        if (ar[i].domObj.value === this.value)
          ar[i].domObj.classList.add("segment-activated");
        else
          ar[i].domObj.classList.remove("segment-activated");
      }
    }.bind(this), 0);
    //
    this.value = el.value;
    delete el.value;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
};

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonSegment.prototype.attachEvents = function (events)
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
 * @class A container for a radio button
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonSegmentButton = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-segment-button");
  //
  Client.IonHelper.registerClickListener(this);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonSegmentButton.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonSegmentButton.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null;
  //
  // specific class name
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  if (el.label !== undefined) {
    if (!this.labelObj && el.label) {
      this.labelObj = document.createElement("span");
      this.domObj.appendChild(this.labelObj);
    }
    this.labelObj.textContent = el.label;
    if (this.iconObj)
      this.iconObj.classList.toggle("with-label", !!el.label);
    delete el.label;
  }
  //
  if (el.disabled !== undefined) {
    this.enabled = !el.disabled;
    update = true;
    delete el.disabled;
  }
  //
  // If there is an activation key remember it
  if (el.cmdKey) {
    this.cmdKey = el.cmdKey.toUpperCase();
    //
    // Base class must not use the cmdKey property
    delete el.cmdKey;
  }
  //
  if (el.icon !== undefined) {
    if (!this.iconObj && el.icon) {
      this.iconObj = document.createElement("ion-icon");
      this.domObj.insertBefore(this.iconObj, this.labelObj);
    }
    if (!el.icon && this.iconObj) {
      this.domObj.removeChild(this.iconObj);
      this.iconObj = undefined;
    }
    if (el.icon && this.iconObj) {
      Client.IonHelper.setIonIcon(el.icon, this.iconObj);
    }
    if (this.iconObj && this.labelObj && this.labelObj.textContent)
      this.iconObj.classList.add("with-label");
    delete el.icon;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "segment-button";
    //
    if (this.enabled === false) {
      cs += " segment-button-disabled";
    }
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};

/**
 * Checkbox clicked!
 * @param {Object} ev - event
 */
Client.IonSegmentButton.prototype.myClick = function (ev)
{
  if (this.parent.value !== this.domObj.value) {
    var x = [{obj: this.parent.id, id: "chgProp", content: {name: "value", value: this.domObj.value, clid: Client.id}}];
    if (this.parent.sendOnChange)
      x.push({obj: this.parent.id, id: "onChange"});
    Client.mainFrame.sendEvents(x);
  }
};

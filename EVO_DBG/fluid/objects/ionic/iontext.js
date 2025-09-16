/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for a toolbar title
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonTitle = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-title");
  //
  this.innerTitle = document.createElement("div");
  this.innerTitle.className = "toolbar-title";
  this.domObj.appendChild(this.innerTitle);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonTitle.prototype = new Client.Container();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonTitle.prototype.updateElement = function (el)
{
  // specific class name
  if (el.innerText !== undefined) {
    this.innerTitle.textContent = el.innerText;
    //
    if (this.largeTitle)
      this.largeTitle.textContent = el.innerText;
    //
    delete el.innerText;
  }
  //
  if (el.innerHTML !== undefined) {
    this.innerTitle.innerHTML = el.innerHTML;
    //
    if (this.largeTitle)
      this.largeTitle.innerHTML = el.innerHTML;
    //
    delete el.innerHTML;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * @class A container for a item label title
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonLabel = function (element, parent, view)
{
  element.tag = "ion-label";
  Client.Container.call(this, element, parent, view);
};

Client.IonLabel.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonLabel.prototype.updateElement = function (el)
{
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, "");
    delete el.color;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
};


/**
 * @class A list item note element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonNote = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-note");
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonNote.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonNote.prototype.updateElement = function (el)
{
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * @class An ionic badge element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonBadge = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-badge");
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonBadge.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonBadge.prototype.updateElement = function (el)
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
    this.color = el.color;
    update = true;
    delete el.color;
  }
  //
  // iOS does not refresh badge if the previous value was empty
  if (el.innerText !== undefined) {
    var old = this.domObj.textContent;
    this.domObj.textContent = el.innerText;
    if (!old) {
      this.domObj.className = "";
      update = true;
    }
    delete el.innerText;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  if (update) {
    var cs = "";
    if (this.color)
      cs += "badge-" + this.color;
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * @class An ionic text element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonText = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement(element.type || "p");
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonText.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonText.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null;
  //
  if (el.type !== undefined) {
    this.changeTag(el.type);
    delete el.type;
  }
  if (el.textColor !== undefined) {
    this.textColor = el.textColor;
    update = true;
    delete el.textColor;
  }
  if (el.backColor !== undefined) {
    this.backColor = el.backColor;
    update = true;
    delete el.backColor;
  }
  if (el.alignment !== undefined) {
    this.alignment = el.alignment;
    update = true;
    delete el.alignment;
  }
  //
  // specific class name
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  if (update) {
    var cs = "";
    if (this.textColor)
      cs += "text-" + this.textColor;
    if (this.backColor)
      cs += " back-" + this.backColor;
    if (this.alignment)
      cs += " text-" + this.alignment;
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Set custom error message
 * @param {String} message - the error message
 * @param {bool} srv
 */
Client.IonText.prototype.setError = function (message, srv)
{
  Client.Element.prototype.setError.call(this, message, srv);
  this.addTooltip(message);
};




/* global Client */

/**
 * @class A container for a toolbar title
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonIcon = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-icon");
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonIcon.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonIcon.prototype.updateElement = function (el)
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
  if (el.icon !== undefined) {
    this.icon = el.icon;
    update = true;
    delete el.icon;
  }
  //
  if (el.active !== undefined) {
    this.active = el.active;
    update = true;
    delete el.active;
  }
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, "");
    delete el.color;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "";
    if (this.parent instanceof Client.IonItem)
      cs += " item-icon";
    if (this.icon && this.icon.substring(0,4) !== "svg_")
      cs += " " + Client.IonHelper.getIconClass(this.icon + (this.active === false ? "-outline" : ""));
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
    //
    if (this.icon && Client.mainFrame.theme.ionIcons === "5") {
      Client.IonHelper.setIonIcon(this.icon + (this.active === false ? "-outline" : ""), this.domObj);
      //
      if (this.domObj.firstChild) {
        var w = this.domObj.style.fontSize ? this.domObj.style.fontSize : this.domObj.style.width;
        var h = this.domObj.style.fontSize ? this.domObj.style.fontSize : this.domObj.style.height;
        this.domObj.firstChild.style.width = w;
        this.domObj.firstChild.style.height = h;
      }
    }
  }
};


/**
 * @class A container for a toolbar title
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonAvatar = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-avatar");
  this.imgObj = document.createElement("img");
  this.domObj.appendChild(this.imgObj);
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonAvatar.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonAvatar.prototype.updateElement = function (el)
{
  // To handle load trigger the base class must not handle src: we must fisrt handle the animations and then set the SRC: if we found the load trigger
  // we must use the animation
  var src;
  if (el.src !== undefined) {
    src = el.src;
    delete el.src;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  if (src !== undefined) {
    if (src) {
      if (this.loadTrigger)
        this.handleLoadTrigger();
      this.imgObj.src = Client.Utils.abs(src);
    }
    else {
      this.imgObj.src = "";
    }
  }
};


/**
 * @class A container for a toolbar title
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonThumbnail = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-thumbnail");
  this.imgObj = document.createElement("img");
  this.domObj.appendChild(this.imgObj);
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonThumbnail.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonThumbnail.prototype.updateElement = function (el)
{
  // To handle load trigger the base class must not handle src: we must fisrt handle the animations and then set the SRC: if we found the load trigger
  // we must use the animation
  var src;
  if (el.src !== undefined) {
    src = el.src;
    delete el.src;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  if (src !== undefined) {
    if (src) {
      if (this.loadTrigger)
        this.handleLoadTrigger();
      this.imgObj.src = Client.Utils.abs(src);
    }
    else {
      this.imgObj.src = "";
    }
  }
};

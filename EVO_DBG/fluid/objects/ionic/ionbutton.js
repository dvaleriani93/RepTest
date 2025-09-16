/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A button in a page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonButton = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("button");
  this.addEventsListeners();
  //
  this.spanObj = document.createElement("span");
  this.spanObj.className = "button-inner";
  this.domObj.appendChild(this.spanObj);
  //
  this.labelObj = element.useHTML ? document.createElement("span") : document.createTextNode("");
  this.useHTML = element.useHTML;
  //
  this.spanObj.appendChild(this.labelObj);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

Client.IonButton.prototype = new Client.Button();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonButton.prototype.updateElement = function (el)
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
  if (el.outline !== undefined) {
    this.outline = el.outline;
    update = true;
    delete el.outline;
  }
  if (el.clear !== undefined) {
    this.clear = el.clear;
    update = true;
    delete el.clear;
  }
  if (el.round !== undefined) {
    this.round = el.round;
    update = true;
    delete el.round;
  }
  if (el.block !== undefined) {
    this.block = el.block;
    update = true;
    delete el.block;
  }
  if (el.full !== undefined) {
    this.full = el.full;
    update = true;
    delete el.full;
  }
  if (el.for !== undefined) {
    var forobj = el.for;
    delete el.for;
    //
    // Wait for view creation to settle
    setTimeout(function () {
      var newobj = Client.eleMap[forobj];
      // First time? Attach handler
      if (newobj && !this.objToFocus) {
        // Need to remove click delay to have the keyboard always showed
        this.domObj.removeAttribute("click-delay");
        this.domObj.addEventListener("click", function () {
          if (this.objToFocus) {
            try {
              // UIWebView -> without an explicit blur,
              // the onChange event fired after the onClick
              this.objToFocus.domObj.blur();
              this.objToFocus.domObj.focus();
            }
            catch (ex) {
            }
          }
        }.bind(this), true);
      }
      if (newobj)
        this.objToFocus = newobj;
    }.bind(this), 100);
  }
  //
  if (el.size !== undefined) {
    this.size = el.size;
    update = true;
    delete el.size;
  }
  //
  if (el.fab !== undefined) {
    this.domObj.removeAttribute("fab-" + this.fab);
    this.fab = el.fab;
    if (this.fab)
      this.domObj.setAttribute("fab-" + this.fab, "");
    update = true;
    delete el.fab;
  }
  //
  if (el.fabAlignment !== undefined) {
    this.domObj.removeAttribute("fab-" + this.fabAlignment);
    this.fabAlignment = el.fabAlignment;
    this.domObj.setAttribute("fab-" + this.fabAlignment, "");
    update = true;
    delete el.fabAlignment;
  }
  //
  if (el.label !== undefined) {
    var wasempty = !this.labelObj[this.useHTML ? "innerHTML" : "textContent"];
    var isempty = !el.label;
    this.labelObj[this.useHTML ? "innerHTML" : "textContent"] = el.label;
    update = update || (wasempty !== isempty);
    delete el.label;
  }
  //
  if (el.icon !== undefined) {
    this.icon = el.icon;
    //
    if (!this.iconObj && el.icon) {
      this.iconObj = document.createElement("ion-icon");
      if (this.iconPosition === "right" || this.iconPosition === "only")
        this.spanObj.appendChild(this.iconObj);
      else
        this.spanObj.insertBefore(this.iconObj, this.labelObj);
    }
    if (!el.icon && this.iconObj) {
      this.iconObj.remove();
      this.iconObj = undefined;
    }
    if (el.icon && this.iconObj) {
      Client.IonHelper.setIonIcon(el.icon, this.iconObj);
    }
    update = true;
    delete el.icon;
  }
  //
  if (el.iconPosition !== undefined) {
    if (el.iconPosition !== this.iconPosition) {
      if (el.iconPosition === "only") {
        this.spanObj.removeChild(this.labelObj);
      }
      else {
        if (this.labelObj.parentNode === null)
          this.spanObj.appendChild(this.labelObj);
        if (this.iconObj) {
          this.spanObj.removeChild(this.iconObj);
          if (el.iconPosition === "right")
            this.spanObj.appendChild(this.iconObj);
          else
            this.spanObj.insertBefore(this.iconObj, this.labelObj);
        }
      }
    }
    this.iconPosition = el.iconPosition;
    update = true;
    delete el.iconPosition;
  }
  if (el.cmdKey) {
    var cmdk = el.cmdKey.toUpperCase();
    if (el.tooltip && !Client.mainFrame.device.isMobile)
      el.tooltip += " (" + cmdk + ")";
  }
  //
  Client.Button.prototype.updateElement.call(this, el);
  //
  if (update) {
    var inbar = (this.parent instanceof Client.IonButtons);
    var pfx = inbar ? "bar-" : "";
    var cs = "disable-hover ";
    cs += pfx + "button ";
    cs += pfx + "button-" + (this.clear ? "clear-" : "") + (this.outline ? "outline-" : "") + (this.color ? this.color : "default");
    if (Client.IonItem && this.parent instanceof Client.IonItem)
      cs += " item-button";
    if (this.outline)
      cs += " button-outline";
    if (this.clear)
      cs += " button-clear";
    if (this.round)
      cs += " button-round";
    if (this.block)
      cs += " button-block";
    if (this.full)
      cs += " button-full";
    if (this.size)
      cs += " button-" + this.size;
    if (this.fab)
      cs += " button-fab button-fab-" + this.fab;
    if (this.fabAlignment && this.fab)
      cs += " button-fab-" + this.fabAlignment;
    if (this.iconObj)
      cs += " " + pfx + "button-icon-" + (this.iconPosition ? this.iconPosition : (this.labelObj.textContent ? "left" : "only"));
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
  }
};


/**
 * Return a copy of the element
 * @param {Object} config
 * @param {Client.Element} parent
 * @param {Map} referencesMap
 */
Client.IonButton.prototype.clone = function (config, parent, referencesMap)
{
  let el = Client.Element.prototype.clone.call(this, config, parent, referencesMap);
  //
  if (el.for !== undefined) {
    el.domObj.addEventListener("click", () => {
      if (el.objToFocus) {
        try {
          // UIWebView -> without an explicit blur,
          // the onChange event fired after the onClick
          el.objToFocus.domObj.blur();
          el.objToFocus.domObj.focus();
        }
        catch (ex) {
        }
      }
    }, true);
  }
  //
  return el;
};


/**
 * Add events listeners
 */
Client.IonButton.prototype.addEventsListeners = function ()
{
  Client.IonHelper.registerClickListener(this);
};


/**
 * @class A container for the entire ionic page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonButtons = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-buttons");
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);
};

Client.IonButtons.prototype = new Client.Container();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonButtons.prototype.updateElement = function (el)
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
  // postition: start, end
  if (el.position !== undefined && isNaN(parseInt(el.position))) {
    this.domObj.removeAttribute("start");
    this.domObj.removeAttribute("end");
    this.domObj.setAttribute(el.position, "");
    delete el.position;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (update) {
    var cs = "show-page";
    if (this.className)
      cs += " " + this.className;
    this.setClassName(cs);
    //
    // Let's see if I should be left or right
    var left = true;
    for (var i = 0; i < this.parent.elements.length && left; i++) {
      var e = this.parent.elements[i];
      if (Client.IonTitle && e instanceof Client.IonTitle)
        left = false;
      if (Client.IonSearchbar && e instanceof Client.IonSearchbar)
        left = false;
    }
    //
    if (!left) {
      this.domObj.setAttribute("end", "");
    }
  }
};

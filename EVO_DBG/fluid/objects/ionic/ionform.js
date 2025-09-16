/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for a checkbox
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonCheckbox = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-checkbox");
  //
  this.iconObj = document.createElement("div");
  this.iconObj.className = "checkbox-icon";
  this.innerObj = document.createElement("div");
  this.innerObj.className = "checkbox-inner";
  this.iconObj.appendChild(this.innerObj);
  this.domObj.appendChild(this.iconObj);
  //
  this.coverObj = document.createElement("button");
  this.coverObj.className = "item-cover disable-hover item-cover-default";
  this.domObj.appendChild(this.coverObj);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  this.addEventsListeners();
};

Client.IonCheckbox.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonCheckbox.prototype.updateElement = function (el)
{
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, "");
    delete el.color;
  }
  if (el.focusColor !== undefined) {
    this.focusColor = el.focusColor;
    delete el.focusColor;
  }
  if (el.disabled !== undefined) {
    if (el.disabled)
      this.domObj.classList.add("checkbox-disabled");
    else
      this.domObj.classList.remove("checkbox-disabled");
  }
  //
  if (el.indeterminate !== undefined) {
    if (!el.indeterminate)
      this.iconObj.removeAttribute("indeterminate");
    else if (this.checked === undefined || this.checked === null)
      this.iconObj.setAttribute("indeterminate", "true");
    //
    this.indeterminate = el.indeterminate;
  }
  //
  // Label
  if (el.label !== undefined) {
    if (!this.labelObj) {
      this.labelObj = document.createElement("ion-label");
      this.labelObj.className = "checkbox-label";
      //
      if (this.parent.innerItem)
        this.parent.innerItem.insertBefore(this.labelObj, this.parent.inputWrapper);
      else
        this.parent.getRootObject().appendChild(this.labelObj);
    }
    this.labelObj.textContent = el.label;
    if (this.parent instanceof Client.IonItem) {
      this.parent.domObj.classList.add("item-label-fixed");
    }
    delete el.label;
  }
  //
  if (this.indeterminate && (el.checked === undefined || el.checked === null || el.checked === "")) {
    // If the indeterminate mode is enabled we must activate it when the value is NULL or UNDEFINED
    this.iconObj.setAttribute("indeterminate", "true");
  }
  else if (el.checked !== undefined) {
    if (typeof el.checked === "string")
      el.checked = (el.checked === "true");
    if (el.checked) {
      this.iconObj.classList.add("checkbox-checked");
      if (this.labelObj && !this.domObj.classList.contains("no-highlight"))
        this.labelObj.setAttribute(this.color, "");
    }
    else {
      this.iconObj.classList.remove("checkbox-checked");
      if (this.labelObj && !this.domObj.classList.contains("no-highlight"))
        this.labelObj.removeAttribute(this.color);
    }
    //
    this.iconObj.removeAttribute("indeterminate");
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonCheckbox.prototype.attachEvents = function (events)
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
 * Add events listeners
 */
Client.IonCheckbox.prototype.addEventsListeners = function ()
{
  Client.IonHelper.registerClickListener(this, this.coverObj);
  //
  if (this.parent instanceof Client.IonItem && !Client.mainFrame.device.isMobile) {
    this.coverObj.addEventListener("focus", (ev) => {
      this.parent.domObj.classList.add("item-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", this.focusColor);
    });
    //
    this.coverObj.addEventListener("blur", (ev) => {
      this.parent.domObj.classList.remove("item-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    });
  }
  //
  // On desktop we intercept the enter key and skip the changing of the value (by setting preventdefault on the keyDown)
  // and we get to the next focusable object
  if (!Client.mainFrame.device.isMobile) {
    this.coverObj.onkeydown = (ev) => {
      if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
        ev.preventDefault();
    };
    //
    this.coverObj.onkeyup = (ev) => {
      if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
        Client.IonHelper.focusNextInput(this.view, this.coverObj, (ev.which === 9 && ev.shiftKey));
    };
  }
  //
  // Touching the label should focus the input
  if (this.labelObj) {
    this.labelObj.addEventListener("click", () => {
      this.domObj.focus();
    }, true);
  }
};


/**
 * Checkbox clicked!
 * @param {Object} ev - event
 */
Client.IonCheckbox.prototype.myClick = function (ev)
{
  if (this.domObj.disabled)
    return;
  //
  Client.IonHelper.hapticFeedback();
  //
  var status = !this.domObj.checked;
  this.updateElement({checked: status});
  //
  var propName = "checked";
  var x = [{obj: this.id, id: "chgProp", content: {name: propName, value: this.domObj[propName], clid: Client.id}}];
  if (this.sendOnChange)
    x.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
  Client.mainFrame.sendEvents(x);
};



/**
 * @class A container for a radio button
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonRadio = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-radio");
  //
  this.iconObj = document.createElement("div");
  this.iconObj.className = "radio-icon";
  this.innerObj = document.createElement("div");
  this.innerObj.className = "radio-inner";
  this.iconObj.appendChild(this.innerObj);
  this.domObj.appendChild(this.iconObj);
  //
  this.coverObj = document.createElement("button");
  this.coverObj.className = "item-cover disable-hover item-cover-default";
  this.domObj.appendChild(this.coverObj);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  this.addEventsListeners();
};

Client.IonRadio.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonRadio.prototype.updateElement = function (el)
{
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, "");
    delete el.color;
  }
  if (el.focusColor !== undefined) {
    this.focusColor = el.focusColor;
    delete el.focusColor;
  }
  //
  // Label
  if (el.label !== undefined) {
    if (!this.labelObj) {
      this.labelObj = document.createElement("ion-label");
      this.labelObj.className = "radio-label";
      if (this.parent.innerItem) {
        this.parent.innerItem.insertBefore(this.labelObj, this.parent.inputWrapper);
      }
      else {
        this.domObj.parentNode.appendChild(this.labelObj);
      }
    }
    this.labelObj.textContent = el.label;
    if (this.parent instanceof Client.IonItem) {
      this.parent.domObj.classList.add("item-label-fixed");
    }
    delete el.label;
  }
  if (el.checked !== undefined) {
    var wc = this.domObj.getAttribute("checked");
    if (el.checked) {
      this.iconObj.classList.add("radio-checked");
      this.domObj.setAttribute("checked", true);
      if (this.labelObj && !this.domObj.classList.contains("no-highlight"))
        this.labelObj.setAttribute(this.color, "");
    }
    else {
      this.iconObj.classList.remove("radio-checked");
      this.domObj.removeAttribute("checked");
      if (this.labelObj && !this.domObj.classList.contains("no-highlight"))
        this.labelObj.removeAttribute(this.color);
    }
    //
    if (this.parent instanceof Client.IonItem) {
      if (el.checked)
        this.parent.domObj.classList.add("item-radio-checked");
      else
        this.parent.domObj.classList.remove("item-radio-checked");
    }
    //
    // remove any other radio checked in the same group
    if (el.checked && !wc) {
      var p = this.parent;
      while (p) {
        if (p.domObj && p.domObj.getAttribute("radio-group"))
          break;
        p = p.parent;
      }
      if (p) {
        p.updateElement({value: this.domObj.value});
      }
    }
    //
    delete el.checked;
  }
  //
  if (el.disabled !== undefined) {
    if (el.disabled)
      this.domObj.classList.add("radio-disabled");
    else
      this.domObj.classList.remove("radio-disabled");
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonRadio.prototype.attachEvents = function (events)
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
 * Add events listeners
 */
Client.IonRadio.prototype.addEventsListeners = function ()
{
  Client.IonHelper.registerClickListener(this, this.coverObj);
  //
  if (this.parent instanceof Client.IonItem && !Client.mainFrame.device.isMobile) {
    this.coverObj.addEventListener("focus", (ev) => {
      this.parent.domObj.classList.add("item-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", this.focusColor);
    });
    //
    this.coverObj.addEventListener("blur", (ev) => {
      this.parent.domObj.classList.remove("item-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    });
  }
  //
  // On desktop we intercept the enter key and skip the changing of the value (by setting preventdefault on the keyDown)
  // and we get to the next focusable object
  if (!Client.mainFrame.device.isMobile) {
    this.coverObj.onkeydown = (ev) => {
      if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
        ev.preventDefault();
    };
    //
    this.coverObj.onkeyup = (ev) => {
      if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
        Client.IonHelper.focusNextInput(this.view, this.coverObj, (ev.which === 9 && ev.shiftKey));
    };
  }
};


/**
 * Checkbox clicked!
 * @param {Object} ev - event
 */
Client.IonRadio.prototype.myClick = function (ev)
{
  if (this.domObj.disabled)
    return;
  //
  this.updateElement({checked: true});
  //
  var propName = "checked";
  var x = [{obj: this.id, id: "chgProp", content: {name: propName, value: this.domObj[propName], clid: Client.id}}];
  if (this.sendOnChange)
    x.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
  Client.mainFrame.sendEvents(x);
};


/**
 * @class A container for a checkbox
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonToggle = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-toggle");
  //
  this.iconObj = document.createElement("div");
  this.iconObj.className = "toggle-icon";
  this.innerObj = document.createElement("div");
  this.innerObj.className = "toggle-inner";
  this.iconObj.appendChild(this.innerObj);
  this.domObj.appendChild(this.iconObj);
  //
  this.coverObj = document.createElement("button");
  this.coverObj.className = "item-cover disable-hover item-cover-default";
  this.domObj.appendChild(this.coverObj);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  this.addEventsListeners();
};

Client.IonToggle.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonToggle.prototype.updateElement = function (el)
{
  if (el.color !== undefined) {
    if (this.color)
      this.domObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.domObj.setAttribute(this.color, "");
    delete el.color;
  }
  if (el.focusColor !== undefined) {
    this.focusColor = el.focusColor;
    delete el.focusColor;
  }
  //
  // Label
  if (el.label !== undefined) {
    if (!this.labelObj) {
      this.labelObj = document.createElement("ion-label");
      this.labelObj.className = "toggle-label";
      if (this.parent.innerItem) {
        if ((this.itemSide || el.itemSide) === "wrapper")
          setTimeout(function () {
            this.parent.inputWrapper.insertBefore(this.labelObj, this.domObj);
          }.bind(this), 0);
        else
          this.parent.innerItem.insertBefore(this.labelObj, this.parent.inputWrapper);
      }
      else {
        this.domObj.parentNode.appendChild(this.labelObj);
      }
    }
    this.labelObj.textContent = el.label;
    if (this.parent instanceof Client.IonItem) {
      this.parent.domObj.classList.add("item-label-fixed");
    }
    delete el.label;
  }
  if (el.checked !== undefined) {
    if (el.checked) {
      this.iconObj.classList.add("toggle-checked");
      if (this.labelObj && !this.domObj.classList.contains("no-highlight"))
        this.labelObj.setAttribute(this.color, "");
    }
    else {
      this.iconObj.classList.remove("toggle-checked");
      if (this.labelObj && !this.domObj.classList.contains("no-highlight"))
        this.labelObj.removeAttribute(this.color);
    }
  }
  if (el.disabled !== undefined) {
    if (el.disabled)
      this.domObj.classList.add("toggle-disabled");
    else
      this.domObj.classList.remove("toggle-disabled");
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};

/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonToggle.prototype.attachEvents = function (events)
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
 * Add events listeners
 */
Client.IonToggle.prototype.addEventsListeners = function ()
{
  Client.IonHelper.registerClickListener(this, this.coverObj);
  //
  if (this.parent instanceof Client.IonItem && !Client.mainFrame.device.isMobile) {
    this.coverObj.addEventListener("focus", (ev) => {
      this.parent.domObj.classList.add("item-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", this.focusColor);
    });
    //
    this.coverObj.addEventListener("blur", (ev) => {
      this.parent.domObj.classList.remove("item-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    });
  }
  //
  // On desktop we intercept the enter key and skip the changing of the value (by setting preventdefault on the keyDown)
  // and we get to the next focusable object
  if (!Client.mainFrame.device.isMobile) {
    this.coverObj.onkeydown = (ev) => {
      if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
        ev.preventDefault();
    };
    //
    this.coverObj.onkeyup = (ev) => {
      if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
        Client.IonHelper.focusNextInput(this.view, this.coverObj, (ev.which === 9 && ev.shiftKey));
    };
  }
};


/**
 * Checkbox clicked!
 * @param {Object} ev - event
 */
Client.IonToggle.prototype.myClick = function (ev)
{
  if (this.domObj.disabled)
    return;
  //
  Client.IonHelper.hapticFeedback();
  //
  var status = !this.domObj.checked;
  this.updateElement({checked: status});
  //
  var propName = "checked";
  var x = [{obj: this.id, id: "chgProp", content: {name: propName, value: this.domObj[propName], clid: Client.id}}];
  if (this.sendOnChange)
    x.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
  Client.mainFrame.sendEvents(x);
};


/**
 * @class A container for an input
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonInput = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  if (element.type === "textarea") {
    this.outerObj = document.createElement("ion-textarea");
    this.domObj = document.createElement("textarea");
  }
  else {
    this.outerObj = document.createElement("ion-input");
    this.domObj = document.createElement("input");
  }
  this.domObj.className = "text-input";
  //
  this.outerObj.appendChild(this.domObj);
  //
  this.labelObj = document.createElement("ion-label");
  //
  this.clearObj = document.createElement("button");
  this.clearObj.className = "text-input-clear-icon disable-hover button button-clear want-click";
  //
  this.clearObj.style.display = "none";
  this.outerObj.appendChild(this.clearObj);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.outerObj);
  this.outerObj.parentNode.insertBefore(this.labelObj, this.outerObj);
  //
  this.addEventsListeners();
  //
  if (Client.IonItem && parent instanceof Client.IonItem)
    parent.domObj.classList.add("item-input");
  //
  if (Client.mainFrame.device.browserName === "Chrome" && !Client.mainFrame.device.isMobile && this.domObj && !this.domObj.getAttribute("autocomplete"))
    setTimeout(() => this.domObj?.setAttribute("autocomplete", "off"), 150);
};

Client.IonInput.prototype = new Client.Input();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonInput.prototype.updateElement = function (el)
{
  if (el.className !== undefined) {
    this.outerObj.className = el.className;
    delete el.className;
  }
  if (el.label !== undefined) {
    this.labelObj.textContent = el.label;
    if (Client.IonItem && this.parent instanceof Client.IonItem) {
      this.parent.domObj.classList.add("item-label-fixed");
    }
    delete el.label;
  }
  if (el.labelPosition !== undefined) {
    if (this.labelPosition && this.labelObj) {
      this.labelObj.removeAttribute(this.labelPosition);
      if (Client.IonItem && this.parent instanceof Client.IonItem)
        this.parent.domObj.classList.remove("item-label-" + this.labelPosition);
    }
    else {
      if (this.parent instanceof Client.IonItem)
        this.parent.domObj.classList.remove("item-label-fixed");
    }
    //
    this.labelPosition = el.labelPosition;
    if (el.labelPosition) {
      this.labelObj.setAttribute(this.labelPosition, "");
      if (Client.IonItem && this.parent instanceof Client.IonItem)
        this.parent.domObj.classList.add("item-label-" + this.labelPosition);
    }
  }
  if (el.color !== undefined) {
    if (this.color)
      this.labelObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color)
      this.labelObj.setAttribute(this.color, "");
    delete el.color;
  }
  if (el.focusColor !== undefined) {
    this.focusColor = el.focusColor;
    delete el.focusColor;
  }
  if (el.value !== undefined) {
    if (Client.IonItem && this.parent instanceof Client.IonItem) {
      let isNull = el.value === null || el.value === undefined;
      this.parent.domObj.classList.toggle("input-has-value", !isNull && (el.value + ""));
    }
  }
  if (el.clear !== undefined) {
    this.clearObj.style.display = el.clear ? "" : "none";
  }
  if (el.numPad !== undefined) {
    this.numPad = el.numPad;
    //
    if ((this.useNumPad() || this.readOnly))
      this.domObj.setAttribute("readonly", "true");
    else
      this.domObj.removeAttribute("readonly");
    //
    delete el.numPad;
  }
  if (el.readOnly !== undefined) {
    this.readOnly = el.readOnly;
    //
    if ((this.useNumPad() || this.readOnly))
      this.domObj.setAttribute("readonly", "true");
    else
      this.domObj.removeAttribute("readonly");
    //
    delete el.readOnly;
  }
  //
  if (el.type !== undefined && el.type === "select") {
    // If there is a type attribute and is not supported we must ignore it and log this
    var oType = el.type;
    setTimeout(function () {
      throw new Error("IonInput type set to an unsupported value : '" + oType + "' , ignoring it.");
    }, 10);
    //
    delete el.type;
  }
  //
  if (el.mask && this.useNumPad()) {
    // Memorize the mask but don't use the standard focus/blur masking.
    // the numpad will call the mask and call onchange at his closing
    this.mask = el.mask;
    this.maskType = "N";
    //
    if (!Client.mainFrame.isIDF) {
      glbDecSep = Client.mainFrame.theme.decimalSeparator || Client.mainFrame.device.numberPattern.decimal;
      glbThoSep = Client.mainFrame.theme.groupingSeparator || Client.mainFrame.device.numberPattern.grouping;
    }
    //
    // IN the mask we use ###,###,###.##
    // , -> group separator
    // . -> decimal separator
    // now we must adapt it to the detected separators, but using a temporary token (otherwise we risk to lose a token)
    this.mask = this.mask.replace(/\./g, "@");
    this.mask = this.mask.replace(/,/g, glbThoSep);
    this.mask = this.mask.replace(/@/g, glbDecSep);
    //
    // If the value is set we need to mask it
    if (this.domObj.value)
      this.domObj.value = mask_mask(this.domObj.value, this.mask, this.maskType);
    //
    delete el.mask;
    delete el.type;
  }
  //
  Client.Input.prototype.updateElement.call(this, el);
};


/**
 * Add events listeners
 */
Client.IonInput.prototype.addEventsListeners = function ()
{
  this.outerObj.addEventListener("click", (ev) => this.domObj.focus());
  //
  this.clearObj.onmousedown = (ev) => {
    this.updateElement({value: ""});
    //
    if (this.domObj.oninput)
      this.domObj.oninput(ev);
    if (this.domObj.onchange)
      this.domObj.onchange(ev);
    this.domObj.focus();
    //
    // Mask the value for the date, the numeric does it already
    if (this.mask !== undefined && this.maskType === "D")
      mc(this.mask, this.maskType, null, this.domObj, true);
    //
    return false;
  };
  //
  this.clearObj.ontouchstart = (ev) => {
    this.updateElement({value: ""});
    if (this.domObj.oninput)
      this.domObj.oninput(ev);
    if (this.domObj.onchange)
      this.domObj.onchange(ev);
    this.domObj.focus();
    return false;
  };
  //
  if (Client.IonItem && this.parent instanceof Client.IonItem) {
    this.domObj.addEventListener("focus", (ev) => {
      this.parent.domObj.classList.add("input-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", this.focusColor);
    });
    //
    this.domObj.addEventListener("blur", (ev) => {
      this.parent.domObj.classList.remove("input-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    });
    //
    let pthis = this;
    this.domObj.addEventListener("input", function (ev) {
      pthis.parent.domObj.classList.toggle("input-has-value", this.value);
    });
  }
  //
  this.domObj.onkeydown = (ev) => {
    if (ev.which === 9 && this.handleCustomNavigation())
      ev.preventDefault();
  };
  //
  // ENTER -> BLUR for inputs
  this.domObj.onkeyup = (ev) => {
    if (ev.which === 13 && this.domObj.tagName !== "TEXTAREA" && !this.parentWidget) {
      this.domObj.blur();
      //
      if (this.handleCustomNavigation())
        Client.IonHelper.focusNextInput(this.view, this.domObj);
    }
    if (ev.which === 9 && this.handleCustomNavigation()) {
      this.domObj.blur();
      Client.IonHelper.focusNextInput(this.view, this.domObj, (ev.which === 9 && ev.shiftKey));
    }
  };
  //
  if (this.useNumPad())
    this.outerObj.addEventListener("click", (ev) => this.openNumericKeyboard());
};


/**
 * Return the dom root object of this element
 * @returns {DomElement}
 */
Client.IonInput.prototype.getRootObject = function ()
{
  return this.outerObj;
};


/**
 * This object has been hidden or shown
 * @param {Boolean} visible
 */
Client.IonInput.prototype.visibilityChanged = function (visible)
{
  // The label is outside the input: update label visibility
  this.labelObj.style.display = this.getRootObject().style.display;
  Client.Input.prototype.visibilityChanged.call(this, visible);
};


/**
 * Set custom error message
 * @param {String} message - the error message
 * @param {bool} srv
 */
Client.IonInput.prototype.setError = function (message, srv)
{
  Client.Element.prototype.setError.call(this, message, srv);
  //
  setTimeout(function () {
    if (this.outerObj && this.outerObj.parentNode) {
      if (message)
        this.outerObj.parentNode.classList.add("is-invalid");
      else
        this.outerObj.parentNode.classList.remove("is-invalid");
    }
    if (!this.errObj && message) {
      this.errObj = document.createElement("div");
      this.errObj.className = "input-error-message";
      this.outerObj.appendChild(this.errObj);
    }
    if (this.errObj) {
      this.errObj.innerText = message;
      this.errObj.style.display = message ? "" : "none";
    }
  }.bind(this), 10);
};

Client.IonInput.prototype.usePopupKeyboard = function ()
{
  var dt = Client.mainFrame.device.viewportParams.devicetype ? Client.mainFrame.device.viewportParams.devicetype : Client.mainFrame.device.type;
  return dt !== "smartphone";
};

/**
 * Returns true or false if we must enable the numpad
 */
Client.IonInput.prototype.useNumPad = function ()
{
  var dt = Client.mainFrame.device.viewportParams.devicetype ? Client.mainFrame.device.viewportParams.devicetype : Client.mainFrame.device.type;
  //
  if (!this.numPad || this.numPad === 0)
    return false;
  else if (this.numPad === 1 && dt !== "smartphone" && dt !== "tablet")
    return false;
  else
    return true;
};


Client.IonInput.prototype.useCompactMode = function ()
{
  var dt = Client.mainFrame.device.viewportParams.devicetype ? Client.mainFrame.device.viewportParams.devicetype : Client.mainFrame.device.type;
  var h = Client.mainFrame.device.viewportParams.orientation ? Client.mainFrame.device.viewportParams.orientation : Client.mainFrame.device.deviceOrientation;
  return dt === "smartphone" && h === "horizontal";
};


Client.IonInput.prototype.focus = function (options)
{
  // search an open picker and close it
  let pikr = [];
  let oldPicker = document.getElementsByClassName("popover-num-keyboard") || [];
  for (let i = 0; i < oldPicker.length; i++)
    pikr.push(oldPicker[i]);
  oldPicker = document.getElementsByTagName("ion-picker-cmp") || [];
  for (let i = 0; i < oldPicker.length; i++)
    pikr.push(oldPicker[i]);
  //
  let _this = this;
  pikr.forEach(picker => {
    let oldInput = Client.eleMap[picker.getAttribute("for")];
    if (oldInput && oldInput !== _this)
      oldInput.closeNumericKeyboard(true);
  });
  //
  Client.Element.prototype.focus.call(this, options);
  //
  if (this.useNumPad()) {
    setTimeout(function () {
      this.openNumericKeyboard();
    }.bind(this), 50);
  }
};


Client.IonInput.prototype.blur = function ()
{
  // Close the numeric pad when the server blurs the input
  if (this.useNumPad())
    this.closeNumericKeyboard(true);
  //
  Client.Element.prototype.blur.call(this);
};


/**
 * Show the numeric keyboard
 */
Client.IonInput.prototype.openNumericKeyboard = function ()
{
  // No click when editing in the view editor
  if (Client.mainFrame.isEditing())
    return;
  //
  if (this.domObj.disabled || this.readOnly)
    return;
  //
  if (this.numKeyboardOpened || !this.useNumPad())
    return;
  this.numKeyboardOpened = true;
  //
  this.oldType = this.domObj.type;
  this.domObj.type = "text";
  //
  if (this.mask)
    mc(this.mask, "N", null, this.domObj, true);
  //
  Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "start"});
  window.setTimeout(function () {
    this.domObj.focus();
  }.bind(this), 300);
  //
  if (!this.usePopupKeyboard()) {
    // Picker creation
    var picker = document.createElement("ion-picker-cmp");
    picker.className = "numpad picker-cmp" + (this.useCompactMode() ? " compact" : "");
    picker.setAttribute("for", this.id);
    //
    var pw = document.createElement("div");
    pw.className = "picker-wrapper";
    picker.appendChild(pw);
    //
    // In compat mode we need an extra wrapper to center the keyboard
    var cnt = pw;
    if (this.useCompactMode()) {
      var pwch = document.createElement("div");
      pwch.className = "picker-wrapper-compact";
      pw.appendChild(pwch);
      cnt = pwch;
    }
    //
    this.createNumericKeyboard(cnt);
    //
    this.picker = picker;
    this.pw = pw;
    //
    // Picker show
    var appui = document.getElementById("app-ui");
    appui.appendChild(picker);
    //
    var r = pw.offsetTop;
    pw.style.transition = "transform 400ms cubic-bezier(.36,.66,.04,1)";
    pw.style.transform = "translateY(0%)";
    //
    Client.IonHelper.onChangeKeyboardVisibility(true, this.useCompactMode() ? 120 : 260);
  }
  else {
    // Picker creation
    var picker = document.createElement("ion-popover");
    picker.className = "popover-" + Client.Ionic.platform + " popover-num-keyboard";
    picker.setAttribute("for", this.id);
    //
    var pw = document.createElement("div");
    pw.className = "popover-wrapper";
    picker.appendChild(pw);
    //
    var parrow = document.createElement("div");
    parrow.className = "popover-arrow";
    pw.appendChild(parrow);
    var pc = document.createElement("div");
    pc.className = "popover-content";
    pw.appendChild(pc);
    //
    this.createNumericKeyboard(pc);
    //
    var appui = document.getElementById("app-ui");
    this.picker = picker;
    this.pw = pw;
    //
    // Now we must position the objects
    var tr = this.outerObj.getBoundingClientRect();
    var ta = tr.top + tr.height;
    var t = ta + 10;
    if (t + 260 > appui.offsetHeight) {
      t = tr.top - 260 - 10;
      ta = tr.top - 10;
      parrow.style.transform = "rotate(180deg)";
    }
    if (t < 0)
      t = 0;
    pc.style.top = t + "px";
    parrow.style.top = ta + "px";
    //
    var lw = Client.Ionic.platform === "md" ? 250 : 200;
    var l = tr.left + (tr.width / 2) - Math.ceil(lw / 2);
    if (l + lw > appui.offsetWidth)
      l = l - (l + lw - appui.offsetWidth);
    if (l < 0)
      l = 0;
    var la = l + 90;
    pc.style.left = l + "px";
    parrow.style.left = la + "px";
    //
    // And now the show
    appui.appendChild(picker);
    pw.style.opacity = "1";
  }
  //
  this.pickerRect = undefined;
  if (!this.detectCloseFunction)
    this.detectCloseFunction = function (ev) {
      var x = ev.targetTouches && ev.targetTouches.length > 0 ? ev.targetTouches[0].clientX : ev.clientX;
      var y = ev.targetTouches && ev.targetTouches.length > 0 ? ev.targetTouches[0].clientY : ev.clientY;
      //
      if (!this.pickerRect) {
        if (this.usePopupKeyboard())
          this.pickerRect = this.pw.getElementsByClassName("popover-content")[0].getBoundingClientRect();
        else
          this.pickerRect = this.pw.getBoundingClientRect();
      }
      //
      if (x < this.pickerRect.left || x > this.pickerRect.right || y < this.pickerRect.top || y > this.pickerRect.bottom)
        this.closeNumericKeyboard(true);
    }.bind(this);
  //
  document.body.addEventListener("mouseup", this.detectCloseFunction);
  document.body.addEventListener("touchup", this.detectCloseFunction);
  //
  this.outerObj.classList.add("numpad-focused");
};

/**
 * Closes the numeric keyboard
 * @param {boolean} immediate
 */
Client.IonInput.prototype.closeNumericKeyboard = function (immediate)
{
  if (!this.numKeyboardOpened)
    return;
  //
  // Restore the type and notify the onchange
  this.domObj.type = this.oldType;
  if (this.mask)
    umc({target: this.domObj});
  if (this.events.includes("onChange"))
    this.domObj.onchange();
  //
  document.body.removeEventListener("mouseup", this.detectCloseFunction);
  document.body.removeEventListener("touchup", this.detectCloseFunction);
  delete this.pickerRect;
  //
  var t1 = (Client.Ionic.platform === "md" && !immediate) ? 250 : 0;
  Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "end"});
  this.outerObj.classList.remove("numpad-focused");
  //
  if (!this.usePopupKeyboard())
    Client.IonHelper.onChangeKeyboardVisibility(false, this.useCompactMode() ? 120 : 260);
  //
  setTimeout(function () {
    if (this.pw) {
      if (!this.usePopupKeyboard())
        this.pw.style.transform = "";
      else
        this.pw.style.opacity = "0";
    }
  }.bind(this), t1);
  //
  setTimeout(function () {
    if (this.picker)
      this.picker.remove();
    delete this.picker;
    delete this.pw;
    this.numKeyboardOpened = false;
  }.bind(this), 500 + t1);
};

/**
 * Create the numeric keyboard
 * @param {domObj} container
 */
Client.IonInput.prototype.createNumericKeyboard = function (container)
{
  var body = document.createElement("div");
  body.className = "num-keyboard-body";
  container.appendChild(body);
  //
  var txt = new Array("1", "2", "3", "C", "4", "5", "6", "+", "7", "8", "9", "-", "-", "0", ".", "=");
  var _this = this;
  for (var i = 0; i < txt.length; i++) {
    var btn = document.createElement("button");
    btn.className = "num-keyboard-button disable-hover button " + (Client.Ionic.platform === "md" ? "button-clear-default button-clear" : "button-outline-default button-outline");
    body.appendChild(btn);
    btn.id = "key_" + i;
    //
    var innerBtn = document.createElement("span");
    innerBtn.className = "button-inner";
    innerBtn.textContent = txt[i];
    btn.appendChild(innerBtn);
    //
    Client.IonHelper.registerClickListener(this, btn);
    btn.addEventListener("click", function (ev) {
      _this.onNumKeyPress(this.id, this.firstChild.textContent);
    });
    //
    if (txt[i] === "C") {
      var downFunction = function () {
        _this.clearFieldTimeout = setTimeout(function () {
          if (!this.numKeyboardOpened)
            return;
          //
          this.domObj.value = "";
          delete this.clearFieldTimeout;
        }.bind(_this), 1000);
      };
      var upFunction = function () {
        if (_this.clearFieldTimeout) {
          clearTimeout(_this.clearFieldTimeout);
          delete _this.clearFieldTimeout;
        }
      };
      //
      btn.addEventListener("mousedown", downFunction);
      btn.addEventListener("mouseup", upFunction);
      btn.addEventListener("touchstart", downFunction);
      btn.addEventListener("touchend", upFunction);
      btn.addEventListener("touchmove", upFunction);
      btn.addEventListener("touchcancel", upFunction);
    }
  }
};


/**
 * Click on a key
 * @param {string} id
 * @param {string} key
 */
Client.IonInput.prototype.onNumKeyPress = function (id, key)
{
  var wasEmpty = this.domObj.value === "";
  //
  var step = parseFloat(this.domObj.step);
  var min = parseFloat(this.domObj.min);
  var max = parseFloat(this.domObj.max);
  //
  switch (key)
  {
    case "=":
      this.closeNumericKeyboard(true);
      return;
      break;

    case "C":
      if (this.mask) {
        var obj = this.domObj;
        var val = obj.value;
        //
        // To set the cursoe position i must know if there are decimals or not
        var decPos = val.indexOf(glbDecSep);
        //
        // no decimals ? do nothing (the standard delete removes from the left)
        if (decPos >= 0) {
          // There are decimals, i ust position the cursor on the leftmost decimal different from 0
          var idx = val.length - 1;
          while (idx > decPos) {
            var stopIteration = true;
            //
            // If the character is 0 can be removed o mantained
            // if optional we can delete it, otherwise it must be matained
            if (val.charAt(idx) === '0') {
              var ris = val.substring(0, idx).replace(new RegExp((glbThoSep === "." ? "\\." : glbThoSep), "g"), '');
              ris = formatNumber(ris, glbMask);
              //
              // If the 0 is not optional go to the next character
              if (ris.length === val.length)
                stopIteration = false;
            }
            //
            if (stopIteration)
              break;
            //
            idx--;
          }
          //
          setCursorPos(this.domObj, (idx === decPos ? idx : idx + 1));
        }
        //
        hk(null, 8);
      }
      else {
        if (this.domObj.value)
          this.domObj.value = this.domObj.value.slice(0, -1);
      }
      break;

    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      if (this.mask) {
        hk(null, 48 + parseInt(key, 10));
        //
        // If was started empty and now has a value and it has the decimal separator go after the separator, otherwise the next number
        // will be not inserted
        if (wasEmpty && this.domObj.value.indexOf(glbDecSep) !== -1)
          setCursorPos(this.domObj, this.domObj.value.indexOf(glbDecSep));
      }
      else
        this.domObj.value += key;
      break;

    case "0":
      if (this.mask)
        hk(null, 48);
      else
        this.domObj.value += key;
      break;

    case ".":
      if (this.mask)
        hk(null, 188);
      else
        this.domObj.value += key;
      break;

    case "+":
      if (this.mask) {
        var s = unmask(this.domObj.value);
        var f = parseFloat(s) + 1;
        if (isNaN(f))
          f = 0;
        this.domObj.value = formatNumber(f + "", this.mask);
      }
      else {
        // The + must add ONLY to the int part, so we must
        // - separate the int and decimal part
        // - round the decimal part so the inexplicable javascript float rounding is (luckyly) resolved
        // - add 1 to the integer part AND append the decimal part as a string (otherwise we have problems in the 0 range: 0.2-1=-0.8, but we want -1.2)
        var pow = Math.pow(10, this.domObj.value.length);
        var intPart = Math.trunc(parseFloat(this.domObj.value));
        var decPart = (Math.round(parseFloat(this.domObj.value) * pow) - (intPart * pow)) / pow;
        f = (intPart + 1) + (decPart ? decPart.toString().replace("-", "").replace("0.", ".") : "");
        if (isNaN(f))
          f = 0;
        this.domObj.value = f;
      }
      break;

    case "-":
      if (id === "key_11") {
        if (this.mask) {
          var s = unmask(this.domObj.value);
          var f = parseFloat(s) - 1;
          if (isNaN(f))
            f = 0;
          this.domObj.value = formatNumber(f + "", this.mask);
        }
        else {
          var pow = Math.pow(10, this.domObj.value.length);
          var intPart = Math.trunc(parseFloat(this.domObj.value));
          var decPart = (Math.round(parseFloat(this.domObj.value) * pow) - (intPart * pow)) / pow;
          f = (intPart - 1) + (decPart ? decPart.toString().replace("-", "").replace("0.", ".") : "");
          if (isNaN(f))
            f = 0;
          this.domObj.value = f;
        }
      }
      else {
        if (this.mask) {
          hk(null, 189);
        }
        else {
          // If the first char is - remove it, otherwise add it at the beginning
          if (this.domObj.value.indexOf("-") === 0)
            this.domObj.value = this.domObj.value.slice(1);
          else
            this.domObj.value = "-" + this.domObj.value;
        }
      }
      break;
  }
  //
  if (max !== undefined && !isNaN(max) && parseFloat(this.domObj.value) > max)
    this.domObj.value = max;
  if (min !== undefined && !isNaN(min) && parseFloat(this.domObj.value) < min)
    this.domObj.value = min;
  //
  // If the value length is > 1 remove the trailing 0 if present
  if (this.domObj.value && this.domObj.value.length > 1) {
    var intPart = Math.trunc(parseFloat(this.domObj.value));
    if (intPart > 0 && this.domObj.value.charAt(0) === "0")
      this.domObj.value = this.domObj.value.slice(1);
  }
  //
  if (this.domObj.maxLength && this.domObj.maxLength > 0)
    this.domObj.value = this.domObj.value.substr(0, parseFloat(this.domObj.maxLength));
  //
  if (this.events.includes("onInput"))
    this.domObj.oninput();
};


/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container for a datetime picker
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonSelect = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.cancelText = "Cancel";
  this.okText = "Ok";
  this.filterText = "Search";
  this.options = [];
  this.value = undefined;
  this.valueList = [];
  //
  this.domObj = document.createElement("ion-select");
  //
  this.textObj = document.createElement("div");
  this.textObj.className = "select-text";
  this.domObj.appendChild(this.textObj);
  //
  this.iconObj = document.createElement("div");
  this.iconObj.className = "select-icon";
  this.innerObj = document.createElement("div");
  this.innerObj.className = "select-icon-inner";
  this.iconObj.appendChild(this.innerObj);
  this.domObj.appendChild(this.iconObj);
  //
  this.coverObj = document.createElement("button");
  this.coverObj.className = "item-cover disable-hover item-cover-default";
  this.domObj.appendChild(this.coverObj);
  //
  this.clearObj = document.createElement("button");
  this.clearObj.className = "text-input-clear-icon disable-hover button button-clear want-click select-clear-icon";
  this.clearObj.style.display = "none";
  this.domObj.appendChild(this.clearObj);
  //
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  this.updateElement(element);
  //
  this.addEventsListeners();
  //
  // let's see if we have a label on our left
  if (!this.labelObj && Client.IonItem && Client.IonLabel && this.parent instanceof Client.IonItem) {
    var b = false;
    for (var i = 0; i < this.parent.elements.length && !b; i++) {
      if (this.parent.elements[i] instanceof Client.IonLabel)
        b = true;
    }
    if (!b)
      this.domObj.classList.add("select-nolabel");
  }
  //
  if (parent instanceof Client.IonItem)
    parent.domObj.classList.add("item-select");
};

Client.IonSelect.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonSelect.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  if (el.cancelText !== undefined) {
    this.cancelText = el.cancelText;
    delete el.cancelText;
  }
  if (el.okText !== undefined) {
    this.okText = el.okText;
    delete el.okText;
  }
  if (el.filterText !== undefined) {
    this.filterText = el.filterText;
    delete el.filterText;
  }
  if (el.disabled !== undefined) {
    this.disabled = el.disabled;
    this.domObj.classList.toggle("select-disabled", el.disabled);
    if (Client.IonItem && this.parent instanceof Client.IonItem)
      this.parent.domObj.classList.toggle("item-select-disabled", el.disabled);
  }
  if (el.readOnly !== undefined) {
    this.readOnly = el.readOnly;
    this.domObj.classList.toggle("select-readonly", el.readOnly);
    if (Client.IonItem && this.parent instanceof Client.IonItem)
      this.parent.domObj.classList.toggle("item-select-readonly", el.readOnly);
    delete el.readOnly;
  }
  if (el.placeholder !== undefined) {
    this.placeHolder = el.placeholder;
    this.showValue();
    delete el.placeholder;
  }
  if (el.multiple !== undefined) {
    this.multiple = el.multiple;
    delete el.mutiple;
  }
  if (el.selectedText !== undefined) {
    this.selectedText = el.selectedText;
    this.showValue();
    delete el.selectedText;
  }
  if (el.title !== undefined) {
    this.title = el.title;
    delete el.title;
  }
  if (el.inplace !== undefined) {
    this.inplace = el.inplace;
    delete el.inplace;
  }
  if (el.subtitle !== undefined) {
    this.subtitle = el.subtitle;
    delete el.subtitle;
  }
  if (el.canFilter !== undefined) {
    this.canFilter = el.canFilter;
    delete el.canFilter;
  }
  //
  if (el.value !== undefined) {
    this.setValue(el.value === null ? "" : el.value + "");
    delete el.value;
  }
  if (el.clear !== undefined) {
    this.clearObj.style.display = el.clear ? "" : "none";
    this.clear = el.clear;
    delete el.clear;
  }
  if (el.maxWidth !== undefined) {
    this.maxWidth = el.maxWidth;
    delete el.maxWidth;
  }
  if (el.maxHeight !== undefined) {
    this.maxHeight = el.maxHeight;
    delete el.maxHeight;
  }
  if (el.useChips !== undefined) {
    this.useChips = el.useChips;
    delete el.useChips;
    this.showValue();
  }
  if (el.chipList !== undefined) {
    this.chipList = el.chipList;
    delete el.chipList;
    this.showValue();
  }
  if (el.clickToAccept !== undefined) {
    this.clickToAccept = el.clickToAccept;
    delete el.clickToAccept;
  }
  //
  //
  // If there is a list of options, add them to the select
  // List example: [{"n":"Andrew","v":1},{"n":"Mary","v":2},{"n":"Luke","v":3}]
  if (el.list) {
    //
    // If el.list is a string make it a json object
    if (typeof el.list === "string")
      el.list = JSON.parse(el.list);
    //
    // Remove element children
    this.options.length = 0;
    //
    // Create an option for each item in the list
    for (var i = 0; i < el.list.length; i++) {
      var o = el.list[i];
      this.options.push({text: o.n, value: o.v, src: o.src});
    }
    //
    // restore value if present
    this.setValue(this.value);
    //
    // Base class must not use the list property
    delete el.list;
  }
  //
  if (el.data) {
    if (el.data.columns) {
      this.initInput(el);
      this.setValue(this.value);
    }
    else if (el.data.pos !== undefined) {
      if (el.data.data) // Update option
        this.updateOption(el.data);
      else  // Remove option
        this.removeOptionAtPos(el.data.pos);
    }
    else { // Add option
      this.addOption(el.data.data);
      if (!this.selectedText)
        this.setValue(this.value);
    }
    //
    // Base class must not use the data property
    delete el.data;
  }
  //
  // specific class name
  if (el.className !== undefined) {
    var cl = "";
    var ca = ["select-nolabel", "select-has-value", "select-disabled"];
    for (var i = 0; i < ca.length; i++) {
      if (this.domObj.classList.contains(ca[i]))
        cl += " " + ca[i];
    }
    cl += " " + el.className;
    this.setClassName(cl);
    delete el.className;
  }
  //
  // Label
  if (el.label !== undefined) {
    if (!this.labelObj) {
      this.labelObj = document.createElement("ion-label");
      this.domObj.parentNode.insertBefore(this.labelObj, this.domObj);
      this.domObj.classList.remove("select-nolabel");
    }
    this.labelObj.textContent = el.label;
    if (this.parent instanceof Client.IonItem) {
      this.parent.domObj.classList.add("item-label-fixed");
    }
    delete el.label;
  }
  if (el.labelPosition !== undefined) {
    if (this.labelPosition && this.labelObj) {
      this.labelObj.removeAttribute(this.labelPosition);
      if (this.parent instanceof Client.IonItem)
        this.parent.domObj.classList.remove("item-label-" + this.labelPosition);
    }
    else {
      if (this.parent instanceof Client.IonItem)
        this.parent.domObj.classList.remove("item-label-fixed");
    }
    //
    this.labelPosition = el.labelPosition;
    if (el.labelPosition && this.labelObj) {
      this.labelObj.setAttribute(this.labelPosition, "");
      if (this.parent instanceof Client.IonItem)
        this.parent.domObj.classList.add("item-label-" + this.labelPosition);
    }
    //
    this.domObj.classList.toggle("select-nolabel", this.labelPosition === "hidden");
    //
    delete el.labelPosition;
  }
  if (el.color !== undefined) {
    if (this.color && this.labelObj)
      this.labelObj.removeAttribute(this.color);
    this.color = el.color;
    if (this.color && this.labelObj)
      this.labelObj.setAttribute(this.color, "");
    delete el.color;
  }
  if (el.focusColor !== undefined) {
    this.focusColor = el.focusColor;
    delete el.focusColor;
  }
  if (el.popupClass !== undefined) {
    this.popupClass = el.popupClass;
    delete el.popupClass;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Show actual value
 */
Client.IonSelect.prototype.showValue = function ()
{
  this.coverObj.style.display = this.chipList ? "none" : "";
  this.iconObj.style.display = this.chipList ? "none" : "";
  this.clearObj.style.display = (this.chipList || !this.clear) ? "none" : "";
  this.textObj.classList.toggle("chip-list", this.chipList);
  //
  if (this.chipList) {
    // Render all chips
    this.textObj.textContent = "";
    //
    let p = Client.Ionic.platform;
    this.deleteChips();
    for (let i = 0; i < this.options.length; i++) {
      let o = this.options[i];
      let isPresent = false;
      for (let j = 0; j < this.valueList.length; j++) {
        if (o.value == this.valueList[j] && !(o.value === 0 && this.valueList[j] === "")) {
          isPresent = true;
          break;
        }
      }
      //
      let d = document.createElement("ion-chip");
      let chipc = " chip-" + this.chipList;
      d.className = "chip chip-" + p + chipc + (isPresent ? " chip-selected" : "");
      if (o.src) {
        if (o.src.substring(0, 4) === "ion:") {
          let img = document.createElement("ion-icon");
          img.setAttribute("item-left", "");
          Client.IonHelper.setIonIcon(o.src.substring(4), img, "item-icon");
          d.appendChild(img);
        }
        else {
          let ava = document.createElement("ion-avatar");
          ava.setAttribute("item-left", "");
          let img = document.createElement("img");
          img.src = o.src;
          ava.appendChild(img);
          d.appendChild(ava);
        }
      }
      let l = document.createElement("ion-label");
      l.className = "label label-" + p;
      l.textContent = o.text;
      d.appendChild(l);
      //
      d.onclick = function () {
        if (!this.disabled && !this.readOnly) {
          if (this.multiple) {
            let idx = this.valueList.indexOf(o.value);
            if (idx > -1)
              this.valueList.splice(idx, 1)
            else
              this.valueList.push(o.value);
            this.setValue(this.valueList.join(","), true);
          }
          else {
            if (this.clear && isPresent)
              this.setValue("", true);
            else
              this.setValue(o.value, true);
          }
        }
      }.bind(this);
      this.textObj.appendChild(d);
    }
  }
  else if (this.useChips && this.selectedText) {
    this.textObj.textContent = "";
    //
    var p = Client.Ionic.platform;
    this.deleteChips();
    var chlist = this.selectedText.split(", ");
    for (var i = 0; i < chlist.length; i++) {
      var d = document.createElement("ion-chip");
      d.className = "chip chip-" + p;
      d.innerHTML = "<ion-label class='label label-" + p + "'>" + chlist[i] + "</ion-label><button id='" + i + "' clear='' ion-button='' class='disable-hover button button-" +
              p + " button-clear button-clear-" + p + "'><span class='button-inner'><ion-icon name='close-circle' class='icon icon-" +
              p + " ion-" + Client.IonHelper.getIconSet() + "-close-circle'></ion-icon></span></button>";
      this.textObj.appendChild(d);
      //
      if (Client.mainFrame.theme.ionIcons === "5") {
        var icons = d.getElementsByTagName("ion-icon");
        Client.IonHelper.setIonIcon("svg_close-circle", icons[0]);
        icons[0].setAttribute("small", "t");
      }
    }
  }
  else {
    this.deleteChips();
    this.textObj.textContent = this.selectedText || this.placeHolder;
  }
  this.textObj.classList.toggle("select-placeholder", !this.selectedText);
  this.domObj.classList.toggle("select-has-value", !!this.value);
  if (this.parent instanceof Client.IonItem)
    this.parent.domObj.classList.toggle("input-has-value", !!this.value);
};


/**
 * Delete any chip
 */
Client.IonSelect.prototype.deleteChips = function ()
{
  var chlist = this.textObj.getElementsByTagName("ION-CHIP");
  for (var i = 0; i < chlist.length; i++) {
    chlist[i].remove();
  }
};


/**
 * This object has been hidden or shown
 * @param {Boolean} visible
 */
Client.IonSelect.prototype.visibilityChanged = function (visible)
{
  // The label is outside the input: update label visibility
  if (this.labelObj)
    this.labelObj.style.display = this.getRootObject().style.display;
  Client.Element.prototype.visibilityChanged.call(this, visible);
};


/**
 * Set actual value
 * @param {string} value
 * @param {boolean} emitChange
 */
Client.IonSelect.prototype.setValue = function (value, emitChange)
{
  if (value === undefined || value === null)
    value = "";
  //
  this.value = value;
  //
  var oldSelText = this.selectedText;
  //
  this.selectedText = "";
  //
  // multiple values are separated by comma
  if (this.multiple && value.split)
    this.valueList = value.split(",");
  else
    this.valueList = [value];
  //
  for (var i = 0; i < this.options.length; i++) {
    var o = this.options[i];
    var isPresent = false;
    for (var j = 0; j < this.valueList.length; j++) {
      // == is right, === is not
      if (o.value == this.valueList[j] && !(o.value === 0 && this.valueList[j] === "")) {
        isPresent = true;
        break;
      }
    }
    if (isPresent) {
      if (this.selectedText)
        this.selectedText += ", ";
      this.selectedText += o.text;
    }
  }
  //
  this.showValue();
  //
  this.checkError(true);
  //
  if (emitChange) {
    var x = [{obj: this.id, id: "chgProp", content: {name: "value", value: value, clid: Client.id}}];
    x.push({obj: this.id, id: "chgProp", content: {name: "selectedText", value: this.selectedText, clid: Client.id}, warn: false});
    if (this.sendOnChange)
      x.push({obj: this.id, id: "onChange"});
    Client.mainFrame.sendEvents(x);
  }
  else if (this.selectedText !== oldSelText) {
    //
    // Selected text has changed, update server
    var x = [{obj: this.id, id: "chgProp", content: {name: "selectedText", value: this.selectedText, clid: Client.id}, warn: false}];
    Client.mainFrame.sendEvents(x);
  }
};


/**
 * Add events listeners
 */
Client.IonSelect.prototype.addEventsListeners = function ()
{
  Client.IonHelper.registerClickListener(this, this.coverObj);
  //
  this.textObj.onclick = (ev) => {
    if (this.useChips) {
      let obj = ev.srcElement;
      while (obj && !obj.id) {
        obj = obj.parentNode;
      }
      if (obj) {
        let id = parseInt(obj.id);
        if (!isNaN(id)) {
          let l = this.value.split(",");
          l.splice(id, 1);
          this.setValue(l.join(","), true);
        }
      }
    }
  };
  //
  this.clearObj.onmousedown = (ev) => {
    this.setValue("", true);
    return false;
  };
  //
  this.clearObj.ontouchstart = (ev) => {
    this.setValue("", true);
    return false;
  };
  //
  if (Client.mainFrame.device.isMobile)
    return;
  //
  if (this.parent instanceof Client.IonItem) {
    this.coverObj.addEventListener("focus", (ev) => {
      this.parent.domObj.classList.add("select-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", this.focusColor);
    });
    //
    this.coverObj.addEventListener("blur", (ev) => {
      this.parent.domObj.classList.remove("select-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    });
  }
  //
  // On desktop we intercept the enter key and skip the changing of the value (by setting preventdefault on the keyDown)
  // and we get to the next focusable object
  this.coverObj.onkeydown = (ev) => {
    if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
      ev.preventDefault();
  };
  //
  this.coverObj.onkeyup = (ev) => {
    if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation())
      Client.IonHelper.focusNextInput(this.view, this.coverObj, (ev.which === 9 && ev.shiftKey));
  };
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonSelect.prototype.attachEvents = function (events)
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
 * Datetime clicked!
 * @param {Object} ev - event
 * @param {Object} domObj
 */
Client.IonSelect.prototype.myClick = function (ev, domObj)
{
  // No click when editing in the view editor
  if (Client.mainFrame.isEditing())
    return;
  //
  if (this.domObj.disabled)
    return;
  //
  // Let's if there is a label
  if (this.title === undefined) {
    var ll = this.domObj.parentNode.getElementsByTagName("ION-LABEL");
    if (ll && ll.length) {
      this.title = ll[0].textContent;
    }
    else {
      this.title = "";
    }
  }
  //
  var opt = {};
  if (this.title)
    opt.title = this.title;
  if (this.subtitle)
    opt.subtitle = this.subtitle;
  if (this.canFilter)
    opt.canFilter = this.canFilter;
  if (this.filterText)
    opt.filterText = this.filterText;
  if (this.maxWidth)
    opt.maxWidth = this.maxWidth;
  if (this.maxHeight)
    opt.maxHeight = this.maxHeight;
  if (this.clickToAccept)
    opt.clickToAccept = this.clickToAccept;
  if (this.popupClass)
    opt.style = this.popupClass;
  //
  if (this.inplace) {
    var robj = this.domObj;
    if (robj.parentNode.classList.contains("input-wrapper"))
      robj = robj.parentNode;
    var r1 = robj.getBoundingClientRect();
    var r2 = document.getElementById('app-ui').getBoundingClientRect();
    var rect = {top: r1.y - r2.y, left: r1.x - r2.x, width: r1.width};
    if (!opt.title && !opt.subtitle)
      rect.top += r1.height;
    opt.rect = rect;
  }
  //
  for (var i = 0; i < this.options.length; i++) {
    var o = this.options[i];
    var v = o.value + "";
    if (!opt.inputs)
      opt.inputs = [];
    opt.inputs.push({type: this.multiple ? "checkbox" : "radio", label: o.text, id: o.value, checked: this.valueList.indexOf(v) > -1});
  }
  //
  opt.buttons = [this.cancelText, this.okText];
  //
  Client.IonHelper.createAlert(opt, function (r, values) {
    if (r) {
      if (values) {
        delete values.button;
        if (this.multiple) {
          var v = [];
          var k = Object.keys(values);
          for (var i = 0; i < k.length; i++)
            if (values[k[i]])
              v.push(k[i]);
          this.setValue(v.join(","), true);
        }
        else
          this.setValue(values.value, true);
      }
    }
    //
    this.coverObj.focus();
  }.bind(this));
  //
};


/**
 * Initialize the input
 * @param {Object} el - element representation
 */
Client.IonSelect.prototype.initInput = function (el)
{
  // First remove old options
  this.options.length = 0;
  //
  for (var i in el.data.data)
    this.addOption(el.data.data[i]);
};


/**
 * Remove an option from the select at the given position
 * @param {int} pos - the position of the option to remove
 */
Client.IonSelect.prototype.removeOptionAtPos = function (pos)
{
  this.options.splice(pos, 1);
};


/**
 * Add an option to the select
 * @param {Array} data - the option to add. The first element of the array represents the value,
 *                       the second element represents the text
 */
Client.IonSelect.prototype.addOption = function (data)
{
  this.options.push({text: data[1], value: data[0], src: data[2]});
};


/**
 * Update a select option
 * @param {Object} data - the data of the option to update. Example: {pos: 3, data:[3, "Andrea"]}
 */
Client.IonSelect.prototype.updateOption = function (data)
{
  var opt = this.options[data.pos];
  opt.value = data.data[0];
  opt.text = data.data[1];
  opt.src = data.data[2];
};


/**
 * Set custom error message
 * @param {String} message - the error message
 * @param {bool} srv
 */
Client.IonSelect.prototype.setError = function (message, srv)
{
  Client.Element.prototype.setError.call(this, message, srv);
  //
  setTimeout(function () {
    if (this.domObj && this.domObj.parentNode) {
      if (message)
        this.domObj.parentNode.classList.add("is-invalid");
      else
        this.domObj.parentNode.classList.remove("is-invalid");
    }
    if (!this.errObj && message) {
      this.errObj = document.createElement("div");
      this.errObj.className = "select-error-message";
      this.domObj.appendChild(this.errObj);
    }
    if (this.errObj) {
      this.errObj.innerText = message;
      this.errObj.style.display = message ? "" : "none";
    }
  }.bind(this), 10);
};

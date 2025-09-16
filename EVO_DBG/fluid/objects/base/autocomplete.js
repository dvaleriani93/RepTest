/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class An select (autocomplete) element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the input
 */
Client.Autocomplete = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  // Create the container
  this.domObj = document.createElement("div");
  this.domObj.setAttribute("tabindex", "0");
  this.domObj.className = "element-autocomplete-container";
  //
  // Base properties
  this.valueList = [];
  this.hasImage = false;  // Left icon - shown only when the selected item has an image
  this.canFilter = true;     // The Autocomplete could be filtered by writing into the input
  //  this.disabled = false;
  //  this.placeholder = '';
  //  this.rowClass = '';
  //  this.filter = '';
  //  this.rightImage = '';
  //  this.acceptNewValues = false;
  //  this.rowStyle;
  //
  // Set readonly attribute to input element in case of readonly role
  if (Client.clientRole === "ro")
    element.readonly = true;
  //
  // During construction set the canFilter property before the realize,
  // it will be used to create the correct objects
  if (element.canFilter !== undefined) {
    this.canFilter = element.canFilter;
    delete element.canFilter;
  }
  //
  // If we have no value set "" so the placeholder can be set
  if (element.value === undefined)
    element.value = "";
  //
  this.realize();
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  // If the autocomplete has no filter we use a standard chevron at the right
  if (!this.canFilter && this.rightImage === undefined) {
    this.rightImage = "svg:icon-caret-dropdown";
    this.updateRightIcon(this.rightImage);
  }
  //
  parent.appendChildObject(this, this.domObj);
};


// Make Client.Input extend Client.Element
Client.Autocomplete.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Autocomplete.prototype.updateElement = function (el)
{
  var pthis = this;
  this.purgeMyProp(el);
  //
  // If there is a list of options, add them to the select
  // List example: [{"n":"Andrew","v":1},{"n":"Mary","v":2},{"n":"Luke","v":3}]
  if (el.list) {
    //
    // If el.list is a string make it a json object
    if (typeof el.list === "string")
      el.list = JSON.parse(el.list);
    //
    this.valueList = el.list;
    //
    // Base class must not use the list property
    delete el.list;
  }
  //
  // If the select is bound to a datamap, the data property contains current options
  if (el.data) {
    // There are four cases
    // resetting options, or add/delete/update them
    if (el.data.columns)
      this.initOptions(el); // Reset case
    else if (el.data.pos !== undefined) {
      if (el.data.data) // Update case
        this.updateOption(el.data);
      else  // Remove case
        this.removeOption(el.data.pos);
    }
    else  // Add case
      this.addOption(el.data.data);
    //
    // updates the combo
    if (!this.comboTimer) {
      this.comboTimer = window.setTimeout(function () {
        pthis.updateCombo();
      }, 10);
    }
    //
    // If there is a rawvalue but not a real value maybe the value was arrived before the list,
    // in this case re-search the value
    if (this.rawvalue && (!this.value || !this.comboObj?.dialog))
      this.setValue(this.rawvalue, true);
    //
    // Base class must not use the data property
    delete el.data;
  }
  //
  if (el.value !== undefined) {
    this.setValue(el.value, true);
    delete el.value;
  }
  if (el.placeholder !== undefined) {
    this.placeholder = el.placeholder;
    if (this.captionObj && this.captionObj.tagName.toLowerCase() === "input")
      this.captionObj.placeholder = this.placeholder;
    else if (this.rawvalue === "" && this.captionObj && this.captionObj.tagName.toLowerCase() === "span") {
      this.captionObj.textContent = this.placeholder;
      this.captionObj.classList.add("element-autocomplete-placeholder");
    }
    delete el.placeholder;
  }
  if (el.readonly !== undefined) {
    // If the client is readonly the element is readonly
    this.readonly = el.readonly || Client.clientRole === "ro";
    this.captionObj.disabled = this.readonly || this.disabled;
  }
  if (el.disabled !== undefined) {
    this.disabled = el.disabled;
    this.captionObj.disabled = this.readonly || this.disabled;
  }
  if (el.rowClass) {
    this.rowClass = el.rowClass;
  }
  if (this.canFilter && (el.filter || el.filter === null)) {
    if (el.filter === null) {
      this.closeCombo();
    }
    else {
      if (el.filter === " ")
        el.filter = "";
      this.captionObj.value = el.filter;
      this.openCombo(el.filter);
    }
    delete el.filter;
  }
  if (el.rowStyle !== undefined) {
    if (typeof el.rowStyle === "string")
      el.rowStyle = JSON.parse(el.rowStyle);
    this.rowStyle = el.rowStyle;
    delete el.rowStyle;
  }
  if (el.acceptNewValues !== undefined) {
    this.acceptNewValues = el.acceptNewValues;
    delete el.acceptNewValues;
  }
  if (el.rightImage !== undefined) {
    this.rightImage = el.rightImage;
    delete el.rightImage;
    this.updateRightIcon(this.rightImage);
  }
  //
  // The canFilter property is changed, call realize so we the caption object will be
  // destroyed and recreated as input or span
  if (el.canFilter !== undefined && el.canFilter !== this.canFilter) {
    this.canFilter = el.canFilter;
    this.realize();
    delete el.canFilter;
  }
  //
  // Add required "select" class
  if (el.className) {
    el.className = "element-autocomplete-container " + (this.readonly ? "element-autocomplete-readonly " : "") +
            (this.disabled ? "element-autocomplete-disabled " : "") + el.className;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Add events listeners
 */
Client.Autocomplete.prototype.addEventsListeners = function ()
{
  if (this.canFilter) {
    this.captionObj.onblur = (ev) => this.onInputBlur(ev);
    this.captionObj.oninput = (ev) => this.onInputChange(ev);
    this.captionObj.onfocus = (ev) => this.onInputFocus(ev);
  }
  //
  this.rightIconObj.onclick = (ev) => Client.mainFrame.sendEvents([{obj: this.id, id: "onClick", content: this.saveEvent(ev)}]);
  //
  this.domObj.addEventListener("click", () => this.onClick());
  this.domObj.onkeydown = (ev) => this.onInputKeyDown(ev);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.Autocomplete.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendChanges = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Realize the select objects
 * called at the creation or when changes the 'canFilter' property
 */
Client.Autocomplete.prototype.realize = function ()
{
  if (!this.iconObj) {
    this.iconObj = document.createElement("img");
    this.iconObj.className = "element-autocomplete-icon";
    this.domObj.appendChild(this.iconObj);
  }
  //
  var caption = document.createElement(this.canFilter ? "input" : "span");
  caption.className = this.canFilter ? "element-autocomplete-input" : "element-autocomplete-caption";
  if (this.canFilter)
    caption.type = "text";
  //
  if (this.captionObj) {
    this.domObj.insertBefore(caption, this.captionObj);
    this.domObj.removeChild(this.captionObj);
  }
  else
    this.domObj.appendChild(caption);
  this.captionObj = caption;
  //
  if (!this.rightIconObj) {
    this.rightIconObj = document.createElement("img");
    this.rightIconObj.className = "element-autocomplete-righticon";
    this.rightIconObj.style.display = "none";
    this.domObj.appendChild(this.rightIconObj);
  }
  //
  this.addEventsListeners();
};


/**
 * Realize the select objects
 * @param {any} value
 * @param {bool} mantain - if true the raw value is mantained also if the value is not found and the
 *                         autocomplete doesn't accept new values (is from the server, maybe the list
 *                         will arrive)
 */
Client.Autocomplete.prototype.setValue = function (value, mantain)
{
  this.rawvalue = value;
  this.value = this.searchValue(value);
  //
  // Resetting style used to highlight filter
  if (this.laststyle) {
    this.updateStyle(this.domObj, this.laststyle, false);
    this.laststyle = null;
  }
  //
  if (!this.value) {
    if (this.acceptNewValues || mantain) {
      // No value found, accept the rawValue
      this.updateIcon("");
      this.captionObj.classList.remove("element-autocomplete-placeholder");
      //
      if (this.captionObj.tagName.toLowerCase() === "span")
        this.captionObj.textContent = this.rawvalue;
      else
        this.captionObj.value = this.rawvalue;
    }
    else {
      // No value found
      this.rawvalue = "";
      this.updateIcon();
      if (this.placeholder) {
        if (this.captionObj.tagName.toLowerCase() === "span")
          this.captionObj.textContent = this.placeholder;
        else
          this.captionObj.value = "";
        this.captionObj.classList.add("element-autocomplete-placeholder");
      }
      else {
        if (this.captionObj.tagName.toLowerCase() === "span")
          this.captionObj.textContent = "";
        else
          this.captionObj.value = "";
      }
      //
      this.captionObj.removeAttribute("title");
    }
  }
  else {
    // A value was found
    this.updateIcon(this.value.src);
    //
    this.captionObj.classList.remove("element-autocomplete-placeholder");
    if (this.captionObj.tagName.toLowerCase() === "span")
      this.captionObj.textContent = this.value.n;
    else
      this.captionObj.value = this.value.n;
    if (this.value.d)
      this.captionObj.title = this.value.d;
    //
    if (this.value.s) {
      this.updateStyle(this.domObj, this.value.s, true);
      this.laststyle = this.value.s;
    }
  }
};


/**
 * update the style of the item or row
 * @param {object} obj
 * @param {string} style
 * @param {bool} add
 */
Client.Autocomplete.prototype.updateStyle = function (obj, style, add)
{
  if (style.indexOf(":") > -1) { // style
    if (add)
      obj.style.cssText += style;
    else
      obj.style.cssText = obj.style.cssText.replace(style, "");
  }
  else { // class
    if (add)
      obj.classList.add(style);
    else
      obj.classList.remove(style);
  }
};


/**
 * clicked on the select.
 */
Client.Autocomplete.prototype.onClick = function ()
{
  if (this.canFilter === false && !this.readonly && !this.disabled && (!this.comboObj || !this.comboObj.dialog)) // Open the combo if the select is enabled, not opened and hasn't the input
    this.openCombo();
  else if (this.canFilter)
    this.captionObj.focus();
};


/**
 * clicked out of the input
 * @param {MouseEvent} ev
 */
Client.Autocomplete.prototype.onInputBlur = function (ev)
{
  if (!this.comboClicked) {
    // The user clicked outside the combo, if the user wrote/selected a vealue we must reselect that,
    // but if the text writte is changed we must accept the new value (but not if the user pressed esc, in that case we confirm
    // the last value)
    if (this.acceptNewValues && !this.escPressed) {
      this.selectValue(this.captionObj.value !== this.rawvalue ? this.captionObj.value : this.rawvalue, ev);
    }
    else {
      // Get the selected value and check if the input contains it, the user could have
      // deleted/added chars but clicked off the combo, in this case we must rewrite the correct value
      if (this.rawvalue !== undefined)
        this.setValue(this.rawvalue);
    }
  }
};


/**
 * The input got focus: open the combo
 */
Client.Autocomplete.prototype.onInputFocus = function ()
{
  if (!this.readonly && !this.disabled)
    this.openCombo(this.captionObj.value);
};


/**
 * clicked out of the input
 */
Client.Autocomplete.prototype.onInputChange = function ()
{
  if (this.readonly || this.disabled)
    return;
  //
  if (this.dataBound)
    this.sendFilter(this.captionObj.value);
  else
    this.openCombo(this.captionObj.value);
};


/**
 * search for value
 * @param {any} value
 */
Client.Autocomplete.prototype.searchValue = function (value)
{
  for (var i = 0; i < this.valueList.length; i++) {
    // NO === because value could be a string while valueList data could be numeric
    if (this.valueList[i].v == value) // jshint ignore:line
      return this.valueList[i];
  }
};


/**
 * open the combo box, filtering for value
 * @param {any} value
 * @param {bool} sendFilter
 */
Client.Autocomplete.prototype.openCombo = function (value, sendFilter)
{
  if (sendFilter === undefined)
    sendFilter = true;
  //
  // Creating combo dialog, if not already done
  if (!this.comboObj) {
    this.comboObj = new Client.MenuList({className: "element-autocomplete-dialog"}, this.view.getRootView(), this.view.getRootView());
    //
    var pthis = this;
    this.comboObj.changeCallback = function (ev) {
      var obj = ev.srcElement;
      while (obj && !obj.id) {
        obj = obj.parentNode;
      }
      var i = parseInt(obj.id);
      pthis.selectValue(pthis.filterList[i], ev);
    };
    this.comboObj.domObj.addEventListener("mousedown", function () {
      pthis.comboClicked = true;
    }, {passive: true, capture: true});
    this.comboObj.domObj.addEventListener("touchstart", function () {
      pthis.comboClicked = true;
    }, {passive: true, capture: true});
    //
    if (this.canFilter === false) {
      this.comboObj.domObj.tabIndex = "1000";
      this.comboObj.domObj.onkeydown = function (ev) {
        ev.preventDefault();
        pthis.onInputKeyDown(ev);
      };
    }
  }
  //
  this.attValue = this.acceptNewValues ? -1 : 0;
  this.filterList = [];
  //
  // If no filtering (value undefined) and we have a value seacrh if present in the list and in that case select it (with !value the list is not filtered,
  // so we can use directly the value index)
  if (value === undefined && this.value && this.value.v) {
    for (var j = 0; j < this.valueList.length; j++)
      if (this.valueList[j].v === this.value.v) {
        this.attValue = j;
        break;
      }
  }
  //
  // Empty combo box
  var oldHeight = this.comboObj.domObj.offsetHeight;
  this.comboObj.hide();
  if (this.comboObj.elements) {
    while (this.comboObj.elements.length > 0)
      this.comboObj.removeChild({id: this.comboObj.elements[0].id});
  }
  this.comboObj.domObj.style.width = this.domObj.clientWidth + "px";
  //
  // Filter actual options to fill the combo dialog
  var exp = this.canFilter ? new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i") : {};
  //
  this.hasImage = false;
  for (var i = 0; i < this.valueList.length; i++) {
    var aval = this.valueList[i];
    //
    if (aval.src)
      this.hasImage = true;
    //
    var idx = this.canFilter ? aval.n.search(exp) : 0;
    if (idx > -1) {
      this.filterList.push(aval);
      var arow = {class: "MenuItem", caption: aval.n, detail: aval.d, image: aval.src};
      if (value) {
        arow.hlpos = idx;
        arow.hllen = value.length;
      }
      var aitem = this.comboObj.insertBefore({child: arow});
      aitem.domObj.id = (this.filterList.length - 1) + "";
      //
      // Add the class of the row if present
      if (this.rowClass)
        aitem.domObj.classList.add(this.rowClass);
      //
      // Set the row style if present
      if (this.rowStyle) {
        var kk = Object.keys(this.rowStyle);
        for (var j = 0; j < kk.length; j++) {
          var pr = kk[j];
          var v = this.rowStyle[pr];
          if (Client.Utils.requireAbs(pr))
            v = Client.Utils.abs(v);
          aitem.domObj.style[pr] = v;
        }
      }
      //
      // If the value has a style set it
      if (aval.s)
        this.updateStyle(aitem.domObj, aval.s, true);
      //
      // if we don't accept new values don't select the row
      if ((!this.acceptNewValues && value !== undefined && this.filterList.length === 1) || (!value && this.attValue === i))
        aitem.domObj.classList.add("element-autocomplete-attvalue");
      //
      // In mobile the items must be bigger
      if (Client.mainFrame.device.isMobile)
        aitem.domObj.classList.add("element-autocomplete-mobile-row");
    }
  }
  //
  this.comboObj.domObj.style.width = this.domObj.offsetWidth + "px";
  this.comboObj.show(this.id);
  //
  // Rewrite the autoclose function to use the animation
  var _this = this;
  this.comboObj.dialog.autoClose = function (ev) {
    _this.comboAutoHide(ev);
  };
  //
  // Handle the opening/filtering animation
  // a) get the new height
  var starting = oldHeight;
  var cmbClone = this.comboObj.domObj.cloneNode(true);
  cmbClone.style.height = "";
  document.body.appendChild(cmbClone);
  var ending = cmbClone.offsetHeight;
  document.body.removeChild(cmbClone);
  //
  // Create the animation and animate using tween
  if (this.openAnimation)
    this.openAnimation.stop();
  this.openAnimation = new Tweenable();
  //
  var config = {
    from: {height: starting},
    to: {height: ending},
    duration: 300,
    easing: "easeOutQuart",
    step: function (state) {
      _this.comboObj.domObj.style.height = state.height + "px";
    },
    start: function () {
      _this.comboObj.domObj.style.overflow = "hidden";
    },
    finish: function () {
      _this.comboObj.domObj.style.overflow = "";
      _this.openAnimation = null;
    }
  };
  this.openAnimation.tween(config);
  //
  if (sendFilter)
    this.sendFilter(value ? value : " ");
};


/**
 * close the combo box
 */
Client.Autocomplete.prototype.closeCombo = function ()
{
  if (this.comboObj) {
    if (this.openAnimation)
      this.openAnimation.stop();
    //
    this.openAnimation = new Tweenable();
    var _this = this;
    var config = {
      from: {height: _this.comboObj.domObj.offsetHeight},
      to: {height: 0},
      duration: 300,
      easing: "easeOutQuart",
      step: function (state) {
        _this.comboObj.domObj.style.height = state.height + "px";
      },
      start: function () {
        _this.comboObj.domObj.style.overflow = "hidden";
      },
      finish: function () {
        _this.comboObj.domObj.style.overflow = "";
        _this.comboObj.domObj.style.height = "";
        _this.openAnimation = null;
        _this.comboObj.hide();
        _this.closeTime = new Date();
        _this.sendFilter(null);
      }
    };
    this.openAnimation.tween(config);
  }
  //
  this.comboClicked = false;
};


/**
 * Closes the combo when clickin outside
 * @param {DomEvent} ev
 */
Client.Autocomplete.prototype.comboAutoHide = function (ev)
{
  if (ev.target === this.domObj || ev.target === this.captionObj)
    return;
  //
  // Avoid MenuList click
  var clickedEl = ev.target;
  var parent = clickedEl;
  while (parent) {
    if (parent === this.comboObj.domObj)
      return;
    parent = parent.parentNode;
  }
  //
  this.closeCombo();
};


/**
 * commit a value
 * @param {string} value
 * @param {event} ev
 */
Client.Autocomplete.prototype.selectValue = function (value, ev)
{
  if (typeof value === "string")
    value = {v: value};
  //
  var e = [{obj: this.id, id: "chgProp", content: {name: "value", value: value.v, clid: Client.id}}];
  if (this.sendChanges)
    e.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
  if (!Client.mainFrame.isEditing())
    Client.mainFrame.sendEvents(e);
  this.setValue(value.v);
};


/**
 * send filter value
 * @param {string} value
 * @param {event} ev
 */
Client.Autocomplete.prototype.sendFilter = function (value, ev)
{
  var e = [{obj: this.id, id: "chgProp", content: {name: "filter", value: value, clid: Client.id}}];
  e.push({obj: this.id, id: "onFilter", content: Object.assign({filter: value}, this.saveEvent(ev))});
  if (!Client.mainFrame.isEditing())
    Client.mainFrame.sendEvents(e);
};


/**
 * Update the combo icon
 * @param {string} src
 */
Client.Autocomplete.prototype.updateIcon = function (src)
{
  if (!src) {
    if (this.hasImage)
      this.iconObj.style.visibility = "hidden";
    else
      this.iconObj.style.display = "none";
    return;
  }
  //
  var imgtype = "img";
  if (src.substring(0, 4) === "svg:")
    imgtype = "svg";
  if (src.substring(0, 4) === "cls:")
    imgtype = "div";
  if (this.iconObj.tagName !== imgtype) {
    var ni;
    if (imgtype === "svg") {
      ni = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      ni.setAttribute("class", "element-autocomplete-icon");
      this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      ni.appendChild(this.use);
    }
    else {
      ni = document.createElement(imgtype);
      ni.className = "element-autocomplete-icon";
      this.use = null;
    }
    this.iconObj.parentNode.insertBefore(ni, this.iconObj);
    this.iconObj.parentNode.removeChild(this.iconObj);
    this.iconObj = ni;
  }
  //
  if (this.use)
    this.use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + src.substring(4));
  else if (imgtype === "div")
    this.iconObj.className = "element-autocomplete-icon " + src.substring(4);
  else
    this.iconObj.src = src;
  this.iconObj.style.visibility = "";
  this.iconObj.style.display = "";
};


/**
 * Update the right combo icon
 * @param {string} src
 */
Client.Autocomplete.prototype.updateRightIcon = function (src)
{
  if (!src) {
    this.rightIconObj.style.display = "none";
    return;
  }
  //
  var imgtype = "img";
  if (src.substring(0, 4) === "svg:")
    imgtype = "svg";
  if (src.substring(0, 4) === "cls:")
    imgtype = "div";
  if (this.rightIconObj.tagName !== imgtype) {
    var ni;
    if (imgtype === "svg") {
      ni = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      ni.setAttribute("class", "element-autocomplete-righticon");
      this.rightUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
      ni.appendChild(this.rightUse);
    }
    else {
      ni = document.createElement(imgtype);
      ni.className = "element-autocomplete-righticon";
      this.rightUse = null;
    }
    this.rightIconObj.parentNode.insertBefore(ni, this.rightIconObj);
    this.rightIconObj.parentNode.removeChild(this.rightIconObj);
    this.rightIconObj = ni;
  }
  //
  if (this.rightUse)
    this.rightUse.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + src.substring(4));
  else if (imgtype === "div")
    this.rightIconObj.className = "element-autocomplete-righticon " + src.substring(4);
  else
    this.rightIconObj.src = src;
  this.rightIconObj.style.visibility = "";
  this.rightIconObj.style.display = "";
};


/**
 * Key Press of the Input (CanFilter Combo)
 * @param {Event} ev
 */
Client.Autocomplete.prototype.onInputKeyDown = function (ev)
{
  var k = ev.keyCode;
  //
  // Enter
  if (k === 13) {
    var v = "";
    if (!this.acceptNewValues)
      v = (this.attValue < this.filterList.length ? this.filterList[this.attValue] : (this.rawvalue ? this.rawvalue : ""));
    else {
      if (this.attValue >= 0 && this.attValue < this.filterList.length)
        v = this.filterList[this.attValue];
      else
        v = this.captionObj.value;
    }
    this.selectValue(v);
    //
    // in a filtering combo without acceptNewValues if the user writes a 'invalid filter' (eg: no items)
    // we must clear the filtering and reopen the combo
    if (v === "" && this.canFilter && !this.acceptNewValues)
      this.openCombo("");
    else {
      this.closeCombo();
      this.captionObj.blur();
    }
  }
  // ESC
  if (k === 27) {
    this.escPressed = true;
    this.captionObj.blur();
    this.escPressed = false;
    this.closeCombo();
  }
  // UP
  if (k === 38) {
    ev.preventDefault();
    this.updateAttValue(this.attValue - 1);
  }
  // DOWN
  if (k === 40) {
    ev.preventDefault();
    this.updateAttValue(this.attValue + 1);
  }
};


/**
 * changes actual selected value
 * @param {string} newValue
 */
Client.Autocomplete.prototype.updateAttValue = function (newValue)
{
  if (newValue < 0)
    newValue = 0;
  if (newValue >= this.filterList.length)
    newValue = this.filterList.length - 1;
  if (newValue !== this.attValue) {
    var c = this.comboObj.elements[this.attValue] ? this.comboObj.elements[this.attValue].domObj : null;
    if (c)
      c.classList.remove("element-autocomplete-attvalue");
    //
    this.attValue = newValue;
    c = this.comboObj.elements[this.attValue].domObj;
    c.classList.add("element-autocomplete-attvalue");
    if (c.offsetTop + c.offsetHeight > this.comboObj.domObj.clientHeight + this.comboObj.domObj.scrollTop)
      this.comboObj.domObj.scrollTop = (c.offsetTop + c.offsetHeight) - this.comboObj.domObj.clientHeight;
    if (c.offsetTop < this.comboObj.domObj.scrollTop)
      this.comboObj.domObj.scrollTop = c.offsetTop;
  }
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 */
Client.Autocomplete.prototype.close = function (firstLevel)
{
  this.closeCombo();
  Client.Element.prototype.close.call(this, firstLevel);
};


/**
 * Initialize the input
 * @param {Object} el - element representation
 */
Client.Autocomplete.prototype.initOptions = function (el)
{
  this.colIndex = {v: -1, n: -1};
  this.valueList = [];
  this.dataBound = true;
  //
  // Search for pre-defined column names in the recordset
  for (var i = 0; i < el.data.columns.length; i++) {
    var c = el.data.columns[i].toLowerCase();
    if (c === "id" || c === "code" || c === "value" || c === "v")
      this.colIndex.v = i;
    if (c === "name" || (c === "description" && this.colIndex.n === -1) || c === "n")
      this.colIndex.n = i;
    if (c === "image" || c === "icon" || c === "src")
      this.colIndex.i = i;
    if ((c === "description" && this.colIndex.n !== i) || c === "detail" || c === "d")
      this.colIndex.d = i;
    if (c === "style" || c === "class" || c === "s")
      this.colIndex.s = i;
  }
  if (this.colIndex.v === -1)
    this.colIndex.v = 0;
  if (this.colIndex.n === -1)
    this.colIndex.n = el.data.columns.length > 0 ? 1 : 0;
  //
  var k = Object.keys(el.data.data);
  for (var j = 0; j < k.length; j++) {
    i = k[j];
    this.addOption(el.data.data[i]);
  }
};


/**
 * Remove an option from the select at the given position
 * @param {int} pos - the position of the option to remove
 */
Client.Autocomplete.prototype.removeOption = function (pos)
{
  this.valueList.splice(pos, 1);
};


/**
 * Add an option to the select
 * @param {Array} data - the option to add. The first element of the array represents the value,
 *                       the second element represents the text
 */
Client.Autocomplete.prototype.addOption = function (data)
{
  if (!this.colIndex)
    return;
  //
  var x = {v: data[this.colIndex.v], n: data[this.colIndex.n]};
  if (this.colIndex.i !== undefined)
    x.src = data[this.colIndex.i];
  if (this.colIndex.s !== undefined)
    x.s = data[this.colIndex.s];
  if (this.colIndex.d !== undefined)
    x.d = data[this.colIndex.d];
  this.valueList.push(x);
};


/**
 * Update a select option
 * @param {Object} data - the data of the option to update. Example: {pos: 3, data:[3, "Andrea"]}
 */
Client.Autocomplete.prototype.updateOption = function (data)
{
  if (!this.colIndex)
    return;
  //
  var v = this.valueList[data.pos];
  v.v = data.data[this.colIndex.v];
  v.n = data.data[this.colIndex.n];
  if (this.colIndex.i !== undefined)
    v.src = data.data[this.colIndex.i];
  if (this.colIndex.s !== undefined)
    v.s = data.data[this.colIndex.s];
  if (this.colIndex.d !== undefined)
    v.d = data.data[this.colIndex.d];
};


/**
 * Update the options in the combobox
 */
Client.Autocomplete.prototype.updateCombo = function ()
{
  if (this.comboObj && this.comboObj.dialog)
    this.openCombo(this.captionObj.value, false);
  //
  this.comboTimer = 0;
};


/**
 * This object will open the keyboard on tap
 */
Client.Autocomplete.prototype.wantInput = function ()
{
  return this.canFilter;
};

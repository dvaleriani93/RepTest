/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */


/**
 * @class A container for an input
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonAutoComplete = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.outerObj = document.createElement("ion-input");
  this.outerObj.className = "ion-autocomplete";
  //
  this.iconValueObj = document.createElement("div");
  this.iconValueObj.className = "value-icon";
  this.iconValueObj.style.display = "none";
  //
  this.outerObj.appendChild(this.iconValueObj);
  //
  this.heightResize = element.heightResize;
  delete element.heightResize;
  //
  if (this.heightResize) {
    this.domObj = document.createElement("span");
    this.domObj.contentEditable = true;
    this.domObj.className = "ion-autocomplete-input";
    this.domObj.style.pointerEvents = "auto";
  }
  else {
    this.domObj = document.createElement("input");
    this.domObj.className = "text-input ion-autocomplete-input";
  }
  //
  this.backdrop = "combo";
  this.allowNull = false;
  this.comboClass = "";
  this.valueList = [];
  this.valueSeparator = ",";
  this.nameSeparator = ", ";
  //
  this.outerObj.appendChild(this.domObj);
  //
  this.labelObj = document.createElement("ion-label");
  //
  this.iconObj = document.createElement("div");
  this.iconObj.className = "select-icon";
  this.iconObj.style.display = "none";
  this.innerObj = document.createElement("div");
  this.innerObj.className = "select-icon-inner";
  this.iconObj.appendChild(this.innerObj);
  this.outerObj.appendChild(this.iconObj);
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
  if (Client.IonItem && parent instanceof Client.IonItem)
    parent.domObj.classList.add("item-input");
  //
  this.addEventsListeners();
};

Client.IonAutoComplete.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonAutoComplete.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  let updateCombo;
  //
  if (el.multiple !== undefined) {
    this.multiple = el.multiple;
    delete el.mutiple;
  }
  if (el.valueSeparator !== undefined) {
    this.valueSeparator = el.valueSeparator;
    delete el.valueSeparator;
  }
  if (el.nameSeparator !== undefined) {
    this.nameSeparator = el.nameSeparator;
    delete el.nameSeparator;
  }
  if (el.className !== undefined) {
    this.outerObj.className = "ion-autocomplete " + el.className;
    delete el.className;
  }
  if (el.label !== undefined) {
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
    if (el.labelPosition) {
      this.labelObj.setAttribute(this.labelPosition, "");
      if (this.parent instanceof Client.IonItem)
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
  if (el.showIcon !== undefined) {
    this.iconValueObj.style.display = el.showIcon ? "" : "none";
    delete el.showIcon;
  }
  if (el.clear !== undefined) {
    this.clearObj.style.display = el.clear ? "" : "none";
  }
  if (el.disabled !== undefined) {
    this.disabled = el.disabled;
    if (this.disabled && (this.isOpening() || this.isOpen()))
      this.closeCombo();
  }
  if (el.acceptNewValues !== undefined) {
    this.acceptNewValues = el.acceptNewValues;
    delete el.acceptNewValues;
  }
  if (el.backdrop !== undefined) {
    this.backdrop = el.backdrop;
    delete el.backdrop;
  }
  if (el.autoAccept !== undefined) {
    this.autoAccept = el.autoAccept;
    delete el.autoAccept;
  }
  if (el.openOnFocus !== undefined) {
    this.openOnFocus = el.openOnFocus;
    //
    this.iconObj.style.display = this.openOnFocus === true ? "" : "none";
    //
    delete el.openOnFocus;
  }
  if (el.allowNull !== undefined) {
    this.allowNull = el.allowNull;
    delete el.allowNull;
  }
  if (el.comboClass !== undefined) {
    this.comboClass = el.comboClass;
    delete el.comboClass;
  }
  if (el.dontClose !== undefined) {
    this.dontClose = el.dontClose;
    delete el.dontClose;
  }
  if (el.noFilter !== undefined) {
    this.noFilter = el.noFilter;
    delete el.noFilter;
  }
  if (el.readOnly !== undefined) {
    this.readOnly = el.readOnly;
    delete el.readOnly;
    this.domObj.readOnly = this.readOnly;
  }
  //
  if (el.list) {
    //
    // If el.list is a string make it a json object
    if (typeof el.list === "string")
      el.list = JSON.parse(el.list);
    //
    this.valueList = el.list;
    //
    updateCombo = true;
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
    updateCombo = true;
    //
    // Base class must not use the data property
    delete el.data;
  }
  //
  if (el.value !== undefined) {
    this.setValue(el.value);
    delete this.filter;
    delete el.value;
    //
    // If I'm in telecollaboration or testauto case, I want to be sure
    // that other clients close the autocomplete when a value is chosen
    if (el.clid && el.clid !== Client.id)
      this.closeCombo();
  }
  //
  if (el.filter !== undefined) {
    this.domObj.value = el.filter;
    this.filter = el.filter;
    delete el.filter;
  }
  //
  if (el.selectedText !== undefined) {
    this.domObj.value = el.selectedText;
    delete el.selectedText;
  }
  //
  if (el.highlightFirstOption !== undefined) {
    this.highlightFirstOption = el.highlightFirstOption;
    delete el.highlightFirstOption;
  }
  //
  if (el.tabindex) {
    // Sometimes we need to handle the tabindex of the element
    this.domObj.setAttribute("tabindex", el.tabindex);
  }
  //
  // Update combo if needed
  if (updateCombo)
    this.updateCombo();
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Return a copy of the element
 * @param {Object} config
 * @param {Client.Element} parent
 * @param {Map} referencesMap
 */
Client.IonAutoComplete.prototype.clone = function (config, parent, referencesMap)
{
  let el = Client.Element.prototype.clone.call(this, config, parent, referencesMap);
  //
  // Since I just cloned the element, its parent scroll event listener is not valid. It will be added on combo open
  delete el.onParentScrollListener;
  //
  return el;
};


/**
 * Add events listeners
 */
Client.IonAutoComplete.prototype.addEventsListeners = function ()
{
  // In case of height resize, domObj is an editable span.
  // So make editable span behaves as an input
  if (this.heightResize)
    Client.Element.simulateInput({domObj: this.domObj});
  //
  this.clearObj.onmousedown = (ev) => {
    this.clearts = ev.timeStamp;
    this.domObj.value = "";
    this.onInputChange(!this.openOnFocus);
    if (this.allowNull) {
      this.setValue(null, true, ev);
      this.closeCombo();
    }
    //
    this.domObj.focus();
    return false;
  };
  //
  this.clearObj.ontouchstart = (ev) => {
    ev.preventDefault();
    this.domObj.value = "";
    this.onInputChange(!this.openOnFocus);
    if (this.allowNull) {
      this.setValue(null, true, ev);
      this.closeCombo();
    }
    //
    this.domObj.focus();
    return false;
  };
  //
  this.domObj.addEventListener("focus", (ev) => this.onInputFocus());
  //
  this.outerObj.addEventListener("click", (ev) => {
    if (ev.timeStamp - this.clearts < 500)
      return;
    this.onInputClick();
  });
  this.domObj.addEventListener("blur", (ev) => this.onInputBlur(ev));
  this.domObj.addEventListener("input", (ev) => this.onInputChange());
  this.domObj.addEventListener("keydown", (ev) => {
    if (this.heightResize && ev.keyCode === 13)
      ev.preventDefault();
    //
    this.onInputKeyDown(ev);
  }, true);
  //
  this.domObj.onkeyup = (ev) => this.onInputKeyUp(ev);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonAutoComplete.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendChanges = true;
  }
  var pos = events.indexOf("onFilter");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.dataBound = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Return the dom root object of this element
 * @returns {DomElement}
 */
Client.IonAutoComplete.prototype.getRootObject = function ()
{
  return this.outerObj;
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IonAutoComplete.prototype.close = function (firstLevel, triggerAnimation)
{
  if (this.comboObj) {
    this.comboObj.remove();
    if (this.combo2)
      this.combo2.remove();
  }
  this.closed = true;
  //
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
};


/**
 * Initialize the input
 * @param {Object} el - element representation
 */
Client.IonAutoComplete.prototype.initOptions = function (el)
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
    if (c.indexOf("name") > -1 || (c.indexOf("description") > -1 && this.colIndex.n === -1) || c === "n")
      this.colIndex.n = i;
    if (c.indexOf("image") > -1 || c.indexOf("icon") > -1 || c === "src")
      this.colIndex.i = i;
    if ((c.indexOf("description") > -1 && this.colIndex.n !== i) || c.indexOf("detail") > -1 || c === "d")
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
Client.IonAutoComplete.prototype.removeOption = function (pos)
{
  this.valueList.splice(pos, 1);
};


/**
 * Add an option to the select
 * @param {Array} data - the option to add. The first element of the array represents the value,
 *                       the second element represents the text
 */
Client.IonAutoComplete.prototype.addOption = function (data)
{
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
Client.IonAutoComplete.prototype.updateOption = function (data)
{
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
 * The input got focus: open the combo
 */
Client.IonAutoComplete.prototype.onInputFocus = function ()
{
  if (Client.mainFrame.isEditing())
    return;
  if (this.disabled || this.readOnly)
    return;
  //
  if (this.parent.domObj) {
    this.parent.domObj.classList.add("input-has-focus");
    if (this.focusColor)
      this.parent.domObj.setAttribute("focuscolor", this.focusColor);
  }
  //
  if (this.noFilter && !Client.mainFrame.device.isMobile)
    this.setSelection(0, 9999);
};


/**
 * The input got focus: open the combo
 */
Client.IonAutoComplete.prototype.onInputClick = function ()
{
  this.clearDismissTimeouts();
  //
  if (Client.mainFrame.isEditing())
    return;
  if (this.disabled || this.readOnly)
    return;
  //
  if (this.domObj.getAttribute("opencombo") === "no")
    return;
  //
  if (!this.noReopen) {
    setTimeout(() => {
      if (this.disabled || !this.openOnFocus)
        return;
      //
      this.openCombo(this.openOnFocus ? "" : undefined);
      //
      // This method is called when the user clicks on the select icon or the outer object
      // we need to focus the input also in these cases.
      this.domObj.focus();
      //
      if (this.dataBound && this.openOnFocus) {
        this.sendFilter(" ");
        this.fullCombo = true;
      }
    }, 200);
  }
  //
  delete this.noReopen;
};


/**
 * Filter has changed
 * @param {Boolean} nolist
 */
Client.IonAutoComplete.prototype.onInputChange = function (nolist)
{
  if (this.disabled)
    return;
  //
  if (Client.mainFrame.isEditing())
    return;
  if (this.lastChange === this.domObj.value)
    return;
  //
  this.lastChange = this.domObj.value;
  //
  this.valueHasChanged = true;
  //
  if (this.parent.domObj)
    this.parent.domObj.classList.toggle("input-has-value", this.domObj.value);
  //
  if (nolist)
    this.openCombo();
  else {
    if (this.dataBound) {
      this.sendFilter(this.domObj.value);
      this.fullCombo = true;
    }
    else
      this.openCombo(this.domObj.value);
  }
};


/**
 * Clicked out of the input
 * @param {MouseEvent} ev
 */
Client.IonAutoComplete.prototype.onInputBlur = function (ev)
{
  if (this.dontClose)
    return;
  //
  var rt = ev.relatedTarget;
  var incombo = false;
  while (rt) {
    if (rt === this.comboObj) {
      incombo = true;
      break
    }
    rt = rt.parentNode;
  }
  if (!incombo) {
    if (this.parent.domObj) {
      this.parent.domObj.classList.remove("input-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    }
    if (this.isOpening() || this.isOpen()) {
      if (this.autoAccept)
        this.accept({skipFocus: true});
      else
        this.dismiss(false);
    }
  }
};


/**
 * Send filter value
 * @param {string} value
 * @param {event} ev
 */
Client.IonAutoComplete.prototype.sendFilter = function (value, ev)
{
  // Remember combo is opening so that it can open on receiving data
  this.comboOpening = true;
  //
  var e = [{obj: this.id, id: "chgProp", content: {name: "filter", value: value, clid: Client.id}}];
  e.push({obj: this.id, id: "chgProp", content: {name: "selectedText", value: this.domObj.value, clid: Client.id}});
  e.push({obj: this.id, id: "onFilter", content: Object.assign({filter: value}, this.saveEvent(ev))});
  if (!Client.mainFrame.isEditing())
    Client.mainFrame.sendEvents(e);
};


/**
 * Open the combo box with list values
 * @param {string} value
 * @param {boolean} setFocus
 */
Client.IonAutoComplete.prototype.openCombo = function (value, setFocus)
{
  if (this.closed)
    return;
  //
  if (this.comboOpening)
    this.clearDismissTimeouts();
  //
  let scrollObj = Client.Utils.getScrollableParent(this.parent.domObj);
  if (scrollObj && !this.onParentScrollListener) {
    this.onParentScrollListener = () => this.closeCombo();
    scrollObj.addEventListener("scroll", this.onParentScrollListener);
  }
  //
  // Detect if the value === "" is because the user opened the combo on an empty
  // value or the user deleted a value on an already opened combo
  // only in this case we should autoselect the empty value in the list (if present)
  //    && this.comboOpen
  // -> the combo is open and was already opened
  let userWroteNullValue = (value === "" && (this.isOpening() || this.isOpen()));
  //
  this.createCombo();
  this.comboOpening = false;
  this.comboOpen = true;
  //
  if (setFocus && document.activeElement !== this.domObj) {
    this.noReopen = true;
    this.domObj.focus();
  }
  //
  // Undefined means no list
  if (value === undefined) {
    this.showBackdrop(this.valueHasChanged);
    return;
  }
  //
  let up = this.isComboUp();
  //
  let exp = new RegExp(value.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "i");
  let found = false;
  let pm = false;
  let count = 0;
  let selected = false;
  this.activeIndex = -1;
  //
  // If the input is empty and we can have the optional value we can add it to the combo
  if (this.allowNull && (!this.domObj.value || !value)) {
    this.createComboItem({v: "", n: ""}, -1, up);
    count++;
    found = !this.domObj.value;
    //
    if (userWroteNullValue) {
      this.activeIndex = 0;
      selected = true;
    }
  }
  //
  this.visibleValues = [];
  //
  for (let i = 0; i < this.valueList.length; i++) {
    let v = this.valueList[i];
    //
    let idx = (v.n && v.n.search) ? v.n.search(exp) : -1;
    if (idx === -1)
      idx = (v.html && v.html.search) ? v.html.search(exp) : -1;
    if (v.fixed || idx > -1) {
      this.visibleValues.push(v);
      //
      count++;
      this.createComboItem(v, i, up);
      if (v.v == this.value)
        found = true;
      if (v.n === value)
        pm = true;
      //
      // If the current item has the same value as the written value by the user OR
      // is the selected value select it.
      // The same value has priority, so we set the current value only if is -1 (so same value found for now)
      //
      // (its the active position in the popup that must be used, not the position in the array)
      // count-1 because count++ is before ;) and the buttons are 0-based
      if ((v.v == this.value && this.activeIndex === -1) || (v.n === value)) {
        this.activeIndex = count - 1;
        selected = true;
      }
    }
  }
  //
  if (this.acceptNewValues && !found && !pm && this.domObj.value) {
    this.createComboItem({v: this.domObj.value, n: "+" + this.domObj.value, new : true}, this.valueList.length, up);
    count++;
    this.activeIndex = count - 1;
    selected = true;
  }
  //
  if (this.highlightFirstOption)
    this.activeIndex = this.domObj.value && count > 0 && this.allowNull ? 1 : 0;
  //
  this.positionCombo();
  //
  let oldup = up;
  up = this.isComboUp();
  if (!oldup && up && this.listObj.firstChild && this.listObj.childNodes.length > 2) {
    // We need to reposition the list items in the correct order
    //
    // Get the first element and move it to the bottom
    let fChild = this.listObj.firstChild;
    let lChild = this.listObj.lastChild;
    this.listObj.removeChild(fChild);
    this.listObj.appendChild(fChild);
    //
    // Now move all the first elements before the last moved object
    while (this.listObj.firstChild !== lChild) {
      this.listObj.insertBefore(this.listObj.firstChild, fChild);
      fChild = fChild.previousSibling;
    }
  }
  //
  if (this.activeIndex === -1)
    this.activeIndex = 0;
  //
  // In UP mode the item are created bottom-up... so the ActiveIndex must be reverted (is 0-based)
  if (up && selected)
    this.activeIndex = count - this.activeIndex - 1;
  //
  if (up) {
    if (this.listObj.clientHeight > this.wrapperObj.clientHeight) {
      this.wrapperObj.style.justifyContent = "flex-start";
      this.comboObj.scrollTop = 9999;
    }
    else {
      this.wrapperObj.style.justifyContent = "";
      this.comboObj.scrollTop = 0;
    }
  }
  //
  // On Desktop we must highlight the selected row or the base row, so the user can navigate them with keyboard
  // on mobile that makes no sense...
  if (!Client.mainFrame.device.isMobile && count > 0)
    this.highlightOption(this.activeIndex, true);
  //
  this.showBackdrop(this.valueHasChanged || count);
  this.listObj.style.opacity = count ? "1" : "";
};


/**
 * Shows or hides the backdrop
 * @param {bool} flag
 */
Client.IonAutoComplete.prototype.showBackdrop = function (flag)
{
  var op = flag ? ((Client.Ionic.platform === "md") ? "0.5" : "0.3") : "";
  //
  if (this.bdObj)
    this.bdObj.style.opacity = op;
  if (this.bd2)
    this.bd2.style.opacity = op;
};


/**
 * Create the combo
 */
Client.IonAutoComplete.prototype.createCombo = function ()
{
  var appui = document.getElementById("app-ui");
  if (!this.comboObj) {
    this.comboObj = document.createElement("ion-modal");
    this.comboObj.className = "ion-modal-cmp show-page ion-autocomplete-cmp " + this.comboClass;
    this.comboObj.setAttribute("parentcombo", this.id);
    //
    if (this.backdrop !== "none") {
      this.bdObj = document.createElement("ion-backdrop");
      this.bdObj.ontouchmove = ev => ev.preventDefault();
      this.comboObj.appendChild(this.bdObj);
    }
    //
    this.wrapperObj = document.createElement("div");
    this.wrapperObj.className = "modal-wrapper";
    this.comboObj.appendChild(this.wrapperObj);
    //
    this.listObj = document.createElement("ion-list");
    this.listObj.tabIndex = 0;
    this.listObj.addEventListener("scroll", () => this.domObj.focus());
    this.wrapperObj.appendChild(this.listObj);
    //
    appui.appendChild(this.comboObj);
    //
    if (this.backdrop === "all") {
      this.combo2 = document.createElement("ion-modal");
      this.combo2.className = "ion-modal-cmp show-page ion-autocomplete-cmp " + this.comboClass;
      this.bd2 = document.createElement("ion-backdrop");
      this.bd2.ontouchmove = ev => ev.preventDefault();
      this.combo2.appendChild(this.bd2);
      //
      appui.appendChild(this.combo2);
    }
  }
  //
  // empty the container
  while (this.listObj.firstChild)
    this.listObj.firstChild.remove();
};


/**
 * Position the combo
 */
Client.IonAutoComplete.prototype.positionCombo = function ()
{
  var appui = document.getElementById("app-ui");
  //
  // Locale container
  var obj = this.outerObj;
  if ((Client.IonItem && this.parent instanceof Client.IonItem) || this.parent?.parentWidget)
    obj = this.parent.domObj;
  //
  var pageobj = appui;
  var modalobj = undefined;
  var t = obj;
  while (t) {
    if (t.tagName === "ION-MODAL" || t.tagName === "ION-PAGE") {
      pageobj = t;
      modalobj = t;
      break;
    }
    t = t.parentNode;
  }
  // Positioning is different inside a modal view
  var isApp = true;
  t = obj;
  while (t) {
    if (t.tagName === "ION-MODAL") {
      isApp = false;
      modalobj = t;
      break;
    }
    t = t.parentNode;
  }
  //
  var rItem = obj.getBoundingClientRect();
  var rApp = pageobj.getBoundingClientRect();
  var pox = 0;
  var poy = 0;
  //
  // Calcolo offset left di pageobj rispetto ad appui
  if (pageobj.tagName === "ION-PAGE") {
    if (isApp) {
      // appui offset
      var rui = appui.getBoundingClientRect();
      pox = rApp.left - rui.left;
      poy = rApp.top - rui.top;
    }
    else {
      // ion-modal offset
      var rui = modalobj.getBoundingClientRect();
      pox = rApp.left - rui.left;
      poy = rApp.top - rui.top;
      isApp = true;
    }
  }
  //
  // Taking page/modal offset into account
  var dx = 0;
  var dy = 0;
  if (isApp) {
    dx = rApp.left - pox;
    dy = rApp.top - poy;
  }
  //
  var h1 = (rApp.bottom - rItem.bottom - 1);
  var h2 = (rItem.top - rApp.top - 1);
  //
  this.comboObj.style.display = "block";
  if (this.combo2)
    this.combo2.style.display = "block";
  //
  var hlist = this.listObj.clientHeight;
  var up = hlist > h1 && (hlist < h2 || h2 > h1);
  //
  if (up) {
    this.comboObj.style.top = (rItem.top - 1 - dy - h2) + "px";
    this.comboObj.style.height = h2 + "px";
    this.wrapperObj.classList.add("ion-autocomplete-up");
    //
    if (this.combo2) {
      this.combo2.style.top = (rItem.bottom + 1 - dy) + "px";
      this.combo2.style.height = h1 + "px";
    }
  }
  else {
    this.comboObj.style.top = (rItem.bottom + 1 - dy) + "px";
    this.comboObj.style.height = h1 + "px";
    this.wrapperObj.classList.remove("ion-autocomplete-up");
    //
    if (this.combo2) {
      this.combo2.style.top = (rItem.top - 1 - dy - h2) + "px";
      this.combo2.style.height = h2 + "px";
    }
  }
  //
  this.comboObj.style.left = (rItem.left - dx) + "px";
  this.comboObj.style.width = rItem.width + "px";
  if (this.combo2) {
    this.combo2.style.left = (rItem.left - dx) + "px";
    this.combo2.style.width = rItem.width + "px";
  }
};


/**
 * Create the combo
 * @param {Object} value
 * @param {Number} index
 * @param {Boolean} up
 */
Client.IonAutoComplete.prototype.createComboItem = function (value, index, up)
{
  var item = document.createElement("ion-item");
  item.className = "item item-radio" + (value.disabled ? " item-disabled" : "");
  var inner = document.createElement("div");
  inner.className = "item-inner";
  item.appendChild(inner);
  //
  var w = document.createElement("div");
  w.className = "input-wrapper";
  inner.appendChild(w);
  var l = document.createElement("ion-label");
  if (value.html)
    l.innerHTML = value.html;
  else
    l.textContent = value.n;
  //
  // detail
  if (value.d) {
    var p = document.createElement("p");
    if (value.html)
      p.innerHTML = value.d;
    else
      p.textContent = value.d;
    l.appendChild(p);
  }
  w.appendChild(l);
  //
  // style
  if (value.s) {
    if (value.s.indexOf(":") > -1) {
      item.style.cssText = value.s;
      l.style.cssText = value.s;
    }
    else
      item.classList.add(value.s);
  }
  //
  if (value.src) {
    if (["ion:", "fai:", "vel:"].includes(value.src.substring(0, 4))) {
      var img = document.createElement("ion-icon");
      img.setAttribute("item-left", "");
      Client.IonHelper.setIonIcon(value.src.substring(4), img, "item-icon");
      inner.insertBefore(img, w);
      if (value.v == this.value)
        img.setAttribute("primary", "");
    }
    else {
      var ava = document.createElement("ion-avatar");
      ava.setAttribute("item-left", "");
      var img = document.createElement("img");
      img.src = value.src;
      ava.appendChild(img);
      inner.insertBefore(ava, w);
    }
  }
  //
  let cc = this.multiple && index !== -1 ? "checkbox" : "radio";
  var r = document.createElement("ion-" + cc);
  //
  var i = document.createElement("div");
  i.className = cc + "-icon";
  r.appendChild(i);
  var ii = document.createElement("div");
  ii.className = cc + "-inner";
  i.appendChild(ii);
  //
  var b = document.createElement("button");
  b.className = "item-cover disable-hover item-cover-default" + (value.disabled ? " item-disabled" : "");
  b.setAttribute("value", value.v);
  b.setAttribute("index", index);
  if (value.new)
    b.setAttribute("new", true);
  r.appendChild(b);
  //
  let sel = value.v == this.value;
  if (this.multiple) {
    sel = (this.value + "").split(this.valueSeparator).includes(value.v);
  }
  //
  if (sel) {
    item.className += " item-" + cc + "-checked";
    i.className += " " + cc + "-checked";
    r.checked = true;
  }
  //
  w.appendChild(r);
  //
  if (up)
    this.listObj.insertBefore(item, this.listObj.firstChild);
  else
    this.listObj.appendChild(item);
  //
  Client.IonHelper.registerClickListener(this, b);
};


/**
 * Handle click
 * @param {event} ev
 */
Client.IonAutoComplete.prototype.myClick = function (ev)
{
  let v, idx;
  //
  // ev can be null
  if (ev?.currentTarget) {
    idx = parseInt(ev.currentTarget.getAttribute("index"));
    //
    if (idx >= 0 && this.valueList?.[idx]) {
      // Item disabled or unselectable? Do nothing
      if (this.valueList[idx].disabled || this.valueList[idx].unselectable)
        return false;
      //
      v = this.valueList[idx].v;
    }
    //
    if (v === undefined)
      v = ev.currentTarget.getAttribute("value");
    //
    // The optional value has -1 index and must be undefined
    if (idx === -1)
      v = undefined;
    //
    if (ev.currentTarget.getAttribute("new"))
      ev.new = true;
  }
  //
  if (this.multiple && v) {
    let flSet = false;
    //
    let vl = this.value ? this.value.split(this.valueSeparator) : [];
    //
    // Accept new value, resetting old values
    if (ev.resetValues)
      vl = [];
    else if (ev.visibleValues) // Confirm visible values without accepting new value
      vl = ev.visibleValues;
    //
    // Add or remove the value
    if (!ev.visibleValues) {
      let startIndex = vl.indexOf(v);
      if (startIndex >= 0)
        vl.splice(startIndex, 1);
      else {
        vl.push(v);
        flSet = true;
      }
    }
    //
    v = vl.join(this.valueSeparator);
    //
    // Update combo row
    let cc = ev.currentTarget.parentNode;
    cc.checked = flSet;
    let i = cc.firstChild;
    i.classList.toggle("checkbox-checked", flSet);
  }
  //
  let ris = this.setValue(v, true, ev || {});
  //
  if (!ris && !this.acceptNewValues)
    this.domObj.value = "";
  //
  if (!ev?.fromAccept) {
    if (!this.multiple || idx === -1)
      this.closeCombo();
    //
    // To skip onInputFocus
    this.domObj.focus();
    if (this.noFilter && !Client.mainFrame.device.isMobile)
      this.setSelection(0, 9999);
  }
};


/**
 * Close the combo box
 */
Client.IonAutoComplete.prototype.closeCombo = function ()
{
  if (this.onParentScrollListener) {
    let scrollObj = Client.Utils.getScrollableParent(this.parent.domObj);
    scrollObj?.removeEventListener("scroll", this.onParentScrollListener);
    delete this.onParentScrollListener;
  }
  //
  if (!this.isOpening())
    this.setValue(this.value);
  //
  if (document.activeElement !== this.domObj) {
    if (this.parent.domObj) {
      this.parent.domObj.classList.remove("input-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    }
  }
  //
  this.comboOpening = false;
  this.comboOpen = false;
  this.valueHasChanged = false;
  //
  if (this.comboObj) {
    if (this.bd2)
      this.bd2.style.opacity = "";
    if (this.bdObj)
      this.bdObj.style.opacity = "";
    this.listObj.style.opacity = "";
    //
    this.displayTimerId = setTimeout(() => {
      this.clearDismissTimeouts();
      this.comboObj.style.display = "none";
      if (this.combo2)
        this.combo2.style.display = "none";
    }, 250);
  }
};


/**
 * Commit a value
 * @param {type} value
 * @param {Boolean} emitChange
 * @param {event} ev
 */
Client.IonAutoComplete.prototype.setValue = function (value, emitChange, ev)
{
  this.iconValueObj.childNodes[0]?.remove();
  //
  if (value === undefined) {
    if (this.allowNull)
      value = null;
    else
      value = "";
  }
  //
  this.value = value;
  //
  let isEmpty = value === null || value === "";
  let ris = false;
  if (!isEmpty && this.valueList) {
    let values = [value];
    if (this.multiple && value.split)
      values = value.split(this.valueSeparator);
    //
    let txt = "";
    let icon = "";
    for (let j = 0; j < values.length; j++) {
      let v = values[j];
      for (let i = 0; i < this.valueList.length; i++) {
        if (this.valueList[i].v == v) {
          if (ris)
            txt += this.nameSeparator;
          txt += this.valueList[i].n;
          icon = this.valueList[i].src;
          ris = true;
          break;
        }
      }
    }
    //
    this.domObj.value = txt;
    //
    if (icon) {
      if (["ion:", "fai:", "vel:"].includes(icon.substring(0, 4))) {
        var img = document.createElement("ion-icon");
        img.setAttribute("item-left", "");
        Client.IonHelper.setIonIcon(icon.substring(4), img, "item-icon");
        this.iconValueObj.appendChild(img);
      }
      else {
        var ava = document.createElement("ion-avatar");
        ava.setAttribute("item-left", "");
        var img = document.createElement("img");
        img.src = icon;
        ava.appendChild(img);
        this.iconValueObj.appendChild(ava);
      }
    }
  }
  //
  if (!ris && !isEmpty && this.acceptNewValues) {
    ris = true;
    this.domObj.value = value;
  }
  //
  // Se mi è stato imposto un valore vuoto, svuoto comunque il campo
  if (!ris && isEmpty && !emitChange) {
    ris = true;
    this.domObj.value = "";
  }
  //
  // If there is a value without description, write last description
  if (!ris && !isEmpty) {
    ris = true;
    this.domObj.value = this.lastDescription;
  }
  //
  // Exception: in the IDE the server can send "{datamap.field}" . In that case we need to surface this value disregarding the list and other configurations
  if (Client.mainFrame.isEditing() && typeof value === "string" && value?.startsWith("{")) {
    this.domObj.value = value;
    ris = true;
  }
  //
  // This is the last valid value
  this.lastChange = this.domObj.value;
  //
  this.lastDescription = this.domObj.value;
  //
  this.parent.domObj?.classList.toggle("input-has-value", !!this.domObj.value);
  //
  this.checkError(true);
  //
  if (emitChange) {
    // Save value as filter to prepare for dismission
    if (ev.new)
      this.filter = value;
    //
    let e = [{obj: this.id, id: "chgProp", content: {name: "value", value, clid: Client.id}}];
    e.push({obj: this.id, id: "chgProp", content: {name: "selectedText", value: this.domObj.value, clid: Client.id}});
    if (this.sendChanges) {
      let er = this.saveEvent(ev);
      if (ev.new)
        er.newValue = true;
      e.push({obj: this.id, id: "onChange", content: er});
    }
    if (!Client.mainFrame.isEditing())
      Client.mainFrame.sendEvents(e);
  }
  //
  return ris;
};


/**
 * Update the options in the combobox
 */
Client.IonAutoComplete.prototype.updateCombo = function ()
{
  if (this.isOpening() || this.isOpen())
    this.openCombo(this.fullCombo ? "" : this.domObj.value);
  else
    this.setValue(this.value);
  //
  this.fullCombo = false;
};


/**
 * Returns true if the combo is open
 */
Client.IonAutoComplete.prototype.isOpen = function ()
{
  return this.comboOpen;
};


/**
 * Returns true if the combo is opening
 */
Client.IonAutoComplete.prototype.isOpening = function ()
{
  return this.comboOpening;
};


/**
 * Cancel combo opening
 */
Client.IonAutoComplete.prototype.cancelOpening = function ()
{
  delete this.comboOpening;
};


/**
 * Key Press of the Input (CanFilter Combo)
 * @param {Event} ev
 */
Client.IonAutoComplete.prototype.onInputKeyDown = function (ev)
{
  let k = ev.keyCode;
  let isOpen = this.isOpen();
  //
  // Enter
  if (k === 13 && isOpen) {
    ev.stopPropagation();
    //
    if (this.multiple) {
      let currentValues = this.value ? this.value.split(this.valueSeparator) : [];
      let visibleValues = currentValues.filter(v => this.visibleValues.map(item => item.v).includes(v));
      //
      // Case 1: If none of current values is visible, accept new value resetting old values;
      // Do the same thing if selected value is the empty one;
      // Case 2: If some current value is not visible, accept just visible values
      // Case 3: dismiss combo without changing value
      if (visibleValues.length === 0 || (this.activeIndex === 0 && this.allowNull))
        this.accept({resetValues: true});
      else if (visibleValues.length < currentValues.length)
        this.accept({visibleValues});
      else
        this.dismiss();
    }
    else
      this.accept();
    //
    this.skipKeyUp = true;
  }
  // ESC
  if (k === 27) {
    ev.stopPropagation();
    this.dismiss();
    this.skipKeyUp = true;
  }
  // TAB
  // Skip the automatic focus behaviour
  if (k === 9 && this.handleCustomNavigation())
    ev.preventDefault();
  //
  // DOWN or UP when the list is open
  if ((k === 40 || k === 38) && isOpen) {
    let bl = this.comboObj.getElementsByTagName("BUTTON");
    //
    // No item no navigation
    if (!bl || bl.length === 0)
      return;
    //
    // Prevent the cursor from moving in the input
    ev.preventDefault();
    ev.stopPropagation();
    //
    if (this.activeIndex === undefined)
      this.activeIndex = -1;
    //
    if (this.activeIndex >= 0)
      this.highlightOption(this.activeIndex, false);
    //
    // Move the index
    this.activeIndex += k === 40 ? 1 : -1;
    if (this.activeIndex >= bl.length)
      this.activeIndex = bl.length - 1;
    if (this.activeIndex < 0)
      this.activeIndex = 0;
    //
    // Highlight the button
    this.highlightOption(this.activeIndex, true);
  }
  //
  // DOWN or UP when the list is closed
  if ((k === 40 || k === 38) && !isOpen) {
    ev.stopPropagation();
    ev.preventDefault();
    this.openCombo("", true);
  }
  //
  // SPACE when the list is open and this is a multiple autocomplete
  if (k === 32 && isOpen) {
    if (this.multiple) {
      ev.stopPropagation();
      ev.preventDefault();
      this.accept({skipFocus: true, skipClose: true});
      this.skipKeyUp = true;
    }
  }
  //
  if (this.readOnly || this.noFilter) {
    let block = true;
    if (ev.metaKey || ev.ctrlKey)
      block = false;
    if (block)
      ev.preventDefault();
    return false;
  }
};


/**
 * Key Up of the Input (CanFilter Combo)
 * @param {Event} ev
 */
Client.IonAutoComplete.prototype.onInputKeyUp = function (ev)
{
  var k = ev.keyCode;
  //
  // Enter or TAB
  if ((k === 13 || k === 9) && !this.skipKeyUp && (!this.listObj || this.listObj.style.opacity !== "1")) {
    if (this.handleCustomNavigation()) {
      this.domObj.blur();
      Client.IonHelper.focusNextInput(this.view, this.domObj, (k === 9 && ev.shiftKey));
    }
    else if (k === 13 && !this.parentWidget)
      this.domObj.blur();
  }
  //
  this.skipKeyUp = false;
};


/**
 * Close the combo
 * @param {Boolean} setFocus
 */
Client.IonAutoComplete.prototype.dismiss = function (setFocus)
{
  if (this.filter)
    this.domObj.value = this.filter;
  else {
    if (!this.setValue(this.value))
      this.domObj.value = "";
  }
  //
  this.closeCombo();
  //
  if (setFocus || setFocus === undefined) {
    this.domObj.focus();
    if (this.noFilter && !Client.mainFrame.device.isMobile)
      this.setSelection(0, 9999);
  }
};


/**
 * Accept first value if any
 * @param {Object} options
 */
Client.IonAutoComplete.prototype.accept = function (options)
{
  options = options || {};
  let {skipFocus, skipClose, resetValues, visibleValues} = options;
  //
  // If the combo is Open and there is a list, if not is closed so do nothing
  if (this.isOpen()) {
    var b = this.comboObj.getElementsByTagName("BUTTON");
    if (b && b.length) {
      var idx = this.activeIndex;
      if (!idx || idx < 0 || idx >= b.length)
        idx = 0;
      this.myClick({currentTarget: b[idx], fromAccept: true, resetValues, visibleValues});
    }
    else
      this.myClick({fromAccept: true});
  }
  //
  if (!skipClose)
    this.closeCombo();
  //
  if (!skipFocus) {
    this.domObj.focus();
    if (this.noFilter && !Client.mainFrame.device.isMobile)
      this.setSelection(0, 9999);
  }
};


/**
 * This object has been hidden or shown
 * @param {Boolean} visible
 */
Client.IonAutoComplete.prototype.visibilityChanged = function (visible)
{
  // The label is outside the input: update label visibility
  if (this.labelObj)
    this.labelObj.style.display = this.getRootObject().style.display;
  Client.Element.prototype.visibilityChanged.call(this, visible);
};


/**
 * Set custom error message
 * @param {String} message - the error message
 * @param {bool} srv
 */
Client.IonAutoComplete.prototype.setError = function (message, srv)
{
  let newError = (this.errorMessage !== message);
  Client.Element.prototype.setError.call(this, message, srv);
  //
  if (!newError)
    return;
  //
  setTimeout(() => {
    if (this.outerObj?.parentNode) {
      if (message)
        this.outerObj.parentNode.classList.add("is-invalid");
      else
        this.outerObj.parentNode.classList.remove("is-invalid");
    }
    if (!this.errObj && message) {
      this.errObj = document.createElement("div");
      this.errObj.className = "autocomplete-error-message";
      this.outerObj.appendChild(this.errObj);
    }
    if (this.errObj) {
      this.errObj.innerText = message;
      this.errObj.style.display = message ? "" : "none";
    }
  }, 10);
};


/**
 * Set selection
 * @param {int} start
 * @param {int} end
 */
Client.IonAutoComplete.prototype.setSelection = function (start, end)
{
  if (this.heightResize)
    Client.Element.setSelection(this.domObj, start, end);
  else
    this.domObj.setSelectionRange(start, end);
};


/**
 * Highlight/dehighlight an option
 * @param {Number} index
 * @param {Boolean} highlight
 */
Client.IonAutoComplete.prototype.highlightOption = function (index, highlight)
{
  // Highlight the button
  let option = this.listObj.getElementsByTagName("BUTTON")[index];
  option?.classList.toggle("autocomplete-select-item", highlight);
  //
  if (highlight)
    option?.scrollIntoView({block: "nearest", inline: "nearest"});
};


/**
 * Return true if combo appears above input
 */
Client.IonAutoComplete.prototype.isComboUp = function ()
{
  return this.wrapperObj.classList.contains("ion-autocomplete-up");
};


/**
 * Clear dismiss timeouts
 */
Client.IonAutoComplete.prototype.clearDismissTimeouts = function ()
{
  if (this.displayTimerId) {
    clearTimeout(this.displayTimerId);
    delete this.displayTimerId;
  }
};
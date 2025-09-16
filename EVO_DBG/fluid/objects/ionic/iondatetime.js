/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client, moment */

/**
 * @class A container for a datetime picker
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonDateTime = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.cancelText = "Cancel";
  this.doneText = "Done";
  this.step = 1;
  //
  this.domObj = document.createElement("ion-datetime");
  //
  this.textObj = document.createElement("div");
  this.textObj.className = "datetime-text";
  this.domObj.appendChild(this.textObj);
  //
  this.coverObj = document.createElement("button");
  this.coverObj.className = "item-cover disable-hover item-cover-default";
  this.domObj.appendChild(this.coverObj);
  //
  this.clearObj = document.createElement("button");
  this.clearObj.className = "text-input-clear-icon disable-hover button button-clear want-click datetime-clear-icon";
  //
  this.clearObj.style.display = "none";
  this.domObj.appendChild(this.clearObj);
  //
  // Default picker configuration : on Mobile Only
  this.iUsePicker = Client.IonDateTime.SHOW_PICKER_MOBILE_ONLY;
  //
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  this.updateElement(element);
  //
  // let's see if we have a label on our left
  if (!this.labelObj && Client.IonItem && Client.IonLabel && this.parent instanceof Client.IonItem) {
    var b = false;
    for (var i = 0; i < this.parent.elements.length && !b; i++) {
      if (this.parent.elements[i] instanceof Client.IonLabel)
        b = true;
    }
    if (!b)
      this.domObj.classList.add("datetime-nolabel");
  }
  //
  if (parent instanceof Client.IonItem)
    parent.domObj.classList.add("item-datetime");
  //
  if (!this.usePicker()) {
    // I can create the INPUT only when the UpdateElement has set the displayFormat/pickerFormat
    // so i start with !usePicker.
    // when the element has been inizialized i can read the user preferences and create the control
    // in this case i must re-set all the values that the user has configurated
    var outerObj = document.createElement("ion-input");
    var innerObj = document.createElement("input");
    //
    innerObj.className = "text-input";
    innerObj.setAttribute("type", this.getInputType());
    outerObj.className = "datetime-text";
    outerObj.appendChild(innerObj);
    //
    this.domObj.insertBefore(outerObj, this.textObj);
    this.domObj.removeChild(this.textObj);
    this.domObj.removeChild(this.coverObj);
    this.textObj = innerObj;
    //
    this.domObj.classList.add("datetime-nopicker");
    this.showValue();
    if (this.disabled)
      this.textObj.disabled = this.disabled;
    //
    // The date input don't support the placeholders
    //if (this.placeholder)
    //this.textObj.placeholder = this.placeholder;
    //
    // The input shows the value using the user browser locale, but the inner value must be formatted
    // in a specific mode
    var fmt = this.textObj.type === "date" ? "YYYY-MM-DD" : (this.textObj.type === "datetime-local" ? "YYYY-MM-DDTHH:mm" : "HH:mm");
    if (this.max)
      this.textObj.setAttribute("max", this.max.format(fmt));
    if (this.min)
      this.textObj.setAttribute("min", this.min.format(fmt));
  }
  //
  this.addEventsListeners();
};

Client.IonDateTime.prototype = new Client.Element();

Client.IonDateTime.SHOW_PICKER_NEVER = 0;
Client.IonDateTime.SHOW_PICKER_MOBILE_ONLY = 1;
Client.IonDateTime.SHOW_PICKER_ALWAYS = 2;

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonDateTime.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  if (el.usePicker !== undefined) {
    this.iUsePicker = el.usePicker;
    delete el.usePicker;
  }
  if (el.displayFormat !== undefined) {
    this.displayFormat = el.displayFormat;
    this.showValue();
    delete el.displayFormat;
  }
  if (el.pickerFormat !== undefined) {
    this.pickerFormat = el.pickerFormat;
    delete el.pickerFormat;
  }
  if (el.cancelText !== undefined) {
    this.cancelText = el.cancelText;
    delete el.cancelText;
  }
  if (el.doneText !== undefined) {
    this.doneText = el.doneText;
    delete el.doneText;
  }
  if (el.step !== undefined) {
    this.step = el.step;
    delete el.step;
  }
  if (el.value !== undefined) {
    this.value = moment(el.value);
    if (!this.value.isValid())
      this.value = undefined;
    this.showValue();
    delete el.value;
  }
  if (el.min !== undefined) {
    this.min = moment(el.min);
    //
    if (!this.usePicker()) {
      var fmtMin = this.textObj.type === "date" ? "YYYY-MM-DD" : (this.textObj.type === "datetime-local" ? "YYYY-MM-DDTHH:mm" : "HH:mm");
      this.textObj.setAttribute("min", this.min.format(fmtMin));
    }
    delete el.min;
  }
  if (el.max !== undefined) {
    this.max = moment(el.max);
    //
    if (!this.usePicker()) {
      var fmtMax = this.textObj.type === "date" ? "YYYY-MM-DD" : (this.textObj.type === "datetime-local" ? "YYYY-MM-DDTHH:mm" : "HH:mm");
      this.textObj.setAttribute("max", this.max.format(fmtMax));
    }
    delete el.max;
  }
  if (el.placeholder !== undefined) {
    this.placeholder = el.placeholder;
    if (this.usePicker())
      this.showValue();
    else
      this.textObj.placeholder = this.placeholder;
    delete el.placeholder;
  }
  if (el.disabled !== undefined) {
    this.disabled = el.disabled;
    this.domObj.classList.toggle("datetime-disabled", el.disabled);
    if (!this.usePicker())
      this.textObj.disabled = this.disabled;
    if (Client.IonItem && this.parent instanceof Client.IonItem)
      this.parent.domObj.classList.toggle("item-datetime-disabled", el.disabled);
  }
  //
  // Label
  if (el.label !== undefined) {
    if (!this.labelObj) {
      this.labelObj = document.createElement("ion-label");
      this.domObj.parentNode.insertBefore(this.labelObj, this.domObj);
      this.domObj.classList.remove("datetime-nolabel");
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
    this.domObj.classList.toggle("datetime-nolabel", this.labelPosition === "hidden");
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
  if (el.clear !== undefined) {
    this.clearObj.style.display = el.clear ? "" : "none";
    delete el.clear;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Add events listeners
 */
Client.IonDateTime.prototype.addEventsListeners = function ()
{
  Client.IonHelper.registerClickListener(this, this.coverObj);
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
  if (!this.usePicker()) {
    // Add the event to handle the changes
    this.textObj.onchange = (ev) => {
      let newVal = moment(this.textObj.value);
      //
      // Moment cannot handle a time format, he wants also the date part.
      // In this case i use the value date as the date part (the same is done in picker mode)
      // -> if we have not value we resort to the current date
      if (!newVal.isValid() && this.textObj.type === "time") {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        //
        // Try to mantain the set date if present
        if (this.value?.year)
          year = this.value.year();
        if (this.value?.month)
          month = this.value.month() + 1;
        if (this.value?.date)
          day = this.value.date();
        //
        newVal = moment(moment(`${year}-${month}-${day}`).format("YYYY-MM-DD") + "T" + this.textObj.value);
        //
        // If the result is not a valid date return to today
        if (!newVal.isValid())
          newVal = moment(moment(today).format("YYYY-MM-DD") + "T" + this.textObj.value);
      }
      this.setValue(newVal);
    };
    //
    // TAB || ENTER: let our code handle it
    this.textObj.onkeydown = (ev) => {
      if ((ev.which === 9 || ev.which === 13) && this.handleCustomNavigation()) {
        ev.preventDefault();
      }
    };
    //
    // ENTER -> BLUR for inputs
    this.textObj.onkeyup = (ev) => {
      if (ev.which === 13 && !this.parentWidget) {
        this.domObj.blur();
        //
        if (this.handleCustomNavigation())
          Client.IonHelper.focusNextInput(this.view, this.textObj);
      }
      if (ev.which === 9 && this.handleCustomNavigation()) {
        this.domObj.blur();
        Client.IonHelper.focusNextInput(this.view, this.textObj, (ev.which === 9 && ev.shiftKey));
      }
    };
  }
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonDateTime.prototype.attachEvents = function (events)
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
 * Remove focus from the element
 */
Client.IonDateTime.prototype.blur = function ()
{
  Client.Element.prototype.blur.call(this);
  //
  if (!this.usePicker())
    this.textObj.blur();
};


/**
 * Datetime clicked!
 * @param {Object} ev - event
 * @param {Object} domObj
 */
Client.IonDateTime.prototype.myClick = function (ev, domObj)
{
  // No click when editing in the view editor
  if (Client.mainFrame.isEditing())
    return;
  //
  if (this.domObj.disabled)
    return;
  //
  // Click on the backdrop
  if (ev.target.tagName === "ION-BACKDROP") {
    this.closePicker(true);
    return;
  }
  //
  // Cancel button
  if (domObj === this.cancelBtn) {
    this.closePicker();
    return;
  }
  //
  // Done button
  if (domObj === this.doneBtn) {
    this.setValue(this.getSelectedDate());
    this.closePicker();
    return;
  }
  //
  Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "start"});
  //
  // Picker creation
  var usePopup = this.usePopupKeyboard();
  var picker = document.createElement(usePopup ? "ion-popover" : "ion-picker-cmp");
  picker.className = usePopup ? ("popover-" + Client.Ionic.platform + " popover-date-keyboard") : "picker-cmp";
  picker.setAttribute("parentdate", this.id);
  //
  var bw = document.createElement("ion-backdrop");
  bw.tappable = "";
  bw.onclick = function (ev) {
    this.myClick(ev, this.cancelBtn);
  }.bind(this);
  bw.ontouchmove = function (ev) {
    ev.preventDefault();
  };
  picker.appendChild(bw);
  //
  var pw = document.createElement("div");
  pw.className = usePopup ? "popover-wrapper" : "picker-wrapper";
  picker.appendChild(pw);
  //
  var parrow;
  var pcontent;
  if (usePopup) {
    parrow = document.createElement("div");
    parrow.className = "popover-arrow";
    pw.appendChild(parrow);
    pcontent = document.createElement("div");
    pcontent.className = "popover-content";
    pw.appendChild(pcontent);
  }
  //
  // Toolbar creation
  var pt = document.createElement("div");
  pt.className = "picker-toolbar";
  if (usePopup)
    pcontent.appendChild(pt);
  else
    pw.appendChild(pt);
  //
  var cb = document.createElement("div");
  cb.className = "picker-toolbar-button picker-toolbar-cancel";
  pt.appendChild(cb);
  var b1 = document.createElement("button");
  b1.className = "picker-button disable-hover button button-clear";
  cb.appendChild(b1);
  var s1 = document.createElement("span");
  s1.className = "button-inner";
  s1.textContent = this.cancelText;
  b1.appendChild(s1);
  //
  var db = document.createElement("div");
  db.className = "picker-toolbar-button";
  pt.appendChild(db);
  var b2 = document.createElement("button");
  b2.className = "picker-button disable-hover button button-clear";
  db.appendChild(b2);
  var s2 = document.createElement("span");
  s2.className = "button-inner";
  s2.textContent = this.doneText;
  b2.appendChild(s2);
  //
  this.cancelBtn = b1;
  this.doneBtn = b2;
  Client.IonHelper.registerClickListener(this, b1);
  Client.IonHelper.registerClickListener(this, b2);
  //
  // Columns creation
  var pc = document.createElement("div");
  pc.className = "picker-columns";
  pc.ontouchmove = function (ev) {
    ev.preventDefault();
  };
  if (usePopup)
    pcontent.appendChild(pc);
  else
    pw.appendChild(pc);
  //
  var pa = document.createElement("div");
  pa.className = "picker-above-highlight";
  pc.appendChild(pa);
  //
  // Add picker columns
  this.generateColumns(pc);
  //
  var pb = document.createElement("div");
  pb.className = "picker-below-highlight";
  pc.appendChild(pb);
  //
  // Picker show
  var appui = document.getElementById("app-ui");
  appui.appendChild(picker);
  //
  if (usePopup) {
    var tr = this.domObj.getBoundingClientRect();
    var ta = tr.top + tr.height;
    var t = ta + 10;
    if (t + 260 > appui.offsetHeight) {
      t = tr.top - 260 - 10;
      ta = tr.top - 10;
      parrow.style.transform = "rotate(180deg)";
    }
    if (t < 0)
      t = 0;
    pcontent.style.top = t + "px";
    parrow.style.top = ta + "px";
    //
    var l = tr.left + (tr.width / 2) - (pcontent.offsetWidth / 2);
    if (l + pcontent.offsetWidth > appui.offsetWidth)
      l = l - (l + pcontent.offsetWidth - appui.offsetWidth + 15);
    if (l < 0)
      l = 0;
    var la = l + (pcontent.offsetWidth / 2 - 10);
    pcontent.style.left = l + "px";
    parrow.style.left = la + "px";
    //
    pw.style.opacity = "1";
  }
  else {
    var r = pc.offsetTop;
    pw.style.transition = "transform 400ms cubic-bezier(.36,.66,.04,1)";
    pw.style.transform = "translateY(0%)";
    bw.style.transition = "opacity 400ms cubic-bezier(.36,.66,.04,1)";
    bw.style.opacity = "0.26";
  }
  //
  this.picker = picker;
  this.pw = pw;
  this.bw = bw;
  //
  // Picker refresh
  this.refreshPicker();
};


/**
 * Close picker component
 * @param {bool} immediate
 */
Client.IonDateTime.prototype.closePicker = function (immediate)
{
  var t1 = (Client.Ionic.platform === "md" && !immediate) ? 250 : 0;
  //
  Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "end"});
  //
  setTimeout(function () {
    if (this.pw) {
      this.pw.style.transform = "";
      this.pw.style.opacity = "0";
      if (!this.usePopupKeyboard() || Client.Ionic.platform === "md")
        this.bw.style.opacity = "";
      else
        this.bw.style.opacity = "0";
    }
  }.bind(this), t1);
  //
  setTimeout(function () {
    if (this.picker)
      this.picker.remove();
    delete this.picker;
    delete this.pw;
    delete this.bw;
    delete this.cancelBtn;
    delete this.doneBtn;
    delete this.pickerCols;
  }.bind(this), 500 + t1);
};


/**
 * A new value has applied
 * @param {moment} value
 */
Client.IonDateTime.prototype.setValue = function (value)
{
  if (this.domObj.disabled)
    return;
  //
  this.value = value;
  this.showValue();
  //
  var v = value.format ? value.format() : value;
  var x = [{obj: this.id, id: "chgProp", content: {name: "value", value: v, clid: Client.id}}];
  if (this.sendOnChange)
    x.push({obj: this.id, id: "onChange", content: v});
  Client.mainFrame.sendEvents(x);
};


/**
 * Shows the new value
 */
Client.IonDateTime.prototype.showValue = function ()
{
  if (this.value) {
    if (this.usePicker())
      this.textObj.textContent = this.value.format(this.displayFormat);
    else {
      // The input shows the value using the user browser locale, but the inner value must be formatted
      // in a specific format
      var fmt = this.textObj.type === "date" ? "YYYY-MM-DD" : (this.textObj.type === "datetime-local" ? "YYYY-MM-DDTHH:mm" : "HH:mm");
      this.textObj.value = this.value.format(fmt);
    }
    this.textObj.classList.remove("datetime-placeholder");
  }
  else {
    if (this.usePicker())
      this.textObj.textContent = this.placeholder || "";
    else
      this.textObj.value = "";
    this.textObj.classList.add("datetime-placeholder");
  }
  if (this.parent instanceof Client.IonItem)
    this.parent.domObj.classList.toggle("input-has-value", !!this.value);
  this.domObj.classList.toggle("datetime-has-value", !!this.value);
};


/**
 * generate columns for this picker
 * @par@param {htmelements} pc picker columns container
 */
Client.IonDateTime.prototype.generateColumns = function (pc)
{
  var checkValue = false;
  // Select values / min and max
  if (!this.value) {
    this.value = moment();
    checkValue = true;
  }
  if (!this.min)
    this.min = moment((this.value.year() - 100) + "-01-01", "YYYY-MM-DD");
  if (!this.max)
    this.max = moment((this.value.year() + 1) + "-01-01", "YYYY-MM-DD");
  if (this.value.isAfter(this.max))
    this.value = moment(this.max);
  if (this.value.isBefore(this.min))
    this.value = moment(this.min);
  //
  // Generating values
  var cols = [];
  var f = this.pickerFormat || this.displayFormat || "";
  f = f.replace(/[^A-Za-z]/g, ' ');
  if (f === "")
    console.warn("IonDateTime: pickerFormat and displayFormat unset, the picker cannot be used");
  //
  // Delete possible double day column
  if (f.includes("ddd ")) {
    f = f.replace("DD ", "");
    f = f.replace("D ", "");
  }
  //
  f = f.split(" ");
  for (var i = 0; i < f.length; i++) {
    var t = f[i];
    var col = {};
    col.name = this.getColName(t);
    col.token = this.getColToken(col.name, t);
    col.values = this.getColValues(col.name, col.token);
    col.selectedIndex = this.getSelectedIndex(col.values, col.token);
    col.pos = [];
    //
    // Calc max value length
    col.width = 0;
    for (var j = 0; j < col.values.length; j++) {
      if (col.width < col.values[j].length)
        col.width = col.values[j].length;
    }
    if (col.name)
      cols.push(col);
  }
  //
  // Selecting sizes
  if (cols.length === 2) {
    var width = Math.max(cols[0].width, cols[1].width);
    cols[0].width = cols[1].width = width * 16 + "px";
  }
  else if (cols.length === 3) {
    var width = Math.max(cols[0].width, cols[2].width);
    cols[1].width = cols[1].width * 16 + "px";
    cols[0].width = cols[2].width = width * 16 + "px";
  }
  else {
    for (var i = 0; i < cols.length; i++) {
      cols[i].width = cols[i].width * 16 + "px";
    }
  }
  //
  // Create columns DOM
  for (var i = 0; i < cols.length; i++) {
    var cw = document.createElement("div");
    cw.className = "picker-col";
    cw.style.minWidth = cols[i].width;
    Client.IonHelper.registerPointerEvents(cw, i, this, false, "pm pe po");
    //
    var po = document.createElement("div");
    po.className = "picker-opts";
    cw.appendChild(po);
    cols[i].wrapper = cw;
    //
    cols[i].options = [];
    for (var j = 0; j < cols[i].values.length; j++) {
      var b = document.createElement("button");
      b.className = "picker-opt picker-opt-default";
      this.registerClick(b, i, j);
      po.appendChild(b);
      //
      var opt = {obj: b, disabled: false, value: cols[i].values[j]};
      cols[i].options.push(opt);
      //
      var s = document.createElement("span");
      s.className = "button-inner";
      s.textContent = opt.value;
      b.appendChild(s);
    }
    //
    pc.appendChild(cw);
  }
  //
  this.pickerCols = cols;
  //
  if (checkValue) {
    // If the value has been set locally, reset any non-present column
    if (!this.getColumn("hour"))
      this.value.hours(0);
    if (!this.getColumn("minute"))
      this.value.minutes(0);
    if (!this.getColumn("seconds"))
      this.value.seconds(0);
  }
  //
  this.validate();
};


/**
 * Returns column name given the token
 */
Client.IonDateTime.prototype.getColName = function (t)
{
  switch (t) {
    case "M":
    case "Mo":
    case "MM":
    case "MMM":
    case "MMMM":
      return "month";

    case "D":
    case "Do":
    case "DD":
    case "DDD":
    case "DDDo":
    case "DDDD":
    case "d":
    case "do":
    case "dd":
    case "ddd":
    case "dddd":
    case "e":
    case "E":
      return "day";

    case "Y":
    case "YY":
    case "YYYY":
      return "year";

    case "A":
    case "a":
      return "ampm";

    case "H":
    case "HH":
    case "h":
    case "hh":
    case "k":
    case "kk":
      return "hour";

    case "m":
    case "mm":
      return "minute";

    case "s":
    case "ss":
      return "second";
  }
};


/**
 * Returns picker token given the column name
 */
Client.IonDateTime.prototype.getColToken = function (name, t)
{
  switch (name) {
    case "month": // "M", "Mo", "MM", "MMM", "MMMM":
      return t === "Mo" ? "MM" : t;
    case "day": // "D", "Do", "DD", "DDD", "DDDo", "DDDD", "d", "do", "dd", "ddd", "dddd", "e", "E":
      return (t.length > 2) ? "ddd DD" : "D".repeat(t.length);
    case "year": // "Y", "YY", "YYYY":
      return t;
    case "ampm": // "A", "a":
      return t;
    case "hour": // "H", "HH", "h", "hh", "k", "kk":
      return t;
    case "minute": // "m", "mm":
      return t;
    case "second": // "s", "ss":
      return t;
  }
};


/**
 * Generate column values given its name and token
 */
Client.IonDateTime.prototype.getColValues = function (name, t)
{
  var ris = [], i;
  switch (name) {
    case "day": // D (1, 2, ... 31) or DD (01, 02... 31)
      for (i = 1; i <= 31; i++) {
        var s = ((t.length > 1 && i < 10) ? "0" : "") + i;
        if (t.length > 2) {
          let d = moment(this.value).date(i);
          s = d.format(t);
        }
        ris.push(s);
      }
      break;

    case "month":
      if (t.length < 3) {
        for (i = 1; i <= 12; i++) {
          var s = ((t.length > 1 && i < 10) ? "0" : "") + i;
          ris.push(s);
        }
      }
      else {
        var mm = t === "MMM" ? moment.monthsShort(true) : moment.months(true);
        for (i = 0; i < mm.length; i++) {
          ris.push(mm[i] + "");
        }
      }
      break;

    case "year":
      for (i = this.min.year(); i <= this.max.year(); i++) {
        var s = i + "";
        s = "0000".substr(0, 4 - s.length) + s;
        s = t === "YY" ? s.substr(2, 2) : s;
        ris.push(s);
      }
      break;

    case "hour":
      var max = t === "h" || t === "hh" ? 11 : 23;
      var min = 0;
      if (t === "k" || t === "kk") {
        min = 1;
        max = 24;
      }
      for (i = min; i <= max; i++) {
        var s = ((t.length > 1 && i < 10) ? "0" : "") + i;
        ris.push(s);
      }
      break;

    case "minute":
      for (i = 0; i < 60; i += this.step) {
        var s = ((t.length > 1 && i < 10) ? "0" : "") + i;
        ris.push(s);
      }
      break;

    case "second":
      for (i = 0; i < 60; i++) {
        var s = ((t.length > 1 && i < 10) ? "0" : "") + i;
        ris.push(s);
      }
      break;

    case "ampm":
      if (t === "a") {
        ris.push("am");
        ris.push("pm");
      }
      else {
        ris.push("AM");
        ris.push("PM");
      }
      break;
  }
  return ris;
};


/**
 * Calculate selected index for a given column
 */
Client.IonDateTime.prototype.getSelectedIndex = function (values, token)
{
  var t = this.value.format(token);
  return values.indexOf(t);
};


/**
 * Update picker column elements
 */
Client.IonDateTime.prototype.refreshPicker = function ()
{
  for (var i = 0; i < this.pickerCols.length; i++) {
    this.refreshColumn(i, true);
  }
};


/**
 * Update picker column elements
 * @param {integer} c colum index to update
 */
Client.IonDateTime.prototype.refreshColumn = function (c, force)
{
  var col = this.pickerCols[c];
  //
  // Calc option height
  if (!col.optHeight)
    col.optHeight = col.options[0].obj.offsetHeight;
  //
  var min = col.options.length - 1;
  var max = 0;
  for (var i = 0; i < col.options.length; i++) {
    if (!col.options[i].disabled) {
      min = Math.min(min, i);
      max = Math.max(max, i);
    }
  }
  //
  // validate the selected index
  var selectedIndex = Math.min(Math.max(min, col.selectedIndex), max);
  //
  // and update it on screen
  if (selectedIndex !== col.selectedIndex || force) {
    var y = (selectedIndex * col.optHeight) * -1;
    this.updateColumn(c, y, force ? 0 : 150, true, true);
  }
};


/**
 * place column options
 * @param {integer} c - colum index to refresh
 * @param {integer} y - vertical coordinate
 * @param {integer} duration - transition duration
 * @param {bool} saveY - store y value to use it for later calc
 * @param {bool} emitChange - make the component aware of changes in the selected option
 */
Client.IonDateTime.prototype.updateColumn = function (c, y, duration, saveY, emitChange)
{
  var col = this.pickerCols[c];
  var rotateFactor = Client.Ionic.platform === "md" ? 0 : -0.46;
  y = Math.round(y);
  //
  var old = col.selectedIndex;
  col.selectedIndex = Math.max(Math.abs(Math.round(y / col.optHeight)), 0);
  if (col.selectedIndex !== old && (!col.feedbackTime || new Date() - col.feedbackTime > 50)) {
    Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "changed"});
    col.feedbackTime = new Date();
  }
  //
  // Place options
  for (var i = 0; i < col.options.length; i++) {
    var opt = col.options[i];
    var optTop = (i * col.optHeight);
    var optOffset = (optTop + y);
    var rotateX = (optOffset * rotateFactor);
    var translateX = 0;
    var translateY = 0;
    var translateZ = 0;
    if (rotateFactor !== 0) {
      translateX = 0;
      translateZ = 90;
      if (rotateX > 90 || rotateX < -90) {
        translateX = -9999;
        rotateX = 0;
      }
    }
    else {
      translateY = optOffset;
      if (translateY < -4 * col.optHeight || translateY > 4 * col.optHeight)
        translateY = -9999;
    }
    //
    opt.obj.classList.toggle("picker-opt-disabled", opt.disabled);
    //
    if (!opt.disabled) {
      opt.obj.style.transform = "rotateX(" + rotateX + "deg) translate3d(" + translateX + "px," + translateY + "px," + translateZ + "px)";
      //
      if (translateY === -9999 || duration === 0)
        opt.obj.style.transitionDuration = "0ms";
      else
        opt.obj.style.transitionDuration = duration + "ms";
      //
      opt.obj.classList.toggle("picker-opt-selected", col.selectedIndex === i);
    }
  }
  //
  if (saveY) {
    col.y = y;
  }
  //
  if (emitChange) {
    if (col.lastIndex === undefined) {
      // have not set a last index yet
      col.lastIndex = col.selectedIndex;
    }
    else if (col.lastIndex !== col.selectedIndex) {
      // new selected index has changed from the last index
      // update the lastIndex and emit that it has changed
      col.lastIndex = col.selectedIndex;
      //
      this.validate(true);
    }
  }
};


/**
 * touchstart, mousedown event listener
 * @param {event} ev
 * @param {integer} c colum index to refresh
 */
Client.IonDateTime.prototype.pointerStart = function (ev, c)
{
  var col = this.pickerCols[c];
  cancelAnimationFrame(col.raf);
  col.startY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  col.canClick = true;
  col.velocity = 0;
  col.pos.length = 0;
  col.pos.push(col.startY, Date.now());
  var minY = (col.options.length - 1);
  var maxY = 0;
  for (var i = 0; i < col.options.length; i++) {
    if (!col.options[i].disabled) {
      minY = Math.min(minY, i);
      maxY = Math.max(maxY, i);
    }
  }
  col.minY = (minY * col.optHeight * -1);
  col.maxY = (maxY * col.optHeight * -1);
  return true;
};

/**
 * touchmove, mousemove event listener
 * @param {event} ev
 * @param {integer} c colum index to refresh
 */
Client.IonDateTime.prototype.pointerMove = function (ev, c)
{
  var col = this.pickerCols[c];
  ev.preventDefault();
  ev.stopPropagation();
  if (col.startY === undefined)
    return;
  //
  var currentY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  if (Math.abs(currentY - col.startY) > 10)
    col.canClick = false;
  //
  col.pos.push(currentY, Date.now());
  //
  // update the scroll position relative to pointer start position
  var y = col.y + (currentY - col.startY);
  if (y > col.minY) {
    // scrolling up higher than scroll area
    y = Math.pow(y, 0.8);
    col.bounceFrom = y;
  }
  else if (y < col.maxY) {
    // scrolling down below scroll area
    y += Math.pow(col.maxY - y, 0.9);
    col.bounceFrom = y;
  }
  else {
    col.bounceFrom = 0;
  }
  this.updateColumn(c, y, 0, false, false);
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 * @param {integer} c colum index to refresh
 */
Client.IonDateTime.prototype.pointerEnd = function (ev, c)
{
  var col = this.pickerCols[c];
  col.velocity = 0;
  if (col.bounceFrom > 0) {
    // bounce back up
    this.updateColumn(c, col.minY, 100, true, true);
  }
  else if (col.bounceFrom < 0) {
    // bounce back down
    this.updateColumn(c, col.maxY, 100, true, true);
  }
  else if (col.startY !== undefined) {
    var endY = ev.changedTouches ? ev.changedTouches[0].screenY : ev.screenY;
    col.pos.push(endY, Date.now());
    var endPos = (col.pos.length - 1);
    var startPos = endPos;
    var timeRange = (Date.now() - 150);
    //
    // move pointer to position measured 150ms ago
    for (var i = endPos; i > 0 && col.pos[i] > timeRange; i -= 2) {
      startPos = i;
    }
    if (startPos !== endPos) {
      // compute relative movement between these two points
      var timeOffset = (col.pos[endPos] - col.pos[startPos]);
      var movedTop = (col.pos[startPos - 1] - col.pos[endPos - 1]);
      // based on XXms compute the movement to apply for each render step
      col.velocity = ((movedTop / timeOffset) * (1000 / 60));
      if (Math.abs(col.velocity) < 1)
        col.velocity = 0;
    }
    // Move column
    if (Math.abs(endY - col.startY) > 3) {
      ev.preventDefault();
      ev.stopPropagation();
      var y = col.y + (endY - col.startY);
      this.updateColumn(c, y, 0, true, true);
    }
    else {
      // we are stopping with a tap. need to select current element
      this.setSelected(c, col.selectedIndex, 250);
      ev.preventDefault();
      ev.stopPropagation();
    }
  }
  //
  // Start decelerating
  col.startY = undefined;
  this.decelerate(c);
};


/**
 * Deceleration loop
 * @param {event} ev
 * @param {integer} c colum index to refresh
 */
Client.IonDateTime.prototype.decelerate = function (c)
{
  // Maybe the widget has been closed while spinning
  if (!this.pickerCols)
    return;
  var col = this.pickerCols[c];
  if (!col)
    return;
  //
  var y = 0;
  cancelAnimationFrame(col.raf);
  //
  if (isNaN(col.y) || !col.optHeight) {
    this.updateColumn(c, y, 0, true, true);
  }
  else if (Math.abs(col.velocity) > 0) {
    // still decelerating
    col.velocity *= 0.97;
    // do not let it go slower than a velocity of 1
    col.velocity = (col.velocity > 0 ? Math.max(col.velocity, 1) : Math.min(col.velocity, -1));
    y = Math.round(col.y - col.velocity);
    if (y > col.minY) {
      // it's trying to scroll up farther than the options we have!
      y = col.minY;
      col.velocity = 0;
    }
    else if (y < col.maxY) {
      // it's trying to scroll down farther than we can!
      y = col.maxY;
      col.velocity = 0;
    }
    //
    var notLockedIn = (y % col.optHeight !== 0 || Math.abs(col.velocity) > 1);
    this.updateColumn(c, y, 0, true, !notLockedIn);
    if (notLockedIn) {
      // isn't locked in yet, keep decelerating until it is
      col.raf = requestAnimationFrame(function () {
        this.decelerate(c);
      }.bind(this));
    }
  }
  else if (col.y % col.optHeight !== 0) {
    // needs to still get locked into a position so options line up
    var currentPos = Math.abs(col.y % col.optHeight);
    // create a velocity in the direction it needs to scroll
    col.velocity = (currentPos > (col.optHeight / 2) ? 1 : -1);
    this.decelerate(c);
  }
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 * @param {integer} c colum index to refresh
 */
Client.IonDateTime.prototype.pointerOut = function (ev, c)
{
  var x = ev.toElement;
  var out = true;
  while (x) {
    if (x === this.pickerCols[c].wrapper) {
      out = false;
      break;
    }
    x = x.parentNode;
  }
  if (out)
    this.pointerEnd(ev, c);
};


/**
 * Add listener to click events
 * @param {obj} b button
 * @param {integer} i colum index to refresh
 * @param {integer} j option index
 */
Client.IonDateTime.prototype.registerClick = function (b, i, j)
{
  b.onclick = function (ev) {
    this.optClick(ev, i, j)
  }.bind(this);
};


/**
 * Select an option by clicking on it
 */
Client.IonDateTime.prototype.optClick = function (ev, c, idx)
{
  var col = this.pickerCols[c];
  if (!col.velocity && col.canClick) {
    ev.preventDefault();
    ev.stopPropagation();
    this.setSelected(c, idx, 250);
  }
};


/**
 * Select an option
 */
Client.IonDateTime.prototype.setSelected = function (c, selectedIndex, duration)
{
  var col = this.pickerCols[c];
  // if there is a selected index, then figure out it's y position
  // if there isn't a selected index, then just use the top y position
  var y = (selectedIndex > -1) ? ((selectedIndex * col.optHeight) * -1) : 0;
  cancelAnimationFrame(col.raf);
  col.velocity = 0;
  // so what y position we're at
  this.updateColumn(c, y, duration, true, true);
};


/**
 * Validate the selected options
 */
Client.IonDateTime.prototype.validate = function (refresh)
{
  var m = this.getSelectedDate();
  var c = false;
  //
  for (var i = 0; i < this.pickerCols.length; i++) {
    var col = this.pickerCols[i];
    //
    var min = 0;
    var max = col.options.length - 1;
    //
    switch (col.name) {
      case "month":
        if (m.year() === this.min.year())
          min = this.min.month();
        if (m.year() === this.max.year())
          max = this.max.month();
        break;
      case "day":
        max = m.daysInMonth() - 1;
        if (m.year() === this.min.year() && m.month() === this.min.month())
          min = this.min.date() - 1;
        if (m.year() === this.max.year() && m.month() === this.max.month())
          max = this.max.date() - 1;
        break;
      case "hour":
        if (m.year() === this.min.year() && m.month() === this.min.month() && m.date() === this.min.date())
          min = this.min.hour();
        if (m.year() === this.max.year() && m.month() === this.max.month() && m.date() === this.max.date())
          max = this.max.hour();
        break;
      case "minute":
        if (m.year() === this.min.year() && m.month() === this.min.month() && m.date() === this.min.date() && m.hour() === this.min.hour())
          min = this.min.minute();
        if (m.year() === this.max.year() && m.month() === this.max.month() && m.date() === this.max.date() && m.hour() === this.max.hour())
          max = this.max.minute();
        break;
      case "second":
        if (m.year() === this.min.year() && m.month() === this.min.month() && m.date() === this.min.date() && m.hour() === this.min.hour() && m.minute() === this.min.minute())
          min = this.min.second();
        if (m.year() === this.max.year() && m.month() === this.max.month() && m.date() === this.max.date() && m.hour() === this.max.hour() && m.minute() === this.max.minute())
          max = this.max.second();
        break;
    }
    //
    // Disalbe not valid options
    for (var j = 0; j < col.options.length; j++) {
      var n = j < min || j > max;
      //
      if (!c && col.options[j].disabled !== n)
        c = true;
      //
      col.options[j].disabled = n;
      //
      if (col.name === "day" && col.token.length > 2) {
        // Refresh weekday names
        let d = moment(m).date(j + 1);
        let s = d.format(col.token);
        col.options[j].value = s;
        if (!n)
          col.options[j].obj.firstChild.textContent = s;
      }
    }
  }
  //
  // If something has changed, update columns
  if (refresh && c)
    this.refreshPicker();
};


/**
 * Returns a colum given its name
 */
Client.IonDateTime.prototype.getColumn = function (name)
{
  for (var i = 0; i < this.pickerCols.length; i++) {
    var col = this.pickerCols[i];
    if (col.name === name)
      return col;
  }
};


/**
 * Returns the value of a column given its name
 */
Client.IonDateTime.prototype.getColumnValue = function (name)
{
  var col = this.getColumn(name);
  if (col && col.selectedIndex > -1 && !col.options[col.selectedIndex].disabled) {
    if (name === "year")
      return parseInt(col.options[col.selectedIndex].value);
    if (name === "day")
      return col.selectedIndex + 1;
    if (name === "ampm")
      return col.options[col.selectedIndex].value;
    else
      return col.selectedIndex;
  }
};


/**
 * Returns selected date
 */
Client.IonDateTime.prototype.getSelectedDate = function ()
{
  var year = this.getColumnValue("year") || this.value.year();
  var month = this.getColumnValue("month") || this.value.month();
  var day = this.getColumnValue("day") || this.value.date();
  //
  // Calc the last day of the month
  var m = moment({year: year, month: month, date: 1});
  var ld = m.daysInMonth();
  //
  // If the selected day is over, adjust it
  if (day > ld) {
    var col = this.getColumn("day");
    if (col)
      col.selectedIndex = ld - 1;
  }
  //
  // Reconstruct date by using values and tokens
  var s = "";
  var f = "";
  for (var i = 0; i < this.pickerCols.length; i++) {
    var col = this.pickerCols[i];
    if (col.selectedIndex > -1) {
      if (s) {
        s += " ";
        f += " ";
      }
      s += col.options[col.selectedIndex].value;
      f += col.token;
    }
  }
  //
  // Esclude ddd token that is not handled by moment
  let idx = f.indexOf("ddd ");
  if (idx > -1) {
    f = f.substring(0, idx) + f.substring(idx + 4);
    s = s.substring(0, idx) + s.substring(idx + 4);
  }
  //
  var ris = moment(s, f);
  //
  // Copy not present columns from actual value
  if (!this.getColumn("year"))
    ris.year(this.value.year());
  if (!this.getColumn("month"))
    ris.month(this.value.month());
  if (!this.getColumn("day"))
    ris.date(this.value.date());
  if (!this.getColumn("hour"))
    ris.hour(this.value.hour());
  if (!this.getColumn("minute"))
    ris.minute(this.value.minute());
  if (!this.getColumn("second"))
    ris.second(this.value.second());
  //
  return ris;
};


/**
 * Set custom error message
 * @param {String} message - the error message
 * @param {bool} srv
 */
Client.IonDateTime.prototype.setError = function (message, srv)
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
      this.errObj.className = "datetime-error-message";
      this.domObj.appendChild(this.errObj);
    }
    if (this.errObj) {
      this.errObj.innerText = message;
      this.errObj.style.display = message ? "" : "none";
    }
  }.bind(this), 10);
};


/**
 * returns true if the IonDateTime must be opened in popup mode
 */
Client.IonDateTime.prototype.usePopupKeyboard = function ()
{
  var dt = Client.mainFrame.device.viewportParams.devicetype ? Client.mainFrame.device.viewportParams.devicetype : Client.mainFrame.device.type;
  return dt !== "smartphone";
};

/**
 * Returns true or false if we must enable the numpad
 */
Client.IonDateTime.prototype.usePicker = function ()
{
  var dt = Client.mainFrame.device.viewportParams.devicetype ? Client.mainFrame.device.viewportParams.devicetype : Client.mainFrame.device.type;
  //
  if (!this.iUsePicker || this.iUsePicker === Client.IonDateTime.SHOW_PICKER_NEVER)
    return false;
  else if (this.iUsePicker === Client.IonDateTime.SHOW_PICKER_MOBILE_ONLY && dt !== "smartphone" && dt !== "tablet")
    return false;
  else
    return true;
};

/*
 * Parses the formats and decides the needed input type
 */
Client.IonDateTime.prototype.getInputType = function ()
{
  var f = this.pickerFormat || this.displayFormat || "";
  f = f.replace(/[^A-Za-z]/g, ' ');
  f = f.split(" ");
  //
  var hasDate = false;
  var hasTime = false;
  for (var i = 0; i < f.length; i++) {
    var t = f[i];
    var colName = this.getColName(t);
    if (colName === "month" || colName === "day" || colName === "year")
      hasDate = true;
    if (colName === "hour" || colName === "minute" || colName === "second")
      hasTime = true;
  }
  //
  if (hasDate && hasTime)
    return "datetime-local";
  else if (hasTime)
    return "time";
  else
    return "date";
};

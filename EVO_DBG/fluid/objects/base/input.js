/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client, autosize, moment */

/**
 * @class An input element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the input
 */
Client.Input = function (element, parent, view)
{
  // The constructor will be called twice during object initialization
  // first time, without any parameter, then with them.
  if (element === undefined)
    return;
  if (view === undefined)
    return;
  //
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement(this.getDOMObjectType(element.type));
  //
  // Set readonly attribute to input element in case of readonly role
  if (Client.clientRole === "ro")
    this.domObj.setAttribute("readonly", "");
  //
  parent.appendChildObject(this, this.domObj);
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  // No click on input if editing (prevents opening on input type file)
  if (Client.mainFrame.isEditing()) {
    this.domObj.addEventListener("click", function (ev) {
      ev.preventDefault();
      return false;
    });
  }
  //
  if (Client.mainFrame.device.browserName === "Chrome" && !Client.mainFrame.device.isMobile && this.domObj && !this.domObj.getAttribute("autocomplete")) {
    setTimeout(function () {
      if (this.domObj)
        this.domObj.setAttribute("autocomplete", "off");
    }.bind(this), 150);
  }
};


// Make Client.Input extend Client.Element
Client.Input.prototype = new Client.Element();


Client.Input.validateReasons = {
  GENERIC: 0,
  ONINPUT: 1
};


/**
 * Returns the type of domObj to create
 * @param {string} type
 */
Client.Input.prototype.getDOMObjectType = function (type)
{
  if (type === "static")
    return "p";
  //
  if (type === "textarea" || type === "select")
    return type;
  //
  return "input";
};


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Input.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  // Save properties to restore them in case of object recreation
  if (Client.mainFrame.isEditing()) {
    if (!this.el || el === this.el)
      this.el = {};
    for (var i in el)
      this.el[i] = el[i];
  }
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
    if (this.domObj.options)
      this.domObj.options.length = 0;
    //
    // Create an option for each item in the list
    for (var i = 0; i < el.list.length; i++) {
      var o = el.list[i];
      this.addOption(o.v, o.n);
    }
    //
    // restore value if present
    if (this.value)
      this.domObj.value = this.value;
    //
    // Base class must not use the list property
    delete el.list;
  }
  //
  if (el.data) {
    if (el.data.columns) {
      this.initInput(el);
      if (this.value)
        this.domObj.value = this.value;
    }
    else if (el.data.pos !== undefined) {
      if (el.data.data) // Update option
        this.updateOption(el.data);
      else  // Remove option
        this.removeOptionAtPos(el.data.pos);
    }
    else { // Add option
      this.addOption(el.data.data[0], el.data.data[1]);
      //
      // restore value if present
      if (this.value)
        this.domObj.value = this.value;
    }
    //
    // Base class must not use the data property
    delete el.data;
  }
  // If there is an activation key remember it
  if (el.cmdKey) {
    this.cmdKey = el.cmdKey.toUpperCase();
    //
    // Base class must not use the cmdKey property
    delete el.cmdKey;
  }
  //
  // Activate autosize if requird
  if (el.style && el.style.height && this.domObj.tagName === "TEXTAREA") {
    if (el.style.height === "auto") {
      setTimeout(function () {
        autosize(this.domObj);
      }.bind(this), 0);
      this.autosize = true;
    }
    else if (this.autosize) {
      autosize.destroy(this.domObj);
      this.autosize = false;
    }
  }
  //
  // Changing type? Maybe should recreate the domobj
  if (el.type && this.domObj.parentNode) {
    if (this.domObj.tagName.toLowerCase() !== this.getDOMObjectType(el.type)) {
      var newEl = document.createElement(this.getDOMObjectType(el.type));
      this.focusAttached = false;
      this.domObj.parentNode.insertBefore(newEl, this.domObj);
      this.domObj.parentNode.removeChild(this.domObj);
      var oldEl = this.domObj;
      this.domObj = newEl;
      if (this.el)
        this.updateElement(this.el);
    }
    //
    // Empty fake value for password fields
    if (this.domObj.tagName === "INPUT" && !this.focusAttached) {
      this.addEventsListeners();
      this.focusAttached = true;
    }
  }
  //
  // converting value as innerText if type is static
  if (el.value !== undefined && this.domObj.tagName === "P") {
    el.innerText = el.value;
    delete el.value;
  }
  //
  if (el.value !== undefined) {
    // Storing value for list / option selection
    var v = el.value;
    if (v) {
      if (this.domObj.type === "date" || this.domObj.type === "date-local")
        el.value = moment(v).format("YYYY-MM-DD");
      if (this.domObj.type === "datetime" || this.domObj.type === "datetime-local")
        el.value = moment(v).format("YYYY-MM-DDTHH:mm");
    }
    //
    this.value = el.value;
    this.domObj.value = el.value;
    //
    // Update autosize textarea if required
    if (this.autosize)
      autosize.update(this.domObj);
    //
    // mask the value if needed
    if (this.mask) {
      this.domObj.value = mask_mask(this.domObj.value, this.mask, this.maskType);
      this.domObj.setAttribute("idmaskoldvalue", this.domObj.value);
    }
    //
    delete el.value;
  }
  //
  // setting radio group
  if (el.radioGroup !== undefined) {
    this.domObj.setAttribute("name", el.radioGroup);
    delete el.radioGroup;
  }
  //
  // Setting holding caret feature
  if (el.dontHoldCaret !== undefined) {
    this.domObj.setAttribute("dontholdcaret", el.dontHoldCaret);
    delete el.dontHoldCaret;
  }
  //
  if (el.maskType !== undefined) {
    this.maskType = el.maskType;
    delete el.maskType;
  }
  //
  if (el.mask !== undefined) {
    this.setMask(el.mask, el.type);
    delete el.mask;
    //
    // The maskedInput needs a text dom input
    delete el.type;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Tell the server the value is changed
 * @@param {Object} ev
 * @returns {undefined}
 */
Client.Input.prototype.commit = function (ev) {
  var e = this.changeValueEvent();
  //
  if (this.sendOnChange)
    e.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
  //
  Client.mainFrame.sendEvents(e);
  //
  // I'm not the dirty input anymore
  Client.mainFrame.setDirtyInput(null);
};


/**
 * Add events listeners
 */
Client.Input.prototype.addEventsListeners = function ()
{
  this.domObj.addEventListener("focus", (ev) => {
    if (this.domObj.type === "password") {
      if ("§".repeat(this.domObj.value.length) === this.domObj.value)
        this.domObj.value = "";
    }
  });
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.Input.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onSelectionChange");
  if (pos > -1) {
    events.splice(pos, 1);
    this.domObj.addEventListener("keyup", function () {
      this.checkSelection();
    }.bind(this), false);
    this.domObj.addEventListener("touchend", function () {
      this.checkSelection();
    }.bind(this), false);
    this.domObj.addEventListener("select", function () {
      this.checkSelection();
    }.bind(this), false);
    this.domObj.addEventListener("input", function () {
      this.checkSelection();
    }.bind(this), false);
    this.domObj.addEventListener("mouseup", function () {
      this.checkSelection();
    }.bind(this), false);
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
  //
  var pthis = this;
  //
  var checkOtherRadios = function (evList) {
    if (pthis.domObj.type === "radio") {
      // send chgprop for other checked radios in the same group
      var p = pthis.parent;
      while (p) {
        if (p.domObj && p.domObj.tagName === "FORM")
          break;
        p = p.parent;
      }
      if (!p)
        p = pthis.parent;
      var list = p.getElements();
      for (var i = 0; i < list.length; i++) {
        var ele = list[i];
        if (ele !== pthis && ele.domObj && ele.domObj.tagName === "INPUT"
                && ele.domObj.name === pthis.domObj.name && ele.domObj.type === "radio") {
          var x = {obj: ele.id, id: "chgProp", content: {name: "checked", value: false, clid: Client.id}};
          evList.push(x);
        }
      }
    }
  };
  //
  // file uploader
  var idxup = events.indexOf("onUpload");
  if (idxup >= 0 && this.domObj.type === "file") {
    //
    // do not attach this event because the DOM object does not allow it
    events.splice(idxup, 1);
    //
    // attach change listener to see when new files are uploaded
    this.domObj.addEventListener("change", function (ev) {
      //
      // generate url form upload
      var qstring = Client.Utils.getRESTQueryString({msgType: "input-upload", objId: pthis.id});
      //
      // generate multipart form and send it
      var formData = new FormData();
      for (var i = 0; i < pthis.domObj.files.length; i++)
        formData.append("file", pthis.domObj.files[i]);
      //
      var req = new XMLHttpRequest();
      req.open("POST", qstring, true);
      req.send(formData);
    }, false);
  }
  //
  if (events.indexOf("onChange") >= 0) {
    this.domObj.onchange = function (ev) {
      pthis.validate();
      pthis.checkError(true);
      var e = pthis.changeValueEvent();
      checkOtherRadios(e);
      e.push({obj: pthis.id, id: "onChange", content: pthis.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    };
  }
  //
  if (events.indexOf("onInput") >= 0) {
    this.domObj.oninput = function (ev) {
      if (pthis.validate(Client.Input.validateReasons.ONINPUT)) {
        pthis.checkError();
        var e = pthis.changeValueEvent();
        e.push({obj: pthis.id, id: "onInput", content: pthis.saveEvent(ev)});
        Client.mainFrame.sendEvents(e);
      }
    };
  }
  //
  if (events.indexOf("onChange") < 0 && events.indexOf("onInput") < 0) {
    this.domObj.onchange = function (ev) {
      pthis.validate();
      pthis.checkError(true);
      var e = pthis.changeValueEvent();
      checkOtherRadios(e);
      Client.mainFrame.sendEvents(e);
    };
  }
  //
  if (events.indexOf("onInput") < 0) {
    this.domObj.oninput = function (ev) {
      if (pthis.validate(Client.Input.validateReasons.ONINPUT)) {
        pthis.checkError();
        if (Client.mainFrame.device.isMobile)
          Client.mainFrame.setDirtyInput(pthis.id);
      }
    };
  }
  //
  if (this.domObj.type === "date" || this.domObj.type === "datetime-local") {
    // Those imput type generate invalid value message during date editing
    // and that message is not removable.
    //
    // To handle that we need:
    // - in Element.CheckError the error is not generated if the type is date and the value is null and the input is focused
    // - in Input.changeValueEvent we don't send the error in the same case
    // - we add a Blur/Keydown handler to send check the error and send it to the server
    this.domObj.addEventListener("blur", function (ev) {
      if (!this.domObj.value && (this.domObj.validationMessage || this.errorMessage))
        this.domObj.onchange(ev);
    }.bind(this));
    //
    this.domObj.addEventListener("keydown", function (ev) {
      if (ev.which === 13 && !this.domObj.value && (this.domObj.validationMessage || this.errorMessage))
        this.domObj.onchange(ev);
    }.bind(this));
  }
};


/**
 * Prepare the event of change value
 * @returns {array}
 */
Client.Input.prototype.changeValueEvent = function () {
  var propName = "value";
  var srvPropName = "value";
  if (this.domObj.type === "checkbox" || this.domObj.type === "radio") {
    propName = "checked";
    srvPropName = "checked";
  }
  else if (this.domObj.type === "number") {
    propName = "valueAsNumber";
    srvPropName = "value";
  }
  //
  var x;
  if (!this.mask)
    x = {obj: this.id, id: "chgProp", content: {name: srvPropName, value: this.domObj[propName], clid: Client.id}};
  else {
    var val = mask_unmask(this.domObj[propName], this.mask, this.maskType);
    //
    // Handle the casing mask
    if (this.mask === ">")
      val = ("" + val).toUpperCase();
    if (this.mask === "<")
      val = ("" + val).toLowerCase();
    //
    x = {obj: this.id, id: "chgProp", content: {name: srvPropName, value: val, clid: Client.id}};
  }
  //
  let valMsg = this.domObj.validationMessage;
  if ((this.domObj.type === "date" || this.domObj.type === "datetime-local") && document.activeElement === this.domObj && !this.domObj.value) {
    // No error during editing
    valMsg = "";
  }
  //
  var y = {obj: this.id, id: "chgProp", content: {name: "errorText", value: valMsg, clid: Client.id}};
  return [y, x];
};


/**
 * Initialize the input
 * @param {Object} el - element representation
 */
Client.Input.prototype.initInput = function (el)
{
  // First remove old options
  while (this.domObj.childNodes.length > 0)
    this.domObj.removeChild(this.domObj.childNodes[0]);
  //
  for (var i in el.data.data)
    this.addOption(el.data.data[i][0], el.data.data[i][1]);
};


/**
 * Remove an option from the select at the given position
 * @param {int} pos - the position of the option to remove
 */
Client.Input.prototype.removeOptionAtPos = function (pos)
{
  this.domObj.removeChild(this.domObj.childNodes[pos]);
};


/**
 * Add an option to the select
 * @param {String} value - the value of the option
 * @param {String} name - the text of the option
 */
Client.Input.prototype.addOption = function (value, name)
{
  var opt = document.createElement("option");
  opt.value = (value !== undefined && value !== null) ? value : "";
  opt.text = name;
  this.domObj.appendChild(opt);
};


/**
 * Update a select option
 * @param {Object} data - the data of the option to update. Example: {pos: 3, data:[3, "Andrea"]}
 */
Client.Input.prototype.updateOption = function (data)
{
  var opt = this.domObj.childNodes[data.pos];
  opt.value = data.data[0];
  opt.text = data.data[1];
};


/**
 * Set custom error message
 * @param {String} message - the error message
 * @param {bool} srv
 */
Client.Input.prototype.setError = function (message, srv)
{
  Client.Element.prototype.setError.call(this, message, srv);
  this.domObj.setCustomValidity(message);
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.Input.prototype.close = function (firstLevel, triggerAnimation)
{
  if (this.autosize)
    autosize.destroy(this.domObj);
  //
  if (this.id === Client.mainFrame.getDirtyInput())
    Client.mainFrame.setDirtyInput(null);
  //
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
};


/**
 * This object has been hidden or shown
 * @param {Boolean} visible
 */
Client.Input.prototype.visibilityChanged = function (visible)
{
  // Update autosize
  if (this.autosize && visible)
    autosize.update(this.domObj);
  //
  Client.Element.prototype.visibilityChanged.call(this, visible);
};


/**
 * Validate user input on numeric elements
 * @param {int} reason 1 - the validate is called from the onInput event
 *                         (values in Client.Input.validateReasons )
 * @returns boolean
 */
Client.Input.prototype.validate = function (reason)
{
  // Not numeric? No validation
  if (this.domObj.type !== "number")
    return true;
  //
  // No errors? Push!
  // If the numeric input has a maxlength we must validate the data
  if (!this.domObj.validationMessage && (this.domObj.maxLength === undefined || this.domObj.maxLength <= 0)) {
    return true;
  }
  //
  // Search for validation errrors...
  var len1, len2, a = document.activeElement, s = window.getSelection();
  //
  // Keep moving selection backward until the length stops increasing
  do {
    len1 = String(s).length;
    s.modify('extend', 'backward', 'character');
  } while (String(s).length !== len1);
  //
  var pre = String(s);
  //
  s.collapseToEnd();
  //
  // Keep moving selection forward until the length stops increasing
  do {
    len2 = String(s).length;
    s.modify('extend', 'forward', 'character');
  } while (String(s).length !== len2);
  //
  var post = String(s);
  //
  var text = pre + post;
  var otext = text;
  //
  s.collapseToEnd();
  //
  if (text.length) {
    if (this.mask && this.maskType == "N") {
      // If i've a mask the value is masked (1.000.000,566). In this case to handle the step and the max dec numbers i must remove the thousand separator.
      // It will be restored in the mask_mask function
      text = text.replace(new RegExp(glbThoSep === "." ? "\\" + glbThoSep : glbThoSep, 'g'), "");
    }
    //
    var step = parseFloat(this.domObj.step);
    var maxdec = step ? Math.ceil(-Math.log10(step)) : 0;
    var allChars = "-0123456789.,";
    //
    // push change only if the last character is a number
    var c = text[text.length - 1];
    if (isNaN(c) && allChars.indexOf(c) > -1) {
      if ((c !== "." && c !== ",") || maxdec > 0)
        return false;
    }
    //
    // search text for errors
    var cnt = 0;
    var dsfound = false;
    var numdec = 0;
    //
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      var ok = allChars.indexOf(c) > -1;
      //
      if (c === "-") {
        if (i > 0)
          ok = false;
      }
      else if (c === "." || c === ",") {
        if (dsfound)
          ok = false;
        else
          dsfound = true;
        if (maxdec === 0)
          ok = false;
      }
      else if (dsfound) {
        numdec++;
        if (numdec > maxdec) {
          ok = false;
          numdec--;
        }
      }
      //
      if (!ok) {
        text = text.substring(0, i) + text.substring(i + 1);
        i--;
        cnt++;
      }
    }
    //
    text = text.replace(",", ".");
    //
    // check step
    if (numdec > 0) {
      var m = parseFloat(text) % step;
      if (Math.abs(m) > 0.000001 && Math.abs(Math.abs(m) - step) > 0.000001) {
        var nv = parseFloat(text) - m;
        text = nv.toLocaleString("en-en", {maximumFractionDigits: maxdec, minimumFractionDigits: maxdec});
      }
    }
    //
    // check min and max value
    // (skip min checking from the oninput event, we cannot have all the value that the user wants to submit)
    if (this.domObj.min && reason !== Client.Input.validateReasons.ONINPUT) {
      if (parseFloat(text) < parseFloat(this.domObj.min)) {
        text = this.domObj.min;
      }
    }
    if (this.domObj.max) {
      if (parseFloat(text) > parseFloat(this.domObj.max)) {
        text = this.domObj.max;
      }
    }
    //
    // Check maxlength
    if (this.domObj.maxLength && this.domObj.maxLength > 0) {
      // If the text has the dot we add 1 to the maxlength, the dot must not be counted
      let ml = parseFloat(this.domObj.maxLength) + (dsfound ? 1 : 0);
      //
      if (text.length > ml) {
        // if we have an old value restore that, otherwise
        // slice the text from the end
        if (this.domObj.oldvalue)
          text = this.domObj.oldvalue;
        else
          text = text.substr(-1 * ml, ml);
      }
    }
    //
    if (text !== otext && this.mask && this.maskType == "N")
      text = mask_mask(text, this.mask, this.maskType);
    //
    // Memorize the current value as the old value, in the next key it will really be the 'old'
    this.domObj.oldvalue = text;
    this.domObj.value = text;
    //
    // restore selection
    s = window.getSelection();
    for (var i = 0; i < len2; i++)
      s.modify('extend', 'backward', 'character');
    s.collapseToStart();
  }
  //
  return true;
};


/**
 * Set given property and fire events if needed
 * @param {Object} options
 *                        - propName
 *                        - propValue
 *                        - events - events to dispatch
 *                        - domObj - dom object to dispatch event on
 */
Client.Input.prototype.setProperty = function (options)
{
  options = options || {};
  //
  // Set events to fire depending on changed property
  var opts = Object.assign({}, options);
  if (options.propName === "value") {
    // If the value is a string, fire onInput for each character
    if (typeof options.propValue === "string") {
      var partialString = "";
      for (var i = 0; i < options.propValue.length; i++) {
        partialString += options.propValue[i];
        opts = Object.assign({}, options);
        opts.propValue = partialString;
        opts.events = ["input"];
        Client.Element.prototype.setProperty.call(this, opts);
      }
    }
    //
    // Fire onChange
    opts = Object.assign({}, options);
    opts.events = ["change"];
  }
  else if (options.propName === "checked") {
    opts = Object.assign({}, options);
    opts.events = ["change"];
  }
  //
  Client.Element.prototype.setProperty.call(this, opts);
};


/**
 * Ritorna la selezione attuale
 * @param {string} cbId - callback id
 */
Client.Input.prototype.getSelection = function (cbId)
{
  var start = this.domObj.selectionStart;
  var end = this.domObj.selectionEnd;
  var text = this.domObj.value.substring(start, end);
  var ris = {start: start, end: end, text: text};
  console.warn(ris);
  //
  var e = [{obj: this.id, id: "cb", content: {res: ris, cbId: cbId}}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Imposta la selezione
 * @param {int} start
 * @param {int} end
 */
Client.Input.prototype.setSelection = function (start, end)
{
  this.domObj.setSelectionRange(start, end);
};


/**
 * Imposta la selezione
 * @param {string} action
 * @param {string} cbId - callback id
 */
Client.Input.prototype.copySelection = function (action, cbId)
{
  var res = document.execCommand(action || "copy");
  //
  var e = [{obj: this.id, id: "cb", content: {res: res, cbId: cbId}}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Send event
 */
Client.Input.prototype.checkSelection = function () {
  if (!this.checkSelectionTimeout) {
    this.checkSelectionTimeout = setTimeout(function () {
      this.checkSelectionTimeout = undefined;
      if (this.selectionStart !== this.domObj.selectionStart || this.selectionEnd !== this.domObj.selectionEnd) {
        this.selectionStart = this.domObj.selectionStart;
        this.selectionEnd = this.domObj.selectionEnd;
        var text = this.domObj.value.substring(this.selectionStart, this.selectionEnd);
        var e = [{obj: this.id, id: "onSelectionChange", content: {start: this.selectionStart, end: this.selectionEnd, text: text}}];
        Client.mainFrame.sendEvents(e);
      }
    }.bind(this), 100);
  }
};


/**
 * Set mask
 * @param {String} mask
 * @param {String} type
 */
Client.Input.prototype.setMask = function (mask, type)
{
  let maskType = this.getMaskType(type);
  //
  // Adapt the mask to the language
  if (maskType === "N" && type === "number") {
    if (!Client.mainFrame.isIDF) {
      glbDecSep = Client.mainFrame.theme.decimalSeparator || Client.mainFrame.device.numberPattern.decimal;
      glbThoSep = Client.mainFrame.theme.groupingSeparator || Client.mainFrame.device.numberPattern.grouping;
    }
    //
    // IN the mask we use ###,###,###.##
    // , -> group separator
    // . -> decimal separator
    // now we must adapt it to the detected separators, but using a temporary token (otherwise we risk to lose a token)
    mask = mask.replace(/\./g, "@");
    mask = mask.replace(/,/g, glbThoSep);
    mask = mask.replace(/@/g, glbDecSep);
    //
    // Set the maxlength to enable validation
    this.domObj.maxLength = mask.length;
    //
    // we need to set the correct step to enable the validation. the step must be the max decimal numbers allowed in the mask
    var step = "0";
    if (mask.indexOf(glbDecSep) > 0) {
      var rep = mask.length - (mask.indexOf(glbDecSep) + 2);
      step = "0." + "0".repeat(rep >= 0 ? rep : 0) + "1";
    }
    this.domObj.step = step;
  }
  //
  // If the value is set we need to mask it
  if (this.value && mask)
    this.domObj.value = mask_mask(this.value, mask, maskType);
  //
  Client.Element.prototype.setMask.call(this, mask, type);
};


/**
 * Get mask type
 * @param {String} type
 */
Client.Input.prototype.getMaskType = function (type)
{
  let maskType = Client.Element.prototype.getMaskType.call(this);
  //
  type = this.type || type;
  if (type === "number")
    maskType = "N";
  if (type === "date")
    maskType = "D";
  //
  if (maskType === "A" && this.maskType)
    maskType = this.maskType;
  //
  return maskType;
};
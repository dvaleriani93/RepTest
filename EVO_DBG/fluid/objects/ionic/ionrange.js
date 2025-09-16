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
Client.IonRange = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-range");
  this.sliderObj = document.createElement("div");
  this.sliderObj.className = "range-slider";
  this.rangeBar = document.createElement("div");
  this.rangeBar.className = "range-bar";
  //
  this.sliderObj.appendChild(this.rangeBar);
  this.valueBar = document.createElement("div");
  this.valueBar.className = "range-bar range-bar-active";
  this.sliderObj.appendChild(this.valueBar);
  //
  this.knob1 = this.createKnob();
  this.sliderObj.appendChild(this.knob1);
  //
  this.domObj.appendChild(this.sliderObj);
  this.min = 1;
  this.max = 100;
  this.step = 1;
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  if (parent instanceof Client.IonItem) {
    parent.domObj.classList.add("item-range");
  }
};

Client.IonRange.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonRange.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
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
  if (el.leftLabel !== undefined) {
    if (!this.leftLabel && el.leftLabel) {
      this.leftLabel = document.createElement("ion-label");
      this.leftLabel.setAttribute("range-left", "");
      this.domObj.insertBefore(this.leftLabel, this.domObj.firstChild);
    }
    if (this.leftLabel && !el.leftLabel) {
      this.leftLabel.parentNode.removeChild(this.leftLabel);
      delete this.leftLabel;
    }
    if (el.leftLabel && this.leftLabel)
      this.leftLabel.textContent = el.leftLabel;
  }
  if (el.rightLabel !== undefined) {
    if (!this.rightLabel && el.rightLabel) {
      this.rightLabel = document.createElement("ion-label");
      this.rightLabel.setAttribute("range-right", "");
      this.domObj.appendChild(this.rightLabel);
    }
    if (this.rightLabel && !el.rightLabel) {
      this.rightLabel.parentNode.removeChild(this.rightLabel);
      delete this.rightLabel;
    }
    if (el.rightLabel && this.rightLabel)
      this.rightLabel.textContent = el.rightLabel;
  }
  //
  if (el.leftIcon !== undefined) {
    if (!this.leftIcon && el.leftIcon) {
      this.leftIcon = document.createElement("ion-icon");
      this.leftIcon.setAttribute("range-left", "");
      this.leftIcon.setAttribute("small", "");
      this.domObj.insertBefore(this.leftIcon, this.domObj.firstChild);
    }
    if (this.leftIcon && !el.leftIcon) {
      this.leftIcon.parentNode.removeChild(this.leftIcon);
      delete this.leftIcon;
    }
    if (el.leftIcon && this.leftIcon)
      Client.IonHelper.setIonIcon(el.leftIcon, this.leftIcon);
  }
  if (el.rightIcon !== undefined) {
    if (!this.rightIcon && el.rightIcon) {
      this.rightIcon = document.createElement("ion-icon");
      this.rightIcon.setAttribute("range-right", "");
      this.domObj.appendChild(this.rightIcon);
    }
    if (this.rightIcon && !el.rightIcon) {
      this.rightIcon.parentNode.removeChild(this.rightIcon);
      delete this.rightIcon;
    }
    if (el.rightIcon && this.rightIcon)
      Client.IonHelper.setIonIcon(el.rightIcon, this.rightIcon);
  }
  //
  if (el.pin !== undefined) {
    this.pin = el.pin;
    delete el.pin;
    this.knob1.firstChild.style.display = this.pin ? "" : "none";
    if (this.knob2)
      this.knob2.firstChild.style.display = this.pin ? "" : "none";
    this.domObj.classList.toggle("range-has-pin", this.pin);
  }
  //
  if (el.disabled !== undefined) {
    this.disabled = el.disabled;
    delete el.disabled;
    this.domObj.classList.toggle("range-disabled", this.disabled);
    if (Client.IonItem && this.parent instanceof Client.IonItem) {
      this.parent.domObj.classList.toggle("item-range-disabled", this.disabled);
    }
  }
  //
  if (el.max !== undefined) {
    this.max = el.max;
  }
  if (el.min !== undefined) {
    this.min = el.min;
  }
  if (el.step !== undefined || el.snap !== undefined || this.domObj.parentNode === null) {
    this.snap = el.snap === undefined ? this.snap : el.snap;
    this.updateTicks(el.step === undefined ? this.step : el.step);
  }
  if (el.value !== undefined || el.step !== undefined || el.snap !== undefined ||
          el.max !== undefined || el.min !== undefined) {
    this.updateValue(el.value === undefined ? this.value : el.value);
    delete el.value;
    delete el.step;
    delete el.max;
    delete el.snap;
    delete el.min;
  }
  //
  if (el.dualKnobs !== undefined) {
    this.dualKnobs = el.dualKnobs;
    if (this.dualKnobs && !this.knob2) {
      this.knob2 = this.createKnob();
      this.sliderObj.appendChild(this.knob2);
    }
    if (!this.dualKnobs && this.knob2) {
      this.knob2.parentNode.removeChild(this.knob2);
      delete this.knob2;
    }
    //
    if (this.dualKnobs && ((typeof this.value !== "object") || this.value === null)) {
      this.value = {upper: this.value ? this.value : 0, lower: this.value ? this.value : 0};
    }
    if (!this.dualKnobs && typeof this.value === "object") {
      this.value = this.value ? (this.value.upper || this.value.lower) : 0;
    }
    this.updateValue(this.value);
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Add events listeners
 * @param {HTMLElement} el
 */
Client.IonRange.prototype.addEventsListeners = function (el)
{
  if (!el)
    return;
  //
  // Handle focus
  if (this.parent instanceof Client.IonItem) {
    el.addEventListener("focus", (ev) => {
      this.parent.domObj.classList.add("range-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", this.focusColor);
    });
    //
    el.addEventListener("blur", (ev) => {
      this.parent.domObj.classList.remove("range-has-focus");
      if (this.focusColor)
        this.parent.domObj.setAttribute("focuscolor", "");
    });
  }
  //
  // On desktop we intercept the enter key and we get to the next focusable object
  // The event is used also to change the value of the knob by using the arrows
  if (!Client.mainFrame.device.isMobile) {
    el.onkeydown = (ev) => {
      if (ev.which === 9 && this.handleCustomNavigation())
        ev.preventDefault();
    };
    //
    el.onkeyup = (ev) => this.keyUp(ev, el);
  }
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.IonRange.prototype.attachEvents = function (events)
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
  var pos = events.indexOf("onInput");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendOnInput = true;
  }
  //
  var pthis = this;
  this.domObj.addEventListener("mousedown", function (ev) {
    return pthis.pointerDown(ev);
  });
  this.domObj.addEventListener("touchstart", function (ev) {
    return pthis.pointerDown(ev);
  });
  this.domObj.addEventListener("mousemove", function (ev) {
    pthis.pointerMove(ev);
  });
  this.domObj.addEventListener("touchmove", function (ev) {
    pthis.pointerMove(ev);
  });
  this.domObj.addEventListener("mouseup", function (ev) {
    pthis.pointerUp(ev);
  }, {passive: true});
  this.domObj.addEventListener("mouseout", function (ev) {
    pthis.pointerOut(ev);
  }, {passive: true});
  this.domObj.addEventListener("touchend", function (ev) {
    pthis.pointerUp(ev);
  }, {passive: true});
  this.domObj.addEventListener("touchcancel", function (ev) {
    pthis.pointerOut(ev);
  }, {passive: true});
  //
  Client.Element.prototype.attachEvents.call(this, events);
};

/**
 * Update ticks objects
 */
Client.IonRange.prototype.updateTicks = function (step)
{
  if (step < 1)
    step = 1;
  this.step = step;
  var x = this.sliderObj.getElementsByClassName("range-tick");
  for (var i = x.length - 1; i >= 0; i--) {
    x[i].parentNode.removeChild(x[i]);
  }
  //
  if (this.snap && step >= 1) {
    for (var j = this.min; j <= this.max; j += this.step) {
      var b = document.createElement("div");
      b.className = "range-tick";
      b.style.left = (this.valueToRatio(j) * 100) + "%";
      this.sliderObj.insertBefore(b, this.rangeBar);
    }
  }
};

/**
 * Update value objects
 */
Client.IonRange.prototype.updateValue = function (value, emitFeedback)
{
  this.value = value;
  var feed = false;
  //
  if (this.dualKnobs) {
    var xl = this.valueToRatio(value.lower) * 100;
    this.valueBar.style.left = (xl) + "%";
    var xu = this.valueToRatio(value.upper) * 100;
    this.valueBar.style.right = (100 - xu) + "%";
    this.knob1.style.left = xl + "%";
    this.knob2.style.left = xu + "%";
    if (this.pin) {
      this.knob1.firstChild.textContent = value.lower;
      this.knob2.firstChild.textContent = value.upper;
    }
    //
    if (this.snap) {
      var x = this.sliderObj.getElementsByClassName("range-tick");
      for (var i = 0, j = this.min; i < x.length; i++, j += this.step) {
        if (j <= value.upper && j >= value.lower) {
          if (!x[i].classList.contains("range-tick-active")) {
            x[i].classList.add("range-tick-active");
            feed = true;
          }
        }
        else {
          if (x[i].classList.contains("range-tick-active")) {
            x[i].classList.remove("range-tick-active");
            feed = true;
          }
        }
      }
    }
  }
  else {
    var x = this.valueToRatio(value) * 100;
    this.valueBar.style.right = (100 - x) + "%";
    this.knob1.style.left = x + "%";
    if (this.pin)
      this.knob1.firstChild.textContent = value;
    //
    if (this.snap) {
      var x = this.sliderObj.getElementsByClassName("range-tick");
      for (var i = 0, j = this.min; i < x.length; i++, j += this.step) {
        if (j <= value) {
          if (!x[i].classList.contains("range-tick-active")) {
            x[i].classList.add("range-tick-active");
            feed = true;
          }
        }
        else {
          if (x[i].classList.contains("range-tick-active")) {
            x[i].classList.remove("range-tick-active");
            feed = true;
          }
        }
      }
    }
  }
  //
  if (feed && emitFeedback) {
    Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "changed"});
  }
};

/**
 * Convert ratios
 */
Client.IonRange.prototype.ratioToValue = function (ratio)
{
  ratio = Math.round(((this.max - this.min) * ratio) + this.min);
  return Math.round(ratio / this.step) * this.step;
};
Client.IonRange.prototype.valueToRatio = function (value)
{
  if (value < this.min)
    value = this.min;
  if (value > this.max)
    value = this.max;
  value = Math.round(value / this.step) * this.step;
  return (value - this.min) / (this.max - this.min);
};


/**
 * Create a knob object
 */
Client.IonRange.prototype.createKnob = function ()
{
  var k = document.createElement("div");
  k.className = "range-knob-handle";
  k.tabIndex = 0;
  //
  var pin = document.createElement("div");
  pin.className = "range-pin";
  k.appendChild(pin);
  pin.style.display = this.pin ? "" : "none";
  //
  var knob = document.createElement("div");
  knob.className = "range-knob";
  k.appendChild(knob);
  //
  this.addEventsListeners(k);
  //
  return k;
};

/**
 * user pressed the knob
 * @param {event} ev
 */
Client.IonRange.prototype.pointerDown = function (ev)
{
  if (this.disabled)
    return;
  //
  this.domObj.classList.add("range-pressed");
  if (this.dualKnobs)
    this.startValue = {lower: this.value.lower, upper: this.value.upper};
  else
    this.startValue = this.value;
  this.knob1.classList.add("range-knob-pressed");
  if (this.knob2)
    this.knob2.classList.add("range-knob-pressed");
  //
  if (this.snap)
    Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "start"});
  //
  this.pointerMove(ev);
};

/**
 * user pressed the knob
 * @param {event} ev
 */
Client.IonRange.prototype.pointerUp = function (ev)
{
  if (this.disabled)
    return;
  //
  this.domObj.classList.remove("range-pressed");
  this.knob1.classList.remove("range-knob-pressed");
  if (this.knob2)
    this.knob2.classList.remove("range-knob-pressed");
  //
  var send = this.startValue === "*";
  if (this.dualKnobs)
    send = send || this.value.lower !== this.startValue.lower || this.value.upper !== this.startValue.upper;
  else
    send = send || this.value !== this.startValue;
  //
  if (send) {
    var x = [{obj: this.id, id: "chgProp", content: {name: "value", value: this.value, clid: Client.id}}];
    if (this.sendOnChange)
      x.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
    Client.mainFrame.sendEvents(x);
  }
  delete this.startValue;
  delete this.startKnob;
  //
  if (this.snap)
    Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "end"});
};

/**
 * user moved the knob
 * @param {event} ev
 */
Client.IonRange.prototype.pointerMove = function (ev)
{
  if (this.domObj.classList.contains("range-pressed")) {
    var lb = document.documentElement.getBoundingClientRect().left;
    var le = this.rangeBar.getBoundingClientRect().left;
    var l = le - lb;
    //
    ev.preventDefault();
    ev.stopPropagation();
    var x = ((ev.touches ? ev.touches[0].clientX : ev.x) - l) / this.rangeBar.clientWidth;
    if (x < 0)
      x = 0;
    if (x > 1)
      x = 1;
    var v = this.ratioToValue(x);
    //
    if (this.dualKnobs) {
      var m = (this.value.lower + this.value.upper) / 2;
      var k = (v < m) ? "lower" : "upper";
      if (!this.startKnob) {
        this.startKnob = k;
      }
      else {
        if (this.startKnob === "lower" && v <= this.value.upper)
          k = this.startKnob;
        else if (this.startKnob === "upper" && v >= this.value.lower)
          k = this.startKnob;
        else
          this.startKnob = k;
      }
      //
      if (v !== this.value[k]) {
        var nv = this.value;
        nv[k] = v;
        //
        if (this.sendOnInput) {
          this.startValue = "*";
          var x = [{obj: this.id, id: "chgProp", content: {name: "value", value: nv, clid: Client.id}}];
          if (this.sendOnInput)
            x.push({obj: this.id, id: "onInput", content: this.saveEvent(ev)});
          Client.mainFrame.sendEvents(x);
        }
        this.updateValue(nv, true);
      }
    }
    else {
      if (v !== this.value) {
        if (this.sendOnInput) {
          this.startValue = "*";
          var x = [{obj: this.id, id: "chgProp", content: {name: "value", value: v, clid: Client.id}}];
          if (this.sendOnInput)
            x.push({obj: this.id, id: "onInput", content: this.saveEvent(ev)});
          Client.mainFrame.sendEvents(x);
        }
        this.updateValue(v, true);
      }
    }
  }
};


/**
 * user pressed the knob
 * @param {event} ev
 */
Client.IonRange.prototype.pointerOut = function (ev)
{
  if (this.domObj.classList.contains("range-pressed")) {
    var x = ev.toElement;
    var out = true;
    while (x) {
      if (x === this.domObj) {
        out = false;
        break;
      }
      x = x.parentNode;
    }
    if (out)
      this.pointerUp(ev);
  }
};

/**
 * user pressed a key on the knob
 * @param {event} ev
 */
Client.IonRange.prototype.keyUp = function (ev, knob)
{
  if ((ev.which === 13 || ev.which === 9) && this.handleCustomNavigation()) {
    Client.IonHelper.focusNextInput(this.view, knob, (ev.which === 9 && ev.shiftKey));
  }
  else if (ev.which === 38 || ev.which === 40 || ev.which === 39 || ev.which === 37) {
    // Get the new value by using the direction and the step (if not set the step is 1)
    // also consider the limits if setted by the user
    var up = ev.which === 38 || ev.which === 39;
    var step = this.step ? this.step : 1;
    var currentVal = this.dualKnobs ? (knob === this.knob1 ? this.value.lower : this.value.upper) : this.value;
    if (isNaN(currentVal) || currentVal === undefined)  // Protection if the server hasn't set the value
      currentVal = 0;
    currentVal += step * (up ? 1 : -1);
    //
    if (this.min !== undefined && currentVal < this.min)
      currentVal = this.min;
    if (this.max !== undefined && currentVal > this.max)
      currentVal = this.max;
    //
    // For dualKnobs the value must be an object, the param to change depends from the knob moved
    if (this.dualKnobs) {
      currentVal = {
        lower: (knob === this.knob1 ? currentVal : this.value.lower),
        upper: (knob === this.knob2 ? currentVal : this.value.upper)
      }
    }
    //
    // Update the value (on screen)
    this.updateValue(currentVal, true);
    //
    // Send the events to the server
    var x = [{obj: this.id, id: "chgProp", content: {name: "value", value: this.value, clid: Client.id}}];
    if (this.sendOnInput)
      x.push({obj: this.id, id: "onInput", content: this.saveEvent(ev)});
    if (this.sendOnChange)
      x.push({obj: this.id, id: "onChange", content: this.saveEvent(ev)});
    Client.mainFrame.sendEvents(x);
  }
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A round progressbar element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the progress bar
 */
Client.ProgressBar = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("div");
  this.type = "Line";
  this.options = {};
  this.maxValue = 1;
  //
  var pthis = this;
  //
  // This function modifies the display of the progress bar while animating
  this.options.step = function (state, bar) {
    // Changing color
    if (state.color) {
      bar.path.setAttribute("stroke", state.color);
      if (bar.text && pthis.options.text && !pthis.options.text.color)
        bar.text.style.color = state.color;
      else if (bar.text && pthis.options.text && pthis.options.text.color)
        bar.text.style.color = pthis.options.text.color;
    }
    // changing text
    if (pthis.options.text && pthis.options.text.value) {
      var idx = pthis.options.text.value.indexOf("@");
      if (idx > -1) {
        var m = 100;
        var d = 0;
        if (pthis.maxValue > 1) {
          m = pthis.maxValue;
          if (pthis.maxValue <= 10)
            d = 1;
        }
        var v = pthis.options.text.value.replace("@", (bar.value() * m).toFixed(d));
        bar.setText(v);
      }
    }
  };
  //
  parent.appendChildObject(this, this.domObj);
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  // A double click will animate the PG while editing
  if (Client.mainFrame.isEditing()) {
    this.domObj.addEventListener("dblclick", function () {
      if (pthis.pgObj) {
        pthis.pgObj.stop();
        pthis.pgObj.animate(1, undefined, function () {
          pthis.pgObj.animate(pthis.value ? pthis.value / pthis.maxValue : 0);
        });
      }
    });
  }
};

// Make Client.ProgressBar extend Client.Element
Client.ProgressBar.prototype = new Client.Element();

Client.ProgressBar.Properties = {type: 1, color: 2, strokeWidth: 2, trailColor: 2, trailWidth: 2, fill: 2,
  textValue: 3, textColor: 3, duration: 2, easing: 2, fromColor: 4, toColor: 5};

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.ProgressBar.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  var pthis = this;
  //
  if (el.type) {
    this.type = el.type;
    //
    // If the progress bar has a custom shape but there isn't the svg defining the shap, do nothing
    if (this.type !== "Path" || (this.type === "Path" && this.path))
      this.updateProgress();
    delete el.type;
  }
  //
  if (el.maxValue) {
    this.maxValue = el.maxValue;
    delete el.maxValue;
  }
  //
  if (el.value !== undefined && this.value !== el.value) {
    this.value = el.value;
    if (this.pgObj) {
      this.pgObj.stop();
      this.pgObj.animate(this.value / this.maxValue, undefined, function () {
        var e = [{obj: pthis.id, id: "endAnimation", content: {value: pthis.pgObj.value() * pthis.maxValue, stopped: false}}];
        Client.mainFrame.sendEvents(e);
      });
    }
    delete el.value;
  }
  //
  if (el.path && this.path !== el.path) {
    this.path = el.path;
    //
    // If the progress bar has not a custom shape, do nothing
    if (this.type === "Path")
      this.updateProgress();
    delete el.path;
  }

  //
  // As there are a lot of properties, it is better to transfert them to the PG objec by using a loop
  var pp;
  var k = Object.keys(Client.ProgressBar.Properties);
  for (var i = 0; i < k.length; i++) {
    var p = k[i];
    var v = el[p];
    var t = Client.ProgressBar.Properties[p];
    //
    // Let's see how to transfer this property to the PG object
    if (v !== undefined && t) {
      switch (t) {
        case 1: // standard property
          this[p] = v;
          break;

        case 2: // an option that will be considered elsewhere
          this.options[p] = v;
          break;

        case 3: // a text option
          pp = p.substring(4, 5).toLowerCase() + p.substring(5);
          if (!this.options.text)
            this.options.text = {};
          this.options.text[pp] = v;
          break;

        case 4: // a from animation option
          pp = p.substring(4, 5).toLowerCase() + p.substring(5);
          if (v.substring(0, 1) === "#") {
            if (!this.options.from)
              this.options.from = {};
            this.options.from[pp] = v;
          }
          else
            delete this.options.from;
          break;

        case 5: // a to animation option
          pp = p.substring(2, 3).toLowerCase() + p.substring(3);
          if (v.substring(0, 1) === "#") {
            if (!this.options.to)
              this.options.to = {};
            this.options.to[pp] = v;
          }
          else
            delete this.options.to;
      }
      //
      this.updateProgress();
      delete el[p];
    }
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Update progress bar
 */
Client.ProgressBar.prototype.updateProgress = function ()
{
  // Reset pg object
  if (this.pgObj) {
    this.pgObj.destroy();
    this.pgObj = null;
  }
  //
  var pthis = this;
  if (!this.updateTimer) {
    this.updateTimer = window.setTimeout(function () {
      var arg;
      //
      // The progress bar has a custom shape
      if (pthis.type === "Path") {
        // Get the svg defining the shape
        var svg = document.getElementById(pthis.path);
        if (svg) {
          // Get the path element
          var p = svg.getElementsByTagName("path");
          //
          // Set the path element as argument of the progress bar constructor
          if (p)
            arg = p[0];
        }
      }
      else  // If the progress bar has not a custom shape, the first argument of the constructor is the domObj
        arg = pthis.domObj;
      //
      pthis.updateTimer = 0;
      //
      if (!arg)
        return;
      //
      pthis.pgObj = new ProgressBar[pthis.type](arg, pthis.options);
      if (pthis.value)
        pthis.pgObj.set(pthis.value / pthis.maxValue);
    }, 0);
  }
};


/**
 * set value immediate
 * @param {Object} value
 */
Client.ProgressBar.prototype.set = function (value)
{
  if (this.pgObj) {
    this.pgObj.stop();
    this.pgObj.set(value / this.maxValue);
    this.value = value;
    var e = [{obj: this.id, id: "chgProp", content: {name: "value", value: value, clid: Client.id}}];
    Client.mainFrame.sendEvents(e);
  }
};


/**
 * stop animation and set value
 */
Client.ProgressBar.prototype.stop = function ()
{
  var pthis = this;
  if (this.pgObj && this.pgObj._progressPath._tweenable) {
    this.pgObj.stop();
    this.value = this.pgObj.value() * pthis.maxValue;
    window.setTimeout(function () {
      var e = [{obj: pthis.id, id: "chgProp", content: {name: "value", value: pthis.value, clid: Client.id}},
        {obj: pthis.id, id: "endAnimation", content: {value: pthis.value, stopped: true}}];
      Client.mainFrame.sendEvents(e);
    }, 10);
  }
};

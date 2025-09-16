/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class A chart
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the chart
 */
Client.ChartJs4 = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("div");
  this.domObj.className = "chartjs-container";
  this.canvasObj = document.createElement("canvas");
  this.domObj.appendChild(this.canvasObj);
  //
  this.events = element.events;
  parent.appendChildObject(this, this.domObj);
  //
  this.updateElement(element);
  //
  // If in edit mode load sample data
  if (Client.mainFrame.isEditing()) {
    this.xySampleData = {data: {columns: ["X", "Y", "radius", "group"], data: [[59, 65, 1, 0], [801, 81, 1, 0], [55, 56, 0, 1], [28, 40, 0, 1], [19, 86, 2, 2], [27, 90, 2, 2]]}};
    this.pointsSampleData = {data: {columns: ["Month", "highValue", "lowValue"], data: [["January", 65, 59], ["February", 81, 801], ["March", 56, 55], ["April", 40, 28], ["May", 86, 19], ["June", 90, 27]]}};
    //
    var sampleData = (this.type === "scatter" || this.type === "bubble") ? this.xySampleData : this.pointsSampleData;
    this.updateElement(JSON.parse(JSON.stringify(sampleData)));
  }
};


// Make Client.ChartJs4 extend Client.Element
Client.ChartJs4.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.ChartJs4.prototype.updateElement = function (el)
{
  // Get chart data
  if (el.data) {
    // Load initial data
    if (el.data.columns)
      this.initChart(el);
    else if (el.data.pos !== undefined) {
      if (el.data.data) // Update data
        this.updateData(el.data);
      else  // Remove data
        this.removeDataAtPos(el.data.pos);
    }
    else if (el.data.datasets !== undefined) {
      // Data already formatted by the server
      if (!this.chart) {
        this.data = el.data;
        //
        // Draw the chart / not too early to get the right size
        setTimeout(function () {
          if (!!this.chart)
            this.chart.destroy();
          this.chart = this.drawChart();
        }.bind(this), 50);
        //
        // Attach events
        if (el.data.events)
          this.attachEvents(el.data.events);
      }
      else {
        this.addData(el.data);
      }
    }
    else  // Add data
      this.addData(el.data.data);
    //
    // Base class must not use the data property
    delete el.data;
  }
  //
  // Get chart type
  if (el.type) {
    this.changeChartType(el.type);
    //
    // Base class must not use the type property
    delete el.type;
  }
  //
  // Get chart options
  if (el.options) {
    this.changeChartOptions(el.options);
    //
    // Base class must not use the options property
    delete el.options;
  }
  //
  if (el.className !== undefined) {
    this.domObj.className = "chartjs-container " + el.className;
    delete el.className;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Get data to initialize the chart and draw it
 * @param {Object} el - initial chart data
 */
Client.ChartJs4.prototype.initChart = function (el)
{
  if (!this.data)
    this.data = {};
  //
  // If there is already a chart, wipe out old data
  if (this.data.datasets)
    this.data.datasets.forEach(function (ds) {
      ds.data = [];
    });
  //
  // Build data object
  if (this.type === "scatter" || this.type === "bubble")
    this.data = this.buildXYData(el);
  else
    this.data = this.buildPointsData(el);
  //
  // Draw the chart / not too early to get the right size
  if (this.data) {
    setTimeout(function () {
      this.chart = this.drawChart();
    }.bind(this), 50);
  }
  //
  // Attach events
  if (el.data.events)
    this.attachEvents(el.data.events);
};


/**
 * Remove data from the chart at the given position
 * @param {int} pos - the position of data to remove
 */
Client.ChartJs4.prototype.removeDataAtPos = function (pos)
{
  if (this.chart) {
    // Remove data from datasets
    for (var i = 0; i < this.data.datasets.length; i++)
      this.data.datasets[i].data.splice(pos, 1);
    //
    // Remove the label
    this.data.labels.splice(pos, 1);
    //
    // Update the chart
    if (!this.updateTimeout) {
      this.updateTimeout = setTimeout(function () {
        this.updateTimeout = undefined;
        this.chart.update();
      }.bind(this), 0);
    }
  }
};


/**
 * Add data to the chart
 * @param {Array} data - data to add. The element in the first position of the array is the label.
 */
Client.ChartJs4.prototype.addData = function (data)
{
  if (this.chart) {
    if (this.type === "bubble") {
      var ds;
      if (data.length < 4)
        ds = 0;
      else
        ds = data[3];
      //
      for (var i = this.data.datasets.length; i <= ds; i++)
        this.data.datasets.push({label: "", data: []});
      this.data.datasets[ds].data.push({x: data[0], y: data[1], r: data[2]});
    }
    else if (this.type === "scatter") {
      var ds;
      if (data.length < 3)
        ds = 0;
      else
        ds = data[2];
      //
      for (var i = this.data.datasets.length; i <= ds; i++)
        this.data.datasets.push({label: "", data: []});
      this.data.datasets[ds].data.push({x: data[0], y: data[1]});
    }
    else {
      this.data.labels.push(data[0]);
      //
      for (var i = 1; i < data.length; i++)
        this.data.datasets[i - 1].data.push(data[i]);
    }
    //
    // Update the chart
    if (!this.updateTimeout) {
      this.updateTimeout = setTimeout(function () {
        this.updateTimeout = undefined;
        this.chart.update();
      }.bind(this), 0);
    }
  }
};


/**
 * Update chart data
 * @param {Object} data - data to update. Example: {pos: 3, data: ["", 5, 7, 9]}
 */
Client.ChartJs4.prototype.updateData = function (data)
{
  if (this.type === "bubble") {
    var ds = data.data.length > 3 ? data.data[3] : 0;
    this.data.datasets[ds].data[data.pos] = {x: data.data[0], y: data.data[1], r: data.data[2]};
  }
  else if (this.type === "scatter") {
    var ds = data.data.length > 2 ? data.data[2] : 0;
    this.data.datasets[ds].data[data.pos] = {x: data.data[0], y: data.data[1]};
  }
  else {
    // If there aren't enough data for all the datasets, add empty data
    while (this.data.datasets.length >= data.data.length)
      data.data.unshift("");
    //
    // Update the label
    this.data.labels[data.pos] = data.data[0];
    //
    // Update each dataset of the chart
    for (var i = 0; i < this.data.datasets.length; i++) {
      if (data.data.length > i + 1)
        this.data.datasets[i].data[data.pos] = (data.data[i + 1]);
    }
  }
  //
  // Update the chart
  if (!this.updateTimeout) {
    this.updateTimeout = setTimeout(function () {
      this.updateTimeout = undefined;
      if (this.chart)
        this.chart.update();
    }.bind(this), 0);
  }
};


/**
 * Set default dataset property
 * @param {Object} obj - the object to fill with the properties
 */
Client.ChartJs4.prototype.assignDefaultProperties = function (obj)
{
  obj.backgroundColor = "rgba(66, 134, 244, 0.6)";
  obj.borderColor = "rgba(66, 134, 244, 0.6)";
  obj.borderWidth = 2;
};


/**
 * Draw a chart
 * @returns {Chart}
 */
Client.ChartJs4.prototype.drawChart = function ()
{
  if (!this.type)
    return;
  //
  this.canvasObj.style.width = this.domObj.clientWidth + "px";
  this.canvasObj.style.height = this.domObj.clientHeight + "px";
  //
  var ctx = this.canvasObj.getContext("2d");
  //
  // Create the chart
  var t = this.type === "scatter" ? "line" : this.type;
  var chart = new Chart(ctx, {type: t, data: this.data, options: this.options});
  //
  // Add the events now because the chart creation deletes the events
  var idx = this.events.indexOf("onClick");
  if (idx > -1) {
    this.events.splice(idx, 1);
    //
    this.canvasObj.addEventListener("click", function (ev) {
      // Get the elements at the same position of the click
      if (this.chart) {
        var datasetIdx;
        var pos;
        var activeElements = this.chart.getElementAtEvent(ev);
        if (activeElements.length > 0) {
          datasetIdx = activeElements[0]["_datasetIndex"];
          pos = activeElements[0]["_index"];
          if (this.events.includes("onNavigate"))
            this.domObj.onnavigate({cmd: "goToPos", pos, type: "navigate"});
        }
        Client.mainFrame.sendEvents([{obj: this.id, id: "onClick", content: {dataset: datasetIdx, pos, ...this.saveEvent(ev)}}]);
        //
        ev.preventDefault();
        ev.stopPropagation();
      }
    }.bind(this));
  }
  //
  this.attachEvents(this.events);
  //
  return chart;
};


/**
 * Create the data object
 * @param {Object} el - data the chart has to show
 * @returns {Object}
 */
Client.ChartJs4.prototype.buildPointsData = function (el)
{
  var data = {};
  //
  // Get chart labels
  data.labels = [];
  for (var i = 0; i < el.data.data.length; i++)
    data.labels.push(el.data.data[i][0]);
  //
  // Get chart data
  data.datasets = [];
  for (var i = 1; i < el.data.columns.length; i++) {
    // Get the options already set for the dataset
    var dsOpt;
    if (this.options && this.options.datasets)
      dsOpt = this.options.datasets[i - 1];
    if (!dsOpt && this.cachedDatasetsOpt)
      dsOpt = this.cachedDatasetsOpt[i - 1];
    //
    var ds = {};
    ds.label = (dsOpt && dsOpt.label) ? dsOpt.label : el.data.columns[i];
    var d = [];
    for (var j = 0; j < el.data.data.length; j++)
      d.push(el.data.data[j][i]);
    //
    ds.data = d;
    //
    // Set default visual properties
    this.assignDefaultProperties(ds);
    //
    // Set custom visual properties
    if (dsOpt) {
      var keys = Object.keys(dsOpt);
      for (var j = 0; j < keys.length; j++)
        ds[keys[j]] = dsOpt[keys[j]];
    }
    //
    data.datasets.push(ds);
  }
  //
  delete this.cachedDatasetsOpt;
  return data;
};


/**
 * Create the data object for bubble and scatter chart
 * @param {Object} el - data the chart has to show
 * @returns {Object}
 */
Client.ChartJs4.prototype.buildXYData = function (el)
{
  var maxNumValues = this.type === "bubble" ? 4 : 3;
  //
  var data = {};
  data.datasets = [];
  //
  // Build the data object
  for (var i = 0; i < el.data.data.length; i++) {
    var xy = el.data.data[i];
    //
    // If there is no group set a default one
    if (xy.length < maxNumValues)
      xy.push(0);
    //
    var x = xy[0];
    var y = xy[1];
    var r, g;
    if (this.type === "bubble") {
      r = xy[2];
      g = xy[3];
    }
    else if (this.type === "scatter")
      g = xy[2];
    //
    var point = {x: x, y: y};
    if (this.type === "bubble")
      point.r = r;
    //
    if (data.datasets.length <= g) {
      for (var k = data.datasets.length; k <= g; k++)
        data.datasets.push({label: "", data: []});
    }
    data.datasets[g].data.push(point);
  }
  //
  // Get the options already set for the datasets
  for (var i = 0; i < data.datasets.length; i++) {
    var dsOpt;
    //
    // Look first in the options
    if (this.options && this.options.datasets && this.options.datasets.length >= i)
      dsOpt = this.options.datasets[i];
    //
    // Then in the cached options
    if (!dsOpt && this.cachedDatasetsOpt && this.cachedDatasetsOpt.length >= i)
      dsOpt = this.cachedDatasetsOpt[i];
    //
    // Set default visual properties
    this.assignDefaultProperties(data.datasets[i]);
    //
    // Set custom visual properties
    if (dsOpt) {
      var keys = Object.keys(dsOpt);
      for (var j = 0; j < keys.length; j++)
        data.datasets[i][keys[j]] = dsOpt[keys[j]];
    }
  }
  //
  delete this.cachedDatasetsOpt;
  return data;
};


/**
 * Change the type of the chart
 * @param {String} type - the new type of the chart
 */
Client.ChartJs4.prototype.changeChartType = function (type)
{
  // Change the chart type
  var oldType = this.type;
  this.type = type;
  //
  // If there was already a chart, redraw the chart of the new type
  if (this.chart) {
    if (Client.mainFrame.isEditing()) {
      if ((oldType !== "scatter" || oldType !== "bubble") && (this.type === "scatter" || this.type === "bubble"))
        this.data = this.buildXYData(this.xySampleData);
      else
        this.data = this.buildPointsData(this.pointsSampleData);
    }
    this.chart = this.drawChart();
  }
};


/**
 * Update chart properties
 * @param {Object} opt - the properties to update
 */
Client.ChartJs4.prototype.changeChartOptions = function (opt)
{
  if (!this.options)
    this.options = {};
  //
  var newOpt = opt;
  try {
    if (typeof opt === "string")
      newOpt = JSON.parse(opt);
  }
  catch (ex) {
    console.error(ex);
  }
  //
  // Set the datasets options
  if (newOpt.datasets) {
    if (!this.data)
      this.cachedDatasetsOpt = newOpt.datasets;
    else {
      for (var i = 0; i < newOpt.datasets.length; i++) {
        if (newOpt.datasets[i])
          this.mergeOptions(this.data.datasets[i], newOpt.datasets[i]);
      }
    }
  }
  //
  // Set the global configurations
  Chart.defaults.color = newOpt.color || Chart.defaults.color;
  Chart.defaults.font.family = newOpt.font?.family || Chart.defaults.font.family;
  Chart.defaults.font.size = newOpt.font?.size || Chart.defaults.font.size;
  Chart.defaults.font.style = newOpt.font?.style || Chart.defaults.font.style;
  //
  if (newOpt.scale && newOpt.scale.ticks && Chart.overrides[this.type] && Chart.overrides[this.type].scale)
    Chart.overrides[this.type].scale.ticks = newOpt.scale.ticks;
  //
  this.mergeOptions(this.options, newOpt);
  //
  // If there was already a chart, redraw the chart of the new type
  if (this.chart)
    this.chart.update();
};


/**
 * Onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.ChartJs4.prototype.onResize = function (ev)
{
  Client.Element.prototype.onResize.call(this, ev);
  //
  // Update the chart
  if (!this.updateTimeout) {
    this.updateTimeout = setTimeout(function () {
      this.updateTimeout = undefined;
      if (this.chart && this.chart.canvas) {
        this.canvasObj.style.width = this.domObj.clientWidth + "px";
        this.canvasObj.style.height = this.domObj.clientHeight + "px";
        this.chart.resize(this.domObj.clientWidth, this.domObj.clientHeight);
        this.chart.update();
      }
    }.bind(this), 100);
  }
};


/**
 * Called when the visibility of a parent is changed
 * @param {Boolean} visible
 */
Client.ChartJs4.prototype.visibilityChanged = function (visible)
{
  if (visible)
    this.onResize({});
};


/**
 *
 * @param {type} currOpt - the current options
 * @param {type} newOpt - the new options to merge
 */
Client.ChartJs4.prototype.mergeOptions = function (currOpt, newOpt)
{
  var keys = Object.keys(newOpt);
  for (var i = 0; i < keys.length; i++) {
    var value = newOpt[keys[i]];
    if (value instanceof Array) {
      if (!currOpt[keys[i]])
        currOpt[keys[i]] = new Array(value.length);
      //
      for (var j = 0; j < value.length; j++) {
        if (!currOpt[keys[i]][j])
          currOpt[keys[i]][j] = value[j]
        else
          this.mergeOptions(currOpt[keys[i]][j], value[j]);
      }
    }
    else if (value instanceof Object) {
      if (!currOpt[keys[i]])
        currOpt[keys[i]] = {};
      this.mergeOptions(currOpt[keys[i]], value);
    }
    else
      currOpt[keys[i]] = value;
  }
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.ChartJs4.prototype.close = function (firstLevel, triggerAnimation)
{
  if (this.chart)
    this.chart.destroy();
  //
  delete this.chart;
  delete this.canvasObj;
  //
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
};

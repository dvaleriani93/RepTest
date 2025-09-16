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
Client.ChartJs = function (element, parent, view)
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


// Make Client.ChartJs extend Client.Element
Client.ChartJs.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.ChartJs.prototype.updateElement = function (el)
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
Client.ChartJs.prototype.initChart = function (el)
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
Client.ChartJs.prototype.removeDataAtPos = function (pos)
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
Client.ChartJs.prototype.addData = function (data)
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
Client.ChartJs.prototype.updateData = function (data)
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
Client.ChartJs.prototype.assignDefaultProperties = function (obj)
{
  obj.backgroundColor = "rgba(66, 134, 244, 0.6)";
  obj.borderColor = "rgba(66, 134, 244, 0.6)";
  obj.borderWidth = 2;
};


/**
 * Draw a chart
 * @returns {Chart}
 */
Client.ChartJs.prototype.drawChart = function ()
{
  if (!this.type)
    return;
  //
  this.canvasObj.setAttribute("WIDTH", this.canvasObj.clientWidth);
  this.canvasObj.setAttribute("HEIGHT", this.canvasObj.clientHeight);
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
Client.ChartJs.prototype.buildPointsData = function (el)
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
Client.ChartJs.prototype.buildXYData = function (el)
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
Client.ChartJs.prototype.changeChartType = function (type)
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
Client.ChartJs.prototype.changeChartOptions = function (opt)
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
  Chart.defaults.global.defaultFontColor = newOpt.defaultFontColor || Chart.defaults.global.defaultFontColor;
  Chart.defaults.global.defaultFontFamily = newOpt.defaultFontFamily || Chart.defaults.global.defaultFontFamily;
  Chart.defaults.global.defaultFontSize = newOpt.defaultFontSize || Chart.defaults.global.defaultFontSize;
  Chart.defaults.global.defaultFontStyle = newOpt.defaultFontStyle || Chart.defaults.global.defaultFontStyle;
  //
  if (newOpt.scale && newOpt.scale.ticks && Chart.defaults[this.type] && Chart.defaults[this.type].scale)
    Chart.defaults[this.type].scale.ticks = newOpt.scale.ticks;
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
Client.ChartJs.prototype.onResize = function (ev)
{
  Client.Element.prototype.onResize.call(this, ev);
  //
  // Update the chart
  if (!this.updateTimeout) {
    this.updateTimeout = setTimeout(function () {
      this.updateTimeout = undefined;
      if (this.chart && this.chart.canvas) {
        this.chart.resize(this.domObj);
        this.chart.update();
      }
    }.bind(this), 100);
  }
};


/**
 * Called when the visibility of a parent is changed
 * @param {Boolean} visible
 */
Client.ChartJs.prototype.visibilityChanged = function (visible)
{
  if (visible)
    this.onResize({});
};


/**
 * Show the chart editor
 */
Client.ChartJs.prototype.showEditor = function ()
{
  this.realizeChartEditor();
};


/**
 * Realize the chart editor popup window
 */
Client.ChartJs.prototype.realizeChartEditor = function ()
{
  // Set the body owner with overflow hidden to prevent the scrollbar
  // due to devices bigger than the view editor window view
  var bodyOwner = document.body.parentNode;
  if (bodyOwner)
    bodyOwner.style.overflow = "hidden";
  //
  // Creation of overlay layer container
  this.overlay = document.createElement("div");
  this.overlay.id = "widget-editor-overlay";
  this.overlay.style.top = document.body.scrollTop + "px";
  this.overlay.style.left = document.body.scrollLeft + "px";
  var pthis = this;
  this.overlay.onclick = function (ev) {
    if (pthis.overlay && ev.target.id === pthis.overlay.id) {
      var cancButt = document.getElementById("cancel-button");
      if (cancButt)
        cancButt.onclick();
    }
  };
  //
  // Creation of chart editor container
  this.chartEditor = document.createElement("div");
  this.chartEditor.id = "widget-editor";
  window.addEventListener("resize", function (ev) {
    if (!pthis.overlay) {
      ev.preventDefault();
      return false;
    }
    //
    var targCont = document.getElementById("widget-options-container");
    if (targCont)
      pthis.resizeContainer(targCont);
  });
  //
  // Creation of title container
  var titCont = document.createElement("div");
  titCont.id = "widget-editor-title";
  titCont.innerHTML = "ChartJS Settings";
  this.chartEditor.appendChild(titCont);
  //
  // Creation of button that redirect to the chartjs documentation website
  var helpBut = document.createElement("div");
  helpBut.id = "widget-editor-help";
  helpBut.innerHTML = "i";
  helpBut.onmouseover = function (ev) {
    pthis.highlightOptions(ev, "rgb(0, 0, 0)");
    document.getElementById(ev.target.id).style.color = "rgb(255, 255, 255)";
  };
  helpBut.onmouseout = function (ev) {
    pthis.highlightOptions(ev, "whitesmoke");
    document.getElementById(ev.target.id).style.color = "rgb(0, 0, 0)";
  };
  helpBut.onclick = function () {
    window.open("http://www.chartjs.org/docs/", "chartjsdoc");
  };
  titCont.appendChild(helpBut);
  //
  // Creation of buttons container
  var buttCont = document.createElement("div");
  buttCont.id = "widget-editor-buttons";
  //
  // Creation of the confirm button
  var confirmButDiv = document.createElement("div");
  confirmButDiv.id = "confirm-button-div";
  //
  var confirmBut = document.createElement("button");
  confirmBut.id = "confirm-button";
  confirmBut.innerHTML = "Set";
  confirmBut.onmouseover = function (ev) {
    pthis.highlightOptions(ev, "#257831");
  };
  confirmBut.onmouseout = function (ev) {
    pthis.highlightOptions(ev, "#37B349");
  };
  confirmBut.onclick = function () {
    // Copy the temporary changes into the real options object
    for (var i in pthis.tempOptions[pthis.type]) {
      if (!pthis.options)
        pthis.options = {};
      pthis.options[i] = pthis.tempOptions[pthis.type][i];
    }
    //
    if (!pthis.options)
      pthis.options = {};
    if (!pthis.options.datasets)
      pthis.options.datasets = new Array(pthis.data.datasets.length);
    for (var i = 0; i < pthis.tempData.length; i++) {
      if (!pthis.tempData[i]) {
        if (!pthis.options.datasets[i])
          pthis.options.datasets[i] = {};
        continue;
      }
      //
      if (!pthis.options.datasets[i])
        pthis.options.datasets[i] = {};
      var keys = Object.keys(pthis.tempData[i]);
      for (var j = 0; j < keys.length; j++)
        pthis.options.datasets[i][keys[j]] = pthis.tempData[i][keys[j]];
    }
    //
    // Send all the changes to the ide
    if (Client.mainFrame.isEditing()) {
      var e = Client.eleMap["editm"];
      if (e) {
        // No need to force changeChartOptions with new options: it will be updated automagically
        e.editProxy.appCmd([{id: pthis.id, c: "changeProp", n: "cst_type", v: pthis.type}]);
        e.editProxy.appCmd([{id: pthis.id, c: "changeProp", n: "cst_options", v: JSON.stringify(pthis.options)}]);
      }
    }
    else if (pthis.parentWidget)
      Client.mainFrame.sendEvents([{obj: pthis.id, id: "changeProp", content: {options: JSON.stringify(pthis.options), type: pthis.type}}]);
    //
    // Close the chart editor window
    document.body.removeChild(pthis.overlay);
    pthis.overlay = null;
    pthis.chartEditor = null;
    //
    pthis.currentChartType = pthis.type;
    pthis.tempOptions = {};
    pthis.tempData = new Array(pthis.data.datasets.length);
  };
  confirmButDiv.appendChild(confirmBut);
  buttCont.appendChild(confirmButDiv);
  //
  // Creation of button that closes the color picker without changes
  var cancelButDiv = document.createElement("div");
  cancelButDiv.id = "cancel-but-div";
  //
  var cancelBut = document.createElement("button");
  cancelBut.id = "cancel-button";
  cancelBut.innerHTML = "Cancel";
  cancelBut.onmouseover = function (ev) {
    pthis.highlightOptions(ev, "#434D44");
  };
  cancelBut.onmouseout = function (ev) {
    pthis.highlightOptions(ev, "#9DA69F");
  };
  cancelBut.onclick = function () {
    // Undo changes
    pthis.type = pthis.currentChartType;
    pthis.tempOptions = {};
    pthis.tempData = new Array(pthis.data.datasets.length);
    //
    // Restore old chart type and redraw chart
    pthis.updateTabbarLabel();
    //
    // Close the chart editor window
    document.body.removeChild(pthis.overlay);
    //
    // Restore the original overflow property
    var bodyOwner = document.body.parentNode;
    if (bodyOwner)
      bodyOwner.style.overflow = "";
    //
    pthis.overlay = null;
    pthis.chartEditor = null;
  };
  cancelButDiv.appendChild(cancelBut);
  buttCont.appendChild(cancelButDiv);
  //
  // Creation of fixed properties container
  var fixedPropCont = document.createElement("div");
  fixedPropCont.id = "widget-editor-tabbar";
  //
  this.chartEditor.appendChild(fixedPropCont);
  //
  // Creation of the options container
  var optContainer = document.createElement("div");
  optContainer.id = "widget-options-container";
  //
  // Initialization of temporary changes objects
  this.tempOptions = {};
  this.tempData = new Array(this.data.datasets.length);
  //
  // Realize all tabs
  var ds = this.data.datasets;
  this.realizeTabBarLabel("chart-global-options", fixedPropCont, optContainer);
  this.realizeTabBarLabel("chart-type", fixedPropCont, optContainer);
  for (var i in ds)
    this.realizeTabBarLabel("chart-dataset-" + i, fixedPropCont, optContainer);
  //
  // Realize all the options available for the current chart
  this.realizeOptions(Chart.defaults[this.type], optContainer, "chart-type");
  //
  // Append all container to create the chart editor well formatted
  this.chartEditor.appendChild(optContainer);
  this.chartEditor.appendChild(buttCont);
  this.overlay.appendChild(this.chartEditor);
  document.body.appendChild(this.overlay);
  //
  // Select chart type label
  this.selectTab("chart-type", ds);
  //
  // Readapt the container due to many datasets/segments and window size
  this.resizeContainer(optContainer);
};


/**
 * Resize an obj container
 * @param {HTMLElement} targetObj - dom object to resize
 */
Client.ChartJs.prototype.resizeContainer = function (targetObj)
{
  // Resize editor options container
  var wEditor = document.getElementById("widget-editor");
  var editorHeight = wEditor.offsetHeight;
  var dim = editorHeight - document.getElementById("widget-editor-title").offsetHeight - document.getElementById("widget-editor-buttons").offsetHeight - document.getElementById("widget-editor-tabbar").offsetHeight - 87;
  targetObj.style.height = dim + "px";
  //
  // Resize editor buttons
  var editorWidth = wEditor.offsetWidth;
  var cancBut = document.getElementById("cancel-button");
  var confBut = document.getElementById("confirm-button");
  if (editorWidth < 260) {
    cancBut.style.minWidth = "85px";
    confBut.style.minWidth = "85px";
  }
  else {
    cancBut.style.minWidth = "120px";
    confBut.style.minWidth = "120px";
  }
};


/**
 * Creates the options for the current chart
 * @param {Object} chartOptions - the object containing the options
 * @param {HTMLElement} targetObj - the dom object to append the options to
 * @param {MouseEvent} ev - the event occured when the user clicked
 */
Client.ChartJs.prototype.realizeOptions = function (chartOptions, targetObj, ev)
{
  // If I do not have any target obj in which append the options, I have to exit
  if (!chartOptions || !targetObj)
    return;
  //
  this.activatedObj = ev;
  if (typeof ev === "object")
    this.activatedObj = (ev.target.id) ? ev.target.id : ev.target.parentNode.id;
  //
  targetObj.innerHTML = "";
  //
  var currSect = "";
  var nextSect = "";
  var sections = {
    animation: "Animation",
    animationSteps: "Animation",
    showScale: "Scale",
    scaleShowGridLines: "Scale",
    scaleBeginAtZero: "Scale",
    scaleShowLine: "Scale",
    scaleShowLabelBackdrop: "Scale",
    pointColor: "Point",
    pointLabelFontFamily: "Point",
    pointDot: "Point",
    showTooltips: "Tooltip",
    angleLineColor: "Angle line",
    datasetStroke: "Dataset",
    legendTemplate: "Legend",
    segmentShowStroke: "Segment",
    bezierCurve: "Bezier",
    barShowStroke: "Bar"
  };
  //
  for (var name in chartOptions) {
    var value = chartOptions[name];
    //
    // Set groups of properties
    for (var i in sections) {
      if (name.indexOf(i) !== -1) {
        nextSect = sections[i];
        break;
      }
    }
    //
    // If I can't make a group, then I set a default group title
    if (nextSect === "" && this.activatedObj.indexOf("chart-dataset") !== -1)
      nextSect = "General options";
    //
    // If I have custom preferences they must be shown instead of the default values
    var opt = (this.activatedObj.indexOf("chart-dataset") === -1) ? this.options : ((this.options && this.options.datasets) ? this.options.datasets : this.data.datasets);
    if (this.activatedObj.indexOf("chart-dataset") === -1) {
      if (this.tempOptions[this.type])
        opt = this.tempOptions[this.type];
      if (opt && opt[name] !== chartOptions[name] && opt[name] !== undefined)
        value = opt[name];
    }
    else {
      if (this.tempData[this.activatedObj.split("-")[2]])
        opt = this.tempData[this.activatedObj.split("-")[2]];
      if (opt[name] !== chartOptions[name] && opt[name] !== undefined)
        value = opt[name];
    }
    //
    // If the value is an object or a function, continue
    if (value !== null && (typeof value === "object" || (value !== undefined && value.toString().indexOf("function") !== -1)))
      continue;
    //
    // Find and set next section title
    if (currSect !== nextSect) {
      var gHeader = document.createElement("div");
      gHeader.className = "widget-section-groupHeader";
      if (currSect !== "")
        gHeader.classList.add("widget-next-section-groupHeader");
      //
      gHeader.innerHTML = nextSect[0].toUpperCase() + nextSect.substr(1);
      targetObj.appendChild(gHeader);
      //
      currSect = nextSect;
    }
    //
    // Create a container for the property label and the property value
    var pContainer = document.createElement("div");
    pContainer.id = "widget-property-container";
    //
    // Label to identify the property name
    var pHeader = document.createElement("label");
    pHeader.id = "widget-property-label";
    pHeader.innerHTML = name;
    pContainer.appendChild(pHeader);
    //
    var pValue;
    var pValueText;
    //
    // If it is a color property
    if (value !== null && (name.toLowerCase().indexOf("color") !== -1)) {
      // Create a span with a background color
      pValue = document.createElement("span");
      pValue.id = name + "-color";
      pValue.className = "widget-color-label";
      pValue.style.backgroundColor = (value === undefined) ? "" : value;
      //
      // The click on the color div, creates a color picker popup window
      pValue.onclick = function (ev) {
        var evTarget = ev;
        var targetColorBg = ev.target;
        var targetColorTxt = document.getElementById(ev.target.id.split("-")[0] + "-textcolor");
        var oldColorVal = targetColorTxt.value;
        //
        // Creation of upper overlay container,
        // need to manage the click out of popup container and do things i.e. close popup without changes
        var overlay = document.createElement("div");
        overlay.id = "widget-editor-colorpicker-overlay";
        var ppthis = pthis;
        overlay.onclick = function (ev) {
          if (ev.target.id === overlay.id) {
            var cancButt = document.getElementById("cancel-button-colorpicker");
            if (cancButt)
              cancButt.onclick();
          }
        };
        //
        // Creation of popup container in which append the color picker and its controls
        var popup = document.createElement("div");
        popup.id = "widget-editor-colorpicker-popup";
        //
        // Creation of buttons container
        var buttCont = document.createElement("div");
        buttCont.id = "widget-editor-colorpicker-buttons";
        //
        // Creation of button that sets the color
        var confirmBut = document.createElement("div");
        confirmBut.id = "confirm-button-colorpicker";
        confirmBut.innerHTML = "Set color";
        confirmBut.onmouseover = function (ev) {
          ppthis.highlightOptions(ev, "rgb(235, 248, 233)");
        };
        confirmBut.onmouseout = function (ev) {
          ppthis.highlightOptions(ev, "rgb(255, 255, 255)");
        };
        confirmBut.onclick = function (ev) {
          ppthis.saveTemporaryDataOption(evTarget);
          ppthis.overlay.removeChild(overlay);
        };
        buttCont.appendChild(confirmBut);
        //
        // Creation of button that closes the color picker without changes
        var cancelBut = document.createElement("div");
        cancelBut.id = "cancel-button-colorpicker";
        cancelBut.innerHTML = "Cancel";
        cancelBut.onmouseover = function (ev) {
          ppthis.highlightOptions(ev, "rgb(254, 215, 222)");
        };
        cancelBut.onmouseout = function (ev) {
          ppthis.highlightOptions(ev, "rgb(255, 255, 255)");
        };
        cancelBut.onclick = function (ev) {
          targetColorBg.style.backgroundColor = oldColorVal;
          targetColorTxt.value = oldColorVal;
          //
          ppthis.overlay.removeChild(overlay);
        };
        buttCont.appendChild(cancelBut);
        //
        // Append the popup to the upper overlay
        overlay.appendChild(popup);
        //
        // Append the upper overlay to the lower overlay
        pthis.overlay.appendChild(overlay);
        //
        // Create the color picker and append it to the chart editor
        var cp = new Client.ColorPicker({domObj: evTarget.target, id: targetColorBg.id, value: oldColorVal, type: "basic"}, {domObj: popup});
        cp.domObj.classList.add("widget-colorpicker");
        //
        // Append the button container to the popup container
        popup.appendChild(buttCont);
        //
        // Subscribe this color picker to the next changes (ev contains the Color obj)
        UIColorPicker.subscribe(cp.domObj.id, function (ev) {
          targetColorTxt.value = cp.getColor("rgba", ev);
          targetColorBg.style.backgroundColor = cp.getColor("rgba", ev);
        });
        //
        // Reposition the popup panel
        popup.style.left = ((document.body.offsetWidth - popup.offsetWidth) / 2) + "px";
        if (popup.offsetHeight + targetColorBg.offsetHeight + ev.clientY - ev.offsetY > document.body.scrollHeight)
          popup.style.top = "0px";
        else
          popup.style.top = (ev.clientY - ev.offsetY + targetColorBg.offsetHeight + 4) + "px";
      };
      pContainer.appendChild(pValue);
      //
      pValueText = document.createElement("input");
      pValueText.id = name + "-textcolor";
      pValueText.className = "widget-property-textvalue";
      pValueText.value = (value === undefined) ? "" : value;
      pValueText.oninput = function (ev) {
        var c = document.getElementById(ev.target.id.split("-")[0] + "-color");
        if (c)
          c.style.backgroundColor = ev.target.value;
        //
        pthis.saveTemporaryDataOption(ev);
      };
      //
      pContainer.appendChild(pValueText);
    }
    else if (name.toLowerCase().indexOf("legend") !== -1) { // If it's a legend property
      // For long text properties, create a textarea
      pValue = document.createElement("textarea");
      pValue.className = "chartjs-textarea";
      pValue.innerHTML = (value === null ? "" : value);
      pContainer.appendChild(pValue);
    }
    else {
      pValue = document.createElement("input");
      pValue.className = "widget-input-field";
      if (value !== null && (value === true || value === false)) {
        // For boolean properties, create a checkbox
        pValue.type = "checkbox";
        pValue.classList.add("widget-checkbox");
        if (value === true)
          pValue.setAttribute("checked", "checked");
      }
      else {
        // For text properties, create an input text
        pValue.type = "text";
        pValue.classList.add("widget-text");
        pValue.style.textAlign = isNaN((value === undefined) ? "" : value) ? "left" : "right";
        pValue.value = (value === null ? "" : value);
      }
      pContainer.appendChild(pValue);
    }
    if (!pValue.id)
      pValue.id = name;
    //
    // Attach events to the value obj
    var pthis = this;
    if (pValue.type !== "text" && pValue.tagName.toLowerCase() !== "textarea") {
      pValue.onchange = function (ev) {
        pthis.saveTemporaryDataOption(ev);
      };
    }
    //
    // Attach onInput event to the input text or textarea
    if (pValue.type === "text" || pValue.tagName.toLowerCase() === "textarea") {
      pValue.oninput = function (ev) {
        pthis.saveTemporaryDataOption(ev);
      };
    }
    //
    // Append any property to the target obj container
    targetObj.appendChild(pContainer);
  }
};


/**
 * Manage the temporary changes of chart properties
 * @param {Event} ev - the event occured when the user clicked on a confirmation button or modified an input field
 */
Client.ChartJs.prototype.saveTemporaryDataOption = function (ev)
{
  var nam = ev.target.id.split("-")[0];
  var val;
  if (ev.type === "input")
    val = ev.target.value;
  else if (ev.type === "change" || ev.type === "click") {
    if (ev.target.type === "checkbox")
      val = ev.target.checked;
    else {
      var docCol = document.getElementById(ev.target.id.split("-")[0] + "-textcolor");
      if (docCol)
        val = docCol.value;
      else
        val = ev.target.style.backgroundColor;
    }
  }
  //
  if (this.activatedObj.indexOf("chart-dataset") === -1) {
    // Save changes into the temporary options object
    if (!this.tempOptions[this.type])
      this.tempOptions[this.type] = {};
    this.tempOptions[this.type][nam] = val;
  }
  else {
    // Save changes into the temporary data object
    var dsId = this.activatedObj.split("-")[2];
    if (!this.tempData)
      this.tempData = new Array(this.data.datasets.length);
    if (!this.tempData[parseInt(dsId)])
      this.tempData[parseInt(dsId)] = {};
    this.tempData[parseInt(dsId)][nam] = val;
  }
};


/**
 * Realize the label of the tabbar into the chart editor
 * @param {string} sectionId - id of macro group of properties
 * @param {obj} targetObj - the dom object to append the label to
 * @param {obj} optionsObj - dom object used by "realizeChartOptions" for any tab section
 */
Client.ChartJs.prototype.realizeTabBarLabel = function (sectionId, targetObj, optionsObj)
{
  // Get chart data
  var ds = this.data.datasets;
  //
  // Get the dataset id
  var dsId;
  if (sectionId.indexOf("chart-dataset") !== -1)
    dsId = sectionId.split("-")[2];
  //
  var tabbed = document.createElement("div");
  tabbed.id = sectionId;
  tabbed.className = "chartjs-tab";
  //
  switch (sectionId) {
    case "chart-global-options":
      tabbed.classList.add("chartjs-global-options-tab");
      tabbed.innerHTML = "Global settings ";
      var pthis = this;
      tabbed.onclick = function (ev) {
        pthis.selectTab(ev.target.id, ds);
        //
        // Realize all the options available for the current chart
        pthis.realizeOptions(Chart.defaults.global, optionsObj, ev);
      };
      //
      targetObj.appendChild(tabbed);
      break;

    case "chart-type":
      tabbed.classList.add("chartjs-type-tab");
      var pthis = this;
      tabbed.onclick = function (ev) {
        var ids = ev.target.id;
        if (ids === "" || ids === "chart-types")
          ids = ev.target.parentNode.id;
        pthis.selectTab(ids, ds);
        //
        if ((ev.target.id === sectionId && this.activatedObj === sectionId) || (ev.target.id === "chart-types")) {
          ev.preventDefault();
          return;
        }
        //
        // Realize all the options available for the current chart
        pthis.realizeOptions(Chart.defaults[pthis.type], optionsObj, ev);
      };
      //
      var typeLabel = document.createElement("div");
      typeLabel.innerHTML = "Chart type ";
      //
      var typeCombo = document.createElement("select");
      typeCombo.id = "chart-types";
      var typeComboOpt;
      for (var t in Chart.controllers) {
        typeComboOpt = document.createElement("option");
        typeComboOpt.value = t;
        typeComboOpt.innerHTML = t;
        if (t === this.type) {
          typeComboOpt.selected = "selected";
          this.currentChartType = t;
        }
        typeCombo.appendChild(typeComboOpt);
      }
      typeCombo.onchange = function (ev) {
        pthis.type = ev.target.value;
        //
        // Realize all the options available for the current chart
        pthis.realizeOptions(Chart.defaults[pthis.type], optionsObj, ev);
        //
        // If chartType changes, then delete the old dataset labels and realize the new set
        pthis.updateTabbarLabel();
      };
      //
      tabbed.appendChild(typeLabel);
      tabbed.appendChild(typeCombo);
      targetObj.appendChild(tabbed);
      break;

    case "chart-dataset-" + dsId:
      tabbed.id = "chart-dataset-" + dsId;
      tabbed.classList.add("chartjs-dataset-tab");
      tabbed.innerHTML = "Serie ";
      var pthis = this;
      tabbed.onclick = function (ev) {
        var ids = ev.target.id;
        if (ids === "")
          ids = ev.target.parentNode.id;
        pthis.selectTab(ids, ds);
        //
        // Realize all the options available for the current chart
        pthis.realizeOptions(ds[parseInt(dsId)], optionsObj, ev);
      };
      //
      var datasetTitle = document.createElement("div");
      datasetTitle.classList.add("chartjs-dataset-title-tab");
      datasetTitle.innerHTML = ds[parseInt(dsId)].label;
      //
      tabbed.appendChild(datasetTitle);
      targetObj.appendChild(tabbed);
      break;
  }
};


/**
 * Select clicked tab
 * @param {String} tabId - the id of the tab selected
 * @param {Object} ds - the data shown by the chart
 */
Client.ChartJs.prototype.selectTab = function (tabId, ds)
{
  if (!ds || !tabId)
    return;
  //
  var tabbedFound;
  var tabBarDefaultLabels = ["chart-global-options", "chart-type"];
  //
  // Search the selected tab
  for (var i = 0; i < tabBarDefaultLabels.length; i++) {
    document.getElementById(tabBarDefaultLabels[i]).style.backgroundColor = "whitesmoke";
    if (tabBarDefaultLabels[i] === tabId)
      tabbedFound = tabId;
  }
  for (var i = 0; i < ds.length; i++) {
    document.getElementById("chart-dataset-" + i).style.backgroundColor = "whitesmoke";
    if ("chart-dataset-" + i === tabId)
      tabbedFound = tabId;
  }
  //
  // Change the background color of the selected tab
  if (tabbedFound)
    document.getElementById(tabbedFound).style.backgroundColor = "#FFFFFF";
};


/**
 * Update tabbar label when chart element type changes from points to segments and viceversa
 */
Client.ChartJs.prototype.updateTabbarLabel = function ()
{
  // Get the current datasets/segments
  var ds = this.data.datasets;
  var fixedPropCont = document.getElementById("widget-editor-tabbar");
  var optContainer = document.getElementById("widget-options-container");
  //
  // Delete all tabs that refers to the current chart type
  if (ds && fixedPropCont) {
    for (var i = 0; i < ds.length; i++)
      fixedPropCont.removeChild(document.getElementById("chart-dataset-" + i));
  }
  //
  // Change the chart type with the one just selected
  this.changeChartType(this.type);
  //
  // Get the next datasets/segments
  ds = this.data.datasets;
  //
  // Realize all tabs that refers to the next chart type
  if (ds && fixedPropCont && optContainer) {
    for (var i in ds)
      this.realizeTabBarLabel("chart-dataset-" + i, fixedPropCont, optContainer);
  }
  // Resize options container
  this.resizeContainer(optContainer);
};


/**
 * Highlight or not a ev.target object
 * @param {MouseEvent} ev - the event occured when the user clicked on an element of the chart editor
 * @param {String} color - the highlight color
 */
Client.ChartJs.prototype.highlightOptions = function (ev, color)
{
  var tg = document.getElementById(ev.target.id);
  if (!tg)
    tg = document.getElementById(ev.target.parentNode.id);
  if (tg)
    tg.style.backgroundColor = color;
};


/**
 *
 * @param {type} currOpt - the current options
 * @param {type} newOpt - the new options to merge
 */
Client.ChartJs.prototype.mergeOptions = function (currOpt, newOpt)
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
Client.ChartJs.prototype.close = function (firstLevel, triggerAnimation)
{
  if (this.chart)
    this.chart.destroy();
  //
  delete this.chart;
  delete this.canvasObj;
  //
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
};

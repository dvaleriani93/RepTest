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
Client.GoogleCharts = function (element, parent, view)
{
  this.propCache = [];
  var pthis = this;
  this.version = "52";
  this.type = "LineChart";
  this.material = false;
  //
  this.materialMap = {
    BarChart: "Bar",
    ColumnChart: "Bar",
    LineChart: "Line",
    Bar: "BarChart",
    Line: "LineChart"
  };
  //
  Client.Element.call(this, element, parent, view);
  //
  // In edit mode the id must be prefixed by dmo_
  var isEditing = Client.mainFrame ? Client.mainFrame.isEditing() : false;
  this.domObj = document.createElement("div");
  this.domObj.id = (isEditing ? "dmo_" : "") + this.id;
  //
  // If the user asked a custom version we must oblige, the updateElement will be cached until loaded, so we need to 
  // set the new version here
  try {
    if (element.version && !isNaN(parseInt(element.version)))
      this.version = element.version;
  } catch (ex) {
    console.error("GoogleCharts : unable to set the version " + element.version, ex);
  }
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  // Function called after libraries loading
  var callback = function () {
    if (this.closed)
      return;
    //
    this.libLoaded = true;
    //
    // Create a chart wrapper
    this.wrap = new google.visualization.ChartWrapper();
    this.wrap.setContainerId(this.domObj.id);
    this.wrap.setChartType(this.type);
    //
    // Set wrapper callback
    var ready = function () {
      var newChart = pthis.wrap.getChart();
      if (!pthis.chart || pthis.chart !== newChart) {
        // Called when the wrapper has drawn the chart
        pthis.chart = newChart;
      }
    };
    //
    try {
      google.visualization.events.addListener(this.wrap, "ready", ready);
      this.attachChartEvents();
    }
    catch (ex) {
      this.notifyError("initChart", ex);
    }
    //
    for (var i = 0; i < this.propCache.length; i++) {
      var cmd = this.propCache[i];
      this[cmd.m](cmd.p);
    }
  }.bind(this);
  //
  // Load the Visualization API library and charts libraries
  try {
    google.charts.load(this.version, {packages: ["corechart", "sankey", "gantt", "charteditor", "bar", "line"], language: navigator.language.substring(0, 2), "callback": callback});
  }
  catch (ex) {
    this.notifyError("constructor", ex);
  }
  //
  parent.appendChildObject(this, this.domObj);
  //
  // If in edit mode, create a chart with sample data
  if (Client.mainFrame.isEditing()) {
    this.createSampleData();
    this.createChartsCategories();
    this.initChart();
  }
};


// Make Client.GoogleCharts extend Client.Element
Client.GoogleCharts.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.GoogleCharts.prototype.updateElement = function (el)
{
  // If chart libraries are not loaded cache the command
  if (!this.libLoaded) {
    this.propCache.push({m: "updateElement", p: el});
    return;
  }
  //
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
    else if (el.data.data) // Add data
      this.addData(el.data.data);
    else { // Data assigned to the data property
      // Data property already assigned by server
      if (el.data.cols && el.data.rows)
        this.data = new google.visualization.DataTable(el.data);
      else
        this.data = google.visualization.arrayToDataTable(el.data, false);
      //
      this.wrap.setDataTable(this.data);
      this.wrap.draw();
    }
    //
    if (el.data.events)
      this.attachEvents(el.data.events);
    //
    delete el.data;
  }
  //
  // Get version
  if (el.version) {
    this.version = el.version;
    //
    delete el.version;
  }
  //
  // Get chart type
  if (el.type) {
    this.changeChartType(el.type);
    //
    delete el.type;
  }
  //
  // Get options
  if (el.options) {
    this.changeChartOptions(el.options);
    //
    delete el.options;
  }
  //
  // Get the column names
  if (el.seriesNames) {
    this.changeChartColumnNames(el.seriesNames);
    //
    delete el.seriesNames;
  }
  //
  if (el.material !== undefined && el.material !== this.material) {
    this.material = el.material;
    //
    this.changeChartType(this.materialMap[this.type]);
    this.changeChartOptions(this.options);
    //
    delete el.material;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  // If width and height change redraw the chart
  if (el.style) {
    var s = el.style;
    if (typeof el.style === "string")
      s = JSON.parse(el.style);
    if (s.width || s.height) {
      if (this.wrap)
        this.drawChart();
    }
  }
  //
  this.visibilityChanged(el.visible);
};


/**
 * Initialize the chart
 * @param {Object} el - initial chart data
 */
Client.GoogleCharts.prototype.initChart = function (el)
{
  // If chart libraries are not loaded cache the command
  if (!this.libLoaded) {
    this.propCache.push({m: "initChart", p: el});
    return;
  }
  //
  // If in edit mode load sample data
  if (Client.mainFrame.isEditing()) {
    if (!this.type)
      this.type = "LineChart";
    el = this.changeDataEditingMode(this.type);
  }
  //
  // If it's not in edit mode and it's not visible, cache init data
  if (!Client.mainFrame.isEditing() && !this.isVisible()) {
    if (!this.delayedInitData)
      this.copyChartData(el);
    return;
  }
  //
  // If initial data is empty I can't initialize the chart now, save the data for later
  if (el && el.data && el.data.data && el.data.data.length < 1) {
    this.copyChartData(el);
    return;
  }
  //
  // Build the data array
  this.data = this.buildDataTable(el);
  //
  try {
    // Draw the chart
    this.wrap.setDataTable(this.data);
    this.wrap.draw();
  }
  catch (ex) {
    this.notifyError("initChart", ex);
  }
  //
  // The chart has been initialized, delete the cached data
  delete this.delayedInitData;
  //
  // If there are cached data to add, do it
  if (this.delayedAddData) {
    for (var i = 0; i < this.delayedAddData.length; i++)
      this.addData(this.delayedAddData[i]);
    delete this.delayedAddData;
  }
};


/**
 * Update chart data
 * @param {Object} data - data to update. Example: {pos: 3, data: ["", 5, 7, 9]}
 */
Client.GoogleCharts.prototype.updateData = function (data)
{
  if (this.delayedInitData) {
    this.delayedInitData.data.data.splice(data.pos, 1, data.data);
    this.initChart(this.delayedInitData);
    return;
  }
  //
  // If there aren't enough data for all the columns, add empty data
  var cnum = this.data.getNumberOfColumns();
  var start = cnum - data.data.length;
  while (cnum > data.data.length)
    data.data.unshift("");
  //
  this.convertDataRow(data.data);
  //
  // Update data
  for (var i = start; i < cnum; i++)
    this.data.setCell(data.pos, i, data.data[i]);
  //
  // Update the chart
  if (!this.updateTimeout) {
    var pthis = this;
    pthis.updateTimeout = setTimeout(function () {
      pthis.updateTimeout = undefined;
      pthis.wrap.setDataTable(pthis.data);
      pthis.drawChart();
    }, 0);
  }
};


/**
 * Remove data from the chart at the given position
 * @param {int} pos - the position of data to remove
 */
Client.GoogleCharts.prototype.removeDataAtPos = function (pos)
{
  if (this.delayedInitData) {
    this.delayedInitData.data.data.splice(pos, 1);
    this.initChart(this.delayedInitData);
    return;
  }
  //
  if (pos > -1) {
    // Remove from data
    this.data.removeRow(pos);
    //
    // Update the dataset
    this.wrap.setDataTable(this.data);
    //
    // Update the chart
    if (!this.removeTimeout) {
      var pthis = this;
      pthis.removeTimeout = setTimeout(function () {
        pthis.removeTimeout = undefined;
        pthis.drawChart();
      });
    }
  }
};


/**
 * Add data to the chart
 * @param {Array} data - data to add. The element in the first position of the array is the label.
 */
Client.GoogleCharts.prototype.addData = function (data)
{
  // If I have to initialize the chart
  if (this.delayedInitData) {
    this.delayedInitData.data.data.push(data);
    this.initChart(this.delayedInitData);
  }
  else if (!this.data) {
    // The chart has not been initialized yet, cache the data
    this.delayedAddData = this.delayedAddData || [];
    this.delayedAddData.push(data);
  }
  else { // There is already a chart, add data
    // Add empty labels if needed
    var cnum = this.data.getNumberOfColumns();
    while (cnum > data.length)
      data.unshift("");
    //
    // Convert date type if needed
    this.convertDataRow(data);
    //
    // Update data
    this.data.addRow(data);
    //
    // Update the dataset
    this.wrap.setDataTable(this.data);
    //
    // Update the chart
    if (!this.updateTimeout) {
      var pthis = this;
      pthis.updateTimeout = setTimeout(function () {
        pthis.updateTimeout = undefined;
        pthis.drawChart();
      }, 0);
    }
  }
};


/**
 * Change the type of the chart
 * @param {String} type - the new type of the chart
 */
Client.GoogleCharts.prototype.changeChartType = function (type)
{
  // If type is changed
  var oldType = this.type;
  if (type !== oldType) {
    this.type = type;
    if (this.wrap) {
      try {
        this.wrap.setChartType(this.type);
        //
        // If in editing mode
        if (Client.mainFrame.isEditing()) {
          // Assign data compatible with the new chart type
          var d = this.changeDataEditingMode(oldType);
          this.data = this.buildDataTable(d);
          this.wrap.setDataTable(this.data);
        }
        //
        // If not in editing mode, redraw the chart
        if (!this.chartEditor)
          this.drawChart();
        else  // If in editing mode, trigger the changeType event to inform the server
          google.visualization.events.trigger(this.wrap, "changeType", null);
      }
      catch (ex) {
        this.notifyError("changeChartType", ex);
      }
    }
  }
};


/**
 * Update chart properties
 * @param {Object} opt - the properties to update
 */
Client.GoogleCharts.prototype.changeChartOptions = function (opt)
{
  if (typeof opt === "string")
    this.options = JSON.parse(opt);
  else
    this.options = opt;
  //
  // If there is a chart wrapper
  if (this.wrap) {
    try {
      // Set the new options
      let opt = this.material ? google.charts[this.type].convertOptions(this.options) : this.options;
      this.wrap.setOptions(opt);
      //
      // If not in editing mode, redraw the chart
      if (!this.chartEditor)
        this.drawChart();
      else  // If in editing mode, trigger the changeOptions event to inform the server
        google.visualization.events.trigger(this.wrap, "changeOptions", null);
    }
    catch (ex) {
      this.notifyError("changeChartOptions", ex);
    }
  }
};


/**
 * Update column names
 * @param {Object} names - new names
 */
Client.GoogleCharts.prototype.changeChartColumnNames = function (names)
{
  if (this.wrap) {
    try {
      // Get the data
      var dataTable = this.wrap.getDataTable();
      //
      // Change the column labels
      for (var i = 0; i < names.length; i++)
        dataTable.setColumnLabel(i, names[i]);
      //
      if (!this.chartEditor)
        this.drawChart();
    }
    catch (ex) {
      this.notifyError("changeChartColumnNames", ex);
    }
  }
  else
    this.columnNames = names;
};


/**
 * Attach events
 * @param {Array} ev - the events to handle
 */
Client.GoogleCharts.prototype.attachChartEvents = function (ev)
{
  try {
    var pthis = this;
    google.visualization.events.addListener(this.wrap, "changeType", function (ev) {
      var e = [{obj: pthis.id, id: "chgProp", content: {name: "type", value: pthis.type, clid: Client.id}}];
      if (ev && ev.indexOf("onChange") >= 0)
        e.push({obj: pthis.id, id: "onChange", content: pthis.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    });
    //
    google.visualization.events.addListener(this.wrap, "changeOptions", function (ev) {
      var e = [{obj: pthis.id, id: "chgProp", content: {name: "options", value: pthis.options, clid: Client.id}}];
      if (ev && ev.indexOf("onChange") >= 0)
        e.push({obj: pthis.id, id: "onChange", content: pthis.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    });
    //
    google.visualization.events.addListener(this.wrap, "select", function () {
      var clickedElem = pthis.chart.getSelection();
      if (clickedElem.length > 0) {
        var pos = clickedElem[0].row;
        if (pthis.domObj.onnavigate)
          pthis.domObj.onnavigate({cmd: "goToPos", pos: pos, type: "navigate"});
        if (pthis.sendOnSelect)
          Client.mainFrame.sendEvents([{obj: pthis.id, id: "onSelect", content: {row: clickedElem[0].row, column: clickedElem[0].column}}]);
      }
    });
    //
    this.domObj.addEventListener("click", function (ev) {
      // Trigger a select event
      google.visualization.events.trigger(pthis.wrap, 'select', null);
      pthis.chart.setSelection([]);
    });
  }
  catch (ex) {
    this.notifyError("attachChartEvents", ex);
  }
};


/**
 * Draw a chart
 * @returns {Chart}
 */
Client.GoogleCharts.prototype.drawChart = function ()
{
  // If in edit mode
  if (this.chartEditor) {
    // Get the wrapper for the new chart
    this.wrap = this.chartEditor.getChartWrapper();
    //
    // Set the events handlers
    this.attachChartEvents();
    //
    // Set the chart type
    this.changeChartType(this.wrap.getChartType());
    //
    // Set the chart options
    this.changeChartOptions(this.wrap.getOptions());
    //
    this.chartEditor = undefined;
  }
  //
  // Draw the chart
  if (this.wrap && this.data)
    this.wrap.draw();
};


/**
 * Show the chart editor
 */
Client.GoogleCharts.prototype.showEditor = function ()
{
  // Create the chart editor
  this.chartEditor = new google.visualization.ChartEditor();
  //
  // Set callback
  var pthis = this;
  var ok = function () {
    // Called when the user clicks the "OK" button on the chart editor dialog
    pthis.drawChart();
    if (Client.mainFrame.isEditing()) {
      var e = Client.eleMap["editm"];
      if (e) {
        e.editProxy.appCmd([{id: pthis.id, c: "changeProp", n: "cst_type", v: pthis.type}]);
        e.editProxy.appCmd([{id: pthis.id, c: "changeProp", n: "cst_options", v: JSON.stringify(pthis.options)}]);
      }
    }
    else if (pthis.parentWidget)
      Client.mainFrame.sendEvents([{ obj: pthis.id, id: "changeProp", content: { options: JSON.stringify(pthis.options), type: pthis.type } }]);
  };
  google.visualization.events.addListener(this.chartEditor, "ok", ok);
  //
  // Open the chart editor
  this.chartEditor.openDialog(this.wrap, {});
};


/**
 * Generate sample chart data
 */
Client.GoogleCharts.prototype.createSampleData = function () {
  this.sampleData = {};
  this.sampleData.multiseries = {data: {columns: ["Month", "A", "B", "C", "D", "E", "F", "G", "H"], data: [
        ["January", 400, 259, 250, 140, 139, 68, 14, 4], ["February", 250, 80, 76, 69, 55, 44, 33, 22], ["March", 196, 195, 106, 105, 104, 99, 80, 74],
        ["April", 40, 128, 140, 228, 230, 240, 301, 400], ["May", 860, 719, 686, 619, 600, 500, 400, 300], ["June", 412, 330, 290, 270, 130, 120, 110, 100]]}};
  this.sampleData.singleseries = {data: {columns: ["Country", "A"], data: [
        ["Italy", 65], ["France", 250], ["Spain", 96], ["Germany", 40], ["Ireland", 86], ["Sweden", 41]]}};
  this.sampleData.notext = {data: {columns: ["A", "B"], data: [
        [15, 65], [130, 250], [150, 96], [80, 40], [126, 86], [69, 41]]}};
  this.sampleData.textonly = {data: {columns: ["Country", "A"], data: [
        ["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"], ["K", "L"]]}};
  this.sampleData.tree = {data: {columns: ["A", "P", "C", "D"], data: [
        ['Global', '', 0, 0],
        ['A', 'Global', 0, 0],
        ['E', 'Global', 0, 0],
        ['D', 'Global', 0, 0],
        ['B', 'A', 11, 10],
        ['U', 'A', 52, 31],
        ['M', 'E', 24, 12],
        ['C', 'D', 16, -23]]}};
  this.sampleData.date = {data: {columns: ["Date", "A", "B"], data: [
        [new Date(2014, 01, 01), 10, "B"], [new Date(2014, 02, 01), 20, "D"],
        [new Date(2014, 03, 01), 30, "F"], [new Date(2014, 04, 01), 40, "H"],
        [new Date(2014, 05, 01), 50, "J"], [new Date(2014, 05, 01), 60, "L"]]}};
  this.sampleData.timeline = {data: {columns: ["Name", "Start", "End"], data: [
        ['Washington', new Date(1789, 3, 30), new Date(1797, 2, 4)],
        ['Adams', new Date(1797, 2, 4), new Date(1801, 2, 4)],
        ['Jefferson', new Date(1801, 2, 4), new Date(1809, 2, 4)]]}};
  this.sampleData.gantt = {data: {columns: ["TaskID", "TaskName", "Start", "End", "Duration", "PercentComplete", "Dependencies"], data: [
        ['Research', 'Find sources',
          new Date(2018, 0, 1), new Date(2018, 0, 5), 0, 100, null],
        ['Write', 'Write paper',
          new Date(2018, 0, 6), new Date(2018, 0, 9), 0, 25, 'Research,Outline'],
        ['Outline', 'Outline paper',
          new Date(2018, 0, 5), new Date(2018, 0, 6), 0, 100, 'Research']]}};
  this.sampleData.sankey = {data: {columns: ["From", "To", "Weight"], data: [
        ['Brazil', 'Portugal', 5],
        ['Brazil', 'France', 1],
        ['Brazil', 'Spain', 1],
        ['Brazil', 'England', 1],
        ['Canada', 'Portugal', 1],
        ['Canada', 'France', 5],
        ['Canada', 'England', 1],
        ['Mexico', 'Portugal', 1],
        ['Mexico', 'France', 1],
        ['Mexico', 'Spain', 5],
        ['Mexico', 'England', 1],
        ['USA', 'Portugal', 1],
        ['USA', 'France', 1],
        ['USA', 'Spain', 1],
        ['USA', 'England', 5]]}};
};


/**
 * Categorize charts
 */
Client.GoogleCharts.prototype.createChartsCategories = function () {
  this.chartsCategories = {};
  this.chartsCategories.multiseries = ["LineChart", "ComboChart", "ImageChart", "AreaChart", "SteppedAreaChart",
    "ColumnChart", "Histogram", "BarChart", "CandlestickChart", "Table", "BubbleChart", "MotionChart"];
  this.chartsCategories.singleseries = ["PieChart", "GeoChart", "Gauge"];
  this.chartsCategories.notext = ["ImageSparkLine", "ScatterChart"];
  this.chartsCategories.textonly = ["OrgChart"];
  this.chartsCategories.tree = ["TreeMap"];
  this.chartsCategories.date = ["AnnotatedTimeLine"];
  this.chartsCategories.timeline = ["Timeline"];
  this.chartsCategories.gantt = ["Gantt"];
  this.chartsCategories.sankey = ["Sankey"];
};


/**
 * Change sample data
 * @param {String} oldType - previous chart type
 */
Client.GoogleCharts.prototype.changeDataEditingMode = function (oldType) {
  var oldCat;
  var newCat;
  if (oldType) {
    // Find out what category the old chart type and the new chart type belong to
    for (var c in this.chartsCategories) {
      // If I have not yet found the category of the old chart type
      if (!oldCat) {
        var oc = this.chartsCategories[c].indexOf(oldType);
        if (oc > -1)
          oldCat = c;
      }
      //
      // If I have not yet found the category of the new chart type
      if (!newCat) {
        var nc = this.chartsCategories[c].indexOf(this.type);
        if (nc > -1)
          newCat = c;
      }
      //
      // If I have found the categories, the search ends
      if (oldCat && newCat)
        break;
    }
  }
  //
  // Return the sample data for the category the new chart type belongs to
  return this.sampleData[newCat];
};


/**
 * Build a data table
 * @param {Object} el - data the chart has to show
 */
Client.GoogleCharts.prototype.convertDataRow = function (row)
{
  if (this.schema && this.columns) {
    for (var j = 0; j < row.length; j++) {
      var v = row[j];
      if (this.schema) {
        var sc = this.schema[this.columns[j]];
        if (sc) {
          if (sc.dt === "da" || sc.dt === "ti" || sc.dt === "dt") {
            // convert to date
            row[j] = new Date(v);
          }
        }
      }
    }
  }
};


/**
 * Build a data table
 * @param {Object} el - data the chart has to show
 */
Client.GoogleCharts.prototype.buildDataTable = function (el) {
  //
  if (!el || !el.data)
    return;
  //
  var a = [];
  //
  // Add columns
  if (el.data.columns) {
    // Use the labels defined by the user
    if (this.columnNames) {
      a.push(this.columnNames);
    }
    else  // Use the names of the columns of the datamap
      a.push(el.data.columns);
  }
  //
  if (el.data.schema) {
    this.schema = el.data.schema;
    this.columns = el.data.columns;
  }
  //
  // Add data
  for (var i = 0; i < el.data.data.length; i++) {
    var d = [];
    for (var j = 0; j < el.data.data[i].length; j++) {
      var v = el.data.data[i][j];
      if (this.schema) {
        var sc = this.schema[el.data.columns[j]];
        if (sc) {
          if (sc.dt === "da" || sc.dt === "ti" || sc.dt === "dt") {
            // convert to date
            v = new Date(v);
          }
        }
      }
      //
      d.push(v);
    }
    a.push(d);
  }
  //
  var ris;
  try {
    ris = google.visualization.arrayToDataTable(a, false);
  }
  catch (ex) {
    this.notifyError("buildDataTable", ex);
  }
  return ris;
};


/**
 * Onresize Message
 * @param {Event} ev - the event occured when the browser window was resized
 */
Client.GoogleCharts.prototype.onResize = function (ev)
{
  this.drawChart();
  //
  Client.Element.prototype.onResize.call(this, ev);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.GoogleCharts.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onError");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendError = true;
  }
  var pos = events.indexOf("onSelect");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendOnSelect = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Called when the visibility of a parent is changed
 * @param {Boolean} visible
 */
Client.GoogleCharts.prototype.visibilityChanged = function (visible)
{
  // If the chart is now visible and it was never initilized / or in any case, resize it
  if (visible) {
    if (this.delayedInitData)
      this.initChart(this.delayedInitData);
    else
      this.drawChart();
  }
};


/**
 * Copy the chart data in a new object
 * @param {Object} data
 */
Client.GoogleCharts.prototype.copyChartData = function (data)
{
  this.delayedInitData = {};
  var keys = Object.keys(data);
  for (var i = 0; i < keys.length; i++)
    this.delayedInitData[keys[i]] = data[keys[i]];
};


/**
 * Notify an error
 * @param {string} location
 * @param {exception} exc
 */
Client.GoogleCharts.prototype.notifyError = function (location, exc)
{
  if (!this.sendError)
    return;
  var e = [{obj: this.id, id: "onError", content: {location: location, name: exc.name, message: exc.message}}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.GoogleCharts.prototype.close = function (firstLevel, triggerAnimation) 
{
  this.closed = true;
  if (this.wrap) {
    try {
      this.wrap.clear();
      this.wrap.clearChart();
    }
    catch (exc) {
      
    }
  }
  //
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A frame containing buttons
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfChart = function (widget, parent, view)
{
  this.data;
  this.options;
  this.library;
  this.chartType;
  this.chartTypeInt;
  //
  this.title;
  this.hLabel;
  this.vLabel;
  this.legendPos;
  this.showLegend;
  this.clickable;
  //
  // Set default events definition
  widget = Object.assign({
    library: Client.IdfChart.types.CHARTJS,
    chartType: 1,
    clickEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.ACTIVE : undefined)
  }, widget);
  //
  Client.IdfFrame.call(this, widget, parent, view);
};


// Make Client.IdfButtonBar extend Client.IdfFrame
Client.IdfChart.prototype = new Client.IdfFrame();


Client.IdfChart.transPropMap = Object.assign({}, Client.IdfFrame.transPropMap, {
  lib: "library",
  fil: "config",
  ged: "showEditor"
});

Client.IdfChart.types = {
  CHARTJS: 6,
  GOOGLECHART: 7
};

Client.IdfChart.chartTypes = {
  [Client.IdfChart.types.CHARTJS]: ["line", "bar", "horizontalBar", "pie", "doughnut", "bubble", "scatter"],
  [Client.IdfChart.types.GOOGLECHART]: ["LineChart", "ColumnChart", "BarChart", "PieChart", "DonutChart", "BubbleChart", "ScatterChart", "GeoChart", "Histogram", "ComboChart", "Gauge", "SteppedAreaChart", "OrgChart", "TreeMap", "Table", "Sankey", "Gantt", "CandlestickChart", "Timeline", "AreaChart"]
};
//
/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfChart.convertPropValues = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.convertPropValues(props);
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfChart.transPropMap.lib:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfChart.transPropMap.fil:
        try {
          // Special case : foundation sends fil = "" if the query returned no data, in this case we must clear the graph
          if (props[p] === "")
            props[p] = "{}";
          //
          props[p] = JSON.parse(props[p]);
          //
          // Clear the old error if present
          props["parseError"] = "";
        }
        catch (ex) {
          // The server sent a NOT json value, maybe is using a not supported library
          // console.err("Wrong value detected in the file property of a graph, the only supported laibraries are Google Chart and ChartJS");
          props["parseError"] = ex.message;
        }
        break;

      case Client.IdfChart.transPropMap.ged:
      case Client.IdfChart.transPropMap.ena:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfChart.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.prototype.updateElement.call(this, props);
  //
  let updateGraphProps = [
    "library",
    "config",
    "enabled",
    "data",
    "chartType",
    "title",
    "hLabel",
    "vLabel",
    "legendPos",
    "showLegend",
    "options"
  ];
  let updateOptionsProps = [
    "title",
    "hLabel",
    "vLabel",
    "legendPos",
    "showLegend"
  ];
  //
  let redrawGraph = false;
  let updateGraph = Object.getOwnPropertyNames(props).some(elem => updateGraphProps.indexOf(elem) >= 0);
  let updateOptions = Object.getOwnPropertyNames(props).some(elem => updateOptionsProps.indexOf(elem) >= 0);
  //
  if (props.library !== undefined) {
    this.library = props.library;
    redrawGraph = true;
  }
  //
  if (props.chartType !== undefined) {
    // From IDCloud, we need to update the graph
    this.chartType = props.chartType;
    //
    // Get the type list used by the library and the chosen real type
    let tp = Client.IdfChart.chartTypes[this.library];
    this.chartTypeInt = tp[this.chartType] || tp[0];
  }
  //
  if (props.config !== undefined && typeof props.config === "object") {
    // From foundation, the config is a json with the data and all the options already set
    // in this case we don't need the type, is already in the options
    this.config = props.config;
    this.options = this.config.options;
    this.data = this.config.data;
    this.chartTypeInt = this.config.type;
    this.chartType = Client.IdfChart.chartTypes[this.library].indexOf(this.chartTypeInt);
    delete props.charType;
    //
    // The server resends all of the data, the graph implementation of IDCLOUD is differential.
    // To handle this differency we need to RECREATE the graph with the new data
    redrawGraph = true;
  }
  //
  if (props.data !== undefined) {
    // From IDCloud, we need to update the graph
    this.data = props.data;
  }
  //
  // Those settings come from IDCloud, after set those we need to updare or recreate the options to adapt for these
  if (props.title !== undefined)
    this.title = props.title;
  if (props.hLabel !== undefined)
    this.hLabel = props.hLabel;
  if (props.vLabel !== undefined)
    this.vLabel = props.vLabel;
  if (props.legendPos !== undefined)
    this.legendPos = props.legendPos;
  if (props.showLegend !== undefined)
    this.showLegend = props.showLegend;
  if (props.parseError !== undefined)
    this.parseError = props.parseError;
  if (props.options !== undefined) {
    // From IDCloud, we need to update the graph
    this.options = props.options;
  }
  if (props.events !== undefined) {
    // From IDCloud, but the events doesn't change, we need only to memorize them
    this.events = props.events;
  }
  if (props.showEditor)
    this.chartElement?.showEditor();
  //
  if (updateOptions)
    this.options = this.generateOptions();
  //
  if (updateGraph)
    this.drawGraph(redrawGraph);
  //
  // Clear the booleans that are used only to launch functions on the native chart, otherwise we cannot call them another time
  delete this.showEditor;
};


Client.IdfChart.prototype.generateOptions = function ()
{
  let opts = {};
  //
  if (this.library === Client.IdfChart.types.GOOGLECHART) {
    opts.hAxis = {};
    opts.vAxis = {};
    opts.legend = {};
    //
    if (this.title !== undefined)
      opts.title = this.title;
    if (this.hLabel !== undefined)
      opts.hAxis.title = this.hLabel;
    if (this.vLabel !== undefined)
      opts.vAxis.title = this.vLabel;
    opts.legend.position = this.showLegend === false ? "none" : (this.legendPos !== undefined ? this.legendPos : null);
  }
  else {
    // ChartJS
    opts.legend = {};
    opts.scales = {xAxes: [{scaleLabel: {}}], yAxes: [{scaleLabel: {}}]};
    //
    if (this.title !== undefined)
      opts.title = {text: this.title, display: true};
    if (this.hLabel !== undefined)
      opts.scales.xAxes[0].scaleLabel = {labelString: this.hLabel, display: true};
    if (this.vLabel !== undefined)
      opts.scales.yAxes[0].scaleLabel = {labelString: this.vLabel, display: true};
    if (this.showLegend !== undefined)
      opts.legend.display = this.showLegend;
    if (this.legendPos !== undefined)
      opts.legend.position = this.legendPos;
  }
  //
  return opts;
};


/**
 * Get widget requirements
 * @param {Object} w
 */
Client.IdfChart.getRequirements = function (w)
{
  let prefix = Client.mainFrame.isIDF ? "fluid/" : "";
  let req = Client.IdfFrame.getRequirements(w);
  //
  switch (w.library) {
    case Client.IdfChart.types.CHARTJS: // ChartJS
      req[prefix + "objects/chartjs/Chart.min.js"] = {type: "jc", name: "chartjs"};
      req[prefix + "objects/chartjs/chartJs.js"] = {type: "jc", name: "chartjsadapter"};
      break;

    case Client.IdfChart.types.GOOGLECHART: // Google chart
      req["https://www.gstatic.com/charts/loader.js"] = {type: "jc", name: "gchartjs"};
      req[prefix + "objects/googlecharts/googlecharts.js"] = {type: "jc", name: "gchartadapter"};
      break;
  }
  //
  return req;
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfChart.prototype.onEvent = function (event)
{
  let events = Client.IdfFrame.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onSelect":
      this.selectEvent = event;
      break;

    case "onClick":
      // Give event the IDF format
      if (Client.mainFrame.isIDF) {
        let detail = this.getClickDetail(event, this);
        //
        // Send the event to the server only if the user clicked on a serie
        if (detail.par4 !== undefined)
          events.push({
            id: "graclk",
            def: this.clickEventDef,
            content: {
              oid: this.id,
              screenX: event.content.clientX,
              screenY: event.content.clientY,
              button: event.content.button,
              obn: detail.par4
            }
          });
      }
      else {
        // TODO
      }
      delete this.selectEvent;
      break;

    case "changeProp":
      // Give event the IDF format
      if (Client.mainFrame.isIDF) {
        events.push({
          id: "graopt",
          def: Client.IdfMessagesPump.eventTypes.ACTIVE,
          content: {
            oid: this.id,
            obn: event.content.options,
            par1: event.content.type
          }});
      }
      else {
        // TODO
      }
      break;
  }
  //
  return events;
};


/**
 * Get click detail
 * @param {Object} event
 * @param {Widget} srcWidget
 */
Client.IdfChart.prototype.getClickDetail = function (event, srcWidget)
{
  let detail = Client.IdfFrame.prototype.getClickDetail.call(this, event, srcWidget);
  //
  let serie = this.selectEvent ? this.selectEvent.content.column - 1 : event.content.dataset;
  let value = this.selectEvent ? this.selectEvent.content.row : event.content.pos;
  //
  if (serie !== undefined) {
    if (Client.mainFrame.isIDF)
      detail.par4 = `S${(serie + 1).toString().padStart(2, "0")}I${value + 1}`;
    else {
      detail.serie = serie;
      detail.value = value;
    }
  }
  //
  return detail;
};


/**
 * Draw/update the graph
 * @param {boolean} redraw - if the chart is already created we should redraw it
 */
Client.IdfChart.prototype.drawGraph = function (redraw)
{
  // Don't draw graph if it's contained in an unactive tab
  if (this.parent instanceof Client.IdfTab && !this.parent.isActiveTab()) {
    this.delayedUpdate = true;
    return;
  }
  //
  delete this.delayedUpdate;
  //
  if (this.parseError) {
    // Show the error, the graph can't be created
    let content = Client.eleMap[this.contentContainerConf.id].getRootObject();
    content.innerHTML = Client.IdfResources.t("MSG_ChartException", [this.parseError]);
    //
    return;
  }
  //
  if ((this.library && this.chartTypeInt && !this.chartElement) || (redraw && this.chartElement)) {
    // Remove the old graph element
    if (this.chartElement) {
      let ix = this.elements.indexOf(this.chartElement);
      this.chartElement.close(true);
      if (ix >= 0)
        this.elements.splice(ix, 1);
    }
    //
    let graphOpts = this.createElementConfig({c: (this.library === Client.IdfChart.types.CHARTJS ? "ChartJs" : "GoogleCharts"), className: "idf-chart-body", data: this.data, options: this.options, type: this.chartTypeInt, visible: true});
    if (this.events || this.enabled) {
      let evts = this.events.length > 0 ? this.events : ["onClick"];
      graphOpts.events = evts;
      if (this.library === Client.IdfChart.types.GOOGLECHART) {
        // Google Chart hasn't onClick, only onSelect... and the events are on the data
        let idx = evts.indexOf("onClick");
        if (idx >= 0)
          evts.splice(idx, 1);
        //
        evts.push("onSelect");
        if (graphOpts.data)
          graphOpts.data.events = evts;
      }
    }
    this.chartElement = this.view.createElement(graphOpts, this, this.view);
    this.elements.push(this.chartElement);
  }
  else {
    // In this case use the updateElement
    this.chartElement.updateElement({data: this.data, options: this.options, type: this.chartTypeInt});
  }
};


/**
 * Get root object used by handleResize
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfChart.prototype.getResizeRootObject = function (el)
{
  return this.getRootObject(el);
};

/**
 * Handle a delayed update
 */
Client.IdfChart.prototype.handleDelayedUpdate = function ()
{
  if (this.delayedUpdate)
    this.drawGraph(true);
  delete this.delayedUpdate;
};

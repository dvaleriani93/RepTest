/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A simple timer
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfTimer = function (widget, parent, view)
{
  this.ticksCount = 0; // Number of ticks taken since the timer was activated
  //
  // Set default values
  widget = Object.assign({
    viewId: undefined, // Form's index associated with the timer
    ticks: 0, // Number of ticks after which the timer must be disabled
    interval: 0, // Interval between two ticks (in milliseconds)
    enabled: false, // If true the timer is enabled, if false the timer is disabled
    tickEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.ACTIVE : undefined)
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfCommand extend Client.Widget
Client.IdfTimer.prototype = new Client.Widget();


Client.IdfTimer.transPropMap = {
  frm: "viewId",
  num: "ticks",
  int: "interval",
  ena: "enabled",
  tke: "tickEventDef"
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfTimer.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfTimer.transPropMap.frm:
        if (props[p])
          props[p] = "frm:" + parseInt(props[p]);
        break;

      case Client.IdfTimer.transPropMap.num:
      case Client.IdfTimer.transPropMap.int:
      case Client.IdfTimer.transPropMap.tke:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfTimer.transPropMap.ena:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfTimer.prototype.updateElement = function (props)
{
  Client.Widget.prototype.updateElement.call(this, props);
  //
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "ticks":
        this.setTicks(v);
        break;

      case "interval":
        this.setInterval(v);
        break;

      case "enabled":
        this.setEnabled(v);
        break;
    }
  }
};


Client.IdfTimer.prototype.setTicks = function (value)
{
  this.ticks = value;
  this.check();
};


Client.IdfTimer.prototype.setInterval = function (value)
{
  this.interval = value;
  //
  if (this.timer)
    this.createInterval();
};


Client.IdfTimer.prototype.setEnabled = function (value)
{
  this.enabled = value;
  //
  if (this.enabled)
    this.createInterval();
  else
    this.clearInterval();
};


Client.IdfTimer.prototype.check = function ()
{
  // If the total number of ticks is greater than the new number of ticks, I disable myself
  if (this.enabled && this.ticks > 0 && this.ticksCount >= this.ticks)
    this.clearInterval();
};


Client.IdfTimer.prototype.createInterval = function ()
{
  this.clearInterval();
  this.timer = setInterval(Client.IdfTimer.prototype.onTick.bind(this), this.interval);
};


Client.IdfTimer.prototype.clearInterval = function ()
{
  // I disable the timer if it is set
  if (this.timer)
    clearInterval(this.timer);
  delete this.timer;
  //
  // I reset the ticks taken by the timer
  this.ticksCount = 0;
};


Client.IdfTimer.prototype.onTick = function ()
{
  // First, I increase the number of ticks
  this.ticksCount++;
  //
  // I notify the event to the server
  let ev = {id: "timer", def: this.tickEventDef, content: {oid: this.id}};
  Client.mainFrame.sendEvents([ev]);
  //
  // I check if I have to disable myself
  this.check();
};
/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A list of timers
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfTimerList = function (widget, parent, view)
{
  // Unlike the CommandList, the server does not send the TimerList id
  widget = Object.assign({id: "tmh"}, widget);
  Client.mainFrame.wep.timerList = this;
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfCommandList extend Client.Widget
Client.IdfTimerList.prototype = new Client.Widget();


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfTimerList.prototype.realize = function (widget, parent, view)
{
  // Create widget children
  this.createChildren(widget);
};

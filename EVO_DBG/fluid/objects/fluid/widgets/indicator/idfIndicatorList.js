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
Client.IdfIndicatorList = function (widget, parent, view)
{
  // Unlike the CommandList, the server does not send the IndicatorList id
  widget = Object.assign({id: "inh"}, widget);
  Client.mainFrame.wep.indicatorList = this;
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfCommandList extend Client.Widget
Client.IdfIndicatorList.prototype = new Client.Widget();


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfIndicatorList.prototype.realize = function (widget, parent, view)
{
  Client.mainFrame.wep.realizeStatusbar();
  //
  // Create widget children
  this.createChildren(widget);
};


/**
 * Append a child DOM Object to root object DOM
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.IdfIndicatorList.prototype.appendChildObject = function (child, domObj)
{
  Client.mainFrame.wep.statusbar.getRootObject().appendChild(domObj);
};

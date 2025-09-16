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
Client.IdfButtonBar = function (widget, parent, view)
{
  Client.IdfFrame.call(this, widget, parent, view);
};


// Make Client.IdfButtonBar extend Client.IdfFrame
Client.IdfButtonBar.prototype = new Client.IdfFrame();

Client.IdfButtonBar.getRequirements = Client.IdfFrame.getRequirements;

Client.IdfButtonBar.transPropMap = Object.assign({}, Client.IdfFrame.transPropMap, {
  bvr: "vertical",
  cms: "commandsSet"
});


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfButtonBar.convertPropValues = function (props)
{
  Client.IdfFrame.convertPropValues(props);
};


/**
 * Create elements configuration
 * @param {Object} widget
 */
Client.IdfButtonBar.prototype.createElementsConfig = function (widget)
{
  Client.IdfFrame.prototype.createElementsConfig.call(this, widget);
  //
  this.buttonsContainerConf = this.createElementConfig({c: "Container", className: "button-bar-list"});
  this.contentContainerConf.children.push(this.buttonsContainerConf);
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfButtonBar.prototype.realize = function (widget, parent, view)
{
  Client.IdfFrame.prototype.realize.call(this, widget, parent, view);
  //
  // On IDF all commands set are defined as WebEntryPoint children.
  // So I have to get commands set linked to this buttonBar and create commands inside it
  let cms = Client.eleMap[this.commandsSet];
  if (cms) {
    cms.buttonBarId = this.id;
    this.createChildren({children: cms.children});
  }
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfButtonBar.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.prototype.updateElement.call(this, props);
  //
  if (props.vertical !== undefined) {
    this.vertical = props.vertical;
    //
    let el = Client.eleMap[this.buttonsContainerConf.id];
    if (el)
      el.updateElement({className: "button-bar-list " + (!props.vertical ? "horizontal" : "")});
  }
};

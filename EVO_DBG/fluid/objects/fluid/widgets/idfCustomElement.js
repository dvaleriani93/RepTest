/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A page of a book
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfCustomElement = function (widget, parent, view)
{
  this.events = [];
  this.customProps = {};
  //
  parent.customElement = this;
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfCustomElement extends Client.Widget
Client.IdfCustomElement.prototype = new Client.Widget();


Client.IdfCustomElement.transPropMap = {
  cls: "_class",
  evl: "events",
  SubForm: "subFrameId"
};

Client.IdfCustomElement.excludedProps = ["id", "c", "class", "children"]
        .concat(Object.keys(Client.IdfCustomElement.transPropMap).map(p => Client.IdfCustomElement.transPropMap[p]));


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfCustomElement.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case "c":
      case "id":
      case "children":
      case Client.IdfCustomElement.transPropMap.cls:
        break;

      case Client.IdfCustomElement.transPropMap.evl:
        props[p] = props[p].split("|");
        break;

      case "methodInvocations":
        for (let i = 0; i < props[p].length; i++)
          props[p][i].args = JSON.parse(props[p][i].args);
        break;

      default:
        props[p] = JSON.parse(props[p]);
        break;
    }
  }
};


/**
 * Get widget requirements
 * @param {Object} widget
 */
Client.IdfCustomElement.getRequirements = function (widget)
{
  let req = {};
  if (!widget.subFrameId)
    req[`fluid/objects/${widget._class}/${widget._class}.js`] = {type: "jc", name: widget._class};
  return req;
};


/**
 * Create element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfCustomElement.createConfigFromXml = function (xml)
{
  let config = {};
  for (let i = 0; i < xml.childNodes.length; i++) {
    let node = xml.childNodes[i];
    if (node.nodeName === "invoke") {
      config.methodInvocations = config.methodInvocations || [];
      config.methodInvocations.push({method: node.getAttribute("met"), args: node.getAttribute("args")});
    }
  }
  return config;
};


Client.IdfCustomElement.prototype.createConfig = function ()
{
  if (!Client[this._class])
    return {c: "Container"};
  //
  let config = {c: this._class, events: this.events.slice()};
  //
  // I copy all the custom properties
  for (let p in this.customProps)
    config[p] = this[p];
  //
  return config;
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfCustomElement.prototype.updateElement = function (props)
{
  Client.Widget.prototype.updateElement.call(this, props);
  //
  // I keep a map of all the custom properties I see passing
  let propsToUpdate = {};
  for (let p in props) {
    if (Client.IdfCustomElement.excludedProps.includes(p))
      continue;
    //
    this.customProps[p] = true;
    this[p] = props[p];
    propsToUpdate[p] = true;
  }
  //
  this.parent.updateControls(propsToUpdate);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfCustomElement.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  if (!Client.mainFrame.isIDF)
    return events;
  //
  switch (event.id) {
    case "chgProp":
      events.push({
        id: "cseev",
        def: Client.IdfMessagesPump.eventTypes.ACTIVE,
        content: {
          oid: this.id,
          par1: "$ChangeProp$",
          par2: JSON.stringify([event.content.name, event.content.value])
        }
      });
      break;

    default:
      if (!this.events.includes(event.id))
        break;
      //
      // I convert the event for IDF
      events.push({
        id: "cseev",
        def: Client.IdfMessagesPump.eventTypes.ACTIVE,
        content: {
          oid: this.id,
          par1: event.id,
          par2: JSON.stringify(event.content)
        }
      });
  }
  //
  return events;
};

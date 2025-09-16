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
Client.IdfIndicator = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    width: 0,
    style: -1,
    enabled: true,
    visible: true,
    image: "",
    caption: "",
    alignment: Client.IdfIndicator.alignments.LEFT,
    clickEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfCommand extend Client.Widget
Client.IdfIndicator.prototype = new Client.Widget();


Client.IdfIndicator.transPropMap = {
  frm: "viewId",
  ena: "enabled",
  vis: "visible",
  sty: "style",
  img: "image",
  ali: "alignment"
};

Client.IdfIndicator.styles = {
  TIME: 6,
  DATE: 7
};

Client.IdfIndicator.alignments = {
  LEFT: 2,
  CENTER: 3,
  RIGHT: 4
};

/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfIndicator.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfIndicator.transPropMap.frm:
        if (props[p])
          props[p] = "frm:" + parseInt(props[p]);
        break;

      case Client.IdfIndicator.transPropMap.sty:
      case Client.IdfIndicator.transPropMap.ali:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfIndicator.transPropMap.ena:
      case Client.IdfIndicator.transPropMap.vis:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfIndicator.prototype.updateElement = function (props)
{
  Client.Widget.prototype.updateElement.call(this, props);
  //
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "width":
        this.setWidth(v);
        break;

      case "tooltip":
        this.setTooltip(v);
        break;

      case "style":
        this.setStyle(v);
        break;

      case "enabled":
        this.setEnabled(v);
        break;

      case "visible":
        this.setVisible(v);
        break;

      case "caption":
        this.setText(v);
        break;

      case "image":
        this.setImage(v);
        break;

      case "alignment":
        this.setAlignment(v);
        break;
    }
  }
};


Client.IdfIndicator.prototype.setWidth = function (value)
{
  this.width = value;
  //
  let width = "";
  let dynamicWidth;
  //
  // Width = 1 means that the indicator must be as large as its content
  // Width = 0 it means that the width must be dynamic
  // otherwise the width is fixed
  if (this.width === 0)
    dynamicWidth = true;
  else if (this.width > 1)
    width = this.width + "px";
  //
  // Update width
  this.getRootObject(true).updateElement({style: {width}});
  //
  // Add/remove dynamic-width class
  Client.Widget.updateElementClassName(this.getRootObject(true), "dynamic-width", !dynamicWidth);
};


Client.IdfIndicator.prototype.setTooltip = function (value)
{
  this.getRootObject(true).updateElement({tooltip: this.tooltip});
};


Client.IdfIndicator.prototype.setStyle = function (value)
{
  this.style = value;
  //
  // If a timer is set, I disable it
  clearInterval(this.timer);
  delete this.timer;
  //
  switch (this.style) {
    case Client.IdfIndicator.styles.TIME:
      {
        // I create the timer to update the time (every second)
        let timerTick = () => this.textBox.updateElement({innerHTML: moment().format("H.mm")});
        this.timer = setInterval(timerTick, 1000);
        timerTick();
      }
      break;

    case Client.IdfIndicator.styles.DATE:
      {
        // I create the timer to update the date (every minute)
        let timerTick = () => this.textBox.updateElement({innerHTML: moment().format("L")});
        this.timer = setInterval(timerTick, 60000);
        timerTick();
      }
      break;

    default:
      // Set the text
      this.textBox.updateElement({innerHTML: this.caption});
      break;
  }
};


Client.IdfIndicator.prototype.setEnabled = function (value)
{
  this.enabled = value;
  //
  Client.Widget.updateElementClassName(this.textBox, "indicator-disabled", this.enabled);
  Client.Widget.updateElementClassName(this.imageObj, "indicator-disabled", this.enabled);
};


Client.IdfIndicator.prototype.setVisible = function (value)
{
  this.visible = value;
  this.getRootObject(true).updateElement({visible: this.visible});
};

Client.IdfIndicator.prototype.setText = function (value)
{
  // Extract the image from the caption if present
  let {caption, icon} = Client.Widget.extractCaptionData(this.caption);
  //
  // If there is an icon, set it
  if (icon)
    this.setImage(icon);
  //
  this.textBox.updateElement({innerHTML: caption});
};

Client.IdfIndicator.prototype.setImage = function (value)
{
  this.image = value;
  //
  if (this.image) {
    if (!this.imageObj) {
      let imageObjConf = this.createElementConfig({c: "IonButton", className: "indicator-image"});
      this.imageObj = this.getRootObject(true).insertBefore({child: imageObjConf, sib: this.textBox.id});
    }
    //
    Client.Widget.setIconImage({image: this.image, el: this.imageObj});
  }
  else if (this.imageObj)
    this.getRootObject(true).removeChild(this.imageObj);
};

Client.IdfIndicator.prototype.setAlignment = function (value)
{
  Client.Widget.updateElementClassName(this.getRootObject(true), this.getAlignmentClass(), true);
  this.alignment = value;
  Client.Widget.updateElementClassName(this.getRootObject(true), this.getAlignmentClass());
};

Client.IdfIndicator.prototype.getAlignmentClass = function ()
{
  switch (this.alignment) {
    case Client.IdfIndicator.alignments.LEFT:
      return "left-aligned";
    case Client.IdfIndicator.alignments.CENTER:
      return "center-aligned";
    case Client.IdfIndicator.alignments.RIGHT:
      return "right-aligned";
  }
};


/**
 * Create elements configuration
 */
Client.IdfIndicator.prototype.createElementsConfig = function ()
{
  return this.createElementConfig({c: "Container", type: "span", events: ["onClick"],
    className: "indicator-box",
    children: [
      this.createElementConfig({c: "Container", type: "span", className: "indicator-text"})
    ]});
};

Client.IdfIndicator.prototype.realize = function (widget, parent, view)
{
  let mainContainer = view.createElement(this.createElementsConfig(widget), parent, view);
  this.mainObjects.push(mainContainer);
  this.textBox = mainContainer.elements[0];
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfIndicator.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      events.push(...this.handleClick(event));
      break;
  }
  //
  return events;
};

Client.IdfIndicator.prototype.handleClick = function (event)
{
  let events = [];
  //
  if (!this.enabled)
    return events;
  //
  events.push({
    id: "clk",
    def: this.clickEventDef,
    content: {
      oid: this.id
    }
  });
  //
  return events;
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A span of a box
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfSpan = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    value: "", // Span value (in string format anyway)
    text: "", // Text to display (or image path if it has)
    tooltip: "", // Tooltip to show
    visualStyle: null, // Visual Style associated with this span
    dataType: Client.IdfField.dataTypes.CHARACTER, // Data type
    maxLength: 255, // Maximum length (default = for character fields)
    scale: 0, // Number of decimals
    visible: true, // Visible span?
    enabled: false, // Span enabled?
    stretch: Client.IdfBox.stretches.AUTO, // Type of stretch to apply to the image
    mimeType: "", // Blob content type
    hasImage: false, // Span with Blob Image?
    iconImage: "", // Icon to show as part of the value list?
    //valueList: null, // Value list for this span
    valueListIdx: -1, // The index of the present value in the value list
    backColor: "", // Background color
    color: "", // Foreground color
    fontModifiers: "", // Character properties
    mask: "", // Masking
    placeholder: "", // placeholder
    className: "", // Additional class
    changeEventDef: Client.IdfMessagesPump?.eventTypes.DEFERRED // Does the change have to be active?
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfSpan extend Client.Widget
Client.IdfSpan.prototype = new Client.Widget();


Client.IdfSpan.transPropMap = {
  txt: "text",
  val: "value",
  dat: "dataType",
  max: "maxLength",
  sca: "scale",
  vis: "visible",
  ena: "enabled",
  str: "stretch",
  mim: "mimeType",
  him: "hasImage",
  img: "iconImage",
  idx: "valueListIdx",
  bkc: "backColor",
  frc: "color",
  ftm: "fontModifiers",
  msk: "mask",
  wtk: "placeholder",
  chg: "changeEventDef"
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfSpan.convertPropValues = function (props) {
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfSpan.transPropMap.dat:
      case Client.IdfSpan.transPropMap.max:
      case Client.IdfSpan.transPropMap.sca:
      case Client.IdfSpan.transPropMap.str:
      case Client.IdfSpan.transPropMap.idx:
      case Client.IdfSpan.transPropMap.chg:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfSpan.transPropMap.vis:
      case Client.IdfSpan.transPropMap.ena:
      case Client.IdfSpan.transPropMap.him:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfSpan.prototype.realize = function (widget, parent, view)
{
  // Create the main container
  let conf = this.createElementConfig({c: "Container", className: "book-span"});
  this.mainObjects.push(view.createElement(conf, parent, view));
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfSpan.prototype.updateElement = function (props)
{
  Client.Widget.prototype.updateElement.call(this, props);
  //
  let adjustPadding = false;
  let el = {style: {}};
  let controlProps = {};
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "text":
        this.setText(v, el);
        controlProps.text = v;
        break;

      case "value":
        this.value = v;
        controlProps.value = v;
        break;

      case "tooltip":
        this.setTooltip(v, el);
        break;

      case "dataType":
        this.dataType = v;
        this.adjustAutoAlignment();
        controlProps.dataType = v;
        break;

      case "maxLength":
        this.maxLength = v;
        controlProps.maxLength = v;
        break;

      case "scale":
        this.scale = v;
        controlProps.scale = v;
        break;

      case "visible":
        Client.IdfSection.prototype.setVisible.call(this, v, el);
        break;

      case "enabled":
        adjustPadding = true;
        this.enabled = v;
        controlProps.enabled = v;
        break;

      case "stretch":
        this.stretch = v;
        controlProps.imageResizeMode = v;
        break;

      case "hasImage":
        // Not needed: property always false
        break;

      case "mimeType":
        adjustPadding = true;
        this.mimeType = v;
        controlProps.mimeType = v;
        break;

      case "iconImage":
        // Not needed: not needed: it was needed for editable combo spans
        break;

      case "valueList":
        this.valueList = v;
        controlProps.valueList = v;
        break;

      case "valueListIdx":
        // Not needed: not needed: it was needed for editable combo spans
        break;

      case "backColor":
        Client.IdfBox.prototype.setBackColor.call(this, v, el);
        controlProps.backColor = v;
        break;

      case "color":
        Client.IdfBox.prototype.setColor.call(this, v, el);
        controlProps.color = v;
        break;

      case "fontModifiers":
        Client.IdfBox.prototype.setFontModifiers.call(this, v, el);
        controlProps.fontModifiers = v;
        break;

      case "mask":
        this.mask = v;
        controlProps.mask = v;
        break;

      case "placeholder":
        this.placeholder = v;
        controlProps.placeholder = v;
        break;

      case "className":
        Client.IdfSection.prototype.setClassName.call(this, v, el);
        break;

      case "alignment":
        el.style.textAlign = (v === Client.IdfVisualStyle.alignments.JUSTIFY ? "justify" : "");
        controlProps.alignment = v;
        break;

      case "visualStyle":
        controlProps.visualStyle = v;
        break;

      case "numRows":
        controlProps.numRows = v;
    }
  }
  //
  if (adjustPadding)
    this.parent.updateElement({adjustPadding: true});
  //
  this.getRootObject(true).updateElement(el);
  //
  this.updateControl(controlProps);
};


Client.IdfSpan.prototype.setText = function (value, el)
{
  this.text = value;
  //
  if (!this.control)
    el.innerHTML = this.getHTMLIcon(this.text);
};


Client.IdfSpan.prototype.setTooltip = function (value, el)
{
  el.tooltip = Client.Widget.getHTMLTooltip(null, value);
};


/**
 * Apply visual style
 */
Client.IdfSpan.prototype.applyVisualStyle = function ()
{
  let alternate = this.parent.parent instanceof Client.IdfSection && this.parent.parent.recordNumber % 2 === 0;
  let visOptions = {objType: "field", list: true, alternate: alternate};
  this.addVisualStyleClasses(this.getRootObject(true), visOptions);
};


/**
 * Adjust auto alignment for numeric span
 */
Client.IdfSpan.prototype.adjustAutoAlignment = function ()
{
  Client.Widget.updateElementClassName(this.parent.getRootObject(true), "book-box-numeric", !Client.IdfField.isNumeric(this.dataType));
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfSpan.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "chgProp":
      // I send the changed value
      events.push(...this.handleValueChange(event));
      break;
  }
  //
  return events;
};


/**
 * Handle change of the span
 * @param {Object} event
 */
Client.IdfSpan.prototype.handleValueChange = function (event)
{
  let events = [];
  //
  // If it's not a real value change, do nothing
  if (event.content.value === this.value)
    return events;
  //
  this.value = event.content.value;
  //
  events.push({
    id: "chg",
    def: this.changeEventDef,
    content: {
      oid: this.id,
      par1: this.value
    }
  });
  //
  return events;
};


Client.IdfSpan.prototype.getVisualStyle = function ()
{
  return Client.IdfVisualStyle.getByIndex(this.visualStyle || this.parent.visualStyle);
};


Client.IdfSpan.prototype.getControlType = function ()
{
  let ct = this.getVisualStyle().getControlType();
  if (ct === Client.IdfField.controlTypes.AUTO) {
    // Auto means COMBO or EDIT ...
    if (this.valueList && this.enabled)
      ct = Client.IdfField.controlTypes.COMBO;
    else if (this.dataType === Client.IdfField.dataTypes.BLOB)
      ct = Client.IdfField.controlTypes.BLOB;
    else
      ct = Client.IdfField.controlTypes.EDIT;
  }
  //
  // If disabled or without value list, OPTION counts as EDIT
  if (!this.valueList && ct === Client.IdfField.controlTypes.OPTION)
    ct = Client.IdfField.controlTypes.EDIT;
  //
  // If disabled input, textarea and htmlEditor are simple spans
  if (!this.enabled && [Client.IdfField.controlTypes.EDIT, Client.IdfField.controlTypes.HTMLEDITOR].includes(ct))
    return;
  //
  return ct;
};


Client.IdfSpan.prototype.updateControl = function (el)
{
  if (Object.keys(el).length === 0)
    return;
  //
  let controlType = this.getControlType();
  if (!controlType) {
    // I don't have to have a control: I remove the old control
    if (this.control) {
      this.control.close(true);
      delete this.control;
      //
      // I restore the innerHTML
      if (!this.mimeType) {
        let rootObject = this.getRootObject(true);
        Client.Widget.updateElementClassName(rootObject, "book-span-control", true);
        rootObject.updateElement({innerHTML: this.text});
      }
    }
  }
  else {
    if ("imageResizeMode" in el && this.stretch === Client.IdfBox.stretches.AUTO)
      el.imageResizeMode = Client.IdfBox.stretches.NONE;
    //
    // Edits and buttons have the value in the text
    let value = this.value;
    switch (controlType) {
      case Client.IdfField.controlTypes.EDIT:
      case Client.IdfField.controlTypes.BUTTON:
        value = this.text;
        if ("text" in el)
          el.value = value;
        break;

      case Client.IdfField.controlTypes.BLOB:
        value = this.text;
        let blobMime;
        if (this.mimeType) {
          if (this.mimeType.startsWith("image/"))
            blobMime = Client.IdfFieldValue.blobMimeTypes.IMAGE;
          else if (this.mimeType.startsWith("text/"))
            blobMime = Client.IdfFieldValue.blobMimeTypes.TEXT;
          else if ("mimeType" in el) {
            el.blobUrl = this.text;
            blobMime = Client.IdfFieldValue.blobMimeTypes.SIZE;
            value = Client.IdfResources.t("SRV_MSG_OpenDoc").replace(" (|1)", "");
          }
          if ("text" in el)
            el.value = value;
        }
        else if ("mimeType" in el)
          blobMime = Client.IdfFieldValue.blobMimeTypes.EMPTY;
        //
        if ("mimeType" in el)
          el.blobMime = blobMime;
        break;
    }
    //
    // I update the control
    if (this.control)
      return this.control.updateElement(el);
    //
    // I reset the innerHTML
    let rootObject = this.getRootObject(true);
    Client.Widget.updateElementClassName(rootObject, "book-span-control");
    rootObject.updateElement({innerHTML: ""});
    //
    // I create the control
    let controlConf = this.createElementConfig({
      c: "IdfControl",
      container: this.getRootObject(true),
      dataType: this.dataType,
      value,
      maxLength: this.maxLength,
      scale: this.scale,
      enabled: this.enabled,
      valueList: this.valueList,
      color: this.color,
      backColor: this.backColor,
      fontModifiers: this.fontModifiers,
      mask: this.mask,
      placeholder: this.placeholder,
      alignment: this.parent.horizontalAlignment,
      visualStyle: this.getVisualStyle().index,
      imageResizeMode: el.imageResizeMode,
      blobMime: el.blobMime,
      blobUrl: el.blobUrl
    });
    //
    this.control = this.insertBefore({child: controlConf});
  }
};


Client.IdfSpan.prototype.getSupportedTransformOperation = function (x, y, element)
{
  return this.parent.getSupportedTransformOperation(x, y, element);
};

Client.IdfSpan.prototype.acceptsDrop = function (widget)
{
  return this.parent.acceptsDrop(widget);
};

Client.IdfSpan.prototype.getTransformOperationTargetWidget = function (operation, element)
{
  return this.parent;
};

Client.IdfSpan.prototype.getTransformOperationTargetObj = function (operation, element)
{
  return this.parent.getTransformOperationTargetObj(operation, element);
};

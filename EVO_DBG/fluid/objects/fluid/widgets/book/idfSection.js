/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A single tab
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfSection = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    xPos: 0, // Position of the section
    yPos: 0, // Position of the section
    width: 0, // Section height
    height: 0, // Section height
    visualStyle: 0, // Visual Style associated with this section
    numberOfColumns: 1, // Number of columns
    columnSpace: 0, // Space between the columns
    recordNumber: 0, // Section record number
    visible: true, // Visible section?
    overlay: false, // Does the section need to overlap?
    className: "" // Additional class
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfSection extend Client.Widget
Client.IdfSection.prototype = new Client.Widget();


Object.defineProperty(Client.IdfSection.prototype, "page", {
  get: function () {
    return this.parent.page;
  }
});


Client.IdfSection.transPropMap = {
  xp: "xPos",
  yp: "yPos",
  vis: "visible",
  col: "numberOfColumns",
  csp: "columnSpace",
  mas: "mastroBox",
  rec: "recordNumber",
  ovr: "overlay"
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfSection.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfSection.transPropMap.col:
      case Client.IdfSection.transPropMap.csp:
      case Client.IdfSection.transPropMap.rec:
      case Client.IdfSection.transPropMap.xp:
      case Client.IdfSection.transPropMap.yp:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfSection.transPropMap.vis:
      case Client.IdfSection.transPropMap.ovr:
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
Client.IdfSection.prototype.realize = function (widget, parent, view)
{
  // Create the main container
  let conf = this.createElementConfig({c: "Container", className: "book-section"});
  this.mainObjects.push(view.createElement(conf, parent, view));
  //
  // Create widget children
  this.createChildren(widget);
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfSection.prototype.updateElement = function (props)
{
  Client.Widget.prototype.updateElement.call(this, props);
  //
  let el = {style: {}};
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "xPos":
        this.setXPos(v, el);
        break;

      case "yPos":
        this.setYPos(v, el);
        break;

      case "width":
        this.setWidth(v, el);
        break;

      case "height":
        this.setHeight(v, el);
        break;

      case "numberOfColumns":
        // There is no need to do anything because the whole server does it
        this.numberOfColumns = v;
        break;

      case "columnSpace":
        // There is no need to do anything because the whole server does it
        this.columnSpace = v;
        break;

      case "recordNumber":
        this.setRecordNumber(v, el);
        break;

      case "visible":
        this.setVisible(v, el);
        break;

      case "mastroBox":
        // Managed in the constructor: it shouldn't change
        this.mastroBox = v;
        break;

      case "overlay":
        // You don't need to do anything as the overlayed sections already arrive with top = 0
        this.overlay = v;
        break;

      case "className":
        this.setClassName(v, el);
        break;
    }
  }
  //
  this.getRootObject(true).updateElement(el);
};


Client.IdfSection.prototype.setXPos = function (value, el)
{
  this.xPos = Client.IdfBookPage.convertToMeasure(value, this.page.unitOfMeasure);
  el.style.left = Math.round(Client.IdfBookPage.convertIntoPx(this.xPos, this.page.unitOfMeasure)) + "px";
};


Client.IdfSection.prototype.setYPos = function (value, el)
{
  this.yPos = Client.IdfBookPage.convertToMeasure(value, this.page.unitOfMeasure);
  el.style.top = Math.round(Client.IdfBookPage.convertIntoPx(this.yPos, this.page.unitOfMeasure)) + "px";
};


Client.IdfSection.prototype.setWidth = function (value, el)
{
  this.width = Client.IdfBookPage.convertToMeasure(value, this.page.unitOfMeasure);
  el.style.width = Math.round(Client.IdfBookPage.convertIntoPx(this.width, this.page.unitOfMeasure)) + "px";
};


Client.IdfSection.prototype.setHeight = function (value, el)
{
  this.height = Client.IdfBookPage.convertToMeasure(value, this.page.unitOfMeasure);
  el.style.height = Math.round(Client.IdfBookPage.convertIntoPx(this.height, this.page.unitOfMeasure)) + "px";
};


Client.IdfSection.prototype.setRecordNumber = function (value, el)
{
  if (this.recordNumber === value)
    return;
  //
  let oldRecNum = this.recordNumber;
  this.recordNumber = value;
  //
  // So I have to place myself AFTER the section that has the RecNumber preceding mine
  let prevSecIdx = -1;
  let firstSecIdx = -1;
  let mySecIdx = -1;
  this.parent.elements.forEach((sec, i) => {
    if (sec.recNumber === this.recNumber - 1)
      prevSecIdx = i;
    //
    if (sec.recNumber === 1)
      firstSecIdx = i;
    //
    if (sec === this)
      mySecIdx = i;
  });
  //
  // If I found it ... I position myself in the right place
  if (prevSecIdx >= 0) {
    // I reposition myself in memory
    this.parent.elements.splice(mySecIdx, 1); // I remove myself
    //
    // I removed myself, if I was before I have to take into account that the hole has been closed
    if (mySecIdx < prevSecIdx)
      prevSecIdx--;
    //
    this.parent.elements.splice(prevSecIdx + 1, 0, this); // I position myself after her
  }
  else {
    // I have not found it ... I have to start at the beginning!
    // I reposition myself in memory
    this.parent.elements.splice(mySecIdx, 1);          // I remove myself
    this.parent.elements.splice(firstSecIdx, 0, this); // I position myself at the beginning
  }
  //
  // And I went from even to odd or vice versa
  if ((oldRecNum % 2) !== (this.recordNumber % 2)) {
    // I update the visual style of the section
    this.applyVisualStyle();
    //
    // I have to reapply the VS to all the boxes too !!!
    this.elements.forEach(box => box.applyVisualStyle());
  }
};


Client.IdfSection.prototype.setVisible = function (value, el)
{
  this.visible = value;
  el.visible = value;
};


Client.IdfSection.prototype.setClassName = function (value, el)
{
  // Remove previous className
  let rootObject = this.getRootObject(true);
  Client.Widget.updateElementClassName(rootObject, this.className, true);
  //
  // Apply new className
  this.className = value;
  Client.Widget.updateElementClassName(rootObject, this.className);
};


/**
 * Apply visual style
 */
Client.IdfSection.prototype.applyVisualStyle = function ()
{
  // If the mainObject does not belong to me I do nothing
  if (this.owneSection)
    return;
  //
  let visOptions = {objType: "field", list: true, alternate: this.recordNumber % 2 === 0, bookBox: true};
  this.addVisualStyleClasses(this.getRootObject(true), visOptions);
};

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
Client.IdfBookPage = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    width: 0,
    height: 0,
    unitOfMeasure: Client.IdfBookPage.unitsOfMeasure.MILLIMETERS,
    fitMode: Client.IdfBookPage.fitModes.NONE
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfBookPage extend Client.Widget
Client.IdfBookPage.prototype = new Client.Widget();


Client.IdfBookPage.transPropMap = {
  num: "number",
  um: "unitOfMeasure",
  fit: "fitMode"
};


Client.IdfBookPage.unitsOfMeasure = {
  MILLIMETERS: "mm",
  INCHES: "in"
};


Client.IdfBookPage.fitModes = {
  NONE: 1,
  WIDTH: 2,
  PAGE: 3
};


/**
 * Convert a value to mm or px
 * @param {Number} value
 * @param {Client.IdfBookPage.unitsOfMeasure} um
 * @returns {Number}
 */
Client.IdfBookPage.convertToMeasure = function (value, um)
{
  switch (um) {
    case Client.IdfBookPage.unitsOfMeasure.MILLIMETERS:
      return value / 100.0;
    case Client.IdfBookPage.unitsOfMeasure.INCHES:
      return value / 1000.0;
  }
};


/**
 * Convert a value from mm or inch to pixel
 * @param {Number} value
 * @param {Client.IdfBookPage.unitsOfMeasure} um
 * @returns {Number}
 */
Client.IdfBookPage.convertIntoPx = function (value, um)
{
  switch (um) {
    case Client.IdfBookPage.unitsOfMeasure.MILLIMETERS:
      return value * 96.0 / 25.4;
    case Client.IdfBookPage.unitsOfMeasure.INCHES:
      return value * 96.0;
  }
};


/**
 * Convert a value from pixel to mm or inch
 * @param {Number} value
 * @param {Client.IdfBook.unitsOfMeasure} um
 * @returns {Number}
 */
Client.IdfBookPage.convertFromPx = function (value, um)
{
  switch (um) {
    case Client.IdfBookPage.unitsOfMeasure.MILLIMETERS:
      return value / 96.0 * 25.4;
    case Client.IdfBookPage.unitsOfMeasure.INCHES:
      return value / 96.0;
  }
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfBookPage.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfBookPage.transPropMap.num:
        props[p] = parseInt(props[p]) - 1;
        break;

      case Client.IdfBookPage.transPropMap.fit:
        props[p] = parseInt(props[p]);
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
Client.IdfBookPage.prototype.realize = function (widget, parent, view)
{
  // Create the main container
  let conf = this.createElementConfig({c: "Container", className: "book-page-container" + (this.parent.hideBorder ? "-noborder" : "")});
  this.mainObjects.push(view.createElement(conf, parent, view));
  //
  // Create widget children
  this.createChildren(widget);
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfBookPage.prototype.createChildren = function (el)
{
  // I move the sections as children of the respective boxes they belong to
  for (let i = 0; i < el.children.length; i++) {
    let section = el.children[i];
    if (section.c !== "IdfSection")
      continue;
    //
    let box = el.children.find(function (child) {
      return (child.c === "IdfBox" && child.id === section.mastroBox);
    });
    el.children.splice(i--, 1);
    delete section.mastroBox;
    box.children.push(section);
  }
  //
  Client.Widget.prototype.createChildren.call(this, el);
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfBookPage.prototype.updateElement = function (props)
{
  Client.Widget.prototype.updateElement.call(this, props);
  //
  let el = {style: {}};
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "number":
        this.number = v;
        break;

      case "width":
        this._width = v;
        this.width = Client.IdfBookPage.convertToMeasure(v, this.unitOfMeasure);
        el.style.width = Client.IdfBookPage.convertIntoPx(this.width, this.unitOfMeasure) + "px";
        break;

      case "height":
        this._height = v;
        this.height = Client.IdfBookPage.convertToMeasure(v, this.unitOfMeasure);
        el.style.height = Client.IdfBookPage.convertIntoPx(this.height, this.unitOfMeasure) + "px";
        break;

      case "fitMode":
        this.setFitMode(v, el);
        break;
    }
  }
  //
  this.getRootObject(true).updateElement(el);
};


Client.IdfBookPage.prototype.setFitMode = function (v, el)
{
  this.fitMode = v;
  //
  // In X I hide whether I extend to full page or width
  el.style.overflowX = (this.fitMode !== Client.IdfBookPage.fitModes.NONE) ? "hidden" : "auto";
  //
  // In Y I hide only if I extend to the whole page
  el.style.overflowY = (this.fitMode === Client.IdfBookPage.fitModes.PAGE) ? "hidden" : "auto";
};


/**
 * Update fixed zones
 */
Client.IdfBookPage.prototype.updateFixedZones = function ()
{
  // Fixed zones cannot be larger than the page!
  let fixW = Math.min(this.width, Client.IdfBookPage.convertToMeasure(this.parent.fixedWidth, this.unitOfMeasure));
  let fixH = Math.min(this.height, Client.IdfBookPage.convertToMeasure(this.parent.fixedHeight, this.unitOfMeasure));
  let pagesContainer = this.parent.getRootObject(true);
  //
  // If I have any fixed zone, I create the container for the pages
  if ((fixW || fixH) && !this.fixedPageBox) {
    let pageWrapperConf = this.createElementConfig({c: "Container", className: "book-page-wrapper-fixed"});
    this.fixedPageWrapper = pagesContainer.insertBefore({child: pageWrapperConf});
    //
    let fixedPageBoxConf = this.createElementConfig({c: "Container", className: "book-page-container-fixed"});
    this.fixedPageBox = this.fixedPageWrapper.insertBefore({child: fixedPageBoxConf});
    //
    this.fixedPageBox.insertBefore({child: this.getRootObject(true)});
    //
    // This no longer scroll
    pagesContainer.updateElement({style: {overflow: "hidden"}});
    //
    // Attack the event to manage the fixed zones
    this.fixedPageBox.updateElement({style: {overflow: "auto"}});
    this.fixedPageBox.getRootObject().addEventListener("scroll", this.onScroll.bind(this));
  }
  //
  // If there is a fixed zone on the left and I haven't created the fixed zone yet, I do
  if (fixW && !this.fixedLeftPageBox) {
    let fixedLeftPageBoxConf = this.createElementConfig({c: "Container", className: "book-page-container-fixed book-page-container-fixed-left"});
    this.fixedLeftPageBox = this.fixedPageWrapper.insertBefore({child: fixedLeftPageBoxConf});
  }
  else if (!fixW && this.fixedLeftPageBox) {
    // I have the fixed area but it is no longer needed ... I destroy it and answer the boxes on the page
    while (this.fixedLeftPageBox.elements.length)
      this.getRootObject(true).insertBefore({child: this.fixedLeftPageBox.elements[0].getRootObject()});
    //
    this.fixedLeftPageBox.parent.removeChild({id: this.fixedLeftPageBox.id});
    delete this.fixedLeftPageBox;
    //
    if (this.fixedLeftScroll)
      this.fixedLeftScroll.close();
    delete this.fixedLeftScroll;
  }
  //
  // If there is a fixed zone at the top and I haven't created the fixed zone yet, I do
  if (fixH && !this.fixedTopPageBox) {
    let fixedTopPageBoxConf = this.createElementConfig({c: "Container", className: "book-page-container-fixed book-page-container-fixed-top"});
    this.fixedTopPageBox = this.fixedPageWrapper.insertBefore({child: fixedTopPageBoxConf});
  }
  else if (!fixH && this.fixedTopPageBox) {
    // I have the fixed area but it is no longer needed ... I destroy it and answer the boxes on the page
    while (this.fixedTopPageBox.elements.length)
      this.getRootObject(true).insertBefore({child: this.fixedTopPageBox.elements[0].getRootObject()});
    //
    this.fixedTopPageBox.parent.removeChild({id: this.fixedTopPageBox.id});
    delete this.fixedTopPageBox;
    //
    if (this.fixedTopScroll)
      this.fixedTopScroll.close();
    delete this.fixedTopScroll;
  }
  //
  // If I have both fixed areas I need the "cap" at the top left
  if (fixW && fixW && !this.fixedTopLeftPageBox) {
    let fixedTopLeftPageBoxConf = this.createElementConfig({c: "Container", className: "book-page-container-fixed book-page-container-fixed-left book-page-container-fixed-top"});
    this.fixedTopLeftPageBox = this.fixedPageWrapper.insertBefore({child: fixedTopLeftPageBoxConf});
  }
  else if ((!fixW || !fixW) && this.fixedTopLeftPageBox) {
    // I have the cap but it is no longer needed ... I destroy it and answer the boxes on the page
    while (this.fixedTopLeftPageBox.elements.length)
      this.getRootObject(true).insertBefore({child: this.fixedTopLeftPageBox.elements[0].getRootObject()});
    //
    this.fixedTopLeftPageBox.parent.removeChild({id: this.fixedTopLeftPageBox.id});
    delete this.fixedTopLeftPageBox;
    //
    if (this.fixedTopLeftScroll)
      this.fixedTopLeftScroll.close();
    delete this.fixedTopLeftScroll;
  }
  //
  if ((!fixW && !fixH) && this.fixedPageBox) {
    // I have the page container but I don't need it anymore ... restore
    while (this.fixedPageBox.elements.length)
      pagesContainer.insertBefore({child: this.fixedPageBox.elements[0]});
    //
    pagesContainer.removeChild({id: this.fixedPageWrapper.id});
    //
    delete this.fixedPageWrapper;
    delete this.fixedPageBox;
    //
    pagesContainer.updateElement({style: {overflow: ""}});
    //
    // Restore the page
    this.getRootObject(true).updateElement({style: {marginLeft: "", marginTop: ""}});
  }
  //
  // Now I fit the dimensions of the fixed zones
  if (this.fixedLeftPageBox || this.fixedTopPageBox) {
    let wx = Math.round(Client.IdfBookPage.convertIntoPx(fixW, this.unitOfMeasure));
    let hx = Math.round(Client.IdfBookPage.convertIntoPx(fixH, this.unitOfMeasure));
    let bgColor = getComputedStyle(this.getRootObject()).backgroundColor;
    //
    if (this.fixedLeftPageBox)
      this.fixedLeftPageBox.updateElement({
        style: {
          height: Client.IdfBookPage.convertIntoPx(this.height, this.unitOfMeasure) + 1 + "px",
          width: wx + 1 + "px",
          backgroundColor: bgColor
        }
      });
    //
    if (this.fixedTopPageBox)
      this.fixedTopPageBox.updateElement({
        style: {
          width: Client.IdfBookPage.convertIntoPx(this.width, this.unitOfMeasure) + 1 + "px",
          height: hx + "px",
          backgroundColor: bgColor
        }
      });
    //
    if (this.fixedTopLeftPageBox)
      this.fixedTopLeftPageBox.updateElement({
        style: {
          width: wx + 1 + "px",
          height: hx + "px",
          backgroundColor: bgColor,
          zIndex: 2
        }
      });
    //
    // I have to make the object visible first in order to read the dimensions
    // The altContainer makes it visible with a timeout
    this.fixedPageWrapper.updateElement({visible: true});
    //
    let styleChange = {left: wx + "px", top: hx + "px"};
    if (this.fixedPageWrapper.getRootObject().clientWidth > wx)
      styleChange.width = this.fixedPageWrapper.getRootObject().clientWidth - wx + "px";
    if (this.fixedPageWrapper.getRootObject().clientHeight > hx)
      styleChange.height = this.fixedPageWrapper.getRootObject().clientHeight - hx + "px";
    this.fixedPageBox.updateElement({style: styleChange});
    //
    // I make the "covered" area of ​​the page inaccessible
    this.getRootObject(true).updateElement({style: {marginLeft: -wx + "px", marginTop: -hx + "px"}});
  }
  //
  // Finally, I move the boxes from the page to the fixed areas and vice versa
  this.elements.slice().forEach(box => {
    if (this.fixedLeftPageBox && box.xPos + box.width <= fixW && box.yPos >= fixH)
      this.fixedLeftPageBox.insertBefore({child: box.getRootObject(true)});
    else if (this.fixedTopPageBox && box.yPos + box.height <= fixH && box.xPos >= fixW)
      this.fixedTopPageBox.insertBefore({child: box.getRootObject(true)});
    else if (this.fixedTopLeftPageBox && box.xPos + box.width <= fixW && box.yPos + box.height <= fixH)
      this.fixedTopLeftPageBox.insertBefore({child: box.getRootObject(true)});
  });
};


Client.IdfBookPage.prototype.onScroll = function (ev)
{
  // If I don't have fixed zones, I'm done already
  if (!this.fixedLeftPageBox && !this.fixedTopPageBox)
    return;
  //
  let srcEl = ev.srcElement;
  if (!srcEl)
    return;
  //
  // If I have the fixed zone on the left
  if (this.fixedLeftPageBox)
    this.fixedLeftPageBox.updateElement({style: {top: -Math.max(srcEl.scrollTop, 0) + "px"}});
  //
  // If I have the fixed area at the top
  if (this.fixedTopPageBox)
    this.fixedTopPageBox.updateElement({style: {left: -Math.max(srcEl.scrollLeft, 0) + "px"}});
};

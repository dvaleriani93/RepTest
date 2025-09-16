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
Client.IdfTab = function (widget, parent, view)
{
  // Set default values
  widget = Object.assign({
    image: "",
    tooltip: "",
    caption: ""
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfTab extend Client.Widget
Client.IdfTab.prototype = new Client.Widget();


Client.IdfTab.transPropMap = Object.assign({}, Client.IdfFrame.transPropMap, {
  img: "image",
  con: "contentId",
  dcl: "deletePage"
});


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfTab.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfTab.transPropMap.dcl:
        props[p] = props[p] === "1";
        break;
    }
  }
};


Object.defineProperty(Client.IdfTab.prototype, "index", {
  get: function () {
    return this.parent.elements.indexOf(this);
  }
});


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfTab.prototype.realize = function (widget, parent, view)
{
  let mainContainerConf = this.createElementConfig({c: "IonTab", className: "tabbed-view-tab"});
  //
  // Create the main container
  this.mainObjects.push(view.createElement(mainContainerConf, parent, view));
  //
  // Create widget children
  this.createChildren(widget);
};


/**
 * Create children elements
 * @param {Object} el
 */
Client.IdfTab.prototype.createChildren = function (el)
{
  if (this.contentId) {
    let subFrame = this.parentIdfView?.getSubFrame(this.contentId);
    if (subFrame) {
      subFrame.isSubFrame = true;
      el.children.push(subFrame);
    }
  }
  //
  Client.Widget.prototype.createChildren.call(this, el);
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfTab.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  let propsToUpdate = {};
  let rootObject = this.getRootObject(true);
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "caption":
        propsToUpdate.title = Client.Widget.getHTMLForCaption(v);
        let data = Client.Widget.extractCaptionData(v);
        if (!propsToUpdate.tooltip)
          propsToUpdate.tooltip = data.caption;
        break;

      case "badge":
        propsToUpdate.badge = v;
        break;

      case "tooltip":
        propsToUpdate.tooltip = v;
        break;

      case "visible":
        this.visible = v;
        propsToUpdate.visible = v;
        break;

      case "image":
        this.image = v;
        if (!Client.Widget.isIconImage(this.image))
          rootObject.iconObj.setAttribute("bck", this.image ? "bck" : "");
        Client.Widget.setIconImage({image: this.image, el: rootObject, innerObj: rootObject.iconObj});
        break;

      case "deletePage":
        this.parent.deletePage(this);
        break;
    }
  }
  //
  rootObject.updateElement(propsToUpdate);
};


Client.IdfTab.prototype.isActiveTab = function ()
{
  return this.parent.elements[this.parent.selectedPage] === this;
};


Client.IdfTab.prototype.acceptsDrop = function (element)
{
  return this.parent.canDrop;
};


Client.IdfTab.prototype.isDraggable = function (element)
{
  return this.parent.canDrag;
};

Client.IdfTab.prototype.getSupportedTransformOperation = function (x, y, element, root)
{
  return Client.Widget.prototype.getSupportedTransformOperation.call(this, x, y, element, this.getRootObject(true).linkObj);
};

Client.IdfTab.prototype.getTransformOperationTargetObj = function (operation, element)
{
  return this.getRootObject(true).linkObj;
};


/**
 * Give focus to the element
 * @param {Object} options
 */
Client.IdfTab.prototype.focus = function (options)
{
  this.elements[0].focus(options);
};

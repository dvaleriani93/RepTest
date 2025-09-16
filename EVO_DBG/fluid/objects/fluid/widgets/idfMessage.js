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
Client.IdfMessage = function (widget, parent, view)
{
  widget = Object.assign({
    temporary: true,
    type: Client.IdfMessage.msgType.ERR
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfTreeNode extend Client.Widget
Client.IdfMessage.prototype = new Client.Widget();


Client.IdfMessage.transPropMap = {
  cod: "code",
  txt: "text",
  img: "image",
  typ: "type",
  tem: "temporary"
};


Client.IdfMessage.msgType = {
  INFO: 1,
  WARN: 2,
  ERR: 3
};


Client.IdfMessage.imagesMap = {
  lock: "lock",
  unlk: "unlock",
  find: "flash"
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfMessage.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfMessage.transPropMap.typ:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfMessage.transPropMap.tem:
        props[p] = (props[p] === "1" || props[p] === true);
        break;
    }
  }
};


/**
 * Create elements configuration
 */
Client.IdfMessage.prototype.createElementsConfig = function ()
{
  this.messageContainerConf = this.createElementConfig({c: "IonItem", className: "view-message-container"});
  //
  this.imageContainerBoxConf = this.createElementConfig({c: "Container", className: "generic-btn message-image"});
  this.messageContainerConf.children.push(this.imageContainerBoxConf);
  this.imageContainerConf = this.createElementConfig({c: "IonIcon", className: ""});
  this.imageContainerBoxConf.children.push(this.imageContainerConf);
  //
  // Create collapse button configuration
  this.textContainerConf = this.createElementConfig({c: "IonLabel", className: "message-text-container"});
  this.messageContainerConf.children.push(this.textContainerConf);

};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfMessage.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  this.createElementsConfig(widget);
  //
  // Create the main container
  this.mainObjects.push(view.createElement(this.messageContainerConf, parent, view));
};



/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfMessage.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (props.text !== undefined) {
    this.setText(props.text);
    //
    let el = Client.eleMap[this.textContainerConf.id];
    el.updateElement({innerHTML: this.text});
  }
  //
  if (props.type !== undefined) {
    this.type = props.type;
    //
    let cls = "info";
    let img = "information-circle";
    if (this.type === Client.IdfMessage.msgType.WARN) {
      img = "warning";
      cls = "warn";
    }
    else if (this.type === Client.IdfMessage.msgType.ERR) {
      img = "close-circle";
      cls = "err";
    }
    //
    let el = Client.eleMap[this.imageContainerConf.id];
    el.updateElement({icon: img, className: cls});
    //
    el = Client.eleMap[this.messageContainerConf.id];
    el.updateElement({className: "view-message-container " + cls});
  }
  //
  if (props.image !== undefined) {
    this.image = props.text;
    let el = Client.eleMap[this.imageContainerConf.id];
    el.updateElement({icon: this.image});
  }
  //
  if (props.temporary !== undefined) {
    this.temporary = props.temporary;
    if (this.temporary)
      this.requestId = Client.mainFrame.currentRequestId;
  }
};


/**
 * Replace img tags with ion-icon tags
 * @param {String} text
 */
Client.IdfMessage.prototype.setText = function (text)
{
  // Create a fake div and add text as innerHTML
  let fakeDiv = document.createElement("div");
  fakeDiv.innerHTML = Client.Widget.getHTMLForCaption(text);
  //
  // Look for img tags into fake div
  for (let i = 0; i < fakeDiv.childNodes.length; i++) {
    let childNode = fakeDiv.childNodes[i];
    //
    // If I found an img, replace it with an ion-icon.
    // Calculate ion-icon class using img.src
    if (childNode.tagName === "IMG") {
      let ionIcon = document.createElement("ion-icon");
      ionIcon.className = `ion-${Client.Ionic.platform}-${Client.IdfMessage.getIconByImg(childNode.src)}`;
      //
      fakeDiv.replaceChild(ionIcon, childNode);
    }
  }
  //
  this.text = fakeDiv.outerHTML;
};


/**
 * Get ion icon name by img url
 * @param {String} imgUrl
 */
Client.IdfMessage.getIconByImg = function (imgUrl)
{
  let images = Object.keys(Client.IdfMessage.imagesMap);
  let image = images.find(img => imgUrl.indexOf(img) !== -1);
  //
  return Client.IdfMessage.imagesMap[image] || "";
};
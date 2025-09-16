/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A panel page
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfPage = function (widget, parent, view)
{
  // Add this page to panel pages array
  parent.addPage(this);
  //
  // Get page's fields from parent panel
  this.fields = [];
  for (let i = 0; i < parent.fields.length; i++) {
    let field = parent.fields[i];
    if (field.pageIndex === widget.index) {
      field.page = this;
      this.fields.push(field);
    }
  }
  //
  // Get page's groups from parent panel
  this.groups = [];
  for (let i = 0; i < parent.groups.length; i++) {
    let group = parent.groups[i];
    if (group.pageIndex === widget.index) {
      group.page = this;
      this.groups.push(group);
    }
  }
  //
  // Set default values
  widget = Object.assign({
    enabled: true,
    visible: true
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfPage extend Client.Widget
Client.IdfPage.prototype = new Client.Widget();


Client.IdfPage.transPropMap = {
  flg: "flags",
  img: "image",
  pst: "pageStyle",
  ind: "index"
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfPage.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfPage.transPropMap.flg:
      case Client.IdfPage.transPropMap.pst:
      case Client.IdfPage.transPropMap.ind:
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
Client.IdfPage.prototype.realize = function (widget, parent, view)
{
  let containerConf = this.createElementConfig({c: "Container", className: "panel-page", events: ["onClick"], children: [
      {c: "IonText", type: "span", className: "panel-page-text"}
    ]});
  //
  let parentContainer = Client.eleMap[this.parent.pagesContainerConf.id];
  this.mainObjects.push(view.createElement(containerConf, parentContainer, view));
  //
  this.container = this.getRootObject(true);
  this.textObj = this.container.elements[0];
};



/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfPage.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (props.flags !== undefined) {
    this.flags = props.flags;
    //
    let enabled = !!(props.flags & 0x01);
    if (enabled !== this.enabled)
      props.enabled = enabled;
    //
    let visible = !!(props.flags & 0x02);
    if (visible !== this.visible)
      props.visible = visible;
  }
  //
  let updateCaption = false;
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "enabled":
        this.enabled = v;
        break;

      case "visible":
        this.setVisible(v);
        break;

      case "tooltip":
      case "caption":
        updateCaption = true;
        break;

      case "image":
        this.setImage(v);
        break;

      case "pageStyle":
      case "style":
        this.setPageStyle(v);
        break;

      case "badge":
        this.setBadge(v);
        break;

      case "isActive":
        this.setActive(v);
        break;

      case "className":
        this.oldClassName = this.className;
        this.className = v;
        this.updateClassName({oldClassName: this.oldClassName, newClassName: this.className});
        break;
    }
  }
  //
  // Update caption
  if (updateCaption)
    this.updateCaption();
  //
  // If I have to calculate layout, do it now
  if (props.visible !== undefined && !this.realizing)
    this.parent.calcLayout();
  //
  if (props.enabled !== undefined) {
    // Update fields controls and apply visual style
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].updateControls();
      this.fields[i].applyVisualStyle();
    }
  }
};


/**
 * Set visible
 * @param {Boolean} value
 */
Client.IdfPage.prototype.setVisible = function (value)
{
  this.visible = value;
  Client.Widget.updateObject(this.getRootObject(true), {visible: this.visible});
};


/**
 * Set image
 * @param {String} value
 */
Client.IdfPage.prototype.setImage = function (value)
{
  this.image = value;
  let rootObject = this.getRootObject(true);
  if (this.image) {
    if (!this.imageObj) {
      let imageConf = this.createElementConfig({c: "IonButton", className: "generic-btn small panel-page-image"});
      this.imageObj = rootObject.insertBefore({child: imageConf, sib: this.textObj.id});
    }
    //
    // Set image
    Client.Widget.setIconImage({image: this.image, el: this.imageObj});
  }
  else {
    if (this.imageObj) {
      rootObject.removeChild(this.imageObj);
      delete this.imageObj;
    }
  }
};


/**
 * Set page style
 * @param {Integer/String} value
 */
Client.IdfPage.prototype.setPageStyle = function (value)
{
  if (Client.mainFrame.isIDF) {
    // Remove old page style and add the new one
    Client.Widget.updateElementClassName(this.container, "panel-page-" + this.pageStyle, true);
    this.pageStyle = value;
    Client.Widget.updateElementClassName(this.container, "panel-page-" + this.pageStyle);
  }
  else {
    this.style = this.style || {};
    Client.Widget.updateCustomStyle({styleToUpdate: this.style, newStyle: value});
    //
    // Assign new style to container
    Client.Widget.updateStyle(this.container, {}, this.style);
  }
};


/**
 * Set badge
 * @param {String} value
 */
Client.IdfPage.prototype.setBadge = function (value)
{
  let rootObject = this.getRootObject(true);
  if (this.badge) {
    if (!this.badgeObj) {
      let badgeConf = this.createElementConfig({c: "IonBadge", className: "generic-badge internal", innerText: this.badge});
      this.badgeObj = rootObject.insertBefore({child: badgeConf});
    }
    else
      Client.Widget.updateObject(this.badgeObj, {innerText: this.badge});
  }
  else {
    if (this.badgeObj) {
      rootObject.removeChild(this.badgeObj);
      delete this.badgeObj;
    }
  }
};


/**
 * Set active
 * @param {Boolean} value
 */
Client.IdfPage.prototype.setActive = function (value)
{
  this.isActive = value;
  //
  // Remove active class and add it if needed
  Client.Widget.updateElementClassName(this.getRootObject(true), "active", !this.isActive);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfPage.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      event.page = {id: this.id, index: this.index};
      events.push(...this.parent.handlePageClick(event));
      break;
  }
  //
  return events;
};


/**
 * Update my caption
 */
Client.IdfPage.prototype.updateCaption = function ()
{
  let tooltip = this.tooltip ? Client.Widget.getHTMLTooltip(this.caption, this.tooltip) : null;
  if (tooltip)
    tooltip.placement = "bottom";
  //
  // Update tooltip
  Client.Widget.updateObject(this.getRootObject(true), {tooltip});
  //
  // Update caption text
  Client.Widget.updateObject(this.textObj, {innerHTML: Client.Widget.getHTMLForCaption(this.caption) || ""});
};


/**
 * Return true if I'm visible
 */
Client.IdfPage.prototype.isVisible = function ()
{
  return this.visible && this.isActive;
};


/**
 * Return true if I'm enabled
 */
Client.IdfPage.prototype.isEnabled = function ()
{
  return this.enabled;
};


Client.IdfPage.prototype.insertBefore = function (content)
{
  if (Client.mainFrame.isEditing()) {
    if (content.sib)
      content.child.sib = content.sib;
    //
    // Insert the field into the panel
    let panel = this.parent;
    panel.createChildren({children: [content.child]});
    panel.restoreRowSelectors();
    //
    // Get group's fields from parent panel
    this.fields = [];
    for (let i = 0; i < panel.fields.length; i++) {
      let field = panel.fields[i];
      if (field.pageIndex === this.index) {
        field.page = this;
        this.fields.push(field);
      }
    }
    //
    // Get page's groups from parent panel
    this.groups = [];
    for (let i = 0; i < panel.groups.length; i++) {
      let group = panel.groups[i];
      if (group.pageIndex === this.index) {
        group.page = this;
        this.groups.push(group);
      }
    }
    //
    panel.updateStructure();
    panel.updateElement({
      totalRows: Client.IdfPanel.maxReusableRows,
      data: {},
      dataBlockStart: 1,
      dataBlockEnd: Client.IdfPanel.maxReusableRows
    });
  }
  else
    Client.Element.prototype.insertBefore.call(this, content);
};


/**
 * Remove a field from the page
 * @param {Object} content - an object with the id of the element to remove
 */
Client.IdfPage.prototype.removeChild = function (content)
{
  try {
    // Check if the object is an internal object
    this.getRootObject(true).removeChild(Client.eleMap[content.id].getRootObject(true));
    //
    // Now check on the fields
    var id = content.id;
    for (var i = 0; i < this.fields.length; i++) {
      if (this.fields[i].id === id)
      {
        this.fields[i].close(true, content.triggerAnimation);
        this.fields.splice(i, 1);
        break;
      }
    }
  }
  catch (ex) {

  }
  //
  // I call the base method
  Client.Element.prototype.removeChild.call(this, content);
};


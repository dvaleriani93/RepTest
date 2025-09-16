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
Client.IdfTreeNode = function (widget, parent, view)
{
  // Set default values
  let parentTree = parent instanceof Client.IdfTree ? parent : parent.parentTree;
  widget = Object.assign({
    expanded: false,
    alreadyExpanded: false,
    canCheck: true,
    selected: false,
    image: "",
    badge: "",
    caption: "",
    tooltip: "",
    draggable: parentTree.dragDrop && parentTree.canDrag !== false,
    enabled: parentTree.enabled
  }, widget);
  //
  this.level = (parent instanceof Client.IdfTree) ? 1 : parent.level + 1;
  if (Client.mainFrame.isEditing())
    widget.expanded = true;
  //
  Client.Widget.call(this, widget, parent, view);
  //
  if (parentTree.selectedNode === this.id)
    this.setSelectedNode(true);
};


// Make Client.IdfTreeNode extend Client.Widget
Client.IdfTreeNode.prototype = new Client.Widget();


Client.IdfTreeNode.transPropMap = Object.assign({}, Client.Widget.transPropMap, {
  aex: "alreadyExpanded",
  exp: "expanded",
  cch: "canCheck",
  sel: "selected",
  img: "image"
});


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfTreeNode.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {

      case Client.IdfTreeNode.transPropMap.aex:
      case Client.IdfTreeNode.transPropMap.exp:
      case Client.IdfTreeNode.transPropMap.cch:
      case Client.IdfTreeNode.transPropMap.sel:
        props[p] = (props[p] === "1" || props[p] === true);
        break;
    }
  }
};


/**
 * Create elements configuration
 */
Client.IdfTreeNode.prototype.createElementsConfig = function ()
{
  this.treeContainerConf = this.createElementConfig({c: "Container", className: "treenode-container", events: ["onContextmenu"]});
  //
  this.headerContainerConf = this.createElementConfig({c: "IonItem", className: "treenode-header"});
  this.treeContainerConf.children.push(this.headerContainerConf);
  //
  // Create collapse button configuration
  this.collapseButtonConf = this.createElementConfig({c: "IonButton", iconPosition: "only", clear: "true", className: "treenode-exp-icon"});
  this.headerContainerConf.children.push(this.collapseButtonConf);
  //
  // This is the spacer that will be visible if the node is not expandable
  this.spacerButtonConf = this.createElementConfig({c: "Container", visible: false, className: "treenode-spacer"});
  let spacerContentConf = this.createElementConfig({c: "Container", className: "treenode-spacer-inner"});
  this.spacerButtonConf.children.push(spacerContentConf);
  this.headerContainerConf.children.push(this.spacerButtonConf);
  //
  // Create the check
  this.checkConf = this.createElementConfig({c: "IonCheckbox", className: "treenode-check"});
  this.headerContainerConf.children.push(this.checkConf);
  //
  // Create the label
  this.nodeLabel = this.createElementConfig({c: "IonLabel", className: "treenode-header-label"});
  this.headerContainerConf.children.push(this.nodeLabel);
  //
  // Create the badge
  this.nodeBadge = this.createElementConfig({c: "IonBadge", visible: false, className: "treenode-badge"});
  this.headerContainerConf.children.push(this.nodeBadge);
  //
  // This is the children container
  if (!Client.mainFrame.idfMobile) {
    this.contentBoxConf = this.createElementConfig({c: "IonList", className: "treenode-content collapsible-container", noLines: true});
    this.contentBoxConf.animations = [{trigger: "animation", prop: "collapseElement", duration: 250},
      {trigger: "animation", prop: "expandElement", duration: 250}];
    this.treeContainerConf.children.push(this.contentBoxConf);
    //
    // Add desktop events
    this.collapseButtonConf.events = ["onClick"];
    this.nodeLabel.events = ["onClick"];
  }
  else {
    // Add mobile events
    this.headerContainerConf.events = ["onClick"];
    this.contentBoxConf = this.createElementConfig({c: "IonList", className: "treenode-content", noLines: false});
  }
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfTreeNode.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  this.createElementsConfig(widget);
  //
  // Create the main container
  this.mainObjects.push(view.createElement(this.treeContainerConf, parent, view));
  //
  // Create the children container into the tree level container
  if (Client.mainFrame.idfMobile)
    view.createElement(this.contentBoxConf, this.parentTree.getLevelContainer(this.level + 1), view);
  //
  // Create widget children
  this.createChildren(widget);
  //
  // Tell the parent to update it's icon if needed
  if (parent instanceof Client.IdfTreeNode)
    parent.appendChildTreeNode();
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfTreeNode.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "alreadyExpanded":
        this.alreadyExpanded = v;
        break;

      case "expanded":
        this.setExpanded(v);
        break;

      case "image":
        this.setImage(v);
        break;

      case "caption":
        this.setCaption(v);
        break;

      case "tooltip":
        this.setTooltip(v);
        break;

      case "canCheck":
        this.setCanCheck(v);
        break;

      case "selected":
        this.setSelected(v);
        break;

      case "badge":
        this.setBadge(v);
        break;

      case "className":
        this.setClassName(v);
        break;

      case "draggable":
        this.setDraggable(v);
        break;

      case "enabled":
        this.setEnabled(v);
        break;
    }
  }
  //
  // Show or hide the expansion icon
  this.showExpansionIcon();
};


Client.IdfTreeNode.prototype.setExpanded = function (value)
{
  let oldExp = this.expanded;
  this.expanded = value;
  //
  let collapseButton = Client.eleMap[this.collapseButtonConf.id];
  collapseButton.updateElement({icon: Client.mainFrame.idfMobile ? "arrow-dropright" : (this.expanded ? "remove" : "add")});
  //
  let contentBox = Client.eleMap[this.contentBoxConf.id];
  if (!Client.mainFrame.idfMobile) {
    Client.Widget.updateElementClassName(contentBox, "expanded", !this.expanded);
    Client.Widget.updateElementClassName(contentBox, "collapsed", this.expanded);
  }
  else {
    if (!this.expanded)
      contentBox.updateElement({visible: false});
    else
      setTimeout(() => {
        contentBox.updateElement({visible: true});
      }, 300);
    //
    if (oldExp !== this.expanded) {
      let tree = this.parentTree;
      //
      // Navigate to the page
      tree.expandedNode = this.id;
      tree.navigateToLevel(this.expanded ? this.level : this.level - 1);
    }
  }
};


Client.IdfTreeNode.prototype.setImage = function (value)
{
  this.image = value;
  let headerContainer = Client.eleMap[this.headerContainerConf.id];
  if (this.image) {
    if (!this.imageObj) {
      // Create the icon
      let nodeIconConf = this.createElementConfig({c: "IonThumbnail", visible: "false", className: "treenode-img"});
      this.imageObj = headerContainer.insertBefore({child: nodeIconConf, sib: this.nodeLabel.id});
    }
    this.imageObj.updateElement({src: (Client.mainFrame.isIDF ? "images/" : "") + this.image});
  }
  else {
    if (this.imageObj) {
      headerContainer.removeChild(this.imageObj);
      delete this.imageObj;
    }
  }
};


Client.IdfTreeNode.prototype.setCaption = function (value)
{
  Client.eleMap[this.nodeLabel.id].updateElement({innerHTML: Client.Widget.getHTMLForCaption(this.caption)});
};


Client.IdfTreeNode.prototype.setTooltip = function (value)
{
  Client.eleMap[this.headerContainerConf.id].updateElement({title: this.tooltip});
};


Client.IdfTreeNode.prototype.setCanCheck = function (value)
{
  this.canCheck = value;
  Client.eleMap[this.checkConf.id].updateElement({disabled: !this.canCheck});
};


Client.IdfTreeNode.prototype.setSelected = function (value)
{
  this.selected = value;
  Client.eleMap[this.checkConf.id].updateElement({checked: this.selected});
};


Client.IdfTreeNode.prototype.setBadge = function (value)
{
  Client.eleMap[this.nodeBadge.id].updateElement({innerText: this.badge, visible: !!this.badge});
};


Client.IdfTreeNode.prototype.setClassName = function (value)
{
  let treeContainer = Client.eleMap[this.treeContainerConf.id];
  Client.Widget.updateElementClassName(treeContainer, this.className, true);
  this.className = value;
  Client.Widget.updateElementClassName(treeContainer, this.className);
};


Client.IdfTreeNode.prototype.setDraggable = function (value, recursive)
{
  let el = Client.eleMap[this.nodeLabel.id];
  el.updateElement({draggable: (value ? "true" : "")});
  el.domObj.classList.toggle("tree-draggable", value);
  //
  // Tell all the children
  if (recursive) {
    let enabled = this.parentTree.enabled;
    this.elements?.forEach(tn => tn.setDraggable(value && enabled, true));
  }
};


Client.IdfTreeNode.prototype.setEnabled = function (value, recursive)
{
  let checkBox = Client.eleMap[this.checkConf.id];
  checkBox.updateElement({disabled: !value});
  //
  let headerBox = Client.eleMap[this.headerContainerConf.id];
  Client.Widget.updateElementClassName(headerBox, "disabled", !this.enabled);
  //
  this.setDraggable(this.parentTree.dragDrop  && this.parentTree.canDrag !== false && value);
  //
  // Tell all the children
  if (recursive)
    this.elements?.forEach(tn => tn.setEnabled(value, true));
};


/**
 * Check if this node is the selected node and add the class.
 * If not cycle on the children
 * @param {Boolean} value
 */
Client.IdfTreeNode.prototype.setSelectedNode = function (value)
{
  Client.Widget.updateElementClassName(Client.eleMap[this.headerContainerConf.id], "treenode-sel-item", !value);
};


/**
 * Append a child DOM Object to root object DOM
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.IdfTreeNode.prototype.appendChildObject = function (child, domObj)
{
  let el = Client.eleMap[this.contentBoxConf.id];
  el.appendChildObject(child, domObj);
  el.elements.push(child);
  child.parent = el;
};


/**
 * Called by a new child, we need to check the expansion icon
 * @param {Client.IdfTreeNode} child - child element that requested the insertion
 */
Client.IdfTreeNode.prototype.appendChildTreeNode = function (child)
{
  // Show or hide the expansion icon
  this.showExpansionIcon();
};


/**
 * Show or hide the expansion icon
 */
Client.IdfTreeNode.prototype.showExpansionIcon = function ()
{
  let sh = this.elements?.length > 0 || Client.mainFrame.isEditing();
  //
  // On IDF i must show the expansion icon if i have children or i've not been expanded before
  if (Client.mainFrame.isIDF)
    sh = sh || !this.alreadyExpanded;
  //
  let el = Client.eleMap[this.collapseButtonConf.id];
  el.updateElement({visible: sh});
  //
  el = Client.eleMap[this.spacerButtonConf.id];
  el.updateElement({visible: !sh});
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfTreeNode.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  if (!this.parentTree.enabled)
    return events;
  //
  switch (event.id) {
    case "onClick":
      // On Mobile expand when clicking the header
      if (Client.mainFrame.idfMobile && (event.obj === this.headerContainerConf.id || event.obj === this.nodeLabel.id))
        event.obj = this.collapseButtonConf.id;
      //
      if (event.obj === this.collapseButtonConf.id)
        events.push(...this.handleCollapseButtonClick(event));
      //
      if (event.obj === this.nodeLabel.id)
        events.push(...this.handleLabelClick(event));
      break;

    case "chgProp":
      if (event.obj === this.checkConf.id)
        events.push(...this.handleCheckChange(event));
      break;

    case "onContextmenu":
      events.push(...this.handleContextMenu(event));
      break;
  }
  //
  return events;
};


/**
 * Handle click on collapse button
 * @param {Object} event
 */
Client.IdfTreeNode.prototype.handleCollapseButtonClick = function (event)
{
  let events = [];
  //
  // On IDF : If I'm expanded I can collapse, if I'm collapsed I can expand if I've no children and no previous expansion (so maybe I have children, but the server
  // hasn't said it) or if I have children
  let doExpand = !Client.mainFrame.isIDF || this.expanded || (!this.elements?.length && !this.alreadyExpanded) || this.elements?.length;
  if (doExpand) {
    // If i was not already expanded i don't know if i've children AND if i need to expand..
    // In this case i skip the expansion but send the event to the server. The server responds with
    // the children AND expansion = true
    if (!(Client.mainFrame.isIDF && !this.alreadyExpanded && !this.elements?.length))
      this.updateElement({expanded: !this.expanded});
  }
  //
  this.alreadyExpanded = true;
  //
  if (this.parentTree.activateOnExpand) {
    this.parentTree.setSelectedNode(this.id, true);
    //
    // On IDF is the server that launches the activation
    if (!Client.mainFrame.isIDF)
      events.push({
        id: "onActivateNode",
        obj: this.id
      });
  }
  //
  // Send expand event
  if (Client.mainFrame.isIDF) {
    if (doExpand)
      events.push({
        id: "trnexp",
        def: this.parentTree.expandEventDef,
        content: {
          oid: this.id
        }
      });
  }
  else
    events.push({
      obj: this.id,
      id: "onExpandNode",
      content: {
        expanded: this.expanded
      }
    });
  //
  return events;
};


/**
 * Handle click on label
 * @param {Object} event
 */
Client.IdfTreeNode.prototype.handleLabelClick = function (event)
{
  let events = [];
  //
  // We have already the node, no need to cycle the list
  this.parentTree.setSelectedNode(this.id, true);
  //
  if (Client.mainFrame.isIDF)
    events.push({
      id: "clk",
      def: this.parentTree.clickEventDef,
      content: {
        oid: this.id
      }
    });
  else {
    events.push({
      obj: this.id,
      id: "onActivateNode"
    });
  }
  //
  return events;
};


/**
 * Handle change of check
 * @param {Object} event
 */
Client.IdfTreeNode.prototype.handleCheckChange = function (event)
{
  let events = [];
  //
  if (Client.mainFrame.isIDF)
    events.push({
      obj: this.id,
      def: this.parentTree.checkEventDef,
      id: "chg",
      content: {
        oid: this.id,
        obn: "check",
        par1: event.content.value ? "on" : ""
      }
    });
  else {
    event.obj = this.id;
    event.content.name = "selected";
    events.push(event);
    //
    events.push({
      obj: this.id,
      id: "onChangeSelection",
      content: {
        selected: event.content.value
      }
    });
  }
  //
  return events;
};


Client.IdfTreeNode.prototype.handleContextMenu = function (event)
{
  let events = [];
  //
  if (!this.parentTree.popupMenu)
    return events;
  //
  // If it's already being managed by one of the child nodes I do nothing
  if (event.content.srcEvent.justHandled)
    return events;
  //
  event.content.srcEvent.justHandled = true;
  if (Client.mainFrame.isIDF)
    events.push({
      id: "rclk",
      def: this.parentTree.clickEventDef,
      content: {
        oid: this.id,
        par1: this.parentTree.popupMenu
      }
    });
  //
  return events;
};


Object.defineProperty(Client.IdfTreeNode.prototype, "parentTree", {
  get: function () {
    if (this.parent instanceof Client.IdfTree)
      return this.parent;
    if (this.parent instanceof Client.IdfTreeNode)
      return this.parent.parentTree;
  }
});


/**
 * Create view/element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfTreeNode.createConfigFromXml = function (xml)
{
  let config = {};
  //
  if (xml.childNodes && xml.childNodes.length > 0) {
    config.childrenNodes = [];
    //
    for (let j = 0; j < xml.childNodes.length; j++) {
      let nodeConfig = Client.Widget.createConfigFromXml(xml.childNodes[j]);
      if (!nodeConfig)
        continue;
      //
      config.childrenNodes.push(nodeConfig);
    }
  }
  //
  return config;
};


Client.IdfTreeNode.prototype.resetCache = function ()
{
  this.elements?.slice().forEach(tn => this.removeChild(tn));
};

Client.IdfTreeNode.prototype.getPopupTarget = function ()
{
  return Client.eleMap[this.nodeLabel.id].getRootObject();
};

Client.IdfTreeNode.prototype.isDraggable = function (element)
{
  // If the tree has the old drag&drop use that, it must win
  return this.parentTree.canDrag && this.parentTree.enabled && !this.parentTree.dragDrop;
};

Client.IdfTreeNode.prototype.acceptsDrop = function (widget)
{
  // If the tree has the old drag&drop use that, it must win
  return this.parentTree.canDrop && this.parentTree.enabled && !this.parentTree.dragDrop;
};

Client.IdfTreeNode.prototype.getTransformOperationTargetObj = function (operation, element)
{
  return Client.eleMap[this.nodeLabel.id].getRootObject();
};


/*
 * On mobile: Collapse all expanded nodes, deep-first
 */
Client.IdfTreeNode.prototype.collapseBranch = function () 
{
  this.elements.forEach(tn => tn.collapseBranch());
  this.setExpanded(false);
};

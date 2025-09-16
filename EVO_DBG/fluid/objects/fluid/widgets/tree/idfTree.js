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
Client.IdfTree = function (widget, parent, view)
{
  // Set the defaults
  widget = Object.assign({
    vertical: true,
    dragDrop: false,
    activateOnExpand: true,
    enableMultipleSelection: false,
    activeMultipleSelection: false,
    //
    // Set default events definition
    clickEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    expandEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    checkEventDef: Client.IdfMessagesPump?.eventTypes.DEFERRED,
    expandAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("tree")
  }, widget);
  //
  Client.IdfFrame.call(this, widget, parent, view);
};


// Make Client.IdfTree extend Client.IdfFrame
Client.IdfTree.prototype = new Client.IdfFrame();

Client.IdfTree.getRequirements = Client.IdfFrame.getRequirements;

Client.IdfTree.transPropMap = Object.assign({}, Client.IdfFrame.transPropMap, {
  mul: "enableMultipleSelection",
  aoe: "activateOnExpand",
  cms: "popupMenu",
  sel: "selectedNode",
  act: "activeMultipleSelection",
  ded: "dragDrop",
  xpc: "expandEventDef",
  chc: "checkEventDef",
  exa: "expandAnimationDef"
});


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfTree.convertPropValues = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.convertPropValues(props);
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfTree.transPropMap.mul:
      case Client.IdfTree.transPropMap.aoe:
      case Client.IdfTree.transPropMap.act:
      case Client.IdfTree.transPropMap.ded:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Create elements configuration
 * @@param {Object} widget
 */
Client.IdfTree.prototype.createElementsConfig = function (widget)
{
  Client.IdfFrame.prototype.createElementsConfig.call(this, widget);
  //
  // Create content container configuration
  if (Client.mainFrame.idfMobile) {
    this.treeContainerConf = this.createElementConfig({c: "AltContainer", className: "tree-content-main-list", selectedPage: 0});
    this.treeContainerConf.animations = [{trigger: "change", type: "slide", easing: "ease", duration: 350, delay: 0, from: "left"}];
    //
    // Create the first level container
    this.levelContainersConf = [];
    this.levelContainersConf.push(this.createElementConfig({c: "IonList", className: "tree-content-main-list", noLines: false}));
    this.treeContainerConf.children.push(this.levelContainersConf[0]);
  }
  else
    this.treeContainerConf = this.createElementConfig({c: "IonList", className: "tree-content-main-list", noLines: true, events: ["onDragstart", "onDragenter", "onDragover", "onDragleave", "onDragend", "onDrop"]});
  //
  this.contentContainerConf.children.push(this.treeContainerConf);
};


Client.IdfTree.prototype.createToolbarConfig = function ()
{
  Client.IdfFrame.prototype.createToolbarConfig.call(this);
  //
  if (Client.mainFrame.idfMobile) {
    // create the backbutton for the tree
    this.backTreeButtonConf = this.createElementConfig({c: "IonButton", icon: "arrow-back", className: "generic-btn frame-toolbar-btn tree-back-btn", events: ["onClick"], visible: false});
    this.toolbarConf.children.splice(1, 0, this.backTreeButtonConf);
  }
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfTree.prototype.getRootObject = function (el)
{
  if (this.moving)
    return Client.IdfFrame.prototype.getRootObject.call(this, el);
  //
  let rootObject = Client.eleMap[Client.mainFrame.idfMobile ? this.levelContainersConf[0].id : this.treeContainerConf.id];
  return el ? rootObject : rootObject.domObj;
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfTree.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.prototype.updateElement.call(this, props);
  //
  for (let p in props) {
    let v = props[p];
    switch (p) {
      case "popupMenu":
        this.popupMenu = v;
        break;

      case "enableMultipleSelection":
        this.setEnableMultipleSelection(v);
        break;

      case "activeMultipleSelection":
        this.setActiveMultipleSelection(v);
        break;

      case "activateOnExpand":
        this.activateOnExpand = v;
        break;

      case "selectedNode":
        this.setSelectedNode(v);
        break;

      case "dragDrop":
        this.setDragDrop(v);
        break;

      case "enabled":
        this.setEnabled(v);
        break;
    }
  }
  //
  if (props.updateToolbar)
    this.updateToolbar();
};


Client.IdfTree.prototype.setEnableMultipleSelection = function (value)
{
  this.enableMultipleSelection = value;
  let el = Client.eleMap[this.treeContainerConf.id];
  Client.Widget.updateElementClassName(el, "enable-selection", !this.enableMultipleSelection);
};


Client.IdfTree.prototype.setActiveMultipleSelection = function (value)
{
  this.activeMultipleSelection = value;
  this.checkEventDef = this.activeMultipleSelection ? Client.IdfMessagesPump.eventTypes.ACTIVE : Client.IdfMessagesPump.eventTypes.DEFERRED;
};

/**
 * This method colud be called by the server (recursive : true - we need to find the node and set its class)
 * or the client (recursive: false - the node was clicked by the user, so it will have its class already set, we need only to send the message to the server)
 *
 * @param {Client.IdfTreeNode} value - selected node
 * @param {bool} notify - send the selection to the server
 */
Client.IdfTree.prototype.setSelectedNode = function (value, notify)
{
  if (this.selectedNode === value)
    return;
  //
  // Clear the current selection
  Client.eleMap[this.selectedNode]?.setSelectedNode(false);
  //
  this.selectedNode = value;
  //
  Client.eleMap[this.selectedNode]?.setSelectedNode(true);
  //
  if (notify) {
    // IDF handles the selection server-side on the click handler
    if (!Client.mainFrame.isIDF)
      Client.mainFrame.sendEvents([{obj: this.id, id: "chgProp", content: {name: "selectedNode", value: this.selectedNode, clid: Client.id}}]);
  }
};


Client.IdfTree.prototype.setDragDrop = function (value)
{
  this.dragDrop = value;
  //
  if (!this.realizing)
    this.elements.forEach(tn => tn.setDraggable(this.dragDrop && this.canDrag !== false, true));
};


Client.IdfTree.prototype.setEnabled = function (value)
{
  if (!this.realizing)
    this.elements.forEach(tn => tn.setEnabled(this.enabled, true));
};


/**
 * Get container at "lvl" level
 * @param {Integer} lvl
 */
Client.IdfTree.prototype.getLevelContainer = function (lvl)
{
  if (!this.levelContainersConf)
    return;
  //
  let level = lvl - 1;
  if (level < 0)
    level = 0;
  if (level >= this.levelContainersConf.length) {
    // Create the containers if needed
    let treeContainer = Client.eleMap[this.treeContainerConf.id];
    while (level >= this.levelContainersConf.length) {
      this.levelContainersConf.push(this.createElementConfig({c: "Container", className: "tree-content-lvl", visible: false}));
      treeContainer.elements.push(this.view.createElement(this.levelContainersConf[this.levelContainersConf.length - 1], treeContainer, this.view));
    }
  }
  //
  return Client.eleMap[this.levelContainersConf[level].id];
};


/**
 * Move the altcontainer to the selected level
 * @param {Integer} lvl
 */
Client.IdfTree.prototype.navigateToLevel = function (lvl)
{
  let el = Client.eleMap[this.treeContainerConf.id];
  el.updateElement({selectedPage: lvl});
  //
  // Show/Hide the backbutton
  let el2 = Client.eleMap[this.backTreeButtonConf.id];
  el2.updateElement({visible: el.selectedPage !== 0});
  //
  this.updateToolbar();
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfTree.prototype.onEvent = function (event)
{
  let events = Client.IdfFrame.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      if (this.backTreeButtonConf && event.obj === this.backTreeButtonConf.id && this.expandedNode) {
        // Click on the back button, collapse the node and retard the hiding of the child (to not interfere with the animation)
        let node = Client.eleMap[this.expandedNode];
        node.updateElement({expanded: false, retarded: true});
        //
        // Send expand event
        if (Client.mainFrame.isIDF)
          events.push({
            id: "trnexp",
            def: this.expandEventDef,
            content: {
              oid: this.expandedNode
            }
          });
        else
          events.push({
            obj: this.expandedNode,
            id: "onExpandNode",
            content: {
              expanded: false
            }
          });
        //
        delete this.expandedNode;
      }
      break;

    case "onDragstart":
      this.handleDragStart(event);
      break;

    case "onDragenter":
      this.handleDragEnter(event);
      break;

    case "onDragover":
      this.handleDragOver(event);
      break;

    case "onDragleave":
      this.handleDragLeave(event);
      break;

    case "onDrop":
      events.push(...this.handleDrop(event));
      break;
  }
  //
  return events;
};


/**
 * Get the droppable node's div referred a target object
 * @param {Object} target
 */
Client.IdfTree.isDroppableNode = function (target)
{
  return target.classList.contains("treenode-header-label");
};


Client.IdfTree.prototype.handleDragStart = function (event)
{
  // Set the ID of the dragged object
  let srcEvent = event.content.srcEvent;
  let draggedNode = Client.eleMap[srcEvent.target.id].parentWidget;
  srcEvent.dataTransfer.setData("text", draggedNode.id);
  srcEvent.dataTransfer.effectAllowed = "copy";
};


Client.IdfTree.prototype.handleDragEnter = function (event)
{
  let srcEvent = event.content.srcEvent;
  if (!Client.IdfTree.isDroppableNode(srcEvent.target))
    return;
  //
  // Enable the drag
  srcEvent.preventDefault();
  //
  // Set the class to hilight the target
  srcEvent.target.classList.add("tree-drop-hover");
  //
  // Change the cursor
  srcEvent.dataTransfer.dropEffect = "copy";
};


Client.IdfTree.prototype.handleDragOver = function (event)
{
  let srcEvent = event.content.srcEvent;
  if (!Client.IdfTree.isDroppableNode(srcEvent.target))
    return;
  //
  // Change the cursor
  srcEvent.preventDefault();
  srcEvent.dataTransfer.dropEffect = "copy";
};


Client.IdfTree.prototype.handleDragLeave = function (event)
{
  // Clear all the drag effect classes
  let srcEvent = event.content.srcEvent;
  srcEvent.target.classList.remove("tree-drop-hover");
};


Client.IdfTree.prototype.handleDrop = function (event)
{
  let srcEvent = event.content.srcEvent;
  let draggedNode = Client.eleMap[srcEvent.dataTransfer.getData("text")];
  let droppedNode = Client.eleMap[srcEvent.target.id].parentWidget;
  //
  // Clear all the drop effect classes
  srcEvent.target.classList.remove("tree-drop-hover");
  //
  // Now the event data
  let events = [];
  if (Client.mainFrame.isIDF)
    events.push({
      id: "drp",
      def: Client.IdfMessagesPump?.eventTypes.ACTIVE,
      content: {
        oid: droppedNode.id,
        obn: draggedNode.id
      }
    });
  else
    events.push({
      id: "onDrop",
      obj: this.id,
      content: {
        dragId: draggedNode.id,
        dropId: droppedNode.id
      }
    });
  //
  return events;
};


Client.IdfTree.prototype.resetCache = function ()
{
  for (let i = 0; i < this.elements.length; i++) {
    let chNode = this.elements[i];
    this.removeChild(chNode);
    i--;
  }
};


/**
 * Update toolbar
 */
Client.IdfTree.prototype.updateToolbar = function ()
{
  Client.IdfFrame.prototype.updateToolbar.call(this);
  //
  if (!Client.mainFrame.idfMobile)
    return;
  //
  // Mobile setting
  let caption = this.caption || "";
  if (this.expandedNode) {
    let node = Client.eleMap[this.expandedNode];
    caption = node.expanded ? node.caption : caption;
  }
  //
  // Set caption on caption element
  let captionEl = Client.eleMap[this.captionConf.id];
  captionEl.updateElement({innerText: caption});
  //
  // Update the global menu/back button
  this.parentIdfView?.checkMobileButtons();
};


/**
 * Get click detail
 * @param {Object} event
 * @param {Widget} srcWidget
 */
Client.IdfTree.prototype.getClickDetail = function (event, srcWidget)
{
  let detail = Client.IdfFrame.prototype.getClickDetail.call(this, event, srcWidget);
  //
  let node = -1;
  if (srcWidget instanceof Client.IdfTreeNode)
    node = srcWidget.id;
  //
  if (Client.mainFrame.isIDF)
    detail.par4 = node;
  else
    detail.node = node;
  //
  return detail;
};

/*
 * A tree doesn't accept the generic Drop on himself, only on its nodes..
 */
Client.IdfTree.prototype.acceptsDrop = function (element)
{
  return false;
};


/*
 * On mobile: Collapse all expanded nodes, deep-first
 */
Client.IdfTree.prototype.resetTree = function ()
{
  this.elements.forEach(tn => tn.collapseBranch());
};

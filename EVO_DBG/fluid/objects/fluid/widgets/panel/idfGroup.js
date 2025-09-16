/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A group of panel fields
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfGroup = function (widget, parent, view)
{
  // Add this group to panel groups array
  parent.addGroup(this);
  //
  this.listContainersConf = [];
  let inList = true;
  //
  // Get group's fields from parent panel
  this.fields = [];
  for (let i = 0; i < parent.fields.length; i++) {
    let field = parent.fields[i];
    if (field.groupId === widget.id) {
      field.group = this;
      this.fields.push(field);
      //
      inList = inList && field.isInList();
    }
  }
  //
  // Maybe the server doesn't send the group dimensions, we can calculate them by using the fields coordinates
  // Normally the server SENDS the dimensions, but if the programmer has used runtime construction it can have forgot to set the groups dimensions.
  // That is a BUG and an ERROR by the programmer, but since RD3 was resilient to it (auto-calculating the dimensions) Fluid must do the same :(
  if (widget.formTop === undefined && widget.formLeft === undefined && Client.mainFrame.isIDF) {
    // Needed by the parent.getFieldsRect
    this.parent = parent;
    //
    let groupTop = 0;
    let groupBottom = 0;
    let groupLeft = 0;
    let groupRight = 0;
    let children = parent.getFieldsRect(true, this);
    if (children.length !== 0) {
      // The children are ordered by default from top, so we can use that to know the top and the bottom
      groupTop = children[0].rect.top - (widget.formHeaderPosition !== Client.IdfGroup.headerPositions.NONE ? 15 : 0);
      groupBottom = children[children.length - 1].rect.bottom;
      //
      // now sort by left
      children.sort((a, b) => a.rect.left - b.rect.left);
      groupLeft = children[0].rect.left;
      //
      // Sort by right
      children.sort((a, b) => b.rect.right - a.rect.right);
      groupRight = children[0].rect.right;
    }
    //
    widget.formLeft = groupLeft;
    widget.formTop = groupTop;
    widget.formWidth = groupRight - groupLeft;
    widget.formHeight = groupBottom - groupTop;
  }
  //
  // Set default values
  widget = Object.assign({
    listHeaderPosition: Client.IdfGroup.headerPositions.INNER,
    formHeaderPosition: Client.mainFrame.isIDF ? Client.IdfGroup.headerPositions.INNER : Client.IdfGroup.headerPositions.OUTER,
    inList,
    enabled: true,
    visible: true,
    collapsible: !Client.mainFrame.isIDF,
    collapsed: false,
    pageIndex: 0,
    collapseAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("group")
  }, widget);
  //
  if (!Client.mainFrame.isIDF && typeof widget.listWidth === "string") {
    if (widget.listWidth.indexOf("%") > 0) {
      widget.listWidthPerc = parseInt(widget.listWidth.replace("%", ""));
      delete widget.listWidth;
    }
    else
      widget.listWidth = parseInt(widget.listWidth);
  }
  //
  // Set original dimensions and position
  this.orgListWidth = widget.listWidth;
  this.orgListHeight = widget.listHeight;
  this.orgListLeft = widget.listLeft;
  this.orgListTop = widget.listTop;
  this.orgFormWidth = widget.formWidth;
  this.orgFormHeight = widget.formHeight;
  this.orgFormLeft = widget.formLeft;
  this.orgFormTop = widget.formTop;
  //
  this.listHeaderColumnStyle = {};
  this.listColumnStyles = [];
  this.listAggregateColumnStyle = {};
  this.outListColumnStyle = {};
  this.formColumnStyle = {};
  this.listHeaderStyle = {};
  this.outListHeaderStyle = {};
  this.formHeaderStyle = {};
  //
  this.listHeaderCustomStyle = {};
  this.formHeaderCustomStyle = {};
  this.formCustomStyle = {};
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfGroup extend Client.Widget
Client.IdfGroup.prototype = new Client.Widget();


Client.IdfGroup.transPropMap = {
  flg: "flags",
  img: "image",
  lle: "listLeft",
  lto: "listTop",
  lwi: "listWidth",
  lhe: "listHeight",
  fle: "formLeft",
  fto: "formTop",
  fwi: "formWidth",
  fhe: "formHeight",
  pag: "pageIndex",
  lhp: "listHeaderPosition",
  fhp: "formHeaderPosition",
  hhe: "headerHeight",
  hwi: "headerWidth",
  inl: "inList",
  clp: "collapsible",
  col: "collapsed",
  mfl: "listMovedFields",
  mff: "formMovedFields",
  cla: "collapseAnimationDef"
};


Client.IdfGroup.headerPositions = {
  NONE: 1,
  BORDER: 2,
  OUTER: 3,
  INNER: 4
};

Client.IdfGroup.headerSize = 36;

/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfGroup.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfGroup.transPropMap.flg:
      case Client.IdfGroup.transPropMap.lwi:
      case Client.IdfGroup.transPropMap.lhe:
      case Client.IdfGroup.transPropMap.lle:
      case Client.IdfGroup.transPropMap.lto:
      case Client.IdfGroup.transPropMap.fwi:
      case Client.IdfGroup.transPropMap.fhe:
      case Client.IdfGroup.transPropMap.fle:
      case Client.IdfGroup.transPropMap.fto:
      case Client.IdfGroup.transPropMap.pag:
      case Client.IdfGroup.transPropMap.lhp:
      case Client.IdfGroup.transPropMap.fhp:
      case Client.IdfGroup.transPropMap.hhe:
      case Client.IdfGroup.transPropMap.hwi:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfGroup.transPropMap.inl:
      case Client.IdfGroup.transPropMap.clp:
      case Client.IdfGroup.transPropMap.col:
      case Client.IdfGroup.transPropMap.mfl:
      case Client.IdfGroup.transPropMap.mff:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Create elements configuration
 */
Client.IdfGroup.prototype.createElementsConfig = function ()
{
  // Each field has a "list" and a "form" configuration
  let config = {};
  //
  // 1) Create list container configuration
  if (this.isShown()) {
    config.list = this.createContainerConfig();
    config.aggregate = this.createAggregateContainerConfig();
  }
  //
  // 2) Create form container configuration
  if (this.isShown(true))
    config.form = this.createContainerConfig(true);
  //
  return config;
};


/**
 * Create elements configuration for list/form mode
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.createContainerConfig = function (form)
{
  let containerConf, headerConf, headerTextConf;
  //
  if (!form && this.isInList()) {
    // Create list container
    let offsetCol = this.parent.getHeaderOffset() ? " offset-col" : "";
    this.listContainerConf = this.createElementConfig({c: "IonCol", className: "panel-list-col panel-list-group" + offsetCol});
    //
    // Create list header row configuration
    let listHeaderConf = this.createElementConfig({c: "IonRow", className: "panel-list-group-header"});
    this.listContainerConf.children.push(listHeaderConf);
    //
    // Create list header column configuration
    let listHeaderColConf = this.createElementConfig({c: "IonCol", className: "panel-list-col"});
    listHeaderConf.children.push(listHeaderColConf);
    //
    // Create list header text configuration
    headerTextConf = this.createElementConfig({c: "IonText", type: "span"});
    listHeaderColConf.children.push(headerTextConf);
    //
    // Create list content row
    this.listContentConf = this.createElementConfig({c: "IonRow", className: "panel-list-group-content"});
    this.listContainerConf.children.push(this.listContentConf);
    //
    // Save elements ids
    this.listHeaderId = listHeaderConf.id;
    this.listHeaderColId = listHeaderColConf.id;
    this.listHeaderTextId = headerTextConf.id;
    this.listContentId = this.listContentConf.id;
    //
    containerConf = this.listContainerConf;
  }
  else {
    // Create container configuration with a collapse button and a text for header
    headerConf = this.createElementConfig({c: "Container", className: "panel-group-header", events: ["onClick"]});
    let collapseButtonConf = this.createElementConfig({c: "IonButton", className: "group-exp-icon"});
    headerTextConf = this.createElementConfig({c: "IonText", type: "span"});
    headerConf.children.push(collapseButtonConf);
    headerConf.children.push(headerTextConf);
    //
    containerConf = this.createElementConfig({c: "Container", className: "panel-group-content collapsible-container"});
    containerConf.animations = [{trigger: "animation", prop: "collapseElement", duration: (this.collapseAnimationDef.indexOf("none") === 0 ? 0 : 250)},
      {trigger: "animation", prop: "expandElement", duration: (this.collapseAnimationDef.indexOf("none") === 0 ? 0 : 250)}];
    //
    // Save elements ids
    if (form) {
      this.formHeaderId = headerConf.id;
      this.formCollapseId = collapseButtonConf.id;
      this.formHeaderTextId = headerTextConf.id;
      this.formContainerId = containerConf.id;
    }
    else {
      this.outListHeaderId = headerConf.id;
      this.outListCollapseId = collapseButtonConf.id;
      this.outListHeaderTextId = headerTextConf.id;
      this.outListContainerId = containerConf.id;
    }
  }
  //
  return {headerConf, containerConf};
};


/**
 * Create aggregate container configuration
 */
Client.IdfGroup.prototype.createAggregateContainerConfig = function ()
{
  if (!this.isInList())
    return;
  //
  this.aggregateContainerConf = this.createElementConfig({c: "IonCol", className: "panel-list-col panel-list-group"});
  //
  // Create aggregate container
  this.aggregateRowConf = this.createElementConfig({c: "IonRow", className: "panel-list-group-content"});
  this.aggregateContainerConf.children.push(this.aggregateRowConf);
  //
  this.aggregateRowId = this.aggregateRowConf.id;
  //
  return this.aggregateContainerConf;
};


/**
 * Create a column configuration that will be part of panel grid
 * @param {Integer} index
 */
Client.IdfGroup.prototype.createListConfig = function (index)
{
  if (!this.listColumnStyles[index]) {
    this.listColumnStyles[index] = Object.assign({}, this.listHeaderColumnStyle);
    this.listColumnStyles[index].height = "";
  }
  //
  // Create column configuration
  let offsetCol = this.parent.getListRowOffset() ? " offset-col" : "";
  let columnConf = this.createElementConfig({c: "IonCol", className: "panel-list-col panel-list-group" + offsetCol, style: this.listColumnStyles[index]});
  //
  // Create row configuration
  let rowConf = this.createElementConfig({c: "IonRow", className: "panel-list-group-content"});
  columnConf.children.push(rowConf);
  //
  // Save element configuration
  this.listContainersConf[index] = columnConf;
  //
  return this.listContainersConf[index];
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfGroup.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  let config = this.createElementsConfig();
  //
  let headerEl;
  let contentEl;
  //
  // Create list version of this group
  if (config.list) {
    // When a group is in list, it has a main container (an IonCol) having two children: header row and container row.
    // Instead, an out of list group doesn't own an IonCol (the main grid does) and so I have to explicitly create header and container
    let headerConf = config.list.headerConf;
    //
    // Create group elements and append them to parent (panel rootObject). Then they will be appended in the proper object
    if (headerConf) {
      headerEl = view.createElement(headerConf, parent, view);
      this.mainObjects.push(headerEl);
    }
    //
    contentEl = view.createElement(config.list.containerConf, parent, view);
    this.mainObjects.push(contentEl);
    //
    // Create aggregate container and append it to parent (panel rootObject). Then it will be appended in the proper object
    if (config.aggregate)
      this.mainObjects.push(view.createElement(config.aggregate, parent, view));
  }
  //
  // Create form version of this group
  if (config.form) {
    // Create group elements and append them to parent (panel rootObject). Then they will be appended in the proper object
    headerEl = view.createElement(config.form.headerConf, parent, view);
    this.mainObjects.push(headerEl);
    //
    contentEl = view.createElement(config.form.containerConf, parent, view);
    this.mainObjects.push(contentEl);
  }
};



/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfGroup.prototype.updateElement = function (props)
{
  props = props || {};
  //
  let calcLayout;
  let updateStructure;
  let updateHeader, updateClassName, updateImage, updateEnabled, applyVisualStyle;
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (!Client.mainFrame.isIDF && typeof props.listWidth === "string") {
    if (props.listWidth.indexOf("%") > 0) {
      props.listWidthPerc = parseInt(props.listWidth.replace("%", ""));
      delete props.listWidth;
    }
    else
      props.listWidth = parseInt(props.listWidth);
  }
  //
  if (props.flags !== undefined) {
    this.flags = props.flags;
    //
    let enabled = !!(this.flags & 0x01);
    if (enabled !== this.enabled)
      props.enabled = enabled;
    //
    let visible = !!(this.flags & 0x02);
    if (visible !== this.visible)
      props.visible = visible;
  }
  //
  if (props.enabled !== undefined) {
    this.enabled = props.enabled;
    updateEnabled = true;
  }
  //
  if (props.visible !== undefined) {
    this.visible = props.visible;
    updateStructure = true;
    //
    if (Client.mainFrame.isIDF && this.visible)
      applyVisualStyle = true;
  }
  //
  if (props.tooltip !== undefined)
    updateHeader = true;
  //
  if (props.collapsible !== undefined) {
    this.collapsible = props.collapsible;
    this.updateCollapsible();
  }
  //
  if (props.collapsed !== undefined) {
    this.collapsed = props.collapsed;
    //
    // Collapse or expand list container
    this.handleCollapse();
    //
    // Collapse or expand form container
    this.handleCollapse(true);
  }
  //
  if (props.inList !== undefined)
    this.inList = props.inList;
  //
  if (props.caption !== undefined)
    updateHeader = true;
  //
  if (props.listHeaderPosition !== undefined) {
    this.listHeaderPosition = props.listHeaderPosition;
    updateHeader = true;
  }
  //
  if (props.formHeaderPosition !== undefined) {
    this.formHeaderPosition = props.formHeaderPosition;
    updateHeader = true;
  }
  //
  if (props.headerWidth !== undefined)
    this.headerWidth = isNaN(props.headerWidth) ? undefined : props.headerWidth;
  //
  // Only for IDC. Treat it as headerHeight
  if (props.formHeaderHeight !== undefined) {
    props.headerHeight = props.formHeaderHeight;
    delete props.formHeaderHeight;
    delete this.formHeaderHeight;
  }
  //
  if (props.headerHeight !== undefined) {
    this.headerHeight = isNaN(props.headerHeight) ? undefined : props.headerHeight;
    updateHeader = true;
  }
  //
  if (props.listWidth !== undefined) {
    this.listWidth = isNaN(props.listWidth) ? undefined : props.listWidth;
    this.orgListWidth = this.listWidth;
    updateStructure = true;
    //
    if (!Client.mainFrame.isIDF) {
      delete this.listWidthPerc;
      delete this.orgListWidthPerc;
    }
  }
  //
  if (props.listWidthPerc !== undefined) {
    this.listWidthPerc = isNaN(props.listWidthPerc) ? undefined : props.listWidthPerc;
    this.orgListWidthPerc = this.listWidthPerc;
    updateStructure = true;
  }
  //
  if (props.listHeight !== undefined) {
    this.listHeight = isNaN(props.listHeight) ? undefined : props.listHeight;
    this.orgListHeight = this.listHeight;
    updateStructure = true;
  }
  //
  if (props.listLeft !== undefined) {
    this.listLeft = isNaN(props.listLeft) ? undefined : props.listLeft;
    this.orgListLeft = this.listLeft;
    updateStructure = true;
  }
  //
  if (props.listTop !== undefined) {
    this.listTop = isNaN(props.listTop) ? undefined : props.listTop;
    this.orgListTop = this.listTop;
    updateStructure = true;
  }
  //
  if (props.formWidth !== undefined) {
    this.formWidth = isNaN(props.formWidth) ? undefined : props.formWidth;
    this.orgFormWidth = this.formWidth;
    updateStructure = true;
  }
  //
  if (props.formHeight !== undefined) {
    this.formHeight = isNaN(props.formHeight) ? undefined : props.formHeight;
    this.orgFormHeight = this.formHeight;
    updateStructure = true;
  }
  //
  if (props.formLeft !== undefined) {
    this.formLeft = isNaN(props.formLeft) ? undefined : props.formLeft;
    this.orgFormLeft = this.formLeft;
    updateStructure = true;
  }
  //
  if (props.formRight !== undefined) {
    this.formRight = isNaN(props.formRight) ? undefined : props.formRight;
    updateStructure = true;
  }
  //
  if (props.formBottom !== undefined) {
    this.formBottom = isNaN(props.formBottom) ? undefined : props.formBottom;
    updateStructure = true;
  }
  //
  if (props.formTop !== undefined) {
    this.formTop = isNaN(props.formTop) ? undefined : props.formTop;
    this.orgFormTop = this.formTop;
    updateStructure = true;
  }
  //
  if (props.className !== undefined) {
    this.oldClassName = this.className;
    this.className = props.className;
    //
    // The className can have a responsive grid, in that case we must extract it
    let cls = Client.Widget.extractGridClasses(this.className);
    this.className = cls.className;
    this.gridClass = cls.gridClass;
    //
    updateClassName = true;
  }
  //
  if (props.image !== undefined) {
    this.image = props.image;
    updateImage = true;
  }
  //
  if (props.formStyle !== undefined) {
    this.formStyle = props.formStyle;
    Client.Widget.updateCustomStyle({styleToUpdate: this.formCustomStyle, newStyle: props.formStyle});
    calcLayout = true;
  }
  //
  if (props.listHeaderStyle !== undefined) {
    Client.Widget.updateCustomStyle({styleToUpdate: this.listHeaderCustomStyle, newStyle: props.listHeaderStyle});
    calcLayout = true;
    updateHeader = true;
  }
  //
  if (props.formHeaderStyle !== undefined) {
    Client.Widget.updateCustomStyle({styleToUpdate: this.formHeaderCustomStyle, newStyle: props.formHeaderStyle});
    calcLayout = true;
    updateHeader = true;
  }
  //
  // If I have to update parent panel structure and layout, do it now
  if (!this.realizing)
    this.parent.updateObjects({structure: updateStructure, calcLayout: calcLayout || updateStructure});
  //
  if (updateEnabled) {
    // Update fields controls
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].updateControls();
      this.fields[i].applyVisualStyle();
    }
  }
  //
  // Apply visual style if needed
  if (applyVisualStyle)
    this.applyVisualStyle();
  //
  // Update header for both list and form
  if (updateHeader) {
    this.updateHeader();
    this.updateHeader(true);
  }
  //
  // Update className for both list and form
  if (updateClassName) {
    this.updateClassName();
    this.updateClassName(true);
  }
  //
  // Update image for both list and form
  if (updateImage) {
    this.updateImage();
    this.updateImage(true);
  }
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfGroup.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      if ([this.outListHeaderId, this.formHeaderId].includes(event.obj) && this.collapsible) {
        this.updateElement({collapsed: !this.collapsed});
        //
        if (this.collapsed)
          this.parent.focus();
        else
          this.focus();
        //
        // Send collapse event
        if (Client.mainFrame.isIDF)
          events.push({
            id: "grpcol",
            def: Client.IdfMessagesPump.eventTypes.ACTIVE,
            content: {
              oid: this.id,
              obn: this.collapsed ? "col" : "exp",
              xck: event.content.offsetX,
              yck: event.content.offsetY
            }
          });
        else
          events.push({
            id: "chgProp",
            obj: this.id,
            content: {
              name: "collapsed",
              value: this.collapsed,
              clid: Client.id
            }
          });
      }
      //
      break;
  }
  //
  return events;
};


/**
 * Return true if this group contains just in list fields
 */
Client.IdfGroup.prototype.isInList = function ()
{
  return this.inList;
};


/**
 * Calculate layout
 */
Client.IdfGroup.prototype.calcLayout = function ()
{
  // Calculate layout for list mode
  if (this.isShown() && this.parent.getListFieldColumn(this.id)) {
    if (!this.isInList())
      this.parent.setEdgeColumns(null, this);
    //
    this.calcListFormLayout();
  }
  //
  // Calculate layout for form mode
  if (this.isShown(true) && this.parent.getFormFieldColumn(this.id)) {
    this.parent.setEdgeColumns(true, this);
    this.calcListFormLayout(true);
  }
};


/**
 * Calculate layout for list or form mode
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.calcListFormLayout = function (form)
{
  let groupColumn;
  let groupColStyle = {};
  //
  let xs = this.canAdaptWidth(form) ? "" : "auto";
  //
  let width = form ? this.formWidth : this.listWidth;
  let height = form ? this.formHeight : this.listHeight;
  let left = form ? this.formLeft : this.listLeft;
  let top = form ? this.formTop : this.listTop;
  //
  if (form)
    height = height + (this.formBorders?.top || 0) + (this.formBorders?.bottom || 0);
  //
  // Use flex to handle width resize
  if (!form && this.isInList()) {
    let adaptableFieldsCount = this.fields.filter(f => f.canAdaptWidth()).length;
    //
    if (!Client.mainFrame.isIDF) {
      groupColStyle.flexBasis = this.listWidthPerc ? this.listWidthPerc + "%" : (this.listWidth !== undefined ? this.listWidth + "px" : "auto");
      groupColStyle.flexGrow = this.parent.getChildFlexGrow(this);
      groupColStyle.flexShrink = this.fields.filter(f => f.listResizeWidth === Client.IdfField.resizeModes.STRETCH).length;
    }
    else {
      let groupWidth = this.getWidth();
      groupColStyle.flexBasis = groupWidth.total + "px";
      groupColStyle.minWidth = groupWidth.fixed + "px";
      //
      groupColStyle.flexGrow = adaptableFieldsCount;
      groupColStyle.flexShrink = adaptableFieldsCount;
    }
    //
    // Assign fixed height to group
    groupColStyle.height = this.parent.getHeaderHeight() + "px";
  }
  else {
    groupColStyle.padding = "0px";
    //
    // Get field parent column
    groupColumn = form ? this.parent.getFormFieldColumn(this.id) : this.parent.getListFieldColumn(this.id);
    //
    if (form && !Client.mainFrame.isIDF) {
      groupColStyle.marginLeft = (this.formLeft || "0") + "px";
      groupColStyle.marginRight = (this.formRight || "0") + "px";
      groupColStyle.marginTop = (this.formTop || "0") + "px";
      groupColStyle.marginBottom = (this.formBottom || "0") + "px";
    }
    else {
      // Calculate margin left
      let fieldColumnLeft = groupColumn.rect.left || 0;
      let deltaLeft = left - fieldColumnLeft;
      groupColStyle.marginLeft = groupColumn.isMostLeft ? left + "px" : deltaLeft + "px";
      //
      // Calculate margin right
      let deltaRight = groupColumn.isMostRight ? (this.parent.getContainerWidth(form) - width - left) : groupColumn.rect.deltaRight;
      deltaRight = deltaRight < 0 ? 0 : deltaRight;
      groupColStyle.marginRight = deltaRight + "px";
      //
      // Calculate margin top
      let fieldColumnTop = groupColumn.rect.top || 0;
      let deltaTop = top - fieldColumnTop;
      groupColStyle.marginTop = groupColumn.isMostTop ? top + "px" : deltaTop + "px";
      //
      // Calculate margin bottom
      let deltaBottom = groupColumn.isMostBottom ? (this.parent.getContainerHeight(form) - height - top) : groupColumn.rect.deltaBottom;
      deltaBottom = deltaBottom < 0 ? 0 : deltaBottom;
      groupColStyle.marginBottom = deltaBottom + "px";
    }
  }
  //
  // Update in list group
  if (!form && this.isInList()) {
    // Update header column style
    let headerContainer = Client.eleMap[this.listContainerConf.id];
    Client.Widget.updateStyle(headerContainer, this.listHeaderColumnStyle, groupColStyle);
    Client.Widget.updateObject(headerContainer, {xs});
    //
    // Just header has a specific height
    groupColStyle.height = "";
    //
    // Update aggregate column style
    let aggregateContainer = Client.eleMap[this.aggregateContainerConf.id];
    Client.Widget.updateStyle(aggregateContainer, this.listAggregateColumnStyle, groupColStyle);
    Client.Widget.updateObject(aggregateContainer, {xs});
    //
    // Update data columns style
    for (let i = 0; i < this.listContainersConf.length; i++) {
      let el = Client.eleMap[this.listContainersConf[i]?.id];
      //
      if (!el)
        continue;
      //
      this.listColumnStyles[i] = this.listColumnStyles[i] || {};
      //
      Client.Widget.updateStyle(el, this.listColumnStyles[i], groupColStyle);
      Client.Widget.updateObject(el, {xs});
    }
  }
  else { // Otherwise update out list group
    let el = Client.eleMap[groupColumn.conf.id];
    //
    let styleToUpdate = form ? this.formColumnStyle : this.outListColumnStyle;
    Client.Widget.updateStyle(el, styleToUpdate, groupColStyle);
    Client.Widget.updateStyle(el, styleToUpdate, this.formCustomStyle);
    Client.Widget.updateElementClassName(el, "panel-group");
    //
    this.updateImage(form);
  }
};


/**
 * Append field dom objects to their own column
 */
Client.IdfGroup.prototype.place = function ()
{
  if (this.isShown() && this.parent.getListFieldColumn(this.id)) {
    this.placeListForm();
    //
    // If group is in list also place its aggregate container
    if (this.isInList())
      this.placeListForm({aggregate: true});
  }
  //
  if (this.isShown(true) && this.parent.getFormFieldColumn(this.id))
    this.placeListForm({form: true});
};


/**
 * Append list/form field dom object to its own column
 * @param {Object} options
 *                        - form
 *                        - aggregate: true if I have to place aggregate container
 */
Client.IdfGroup.prototype.placeListForm = function (options)
{
  options = options || {};
  let form = options.form;
  let aggregate = options.aggregate;
  //
  let parentColumn;
  if (!form && this.isInList()) {
    // Look for the last in list field before my first field. That is the position inside panel grid header where to place group container
    let myFirstField = this.getFirstInListField();
    //
    let found;
    let nextInListDomObj;
    //
    for (let i = 0; i < this.parent.fields.length; i++) {
      let field = this.parent.fields[i];
      //
      if (found && field.isInList() && !field.group) {
        let el = Client.eleMap[aggregate ? field.aggregateContainerId : field.listContainerId];
        nextInListDomObj = el.getRootObject();
        break;
      }
      //
      if (field.id === myFirstField?.id)
        found = true;
    }
    //
    // Get panel grid header
    let gridHeader = Client.eleMap[this.parent.getListFieldColumn(this.id, aggregate)?.conf?.id];
    if (gridHeader) {
      let gridHeaderDomObj = gridHeader.getRootObject();
      //
      // Get group container
      let groupEl = Client.eleMap[aggregate ? this.aggregateContainerConf.id : this.listContainerConf.id];
      if (groupEl) {
        let groupDomObj = groupEl.getRootObject();
        //
        // If I found the next in list field, append group container after its container. Otherwise append group container as last row child
        gridHeaderDomObj.insertBefore(groupDomObj, nextInListDomObj);
        //
        let groupIndex = Array.prototype.findIndex.call(gridHeaderDomObj.childNodes, child => child.id === groupEl.id);
        groupIndex = groupIndex === -1 ? gridHeader.elements.length : groupIndex;
        //
        gridHeader.elements.splice(groupIndex, 0, groupEl);
        groupEl.parent = gridHeader;
      }
    }
  }
  else {
    // Get column where to put group header and container
    if (form) {
      parentColumn = this.parent.getFormFieldColumn(this.id);
      this.formParentColConf = parentColumn?.conf;
    }
    else {
      parentColumn = this.parent.getListFieldColumn(this.id);
      this.listParentColConf = parentColumn?.conf;
    }
    //
    let headerId = form ? this.formHeaderId : this.outListHeaderId;
    let contentId = form ? this.formContainerId : this.outListContainerId;
    //
    let groupCol = Client.eleMap[parentColumn.conf.id];
    let headerEl = Client.eleMap[headerId];
    let contentEl = Client.eleMap[contentId];
    //
    if (groupCol) {
      // A field belonging to a group appends its elements to group column.
      // But I want fields to be appended to group content, that is a group column child.
      // Thus I remove fields elements from group column and append them to group content
      if (contentEl) {
        for (let i = 0; i < groupCol.elements.length; i++) {
          // Remove field row from group column
          let row = groupCol.elements.splice(i--, 1)[0];
          //
          // Append it to group content
          contentEl.getRootObject().appendChild(row.getRootObject());
          contentEl.elements.push(row);
          row.parent = contentEl;
        }
      }
      //
      let groupRootObject = groupCol.getRootObject();
      //
      // Append header to group column
      if (headerEl) {
        groupRootObject.appendChild(headerEl.getRootObject());
        groupCol.elements.push(headerEl);
        headerEl.parent = groupCol;
      }
      //
      // Append content to group column
      if (contentEl) {
        groupRootObject.appendChild(contentEl.getRootObject());
        groupCol.elements.push(contentEl);
        contentEl.parent = groupCol;
      }
      //
      this.applyVisualStyle();
    }
  }
};


/**
 * Remove field dom objects from their parent column
 */
Client.IdfGroup.prototype.unplace = function ()
{
  if (this.isShown()) {
    this.unplaceListForm();
    //
    // If group is in list also unplace its aggregate container
    if (this.isInList())
      this.unplaceListForm({aggregate: true});
  }
  //
  if (this.isShown(true))
    this.unplaceListForm({form: true});
};


/**
 * Remove field dom object from its parent column
 * @param {Object} options
 *                        - form
 *                        - aggregate: true if I have to unplace aggregate container
 */
Client.IdfGroup.prototype.unplaceListForm = function (options)
{
  options = options || {};
  let form = options.form;
  let aggregate = options.aggregate;
  //
  let headerId, contentId;
  if (!form && this.isInList())
    contentId = aggregate ? this.aggregateContainerConf.id : this.listContainerConf.id;
  else {
    headerId = form ? this.formHeaderId : this.outListHeaderId;
    contentId = form ? this.formContainerId : this.outListContainerId;
  }
  //
  // Detach header (in case of in list fields, the header is the content, so an header object does not exists)
  let headerEl = Client.eleMap[headerId];
  if (headerEl) {
    let headerRootObject = headerEl.getRootObject();
    //
    // Remove header from dom
    headerRootObject?.remove();
    //
    // Remove header from parent elements
    let index = headerEl.parent.elements.findIndex(el => el.id === headerEl.id);
    if (index >= 0)
      headerEl.parent.elements.splice(index, 1);
  }
  //
  // Detach content
  let contentEl = Client.eleMap[contentId];
  //
  // A group in editing can be shown and have no objects (no fields)
  // in this case we can unplace nothing
  if (!contentEl)
    return;
  //
  let contentRootObject = contentEl.getRootObject();
  if (contentRootObject) {
    // Remove content from dom
    contentRootObject.remove();
    //
    // Clear the content root object, maybe we will place new elements in it later
    if (form)
      contentRootObject.innerHTML = "";
  }
  //
  // Remove content from parent elements
  index = contentEl.parent.elements.findIndex(el => el.id === contentEl.id);
  if (index >= 0)
    contentEl.parent.elements.splice(index, 1);
};


/**
 * Check if this group can apdapt its list/form width
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.canAdaptWidth = function (form)
{
  let canAdapt = false;
  for (let i = 0; i < this.fields.length; i++)
    canAdapt = canAdapt || this.fields[i].canAdaptWidth(form);
  //
  return canAdapt;
};


/**
 * Calculate group width as fields width sum
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.getWidth = function (form)
{
  let width = 0;
  let total = 0, fixed = 0;
  //
  for (let i = 0; i < this.fields.length; i++) {
    let field = this.fields[i];
    //
    let width = field.getRects({form, checkVisibility: true}).width;
    //
    if (!width)
      continue;
    //
    total += width;
    fixed += field.canAdaptWidth() ? Client.IdfField.minWidth : width;
  }
  //
  return {total, fixed};
};


/**
 * Apply visual style
 */
Client.IdfGroup.prototype.applyVisualStyle = function ()
{
  // I don't need to apply visual style while group is realizing. When parent panel will be realized,
  // it will apply visual style to itself and to its children (i.e. fields and groups)
  if (this.realizing)
    return;
  //
  // Get group and panel visual styles
  let vis = Client.IdfVisualStyle.getByIndex(this.getVisualStyle());
  let panelVis = Client.IdfVisualStyle.getByIndex(this.parent.getVisualStyle());
  //
  // Get group and panel background colors from visual styles
  let backColor = vis?.getPropertyValue(Client.IdfVisualStyle.transPropMap.col12);
  let panelBackColor = panelVis?.getPropertyValue(Client.IdfVisualStyle.transPropMap.col6);
  //
  let groupColumn = this.parent.getListFieldColumn(this.id);
  if (this.isShown() && (this.isInList() || groupColumn)) {
    // Set visual style on list or out of list group container
    let el = this.isInList() ? Client.eleMap[this.listContainerConf.id] : Client.eleMap[groupColumn.conf.id];
    this.addVisualStyleClasses(el, {objType: "group", list: this.isInList()});
    //
    // If list header position is BORDER and group background color is trasparent,
    // apply panel background color to avoid group top border to appear on header text
    if (this.listHeaderPosition === Client.IdfGroup.headerPositions.BORDER && backColor === "transparent" && !this.isInList())
      Client.Widget.updateStyle(Client.eleMap[this.outListHeaderId], this.outListHeaderStyle, {backgroundColor: panelBackColor});
  }
  //
  groupColumn = this.parent.getFormFieldColumn(this.id);
  if (this.isShown(true) && groupColumn) {
    // Set visual style on form group
    let el = Client.eleMap[groupColumn.conf.id];
    this.addVisualStyleClasses(el, {objType: "group", list: false});
    //
    let currentStyle = getComputedStyle(el.getRootObject());
    if (currentStyle)
      this.formBorders = {top: parseInt(currentStyle.borderTopWidth), bottom: parseInt(currentStyle.borderBottomWidth), left: parseInt(currentStyle.borderLeftWidth), right: parseInt(currentStyle.borderRightWidth)};
    //
    // If form header position is BORDER and group background color is trasparent,
    // apply panel background color to avoid group top border to appear on header text
    if (this.formHeaderPosition === Client.IdfGroup.headerPositions.BORDER && backColor === "transparent")
      Client.Widget.updateStyle(Client.eleMap[this.formHeaderId], this.formHeaderStyle, {backgroundColor: panelBackColor});
  }
};


/**
 * Get visual style
 */
Client.IdfGroup.prototype.getVisualStyle = function ()
{
  return this.visualStyle !== -1 ? this.visualStyle : this.parent.visualStyle;
};


/**
 * Update my header
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.updateHeader = function (form)
{
  // If I have to update header for a form/list group and parent panel has no form/list, do nothing
  if (!this.isShown(form))
    return;
  //
  let tooltip = Client.Widget.getHTMLTooltip(this.caption, this.tooltip);
  //
  // Update header text and tooltip
  let headerTextContainer;
  if (!form)
    headerTextContainer = this.isInList() ? Client.eleMap[this.listHeaderTextId] : Client.eleMap[this.outListHeaderTextId];
  else
    headerTextContainer = Client.eleMap[this.formHeaderTextId];
  //
  Client.Widget.updateObject(headerTextContainer, {innerHTML: Client.Widget.getHTMLForCaption(this.caption ?? ""), tooltip});
  //
  // Update header position
  let headerPosition = form ? this.formHeaderPosition : this.listHeaderPosition;
  let headerContainer;
  let headerStyle, headerCustomStyle;
  if (!form) {
    headerContainer = this.isInList() ? Client.eleMap[this.listHeaderId] : Client.eleMap[this.outListHeaderId];
    headerStyle = this.isInList() ? this.listHeaderStyle : this.outListHeaderStyle;
    //
    if (this.isInList())
      Client.Widget.updateStyle(Client.eleMap[this.listHeaderColId], {}, this.listHeaderCustomStyle);
  }
  else {
    headerContainer = Client.eleMap[this.formHeaderId];
    headerStyle = this.formHeaderStyle;
    headerCustomStyle = this.formHeaderCustomStyle;
  }
  //
  // Get header height
  let headerHeight = Math.max(headerContainer?.getRootObject()?.offsetHeight - 2, (this.headerHeight || 0));
  //
  let headerClass = "";
  //
  let style = {display: "", marginTop: "", height: "", minHeight: ""};
  switch (headerPosition) {
    case Client.IdfGroup.headerPositions.NONE:
      style.display = "none";
      break;

    case Client.IdfGroup.headerPositions.BORDER:
      style.marginTop = "-" + ((headerHeight / 2) + 1) + "px";
      headerClass = "header-border";
      break;

    case Client.IdfGroup.headerPositions.OUTER:
      style.marginTop = "-" + headerHeight + "px";
      headerClass = "header-outer";
      break;

    case Client.IdfGroup.headerPositions.INNER:
      headerClass = "header-inner";
      //
      style.height = headerHeight + "px";
      style.minHeight = headerHeight + "px";
      break;
  }
  //
  // In list groups don't handle neither header position nor header height
  if (!form && this.isInList()) {
    style.marginTop = "";
    style.height = "";
    style.minHeight = "";
    //
    // If all group fields' listHeader is hidden, group header has to act as a common header for all fields
    let noHeaderFields = this.fields.filter(f => !f.showListHeader);
    Client.Widget.updateElementClassName(headerContainer, "no-field-header", noHeaderFields.length !== this.fields.length);

  }
  else {
    style.marginTop = Client.mainFrame.isIDF ? style.marginTop : "";
    //
    Client.Widget.updateElementClassName(headerContainer, "header-inner header-border header-outer", true);
    Client.Widget.updateElementClassName(headerContainer, headerClass);
  }
  //
  Client.Widget.updateStyle(headerContainer, headerStyle, style);
  //
  if (form)
    Client.Widget.updateStyle(headerContainer, headerStyle, headerCustomStyle);
};


/**
 * Update collapse button visibility
 */
Client.IdfGroup.prototype.updateCollapsible = function ()
{
  if (this.isShown() && !this.isInList()) {
    Client.Widget.updateObject(Client.eleMap[this.outListCollapseId], {visible: this.collapsible});
    Client.Widget.updateElementClassName(Client.eleMap[this.outListContainerId], "panel-group-collapsible", !this.collapsible);
  }
  //
  if (this.isShown(true)) {
    Client.Widget.updateObject(Client.eleMap[this.formCollapseId], {visible: this.collapsible});
    Client.Widget.updateElementClassName(Client.eleMap[this.formContainerId], "panel-group-collapsible", !this.collapsible);
  }
};


/**
 * Handle collapsed status
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.handleCollapse = function (form)
{
  // If I have to handle collapse for a form/list group and parent panel has no form/list, do nothing.
  // Also do nothing if this is an in list group. In fact, in list groups cannot be collapsed
  if (!this.isShown(form) || (!form && this.isInList()))
    return;
  //
  // Update collapse button icon
  let collapseButtonId = form ? this.formCollapseId : this.outListCollapseId;
  Client.Widget.updateObject(Client.eleMap[collapseButtonId], {icon: this.collapsed ? "add" : "remove"});
  //
  // Update container collapsed status
  let containerId = form ? this.formContainerId : this.outListContainerId;
  let container = Client.eleMap[containerId];
  //
  Client.Widget.updateElementClassName(container, "collapsed", !this.collapsed);
  Client.Widget.updateElementClassName(container, "expanded", this.collapsed);
  //
  if (!this.realizing)
    this.parent.updateObjects({calcLayout: true});
};


/**
 * Update visibility
 * @param {Integer} index
 */
Client.IdfGroup.prototype.updateVisibility = function (index)
{
  let modes = ["list", "form"];
  //
  for (let i = 0; i < modes.length; i++) {
    let form = modes[i] === "form";
    let parentColumn = form ? this.parent.getFormFieldColumn(this.id) : this.parent.getListFieldColumn(this.id);
    //
    // If I have to update visibility for a form/list group and parent panel has no form/list, do nothing
    if (!this.isShown(form) || !parentColumn)
      continue;
    //
    let visible = this.isVisible(form);
    //
    let visibilityStyle = {display: visible ? "flex" : "none"};
    let styleToUpdate = this.listHeaderColumnStyle;
    //
    let containerId;
    if (!form && this.isInList()) {
      containerId = this.listContainerConf.id;
      //
      // Update header column visibility
      Client.Widget.updateStyle(Client.eleMap[containerId], styleToUpdate, visibilityStyle);
      //
      // Update data columns visibility
      for (let j = 0; j < this.listContainersConf.length; j++) {
        let el = Client.eleMap[this.listContainersConf[j]?.id];
        //
        this.listColumnStyles[j] = this.listColumnStyles[j] || {};
        //
        Client.Widget.updateStyle(el, this.listColumnStyles[j], visibilityStyle);
      }
    }
    else {
      parentColumn.visible = visible;
      containerId = parentColumn.conf.id;
      //
      styleToUpdate = form ? this.formColumnStyle : this.outListColumnStyle;
      //
      // Update column visibility
      Client.Widget.updateStyle(Client.eleMap[containerId], styleToUpdate, visibilityStyle);
    }
  }
  //
  // Tell my fields to update their visibility
  for (let i = 0; i < this.fields.length; i++)
    this.fields[i].updateVisibility(index);
};


/**
 * Update image
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.updateImage = function (form)
{
  // If I have to update image for a form/list group and parent panel has no form/list, do nothing
  if (!this.isShown(form))
    return;
  //
  let headerContainer;
  let styleToUpdate;
  //
  if (!form && this.isInList()) {
    headerContainer = Client.eleMap[this.listContainerConf.id];
    styleToUpdate = this.listHeaderColumnStyle;
  }
  else {
    let groupColumn = form ? this.parent.getFormFieldColumn(this.id) : this.parent.getListFieldColumn(this.id);
    if (!groupColumn)
      return;
    //
    headerContainer = Client.eleMap[groupColumn.conf.id];
    //
    styleToUpdate = form ? this.formColumnStyle : this.outListColumnStyle;
  }
  //
  let newStyle = {};
  if (this.image)
    newStyle.backgroundImage = "url('" + ((Client.mainFrame.isIDF ? "images/" : "") + this.image) + "')";
  else
    newStyle.backgroundImage = "";
  //
  Client.Widget.updateStyle(headerContainer, styleToUpdate, newStyle);
};


/**
 * Update group className
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.updateClassName = function (form)
{
  // If I have to update className for a form/list group and parent panel has no form/list, do nothing
  if (!this.isShown(form))
    return;
  //
  // Get container to apply className to
  let container;
  if (form)
    container = Client.eleMap[this.formContainerId];
  else
    container = this.isInList() ? Client.eleMap[this.listHeaderId] : Client.eleMap[this.outListContainerId];
  //
  // Remove old className and add the new one
  if (this.oldClassName)
    Client.Widget.updateElementClassName(container, this.oldClassName, true);
  if (this.className)
    Client.Widget.updateElementClassName(container, this.className, false);
};


/**
 * Return true if I'm enabled
 */
Client.IdfGroup.prototype.isEnabled = function ()
{
  if (!this.enabled)
    return false;
  //
  // If I belong to a page that is not enabled, I'm not enabled
  if (this.page && !this.page.isEnabled())
    return false;
  //
  return true;
};


/**
 * Return true if I'm visible in given layout
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.isVisible = function (form)
{
  if (Client.mainFrame.isEditing()) {
    if (form && !this.parent.hasForm)
      return false;
    //
    if (!form && !this.parent.hasList)
      return false;
  }
  //
  if (!this.isShown(form) || !this.visible)
    return false;
  //
  // If I belong to a page that is not visible, I'm not visible
  if (this.page && !this.page.isVisible())
    return false;
  //
  if (!this.fields.find(f => f.isVisible(form, true)))
    return false;
  //
  return true;
};


/**
 * Return true if at least one of group fields is shown in given layout
 * @param {Boolean} form
 */
Client.IdfGroup.prototype.isShown = function (form)
{
  if (Client.mainFrame.isEditing())
    return true;
  //
  if (form && !this.parent.hasForm)
    return false;
  //
  if (!form && !this.parent.hasList)
    return false;
  //
  if (!this.fields.find(f => f.isShown(form)))
    return false;
  //
  return true;
};


/**
 * Handle reset cache command
 * @param {Object} options
 */
Client.IdfGroup.prototype.resetCache = function (options)
{
  let from = options.from ?? 1;
  let to = options.to ?? this.getFirstInListField()?.values.length ?? 0;
  //
  for (let i = from; i <= to; i++) {
    // If I have a data block coming after reset cache, I don't have to clear list container configurations belonging to that block. It's better to reuse them
    if (i >= options.dataBlockStart && i <= options.dataBlockEnd)
      continue;
    //
    if (!this.listContainersConf[i])
      continue;
    //
    delete this.listContainersConf[i];
  }
};


/**
 * Reset cached styles
 * @param {Integer} index
 */
Client.IdfGroup.prototype.resetCachedStyles = function (index)
{
  if (index === undefined) {
    this.listHeaderColumnStyle = {};
    this.listHeaderStyle = {};
    this.listColumnStyles = [];
    this.outListHeaderStyle = {};
    this.outListColumnStyle = {};
    this.formHeaderStyle = {};
    this.formColumnStyle = {};
  }
  //
  let start = index ?? 0;
  let end = index ?? this.listColumnStyles.length;
  for (let i = start; i <= end; i++)
    delete this.listColumnStyles[i];
};


Client.IdfGroup.prototype.getParentPanel = function ()
{
  let panel = this.parent;
  while (panel && !(panel instanceof Client.IdfPanel))
    panel = panel.parent;
  return panel;
};


Client.IdfGroup.prototype.insertBefore = function (content)
{
  if (Client.mainFrame.isEditing()) {
    if (content.sib)
      content.child.sib = content.sib;
    else if (this.fsib) {
      content.child.sib = this.fsib;
      delete this.fsib;
    }
    //
    // Insert the field into the panel
    let panel = this.getParentPanel();
    panel.createChildren({children: [content.child]});
    panel.restoreRowSelectors();
    //
    // Get group's fields from parent panel
    this.fields = [];
    for (let i = 0; i < panel.fields.length; i++) {
      let field = panel.fields[i];
      if (field.groupId === this.id) {
        field.group = this;
        this.fields.push(field);
        //
        this.inList = this.inList && field.isInList();
      }
    }
    //
    if (!this.listHeaderTextId) {
      this.realize({fake: true}, this.parent, this.view);
      this.updateHeader();
      this.updateHeader(true);
      this.updateCollapsible();
    }
    //
    // If the formstructure comes from the server the addin handles the add/remove of fields
    // if the structure is auto-genertaed by the client the addin does nothing so
    // the client must recreate it when adding an object
    if (panel.clientGeneratedFormStructure) {
      delete panel.formStruct;
      panel.groups.forEach(g => delete g.formStruct);
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
  //
  this.updateHeader();
  this.updateHeader(true);
};


/**
 * Remove a child from the element
 * @param {Object} content - an object with the id of the element to remove
 */
Client.IdfGroup.prototype.removeChild = function (content)
{
  Client.Element.prototype.removeChild.call(this, content);
  //
  var id = content.id;
  for (var i = 0; i < this.fields.length; i++) {
    if (this.fields[i].id === id)
    {
      this.fields[i].close(true, false);
      this.fields.splice(i, 1);
      break;
    }
  }
};


Client.IdfGroup.prototype.isDraggable = function (element)
{
  if (Client.mainFrame?.isEditing() && Client.Utils.isMyParent(element.getRootObject(), this.formHeaderId))
    return true;
  //
  return false;
};

Client.IdfGroup.prototype.getSupportedTransformOperation = function (x, y, element, root)
{
  if (Client.mainFrame?.isEditing() && Client.Utils.isMyParent(element.getRootObject(), this.formHeaderId))
    return Client.Widget.transformOperation.DRAG;
  //
  return Client.Widget.transformOperation.NONE;
};


Client.IdfGroup.prototype.getTransformOperationTargetObj = function (operation, element)
{
  if (Client.mainFrame?.isEditing()) {
    return Client.eleMap[this.formContainerId].getRootObject().parentNode;
  }
  //
  return this.getRootObject();
};


Client.IdfGroup.prototype.applyDragDropCursor = function (cursor)
{
  // Only for IDCloud Edit mode
  let obj = Client.eleMap[this.formHeaderId]?.getRootObject();
  if (!obj || !Client.mainFrame?.isEditing())
    return;
  //
  if (cursor) {
    obj.setAttribute("opnt", "dd");
    obj.style.cursor = cursor;
    obj.classList.add("system-cursor");
    //
    // Clear the cursor on mouse leave
    if (!obj.onmouseleave)
      obj.onmouseleave = Client.Widget.ddClearPointer;
  }
  else if (obj.getAttribute("opnt")) {
    // I already set a cursor on the object BUT now i have no operation : clear the cursor
    obj.style.cursor = "";
    obj.setAttribute("opnt", "");
    obj.classList.remove("system-cursor");
  }
};


Client.IdfGroup.prototype.close = function (firstLevel, triggerAnimation)
{
  // Close and remove all fields from panel
  let fields = this.fields.slice();
  fields.forEach(field => field.close(firstLevel, false));
  //
  // Remove the rows from the list
  this.listContainersConf.forEach(conf => {
    let el = Client.eleMap[conf?.id];
    //
    if (el)
      el.close(firstLevel, false);
  });
  //
  this.listContainersConf = [];
  //
  Client.Widget.prototype.close.call(this, firstLevel, triggerAnimation);
};


/*
 * Reset the empty group to hide it's objects
 */
Client.IdfGroup.prototype.resetGroup = function ()
{
  // Remove the rows from the list
  this.listContainersConf.forEach(conf => {
    let el = Client.eleMap[conf?.id];
    //
    if (el)
      el.close(true);
  });
  //
  this.listContainersConf = [];
  //
  // Close each widget main object
  while (this.mainObjects.length) {
    this.mainObjects[0].close(true);
    this.mainObjects.splice(0, 1);
  }
  //
  delete this.listHeaderId;
  delete this.listHeaderTextId;
  delete this.listContentId;
  //
  delete this.formHeaderId;
  delete this.formCollapseId;
  delete this.formHeaderTextId;
  delete this.formContainerId;
  //
  delete this.outListHeaderId;
  delete this.outListCollapseId;
  delete this.outListHeaderTextId;
  delete this.outListContainerId;
};


/**
 * Return true if group can be focused
 */
Client.IdfGroup.prototype.canHaveFocus = function ()
{
  return !this.collapsed || (this.parent.layout === Client.IdfPanel.layouts.list && this.isInList());
};


/**
 * Give focus to the element
 * @param {Object} options
 */
Client.IdfGroup.prototype.focus = function (options)
{
  if (!this.canHaveFocus())
    return false;
  //
  return this.parent.getFocusableFields().find(f => f.group === this)?.focus(options);
};


/**
 * Get first in list field
 */
Client.IdfGroup.prototype.getFirstInListField = function ()
{
  return this.fields.find(f => f.isShown() && f.isInList());
};
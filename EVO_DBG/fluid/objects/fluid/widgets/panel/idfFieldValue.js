/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};
/**
 * @class A panel field value
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfFieldValue = function (widget, parent, view)
{
  this.parentField = parent;
  this.parentPanel = parent.parent;
  this.index = widget.index;
  this.rowsGroup = widget.rowsGroup;
  //
  if (this.rowsGroup) {
    this.rowsGroup.parentFieldValue = this;
    if (this.rowsGroup?.aggregations[this.parentField.index] !== undefined) {
      widget.text = "";
      //
      // Numeric and date fields handle aggregation label as mask prefix, so I don't need to write it into text
      if (!Client.IdfField.isNumeric(this.parentField.dataType) && !Client.IdfField.isDateOrTime(this.parentField.dataType))
        widget.text += this.parentField.aggregationLabel || "";
      //
      widget.text += this.rowsGroup.aggregations[this.parentField.index];
    }
  }
  //
  let newIndex = this.getIndex();
  widget.index = newIndex;
  this.index = newIndex;
  //
  // Set default values
  widget = Object.assign({
    text: "",
    errorText: "",
    rowErrorText: "",
    backColor: "",
    color: "",
    fontModifiers: "",
    className: "",
    badge: "",
    mask: "",
    visible: -1,
    enabled: -1,
    visualStyle: -1,
    alignment: -1,
    isRowQbe: this.index === 0
  }, widget);
  //
  this.listStyle = {};
  this.rowSelectorStyle = {};
  this.rowsGroupHeaderStyle = {};
  this.listCustomStyle = {};
  //
  // Add this value to field values array
  this.parentField.addValue(this);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfFieldValue extend Client.Widget
Client.IdfFieldValue.prototype = new Client.Widget();


Client.IdfFieldValue.transPropMap = {
  idx: "index",
  txt: "text",
  vis: "visible",
  ena: "enabled",
  err: "errorText",
  ety: "errorType",
  rse: "rowSelectorType",
  mim: "blobMime",
  mty: "htmlBlobMime",
  url: "blobUrl",
  aln: "alignment",
  bkc: "backColor",
  frc: "color",
  msk: "mask",
  ftm: "fontModifiers"
};


Client.IdfFieldValue.cloneProps = [
  "enabled", "text", "visualStyle", "alignment", "className", "controlType",
  "valueList", "backColor", "color", "mask", "fontModifiers", "badge",
  "blobMime", "htmlBlobMime", "blobUrl", "tooltip"
];


Client.IdfFieldValue.controlProps = [
  "enabled", "text", "type", "visualStyle", "alignment", "image", "canSort", "isHyperLink", "controlType", "customElement",
  "container", "dataType", "isPassword", "showOnlyIcon", "maxLength", "scale", "optional", "valueList", "hasValueSource", "smartLookup",
  "autoLookup", "editorType", "activatorImage", "activatorWidth", "canActivate", "activableDisabled", "superActive", "useHtml", "aggregationLabel",
  "isRowQbe", "backColor", "color", "mask", "fontModifiers", "badge", "blobMime", "htmlBlobMime", "blobUrl", "imageResizeMode",
  "multiUpload", "uploadExtensions", "showHtmlEditorToolbar", "className", "placeholder", "listNumRows", "formNumRows", "rowHeightResize",
  "comboMultiSel", "comboSeparator", "customChildrenConf", "subFrameConf"
];


Client.IdfFieldValue.dynamicProps = [
  "text",
  "className",
  "visible",
  "enabled",
  "alignment",
  "backColor",
  "color",
  "mask",
  "fontModifiers",
  "badge",
  "tooltip"
];


Client.IdfFieldValue.blobMimeTypes = {
  TEXT: "text",
  IMAGE: "image",
  SIZE: "size",
  EMPTY: "empty"
};


Client.IdfFieldValue.rowSelectorTypes = {
  DOC_ERROR: 1,
  DOC_UPDATED: 2,
  INSERTED_DOC_ERROR: 3,
  INSERTED_DOC_UPDATED: 4
};


Client.IdfFieldValue.errorTypes = {
  NONE: 0,
  ERROR: 1,
  CONFIRM_WARNING: 2,
  WARNING: 3
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfFieldValue.convertPropValues = function (props)
{
  props = props || {};
  //
  let setDefault;
  //
  // IDF doesn't send dynamic properties changes if new values are the default ones.
  // So, if I receive field value index, reset dynamic properties here
  if (props.index) {
    for (let p of Client.IdfFieldValue.dynamicProps)
      props[p] = props[p] || "";
    //
    // Remember I'm setting default in order to apply proper default value to numeric properties
    setDefault = true;
  }
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfFieldValue.transPropMap.idx:
      case Client.IdfFieldValue.transPropMap.rse:
      case Client.IdfFieldValue.transPropMap.ety:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfFieldValue.transPropMap.vis:
      case Client.IdfFieldValue.transPropMap.ena:
      case Client.IdfFieldValue.transPropMap.aln:
        // Default value for numeric properties is -1
        if (setDefault && props[p] === "")
          props[p] = -1;
        else
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
Client.IdfFieldValue.prototype.realize = function (widget, parent, view)
{
  // Create widget children (custom elements)
  this.createChildren(widget);
};


/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfFieldValue.prototype.updateElement = function (props)
{
  if (this.parentPanel.creatingChildren)
    delete this.clientSide;
  //
  props = props || {};
  //
  let calcLayout, applyVisualStyle, updateErrorStatus;
  let propsToUpdate = {};
  //
  // When fieldValue of QBE is reused (props.index === 1) update text from QBEFilter
  if (props.index === 1 && this.parentPanel.status === Client.IdfPanel.statuses.qbe && !Client.mainFrame.isIDF)
    this.updateQbeFilter();
  //
  // Skip widget applyVisualStyle otherwise I would execute it twice if visualStyle property is changed
  props.skipWidgetApplyVisualStyle = true;
  //
  // We ignore the text change because we have already sent another change in the meantime
  if (Client.mainFrame.isIDF && this.parentField.superActive && "text" in props && props.id) {
    if (--this.chgTextCount > 0)
      delete props.text;
  }
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  delete props.skipWidgetApplyVisualStyle;
  //
  // Since visualStyle property is handled by widget, it tells me if I have to apply visual style
  applyVisualStyle = props.applyVisualStyle;
  delete props.applyVisualStyle;
  //
  if (props.customChildrenConf !== undefined) {
    this.customChildrenConf = props.customChildrenConf;
    propsToUpdate.customChildrenConf = true;
    this.customChildrenConf.forEach(cc => {
      Client.mainFrame.translateProperties(cc, Client.transPropMap);
      //
      let idParts = cc.id.split(":");
      //
      let myIndex = this.index;
      if (myIndex !== parseInt(idParts[1])) {
        idParts[1] = this.index;
        cc.id = idParts.join(":");
      }
    });
  }
  //
  if (props.mask !== undefined) {
    this.mask = props.mask;
    propsToUpdate.mask = true;
  }
  //
  // If server sends "*" for smart lookup, ignore it
  if (this.parentField.smartLookup && props.text === "*")
    delete props.text;
  //
  if (props.text !== undefined) {
    if (this.isInQbe() && this.parentField.controlType === Client.IdfField.controlTypes.CHECK && props.text === "")
      props.text = "---";
    //
    this.text = props.text;
    propsToUpdate.text = true;
    propsToUpdate.aggregationLabel = true;
    propsToUpdate.mask = true;
    //
    // If there is an error, reset it
    if (this.errorText && !props.errorText) {
      props.errorText = "";
      props.errorType = Client.IdfFieldValue.errorTypes.NONE;
    }
  }
  //
  if (props.visible !== undefined && props.visible !== this.visible) {
    this.visible = props.visible;
    calcLayout = true;
  }
  //
  if (props.enabled !== undefined) {
    this.enabled = props.enabled;
    propsToUpdate.enabled = true;
    //
    applyVisualStyle = true;
  }
  //
  if (props.errorText !== undefined) {
    this.errorText = props.errorText;
    propsToUpdate.tooltip = true;
    updateErrorStatus = true;
  }
  //
  if (props.rowErrorText !== undefined) {
    this.rowErrorText = props.rowErrorText;
    propsToUpdate.tooltip = true;
    updateErrorStatus = true;
  }
  //
  if (props.errorType !== undefined) {
    this.errorType = props.errorType;
    applyVisualStyle = true;
  }
  //
  if (props.tooltip !== undefined)
    propsToUpdate.tooltip = true;
  //
  if (props.blobMime !== undefined)
    this.blobMime = props.blobMime;
  //
  if (props.htmlBlobMime !== undefined)
    this.htmlBlobMime = props.htmlBlobMime;
  //
  if (props.blobUrl !== undefined)
    this.blobUrl = props.blobUrl;
  //
  if (props.alignment !== undefined) {
    this.alignment = props.alignment;
    propsToUpdate.alignment = true;
  }
  //
  if (props.backColor !== undefined) {
    this.backColor = props.backColor;
    propsToUpdate.backColor = true;
    applyVisualStyle = true;
  }
  //
  if (props.color !== undefined) {
    this.color = props.color;
    propsToUpdate.color = true;
  }
  //
  if (props.fontModifiers !== undefined) {
    this.fontModifiers = props.fontModifiers;
    propsToUpdate.fontModifiers = true;
  }
  //
  if (props.className !== undefined) {
    this.className = props.className;
    propsToUpdate.className = true;
  }
  //
  if (props.badge !== undefined)
    propsToUpdate.badge = true;
  //
  if (props.valueList !== undefined) {
    this.valueList = props.valueList;
    if (this.parentField.smartLookup || this.parentField.hasValueSource)
      this.valueList.disableCache = Math.random();
    propsToUpdate.valueList = true;
  }
  //
  if (props.controlType !== undefined)
    propsToUpdate.controlType = true;
  //
  if (props.rowSelectorType !== undefined) {
    // IDF sends rowSelectorType change on first field regardless of whether it is in list.
    // Instead, I handle row selector on first IN LIST field. So send change to equivalent fieldValue of first in list field
    let firstInListField = this.parentPanel.getFirstInListField();
    if (firstInListField && this.parentField !== firstInListField) {
      delete this.rowSelectorType;
      //
      let fieldValue = firstInListField.getValueByIndex(this.index);
      fieldValue?.updateElement({rowSelectorType: props.rowSelectorType});
    }
    else {
      this.rowSelectorType = props.rowSelectorType;
      this.updateRowSelectorIcon();
    }
  }
  //
  if (props.style !== undefined) {
    Client.Widget.updateCustomStyle({styleToUpdate: this.listCustomStyle, newStyle: props.style});
    calcLayout = true;
  }
  //
  if (calcLayout)
    this.parentPanel.calcLayout();
  //
  // Apply visual style if needed
  if (applyVisualStyle)
    this.applyVisualStyle();
  //
  // Update error status if needed
  if (updateErrorStatus)
    this.updateErrorStatus();
  //
  // Update controls
  this.updateControls(propsToUpdate);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.onEvent = function (event)
{
  let events = [];
  //
  if (event.content instanceof Array && this.customElement && !this.customElement.subFrameId) {
    events.push(...this.customElement.onEvent(event));
    events.forEach(e => {
      e.content.oid = this.id;
      e.content.ace = this.parentField.id;
    });
  }
  else {
    events.push(...Client.Widget.prototype.onEvent.call(this, event));
    //
    switch (event.id) {
      case "chgProp":
        if (this.customElement && !this.customElement.subFrameId) {
          events.push(...this.customElement.onEvent(event));
          //
          // If the default property has changed I also push a change of the value
          if (event.content.name === Client[this.customElement._class].defaultBindingProperty) {
            event = JSON.parse(JSON.stringify(event));
            event.content.name = "value";
            event.content.value += "";
          }
        }
        //
        if (event.content.name === "value")
          events.push(...this.handleChange(event));
        else if (event.content.name === "filter")
          events.push(...this.parentField.handleComboFilter(event));
        else if (event.content.name === "errorText") {
          event.obj = this.parentField.id;
          event.content.index = this.getIndex(true);
          events.push(event);
        }
        else if (event.content.name === "checked" && event.obj === this.multiSelCheckbox?.id)
          events.push(...this.parentPanel.handleDataRowSelection(event.content.value, this.getIndex(true)));
        break;

      case "onKey":
        events.push(...this.handleActivate(event));
        break;

      case "onClick":
      case "onDblclick":
      case "onContextmenu":
        // Handle click on group expansion button
        if (event.id === "onClick" && this.rowsGroup && this.rowsGroupHeaderId) {
          events.push(...this.rowsGroup.onEvent(event));
          this.updateRowsGroupHeader({expanded: true});
        }
        else { // Handle changeRow/rowSelectorClick event
          events.push(...this.parentPanel.handleDataRowClick(event, this));
          //
          if (event.obj !== this.rowSelectorId && (event.id !== "onContextmenu" || this.parentPanel.activateOnRightClick) && !event.content.srcEvent.defaultPrevented)
            events.push(...this.handleActivate(event));
        }
        break;

      case "onBlobCommand":
        events.push(...this.handleBlobCommand(event));
        break;

      case "onFocusin":
      case "onFocusout":
        events.push(...this.handleFocus(event));
        break;

      case "onDragover":
        // I need to prevent dragover default behaviour otherwise ondrop doesn't fire
        let control = this.getSourceControl(event);
        event.content.srcEvent.preventDefault();
        event.content.srcEvent.dataTransfer.dropEffect = control?.canAcceptDrop(event.content.srcEvent) ? "move" : "none";
        break;
    }
  }
  //
  if (this.customChildrenConf) {
    let srcElement = Client.Utils.findElementFromDomObj(event.content.srcEvent?.target);
    if (!srcElement?.events?.includes(event.id) && event.id !== "chgProp")
      return events;
    //
    event.content.srcEvent?.stopPropagation();
    //
    events.push({
      id: "fireEvent",
      obj: this.parentField.id,
      content: {srcId: event.id, row: this.getIndex(true), srcObjId: event.id === "chgProp" ? this.id : srcElement.id}
    });
  }
  //
  return events;
};


/**
 * Return a copy of the element
 * @param {Object} config
 * @param {Client.Element} parent
 * @param {Map} referencesMap
 */
Client.IdfFieldValue.prototype.clone = function (config, parent, referencesMap)
{
  let widget = Client.Widget.prototype.clone.call(this, config, parent, referencesMap);
  //
  widget.parent = this.parent;
  widget.parentField = this.parentField;
  widget.parentPanel = this.parentPanel;
  widget.parentField.addValue(widget);
  //
  return widget;
};


/**
 * Create a column configuration that represents row selector and will be part of panel grid
 */
Client.IdfFieldValue.prototype.createRowSelectorConfig = function ()
{
  // Create row selector column configuration
  let offsetCol = this.parentPanel.getListRowOffset() ? " offset-col" : "";
  let firstCol = this.parentPanel.showRowSelector ? " first-visible-col" : "";
  let rowSelectorConf = this.createElementConfig({c: "IonCol", className: "panel-list-col row-selector-col" + offsetCol + firstCol, xs: "auto", events: ["onClick", "onDblClick"], visible: this.parentPanel.showRowSelector});
  //
  // Create row selector button configuration
  let {icon, cssClass} = this.getRowSelectorProps();
  let className = "row-selector" + (cssClass ? " " + cssClass : "");
  let rowSelectorIconConf = this.createElementConfig({c: "IonButton", className, icon, visible: !this.isRowQbe});
  rowSelectorConf.children.push(rowSelectorIconConf);
  //
  // Save element id
  this.rowSelectorId = rowSelectorConf.id;
  //
  return rowSelectorConf;
};


/**
 * Create a column configuration that will be part of panel grid
 */
Client.IdfFieldValue.prototype.createListConfig = function ()
{
  let controlConfig = this.parentField.createControlConfig(false, this.index);
  //
  // Create column configuration
  let listContainerConf = this.createElementConfig(controlConfig.container);
  //
  // Create list control configuration
  let listControlConf = this.createElementConfig(controlConfig.control);
  listContainerConf.children.push(listControlConf);
  //
  // Save elements ids
  this.listContainerId = listContainerConf.id;
  this.listControlId = listControlConf.id;
  //
  return listContainerConf;
};


/**
 * Create a column configuration that represents rows group header
 */
Client.IdfFieldValue.prototype.createRowsGroupHeaderConfig = function ()
{
  let headerConf = this.createElementConfig({c: "IonCol", className: "panel-list-col group-header-col", tabIndex: 0, xs: "auto", events: ["onClick"]});
  //
  let expandButtonConf = this.createElementConfig({c: "IonButton", className: "group-exp-icon"});
  headerConf.children.push(expandButtonConf);
  //
  let headerTextConf = this.createElementConfig({c: "IonText", type: "span", innerText: this.rowsGroup?.label || ""});
  headerConf.children.push(headerTextConf);
  //
  this.rowsGroupHeaderId = headerConf.id;
  this.rowsGroupHeaderTextId = headerTextConf.id;
  this.expandRowsGroupButtonId = expandButtonConf.id;
  //
  return headerConf;
};


/**
 * Get index
 * @param {Boolean} real
 */
Client.IdfFieldValue.prototype.getIndex = function (real)
{
  let index = this.index;
  //
  if (this.parentField.isStatic() || index === 0)
    return index;
  //
  if (this.parentPanel.hasGroupedRows() && !this.rowsGroup)
    index = real ? this.parentPanel.groupedRowsRoot.groupedIndexToRealIndex(index) : this.parentPanel.groupedRowsRoot.realIndexToGroupedIndex(index);
  //
  return index;
};


/**
 * Get visual style
 */
Client.IdfFieldValue.prototype.getVisualStyle = function ()
{
  return this.visualStyle !== -1 ? this.visualStyle : this.parentField.visualStyle;
};


/**
 * Get value control type
 */
Client.IdfFieldValue.prototype.getControlType = function ()
{
  let controlType;
  //
  let listControl = Client.eleMap[this.listControlId];
  if (listControl)
    controlType = listControl.getType();
  else if (this.outListControl)
    controlType = this.outListControl.getType();
  else if (this.formControl)
    controlType = this.formControl.getType();
  //
  return controlType;
};


/**
 * Get value list
 */
Client.IdfFieldValue.prototype.getValueList = function ()
{
  return this.valueList || this.parentField.valueList;
};


/**
 * Get alignment
 */
Client.IdfFieldValue.prototype.getAlignment = function ()
{
  // Get value, field and visual style alignment
  let alignment = this.alignment !== -1 ? this.alignment : undefined;
  let fieldAlignment = this.parentField.alignment !== -1 ? this.parentField.alignment : undefined;
  let vis = Client.IdfVisualStyle.getByIndex(this.getVisualStyle());
  //
  alignment = alignment || fieldAlignment || vis?.getAlignment();
  //
  // If there is no alignment or it's AUTO, assign RIGHT or LEFT
  if (!alignment || alignment === Client.IdfVisualStyle.alignments.AUTO)
    alignment = this.parentField.isRightAligned() ? Client.IdfVisualStyle.alignments.RIGHT : Client.IdfVisualStyle.alignments.LEFT;
  //
  if (this.isRowQbe)
    alignment = Client.IdfVisualStyle.alignments.LEFT;
  //
  return alignment;
};


/**
 * Check if this value is clickable
 */
Client.IdfFieldValue.prototype.isClickable = function ()
{
  return this.parentField.isHyperLink || Client.IdfVisualStyle.getByIndex(this.getVisualStyle())?.getHyperLinkFlag();
};


/**
 * Get row selector props (icon and cssClass)
 */
Client.IdfFieldValue.prototype.getRowSelectorProps = function ()
{
  let icon;
  let cssClass = "";
  //
  if (this.isRowQbe)
    icon = "remove-circle";
  else {
    switch (this.rowSelectorType) {
      case Client.IdfFieldValue.rowSelectorTypes.DOC_ERROR:
      case Client.IdfFieldValue.rowSelectorTypes.INSERTED_DOC_ERROR:
        icon = "close-circle";
        cssClass = "error";
        break;

      case Client.IdfFieldValue.rowSelectorTypes.DOC_UPDATED:
      case Client.IdfFieldValue.rowSelectorTypes.INSERTED_DOC_UPDATED:
        icon = "medical";
        cssClass = "updated";
        break;

      default:
        icon = "arrow-round-forward";
    }
  }
  return {icon, cssClass};
};


/**
 * Update row selector icon
 */
Client.IdfFieldValue.prototype.updateRowSelectorIcon = function ()
{
  let rowSelector = Client.eleMap[this.rowSelectorId];
  if (!rowSelector)
    return;
  //
  let {icon, cssClass} = this.getRowSelectorProps();
  let rowSelectorButton = rowSelector.elements[0];
  //
  // Set image
  Client.Widget.setIconImage({image: icon, el: rowSelectorButton});
  //
  // Set css class
  Client.Widget.updateElementClassName(rowSelectorButton, "updated", cssClass !== "updated");
  Client.Widget.updateElementClassName(rowSelectorButton, "error", cssClass !== "error");
};


/**
 * Show or hide checkbox for multiple selection
 * @param {Boolean} show
 */
Client.IdfFieldValue.prototype.updateMultiSelVisibility = function (show)
{
  let rowSelector = Client.eleMap[this.rowSelectorId];
  if (!rowSelector)
    return;
  //
  // Get row selector button
  let rowSelectorButton = rowSelector.elements[0];
  //
  if (show) {
    // Hide row selector button
    Client.Widget.updateObject(rowSelectorButton, {visible: false});
    //
    let disabled = this.parentPanel.isNewRow(this.index) || this.isInQbe();
    //
    // Create checkbox
    if (!this.multiSelCheckbox) {
      let checkboxConf = this.createElementConfig({c: "IonCheckbox", className: "control-checkbox"});
      this.multiSelCheckbox = rowSelector.insertBefore({child: checkboxConf});
    }
    //
    Client.Widget.updateObject(this.multiSelCheckbox, {disabled});
  }
  else {
    // Show row selector button
    Client.Widget.updateObject(rowSelectorButton, {visible: true});
    //
    // Remove checkbox
    if (this.multiSelCheckbox) {
      rowSelector.removeChild(this.multiSelCheckbox);
      delete this.multiSelCheckbox;
    }
  }
};


/**
 * Select or unselect row
 * @param {Boolean} value
 */
Client.IdfFieldValue.prototype.selectRow = function (value)
{
  // If this value does not handle row selector column, do nothing
  if (!this.rowSelectorId)
    return;
  //
  Client.Widget.updateObject(this.multiSelCheckbox, {checked: value});
};


/**
 * Show clear filters button
 * @param {Boolean} show
 */
Client.IdfFieldValue.prototype.showClearFiltersButton = function (show)
{
  // If this value does not handle row selector column, do nothing
  if (!this.rowSelectorId || !this.isRowQbe)
    return;
  //
  let tooltip = show ? Client.Widget.getHTMLTooltip("", show ? Client.IdfResources.t("FIL_CLEARALLFILTERS") : "") : null;
  Client.Widget.updateObject(Client.eleMap[this.rowSelectorId].elements[0], {visible: show, tooltip});
};


/**
 * Set layout for container of list value
 * @param {Object} layout - {style, xs}
 */
Client.IdfFieldValue.prototype.setListLayout = function (layout)
{
  let listContainer = Client.eleMap[this.listContainerId];
  if (!listContainer)
    return;
  //
  let fixedHeight = (!this.parentPanel.hasDynamicHeightRows() && this.parentField.listNumRows === 1) || this.isInQbe();
  //
  // Apply layout to list container
  Client.Widget.updateStyle(listContainer, this.listStyle, layout.style);
  if (!this.isRowQbe)
    Client.Widget.updateStyle(listContainer, this.listStyle, this.listCustomStyle);
  if (layout.xs !== undefined)
    Client.Widget.updateObject(listContainer, {xs: layout.xs});
  Client.Widget.updateElementClassName(listContainer, "fixed-col", !this.listStyle.left);
  Client.Widget.updateElementClassName(listContainer, "fixed-height-col", !fixedHeight);
  //
  // If I handle the row selector, set it the same height as mine
  let rowSelector = Client.eleMap[this.rowSelectorId];
  if (rowSelector) {
    let rowSelectorStyle = {height: layout.style.height, left: this.parentPanel.fixedColumns ? 0 : ""};
    Client.Widget.updateStyle(rowSelector, this.rowSelectorStyle, rowSelectorStyle);
    Client.Widget.updateElementClassName(rowSelector, "fixed-col", !this.parentPanel.fixedColumns);
  }
  //
  // If I handle the rowsGroup header, set its style
  let rowsGroupHeader = Client.eleMap[this.rowsGroupHeaderId];
  if (rowsGroupHeader) {
    let rowsGroupHeaderStyle = {
      height: layout.style.height,
      paddingLeft: this.rowsGroup ? (5 + (this.rowsGroup.level * 15)) + "px" : "",
      display: this.rowsGroup ? "" : "none"
    };
    //
    Client.Widget.updateStyle(rowsGroupHeader, this.rowsGroupHeaderStyle, rowsGroupHeaderStyle);
    this.updateRowsGroupHeader({expanded: true});
  }
};


/**
 * Clear out list and form controls assigned to me
 */
Client.IdfFieldValue.prototype.clearControls = function ()
{
  if (this.outListContainer) {
    this.elements.splice(this.elements.findIndex(e => e === this.outListContainer));
    this.outListContainer.parent = this.parentField;
    this.outListContainer.parentWidget = this.parentField;
  }
  //
  delete this.outListContainer;
  delete this.outListControl;
  //
  if (this.formContainer) {
    this.elements.splice(this.elements.findIndex(e => e === this.formContainer));
    this.formContainer.parent = this.parentField;
    this.formContainer.parentWidget = this.parentField;
  }
  //
  delete this.formContainer;
  delete this.formControl;
};


/**
 * Assign out list and form container to me
 * @param {Object} params
 *                      - outListContainer
 *                      - outListControl
 *                      - formContainer
 *                      - formControl
 */
Client.IdfFieldValue.prototype.assignControls = function (params)
{
  // If I have an out list container, it means I'm the value of an out of list field
  if (params.outListContainer) {
    // Now I'm the temporary owner of shared out list container and control
    this.outListContainer = params.outListContainer;
    this.outListControl = params.outListControl;
    this.elements.push(this.outListContainer);
    this.outListContainer.parent = this;
    this.outListContainer.parentWidget = this;
  }
  //
  if (params.formContainer) {
    // Now I'm the temporary owner of shared form container and control
    this.formContainer = params.formContainer;
    this.formControl = params.formControl;
    this.elements.push(this.formContainer);
    this.formContainer.parent = this;
    this.formContainer.parentWidget = this;
  }
  //
  this.updateControls({all: true, skipInList: true});
  this.updateControls({customChildrenConf: true});
  this.updateControls({subFrameConf: true});
  //
  this.updateErrorStatus(true);
};


/**
 * Apply visual style
 */
Client.IdfFieldValue.prototype.applyVisualStyle = function ()
{
  let readOnly = !this.parentField.isEnabled(this.index);
  //
  // Don't apply QBE style to static field and to simple lookup field
  let qbe = this.isInQbe() && !this.parentField.isStatic() && (!this.parentField.isLookup() || this.parentField.autoLookup || this.parentField.smartLookup);
  //
  let error = this.errorType === Client.IdfFieldValue.errorTypes.ERROR;
  let warning = this.errorType === Client.IdfFieldValue.errorTypes.WARNING || this.errorType === Client.IdfFieldValue.errorTypes.CONFIRM_WARNING;
  //
  // Prepare visual style options
  let visOptions = {objType: "field", list: false, readOnly, qbe, error, warning};
  //
  // Set visual style on form field value
  if (this.formContainer) {
    this.applyBackgroundColor(this.formContainer, this.parentField.formValueStyle);
    this.addVisualStyleClasses(this.formContainer, visOptions);
  }
  //
  let listContainer = Client.eleMap[this.listContainerId];
  //
  // If I have an out list container, it means I'm the value of an out of list field
  if (this.outListContainer) {
    let outListValueStyle = this.parentField.outListValueStyle;
    //
    if (this.parentField.aggregateOfField !== -1) {
      let parentField = this.parentField.getAggregatedFieldParent();
      outListValueStyle = parentField.aggregateContainerStyle;
    }
    //
    this.applyBackgroundColor(this.outListContainer, outListValueStyle);
    this.addVisualStyleClasses(this.outListContainer, visOptions);
  }
  else if (listContainer) { // Otherwise I'm the value of a list field
    if (this.rowsGroup)
      this.addVisualStyleClasses(listContainer, {objType: "rowsgroup"});
    else {
      visOptions.list = true;
      visOptions.alternate = (this.index % 2 === 0);
      visOptions.activeRow = (this.index === this.parentPanel.getActiveRowIndex());
      //
      // Don't apply background on qbe row
      if (this.index !== 0)
        this.applyBackgroundColor(listContainer, this.listStyle);
      this.addVisualStyleClasses(listContainer, visOptions);
      //
      // If this value has to handle the row selector, set visual style on it
      // Use first visual style for row selector
      let rowSelector = Client.eleMap[this.rowSelectorId];
      if (rowSelector) {
        this.addVisualStyleClasses(rowSelector, visOptions);
        //
        if (this.parentPanel.numSubRows > 1) {
          // Apply the style also on the other fake rowselectors
          for (let r = 1; r < this.parentPanel.numSubRows; r++)
            this.addVisualStyleClasses(rowSelector.parent.parent.elements[r].elements[0], visOptions);
        }
      }
    }
  }
  //
  this.updateControls({visualStyle: true});
};


/**
 * Apply background color
 * @param {Client.Element} el
 * @param {Object} oldStyle
 */
Client.IdfFieldValue.prototype.applyBackgroundColor = function (el, oldStyle)
{
  if (!Client.mainFrame.isIDF)
    return;
  //
  let newStyle = {};
  //
  newStyle.backgroundColor = this.backColor;
  if ((this.backColor === "" || this.parentField.isStatic()) && this.parentField.backColor !== undefined)
    newStyle.backgroundColor = this.parentField.backColor;
  //
  Client.Widget.updateStyle(el, oldStyle, newStyle);
};


/**
 * Check if control background has already been applied
 */
Client.IdfFieldValue.prototype.isBackgroundApplied = function ()
{
  return true;
};


/**
 * Update internal controls
 * @param {Object} propsToUpdate - example {visualStyle: true, editorType: true, ...}
 * @param {Object} options
 */
Client.IdfFieldValue.prototype.updateControls = function (propsToUpdate, options)
{
  options = options || {};
  //
  // Skip update if parent field is not in viewport
  if (this.parentField.isInList() && this.parentPanel.layout === Client.IdfPanel.layouts.list && !this.parentPanel.viewportListFields.includes(this.parentField.id) && !options.force)
    return;
  //
  propsToUpdate = propsToUpdate || {};
  //
  let updateAll = propsToUpdate.all;
  //
  let fieldProps;
  if (updateAll) {
    fieldProps = Client.IdfFieldValue.controlProps.slice();
    //
    // I add the custom properties
    if (this.customElement && !this.customElement.subFrameId)
      fieldProps = fieldProps.concat(Object.keys(this.customElement.customProps));
  }
  else {
    fieldProps = Object.keys(propsToUpdate);
    //
    // Always update enabled status
    fieldProps.push("enabled");
  }
  //
  let isInQbe = this.isInQbe();
  //
  let controlProps = {};
  for (let i = 0; i < fieldProps.length; i++) {
    let fieldProp = fieldProps[i];
    //
    if (fieldProp === "enabled") {
      let isEnabled = this.parentField.isStatic() ? this.parentField.enabled : this.parentField.isEnabled(this.index);
      if (this.parentField.isButton(this))
        controlProps.enabled = isEnabled || this.parentField.activableDisabled;
      else
        controlProps.enabled = isEnabled;
    }
    else if (fieldProp === "text") {
      controlProps.value = (Client.mainFrame.isEditing() && this.index !== 0 ? this.parentField.getEditorText(this.index) : this.text) ?? "";
      controlProps.blobMime = this.blobMime;
      controlProps.htmlBlobMime = this.htmlBlobMime;
      controlProps.blobUrl = this.blobUrl;
    }
    else if (fieldProp === "type")
      controlProps.contentEditable = !this.parentField.isStatic();
    else if (fieldProp === "useHtml")
      controlProps.useHtml = this.parentField.isStatic();
    else if (fieldProp === "visualStyle")
      controlProps.visualStyle = this.getVisualStyle();
    else if (["smartLookup", "autoLookup", "hasValueSource"].includes(fieldProp))
      controlProps.comboType = this.parentField.getComboType();
    else if (fieldProp === "alignment") {
      // If I have an alignment, update control alignment
      let alignment = this.getAlignment();
      if (alignment)
        controlProps.alignment = alignment;
    }
    else if (fieldProp === "image")
      controlProps.image = this.parentPanel.showFieldImageInValue ? this.parentField.image : undefined;
    else if (fieldProp === "imageResizeMode")
      controlProps.imageResizeMode = this.convertImageResizeMode();
    else if (fieldProp === "canSort")
      controlProps.canSort = this.parentField.isSortable();
    else if (fieldProp === "isHyperLink")
      controlProps.clickable = this.isClickable();
    else if (fieldProp === "maxLength" && isInQbe)
      continue;
    else if (fieldProp === "controlType")
      controlProps.type = this.parentField.controlType;
    else if (fieldProp === "rowHeightResize")
      controlProps.heightResize = this.parentPanel.hasDynamicHeightRows();
    else if (fieldProp === "customElement") {
      if (this.customElement && !this.customElement.subFrameId)
        controlProps.customElement = this.customElement;
    }
    else if (fieldProp === "valueList") {
      let valueList = this.valueList ?? this.parentField.valueList;
      if (valueList)
        valueList = JSON.parse(JSON.stringify(valueList));
      //
      if (this.parentField.valueList)
        valueList.isStatic = true;
      //
      controlProps.valueList = valueList;
    }
    else if (fieldProp === "aggregationLabel") {
      if (Client.IdfField.isNumeric(this.parentField.dataType) || Client.IdfField.isDateOrTime(this.parentField.dataType))
        controlProps.maskPrefix = this.rowsGroup ? this.parentField.aggregationLabel : "";
    }
    else if (Client.IdfFieldValue.dynamicProps.includes(fieldProp)) {
      controlProps[fieldProp] = this[fieldProp];
      //
      // Default values for dynamic properties are "" or -1. In case of default, use parentField property value, if it's defined
      if ((this[fieldProp] === "" || this[fieldProp] === -1) && this.parentField[fieldProp] !== undefined && (!this.rowsGroup || fieldProp === "mask"))
        controlProps[fieldProp] = this.parentField[fieldProp];
      //
      if (fieldProp === "className")
        controlProps.classNameOnParent = true;
    }
    else if (fieldProp === "customChildrenConf")
      controlProps.customChildrenConf = this.customChildrenConf?.slice() || this.customChildrenConf;
    else if (fieldProp === "subFrameConf") {
      controlProps.subFrameConf = this.subFrameConf || this.parentField.subFrameConf;
      //
      if (!controlProps.subFrameConf && this.customElement?.subFrameId) {
        this.subFrameConf = this.parentIdfView?.getSubFrame(this.customElement.subFrameId);
        controlProps.subFrameConf = this.subFrameConf;
      }
    }
    else if (this.customElement && !this.customElement.subFrameId && this.customElement.customProps[fieldProp])
      controlProps[fieldProp] = this.customElement[fieldProp];
    else
      controlProps[fieldProp] = (this[fieldProp] ?? this.parentField[fieldProp]);
  }
  //
  // Since updateBlobCommands is not a field nor a fieldValue property, I have to handle it here
  if (this.parentField.dataType === Client.IdfField.dataTypes.BLOB && (propsToUpdate.updateBlobCommands || updateAll)) {
    let blobCommands = this.getBlobCommands();
    controlProps.uploadBlobEnabled = blobCommands.upload;
    controlProps.deleteBlobEnabled = blobCommands.delete;
    controlProps.viewBlobEnabled = blobCommands.view;
  }
  //
  // Since isInQbe is not a field nor a fieldValue property, I have to handle it here
  if (propsToUpdate.isInQbe || updateAll) {
    controlProps.isInQbe = isInQbe;
    //
    // Qbe datetime becomes date on IDF
    if (Client.mainFrame.isIDF && this.parentField.dataType === Client.IdfField.dataTypes.DATETIME)
      controlProps.dataType = isInQbe ? Client.IdfField.dataTypes.DATE : Client.IdfField.dataTypes.DATETIME;
  }
  //
  // Now I have to calculate properties that are different from list to form. So clone controlProps for list and form
  let listControlProps = {...controlProps};
  let formControlProps = {...controlProps};
  //
  if (controlProps.container || updateAll) {
    listControlProps.container = this.parentField.isInList() ? Client.eleMap[this.listContainerId] : this.outListContainer;
    formControlProps.container = this.formContainer;
  }
  //
  if (controlProps.listNumRows)
    listControlProps.numRows = controlProps.listNumRows;
  if (controlProps.formNumRows)
    formControlProps.numRows = controlProps.formNumRows;
  //
  if (propsToUpdate.tooltip || updateAll) {
    listControlProps.tooltip = this.getTooltip();
    formControlProps.tooltip = this.getTooltip(true);
  }
  //
  if (propsToUpdate.customChildrenConf || updateAll) {
    if (this.parentPanel.layout !== Client.IdfPanel.layouts.form || (!this.parentField.isStatic() && this.index !== this.parentPanel.getActiveRowIndex()))
      formControlProps.customChildrenConf = null;
    //
    if (formControlProps.customChildrenConf || (Client.mainFrame.isEditing() && !this.parentField.isVisible()))
      listControlProps.customChildrenConf = null;
  }
  //
  if (propsToUpdate.subFrameConf || updateAll) {
    if (this.parentPanel.layout === Client.IdfPanel.layouts.list || (!this.parentField.isStatic() && this.index !== this.parentPanel.getActiveRowIndex()))
      formControlProps.subFrameConf = null;
    //
    if (formControlProps.subFrameConf)
      listControlProps.subFrameConf = null;
  }
  //
  // Just current layout control has to empty combo list
  if (controlProps.value !== undefined) {
    listControlProps.skipEmptyComboList = this.parentPanel.layout === Client.IdfPanel.layouts.form;
    formControlProps.skipEmptyComboList = !listControlProps.skipEmptyComboList;
  }
  //
  // heightResize property makes sense just for in list controls
  if (controlProps.heightResize || updateAll) {
    if (!this.parentField.isInList())
      delete listControlProps.heightResize;
    delete formControlProps.heightResize;
  }
  //
  // In some cases, control type has to be EDIT even though visual style or controlType property says otherwise
  listControlProps.forceEditType = this.parentField.isInList() && (isInQbe || this.parentPanel.isNewRow(this.index));
  //
  if (propsToUpdate.listClassName && this.parentField.listClassName !== undefined)
    listControlProps.className = this.parentField.listClassName;
  //
  if (!this.parentField.isInList())
    this.outListControl?.updateElement(listControlProps);
  else if (!propsToUpdate.skipInList)
    Client.eleMap[this.listControlId]?.updateElement(listControlProps);
  //
  this.formControl?.updateElement(formControlProps);
  //
  return true;
};


/**
 * Update visibility
 * @param {Boolean} form
 */
Client.IdfFieldValue.prototype.updateVisibility = function (form)
{
  if (!form && this.parentField.aggregateOfField !== -1)
    return;
  //
  let visible = this.isVisible(form);
  //
  if (!form) {
    let listContainer = Client.eleMap[this.listContainerId];
    if (listContainer) {
      // If field is visible use "visibility" style property because value has to take up space also when it's not visible
      if (this.parentField.isVisible())
        Client.Widget.updateStyle(listContainer, this.listStyle, {display: "flex", visibility: visible ? "visible" : "hidden"});
      else
        Client.Widget.updateStyle(listContainer, this.listStyle, {display: visible ? "flex" : "none", visibility: "visible"});
      //
      Client.Widget.updateElementClassName(listContainer, "first-visible-col", this.parentPanel.getFirstVisibleField({inList: true, checkRowSelector: true}) !== this.parentField);
      Client.Widget.updateElementClassName(listContainer, "last-visible-col", this.parentPanel.getLastVisibleField({inList: true, checkRowSelector: true}) !== this.parentField);
    }
    else if (this.outListContainer) {
      // Get field parent column
      let fieldColumn = this.parentPanel.getListFieldColumn(this.parentField.id);
      fieldColumn.visible = visible;
      //
      let el = Client.eleMap[this.parentField.listParentColConf.id];
      Client.Widget.updateStyle(el, this.parentField.outListParentColStyle, {display: visible ? "flex" : "none"});
    }
  }
  //
  if (form && this.formContainer) {
    // Get field parent column
    let fieldColumn = this.parentPanel.getFormFieldColumn(this.parentField.id);
    fieldColumn.visible = visible;
    //
    let el = Client.eleMap[this.parentField.formParentColConf.id];
    Client.Widget.updateStyle(el, this.parentField.formParentColStyle, {display: visible ? "flex" : "none"});
  }
};


/**
 * Return true if I'm visible in given layout
 * @param {Boolean} form
 */
Client.IdfFieldValue.prototype.isVisible = function (form)
{
  // If parent field is not visible, I'm not visible
  if (!this.parentField.isVisible(form))
    return false;
  //
  return !!this.visible;
};


/**
 * Return true if I'm enabled
 */
Client.IdfFieldValue.prototype.isEnabled = function ()
{
  if (this.rowsGroup)
    return false;
  //
  let enabled = !!this.enabled;
  if (this.enabled === -1)
    enabled = this.parentField.enabled;
  //
  return enabled;
};


/**
 * Return true if I'm in QBE
 */
Client.IdfFieldValue.prototype.isInQbe = function ()
{
  return (this.parentPanel.status === Client.IdfPanel.statuses.qbe && this.getIndex(true) === 1 || this.isRowQbe);
};


/**
 * Handle value change
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleChange = function (event)
{
  let events = [];
  //
  // If change occurred on a blob, do nothing
  if (this.parentField.dataType === Client.IdfField.dataTypes.BLOB)
    return events;
  //
  // Check if change event occurred on one of my controls
  let control = this.getSourceControl(event);
  if (!control)
    return events;
  //
  let type = control.getType();
  //
  // Float fields can have a mask with #### decimals but the server value has more decimals. In this case text will be always different from control value.
  // So we need this fix: if the masked text is the same as the masked control value (control sends the unmasked value to the server) we can safely skip this change
  if (Client.IdfField.isNumeric(this.parentField.dataType) && type === Client.IdfField.controlTypes.EDIT) {
    let mask = control.getMask();
    let maskType = control.getMaskType();
    //
    if (mask_mask(this.text, mask, maskType) === mask_mask(event.content.value, mask, maskType))
      return events;
  }
  //
  // Check if this change is related to a smart lookup asking for list
  let requireSmartLookupList = this.parentField.smartLookup && event.content.value === "*";
  //
  // If it's not a real value change (unless it's related to a smart lookup asking for list), do nothing
  if (event.content.value === this.text && !requireSmartLookupList)
    return events;
  //
  // Update my text and my control value unless it's related to a smart lookup asking for list
  let valueToSend;
  if (requireSmartLookupList)
    valueToSend = "*";
  else {
    if (event.isComboFilter) {
      valueToSend = event.content.value;
      //
      // When emptying an autoLookup, server will resend the value list.
      // So empty text in order to empty client value list and wait for server value list
      if (this.parentField.autoLookup && valueToSend === "")
        this.updateElement({text: ""});
    }
    else {
      let text = event.content.value;
      //
      // Smart lookups fieldValues have always description as text
      if (this.parentField.smartLookup)
        text = control.control.lastDescription;
      //
      this.updateElement({text});
      //
      // Get control value to send
      valueToSend = control.getValueToSend();
    }
  }
  //
  if (this.isRowQbe) {
    event.content.value = valueToSend;
    events.push(...this.parentField.handleQbeFilter(event));
  }
  else {
    if (Client.mainFrame.isIDF) {
      // smartLookup or valueSource value changes have to be sent immediately
      if (!event.isComboFilter)
        event.immediate = !control.isListOwner() && control.isCombo();
      //
      if (control.customElement)
        event.immediate = true;
      //
      let flag = 0;
      let delay;
      //
      if (type === Client.IdfField.controlTypes.EDIT && !this.parentField.superActive)
        delay = Client.IdfMessagesPump.defaultDelay;
      //
      // If parent field is super active, send change immediately
      if (this.parentField.superActive || event.immediate) {
        flag = Client.IdfMessagesPump.eventTypes.IMMEDIATE;
        delay = Client.IdfMessagesPump.superActiveDelay;
      }
      //
      // If value to send ends with a space, don't send it immediately. In fact, server will remove that space.
      // So wait a bit in order to give time to user to write another charachter
      if (this.parentField.superActive && valueToSend.trim() !== valueToSend)
        delay = Client.IdfMessagesPump.whiteSpaceDelay;
      //
      // We count the number of text changes sent because if we send two consecutive changes
      // before the server sends the text back, the cursor moves to the beginning
      if (this.parentField.superActive)
        this.chgTextCount = (this.chgTextCount || 0) + 1;
      //
      events.push({
        id: "chg",
        content: {
          par1: valueToSend
        }
      });
      //
      events.forEach(e => {
        e.def = this.parentField.changeEventDef | flag;
        e.delay = delay;
        e.updateStartTime = !!this.parentField.superActive;
        e.content.oid = this.id;
      });
    }
    else {
      events.push({
        obj: this.parentField.id,
        id: "chgProp",
        content: {
          name: "text",
          value: valueToSend,
          index: this.getIndex(true),
          clid: Client.id
        }
      });
    }
  }
  //
  return events;
};


/**
 * Handle value activation
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleActivate = function (event)
{
  let events = [];
  //
  event.content = event.content || {};
  //
  if (this.parentField.isStatic() && !(this.parentField.isButton() || this.isClickable()))
    return events;
  //
  // If parent field is disabled and cannot be activate when disabled, return no events
  let isEnabled = this.parentField.isStatic() ? this.parentField.enabled : this.parentField.isEnabled(this.index);
  if (!isEnabled && !this.parentField.activableDisabled)
    return events;
  //
  // Get source control of given event
  let control = this.getSourceControl(event);
  let controlType = control.getType();
  //
  // Check if given event represents a click on control activator
  let isActivatorClick = control.isActivatorClick(event);
  //
  // If combo was open when I clicked on activator, do nothing because combo is going to be closed
  if (isActivatorClick && control.isCombo() && control.control?.displayTimerId)
    return events;
  //
  // If this is field value for row QBE or F3 on a list field, open QBE popup on activator click
  if (!Client.mainFrame.isEditing() && ((this.isRowQbe && isActivatorClick) || event.content.keyCode === 114)) {
    this.parentField.openFilterPopup();
    return events;
  }
  //
  if (this.isRowQbe)
    return events;
  //
  let isFunctionKey = event.content.keyCode === Client.IdfPanel.FKActField + 111;
  if (isFunctionKey)
    isActivatorClick = true;
  //
  let isButton = controlType === Client.IdfField.controlTypes.BUTTON;
  let isActivable =
          (isButton && (isEnabled || this.parentField.activableDisabled))
          || (!isButton && this.parentField.canActivate && (isActivatorClick || ["onDblclick", "onContextmenu"].includes(event.id)) && (isEnabled || this.parentField.activableDisabled))
          || this.isClickable();
  //
  // If parent field cannot activate
  if (!isActivable && (!this.parentField.hasValueSource || !this.parentField.command)) {
    // If user clicks on smart lookup activator, I have to send filter to server in order to receive the value list and thus open combo
    if (isActivatorClick && control.isCombo() && !control.isComboOpen())
      events.push(...this.parentField.activateCombo(event));
    //
    return events;
  }
  //
  // If field has an associated command, I notify the click on the command
  if (this.parentField.command) {
    events.push(...Client.eleMap[this.parentField.command].handleClick(event));
    return events;
  }
  //
  let waitingForList;
  if (!isActivable && isActivatorClick && this.parentField.hasValueSource)
    waitingForList = true;
  //
  events.push(...this.activateField(event, {waitingForList, isFunctionKey, isActivatorClick}));
  //
  return events;
};


/**
 * Activate field
 * @param {Object} event
 * @param {Object} options
 */
Client.IdfFieldValue.prototype.activateField = function (event, options)
{
  let events = [];
  let control = this.getSourceControl(event);
  let {waitingForList, isFunctionKey, isActivatorClick} = options;
  //
  if (Client.mainFrame.isIDF) {
    control.waitingForList = waitingForList;
    //
    // If parent field is static, click on value means click on header
    let par1 = this.parentField.isStatic() ? "cap" : undefined;
    //
    // If parent field is static, send parent field object id instead of value id
    let oid = this.parentField.isStatic() ? this.parentField.id : this.id;
    //
    events.push({
      id: "clk",
      def: this.parentField.clickEventDef,
      content: {
        oid,
        xck: event.content.offsetX,
        yck: event.content.offsetY,
        par1
      }
    });
  }
  else {
    if (this.parentField.isStatic()) {
      // TODO
    }
    else {
      let reason = Client.IdfField.activationReasons.ACTIVATOR_CLICK;
      if (event.id === "onDblclick")
        reason = Client.IdfField.activationReasons.DOUBLECLICK;
      else if (event.id === "onContextmenu")
        reason = isActivatorClick ? Client.IdfField.activationReasons.ACTIVATOR_RIGHTCLICK : Client.IdfField.activationReasons.RIGHTCLICK;
      else if (isFunctionKey)
        reason = Client.IdfField.activationReasons.FUNCTIONKEY;
      //
      events.push({
        id: "onActivated",
        obj: this.parentField.id,
        content: {
          reason
        }
      });
    }
  }
  //
  return events;
};


/**
 * Get blob commands
 */
Client.IdfFieldValue.prototype.getBlobCommands = function ()
{
  let blobCommands = {
    upload: this.parentPanel.isCommandEnabled(Client.IdfPanel.commands.CMD_BLOBEDIT),
    delete: this.parentPanel.isCommandEnabled(Client.IdfPanel.commands.CMD_BLOBDELETE),
    view: this.parentPanel.isCommandEnabled(Client.IdfPanel.commands.CMD_BLOBSAVEAS)
  };
  //
  let valueMimeType = this.blobMime || Client.IdfFieldValue.blobMimeTypes.EMPTY;
  //
  // If I'm not enabled or panel is in QBE status or it's on new row no upload and delete
  if (!this.parentField.isEnabled(this.index) || this.parentPanel.status === Client.IdfPanel.statuses.qbe || (this.parentPanel.isNewRow() && Client.mainFrame.isIDF)) {
    blobCommands.upload = false;
    blobCommands.delete = false;
  }
  //
  // With blob empty no view and delete
  if (valueMimeType === Client.IdfFieldValue.blobMimeTypes.EMPTY) {
    blobCommands.view = false;
    blobCommands.delete = false;
  }
  //
  return blobCommands;
};


/**
 * Get blob commands
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleBlobCommand = function (event)
{
  let events = [];
  switch (event.content.command) {
    case Client.IdfControl.blobCommands.UPLOAD:
      this.handleBlobUpload(event);
      break;

    case Client.IdfControl.blobCommands.DELETE:
      // TODO: this.doHighlightDelete(true);
      //
      let options = {
        type: Client.Widget.msgTypes.CONFIRM,
        text: Client.IdfResources.t("PAN_MSG_ConfirmDeleteBLOB", [this.parentField.header])
      };
      //
      Client.Widget.showMessageBox(options, result => {
        if (result === 1) {
          events.push(...this.handleBlobDelete(event));
          Client.mainFrame.sendEvents(events);
        }
      });
      //
      break;

    case Client.IdfControl.blobCommands.DOWNLOAD:
    case Client.IdfControl.blobCommands.VIEW:
      event.command = event.content.command;
      events.push(...this.handleBlobDownload(event));
      break;
  }
  //
  return events;
};


/**
 * Handle blob upload
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleBlobUpload = function (event)
{
  let errorMsg = "";
  let files = [];
  for (let i = 0; i < event.content.files.length; i++) {
    let file = event.content.files[i];
    //
    // Check if file extensions is valid
    let canUpload = false;
    if (this.parentField.uploadExtensions === "*.*")
      canUpload = true;
    else {
      // Get allowed mime types
      let allowedMimes = this.parentField.uploadExtensions.split(',');
      canUpload = allowedMimes.map(mime => mime.split(".").pop()).includes(file.name.split(".").pop());
    }
    //
    if (!canUpload) {
      errorMsg += errorMsg ? Client.IdfResources.t("SWF_ER_FILENOTSEND") : "";
      errorMsg += "<br>" + file.name + " : " + Client.IdfResources.t("SWF_ER_VALIDATIONFAILED");
    }
    //
    // Check if file size is valid
    if (!file.size) {
      canUpload = false;
      //
      errorMsg += errorMsg ? Client.IdfResources.t("SWF_ER_FILENOTSEND") : "";
      errorMsg += "<br>" + file.name + " : " + Client.IdfResources.t("SWF_ER_VALIDATIONFAILED");
    }
    else if (file.size > this.parentField.maxUploadSize) {
      canUpload = false;
      //
      // Calculate max size string
      let maxSizeString = this.parentField.maxUploadSize;
      let units = ["B", "KB", "MB", "GB"];
      for (let i = 0; i < units.length; i++) {
        if (this.parentField.maxUploadSize < Math.pow(1024, i + 1)) {
          maxSizeString = Math.round(this.parentField.maxUploadSize / Math.pow(1024, i), 0) + " " + units[i];
          break;
        }
      }
      //
      errorMsg += errorMsg ? Client.IdfResources.t("SWF_ER_FILENOTSEND") : "";
      errorMsg += "<br>" + file.name + " : " + Client.IdfResources.t("SWF_ER_FILESIZEEXCEEDED") + " (max " + maxSizeString + ")";
    }
    //
    // If file can be uploaded, add it to form data
    if (canUpload)
      files.push(file);
  }
  //
  // If there is an error message, show it
  if (errorMsg) {
    if (Client.mainFrame.isIDF)
      Client.Widget.showMessageBox({type: Client.Widget.msgTypes.ALERT, text: errorMsg});
    else {
      console.warn(errorMsg);
      //
      Client.mainFrame.sendEvents([{
          obj: this.parentField.id,
          id: "onUploadError",
          content: errorMsg.replaceAll("<br>", "\n").trim()
        }]);
    }
    //
    return;
  }
  //
  let wci = (this.parentField.multiUpload ? "IWFiles" : "IWUpload");
  //
  if (Client.idfOffline || (!Client.mainFrame.isIDF && !this.parentField.multiUpload)) {
    for (let i = 0; i < event.content.files.length; i++) {
      let file = event.content.files[i];
      let reader = new FileReader();
      reader.onload = ev => {
        let events = [];
        if (Client.mainFrame.isIDF)
          events.push({
            id: wci,
            def: Client.IdfMessagesPump.eventTypes.ACTIVE,
            content: {
              par1: this.parentField.id,
              par2: file.name,
              par3: file.type,
              par4: ev.target.result,
              par5: file.size
            }
          });
        else
          events.push({
            obj: this.parentField.id,
            id: "chgProp",
            content: {
              name: "text",
              value: ev.target.result,
              index: this.getIndex(true),
              clid: Client.id
            }
          });
        //
        Client.mainFrame.sendEvents(events);
      };
      //
      reader.readAsDataURL(file);
    }
  }
  else {
    // Calculate query string
    let qstring, req;
    if (Client.mainFrame.isIDF) {
      qstring = `?WCI=${wci}&WCE=${this.parentField.id}`;
      req = Client.mainFrame.messagesPump.createRequest();
      //
      let uploader = Client.eleMap[event.obj]?.getRootObject();
      req.uploaderId = uploader.id;
      //
      // Clear old uploads
      let fileStatus = document.getElementById(req.uploaderId);
      if (fileStatus)
        fileStatus.classList.add("multiupload-progress");
      //
      req.addEventListener("load", () => {
        if (req.status === 200) {
          if (fileStatus) {
            // Clear the progressbar
            fileStatus.classList.remove("multiupload-progress");
            fileStatus.style.backgroundSize = "";
          }
          //
          let text = req.responseText || "";
          if (text.indexOf("pppppp") === 0)
            text = text.substr(256, text.length - 256);
          //
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(text, "text/xml");
          //
          Client.mainFrame.handleIDFResponse(req.reqCode, xmlDoc);
        }
      }, false);
      //
      // Progress
      req.upload.addEventListener("progress", (evt) => {
        if (!evt.lengthComputable)
          return;
        //
        let perc = Math.ceil(evt.loaded / evt.total * 100);
        let fileStatus = document.getElementById(req.uploaderId);
        if (fileStatus)
          fileStatus.style.setProperty("background-size", perc + "% 100%", "important");
      });
      req.upload.addEventListener("error", (evt) => {
        if (fileStatus) {
          // Clear the progressbar
          fileStatus.classList.remove("multiupload-progress");
          fileStatus.style.backgroundSize = "";
        }
      });
    }
    else if (this.parentField.events.includes("onUpload")) {
      if (Client.isOffline()) {
        let events = [{
            obj: this.parentField.id,
            id: "fireOnUpload",
            content: files
          }];
        //
        Client.mainFrame.sendEvents(events);
      }
      else {
        qstring = Client.Utils.getRESTQueryString({msgType: "input-upload", objId: this.parentField.id});
        req = new XMLHttpRequest();
      }
    }
    //
    if (req) {
      let formData = new FormData();
      files.forEach((f, i) => formData.append("file" + i, f, f.name));
      //
      // Send post request
      req.open("POST", qstring, true);
      req.send(formData);
    }
  }
};


/**
 * Handle blob delete
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleBlobDelete = function (event)
{
  let events = [];
  if (Client.mainFrame.isIDF)
    events.push({
      id: "pantb",
      def: this.parentPanel.toolbarEventDef,
      content: {
        oid: this.parentPanel.id,
        obn: "delblob" + this.parentField.index
      }
    });
  else
    events.push({
      obj: this.parentField.id,
      id: "chgProp",
      content: {
        name: "text",
        index: this.getIndex(true),
        clid: Client.id
      }
    });
  //
  return events;
};


/**
 * Handle blob download
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleBlobDownload = function (event)
{
  let events = [];
  events.push({
    id: "fireOnDownloadBlob",
    obj: this.parentPanel.id,
    content: {
      field: this.parentField.index,
      row: this.getIndex(true) - 1,
      command: event.command
    }
  });
  //
  return events;
};

/**
 * Handle focus event
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleFocus = function (event)
{
  let events = [];
  switch (event.id) {
    case "onFocusin":
      // Focus the control only if focus occurred on external zone of control
      if (Client.Utils.findElementFromDomObj(event.content.srcEvent.srcElement)?.parentWidget === this)
        this.focus();
      //
      if (this.parentPanel.layout === Client.IdfPanel.layouts.list) {
        this.parentPanel.lastFocusedFieldValueInList = this;
        //
        // Handle the change of actualRow
        if (!this.parentField.isStatic())
          events.push(...this.parentPanel.handleRowChange(this.index));
      }
      else
        this.parentPanel.lastFocusedFieldInForm = this.parentField;
      break;

    case "onFocusout":
      // If the field is active when it loses focus I have to send the change event (which is queued)
      // However, if the onFocus event is also active,
      // I wait to send so as to merge the events into the same request
      if ((Client.IdfMessagesPump.isActiveEvent(this.parentField.changeEventDef) || this.isRowQbe)
              && !Client.IdfMessagesPump.isActiveEvent(this.parentPanel.focusEventDef))
        Client.mainFrame.messagesPump?.sendEvents(true);
      break;
  }
  //
  if (Client.mainFrame.isIDF) {
    events.push({
      id: "fev",
      def: this.parentPanel.focusEventDef,
      delay: 250,
      content: {
        oid: this.parentPanel.id,
        obn: this.parentField.index,
        par1: event.id === "onFocusin" ? "1" : "0"
      }
    });
  }
  else {
    let eventName = event.id === "onFocusin" ? "onFocus" : "onBlur";
    if (this.parentField.events.includes(eventName))
      events.push({
        id: "fireOnFocus",
        obj: this.parentPanel.id,
        content: {
          field: this.parentField.index,
          row: this.getIndex(true) - 1,
          eventName
        }
      });
  }
  return events;
};


/**
 * Handle selection change event
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.handleSelectionChange = function (event)
{
  return this.parentField.handleSelectionChange(event);
};


/**
 * Update qbe filter
 */
Client.IdfFieldValue.prototype.updateQbeFilter = function ()
{
  let text = this.parentField.qbeFilter;
  //
  if ((text || this.parentField.autoLookup) && !this.valueList)
    this.parentField.requestQBECombo();
  //
  // In case of CHECK control, if there isn't a qbe filter I have to set "indeterminate" state
  if (this.getControlType() === Client.IdfField.controlTypes.CHECK && !this.parentField.qbeFilter)
    text = "---";
  //
  let listControl = Client.eleMap[this.listControlId];
  if (this.parentField.smartLookup) {
    // If qbe filter is an array it means that it has be set by IdfFilterPopup. So calculate string to show into combo
    if (this.parentField.qbeFilter instanceof Array) {
      text = "";
      //
      // Get combo name separator
      let sep = listControl.getComboNameSeparator();
      //
      for (let i = 0; i < this.parentField.qbeFilter.length; i++)
        text += (text.length > 0 ? sep : "") + this.parentField.qbeFilter[i].name;
    }
    else if (this.parentField.qbeFilter.indexOf("fld:") !== -1) // Otherwise it comes from server as string
      text = listControl.getComboValueFromRValue(this.parentField.qbeFilter);
  }
  //
  this.updateElement({text});
};


/**
 * Get source control
 * @param {Object} event
 */
Client.IdfFieldValue.prototype.getSourceControl = function (event)
{
  let control;
  switch (event.obj) {
    case this.listContainerId:
    case this.listControlId:
      control = Client.eleMap[this.listControlId];
      break;

    case this.outListContainer?.id:
    case this.outListControl?.id:
      control = this.outListControl;
      break;

    case this.formContainer?.id:
    case this.formControl?.id:
      control = this.formControl;
      break;
  }
  //
  return control;
};


/**
 * Give focus to the element
 * @param {Object} options
 */
Client.IdfFieldValue.prototype.focus = function (options)
{
  let control;
  if (this.parentPanel.layout === Client.IdfPanel.layouts.list)
    control = Client.eleMap[this.listControlId] || this.outListControl;
  else
    control = this.formControl;
  //
  if (!control)
    return;
  //
  control.focus(options);
  //
  if (this.parentPanel.layout === Client.IdfPanel.layouts.list)
    this.parentPanel.lastFocusedFieldValueInList = this;
  else
    this.parentPanel.lastFocusedFieldInForm = this.parentField;
};


/**
 * Return the target to use for opening a popup on this widget
 * @returns {DomNode}
 */
Client.IdfFieldValue.prototype.getPopupTarget = function ()
{
  if (this.parentPanel.layout === Client.IdfPanel.layouts.list)
    return Client.eleMap[this.listContainerId] || this.outListContainer;
  else
    return this.formContainer;
};


/**
 * Focus near control
 * @param {Object} options
 */
Client.IdfFieldValue.prototype.focusNearControl = function (options)
{
  options = Object.assign({fieldValue: this}, options);
  return this.parentPanel.focusNearControl(options);
};


/**
 * Open combo
 */
Client.IdfFieldValue.prototype.openCombo = function ()
{
  let control;
  //
  // If panel mode is LIST get list control or out list control
  if (this.parentPanel.layout === Client.IdfPanel.layouts.list)
    control = this.parentField.isInList() ? Client.eleMap[this.listControlId] : this.outListControl;
  else // Otherwise get formControl
    control = this.formControl;
  //
  control?.updateElement({openCombo: true});
};



/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfFieldValue.prototype.close = function (firstLevel, triggerAnimation)
{
  if (!Client.mainFrame.isEditing())
    firstLevel = false;
  //
  Client.Widget.prototype.close.call(this, firstLevel, triggerAnimation);
  //
  if (firstLevel) {
    // Remove also the elements and the DOM obj
    Client.eleMap[this.listContainerId]?.close(firstLevel);
    Client.eleMap[this.listControlId]?.close(firstLevel);
    Client.eleMap[this.rowSelectorId]?.close(firstLevel);
    Client.eleMap[this.rowsGroupHeaderId]?.close(firstLevel);
    Client.eleMap[this.rowBreakerId]?.close(firstLevel);
    this.outListControl?.close(firstLevel);
    this.formControl?.close(firstLevel);
  }
  //
  if (this.parentPanel.lastFocusedFieldValueInList === this)
    delete this.parentPanel.lastFocusedFieldValueInList;
};


/**
 * Reset cached styles
 */
Client.IdfFieldValue.prototype.resetCachedStyles = function ()
{
  this.listStyle = {};
  this.rowSelectorStyle = {};
  this.rowsGroupHeaderStyle = {};
};


/**
 * Update error status
 * @param {Boolean} skipInList
 */
Client.IdfFieldValue.prototype.updateErrorStatus = function (skipInList)
{
  let errorText = this.rowErrorText || this.errorText;
  //
  // Update form invalid class
  Client.Widget.updateElementClassName(this.formContainer, "panel-invalid-value", !errorText);
  //
  // If I have to skip in list value, do nothing
  if (this.parentField.isInList() && skipInList)
    return;
  //
  let listContainer = this.parentField.isInList() ? Client.eleMap[this.listContainerId] : this.outListContainer;
  //
  // Update out list invalid class
  Client.Widget.updateElementClassName(listContainer, "panel-invalid-value", !errorText);
};


/**
 * Get tooltip
 * @param {Boolean} form
 */
Client.IdfFieldValue.prototype.getTooltip = function (form)
{
  let tooltip = null;
  //
  let tooltipTheme = "";
  let tooltipTitle = form ? this.parentField.formHeader : this.parentField.listHeader;
  //
  // Get tooltip text. Start with error text
  let tooltipText = this.rowErrorText || this.errorText || "";
  //
  // If there is an error text, use it
  if (tooltipText) {
    tooltipTheme = "error";
    //
    // Don't use parent field header as tooltip title if error is relative to entire row
    if (this.rowErrorText)
      tooltipTitle = "";
  }
  else {
    // Try to use my tooltip as tooltip text
    tooltipText = this.tooltip || "";
    //
    // If I have no tooltip but I have to use parent field tooltip on each row, use it
    if (!tooltipText && this.parentPanel.tooltipOnEachRow)
      tooltipText = this.parentField.tooltip || "";
  }
  //
  if (tooltipText) {
    tooltip = Client.Widget.getHTMLTooltip(tooltipTitle, tooltipText);
    tooltip.theme = tooltipTheme;
  }
  //
  if (Client.mainFrame.idfMobile) {
    if (!form && this.tooltip)
      tooltip = "<h6>" + this.tooltip + "</h6>";
    else
      tooltip = "";
  }
  //
  return tooltip;
};


/**
 * Insert new element
 * @param {Object} content - contains the element to insert and the id of the existing element. The new element is inserted before this element
 */
Client.IdfFieldValue.prototype.insertBefore = function (content)
{
  if (Client.mainFrame.isIDF)
    return Client.Element.prototype.insertBefore.call(this, content);
  //
  let sibIndex = this.parentField.customChildrenConf.length - 1;
  if (content.sib) {
    sibindex = this.parentField.customChildrenConf.findIndex(el => el.id === content.sib);
    if (sibIndex === -1)
      sibIndex = this.parentField.customChildrenConf.length - 1;
  }
  //
  let customChildrenConf = this.customChildrenConf?.slice() || [];
  let child = Object.assign({}, content.child);
  child.id = this.parentField.id + ":" + this.index + ":el" + (sibIndex + 1);
  //
  customChildrenConf.splice(sibIndex, 0, child);
  this.updateElement({customChildrenConf});
};


/**
 * Remove a child from the element
 * @param {Object} content - an object with the id of the element to remove
 */
Client.IdfFieldValue.prototype.removeChild = function (content)
{
  if (Client.mainFrame.isIDF)
    return Client.Element.prototype.insertBefore.call(this, content);
  //
  let childIndex = this.parentField.customChildrenConf.findIndex(el => el.id === content.id);
  if (childIndex === -1)
    return;
  //
  let customChildrenConf = this.customChildrenConf?.slice() || [];
  let child = customChildrenConf[childIndex];
  child._remove = true;
  this.updateElement({customChildrenConf});
  delete child._remove;
  //
  customChildrenConf.splice(childIndex, 1);
  this.updateElement({customChildrenConf});
};


/**
 * Update template
 * @param {Object} content
 */
Client.IdfFieldValue.prototype.updateTemplate = function (content)
{
  let {obj, props} = content;
  //
  let childIndex = this.parentField.customChildrenConf.findIndex(el => el.id === obj);
  if (childIndex === -1)
    return;

  let customChildrenConf = this.customChildrenConf?.slice() || [];
  //
  let customChild = Client.eleMap[customChildrenConf[childIndex].id];
  customChild?.updateElement(Object.assign({}, props));
};


/**
 * Update rows group header
 * @param {Object} update
 */
Client.IdfFieldValue.prototype.updateRowsGroupHeader = function (update)
{
  if (update.expanded)
    Client.Widget.updateObject(Client.eleMap[this.expandRowsGroupButtonId], {icon: this.rowsGroup?.expanded ? "remove" : "add"});
  //
  if (update.label)
    Client.Widget.updateObject(Client.eleMap[this.rowsGroupHeaderTextId], {innerText: this.rowsGroup?.label || ""});
};


/**
 * Convert image resize mode
 */
Client.IdfFieldValue.prototype.convertImageResizeMode = function ()
{
  // Both IdfField and IdfSpan have their own resize modes list.
  // The two resize modes have different names, but similar behaviour.
  // Thus standardize modes using control resize modes list.
  let imgResizeMode;
  switch (this.parentField.imageResizeMode) {
    case Client.IdfField.stretches.REPEAT:
      imgResizeMode = Client.IdfControl.stretches.REPEAT;
      break;

    case Client.IdfField.stretches.FIT:
      imgResizeMode = Client.IdfControl.stretches.FILL;
      break;

    case Client.IdfField.stretches.CENTER:
      imgResizeMode = Client.IdfControl.stretches.CENTER;
      break;
  }
  //
  return imgResizeMode;
};

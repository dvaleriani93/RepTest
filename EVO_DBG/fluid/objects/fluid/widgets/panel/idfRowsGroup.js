/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A group of panel data rows
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfRowsGroup = function (widget, parent, view)
{
  // Set grouped rows root on parent panel
  if (widget.level === -1) {
    parent.setGroupedRowsRoot(this);
    this.parentPanel = parent;
    //
    this.groupsIds = [];
  }
  else
    this.parentPanel = parent.parentPanel;
  //
  // Set default values
  widget = Object.assign({
    startingRow: 0,
    endingRow: 0,
    level: -1,
    expanded: false,
    expandEventDef: (Client.mainFrame.isIDF ? Client.IdfMessagesPump.eventTypes.ACTIVE : undefined)
  }, widget);
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfRowsGroup extend Client.Widget
Client.IdfRowsGroup.prototype = new Client.Widget();


Client.IdfRowsGroup.transPropMap = {
  lbl: "label",
  str: "startingRow",
  end: "endingRow",
  lvl: "level",
  exp: "expanded",
  evt: "expandEventDef"
};


/**
 * Create element configuration from xml
 * @param {XmlNode} xml
 */
Client.IdfRowsGroup.createConfigFromXml = function (xml)
{
  let config = {};
  //
  // Look into panel children (i.e. fields) in order to find start and end index of given block of data
  for (let i = 0; i < xml.childNodes.length; i++) {
    let child = xml.childNodes[i];
    //
    if (child.nodeName !== "agr")
      continue;
    //
    let fid, shw = "";
    let attrList = child.attributes;
    for (let j = 0; j < attrList.length; j++) {
      let attrNode = attrList[j];
      if (attrNode.nodeName === "fid")
        fid = parseInt(attrNode.nodeValue);
      else if (attrNode.nodeName === "shw")
        shw = attrNode.nodeValue;
    }
    //
    if (fid !== undefined) {
      config.aggregations = config.aggregations || {};
      config.aggregations[fid] = shw;
    }
  }
  //
  return config;
};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfRowsGroup.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfRowsGroup.transPropMap.str:
      case Client.IdfRowsGroup.transPropMap.end:
      case Client.IdfRowsGroup.transPropMap.lvl:
      case Client.IdfRowsGroup.transPropMap.evt:
        props[p] = parseInt(props[p]);
        break;

      case Client.IdfRowsGroup.transPropMap.exp:
        props[p] = props[p] === "1";
        break;
    }
  }
};


/**
 * Create elements configuration
 */
Client.IdfRowsGroup.prototype.createElementsConfig = function ()
{
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfRowsGroup.prototype.realize = function (widget, parent, view)
{
  // Create widget children
  this.createChildren(widget);
};


/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfRowsGroup.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  let propsToUpdate = {};
  //
  if (props.level !== undefined) {
    this.level = props.level;
    //
    if (this.level === -1) {
      Client.IdfRowsGroup.setIndex(this, 0);
      props.expanded = true;
    }
  }
  //
  if (props.expanded !== undefined) {
    this.expanded = props.expanded;
    propsToUpdate.expanded = true;
    //
    if (!this.realizing)
      this.handleExpansion();
  }
  //
  if (props.label !== undefined) {
    this.label = props.label;
    propsToUpdate.label = true;
  }
  //
  if (props.aggregations !== undefined) {
    this.aggregations = props.aggregations;
    propsToUpdate.label = true;
  }
  //
  if (this.parentFieldValue)
    this.parentFieldValue.updateRowsGroupHeader(propsToUpdate);
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfRowsGroup.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      this.updateElement({expanded: !this.expanded});
      //
      // Send collapse event
      if (Client.mainFrame.isIDF) {
        let numRows = this.parentPanel.getNumRows();
        let rw = -1;
        //
        if (this.parentPanel.groupedRowsRoot.isRowVisible(this.parentPanel.groupedRowsRoot.realIndexToGroupedIndex(this.startingRow))) {
          let groupedStartingRow = this.parentPanel.groupedRowsRoot.realIndexToGroupedIndex(this.startingRow);
          for (let i = this.parentPanel.groupedActualPosition; i <= groupedStartingRow; i++)
            rw += this.parentPanel.groupedRowsRoot.isRowVisible(i) ? 1 : 0;
          //
          if (rw < 0)
            rw = 0;
          if (rw >= numRows)
            rw = numRows - 1;
        }
        //
        events.push({
          id: "grlexp",
          def: this.expandEventDef,
          content: {
            oid: this.id,
            obn: this.expanded ? 1 : 0,
            par1: rw,
            par2: (Client.mainFrame.device.isMobile || Client.mainFrame.idfMobile) ? -1 : this.parentPanel.groupedRowsRoot.getVisibleRowsCount()
          }
        });
      }
      else {
        events.push({
          id: "chgProp",
          obj: this.id,
          content: {
            name: "expanded",
            value: this.expanded,
            clid: Client.id
          }
        });
      }
      break;
  }
  //
  return events;
};


/**
 * Apply visual style
 */
Client.IdfRowsGroup.prototype.applyVisualStyle = function ()
{
};


/**
 * Check if index-th row is visible
 * @param {Integer} index
 */
Client.IdfRowsGroup.prototype.isRowVisible = function (index)
{
  // New rows don't belong to any group, so they are always visible
  if (this.level === -1 && index > this.groupedEndingRow)
    return true;
  //
  // If given index is in my boundaries
  if (this.level !== -1 && index >= this.groupedStartingRow - 1 && index <= this.groupedEndingRow) {
    // If given index is a group header row index (i. e. when index === this.index), its visibility does not depend on its expansion status,
    // but it depends on parents expansion statuses
    if (index === this.index)
      return true;
    else if (!this.expanded) // If given index is a data row index, row is not visible if its group is not expanded
      return false;
    else if (!this.elements.length) // If index-th row belongs to an expanded leaf group, it is visible
      return true;
  }
  //
  // Recursively check if index-th row is visible
  for (let i = 0; i < this.elements.length; i++) {
    let isVisible = this.elements[i].isRowVisible(index);
    if (isVisible)
      return isVisible;
  }
  //
  return false;
};


/**
 * Convert real index into grouped index
 * @param {Integer} realIndex
 */
Client.IdfRowsGroup.prototype.realIndexToGroupedIndex = function (realIndex)
{
  // Rows indexes are 1-based, so 0 is not related to any row.
  // Since I cannot convert it, return it
  if (realIndex === 0)
    return realIndex;
  //
  // If given realIndex is related to a new row, calculate grouped new row index
  if (this.level === -1 && this.endingRow < realIndex)
    return this.groupedEndingRow + (realIndex - this.endingRow);
  //
  if (this.startingRow > realIndex)
    return;
  //
  if (!this.elements.length && realIndex >= this.startingRow && realIndex <= this.endingRow)
    return this.index + (realIndex - this.startingRow) + 1;
  //
  let groupedIndex;
  //
  // Recursively calc grouped index
  for (let i = 0; i < this.elements.length; i++)
    groupedIndex = groupedIndex ?? this.elements[i].realIndexToGroupedIndex(realIndex);
  //
  return groupedIndex;
};


/**
 * Convert grouped index into real index
 * @param {Integer} groupedIndex
 */
Client.IdfRowsGroup.prototype.groupedIndexToRealIndex = function (groupedIndex)
{
  // Rows indexes are 1-based, so 0 is not related to any row.
  // Since I cannot convert it, return it
  if (groupedIndex === 0)
    return groupedIndex;
  //
  // If given groupedIndex is related to a new row, calculate real new row index
  if (this.level === -1 && groupedIndex > this.groupedEndingRow)
    return this.parentPanel.getTotalRows(true) + (groupedIndex - this.parentPanel.getTotalRows());
  //
  if (groupedIndex === this.index)
    return this.startingRow;
  //
  if (this.groupedStartingRow > groupedIndex)
    return;
  //
  if (!this.elements.length && groupedIndex >= this.groupedStartingRow && groupedIndex <= this.groupedEndingRow)
    return this.startingRow + (groupedIndex - this.index) - 1;
  //
  let realIndex;
  //
  // Recursively calc real index
  for (let i = 0; i < this.elements.length; i++)
    realIndex = realIndex ?? this.elements[i].groupedIndexToRealIndex(groupedIndex);
  //
  return realIndex;
};


/**
 * Set index in order to handle all panel rows in the same way (both data and group header rows)
 * @param {Client.IdfRowsGroup} rowsGroup
 * @param {Integer} index
 */
Client.IdfRowsGroup.setIndex = function (rowsGroup, index)
{
  rowsGroup.index = index;
  rowsGroup.parentPanel.groupedRowsRoot.groupsIds[rowsGroup.index] = rowsGroup.id;
  rowsGroup.groupedStartingRow = rowsGroup.index + 1;
  //
  index++;
  //
  if (!rowsGroup.elements.length) {
    index += (rowsGroup.endingRow - rowsGroup.startingRow) + 1;
    rowsGroup.groupedEndingRow = index - 1;
  }
  else {
    rowsGroup.elements.forEach(group => {
      index = Client.IdfRowsGroup.setIndex(group, index);
    });
    //
    let lastChildGroup = rowsGroup.elements[rowsGroup.elements.length - 1];
    rowsGroup.groupedEndingRow = lastChildGroup.groupedEndingRow;
  }
  //
  return index;
};


/**
 * Get number of visible rows
 * @param {Integer} limit
 */
Client.IdfRowsGroup.prototype.getVisibleRowsCount = function (limit)
{
  if (limit && this.startingRow > limit)
    return 0;
  //
  // A collapsed group shows just its header
  if (!this.expanded)
    return 1;
  //
  // Count subgroups rows
  if (this.elements.length > 0) {
    // Add header to rows count (root group has no header)
    let rows = this.level === -1 ? 0 : 1;
    //
    // Recursively get visible rows count
    for (let i = 0; i < this.elements.length; i++)
      rows += this.elements[i].getVisibleRowsCount(limit);
    //
    return rows;
  }
  else {
    // If group is empty, return 0
    if (this.startingRow === 1 && this.endingRow === 0)
      return 0;
    //
    // If limit is current group starting row, return 2 (group header + first row)
    if (this.startingRow === limit)
      return 2;
    //
    // Return group range + 1 (group header)
    return (this.endingRow - this.startingRow + 1) + 1;
  }
};


/**
 * Handle expansion
 */
Client.IdfRowsGroup.prototype.handleExpansion = function ()
{
  this.parentPanel.fillBufferVideo({rowsGroup: this});
  //
  // If my starting row is visible, select it
  if (this.parentPanel.groupedRowsRoot.isRowVisible(this.parentPanel.groupedRowsRoot.realIndexToGroupedIndex(this.startingRow))) {
    this.parentPanel.groupedActualRow = this.groupedStartingRow - this.parentPanel.groupedActualPosition;
    this.parentPanel.updateElement({actualRow: this.startingRow - this.parentPanel.actualPosition, skipScroll: true, fromClient: true, calcLayout: true});
  }
};
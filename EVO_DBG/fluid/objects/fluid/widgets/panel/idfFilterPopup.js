/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A popup to filter idfField's values
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfFilterPopup = function (widget, parent, view)
{
  this.field = widget.field;
  this.valueList = this.field.valueList;
  this.controlType = this.getFieldControlType();
  //
  this.filterTypeControls = [];
  this.filterValueControls = [];
  this.filterBetweenControls = [];
  this.filterItems = [];
  this.filterItemCloseButtons = [];
  //
  // Init combo selection
  if (this.controlType === Client.IdfField.controlTypes.COMBO) {
    let qbeFilter = this.field.qbeFilter || "";
    let sep = this.field.smartLookup && qbeFilter.includes(Client.IdfControl.rValueSeparator) ? Client.IdfControl.rValueSeparator : this.field.comboSeparator;
    this.comboSelection = qbeFilter ? qbeFilter.split(sep) : [];
  }
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfFilterPopup extend Client.Widget
Client.IdfFilterPopup.prototype = new Client.Widget();


Client.IdfFilterPopup.filterTypes = {
  VALUE: 1,
  STARTS: 2,
  NOTSTARTS: 3,
  ENDS: 4,
  NOTENDS: 5,
  CONTAINS: 6,
  NOTCONTAINS: 7,
  DIFFERENT: 8,
  MAJOR: 9,
  MINOR: 10,
  BETWEEN: 11,
  EMPTY: 12,
  NOTEMPTY: 13
};


/**
 * Create elements configuration
 */
Client.IdfFilterPopup.prototype.createElementsConfig = function ()
{
  // Get proper reference element id for the popup
  let fieldContainerId;
  if (this.field.parent.layout === Client.IdfPanel.layouts.list)
    fieldContainerId = this.field.isInList() ? this.field.listContainerId : this.field.outListContainerId;
  else
    fieldContainerId = this.field.formContainerId;
  //
  let refId = Client.eleMap[fieldContainerId].getRootObject().id;
  let offset = this.field.parent.canUseRowQbe() ? Client.eleMap[this.field.parent.qbeRowConf.id].getRootObject().offsetHeight : 1;
  //
  let options = {mode: "popup", autoclose: true, ref: {id: refId, offset, position: "bottom-left"}, width: "400px", height: "376px", extcls: "filter-popup-modal"};
  if (!(Client.mainFrame.device.isMobile || Client.mainFrame.idfMobile || Client.mainFrame.device.isMobilePreview))
    options.animation = false;
  this.viewConf = this.createElementConfig({type: "view", options, elements: []});
  //
  this.pageConf = this.createElementConfig({c: "IonPage", className: "filter-popup-page", events: ["onkeyup"]});
  this.viewConf.elements.push(this.pageConf);
  //
  // Create header configuration
  this.createHeaderConfig();
  //
  // Create content configuration
  this.createContentConfig();
  //
  // Create footer configuration
  // the footer must be last in the dom to let the browser handle the tab order correctly
  this.createFooterConfig();
};


/**
 * Create header configuration
 */
Client.IdfFilterPopup.prototype.createHeaderConfig = function ()
{
  let headerConf = this.createElementConfig({c: "IonHeader", className: "filter-popup-header"});
  this.pageConf.children.push(headerConf);
  //
  // Create navbar configuration
  let navbarConf = this.createElementConfig({c: "IonNavBar", className: "filter-popup-navbar", backButton: true, events: ["onBackButton"]});
  headerConf.children.push(navbarConf);
  //
  // Create title configuration
  let innerHTML = Client.Widget.getHTMLForCaption(this.field.listHeader);
  this.titleConf = this.createElementConfig({c: "IonTitle", className: "filter-popup-title", innerHTML});
  navbarConf.children.push(this.titleConf);
  //
  // Create buttons configuration
  let buttonsConf = this.createElementConfig({c: "IonButtons", className: "filter-popup-navbar-buttons"});
  navbarConf.children.push(buttonsConf);
  //
  // Create close button configuration
  this.closeButtonConf = this.createElementConfig({c: "IonButton", icon: "close", className: "filter-popup-close-button", events: ["onClick"]});
  buttonsConf.children.push(this.closeButtonConf);
};


/**
 * Create footer configuration
 */
Client.IdfFilterPopup.prototype.createFooterConfig = function ()
{
  let footerConf = this.createElementConfig({c: "IonFooter", className: "filter-popup-footer"});
  this.pageConf.children.push(footerConf);
  //
  // Create apply button configuration
  this.applyButtonConf = this.createElementConfig({c: "IonButton", label: Client.IdfResources.t("FIL_DOFILTER"), className: "filter-popup-footer-button main-action", events: ["onClick"]});
  footerConf.children.push(this.applyButtonConf);
  //
  // Create clear button configuration
  this.clearButtonConf = this.createElementConfig({c: "IonButton", label: Client.IdfResources.t("FIL_CLEARFILTER"), className: "filter-popup-footer-button", events: ["onClick"]});
  footerConf.children.push(this.clearButtonConf);
};


/**
 * Create content configuration
 */
Client.IdfFilterPopup.prototype.createContentConfig = function ()
{
  this.contentConf = this.createElementConfig({c: "IonContent", className: "filter-popup-content"});
  this.pageConf.children.push(this.contentConf);
  //
  if (this.field.parent.searchMode === Client.IdfPanel.searchModes.header) {
    // If field is sortable, create sort container configuration
    if (this.field.isSortable())
      this.createSortConfig();
    //
    // If panel can group, create grouping container configuration
    if (this.field.parent.canGroup && this.field.parent.showGroups)
      this.createSortConfig(true);
  }
  //
  this.filtersAreaConf = this.createElementConfig({c: "Container", className: "filter-popup-filters-area"});
  this.contentConf.children.push(this.filtersAreaConf);
};


/**
 * Create sort configuration
 * @param {Boolean} grouping
 */
Client.IdfFilterPopup.prototype.createSortConfig = function (grouping)
{
  let mode = this.field[grouping ? "groupingMode" : "sortMode"];
  //
  let containerConf = this.createElementConfig({c: "Container", className: "filter-popup-item sort"});
  this.contentConf.children.push(containerConf);
  //
  // Create text configuration
  let text = grouping ? Client.IdfResources.t("FIL_GROUP_CAPTION") : Client.IdfResources.t("FIL_SORT_CAPTION");
  let textConf = this.createElementConfig({c: "IonText", type: "span", innerText: text, className: "filter-popup-sort-text"});
  containerConf.children.push(textConf);
  //
  // Create buttons configuration
  let buttonsConf = this.createElementConfig({c: "IonButtons", className: "filter-popup-sort-buttons"});
  containerConf.children.push(buttonsConf);
  //
  // Create ASC button configuration
  let ascButtonConf = this.createElementConfig({c: "IonButton", icon: "arrow-dropup", className: "filter-popup-button" + (mode === Client.IdfField.sortModes.ASC ? " active" : ""), events: ["onClick"]});
  buttonsConf.children.push(ascButtonConf);
  if (grouping)
    this.groupingAscButtonId = ascButtonConf.id;
  else
    this.sortAscButtonId = ascButtonConf.id;
  //
  // Create DESC button configuration
  let descButtonConf = this.createElementConfig({c: "IonButton", icon: "arrow-dropdown", className: "filter-popup-button" + (mode === Client.IdfField.sortModes.DESC ? " active" : ""), events: ["onClick"]});
  buttonsConf.children.push(descButtonConf);
  if (grouping)
    this.groupingDescButtonId = descButtonConf.id;
  else
    this.sortDescButtonId = descButtonConf.id;
  //
  // Create clear button configuration
  let sortActive = this.field.sortMode !== Client.IdfField.sortModes.NONE;
  let groupingActive = this.field.groupingMode !== Client.IdfField.groupingModes.NONE;
  if ((grouping && groupingActive) || (!grouping && sortActive)) {
    let label = grouping ? Client.IdfResources.t("FIL_DEGROUP_LABEL") : Client.IdfResources.t("FIL_SORT_CLEAR");
    let clearButtonConf = this.createElementConfig({c: "IonButton", label, className: "filter-popup-button", events: ["onClick"]});
    buttonsConf.children.push(clearButtonConf);
    if (grouping)
      this.clearGroupingButtonId = clearButtonConf.id;
    else
      this.clearSortButtonId = clearButtonConf.id;
  }
};


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfFilterPopup.prototype.realize = function (widget, parent, view)
{
  // Create elements configuration
  this.createElementsConfig(widget);
  //
  Client.mainFrame.openView(this.viewConf);
  //
  this.createFilters();
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfFilterPopup.prototype.onEvent = function (event)
{
  let events = Client.Widget.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "onClick":
      if (event.obj === this.closeButtonConf.id)
        this.close(true);
      else if (event.obj === this.applyButtonConf.id)
        events.push(...this.handleApplyFilter());
      else if (event.obj === this.clearButtonConf.id)
        events.push(...this.handleApplyFilter(true));
      else if (event.obj === this.sortAscButtonId)
        events.push(...this.handleSort({sortMode: Client.IdfField.sortModes.ASC}));
      else if (event.obj === this.sortDescButtonId)
        events.push(...this.handleSort({sortMode: Client.IdfField.sortModes.DESC}));
      else if (event.obj === this.clearSortButtonId)
        events.push(...this.handleSort({sortMode: Client.IdfField.sortModes.NONE}));
      else if (event.obj === this.groupingAscButtonId)
        events.push(...this.handleGrouping(Client.IdfField.groupingModes.ASC));
      else if (event.obj === this.groupingDescButtonId)
        events.push(...this.handleGrouping(Client.IdfField.groupingModes.DESC));
      else if (event.obj === this.clearGroupingButtonId)
        events.push(...this.handleGrouping(Client.IdfField.groupingModes.NONE));
      else {
        let closeButton = this.filterItemCloseButtons.find(button => button.id === event.obj);
        let closeButtonIdx = this.filterItemCloseButtons.findIndex(button => button.id === event.obj);
        if (closeButton) {
          this.filterItems[closeButtonIdx].close(true);
          //
          this.filterItems.splice(closeButtonIdx, 1);
          this.filterItemCloseButtons.splice(closeButtonIdx, 1);
          this.filterTypeControls.splice(closeButtonIdx, 1);
          this.filterValueControls.splice(closeButtonIdx, 1);
          this.filterBetweenControls.splice(closeButtonIdx, 1);
          //
          // Focus last filter value
          this.filterValueControls[this.filterValueControls.length - 1]?.focus();
        }
      }
      break;

    case "chgProp":
      if (event.content.name === "value")
        events.push(...this.handleChange(event));
      else if (event.content.name === "checked") {
        if (this.valueList && (this.field.isCombo() || this.field.autoLookup)) {
          let selectedItems = this.filterValueControls[0].getRootObject(true).elements.filter(item => item.elements[0].getRootObject().checked);
          for (let i = 0; i < this.valueList.items.length; i++) {
            let item = this.valueList.items[i];
            let itemValue = this.field.smartLookup ? item.rValue : item.value.toString();
            //
            let idx = this.comboSelection.indexOf(itemValue);
            let selected = selectedItems.find(sel => {
              if (this.field.smartLookup)
                return sel.getRootObject().itemRValue === itemValue;
              else
                return sel.getRootObject().itemValue.toString() === itemValue;
            });
            //
            if (selected && idx === -1)
              this.comboSelection.push(itemValue);
            else if (!selected && idx !== -1)
              this.comboSelection.splice(idx, 1);
          }
        }
      }
      break;

    case "onBackButton":
      events.push(...this.handleApplyFilter());
      break;

    case "onKeyup":
      events.push(...this.handleKeyUp(event));
      break;
  }
  //
  return events;
};


/**
 * Create filter item
 * @param {Object} filter
 */
Client.IdfFilterPopup.prototype.createFilterItem = function (filter)
{
  filter = filter || {};
  let isEdit = this.needEditControl();
  //
  let filtersArea = Client.eleMap[this.filtersAreaConf.id];
  //
  let filterItem;
  let typeContainer, valueContainer;
  //
  // Create filter item
  if (![Client.IdfField.controlTypes.CHECK, Client.IdfField.controlTypes.OPTION].includes(this.controlType)) {
    let filterItemConf = this.createElementConfig({c: "Container", className: "filter-popup-item" + (isEdit ? "" : " search")});
    filterItem = this.view.createElement(filterItemConf, filtersArea, this.view);
    filtersArea.elements.push(filterItem);
    //
    typeContainer = filterItem;
    valueContainer = filterItem;
    if (isEdit) {
      let filterTypeConf = this.createElementConfig({c: "Container", className: "filter-popup-type"});
      let filterType = this.view.createElement(filterTypeConf, filterItem, this.view);
      filterItem.elements.push(filterType);
      //
      let filterValueConf = this.createElementConfig({c: "Container", className: "filter-popup-value"});
      let filterValue = this.view.createElement(filterValueConf, filterItem, this.view);
      filterItem.elements.push(filterValue);
      //
      typeContainer = filterType;
      valueContainer = filterValue;
    }
    //
    this.filterItems.push(filterItem);
    //
    // Create filter type control
    this.createFilterTypeControl(filter.type, typeContainer);
  }
  //
  // Create filter value control
  this.createFilterValueControl(filter, valueContainer);
  //
  if (isEdit) {
    // Create filter item close button
    let props = {
      c: "IonButton",
      icon: "close-circle",
      style: {visibility: filter.value || Client.IdfFilterPopup.isEmptyOrNotEmpty(filter.type) ? "visible" : "hidden"},
      className: "generic-btn filter-popup-remove-item-button",
      events: ["onClick"]
    };
    //
    let filterItemCloseButtonConf = this.createElementConfig(props);
    let filterItemCloseButton = this.view.createElement(filterItemCloseButtonConf, filterItem, this.view);
    filterItem.elements.push(filterItemCloseButton);
    //
    this.filterItemCloseButtons.push(filterItemCloseButton);
  }
};


/**
 * Get filter types based on field data type
 */
Client.IdfFilterPopup.prototype.getFilterTypes = function ()
{
  let types = [];
  //
  if (Client.IdfField.isNumeric(this.field.dataType) || Client.IdfField.isDateOrTime(this.field.dataType)) {
    types.push({value: Client.IdfFilterPopup.filterTypes.VALUE, name: Client.IdfResources.t("FIL_VALUE")});
    types.push({value: Client.IdfFilterPopup.filterTypes.DIFFERENT, name: Client.IdfResources.t("FIL_DIFFERENT")});
    types.push({value: Client.IdfFilterPopup.filterTypes.MAJOR, name: Client.IdfResources.t("FIL_MAJOR")});
    types.push({value: Client.IdfFilterPopup.filterTypes.MINOR, name: Client.IdfResources.t("FIL_MINOR")});
    types.push({value: Client.IdfFilterPopup.filterTypes.BETWEEN, name: Client.IdfResources.t("FIL_BETWEEN")});
    //
    types.push({value: Client.IdfFilterPopup.filterTypes.EMPTY, name: Client.IdfResources.t("FIL_EMPTY")});
    types.push({value: Client.IdfFilterPopup.filterTypes.NOTEMPTY, name: Client.IdfResources.t("FIL_NOTEMPTY")});
  }
  else {
    let idfLike = Client.mainFrame.isIDF && this.field.comboSeparator === ";" && this.field.QBELike;
    let idcLike = !Client.mainFrame.isIDF && this.field.searchMode !== Client.IdfField.searchModes.NOLIKE;
    if (idfLike) {
      types.push({value: Client.IdfFilterPopup.filterTypes.STARTS, name: Client.IdfResources.t("FIL_STARTS")});
      types.push({value: Client.IdfFilterPopup.filterTypes.ENDS, name: Client.IdfResources.t("FIL_ENDS")});
      types.push({value: Client.IdfFilterPopup.filterTypes.CONTAINS, name: Client.IdfResources.t("FIL_CONTAINS")});
    }
    else if (idcLike) {
      types.push({value: Client.IdfFilterPopup.filterTypes.STARTS, name: Client.IdfResources.t("FIL_STARTS")});
      types.push({value: Client.IdfFilterPopup.filterTypes.NOTSTARTS, name: Client.IdfResources.t("FIL_NOTSTARTS")});
      types.push({value: Client.IdfFilterPopup.filterTypes.ENDS, name: Client.IdfResources.t("FIL_ENDS")});
      types.push({value: Client.IdfFilterPopup.filterTypes.NOTENDS, name: Client.IdfResources.t("FIL_NOTENDS")});
      types.push({value: Client.IdfFilterPopup.filterTypes.CONTAINS, name: Client.IdfResources.t("FIL_CONTAINS")});
      types.push({value: Client.IdfFilterPopup.filterTypes.NOTCONTAINS, name: Client.IdfResources.t("FIL_NOTCONTAINS")});
    }
    //
    types.push({value: Client.IdfFilterPopup.filterTypes.VALUE, name: Client.IdfResources.t("FIL_VALUE")});
    if (!idcLike)
      types.push({value: Client.IdfFilterPopup.filterTypes.DIFFERENT, name: Client.IdfResources.t("FIL_DIFFERENT")});
    types.push({value: Client.IdfFilterPopup.filterTypes.EMPTY, name: Client.IdfResources.t("FIL_EMPTY")});
    types.push({value: Client.IdfFilterPopup.filterTypes.NOTEMPTY, name: Client.IdfResources.t("FIL_NOTEMPTY")});
  }
  //
  return types;
};


/**
 * Create control to choose filter type
 * @param {String} filterTypeValue
 * @param {Element} container
 */
Client.IdfFilterPopup.prototype.createFilterTypeControl = function (filterTypeValue, container)
{
  // If control type is EDIT I have to create a COMBO control having filter types as items.
  // Otherwise (CHECK, OPTION, COMBO) I have to create an EDIT control to allow user to search values to filter by
  let isEdit = this.needEditControl();
  //
  // Get filter types
  let filterTypes = this.getFilterTypes();
  //
  let props = {
    c: "IdfControl",
    dataType: isEdit ? this.field.dataType : Client.IdfField.dataTypes.TEXT,
    enabled: true,
    noFilter: true,
    activatorImage: isEdit ? "" : "search",
    activableDisabled: isEdit,
    visualStyle: this.field.getVisualStyle(),
    type: isEdit ? Client.IdfField.controlTypes.COMBO : Client.IdfField.controlTypes.EDIT,
    useInput: !isEdit,
    placeholder: isEdit ? "" : Client.IdfResources.t("FIL_SEARCH_PLACE"),
    valueList: isEdit ? {items: filterTypes, isStatic: true} : undefined,
    value: isEdit ? filterTypeValue || filterTypes[0].value : undefined,
    container,
    className: "filter-popup-type-control",
    comboClass: "filter-popup-combo",
    readOnly: isEdit,
    superActive: true
  };
  let filterTypeControlConf = this.createElementConfig(props);
  //
  let filterTypeControl = this.view.createElement(filterTypeControlConf, container, this.view);
  this.elements.push(filterTypeControl);
  //
  this.filterTypeControls.push(filterTypeControl);
};


/**
 * Create control to insert filter value
 * @param {Object} filter
 * @param {Element} container
 */
Client.IdfFilterPopup.prototype.createFilterValueControl = function (filter, container)
{
  let filterValueType = Client.IdfField.controlTypes.CHECKLIST;
  let className = "filter-popup-checklist";
  let contentEditable = false;
  let controlContainer = Client.eleMap[this.filtersAreaConf.id];
  //
  // If control type is EDIT I have to create an EDIT control to allow use to filter.
  // If control type is CHECK, I have to create an OPTION control having "true", "false", "empty" and "not empty" as items.
  // Otherwise (CHECK, OPTION, COMBO) I have to create a CHECKLIST control to allow user to filter by one or more values
  if (this.needEditControl()) {
    filterValueType = Client.IdfField.controlTypes.EDIT;
    className = Client.IdfFilterPopup.isEmptyOrNotEmpty(filter.type) ? "" : "filter-popup-value-control";
    contentEditable = true;
    if (filter.type === Client.IdfFilterPopup.filterTypes.BETWEEN)
      className += " filter-popup-value-between-control";
    controlContainer = container;
  }
  else if (this.controlType === Client.IdfField.controlTypes.CHECK)
    filterValueType = Client.IdfField.controlTypes.OPTION;
  //
  let props = {
    c: "IdfControl",
    dataType: this.field.dataType === Client.IdfField.dataTypes.DATETIME ? Client.IdfField.dataTypes.DATE : this.field.dataType,
    enabled: !Client.IdfFilterPopup.isEmptyOrNotEmpty(filter.type),
    canActivate: false,
    type: filterValueType,
    comboSeparator: this.field.comboSeparator,
    value: filter.value || "",
    valueList: this.valueList,
    className,
    container: controlContainer,
    heightResize: false,
    numRows: 1,
    maxLength: 999,
    contentEditable
  };
  let filterValueControlConf = this.createElementConfig(props);
  //
  let filterValueControl = this.view.createElement(filterValueControlConf, controlContainer, this.view);
  this.elements.push(filterValueControl);
  //
  this.filterValueControls.push(filterValueControl);
  //
  if (!Client.IdfField.isNumeric(this.field.dataType) && !Client.IdfField.isDateOrTime(this.field.dataType))
    return;
  //
  props.value = filter.toValue || "";
  let visible = filter.type === Client.IdfFilterPopup.filterTypes.BETWEEN;
  props.visible = visible;
  //
  let filterBetweenControlConf = this.createElementConfig(props);
  //
  let filterBetweenControl = this.view.createElement(filterBetweenControlConf, controlContainer, this.view);
  Client.Widget.updateObject(filterBetweenControl.activator, {visible});
  this.elements.push(filterBetweenControl);
  //
  this.filterBetweenControls.push(filterBetweenControl);
};


/**
 * Create filters
 */
Client.IdfFilterPopup.prototype.createFilters = function ()
{
  let qbeFilter = this.field.qbeFilter || "";
  let filters = this.parseFilters(qbeFilter);
  filters = filters || [];
  //
  if (this.needEditControl()) {
    for (let i = 0; i < filters.length; i++)
      this.createFilterItem(filters[i]);
    //
    // Create an empty item in order to add more filters
    this.createFilterItem();
    this.filterValueControls[this.filterValueControls.length - 1]?.focus();
  }
  else {
    this.createFilterItem(filters[0]);
    this.filterTypeControls[this.filterTypeControls.length - 1]?.focus();
    //
    if (this.controlType === Client.IdfField.controlTypes.COMBO && !this.field.valueList)
      Client.mainFrame.sendEvents(this.field.handleQbeCombo({popupId: this.id}));
  }
};


/**
 * Handle change on my controls
 * @param {Object} event
 */
Client.IdfFilterPopup.prototype.handleChange = function (event)
{
  let events = [];
  //
  let filterTypeControl = this.filterTypeControls.find(control => control.id === event.obj);
  let filterValueControl = this.filterValueControls.find(control => control.id === event.obj);
  let filterBetweenControl = this.filterBetweenControls.find(control => control.id === event.obj);
  //
  let controlToFocus;
  //
  // This is the control used in a BETWEEN filter to set the second value of BETWEEN
  if (filterBetweenControl)
    filterValueControl = filterBetweenControl;
  //
  let typeControlIdx = this.filterTypeControls.findIndex(control => control.id === event.obj);
  //
  // If change occurred on a filter type control
  if (filterTypeControl) {
    if (this.controlType !== Client.IdfField.controlTypes.EDIT) {
      let events = [];
      //
      if (event.content.value === undefined) {
        if (filterTypeControl.type !== Client.IdfField.controlTypes.EDIT)
          return events;
        //
        event.content.value = filterTypeControl.getValueToSend().trim();
      }
      //
      // Ask server for new value list filtered by event.content.value
      if (!this.field.valueList && !this.field.hasValueSource && !this.field.autoLookup)
        events.push(...this.field.handleQbeCombo({text: event.content.value, popupId: this.id}));
      else // Otherwise filter value list locally
        this.filterValueControls[typeControlIdx].updateElement({filter: event.content.value.toLowerCase()});
      //
      return events;
    }
    //
    // If new type is "empty" or "not empty" I have to remove value (it not make sense with that filter types) and disabled filter value control
    let filterType = filterTypeControl.getValueToSend();
    let emptyOrNotEmptyType = Client.IdfFilterPopup.isEmptyOrNotEmpty(filterType);
    //
    let props = {};
    props.value = emptyOrNotEmptyType ? "" : undefined;
    props.enabled = !emptyOrNotEmptyType;
    props.className = emptyOrNotEmptyType ? "" : "filter-popup-value-control";
    //
    let visible = false;
    if (filterType === Client.IdfFilterPopup.filterTypes.BETWEEN) {
      props.className += " filter-popup-value-between-control";
      visible = true;
    }
    //
    // Update filter value control associated with filter type control
    this.filterValueControls[typeControlIdx].updateElement(Object.assign({}, props));
    //
    let betweenControl = this.filterBetweenControls[typeControlIdx];
    betweenControl?.updateElement({visible, className: props.className});
    betweenControl?.activator?.updateElement({visible});
    //
    controlToFocus = this.filterValueControls[typeControlIdx];
    if (emptyOrNotEmptyType)
      controlToFocus = this.filterTypeControls[typeControlIdx];
  }
  else if (filterValueControl) // Otherwise if it occurred on a filter value control, update its value
    filterValueControl.updateElement({value: event.content.value, style: {visibility: "visible"}});
  //
  // Get last filter type and value
  let lastFilterTypeControl = this.filterTypeControls[this.filterTypeControls.length - 1];
  let lastFilterValueControl = this.filterValueControls[this.filterValueControls.length - 1];
  let lastBetweenValueControl = this.filterBetweenControls[this.filterBetweenControls.length - 1];
  let lastFilterType = lastFilterTypeControl?.getValueToSend();
  let lastFilterValue = lastFilterValueControl.getValueToSend();
  let lastBetweenValue = lastBetweenValueControl?.getValueToSend();
  //
  // Check if last filter type is "empty" or "not empty"
  let emptyOrNotEmptyType = Client.IdfFilterPopup.isEmptyOrNotEmpty(lastFilterType);
  //
  if (lastFilterType === Client.IdfFilterPopup.filterTypes.BETWEEN && filterValueControl && (!lastFilterValue || !lastBetweenValue))
    controlToFocus = this.filterBetweenControls[this.filterBetweenControls.length - 1];
  else {
    // I have to create new filter item in two cases:
    // 1) change occurred on a filter type control and last filter type is "empty" or "not empty";
    // 2) change occurred on a filter value control and last filter value is not empty
    if ((filterTypeControl && emptyOrNotEmptyType) || (filterValueControl && lastFilterValue && this.needEditControl())) {
      // Show close button on every filter item
      for (let i = 0; i < this.filterItemCloseButtons.length; i++)
        this.filterItemCloseButtons[i].updateElement({style: {visibility: "visible"}});
      //
      this.createFilterItem();
      controlToFocus = this.filterValueControls[this.filterValueControls.length - 1];
    }
  }
  //
  if (controlToFocus !== undefined)
    requestAnimationFrame(() => controlToFocus.focus());
  //
  return events;
};


/**
 * Apply filter
 * @param {Boolean} clear
 */
Client.IdfFilterPopup.prototype.handleApplyFilter = function (clear)
{
  let qbeFilter = "";
  //
  if (!clear) {
    for (let i = 0; i < this.filterValueControls.length; i++) {
      let typeControl = this.filterTypeControls[i];
      let valueControl = this.filterValueControls[i];
      //
      let type = typeControl?.getValueToSend();
      let valueToSend = valueControl.getValueToSend();
      let value = typeof valueToSend === "string" ? valueToSend.trim() : valueToSend;
      //
      if (value === "Invalid date")
        continue;
      //
      if (!value && !Client.IdfFilterPopup.isEmptyOrNotEmpty(type))
        continue;
      //
      switch (this.controlType) {
        case Client.IdfField.controlTypes.EDIT:
          let toValue;
          let isValid = true;
          //
          if (type === Client.IdfFilterPopup.filterTypes.BETWEEN) {
            toValue = this.filterBetweenControls[i].getValueToSend();
            isValid = !!toValue;
          }
          //
          if (isValid)
            qbeFilter += (i > 0 ? this.field.comboSeparator : "") + this.stringifyFilter({type, value, toValue});
          break;

        case Client.IdfField.controlTypes.CHECK:
          qbeFilter = value;
          break;

        default:
          // If there is a combo selection, use it as value
          value = this.comboSelection ? this.comboSelection : value;
          qbeFilter += this.stringifyFilter({type: Client.IdfFilterPopup.filterTypes.VALUE, value});
          break;
      }
    }
  }
  //
  let control = this.filterValueControls[0];
  if (control?.getType() === Client.IdfField.controlTypes.CHECKLIST && !this.field.valueList && this.field.parent.canUseRowQbe() && !clear) {
    // Get qbe fieldValue
    let fieldValue = this.field.getValueByIndex(0);
    let listControl = Client.eleMap[fieldValue.listControlId];
    //
    // Get checklist value
    let value = this.comboSelection;
    //
    // When I'm closing popup filter, I have to make qbe fieldValue having a valueList containing checklist selection.
    // So update combo lastChange property and fieldValue text in order to properly empty combo list
    let description = this.originalValueList.items.filter(item => {
      let itemValue = this.field.smartLookup ? item.rValue : item.value.toString();
      return value.includes(itemValue);
    }).map(item => {
      if (this.originalValueList.decodeColumn)
        return item.name.split("|")[this.originalValueList.decodeColumn - 1];
      //
      return item.name;
    }).join(listControl.getComboNameSeparator());
    listControl.control.lastChange = description;
    listControl.control.lastDescription = description;
    fieldValue.updateElement({text: this.field.smartLookup ? description : value.join(control.comboSeparator)});
    //
    if (!listControl.isListOwner())
      listControl.emptyComboList(true);
  }
  //
  // Send filter to server
  let events = this.field.handleQbeFilter({obj: control?.id, content: {name: "value", value: qbeFilter, filterPopup: true, clear}});
  //
  // In case of smart lookup I have to set filter client side
  if (this.field.smartLookup) {
    this.field.updateElement({qbeFilter});
    //
    // Set filter on lookups linked to me
    let parentPanel = this.field.parent;
    for (let i = 0; i < parentPanel.fields.length; i++) {
      let field = parentPanel.fields[i];
      if (field.type === this.field.type)
        field.updateElement({qbeFilter});
    }
  }
  //
  // Close popup
  this.close(true);
  //
  return events;
};


/**
 * Handle sort
 * @param {Object} options
 */
Client.IdfFilterPopup.prototype.handleSort = function (options)
{
  // Close popup
  this.close(true);
  //
  return this.field.handleSort(options);
};


/**
 * Handle grouping
 * @param {Integer} groupingMode
 */
Client.IdfFilterPopup.prototype.handleGrouping = function (groupingMode)
{
  // Close popup
  this.close(true);
  //
  return this.field.handleGrouping(groupingMode);
};


/**
 * Return true if given filterType is EMPTY or NOTEMPTY
 * @param {String} filterType
 */
Client.IdfFilterPopup.isEmptyOrNotEmpty = function (filterType)
{
  return filterType === Client.IdfFilterPopup.filterTypes.EMPTY || filterType === Client.IdfFilterPopup.filterTypes.NOTEMPTY;
};


/**
 * Parse filters
 * @param {String} filters
 */
Client.IdfFilterPopup.prototype.parseFilters = function (filters)
{
  if (!filters)
    return [];
  //
  let sep = this.field.comboSeparator;
  if (this.field.smartLookup && filters.indexOf(Client.IdfControl.rValueSeparator) !== -1)
    sep = Client.IdfControl.rValueSeparator;
  //
  let qbeFilters = filters.split(sep);
  //
  filters = [];
  for (let i = 0; i < qbeFilters.length; i++) {
    let qbeFilter = qbeFilters[i];
    if (!qbeFilter)
      continue;
    //
    let firstPart = qbeFilter.substring(0, qbeFilter.length - 1);
    let middlePart = qbeFilter.substring(1, qbeFilter.length - 1);
    let lastPart = qbeFilter.substring(1);
    //
    if (this.field.smartLookup) {
      // In case of smart lookup use item value as filter
      if (this.valueList) {
        let item = this.valueList.items.find(item => item.rValue === qbeFilter);
        if (item) {
          if (!filters[0])
            filters.push({type: Client.IdfFilterPopup.filterTypes.VALUE, value: ""});
          //
          filters[0].value += (i > 0 ? this.field.comboSeparator : "") + item.value;
        }
      }
    }
    else if (qbeFilter.startsWith("#*") && qbeFilter.endsWith("*"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.NOTCONTAINS, value: middlePart.substring(1)});
    else if (qbeFilter.startsWith("#*"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.NOTENDS, value: lastPart.substring(1)});
    else if (qbeFilter.startsWith("#") && qbeFilter.endsWith("*"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.NOTSTARTS, value: firstPart.substring(1)});
    else if (qbeFilter.startsWith("*") && qbeFilter.endsWith("*"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.CONTAINS, value: middlePart});
    else if (qbeFilter.startsWith("*"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.ENDS, value: lastPart});
    else if (qbeFilter.endsWith("*"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.STARTS, value: firstPart});
    else if (qbeFilter.startsWith("#"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.DIFFERENT, value: lastPart});
    else if (qbeFilter.startsWith(">"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.MAJOR, value: lastPart});
    else if (qbeFilter.startsWith("<"))
      filters.push({type: Client.IdfFilterPopup.filterTypes.MINOR, value: lastPart});
    else if (qbeFilter.indexOf(":") !== -1) {
      // If field data type is TIME and If there is just one ":" in qbeFilter I consider it as VALUE filter
      if (this.field.dataType === Client.IdfField.dataTypes.TIME && (qbeFilter.match(/:/g) || []).length === 1)
        filters.push({type: Client.IdfFilterPopup.filterTypes.VALUE, value: qbeFilter});
      else {
        let value1, value2;
        let spaceFound = this.field.dataType === Client.IdfField.dataTypes.TIME;
        let firstColonsFound;
        //
        for (let j = 0; j < qbeFilter.length; j++) {
          let c = qbeFilter[j];
          if (c === " ")
            spaceFound = true;
          else if (c === ":") {
            if (!spaceFound || firstColonsFound) {
              value1 = qbeFilter.substring(0, j);
              value2 = qbeFilter.substring(j + 1);
              break;
            }
            //
            firstColonsFound = true;
          }
        }
        //
        filters.push({type: Client.IdfFilterPopup.filterTypes.BETWEEN, value: value1, toValue: value2});
      }
    }
    else if (qbeFilter === "!")
      filters.push({type: Client.IdfFilterPopup.filterTypes.EMPTY});
    else if (qbeFilter === ".")
      filters.push({type: Client.IdfFilterPopup.filterTypes.NOTEMPTY});
    else if (qbeFilter.startsWith("="))
      filters.push({type: Client.IdfFilterPopup.filterTypes.VALUE, value: lastPart});
    else { // Filter by value using app configuration
      let filterType = Client.IdfFilterPopup.filterTypes.VALUE;
      //
      if (this.needEditControl()) {
        if (Client.IdfField.isText(this.field.dataType) && (Client.mainFrame.wep?.panelLikeSearch || !Client.mainFrame.isIDF))
          filterType = (Client.mainFrame.wep?.panelLikeMode === 1 || !Client.mainFrame.isIDF ? Client.IdfFilterPopup.filterTypes.STARTS : Client.IdfFilterPopup.filterTypes.CONTAINS);
        //
        filters.push({type: filterType, value: qbeFilter});
      }
      else {
        if (!filters[0])
          filters.push({type: filterType, value: ""});
        //
        filters[0].value += (i > 0 ? this.field.comboSeparator : "") + qbeFilter;
      }
    }
  }
  //
  return filters;
};


/**
 * Stringify filter
 * @param {Object} filter
 */
Client.IdfFilterPopup.prototype.stringifyFilter = function (filter)
{
  let filterString = "";
  //
  switch (filter.type) {
    case Client.IdfFilterPopup.filterTypes.VALUE:
      if (Client.IdfField.isDateOrTime(this.field.dataType) || (Client.IdfField.isNumeric(this.field.dataType) && this.controlType !== Client.IdfField.controlTypes.COMBO))
        filterString = filter.value;
      else {
        if (this.controlType === Client.IdfField.controlTypes.EDIT)
          filterString = "=" + filter.value;
        else {
          let sep = this.field.smartLookup ? Client.IdfControl.rValueSeparator : this.field.comboSeparator;
          //
          for (let j = 0; j < filter.value.length; j++)
            filterString += (j > 0 ? sep : "") + filter.value[j];
        }
      }
      break;

    case Client.IdfFilterPopup.filterTypes.STARTS:
      filterString = filter.value + "*";
      break;

    case Client.IdfFilterPopup.filterTypes.NOTSTARTS:
      filterString = "#" + filter.value + "*";
      break;

    case Client.IdfFilterPopup.filterTypes.ENDS:
      filterString = "*" + filter.value;
      break;

    case Client.IdfFilterPopup.filterTypes.NOTENDS:
      filterString = "#*" + filter.value;
      break;

    case Client.IdfFilterPopup.filterTypes.CONTAINS:
      filterString = "*" + filter.value + "*";
      break;

    case Client.IdfFilterPopup.filterTypes.NOTCONTAINS:
      filterString = "#*" + filter.value + "*";
      break;

    case Client.IdfFilterPopup.filterTypes.DIFFERENT:
      filterString = "#" + filter.value;
      break;

    case Client.IdfFilterPopup.filterTypes.MAJOR:
      filterString = ">" + filter.value;
      break;

    case Client.IdfFilterPopup.filterTypes.MINOR:
      filterString = "<" + filter.value;
      break;

    case Client.IdfFilterPopup.filterTypes.BETWEEN:
      filterString = filter.value + ":" + filter.toValue;
      break;

    case Client.IdfFilterPopup.filterTypes.EMPTY:
      filterString = "!";
      break;

    case Client.IdfFilterPopup.filterTypes.NOTEMPTY:
      filterString = ".";
      break;
  }
  //
  return filterString;
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfFilterPopup.prototype.close = function (firstLevel, triggerAnimation)
{
  Client.eleMap[this.viewConf.id].close();
  //
  Client.Widget.prototype.close.call(this, firstLevel, triggerAnimation);
  //
  this.field.parent.focus();
};


/**
 * Called by IdfField when its valueList changes
 * @param {Object} valueList
 */
Client.IdfFilterPopup.prototype.updateValueList = function (valueList)
{
  this.valueList = valueList;
  //
  if (!this.originalValueList)
    this.originalValueList = valueList;
  //
  // Calculate columns length
  if (!this.width && this.valueList.headers) {
    let columnsLength = [];
    let cols = this.valueList.headers.split("|");
    cols.forEach((c, i) => columnsLength[i] = c.length);
    //
    for (let i = 0; i < this.valueList.items.length; i++) {
      let item = this.valueList.items[i];
      //
      cols = item.name.split("|");
      cols.forEach((c, j) => {
        if (c.length > columnsLength[j])
          columnsLength[j] = c.length;
      });
    }
    //
    let totalLength = 0;
    columnsLength.forEach(length => totalLength += length);
    //
    // Update popup width
    this.width = Math.max(totalLength * 8, 400);
    Client.eleMap[this.viewConf.id].dialog.wrapperObj.style.width = this.width + "px";
  }
  //
  let filterString = this.stringifyFilter({type: Client.IdfFilterPopup.filterTypes.VALUE, value: this.comboSelection});
  let oldFilter = this.parseFilters(filterString)[0] || {};
  //
  // Close old value control
  this.filterValueControls[0].close(true);
  this.filterValueControls.splice(0, 1);
  //
  // Create new value control
  this.createFilterValueControl(oldFilter);
};


/**
 * Return true if an edit control needs to be created
 */
Client.IdfFilterPopup.prototype.needEditControl = function ()
{
  return ![Client.IdfField.controlTypes.CHECK, Client.IdfField.controlTypes.OPTION, Client.IdfField.controlTypes.COMBO].includes(this.controlType);
};


/**
 * Get field control type
 */
Client.IdfFilterPopup.prototype.getFieldControlType = function ()
{
  let controlType = this.field.getControlType();
  //
  switch (controlType) {
    case Client.IdfField.controlTypes.AUTO:
      // If there is a value list or I have a value source or I'm a smart lookup, use combo
      if (this.field.valueList || this.field.hasValueSource || this.field.smartLookup || (this.field.getValueByIndex(this.field.parent.getActiveRowIndex())?.valueList))
        controlType = Client.IdfField.controlTypes.COMBO;
      else // Otherwise use edit
        controlType = Client.IdfField.controlTypes.EDIT;
      break;

    case Client.IdfField.controlTypes.OPTION:
    case Client.IdfField.controlTypes.CHECK:
      // A check/radio without a value list becomes an edit
      if (!this.field.valueList)
        controlType = Client.IdfField.controlTypes.EDIT;
      break;
  }
  //
  return controlType;
};


/**
 * Handle key up my controls
 * @param {Object} event
 */
Client.IdfFilterPopup.prototype.handleKeyUp = function (event)
{
  let events = [];
  //
  if (event.obj !== this.pageConf.id)
    return [];
  //
  // ESC Handle
  if (event.content.keyCode === 27)
    this.close(true);
  //
  return events;
};

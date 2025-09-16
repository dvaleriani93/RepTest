/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */
/* global moment */

var Client = Client || {};
/**
 * @class An html control (input, radio group, checkbox, html editor, etc.)
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfControl = function (widget, parent, view)
{
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfControl extend Client.Widget
Client.IdfControl.prototype = new Client.Widget();


Client.IdfControl.stretches = {
  AUTO: 1,
  NONE: 2,
  FILL: 3,
  ENLARGE: 4,
  CROP: 5,
  REPEAT: 6,
  CENTER: 7
};


Client.IdfControl.blobCommands = {
  UPLOAD: "upload",
  DELETE: "delete",
  VIEW: "view",
  OPEN: "open",
  DOWNLOAD: "download"
};


Client.IdfControl.nameSeparator = "; ";
Client.IdfControl.rValueSeparator = "@#@";


/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfControl.prototype.updateElement = function (props)
{
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  if (!Object.keys(props).length)
    return;
  //
  let update = {};
  //
  if (props.comboType !== undefined)
    this.comboType = props.comboType;
  //
  if (props.contentEditable !== undefined)
    this.contentEditable = props.contentEditable;
  //
  if (props.container !== undefined)
    this.container = props.container;
  //
  if (props.type !== undefined) {
    this.type = props.type;
    update.showHtml = true;
  }
  //
  if (props.useHtml !== undefined) {
    this.useHtml = props.useHtml;
    update.showHtml = true;
  }
  //
  if (props.forceEditType !== undefined)
    this.forceEditType = props.forceEditType;
  //
  if (props.dataType !== undefined) {
    this.dataType = props.dataType;
    update.showHtml = true;
  }
  //
  if (props.isPassword !== undefined) {
    this.isPassword = props.isPassword;
    update.showHtml = true;
  }
  //
  if (props.showOnlyIcon !== undefined) {
    this.showOnlyIcon = props.showOnlyIcon;
    update.value = true;
  }
  //
  if (props.heightResize !== undefined) {
    this.heightResize = props.heightResize;
    update.numRows = true;
  }
  //
  if (props.visualStyle !== undefined && Client.mainFrame.isIDF) {
    this.visualStyle = props.visualStyle;
    this.type = props.type || Client.IdfVisualStyle.getByIndex(this.visualStyle).getControlType();
    this.isPassword = Client.IdfVisualStyle.getByIndex(this.visualStyle).getPasswordFlag();
    //
    // Mask can be set by visual style, so check if I have to update it
    if (this.getMask())
      update.mask = true;
    //
    // On IDF, the value shown by combo depends on some visual style flags (showDescription and showValue).
    // So I have to update combo value on visual style change
    if (this.isCombo())
      update.value = true;
  }
  //
  if (props.maxLength !== undefined) {
    this.maxLength = props.maxLength;
    update.maxLength = true;
    //
    // maxLength can modify mask, so if I there is a mask, update it
    if (this.getMask())
      update.mask = true;
  }
  //
  if (props.scale !== undefined) {
    this.scale = props.scale;
    //
    // scale can modify mask, so if I there is a mask, update it
    if (this.getMask())
      update.mask = true;
  }
  //
  if (props.optional !== undefined) {
    this.optional = props.optional;
    update.valueList = true;
  }
  //
  if (props.valueList !== undefined) {
    if (this.valueList || props.valueList?.items?.length > 0 || this.waitingForList) {
      // valueList could become null when control type is changed by user in IDC editor
      if (!props.valueList)
        delete this.valueList;
      else {
        let lkeNullIndex = props.valueList.items.findIndex(item => item.value === "LKENULL");
        if (lkeNullIndex !== -1) {
          props.valueList.items.splice(lkeNullIndex, 1);
          this.optional = true;
        }
        //
        // If value list type is 0 it means server tell me to empty my value list. So close combo and it will do the job
        if (props.valueList.type === 0) {
          this.cancelComboOpening();
          this.control.closeCombo(true);
        }
        else {
          this.valueList = props.valueList;
          update.valueList = true;
        }
      }
    }
  }
  //
  if (props.readOnly !== undefined)
    this.readOnly = props.readOnly;
  //
  if (props.editorType !== undefined)
    this.editorType = props.editorType;
  //
  if (props.enabled !== undefined) {
    this.enabled = props.enabled;
    update.enabled = true;
    update.clickable = true;
    //
    if (this.isCombo() && Client.mainFrame.isIDF)
      update.value = true;
  }
  //
  if (props.visible !== undefined) {
    this.visible = props.visible;
    update.visible = true;
  }
  //
  if (props.activatorImage !== undefined) {
    this.activatorImage = props.activatorImage;
    update.activatorImage = true;
  }
  //
  if (props.activatorWidth !== undefined) {
    this.activatorWidth = props.activatorWidth;
    update.activatorWidth = true;
  }
  //
  if (props.clickable !== undefined) {
    this.clickable = props.clickable;
    update.clickable = true;
    update.showHtml = true;
  }
  //
  if (props.canActivate !== undefined) {
    this.canActivate = props.canActivate;
    update.activatorImage = true;
    update.clickable = true;
  }
  //
  if (props.activableDisabled !== undefined) {
    this.activableDisabled = props.activableDisabled;
    update.activatorImage = true;
    update.clickable = true;
  }
  //
  if (props.superActive !== undefined)
    this.superActive = props.superActive;
  //
  if (props.isRowQbe !== undefined)
    this.isRowQbe = props.isRowQbe;
  //
  if (props.canSort !== undefined)
    this.canSort = props.canSort;
  //
  if (props.alignment !== undefined) {
    this.alignment = props.alignment;
    update.alignment = true;
  }
  //
  if (props.backColor !== undefined) {
    this.backColor = props.backColor;
    update.backColor = true;
    update.activatorBackColor = true;
  }
  //
  if (props.color !== undefined) {
    this.color = props.color;
    update.color = true;
  }
  //
  if (props.mask !== undefined) {
    this.mask = props.mask;
    update.mask = true;
    update.showHtml = true;
  }
  //
  if (props.maskPrefix !== undefined) {
    this.maskPrefix = props.maskPrefix;
    update.mask = true;
  }
  //
  if (props.fontModifiers !== undefined) {
    this.fontModifiers = props.fontModifiers;
    update.fontModifiers = true;
  }
  //
  if (props.badge !== undefined) {
    this.badge = props.badge;
    update.badge = true;
  }
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
  if (props.uploadBlobEnabled !== undefined) {
    this.uploadBlobEnabled = props.uploadBlobEnabled;
    update.blob = true;
  }
  //
  if (props.deleteBlobEnabled !== undefined) {
    this.deleteBlobEnabled = props.deleteBlobEnabled;
    update.blob = true;
  }
  //
  if (props.viewBlobEnabled !== undefined) {
    this.viewBlobEnabled = props.viewBlobEnabled;
    update.blob = true;
  }
  //
  if (props.image !== undefined) {
    this.image = props.image;
    update.image = true;
  }
  //
  if (props.imageResizeMode !== undefined) {
    this.imageResizeMode = props.imageResizeMode;
    update.imageResizeMode = true;
  }
  //
  if (props.multiUpload !== undefined)
    this.multiUpload = props.multiUpload;
  //
  if (props.uploadExtensions !== undefined) {
    this.uploadExtensions = props.uploadExtensions.replace(/\*/g, '').replace(/;/g, ',');
    if (this.isTextEdit() && this.multiUpload)
      update.multiupload = true;
  }
  //
  if (props.isInQbe !== undefined) {
    this.isInQbe = props.isInQbe;
    update.qbeStatus = true;
    update.valueList = true;
    update.mask = true;
    update.value = true;
  }
  //
  if (props.value !== undefined) {
    this.value = props.value ?? "";
    update.value = true;
    //
    if (!this.isListOwner() && this.isCombo() && !props.skipEmptyComboList && (!props.valueList || props.valueList.type === 0)) {
      this.emptyComboList(true);
      update.valueList = true;
    }
  }
  //
  if (props.showHtmlEditorToolbar !== undefined) {
    this.showHtmlEditorToolbar = props.showHtmlEditorToolbar;
    update.showHtmlEditorToolbar = true;
  }
  //
  if (props.classNameOnParent !== undefined)
    this.classNameOnParent = props.classNameOnParent;
  //
  if (props.className !== undefined) {
    this.oldClassName = this.className;
    this.className = props.className;
    update.className = true;

  }
  //
  if (props.comboClass !== undefined)
    this.comboClass = props.comboClass;
  //
  if (props.subFrameConf !== undefined) {
    this.subFrameConf = props.subFrameConf;
    update.subFrame = true;
  }
  //
  if (props.placeholder !== undefined) {
    this.placeholder = props.placeholder;
    update.placeholder = true;
  }
  //
  if (props.numRows !== undefined) {
    this.numRows = props.numRows;
    update.numRows = true;
  }
  //
  if (props.filter !== undefined) {
    this.filter = props.filter;
    update.filter = true;
  }
  //
  if (props.comboMultiSel !== undefined) {
    this.comboMultiSel = props.comboMultiSel;
    //
    // Update QBE status just if I'm in QBE
    if (this.isInQbe)
      update.qbeStatus = true;
  }
  //
  if (props.comboSeparator !== undefined) {
    this.comboSeparator = props.comboSeparator;
    //
    // Update QBE status just if I'm in QBE
    if (this.isInQbe)
      update.qbeStatus = true;
  }
  //
  if (props.customElement !== undefined)
    this.customElement = props.customElement;
  //
  // This property is sent by IDC when one or more elements are added as field children
  if (props.customChildrenConf !== undefined && !this.isInQbe) {
    this.customChildrenConf = props.customChildrenConf;
    update.customChildren = true;
  }
  //
  if (props.tooltip !== undefined) {
    this.tooltip = props.tooltip;
    //
    if (Client.mainFrame.idfMobile) {
      // IDF Mobile theme: the tooltip is shown on the list if the control is a list control, otherwise is NOT used
      update.value = true;
      update.showMobileTooltip = true;
    }
    else
      update.tooltip = true;
  }
  //
  if (props.openCombo !== undefined) {
    if (this.isCombo())
      this.activator?.getRootObject().click();
    return;
  }
  //
  // If there isn't a container yet, do nothing
  if (!this.container)
    return;
  //
  // Recalculate type, alignment and multiRows
  this.currentType = this.getType(true);
  this.currentAlignment = this.getAlignment(true);
  this.currentMultiRows = this.isMultiRows(true);
  this.currentActivatorImage = this.getActivatorImage(true);
  //
  // Create control
  update = Object.assign(this.createControl() || {}, update);
  //
  if (this.customElement) {
    let customProps = {};
    for (let p in props) {
      if (this.customElement.customProps[p])
        customProps[p] = props[p];
    }
    this.control.updateElement(customProps);
    this.invokeCustomMethods();
  }
  //
  // Create activator
  update = Object.assign(this.createActivator() || {}, update);
  //
  // Create badge
  update = Object.assign(this.createBadge() || {}, update);
  //
  // Update control, activator and badge
  this.updateObjects(update);
  //
  // When these properties change I have to destroy and recreate control, so save their old values in order to compare new values with the old ones
  this.oldType = this.currentType;
  this.oldAlignment = this.currentAlignment;
  this.oldMultiRows = this.currentMultiRows;
  this.oldBlobMime = this.blobMime;
  this.oldDataType = this.dataType;
  this.oldIsPassword = this.isPassword;
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfControl.prototype.onEvent = function (event)
{
  let events = [];
  //
  // If this event fired on activator, remember it
  event.activator = this.isActivatorClick(event);
  //
  let routeToParent;
  //
  if (this.customChildrenConf && !this.isInQbe)
    routeToParent = true;
  else {
    switch (event.id) {
      case "onKey":
        routeToParent = this.handleKey(event);
        events.push(...this.handleKeyMovement(event));
        break;

      case "chgProp":
        routeToParent = this.handleChange(event);
        break;

      case "onClick":
        if (event.activator)
          this.handleActivatorClick(event);
        else
          events.push(...this.handleClick(event));
        break;

      case "onDblclick":
        // If I have an activator, handle activator click locally
        if (this.activator)
          this.handleActivatorClick(event);
        break;

      case "onDragover":
        // I need to prevent dragover default behaviour otherwise ondrop doesn't fire
        if (event.obj === this.control.id) {
          event.content.srcEvent.preventDefault();
          event.content.srcEvent.dataTransfer.dropEffect = this.canAcceptDrop(event.content.srcEvent) ? "move" : "none";
        }
        break;

      case "onDrop":
        if (event.obj === this.control.id) {
          // Use blob upload channel when user drop files on a multiupload control
          if (this.multiUpload || (this.dataType === Client.IdfField.dataTypes.BLOB && this.uploadBlobEnabled)) {
            let content = {command: Client.IdfControl.blobCommands.UPLOAD, files: event.content.srcEvent.dataTransfer.files};
            events.push(...this.parentWidget.onEvent({id: "onBlobCommand", obj: this.id, content}));
            //
            // No default behaviour, the browser opens a new tab with the file
            event.content.srcEvent.preventDefault();
          }
          else if (this.isTextEdit())
            this.handlePaste(event);
        }
        break;

      case "onPaste":
        this.handlePaste(event);
        break;

      case "onFocusin":
      case "onFocusout":
        routeToParent = this.handleFocus(event);
        break;

      default:
        if (this.customElement?.events.includes(event.id))
          routeToParent = true;
        break;
    }
  }
  //
  if (routeToParent && typeof routeToParent === "object") {
    event = routeToParent;
    routeToParent = true;
  }
  //
  if (!routeToParent)
    return events;
  //
  // Change event target so that parent can understand event comes from control
  event.obj = this.id;
  //
  // Route event to parent
  events.push(...this.parentWidget.onEvent(event));
  //
  return events;
};


/**
 * Return a copy of the element
 * @param {Object} config
 * @param {Client.Element} parent
 * @param {Map} referencesMap
 */
Client.IdfControl.prototype.clone = function (config, parent, referencesMap)
{
  let widget = Client.Widget.prototype.clone.call(this, config, parent, referencesMap);
  //
  let domObj;
  //
  // Relink parent
  if (parent)
    widget.container = parent;
  //
  // Relink control
  if (this.control) {
    domObj = referencesMap.get(this.control.domObj);
    widget.control = Client.eleMap[domObj.id];
    if (!widget.control?.cloned || this.control === widget.control)
      widget.control = this.control.clone(undefined, parent, referencesMap);
    //
    // Enable key events
    widget.control.enableKeyEvent({inputs: true, type: "down"});
    widget.control.enableKeyEvent({inputs: true, type: "up"});
    //
    // If I'm a combo, override Client.IonAutoComplete.positionCombo in order to customize combo position and dimensions
    if (widget.isCombo())
      widget.adjustCombo();
    //
    // In case of text EDIT, control is a contenteditable span. But I want it to act like an input
    if (widget.isTextEdit() && !widget.useInput)
      Client.Element.simulateInput({domObj: widget.control.getRootObject(), showHTML: widget.showHTML(), fixEmpty: true});
  }
  //
  // Relink support control
  if (this.supportControl && !Client.IdfField.isDateOrTime(this.dataType)) {
    domObj = referencesMap.get(this.supportControl.domObj);
    widget.supportControl = Client.eleMap[domObj.id];
    if (!widget.supportControl?.cloned || this.supportControl === widget.supportControl)
      widget.supportControl = this.supportControl.clone(undefined, parent, referencesMap);
  }
  //
  // Relink activator
  if (this.activator) {
    domObj = referencesMap.get(this.activator.domObj);
    widget.activator = Client.eleMap[domObj.id];
    if (!widget.activator?.cloned || this.activator === widget.activator)
      widget.activator = this.activator.clone(undefined, parent, referencesMap);
  }
  //
  // Relink badge
  if (this.badgeObj) {
    domObj = referencesMap.get(this.badgeObj.domObj);
    widget.badgeObj = Client.eleMap[domObj.id];
    if (!widget.badgeObj?.cloned || this.badgeObj === widget.badgeObj)
      widget.badgeObj = this.badgeObj.clone(undefined, parent, referencesMap);
  }
  //
  return widget;
};


/**
 * Handle onKey event
 * @param {Object} event
 */
Client.IdfControl.prototype.handleKey = function (event)
{
  let isEnterKey = event.content.keyCode === 13;
  //
  // pageUp, pageDown, end, home, left, up, right, down, del
  let isMovementKey = [33, 34, 35, 36, 37, 38, 39, 40, 45].includes(event.content.keyCode);
  //
  // F1-F12
  if (event.content.keyCode >= 112 && event.content.keyCode <= 123) {
    event.content.srcEvent.preventDefault();
    return event.content.type === "keyup";
  }
  //
  if (!this.isEnabled() || Client.mainFrame.isEditing()) {
    // In I'm not enabled, allow just enter, movement, tab and CTRL-C keys
    if (!isMovementKey && event.content.keyCode !== 9 && !((event.content.ctrlKey || event.content.metaKey) && event.content.keyCode === 67))
      event.content.srcEvent.preventDefault();
    //
    if (!isEnterKey)
      return;
  }
  //
  if (event.content.type === "keydown") {
    // I need to handle "enter" key and maxLength manually just in case of EDIT having text as datatype
    if (!this.isTextEdit())
      return;
    //
    // ctrl/meta key + A or C or V or X or Z
    let isShortcutKey = (event.content.ctrlKey || event.content.metaKey) && [65, 67, 86, 88, 90].includes(event.content.keyCode);
    //
    // [backspace, del] + [pageUp, pageDown, end, home, left, up, right, down]
    let isSpecialKey = [8, 46].includes(event.content.keyCode) || isMovementKey;
    //
    // Not shortcut, not special and not enter
    let isNormalKey = !isShortcutKey && !isSpecialKey && !isEnterKey;
    //
    // In case of "enter" key, check if I have to prevent default
    if (isEnterKey) {
      if (!this.isMultiRows())
        event.content.srcEvent.preventDefault();
    }
    else if (isNormalKey) {
      // Since control for text datatype is an editable span, I have to handle max length manually
      let target = event.content.srcEvent.target;
      if (this.maxLength > 0 && target.innerText.length - (target.selectionEnd - target.selectionStart) >= this.maxLength)
        event.content.srcEvent.preventDefault();
    }
  }
  else if (event.content.type === "keyup") {
    if (isEnterKey) {
      if (this.qbeRowTooltip) {
        clearTimeout(this.qbeRowTooltip);
        delete this.qbeRowTooltip;
      }
      //
      let type = this.getType();
      //
      // In case of "enter" key up on an HTML editor or on a multi rows control, stop propagation and never route event to parent
      if (type === Client.IdfField.controlTypes.HTMLEDITOR || this.isMultiRows()) {
        event.content.srcEvent.stopPropagation();
        return;
      }
      else if (type !== Client.IdfField.controlTypes.EDIT)
        return;
    }
    else if ((!this.isTextEdit() && !this.superActive) || (event.content.srcEvent.key.length === 0 && ![8, 32, 24, 46].includes(event.content.keyCode)))
      // Send change event just in case of printable charachters into a text edit
      return;
    //
    // Check if we have entered text into a QBE ROW field, in that case we can show the tooltip if the user doesn't press ENTER
    // in a second
    if (this.isRowQbe && !isEnterKey) {
      if (this.qbeRowTooltip)
        clearTimeout(this.qbeRowTooltip);
      //
      this.qbeRowTooltip = setTimeout(function () {
        delete this.qbeRowTooltip;
        this.control.tooltip.show();
      }.bind(this), 2000);
    }
    //
    if (this.superActive || isEnterKey)
      return this.prepareChangeEvent();
  }
};


/**
 * Handle key movement event
 * @@param {Object} event
 */
Client.IdfControl.prototype.handleKeyMovement = function (event)
{
  let events = [];
  if (event.content.type !== "keydown")
    return events;
  //
  let domObj = event.content.srcEvent.srcElement;
  let column = 0;
  let row = 0;
  let selectionStart = 0;
  let selectionEnd = 9999;
  switch (event.content.keyCode) {
    case 9: // Tab
      column = event.content.shiftKey ? -1 : 1;
      break;

    case 13: // Enter
      if (!Client.mainFrame.wep?.tabWithEnter)
        return events;
      //
      column = 1;
      break;

    case 37: // Left arrow
      if (event.content.shiftKey || event.content.ctrlKey)
        return events;
      //
      if (Client.Element.isSelectable(domObj)) {
        if (domObj.selectionStart > 0)
          return events;
        else if (domObj.selectionStart === 0 && domObj.selectionStart !== domObj.selectionEnd) {
          domObj.selectionEnd = domObj.selectionStart;
          return events;
        }
      }
      //
      column = -1;
      selectionStart = 9999;
      selectionEnd = 9999;
      break;

    case 39: // Right arrow
      if (event.content.shiftKey || event.content.ctrlKey)
        return events;
      //
      if (Client.Element.isSelectable(domObj)) {
        if (domObj.selectionEnd !== domObj.value.length && domObj.value !== Client.Element.fakeEmptyValue)
          return events;
        else if (domObj.selectionEnd > 0 && domObj.selectionStart !== domObj.selectionEnd) {
          domObj.selectionStart = domObj.selectionEnd;
          return events;
        }
      }
      //
      column = 1;
      selectionStart = 0;
      selectionEnd = 0;
      break;

    case 38: // Up arrow
    case 40: // Down arrow
      if (event.content.shiftKey || event.content.ctrlKey)
        return events;
      //
      if (this.numRows > 1) {
        let selection = Client.Element.getSelection(this.control.getRootObject());
        if ((event.content.keyCode === 38 && selection.start > 0) || (event.content.keyCode === 40 && selection.end !== domObj.value.length))
          return events;
      }
      //
      row = event.content.keyCode === 38 ? -1 : 1;
      break;

    default:
      return events;
  }
  //
  // Let the browser handle the filter popup tab
  if (!(this.parentWidget instanceof Client.IdfFilterPopup))
    event.content.srcEvent.preventDefault();
  events.push(...this.parentWidget.focusNearControl({control: this, column, row, selectionStart, selectionEnd}));
  //
  return events;
};


/**
 * Handle chgProp event
 * @param {Object} event
 */
Client.IdfControl.prototype.handleChange = function (event)
{
  // Route errorText to parent in case of IDC
  if (event.content.name === "errorText")
    return !Client.mainFrame.isIDF;
  //
  if (event.content.name === "filter")
    return this.handleFilter(event);
  //
  let type = this.getType();
  //
  // If click occurred on a checkbox, the chgProp event is fired with {name: "checked", value: true/false} as content.
  // Since my parent expects content of chgProp event to be {name: "value", value: "something"}, change it in this way
  if ([Client.IdfField.controlTypes.CHECK, Client.IdfField.controlTypes.OPTION].includes(type) && event.content.name === "checked") {
    if (type === Client.IdfField.controlTypes.CHECK) {
      event.content.name = "value";
      //
      // In QBE checkbox has three status: true, indeterminate and false.
      // If old status was "indeterminate", browser sends me "true" as new checked value because "indeterminate" means checkbox was not checked.
      // But since I want "false" after "indeterminate", I replace "true" value with "false"
      if (this.isInQbe && this.oldIndeterminateStatus)
        event.content.value = false;
      //
      // If I have a value list with 2 or more items, get first item value if checkbox is checked, otherwise get second item value
      if (this.valueList?.items.length >= 2)
        event.content.value = event.content.value ? this.valueList.items[0].value : this.valueList.items[1].value;
      else
        event.content.value = event.content.value ? "on" : "";
      //
      // If old status was "true", browser sends me "false" as new checked value.
      // But since checkbox in QBE also has "indeterminate" status, I replace "false" value with the "indeterminate" one (i.e. "---").
      // In this way the writeValue method will set checked=null and indeterminate=true instead of checked=false. And so I obtain the third status
      if (this.isInQbe && this.oldCheckStatus)
        event.content.value = "---";
    }
    else if (this.isInQbe) {
      // Get checked radio
      let checkedRadioCount = this.control.elements.filter(item => item.elements[0].getRootObject().getAttribute("checked")).length;
      //
      // When user changes radio group value by checking a different radio button, there are two checked radios until the new value is applied.
      // On the other hand, if there is one checked value, it means user checked an already checked value. In this case uncheck it
      if (checkedRadioCount === 1) {
        event.content.name = "value";
        event.content.value = "";
      }
    }
  }
  //
  if (event.content.name === "value") {
    // Multiple combo sends its value just on combo close, except when value is "".
    if (this.isCombo()) {
      if (this.isSmartLookup() && this.control.multiple && event.content.value === "LKENULL")
        this.control.closeCombo();
      //
      return;
    }
    //
    // If change occurred on blob/multiupload hidden input, route onBlobCommand (UPLOAD) to my parent passing uploaded files
    if ((this.dataType === Client.IdfField.dataTypes.BLOB || this.multiUpload) && event.obj === this.supportControl?.id) {
      event.id = "onBlobCommand";
      event.content = {command: Client.IdfControl.blobCommands.UPLOAD};
      event.content.files = this.supportControl.getRootObject().files;
    }
  }
  //
  return true;
};


/**
 * Handle onFilter event
 * @param {Object} event
 */
Client.IdfControl.prototype.handleFilter = function (event)
{
  // Route change on filter property if control is not a combo
  if (!this.isCombo())
    return true;
  //
  // If filter on a closed list owner is "", return true in order to empty the value
  if (this.isListOwner() && event.content.value === "" && !this.isComboOpen())
    return true;
  //
  // List owner and open noAutoLookup apply filter locally
  if (this.isListOwner() || (this.isNoAutoLookup() && this.isComboOpen())) {
    this.openCombo(event.content.value);
    return;
  }
  //
  // Route filter to parent
  return true;
};


/**
 * Handle onClick event
 * @param {Object} event
 */
Client.IdfControl.prototype.handleClick = function (event)
{
  let events = [];
  let blobCommand;
  //
  let uploadBlobClick = event.obj === this.uploadBlobConf?.id;
  let deleteBlobClick = event.obj === this.deleteBlobConf?.id;
  let viewBlobClick = event.obj === this.viewBlobConf?.id;
  let multiUploadClick = event.obj === this.control.id && this.multiUpload;
  //
  // If click occurred on upload blob button or on multi upload control, click on hidden input to open file browser
  if (uploadBlobClick || multiUploadClick) {
    let fileInput = this.supportControl.getRootObject();
    fileInput.click();
    return events;
  }
  else if (deleteBlobClick)
    blobCommand = Client.IdfControl.blobCommands.DELETE;
  else if (viewBlobClick) {
    if (Client.mainFrame.isIDF)
      this.handleViewBlobClick(event);
    else
      blobCommand = Client.IdfControl.blobCommands.DOWNLOAD;
  }
  //
  // If click occurred on link of a SIZE blob, the blob command is OPEN
  let link = this.control?.elements?.[0]?.elements?.[0];
  if (link && event.obj === link.id && this.blobMime === Client.IdfFieldValue.blobMimeTypes.SIZE) {
    if (Client.mainFrame.isIDF)
      this.handleOpenBlobClick(event);
    else
      blobCommand = Client.IdfControl.blobCommands.DOWNLOAD;
  }
  //
  if (blobCommand)
    events.push(...this.parentWidget.onEvent({id: "onBlobCommand", obj: this.id, content: {command: blobCommand}}));
  //
  return events;
};


/**
 * Handle click on view blob button
 * @param {Object} event
 */
Client.IdfControl.prototype.handleViewBlobClick = function (event)
{
  Client.Widget.showPreview(Client.mainFrame.wep.SRV_MSG_ShowDoc, this.blobUrl.replace("&amp;", "&"));
};


/**
 * Handle click on open blob button
 * @param {Object} event
 */
Client.IdfControl.prototype.handleOpenBlobClick = function (event)
{
  if (this.blobMime === Client.IdfFieldValue.blobMimeTypes.TEXT)
    open().document.body.innerText = this.value;
  else
    Client.mainFrame.open({href: this.blobUrl.replace("&amp;", "&")});
};


/**
 * Handle onPaste event
 * @param {Object} event
 */
Client.IdfControl.prototype.handlePaste = function (event)
{
  if (!this.isEnabled())
    return event.content.srcEvent.preventDefault();
  //
  let maxLength = this.maxLength;
  let mask = this.getMask();
  //
  // If there are both maxLength and mask, get their minimum length as maxLength
  if (this.maxLength > 0 && mask)
    maxLength = Math.min(this.maxLength, mask.length);
  else if (mask) // Otherwise, if there is just mask, use its length as maxLength
    maxLength = mask.length;
  //
  // If there is no maxLength, I have to do nothing
  if (maxLength <= 0)
    return;
  //
  // Get source event
  let srcEvent = event.content.srcEvent;
  //
  // Get pasted text
  let clipboardData = event.id === "onDrop" ? srcEvent.dataTransfer : (srcEvent.clipboardData || window.clipboardData);
  let pastedText = clipboardData.getData("text/plain");
  //
  let rootObject = this.control.getRootObject();
  //
  // Get actual selection
  let selStart = rootObject.selectionStart;
  let selEnd = rootObject.selectionEnd;
  //
  // Remove selected text. It will be replaced by pasted text
  let oldText = rootObject.value;
  oldText = `${oldText.slice(0, selStart)}${oldText.slice(selEnd)}`;
  //
  // Get actual text length
  let textLength = oldText.length;
  //
  // If adding pasted text to actual text causes max length to be exceeded, truncate pasted text
  if (textLength + pastedText.length > maxLength)
    pastedText = pastedText.substr(0, maxLength - textLength);
  //
  // Prevent default paste
  srcEvent.preventDefault();
  //
  // If there is a pastedText, execute paste operation manually
  if (pastedText) {
    rootObject.value = `${oldText.slice(0, selStart)}${pastedText}${oldText.slice(selStart)}`;
    rootObject.selectionStart = selStart + pastedText.length;
    rootObject.selectionEnd = selStart + pastedText.length;
  }
};


/**
 * Handle selection change event
 * @param {Object} event
 */
Client.IdfControl.prototype.handleSelectionChange = function (event)
{
  this.lastSelection = Client.Element.getSelection(this.control.getRootObject());
  return this.parentWidget.handleSelectionChange(event);
};


/**
 * Create control configuration
 */
Client.IdfControl.prototype.createControlConfig = function ()
{
  let config;
  //
  switch (this.getType()) {
    case Client.IdfField.controlTypes.EDIT:
      if (this.isTextEdit() && !this.useInput) {
        let showHtml = this.showHTML();
        config = {
          c: "IonText",
          type: "span",
          contentEditable: !!((this.contentEditable === undefined || this.contentEditable) && !showHtml),
          className: "control-span" + (showHtml ? " show-html" : "") + (this.multiUpload ? " multiupload" : ""),
          events: ["onPaste", "onDrop", "onDragover", "onFocusout"]
        };
      }
      else {
        let type, mask;
        if (Client.IdfField.isNumeric(this.dataType) && !this.isInQbe) {
          type = "number";
          mask = this.getMask();
        }
        config = {c: "IonInput", labelPosition: "hidden", autocomplete: "off", className: "control-edit", events: ["onChange"], type, mask};
        //
        if (this.isPassword) {
          config.type = "password";
          config.events.push("onFocusin");
          config.events.push("onFocusout");
        }
        //
        if ((Client.mainFrame.idfMobile || Client.mainFrame.device.isMobile) && Client.IdfField.isNumeric(this.dataType)) // ALWAYS open the mobile numpad on mobile theme
          config.numPad = 2;
      }
      config.events.push("onClick");
      config.events.push("onDblclick");
      //
      if (this.isRowQbe)
        config.tooltip = {content: Client.IdfResources.t("TIP_TITLE_QbeRow"), trigger: "manual"};
      break;

    case Client.IdfField.controlTypes.COMBO:
      config = {
        c: "IonAutoComplete",
        labelPosition: "hidden",
        backdrop: "none",
        showIcon: true,
        className: "control-edit",
        comboClass: "control-combo" + (this.comboClass ? " " + this.comboClass : ""),
        readOnly: !!this.readOnly,
        openOnFocus: !!this.readOnly,
        highlightFirstOption: true,
        heightResize: this.isMultiRows(),
        list: Client.mainFrame.isIDF ? this.getComboList() : undefined
      };
      //
      let events = ["onChange", "onClick", "onDblclick"];
      if (!this.isListOwner())
        events.push("onFilter");
      //
      config.events = events;
      //
      // In the filter popup the browser is handling the TAB, so we need to skip the focus on the autocomplete input
      if (this.readOnly && this.parentWidget instanceof Client.IdfFilterPopup)
        config.tabindex = "-1";
      //
      if (this.isRowQbe)
        config.tooltip = {content: Client.IdfResources.t("TIP_TITLE_QbeRow"), trigger: "manual"};
      break;

    case Client.IdfField.controlTypes.CHECK:
      config = {c: Client.mainFrame.idfMobile ? "IonToggle" : "IonCheckbox", className: "control-checkbox"};
      break;

    case Client.IdfField.controlTypes.OPTION:
      config = {c: "IonList", noLines: true, radioGroup: true, className: "control-radio-group", children: [], events: ["onChange", "onClick", "onDblclick"]};
      if (this.valueList) {
        for (let i = 0; i < this.valueList.items.length; i++) {
          let optionItem = {c: "IonItem", className: "control-radio-item", wrapper: false};
          optionItem.children = [{c: "IonRadio", label: this.valueList.items[i].name, value: this.valueList.items[i].value}];
          config.children.push(optionItem);
        }
      }
      break;

    case Client.IdfField.controlTypes.BUTTON:
      config = {c: "IonButton", className: "control-button", events: ["onClick"]};
      if (this.useHtml || this.getMask(undefined, true) === "=")
        config.useHTML = true;
      break;

    case Client.IdfField.controlTypes.HTMLEDITOR:
      config = {c: "HtmlEditor", className: "control-htmleditor", events: ["onChange"]};
      break;

    case Client.IdfField.controlTypes.CUSTOM:
      if (this.customElement)
        config = this.customElement.createConfig();
      else
        config = {c: "Container", className: "control-custom"};
      break;

    case Client.IdfField.controlTypes.BLOB:
      config = this.createBlobConfig();
      break;

    case Client.IdfField.controlTypes.CHECKLIST:
      config = {c: "IonList", noLines: true, className: "control-radio-group", children: []};
      if (this.valueList) {
        let items = this.getComboList();
        //
        // Remove first item if it's empty
        let emptyItemIndex = this.valueList.headers ? 1 : 0;
        if (items[emptyItemIndex]?.v === "")
          items.splice(emptyItemIndex, 1);
        //
        for (i = 0; i < items.length; i++) {
          let item = items[i];
          //
          let optionItem = {
            c: "IonItem",
            className: "control-radio-item",
            wrapper: false,
            itemValue: item.v,
            itemName: item.n,
            itemRValue: item.rValue
          };
          //
          if (this.valueList.headers) {
            // Add className just for header item
            if (item.v === this.valueList.headers)
              optionItem.className += " " + (item.s || "");
            //
            optionItem.children = [
              {c: "IonCheckbox"},
              {c: "Container", className: "control-radio-item-container", innerHTML: item.html}
            ];
          }
          else
            optionItem.children = [{c: "IonCheckbox", label: item.n}];
          //
          config.children.push(optionItem);
        }
      }
      break;

    case Client.IdfField.controlTypes.LISTGROUPHEADER:
      config = {c: "IonText", type: "span", className: "control-span"};
      break;
  }
  //
  return {mainControlConfig: this.createElementConfig(config), supportControlConfig: this.createSupportControlConfig()};
};


/**
 * Create support control configuration
 */
Client.IdfControl.prototype.createSupportControlConfig = function ()
{
  let supportControlConfig;
  //
  if (Client.IdfField.isDateOrTime(this.dataType) && !Client.eleMap["control-iondatetime"])
    supportControlConfig = {id: "control-iondatetime", c: "IonDateTime", usePicker: Client.IonDateTime.SHOW_PICKER_NEVER, displayFormat: this.getMask(true), style: {width: 0, height: "1px"}};
  else if (this.getType() === Client.IdfField.controlTypes.BLOB || this.multiUpload)
    supportControlConfig = {c: "Input", type: "file", visible: false, events: ["onClick", "onChange"]};
  //
  if (supportControlConfig)
    supportControlConfig = this.createElementConfig(supportControlConfig);
  //
  return supportControlConfig;
};


/**
 * Create blob configuration
 */
Client.IdfControl.prototype.createBlobConfig = function ()
{
  let config = {c: "Container", className: "control-blob", children: [], events: ["onClick", "onDrop", "onDragover"]};
  //
  let blobContainerConfig;
  //
  switch (this.blobMime) {
    case Client.IdfFieldValue.blobMimeTypes.TEXT:
    case Client.IdfFieldValue.blobMimeTypes.IMAGE:
    case Client.IdfFieldValue.blobMimeTypes.EMPTY:
    case Client.IdfFieldValue.blobMimeTypes.SIZE:
      blobContainerConfig = {c: "Container", className: "control-blob-container", children: [], events: ["onClick"]};
      //
      // In case of SIZE mime type, add a child representing blob link
      if (this.blobMime === Client.IdfFieldValue.blobMimeTypes.SIZE) {
        blobContainerConfig.className += " control-blob-size";
        blobContainerConfig.children.push({c: "Container", events: ["onClick"]});
      }
      break;

    default:
      blobContainerConfig = {c: "Iframe", className: "control-blob-container", events: ["onClick"], frameBorder: "no"};
      break;
  }
  //
  config.children.push(blobContainerConfig);
  //
  return config;
};


/**
 * Write value on my element
 */
Client.IdfControl.prototype.writeValue = function ()
{
  switch (this.getType()) {
    case Client.IdfField.controlTypes.EDIT:
      this.writeEditValue();
      break;

    case Client.IdfField.controlTypes.COMBO:
      this.writeComboValue();
      break;

    case Client.IdfField.controlTypes.CHECK:
      this.writeCheckValue();
      break;

    case Client.IdfField.controlTypes.OPTION:
      this.writeRadioValue();
      break;

    case Client.IdfField.controlTypes.BUTTON:
      if (this.control.useHTML) {
        Client.Widget.updateObject(this.control, {label: Client.Widget.getHTMLForCaption(this.value)});
      }
      else {
        let {caption, icon} = Client.Widget.extractCaptionData(this.value);
        Client.Widget.updateObject(this.control, {label: caption, icon});
      }
      break;

    case Client.IdfField.controlTypes.BLOB:
      this.writeBlobValue();
      break;

    case Client.IdfField.controlTypes.CHECKLIST:
      if (this.valueList) {
        let values = this.value.split(this.comboSeparator);
        //
        for (let i = 0; i < this.valueList.items.length; i++) {
          let item = this.valueList.items[i];
          let val = values.find(v => v === item.value || v === (item.value + "") || v === item.name?.toLowerCase());
          let checkItem = this.control.elements.find(el => el.getRootObject().itemValue === val);
          if (checkItem)
            Client.Widget.updateObject(checkItem.elements[0], {checked: !!val});
        }
      }
      break;

    default:
      let props = {};
      if (this.customElement && !this.customElement.subFrameId) {
        // I push also a change of the default property
        let defaultBindingProperty = Client[this.customElement._class]?.defaultBindingProperty;
        if (defaultBindingProperty) {
          let isNumber = false;
          if (defaultBindingProperty in this.control)
            isNumber = typeof this.control[defaultBindingProperty] === "number";
          else
            isNumber = isNaN(this.value);
          //
          props[defaultBindingProperty] = isNumber ? new Number(this.value) : this.value;
        }
      }
      //
      props.value = this.value;
      Client.Widget.updateObject(this.control, props);
      break;
  }
};


/**
 * Write value on EDIT
 */
Client.IdfControl.prototype.writeEditValue = function ()
{
  let props = {};
  //
  if (this.showHTML()) {
    props.value = "";
    props.innerHTML = this.getHTMLIcon(this.value);
    //
    if (Client.mainFrame.idfMobile && this.tooltip)
      props.innerHTML += "<br/>" + this.tooltip;
  }
  else {
    let value = this.value;
    //
    if (Client.IdfField.isDateOrTime(this.dataType)) {
      if (!value || value === "Invalid date")
        value = "";
      else if (value.includes("T")) // Value is in ISO format, convert it to mask format
        value = moment(this.getISODateTime(value)).format(this.getMask(true, true));
    }
    //
    if (Client.mainFrame.idfMobile && this.control.innerHTML)
      props.innerHTML = "";
    //
    props.value = value;
    //
    let mask = this.getMask();
    if (mask) {
      let maskType = this.getMaskType();
      //
      // For text fields not in QBE apply the format mask
      if (!Client.mainFrame.isIDF && !this.isInQbe && this.isTextEdit())
        props.value = mask_mask(value, mask, maskType);
      //
      // IDF server sends masked value. But input doesn't expect an already masked value and thus it will try to mask it anyway, causing a double masking.
      // So I have to unmask value before writing it into input
      if (Client.mainFrame.isIDF && maskType === "N" && props.value && this.control.domObj.value !== mask_mask(props.value, mask, maskType))
        props.value = mask_unmask(props.value, mask, maskType);
    }
  }
  //
  // Update control
  Client.Widget.updateObject(this.control, props);
};


/**
 * Write value on COMBO
 */
Client.IdfControl.prototype.writeComboValue = function ()
{
  let props = {};
  //
  if (this.value === "")
    props.filter = "";
  //
  if (this.isSmartLookup() && this.valueList) {
    // Change combo value just if value is valid
    let isValid = false;
    let newValue = [];
    //
    if (this.value !== undefined) {
      let oldValue = this.value === "*" ? this.control.value : this.value;
      //
      if (this.isMultipleCombo())
        oldValue = this.value.split(this.getComboNameSeparator());
      //
      for (let i = 0; i < this.valueList.items.length; i++) {
        let item = this.valueList.items[i];
        //
        // In case of multiple combo (i.e. in qbe), when server sends the entire value list the old selected items are sent with a special value: LKE1001, LKE1002 and so on.
        // So retrieve these values into value list and use them as control new value
        if (this.value === "*" && this.isMultipleCombo()) {
          let itemValue = parseInt(item.value.replace("LKE", ""));
          if (itemValue > 1000) {
            newValue.push(item.value);
            isValid = true;
          }
        }
        else {
          // First check if oldValue matches the item's value
          let matches = (item.value && oldValue.includes(item.value));
          if (!matches && item.name) {
            // Next check if oldValue matches the item's name
            // If name is multicolomn extract the decode value
            let decode = item.name;
            if (this.valueList.decodeColumn)
              decode = item.name.split("|")[this.valueList.decodeColumn - 1];
            matches = oldValue.includes(decode);
          }
          //
          if (matches) {
            newValue.push(item.value);
            isValid = true;
          }
        }
      }
    }
    //
    if (isValid)
      props.value = newValue.join(this.comboSeparator);
    //
    if (this.value === "")
      props.value = "";
  }
  else
    props.value = this.value;
  //
  // Update control
  Client.Widget.updateObject(this.control, props);
};


/**
 * Write value on CHECK
 */
Client.IdfControl.prototype.writeCheckValue = function ()
{
  let props = {};
  //
  if (this.value === "---") {
    props.indeterminate = true;
    props.checked = null;
  }
  else {
    props.indeterminate = false;
    //
    if (this.valueList.items.length >= 2)
      props.checked = this.value + "" === this.valueList.items[0].value + "";
    else
      props.checked = this.value === "on";
  }
  //
  this.oldCheckStatus = props.checked;
  this.oldIndeterminateStatus = props.indeterminate;
  //
  // Update control
  Client.Widget.updateObject(this.control, props);
};


/**
 * Write value on OPTION
 */
Client.IdfControl.prototype.writeRadioValue = function ()
{
  let props = {};
  //
  props.value = this.valueList.items.find(item => item.value + "" === this.value + "")?.value ?? "";
  //
  // Update control
  Client.Widget.updateObject(this.control, props);
};


/**
 * Write value on BLOB
 */
Client.IdfControl.prototype.writeBlobValue = function ()
{
  let props = {};
  let control = this.control.elements[0];
  //
  props.style = {backgroundImage: ""};
  props.innerHTML = "";
  props.src = "";
  switch (this.blobMime) {
    case Client.IdfFieldValue.blobMimeTypes.IMAGE:
      props.style = {backgroundImage: "url('" + this.value + "')"};
      break;

    case Client.IdfFieldValue.blobMimeTypes.SIZE:
      control = this.control.elements[0].elements[0];
      if (Client.mainFrame.isIDF)
        props.innerHTML = this.value;
      else {
        let sizeText;
        let size = parseInt(this.value);
        if (size < 1024)
          sizeText = size + " B";
        else if (size < 1048576)
          sizeText = Math.round(size / 1024) + " KB";
        else
          sizeText = Math.round(size / (1024 * 1024)) + " MB";
        props.innerHTML = Client.IdfResources.t("PAN_BLOBLINK", [sizeText]);
      }
      break;

    case Client.IdfFieldValue.blobMimeTypes.TEXT:
    case Client.IdfFieldValue.blobMimeTypes.EMPTY:
      props.innerHTML = this.value;
      break;

    default:
      props.src = this.value;
      break;
  }
  //
  // Update control
  Client.Widget.updateObject(control, props);
};


/**
 * Create control
 */
Client.IdfControl.prototype.createControl = function ()
{
  // If I don't need to create a new control, do nothing
  if (!this.needNewControl())
    return;
  //
  // I have to create control, so remove old control, if any
  if (this.control) {
    let index = this.mainObjects.findIndex(obj => obj.id === this.control.id);
    this.mainObjects.splice(index, 1);
    //
    this.container.removeChild(this.control);
    //
    // If there is an old support control, remove it
    if (this.supportControl) {
      index = this.mainObjects.findIndex(obj => obj.id === this.supportControl.id);
      this.mainObjects.splice(index, 1);
      this.container.removeChild(this.supportControl);
      //
      delete this.supportControl;
    }
  }
  //
  // Create new control
  let controlConf = this.createControlConfig();
  this.control = this.container.insertBefore({child: controlConf.mainControlConfig, sib: this.getActivatorPosition() === "right" ? this.activator?.id || this.badgeObj?.id : undefined});
  this.elements.push(this.control);
  this.mainObjects.push(this.control);
  //
  if (this.getType() === Client.IdfField.controlTypes.HTMLEDITOR)
    this.control.className = controlConf.mainControlConfig.className;
  //
  this.invokeCustomMethods();
  //
  // If there is a support control, create it
  if (controlConf.supportControlConfig) {
    this.supportControl = this.container.insertBefore({child: controlConf.supportControlConfig});
    this.mainObjects.push(this.supportControl);
    //
    // In case of multi upload, set multiple property on file input
    if (this.multiUpload) {
      let fileInput = this.supportControl.getRootObject();
      fileInput.multiple = true;
    }
  }
  //
  // Enable key events
  this.control.enableKeyEvent({inputs: true, type: "down"});
  this.control.enableKeyEvent({inputs: true, type: "up"});
  //
  // If I'm a combo, override Client.IonAutoComplete.positionCombo in order to customize combo position and dimensions
  if (this.isCombo())
    this.adjustCombo();
  //
  // In case of text EDIT, control is a contenteditable span. But I want it to act like an input
  if (this.isTextEdit() && !this.useInput)
    Client.Element.simulateInput({domObj: this.control.getRootObject(), showHTML: this.showHTML(), fixEmpty: true});
  //
  let update = {};
  update.enabled = true;
  update.visible = true;
  update.blob = true;
  update.clickable = true;
  update.showHtml = true;
  update.numRows = true;
  update.value = (this.value !== undefined);
  update.maxLength = (this.maxLength !== undefined);
  update.valueList = (this.valueList !== undefined);
  update.showHtmlEditorToolbar = (this.showHtmlEditorToolbar !== undefined);
  update.alignment = (this.getAlignment() !== undefined);
  update.backColor = (this.backColor !== undefined);
  update.color = (this.color !== undefined);
  update.mask = (this.getMask() !== undefined);
  update.fontModifiers = (this.fontModifiers !== undefined);
  update.image = (this.image !== undefined);
  update.imageResizeMode = (this.imageResizeMode !== undefined);
  update.className = (this.className !== undefined);
  update.filter = (this.filter !== undefined);
  update.qbeStatus = (this.isInQbe !== undefined);
  update.subFrame = (this.subFrame !== undefined);
  update.placeholder = (this.placeholder !== undefined);
  //
  return update;
};


/**
 * Check if I need to create a new control
 */
Client.IdfControl.prototype.needNewControl = function ()
{
  // If I don't have a control, I need one
  if (!this.control)
    return true;
  //
  // If type is changed, I need a new control
  if (this.getType() !== this.oldType)
    return true;
  //
  // If multi rows is changed, I need a new control
  if (this.isMultiRows() !== this.oldMultiRows)
    return true;
  //
  // If some properties are changed, I need a new control
  let oldProps = [this.oldBlobMime, this.oldIsPassword, this.oldAlignment];
  let newProps = [this.blobMime, this.isPassword, this.currentAlignment];
  //
  // If data type has changed but it's still a date or time, I don't need to recreate control
  if (!Client.IdfField.isDateOrTime(this.dataType) || !Client.IdfField.isDateOrTime(this.oldDataType)) {
    oldProps.push(this.oldDataType);
    newProps.push(this.dataType);
  }
  //
  for (let i = 0; i < newProps.length; i++) {
    let oldProp = oldProps[i];
    let newProp = newProps[i];
    //
    if (newProp !== oldProp)
      return true;
  }
  //
  return false;
};


/**
 * Update blob control
 */
Client.IdfControl.prototype.updateBlobControl = function ()
{
  // Get overlay
  let blobOverlay = this.control.elements[1];
  //
  let overlayVisible = this.uploadBlobEnabled || this.deleteBlobEnabled || this.viewBlobEnabled;
  //
  // If blob has no enabled commands, remove blob overlay
  if (!overlayVisible) {
    // If it exists, remove it
    if (blobOverlay) {
      this.control.removeChild(blobOverlay);
      //
      delete this.uploadBlobConf;
      delete this.deleteBlobConf;
      delete this.viewBlobConf;
    }
    //
    return;
  }
  //
  if (!blobOverlay) {
    // Create overlay configuration
    let overlayConfig = this.createElementConfig({c: "Container", className: "control-blob-overlay", children: [], events: ["onClick"]});
    //
    // Create upload blob icon configuration
    let tooltip = Client.Widget.getHTMLTooltip(Client.IdfResources.t("TIP_TITLE_LoadDoc"), Client.mainFrame.wep ? Client.mainFrame.wep.SRV_MSG_LoadDoc : "");
    this.uploadBlobConf = this.createElementConfig({c: "IonButton", className: "control-blob-upload", icon: "download", tooltip, events: ["onClick"]});
    overlayConfig.children.push(this.uploadBlobConf);
    //
    // Create delete blob icon configuration
    tooltip = Client.Widget.getHTMLTooltip(Client.IdfResources.t("TIP_TITLE_DeleteDoc"), Client.mainFrame.wep ? Client.mainFrame.wep.SRV_MSG_DeleteDoc : "");
    this.deleteBlobConf = this.createElementConfig({c: "IonButton", className: "", icon: "trash", tooltip, events: ["onClick"]});
    overlayConfig.children.push(this.deleteBlobConf);
    //
    // Create view blob icon configuration
    tooltip = Client.Widget.getHTMLTooltip(Client.IdfResources.t("TIP_TITLE_ShowDoc"), Client.mainFrame.wep ? Client.mainFrame.wep.SRV_MSG_ShowDoc : "");
    this.viewBlobConf = this.createElementConfig({c: "IonButton", className: "", icon: "open", tooltip, events: ["onClick"]});
    overlayConfig.children.push(this.viewBlobConf);
    //
    // Create overlay as control child
    blobOverlay = this.control.insertBefore({child: overlayConfig});
  }
  //
  // Update upload button visibility
  Client.Widget.updateObject(blobOverlay.elements[0], {visible: this.uploadBlobEnabled});
  //
  // Update delete button visibility
  Client.Widget.updateObject(blobOverlay.elements[1], {visible: this.deleteBlobEnabled});
  //
  // Update view button visibility
  Client.Widget.updateObject(blobOverlay.elements[2], {visible: this.viewBlobEnabled});
  //
  // Update accepted extensions
  let fileInput = this.supportControl.getRootObject();
  fileInput.accept = (this.uploadExtensions !== "*.*") ? this.uploadExtensions : "";
};


/**
 * Update blob control
 */
Client.IdfControl.prototype.updateMultiupload = function ()
{
  // Update accepted extensions
  let fileInput = this.supportControl.getRootObject();
  fileInput.accept = (this.uploadExtensions !== "*.*") ? this.uploadExtensions : "";
};


/**
 * Update control enabled status
 */
Client.IdfControl.prototype.updateEnabled = function ()
{
  let enabled = this.isEnabled();
  //
  switch (this.getType()) {
    case Client.IdfField.controlTypes.EDIT:
    case Client.IdfField.controlTypes.COMBO:
      // Do nothing on web, on mobile we need to disable the keyboard on the device
      if (this.contentEditable && (Client.mainFrame.device.isMobile || Client.mainFrame.idfMobile)) {
        // Date fields on mobile must never be edited raw, only with the calendar (masking doesn't work)
        if (Client.IdfField.isDateOrTime(this.dataType))
          Client.Widget.updateObject(this.control, {contentEditable: false, readOnly: true});
        else
          Client.Widget.updateObject(this.control, {contentEditable: enabled, readOnly: !enabled});
      }
      break;

    case Client.IdfField.controlTypes.OPTION:
      for (let i = 0; i < this.control.elements.length; i++)
        Client.Widget.updateObject(this.control.elements[i].elements[0], {disabled: !enabled});
      break;

    case Client.IdfField.controlTypes.BUTTON:
      // I can't disable button in editing mode, otherwise it cannot be clicked or dragged.
      // Instead, simulate disabled state by using a class
      if (Client.mainFrame.isEditing())
        Client.Widget.updateElementClassName(this.control, "control-editing-disabled", enabled);
      else
        Client.Widget.updateObject(this.control, {disabled: !enabled});
      break;

    default:
      Client.Widget.updateObject(this.control, {disabled: !enabled});
      break;
  }
};


/**
 * Create activator
 */
Client.IdfControl.prototype.createActivator = function ()
{
  let needActivator = !!this.getActivatorImage() && (this.activatorWidth === undefined || this.activatorWidth === null || this.activatorWidth > 0);
  if (!needActivator)
    return;
  //
  // If I already had an activator and alignment is not changed, do nothing
  if (this.activator && this.getAlignment() === this.oldAlignment)
    return;
  //
  // I have to create activator, so remove the old one, if any
  if (this.activator) {
    let index = this.mainObjects.findIndex(obj => obj.id === this.activator.id);
    this.mainObjects.splice(index, 1);
    //
    this.container.removeChild(this.activator);
  }
  //
  // Init activator style
  this.activatorStyle = {};
  //
  let tooltip;
  if (this.isRowQbe) {
    let title = Client.IdfResources.t("LFIL_FILTER_CAPT");
    let content = Client.IdfResources.t("FIL_OPEN_FILTER_POPUP");
    let fknum = Client.IdfPanel.FKEnterQBE;
    //
    tooltip = Client.Widget.getHTMLTooltip(title, content, fknum);
  }
  //
  let activatorPosition = this.getActivatorPosition();
  let activatorConf = this.createElementConfig({c: "IonButton", className: "control-activator" + (this.isRowQbe ? " qbe" : "") + " " + activatorPosition, tooltip, events: ["onClick", "onFocusin"]});
  this.activator = this.container.insertBefore({child: activatorConf, sib: activatorPosition === "left" ? this.control.id : undefined});
  this.mainObjects.push(this.activator);
  //
  let update = {
    activatorWidth: (this.activatorWidth !== undefined),
    activatorBackColor: (this.backColor !== undefined),
    activatorImage: true
  };
  //
  return update;
};


/**
 * Create badge
 */
Client.IdfControl.prototype.createBadge = function ()
{
  // A row qbe control doesn't need badge
  if (this.isInQbe)
    return;
  //
  if (!this.badge && this.badge !== 0) {
    // If I had a badge, I don't need it anymore
    if (this.badgeObj) {
      this.container.removeChild(this.badgeObj);
      delete this.badgeObj;
    }
    //
    return;
  }
  //
  // If I already have a badge and alignment is not changed, do nothing
  if (this.badgeObj && this.getAlignment() === this.oldAlignment)
    return;
  //
  // I have to create badge, so remove the old one, if any
  if (this.badgeObj) {
    let index = this.mainObjects.findIndex(obj => obj.id === this.badgeObj.id);
    this.mainObjects.splice(index, 1);
    //
    this.container.removeChild(this.badgeObj);
  }
  //
  // Create badge
  let badgeConf = this.createElementConfig({c: "IonBadge", className: "generic-badge" + (this.badgeInside ? " inside" : "")});
  let sib = this.badgeInside && this.getActivatorPosition() === "left" ? this.activator?.id || this.control.id : undefined;
  this.badgeObj = this.container.insertBefore({child: badgeConf, sib});
  this.mainObjects.push(this.badgeObj);
  //
  let update = {
    badge: true
  };
  //
  return update;
};


/**
 * Update control, activator and badge
 * @param {Object} update
 */
Client.IdfControl.prototype.updateObjects = function (update)
{
  let type = this.getType();
  //
  // Update blob control
  if (update.blob && type === Client.IdfField.controlTypes.BLOB)
    this.updateBlobControl();
  //
  // Update MultiUploadControl
  if (update.multiupload && this.multiUpload)
    this.updateMultiupload();
  //
  // Update html editor toolbar
  if (update.showHtmlEditorToolbar && type === Client.IdfField.controlTypes.HTMLEDITOR)
    Client.Widget.updateElementClassName(this.control, "hide-buttons", this.showHtmlEditorToolbar);
  //
  // Update show html status
  if (update.showHtml)
    Client.Widget.updateElementClassName(this.control, "show-html", !this.showHTML());
  //
  if (update.showMobileTooltip)
    Client.Widget.updateElementClassName(this.control, "mobile-tooltip", (this.tooltip ? false : true));
  //
  // Update enabled state
  if (update.enabled)
    this.updateEnabled();
  //
  // Update visible
  if (update.visible)
    Client.Widget.updateObject(this.control, {visible: this.visible});
  //
  // Update max length
  if (update.maxLength && type === Client.IdfField.controlTypes.EDIT)
    Client.Widget.updateObject(this.control, {maxLength: this.maxLength});
  //
  // Update mask
  if (update.mask && type === Client.IdfField.controlTypes.EDIT)
    Client.Widget.updateObject(this.control, {mask: this.getMask(), maskType: this.getMaskType()});
  //
  // Update value list
  if (update.valueList && this.isCombo()) {
    // Also update allowNull property since it depends on value list items
    this.control.updateElement({allowNull: ((this.optional || this.isInQbe) && this.valueList?.items?.[0]?.value !== "")});
    //
    if (this.control.value !== undefined || this.control.lastChange !== "")
      this.control.updateElement({list: this.getComboList()});
  }
  //
  // Write value, if it's changed
  if (update.value)
    this.writeValue();
  //
  // If I'm a smart lookup or a value source, I have to open my combo on value list change
  if (update.valueList && this.waitingForList)
    this.openCombo();
  //
  if (update.numRows)
    Client.Widget.updateElementClassName(this.control, "control-multirows", !this.isMultiRows());
  //
  // Update alignment
  if (update.alignment) {
    let alignment = this.getAlignment();
    if (type === Client.IdfField.controlTypes.CHECK)
      alignment = Client.IdfVisualStyle.alignments.CENTER;
    else if (this.isCombo())
      alignment = Client.IdfVisualStyle.alignments.LEFT;
    //
    let textAlign = Client.IdfVisualStyle.getTextAlign(alignment);
    this.addVisualStyleClasses(this.control, {alignment: textAlign});
  }
  //
  // Update background color
  if (update.backColor) {
    if (!this.parentWidget.isBackgroundApplied()) {
      if (type === Client.IdfField.controlTypes.EDIT || this.isCombo())
        this.control.getRootObject().style.backgroundColor = this.backColor;
      else
        this.control.updateElement({style: {backgroundColor: this.backColor}});
    }
  }
  //
  // Update color
  if (update.color) {
    // In case of OPTION, I have to set color on each option
    if (type === Client.IdfField.controlTypes.OPTION) {
      for (let i = 0; i < this.control.elements.length; i++)
        this.control.elements[i].updateElement({style: {color: this.color}});
    }
    else
      this.control.updateElement({style: {color: this.color}});
  }
  //
  // Update font modifiers
  if (update.fontModifiers) {
    let font = Client.IdfVisualStyle.getFont(this.fontModifiers, true);
    this.control.updateElement({style: {fontStyle: font.style, fontWeight: font.weight, textDecoration: font.decoration}});
  }
  //
  // Update image
  if (update.image)
    this.updateImage();
  //
  // Update image resize mode
  if (update.imageResizeMode)
    this.updateImageResizeMode();
  //
  // Update className
  if (update.className && (this.realizing || this.oldClassName !== this.className)) {
    let obj = this.classNameOnParent ? this.control.parent : this.control;
    Client.Widget.updateElementClassName(obj, this.oldClassName, true);
    Client.Widget.updateElementClassName(obj, this.className);
  }
  //
  // Update filter
  if (update.filter)
    this.updateFilter();
  //
  // Update QBE status
  if (update.qbeStatus)
    this.updateQbeStatus();
  //
  // Update subframe
  if (update.subFrame)
    this.updateSubFrame();
  //
  // Update custom children
  if (update.customChildren)
    this.updateCustomChildren();
  //
  // Update placeholder
  if (update.placeholder) {
    if ([Client.IdfField.controlTypes.EDIT,
      Client.IdfField.controlTypes.COMBO,
      Client.IdfField.controlTypes.HTMLEDITOR,
      Client.IdfField.controlTypes.CUSTOM].includes(type)) {
      if (this.isTextEdit() && !this.useInput)
        this.control.getRootObject().setAttribute("placeholder", this.placeholder);
      else
        Client.Widget.updateObject(this.control, {placeholder: this.placeholder});
    }
  }
  //
  // Add/remove clickable css class
  if (update.clickable)
    Client.Widget.updateElementClassName(this.control, "control-clickable", !this.isClickable());
  //
  // Update tooltip
  if (update.tooltip)
    Client.Widget.updateObject(this.container, {tooltip: this.tooltip});
  //
  // Update activator
  if (this.activator) {
    // Update activator image
    if (update.activatorImage)
      this.updateActivatorImage();
    //
    // Update activator visibility
    let style = {};
    style.display = this.isActivatorVisible() ? "" : "none";
    //
    // Update activator width
    if (update.activatorWidth && !this.isRowQbe) {
      style.width = "auto";
      style.height = "100%";
      style.fontSize = this.activatorWidth === null ? "" : this.activatorWidth + "px";
    }
    //
    // Update background color
    if (update.activatorBackColor && !this.parentWidget.isBackgroundApplied())
      style.backgroundColor = this.backColor;
    //
    Client.Widget.updateStyle(this.activator, this.activatorStyle, style);
  }
  //
  // Update badge
  if (this.badgeObj && update.badge)
    Client.Widget.updateObject(this.badgeObj, {innerText: this.badge});
};


/**
 * Update image
 */
Client.IdfControl.prototype.updateImage = function ()
{
  let prefix = this.image?.startsWith("http") || this.image?.startsWith("https") ? "" : "images/";
  let src = this.image ? (Client.mainFrame.isIDF ? prefix : "") + this.image : "";
  let url = src ? "url('" + src + "')" : "";
  //
  let el = this.getType() === Client.IdfField.controlTypes.BUTTON ? this.control : this.container;
  el.updateElement({style: {backgroundImage: encodeURI(url)}});
};


/**
 * Update image resize mode
 */
Client.IdfControl.prototype.updateImageResizeMode = function ()
{
  let imgContainer = this.container;
  //
  let className = imgContainer.className || imgContainer.getRootObject().className || "";
  //
  // Get old and new resize mode class
  let oldResizeMode = className.split(" ").find(c => c.startsWith("control-blob-img-"));
  let newResizeMode = this.getImageResizeModeClass();
  //
  // If they are different, update control class name
  if (oldResizeMode !== newResizeMode) {
    Client.Widget.updateElementClassName(imgContainer, "control-blob-img " + (oldResizeMode || ""), true);
    Client.Widget.updateElementClassName(imgContainer, "control-blob-img " + newResizeMode);
  }
};


/**
 * Update activator image
 */
Client.IdfControl.prototype.updateActivatorImage = function ()
{
  Client.Widget.setIconImage({image: this.getActivatorImage(), el: this.activator});
};


/**
 * Update custom children
 */
Client.IdfControl.prototype.updateCustomChildren = function ()
{
  if (!this.customChildrenConf)
    return;
  //
  for (let i = 0; i < this.customChildrenConf.length; i++) {
    let customChildConf = this.customChildrenConf[i];
    //
    if (customChildConf._remove)
      this.control.removeChild(customChildConf);
    else {
      if (Client.eleMap[customChildConf.id])
        Client.eleMap[customChildConf.id].moving = true;
      //
      let customChild = this.control.insertBefore({child: this.createElementConfig(customChildConf)});
      customChild.parentWidget = this;
      delete customChild.moving;
      //
      if (!customChildConf._skipUpdate)
        customChild.updateElement(Object.assign({}, customChildConf));
    }
  }
};


/**
 * Update sub frame
 */
Client.IdfControl.prototype.updateSubFrame = function ()
{
  let controlVisible = true;
  //
  if (this.subFrameConf) {
    controlVisible = false;
    //
    if (this.subFrame && this.subFrame.id !== this.subFrameConf.id)
      this.container.removeChild(this.subFrame);
    //
    this.subFrame = Client.eleMap[this.subFrameConf.id];
    //
    // If subFrame does not exist yet, remember to realize command sets too
    let realizeCommandSets = !this.subFrame;
    //
    // insertBefore has to use a different rootObject when inserting a subframe
    if (this.subFrame)
      this.subFrame.moving = true;
    //
    this.subFrame = this.container.insertBefore({child: this.subFrameConf});
    delete this.subFrame.moving;
    //
    if (realizeCommandSets)
      Client.mainFrame.wep?.commandList?.realizeViewCommandsets(this.parentIdfView);
    //
    delete this.subFrameConf;
  }
  else
    delete this.subFrame;
  //
  // Hide control if there is a subFrame
  Client.Widget.updateObject(this.control, {visible: controlVisible});
};


/**
 * Override some combo methods to adapt them to what I need
 */
Client.IdfControl.prototype.adjustCombo = function ()
{
  this.control.positionCombo = () => {
    Client.IonAutoComplete.prototype.positionCombo.call(this.control);
    //
    // Get my container's rects
    let container = this.container.getRootObject();
    let containerRects = container.getBoundingClientRect();
    //
    let isListContainer = container.className.indexOf("panel-list-col") !== -1;
    //
    // Adjust combo position and width
    let left = containerRects.left + (isListContainer ? -1 : 1);
    let minWidth = containerRects.width + (isListContainer ? 20 : 18);
    //
    let comboRects = this.control.comboObj.getBoundingClientRect();
    //
    let top = comboRects.top;
    if (this.control.isComboUp())
      top = containerRects.top - comboRects.height;
    //
    top += containerRects.top > comboRects.top ? 1 : -2;
    this.control.comboObj.style.top = top + "px";
    //
    this.control.comboObj.style.left = left + "px";
    this.control.comboObj.style.width = containerRects.width > 0 ? "auto" : "0px";
    this.control.comboObj.style.minWidth = minWidth + "px";
    //
    // Check if I have to set combo background color, items color or items font modifier
    if (this.backColor !== undefined || this.color !== undefined || this.fontModifiers !== undefined) {
      if (!this.control.comboObj.children[0] || !this.control.comboObj.children[0].children[0])
        return;
      //
      // Get internal ion-list
      let comboList = this.control.comboObj.children[0].children[0];
      //
      // Set background color and/or color on items
      for (let i = 0; i < comboList.children.length; i++) {
        if (this.backColor !== undefined)
          comboList.children[i].style.backgroundColor = this.backColor;
        if (this.color !== undefined)
          comboList.children[i].style.color = this.color;
        if (this.fontModifiers !== undefined) {
          let font = Client.IdfVisualStyle.getFont(this.fontModifiers, true);
          //
          if (font.style)
            comboList.children[i].style.fontStyle = font.style;
          if (font.weight)
            comboList.children[i].style.fontWeight = font.weight;
          if (font.decoration)
            comboList.children[i].style.textDecoration = font.decoration;
        }
      }
    }
  };
  //
  this.control.onInputKeyUp = (ev) => {
    if (this.isEnabled())
      Client.IonAutoComplete.prototype.onInputKeyUp.call(this.control, ev);
  };
  //
  this.control.onInputKeyDown = (ev) => {
    let k = ev.keyCode;
    //
    // DOWN or UP when the list is closed, prevent combo opening
    if ((k === 40 || k === 38) && !this.isComboOpen())
      return;
    //
    if (this.isEnabled())
      Client.IonAutoComplete.prototype.onInputKeyDown.call(this.control, ev);
  };
  //
  this.control.closeCombo = (skipSend) => {
    Client.IonAutoComplete.prototype.closeCombo.call(this.control);
    //
    // Combo sends its value just on combo close
    if (!skipSend) {
      let events = this.parentWidget.onEvent({
        id: "chgProp",
        obj: this.id,
        content: {
          name: "value",
          value: this.control.value ?? ""
        }
      });
      //
      Client.mainFrame.sendEvents(events);
    }
    //
    if (!this.isListOwner())
      this.emptyComboList(true);
    //
    // A value source has to show its value when combo is closed and its name when combo is opened.
    // So on combo close I have to make control loose its value list (that cause control to show name)
    // in order to force it to recreate a value list containing just the value to show.
    // Since value source loose its value list on value change, update it now (even if its the same)
    if (this.isNoAutoLookup())
      this.updateObjects({value: true});
  };
  //
  if (!Client.mainFrame.isIDF)
    return;
  //
  this.control.setValue = (value, emitChange, ev) => {
    let ris = Client.IonAutoComplete.prototype.setValue.call(this.control, value, emitChange, ev);
    //
    if (Client.mainFrame.isIDF && !this.isInQbe) {
      Client.Widget.updateObject(this.control, {selectedText: this.getComboSelectedText()});
      Client.Widget.updateElementClassName(this.control, "control-icon-only", !this.isOnlyIconCombo());
    }
    //
    return ris;
  };
};


/**
 * Check if this control shows html
 */
Client.IdfControl.prototype.showHTML = function ()
{
  return (this.isTextEdit() && (this.useHtml || this.isClickable() || this.getMask(undefined, true) === "=" || Client.Widget.extractCaptionData(this.value || "").icon || (Client.mainFrame.idfMobile && this.tooltip)));
};


/**
 * Get control type
 * @param {Boolean} recalculate
 */
Client.IdfControl.prototype.getType = function (recalculate)
{
  // If there is a valid type and I don't have to recalculate it, get it
  if (!recalculate && this.currentType !== undefined)
    return this.currentType;
  //
  // Use html editor control if parent field editor type is html editor
  if (this.editorType === Client.IdfField.editorTypes.HTMLEDITOR && !this.isInQbe)
    return Client.IdfField.controlTypes.HTMLEDITOR;
  //
  // Use blob control if parent field data type is blob
  if (this.dataType === Client.IdfField.dataTypes.BLOB && !this.isInQbe)
    return Client.IdfField.controlTypes.BLOB;
  //
  if (this.customElement)
    return Client.IdfField.controlTypes.CUSTOM;
  //
  let type = this.type;
  switch (type) {
    case Client.IdfField.controlTypes.AUTO:
      // On IDC, use checkbox as control type if value list has exactly 2 items
      if (!Client.mainFrame.isIDF && this.valueList?.items.length === 2)
        type = Client.IdfField.controlTypes.CHECK;
      else if (this.valueList || (Client.mainFrame.isIDF && !this.isListOwner())) // Use combo for value list, value source and smart lookup
        type = Client.IdfField.controlTypes.COMBO;
      else // Otherwise use edit
        type = Client.IdfField.controlTypes.EDIT;
      break;

    case Client.IdfField.controlTypes.OPTION:
    case Client.IdfField.controlTypes.CHECK:
      // A check/radio without a value list becomes an edit
      if (!this.valueList)
        type = Client.IdfField.controlTypes.EDIT;
      break;

    case Client.IdfField.controlTypes.BLOB:
    case Client.IdfField.controlTypes.BUTTON:
    case Client.IdfField.controlTypes.HTMLEDITOR:
    case Client.IdfField.controlTypes.CUSTOM:
      if (this.forceEditType && (this.isInQbe || type === Client.IdfField.controlTypes.BUTTON))
        type = Client.IdfField.controlTypes.EDIT;
      break;
  }
  //
  return type;
};


/**
 * Check if activator is visible
 */
Client.IdfControl.prototype.isActivatorVisible = function ()
{
  if (!this.getActivatorImage())
    return;
  //
  // If I'm disabled and I don't have to show icon when disabled and I cannot activate or I'm not activable when disabled, don't show activator
  if (!this.isEnabled() && !Client.mainFrame.wep?.showDisabledIcons && (!this.canActivate || !this.activableDisabled))
    return;
  //
  return true;
};


/**
 * Return activator image
 * @param {Boolean} recalculate
 */
Client.IdfControl.prototype.getActivatorImage = function (recalculate)
{
  // If there is a valid activator image and I don't have to recalculate it, get it
  if (!recalculate && this.currentActivatorImage !== undefined)
    return this.currentActivatorImage;
  //
  let type = this.getType();
  let enabled = this.isEnabled();
  //
  // In qbe, don't show activator in case of BLOB or CHECK
  if (this.isInQbe && this.dataType === Client.IdfField.dataTypes.BLOB || type === Client.IdfField.controlTypes.CHECK)
    return "";
  //
  if (this.isRowQbe)
    return enabled ? "funnel" : "";
  //
  // In case of disabled only icon combo, don't show activator
  if (this.isOnlyIconCombo() && !enabled)
    return "";
  //
  // Just AUTO, EDIT and COMBO control type can have an activator
  let controlsTypes = [
    Client.IdfField.controlTypes.EDIT,
    Client.IdfField.controlTypes.COMBO
  ];
  if (controlsTypes.indexOf(type) === -1)
    return "";
  //
  // A negative activator width means I don't want the activator image to be shown
  if (this.activatorWidth !== null && this.activatorWidth <= 0)
    return "";
  //
  // If there is a custom activator image, get it
  if (this.activatorImage)
    return this.activatorImage;
  //
  // In case of combo, get dropdown icon as activator if:
  // - is IDC or
  // - cannot activate or
  // - is noAutoLookup or
  // - wep explicitly tells to show smart lookup icon on lookup fields
  if (this.isCombo() && (!Client.mainFrame.isIDF || !this.canActivate || this.isNoAutoLookup() || (Client.mainFrame.wep?.showSmartLookupIcon && this.comboType)))
    return "arrow-dropdown";
  //
  // If parent field is date or time, show specific activator just in case they are not activable
  if (Client.IdfField.isDateOrTime(this.dataType) && !this.canActivate) {
    if (Client.IdfField.isDate(this.dataType)) // Get calendar ion-icon for date and datetime field
      return "calendar";
    else if (this.dataType === Client.IdfField.dataTypes.TIME) // Get time ion-icon for time field (not in QBE)
      return this.isInQbe ? "" : "time";
  }
  //
  // If can activate, get more ion-icon
  if (this.canActivate && Client.mainFrame.isIDF && !this.forceEditType)
    return "more";
  //
  // No activator required
  return "";
};


/**
 * Return activator position
 */
Client.IdfControl.prototype.getActivatorPosition = function ()
{
  let position = "right";
  //
  // Check if I have to position activator on right
  if (Client.mainFrame.wep?.rightAlignedIcons)
    return position;
  //
  // In case of row QBE, activator position is right
  if (this.isRowQbe || this.isCombo())
    return position;
  //
  // Get my alignment
  let alignment = this.getAlignment();
  //
  // If alignment is AUTO, it's RIGHT for numeric fields, left for other types of fields
  if (alignment === Client.IdfVisualStyle.alignments.AUTO)
    alignment = Client.IdfField.isNumeric(this.dataType) ? Client.IdfVisualStyle.alignments.RIGHT : Client.IdfVisualStyle.alignments.LEFT;
  //
  // If alignment is RIGHT, activator position is left
  if (alignment === Client.IdfVisualStyle.alignments.RIGHT)
    position = "left";
  //
  return position;
};


/**
 * Get alignment
 * @param {Boolean} recalculate
 */
Client.IdfControl.prototype.getAlignment = function (recalculate)
{
  // If there is a valid alignment and I don't have to recalculate it, get it
  if (!recalculate && this.currentAlignment !== undefined)
    return this.currentAlignment;
  //
  if (this.alignment !== -1)
    return this.alignment;
  //
  return Client.IdfVisualStyle.getByIndex(this.visualStyle).getAlignment();
};


/**
 * Get image resize mode class
 */
Client.IdfControl.prototype.getImageResizeModeClass = function ()
{
  let className = "";
  //
  switch (this.imageResizeMode) {
    case Client.IdfControl.stretches.FILL:
      className = "control-blob-img-fill";
      break;

    case Client.IdfControl.stretches.ENLARGE:
      className = "control-blob-img-enlarge";
      break;

    case Client.IdfControl.stretches.CROP:
      className = "control-blob-img-crop";
      break;

    case Client.IdfControl.stretches.REPEAT:
      className = "control-blob-img-repeat";
      break;

    case Client.IdfControl.stretches.CENTER:
      className = "control-blob-img-center";
      break;
  }
  //
  return className;
};


/**
 * Get mask type
 */
Client.IdfControl.prototype.getMaskType = function ()
{
  let maskType = "";
  //
  if (this.isInQbe)
    return maskType;
  //
  if (Client.IdfField.isDateOrTime(this.dataType))
    maskType = "D";
  else if (Client.IdfField.isNumeric(this.dataType))
    maskType = "N";
  else if (this.isTextEdit())
    maskType = "A";
  //
  return maskType;
};


/**
 * Get mask
 * @param {Boolean} upperCase
 * @param {Boolean} ignoreQbe
 */
Client.IdfControl.prototype.getMask = function (upperCase, ignoreQbe)
{
  if (this.isInQbe && !ignoreQbe)
    return "";
  //
  let mask = this.mask || Client.IdfVisualStyle.getByIndex(this.visualStyle)?.getMask() || "";
  //
  if (this.isTextEdit() && ["=", ">", "<"].includes(mask))
    return mask;
  //
  // Get default mask if needed
  if (!mask)
    mask = Client.IdfControl.getDefaultMask(this);
  //
  if (upperCase) {
    mask = mask.toUpperCase();
    mask = mask.replace("NN", "mm");
  }
  //
  // Adapt mask to max length and scale
  return (this.maskPrefix || "") + Client.IdfControl.adaptMask(mask, this);
};


/**
 * Adapt given mask to max length and scale
 * @param {String} mask
 * @@param {Object} options
 */
Client.IdfControl.adaptMask = function (mask, options)
{
  if (!mask)
    return mask;
  //
  if (Client.IdfField.isNumeric(options.dataType)) {
    if (options.dataType !== Client.IdfField.dataTypes.FLOAT) {
      // Get decimal separator position
      let sepIndex = mask.lastIndexOf(".");
      //
      // Calculate scale
      // Scale for currency type is mask's decimal digits
      // Scale for integer type is 0 (no decimal digits)
      let scale = options.scale;
      if (options.dataType === Client.IdfField.dataTypes.CURRENCY)
        scale = mask.length - sepIndex - 1;
      if (options.dataType === Client.IdfField.dataTypes.INTEGER)
        scale = 0;
      //
      // Adapt integer part using scale and max length. I eventually have to cut off some integer digits
      let integerDigits = options.maxLength - scale;
      if (integerDigits > 0) {
        if (sepIndex === -1)
          sepIndex = mask.length;
        //
        for (let i = sepIndex - 1; i >= 0; i--) {
          let ch = mask.charAt(i);
          //
          // If current character is not an integer digit placeholder, continue
          if (ch !== "0" && ch !== "#")
            continue;
          //
          integerDigits--;
          //
          // If I reached the maximum allowed integer digits, truncate mask
          if (integerDigits === 0 && i > 0) {
            mask = mask.substr(i);
            break;
          }
        }
      }
      //
      // Adapt decimal part cutting off unnecessary decimal digits
      // Get decimal separator position (mask may has changed)
      sepIndex = mask.lastIndexOf(".");
      //
      if (sepIndex !== -1 && scale >= 0) {
        // If there is "." without decimal digits, cut off decimal part
        if (scale === 0)
          mask = mask.substring(0, sepIndex);
        else {
          for (let i = sepIndex + 1; i < mask.length; i++) {
            let ch = mask.charAt(i);
            //
            // If current character is not a decimal digit placeholder, continue
            if (ch !== "0" && ch !== "#")
              continue;
            //
            scale--;
            //
            // If I reached the allowed decimal digits, truncate mask
            if (scale === 0) {
              mask = mask.substring(0, i + 1);
              break;
            }
          }
        }
      }
    }
    //
    // Replace "0" with "#" in integer part
    for (let i = 0; i < mask.length; i++) {
      let ch = mask.charAt(i);
      if (ch === ".")
        break;
      if (ch === "0")
        mask = mask.substr(0, i) + "#" + mask.substring(i + 1);
    }
    //
    // Change decimal separator if needed
    let idcDecimalSeparator = Client.mainFrame.theme.decimalSeparator || Client.mainFrame.device.numberPattern.decimal;
    let decimalDot = Client.mainFrame.isIDF ? Client.mainFrame.wep.decimalDot : idcDecimalSeparator === ".";
    //
    if (!decimalDot) {
      let sepIndex = mask.lastIndexOf(".");
      mask = mask.replace(/,/g, ".");
      if (sepIndex !== -1)
        mask = mask.substr(0, sepIndex) + "," + mask.substring(sepIndex + 1);
    }
  }
  else if (Client.IdfField.isText(options.dataType)) {
    // Truncate max if needed
    if (mask.length > options.maxLength)
      mask = mask.substr(0, options.maxLength);
  }
  //
  return mask;
};


/**
 * Get value to send
 */
Client.IdfControl.prototype.getValueToSend = function ()
{
  let type = this.getType();
  //
  let value;
  switch (type) {
    case Client.IdfField.controlTypes.COMBO:
      value = this.control.value;
      //
      if (this.isSmartLookup() && !value)
        value = "LKENULL";
      //
      if (value === null)
        value = "";
      break;

    case Client.IdfField.controlTypes.CHECK:
      if (this.value === "---")
        value = this.isRowQbe || !Client.mainFrame.isIDF ? "" : "---";
      else if (this.control.getRootObject().checked && !this.control.indeterminate)
        value = this.isRowQbe || !Client.mainFrame.isIDF ? this.valueList.items[0].value : "on";
      else
        value = this.isRowQbe || !Client.mainFrame.isIDF ? this.valueList.items[1].value : "";
      break;

    case Client.IdfField.controlTypes.CHECKLIST:
      value = [];
      for (let i = 0; i < this.control.elements.length; i++) {
        let checkItem = this.control.elements[i].getRootObject();
        let checkInput = this.control.elements[i].elements[0].getRootObject();
        //
        if (checkInput.checked)
          value.push(checkItem.itemValue);
      }
      break;

    case Client.IdfField.controlTypes.EDIT:
      let msk = this.getMask();
      //
      if (this.isRowQbe && this.valueList)
        value = this.findValueListItems({type: "name", value: this.control.getRootObject().value}) || this.control.getRootObject().value;
      else if (Client.IdfField.isDateOrTime(this.dataType)) {
        value = value ?? this.control.domObj.value;
        if (value && (!this.isInQbe || value.includes("T")))
          value = moment(this.getISODateTime(value)).format(this.getMask(true));
      }
      else if (Client.IdfField.isNumeric(this.dataType)) {
        value = this.control.domObj.value;
        if (!Client.mainFrame.isIDF && !this.isInQbe)
          value = mask_unmask(value, msk, this.getMaskType());
      }
      else if (this.isTextEdit()) {
        value = (this.useInput ? this.control.domObj.value : this.control.getRootObject().value) || "";
        if (!Client.mainFrame.isIDF && !this.isInQbe && msk)
          value = mask_unmask(value, msk, this.getMaskType());
      }
      else
        value = (this.control.value ?? "").toString();
      break;

    default:
      value = (this.control.value ?? "").toString();
      break;
  }
  //
  return value;
};


/**
 * Update QBE status
 */
Client.IdfControl.prototype.updateQbeStatus = function ()
{
  let props = {};
  //
  let type = this.getType();
  //
  switch (type) {
    case Client.IdfField.controlTypes.COMBO:
      props.multiple = this.isMultipleCombo();
      props.nameSeparator = this.getComboNameSeparator();
      props.valueSeparator = this.comboSeparator;
      //
      // Combo is going to become multiple, but its multiple value has been set when it was not multiple.
      // So in this case I have to force value update
      if (props.multiple) {
        delete this.control.value;
        props.value = this.value;
      }
      break;
  }
  //
  Client.Widget.updateObject(this.control, props);
};


/**
 * Update filter
 */
Client.IdfControl.prototype.updateFilter = function ()
{
  let type = this.getType();
  //
  switch (type) {
    case Client.IdfField.controlTypes.CHECKLIST:
      for (let i = 0; i < this.control.elements.length; i++) {
        let checkItem = this.control.elements[i];
        //
        if (checkItem.getRootObject().itemValue === this.valueList?.headers)
          continue;
        //
        let visible = (!this.filter || checkItem.getRootObject().itemName.toLowerCase().includes(this.filter));
        Client.Widget.updateObject(checkItem, {visible});
      }
      break;
  }
};


/**
 * Open combo
 * @param {String} filter
 */
Client.IdfControl.prototype.openCombo = function (filter)
{
  filter = filter || "";
  //
  this.control.fullCombo = true;
  this.control.openCombo(filter, true);
  //
  delete this.waitingForList;
};


/**
 * Request full combo
 */
Client.IdfControl.prototype.activateCombo = function ()
{
  if ((this.control.isOpening() || !this.isComboOpen()) && !this.isListOwner())
    this.control.sendFilter(" ");
};


/**
 * Empty list
 * @param {Boolean} addDecode
 */
Client.IdfControl.prototype.emptyComboList = function (addDecode)
{
  let valueList = this.valueList ? Object.assign({}, this.valueList) : {};
  valueList.items = [];
  valueList.clientSide = true;
  //
  if (addDecode && this.value && this.value !== "LKENULL") {
    // In case of multiple value source, split its values and push them as value list items
    let newValues = this.value.toString().split(this.comboSeparator);
    let newNames;
    if (Client.mainFrame.isIDF)
      newNames = this.value.toString().split(this.comboSeparator);
    else
      newNames = (this.control?.lastDescription || this.value?.toString() || "").split(this.comboSeparator);
    //
    newValues.forEach((v, i) => {
      v = v.trim();
      let n = newNames[i]?.trim();
      //
      let newItem = {name: n, value: v};
      //
      let foundItem = this.valueList?.items?.find(item => {
        if (item.value?.toString() === v)
          return true;
        //
        let decode = item.name;
        if (this.valueList.decodeColumn)
          decode = item.name.split("|")[this.valueList.decodeColumn - 1];
        //
        return decode === v;
      });
      if (foundItem)
        newItem = Object.assign({}, foundItem);
      //
      if (this.isNoAutoLookup()) {
        newItem.name = newItem.value;
        //
        // If valueList has headers, the form of newItem.name has to be "value|value|value..." otherwise valueList.decodeColumn cannot extract the correct name
        let headers = this.valueList?.headers || "";
        newItem.name = newItem.name.split(this.comboSeparator).map(n => (n + "|").repeat(headers.split("|").length - 1) + n).join(this.comboSeparator);
      }
      //
      valueList.items.push(newItem);
    });
  }
  //
  // If current value list or the new one is different from default ({items: []}), give it to my parent widget
  if (this.valueList || valueList.items.length > 0) {
    delete this.waitingForList;
    //
    // I'm going to empty value list.
    // Since combo opens on valueList change if this.control.comboOpening is true, I delete it and restore its value after value list update
    let oldComboOpening = this.control?.comboOpening;
    if (this.control)
      delete this.control.comboOpening;
    //
    this.parentWidget.updateElement({valueList});
    //
    if (this.control)
      this.control.comboOpening = oldComboOpening;
  }
};


/**
 * Get list to populate combo
 */
Client.IdfControl.prototype.getComboList = function ()
{
  let list = [];
  if (!this.valueList)
    return list;
  //
  let columnsLength = [];
  let useHtml = false;
  //
  // If value list has headers, I have to use html items
  if (this.valueList.headers) {
    useHtml = true;
    //
    // Since I want to create a table structure, I have to know which is the width to give to each column.
    // So calculate the max length (in terms of chars) of each column
    //
    // Start with header columns
    let cols = this.valueList.headers.split("|");
    cols.forEach((c, i) => columnsLength[i] = c.length);
    //
    // Then go with items columns
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
    // Create combo header item
    let headerItem = this.createComboItem({
      name: this.valueList.headers,
      value: this.valueList.headers,
      s: "combo-header",
      useHtml,
      columnsLength,
      fixed: true,
      unselectable: true
    });
    list.push(headerItem);
  }
  //
  let actualGroup;
  for (let i = 0; i < this.valueList.items.length; i++) {
    let item = this.valueList.items[i];
    //
    // If item belongs to a group and I didn't create group item yet, create it now
    if (item.group && item.group !== actualGroup) {
      let groupItem = this.createComboItem({
        name: item.group,
        value: item.group,
        s: "combo-group-header",
        useHtml,
        unselectable: true
      });
      list.push(groupItem);
    }
    //
    // item object has already the right properties, but I want to add "useHtml" and "columnsLength".
    // So clone item attaching these two properties and use it to create a combo item
    let itemCopy = Object.assign({useHtml, columnsLength}, item);
    if (!Client.mainFrame.isIDF)
      itemCopy.enabled = true;
    let listItem = this.createComboItem(itemCopy);
    list.push(listItem);
    //
    actualGroup = item.group;
  }
  //
  return list;
};


/**
 * Create a combo item
 * @param {Object} itemObj
 */
Client.IdfControl.prototype.createComboItem = function (itemObj)
{
  // If name is "" use " " instead, otherwise IonAutoComplete won't create item
  let itemName = itemObj.name || " ";
  let itemHtml;
  let itemSrc;
  //
  if (Client.Widget.extractCaptionData(itemName).icon && !itemObj.useHtml && !itemObj.image) {
    let {caption, icon} = Client.Widget.extractCaptionData(itemName);
    itemName = caption;
    itemSrc = Client.Widget.getIconString({icon, format: "combo"});
  }
  //
  // Get src if I have an image
  if (itemObj.image)
    itemSrc = Client.Widget.isIconImage(itemObj.image) ? Client.Widget.getIconString({icon: itemObj.image, format: "combo"}) : (Client.mainFrame.isIDF ? "images/" : "") + itemObj.image;
  //
  // If item content has to be html, create a "div" row and its "div" columns
  if (itemObj.useHtml) {
    let cols = itemName.split("|");
    //
    itemHtml = "<div class='item-html-wrapper'>";
    for (let i = 0; i < cols.length; i++) {
      let width = (i !== cols.length - 1) ? (itemObj.columnsLength[i] * 8) + "px" : "auto";
      itemHtml += "<div style='width:" + width + ";'>" + cols[i] + "</div>";
    }
    itemHtml += "</div>";
    //
    // Use decode column as item name
    itemName = cols[(this.valueList.decodeColumn ?? 1) - 1];
  }
  //
  let itemClass = itemObj.s;
  if (!itemClass) {
    if (itemObj.value === "" || itemObj.value === "LKENULL")
      itemClass = "combo-item-empty";
    else
      itemClass = itemObj.enabled ? "combo-item" : "combo-item-disabled";
  }
  //
  let item = {};
  item.n = itemName;
  item.v = itemObj.value;
  if (this.isInQbe)
    item.v = item.v + "";
  item.rValue = itemObj.rValue;
  item.disabled = (itemObj.enabled === false); // undefined is true
  item.s = itemClass;
  item.src = itemSrc;
  item.html = itemHtml;
  item.fixed = itemObj.fixed;
  item.unselectable = itemObj.unselectable;
  //
  return item;
};


/**
 * Get combo name separator
 */
Client.IdfControl.prototype.getComboNameSeparator = function ()
{
  return (Client.mainFrame.isIDF ? Client.mainFrame.wep.comboNameSeparator : Client.IdfControl.nameSeparator);
};


/**
 * Find value list items based on given filter
 * @param {Object} filter
 */
Client.IdfControl.prototype.findValueListItems = function (filter)
{
  let value = "";
  //
  if (!this.valueList || !filter)
    return value;
  //
  let filterType = filter.type || "value";
  let filterValues = filter.value?.split(this.comboSeparator) || [];
  //
  for (let i = 0; i < filterValues.length; i++) {
    let item = this.valueList.items.find(item => item[filterType]?.toLowerCase().trim() === filterValues[i]?.toLowerCase().trim());
    if (item)
      value += (i > 0 ? this.comboSeparator : "") + item.value;
  }
  //
  return value;
};


/**
 * Get value from rValue
 * @param {String} rValue
 */
Client.IdfControl.prototype.getComboValueFromRValue = function (rValue)
{
  let value = "";
  //
  if (!this.valueList || !rValue)
    return value;
  //
  let rValuesArray = rValue.split(Client.IdfControl.rValueSeparator);
  //
  for (let i = 0; i < rValuesArray.length; i++) {
    let item = this.valueList.items.find(item => item.rValue === rValuesArray[i]);
    if (item)
      value += (i > 0 ? this.getComboNameSeparator() : "") + item.name;
  }
  //
  return value;
};


/**
 * Get rValue from value
 * @param {String} value
 */
Client.IdfControl.prototype.getComboRValueFromValue = function (value)
{
  let rValue = "";
  //
  if (!this.valueList || !value)
    return rValue;
  //
  let valuesArray = value.split(this.comboSeparator);
  //
  for (let i = 0; i < valuesArray.length; i++) {
    let item = this.valueList.items.find(item => item.value === valuesArray[i]);
    if (item)
      rValue += (i > 0 ? Client.IdfControl.rValueSeparator : "") + item.rValue;
  }
  //
  return rValue;
};


/**
 * Get text to show in combo input
 */
Client.IdfControl.prototype.getComboSelectedText = function ()
{
  // If combo is enabled, it shows name associated to selected value, so do nothing
  if (this.isEnabled())
    return;
  //
  let selectedText;
  //
  // Get flags from visual style
  let visualStyle = Client.IdfVisualStyle.getByIndex(this.visualStyle);
  let showDescription = visualStyle.getShowDescriptionFlag();
  let showValue = visualStyle.getShowValueFlag();
  //
  // Get item by current value
  let item = this.valueList?.items.find(item => item.value === this.value);
  //
  // If there's no item, get value as text to show if I can
  if (!item)
    selectedText = !this.showOnlyIcon && showDescription ? this.value : "";
  else {
    // No selected text if I have to show only icon
    if (this.isOnlyIconCombo())
      selectedText = "";
    else if (showDescription) { // Use name as selected text
      selectedText = item.name ?? "";
      if (this.valueList?.decodeColumn)
        selectedText = selectedText.split("|")[this.valueList.decodeColumn - 1];
    }
    else if (showValue) // Use value as selected text
      selectedText = item.value ?? "";
  }
  //
  return selectedText;
};


/**
 * Check if combo shows only icon
 */
Client.IdfControl.prototype.isOnlyIconCombo = function ()
{
  if (!Client.mainFrame.isIDF)
    return;
  //
  if (!this.isCombo())
    return;
  //
  let visualStyle = Client.IdfVisualStyle.getByIndex(this.visualStyle);
  //
  return this.showOnlyIcon || (!visualStyle.getShowDescriptionFlag() && !visualStyle.getShowValueFlag());
};


/**
 * Return true if combo is multiple
 */
Client.IdfControl.prototype.isMultipleCombo = function ()
{
  return this.isInQbe && this.comboMultiSel;
};


/**
 * Get default mask
 * @@param {Object} options
 */
Client.IdfControl.getDefaultMask = function (options)
{
  if (Client.IdfField.isDateOrTime(options.dataType))
    return Client.IdfControl.getDateTimeMask(options);
  else if (Client.IdfField.isNumeric(options.dataType))
    return Client.IdfControl.getNumericMask(options);
  else
    return "";
};


/**
 * Get date time mask
 * @@param {Object} options
 */
Client.IdfControl.getDateTimeMask = function (options)
{
  let dateMask = Client.mainFrame.wep?.dateMask || Client.mainFrame.device.dateFormat.toLowerCase();
  let timeMask = Client.mainFrame.wep?.timeMask || Client.mainFrame.device.timeFormat.toLowerCase();
  //
  let mask = "";
  switch (options.dataType) {
    case Client.IdfField.dataTypes.DATE:
      mask = dateMask;
      break;

    case Client.IdfField.dataTypes.TIME:
      mask = timeMask;
      break;

    case Client.IdfField.dataTypes.DATETIME:
      mask = dateMask + " " + timeMask;
      break;
  }
  //
  return mask;
};


/**
 * Get numeric mask
 * @@param {Object} options
 */
Client.IdfControl.getNumericMask = function (options)
{
  let mask = "";
  switch (options.dataType) {
    case Client.IdfField.dataTypes.CURRENCY:
    case Client.IdfField.dataTypes.DECIMAL:
      mask = Client.mainFrame.isIDF ? Client.mainFrame.wep.currencyMask : Client.mainFrame.device.currencyFormat;
      break;

    case Client.IdfField.dataTypes.FLOAT:
      mask = Client.mainFrame.isIDF ? Client.mainFrame.wep.floatMask : Client.mainFrame.device.numberFormat;
      break;

    case Client.IdfField.dataTypes.INTEGER:
      mask = "#".repeat((options.maxLength || 255) - 1) + "0";
      break;
  }
  //
  return mask;
};


/**
 * Get ISO format for current value
 * @param {String} value
 */
Client.IdfControl.prototype.getISODateTime = function (value)
{
  let mask;
  //
  if (!value.includes("T")) {
    mask = this.getMask(true, true);
    //
    if (this.dataType === Client.IdfField.dataTypes.TIME) {
      value = "1970-01-01T" + value;
      mask = "YYYY/MM/DDT" + mask;
    }
  }
  //
  return moment(value, mask).toISOString();
};


/**
 * Handle activator click
 * @@param {Object} event
 */
Client.IdfControl.prototype.handleActivatorClick = function (event)
{
  // If combo was open when I clicked on activator, do nothing because combo is going to be closed
  if (this.isCombo() && this.control.displayTimerId)
    return;
  //
  // In case of row qbe or double click, always route activator click to parent
  if (this.isRowQbe || (event.id === "onDblclick") || !this.isEnabled())
    return;
  //
  // If I'm a combo but not smart lookup nor value source, open combo immediately and don't route event to my parent
  if (this.isCombo()) {
    if (this.isListOwner()) {
      event.content.srcEvent.preventDefault();
      this.openCombo();
    }
    //
    return;
  }
  //
  // If my data type is date or time and I'm enabled but I cannot be activated, show date/time picker
  if (Client.IdfField.isDateOrTime(this.dataType) && !this.canActivate) {
    event.content.srcEvent.preventDefault();
    //
    // Get shared iondatetime instance and reparent it. Now I'm its owner
    this.supportControl = Client.eleMap["control-iondatetime"] || this.createSupportControlConfig();
    this.supportControl = this.container.insertBefore({child: this.supportControl});
    this.supportControl.parentWidget = this;
    //
    // Update its displayFormat, type and value
    this.supportControl.updateElement({displayFormat: this.getMask(true)});
    this.supportControl.textObj.type = this.supportControl.getInputType();
    this.supportControl.updateElement({value: this.getISODateTime(this.value)});
    //
    if (Client.mainFrame.idfMobile || Client.mainFrame.device.isMobile) {
      // On mobile we cannot use the native picker, on ios is broken (navigator.userActivation.isActive is false here, but it should be true)
      // so we use the mobile version that is not native
      // for sake of consistency we do the same regardless of OS, but in android the native picker works
      this.supportControl.myClick(event.content.srcEvent, event.content.srcEvent.target);
    }
    else {
      // Some browsers have showPicker method for inputs, some don't and so I show picker by simulating click on input
      setTimeout(() => {
        if (this.supportControl.textObj.showPicker)
          this.supportControl.textObj.showPicker();
        else
          this.supportControl.textObj.click();
      }, 0);
    }
  }
};


/**
 * Check if this is a combo control
 */
Client.IdfControl.prototype.isCombo = function ()
{
  return this.getType() === Client.IdfField.controlTypes.COMBO;
};


/**
 * Check if combo is open
 */
Client.IdfControl.prototype.isComboOpen = function ()
{
  return this.control.isOpen();
};


/**
 * Cancel combo opening
 */
Client.IdfControl.prototype.cancelComboOpening = function ()
{
  this.control?.cancelOpening();
};


/**
 * Check if this is a text EDIT control
 */
Client.IdfControl.prototype.isTextEdit = function ()
{
  return this.getType() === Client.IdfField.controlTypes.EDIT && ((Client.IdfField.isText(this.dataType) && !this.isPassword) || this.isRowQbe);
};


/**
 * Invoke custom methods
 */
Client.IdfControl.prototype.invokeCustomMethods = function ()
{
  if (this.customElement?.methodInvocations) {
    this.customElement.methodInvocations?.forEach(mi => this.control[mi.method].apply(this.control, mi.args));
    delete this.customElement.methodInvocations;
  }
};


/**
 * Return true if given event represents a click on my activator
 * @param {Object} event
 */
Client.IdfControl.prototype.isActivatorClick = function (event)
{
  if (this.activator)
    return Client.Utils.isMyParent(event.content?.srcEvent?.srcElement, this.activator.id);
};


/**
 * Return true if this is a multi rows control
 * @param {Boolean} recalculate
 */
Client.IdfControl.prototype.isMultiRows = function (recalculate)
{
  // If there is a valid multiRows and I don't have to recalculate it, get it
  if (!recalculate && this.currentMultiRows !== undefined)
    return this.currentMultiRows;
  //
  return (this.numRows > 1 || this.heightResize) && !this.useHtml && !this.isInQbe && (this.isTextEdit() || this.isCombo());
};


/**
 * Give focus to the element
 * @param {Object} event
 */
Client.IdfControl.prototype.handleFocus = function (event)
{
  switch (event.id) {
    case "onFocusin":
      if (this.isActivatorClick(event)) {
        if (!this.isCombo())
          this.focus();
      }
      else if (this.isPassword) {
        // On focus in, empty password if value has no other charachters than "*"
        let emptyValue = true;
        for (let i = 0; i < this.value.length; i++) {
          if (this.value[i] !== "*") {
            emptyValue = false;
            break;
          }
        }
        //
        if (emptyValue)
          this.control.updateElement({value: ""});
      }
      break;

    case "onFocusout":
      // If the tooltip timer is set we can cancel it, the search will be done
      if (this.qbeRowTooltip) {
        clearTimeout(this.qbeRowTooltip);
        delete this.qbeRowTooltip;
      }
      // Remove lastSelection when my parentWidhget loose focus
      if (Client.Utils.findElementFromDomObj(event.content.srcEvent.relatedTarget)?.parentWidget !== this.parentWidget)
        delete this.lastSelection;
      //
      if (this.isPassword && !this.control.value.length)
        this.control.updateElement({value: this.value});
      //
      if (this.isTextEdit() && !this.useInput && this.contentEditable)
        return this.prepareChangeEvent();
  }
};


/**
 * Give focus to the element
 * @param {Object} options
 */
Client.IdfControl.prototype.focus = function (options)
{
  options = options || {};
  if (options.selectAll) {
    options.selectionStart = 0;
    options.selectionEnd = 9999;
  }
  //
  // If my parentWidget had focus restore my last selection
  if (Client.Utils.findElementFromDomObj(document.activeElement)?.parentWidget !== this) {
    if (options.selectionStart === undefined && this.lastSelection) {
      options.selectionStart = this.lastSelection.start;
      options.selectionEnd = this.lastSelection.end;
    }
  }
  //
  // If no particular cursor position was requested for the string fields I put it at the bottom
  if (options.selectionStart === undefined && this.isTextEdit() && this.control.getRootObject().value !== Client.Element.fakeEmptyValue) {
    options.selectionStart = 9999;
    options.selectionEnd = 9999;
  }
  //
  // If the control is disabled I ignore any selection
  if (!this.isEnabled())
    options.selectionEnd = options.selectionStart;
  //
  if (Client.Utils.findElementFromDomObj(document.activeElement) !== this.control)
    this.control?.focus(options);
};


/**
 * Check if I'm draggable
 * @param {Client.Element} element
 */
Client.IdfControl.prototype.isDraggable = function (element)
{
  let pfield = this.parentWidget instanceof Client.IdfFieldValue ? this.parentWidget?.parent : null;
  if (Client.mainFrame?.isEditing())
    return this.parentWidget instanceof Client.IdfFieldValue && pfield.parent?.layout === Client.IdfPanel.layouts.form;
  //
  // Accept a generic drop only if i'm a panel control AND the panel has the 'candrop' flag enabled
  return this.parentWidget instanceof Client.IdfFieldValue && (this.parentIdfFrame.canDrag || Client.mainFrame?.isEditing()) && !this.isEnabled();
};


/**
 * Check if I can be resized in width
 * @param {Client.Element} element
 */
Client.IdfControl.prototype.canResizeW = function (element)
{
  // Only for IDCLOUD editing
  return Client.mainFrame?.isEditing() && this.parentWidget instanceof Client.IdfFieldValue && this !== this.parentWidget.listControl;
};


/**
 * Check if I can be resized in height
 * @param {Client.Element} element
 */
Client.IdfControl.prototype.canResizeH = function (element)
{
  // Only for IDCLOUD editing
  return Client.mainFrame?.isEditing() && this.parentWidget instanceof Client.IdfFieldValue && this !== this.parentWidget.listControl;
};


/**
 * Apply d&d cursor
 * @param {String} cursor
 */
Client.IdfControl.prototype.applyDragDropCursor = function (cursor)
{
  // Only for IDCloud Edit mode
  let obj = this.getRootObject();
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


/**
 * Check if I can accept drop
 * @param {Client.Widget} widget
 * @param {HTMLElement} targetDomElement
 */
Client.IdfControl.prototype.acceptsDrop = function (widget, targetDomElement)
{
  // Accept a generic drop only if i'm a panel control AND the panel has the 'candrop' flag enabled
  return this.parentWidget instanceof Client.IdfFieldValue && (this.parentIdfFrame.canDrop || Client.mainFrame?.isEditing());
};


/**
 * Handle drop
 * @param {Client.Widget} dragWidget
 * @param {HTMLElement} droppedElement
 * @param {Integer} x
 * @param {Integer} y
 * @param {Object} ev
 * @param {Object} options
 */
Client.IdfControl.prototype.handleDrop = function (dragWidget, droppedElement, x, y, ev, options)
{
  if (Client.mainFrame?.isEditing() && (dragWidget instanceof Client.IdfControl || dragWidget instanceof Client.IdfField || dragWidget instanceof Client.IdfGroup)) {
    let draggedField = dragWidget instanceof Client.IdfControl ? dragWidget.parentWidget?.parent : dragWidget;
    let droppedField = this.parentWidget?.parent;
    //
    // The grid is dragged by an IDFControl of a ListList field (when the panel layout is in list)
    if (draggedField.parent === droppedField.parent)
      droppedField.parent.handleEditOperation(Client.IdfPanel.editOperations.drag, [draggedField], droppedField, {x, y, deltaX: options.deltaX, deltaY: options.deltaY}, ev);
  }
  else if (Client.mainFrame.isIDF && this.parentWidget?.parent?.parent.canDrop) // If foundation let the system handle the generic drag
    return true;
};


/**
 * Returns the dom object to clone
 * @param {int} operation
 * @param {Client.Element} element - element touched/clicked/mousemoved
 * @returns {DomNode}
 */
Client.IdfControl.prototype.getTransformOperationTargetObj = function (operation, element)
{
  if (Client.mainFrame?.isEditing()) {
    let myField = this.parentWidget?.parent;
    let myPanel = myField?.parent;
    //
    // Operation on a outList IdfControl : the dom clone must be the header+control area
    if (operation === Client.Widget.transformOperation.DRAG && myPanel && myField && myPanel?.layout === Client.IdfPanel.layouts.list && myField.inList)
      return Client.eleMap[myPanel.gridColConf.id].getRootObject();
    if (operation === Client.Widget.transformOperation.DRAG && myField && myPanel?.layout === Client.IdfPanel.layouts.list && !myField.inList)
      return Client.eleMap[myField.outListContainerId].getRootObject();
    if (operation === Client.Widget.transformOperation.DRAG && myField && myPanel?.layout === Client.IdfPanel.layouts.form)
      return Client.eleMap[myField.formContainerId].getRootObject();
    //
    if (myField.formHeaderAbove && (operation === Client.Widget.transformOperation.RESIZETOP || operation === Client.Widget.transformOperation.RESIZETOPLEFT || operation === Client.Widget.transformOperation.RESIZETOPRIGHT))
      return this.getRootObject();
    if (!myField.formHeaderAbove && (operation === Client.Widget.transformOperation.RESIZELEFT || operation === Client.Widget.transformOperation.RESIZETOPLEFT || operation === Client.Widget.transformOperation.RESIZEBOTTOMLEFT))
      return this.getRootObject();
    //
    // Otherwise we resize the col (only in form we need this)
    return Client.eleMap[myField.formContainerId].getRootObject().parentNode;
  }
  //
  return this.getRootObject();
};


/**
 * Handle edit operation on transform
 * @param {Object} options
 */
Client.IdfControl.prototype.onTransform = function (options)
{
  if (!Client.mainFrame?.isEditing())
    return;
  //
  let myField = this.parentWidget?.parent;
  let myPanel = myField?.parent;
  myPanel.handleEditOperation(Client.IdfPanel.editOperations.resize, [myField], this, options);
};


/**
 * Get grid unit
 * @param {Boolean} vertical
 */
Client.IdfControl.prototype.getGritUnit = function (vertical)
{
  if (Client.mainFrame?.isEditing()) {
    let myField = this.parentWidget?.parent;
    let myPanel = myField?.parent;
    if (!vertical && ((myPanel?.layout === Client.IdfPanel.layouts.list && myField.listWidthPerc) || (myPanel?.layout === Client.IdfPanel.layouts.form && myField.formWidthPerc)))
      return (Client.eleMap[myPanel.mainContainerConf.id].getRootObject().clientWidth / 100);
    if (vertical && ((myPanel?.layout === Client.IdfPanel.layouts.list && myField.listHeightPerc) || (myPanel?.layout === Client.IdfPanel.layouts.form && myField.formHeightPerc)))
      return (Client.eleMap[myPanel.mainContainerConf.id].getRootObject().clientHeight / 100);
  }
  //
  return 4;
};


/**
 * Get resize tooltip
 * @param {Integer} width
 * @param {Integer} height
 */
Client.IdfControl.prototype.getResizeTooltip = function (width, height)
{
  let myField = this.parentWidget?.parent;
  return myField.getResizeTooltip(width, height);
};


/**
 * Clear resize tooltip
 */
Client.IdfControl.prototype.clearResizeTooltip = function ()
{
  this.parentWidget?.parent?.clearResizeTooltip();
};


/**
 * Check if I can accept drop
 * @param {Object} event
 */
Client.IdfControl.prototype.canAcceptDrop = function (event)
{
  if (this.multiUpload || (this.dataType === Client.IdfField.dataTypes.BLOB && this.uploadBlobEnabled))
    return event.dataTransfer.items[0].kind === "file";
  else if (this.isTextEdit() && this.isEnabled())
    return event.dataTransfer.items[0].kind === "string";
};


/**
 * Prepare change event to send value onKeyPress for editable span
 */
Client.IdfControl.prototype.prepareChangeEvent = function ()
{
  if (!this.isEnabled())
    return;
  //
  return {
    id: "chgProp",
    obj: this.id,
    immediate: true,
    content: {
      name: "value",
      value: this.getValueToSend()
    }
  };
};


/**
 * Check if I'm list owner
 */
Client.IdfControl.prototype.isListOwner = function ()
{
  if (this.valueList?.isStatic)
    return true;
  //
  if (Client.mainFrame.isIDF)
    return !this.isSmartLookup() && !this.isNoAutoLookup();
};


/**
 * Check if I'm a smart lookup
 */
Client.IdfControl.prototype.isSmartLookup = function ()
{
  return this.comboType === Client.IdfField.comboTypes.SMARTLOOKUP;
};


/**
 * Check if I'm an auto lookup
 */
Client.IdfControl.prototype.isAutoLookup = function ()
{
  return this.comboType === Client.IdfField.comboTypes.AUTOLOOKUP;
};


/**
 * Check if I'm a no-auto lookup
 */
Client.IdfControl.prototype.isNoAutoLookup = function ()
{
  return this.comboType === Client.IdfField.comboTypes.NOAUTOLOOKUP;
};


/**
 * Check if I'm clickable
 */
Client.IdfControl.prototype.isClickable = function ()
{
  return this.clickable && !this.forceEditType;
};


/**
 * Check if I'm enabled
 */
Client.IdfControl.prototype.isEnabled = function ()
{
  // A forced EDIT having BUTTON as original type is never enabled
  if (this.forceEditType && this.type === Client.IdfField.controlTypes.BUTTON && !this.isInQbe)
    return false;
  //
  return this.enabled;
};
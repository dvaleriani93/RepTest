/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A list of visual styles
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfVisualStyleList = function (widget, parent, view)
{
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfVisualStyleList extend Client.Widget
Client.IdfVisualStyleList.prototype = new Client.Widget();


/**
 * Realize widget UI
 * @param {Object} widget
 * @param {View|Element|Widget} parent
 * @param {View} view
 */
Client.IdfVisualStyleList.prototype.realize = function (widget, parent, view)
{
  Client.IdfVisualStyle.rules = [];
  //
  // Create children visual styles
  this.createChildren(widget);
  //
  Client.IdfVisualStyleList.createBookBoxRule();
  //
  Client.IdfVisualStyle.styleSheet = document.createElement("style");
  Client.IdfVisualStyle.styleSheet.type = "text/css";
  Client.IdfVisualStyle.styleSheet.id = "visual-styles";
  Client.IdfVisualStyle.styleSheet.textContent = Client.IdfVisualStyle.generateStyleSheet();
  document.head.appendChild(Client.IdfVisualStyle.styleSheet);
};


/**
 * Create special rule to apply to book boxes in order to turn off
 * the margin-top set by rowOffset property of list visual style
 */
Client.IdfVisualStyleList.createBookBoxRule = function ()
{
  // Book boxes use the list field visual style and thus they inherit visual style rowOffset property too.
  // Since I don't want book boxes to have a rowOffset (i.e. margin-top), create a fixed rule in order to turn off margin top on book boxes
  //
  // Turn off margin top
  let newRule = {name: ".vis-bookBox", value: {"margin-top": "0"}};
  Client.IdfVisualStyle.rules.push(newRule);
};


/**
 * @class A visual style object that defines a set of css classes
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfVisualStyle = function (widget, parent, view)
{
  Client.IdfVisualStyle.list = Client.IdfVisualStyle.list || [];
  //
  // Set visual style index
  this.index = Client.mainFrame.isIDF ? parseInt(widget.id.split(":")[1]) : Client.IdfVisualStyle.list.length + 1;
  //
  // Add visual style to visual styles map
  Client.IdfVisualStyle.list[this.index] = this;
  //
  Client.Widget.call(this, widget, parent, view);
};


// Make Client.IdfVisualStyle extend Client.Widget
Client.IdfVisualStyle.prototype = new Client.Widget();


Client.IdfVisualStyle.transPropMap = {
  der: "baseVisualStyle",
  //
  // COLORS
  col1: "fieldTextColor", col2: "fieldHeaderTextColor", col3: "groupTextColor", col4: "fieldBack", col5: "altFieldBack", col6: "panelBack",
  col7: "fieldHeaderBack", col8: "groupBack", col9: "activeRowBack", col10: "editingFieldBack", col11: "fieldBorderColor", col12: "formGroupBack",
  col13: "formGroupTextColor", col14: "qbeFieldBack", col15: "readOnlyFieldBack", col16: "activeRowReadOnlyFieldBack", col17: "formFieldHeaderBack",
  col18: "altReadOnlyFieldBack", col19: "notNullFieldHeaderTextColor", col20: "errorFieldTextColor", col21: "warningFieldTextColor", col22: "errorFieldBack", col23: "warningFieldBack",
  //
  // GRADIENTS COLORS
  gco4: "fieldBackGradient", gco5: "altFieldBackGradient", gco6: "panelBackGradient", gco7: "fieldHeaderBackGradient", gco8: "groupBackGradient",
  gco9: "activeRowBackGradient", gco10: "editingFieldBackGradient", gco11: "fieldBorderGradient", gco12: "formGroupBackGradient", gco14: "qbeFieldBackGradient",
  gco15: "readOnlyFieldBackGradient", gco16: "activeRowReadOnlyFieldBackGradient", gco17: "formFieldHeaderBackGradient", gco18: "altReadOnlyFieldBackGradient",
  gco22: "errorFieldBackGradient", gco23: "warningFieldBackGradient",
  //
  // GRADIENTS DIRECTIONS
  gdi4: "fieldBackGradientDir", gdi5: "altFieldBackGradientDir", gdi6: "panelBackGradientDir", gdi7: "fieldHeaderBackGradientDir", gdi8: "groupBackGradientDir",
  gdi9: "activeRowBackGradientDir", gdi10: "editingFieldBackGradientDir", gdi11: "fieldBorderGradientDir", gdi12: "formGroupBackGradientDir", gdi14: "qbeFieldBackGradientDir",
  gdi15: "readOnlyFieldBackGradientDir", gdi16: "activeRowReadOnlyFieldBackGradientDir", gdi17: "formFieldHeaderBackGradientDir", gdi18: "altReadOnlyFieldBackGradientDir",
  gdi22: "errorFieldBackGradientDir", gdi23: "warningFieldBackGradientDir",
  //
  // OPACITIES
  opa4: "fieldBackOpacity", opa5: "altFieldBackOpacity", opa6: "panelBackOpacity", opa7: "fieldHeaderBackOpacity", opa8: "groupBackOpacity",
  opa9: "activeRowBackOpacity", opa10: "editingFieldBackOpacity", opa11: "fieldBorderOpacity", opa12: "formGroupBackOpacity", opa14: "qbeFieldBackOpacity",
  opa15: "readOnlyFieldBackOpacity", opa16: "activeRowReadOnlyFieldBackOpacity", opa17: "formFieldHeaderBackOpacity", opa18: "altReadOnlyFieldBackOpacity",
  opa22: "errorFieldBackOpacity", opa23: "warningFieldBackOpacity",
  //
  // ALIGNMENT
  ali1: "fieldAlignment", ali2: "fieldHeaderAlignment", ali3: "formFieldHeaderAlignment",
  //
  // FONTS
  fon1: "fieldFont", fon2: "fieldHeaderFont", fon3: "groupFont", fon4: "errorFieldFont", fon5: "warningFieldFont", fon6: "notNullFieldHeaderFont",
  fonFam1: "fieldFontFamily", fonFam2: "fieldHeaderFontFamily", fonFam3: "groupFontFamily", fonFam4: "errorFieldFontFamily", fonFam5: "warningFieldFontFamily", fonFam6: "notNullFieldHeaderFontFamily",
  fonSize1: "fieldFontSize", fonSize2: "fieldHeaderFontSize", fonSize3: "groupFontSize", fonSize4: "errorFieldFontSize", fonSize5: "warningFieldFontSize", fonSize6: "notNullFieldHeaderFontSize",
  fonSty1: "fieldFontStyle", fonSty2: "fieldHeaderFontStyle", fonSty3: "groupFontStyle", fonSty4: "errorFieldFontStyle", fonSty5: "warningFieldFontStyle", fonSty6: "notNullFieldHeaderFontStyle",
  //
  // BORDERS
  bor1: "fieldBorderType", bor2: "fieldHeaderBorderType", bor3: "groupBorderType", bor4: "formFieldHeaderBorderType", bor5: "formGroupBorderType", bor6: "formFieldBorderType",
  //
  // CUSTOM BORDERS
  ccl1: "customBorderTopColor", ccl2: "customBorderRightColor", ccl3: "customBorderBottomColor", ccl4: "customBorderLeftColor",
  cwd1: "customBorderTopWidth", cwd2: "customBorderRightWidth", cwd3: "customBorderBottomWidth", cwd4: "customBorderLeftWidth",
  cty1: "customBorderTopStyle", cty2: "customBorderRightStyle", cty3: "customBorderBottomStyle", cty4: "customBorderLeftStyle",
  cpd1: "customBorderTopPadding", cpd2: "customBorderRightPadding", cpd3: "customBorderBottomPadding", cpd4: "customBorderLeftPadding",
  //
  msk: "mask", con: "controlType", cur: "cursor", off: "rowOffset", hof: "headerOffset", les: "letterSpacing", wos: "wordSpacing", clh: "classNameHeader", fla: "flags"
};


Client.IdfVisualStyle.selectors = {panel: "panel", listField: "listField", listFieldInput: "listField input", formField: "formField", formFieldInput: "formField input",
  readOnlyField: "readOnlyField", activeRowField: "activeRowField", activeRowReadOnlyField: "activeRowReadOnlyField", altField: "altField", altReadOnlyField: "altReadOnlyField",
  altActiveRowField: "altActiveRowField", altActiveRowReadOnlyField: "altActiveRowReadOnlyField", editingField: "editingField", listFieldHeader: "listFieldHeader",
  formFieldHeader: "formFieldHeader", notNullFieldHeader: "notNullFieldHeader", qbeField: "qbeField", errorField: "errorField", warningField: "warningField",
  listGroup: "listGroup", formGroup: "formGroup"};


Client.IdfVisualStyle.selectorsSchema = new Map();
Client.IdfVisualStyle.selectorsSchema.set("panel", [Client.IdfVisualStyle.transPropMap.col6]);
//
Client.IdfVisualStyle.selectorsSchema.set("listField", [Client.IdfVisualStyle.transPropMap.col1, Client.IdfVisualStyle.transPropMap.col4, Client.IdfVisualStyle.transPropMap.col11,
  Client.IdfVisualStyle.transPropMap.ali1,
  Client.IdfVisualStyle.transPropMap.fon1, Client.IdfVisualStyle.transPropMap.fonFam1, Client.IdfVisualStyle.transPropMap.fonSize1, Client.IdfVisualStyle.transPropMap.fonSty1,
  Client.IdfVisualStyle.transPropMap.bor1,
  Client.IdfVisualStyle.transPropMap.msk, Client.IdfVisualStyle.transPropMap.cur, Client.IdfVisualStyle.transPropMap.off,
  Client.IdfVisualStyle.transPropMap.les, Client.IdfVisualStyle.transPropMap.wos]);
//
Client.IdfVisualStyle.selectorsSchema.set("listField input", [Client.IdfVisualStyle.transPropMap.ali1, Client.IdfVisualStyle.transPropMap.les, Client.IdfVisualStyle.transPropMap.wos]);
//
Client.IdfVisualStyle.selectorsSchema.set("formField", [Client.IdfVisualStyle.transPropMap.col1, Client.IdfVisualStyle.transPropMap.col4, Client.IdfVisualStyle.transPropMap.col11,
  Client.IdfVisualStyle.transPropMap.ali1,
  Client.IdfVisualStyle.transPropMap.fon1, Client.IdfVisualStyle.transPropMap.fonFam1, Client.IdfVisualStyle.transPropMap.fonSize1, Client.IdfVisualStyle.transPropMap.fonSty1,
  Client.IdfVisualStyle.transPropMap.bor6,
  Client.IdfVisualStyle.transPropMap.msk, Client.IdfVisualStyle.transPropMap.cur,
  Client.IdfVisualStyle.transPropMap.les, Client.IdfVisualStyle.transPropMap.wos]);
//
Client.IdfVisualStyle.selectorsSchema.set("formField input", [Client.IdfVisualStyle.transPropMap.ali1, Client.IdfVisualStyle.transPropMap.les, Client.IdfVisualStyle.transPropMap.wos]);
//
Client.IdfVisualStyle.selectorsSchema.set("readOnlyField", [Client.IdfVisualStyle.transPropMap.col15]);
//
Client.IdfVisualStyle.selectorsSchema.set("altField", [Client.IdfVisualStyle.transPropMap.col5]);
//
Client.IdfVisualStyle.selectorsSchema.set("altReadOnlyField", [Client.IdfVisualStyle.transPropMap.col18]);
//
Client.IdfVisualStyle.selectorsSchema.set("activeRowField", [Client.IdfVisualStyle.transPropMap.col9]);
//
Client.IdfVisualStyle.selectorsSchema.set("activeRowReadOnlyField", [Client.IdfVisualStyle.transPropMap.col16]);
//
Client.IdfVisualStyle.selectorsSchema.set("altActiveRowField", [Client.IdfVisualStyle.transPropMap.col5, Client.IdfVisualStyle.transPropMap.col9]);
//
Client.IdfVisualStyle.selectorsSchema.set("altActiveRowReadOnlyField", [Client.IdfVisualStyle.transPropMap.col5, Client.IdfVisualStyle.transPropMap.col16]);
//
Client.IdfVisualStyle.selectorsSchema.set("editingField", [Client.IdfVisualStyle.transPropMap.col10]);
//
Client.IdfVisualStyle.selectorsSchema.set("listFieldHeader", [Client.IdfVisualStyle.transPropMap.col2, Client.IdfVisualStyle.transPropMap.col7,
  Client.IdfVisualStyle.transPropMap.ali2,
  Client.IdfVisualStyle.transPropMap.fon2, Client.IdfVisualStyle.transPropMap.fonFam2, Client.IdfVisualStyle.transPropMap.fonSize2, Client.IdfVisualStyle.transPropMap.fonSty2,
  Client.IdfVisualStyle.transPropMap.bor2,
  Client.IdfVisualStyle.transPropMap.hof,
  Client.IdfVisualStyle.transPropMap.cur,
  Client.IdfVisualStyle.transPropMap.les, Client.IdfVisualStyle.transPropMap.wos]);
//
Client.IdfVisualStyle.selectorsSchema.set("formFieldHeader", [Client.IdfVisualStyle.transPropMap.col17,
  Client.IdfVisualStyle.transPropMap.ali3,
  Client.IdfVisualStyle.transPropMap.fon2, Client.IdfVisualStyle.transPropMap.fonFam2, Client.IdfVisualStyle.transPropMap.fonSize2, Client.IdfVisualStyle.transPropMap.fonSty2,
  Client.IdfVisualStyle.transPropMap.bor4,
  Client.IdfVisualStyle.transPropMap.cur,
  Client.IdfVisualStyle.transPropMap.les, Client.IdfVisualStyle.transPropMap.wos]);
//
Client.IdfVisualStyle.selectorsSchema.set("notNullFieldHeader", [Client.IdfVisualStyle.transPropMap.col19
          /*,Client.IdfVisualStyle.transPropMap.fon6, Client.IdfVisualStyle.transPropMap.fonFam6, Client.IdfVisualStyle.transPropMap.fonSize6, Client.IdfVisualStyle.transPropMap.fonSty6*/]);
//
Client.IdfVisualStyle.selectorsSchema.set("qbeField", [Client.IdfVisualStyle.transPropMap.col14]);
//
Client.IdfVisualStyle.selectorsSchema.set("errorField", [Client.IdfVisualStyle.transPropMap.col20, Client.IdfVisualStyle.transPropMap.col22,
  Client.IdfVisualStyle.transPropMap.fon4, Client.IdfVisualStyle.transPropMap.fonFam4, Client.IdfVisualStyle.transPropMap.fonSize4, Client.IdfVisualStyle.transPropMap.fonSty4]);
//
Client.IdfVisualStyle.selectorsSchema.set("warningField", [Client.IdfVisualStyle.transPropMap.col21, Client.IdfVisualStyle.transPropMap.col23,
  Client.IdfVisualStyle.transPropMap.fon5, Client.IdfVisualStyle.transPropMap.fonFam5, Client.IdfVisualStyle.transPropMap.fonSize5, Client.IdfVisualStyle.transPropMap.fonSty5]);
//
Client.IdfVisualStyle.selectorsSchema.set("listGroup", [Client.IdfVisualStyle.transPropMap.col3, Client.IdfVisualStyle.transPropMap.col8,
  Client.IdfVisualStyle.transPropMap.fon3, Client.IdfVisualStyle.transPropMap.fonFam3, Client.IdfVisualStyle.transPropMap.fonSize3, Client.IdfVisualStyle.transPropMap.fonSty3,
  Client.IdfVisualStyle.transPropMap.bor3]);
//
Client.IdfVisualStyle.selectorsSchema.set("formGroup", [Client.IdfVisualStyle.transPropMap.col12, Client.IdfVisualStyle.transPropMap.col13,
  Client.IdfVisualStyle.transPropMap.fon3, Client.IdfVisualStyle.transPropMap.fonFam3, Client.IdfVisualStyle.transPropMap.fonSize3, Client.IdfVisualStyle.transPropMap.fonSty3,
  Client.IdfVisualStyle.transPropMap.bor5]);


Client.IdfVisualStyle.alignments = {AUTO: 1, LEFT: 2, CENTER: 3, RIGHT: 4, JUSTIFY: 5, UNSET: 6};
Client.IdfVisualStyle.gradientDirections = {NONE: 1, HORIZONTAL: 2, VERTICAL: 3};
Client.IdfVisualStyle.borderTypes = {NONE: 1, HORIZONTAL: 2, VERTICAL: 3, FRAME: 4, SUNKEN: 5, RAISED: 6, ETCHED: 7, BUMP: 8, CUSTOM: 9};
Client.IdfVisualStyle.customBorderStyles = {SOLID: 1, DOTTED: 2, DASHED: 3, DOUBLE: 4};


/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfVisualStyle.convertPropValues = function (props)
{
  props = props || {};
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfVisualStyle.transPropMap.ali1:
      case Client.IdfVisualStyle.transPropMap.ali2:
      case Client.IdfVisualStyle.transPropMap.ali3:
      //
      case Client.IdfVisualStyle.transPropMap.gdi4:
      case Client.IdfVisualStyle.transPropMap.gdi5:
      case Client.IdfVisualStyle.transPropMap.gdi6:
      case Client.IdfVisualStyle.transPropMap.gdi7:
      case Client.IdfVisualStyle.transPropMap.gdi8:
      case Client.IdfVisualStyle.transPropMap.gdi9:
      case Client.IdfVisualStyle.transPropMap.gdi10:
      case Client.IdfVisualStyle.transPropMap.gdi11:
      case Client.IdfVisualStyle.transPropMap.gdi12:
      case Client.IdfVisualStyle.transPropMap.gdi14:
      case Client.IdfVisualStyle.transPropMap.gdi15:
      case Client.IdfVisualStyle.transPropMap.gdi16:
      case Client.IdfVisualStyle.transPropMap.gdi17:
      case Client.IdfVisualStyle.transPropMap.gdi18:
      case Client.IdfVisualStyle.transPropMap.gdi22:
      case Client.IdfVisualStyle.transPropMap.gdi23:
      //
      case Client.IdfVisualStyle.transPropMap.opa4:
      case Client.IdfVisualStyle.transPropMap.opa5:
      case Client.IdfVisualStyle.transPropMap.opa6:
      case Client.IdfVisualStyle.transPropMap.opa7:
      case Client.IdfVisualStyle.transPropMap.opa8:
      case Client.IdfVisualStyle.transPropMap.opa9:
      case Client.IdfVisualStyle.transPropMap.opa10:
      case Client.IdfVisualStyle.transPropMap.opa11:
      case Client.IdfVisualStyle.transPropMap.opa12:
      case Client.IdfVisualStyle.transPropMap.opa14:
      case Client.IdfVisualStyle.transPropMap.opa15:
      case Client.IdfVisualStyle.transPropMap.opa16:
      case Client.IdfVisualStyle.transPropMap.opa17:
      case Client.IdfVisualStyle.transPropMap.opa18:
      case Client.IdfVisualStyle.transPropMap.opa22:
      case Client.IdfVisualStyle.transPropMap.opa23:
      //
      case Client.IdfVisualStyle.transPropMap.bor1:
      case Client.IdfVisualStyle.transPropMap.bor2:
      case Client.IdfVisualStyle.transPropMap.bor3:
      case Client.IdfVisualStyle.transPropMap.bor4:
      case Client.IdfVisualStyle.transPropMap.bor5:
      case Client.IdfVisualStyle.transPropMap.bor6:
      //
      case Client.IdfVisualStyle.transPropMap.cwd1:
      case Client.IdfVisualStyle.transPropMap.cwd2:
      case Client.IdfVisualStyle.transPropMap.cwd3:
      case Client.IdfVisualStyle.transPropMap.cwd4:
      case Client.IdfVisualStyle.transPropMap.cty1:
      case Client.IdfVisualStyle.transPropMap.cty2:
      case Client.IdfVisualStyle.transPropMap.cty3:
      case Client.IdfVisualStyle.transPropMap.cty4:
      case Client.IdfVisualStyle.transPropMap.cpd1:
      case Client.IdfVisualStyle.transPropMap.cpd2:
      case Client.IdfVisualStyle.transPropMap.cpd3:
      case Client.IdfVisualStyle.transPropMap.cpd4:
      //
      case Client.IdfVisualStyle.transPropMap.off:
      case Client.IdfVisualStyle.transPropMap.hof:
      case Client.IdfVisualStyle.transPropMap.les:
      case Client.IdfVisualStyle.transPropMap.wos:
      case Client.IdfVisualStyle.transPropMap.fla:
      case Client.IdfVisualStyle.transPropMap.con:
      case Client.IdfVisualStyle.transPropMap.der:
        props[p] = parseInt(props[p]);
        break;
    }
  }
};


/**
 * Update element properties
 * @param {Object} props
 */
Client.IdfVisualStyle.prototype.updateElement = function (props)
{
  let flagsChanged = false;
  let updateCss;
  //
  props = props || {};
  //
  Client.Widget.prototype.updateElement.call(this, props);
  //
  // Get selectors names
  let selectors = Client.IdfVisualStyle.selectorsSchema.keys();
  let nextSelector = selectors.next().value;
  //
  // If base visual style has changed update all selectors rule
  if (props.baseVisualStyle !== undefined) {
    this.baseVisualStyle = props.baseVisualStyle;
    updateCss = true;
    //
    while (nextSelector) {
      this.updateCssRule(nextSelector);
      nextSelector = selectors.next().value;
    }
    //
    delete props.baseVisualStyle;
  }
  //
  if (props.classNameHeader !== undefined) {
    this.classNameHeader = props.classNameHeader;
    //
    delete props.classNameHeader;
  }
  //
  if (props.className !== undefined) {
    this.className = props.className;
    //
    delete props.className;
  }
  //
  // "flags" property exists just on IDF. Thus, transform variation on flags into variations on each single property
  if (props.flags !== undefined) {
    props.isPassword = (props.flags & 0x10000) !== 0;
    props.isHyperLink = (props.flags & 0x200000) !== 0;
    props.showImage = (props.flags & 0x80000) !== 0;
    props.showDescription = (props.flags & 0x40000) !== 0;
    props.showValue = (props.flags & 0x20000) !== 0;
    //
    delete props.flags;
  }
  //
  if (props.isPassword !== undefined) {
    this.isPassword = props.isPassword;
    delete props.isPassword;
    //
    flagsChanged = true;
  }
  //
  if (props.isHyperLink !== undefined) {
    this.isHyperLink = props.isHyperLink;
    delete props.isHyperLink;
    //
    flagsChanged = true;
  }
  //
  if (props.showImage !== undefined) {
    this.showImage = props.showImage;
    delete props.showImage;
    //
    flagsChanged = true;
  }
  //
  if (props.showDescription !== undefined) {
    this.showDescription = props.showDescription;
    delete props.showDescription;
    //
    flagsChanged = true;
  }
  //
  if (props.showValue !== undefined) {
    this.showValue = props.showValue;
    delete props.showValue;
    //
    flagsChanged = true;
  }
  //
  // Handle changes on all style properties (colours, backgrounds, fonts, ecc.)
  let changedPropsNames = Object.keys(props);
  let shortNames = Object.keys(Client.IdfVisualStyle.transPropMap);
  let longNames = Object.values(Client.IdfVisualStyle.transPropMap);
  for (let i = 0; i < changedPropsNames.length; i++) {
    let changedProp = changedPropsNames[i];
    //
    // I want to handle just properties in transPropMap.
    if (longNames.indexOf(changedProp) === -1)
      continue;
    //
    // If current property has not a valid value, continue
    if (props[changedProp] === undefined)
      continue;
    //
    // Update property
    this[changedProp] = props[changedProp];
    //
    // Some visual style properties are dependecies of other properties.
    // For example, gradient, gradient direction and opacity are color dependencies.
    // Since these properties are handled by main property, they are not listed into selector schemas. (just the main one is)
    // Thus, if one of these dependencies changes, I have to find the main property
    for (let j = 0; j < shortNames.length; j++) {
      if (changedProp === Client.IdfVisualStyle.transPropMap[shortNames[i]]) {
        let shortName;
        //
        // If changed property is a gradient or an opacity, get its short name and replace it with color short name.
        // Otherwise if changed property is a custom border, get its short name and replace it with border short name.
        // So "gco[n] / gdi[n] / opa[n]" will become "col[n]" and "ccl[n] / cwd[n] / cty[n] / cpd[n]" will become "bor[n]"
        if (changedProp.indexOf("Gradient") !== -1 || changedProp.indexOf("Opacity") !== -1) {
          shortName = shortNames[i].replace("gco", "col");
          shortName = shortNames[i].replace("gdi", "col");
          shortName = shortNames[i].replace("opa", "col");
        }
        else if (changedProp.indexOf("CustomBorder") !== -1) {
          shortName = shortNames[i].replace("ccl", "bor");
          shortName = shortNames[i].replace("cwd", "bor");
          shortName = shortNames[i].replace("cty", "bor");
          shortName = shortNames[i].replace("cpd", "bor");
        }
        //
        // Get property name related to short name
        if (shortName) {
          changedProp = Client.IdfVisualStyle.transPropMap[shortName];
          break;
        }
      }
    }
    //
    // Look into selector schemas. If a selector schema contains changed property, update its css rule
    let selectors = Client.IdfVisualStyle.selectorsSchema.keys();
    let nextSelector = selectors.next().value;
    while (nextSelector) {
      let selectorSchema = Client.IdfVisualStyle.selectorsSchema.get(nextSelector);
      if (selectorSchema.includes(changedProp)) {
        updateCss = true;
        this.updateCssRule(nextSelector);
      }
      //
      nextSelector = selectors.next().value;
    }
  }
  //
  if (updateCss && !this.realizing)
    Client.IdfVisualStyle.styleSheet.textContent = Client.IdfVisualStyle.generateStyleSheet();
  //
  // If some flag has changed, tell widgets to apply their visual style
  if (flagsChanged) {
    let elIds = Object.keys(Client.eleMap);
    for (let i = 0; i < elIds.length; i++) {
      let el = Client.eleMap[elIds[i]];
      if (el.applyVisualStyle)
        el.applyVisualStyle();
    }
  }
};


/**
 * Get index-th visual style
 * @param {Integer} index
 */
Client.IdfVisualStyle.getByIndex = function (index)
{
  return Client.IdfVisualStyle.list?.[index];
};


/**
 * Update a css rule using schema related to given selector
 * @param {String} selectorName
 */
Client.IdfVisualStyle.prototype.updateCssRule = function (selectorName)
{
  // Create rule name
  let ruleName = ".vis" + this.index + "-" + selectorName;
  let ruleStyle = {};
  //
  // Get schema related to given selector
  let schema = Client.IdfVisualStyle.selectorsSchema.get(selectorName);
  for (let i = 0; i < schema.length; i++) {
    // Get i-th schema property name
    let prop = schema[i];
    //
    // Get property value recursively
    let propValue = this.getPropertyValue(prop);
    //
    // If no property value, continue
    if (propValue === undefined)
      continue;
    //
    // Get style associated with current property
    let style = this.getPropStyle(prop, propValue, selectorName);
    //
    let cssProps = Object.keys(style);
    for (let j = 0; j < cssProps.length; j++) {
      let cssProp = cssProps[j];
      let cssValue = style[cssProp];
      if (cssValue === undefined)
        continue;
      //
      // Set css property
      ruleStyle[cssProp] = cssValue;
    }
  }
  //
  // Get rule by name
  let ruleIndex = Client.IdfVisualStyle.getCssRuleIndex(ruleName);
  let rule = Client.IdfVisualStyle.rules[ruleIndex];
  let isEmptyRule = Object.keys(ruleStyle).length === 0;
  //
  if (!rule && !isEmptyRule)
    Client.IdfVisualStyle.rules.push({name: ruleName, value: ruleStyle});
  else if (rule && isEmptyRule)
    Client.IdfVisualStyle.rules.splice(ruleIndex, 1);
  else if (rule && !isEmptyRule)
    rule.value = ruleStyle;
};


/**
 * Get css rule by selector
 * @param {String} selector
 */
Client.IdfVisualStyle.getCssRuleIndex = function (selector)
{
  // If no selector, do nothing
  if (!selector)
    return;
  //
  // Get css rule having given selector as name
  return Client.IdfVisualStyle.rules.findIndex(r => r.name.toLowerCase() === selector.toLowerCase());
};


/**
 * Get css classes by selector
 * @param {String} selector
 */
Client.IdfVisualStyle.prototype.getCssClassesBySelector = function (selector)
{
  let className = "";
  //
  // If no selector, do nothing
  if (!selector)
    return className;
  //
  // Add also my "selector class" to className
  className += "vis" + this.index + "-" + selector;
  //
  return className;
};


/**
 * Get css classes based on options
 * @param {Object} options - objType
 *                         - list
 *                         - alternate
 *                         - readOnly
 *                         - notNull
 *                         - activeRow
 *                         - qbe
 *                         - error
 *                         - warning
 */
Client.IdfVisualStyle.prototype.getCssClasses = function (options)
{
  options = options || {};
  let classes = "";
  let skipClassName;
  //
  if (options.objType === "panel")
    classes = this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.panel);
  else if (options.objType === "fieldHeader") {
    if (options.list)
      classes = this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.listFieldHeader);
    else
      classes = this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.formFieldHeader);
    //
    if (options.notNull)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.notNullFieldHeader);
    //
    // If there is a class header, add it
    let classHeader = this.getPropertyValue(Client.IdfVisualStyle.transPropMap.clh);
    if (classHeader) {
      skipClassName = true;
      classes += " " + classHeader;
    }
  }
  else if (options.objType === "field") {
    if (options.list)
      classes = this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.listField);
    else
      classes = this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.formField);
    //
    if (options.alternate && options.readOnly && options.activeRow)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.altActiveRowReadOnlyField);
    else if (options.alternate && options.readOnly)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.altReadOnlyField);
    else if (options.alternate && options.activeRow)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.altActiveRowField);
    else if (options.readOnly && options.activeRow)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.activeRowReadOnlyField);
    else if (options.alternate)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.altField);
    else if (options.readOnly)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.readOnlyField);
    else if (options.activeRow)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.activeRowField);
    //
    if (options.qbe)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.qbeField);
    if (options.error)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.errorField);
    if (options.warning)
      classes += " " + this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.warningField);
    //
    // If field visual style has to be applied to a book box, add also vis-bookBox class
    if (options.bookBox)
      classes += " vis-bookBox";
  }
  else if (options.objType === "group") {
    if (options.list)
      classes = this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.listGroup);
    else
      classes = this.getCssClassesBySelector(Client.IdfVisualStyle.selectors.formGroup);
  }
  //
  // If there is a class name, add it (the cln property is defined in the main widget map)
  let className = this.getPropertyValue(Client.Widget.transPropMap.cln);
  if (className && !skipClassName)
    classes += " " + className;
  //
  return classes;
};


/**
 * Get property value recursively
 * @param {String} propName
 */
Client.IdfVisualStyle.prototype.getPropertyValue = function (propName)
{
  // If no property name, do nothing
  if (!propName)
    return;
  //
  // If current visual style has a value for given property name, return it
  if (this[propName] !== undefined)
    return this[propName];
  //
  // Recursively get property value from base visual style
  if (this.baseVisualStyle) {
    let baseVis = Client.IdfVisualStyle.getByIndex(this.baseVisualStyle);
    return baseVis.getPropertyValue(propName);
  }
};


/**
 * Get text align value
 * @param {Integer} value
 */
Client.IdfVisualStyle.getTextAlign = function (value)
{
  let alignment = "";
  switch (value) {
    case Client.IdfVisualStyle.alignments.LEFT:
      alignment = "left";
      break;

    case Client.IdfVisualStyle.alignments.CENTER:
      alignment = "center";
      break;

    case Client.IdfVisualStyle.alignments.RIGHT:
      alignment = "right";
      break;

    case Client.IdfVisualStyle.alignments.JUSTIFY:
      alignment = "justify";
      break;
  }
  //
  return alignment;
};


/**
 * Get font properties
 * @param {String} value
 * @param {Boolean} onlyStyle
 */
Client.IdfVisualStyle.getFont = function (value, onlyStyle)
{
  let font = {};
  //
  value = value || "";
  //
  let fontFamily = "";
  let fontSize = "";
  let fontStyle = "";
  let fontWeight = "";
  let textDecoration = "";
  //
  let fontParts = value.split(",");
  if (!onlyStyle) {
    fontFamily = fontParts[0];
    fontSize = fontParts[2];
  }
  //
  let styleString = onlyStyle ? value : fontParts[1];
  if (styleString) {
    if (styleString.indexOf("B") !== -1)
      fontWeight = "bold";
    //
    if (styleString.indexOf("I") !== -1)
      fontStyle = "italic";
    //
    if (styleString.indexOf("U") !== -1)
      textDecoration += "underline ";
    //
    if (styleString.indexOf("S") !== -1)
      textDecoration += "line-through";
  }
  //
  let isVela = Client.mainFrame.idfTheme === "vela";
  if (isVela && fontFamily === "Arial")
    fontFamily = "Inter";
  if (isVela && fontWeight === "" && !onlyStyle)
    fontWeight = "400";
  //
  font.family = fontFamily;
  font.size = fontSize;
  font.style = fontStyle;
  font.weight = fontWeight;
  font.decoration = textDecoration;
  //
  return font;
};


/**
 * Get custom border style
 * @param {Integer} value
 */
Client.IdfVisualStyle.prototype.getCustomBorderStyle = function (value)
{
  let borderStyle;
  switch (value) {
    case Client.IdfVisualStyle.customBorderStyles.SOLID:
      borderStyle = "solid";
      break;

    case Client.IdfVisualStyle.customBorderStyles.DOTTED:
      borderStyle = "dotted";
      break;

    case Client.IdfVisualStyle.customBorderStyles.DASHED:
      borderStyle = "dashed";
      break;

    case Client.IdfVisualStyle.customBorderStyles.DOUBLE:
      borderStyle = "double";
      break;

    default:
      borderStyle = "solid";
      break;
  }
  //
  return borderStyle;
};


/**
 * Get border properties
 * @param {String} value
 * @param {String} selectorName
 */
Client.IdfVisualStyle.prototype.getBorder = function (value, selectorName)
{
  let border = {};
  //
  // Set border color
  border.color = this.getPropertyValue(Client.IdfVisualStyle.transPropMap.col11);
  //
  switch (value) {
    case Client.IdfVisualStyle.borderTypes.HORIZONTAL:
      let noTopBorder = [Client.IdfVisualStyle.selectors.listField, Client.IdfVisualStyle.selectors.formField, Client.IdfVisualStyle.selectors.formFieldHeader];
      let top = noTopBorder.includes(selectorName) ? "0px" : "1px";
      //
      // Form groups have no bottom border
      let bottom = (selectorName === Client.IdfVisualStyle.selectors.formGroup) ? "0px" : "1px";
      //
      border.multiWidth = top + " 0px " + bottom + " 0px";
      border.style = "solid";
      break;

    case Client.IdfVisualStyle.borderTypes.VERTICAL:
      // Form groups have no right border
      let right = (selectorName === Client.IdfVisualStyle.selectors.formGroup) ? "0px" : "1px";
      //
      border.multiWidth = "0px " + right + " 0px 1px";
      border.style = "solid";
      break;

    case Client.IdfVisualStyle.borderTypes.FRAME:
      border.width = 1;
      border.style = "solid";
      break;

    case Client.IdfVisualStyle.borderTypes.SUNKEN:
      border.width = 2;
      border.style = "inset";
      break;

    case Client.IdfVisualStyle.borderTypes.RAISED:
      border.width = 2;
      border.style = "outset";
      break;

    case Client.IdfVisualStyle.borderTypes.ETCHED:
      border.width = 2;
      border.style = "groove";
      break;

    case Client.IdfVisualStyle.borderTypes.BUMP:
      border.width = 2;
      border.style = "ridge";
      break;

    case Client.IdfVisualStyle.borderTypes.CUSTOM:
      border.custom = {};
      let directions = ["top", "right", "bottom", "left"];
      //
      for (let i = 0; i < directions.length; i++) {
        let customPadding;
        let customWidth;
        let customStyle;
        let dir = directions[i];
        //
        // Set custom border for current direction
        border.custom[dir] = border.custom[dir] || {};
        //
        // Set custom color
        border.custom[dir].color = this.getPropertyValue(Client.IdfVisualStyle.transPropMap["ccl" + (i + 1)]) || border.color;
        //
        // Get custom style
        customStyle = this.getPropertyValue(Client.IdfVisualStyle.transPropMap["cty" + (i + 1)]);
        //
        // Transform it into css value and set it
        border.custom[dir].style = this.getCustomBorderStyle(customStyle);
        //
        // Get custom width and custom padding
        customWidth = this.getPropertyValue(Client.IdfVisualStyle.transPropMap["cwd" + (i + 1)]);
        customWidth = customWidth === undefined ? 1 : customWidth;
        customPadding = this.getPropertyValue(Client.IdfVisualStyle.transPropMap["cpd" + (i + 1)]) || 0;
        //
        // In case of Foundation, I have to do some calculations
        if (Client.mainFrame.isIDF) {
          customWidth = customWidth / 4;
          customWidth = ((customWidth < 0.25 && customWidth > 0) ? 0.25 : customWidth);
          //
          customPadding = customPadding / 4;
        }
        //
        // Finally set custom width and custom padding
        border.custom[dir].width = customWidth;
        border.custom[dir].padding = customPadding;
      }
      break;

    default:
      border.style = "none";
      border.width = 0;
      break;
  }
  //
  return border;
};


/**
 * Translate given value into a set of css properties
 * @param {String} propName
 * @param {String} propValue
 * @param {String} selectorName
 */
Client.IdfVisualStyle.prototype.getPropStyle = function (propName, propValue, selectorName)
{
  let style = {};
  //
  switch (propName) {
    // Text colors
    case Client.IdfVisualStyle.transPropMap.col1:
    case Client.IdfVisualStyle.transPropMap.col2:
    case Client.IdfVisualStyle.transPropMap.col3:
    case Client.IdfVisualStyle.transPropMap.col13:
    case Client.IdfVisualStyle.transPropMap.col19:
    case Client.IdfVisualStyle.transPropMap.col20:
    case Client.IdfVisualStyle.transPropMap.col21:
      // Handle transparent color:
      // - in case of not null field header get field header color;
      // - in case of error or warning field get normal field color
      if (propValue === "transparent") {
        if (selectorName === Client.IdfVisualStyle.selectors.notNullFieldHeader)
          propValue = this.getPropertyValue(Client.IdfVisualStyle.transPropMap.col2);
        else if (selectorName === Client.IdfVisualStyle.selectors.errorField || selectorName === Client.IdfVisualStyle.selectors.warningField)
          propValue = this.getPropertyValue(Client.IdfVisualStyle.transPropMap.col1);
      }
      //
      style.color = propValue;
      break;

      // Background colors
    case Client.IdfVisualStyle.transPropMap.col4:
    case Client.IdfVisualStyle.transPropMap.col5:
    case Client.IdfVisualStyle.transPropMap.col6:
    case Client.IdfVisualStyle.transPropMap.col7:
    case Client.IdfVisualStyle.transPropMap.col8:
    case Client.IdfVisualStyle.transPropMap.col9:
    case Client.IdfVisualStyle.transPropMap.col10:
    case Client.IdfVisualStyle.transPropMap.col12:
    case Client.IdfVisualStyle.transPropMap.col14:
    case Client.IdfVisualStyle.transPropMap.col15:
    case Client.IdfVisualStyle.transPropMap.col16:
    case Client.IdfVisualStyle.transPropMap.col17:
    case Client.IdfVisualStyle.transPropMap.col18:
    case Client.IdfVisualStyle.transPropMap.col22:
    case Client.IdfVisualStyle.transPropMap.col23:
      // If background-color is "transparent", in some cases I have to fallback to another color
      if (propValue === "transparent") {
        // If I'm getting style for an alternate field, get normal field background color
        if (selectorName === Client.IdfVisualStyle.selectors.altField)
          propName = Client.IdfVisualStyle.transPropMap.col4;
        else if (selectorName === Client.IdfVisualStyle.selectors.altReadOnlyField) // If I'm getting style for a readonly alternate field, get normal readonly field background color
          propName = Client.IdfVisualStyle.transPropMap.col15;
        else if (selectorName === Client.IdfVisualStyle.selectors.listFieldHeader) // If I'm getting style for a list field header, get panel background color
          propName = Client.IdfVisualStyle.transPropMap.col6;
        //
        propValue = this.getPropertyValue(propName);
      }
      //
      // Get gradient color, gradient direction and opacity values
      let gradientColor;
      let gradientDirection;
      let opacity;
      for (let i = 1; i <= 23; i++) {
        if (Client.IdfVisualStyle.transPropMap["col" + i] === propName) {
          gradientColor = this.getPropertyValue(Client.IdfVisualStyle.transPropMap["gco" + i]);
          gradientDirection = this.getPropertyValue(Client.IdfVisualStyle.transPropMap["gdi" + i]);
          opacity = this.getPropertyValue(Client.IdfVisualStyle.transPropMap["opa" + i]);
          //
          break;
        }
      }
      //
      // If there is a gradient color, set it as background image
      if (gradientColor && propValue !== "transparent") {
        if (gradientDirection === Client.IdfVisualStyle.gradientDirections.HORIZONTAL)
          propValue = "linear-gradient(90deg," + propValue + "," + gradientColor + ")";
        else if (gradientDirection === Client.IdfVisualStyle.gradientDirections.VERTICAL)
          propValue = "linear-gradient(180deg," + propValue + "," + gradientColor + ")";
        //
        style["background-image"] = propValue;
        style["background-color"] = "none";
      }
      else { // Otherwise set background color
        style["background-color"] = propValue;
        style["background-image"] = "none";
      }
      //
      // If there is an opacity value, set it
      if (opacity !== undefined)
        style.opacity = opacity / 100;
      //
      break;

    case Client.IdfVisualStyle.transPropMap.col11:
      style["border-color"] = propValue;
      break;

    case Client.IdfVisualStyle.transPropMap.ali1:
    case Client.IdfVisualStyle.transPropMap.ali2:
    case Client.IdfVisualStyle.transPropMap.ali3:
      let textAlign = Client.IdfVisualStyle.getTextAlign(propValue);
      if (textAlign) {
        style["text-align"] = textAlign;
        style["justify-content"] = textAlign;
      }
      break;

    case Client.IdfVisualStyle.transPropMap.fon1:
    case Client.IdfVisualStyle.transPropMap.fon2:
    case Client.IdfVisualStyle.transPropMap.fon3:
    case Client.IdfVisualStyle.transPropMap.fon4:
    case Client.IdfVisualStyle.transPropMap.fon5:
    case Client.IdfVisualStyle.transPropMap.fon6:
    case Client.IdfVisualStyle.transPropMap.fonSty1:
    case Client.IdfVisualStyle.transPropMap.fonSty2:
    case Client.IdfVisualStyle.transPropMap.fonSty3:
    case Client.IdfVisualStyle.transPropMap.fonSty4:
    case Client.IdfVisualStyle.transPropMap.fonSty5:
    case Client.IdfVisualStyle.transPropMap.fonSty6:
      let onlyStyle = propName.indexOf("FontStyle") !== -1;
      let font = Client.IdfVisualStyle.getFont(propValue, onlyStyle);
      //
      // For Vela "normal" is 400, but not on headers, in that case normal is 500!
      let isVela = Client.mainFrame.idfTheme === "vela";
      if (isVela && propName === Client.IdfVisualStyle.transPropMap.fon2 && font.weight === "400")
        font.weight = "500";
      //
      if (font.family)
        style["font-family"] = font.family;
      if (font.size)
        style["font-size"] = font.size + "pt";
      //
      style["font-style"] = font.style || "normal";
      style["font-weight"] = font.weight || "normal";
      style["text-decoration"] = font.decoration || "none";
      break;

    case Client.IdfVisualStyle.transPropMap.fonFam1:
    case Client.IdfVisualStyle.transPropMap.fonFam2:
    case Client.IdfVisualStyle.transPropMap.fonFam3:
    case Client.IdfVisualStyle.transPropMap.fonFam4:
    case Client.IdfVisualStyle.transPropMap.fonFam5:
    case Client.IdfVisualStyle.transPropMap.fonFam6:
      style["font-family"] = propValue;
      break;

    case Client.IdfVisualStyle.transPropMap.fonSize1:
    case Client.IdfVisualStyle.transPropMap.fonSize2:
    case Client.IdfVisualStyle.transPropMap.fonSize3:
    case Client.IdfVisualStyle.transPropMap.fonSize4:
    case Client.IdfVisualStyle.transPropMap.fonSize5:
    case Client.IdfVisualStyle.transPropMap.fonSize6:
      style["font-size"] = propValue + "pt";
      break;

    case Client.IdfVisualStyle.transPropMap.bor1:
    case Client.IdfVisualStyle.transPropMap.bor2:
    case Client.IdfVisualStyle.transPropMap.bor3:
    case Client.IdfVisualStyle.transPropMap.bor4:
    case Client.IdfVisualStyle.transPropMap.bor5:
    case Client.IdfVisualStyle.transPropMap.bor6:
      let border = this.getBorder(propValue, selectorName);
      //
      if (border.custom) {
        // Set border and padding top
        style["border-top"] = border.custom.top.width + "pt " + border.custom.top.style + " " + border.custom.top.color;
        style["padding-top"] = border.custom.top.padding + "pt !important";
        //
        // Set border and padding right
        style["border-right"] = border.custom.right.width + "pt " + border.custom.right.style + " " + border.custom.right.color;
        style["padding-right"] = border.custom.right.padding + "pt !important";
        //
        // Set border and padding bottom
        style["border-bottom"] = border.custom.bottom.width + "pt " + border.custom.bottom.style + " " + border.custom.bottom.color;
        style["padding-bottom"] = border.custom.bottom.padding + "pt !important";
        //
        // Set border and padding left
        style["border-left"] = border.custom.left.width + "pt " + border.custom.left.style + " " + border.custom.left.color;
        style["padding-left"] = border.custom.left.padding + "pt !important";
      }
      else {
        // If border has a multi width (ex. 1px 0px 2px 0px), I have to set width, style and color separately
        if (border.multiWidth) {
          style["border-width"] = border.multiWidth;
          style["border-style"] = border.style;
          style["border-color"] = border.color;
        }
        else // Otherwise set the whole border
          style.border = border.width + "px " + border.style + " " + border.color;
      }
      break;

    case Client.IdfVisualStyle.transPropMap.msk:
      break;

    case Client.IdfVisualStyle.transPropMap.cur:
      if (propValue)
        style.cursor = propValue;
      break;

    case Client.IdfVisualStyle.transPropMap.off:
      style["margin-top"] = propValue + "px";
      break;

    case Client.IdfVisualStyle.transPropMap.hof:
      style["margin-bottom"] = propValue + "px";
      break;

    case Client.IdfVisualStyle.transPropMap.les:
      style["letter-spacing"] = (propValue / 100) + "pt";
      break;

    case Client.IdfVisualStyle.transPropMap.wos:
      style["word-spacing"] = (propValue / 100) + "pt";
      break;
  }
  //
  return style;
};


/**
 * Get header offset
 */
Client.IdfVisualStyle.prototype.getHeaderOffset = function ()
{
  return this.getPropertyValue(Client.IdfVisualStyle.transPropMap.hof);
};


/**
 * Get field alignment
 * @param {String} objType - listHeader or formHeader
 */
Client.IdfVisualStyle.prototype.getAlignment = function (objType)
{
  let prop = Client.IdfVisualStyle.transPropMap.ali1;
  //
  if (objType === "listHeader")
    prop = Client.IdfVisualStyle.transPropMap.ali2;
  else if (objType === "formHeader")
    prop = Client.IdfVisualStyle.transPropMap.ali3;
  //
  return this.getPropertyValue(prop);
};


/**
 * Get row offset
 */
Client.IdfVisualStyle.prototype.getRowOffset = function ()
{
  return this.getPropertyValue(Client.IdfVisualStyle.transPropMap.off);
};


/**
 * Get control type
 */
Client.IdfVisualStyle.prototype.getControlType = function ()
{
  let controlType = this.getPropertyValue(Client.IdfVisualStyle.transPropMap.con);
  return controlType || Client.IdfField.controlTypes.EDIT;
};


/**
 * Get mask
 */
Client.IdfVisualStyle.prototype.getMask = function ()
{
  return this.getPropertyValue(Client.IdfVisualStyle.transPropMap.msk);
};


/**
 * Get value of isPassword flag
 */
Client.IdfVisualStyle.prototype.getPasswordFlag = function ()
{
  return this.getPropertyValue("isPassword");
};


/**
 * Get value of isHyperLink flag
 */
Client.IdfVisualStyle.prototype.getHyperLinkFlag = function ()
{
  return this.getPropertyValue("isHyperLink");
};


/**
 * Get value of showImage flag
 */
Client.IdfVisualStyle.prototype.getShowImageFlag = function ()
{
  return this.getPropertyValue("showImage");
};


/**
 * Get value of showDescription flag
 */
Client.IdfVisualStyle.prototype.getShowDescriptionFlag = function ()
{
  return this.getPropertyValue("showDescription");
};


/**
 * Get value of showValue flag
 */
Client.IdfVisualStyle.prototype.getShowValueFlag = function ()
{
  return this.getPropertyValue("showValue");
};


/**
 * Generate style sheet
 */
Client.IdfVisualStyle.generateStyleSheet = function ()
{
  let styleString = "";
  //
  Client.IdfVisualStyle.rules.forEach(r => {
    styleString += " " + r.name + " {";
    styleString += Object.entries(r.value).map(([n, v]) => v !== undefined ? `${n}: ${v};` : "").join(' ');
    styleString += "}";
  });
  //
  return styleString;
}

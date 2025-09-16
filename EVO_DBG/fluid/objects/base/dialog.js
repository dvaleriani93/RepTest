/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class A popup container
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the dialog
 * @extends Client.Container
 */
Client.Dialog = function (element, parent, view)
{
  Client.Container.call(this, element, parent, view);
  //
  if (element === undefined)
    return;
  //
  this.opt = element.options || {};
  //
  // Create a background div
  this.backgroundDiv = document.createElement("div");
  this.backgroundDiv.className = "dialog-ext" + (this.opt.modal ? "-modal" : "") + (this.opt.extcls ? " " + this.opt.extcls : "");
  this.domObj.className = "dialog-int";
  this.domObj.tabIndex = 0;
  this.wrapperObj = this.domObj;
  //
  // Append the popup to the background div
  this.backgroundDiv.appendChild(this.domObj);
  //
  // Append the background div as sibling of the view
  view.domObj.appendChild(this.backgroundDiv);
  //
  // If the popup has to close when clicking outside it
  if (this.opt?.autoclose) {
    // Define the function to close the dialog
    this.autoclose = true;
    this.autoCloseFunct = ev => this.autoClose(ev, this);
    //
    // If the dialog is modal the event listener will be added to the dialog-ext div
    if (this.opt.modal) {
      this.backgroundDiv.addEventListener("mousedown", this.autoCloseFunct);
      this.backgroundDiv.addEventListener("touchend", this.autoCloseFunct);
    }
    else {
      // If the dialog is not modal the event listener will be added to the appui
      view.domObj.addEventListener("mousedown", this.autoCloseFunct);
      view.domObj.addEventListener("touchend", this.autoCloseFunct);
    }
  }
};


// Make Client.Dialog extend Client.Container
Client.Dialog.prototype = new Client.Container();


/**
 * Close the popup
 */
Client.Dialog.prototype.close = function ()
{
  Client.Container.prototype.close.call(this);
  //
  this.backgroundDiv.remove();
  //
  // Delete any view element if this element is the container of the modal view
  if (this.view?.dialog === this) {
    delete this.view.dialog;
    this.view.close();
  }
};


/**
 * Position the popup on the screen
 */
Client.Dialog.prototype.positionElement = function ()
{
  if (this.opt) {
    if (this.opt.position) {
      // If opt.position is a string, eg. "top", "bottomleft", "right"
      if (typeof this.opt.position === "string") {
        var coord = this.calculatePopupAbsoluteCoord(this.opt.position);
        if (coord.top)
          this.wrapperObj.style.marginTop = coord.top;
        if (coord.right)
          this.wrapperObj.style.marginRight = coord.right;
        if (coord.bottom)
          this.wrapperObj.style.marginBottom = coord.bottom;
        if (coord.left)
          this.wrapperObj.style.marginLeft = coord.left;
      }
      else {
        var coord = this.opt.position;
        if (coord.top)
          this.wrapperObj.style.top = coord.top;
        if (coord.right)
          this.wrapperObj.style.right = coord.right;
        if (coord.bottom)
          this.wrapperObj.style.bottom = coord.bottom;
        if (coord.left)
          this.wrapperObj.style.left = coord.left;
        //
        // Change from flex positioning to absolute
        this.wrapperObj.style.position = "absolute";
      }
    }
    //
    // Set close timeout
    if (this.opt.timeout) {
      var pthis = this;
      window.setTimeout(function () {
        pthis.close();
      }, this.opt.timeout);
    }
    //
    // If there is a reference element, move the popup
    if (this.opt.ref) {
      // Get the reference element
      var refEl = Client.eleMap[this.opt.ref.id];
      if (refEl) {
        // Get the popup style
        var style = window.getComputedStyle(this.wrapperObj);
        //
        // Calculate whisker size
        var extWhiskerSize = 0;
        var intWhiskerSize = 0;
        var whiskerDiff = 0.5;
        //
        if (this.opt.ref.whisker) {
          // If I have to draw a whisker, get its size from options
          if (this.opt.ref.whiskerSize)
            extWhiskerSize = this.opt.ref.whiskerSize;
          else  // If there isn't a whisker size assign a default size
            extWhiskerSize = 9;
          intWhiskerSize = extWhiskerSize - whiskerDiff;
        }
        //
        // Find the position of the reference element taking into account the scrollbars
        var refAbsPos = Client.Utils.findElemPos(refEl.domObj, null, true);
        //
        // Find the position of the reference element ignoring scrollbars
        var refRelPos = Client.Utils.findElemPos(refEl.domObj);
        //
        // Get the position of the popup relative to the reference element (top, left, bottom or right)
        var side = this.opt.ref.position;
        //
        // If the side was not specified, the popup will be positioned under the reference element
        if (!side)
          side = "bottom";
        //
        // Calculate the popup position
        var popupCoord = this.calculatePopupRelativeCoord(side, refAbsPos, refRelPos, extWhiskerSize, this.opt.ref.offset);
        if (popupCoord) {
          // Adjust the position based on the parent position
          var top = popupCoord.top;
          var left = popupCoord.left;
          //
          // Change from flex positioning to absolute
          this.wrapperObj.style.position = "absolute";
          this.wrapperObj.style.top = top + "px";
          this.wrapperObj.style.left = left + "px";
          //
          this.opt.ref.whiskerPosition = popupCoord.wSide;
          //
          // If I have to draw a whisker
          if (this.opt.ref.whisker) {
            // Create the external whisker div
            this.createWhisker(style, popupCoord, refAbsPos, extWhiskerSize, intWhiskerSize, whiskerDiff);
          }
        }
        else {
          // Cannot position element relative to reference object
          delete this.opt.ref;
        }
      }
    }
  }
};


/**
 * Close the popup if mouse clicked outside it
 * @param {MouseEvent} ev - the event occured when the user clicked
 * @param {Dialog} pthis - the dialog that has to be closed
 */
Client.Dialog.prototype.autoClose = function (ev, pthis)
{
  // If the clicked element is not one of my children close the popup
  let clickedEl = ev.target;
  let parent = clickedEl.parentNode;
  while (parent) {
    if (parent === this.wrapperObj)
      return;
    parent = parent.parentNode;
  }
  //
  // Remove the listener from the appui
  let appui = document.getElementById("app-ui");
  appui.removeEventListener("mousedown", pthis.autoCloseFunct);
  //
  let e = [({obj: pthis.view ? pthis.view.id : pthis.id, id: "close", content: {}})];
  Client.mainFrame.sendEvents(e);
};


/**
 * Calculate popup absolute position
 * @param {String} position - the string representing a position, eg. "top", "bottomleft", "right"
 * @returns {Object}
 */
Client.Dialog.prototype.calculatePopupAbsoluteCoord = function (position)
{
  var coord = {};
  if (position.indexOf("top") > -1)
    coord.top = "0px";
  if (position.indexOf("right") > -1)
    coord.right = "0px";
  if (position.indexOf("bottom") > -1)
    coord.bottom = "0px";
  if (position.indexOf("left") > -1)
    coord.left = "0px";
  //
  return coord;
};


/**
 * Calculate popup position relative to the position of another element
 * @param {String} side - popup positioning side relative to the reference object
 * @param {Object} refAbsPos - reference object absolute coordinates
 * @param {Object} refRelPos - reference object relative coordinates
 * @param {Float} extWhiskerSize - whisker size
 * @param {Float} offset - popup distance from reference element
 * @returns {Object}
 */
Client.Dialog.prototype.calculatePopupRelativeCoord = function (side, refAbsPos, refRelPos, extWhiskerSize, offset)
{
  // Get the popup position
  var myAbsPos = Client.Utils.findElemPos(this.wrapperObj);
  //
  side = side || "";
  var placement = side.split("-");
  side = placement[0];
  //
  var modifier = placement[1];
  //
  // Calculate the new popup position
  var coord;
  if (side === "top")
    coord = this.popupTop(refAbsPos, refRelPos, myAbsPos, extWhiskerSize, offset, true, modifier);
  else if (side === "right")
    coord = this.popupRight(refAbsPos, refRelPos, myAbsPos, extWhiskerSize, offset, true, modifier);
  else if (side === "bottom")
    coord = this.popupBottom(refAbsPos, refRelPos, myAbsPos, extWhiskerSize, offset, true, modifier);
  else if (side === "left")
    coord = this.popupLeft(refAbsPos, refRelPos, myAbsPos, extWhiskerSize, offset, true, modifier);
  return coord;
};


/**
 * Calculate popup top position
 * @param {Object} refAbsPos - reference object absolute coordinates
 * @param {Object} refRelPos - reference object relative coordinates
 * @param {Object} myPos - popup coordinates
 * @param {Float} extWhiskerSize - whisker size
 * @param {Float} offset - popup distance from reference element
 * @param {Boolean} tryAgain - if true and the popup doesn't fit in the given side, try to move it to another side
 * @param {String} modifier - "left", "right" or undefined
 * @returns {Object}
 */
Client.Dialog.prototype.popupTop = function (refAbsPos, refRelPos, myPos, extWhiskerSize, offset, tryAgain, modifier)
{
  // Calculate the app-ui width
  var appui = document.getElementById("app-ui");
  var appuiPos = appui.getBoundingClientRect();
  var appuiWidth = appuiPos.right - appuiPos.left;
  //
  var refPosWidth = refAbsPos.right - refAbsPos.left;
  var myPosHeight = myPos.bottom - myPos.top;
  var myPosWidth = myPos.right - myPos.left;
  //
  // Calculate the top position taking into account the offset
  var newTop = refAbsPos.top - myPosHeight - extWhiskerSize;
  if (offset)
    newTop = newTop - offset;
  //
  // If I can't put the popup above the reference object
  if (newTop < 0) {
    var coord;
    //
    // If I can, I try to put the popup below the reference object
    if (tryAgain)
      coord = this.popupBottom(refAbsPos, refRelPos, myPos, extWhiskerSize, offset, false);
    //
    // Return popup position or undefined if I can't put the popup anywhere
    return coord;
  }
  //
  // Calculate the left position
  var newLeft;
  if (modifier === "left")
    newLeft = refAbsPos.left;
  else if (modifier === "right")
    newLeft = refAbsPos.right - myPosWidth;
  else
    newLeft = refAbsPos.left + ((refPosWidth - myPosWidth) / 2);
  //
  // If popup is wider than appui, let it fills all screen
  if (myPosWidth > appuiWidth)
    return;
  else if (newLeft < 0) // If it's too left align with the window margin
    newLeft = 0;
  else if (newLeft + myPosWidth > appuiWidth) {
    // If it's too right move to the left
    newLeft = refAbsPos.left + refPosWidth - myPosWidth;
  }
  //
  return {top: newTop, left: newLeft, wSide: "bottom"};
};


/**
 * Calculate popup left position
 * @param {Object} refAbsPos - reference object absolute coordinates
 * @param {Object} refRelPos - reference object relative coordinates
 * @param {Object} myPos - popup coordinates
 * @param {Float} extWhiskerSize - whisker size
 * @param {Float} offset - popup distance from reference element
 * @param {Boolean} tryAgain - if true and the popup doesn't fit in the given side, try to move it to another side
 * @param {String} modifier - "left", "right" or undefined
 * @returns {Object}
 */
Client.Dialog.prototype.popupLeft = function (refAbsPos, refRelPos, myPos, extWhiskerSize, offset, tryAgain, modifier)
{
  // Calculate the app-ui width
  var appui = document.getElementById("app-ui");
  var appuiPos = appui.getBoundingClientRect();
  var appuiHeight = appuiPos.bottom - appuiPos.top;
  //
  var refPosHeight = refAbsPos.bottom - refAbsPos.top;
  var myPosHeight = myPos.bottom - myPos.top;
  var myPosWidth = myPos.right - myPos.left;
  //
  // Calculate the left position taking into account the offset
  var newLeft = refAbsPos.left - myPosWidth - extWhiskerSize;
  if (offset)
    newLeft = newLeft - offset;
  //
  // If I can't put the popup on the left of the reference object
  if (newLeft < 0) {
    var coord;
    //
    // If I can, I try to put the popup on the right of the reference object
    if (tryAgain)
      coord = this.popupRight(refAbsPos, refRelPos, myPos, extWhiskerSize, offset, false);
    //
    // Return popup position or undefined if I can't put the popup anywhere
    return coord;
  }
  //
  // Calculate the top position
  var newTop;
  if (modifier === "top")
    newTop = refAbsPos.top;
  else if (modifier === "bottom")
    newTop = refAbsPos.bottom - myPosHeight;
  else
    newTop = refAbsPos.top - ((myPosHeight - refPosHeight) / 2);
  //
  // If popup is higher then appui, let it fills all screen
  if (myPosHeight > appuiHeight)
    return;
  else if (newTop < 0) // If it's too high align with the reference object
    newTop = refAbsPos.top;
  else if (newTop + myPosHeight > appuiHeight) {
    // If it's too low move it higher
    newTop = refAbsPos.top + refPosHeight - myPosHeight;
  }
  //
  return {top: newTop, left: newLeft, wSide: "right"};
};


/**
 * Calculate popup bottom position
 * @param {Object} refAbsPos - reference object absolute coordinates
 * @param {Object} refRelPos - reference object relative coordinates
 * @param {Object} myPos - popup coordinates
 * @param {Float} extWhiskerSize - whisker size
 * @param {Float} offset - popup distance from reference element
 * @param {Boolean} tryAgain - if true and the popup doesn't fit in the given side, try to move it to another side
 * @param {String} modifier - "left", "right" or undefined
 * @returns {Object}
 */
Client.Dialog.prototype.popupBottom = function (refAbsPos, refRelPos, myPos, extWhiskerSize, offset, tryAgain, modifier)
{
  // Calculate the app-ui width
  var appui = document.getElementById("app-ui");
  var appuiPos = appui.getBoundingClientRect();
  var appuiWidth = appuiPos.right - appuiPos.left;
  //
  var refPosHeight = refAbsPos.bottom - refAbsPos.top;
  var refPosWidth = refAbsPos.right - refAbsPos.left;
  var myPosWidth = myPos.right - myPos.left;
  //
  // Calculate the top position taking into account the offset
  var newTop = refAbsPos.top + refPosHeight + extWhiskerSize;
  if (offset)
    newTop = newTop + offset;
  //
  // If I can't put the popup below the reference object
  var absTop = refRelPos.top + refPosHeight + extWhiskerSize;
  if (absTop + this.wrapperObj.offsetHeight > window.innerHeight) {
    var coord;
    //
    // If I can, I try to put the popup above the reference element
    if (tryAgain)
      coord = this.popupTop(refAbsPos, refRelPos, myPos, extWhiskerSize, offset, false);
    //
    // Return popup position or undefined if I can't put the popup anywhere
    return coord;
  }
  //
  // Calculate the left position
  var newLeft;
  if (modifier === "left")
    newLeft = refAbsPos.left;
  else if (modifier === "right")
    newLeft = refAbsPos.right - myPosWidth;
  else
    newLeft = refAbsPos.left + ((refPosWidth - myPosWidth) / 2);
  //
  // If popup is wider then appui, let it fills all screen
  if (myPosWidth > appuiWidth)
    return;
  else if (newLeft < 0) // If it's too left align with the window margin
    newLeft = 0;
  else if (newLeft + myPosWidth > appuiWidth) {
    // If it's too right move to the left
    newLeft = refAbsPos.left + refPosWidth - myPosWidth;
  }
  //
  return {top: newTop, left: newLeft, wSide: "top"};
};


/**
 * Calculate popup right position
 * @param {Object} refAbsPos - reference object absolute coordinates
 * @param {Object} refRelPos - reference object relative coordinates
 * @param {Object} myPos - popup coordinates
 * @param {Float} extWhiskerSize - whisker size
 * @param {Float} offset - popup distance from reference element
 * @param {Boolean} tryAgain - if true and the popup doesn't fit in the given side, try to move it to another side
 * @param {String} modifier - "left", "right" or undefined
 * @returns {Object}
 */
Client.Dialog.prototype.popupRight = function (refAbsPos, refRelPos, myPos, extWhiskerSize, offset, tryAgain, modifier)
{
  // Calculate the app-ui width
  var appui = document.getElementById("app-ui");
  var appuiPos = appui.getBoundingClientRect();
  var appuiWidth = appuiPos.right - appuiPos.left;
  var appuiHeight = appuiPos.bottom - appuiPos.top;
  //
  var refPosHeight = refAbsPos.bottom - refAbsPos.top;
  var refPosWidth = refAbsPos.right - refAbsPos.left;
  var myPosHeight = myPos.bottom - myPos.top;
  //
  // Calculate the left position taking into account the offset
  var newLeft = refAbsPos.left + refPosWidth + extWhiskerSize;
  if (offset)
    newLeft = newLeft + offset;
  //
  // If I can't put the popup on the right of the reference object
  var absLeft = refRelPos.left + refPosWidth + extWhiskerSize;
  if (absLeft + this.wrapperObj.offsetWidth > appuiWidth) {
    var coord;
    //
    // If I can, I try to put the popup on the left of the reference object
    if (tryAgain)
      coord = this.popupLeft(refAbsPos, refRelPos, myPos, extWhiskerSize, offset, false);
    //
    // Return popup position or undefined if I can't put the popup anywhere
    return coord;
  }
  //
  // Calculate the top position
  var newTop;
  if (modifier === "top")
    newTop = refAbsPos.top;
  else if (modifier === "bottom")
    newTop = refAbsPos.bottom - myPosHeight;
  else
    newTop = refAbsPos.top - ((myPosHeight - refPosHeight) / 2);
  //
  // If popup is higher then appui, let it fills all screen
  if (myPosHeight > appuiHeight)
    return;
  else if (newTop < 0) // If it's too high align with the reference object
    newTop = 0;
  else if (newTop + myPosHeight > appuiHeight) {
    // If it's too low move it higher
    newTop = refAbsPos.top + refPosHeight - myPosHeight;
  }
  //
  return {top: newTop, left: newLeft, wSide: "left"};
};


/*
 * Calculate the whisker position
 * @param {String} side - side of the whisker relative to the popup
 * @param {Object} - position of the reference object
 * @param {Int} extWhiskerSize - whisker size
 * @param {Float} whiskerDiff - width difference between the internal and the external whisker
 * @returns {Object}
 */
Client.Dialog.prototype.calculateWhiskerCoord = function (side, refAbsPos, extWhiskerSize, borderWidth, whiskerDiff)
{
  var wExtLeft;
  var wExtTop;
  var wIntLeft;
  var wIntTop;
  var myAbsPos = Client.Utils.findElemPos(this.wrapperObj);
  var middleWidthRefObj = (refAbsPos.right - refAbsPos.left) / 2;
  var middleHeigthRefObj = (refAbsPos.bottom - refAbsPos.top) / 2;
  var middleWhisker = (extWhiskerSize * Math.sqrt(2)) / 2;
  //
  if (side === "top") {
    // Calculate the position of the external whisker div
    wExtTop = myAbsPos.top - extWhiskerSize + borderWidth.top;
    wExtLeft = refAbsPos.left + middleWidthRefObj - middleWhisker;
    //
    // Calculate the position of the internal whisker div
    wIntTop = wExtTop + 1;
    if (borderWidth.top > 0)
      wIntTop += borderWidth.top;
    wIntLeft = wExtLeft + whiskerDiff;
  }
  else if (side === "bottom") {
    // Calculate the position of the external whisker div
    wExtTop = myAbsPos.top + this.wrapperObj.offsetHeight - borderWidth.bottom + 1;
    wExtLeft = refAbsPos.left + middleWidthRefObj - middleWhisker;
    //
    // Calculate the position of the internal whisker div
    wIntTop = wExtTop - 1;
    if (borderWidth.bottom > 0)
      wIntTop -= borderWidth.bottom;
    wIntLeft = wExtLeft + whiskerDiff;
  }
  else if (side === "right") {
    // Calculate the position of the external whisker div
    wExtTop = refAbsPos.top + middleHeigthRefObj - middleWhisker;
    wExtLeft = myAbsPos.left + this.wrapperObj.offsetWidth - borderWidth.right + 1;
    //
    // Calculate the position of the internal whisker div
    wIntTop = wExtTop + whiskerDiff;
    wIntLeft = wExtLeft - 1;
    if (borderWidth.right > 0)
      wIntLeft -= borderWidth.right;
  }
  else if (side === "left") {
    // Calculate the position of the external whisker div
    wExtTop = refAbsPos.top + middleHeigthRefObj - middleWhisker;
    wExtLeft = myAbsPos.left - extWhiskerSize + borderWidth.left;
    //
    // Calculate the position of the internal whisker div
    wIntTop = wExtTop + whiskerDiff;
    wIntLeft = wExtLeft + 1;
    if (borderWidth.left > 0)
      wIntLeft += borderWidth.left;
  }
  //
  return {wExtLeft: wExtLeft, wExtTop: wExtTop, wIntLeft: wIntLeft, wIntTop: wIntTop};
};


/**
 * Get the border width from the style
 * @param {Object} style
 * @returns {Object}
 */
Client.Dialog.prototype.getBorderWidth = function (style)
{
  var borderW = {};
  if (style.borderWidth) {
    var w = style.borderWidth.replace("px", "");
    borderW.top = parseFloat(w);
    borderW.right = parseFloat(w);
    borderW.bottom = parseFloat(w);
    borderW.left = parseFloat(w);
  }
  else {
    if (style.borderTopWidth)
      borderW.top = parseFloat(style.borderTopWidth.replace("px", ""));
    if (style.borderRightWidth)
      borderW.right = parseFloat(style.borderRightWidth.replace("px", ""));
    if (style.borderBottompWidth)
      borderW.bottom = parseFloat(style.borderBottomWidth.replace("px", ""));
    if (style.borderLeftpWidth)
      borderW.left = parseFloat(style.borderLeftWidth.replace("px", ""));
  }
  //
  return borderW;
};


/*
 * Invert the side passed as parameter
 * @param {String} side - a string indicating the side, eg. "Top"
 * @return {String}
 */
Client.Dialog.prototype.invertSide = function (side)
{
  var s;
  if (side === "Top")
    s = "Bottom";
  else if (side === "Bottom")
    s = "Top";
  else if (side === "Left")
    s = "Right";
  else
    s = "Left";
  return s;
};


/**
 * Return all the sides but the one passed as parameter
 * @param {String} side - the side to exclude
 * @returns {Array}
 */
Client.Dialog.prototype.getOtherSides = function (side)
{
  var sides = ["Top", "Right", "Bottom", "Left"];
  var index = sides.indexOf(side);
  if (index > -1)
    sides.splice(sides.indexOf(side), 1);
  return sides;
};


/**
 * Create the wisker element for this dialog
 */
Client.Dialog.prototype.createWhisker = function (style, popupCoord, refAbsPos, extWhiskerSize, intWhiskerSize, whiskerDiff)
{
  var whiskerExt = document.createElement("div");
  whiskerExt.className = "whisker-ext";
  //
  // Create the internal whisker div
  var whiskerInt = document.createElement("div");
  whiskerInt.className = "whisker-int";
  //
  // Position the whisker
  // Whisker border width will be the same as the popup border width
  var borderW = this.getBorderWidth(style);
  //
  // Get the whisker position
  var wCoord = this.calculateWhiskerCoord(popupCoord.wSide, refAbsPos, extWhiskerSize, borderW, whiskerDiff);
  //
  // Capitalize the side the whisker has to be positioned
  var wSide = Client.Utils.capitalize(popupCoord.wSide);
  //
  // Set left and top position
  whiskerExt.style.left = (wCoord.wExtLeft) + "px";
  whiskerInt.style.left = (wCoord.wIntLeft) + "px";
  whiskerExt.style.top = (wCoord.wExtTop) + "px";
  whiskerInt.style.top = (wCoord.wIntTop) + "px";
  //
  // Set the border style
  whiskerExt.style["border" + wSide + "Style"] = "dashed";
  whiskerInt.style["border" + wSide + "Style"] = "dashed";
  whiskerExt.style["border" + wSide + "Width"] = "0px";
  whiskerInt.style["border" + wSide + "Width"] = "0px";
  var oSides = this.getOtherSides(wSide);
  for (var i = 0; i < oSides.length; i++) {
    whiskerExt.style["border" + oSides[i] + "Width"] = extWhiskerSize + "px";
    whiskerInt.style["border" + oSides[i] + "Width"] = intWhiskerSize + "px";
  }
  wSide = this.invertSide(wSide);
  whiskerExt.style["border" + wSide + "Color"] = style.borderColor !== "" ? style.borderColor : "transparent";
  whiskerInt.style["border" + wSide + "Color"] = style.backgroundColor;
  //
  // Append whisker
  this.wrapperObj.parentNode.appendChild(whiskerExt);
  this.wrapperObj.parentNode.appendChild(whiskerInt);
};

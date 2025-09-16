/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A popup container
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the dialog
 * @extends Client.Container
 */
Client.IonModal = function (element, parent, view)
{
  if (!element.options.modal)
    element.tag = "ion-popover-inner";
  //
  Client.Container.call(this, element, parent, view);
  //
  if (element === undefined)
    return;
  //
  this.opt = element.options;
  let type = this.opt.modal ? "modal" : "popover";
  //
  // Create objects
  this.rootObj = document.createElement("ion-" + type);
  //
  let classname = type + "-cmp show-page";
  if (this.opt.ref && this.opt.ref.position === "top")
    classname += " popover-bottom";
  if (this.opt.extcls)
    classname += " " + this.opt.extcls;
  this.rootObj.className = classname;
  //
  this.rootObj.style.zIndex = "100";
  this.rootObj.id = this.id;
  //
  this.backgroundDiv = document.createElement("ion-backdrop");
  this.backgroundDiv.cbId = this.opt.cbId;
  this.backgroundDiv.ontouchmove = ev => ev.preventDefault();
  this.rootObj.appendChild(this.backgroundDiv);
  //
  let dType = !Client.mainFrame.device.isMobilePreview ? Client.mainFrame.device.type : Client.mainFrame.device.viewportParams.devicetype;
  if (this.opt.height) {
    if (this.opt.height instanceof Array) {
      this.breakpoints = [];
      //
      for (let k = 0; k < this.opt.height.length; k++) {
        // Skip the invalid values, we cannot really trust the developer
        if (!isNaN(parseInt(this.opt.height[k]))) {
          // Get the value and convert % to px
          let v = this.opt.height[k];
          if (v.indexOf("%") >= 0)
            v = Math.floor((document.body.offsetHeight / 100) * parseInt(v)) + "px";
          //
          // The first valid value in the array must be the starting value
          if (!this.dialogHeight)
            this.dialogHeight = v;
          //
          this.breakpoints.push({
            v,
            h: this.opt.height[k],
            i: parseInt(v)
          });
        }
      }
      //
      // Now we must order the breakpoints values from 100% to 0%
      this.breakpoints.sort((a, b) => b.i - a.i);
      //
      if (dType === "smartphone")
        Client.IonHelper.registerPointerEvents(this.rootObj, null, this, true, "pspmpe");
      //
      this.modalEndFunction = ev => {
        this.wrapperObj.removeEventListener("transitionend", this.modalEndFunction);
        this.wrapperObj.style.transition = "";
        this.wrapperObj.style.bottom = "calc( -100% + " + this.dialogHeight + ")";
        this.wrapperObj.style.transform = "translate3d(0px, 0px, 0px)";
        //
        if (this.dialogHeight === "0px" || this.dialogHeight === "0%")
          this.autoClose();
        else if (this.dialogHeight === (document.body.offsetHeight + "px"))
          this.rootObj.classList.add("dynamic-full");
        else
          this.rootObj.classList.remove("dynamic-full");
      };
      //
      // Register for real orientation changes, we must recal the breakpoints and reposition the
      // modal
      this.orientationFunction = ev => {
        for (let k = 0; k < this.breakpoints.length; k++) {
          if (this.breakpoints[k].h.indexOf("%") >= 0) {
            let v = Math.floor((document.body.offsetHeight / 100) * parseInt(this.breakpoints[k].h)) + "px";
            //
            // This is the current height of the modal, we must reset it into the new size
            if (this.dialogHeight === this.breakpoints[k].v) {
              this.wrapperObj.style.transition = "none";
              this.wrapperObj.style.bottom = "calc( -100% + " + v + ")";
              this.dialogHeight = v;
            }
            //
            this.breakpoints[k].v = v;
          }
        }
      };
      addEventListener("orientationchange", this.orientationFunction);
      addEventListener("resize", this.orientationFunction);
    }
    else if (!isNaN(parseInt(this.opt.height)))
      this.dialogHeight = this.opt.height;
  }
  if (this.opt.width && !isNaN(parseInt(this.opt.width))) {
    this.dialogWidth = this.opt.width;
  }
  //
  if (this.opt.modal) {
    // Modal structure:
    // modal-cmp(root) / ion-backdrop(backgroundDiv) | modal-wrapper(domObj,extObj,wrapperObj)
    this.domObj.className = "modal-wrapper";
    this.rootObj.appendChild(this.domObj);
    this.wrapperObj = this.domObj;
    this.extObj = this.wrapperObj;
    //
    if (this.dialogWidth || this.dialogHeight)
      this.rootObj.classList.add("modal-dynamic");
    if (this.dialogHeight && this.breakpoints)
      this.rootObj.classList.add("has-indicator");
    //
    if (this.dialogWidth) {
      this.wrapperObj.style.width = this.dialogWidth;
      this.wrapperObj.style.left = "calc(50% - (" + this.dialogWidth + "/2))";
    }
    if (this.dialogHeight) {
      if (this.breakpoints && dType === "smartphone")
        this.wrapperObj.style.bottom = "calc( -100% + " + this.dialogHeight + ")";
      else {
        this.wrapperObj.style.height = this.dialogHeight;
        this.wrapperObj.style.top = "calc(50% - (" + this.dialogHeight + "/2))";
      }
    }
    //
    // Delete ref property
    delete this.opt.ref;
  }
  else {
    // Popover structure:
    // popover-cmp(root) / ion-backdrop(backgroundDiv) | popover-wrapper(extObj) / popover-content (wrapperObj) / popover-viewport (viewportObj) / ion-popover-inner (domObj)
    this.extObj = document.createElement("div");
    this.extObj.className = "popover-wrapper";
    this.rootObj.appendChild(this.extObj);
    this.wrapperObj = document.createElement("div");
    this.wrapperObj.className = "popover-content";
    this.extObj.appendChild(this.wrapperObj);
    this.viewportObj = document.createElement("div");
    this.viewportObj.className = "popover-viewport";
    this.wrapperObj.appendChild(this.viewportObj);
    this.viewportObj.appendChild(this.domObj);
    //
    if (this.dialogWidth)
      this.wrapperObj.style.width = this.dialogWidth;
    if (this.dialogHeight)
      this.wrapperObj.style.height = this.dialogHeight;
    //
    // Adjust ref property
    this.opt.autoclose = true;
    if (this.opt.ref) {
      if (!this.opt.ref.id)
        delete this.opt.ref;
      else if (this.opt.ref.whisker === undefined) {
        if (Client.Ionic.platform === "md") {
          this.opt.ref.whisker = false;
          let refEl = Client.eleMap[this.opt.ref.id];
          if (refEl?.domObj && this.opt.ref.offset === undefined)
            this.opt.ref.offset = -refEl.domObj.offsetHeight;
        }
        else {
          this.opt.ref.whisker = true;
          delete this.opt.ref.offset;
        }
      }
    }
  }
  //
  // Append the rootObj div to the app-ui
  let appui = document.getElementById("app-ui");
  appui.appendChild(this.rootObj);
  //
  this.domObj.tabIndex = 0;
  this.lastActiveElement = document.activeElement;
  this.focus();
  appui.scrollTop = 0;
  //
  // If the popup has to close when clicking outside it
  if (this.opt?.autoclose) {
    // Define the function to close the dialog
    this.autoclose = true;
    this.autoCloseFunct = ev => this.autoClose(ev, this);
    //
    this.backgroundDiv.addEventListener("mousedown", this.autoCloseFunct);
    this.backgroundDiv.addEventListener("touchend", this.autoCloseFunct);
  }
  //
  if (this.opt.modal) {
    // modal enter by sliding content from bottom
    let duration = (Client.Ionic.platform === "md") ? 250 : 400;
    if (typeof this.opt.animation === "boolean" && !this.opt.animation)
      duration = 10;
    if (typeof this.opt.animation === "number")
      duration = this.opt.animation;
    //
    this.extObj.style.transition = "transform " + duration + "ms cubic-bezier(.36,.66,.04,1),opacity " + duration + "ms cubic-bezier(.36,.66,.04,1)";
    this.backgroundDiv.style.transition = "opacity " + duration + "ms cubic-bezier(.36,.66,.04,1)";
    //
    if (this.breakpoints && dType === "smartphone") {
      // In this case to enter from the bottom we must set the bottom to -100% and then reset it to the already calculated value
      this.extObj.style.transition = "bottom " + duration + "ms cubic-bezier(.36,.66,.04,1),opacity " + duration + "ms cubic-bezier(.36,.66,.04,1)";
      this.wrapperObj.setAttribute("btstyle", this.wrapperObj.style.bottom);
      this.wrapperObj.style.bottom = "";
    }
    else if (this.dialogHeight && !this.breakpoints && dType === "smartphone") {
      // We have only a fixed height, to create the transition we need to set the bottom to 0px
      this.extObj.style.transition = "bottom " + duration + "ms cubic-bezier(.36,.66,.04,1),opacity " + duration + "ms cubic-bezier(.36,.66,.04,1)";
      this.wrapperObj.style.bottom = "";
    }
  }
  else {
    // popover: programming ios animations, as md animation require positioning
    let duration = 100;
    if (typeof this.opt.animation === "boolean" && !this.opt.animation)
      duration = 10;
    if (typeof this.opt.animation === "number")
      duration = this.opt.animation;
    //
    this.extObj.style.transition = "opacity " + duration + "ms ease";
    this.backgroundDiv.style.transition = "opacity " + duration + "ms ease";
  }
};


// Make Client.IonModal extend Client.Dialog
Client.IonModal.prototype = new Client.Dialog();


/**
 * Close the popup
 * @param {Function} cb - callback
 * @param {String} elemId - callback param
 */
Client.IonModal.prototype.close = function (cb, elemId)
{
  this.closing = true;
  let duration = (Client.Ionic.platform === "md") ? 250 : 400;
  //
  if (!this.opt.modal) {
    // popover exits with a fade out animation
    duration = 500;
  }
  if (typeof this.opt.animation === "boolean" && !this.opt.animation)
    duration = 10;
  if (typeof this.opt.animation === "number")
    duration = this.opt.animation;
  //
  this.extObj.style.transitionDuration = duration + "ms";
  this.backgroundDiv.style.transitionDuration = duration + "ms";
  //
  // Delete whisker
  let wo = this.rootObj.getElementsByClassName('popover-arrow')[0];
  if (wo) {
    wo.style.transitionDuration = duration + "ms";
    wo.style.opacity = "0.01";
  }
  //
  // Resetting properties to slide modal out
  this.extObj.style.transform = "";
  this.extObj.style.opacity = "";
  this.backgroundDiv.style.opacity = "0.01";
  //
  let dType = !Client.mainFrame.device.isMobilePreview ? Client.mainFrame.device.type : Client.mainFrame.device.viewportParams.devicetype;
  if ((this.breakpoints || this.dialogHeight) && dType === "smartphone")
    this.wrapperObj.style.bottom = "";
  //
  setTimeout(() => {
    this.lastActiveElement?.focus();
    this.rootObj.remove();
    //
    // Delete any view element
    Client.Dialog.prototype.close.call(this);
    //
    // Callback is needed to allow other clients to close popup menu during telecollaboration or testauto cases.
    // See Client.IonHelper.createMenu for more details
    if (cb)
      cb(elemId);
  }, duration);
  //
  if (this.orientationFunction) {
    removeEventListener("orientationchange", this.orientationFunction);
    removeEventListener("resize", this.orientationFunction);
  }
};


/**
 * Position the popup on the screen
 */
Client.IonModal.prototype.positionElement = function ()
{
  Client.Dialog.prototype.positionElement.call(this);
  //
  // No absolute position of the content if we don't have a reference object
  if (!this.opt.ref)
    this.rootObj.classList.add("popover-no-ref");
  //
  // The positionElement could have changed the position of the popup set in the options.
  // If the popup is moved on top of the reference element, I need to add a class to draw
  // the whisker properly
  if (this.opt.ref && this.opt.ref.whiskerPosition === "bottom")
    this.rootObj.classList.add("popover-bottom");
  //
  if (this.opt.modal) {
    // Start sliding modal content up
    this.extObj.style.transform = "translate3d(0,0,0)";
    this.backgroundDiv.style.opacity = "0.4";
    //
    var dType = !Client.mainFrame.device.isMobilePreview ? Client.mainFrame.device.type : Client.mainFrame.device.viewportParams.devicetype;
    if (this.breakpoints && dType === "smartphone") {
      // In this case to enter from the bottom we must set the bottom to -100% and then reset it to the already calculated value
      var t = this.wrapperObj.offsetHeight;
      this.wrapperObj.style.bottom = this.wrapperObj.getAttribute("btstyle");

    }
    else if (this.dialogHeight && !this.breakpoints && dType === "smartphone") {
      var tx = this.wrapperObj.offsetHeight;
      this.wrapperObj.style.bottom = "0px";
    }
  }
  else {
    if (Client.Ionic.platform === "md") {
      //
      // md popover zoom in: select zoom direction
      var to1 = "center";
      var to2 = "center";
      if (this.opt.ref && this.opt.ref.id) {
        var refEl = Client.eleMap[this.opt.ref.id];
        if (refEl && refEl.domObj) {
          var r1 = refEl.domObj.getBoundingClientRect();
          var r2 = this.wrapperObj.getBoundingClientRect();
          var c1x = (r1.left + r1.right) / 2;
          var c2x = (r2.left + r2.right) / 2;
          var c1y = (r1.top + r1.bottom) / 2;
          var c2y = (r2.top + r2.bottom) / 2;
          if (Math.abs(c1x - c2x) > 10)
            to2 = (c1x < c2x) ? "left" : "right";
          if (c1y < c2y)
            to1 = "top";
          else {
            to2 = "bottom";
            //
            // get whisker
            var wobj = document.getElementsByClassName("popover-arrow")[0];
            //
            // I have to calculate again the top position of the element because the position
            // of the Client.Dialog is different when it's on top / if not whisker is present
            if (!wobj && !refEl.parentWidget) {
              var x = r1.bottom - r2.height;
              if (this.opt.ref.offset !== undefined)
                x = r1.top - r2.height - this.opt.ref.offset;
              this.wrapperObj.style.top = x + "px";
            }
          }
        }
      }
      this.wrapperObj.style.transformOrigin = to1 + " " + to2;
      this.wrapperObj.style.transform = "scale(0.001)";
      //
      setTimeout(function () {
        var duration = 300;
        if (typeof this.opt.animation === "boolean" && !this.opt.animation)
          duration = 10;
        if (typeof this.opt.animation === "number")
          duration = this.opt.animation;
        //
        this.wrapperObj.style.transition = "transform " + duration + "ms cubic-bezier(.36, .66, .04, 1)";
        this.wrapperObj.style.transform = "";
      }.bind(this), 50);
    }
    else {
      // ios popover fade in
      this.backgroundDiv.style.opacity = "0.1";
    }
  }
  //
  // Start fade in
  this.extObj.style.opacity = "1";
  if (this.viewportObj) {
    this.viewportObj.style.opacity = "1";
  }
};


/**
 * Create the wisker element for this dialog
 */
Client.IonModal.prototype.createWhisker = function (style, popupCoord, refAbsPos, extWhiskerSize, intWhiskerSize, whiskerDiff)
{
  var whisker = document.createElement("div");
  whisker.className = "popover-arrow";
  //
  // Position the whisker
  var borderW = this.getBorderWidth(style);
  //
  // Get the whisker position
  var wCoord = this.calculateWhiskerCoord(popupCoord.wSide, refAbsPos, extWhiskerSize, borderW, whiskerDiff);
  //
  // Set left and top position
  whisker.style.left = (wCoord.wExtLeft) + "px";
  whisker.style.top = (wCoord.wExtTop) + "px";
  //
  // Append whisker
  this.rootObj.appendChild(whisker);
  var duration = -1;
  if (typeof this.opt.animation === "boolean" && !this.opt.animation)
    duration = 10;
  if (typeof this.opt.animation === "number")
    duration = this.opt.animation;
  if (duration >= 0)
    whisker.style.transitionDuration = duration + "ms";
  //
  setTimeout(function () {
    whisker.style.opacity = "1";
  }, 50);
};


/*
 * Calculate the whisker position
 * @param {String} side - side of the whisker relative to the popup
 * @param {Object} - position of the reference object
 * @param {Int} extWhiskerSize - whisker size
 * @param {Float} whiskerDiff - width difference between the internal and the external whisker
 * @returns {Object}
 */
Client.IonModal.prototype.calculateWhiskerCoord = function (side, refAbsPos, extWhiskerSize, borderWidth, whiskerDiff)
{
  var coord = Client.Dialog.prototype.calculateWhiskerCoord.call(this, side, refAbsPos, extWhiskerSize, borderWidth, whiskerDiff);
  //
  // The ionmodal whisker is different from the dialog whisker
  // and it needs a slightly different positioning
  if (side === "bottom")
    coord.wExtTop = coord.wExtTop - 2;
  if (side === "top" && this.opt.ionmenu)
    coord.wExtTop = coord.wExtTop + 5;
  return coord;
};


/**
 * Close the popup if mouse clicked outside it
 * @param {MouseEvent} ev - the event occured when the user clicked
 */
Client.IonModal.prototype.autoClose = function (ev)
{
  // If the clicked element is not one of my children close the popup
  // This function could be called from code, so ev could not be present,
  // in that case we continue with the closing
  if (ev) {
    let clickedEl = ev.target;
    let parent = clickedEl.parentNode;
    while (parent) {
      if (parent === this.wrapperObj)
        return;
      parent = parent.parentNode;
    }
  }
  //
  if (this.view && !this.closing) {
    // The browser send touchend AND mousedown.
    // To have only an event sent we need to prevent the first, so the next will not be notified
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
    //
    if (ev)
      ev.preventDefault();
    //
    // If the main element of the view is a widget call its close
    let mainElement = this.view.elements[0];
    if (mainElement instanceof Client.Widget) {
      if (mainElement.closeIdfView)
        mainElement.closeIdfView();
      else
        mainElement.close(true);
    }
    //
    // Search for a back-button in the page
    let el = this.rootObj.getElementsByClassName("back-button");
    if (el && el.length) // If the navbar has the back button, click on it.
      el[0].click();
    else // Try to go back. we cannot close the view directly as ionic use a page controller
      history.back();
  }
};


/**
 * touchstart, mousedown event listener
 * @param {event} ev
 */
Client.IonModal.prototype.pointerStart = function (ev)
{
  var c = this.wrapperObj.getBoundingClientRect();
  var cy = (ev.touches ? ev.touches[0].screenY : ev.screenY);
  //
  if ((cy > c.top && cy <= c.top + 60) || Client.Utils.isChildOfTag(ev.target, "ION-HEADER")) {
    this.startY = (ev.touches ? ev.touches[0].screenY : ev.screenY);
    this.startX = (ev.touches ? ev.touches[0].screenX : ev.screenX);
    this.startTime = new Date();
    this.swiping = false;
  }
  //
  return true;
};


/**
 * touchmove, mousemove event listener
 * @param {event} ev
 */
Client.IonModal.prototype.pointerMove = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  if (Client.mainFrame.isClickPrevented()) {
    delete this.startX;
    delete this.startY;
    return;
  }
  //
  var currentY = ev.touches ? ev.touches[0].screenY : ev.screenY;
  var currentX = ev.touches ? ev.touches[0].screenX : ev.screenX;
  var dy = Math.abs(currentY - this.startY);
  //
  //
  // swipe down disable menu swiping
  if (!this.swiping) {
    if (dy > 10) {
      this.swiping = true;
      this.swipingSide = "up";
    }
    else if (dy < -10) {
      this.swiping = true;
      this.swipingSide = "down";
    }
    //
    if (this.swiping) {
      this.startY = currentY;
      this.wrapperObj.classList.add("active-slide");
      this.wrapperObj.removeEventListener("transitionend", this.modalEndFunction);
    }
  }
  //
  if (this.swiping) {
    var my = this.startY - currentY;
    //
    this.tx = -my;
    //
    this.wrapperObj.style.transform = "translate3d(0px, " + this.tx + "px, 0)";
    this.wrapperObj.style.transition = "none";
    //
    ev.preventDefault();
  }
  //
  this.lastX = currentX;
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonModal.prototype.pointerEnd = function (ev)
{
  if (this.startY === undefined)
    return;
  //
  var currentY = ev.changedTouches ? ev.changedTouches[0].screenY : ev.screenY;
  //
  if (this.swiping) {
    var dt = new Date() - this.startTime;
    var dx = Math.abs(currentY - this.startY);
    var v = dx / dt;
    var dir = currentY > this.startY ? -1 : 1; // 1 swipe up, -1 swipe down
    this.wrapperObj.style.transition = "200ms";
    //
    this.wrapperObj.addEventListener("transitionend", this.modalEndFunction);
    //
    //
    var tgtBreakpoint;
    var j;
    var bk;
    //
    if (this.autoclose && dir < 0 && (currentY - this.startY) > 150 && v > 0.5)
      tgtBreakpoint = 0;
    else {
      // find the current breakpoint and get the next or the previous
      // (by the direction of the user)
      for (j = this.breakpoints.length - 1; j >= 0; j--) {
        if (this.breakpoints[j].v === this.dialogHeight) {
          bk = dir > 0 ? this.breakpoints[j - 1] : this.breakpoints[j + 1];
          if (bk)
            tgtBreakpoint = bk.i;
          break;
        }
      }
    }
    //
    if (tgtBreakpoint !== undefined) {
      var oldDialogHeight = parseInt(this.dialogHeight);
      this.dialogHeight = tgtBreakpoint + "px";
      this.wrapperObj.style.transform = "translate3d(0px, " + (oldDialogHeight - tgtBreakpoint) + "px, 0)";
    }
    else
      this.wrapperObj.style.transform = "translate3d(0px, 0px, 0)";
    //
    ev.preventDefault();
  }
  //
  delete this.swiping;
  delete this.startX;
  delete this.startY;
  delete this.startTime;
  delete this.lastX;
  delete this.tx;
};


/**
 * touchend, mouseup event listener
 * @param {event} ev
 */
Client.IonModal.prototype.pointerOut = function (ev)
{
  var x = ev.toElement;
  var out = true;
  while (x) {
    if (x === this.rootObj) {
      out = false;
      break;
    }
    x = x.parentNode;
  }
  if (out)
    this.pointerEnd(ev);
};

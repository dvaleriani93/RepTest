/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client,componentHandler */

/**
 * @class Material Design Helper class
 */
Client.IonHelper = {};

// Register ionmodal as modal dialog class
Client.View.dialogClass = "IonModal";

// disable webview scrolling on keyboard open
Client.mainFrame.processRequest([{obj: "device-keyboard", id: "disableScroll", cnt: {disable: true}}]);

// handle cursor on ios scroll
(function () {
  if (Client.mainFrame.device.operatingSystem !== "ios" || Client.mainFrame.theme.dontHoldCaret == "true")
    return;
  //
  try {
    // If the user has set a number in dontHoldCaret we must check it as the maxVersion
    if (Client.mainFrame.theme.dontHoldCaret !== undefined && !isNAN(parseInt(Client.mainFrame.theme.dontHoldCaret, 10))) {
      var maxVersion = parseInt(Client.mainFrame.theme.dontHoldCaret, 10);
      if (parseFloat(Client.mainFrame.device.operatingSystemVersion.trim(), 10) > maxVersion)
        return;
    }
    else {
      // If the user has set a false or set nothing we enable this only on ios<14
      if (parseFloat(Client.mainFrame.device.operatingSystemVersion.trim(), 10) >= 14)
        return;
    }
  }
  catch (ex) {

  }
  //
  var appui = document.getElementById("app-ui");
  var th = Client.IonHelper;
  //
  appui.addEventListener("touchstart", function (ev) {
    if (ev.srcElement === document.activeElement)
      th.fiStart = new Date().getTime();
  }, {passive: true, capture: true});
  //
  appui.addEventListener("touchmove", function (ev) {
    var x = document.activeElement;
    if (x && !th.fakeInput && Client.Utils.isNodeEditable(x)) {
      var ok = true;
      // Let's see if this features has been disabled for this input
      var ele = x;
      while (ele && ok) {
        if (ele.getAttribute && ele.getAttribute("dontholdcaret") === "true")
          ok = false;
        ele = ele.parentNode;
      }
      //
      if (ok && (!th.fiStart || (new Date().getTime()) - th.fiStart < 500)) {
        // Create a clone of the input being focused
        th.lastInput = x;
        setTimeout(function () {
          th.fakeInput = x.cloneNode();
          x.parentNode.appendChild(th.fakeInput);
          //
          // Hide the cursor, without changing focus
          x.style.display = "none";
        }, 0);
      }
    }
  }, {passive: true, capture: true});
  //
  // Restore previous input
  var removeFI = function () {
    if (th.lastInput) {
      th.lastInput.style.display = "";
      th.lastInput.focus();
      th.lastInput = undefined;
    }
    if (th.fakeInput) {
      th.fakeInput.remove();
      th.fakeInput = undefined;
    }
    th.fakeTimeout = undefined;
  };
  //
  var endFI = function (ev) {
    // Set a timeout to restore input
    if (th.fakeInput && !th.fakeTimeout) {
      th.fakeTimeout = setTimeout(removeFI, 500);
    }
    th.fiStart = undefined;
  };
  //
  var checkFI = function (ev) {
    // Another input gained focus, restore immediately the previous one
    if (th.fakeInput) {
      var x = document.activeElement;
      if (x !== th.lastInput)
        removeFI();
    }
  };
  //
  appui.addEventListener("touchend", endFI, {passive: true, capture: true});
  appui.addEventListener("touchcancel", endFI, {passive: true, capture: true});
  //
  appui.addEventListener("focus", checkFI, {passive: true, capture: true});
  appui.addEventListener("blur", checkFI, {passive: true, capture: true});
  //
  appui.addEventListener("scroll", function (ev) {
    //
    // Re-engage timer to wait for scrolling to end
    if (th.fakeTimeout) {
      clearTimeout(Client.IonHelper.fakeTimeout);
      th.fakeTimeout = setTimeout(removeFI, 300);
    }
  }, {passive: true, capture: true});
  //
}());

/**
 * Redefine close popup function
 */
Client.MainFrame.prototype.closePopup = function (cbId)
{
  var appui = document.getElementById("app-ui");
  var c = appui.getElementsByTagName("ION-BACKDROP");
  for (var i = 0; i < c.length; i++) {
    var s = c[i].parentNode.tagName;
    if (cbId && cbId !== c[i].cbId)
      continue;
    if (s === "ION-ACTION-SHEET" || s === "ION-ALERT" || s === "ION-LOADING" || s === "ION-POPOVER")
      c[i].click();
  }
};


/**
 * returns true if a popup is open
 */
Client.IonHelper.hasPopup = function ()
{
  var appui = document.getElementById("app-ui");
  var c = appui.getElementsByTagName("ION-BACKDROP");
  for (var i = 0; i < c.length; i++) {
    var s = c[i].parentNode.tagName;
    if (s === "ION-ACTION-SHEET" || s === "ION-ALERT" || s === "ION-LOADING") {
      return true;
    }
  }
};


/**
 * Register click/touch listener to a clickable ionic element
 * @param {Object} element
 */
Client.IonHelper.registerClickListener = function (element, domObj)
{
  if (!domObj)
    domObj = element.domObj;
  //
  domObj.setAttribute("click-delay", 40);
  //
  var pthis = this;
  domObj.addEventListener("mousedown", function (ev) {
    pthis.activate(element, ev, true, domObj);
  }, {passive: true});
  domObj.addEventListener("touchstart", function (ev) {
    pthis.activate(element, ev, true, domObj);
  }, {passive: true});
  domObj.addEventListener("mouseup", function (ev) {
    pthis.activate(element, ev, false, domObj);
  }, {passive: true});
  domObj.addEventListener("mouseleave", function (ev) {
    pthis.activate(element, ev, false, domObj);
  }, {passive: true});
  domObj.addEventListener("touchend", function (ev) {
    pthis.activate(element, ev, false, domObj);
  }, {passive: true});
  domObj.addEventListener("touchcancel", function (ev) {
    pthis.activate(element, ev, false, domObj);
  }, {passive: true});
  domObj.addEventListener("click", function (ev) {
    pthis.click(element, ev, domObj);
  }, false);
};


/**
 * Add Listener to pointer events
 * @param {HTMLElement} domobj
 * @param {any} options
 * @param {Object} element
 */
Client.IonHelper.registerPointerEvents = function (domobj, options, element, capture, passive)
{
  passive = passive || "";
  //
  domobj.addEventListener("mousedown", function (ev) {
    if (this.pointerStart)
      return this.pointerStart(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("ps") === -1});
  domobj.addEventListener("touchstart", function (ev) {
    if (this.pointerStart)
      return this.pointerStart(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("ps") === -1});
  domobj.addEventListener("mousemove", function (ev) {
    if (this.pointerMove)
      return this.pointerMove(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("pm") === -1});
  domobj.addEventListener("touchmove", function (ev) {
    if (this.pointerMove)
      return this.pointerMove(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("pm") === -1});
  domobj.addEventListener("mouseup", function (ev) {
    if (this.pointerEnd)
      return this.pointerEnd(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("pe") === -1});
  domobj.addEventListener("touchend", function (ev) {
    if (this.pointerEnd)
      return this.pointerEnd(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("pe") === -1});
  domobj.addEventListener("mouseout", function (ev) {
    if (this.pointerOut)
      return this.pointerOut(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("po") === -1});
  domobj.addEventListener("touchcancel", function (ev) {
    if (this.pointerOut)
      return this.pointerOut(ev, options);
  }.bind(element), {capture: capture, passive: passive.indexOf("po") === -1});
};


/**
 * Activate / Deactivate object
 * @param {Object} element
 * @param {Object} ev - event
 * @param {Object} status - bool
 */
Client.IonHelper.activate = function (element, ev, status, _clickObj)
{
  // No activation near scroll events
  if (status && Client.mainFrame.isClickPrevented())
    return;
  //
  if (status) {
    _clickObj.classList.add("activated");
    Client.mainFrame.registerPreventListener(element.id, function () {
      Client.IonHelper.activate(element, ev, false, _clickObj);
    });
  }
  else {
    _clickObj.classList.remove("activated");
    Client.mainFrame.unregisterPreventListener(element.id);
  }
};


/**
 * run click effect on button
 * @param {Object} element
 * @param {Object} ev - event
 */
Client.IonHelper.click = function (element, ev, _clickObj)
{
  // Click are disabled? No action
  if (Client.mainFrame.isClickPrevented())
    return;
  //
  var eff = _clickObj.getElementsByTagName("ion-button-effect");
  var effObj = eff ? eff[0] : undefined;
  if (!effObj) {
    effObj = document.createElement("ion-button-effect");
    _clickObj.appendChild(effObj);
  }
  //
  let ok = true;
  if (element.myClick) {
    let ris = element.myClick(ev, _clickObj);
    if (ris === false)
      ok = false;
  }
  //
  // ripple effect on click
  if (ok && Client.Ionic.platform === "md" && (ev.x || ev.y)) {
    //
    var startCoord = {x: ev.x, y: ev.y};
    //
    // move ripple element out
    effObj.style.left = '-9999px';
    effObj.style.opacity = '';
    effObj.style.transform = 'scale(0.001) translateZ(0px)';
    effObj.style.transition = '';
    //
    // Read dimensions
    var clientRect = _clickObj.getBoundingClientRect();
    var top = clientRect.top;
    var left = clientRect.left;
    var width = clientRect.width;
    var height = clientRect.height;
    //
    // Prepare ripple effect
    var clientPointerX = (startCoord.x - left);
    var clientPointerY = (startCoord.y - top);
    var x = Math.max(Math.abs(width - clientPointerX), clientPointerX) * 2;
    var y = Math.max(Math.abs(height - clientPointerY), clientPointerY) * 2;
    var diameter = Math.min(Math.max(Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)), 64), 240);
    var radius = Math.sqrt(width + height);
    var scaleTransitionDuration = Math.max(1600 * Math.sqrt(radius / 300) + 0.5, 260);
    var opacityTransitionDuration = scaleTransitionDuration * 0.7;
    var opacityTransitionDelay = scaleTransitionDuration - opacityTransitionDuration;
    //
    // Start ripple
    effObj.style.width = effObj.style.height = diameter + 'px';
    effObj.style.marginTop = effObj.style.marginLeft = -(diameter / 2) + 'px';
    effObj.style.left = clientPointerX + 'px';
    effObj.style.top = clientPointerY + 'px';
    effObj.style.opacity = '0';
    effObj.style.transform = 'scale(1) translateZ(0px)';
    effObj.style.transition = 'transform ' + scaleTransitionDuration + 'ms,opacity ' +
            opacityTransitionDuration + 'ms ' + opacityTransitionDelay + 'ms';
  }
};


/**
 * Return the icon set (md or ios)
 */
Client.IonHelper.getIconSet = function ()
{
  return Client.mainFrame.theme.iconSet || Client.Ionic.platform;
};


/**
 * Return the class class to apply for this icon
 * @param {string} icon
 */
Client.IonHelper.getIconClass = function (icon)
{
  if (!icon)
    return "";
  //
  // If in the icon name there is a space, the icon is not an ionic icon.
  // Don't add the prefix and use the icon name as is
  if (icon.indexOf(" ") > 0)
    return icon;
  //
  var prefix = "ion-";
  //
  // If the icon name doesn't start with "md-", "ios-" or "logo-", add the platform to the prefix
  if (icon.substring(0, 3) !== "md-" && icon.substring(0, 4) !== "ios-" && icon.substring(0, 5) !== "logo-")
    prefix += Client.IonHelper.getIconSet() + "-";
  //
  return prefix + icon;
};


/**
 * Return the class class to apply for this icon
 * @param {string} icon
 * @param {DOMNode} ionIcon
 * @param {string} extracss : extra css class to add
 */
Client.IonHelper.setIonIcon = function (icon, ionIcon, extracss) {
  if (!icon || !ionIcon)
    return;
  if (!extracss)
    extracss = "";
  //
  // I use IonIcons5, the icon has no prefix and starts without svg_ : maybe is an icon4 that was not converted:
  // let's convert it
  if (Client.mainFrame.theme.ionIcons === "5" && icon.substring(0, 4) !== "svg_" && icon.indexOf(" ") === -1) {
    var newIcn = icon;
    //
    // Check if the user set a 'swap'
    if (Client.mainFrame.theme["icon-" + icon] !== undefined)
      newIcn = Client.mainFrame.theme["icon-" + icon];
    //
    // Check if the icon is a modified icon
    newIcn = Client.IonHelper.getIconTransformation(newIcn);
    //
    icon = "svg_" + newIcn;
  }
  //
  if (icon.substring(0, 4) === "svg_") {
    ionIcon.className = extracss ? extracss + " " : "";
    var icn = icon.substring(4);
    if (!icn.endsWith("-sharp") && !icn.endsWith("-outline")) {
      // Get the iconSet, if is md or ios do nothing, if is sharp or outline we must check if the icon already uses that
      // if not we add the desidered iconset (only if the icon hasn't an iconset already defined)
      var ics = Client.IonHelper.getIconSet();
      if (ics === "md" || ics === "ios")
        ics = "";
      icn = ics !== "" ? icon.substring(4) + "-" + ics : icon.substring(4);
    }
    var ris = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + icn);
    ris.appendChild(use);
    ionIcon.innerHTML = "";
    ionIcon.appendChild(ris);
  }
  else {
    ionIcon.className = (extracss ? extracss + " " : "") + Client.IonHelper.getIconClass(icon);
  }
};

Client.IonHelper.getIconTransformation = function (icon)
{
  if (!Client.IonHelper.IonIcons5Tranlation) {
    Client.IonHelper.IonIcons5Tranlation = {};
    Client.IonHelper.IonIcons5Tranlation["alert"] = "alert-circle";
    Client.IonHelper.IonIcons5Tranlation["appstore"] = "logo-apple-appstore";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropdown-circle"] = "caret-down-circle";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropdown"] = "caret-down";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropleft-circle"] = "caret-back-circle";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropleft"] = "caret-back";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropright-circle"] = "caret-forward-circle";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropright"] = "caret-forward";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropup-circle"] = "caret-up-circle";
    Client.IonHelper.IonIcons5Tranlation["arrow-dropup"] = "caret-up";
    Client.IonHelper.IonIcons5Tranlation["arrow-round-back"] = "arrow-back";
    Client.IonHelper.IonIcons5Tranlation["arrow-round-down"] = "arrow-down";
    Client.IonHelper.IonIcons5Tranlation["arrow-round-forward"] = "arrow-forward";
    Client.IonHelper.IonIcons5Tranlation["arrow-round-up"] = "arrow-up";
    Client.IonHelper.IonIcons5Tranlation["at"] = "at-circle";
    Client.IonHelper.IonIcons5Tranlation["contact"] = "person-circle";
    Client.IonHelper.IonIcons5Tranlation["contacts"] = "person-circle";
    Client.IonHelper.IonIcons5Tranlation["chatboxes"] = "chatbox";
    Client.IonHelper.IonIcons5Tranlation["fastforward"] = "play-forward";
    Client.IonHelper.IonIcons5Tranlation["done-all"] = "checkmark-done";
    Client.IonHelper.IonIcons5Tranlation["filing"] = "file-tray";
    Client.IonHelper.IonIcons5Tranlation["logo-game-controller-b"] = "game-controller";
    Client.IonHelper.IonIcons5Tranlation["hand"] = "hand-right";
    Client.IonHelper.IonIcons5Tranlation["heart-empty"] = "heart-outline";
    Client.IonHelper.IonIcons5Tranlation["jet"] = "airplane";
    Client.IonHelper.IonIcons5Tranlation["lock"] = "lock-closed";
    Client.IonHelper.IonIcons5Tranlation["model-s"] = "car-sport";
    Client.IonHelper.IonIcons5Tranlation["more"] = "ellipsis-vertical";
    Client.IonHelper.IonIcons5Tranlation["paper"] = "newspaper";
    Client.IonHelper.IonIcons5Tranlation["pie"] = "pie-chart";
    Client.IonHelper.IonIcons5Tranlation["photos"] = "images";
    Client.IonHelper.IonIcons5Tranlation["qr-scanner"] = "qr-code";
    Client.IonHelper.IonIcons5Tranlation["redo"] = "arrow-redo";
    Client.IonHelper.IonIcons5Tranlation["reorder"] = "reorder-two";
    Client.IonHelper.IonIcons5Tranlation["return-left"] = "return-down-back";
    Client.IonHelper.IonIcons5Tranlation["return-right"] = "return-down-forward";
    Client.IonHelper.IonIcons5Tranlation["rewind"] = "play-back";
    Client.IonHelper.IonIcons5Tranlation["reverse-camera"] = "camera-reverse";
    Client.IonHelper.IonIcons5Tranlation["skip-backward"] = "play-skip-back";
    Client.IonHelper.IonIcons5Tranlation["skip-forward"] = "play-skip-forward";
    Client.IonHelper.IonIcons5Tranlation["unlock"] = "lock-open";
    Client.IonHelper.IonIcons5Tranlation["stats"] = "stats-chart";
    Client.IonHelper.IonIcons5Tranlation["switch"] = "toggle";
    Client.IonHelper.IonIcons5Tranlation["text"] = "chatbox-ellipses";
    Client.IonHelper.IonIcons5Tranlation["undo"] = "arrow-undo";
    Client.IonHelper.IonIcons5Tranlation["share-alt"] = "share";
    Client.IonHelper.IonIcons5Tranlation["clock"] = "time";
    Client.IonHelper.IonIcons5Tranlation["microphone"] = "mic";
    Client.IonHelper.IonIcons5Tranlation["swap"] = "swap-horizontal";
    Client.IonHelper.IonIcons5Tranlation["ios-more"] = "ellipsis-horizontal";
    Client.IonHelper.IonIcons5Tranlation["md-code"] = "code";
  }
  //
  if (Client.IonHelper.IonIcons5Tranlation[icon] !== undefined)
    return Client.IonHelper.IonIcons5Tranlation[icon];
  return icon;
};

/**
 * Execute toast command
 * @param {object} options
 * @param {function} cb
 */
Client.IonHelper.createToast = function (options, cb)
{
  if (!options.position)
    options.position = "bottom";
  //
  let tw = document.createElement("div");
  tw.className = "toast-wrapper toast-" + options.position;
  //
  if (options.style) {
    if (options.style.indexOf(":") > -1)
      tw.style.cssText += options.style;
    else
      tw.classList.add(options.style);
  }
  //
  let tc = document.createElement("div");
  tc.className = "toast-container";
  tw.appendChild(tc);
  //
  let tm = document.createElement("div");
  tm.className = "toast-message";
  //
  if (options.html)
    tm.innerHTML = options.message;
  else
    tm.textContent = options.message;
  //
  tc.appendChild(tm);
  //
  let cbtn;
  if (options.showCloseButton) {
    cbtn = document.createElement("button");
    cbtn.className = "toast-button disable-hover button button-clear";
    let sp = document.createElement("span");
    sp.className = "button-inner";
    sp.textContent = options.closeButtonText || "OK";
    cbtn.appendChild(sp);
    tc.appendChild(cbtn);
  }
  else if (!options.duration)
    options.duration = 3000;
  //
  let appui = document.getElementById("app-ui");
  if (options.position === "middle") {
    tw.opacity = "0.01";
    tw.style.top = Math.floor(appui.clientHeight / 2 - tw.clientHeight / 2) + "px";
  }
  appui.appendChild(tw);
  //
  // To enable immediate animation
  let r = tw.offsetTop;
  //
  // Enter transition
  let x = (Client.Ionic.platform === "md") ? 0 : 10;
  //
  tw.style.transition = "transform 400ms cubic-bezier(.36,.66,.04,1)";
  if (options.position === "bottom")
    tw.style.transform = "translateY(-" + x + "px)";
  if (options.position === "top")
    tw.style.transform = "translateY(" + x + "px)";
  if (options.position === "middle") {
    tw.style.transition = "opacity 400ms cubic-bezier(.36,.66,.04,1)";
    tw.style.opacity = "1";
  }
  //
  // Exit transition
  let f = () => {
    if (options.position === "middle")
      tw.style.opacity = "0.01";
    else
      tw.style.transform = "";
    setTimeout(() => {
      tw.remove();
      if (cb)
        cb();
    }, 500);
  };
  //
  if (options.showCloseButton)
    cbtn.onclick = f;
  else
    setTimeout(f, options.duration);
};


/**
 * Shows or hides loading status
 * @param {Object} options
 * @param {Function} cb
 */
Client.IonHelper.setLoading = function (options, cb)
{
  if (!options.id)
    options.id = "std-loading";
  //
  let lo = document.getElementById(options.id);
  let lc, lw, bw, sw;
  if (lo) {
    lc = lo.getElementsByClassName("loading-content")[0];
    lw = lo.getElementsByClassName("loading-wrapper")[0];
    bw = lo.getElementsByTagName("ION-BACKDROP")[0];
    sw = lo.getElementsByTagName("loading-spinner")[0];
  }
  else if (!options.dismiss) {
    Client.IonHelper.loadingPreventDefault = ev => ev.preventDefault();
    document.addEventListener("keydown", Client.IonHelper.loadingPreventDefault);
    document.addEventListener("mousedown", Client.IonHelper.loadingPreventDefault);
    //
    lo = document.createElement("ion-loading");
    lo.className = "loading-cmp";
    lo.id = options.id;
    //
    bw = document.createElement("ion-backdrop");
    bw.tappable = "";
    bw.cbId = options.cbId;
    bw.ontouchmove = ev => ev.preventDefault();
    lo.appendChild(bw);
    //
    lw = document.createElement("div");
    lw.className = "loading-wrapper";
    lw.style.opacity = "0.01";
    lw.style.trasform = "scale(1.1)";
    lw.ontouchmove = ev => ev.preventDefault();
    lo.appendChild(lw);
    //
    if (options.showSpinner !== false) {
      let sp = document.createElement("div");
      sp.className = "loading-spinner";
      sp.innerHTML = Client.IonHelper.createSpinner();
      lw.appendChild(sp);
    }
    //
    lc = document.createElement("div");
    lc.className = "loading-content";
    lw.appendChild(lc);
    //
    let appui = document.getElementById("app-ui");
    appui.appendChild(lo);
    //
    // To enable immediate animation
    let r = lo.offsetTop;
    //
    // Enter transition
    lw.style.transition = "transform 200ms ease-in-out, opacity 200ms ease-in-out";
    lw.style.opacity = "1";
    lw.style.trasform = "scale(1)";
    bw.style.transition = "opacity 200ms ease-in-out";
    if (options.showBackdrop !== false)
      bw.style.opacity = (Client.Ionic.platform === "md") ? "0.5" : "0.3";
  }
  //
  if (!lo) {
    if (cb)
      cb();
    return;
  }
  //
  if (options.style) {
    if (options.style.indexOf(":") > -1)
      lw.style.cssText += options.style;
    else
      lw.classList.add(options.style);
  }
  //
  // Message
  if (options.message)
    lc.innerHTML = options.message;
  //
  // Hide the spinner if shown
  if (options.showSpinner !== undefined && sw)
    sw.style.display = options.showSpinner === false ? "none" : "";
  //
  // Exit transition
  let dismiss = () => {
    lw.style.opacity = "0";
    lw.style.transform = "scale(0.9)";
    bw.style.opacity = "0";
    setTimeout(() => {
      document.removeEventListener("keydown", Client.IonHelper.loadingPreventDefault);
      document.removeEventListener("mousedown", Client.IonHelper.loadingPreventDefault);
      delete Client.IonHelper.loadingPreventDefault;
      //
      lo.remove();
      if (cb)
        cb();
    }, 250);
  };
  //
  if (options.buttons) {
    lw.classList.add("buttons");
    let bg = lo.getElementsByClassName("alert-button-group").length > 0 ? lo.getElementsByClassName("alert-button-group")[0] : document.createElement("div");
    bg.innerHTML = "";
    bg.className = "alert-button-group" + ((options.buttons.length > 2) ? " vertical" : "");
    //
    for (let i = 0; i < options.buttons.length; i++) {
      let btn = options.buttons[i];
      let b = document.createElement("button");
      b.className = "disable-hover alert-button " + ((btn.cssClass) ? "" + btn.cssClass : " alert-button-default" + (btn.destructive ? " alert-button-destructive " : ""));
      b.id = "b" + (btn.id || i);
      let s = document.createElement("span");
      s.className = "button-inner";
      s.textContent = btn.text || btn;
      b.appendChild(s);
      bg.appendChild(b);
      Client.IonHelper.registerClickListener(this, b);
      b.onclick = () => cb(parseInt(this.id.substring(1)));
    }
    lw.appendChild(bg);
  }
  //
  if (options.duration) {
    clearTimeout(lo.tid);
    lo.tid = setTimeout(dismiss, options.duration);
  }
  else if (options.dismiss)
    dismiss();
  else if (cb)
    cb();
};


/**
 * Execute alert command
 * @param {object} options
 * @param {function} cb
 */
Client.IonHelper.createAlert = function (options, cb)
{
  if (!options)
    options = {};
  //
  let f;
  let bf = ev => {
    ev.stopImmediatePropagation();
    f();
  };
  addEventListener("popstate", bf, true);
  //
  let ao = document.createElement("ion-alert");
  ao.className = "alert-cmp";
  ao.tabIndex = 0;
  //
  // I need the id to refer the ion-alert
  options.alertId = "alert-" + Math.ceil(Math.random() * 50000);
  ao.id = options.alertId;
  //
  if (options.style) {
    if (options.style.indexOf(":") > -1)
      ao.style.cssText += options.style;
    else
      ao.classList.add.apply(ao.classList, options.style.split(" "));
  }
  //
  let bw = document.createElement("ion-backdrop");
  bw.cbId = options.cbId;
  bw.tappable = "";
  bw.ontouchmove = ev => ev.preventDefault();
  ao.appendChild(bw);
  //
  let aw = document.createElement("div");
  aw.className = "alert-wrapper";
  aw.style.opacity = "0.01";
  aw.style.transform = "scale(1.1)";
  //
  if (options.rect) {
    aw.style.position = "absolute";
    if (options.rect.top !== undefined)
      aw.style.top = options.rect.top + "px";
    if (options.rect.left !== undefined)
      aw.style.left = options.rect.left + "px";
    if (options.rect.width !== undefined) {
      aw.style.width = options.rect.width + "px";
      aw.style.maxWidth = options.rect.width + "px";
    }
    if (options.rect.height !== undefined)
      aw.style.height = options.rect.height + "px";
    //
    if (options.rect.refId) {
      let dmobj = document.getElementById(options.rect.refId)?.getBoundingClientRect() || {left: 0, top: 0, height: 0};
      aw.style.top = (dmobj.top + dmobj.height) + "px";
      aw.style.left = dmobj.left + "px";
    }
  }
  if (options.maxWidth)
    aw.style.maxWidth = options.maxWidth;
  //
  ao.appendChild(aw);
  aw.ontouchmove = ev => {
    let obj = ev.srcElement;
    let canScroll = false;
    while (obj && obj !== aw && !canScroll) {
      canScroll = obj.scrollHeight > obj.offsetHeight;
      obj = obj.parentNode;
    }
    if (!canScroll)
      ev.preventDefault();
  };
  //
  let ah = document.createElement("div");
  ah.className = "alert-head";
  aw.appendChild(ah);
  //
  if (options.title) {
    let at = document.createElement("h2");
    at.className = "alert-title";
    at.innerHTML = options.title;
    ah.appendChild(at);
  }
  //
  if (options.subtitle) {
    let as = document.createElement("h3");
    as.className = "alert-sub-title";
    as.innerHTML = options.subtitle;
    ah.appendChild(as);
  }
  //
  if (!options.title && !options.subtitle)
    ah.style.display = "none";
  //
  if (options.message) {
    let am = document.createElement("div");
    am.className = "alert-message";
    am.innerHTML = options.message;
    aw.appendChild(am);
  }
  let searchToFocus;
  if (options.canFilter) {
    let filterToolbar = document.createElement("ion-toolbar");
    filterToolbar.className = "toolbar";
    let filterToolbarContent = document.createElement("div");
    filterToolbarContent.className = "toolbar-content";
    //
    filterToolbar.appendChild(filterToolbarContent);
    filterToolbarContent.appendChild(Client.IonHelper.createAlertSearchbar(options));
    aw.appendChild(filterToolbar);
    if (Client.mainFrame.device.type === "desktop")
      searchToFocus = filterToolbar.getElementsByTagName("INPUT")[0];
  }
  //
  ao.actualKeySelection = 0;
  let inputToFocus;
  let buttonToFocus;
  let att;
  let ig, cg, rg;
  let toScroll;
  if (options.inputs) {
    for (let i = 0; i < options.inputs.length; i++) {
      let inp = options.inputs[i];
      //
      // Select group
      if (inp.type === "radio") {
        options.isRadioAlert = true;
        //
        if (!rg) {
          rg = document.createElement("div");
          rg.className = "alert-radio-group";
          if (options.maxHeight)
            rg.style.maxHeight = options.maxHeight;
          aw.appendChild(rg);
        }
        att = rg;
      }
      else if (inp.type === "checkbox") {
        if (!cg) {
          cg = document.createElement("div");
          cg.className = "alert-checkbox-group";
          if (options.maxHeight)
            cg.style.maxHeight = options.maxHeight;
          aw.appendChild(cg);
        }
        att = cg;
      }
      else {
        if (!ig) {
          ig = document.createElement("div");
          ig.className = "alert-input-group";
          if (options.maxHeight)
            ig.style.maxHeight = options.maxHeight;
          aw.appendChild(ig);
        }
        att = ig;
      }
      //
      let wr;
      if (att === ig) {
        wr = document.createElement("div");
        wr.className = "alert-input-wrapper" + (inp.label ? " label" : "") + (inp.class ? " " + inp.class : "");
        //
        if (inp.label) {
          let lb = document.createElement("ion-label");
          lb.className = "label-" + Client.Ionic.platform;
          lb.setAttribute("fixed", "");
          lb.textContent = inp.label;
          wr.appendChild(lb);
        }
        //
        let ie = document.createElement(inp.type === "textarea" ? "textarea" : "input");
        ie.className = "alert-input";
        ie.id = inp.id;
        let inpType = inp.type || "text";
        if (inpType === "textarea") {
          if (inp.rows)
            ie.rows = inp.rows;
        }
        else
          ie.type = inpType;
        //
        if (inp.value)
          ie.value = inp.value;
        if (inp.placeholder)
          ie.placeholder = inp.placeholder;
        if (inp.focus)
          inputToFocus = ie;
        wr.appendChild(ie);
      }
      else {
        wr = document.createElement("button");
        wr.className = "alert-tappable alert-" + inp.type + " disable-hover alert-" + inp.type + "-button alert-" + inp.type + "-button-default";
        wr.id = inp.id;
        if (inp.checked) {
          wr.setAttribute("aria-checked", true);
          if (!toScroll)
            toScroll = wr;
          if (ao.actualKeySelection === 0)
            ao.actualKeySelection = i;
        }
        //
        wr.onclick = ev => {
          if (ev.currentTarget.className.indexOf("radio") > -1) {
            let el = ev.currentTarget.parentNode.getElementsByTagName("BUTTON");
            for (let i = 0; i < el.length; i++)
              el[i].setAttribute("aria-checked", false);
          }
          //
          let c = ev.currentTarget.getAttribute("aria-checked");
          ev.currentTarget.setAttribute("aria-checked", c !== "true");
          //
          Client.IonHelper.hapticFeedback();
          //
          if (!Client.mainFrame.device.isMobile) {
            let blist = ev.currentTarget.parentNode.querySelectorAll("BUTTON:not(.searchbar-clear-icon):not([aria-hidden=true])");
            for (let bl = 0; bl < blist.length; bl++) {
              if (blist[bl] === ev.currentTarget)
                ao.actualKeySelection = bl;
              blist[bl].classList.toggle("ion-alert-key-selected-item", blist[bl] === ev.currentTarget);
            }
          }
          //
          if (inp.type === "radio" && options.clickToAccept) {
            setTimeout(() => {
              let c = bg.getElementsByTagName("BUTTON");
              if (c && c.length)
                c[c.length - 1].click();
            }, 250);
          }
        };
        if (inp.type === "radio" && !options.clickToAccept) {
          wr.ondblclick = ev => {
            let c = bg.getElementsByTagName("BUTTON");
            if (c && c.length)
              c[c.length - 1].click();
          };
        }
        //
        let s = document.createElement("span");
        s.className = "button-inner";
        wr.appendChild(s);
        //
        let ic = document.createElement("div");
        ic.className = "alert-" + inp.type + "-icon";
        s.appendChild(ic);
        //
        let ii = document.createElement("div");
        ii.className = "alert-" + inp.type + "-inner";
        ic.appendChild(ii);
        //
        let l = document.createElement("div");
        l.className = "alert-" + inp.type + "-label";
        l.textContent = inp.label;
        s.appendChild(l);
        //
        if (options.canFilter)
          wr.setAttribute("label", inp.label);
      }
      //
      att.appendChild(wr);
      if (wr.tagName === "BUTTON")
        Client.IonHelper.registerClickListener(this, wr);
    }
    //
    // I have created all the inputs, check if we must handle the keyboard, in
    // that case i must highlit the current selected button
    // -> only if the found buttons are equals to the requested inputs. Is not true if the alert
    //    mixes buttons with inputs.. in that case we don't handle the keyboard navigation
    let blist = att.querySelectorAll("BUTTON:not(.searchbar-clear-icon)");
    if (blist && blist.length > 0 && blist.length === options.inputs.length && !Client.mainFrame.device.isMobile) {
      options.handleKeys = true;
      blist[ao.actualKeySelection].classList.toggle("ion-alert-key-selected-item", true);
    }
  }
  let tooltips = [];
  //
  // Exit transition
  f = ev => {
    removeEventListener("popstate", bf, true);
    let bn = ev ? parseInt(ev.currentTarget.id.substring(1)) : null;
    //
    let t1 = (Client.Ionic.platform === "md" && ev && (ev.x !== 0 || ev.y !== 0)) ? 250 : 0;
    let values;
    if (ig) {
      values = values || {};
      let c = ig.getElementsByTagName("INPUT");
      for (let i = 0; i < c.length; i++)
        values[c[i].id] = c[i].value;
      c = ig.getElementsByTagName("TEXTAREA");
      for (let i = 0; i < c.length; i++)
        values[c[i].id] = c[i].value;
    }
    if (cg) {
      values = values || {};
      let c = cg.getElementsByTagName("BUTTON");
      for (let i = 0; i < c.length; i++)
        values[c[i].id] = c[i].getAttribute("aria-checked") === "true";
    }
    if (rg) {
      values = values || {};
      let c = rg.getElementsByTagName("BUTTON");
      for (let i = 0; i < c.length; i++) {
        if (c[i].getAttribute("aria-checked") === "true")
          values.value = c[i].id;
      }
    }
    setTimeout(() => {
      aw.style.opacity = "0";
      aw.style.transform = "scale(0.9)";
      bw.style.opacity = "0";
    }, t1);
    setTimeout(() => {
      Client.lastActiveElement?.focus();
      ao.remove();
      //
      tooltips.forEach(tp => tp.destroy());
      tooltips = [];
      //
      if (cb)
        cb(bn, values, ev);
    }, 250 + t1);
  };
  //
  if (!options.hardDismiss)
    bw.onclick = () => f();
  //
  let bg;
  if (options.buttons) {
    bg = document.createElement("div");
    bg.className = "alert-button-group" + ((options.buttons.length > 2) ? " vertical" : "");
    //
    for (let i = 0; i < options.buttons.length; i++) {
      let btn = options.buttons[i];
      let b = document.createElement("button");
      b.className = "disable-hover alert-button " + ((btn.cssClass) ? "" + btn.cssClass : " alert-button-default" + (btn.destructive ? " alert-button-destructive " : ""));
      b.id = "b" + (btn.id || i);
      let s = document.createElement("span");
      s.className = "button-inner";
      s.textContent = btn.text || btn;
      //
      if (btn.icon) {
        let ic = document.createElement("ion-icon");
        Client.IonHelper.setIonIcon(btn.icon, ic);
        s.insertBefore(ic, s.firstChild);
      }
      if (btn.tooltip) {
        var opt = {inlinePositioning: true, duration: 100, delay: [750, 100]};
        Object.assign(opt, Client.mainFrame.theme.tippy);
        opt.content = btn.tooltip;
        tooltips.push(tippy(b, opt));
      }
      //
      b.appendChild(s);
      bg.appendChild(b);
      Client.IonHelper.registerClickListener(this, b);
      b.onclick = f;
      if (btn.focus)
        buttonToFocus = b;
      if (btn.defaultClick)
        b.setAttribute("default-click", "true");
    }
    aw.appendChild(bg);
  }
  //
  ao.addEventListener("keydown", ev => {
    delete this.enterKeyDown;
    //
    // skip enter key, because it is used to close the popup
    if ((ev.which === 13 || ev.which === 27) && bg) {
      // Remove the focus from the button/input, the handling will be done by onkeyup
      ao.focus();
      ev.stopPropagation();
      this.enterKeyDown = ev.which === 13;
      return false;
    }
    //
    // Stop handling the arrows, we don't want the cursor of the filter to move
    if (ev.which === 40 || ev.which === 38)
      ev.preventDefault();
    //
    if (options.keydowncallback)
      options.keydowncallback(ev, {ao, tooltips});
  }, true);
  //
  ao.onkeyup = ev => {
    if (options.keyupcallback)
      options.keyupcallback(ev, {ao, tooltips});
    //
    // ESC cancel
    if (ev.which === 27)
      f();
    //
    // ENTER accept
    if (ev.which === 13 && bg && this.enterKeyDown) {
      let c = bg.getElementsByTagName("BUTTON");
      if (c && c.length) {
        let toClickButton;
        //
        // Check if we have a default button to click
        for (let bi = 0; bi < c.length; bi++) {
          if (c[bi].getAttribute("default-click") === "true") {
            toClickButton = c[bi];
            break;
          }
        }
        //
        // No default button? click the last one
        if (!toClickButton)
          toClickButton = c[c.length - 1];
        //
        toClickButton.click();
      }
    }
    delete this.enterKeyDown;
  };
  //
  // For keyboard handling i need the capture phase
  if (options.handleKeys && att) {
    ao.addEventListener("keydown", ev => {
      let k = ev.which;
      //
      // SPACE or ENTER
      // With multiple+canFilter we must handle only CTRL+SPACE, because space
      if ((k === 32 && !(options.canFilter && options.multiple && !ev.crtlKey)) || k === 13) {
        // In radio mode SPACE or ENTER must deselect the others radio
        let blist;
        if (options.isRadioAlert) {
          blist = att.getElementsByTagName("BUTTON");
          for (let bl = 0; bl < blist.length; bl++)
            blist[bl].setAttribute("aria-checked", false);
        }
        //
        // Now we must select the current object
        blist = att.querySelectorAll("BUTTON:not(.searchbar-clear-icon):not([aria-hidden=true])");
        if (blist && blist[ao.actualKeySelection]) {
          // For a radio we must select, for a check we need to toggle
          if (options.isRadioAlert)
            blist[ao.actualKeySelection].setAttribute("aria-checked", true);
          else if (k === 32)
            blist[ao.actualKeySelection].setAttribute("aria-checked", blist[ao.actualKeySelection].getAttribute("aria-checked") === "true" ? false : true);
        }
        //
        // We have handled the space on cheks, stop the standard handling because
        // otherwise the check will uncheck ;)
        if (k === 32 && !options.isRadioAlert)
          ev.preventDefault();
        //
        // CTRL+SPACE in MULTI+CANFILTER selects the item, so we must not write ' ' in the input
        if (k === 32 && options.canFilter && options.multiple && ev.crtlKey) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      }
      //
      // DOWN or UP when the list is open
      if (k === 40 || k === 38) {
        // Get all the visible buttons
        let blist = att.querySelectorAll("BUTTON:not(.searchbar-clear-icon):not([aria-hidden=true])");
        ao.actualKeySelection += k === 40 ? 1 : -1;
        if (ao.actualKeySelection >= blist.length)
          ao.actualKeySelection = blist.length - 1;
        if (ao.actualKeySelection < 0)
          ao.actualKeySelection = 0;
        //
        for (let bl = 0; bl < blist.length; bl++)
          blist[bl].classList.toggle("ion-alert-key-selected-item", bl === ao.actualKeySelection);
        //
        // Scroll if needed to mantain the selection on video
        if (blist.length > 0 && att.scrollTop + att.offsetHeight < blist[ao.actualKeySelection].offsetTop + 50)
          att.scrollTop = blist[ao.actualKeySelection].offsetTop + 50 - att.offsetHeight;
        else if (blist.length > 0 && att.scrollTop > blist[ao.actualKeySelection].offsetTop)
          att.scrollTop = blist[ao.actualKeySelection].offsetTop;
      }
    }, true);
  }
  //
  let appui = document.getElementById("app-ui");
  appui.appendChild(ao);
  Client.lastActiveElement = document.activeElement;
  ao.focus();
  history.pushState("alert", "");
  //
  // To enable immediate transition
  let r = ao.offsetTop;
  //
  // Change position if rect is used and popup is outside
  if (options.rect) {
    let rw = aw.getBoundingClientRect();
    let ro = ao.getBoundingClientRect();
    if (rw.y + rw.height > ro.height) {
      let ny = ro.height - rw.height;
      if (ny < 0) {
        ny = 0;
        aw.style.maxHeight = ro.height + "px";
      }
      aw.style.top = ny + "px";
    }
  }
  //
  //
  // Enter transition
  aw.style.transition = "transform 200ms ease-in-out, opacity 200ms ease-in-out";
  aw.style.opacity = "1";
  aw.style.transform = "scale(1)";
  bw.style.transition = "opacity 200ms ease-in-out";
  bw.style.opacity = (Client.Ionic.platform === "md") ? "0.5" : "0.3";
  //
  toScroll?.scrollIntoView(false);
  //
  setTimeout(() => {
    if (inputToFocus)
      inputToFocus.focus();
    else if (buttonToFocus)
      buttonToFocus.focus();
    else if (searchToFocus)
      searchToFocus.focus();
    else if (bg) {
      let buttons = bg.getElementsByTagName("BUTTON");
      if (buttons.length)
        buttons[buttons.length - 1].focus();
    }
  }, 500);
};


/**
 * Execute alert command
 * @param {string} txt
 */
Client.MainFrame.prototype.alert = function (txt)
{
  let c = {title: "alert", message: txt, buttons: ["Ok"]};
  Client.IonHelper.createAlert(c, () => {
    // This message makes sure that other client will close the popup accordingly
    let e = [{id: "popupBoxReturn", content: {}}];
    this.sendEvents(e);
  });
};


/**
 * Display a confirmation box
 * @param {String} opt - contains the text to display in the confirm box and the callback id
 */
Client.MainFrame.prototype.confirm = function (opt)
{
  let c = {cbId: opt.cbId, title: "confirm", message: opt.txt, buttons: ["Cancel", "Ok"]};
  Client.IonHelper.createAlert(c, r => {
    let e = [{id: "popupBoxReturn", content: {res: r > 0, cbId: opt.cbId}}];
    this.sendEvents(e);
  });
};


/**
 * Display a prompt box
 * @param {Object} opt - contains the text to display in the prompt box and the default input text
 */
Client.MainFrame.prototype.prompt = function (opt)
{
  let c = {cbId: opt.cbId, title: "prompt", message: opt.txt, buttons: ["Cancel", "Ok"], inputs: [{id: "prompt", value: opt.def, type: "text", focus: true}]};
  Client.IonHelper.createAlert(c, (r, values) => {
    let ris = (r > 0) ? values.prompt : "";
    let e = [{id: "popupBoxReturn", content: {res: ris, cbId: opt.cbId}}];
    this.sendEvents(e);
  });
};


/**
 * Execute alert command
 * @param {object} options
 * @param {function} cb
 */
Client.IonHelper.createActionSheet = function (options, cb)
{
  if (!options)
    options = {};
  //
  let f;
  let bf = ev => {
    ev.stopImmediatePropagation();
    f();
  };
  addEventListener("popstate", bf, true);
  //
  let ao = document.createElement("ion-action-sheet");
  ao.className = "action-sheet-cmp";
  ao.tabIndex = 0;
  //
  let bw = document.createElement("ion-backdrop");
  bw.tappable = "";
  bw.cbId = options.cbId;
  bw.ontouchmove = ev => ev.preventDefault();
  ao.appendChild(bw);
  //
  let aw = document.createElement("div");
  aw.className = "action-sheet-wrapper";
  ao.appendChild(aw);
  aw.ontouchmove = ev => ev.preventDefault();
  //
  let ac = document.createElement("div");
  ac.className = "action-sheet-container";
  aw.appendChild(ac);
  //
  let ag = document.createElement("div");
  ag.className = "action-sheet-group";
  ac.appendChild(ag);
  //
  if (options.title) {
    let at = document.createElement("div");
    at.className = "action-sheet-title";
    at.innerHTML = options.title;
    ag.appendChild(at);
  }
  //
  // Is subtitle supported in ionic?
  //if (options.subtitle) {
  //  var as = document.createElement("div");
  //  as.className = "action-sheet-sub-title";
  //  as.innerHTML = options.subtitle;
  //  ag.appendChild(as);
  //}
  //
  // Exit transition
  f = ev => {
    removeEventListener("popstate", bf, true);
    let bn = ev ? parseInt(ev.currentTarget.id.substring(1)) : undefined;
    let t1 = (Client.Ionic.platform === "md" && ev && (ev.x !== 0 || ev.y !== 0)) ? 250 : 0;
    setTimeout(() => {
      aw.style.transform = "";
      bw.style.opacity = "";
    }, t1);
    setTimeout(() => {
      Client.lastActiveElement?.focus();
      ao.remove();
      if (cb)
        cb(bn);
    }, 500 + t1);
  };
  //
  // Buttons
  let cancelGroup;
  if (options.buttons) {
    for (let i = 0; i < options.buttons.length; i++) {
      let btn = options.buttons[i];
      let b = document.createElement("button");
      b.className = "disable-hover " + (btn.destructive ? "action-sheet-destructive " : "") + "action-sheet-button " + ((btn.cssClass) ? "" + btn.cssClass : " action-sheet-button-default");
      b.id = "b" + (btn.id || i);
      Client.IonHelper.registerClickListener(this, b);
      b.onclick = f;
      //
      let s = document.createElement("span");
      s.className = "button-inner";
      //
      // Action sheet icons are supported only in android
      if (btn.icon && Client.Ionic.platform === "md") {
        let ic = document.createElement("ion-icon");
        Client.IonHelper.setIonIcon(btn.icon, ic, "action-sheet-icon");
        s.appendChild(ic);
      }
      //
      let t = document.createTextNode(btn.text || btn);
      s.appendChild(t);
      b.appendChild(s);
      //
      if (btn.cancel) {
        if (!cancelGroup) {
          cancelGroup = document.createElement("div");
          cancelGroup.className = "action-sheet-group";
          ac.appendChild(cancelGroup);
        }
        cancelGroup.appendChild(b);
      }
      else
        ag.appendChild(b);
    }
  }
  //
  bw.onclick = () => {
    if (cancelGroup)
      cancelGroup.getElementsByTagName("BUTTON")[0].click();
    else
      f();
  };
  //
  let appui = document.getElementById("app-ui");
  appui.appendChild(ao);
  Client.lastActiveElement = document.activeElement;
  ao.focus();
  history.pushState("alert", "");
  //
  // To enable immediate transition
  let r = ao.offsetTop;
  //
  // Enter transition
  aw.style.transition = "transform 400ms cubic-bezier(.36,.66,.04,1)";
  aw.style.transform = "translateY(0%)";
  bw.style.transition = "opacity 400ms cubic-bezier(.36,.66,.04,1)";
  bw.style.opacity = (Client.Ionic.platform === "md") ? "0.26" : "0.4";
};


/**
 * Show a menu
 * @param {object} options
 * @param {function} cb
 */
Client.IonHelper.createMenu = function (options, cb)
{
  if (!options)
    options = {};
  //
  let f;
  let bf = ev => {
    ev.stopImmediatePropagation();
    f();
  };
  addEventListener("popstate", bf, true);
  //
  // Use the view passed in the options, if any, or the last view opened
  let view = options.view ? Client.eleMap[options.view] : Client.mainFrame.views[Client.mainFrame.views.length - 1];
  //
  // Create the dialog element
  let exc = "ion-menu" + (options.style ? " " + options.style : "");
  //
  let dialog = new Client.IonModal({options: {autoclose: true, ionmenu: true, extcls: exc,
      cbId: options.cbId, position: options.rect, animation: options.animation,
      ref: {id: options.refObj, whisker: options.whisker, whiskerSize: 14, position: options.position, offset: options.offset}}}, view, view);
  //
  // Detach dialog from view to prevent closing it on exit
  dialog.view = null;
  //
  // Create dialog content
  let inner = dialog.domObj;
  //
  let innerContent = document.createElement("ion-content");
  if (!Client.mainFrame.device.isMobile)
    innerContent.className = "has-scrollbar";
  inner.appendChild(innerContent);
  //
  let scroll = document.createElement("scroll-content");
  scroll.style.marginTop = "0px";
  scroll.style.marginBottom = "0px";
  innerContent.appendChild(scroll);
  //
  let list = document.createElement("ion-list");
  list.style.marginBottom = "0px";
  scroll.appendChild(list);
  //
  // Exit transition
  f = (ev, _clickObj) => {
    let obj = ev.srcElement;
    while (obj && obj.tagName !== "ION-LIST")
      obj = obj.parentNode;
    //
    ev.stopImmediatePropagation();
    //
    // Do not click on a disabled object
    if (!_clickObj && obj)
      return false;
    //
    removeEventListener("popstate", bf, true);
    //
    setTimeout(() => {
      // Pass callback and elemId as parameters because menu popup is closed
      // after a transition and I want callback to be called at the end of that transition
      dialog.close(elemId => {
        if (ev.type === "contextmenu") {
          // Rilancio l'evento all'elemento sottostante
          setTimeout(() => {
            let element = document.elementFromPoint(ev.pageX, ev.pageY);
            if (element)
              element.dispatchEvent(ev);
          }, 10);
        }
        //
        cb(elemId);
      }, _clickObj ? _clickObj.elemId : undefined);
    }, (Client.Ionic.platform === "md" && options.animation !== false) ? 200 : 0);
    //
    return false;
  };
  //
  // Create the menu items
  if (options.items) {
    let myElement = {};
    myElement.myClick = f;
    //
    for (let i = 0; i < options.items.length; i++) {
      let item = options.items[i];
      Client.IonHelper.createMenuItem(item, list, myElement, inner, 0);
    }
  }
  //
  // Click outside the menu close it
  dialog.rootObj.onclick = f;
  dialog.rootObj.oncontextmenu = f;
  //
  // Put the menu in the browser history
  history.pushState("alert", "");
  //
  // Position the menu
  dialog.positionElement();
};


Client.IonHelper.createMenuItem = function (item, list, clickOptions, dialogInner, level)
{
  let button = document.createElement("button");
  button.className = "item";
  button.setAttribute("detail-none", true);
  button.elemId = item.id;
  if (item.disabled)
    button.setAttribute("disabled", true);
  //
  if (item.style) {
    if (item.style.indexOf(":") > -1)
      button.style.cssText += item.style;
    else
      button.classList.add(item.style);
  }
  //
  list.appendChild(button);
  Client.IonHelper.registerClickListener(clickOptions, button);
  //
  // If there is an icon, show it
  if (item.icon) {
    let icon = document.createElement("ion-icon");
    Client.IonHelper.setIonIcon(item.icon, icon);
    icon.setAttribute("item-left", true);
    button.appendChild(icon);
  }
  //
  let itemInner = document.createElement("div");
  itemInner.className = "item-inner";
  button.appendChild(itemInner);
  //
  let itemWrapper = document.createElement("div");
  itemWrapper.className = "input-wrapper";
  itemInner.appendChild(itemWrapper);
  //
  let title = document.createElement("ion-label");
  title.setAttribute("item-left", true);
  itemWrapper.appendChild(title);
  //
  if (item.html)
    title.innerHTML = item.title;
  else {
    let titleText = document.createTextNode(item.title);
    title.appendChild(titleText);
  }
  //
  if (item.subtitle) {
    let subtitle = document.createElement("p");
    subtitle.innerHtml = item.subtitle;
    subtitle.style.fontSize = "9pt";
    title.appendChild(subtitle);
  }
  //
  if (item.tooltip)
    button.setAttribute("title", item.tooltip);
  //
  if (item.children) {
    button.cmdChildren = item.children;
    button.className = "item commandset-child-container commanset-level-" + level;
    button.setAttribute("detail-level", level);
    //
    let subicon = document.createElement("ion-icon");
    subicon.className = "ion-md-play";
    subicon.setAttribute("item-right", true);
    itemWrapper.appendChild(subicon);
    //
    button.onmouseenter = (ev) => {
      let ch = ev.target.cmdChildren;
      let lvl = parseInt(ev.target.getAttribute("detail-level"));
      //
      // Close all the same level menu
      let otherMenus = document.getElementsByClassName("top-menu-sublevel-" + lvl);
      while (otherMenus.length > 0) {
        let listMenu = otherMenus[0];
        listMenu.parentNode.removeChild(listMenu);
      }
      //
      otherMenus = document.getElementsByClassName("top-menu-sublevel-" + (lvl + 1));
      while (otherMenus.length > 0) {
        let listMenu = otherMenus[0];
        listMenu.parentNode.removeChild(listMenu);
      }
      //
      let wrapper = dialogInner.parentNode.parentNode.parentNode;
      let innerList = document.createElement("ion-list");
      innerList.style.marginBottom = "0px";
      wrapper.appendChild(innerList);
      //
      //
      let pos = ev.target.getBoundingClientRect();
      innerList.style.top = pos.top + "px";
      innerList.style.left = pos.right + "px";
      innerList.className = "top-menu-subcontainer top-menu-sublevel-" + lvl;
      innerList.id = ev.target.elemId + "-child-container";
      //
      for (let i = 0; i < ch.length; i++) {
        let chitem = ch[i];
        Client.IonHelper.createMenuItem(chitem, innerList, clickOptions, dialogInner, level + 1);
      }
    };
  }
}


/**
 * Open a standard popup
 * @param {object} cnt
 */
Client.MainFrame.prototype.popup = function (cnt)
{
  let options = cnt.options || {};
  options.cbId = cnt.cbId;
  //
  let callback = (r, values) => {
    let res = r;
    //
    // In case of alert popup, send result in a specific format
    if (options.type === "alert" && values) {
      res = values;
      res.button = r;
    }
    //
    if (options.callback)
      options.callback(res);
    //
    let e = [{id: "popupBoxReturn", content: {res, cbId: cnt.cbId}}];
    this.sendEvents(e);
  };
  //
  switch (options.type) {
    case "alert":
      Client.IonHelper.createAlert(options, callback);
      break;

    case "actionsheet":
      Client.IonHelper.createActionSheet(options, callback);
      break;

    case "loading":
      Client.IonHelper.setLoading(options, callback);
      break;

    case "toast":
      Client.IonHelper.createToast(options, callback);
      break;

    case "menu":
      Client.IonHelper.createMenu(options, callback);
      break;

    default:
      // The standard implementation does nothing and returns undefined
      if (cnt.cbId)
        callback();
      break;
  }
};


/**
 * Returns true if the object is an ionic input object
 * @param {Element} obj
 */
Client.IonHelper.isInput = function (obj)
{
  if (Client.IonInput && obj instanceof Client.IonInput)
    return true;
  if (Client.IonAutoComplete && obj instanceof Client.IonAutoComplete)
    return true;
  if (Client.IonSelect && obj instanceof Client.IonSelect)
    return true;
  if (Client.IonDateTime && obj instanceof Client.IonDateTime)
    return true;
  if (Client.IonToggle && obj instanceof Client.IonToggle)
    return true;
  if (Client.IonRadio && obj instanceof Client.IonRadio)
    return true;
  if (Client.IonCheckbox && obj instanceof Client.IonCheckbox)
    return true;
};


/**
 * Get the layer to resize
 * @param {Object} inputele
 */
Client.IonHelper.findLayer = function (inputele)
{
  var obj = inputele;
  var ctx;
  while (obj) {
    if (obj.tagName === "ION-ALERT" || obj.tagName === "ION-MODAL") {
      ctx = obj;
      break;
    }
    if (obj.tagName === "ION-PAGE") {
      ctx = obj;
      break;
    }
    obj = obj.parentNode;
  }
  return ctx;
};


/**
 * Get the layer to resize
 * @param {Object} inputele
 */
Client.IonHelper.findContent = function (inputele)
{
  var obj = inputele;
  var ctx;
  while (obj) {
    if (obj.tagName === "SCROLL-CONTENT") {
      ctx = obj;
      break;
    }
    obj = obj.parentNode;
  }
  return ctx;
};


/**
 * Get the footer height
 */
Client.IonHelper.getFooterHeight = function (layer)
{
  var fe = layer.getElementsByTagName("ION-FOOTER")[0];
  if (fe && fe.style.position !== "fixed") {
    var b = fe.getBoundingClientRect();
    return b.height;
  }
};


/**
 * Trigger content recalculation
 * @param {Object} tag
 */
Client.IonHelper.triggerPositionContent = function (tag)
{
  if (!tag || !tag.id)
    return;
  //
  var ele = Client.eleMap[tag.id];
  //
  if (!ele || !ele.elements)
    return;
  //
  var go = true;
  while (go) {
    go = false;
    for (var i = 0; i < ele.ne(); i++) {
      var c = ele.elements[i];
      if (c instanceof Client.IonContent)
        c.positionContent();
      if (c instanceof Client.IonPage) {
        ele = c;
        go = true;
      }
    }
  }
};


/**
 * Keyboard changed... reset scroll list?
 * @param {bool} flag
 * @param {int} keybH - optional, keyboard height
 */
Client.IonHelper.onChangeKeyboardVisibility = function (flag, keybH)
{
  // Set or remove class
  var appui = document.getElementById("app-ui");
  appui.classList.toggle("keyboard-open", flag);
  //
  var th = Client.IonHelper;
  var kh = keybH || Client.mainFrame.device.keyboardHeight;
  //
  // Keyboard handling shoould occur only on iOS or if keybH is explicitly set
  if (!keybH && Client.mainFrame.device.operatingSystem !== "ios") {
    //
    // Android has a problem with blurring the active element on keyboard close
    if (!flag && document.activeElement && (document.activeElement.type !== "date" && document.activeElement.type !== "datetime-local")) {
      var tm = Client.mainFrame.theme["keyblurtime"];
      //
      if (!tm || tm === 0) {
        document.activeElement.blur();
      }
      else {
        // Use a timer and do the blur after user set time.
        // If the keyboard reopens in that timeframe clear the timer.
        // This to handle the 'listener keyboard' that closes the current keyboard and opens a new speech listener keyboard
        var actx = document.activeElement;
        if (this.blurringTimer)
          window.clearTimeout(this.blurringTimer);
        this.blurringTimer = window.setTimeout(function () {
          actx.blur();
          delete this.blurringTimer;
        }.bind(this), tm);
      }
    }
    if (flag && this.blurringTimer) {
      window.clearTimeout(this.blurringTimer);
      delete this.blurringTimer;
    }
    //
    // No full screen? android will resize by itself
    if (window.innerHeight !== screen.height && window.innerHeight !== screen.width) {
      //
      // In any case we need to recalc bottom margin because of a bottom tabbar or a fixed footer
      if (flag) {
        th.scrollLayer = th.findLayer(document.activeElement);
        th.triggerPositionContent(th.scrollLayer);
      }
      else {
        var sc = th.scrollLayer;
        th.scrollLayer = undefined;
        setTimeout(function () {
          th.triggerPositionContent(sc);
        }, 200);
      }
      return;
    }
  }
  //
  if (flag) {
    if (th.scrollLayer) {
      // keyboard was already open, maybe it has changed its height
      var delta = kh - th.keyboardHeight;
      if (delta !== 0) {
        var b = parseInt(th.scrollLayer.style.bottom);
        th.scrollLayer.style.transition = "none";
        th.scrollLayer.style.bottom = (b + delta) + "px";
        setTimeout(function () {
          th.scrollLayer.style.transition = "";
        }, 20);
        th.keyboardHeight = kh;
      }
      return;
    }
    //
    // Keyboard opened
    document.body.classList.add("kb-open");
    var re = document.activeElement.getBoundingClientRect().bottom;
    var rb = document.body.getBoundingClientRect().bottom;
    var footerHeight = 0;
    //
    // First: we must change the bottom,so the scroll will be calculated well.
    // initially we changed the scroll and next the bottom, but the bottom could change the scroll so
    // the element could be hidden
    th.scrollLayer = th.findLayer(document.activeElement);
    if (th.scrollLayer) {
      // Keyboard opened: recalc bottom margin to handle bottom tabbars and fixed footers
      th.triggerPositionContent(th.scrollLayer);
      //
      // Shrink the page up to make room for the keyboard
      var rc = th.scrollLayer.getBoundingClientRect().bottom;
      //
      // The keyboard was opened <200ms after has been closed, in this case some numbers doesn't add up, such
      // the bottom. We can use the height of the body to compensate
      if (this.closingTimeut) {
        clearTimeout(this.closingTimeut);
        delete this.closingTimeut;
        rc = document.body.offsetHeight;
      }
      th.scrollLayer.style.bottom = rb !== (rc ? (kh - (rb - rc)) : 0) + "px";
      th.keyboardHeight = kh;
      //
      footerHeight = th.getFooterHeight(th.scrollLayer);
    }
    //
    var amount = kh + footerHeight - (rb - re - 10);
    if (amount > 0) {
      //
      var sc = th.findContent(document.activeElement);
      //
      if (sc) {
        var r = new Tweenable();
        var config = {
          from: {height: sc.scrollTop},
          to: {height: sc.scrollTop + amount},
          duration: 400,
          easing: "easeOutQuart",
          step: function (state) {
            sc.scrollTop = state.height;
          }
        };
        r.tween(config);
        th.scrollLayerContent = sc;
      }
    }
  }
  else {
    // Keyboard closed: recalc bottom margin to handle bottom tabbars and fixed footers
    var sc = th.scrollLayer;
    var scc = th.scrollLayerContent;
    document.body.classList.remove("kb-open");
    th.scrollLayer = undefined;
    th.keyboardHeight = undefined;
    th.scrollLayerContent = undefined;
    if (sc) {
      var tp = scc ? scc.scrollTop : 0;
      //
      // Un-shrink the page
      // Temporarly remove the transition, the visual effect is no-good
      sc.style.transition = "unset";
      sc.style.bottom = "";
      sc.style.transition = "";
      //
      // The bottom changes the scrolltop, so we restore the value
      if (scc)
        scc.scrollTop = tp;
      //
      this.closingTimeut = setTimeout(function () {
        delete th.closingTimeut;
        th.triggerPositionContent(sc);
      }, 200);
    }
    //
    // IOS 14 has a problem with blurring the active element on keyboard close
    if (document.activeElement)
      document.activeElement.blur();
  }
};

Client.mainFrame.device.onChangeKeyboardVisibility = Client.IonHelper.onChangeKeyboardVisibility;


/**
 * Returns true if the toolbar needs a padding class
 * @param {element} obj
 */
Client.IonHelper.needsPadding = function (obj)
{
  var ris = ((window.innerHeight === screen.height || window.innerHeight === screen.width));
  if (ris) {
    var el = obj.domObj, offsetTop = 0;
    do {
      offsetTop += el.offsetTop;
      el = el.offsetParent;
    } while (el);
    if (offsetTop > 20)
      ris = false;
  }
  return ris;
};


/**
 * Return theme color, considering dark / light mode
 */
Client.IonHelper.getThemeColor = function (colorName)
{
  var c = Client.mainFrame.theme[colorName];
  var dm = false;
  //
  if (Client.mainFrame.theme.darkMode === "true" || Client.mainFrame.theme.darkMode === true)
    dm = true;
  else if (Client.mainFrame.theme.darkMode === "auto") {
    var appui = document.getElementById("app-ui");
    dm = appui.classList.contains("dark-mode");
  }
  //
  if (dm) {
    var dc = Client.mainFrame.theme["dark" + colorName.substring(0, 1).toUpperCase() + colorName.substring(1)];
    if (dc) {
      c = dc;
    }
    else {
      if (!c) {
        var colors = {
          primary: "#387EF5",
          secondary: "#32DB64",
          danger: "#F53D3D",
          light: "#F4F4F4",
          dark: "#222222",
          bright: "#FFC125",
          vibrant: "#663399",
          focus: "#3d81f8"
        };
        c = colors[colorName];
      }
      var perc = (Client.mainFrame.theme.darkPercent !== undefined) ? parseFloat(Client.mainFrame.theme.darkPercent) : 0.30;
      c = Client.IonHelper.shadeRGBColor(c, perc);
    }
  }
  //
  return c;
};


/**
 * set the defaults
 */
Client.IonHelper.defaultThemeColors = {
  "primaryEx": "#387EF5",
  "primary": "rgb(56, 126, 245)",
  "primaryShade1": "rgb(53, 120, 233)",
  "primaryShade2": "rgb(52, 116, 225)",
  "primaryShade3": "rgb(12, 96, 238)",
  //
  "secondaryEx": "#32DB64",
  "secondary": "rgb(50, 219, 100)",
  "secondaryShade1": "rgb(48, 208, 95)",
  "secondaryShade2": "rgb(46, 201, 92)",
  "secondaryShade3": "rgb(33, 185, 78)",
  //
  "dangerEx": "#F53D3D",
  "danger": "rgb(245, 61, 61)",
  "dangerShade1": "rgb(233, 58, 58)",
  "dangerShade2": "rgb(225, 56, 56)",
  "dangerShade3": "rgb(243, 13, 13)",
  //
  "lightEx": "#F4F4F4",
  "light": "rgb(244, 244, 244)",
  "lightShade1": "rgb(232, 232, 232)",
  "lightShade2": "rgb(224, 224, 224)",
  "lightShade3": "rgb(219, 219, 219)",
  //
  "darkEx": "#222222",
  "dark": "rgb(34, 34, 34)",
  "darkShade1": "rgb(45, 45, 45)",
  "darkShade2": "rgb(52, 52, 52)",
  "darkShade3": "rgb(9, 9, 9)",
  //
  "brightEx": "#FFC125",
  "bright": "rgb(255, 193, 37)",
  "brightShade1": "rgb(242, 183, 35)",
  "brightShade2": "rgb(235, 178, 34)",
  "brightShade3": "rgb(241, 172, 0)",
  //
  "vibrantEx": "#663399",
  "vibrantName": "rebeccapurple",
  "vibrant": "rgb(102, 51, 153)",
  "vibrantShade1": "rgb(110, 61, 158)",
  "vibrantShade2": "rgb(114, 67, 161)",
  "vibrantShade3": "rgb(77, 38, 115)",
  //
  "focusEx": "#3d81f8",
  "focus": "rgb(61, 129, 248)",
  "focusShade1": "rgb(232, 237, 248)"
};

/**
 * Update the ionic colors with the ones defined in the theme
 */
Client.IonHelper.updateCssRules = function ()
{
  if (this.cssUpdated)
    return;
  //
  if (!Client.mainFrame.theme) {
    console.error("Client theme not found");
    return;
  }
  //
  this.cssUpdated = true;
  this.cssRulesUpdated = [];
  //
  var colorsMap = {};
  var cc;
  cc = Client.IonHelper.getThemeColor("primary");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.primaryEx && cc !== Client.IonHelper.defaultThemeColors.primary)
  {
    colorsMap[Client.IonHelper.defaultThemeColors.primary] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.primaryShade1] = Client.IonHelper.shadeRGBColor(cc, -0.05);
    colorsMap[Client.IonHelper.defaultThemeColors.primaryShade2] = Client.IonHelper.shadeRGBColor(cc, -0.1);
    colorsMap[Client.IonHelper.defaultThemeColors.primaryShade3] = Client.IonHelper.shadeRGBColor(cc, -0.2);
  }
  cc = Client.IonHelper.getThemeColor("secondary");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.secondaryEx && cc !== Client.IonHelper.defaultThemeColors.secondary)
  {
    colorsMap[Client.IonHelper.defaultThemeColors.secondary] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.secondaryShade1] = Client.IonHelper.shadeRGBColor(cc, -0.05);
    colorsMap[Client.IonHelper.defaultThemeColors.secondaryShade2] = Client.IonHelper.shadeRGBColor(cc, -0.1);
    colorsMap[Client.IonHelper.defaultThemeColors.secondaryShade3] = Client.IonHelper.shadeRGBColor(cc, -0.2);
  }
  cc = Client.IonHelper.getThemeColor("danger");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.dangerEx && cc !== Client.IonHelper.defaultThemeColors.danger)
  {
    colorsMap[Client.IonHelper.defaultThemeColors.danger] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.dangerShade1] = Client.IonHelper.shadeRGBColor(cc, -0.05);
    colorsMap[Client.IonHelper.defaultThemeColors.dangerShade2] = Client.IonHelper.shadeRGBColor(cc, -0.1);
    colorsMap[Client.IonHelper.defaultThemeColors.dangerShade3] = Client.IonHelper.shadeRGBColor(cc, -0.2);
  }
  cc = Client.IonHelper.getThemeColor("light");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.lightEx && cc !== Client.IonHelper.defaultThemeColors.light)
  {
    colorsMap[Client.IonHelper.defaultThemeColors.light] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.lightShade1] = Client.IonHelper.shadeRGBColor(cc, -0.05);
    colorsMap[Client.IonHelper.defaultThemeColors.lightShade2] = Client.IonHelper.shadeRGBColor(cc, -0.1);
    colorsMap[Client.IonHelper.defaultThemeColors.lightShade3] = Client.IonHelper.shadeRGBColor(cc, -0.2);
  }
  cc = Client.IonHelper.getThemeColor("dark");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.darkEx && cc !== Client.IonHelper.defaultThemeColors.dark)
  {
    colorsMap[Client.IonHelper.defaultThemeColors.dark] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.darkShade1] = Client.IonHelper.shadeRGBColor(cc, 0.05);
    colorsMap[Client.IonHelper.defaultThemeColors.darkShade2] = Client.IonHelper.shadeRGBColor(cc, 0.1);
    colorsMap[Client.IonHelper.defaultThemeColors.darkShade3] = Client.IonHelper.shadeRGBColor(cc, 0.2);
  }
  cc = Client.IonHelper.getThemeColor("bright");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.brightEx && cc !== Client.IonHelper.defaultThemeColors.bright)
  {
    colorsMap[Client.IonHelper.defaultThemeColors.bright] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.brightShade1] = Client.IonHelper.shadeRGBColor(cc, -0.05);
    colorsMap[Client.IonHelper.defaultThemeColors.brightShade2] = Client.IonHelper.shadeRGBColor(cc, -0.1);
    colorsMap[Client.IonHelper.defaultThemeColors.brightShade3] = Client.IonHelper.shadeRGBColor(cc, -0.2);
  }
  cc = Client.IonHelper.getThemeColor("vibrant");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.vibrantEx && cc !== Client.IonHelper.defaultThemeColors.vibrant && cc !== Client.IonHelper.defaultThemeColors.vibrantName)
  {
    colorsMap[Client.IonHelper.defaultThemeColors.vibrant] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.vibrantName] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.vibrantShade1] = Client.IonHelper.shadeRGBColor(cc, 0.05);
    colorsMap[Client.IonHelper.defaultThemeColors.vibrantShade2] = Client.IonHelper.shadeRGBColor(cc, 0.1);
    colorsMap[Client.IonHelper.defaultThemeColors.vibrantShade3] = Client.IonHelper.shadeRGBColor(cc, 0.2);
  }
  cc = Client.IonHelper.getThemeColor("focus");
  if (cc && cc !== Client.IonHelper.defaultThemeColors.focusEx && cc !== Client.IonHelper.defaultThemeColors.focus) {
    colorsMap[Client.IonHelper.defaultThemeColors.focus] = cc;
    colorsMap[Client.IonHelper.defaultThemeColors.focusShade1] = Client.IonHelper.shadeRGBColor(cc, -0.2);
  }
  //
  // If no color has changed there is nothing to do
  if (Object.keys(colorsMap).length === 0)
    return;
  //
  // Update css rules
  var cssUpdated = false;
  var jsonRules = ""; // "return [";
  for (var i = 0; i < document.styleSheets.length; i++)
  {
    try {
      var cs = "";
      if (document.styleSheets[i]["rules"])
        cs = "rules";
      if (document.styleSheets[i]["cssRules"])
        cs = "cssRules";
      var ar = document.styleSheets[i][cs];
      if (!ar || Client.mainFrame.theme.simulateBulkCSSUpdate === "true")
        continue;
      //
      // Look to see if we need to update ionic CSS
      if (document.styleSheets[i].href && document.styleSheets[i].href.indexOf("ionic") > 0)
        cssUpdated = true;
      //
      for (var j = 0; j < ar.length; j++)
      {
        // Just the rules containing STYLE
        var ru = ar[j];
        if (!ru.style)
          continue;
        //
        var keys = Object.keys(colorsMap);
        var s = ru.style.cssText;
        var ns = s;
        for (var k = 0; k < keys.length; k++)
        {
          var oldValue = keys[k].replace("(", "\\(").replace(")", "\\)");
          var re = new RegExp(oldValue, 'g');
          ns = ns.replace(re, colorsMap[keys[k]]);
        }
        //
        if (s !== ns) {
          this.cssRulesUpdated.push({rule: ru.style, text: ru.style.cssText});
          ru.style.cssText = ns;
          if (jsonRules) {
            var ars = s.split(";");
            var arns = ns.split(";");
            var arnew = [];
            for (var i = 0; i < ars.length; i++) {
              if (ars[i] !== arns[i])
                arnew.push(ars[i]);
            }
            var nrs = ru.selectorText + " {" + arnew.join(";") + ";}";
            nrs = nrs.replace(/"/g, "\\\"");
            jsonRules += "\n\"" + nrs + "\",";
          }
        }
      }
    }
    catch (ex) {
    }
  }
  if (jsonRules) {
    jsonRules += "\n];";
    console.log(jsonRules);
  }
  //
  if (!cssUpdated && Client.Ionic.platform === "ios") {
    var keys = Object.keys(colorsMap);
    var ar = this.bulkCSSUpdateIOS();
    var cnt = 0;
    var newCSS = "";
    for (var i = 0; i < ar.length; i++) {
      var s = ar[i];
      var ns = s;
      for (var k = 0; k < keys.length; k++) {
        var oldValue = keys[k].replace("(", "\\(").replace(")", "\\)");
        var re = new RegExp(oldValue, 'g');
        ns = ns.replace(re, colorsMap[keys[k]]);
      }
      if (s !== ns) {
        newCSS += ns + "\n";
        cnt++;
      }
    }
    //
    ar = this.bulkCSSUpdateExtra();
    for (i = 0; i < ar.length; i++) {
      newCSS += ar[i] + "\n";
    }
    //
    // Place it!
    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(newCSS));
    //
    var stylec = document.getElementsByTagName("style");
    if (stylec.length > 0)
      head.insertBefore(style, stylec[stylec.length - 1]);
    else
      head.appendChild(style);
    this.cssRulesAddedStyle = style;
    console.warn("CSS bulk updated - " + cnt + " rules");
  }
};


/**
 * Make a color lighter or darker
 * @param {type} color
 * @param {type} percent
 * @returns {String}
 */
Client.IonHelper.shadeRGBColor = function (color, percent)
{
  if (color.indexOf("#") === 0) {
    var f = parseInt(color.slice(1), 16);
    var t = percent < 0 ? 0 : 255;
    var p = percent < 0 ? percent * -1 : percent;
    var r = f >> 16;
    var g = f >> 8 & 0x00FF;
    var b = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - r) * p) + r) * 0x10000 + (Math.round((t - g) * p) + g) * 0x100 + (Math.round((t - b) * p) + b)).toString(16).slice(1);
  }
  else {
    var f = color.split(",");
    var t = percent < 0 ? 0 : 255;
    var p = percent < 0 ? percent * -1 : percent;
    var r = parseInt(f[0].slice(4));
    var g = parseInt(f[1]);
    var b = parseInt(f[2]);
    return "rgb(" + (Math.round((t - r) * p) + r) + "," + (Math.round((t - g) * p) + g) + "," + (Math.round((t - b) * p) + b) + ")";
  }
};


/**
 * Return the ionic spinner html
 * @returns {String}
 */
Client.IonHelper.createSpinner = function ()
{
  var spinnerHtml = "";
  if (Client.Ionic.platform === "md")
    spinnerHtml = '<ion-spinner class="spinner-crescent"><svg viewBox="0 0 64 64" style="animation-duration: 750ms;"><circle transform="translate(32,32)" r="26"></circle></svg></ion-spinner>';
  else
    spinnerHtml = '<ion-spinner class="spinner-ios"><svg viewBox="0 0 64 64" style="transform: rotate(180deg); animation-delay: -1000ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(210deg); animation-delay: -916.667ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(240deg); animation-delay: -833.333ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(270deg); animation-delay: -750ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(300deg); animation-delay: -666.667ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(330deg); animation-delay: -583.333ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(0deg); animation-delay: -500ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(30deg); animation-delay: -416.667ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(60deg); animation-delay: -333.333ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(90deg); animation-delay: -250ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(120deg); animation-delay: -166.667ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg><svg viewBox="0 0 64 64" style="transform: rotate(150deg); animation-delay: -83.3333ms; animation-duration: 1000ms;">' +
            '<line transform="translate(32,32)" y1="17" y2="29"></line>' +
            '</svg></ion-spinner>';
  return spinnerHtml;
};


/**
 * Send an haptic feedback
 * @param {object} options
 */
Client.IonHelper.hapticFeedback = function (options)
{
  if (!Client.mainFrame.theme || !Client.mainFrame.theme.haptic)
    return;
  //
  if (!options)
    options = {};
  //
  var type = options.type || "";
  var style = options.style;
  //
  switch (type) {
    case ">m":
      type = (Client.Ionic.platform === "ios" ? "impact" : "virtualkey");
      style = "light";
      break;

    case "":
      type = (Client.Ionic.platform === "ios" ? "selection" : "acoustic");
      break;

    case "gestureSelection":
      if (style === "changed" && Client.Ionic.platform !== "ios") {
        type = "acoustic";
      }
      break;
  }
  //
  Client.mainFrame.device.processRequest({obj: "device-haptic", id: "feedback", cnt: {type: type, style: style}});
};


/**
 * Return an ionic searchbar to be embedded into an Alert
 * @param {object} options
 * @returns {String}
 */
Client.IonHelper.createAlertSearchbar = function (options)
{
  var searchObj = document.createElement("ion-searchbar");
  //
  var searchContainer = document.createElement("div");
  searchContainer.className = "searchbar-input-container";
  searchObj.appendChild(searchContainer);
  //
  var searchIcon = document.createElement("div");
  searchIcon.className = "searchbar-search-icon";
  searchIcon.style.marginLeft = "0px";
  searchContainer.appendChild(searchIcon);
  //
  var inputObj = document.createElement("input");
  inputObj.type = "text";
  inputObj.className = "searchbar-input";
  inputObj.placeholder = options.filterText ? options.filterText : "Search";
  inputObj.onkeyup = function (ev) {
    if (ev.which === 13) {
      inputObj.blur();
    }
  };
  //
  inputObj.addEventListener("focus", function (ev) {
    searchObj.classList.add("searchbar-has-focus");
    //
    // When focusing the alert fix the height of the resultlist, so when filtering the list doesn't move
    var items = document.getElementsByClassName("alert-radio-group");
    if (!items || items.length === 0)
      items = document.getElementsByClassName("alert-checkbox-group");
    if (!items || items.length === 0)
      return;
    //
    items[0].style.height = items[0].offsetHeight + "px";
    items[0].style.width = items[0].offsetWidth + "px";
  });
  //
  inputObj.addEventListener("blur", function (ev) {
    searchObj.classList.remove("searchbar-has-focus");
  });
  //
  var onInputFunction = function (ev) {
    if (inputObj.value)
      searchObj.classList.add("searchbar-has-value");
    else
      searchObj.classList.remove("searchbar-has-value");
    //
    var ao = options.handleKeys ? document.getElementById(options.alertId) : null;
    //
    // Filter items
    var items = document.getElementsByClassName("alert-radio");
    if (!items || items.length === 0)
      items = document.getElementsByClassName("alert-checkbox");
    if (!items || items.length === 0)
      return;
    //
    if (ao)
      ao.actualKeySelection = 0;
    var search = inputObj.value;
    var nvis = 0;
    var searchMode = 0;   // 0-StartWith, 1-WordBegin, 2-FullContent
    while (searchMode < 3) {
      for (var it = 0; it < items.length; it++) {
        var item = items[it];
        var matches = Client.IonHelper.itemMatches(item.getAttribute("label"), search, searchMode);
        item.style.display = matches ? "" : "none";
        if (ao) {
          item.setAttribute("aria-hidden", !matches ? "true" : "");
          item.classList.toggle("ion-alert-key-selected-item", matches && nvis === 0);
        }
        if (matches)
          nvis++;
      }
      //
      // If i found something stop trying
      if (nvis > 0)
        break;
      //
      // Next mode
      searchMode++;
    }
  };
  //
  inputObj.addEventListener("input", onInputFunction);
  searchContainer.appendChild(inputObj);
  //
  var clearObj = document.createElement("button");
  clearObj.className = "searchbar-clear-icon disable-hover button button-clear";
  clearObj.addEventListener("mousedown", (function (ev) {
    inputObj.value = "";
    onInputFunction();
    ev.stopPropagation();
    return false;
  }).bind(this), true);
  clearObj.addEventListener("touchstart", (function (ev) {
    inputObj.value = "";
    onInputFunction();
    ev.stopPropagation();
    return false;
  }).bind(this), true);
  searchContainer.appendChild(clearObj);
  //
  return searchObj;
};


/**
 * Check if a text matches a label string using a specified search mode
 * @param {String} label label to check
 * @param {String} text text that can match
 * @param {Int} searchMode 0-StartWith, 1-WordBegin, 2-FullContent
 */
Client.IonHelper.itemMatches = function (label, text, searchMode)
{
  if (!label)
    label = "";
  if (!text)
    text = "";
  //
  // No text, it matches!
  if (text === "")
    return true;
  //
  var match = false;
  switch (searchMode) {
    case 0: // Start With
      match = (label.toLowerCase().indexOf(text.toLowerCase()) === 0);
      break;

    case 1: // Word match
      var pos = label.toLowerCase().indexOf(' ' + text.toLowerCase());
      match = (pos !== -1);
      break;

    case 2: // Full content search
      var pos = label.toLowerCase().indexOf(text.toLowerCase());
      match = (pos !== -1);
      break;
  }
  //
  return match;
};


/**
 * Returns all css rules to update
 */
Client.IonHelper.bulkCSSUpdateIOS = function ()
{
  return [
    ".spinner-ios-secondary.spinner-ios line, .spinner-ios-secondary.spinner-ios-small line, .spinner-ios-secondary.spinner-crescent circle {stroke: rgb(50, 219, 100);}",
    ".spinner-ios-secondary.spinner-bubbles circle, .spinner-ios-secondary.spinner-circles circle, .spinner-ios-secondary.spinner-dots circle {fill: rgb(50, 219, 100);}",
    ".spinner-ios-danger.spinner-ios line, .spinner-ios-danger.spinner-ios-small line, .spinner-ios-danger.spinner-crescent circle {stroke: rgb(245, 61, 61);}",
    ".spinner-ios-danger.spinner-bubbles circle, .spinner-ios-danger.spinner-circles circle, .spinner-ios-danger.spinner-dots circle {fill: rgb(245, 61, 61);}",
    ".spinner-ios-light.spinner-ios line, .spinner-ios-light.spinner-ios-small line, .spinner-ios-light.spinner-crescent circle {stroke: rgb(244, 244, 244);}",
    ".spinner-ios-light.spinner-bubbles circle, .spinner-ios-light.spinner-circles circle, .spinner-ios-light.spinner-dots circle {fill: rgb(244, 244, 244);}",
    ".spinner-ios-dark.spinner-ios line, .spinner-ios-dark.spinner-ios-small line, .spinner-ios-dark.spinner-crescent circle {stroke: rgb(34, 34, 34);}",
    ".spinner-ios-dark.spinner-bubbles circle, .spinner-ios-dark.spinner-circles circle, .spinner-ios-dark.spinner-dots circle {fill: rgb(34, 34, 34);}",
    ".spinner-ios-bright.spinner-ios line, .spinner-ios-bright.spinner-ios-small line, .spinner-ios-bright.spinner-crescent circle {stroke: rgb(255, 193, 37);}",
    ".spinner-ios-bright.spinner-bubbles circle, .spinner-ios-bright.spinner-circles circle, .spinner-ios-bright.spinner-dots circle {fill: rgb(255, 193, 37);}",
    ".spinner-md-secondary.spinner-ios line, .spinner-md-secondary.spinner-ios-small line, .spinner-md-secondary.spinner-crescent circle {stroke: rgb(50, 219, 100);}",
    ".spinner-md-secondary.spinner-bubbles circle, .spinner-md-secondary.spinner-circles circle, .spinner-md-secondary.spinner-dots circle {fill: rgb(50, 219, 100);}",
    ".spinner-md-danger.spinner-ios line, .spinner-md-danger.spinner-ios-small line, .spinner-md-danger.spinner-crescent circle {stroke: rgb(245, 61, 61);}",
    ".spinner-md-danger.spinner-bubbles circle, .spinner-md-danger.spinner-circles circle, .spinner-md-danger.spinner-dots circle {fill: rgb(245, 61, 61);}",
    ".spinner-md-light.spinner-ios line, .spinner-md-light.spinner-ios-small line, .spinner-md-light.spinner-crescent circle {stroke: rgb(244, 244, 244);}",
    ".spinner-md-light.spinner-bubbles circle, .spinner-md-light.spinner-circles circle, .spinner-md-light.spinner-dots circle {fill: rgb(244, 244, 244);}",
    ".spinner-md-dark.spinner-ios line, .spinner-md-dark.spinner-ios-small line, .spinner-md-dark.spinner-crescent circle {stroke: rgb(34, 34, 34);}",
    ".spinner-md-dark.spinner-bubbles circle, .spinner-md-dark.spinner-circles circle, .spinner-md-dark.spinner-dots circle {fill: rgb(34, 34, 34);}",
    ".spinner-md-bright.spinner-ios line, .spinner-md-bright.spinner-ios-small line, .spinner-md-bright.spinner-crescent circle {stroke: rgb(255, 193, 37);}",
    ".spinner-md-bright.spinner-bubbles circle, .spinner-md-bright.spinner-circles circle, .spinner-md-bright.spinner-dots circle {fill: rgb(255, 193, 37);}",
    "a {color: rgb(56, 126, 245);}",
    "h1[primary], h2[primary], h3[primary], h4[primary], h5[primary], h6[primary], p[primary], span[primary], a:not([button])[primary], small[primary], b[primary], i[primary], strong[primary], em[primary], sub[primary], sup[primary], ion-icon[primary] {color: rgb(56, 126, 245);}",
    "h1[secondary], h2[secondary], h3[secondary], h4[secondary], h5[secondary], h6[secondary], p[secondary], span[secondary], a:not([button])[secondary], small[secondary], b[secondary], i[secondary], strong[secondary], em[secondary], sub[secondary], sup[secondary], ion-icon[secondary] {color: rgb(50, 219, 100);}",
    "h1[danger], h2[danger], h3[danger], h4[danger], h5[danger], h6[danger], p[danger], span[danger], a:not([button])[danger], small[danger], b[danger], i[danger], strong[danger], em[danger], sub[danger], sup[danger], ion-icon[danger] {color: rgb(245, 61, 61);}",
    "h1[light], h2[light], h3[light], h4[light], h5[light], h6[light], p[light], span[light], a:not([button])[light], small[light], b[light], i[light], strong[light], em[light], sub[light], sup[light], ion-icon[light] {color: rgb(244, 244, 244);}",
    "h1[dark], h2[dark], h3[dark], h4[dark], h5[dark], h6[dark], p[dark], span[dark], a:not([button])[dark], small[dark], b[dark], i[dark], strong[dark], em[dark], sub[dark], sup[dark], ion-icon[dark] {color: rgb(34, 34, 34);}",
    "h1[vibrant], h2[vibrant], h3[vibrant], h4[vibrant], h5[vibrant], h6[vibrant], p[vibrant], span[vibrant], a:not([button])[vibrant], small[vibrant], b[vibrant], i[vibrant], strong[vibrant], em[vibrant], sub[vibrant], sup[vibrant], ion-icon[vibrant] {color: rebeccapurple;}",
    "h1[bright], h2[bright], h3[bright], h4[bright], h5[bright], h6[bright], p[bright], span[bright], a:not([button])[bright], small[bright], b[bright], i[bright], strong[bright], em[bright], sub[bright], sup[bright], ion-icon[bright] {color: rgb(255, 193, 37);}",
    ".action-sheet-destructive {color: rgb(245, 61, 61);}",
    ".alert-radio[aria-checked=\"true\"] .alert-radio-label {color: rgb(56, 126, 245);}",
    ".alert-radio[aria-checked=\"true\"] .alert-radio-inner { border-color: rgb(56, 126, 245);}",
    ".alert-checkbox[aria-checked=\"true\"] .alert-checkbox-icon {border-color: rgb(56, 126, 245); background-color: rgb(56, 126, 245);}",
    ".alert-button { color: rgb(56, 126, 245);}",
    "ion-badge { background-color: rgb(56, 126, 245);}",
    ".badge-primary { background-color: rgb(56, 126, 245);}",
    ".badge-secondary { background-color: rgb(50, 219, 100);}",
    ".badge-danger { background-color: rgb(245, 61, 61);}",
    ".badge-light { background-color: rgb(244, 244, 244);}",
    ".badge-dark { background-color: rgb(34, 34, 34);}",
    ".badge-vibrant { background-color: rebeccapurple;}",
    ".badge-bright { background-color: rgb(255, 193, 37);}",
    ".button { background-color: rgb(56, 126, 245);}",
    ".button.activated {background-color: rgb(52, 116, 225);}",
    ".button-outline { border-color: rgb(56, 126, 245); color: rgb(56, 126, 245);}",
    ".button-outline.activated { background-color: rgb(56, 126, 245);}",
    ".button-clear { color: rgb(56, 126, 245);}",
    ".button-clear:hover:not(.disable-hover) {color: rgb(56, 126, 245);}",
    ".button-primary { background-color: rgb(56, 126, 245);}",
    ".button-primary.activated {background-color: rgb(52, 116, 225);}",
    ".button-outline-primary {border-color: rgb(56, 126, 245); color: rgb(56, 126, 245);}",
    ".button-outline-primary.activated { background-color: rgb(56, 126, 245);}",
    ".button-clear-primary { color: rgb(56, 126, 245);}",
    ".button-clear-primary:hover:not(.disable-hover) {color: rgb(56, 126, 245);}",
    ".button-secondary { background-color: rgb(50, 219, 100);}",
    ".button-secondary.activated {background-color: rgb(46, 201, 92);}",
    ".button-outline-secondary {border-color: rgb(50, 219, 100); color: rgb(50, 219, 100);}",
    ".button-outline-secondary.activated { background-color: rgb(50, 219, 100);}",
    ".button-clear-secondary { color: rgb(50, 219, 100);}",
    ".button-clear-secondary:hover:not(.disable-hover) {color: rgb(50, 219, 100);}",
    ".button-danger { background-color: rgb(245, 61, 61);}",
    ".button-danger.activated {background-color: rgb(225, 56, 56);}",
    ".button-outline-danger {border-color: rgb(245, 61, 61); color: rgb(245, 61, 61);}",
    ".button-outline-danger.activated { background-color: rgb(245, 61, 61);}",
    ".button-clear-danger { color: rgb(245, 61, 61);}",
    ".button-clear-danger:hover:not(.disable-hover) {color: rgb(245, 61, 61);}",
    ".button-light { background-color: rgb(244, 244, 244);}",
    ".button-light.activated {background-color: rgb(224, 224, 224);}",
    ".button-outline-light {border-color: rgb(244, 244, 244); color: rgb(244, 244, 244);}",
    ".button-outline-light.activated { background-color: rgb(244, 244, 244);}",
    ".button-clear-light { color: rgb(244, 244, 244);}",
    ".button-clear-light:hover:not(.disable-hover) {color: rgb(244, 244, 244);}",
    ".button-dark { background-color: rgb(34, 34, 34);}",
    ".button-dark.activated {background-color: rgb(52, 52, 52);}",
    ".button-outline-dark {border-color: rgb(34, 34, 34); color: rgb(34, 34, 34);}",
    ".button-outline-dark.activated { background-color: rgb(34, 34, 34);}",
    ".button-clear-dark { color: rgb(34, 34, 34);}",
    ".button-clear-dark:hover:not(.disable-hover) {color: rgb(34, 34, 34);}",
    ".button-vibrant { background-color: rebeccapurple;}",
    ".button-vibrant.activated {background-color: rgb(114, 67, 161);}",
    ".button-outline-vibrant {border-color: rebeccapurple; color: rebeccapurple;}",
    ".button-outline-vibrant.activated { background-color: rebeccapurple;}",
    ".button-clear-vibrant { color: rebeccapurple;}",
    ".button-clear-vibrant:hover:not(.disable-hover) {color: rebeccapurple;}",
    ".button-bright { background-color: rgb(255, 193, 37);}",
    ".button-bright.activated {background-color: rgb(235, 178, 34);}",
    ".button-outline-bright {border-color: rgb(255, 193, 37); color: rgb(255, 193, 37);}",
    ".button-outline-bright.activated { background-color: rgb(255, 193, 37);}",
    ".button-clear-bright { color: rgb(255, 193, 37);}",
    ".button-clear-bright:hover:not(.disable-hover) {color: rgb(255, 193, 37);}",
    "ion-card ion-card-title { color: rgb(34, 34, 34);}",
    ".checkbox-checked {border-color: rgb(56, 126, 245); background-color: rgb(56, 126, 245);}",
    "ion-checkbox[primary] .checkbox-checked {border-color: rgb(56, 126, 245); background-color: rgb(56, 126, 245);}",
    "ion-checkbox[secondary] .checkbox-checked {border-color: rgb(50, 219, 100); background-color: rgb(50, 219, 100);}",
    "ion-checkbox[danger] .checkbox-checked {border-color: rgb(245, 61, 61); background-color: rgb(245, 61, 61);}",
    "ion-checkbox[light] .checkbox-checked {border-color: rgb(244, 244, 244); background-color: rgb(244, 244, 244);}",
    "ion-checkbox[dark] .checkbox-checked {border-color: rgb(34, 34, 34); background-color: rgb(34, 34, 34);}",
    "ion-checkbox[vibrant] .checkbox-checked {border-color: rebeccapurple; background-color: rebeccapurple;}",
    "ion-checkbox[bright] .checkbox-checked {border-color: rgb(255, 193, 37); background-color: rgb(255, 193, 37);}",
    "ion-chip ion-icon[primary] { background-color: rgb(56, 126, 245);}",
    "ion-chip ion-icon[secondary] { background-color: rgb(50, 219, 100);}",
    "ion-chip ion-icon[danger] { background-color: rgb(245, 61, 61);}",
    "ion-chip ion-icon[light] { background-color: rgb(244, 244, 244);}",
    "ion-chip ion-icon[dark] { background-color: rgb(34, 34, 34);}",
    "ion-chip ion-icon[vibrant] { background-color: rebeccapurple;}",
    "ion-chip ion-icon[bright] { background-color: rgb(255, 193, 37);}",
    "ion-item-divider { color: rgb(34, 34, 34);}",
    "ion-item-divider[primary] { background-color: rgb(56, 126, 245);}",
    "ion-item-divider[secondary] { background-color: rgb(50, 219, 100);}",
    "ion-item-divider[danger] { background-color: rgb(245, 61, 61);}",
    "ion-item-divider[light] { background-color: rgb(244, 244, 244);}",
    "ion-item-divider[dark] { background-color: rgb(34, 34, 34);}",
    "ion-item-divider[vibrant] { background-color: rebeccapurple;}",
    "ion-item-divider[bright] { background-color: rgb(255, 193, 37);}",
    "ion-label[primary] {color: rgb(56, 126, 245);}",
    "ion-label[secondary] {color: rgb(50, 219, 100);}",
    "ion-label[danger] {color: rgb(245, 61, 61);}",
    "ion-label[light] {color: rgb(244, 244, 244);}",
    "ion-label[dark] {color: rgb(34, 34, 34);}",
    "ion-label[vibrant] {color: rebeccapurple;}",
    "ion-label[bright] {color: rgb(255, 193, 37);}",
    ".picker-button, .picker-button.activated { color: rgb(56, 126, 245);}",
    ".radio-checked .radio-inner { border-color: rgb(56, 126, 245);}",
    ".item-radio-checked ion-label {color: rgb(56, 126, 245);}",
    "ion-radio[primary] .radio-checked {color: rgb(56, 126, 245);}",
    "ion-radio[primary] .radio-checked .radio-inner {border-color: rgb(56, 126, 245);}",
    "ion-radio[secondary] .radio-checked {color: rgb(50, 219, 100);}",
    "ion-radio[secondary] .radio-checked .radio-inner {border-color: rgb(50, 219, 100);}",
    "ion-radio[danger] .radio-checked {color: rgb(245, 61, 61);}",
    "ion-radio[danger] .radio-checked .radio-inner {border-color: rgb(245, 61, 61);}",
    "ion-radio[light] .radio-checked {color: rgb(244, 244, 244);}",
    "ion-radio[light] .radio-checked .radio-inner {border-color: rgb(244, 244, 244);}",
    "ion-radio[dark] .radio-checked {color: rgb(34, 34, 34);}",
    "ion-radio[dark] .radio-checked .radio-inner {border-color: rgb(34, 34, 34);}",
    "ion-radio[vibrant] .radio-checked {color: rebeccapurple;}",
    "ion-radio[vibrant] .radio-checked .radio-inner {border-color: rebeccapurple;}",
    "ion-radio[bright] .radio-checked {color: rgb(255, 193, 37);}",
    "ion-radio[bright] .radio-checked .radio-inner {border-color: rgb(255, 193, 37);}",
    ".range-bar-active { background: rgb(56, 126, 245);}",
    ".range-tick-active {background: rgb(56, 126, 245);}",
    "ion-range[primary] .range-bar-active, ion-range[primary] .range-tick-active {background: rgb(56, 126, 245);}",
    "ion-range[secondary] .range-bar-active, ion-range[secondary] .range-tick-active {background: rgb(50, 219, 100);}",
    "ion-range[danger] .range-bar-active, ion-range[danger] .range-tick-active {background: rgb(245, 61, 61);}",
    "ion-range[light] .range-bar-active, ion-range[light] .range-tick-active {background: rgb(244, 244, 244);}",
    "ion-range[dark] .range-bar-active, ion-range[dark] .range-tick-active {background: rgb(34, 34, 34);}",
    "ion-range[vibrant] .range-bar-active, ion-range[vibrant] .range-tick-active {background: rebeccapurple;}",
    "ion-range[bright] .range-bar-active, ion-range[bright] .range-tick-active {background: rgb(255, 193, 37);}",
    "ion-searchbar[primary] .searchbar-ios-cancel {color: rgb(56, 126, 245);}",
    "ion-searchbar[primary] .searchbar-ios-cancel:hover:not(.disable-hover) {color: rgb(52, 116, 225);}",
    "ion-searchbar[secondary] .searchbar-ios-cancel {color: rgb(50, 219, 100);}",
    "ion-searchbar[secondary] .searchbar-ios-cancel:hover:not(.disable-hover) {color: rgb(46, 201, 92);}",
    "ion-searchbar[danger] .searchbar-ios-cancel {color: rgb(245, 61, 61);}",
    "ion-searchbar[danger] .searchbar-ios-cancel:hover:not(.disable-hover) {color: rgb(225, 56, 56);}",
    "ion-searchbar[light] .searchbar-ios-cancel {color: rgb(244, 244, 244);}",
    "ion-searchbar[light] .searchbar-ios-cancel:hover:not(.disable-hover) {color: rgb(224, 224, 224);}",
    ".toolbar[light] ion-searchbar .searchbar-ios-cancel {color: rgb(56, 126, 245);}",
    "ion-searchbar[dark] .searchbar-ios-cancel {color: rgb(34, 34, 34);}",
    "ion-searchbar[dark] .searchbar-ios-cancel:hover:not(.disable-hover) {color: rgb(52, 52, 52);}",
    "ion-searchbar[vibrant] .searchbar-ios-cancel {color: rebeccapurple;}",
    "ion-searchbar[vibrant] .searchbar-ios-cancel:hover:not(.disable-hover) {color: rgb(114, 67, 161);}",
    "ion-searchbar[bright] .searchbar-ios-cancel {color: rgb(255, 193, 37);}",
    "ion-searchbar[bright] .searchbar-ios-cancel:hover:not(.disable-hover) {color: rgb(235, 178, 34);}",
    ".toolbar[bright] ion-searchbar .searchbar-ios-cancel {color: rgb(56, 126, 245);}",
    ".segment-button { border-color: rgb(56, 126, 245); color: rgb(56, 126, 245);}",
    ".segment-button.segment-activated { background-color: rgb(56, 126, 245);}",
    "ion-segment[primary] .segment-button {border-color: rgb(56, 126, 245); color: rgb(56, 126, 245);}",
    "ion-segment[primary] .segment-button.segment-activated { background-color: rgb(56, 126, 245);}",
    ".toolbar[primary] .segment-button.segment-activated {color: rgb(56, 126, 245);}",
    "ion-segment[secondary] .segment-button {border-color: rgb(50, 219, 100); color: rgb(50, 219, 100);}",
    "ion-segment[secondary] .segment-button.segment-activated { background-color: rgb(50, 219, 100);}",
    ".toolbar[secondary] .segment-button.segment-activated {color: rgb(50, 219, 100);}",
    "ion-segment[danger] .segment-button {border-color: rgb(245, 61, 61); color: rgb(245, 61, 61);}",
    "ion-segment[danger] .segment-button.segment-activated { background-color: rgb(245, 61, 61);}",
    ".toolbar[danger] .segment-button.segment-activated {color: rgb(245, 61, 61);}",
    "ion-segment[light] .segment-button {border-color: rgb(244, 244, 244); color: rgb(244, 244, 244);}",
    "ion-segment[light] .segment-button.segment-activated { background-color: rgb(244, 244, 244);}",
    ".toolbar[light] .segment-button.segment-activated {color: rgb(244, 244, 244);}",
    "ion-segment[dark] .segment-button {border-color: rgb(34, 34, 34); color: rgb(34, 34, 34);}",
    "ion-segment[dark] .segment-button.segment-activated { background-color: rgb(34, 34, 34);}",
    ".toolbar[dark] .segment-button.segment-activated {color: rgb(34, 34, 34);}",
    "ion-segment[vibrant] .segment-button {border-color: rebeccapurple; color: rebeccapurple;}",
    "ion-segment[vibrant] .segment-button.segment-activated { background-color: rebeccapurple;}",
    ".toolbar[vibrant] .segment-button.segment-activated {color: rebeccapurple;}",
    "ion-segment[bright] .segment-button {border-color: rgb(255, 193, 37); color: rgb(255, 193, 37);}",
    "ion-segment[bright] .segment-button.segment-activated { background-color: rgb(255, 193, 37);}",
    ".toolbar[bright] .segment-button.segment-activated {color: rgb(255, 193, 37);}",
    ".tab-button:hover:not(.disable-hover), .tab-button[aria-selected=\"true\"] {color: rgb(56, 126, 245);}",
    "ion-tabs[primary] ion-tabbar {border-color: rgb(12, 96, 238); background-color: rgb(56, 126, 245);}",
    "ion-tabs[secondary] ion-tabbar {border-color: rgb(33, 185, 78); background-color: rgb(50, 219, 100);}",
    "ion-tabs[danger] ion-tabbar {border-color: rgb(243, 13, 13); background-color: rgb(245, 61, 61);}",
    "ion-tabs[light] ion-tabbar {border-color: rgb(219, 219, 219); background-color: rgb(244, 244, 244);}",
    "ion-tabs[dark] ion-tabbar {border-color: rgb(9, 9, 9); background-color: rgb(34, 34, 34);}",
    "ion-tabs[vibrant] ion-tabbar {border-color: rgb(77, 38, 115); background-color: rebeccapurple;}",
    "ion-tabs[bright] ion-tabbar {border-color: rgb(241, 172, 0); background-color: rgb(255, 193, 37);}",
    ".toggle-checked {background-color: rgb(56, 126, 245);}",
    "ion-toggle[primary] .toggle-checked {background-color: rgb(56, 126, 245);}",
    "ion-toggle[secondary] .toggle-checked {background-color: rgb(50, 219, 100);}",
    "ion-toggle[danger] .toggle-checked {background-color: rgb(245, 61, 61);}",
    "ion-toggle[light] .toggle-checked {background-color: rgb(244, 244, 244);}",
    "ion-toggle[dark] .toggle-checked {background-color: rgb(34, 34, 34);}",
    "ion-toggle[vibrant] .toggle-checked {background-color: rebeccapurple;}",
    "ion-toggle[bright] .toggle-checked {background-color: rgb(255, 193, 37);}",
    ".bar-button-outline { border-color: rgb(56, 126, 245); color: rgb(56, 126, 245);}",
    ".bar-button-outline.activated { background-color: rgb(56, 126, 245);}",
    ".bar-button-solid { background-color: rgb(56, 126, 245);}",
    ".bar-button-solid.activated { background-color: rgb(52, 116, 225);}",
    ".bar-button-default {color: rgb(56, 126, 245);}",
    ".bar-button-default:hover:not(.disable-hover) {color: rgb(56, 126, 245);}",
    ".toolbar[primary] .toolbar-background {border-color: rgb(12, 96, 238); background: rgb(56, 126, 245);}",
    ".bar-button-primary {color: rgb(56, 126, 245);}",
    ".bar-button-primary:hover:not(.disable-hover) {color: rgb(56, 126, 245);}",
    ".bar-button-outline-primary {border-color: rgb(52, 116, 225); color: rgb(52, 116, 225);}",
    ".bar-button-outline-primary.activated { background-color: rgb(52, 116, 225);}",
    ".bar-button-solid-primary { background-color: rgb(56, 126, 245);}",
    ".bar-button-solid-primary.activated { background-color: rgb(52, 116, 225);}",
    ".toolbar[secondary] .toolbar-background {border-color: rgb(33, 185, 78); background: rgb(50, 219, 100);}",
    ".bar-button-secondary {color: rgb(50, 219, 100);}",
    ".bar-button-secondary:hover:not(.disable-hover) {color: rgb(50, 219, 100);}",
    ".bar-button-outline-secondary {border-color: rgb(46, 201, 92); color: rgb(46, 201, 92);}",
    ".bar-button-outline-secondary.activated { background-color: rgb(46, 201, 92);}",
    ".bar-button-solid-secondary { background-color: rgb(50, 219, 100);}",
    ".bar-button-solid-secondary.activated { background-color: rgb(46, 201, 92);}",
    ".toolbar[danger] .toolbar-background {border-color: rgb(243, 13, 13); background: rgb(245, 61, 61);}",
    ".bar-button-danger {color: rgb(245, 61, 61);}",
    ".bar-button-danger:hover:not(.disable-hover) {color: rgb(245, 61, 61);}",
    ".bar-button-outline-danger {border-color: rgb(225, 56, 56); color: rgb(225, 56, 56);}",
    ".bar-button-outline-danger.activated { background-color: rgb(225, 56, 56);}",
    ".bar-button-solid-danger { background-color: rgb(245, 61, 61);}",
    ".bar-button-solid-danger.activated { background-color: rgb(225, 56, 56);}",
    ".toolbar[light] .toolbar-background {border-color: rgb(219, 219, 219); background: rgb(244, 244, 244);}",
    ".bar-button-light {color: rgb(244, 244, 244);}",
    ".bar-button-light:hover:not(.disable-hover) {color: rgb(244, 244, 244);}",
    ".bar-button-outline-light {border-color: rgb(224, 224, 224); color: rgb(224, 224, 224);}",
    ".bar-button-outline-light.activated { background-color: rgb(224, 224, 224);}",
    ".bar-button-solid-light { background-color: rgb(244, 244, 244);}",
    ".bar-button-solid-light.activated { background-color: rgb(224, 224, 224);}",
    ".toolbar[dark] .toolbar-background {border-color: rgb(9, 9, 9); background: rgb(34, 34, 34);}",
    ".bar-button-dark {color: rgb(34, 34, 34);}",
    ".bar-button-dark:hover:not(.disable-hover) {color: rgb(34, 34, 34);}",
    ".bar-button-outline-dark {border-color: rgb(52, 52, 52); color: rgb(52, 52, 52);}",
    ".bar-button-outline-dark.activated { background-color: rgb(52, 52, 52);}",
    ".bar-button-solid-dark { background-color: rgb(34, 34, 34);}",
    ".bar-button-solid-dark.activated { background-color: rgb(52, 52, 52);}",
    ".toolbar[vibrant] .toolbar-background {border-color: rgb(77, 38, 115); background: rebeccapurple;}",
    ".bar-button-vibrant {color: rebeccapurple;}",
    ".bar-button-vibrant:hover:not(.disable-hover) {color: rebeccapurple;}",
    ".bar-button-outline-vibrant {border-color: rgb(114, 67, 161); color: rgb(114, 67, 161);}",
    ".bar-button-outline-vibrant.activated { background-color: rgb(114, 67, 161);}",
    ".bar-button-solid-vibrant { background-color: rebeccapurple;}",
    ".bar-button-solid-vibrant.activated { background-color: rgb(114, 67, 161);}",
    ".toolbar[bright] .toolbar-background {border-color: rgb(241, 172, 0); background: rgb(255, 193, 37);}",
    ".bar-button-bright {color: rgb(255, 193, 37);}",
    ".bar-button-bright:hover:not(.disable-hover) {color: rgb(255, 193, 37);}",
    ".bar-button-outline-bright {border-color: rgb(235, 178, 34); color: rgb(235, 178, 34);}",
    ".bar-button-outline-bright.activated { background-color: rgb(235, 178, 34);}",
    ".bar-button-solid-bright { background-color: rgb(255, 193, 37);}",
    ".bar-button-solid-bright.activated { background-color: rgb(235, 178, 34);}",
    ".swipe-menu-item.primary {background-color: rgb(56, 126, 245);}",
    ".swipe-menu-item.secondary {background-color: rgb(50, 219, 100);}",
    ".swipe-menu-item.danger {background-color: rgb(245, 61, 61);}",
    ".swipe-menu-item.light {background-color: rgb(244, 244, 244);}",
    ".swipe-menu-item.dark {background-color: rgb(34, 34, 34);}",
    ".swipe-menu-item.vibrant {background-color: rebeccapurple;}",
    ".swipe-menu-item.bright {background-color: rgb(255, 193, 37);}",
    ".alert-button-destructive {color: rgb(245, 61, 61);}",
    ".text-primary {color: rgb(56, 126, 245);}",
    ".text-secondary {color: rgb(50, 219, 100);}",
    ".text-danger {color: rgb(245, 61, 61);}",
    ".text-light {color: rgb(244, 244, 244);}",
    ".text-dark {color: rgb(34, 34, 34);}",
    ".text-vibrant {color: rebeccapurple;}",
    ".text-bright {color: rgb(255, 193, 37);}",
    ".back-primary {background-color: rgb(56, 126, 245);}",
    ".back-secondary {background-color: rgb(50, 219, 100);}",
    ".back-danger {background-color: rgb(245, 61, 61);}",
    ".back-light {background-color: rgb(244, 244, 244);}",
    ".back-dark {background-color: rgb(34, 34, 34);}",
    ".back-vibrant {background-color: rebeccapurple;}",
    ".back-bright {background-color: rgb(255, 193, 37);}",
    //
    // dark mode
    ".dark-mode .button:not(.button-clear):not(.button-outline) { background: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), linear-gradient(#387EF5,#387EF5); color: #387EF5; }",
    ".dark-mode .button-secondary:not(.button-clear):not(.button-outline) { background: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), linear-gradient(#32DB64,#32DB64); color: #32DB64; }",
    ".dark-mode .button-danger:not(.button-clear):not(.button-outline) { background: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), linear-gradient(#F53D3D,#F53D3D); color: #F53D3D; }",
    ".dark-mode .button-light:not(.button-clear):not(.button-outline) { background: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), linear-gradient(#F4F4F4,#F4F4F4); color: #F4F4F4; }",
    ".dark-mode .button-dark:not(.button-clear):not(.button-outline) { background: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), linear-gradient(#222222,#222222); color: #222222; }",
    ".dark-mode .button-bright:not(.button-clear):not(.button-outline) { background: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), linear-gradient(#FFC125,#FFC125); color: #FFC125; }",
    ".dark-mode .button-vibrant:not(.button-clear):not(.button-outline) { background: linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), linear-gradient(#663399,#663399); color: #663399; }",
    ".dark-mode .button:not(.button-clear):not(.button-outline).activated { background: linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.60)), linear-gradient(#387EF5,#387EF5); color: #387EF5; }",
    ".dark-mode .button-secondary:not(.button-clear):not(.button-outline).activated { background: linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.60)), linear-gradient(#32DB64,#32DB64); color: #32DB64; }",
    ".dark-mode .button-danger:not(.button-clear):not(.button-outline).activated { background: linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.60)), linear-gradient(#F53D3D,#F53D3D); color: #F53D3D; }",
    ".dark-mode .button-light:not(.button-clear):not(.button-outline).activated { background: linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.60)), linear-gradient(#F4F4F4,#F4F4F4); color: #F4F4F4; }",
    ".dark-mode .button-dark:not(.button-clear):not(.button-outline).activated { background: linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.60)), linear-gradient(#222222,#222222); color: #222222; }",
    ".dark-mode .button-bright:not(.button-clear):not(.button-outline).activated { background: linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.60)), linear-gradient(#FFC125,#FFC125); color: #FFC125; }",
    ".dark-mode .button-vibrant:not(.button-clear):not(.button-outline).activated { background: linear-gradient(rgba(0,0,0,0.60),rgba(0,0,0,0.60)), linear-gradient(#663399,#663399); color: #663399; }",
    ".dark-mode .toolbar[primary] .bar-button-default { color: #387EF5; }",
    ".dark-mode .toolbar[secondary] .bar-button-default { color: #32DB64; }",
    ".dark-mode .toolbar[danger] .bar-button-default { color: #F53D3D; }",
    ".dark-mode .toolbar[light] .bar-button-default { color: #F4F4F4; }",
    ".dark-mode .toolbar[bright] .bar-button-default { color: #FFC125; }",
    ".dark-mode .toolbar[vibrant] .bar-button-default { color: #663399; }",
    ".dark-mode .input-error-message { color: #F53D3D; }",
    ".dark-mode ion-tabs[primary] ion-tabbar .tab-button:hover:not(.disable-hover), .dark-mode  ion-tabs[primary] ion-tabbar .tab-button[aria-selected=\"true\"] { color: #387EF5; }",
    ".dark-mode ion-tabs[secondary] ion-tabbar .tab-button:hover:not(.disable-hover), .dark-mode  ion-tabs[secondary] ion-tabbar .tab-button[aria-selected=\"true\"] { color: #32DB64; }",
    ".dark-mode ion-tabs[danger] ion-tabbar .tab-button:hover:not(.disable-hover), .dark-mode  ion-tabs[danger] ion-tabbar .tab-button[aria-selected=\"true\"] { color: #F53D3D; }",
    ".dark-mode ion-tabs[light] ion-tabbar .tab-button:hover:not(.disable-hover), .dark-mode  ion-tabs[light] ion-tabbar .tab-button[aria-selected=\"true\"] { color: #F4F4F4; }",
    ".dark-mode ion-tabs[bright] ion-tabbar .tab-button:hover:not(.disable-hover), .dark-mode  ion-tabs[bright] ion-tabbar .tab-button[aria-selected=\"true\"] { color: #FFC125; }",
    ".dark-mode ion-tabs[vibrant] ion-tabbar .tab-button:hover:not(.disable-hover), .dark-mode  ion-tabs[vibrant] ion-tabbar .tab-button[aria-selected=\"true\"] { color: #663399; }"
  ];
};


/**
 * Returns all css rules to update without substitution
 */
Client.IonHelper.bulkCSSUpdateExtra = function ()
{
  return [
    ".button-outline { background-color: transparent;}",
    ".button-clear { border-color: transparent; background-color: transparent;}",
    ".button-clear.activated { background-color: transparent;}"
  ];
};


/**
 * Returns all css rules to update without substitution
 */
Client.IonHelper.resetCssRules = function ()
{
  if (this.cssUpdated) {
    this.cssUpdated = false;
    for (var i = 0; i < this.cssRulesUpdated.length; i++) {
      var r = this.cssRulesUpdated[i];
      r.rule.cssText = r.text;
    }
    this.cssRulesUpdated = [];
    if (this.cssRulesAddedStyle)
      this.cssRulesAddedStyle.remove();
    this.cssRulesAddedStyle = undefined;
  }
};


/**
 * Update theme
 * @param {object} newTheme - new theme properties
 */
Client.MainFrame.prototype.updateTheme = function (newTheme)
{
  if (!this.theme)
    return;
  //
  // update theme properties
  for (var p in newTheme.theme) {
    this.theme[p] = newTheme.theme[p];
  }
  //
  Client.IonHelper.resetCssRules();
  Client.IonHelper.updateCssRules();
  Client.mainFrame.device.updateAppuiClasses();
};

/**
 * Gets all the focusable object of a view (in mobile only inputs, on desktop others as well)
 * and focus the next object (search the current and than set the focus on the next)
 *
 * @param {InDe.View} view - parent view
 * @param currentInput
 * @param {boolean} prev - if true we focus the prev input in the chain
 */
Client.IonHelper.focusNextInput = function (view, currentInput, prev) {
  if (!view.domObj || !view.elements || view.elements.length === 0)
    return;
  //
  try {
    // For Mobile we focus only on the input (we need the keyboard to focus the next object)
    // on desktop we can get all the objects.
    //
    // We search all te focucasbles object that are contained in the 'first' child of the view
    // (a Ionic view has only a child - the page)
    // we consider all 'input/textarea' + buttons with 'item-cover' (if a button is a control/footer button for now we skip it)
    var mainPage = view.elements[0].getRootObject();
    var mainSelector = "input";
    mainSelector += ", span[contenteditable='true']";
    if (!Client.mainFrame.device.isMobile) {
      mainSelector += ", textarea";
      mainSelector += ", button.item-cover";
      mainSelector += ", div.range-knob-handle";
    }
    var focusables = mainPage.querySelectorAll(mainSelector);
    if (focusables) {
      // If the currentInput is found the focus is set to the next.
      // If there is no next (last item of the list)
      // The focus goes to the first
      var actPos = -1;
      focusables.forEach(function (currentValue, currentIndex) {
        if (currentValue === currentInput)
          actPos = currentIndex;
      });
      //
      // It seems that the current element is not in the list... strange....
      if (actPos === -1)
        return;
      //
      var focused = false;
      if (!prev) {
        // If the current element is the last we must start from the beginning (-1 because idx is actPos+1 at the beginnning)
        if (actPos === focusables.length - 1)
          actPos = -1;
        //
        for (var ix = actPos + 1; ix < focusables.length; ix++) {
          // I've done a complete circle
          if (focusables[ix] === currentInput)
            break;
          //
          var nextInput = focusables[ix];
          if (Client.IonHelper.isObjFocusable(nextInput)) {
            focused = true;
            //
            // The autocomplete input can open when focused. Is OK with mouse... but not
            // with TAB or ENTER. In that case we need to 'disable' that feature
            if (nextInput.classList.contains("ion-autocomplete-input"))
              nextInput.setAttribute("opencombo", "no");
            nextInput.focus();
            if (nextInput.classList.contains("ion-autocomplete-input"))
              nextInput.setAttribute("opencombo", "");
            //
            if (!Client.mainFrame.device.isMobile && nextInput.tagName === "INPUT" && nextInput.type === "TEXT") {
              nextInput.selectionStart = 0;
              nextInput.selectionEnd = nextInput.value.length;
            }
            break;
          }
          //
          // At the end restart to 0 (ix = -1 -> ix++ -> ix = 0)
          if (!focused && ix === focusables.length - 1)
            ix = -1;
        }
      }
      else {
        // If the current element is the first we must start from the end (length because idx is actPos-1 at the beginnning)
        if (actPos === 0)
          actPos = focusables.length;
        //
        for (var ix = actPos - 1; ix >= 0; ix--) {
          // I've done a complete circle
          if (focusables[ix] === currentInput)
            break;
          //
          var nextInput = focusables[ix];
          if (Client.IonHelper.isObjFocusable(nextInput)) {
            focused = true;
            //
            if (nextInput.classList.contains("ion-autocomplete-input"))
              nextInput.setAttribute("opencombo", "no");
            nextInput.focus();
            if (nextInput.classList.contains("ion-autocomplete-input"))
              nextInput.setAttribute("opencombo", "");
            //
            if (!Client.mainFrame.device.isMobile && nextInput.tagName === "INPUT" && nextInput.type === "TEXT") {
              nextInput.selectionStart = 0;
              nextInput.selectionEnd = nextInput.value.length;
            }
            break;
          }
          //
          // At the start cycle to the end (ix = focusables.length -> ix-- -> ix = focusables.length -1)
          if (!focused && ix === 0)
            ix = focusables.length;
        }
      }
      //
      /*if (!focused) {
       // No other input focusable in list.. what to do???
       }*/
    }
  }
  catch (ex) {
  }
};

/**
 * Returns true if the obj is focusable
 * - is visibile (display != none)
 * - is not disabled
 */
Client.IonHelper.isObjFocusable = function (domObj)
{
  if (!domObj)
    return false;
  //
  if (domObj.disabled)
    return false;
  //
  // Use getBoundingClientRect to check if the element is visible
  //
  // NOTE : Visibility:hidden is not handled.
  var rect = domObj.getBoundingClientRect();
  if (rect.top === 0 && rect.left === 0 && rect.width === 0 && rect.height === 0)
    return false;
  //
  return true;
};

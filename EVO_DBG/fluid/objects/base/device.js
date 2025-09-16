/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global FB, moment, Client, TH */

/**
 * @class Device
 * */
Client.Device = function ()
{
  // Map of elements registered to be notified on certain events
  this.registeredEleMap = {};
  //
  this.deviceOrientation = "vertical";
  if (window.matchMedia && window.matchMedia("(orientation: landscape)").matches)
    this.deviceOrientation = "horizontal";
  //
  this.language = navigator.language;
  this.platform = navigator.platform;
  this.userAgent = navigator.userAgent;
  //
  // Get model and operating system version from navigator.userAgentData, if it exists
  if (navigator.userAgentData) {
    navigator.userAgentData.getHighEntropyValues(["model", "platformVersion"]).then(function (info) {
      this.model = info.model;
      this.operatingSystemVersion = info.platformVersion;
      //
      // Send model and operating system version to server
      Client.mainFrame.sendEvents([{id: "onSetDeviceProperties", content: {properties: {model: this.model, operatingSystemVersion: this.operatingSystemVersion}}}]);
    }.bind(this)).catch(function (ex) {});
  }
  //
  // change client moment instance
  moment.locale(this.language);
  //
  this.screenWidth = screen.width;
  this.screenHeight = screen.height;
  this.clientWidth = window.innerWidth;
  this.clientHeight = window.innerHeight;
  //
  // Check if isMobile using userAgent
  this.isMobile = false;
  if (this.userAgent.indexOf("Mobile") !== -1
          || this.userAgent.indexOf("IEMobile") !== -1
          || this.userAgent.indexOf("Opera Mobi") !== -1
          || this.userAgent.indexOf("Opera Tablet") !== -1
          || this.userAgent.indexOf("Tablet") !== -1
          || this.userAgent.indexOf("Android") !== -1) {
    this.isMobile = true;
  }
  else // Otherwise check if touch is supported
    this.isMobile = ("ontouchstart" in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  //
  // Check if we are contained in the preview iframe. must use try because in android launcher the call to parent.location gives an error
  var inPreview = false;
  try {
    inPreview = parent && parent !== window && parent.location && parent.location.pathname.indexOf("/preview.html") > 0;
  }
  catch (ex) {
  }
  //
  // Connecting to shell...
  // - on iOS we are in the shell  only if there isn't Safari in the user Agent
  var isSafariOnIOS = (this.userAgent.indexOf("like Mac OS X") > -1 && this.userAgent.indexOf("Safari") > -1);
  //
  if (Client.resourceHome)
    this.shell = window; // App is inplace activated
  else if (this.isMobile && parent !== window && !inPreview && !isSafariOnIOS)
    this.shell = parent; // App is hosted in an iframe (that isn't a preview) - and not in Safari
  else
    this.shell = new Client.ShellEmulator(this); // Browser simulation
  //
  if (this.isMobile && parent !== window) {
    window.history.replaceState(null, "");
    window.history.pushState({url: "base"}, "");
  }
  //
  // Detect if the app is running as pwa
  this.isPWA = (this.shell instanceof Client.ShellEmulator)
          && Client.isOffline()
          && (navigator.standalone
                  || window.matchMedia("display-mode: standalone").matches
                  || (window.innerHeight / window.outerHeight > 0.9));
  //
  // Since iOS 13, the WKWebView defaulted to "desktop browsing" (https://github.com/ionic-team/capacitor/discussions/4272)
  // and so Safari on iOS has the same user agent as Safari on macOS. This cause operating system to be calculated in a wrong way.
  // So transform the user agent in the iOS form (replacing "Intel" with "like") on mobile device
  if (this.isMobile)
    this.userAgent = this.userAgent.replace("Intel Mac OS X", "like Mac OS X");
  //
  this.operatingSystem = this.userAgent.substr(this.userAgent.indexOf("(") + 1, this.userAgent.indexOf(";"));
  if (this.isMobile) {
    if (this.userAgent.indexOf("Android") !== -1)
      this.operatingSystem = "android";
    else if (this.userAgent.indexOf("Windows") !== -1)
      this.operatingSystem = "windows";
    else if (this.userAgent.indexOf("like Mac OS X") !== -1 || this.userAgent.indexOf("Apple") !== -1)
      this.operatingSystem = "ios";
    else if (this.userAgent.indexOf("BlackBerry") !== -1 || this.userAgent.indexOf("BB10") !== -1 || this.userAgent.indexOf("RIM") !== -1)
      this.operatingSystem = "blackberry";
  }
  else {
    if (this.userAgent.indexOf("Linux") !== -1)
      this.operatingSystem = "linux";
    else if (this.userAgent.indexOf("Windows") !== -1)
      this.operatingSystem = "windows";
    else if (this.userAgent.indexOf("Macintosh") !== -1)
      this.operatingSystem = "macos";
  }
  //
  var vers;
  this.operatingSystemVersion = "not available";
  if (this.isMobile) {
    if (this.operatingSystem === "android") {
      if (this.userAgent.indexOf("Android;") === -1) {
        vers = this.userAgent.substr(this.userAgent.indexOf("Android ") + 8);
        this.operatingSystemVersion = vers.substr(vers, vers.indexOf(";"));
      }
    }
    else if (this.operatingSystem === "ios") {
      if (this.isPWA) {
        var matches = this.userAgent.match(/Version\/\S+/);
        vers = matches ? matches[0] || "" : "";
        this.operatingSystemVersion = vers.replace("Version/", "");
      }
      else {
        vers = this.userAgent.substr(0, this.userAgent.indexOf(" like Mac OS X"));
        if (vers.indexOf("CPU") !== -1) {
          // IPhone OR IOS 13 IPAD
          this.operatingSystemVersion = vers.substr(vers.indexOf("CPU ") + 4).replace("iPhone", "").replace("OS ", "").replace(/_/g, ".");
        }
        else if (this.userAgent.indexOf("Version/") !== -1) {
          // IPADOS 14/15 -> safari
          this.operatingSystemVersion = this.userAgent.substr(this.userAgent.indexOf("Version/"), 12).replace("Version/", "");
        }
        else if (this.userAgent.indexOf("Mobile/") !== -1) {
          // IPADOS 15 -> VKWebView
          this.operatingSystemVersion = this.userAgent.substr(this.userAgent.indexOf("Mobile/"), 9).replace("Mobile/", "");
        }
      }
    }
    else if (this.operatingSystem === "windows") {
      vers = this.userAgent.substr(this.userAgent.indexOf("Windows ") + 8);
      this.operatingSystemVersion = vers.substr(vers, vers.indexOf(";")).replace("Phone", "").replace("NT", "");
    }
    else if (this.operatingSystem === "blackberry") {
      if (this.userAgent.indexOf("BB") !== -1)
        this.operatingSystemVersion = this.userAgent.substr(this.userAgent.indexOf("BB") + 2, 2);
      else if (this.userAgent.indexOf("RIM") !== -1) {
        vers = this.userAgent.substr(this.userAgent.indexOf("RIM ") + 4);
        this.operatingSystemVersion = vers.substr(0, vers.indexOf(";")).replace("Tablet", "").replace("OS ", "");
      }
    }
  }
  else {
    if (this.operatingSystem === "macos") {
      vers = this.userAgent.substr(this.userAgent.indexOf("Mac OS X ") + 9);
      var idx = vers.indexOf(")");
      var idx2 = vers.indexOf(";");
      if (idx2 > 0 && idx2 < idx)
        idx = idx2;
      this.operatingSystemVersion = vers.substr(0, idx).replace(/_/g, ".");
    }
    else if (this.operatingSystem === "windows") {
      vers = this.userAgent.substr(this.userAgent.indexOf("Windows ") + 8);
      this.operatingSystemVersion = vers.substr(vers, vers.indexOf(";")).replace("NT", "");
    }
  }
  //
  this.type = "desktop";
  //
  if (this.isMobile) {
    this.type = "smartphone";
    //
    // Ipad IOS 13
    if (/iPad/i.test(navigator.userAgent))
      this.type = "tablet";
    //
    // IpadOS 14/15 -> is ios, mobile (touch enabled) and without iphone in the username
    if (this.operatingSystem === "ios" && !(/iPhone/i.test(navigator.userAgent)))
      this.type = "tablet";
    //
    if (/Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent))
      this.type = "tablet";
    //
    if (/Crosswalk/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent))
      this.type = "tablet";
  }
  //
  this.browserName = navigator.appName;
  if (this.userAgent.indexOf("OPR") !== -1 || this.userAgent.indexOf("OPiOS") !== -1 || this.userAgent.indexOf("Opera") !== -1)
    this.browserName = "Opera";
  else if (this.userAgent.indexOf("Chrome") !== -1 || this.userAgent.indexOf("CriOS") !== -1)
    this.browserName = "Chrome";
  else if (this.userAgent.indexOf("Safari") !== -1)
    this.browserName = "Safari";
  else if (this.userAgent.indexOf("Firefox") !== -1)
    this.browserName = "Firefox";
  else if (this.userAgent.indexOf("Trident") !== -1)
    this.browserName = "IE";
  //
  this.browserVersion = "not available";
  vers = "";
  if (this.isMobile) {
    if (this.browserName === "Chrome") {
      var token = (this.operatingSystem === "android") ? "Chrome/" : "CriOS/";
      vers = this.userAgent.substr(this.userAgent.indexOf(token) + token.length);
      this.browserVersion = vers.substr(0, vers.indexOf("."));
    }
    else if (this.browserName === "Opera" || this.browserName === "Safari") {
      if (this.operatingSystem === "ios" && this.browserName === "Opera")
        vers = this.userAgent.substr(this.userAgent.indexOf("OPiOS/") + 6);
      else if (this.operatingSystem === "android" && this.browserName === "Opera" && this.userAgent.indexOf("OPR") !== -1)
        vers = this.userAgent.substr(this.userAgent.indexOf("OPR/") + 4);
      else
        vers = this.userAgent.substr(this.userAgent.indexOf("Version/") + 8);
      this.browserVersion = vers.substr(0, vers.indexOf("."));
    }
    else if (this.browserName === "IE") {
      vers = this.userAgent.substr(this.userAgent.indexOf("Trident/") + 8);
      this.browserVersion = parseInt(vers.substr(0, vers.indexOf("."))) + 4;
    }
  }
  else {
    if (this.browserName === "IE") {
      vers = this.userAgent.substr(this.userAgent.indexOf("Trident/") + 8);
      this.browserVersion = parseInt(vers.substr(0, vers.indexOf("."))) + 4;
    }
    else if (this.browserName === "Opera") {
      vers = this.userAgent.substr(this.userAgent.indexOf("OPR/") + 4);
      this.browserVersion = vers.substr(0, vers.indexOf("."));
    }
    else if (this.browserName === "Safari") {
      vers = this.userAgent.substr(this.userAgent.indexOf("Version/") + 8);
      this.browserVersion = vers.substr(0, vers.indexOf("."));
    }
  }
  if (this.browserVersion === "not available" && this.userAgent.indexOf(this.browserName) !== -1) {
    vers = this.userAgent.substr(this.userAgent.indexOf(this.browserName) + this.browserName.length + 1);
    this.browserVersion = vers.substr(0, vers.indexOf("."));
  }
  //
  if (this.isMobile && this.operatingSystem === "ios") {
    this.browserName = "Safari";
    if (this.browserVersion === "not available") {
      vers = this.operatingSystemVersion;
      this.browserVersion = vers.substr(0, vers.indexOf("."));
    }
  }
  if (this.isMobile && this.operatingSystem === "android" && !this.isPWA) {
    this.browserName = "Chrome";
    if (this.browserVersion === "not available") {
      vers = this.operatingSystemVersion;
      this.browserVersion = vers.substr(0, vers.indexOf("."));
    }
  }
  this.ua = this.browserName.toLowerCase() + ((this.browserVersion !== "not available") ? this.browserVersion : "");
  //
  // Retrieve locale from navigator language (replacing - with _)
  this.locale = navigator.userLanguage || navigator.language;
  this.locale = this.locale ? this.locale.replace("-", "_") : undefined;
  //
  let m = moment().locale(this.language || "");
  this.dateFormat = m.localeData().longDateFormat("L");
  this.timeFormat = m.localeData().longDateFormat("LT").replace("mm", "nn");
  //
  // Retrieve battery properties (level and if it's charging) from navigator
  this.setBattery();
  //
  // Set the network state property
  this.setNetworkState();
  //
  // Retrieve month names in the current locale
  this.setMonthNames();
  //
  // Retrieve day names in the current locale
  this.setDayNames();
  //
  // Retrieve first day of week
  this.firstDayOfWeek = this.dayNames[1];
  //
  // Get version from operatingSystemVersion
  let index = this.operatingSystemVersion.indexOf(".") !== -1 ? this.operatingSystemVersion.indexOf(".") : this.operatingSystemVersion.length;
  this.version = this.operatingSystemVersion.substr(0, index).trim();
  //
  // Get the timezone code
  let timezoneFull = Intl.DateTimeFormat().resolvedOptions().timeZone;
  this.timezone = moment().tz(timezoneFull).zoneAbbr();
  //
  // Calculate isDayLigthSavingTime based on timezone offset
  this.isDayLightSavingTime = new Date().getTimezoneOffset() === new Date(2021, 7, 1).getTimezoneOffset();
  //
  // Try to extract device model name from userAgent
  if (this.operatingSystem === "android" && this.browserName === "Chrome") {
    var firstParenthesisGroup = /\(([^)]+)\)/;
    var model = firstParenthesisGroup.exec(this.userAgent)[1] || "";
    model = model.split(";")[2] || "";
    this.model = model.replace(")", "").trim();
  }
  //
  // Set number pattern based on locale
  this.setNumberPattern();
  //
  // Set currency pattern based on locale
  this.setCurrencyPattern();
  //
  // Set number and currency format to be used in IdfPanel
  this.numberFormat = "#,###,###,###.####";
  this.currencyFormat = "#,###,###,##0.00";
  this.decimalDot = (new Intl.NumberFormat(this.language).format(0.1)).charAt(1) === ".";
  //
  // Generate a random uuid for the device on shell emulator
  if (this.shell instanceof Client.ShellEmulator)
    this.setUUID();
  //
  this.viewportParams = {};
  //
  Client.eleMap["device-ui"] = this;
  //
  var appui = document.getElementById("app-ui");
  if (appui) {
    if (this.operatingSystem === "ios") {
      appui.classList.add("platform-ios");
    }
    if (this.operatingSystem === "android") {
      appui.classList.add("platform-android");
    }
  }
  //
  // the event listener for postmessages should be placed here
  // so that plugin responses to requests onStart can arrive
  window.addEventListener("message", function (ev) {
    //
    var msg = ev.data;
    //
    // Only shell messages should be taken
    var ok = msg && msg.source === "shell";
    //
    // If we are in a normal browser, check if the allowCrossDomainCommands flag was set
    if (this.shell instanceof Client.ShellEmulator) {
      if (msg.obj === "device-oidc" && msg.id === "authorizeCallback")
        ok = true;
      else {
        ok = Client.mainFrame.theme && (Client.mainFrame.theme.allowCrossDomainCommands == "true" || Client.mainFrame.theme.allowCrossDomainCommands == true); // jshint ignore:line
        if (ok) {
          // In this case, compose the onCommand message
          msg.mode = "client";
          msg = {id: "onCommand", content: {query: msg}};
        }
      }
    }
    if (ok) {
      if (!ev.data.destination || ev.data.destination === "app")
        this.onMessage(msg); // ev.data is cmd
    }
  }.bind(this));
};


/**
 * handle a plugin request to change local device properties
 * @param {object} prop
 */
Client.Device.prototype.setProp = function (prop)
{
  // Update keyboardHeight
  if (prop.keyboardHeight)
    this.keyboardHeight = prop.keyboardHeight;
  //
  // Define root app
  if (prop.rootApp)
    this.rootApp = prop.rootApp;
  //
  if (prop.keyboard !== undefined)
    this.onChangeKeyboardVisibility(prop.keyboard);
};


/**
 * Keyboard is shown or hidden
 * @param {boolean} flag
 */
Client.Device.prototype.onChangeKeyboardVisibility = function (flag)
{
};


/**
 * Set the viewport params
 * @param {String} devicetype - none, desktop, tablet, smartphone
 * @param {String} orientation - horizontal, vertical
 * @param {String} origin - Client.id from the device where the change is happening
 * @param {String} physical - true if the setting arrives from a physical device
 */
Client.Device.prototype.setViewport = function (devicetype, orientation, origin, physical)
{
  // Protection from loop : this is already my device
  if (origin === Client.id)
    return;
  //
  // No device or "none" device are desktop devices (for the preview the desktop is the old "none")
  var noDevice = false;
  if (!devicetype || devicetype === "none") {
    if (devicetype === "none")
      noDevice = true;
    devicetype = "desktop";
  }
  //
  var pthis = this;
  //
  // Show the Application container
  document.getElementById("app-ui").style.visibility = "";
  //
  // Mobile app : ignore the device
  if (this.isMobile && !this.emulatorsAck) {
    this.emulatorsAck = true;
    //
    // On IOS, we use TH to speed up touch interactions
    if (typeof TH === "object" && this.operatingSystem === "ios")
      TH.init(document.getElementById("app-ui"));
    //
    var orientation = pthis.getPhDevOrientation();
    //
    // We create a "fake" onChangeViewport event to let the emulators know about our properties
    this.sendViewport(this.type, orientation);
    //
    // Register for real orientation changes
    window.addEventListener("orientationchange", function (ev) {
      pthis.changeOrientation(ev);
    });
    //
    return;
  }
  //
  if (devicetype)
    this.viewportParams.devicetype = devicetype;
  if (orientation)
    this.viewportParams.orientation = orientation;
  //
  // If the set arrives from another client or mobile device set the device on the preview,
  // - "server" : is the first setViewport sent from the server after the onStart
  if ((origin !== "server" || physical) && parent !== window) {
    if (devicetype === "desktop")
      parent.postMessage("changedevice:desktop", "*");
    else
      parent.postMessage("changedevice:" + this.viewportParams.devicetype + "-" + this.viewportParams.orientation, "*");
    if (physical)
      parent.postMessage("blockui", "*");
  }
  else if ((origin === "server" && noDevice) && parent !== window && !physical) {
    // The server send server+none if this is the first app linked to the session, in this case if we are in the preview we tell the server the correct device
    parent.postMessage("getSelectedDevice", "*");
  }
};


/*
 * Send current this.viewportParams to server/device
 * @param {type} devicetype
 * @param {type} devicesize
 * @param {type} position
 * @param {type} orientation
 * @param {type} color
 * @returns {undefined}
 */
Client.Device.prototype.sendViewport = function (devicetype, orientation, isMobile)
{
  if (Client.mainFrame.isEditing())
    return;
  //
  var e = [{id: "onChangeViewport", content:
              {
                devicetype: devicetype,
                orientation: orientation,
                origin: Client.id,
                physical: this.isMobile || false
              }}];
  Client.mainFrame.sendEvents(e);
  //
  // If this command was issued by the simulator, override "isMobile" property on the server side
  if (isMobile !== undefined) {
    var send = this.isMobilePreview === undefined;
    this.isMobilePreview = isMobile;
    document.body.classList.toggle("mobile-preview", this.isMobilePreview);
    //
    // First time we need to force update the device on the server side
    if (send) {
      var e = [{id: "onSetDeviceProperties", content: {properties: {_isMobile: isMobile, isPreview: true}}}];
      Client.mainFrame.sendEvents(e);
    }
  }
};


/**
 * Update device properties
 * @param {bool} physical
 * @returns {undefined}
 */
Client.Device.prototype.updateProp = function (physical)
{
  var pthis = this;
  if (!physical)
    var physical = this.viewportParams.devicetype === undefined
            || this.viewportParams.devicetype === null
            || this.viewportParams.devicetype === "none"
            || this.isMobile;

  var appui = document.getElementById("app-ui");
  if (!appui)
    return;
  //
  if (this.operatingSystem === "ios") {
    appui.classList.add("platform-ios");
    appui.classList.add("ios");
  }
  if (this.operatingSystem === "android") {
    appui.classList.add("platform-android");
    appui.classList.add("md");
  }
  //
  if (physical) {
    var delay = Client.isOffline() ? 100 : 0;
    setTimeout(function () {
      pthis.deviceOrientation = pthis.getPhDevOrientation();
      pthis.clientHeight = appui.clientHeight;
      pthis.clientWidth = appui.clientWidth;
      if (!pthis.screenSizeAdjusted) { // so that we measure the screen size only once
        pthis.screenSizeAdjusted = true;
        pthis.screenWidth = pthis.deviceOrientation === "vertical" ? screen.width : screen.height;
        pthis.screenHeight = pthis.deviceOrientation === "vertical" ? screen.height : screen.width;
      }
      //
      if (!(Client.clientType && Client.clientType === "guest")) {
        var e = [{id: "onSetDeviceProperties", content: {properties: pthis.getProp()}}];
        Client.mainFrame.sendEvents(e);
      }
    }, delay);
  }
  else {
    // this one doesn't need the timeout as it's called after setviewport did the job, I think.
    // still, is this the direct effect of setviewport, or rather that waiting for setviewport to end,
    // we obtain the same effect as setting a timeout?
    this.deviceOrientation = this.viewportParams.orientation;
    this.clientHeight = appui.clientHeight;
    this.clientWidth = appui.clientWidth;
    if (!this.screenSizeAdjusted) { // so that we measure the screen size only once
      this.screenSizeAdjusted = true;
      this.screenWidth = this.deviceOrientation === "vertical" ? this.clientWidth : this.clientHeight;
      this.screenHeight = this.deviceOrientation === "vertical" ? this.clientHeight : this.clientWidth;
    }
    //
    if (!(Client.clientType && Client.clientType === "guest")) {
      var e = [{id: "onSetDeviceProperties", content: {properties: this.getProp()}}];
      Client.mainFrame.sendEvents(e);
    }
  }
};


/**
 * Set the next orientation of the device
 */
Client.Device.prototype.changeOrientation = function ()
{
  this.sendViewport(this.type, this.getPhDevOrientation());
};


/**
 * Get the device properties
 */
Client.Device.prototype.getProp = function ()
{
  var p = {
    userAgent: this.userAgent,
    ua: this.ua,
    screenWidth: this.screenWidth,
    screenHeight: this.screenHeight,
    clientWidth: this.clientWidth,
    clientHeight: this.clientHeight,
    language: this.language,
    platform: this.platform,
    deviceType: this.type,
    _isMobile: this.isMobile || this.isMobilePreview, // keep underscore for getter/setter
    _isInsideShell: this.shell === parent || this.shell === window, // keep underscore for getter/setter
    deviceOrientation: this.deviceOrientation,
    browserVersion: this.browserVersion,
    browserName: this.browserName,
    operatingSystem: this.operatingSystem,
    operatingSystemVersion: this.operatingSystemVersion,
    timeZone: moment.tz.guess(),
    launcherID: this.launcherID,
    launcherName: this.launcherName,
    launcherVersion: this.launcherVersion,
    locale: this.locale,
    monthNames: this.monthNames,
    dayNames: this.dayNames,
    firstDayOfWeek: this.firstDayOfWeek,
    version: this.version,
    model: this.model,
    timezone: this.timezone,
    isDayLightSavingTime: this.isDayLightSavingTime,
    numberPattern: this.numberPattern,
    currencyPattern: this.currencyPattern,
    isPWA: this.isPWA
  };
  //
  // Send uuid to server just in case of shell emulator.
  // In case of real shell, this.uuid is undefined and it would overwrite the value sent by launcher
  if (this.shell instanceof Client.ShellEmulator)
    p.uuid = this.uuid;
  //
  return p;
};


/*
 * If you are a phdev, orientation can be read from the window object.
 */
Client.Device.prototype.getPhDevOrientation = function ()
{
  return (window.orientation === 90 || window.orientation === -90) ? "horizontal" : "vertical";
};


/**
 * Execute a server command
 */
Client.Device.prototype.processRequest = function (cmd)
{
  if (cmd.obj === "device-ui") { // this is a command for the device itself (this)
    if (this[cmd.id]) {
      if (cmd.cnt && cmd.cnt.params)
        this[cmd.id].apply(this, cmd.cnt.params);
      else
        this[cmd.id](cmd.cnt || cmd.content);
    }
  }
  else if (this.shell) { // shell command
    this.shell.postMessage(cmd, "*");
  }
};


/**
 * Handle a plugin message
 * @param {Object} cmd
 */
Client.Device.prototype.onMessage = function (cmd)
{
  // For each registered element, check if it's interested in current event
  for (var eleId in this.registeredEleMap) {
    var events = this.registeredEleMap[eleId] || [];
    //
    // If it's interested, give him the current event
    if (events.indexOf(cmd.id) !== -1) {
      var el = Client.eleMap[eleId];
      if (el)
        el.handleRegisteredEvent(cmd);
    }
  }
  //
  if (cmd.client)
    Client.mainFrame.processRequest([cmd]);
  else
    Client.mainFrame.sendEvents([cmd]);
};


/**
 * handle back button
 */
Client.Device.prototype.onBackButton = function ()
{
  history.back();
};


/**
 * Register an element with the events on which it wants to be notified
 * @param {Client.Element} el
 * @param {Array} events
 */
Client.Device.prototype.registerElement = function (el, events)
{
  if (!el || !events)
    return;
  //
  this.registeredEleMap[el.id] = events;
};


/**
 * Remove an element from registeredEleMap
 * @param {Client.Element} el
 */
Client.Device.prototype.unregisterElement = function (el)
{
  if (!el)
    return;
  //
  delete this.registeredEleMap[el.id];
};


/**
 * Update classes basen on theme or other parameters
 */
Client.Device.prototype.updateAppuiClasses = function ()
{
  var dm = Client.mainFrame.theme ? Client.mainFrame.theme.darkMode : undefined;
  if (dm && dm === "false")
    dm = false;
  if (dm && dm === "true")
    dm = true;
  if ((dm && dm === "auto") || dm === undefined) {
    if (window.location.search.includes("previewDark=true"))
      dm = true;
    else {
      if (dm === "auto")
        dm = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
  }
  //
  if (!dm)
    dm = false;
  //
  var appui = document.getElementById("app-ui");
  if (appui) {
    appui.classList.toggle("dark-mode", dm);
    document.body.classList.toggle("dark-mode", dm);
    appui.classList.toggle("ionIcon5", (Client.mainFrame.theme && Client.mainFrame.theme.ionIcons === "5"));
  }
};


/**
 * Get battery level and isPlugged property from navigator
 */
Client.Device.prototype.setBattery = function ()
{
  if (typeof navigator.getBattery !== "function")
    return;
  //
  var setBatteryProperties = function (batteryLevel, isPlugged) {
    var batteryProperties = {};
    if (batteryLevel !== undefined)
      batteryProperties.batteryLevel = batteryLevel;
    //
    if (isPlugged !== undefined)
      batteryProperties.isPlugged = isPlugged;
    //
    var e = [{id: "onSetDeviceProperties", content: {properties: batteryProperties}}];
    Client.mainFrame.sendEvents(e);
  };
  //
  navigator.getBattery().then(function (battery) {
    this.batteryLevel = battery.level * 100;
    this.isPlugged = battery.charging;
    setBatteryProperties(this.batteryLevel, this.isPlugged);
    //
    battery.addEventListener("levelchange", function () {
      this.batteryLevel = battery.level * 100;
      setBatteryProperties(this.batteryLevel);
    }.bind(this), false);
    //
    battery.addEventListener("chargingchange", function () {
      this.isPlugged = battery.charging;
      setBatteryProperties(undefined, this.isPlugged);
    }.bind(this), false);
  }.bind(this));
};


/**
 * Set network state and listen on change network type
 */
Client.Device.prototype.setNetworkState = function ()
{
  try {
    var setNetworkState = function (networkState) {
      if (networkState !== undefined) {
        var e = [{id: "onSetDeviceProperties", content: {properties: {networkState: networkState}}}];
        if (Client.mainFrame)
          Client.mainFrame.sendEvents(e);
        else
          setTimeout(function () {
            Client.mainFrame.sendEvents(e);
          }, 0);
      }
    };
    //
    var retrieveNetworkState = function () {
      this.networkState = "none";
      //
      if (navigator.onLine) {
        this.networkState = navigator.connection.type;
        //
        if (navigator.connection.effectiveType) {
          if (navigator.connection.type === "cellular")
            this.networkState = "cell" + (navigator.connection.effectiveType === "4g" ? "_" : "") + navigator.connection.effectiveType.replace("slow-", "");
          else
            this.networkState = "wifi";
        }
        //
        this.networkState = this.networkState || "unknown";
      }
      setNetworkState(this.networkState);
    }.bind(this);
    retrieveNetworkState();
    //
    navigator.connection.addEventListener("change", retrieveNetworkState, false);
  }
  catch (ex) {
  }
};


/**
 * Get the list of month names based on locale
 */
Client.Device.prototype.setMonthNames = function ()
{
  var locale = (this.locale || "en-US").replace("_", "-");
  this.monthNames = [];
  //
  for (let i = 0; i < 12; i++) {
    var date = new Date(2020, i, 15, 0, 0, 0, 0);
    this.monthNames.push(date.toLocaleDateString(locale, {month: "long"}));
  }
};


/**
 * Get the list of week day names based on locale
 */
Client.Device.prototype.setDayNames = function ()
{
  var locale = (this.locale || "en-US").replace("_", "-");
  this.dayNames = [];
  //
  for (let i = 0; i < 7; i++) {
    var date = new Date(2020, 10, i + 1, 0, 0, 0, 0);
    this.dayNames.push(date.toLocaleDateString(locale, {weekday: "long"}));
  }
};


/**
 * Lock device orientation
 * @param {String} orientation
 */
Client.Device.prototype.lockOrientation = function (orientation)
{
  if (!this.isPWA)
    return;
  //
  if (window.screen && window.screen.orientation && window.screen.orientation.lock &&
          document.documentElement && document.documentElement.requestFullscreen) {
    // First of all I need to request fullscreen mode, then I can try to lock orientation
    document.documentElement.requestFullscreen().then(function () {
      window.screen.orientation.lock(orientation).then(function () {}).catch(function (ex) {});
    }).catch(function (ex) {});
  }
};


/**
 * Unlock device orientation
 */
Client.Device.prototype.unlockOrientation = function ()
{
  if (window.screen && window.screen.orientation && window.screen.orientation.unlock)
    window.screen.orientation.unlock();
};

/**
 * Set uuid for the device, getting it from cookies or generating it randomly
 */
Client.Device.prototype.setUUID = function ()
{
  var uuidCookieName = "uuid";
  var uuidCookieValue = Client.Utils.getCookie(uuidCookieName) || "";
  //
  if (!uuidCookieValue) {
    // Generate a random uuid
    let hexChars = "0123456789abcdef";
    for (let i = 0; i < 16; i++)
      uuidCookieValue += hexChars[Math.floor(Math.random() * 16)];
    //
    // https://stackoverflow.com/questions/37234687/how-to-set-cookie-secure-flag-using-javascript
    document.cookie = uuidCookieName + "=" + uuidCookieValue + ";" + 999 * 24 * 60 * 60 * 1000 + ";path=/" + (window.location.protocol === "https:" ? ";secure" : "");
  }
  this.uuid = uuidCookieValue;
};


/**
 * Get the pattern of a decimal number
 */
Client.Device.prototype.setNumberPattern = function ()
{
  var locale = (this.locale || "en-US").replace("_", "-");
  var formatter = new Intl.NumberFormat(locale);
  var res = formatter.format(1000.12345);
  //
  var numDecimals = /([\d]*)$/.exec(res)[0].length;
  var pattern = res.replace("1", "#").replace(/[0]{2}/, "##").replace(/([\d]*)$/, "#".repeat(numDecimals));
  var decimal = res.match(/[\D]/g)[1];
  var grouping = res.match(/[\D]/g)[0];
  //
  this.numberPattern = {pattern: pattern, symbol: decimal, fraction: numDecimals,
    rounding: 0, positive: "", negative: "-",
    decimal: decimal, grouping: grouping};
};


/**
 * Get the pattern of a currency
 */
Client.Device.prototype.setCurrencyPattern = function ()
{
  let countryCurrencyMap = {AD: "EUR", AE: "AED", AF: "AFN", AG: "XCD", AI: "XCD", AL: "ALL", AM: "AMD", AN: "ANG", AO: "AOA", AR: "ARS", AS: "USD", AT: "EUR", AU: "AUD", AW: "AWG", AX: "EUR", AZ: "AZN", BA: "BAM", BB: "BBD", BD: "BDT", BE: "EUR", BF: "XOF", BG: "BGN", BH: "BHD", BI: "BIF", BJ: "XOF", BL: "EUR", BM: "BMD", BN: "BND", BO: "BOB", BQ: "USD", BR: "BRL", BS: "BSD", BT: "BTN", BV: "NOK", BW: "BWP", BY: "BYN", BZ: "BZD", CA: "CAD", CC: "AUD", CD: "CDF", CF: "XAF", CG: "XAF", CH: "CHF", CI: "XOF", CK: "NZD", CL: "CLP", CM: "XAF", CN: "CNY", CO: "COP", CR: "CRC", CU: "CUP", CV: "CVE", CW: "ANG", CX: "AUD", CY: "EUR", CZ: "CZK", DE: "EUR", DJ: "DJF", DK: "DKK", DM: "XCD", DO: "DOP", DZ: "DZD", EC: "USD", EE: "EUR", EG: "EGP", EH: "MAD", ER: "ERN", ES: "EUR", ET: "ETB", FI: "EUR", FJ: "FJD", FK: "FKP", FM: "USD", FO: "DKK", FR: "EUR", GA: "XAF", GB: "GBP", GD: "XCD", GE: "GEL", GF: "EUR", GG: "GBP", GH: "GHS", GI: "GIP", GL: "DKK", GM: "GMD", GN: "GNF", GP: "EUR", GQ: "XAF", GR: "EUR", GS: "GBP", GT: "GTQ", GU: "USD", GW: "XOF", GY: "GYD", HK: "HKD", HM: "AUD", HN: "HNL", HR: "HRK", HT: "HTG", HU: "HUF", ID: "IDR", IE: "EUR", IL: "ILS", IM: "GBP", IN: "INR", IO: "USD", IQ: "IQD", IR: "IRR", IS: "ISK", IT: "EUR", JE: "GBP", JM: "JMD", JO: "JOD", JP: "JPY", KE: "KES", KG: "KGS", KH: "KHR", KI: "AUD", KM: "KMF", KN: "XCD", KP: "KPW", KR: "KRW", KW: "KWD", KY: "KYD", KZ: "KZT", LA: "LAK", LB: "LBP", LC: "XCD", LI: "CHF", LK: "LKR", LR: "LRD", LS: "LSL", LT: "LTL", LU: "EUR", LV: "LVL", LY: "LYD", MA: "MAD", MC: "EUR", MD: "MDL", ME: "EUR", MF: "EUR", MG: "MGA", MH: "USD", MK: "MKD", ML: "XOF", MM: "MMK", MN: "MNT", MO: "MOP", MP: "USD", MQ: "EUR", MR: "MRO", MS: "XCD", MT: "EUR", MU: "MUR", MV: "MVR", MW: "MWK", MX: "MXN", MY: "MYR", MZ: "MZN", NA: "NAD", NC: "XPF", NE: "XOF", NF: "AUD", NG: "NGN", NI: "NIO", NL: "EUR", NO: "NOK", NP: "NPR", NR: "AUD", NU: "NZD", NZ: "NZD", OM: "OMR", PA: "PAB", PE: "PEN", PF: "XPF", PG: "PGK", PH: "PHP", PK: "PKR", PL: "PLN", PM: "EUR", PN: "NZD", PR: "USD", PS: "ILS", PT: "EUR", PW: "USD", PY: "PYG", QA: "QAR", RE: "EUR", RO: "RON", RS: "RSD", RU: "RUB", RW: "RWF", SA: "SAR", SB: "SBD", SC: "SCR", SD: "SDG", SE: "SEK", SG: "SGD", SH: "SHP", SI: "EUR", SJ: "NOK", SK: "EUR", SL: "SLL", SM: "EUR", SN: "XOF", SO: "SOS", SR: "SRD", ST: "STD", SV: "SVC", SX: "ANG", SY: "SYP", SZ: "SZL", TC: "USD", TD: "XAF", TF: "EUR", TG: "XOF", TH: "THB", TJ: "TJS", TK: "NZD", TL: "USD", TM: "TMT", TN: "TND", TO: "TOP", TR: "TRY", TT: "TTD", TV: "AUD", TW: "TWD", TZ: "TZS", UA: "UAH", UG: "UGX", UM: "USD", US: "USD", UY: "UYU", UZ: "UZS", VA: "EUR", VC: "XCD", VE: "VEF", VG: "USD", VI: "USD", VN: "VND", VU: "VUV", WF: "XPF", WS: "WST", YE: "YER", YT: "EUR", ZA: "ZAR", ZM: "ZMK", ZW: "ZWL"};
  //
  let countryCode = (this.locale.split("_")[1] || "US");
  let locale = (this.locale || "en-US").replace("_", "-");
  let currencyName = countryCurrencyMap[countryCode.toUpperCase()];
  //
  let formatter = new Intl.NumberFormat(locale, {style: "currency", currency: currencyName});
  let resCurrency = formatter.format(1000.12345);
  //
  let resNumber = resCurrency.match(/(\d|\.|,)/g).join("");
  let currencySymbol = resCurrency.replace(/\d|\.|,|\s/g, "");
  //
  // The same as number pattern (but without replacing decimals numbers with #)
  let numDecimals = /([\d]*)$/.exec(resNumber)[0].length;
  let numberPattern = resNumber.replace("1", "#").replace(/[0]{2}/, "##");
  let decimal = resNumber.match(/[\D]/g)[1];
  let grouping = resNumber.match(/[\D]/g)[0];
  //
  let finalPattern = resCurrency.replace(resNumber, numberPattern).replace(currencySymbol, "¤");
  //
  this.currencyPattern = {pattern: finalPattern, symbol: currencySymbol, fraction: numDecimals,
    rounding: 0, positive: currencySymbol, negative: "-" + currencySymbol,
    decimal, grouping};
};


/**
 * Handle safe area
 * @param {Object} insets
 */
Client.Device.prototype.handleSafeArea = function (insets)
{
  this.safeAreaInsets = insets;
  //
  // Since env(safe-area-inset-*) always return 0 on android, they need to be fixed using cordova-plugin-insets
  if (this.operatingSystem === "android") {
    let root = document.querySelector(":root");
    root.style.setProperty("--safe-area-inset-top", this.safeAreaInsets.top + "px");
    root.style.setProperty("--safe-area-inset-bottom", this.safeAreaInsets.bottom + "px");
    root.style.setProperty("--safe-area-inset-left", this.safeAreaInsets.left + "px");
    root.style.setProperty("--safe-area-inset-right", this.safeAreaInsets.right + "px");
  }
  //
  if (this.fullscreen)
    this.handleFullscreen();
};


/**
 * Set fullscreen
 * @param {Boolean} fullscreen
 */
Client.Device.prototype.setFullscreen = function (fullscreen)
{
  this.fullscreen = fullscreen;
  //
  let appui = document.getElementById("app-ui");
  if (this.fullscreen)
    appui.classList.add("fullscreen");
  else
    appui.classList.remove("fullscreen");
  //
  if (this.fullscreen)
    this.handleFullscreen();
};


/**
 * Handle fullscreen
 */
Client.Device.prototype.handleFullscreen = function ()
{
  // If I don't have safe area insets yet, do nothing
  if (!this.safeAreaInsets)
    return;
  //
  let ids = Object.keys(Client.eleMap);
  for (let i = 0; i < ids.length; i++) {
    let el = Client.eleMap[ids[i]];
    //
    // If el is not a Client.Element skip it
    if (!(el instanceof Client.Element))
      continue;
    //
    el.handleFullscreen();
  }
};
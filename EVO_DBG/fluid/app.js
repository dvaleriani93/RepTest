/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */
/* global Hammer, ArrayBuffer, tippy */

var Client = Client || {};
var InDe = InDe || {};

// command and properties translation maps
Client.transCmdMap = {ue: "updateElement", rc: "removeChild", ib: "insertBefore", ls: "loadStyle",
  cv: "closeView", ov: "openView"};
Client.transPropMap = {v: "value", s: "style", d: "visible", n: "name", cn: "className", c: "class",
  rn: "rownum", t: "innerText", h: "innerHTML"};
Client.transStyleMap = {b: "background", bc: "backgroundColor", c: "color", fs: "fontStyle"};


// Polyfill for ChildNode.remove()
// from:https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/remove()/remove().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('remove')) {
      return;
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);


/**
 * Create the application
 */
Client.createApp = async function ()
{
  this.eleMap = {};
  this.mainFrame = new this.MainFrame();
  this.id = Math.random().toString().substr(2, 6);
  //
  // If I don't have a proxy I need to create one
  // (N.B.: in offline mode a proxy has been already initialized by callee)
  if (!this.proxy) {
    let appname = (Client.resourceName || location.pathname.split("/")[1] || "");
    //
    // Get the SID/CID parameters from query string, session storage or cookie
    let sid = Client.Utils.getQueryVariable("sid");
    sid = sid || sessionStorage.getItem("sid");
    sid = sid || Client.Utils.getCookie("sid");
    //
    let cid = Client.Utils.getQueryVariable("cid");
    cid = cid || sessionStorage.getItem("cid");
    cid = cid || Client.Utils.getCookie("cid");
    //
    // Extract exitUrl
    if (top === window)
      Client.exitUrl = sessionStorage.getItem("exitUrl");
    Client.exitUrl = Client.exitUrl || decodeURIComponent(Client.Utils.getCookie("exitUrl"));
    //
    // Move from cookie store to session store
    try {
      sessionStorage.setItem("sid", sid);
      sessionStorage.setItem("cid", cid);
      sessionStorage.setItem("exitUrl", Client.exitUrl);
    }
    catch (ex) {
    }
    Client.Utils.deleteCookie("sid", appname);
    Client.Utils.deleteCookie("cid", appname);
    Client.Utils.deleteCookie("exitUrl", appname);
    //
    // acid/appid are specific to ideapp
    let acid = Client.Utils.getQueryVariable("acid");
    let appid = Client.Utils.getQueryVariable("appid");
    //
    // if there is a sid
    if (!sid) {
      // No SID. If I'm not inside the IDE (where the app is called "app")
      if (!location.href.includes("/app/")) {
        // I need to check if the user used the client/index.html url
        // If the URL ends with "client/index.html", remove the last part and enter using the main "entry-point"
        let url = location.href;
        if (location.pathname.endsWith("/client/index.html"))
          url = location.origin + location.pathname.substring(0, location.pathname.length - "/client/index.html".length) + location.search;
        else if (location.pathname.endsWith("/client/indexLocal.html"))
          url = location.origin + location.pathname.substring(0, location.pathname.length - "/client/indexLocal.html".length) + location.search;
        //
        // If the URL has been "fixed"
        try {
          await this.fetchSID(url);
          sid = sessionStorage.getItem("sid");
          cid = sessionStorage.getItem("cid");
        }
        catch (ex) {
          console.error("Error while fetching SID:", ex);
          if (url !== location.href)
            location = url;
        }
      }
    }
    //
    if (sid) {
      // Remember session ID
      this.mainFrame.sid = sid;
      //
      // Init the socket (i.e. proxy)
      this.initSocket(sid, cid, acid, appid);
    }
  }
  //
  // Now, if I have a proxy, I can start the app
  if (this.proxy)
    this.mainFrame.start();
};


/**
 * Create a new sessione and get its SID
 * @param {String} appUrl - base app url
 */
Client.fetchSID = async function (appUrl)
{
  let addstr = location.search ? "&" : "?";
  addstr += "addsid";
  let response = await fetch(appUrl + addstr);
  if (!response.ok)
    throw new Error("Network response was not ok");
  //
  let params = new URLSearchParams(new URL(response.url).search);
  let sid = params.get("sid");
  let cid = params.get("cid");
  if (!sid || !cid)
    throw new Error("SID is not contained in response url");
  //
  sessionStorage.setItem("sid", sid);
  sessionStorage.setItem("cid", cid);
};


/**
 * Initialize socket
 * @param {string} sid - session id
 * @param {string} cid - client id
 * @param {string} acid - ide client id
 * @param {string} appid - ide app id
 */
Client.initSocket = function (sid, cid, acid, appid)
{
  var pthis = this;
  var appname = (Client.resourceName || window.location.pathname.split("/")[1] || "");
  //
  // Create the socket
  this.socket = io(Client.resourceOrigin);
  //
  // Define a simpler interface for send
  this.socket.send = function (sender, events) {
    pthis.sentMsgs = pthis.sentMsgs || [];
    pthis.sentMsgs.push(events);
    //
    this.emit("appmsg", {appid: appid, sid: sid, appurl: window.location.href, events: events}, function () {
      // Server received the message -> remove from the sent messages list
      let index = pthis.sentMsgs.indexOf(events);
      if (index > -1)
        pthis.sentMsgs.splice(index, 1);
    });
    //
    // If I'm disconnected -> show delay screen after 3 seconds
    if (pthis.disconnected)
      Client.realizeOfflineScreen(3000);
  };
  //
  // Listen for socket messages
  this.socket.on("redirect", function (url) {
    sessionStorage.clear();
    Client.Utils.deleteCookie("sid");
    Client.Utils.deleteCookie("cid");
    Client.Utils.deleteCookie("exitUrl");
    window.location = url;
  });
  //
  this.socket.on("appmsg", function (m, callback) {
    // Remember the last sent message... if we disconnect I'll send it to the server
    // in order to resynch
    this.lastMsg = JSON.parse(JSON.stringify(m));
    //
    pthis.mainFrame.processRequest(m.content);
    //
    if (callback) // Old servers does not provide the callback
      callback(); // Message received
  }.bind(this));
  //
  // Ping-pong (see server.js on Node side)
  this.socket.on("ping", function () {
    this.emit("pong");
  });
  //
  this.socket.on("disconnect", function () {
    // If the app is terminating, do nothing
    if (Client.terminating)
      return;
    //
    // If I'm inside IDE, don't reconnect -> terminate
    if (acid || appid)
      return pthis.mainFrame.terminate();
    //
    // I'm disconnected
    pthis.disconnected = true;
    //
    // Realize offline screen
    // Do it after 3 sec if there are unsent messages, 15 seconds if there are none
    // (there is always one message: "onSetDeviceProperties" with content "networkState": "none"
    Client.realizeOfflineScreen((pthis.sentMsgs || []).length > 1 ? 3000 : 15000);
    //
    // If we don't reconnect within 30 seconds, do a full refresh
    Client.disconnectTimeoutID = setTimeout(function () {
      // Reconnection failed -> reload the page to restart the app
      window.location.reload();
    }, 30000);
  });
  //
  // Handle reconnection
  this.socket.io.on("reconnect", function (attempt) {
    if (Client.disconnectTimeoutID) {
      clearTimeout(Client.disconnectTimeoutID);
      delete Client.disconnectTimeoutID;
    }
    //
    // I've been reconnected
    delete pthis.disconnected;
    //
    // Reconnection succesfull -> hide offline screen
    Client.removeOfflineScreen();
    //
    // Tell the server that we are connected again
    this.socket.emit("asid", {sid: sid, acid: acid, cid: cid, appname: appname, appurl: window.location.href, lastMsg: this.lastMsg});
    //
    // If there are unsent messages, resynch with server
    if (this.sentMsgs)
      for (let i = 0; i < this.sentMsgs.length; i++) {
        let msg = this.sentMsgs[i];
        this.socket.emit("appmsg", {appid: appid, sid: sid, appurl: window.location.href, events: msg}, function () {
          let index = this.sentMsgs.indexOf(msg);
          if (index > -1) {
            this.sentMsgs.splice(index, 1);
            if (this.sentMsgs.length === 0)
              delete this.sentMsgs;
          }
        }.bind(this));
      }
  }.bind(this));
  //
  // This is my proxy
  this.proxy = this.socket;
  //
  // Send a message with the sid/acid (IDE case), and sid/cid (master case)
  // N.B.: appname is used in the master case for redirecting the right app when the session
  // is no longer available in the server)
  this.socket.emit("asid", {sid: sid, acid: acid, cid: cid, appname: appname, appurl: window.location.href});
};


/**
 * Sets the proxy
 * @param {Object} proxy
 */
Client.setProxy = function (proxy)
{
  this.proxy = proxy;
};


/**
 * Complete loading requirement:
 * some external object require a "callback" function to tell they are ready to operate
 */
Client.callback = function ()
{
  this.mainFrame.reqComplete("callback");
};


/**
 * @class
 */
Client.MainFrame = function ()
{
  this.views = [];
  this.requireMap = {};
  this.cmdCache = [];
  this.device = new Client.Device();
  this.head = new Client.HeaderList();
  this.attachEvents();
  this.addedObjects = [];
  this.appStarted = false;
  this.cmdSeq = 0;
  this.windows = {};
  //
  this.lastHeadObject = document.head.lastChild;
  //
  // Change it to false to disable hammer support
  this.hammerEnabled = true;
  //
  // Change to false to push updates as soon as possible
  Client.useAnimationFrame = true;
  //
  // Try catch is needed to avoid security error when the app is launched on shell
  try {
    Client.isTestAuto = window.top && window.top.location.pathname.indexOf("client/testautoPreview.html") > -1;
  }
  catch (ex) {
  }
};


/**
 * Use Request Animation Frame to execute requests
 */
Client.fireProcessCache = function ()
{
  if (!Client.mainFrame)
    return;
  //
  // If there's a RAF already engaged, do nothing
  if (Client.rafId)
    return;
  //
  // Engage RAF again
  if (Client.mainFrame.cmdCache.length > 0)
    Client.rafId = requestAnimationFrame(Client.mainFrame.processCache.bind(Client.mainFrame));
};


/**
 * Delete overlapping commands
 * @param {Object} req - Server request
 */
Client.MainFrame.prototype.purgeCmdCache = function (req)
{
  if (!this.cmdCache.length)
    return;
  //
  // Waiting for an opening view...
  if (this.paused)
    return;
  //
  // For each new command
  for (var i = 0; i < req.length; i++) {
    // cmd is the new command
    var cmd = req[i];
    //
    // If the structure of the view is changing, don't purge
    if (cmd.id === "insertBefore" || cmd.id === "removeChild")
      return;
    //
    // if we are changing an object property
    if (cmd.id === "updateElement") {
      // Let's see if we had to change the same property
      for (var j = 0; j < this.cmdCache.length; j++) {
        // old is a command already in the cache
        var old = this.cmdCache[j];
        //
        // If the structure of the view is changing, don't purge
        if (old.id === "insertBefore" || old.id === "removeChild")
          return;
        //
        // if we were changing the same object
        if (old.obj === cmd.obj && old.id === "updateElement" && !old.cnt.clid) {
          // let's see the new properties
          var k = Object.keys(cmd.cnt);
          //
          // for each new property, delete it from the previous command
          for (var n = 0; n < k.length; n++) {
            // Depending on its content, the data property in the updateElement command could represent different operations on the object (update data, remove data, add data, ...)
            // If it's deleted, the operation on the object will not be done (https://github.com/progamma/IndeRT/issues/3919)
            if (k[n] === "data")
              continue;
            //
            delete old.cnt[k[n]];
          }
          //
          // if the previous command is empty
          k = Object.keys(old.cnt);
          // delete the command from the cache
          if (!k.length) {
            this.cmdCache.splice(j, 1);
            j--;
          }
        }
      }
    }
  }
};


/**
 * Execute a server request
 * @param {Object} req - Server request
 */
Client.MainFrame.prototype.processRequest = function (req)
{
  this.translate(req);
  //
  let alreadyProcessing = this.cmdCache.length > 0;
  //
  // If the app is terminating, skip any other command
  // as we don't want to change UI while the app is closing
  let terminating = false;
  if (req.length) {
    let l = req[req.length - 1];
    if (!l.obj && l.id === "terminate") {
      terminating = true;
      this.cmdCache.push(l);
    }
  }
  //
  if (!terminating) {
    this.purgeCmdCache(req);
    for (let i = 0; i < req.length; i++) {
      // Don't cache device request, process it immediately
      if (req[i].obj?.startsWith("device-"))
        this.device.processRequest(req[i]);
      else
        this.cmdCache.push(req[i]);
    }
  }
  //
  if (alreadyProcessing)
    return;
  //
  // Execute request
  if (Client.useAnimationFrame && !this.isEditing() && Client.mainFrame.appStarted && !document.hidden)
    Client.fireProcessCache();
  else
    this.processCache();
};


/**
 * Execute cached commands
 */
Client.MainFrame.prototype.processCache = function ()
{
  delete Client.rafId;
  //
  // Not now
  if (this.paused)
    return;
  //
  this.sendChg = true;
  var x = new Date();
  //
  // In case of editing, never exit
  var exit = !this.isEditing() && this.appStarted;
  var report = true;
  //
  while (this.cmdCache.length > 0) {
    var cmd = this.cmdCache[0];
    //
    if (Client.logcmd)
      console.warn(++this.cmdSeq, cmd.obj, cmd.id, JSON.parse(JSON.stringify(cmd.cnt || null)));
    //
    // Do not stop on error, but try to go on
    try {
      this.processCommand(cmd);
    }
    catch (ex) {
      // Report only the first error in this batch
      if (report) {
        report = false;
        //
        // Tell the server that we had a problem for this change
        var s = ex.message || ex;
        if (typeof s === "object") {
          try {
            s = JSON.stringify(s);
          }
          catch (ex2) {
          }
        }
        s = "FE: " + s;
        //
        var cnt = {id: cmd.id, error: {message: s, stack: ex.stack}};
        var e = [{id: "onUpdateElementError", content: cnt}];
        Client.mainFrame.sendEvents(e);
      }
      //
      if (Client.mainFrame.isIDF)
        console.error(ex);
    }
    //
    // Command requires a resource that has not loaded yet, so break
    if (this.paused)
      break;
    //
    // Command handled. Remove it from cache
    this.cmdCache.splice(0, 1);
    //
    // If we are changing the dom, don't exit as we need to complete before showing it to the user
    if (exit && (cmd.id === "insertBefore" || cmd.id === "removeChild"))
      exit = false;
    //
    if (Client.eleMap[cmd.obj] instanceof Client.Widget)
      exit = true;
    //
    // No more than 10 msec. Engage RAF again
    if (exit && Client.useAnimationFrame && new Date() - x > 10) {
      Client.fireProcessCache();
      break;
    }
  }
  //
  this.sendChg = false;
};


/**
 * Process a single command
 * @param {object} cmd - Command to process
 */
Client.MainFrame.prototype.processCommand = function (cmd)
{
  if (!cmd.obj) { // App command
    this[cmd.id](cmd.cnt);
  }
  else if (cmd.obj === "app-academy" && parent && parent.postMessage) { // academy command
    parent.postMessage({type: cmd.id, txt: cmd.txt}, "*");
  }
  else if (cmd.obj === "preview" && parent && parent.postMessage) { // preview command
    parent.postMessage({type: cmd.type, cnt: cmd.cnt}, "*");
  }
  else {
    //
    // Object command
    var ele = Client.eleMap[cmd.obj];
    if (ele && ele[cmd.id]) {
      // Remote custom method or standard one
      if (cmd.cnt && cmd.cnt.params)
        ele[cmd.id].apply(ele, cmd.cnt.params);
      else if (cmd.content)
        ele[cmd.id](cmd.content);
      else
        ele[cmd.id](cmd.cnt);
    }
  }
};


/**
 * Decompress commands
 * @param {Array} cmds
 */
Client.MainFrame.prototype.translate = function (cmds)
{
  // Decompress each command ID in the list
  for (var i = 0; i < cmds.length; i++) {
    var c = cmds[i].id;
    var t = Client.transCmdMap[c];
    if (t)
      cmds[i].id = t;
    //
    // The updateElement command is special because we can compress
    // object properties and style properties
    if (t === "updateElement")
      this.translateProperties(cmds[i].cnt, Client.transPropMap);
  }
};


/**
 * Decompress object properties
 * @param {object} obj
 * @param {object} transMap - translation map
 */
Client.MainFrame.prototype.translateProperties = function (obj, transMap)
{
  var k = Object.keys(obj);
  for (var i = 0; i < k.length; i++) {
    var p = k[i];
    //
    // Let's see if the P property is compressed
    var t = transMap[p];
    if (t) {
      // Convert it
      obj[t] = obj[p];
      delete obj[p];
      //
      // If the style property is concerned, we need to decompress its content
      if (t === "style")
        this.translateProperties(obj[t], Client.transStyleMap);
    }
  }
};


/**
 * Execute activateView command
 * @param {Object} viewid - object containing the view id
 */
Client.MainFrame.prototype.activateView = function (viewid)
{
  var view = Client.eleMap[viewid.id];
  if (view)
    view.activate();
};


/**
 * Send an event collection to the server
 * @param {Array} events
 */
Client.MainFrame.prototype.sendEvents = function (events)
{
  for (let i = 0; i < events.length; i++) {
    let ev = events[i];
    let srcEvent = ev.content?.srcEvent;
    //
    let objname = ev.obj;
    if (Client.mainFrame.isIDF && objname && objname.startsWith("device-"))
      objname = "device-ui";
    //
    let el = Client.eleMap[objname];
    if (el && el.parentWidget && !(el instanceof Client.Widget)) {
      // Route event to parent widget
      let newEvents = el.parentWidget.onEvent(ev);
      //
      if (Client.mainFrame.isIDF) {
        // Eventually set atp, shp and ctp properties on all newEvents
        for (let j = 0; j < newEvents.length; j++) {
          let newEv = newEvents[j];
          //
          if (srcEvent && (srcEvent.altKey || srcEvent.shiftKey || srcEvent.ctrlKey)) {
            newEv.content = newEv.content || {};
            newEv.content.atp = srcEvent.altKey ? -1 : 0;
            newEv.content.shp = srcEvent.shiftKey ? -1 : 0;
            newEv.content.ctp = srcEvent.ctrlKey ? -1 : 0;
          }
        }
      }
      //
      // Remove the i-th event and replace it with new events
      events.splice.apply(events, [i, 1].concat(newEvents));
      //
      // If there are still events to handle, go to next event position
      if (events.length)
        i += (newEvents.length - 1);
    }
    //
    // srcEvent is the browser event. I don't need it anymore
    delete ev.content?.srcEvent;
  }
  //
  if (!events.length)
    return;
  //
  // Old shells cannot route the first getCookie message right.
  // Getting things done.
  if (this.waitingForCookies && events && events.length) {
    if (events[0].source === "shell" && events[0].id === "getCookiesCB" && events[0].content) {
      this.startWithCookies(events[0].content.result);
      return;
    }
  }
  //
  if (Client.logcmd)
    events.forEach(ev => console.warn("<--", ev.id, ev.content));
  //
  // if there are events, send them
  if (Client.proxy)
    Client.proxy.send(this, events);
  else
    console.log("no proxy set");
};


/**
 * Execute openView command
 * @param {Object} view - view representation
 */
Client.MainFrame.prototype.openView = function (view)
{
  // let's see if there are some requirements for the view
  if (!this.loadClientRequirements(view))
    return;
  //
  try {
    var v = new Client.View(view);
    this.views.push(v);
    Client.eleMap[v.id] = v;
    //
    // send a message to the IDE if the view is open in the view editor
    if (this.isEditing())
      Client.eleMap.editm.editProxy.onOpenView();
  }
  finally {
    // Resend app start if required
    this.sendAppStart();
  }
};


/**
 * Execute closeView command
 * @param {Object} viewid - object containing the view id
 */
Client.MainFrame.prototype.closeView = function (viewid)
{
  var view = Client.eleMap[viewid.id];
  if (view)
    view.close();
};


/**
 * Execute alert command
 * @param {String} txt
 */
Client.MainFrame.prototype.alert = function (txt)
{
  alert(txt);
};


/**
 * Open a standard popup
 * @param {object} cnt
 */
Client.MainFrame.prototype.popup = function (cnt)
{
  // The standard implementation does nothing and returns undefined
  if (cnt.cbId) {
    var e = [{id: "popupBoxReturn", content: {res: undefined, cbId: cnt.cbId}}];
    this.sendEvents(e);
  }
};


/**
 * evaluate javascript
 * @param {object} cnt
 */
Client.MainFrame.prototype.eval = function (cnt)
{
  try {
    var res = eval(cnt.jscode);
    var e = [{id: "popupBoxReturn", content: {res: res, cbId: cnt.cbId}}];
    this.sendEvents(e);
  }
  catch (ex) {
    var e = [{id: "popupBoxReturn", content: {err: ex.message || ex, cbId: cnt.cbId}}];
    this.sendEvents(e);
  }
};


/**
 * load requirements/resources
 * @param {object} cnt
 */
Client.MainFrame.prototype.loadResources = function (cnt)
{
  // let's see if there are some requirements for the view
  if (!this.loadRequirements(cnt.resList))
    return;
  var e = [{id: "popupBoxReturn", content: {res: true, cbId: cnt.cbId}}];
  this.sendEvents(e);
};


/**
 * Execute alert command
 * @param {ojg} cnt
 */
Client.MainFrame.prototype.setCookie = function (cnt)
{
  var d = new Date();
  d.setTime(d.getTime() + (cnt.options.exdays * 24 * 60 * 60 * 1000));
  var expires = "; expires=" + d.toUTCString();
  //
  var path = "; path=" + (cnt.options.path || "/");
  var secure = (cnt.options.secure ? "; secure=true" : "");
  var samesite = (cnt.options.samesite ? "; samesite=" + cnt.options.samesite : "");
  //
  // set the cookie
  if (Client.isOffline() || this.device.operatingSystem === "ios") {
    // send request to device
    // lscookies doesn't answer with a callback
    this.device.shell.postMessage({obj: "device-lscookies", id: "setCookie", cnt: {name: cnt.name, value: cnt.value, exdays: cnt.options.exdays}}, "*");
  }
  else
    document.cookie = cnt.name + "=" + cnt.value + expires + path + secure + samesite;
};


/**
 * Execute open command using window.open on browser, inappbrowser on device
 * @param {Object} cnt ( = {href, target, options, cbId} )
 */
Client.MainFrame.prototype.open = function (cnt)
{
  // href missing? do not open anything
  if (!cnt.href) {
    if (cnt.cbId) {
      var e = [{id: "popupBoxReturn", content: {res: false, cbId: cnt.cbId}}];
      this.sendEvents(e);
    }
    return;
  }
  //
  // make sure target is a string
  if (cnt.target)
    cnt.target += "";
  //
  // Inplace app needs absolutization
  if (cnt.href)
    cnt.href = Client.Utils.abs(cnt.href);
  //
  var onmob = this.device.isMobile && this.device.shell && !(this.device.shell instanceof Client.ShellEmulator);
  //
  // Optimize target for different OS in some special cases
  if (!cnt.target) {
    var ext = ["tel:", "mailto:", "sms:", "geo:", "itms:", "itms-apps:", "market:", "http://maps.apple.com"];
    for (var i = 0; i < ext.length; i++) {
      if (cnt.href.startsWith(ext[i])) {
        cnt.target = onmob || this.device.isMobilePreview ? "_system" : "_self";
        //
        // Map is a special case on Android
        if (this.device.operatingSystem === "android" && cnt.href.indexOf("maps") > 0) {
          var qidx = cnt.href.indexOf("?q=");
          if (qidx > 0) {
            cnt.href = "geo:0,0" + cnt.href.substring(qidx);
          }
        }
        if ((this.device.operatingSystem === "ios" || !onmob) && cnt.href.startsWith("geo")) {
          var qidx = cnt.href.indexOf("?q=");
          if (qidx > 0) {
            cnt.href = "http://maps.apple.com/" + cnt.href.substring(qidx);
          }
        }
        break;
      }
    }
  }
  //
  var w;
  //
  if (onmob) {
    this.device.shell.postMessage({obj: "device-inappbrowser", id: "open", cnt: cnt}, "*");
    w = true;
  }
  else {
    if (cnt.options === "close") {
      var ris = this.windows[cnt.target];
      if (ris) {
        w = true;
        ris.close();
      }
    }
    else if (cnt.options === "save") {
      var element = document.createElement('a');
      element.download = cnt.target;
      element.href = cnt.href;
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    else if (cnt.options === "print") {
      if (window.printJS === undefined) {
        if (!cnt.loaded) {
          cnt.loaded = true;
          // load scripts and retry
          this.loadScript("objects/print/print.min.js");
          this.loadCss("objects/print/print.min.css");
        }
        if (!cnt.waitop || cnt.waitop < 10) {
          cnt.waitop = (cnt.waitop || 0) + 1;
          setTimeout(function () {
            this.open(cnt);
          }.bind(this), 100);
          return;
        }
      }
      // Setting onerror handler
      var erf = function (ev) {
        console.error(ev.message);
        ev.preventDefault();
        ev.stopPropagation();
        if (cnt.cbId) {
          var e = [{id: "popupBoxReturn", content: {res: false, cbId: cnt.cbId}}];
          this.sendEvents(e);
        }
        window.removeEventListener("error", erf);
        return false;
      }.bind(this);
      //
      window.addEventListener("error", erf);
      //
      // Preparing operation
      try {
        var op = {};
        if (cnt.target)
          op = JSON.parse(cnt.target);
        op.printable = cnt.href;
        op.onPrintDialogClose = function (ev) {
          window.removeEventListener("error", erf);
          if (cnt.cbId) {
            var e = [{id: "popupBoxReturn", content: {res: true, cbId: cnt.cbId}}];
            this.sendEvents(e);
          }
        }.bind(this);
        //
        // Print and return
        window.printJS(op);
        //
        // Patch PrintJS to close print operations when the print dialog closes.
        const handler = () => {
          // Make sure the event only happens once.
          window.removeEventListener('mousemove', handler);
          op.onPrintDialogClose();
          // Remove iframe from the DOM, by default 'printJS'
          const iframe = document.getElementById('printJS');
          if (iframe) {
            iframe.remove();
          }
        };
        setTimeout(() => {
          window.addEventListener('mousemove', handler);
        }, 1000);
        //
      }
      catch (ex) {
        console.error(ex);
        window.removeEventListener("error", erf);
        if (cnt.cbId) {
          var e = [{id: "popupBoxReturn", content: {res: false, cbId: cnt.cbId}}];
          this.sendEvents(e);
        }
      }
      return;
    }
    else {
      // PREVENT the sessionStorage to be cloned in the new window
      // (it's necessary because in sessionStorage there are SID/CID and I don't
      // want an IDC app launched in a new window to start using my own session...
      // it would fail and restart loosing query string parameters)
      var oldSessionStorage = JSON.parse(JSON.stringify(sessionStorage));
      sessionStorage.clear();
      setTimeout(function () {
        for (var k in oldSessionStorage)
          sessionStorage.setItem(k, oldSessionStorage[k]);
      }, 0);
      //
      var ris = window.open(cnt.href, cnt.target, cnt.options);
      if (ris) {
        w = true;
        if (cnt.target && !cnt.target.startsWith("_")) {
          this.windows[cnt.target] = ris;
          try {
            ris.onclose = function () {
              this.windows[cnt.target] = undefined;
            }.bind(this);
          }
          catch (ex) {
            // do nothing if we cannot access the other frame
          }
        }
      }
    }
  }
  if (cnt.cbId) {
    var e = [{id: "popupBoxReturn", content: {res: w, cbId: cnt.cbId}}];
    this.sendEvents(e);
  }
};


/**
 * Display a confirmation box
 * @param {String} opt - contains the text to display in the confirm box and the callback id
 */
Client.MainFrame.prototype.confirm = function (opt)
{
  var r = confirm(opt.txt);
  var e = [{id: "popupBoxReturn", content: {res: r, cbId: opt.cbId}}];
  this.sendEvents(e);
};


/**
 * Display a prompt box
 * @param {Object} opt - contains the text to display in the prompt box and the default input text
 */
Client.MainFrame.prototype.prompt = function (opt)
{
  var r = prompt(opt.txt, opt.def);
  var e = [{id: "popupBoxReturn", content: {res: r, cbId: opt.cbId}}];
  this.sendEvents(e);
};


/**
 * Handle session termination
 * @param {Object} options
 */
Client.MainFrame.prototype.terminate = function (options)
{
  options = options || {};
  Client.terminating = true;
  if (Client.isOffline())
    Client.Proxy.stopApplication();
  if (this.device.shell && !(this.device.shell instanceof Client.ShellEmulator))
    this.device.shell.postMessage("appStopped", "*");
  else {
    sessionStorage.removeItem("sid");
    sessionStorage.removeItem("cid");
    sessionStorage.removeItem("exitUrl");
    //
    if (this.theme.exitUrl === "reload") {
      let l = window.location.href + "";
      let idx = l.indexOf("client/index.html");
      if (idx > -1)
        window.location = l.substring(0, idx);
      else
        window.location.reload(true);
    }
    else {
      if (this.theme.exitUrl)
        window.location = this.theme.exitUrl;
      else {
        if (!options.skipClose)
          window.top.close();
        if (Client.exitUrl)
          window.location = Client.exitUrl;
      }
    }
  }
};


/**
 * Call postMessage on target window
 * @param {Object} msg
 * @param {String} targetWindow
 * @param {String} targetOrigin
 */
Client.MainFrame.prototype.postMessage = function (msg, targetWindow, targetOrigin)
{
  var t;
  //
  // Default target is parent or opener
  if (!targetWindow)
    t = window.parent || window.opener;
  else // There's a target. Get it
    t = window[targetWindow] || this.windows[targetWindow];
  //
  if (t)
    t.postMessage(msg, targetOrigin || "*");
};


/**
 * Remove any added objects
 */
Client.MainFrame.prototype.removeAddedObjects = function ()
{
  for (var i = 0; i < this.addedObjects.length; i++) {
    var obj = this.addedObjects[i];
    try {
      obj.parentNode.removeChild(obj);
    }
    catch (ex) {
      console.log(ex);
    }
  }
  this.addedObjects = [];
};


/**
 * Start the application
 */
Client.MainFrame.prototype.start = function ()
{
  // Skip start in case of testauto. In fact will be the testauto itself that will send onStart event to server
  if (Client.skipStart)
    return;
  //
  if (Client.isOffline() || this.device.operatingSystem === "ios") {
    // get local storage cookies
    this.waitingForCookies = true;
    this.device.shell.postMessage({obj: "device-lscookies", id: "getCookies", cnt: {mode: "startWithCookies"}}, "*");
  }
  else {
    // normal cookie
    var e = [{id: "onStart", content: this.device.getProp()}, {id: "defineStyle"}];
    this.sendEvents(e);
  }
};


/**
 * Start the application
 * @param {object} cookies
 */
Client.MainFrame.prototype.startWithCookies = function (cookies)
{
  // Skip start in case of testauto. In fact will be the testauto itself that will send onStart event to server
  if (Client.skipStart)
    return;
  //
  // local storage cookie
  this.waitingForCookies = false;
  var e = [{id: "onStart", content: this.device.getProp(), cookies: cookies}, {id: "defineStyle"}];
  this.sendEvents(e);
};


/**
 * Send the terminate signal to the server
 */
Client.MainFrame.prototype.onTerminate = function ()
{
  var ok = true;
  try {
    var ae = document.activeElement;
    var we = window.event;
    //
    // non http link won't cause session termination
    if (ae && ae.tagName === "A" && ae.href.indexOf("http") === -1 && we && new Date() - we.timeStamp < 100)
      ok = false;
  }
  catch (ex) {
  }
  //
  if (ok) {
    var e = [{id: "onTerminate"}];
    this.sendEvents(e);
  }
};


/*
* If the user left and he will come back later the browser will restore DOM, restart timers
* but it won't restore socket.io. I need to refresh the page for the client to resynch with server.
 */
Client.MainFrame.onPageShow = function (event)
{
  if (event.persisted) {
    window.location.reload();
  }
};


/**
 * Insert a new state in the browser history
 * @param {object} obj
 */
Client.MainFrame.prototype.historyPush = function (obj)
{
  if (obj.replace)
    window.history.replaceState(obj, obj.title, obj.url);
  else
    window.history.pushState(obj, obj.title, obj.url);
  if (obj.title) {
    var t = document.getElementsByTagName("title")[0];
    if (!t) {
      t = document.createElement("title");
      document.head.appendChild(t);
    }
    t.innerHTML = obj.title;
  }
};


/**
 * Send the popped obj to the server after a "back" action
 * @param {object} obj
 */
Client.MainFrame.prototype.historyPop = function (obj)
{
  var ev = [({id: "onHistoryPop", content: obj})];
  Client.mainFrame.sendEvents(ev);
};


/**
 * Load the CSS
 * @param {sty} sty - the css's to apply
 */
Client.MainFrame.prototype.loadStyle = function (sty)
{
  // let's see if there are some requirements to load
  if (!this.loadClientRequirements(sty))
    return;
  //
  // If there's some css rule to apply to the document, process it
  if (sty.css !== "") {
    //
    // Create a new stylesheet after the other ones
    var head = document.head || document.getElementsByTagName("head")[0];
    var style = document.createElement("style");
    style.type = "text/css";
    //
    // Styles in an inplace app need absolutization
    if (Client.resourceHome)
      sty.css = this.absStyle2(sty.css);
    //
    if (style.styleSheet)
      style.styleSheet.cssText = sty.css; // IE only
    else
      style.appendChild(document.createTextNode(sty.css));
    //
    // removing previous defined styles
    if (this.mystyle)
      head.removeChild(this.mystyle);
    //
    // and applying new ones
    head.appendChild(style);
    this.addedObjects.push(style);
    //
    // Styles in an inplace app need absolutization
    // UPDATE: IOS 10.3.1 breaks font-face substitution
    // if (Client.resourceHome)
    //   this.absStyle(style);
    //
    // Store the created style to remote it later
    this.mystyle = style;
  }
  //
  // the style has also some svg images to create
  if (sty.svg) {
    var body = document.body;
    //
    // For each svg, create an svg element
    for (var i = 0; i < sty.svg.length; i++) {
      //
      var x = document.createElement("x");
      x.innerHTML = sty.svg[i];
      //
      // To append it, first search for the SVG tag inside the X element
      for (var j = 0; j < x.childNodes.length; j++) {
        if (x.childNodes[j].tagName === "svg") {
          this.addedObjects.push(x.childNodes[j]);
          body.insertBefore(x.childNodes[j], body.firstChild);
          break;
        }
      }
    }
  }
  //
  this.theme = sty.theme || {};
  //
  this.device.updateAppuiClasses();
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
  // Base version updates properties only
  for (var p in newTheme.theme) {
    this.theme[p] = newTheme.theme[p];
  }
  //
  this.device.updateAppuiClasses();
};


/**
 * Absolutize an entire stylesheet
 * @param {style} style
 */
Client.MainFrame.prototype.absStyle = function (style)
{
  var r = style.sheet.rules;
  if (r) {
    for (var i = 0; i < r.length; i++) {
      var s = r[i].style;
      if (s) {
        for (var j = 0; j < s.length; j++) {
          var sp = s[j];
          if (Client.Utils.requireAbs(sp))
            s[sp] = Client.Utils.absStyle(s[sp]);
        }
      }
    }
  }
};


/**
 * Absolutize a css text
 * @param {string} csstext
 */
Client.MainFrame.prototype.absStyle2 = function (csstext)
{
  var idx = -1;
  var edx = 0;
  while (true) {
    idx = csstext.indexOf("url('", idx + 1);
    edx = csstext.indexOf("')", idx + 1);
    if (idx === -1 || edx === -1)
      break;
    var before = csstext.substring(idx, edx + 2);
    var after = Client.Utils.absStyle(before);
    if (before !== after) {
      csstext = csstext.substring(0, idx) + after + csstext.substring(edx + 2);
    }
  }
  return csstext;
};


/**
 * Load requirements for a view
 * @param {Array} reqList - requirement list
 */
Client.MainFrame.prototype.loadRequirements = function (reqList)
{
  let ok = true;
  let k = Object.keys(reqList);
  for (let i = 0; i < k.length; i++) {
    let r = k[i];
    //
    // Already requested?
    if (this.requireMap[r] === undefined) {
      // No, put the request into the map to load it in a while
      this.paused = true;
      ok = false;
      this.requireMap[r] = reqList[r].type;
    }
  }
  //
  // Load missing requirements
  this.processRequirements();
  return ok;
};


/**
 * Go on with requirement loading
 */
Client.MainFrame.prototype.processRequirements = function ()
{
  // Parallel pre-cache all requirements
  this.fileContents = this.fileContents || {};
  const promises = Object.keys(this.requireMap).map(async r => {
    if (this.fileContents[r] === undefined) {
      this.fileContents[r] = false;
      try {
        const response = await fetch(Client.Utils.abs(r), {mode: "no-cors"});
      }
      catch (error) {
      }
      this.fileContents[r] = true;
    }
  });
  //
  Promise.all(promises).then(() => {
    // Let's see if another requirement is already loading
    let k = Object.keys(this.requireMap);
    for (let i = 0; i < k.length; i++) {
      let r = k[i];
      if (this.requireMap[r] === "loading")
        return false;
    }
    //
    // No requirement is loading, let's load the next one
    k = Object.keys(this.requireMap);
    for (let i = 0; i < k.length; i++) {
      let r = k[i];
      //
      // Waiting for cache
      if (this.fileContents[r] !== true)
        break;
      //
      let ok = false;
      switch (this.requireMap[r]) {
        case "jc":
          this.loadScript(r);
          ok = true;
          break;
        case "cs":
        case "fo":
          this.loadCss(r);
          ok = true;
          break;
        case "svg":
        case "sv":
          this.loadSvg(r);
          ok = true;
          break;
      }
      if (ok) {
        this.requireMap[r] = "loading";
        break;
      }
    }
  });
};


/**
 * Check if all requirements are loaded
 * @param {string} req url completed or "callback" if a callback has completed
 * @param {boolean} err - true if there was an error loading the resource
 */
Client.MainFrame.prototype.reqComplete = function (req, err)
{
  if (req === "callback") {
    // A callback has completed. Search for callback request and complete them
    let k = Object.keys(this.requireMap);
    for (let i = 0; i < k.length; i++) {
      let r = k[i];
      //
      // A callback has beeing received... move to COMPLETE state all resource
      // that are in a CALLBACK state (i.e. waiting for a callback).
      // There could be a problem is the callback has beeing received BEFORE the onload/onerror event.
      // In this configuration the resource state is still LOADING and it would have been changed to CALLBACK
      // state in the if block below... Thus change to COMLPETE also resource that are still in LOADING state
      // but that were waiting for a callback.
      if ((this.requireMap[r] === "loading" || this.requireMap[r] === "callback") && r.indexOf("callback") > -1)
        this.requireMap[r] = "complete";
    }
  }
  else {
    // If there was an error, the resource is completed (the app can continue loading
    // even if the app will, probably, not work as espected)
    // If the resource was in LOADING state and was waiting for a callback, move it to CALLBACK state
    // When the callback will arrive it will be changed to COMPLETE state (see above if block)
    if (err)
      this.requireMap[req] = "complete";
    else if (this.requireMap[req] === "loading" && req.indexOf("callback") > -1)
      this.requireMap[req] = "callback";
    else
      this.requireMap[req] = "complete";
  }
  //
  // After loading the javascript of a customElement I check if it has other resources to load
  if (!err && this.requireMap[req] === "complete") {
    let classname = req.split("/").pop().split(".")[0];
    if (Client[classname] && Client[classname].getRequirements) {
      let req = Client[classname].getRequirements();
      Object.keys(req).forEach(url => this.requireMap[url] = req[url].type);
    }
  }
  //
  // Check if other requirements are pending
  let k = Object.keys(this.requireMap);
  for (let i = 0; i < k.length; i++) {
    let r = k[i];
    if (this.requireMap[r] !== "complete") {
      this.processRequirements();
      // let's wait for them
      return false;
    }
  }
  //
  // All requirements has been processed, we can go on
  this.paused = false;
  //
  // Restart commands
  this.processCache();
};


/**
 * Send an "app started" message to the shell
 */
Client.MainFrame.prototype.sendAppStart = function ()
{
  if (!this.appStarted) {
    setTimeout(function () {
      // If all commands were processed, start app
      if (!this.cmdCache.length) {
        this.appStarted = true;
        //
        if (this.device.shell)
          this.device.shell.postMessage({viewmsg: "appStarted", params: {sid: this.sid}}, "*");
      }
      else {
        // try again later
        this.processCache();
        this.sendAppStart();
      }
    }.bind(this), 100);
  }
};


/**
 * Load a new script into the document
 * @param {string} url
 */
Client.MainFrame.prototype.loadScript = function (url)
{
  var pthis = this;
  var script = document.createElement("script");
  script.type = "text/javascript";
  //
  if (script.readyState) {  //IE
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        pthis.reqComplete(url);
      }
    };
  }
  else {  //Others
    script.onload = function () {
      pthis.reqComplete(url);
    };
    script.onerror = function () {
      pthis.reqComplete(url, true);
    };
  }
  //
  script.src = Client.Utils.abs(url);
  document.body.appendChild(script);
  this.addedObjects.push(script);
};


/**
 * Load a new stylesheet into the document
 * @param {string} url
 */
Client.MainFrame.prototype.loadCss = function (url)
{
  var pthis = this;
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  //
  if (link.readyState) {  //IE
    link.onreadystatechange = function () {
      if (link.readyState === "loaded" || link.readyState === "complete") {
        link.onreadystatechange = null;
        pthis.reqComplete(url);
      }
    };
  }
  else {  //Others
    link.onload = function () {
      pthis.reqComplete(url);
    };
    link.onerror = function () {
      pthis.reqComplete(url, true);
    };
  }
  //
  link.href = Client.Utils.abs(url);
  //
  // Required CSS should be loaded BEFORE previous ones as they refers to
  // library elements that could be reconfigured by app CSS
  document.head.insertBefore(link, this.lastHeadObject.nextSibling);
  this.addedObjects.push(link);
};


/**
 * Load a new stylesheet into the document
 * @param {string} url
 */
Client.MainFrame.prototype.loadSvg = function (url)
{
  var pthis = this;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", Client.Utils.abs(url));
  xhr.onload = function () {
    var body = document.body, x = document.createElement("x");
    x.innerHTML = xhr.responseText;
    for (var i = 0; i < x.childNodes.length; i++) {
      if (x.childNodes[i].tagName === "svg") {
        pthis.addedObjects.push(x.childNodes[i]);
        body.insertBefore(x.childNodes[i], body.firstChild);
        break;
      }
    }
    pthis.reqComplete(url);
  };
  xhr.onerror = function () {
    pthis.reqComplete(url, true);
  };
  xhr.send();
};


Client.MainFrame.prototype.attachEvents = function ()
{
  var pthis = this;
  var appui = document.getElementById("app-ui");
  //
  // set the onresize handler
  window.onresize = function (ev) {
    // update device props
    pthis.device.updateProp();
    // don't want to send resize too often (100 ms is enough)
    if (pthis.resizeTimeout)
      clearTimeout(pthis.resizeTimeout);
    pthis.resizeTimeout = setTimeout(function () {
      pthis.resizeTimeout = undefined;
      for (var i = 0; i < pthis.views.length; i++)
        pthis.views[i].onResize(ev);
      var e = [({id: "onResize", content: {width: appui.clientWidth, height: appui.clientHeight}})];
      Client.mainFrame.sendEvents(e);
      //
      // Scroll android input is needed
      if (pthis.device.operatingSystem === "android" && Client.Utils.isNodeEditable(document.activeElement))
        document.activeElement.scrollIntoViewIfNeeded();
    }, ev ? 100 : 0);
  };
  //
  // set the onerror handler
  // online window.onerror is already defined in server/app.js
  if (!Client.isOffline()) {
    let unhandledExceptionFnc = ev => {
      let ex = ev.error ?? ev.reason;
      //
      // If someone throws a string change it to a "standard" exception object...
      if (typeof ex === "string")
        ex = {message: ex, stack: ev.filename + ":" + ev.lineno + "." + ev.colno};
      //
      let cnt = {error: {message: ex.message, stack: ex.stack}};
      let e = [{id: "onUpdateElementError", content: cnt}];
      Client.mainFrame.sendEvents(e);
    };
    window.addEventListener("error", unhandledExceptionFnc);
    window.addEventListener("unhandledrejection", unhandledExceptionFnc);
  }
  //
  // OnPopState
  window.addEventListener("popstate", function (ev) {
    if (!ev.state && pthis.device.isMobile && parent !== window)
      pthis.terminate();
    else
      pthis.historyPop(ev.state);
  }, true);
  //
  // Focus
  appui.addEventListener("focus", function (ev) {
    var el = Client.Utils.findElementFromDomObj(ev.target);
    el?.view?.setActiveElement(el);
    Client.Element.lastFocusedElement = el;
  }, true);
  //
  // Key down
  appui.tabIndex = "0";
  appui.addEventListener("keydown", function (ev) {
    // Hide all tooltip on key down
    try {
      if (ev.key !== "Shift")
        tippy.hideAll();
    }
    catch (ex) {
    }
    //
    var key = Client.Utils.getKey(ev);
    //
    // Get the Client.Element from the html element
    var targetElem = Client.Utils.findElementFromDomObj(ev.target);
    //
    // If the target element doesn't want to handle the key down
    if (targetElem) {
      if (!targetElem.handleKeyDown || !targetElem.handleKeyDown(ev)) {
        // Get the view of the target element
        var currView = targetElem.view ? targetElem.view : targetElem;
        //
        // Find the element to activate
        var elemToAct = currView.findElementToActivate(key);
        //
        // If an element was found, activate it
        if (elemToAct) {
          ev.preventDefault();
          elemToAct.activate();
        }
      }
    }
  }, false);
  //
  // Register last scroll action
  appui.addEventListener("scroll", function (ev) {
    var now = new Date().getTime();
    pthis.lastScrollEvent = {srcElement: ev.srcElement, timeStamp: now};
    //
    // ...cancel touch start if near to a scroll event
    if (pthis.lastTouchEvent) {
      if (now - pthis.lastTouchEvent.timeStamp < 100 &&
              pthis.lastScrollEvent.srcElement.contains(pthis.lastTouchEvent.srcElement)) {
        pthis.preventClick();
      }
    }
  }, {passive: true, capture: true});
  //
  // Register a global touchstart event to...
  appui.addEventListener("touchstart", function (ev) {
    var now = new Date().getTime();
    //
    // Intercept start edge gesture
    var ex = undefined;
    if (pthis.edgeStart === undefined) {
      if (ev.touches.length === 1) {
        var x = ev.touches[0].screenX;
        if (x < 30)
          ex = 0;
        if (window.screen.width - x < 30)
          ex = window.screen.width;
      }
    }
    //
    pthis.lastTouchEvent = {srcElement: ev.srcElement, timeStamp: now, edge: ex};
    //
    // ...cancel touch start if near to a scroll event
    if (pthis.lastScrollEvent) {
      if (now - pthis.lastScrollEvent.timeStamp < 100 &&
              pthis.lastScrollEvent.srcElement.contains(ev.srcElement)) {
        pthis.preventClick();
      }
    }
    //
    // If the user touches outside an uncommitted input
    if (pthis.dirtyInput && ev.target.id !== pthis.dirtyInput) {
      var inp = Client.eleMap[pthis.dirtyInput];
      if (inp)
        inp.commit(ev);
    }
    //
  }, {passive: true, capture: true});
  //
  // Register a global touchmove event to intercept left/right edge gesture
  appui.addEventListener("touchmove", function (ev) {
    if (pthis.lastTouchEvent.edge !== undefined) {
      if (ev.changedTouches.length === 1) {
        var x = ev.changedTouches[0].screenX;
        var dx = Math.abs(x - pthis.lastTouchEvent.edge);
        if (dx > 60 && new Date() - pthis.lastTouchEvent.timeStamp < 200) {
          pthis.edgeGesture(pthis.lastTouchEvent.edge === 0 ? "left" : "right");
          pthis.lastTouchEvent.edge = undefined;
        }
      }
    }
  }, {passive: true, capture: true});
  //
  // Register a global mouseup event to...
  appui.addEventListener("mouseup", function (ev) {
    var now = new Date().getTime();
    //
    // ...cancel touch start if near to a scroll event
    if (pthis.lastScrollEvent) {
      if (now - pthis.lastScrollEvent.timeStamp < 200 &&
              pthis.lastScrollEvent.srcElement.contains(ev.srcElement)) {
        pthis.preventClick();
      }
    }
    //
  }, {passive: true, capture: true});
  //
  // If we are running inside a shell, attach an exit gesture. Not for root apps
  var onmob = this.device.isMobile && this.device.shell && !(this.device.shell instanceof Client.ShellEmulator);
  if (onmob) {
    var h = this.getHammerManager();
    if (h) {
      h.add(new Hammer.Swipe({event: 'exitswipe', pointers: 2, direction: Hammer.DIRECTION_DOWN, threshold: 10, velocity: 0.3}));
      h.on("exitswipe", function () {
        if (!this.device.rootApp)
          this.terminate();
      }.bind(this));
    }
  }
  //
  // Add events relative to maskedinput
  appui.addEventListener("keydown", function (ev) {
    let el = Client.Utils.findElementFromDomObj(ev.target);
    el?.handleMask(ev);
  }, true);
  appui.addEventListener("focus", function (ev) {
    let el = Client.Utils.findElementFromDomObj(ev.target);
    el?.handleMask(ev);
  }, true);
  appui.addEventListener("blur", function (ev) {
    let el = Client.Utils.findElementFromDomObj(ev.target);
    el?.handleMask(ev);
  }, true);
};


/**
 * Save the id of an uncommitted input
 * @param {String} inputId - the id of the input
 */
Client.MainFrame.prototype.setDirtyInput = function (inputId)
{
  // Dirty input is disabled because TH hanlde this edge case
  //this.dirtyInput = inputId;
};


/**
 * Get the id of the current uncommitted input
 * @returns {String}
 */
Client.MainFrame.prototype.getDirtyInput = function ()
{
  return this.dirtyInput;
};


/**
 * returns true if the application is in EditMode, false otherwise
 */
Client.MainFrame.prototype.isEditing = function ()
{
  return false;
};


/**
 * Set client role and rtc properties
 * @param {Object} obj
 */
Client.MainFrame.prototype.setClientProperties = function (obj)
{
  // load requirements for webrtc connection
  var req = {"objects/base/webrtc.js": {name: "Webrtc", type: "jc"}, "objects/base/peer.js": {name: "Peer", type: "jc"}};
  if (!this.loadRequirements(req))
    return;
  else {
    if (Client.clientType)
      return;
  }
  //
  if (Client.clientType === undefined) {
    Client.clientType = obj.client;
    //
    // set client role for guest
    if (Client.clientType === "guest")
      Client.clientRole = obj.settings.clientRole;
  }
  //
  var sendAudio = true;
  var sendVideo = true;
  //
  // set guest's/owner's audio/video permission
  var av = (Client.clientType === "guest") ? obj.settings.guestStream : obj.settings.ownerStream;
  if (av.indexOf("v") === -1)
    sendVideo = false;
  if (av.indexOf("a") === -1)
    sendAudio = false;
  //
  if (sendVideo || sendAudio) {
    //
    // create webrtc object & popup
    var pthis = this;
    pthis.createWebRTC({sendVideo: sendVideo, sendAudio: sendAudio}, obj.settings.webRTCsettings);
    //
    // if session was already started, guest has to call owner to connect with this session
    if (obj.settings.ownerPeerId)
      pthis.callOwner(obj.settings.ownerPeerId);
  }
};


/**
 * Create WebRTC element for client
 * @param {Object} streamSettings
 * @param {Object} styleSettings
 */
Client.MainFrame.prototype.createWebRTC = function (streamSettings, styleSettings)
{
  // create and open webrtc popup
  this.rtc = new Client.WebRTC(streamSettings);
  this.rtc.prepareMultiClientPopup(this, styleSettings);
};


/**
 * Set owner's peerId received from server and start call
 * @param {String} id
 */
Client.MainFrame.prototype.callOwner = function (id)
{
  if (Client.clientType !== "owner") {
    //
    // update peerId property
    this.rtc.updateElement({peerId: id});
    //
    // connect to owner
    this.rtc.startCall();
  }
};


/**
 * Disconnect guest from current session
 */
Client.MainFrame.prototype.closeGuest = function ()
{
  this.rtc.endCall();
  this.rtc.removePopup();
  this.rtc = undefined;
  if (Client.clientType === "guest") {
    window.location = Client.exitUrl;
  }
};


/**
 * Close owner rtc popup & disconnect the last guest
 */
Client.MainFrame.prototype.closeOwnerRtc = function ()
{
  if (Client.clientType === "owner") {
    this.rtc.endCall();
    this.rtc.removePopup();
    this.rtc = undefined;
  }
};


Client.MainFrame.prototype.getHammerManager = function ()
{
  if (!this.hammer) {
    // Hammer 2.0.4 does not work on safari iOS 9.2
    var ok = true;
    //
    if (this.device.operatingSystem === "ios" && this.device.operatingSystemVersion &&
            this.device.operatingSystemVersion.trim() === "9.2") {
      ok = false;
      this.hammerEnabled = false;
    }
    //
    if (ok)
      this.hammer = new Hammer.Manager(document.getElementById("app-ui"));
  }
  //
  if (!this.hammer) {
    // create a fake hammer object
    this.hammer = {};
    this.hammer.on = function () {
    };
    this.hammer.off = function () {
    };
    this.hammer.add = function () {
    };
    this.hammer.get = function () {
    };
  }
  //
  return this.hammer;
};

/*
 * Checks if running in offline mode
 */
Client.isOffline = function ()
{
  return Client.Proxy !== undefined;
};


/**
 * Set webRTC popup properties
 * @param {Object} properties
 */
Client.MainFrame.prototype.setWebRTCProperties = function (properties)
{
  if (properties && properties.parent) {
    if (this.rtcParent !== properties.parent) {
      var newParent = document.getElementById(properties.parent);
      if (newParent && this.rtc) {
        this.rtc.dialog.parentNode.removeChild(this.rtc.dialog);
        //
        newParent.appendChild(this.rtc.dialog);
        this.rtc.dialog.classList.remove("rtc-popup-default");
        this.rtc.dialog.classList.add("rtc-popup-custom");
        if (this.rtcParent)
          this.restoreCall();
        this.rtcParent = properties.parent;
      }
    }
  }
};


/**
 * Restore call when there is a change in rtc parent container or in device orientation
 */
Client.MainFrame.prototype.restoreCall = function ()
{
  if (this.rtc)
    this.rtc.restoreCall(Client.clientType);
};


/**
 * Let View know if there is a device somewhere, calling native events (gps..)
 * @param {object} obj
 */
Client.MainFrame.prototype.setPhDevice = function (obj)
{
  Client.phDeviceConnected = obj.device || "";
};


/**
 * Send a message to test auto preview
 * @param {Object} msg
 */
Client.MainFrame.prototype.sendMessageToTestAuto = function (msg)
{
  if (parent.postMessage)
    parent.postMessage(msg, "*");
};


/**
 * Send tag results to test auto preview
 * @param {Object} res
 */
Client.MainFrame.prototype.getTaggingDataResults = function (res)
{
  this.sendMessageToTestAuto({type: "testAutoMsg", content: {id: "taggingDataResults", taggingData: res}});
};


/**
 * Handle console.test command
 * @param {String} name
 * @param {Object} value
 */
Client.MainFrame.prototype.consoleTest = function (name, value) // jshint ignore:line
{

};


/**
 * Command to notify exception to testauto
 * @param {String} msg
 * @param {Object} stack
 */
Client.MainFrame.prototype.sendExceptionToTestAuto = function (msg, stack) // jshint ignore:line
{

};


/**
 * Save testauto tagging data
 * @param {String} data
 */
Client.MainFrame.prototype.setTaggingData = function (data) // jshint ignore:line
{
  var e = [{id: "saveTaggingData", content: data}];
  this.sendEvents(e);
};


/**
 * Close a popup
 * @param {Integer} cbId
 */
Client.MainFrame.prototype.closePopup = function (cbId)
{

};


/**
 * A swipe from edge was recognized
 * to override in UI framework
 * @param {string} side left or right
 */
Client.MainFrame.prototype.edgeGesture = function (side)
{
};


/**
 * Creates the offline screen for an app that goes offline
 * @param {int} delay - optional delay to wait for offline screen to appear
 */
Client.realizeOfflineScreen = function (delay)
{
  // If it's already visibile
  var appui = document.getElementById("app-ui");
  var offlineScreen = appui.getElementsByClassName("app-offline-screen")[0];
  if (offlineScreen)
    return; // Already visibile -> do nothing
  //deleteDttSessions
  // If a delay was requested and I'm already waiting for that delay
  // do nothing (-> keep waiting)
  if (delay && Client.offScr && delay === Client.offScr.delay)
    return;
  //
  // Clear previous timeout (if active)
  if (Client.offScr && Client.offScr.TimerID) {
    clearTimeout(Client.offScr.TimerID);
    delete Client.offScr;
  }
  //
  // If requested, delay the operation
  if (delay) {
    Client.offScr = {delay: delay};
    Client.offScr.TimerID = setTimeout(function () {
      Client.realizeOfflineScreen();
    }, delay);
    return;
  }
  //
  // Create a new offline screen
  offlineScreen = document.createElement("DIV");
  offlineScreen.className = "app-offline-screen";
  //
  var screenContent = document.createElement("DIV");
  screenContent.className = "app-screencover-content";
  offlineScreen.appendChild(screenContent);
  //
  var backImg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  backImg.setAttribute("class", "screencover-icon");
  var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#icon-offlinestate");
  backImg.appendChild(use);
  screenContent.appendChild(backImg);
  //
  var offlineTitle = document.createElement("H1");
  offlineTitle.textContent = "You're offline";
  var offlineSubTitle = document.createElement("H2");
  offlineSubTitle.innerHTML = "Check your connection<br>to continue the session";
  screenContent.appendChild(offlineTitle);
  screenContent.appendChild(offlineSubTitle);
  appui.appendChild(offlineScreen);
  //
  window.setTimeout(function () {
    offlineScreen.classList.add("visible");
  }, 10);
};


/**
 * Removes the offline screen (shown when an app goes offline)
 */
Client.removeOfflineScreen = function ()
{
  // Clear previous timeout (if active)
  if (Client.offScr && Client.offScr.TimerID) {
    clearTimeout(Client.offScr.TimerID);
    delete Client.offScr;
  }
  //
  var appui = document.getElementById("app-ui");
  var offlineScreen = appui.getElementsByClassName("app-offline-screen")[0];
  if (offlineScreen)
    offlineScreen.parentNode.removeChild(offlineScreen);
};


/**
 * Get absolute IP address
 */
Client.MainFrame.prototype.getIP = function ()
{
  var cb = function (ip) {
    var e = [{id: "onIPAddress", content: ip}];
    this.sendEvents(e);
  }.bind(this);
  //
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.ipify.org");
  //
  xhr.onload = function () {
    cb(xhr.responseText);
  };
  //
  xhr.onerror = function () {
    cb();
  };
  //
  xhr.send();
};


/**
 * Prevent Click
 * @param {int} ts
 */
Client.MainFrame.prototype.preventClick = function (ts)
{
  if (!ts)
    ts = 0;
  //
  this._preventClick = new Date().getTime() + ts;
  if (this._preventListeners) {
    for (var i in this._preventListeners) {
      this._preventListeners[i]();
    }
  }
};


/**
 * See if there are click prevented
 * @param {int} ts
 */
Client.MainFrame.prototype.isClickPrevented = function (ts)
{
  if (ts === undefined)
    ts = 250;
  return this._preventClick && new Date() - this._preventClick < ts;
};


/**
 * Register a click prevention listener
 * @param {string} id
 * @param {function} cb
 */
Client.MainFrame.prototype.registerPreventListener = function (id, cb)
{
  if (!this._preventListeners)
    this._preventListeners = {};
  this._preventListeners[id] = cb;
};


/**
 * unregister a click prevention listener
 * @param {string} id
 */
Client.MainFrame.prototype.unregisterPreventListener = function (id)
{
  if (!this._preventListeners)
    return;
  delete this._preventListeners[id];
};


/**
 * Send a feedback request to the server
 */
Client.MainFrame.prototype.feedbackRequest = function ()
{
  var e = [{id: "feedbackCommand", content: {op: "list", filter: ""}}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Receive a response for a feedback request
 * @param {type} response
 */
Client.MainFrame.prototype.feedbackCommandResponse = function (response)
{
  if (response.err) {
    console.error("Error sending the feedback: check if the feedback service is enabled on the server.\nError: " + JSON.stringify(response.err));
  }
  else {
    if (parent && parent.postMessage) {
      parent.postMessage({type: "feedbackResponse", op: response.op, res: response.res}, "*");
    }
  }
  //
  this.feedbackClient.updateAddFeedbackPopup(response);
};


/**
 * Receive the response for the feedback enabled request
 * @param {Object} response
 */
Client.MainFrame.prototype.isFeedbackEnabledResponse = function (response)
{
  if (!this.feedbackClient)
    this.feedbackClient = new Client.feedbackClient({enabled: response.enabled, serverUrl: response.serverUrl, ide: response.ide, showInPreview: response.showInPreview});
  else
    this.feedbackClient.setProps({enabled: response.enabled, serverUrl: response.serverUrl, ide: response.ide, showInPreview: response.showInPreview});
  //
  if (this.showFeedbackPopupOptions) {
    this.showAddFeedbackPopup(this.showFeedbackPopup);
    delete this.showFeedbackPopupOptions;
  }
};


/**
 * Show the popup to add a feedback
 * @param {type} options
 */
Client.MainFrame.prototype.showAddFeedbackPopup = function (options)
{
  if (!this.feedbackClient) {
    this.showFeedbackPopupOptions = options;
    var e = [{id: "isFeedbackEnabled"}];
    Client.mainFrame.sendEvents(e);
    return;
  }
  //
  this.feedbackClient.showAddFeedbackPopup(options);
};


Client.MainFrame.prototype.generateCounter = function ()
{
  this.counter = this.counter || 0;
  return (this.counter++).toString(36);
};


/**
 * Get all requirements from given element hyerarchy
 * @param {Object} el - element representation
 * @param {Object} req
 */
Client.MainFrame.prototype.getRequirements = function (el, req)
{
  if (!el)
    return;
  //
  var elReq = el.req || {};
  //
  // If el has a theme with an idfTheme, get its url and add it to requirements
  if (el.theme && el.theme.idfTheme) {
    // Set idfTheme and idfMobile properties
    this.idfTheme = el.theme.idfTheme;
    this.idfMobile = el.theme.idfMobile === "true";
    //
    // Get theme url and add it to requirements
    var themeUrl = Client.Widget.getThemeUrl(el.theme.idfTheme, el.theme.idfUrl);
    if (themeUrl)
      elReq[themeUrl] = {type: "cs", name: "theme"};
  }
  //
  // If el is not a view, get element requirements using its "getRequirements" method (if any)
  if (el.type !== "view" && Client[el.c] && Client[el.c].getRequirements)
    elReq = Object.assign(elReq, Client[el.c].getRequirements(el));
  //
  // Add element requirements if not already exist
  for (var r in elReq) {
    if (!req[r])
      req[r] = elReq[r];
  }
  //
  var i;
  //
  // Get children requirements
  if (el.elements) {
    for (i = 0; i < el.elements.length; i++)
      this.getRequirements(el.elements[i], req);
  }
  //
  if (el.children) {
    for (i = 0; i < el.children.length; i++)
      this.getRequirements(el.children[i], req);
  }
  //
  if (el.child)
    this.getRequirements(el.child, req);
};


/**
 * Load client requirements
 * @param {Object} el - element representation
 */
Client.MainFrame.prototype.loadClientRequirements = function (el)
{
  var req = [];
  this.getRequirements(el, req);
  //
  return this.loadRequirements(req);
};

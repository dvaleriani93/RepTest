/* global Client */

Client.initFluid = function (offline)
{
  // If they are not an embedded app
  if (top === self) {
    // I clean the URL if by chance it contains? IWLogin or anything else (if I'm offline I let the CMDs pass)
    let p = location.search;
    if (location.search && (!offline || location.search.startsWith("?CMD="))) {
      location.href = location.href.replace(location.search, "");
      return;
    }
  }
  //
  // If I am inside the shell I wait for the initialization commands to be executed
  if (navigator.userAgent.includes("Shell/") && !window._ShellURL) {
    setTimeout(() => Client.initFluid(offline), 50);
    return;
  }
  //
  Client.idfOffline = offline;
  if (offline) {
    Client.serverSessions = {};
    //
    // I run the offline application in the worker
    Client.offlineWorker = Client.createWorker();
  }
  //
  this.eleMap = {};
  this.mainFrame = new Client.MainFrame();
  this.mainFrame.theme = {};
  //
  this.mainFrame.messagesPump = new Client.IdfMessagesPump();
  //
  this.proxy = {};
  this.proxy.send = (mainFrame, events) => {
    for (let i = 0; i < events.length; i++)
      this.mainFrame.messagesPump.addEvent(events[i]);
  };
  //
  let e = [{id: "start", def: Client.IdfMessagesPump.eventTypes.ACTIVE, content: {}}];
  this.mainFrame.sendEvents(e);
  //
  // Start message has to be sent immediately
  this.mainFrame.messagesPump.tick();
  //
  // Then start tick timer
  this.mainFrame.startTickTimer();
  //
  // Fire onStart event
  this.mainFrame.onStart();
  //
  // Se sono offline e nell'URL c'e' CMD= lo passo all'applicazione
  if (Client.idfOffline) {
    let p = location.href.toUpperCase().indexOf('?CMD=');
    if (p !== -1) {
      // Separo CMD e parametri
      let cmd = location.href.substring(p + 5);
      let params = "";
      p = cmd.indexOf("&");
      if (p !== -1) {
        params = cmd.substring(p + 1);
        cmd = cmd.substring(0, p);
      }
      //
      // If I'm inside the shell, I turn it over to her who, in turn, turns it over to serve
      // (required for OAUTH authentication such as Dropbox, ...)
      if (Client.Shell.isInsideShell)
        Client.Shell.sendCmd("SVCCMD", {URL: location.href, CMD: cmd, PARAMS: params});
      else
        this.mainFrame.sendCommand(cmd, params);
    }
  }
};


Client.MainFrame.prototype.onStart = function ()
{

};


Client.MainFrame.prototype.startTickTimer = function ()
{
  this.tickTimer = setInterval(() => this.messagesPump.tick(), 15);
};


Client.MainFrame.prototype.handleIDFResponse = function (reqCode, xmlDoc)
{
  // Get request by code
  let req = this.messagesPump.getRequest(reqCode);
  //
  // If it does not exists or it's not ready, do nothing
  if (!req)
    return;
  //
  // I'm going to handle it, so remove it from messages pump
  this.messagesPump.removeRequest(reqCode);
  //
  // If server response is an error
  if (req.status !== 200 && !Client.idfOffline) {
    // Show error message
    let errorMsg = `Invalid response from server: ResponseCode = ${req.status} - ${req.statusText}` +
            "\n\nPress the OK button to retry.\n\nIf the problem persists contact Technical Support and report this problem";
    // TODO
    /*if (req.status === 12029 || (req.status === 0 && RD3_Glb.IsTouch()))
     errorMsg = ClientMessages.WEP_SRV_NOTFOUND;
     else if (req.status === 0 && RD3_Glb.IsChrome()) // Chrome, delle volte, va in pappa
     errorMsg = "";*/
    //
    // If there is no error message or user confirms, reload the page
    if (!errorMsg || confirm(errorMsg))
      location.reload(true);
    else if (Client.Shell.isInsideShell)
      close();
    //
    return;
  }
  //
  // Get xml response from request
  let xml = xmlDoc || req.responseXML;
  //
  // If responseXML is empty
  if (!xml) {
    if (req.responseText.toLowerCase().includes("<html"))
      location.reload(true);
    return;
  }
  //
  this.currentRequestId = reqCode;
  this.wep?.activeView?.startRequest(reqCode, req);
  //
  let rootNode = xml.getElementsByTagName("rd3")[0];
  //
  // If response is empty, do nothing
  if (!rootNode)
    return;
  //
  for (let i = 0; i < rootNode.childNodes.length; i++) {
    let child = rootNode.childNodes[i];
    if (child.isEqualNode(child.nextElementSibling))
      continue;
    //
    switch (child.nodeName) {
      case "start":
        this.handleStart(child);
        break;

      case "chg":
        this.handleChange(child);
        break;

      case "ins":
        this.handleInsert(child);
        break;

      case "del":
        this.handleDelete(child);
        break;

      case "close":
        this.handleClose(child);
        break;

      case "open":
        this.handleOpen(child);
        break;

      case "msgbox":
        this.handleMessageBox(child);
        break;

      case "error":
        this.handleError(child);
        break;

      case "redirect":
        this.handleRedirect(child);
        break;

      case "opendoc":
        this.handleOpenDocument(child);
        break;

      case "rcache":
        this.handleResetCache(child);
        break;

      case "mulsel":
        this.handleMultiSel(child);
        break;

      case "popup":
        this.handlePopup(child);
        break;

      case "preview":
        this.handlePreview(child);
        break;

      case "focus":
        this.handleFocus(child);
        break;

      case "exe":
        this.handleExecute(child);
        break;

      case "sound":
        this.handleSound(child);
        break;

      case "tooltip":
        this.handleTooltip(child);
        break;

      case "restip":
        this.resetTooltip(child);
        break;

      case "rstgrp":
        this.handleResetGroupedRows(child);
        break;

      case "expgrp":
        //TODO AT
        break;

      case "dbg":
        this.handleDebug(child);
        break;

      case "shell":
        this.handleShell(child);
        break;

      case "resetTree":
        this.handleResetTree(child);
        break;

      case "searchval":
        //TODO AT
        break;

      case "edcmd":
        //TODO AT
        break;
    }
  }
  //
  if (this.executesDelayed) {
    this.executesDelayed.forEach(cmd => Client.eval(cmd));
    delete this.executesDelayed;
  }
  //
  delete this.currentRequestId;
};


Client.MainFrame.prototype.handleStart = function (child)
{
  this.isIDF = true;
  //
  // Show the application container
  document.getElementById("app-ui").style.visibility = "";
  //
  // Create main view configuration
  let mainViewConfig = Client.Widget.createConfigFromXml(child);
  //
  // Open main view
  this.processRequest([{id: "openView", cnt: mainViewConfig}]);
  //
  // TODO: start animation + sound login
  // Client.mainFrame.wep.soundAction(Client.IdfWebEntryPoint.soundDef.login);
  //
  // If I'm inside the shell, I inform that the service has started
  if (Client.Shell.isInsideShell)
    Client.Shell.sendCmd("SERVICESTARTED");
};


Client.MainFrame.prototype.handleChange = function (child)
{
  // Get changed widget id
  let widgetId = child.getAttribute("id");
  //
  // Get widget by id
  let widget = Client.eleMap[widgetId];
  let xmlnTag = widget ? widget.getXMLNodeByClass() : widgetId.substring(0, widgetId.indexOf(":"));
  //
  // I receive and xml having <chg> as root node, but I want a widget node as root node.
  // So ask widget which is its xml node and create a new xml document having widget node as root node.
  let widgetXml = document.createElementNS(null, xmlnTag);
  //
  // Copy attributes from <chg> node
  for (let j = 0; j < child.attributes.length; j++)
    widgetXml.setAttribute(child.attributes[j].nodeName, child.attributes[j].nodeValue);
  //
  // Copy children from <chg> node
  for (let j = 0; j < child.childNodes.length; j++)
    widgetXml.appendChild(child.childNodes[j--]);
  //
  // Get widget configuration
  let config = Client.Widget.createConfigFromXml(widgetXml);
  //
  // Create its new children
  if (config.children.length)
    this.processRequest([{id: "createChildren", obj: widgetId, cnt: config}]);
  //
  // Update its changed properties
  config = JSON.parse(JSON.stringify(config));
  delete config.children;
  //
  this.processRequest([{id: "updateElement", obj: widgetId, cnt: config}]);
};


Client.MainFrame.prototype.handleInsert = function (child)
{
  let previd = child.getAttribute("previd");
  if ((previd && !Client.eleMap[previd])) {
    let nextChild = child.nextElementSibling;
    while (nextChild) {
      if (nextChild.getAttribute("id") === previd) {
        this.handleInsert(nextChild);
        nextChild.remove();
        break;
      }
      nextChild = nextChild.nextElementSibling;
    }
  }
  //
  let xml = child.ownerDocument;
  //
  let changeNode = xml.createElement("chg");
  changeNode.setAttribute("id", child.getAttribute("mas") || child.getAttribute("parid"));
  //
  let newNode = xml.createElement(child.getAttribute("id").split(":")[0]);
  changeNode.appendChild(newNode);
  //
  // Copy attributes from <ins> node
  for (let j = 0; j < child.attributes.length; j++)
    newNode.setAttribute(child.attributes[j].nodeName, child.attributes[j].nodeValue);
  //
  let rootNode = xml.getElementsByTagName("rd3")[0];
  rootNode.appendChild(changeNode);
};


Client.MainFrame.prototype.handleDelete = function (child)
{
  this.processRequest([{id: "removeFromParent", obj: child.getAttribute("id"), cnt: {}}]);
};


Client.MainFrame.prototype.handleClose = function (child)
{
  this.processRequest([{id: "removeChild", obj: this.wep.id, cnt: {id: "view-" + child.getAttribute("id")}}]);
};


Client.MainFrame.prototype.handleOpen = function (child)
{
  // Create view configuration
  let viewConfig = Client.Widget.createConfigFromXml(child);
  //
  // Insert view into wep
  this.processRequest([{id: "insertBefore", obj: this.wep.id, cnt: {child: viewConfig}}]);
};


Client.MainFrame.prototype.handleMessageBox = function (child)
{
  // Extract the messagebox options
  // TODO: voice is for the voice assistant/activator
  //let voice = child.getAttribute("voice");
  //
  let type = parseInt(child.getAttribute("type"));
  let opts = child.getAttribute("opts");
  let text = child.getAttribute("id");
  let callback, buttons, defaultValue;
  if (type !== Client.Widget.msgTypes.ALERT) {
    callback = (result, text) => {
      let event = {
        id: "msgcfr",
        def: Client.IdfMessagesPump.eventTypes.ACTIVE,
        content: {
          oid: "wep",
          obn: text,
          par1: result
        }
      };
      //
      this.sendEvents([event]);
    };
  }
  //
  if (type === Client.Widget.msgTypes.INPUT)
    defaultValue = opts;
  else
    buttons = opts?.split(';').map(text => ({text}));
  //
  this.processRequest([{
      id: "showMessageBox",
      obj: "wep",
      cnt: {
        params: [
          {
            type,
            text,
            buttons,
            defaultValue,
            server: true
          },
          callback
        ]
      }
    }]);
};


Client.MainFrame.prototype.handleError = function (child)
{
  // Extract the error data
  this.processRequest([{
      obj: "wep", id: "showErrorBox", cnt: {
        errorHeader: child.getAttribute("hdr"),
        errorNumber: child.getAttribute("num"),
        errorDescription: child.getAttribute("des"),
        errorEffects: child.getAttribute("eff"),
        errorActions: child.getAttribute("act"),
        errorSource: child.getAttribute("src"),
        errorException: child.getAttribute("exc"),
        errorMessage: child.getAttribute("erm")
      }
    }]);
};


Client.MainFrame.prototype.handleRedirect = function (child)
{
  // TODO: redirect animation + sound logoff
  // Client.mainFrame.wep.soundAction(Client.IdfWebEntryPoint.soundDef.logoff);
  let url = child.getAttribute("id");
  if (url === "!!!") {
    window.open('', '_self', '');
    window.close();
  }
  else
    document.location.assign(url);
};


Client.MainFrame.prototype.handleOpenDocument = function (child)
{
  let docUrl = child.getAttribute("id");
  let features = child.getAttribute("fea");
  //
  // Open new window showing document
  let newWindow = window.open(docUrl, "", features);
  //
  // If a new window has been open, try to focus it
  if (newWindow) {
    try {
      newWindow.focus();
    }
    catch (ex) {
    }
  }
  else if (docUrl.indexOf("mailto:") === -1) { // Otherwise window may has been blocked by browser
    if (Client.IdfWebEntryPoint.redirectWhenBlocked)
      document.location.assign(docUrl);
    else if (Client.IdfWebEntryPoint.alertWhenBlocked)
      Client.Widget.showMessageBox({type: Client.Widget.msgTypes.ALERT, text: Client.IdfResources.t("WEP_POPUP_Blocked")});
  }
};


Client.MainFrame.prototype.handleResetCache = function (child)
{
  let childId = child.getAttribute("id");
  //
  let dataBlockStart;
  let dataBlockEnd;
  //
  // After a reset cache command on a panel, server may sends a range of data. Get its boundaries
  if (childId?.startsWith("pan")) {
    let range = Client.IdfPanel.getDataRange(child);
    dataBlockStart = range.start;
    dataBlockEnd = range.end;
  }
  //
  // Process reset cache command
  let from = parseInt(child.getAttribute("from")) || undefined;
  let to = parseInt(child.getAttribute("to")) || undefined;
  this.processRequest([{id: "resetCache", obj: childId, cnt: {params: [{from, to, dataBlockStart, dataBlockEnd}]}}]);
};


Client.MainFrame.prototype.handleResetGroupedRows = function (child)
{
  this.processRequest([{id: "resetGroupedRows", obj: child.getAttribute("id")}]);
};


Client.MainFrame.prototype.handleResetTree = function (child)
{
  this.processRequest([{id: "resetTree", obj: child.getAttribute("id")}]);
};


Client.MainFrame.prototype.handleMultiSel = function (child)
{
  let value = parseInt(child.getAttribute("value"));
  let index = parseInt(child.getAttribute("row"));
  let reverse;
  //
  // If I have to handle all rows
  if (index === -1) {
    index = undefined;
    //
    // value 1 means "invert selection" while handling all rows
    if (value === 1)
      reverse = true;
  }
  //
  // 1 or 2 means true, 0 means false
  value = value !== 0;
  //
  this.processRequest([{id: "updateMultiSel", obj: child.getAttribute("id"), cnt: {value, index, force: true, reverse}}]);
};


Client.MainFrame.prototype.handlePopup = function (child)
{
  // Extract the popup data
  let cnt = {
    commandsetId: child.getAttribute("id"),
    direction: parseInt(child.getAttribute("dir")),
    targetId: child.getAttribute("objid"),
    x: child.hasAttribute("xpos") ? parseInt(child.getAttribute("xpos")) : undefined,
    y: child.hasAttribute("ypos") ? parseInt(child.getAttribute("ypos")) : undefined
  };
  //
  // Use the timer, maybe a command visibility change is later in the XML
  setTimeout(() => {
    this.processRequest([{
        id: "showPopup",
        obj: "wep",
        cnt
      }]);
  }, 0);
};


Client.MainFrame.prototype.handlePreview = function (child)
{
  this.processRequest([{
      id: "showPreview",
      obj: "wep",
      cnt: {
        params: [
          child.getAttribute("capt"),
          child.getAttribute("addr")]
      }
    }]);
};


Client.MainFrame.prototype.handleFocus = function (child)
{
  let options = {
    row: parseInt(child.getAttribute("row")),
    selectionStart: child.hasAttribute("sels") ? parseInt(child.getAttribute("sels")) : undefined,
    selectionEnd: child.hasAttribute("sele") ? parseInt(child.getAttribute("sele")) : undefined,
    absoluteRow: child.hasAttribute("absrow") ? parseInt(child.getAttribute("absrow")) : undefined
  };
  //
  // If the panel supports QBEROW and the activeElement is the search cell I don't manage the focus
  if (Client.Widget.getWidgetByElement(Client.Utils.findElementFromDomObj(document.activeElement))?.getParentWidgetByClass(Client.IdfFieldValue)?.index === 0)
    return;
  //
  let field = Client.eleMap[child.getAttribute("id")];
  if (field?.parent?.hasGroupedRows())
    options.absoluteRow = field.parent.groupedRowsRoot.realIndexToGroupedIndex(options.absoluteRow);
  //
  this.processRequest([{
      id: "focus",
      obj: child.getAttribute("id"),
      cnt: {
        params: [options]
      }
    }]);
};


Client.MainFrame.prototype.handleExecute = function (child)
{
  let cmd = child.getAttribute("cmd");
  //
  // If the command starts with * I add it to the list of delayed commands
  // otherwise I execute it right away
  if (cmd.startsWith("*")) {
    this.executesDelayed = this.executesDelayed || [];
    this.executesDelayed.push(cmd.substring(1));
  }
  else
    Client.eval(cmd);
};


Client.MainFrame.prototype.handleSound = function (child)
{
  let name = child.getAttribute("id");
  let action = child.getAttribute("action");
  let options = {
    volume: parseInt(child.getAttribute("volume")) || undefined,
    startTime: parseInt(child.getAttribute("t1")) || undefined,
    endTime: parseInt(child.getAttribute("t2")) || undefined,
    notifyFinish: child.getAttribute("notify") === "1",
    notifyProgress: child.getAttribute("progress") === "1",
    videoDiv: child.getAttribute("video")
  };
  //
  Client.mainFrame.wep.soundAction(name, action, options);
};


Client.MainFrame.prototype.handleTooltip = function (child)
{
  this.processRequest([{
      id: "showTooltip",
      obj: "wep",
      cnt: {
        id: child.getAttribute("id"),
        title: child.getAttribute("title"),
        text: child.getAttribute("text"),
        anchorx: parseInt(child.getAttribute("anchorx")) || undefined,
        anchory: parseInt(child.getAttribute("anchory")) || undefined,
        position: parseInt(child.getAttribute("position")) || 0,
        showdelay: parseInt(child.getAttribute("showdelay")) || 750,
        hidedelay: parseInt(child.getAttribute("hidedelay")) || 4000,
        showoninactivity: child.getAttribute("showoninactivity") === "1",
        haswhisker: child.getAttribute("haswhisker") ? child.getAttribute("haswhisker") === "1" : true,
        width: parseInt(child.getAttribute("width")) || undefined,
        height: parseInt(child.getAttribute("height")) || undefined,
        style: child.getAttribute("style") ? child.getAttribute("style") : "info",
        image: child.getAttribute("image")
      }
    }]);
};


Client.MainFrame.prototype.resetTooltip = function (child)
{
  this.processRequest([{
      id: "resetTooltips",
      obj: "wep",
      cnt: {
        id: child.getAttribute("id")
      }
    }]);
};


Client.MainFrame.prototype.handleDebug = function (child)
{
  let sessionName = child.getAttribute("SESS");
  //
  let usePopupFrame = (/* TODO: RD3_Glb.IsTouch() ||*/ Client.Shell.isInsideShell);
  let dbgWin = this.openDttView(usePopupFrame, sessionName);
  //
  let content = child.getAttribute("main");
  if (content) {
    dbgWin.document.close();
    dbgWin.document.write(content);
  }
  //
  if (dbgWin.frames) {
    for (let i = 0; i < dbgWin.frames.length; i++) {
      let fr = dbgWin.frames[i];
      switch (fr.name) {
        case "ItemList":
          let itl = child.getAttribute("ItemList");
          if (itl) {
            fr.document.close();
            fr.document.write(itl);
          }
          break;

        case "CmdForm":
          let cmf = child.getAttribute("CmdForm");
          if (cmf) {
            fr.document.close();
            fr.document.write(cmf);
          }
          break;

        case "Detail":
        {
          let dtl = child.getAttribute("Detail");
          if (dtl) {
            fr.document.close();
            fr.document.write(dtl);
          }
          //
          for (let j = 0; j < fr.frames.length; j++) {
            let fr2 = fr.frames[j];
            switch (fr2.name) {
              case "ReqTop":
                let rqt = child.getAttribute("ReqTop");
                if (rqt) {
                  fr2.document.close();
                  fr2.document.write(rqt);
                }
                break;

              case "ReqRef":
                let rqr = child.getAttribute("ReqRef");
                if (rqr) {
                  fr2.document.close();
                  fr2.document.write(rqr);
                }
                break;

              case "ReqPrc":
                let rqp = child.getAttribute("ReqPrc");
                if (rqp) {
                  fr2.document.close();
                  fr2.document.write(rqp);
                }
            }
          }
        }
      }
    }
  }
};


Client.MainFrame.prototype.openDttView = function (usePopupFrame, sessionName)
{
  let dialogName = (sessionName ? "SS_" + sessionName : "_main") + "_dbg";
  let create = false;
  let dialogObj = this[dialogName];
  if (!dialogObj)
    create = true;
  if (!create && (usePopupFrame && !dialogObj.realized))
    create = true;
  if (!create && (!usePopupFrame && dialogObj.closed))
    create = true;
  //
  if (create) {
    if (usePopupFrame) {
      let htmlMessage = "<iframe id='dbg-frame' style='width: 100%; height: 100%;' ></iframe>";
      let def = {
        type: "alert",
        title: "",
        message: htmlMessage,
        style: "debug-message-popup",
        buttons: [{text: Client.IdfResources.t("TIP_TITLE_ChiudiForm"), cancel: true}]
      };
      //
      Client.IonHelper.createAlert(def, function (r, values) { });
      dialogObj = document.getElementById("dbg-frame").contentWindow;
      dialogObj.name = dialogName;
    }
    else
      dialogObj = open("", dialogName);
  }
  //
  return dialogObj;
};


Client.MainFrame.prototype.handleShell = function (child)
{
  if (!Client.Shell.isInsideShell)
    return;
  //
  let cmd = child.getAttribute("cmd");
  let par = child.getAttribute("params");
  let resp = Client.Shell.sendCmd(cmd, par);
  //
  // I send the reply to the server
  if (resp)
    this.sendEvents([{id: "shell", def: Client.IdfMessagesPump.eventTypes.ACTIVE, content: {name: "shell", par1: cmd, par2: par, par3: resp}}]);
};


Client.MainFrame.prototype.sendCommand = function (cmd, params)
{
  let obn = cmd + (params ? "&" + params : "");
  this.sendEvents([{id: "cmd", def: Client.IdfMessagesPump.eventTypes.ACTIVE, content: {obn}}]);
};


/**
 * Load a new stylesheet into the document
 * @param {string} url
 */
Client.MainFrame.prototype.loadCss = function (url)
{
  fetch(Client.Utils.abs(url))
          .then(response => response.text())
          .then(css => {
            if (css) {
              let style = document.createElement("style");
              style.type = "text/css";
              style.appendChild(document.createTextNode(css));
              //
              // Required CSS should be loaded BEFORE previous ones as they refers to
              // library elements that could be reconfigured by app CSS
              document.head.insertBefore(style, this.lastHeadObject.nextSibling);
              this.addedObjects.push(style);
            }
            this.reqComplete(url);
          })
          .catch(() => this.reqComplete(url, true));
};


Client.createWorker = function ()
{
  // I run the server session in a worker ...
  let w = new Worker("?WCI=RD3&WCE=GZ&FN=JScript/full.js");
  w.onmessage = Client.onWorkerMessage;
  w.onerror = Client.onWorkerError;
  //
  // If I have any commands to execute right after the worker is created, I send them now
  if (Client.Shell.isInsideShell && window.RD4_PreInit) {
    for (let i = 0; i < window.RD4_PreInit.length; i++)
      Client.executeOnWorker(w, window.RD4_PreInit[i]);
  }
  //
  Client.sendCookies(w);
  //
  return w;
};


Client.initServerSession = function (name)
{
  // If I am inside the shell, I notice that I am about to start a new worker
  if (Client.Shell.isInsideShell)
    Client.Shell.sendCmd("NEWSS", {NAME: name});
  //
  // I run the server session in a worker and add it to the map
  Client.serverSessions[name] = Client.createWorker();
};


Client.onWorkerMessage = function (message)
{
  switch (message.data.type) {
    case "debug":
      Client.writeToConsole(message.data.message, message.data.channel);
      break;

    case "progress":
      Client.offlineWorker.progress = message.data.message;
      break;

    case "SSM":
    {
      // Messages to send to the server sessions
      switch (message.data.message) {
        case "Start":
        {
          Client.initServerSession(message.data.name);
          Client.serverSessions[message.data.name].postMessage(message.data);
          break;
        }

        case "End":
        {
          if (message.data.kill)
            Client.serverSessions[message.data.name].terminate();
          else
            Client.serverSessions[message.data.name].postMessage(message.data);
          break;
        }

        case "Remove":
        {
          Client.serverSessions[message.data.name].terminate();
          delete Client.serverSessions[message.data.name];
          break;
        }

        case "Message":
        {
          Client.serverSessions[message.data.name].postMessage(message.data);
          break;
        }
      }
      break;
    }

    case "EXEC":
      eval(message.data.message);
      break;

    case "db":
      try {
        let db = openDatabase(message.data.name, message.data.ver, message.data.desc, message.data.size);
        if (db && db.close)
          db.close();
      }
      catch (ex) {
        console.error("[OnWorkerMessage] Can't open database: ERROR = " + ex);
      }
      break;

    default:
      let response = message.data;
      let req = Client.mainFrame.messagesPump.getRequest(response.Request.ID);
      //
      // Let's see if the request has been processed by the server
      if (req) {
        // If the request has been processed, I add it to the request queue to be processed and call the management function
        if (response.responseXML) {
          req.responseXML = Client.IdfMessagesPump.parseXml(response.responseXML);
          req.responseText = response.responseXML;
        }
        else
          req.responseText = response.responseText;
      }
      Client.mainFrame.messagesPump.checkResponse(message.data.Request.ID);
      break;
  }
};


Client.onWorkerError = function (error)
{
  Client.writeToConsole(error, "error");
};


Client.executeOnWorker = function (w, js)
{
  if (typeof w === "string") {
    js = w;
    w = Client.offlineWorker;
  }
  w.postMessage({type: 'EXEC', message: js});
};


Client.writeToConsole = function (message, channel)
{
  let msg = "";
  if (message instanceof Error || (window.ErrorEvent && message instanceof window.ErrorEvent)) {
    msg = message.message;
    if (message.stack)
      msg += "\n" + message.stack;
  }
  else
    msg = message;
  //
  switch (channel) {
    case "error":
      console.error(msg);
      break;

    case "output":
      console.log(msg);
      break;
  }
};


Client.sendCookies = function (w)
{
  let cookies = document.cookie.split(";");
  let map = {};
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim().split("=");
    map[decodeURIComponent(cookie[0])] = decodeURIComponent(cookie[1]);
  }
  Client.executeOnWorker(w, "self.cookies = " + JSON.stringify(map) + ";");
};


Client.eval = function (cmd)
{
  try {
    eval(cmd);
  }
  catch (e) {
    console.error(e);
  }
};

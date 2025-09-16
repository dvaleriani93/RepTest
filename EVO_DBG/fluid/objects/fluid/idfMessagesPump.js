/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class Class that handles communication with server
 */
Client.IdfMessagesPump = function ()
{
  this.requestsMap = {};
  this.requestsIds = [];
  this.responsesIds = [];
  this.events = [];
  this.requestNumber = 1;
  //
  // Set server url
  this.serverUrl = location.href.replace(location.search, "");
  //
  // If there is an anchor, remove it
  if (this.serverUrl.indexOf("#") > 0)
    this.serverUrl = this.serverUrl.substring(0, this.serverUrl.indexOf("#"));
  //
  this.serverUrl = this.serverUrl + "?WCI=RD3";
  //
  // Create blocking container
  this.blockingContainer = document.createElement("div");
  this.blockingContainer.className = "blocking-container";
  document.body.appendChild(this.blockingContainer);
  //
  // Delaydlg
  this.delayDlg = new Client.IdfProgressDialog();
  //
  document.getElementById("app-ui").addEventListener("keyup", ev => {
    // If pressed key is "enter", send all cached events
    if (ev.keyCode === 13)
      this.sendEvents(true);
  });
};


Client.IdfMessagesPump.maxOpenRequests = 2;

// Events delays
Client.IdfMessagesPump.defaultDelay = 600000;
Client.IdfMessagesPump.whiteSpaceDelay = 1500;
Client.IdfMessagesPump.keypressDelay = 350;
Client.IdfMessagesPump.superActiveDelay = 200;
Client.IdfMessagesPump.panelScrollDelay = 50;

// Milliseconds after which to open a blocking popup while waiting response from server
Client.IdfMessagesPump.blockingPopupDelay = 5000;


Client.IdfMessagesPump.eventTypes = {
  CLIENTSIDE: 1, // Event will be handled client side
  SERVERSIDE: 2, // Event will be handled server side
  IMMEDIATE: 4, // Event will be sent to server as soon as possible
  BLOCKING: 8, // Need to wait for a server response before sending other events
  //
  DEFERRED: 3, // CLIENTSIDE + SERVERSIDE
  ACTIVE: 7, // CLIENTSIDE + SERVERSIDE + IMMEDIATE
  URGENT: 15 // CLIENTSIDE + SERVERSIDE + IMMEDIATE + BLOCKING
};


/**
 * Create an XMLHttp request
 */
Client.IdfMessagesPump.prototype.createRequest = function ()
{
  // Create request
  let req = Client.idfOffline ? {} : new XMLHttpRequest();
  req.startTime = new Date();
  //
  // Generate a random code for new request
  req.reqCode = "r" + (Math.floor(Math.random() * 1111111));
  //
  // Save request and its code
  this.requestsIds.push(req.reqCode);
  this.requestsMap[req.reqCode] = req;
  //
  return req;
};


/**
 * Add a new event to events queue
 * @param {Object} event
 */
Client.IdfMessagesPump.prototype.addEvent = function (event)
{
  event.startTime = new Date();
  //
  event.blocking = Client.IdfMessagesPump.isBlockingEvent(event.def);
  event.clientSide = Client.IdfMessagesPump.isClientSideEvent(event.def);
  event.serverSide = Client.IdfMessagesPump.isServerSideEvent(event.def);
  //
  // If event doesn't have to be sent to server, don't add it
  if (!event.serverSide)
    return;
  //
  // If event has not a delay, calculate it
  if (!event.delay) {
    // If event has to be sent to server as soon as possible
    if (Client.IdfMessagesPump.isImmediateEvent(event.def)) {
      // For some kinds of event "immediately" means "after a little bit"
      if (event.id === "panscr")
        event.delay = Client.IdfMessagesPump.panelScrollDelay;
      else if (event.id === "keypress")
        event.delay = Client.IdfMessagesPump.keypressDelay;
      else // Otherwise send it with no delay
        event.delay = 0;
    }
    else // Otherwise use default delay (10 minutes)
      event.delay = Client.IdfMessagesPump.defaultDelay;
  }
  //
  // Compare existing events with given one. If an existing event is equal to given event, replace its properties with given one properties and avoid to add given event
  let add = true;
  for (let i = 0; i < this.events.length; i++) {
    if (this.compareEvents(this.events[i], event)) {
      this.copyEvent(this.events[i], event);
      add = false;
      break;
    }
    //
    // If I have to delay the event copies too, set copy start time to event start time
    if (this.events[i].delayCopies && this.events[i].id === event.id)
      this.events[i].startTime = event.startTime;
  }
  //
  // Add event if needed
  if (add)
    this.events.push(event);
};


/**
 * Send all events to server
 * @param {Boolean} immediate
 */
Client.IdfMessagesPump.prototype.sendEvents = function (immediate)
{
  // Cancel events delay
  for (let i = 0; i < this.events.length; i++)
    this.events[i].delay = 0;
  //
  // If required, send events immediately
  if (immediate)
    this.tick();
};


/**
 * This method is called every time requestAnimationFrame is fired
 */
Client.IdfMessagesPump.prototype.tick = function ()
{
  // If there's room for a new request, send it
  if (this.requestsIds.length < Client.IdfMessagesPump.maxOpenRequests)
    this.sendRequest();
  //
  // Get the oldest request start time
  let firstStartTime = 0;
  if (this.requestsIds.length)
    firstStartTime = this.requestsMap[this.requestsIds[0]].startTime;
  //
  // If the oldest request has been open for a long time, show a blocking popup
  if (firstStartTime > 0 && (new Date() - firstStartTime) > Client.IdfMessagesPump.blockingPopupDelay) {
    if (!this.delayDlg.open)
      this.delayDlg.show(Client.mainFrame.wep.SRV_MSG_Wait);
  }
  else {
    if (this.delayDlg.open)
      this.delayDlg.close();
  }
  //
  // Check if there is a blocking request in progress
  let blockingReq = false;
  for (let i = 0; i < this.requestsIds; i++) {
    if (this.requestsMap[this.requestsIds[i]].blocking) {
      blockingReq = true;
      break;
    }
  }
  //
  // If there is a blocking request, show blocking container
  if (blockingReq) {
    this.blockingContainer.style.display = "block";
    document.body.focus();
  }
  else { // Otherwise hide it
    //this.blockingContainer.style.cursor = "default";
    this.blockingContainer.style.display = "";
    this.blockingContainer.style.cursor = "";
  }
  //
  // Handle pending responses
  this.handleResponses();
};


/**
 * Create xml document
 */
Client.IdfMessagesPump.prototype.createXml = function ()
{
  let xml = document.implementation.createDocument("", "rd3", null);
  let processingInstruction = xml.createProcessingInstruction("xml", "version='1.0' encoding='UTF-8'");
  xml.insertBefore(processingInstruction, xml.firstChild);
  //
  let rootNode = xml.getElementsByTagName("rd3")[0];
  rootNode.setAttribute("num", this.requestNumber);
  this.requestNumber++;
  //
  // For each event, create a node and append it to main "rd3" node
  this.events.forEach((ev, i) => {
    let node = xml.createElement(ev.id);
    for (let p in ev.content) {
      if (ev.content[p] !== undefined)
        node.setAttribute(p, ev.content[p]);
    }
    // Only for the first event
    if (i === 0) {
      // Send the field with fire
      let field = Client.Widget.getWidgetByElement(Client.Widget.getElementByObj(document.activeElement))?.getParentWidgetByClass(Client.IdfField);
      if (field)
        node.setAttribute("ace", field.id);
    }
    //
    rootNode.appendChild(node);
  });
  //
  this.events.length = 0;
  //
  return xml;
};


/**
 * Parse a xml string
 * @param {String} xml string to parse
 */
Client.IdfMessagesPump.parseXml = function (xml)
{
  return new DOMParser().parseFromString(xml, "text/xml");
};


/**
 * Get request by code
 * @param {String} reqCode
 */
Client.IdfMessagesPump.prototype.getRequest = function (reqCode)
{
  let req = this.requestsMap[reqCode];
  if (!req.responseXML && req.responseText?.startsWith("<?xml"))
    req = {
      status: req.status,
      responseText: req.responseText,
      responseXML: Client.IdfMessagesPump.parseXml(this.removeInvalidCharacters(req.responseText))
    };
  //
  return req;
};


/**
 * Remove request by code
 * @param {String} reqCode
 */
Client.IdfMessagesPump.prototype.removeRequest = function (reqCode)
{
  // Remove request from map
  delete this.requestsMap[reqCode];
  //
  // Remove its id from requests ids array
  let idx = this.requestsIds.indexOf(reqCode);
  if (idx !== -1)
    this.requestsIds.splice(idx, 1);
};


/**
 * Send xmlhttp request to server
 */
Client.IdfMessagesPump.prototype.sendRequest = function ()
{
  // If there are no events, do nothing
  if (!this.events.length)
    return;
  //
  // Check if at least one event is ready to be sent
  // If there are no events ready to be sent, do nothing
  let d = new Date();
  if (!this.events.some(e => d - e.startTime >= e.delay))
    return;
  //
  // Create request
  let req = this.createRequest();
  //
  // Request is blocking if at least one event is blocking
  req.blocking = this.events.some(e => e.blocking);
  //
  // If a request is composed of all skipClearMessages this request should not clear the messages
  req.skipClearMessages = this.events.every(e => Client.IdfMessagesPump.isSkipClearMessageEvent(e.id));
  //
  // Send request
  let reqxml = this.createXml();
  if (Client.idfOffline) {
    req.ID = req.reqCode;
    req.Referrer = document.referrer;
    req.InputStream = new XMLSerializer().serializeToString(reqxml);
    Client.offlineWorker.postMessage(req);
  }
  else {
    let qry = "";
    if (this.requestNumber === 2)
      qry = Client.Shell.sendInfo() + "&RNDID=" + req.reqCode;
    //
    req.open("POST", this.serverUrl + qry, true);
    req.onreadystatechange = () => {
      // Handle response
      if (req.readyState === XMLHttpRequest.DONE)
        this.checkResponse(req.reqCode);
    };
    req.setRequestHeader("Content-Type", "text/xml");
    req.send(reqxml);
  }
};


/**
 * Check a response
 * @param {String} reqCode
 */
Client.IdfMessagesPump.prototype.checkResponse = function (reqCode)
{
  this.responsesIds.push(reqCode);
  this.handleResponses();
};


/**
 * Handle responses received from server
 */
Client.IdfMessagesPump.prototype.handleResponses = function ()
{
  // If there are no responses to handle, do nothing
  if (this.responsesIds.length === 0)
    return;
  //
  // Ask mainframe to handle responses
  for (let i = 0; i < this.responsesIds.length; i++)
    Client.mainFrame.handleIDFResponse(this.responsesIds[i]);
  //
  // All responses have been handled, thus I can empty the responses array
  this.responsesIds = [];
};


/**
 * Remove invalid characters from the xml
 * @param {String} xml
 */
Client.IdfMessagesPump.prototype.removeInvalidCharacters = function (xml)
{
  for (let i = 0; i < xml.length; i++) {
    let ch = xml.charAt(i);
    if (ch === '&' && i < xml.length - 1 && xml.charAt(i + 1) === '#') {
      let j = i;
      //
      // I'm looking for the ; and I memorize what I have seen so far
      let sb = "";
      for (i += 2; i < xml.length; i++) {
        if (xml.charAt(i) !== ';')
          sb += xml.charAt(i);
        else
          break;
      }
      //
      let c = "";
      if (sb.charAt(0) === "x")
        c = parseInt(sb.substr(1), 16);
      else
        c = parseInt(sb, 10);
      //
      if (!(c === 0x9 || c === 0xA || c === 0xD || (c >= 0x20 & c <= 0xD7FF) || (c >= 0xE000 && c <= 0xFFFD))) {
        xml = xml.substr(0, j) + xml.substr(i + 1);
        i -= 2 + sb.length + 1;
      }
    }
  }
  //
  return xml;
};


/**
 * Return true if the two events are equivalent
 * @param {Object} event1
 * @param {Object} event2
 */
Client.IdfMessagesPump.prototype.compareEvents = function (event1, event2)
{
  event1.content = event1.content || {};
  event2.content = event2.content || {};
  //
  // Some events must NEVER be overwritten: panel commands, tree node expansion, focus, keypress, command, IWFiles, customElements
  let noOverwriteEvents = ["pantb", "trnexp", "fev", "keypress", "cmd", "IWFiles", "cseev"];
  if (noOverwriteEvents.indexOf(event1.id) !== -1)
    return false;
  //
  // Some events can be overwritten just if they are related to the same object
  if (["panms", "resize", "sound"].indexOf(event1.id) !== -1 && event1.content.obn !== event2.content.obn)
    return false;
  //
  // Reorder columns event can be overwritten just if the two events are related to the same columns
  if (event1.id === "rdcol" && event1.content.oid === event2.content.oid && (event1.content.par1 !== event2.content.par1 || event1.content.par2 !== event2.content.par2))
    return false;
  //
  // In all other cases, an event can be overwritten by another one if they have same type (the "id" property) and they are related to same object
  return (event1.id === event2.id && event1.content.oid === event2.content.oid);
};


/**
 * Copy event2 properties into equivalent event1 properties
 * @param {Object} event1
 * @param {Object} event2
 */
Client.IdfMessagesPump.prototype.copyEvent = function (event1, event2)
{
  event1.content = event1.content || {};
  event2.content = event2.content || {};
  //
  event1.id = event2.id;
  //
  // Copy object id
  event1.content.oid = event2.content.oid;
  //
  // Copy object name
  event1.content.obn = event2.content.obn;
  //
  // Copy params
  event1.content.par1 = event2.content.par1;
  event1.content.par2 = event2.content.par2;
  event1.content.par3 = event2.content.par3;
  event1.content.par4 = event2.content.par4;
  event1.content.par5 = event2.content.par5;
  event1.content.par6 = event2.content.par6;
  //
  // Copy click coordinates
  event1.content.xck = event2.content.xck;
  event1.content.yck = event2.content.yck;
  //
  // Copy ALT, CTRL, SHIFT
  event1.content.atp = event2.content.atp;
  event1.content.ctp = event2.content.ctp;
  event1.content.shp = event2.content.shp;
  //
  if (event1.delay > event2.delay)
    event1.delay = event2.delay;
  //
  if (event1.updateStartTime)
    event1.startTime = event2.startTime;
  //
  event1.blocking = event2.blocking;
  event1.serverSide = event2.serverSide;
  event1.clientSide = event2.clientSide;
};


/**
 * Check if given event definition refers to a blocking event
 * @param {Integer} eventDef
 */
Client.IdfMessagesPump.isBlockingEvent = function (eventDef)
{
  return eventDef & Client.IdfMessagesPump.eventTypes.BLOCKING;
};


/**
 * Check if given event definition refers to a client side event
 * @param {Integer} eventDef
 */
Client.IdfMessagesPump.isClientSideEvent = function (eventDef)
{
  return eventDef & Client.IdfMessagesPump.eventTypes.CLIENTSIDE;
};


/**
 * Check if given event definition refers to a server side event
 * @param {Integer} eventDef
 */
Client.IdfMessagesPump.isServerSideEvent = function (eventDef)
{
  return eventDef & Client.IdfMessagesPump.eventTypes.SERVERSIDE;
};


/**
 * Check if given event definition refers to an immediate event
 * @param {Integer} eventDef
 */
Client.IdfMessagesPump.isImmediateEvent = function (eventDef)
{
  return eventDef & Client.IdfMessagesPump.eventTypes.IMMEDIATE;
};


/**
 * Check if given event definition refers to an active event
 * @param {Integer} eventDef
 */
Client.IdfMessagesPump.isActiveEvent = function (eventDef)
{
  return eventDef === Client.IdfMessagesPump.eventTypes.ACTIVE;
};


/**
 * Check if given event definition refers to an active event
 * @param {Integer} eventDef
 */
Client.IdfMessagesPump.isSkipClearMessageEvent = function (eventId)
{
  return ["resize","fev","timer"].indexOf(eventId) >= 0;
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};

/**
 * @class Utility class
 */
Client.Utils = function ()
{

};


/**
 * Get a parameter value from the querystring
 * @param {String} variable - the name of the parameter
 * @returns {String}
 */
Client.Utils.getQueryVariable = function (variable)
{
  // Get the querystring
  var query = Client.resourceQuery ? Client.resourceQuery : window.location.search.substring(1);
  //
  // Get key/value pairs from the querystring
  var vars = query.split("&");
  //
  // Search for the parameter
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (decodeURIComponent(pair[0]) === variable)
      return decodeURIComponent(pair[1]);
  }
};


/**
 * Make the url absolute
 * @param {String} url
 */
Client.Utils.abs = function (url)
{
  var ris = url;
  if (!url)
    return ris;
  //
  var toAbs = false;
  if (Client.resourceHome)
    toAbs = url.indexOf("://") === -1 || url.substring(0, 12) === "url(file:///";
  //
  // data: should not be absolutized
  if (toAbs && url.indexOf("data:") >= 0)
    toAbs = false;
  //
  // tel: mailto, sms, geo... should not be absolutized
  if (toAbs) {
    var ext = ["tel:", "mailto:", "sms:", "geo:", "itms:", "itms-apps:", "market:"];
    for (var i = 0; i < ext.length && toAbs; i++) {
      if (url.startsWith(ext[i]))
        toAbs = false;
    }
  }
  //
  if (toAbs)
    ris = this.absUrl(url);
  //
  return ris;
};


/**
 * Returns true if this style property requires absolutization
 * @param {String} prop
 */
Client.Utils.requireAbs = function (prop)
{
  return Client.resourceHome && Client.Utils.absProperties[prop];
};

Client.Utils.absProperties = {
  "background-image": true,
  "backgroundImage": true,
  "background": true,
  "border-image": true,
  "borderImage": true,
  "mask-image": true,
  "maskImage": true,
  "-webkit-mask-image": true,
  "webkitMaskImage": true,
  "list-style-image": true,
  "listStyleImage": true,
  "src": true // font-face
};


/**
 * Make the url absolute (css style version)
 * @param {String} url
 */
Client.Utils.absStyle = function (url)
{
  if (!url)
    return url;
  //
  var idx = url.indexOf("url(");
  while (idx >= 0) {
    var idx2 = url.indexOf(")", idx + 1);
    if (idx2 >= 0) {
      var u = url.substring(idx, idx2 + 1);
      //
      var toAbs = false;
      if (Client.resourceHome)
        toAbs = u.indexOf("://") === -1 || u.substring(0, 12) === "url(file:///";
      //
      // data: should not be absolutized
      if (toAbs && u.indexOf("data:") >= 0)
        toAbs = false;
      //
      if (toAbs)
        url = url.substring(0, idx) + this.absUrl(u) + url.substring(idx2 + 1);
    }
    //
    idx = url.indexOf("url(", idx + 1);
  }
  //
  return url;
};


/**
 * Make the url absolute
 * @param {String} u
 */
Client.Utils.absUrl = function (u)
{
  if (!u)
    return u;
  //
  var ris = u;
  //
  var before = "";
  var after = "";
  if (u.indexOf("url(") === 0) {
    before = "url('";
    after = "')";
    u = u.substr(4, u.length - 5);
    if (u.substring(0, 1) === "'" || u.substring(0, 1) === "\"")
      u = u.substring(1);
    if (u.substr(u.length - 1) === "'" || u.substr(u.length - 1) === "\"")
      u = u.substring(0, u.length - 1);
    if (u.substring(0, 7) === "file://")
      u = u.substring(7);
  }
  //
  var ridx = u.indexOf("/resources/");
  //
  // There are three cases
  // 1) /var/containers ...   ../resources/  ...
  // 2) ../resources/ ...
  // 3) http: ... ...
  // In the first two cases we need to use resource home
  // in the latter, resourceOrigin
  var useHome = (ridx <= 2);
  if (!useHome) {
    if (u.startsWith("/var/containers/")) {
      useHome = true;
      u = ".." + u.substring(ridx);
    }
  }
  //
  if (useHome)
    ris = before + Client.resourceHome + u + after;
  else
    ris = before + Client.resourceOrigin + u + after;
  //
  return ris;
};


/**
 * Find the position of a dom object inside the app-ui div
 * @param {HTMLElement} obj - the object to find the position of
 * @param {HTMLElement} refElem - the element position will be relative to this element
 * @param {Boolean} scroll
 * @returns {Object}
 */
Client.Utils.findElemPos = function (obj, refElem, scroll)
{
  var rect = {};
  var objRect = obj.getBoundingClientRect();
  //
  // If I don't have a reference element, get the app-ui div
  if (!refElem)
    refElem = document.getElementById("app-ui");
  //
  if (refElem) {
    var refElemPos = refElem.getBoundingClientRect();
    //
    // Calculate the element position relative to the reference element
    if (scroll)
      rect.top = objRect.top - (refElemPos.top - refElem.scrollTop);
    else
      rect.top = objRect.top - refElemPos.top;
    //
    if (scroll)
      rect.left = objRect.left - (refElemPos.left - refElem.scrollLeft);
    else
      rect.left = objRect.left - refElemPos.left;
    //
    if (scroll)
      rect.bottom = objRect.bottom - (refElemPos.top - refElem.scrollTop);
    else
      rect.bottom = objRect.bottom - refElemPos.top;
    //
    if (scroll)
      rect.right = objRect.right - (refElemPos.left - refElem.scrollLeft);
    else
      rect.right = objRect.right - refElemPos.left;
  }
  else
    rect = objRect;
  //
  return rect;
};


/**
 * Capitalize a string
 * @param {String} str - the string to capitalize
 * @returns {String}
 */
Client.Utils.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};


/**
 * Extract a cookie from document cookies
 * @param {String} cname - the name of the cookie to extract
 * @returns {String}
 */
Client.Utils.getCookie = function (cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ")
      c = c.substring(1);
    if (c.startsWith(name))
      return c.substring(name.length, c.length);
  }
  return "";
};


/**
 * Delete cookie by name
 * @param {String} cname
 * @param {String} path
 */
Client.Utils.deleteCookie = function (cname, path)
{
  document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT" + (path ? ";path=/" + path : "");
};


/**
 * Return the name of the key pressed
 * @param {KeyboardEvent} ev - the event occured when the user pressed a key
 * @returns {String}
 */
Client.Utils.getKey = function (ev) {

  var key = "";
  if (ev.ctrlKey || ev.metaKey)
    key += "CTRL-";
  if (ev.altKey)
    key += "ALT-";
  if (ev.shiftKey)
    key += "SHIFT-";
  //
  // If it's a function key
  if (ev.keyCode >= 112 && ev.keyCode <= 123) {
    // Find out what function key was pressed
    var fkn = (ev.keyCode - 111) + (ev.shiftKey ? 12 : 0) + ((ev.ctrlKey || ev.metaKey) ? 24 : 0);
    key += "F" + fkn;
  }
  else if (ev.keyCode === 27) // ESC
    key += "ESC";
  else if (ev.keyCode === 13) // ENTER
    key += "ENTER";
  else if (ev.keyCode === 46) // DEL
    key += "DEL";
  else if (ev.keyCode === 8) // BACK
    key += "BACK";
  else
    key += String.fromCharCode(ev.keyCode);
  //
  return key;
};


/**
 * Find an Client.Element from an html object
 * @param {HTMLElement} obj - the dom object of the element to find
 * @returns {Client.Element|undefined}
 */
Client.Utils.findElementFromDomObj = function (obj)
{
  while (obj) {
    if (obj.id) {
      let el = Client.eleMap[obj.id];
      if (el)
        return el;
    }
    obj = obj.parentNode;
  }
};


/**
 * Find obj parent Client.Element
 * @param {HTMLElement} obj - the dom object (or a sub dom object) of the element to find
 * @returns {Client.Element|undefined}
 */
Client.Utils.findParentElementFromDomObj = function (obj)
{
  if (!obj)
    return;
  //
  // Get first obj having an id
  var domObj;
  while (obj) {
    // Check if I'm inside a popup. In this case return a fake client element
    if (obj.classList.contains("alert-wrapper") || obj.classList.contains("popover-content") ||
            obj.classList.contains("action-sheet-container") || obj.classList.contains("loading-wrapper"))
      return {id: "popup", domObj: obj};
    //
    if (obj.id) {
      domObj = obj;
      break;
    }
    //
    // If a dom object has "for" attribute use it to retrieve domObj that I want
    var relatedId = obj.getAttribute("for");
    if (relatedId) {
      domObj = document.getElementById(relatedId);
      break;
    }
    //
    obj = obj.parentNode;
  }
  //
  var elem;
  //
  // Search the element in the elements map
  for (var e in Client.eleMap) {
    var el = Client.eleMap[e];
    if (el && el.domObj === domObj) {
      elem = el;
      break;
    }
  }
  //
  return elem;
};


/**
 * Get first parent scrollable
 * @param {HTMLElement} domObj
 */
Client.Utils.getScrollableParent = function (domObj)
{
  let obj = domObj;
  while (obj && obj.id !== "app-ui") {
    let s = getComputedStyle(obj);
    if (!s)
      return;
    //
    if (s.overflowY === "auto" || s.overflowY === "scroll" || s.overflowY === "overlay")
      return obj;
    //
    obj = obj.parentNode;
  }
};



/**
 * Check if the element is the last node that can get focus in its container
 * @param {HTMLElement} el - the element to check
 * @returns {Boolean}
 */
Client.Utils.isLastFocusableNode = function (el)
{
  // Get the next sibling
  var s = el.nextSibling;
  if (s) {
    // If the sibling is editable, the element is not the last focusable node
    if (Client.Utils.isNodeEditable(s))
      return false;
    //
    // Check if the next element can get focus
    return this.isLastFocusableNode(s);
  }
  //
  return true;
};


/**
 * Check if the element is the first node that can get focus in its container
 * @param {HTMLElement} el - the element to check
 * @returns {Boolean}
 */
Client.Utils.isFirstFocusableNode = function (el)
{
  // Get the previous sibling
  var s = el.previousSibling;
  if (s) {
    // If the sibling is editable, the element is not the first focusable node
    if (Client.Utils.isNodeEditable(s))
      return false;
    //
    // Check if the previous element can get focus
    return this.isFirstFocusableNode(s);
  }
  //
  return true;
};


/**
 * Get the position of the cursor
 * @param {HTMLElement} objInput - the focused element
 * @returns {int}
 */
Client.Utils.getCursorPos = function (objInput)
{
  // If the selectionStart property is supported, use it to get the position of the cursor
  if (typeof (objInput.selectionStart) !== "undefined")
    return objInput.selectionStart;
  else
  {
    try
    {
      // Retrieve the text selection within the document
      var t1 = document.selection.createRange();
      //
      // Select the text of the element that has the cursor
      var t2 = objInput.createTextRange();
      var i1 = 0;
      //
      // Compare the start of the text selection within the element with the start of the text
      // selection within the page
      while (t2.compareEndPoints("StartToStart", t1))
      {
        i1++;
        //
        // Moves the start position of the selection by a character
        t2.moveStart("character");
      }
      return i1;
    }
    catch (ex)
    {
      // In IE you can't get the cursor position in a textarea
      return -1;
    }
  }
};


/**
 * Set the position of the cursor
 * @param {HTMLelement} objInput - the element that has the cursor
 * @param {int} newpos
 */
Client.Utils.setCursorPos = function (objInput, newpos)
{
  try
  {
    // If selectionStart is supported
    if (typeof (objInput.selectionStart) !== "undefined")
    {
      // Select the text
      objInput.select();
      //
      // Set the start position of the selection
      objInput.selectionStart = newpos;
      //
      // Set the end position of the selection
      objInput.selectionEnd = newpos;
    }
    else
    {
      // Select the text
      var t = objInput.createTextRange();
      //
      // Move the start and the end position of the selection
      t.move("character", newpos);
      t.select();
    }
  }
  catch (ex) {
  }
};


/**
 * Get binary Blob() from base64 string. It automatically detects mimetype
 * @param {String} dataURI - string to decode
 * @returns {Blob}
 */
Client.Utils.base64FileDecode = function (dataURI)
{
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);
  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ia], {type: mimeString});
};


/*
 * Generates a query string for making XMLHttpRequest POSTs to your application.
 * It encodesURIComponent of all the parameters, and works for both projects running from the IDE
 * and installed on a Master server
 * @param {object} query - map of {key: value} that translates into &key=value in the querystring
 * @param {boolean} myself - if true, the post is sent to your own app session, otherwise a new session is spawned.
 by default it's true. For IDE projects it's always true
 */
Client.Utils.getRESTQueryString = function (query, myself)
{
  if (typeof myself === "undefined")
    myself = true;
  //
  // parse appid and sid for post
  // Note: Session ID is in the mainFrm JS object, so we shouldn't read cookies.
  var sid = (Client.mainFrame ? Client.mainFrame.sid : "") || Client.Utils.getQueryVariable("sid") || Client.Utils.getCookie("sid");
  var appid = Client.Utils.getQueryVariable("appid") || Client.Utils.getCookie("appid");
  //
  var ide = !!appid; // true if appid has some content and we are running from the ide
  //
  // create base url and query for post
  var qstring = window.location.origin;
  if (ide) {
    qstring += "/" + encodeURIComponent(sid) + "/" + encodeURIComponent(appid.replace(/\//g, "-")) + "/run?mode=rest";
  }
  else {
    // master
    qstring += "/" + window.location.pathname.split("/")[1] + "/?mode=rest";
    if (myself)
      qstring += "&sid=" + encodeURIComponent(sid);
  }
  //
  // add query parameters
  for (var key in query) {
    qstring += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(query[key]);
  }
  //
  return qstring;
};


/**
 * Return true if the id of one of the ancestors of obj is parentId
 * @param {HTMLElement} obj
 * @param {String} parentId
 * @returns {Boolean}
 */
Client.Utils.isMyParent = function (obj, parentId)
{
  if (!obj || obj.id === "app-ui")
    return false;
  //
  var oid = obj.id?.indexOf("dmo_") !== -1 ? obj.id?.substring(4, obj.id.length) : obj.id;
  if (oid === parentId)
    return true;
  //
  return Client.Utils.isMyParent(obj.parentNode, parentId);
};


/**
 * Checks if the selected element is a child of the wanted parent
 * @param {Client.Element} element
 * @param {Client.Element} parent
 * @returns {Boolean}
 */
Client.Utils.isMyParentEl = function (element, parent)
{
  // No need to cycle for this
  if (!parent)
    return false;
  if (element === parent)
    return true;
  //
  while (element) {
    if (element.parent === parent)
      return true;
    element = element.parent;
  }
  //
  return false;
};


Client.Utils.getParentWithClass = function (obj, className)
{
  while (obj) {
    if (obj.className && obj.className.indexOf(className) > -1)
      return obj;
    obj = obj.parentNode;
  }
};


Client.Utils.isChildOfTag = function (obj, tagName)
{
  while (obj) {
    if (obj.tagName && obj.tagName === tagName)
      return true;
    //
    obj = obj.parentNode;
  }
};


/**
 * Get dom object under cursor
 * @param {Number} x
 * @param {Number} y
 * @returns {HTMLElement || undefined}
 */
Client.Utils.getDomObjByCursorPos = function (x, y)
{
  var element;
  var parent;
  //
  var tagPanel = document.getElementById("tagPanel");
  if (tagPanel) {
    parent = tagPanel.parentNode;
    if (parent) {
      tagPanel.remove();
      //
      element = document.elementFromPoint(x, y);
      parent.appendChild(tagPanel);
    }
  }
  //
  return element;
};


/**
 * Get the first related obj
 * @param {String} relatedId
 * @returns {HTMLElement || undefined}
 */
Client.Utils.getRelatedDomObj = function (relatedId)
{
  var domObj;
  var elements = document.querySelectorAll("[for=\"" + relatedId + "\"");
  if (elements && elements[0])
    domObj = elements[0];
  //
  return domObj;
};


/**
 * Check if given node is editable
 * @param {HTMLElement} node
 */
Client.Utils.isNodeEditable = function (node)
{
  return node && (node.tagName === "INPUT" || node.tagName === "TEXTAREA" || node.contentEditable === "true");
};


/**
 * Check if given node is editable
 * @param {HTMLElement} node
 */
Client.Utils.getCSSVarValue = function (varname)
{
  return getComputedStyle(document.documentElement).getPropertyValue(varname)?.trim()?.replace(/"/g, '');
};


/**
 * Generate a random id
 */
Client.Utils.generateRandomId = function ()
{
  return ((Math.random() * 1000) + (Math.random() * 13999)).toString(36);
};


/**
 * Clone given dom object
 * @param {HTMLElement} domObj
 * @param {Map} referencesMap
 */
Client.Utils.cloneDomObj = function (domObj, referencesMap)
{
  if (!domObj)
    return;
  //
  let clone = domObj.cloneNode();
  //
  // If I have a map, associate the original node with the cloned node in the map
  referencesMap?.set(domObj, clone);
  //
  // Recursively clone children
  for (let i = 0; i < domObj.childNodes.length; i++) {
    let originalChild = domObj.childNodes[i];
    let clonedChild = Client.Utils.cloneDomObj(originalChild, referencesMap);
    clone.appendChild(clonedChild);
  }
  //
  return clone;
};
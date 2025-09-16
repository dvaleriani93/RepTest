/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class HeaderList
 * */
Client.HeaderList = function ()
{
  Client.eleMap["header-list-ui"] = this;
};

/**
 * Adds an header
 * @param {Object} obj
 */
Client.HeaderList.prototype.add = function (obj)
{
  if (!obj || !obj.headType)
    return;
  //
  if (obj.headType === "title") {
    window.document.title = obj.value;
  }
  else {
    var keys = Object.keys(obj);
    var head = document.createElement(obj.headType);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] === "headType")
        continue;
      if (keys[i] === "innerHTML") {
        head.innerHTML = obj[keys[i]];
        continue;
      }
      //
      head.setAttribute(keys[i], obj[keys[i]]);
    }
    //
    document.head.appendChild(head);
  }
};

/**
 * Removes an header
 * @param {Object} obj
 */
Client.HeaderList.prototype.remove = function (obj)
{
  if (!obj || !obj.headType)
    return;
  //
  var keys = Object.keys(obj);
  for (var i = 0; i < document.head.childNodes.length; i++) {
    var h = document.head.childNodes[i];
    //
    // Text nodes have no attributes... but we are not interested in them
    if (!h.getAttribute)
      continue;
    //
    var matches = true;
    for (var i1 = 0; i1 < keys.length && matches; i1++) {
      if (keys[i1] === "headType")
        continue;
      if (obj[keys[i1]] !== h.getAttribute(keys[i1]))
        matches = false;
    }
    if (matches) {
      h.parentNode.removeChild(h);
      break;
    }
  }
};

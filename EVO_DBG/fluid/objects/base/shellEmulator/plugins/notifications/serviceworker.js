/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


/**
 * Prepares the notification object base as the options describe it
 * @param {Object} ntcOptions
 * */
var prepareNotification = function (ntcOptions)
{
  var notification = {
    title: ntcOptions.title,
    options: {
      icon: ntcOptions.icon,
      image: ntcOptions.image,
      body: ntcOptions.body,
      actions: ntcOptions.actions,
      data: {
        payload: ntcOptions.payload,
        default: {
          openUrl: ntcOptions.openURL,
          webRequestUrl: ntcOptions.webRequestUrl,
          webRequestOpt: ntcOptions.webRequestOpt
        }
      }
    }
  };
  ntcOptions.actions = ntcOptions.actions || [];
  //
  for (var i = 0; i < ntcOptions.actions.length; i++) {
    var currentAction = ntcOptions.actions[i];
    //
    notification.options.data[currentAction.action] = {
      openUrl: currentAction.openURL,
      webRequestUrl: currentAction.webRequestUrl,
      webRequestOpt: currentAction.webRequestOpt
    };
  }
  ntcOptions.webOptions = ntcOptions.webOptions || {};
  //
  var keys = Object.keys(ntcOptions.webOptions);
  //
  for (var i = 0; i < keys.length; i++)
    notification.options[keys[i]] = ntcOptions.webOptions[keys[i]];
  //
  return notification;
};


// Listen to "push" event
self.addEventListener("push", function (event) {
  if (!(self.Notification && self.Notification.permission === "granted"))
    return;
  //
  var notification = {};
  //
  if (event.data)
    notification = event.data.json();
  //
  notification = this.prepareNotification(notification);
  //
  // show notification
  event.waitUntil(self.registration.showNotification(notification.title, notification.options));
});


/**
 * Executes notification action chosen by user
 * @param {Object} event
 * @param {Object} clients
 * @param {Object} result
 * @param {String} eventName
 * */
doAction = function (event, clients, result, eventName) {
  var _clients = clients;
  //
  result = result || {};
  result.id = event.notification.tag;
  //
  // get choosen action object
  if (event.action)
    result.action = event.action;
  //
  // send post message to all window client
  clients.matchAll({includeUncontrolled: true, type: "window"}).then(function (clients) {
    if (clients && clients.length) {
      var client = clients[0];
      //
      // send message to trigger an event
      client.postMessage({result: result, eventName: eventName, reqId: event.notification.data.reqId});
    }
  });
  //
  // if the calling event is the closure of the notification, exit without doing anything
  if (result.action === "closed")
    return;
  //
  var action = event.notification.data[event.action] || event.notification.data["default"];
  //
  if (action) {
    // possibly open an URL
    if (_clients.openWindow && action.openUrl)
      event.waitUntil(_clients.openWindow(action.openUrl));
    //
    // check if action must do a web request
    if (action.webRequestUrl) {
      var webRequestOpt = action.webRequestOpt || {};
      //
      // prepare request options
      var fetchOptions = {
        method: webRequestOpt.method || "GET",
        headers: webRequestOpt.headers || {},
        body: webRequestOpt.body
      };
      //
      if (fetchOptions.method.toLowerCase() === "post")
        fetchOptions.headers["Content-Type"] = fetchOptions.headers["Content-Type"] || "application/json";
      //
      // do request
      var promise = fetch(action.webRequestUrl, fetchOptions);
      //
      promise.then(function (res) {
        res.json().then(function (json) {
          // if "showResponse" is true, show notification with web request response
          if (webRequestOpt.showResponse && webRequestOpt.showResponse.successMessage && webRequestOpt.showResponse.errorMessage)
            self.registration.showNotification(res.status === 200 ? webRequestOpt.showResponse.successMessage : webRequestOpt.showResponse.errorMessage, {
              body: json ? JSON.stringify(json) : ""
            });
        });
      }.bind(this));
      //
      event.waitUntil(promise);
    }
  }
};


// Listen to notification's "click" event
self.addEventListener('notificationclick', function (event) {
  var notification = event.notification;
  var result = {title: notification.title, message: notification.body, payload: notification.data ? notification.data.payload : null, action: "clicked"};
  doAction(event, clients, result, "Click");
  event.notification.close();
});


// Listen to notification's "close" event
self.addEventListener('notificationclose', function (event) {
  var notification = event.notification;
  var result = {title: notification.title, message: notification.body, payload: notification.data ? notification.data.payload : null, action: "closed"};
  doAction(event, clients, result, "Click")
});





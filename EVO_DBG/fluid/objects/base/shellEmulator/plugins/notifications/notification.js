/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};

/**
 * @class Notification
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Notification = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  this.reqMap = {};
  //
  if ("serviceWorker" in navigator) {
    // listen to "onMessage" event, the messages will be send by service worker
    navigator.serviceWorker.onmessage = function (e) {
      if (e.data.reqId && this.reqMap[e.data.reqId]) {
        // get request from the map
        var req = this.reqMap[e.data.reqId];
        req.result = e.data.result;
        this.shellEmulator.sendEvent(req, e.data.eventName);
      }
    }.bind(this);
  }
};


/**
 * Initialises the service worker used by notifications
 * @param {function} cb - callback function
 */
Client.Plugins.Notification.prototype.initialiseServiceWorker = function (cb)
{
  if ("serviceWorker" in navigator) {
    if (this.registration)
      return cb(true);
    //
    // register and store service worker
    navigator.serviceWorker.register("/app/client/objects/base/shellEmulator/plugins/notifications/serviceworker.js").then(function (serviceWorkerRegistration) {
      this.registration = serviceWorkerRegistration;
      //
      if (cb)
        return cb(true);
    }.bind(this)).catch(function (err) {
      if (cb)
        return cb(false, err);
    });
  }
  else if (cb) {
    return cb(false, "Service workers aren\'t supported in this browser.");
  }
};


/**
 * Prepares the notification object base as the options describe it
 * @param {Object} ntcOptions
 * */
Client.Plugins.Notification.prototype.prepareNotification = function (ntcOptions)
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
        },
        reqId: ntcOptions.reqId
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


/**
 * Gets max number of actions that a notification handles
 */
Client.Plugins.Notification.prototype.getMaxActions = function (req)
{
  // get max actions property
  req.setResult("Notification" in window ? Notification.maxActions : 0);
};


/**
 * Displays a native alert window
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.alert = function (req)
{
  window.alert(req.params.message);
  req.setResult();
};


/**
 * Opens a confirm-type window
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.confirm = function (req)
{
  req.setResult(confirm(req.params.message) ? 2 : 1);
};


/**
 * Opens a prompt-type window that can have two buttons.
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.prompt = function (req)
{
  var response = prompt(req.params.message, req.params.defaultText);
  //
  req.setResult({
    buttonIndex: response ? 2 : 1,
    input1: response
  });
};


/**
 * Emits a series of beeps from the device.
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.beep = function (req)
{
};


/**
 * Returns true if the application has permissions to show notifications to the user, local or push type
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.hasPermission = function (req)
{
  if (!("Notification" in window))
    req.setError("This browser does not support desktop notification");
  else
    req.setResult(Notification.permission === "granted");
};


/**
 * Schedules a local notifications to show
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.schedule = function (req)
{
  if (!("Notification" in window)) {
    req.setError("This browser does not support desktop notification");
  }
  //
  var showNotification = function () {
    var reqId = (Math.random() + "").substring(2);
    this.reqMap[reqId] = req;
    //
    req.params.notification = req.params.notification || {};
    req.params.notification.reqId = reqId;
    //
    var notification = this.prepareNotification(req.params.notification);
    this.registration.showNotification(notification.title, notification.options);
  }.bind(this);
  //
  if (Notification.permission !== 'granted') {
    req.setError("User denied permissions for notifications");
  }
  //
  this.initialiseServiceWorker(showNotification);
};


/**
 * Updates one or more local notifications already scheduled. Notifications are identified by the id property
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.update = function (req)
{
  req.setResult();
};


/**
 * Deletes one or more local notifications already shown to the user. Notifications are identified by the id property.
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.clear = function (req)
{
};


/**
 * Deletes all the local notifications already shown to the user
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.clearAll = function (req)
{
};


/**
 * Deletes one or more scheduled local notifications
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.cancel = function (req)
{
};


/**
 * Deletes all scheduled local notifications
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.cancelAll = function (req)
{
};


/**
 * Get a Int8Array from a base64 string
 * @param {String} base64String
 */
function urlB64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
          .replace(/\-/g, '+')
          .replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


/**
 * Registers the device for notifications
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.register = function (req)
{
  if (!("Notification" in window)) {
    req.setError("This browser does not support desktop notification");
    return;
  }
  // ask for notification's permissions
  Notification.requestPermission(function (status) {
    if (status !== "granted") {
      req.setError("User denied permissions for Notifications");
      return;
    }
    else {
      req.params.options.keys = req.params.options.keys || {};
      //
      // initialise javascript service worker
      this.initialiseServiceWorker(function (done, err) {
        if (err) {
          req.setError(err);
        }
        else {
          // if the user hasn't passed the VAPID keys means that he doesn't want to get a subscription for push notifications
          // but only for local ones
          if (!req.params.options.keys || !req.params.options.keys.publicKey || !req.params.options.keys.privateKey)
            return req.setResult();
          //
          this.registration.pushManager.getSubscription()
                  .then(function (subscription) {
                    if (!subscription || req.params.options.resubscribe) {
                      //
                      var doSubscribe = function () {
                        var subscribeParams = {userVisibleOnly: true};
                        //
                        //create subscriptions using VAPID public key
                        var applicationServerKey = urlB64ToUint8Array(req.params.options.keys.publicKey);
                        subscribeParams.applicationServerKey = applicationServerKey;
                        //
                        this.registration.pushManager.subscribe(subscribeParams)
                                .then(function (subscription) {
                                  this.subscription = subscription;
                                  req.setResult({token: this.subscription, keys: req.params.options.keys});
                                })
                                .catch(function (e) {
                                  req.setError(e);
                                });
                      }.bind(this);
                      //
                      // if subscription already exist, unsuscribe
                      if (subscription) {
                        subscription.unsubscribe().then(function (successful) {
                          // You've successfully unsubscribed
                          if (successful)
                            doSubscribe();
                          else
                            req.setError("Unable to subscribe to push notifications");
                        }).catch(function (e) {
                          req.setError(e);
                        });
                      }
                      else {
                        doSubscribe();
                      }
                    }
                    else {
                      this.subscription = subscription;
                      req.setResult({token: this.subscription, keys: req.params.options.keys});
                    }
                  }.bind(this))
                  .catch(function (err) {
                    req.setError(err);
                  });
        }
      }.bind(this));
    }
  }.bind(this));
};


/**
 * Sends a message to an Apple or Android device
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.push = function (req)
{
  req.setResult();
};


/**
 * Retrieves the value of the badge in the application icon
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.getBadge = function (req)
{
  req.setResult(0);
};


/**
 * Sets the badge of the application icon to the value passed as a parameter
 * @param {Object} req - request object
 */
Client.Plugins.Notification.prototype.setBadge = function (req)
{
};



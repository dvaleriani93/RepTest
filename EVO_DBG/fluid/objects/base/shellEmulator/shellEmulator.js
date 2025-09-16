/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class ShellEmulator
 * @param {Object} device - the device instance
 */
Client.ShellEmulator = function (device)
{
  this.device = device;
  //
  try {
    document.onblur = function () {
      if (!this.pauseTimerId) {
        this.pauseTimerId = setTimeout(function () {
          delete this.pauseTimerId;
          this.paused = true;
          this.sendMessage({id: "onPause", content: {}});
        }.bind(this), 500);
      }
    }.bind(this);
    document.onfocus = function () {
      if (this.pauseTimerId) {
        clearTimeout(this.pauseTimerId);
        delete this.pauseTimerId;
      }
      else if (this.paused) {
        this.sendMessage({id: "onResume", content: {}});
        this.paused = false;
      }
    }.bind(this);
    window.onblur = document.onblur;
    window.onfocus = document.onfocus;
    window.top.onblur = document.onblur;
    window.top.onfocus = document.onfocus;
  }
  catch (ex) {
    console.warn("pause/resume events not available");
  }
};


/**
 * Map of class names
 */
Client.ShellEmulator.classesMap = {
  "barcodeScanner": {
    "className": "BarcodeScanner"
  },
  "beacon": {
    "className": "Beacon"
  },
  "geolocation": {
    "className": "Geolocation"
  },
  "camera": {
    "className": "Camera"
  },
  "accelerometer": {
    "className": "Accelerometer"
  },
  "compass": {
    "className": "Compass"
  },
  "contacts": {
    "className": "Contacts"
  },
  "keyboard": {
    "className": "Keyboard"
  },
  "nfc": {
    "className": "Nfc"
  },
  "notification": {
    className: "Notification",
    path: "notifications"
  },
  "socialSharing": {
    "className": "SocialSharing"
  },
  "statusBar": {
    "className": "StatusBar"
  },
  "vibration": {
    "className": "Vibration"
  },
  "backgroundLocation": {
    "className": "BackgroundLocation"
  },
  "facebook": {
    "className": "Facebook"
  },
  "sms": {
    "className": "Sms"
  },
  "sqlite": {
    "className": "Sqlite"
  },
  "speech": {
    "className": "Speech"
  },
  "haptic": {
    "className": "Haptic"
  },
  "media": {
    "className": "Media"
  },
  "touchid": {
    "className": "TouchID"
  },
  "preferences": {
    "className": "Preferences"
  },
  "calendar": {
    "className": "Calendar"
  },
  "ble": {
    "className": "Ble"
  },
  "lscookies": {
    "className": "Lscookies"
  },
  "pdf": {
    "className": "Pdf"
  },
  "signInWithApple": {
    "className": "SignInWithApple"
  },
  "oidc": {
    "className": "Oidc"
  }
};


/**
 * Emulate a shell / postMessage
 * @param {Object} cmd - the command object
 */
Client.ShellEmulator.prototype.postMessage = function (cmd)
{
  // protect from null cmd
  cmd = cmd || {};
  //
  // if there isn't cmd.obj, do nothing
  if (!cmd.obj)
    return;
  //
  // remove prefix "device-" from cmd.obj to get class name
  var className = cmd.obj.substring(7);
  //
  // create request object
  var req = {};
  //
  // id of client function to call on result (if defined)
  req.method = cmd.id;
  //
  // parameters passed to function
  req.params = cmd.cnt || {};  // parameters passed to function
  req.plugin = className;
  req.cbId = cmd.cbId;
  //
  //
  req.setResult = function (result, options) {
    //
    options = options || {};
    //
    // define message
    var sendMsgObj = {
      id: options.id || (req.method + "CB")
    };
    //
    // set specific options
    if (options.client)
      sendMsgObj.client = true;
    //
    if (options.cnt)
      sendMsgObj.cnt = options.cnt;
    else {
      sendMsgObj.content = {result: result, cbId: req.cbId};
      sendMsgObj.obj = "device-" + req.plugin;
    }
    //
    // send message
    this.sendMessage(sendMsgObj);
  }.bind(this);
  //
  //
  req.setError = function (error) {
    this.sendMessage({obj: "device-" + req.plugin, id: req.method + "CB", content: {error: error, cbId: req.cbId}});
  }.bind(this);
  //
  // There's not a device plugin in shell emulator
  if (req.plugin === "device")
    return req.setError(`Method ${req.method} not available on shell emulator`);
  //
  // Instantiate the object for the plugin if it not exists otherwise call method directly
  if (Client.ShellEmulator.classesMap[className]) {
    if (!this.pluginsLoaded) {
      // before instantiate plugin object insert in the DOM his script src
      var script = document.createElement("script");
      script.type = 'text/javascript';
      script.src = (Client.mainFrame.isIDF ? "fluid/" : "") + "objects/base/shellEmulator/plugins/shellemulator-plugins.min.js";
      //
      // IE compatibility
      if (script.readyState) {
        script.onreadystatechange = function () {
          if (script.readyState === "loaded" || script.readyState === "complete") {
            script.onreadystatechange = null;
            this.pluginsLoaded = true;
            //
            // now is possible call plugin method
            this.callMethod(cmd, className, req);
          }
        }.bind(this);
      }
      else {  // Others Browsers
        script.onload = function () {
          this.pluginsLoaded = true;
          //
          // now is possible call plugin method
          this.callMethod(cmd, className, req);
        }.bind(this);
        //
        script.onerror = function (err) {
          req.setError("Error occurred loading plugins: " + err);
        };
      }
      //
      // append script to the DOM
      document.body.appendChild(script);
    }
    else
      this.callMethod(cmd, className, req);
  }
  else
    req.setError("Plugin not found");
};


/**
 * Call method on plugin object
 * @param {Object} cmd - the command object
 * @param {String} className
 * @param {Object} req
 */
Client.ShellEmulator.prototype.callMethod = function (cmd, className, req)
{
  // if is necessary create plugin object
  if (!this[className])
    this[className] = new Client.Plugins[Client.ShellEmulator.classesMap[className]["className"]](this);
  //
  // understand if we are in telecollaboration
  this.isNotSlave = !(Client.clientType && (Client.clientType === "guest"));
  //
  // check if all elements exist
  if (this[className][cmd.id])
    this[className][cmd.id](req);
  else
    req.setError("Method not found");
};



/**
 * Emulate a shell / sendMessage
 * @param {Object} cmd - the command object
 */
Client.ShellEmulator.prototype.sendMessage = function (cmd)
{
  this.device.onMessage(cmd);
};


/*
 * Asks to fire a callback for an device event
 * @param {Object} request - the request object
 * @param {String} eventName - the name of the event
 * @param {String} objId - the id of the object
 */
Client.ShellEmulator.prototype.sendEvent = function (request, eventName, objId)
{
  this.sendMessage({obj: (objId ? objId : "device-" + request.plugin), id: "on" + eventName, content: request.result});
};
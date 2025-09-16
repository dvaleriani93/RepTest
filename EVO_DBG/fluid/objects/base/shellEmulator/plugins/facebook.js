/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


/* global FB, Client */

Client.Plugins = Client.Plugins || {};


/**
 * @class Facebook
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Facebook = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  this.timeOut = 30000;
};


/**
 * Check if sdk has been loaded
 * */
Client.Plugins.Facebook.prototype.checkInitialization = function ()
{
  if (!window.FB)
    return "The plugin was not correctly initialized";
};


/**
 * Init plugin
 * @param {Object} req - request object
 */
Client.Plugins.Facebook.prototype.init = function (req)
{
  // set request timeout
  this.timeOut = req.params.timeOut || this.timeOut;
  //
  if (!document.getElementById("facebook-jssdk")) {
    // insert Facebook javascript into "script" DOM section
    var js, fjs = document.getElementsByTagName("script")[0];
    //
    js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    //
    fjs.parentNode.insertBefore(js, fjs);
    //
    window.fbAsyncInit = function () {
      FB.init({
        appId: req.params.appId,
        cookie: true,
        status: true,
        xfbml: true,
        version: 'v19.0'
      });
      //
      req.setResult();
    }.bind(this);
  }
  else {
    req.setResult();
  }
};


/**
 * Do facebook login
 * @param {Object} req - request object
 */
Client.Plugins.Facebook.prototype.login = function (req) {
  // check for the plugin correctly initialization
  var response = this.checkInitialization();
  //
  if (response) {
    req.setError(response);
    return;
  }
  var options = {};
  //
  if (req.params.permissions && req.params.permissions.length > 0) {
    var index = req.params.permissions.indexOf('rerequest');
    //
    if (index > -1) {
      req.params.permissions.splice(index, 1);
      options.auth_type = 'rerequest';
    }
    options.scope = req.params.permissions.join(',');
  }
  //
  // start time out timer
  var timer = setTimeout(function () {
    req.setError("Timeout");
  }, this.timeOut);
  //
  FB.login(function (response) {
    // clear time out timer
    clearTimeout(timer);
    //
    req.setResult(response);
  }, options);
};


/**
 * Do facebook logout
 * @param {Object} req - request object
 */
Client.Plugins.Facebook.prototype.logout = function (req) {
  // check for the plugin correctly initialization
  var response = this.checkInitialization();
  //
  // if is not initialized, return
  if (response)
    return;
  //
  FB.logout(function (response) {
    req.setResult(response);
  });
};


/**
 * Get facebook login status
 * @param {Object} req - request object
 */
Client.Plugins.Facebook.prototype.getLoginStatus = function (req) {
  // check for the plugin correctly initialization
  var response = this.checkInitialization();
  //
  if (response) {
    req.setError(response);
    return;
  }
  //
  // start time out timer
  var timer = setTimeout(function () {
    req.setError("Timeout");
  }, this.timeOut);
  //
  FB.getLoginStatus(function (response) {
    // clear time out timer
    clearTimeout(timer);
    //
    req.setResult(response);
  }, true);
};


/**
 * Makes a call to Facebook's OpenGraph APIs
 * @param {Object} req - request object
 */
Client.Plugins.Facebook.prototype.api = function (req) {
  // check for the plugin correctly initialization
  var response = this.checkInitialization();
  //
  if (response) {
    req.setError(response);
    return;
  }
  //
  // start time out timer
  var timer = setTimeout(function () {
    req.setError("Timeout");
  }, this.timeOut);
  //
  FB.api(req.params.path, function (response) {
    // clear time out timer
    clearTimeout(timer);
    //
    response.error ? req.setError(response.error) : req.setResult(response);
  });
};


/**
 * Opens a Facebook dialog window
 * @param {Object} req - request object
 */
Client.Plugins.Facebook.prototype.showDialog = function (req) {
  req.params.options = req.params.options || {};
  //
  // if options "display" isn't specified, force display as popup
  req.params.options.display = req.params.options.display || "popup";
  //
  // check for the plugin correctly initialization
  var response = this.checkInitialization();
  //
  if (response)
    req.setError(response);
  //
  // start time out timer
  var timer = setTimeout(function () {
    req.setError("Timeout");
  }, this.timeOut);
  //
  FB.ui(req.params.options, function (response) {
    // clear time out timer
    clearTimeout(timer);
    //
    response.error_message ? req.setError(response.error_message) : req.setResult(response);
  });
};






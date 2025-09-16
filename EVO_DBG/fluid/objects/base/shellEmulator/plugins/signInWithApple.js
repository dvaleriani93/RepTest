/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class SignInWithApple
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.SignInWithApple = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Check if apple id auth js is available
 * @param {Object} cb - callback
 */
Client.Plugins.SignInWithApple.prototype.authJSAvailable = function (cb)
{
  if (!document.getElementById("appleid-auth-js")) {
    // Insert Sign In With Apple javascript into "script" DOM section
    var js;
    var fjs = document.getElementsByTagName("script")[0];
    //
    js = document.createElement("script");
    js.id = "appleid-auth-js";
    js.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    //
    fjs.parentNode.insertBefore(js, fjs);
    //
    // IE compatibility
    if (js.readyState) {
      js.onreadystatechange = function () {
        if (js.readyState === "loaded" || js.readyState === "complete") {
          js.onreadystatechange = null;
          //
          // Callback. If AppleID object exists, no error occurred on script loading
          cb(AppleID ? false : true);
        }
      };
    }
    else {  // Others Browsers
      js.onload = function () {
        cb();
      }.bind(this);
      //
      js.onerror = function () {
        cb(true);
      }.bind(this);
    }
  }
  else
    cb();
};


/**
 * Returns true if Sign in with Apple is available
 * @param {Object} req - request object
 */
Client.Plugins.SignInWithApple.prototype.isAvailable = function (req)
{
  this.authJSAvailable(function (error) {
    req.setResult((!error && AppleID) ? true : false);
  });
};


/**
 * Request authentication for Apple ID
 * @param {Object} req - request object
 */
Client.Plugins.SignInWithApple.prototype.request = function (req)
{
  this.authJSAvailable(function (error) {
    if (error)
      req.setError("Plugin not available");
    else {
      if (AppleID) {
        req.params.options = req.params.options || {};
        //
        var options = {};
        options.clientId = req.params.options.clientId;
        options.scope = req.params.options.scope;
        options.redirectURI = req.params.options.redirectURI;
        options.state = req.params.options.state;
        options.usePopup = true;
        //
        // Init authentication request asking for scope data
        AppleID.auth.init(options);
        //
        AppleID.auth.signIn().then(function (data) {
          var user = data.user || {};
          user.name = user.name || {};
          var authorization = data.authorization || {};
          //
          var tokenParts = authorization.id_token.split(".");
          var decodedToken = JSON.parse(atob(tokenParts[1]));
          //
          var credential = {};
          credential.fullName = {givenName: user.name.firstName, familyName: user.name.lastName};
          credential.email = user.email;
          credential.user = decodedToken.sub;
          credential.identityToken = authorization.id_token;
          //
          req.setResult(credential);
        }).catch(function (err) {
          req.setError(typeof err === "object" ? err.error : err);
        });
      }
      else
        req.setError("Plugin not available");
    }
  }.bind(this));
};


/**
 * Returns the user credential status
 * @param {Object} req - request object
 */
Client.Plugins.SignInWithApple.prototype.getCredentialState = function (req)
{
  req.setError("Plugin not available");
};

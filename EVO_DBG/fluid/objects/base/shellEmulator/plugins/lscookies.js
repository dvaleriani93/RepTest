/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */


Client.Plugins = Client.Plugins || {};


/**
 * @class Lscookies
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Lscookies = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  this.storage = window.localStorage;
};


/**
 * Set cookies
 * @param {Object} req - request object
 */
Client.Plugins.Lscookies.prototype.setCookie = function (req)
{
  var prefix = "lscookie-";
  var expiry = req.params.exdays * 24 * 60 * 60 + (new Date()).getTime() / 1000;
  this.storage[prefix + req.params.name] = JSON.stringify({value: req.params.value, expiry: expiry});
  //
  // set results
  req.setResult();
};


/**
 * Get cookies
 * @param {Object} req - request object
 */
Client.Plugins.Lscookies.prototype.getCookies = function (req)
{
  var prefix = "lscookie-";
  var lscookies = {};
  var lskey;
  for (var i = 0; i < this.storage.length; i++) {
    lskey = this.storage.key(i);
    if (lskey.substr(0, prefix.length) === prefix) {
      try {
        var c = JSON.parse(this.storage.getItem(lskey));
        //
        if (c.expiry > (new Date()).getTime() / 1000)
          lscookies[lskey.substr(prefix.length)] = c.value;
        else
          this.storage.removeItem(lskey);
      }
      catch (e) {
        // malformatted cookie
        this.storage.removeItem(lskey);
      }
    }
  }
  //
  // set results, with special options if the plugin was called with "mode" option
  // otherwise set result as usually
  if (req.params.mode)
    req.setResult(null, {client: true, id: req.params.mode, cnt: lscookies});
  else
    req.setResult(lscookies);
};
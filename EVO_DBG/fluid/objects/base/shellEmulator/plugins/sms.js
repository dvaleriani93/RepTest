/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Sms
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Sms = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Send SMS to the number indicated
 * @param {Object} req - request object
 */
Client.Plugins.Sms.prototype.send = function (req)
{
  req.setResult("OK");
};


/**
 * Discover if you have permission to send SMS from the app
 * @param {Object} req - request object
 */
Client.Plugins.Sms.prototype.hasPermission = function (req)
{
  req.setResult(true);
};

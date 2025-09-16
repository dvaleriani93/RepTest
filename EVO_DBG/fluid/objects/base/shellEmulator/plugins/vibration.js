/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Vibration
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Vibration = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Enables device vibration
 * @param {Object} req - request object
 */
Client.Plugins.Vibration.prototype.vibrate = function (req)
{
  if (navigator.vibrate)
    navigator.vibrate(req.params.time);
};

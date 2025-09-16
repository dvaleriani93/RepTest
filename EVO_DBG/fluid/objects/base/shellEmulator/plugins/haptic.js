/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Haptic
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Haptic = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Activates haptic or acoustic feedback
 * @param {Object} req - request object
 */
Client.Plugins.Haptic.prototype.feedback = function (req)
{
};


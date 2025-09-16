/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Preferences
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Preferences = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  this.storage = window.localStorage;
};


/**
 * Shows the application settings page
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.show = function (req)
{
};


/**
 * Retrieves the setting specified in the *key* parameter
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.fetch = function (req)
{
  req.setResult(this.storage.getItem(req.params.key));
};


/**
 * Changes the value of an application setting parameter
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.store = function (req)
{
  this.storage.setItem(req.params.key, req.params.value);
};


/**
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.isIgnoringBatteryOptimizations = function (req)
{
  req.setResult();
};


/**
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.isIgnoringDataSaver = function (req)
{
  req.setResult();
};


/**
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.ignoreBatteryOptimizations = function (req)
{
  req.setResult();
};


/**
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.displayOptimizationsMenu = function (req)
{
  req.setResult();
};


/**
 * @param {Object} req - request object
 */
Client.Plugins.Preferences.prototype.displayDataSaverMenu = function (req)
{
  req.setResult();
};


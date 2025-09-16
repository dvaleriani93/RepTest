/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class StatusBar
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.StatusBar = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Shows status bar
 * @param {Object} req - request object
 */
Client.Plugins.StatusBar.prototype.show = function (req)
{
};


/**
 * Hides status bar
 * @param {Object} req - request object
 */
Client.Plugins.StatusBar.prototype.hide = function (req)
{
};


/**
 * Sets the  background color of the status bar
 * @param {Object} req - request object
 */
Client.Plugins.StatusBar.prototype.setBackgroundColor = function (req)
{
};


/**
 * Changes the position of the status bar
 * @param {Object} req - request object
 */
Client.Plugins.StatusBar.prototype.overlaysWebView = function (req)
{
};





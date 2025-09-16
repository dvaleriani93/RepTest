/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Pdf
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Pdf = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Creates PDF from html
 * @param {Object} req - request object
 */
Client.Plugins.Pdf.prototype.fromData = function (req)
{
  req.setResult();
};


/**
 * Create PDF from URL
 * @param {Object} req - request object
 */
Client.Plugins.Pdf.prototype.fromURL = function (req)
{
  req.setResult();
};




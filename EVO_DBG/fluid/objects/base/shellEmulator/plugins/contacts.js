/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Contacts
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Contacts = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Finds contact
 * @param {Object} req - request object
 */
Client.Plugins.Contacts.prototype.find = function (req)
{
  // in simulator return always void array
  req.setResult([]);
};


/**
 * Creates contact
 * @param {Object} req - request object
 */
Client.Plugins.Contacts.prototype.create = function (req)
{
  req.setResult();
};


/**
 * Reads contact
 * @param {Object} req - request object
 */
Client.Plugins.Contacts.prototype.read = function (req)
{
  // in simulator return always null
  req.setResult(null);
};


/**
 * Updates contact
 * @param {Object} req - request object
 */
Client.Plugins.Contacts.prototype.update = function (req)
{
  // in simulator return always null
  req.setResult(null);
};


/**
 * Delete contact
 * @param {Object} req - request object
 */
Client.Plugins.Contacts.prototype.delete = function (req)
{
  // in simulator return always null
  req.setResult(null);
};
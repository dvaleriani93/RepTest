/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Touch ID
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.TouchID = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  this.keys = {};
};


/**
 * Returns true if the touch ID is avaible
 * @param {Object} req - request object
 */
Client.Plugins.TouchID.prototype.isAvailable = function (req)
{
  req.setResult(true);
};



/**
 * Returns the passoword saved in the keychain
 * @param {Object} req - request object
 */
Client.Plugins.TouchID.prototype.verify = function (req)
{
  req.setResult(this.keys[req.params.key]);
};


/**
 * Saves the password for the key indicated in the device keychain
 * @param {Object} req - request object
 */
Client.Plugins.TouchID.prototype.save = function (req)
{
  this.keys[req.params.key] = req.params.password;
  req.setResult();
};


/**
 * Returns true if the keychian contains the password for the key indicated
 * @param {Object} req - request object
 */
Client.Plugins.TouchID.prototype.has = function (req)
{
  this.keys && this.keys[req.params.key] ? req.setResult(true) : req.setResult(false);
};


/**
 * Deletes the password for the key indicated by the keychain
 * @param {Object} req - request object
 */
Client.Plugins.TouchID.prototype.delete = function (req)
{
  if (this.keys && this.keys[req.params.key]) {
    delete this.keys[req.params.key];
    req.setResult(true);
  }
  else
    req.setResult(false);
};



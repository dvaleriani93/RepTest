/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Media
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Sqlite = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  this.databases = {};
};


/**
 * Opens the database specified
 * @param {Object} req - request object
 */
Client.Plugins.Sqlite.prototype.openDatabase = function (req)
{
  // calcutate random ID
  var id = (Math.random() + "").substring(2);
  //
  // Open SQLite Database and store it
  try {
    var db = openDatabase(req.params.name, "1.0", "", 2 * 1024 * 1024);
    this.databases[id] = {id: id, name: req.params.name, db: db};
    req.setResult(id);
  }
  catch (ex) {
    req.setError(ex);
  }
};


/**
 * Deletes the database specified
 * @param {Object} req - request object
 */
Client.Plugins.Sqlite.prototype.deleteDatabase = function (req)
{
  req.setResult();
};


/**
 * Closes the database specified
 * @param {Object} req - request object
 */
Client.Plugins.Sqlite.prototype.closeDatabase = function (req)
{
  req.setResult();
};


/**
 * Runs a query on the database specified
 * @param {Object} req - request object
 */
Client.Plugins.Sqlite.prototype.query = function (req)
{
  req.setResult({});
};
/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Accelerometer
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Accelerometer = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Get current acceleration
 * @param {Object} req - request object
 */
Client.Plugins.Accelerometer.prototype.getCurrentAcceleration = function (req)
{
  // If we are in telecollaboration do nothing
  if (!this.shellEmulator.isNotSlave)
    return;
  //
  // Return an error if Accelerometer API is not supported
  if (!window.Accelerometer)
    return req.setError("Accelerometer not supported");
  //
  // Create the accelerometer
  this.acl = new Accelerometer();
  //
  // On desktop browsers, Accelerometer API might exists despite there's no related hardware.
  // In this case onReading event will never fire. So I set a timer to return after a second
  var timer = setTimeout(function () {
    req.setResult({
      x: null,
      y: null,
      z: null,
      timestamp: new Date()
    });
  }, 1000);
  //
  // Add onReading listener
  this.acl.addEventListener("reading", function () {
    clearTimeout(timer);
    //
    req.setResult({
      x: this.acl.x,
      y: this.acl.y,
      z: this.acl.z,
      timestamp: new Date()
    });
    //
    // Stop reading
    this.acl.stop();
  }.bind(this));
  //
  // Start reading
  this.acl.start();
};


/**
 * Start watching acceleration
 * @param {Object} req - request object
 */
Client.Plugins.Accelerometer.prototype.watchAcceleration = function (req)
{
  // If we are in telecollaboration do nothing
  if (!this.shellEmulator.isNotSlave)
    return null;
  //
  // Return an error if Accelerometer API is not supported
  if (!window.Accelerometer)
    return req.setError("Accelerometer not supported");
  //
  // Create the accelerometer
  this.acl = new Accelerometer({frequency: req.params.frequency || 1000});
  //
  // Listen on reading acceleration
  this.acl.addEventListener("reading", function () {
    req.result = {
      x: this.acl.x,
      y: this.acl.y,
      z: this.acl.z,
      timestamp: new Date()
    };
    //
    // Send Acceleration event
    this.shellEmulator.sendEvent(req, "Acceleration");
  }.bind(this));
  //
  // Start reading
  this.acl.start();
};


/**
 * Stop watching acceleration
 */
Client.Plugins.Accelerometer.prototype.clearWatch = function () {
  if (this.acl)
    this.acl.stop();
};

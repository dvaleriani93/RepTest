/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Compass
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Compass = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Gets current heading
 * @param {Object} req - request object
 */
Client.Plugins.Compass.prototype.getCurrentHeading = function (req)
{
  // if we are in telecollaboration do nothing
  if (!this.shellEmulator.isNotSlave)
    return;
  //
  var setResult = function (compassData) {
    this.clearWatch();
    //
    req.setResult({
      magneticHeading: compassData.alpha, // Magnetic North
      trueHeading: compassData.alpha,
      headingAccuracy: 0,
      timestamp: new Date()
    });
  }.bind(this);
  //
  // Watch for just one data
  if ("ondeviceorientation" in window && Client.mainFrame.device.browserName !== "Chrome")
    window.ondeviceorientation = setResult;
  else if ("ondeviceorientationabsolute" in window)
    window.ondeviceorientationabsolute = setResult;
};


/**
 * Starts watching heading
 * @param {Object} req - request object
 */
Client.Plugins.Compass.prototype.watchHeading = function (req)
{
  // If we are in telecollaboration do nothing
  if (!this.shellEmulator.isNotSlave)
    return null;
  //
  var setResult = function (compassData) {
    req.result = {
      magneticHeading: compassData.alpha, // Magnetic North
      trueHeading: compassData.alpha,
      headingAccuracy: 0,
      timestamp: new Date()
    };
  };
  //
  if ("ondeviceorientation" in window && Client.mainFrame.device.browserName !== "Chrome")
    window.ondeviceorientation = setResult;
  else if ("ondeviceorientationabsolute" in window)
    window.ondeviceorientationabsolute = setResult;
  //
  // Sending heading data every req.params.frequency ms
  req.result = {magneticHeading: 0, trueHeading: 0, headingAccuracy: 0, timestamp: new Date()};
  this.watch = window.setInterval(function () {
    // Send event with the heading data
    this.shellEmulator.sendEvent(req, "Heading");
  }.bind(this), req.params.frequency);
};


/**
 * Stops watching heading
 */
Client.Plugins.Compass.prototype.clearWatch = function () {
  window.ondeviceorientation = undefined;
  window.ondeviceorientationabsolute = undefined;
  //
  if (this.watch)
    window.clearInterval(this.watch);
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Geolocation
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Geolocation = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Gets current position
 * @param {Object} req - request object
 */
Client.Plugins.Geolocation.prototype.getCurrentPosition = function (req)
{
  // if we are in telecollaboration do nothing
  if (!this.shellEmulator.isNotSlave)
    return;
  // request current position
  navigator.geolocation.getCurrentPosition(function (position) {
    var positionObj = {
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed
    };
    //
    // set result
    req.setResult(positionObj);
  }.bind(this), function (error) {
    //
    // set error
    req.setError(this.getErrorMsg(error));
  }.bind(this), req.params.options);
};


/**
 * Starts watching of position
 * @param {Object} req - request object
 */
Client.Plugins.Geolocation.prototype.watchPosition = function (req)
{
  // if we are in telecollaboration do nothing
  if (!this.shellEmulator.isNotSlave)
    return null;
  //
  // start watching of position
  this.watch = navigator.geolocation.watchPosition(function (position) {
    var positionObj = {
      accuracy: position.coords.accuracy,
      altitude: position.coords.altitude,
      altitudeAccuracy: position.coords.altitudeAccuracy,
      heading: position.coords.heading,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      speed: position.coords.speed
    };
    //
    // fire geolocation plugin "onPosition" event
    req.result = positionObj;
    this.shellEmulator.sendEvent(req, "Position");
  }.bind(this), function (error) {
    // fire geolocation plugin "onPosition" event with error
    req.result = {error: this.getErrorMsg(error)};
    this.shellEmulator.sendEvent(req, "Position");
  }.bind(this), req.params.options);
};


/**
 * Stops watching of position
 */
Client.Plugins.Geolocation.prototype.clearWatch = function () {
  navigator.geolocation.clearWatch(this.watch);
};


/**
 * Decodes error object and return error message
 * @param {object} error - error object
 */
Client.Plugins.Geolocation.prototype.getErrorMsg = function (error)
{
  var errorMsg = "";
  //
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorMsg = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorMsg = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorMsg = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      errorMsg = "An unknown error occurred.";
      break;
  }
  //
  return errorMsg;
};

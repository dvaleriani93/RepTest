/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class BackgroundLocation
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.BackgroundLocation = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  //
  // array where detected locations are stored
  this.locations = [];
  this.enabled = false;
  //
  this.options = {
    desiredAccuracy: 0,
    maxLocations: null
  };
};


/**
 * Starts watching of position
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.start = function (req)
{
  // sets property "enabled" as true
  this.enabled = true;
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
      speed: position.coords.speed,
      timeStamp: new Date(),
      id: (new Date().getUTCMilliseconds()).toString()
    };
    //
    // fire backgroundLocation plugin "onLocation" event
    req.result = positionObj;
    this.shellEmulator.sendEvent(req, "Location");
    //
    this.options.maxLocations = this.options.maxLocations || null;
    //
    // add new location to locations list
    if (!this.options.maxLocations || this.options.maxLocations < this.locations.length)
      this.locations.push(positionObj);
  }.bind(this), function (error) {
    // if error occured sets property "enabled" as false
    this.enabled = false;
    //
    // fire backgroundLocation plugin "onLocation" event event with error
    req.result = {error: this.getErrorMsg(error)};
    this.shellEmulator.sendEvent(req, "Location");
  }.bind(this), {
    //
    // set the only valid options in simulator: if the user want accuracy over "80" use maximum accuracy
    enableHighAccuracy: (this.options.desiredAccuracy && this.options.desiredAccuracy > 80) ? true : false
  });
};


/**
 * Stops watching of position
 */
Client.Plugins.BackgroundLocation.prototype.stop = function ()
{
  // sets property "enabled" as false
  this.enabled = false;
  //
  navigator.geolocation.clearWatch(this.watch);
};


/**
 * Decodes error object and return error message
 * @param {object} error - error object
 */
Client.Plugins.BackgroundLocation.prototype.getErrorMsg = function (error)
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
  return errorMsg;
};


/**
 * Configure options watching of position
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.configure = function (req)
{
  req.params.options = req.params.options || {};
  //
  // sets only the valid options in the simulator
  this.options.maxLocations = req.params.options.maxLocations;
  this.options.desiredAccuracy = req.params.options.desiredAccuracy;
};


/**
 * In simulator do nothing
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.isLocationEnabled = function (req)
{
  req.setResult(this.enabled);
};


/**
 * In simulator do nothing
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.showAppSettings = function (req)
{
};


/**
 * In simulator do nothing
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.showLocationSettings = function (req)
{
};


/**
 * Returns stored locations
 */
Client.Plugins.BackgroundLocation.prototype.getLocations = function (req)
{
  // set result
  req.setResult(this.locations);
};


/**
 * Returns stored "valid" locations
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.getValidLocations = function (req)
{
  // set result
  req.setResult(this.locations);
};


/**
 * Deletes a specific location
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.deleteLocation = function (req)
{
  this.locations = this.locations.filter(function (obj) {
    return obj.id !== req.params.locationId;
  });
};


/**
 * Deletes all locations
 */
Client.Plugins.BackgroundLocation.prototype.deleteAllLocations = function ()
{
  this.locations = [];
};


/**
 * Returns logs entries
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.getLogEntries = function (req)
{
  // set result
  req.setResult([]);
};


/**
 * Check background location service status
 * @param {Object} req - request object
 */
Client.Plugins.BackgroundLocation.prototype.checkStatus = function (req)
{
  // set result
  req.setResult({isRunning: this.enabled});
};

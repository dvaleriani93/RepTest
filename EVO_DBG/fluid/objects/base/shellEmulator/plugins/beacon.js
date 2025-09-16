/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Beacon
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Beacon = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Init plugin
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.init = function (req)
{

};


/**
 * Returns the authorization status of this device
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.getAuthorizationStatus = function (req)
{
  req.setResult("");
};


/**
 * Requires the use of beacons when the application is in use
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.requestWhenInUseAuthorization = function (req)
{
};


/**
 * Requires the use of beacons when the application is in use
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.requestAlwaysAuthorization = function (req)
{
};



/**
 * Returns true if the device can be configured as a beacon.
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.isAdvertisingAvailable = function (req)
{
  req.setResult(true);
};


/**
 * Returns true if the device is operating as a beacon.
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.isAdvertising = function (req)
{
  req.setResult(true);
};


/**
 * Starts use of the device as a beacon
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.startAdvertising = function (req)
{
};


/**
 * Stops use of the device as a beacon
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.stopAdvertising = function (req)
{
};


/**
 * Begins scanning for a given beacon
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.startMonitoringForRegion = function (req)
{
};


/**
 * Stops scanning for a given beacon
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.stopMonitoringForRegion = function (req)
{
};


/**
 * Requests the status of a given beacon
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.requestStateForRegion = function (req)
{
  // fire beacon plugin "onRegionState" event
  req.result = {};
  this.shellEmulator.sendEvent(req, "RegionState");
};


/**
 * Returns the array of the monitored regions (beacons)
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.getMonitoredRegions = function (req)
{
  req.setResult([]);
};


/**
 * Begins scanning for a given beacon.
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.startRangingBeaconsInRegion = function (req)
{
};


/**
 * Stops scanning for a given beacon.
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.stopRangingBeaconsInRegion = function (req)
{
};


/**
 * Returns true if it's possible to find the location of the device with respect to the beacon.
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.isRangingAvailable = function (req)
{
  req.setResult(true);
};


/**
 * Returns true if it's possible to find the location of the device with respect to the beacon.
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.getRangedRegions = function (req)
{
  req.setResult([]);
};


/**
 * Returns true if bluetooth is active in the device
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.isBluetoothEnabled = function (req)
{
  req.setResult(true);
};


/**
 * Activates bluetooth
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.enableBluetooth = function (req)
{
};


/**
 * Deactivates bluetooth
 * @param {Object} req - request object
 */
Client.Plugins.Beacon.prototype.disableBluetooth = function (req)
{
};
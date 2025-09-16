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
Client.Plugins.Ble = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Initializes the Bluetooth module in the device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.initialize = function (req)
{
  req.setResult({});
};


/**
 * Switches on the Bluetooth module in the device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.enable = function (req)
{
};


/**
 * Switches off the Bluetooth module in the device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.disable = function (req)
{
};


/**
 * Returns the current status and the parameters in the device Bluetooth module
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.getAdapterInfo = function (req)
{
  req.setResult({});
};


/**
 * Returns true if the initialize method has already been called
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.isInitialized = function (req)
{
  req.setResult(true);
};


/**
 * Returns true if the Bluetooth module is on
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.isEnabled = function (req)
{
  req.setResult(true);
};


/**
 * Returns true if permissions for device scans are already available
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.hasPermission = function (req)
{
  req.setResult(true);
};


/**
 * Requests permissions to run device scans
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.requestPermission = function (req)
{
  req.setResult(true);
};


/**
 * Returns true if the localization services are active.
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.isLocationEnabled = function (req)
{
  req.setResult(true);
};


/**
 * Shows the settings page for the localization services
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.requestLocation = function (req)
{
  req.setResult({});
};


/**
 * Starts the search for devices that can connect
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.startScan = function (req)
{
  req.setResult();
};


/**
 * Ends the search for devices that can connect
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.stopScan = function (req)
{
  req.setResult();
};



/**
 * Ends the search for devices that can connect
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.retrieveConnected = function (req)
{
  req.setResult({});
};


/**
 * Returns true if the device search is underway
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.isScanning = function (req)
{
  req.setResult({});
};


/**
 * Connects a Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.connect = function (req)
{
  req.setResult({});
};


/**
 * Reconnects a Bluetooth device that was connected previously
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.reconnect = function (req)
{
  req.setResult({});
};


/**
 * Disconnects a previously connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.disconnect = function (req)
{
  req.setResult({});
};


/**
 * Frees up resources allocated to a previously connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.close = function (req)
{
  req.setResult({});
};


/**
 * Returns the RSSI value of the connected device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.rssi = function (req)
{
  req.setResult({});
};


/**
 * Sets the MTU value for a connected device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.mtu = function (req)
{
  req.setResult({});
};


/**
 * Changes the transmission priority for a connected device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.requestConnectionPriority = function (req)
{
  req.setResult({});
};


/**
 * Returns true if the device has already been connected
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.wasConnected = function (req)
{
  req.setResult(true);
};


/**
 * Returns true if the device is connected
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.isConnected = function (req)
{
  req.setResult(true);
};


/**
 * Pairs with a device and fires the "onBond" event at the end of the operation
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.bond = function (req)
{
  req.setResult();
};


/**
 * Interrupts pairing with a device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.unbond = function (req)
{
  req.setResult();
};


/**
 * Returns true if the device is paired
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.isBonded = function (req)
{
  req.setResult(true);
};


/**
 * Discovers the services, the characteristics, and descriptors of a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.discover = function (req)
{
  req.setResult({});
};


/**
 * Discovers the services of a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.services = function (req)
{
  req.setResult({});
};


/**
 * Discovers the service characteristics of a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.characteristics = function (req)
{
  req.setResult({});
};


/**
 * Discovers the service characteristic descriptors for a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.descriptors = function (req)
{
  req.setResult({});
};


/**
 * Returns true if the search for the device characteristics has already been run
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.isDiscovered = function (req)
{
  req.setResult({});
};


/**
 * Reads the value of a service characteristic for a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.read = function (req)
{
  req.setResult({});
};


/**
 * Requests notice of changes to the value of a service characteristic for a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.subscribe = function (req)
{
  req.setResult({});
};


/**
 * Stops notice of changes to the value of a service characteristic for a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.unsubscribe = function (req)
{
  req.setResult({});
};


/**
 *Changes the value of a service characteristic for a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.write = function (req)
{
  req.setResult({});
};


/**
 * Reads the value of a service characteristic descriptor for a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.readDescriptor = function (req)
{
  req.setResult({});
};


/**
 * Changes the value of a service characteristic descriptor for a connected Bluetooth device
 * @param {Object} req - request object
 */
Client.Plugins.Ble.prototype.writeDescriptor = function (req)
{
  req.setResult({});
};


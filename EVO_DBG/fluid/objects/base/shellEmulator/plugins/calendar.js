/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Preferences
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Calendar = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Checks whether permission to access the calendar has already been obtained
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.hasPermission = function (req)
{
  req.setResult(true);
};


/**
 * Requires a calendar-access permission
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.requestPermission = function (req)
{
  req.setResult(true);
};


/**
 * Returns the list of calendars on the device
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.listCalendars = function (req)
{
  req.setResult([]);
};


/**
 * Creates the calendar specified
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.createCalendar = function (req)
{
  req.setResult("");
};


/**
 * Deletes the calendar specified
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.deleteCalendar = function (req)
{
  req.setResult("");
};



/**
 * Opens the calendar application at the selected date
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.openCalendar = function (req)
{
  req.setResult("");
};


/**
 * Returns the list of events between the two dates specified
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.listEventsInRange = function (req)
{
  req.setResult([]);
};


/**
 * Returns the list of future events in the calendar specified
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.findAllEventsInNamedCalendar = function (req)
{
  req.setResult([]);
};


/**
 * Creates a new event and returns its ID
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.createEvent = function (req)
{
  req.setResult("");
};


/**
 * Searches for the events and returns their data
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.findEvent = function (req)
{
  req.setResult([]);
};


/**
 * Deletes the events depending on the data sent
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.deleteEvent = function (req)
{
  req.setResult("");
};


/**
 * Changes an event and returns its ID
 * @param {Object} req - request object
 */
Client.Plugins.Calendar.prototype.modifyEvent = function (req)
{
  req.setResult("");
};
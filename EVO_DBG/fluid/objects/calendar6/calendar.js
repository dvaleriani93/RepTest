/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client, moment, FullCalendar, UIColorPicker */

/**
 * @class A calendar Object
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the calendar
 */
Client.Calendar6 = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("div");
  //
  // Create the div that will contain the calendar
  var calendarDiv = document.createElement("div");
  //
  // Generate an id for the calendar formed by a letter and 5 numbers
  this.calendarId = "c" + Math.floor(Math.random() * (99999 - 10000) + 10000);
  calendarDiv.id = this.calendarId;
  this.domObj.appendChild(calendarDiv);
  //
  parent.appendChildObject(this, this.domObj);
  //
  this.eventsMap = {};
  this.optionsCache = {};
  this.alreadyManaged = [];
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  // If in edit mode load sample data
  if (Client.mainFrame.isEditing()) {
    var el = this.loadSampleData();
    this.updateElement(el);
  }
};


// Make Client.Calendar6 extend Client.Element
Client.Calendar6.prototype = new Client.Element();


/**
 * Define the calendar and event options
 */
Client.Calendar6.default = {
  global: {
    // General Display
    headerToolbar: {
      left: 'title',
      center: '',
      right: 'today prev,next'
    },
    buttonIcons: {// takes effect when "theme" is false
      prev: 'left-single-arrow',
      next: 'right-single-arrow',
      prevYear: 'left-double-arrow',
      nextYear: 'right-double-arrow'
    },
    theme: false,
    themeButtonIcons: {// takes effect when "theme" is true
      prev: 'arrow-left-square-fill',
      next: 'arrow-right-square-fill',
      prevYear: 'chevron-double-left',
      nextYear: 'chevron-double-right'
    },
    firstDay: 0, // (Sunday) - it depends on the current "lang"
    isRTL: false,
    weekends: true,
    hiddenDays: [],
    fixedWeekCount: true,
    weekNumbers: false,
    weekNumberCalculation: "local", // ISO (for ISO8601 week numbers)
    businessHours: false, // boolean or an object, example: {start: "10:00", end: "18:00", dow: [1,2,3,4]}
    height: "auto", // "auto" or an integer
    contentHeight: "auto", // "auto" or an integer
    aspectRatio: 1.35, // float
    dayMaxEventRows: false, // boolean or integer
    moreLinkClick: "popover", // Other possible values: "week", "day", view name
    //
    // Views
    initialView: "month", // Other possible values: basicWeek, basicDay, agendaWeek, agendaDay
    //
    // Current Date
    initialDate: new Date("2020-05-01"),
    //
    // Text/Time Customization
    lang: "en",
    timeFormat: "H:mm",
    //
    // Selection
    selectable: false,
    selectHelper: false, // only agenda views
    unselectAuto: true, // takes effect when selectable is set to true
    unselectCancel: "", // a way to specify elements that will ignore the unselectAuto option.
    selectOverlap: true,
    selectConstraint: "" // only applicable when the selectable option is activated - accept an event ID, "businessHours", object
  },
  event: {
    // Event Rendering
    eventColor: "#3a87ad", // background and border colors for all events on the calendar
    eventBackgroundColor: "#3a87ad", // background color for all events on the calendar
    eventBorderColor: "#3a87ad", // border color for all events on the calendar
    eventTextColor: "#FFFFFF", // text color for all events on the calendar
    nextDayThreshold: "09:00:00",
    //
    // Event Dragging & Resizing
    editable: false,
    eventOverlap: true
  },
  agenda: {
    allDaySlot: true,
    allDayText: "all-day", // The default value depends on the current "lang"
    axisFormat: "h(:mm)a", // The default value depends on the current "lang"
    slotDuration: "00:30:00",
    snapDuration: "00:30:00",
    scrollTime: "06:00:00",
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    slotEventOverlap: true
  }
};

Client.Calendar6.eventProperties = ["id", "groupId", "allDay", "start", "end", "daysOfWeek", "startTime", "endTime", "startRecur", "endRecur", "title", "url", "className", "classNames", "editable", "startEditable", "durationEditable", "resourceEditable", "resourceId", "resourceIds", "display", "overlap", "constraint", "color", "backgroundColor", "borderColor", "textColor", "extendedProps"];
Client.Calendar6.viewProperties = ["type", "title", "activeStart", "activeEnd", "currentStart", "currentEnd"];

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Calendar6.prototype.updateElement = function (el)
{
  // Get options
  if (el.calendarOptions) {
    this.changeCalendarOptions(el.calendarOptions);
    //
    delete el.calendarOptions;
  }
  if (el.eventsOptions) {
    this.changeCalendarOptions(el.eventsOptions);
    //
    delete el.eventsOptions;
  }
  if (el.calendarView) {
    this.calendarView = el.calendarView;
    this.changeView(el.calendarView);
    delete el.calendarView;
  }
  //
  // Get fullcalendar data
  if (el.data) {
    // Load initial data
    if (el.data.columns)
      this.initCalendar(el);
    else {
      if (el.data.pos !== undefined) {
        if (el.data.data) // Update data
          this.updateData(el.data);
        else  // Remove data
          this.removeData(el.data);
      }
      else  // Add data
        this.addData(el.data.data);
    }
  }
  //
  if (el.style) {
    var style = el.style;
    if (typeof style === "string")
      style = JSON.parse(el.style);
    //
    if (style.height)
      this.changeDimension("height", style.height);
    if (style.width)
      this.changeDimension("width", style.width);
  }
  //
  if (el.theme) {
    this.changeTheme(el.theme);
    delete el.theme;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Change the width or the height of the calendar
 * @param {String} dim - width or height
 * @param {Int} size
 */
Client.Calendar6.prototype.changeDimension = function (dim, size)
{
  var newDim;
  if (size === "parent" || size === "auto")
    newDim = size;
  else if (!size.indexOf)
    newDim = size;
  else {
    var idx = size.indexOf("px");
    if (idx > -1) {
      newDim = parseInt(size.substring(0, idx));
      if (this.percDim)
        delete this.percDim[dim];
    }
    else {
      idx = size.indexOf("%");
      if (idx > -1) {
        var s = window.getComputedStyle(this.domObj.parentNode, null);
        var parHeight = s.height;
        if (parHeight) {
          var parNumHeight = parHeight.match(/\d/g);
          //
          // If the parent height is not a number (ie. "auto")
          if (!parNumHeight) {
            var errMsg = "It is not possible to calculate the height of the calendar. Check the parent height value or try with a value expressed in pixel.";
            throw new Error(errMsg);
            return;
          }
          parNumHeight = parseInt(parNumHeight.join(""));
          //
          var perc = parseInt(size.substring(0, idx));
          //
          newDim = parNumHeight * perc / 100;
          //
          if (!this.percDim)
            this.percDim = {};
          this.percDim[dim] = size;
        }
        else
          newDim = size;
      }
    }
  }
  //
  this.options[dim] = newDim;
  if (this.calendar)
    this.calendar.setOption(dim, newDim);
};


/**
 * Initialize the calendar
 * @param {Object} el - initial calendar data
 */
Client.Calendar6.prototype.initCalendar = function (el)
{
  // Get the dom element containing the calendar
  var calendarElem = document.getElementById(this.calendarId);
  //
  if (!this.options)
    this.options = {};
  this.options.initialView = this.options.initialView ? this.options.initialView : (this.calendarView || "dayGridMonth");
  if (this.calendarTheme) {
    this.options.themeSystem = "bootstrap5";
    this.options.buttonIcons = Client.Calendar6.default.themeButtonIcons;
  }
  //
  // Build the events array
  this.columns = el.data.columns;
  this.data = this.buildEventsArray(el);
  this.options.events = this.data;
  //
  // Attach the user events (onDayclick, onEventClick, ...)
  this.attachCalendarEvents(this.options);
  //
  // Create and show the calendar
  if (this.calendar)
    this.calendar.destroy();
  this.calendar = new FullCalendar.Calendar(calendarElem, this.options);
  //
  setTimeout( ()  => {
    this.calendar.render();
  }, 0);
  //
  // If there are pending updates, do them
  if (this.updateCache) {
    for (var i = 0; i < this.updateCache.length; i++) {
      if (this.updateCache[i].update)
        this.updateData(this.updateCache[i].data);
    }
    delete this.updateCache;
  }
};


/**
 * Builds the array of the events
 * @param {Object} el - the events to be represented by the calendar
 * @returns {Object}
 */
Client.Calendar6.prototype.buildEventsArray = function (el)
{
  var events = [];
  //
  for (var i = 0; i < el.data.data.length; i++) {
    // Build an event object for each set of data
    var evObj = this.buildEvent(el.data.data[i]);
    events.push(evObj);
  }
  //
  return {events: events};
};


/**
 * Builds an event
 * @param {Array} ev - event data
 * @returns {EventObject}
 */
Client.Calendar6.prototype.buildEvent = function (ev) {
  var evObj = {};
  //
  evObj.id = ev[0];
  evObj.title = ev[1];
  evObj.start = ev[2];
  if (ev.length > 3) {
    evObj.end = ev[3];
    for (var i = 4; i < ev.length; i++) {
      var col = this.columns[i];
      var value = ev[i];
      if (value === null || value === undefined)
        continue;
      evObj[col] = ev[i];
    }
  }
  //
  if (evObj.allDay === undefined) {
    try {
      var st = moment(evObj.start);
      var en = evObj.end ? moment(evObj.end) : st;
      //
      if (st.hour() === 0 && st.minute() === 0 && en.hour() === 0 && en.minute() === 0)
        evObj.allDay = true;
    }
    catch (ex) {
    }
  }
  //
  return evObj;
};


/**
 * Update calendar event after a datamap update
 * @param {Object} data - data of the event to update
 */
Client.Calendar6.prototype.updateData = function (data)
{
  // If the calendar is not yet rendered, cache the update for later
  if (!this.calendar || !this.isVisible() ) {
    this.updateCache = this.updateCache || [];
    this.updateCache.push({update:true, data });
    return;
  }
  //
  // Get the event properties
  var id = data.data[0];
  var title = data.data[1];
  var start = data.data[2];
  var end = data.data.length > 3 ? data.data[3] : null;
  //
  // Search the event in the calendar
  var currEv = this.calendar.getEventById(id);
  var updEv = {};
  updEv.id = id;
  updEv.title = title;
  updEv.start = start;
  updEv.end = end;
  //
  // If the client modifies an event the server will receive a message so it can modify the datamap.
  // When the server modifies the datamap the client will receive a message so it can modify its data.
  // To avoid loops I skip the event to update if it's the same of the event on the calendar.
  if (!currEv || this.sameEvent(updEv, Client.Calendar6.getPlainObject(currEv, {type: "event"})))
    return;
  //
  // Update the event properties
  currEv.setProp("title", title);
  currEv.setStart(new Date(start));
  if (end)
    currEv.setEnd(new Date(end));
  //
  for (var i = 4; i < data.data.length; i++) {
    var prop = this.columns[i];
    currEv.setProp(prop, data.data[i]);
  }
};


/**
 * Remove a calendar event after a datamap update
 * @param {Object} data - the event to remove
 */
Client.Calendar6.prototype.removeData = function (data)
{
  // If the calendar is not visible, cache the update for later
  // the calendar will auto-rerender and its width will become 0
  if (!this.isVisible() ) {
    this.updateCache = this.updateCache || [];
    this.updateCache.push({ remove:true, data });
    return;
  }
  //
  // Find the event to remove
  var event = this.data.events[data.pos];
  if (event) {
    // Remove the event from the data array
    this.data.events.splice(data.pos, 1);
    //
    // Remove the event from the calendar
    this.alreadyManaged.push(event.id);
    this.removeEvents(event.id);
  }
};


/**
 * Add an event to the calendar after a datamap update
 * @param {Object} data - data of the event to add
 */
Client.Calendar6.prototype.addData = function (data)
{
  // If the calendar is not visible, cache the update for later
  // the calendar will auto-rerender and its width will become 0
  if (!this.isVisible() ) {
    this.updateCache = this.updateCache || [];
    this.updateCache.push({ add:true, data });
    return;
  }
  //
  if (this.calendar && data.length > 1) {
    // Build an event object
    var newEvent = this.buildEvent(data);
    //
    var idx = this.alreadyManaged.indexOf(newEvent.id);
    if (idx > -1) {
      delete this.alreadyManaged[idx];
      return;
    }
    //
    // Add the event to the data array
    this.data.events.push(newEvent);
    //
    // Add the event to the calendar
    this.calendar.addEvent(newEvent);
  }
};


/**
 * Attach the events handlers to the calendar
 * @param {Object} opt - the object to attach the handlers to
 */
Client.Calendar6.prototype.attachCalendarEvents = function (opt)
{
  var adjustInfo = function (info) {
    if (info.event)
      info.event = Client.Calendar6.getPlainObject(info.event, {type: "event"});
    //
    if (info.prevEvent)
      info.prevEvent = Client.Calendar6.getPlainObject(info.prevEvent, {type: "event"});
    //
    if (info.oldEvent)
      info.oldEvent = Client.Calendar6.getPlainObject(info.oldEvent, {type: "event"});
    //
    if (info.view) {
      info.calendarView = Client.Calendar6.getPlainObject(info.view, {type: "view"});
      delete info.view;
    }
    //
    delete info.dayEl;
    delete info.el;
    delete info.draggedEl;
    //
    return info;
  }.bind(this);
  //
  // Attach the events
  if (this.events.includes("onDateClick")) {
    opt.dateClick = function (info) {
      var e = [{obj: this.id, id: "onDateClick", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onSelect")) {
    opt.select = function (info) {
      var e = [{obj: this.id, id: "onSelect", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onUnselect")) {
    opt.unselect = function (info) {
      var e = [{obj: this.id, id: "onUnselect", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventClick")) {
    opt.eventClick = function (info) {
      var e = [{obj: this.id, id: "onEventClick", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventMouseEnter")) {
    opt.eventMouseEnter = function (info) {
      var e = [{obj: this.id, id: "onEventMouseEnter", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventMouseLeave")) {
    opt.eventMouseLeave = function (info) {
      var e = [{obj: this.id, id: "onEventMouseLeave", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventDragStart")) {
    opt.eventDragStart = function (info) {
      var e = [{obj: this.id, id: "onEventDragStart", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventDragStop")) {
    opt.eventDragStop = function (info) {
      var e = [{obj: this.id, id: "onEventDragStop", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventDrop")) {
    opt.eventDrop = function (info) {
      var e = [{obj: this.id, id: "onEventDrop", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventResizeStart")) {
    opt.eventResizeStart = function (info) {
      var e = [{obj: this.id, id: "onEventResizeStart", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventResizeStop")) {
    opt.eventResizeStop = function (info) {
      var e = [{obj: this.id, id: "onEventResizeStop", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onEventResize")) {
    opt.eventResize = function (info) {
      var e = [{obj: this.id, id: "onEventResize", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
  //
  if (this.events.includes("onDatesRender")) {
    opt.datesSet = function (info) {
      var e = [{obj: this.id, id: "onDatesRender", content: adjustInfo(info)}];
      Client.mainFrame.sendEvents(e);
    }.bind(this);
  }
};


/**
 * Build sample data object
 * @returns {Object}
 */
Client.Calendar6.prototype.loadSampleData = function ()
{
  var data = {};
  data["columns"] = ["id", "title", "start", "end"];
  var today = new Date();
  var todayEnd = today.setHours(today.getHours() + 1);
  var tomorrow = today.setDate(today.getDate() + 1);
  var tomorrowEnd = tomorrow + 60 * 60;
  data["data"] = [[0, "Meeting", today, todayEnd], [1, "Meeting", tomorrow, tomorrowEnd]];
  //
  return {data: data};
};


/**
 * Update calendar options
 * @param {Object} el - options to update
 */
Client.Calendar6.prototype.changeCalendarOptions = function (el)
{
  if (!this.options)
    this.options = {};
  //
  // Cache the height
  var oldHeight = this.options.height;
  //
  // Update the options
  var newOpt = el;
  if (typeof el === "string")
    newOpt = JSON.parse(el);
  var keys = Object.keys(newOpt);
  for (var i = 0; i < keys.length; i++) {
    var prop = keys[i];
    this.options[prop] = newOpt[prop];
    //
    // Update the height separately and only if it's different from the old one
    if (prop === "height") {
      if (this.options.height !== oldHeight)
        this.changeDimension(prop, this.options.height);
    }
    else if (this.calendar)
      this.calendar.setOption(prop, newOpt[prop]);
  }
};


/**
 Move the calendar one step back (either by a month, week, or day).
 If the calendar is in month view, will move the calendar back one month.
 If the calendar is in basicWeek or agendaWeek, will move the calendar back one week.
 If the calendar is in basicDay or agendaDay, will move the calendar back one day.
 */
Client.Calendar6.prototype.prev = function ()
{
  if (this.calendar)
    this.calendar.prev();
};


/**
 Move the calendar one step forward (either by a month, week, or day).
 If the calendar is in month view, will move the calendar forward one month.
 If the calendar is in basicWeek or agendaWeek, will move the calendar forward one week.
 If the calendar is in basicDay or agendaDay, will move the calendar forward one day.
 */
Client.Calendar6.prototype.next = function ()
{
  if (this.calendar)
    this.calendar.next();
};
/**
 Move the calendar back one year.
 */
Client.Calendar6.prototype.prevYear = function ()
{
  if (this.calendar)
    this.calendar.prevYear();
};
/**
 Move the calendar forward one year.
 */
Client.Calendar6.prototype.nextYear = function ()
{
  if (this.calendar)
    this.calendar.nextYear();
};
/**
 Move the calendar to the current date.
 */
Client.Calendar6.prototype.today = function ()
{
  if (this.calendar)
    this.calendar.today();
};


/**
 * Move the calendar to an arbitrary date
 * @param {Datetime} date
 */
Client.Calendar6.prototype.goToDate = function (date)
{
  if (this.calendar)
    this.calendar.gotoDate(date);
};


/**
 * Move the calendar forward/backward an arbitrary amount of time
 * @param {Duration} duration - the amount of time to move. It can be specified in one of three ways:
 *                              - an object with any of the following keys: year, years, month, months, day, days, minute, minutes, second, seconds, millisecond, milliseconds, ms.
 *                              - a string in the format hh:mm:ss.sss, hh:mm:sss or hh:mm. For example, '05:00' signifies 5 hours.
 *                              - a total number of milliseconds
 */
Client.Calendar6.prototype.incrementDate = function (duration)
{
  if (this.calendar)
    this.calendar.incrementDate(duration);
};


/**
 * Return the current date of the calendar
 * @param {number} cbId
 * @returns {Datetime}
 */
Client.Calendar6.prototype.getDate = function (cbId)
{
  var currentDate;
  if (this.calendar)
    currentDate = this.calendar.getDate();
  //
  var e = [{obj: this.id, id: "cb", content: {res: currentDate, cbId: cbId}}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Remove an event from the calendar
 * @param {String} eventId - id of the event to remove, all events with the same id will be removed.
 */
Client.Calendar6.prototype.removeEvents = function (eventId)
{
  if (!this.calendar)
    return;
  //
  var calEvent = this.calendar.getEventById(eventId);
  if (calEvent) {
    calEvent.remove();
    //
    var idx = this.alreadyManaged.indexOf(eventId);
    if (idx >= 0)
      delete this.alreadyManaged[idx];
    else {
      var idField = this.columns[0];
      var filter = {};
      filter[idField] = eventId;
      var e = [{obj: this.id, id: "chgData", content: {name: "delete", filter: filter}}];
      if (!this.deleteEventTimeout) {
        var pthis = this;
        pthis.deleteEventTimeout = setTimeout(function () {
          pthis.deleteEventTimeout = undefined;
          Client.mainFrame.sendEvents(e);
        }, 0);
      }
    }
  }
};


/**
 * Adds events to the calendar
 * @param {String} id
 * @param {String} title
 * @param {Datetime} start
 * @param {Datetime} end
 * @param {Object} options
 */
Client.Calendar6.prototype.addEvent = function (id, title, start, end, options)
{
  // If there isn't a calendar or the title or the start time are missing I can't create the new event
  if (!this.calendar || !id || !title || !start)
    return;
  //
  // Build an event object
  var newEvent = {};
  newEvent.id = id;
  newEvent.title = title;
  newEvent.start = start;
  newEvent.end = end;
  var keys = Object.keys(options);
  for (var i = 0; i < keys.length; i++)
    newEvent[keys[i]] = options[keys[i]];
  //
  // Add the event to the calendar
  this.calendar.addEvent(newEvent);
  //
  // Inform the server
  this.alreadyManaged.push(newEvent.id);
  var e = [{obj: this.id, id: "chgData", content: {name: "insert", data: newEvent}}];
  if (!this.addEventTimeout) {
    var pthis = this;
    pthis.addEventTimeout = setTimeout(function () {
      pthis.addEventTimeout = undefined;
      Client.mainFrame.sendEvents(e);
    }, 0);
  }
};


/**
 * Update an event
 * @param {String} id - the id of the event to update
 * @param {Object} event
 */
Client.Calendar6.prototype.updateEvent = function (id, event)
{
  if (!this.calendar)
    return;
  //
  var ev = this.calendar.getEventById(id);
  var props = Object.keys(event);
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    if (p.toLowerCase() === "start" || this.columns.indexOf(p) === 2) {
      ev.setStart(new Date(event[p]));
      continue;
    }
    //
    if (p.toLowerCase() === "end") {
      ev.setEnd(new Date(event[p]));
      continue;
    }
    //
    if (this.columns.indexOf(p) === 3) {
      // check if it's the end date
      var endDate = new Date(event[p]);
      if (typeof event[p] === "string" && !isNaN(endDate)) {
        ev.setEnd(endDate);
        continue;
      }
    }
    //
    ev.setProp(p, event[p]);
  }
  //
  // Inform the server
  var filter = {};
  filter[this.columns[0]] = id;
  var e = [];
  e.push({obj: this.id, id: "chgData", content: {name: "update", data: event, filter: filter}});
  if (!this.updateTimeout) {
    var pthis = this;
    pthis.updateTimeout = setTimeout(function () {
      pthis.updateTimeout = undefined;
      Client.mainFrame.sendEvents(e);
    }, 0);
  }
};


/**
 * Retrieve events that FullCalendar has in memory.
 * @param {Object} filter - If filter is an ID, all events with the same ID will be returned.
 * filter may also be a filter function that accepts one Event Object argument and returns true if
 * it should be included in the result set.
 * @param {number} cbId
 * @returns {Array}
 */
Client.Calendar6.prototype.searchEvents = function (filter, cbId)
{
  var filter = filter || {};
  var res = [];
  if (this.calendar) {
    if (filter.id) {
      res.push(this.calendar.getEventById(filter.id));
    }
    else {
      res = this.calendar.getEvents();
      res = res.filter(function (event) {
        if (filter.title && event.title !== filter.title)
          return false;
        //
        if (filter.start && event.start._i !== filter.start)
          return false;
        //
        if (filter.end && event.end._i !== filter.end)
          return false;
        //
        return true;
      });
    }
  }
  //
  var result = [];
  for (var i = 0; i < res.length; i++)
    result.push(Client.Calendar6.getPlainObject(res[i], {type: "event"}));
  //
  var e = [{obj: this.id, id: "cb", content: {res: result, cbId: cbId}}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Select a period of time
 * @param {Object} options - contains the properties: start, end, allDay
 * @returns {undefined}
 */
Client.Calendar6.prototype.select = function (options)
{
  if (this.calendar)
    this.calendar.select(options);
};


/**
 * Clear the current selection
 */
Client.Calendar6.prototype.unselect = function ()
{
  if (this.calendar)
    this.calendar.unselect();
};


/**
 * Scroll the current view to the given time
 * @param {Object} duration
 */
Client.Calendar6.prototype.scrollToTime = function (duration)
{
  if (this.calendar)
    this.calendar.scrollToTime(duration);
};


/**
 * Switch to a different view
 * @param {String} view - a string representing a way of displaying days and events.
 */
Client.Calendar6.prototype.changeView = function (view)
{
  if (!this.calendar || !view)
    return;
  //
  this.calendar.changeView(view);
};


/**
 * Switch to a different theme
 * @param {String} theme - theme name
 */
Client.Calendar6.prototype.changeTheme = function (theme)
{
  this.calendarTheme = theme;
};


/**
 * Forces the calendar to readjusts its size
 */
Client.Calendar6.prototype.updateSize = function ()
{
  if (!this.calendar)
    return;
  //
  this.calendar.updateSize();
};


/**
 * Render the calendar. If it is already rendered, rerender it
 */
Client.Calendar6.prototype.render = function ()
{
  if (!this.calendar)
    return;
  //
  this.calendar.render();
};


/**
 * Return true if two events have the same id, title, start date and end date
 * @param {Object} event1
 * @param {Object} event2
 * @returns {Boolean}
 */
Client.Calendar6.prototype.sameEvent = function (event1, event2)
{
  if (event1.id !== event2.id)
    return false;
  //
  if (event1.title !== event2.title)
    return false;
  //
  if (new Date(event1.start).getTime() !== new Date(event2.start).getTime())
    return false;
  //
  if ((event1.end && !event2.end) || (!event1.end && event2.end))
    return false;
  //
  if (event1.end && event2.end && new Date(event1.end).getTime() !== new Date(event2.end).getTime())
    return false;
  //
  return true;
};


/**
 * Resize the element when the document view is resized
 * @param {Event} ev - the event occured when the document view was resized
 */
Client.Calendar6.prototype.onResize = function (ev)
{
  if (this.percDim) {
    if (this.percDim.height)
      this.changeDimension("height", this.percDim.height);
    if (this.percDim.width)
      this.changeDimension("width", this.percDim.width);
  }
  //
  Client.Element.prototype.onResize.call(this, ev);
};


/**
 * Return a plain object from a javascript Object
 * @param {EventObject|ViewObject} jsObj
 * @param {Object} opt
 * @returns {Object}
 */
Client.Calendar6.getPlainObject = function (jsObj, opt)
{
  var propsList = opt.type === "event" ? Client.Calendar6.eventProperties : Client.Calendar6.viewProperties;
  var v = {};
  for (var i = 0; i < propsList.length; i++) {
    var p = propsList[i];
    v[p] = jsObj[p];
  }
  return v;
};


/**
 * Tell to the children that the visibility has changed
 * @param {Boolean} visible
 */
Client.Calendar6.prototype.visibilityChanged = function (visible)
{
  if (this.calendar && visible) {
    // If there are pending updates, do them
    if (this.updateCache) {
      for (var i = 0; i < this.updateCache.length; i++) {
        if (this.updateCache[i].update)
          this.updateData(this.updateCache[i].data);
        if (this.updateCache[i].remove)
          this.removeData(this.updateCache[i].data);
        if (this.updateCache[i].add)
          this.addData(this.updateCache[i].data);
      }
      delete this.updateCache;
    }
  }
};

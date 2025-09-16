/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A video element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the span
 */
Client.Video = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("video");
  this.domObj.setAttribute("webkit-playsinline", "");
  this.domObj.setAttribute("playsinline", "");
  //
  this.addEventsListeners();
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

// Make Client.Video extend Client.Element
Client.Video.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Video.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  if (el.playing !== undefined) {
    if (el.playing)
      this.domObj.play();
    else
      this.domObj.pause();
    delete el.playing;
  }
  if (el.seekTime !== undefined) {
    this.changedTime = true;
    this.domObj.currentTime = el.seekTime;
    delete el.seekTime;
  }
  if (el.currentTime !== undefined) {
    this.changedTime = true;
  }
  if (el.volume !== undefined || el.muted !== undefined) {
    this.changedVolume = true;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Add events listeners
 */
Client.Video.prototype.addEventsListeners = function ()
{
  this.domObj.addEventListener("play", (ev) => {
    var e = [{obj: this.id, id: "chgProp", content: {name: "playing", value: true, clid: Client.id}}];
    if (this.sendPlaying)
      e.push({obj: this.id, id: "onPlayingChange", content: this.saveEvent(ev)});
    Client.mainFrame.sendEvents(e);
  }, true);
  //
  this.domObj.addEventListener("pause", (ev) => {
    var e = [{obj: this.id, id: "chgProp", content: {name: "playing", value: false, clid: Client.id}}];
    if (this.sendPlaying)
      e.push({obj: this.id, id: "onPlayingChange", content: this.saveEvent(ev)});
    Client.mainFrame.sendEvents(e);
  }, true);
  //
  this.domObj.addEventListener("seeked", (ev) => {
    if (!this.changedTime) {
      var e = [{obj: this.id, id: "chgProp", content: {name: "seekTime", value: this.domObj.currentTime, clid: Client.id}}];
      if (this.sendSeek) {
        let x = this.saveEvent(ev);
        x.seekTime = this.domObj.currentTime;
        e.push({obj: this.id, id: "onSeek", content: x});
      }
      Client.mainFrame.sendEvents(e);
    }
    this.changedTime = false;
  }, true);
  //
  this.domObj.addEventListener("volumechange", (ev) => {
    if (!this.changedVolume) {
      var e = [{obj: this.id, id: "chgProp", content: {name: "volume", value: this.domObj.volume, clid: Client.id}},
        {obj: this.id, id: "chgProp", content: {name: "muted", value: this.domObj.muted, clid: Client.id}}];
      if (this.sendVolume)
        e.push({obj: this.id, id: "onVolumeChange", content: this.saveEvent(ev)});
      Client.mainFrame.sendEvents(e);
    }
    this.changedVolume = false;
  }, true);
  //
  this.domObj.addEventListener("ended", () => {
    if (this.sendEnded)
      Client.mainFrame.sendEvents([{obj: this.id, id: "onEnded"}]);
  }, true);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.Video.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onVolumeChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendVolume = true;
  }
  pos = events.indexOf("onPlayingChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendPlaying = true;
  }
  pos = events.indexOf("onSeek");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendSeek = true;
  }
  pos = events.indexOf("onEnded");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendEnded = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Request to go fullscreen
 */
Client.Video.prototype.requestFullScreen = function ()
{
  try {
    this.domObj.requestFullscreen();
  }
  catch (e) {
    console.log("Client.Video.requestFullScreen exception", e);
  }
};

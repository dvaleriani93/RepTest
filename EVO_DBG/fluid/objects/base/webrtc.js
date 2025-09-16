/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A WebRTC object
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the element
 */
Client.WebRTC = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  if (Client.mainFrame.device.operatingSystem === "ios")
    this.oldios = parseInt(Client.mainFrame.device.operatingSystemVersion.trim()) < 11;
  else
    this.oldios = Client.mainFrame.device.browserName === "Safari" && parseInt(Client.mainFrame.device.browserVersion.trim()) < 11;
  //
  var peerjs = {host: window.location.hostname, port: window.location.port, path: "/peerjs", secure: true, config: {"iceServers": [
        {urls: "turn:" + window.location.hostname + ":3478", credential: "indert", username: "indert"},
        {urls: "turn:130.211.77.84:3478", credential: "indert", username: "indert"}
      ]}};
  //
  // Default values for webrtc properties
  this._audio = true;
  this._video = true;
  this._autoRespond = false;
  //
  this.domObj = document.createElement("div");
  //
  // in case of iOS I append divs in order to keep layout intact, but not have video elements
  this.localVideo = document.createElement(this.oldios ? "div" : "video");
  this.domObj.appendChild(this.localVideo);
  //
  this.remoteVideo = document.createElement(this.oldios ? "div" : "video");
  this.domObj.appendChild(this.remoteVideo);
  //
  this.localVideo.style.width = "25%";
  this.remoteVideo.style.width = "100%";
  this.remoteVideo.style.height = "100%";
  //
  // Create a new peer
  if (!this.oldios)
    this.peer = new Peer(peerjs);
  else {
    // Local video default values of widthPercentage and coordinates
    this._lv = {
      wp: 25,
      c: ["right", "bottom"],
      style: {} // ignored right now
    };
    //
    this.cordovaWebRTC = new Client.CordovaWebRTC(this);
    window.addEventListener("message", function (ev) {
      if (ev.data.destination === "rtc")
        this.cordovaWebRTC.processMessage(ev.data); // ev.data is cmd
    }.bind(this));
    //
    // prepare dom objects and peer on device
    this.cordovaWebRTC.init(peerjs);
  }
  //
  //
  this.updateElement(element);
  //
  // If the element is used as app component
  if (parent) {
    if (this.oldios)
      this.cordovaWebRTC.attachEvents(element.events);
    this.attachEvents(element.events);
    parent.appendChildObject(this, this.domObj);
    if (this.oldios)
      this.updateCordovaDOM();
  }
};
// Make Client.open WebRTC extend Client.Element
Client.WebRTC.prototype = new Client.Element();

Object.defineProperties(Client.WebRTC.prototype, {
  audio: {
    get: function () {
      return this._audio;
    },
    set: function (value) {
      this._audio = value;
      if (this.cordovaWebRTC)
        this.cordovaWebRTC.set({audio: value});
    }
  },
  video: {
    get: function () {
      return this._video;
    },
    set: function (value) {
      this._video = value;
      if (this.cordovaWebRTC)
        this.cordovaWebRTC.set({video: value});
    }
  },
  autoRespond: {
    get: function () {
      return this._autoRespond;
    },
    set: function (value) {
      this._autoRespond = value;
      if (this.cordovaWebRTC)
        this.cordovaWebRTC.set({autoRespond: value});
    }
  },
  remoteId: {
    get: function () {
      return this._remoteId;
    },
    set: function (value) {
      this._remoteId = value;
      if (this.cordovaWebRTC)
        this.cordovaWebRTC.set({remoteId: value});
    }
  }
});
/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.WebRTC.prototype.updateElement = function (el)
{
  // Base class must not use the list property
  if (el.localVideo !== undefined) {
    this.setLocalVideo(el.localVideo);
    //
    // Base class must not use the localVideo property
    delete el.localVideo;
  }
  //
  if (el.sendAudio !== undefined) {
    this.audio = el.sendAudio;
    if (!this.oldios) {
      if (this.incomingCall !== undefined) {
        //
        if (this.audio) {
          // If the call was started without audio, it needs to call getUserMedia to get audio stream
          if (this.localStream.getAudioTracks().length === 0)
            this.getUserMedia();
          else
            this.localStream.getAudioTracks()[0].enabled = true;  // Enable audio
        }
        else
          this.localStream.getAudioTracks()[0].enabled = false; // Disable audio
      }
    }
    //
    // Base class must not use the sendAudio property
    delete el.sendAudio;
  }
  //
  if (el.sendVideo !== undefined) {
    this.video = el.sendVideo;
    this.localVideo.style.display = this.video ? "block" : "none"
    //
    if (!this.oldios) {
      if (this.incomingCall !== undefined) {
        if (this.video) {
          // If the call was started without video, it needs to call getUserMedia to get video stream
          if (this.localStream.getVideoTracks().length === 0)
            this.getUserMedia();
          else // Enable video
            this.localStream.getVideoTracks()[0].enabled = true;
        }
        else // Disable video
          this.localStream.getVideoTracks()[0].enabled = false;
      }
    }
    //
    // Base class must not use the sendVideo property
    delete el.sendVideo;
  }
  //
  if (el.peerId !== undefined) {
    this.remoteId = el.peerId;
    //
    // Base class must not use the peerId property
    delete el.peerId;
  }
  //
  if (el.autoRespond !== undefined) {
    this.autoRespond = el.autoRespond;
    //
    // Base class must not use the autoRespond property
    delete el.autoRespond;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.WebRTC.prototype.close = function (el)
{
  if (this.oldios)
    this.cordovaWebRTC.close();
  //
  Client.Element.prototype.close.call(this, el);
};



/**
 * Attach webrtc events
 * @param {Array} events - array of the events to handle
 */
Client.WebRTC.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var idxic = events.indexOf("onChange");
  //
  // If the event is in the array, remove it
  if (idxic >= 0)
    events.splice(idxic, 1);
  this.peerOnOpenCB = function (id) {
    var e = [{obj: this.id, id: "chgProp", content: {name: "peerId", value: id, clid: Client.id}}];
    if (idxic >= 0)
      e.push({obj: this.id, id: "onChange", content: {}});
    Client.mainFrame.sendEvents(e);
  }.bind(this);
  if (this.peer)
    this.peer.on("open", this.peerOnOpenCB);
  //
  var idxii = events.indexOf("onIncomingCall");
  if (idxii >= 0)
    //
    // If the event is in the array, remove it
    events.splice(idxii, 1);
  this.peerOnCallCB = function () {
    if (idxii >= 0) {
      var e = [{obj: this.id, id: "onIncomingCall", content: {}}];
      Client.mainFrame.sendEvents(e);
    }
  }.bind(this);
  if (this.peer)
    this.peer.on("call", function (call) {
      // The onIncomingCall event has to be fired only when call starts for the first time
      if (this.incomingCall === undefined) {
        this.peerOnCallCB();
        this.incomingCall = call;
        if (this.autoRespond)
          this.startCall();
      }
    }.bind(this));
  //
  var idxie = events.indexOf("onError");
  if (idxie >= 0) {
    // Remove the event from the events array
    events.splice(idxie, 1);
    this.onError = true;
  }
  this.peerOnErrorCB = function (err) {
    if (idxie >= 0) {
      var e = [{obj: this.id, id: "onError", content: err.type}];
      Client.mainFrame.sendEvents(e);
    }
  }.bind(this);
  //
  if (this.peer)
    this.peer.on("error", this.peerOnErrorCB);
  //
  var idxis = events.indexOf("onStartCall");
  if (idxis >= 0) {
    // Remove the event from the events array
    events.splice(idxis, 1);
    this.onStartCall = true;
  }
  //
  var idxiz = events.indexOf("onEndCall");
  if (idxiz >= 0) {
    // Remove the event from the events array
    events.splice(idxiz, 1);
    this.onEndCall = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Start a call with remote peer
 */
Client.WebRTC.prototype.startCall = function ()
{
  // Get local streams and start call
  if (!this.oldios)
    this.getUserMedia(this.incomingCall);
  else
    this.cordovaWebRTC.startCall();
};


/**
 * Set remote streams
 * @param {Object} call - the current call
 */
Client.WebRTC.prototype.setRemoteVideo = function (call)
{
  // Receive remote stream and put it into remote video container
  call.on("stream", function (remoteStream) {
    // If I'm waiting for both audio and video, wait until both tracks are available
    if (this.audio && this.video && remoteStream.getTracks().length < 2)
      return;
    //
    if (this.onStartCall) {
      var e = [{obj: this.id, id: "onStartCall", content: {}}];
      Client.mainFrame.sendEvents(e);
    }
    //
    // Set remote video
    this.remoteURL = remoteStream;
    this.remoteVideo.srcObject = this.remoteURL;
    this.remoteVideo.autoplay = true;
    this.remoteVideo.playsInline = true;
    //
    // When remote video is ready, display local video too
    if (this.video)
      this.localVideo.style.display = "block";
    //
    // Make this call to be the incoming call
    this.incomingCall = call;
    //
    // Display webrtc popup if present
    if (this.dialog)
      this.dialog.style.display = "flex";
  }.bind(this));
  //
  call.on("close", function () {
    if (this.onEndCall) {
      this.endCall();
      //
      // Notify the end call event to the server
      var e = [{obj: this.id, id: "onEndCall", content: {}}];
      Client.mainFrame.sendEvents(e);
    }
  }.bind(this));
  //
  call.on("error", function (err) {
    // Notify an error to the server
    if (this.onError) {
      var e = [{obj: this.id, id: "onError", content: err.type}];
      Client.mainFrame.sendEvents(e);
    }
  }.bind(this));
};


/**
 * Close a call
 */
Client.WebRTC.prototype.endCall = function ()
{
  if (!this.oldios) {
    if (this.incomingCall) {
      // Remove webcam access & close call
      var tracks = this.localStream.getTracks();
      for (var i = 0; i < tracks.length; i++)
        this.localStream.getTracks()[i].stop();
      //
      this.incomingCall.close();
      this.incomingCall = undefined;
      //
      // Remove video sources
      this.localVideo.style.display = "none";
      if (this.localVideo.srcObject) {
        this.localVideo.srcObject.getTracks().forEach(function (track) {
          track.stop();
          this.localVideo.srcObject.removeTrack(track);
        }.bind(this));
      }
      //
      if (this.remoteVideo.srcObject) {
        this.remoteVideo.srcObject.getTracks().forEach(function (track) {
          track.stop();
          this.remoteVideo.srcObject.removeTrack(track);
        }.bind(this));
      }
      //
      this.localVideo.srcObject = null;
      this.remoteVideo.srcObject = null;
    }
  }
  else {
    this.cordovaWebRTC.endCall();
    //
    // localvideo exists even when using ios trick
    if (this.incomingCall)
      this.localVideo.style.display = "none";
  }
};


/**
 * Get local media streams and call or answer depending on the call value
 * @param {Object} call - the current call
 */
Client.WebRTC.prototype.getUserMedia = function (call)
{
  var onMediaSuccess = function (stream) {
    if (this.multiClientPopup)
      this.openMultiClientPopup(this.mainFrame, this.popupStyle);
    //
    // Put local video stream
    this.localURL = stream;
    //
    var zIndex = this.remoteVideo.style.zIndex + 1;
    this.localVideo.style.zIndex = zIndex;
    this.localVideo.style.position = "absolute";
    //
    // Set local video properties
    this.localVideo.srcObject = this.localURL;
    this.localVideo.autoplay = true;
    this.localVideo.muted = true;
    this.localVideo.playsInline = true;
    this.localVideo.volume = 0;
    //
    // Stop the localStream, if present, in order to allow recall
    if (this.localStream) {
      var tracks = this.localStream.getTracks();
      for (var i = 0; i < tracks.length; i++)
        this.localStream.getTracks()[i].stop();
    }
    //
    this.localStream = stream;
    //
    // I'm the caller
    if (call === undefined) {
      var options = {constraints: {mandatory: {OfferToReceiveAudio: true, OfferToReceiveVideo: true}}};
      var calling;
      //
      // Start call normally or handle the case in which there is an existing call without audio or video
      // and now you want to add one of these streams
      if (this.incomingCall === undefined)
        calling = this.peer.call(this.remoteId, this.localStream, options);
      else {
        // Remote peer id
        var remoteId = this.incomingCall.peer;
        //
        // Close existing call and start a new one with audio/video stream added
        this.incomingCall.close();
        calling = this.peer.call(remoteId, this.localStream, options);
      }
      //
      this.setRemoteVideo(calling);
    }
    else { // I'm the callee
      call.answer(this.localStream);
      this.setRemoteVideo(call);
    }
  }.bind(this);
  //
  var onMediaError = function (err) {
    if (this.onError) {
      var e = [{obj: this.id, id: "onError", content: "Error on audio/video access"}];
      Client.mainFrame.sendEvents(e);
    }
  }.bind(this);
  //
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Callback when user allows access to local audio/video streams
    navigator.mediaDevices.getUserMedia({audio: this.audio, video: this.video}).then(function (stream) {
      onMediaSuccess(stream);
    }).catch(function (err) {
      onMediaError(err);
    });
  }
  else {
    // For browser compatibility
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (navigator.getUserMedia) {
      // Called when user allows access to local audio/video streams
      navigator.getUserMedia({audio: this.audio, video: this.video}, function (stream) {
        onMediaSuccess(stream);
      }, function () {
        onMediaError();
      });
    }
    else {
      if (this.onError) {
        var e = [{obj: this.id, id: "onError", content: "GetUserMedia not supported by your browser"}];
        Client.mainFrame.sendEvents(e);
      }
    }
  }
};


/**
 * Set size and position of local video container at the given values
 * @param {Object} settings - the size and position of the video container
 */
Client.WebRTC.prototype.setLocalVideo = function (settings)
{
  //
  if (!this.oldios) {
    // Set width
    this.localVideo.style.width = (settings.width === undefined) ? "25%" : settings.width;
    //
    // Set position
    var dim = this.localVideo.style.width.split("%")[0];
    var ver;
    var hor;
    var coord = [];
    //
    // Position default values
    coord[0] = "right";
    coord[1] = "bottom";
    if (settings.position)
      coord = settings.position.split(" ");
    //
    // Calculate the position of local video compared to remote video
    switch (coord[0]) {
      case "left":
        hor = 0;
        break;
      case "center":
        hor = (100 - dim) / 2;
        break;
      default:
        hor = 100 - dim;
        break;
    }
    //
    switch (coord[1]) {
      case "top":
        ver = 0;
        break;
      case "center":
        ver = (75 - (0.75 * dim)) / 2;
        break;
      default:
        ver = 75 - (0.75 * dim);
        break;
    }
    //
    this.localVideo.style.left = hor + "%";
    this.localVideo.style.marginTop = ver + "%";
    //
    // Set style
    if (settings.style) {
      this.localVideo.style.display = "none";
      //
      for (var pr in settings.style)
        this.localVideo.style[pr] = settings.style[pr];
    }
  }
  else {
    if (settings.width)
      this._lv.wp = parseInt(settings.width.split("%")[0]);
    //
    if (settings.position)
      this._lv.c = settings.position.split(" ");
    //
    if (settings.style) {
      this._lv.style.display = "none";
      //
      for (var pr in settings.style)
        this._lv.style[pr] = settings.style[pr];
    }
    //
    this.updateCordovaDOM();
  }
};


/**
 * Open webrtc popup on client when it is connecting to existing session
 * @param {Client.MainFrame} mainFrame - the app
 * @param {Object} settings
 */
Client.WebRTC.prototype.openMultiClientPopup = function (mainFrame, settings)
{
  // Create a background div
  this.dialog = document.createElement("div");
  this.dialog.className = "rtc-popup-default";
  //
  // Create a popup
  var popup = document.createElement("div");
  popup.className = "dialog-int";
  //
  // Append the popup to the background div
  this.dialog.appendChild(popup);
  //
  // Append the background div to the app-ui or to the custom parent
  var parent;
  if (settings) {
    if (settings.parent) {
      parent = document.getElementById(settings.parent);
      if (!parent)
        parent = document.getElementById("app-ui");
      else {
        this.dialog.classList.remove("rtc-popup-default");
        this.dialog.classList.add("rtc-popup-custom");
      }
    }
    else
      parent = document.getElementById("app-ui");
  }
  else
    parent = document.getElementById("app-ui");
  //
  parent.appendChild(this.dialog);
  //
  // Append webrtc to the popup
  popup.appendChild(this.domObj);
  //
  // Create controls box
  var controlsBox = document.createElement("div");
  controlsBox.className = "rtc-controls-box";
  popup.appendChild(controlsBox);
  //
  // Create control video button
  var use;
  var btnVideo = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  btnVideo.classList.add("rtc-icon");
  if (!this.video)
    btnVideo.classList.add("rtc-icon-selected");
  //
  use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#video-camera");
  btnVideo.appendChild(use);
  controlsBox.appendChild(btnVideo);
  //
  btnVideo.onclick = function () {
    var el;
    if (this.video) {
      btnVideo.classList.add("rtc-icon-selected");
      el = {sendVideo: false};
      this.updateElement(el);
    }
    else {
      btnVideo.classList.remove("rtc-icon-selected");
      el = {sendVideo: true};
      this.updateElement(el);
    }
  }.bind(this);
  //
  // Create control audio button
  var btnAudio = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  btnAudio.classList.add("rtc-icon");
  if (!this.audio)
    btnAudio.classList.add("rtc-icon-selected");
  use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#mic");
  btnAudio.appendChild(use);
  controlsBox.appendChild(btnAudio);
  //
  btnAudio.onclick = function () {
    var el;
    if (this.audio) {
      btnAudio.classList.add("rtc-icon-selected");
      el = {sendAudio: false};
      this.updateElement(el);
    }
    else {
      btnAudio.classList.remove("rtc-icon-selected");
      el = {sendAudio: true};
      this.updateElement(el);
    }
  }.bind(this);
  //
  // Create close button
  var btnClose = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  btnClose.classList.add("rtc-icon");
  use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#cross");
  btnClose.appendChild(use);
  controlsBox.appendChild(btnClose);
  //
  btnClose.onclick = function () {
    var e;
    //
    // If the owner closes its webrtc all guests will be disconnected else disconnect guest
    if (Client.clientType === "owner") {
      e = [{id: "closeAllGuests"}];
      mainFrame.sendEvents(e);
    }
    else {
      e = [{id: "onDisconnectingGuest"}];
      mainFrame.sendEvents(e);
      //
      this.endCall();
      this.removePopup();
      window.location = Client.exitUrl;
    }
  }.bind(this);
  //
  window.onbeforeunload = function () {
    var e;
    //
    // If the owner closes its webrtc all guests will be disconnected else disconnect guest
    if (Client.clientType === "owner") {
      e = [{id: "closeAllGuests"}];
      mainFrame.sendEvents(e);
    }
    else {
      e = [{id: "onDisconnectingGuest"}];
      mainFrame.sendEvents(e);
      //
      this.endCall();
      this.removePopup();
      window.location = Client.exitUrl;
    }
  }.bind(this);
  //
  if (this.dialog.classList.contains("rtc-popup-custom")) {
    var dim = Math.min(parent.clientHeight, parent.clientWidth) - 30;
    this.remoteVideo.style.height = dim + "px";
  }
  else if (this.dialog.classList.contains("rtc-popup-default"))
    this.remoteVideo.style.width = "100%";
  //
  // Apply style if present
  var style;
  if (settings.style) {
    // Apply popup style
    if (settings.style.popup) {
      if (settings.style.popup.indexOf(":") !== -1) {
        style = JSON.parse(settings.style.popup);
        for (var i = 0; i < Object.keys(style).length; i++)
          this.dialog.style[Object.keys(style)[i]] = style[Object.keys(style)[i]];
      }
      else
        this.dialog.classList.add(settings.style.popup);
    }
    //
    // Apply local video style
    if (settings.style.localVideo) {
      if (settings.style.localVideo.indexOf(":") !== -1) {
        style = JSON.parse(settings.style.localVideo);
        for (var i = 0; i < Object.keys(style).length; i++)
          this.localVideo.style[Object.keys(style)[i]] = style[Object.keys(style)[i]];
      }
      else
        this.localVideo.classList.add(settings.style.localVideo);
    }
    //
    // Apply remote video style
    if (settings.style.remoteVideo) {
      if (settings.style.remoteVideo.indexOf(":") !== -1) {
        style = JSON.parse(settings.style.remoteVideo);
        for (var i = 0; i < Object.keys(style).length; i++)
          this.remoteVideo.style[Object.keys(style)[i]] = style[Object.keys(style)[i]];
      }
      else
        this.remoteVideo.classList.add(settings.style.remoteVideo);
    }
    //
    // Apply videos container style
    if (settings.style.videosContainer) {
      if (settings.style.videosContainer.indexOf(":") !== -1) {
        style = JSON.parse(settings.style.videosContainer);
        for (var i = 0; i < Object.keys(style).length; i++)
          popup.style[Object.keys(style)[i]] = style[Object.keys(style)[i]];
      }
      else
        controlsBox.classList.add(settings.style.videosContainer);
    }
    //
    // Apply toolbar style
    if (settings.style.toolbar) {
      if (settings.style.toolbar.indexOf(":") !== -1) {
        style = JSON.parse(settings.style.toolbar);
        for (var i = 0; i < Object.keys(style).length; i++)
          controlsBox.style[Object.keys(style)[i]] = style[Object.keys(style)[i]];
      }
      else
        controlsBox.classList.add(settings.style.toolbar);
    }
  }
};

/**
 * Remove webrtc popup
 */
Client.WebRTC.prototype.removePopup = function () {
  if (this.dialog.parentNode)
    this.dialog.parentNode.removeChild(this.dialog);
};

/**
 * Restore the last call
 * @param {String} clientType
 */
Client.WebRTC.prototype.restoreCall = function (clientType) {
  if (!this.incomingCall)
    return;
  //
  this.incomingCall.close();
  //
  this.localVideo.srcObject = this.localStream;
  if (clientType !== "owner") {
    var calling = this.peer.call(this.remoteId, this.localStream);
    this.setRemoteVideo(calling);
  }
};

Client.WebRTC.prototype.updateCordovaDOM = function (localVideo)
{
  // Get position and size of dom objects for device's
  var remoteBound = this.domObj.getBoundingClientRect();
  var localBound = this.localVideo.getBoundingClientRect();
  var appuiBound = document.getElementById("app-ui").getBoundingClientRect();
  //
  // calculate absolute values
  // remote video uses domObj values,
  // local video is calculated from remote video
  var bound = {
    remote: {
      t: remoteBound.top - appuiBound.top,
      l: remoteBound.left - appuiBound.left,
      w: remoteBound.width,
      h: remoteBound.height
    }
  };
  //
  // calculate local video
  bound.local = {
    w: this._lv.wp * bound.remote.w / 100,
    h: this._lv.wp * bound.remote.w / 100, //square
    t: remoteBound.top - appuiBound.top,
    l: remoteBound.left - appuiBound.left
  };
  if (this._lv.c.indexOf("right") >= 0) {
    bound.local.l += bound.remote.w - bound.local.w;
  }
  if (this._lv.c.indexOf("bottom") >= 0) {
    bound.local.t += bound.remote.h - bound.local.h;
  }
  //
  var properties = {
    bound: bound,
    display: this.domObj.style.display,
    visibility: this.domObj.style.visibility,
    opacity: this.domObj.style.opacity
  };
  this.cordovaWebRTC.updateDOM(properties);
};


/**
 * Prepare multi client popup
 * @param {Client.MainFrame} mainFrame
 * @param {Object} popupStyle
 */
Client.WebRTC.prototype.prepareMultiClientPopup = function (mainFrame, popupStyle) {
  var pthis = this;
  this.multiClientPopup = true;
  this.mainFrame = mainFrame;
  this.popupStyle = popupStyle || {};
  //
  if (!this.peer)
    return;
  //
  // If I'm the session owner send chgProp event
  this.peer.on("open", function (id) {
    if (Client.clientType === "owner") {
      var e = [{id: "chgProp", content: {name: "ownerPeerId", value: id, clid: Client.id}}];
      mainFrame.sendEvents(e);
    }
  });
  //
  // On incoming call, answer and start it
  this.peer.on("call", function (call) {
    // Answer getting user media if this is the call start or simply answer if there was
    // an existing call, but remote audio/video stream have been added or removed
    if (this.incomingCall === undefined)
      this.getUserMedia(call);
    else {
      call.answer(this.localStream);
      this.setRemoteVideo(call);
    }
  }.bind(this));
};

Client.WebRTC.prototype.selectAudioOutput = function (output) {
  if (this.oldios)
    this.cordovaWebRTC.set({audioOutput: output});
};

Client.CordovaWebRTC = function (webrtc)
{
  this.id = "device-webrtc";
  this.webrtc = webrtc;
};

Client.CordovaWebRTC.prototype.processMessage = function (cmd) {
  if (cmd.obj === this.id)
    this[cmd.id](cmd.content);
};

Client.CordovaWebRTC.prototype.init = function (peerjs) {
  parent.postMessage({obj: this.id, id: "init", cnt: {peerjs: peerjs}}, "*");
};

Client.CordovaWebRTC.prototype.updateDOM = function (properties) {
  parent.postMessage({obj: this.id, id: "updateDOM", cnt: properties}, "*");
};

Client.CordovaWebRTC.prototype.attachEvents = function (events) {
  parent.postMessage({obj: this.id, id: "attachEvents", cnt: events}, "*");
};

Client.CordovaWebRTC.prototype.startCall = function () {
  parent.postMessage({obj: this.id, id: "startCall", cnt: {}}, "*");
};

Client.CordovaWebRTC.prototype.endCall = function () {
  parent.postMessage({obj: this.id, id: "endCall", cnt: {}}, "*");
};

Client.CordovaWebRTC.prototype.set = function (prop) {
  parent.postMessage({obj: this.id, id: "set", cnt: prop}, "*");
};

Client.CordovaWebRTC.prototype.close = function () {
  parent.postMessage({obj: this.id, id: "close", cnt: {}}, "*");
};

Client.CordovaWebRTC.prototype.onStartCallCB = function (res) {
  var pthis = this;
  if (this.webrtc.onStartCall) {
    var e = [{obj: pthis.webrtc.id, id: "onStartCall", content: {}}];
    Client.mainFrame.sendEvents(e);
  }
};

Client.CordovaWebRTC.prototype.onEndCallCB = function (res) {
  var pthis = this;
  if (this.webrtc.onEndCall) {
    var e = [{obj: pthis.webrtc.id, id: "onEndCall", content: {}}];
    Client.mainFrame.sendEvents(e);
  }
};

Client.CordovaWebRTC.prototype.onErrorCB = function (res) {
  var pthis = this;
  if (this.webrtc.onError) {
    var e = [{obj: pthis.webrtc.id, id: "onError", content: res}];
    Client.mainFrame.sendEvents(e);
  }
};

Client.CordovaWebRTC.prototype.onPeerOpenCB = function (res) {
  this.webrtc.peerOnOpenCB(res);
};

Client.CordovaWebRTC.prototype.onPeerCallCB = function (res) {
  this.webrtc.peerOnCallCB(res);
};

Client.CordovaWebRTC.prototype.onPeerErrorCB = function (res) {
  this.webrtc.peerOnErrorCB(res);
};

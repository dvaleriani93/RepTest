/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Speech
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Speech = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  //
  // speech object
  this.speechSynthesis = window.speechSynthesis;
  //
  // Listener on onbeforeunloadevent
  window.addEventListener("beforeunload", function () {
    // stop speaking
    this.speechSynthesis.cancel();
  }.bind(this));
  //
  // istantiate speech recognition object
  if (window.SpeechRecognition)
    this.listenObj = new window.SpeechRecognition();
  else if (window.webkitSpeechRecognition)
    this.listenObj = new window.webkitSpeechRecognition();
  //
  // timer
  this.timer;
};


/**
 * Returns true if speech recognition is available.
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.isRecognitionAvailable = function (req)
{
  req.setResult(!!this.listenObj);
};


/**
 * Returns true if permission has already been given to recognize speech
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.hasPermission = function (req)
{
  if (navigator.permissions) {
    // On iOS navigator.permissions not supported
    navigator.permissions.query({name: "microphone"}).then(function (result) {
      if (result.state === "granted" || result.state === "prompt")
        req.setResult(true);
      else
        req.setResult(false);
    }).catch(function (err) {
      // If permissions.query not supported
      this.requestPermission(req);
    }.bind(this));
  }
  else
    this.requestPermission(req);
};


/**
 * Requests permission to record and recognize speech and returns true if permission was granted
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.requestPermission = function (req)
{
  // If successfully retrieved a microphone will also ask for permission to use it
  navigator.mediaDevices.getUserMedia({audio: true}).then(function () {
    req.setResult(true);
  }).catch(function () {
    req.setResult(false);
  });
};


/**
 * Reads the message passed as a parameter and returns when reading has finished
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.speak = function (req)
{
  req.params.msg = req.params.msg || {};
  //
  try
  {
    // cancel previous speak actions
    this.speechSynthesis.cancel();
    //
    // create speech object
    var speechObj = new SpeechSynthesisUtterance();
    //
    // set params
    speechObj.text = req.params.msg.text || "";
    speechObj.lang = req.params.msg.locale || "it-IT";
    //
    // set voice param
    if (req.params.msg.voice) {
      var voices = this.speechSynthesis.getVoices();
      //
      for (var i = 0; i < voices.length; i++)
        if (voices[i].name === req.params.msg.voice) {
          speechObj.lang = voices[i].lang;
          speechObj.voice = voices[i];
          break;
        }
    }
    //
    speechObj.rate = req.params.msg.rate || 1;
    //
    // start speak
    this.speechSynthesis.speak(speechObj);
    //
    // call callback only when the speaking is end
    function _wait() {
      if (!this.speechSynthesis.speaking) {
        req.setResult();
        return;
      }
      setTimeout(_wait, 200);
    }
    _wait();
  }
  catch (ex)
  {
    req.setError(ex.message);
  }
};


/**
 * Stop speaking
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.stopSpeak = function (req)
{
  this.speechSynthesis.cancel();
};


/**
 * Recognizes speech and returns the array of the items recognized
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.startListening = function (req)
{
  req.params.options = req.params.options || {};
  //
  var permission = false;
  //
  // if "continuos" property is true and "timeOut" is null, must return immediately
  //  without interrupting the event "onSpeechRecognized"
  if (req.params.options.continuos && !req.params.options.timeOut)
    req.setResult();
  //
  var results = [];
  var eventResults = [];
  //
  // set "continuos" property, is true if is specified or there is timeOut param
  this.listenObj.continuous = req.params.options.continuos || !!req.params.options.timeOut;
  //
  // set "interimResults" property, is true if is specified or there is timeOut param
  this.listenObj.interimResults = req.params.options.interimResults || !!req.params.options.timeOut;
  //
  // set "language" property,
  this.listenObj.lang = req.params.options.language || "it-IT";
  //
  // create timer function, use where there is timeOut param
  var createTimer = function () {
    //
    this.timer = setTimeout(function () {
      // interrupr listening
      this.listenObj.stop();
    }.bind(this), req.params.options.timeOut);
  }.bind(this);
  //
  // start speech recognition
  this.listenObj.start();
  //
  // result event
  this.listenObj.onresult = function (ev) {
    results = ev.results;
    //
    // remove  timer
    if (this.timer)
      clearTimeout(this.timer);
    //
    // build "onSpeechRecognized" event restult
    for (var i = 0; i < ev.results.length; i++) {
      // add result only if is final or if param "interimResults" was specified
      if (ev.results[i].isFinal || req.params.options.interimResults) {
        eventResults.push({
          transcript: ev.results[i][0].transcript,
          confidence: ev.results[i][0].confidence,
          isFinal: ev.results[i].isFinal
        });
      }
    }
    //
    // fire speechRecognized plugin "onSpeechRecognized" event
    req.result = eventResults;
    //
    eventResults = [];
    this.shellEmulator.sendEvent(req, "SpeechRecognized");
    //
    // if necessary recreate timer to restart it
    if (req.params.options.timeOut)
      createTimer();
  }.bind(this);
  //
  // error event
  this.listenObj.onError = function (ev) {
    req.setError(ev.error);
  }.bind(this);
  //
  // start event
  this.listenObj.onstart = function () {
    //
    // if this event was trigger, set permission true
    permission = true;
    //
    // if necessary create timer
    if (req.params.options.timeOut)
      createTimer();
  }.bind(this);
  //
  // speech end event
  this.listenObj.onspeechend = function () {
    // stop listenObj
    this.listenObj.stop();
  }.bind(this);
  //
  // globally speech end event
  this.listenObj.onend = function () {
    // if permission is false, return an error
    if (!permission)
      req.setError("Permission denied");
    //
    // clear timer
    clearTimeout(this.timer);
    //
    // if is necessary, build and return final results
    if (!this.listenObj.continuous || this.timer) {
      var finalResults = [];
      //
      for (var i = 0; i < results.length; i++) {
        if (results[i].isFinal)
          finalResults.push(results[i][0].transcript);
      }
      //
      req.setResult(finalResults);
    }
  }.bind(this);
};


/**
 * On iOS devices, ends speech recognition
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.stopListening = function (req)
{
  this.listenObj.stop();
  req.setResult();
};


/**
 * Returns the list of languages supported by the speech recognition system
 * @param {Object} req - request object
 */
Client.Plugins.Speech.prototype.getSupportedLanguages = function (req)
{
  this.speechSynthesis.onvoiceschanged = function () {
    var voicesList = [];
    //
    var voices = this.getVoices();
    //
    for (var i = 0; i < voices.length; i++)
      voicesList.push({
        voiceURI: voices[i].voiceURI,
        name: voices[i].name,
        lang: voices[i].lang,
        localService: voices[i].localService,
        default: voices[i].default});
    //
    req.setResult(voicesList);
  };
};

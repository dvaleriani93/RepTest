/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

Client.Plugins = Client.Plugins || {};

/**
 * @class Media
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Media = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
  this.mediaMap = {};
};


/**
 * Play audio indicated
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.play = function (req)
{
  // get meta class object
  this.getMedia(req)?.play();
};


/**
 * Pauses playback of the audio file indicated
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.pause = function (req)
{
  // get meta class object
  this.getMedia(req)?.pause();
};


/*
 * Stop media playing
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.stop = function (req)
{
  this.getMedia(req)?.stop();
};


/*
 * Release media
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.release = function (req)
{
  // there isn't any method to release blob object in javascript, it's handled by garbage collector
};


/*
 * Sets the current media position
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.seekTo = function (req)
{
  this.getMedia(req)?.seekTo(req.params.milliseconds);
};


/*
 * Sets the current media volume
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.setVolume = function (req)
{
  this.getMedia(req)?.setVolume(req.params.volume);
};


/*
 * Start record / w compression
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.startRecord = function (req)
{
  // get meta class object
  this.getMedia(req)?.startRecord();
};


/*
 * Stop media recording
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.stopRecord = function (req)
{
  this.getMedia(req)?.stopRecord();
};


/*
 * Pauses media recording
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.pauseRecord = function (req)
{
  this.getMedia(req)?.pauseRecord();
};


/*
 * Resume media recording
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.resumeRecord = function (req)
{
  this.getMedia(req)?.resumeRecord();
};


/*
 * Get current media position
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.getCurrentPosition = function (req)
{
  req.setResult(this.getMedia(req)?.getCurrentPosition());
};


/*
 * Get current media position
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.getDuration = function (req)
{
  req.setResult(this.getMedia(req)?.getDuration());
};


/*
 * Get record levels
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.getRecordLevels = function (req)
{
  req.setResult();
};


/*
 * Deletes the specified audio file
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.remove = function (req)
{
  // there isn't any method to remove blob object in javascript, so delete only the media map object
  delete this.mediaMap[req.params.src];
  req.setResult(true);
};


/*
 * Returns the length in bytes of the audio file specified
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.size = function (req)
{
  req.setResult(this.getMedia(req)?.size);
};


/*
 * Get record levels
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.exists = function (req)
{
  req.setResult(!!this.mediaMap[req.params.src]);
};


/*
 *Downloads the audio file from the address specified in the url parameter
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.download = function (req)
{
  req.setResult();
};


/*
 * Prepares the app's file system for saving the audio file
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.initStorage = function (req)
{
  req.setResult(true);
};


/*
 * Returns the complete URL of the audio file specified
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.url = function (req)
{
  req.setResult(this.getMedia(req)?.audioObj.src);
};


/*
 * Sends the audio file to the server specified in the *options* parameter
 * @param {Object} req - request object
 */
Client.Plugins.Media.prototype.upload = function (req)
{
  req.setResult();
};


/*
 * Returns the media object required
 * @param {Object} req - request object
 * @param {Function} cb
 */
Client.Plugins.Media.prototype.getMedia = function (req)
{
  if (!req.params.src)
    return req.setError("No media specified");
  //
  let mediaObj = this.mediaMap[req.params.src];
  if (!mediaObj) {
    // media map object doesn't exist, create it
    mediaObj = new Client.Plugins.Media.MediaObj(req, error => {
      // error callback
      req.result = error;
      this.shellEmulator.sendEvent(req, "Error");
    }, status => {
      // status change callback
      req.result = {src: req.params.src, status};
      this.shellEmulator.sendEvent(req, "StatusChange");
    });
    this.mediaMap[req.params.src] = mediaObj;
  }
  return mediaObj;
};


/**
 * Creates new Audio node object and with necessary event listeners attached
 * @param {Client.Plugins.Media.MediaObj} mediaObj
 * @return {Audio}  Audio element
 */
Client.Plugins.Media.createAudioNode = function (mediaObj)
{
  let node = new Audio();
  //
  node.onloadstart = () => mediaObj.statusCallback(Client.Plugins.Media.status.STARTING);
  node.onplaying = () => mediaObj.statusCallback(Client.Plugins.Media.status.RUNNING);
  node.onpause = () => mediaObj.statusCallback(Client.Plugins.Media.status.PAUSED);
  node.onended = () => mediaObj.statusCallback(Client.Plugins.Media.status.STOPPED);
  node.onerror = (e) => {
    // Due to media.spec.15 It should return error for bad filename
    let err = e.target.error.code === Client.Plugins.Media.errors.NOT_SUPPORTED ?
            {code: Client.Plugins.Media.errors.ABORTED} :
            e.target?.error || "Media not found";
    //
    mediaObj.errorCallback(err);
  };
  //
  return node;
};


/**
 * This class provides access to the device media, interfaces to both sound and video
 *
 * @constructor
 * @param req                   The file name or url to play
 * @param errorCallback         The callback to be called if there is an error.
 *                                  errorCallback(int errorCode) - OPTIONAL
 * @param statusCallback        The callback to be called when media status has changed.
 *                                  statusCallback(int statusCode) - OPTIONAL
 */
Client.Plugins.Media.MediaObj = function (req, errorCallback, statusCallback)
{
  this.src = req.params.src;
  this.errorCallback = errorCallback;
  this.statusCallback = statusCallback;
  //
  this.audioObj = Client.Plugins.Media.createAudioNode(this);
  this.size = 0;
  this._duration = 0;
  this._position = 0;
};


// Media states
Client.Plugins.Media.status = {
  STARTING: 1,
  RUNNING: 2,
  PAUSED: 3,
  STOPPED: 4
};

Client.Plugins.Media.errors = {
  ABORTED: 1,
  NETWORK: 2,
  DECODE: 3,
  NOT_SUPPORTED: 4
};


/**
 * Start or resume playing audio file
 */
Client.Plugins.Media.MediaObj.prototype.play = function ()
{
  if (!this.audioObj.src)
    this.audioObj.src = this.src;
  //
  this.audioObj.play();
};

/**
 * Pause playing audio file
 */
Client.Plugins.Media.MediaObj.prototype.pause = function ()
{
  this.audioObj.pause();
};


/**
 * Stop playing audio file
 */
Client.Plugins.Media.MediaObj.prototype.stop = function ()
{
  this.audioObj.pause();
  this.audioObj.currentTime = 0;
  this.statusCallback(Client.Plugins.Media.status.STOPPED);
};


/**
 * Start recording audio file
 */
Client.Plugins.Media.MediaObj.prototype.startRecord = function ()
{
  if (!navigator.mediaDevices)
    return this.errorCallback("No supported");
  //
  navigator.mediaDevices.getUserMedia({audio: true})
          .then(stream => {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();
            this.mediaRecorder.chunks = [];
            this.mediaRecorder.ondataavailable = e => this.mediaRecorder.chunks.push(e.data);
          })
          .catch(this.errorCallback);
};


/**
 * Stop recording audio file
 */
Client.Plugins.Media.MediaObj.prototype.stopRecord = function ()
{
  this.mediaRecorder.stop();
  this.mediaRecorder.onstop = e => {
    let type = Client.mainFrame.device.browserName === "Safari" ? "audio/mp3" : "audio/ogg; codecs=opus";
    this.blob = new Blob(this.mediaRecorder.chunks, {type: type});
    this.size = this.blob.size;
    this.audioObj.src = URL.createObjectURL(this.blob);
  };
};


/**
 * Pause recording audio file
 */
Client.Plugins.Media.MediaObj.prototype.pauseRecord = function ()
{
  this.mediaRecorder.pause();
};


/**
 * Resume recording audio file
 */
Client.Plugins.Media.MediaObj.prototype.resumeRecord = function ()
{
  this.mediaRecorder.resume();
};


/**
 * Seek or jump to a new time in the track
 * @@param {Number} milliseconds
 */
Client.Plugins.Media.MediaObj.prototype.seekTo = function (milliseconds)
{
  this.audioObj.currentTime = milliseconds / 1000;
};


/**
 * Get duration of an audio file
 * The duration is only set for audio that is playing, paused or stopped
 *
 * @return      duration or -1 if not known.
 */
Client.Plugins.Media.MediaObj.prototype.getDuration = function ()
{
  if (!this.audioObj.src)
    this.audioObj.src = this.src;
  //
  return this.audioObj.duration;
};

/**
 * Get position of audio
 */
Client.Plugins.Media.MediaObj.prototype.getCurrentPosition = function ()
{
  if (!this.audioObj.src)
    this.audioObj.src = this.src;
  //
  return this.audioObj.currentTime;
};


/**
 * Adjust the volume
 * @param {Number} volume
 */
Client.Plugins.Media.MediaObj.prototype.setVolume = function (volume)
{
  this.audioObj.volume = volume;
};

//module.exports = MediaObj;
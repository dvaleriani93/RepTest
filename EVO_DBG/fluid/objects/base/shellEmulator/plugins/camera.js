/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Camera
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Camera = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * List of plugin class names
 */
Client.Plugins.Camera.sourceType = {
  camera: "camera",
  photolibrary: "photolibrary",
  savedphotoalbum: "savedphotoalbum"
};


/**
 * Gets picture
 * @param {Object} req - request object
 */
Client.Plugins.Camera.prototype.getPicture = function (req)
{
  this.params = req.params.options || {};
  //
  // Create HTML video element
  this.video = document.createElement("video");
  this.video.id = "device-camera-video";
  delete this.height;
  delete this.width;
  this.sourceType = this.params.sourceType || Client.Plugins.Camera.sourceType.camera;
  //
  // If the source type is not "camera" have to make the user upload a file instantiate picture pop up
  if (this.params.sourceType === Client.Plugins.Camera.sourceType.photolibrary || this.params.sourceType === Client.Plugins.Camera.sourceType.savedphotoalbum)
    new Client.Plugins.Camera.picturePopup(this, req);
  else {
    // Set picture dimension
    if (this.params.targetWidth)
      this.width = this.params.targetWidth;
    else if (this.params.targetHeight)
      this.height = this.params.targetHeight;
    else
      this.width = 640;
    //
    // Set quality
    this.quality = this.params.quality ? this.params.quality / 100 : 1;
    //
    // Call the webcam
    let opts = {video: true, audio: false};
    if (this.params.cameraDirection)
      opts.video = {facingMode: this.params.cameraDirection === "front" ? "user" : "environment"};
    //
    navigator.mediaDevices.getUserMedia(opts).then(stream => {
      this.video.srcObject = stream;
      //
      // Start camera capture
      this.video.play();
    }).catch(err => {
      // The error callback is not an optional argument, albeit empty
    });
    //
    // When "video" is ready, show camera pop up
    this.video.addEventListener("canplay", ev => {
      new Client.Plugins.Camera.picturePopup(this, req);
    });
  }
};


/**
 * Create BLOB for image
 */
Client.Plugins.Camera.prototype.takeSnapshot = function ()
{
  // get image data
  let data = this.canvas.toDataURL("image/jpeg", this.quality || 1);
  //
  // convert base64 string into bynary blob (in this case image/jpeg)
  let blob = Client.Utils.base64FileDecode(data);
  //
  // Stop webcam
  if (this.video) {
    this.video.srcObject.getVideoTracks().forEach(track => {
      track.stop();
      this.video.srcObject.removeTrack(track);
    });
  }
  //
  return [blob, data];
};


/**
 * Triggers the upload event of the device.camera object
 * @param {Object} snapshot - picture
 * @param {Object} data
 * @param {Object} req - request object
 * @param {Function} cb
 */
Client.Plugins.Camera.prototype.uploadSnapshot = function (snapshot, data, req, cb)
{
  if (Client.isOffline()) {
    let done = function (f, request, callback) {
      f.close(e => {
        if (e)
          return callback(e);
        //
        request.result = f;
        this.shellEmulator.sendEvent(request, "Upload");
        callback();
      });
    }.bind(this);
    //
    // save picture with fs and return fileuri and id
    // here i make the excplicit ssumption that i have access to app since her running offline
    let dir = App.sessionMap['S1'].fs.directory("uploaded");
    //
    // create destination folder
    dir.create(() => {
      let fname = (new Date()).toISOString().substr(0, 19).replace(":", "_").replace(":", "_") + ".jpg";
      let file = App.sessionMap['S1'].fs.file("uploaded/" + fname);
      file.originalName = snapshot.name;
      //
      // create picture file
      file.create(undefined, (e, b) => {
        // write picture content
        file.write(snapshot, undefined, undefined, undefined, e => {
          if (this.params.upload)
            this.postRequest(snapshot, () => done(file, req, cb));
          else
            done(file, req, cb);
        });
      });
    });
  }
  else
    this.postRequest(snapshot, cb);
};


/**
 * Triggers the upload event of the device.camera object
 * @param {Object} files - pictures
 * @param {Function} cb
 */
Client.Plugins.Camera.prototype.postRequest = function (files, cb)
{
  let url = this.params.upload?.url || "";
  let cmd = this.params.upload?.cmd || "";
  //
  // Create query string using upload url and cmd
  if (url)
    url += "?mode=rest" + (cmd ? "&cmd=" + cmd : "");
  else if (Client.isOffline()) // Offline app without an upload url, do nothing
    return cb();
  else
    url = Client.Utils.getRESTQueryString({msgType: "device-camera", id: "picId"});
  //
  if (!(files instanceof Array))
    files = [files];
  //
  // Generate multipart form and send it
  let formData = new FormData();
  files.forEach(f => formData.append("file", f, f.name));
  //
  let r = new XMLHttpRequest();
  r.open("POST", url, true);
  r.onreadystatechange = () => {
    // when post completed with either good or bad results
    if (r.readyState === XMLHttpRequest.DONE)
      cb();
  };
  r.send(formData);
};


/**
 * @class Camera.picturePopUp
 * @param {Client.Plugins.Camera} cameraObj - camera instance
 * @param {Object} req - request object
 * */
Client.Plugins.Camera.picturePopup = function (cameraObj, req)
{
  let camera = cameraObj.sourceType === Client.Plugins.Camera.sourceType.camera;
  this.cameraObj = cameraObj;
  //
  // only if the mode is "camera" must keep certain options
  if (camera) {
    // get options in properties
    this.quality = cameraObj.quality;
    this.cameraObj.canvas = document.createElement("canvas");
    this.context = this.cameraObj.canvas.getContext("2d");
    this.height = cameraObj.height;
    this.width = cameraObj.width;
    this.video = cameraObj.video;
    this.pictureTaken = false;
  }
  //
  // create overlay container
  this.overlay = document.createElement("div");
  this.overlay.id = "getPicture-overlay";
  //
  this.overlay.onclick = ev => {
    if (ev.target === this.overlay) {
      this.closePopup();
    }
  };
  //
  // realize the container
  this.container = document.createElement("div");
  this.container.id = "getPicture-container";
  this.vidCell = document.createElement("div");
  this.vidCell.id = "video-container";
  //
  // if the mode is "camera" must open popup with video preview and buttons
  if (camera) {
    // create buttons cell
    let buttonsCell = document.createElement("div");
    buttonsCell.id = "getPicture-buttons-cell";
    let okBtn = document.createElement("span");
    //
    // set "snap" button label
    okBtn.id = "getPicture-confirm-button";
    okBtn.textContent = cameraObj.params.snapBtnLabel || "Snap";
    //
    // define "onClick" actions
    okBtn.onclick = () => this.takePicture(req);
    //
    let cancelBtn = document.createElement("span");
    cancelBtn.id = "getPicture-cancel-button";
    //
    // set "cancel" button label
    cancelBtn.textContent = cameraObj.params.cancelBtnLabel || "Cancel";
    //
    // define "onClick" actions
    cancelBtn.onclick = () => this.closePopup();
    //
    this.vidCell.style.position = "relative";
    this.flash = document.createElement("div");
    this.flash.id = "getPicture-flash";
    this.vidCell.appendChild(this.flash);
    this.vidCell.appendChild(cameraObj.video);
    buttonsCell.appendChild(cancelBtn);
    buttonsCell.appendChild(okBtn);
    this.container.appendChild(this.vidCell);
    this.container.appendChild(buttonsCell);
  }
  else {
    // for the other modes prepare dropzone container to select image from file system
    this.container.style.padding = "5%";
    let uploadInput = document.createElement("input");
    uploadInput.setAttribute("type", "file");
    uploadInput.style.opacity = "0";
    uploadInput.style.height = "0";
    uploadInput.style.width = "0";
    //
    uploadInput.onchange = () => {
      // No files, do nothing
      if (uploadInput.files.length === 0)
        return;
      //
      // Get the file uploaded
      let file = uploadInput.files[0];
      //
      // Upload the resource
      this.cameraObj.uploadSnapshot(file, null, req, () => this.closePopup());
    };
    //
    let dropzone = document.createElement("div");
    dropzone.id = "getPicture-dropzone";
    //
    // create header
    let h = document.createElement("h6");
    let langIt = (navigator.language || navigator.userLanguage).indexOf("it") >= 0 ? true : false;
    h.innerText = langIt ? "Trascina un'immagine o clicca per selezionare" : "Drop image or click on the box below to select it";
    this.container.appendChild(h);
    //
    // define "onClick" event for dropzone: simulate input click
    dropzone.onclick = () => uploadInput.click();
    //
    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      dropzone.addEventListener(eventName, ev => {
        ev.preventDefault();
        ev.stopPropagation();
      });
    });
    //
    ["dragenter", "dragover"].forEach(eventName => {
      dropzone.addEventListener(eventName, () => dropzone.style.backgroundColor = "aliceblue");
    });
    //
    ["dragleave", "drop"].forEach(eventName => {
      dropzone.addEventListener(eventName, () => dropzone.style.backgroundColor = "");
    });
    //
    dropzone.addEventListener("drop", ev => {
      // assign file to input file
      uploadInput.files = ev.dataTransfer.files;
      uploadInput.onchange();
    });
    //
    // append dropzone to the DOM
    dropzone.appendChild(uploadInput);
    //
    this.container.appendChild(dropzone);
  }
  //
  let dzCancelBtn = document.createElement("span");
  dzCancelBtn.id = "fromLibrary-cancel-button";
  //
  // set "cancel" button label
  dzCancelBtn.textContent = "Cancel";
  //
  // define "onClick" actions
  dzCancelBtn.onclick = () => this.closePopup();
  //
  // append close button
  this.container.appendChild(dzCancelBtn);
  //
  // append DOM element
  this.overlay.appendChild(this.container);
  document.body.appendChild(this.overlay);
};


/**
 * Take a picture
 * @param {Object} req - request object
 */
Client.Plugins.Camera.picturePopup.prototype.takePicture = function (req)
{
  if (this.pictureTaken)
    return;
  //
  this.flash.style.opacity = 1;
  //
  // reduce opacity to simulate take snapshot flash
  setTimeout(() => {
    this.vidCell.style.opacity = this.vidCell.style.opacity === 0 ? 1 : 0;
  }, 50);
  //
  this.pictureTaken = true;
  //
  // set dimensions
  if (this.height)
    this.width = this.video.videoWidth / (this.video.videoHeight / this.height);
  else
    this.height = this.video.videoHeight / (this.video.videoWidth / this.width);
  //
  if (this.width && this.height) {
    this.cameraObj.canvas.width = this.width;
    this.cameraObj.canvas.height = this.height;
    this.context.drawImage(this.video, 0, 0, this.width, this.height);
    //
    this.flash.style.display = "block";
    let data = this.cameraObj.takeSnapshot();
    let snapshot = data[0];
    setTimeout(() => this.flash.style.display = "none", 200);
    //
    setTimeout(() => {
      this.closePopup();
      //
      // trigger onUpload event
      this.cameraObj.uploadSnapshot(snapshot, data, req, err => {
        if (err)
          req.setError(err);
      });
    }, 400);
  }
};


/**
 * Close picture pop up
 */
Client.Plugins.Camera.picturePopup.prototype.closePopup = function ()
{
  // Close the popup
  this.overlay.remove();
  //
  delete this.overlay;
  delete this.container;
  //
  if (this.video) {
    this.video.srcObject.getVideoTracks().forEach(track => {
      track.stop();
      this.video.srcObject.removeTrack(track);
    });
  }
};


/**
 * Save image to gallery
 * @param {Object} req - request object
 */
Client.Plugins.Camera.prototype.saveImageToGallery = function (req)
{
  // in simulator return always true
  req.setResult(true);
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class SocialSharing
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.SocialSharing = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Sharing links map
 */
Client.Plugins.SocialSharing.LinksMap = {
  facebook: "https://www.facebook.com/sharer/sharer.php?u=",
  twitter: "https://twitter.com/intent/tweet?",
  linkedin: "http://www.linkedin.com/shareArticle?mini=true&url="
};


/**
 * Create sharing icon
 * @param {String} cls
 * @param {String} social
 */
Client.Plugins.SocialSharing.prototype.createIcon = function (cls, social) {
  var ris;
  //
  // Creating svg that is gonna contains the icon
  ris = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  ris.setAttribute("class", "socialSharing-svg " + cls);
  ris.style.width = "29px";
  ris.style.height = "29px";
  //
  // Using a path for creating the social icon
  var path = document.createElementNS('http://www.w3.org/2000/svg', "path");
  if (social === "facebook")
    path.setAttribute("d", "M26.4 0H2.6C1.714 0 0 1.715 0 2.6v23.8c0 .884 1.715 2.6 2.6 2.6h12.393V17.988h-3.996v-3.98h3.997v-3.062c0-3.746 2.835-5.97 6.177-5.97 1.6 0 2.444.173 2.845.226v3.792H21.18c-1.817 0-2.156.9-2.156 2.168v2.847h5.045l-.66 3.978h-4.386V29H26.4c.884 0 2.6-1.716 2.6-2.6V2.6c0-.885-1.716-2.6-2.6-2.6z");
  else if (social === "twitter")
    path.setAttribute("d", "M24.253 8.756C24.69 17.08 18.297 24.182 9.97 24.62a15.093 15.093 0 0 1-8.86-2.32c2.702.18 5.375-.648 7.507-2.32a5.417 5.417 0 0 1-4.49-3.64c.802.13 1.62.077 2.4-.154a5.416 5.416 0 0 1-4.412-5.11 5.43 5.43 0 0 0 2.168.387A5.416 5.416 0 0 1 2.89 4.498a15.09 15.09 0 0 0 10.913 5.573 5.185 5.185 0 0 1 3.434-6.48 5.18 5.18 0 0 1 5.546 1.682 9.076 9.076 0 0 0 3.33-1.317 5.038 5.038 0 0 1-2.4 2.942 9.068 9.068 0 0 0 3.02-.85 5.05 5.05 0 0 1-2.48 2.71z");
  else if (social === "linkedin")
    path.setAttribute("d", "M25.424 15.887v8.447h-4.896v-7.882c0-1.98-.71-3.33-2.48-3.33-1.354 0-2.158.91-2.514 1.802-.13.315-.162.753-.162 1.194v8.216h-4.9s.067-13.35 0-14.73h4.9v2.087c-.01.017-.023.033-.033.05h.032v-.05c.65-1.002 1.812-2.435 4.414-2.435 3.222 0 5.638 2.106 5.638 6.632zM5.348 2.5c-1.676 0-2.772 1.093-2.772 2.54 0 1.42 1.066 2.538 2.717 2.546h.032c1.71 0 2.77-1.132 2.77-2.546C8.056 3.593 7.02 2.5 5.344 2.5h.005zm-2.48 21.834h4.896V9.604H2.867v14.73z");
  //
  // Attach the icon to the svg and return it
  ris.appendChild(path);
  return ris;
};


/**
 * Opens the popup for sharing information
 * @param {Object} config
 */
Client.Plugins.SocialSharing.prototype.addSocialItem = function (config) {
  // set URL to share
  var urlToShare = config.options.url ? encodeURI(config.options.url) : null;
  //
  if (!urlToShare && (config.options.files && config.options.files.length))
    urlToShare = encodeURI(config.options.files[0]);
  //
  // encode message
  var message = encodeURI(config.options.message);
  //
  // realize social item
  var socialItem = document.createElement("li");
  socialItem.className = "socialSharing-item";
  //
  // define onclick action for social sharing button
  socialItem.onclick = function (ev) {
    var url = Client.Plugins.SocialSharing.LinksMap[config.name];
    //
    // set different parameters for each social
    switch (config.name) {
      case "twitter":
        if (urlToShare) {
          url += "url=" + urlToShare;
          //
          if (config.options.message)
            url += "&text=" + message;
        }
        else {
          if (config.options.message)
            url += "status=" + message;
        }
        break;

      case "facebook":
        url += urlToShare;
        break;

      case "linkedin":
        url += urlToShare;
        //
        if (config.options.message)
          url += "&summary=" + message;
        break;

      default:
        break;
    }
    //
    // open sharing popup
    window.open(url, "pop", "width=400,height=400");
    //
    // close popup
    this.closePopup(config.req, {completed: true, app: config.name});
  }.bind(this);
  //
  // Realize item label
  var iLabel = document.createElement("span");
  iLabel.style = " text-align: center; margin-top:10px; font-weight: bolder; text-transform: capitalize";
  iLabel.className = "rrssb-text";
  iLabel.innerText = config.name;
  //
  var svg = this.createIcon("socialSharing-svg-" + config.name, config.name);
  //
  // Attach label and icon to the social container and return it
  socialItem.appendChild(svg);
  socialItem.appendChild(iLabel);
  //
  return socialItem;
};


/**
 * Close sharing pop up
 * @param {Object} req - picture
 * @param {Object} response - picture
 */
Client.Plugins.SocialSharing.prototype.closePopup = function (req, response)
{
  // Close the popup
  document.body.removeChild(this.overlay);
  //
  this.overlay = null;
  this.container = null;
  //
  // call callback with response
  req.setResult(response);
};


/**
 * Opens the popup for sharing information
 * @param {Object} req - request object
 */
Client.Plugins.SocialSharing.prototype.shareWithOptions = function (req)
{
  if (Client.mainFrame.device.operatingSystem === "android") {
    try {
      var files = [];
      //
      var doShare = function () {
        navigator.share({
          files: files,
          title: req.params.options.chooserTitle || "",
          text: req.params.options.message || "",
          url: req.params.options.url || ""
        });
      };
      //
      var fetchFile = function (filePath) {
        fetch(filePath).then(function (response) {
          response.blob().then(function (blob) {
            let fileNameAndExt = filePath.match(/\/[\w-\s]+\.[A-Za-z\d]+$/)[0];
            let file = new File([blob], fileNameAndExt, {type: blob.type});
            files.push(file);
            //
            if (files.length === req.params.options.files.length)
              doShare();
          });
        });
      };
      //
      if (!req.params.options.files || req.params.options.files.length === 0)
        return doShare();
      //
      // Foreach file I try to retrieve his blob and create an object used by navigator
      for (var i = 0; i < req.params.options.files.length; i++)
        fetchFile(req.params.options.files[i]);
    }
    catch (error) {
    }
  }
  else {
    // Create overlay container
    this.overlay = document.createElement("div");
    this.overlay.id = "socialSharing-overlay";
    //
    // If the user click outside main container, the sharing popup must be closed
    this.overlay.onclick = function (ev) {
      if (this.overlay && ev.target.id === this.overlay.id) {
        this.closePopup(req, {completed: false, app: ""});
      }
    }.bind(this);
    //
    // Realize the main container
    this.container = document.createElement("div");
    this.container.id = "socialSharing-main-container";
    //
    // Realize popup title
    var header = document.createElement("h4");
    header.innerText = req.params.options.chooserTitle || "Click an icon to share on";
    this.container.appendChild(header);
    //
    // Realize the sharing container
    var socialCtn = document.createElement("div");
    socialCtn.id = "socialSharing-items-container";
    //
    // Add facebook item
    socialCtn.appendChild(this.addSocialItem({name: "facebook", options: req.params.options, req: req}));
    //
    // Add twitter item
    socialCtn.appendChild(this.addSocialItem({name: "twitter", options: req.params.options, req: req}));
    //
    // Add linkedin item
    socialCtn.appendChild(this.addSocialItem({name: "linkedin", param: "summary", options: req.params.options, req: req}));
    //
    this.container.appendChild(socialCtn);
    //
    // realize the buttons container
    var buttonsCtn = document.createElement("div");
    buttonsCtn.id = "socialSharing-btn-container";
    //
    var cancelBtn = document.createElement("span");
    cancelBtn.id = "socialSharing-btn-cancel";
    cancelBtn.innerText = "Cancel";
    //
    // Define onclick action for cancel button: close popup window
    cancelBtn.onclick = function (ev) {
      this.closePopup(req, {completed: false, app: ""});
    }.bind(this);
    //
    buttonsCtn.appendChild(cancelBtn);
    //
    this.container.appendChild(buttonsCtn);
    //
    this.overlay.appendChild(this.container);
    document.body.appendChild(this.overlay);
  }
};


/**
 * Checks whether an app is installed on the terminal
 * @param {Object} req - request object
 */
Client.Plugins.SocialSharing.prototype.checkAvailability = function (req)
{
  req.setResult(true);
};

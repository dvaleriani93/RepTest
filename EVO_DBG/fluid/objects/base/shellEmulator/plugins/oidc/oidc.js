/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Oidc
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Oidc = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Init plugin
 * @param {Object} req - request object
 */
Client.Plugins.Oidc.prototype.init = function (req)
{
  req.setResult();
};


/**
 * Authorize
 * @param {Object} req - request object
 */
Client.Plugins.Oidc.prototype.authorize = function (req)
{
  this.createBackdrop();
  //
  let options = req.params.options;
  //
  // Create authorize url
  let authorizeUrl = `${options.authorizationEndpoint}`;
  authorizeUrl += `?client_id=${options.clientId}`;
  authorizeUrl += `&redirect_uri=${options.redirectUrl}`;
  authorizeUrl += `&response_type=${options.responseType}`;
  authorizeUrl += `&scope=${options.scope}`;
  authorizeUrl += `&state=${options.state}`;
  authorizeUrl += `&prompt=${options.prompt}`;
  //
  let windowParams = options.windowParams;
  if (!windowParams) {
    // Define popup dimension and position
    let width = 600;
    let height = 500;
    let left = (window.innerWidth - width) / 2;
    let top = (window.innerHeight - height) / 2;
    //
    windowParams = `width=${width},height=${height},left=${left},top=${top},scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no`;
  }
  //
  // Open popup with authorize url
  this.popup = window.open(authorizeUrl, "Login", windowParams);
  //
  // Check if popup has been blocked by browser
  if (!this.popup || this.popup.closed || typeof this.popup.closed === "undefined")
    return req.setError("Popup blocked. Allow popups for this site to continue the authentication process");
  //
  this.isPopupClosed();
  //
  this.pendingAuthorizeReq = req;
};


/**
 * Authorize callback
 * @param {Object} req - request object
 */
Client.Plugins.Oidc.prototype.authorizeCallback = function (req)
{
  this.pendingAuthorizeReq.setResult(req.params);
};



/**
 * Create backdrop when popup is opened
 */
Client.Plugins.Oidc.prototype.createBackdrop = function ()
{
  this.backdrop = document.getElementById("oidc-backdrop");
  //
  if (this.backdrop)
    return;
  //
  this.backdrop = document.createElement("div");
  this.backdrop.id = "oidc-backdrop";
  this.backdrop.className = "oidc-backdrop";
  this.backdrop.onclick = () => this.popup.focus();
  //
  document.body.appendChild(this.backdrop);
};


/**
 * Check if popup is still opened
 */
Client.Plugins.Oidc.prototype.isPopupClosed = function ()
{
  this.isPopupClosedTimeout = setTimeout(() => {
    clearTimeout(this.isPopupClosedTimeout);
    //
    // If popup is closed remove backdrop
    if (this.popup.closed)
      this.backdrop.remove();
    else
      this.isPopupClosed();
  }, 50);
};
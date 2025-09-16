/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */


Client.Plugins = Client.Plugins || {};


/**
 * @class Keyboard
 * @param {app.shellEmulator} shellEmulator - shellEmulator object
 * */
Client.Plugins.Keyboard = function (shellEmulator)
{
  this.shellEmulator = shellEmulator;
};


/**
 * Hides device keyboard
 * @param {Object} req - request object
 */
Client.Plugins.Keyboard.prototype.hide = function (req)
{
  // Create a fake element in order to focus it and then blur it on focus. This cause the keybord closing
  let el = document.createElement("textarea");
  el.style.position = "absolute";
  el.style.padding = 0;
  el.style.background = "transparent";
  el.style.outline = "none";
  el.style.left = "-100%";
  //
  el.onfocus = function () {
    setTimeout(function () {
      el.blur();
      document.body.removeChild(el);
    }, 100);
  };
  //
  document.body.appendChild(el);
  el.focus();
};


/**
 * Shows or hide the view assistant that appears above keyboard
 * @param {Object} req - request object
 */
Client.Plugins.Keyboard.prototype.hideViewAccessoryBar = function (req)
{
  if (document.activeElement) {
    let field = document.activeElement;
    //
    field.setAttribute("autocomplete", "off");
    field.setAttribute("autocorrect", "off");
    field.setAttribute("autocapitalize", "off");
    field.setAttribute("spellcheck", "false");
  }
};


/**
 * Copies the text passed as paramater to the system clipboard
 * @param {Object} req - request object
 */
Client.Plugins.Keyboard.prototype.copy = function (req)
{
  //
  if (navigator.clipboard && navigator.clipboard.writeText)
    navigator.clipboard.writeText(req.params.text).then(function () {
    }).catch(function (ex) {});
  else {
    // Remember the last focused element
    var lastFocused = document.activeElement;
    //
    // Create fake textarea for copying text
    var el = document.createElement("textarea");
    el.setAttribute("readonly", true);
    //
    // Make textarea not visible on screen
    el.style.position = "absolute";
    el.style.padding = 0;
    el.style.background = "transparent";
    el.style.outline = "none";
    el.style.left = "-100%";
    //
    el.value = req.params.text;
    //
    document.body.appendChild(el);
    //
    // I'll manually focus on created textarea, so the navigator will copy text on clipboard
    el.onfocus = function () {
      el.select();
      document.execCommand("copy");
      //
      // Restore the document and the focus
      document.body.removeChild(el);
      if (lastFocused)
        lastFocused.focus();
    };
    //
    el.focus();
  }
};


/**
 * Return the content of the system clipboard
 * @param {Object} req - request object
 */
Client.Plugins.Keyboard.prototype.paste = function (req)
{
  if (navigator.clipboard && navigator.clipboard.readText)
    navigator.clipboard.readText().then(function (textInClipboard) {
      req.setResult(textInClipboard);
    }).catch(function (error) {
      req.setError(error.message);
    });
  else
    req.setError("Cannot paste");
};


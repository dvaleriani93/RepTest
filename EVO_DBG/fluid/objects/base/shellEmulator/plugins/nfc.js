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
Client.Plugins.Nfc = function (shellEmulator)
{
  this.ndefReaderAvailable = (typeof NDEFReader !== "undefined");
  this.shellEmulator = shellEmulator;
};


/**
 * Enables reading of NFC tags
 * @param {Object} req - request object
 */
Client.Plugins.Nfc.prototype.listen = function (req)
{
  if (this.ndefReaderAvailable) {
    var pthis = this;
    this.ndef = new NDEFReader();
    //
    // Ask for permission and start detecting
    this.ndef.scan().then(function () {
      pthis.ndef.onreading = function (tag) {
        // Preparing tag result as expected from the plugin
        tag.ndefMessage = tag.message;
        tag.id = tag.serialNumber.replaceAll(":", "");
        if (tag.message.records && tag.message.records.length > 0) {
          tag.textMessage = [];
          //
          for (var i = 0; i < tag.message.records.length; i++)
            tag.textMessage.push(String.fromCharCode.apply(null, new Uint8Array(tag.message.records[i].data.buffer)));
        }
        req.result = tag;
        //
        pthis.shellEmulator.sendEvent(req, "Tag");
      };
    }).catch(function (err) {
      req.result = {error: err.message};
      pthis.shellEmulator.sendEvent(req, "Tag");
    });
  }
};


/**
 * Disables reading of NFC tags
 * @param {Object} req - request object
 */
Client.Plugins.Nfc.prototype.unListen = function (req)
{
  if (this.ndef)
    this.ndef.onreading = undefined;
};


/**
 * Return true if NFC is avaible
 * @param {Object} req - request object
 */
Client.Plugins.Nfc.prototype.isAvailable = function (req)
{
  req.setResult(this.ndefReaderAvailable);
};



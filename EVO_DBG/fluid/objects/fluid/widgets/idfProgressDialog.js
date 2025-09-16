/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A progressBar object
 */
Client.IdfProgressDialog = function () {
  this.type = Client.IdfProgressDialog.progressType.LOADING;
  this.id = "PROGRESS" + Math.floor(Math.random() * 100);
  //
  this.progressTotal = -1;
  this.progressPresent = -1;
  this.canAbort = false;
  this.progressMessage = "";
  //
  this.open = false;
};

Client.IdfProgressDialog.progressType = {
  LOADING: 0,
  PROGRESSBAR: 1
};

Client.IdfProgressDialog.progressCheckTime = 2000;

Client.IdfProgressDialog.prototype.show = function (message)
{
  this.progressMessage = message || "";
  this.open = true;
  //
  // Create the loading spinner
  Client.IonHelper.setLoading({
    id: this.id,
    style: "progress-bar-body",
    type: "loading",
    message: this.progressMessage,
    showSpinner: true
  }, () => {
  });
  //
  // We need a timer to check the progressbar file on the server
  this.progressTimer = setTimeout(() => {
    this.refreshProgressBar();
  }, Client.IdfProgressDialog.progressCheckTime);
};


Client.IdfProgressDialog.prototype.close = function ()
{
  if (!this.open)
    return;
  //
  this.open = false;
  //
  // Close the loading spinner
  Client.IonHelper.setLoading({
    id: this.id,
    dismiss: true
  }, function () {});
  //
  if (this.progressTimer)
    clearTimeout(this.progressTimer);
  delete this.progressTimer;
};


Client.IdfProgressDialog.prototype.refreshProgressBar = function ()
{
  delete this.progressTimer;
  //
  if (Client.idfOffline)
    return this.processRequestChange();
  //
  this.xmlReq = new XMLHttpRequest();
  //
  this.xmlReq.onreadystatechange = this.processRequestChange.bind(this);
  //
  // Invio la richiesta
  if (this.xmlReq.overrideMimeType)
    this.xmlReq.overrideMimeType('text/xml');
  this.xmlReq.open("GET", `temp/${Client.mainFrame.wep.progressFile}?NOCACHE=${Math.random()}`, true);
  this.xmlReq.send("");
};


Client.IdfProgressDialog.prototype.processRequestChange = function ()
{
  let proceed = false;
  if (Client.idfOffline) {
    proceed = true;
    if (Client.offlineWorker.progress) {
      this.progressPresent = Client.offlineWorker.progress.present;
      this.progressTotal = Client.offlineWorker.progress.total;
      this.canAbort = Client.offlineWorker.progress.canAbort;
      this.progressMessage = Client.offlineWorker.progress.message;
    }
  }
  else if (this.xmlReq.readyState === 4 && this.xmlReq.status === 200) {
    try {
      // Parse the status that the server sent into the XML
      let xmlDoc = this.xmlReq.responseXML;
      let xmlNode = xmlDoc.childNodes[xmlDoc.childNodes.length - 1];
      //
      for (let i = 0; i < xmlNode.childNodes.length; i++) {
        let k = xmlNode.childNodes[i];
        switch (k.nodeName) {
          case "PRESENT":
            this.progressPresent = parseInt(k.firstChild.nodeValue);
            break;
          case "TOTAL":
            this.progressTotal = parseInt(k.firstChild.nodeValue);
            break;
          case "CANABORT":
            this.canAbort = k.firstChild.nodeValue === "-1";
            break;
          case "MESSAGE":
            this.progressMessage = (!k.firstChild ? "" : k.firstChild.nodeValue);
            break;
        }
      }
      //
      proceed = true;
    }
    catch (ex) {
    }
  }
  //
  if (proceed) {
    this.type = Client.IdfProgressDialog.progressType.PROGRESSBAR;
    //
    Client.IonHelper.setLoading({
      id: this.id,
      style: "progress-bar-body",
      type: "loading",
      message: this.createProgressMessage(),
      showSpinner: false,
      buttons: this.canAbort ? [{id: "1", text: Client.IdfResources.t("MSG_POPUP_CancelButton"), cancel: true}] : undefined
    }, button => {
      if (button === 1 && this.canAbort)
        this.abortProgress();
    });
    //
    this.progressTimer = setTimeout(() => {
      this.refreshProgressBar();
    }, Client.IdfProgressDialog.progressCheckTime);
  }
};


Client.IdfProgressDialog.prototype.createProgressMessage = function ()
{
  let htmlMessage = `<div class="row-progress"><span>${this.progressMessage}</span></div>`;
  //
  let progress = (this.progressPresent / this.progressTotal) * 100;
  if (progress > 100)
    progress = progress % 100;
  htmlMessage += `<div class="row-progress"><span class='outer'><span class='inner' style='width:${progress}%'></span></span></span></span></div>`;
  //
  return htmlMessage;
};


Client.IdfProgressDialog.prototype.abortProgress = function ()
{
  if (confirm(Client.IdfResources.t("DLG_DELAY_Abort"))) {
    if (Client.idfOffline) {
      try {
        if (Client.Shell.useShellForSS)
          Client.Shell.sendSSCmd("", "SetProgress", {aborted: true});
        else {
          let SSDBName = "SSManager";
          let db = openDatabase(SSDBName, "", SSDBName, 5 * 1024 * 1024);
          let SQL = "UPDATE Sessions SET Aborted = -1 WHERE SessionName = ''";
          try {
            db.transaction(function (tr) {
              tr.executeSql(SQL);
            });
          }
          finally {
            if (db && db.close)
              db.close();
          }
        }
      }
      catch (e) {
        Client.writeToConsole("Error while aborting progress of main session", "error");
      }
    }
    else {
      let prfile = Client.mainFrame.wep.progressFile;
      let server = Client.mainFrame.wep.entryPoint;
      if (server.indexOf(".aspx") > 0)
        server = "D_" + server;
      //
      let rq = new XMLHttpRequest();
      rq.open("GET", `${server}?FN=${prfile.substring(0, prfile.length - 4)}&NOCACHE=${Math.floor(Math.random() * 1000000)}`, true);
      rq.send("");
    }
    //
    // Disable the Cancel button, is already pressed
    let lo = document.getElementById(this.id);
    if (lo)
      lo.getElementsByClassName("alert-button-group")[0].firstChild.disabled = "true";
    //
    // Stop update of the progressbar
    if (this.progressTimer) {
      clearTimeout(this.progressTimer);
      delete this.progressTimer;
    }
  }
};

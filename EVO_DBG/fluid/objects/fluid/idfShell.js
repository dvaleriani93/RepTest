/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


Client.Shell = function ()
{
};

/**
 * Send a message to the shell
 * @param {String} cmd
 * @param {String/Object} params
 */
Client.Shell.sendCmd = function (cmd, params)
{
  let url = window._ShellURL + "?_CMD=" + cmd;
  if (params) {
    if (typeof params === "string")
      url += "&" + params;
    else {
      // Passo i parametri in BASE64
      let keys = Object.keys(params);
      for (let i = 0; i < keys.length; i++)
      {
        let key = keys[i];
        let val = params[key];
        url += "&" + key + "=" + btoa(unescape(encodeURIComponent(val)));
      }
    }
  }
  //
  // For iOS with WKWebView I have to use a synchronous channel
  // (I can't use an HTTP call because it would go to the server)
  // (I can't use a url-scheme because I would have CORS problems)
  if (window._ShellURLType === "PROMPT")
    return prompt(url);
  //
  let xhReq = new XMLHttpRequest();
  xhReq.open("GET", url, false);
  xhReq.send(null);
  //
  return xhReq.responseText;
};

/**
 * Sends a message to the shell about the server sessions
 * @param {String} sessionName
 * @param {String} cmd
 * @param {Object} data
 */
Client.Shell.sendSSCmd = function (sessionName, cmd, data)
{
  data = data || {};
  try {
    let result;
    if (Client.Shell.isInsideShell) {
      data.ssname = sessionName;
      data.cmd = cmd;
      result = Client.Shell.sendCmd("SSCMD", data);
    }
    else {
      let xhReq = new XMLHttpRequest();
      let url = location.protocol + "//" + location.hostname;
      if (location.port.length > 0)
        url += ":" + location.port;
      url += location.pathname;
      //
      xhReq.open("POST", url + "?WCI=SSCMD", false);
      xhReq.setRequestHeader("content-type", "application/json");
      xhReq.send(JSON.stringify({ssname: sessionName, cmd: cmd, data: data}));
      result = xhReq.responseText;
    }
    //
    return result ? JSON.parse(result) : null;
  }
  catch (ex) {
    console.error("Error while sending remote command (SessionName=" + sessionName + ", CMD=" + cmd + "): " + ex);
    throw ex;
  }
};

/**
 * Returns TRUE if for the exchange of messages between SS
 * the shell is used, otherwise the database is used
 */
Object.defineProperty(Client.Shell, "useShellForSS", {
  get: function () {
    // Outside the Shell I use C#/Java (with DBs it has problems)
    if (!Client.Shell.isInsideShell)
      return true;
    //
    // On Android with simulated workers it is not possible because they are separate processes
    if (Client.Shell.isAndroid())
      return !Client.Shell.useSimulatedWorkers;
    //
    // On iOS I use the shell only if Caravel is up to date
    if (navigator.userAgent.indexOf("CaravelShell") !== -1)
      return (navigator.userAgent.indexOf("AppleWebKit/533.17.9") === -1);
    //
    return true;
  }
});

/**
 * Sends the status of the services in the shell to the server
 */
Client.Shell.sendInfo = function ()
{
  if (!Client.Shell.isInsideShell)
    return "&ISSHELL=0";
  //
  return "&ISSHELL=1&VERSION=" + this.version + "&HASCAMERA=" + (this.hasCamera ? "1" : "0") + "&DEVICEID=" + this.deviceID +
          "&DEVICENAME=" + this.deviceName + "&SYNCHSRV=" + this.synchServer + "&DNID=" + this.deviceNotificationID;
};

/**
 * Returns TRUE if the application is running inside a shell on the device
 */
Object.defineProperty(Client.Shell, "isInsideShell", {
  get: function () {
    return !!window._ShellURL;
  }
});

/**
 * Returns 0 if the application is run from package
 * -1 if it is performed inside Caravel
 * NULL if it is executed outside the shell or it is not known if inside Caravel
 */
Object.defineProperty(Client.Shell, "isInsideCaravel", {
  get: function () {
    if (this.iIsInsideCaravel === undefined) {
      if (this.isInsideShell) {
        switch (parseInt(this.sendCmd("ISINSIDECARAVEL"))) {
          case 0:
            this.iIsInsideCaravel = 0;
            break;
          case 1:
            this.iIsInsideCaravel = -1;
            break;
          default:
            this.iIsInsideCaravel = null;
            break;
        }
      }
      else
        this.iIsInsideCaravel = null;
    }
    return this.iIsInsideCaravel;
  }
});

/**
 * Returns the native shell version
 */
Object.defineProperty(Client.Shell, "version", {
  get: function () {
    if (this.iVersion === undefined)
      this.iVersion = (this.isInsideShell ? this.sendCmd("GETVER") : "");
    return this.iVersion;
  }
});

/**
 * Returns TRUE if the device has a camera
 */
Object.defineProperty(Client.Shell, "hasCamera", {
  get: function () {
    if (this.iHasCamera === undefined)
      this.iHasCamera = (this.isInsideShell && this.sendCmd("HASCAMERA") === "OK");
    return this.iHasCamera;
  }
});

/**
 * Returns a GUID that uniquely identifies the Shell installation on the device
 */
Object.defineProperty(Client.Shell, "deviceID", {
  get: function () {
    if (this.iDeviceID === undefined)
      this.iDeviceID = (this.isInsideShell ? this.sendCmd("GETSETTING", {KEY: "DEVICEID"}) : "");
    return this.iDeviceID;
  }
});

/**
 * Returns the name of the device
 */
Object.defineProperty(Client.Shell, "deviceName", {
  get: function () {
    if (this.iDeviceName === undefined)
      this.iDeviceName = (this.isInsideShell ? this.sendCmd("GETSETTING", {KEY: "DEVICENAME"}) : "");
    return this.iDeviceName;
  }
});

/**
 * Returns the IP address used by the device
 */
Object.defineProperty(Client.Shell, "deviceIP", {
  get: function () {
    return (this.isInsideShell ? this.sendCmd("GETSETTING", {KEY: "DEVICEIP"}) : "");
  }
});

/**
 * Returns the URL of the synchronization server known to the shell
 */
Object.defineProperty(Client.Shell, "synchServer", {
  get: function () {
    return (this.isInsideShell ? this.sendCmd("GETSETTING", {KEY: "SYNCSRV"}) : "");
  }
});

/**
 * Returns the identifier for notifications
 */
Object.defineProperty(Client.Shell, "deviceNotificationID", {
  get: function () {
    return (this.isInsideShell ? this.sendCmd("GETDNID") : "");
  }
});

Client.Shell.startListen = function (lang, dettype, rectype)
{
  if (this.isInsideShell)
    return this.sendCmd("STARTLISTEN", {LANG: lang, DETTYPE: dettype, RECTYPE: rectype});
};
Client.Shell.stopListen = function ()
{
  if (this.isInsideShell)
    return this.sendCmd("STOPLISTEN");
};
Client.Shell.say = function (text, lang, rate)
{
  if (this.isInsideShell)
    return this.sendCmd("SAY", {TEXT: text, LANG: lang, RATE: rate});
};

function IDEvent(id, oid, event, def, name, par1, par2, par3, par4, delay, delayType, par5, par6)
{
  Client.mainFrame.sendEvents([{id, def, content: {oid, name, par1, par2, par3, par4, par5, par6}}]);
}
window.RD3_Glb = {EVENT_ACTIVE: Client.IdfMessagesPump.eventTypes.ACTIVE};
window.RD3_ShellObject = {SendCmd: Client.Shell.sendCmd};

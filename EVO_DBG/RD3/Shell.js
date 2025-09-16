// ***************************************************************
// Implementazione Shell in Javascript
// (interfaccia verso la Shell di dispositivi mobile)
// ***************************************************************
function Shell()
{
}

// ********************************************************
// Invia un messaggio alla shell
// ********************************************************
Shell.prototype.SendCmd = Shell.SendCmd = function(cmd, params)
{
  var url = self._ShellURL + "?_CMD=" + cmd;
  if (params)
  {
    if (typeof(params) == "string") // Vedi Desktop::HandleShell
      url += "&" + params;
    else
    {
      // Passo i parametri in BASE64
      var keys = Object.keys(params);
      for (var i = 0; i < keys.length; i++)
      {
        var key = keys[i];
        var val = params[key];
        url += "&" + key + "=" + btoa(unescape(encodeURIComponent(val)));
      }
    }
  }
  //
  // Per iOS con WKWebView devo usare un canale sincrono
  // (non posso usare una chiamata HTTP perche' andrebbe al server)
  // (non posso usare un url-schema perche' avrei problemi di CORS)
  if (self._ShellURLType == "PROMPT")
    return prompt(url);
  //
  var xhReq = new XMLHttpRequest();
  xhReq.open("GET", url, false);
  xhReq.send(null);
  //
  return xhReq.responseText;
}

//*************************************
// Invia un messaggio alla shell relativo alle ServerSession
//*************************************
Shell.SendSSCmd = function (SessionName, Cmd, Data)
{
  Data = Data || {};
  try
  {
    var result;
    if (Shell.IsInsideShell())
    {
      Data.ssname = SessionName;
      Data.cmd = Cmd;
      result = Shell.SendCmd("SSCMD", Data);
    }
    else
    {
      var xhReq = new XMLHttpRequest();
      var url = self.location.protocol + "//" + self.location.hostname;
      if (self.location.port.length > 0)
        url += ":" + self.location.port;
      url += self.location.pathname;
      //
      xhReq.open("POST", url + "?WCI=SSCMD", false);
      xhReq.setRequestHeader("content-type", "application/json");
      xhReq.send(JSON.stringify({ ssname: SessionName, cmd: Cmd, data: Data }));
      result = xhReq.responseText;
    }
    //
    return result ? JSON.parse(result) : null;
  }
  catch (ex)
  {
    WriteToConsoleError("Error while sending remote command (SessionName=" + SessionName + ", CMD=" + Cmd + "): " + ex);
    throw ex;
  }
}

//***********************************************************************
// Ritorna TRUE se per lo scambio di messaggi tra SS
// viene usata la shell, altrimenti viene usato il database
//***********************************************************************
Shell.UseShellForSS = function ()
{
  // Fuori Shell uso C#/Java (con i DB ha problemi)
  if (!Shell.IsInsideShell())
    return true;
  //
  // Su Android con i worker simulati non si puo' perche' sono processi separati
  if (Shell.isAndroid())
    return !Shell.UseSimulatedWorkers();
  else
  {
    // Su iOS uso la shell solo se Caravel e' aggiornato
    if (navigator.userAgent.indexOf("CaravelShell") != -1)
      return (navigator.userAgent.indexOf("AppleWebKit/533.17.9") == -1);
    else
      return true;
  }
}

//***********************************************************************
// Ritorna TRUE se la shell ha i worker simulati
//***********************************************************************
Shell.UseSimulatedWorkers = function ()
{
  if (Shell.iUseSimulatedWorkers == undefined)
  {
    if (Shell.IsInsideShell())
    {
      try
      {
        Shell.iUseSimulatedWorkers = (Shell.SendCmd("USESIMULATEDWORKERS") == "1");
      }
      catch (ex)
      {
        Shell.iUseSimulatedWorkers = true;
      }
    }
  }
  return Shell.iUseSimulatedWorkers;
}

//***********************************************************************
// Ritorna TRUE se la shell e' iOS
//***********************************************************************
Shell.isIos = function ()
{
  return (navigator.userAgent.indexOf("AppleWebKit") != -1);
}

//***********************************************************************
// Ritorna TRUE se la shell e' Android
//***********************************************************************
Shell.isAndroid = function ()
{
  return (navigator.userAgent.indexOf("Android") != -1);
}

// ***********************************************************************
// Invia al server lo stato dei servizi presenti nella shell
// ***********************************************************************
Shell.prototype.SendInfo = function()
{
  if (this.IsInsideShell())
  {
    return "&ISSHELL=1&VERSION=" + this.Version() + "&HASCAMERA=" + (this.HasCamera() ? "1" : "0") + "&DEVICEID=" + this.DeviceID() + 
           "&DEVICENAME=" + this.DeviceName() + "&SYNCHSRV=" + this.SynchServer() + "&DNID=" + this.DeviceNotificationID();
  }
  else
    return "&ISSHELL=0";
}

// ***********************************************************************
// Torna TRUE se l'applicazione e' in esecuzione all'interno di una shell sul dispositivo
// ***********************************************************************
Shell.prototype.IsInsideShell = Shell.IsInsideShell = function()
{
  return (self._ShellURL != undefined);
}

//***********************************************************************
//Torna 0 se l'applicazione e' eseguita da pacchetto
//   -1 se e' eseguita dentro Caravel
// NULL se e' eseguita fuori shell o non si sa se dentro Caravel
//***********************************************************************
Shell.prototype.IsInsideCaravel = function()
{
  if (this.iIsInsideCaravel === undefined)
  {
    if (this.IsInsideShell())
    {
      switch (parseInt(this.SendCmd("ISINSIDECARAVEL")))
      {
        case 0:  this.iIsInsideCaravel = 0; break;
        case 1:  this.iIsInsideCaravel = -1;  break;
        default: this.iIsInsideCaravel = null; break;
      }
    }
    else
      this.iIsInsideCaravel = null;
  }
  return this.iIsInsideCaravel;
}

// ***********************************************************************
// Torna la versione della shell nativa
// ***********************************************************************
Shell.prototype.Version = function()
{
  if (this.iVersion == undefined) 
    this.iVersion = (this.IsInsideShell() ? this.SendCmd("GETVER") : "");
  return this.iVersion;
}

// ***********************************************************************
// Torna TRUE se il dispositivo possiede una fotocamera
// ***********************************************************************
Shell.prototype.HasCamera = function()
{
  if (this.iHasCamera == undefined) 
    this.iHasCamera = (this.IsInsideShell() && this.SendCmd("HASCAMERA") == "OK");
  return this.iHasCamera;
}

// ***********************************************************************
// Restituisce un GUID che identifica univocamente l'installazione della Shell sul dispositivo
// ***********************************************************************
Shell.prototype.DeviceID = function()
{
  if (this.iDeviceID == undefined)
    this.iDeviceID = (this.IsInsideShell() ? this.SendCmd("GETSETTING", {KEY:"DEVICEID"}) : "");
  return this.iDeviceID;
}

// ***********************************************************************
// Restituisce il nome del dispositivo
// ***********************************************************************
Shell.prototype.DeviceName = function()
{
  if (this.iDeviceName == undefined)
    this.iDeviceName = (this.IsInsideShell() ? this.SendCmd("GETSETTING", {KEY:"DEVICENAME"}) : "");;
  return this.iDeviceName;
}

// ***********************************************************************
// Restituisce l'indirizzo IP utilizzato dal dispositivo
// ***********************************************************************
Shell.prototype.DeviceIP = function()
{
  return (this.IsInsideShell() ? this.SendCmd("GETSETTING", {KEY:"DEVICEIP"}) : "");
}

// ***********************************************************************
// Restituisce l'URL del server di sincronizzazione conosciuto dalla Shell
// ***********************************************************************
Shell.prototype.SynchServer = function()
{
  return (this.IsInsideShell() ? this.SendCmd("GETSETTING", {KEY:"SYNCSRV"}) : "");
}

// ***********************************************************************
// Restituisce l'identificativo per le notifiche
// ***********************************************************************
Shell.prototype.DeviceNotificationID = function()
{
  return (this.IsInsideShell() ? this.SendCmd("GETDNID") : "");
}

// ***********************************************************************
// IDVoice
// ***********************************************************************
Shell.prototype.StartListen = function(lang, dettype, rectype)
{
  if (this.IsInsideShell())
    return this.SendCmd("STARTLISTEN", { LANG:lang, DETTYPE:dettype, RECTYPE:rectype });
}
Shell.prototype.StopListen = function()
{
  if (this.IsInsideShell())
    return this.SendCmd("STOPLISTEN");
}
Shell.prototype.Say = function(text, lang, rate)
{
  if (this.IsInsideShell())
    return this.SendCmd("SAY", {TEXT:text, LANG:lang, RATE:rate});
}

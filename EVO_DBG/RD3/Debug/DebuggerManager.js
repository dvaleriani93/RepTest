// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Debugger RD3 locale
// ************************************************

function DebuggerManager()
{
  this.DebuggerItems = new Array(); // L'elenco degli item da aggiungere
  this.Started = false;               // Indica se il debugger raccoglie gli eventi o meno
  this.Msg = null;                    // La variabile che contiene il testo dei messaggi
  this.ProcCollection = new Array();  // L'elenco delle procedure entrate
  this.DateCollection = new Array();  // L'array degli istanti di ingresso nelle proc
}


// ************************************************
// Aggiunge un messaggio al sistema di debug locale
// ************************************************
DebuggerManager.prototype.AddMessage = function(msg, type, seq)
{
  if (!this.Started)
    return;
  //
  var it = new DebuggerItem(msg, type);
  if (seq)
    it.Sequence = seq;
  //
  this.DebuggerItems.push(it);
}


// ************************************************
// Aggiunge un messaggio al sistema di debug locale
// ************************************************
DebuggerManager.prototype.EnterProc = function(name)
{
  if (!this.Started)
    return;
  //
  this.AddMessage("[Proc " + name + "]: Enter", 0, true);
  //
  this.ProcCollection.push(name);
  this.DateCollection.push(new Date());
}


// ************************************************
// Aggiunge un messaggio al sistema di debug locale
// ************************************************
DebuggerManager.prototype.ExitProc = function()
{
  if (!this.Started)
    return;
  //
  var proc = this.ProcCollection.pop();
  var started = this.DateCollection.pop();
  //
  if (proc && started)
  {
    var t = new Date() - started;
    //
    this.AddMessage("[Proc " + proc + "]: Exited, Duration: " + t + " ms", 0, true);
  }
}


// ************************************************
// Aggiunge un messaggio al sistema di debug locale
// ************************************************
DebuggerManager.prototype.Log = function(message)
{
  if (!this.Started)
    return;
  //
  /*
  var s = this.Msg;
  s+=message+"<br>";
  this.Msg = s;
  */
  this.AddMessage(message, 0, false);
}


// ************************************************
// Avvia il sistema di debug
// ************************************************
DebuggerManager.prototype.Start = function()
{
  this.Started = true;
}


// ************************************************
// Ferma il sistema di debug
// ************************************************
DebuggerManager.prototype.Stop = function()
{
  this.Started = false;
}


DebuggerManager.prototype.Show = function()
{
  if (this.Started)
  {
    var txt = "<div style='overflow:auto; height:300px; width:400px;'>";
    //
    var n = this.DebuggerItems.length;
    var precdate = null;
    for (var i = 0; i<n; i++)
    {
      var msgi = this.DebuggerItems[i];
      //
      if (msgi.Sequence && precdate)
        txt += msgi.PrintSequence(precdate);
      else
        txt += msgi.Print();
      //
      precdate = msgi.DateTime;
    }
    //
    txt += "</div>";
    //
  var m = new MessageBox(txt, RD3_Glb.MSG_BOX, false);
  m.Open();
  }
}


DebuggerManager.prototype.CopyToClipboard = function(s)
{
  
}

// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Rappresenta un item del debugger locale
// ************************************************

function DebuggerItem(msg, type)
{
  this.Message = msg;         // Testo del messaggio
  this.DateTime = new Date(); // Data e ora di creazione
  this.Type = type;           // Tipo di messaggio
  this.Sequence = false       // Ti interessa sapere il tempo passato tra il messaggio precedente nella lista e questo?
}

DebuggerItem.prototype.Print = function()
{
  return "<br>("+ this.DateTime.getTime()  +"): "+this.Message;
}

DebuggerItem.prototype.PrintSequence = function (precdate)
{
  if (precdate)
  {
    if (this.DateTime > precdate)
      return "<br>(->"+ (this.DateTime - precdate)  + " ms): "+this.Message;
    else
      return "<br>(->"+ (precdate - this.DateTime)  +" ms): "+this.Message;
  }
  else
    return this.Print();
}
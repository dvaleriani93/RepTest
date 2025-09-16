// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe base per la definizione di eventi locali
// ************************************************

function IDEvent(vtipo, ident, evento, evt, name, par1, par2, par3, par4, delay, delaytype, par5, par6, delaycopies)
{
  this.Tipo = vtipo; // Tipo di evento: click su oggetto, cambiamento proprieta'...
  //
  this.ObjId   = ident;        // Idenficatore dell'oggetto che e' coinvolto nell'evento (ad es. un pannello)
  this.ObjName = "";           // Nome dell'oggetto visuale che ha causato l'evento (ad es. il bottone cerca)
  this.Par1 = null;            // Primo parametro dell'evento (il significato varia in base al tipo di evento)
  this.Par2 = null;            // Secondo parametro dell'evento (il significato varia in base al tipo di evento)
  this.Par3 = null;            // Terzo parametro dell'evento (il significato varia in base al tipo di evento)
  this.Par4 = null;            // Quarto parametro dell'evento (il significato varia in base al tipo di evento)
  this.Par5 = null;            // Quinto parametro dell'evento (il significato varia in base al tipo di evento)
  this.Par6 = null;            // Sesto parametro dell'evento (il significato varia in base al tipo di evento)
  this.Tag  = null;            // Parametro opzionale inseribile all'abbisogna (OWA)
  this.StartTime = new Date(); // Data di creazione dell'evento
  this.DelayType = delaytype;  // Tipo di ritardo: false o undefined metodo standard (se vengono aggiunti eventi dello stesso tipo il delay viene mantenuto), true metodo avanzato (se vengono aggiunti eventi dello stesso tipo viene resettato il delay..)
  this.DelayCopies = delaycopies;    // Metodo avanzato speciale: se true e trovo tra gli eventi da lanciare altri del mio tipo alloraritardo anche loro, mettendogli lo startTime uguale al mio
  //
  if (name!=undefined)
    this.ObjName = name;
  if (par1!=undefined)
    this.Par1 = par1;  
  if (par2!=undefined)
    this.Par2 = par2;
  if (par3!=undefined)
    this.Par3 = par3;
  if (par4!=undefined)
    this.Par4 = par4;  
  if (par5!=undefined)
    this.Par5 = par5;  
  if (par6!=undefined)
    this.Par6 = par6;
  if (evento!=undefined)
  {
    // Coordinate del mouse a proposito dell'evento
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
    {
      this.XPos = evento.screenX;
      this.YPos = evento.screenY;
      this.XPosAbs = this.XPos;
      this.YPosAbs = this.YPos;
    }
    else
    {
      this.XPos = window.event ? window.event.offsetX : evento.layerX;  
      this.YPos = window.event ? window.event.offsetY : evento.layerY;
      var src = window.event ? event.srcElement : evento.target;
      if (src)
      {
        this.XPosAbs = RD3_Glb.GetScreenLeft(src) + this.XPos;
        this.YPosAbs = RD3_Glb.GetScreenTop(src) + this.YPos;
      }
    }
    //
    // Stato dei tasti modificatori al momento dell'evento
    this.ShiftPress = window.event ? window.event.shiftKey : evento.shiftKey;
    this.CtrlPress  = window.event ? window.event.ctrlKey : evento.ctrlKey;
    this.AltPress   = window.event ? window.event.altKey : evento.altKey;
  }
  //
  // Variabili che indicano come l'evento deve essere gestito
  this.IsBlocking = evt & RD3_Glb.EVENT_BLOCKING;  // L'evento e' SINCRONO o asincrono?
  this.ClientSide = evt & RD3_Glb.EVENT_CLIENTSIDE;    // Consente gestione client-side?
  this.ServerSide = evt & RD3_Glb.EVENT_SERVERSIDE;    // Consente gestione server-side?
  //
  if (evt & RD3_Glb.EVENT_IMMEDIATE)
  {
    this.DelayTime = RD3_ClientParams.DelayTimes[vtipo]; // Periodo di ritardo (l'evento non viene lanciato subito...) TODO
    if (!this.DelayTime) this.DelayTime = 0;             // Evento Immediato
  }
  else
  {
    // Evento differito, timeout standard = 10 minuti
    this.DelayTime = 600000;
  }
  //
  // Verifichiamo se e' impostato un delay
  if (delay!=undefined && delay!=null)
      this.DelayTime = delay;
  //
  // Controllo se l'evento viene gestito totalmente lato client
  if (this.ClientSide)
  {
    if (!RD3_ClientEvents.HandleEvent(this))
    {
      // Non devo fare nulla, sia lato client che server
      // perche' ci ha gia' pensato il codice specifico
      this.ClientSide = false;
      this.ServerSide = false;
    }
  }
  //
  // Aggiungo evento alla cache server se richiesto
  if (this.ServerSide)
    RD3_DesktopManager.AddEvent(this);
}

// **************************************************************************** 
// Crea il nodo XML 
// ****************************************************************************
IDEvent.prototype.WriteXmlNode = function(pNode, pDocument)
{
  var myNode = pDocument.createElement(this.Tipo);
  //
  if (this.ObjId!="")
    myNode.setAttribute("oid",  this.ObjId);
  if ((this.ObjName+"")!="")
    myNode.setAttribute("obn", this.ObjName);
  if (this.XPos)
    myNode.setAttribute("xck", this.XPos);
  if (this.YPos)
    myNode.setAttribute("yck", this.YPos);
  if (this.ShiftPress)
    myNode.setAttribute("shp", this.ShiftPress?"-1":"0");
  if (this.CtrlPress)
    myNode.setAttribute("ctp", this.CtrlPress?"-1":"0");
  if (this.AltPress)
    myNode.setAttribute("atp", this.AltPress?"-1":"0");
  if (this.Par1!=null)
    myNode.setAttribute("par1", this.HandleCharBugs(this.Par1));
  if (this.Par2!=null)
    myNode.setAttribute("par2", this.HandleCharBugs(this.Par2));
  if (this.Par3!=null)
    myNode.setAttribute("par3", this.HandleCharBugs(this.Par3));
  if (this.Par4!=null)
    myNode.setAttribute("par4", this.HandleCharBugs(this.Par4));
  if (this.Par5!=null)
    myNode.setAttribute("par5", this.HandleCharBugs(this.Par5));
  if (this.Par6!=null)
    myNode.setAttribute("par6", this.HandleCharBugs(this.Par6));
  if (this.Tag!=null)
    myNode.setAttribute("tag", this.HandleCharBugs(this.Tag));
  //
  // Invio controllo attivo
  if (RD3_KBManager.LastActiveObject)
    myNode.setAttribute("ace", RD3_KBManager.LastActiveObject.Identifier);
  //
  pNode.appendChild(myNode);
}

// **************************************************************************** 
// Gestisce la sostituzione di:
//   - doppi apici con &quot;  (per SAFARI3)
//   - & con &amp;             (per SAFARI3)
//   - encode di emoji         (per tutti)
// ****************************************************************************
IDEvent.prototype.HandleCharBugs = function(val)
{
  // Il problema si presenta solo su SAFARI3
  if (RD3_Glb.IsSafari(3))
  {
    // Se non ci sono doppi apici o & tutto OK. ATTENZIONE: val puo' anche non essere una stringa!!!
    if (!val.replace || (val.indexOf('"') == -1 && val.indexOf('&') == -1))
      return val;
    //
    // Sostituisco & con &amp; (prima!) poi " con &quot;
    val = val.replace(/&/g, '&amp;');
    val = val.replace(/"/g, '&quot;');
  }
  //
  // Encodo emoji
  for (var i=0; i<val.length; i++)
  {
    var ch = val.charCodeAt(i);
    if (ch >= 0xD800) 
    {
      var encTxt = "&#" + ch + "-" + val.charCodeAt(i+1) + ";";
      val = val.substring(0, i) + encTxt + val.substring(i + 2);
      i += encTxt.length - 1;
    }
  }
  //
  return val;
}

// **************************************************************************** 
// Ritorna True se e' possibile inviare questo evento al server
// ****************************************************************************
IDEvent.prototype.CanBeFired = function(time)
{
  // Controllo tempo di ritardo
  return (time-this.StartTime>=this.DelayTime)
}


// **************************************************************************** 
// Ritorna True se l'evento passato come parametro e' equivalente a questo
// ****************************************************************************
IDEvent.prototype.IsEqual = function(evento)
{
  // Per alcuni eventi devo controllare parametri diversi...
  if (this.Tipo=="panms" && this.ObjName!=evento.ObjName)
    return false;
  //
  // Gli eventi di pressione comandi di pannello non si devono MAI sovrascrivere
  // Se no il server rischia di perdere la sincronia
  if (this.Tipo=="pantb")
    return false;
  //
  // Gli eventi di espansione dei nodi degli alberi non si devono MAI sovrascrivere, 
  // se no il server perde la sincronia
  if (this.Tipo=="trnexp")
    return false;
  //
  // Gli eventi di gestione fuoco non si devono MAI sovrascrivere, 
  // se no il server perde la sincronia
  if (this.Tipo=="fev")
    return false;
  //
  // Gli eventi di gestione dei tasti non si devono MAI sovrascrivere, 
  // se no il server perde la sincronia
  if (this.Tipo=="keypress")
    return false;
  //
  // Per alcuni eventi devo controllare parametri diversi...
  if (this.Tipo=="resize" && this.ObjName!=evento.ObjName)
    return false;
  //
  // Per alcuni eventi devo controllare parametri diversi...
  if (this.Tipo=="sound" && this.ObjName!=evento.ObjName)
    return false;
  //
  // Gli eventi di riordinamento delle colonne devono essere inviati tutti se relativi a colonne diverse
  if (this.Tipo == "rdcol" && this.ObjId == evento.ObjId && (this.Par1 != evento.Par1 || this.Par2 != evento.Par2))
    return false;
  //
  // Gli eventi di comando no
  if (this.Tipo=="cmd")
    return false;
  //
  // Gli eventi di IWFiles no
  if (this.Tipo=="IWFiles")
    return false;
  //
  // Gli eventi di customElement no
  if (this.Tipo == "cseev")
    return false;
  //
  // Evento dello stesso tipo sullo stesso oggetto...
  return (this.Tipo==evento.Tipo && this.ObjId==evento.ObjId);
}


// **************************************************************************** 
// Copia i dati dell'evento dentro di me
// ****************************************************************************
IDEvent.prototype.CopyFrom = function(evento)
{
  this.Tipo = evento.Tipo;
  this.ObjId = evento.ObjId;
  this.ObjName = evento.ObjName;
  this.Par1 = evento.Par1;
  this.Par2 = evento.Par2;
  this.Par3 = evento.Par3;
  this.Par4 = evento.Par4;
  this.Par5 = evento.Par5;
  this.Par6 = evento.Par6;
  this.XPos = evento.XPos;
  this.YPos = evento.YPos;
  this.ShiftPress = evento.ShiftPress;
  this.CtrlPress  = evento.CtrlPress;
  this.AltPress   = evento.AltPress;
  //
  if (this.DelayTime>evento.DelayTime)
  {
    this.DelayTime = evento.DelayTime;
  }
  //
  if (this.DelayType)
    this.StartTime = evento.StartTime;
  //
  this.IsBlocking = evento.IsBlocking;
  this.ServerSide = evento.ServerSide;
  this.ClientSide = evento.ClientSide;
}

// **************************************************************************** 
// Scrive l'evento in formato STRINGA
// ****************************************************************************
IDEvent.prototype.ToString = function()
{
  var out = this.Tipo + "~";
  out += this.ObjId + "~";
  out += this.ObjName + "~";
  out += this.XPos + "~";
  out += this.YPos + "~";
  out += (this.ShiftPress?"-1":"0") + "~";
  out += (this.CtrlPress?"-1":"0") + "~";
  out += (this.AltPress?"-1":"0") + "~";
  out += this.Par1 + "~";
  out += this.Par2 + "~";
  out += this.Par3 + "~";
  out += this.Par4 + "~";
  out += this.Par5 + "~";
  out += this.Par6 + "~";
  out += this.Tag + "~";
  return out;
}

// **************************************************************************** 
// Carica l'evento da una STRINGA
// ****************************************************************************
IDEvent.prototype.LoadFromString = function(str)
{
  var strarr = str.split("~");
  this.Tipo       = strarr[0];
  this.ObjId      = strarr[1];
  this.ObjName    = strarr[2];
  if (strarr[2]!="undefined") this.XPos = parseInt(strarr[3], 10);
  if (strarr[3]!="undefined") this.YPos = parseInt(strarr[4], 10);
  this.ShiftPress = (strarr[5]=="-1");
  this.CtrlPress  = (strarr[6]=="-1");
  this.AltPress   = (strarr[7]=="-1");
  this.Par1 = strarr[8];
  this.Par2 = strarr[9];
  this.Par3 = strarr[10];
  this.Par4 = strarr[11];
  this.Par5 = strarr[12];
  this.Par6 = strarr[13];
  this.Tag = strarr[14];
}

// **************************************************************************** 
// Ritorna True se una richiesta in cui e' presente questo evento non dovrebbe rimuovere i messaggi temporanei
// ****************************************************************************
IDEvent.prototype.ShouldSkipTempMessageClear = function () 
{
  return this.Tipo == "resize" || this.Tipo == "fev" || this.Tipo == "timer";
}

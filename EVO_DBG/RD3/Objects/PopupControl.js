// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2012 Pro Gamma Srl - All rights reserved
//
// Classe PopupControl: implementa il funzionamento
// dei controlli di editing in popup, come il calendario
// e il tastierino numerico.
// Estende PopupFrame
// ************************************************

function PopupControl(tipo, cella, obj)
{
  this.Type = tipo;
  this.Cell = cella;
  //
  this.Day = 1;
  this.Month = 1;
  this.MaxDay = 31;
  this.Year = 1900;
  //
  this.Hour = 0;
  this.Minute = 0;
  //
  //this.Colors = null;
  //this.ObjToAttach = null;
  if (obj != undefined)
    this.ObjToAttach = obj;
}
//
// Definisco l'estensione della classe
PopupControl.prototype = new PopupFrame();


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
PopupControl.prototype.Realize = function()
{
  // Il controllo e' di tipo popover sia in ipad che in iphone
  this.Borders = RD3_Glb.BORDER_THIN;
  this.AutoClose = true;
  this.Centered = false;
  this.CanMove = false;
  if (RD3_Glb.IsSmartPhone())
    this.ModalAnim = true;
  this.SetWidth(100);
  this.SetHeight(100);
  //
  // Chiamo la classe base
  PopupFrame.prototype.Realize.call(this, "-popover");
  //
  if (this.Type != RD3_Glb.CTRL_CPICKER)
    this.SetCaption(this.Cell.ParentField ? this.Cell.ParentField.FormHeader : "");
  this.ContentBox.style.paddingTop = "0px";
  //
  // Creo i controlli
  switch (this.Type)
  {
    case RD3_Glb.CTRL_DATE:
      this.RealizeDateControl();
      this.SetDate(this.ParseDate(this.Cell.Text));
    break;
    
    case RD3_Glb.CTRL_TIME:
      this.RealizeTimeControl();
      this.SetTime(this.ParseTime(this.Cell.Text));
    break;
    
    case RD3_Glb.CTRL_DATETIME:
      this.RealizeDateControl();
      this.RealizeTimeControl();
      //
      this.SetDate(this.ParseDate(this.Cell.Text));
      this.SetTime(this.ParseTime(this.Cell.Text));
    break;
    
    case RD3_Glb.CTRL_KEYNUM:
      this.RealizeNumericKeyboard();
      mc(this.Cell.Mask, "N", null, this.Cell.IntCtrl,true);
      this.UpdateCaption();
    break;
    
    case RD3_Glb.CTRL_CPICKER:
      this.RealizeColorChooser();
      this.UpdateCaption();
    break;
  }
  //
  this.AttachTo(this.ObjToAttach ? this.ObjToAttach : this.Cell.IntCtrl);
}


// ********************************************************************************
// Realizza il calendario
// ********************************************************************************
PopupControl.prototype.RealizeDateControl = function()
{
  var dayWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? "45px" : "");
  var monthWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? "115px" : "");
  var yearWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? "70px" : "");
  //
  if (RD3_Glb.IsSmartPhone())
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    var w = wep.offsetWidth>320 ? wep.offsetWidth : 320;
    //
    dayWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? w/100*15 : w/100*25) + "px";
    monthWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? w/100*35 : w/100*50) + "px";
    yearWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? w/100*20 : w/100*25) + "px";
  }
  //
  this.DayContainer= document.createElement("div");
  this.DayContainer.className = "ctrl-day-container";
  this.DayContainer.style.left = "0px";
  this.DayContainer.style.width = dayWidth;
  this.ContentBox.appendChild(this.DayContainer);
  //
  this.DayPicker = document.createElement("div");
  this.DayPicker.className = "ctrl-day-picker";
  this.DayContainer.appendChild(this.DayPicker);
  //
  this.DayScroll = new IDScroll(this.Identifier+":ds", this.DayPicker, this.DayContainer, this);
  this.FillPicker(1, this.MaxDay, this.DayPicker, this.DayScroll);
  //
  this.MonthContainer= document.createElement("div");
  this.MonthContainer.className = "ctrl-month-container";
  this.MonthContainer.style.left = this.DayContainer.offsetWidth+"px";
  this.MonthContainer.style.width = monthWidth;
  this.ContentBox.appendChild(this.MonthContainer);
  //
  this.MonthPicker = document.createElement("div");
  this.MonthPicker.className = "ctrl-month-picker";
  this.MonthContainer.appendChild(this.MonthPicker);
  //
  this.MonthScroll = new IDScroll(this.Identifier+":ms", this.MonthPicker, this.MonthContainer, this);
  this.FillPicker(1, 12, this.MonthPicker, this.MonthScroll, ClientMessages.WEP_CAL_MonthNames);
  //
  this.YearContainer= document.createElement("div");
  this.YearContainer.className = "ctrl-year-container";
  this.YearContainer.style.left = (this.DayContainer.offsetWidth+this.MonthContainer.offsetWidth)+"px";
  this.YearContainer.style.width = yearWidth;
  this.ContentBox.appendChild(this.YearContainer);
  //
  this.YearPicker = document.createElement("div");
  this.YearPicker.className = "ctrl-year-picker";
  this.YearContainer.appendChild(this.YearPicker);
  //
  this.YearScroll = new IDScroll(this.Identifier+":ys", this.YearPicker, this.YearContainer, this);
  this.FillPicker(1950, 2050, this.YearPicker, this.YearScroll);
  //
  this.DateSelector = document.createElement("div");
  this.DateSelector.className = "ctrl-date-selector";
  this.ContentBox.appendChild(this.DateSelector);
  //
  this.SetHeight(264);
  //
  if (RD3_Glb.IsSmartPhone())
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    this.SetWidth(wep.offsetWidth>320 ? wep.offsetWidth : 320);
  }
  else
  {
    this.SetWidth(320);
  }
}

PopupControl.prototype.RealizeTimeControl = function()
{
  var hourWidth = this.Type==RD3_Glb.CTRL_DATETIME ? "45px" : "160px";
  var minuteWidth = this.Type==RD3_Glb.CTRL_DATETIME ? "45px" : "160px";
  //
  if (RD3_Glb.IsSmartPhone())
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    var w = wep.offsetWidth>320 ? wep.offsetWidth : 320;
    //
    hourWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? w/100*15 : w/100*50) + "px";
    minuteWidth = (this.Type==RD3_Glb.CTRL_DATETIME ? w/100*15 : w/100*50) + "px";
  }
  //
  var lft = (this.Type!=RD3_Glb.CTRL_DATETIME ? 0 : this.DayContainer.offsetWidth+this.MonthContainer.offsetWidth+this.YearContainer.offsetWidth);
  this.HourContainer= document.createElement("div");
  this.HourContainer.className = "ctrl-hour-container";
  this.HourContainer.style.left = lft + "px";
  this.HourContainer.style.width = hourWidth;
  this.ContentBox.appendChild(this.HourContainer);
  //
  this.HourPicker = document.createElement("div");
  this.HourPicker.className = "ctrl-hour-picker";
  this.HourContainer.appendChild(this.HourPicker);
  //
  var hourList = new Array();
  for (var h=0; h<24; h++)
    hourList[h] = h<10 ? "0"+h.toString() : h.toString();
  this.HourScroll = new IDScroll(this.Identifier+":hs", this.HourPicker, this.HourContainer, this);
  this.FillPicker(1, 24, this.HourPicker, this.HourScroll, hourList);
  //
  lft = lft+this.HourContainer.offsetWidth;
  this.MinuteContainer= document.createElement("div");
  this.MinuteContainer.className = "ctrl-minute-container";
  this.MinuteContainer.style.left = lft+"px";
  this.MinuteContainer.style.width = minuteWidth;
  this.ContentBox.appendChild(this.MinuteContainer);
  //
  this.MinutePicker = document.createElement("div");
  this.MinutePicker.className = "ctrl-minute-picker";
  this.MinuteContainer.appendChild(this.MinutePicker);
  //
  var minuteList = new Array();
  for (var mm=0; mm<60; mm++)
    minuteList[mm] = mm<10 ? "0"+mm.toString() : mm.toString();
  this.MinuteScroll = new IDScroll(this.Identifier+":mms", this.MinutePicker, this.MinuteContainer, this);
  this.FillPicker(1, 60, this.MinutePicker, this.MinuteScroll, minuteList);
  //
  this.DateSelector = document.createElement("div");
  this.DateSelector.className = "ctrl-time-selector";
  this.ContentBox.appendChild(this.DateSelector);
  //
  this.SetHeight(264);
  //
  if (RD3_Glb.IsSmartPhone())
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    this.SetWidth(wep.offsetWidth>320 ? wep.offsetWidth : 320);
  }
  else
  {
    this.SetWidth(320);
  }
}


// ********************************************************************************
// Realizza il calendario
// ********************************************************************************
PopupControl.prototype.FillPicker = function(from, to, obj, ids, lista)
{
  // Svuoto la lista dai vecchi valori
  obj.innerHTML = "";
  //
  // Creo due prime righe vuote
  var sp = document.createElement("div");
  sp.className = "ctrl-picker-cell";
  obj.appendChild(sp);
  sp = document.createElement("div");
  sp.className = "ctrl-picker-cell";
  obj.appendChild(sp);
  //
  for (var i = from; i<=to; i++)
  {
    var s = "";
  	if (lista==undefined)
      s+=i;
    else
      s+=lista[i-1];
    //
    sp = document.createElement("div");
    sp.className = "ctrl-picker-cell";
    sp.textContent = s;
    obj.appendChild(sp);
  }
  //
  // Creo due righe vuote in fondo
  sp = document.createElement("div");
  sp.className = "ctrl-picker-cell";
  obj.appendChild(sp);
  sp = document.createElement("div");
  sp.className = "ctrl-picker-cell";
  obj.appendChild(sp);
  //
  ids.DisplayScrollbar = false;
  ids.SetSnap(0,44);
  ids.ChangeSize();
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PopupControl.prototype.Unrealize = function()
{
  if (this.DayScroll) this.DayScroll.Unrealize();
  if (this.MonthScroll) this.MonthScroll.Unrealize();
  if (this.YearScroll) this.YearScroll.Unrealize();
  //
  if (this.HourScroll) this.HourScroll.Unrealize();
  if (this.MinuteScroll) this.MinuteScroll.Unrealize();
  //
  // Chiamo la classe base
  PopupFrame.prototype.Unrealize.call(this);
}

// ***************************************************
// Posiziona gli elementi del frame e lo dimensiona
// ***************************************************
PopupControl.prototype.AdaptLayout = function()
{
  // Chiamo la classe base
  PopupFrame.prototype.AdaptLayout.call(this);
}


// ********************************************************************************
// apre la popup
// ********************************************************************************
PopupControl.prototype.Open = function()
{ 
  // Chiamo la classe base
  PopupFrame.prototype.Open.call(this);
  //
  RD3_DesktopManager.WebEntryPoint.OpenPopupControl = this;
}


// ********************************************************************************
// Imposta le parti di data
// ********************************************************************************
PopupControl.prototype.SetDay = function(v)
{ 
  this.Day = v;
}

PopupControl.prototype.SetMonth = function(v)
{ 
  this.Month = v;
  this.SetMaxDay(new Date(this.Year, v, 0).getDate());
}

PopupControl.prototype.SetYear = function(v)
{ 
  this.Year = v;
}

PopupControl.prototype.SetHour = function(v)
{ 
  this.Hour = v;
}

PopupControl.prototype.SetMinute = function(v)
{ 
  this.Minute = v;
}


PopupControl.prototype.SetMaxDay = function(v)
{ 
  var old = this.MaxDay;
  this.MaxDay = v;
  if (old!=v)
  {
    // La Fillpicker cambia il giorno quindi me lo memorizzo e lo ripristino
    var oldDay = this.Day;
    this.FillPicker(1, this.MaxDay, this.DayPicker, this.DayScroll);
    this.Day = oldDay;
    //
    if (this.Day>this.MaxDay)
      this.SetDay(this.MaxDay);
    this.UpdateScreen(this.Day,this.DayPicker);
  }
}


// ********************************************************************************
// Cambia la data
// ********************************************************************************
PopupControl.prototype.OnScrollToPage = function(ev, d, pag, ids)
{ 
  if (ids==this.DayScroll)
    this.SetDay(pag);
  if (ids==this.MonthScroll)
    this.SetMonth(pag);
  if (ids==this.YearScroll)
    this.SetYear(pag+1949);
  if (ids==this.HourScroll)
    this.SetHour(pag-1);
  if (ids==this.MinuteScroll)
    this.SetMinute(pag-1);
}


// ********************************************************************************
// Imposta la data interna
// ********************************************************************************
PopupControl.prototype.SetDate = function(newdate)
{ 
  this.SetYear(newdate.getFullYear());
  this.SetMonth(newdate.getMonth()+1);
  this.SetDay(newdate.getDate());
  this.UpdateScreen(this.Year-1949,this.YearPicker);
  this.UpdateScreen(this.Month,this.MonthPicker);
  this.UpdateScreen(this.Day,this.DayPicker);
}


// ********************************************************************************
// Imposta la data interna
// ********************************************************************************
PopupControl.prototype.ParseDate = function(string)
{ 
  // vedi calpopup.js
  glbCalMask = this.Cell.Mask;
  ParseInputValue(string);
  return new Date(glbYear,glbMonth-1,glbDay);
}

PopupControl.prototype.SetTime = function(newtime)
{ 
  this.SetHour(newtime.getHours());
  this.SetMinute(newtime.getMinutes());
  this.UpdateScreen(this.Hour+1,this.HourPicker);
  this.UpdateScreen(this.Minute+1,this.MinutePicker);
}

PopupControl.prototype.ParseTime = function(string, dt)
{ 
  if (dt == undefined)
  {
    dt = new Date();
    dt.setFullYear(1899);
    dt.setMonth(11);
    dt.setDate(31);
  }
  //
  var i = getToken(string, this.Cell.Mask, "hh");
  if (isNaN(i))
    i = 0;
  if (i>=0) dt.setHours(i);
  //
  i = getToken(string, this.Cell.Mask, "nn");
  if (isNaN(i))
    i = 0;
  if (i>=0) dt.setMinutes(i);
  //
  return dt;
}


// ********************************************************************************
// Sposta i controlli al loro posto
// ********************************************************************************
PopupControl.prototype.UpdateScreen = function(v, obj)
{ 
  var y = 44*(v-1);
  RD3_Glb.SetTransform(obj, "translate3d(0px,-"+y+"px,0px)");
}


// ********************************************************************************
// Chiude la finestra e imposta il valore
// ********************************************************************************
PopupControl.prototype.Close = function()
{ 
  // vedi calpopup.js
  switch(this.Type)
  {
    case RD3_Glb.CTRL_DATE:
      glbSourceFieldValue = this.Cell.Text;
      glbCalMask = this.Cell.Mask;
      glbSourceField = this.Cell.IntCtrl;
      SetDate2(this.Day, this.Month, this.Year, false);
    break;
    
    case RD3_Glb.CTRL_TIME:
      var txt = this.Cell.Text;
      var msk = this.Cell.Mask;
      //
      if (txt.length == 0)
        txt = msk;
      var tk = setToken(txt, msk, "hh", this.Hour);
      tk = setToken(tk, msk, "nn", this.Minute);
      this.Cell.IntCtrl.value = tk;
      //
      glbSourceField = this.Cell.IntCtrl;
      window.setTimeout("RD3_KBManager.IDRO_OnChange(glbSourceField);", 50);
    break;
    
    case RD3_Glb.CTRL_DATETIME:
      var txt = this.Cell.Text;
      var msk = this.Cell.Mask;
      //
      if (txt.length == 0)
        txt = msk;
      var tk = setToken(txt, msk, "hh", this.Hour);
      tk = setToken(tk, msk, "nn", this.Minute);
      //
      glbSourceFieldValue = tk;
      glbCalMask = this.Cell.Mask;
      glbSourceField = this.Cell.IntCtrl;
      SetDate2(this.Day, this.Month, this.Year, false);
    break;
    
    case RD3_Glb.CTRL_KEYNUM:
      glbSourceField = this.Cell.IntCtrl;
      window.setTimeout("RD3_KBManager.IDRO_OnChange(glbSourceField);", 50);
    break;
  }
  //
  // Chiamo la classe base
  PopupFrame.prototype.Close.call(this);
  //
  if (RD3_DesktopManager.WebEntryPoint.OpenPopupControl == this)
    delete RD3_DesktopManager.WebEntryPoint.OpenPopupControl;
}


// ********************************************************************************
// Realizza una tastiera numerica
// ********************************************************************************
PopupControl.prototype.RealizeNumericKeyboard = function()
{
  var txt = new Array("1","2","3","+","4","5","6","-","7","8","9","C","-","0",".","=");
  var fnc = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyPress', ev)");
  for (var y=0;y<4;y++)
  {
    for (var x=0;x<4;x++)
    {
      var btn = document.createElement("div");
      this.ContentBox.appendChild(btn);
      btn.textContent = txt[y*4+x];
      btn.id = "key_"+(y*4+x);
      btn.className = "ctrl-key-button";
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
      {
        // Su android l'= deve essere sull'END altrimenti la tastiera si puo' aprire quando non deve
        if (RD3_Glb.IsAndroid() && btn.textContent=="=")
          btn.ontouchend = fnc;
        else
          btn.ontouchstart = fnc;
      }
      else
        btn.onmousedown = fnc;
      btn.style.left = ((x+1)*24-20)+"%";
      btn.style.top = ((y+1)*24-20)+"%";
    }
  }
  //
  RD3_Glb.AddClass(this.ContentBox,"ctrl-keyboard");
  this.CaptionBox.style.textAlign = "right";
  if (RD3_Glb.IsSmartPhone())
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    this.SetWidth(wep.offsetWidth>320 ? wep.offsetWidth : 320);
  }
  else
  {
    this.SetWidth(256);
  }
  this.SetHeight(300);
}


// ********************************************************************************
// Interpreta il dato
// ********************************************************************************
PopupControl.prototype.OnKeyPress = function(ev)
{
  var targetEl = ev.target ? ev.target : ev.srcElement;
  //
  RD3_Glb.StopEvent(ev);
  var key = targetEl.textContent;
  //
  switch(key)
  {
    case "=":
      this.Close();
    break;
    
    case "C":
      //
      var val = this.Cell.IntCtrl.value;
      //
      // Devo pozionare il cursore nel punto giusto, per prima cosa devo sapere se ci sono decimali o meno
      var decPos = val.indexOf(glbDecSep);
      //
      // Se non ci sono decimali non devo fare nulla.. gia' la cancellazione standard e' ok (cancella gli interi dalla fine..)
      if (decPos>=0)
      {
        // se ci sono decimali mi devo posizionare sul decimale piu' a destra diverso dallo zero
        var idx = val.length-1;
        while (idx>decPos)
        { 
          var stopIteration = true;
          //
          // Se il carattere e' uno zero devo decidere se cancellarlo o saltarlo
          // dipende se e' obbligatorio o meno, in un caso devo saltarlo altrimenti mangiarlo
          if (val.charAt(idx) == '0')
          {
            // Come faccio per sapere se uno zero e' obbligatorio? lo rimuovo e faccio riformattare il numero..
            // se rinasce era obbligatorio.. (devo togliere i separatori delle migliaia perche' la formatNumber non se li aspetta..)
            var ris = val.substring(0, idx).replace(new RegExp((glbThoSep=="." ? "\\." : glbThoSep),"g"),'');
            ris = formatNumber(ris, glbMask);
            //
            // Se lo zero e' obbligatorio lo lascio stare e passo al carattere precedente..
            if (ris.length==val.length)
              stopIteration = false;
          }
          //
          if (stopIteration)
            break;
          //
          idx--;
        }
        //
        setCursorPos(this.Cell.IntCtrl, (idx==decPos ? idx : idx+1));
      }
      //
      hk(null,8);
    break;
    
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      hk(null,48+parseInt(key,10));
    break;
    
    case "0":
      hk(null,48);
    break;
    
    case ".":
      hk(null,188);
    break;

    case "+":
      this.Increment(1);
    break;

    case "-":
      if (targetEl.id=="key_7")
        this.Increment(-1);
      else
        hk(null,189);
    break;
  }
  //
  this.UpdateCaption();
}

// ********************************************************************************
// Aggiorna il titolo
// ********************************************************************************
PopupControl.prototype.UpdateCaption = function()
{
  if (this.Type != RD3_Glb.CTRL_CPICKER)
    this.SetCaption((this.Cell.ParentField ? this.Cell.ParentField.FormHeader+"=" : "" )+this.Cell.IntCtrl.value);
}


// ********************************************************************************
// Aggiorna il titolo
// ********************************************************************************
PopupControl.prototype.Increment = function(q)
{
  var s=unmask(this.Cell.IntCtrl.value);
  var f = parseFloat(s)+q;
  if (isNaN(f))
    f=0;
  this.Cell.IntCtrl.value = formatNumber(f+"",this.Cell.Mask);
}

// ********************************************************************************
// Realizza un ColorChooser
// ********************************************************************************
PopupControl.prototype.RealizeColorChooser = function()
{
  if (!this.Colors)
    return;
  //
  var fnc = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnColorPress', ev)");
  var ymax = Math.ceil(this.Colors.length/6);
  var top = 0;
  var maxh = this.CaptionBox ? this.CaptionBox.offsetHeight : 0;
  //
  var maxw = 0;
  for (var y=0; y<ymax; y++)
  {
    var left = 0;
    for (var x=0;x<6;x++)
    {
      var colorNum = x+y*6;
      if (colorNum>=this.Colors.length)
        break;
      //
      var btn = document.createElement("div");
      btn.id = "color_" + colorNum;
      btn.className = "ctrl-key-color";
      btn.colorTag = this.Colors[colorNum];
      //
      if (this.Colors[colorNum] == "transparent")
        RD3_Glb.AddClass(btn, "ctrl-color-transparent");
      else
        btn.style.backgroundColor = this.Colors[colorNum];
      //
      this.ContentBox.appendChild(btn);
      //
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        btn.ontouchstart = fnc;
      else
        btn.onmousedown = fnc;
      //
      var sf = RD3_Glb.GetCurrentStyle(btn);
      btn.style.left = left+"px";
      btn.style.top = top+"px";
      //
      left = left + btn.offsetWidth + parseInt("0"+sf.marginLeft, 10) + parseInt("0"+sf.marginRight, 10);
      if (x==5)
        top = top + btn.offsetHeight + parseInt("0"+sf.marginTop, 10) + parseInt("0"+sf.marginBottom, 10);
      if (x==0)
        maxh = maxh + btn.offsetHeight + parseInt("0"+sf.marginTop, 10) + parseInt("0"+sf.marginBottom, 10);
      //
      maxw = left>maxw ? left : maxw;
    }
  }
  //
  RD3_Glb.AddClass(this.ContentBox,"ctrl-colorchooser");
  //
  if (RD3_Glb.IsSmartPhone())
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    this.SetWidth(wep.offsetWidth>320 ? wep.offsetWidth : 320);
  }
  else
  {
    this.SetWidth(maxw);
  }
  this.SetHeight(maxh);
}

PopupControl.prototype.OnColorPress = function(ev)
{
  var targetEl = ev.target ? ev.target : ev.srcElement;
  //
  RD3_Glb.StopEvent(ev);
  var color = targetEl.colorTag ? targetEl.colorTag : targetEl.style.backgroundColor;
  //
  this.CallBackFunction(color);
  //
  this.Close();
}
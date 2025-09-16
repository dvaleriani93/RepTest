// ************************************
// Instant Web Calendar Popup Functions
// ************************************
var glbDay = 0;   // Data selezionata nel popup
var glbMonth = 0;
var glbYear = 0;
var glbHour = -1;
var glbMinute = -1;

var glbSourceField = null;    // Campo e valore iniziale
var glbSourceFieldValue = "";
var glbCalMask; // eventuale maschera del campo

var glbStartDate; // Posizione iniziale della prima data

var DayNames = new Array("lu","ma","me","gi","ve","sa","do");
var MonthNames = new Array("gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre");

var DATE = 0;
var DATETIME = 1;
var TIME = 2;
var isDateTime = DATE;

var OriginalWidth = -1;
var OriginalHeight = -1;

// ************************************
// Estrae/imposta i token
// ************************************
function setToken(ris,mask,token,value)
{
	var s = value.toString();
	while (s.length<token.length)
		s = "0" + s;
	s = s.substring(0,token.length);
	var i = mask.indexOf(token);
	if (i>-1)		
	{
		ris = ris.substr(0,i) + s + ris.substr(i + token.length);
	}
	return ris;
}

function getToken(ris,mask,token)
{
	var i = mask.indexOf(token);
	var s;
	if (i==-1 || ris.length<i+token.length)
		return -1;
	else
	{
		s = ris.substr(i,token.length);
		return parseInt(s);
	}
}

// ************************************
// Converte una stringa in numero
// ************************************
function StrToNum(Value) 
{
	var Result = "0";
	for(var i = 0; i < Value.length; i++)
	{
		var c = Value.charAt(i);
		if(IsDigit(c))
			Result += "" + c;
	}
	return (parseInt(Result,10));
}

function IsDigit(ch) 
{
	return (ch >= '0' && ch <= '9');
}


// ***************************************************
// Preleva il numero di giorni nel mese
// considera (in modo semplificato) gli anni bisestili
// ***************************************************
function DaysInMonth(vMonth, vYear) 
{
	var DaysInMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var Days = DaysInMonth[vMonth-1];
	if(vMonth == 2) 
	{
		if((vYear%4) == 0 )
			Days++;
	}
	return Days;
}

function GetNameOfMonth(vMonth) 
{
	return(MonthNames[vMonth-1]);
}


// ************************************
// Controlla se la data è valida
// ************************************
function IsDate(vDay, vMonth, vYear, vHour, vMinute) 
{
	if(vYear > 2100 || vYear < 1900)
		return false;
	//
	if(vMonth > 12 || vMonth < 1 )
		return false;
	//
	if(vDay < 1)
		return false;
	//
	if(vDay > DaysInMonth(vMonth, vYear))
		return false;
	//
	if (vHour && (vHour < 0 || vHour > 23))
	  return false;
	//
	if (vMinute && (vMinute < 0 || vMinute > 59))
	  return false;
	//
	return true;
}


// ************************************
// Preleva i dati in ingresso
// ************************************
function ParseInputValue(vValue)
{
	var vDay = 0;
	var vMonth = 0;
	var vYear = 0;
	var vHour = 0;
	var vMinute = 0;
	//
	if (vValue.length<glbCalMask.length)
		vValue += glbCalMask.substring(vValue.length,glbCalMask.length);
	//
	vDay=getToken(vValue,glbCalMask,"dd");
	vMonth=getToken(vValue,glbCalMask,"mm");
	vYear=getToken(vValue,glbCalMask,"yyyy");
	vHour=getToken(vValue,glbCalMask,"hh");
	vMinute=getToken(vValue,glbCalMask,"nn");
	//
	if (vYear==-1)
		vYear=getToken(vValue,glbCalMask,"yy");
	//
	if (vYear<100 && vYear>=0)
	{
		if (vYear>=50)
			vYear+=1900;
		else
			vYear+=2000;
	}
	//
  if(vHour>=0 && vMinute>=0) 
  {
    if(IsDate(vDay, vMonth, vYear, vHour, vMinute) && vYear>0 && vMonth>0 && vDay>0)
	  {
      glbDay = vDay;
      glbMonth = vMonth;
      glbYear = vYear;
      glbHour = vHour;
      glbMinute = vMinute;
	  }
    else if (glbCalMask.indexOf("dd") == -1 && glbCalMask.indexOf("mm") == -1 && glbCalMask.indexOf("yyyy") == -1) {
      // La maschera non ha dd/mm/yyyy, potrebbe essere un TIME (hh:nn)
      glbHour = vHour;
  		glbMinute = vMinute;
    }
  }
	else if(IsDate(vDay, vMonth, vYear) && vYear>0 && vMonth>0 && vDay>0)
	{
		glbDay = vDay;
		glbMonth = vMonth;
		glbYear = vYear;
		glbHour = vHour;
    glbMinute = vMinute;
	} 
	else 
	{
		var Oggi = new Date();
		glbDay = Oggi.getDate();
		glbMonth = Oggi.getMonth() + 1;
		glbYear = Oggi.getFullYear();
		//
		if (glbCalMask.indexOf("hh:nn") > -1)
		{
  		glbHour = Oggi.getHours();
  		glbMinute = Oggi.getMinutes();
	  }
	  else
	  {
	    glbHour = -1;
  		glbMinute = -1;
	  }
	}
	return true;
}

// *********************************************************
// Determina la posizione del cursone all'interno del campo
// *********************************************************
function GetCaretPosition(input)
{
	var CaretPos = 0;
	// IE Support
	if (document.selection)
  {
		input.focus ();
		var Sel = document.selection.createRange();
		Sel.moveStart ('character', -input.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (input.selectionStart || input.selectionStart == '0')
		CaretPos = input.selectionStart;
	return (CaretPos);
}

// ************************************
// Mostra il calendario
// ************************************
function ShowCalendar(InputField, mask)
{
	var CalObj=document.getElementById("calpopup");
	OriginalWidth = OriginalWidth == -1 ? CalObj.style.width : OriginalWidth;
	OriginalHeight = OriginalHeight == -1 ? CalObj.style.height : OriginalHeight;
	var CalFrame = GetFrame(window.frames,"calpopup");
	//
	// Firefox non trova l'IFRAME con nome CALPOPUP tra i window.frames... 
	// la GetFrame è protetta e torna window se non trova il frame (per le applicazioni senza RD)
	if (IsUndefined(CalFrame) || CalFrame==window)
		CalFrame = CalObj.contentWindow;
	//
	// Controllo caricamento calendario
	if(CalFrame.glbLoaded == null || CalFrame.glbLoaded == false)
		return;
	//
	glbCalMask = mask;
	//
  if (glbCalMask == "" && RD3_ServerParams)
  	glbCalMask = RD3_ServerParams.DateMask;
	//
  // Decido da dove partire per cercare la data tenendo conto della posizione del cursore
  var b = Math.max(GetCaretPosition(InputField) - glbCalMask.length, 0);
  //
  // Preparo una stringa con la maschera per la RegEx
	var m = glbCalMask.replace(/d/g,"\\d");
	m = m.replace(/m/g,"\\d");
	m = m.replace(/y/g,"\\d");
	m = m.replace(/a/g,"\\d");
	m = m.replace(/h/g,"\\d");
	m = m.replace(/n/g,"\\d");
	m = m.replace(/s/g,"\\d");
	m = m.replace(/\//g,"\\/");
	//
	// Cerco la posizione della data nella parte di campo
	eval ("glbStartDate = b + InputField.value.substr(b, glbCalMask.length*2).search(/" + m + "/)");
	//
	// Stringa contenente la data individuata nel campo
	var FieldValueDate = InputField.value.substr(glbStartDate,glbCalMask.length);
	//
	if(InputField == glbSourceField && CalObj.style.display == "block")
	{
		// Il calendario era già aperto, ma l'utente ha cliccato di nuovo sull'apertura
		// magari di un altro campo data
		if(glbSourceFieldValue != InputField.value && ParseInputValue(FieldValueDate))
		{
			// Imposto la nuova data
			glbSourceFieldValue = InputField.value;
			CalFrame.SetInputDate(glbDay, glbMonth, glbYear);
			CalFrame.SetDate(glbDay, glbMonth, glbYear);
		}
		else
		{
			// Lo nascondo
			CalObj.style.display = "none";
		}
	}
	else
	{
	  // Se il documento è in fase di caricamento... non mostro il calendario!
	  // Forse c'è un calendario legato ad un campo attivo che è stato cambiato dall'utente prima
	  // di aver aperto il calendario. In questo caso il pb viene scatenato non appena l'utente clicca
	  // sul bottone del calendario
	  // Devo proteggere perché se non c'è l'RD non esiste il frame MAIN
	  try
	  {
  	  if (GetFrame(window.parent.frames,"Main").document.body.style.cursor=="progress")
  	    return;
  	}
  	catch(ex) {}
	  //
		glbSourceField = InputField;
		glbSourceFieldValue = InputField.value;
		//		
		// Apro il calendario che era chiuso
		if(ParseInputValue(FieldValueDate))
		{
		  var idx = glbCalMask.indexOf("hh");
      if (idx === -1)
        isDateTime = DATE;
      else if (idx === 0)
        isDateTime = TIME;
      else
        isDateTime = DATETIME;
		  //
	    SetDate2(glbDay, glbMonth, glbYear, false, glbHour, glbMinute);
	    CalFrame.SetInputDate(glbDay, glbMonth, glbYear, glbHour, glbMinute);
			CalFrame.SetDate(glbDay, glbMonth, glbYear, glbHour, glbMinute);
		}
		//
		// Calcolo posizione calendario
		//
		var CalLeft = 0;
		var CalTop = 0;
		for(var p = InputField; p && p.tagName!='BODY'; p = p.offsetParent)
		{
			CalLeft += p.offsetLeft - p.scrollLeft;
			CalTop += p.offsetTop - p.scrollTop;
		}
		var FldHeight = InputField.offsetHeight;
		var CalHeight = (CalObj.offsetHeight)?CalObj.offsetHeight:parseInt(CalObj.style.height);
		var CalWidth = (CalObj.offsetWidth)?CalObj.offsetWidth:parseInt(CalObj.style.width);
		var ScrollTop = document.body.scrollTop;
		//
		var tt = CalTop + FldHeight;
		if( (CalTop - CalHeight >= ScrollTop) && (CalTop + FldHeight + CalHeight > document.body.clientHeight + ScrollTop))
			tt = CalTop - CalHeight;
		//
		if (RD3_Glb)
		{
			// Controllo comunque di non uscire dallo schermo
			if (tt + CalHeight  > document.body.clientHeight)
				tt = document.body.clientHeight - CalHeight;
			if (tt<0)
				tt=0;
			if (CalLeft + CalWidth > document.body.clientWidth)
				CalLeft = document.body.clientWidth - CalWidth;
			if (CalLeft<0)
				CalLeft = 0;
		}
		//
		CalObj.style.left = CalLeft+"px";
		CalObj.style.top = tt+"px";
		//
		// Mostro calendario
		CalObj.style.display = "block";
		//
		var innerDoc = CalObj.contentDocument || CalObj.contentWindow.document;
		var calHeader = innerDoc.getElementById("CalHeader");
		var calArrowDx = innerDoc.getElementById("CalHeaderArrowDX");
		var tp = innerDoc.getElementById("timepicker");
  	var dp = innerDoc.getElementById("datepicker");
		if (isDateTime == DATE) 
		{
		  if (tp) 
		  {
		    tp.style.display = "none";
		    tp.className = "timepicker";
		  }
  	  dp.style.display = "inline-block";
		  CalObj.style.width = OriginalWidth;
		  CalObj.style.height = OriginalHeight;
		  calArrowDx.className = "CalHeaderArrowDX";
		}
		else if (isDateTime == DATETIME)
		{
      // i browser vecchi non supportano il timepicker in modalita' datetime
      var showTime = (RD3_Glb.IsIE(6) || RD3_Glb.IsIE(7) || RD3_Glb.IsIE(8) || RD3_Glb.IsSafari(5)) ? false : true;
		  if (tp)
		  {
		    tp.style.display = showTime ? "inline-block" : "none";
	      tp.className = "timepicker";
	    }
  	  dp.style.display = "inline-block";
		  CalObj.style.width = !showTime ? "220px" : (OriginalWidth == "220px" ? "360px" : "270px");
		  CalObj.style.height = OriginalHeight;
	    calArrowDx.className = "CalHeaderArrowDX CalHeaderArrowDX-TimePicker";
	  }
	  else if (isDateTime == TIME)
	  {
  	  tp.style.display = "inline-block";
  	  tp.className = "timepicker TimeOnly";
  	  dp.style.display = "none";
  	  CalObj.style.width = "114px";
  	  CalObj.style.height = "162px";
    }
	}
}


// ************************************
// Imposta Data nel Campo
// ************************************
function SetDate(vDay, vMonth, vYear, vHour, vMinute)
{
	SetDate2(vDay, vMonth, vYear, true, vHour, vMinute);
}

function SetDate2(vDay, vMonth, vYear, bSetFocus, vHour, vMinute)
{	
  // L'RD2 potrebbe aver distrutto e ricreato l'oggetto (se era attivo)... lo ricerco nel documento
  if (glbSourceField && glbSourceField.name!="")
  {
	  try
	  {
	  	glbSourceField = GetFrame(window.parent.frames,"Main").document.getElementByName(glbSourceField.name)[0];
	  }
	  catch (ex)  // No RD
	  {
	  	glbSourceField = window.document.getElementsByName(glbSourceField.name)[0];
	  }
	}
	//
	if (vDay>0 || vMonth>0 || vYear>0 || vHour>=0 || vMinute>=0)
	{
	  // Stringa contenente la data individuata nel campo
	  var FieldValueDate = glbSourceFieldValue.substr(glbStartDate,glbCalMask.length);
		if (FieldValueDate.length<glbCalMask.length)
			FieldValueDate += glbCalMask.substring(FieldValueDate.length,glbCalMask.length);
		FieldValueDate = setToken(FieldValueDate,glbCalMask,"dd",vDay);
		FieldValueDate = setToken(FieldValueDate,glbCalMask,"mm",vMonth);
		FieldValueDate = setToken(FieldValueDate,glbCalMask,"yyyy",vYear);
		if (getToken(FieldValueDate,glbCalMask,"yyyy")==-1)
	  	FieldValueDate = setToken(FieldValueDate,glbCalMask,"yy",vYear%100);	 
	  if (vHour > -1)
	    FieldValueDate = setToken(FieldValueDate,glbCalMask,"hh",vHour);
	  if (vMinute > -1)
      FieldValueDate = setToken(FieldValueDate,glbCalMask,"nn",vMinute);
    //
    // Se la maschera contiene i secondi allora li azzero in modo che vengano gestiti correttamente
    if (FieldValueDate.indexOf(":ss") > 0 && glbCalMask.indexOf(":ss") > 0)
      FieldValueDate = setToken(FieldValueDate, glbCalMask, "ss", 0);
		//
		// Imposto il valore solo se è cambiato
		if (glbSourceField.value != glbSourceFieldValue.substr(0,glbStartDate) + FieldValueDate + glbSourceFieldValue.substr(glbStartDate + FieldValueDate.length))
		{
		  if (glbStartDate >= 0)
	  	  glbSourceField.value = glbSourceFieldValue.substr(0,glbStartDate) + FieldValueDate + glbSourceFieldValue.substr(glbStartDate + FieldValueDate.length);
	  	else
	  	  glbSourceField.value = FieldValueDate;
	  	try
	  	{
	      var f1=GetFrame(window.parent.frames,"Main"); // Uso i dati memorizzati da questo lato...
	  	  f1.RegChgObj(glbSourceField);
	    }
	    catch(ex)
	    {
    	  // Tento di mandare il messaggio al kbmanager (RD3)
    	  try
    	  {
    	    // Se il calendario è appena stato aperto tramite bottone, ritardo l'evento per far sì
    	    // che window.event diventi NULL...
    		  window.setTimeout("RD3_KBManager.IDRO_OnChange(glbSourceField);", 50);
    	  }
    	  catch(ex) {}
    	  //
	    	// No RD: se modifico il valore da codice non scatta l'OnChange. Lo lancio io se serve
      	if (glbSourceField.onchange!=null)
      	  glbSourceField.onchange(glbSourceField);
	    }
	  }
	}
  //
  if (!RD3_Glb || !RD3_Glb.IsTouch())
  {
		if (bSetFocus)
			glbSourceField.focus();
	}
}

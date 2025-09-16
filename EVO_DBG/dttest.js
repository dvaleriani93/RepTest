// ************************************
// Pro Gamma Instant Developer
// DTT Test javascript library
// (c) 1999-2003 Pro Gamma Srl
// all rights reserved
// www.progamma.com
// ***********************************

// Contiene l'elenco dei messaggi d'errore avuti durante l'esecuzione
var ErrorMessages = new Array();

// **********************************************
// Scrive un valore in un campo
// **********************************************
function SetObjectValue(objid, objvalue)
{
  var obj;
	try
	{
		obj = window.parent.frames('Application').document.getElementById(objid);
		//
		// Se è una checkbox la attivo e basta, altrimenti scrivo il valore
		if (obj.tagName == 'INPUT' && obj.type == 'checkbox')
			obj.checked = (objvalue == 'on' ? true : false);
		else
			obj.value = objvalue;
	}
	catch (e)
	{
		// Oggetto non trovato...
		ErrorMessages[ErrorMessages.length] = 'SetValue: Object ' + objid + ' not found';
	}
}

// **********************************************
// Clicca su un oggetto
// **********************************************
function ClickObject(objid)
{
	var obj;
	try
	{
		obj = window.parent.frames('Application').document.getElementById(objid);
		obj.focus();
		obj.click();
	}
	catch (e)
	{
		// Se non è il LOGOFF
		if (objid!='LOGOFF')
		{
			// Oggetto non trovato...
			ErrorMessages[ErrorMessages.length] = 'Click: Object ' + objid + ' not found';
			//
			// Non so come proseguire: termino l'esecuzione del test
			ClickObject('LOGOFF');
			EndReplay();
		}
	}
}

// **********************************************
// Clicca su un oggetto (cercandolo per nome)
// **********************************************
function ClickObjectByName(objname)
{
	var obj;
	try
	{
		obj = window.parent.frames('Application').document.getElementsByName(objname)[0];
		obj.focus();
		obj.click();
	}
	catch (e)
	{
		// Oggetto non trovato...
		ErrorMessages[ErrorMessages.length] = 'ClickByName: Object ' + objname + ' not found';
		//
		// Non so come proseguire: termino l'esecuzione del test
		ClickObject('LOGOFF');
		EndReplay();
	}
}

// **********************************************
// Fine del test
// **********************************************
function EndReplay()
{
  document.getElementById('stepname').innerHTML = 'Test ended';
	var doc = window.parent.frames('Application').document;
	//
	doc.write('<b>Test ended');
	if (AttReq < TotReq)
		doc.write(' (break after request ' + AttReq + ' out of ' + TotReq + ')');
	doc.write(': ');
	//
	// Se ci sono stati errori li dumpo
	if (ErrorMessages.length > 0)
	{
		doc.writeln(ErrorMessages.length + ' errors detected:</b><br>');
		for (var i=0; i<ErrorMessages.length; i++)
			doc.writeln('&nbsp;&nbsp;&nbsp;' + ErrorMessages[i]);
	}
	else
		doc.writeln('no errors detected.</b><br>');
	//
	// Test terminato	
	AttReq = -999;
 	defaultStatus = 'Test ended';
}

// **********************************************
// Toolbar dispatcher
// **********************************************
function HandleCommand(cmd)
{
	// Se il test è finito... la toobar è disabilitata
	if (AttReq == -999) return;
	//
  switch (cmd)
  {
    case 'PLAY': 
    	ShowStatus('Tempo Reale');
    	RunMode = 'P'; NextRequest(); 
    break;
    
    case 'FFWD': 
    	ShowStatus('Accellerato');
    	RunMode = 'F'; NextRequest(); 
    break;
    
    case 'STEP': 
    	ShowStatus('Passo Passo');
    	RunMode = 'T'; NextRequest(); RunMode = 'S'; 
    break;
    
    case 'PAUSE': 
    	ShowStatus('Pausa');
    	RunMode = 'S'; 
    break;
    
    case 'STOP': 
    	ShowStatus('Fine Test');
    	RunMode = 'S'; EndReplay(); 
    break;
  }
}

// **********************************************
// Per mostrare lo stato attuale
// **********************************************
function ShowStatus(msg)
{
  document.getElementById('status').innerHTML = msg;  
}

// **********************************************
// Chiamato quando la videata sotto è stata ricaricata
// **********************************************
function NextStep()
{
	// In play
  if (RunMode == 'P') 
  {
		// Passo alla prossima richiesta dopo un certo tempo
  	setTimeout("NextRequest();", delay);
  }
  else
  {
		// In ffwd passo subito alla prossima richiesta
  	NextRequest();
  }
}

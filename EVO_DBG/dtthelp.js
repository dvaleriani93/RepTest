// ************************************
// Pro Gamma Instant Developer
// DTT Help javascript library
// (c) 1999-2003 Pro Gamma Srl
// all rights reserved
// www.progamma.com
// ***********************************

var ItemIdx = 0;							// Indice dell'item corrente
var ReqChanged = false;				// TRUE se la richiesta corrente è cambiata
var move = 0, resize = 0;			// move o resize in corso
var oldX = -1;								// Posizione X del mouse quando comincia un'operazione di resize
var oldY = -1;								// Posizione Y del mouse quando comincia un'operazione di resize
var ActiveObj = '';						// Oggetto su cui è stato premuto il mouse
var CurrentReq = 'req';				// Richiesta attiva (normale o verifica)
var RunMode = '';							// Modo di funzionamento: E(dit), V(erify), P(lay)

var OldBorder = '';						// Usato per FlashObject (contiene il bordo prima di colorarlo)

var OverridableTimer = '';		// Contiene il target-timer da far ripartire per velocizzare
var RunningTimer = -1;				// ID del timer in esecuzione

var CommLocked = false;				// Se TRUE la toolbar è bloccata

var DelayBetweenMouseMove = 25;
var DelayBetweenChars = 70;
var MouseMoveAccel = 10;
var DelayNextReqAfterClick = 1000;
var DelayNextItemNotDefined = 5000;
var DelayBetweenItemsWhileEditing = 500;
var DelayAfterSetValueFinished = 1000;
var DelayFirstItemInPage = 500;
var MinWidthForAutoResize = 200;
var MaxWidthForAutoResize = 300;
var MinHeightForAutoResize = 100;
var MaxHeightForAutoResize = 200;
var GridSize = 4;
var MinDIVWidth = MinWidthForAutoResize;
var MinDIVHeight = MinHeightForAutoResize;
var VerifyObjs = new Array();
var VerifyObjVals = new Array();
var VerifyNextReqObj = null;

// **********************************************
// Scrive un valore in un campo (in verifica prepara l'array delle "cose da fare")
// **********************************************
function SetObjectValue(objid, newvalue)
{
	// In verify devo verificare se l'oggetto ha il valore corretto
	if (RunMode=='V')
	{
		var obj = window.parent.frames('Application').document.getElementById(objid);
		VerifyObjs[VerifyObjs.length] = obj;
		VerifyObjVals[VerifyObjVals.length] = newvalue;
		return;
	}
	//
	// In Play o Edit calcolo il delay che dovrò far partire
	var delay = DelayBetweenItemsWhileEditing;
	if (RunMode == 'P')
	{
		// In Play aspetto quanto è stato definito dal programmatore
		var itpar = document.getElementsByName('itDELAY' + ItemIdx)[0];
		delay = parseFloat(itpar.value) * 1000;
	}
	//
	// Accendo l'oggetto prima di partire
	FlashObject(objid);
	//
	// Questo timer può essere abortito dall'utente per andare più veloce
	CommLocked = false;
	OverridableTimer = 'MoveCursor(-1,-1,"' + objid + '","' + newvalue + '");';
	RunningTimer = setTimeout(OverridableTimer, delay);
	ShowStatus('In pausa...');
}

// **********************************************
// Clicca su un oggetto (in verifica memorizza l'oggetto necessario a proseguire)
// **********************************************
function ClickObject(objid)
{
	// In Verify mi segno su quale oggetto l'utente dovrà cliccare
	if (RunMode=='V')
	{
		VerifyNextReqObj = window.parent.frames('Application').document.getElementById(objid);
		//
		// Ridirigo anche l'operazione di click alla VerifyRequest che verifica se l'utente ha fatto tutto
		ChangeTarget(VerifyNextReqObj, VerifyRequest, 'VerifyRequest');
		return;
	}
	//
	// In Play o Edit calcolo il delay che dovrò far partire
	var delay = DelayBetweenItemsWhileEditing;
	if (RunMode == 'P')
	{
		// In Play aspetto quanto è stato definito dal programmatore
		var itpar = document.getElementsByName('itDELAY' + ItemIdx)[0];
		delay = parseFloat(itpar.value) * 1000;
	}
	//
	// Accendo l'oggetto prima di partire
	FlashObject(objid);
	//
	// Questo timer può essere abortito dall'utente per andare più veloce
	CommLocked = false;
	OverridableTimer = 'MoveCursor(-1,-1,"' + objid + '",null);';
	RunningTimer = setTimeout(OverridableTimer, delay);
	ShowStatus('In pausa...');
}

// **********************************************
// Accendo di rosso il bordo di un oggetto
// **********************************************
function FlashObject(objid)
{
	var obj = window.parent.frames('Application').document.getElementById(objid);
	OldBorder = obj.style.border;
	obj.style.border = '#FF0000 2px solid';
	if (obj.tagName=='INPUT' && obj.type=='image')
	{ 
	  if (obj.style.pixelWidth>0)
	  {
    	obj.style.pixelWidth -= (obj.style.pixelWidth>15 ? 6 : 2);
    	obj.style.pixelHeight -= (obj.style.pixelWidth>15 ? 6 : 2);
    }
    else
    	obj.width -= 4;
  }
}

// **********************************************
// Ripristino il bordo di un oggetto
// **********************************************
function RestoreObject(objid)
{
	var obj = window.parent.frames('Application').document.getElementById(objid);
	obj.style.border = OldBorder;
	OldBorder = '';
	if (obj.tagName=='INPUT' && obj.type=='image')
	{
	  if (obj.style.pixelWidth>0)
	  {
    	obj.style.pixelWidth += (obj.style.pixelWidth>9 ? 6 : 2);
    	obj.style.pixelHeight += (obj.style.pixelWidth>9 ? 6 : 2);
    }
    else
    	obj.width += 4;
  }
}

// **********************************************
// Muovo il cursore alla posizione targetX,targetY
// **********************************************
function MoveCursor(targetX, targetY, objid, newvalue)
{
	// newvalue può essere = null se l'operazione è un click oppure contiene il valore da scrivere nel
	// caso di una set value
	//
	// Ora il timer che mi ha portato qui per la prima volta non può più essere abortito
	OverridableTimer = '';
	RunningTimer = -1;
	CommLocked = true;	// Toolbar bloccata
	//
	var obj = window.parent.frames('Application').document.getElementById(objid);
	var curs = window.parent.frames('Application').document.getElementById('helpcurs');
	if (targetX==-1 && targetY==-1)
	{
		// Calcolo il target a cui devo arrivare
		targetX = 0;
		targetY = 0;
		for (var p = obj; p && p.tagName!='BODY'; p = p.offsetParent)
		{
			targetX += p.offsetLeft;
			targetY += p.offsetTop;
		}
		//
		curs.style.display = 'block';
		//
		if (newvalue!=null)
		{
			// E' un campo editabile... mi sposto fuori dal campo
			targetX -= curs.clientWidth/1.2;
			targetY += obj.offsetHeight/3;
		}
		else
		{
			// E' un campo cliccabile... mi sposto con la punta al centro dell'oggetto
			targetX += obj.offsetWidth/2 - (curs.clientWidth - 4);
			targetY += obj.offsetHeight/2 - 2;
		}
	}
	//
	// Calcolo di quanto mi devo spostare
	var deltaX = (targetX-curs.style.pixelLeft)/MouseMoveAccel;
	var deltaY = (targetY-curs.style.pixelTop)/MouseMoveAccel;
	//
	// Se deltaX è minore di 1 allora -> delta=1 (il pixelLeft e pixelTop non si possono incrementare di < 1)
	if (deltaX!=0 && Math.abs(deltaX)<1) deltaX = deltaX/Math.abs(deltaX);
	if (deltaY!=0 && Math.abs(deltaY)<1) deltaY = deltaY/Math.abs(deltaY);
	//
	curs.style.pixelLeft += deltaX;
	curs.style.pixelTop += deltaY;
	//
	// Se sono a più di un pixel... faccio un'altro step
	if (Math.abs(targetX-curs.style.pixelLeft)>1 || Math.abs(targetY-curs.style.pixelTop)>1)
	{
		if (newvalue==null)
			setTimeout('MoveCursor(' + targetX + ',' + targetY + ',"' + objid + '",null);', DelayBetweenMouseMove);
		else
			setTimeout('MoveCursor(' + targetX + ',' + targetY + ',"' + objid + '","' + newvalue + '");', DelayBetweenMouseMove);
	}
	else
	{
		ShowStatus('');
		//
		// Sono arrivato a destinazione
		curs.style.pixelLeft = targetX;
		curs.style.pixelTop = targetY;
		//
		// Annullo il campo e gli dò il fuoco
		obj.value = '';
		obj.focus();
		//
		// Se è un click
		if (newvalue == null)
		{
			// Rimetto a posto il bordo
			RestoreObject(objid);
			//
			obj.click();
			//
			// Passo al prossimo item
			setTimeout('HandleCommand("NEXTIT");', DelayNextReqAfterClick);
			//
			// Se sono in EDIT riattivo la toolbar
			if (RunMode == 'E')
				CommLocked = false;
		}
		else
		{
			// Faccio partire la scrittura rallentata
			setTimeout('EditText("' + objid + '", "' + newvalue + '", 1);', DelayBetweenChars);
		}
	}
}

// **********************************************
// Scrive un valore in un campo un carattere alla volta
// **********************************************
function EditText(objid, newvalue, txtidx)
{
	var obj = window.parent.frames('Application').document.getElementById(objid);
	//
	// Se devo scrivere in una checkbox... imposto il valore e basta
	if (obj.tagName == 'INPUT' && obj.type == 'checkbox')
		obj.checked = (newvalue == 'on' ? true : false);
	else
	{
		// Scrivo il prossimo carattere
		obj.value = newvalue.substr(0,txtidx);
		if (txtidx < newvalue.length)
		{
			// Se non ho ancora finito... mi richiamo per il prossimo carattere
			setTimeout('EditText("' + objid + '", "' + newvalue + '", ' + (txtidx+1) + ');', DelayBetweenChars);
			return;
		}
	}
	//
	// Finito: rimetto a posto il bordo dell'oggetto
	RestoreObject(objid);
	//
	// Se sono in play passo al prossimo item
	if (RunMode == 'P')
		setTimeout('HandleCommand("NEXTIT");', DelayAfterSetValueFinished);
	//
	// Se sono in EDIT riattivo la toolbar
	if (RunMode == 'E')
		CommLocked = false;
}

// **********************************************
// Chiamata quando il CP viene caricato
// **********************************************
function InitCP(hlpurl)
{
  window.parent.frames('Application').location.assign(hlpurl);
  //
  // Recupero il runmode e la richiesta corrente
  RunMode = document.cpform.RunMode.value;
	CurrentReq = document.cpform.CurrentReq.value;
	//
	// In Edit collego il bottoncino di HideRequest al DataChanged
	if (RunMode == 'E')
	{
		var obj = document.getElementById('hidereq');		
		obj.onclick = DataChanged;
	}
  //
  // In verifica... so già qual'è la richiesta corrente
  if (RunMode == 'V') CurrentReq = 'reqV';
}

// **********************************************
// Toolbar dispatcher
// **********************************************
function HandleCommand(cmd) {HandleCommand(cmd,false);}
function HandleCommand(cmd, fromToolbar)
{
	// Se il comando arriva dalla toolbar (generato dall'utente) e i comandi sono bloccati ritorno
	if (CommLocked && fromToolbar) return;
	//
  switch (cmd)
  {
    case 'PREVREQ': 
    	document.cpform.ReqID.value--;
    	if (RunMode=='E')
    	{
	    	FillFormItemData();
	    	FillFormData();
	    }
			var curs = window.parent.frames('Application').document.getElementById('helpcurs');
			document.cpform.curX.value = curs.style.pixelLeft;
			document.cpform.curY.value = curs.style.pixelTop;
    	document.cpform.submit();
      ItemIdx = 0;
  		RunningTimer = -1;
  		OverridableTimer = '';
    break;
    
    case 'NEXTREQ':
    	document.cpform.ReqID.value++;
    	if (RunMode=='E')
    	{
	    	FillFormItemData();
	    	FillFormData();
	    }
			var curs = window.parent.frames('Application').document.getElementById('helpcurs');
			document.cpform.curX.value = curs.style.pixelLeft;
			document.cpform.curY.value = curs.style.pixelTop;
    	document.cpform.submit();
      ItemIdx = 0;
  		RunningTimer = -1;
  		OverridableTimer = '';
  		ShowStatus('Caricamento...');
    break;
    
    case 'PREVIT':
    	if (RunningTimer != -1)
    	{
    		// Blocco il timer pendente
    		clearTimeout(RunningTimer);
    		RunningTimer = -1;
    		OverridableTimer = '';
    	}
    	//
    	if (RunMode=='E')
	    	FillFormItemData();
    	if (ItemIdx > 1) ItemIdx--;
    	RefreshItem();
    	PlayItem();
    break;

    case 'STOPIT': 
    	if (RunningTimer != -1)
    	{
    		// Blocco solo il timer corrente ma permetto di ricominciarlo
    		clearTimeout(RunningTimer);
    		RunningTimer = -1;
    	}
			ShowStatus('Fermo');
    break;
    
    case 'NEXTIT': 
    	if (RunningTimer != -1)
    	{
				ShowStatus('');
				//
    		// Blocco il timer pendente e proseguo velocemente al prossimo step
    		clearTimeout(RunningTimer);
    		//
    		CommLocked = true;
    		setTimeout(OverridableTimer, 10);
    		RunningTimer = -1;
    		OverridableTimer = '';
    		return;
    	}
	    else
    	{
    		// Se provengo da uno stop... riavvio il timer interrotto e proseguo
    		if (OverridableTimer!='')
    		{
					ShowStatus('');
					//
	    		CommLocked = true;
	    		setTimeout(OverridableTimer, 10);
	    		OverridableTimer = '';
	    		return;
    		}
    		//
	    	if (RunMode=='E')
		    	FillFormItemData();
	    	if (ItemIdx < MaxHelpItems)
	    	{
	    		ItemIdx++;
		    	RefreshItem();
		    	PlayItem();
		    }
			  else
		  	{
		  		if (RunMode=='P') 
		  		{
		  			CommLocked = true;
		  			setTimeout('HandleCommand("NEXTREQ");', DelayNextReqAfterClick);
		  		}
		  	}
		  }
	  	
    break;
    
    case 'UNDO':
    	SetRequestChanged(false);
    	document.cpform.submit();
      window.parent.frames('Application').location.search = 'WCI=IWHelp&WCE=Req';
    break;
    
    case 'REQVREQ':
			var reqdiv = window.parent.frames('Application').document.getElementById(CurrentReq + 'div');
			//
			// Dato che cambiamo richiesta, copiamo i dati nella form
			FillFormData();
			//
    	if (CurrentReq == 'req')
    		CurrentReq = 'reqV';
    	else
    		CurrentReq = 'req';
    	//
			reqdiv.style.display = 'none';
			RefreshReq(CurrentReq);
    break;

    case 'POSIT': 
    	// Piazzo l'item corrente vicino all'oggetto giusto
    	PlaceCurrentItem();
    break;
  }
}

// **********************************************
// Aggiorno i dati dell'item corrente
// **********************************************
function FillFormItemData()
{
	var obj = window.parent.frames('Application').document.getElementById('itemdiv');
	var textobj = window.parent.frames('Application').document.getElementById('iteminput');
	var delayobj = window.parent.frames('Application').document.getElementById('itemdelay');
	var hideobj = window.parent.frames('Application').document.getElementById('itemhide');
	var itpar;
	if (ItemIdx > 0)
	{
		itpar = document.getElementsByName('itTXT' + ItemIdx)[0];
		itpar.value = textobj.value;
		itpar = document.getElementsByName('itDELAY' + ItemIdx)[0];
		itpar.value = delayobj.value;
		itpar = document.getElementsByName('itX' + ItemIdx)[0];
		itpar.value = obj.style.pixelLeft;
		itpar = document.getElementsByName('itY' + ItemIdx)[0];
		itpar.value = obj.style.pixelTop;
		itpar = document.getElementsByName('itW' + ItemIdx)[0];
		itpar.value = obj.style.pixelWidth;
		itpar = document.getElementsByName('itH' + ItemIdx)[0];
		itpar.value = obj.style.pixelHeight;
		itpar = document.getElementsByName('itHIDE' + ItemIdx)[0];
		itpar.value = (hideobj.checked ? '-1' : '0');
	}
}

// **********************************************
// Aggiorno i dati della richiesta visibile
// **********************************************
function FillFormData()
{
	document.cpform.CurrentReq.value = CurrentReq;
	//
	var obj = window.parent.frames('Application').document.getElementById('reqdiv');
	if (obj.style.display != 'none')
	{
		var textobj = window.parent.frames('Application').document.getElementById('reqinput');
		var delayobj = window.parent.frames('Application').document.getElementById('reqdelay');
		document.cpform.reqTXT.value = textobj.value;
		document.cpform.reqDELAY.value = delayobj.value;
		document.cpform.reqX.value = obj.style.pixelLeft;
		document.cpform.reqY.value = obj.style.pixelTop;
		document.cpform.reqW.value = obj.style.pixelWidth;
		document.cpform.reqH.value = obj.style.pixelHeight;
	}
	//
	obj = window.parent.frames('Application').document.getElementById('reqVdiv');
	if (obj.style.display != 'none')
	{
		textobj = window.parent.frames('Application').document.getElementById('reqVinput');
		var delayobj = window.parent.frames('Application').document.getElementById('reqVdelay');
		document.cpform.reqVTXT.value = textobj.value;
		document.cpform.reqVDELAY.value = delayobj.value;
		document.cpform.reqVX.value = obj.style.pixelLeft;
		document.cpform.reqVY.value = obj.style.pixelTop;
		document.cpform.reqVW.value = obj.style.pixelWidth;
		document.cpform.reqVH.value = obj.style.pixelHeight;
	}
	//
	if (RunMode=='E' && ReqChanged) 
		document.cpform.reqCHGD.value = 1;
	else
		document.cpform.reqCHGD.value = 0;
}

// **********************************************
// Chiamata quando la videata applicativa viene caricata
// **********************************************
function NextStep() { ShowStatus(''); showPopups(); }			// Chiamata dalla videata di login
function NextRequest() { showPopups(); }	// Chiamata da ogni altra richiesta
function showPopups()
{
  // Riposiziono il cursore al punto precedente
	var curs = window.parent.frames('Application').document.getElementById('helpcurs');
	curs.style.pixelLeft = document.cpform.curX.value;
	curs.style.pixelTop = document.cpform.curY.value;
  //
  // Riporto a 0 le scroll bar
  window.parent.frames('Application').document.body.scrollLeft = 0;
  window.parent.frames('Application').document.body.scrollTop = 0;
  //
  // Tutti i target vanno alla mia funzione dummy
  ChangeAppTargets();
  //
  // Visualizzo la richiesta corrente
	RefreshReq(CurrentReq);
	//
  // Se ci sono items e non sono in verify renderizzo quello corrente
  if (MaxHelpItems>0 && RunMode!='V')
  	RefreshItem();
  //
  // Per ora... nessuna modifica pendente
  SetRequestChanged(false);
  //
  // In play mode e per le richieste successive alla prima, parto subito
	if (RunMode=='P')
	{
		// Per la prima richiesta, parto subito se il delay è diverso da 0
		var delay = parseFloat(document.getElementsByName(CurrentReq + 'DELAY')[0].value) * 1000;
		//
		if ((document.cpform.ReqID.value==1 && delay!=0) || document.cpform.ReqID.value!=1)
		{
			var req = window.parent.frames('Application').document.getElementById(CurrentReq + 'div');
			//
			CommLocked = false;
			OverridableTimer = 'HandleCommand("NEXTIT");';
			//
			// Controllo il valore minimo e avvio il timer
			if (delay <= 0) delay = 10;
	  	RunningTimer = setTimeout(OverridableTimer, delay);
			ShowStatus('In pausa...');
	  }
  	return;
  }
  //
  // In verify parto subito con la play item che mi dice quello che l'untente dovrà fare
  if (RunMode == 'V')
  {
  	// Scandisco tutta la sequenza
  	for (ItemIdx=1; ItemIdx<=MaxHelpItems; ItemIdx++)
  		PlayItem();
  	//
  	ItemIdx = 0;
  	//
		// Se in questa richiesta manca il click di qualcosa
		if (MissingClick)
		{
			// Simulo un click sul bottone di refresh
			VerifyNextReqObj = window.parent.frames('Application').document.getElementsByName('refx')[0];
			//
			// Ridirigo anche l'operazione di click alla VerifyRequest che verifica se l'utente ha fatto tutto
			ChangeTarget(VerifyNextReqObj, VerifyRequest, 'VerifyRequest');
		}
  	//
  	// Gestisco il mouse move
  	window.parent.frames('Application').document.onmousemove = MouseMove;
  	//
  	// Infine faccio partire il timer che avviserà l'utente su cosa fare se non fa niente per un po'
		var delay = parseFloat(document.getElementsByName(CurrentReq + 'DELAY')[0].value) * 1000;
  	RunningTimer = setTimeout('DummyFunction();', delay);
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
// Disegno la richiesta corrente
// **********************************************
function RefreshReq(reqname, hide)
{
	var html = '';
	var reqdiv = window.parent.frames('Application').document.getElementById(reqname + 'div');
	var reqpar = document.getElementsByName(reqname + 'X')[0];
	var reqdivW, reqdivH;
	//
  reqdiv.style.left = reqpar.value;
	reqpar = document.getElementsByName(reqname + 'Y')[0];
  reqdiv.style.top = reqpar.value;
	reqpar = document.getElementsByName(reqname + 'W')[0];
  reqdiv.style.width = reqpar.value;
  reqdivW = reqpar.value;
	reqpar = document.getElementsByName(reqname + 'H')[0];
  reqdiv.style.height = reqpar.value;
  reqdivH = reqpar.value;
  reqdiv.style.zIndex = 1;
	reqdiv.style.display = 'block';
	reqdiv.filters[0].Apply();
	reqdiv.filters[0].Play();
  //
  html = html + '<table width=100% height=100%><tr><td id="'+reqname+'top" unselectable="on" class=HelpReqTop>Introduzione' + ((reqname=='reqV' && RunMode=='E') ? ' (Verifica)' : '') + '</td></tr>';
  if (RunMode=='E')
  	html = html + '<tr><td><textarea id="' + reqname + 'input" class=HelpInputArea rows=10></textarea></td></tr>';
  html = html + '<tr><td><div class=HelpReqBody id="' + reqname + 'output" style="' + (RunMode=='E' ? 'display:none;' : '') + '"></div></td></tr>';
  if (RunMode=='E')
  {
	  html = html + '<tr><td class=HelpReqBottom>';
	  html = html + 'Attendi <input id="' + reqname + 'delay" class=HelpInputDiv> sec.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	  html = html + '<img id="' + reqname + 'show" class=HelpSwitch src="dttimg/helpswt.gif" title="Show text as html">&nbsp;&nbsp;&nbsp;';
	  html = html + '<img id="' + reqname + 'resize" class=HelpResize src="dttimg/helpres.gif" title="Resize"></td></tr>';
	}
	reqdiv.innerHTML = html;
  //
  // In EDIT mode
  if (RunMode=='E')
  {
	  // Eventi
	  reqdiv.onmousemove = MouseMove;
	  reqdiv.onmousedown = MouseDown;
	  reqdiv.onmouseup = MouseUp;
	  //
		// Inserisco il testo nella text area di input e attivo l'evento di onchange
		var reqinput = window.parent.frames('Application').document.getElementById(reqname + 'input');
		reqpar = document.getElementsByName(reqname + 'TXT')[0];
	  reqinput.value = reqpar.value;
	  reqinput.onchange = DataChanged;
		//
		// Inserisco il delay nella input area
		var reqdelay = window.parent.frames('Application').document.getElementById(reqname + 'delay');
		reqpar = document.getElementsByName(reqname + 'DELAY')[0];
	  reqdelay.value = reqpar.value;
	  reqdelay.onchange = DataChanged;
	  //
	  // Attivo il bottone di switch (IN-OUT)
		var reqshow = window.parent.frames('Application').document.getElementById(reqname + 'show');
		reqshow.onclick = SwitchView;
	}
	else
	{
		// Copio il testo nel div di output
		var reqoutput = window.parent.frames('Application').document.getElementById(reqname + 'output');
		reqpar = document.getElementsByName(reqname + 'TXT')[0];
	  reqoutput.innerHTML = reqpar.value;
	  //
	  // Se il testo è vuoto... non visializzo la richiesta
	  if (reqpar.value=='')
			reqdiv.style.display = 'none';
	}
}

// **********************************************
// Disegno l'item corrente
// **********************************************
function RefreshItem()
{
	// In Edit visualizzo il bottone di posizionamento automatico se c'è un'item selezionato
	if (RunMode == 'E')
	{
		var posit = window.parent.frames('Control').document.getElementById('posit');
		if (ItemIdx == 0)
			posit.style.display = 'none';
		else
			posit.style.display = 'inline';
	}
	//
	// Se nessun item è visibile... ritorno
	if (ItemIdx == 0) return;
	//	
	var html = '';
	var itemdiv = window.parent.frames('Application').document.getElementById('itemdiv');
	var reqdiv = window.parent.frames('Application').document.getElementById(CurrentReq + 'div');
	var reqoutput = window.parent.frames('Application').document.getElementById(CurrentReq + 'output');
	var itpar = document.getElementsByName('itX' + ItemIdx)[0];
	//
	reqdiv.style.backgroundColor="#FFFFDD";
	reqoutput.style.color="#808080";
	itemdiv.style.backgroundColor="#FFFFAA";
  itemdiv.style.left = itpar.value;
	itpar = document.getElementsByName('itY' + ItemIdx)[0];
  itemdiv.style.top = itpar.value;
	itpar = document.getElementsByName('itW' + ItemIdx)[0];
  var itemdivW = itpar.value;
  itemdiv.style.width = itpar.value;
	itpar = document.getElementsByName('itH' + ItemIdx)[0];
  var itemdivH = itpar.value;
  itemdiv.style.height = itpar.value;
  itemdiv.style.zIndex = 1;
  if (itemdiv.style.display == 'block')
  {
  	itemdiv.filters[0].Apply();
    itemdiv.style.display = 'none';
  	itemdiv.filters[0].Play();  
  }
	//
	itemdiv.filters[0].Apply();
	itemdiv.style.display = 'block';
	//
	html = '';
  html = html + '<table width=100% height=100%><tr><td id="itemtop" unselectable="on" class=HelpItemTop>Passo ' + ItemIdx + ' di ' + MaxHelpItems + '</td></tr>';
  if (RunMode=='E')
	  html = html + '<tr><td><textarea id="iteminput" class=HelpInputArea rows=10></textarea></td></tr>';
  html = html + '<tr><td><div class=HelpItemBody id="itemoutput" style="' + (RunMode=='E' ? 'display:none;' : '') + '"></div></td></tr>';
  if (RunMode=='E')
  {
	  html = html + '<tr><td class=HelpItemBottom>';
	  html = html + 'Hide <input id="itemhide" type=checkbox title="Hides/Enables the current item">&nbsp;&nbsp;&nbsp;';
	  html = html + 'Attendi <input id="itemdelay" class=HelpInputDiv> sec.&nbsp;&nbsp;';
	  html = html + '<img id="itemshow" class=HelpSwitch src="dttimg/helpswt.gif" title="Show text as html">&nbsp;&nbsp;';
	  html = html + '<img id="itemresize" class=HelpResize src="dttimg/helpres.gif" title="Resize"></td></tr>';
	}
	itemdiv.innerHTML = html;
	//
	// In EDIT mode
  if (RunMode=='E')
  {
		// Eventi
	  itemdiv.onmousemove = MouseMove;
	  itemdiv.onmousedown = MouseDown;
	  itemdiv.onmouseup = MouseUp;
	  //
		// Inserisco il testo nella text area di input
		var iteminput = window.parent.frames('Application').document.getElementById('iteminput');
		itpar = document.getElementsByName('itTXT' + ItemIdx)[0];
	  iteminput.value = itpar.value;
	  iteminput.onchange = DataChanged;
		//
		// Inserisco il delay nella input area
		var itemdelay = window.parent.frames('Application').document.getElementById('itemdelay');
		itpar = document.getElementsByName('itDELAY' + ItemIdx)[0];
	  itemdelay.value = itpar.value;
	  itemdelay.onchange = DataChanged;
	  //
	  // Inserisco il valore di HIDE
		var itemhide = window.parent.frames('Application').document.getElementById('itemhide');
		itpar = document.getElementsByName('itHIDE' + ItemIdx)[0];
	  itemhide.checked = (itpar.value == '-1' ? true : false);
	  itemhide.onclick = DataChanged;
		//
	  // Attivo il bottone di switch (IN-OUT)
		var itemshow = window.parent.frames('Application').document.getElementById('itemshow');
		itemshow.onclick = SwitchView;
	}
	else
	{
		// Copio il testo nel div di output
		var itemoutput = window.parent.frames('Application').document.getElementById('itemoutput');
		itpar = document.getElementsByName('itTXT' + ItemIdx)[0];
	  itemoutput.innerHTML = itpar.value;
	  //
	  // In Play, se il testo è vuoto, non visualizzo l'item
	  if (RunMode=='P' && itpar.value=='')
			itemdiv.style.display = 'none';
	}
	//
	itemdiv.filters[0].Play();
  //
	// Visualizzo subito il cursore
	var curs = window.parent.frames('Application').document.getElementById('helpcurs');
	curs.style.display = 'block';
	//
	// Diamo il fuoco al div (se visibile)
	if (itemdiv.style.display != 'none')
		itemdiv.focus();
}

// **********************************************
// Piazzamento e resize automatico dell'item corrente
// **********************************************
function PlaceCurrentItem()
{
	var itemdiv = window.parent.frames('Application').document.getElementById('itemdiv');
	//
	// Recupero l'ID dell'ggetto
	var targetobjGUID = document.getElementsByName('itGUID' + ItemIdx)[0].value;
	if (targetobjGUID=='') return;
	//
	// Recupero l'oggetto
	var targetobj = window.parent.frames('Application').document.getElementById(targetobjGUID);
	if (targetobj)
	{
		// Calcolo dove si trova l'oggetto destinazione
		var objX = 0;
		var objY = 0;
		for (var p = targetobj; p && p.tagName!='BODY'; p = p.offsetParent)
		{
			objX += p.offsetLeft;
			objY += p.offsetTop;
		}
		//
		// Sposto l'item verso la posizione bersaglio appena calcolata
		if (objX + targetobj.offsetWidth + 10 + itemdiv.style.pixelWidth > 1024)
		  itemdiv.style.pixelLeft = objX - itemdiv.style.pixelWidth - 10;			// Alla sinistra dell'obj
		else
		  itemdiv.style.pixelLeft = objX + targetobj.offsetWidth + 10;				// Alla destra dell'obj
  	itemdiv.style.pixelTop = objY;
  	//
		var iteminput = window.parent.frames('Application').document.getElementById('iteminput');
		var itemoutput = window.parent.frames('Application').document.getElementById('itemoutput');
		//
  	// Leggo le dimensioni correnti del div
		itemoutput.innerHTML = iteminput.value;
		//
		var oldoutputdisp = itemoutput.style.display;
		itemoutput.style.display = 'block';
  	itemoutput.parentElement.parentElement.style.display='block';
  	//
  	var oldinputdisp = iteminput.style.display;
  	iteminput.style.display = 'none';
  	iteminput.parentElement.parentElement.style.display='none';

  	var oldoutputoverflow = itemoutput.style.overflow;
  	itemoutput.style.overflow = 'auto';
  	//
  	var oldWidth = itemoutput.offsetWidth;
  	var oldHeight = itemoutput.offsetHeight;
  	//
  	// "Sblocco" il div di output così posso conoscere le dimensioni in verticale
  	itemoutput.style.overflow = 'visible';
  	//
  	// Leggo le dimensioni del div "libero"
  	var newWidth = itemoutput.offsetWidth;
  	var newHeight = itemoutput.offsetHeight;
		//
		// Se non ci sta...
  	if (newWidth>oldWidth || newHeight>oldHeight)
  	{
			// Limito le dimensioni del div
	  	if (newWidth < MinWidthForAutoResize)
	  		newWidth = MinWidthForAutoResize;
	  	if (newWidth > MaxWidthForAutoResize)
		 		newWidth = MaxWidthForAutoResize;
	  	//
	  	// Calcolo l'area e il fattore di forma
	  	var areadiv = newWidth * newHeight;
			var FormFactor = newWidth / newHeight;
	  	//
	  	// Se il fattore di forma non matcha, ricalcolo width ed height usando il fattore di forma e mantenendo costante l'area
	  	if (FormFactor<3/2 || FormFactor>2)
	  	{
	  		if (FormFactor<3/2)			// DIV troppo alto
	  		{
		  		// Allargo il DIV mantanendo l'area
					FormFactor = 3/2;
					//
					newHeight = Math.sqrt(areadiv/FormFactor);
					newWidth = areadiv / newHeight;
	  		}
	  		if (FormFactor>2)				// DIV troppo largo
	  		{
		  		// Allungo il DIV mantanendo l'area
					FormFactor = 2;
					//
					newWidth = Math.sqrt(areadiv * FormFactor);
					newHeight = areadiv / newWidth;
	  		}
			}
			//
			// Cambio le dimensioni del DIV principale
			newWidth -= newWidth%GridSize;
			newHeight -= newHeight%GridSize;
			if (newWidth!=oldWidth || newHeight!=oldHeight)
		  	ChangeItemDims('item', itemdiv.style.pixelWidth + newWidth-oldWidth, itemdiv.style.pixelHeight + newHeight-oldHeight);
		}
  	//
		// Ripristino il div
  	itemoutput.style.overflow = oldoutputoverflow;
  	iteminput.style.display = oldinputdisp;
  	iteminput.parentElement.parentElement.style.display = oldinputdisp;
		itemoutput.style.display = oldoutputdisp;
  	itemoutput.parentElement.parentElement.style.display = oldoutputdisp;
  	//
		// Controllo se ci sono ancora le scrollbars
		var ScrollSize = 32;
		ScrollSize -= ScrollSize%GridSize;
		if (itemoutput.clientHeight < itemoutput.scrollHeight)					// C'è la scollbar orizzontale
	  	ChangeItemDims('item', itemdiv.style.pixelWidth, itemdiv.style.pixelHeight+ScrollSize);
		if (itemoutput.clientWidth < itemoutput.scrollWidth) 					// C'è la scollbar verticale
	  	ChangeItemDims('item', itemdiv.style.pixelWidth+ScrollSize, itemdiv.style.pixelHeight);
		//
  	// Item spostato e ridimensionato -> richiesta cambiata
  	SetRequestChanged(true);
	}
}

// **********************************************
// Evento di MOUSE-DOWN
// **********************************************
function MouseDown()
{
	var ev = window.parent.frames('Application').event;
	var who = ev.srcElement.id;
	//
	// Questi non devono rompere
	if (who == 'reqinput' || who == 'reqoutput' || who == 'reqVinput' || who == 'reqVoutput' || who=='reqdelay'  || who=='reqVdelay' || who=='iteminput' || who=='itemoutput' || who=='itemdelay')
		return;
	//
	ActiveObj = '';
	move = 0;
	resize = 0;
	//
	// Memorizzo chi è l'oggetto attivo e gli catturo gli eventi
	if (who.substr(0, 3) == 'req')
	{
		var whichreq = 'req';
		if (who.substr(0, 4) == 'reqV')
			whichreq = 'reqV';
		var reqdiv = window.parent.frames('Application').document.getElementById(whichreq + 'div');
	  reqdiv.setCapture(true);		// Tutti gli eventi a me e solo a me!
	  ActiveObj = whichreq;
	}
	if (who.substr(0, 4) == 'item')
	{
		var itdiv = window.parent.frames('Application').document.getElementById('itemdiv');
	  itdiv.setCapture(true);		// Tutti gli eventi a me e solo a me!
	  ActiveObj = 'item';
	}
	//
	// Se ho cliccato sul bottone di resize
	if (who=='reqresize' || who=='reqVresize' || who=='itemresize')
	{
		resize = 1;
		oldX = ev.clientX;
		oldY = ev.clientY;
	}
	//
	// Se ho cliccato sul div posso muoverlo
	if (who == 'reqdiv' || who == 'reqVdiv' || who=='itemdiv' || who == 'reqtop' || who == 'reqVtop' || who=='itemtop')
	{
		move = 1;
		//
		var obj = window.parent.frames('Application').document.getElementById(ActiveObj + 'div');
		oldX = ev.clientX - obj.style.pixelLeft;
		oldY = ev.clientY - obj.style.pixelTop;
	}
}

// **********************************************
// Evento di MOUSE-UP
// **********************************************
function MouseUp()
{
	var ev = window.parent.frames('Application').event;
	var who = ev.srcElement.id;
	//
	// Termino eventuali operazioni di move o resize
	move = 0;
	resize = 0;
	ActiveObj = '';
	document.releaseCapture();
	defaultStatus = '';
}

// **********************************************
// Evento di MOUSE-MOVE
// **********************************************
function MouseMove() 
{ 
	// In verify... devo nascondere i targets degli oggetti e basta
	if (RunMode == 'V')
	{
		defaultStatus = '';
		return;
	}
	//
	var ev = window.parent.frames('Application').event;
	var who = ev.srcElement.id;
	//
	// Questi non devono rompere
	if (who == 'reqinput' || who == 'reqoutput' || who == 'reqVinput' || who == 'reqVoutput' || who=='reqdelay'  || who=='reqVdelay' || who=='iteminput' || who=='itemoutput' || who=='itemdelay')
		return;
	//
	var obj = window.parent.frames('Application').document.getElementById(ActiveObj + 'div');
	if (move)
	{
		// Calcolo la vera posizione del mouse
		var MouseX = ev.clientX;
		var MouseY = ev.clientY;
		//
		// Se c'è un move... muovo l'oggetto alla posizione del cursore
		var newLeft = MouseX - oldX;
		var newTop = MouseY - oldY;
		//
		// Se lo SHIFT non è premuto, allora griglio
		if (!ev.shiftKey)
		{
			newLeft -= newLeft%GridSize;
			newTop -= newTop%GridSize;
		}
		//
		if (newLeft>=0)
		{
			obj.style.pixelLeft = newLeft;
		  SetRequestChanged(true);
		}
		if (newTop>=0)
		{
			obj.style.pixelTop = newTop;
		  SetRequestChanged(true);
		}
		//
		defaultStatus = 'Moving to X:' + obj.style.pixelLeft + ' Y:' + obj.style.pixelTop;
	}
	//
	if (resize)
	{
		// Se c'è un resize... ridimensiono l'oggetto e tutto il suo contenuto
		var newWidth = obj.style.pixelWidth + ev.clientX - oldX;
		var newHeight = obj.style.pixelHeight + ev.clientY - oldY;
		if (newWidth > MinDIVWidth) oldX = ev.clientX;
		if (newHeight > MinDIVHeight) oldY = ev.clientY;
		//
		// Se lo SHIFT non è premuto, allora griglio
		if (!ev.shiftKey)
		{
			if (newWidth > MinDIVWidth)
			{
				oldX -= newWidth%GridSize;
				newWidth -= newWidth%GridSize;
			}
			if (newHeight > MinDIVHeight)
			{
				oldY -= newHeight%GridSize;
				newHeight -= newHeight%GridSize;
			}
		}
		//
		ChangeItemDims(ActiveObj, newWidth, newHeight);
		//
	  SetRequestChanged(true);
		//
		defaultStatus = 'Resizing to W:' + obj.style.pixelWidth + ' H:' + obj.style.pixelHeight;
	}
}

// **********************************************
// Cambia le dimensioni dell'item corrente, adattando tutti gli oggetti che contiene
// **********************************************
function ChangeItemDims(itemname, newWidth, newHeight)
{
	newWidth = Math.max(newWidth, MinDIVWidth);
	newHeight = Math.max(newHeight, MinDIVHeight);
	//
	var itemdiv = window.parent.frames('Application').document.getElementById(itemname + 'div');
	itemdiv.style.pixelWidth = newWidth;
	itemdiv.style.pixelHeight = newHeight;
	//
  return;
}

// **********************************************
// Cambio da HTML a render
// **********************************************
function SwitchView()
{
	var ev = window.parent.frames('Application').event;
	var who = ev.srcElement.id;
	//
	var obj;
	if (who.substr(0, 3) == 'req')
		obj = CurrentReq;
	if (who.substr(0, 4) == 'item')
		obj= 'item';
	var inobj = window.parent.frames('Application').document.getElementById(obj + 'input');
	var outobj = window.parent.frames('Application').document.getElementById(obj + 'output');
	//
	if (outobj.style.display == 'none')
	{
		// Attivo l'output
		outobj.style.display = 'block';
		outobj.parentElement.parentElement.style.display='block';
		inobj.style.display = 'none';
		inobj.parentElement.parentElement.style.display = 'none';
		outobj.innerHTML = inobj.value;
	}
	else
	{
		// Attivo l'input
		inobj.style.display = 'block';
		inobj.parentElement.parentElement.style.display = 'block';
		outobj.style.display = 'none';
		outobj.parentElement.parentElement.style.display='none';
	}
}

// **********************************************
// Qualcuno ha cambiato il testo di un oggetto
// **********************************************
function DataChanged()
{
	// La richiesta corrente è cambiata
	SetRequestChanged(true);
	//
	// Controllo se il testo della richiesta è vuoto... in questo caso azzero il delay
	var textobj = window.parent.frames('Application').document.getElementById(CurrentReq + 'input');
	var delayobj = window.parent.frames('Application').document.getElementById(CurrentReq + 'delay');
	if (textobj.value == '')
		delayobj.value = '0';
}

// **********************************************
// Imposto il valore di ReqChanged e visualizzo/nascondo il bottone di Undo
// **********************************************
function SetRequestChanged(newval)
{
	ReqChanged = newval;
	//
	// Solo in Edit
	if (RunMode=='E')
	{
		var undobutt = window.parent.frames('Control').document.getElementById('undoreq');
		if (ReqChanged)
			undobutt.style.display = 'inline';
		else
			undobutt.style.display = 'none';
	}
}

// **********************************************
// Cambio il target event di ogni oggetto nella videata applicativa
// **********************************************
function ChangeAppTargets()
{
  // Disabilito i click!
  window.parent.frames('Application').EnableClick = 0;
  //
  var allobj = window.parent.frames('Application').document.all;
  for(var i=0; i<allobj.length; i++)
  {
    var obj = allobj(i);
    ChangeTarget(obj, DummyFunction, 'DummyFunction');
  }
  //
  // Al termine abilito i click!
  window.parent.frames('Application').EnableClick = 1;
}

// **********************************************
// Cambia il target di un singolo oggetto alla funzione specificata
// **********************************************
function ChangeTarget(obj, targetfx, targetfxname)
{
  if (obj.tagName=='A')
  {
    if (obj.href==null || obj.href.toString().indexOf('ShowCalendar')==-1)
      obj.href='javascript:window.parent.frames(\'Control\').' + targetfxname + '();';
    else
      obj.href = obj.href.replace('javascript:ShowCalendar', 'javascript:window.parent.frames(\'Control\').ShowCal');
  }
  if (obj.tagName=='FORM')
    obj.action='javascript:window.parent.frames(\'Control\').DummyFunctionEx();';
  if (obj.tagName=='TEXTAREA')
  {
    if (RunMode=='V' && obj.onchange!=null && obj.onchange.toString().indexOf('SubmitForm')>0)
      obj.onchange=VerifyRequest;
    else
      obj.onchange=DummyFunctionEx;
  }
  if (obj.tagName=='SELECT')
  {
    if (RunMode=='V' && obj.onchange!=null && obj.onchange.toString().indexOf('SubmitForm')>0)
      obj.onchange=VerifyRequest;
    else
      obj.onchange=DummyFunctionEx;
    //
    obj.onkeyup=DummyFunctionExKeyUp;
  } 
  if (obj.tagName=='INPUT')
  {
    if (obj.type=='image')
    {
      if (RunMode=='V' && obj.onclick!=null && obj.onclick.toString().indexOf('SubmitForm')>0)
        obj.onclick=VerifyRequest;
      else
        obj.onclick=targetfx;
    }
    else if (obj.type=='radio' || obj.type=='checkbox')
    {
      if (RunMode=='V' && obj.onclick!=null && obj.onclick.toString().indexOf('SubmitForm')>0)
        obj.onclick=VerifyRequest;
      else
        obj.onclick=DummyFunctionEx;
      //
      obj.onkeyup=DummyFunctionEx;
    }
    else
    {
      if (RunMode=='V' && obj.onchange!=null && obj.onchange.toString().indexOf('SubmitForm')>0)
        obj.onchange=VerifyRequest;
      else
        obj.onchange=DummyFunctionEx;
      //
      obj.onkeyup=DummyFunctionExKeyUp;
    }
  }
  if (obj.tagName=='TD' && obj.onclick!=null)
  {
    obj.onclick=targetfx;
  }
}

// **********************************************
// Arrivo a questa funzione se l'utente clicca su un oggetto della videata applicativa
// **********************************************
function DummyFunction()
{
	// Se non sono in Verify non faccio nulla
	if (RunMode!='V') return;
	//
	// In Verify blocco il timer di inattività iniziale dell'utente
	if (RunningTimer!=-1)
	{
		clearTimeout(RunningTimer);
		RunningTimer = -1;
	}
	//
	// Incremento il numero di errori
	document.cpform.HelpErrors.value++;
	//
	// Comunico all'utente dove deve cliccare per proseguire
	FlashObject(VerifyNextReqObj.id);
	VerifyNextReqObj.focus();
	alert('Clicca sull\'oggetto selezionato per proseguire' + (VerifyNextReqObj.name == 'refx' ? ' (oppure premi il tasto ENTER)' : ''));
	RestoreObject(VerifyNextReqObj.id);
}

// **********************************************
// 
// **********************************************
function DummyFunctionEx()
{
	// Blocco il timer di inattività iniziale dell'utente
	if (RunningTimer!=-1)
	{
		clearTimeout(RunningTimer);
		RunningTimer = -1;
	}
}

function DummyFunctionExKeyUp()
{
  // Se è stato premuto il tasto ENTER simulo il click sul refresh
  try
  {
    var evt = window.parent.frames('Application').event;
    if (RunMode=='V' && evt!=null && evt.keyCode==13)
    {
      VerifyRequest();
      return;
    }
  }
  catch (e) {}
  //
  DummyFunctionEx();
}

function ShowCal(InputField, mask)
{
  // Se i click sono attivi, gestisco il calendario
	if (window.parent.frames('Application').EnableClick)
	{
  	// Blocco il timer di inattività iniziale dell'utente
  	if (RunningTimer!=-1)
  	{
  		clearTimeout(RunningTimer);
  		RunningTimer = -1;
  	}
  	//
  	// Apro il calendario
    window.parent.frames('Application').ShowCalendar(InputField, mask);
  }
}

function HandleCommandEx()
{
	if (RunningTimer!=-1)
	{
		clearTimeout(RunningTimer);
		RunningTimer = -1;
	}
}

// **********************************************
// Verifico se l'utente ha fatto tutto quello che doveva
// **********************************************
function VerifyRequest()
{
	// Blocco il timer di inattività iniziale dell'utente
	if (RunningTimer!=-1)
	{
		clearTimeout(RunningTimer);
		RunningTimer = -1;
	}
	//
	// Per tutti gli oggetti nella lista di cose da fare
	for (var i=0; i<VerifyObjs.length; i++)
	{
		var obj = VerifyObjs[i];
		var newval = VerifyObjVals[i];
		//
		// Se il valore non è quello giusto
		if (obj.value != newval)
		{
			// Incremento il numero di errori
			document.cpform.HelpErrors.value++;
			//
			// Comunico all'utente cosa deve fare
			obj.focus();
			FlashObject(obj.id);
			alert('Imposta il valore del campo selezionato a ' + newval);
			RestoreObject(obj.id);
			return;
		}
	}
	//
	// Tutto OK. Passo alla prossima richiesta
	HandleCommand('NEXTREQ');
}

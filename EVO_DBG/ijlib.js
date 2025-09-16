// ************************************
// Pro Gamma Instant Developer
// javascript library
// (c) 1999-2007 Pro Gamma Srl
// all rights reserved
// www.progamma.com
// ***********************************

var ChgObj= new Array(); // Array oggetti modificati
var ClickedObj=0;        // Il pulsante cliccato
var XClick=1;            // Posizione del click
var YClick=1;
var SK=false;      	     // Stato di Shift, Ctrl, Alt
var CK=false;
var AK=false;
var t1,t2;               // Time-span per il cambio pagina
var EnableClick=0;       // Mi dice se è possibile abilitare i click
var LatchID=0;           // Numero del timer per lasciar cliccare
var DelaySec=5;          // Numero di secondi dopo i quali appare la dialog di delay
var DelayID=0;           // Timeout da cancellare nella nextrd...
var RefreshID=0;         // Numero del timer per il refresh interval

var ChangeRowDelay=800;  // Numero di ms dopo i quali viene cambiata in automatico la riga del pannello
var ChangeRowID = 0;     // Timer cambio riga

// Variabili di controllo per tasti web
var ActiveFrame = 1;     // Frame attualmente attivo
var ActiveRow   = -1;    // Oggetto non riconosciuto
var ActiveCol   = -1;    // Oggetto non riconosciutof
var StdFK= new Array();  // Array associazioni FK standard
var CstFK= new Array();  // Array associazioni FK relative al contesto corrente
var StdFKInit = false;   // Flag che indica se le associazioni standard sono state abilitate
var UseFK = true;        // Flag che indica se utilizzare gli FK o meno
var UseDBLCLK = true;    // Flag che indica se utilizzare il doppio click
var SAPos= new Array();  // Posizioni splitter
var ComboOpen = false;   // Vero se una combo è aperta
var PANPosX= new Array();// Posizioni scrollbars pannelli (coord X)
var PANPosY= new Array();// Posizioni scrollbars pannelli (coord Y)

var LastActiveElement;   // Ultimo oggetto reso attivo
var LastActiveControl;   // Ultimo oggetto reso attivo/per PB
var LastBkCol;           // Colore sfondo ultimo campo reso attivo
var LastBkFlt;           // Filtro ultimo campo reso attivo
var HLColorED="";				 // Colore Editing per campi editabili
var HLColorEDFlt="";		 // Filtro per campi editabili
var btw, bbw, blw, brw;  // Larghezze dei bordi dell'oggetto reso attivo
var StrictHTML = false;  // Indica se l'HTML prodotto segue le specifiche "HTML 4.01 Strict"

var fn1= new Array();    // RD2 array nomi campi/valori
var fv1= new Array();    // RD2 array valori campi
var fn2= new Array();    // RD2 array nomi campi/campi
var fv2= new Array();    // RD2 array campi
var chtall = true;       // RD2 change all targets
var cht= new Array();    // RD2 change only some targets

var ScrTim1 = -1; // Timer Scrollamento pannello
var ScrTim2 = -1; // Timer Scrollamento pannello
var pbtimer = -1; // Timer gestione campi ACTIVE
var ScrSem  = false; // Semaforo Aggiornamento Scrollbar

var ActiveObjects = new Array(); // Gestione ActiveElements multi browser
var ModWnd = null; // Per gestione popup modali FFX
var ModIdx = 0;    // Indice Finestra di popup aperta

var RD3_Glb = null;


// **********************************************
// Applica il rendering differenziale
// **********************************************
function ExpandIDTag(html)
{
	var s,ex,i;
	//
	var tka = html.split("§~");
	var z= tka.length;
	for (i=1; i<z;i+=2) // Salto il primo che non ha il separatore
	{
		var hh = tka[i];
		//
		// Vediamo se è un token valido
		var n=parseInt(hh.charAt(0),10);
		if (n>=0 && n<=3) // && hh.length<21)
		{
			s="";
			// ok... macrosostituisco
			//
			if (n==3)
				s="<input type=image src=images/rs.gif"
			// classe
			var vsi=(hh.charCodeAt(1)-40)*85+(hh.charCodeAt(2)-40);
			if (vsi>0)
				s+=" class=VSV" + vsi;
			else
				s+=" class=PanRS";
			//
			// inizio stile
			if (n==0)
				s+=" style=\"z-index:1;";
			if (n==1 || n==3)
				s+=" style=\"";
			if (n==2)
				s+=" style=\"";
			//
			// dimensioni
			var vn=(hh.charCodeAt(3)-40)*85+(hh.charCodeAt(4)-40);
			if (vn>0)
				s+="left:"+vn+"px;";
			vn=(hh.charCodeAt(5)-40)*85+(hh.charCodeAt(6)-40);
			if (vn>0)
				s+="top:"+vn+"px;";
			vn=(hh.charCodeAt(7)-40)*85+(hh.charCodeAt(8)-40);
			if (vn>0)
				s+="width:"+vn+"px;";
			vn=(hh.charCodeAt(9)-40)*85+(hh.charCodeAt(10)-40);
			if (vn>0)
				s+="height:"+vn+"px;";
			ex=hh.substr(11);
			if (n==3)
			{
				s+="\" name="+ex+">";
			}
			else
			{
		    // Gestisco il colore di background: può essere 'n' (transparent) o '#RRGGBB' per colore
			  if (ex.length>0 && ex.substr(0,1)=="b")
			  {
					s+="background-color:";
			    if (ex.substring(1,1)=="n")
			    {
						s+="trasparent;";
						ex=ex.substr(2);
					}
					else
					{
						s+=ex.substr(1,7)+";";
						ex=ex.substr(8);
					}
			  }
			  // Gestisco il gradiente ('#RRGGBB#rrggbbD' per gradiente con direzione D tra i colori RRGGBB e rrggbb)
			  // e l'opacity ('NN')
			  if (ex.length>0 && ex.substr(0,1)=="f")
				{
				  if (ex.substr(1,1)=="n")
				  {
				    s+="filter:none;"
				    ex=ex.substr(2);
				  }
  				else
				  {
				    if (ex.substr(1,1)=="#")
				    {
  				    var gr1=ex.substr(1,7);
  				    var gr2=ex.substr(8,7);
  				    var grd=ex.substr(15,1);
  				    s+="filter:progid:DXImageTransform.Microsoft.Gradient(GradientType="+grd+",StartColorStr="+gr1+",EndColorStr="+gr2+");"
  				    ex=ex.substr(16);
				    }
  				  else
				    {
				      var opa = ex.substr(1,2);
  				    s+="filter:Alpha(opacity=" + opa + ");";
  				    ex=ex.substr(3);
  				  }
				  }
				}
				if (ex.indexOf("o")>-1)
					s+="overflow:auto;";
				if (ex.indexOf("r")>-1)
					s+="text-align:right;";
				s+="\"";
				if (n==2 && ex.indexOf("o")==-1)
					s+=" nowrap ";
			}
			//
			tka[i] =s;
		}
	}
	if (tka.length>1)
	{
		html = tka.join("");
	}	
	//
	return html;
}


// **********************************************
// Applica il rendering differenziale
// **********************************************
function ApplyHTML(j, h)
{
	// Macro espando gli IDToken contenuti in h
	//window.defaultStatus='Applico HTML a: ' + j;
	//
	window.defaultStatus = j;
	var f1 = GetFrame(window.parent.frames,'Main');
	//
	// Azzero array posizioni se cambio la form attiva
	if (j=="ActiveForm")
	{
		f1.SAPos=new Array();
		f1.PANPosX=new Array();
		f1.PANPosY=new Array();
	}
	//
	h = ExpandIDTag(h);
	//
	// Estraggo gli script eventualmente contenuti e li eseguo dopo
	RunScript(h);
	//
	try
	{
		var d = f1.document;
		var o = d.getElementById(j);
		//
		if (o.tagName=='LI')
		{
			var p = GetParentElement(o);
			if (f1.cht.length==0 || f1.cht[f1.cht.length-1]!=p);
				f1.cht[f1.cht.length]=p; // Registro che dovrò cambiare questa parte di target
			SetOuterHTML(o,h);
		}
		else
		{
			o.innerHTML=h;
			f1.cht[f1.cht.length]=o; // Registro che dovrò cambiare questa parte di target
		}
	}
	catch(e) {};
	//
	//window.defaultStatus='Applicazione HTML: OK';
}


// ***************************************************
// Un oggetto è stato cambiato, lo aggiungo alla lista
// ***************************************************
function RegChgObj(obj)
{
	var i;
	var b=false;
	var z = ChgObj.length;
	for(i = 0; i < z; i++)
	{
		if (ChgObj[i]==obj)
		{
			b=true;
			break;
		}
		if (ChgObj[i].name==obj.name) // stesso nome per i radio...
		{
			ChgObj[i]=obj;
			b=true;
			break;
		}
	}
	if (!b)
	{
		ChgObj[z]=obj;
	}
	if (obj.getAttribute("isactive")=='')
	{
    // Campo attivo - solo se click attivati
    var f1 = GetFrame(window.parent.frames,"Main");
		if (f1.EnableClick==1 && f1.pbtimer==-1)
		{
		  // Ritardo il submit poiché potrebbe esserci un click pendente su uno dei tasti
		  if (document.dockform)
		  {
		    // C'è, a video, una form dockata... Vediamo se il campo attivo ne fa parte
		    var o = obj;
		    while (o && o!=document.dockform)
		      o = o.parentNode;
  		  f1.pbtimer = f1.setTimeout("pb('" + (o ? '&WCU=dock' : '') + "')", 150);
		  }
  		else
  		  f1.pbtimer = f1.setTimeout("pb('')", 150);
		}
	}
}


// ***************************************************
// Un oggetto è stato cambiato, lo aggiungo alla lista
// ***************************************************
function ChangeHandler(evento)
{
	if (document.all) 
		RegChgObj(GetFrame(window.parent.frames,"Main").event.srcElement);
	else 
		RegChgObj(evento.target);
}


// ***************************************************
// Gestione complessiva del fuoco fra campi
// ***************************************************
function FocusHandler(evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	LastActiveElement = window.event ? f1.event.srcElement : evento.target;
	f1.ActiveObjects[f1.document] = LastActiveElement;
	LastActiveControl = LastActiveElement;
	var s=LastActiveElement.onkeydown+"";
	if (s.indexOf("idro")<=0 && LastActiveElement.tagName=="INPUT" && LastActiveElement.type!="radio")
	{
	  if (HLColorEDFlt!="")
	  {
	    LastBkFlt=LastActiveElement.style.filter;
	    LastActiveElement.style.filter=HLColorEDFlt;
	  }
		else if (HLColorED!="" && HLColorED!="transparent")
		{
			LastBkCol=LastActiveElement.style.backgroundColor;
			LastActiveElement.style.backgroundColor=HLColorED;
			//
			// Salvo anche il filtro... altrimenti copre il colore di background
	    LastBkFlt=LastActiveElement.style.filter;
	    LastActiveElement.style.filter="";
		}
		else
		{
			btw=GetStyleProp(LastActiveElement,"borderTopWidth");
			bbw=GetStyleProp(LastActiveElement,"borderBottomWidth");
			blw=GetStyleProp(LastActiveElement,"borderLeftWidth");
			brw=GetStyleProp(LastActiveElement,"borderRightWidth");
			LastActiveElement.style.borderWidth=2;
			if (f1.StrictHTML && LastActiveElement.type!="checkbox")
			{
			  LastActiveElement.style.pixelWidth -= 2;
			  LastActiveElement.style.pixelHeight -= 2;
			}
		}	
	}
	if (f1.t2==null || (new Date()).getTime()-f1.t2.getTime()>1000)
	{
		if (LastActiveElement.title!="")
			window.defaultStatus = LastActiveElement.title;
		else
		{
			// Tento di recuperare il title dell'header...
			try
			{
				var cp = LastActiveElement.name.indexOf("C");
				var rp = LastActiveElement.name.indexOf("R");
				var s = LastActiveElement.name.substr(0,rp); s = s.substr(0,cp) + "H" + s.substr(cp+1);
				var obj = f1.document.getElementById(s);
				window.defaultStatus = obj.title;
			}
			catch(ex) { }
		}
	}
	//
	// Gestione cambio riga automatico
	f1.GetActiveFrame(LastActiveElement.name);
	var pc = f1.document.getElementById("PC"+f1.ActiveFrame);
	var attr = (pc==null ? null : pc.getAttribute("actrow"));
	if (f1.ActiveRow>=0 && attr!=null && f1.ChangeRowDelay>0)
	{
		if (f1.ChangeRowID!=0)
			f1.clearTimeout(f1.ChangeRowID);
		if (attr!=f1.ActiveRow)
			f1.ChangeRowID = f1.setTimeout("ChangeRowHandler()",f1.ChangeRowDelay);
	}
}

function ChangeRowHandler()
{
	var f1 = GetFrame(window.parent.frames,"Main");
	if (f1.ComboOpen)
	{
		f1.ChangeRowID = f1.setTimeout("ChangeRowHandler()",f1.ChangeRowDelay);
	}
	else
	{
		f1.pb("");
	}
}

function BlurHandler(evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	var eve = f1.event ? f1.event : evento;
	try
	{
		if (LastActiveElement!=null && LastActiveElement.tagName=="INPUT" && LastActiveElement.type!="radio")
		{
			var s=LastActiveElement.onkeydown+"";
			if (s.indexOf("idro")<=0)
			{
	  	  if (HLColorEDFlt!="")
    	    LastActiveElement.style.filter=LastBkFlt;
				else if (HLColorED!="" && HLColorED!="transparent")
				{
					LastActiveElement.style.backgroundColor=LastBkCol;
    			//
    			// Ripristino anche il filtro... altrimenti copre il colore di background
    	    LastActiveElement.style.filter=LastBkFlt;
				}
				else
				{
					btw=LastActiveElement.style.borderTopWidth=btw;
					bbw=LastActiveElement.style.borderBottomWidth=bbw;
					blw=LastActiveElement.style.borderLeftWidth=blw;
					brw=LastActiveElement.style.borderRightWidth=brw;
					if (f1.StrictHTML && LastActiveElement.type!="checkbox")
	  			{
	  			  LastActiveElement.style.pixelWidth += 2;
	  			  LastActiveElement.style.pixelHeight += 2;
	  			}
				}
			}
		}
	}
	catch(ex){}
	//
	LastActiveElement = null;
	if (!eve.altKey)
		f1.ComboOpen=false;
	if (f1.t2==null || (new Date()).getTime()-f1.t2.getTime()>1000)
		window.defaultStatus = "Premi F1 per visualizzare la guida in linea.";
}


// ***************************************************
// Memorizzo l'oggetto che è stato cliccato, per
// includerlo nei dati di postback
// ***************************************************
function ClickHandler(evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	var eve = f1.event ? f1.event : evento;
	//
	if (f1.EnableClick!=1)
		return false; // disabilito click se click non attivi
	//
	var srcElement = eve.srcElement ? eve.srcElement : eve.currentTarget;
	var s=(srcElement.getAttribute("isactive")==undefined ? "" : srcElement.getAttribute("isactive"));
	if (s.length>3 && !window.confirm(s))
  {
	  f1.ClickedObj = 0;  // l'utente non ha confermato: annullo l'azione
		return false;
	}
	//
	f1.ClickedObj=srcElement;
  if (f1.ClickedObj.tagName == 'AREA')
    f1.ClickedObj = f1.ClickedObj.parentNode.parentNode;
  //
	XClick=f1.event ? eve.offsetX : eve.layerX;
	YClick=f1.event ? eve.offsetY : eve.layerY;
	f1.SK = eve.shiftKey;
	f1.CK = eve.ctrlKey;
	f1.AK = eve.altKey;
	return true;
}


// ***************************************************
// Gestisco pressione tasto enter
// ***************************************************
function KeyHandler(evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	var eve = f1.event ? f1.event : evento;
	//
	var src = eve.srcElement? eve.srcElement : eve.currentTarget;
	var code = eve.keyCode? eve.keyCode : eve.charCode;
	//
	if (code==13)
	{
		// Pressione tasto ENTER: eseguo submit
		ChangeHandler(evento); // Non so se è cambiato, lo aggiungo comunque.
		if (pbtimer==-1)
		{
			if (src.id == "cmdcode")
				pb("");
			else
				src.form.submit();
		}
		return false;
	}
	return true;
}


// ***************************************************
// Gestisco pressione tasto enter su form
// ***************************************************
function FormKeyHandler(evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	var eve = f1.event ? f1.event : evento;
	var code = evento.keyCode? evento.keyCode : evento.charCode;
	var ok = true;
	//
	if (code==13)
	{
		ok = false;
		try
		{
			if (document.all)
			{
				if (f1.document.activeElement.tagName=='TEXTAREA')
					ok=true; // E' possibile premere ENTER su Text Area
			}
			else
			{
				if (evento.target.tagName=='TEXTAREA')
					ok=true; // E' possibile premere ENTER su Text Area
			}
		}
		catch(ex)
		{
		}
	}
	return ok;
}


// ***************************************************
// Imposta il fuoco nell'oggetto indicato
// ***************************************************
function SetFocus(n)
{
  // Se il documento non ha il fuoco... forse è una finestra
  // di explorer che non ha il fuoco... meglio non darglielo se non l'aveva
  // Safari non ha definita la hasFocus
  if (window.parent.document.hasFocus)
    if (!window.parent.document.hasFocus())
      return;
  //
	try
	{
		var obj;
		var f1 = GetFrame(window.parent.frames,"Main");
		var d = f1.document;
		var objCol = d.getElementsByName(n);
		if (objCol.length>0)
			obj = objCol[0];
		else
		{
			// Cerco qualcuno a cui dare il fuoco nel frame attivo...
			if (ActiveFrame>0 && ActiveCol>=0)
				objCol = d.getElementsByName('F'+ActiveFrame+'C'+ActiveCol+'R0');
		}
		//
		if (objCol.length>0)
			obj = objCol[0];
		else
		{
			// Tento di cambiare frame
			if (f1.UseFK)
			{
				ChangeActiveFrame(0);
				if (ActiveFrame>0 && ActiveCol>=0)
					objCol = d.getElementsByName('F'+ActiveFrame+'C'+ActiveCol+'R0');        
			}
		}
		if (objCol.length>0)
			obj = objCol[0];
		//
		f1.ActiveObjects[d]=obj;
		//
		// Gestisco il fuoco solo se non devo mostrare una popup
		if (PopupObj==null)
		{
  		obj.focus(); // Se no i campi masked prendono il fuoco
  		obj.blur();  // ma non mostrano il cursore lampeggiante
  		obj.focus(); // 
  	}
    else
      popupshow();
		//
		return;
	}
	catch(e) { };
	//
	// Gestisco il fuoco solo se non devo mostrare una popup
	if (PopupObj==null)
	{
  	// Se non sono riuscito a dare il fuoco, tento con il cmdcode
  	try
  	{
  		var f1 = GetFrame(window.parent.frames,"Main");
  		var d = f1.document;
  		var obj = d.getElementById('cmdcode');
  		f1.ActiveObjects[d]=obj;
  		obj.focus();
  	}
  	catch(e) { };
  }
  else
    popupshow();
}


// ***************************************************
// Aggiusta l'HTML prodotto dal server in modo che sia
// adatto al rendering differenziale
// ***************************************************
function ChangeTarget()
{
	var f1 = GetFrame(window.parent.frames,"Main");
	var browser = document.all ? 1 : 2;
	//
	// Chiamo il changetarget sempre dal lato MAIN...
	if(window.name=="RD")
	{
		if (f1!=undefined && f1.ChangeTarget!=undefined)
		  f1.ChangeTarget();
		return ;
	}
	//
	var oldst=window.defaultStatus;
	//	
	var f=GetFrame(window.parent.frames,'RD').document.getElementById('theform');
	var rdn = IsUndefined(f);
	//
	// calcolo elementi da aggiornare
	if (chtall)
	{
		cht = new Array();
		cht[0]=document;
	}
	//
	t1=new Date();
	var UseFK = UseFK;
	var UseDB = UseDBLCLK;
	//
	var j=0,zz=0;
	var zt = cht.length;
	for (j=0;j<zt;j++)
	{
		var c,z;
		try
		{
			c = cht[j].all ? cht[j].all : GetAll(cht[j]);
			z = c.length;
		}
		catch(ex)
		{
			z=0;
		}
		//
  	// Reset del modulo di D&D
  	if (cht[j]==document || cht[j].id=="ActiveForm")
    	ResetDD('');
    else
    {
      // Risalgo la catena del DOM finchè trovo un oggetto il cui id comincia con 'F'
      var oo=cht[j];
      while (oo && (oo.id==undefined || oo.id.substring(0,1)!='F'))
        oo = oo.parentNode;
      //
      // Se è della forma F#I# allora è un FrameContainer
      if (oo && oo.id.indexOf('I')>0)
        ResetDD('F' + oo.id.substring(oo.id.indexOf('I')+1) + 'B');
    }
    //
		var i;
		zz=zz+z;
		for(i = 0; i < z; i++)
		{
			var o=c[i];
			var tn=o.tagName;
			var ak = "";
			try
			{
				ak=o.getAttribute("isactive");
			}
			catch(ex) {}
			//
			switch (tn)
			{
				case 'A': // Hyperlink
				case 'AREA': // Mappa di zone cliccabili
				//
				// Tutti gli hyperlink che non aprono un altra finestra (target="")...
				if (o.target=='' || o.target=='RD')
				{
					var anj = o.href.substr(0,4)!='java';
					if (rdn) // In questo caso il frame RD non è ancora stato inizializzato
					{
						if (anj && ak!="no") // Se non ha un java script lo redirigo sull'altro frame
							o.target = 'RD';
					}
					else
					{
						// Il frame RD è già stato inizializzato, allora uso l'RD completo
						if (anj && ak!="no")
						{
							var s=o.href;
							var p=s.indexOf('?');
							o.href='javascript:pb("'+s.substr(p+1)+'")';
							AddFKTip(o);
						}
					}
					//
					// Per D&D di nodi di alberi
					if (ak=='')
					{
						o.setAttribute("onmousedown", (browser==1)? new Function("onmousedown", "return TreeMouseDown(event)") : "return TreeMouseDown(event)");
						o.setAttribute("ondragstart", (browser==1)? new Function("ondragstart", "return TreeDragStart(event)") : "return TreeDragStart(event)");
						o.setAttribute("ondragenter", (browser==1)? new Function("ondragenter", "return TreeDragOver(event)")  : "return TreeDragOver(event)");
						o.setAttribute("ondragover",  (browser==1)? new Function("ondragover",  "return TreeDragOver(event)")  : "return TreeDragOver(event)");
						o.setAttribute("ondragend",   (browser==1)? new Function("ondragend",   "return TreeDragEnd(event)")   : "return TreeDragEnd(event)");
						o.setAttribute("ondrop",      (browser==1)? new Function("ondrop",      "return TreeDrop(event)")      : "return TreeDrop(event)");
					}
					else
					{
					  if (o.onclick==undefined)
					  	o.setAttribute("onclick", (browser==1)? new Function("onclick", "return ClickHandler(event)") : "return ClickHandler(event)");
					}
				}
				break;
				
				case 'INPUT':
				{
					var ot=o.type;
					if (ot=='image' || ot=='submit')
					{
					  o.setAttribute("onclick", (browser==1)? new Function("onclick", "return ClickHandler(event)") : "return ClickHandler(event)");
						AddFKTip(o);
					}
					else if (ot=='radio' || ot=='checkbox')
					{
					  o.setAttribute("onclick", (browser==1)? new Function("onclick", "return ChangeHandler(event)") : "return ChangeHandler(event)");
					  o.setAttribute("onkeypress", (browser==1)? new Function("onkeypress", "return KeyHandler(event)") : "return KeyHandler(event)");
						//
						// Questo è necessario anche per i radio
						// così è possibile comunicare correttamente
						// al server quale oggetto era attivo
						if (o.onfocus==null)
							o.setAttribute("onfocus", (browser==1)? new Function("onfocus", "return FocusHandler(event)") : "return FocusHandler(event)");
						if (o.onblur==null)
							o.setAttribute("onblur", (browser==1)? new Function("onblur", "return BlurHandler(event)") : "return BlurHandler(event)");
					}
					else if (ot=='hidden')
					{
						if (o.id.substr(0,3)=="FCK") // Registro subito che è cambiato!
							RegChgObj(o);
					}
					else
					{
						//o.onkeypress=KeyHandler;
						o.setAttribute("onchange", (browser==1)? new Function("onchange", "return ChangeHandler(event)") : "return ChangeHandler(event)");
					  o.setAttribute("onkeypress", (browser==1)? new Function("onkeypress", "return KeyHandler(event)") : "return KeyHandler(event)");
						if (UseDB)
							o.setAttribute("ondblclick", (browser==1)? new Function("ondblclick", "return DblHandler(event)") : "return DblHandler(event)");
						if (o.name!='cmd')
						{
							if (o.onfocus==null)
								o.setAttribute("onfocus", (browser==1)? new Function("onfocus", "return FocusHandler(event)") : "return FocusHandler(event)");
							if (o.onblur==null)
								o.setAttribute("onblur", (browser==1)? new Function("onblur", "return BlurHandler(event)") : "return BlurHandler(event)");
						}
					}
				}
				break;
				
				case 'FORM':
				o.setAttribute("onkeypress", (browser==1)? new Function("onkeypress", "return FormKeyHandler(event)") : "return FormKeyHandler(event)");
				if (o.action.substr(0,4)!='java')
			  {
					var s=o.action;
					var p=s.indexOf('?');
					s=s.substr(p+1);
					if (rdn || o.encoding=='multipart/form-data') // Uploading
					{
						o.target = 'RD';
						if (o.encoding=='multipart/form-data')
						{
							// Segnalo che non devo effettuare l'evento di unload
							GetFrame(window.parent.frames,'Main').WasClosed=1;
							GetFrame(window.parent.frames,'RD').WasClosed=1;
						}
					}
					else
					{
						o.action='javascript:pb("'+s+'")';
					}
				}
				break;
				
				case 'TEXTAREA':
					o.setAttribute("onchange", (browser==1)? new Function("onchange", "return ChangeHandler(event)") : "return ChangeHandler(event)");
					o.setAttribute("onfocus", (browser==1)? new Function("onfocus", "return FocusHandler(event)") : "return FocusHandler(event)");
					o.setAttribute("onblur", (browser==1)? new Function("onblur", "return BlurHandler(event)") : "return BlurHandler(event)");				
				break;
				
				case 'SELECT':
					o.setAttribute("onchange", (browser==1)? new Function("onchange", "return ChangeHandler(event)") : "return ChangeHandler(event)");
					o.setAttribute("onfocus", (browser==1)? new Function("onfocus", "return FocusHandler(event)") : "return FocusHandler(event)");
					o.setAttribute("onblur", (browser==1)? new Function("onblur", "return BlurHandler(event)") : "return BlurHandler(event)");				
					o.setAttribute("onkeypress", (browser==1)? new Function("onkeypress", "return KeyHandler(event)") : "return KeyHandler(event)");					
					if (ak=="R")
						RegChgObj(o);
				break;			
				
				case 'DIV': // DIV di book (D&D and Transform)
					if (ak!=undefined && ak.indexOf('A')!=-1)
					  AddDrag(o);
					if (ak!=undefined && ak.indexOf('O')!=-1)
					  AddDrop(o);
					if (ak!=undefined && ak.indexOf('T')!=-1)
					  AddTrans(o);
				break;
			}
		}
	}
	//
	chtall = rdn;
	cht = new Array();
	t2=new Date();
	//
	// Fine della Reset D&D
	EndResetDD();
	//
	if ((zz>0 && t2-t1>99) || false)
	{
		var n=zz/(t2-t1);
		window.defaultStatus=oldst+", NC="+zz+", TC:"+(t2-t1)+", PI:"+n.toFixed(0);
	}
	else
	{
		window.defaultStatus=oldst;
	}
	//
	// Al termine abilito i click!
	//EnableClick=1;
}


// ***************************************************
// Utile senza RD per manterere il focus
// ***************************************************
function SubmitForm()
{
	var f;
	try
	{
		f=document.getElementsByName("theform")[0];
		var x=f.name; // error if f is undefined
	}
	catch(r)
	{
		f=document.dockform;
	}
	try
	{
		if (f.ACE.value.length==0) 
			f.ACE.value = GetActiveElement(document).name;
		f.SCT.value = document.body.scrollTop;
	}
	catch(r)
	{
	}
}


// ***************************************************
// Esegue il postback dei dati al server tramite il
// frame RD
// ***************************************************
function pb(ss)
{
	var i;
	var s="";
	var f1 = GetFrame(window.parent.frames,"Main");
	var SaveActiveElement = true;

	// Spegno eventuali popup rimasti aperti
	var ppm = f1.document.getElementById("PopupMenu");
	if (ppm!=null)
		ppm.style.visibility = "hidden";
	//
	if (f1.ChangeRowID!=0)
		f1.clearTimeout(f1.ChangeRowID);
	f1.ChangeRowID = 0;
	if (f1.RefreshID!=0)
		f1.clearTimeout(f1.RefreshID);
	f1.RefreshID=0;
	f1.ScrTim1 = -1;
	f1.pbtimer = -1;
	//
	if (f1.EnableClick==3)
	{
		SaveActiveElement=false;
		f1.EnableClick=1;
	}
	if (f1.EnableClick==2)
	{
		window.defaultStatus='Ricaricamento in corso...';
		f1.EnableClick=0;
		top.location.reload(true);
		return;
	}
	if (f1.EnableClick!=1)
	{
		window.defaultStatus='Sto ancora aspettando i dati...';
		return;
	}
	//
	window.defaultStatus='Attendere...';
	f1.document.body.style.cursor='progress';
	if (ss.indexOf('IWBlob')==-1)
	{
		// Non disabilito in caso di download blob...
		// potrebbe non apparire in una nuova finestra
		f1.EnableClick=0;
	}
	else
	{
		// Durante lo scaricamento di un blob inline, potrebbe venirmi a mancare
		// il window.parent... in questo caso è utile un timer che me lo ricarichi.
		window.parent.setTimeout('location.href="'+window.parent.location.href+'"',10000);
	}
	//
	// ACE = active element (utile in caso di pressione tasto ENTER)
	var d;
	try // Può dare errore nel caso di back del browser
	{
		d=GetFrame(window.parent.frames,'RD').document;
	}
	catch(ex)
	{
		window.defaultStatus='Ricaricamento in corso...';
		f1.EnableClick=0;
		top.location.reload(true);
		return;
	}
	//
	try
	{
		var dd=GetActiveElement(f1.document);
		//
		if (!IsUndefined(dd))
		{
			try
			{
				if (SaveActiveElement)
				{
					if ((dd.tagName=='INPUT' || dd.tagName=='TEXTAREA') && dd.id!='cmdcode')
					{
						// Verifico che non sia un pulsante di attivazione, nel caso il fuoco andrà nel campo corrispondente
						if (dd.type=='image' && dd.name.substr(0,1)=="A")
						{
							var objCol = f1.document.getElementsByName("F"+dd.name.substring(1));
							if (objCol.length>0)
								d.getElementById('ace').value="F"+dd.name.substring(1);
							else
							{
								// Avrò cliccato su un campo statico...
								// passo il precedente campo attivato
								if (!IsUndefined(f1.LastActiveControl))
									d.getElementById('ace').value=f1.LastActiveControl.name;								
							}
						}					
						else if (dd.type!='image' && dd.type!='submit')
						{
							d.getElementById('ace').value=dd.name;		
							f1.RegChgObj(dd);
						}
						else
						{
							// Registro l'oggetto LASTACTIVE se c'è
							if (!IsUndefined(f1.LastActiveControl))
								d.getElementById('ace').value=f1.LastActiveControl.name;	
						}
					}
					if (dd.tagName=='SELECT')
					{
						d.getElementById('ace').value=dd.name;		
						f1.RegChgObj(dd);
					}				
					if (dd.tagName=='A')
					{
            if (!IsUndefined(f1.LastActiveControl))
              d.getElementById('ace').value=f1.LastActiveControl.name;
          }
				}
				dd.onblur(); // Così se aveva la maschera, viene fatto l'unmask. Deve essere fatto prima di raccolgiere i valori degli oggetti
				dd.blur();
			}
			catch(ex)
			{
			}
		}
		//
		// compongo la stringa degli oggetti cambiati con questo formato
		// nome:lunghezza valore:valore  
		var z=f1.ChgObj.length;
		for(i = 0; i < z; i++)
		{
			var obj=f1.ChgObj[i];
			try
			{
				if (obj.tagName=='INPUT' && obj.type=='checkbox' && !obj.checked)
					s+=obj.name+':0:';
				else
					s+=obj.name+':'+obj.value.length+':'+obj.value;
			}
			catch(ex)
			{
			}
		}
		//
		// Aggiungo il pulsante premuto secondo gli standard
		if (typeof(f1.ClickedObj)=='object')
		{
			if (f1.ClickedObj.type=='submit')
			{
				s+=f1.ClickedObj.name+':1:1';
			}
			else
			{
				var z=f1.XClick.toString();
				s+=f1.ClickedObj.getAttribute("name") +'.x:' + z.length + ':' +z;
				z=f1.YClick.toString();
				s+=f1.ClickedObj.getAttribute("name") +'.y:' + z.length + ':' +z;
			}
		}
		//
		// Azzero la lista degli oggetti cambiati
		f1.ChgObj.length=0;
		f1.ClickedObj=0;
		//
		// PD = postback data
		// SS = search string (WCI + WCE + WCU)
		d.getElementById('pd').value=s;
		d.getElementById('ss').value=ss;
		//
		// Calcolo dimensioni attuali finestra attiva per mandarle al server
		var w=0, h=0, mw=0;
		try
		{
			var o1 = f1.document.getElementById("hdr");
			var o2 = f1.document.getElementById("StatusBarTable");
			var o3 = f1.document.getElementById("ToolBarTable");
			var o4 = f1.document.getElementById("MenuTable");
			var o5 = f1.document.getElementById("dockform");
			var o6 = f1.document.getElementById("Messages");
			//
			var b = f1.document.body;
			if (f1.StrictHTML)
				b= f1.document.documentElement;
			if (document.all)
			{
				w = b.offsetWidth-(o1==undefined?0:17); // Nelle form modali non tolgo lo spazio per la scrollbar
				h = b.offsetHeight; 
				if (f1.StrictHTML && o1==undefined)
					h = b.clientHeight; 
			}
			else
			{
				w = f1.innerWidth-(o1==undefined?0:17); // Nelle form modali non tolgo lo spazio per la scrollbar;
				h = f1.innerHeight - 8; // devo considerare un po' di bordi
			}
			//
			if (o1!=undefined)
				h -= (o1.innerHTML!=""?o1.offsetHeight:0);
			if (o2!=undefined)
				h -= o2.offsetHeight;
			if (o3!=undefined)
			{
				h -= o3.offsetHeight;
				if (o6!=undefined)
					h+= o6.offsetHeight;
			}
			if (o5!=undefined)
			{
				if (o5.offsetWidth<o5.offsetHeight)
					w -=o5.offsetWidth;
				else
					h -=o5.offsetHeight;
			}
			if (o4!=undefined)
			{
				w -=o4.offsetWidth;
				mw = o4.offsetWidth;
			}
		}
		catch (ex) { }
		//
		d.getElementById('keys').value= (f1.SK?'1':'0') + (f1.CK?'1':'0') + (f1.AK?'1':'0')+"&sw="+w+"&sh="+h+"&mw="+mw;
		//
		try
		{
			var z=f1.document.getElementById('cmdcode').value;
			if (z!="")
			{
				d.getElementById('cmd').value="CMD="+z.toUpperCase();
			}
			f1.document.getElementById('cmdcode').value="";
		}
		catch(ex) {}
		//
		// Alla fine effettuo il submit vero e proprio
		f1.t1=new Date();
		d.getElementById("theform").submit();
		f1.LatchID=f1.setTimeout('DisableLatch()',5000);
		if (f1.DelaySec>0)
			f1.DelayID=f1.setTimeout('ShowDelay()',1000*f1.DelaySec);
	}
	catch(ex)
	{
		window.defaultStatus='Ricaricamento in corso...';
		top.location.reload(true);
		return;		
	}
}


// **********************************************
// Mi dice se un oggetto è UNDEFINED
// **********************************************
function IsUndefined(obj)
{
	var ris=false;
	try
	{
		var z=obj.tagName;
	}
	catch(e) 
	{ 
		ris=true; 
	};
	return ris;
}


// ***************************************************
// Esegue il riposizionamento di una finestra di popup
// ***************************************************
function rp(l, t, w, h)
{
  if (document.all)
  {
  	if (w==-1 && parseInt(window.dialogWidth)<document.getElementById("ActiveForm").offsetWidth+8)
  		window.dialogWidth=(document.getElementById("ActiveForm").offsetWidth+8)+"px";
  	if (h==-1 && parseInt(window.dialogHeight)<document.getElementById("ActiveForm").offsetHeight+4)    
  		window.dialogHeight=(document.getElementById("ActiveForm").offsetHeight+4)+"px";
    if (l==-1)
    	window.dialogLeft=((screen.width-parseInt(window.dialogWidth))/2)+"px";
    if (t==-1)
    	window.dialogTop=((screen.height-parseInt(window.dialogHeight))/2)+"px";
  }
  else
  {
    // FF, Safari, etc
  	if (w==-1)
  	{
  	  if (window.outerWidth<document.getElementById("ActiveForm").offsetWidth+8)
    		w = document.getElementById("ActiveForm").offsetWidth+8;
    	else
    	  w = window.outerWidth;
  	}
  	if (h==-1)    
  	{
  	  if (window.outerHeight<document.getElementById("ActiveForm").offsetHeight+4)
    		h = document.getElementById("ActiveForm").offsetHeight+4;
    	else
    	  h = window.outerHeight;
  	}
  	//
    window.resizeTo(w, h);    // Safari
    window.outerWidth = w;    // FF
    window.outerHeight = h;   // FF
    //
    if (l==-1)
    	l = (window.screen.width-w)/2;
    if (t==-1)
    	t = (window.screen.height-h)/2;
    //
    window.moveTo(l, t);      // Safari
  }
}


// ***************************************************
// Chiamata quando la nuova pagina è pronta per
// la visualizzazione (solo lato RD)
// ***************************************************
function ep(ss)
{
	try
	{
		var f1=GetFrame(window.parent.frames,'Main');
		f1.t2=new Date();
		f1.document.body.style.cursor='auto';
		//
		// Infine tento di aggiustare l'altezza dell'active form 
		// in modo da evitare l'espansione della barra messaggi
		ResizeTables();			
		//
		try
		{
			window.defaultStatus='TS:'+(f1.t2.getTime()-f1.t1.getTime())+', KB:'+ss;
		}
		catch(ex) {};
		//
		//f1.EnableClick=1;
	}
	catch(ex)
	{
	}
}

// ***************************************************
// Prossima chiamata a RD arrivata
// ***************************************************
function NextRD()
{
	var browser = document.all ? 1 : 2;
	//
	//window.defaultStatus='RD ricevuto: applico HTML';
	var f1=GetFrame(window.parent.frames,'Main');
	//
	if (f1.LatchID>0)
		f1.clearTimeout(f1.LatchID);
	if (f1.DelayID>0)
		f1.clearTimeout(f1.DelayID);		
	try
	{
	  // Internet Explorer a volte lancia l'evento di OnLoad anche se non ha terminato
	  // il caricamento del documento. In questo caso aspetto 50 ms
	  if (f1.document.body==null)
	  {
	    setTimeout('NextRD()', 50);
	    return;
	  }
		f1.document.body.style.display="block";
		//
		// Nascondo blocco delay
		try
		{
    	var dd=f1.document.getElementById("delaydlg");
			dd.style.display = 'none';
			dd.contentWindow.StopProgrBar();
		}
		catch (ex) { }
		//
		var okc = false;
		try
		{
			ApplyRender();
		}
		catch(ex)
		{
			try
			{
				if (ex.indexOf("Universal")>-1) 
					okc=true;
			}
			catch (exc) {}
		}
		if (!okc) 
			NextNextRD(f1,browser);
	}
	catch(exc)
	{
		alert('Errore durante la ricezione dei dati: ' + exc.message);
		top.location.reload(true);
	}
	if (browser==1) 
		window.onresize = OnResizeBody;
	else 
		window.parent.onresize = OnResizeBody;
}
		
function NextNextRD(f1,browser)
{
	ApplyRD2();
	ApplySA();
	ApplyPANScr();
	//
	// Resetto stato tasti modificatori
	f1.SK = false;
	f1.CK = false;
	f1.AK = false;
	//
	// Gestione tasti
	if (f1.UseFK)
	{
		if (!f1.StdFKInit)
			InitStdFK();
		//
		if (browser==1) 
		{
			f1.document.onmousewheel = f1.BodyMouseWheel;
			f1.document.onhelp    = HelpHandler;
			f1.document.onkeydown = new Function ("onkeydown", "BodyKeyHandler(event)");
			f1.document.onmouseup = new Function ("onmouseup", "BodyMouseUp(event)");
		}
		else 
		{
			f1.document.onmousewheel = f1.BodyMouseWheel; // Safari
			f1.document.addEventListener('DOMMouseScroll', f1.BodyMouseWheel, false); // Firefox
			f1.document.addEventListener("help", f1.HelpHandler, false);
			f1.document.addEventListener("keydown", f1.BodyKeyHandler, false);
			f1.document.addEventListener("mouseup", f1.BodyMouseUp, false);
			f1.parent.onunload=f1.ModClose;
			f1.onfocus=f1.ModFocus;
		}
		//		
		try
		{
			f1.document.getElementById('cmdspan').style.display = 'block';
		}
		catch (ex) { }
	}
	//
	f1.EnableClick=1;
	//
	// Azzero array oggetti cambiati, non vorrei che nel frattempo
	// qualcosa di non desiderato fosse successo...
	if (f1.ChgObj != undefined)
  	f1.ChgObj.length=0;
  //
  // Chiamo la funzione personalizzata per poter eseguire codice ulteriore
  CustomFunction();
}


// ***************************************************
// Helper per popup modali FFX
// ***************************************************
function ModFocus(evento)
{
	var f1=GetFrame(window.parent.frames,"Main");
	if (f1.ModWnd!=null && !(f1.ModWnd.closed)) 
	{
		this.blur();
		f1.ModWnd.focus();
	}
}

function ModClose(evento)
{
	try
	{
		var f1 = this.opener.GetFrame(this.opener.window.parent.frames,"Main");
		f1.EnableClick=3;
		f1.pb("WCI=IWRD&WCE="+f1.ModIdx);
		f1.window.defaultStatus="";
	}
	catch(ex) {}
}


// ***************************************************
// Disabilito il latch per favorire il refresh
// ***************************************************
function DisableLatch()
{
	var f1=GetFrame(window.parent.frames,'Main');
	f1.LatchID=0;
	f1.EnableClick=2;
	f1.document.body.style.cursor='auto';
	window.defaultStatus='';
}


// ***************************************************
// Gestisco pressione tasto enter su form
// ***************************************************
function BodyKeyHandler(evento)
{
	try
	{
		var f1 = GetFrame(window.parent.frames,'Main');
		//
		// Se c'è un timeout pendente di cambio riga, lo rinnovo
		if (f1.ChangeRowID!=0)
		{
			f1.clearTimeout(f1.ChangeRowID);
			f1.ChangeRowID = f1.setTimeout("ChangeRowHandler()",f1.ChangeRowDelay);
		}
		//
		var eve = f1.event ? f1.event : evento;
		var code = eve.keyCode ? eve.keyCode : eve.charCode;
		var src = eve.target ? eve.target : eve.srcElement;
		//
		if (!document.all)
			f1.ActiveObjects[f1.document]=src;
		//
		// Vediamo subito se il tasto mi interessa
		if ((code<112 || code>123) && (code<33 || code>40) && code!=9)
			return true; //  Non devo processarlo
		//
		if (!document.all && code==112)
			HelpFFX(evento); // Help FFX
		//
		var attobj = GetActiveElement(f1.document); 
		var cancel = false;
		var selall = false;
		//
		// Rilevamento frame attivo...
		try
		{
			GetActiveFrame(attobj.name);
		}
		catch(ex)
		{
			// può non esserci attobj.name...
		}
		//
		// Vediamo se il pannello attuale è diviso in due
//		if (code==9 && !eve.ctrlKey)
//		{
//			var pc = f1.document.getElementById('PC'+ActiveFrame);
//			if (pc!=null && pc.getAttribute("advtab"))
//				return true; // Non devo processarlo perchè c'è l'adv tab order
//		}
		//
		if (eve.altKey && (eve.keyCode==40 || eve.keyCode==38))
			f1.ComboOpen = !f1.ComboOpen;
		//
		// Rilevamento tasto navigatorio
		if (!eve.altKey && ActiveRow > -1 && 
		    (
		     (attobj.tagName == 'INPUT' && attobj.type!='radio') || 
			   (attobj.tagName == 'TEXTAREA' && code==9) ||
			   (attobj.tagName == 'SELECT' && (code==37 || code==39 || !f1.ComboOpen))
			  )
			 )
		{
			switch(code)
			{
				case 40: // GIU
					if (!ChangeActiveRow(ActiveRow+1))
						if (GetLastRowInFrame()==0) // Solo in form
							ChangeActiveColumn(1);
					cancel = true;
					if (attobj.onkeydown==null || attobj.onkeydown.toString().indexOf("idro")==-1)
						selall=true; 
					break;
					
				case 38: // SU
					if (!ChangeActiveRow(ActiveRow-1))
						if (GetLastRowInFrame()==0) // Solo in form
							ChangeActiveColumn(-1); 
					cancel = true;
					if (attobj.onkeydown==null || attobj.onkeydown.toString().indexOf("idro")==-1)
						selall=true; 
					break;

				case 33: // PGUP
					DoAction('prev', true, evento); 
					cancel = true; 
					break;

				case 34: // PGDN
					DoAction('next', true, evento); 
					cancel = true; 
					break;
				
				case 9: // TAB
  				try
  				{
  					if (eve.ctrlKey)
  					{
  					  // CTRL-TAB scorre la form list
  					  var frmList = f1.document.getElementById('FormList').getElementsByTagName('TD');
  					  if (frmList.length>1)
  					  {
    					  var ss = frmList.length;
    					  var foundSel = false;
    					  for (var giro=0; giro<2; giro++)
    					  {
      					  for (var i=0; i<ss; i++)
      					  {
      					    var frm = frmList[i];
      					    //
      					    // Prima cerco quello selezionato
      					    if (frm.className=='FLSelItem') 
      					      foundSel = true;
      					    //
      					    // Se ho trovato quello selezionato prendo il prossimo Item
      					    if (foundSel && frm.className=='FLItem')
      					    {
      					      var lnk = frm.getElementsByTagName('A')[0];
      					      f1.ActiveObjects[f1.document]=lnk;
      					      lnk.click();
          					  cancel = true;
          					  break;
      					    }
      					  }
      					  //
      					  // Se ho già cliccato... ho finito
      					  if (cancel)
        					  break;
      					  //
      					  // Se non l'ho ancora trovato... al secondo giro mi va bene la prima form che trovo
      					  // (forse quella selezionata è l'ultima della lista)
      					  foundSel = true;
      					}
    					}
  					}
    				else
  				  {
    					ChangeActiveColumn((eve.shiftKey)?-1:1);
    					cancel=true;
    					if (attobj.onkeydown==null || attobj.onkeydown.toString().indexOf("idro")==-1)
    						selall=true;
    				}
    			}
  				catch(ex)
  				{
  					// Non lo gestisco
  					return true;
  				}
  				break;
					
				case 37: // SX
				case 39: // DX
				{
					var i1=0;
					if (attobj.tagName == 'SELECT' || (attobj.tagName=='INPUT' && (attobj.type=='checkbox' || attobj.type=='radio')))
					{
						if (code==39)
							i1=9999;
					}
					else
					{						
						if(typeof(attobj.selectionStart) != "undefined") // Mozilla
						{
							i1=attobj.selectionStart;
						}
						else
						{
							var t1 = f1.document.selection.createRange();
							var t2 = attobj.createTextRange();
							while (t2.compareEndPoints("StartToStart",t1))
							{
								i1++;
								t2.moveStart("character");
							}
						}
					}
					//
					try
					{
						if (i1==0 && code==37)
						{
							ChangeActiveColumn(-1);
							var ae = GetActiveElement(f1.document);
							if (ae!=attobj)
							{
      					// IE va in bomba per CheckBox, Select, ...
      					try
      					{
    						  if (ae.tagName!='INPUT' || (ae.type!='checkbox' && ae.type!='select'))
        					{
        						// Mi posiziono in fondo - se lo faccio per i checkbox IE va in IE  						
										if (typeof(ae.selectionStart) != "undefined" ) // Netscape, Mozilla, Firefox
										{
											ae.selectionStart=ae.value.length;
											ae.selectionEnd=ae.value.length;
										}
										else 
										{
  										t = ae.createTextRange();
  										t.move("character",ae.value.length);
  										t.select();
										}
  								}
								}
								catch (ex) {}
							}
							cancel=true;
						}
						if (i1>=attobj.value.length && code==39)
						{
							ChangeActiveColumn(1);
							var ae = GetActiveElement(f1.document);
							if (ae!=attobj)
							{
      					// Se sono in Mozilla, vado sul primo carattere
      					try
      					{
    						  if (ae.tagName!='INPUT' || (ae.type!='checkbox' && ae.type!='select'))
        					{
        						// Mi posiziono in fondo - se lo faccio per i checkbox IE va in IE  						
										if (typeof(ae.selectionStart) != "undefined" ) // Netscape, Mozilla, Firefox
										{
											ae.selectionStart=0;
											ae.selectionEnd=0;
										}
  								}
								}
								catch (ex) {}
							}
							cancel=true;
						}
					}
					catch(ex) {};
				}
				break;
					
				case 36: // Home
					if (eve.ctrlKey)
					{
						if (ActiveRow>0)
							ChangeActiveRow(0);
						DoAction('top', true, evento); 
						cancel = true; 
					}
					break;

				case 35: // End
					if (eve.ctrlKey)
					{
						if (ActiveRow>0)
							ChangeActiveRow(0);
						DoAction('bottom', true, evento); 
						cancel = true; 
					}
					break;
			}
		}    
		//
		// Rilevamento tasto funzione
		if (ActiveFrame>0 && code>=112 && code<=123)
		{
			var fkn = (code-111) + (eve.shiftKey? 12 : 0)  + (eve.ctrlKey? 24 : 0);
			var act = f1.CstFK[fkn];
			var flFrame = false;
			if (act=='')
			{
				act = f1.StdFK[fkn];
				flFrame = true;
			}
			if (act!='')
			{
				cancel=true;
				DoFKAction(act,flFrame,evento);
			}
		}
		//
		if (selall)
		{
			// IE va in bomba per CheckBox, Select, ...
			try
			{
				var ae = GetActiveElement(f1.document);
			  if (ae.tagName!='INPUT' || (ae.type!='checkbox' && ae.type!='select'))
				{
					if(!document.all)
					{
						ae.selectionStart=0;
						ae.selectionEnd=ae.value.length;
					}
					else 
					{
						t = ae.createTextRange();
						t.select();
					}
				}
			}
			catch (ex) {};			
		}
		//
		if (cancel)
		{
			if (document.all)
			{
				eve.keyCode = 505;
				eve.keyCode = 0;
				eve.returnValue = false;
				eve.cancelBubble = true;
			}
			else
			{
				eve.preventDefault();
				eve.stopPropagation();
			}
			return false;
		}
	}
	catch(ex)
	{
		alert('Errore nel trattamento tasti: '+ex.message);
	}
	return true;
}


// ***************************************************
// Gestisco pressione tasto enter su form
// ***************************************************
function GetActiveFrame(n)
{
	ActiveRow = -1;
	ActiveCol = -1;
	if (n.charAt(0)=='F') // Può essere un frame...
	{
		var rp = n.indexOf('R');
		var cp = n.indexOf('C');
		if (rp>-1 && rp>cp)
		{
			// Può essere un panel field...
			var fr = parseInt(n.substr(1),10);
			ActiveRow = parseInt(n.substr(rp+1),10);
			ActiveCol = parseInt(n.substr(cp+1),10);
			//
			if (isNaN(ActiveRow) || isNaN(ActiveCol) || isNaN(fr))
			{
				ActiveRow = -1;
				ActiveCol = -1;
			}
			else
			{
				// L'oggetto è valido
				ActiveFrame = fr;
			}          
		}
	}
}


// ***************************************************
// Clicco su un bottone...
// ***************************************************
function DoAction(str, flFrame, evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	if (ActiveFrame>0 && f1.EnableClick==1)
	{
		var n = str;
		if (flFrame)
			n+= ActiveFrame;
		var objCol = f1.document.getElementsByName(n);
		if (objCol.length>0)
		{ 
			ChangeHandler(evento);
			if (objCol[0].tagName=="TD" && objCol.length>1)
			{
				f1.ActiveObjects[f1.document]=objCol[1];
				f1.ClickedObj = objCol[1];
				objCol[1].click();
			}
			else
			{
				f1.ActiveObjects[f1.document]=objCol[0];
				f1.ClickedObj = objCol[0];
				objCol[0].click();
			}
			return true;
		}
	}
	return false;
}


// ***************************************************
// Attivo un tasto funzionale
// ***************************************************
function DoFKAction(str, flFrame, evento)
{
	var ss = str.split(';');
	var i;
	var z=ss.length;
	for (i=0;i<z;i++)
	{
		if (ss[i]=='>sr') // Comando selezione riga
		{
			if (DoAction('S'+ActiveFrame+'R'+ActiveRow, false, evento))
				break;
		}
		if (ss[i]=='>lk') // Comando attivazione campo
		{
			if (DoAction('A'+ActiveFrame+'C'+ActiveCol+'R'+ActiveRow, false, evento))
				break;
		}
		if (ss[i]=='>cl') // Chiudo finestra
		{
			if (DoAction('closex',  false, evento))
				break;
			if (DoAction('mno', false, evento))
				break;
		}
		if (DoAction(ss[i],flFrame, evento))
			break;
	}
}


// ***************************************************
// Cambio riga
// ***************************************************
function ChangeActiveRow(newr)
{
	var ok=false;
	var f1 = GetFrame(window.parent.frames,'Main');
	//
	if (ActiveFrame>0 && ActiveRow>-1)
	{
		var f1 = GetFrame(window.parent.frames,'Main');
		var n = 'F' + ActiveFrame + 'C' + ActiveCol + 'R' + newr;
		var objCol = f1.document.getElementsByName(n);
		if (objCol.length==0)
		{
			// Sono andato oltre l'ultima riga, oppure prima della prima riga
			// vediamo se posso cambiare frame.
			if (newr<0)
			{
				ChangeActiveFrame(-1);
				ChangeActiveRow(GetLastRowInFrame());
				ok=true;
			}
			else
			{
				ChangeActiveFrame(+1);
				ChangeActiveRow(0);
				ok=true;
			}
		}
		else
		{
			try
			{
				objCol[0].focus();
				f1.ActiveObjects[f1.document] = objCol[0];
			}
			catch(ex){}; // Potrebbe non essere possibile dare il fuoco...
			ok=true;
		}
	}
	return ok;
}


// ***************************************************
// Cambio frame
// ***************************************************
function ChangeActiveFrame(delta)
{
	var d=GetFrame(window.parent.frames,'Main').document;
	var f1 = GetFrame(window.parent.frames,'Main');	
	var newfr = ActiveFrame;
	var i;
	do
	{
		newfr+=delta;
		if (delta == 0)
			delta = 1; // Non voglio ciclare all'infinito sullo stesso frame!
		var n = 'PC' + newfr;
		var obj = d.getElementById(n);
		if (!IsUndefined(obj))
		{
			// Ho trovato un pannello
			// vediamo se almeno una colonna del pannello è "focalizzabile"
			for (i=0;i<33;i++)
			{
				n = 'F'+newfr+'C'+i+'R0';
				objCol = d.getElementsByName(n);
				if (objCol.length>0)
				{
					// Ho trovato anche una colonna su cui mettere il fuoco, sono a posto.
					ActiveFrame = newfr;
					ActiveCol = i;
					return true;
				}
			}
		}
	} while(newfr<33 && newfr>0);
	//
	return false;
}


// ***************************************************
// Cambio colonna
// ***************************************************
function ChangeActiveColumn(delta)
{
	var c = ActiveCol;
	var d=GetFrame(window.parent.frames,'Main').document;
	var f1 = GetFrame(window.parent.frames,'Main');
	//	
	var pc = f1.document.getElementById('PC'+ActiveFrame);
	if (pc!=null && pc.getAttribute("advtab") && f1.document.getElementsByName('SA'+ActiveFrame).length==0)
	{
		// Gestisco spostamento con adv tab order ma senza fixedcol!
		var n = 'F' + ActiveFrame + 'C' + ActiveCol + 'R' + ActiveRow;
		objCol = d.getElementsByName(n);
		if (objCol.length>0)
		{
			var attc = objCol[0];
			while (attc!=null)
			{
				if (delta>0)
					attc = attc.nextSibling;
				else
					attc = attc.previousSibling;
				//
				if (!attc.isDisabled)
				{
					// Controlliamo che sia un campo di possibile fuocatura
					var cc = n.indexOf("C");
					var rr = n.indexOf("R");
					if (attc.name!=null && attc.name.substr(0,cc+1)==n.substr(0,cc+1) && rr>0)
					{
						// In effetti è un oggetto nel mio frame...
						ActiveCol = parseInt(n.substr(cc+1));
						ActiveRow = parseInt(n.substr(rr+1));
						//
						attc.focus();
						f1.ActiveObjects[d]=attc;
						return true;
					}
				}
			}
		}
	}		
	//
	// Vediamo se c'è una colonna seguente/precedente
	var objCol;
	do
	{
		c+=delta;
		var n = 'F' + ActiveFrame + 'C' + c + 'R' + ActiveRow;
		objCol = d.getElementsByName(n);
		if (objCol.length!=0 && !objCol[0].isDisabled && objCol[0].name==n)
		{
			try
			{
				objCol[0].focus();
				f1.ActiveObjects[d]=objCol[0];
				ActiveCol = c;
				return true;
			}
			catch(ex)
			{
				// se non sono riuscito a dare il fuoco, continuo
			}
		}
	} while(c<100 && c>=0);
	//
	// devo cambiare riga, vediamo quale sarà la nuova colonna
	// attiva, qualora rimanga dentro al mio frame
	if (delta>0)
		c = 0; // Scorro in avanti a vedere quale colonna da focalizzare c'è
	else
		c = 99; // Scorro all'indietro, ma non so qual'è il massimo
	do
	{
		var n = 'F' + ActiveFrame + 'C' + c + 'R' + ActiveRow;
		objCol = d.getElementsByName(n);
		if (objCol.length!=0 && !objCol[0].isDisabled && objCol[0].name==n)
		{
			ActiveCol = c;
			break; // Trovata la nuova colonna attiva...
		}
		c+=delta;
	} while(c<100 && c>=0);
	//
	// Ora cambio veramente riga e/o frame
	ChangeActiveRow(ActiveRow + delta);
}


// ***************************************************
// Cambio frame
// ***************************************************
function GetLastRowInFrame()
{
	var d=GetFrame(window.parent.frames,'Main').document;
	var objCol;
	var r = 0;
	do
	{
		var n = 'F' + ActiveFrame + 'C' + ActiveCol + 'R' + r;
		objCol = d.getElementsByName(n);
		if (objCol.length==0)
			break;
		r++;
	} while(r<100);
	//
	return r-1;
}


// ***************************************************
// Init tasti FK standard
// ***************************************************
function InitStdFK()
{
	var f1=GetFrame(window.parent.frames,'Main');
	f1.StdFKInit=true;
	var i;
	for (i=0;i<48;i++)
	{
		f1.StdFK[i]='';
		f1.CstFK[i]='';
	}
	f1.StdFK[2]='>lk';
	f1.StdFK[3]='find;search';
	f1.StdFK[4]='list';
	f1.StdFK[6]='cancel;refresh';
	f1.StdFK[7]='insert';
	f1.StdFK[8]='delete';
	f1.StdFK[9]='save';
	f1.StdFK[11]='lck;unl';
	f1.StdFK[12]='>sr';
	//
	f1.StdFK[14]='chka'; // SHIFT+F2
	f1.StdFK[15]='chkn'; // SHIFT+F3
	f1.StdFK[16]='chks'; // SHIFT+F4
	f1.StdFK[19]='dupl';    // SHIFT+F7
	//
	f1.StdFK[28]='>cl;closex'; //  CTRL+F4
	f1.StdFK[36]='print'; // CTRL+F12
}


// ***************************************************
// Ritorna un tip standard per il tasto funzione
// ***************************************************
function AddFKTip(obj)
{
	try
	{
		var n=obj.name;
		//
		// Estraggo il nome grezzo
		if (n.charAt(0)!='M')
		{
  		var i;
  		for (i=n.length-1;i>=0;i--)
  			if (n.charAt(i)>'9')
  				break;
  		if (n.substr(0,2)=='cc')
  			i++; // I custom command hanno un indice numerico che devo mantenere
  		n=n.substr(0,i+1);
  	}
		if (n=="")
			return;
		//
		// cerco nell'array degli fk
		for (i=0;i<48;i++)
		{
			if (CstFK[i].indexOf(n)>-1)
				break;
			if (StdFK[i].indexOf(n)>-1)
				break;
		}
		if (i<48)
		{
			// Compongo la stringa di aiuto
			n=' (';
			if (i>24)
			{
				n+='Ctrl+'; i-=24;
			}
			if (i>12)
			{
				n+='Shift+'; i-=12;
			}
			n+='F'+i+')';
			//
			if (obj.title.indexOf(n)==-1)
				obj.title+=n;
		}
	}
	catch(ex)
	{
	}  
}


// ***************************************************
// Rende un INPUT readonly in modo umano e non come
// fa IE -> deve funzionare anche senza RD
// ***************************************************
function idro(e)
{
	var eve, code, t;
	//
	// IE
	if (document.all)
	{
		var f1 = window;
		try
		{
			GetFrame(window.parent.frames,'Main');
		}
		catch(ex) {}
		eve = f1.event;
		code=eve.keyCode;
		t = eve.srcElement;
	}
	else // Moz
	{
		eve = e;
		code = (eve.charCode!=0?eve.charCode:eve.keyCode);
		if (eve.charCode!=0 && code>=96 && code<=127)
			code -= 32;
		t = eve.currentTarget;
	}
	//
	if (eve.ctrlKey && code>=64 && code<=95)
	{
	  var s=String.fromCharCode(code);
	  if (s=="C")
	  	return true;
	}
	if (t.tagName=="INPUT" && code==13)
		return true; // Pressione tasto ENTER su campo monorow
	//
	if (code==9 || code==37 || code==39 || code==36 || code==35)
		return true;
	else
	{
		try
		{
			e.preventDefault(); // Moz
		}
		catch(ex) {}
		return false;
	}
}


// ***************************************************
// Controlla massima lunghezza textarea
// ***************************************************
function chklen(ml, evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	var eve = f1.event ? f1.event : evento;
	//
	var src = eve.srcElement? eve.srcElement : eve.currentTarget;
	var code = 1;
	//
	if (!document.all)
		code = eve.charCode;
	//
	var s = src.value;
	if (s.length>ml)
		src.value = s.substr(0,ml);
	//
	if (code==0)
		return true; //  Non devo processarlo	perchè non è un carattere che si aggiunge
	//
	if (s.length==ml)
	{
		if (document.all) 
		{
			eve.keyCode = 505;
			eve.keyCode = 0;
			eve.returnValue = false;
			eve.cancelBubble = true;
		}
		else
		{
			eve.preventDefault();
			eve.stopPropagation();
		}
		return false;
	}
	//
	return true;
}


// ***************************************************
// Apre la finestra di help selezionata
// ***************************************************
function HelpHandler()
{
	var f1 = GetFrame(window.parent.frames,'Main');
	var ho = f1.document.getElementById('help');
	try
	{
		f1.ActiveObjects[f1.document] = ho;
		ho.click();
	}
	catch(ex) {};
	return false;
}

function HelpFFX(evento)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	var ho = f1.document.getElementById('help');
	try
	{
		f1.ActiveObjects[f1.document]=ho;
		ho.onclick(evento);
	}
	catch(ex) {};
	evento.preventDefault();
	evento.stopPropagation();
	return false;
}


// ***************************************************
// Apre una nuova finestra
// ***************************************************
function OpenDoc(fil, wname, fea)
{
  var w = window;
  try
  {
    // Se sono una modale e mi hanno passato la window... uso quella
    // altrimenti se io (modale) apro nuove window... quelle non fanno parte della
    // mia stessa sessione!!!! Vedi http://support.microsoft.com/kb/831678/en-us
    if (dialogArguments)
      w = dialogArguments.window;
  }
  catch (ex) {}
  //
  var nw = w.open(fil, wname, fea);
	nw.focus();
	return false;
}


// ***************************************************
// Imposta lo scroll top
// ***************************************************
function sct(t)
{
	var f1 = GetFrame(window.parent.frames,'Main');
	var d=f1.document.getElementById('pagediv');
	try
	{
		if (d.scrollHeight > d.clientHeight)
			d.scrollTop=t;
		else
			f1.document.body.scrollTop=t;
	}
	catch(ex) {}
}


// ***************************************************
// Gestisco scroll panel splitter
// ***************************************************
function SAScroll()
{
	try
	{
		var f1 = GetFrame(window.parent.frames,'Main');
		var eve = f1.event;
		var obj=eve.srcElement;
		f1.SAPos[parseInt(obj.id.substr(2),10)] = obj.scrollLeft;
	}
	catch(ex)
	{
	}
}


// ***************************************************
// Posiziono gli splitter
// ***************************************************
function ApplySA()
{
	var i;
	var f1 = GetFrame(window.parent.frames,'Main');
	if (f1.SAPos != undefined)
	{
  	var z=f1.SAPos.length;
  	for(i = 0; i < z; i++)
  	{
  		if (f1.SAPos[i]>0)
  		{
  			try
  			{
  				f1.document.getElementById('SA'+i).scrollLeft=f1.SAPos[i];
  			}
  			catch(ex)
  			{
  			}	
  	  }
  	}	
  }
}

// ***************************************************
// Gestisco tutte le scrollbar dei pannelli
// ***************************************************
function panscr()
{
	try
	{
	  // L'evento OnMouseMove del D&D, alla fine, fa un bp.focus() dove bp è il div 'BOOKPAGE'.
	  // Questa operazione, non so perché, fa muovere le scrollbar quando obj non è il BOOKPAGE
	  // e quindi azzererei le posizioni delle scrollbar poco prima di fare il pb() del drop.
	  // Quindi, se è un panscr derivante dall'evento OnMouseMove del D&D del book, lo blocco
	  if (HitObj!=undefined && HitObj!=null && StartX!=0 && StartY!=0)
	    return;
	  //
  	var f1 = GetFrame(window.parent.frames,'Main');
  	var obj = f1.event.srcElement;
  	//
	  PANPosX[parseInt(obj.id.substr(2),10)] = obj.scrollLeft;
	  PANPosY[parseInt(obj.id.substr(2),10)] = obj.scrollTop;
	}
	catch(ex)
	{
	}
}

function ApplyPANScr()
{
	var f1 = GetFrame(window.parent.frames,'Main');
	if (f1.PANPosY != undefined)
	{
  	var z=f1.PANPosY.length;
  	for (var i = 0; i < z; i++)
  	{
  		if (f1.PANPosX[i]>0)
  		{
  			try { f1.document.getElementById('PC'+i).scrollLeft = f1.PANPosX[i]; } catch(ex) {}
  	  }
  		if (f1.PANPosY[i]>0)
  		{
  			try { f1.document.getElementById('PC'+i).scrollTop = f1.PANPosY[i]; } catch(ex) {}
  	  }
  	}	
	}	
}

function ResetPanScr(i)
{
	var f1 = GetFrame(window.parent.frames,'Main');
	f1.PANPosX[i]=0;
	f1.PANPosY[i]=0;
}


// ***************************************************
// Gestisce la rotelline
// ***************************************************
function BodyMouseWheel(evento)
{
	var f1 = GetFrame(window.parent.frames,'Main');	
	var eve = f1.event ? f1.event : evento;
	var srcElement = eve.srcElement ? eve.srcElement : eve.target;
	var delta = f1.event ? eve.wheelDelta : (eve.detail!=0 ? -eve.detail*40 : eve.wheelDelta);
	//
  // Verifico se l'elemento attivo è parte di un pannello con scrollbar
	// a meno che il cursore non sia su una select aperta
	if (srcElement.tagName!='SELECT' || !f1.ComboOpen)
	{
    var p = GetParentElement(srcElement);
    if (p.tagName=="DIV" && p.id.substr(0,2) == "SA")
    {
      p = GetParentElement(p);
    }
    if (p.tagName=="DIV" && p.id.substr(0,2) == "PC")
    {
      // Sono dentro un pannello, vediamo se esiste la scrollbar
      var sa = document.getElementById("PSA"+p.id.substr(2));
      if (sa!=null)
      {
        sa.scrollTop-=delta;
        if (!f1.event)
        {
        	eve.preventDefault();
					eve.stopPropagation();
				}
        return false;
      }
    }
  }
  //
	// Se il cursore non è su una select aperta, la rotella scrolla il body
	if (srcElement.tagName=='SELECT' && !f1.ComboOpen)
	{
		document.body.scrollTop-=delta;
    if (!f1.event)
    {
    	eve.preventDefault();
			eve.stopPropagation();
		}		
		return false;
	}
}

// ***************************************************
// Click su combo
// ***************************************************
function BodyMouseUp(evento)
{
	var f1 = GetFrame(window.parent.frames,'Main');
	try
	{
		var eve = f1.event ? f1.event : evento;
		var src = eve.srcElement? eve.srcElement : eve.target;
		if (src.tagName=='SELECT')
			f1.ComboOpen=!f1.ComboOpen;
		else
			f1.ComboOpen=false;
	} 
	catch(ex)
	{
		f1.ComboOpen=false;
	}	
}


// ***************************************************
// Messaggi all'utente
// ***************************************************
function msg(txt, typ)
{
	var f1 = GetFrame(window.parent.frames,'Main');
	var ris;
	switch(typ)
	{
		case 0:
		f1.alert(txt);
		break;
			
		case 1:
		ris = f1.confirm(txt)?"Y":"N";
		f1.setTimeout("pb('"+ris+"')", 10);
		break;

		case 2:
		ris = f1.prompt(txt,'');
		if (ris == null)
			ris = '';
		f1.setTimeout("pb('"+ris+"')", 10);
		break;
	}
}

var PopupObj = null;
var PopupPID = "";
var PopupDir = 1;   // 0-Right, 1-Bottom, 2-Left, 3-Top., 4 posizione cursore Default bottom
// ***************************************************
// Popup Menu
// ***************************************************
function popup(pid, ht)
{
	var f1 = GetFrame(window.parent.frames,"Main");
	PopupObj = null;
	try
	{
		// Creo il div per il popup
		var a = f1.document.getElementById("PopupMenu");
		if (a==null)
		{
			a = f1.document.createElement("DIV");
			a.id="PopupMenu";
			a.style.visibility = "hidden";
			a.style.position = "absolute";
			f1.document.body.appendChild(a);
		}
		//
  	PopupObj = new PM("PopupMenu");
  	PopupObj.Populate(ht);
  	//
  	// Il pid contiene l'ID dell'oggetto seguito dalla direzione
  	PopupPID = pid.substring(0, pid.indexOf("|"));
  	PopupDir = parseInt(pid.substring(pid.indexOf("|")+1));
  	popupshow();
  } 
  catch (ex) {}
}

function popupshow()
{
	if (PopupObj==null) 
		return;
	PopupObj.Show(PopupPID);
}

function popupshow_NoRD(pid)
{
	PopupPID = pid.substring(0, pid.indexOf("|"));
	PopupDir = parseInt(pid.substring(pid.indexOf("|")+1));
	popupshow();
}

// ***************************************************
// Gestione Drag&Drop
// ***************************************************
var DropSrc = null;
var DropDst = null;
var OldClassName = '';
function TreeMouseDown(evento)
{
  // Seleziono il testo del nodo... altrimenti non viene scatenato il DragStart!
  var rng = document.body.createTextRange();
  rng.moveToElementText(event.srcElement);
  rng.select();
}

function TreeDragStart(evento)
{
  DropSrc = event.srcElement;
  event.dataTransfer.effectAllowed = 'all';
}

function TreeDragOver(evento)
{
  var o = event.srcElement;
  if (o!=DropSrc)
  {
    // Ripristino il vecchio nodo
    if (DropDst)
      DropDst.className = OldClassName;
    //
    // Attivo il nuovo
    DropDst = o;
    OldClassName = DropDst.className;
    DropDst.className = 'DropNode';
    //
    // Aggiorno il cursore
    if (event.ctrlKey)
      event.dataTransfer.dropEffect = 'copy';
    else if (event.shiftKey)
      event.dataTransfer.dropEffect = 'link';
    else
      event.dataTransfer.dropEffect = 'move';
    //
    // Accetto il D&D
    event.returnValue = false;
  }
}

function TreeDragEnd(evento)
{
  // Ripristino gli stili
  if (DropDst)
    DropDst.className = OldClassName;
  //
  // Pronto per un nuovo drop
  DropSrc = null;
  DropDst = null;
  OldClassName = '';
  //
  // Svuoto la selezione (era sul nodo sorgente)
  var rng = document.body.createTextRange();
  rng.move('character', 0);
	rng.select();
}

function TreeDrop(evento)
{
  // Drop di un nodo dell'albero
  var ev = event;
  //
  // Recupero il nodo di destinazione
  DropDst = ev.srcElement;
  //
  // Cerco il LI del SRC (identificativo univoco del nodo)
  var osrc = DropSrc;
  while (osrc && osrc.tagName != "LI")
    osrc = osrc.parentNode;
  //
  // Cerco il LI del DST (identificativo univoco del nodo)
  var odst = DropDst;
  while (odst && odst.tagName != "LI")
    odst = odst.parentNode;
  //
  // Comunico i dati al server
  try
  {
    pb('WCI=IWTreeDrop&WCE=' + osrc.id + ':' + odst.id + ':' + (ev.shiftKey ? 'S':'-') + (ev.altKey ? 'A':'-') + (ev.ctrlKey ? 'C':'-'));
  }
  catch (ex) {}
}

// ***************************************************
// Menu contestuale per alberi
// ***************************************************
function RightClk(cmdidx, docked, evento)
{
	evento = window.event? event : evento;
  try
  {
    if (cmdidx == undefined || cmdidx==-1)
    {
      var f1 = GetFrame(window.parent.frames,'Main');
    	var attobj = GetActiveElement(f1.document);
    	//
    	// Rilevamento frame attivo...
    	try
    	{
    		GetActiveFrame(attobj.name);
    	}
    	catch(ex) { } // può non esserci attobj.name...
    	//
    	// Attivo il bottone di attivazione
			if (DoAction('A'+ActiveFrame+'C'+ActiveCol+'R'+ActiveRow, false, evento))
			{
        if (document.all)
        	evento.returnValue = false;      // Gestito
				else 
					evento.preventDefault();
        return false;
      }
    }
    else
    {
      // Cerco l'oggetto con l'ID
      var o = evento.srcElement? evento.srcElement : evento.target;
      while (o && o.id=='')
        o = o.parentNode;
      //
      if (o.id!='TREE')
      {
        pb('WCI=IWTreeClick&WCE=+' + cmdidx + ':' + o.id + (docked ? '&WCU=dock' : ''));
        if (document.all)
        	evento.returnValue = false;      // Gestito
				else 
					evento.preventDefault();
        return false;
      }
    }
  }
  catch (ex) {}
}

// ***************************************************
// Chiamata da un campo con doppio click
// ***************************************************
function DblHandler(evento)
{
	var src = document.all ? event.srcElement : evento.target;
  //
  var f1 = GetFrame(window.parent.frames,'Main');
  f1.ActiveObjects[f1.document]=src;
	//
	var attobj = GetActiveElement(f1.document); 
	//
	// Rilevamento frame attivo...
	try
	{
		GetActiveFrame(attobj.name);
	}
	catch(ex)
	{
		// può non esserci attobj.name...
	}	
	//
	// Premo tasto F2/F12
	DoFKAction(">lk;>sr",true,evento);
}


// ***************************************************
// Mostra il frame di delay
// ***************************************************
function ShowDelay(msg)
{
	var f1=GetFrame(window.parent.frames,"Main");
	var dd=f1.document.getElementById("delaydlg");
	if (document.all)
	{
		dd.style.pixelWidth = 300;
		dd.style.pixelHeight = 200;
		dd.style.pixelLeft = (document.body.scrollWidth  - 300) / 2;
		dd.style.pixelTop = (document.body.scrollHeight - 200) / 2;
	}
	else
	{
		//Per Firefox & C.
		dd.style.width = 300+"px";
		dd.style.height = 200+"px";
		dd.style.left = ((document.body.scrollWidth  - 300) / 2)+"px";
		dd.style.top = ((document.body.scrollHeight - 200) / 2)+"px";
	}
	dd.contentWindow.Init(msg);
	dd.style.display = "block";
	f1.document.body.style.cursor='wait';
}


// ***************************************************
// Funzioni RD2
// ***************************************************
function a(n,v)
{
	var z = fn1.length;
	fn1[z] = n;
	fv1[z] = v;
}

function b(n,v)
{
	var z = fn2.length;
	fn2[z] = n;
	fv2[z] = v;
}

function ApplyRD2()
{
	var browser = document.all ? 1 : 2;
	var f1 = GetFrame(window.parent.frames,'Main');
	var z = fn1.length;
	var i = 0;
	//
	for (i=0; i<z; i++)
	{
		try
		{
		  // Supporto UNICODE
  	  fv1[i] = unescape(fv1[i]);
  	  //
  	  var obj = null;
  	  var objcol = f1.document.getElementsByName(fn1[i]);
			if (objcol.length>0)
				obj = objcol[0];			
			if (obj==null)
				obj = f1.document.getElementById(fn1[i]);
			//
			var tn = obj.tagName;
			if (tn=="INPUT")
			{
				var ot=obj.type;
				if (ot=="checkbox")
					obj.checked = fv1[i]=="on";
				else if (ot=="radio")
				{
					var c = f1.document.getElementsByName(fn1[i]);
					var zz = c.length;
					for (j=0; j<zz; j++)
					{
						var cj = c(j);
						cj.checked = cj.value == fv1[i];
						cj.style.visibility = "visible";
						cj.nextSibling.style.visibility = "visible";
					}
				}
				else
					obj.value = fv1[i];
			}
			else if (tn=="SELECT" || tn=="TEXTAREA")
			{
				obj.value = fv1[i];
			}
			else if (tn=="DIV")
			{
				obj.innerHTML = fv1[i];
			  //
	      // Estraggo gli script eventualmente contenuti e li eseguo dopo
			  RunScript(fv1[i]);
			}
		}
		catch(ex) 
		{ 
			//alert(fn1[i]+": "+ex); 
		}
	}
	fn1 = new Array();
	fv1 = new Array();
	//
	z = fn2.length;
	for (i=0; i<z; i++)
	{
		try
		{
			var obj = null;
			var objcol = f1.document.getElementsByName(fn2[i]);
			if (objcol.length>0)
				obj = objcol[0];			
			if (obj==null)
				obj = f1.document.getElementById(fn2[i]);			
			//			
			var p = GetParentElement(obj);
			//
			// Distruggo eventuale oggetto di attivazione
			try
			{
				var d1 = obj.nextSibling;
				var d2 = d1.nextSibling;
				if (d1.id=="SA"+fn2[i].substr(1) || d1.id=="SE"+fn2[i].substr(1))
				{
					SetOuterHTML(d1,"");
				}
				if (d2.id=="SE"+fn2[i].substr(1))
				{
					SetOuterHTML(d2,"");
				}
			}
			catch(ex){};
			//
			if (obj.tagName=="INPUT" && obj.type=="radio")
			{
				var pp=p;
				p=GetParentElement(p);
				SetOuterHTML(pp,ExpandIDTag(fv2[i]));
			}
			else
			{
				SetOuterHTML(obj,ExpandIDTag(fv2[i]));
	      //
	      // Estraggo gli script eventualmente contenuti e li eseguo dopo
			  RunScript(fv2[i]);
			}
			//
			if (f1.cht.length==0 || f1.cht[f1.cht.length-1]!=p)
				f1.cht[f1.cht.length]=p; // Change Target Parziale
		}
		catch(ex) 
		{ 
			if (fn2[i]!="FCKD")
			{
				//alert(fn2[i]+": "+ex); 
			}
		}
	}
	fn2 = new Array();
	fv2 = new Array();
	//	
	//f1.t2=new Date();
	//window.defaultStatus="RD2: n="+z+", t:"+(f1.t2-f1.t1);
}


// ***************************************************
// Ho ridimensionato il client, dopo 500 ms
// manderò la richiesta!
// ***************************************************
function OnResizeBody()
{
	SetRefresh(500);
}


// ***************************************************
// Richiesta di aggiornare il client!
// ***************************************************
function SetRefresh(interval)
{
	var f1 = GetFrame(window.parent.frames,'Main');
	//
	if (f1.RefreshID!=0)
		f1.clearTimeout(f1.RefreshID);
	f1.RefreshID=f1.setTimeout('pb("")',interval+50);
}


// ***************************************************
// Aggiorna le altezza della tabella
// ***************************************************
function ResizeTables()
{
	var f1 = window;
	//
	try
	{
		f1 = GetFrame(window.parent.frames,"Main");
	}
	catch(ex) {}
	//
	// Resetto altezza flbottom: serve per ricalcolare l'altezza complessiva del body
	var flb = f1.document.getElementById("FLBottom");
	if (flb!=undefined)
		flb.style.height=0;
	//
	var ext = f1.document.getElementById("ExtTable");
	ext.style.height = 1 + "px"; // resetto altezza ext per eliminare scrollbar inutili
	//
	var wel = f1.document.getElementById("welcome");
	//
	var hdr = f1.document.getElementById("hdr");
	var hdrh= 0;
	var hdrw= 0;
	if (hdr!=undefined && hdr.innerHTML!="")
	{
		hdrh = hdr.offsetHeight;
		hdrw = hdr.offsetWidth;
	}
	//
	var rt = f1.document.getElementById("RightTable");
	if (rt==undefined)
		rt = f1.document.getElementById("ActiveForm");
	//
	var hbs = 0;
	//
	if (wel==undefined)
	{
		hbs=f1.document.body.scrollHeight;
		if (f1.StrictHTML)
			hbs = rt.offsetHeight+hdrh;
	}
	var hbo = f1.document.body.offsetHeight;
	if (f1.StrictHTML)
		hbo = f1.document.documentElement.offsetHeight;
	//
	// Mozilla
	if (!document.all)
	{
		hbo = f1.innerHeight;
	}
	//
	var hb  = (hbs>hbo)?hbs:hbo;
	var hh = hdrh;
	//
	if (ext.offsetWidth>hdrw && hbs<=hbo)
	{
		f1.document.body.style.height = (f1.document.body.offsetHeight - 20)+"px";
		hb -= 20;
	}
	if (hb-hh-6>0)
		ext.style.height = (hb-hh-6)+"px";
	//
	if (f1.StrictHTML)
		f1.document.body.style.width = f1.document.documentElement.clientWidth+"px";
	//
	if (flb!=undefined)
	{
		try
		{
			flb.style.height = (hb-hh-6-(f1.document.getElementById("Menu").offsetHeight-flb.offsetHeight)-(f1.StrictHTML?16:0))+"px";
		}
		catch(ex) {}
	}
	//
	var vali = f1.document.getElementById("valImg");
	if (vali!=undefined)
		vali.style.visibility = "visible";
	//
	if (wel!=undefined)
		wel.height = (wel.parentNode.offsetHeight-5)+"px";
}


// **********************************************
// Manda in stampa un file PDF
// **********************************************
function PrintPDF(FilePDF, MsgText, FromPage, ToPage, FitToPaper, PrintDlg)
{
	var f1 = window;
	var rd = false;
	try
	{
		f1 = GetFrame(window.parent.frames,"Main");
		rd = true;
	}
	catch(ex) {}
	//
	// Aspetto il file PDF
	f1.document.getElementById("dpdf").innerHTML = "<object id='opdf' type='application/pdf' name='opdf' classid='clsid:CA8A9780-280D-11CF-A24D-444553540000' width='0' height='0'><param name='src' value='"+ FilePDF +"'></object>";
	f1.window.defaultStatus = MsgText;
	f1.window.setTimeout("CheckPDF("+FromPage+","+ToPage+","+FitToPaper+","+PrintDlg+")",200);
	if (rd)
		f1.ShowDelay(MsgText);
}


// **********************************************
// Manda in stampa un file PDF
// **********************************************
function CheckPDF(FromPage, ToPage, FitToPaper, PrintDlg)
{
	if (document.opdf.readyState==4)
	{
		// Inizio la stampa
		if (PrintDlg)
			document.opdf.printWithDialog();
		else if (FromPage>0 && ToPage>0)
			document.opdf.printPagesFit(FromPage, ToPage, FitToPaper);
		else
			document.opdf.printAllFit(FitToPaper);
		//
		// Mando un refresh al server... ma dopo 2 secondi
		var f1 = window;
		try
		{
			f1 = GetFrame(window.parent.frames,"Main");
			// Con RD
			window.setTimeout("pb('')",2000);
		}
		catch(ex)
		{
			// Senza RD
			window.setTimeout("window.location.replace(window.location.href)",2000);
		}
	}
	else
	{
		window.setTimeout("CheckPDF("+FromPage+","+ToPage+","+FitToPaper+","+PrintDlg+")",200);
	}	
}

// ****************************************************
// Aggiorna i campi per la formattazione (Decimal Dot)
// ****************************************************
function SetDD(decSep, grpSep)
{
  try
  {
    GetFrame(window.parent.frames,'Main').glbDecSep = decSep;
    GetFrame(window.parent.frames,'Main').glbThoSep = grpSep; 
  } 
  catch (e) {}
}

// ****************************************************
// Aggiorna la riga attiva di un pannello
// ****************************************************
function UpdateActRow(NumPan, AttR)
{
	var f1 = window;
	//
	try
	{
	  f1 = GetFrame(window.parent.frames,"Main");
	}
	catch(ex) {}
	//
  var pc = f1.document.getElementById("PC"+NumPan);
  //
  pc.setAttribute("actrow", AttR);
}


// ****************************************************
// Aggiorna la scrollbar dei record di un pannello.
// ****************************************************
function UpdateScrollBar(NumPan, TotRighe, PosAtt, RigheVis, MaxHR, HdrSZ, ScrTip)
{
  var f1 = window;
	//
	try
	{
	  f1 = GetFrame(window.parent.frames,"Main");
	}
	catch(ex) {}
	//
  var sa = f1.document.getElementById("PSA"+NumPan);
  var sb = f1.document.getElementById("PSB"+NumPan);
  //
  // Proteggo se non c'è PSA
  if (!sa)
    return;
  //  
  sa.setAttribute("MaxHR", Math.ceil(MaxHR+HdrSZ/RigheVis));
  sa.setAttribute("TotRighe", TotRighe);
  sa.setAttribute("RigheVis", RigheVis);
  //
  // Disattivo la scrollbar
  f1.ScrSem = true;
  //
  var z = 0;
  if (TotRighe<=RigheVis)
  {
    sb.style.height = 1;
  }
  else
  {
    sb.style.height = (sa.getAttribute("MaxHR")*TotRighe)+ "px";
    z = sa.getAttribute("MaxHR")*(PosAtt-1);
    sa.scrollTop = z;
    f1.setTimeout("document.getElementById('PSA'+" + NumPan + ").scrollTop = " + z, 10);
  }
  var d = parseInt(z/sa.getAttribute("MaxHR")+1);
  sa.setAttribute("LastD", d);
  //
  // Gestione Tips
  if (ScrTip!="." || sa.Tips == undefined)
  {
    sa.setAttribute("Tips", ScrTip);
  }
}


// ****************************************************
// Gestisce lo scrolling del pannello
// ****************************************************
function Scrolla(NumPan, Dock)
{
  var f1 = window;
 	var browser = document.all ? 1 : 2;
	//
	try
	{
	  f1 = GetFrame(window.parent.frames,"Main");
	}
	catch(ex) {}
	//
  var sa = f1.document.getElementById("PSA"+NumPan);
  var st = f1.document.getElementById("PSC"+NumPan);
  var TotRighe = sa.getAttribute("TotRighe");
  var RigheVis = sa.getAttribute("RigheVis");
  //
  var d = parseInt(Math.ceil(sa.scrollTop/sa.getAttribute("MaxHR"))+1);
  if (d>TotRighe-RigheVis+1)
  	d=TotRighe-RigheVis+1;
  //
  if (f1.EnableClick==1 && !f1.ScrSem)
  {
    // Vediamo se devo far apparire un tip
    var h = sa.getAttribute("Tips");
    if (h!="")
    {
      var p1 = d;
      var p2 = d-100;
      if (p2<1)
        p2 = 1;
      while (p1 >= p2)
      {
        var ss = p1+":";
        var tr = h.indexOf(ss);
        if (tr>=0)
        {
          if (tr==0 || h.charAt(tr-1)=="|")
          {
            var ft = h.indexOf("|",tr);
            //
            if (browser==1)
            {
	            st.style.left = 0;
	            st.style.top = 0;
	          }
            st.style.display = "block";
            if (browser==1)
          	{
            	st.style.visibility = "hidden";
            }
            st.innerHTML = h.substring(tr+ss.length,ft);
            st.style.left = (sa.offsetLeft - st.offsetWidth - 8) + "px";
            st.style.top = (sa.offsetTop + (sa.offsetHeight - st.offsetHeight)/2) + "px";
            st.style.visibility = "visible";
            //
            if (ScrTim2>-1)
            {
              f1.clearTimeout(ScrTim2);
              ScrTim2 = -1;
            }
            ScrTim2 = f1.setTimeout("HideTip("+NumPan+")", 800);
            //
            d = p1;
            break;          
          }
        }
        p1--;
      }
    }
    //
    // Ora inizio la richiesta al server
    if (sa.getAttribute("LastD")!=d || ScrTim1!=-1)
    {
      sa.setAttribute("LastD", d);
      if (ScrTim1>-1)
      {
        f1.clearTimeout(ScrTim1);
        ScrTim1 = -1;
      }
      ScrTim1 = f1.setTimeout("pb('WCI=IWForm&WCE=PAN"+NumPan+":MOV"+d+(Dock?"&WCU=dock":"")+"')", 300);      
    }
  }
  //
  f1.ScrSem = false;
}


// ****************************************************
// Nasconde lo scroll tips
// ****************************************************
function HideTip(NumPan)
{
  var f1 = window;
	//
	try
	{
	  f1 = GetFrame(window.parent.frames,"Main");
	}
	catch(ex) {}
	//
	try
	{
    var st = f1.document.getElementById("PSC"+NumPan);
    st.style.display = "none";
	}
	catch(ex) {}
  ScrTim2 = -1;
}


// ****************************************************
// Nasconde lo scroll tips
// ****************************************************
function ShowTip(NumPan, Text)
{
  var f1 = window;
	//
	try
	{
	  f1 = GetFrame(window.parent.frames,"Main");
	}
	catch(ex) {}
	//
	try
	{
    var st = f1.document.getElementById("PSC"+NumPan);
    var nx = f1.document.getElementById("QBET"+NumPan);
    //
    st.innerHTML = Text;
    //
    var l = nx.offsetLeft;
    if (l + st.offsetWidth > GetParentElement(st).offsetWidth)
      l = GetParentElement(st).offsetWidth - st.offsetWidth;
    if (l < 0)
      l = 0;
    //
    st.style.left = l+"px";
    st.style.top = "2px";
    //   
    st.style.display = "block";
	}
	catch(ex) {}
}


// ****************************************************
// Restituisce un frame per nome (cross-browser)
// ****************************************************
function GetFrame(af, nome)
{
  var fr = null;
	if (document.all)
		fr = af[nome];
	else
	{
    for ( i = 0; i< af.length; i++ ) 
    {
			var s=af[i].name;
			if (s.indexOf(nome)!=-1) 
			{
				fr = af[i];
				break;
			}
		}
	}
	//
	return (fr) ? fr : window;
}


// ****************************************************
// Restituisce una proprietà di stile
// ****************************************************
function GetStyleProp(elemento,prop)
{
	if (elemento.currentStyle)
  	return(elemento.currentStyle[prop]);
  //
	if(document.defaultView.getComputedStyle)
  	return(document.defaultView.getComputedStyle(elemento,'')[prop]);
  //
	return(null);
}


// ****************************************************
// Restituisce il parent dell'elemento
// ****************************************************
function GetParentElement(obj) 
{
	if (obj.parentElement!=null) 
		return obj.parentElement;
	else 
		return obj.parentNode;
}


// ****************************************************
// Effettua il setting dell'outerHTML per quei browser che non lo supportano (Firefox)
// ****************************************************
function SetOuterHTML(obj,outer) 
{
	if (obj.outerHTML) 
	{
		obj.outerHTML=outer;
	}
	else
	{
		var r = obj.ownerDocument.createRange();
   	r.setStartBefore(obj);
   	var df = r.createContextualFragment(outer);
   	obj.parentNode.replaceChild(df, obj);
	}
}


// ****************************************************
// Restituisce un array contenente i nodi figli dell'elemento
// ****************************************************
function GetAll(obj)
{
  // Se supportata... la uso
  if (obj.getElementsByTagName)
    return obj.getElementsByTagName('*');
  //
	var f=obj.childNodes;
	var r=new Array(1);
	var i;
	//
	r[0]=obj;
	if (f.length>0)
	{
		for (i=0; i<f.length; i++)
			r = r.concat(GetAll(f[i]));
	}
	return r;
}


// ****************************************************
// Restituisce l'elemento Attivo
// ****************************************************
function GetActiveElement(doc)
{
	var f1 = GetFrame(window.parent.frames,'Main');
	//	
	if (doc.activeElement) 
		return doc.activeElement;
	//
	if (f1.ActiveObjects[doc]!=null) 
		return f1.ActiveObjects[doc];
	//
	return doc.getElementById("cmdcode");
}



// ****************************************************
// Simulazione Popup Menu
// ****************************************************

// Creo funzione PB corretta per il DIV del PopupMenu
if (!parent.pb) 
{
  parent.pb=function(a)
  {
		var f1 = GetFrame(window.parent.frames,"Main");
		f1.pb(a);
	}
}

// ****************************************************
// Costruttore dell'oggetto popup menu
// ****************************************************
function PM(DivName) 
{
	if (!window.PMIdx)
	{ 
		window.PMIdx = 0; 
	}
	if (!window.PMObj)
	{ 
		window.PMObj = new Array(); 
	}
	if (!window.PMLst) 
	{
		window.PMLst = true;
		var f1 = GetFrame(window.parent.frames,"Main");
		f1.document.onclick = PM_HidePMS;
	}
	//
	this.index = PMIdx++;
	//
	PMObj[this.index] = this;
	//
	this.width=0;
	this.height=0;
	this.populated = false;
	this.visible = false;
	this.contents = "";
	this.divname = DivName;
	this.offsetX = 0;
	this.offsetY = 0;
	this.SetPos = PM_SetPos;
	this.Populate = PM_Populate;
	this.Refresh = PM_Refresh;
	this.Show = PM_Show;
	this.Hide = PM_Hide;
}


// ****************************************************
// Setta la posizione del popup in base all'anchor
// ****************************************************
function PM_SetPos(anchor) 
{
	var f1 = GetFrame(window.parent.frames,"Main");	
	var dv = f1.document.getElementById(this.divname);
	//
	var obj = null;
	var objcol = f1.document.getElementsByName(anchor);
	if (objcol.length>0)
		obj = objcol[0];
	else
		obj = f1.document.getElementById(anchor);
	//
	// Per i comandi di menu... cerco il primo oggetto A
	if (anchor.substring(0,1)=='M' && obj.tagName=='DIV')
	{
	  var a = obj.getElementsByTagName('A')[0];
	  if (a)
      obj = a;
	}
  //
	// Se è un LI cerco lo span interno
	if (obj.tagName=='LI')
	{
	  var c = obj.getElementsByTagName('SPAN');
	  if (c.length>0)
  	  obj = c[0];
	}
	//
	var obj_x = 0;
	var obj_y = 0;
	var o = obj;
	while (o)
	{
	  obj_x += o.offsetLeft - o.scrollLeft;
	  obj_y += o.offsetTop - o.scrollTop;
    o = o.offsetParent;
  }
	//
	var x = 0;
	var y = 0;
	switch (PopupDir)
	{
	  case 0: // Right
	    x = obj_x + obj.offsetWidth;
	    y = obj_y;
  	  break;
	  case 1: // Bottom
	    x = obj_x;
	    y = obj_y + obj.offsetHeight;
  	  break;
	  case 2: // Left
	    x = obj_x - Math.max(obj.offsetWidth, dv.offsetWidth);
	    y = obj_y;
  	  break;
	  case 3: // Top
	    x = obj_x;
	    y = obj_y - dv.offsetHeight;
  	  break;
	}
	//
	// Tengo conto dello scroll del body
	x += f1.document.body.scrollLeft;
	y += f1.document.body.scrollTop;
	//
	this.x = x;
	this.y = y;
}


// ****************************************************
// Riempie il contenuto
// ****************************************************
function PM_Populate(html)
{
	this.contents = html;
	this.populated = false;
}

	
// ****************************************************
// Mette a video il popup
// ****************************************************
function PM_Refresh() 
{
	var f1 = GetFrame(window.parent.frames,"Main");
	f1.document.getElementById(this.divname).innerHTML = this.contents;
}


// ****************************************************
// Posiziona e mostra il popup relativamente all'anchor
// ****************************************************
function PM_Show(anchor) 
{	
	var f1 = GetFrame(window.parent.frames,"Main");
	this.SetPos(anchor);
	if (!this.populated && (this.contents != "")) 
	{
		this.populated = true;
		this.Refresh();
	}
	//
	var dv = f1.document.getElementById(this.divname);
	dv.style.left = this.x + "px";
	dv.style.top = this.y + "px";
	dv.style.visibility = "visible";
	dv.style.zIndex = 99;
	dv.style.zOrder = 99;
}


// ****************************************************
// Nasconde il popup
// ****************************************************
function PM_Hide() 
{
	var f1 = GetFrame(window.parent.frames,"Main");
	f1.document.getElementById(this.divname).style.visibility = "hidden";
}


// ******************************************************
// Controlla tra tutte le popup controllando se è il caso di nasconderle
// ******************************************************
function PM_HidePMS(e) 
{
	try
	{
		for (var i=0; i<PMObj.length; i++) 
		{
			if (PMObj[i] != null) 
				PMObj[i].Hide(e);
		}
	}
	catch(ex) {}
}


// **********************************************
// Simula l'apertura modale nei browser che non supportano tale caratteristica
// Crea la funzione mancante
// **********************************************

if (!window.showModalDialog || !document.all) 
{
  window.showModalDialog=function(a,b,c) 
  {
    // preparo gli argomenti
    var targ = new Array();
    var sArgs = new String();
    var rExp = new RegExp();
    rExp = /px/g;
    var S = new String(c);
    if (S) 
    {
			w=0;
			h=0;
      targ = S.split(";");
      maxi = targ.length;
      for (i=0;i<maxi;i++)
      {
        S = new String(targ[i]);
        tThisArg = S.split(":");
        S = new String(tThisArg[0]);
        switch (S.toLowerCase())
        {
	        case "dialogheight":
	          S = new String(tThisArg[1]);
	          sArgs += ",height=" + S.replace(rExp,"");
	          h=S.replace(rExp,"");
	          break;
	        case "dialogleft":
	          S = new String(tThisArg[1]);
	          sArgs += ",left=" + S.replace(rExp,"");
	          break;
	        case "dialogtop":
	          S = new String(tThisArg[1]);
	          sArgs += ",top=" + S.replace(rExp,"");
	          break;
	        case "dialogwidth":
	          S = new String(tThisArg[1]);
	          sArgs += ",width=" + S.replace(rExp,"");
	          w=S.replace(rExp,"");
	          break;
	        case "resizable":
	          S = new String(tThisArg[1]);
	          switch(S) 
	          {
	            case "1":
	            case "yes":
	            case "on":
	          	  sArgs += ",resizable=1";
	            	break;
	          	default :
	            	sArgs += ",resizable=0";
	          }
	          break;
	        case "scroll":
	          S = new String(tThisArg[1]);
	          switch(S) 
	          {
		          case "1":
		          case "yes":
		          case "on":
		            sArgs += ",scrollbars=1";
		            break;
		          default :
		            sArgs += ",scrollbars=0";
	          }          
	          break;
	        case "status":
	          S = new String(tThisArg[1]);
	          switch(S) 
	          {
	            case "1":
	            case "yes":
	              sArgs += ",status=1";
	              break;          
	            default :
	              sArgs += ",status=0";
	          }
	          break;
	          default:
	            //"unadorned"	
	            //"dialoghide"
	            //"center"
	            //"edge"
	            //"help"
	        }
      }
      if (sArgs) 
      {
        sArgs = sArgs.substr(1);
        sArgs += ",menubar=0,titlebar=1,toolbar=0,location=0";
        // per default posiziona la finestra al centro
        if (sArgs.indexOf('left')==-1) sArgs +=",left="+((window.innerWidth-w)/2);
        if (sArgs.indexOf('top')==-1) sArgs +=",top="+((h-window.innerHeight)/2);
      }
			try
			{
				netscape.security.PrivilegeManager.enablePrivilege('UniversalPreferencesRead UniversalBrowserWrite');
			}
			catch(e){}
			var f1=GetFrame(window.parent.frames,"Main");
			f1.ModWnd=window.open(a,'',sArgs);
			netscape.security.PrivilegeManager.enablePrivilege('UniversalPreferencesRead UniversalBrowserWrite');
    }
  }	
}

// ************************************************
// Estrazione degli script eventualmente contenuti
// ed esecuzione posticipata
// ************************************************
function RunScript(h)
{
	var sip = 1;  // Inizio dello script
	var eip = 1;  // Fine dello script
	var f1 = GetFrame(window.parent.frames,'Main');
	while (sip>0)
	{
    // Cerco l'inizio dello script
	  sip = h.indexOf("<!--scr>",eip);
	  if (sip>0)
	  {
      // Cerco la fine dello script
	    eip = h.indexOf("-->",sip);
	    if (eip==0)
	      break; // Non ho trovato la fine dello script
	    else
	    {
	      // Estraggo ed eseguo lo "script"
	      f1.window.setTimeout(h.substring(sip+8,eip),10);
	    }
	  }
	}
}

// *********************************************************
// Stub della funzione chiamata alla fine di ogni richiesta
// per permettere l'esecuzione di codice ulteriore
// *********************************************************
function CustomFunction()
{
}

// ******************************
// Cambia la classe dell'oggetto passato
// a seconda del valore di [selected]
// ******************************
function ObjHover(id, BaseClass, selected)
{
  try
  {
    document.getElementById(id).className = (selected)? BaseClass + " " + BaseClass + 'Sel' : BaseClass;
  }
  catch (ex) {}
}
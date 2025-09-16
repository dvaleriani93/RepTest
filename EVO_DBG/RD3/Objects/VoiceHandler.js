// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe VoiceHandler
// ************************************************

function VoiceHandler()
{
  this.Identifier = "voice";          // Identificatore di questo oggetto
  this.Enabled = false;               // Indica se i comandi vocali sono abilitati
  this.Listening = false;             // Indica se sta ascoltando o no
  //
  this.Realized = false;              // Indica se l'handler e' stato realizzato
  this.StartTimestamp = null;					// Istante in cui e' iniziato l'ascolto
  this.Recognition = null;            // Oggetto speech-to-text
  this.AutoCommitTimer = 0;           // Usato per "auto-confermare" il testo qualora non ancora confermato
  this.FakeWords = 0;                 // Numero di parole da mangiare dopo aver "auto-confermato" (il browser non sa che ho confermato io)
  //
  // Oggetti visuali
  this.MicroExt = null;
  this.MicroInt = null;
  this.Bubble = null;
  this.BubbleWhisker = null;
	this.TextNode = null;
	//
	this.MITimer1 = 0;
	this.HMTimer1 = 0;
	this.HMTimer2 = 0;
  //  
  this.MessageBoxDlg = null;          // MsgBox da controllare vocalmente
  //
  // Colori dei messaggi
  this.COLOR_WELCOME  = "gray";
  this.COLOR_SPEECH   = "black";
  this.COLOR_COMMAND  = "blue";
  this.COLOR_RESPONSE = "green";
  this.COLOR_ERROR    = "red";
  //
  this.TIMEOUT_RESPONSE = 5000;
}

VoiceHandler.VoiceLanguages =
{
  'ITA': 'it_IT',
  'ENG': 'en_US'
};

// *******************************************************************
// Inizializza questo VoiceHandler leggendo i dati da un nodo <voice> XML
// *******************************************************************
VoiceHandler.prototype.LoadFromXml = function(node) 
{
  if (node.nodeName != this.Identifier)
    return;
  //
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
VoiceHandler.prototype.ChangeProperties = function(node)
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
VoiceHandler.prototype.LoadProperties = function(node)
{
  // Ciclo su tutti gli attributi del nodo
  var attrlist = node.attributes;
  var n = attrlist.length;
  for (var i=0; i<n; i++)
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    //
    switch(nome)
    {
      case "lst": this.SetListening(valore=="1"); break;
      case "rsp": this.SetResponse(valore); break;
      case "ena": this.Enabled = (valore=="1"); break;
      case "say": this.Say(valore); break;
      
      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
      break;
    }
  }
}


// ***************************************************************
// 
// ***************************************************************
VoiceHandler.prototype.SetListening = function(value, clientSide)
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  var old = this.Listening;
  if (value!=undefined)
    this.Listening = value;
  //
  // Se l'operazione e' avvenuta lato client ed il valore del listening e' cambiato
  if (clientSide && old != this.Listening)
  {
    // Avviso il server (cosi' rimane sincrono con me)
    var e = new IDEvent("voice", this.Identifier, null, RD3_Glb.EVENT_ACTIVE, "", "lst", (this.Listening?"1":"0"));
  }
  //
  if (this.Realized && (value==undefined || old!=this.Listening))
  {
    if (this.Listening)
    {
    	// Faccio vedere il microfono
    	this.ShowMicro();
	   	this.ShowMessage(ClientMessages.IDV_WELCOME_MSG, this.COLOR_WELCOME);
	    //	
	    // Inizia ad ascoltare
      if (RD3_ShellObject.IsInsideShell())
        RD3_ShellObject.StartListen(VoiceHandler.VoiceLanguages[RD3_AppLanguage], 2, 1);
      else
	      this.Recognition.start();
    }
    else
    {
    	// Nascondo il microfono
    	this.HideMicro();
    	//
    	// Fermo l'ascolto
      if (RD3_ShellObject.IsInsideShell())
        RD3_ShellObject.StopListen();
      else
	      this.Recognition.stop();
    }
  }
}

// ***************************************************************
// Il server mi ha detto cosa ha fatto
// ***************************************************************
VoiceHandler.prototype.SetResponse = function(value)
{
  if (this.Realized)
  {
  	this.ShowMessage(value, this.COLOR_RESPONSE, this.TIMEOUT_RESPONSE);
	  this.HideMessage(this.TIMEOUT_RESPONSE);
  }
}


// *********************************
// Il server mi ha detto cosa dire
// *********************************
VoiceHandler.prototype.Say = function(txt)
{
  if (RD3_ShellObject.IsInsideShell())
  {
    RD3_ShellObject.Say(txt, VoiceHandler.VoiceLanguages[RD3_AppLanguage], 0.2);
    return;
  }
  //
  try
  {
    var u = new SpeechSynthesisUtterance();
    u.text = txt;
    u.lang = VoiceHandler.VoiceLanguages[RD3_AppLanguage];
    speechSynthesis.speak(u);
  }
  catch (ex)
  {
    WriteToConsole("Unsupported feature (SAY)", "error");
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
VoiceHandler.prototype.Realize = function()
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  // Dentro alla shell non si usa il webkitSpeechRecognition
  if (!RD3_ShellObject.IsInsideShell())
  {
	  if (!("webkitSpeechRecognition" in window))
	  	return;
	  //
	  this.Recognition = new webkitSpeechRecognition();
	  this.Recognition.continuous = true;
	  this.Recognition.interimResults = true;
	  this.Recognition.lang = (RD3_AppLanguage=="ITA")?"it_IT":"en";
	}
  //
  // crea il div  
  this.MicroExt = document.createElement("div");
  this.MicroExt.setAttribute("id", this.Identifier + "-microext");
  this.MicroExt.className = "voice-microext";
  this.MicroExt.style.display = "none";
  RD3_DesktopManager.WebEntryPoint.WepBox.appendChild(this.MicroExt);
  //
  this.MicroInt = document.createElement("div");
  this.MicroInt.setAttribute("id", this.Identifier + "-microint");
  this.MicroInt.className = "voice-microint";
  this.MicroExt.appendChild(this.MicroInt);
  //
  this.Bubble = document.createElement("div");
  this.Bubble.setAttribute("id", this.Identifier + "-bubble");
  this.Bubble.className = "voice-bubble";
  this.Bubble.style.display = "none";
  RD3_DesktopManager.WebEntryPoint.WepBox.appendChild(this.Bubble);
  //
  this.TextNode = document.createElement("span");
  this.Bubble.appendChild(this.TextNode);
  //
  this.BubbleWhisker = document.createElement("div");
  this.BubbleWhisker.setAttribute("id", this.Identifier + "-bubblewhisker");
  this.BubbleWhisker.className = "voice-bubble-whisker";
  this.Bubble.appendChild(this.BubbleWhisker);
  //
  this.Realized = true;
  //
  // Mi aggiungo nella mappa degli oggetti
  RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
  //
  if (!RD3_ShellObject.IsInsideShell())
  {
	  // Evento che si scatena quando viene riconosciuta un frase
	  this.Recognition.onresult = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnResult', ev)");
	  //
	  // Evento che si scatena quando lo user agent inizia a catturare l'audio
	  this.Recognition.onaudiostart = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnAudioStart', ev)");
	  //
	  // Evento che si scatena quando si verifica un errore
	  this.Recognition.onerror = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnError', ev)");
	  //
	  // Evento che si scatena quando si inizia a catturare l'audio
	  this.Recognition.onstart = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnStart', ev)");
	  //
	  // Evento che si scatena quando si finisce di catturare l'audio
	  this.Recognition.onend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEnd', ev)");
	}
  //
  // Attacco gli eventi che mi servono per gestire tasti e mouse
  var md = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseDown', ev)");
  var kd = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyDown', ev)");
  if (document.addEventListener)
  {
    document.addEventListener("mousedown", md, false); 
    document.body.addEventListener("keydown", kd, true);
  }
  //
  this.SetListening();
}

// ***************************************************************
// Cancella gli oggetti DOM collegati a questo oggetto
// ***************************************************************
VoiceHandler.prototype.Unrealize = function()
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap[this.Identifier] = null;
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  this.Realized = false;
}

// ***************************************************************
// Adatta l'oggetto DOM associato al voice handler
// ***************************************************************
VoiceHandler.prototype.AdaptLayout = function()
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  if (this.Realized)
  {
  	var x = window.innerWidth;
		var y = window.innerHeight;
		//
		if (this.TextNode.offsetHeight>0)
			this.Bubble.style.height = this.TextNode.offsetHeight+"px";
		//
		var mw = this.MicroExt.offsetWidth;
		var mh = this.MicroExt.offsetHeight;
		var bw = this.Bubble.offsetWidth;
		var bh = this.Bubble.offsetHeight;
		var ww = this.BubbleWhisker.offsetWidth;
		var wh = this.BubbleWhisker.offsetHeight;
		//
		this.MicroExt.style.left = (x / 2 - mw/2)+"px";
		this.MicroExt.style.top = (y - mh - 20) + "px";
		//
		this.Bubble.style.left = (x / 2 - bw/2) + "px";
		this.Bubble.style.top = (y  - mh - 20 - bh - 30) + "px";
		// 
		// w e' relativo
		this.BubbleWhisker.style.left = (bw / 2 - ww/2 - 2) + "px";
		this.BubbleWhisker.style.top = (bh - wh /2 - 4) + "px";
  }
}

// ********************************************************
//  Notificato quando si inizia ad ascoltare l'audio
// ********************************************************
VoiceHandler.prototype.OnStart = function(ev)
{
  this.StartTimestamp = ev.timeStamp;
  this.AutoCommitTimer = window.setTimeout('RD3_DesktopManager.WebEntryPoint.VoiceObj.OnAutoCommit()', RD3_ClientParams.VoiceAutoCommitDelay);
}

// ***************************************************************
// Notificato quando viene riconosciuta una frase
// ***************************************************************
VoiceHandler.prototype.OnResult = function(ev)
{   
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
	// Messaggio arrivato troppo tardi? 
	if (!this.Listening)
		return;
	//
	var txt = "";
	var fin = false;
	//
  if (typeof(ev.results) != 'undefined')
  {
    for (var i = ev.resultIndex; i < ev.results.length; ++i) 
    {
    	txt += ev.results[i][0].transcript;
    	if (ev.results[i].isFinal)
    		fin = true;
    }
    //
    // E' arrivato qualcosa, riprogrammo il timer di auto-commit
    if (this.AutoCommitTimer && !ev.autoCommit)
    {
      window.clearTimeout(this.AutoCommitTimer);
      //
      // Se il browser non ha confermato, mi segno di provarci io tra poco
      if (!fin)
        this.AutoCommitTimer = window.setTimeout('RD3_DesktopManager.WebEntryPoint.VoiceObj.OnAutoCommit()', RD3_ClientParams.VoiceAutoCommitDelay);
    }
  }
  //
  // Elimino la parte di testo gia' inviata con l'auto-commit
  if (this.FakeWords > 0 && !ev.autoCommit)
    txt = txt.split(/\b\s+/).splice(this.FakeWords).join(' ')
  //
  if (txt!="")
  	this.ShowMessage(txt, fin?this.COLOR_COMMAND:this.COLOR_SPEECH);
  //
  if (fin && txt != "")
  {
    // Se c'e' una messageBox aperta piloto lei, altrimenti comunico il testo al server
    if (this.MessageBoxDlg)
    {
      this.MessageBoxDlg.OnVoiceCommand(txt);
    }
    else
    {
      var e = new IDEvent("voice", this.Identifier, ev, RD3_Glb.EVENT_ACTIVE, "", "txt", txt);
    }
  }
  //
  // Se e' una conferma (del browser o dell'auto-commit)
  if (fin)
  {
    // Se e' una conferma dell'auto-commit devo aggiungere all'elenco di parole da mangiare le nuove parole arrivate
    // Se e' una conferma del browser, da adesso non mangio piu'
    if (ev.autoCommit)
      this.FakeWords += txt.split(/\b\s+/).length;
    else
      this.FakeWords = 0;
  }
}

// *******************************************************************
// Timer periodico per l'invio automatico allo scadere di un timeout
// *******************************************************************
VoiceHandler.prototype.OnAutoCommit = function()
{
  var txt = this.TextNode.innerHTML;
  var col = this.Bubble.style.color;
  //
  // Se c'e' del testo non confermato e il testo e' cambiato dall'ultima volta che ho inviato al server
  if (txt != "" && col == this.COLOR_SPEECH)
  {
    // Creo un oggetto result per inviare il testo
    var ev = { results: {0: {0: { transcript:txt }, isFinal:true }, length:1 }, resultIndex:0, autoCommit:1 };
    this.OnResult(ev);
  }
}

// ***************************************************************
// Notificato quando si inizia a catturare l'audio
// ***************************************************************
VoiceHandler.prototype.OnAudioStart = function(ev)
{
	;
}

// ***************************************************************
// Notificato quando si verifica un errore
// ***************************************************************
VoiceHandler.prototype.OnError = function(ev)
{
	var txt;
  if (ev.error == 'no-speech')
    txt = ClientMessages.IDV_ERROR_SILENCE;
  if (ev.error == 'audio-capture')
    txt = ClientMessages.IDV_ERROR_NOMICRO;
  if (ev.error == 'not-allowed')
  {
    if (ev.timeStamp - this.StartTimestamp < 100)
      txt = ClientMessages.IDV_ERROR_BLOCKED;
    else
      txt = ClientMessages.IDV_ERROR_DENIED;
  }
  //
  if(txt != "")
    this.ShowMessage(txt, this.COLOR_ERROR);
  //
  // TODO: dopo 5 secondi
  this.HideMessage(this.TIMEOUT_RESPONSE);
	//
	// Fermo il timer dell'auto-commit
	if (this.AutoCommitTimer)
	{
    window.clearTimeout(this.AutoCommitTimer);
    this.AutoCommitTimer = 0;
  }
}

// ********************************************************
//  Notificato quando si finisce di ascoltare
// ********************************************************
VoiceHandler.prototype.OnEnd = function(ev)
{
	if (this.Listening)
	{
		this.SetListening(false, true);
	}
	//
	// Fermo il timer dell'auto-commit
	if (this.AutoCommitTimer)
	{
    window.clearTimeout(this.AutoCommitTimer);
    this.AutoCommitTimer = 0;
  }
}


// *************************************************************************************************
//  Notificato quando viene intercettata la combinazione di tasti che attiva o disattiva l'ascolto
// *************************************************************************************************
VoiceHandler.prototype.OnKeyDown = function(ev)
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  // se alt ctrl o shift
  var eve = (window.event)?window.event:ev;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  //
  if (eve.ctrlKey && code == 32 && !this.Listening) // CTRL + SPAZIO
  {
    this.SetListening(true, true);
    RD3_Glb.StopEvent(ev);
  }
  else if (code == 27 && this.Listening) // ESC
  {
    this.SetListening(false, true);
    RD3_Glb.StopEvent(ev);
  }
}

// *************************************************************************************************
//  Gestione del click
// *************************************************************************************************
VoiceHandler.prototype.OnMouseDown = function(ev)
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  var srcobj = (window.event)?window.event.srcElement:ev.explicitOriginalTarget;
  while (srcobj)
  {
    // Se ho trovato il mio oggetto radice, hanno cliccato dentro di me
    if (srcobj == this.MicroExt || srcobj == this.Bubble)
      return;
    //
    srcobj = srcobj.parentNode;
  }
  //
  // Se sono qui, hanno cliccato fuori di me... fermo la registrazione se avviata
  if (!RD3_ShellObject.IsInsideShell())
  	this.SetListening(false, true);
}

// *************************************************************************************************
//  Per pilotare le message box con la voce
// *************************************************************************************************
VoiceHandler.prototype.HandleMessageBox = function(text, type, options, msgboxDlg)
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  if (msgboxDlg)
    this.MessageBoxDlg = msgboxDlg;
  else
    this.ShowMessage(text, this.COLOR_RESPONSE);
  //
  this.Say(text);
}

VoiceHandler.prototype.OnCloseMessageBox = function(msgboxDlg)
{
  // Se non abilitato, non faccio nulla
  if (!this.Enabled)
    return;
  //
  // Se si e' chiusa la mia MessageBox, mi stacco da lei
  if (this.MessageBoxDlg == msgboxDlg)
    this.MessageBoxDlg = null;
}


VoiceHandler.prototype.ShowMicro = function()
{
	window.clearTimeout(this.MITimer1);
	this.MITimer1 = 0;
	this.MicroExt.style.display = "";
	var sc = "RD3_Glb.SetTransform(document.getElementById('"+ this.MicroExt.id+"'), 'scale3d(1,1,1)');";
  sc += "document.getElementById('"+ this.MicroExt.id+"').style.opacity=1;";
	window.setTimeout(sc, 30);
}

VoiceHandler.prototype.HideMicro = function()
{
	this.HideMessage(0);
	this.MicroExt.style.webkitTransform="scale3d(2,2,1)";
	this.MicroExt.style.opacity=0;
	var sc = "document.getElementById('"+ this.MicroExt.id+"').style.display='none';";
	this.MITimer1 = window.setTimeout(sc, 250);
}

VoiceHandler.prototype.ShowMessage = function(txt, color)
{
	window.clearTimeout(this.HMTimer1);
	window.clearTimeout(this.HMTimer2);
	this.HMTimer1 = 0;
	this.HMTimer2 = 0;
	//
	if (!this.Listening)
		return;
	//
	this.Bubble.style.display = "";
	this.TextNode.innerHTML = txt;
	this.Bubble.style.color = color;
	this.AdaptLayout();
	if (this.Bubble.style.opacity!=1)
	{
		var sc = "document.getElementById('"+ this.Bubble.id+"').style.opacity=1;";
		window.setTimeout(sc, 150);
	}
}

VoiceHandler.prototype.HideMessage = function(tout)
{
	if (tout==0)
		this.Bubble.style.display = "none";
	else
	{
		var sc = "document.getElementById('"+ this.Bubble.id+"').style.opacity=0;";
		this.HMTimer1 = window.setTimeout(sc, tout);
		sc = "document.getElementById('"+ this.Bubble.id+"').style.display='none';";
		this.HMTimer2 = window.setTimeout(sc, tout+250);
	}
}

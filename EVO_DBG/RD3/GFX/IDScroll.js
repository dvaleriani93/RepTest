// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2012 Pro Gamma Srl - All rights reserved
//
// Classe IDSCroll: gestisce lo scrolling con il mouse
// le dita e la rotella di tutti i DIV rispetto al container
// ************************************************

function IDScroll(ident, divsrc, divcnt, p)
{
  this.Identifier = ident+":scroll";
	//
	this.MyBox = divsrc;
	this.Owner = p
	this.Active = false;
	this.Moving = false;
	this.CanSwipe = true;
	this.Swiping = false;
	this.AllowXScroll = false;
	this.AllowYScroll = true;
	this.ScrollInput = RD3_ClientParams.IDScrollInput;   // Se true permette di scrollare le liste anche toccando sugli input
	this.ScrollDirection = -1; // -1, da decidere, 0=X, 1=Y
	this.MarginTop = 0;           // margine superiore ulteriore
	this.MarginBottom = 0;        // margine inferiore ulteriore
	this.DisplayScrollbar = true;
	this.Enabled = true;       // Scroll abilitata o meno (se disabilitata non fa nulla)
	this.PullTrigger = 0;      // Trigger oltre al quale viene inviato un messaggio all'owner
	this.Reflecting = 0;       // Invio i miei messaggi all'Owner 0- non so se devo riflettere 1- devo riflettere -1 non devo riflettere
	this.ForceSnap = true;     // Se vero forzo effettivamente lo snap, altrimenti vale solo per il calcolo della pagina
	this.PageRange = 0;        // Se maggiore di zero, con snap attivo identifica il max numero di pagine di cui e' possibile spostarsi in una sola operazione
	//
	this.mm = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseMove', ev)");  
	this.md = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseDown', ev)");  
	this.mu = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseUp', ev)");
	this.mo = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseOut', ev)");
	this.mw = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseWheel', ev)");
	this.ea = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)");
	this.ge = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnGestureEnd', ev)");
	//
	// Definizione array usati internamente
	this.MA = new Array();   // dimensioni MyBox
	this.CA = new Array();   // dimensioni Container
	this.TA = new Array();   // traslazione attuale
	this.Max = new Array();  // spostamento massimo ammesso
	this.Min = new Array();  // spostamento minimo  ammesso
	this.Snap = new Array(); // punti dove fermarsi in X e Y
	//
	this.Start = null;       // punto iniziale dello scroll, memorizzato in touchdown
	this.Att   = null;       // punto attuale dello scroll,  memorizzato in touchmove
	this.End   = null;       // punto finale dello scroll,   memorizzato in touchup
	this.Org   = null;       // posizioni di traslazione originale all'inizio dell scroll
	this.TouchTimes = null;  // tempi per il calcolo della velocita' di spostamento
	this.TouchPos = null;    // posizioni per il calcolo della velocita' di spostamento
	//
	this.LA = null;         // Limite animazione
	this.VA = null;         // Velocita' attuale (non e' un array)
	this.MO = null;         // punto finale a cui arrivare al secondo step dell'animazione
	this.TT = null;         // tempo in ms per l'animazione
	//
	this.SetContainer(divcnt);
	//
	RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
	//
	this.LastMove = null;
}


IDScroll.prototype.Unrealize = function()
{
	if (this.Scrollbar)
	{
		for (var d = 0; d<2; d++)
		{
			if (this.Scrollbar[d])
			{
				this.Scrollbar[d].parentNode.removeChild(this.Scrollbar[d]);
				this.Scrollbar[d] = null;
			}
		}
	}
	// Mi tolgo dalla mappa degli oggetti
	RD3_DesktopManager.ObjectMap[this.Identifier] = null;
	RD3_DesktopManager.ObjectMap.remove(this.Identifier);
	//
	if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
	{
	  this.ContainerBox.removeEventListener("touchmove", this.mm, true); 
	  this.ContainerBox.removeEventListener("touchstart", this.md, true); 
	  this.ContainerBox.removeEventListener("touchend", this.mu, true);
	  this.ContainerBox.removeEventListener("touchcancel", this.mo, true);
	  this.ContainerBox.removeEventListener("gestureend", this.ge, true);
	}
	else
	{
	  this.ContainerBox.removeEventListener("mousemove", this.mm, true); 
	  this.ContainerBox.removeEventListener("mousedown", this.md, true); 
	  this.ContainerBox.removeEventListener("mouseup", this.mu, true);
	  this.ContainerBox.removeEventListener("mouseout", this.mo, true);
	  this.ContainerBox.removeEventListener("mousewheel", this.mw, true);
	}
  if (this.MyBox)
    RD3_Glb.RemoveEndTransaction(this.MyBox, this.ea, true);
}


IDScroll.prototype.SetBox = function(divsrc)
{
	if (this.Moving)
		this.MyNewBox = divsrc;
	else
	{
		this.MyBox = divsrc;
		//
		// resetto i contatori di traslazione per
		// il change size / gotop successivo
		this.TA = new Array(-200,-200);
		this.TouchTimes = null;
    //
    // E' cambiato il mio MyBox -> ricalcolo i limiti dato il nuovo MyBox
		this.CalcLimits();
	}
}


IDScroll.prototype.OnMouseDown = function(ev, reflected)
{
  // Se uso le zone passo comunque il click al gestore, per chiudere eventuali zone unpinned
  if (RD3_DesktopManager.WebEntryPoint.UseZones())
  {
    for (var pos=2; pos<=5; pos++)
    {
      // La zona ha gestito il click, non lo devo gestire io
      if(!RD3_DesktopManager.WebEntryPoint.GetScreenZone(pos).OnMouseDown(ev))
        return;
    }
  }
  //
  if (!this.Enabled)
    return;
  //
  if (reflected == undefined)
    reflected = false;
  //
  this.CanSwipe = true;
	this.Swiping = false;
	this.Reflecting = 0;
	this.NumMove = 0;
  //
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
    return false;
  //
  var targetEl = ev.target ? ev.target : ev.srcElement;
  //
  var s = window.getComputedStyle(this.MyBox);
  if (s.visibility=="hidden" || s.display=="none" || (ev.button!=0 && !RD3_Glb.IsMobile()))
    return;
  if (this.Owner && targetEl == this.Owner.ScrollBoxMobile)
    return;
  if (this.Owner && targetEl == this.Owner.SearchBox)
    return;
	if (this.Owner && targetEl == this.Owner.SwipeButton)
    return;
  if (this.Owner && targetEl == this.Owner.MoreButton)
    return;
  //
  // Se ho toccato su un input, esco. A meno che non sia richiesto
  // lo scroll anche sugli input
  if (!this.ScrollInput || this.SkipEvent)
  {
	  if (this.CheckInput(ev))
	  {
	    this.SkipEvent = false;
	  	return;
	  }
	}
	//
	// Se l'owner e' un webframe, l'oggetto target deve appartenere a lui
  var isGraph = false;
	if (this.Owner && this.Owner instanceof WebFrame)
	{
	  // Ottengo l'oggetto di modello a cui sono associato (non obbligatoriamente e' l'owner, come nel caso della Combo)
	  var o = RD3_DDManager.GetObject(this.Identifier.substr(0, this.Identifier.length-7));
	  //
	  // Se l'oggetto a cui sono associato e' una combo con Slide non devo fare il controllo: e' a tutto schermo
	  var isCombo = o && o instanceof IDCombo && o.SlideForm();
	  var dontCheck = isCombo || reflected;
    var objParentFrame = RD3_Glb.GetParentFrame(targetEl);
    //
    // Caso speciale: se si tratta di un grafico contenuto in un pannello allora scrolliamo il pannelo esterno
    // (tanto i grafici non scrollano)
    if (objParentFrame && objParentFrame instanceof Graph && objParentFrame.ParentFrameIdentifier) {
      var f = RD3_DesktopManager.ObjectMap[objParentFrame.ParentFrameIdentifier];
      if (f && f instanceof PField) {
        objParentFrame = f.ParentPanel;
        isGraph = true;
      }
    }
    //
		if (!dontCheck && (objParentFrame != this.Owner))
			return;
	}
  //
  // I CANVAS li salto (altrimenti non riuscirei a scrivere nella Signature), ma se il canvas e' quello di un grafico 
  // e ho accettato il suo scroll allora vado avanti
  if (targetEl.tagName == "CANVAS" && !isGraph)
    return;
	//
	// Controllo che qualcuno dei padri dell'oggetto non sia di tipo overflow:scroll
	if (RD3_Glb.CanScroll(targetEl))
	{
	  // Ho cliccato su una Textarea con SCROLL: se non puo' scrollare la gestisco io, altrimenti la faccio gestire a lui
	  if (targetEl.tagName == "TEXTAREA" && this.ScrollInput)
	  {
	    // Su simulatore o se c'e' la tastiera aperta non faccio nulla (su Ios)
	    if (window.pageYOffset>0 || !RD3_Glb.IsTouch())
        return;
      //
	    // Se la TXT puo' scrollare devo verificare dove tocco
	    if (targetEl.scrollHeight > targetEl.offsetHeight);
	    {
	      var y = (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true)) ? ev.targetTouches[0].clientY : ev.clientY;
	      var offs = Math.floor(parseInt(RD3_Glb.GetStyleProp(targetEl, "height"), 10) / 3);
	      //
	      // Se la txt e' all'inizio ed io tocco entro il primo terzo allora faccio scrollare IDSCROLL, 
	      // altrimenti faccio scrollare la Txt
	      var stopIDScroll = true;
	      if (targetEl.scrollTop == 0 && (y < RD3_Glb.GetScreenTop(targetEl, true)+offs))
	        stopIDScroll = false;
        //
        // Se la txt e' alla fine ed io tocco nell'ultimo terzo allora faccio scrollare IDSCROLL, 
	      // altrimenti faccio scrollare la Txt
	      if ((targetEl.scrollTop+targetEl.offsetHeight >= targetEl.scrollHeight) && (y>= (RD3_Glb.GetScreenTop(targetEl, true)+offs*2)))
	        stopIDScroll = false;
	      //
	      if (stopIDScroll)
	        return;
	    }
	  }
	  else
		  return;
	}
  //
  // Chiudo la message bar se c'e'
  if (this.Owner && this.Owner.WebForm)
  	this.Owner.WebForm.OpenMessageBar(-1);
  //
 	// Chiudo lo swipe button se c'e'
  if (this.Owner && this.Owner instanceof IDPanel)
  {
  	if (this.Owner.SetSwipe(false))
  		return;
  }
	//
	if (this.AllowXScroll)
		this.InitScrollbar(0);
	if (this.AllowYScroll)
		this.InitScrollbar(1);
	//
	this.Active = true;
	this.EventSent = false;	
	//
	if (ev)
	{
	  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
	  {
	    if (ev.targetTouches.length != 1)
	    {
	    	this.Active = false;
	      return false;
	    }
	    //
	    // Attivo il timer di click su input: se non mi muovo per 150 milli allora rilancia l'evento che si era perso 
	    // (serve per far funzionare la lente di ingrandimento su touch)
	    if (RD3_Glb.IsTouch() && (targetEl.tagName == "INPUT" || targetEl.tagName == "TEXTAREA" || RD3_Glb.isInsideEditor(targetEl)))
	      this.SetInputTimer(true, ev);
	    //
	    ev.preventDefault();
	    this.Start = new Array(ev.targetTouches[0].clientX,ev.targetTouches[0].clientY);
		}
		else
		{
			this.Start = new Array(ev.clientX,ev.clientY);
		}
		//
		// Vediamo quale oggetto sto toccando
		var tobj = targetEl;
		if (tobj.tagName == undefined)
			tobj = tobj.parentNode;
		var sobj = this.GetObj(tobj);
		//
		if (sobj && sobj.OnTouchDown && !this.Moving)
		{
			var ok = sobj.OnTouchDown(ev, this.ScrollInput);
			if (!ok)
			{
				this.Active = false;
				return;
			}
			this.Clicking = true;
		}
		//
		// Gestione DD
		var ddid = RD3_Glb.GetRD3ObjectId(targetEl);
		var ddobj = RD3_DDManager.GetObject(ddid);
		if (ddobj && ( (ddobj.IsDraggable && ddobj.IsDraggable(ddid)) || (ddobj.IsTransformable && ddobj.IsTransformable(ddid)) ) )
    	this.SetDDTimer(true,ev);
	  //
    // Nel caso di grafici contenuti in sottopannelli non devo bloccare l'evento, altrimenti GChart non riesce a mostrare i tooltip
    if (!isGraph)
	    RD3_Glb.StopEvent(ev);
	}
	//
	this.Att = this.Start;
	//
	this.Matrix = RD3_Glb.GetTransform(s).replace(/[^0-9-.,]/g, '').split(',');
	if (RD3_Glb.IsIE(10, true))
  {
    // In IE non si puo' piu' usare il computed style: converte il translate3d in una matrix3d da cui non e' possibile estrarre le coordinate
    var tr = RD3_Glb.GetTransform(this.MyBox.style).replace(/3d/g, '');   // tanslate3d.. va rimosso il 3d perche' da' problemi dopo (e' un numero).
    var m = tr.replace(/[^0-9-.,]/g, '').split(',');
    var mtx = 0;
    var mty = 0;
    try {
      mty = parseInt(m[1]);
      mtx = parseInt(m[0]);
      //
      if (isNaN(mty))
        mty=0;
      if (isNaN(mtx))
        mtx=0;
    }
    catch (ex) {
    }
	  this.Org = new Array(mtx, mty);
  }
	else
  	this.Org = new Array(parseInt(this.Matrix[4]),parseInt(this.Matrix[5]));
	//
	// Se clicco mentre mi sto muovendo devo fermare lo scroll... ma questo su Android non funziona per un suo baco..
	// per farlo non devo mettere la durata a 0 ma ad 1.. pero' se poi mi muovo allora la devo rimettere a 0, altrimenti lo scroll fa schifo!
	RD3_Glb.SetTransitionDuration(this.MyBox, (RD3_Glb.IsAndroid() && this.Moving) ? "1ms" : "0ms");
	RD3_Glb.SetTransitionProperty(this.MyBox, "-webkit-transform");
	RD3_Glb.SetTransform(this.MyBox, "translate3d("+this.Org[0]+"px,"+this.Org[1]+"px, 0px)");
	RD3_Glb.RemoveEndTransaction(this.MyBox, this.ea, true);
	//
	// Se mi sono fermato in un certo punto, durante lo scroll di un book, 
	// chiedo la pagina corrispondente. Tengo conto di un offset di 2 px nel posizionamento della pagina
	if (this.AllowXScroll && this.Moving)
		this.SendPageEvent(ev,0,this.Org[0]-2);
	//
	this.ScrollDirection = this.AllowXScroll?-1:(this.AllowYScroll?1:-1);
	if (this.AllowYScroll)
	{
		this.PositionScrollbar(1);
		this.HideScrollbar(1);
	}
	//
	this.Moving = false;
	this.LA = null;
	this.VA = null;
	this.MO = null;
	this.TA = new Array();   // traslazione attuale
	//
	// Calcolo MAX e MIN in base alle dimensioni attuali.
	this.CalcLimits();
	//
	// Dati per la velocita'
	this.TouchTimes  = new Array();
	this.TouchPos = new Array();
  this.TouchTimes.push(new Date());
  this.TouchPos.push(this.Att);
}

IDScroll.prototype.OnMouseMove = function(ev, reflected)
{
	if (!this.Active || !this.Enabled)
		return;
	//
  if (!reflected)
    reflected = false;
  //
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
    return false;  		
  //
  // Su IE10 Touch il dispositivo non regge troppi move: ne salto 1 ogni 3
  if (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch())
  {
    this.NumMove++;
    if (this.NumMove%2 == 1)
      return;
  }
  //
	if (ev)
	{
	  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
	  {
	    if (ev.targetTouches.length != 1)
	    {
	  		this.Active = false;
	      return false;
	    }
	    ev.preventDefault();
	    this.Att = new Array(ev.targetTouches[0].clientX,ev.targetTouches[0].clientY);
		}
		else
		{
		  this.Att = new Array(ev.clientX,ev.clientY);
		}
	}
	//
	var wasmoving = this.Moving;
	var targetEl = ev.target ? ev.target : ev.srcElement;
	//
	// Se mi muovo per piu' di 10px, allora attivo il movimento vero e proprio
	var dx = Math.abs(this.Att[0]-this.Start[0]);
	var dy = Math.abs(this.Att[1]-this.Start[1]);
	//
	if (dx>4 || dy>4)
	{
		if (this.ScrollDirection==-1 && (this.AllowXScroll||this.AllowYScroll))
			this.ScrollDirection = (dx>dy && this.AllowXScroll)?0:1;
	}
	//
	if (dx>10 || dy>10)
	{
    this.SetDDTimer(false);
    this.SetInputTimer(false);
		this.Moving = true;	
		if (!wasmoving)
		{
			this.CanSwipe = (dy<=10);
			//
			var sobj = this.GetObj(targetEl);
			if (sobj && sobj.OnTouchUp)
				sobj.OnTouchUp(ev,false);
			//
			// Attivo anche la scrollbar
			if (this.ScrollDirection!=-1)
				this.ShowScrollbar(this.ScrollDirection);
		}
	}
	//
	// Devo gestire la riflessione se:
	// - non ho ancora deciso se riflettere o meno e mi sto spostando in una direzione non gestita (dopo il tap)
	// - ho gia' deciso che devo riflettere
	var realScrollDir = (dx>dy)?0:1;
	var HandleReflection = this.Reflecting==0 && this.Moving && ((realScrollDir==0 && !this.AllowXScroll) || (realScrollDir==1 && !this.AllowYScroll));
	HandleReflection = HandleReflection || this.Reflecting==1;
	//
	if (HandleReflection)
	{
		if (this.Owner && this.Owner instanceof WebFrame)
		{
		  if (this.Reflecting == 1)
		  {
		    this.Owner.OnReflectMouseMove(ev, true);
		  }
		  else if (this.Reflecting == 0)
		  {
		    this.Reflecting = this.Owner.OnReflectMouseDown(ev, true, realScrollDir);
		  }
		}
		//
		this.HideScrollbar(0);
		this.HideScrollbar(1);
		//
		// Se sto riflettendo non faccio nulla..
		if (this.Reflecting == 1)
		  return;
	}
	//
	if (this.ScrollDirection==1 && this.PullTrigger>0 && this.Att[1]>this.Start[1])
	{
		var ddy = dy+this.Org[1]*2;
		if (this.Owner && this.Owner.OnPullTrigger)
			this.Owner.OnPullTrigger((this.Org[1]>=0)?(ddy>this.PullTrigger*2):false, (this.Org[1]>=0)?(ddy-this.PullTrigger*2):0, false, ev);
	}
	//
	// Mando messaggio swipe?
	if (dx>24 && dy<10 && this.Moving && !this.Swiping && !this.AllowXScroll && this.CanSwipe)
	{
		this.Swiping = true;
		this.HideScrollbar(1);
		var sobj = this.GetObj(targetEl);
		if (sobj && sobj.OnSwipe)
			sobj.OnSwipe(ev,this.Att[0]>this.Start[0]);
	}
	//
	// Calcolo posizione attuale
	var aa = new Array();
	for (var d=0; d<2; d++)
	{
		// tengo conto che il cerca era esposto...
		var delta = 0;
		if (d==1 && this.Org[d]==this.MarginTop)
			delta = this.MarginTop;
		//
		aa[d] = this.Org[d]+this.Att[d]-this.Start[d];
		if (d==0 && (!this.AllowXScroll)||this.Swiping)
			aa[d] = this.Org[d];
		if (d==1 && (!this.AllowYScroll)||this.Swiping)
			aa[d] = this.Org[d];
		if (d!=this.ScrollDirection && this.ScrollDirection>-1)
			aa[d] = this.Org[d];
		//
		if (aa[d]<this.Min[d])
		{
			aa[d] = this.Min[d] - (this.Min[d]-aa[d])/2;
			this.SendEvent(d);
		}
		if (aa[d]>this.Max[d]+delta)
			aa[d] = (this.Max[d]+delta) - (this.Max[d]+delta-aa[d])/2;
	}
	this.TA = aa;
  //
  if (RD3_Glb.IsAndroid())
    this.MyBox.style.webkitTransitionDuration = "0ms";
  RD3_Glb.SetTransform(this.MyBox , "translate3d("+aa[0]+"px,"+aa[1]+"px, 0px)");
	//
	if (this.ScrollDirection!=-1)
		this.PositionScrollbar(this.ScrollDirection);
	//
	var PushTimes = true;
	var TouchTimeAdd = new Date();
	if (RD3_Glb.IsAndroid())
	{
	  var d = this.TouchTimes.length<2 ? 100 : TouchTimeAdd - this.TouchTimes[this.TouchTimes.length-2];
	  //
	  if (d < 50)
	    PushTimes = false;
	}
  //
  if (PushTimes)
  {
  	this.TouchTimes.push(TouchTimeAdd);
    this.TouchPos.push(this.Att);
  }
  else
  {
    // Mi mangio l'ultimo
    this.TouchTimes.splice(this.TouchTimes.length-1,1);
    this.TouchPos.splice(this.TouchPos.length-1,1);
    //
    // E mi infilo al suo posto
    this.TouchTimes.push(TouchTimeAdd);
    this.TouchPos.push(this.Att);
  }
  //
  if (this.TouchTimes.length>3)
  {
    this.TouchTimes.shift();
    this.TouchPos.shift();
  }
}

IDScroll.prototype.OnMouseUp = function(ev, reflected)
{
	if (!this.Active || !this.Enabled)
		return;
	//
  if (reflected == undefined)
    reflected = false;
  //
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
    return false;
	//		
	// Gestione Reflection
	if (this.Reflecting==1 && this.Owner && this.Owner instanceof WebFrame)
	  this.Owner.OnReflectMouseUp(ev, true);
	this.Reflecting = 0;
	//
	this.SetInputTimer(false);
	this.Active = false;
	var d = this.ScrollDirection;
	//
	if (ev)
	{
	  var targetEl = ev.target ? ev.target : ev.srcElement;
	  //
	  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
	  {
	  	if (ev.changedTouches.length != 1)
	  	{
	  		this.Active = false;
	      return false;
	    }
	    this.End = new Array(ev.changedTouches[0].clientX,ev.changedTouches[0].clientY);
	  }
	  else
	  	this.End = new Array(ev.clientX,ev.clientY);	  	
	  //
	  var tofocus = false;
		if (this.ScrollInput && this.Clicking && !this.Moving)
		{
			// Se ho toccato un input, esco ora
			if (this.CheckInput(ev))
		  	tofocus = true;
		}
		//
		// Vediamo quale oggetto sto smettendo di toccare
		var sobj = this.GetObj(targetEl);
		//
		// Se l'oggetto era disabilitato, non do mai il fuoco
		if (sobj.IsEnabled && !sobj.IsEnabled())
			tofocus = false;
		//
		if (sobj && sobj.OnTouchUp && this.Clicking)
		{
			// Se sto per cliccare e un campo aveva il fuoco, vediamo se
			// vuole mandare i dati al server
			if (!this.Moving)
				RD3_KBManager.SurrogateChangeEvent();
			//
			var ok = sobj.OnTouchUp(ev, !this.Moving && !tofocus);
			if (!ok)
				return;
		}
		//
    this.SetDDTimer(false);
	  //
    if (!(sobj instanceof Graph))
	    RD3_Glb.StopEvent(ev);
		//
		if (tofocus)
		{
			targetEl.focus();
			//
			// In IE10+ il cursore mi va all'inizio.. invece lo voglio alla fine
			if (RD3_Glb.IsIE(10, true))
			{
			  targetEl.selectionStart = targetEl.value.length;
			  targetEl.selectionEnd = targetEl.value.length;
			}
			//
	  	return;
		}
	}
	//
	this.Clicking = false;
  //
  // Questo non e' un click, quindi non deve far scattare l'OnClick di WEP che chiude i popup (solo nel simulatore o su WinRT)
  if (!RD3_Glb.IsTouch() || RD3_Glb.IsIE(10, true))
    RD3_DesktopManager.WebEntryPoint.DisableOnClick++;
	//
	// Vediamo se devo eseguire un "ritorno a posto"
	// lo faccio quando l'oggetto da muovere era gia' oltre
	// uno dei limiti quando il mouse o dito vengono alzati
	var t = null;
	if (this.TA[d]>this.Max[d])
		t = this.Max[d];
	if (this.TA[d]<this.Min[d])
		t = this.Min[d];
	//
	// Non stavo muovendo davvero=
	if (d==-1 || this.Swiping)
	{
		var esci = true;
		//
		// Se c'e' uno snap attivo controllo di andare alla pagina giusta
		for (var i=0;i<2 && esci; i++)
		{
			if (this.Snap[i] && ev)
			{
				var ofs = this.Org[i]%this.Snap[i];
				if (ofs)
				{
					t = this.Org[i]-ofs;
					if (-ofs>this.Snap[i]/2)
						t-=this.Snap[i];
					d=i;
					esci=false;
				}
			}
		}
    //
    // Altrimenti esco davvero
    if (esci || !this.ForceSnap)
    {
      this.Moving = false;
      return false;
    }
	}		
	//
	if (t!=null)
	{
		// Comunico che e' stata rilasciato il pull trigger...
		if (d==1 && this.PullTrigger>0 && t==this.Max[d] && this.Att[1]>this.Start[1])
		{
			var ddy = Math.abs(this.Att[1]-this.Start[1])+this.Org[1]*2;
			if (this.Owner && this.Owner.OnPullTrigger)
				this.Owner.OnPullTrigger((this.Org[1]>=0)?(ddy>this.PullTrigger*2):false, (this.Org[1]>=0)?(ddy-this.PullTrigger*2):0, this.Org[1]>=0, ev);
		}
		//		
		// Questa e' l'animazione per il ritorno a posto.
		// Se mi sposto in verticale, tengo conto anche del margine superiore
		if (d==1 && t==this.Max[d] && this.Org[d]==0 && this.Moving)
			t += this.MarginTop;
		//
		RD3_Glb.SetTransitionDuration(this.MyBox, "250ms");
		RD3_Glb.SetTransform(this.MyBox, "translate3d("+(d==0?t:this.Org[0])+"px,"+(d==1?t:this.Org[1])+"px, 0px)");
		RD3_Glb.AddEndTransaction(this.MyBox, this.ea, true);
		//
		this.PositionScrollbar(d);
		this.Moving = false;
		//
		// Tengo conto di un offset di 2 px nel posizionamento della pagina
		this.SendPageEvent(ev,d,t-2);
	}
	else
	{
		var snapcheck = this.ForceSnap;
		//
		// Vediamo se ho abbastanza velocita' per
		// uno scrolling ulteriore (aggiunta protezione per rotella del mouse che non imposta TouchTimes)
		var ttl = (this.TouchTimes ? this.TouchTimes.length : 0);
		if (!ev || (ttl>1 && this.Moving))
		{
			if (!ev || (new Date()-this.TouchTimes[ttl-1])<100 || this.Snap[d])
			{
				var v = this.VA;
				if (!v && ttl>1)
				{
					var dt = this.TouchTimes[ttl-1]-this.TouchTimes[0];
					var ds = this.TouchPos[0][d]-this.TouchPos[ttl-1][d];
					v = ds / dt;
				}
				if (Math.abs(v)<0.5 || (ev && (new Date()-this.TouchTimes[ttl-1])>=100))
					v=0;
				//
				if (v!=0 || this.Snap[d])
				{
					// Limito la velocita' se viene dall'utente
					if (ev)
					{
						if (v>0)
						{
							if (v<1)
								v=1;
							if (v>10)
								v=10;
						}
						if (v<0)
						{
							if (v>-1)
								v=-1;
							if (v<-10)
								v=-10;
						}
					}
					//
					snapcheck = this.ForceSnap || v!=0;			
					//
					// Ero fermo... Verifico se sono in mezzo ad una pagina, ripristino punto finale
					if (v==0 && this.Snap[d] && this.ForceSnap)
					{
						var mv = this.Snap[d]/400;
						if (mv>2) mv=2;
						// 
						var delta = this.TA[d]-this.Org[d];
						if (delta>0)
							v = (delta/this.Snap[d]>0.5)?mv:-mv;
						if (delta<0)
							v = (delta/this.Snap[d]<-0.5)?-mv:mv;
						snapcheck = false;
					}
					//
					// La velocita' e' compresa fra 2 e 10, cioe' da 200 a 1000px/sec.
					v = v*2;
					var va = Math.abs(v);
					//
					// Calcolo il punto di arrivo in funzione della velocita' attuale
					// Si considera una decelerazione di 50px / sec2.
					var tt = va/2; // sec;
					var sv = v*100*tt;
					var sa = 0.5*50*tt*tt;
					//
					// La decelerazione e' sempre contraria alla velocita'
					if (sv<0)
						sa = -sa;
					//
					var pfin = this.TA[d] - (sv - sa);
					if (this.Snap[d])
					{
						// Se e' stato definito uno snap, vediamo se posso applicarlo a pfin
						var sls = Math.round(-this.Org[d]/this.Snap[d]);
						var sla = Math.floor(-pfin/this.Snap[d]);
						if (sv<0)
						  sla = Math.ceil(-pfin/this.Snap[d]);
						if (snapcheck)
						{
							if (sla==sls && v>1)
								sla++; // Vado cmq alla prossima pagina
							else if (sla==sls && v<-1)
								sla--; // Vado cmq alla pagina prec
						}
						var maxp = Math.floor(this.MA[d]/this.Snap[d]);
						if (sla>=maxp)
							sla = maxp-1;
						//
						// Controllo che non sia finito troppo lontano
						if (this.PageRange)
						{
							if (sla>sls && sla-sls>this.PageRange)
								sla = sls+this.PageRange;
							if (sla<sls && sls-sla>this.PageRange)
								sla = sls-this.PageRange;
						}
						//
						if (this.ForceSnap || v!=0)
							pfin = -sla*this.Snap[d];
						//
						// Max 250ms per pagina
						var maxt = 0.25*Math.abs(sla-sls);
						if (maxt==0)
							maxt = 0.25;
						if (tt>maxt)
							tt = maxt;
					}
					//
					// Vediamo se vado fuori dai limiti
					var linfun = false;
					this.LA = null;
					//
					// Questo e' il limite oltre il quale non e' possibile andare
					var maxo = this.CA[d]/8;
					//
					if (pfin>this.Max[d])
					{
						// Se sono oltre il limite massimo...
						if (pfin>this.Max[d]+maxo)
						{
							// Predispongo animazione fino al limite
							pfin=this.Max[d];
							//
							// Memorizzo limite finale
							this.LA = this.Max[d]+maxo;
							//
							// Uso velocita' costante nel primo tratto di scroll
							linfun = true;
						}
					}
					//
					if (pfin<this.Min[d])
					{
						this.SendEvent(d);
						//
						// Se sono oltre il limite minimo...
						if (pfin<this.Min[d]-maxo)
						{
							// Predispongo animazione fino al limite
							pfin = this.Min[d];
							//
							// Memorizzo limite finale
							this.LA = this.Min[d]-maxo;						
							//
							// Uso velocita' costante nel primo tratto di scroll
							linfun = true;
						}
					}
					//
					// Questo e' il punto finale dell'animazione,
					// che sara' uguale ad uno dei limiti se era oltre
					this.MO = null;
					if ((linfun?this.LA:pfin)>this.Max[d])
						this.MO = this.Max[d];
					if ((linfun?this.LA:pfin)<this.Min[d])
						this.MO = this.Min[d];
					//
					// Questo e' il tempo dell'animazione di rientro se serve.
					// considero 150 ms.
					this.TT = 150;
					if (linfun)
					{
						// Se stavo andando a velocita' costante, ricalcolo il tempo di arrivo
						tt = Math.abs(pfin-this.TA[d])/(va*100);
						//
						// Questo e' il tempo per percorrere l'ultimo tratto (gia' calcolato in ms)
						this.TT = Math.ceil(maxo*1000 / va / 100 * 2);
						//
						// Se la velocta' e' cosi' bassa da richiedere piu' di 150ms,
						// allora ricalcolo tempo e velocita'
						if (this.TT>150)
						{
							// Lo spazio e' una proporzione dei tempi.
							var sp = maxo*150/this.TT;
							this.TT = 150;
							//
							// Ricalcolo i limiti
							if (this.MO<this.LA)
								this.LA = this.MO+sp;
							else
								this.LA = this.MO-sp;
						}
					}
					//
					// Inizio il primo tratto di animazione
					if (tt==0)
						this.HideScrollbar(d);
					//
					RD3_Glb.SetTransitionTimingFunction(this.MyBox, (linfun)?"linear":"ease-out");
					RD3_Glb.SetTransitionDuration(this.MyBox, (tt*1000)+"ms");
					RD3_Glb.SetTransform(this.MyBox, "translate3d(0px, 0px, 0px)");
					RD3_Glb.SetTransform(this.MyBox, "translate3d("+(d==0?pfin:this.Org[0])+"px,"+(d==1?pfin:this.Org[1])+"px, 0px)");
					this.PositionScrollbar(d);
					//
					RD3_Glb.AddEndTransaction(this.MyBox, this.ea, true);
				  //
				  this.SendPageEvent(ev,d,pfin);
				  //
          // Non ha iniziato a muoversi... devo segnalarlo
          //
          // Se il timing era 0 la transition e' completata prima che l'evento fosse attaccato, quindi non 
          // e' scattato.. allora spegniamo il moving
          if (isNaN(tt) || tt == 0)
            this.Moving = false;
				}
				else
				{
					this.HideScrollbar(d);
					this.Moving = false;
				}				
			}
			else
			{
				this.HideScrollbar(d);
				this.Moving = false;
			}
		}
	}
}

IDScroll.prototype.OnMouseOut = function(ev)
{
	if (!this.Active || !this.Enabled)
		return;
	//
	var t = ev.relatedTarget;
	if (RD3_Glb.IsIE(10, true))
	{
	  t = ev.toElement;
	  if (t == null || t.className == "ctrl-date-selector")
	    return;
	}
	//
	// Se il mouse e' ancora dentro al container, non fermo l'animazione
	while (t)
	{
		t = t.parentNode;
		if (t==this.ContainerBox)
			return;
	}
	//
	this.OnMouseUp(ev);
}


IDScroll.prototype.OnEndAnimation = function(ev)
{
	var d = this.ScrollDirection;
	//
	// Devo completare rimbalzo contro limiti?
	if (this.LA!=null)
	{
		// Predispondo il secondo tratto di animazione
 		RD3_Glb.SetTransitionTimingFunction(this.MyBox, "ease-out");
		RD3_Glb.SetTransitionDuration(this.MyBox, this.TT+"ms");
		RD3_Glb.SetTransform(this.MyBox, "translate3d("+(d==0?this.LA:this.Org[0])+"px,"+(d==1?this.LA:this.Org[1])+"px, 0px)");
  	//
		this.PositionScrollbar(d);
		this.LA = null;
	}
	else
	{
		// Devo completare rientro?
		if (this.MO!=null)
		{
			// Predispongo rientro
			RD3_Glb.SetTransitionTimingFunction(this.MyBox, "ease-out");
			RD3_Glb.SetTransitionDuration(this.MyBox, this.TT+"ms");
			RD3_Glb.SetTransform(this.MyBox, "translate3d("+(d==0?this.MO:this.Org[0])+"px,"+(d==1?this.MO:this.Org[1])+"px, 0px)");
  		//
			this.PositionScrollbar(d);
			this.MO = null;
		}
		else
		{
			this.TT = null;
			this.VA = null;
			this.Moving = false;	
			//
			// Al termine rimuovo event handler in modo da non pesare.
			RD3_Glb.RemoveEndTransaction(this.MyBox, this.ea, true);
			this.HideScrollbar(d);
			if (this.MyNewBox)
			{
				this.SetBox(this.MyNewBox);
				this.MyNewBox = null;
			}
			//
			// Comunico al parent che ho completato lo scrolling
			if (this.Owner && this.Owner.OnEndScroll)
				this.Owner.OnEndScroll(d);
		}
	}
}

IDScroll.prototype.OnMouseWheel = function(ev)
{
  if (!this.Enabled || !this.AllowYScroll)
    return;
  //
	var s = window.getComputedStyle(this.MyBox);
	if (s.visibility=="hidden" || s.display=="none")
		return;
  var targetEl = ev.target ? ev.target : ev.srcElement;
  //
  // Dato l'oggetto che ha sentito la whell risalgo ed esco senza far nulla
  // se, risalendo, trovo un form-container... se, invece, trovo il mio MyBox allora
  // questo evento compete me...
  var o = targetEl;
  while (o)
  {
    // Se trovo il MyBox allora questo evento mi riguarda
    if (o == this.MyBox)
      break;
    //
    // Se trovo un form-container (nel caso di sub-form o MouseWheel fuori dal MyBox)
    // mi fermo e non faccio nulla... vuol dire che non e' un mio oggetto
    if (o.className == "form-container")
      return;
    //
    // Su di un livello
    o = o.parentNode;
  }
	//
	// Controllo che qualcuno dei padri dell'oggetto non sia di tipo overflow:scroll
	if (RD3_Glb.CanScroll(targetEl))
		return;		
	//
	this.Matrix = RD3_Glb.GetTransform(s).replace(/[^0-9-.,]/g, '').split(',');
	if (RD3_Glb.IsIE(10, true))
  {
    // In IE non si puo' piu' usare il computed style: converte il translate3d in una matrix3d da cui non e' possibile estrarre le coordinate
    var tr = RD3_Glb.GetTransform(this.MyBox.style).replace(/3d/g, '');   // tanslate3d.. va rimosso il 3d perche' da' problemi dopo (e' un numero).
    var m = tr.replace(/[^0-9-.,]/g, '').split(',');
    var mtx = 0;
    var mty = 0;
    try {
      mty = parseInt(m[1]);
      mtx = parseInt(m[0]);
      //
      if (isNaN(mty))
        mty=0;
      if (isNaN(mtx))
        mtx=0;
    }
    catch (ex) {
    }
	  this.Org = new Array(mtx, mty);
  }
	else
  	this.Org = new Array(parseInt(this.Matrix[4]),parseInt(this.Matrix[5]));
	this.TA = this.Org;
	this.CalcLimits();
	this.ScrollDirection = 1;
	//
	if (ev.wheelDelta<0)
	{
		if (this.VA<0 || !this.VA)
		{
			this.InitScrollbar(1);
			this.ShowScrollbar(1);
			this.VA = 1;
		}
		else
			this.VA++;
	}
	else
	{
		if (this.VA>0 || !this.VA)
		{
			this.InitScrollbar(1);
			this.ShowScrollbar(1);
			this.VA = -1;
		}
		else
			this.VA--;
	}	
	//
	RD3_Glb.StopEvent(ev);
	//
	this.Active = true;
	this.Moving = true;
	this.EventSent = false;	
	this.OnMouseUp();
}


IDScroll.prototype.InitScrollbar = function(d)
{
	this.CreateScrollObj(d);
	//
	if (this.DisplayScrollbar)
		this.UseScrollbar[d] = this.MA[d]>this.CA[d];
	if (this.UseScrollbar[d])
	{
		var p = this.CA[d] / this.MA[d] * this.CA[d];
		if (d==0)
			this.Scrollbar[d].style.width = p+"px";
		else
			this.Scrollbar[d].style.height = p+"px";
	}
	else
	{
		this.Scrollbar[d].style.opacity = 0;
	}
}


IDScroll.prototype.CreateScrollObj = function(d)
{
	if (!this.Scrollbar)
	{
		this.Scrollbar = new Array(2);
		this.UseScrollbar = new Array(2);
	}
	//
	if (!this.Scrollbar[d])
	{
	  this.Scrollbar[d] = document.createElement('div');
	  this.Scrollbar[d].className = "touch-scrollbar-"+d;
	  this.ContainerBox.appendChild(this.Scrollbar[d]);
		RD3_Glb.SetTransitionProperty(this.Scrollbar[d], "-webkit-transform, opacity");
	}
}


IDScroll.prototype.ShowScrollbar = function(d)
{
	if (!this.UseScrollbar[d])
		return;
	//
	RD3_Glb.SetTransitionDuration(this.Scrollbar[d], "0ms");
	this.Scrollbar[d].style.opacity = 1;
}


IDScroll.prototype.PositionScrollbar = function(d)
{
	if (!this.UseScrollbar[d])
		return;
	//
	var  mx = RD3_Glb.GetTransform(this.MyBox).substr(11).replace(/[^0-9-.,]/g, '').split(',');
	//
	var tt = new Array(parseInt(mx[0]),parseInt(mx[1]));
	var aa = -tt[d] / this.MA[d] * this.CA[d];
	//
  RD3_Glb.SetTransitionDuration(this.Scrollbar[d], RD3_Glb.GetTransitionDuration(this.MyBox));
	RD3_Glb.SetTransitionTimingFunction(this.Scrollbar[d], RD3_Glb.GetTransitionTimingFunction(this.MyBox));
	RD3_Glb.SetTransform(this.Scrollbar[d], "translate3d("+(d==0?aa:0)+"px,"+(d==1?aa:0)+"px, 0px)");
	//
	// Se all'owner interessa, lo avviso che le scrollbar sono state mosse
	if (this.Owner && this.Owner instanceof Book && this.Owner.OnScroll)
	  this.Owner.OnScroll({target:tt, time:RD3_Glb.GetTransitionDuration(this.MyBox), funct:RD3_Glb.GetTransitionTimingFunction(this.MyBox)});
}


IDScroll.prototype.HideScrollbar = function(d)
{
	if (!this.UseScrollbar || !this.UseScrollbar[d])
		return;
	//
	if (this.Scrollbar && this.Scrollbar[d])
	{
		RD3_Glb.SetTransitionDuration(this.Scrollbar[d], "330ms");
		this.Scrollbar[d].style.opacity = 0;
	}
}


IDScroll.prototype.GetObj = function(obj)
{
	if (obj)
		return RD3_KBManager.GetObject(obj, true);
	else
		return null;
}

IDScroll.prototype.SendEvent = function(d)
{
	if (this.Owner && !this.EventSent)
	{
		this.EventSent = true;
		if (this.Owner.OnScrollBottom)
			this.Owner.OnScrollBottom(d);
	}
}


IDScroll.prototype.SendPageEvent = function(ev, d, mis)
{
	if (this.Owner && this.Owner.OnScrollToPage && this.Snap[d])
	{
		var pag = Math.round(-mis/this.Snap[d])+1;
		var maxp = Math.round(this.MA[d]/this.Snap[d]);
		if (pag>maxp)
			pag = maxp;
		this.Owner.OnScrollToPage(ev, d, pag, this);
	}
}


IDScroll.prototype.ChangeSize = function(forzato)
{
	// Chiamata dall'owner per segnalare il cambiamento
	// di altezza di mybox, durante le animazioni
	var ok = this.CalcLimits();
	if ((ok || forzato) && this.Enabled)
	{
		if (!this.TouchTimes)
		{
			this.TouchTimes  = new Array();
			this.TouchPos   = new Array();
		}
		//
		this.LA = null;
		this.MO = null;
		this.TT = null;
		//
		// Ricalcolo
		this.Active = true;
		this.Moving = true;
		//
		// Permetto al sistema di rilanciare l'evento di invio righe
		this.EventSent = false;
		//
		// Ricalcolo posizione attuale prima di inviare l'evento. E' importante che siano
		// correttamente calcolati in questo punto
		var s = window.getComputedStyle(this.MyBox);
		this.Matrix = RD3_Glb.GetTransform(s).replace(/[^0-9-.,]/g, '').split(',');
		if (RD3_Glb.IsIE(10, true))
	  {
      // In IE non si puo' piu' usare il computed style: converte il translate3d in una matrix3d da cui non e' possibile estrarre le coordinate
      var tr = RD3_Glb.GetTransform(this.MyBox.style).replace(/3d/g, '');   // tanslate3d.. va rimosso il 3d perche' da' problemi dopo (e' un numero).
      var m = tr.replace(/[^0-9-.,]/g, '').split(',');
      var mtx = 0;
      var mty = 0;
      try {
        mty = parseInt(m[1]);
        mtx = parseInt(m[0]);
        //
        if (isNaN(mty))
          mty=0;
        if (isNaN(mtx))
          mtx=0;
      }
      catch (ex) {
      }
      this.Org = new Array(mtx, mty);
    }
		else
	  	this.Org = new Array(parseInt(this.Matrix[4]),parseInt(this.Matrix[5]));
		this.TA = this.Org;
		//
		// Se sono su telefono e le dimensioni sono cambiate ma il cerca era esposto: deve rimanere esposto
		if (this.ScrollDirection==1 && RD3_Glb.IsSmartPhone() && RD3_Glb.IsAndroid())
		{
		  //Calcolo t per decidere se e' un ritorno a posto
  		var t = null;
    	if (this.TA[1]>this.Max[1])
    		t = this.Max[1];
    	if (this.TA[1]<this.Min[1])
    		t = this.Min[1];
      //
  		if (t==this.Max[1] && this.Org[1]==this.MarginTop && this.Moving)
  		  this.Org[1] = 0;
		}
		//
		this.OnMouseUp();
	}
}


IDScroll.prototype.CalcLimits = function()
{
	if (!this.MyBox)
		return false;
	//
	var ris = false;
	//
	var ma = new Array(this.MyBox.offsetWidth, this.MyBox.offsetHeight+this.MarginBottom);
	var ca = new Array(this.ContainerBox.offsetWidth, this.ContainerBox.offsetHeight);
	//
	for (var d=0;d<2;d++)
	{
		if (ma[d]!=this.MA[d] || ca[d]!=this.CA[d])
		{
			if (ma[d]<ca[d])
			{
				this.Min[d] = 0;
				this.Max[d] = 0;
			}
			else
			{
				this.Min[d] = -(ma[d]-ca[d]+1);
				this.Max[d] = 0;
			}
			//
			ris = true;
		}
	}
	//
	this.MA = ma;
	this.CA = ca;
	return ris;
}


// ************************************************
// Riporta la lista in alto
// ************************************************
IDScroll.prototype.GoTop = function()
{
	this.VA = -60;
	this.Active = true;
	this.Moving = true;
	//
	// Ricalcolo posizione attuale prima di inviare l'evento. E' importante che siano
	// correttamente calcolati in questo punto
	var s = window.getComputedStyle(this.MyBox);
	this.Matrix = RD3_Glb.GetTransform(s).replace(/[^0-9-.,]/g, '').split(',');
	if (RD3_Glb.IsIE(10, true))
  {
    // In IE non si puo' piu' usare il computed style: converte il translate3d in una matrix3d da cui non e' possibile estrarre le coordinate
    var tr = RD3_Glb.GetTransform(this.MyBox.style).replace(/3d/g, '');   // tanslate3d.. va rimosso il 3d perche' da' problemi dopo (e' un numero).
    var m = tr.replace(/[^0-9-.,]/g, '').split(',');
    var mtx = 0;
    var mty = 0;
    try {
      mty = parseInt(m[1]);
      mtx = parseInt(m[0]);
      //
      if (isNaN(mty))
        mty=0;
      if (isNaN(mtx))
        mtx=0;
    }
    catch (ex) {
    }
	  this.Org = new Array(mtx, mty);
  }
	else
  	this.Org = new Array(parseInt(this.Matrix[4]),parseInt(this.Matrix[5]));
	this.TA = this.Org;
	//
	this.OnMouseUp();	
}


// ************************************************
// Aggiorna il container
// ************************************************
IDScroll.prototype.SetContainer = function(divcnt)
{
	this.ContainerBox = divcnt;	
	//
	if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
	{
	  divcnt.addEventListener("touchmove", this.mm, true); 
	  divcnt.addEventListener("touchstart", this.md, true); 
	  divcnt.addEventListener("touchend", this.mu, true);
	  divcnt.addEventListener("touchcancel", this.mo, true);
	  divcnt.addEventListener("gestureend", this.ge, true);
	}
	else
	{
	  divcnt.addEventListener("mousemove", this.mm, true); 
	  divcnt.addEventListener("mousedown", this.md, true); 
	  divcnt.addEventListener("mouseup", this.mu, true);
	  divcnt.addEventListener("mouseout", this.mo, true);
	  divcnt.addEventListener("mousewheel", this.mw, true);
	}
}


// ************************************************
// Imposta lo snap
// ************************************************
IDScroll.prototype.SetSnap = function(snx, sny, force, range)
{
	this.Snap[0] = snx;
	this.Snap[1] = sny;
	if (typeof force != "undefined")
		this.ForceSnap = force;
	if (typeof range != "undefined")
		this.PageRange = range;
}


// ************************************************
// Imposta lo snap
// ************************************************
IDScroll.prototype.SetPage = function(pagx, pagy)
{
	var xini = RD3_Glb.TranslateX(this.MyBox);
	var yini = RD3_Glb.TranslateY(this.MyBox);
	var xfin = xini;
	var yfin = yini;
	var ok = false;
	if (pagx>0 && this.Snap[0])
	{
		xfin = -(pagx-1)*this.Snap[0];
		if (xfin!=xini)
			ok = true;
	}
	if (pagy>0 && this.Snap[1])
	{
		yfin = -(pagy-1)*this.Snap[1];
		if (yfin!=yini)
			ok = true;
	}
	//
	if (ok)
	{
		RD3_Glb.SetTransitionTimingFunction(this.MyBox, "ease-out");
		RD3_Glb.SetTransitionDuration(this.MyBox, "250ms");
		RD3_Glb.SetTransform(this.MyBox, "translate3d("+(xfin)+"px,"+(yfin)+"px, 0px)");
  	//
		this.HideScrollbar(0);
		this.HideScrollbar(1);
	}
}


IDScroll.prototype.OnGestureEnd = function(ev)
{
	// Se ho fatto il pinch di chiusura, chiudo l'applicazione!
	if(ev.scale<0.40)
	{
		RD3_DesktopManager.WebEntryPoint.OnCloseApp(ev);
	}
}


IDScroll.prototype.OnDDTimer = function(ev)
{
	this.DDTimer = null;
	this.Active = false;
	this.Clicking = false;
	RD3_DDManager.OnMouseDown(this.DDEvent);
}

IDScroll.prototype.SetDDTimer = function(flag, ev)
{
	if (this.DDTimer)
		window.clearTimeout(this.DDTimer)
	this.DDTimer = null;
	this.DDEvent = null;
	//	
	if (flag)
	{
		var ot = (this.AllowXScroll || this.AllowYScroll)?300:15;
  	this.DDTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnDDTimer')",ot);
  	//
  	// Su IE10 l'oggetto che mi memorizzo viene distrutto comunque.. quindi devo crearne un clone.. mi copio tutte le informazioni che mi servono
  	if (RD3_Glb.IsIE(10, true))
  	{
  	  var msEvent = new Object();
  	  //
  	  msEvent.clientX = ev.clientX;
  	  msEvent.clientY = ev.clientY;
  	  msEvent.button = ev.button;
  	  msEvent.explicitOriginalTarget = ev.srcElement;
  	  msEvent.srcElement = ev.srcElement;
  	  msEvent.target = ev.srcElement;
  	  //
  	  ev = msEvent;
  	}
  	//
  	this.DDEvent = ev;
  }
}


IDScroll.prototype.CheckInput = function(ev)
{
	var tocheck = this.ScrollInput || RD3_Glb.IsTouch();
	//
	var targetEl = ev.target ? ev.target : ev.srcElement;
	//
	// Se sto toccando un input e voglio un popover
	if (tocheck && targetEl.tagName == "INPUT")
	{
		var sobj = this.GetObj(targetEl);
		if (sobj && sobj instanceof PValue)
		{
			if (sobj.ParentField.UsePopupControl())
				tocheck = false;
		}
		if (sobj && sobj instanceof BookSpan)
		{
		  if (sobj.UsePopupControl())
				tocheck = false;
		}
	}
	//  
	if (((targetEl.tagName == "INPUT" && targetEl.type!="button") || targetEl.tagName == "TEXTAREA" || RD3_Glb.isInsideEditor(targetEl)) && tocheck)
	  return true;
}

IDScroll.prototype.OnInputTimer = function(ev)
{
  if (!RD3_Glb.IsTouch())
    return;
  //
	this.InputTimer = null;
	//
	// Devo rilanciare l'evento che si e' perso; inoltre devo fare in modo che IDScroll lo lasci passare
	var theTarget = this.InputEvent.target;
	//
	var sx = this.InputEvent.changedTouches[0].clientX;
  var sy = this.InputEvent.changedTouches[0].clientY
	var theEvent = document.createEvent("MouseEvents");
  theEvent.initEvent("mousedown", true, true, window, 1, sx, sy, sx, sy);
  theTarget.dispatchEvent(theEvent);
  this.SkipEvent = true;
}

IDScroll.prototype.SetInputTimer = function(flag, ev)
{ 
  if (this.InputTimer)
		window.clearTimeout(this.InputTimer)
	this.InputTimer = null;
	this.InputEvent = null;
	//	
	if (flag)
	{
  	this.InputTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnInputTimer')",300);
  	this.InputEvent = ev;
  }
}

IDScroll.prototype.SetDisableTimer = function(ms)
{ 
	this.Enabled = false;
  if (this.DisableTimer)
		window.clearTimeout(this.DisableTimer)
 	this.DisableTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnDisableTimer')",ms);
}


IDScroll.prototype.OnDisableTimer = function(ms)
{
	this.Enabled = true;
}

IDScroll.prototype.ResetSpeedData = function()
{
	this.TouchTimes = new Array();
}

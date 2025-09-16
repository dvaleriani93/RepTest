// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Controller Drag & Drop
// ************************************************


// *****************************************************
// Classe DDManager
// Controller delle operazioni di D&D
// *****************************************************
function DDManager() 
{
  // Variabili del DD Manager
  //
  this.IsDragging  = false; // Vera se il d&d e' in fase di dragging
  this.InDetection = false; // Vera se il manager sta osservando un oggetto per vedere se l'utente lo tira
  //
  this.DragObj = null;      // L'oggetto in fase di detection o dragging
  this.DragElem = null;     // L'elemento DOM in fase di detection o dragging
  this.CloneElem = null;    // L'oggetto DOM clonato
  this.LastDropObj = null;  // L'ultimo oggetto candidato al drop
  this.XPos = 0;            // Punto iniziale in cui e' iniziato il drag
  this.YPos = 0;            // Punto iniziale in cui e' iniziato il drag
  //
  this.DropList = null;     // Lista degli oggetti su cui e' possibile droppare
  //
  this.TrasfElem = null;    // Oggetto DOM trasformabile
  this.TrasfObj = null;     // Oggetto trasformabile
  this.TrasfXMode = 0;      // Nessuna trasformazione x (-1 sx, 0 none, 1 dx)
  this.TrasfYMode = 0;      // Nessuna trasformazione y (-1 top, 0 none, 1 bottom)
  this.IsResizing = false;  // Eseguo ridimensionamento?
  this.OrigLeft = 0;        // Dimensioni originale del ResElem
  this.OrigTop = 0;         // Dimensioni originale del ResElem
  this.OrigWidth = 0;       // Dimensioni originale del ResElem  
  this.OrigHeight = 0;      // Dimensioni originale del ResElem  
  this.TrueOrigLeft = 0;    // Dimensioni originale del ResElem (non tengono conto dello scrolling)
  this.TrueOrigTop = 0;     // Dimensioni originale del ResElem (non tengono conto dello scrolling)
  this.TrueOrigWidth = 0;   // Dimensioni originale del ResElem (non tengono conto dello scrolling)
  this.TrueOrigHeight = 0;  // Dimensioni originale del ResElem (non tengono conto dello scrolling)
  //
  this.ResElem = null;      // Il resizing element (div trasparente che viene visualizzato solo al momento giusto)
  this.HLDropElem = null;   // l'element usato per evidenziare un drop target
  this.HLDragElem = null;   // l'element usato per evidenziare l'elemento draggato
  //
  this.ScrollTimerID = 0;   // Timer per lo scrolling durante d&d, moving...
  //  
  this.LButtonDown = false; // Usato per sapere se c'e' il bottone LEFT premuto durante un'operazione (vedi PValue)
  this.OpenCombo = null;    // Combo aperta
  this.iOpenPopup = new Array(); // i popover aperti
  //
  // Gestione controllo doppio click
  this.MD_XPos = 0; // Coordinata evento mouse down
  this.MD_YPos = 0; // Coordinata evento mouse down
  this.MD_Time = 0; // Istante evento mouse down
  this.MD_Button = 0; // Bottone premuto
  this.MD_Target = null; // Oggetto sorgente
  this.MD_Clicked = false; // Gia' cliccato?
  //
  // Eseguo inizializzazione
  this.Init();
}

  
// ******************************************
// Inizializzazione del controller
// ******************************************
DDManager.prototype.Init = function() 
{
  // Aggiungo al document i listener degli eventi
  // di MouseDown, MouseMove e MouseUp
  // utili per la gestione del DD
  var md = new Function("ev","return RD3_DDManager.OnMouseDown(ev)");
  var mu = new Function("ev","return RD3_DDManager.OnMouseUp(ev)");
  var mm = new Function("ev","return RD3_DDManager.OnMouseMove(ev)");
  var mo = new Function("ev","return RD3_DDManager.OnMouse(ev, 'over')");
  var mt = new Function("ev","return RD3_DDManager.OnMouse(ev, '')");
  var rf = new Function("ev","return false");
  var ss = new Function("ev","return RD3_DDManager.OnSelectStart(ev)");
  var ck = new Function("ev","return RD3_DDManager.OnAllClicks(ev)");
  //
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    document.addEventListener("touchmove", mm, false); 
    document.addEventListener("touchstart", md, false); 
    document.addEventListener("touchend", mu, false);
    document.addEventListener("mouseover", mo, false);
    document.addEventListener("mouseout", mt, false);
    if (RD3_Glb.IsAndroid())
      document.addEventListener("click", ck, true);
  }
  else if (document.addEventListener)
  {
    document.addEventListener("mousemove", mm, false); 
    document.addEventListener("mousedown", md, false); 
    document.addEventListener("mouseup", mu, false);
    document.addEventListener("mouseover", mo, false);
    document.addEventListener("mouseout", mt, false);
    //
    // Stoppo il D&D del testo
    var dov = new Function("ev","return RD3_DDManager.OnGeneralDrag(ev)");
    document.addEventListener("dragover", dov, false);
    //
    if (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch())
      document.addEventListener("click", ck, true);
  }
  else
  {
    document.attachEvent("onmousemove",mm);
    document.attachEvent("onmousedown",md);
    document.attachEvent("onmouseup",mu);
    document.attachEvent("onmouseover",mo);
    document.attachEvent("onmouseout",mt);
    document.attachEvent("ondragstart",rf);
  }
  document.body.onselectstart = ss;
  //
  // Questo viene aggiunto e tolto al DOM al momento del bisogno
  this.ResElem = document.createElement("div");
  this.ResElem.setAttribute("id", "resize-object");
  //
  // Questo viene aggiunto in fondo e mostrato al bisogno
  this.HLDragElem = document.createElement("div");
  this.HLDragElem.setAttribute("id", "drag-object");
  this.HLDragElem.style.display = "none";
  document.body.appendChild(this.HLDragElem);
  //
  // Questo viene aggiunto in fondo e mostrato al bisogno
  this.HLDropElem = document.createElement("div");
  this.HLDropElem.setAttribute("id", "drop-target");
  this.HLDropElem.style.display = "none";
  document.body.appendChild(this.HLDropElem);  
}


// ******************************************
// Gestione Mouse DOWN
// ******************************************
DDManager.prototype.OnMouseDown = function(ev) 
{
  // Non interferisco con il comportamento della combo box
  if (RD3_Glb.IsTouch() && this.OpenCombo)
    return;
  //
  // Se il WEP non e' ancora inizializzato, non posso far nulla
  if (!RD3_DesktopManager.WebEntryPoint)
    return;
  //
  var x = (window.event)?window.event.clientX:ev.clientX;
  var y = (window.event)?window.event.clientY:ev.clientY;
  //
  // Per prima cosa provo a gestire l'hilight
  this.OnMouse(ev, "down");
  //
  // Se c'e' una combo aperta, giro a lei il messaggio
  if (this.OpenCombo)
    this.OpenCombo.OnMouseDown(ev);
  //
  if (RD3_DesktopManager.WebEntryPoint.UseZones())
  {
    for (var pos=2; pos<=5; pos++)
      RD3_DesktopManager.WebEntryPoint.GetScreenZone(pos).OnMouseDown(ev);
  }
  //
  // Mi ricordo se e' stato premuto il tasto sinistro
  // IE11 ha cambiato il comportamento e si e' allineato agli altri.. su quelli prima bisogna usare 1..
  var but = ((window.event)?window.event.button:ev.button);
  this.LButtonDown = (but == (RD3_Glb.IsIE(11, false) ? 1 : 0));
  //
  var srcobj = (window.event)?window.event.srcElement:ev.explicitOriginalTarget;
  //
  if (this.OpenListFormCell && this.OpenListFormCell.GetDOMObj() && !this.OpenCombo) 
  {
    // Se c'e' una cella di edit per la lista aperta devo verificare se l'oggetto toccato e' dentro o fuori, se e' fuori la devo far sparire 
    // (prima devo fare il blur in modo da far acquisire il valore)
    var parentContainer = this.OpenListFormCell.GetDOMObj().parentNode;
    var el = srcobj;
    var outside = true;
    while (el) {
      if (el == parentContainer) {
        outside = false;
        break;
      }
      el = el.parentNode;
    }
    //
    if (outside) {
      // Faccio il blur, poi per sicurezza chiamo anche l'onChange in modo da mandare il messaggio al server e l'UpdaeScreen in modo da aggiornare la cella in lista
      // che sta sotto la cella in FormList
      var dmObj = this.OpenListFormCell.GetDOMObj();
      if (this.OpenListFormCell.ControlType == 4)
        dmObj = this.OpenListFormCell.SubIntCtrl;
      if (dmObj.blur)
        dmObj.blur();
      //
      // IDRO_OnChange va chiamato sul DOMObj perche' e' lui ad avere l'id, nel caso di check invece il blur va chiamato sul 
      // subintctrl (e' lui l'input, l'intctrl e' un dv contenitore)
      RD3_KBManager.IDRO_OnChange(this.OpenListFormCell.GetDOMObj(), true);
      this.OpenListFormCell.PValue.UpdateScreen();
      delete this.OpenListFormCell;
      RD3_KBManager.ActiveElement = null;
      //
      window.setTimeout(function () {
        if (parentContainer && parentContainer.parentNode)
          parentContainer.parentNode.removeChild(parentContainer);
      }, 0);
      //
      // Nascondo anche il calendario
      if (RD3_DesktopManager.WebEntryPoint.CalPopup)
        RD3_DesktopManager.WebEntryPoint.CalPopup.style.display = "none";
    }
  }
  //
  // CKEditor non ha nessun evento di change ed il suo evento di perdita di fuoco arriva troppo tardi: percio' quando clicco 
  // su un immagine devo verificare se il fuoco era su una cella con CKEditor e prendere il testo
  // Non se il click avviene su un oggetto interno di CKEditor..
  var hcell = RD3_DesktopManager.WebEntryPoint.HilightedCell;
  var insideCK = (srcobj && srcobj.className && srcobj.className.indexOf && srcobj.className.indexOf("cke")>=0 ? true : false);
  if (hcell && hcell.ControlType == 101 && hcell.ParentField && !insideCK && !RD3_ServerParams.UseIDEditor)
  {
    var nm = hcell.ParentField.Identifier + (hcell.InList ? ":lcke" : ":fcke");
    hcell.ParentField.OnFCKSelectionChange(CKEDITOR.instances[nm]);
  }
  //
  // FFX e Chrome hanno un bug per cui dopo che hai caricato un immagine nell'editor
  // questo prende il fuoco ma il browser non sa che ha veramente il fuoco per cui se clicchi su un IMG non lancia il BLUR
  // -> se clicchi da qualche altra parte invece funziona..
  // in questo caso dobbiamo fare qualcosa noi: lanciamo il lose focus
  if ((RD3_Glb.IsChrome() || RD3_Glb.IsFirefox()) && hcell && hcell.ControlType == 101 && hcell.ParentField && RD3_ServerParams.UseIDEditor && hcell.IntCtrl.ImgAdded)
  {
    hcell.IntCtrl.OnLoseFocus();
    hcell.IntCtrl.ImgAdded = false;
  }
  //
  // Se clicco su un immagine, non passo l'evento
  // Comunque l'evento di click verra' considerato
  var stop = (srcobj && srcobj.tagName=="IMG");
  //
  // Su IE>10 devo stoppare solo le immagini..
  var stopIE = stop && RD3_Glb.IsIE(10, true);
  //
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    // Don't track motion when multiple touches are down in this element (that's a gesture)
    if (ev.targetTouches.length != 1)
      return false;
    //
    if (RD3_Glb.CanScroll(ev.target) || RD3_Glb.IsCustomComponentChild(ev.target))
      return;
    //
    // Per gli input non gestisco gli eventi touch perche' voglio che appaia la tastiera
    var ele = RD3_Glb.ElementFromPoint(ev.targetTouches[0].clientX, ev.targetTouches[0].clientY);
    if (ele && ((ele.tagName=="INPUT" && ele.type != "button") || ele.tagName=="TEXTAREA" || RD3_Glb.isInsideEditor(ele)))
    {
      ele.focus();
      return false;
    }
    if (ele && ele.tagName == "CANVAS")
      return false;
    //
    ev.preventDefault();
    x = ev.targetTouches[0].clientX;
    y = ev.targetTouches[0].clientY;
    this.TouchOrgX = x;
    this.TouchOrgY = y;
    //
    but = 0;
    this.LButtonDown = true;
    srcobj = RD3_Glb.ElementFromPoint(x, y);
    //
    // Devo passare l'evento al frame
    ev.clientX=x;
    ev.clientY=y;
    ev.button=0;
    ev.target = srcobj;
    stop = true;
    //
    // Chiamo onmousemove per ottenere da subito la rilevazione degli oggetti da tirare
    this.OnMouseMove(ev);
    this.SetMouseOver(srcobj);
    //
    // Imposto timeout per tasto destro = tocco prolungato
    this.TouchEvent = ev;
    this.TouchTimer = window.setTimeout("RD3_DDManager.OnTouchRight()",750);
    //
    this.TouchMove = false;
    //
    // Evidenzio l'oggetto 
    this.HandleTouchEvent(srcobj, "down", ev);
  }
  //
  // Verifichiamo che non fosse rimasto appeso qualcosa...
  if (this.IsDragging)
    this.Reset();
  //
  if (this.TrasfObj!=null && (this.TrasfXMode!=0 || this.TrasfYMode!=0))
  {
    // Entro in modalita' resize...
    this.IsResizing = true;
    //
    document.body.appendChild(this.ResElem);
    //
    // Posiziono l'elemento
    this.OrigLeft = RD3_Glb.GetScreenLeft(this.TrasfElem) - 2;
    this.OrigTop = RD3_Glb.GetScreenTop(this.TrasfElem) - 2;
    this.OrigWidth = this.TrasfElem.clientWidth;
    this.OrigHeight = this.TrasfElem.clientHeight;
    this.TrueOrigLeft = this.OrigLeft;
    this.TrueOrigTop = this.OrigTop;
    this.TrueOrigWidth = this.OrigWidth;
    this.TrueOrigHeight = this.OrigHeight;    
    //
    this.ResElem.style.left = this.OrigLeft + "px";
    this.ResElem.style.top = this.OrigTop + "px";
    this.ResElem.style.width = this.OrigWidth + "px";
    this.ResElem.style.height = this.OrigHeight + "px";
    this.ResElem.style.cursor = this.TrasfElem.style.cursor;
    //
    this.XPos = x;
    this.YPos = y;
    //
    stop = true;
  }
  //
  if (!this.IsResizing)
  {
    var obj = (window.event)?window.event.srcElement:ev.target;
    //
    // Ottengo l'id del primo nodo della gerarchia che abbia un id valido per RD3
    var id = RD3_Glb.GetRD3ObjectId(obj);
    //
    var mobj = this.GetDraggableObject(id);
    var doMove = false;
    if (mobj && !this.IsOnScrollBar(obj, x, y))
    {
      // Memorizzo l'oggetto e le coordinate perche' puo' darsi che stia per iniziare il DD
      this.DragObj = mobj;
      this.XPos = x;
      this.YPos = y;
      //
      this.InDetection = true;
      //
      if (RD3_Glb.IsMobile())
      {
        // Nel caso mobile chiamo subito le funzioni
        // per la gestione del mouse per iniziare subito il drag
        doMove = true;
      }
    }
    //
    // Ho comunque rilevato un oggetto muovibile... attivo detecting
    if (this.TrasfObj!=null)
    {
      this.XPos = x;
      this.YPos = y;
      this.InDetection = true;
    }
    //
    // Blocco il D&D dei browser diversi da IE se ho trovato un'oggetto da draggare
    if (this.InDetection)
      stop = true;
    //
    if (doMove)
      this.OnMouseMove(ev);
    //
    if (this.InDetection)
    {
      try
      {
        // Se ho cliccato su qualcosa di diverso da un Input questo non prende il fuoco, quindi al server arriva la riga sbagliata.
        // devo essere io a simulare la presa di fuoco dell'oggetto (lo farebbe il framework nel mouseUp, ma e' troppo tardi..)
        if (srcobj.tagName != "INPUT" && srcobj.tagName != "TEXTAREA")
          RD3_KBManager.IDRO_GetFocus(ev);
      }
      catch(e) {}
    }
  }
  // Gestione doppio click su altri browser: negli altri browser il doppio click sulla caption della colonna nell'area di resize
  // non viene gestito, partono semplicemente due click sul DDManager, quindi devo gestirlo qui io...
  // Vediamo se devo skippare l'evento perche' sto aspettando un doppio click...
  var skiphandling = false;
  var d = new Date();
  if (d-this.MD_Time<400 && Math.abs(x-this.MD_XPos)<4 && Math.abs(y-this.MD_YPos)<4)
    skiphandling = true;
  //
  // Memorizzo i dati dell'evento
  if (!skiphandling)
  {
    this.MD_XPos = x;
    this.MD_YPos = y;
    this.MD_Time = d;
    this.MD_Button = but;
    this.MD_Target = srcobj;
    this.MD_Clicked = false;
  }
  //
  if ((stop && !RD3_Glb.IsIE()) || stopIE)
  {
    // Se l'oggetto e' in frame, allora invio il mousedown al frame, altrimenti
    // non funziona la rilevazione degli eventi raw di mouse
    var tt = srcobj;
    var eve = (window.event)?window.event:ev;
    while (tt)
    {
      if (RD3_Glb.HasClass(tt,"frame-container"))
      {
        break;
      }
      tt = tt.parentNode;
    }
    //
    if (tt)
    {
      var sobj = this.GetObject(tt.id);
      if (sobj && sobj instanceof WebFrame)
        sobj.OnMouseDown(eve);
    }
    //
    RD3_KBManager.SurrogateChangeEvent();
    //
    // Su Seattle mangio il click, ma cosi' facendo l'oggetto non prende il fuoco e non funziona piu' il cambio riga..
    // in quel caso forzo il fuoco in modo da fa funzionare correttamente l'applicazione
    if (!RD3_Glb.IsMobile() && this.InDetection && srcobj && (srcobj.tagName == "INPUT" || srcobj.tagName == "TEXTAREA"))
    {
      try
      {
        srcobj.focus();
      }
      catch(e) {}
    }
    //
    RD3_Glb.StopEvent(eve);
    return false;
  }
}


// ******************************************
// Gestione Mouse UP
// ******************************************
DDManager.prototype.OnMouseUp = function(ev) 
{
  // Non interferisco con il comportamento della combo box
  if (RD3_Glb.IsTouch() && this.OpenCombo)
    return;
  //
  var obj = (window.event)?window.event.srcElement:ev.target;
  //
  var x = (window.event)?window.event.clientX:ev.clientX;
  var y = (window.event)?window.event.clientY:ev.clientY;
  var dropped = false;
  //
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    if (this.TouchTimer)
    {
      window.clearTimeout(this.TouchTimer);
      this.TouchTimer=0;
    }
    //
    // Stop tracking when the last finger is removed from this element
    if (ev.targetTouches.length != 0 && ev.changedTouches.length!=1)
      return false;
    //
    if (RD3_Glb.CanScroll(ev.target) || RD3_Glb.IsCustomComponentChild(ev.target))
      return;      
    //
    // In MouseDown ho annullato la gestione sugli input.. lo devo fare anche qui..
    if (RD3_Glb.IsAndroid())
    {
      var tar = ev && ev.target ? ev.target : null;
      if (tar && ((tar.tagName=="INPUT" && tar.type != "button") || tar.tagName=="TEXTAREA" || RD3_Glb.isInsideEditor(tar)))
        return false;
    }
    //
    if (ev && ev.target && ev.target.tagName == "CANVAS")
      return false;
    //
    ev.preventDefault();
    //
    x = ev.changedTouches[0].clientX;
    y = ev.changedTouches[0].clientY;
    //
    obj = RD3_Glb.ElementFromPoint(x, y);
    ev.clientX=x;
    ev.clientY=y;
    ev.button=0;
    ev.target = obj;
    //
    if (!this.TouchMove)
      this.HandleTouchEvent(obj, "up", ev);
    //
    this.ResetMouseOver();
  }  
  //
  // Proviamo a gestire per prima cosa la selezione testuale
  var actobj = RD3_KBManager.ActiveObject;
  if (actobj && actobj instanceof PCell)
    actobj = actobj.ParentField;
  //
  if (actobj && actobj.SendtextSelChange && actobj.UseTextSel)
  {
    // Leggo la selezione
    var oldst = actobj.StartSel;
    var oldend = actobj.EndSel;
    actobj.SendtextSelChange(RD3_KBManager.ActiveElement);
    //
    // La selezione non e' cambiata: potrebbe essere dovuto al click all'interno di una selezione gia' esistente, in quel caso
    // devo utilizzare un timer per leggere la selezione corretta (possibile problema: arrivano due eventi di selezione, uno con lo stesso valore di prima
    // ed uno corretto dopo x milli)
    if (oldst==actobj.StartSel && oldend==actobj.EndSel && oldst!=-1)
    {
      // Se c'e' gia' un timer lo blocco
      if (RD3_KBManager.SelTextTimer)
      {
        window.clearTimeout(RD3_KBManager.SelTextTimer);
        RD3_KBManager.SelTextSrc = null;
        RD3_KBManager.SelTextObj = null;
      }
      //
      // Attivo il timer per fare scattare la gestione della selezione testuale dopo 50 milli o 500: in questo modo su IE riesco a gestire il caso di click all'interno della selezione testuale
      // (con un timer inferiore il browser non fornisce la selezione) e lo riesco anche a gestire sugli altri browser (loro hanno bisogno di un tempo minore)
      var time = RD3_Glb.IsIE() ? 500 : 50;
      RD3_KBManager.SelTextTimer = window.setTimeout(new Function("ev","if (RD3_KBManager.SelTextObj && RD3_KBManager.SelTextObj.SendtextSelChange){RD3_KBManager.SelTextObj.SendtextSelChange(RD3_KBManager.SelTextSrc);}"), time);
      RD3_KBManager.SelTextSrc = RD3_KBManager.ActiveElement;
      RD3_KBManager.SelTextObj = actobj;
    }
  }
  //
  if (this.IsDragging)
  {
    // Vediamo se c'e' un oggetto che vuole quello tirato
    var a = null;
    if (this.DragObj)
      a = this.GetDroppableObject(x, y);
    //
    // Eseguo il drop
    if (a && a.OnDrop)
    {
      dropped = a.OnDrop(this.DragObj, (window.event)?window.event:ev);
    }
    if (!dropped)
    {
      // WepEntryPoint supporta il generic drop!
      dropped = (RD3_DesktopManager.WebEntryPoint.OnDrop(a,this.DragObj,(window.event)?window.event:ev))
    }
  }
  //
  if (this.IsResizing || (this.IsDragging && !dropped && this.TrasfObj))
  {
    // IE dopo aver nascosto l'oggetto originale perde lo stato checked degli input di tipo radio, ripristino tali proprieta'
    if (RD3_Glb.IsIE() && this.DragElem && this.CloneElem)
    {
      var orgChecks = this.DragElem.getElementsByTagName("input");
      var clnChecks = this.CloneElem.getElementsByTagName("input");
      if (orgChecks.length == clnChecks.length)
        for (var i=0; i < clnChecks.length; i++)
          if (clnChecks[i].type == "radio")
            orgChecks[i].checked = clnChecks[i].checked;
    }
    //
    // Calcolo le coordinate finali dell'oggetto
    var obj, ele;
    if (this.IsResizing)
    {
      obj = this.ResElem;
      ele = this.TrasfElem;
    }
    else
    {
      obj = this.CloneElem;
      ele = this.DragElem;
    }
    //
    var canmovex = (this.TrasfObj && this.TrasfObj.CanMoveX)? this.TrasfObj.CanMoveX() : true;
    var canmovey = (this.TrasfObj && this.TrasfObj.CanMoveY)? this.TrasfObj.CanMoveY() : true;
    //    
    // Calcolo il fattore di conversione da mm/inch a pixel, se lo stile e' gia' in px il fattore di conversione e' 1    
    var wht = ele.style.width || ele.style.flexBasis;  
    var res = wht.indexOf("px") == -1 ? parseFloat(ele.style.width || ele.style.flexBasis)/ele.clientWidth : 1;
    //
    // Chrome scrolla anche lui e perdo i delta
    // Nella StartDrag mi sono memorizzato lo stato di tutte le scrollbar. Controllo se si sono mosse a mia insaputa
    if (this.IsResizing && RD3_Glb.IsChrome())
    {
      // Se ho perso dei delta, ne tengo conto
      var o = this.DragElem;
      while (o)
      {
        if (o.origScrollLeft != undefined) this.TrueOrigLeft -= (o.scrollLeft - o.origScrollLeft);
        if (o.origScrollTop != undefined)  this.TrueOrigTop -= (o.scrollTop - o.origScrollTop);
        o = o.parentNode;
      }
    }
    //
    var dx = canmovex? (obj.offsetLeft - this.TrueOrigLeft) * res : 0;
    var dy = canmovey? (obj.offsetTop - this.TrueOrigTop) * res : 0;
    var dw = (obj.clientWidth - this.TrueOrigWidth) * res;
    var dh = (obj.clientHeight - this.TrueOrigHeight) * res;
    var x = parseFloat(ele.style.left || 0)+dx;
    var y = parseFloat(ele.style.top || 0)+dy;
    var w = parseFloat(ele.style.width || ele.style.flexBasis)+dw;
    var h = parseFloat(ele.style.height)+dh;
    //
    if (ele.style.borderLeftWidth && (ele.style.borderLeftWidth.indexOf("px") > 0  || ele.style.borderLeftWidth.indexOf("pt") > 0))
      w += ele.style.borderLeftWidth.indexOf("pt")!=-1 ? (parseFloat(ele.style.borderLeftWidth)*72)/96 : parseFloat(ele.style.borderLeftWidth);
    if (ele.style.borderRightWidth && (ele.style.borderRightWidth.indexOf("px") > 0  || ele.style.borderRightWidth.indexOf("pt") > 0))
      w += ele.style.borderRightWidth.indexOf("pt")!=-1 ? (parseFloat(ele.style.borderRightWidth)*72)/96 : parseFloat(ele.style.borderRightWidth);
    //
    if (ele.style.borderTopWidth && (ele.style.borderTopWidth.indexOf("px") > 0  || ele.style.borderTopWidth.indexOf("pt") > 0))
      h += ele.style.borderTopWidth.indexOf("pt")!=-1 ? (parseFloat(ele.style.borderTopWidth)*72)/96 : parseFloat(ele.style.borderTopWidth);
    if (ele.style.borderBottomWidth && (ele.style.borderBottomWidth.indexOf("px") > 0  || ele.style.borderBottomWidth.indexOf("pt") > 0))
      h += ele.style.borderBottomWidth.indexOf("pt")!=-1 ? (parseFloat(ele.style.borderBottomWidth)*72)/96 : parseFloat(ele.style.borderBottomWidth);
    //
    // L'oggetto vuole adattare le coordinate ?
    if (this.TrasfObj.AdaptCoords)
    {
      var rect = new Rect(x, y, w, h);
      //
      this.TrasfObj.AdaptCoords(rect);
      x = rect.x;
      y = rect.y;
      w = rect.w;
      h = rect.h;
    }    
    //
    // Lancio evento
    this.TrasfObj.OnTransform(x, y, w, h, (window.event)?window.event:ev);
  }
  //
  // Resetto tutto
  var save = false;
  if (dropped && this.DragObj && this.DragObj.WantDropRestore)
    save = this.DragObj.WantDropRestore();
  //
  // Se sto spostando l'oggetto potrebbe non volere il reset completo dell'oggetto originale
  // avviene nei report box se lo spostamento non viene mai cancellato
  if (this.TrasfObj!=null && this.TrasfXMode==0 && this.TrasfYMode==0 && this.TrasfObj.CanCancelMove)
    save = !this.TrasfObj.CanCancelMove();
  //
  this.Reset(save);
  //
  // Ora non e' piu' premuto
  this.LButtonDown = false;
  //
  // Faccio il controllo relativo al doppio click sulla caption della colonna..
  x = (window.event)?window.event.clientX:ev.clientX;
  y = (window.event)?window.event.clientY:ev.clientY;
  var but = ((window.event)?window.event.button:ev.button);
  var d = new Date();
  //
  // Vediamo se il mouse up e' avvenuto nello stesso posto del down: se si e se e' avvenuto rapidamente e' un doppio click
  if (Math.abs(x-this.MD_XPos)<4 && Math.abs(y-this.MD_YPos)<4 && but==this.MD_Button)
  {
    // Posso effettivamente avere un click
    var dbl = false;
    if (this.MD_Clicked && d-this.MD_Time<400)
      dbl = true;
    //
    // Se ho avuto un doppio click su una caption di colonna in lista faccio partire l'evento..
    if (dbl && !RD3_Glb.IsIE() && this.MD_Target && this.MD_Target.className=="panel-field-caption-list")
    {
      RD3_KBManager.IDRO_DoubleClick(ev);
    }
    //
    // Dopo aver gestito un doppio click, ritorno al tipo normale.
    this.MD_Clicked = !dbl;
  }
}


// ******************************************
// Inizializzazione del controller
// ******************************************
DDManager.prototype.OnMouseMove = function(ev) 
{
  // Non interferisco con il comportamento della combo box
  if (RD3_Glb.IsTouch() && this.OpenCombo)
    return;
  //
  var x = (window.event)?window.event.clientX:ev.clientX;
  var y = (window.event)?window.event.clientY:ev.clientY;
  var obj = (window.event)?window.event.srcElement:ev.target;
  //
  // Se e' la WelcomeBox (iframe) devo traslare le coordinate
  if (RD3_Glb.IsIE() && !obj && ev && ev.srcElement)
    obj = ev.srcElement;
  if (obj && obj.ownerDocument != document && RD3_DesktopManager.WebEntryPoint.WelcomeBox.contentWindow && obj.ownerDocument == RD3_DesktopManager.WebEntryPoint.WelcomeBox.contentWindow.document)
  {
    x += RD3_Glb.GetScreenLeft(RD3_DesktopManager.WebEntryPoint.WelcomeBox);
    y += RD3_Glb.GetScreenTop(RD3_DesktopManager.WebEntryPoint.WelcomeBox);
  }
  //
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    // Stop tracking when the last finger is removed from this element
    if (ev.targetTouches.length != 1)
      return false;
    //
    if (RD3_Glb.CanScroll(ev.target))
      return;
    //
    ev.preventDefault();
    //
    x = ev.targetTouches[0].clientX;
    y = ev.targetTouches[0].clientY;
    obj = RD3_Glb.ElementFromPoint(x, y);
    //
    if (obj == null)
      return;
    //
    if (Math.abs(x-this.TouchOrgX)>RD3_ClientParams.TouchMoveLimit || Math.abs(y-this.TouchOrgY)>RD3_ClientParams.TouchMoveLimit)
    {
      this.TouchMove = true;
      this.ResetMouseOver();
      this.HandleTouchEvent(obj, "move", ev);
    }
  }
  //
  // In Zen l'header ha un oggetto in piu'... se lo seleziono devo usare il padre
  if (obj && obj.className == "header-list-span-obj-zen")
    obj = obj.parentNode;
  //
  // Gestiamo anche l'immagine di filtro
  if (obj && RD3_Glb.HasClass(obj, "panel-filter-image"))  
    obj = obj.parentNode;
  //
  if (this.ScrollTimerID!=0)
  {
    window.clearInterval(this.ScrollTimerID);
    this.ScrollTimerID = 0;
  }
  //
  if (this.InDetection)
  {
    // Vediamo se mi sono spostato abbastanza...
    if (Math.abs(x-this.XPos)>RD3_ClientParams.DragSensibility || Math.abs(y-this.YPos)>RD3_ClientParams.DragSensibility)
    {
      if (this.TouchTimer)
      {
        window.clearTimeout(this.TouchTimer);
        this.TouchTimer=0;
      }
      //
      this.StartDrag(ev);
    }
    //
    // Chiudo eventuali menu' popup rimasti aperti (NON se sono in taskbar e sto draggando un comando, altrimenti chiudo il menu')
    if (!(this.DragObj instanceof Command && RD3_DesktopManager.WebEntryPoint.MenuType == RD3_Glb.MENUTYPE_TASKBAR))
      RD3_DesktopManager.WebEntryPoint.CmdObj.ClosePopup();
  }
  //
  if (this.IsDragging)
  {
    // Sposto l'oggetto con me
    var canmovex = (this.TrasfObj && this.TrasfObj.CanMoveX)? this.TrasfObj.CanMoveX() : true;
    var canmovey = (this.TrasfObj && this.TrasfObj.CanMoveY)? this.TrasfObj.CanMoveY() : true;
    var dx = canmovex? x-this.XPos : 0;
    var dy = canmovey? y-this.YPos : 0;
    this.CloneElem.style.left =  (dx + this.OrigLeft) + "px";
    this.CloneElem.style.top =  (dy + this.OrigTop) + "px";
    this.CloneElem.style.display =  "block";
    //
    // Vediamo se posso droppare
    var a = null;
    if (this.DragObj)
      a = this.GetDroppableObject(x, y);
    //
    // Chiedo all'oggetto se vuole specificare lui l'oggetto su cui fare l'HL
    if (a && a.DropElement)
      obj = a.DropElement();
    //
    if (a)
      this.CloneElem.style.cursor = "pointer";
    else
      this.CloneElem.style.cursor = "not-allowed";
    //
    // Lo evidenzio in rosso
    this.HLDropObj(a);
    //
    this.UpdateStatusBar();
    //
    this.CheckScrollbar(x, y);
  }
  //
  if (this.IsResizing)
  {
    // Ridimensiono l'oggetto con me
    var dx = x-this.XPos;
    var dy = y-this.YPos;
    //
    var dl = (this.TrasfXMode==-1)?dx:0;
    var dt = (this.TrasfYMode==-1)?dy:0;
    var dw = this.TrasfXMode * dx;
    var dh = this.TrasfYMode * dy;
    //
    // Controllo dimensioni negative
    if (this.OrigWidth+dw<RD3_ClientParams.MinSize)
      dw = -this.OrigWidth+RD3_ClientParams.MinSize;
    if (this.OrigHeight+dh<RD3_ClientParams.MinSize)
      dh = -this.OrigHeight+RD3_ClientParams.MinSize;
    //
    this.ResElem.style.left = (this.OrigLeft+dl) + "px";
    this.ResElem.style.top = (this.OrigTop+dt) + "px";
    this.ResElem.style.width = (this.OrigWidth+dw) + "px";
    this.ResElem.style.height = (this.OrigHeight+dh) + "px";
    //
    this.CheckScrollbar(x, y);
    //
    this.UpdateStatusBar();
  }
  //
  // Controllo trasformabilita'
  if (!this.InDetection && !this.IsDragging && !this.IsResizing)
  {
    // Vediamo se rilevo un oggetto trasformabile
    var tobj = this.GetTransformableObject(obj.id, obj, x, y);
    //
    // Se sono sulla scrollbar dell'oggetto non lo considero
    if (this.IsOnScrollBar(obj, x, y))
      tobj = null;
    //
    // Se avevo un trasfobj e ora non ce l'ho, ripristino il cursore sul vecchio oggetto
    if (tobj==null && this.TrasfObj!=null)
    {
      if (this.TrasfObj.ApplyCursor)
        this.TrasfObj.ApplyCursor("");
      else
        RD3_Glb.ApplyCursor(this.TrasfElem, "");
    }
    //
    this.TrasfObj = tobj;
    //
    if (this.TrasfObj)
    {
      // Chiedo all'oggetto se vuole specificare lui l'elemento da tirare
      if (this.TrasfObj.DropElement)
        obj = this.TrasfObj.DropElement();
      //
      var ox = x - RD3_Glb.GetScreenLeft(obj);
      var oy = y - RD3_Glb.GetScreenTop(obj);
      //
      this.TrasfElem = obj;
      //
      var x1 = RD3_Glb.GetScreenLeft(this.TrasfElem);
      var x2 = x1 + obj.offsetWidth;
      var y1 = RD3_Glb.GetScreenTop(this.TrasfElem);
      var y2 = y1 + obj.offsetHeight;
      //
      // Posso farlo? lo chiedo all'oggetto
      var canresw = (this.TrasfObj.CanResizeW)?this.TrasfObj.CanResizeW():true;
      var canresh = (this.TrasfObj.CanResizeH)?this.TrasfObj.CanResizeH():true;
      //
      var canresl = (this.TrasfObj.CanResizeL)?this.TrasfObj.CanResizeL():true;
      var canresr = (this.TrasfObj.CanResizeR)?this.TrasfObj.CanResizeR():true;
      var canrest = (this.TrasfObj.CanResizeT)?this.TrasfObj.CanResizeT():true;
      var canresd = (this.TrasfObj.CanResizeD)?this.TrasfObj.CanResizeD():true;
      //
      if (ox<=RD3_ClientParams.ResizeLimit && canresw && canresl)
        this.TrasfXMode = -1;      
      else if (this.TrasfElem.offsetWidth-ox<=RD3_ClientParams.ResizeLimit && canresw && canresr)
        this.TrasfXMode = 1;
      else
        this.TrasfXMode = 0;
      if (oy<=RD3_ClientParams.ResizeLimit && canresh && canrest)
        this.TrasfYMode = -1;      
      else if (this.TrasfElem.offsetHeight-oy<=RD3_ClientParams.ResizeLimit && canresh && canresd)
        this.TrasfYMode = 1;
      else
        this.TrasfYMode = 0;
      //
      // Ora applico il cursore
      var cn = "";
      switch(this.TrasfXMode)
      {
        case -1:
        switch(this.TrasfYMode)
        {
          case -1: cn = "nw-resize";  break;
          case 0:  cn = "e-resize";   break;
          case 1:  cn = "sw-resize";  break;
        }
        break;

        case 0:
        switch(this.TrasfYMode)
        {
          case -1: cn = "n-resize";  break;
          case 0:  cn = "move";      break;
          case 1:  cn = "n-resize";  break;
        }
        break;

        case 1:
        switch(this.TrasfYMode)
        {
          case -1: cn = "sw-resize"; break;
          case 0:  cn = "e-resize";  break;
          case 1:  cn = "nw-resize"; break;
        }
        break;        
      }
      //
      // Verifico se l'oggetto ha delle limitazioni sul tipo di trasformazione che puo' effettuare
      var canmove = true;
      var canresize = true;
      if (this.TrasfObj.IsMoveable)
        canmove = this.TrasfObj.IsMoveable();
      if (this.TrasfObj.IsResizable)
        canresize = this.TrasfObj.IsResizable();
      if (canmove && !canresize)
      {
        this.TrasfXMode = 0;
        this.TrasfYMode = 0;
        cn = "move";
      }
      else if (!canmove && canresize)
      {
        if (this.TrasfXMode == 0 && this.TrasfYMode == 0)
        {
          // Se passo il mouse sul lato applico il cursore di ridimensionamento, se poi vado nel mezzo dell'oggetto e non 
          // mi posso muovere allora devo eliminare il cursore che avevo impostato: altrimenti ho il mouse al centro
          // dell'oggetto ma vedo il cursore di ridimensionamento!
          cn = "";
          if (this.TrasfObj.ApplyCursor)
            this.TrasfObj.ApplyCursor(cn);
          else
            RD3_Glb.ApplyCursor(this.TrasfElem, cn);
          //
          // Devo abortire il movimento: annullo oggetto
          this.TrasfObj = null;
        }
      }
      //
      // Chiedo all'oggetto se vuole essere lui a mettere il cursore di trasformazione
      if (this.TrasfObj)
      {
        if (this.TrasfObj.ApplyCursor)
          this.TrasfObj.ApplyCursor(cn);
        else
          RD3_Glb.ApplyCursor(this.TrasfElem, cn);
      }
    }
  }
}


// ******************************************
// Ritorna l'oggetto del modello corrispondente all'ID
// ******************************************
DDManager.prototype.GetObject = function(id, wantvalue) 
{
  // Se non c'e' l'ID, niente oggetto!
  if (!id)
    return null;
  //
  // Innanzitutto cerco nella mappa per l'ID secco
  var a = RD3_DesktopManager.ObjectMap[id];
  //
  // Caso particolare welcome-form nel mobile
  if (a==null && id=="welcome")
    a = RD3_DesktopManager.WebEntryPoint.WelcomeForm;
  //
  // Se non lo trovo puo' darsi che sia un'oggetto del DOM interno, allora
  // estraggo "l'estensione"
  if (a==null)
  {
    var form = false;
    var listform = false;
    var listQBE = false;
    var p=id.indexOf(":lv");
    if (p<=0)
    {
      p = id.indexOf(":fv");
      form = true;
    }
    if (p <= 0) 
    {
      p = id.indexOf(":gv");
      listform = true;
    }
    if (p <= 0) 
    {
      p = id.indexOf(":qv");
      listQBE = true;
      form = true;
    }
    if (p>0)
    {
      if (wantvalue)
      {
        var s = id.substr(0,p);
        var nr = (form)?0:parseInt(id.substr(p+3,9999));
        a = RD3_DesktopManager.ObjectMap[s];
        if (a)
        {
          // Se devo restituire il valore fittizio sotteso alla cella QBE in lista
          if (listQBE || (listform && id.substr(p, 9999) == ":gv-1"))
            return a.PQBEValue;
          //
          // Ho trovato il campo, ora prelevo il valore
          var ar = a.ParentPanel.ActualPosition + nr;
          var lstgrp = a.ParentPanel.ListGroupRoot;
          //
          // Se il pannello e' gruppato devo chiedere alla root dei gruppi quale valore devo andare a prendere
          if (a.ParentPanel.IsGrouped())
            ar = a.ParentPanel.GetRowIndex(nr);
          //
          if (a.ParentPanel.PanelMode != RD3_Glb.PANEL_FORM && form)
          {
            // Ho chiesto il valore della form ma il pannello e' in lista!
            // Effetto dell'animazione: la form perde il fuoco dopo 250 milli, scatta il lost focus della form ma il pannello e' gia'
            // in lista e ActualPosition e' cambiata.. in questo caso mi prendo la riga corrente..
            ar = a.ParentPanel.ActualPosition + a.ParentPanel.ActualRow;
            //
            if (lstgrp != null)
              {
                ar = a.ParentPanel.GetRowIndex(a.ParentPanel.ActualRow);
              }
          }
          //
          if (a.ParentPanel.PanelMode != RD3_Glb.PANEL_LIST && !form)
          {
            // Ho chiesto il valore della lista ma il pannello e' in form!
            // Effetto dell'animazione: la lista perde il fuoco dopo 250 milli, scatta il lost focus della lista ma il pannello e' gia'
            // in form e ActualPosition e' cambiata.. in questo caso mi prendo la riga corrente..
            ar = a.ParentPanel.ActualPosition;
            //
            if (lstgrp != null)
              {
                ar = a.ParentPanel.GetRowIndex(0);
              }
          }
          //
          if (!a.ListList)
          {
              // Se il campo non e' in lista, non posso leggere l'ID per sapere
            // a quale riga si riferisce, quindi uso la riga attuale del pannello
            ar = a.ParentPanel.ActualPosition + a.ParentPanel.ActualRow;
            //
            if (lstgrp != null)
              {
                ar = a.ParentPanel.GetRowIndex(a.ParentPanel.ActualRow);
              }
          }
          //
          // su IE ho gia' cambiato riga, devo quindi usare il PValue della cella
          if (RD3_Glb.IsIE() && listform && a.ListFormCell)
            return a.ListFormCell.PValue;
          //
          return a.PValues[ar];
        }
      }
      else
      {
        id = id.substr(0,p);
      }
    }
    //
    // Provo a verificare se e' un gruppo in lista
    var pp = id.indexOf(":lsg:")
    if (pp != -1)
      id = id.substr(0,pp);
    //
    // Provo a gestire i suffissi di vari caratteri
    var suf = id.substr(id.length-4);
    if (suf==":cap" || suf==":txt" || suf==":img" || suf==":div" || suf==":frl" || suf==":clo" || suf==":con" || suf==":min" || suf==":max" || suf==":hlp" || suf==":dbg" || suf.substring(0,3)==":bd" || suf==":lht" || suf==":hdr" || suf==":tdi" || suf==":bba" || suf==":tlc")
      id = id.substr(0,id.length-4);
    //
    var suf = id.substr(id.length-5);
    if (suf==":link" || suf==":fcke" || suf==":lcke" || suf==":html")
      id = id.substr(0,id.length-5); 
    //  
    var suf = id.substr(id.length-6);
    if (suf==":tcmb1" || suf==":tcmb2" || suf==":tcmb3")
      id = id.substr(0,id.length-6);  
    //
    var suf = id.substr(id.length-7);
    if (suf==":header" || suf==":status")
      id = id.substr(0,id.length-7);    
    //
    var suf = id.substr(id.length-8);
    if (suf==":menusep")
      id = id.substr(0,id.length-8);    
    //
    suf = id.substr(id.length-3);
    if (suf==":fc" || suf==":lc" || suf==":bb")
      id = id.substr(0,id.length-3);
    //
    if (id == "forms-container" || id.indexOf("dock-container")!=-1)
      id = "wep";
    //
    // Provo con il prefisso tl: forse e' la toolbar
    suf = id.substr(0,3)
    if (suf=="tl:")
      id = id.substr(3);
    //
    a = RD3_DesktopManager.ObjectMap[id];
    //
    // Se non ho trovato ed e' un oggetto di pannello o una combo, provo a vedere se togliendo il suffisso
    // a destra, riesco a trovare il pannello o la combo
    if (!a && (id.substr(0,4)=="pan:" || id.substr(0,4)=="cmb:"))
      a = RD3_DesktopManager.ObjectMap[id.substr(0, id.lastIndexOf(":"))];
  }
  //
  return a;
}


// ******************************************
// Ritorna un oggetto draggabile
// ******************************************
DDManager.prototype.GetDraggableObject = function(id) 
{
  // Prendo l'oggetto di modello corrispondente
  var a = this.GetObject(id);
  //
  // Chiedo all'oggetto se vuole essere draggato
  if (a)
  {
    if (a.IsDraggable)
    {
      if (!a.IsDraggable(id))
        a = null;
      else
      {
        // L'oggetto e' draggabile, ma gli chiedo se vuole specificare lui quale oggetto draggare
        // es: se clicco su uno span di un book non devo draggare lo span ma la box
        // passo l'ID nel caso l'oggetto abbia piu' di un oggetto dom draggabile
        if (a.DragObj)
          a = a.DragObj(id);
      }
    }
    else
    {
      a = null;
    }
  }
  //
  return a;
}


// ******************************************
// Ritorna un oggetto draggabile
// ******************************************
DDManager.prototype.GetTransformableObject = function(id, obj, x, y) 
{
  if (!id)
    return null;
  //
  // Prendo l'oggetto di modello corrispondente
  var a = this.GetObject(id);
  //
  // Chiedo all'oggetto se vuole essere draggato
  if (a)
  {
    if (a.IsTransformable)
    {
      if (!a.IsTransformable(id))
        a = null;
      else
      {
        // L'oggetto e' trasformabile, ma gli chiedo se vuole specificare lui quale oggetto dovra' essere trasformato
        // Si usa la stessa funzione per il perche' l'operazione e' analoga.
        if (a.DragObj)
          a = a.DragObj(id, obj, x, y);
      }
    }
    else
    {
      a = null;
    }
  }
  //
  // L'oggetto draggabile e' la form ma il mouse e' sopra a un pulsante di toolbar:
  // non permetto il drag, devo poter cliccare il pulsante
  if (a instanceof WebForm && obj && (obj.tagName == "IMG" || a.tagName == "BUTTON"))
    a = null;
  //
  return a;
}


// ******************************************
// Ritorna un oggetto droppabile
// ******************************************
DDManager.prototype.GetDroppableObject = function(x, y) 
{
  if (!this.DropList)
    return null;
  //
  var frlist = new Array();
  //
  // vado all'indietro per rispettare lo z-order per i book
  var n = this.DropList.length;
  for (var i = n-1; i>=0; i--)
  {
    var obj = this.DropList[i];
    this.DragObj2 = false;
    var cont = (obj.AbsLeft<=x && obj.AbsRight>=x && obj.AbsTop<=y && obj.AbsBottom>=y);
    //
    // Alcuni oggetti (comandi) potrebbero avere due facce.. verifico anche la loro seconda faccia..
    if (!cont && obj.AbsLeft2)
    {
      cont = (obj.AbsLeft2<=x && obj.AbsRight2>=x && obj.AbsTop2<=y && obj.AbsBottom2>=y);
      this.DragObj2 = true;
    }
    //
    if (cont)
    {
      // trovato, se e' nella parte visibile del suo parent
      var ok = true;
      if (obj.GetParentFrame)
      {
        ok = false;
        var fr = obj.GetParentFrame();
        if (fr)
        {
          var p = fr.ContentBox;
          //
          // Verifichiamo che obj sia visibile in p
          var pl = RD3_Glb.GetScreenLeft(p,true);
          var pt = RD3_Glb.GetScreenTop(p,true);
          var pr = pl + p.clientWidth;
          var pb = pt + p.clientHeight;
          //
          // Uso l'intersezione fra rettangoli
          if (pl<obj.AbsRight && pr>obj.AbsLeft && pt<obj.AbsBottom && pb>obj.AbsTop)
            ok = true;
        }
      }
      //
      if (ok)
      {
        // La webform si inserisce come oggetto di drop se e' popup per evitare
        // che il drag la "buchi" e selezioni oggetto sotto di lei.
        // Ecco perche' se ho selezionato la form devo tornare null
        if (obj instanceof WebForm)
          return null;
        else
          return obj;
      }
    }
  }
  //
  return null;
}


// ******************************************
// Annulla tutte le variabili
// ******************************************
DDManager.prototype.Reset = function(saveclone) 
{
  // Se c'era l'oggetto lo tolgo dal DOM
  if (this.CloneElem && !saveclone)
  {
    if (this.CloneElem.parentNode)
      this.CloneElem.parentNode.removeChild(this.CloneElem);
    this.CloneElem = null;
  }
  //
  if (this.ResElem.parentNode)
    this.ResElem.parentNode.removeChild(this.ResElem);
  //
  if (this.DragElem && !saveclone)
  {
    this.DragElem.style.visibility =  "";
    //
    // Chrome, Safari e Firefox dopo il cloning perdono lo stato checked degli input di tipo radio
    // ora lo ripristino grazie ai valori che mi ero salvato prima del cloning
    if (RD3_Glb.IsWebKit() || RD3_Glb.IsFirefox())
    {
      var radios = this.DragElem.getElementsByTagName("input");
      var n = radios.length;
      for (var i=0; i<n; i++)
      {
        if (radios[i].orgChecked)
        {
          radios[i].checked = true;
          radios[i].orgChecked = undefined;
        }
      }
    }
    this.DragElem = null;
  }
  //
  // Spengo le evidenziazioni
  this.HLDropObj();
  this.HLDragElem.style.display = "none";
  //
  this.IsDragging  = false;
  this.InDetection = false;
  this.IsResizing = false;
  this.DragObj = null;
  this.DropList = null;
  this.XPos = 0;
  this.YPos = 0;
  this.TrasfObj = null;
  this.TrasfElem = null;
  this.TrasfXMode = 0; 
  this.TrasfYMode = 0;
  window.defaultStatus = "";
}


// ******************************************
// Inizia il drag dell'oggetto
// ******************************************
DDManager.prototype.StartDrag= function(ev) 
{
  // Non ci sono oggetti da tirare?
  if (!this.DragObj && !this.TrasfObj)
    return;
  //
  this.InDetection = false;
  this.IsDragging = true;
  //
  // Chiedo all'oggetto se vuole essere lui a dire quale immagine deve essere
  // mostrata durante il drag&drop
  var obj = this.TrasfObj?this.TrasfObj:this.DragObj;
  //
  // calcolo l'elemento da tirare
  if (obj && obj.DropElement)
    this.DragElem = obj.DropElement();
  //
  if (obj && obj.GetDropList)
    this.DropList = obj.GetDropList();
  else
    this.DropList = RD3_DesktopManager.WebEntryPoint.GetDropList(obj);
  //
  if (obj.CreateDragImage)
    this.CloneElem = obj.CreateDragImage();
  else
  {
    // Chrome, Safari e Firefox dopo il cloning perdono lo stato checked degli input di tipo radio
    // mi salvo tali informazioni prima del cloning
    if (RD3_Glb.IsWebKit() || RD3_Glb.IsFirefox())
    {
      var radios = this.DragElem.getElementsByTagName("input");
      var n = radios.length;
      for (var i=0; i<n; i++)
      {
        if (radios[i].type == "radio")
          radios[i].orgChecked = radios[i].checked;
      }
    }
    //
    this.CloneElem = this.DragElem.cloneNode(true);
    //
    // Chrome, Safari e Firefox dopo il cloning perdono il value delle textarea
    // ripristino tali proprieta'
    if (RD3_Glb.IsWebKit() || RD3_Glb.IsFirefox() )
    {
      if (this.DragElem.type == "textarea")
        this.CloneElem.value = this.DragElem.value;
      else
      {
        var orgTextareas = this.DragElem.getElementsByTagName("textarea");
        var clnTextareas = this.CloneElem.getElementsByTagName("textarea");
        var n = orgTextareas.length;
        for (var i=0; i<n; i++)
          clnTextareas[i].value = orgTextareas[i].value;
      }
    }
    //
    // IE dopo il cloning perde lo stato checked degli input di tipo check
    // ripristino tali proprieta'
    if (RD3_Glb.IsIE())
    {
      var orgChecks = this.DragElem.getElementsByTagName("input");
      var clnChecks = this.CloneElem.getElementsByTagName("input");
      var n = orgChecks.length;
      for (var i=0; i<n; i++)
      {
        if (clnChecks[i].type == "checkbox")
          clnChecks[i].checked = orgChecks[i].checked;
      }
    }
    //
    if (this.DragElem.tagName == "SPAN" || this.DragElem.tagName == "IMG")
    {
      // Se e' uno span, lo racchiudo in un DIV, azzerando il top
      var d = document.createElement("div");
      d.appendChild(this.CloneElem);
      this.CloneElem.style.top="0px";
      this.CloneElem.style.left="0px";
      this.CloneElem = d;
    }
  }
  //
  // Imposto alcune proprieta' importanti dell'elemento
  this.CloneElem.style.display = "none";
  this.CloneElem.style.position = "absolute";
  //
  // Impostando l'ID posso attivare ulteriori proprieta' visuali
  this.CloneElem.id = "clone-element";
  //
  var sc = "";
  if (RD3_Glb.IsMobile())
  {
    var scf = 1.5;
    var md = this.DragElem.offsetWidth;
    if (md<this.DragElem.offsetHeight)
      md = this.DragElem.offsetHeight;
    //
    // Se l'oggetto e' troppo piccolo, allargo la scala
    if (md<60 && md>0)
    {
      scf = scf*(60.0/md);
      if (scf>8)
        scf = 8;
    }
    //
    sc = "RD3_Glb.SetTransform(document.getElementById('clone-element'), 'scale3d("+scf+","+scf+",1)');";
    //
    // Segnalo che ho cliccato l'elemento trascinato, in questo modo nel mobile i pannelli cambiano riga.
    // Su web non serve perche' lo fanno nel MouseDown mentre nel Mobile lo fanno nel TouchUp
    var sobj = RD3_KBManager.GetObject(this.DragElem, true);
    if (sobj && sobj.OnTouchUp)
      sobj.OnTouchUp(ev, true, this.DragElem);
  }
  //
  // Assegno una trasparenza al clone se la vuole
  if (!obj.NoOpacity)
  {
    if (RD3_Glb.IsMobile())
      sc += ";document.getElementById('clone-element').style.opacity='0.6'";
    else
    {
      this.CloneElem.style.opacity = "0.6";
      this.CloneElem.style.filter = "alpha(opacity=60)";
    }
  }
  if (sc!="")
    window.setTimeout(sc,50);
  //
  // Imposto le larghezze, diverso se e' uno span
  if (this.DragElem.tagName == "SPAN")
  {
    this.CloneElem.style.width =  (this.DragElem.offsetWidth+4) + "px";
    this.CloneElem.style.height = (this.DragElem.offsetHeight)  + "px";
  }
  else
  {    
    this.CloneElem.style.width =  (this.DragElem.clientWidth) + "px";
    this.CloneElem.style.height = (this.DragElem.clientHeight)  + "px";
  }
  //
  // Se non e' un drag, allora aggiusto i bordi dell'oggetto secondo i parametri e nascondo l'oggetto iniziale
  var draghl = false;
  //
  // Questo e' un drag, vediamo se devo nascodere l'oggetto iniziale
  // oppure usare evidenziazione drag
  if (!this.TrasfObj)
  {
    draghl = true;
    if (obj && obj.WantDragHL)
      draghl = obj.WantDragHL();
  }
  //
  this.OrigLeft = RD3_Glb.GetScreenLeft(this.DragElem,true);
  this.OrigTop = RD3_Glb.GetScreenTop(this.DragElem,true);
  this.OrigWidth = this.DragElem.clientWidth;
  this.OrigHeight = this.DragElem.clientHeight;
  this.TrueOrigLeft = this.OrigLeft;
  this.TrueOrigTop = this.OrigTop;
  this.TrueOrigWidth = this.OrigWidth;
  this.TrueOrigHeight = this.OrigHeight;
  //
  // Chrome scrolla anche lui e perdo i delta (non viene chiamata la .ScrollaBC)
  // Mi memorizzo lo stato di tutte le scrollbar
  if (RD3_Glb.IsChrome())
  {
    var o = this.DragElem;
    while (o)
    {
      o.origScrollLeft = o.scrollLeft;
      o.origScrollTop = o.scrollTop;
      o = o.parentNode;
    }
  }
  //
  // Alcuni oggetti hanno bisogno di tenere conto delle scrollbar iniziali: chiedo all'oggetto l'offset da usare
  // in base alla sua struttura interna.. (ES: TreeNode D&D)
  var st = 0;
  var sl = 0;
  if (this.DragObj && this.DragObj.AccountOverFlowX)
    sl = this.DragObj.AccountOverFlowX();
  if (this.DragObj && this.DragObj.AccountOverFlowY)
    st = this.DragObj.AccountOverFlowY();
  this.OrigLeft -= sl;
  this.OrigTop -= st;
  //
  if (draghl)
  {
    // Uso l'evidenziazione drag
    this.HLDragElem.style.left   = this.OrigLeft + "px";
    this.HLDragElem.style.top    = this.OrigTop + "px";
    this.HLDragElem.style.width  = (this.DragElem.offsetWidth) + "px";
    this.HLDragElem.style.height = (this.DragElem.offsetHeight)  + "px";
    this.HLDragElem.style.display = "";
  }
  else
  {
    if (RD3_ClientParams.MoveBorders!="")
      this.CloneElem.style.border = RD3_ClientParams.MoveBorders;
    this.DragElem.style.visibility = "hidden";
  }
  //
  // Lo metto all'inizio del body
  document.body.appendChild(this.CloneElem);
}


// ******************************************
// Accende l'evidenziazione sull'oggetto obj
// ******************************************
DDManager.prototype.HLDropObj = function(obj) 
{
  // Nulla da fare era gia' evidenziato
  if (obj == this.LastDropObj)
    return;
  this.LastDropObj = obj;
  //
  if (obj)
  {
    //
    // Posiziono l'HLDropElem, verificando quale 'faccia' dell'oggetto evidenziare
    var l = obj.AbsLeft - 2;
    var t = obj.AbsTop - 2;
    var w = obj.AbsRight - obj.AbsLeft;
    var h = obj.AbsBottom - obj.AbsTop;
    //
    if (this.DragObj2)
    {
      l = obj.AbsLeft2 - 2;
      t = obj.AbsTop2 - 2;
      w = obj.AbsRight2 - obj.AbsLeft2;
      h = obj.AbsBottom2 - obj.AbsTop2;
    }
    //
    this.HLDropElem.style.left   = l + "px";
    this.HLDropElem.style.top    = t + "px";
    this.HLDropElem.style.width  = w + "px";
    this.HLDropElem.style.height = h + "px";
    this.HLDropElem.style.display = "";
  }
  else
  {
    this.HLDropElem.style.display = "none";
  }
}


// ******************************************
// Aggiorna la status bar
// ******************************************
DDManager.prototype.UpdateStatusBar = function() 
{
  var s = "";
  //
  // Ho un oggetto trasformabile e questo vuole aggiornare la status bar?
  if (this.TrasfObj && this.TrasfObj.UpdateDDStatus)
  {
    // Calcolo anche qui le dimensioni finali dell'oggetto
    var obj,ele;
    if (this.IsResizing)
    {
      obj = this.ResElem;
      ele = this.TrasfElem;
    }
    else
    {
      obj = this.CloneElem;
      ele = this.DragElem;
    }
    //
    // Calcolo i delta e la posizione originale
    var res = parseFloat(ele.style.width)/ele.clientWidth;
    var dx = (obj.offsetLeft - this.TrueOrigLeft) * res;
    var dy = (obj.offsetTop - this.TrueOrigTop) * res;
    var dw = (obj.clientWidth - this.TrueOrigWidth) * res;
    var dh = (obj.clientHeight - this.TrueOrigHeight) * res;
    var x = parseFloat(ele.style.left);
    var y = parseFloat(ele.style.top);
    var w = parseFloat(ele.style.width);
    var h = parseFloat(ele.style.height);
    //
    // Passo all'oggetto le informazioni sulla posizione iniziale, i delta ed il tipo di trasformazione da applicare
    s = this.TrasfObj.UpdateDDStatus(x, y, w, h, dx, dy, dw, dh, this.TrasfXMode, this.TrasfYMode);
  }
  //  
  window.defaultStatus = s;
}


// ******************************************
// Verifica se e' stato premuto ESC
// ******************************************
DDManager.prototype.OnKeyDown = function(evento) 
{
  var eve = window.event ? window.event : evento;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  //  
  // Se c'e' una combo aperta, giro a lei il messaggio
  if (this.OpenCombo)
    this.OpenCombo.OnKeyDown(evento);
  //
  // ESC = Abort operation
  if (code==27 && (this.IsDragging || this.IsResizing))
    this.Reset();
}


// ******************************************
// Verifica se e' possibile la selezione
// ******************************************
DDManager.prototype.OnSelectStart = function(evento) 
{
  if (this.IsDragging || this.IsResizing)
    return false;
  //
  // Altrimenti consento la selezione sono in un campo di input
  evento = window.event ? window.event : evento;
  var obj = (window.event)?window.event.srcElement:evento.target;
  if (obj.tagName == "INPUT" || obj.tagName == "TEXTAREA" || RD3_Glb.isInsideEditor(obj))
  {
    return true;
  }
  else
  {
    return false;
  }
}


// **********************************************
// Scrolla l'oggetto selezionato
// **********************************************
DDManager.prototype.ScrollaBC = function (frid, deltaX, deltaY)
{
  var fr = RD3_DesktopManager.ObjectMap[frid];
  var bc = fr.ContentBox;
  var isform = false;
  //
  if (bc==undefined) // Puo' essere una form!
  {
    bc = fr.FramesBox;
    isform = true;
  }
  //
  // Nel caso di Book con zona fissa devo andare a scrollare il box fisso e non il frame
  if (fr && fr instanceof Book && fr.FixedHeight > 0 && fr.Pages && fr.Pages[fr.SelectedPage] && fr.Pages[fr.SelectedPage].FixedPageBox)
    bc = fr.Pages[fr.SelectedPage].FixedPageBox
  //
  var oy = bc.scrollTop;
  var ox = bc.scrollLeft;
  bc.scrollTop += deltaY;
  bc.scrollLeft += deltaX;
  var dy = (bc.scrollTop)-oy;
  var dx = (bc.scrollLeft)-ox;
  //
  // Aggiusto posizioni varie
  if (this.DropList)
  {
    var n = this.DropList.length;
    for (var i = 0; i<n; i++)
    {
      var obj = this.DropList[i];
      if (obj.GetParentFrame)
      {
        var frobj = obj.GetParentFrame();
        if (frobj == fr || (frobj.WebForm==fr && isform))
        {
          obj.AbsLeft -= dx;
          obj.AbsRight -= dx;
          obj.AbsTop -= dy;
          obj.AbsBottom -= dy;
        }
      }
    }
  }
  //
  this.HLDropElem.style.left = (this.HLDropElem.offsetLeft-dx) + "px";
  this.HLDropElem.style.top = (this.HLDropElem.offsetTop-dy) + "px";
  //
  // Lo spostamento del drag obj si deve fare solo se esso e' nello stesso
  // frame che sto spostando
  var depf = (this.DragObj)?this.DragObj.GetParentFrame():null;
  if (!depf || depf==fr || (isform && depf.WebForm==fr))
  {
    this.HLDragElem.style.left = (this.HLDragElem.offsetLeft-dx) + "px";
    this.HLDragElem.style.top = (this.HLDragElem.offsetTop-dy) + "px";
  }
  //
  if (this.IsResizing)
  {
    if (dx!=0)
    {
      if (this.OrigWidth+dx<RD3_ClientParams.MinSize)
        dx = -this.OrigWidth+RD3_ClientParams.MinSize;
      this.ResElem.style.left = (this.OrigLeft-dx) + "px";
      this.ResElem.style.width = (this.OrigWidth+dx) + "px";
      this.OrigLeft -= dx;
      this.OrigWidth += dx;
    }
    //
    if (dy!=0)
    {
      if (this.OrigHeight+dy<RD3_ClientParams.MinSize)
        dy = -this.OrigHeight+RD3_ClientParams.MinSize;
      this.ResElem.style.top = (this.OrigTop-dy) + "px";
      this.ResElem.style.height = (this.OrigHeight+dy) + "px";
      this.OrigTop -= dy;
      this.OrigHeight += dy;
    }
  }
  else
  {
    // Anche in caso di moving, aggiusto le coordinate iniziali
    // per poter tenere conto delle scrollbar
    // Non lo faccio per Chrome che scrolla anche lui gli oggetti
    if (!RD3_Glb.IsChrome())
    {
      this.TrueOrigLeft -= dx;
      this.TrueOrigTop -= dy;
    }
  }
}



// **********************************************
// Scrolla l'oggetto selezionato
// **********************************************
DDManager.prototype.CheckScrollbar = function (x, y)
{
  // Se sono mobile non faccio nulla
  if (RD3_Glb.IsMobile())
    return;
  //
  // Se c'e' gia' uno scroll in corso non faccio nulla
  if (this.ScrollTimerID)
    return;
  //
  // Oggetto non valido
  var obj = (this.DragObj?this.DragObj:this.TrasfObj);
  if (!obj.GetParentFrame)
    return;
  //
  // Vediamo se posso scrollare qualche frame nella form che contiene
  // l'oggetto in fase di drag  
  var f = obj.GetParentFrame().WebForm;
  //
  // Verifico il framesbox
  var pt = RD3_Glb.GetScreenTop(f.FramesBox);
  var pl = RD3_Glb.GetScreenLeft(f.FramesBox);
  var pr = pl+f.FramesBox.clientWidth;
  var pb = pt+f.FramesBox.clientHeight;
  //
  var dd = RD3_Glb.IsTouch()?24:12;
  //
  if (y<pb && y>pb-dd && f.FramesBox.scrollHeight>f.FramesBox.clientHeight && x>=pl && x<=pr)
  {
    RD3_DDManager.ScrollaBC(f.Identifier, 0, 12);
    this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + f.Identifier + "', 0, 12)",20);
  }
  else if (y>pt && y<pt+dd && f.FramesBox.scrollHeight>f.FramesBox.clientHeight && x>=pl && x<=pr)
  {
    RD3_DDManager.ScrollaBC(f.Identifier, 0, -12);
    this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + f.Identifier + "', 0, -12)",20);
  }
  else if (x<pr && x>pr-dd && f.FramesBox.scrollWidth>f.FramesBox.clientWidth && y>=pt && y<=pb)
  {
    RD3_DDManager.ScrollaBC(f.Identifier, 12, 0);
    this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + f.Identifier + "', 12, 0)",20);
  }
  else if (x>pl && x<pl+dd && f.FramesBox.scrollWidth>f.FramesBox.clientWidth && y>=pt && y<=pb)
  {
    RD3_DDManager.ScrollaBC(f.Identifier, -12, 0);
    this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + f.Identifier + "', -12, 0)",20);
  }
  //
  // Se c'e' gia' uno scroll in corso non proseguo
  if (this.ScrollTimerID)
    return;
  //
  // Passo ai frames
  var n = f.Frames.length;
  for (var i=0; i<n && !this.ScrollTimerID; i++)
  {
    var fr = f.Frames[i];
    if (fr && fr.ContentBox)
    {
      var pt = RD3_Glb.GetScreenTop(fr.ContentBox);
      var pl = RD3_Glb.GetScreenLeft(fr.ContentBox);
      var pr = pl+fr.ContentBox.clientWidth;
      var pb = pt+fr.ContentBox.clientHeight;
      //      
      if (y<pb && y>pb-dd && fr.ContentBox.scrollHeight>fr.ContentBox.clientHeight && x>=pl && x<=pr)
      {
        RD3_DDManager.ScrollaBC(fr.Identifier, 0, 12);
        this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + fr.Identifier + "', 0, 12)",20);
      }
      else if (y>pt && y<pt+dd && fr.ContentBox.scrollHeight>fr.ContentBox.clientHeight && x>=pl && x<=pr)
      {
        RD3_DDManager.ScrollaBC(fr.Identifier, 0, -12);
        this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + fr.Identifier + "', 0, -12)",20);
      }
      else if (x<pr && x>pr-dd && fr.ContentBox.scrollWidth>fr.ContentBox.clientWidth && y>=pt && y<=pb)
      {
        RD3_DDManager.ScrollaBC(fr.Identifier, 12, 0);
        this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + fr.Identifier + "', 12, 0)",20);
      }
      else if (x>pl && x<pl+dd && fr.ContentBox.scrollWidth>fr.ContentBox.clientWidth && y>=pt && y<=pb)
      {
        RD3_DDManager.ScrollaBC(fr.Identifier, -12, 0);
        this.ScrollTimerID = window.setInterval("RD3_DDManager.ScrollaBC('" + fr.Identifier + "', -12, 0)",20);      
      }
    }
    //
    // Se il frame gestisce lo scroll di oggetti interni, chiedo a lui
    if (fr && fr.CheckScrollbar)
      fr.CheckScrollbar(obj, x, y);
  }
}


// ******************************************
// Nascondo il clone se lo avevo salvato
// ******************************************
DDManager.prototype.AfterProcessResponse = function() 
{
  if (!this.IsDragging && !this.IsResizing)
  {
    if (this.CloneElem)
    {
      this.CloneElem.parentNode.removeChild(this.CloneElem);
      this.CloneElem = null;
    }
    if (this.DragElem)
    {
      this.DragElem.style.visibility =  "";
      this.DragElem = null;
    }
  }
}


// ************************************************
// Gestore del mouse su un oggetto
// classe: tipo di passaggio
// over - mouse sull'oggetto
// '' - mouse out
// down - pulsante del mouse premuto sull'oggetto
// ************************************************
DDManager.prototype.OnMouse = function(ev, classe) 
{
  var obj = (window.event)?window.event.srcElement:ev.target;
  //
  // Tengo conto di eventuali attivatori che sono fratelli dell'oggetto vero...
  while (obj && (obj.className == "panel-value-activator" || obj.className == "combo-img" || obj.className == "combo-activator"))
    obj = obj.previousSibling;
  //
  // Se non ho un oggetto... non faccio altro!
  if (!obj)
    return;
  //
  // Ottengo l'id del primo nodo della gerarchia che abbia un id valido per RD3
  var id = RD3_Glb.GetRD3ObjectId(obj);
  //
  // Dall'id ottengo l'oggetto di modello giusto
  var o = this.GetObject(id);
  //
  // Se ho l'oggetto di modello chiedo a lui se vuole gestire il Mouse Over
  if (o && o.OnMouseOverObj && classe == 'over')
  {
    o.OnMouseOverObj(ev, obj);
  }
  //
  // Se ho l'oggetto di modello chiedo a lui se vuole gestire il Mouse Out
  if (o && o.OnMouseOutObj && classe == '')
  {
    o.OnMouseOutObj(ev, obj);
  }
  //
  // Se ho l'oggetto di modello chiedo a lui se vuole gestire il Mouse Down
  if (o && o.OnMouseDownObj && classe == 'down')
  {
    o.OnMouseDownObj(ev, obj);
  }
}


// ***********************************************************
// Restituisce true se l'oggetto ha una scrollbar e
// la coordinata x o y si trova all'interno della scrollbar
// ***********************************************************
DDManager.prototype.IsOnScrollBar = function(obj, x, y) 
{
  // Verifico se l'oggetto ha la scrollbar verticale
  if (obj.scrollHeight>obj.clientHeight && obj.scrollHeight>obj.offsetHeight)
  {
    // L'oggetto ha la scrollbar verticale, devo capire se ho cliccato all'interno della sua scrollbar
    var objRight = RD3_Glb.GetScreenLeft(obj) + obj.clientWidth;
    //
    if (x > objRight)
      return true;
  } 
  //
  // Verifico se l'oggetto ha la scrollbar orizzontale
  if (obj.scrollWidth>obj.clientWidth && obj.scrollWidth>obj.offsetWidth)
  {
    // L'oggetto ha la scrollbar orizzontale, devo capire se ho cliccato all'interno della sua scrollbar
    var objBottom = RD3_Glb.GetScreenTop(obj) + obj.clientHeight;
    //
    if (y > objBottom)
      return true;
  } 
  //
  return false;
}


// ***********************************************************
// Imposta il mouse come entrato sull'oggetto che e' stato
// toccato dall'utente
// ***********************************************************
DDManager.prototype.SetMouseOver= function(srcobj) 
{
  // Prima di settare, resetto quello prima se c'era ancora.
  this.ResetMouseOver();
  //
  // Invio un evento di "mouse enter" al srcobj per la gestione dei tooltip
  this.TouchSource = srcobj;
  var theEvent = document.createEvent("MouseEvents");
  theEvent.initEvent("mouseover", true, true);
  this.TouchSource.dispatchEvent(theEvent);
}


// ***********************************************************
// Imposta il mouse come uscita dall'oggetto che e' stato
// toccato dall'utente
// ***********************************************************
DDManager.prototype.ResetMouseOver= function() 
{
  // Invio un evento di "mouse out" al srcobj per la gestione dei tooltip
  if (this.TouchSource)
  {
    var theEvent = document.createEvent("MouseEvents");
    theEvent.initEvent("mouseout", true, true);
    this.TouchSource.dispatchEvent(theEvent);
    this.HandleTouchEvent(this.TouchSource,"move",theEvent);
    this.TouchSource=null;
  }
}


// ***********************************************************
// Invio un evento di MouseUp al frame su cui e' avvenuto il tocco prolungato,
// in questo modo posso gestire il tasto destro
// ***********************************************************
DDManager.prototype.OnTouchRight= function() 
{
  // L'utente ha mosso il dito, non devo operare
  if (this.TouchMove)
    return;
  //
  this.TouchEvent.button = 999;
  var pf = this.TouchEvent.target;
  while (pf)
  {
    if (pf.className=="frame-container")
    {
      this.GetObject(pf.id).OnMouseUp(this.TouchEvent);
      break;
    }
    pf = pf.parentNode;
  }
  //
  // Mando il click destro anche all'oggetto attivo
  this.TouchEvent.button = 2;
  this.TouchEvent.explicitOriginalTarget = this.TouchEvent.target;
  //
  if (RD3_KBManager.IDRO_OnRightClick(this.TouchEvent))
  {
    // Se gestito tasto destro, disabilita click sinistro quando verra' alzato il dito
    this.TouchMove = true;
  }
}


// ***********************************************************
// Invio un evento di MouseUp al frame su cui e' avvenuto il tocco prolungato,
// in questo modo posso gestire il tasto destro
// ***********************************************************
DDManager.prototype.HandleTouchEvent= function(obj, evtype, ev) 
{
  // Se mi sono mosso oppure ho rilasciato, spengo le evidenziazioni "semplici"
  if (evtype!="down")
    this.OnMouse(ev);
  //
  // Non ho mosso il ditino, ma il click normale di safari e' andato perso.
  // Occorre sistemare. Se sono in un pannello o book si arrangia da solo,
  // altrimenti devo fare io
  var intip = false;
  var infrm = false;
  var intab = false;
  var inmenu= false;
  var intask= false;
  var theFrame = null;
  var inSubFrm = false;
  var pf = obj;
  while (pf)
  {
    var pfid = pf.id ? pf.id : "";
    if (pf.className=="frame-container" && pfid.indexOf("scz")==-1)
    {
      infrm=true;
      theFrame = this.GetObject(pf.id);
    }
    if (pf.className=="frame-container" && pfid.indexOf("suf:") == 0)
      inSubFrm = true;
    if (typeof pf.className == "string" && pf.className)  // Potrebbe essere un SVGAnimatedString nel caso SVG
    {
      if (pf.className.substr(0,14)=="messagetooltip")
        intip=true;
      if (pf.className.substr(0,11)=="tab-caption")
        intab=true;
      if (pf.className.substr(0,12)=="menu-command")
        inmenu=true;
      if (pf.className.substr(0,16)=="menu-bar-command")
        inmenu=true;          
      if (pf.className.substr(0,15)=="popup-menu-item")
        inmenu=true;
      if (pf.className.substr(0,9)=="form-list")
        inmenu=true;
      if (pf.className.substr(0,8)=="taskbar-")
        intask=true;
      if (pf.className.substr(0,11)=="popup-error")
        intask=true;          
      if (RD3_Glb.HasClass(pf,"menu-back-button"))
        inmenu=true;
      if (RD3_Glb.HasClass(pf,"popover-back-button"))
        inmenu=true;
    }
    pf = pf.parentNode;
  }
  //
  // Il tocco sulla tabbed lo gestisco qui
  if (intab)
    infrm=false;
  //
  // Click su un bottone di toolbar contenuto in una subform; lo dobbiamo comunque gestire qui
  if (infrm && inSubFrm && obj && obj.tagName=="INPUT" && obj.className.indexOf("toolbar-button") != -1)
    infrm=false;
  //
  // Il click sulla button-bar lo gestisco qui
  if (obj && obj.className && obj.className.substr(0,10)=="button-bar")
    infrm=false;
  //
  // Il click sul grafico lo gestisco qui
  if (obj.tagName=="AREA")
    infrm=false;
  //
  // Il click sulla button-bar lo gestisco qui
  if (obj.className=="button-bar-button")
    infrm=false;
  //
  // Click su popup menu'
  if (obj.className=="menu-bar-command")
    inmenu=true;
  //
  // Click su indicatore/toolbar
  if (obj.className=="indicator-text" || obj.className=="toolbar-command-showcaption")
    inmenu=true;
  //
  // Click su form non attiva
  if (obj.className=="form-cover-inactive")
  {
    intask=true;
    infrm=false;
  }
  //
  if (inmenu && obj.tagName=="A")
    obj = obj.parentNode;
  //
  if (obj.id && obj.id.substr(0,13)=="taskbar-start")
    intask=true;
  //  
  if (!infrm && obj && (obj.tagName=="INPUT" || obj.tagName=="IMG" || obj.tagName=="AREA" || intip || intab || inmenu || intask))
  {
    // Evidenzio se ha l'ID
    if (!intask)
    {
      if (evtype=="up")
      {
        if (intab || inmenu)
        {
          RD3_Glb.TouchHL(obj,"panel-page-down", false);
          RD3_Glb.TouchHL(obj,"panel-page-active");
        }
        else if (obj.id!="")
        {
          RD3_Glb.TouchHL(obj,"panel-field-down", false);
          RD3_Glb.TouchHL(obj,"panel-field-active");
        }
      }
      if (evtype=="down")
      {
        if (intab || inmenu)
          RD3_Glb.TouchHL(obj,"panel-page-down", true, 0);
        else if (obj.id!="")
          RD3_Glb.TouchHL(obj,"panel-field-down", true, 0);
      }
      if (evtype=="move")
      {
        RD3_Glb.TouchHL(obj,"panel-page-down", false);
        RD3_Glb.TouchHL(obj,"panel-field-down", false);
      }
    }
    //
    // Se il tocco e' UP, sparo il click
    if (evtype=="up")
    {
      var theEvent = document.createEvent("MouseEvents");
      theEvent.initMouseEvent("click", true, true, window, 1, ev.clientX, ev.clientY, ev.clientX, ev.clientY);
      obj.dispatchEvent(theEvent);
    }
  }
  else if (theFrame)
  {
    if (evtype=="up")
      theFrame.OnMouseUp(ev);
    if (evtype=="down")
      theFrame.OnMouseDown(ev);
  }
}


// ***********************************************************
// Ritorna uno dei popup aperti
// ***********************************************************
DDManager.prototype.FindPopup= function(p) 
{
  for (var i=0;i<this.iOpenPopup.length;i++)
  {
    if (this.iOpenPopup[i]==p)
      return i;
  }
  return -1;
}

// ***********************************************************
// Si ricorda che e' stato aperto un popup
// ***********************************************************
DDManager.prototype.AddPopup= function(p) 
{
  var i = this.FindPopup(p);
  if (i==-1)
    this.iOpenPopup.push(p);
}

// ***********************************************************
// Si ricorda che e' stato chiuso un popup
// ***********************************************************
DDManager.prototype.RemovePopup=function(p) 
{
  var i = this.FindPopup(p);
  if (i>=0)
    this.iOpenPopup.splice(i,1);
}

// ***********************************************************
// Chiude uno o tutti i popup
// ***********************************************************
DDManager.prototype.ClosePopup=function(onlylast)
{
  while (this.iOpenPopup.length>0)
  {
    this.iOpenPopup.pop().Close();
    if (onlylast)
      break;
  }
}


// ***********************************************************
// Intercetta tutti i click sugli oggetti
// ***********************************************************
DDManager.prototype.OnAllClicks=function(ev)
{
  var x = new Date()-this.ChompTimeStamp;
  if (x<600)
  {
    RD3_Glb.StopEvent(ev);
    if (document.activeElement)
      document.activeElement.blur();
  }
}

// ***********************************************************
// Intercetta tutti i click sugli oggetti
// ***********************************************************
DDManager.prototype.ChompClick=function(ev)
{
  this.ChompTimeStamp = new Date();
}

// ***********************************************************
// Intercetta tutti i click sugli oggetti
// ***********************************************************
DDManager.prototype.OnGeneralDrag = function(ev)
{
  // Blocco il Drag dei file
  if (ev && ev.dataTransfer)
    ev.dataTransfer.dropEffect = "none";
  //
  RD3_Glb.StopEvent(ev);
  return false;
}

// ***********************************************************
// Mouse Down sul welcome
// ***********************************************************
DDManager.prototype.OnWelcomeDown = function(ev)
{
  if (RD3_DesktopManager.WebEntryPoint.UseZones())
  {
    for (var pos=2; pos<=5; pos++)
      RD3_DesktopManager.WebEntryPoint.GetScreenZone(pos).OnMouseDown(ev, true);
  }
}
// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Keyboard & Focus Controller
// ************************************************


// *****************************************************
// Classe KBManager
// Controller del fuoco e della tastiera
// *****************************************************
function KBManager()
{
  // Variabili del KBManager
  //
  this.ActiveObject = null;     // L'ultimo oggetto di modello attivato (puo' essere null)
  this.LastActiveObject = null; // L'ultimo oggetto di modello attivato (valido)
  this.ActiveElement = null;    // L'ultimo elemento attivato tramite getfocus/lostfocus
  //
  this.CheckFocus = false;      // Indica che occorre controllare che il fuoco sia ben impostato (vedi tick)
  this.DontCheckFocus=false;    // Indica che nella richiesta corrente il fuoco e' gia' stato gestito
  this.FocusFieldTimerId = 0;   // Timer utilizzato per il impostare il fuoco in modo ritardato
  //
  this.StopChange = false;       // Se arriva un evento di cambiamento lo devo gestire? in alcuni casi no (vedi Desktop riga 202)
  this.SuperActiveTimer = null;  // Timer per la gestione della SuperAttivita'
  this.SuperActiveSrc = null;  // Evento riguardante la gestione della SuperAttivita'
  this.LoosingFocus = false;   // Indica se sto gestendo il LostFocus
  //
  this.ActiveButton = null;     // L'ultimo pulsante/toolbar premuto
  //
  // Eseguo inizializzazione
  this.Init();
}

  
// ******************************************
// Inizializzazione del controller
// ******************************************
KBManager.prototype.Init = function()
{
  // Aggiungo al document i listener degli eventi
  // di MouseDown, MouseMove e MouseUp
  // utili per la gestione del DD
  var kd = new Function("ev","return RD3_KBManager.IDRO_KeyDown(ev)");
  var gf = new Function("ev","return RD3_KBManager.IDRO_GetFocus(ev)");
  var lf = new Function("ev","return RD3_KBManager.IDRO_LostFocus(ev)");
  var kp = new Function("ev","return RD3_KBManager.IDRO_KeyPress(ev)");
  var ku = new Function("ev","return RD3_KBManager.IDRO_KeyUp(ev)");
  var od = new Function("ev","return RD3_KBManager.IDRO_OnDrop(ev)");
  var op = new Function("ev","return RD3_KBManager.IDRO_OnPaste(ev)");
  var dc = new Function("ev","return RD3_KBManager.IDRO_DoubleClick(ev)");
  var oc = new Function("ev","return RD3_KBManager.IDRO_OnChange(ev)");
  var rc = new Function("ev","return RD3_KBManager.IDRO_OnRightClick(ev)");
  //
  if (document.addEventListener)
  {
    document.body.addEventListener("keydown", kd, true);
    //document.body.addEventListener("focus", gf, true); 
    //document.body.addEventListener("blur", lf, true); 
    document.body.addEventListener("keypress", kp, true);    
    document.body.addEventListener("keyup", ku, true);
    document.body.addEventListener("drop", od, true);    
    document.body.addEventListener("paste", op, true);  
    document.body.addEventListener("dblclick", dc, true);    
    //document.body.addEventListener("change", oc, true);    
    document.body.addEventListener("contextmenu", rc, false);    
  }
  else
  {
    document.body.attachEvent("onkeydown", kd);    
    document.body.attachEvent("onactivate", gf); 
    document.body.attachEvent("ondeactivate", lf); 
    document.body.attachEvent("onkeypress", kp);   
    document.body.attachEvent("onkeyup", ku);
    document.body.attachEvent("ondrop", od);    
    document.body.attachEvent("onpaste", op);    
    document.body.attachEvent("ondblclick", dc);    
    //document.body.attachEvent("onchange", oc);    
    document.body.attachEvent("oncontextmenu", rc);    
  }
}


// ***************************************************
// Rende un INPUT readonly in modo migliore del
// comportamento di default
// ***************************************************
KBManager.prototype.IDRO_KeyDown = function (ev)
{
  // Giro il messaggio al DDManager
  RD3_DDManager.OnKeyDown(ev);
  //
  var eve = (window.event)?window.event:ev;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var srcobj = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  var cell = this.GetCell(srcobj, true);
  var en = cell.IsEnabled;
  var msk = cell.Mask;
  var listGroup = this.IsListGroup(srcobj);
  //
  if (cell)
    cell.RemoveWatermark();
  //
  // Gestione selezione testuale
  var pobj = this.GetObject(srcobj);
  if (pobj && pobj.SendtextSelChange && pobj.UseTextSel)
  {
    // Se c'e' gia' un timer lo blocco (improbabile.. ma per sicurezza facciamolo)
    if (this.SelTextTimer)
    {
      window.clearTimeout(this.SelTextTimer);
      this.SelTextSrc = null;
      this.SelTextObj = null;
    }
    //
    // Attivo il timer per fare scattare la gestione della selezione testuale dopo 10 milli: in questo modo il campo ha sempre il testo aggiornato
    this.SelTextTimer = window.setTimeout(new Function("ev","if (RD3_KBManager.SelTextObj && RD3_KBManager.SelTextObj.SendtextSelChange){RD3_KBManager.SelTextObj.SendtextSelChange(RD3_KBManager.SelTextSrc);}"), 50);
    this.SelTextSrc = srcobj;
    this.SelTextObj = pobj;
  }
  //
  // Controllo ALT + tasto in caso di menu a tendina (anche tasto ESC)
  var co = (RD3_DesktopManager.WebEntryPoint && RD3_DesktopManager.WebEntryPoint.CmdObj.MenuBarOpen);
  if ((eve.altKey || co) && ((code>=48 && code<=90)||code==27))
  {
    if (RD3_DesktopManager.WebEntryPoint.CmdObj.HandleAccell(eve,code))
    {
      this.CheckKey(srcobj, eve);
      RD3_Glb.StopEvent(eve);
      return false;
    }
  }
  //
  // Controllo CTRL-ESC per menu' taskbar
  var mt = (RD3_DesktopManager.WebEntryPoint)?RD3_DesktopManager.WebEntryPoint.MenuType:0;
  if ((eve.ctrlKey && code==RD3_ClientParams.TaskMenuAccellCode) && mt==RD3_Glb.MENUTYPE_TASKBAR)
  {
    RD3_DesktopManager.WebEntryPoint.OnStartClick(eve);
  }  
  //
  // Controllo tasti di navigazione (frecce+tab)
  if (((code>=33 && code<=40) || code==9) && !RD3_DDManager.OpenCombo)
  {
    if (code === 9 && cell.ControlType === 3) 
    {
      // Non ho richieste, prima di uscire dalla combo provo a vedere se ci sono modifiche da mandare al server
      if (RD3_DesktopManager.MessagePump.Requests.length == 0) 
      {
        cell.OnComboChange(true, true, true); 
        var chgEv = RD3_DesktopManager.MessagePump.GetEvent(cell.PValue, "chg");
        if (!!chgEv) 
        {
          RD3_DesktopManager.SendEvents();				
          RD3_DesktopManager.MessagePump.Tick();
        }
      }
      //
      // Se ora ho una richiesta mi fermo e non esco dalla combo, devo essere qui quando la risposta arriva
      if (RD3_DesktopManager.MessagePump.Requests.length > 0) 
      {
        RD3_Glb.StopEvent(eve);
        return false;
      }
    }
    //
    var obj = this.GetObject(srcobj);
    if (obj && obj.HandleNavKeys && this.CanHandleKeys(obj))
    {
      // Sto per gestire un tasto, prima di farlo controllo che l'oggetto
      // non sia stato anche modificato. In questo caso prima gestisco la modifica,
      // poi la pressione del tasto
      if (RD3_Glb.IsEditFld(srcobj) && !listGroup)
      {
        // Se premo SHIFT e mi sto muovendo (LEFT/RIGHT/TOP/END) dentro al campo non mi interessa
        // controllare le modifiche... tanto non posso uscire dal campo... sto solo selezionando
        var checkChange = true;
        if (eve.shiftKey && (code==37 || code==39 || code==35 || code==36))
          checkChange = false;
        //
        if (checkChange)
          this.IDRO_OnChange(eve);
      }
      else if ((code==33 || code==34) && RD3_Glb.IsChrome() && srcobj && srcobj.tagName=='TEXTAREA')
      {
        // PageUP/PageDOWN su Textarea su Chrome fa scrollare tutta la pagina
        eve.preventDefault();
        //
        // Scrollo io
        srcobj.scrollTop = srcobj.scrollTop + (code==33 ? -1 : 1) * (srcobj.clientHeight - 6);
      }
      //
      if (obj.HandleNavKeys(eve))
      {
        this.CheckKey(srcobj, eve);
        RD3_Glb.StopEvent(eve);
        return false; // Se il tasto e' stato gestito non devo piu' gestire l'evento
      }
    }
  }
  //
  // Controllo tasti FK
  if (code>=112 && code<=123)
  {
    var obj = this.GetObject(srcobj);
    if (obj && obj.HandleFunctionKeys  && this.CanHandleKeys(obj))
    {
      // Su chrome rimane in canna l'evento di change, e questo fa si che se stiamo gestendo il layout automatico 
      // riscatta l'onchange subito dopo.. allora togliamo il fuoco e lo rimettiamo all'oggetto.. in questo modo il suo evento scatta e poi non ci rompe piu'..
      // Mantengo l'active-object, altrimenti HandleFunctionKeys non funziona piu' nel caso di F2
      if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
      {
	      var ao = this.ActiveObject;
        try
        {
          srcobj.blur();
        }
        catch(ex) {}
	      this.ActiveObject=ao;
	      //
	      // Siccome ho tolto il fuoco con il blur, poi lo devo ridare a qualcuno
	      this.CheckFocus = true;
      }
      //
      // Sto per gestire un tasto, prima di farlo controllo che l'oggetto
      // non sia stato anche modificato. In questo caso prima gestisco la modifica,
      // poi la pressione del tasto
      this.IDRO_OnChange(eve);
      //
      if (obj.HandleFunctionKeys(eve))
      {
        this.CheckKey(srcobj, eve);
        RD3_Glb.StopEvent(eve);
        return false; // Se il tasto e' stato gestito non devo piu' gestire l'evento
      }
    }
  }  
  //
  // Campo abilitato (e non gruppo in lista)...
  if (en && !listGroup)
  {
    // Gestisco masked input o non devo fare nulla?
    var ok = true;
    if (msk && RD3_Glb.IsEditFld(srcobj))
    {
      ok = hk(ev);
      this.CheckKey(srcobj, eve);
      if (!ok)
        RD3_Glb.StopEvent(eve); 
    }
    else
      this.CheckKey(srcobj, eve);
    //
    var obj = this.GetObject(srcobj);
    //
    // Se l'oggetto non e' nella form giusta blocco i tasti
    if (obj && !this.CanHandleKeys(obj))
      RD3_Glb.StopEvent(eve); 
    //
    // Ho premuto un tasto: il campo e' superattivo? (la gestione non la faccio per le date o le ore o le combo value sourc)
    if (obj && obj.SuperActive && !RD3_Glb.IsDateOrTimeObject(obj.DataType) && !obj.HasValueSource)
    {
      // Se c'e' gia' un timer lo blocco (improbabile.. ma per sicurezza facciamolo)
      if (this.SuperActiveTimer)
      {
        window.clearTimeout(this.SuperActiveTimer);
        this.SuperActiveSrc = null;
      }
      //
      // Attivo il timer per fare scattare l'OnChange dopo 10 milli: in questo modo il campo ha sempre il testo aggiornato e la SendChanges di PValue puo' funzionare
      this.SuperActiveTimer = window.setTimeout(new Function("ev","return RD3_KBManager.IDRO_OnChange(RD3_KBManager.SuperActiveSrc)"), 10);
      this.SuperActiveSrc = srcobj;
    }
    //
    return ok;
  }
  //
  // CTRL+C permesso (anche su MAC)
  if ((eve.ctrlKey || eve.metaKey) && code==67)
    return true;
  //
  this.CheckKey(srcobj, eve);
  //
  // Pressione tasto ENTER su campo monorow permessa
  if (srcobj.tagName=="INPUT" && code==13)
    return true;
  //
  // Tasti TAB e FRECCE permessi
  if (code==9 || (code>=35 && code<=40))
  {
    return true;
  }
  else
  {
    RD3_Glb.StopEvent(eve);
    return false;
  }
}


// ***************************************************
// Gestione Masked Input per campi abilitati
// ***************************************************
KBManager.prototype.IDRO_GetFocus = function (ev, explicitObj)
{
  var eve = (window.event)?window.event:ev;
  var srcobj = (window.event)?eve.srcElement:eve.currentTarget;
  if (explicitObj != undefined)
    srcobj = explicitObj;
  var cell = this.GetCell(srcobj, true);
  var en = cell.IsEnabled;
  var msk = cell.Mask;
  var mskt = cell.MaskType;
  //
  // Il fuoco sul Panel-Field-List-Box non mi interessa!
  if (srcobj && srcobj.className=="panel-field-list-box")
    return;
  //
  // Su IE10 Mobile quando esci da un PopupControl qualcuno da il fuoco all'input (non si riesce a capire l'origine)
  // in questo caso forziamo un BLUR qui dentro e non gestiamo il fuoco: non deve succedere
  if (RD3_Glb.IsIE(10, true) && RD3_Glb.IsMobile() && RD3_Glb.IsTouch() && cell && cell.ParentField && cell.IsEnabled && !(cell.IntCtrl instanceof IDCombo) && cell.ParentField.UsePopupControl())
  {
    srcobj.blur();
    return;
  }
  //
  // Su IE, a volte, viene fuocato il BODY! E lo stacktrace dice che e' proprio IE che lo fa
  // Se capita, provo a fuocare l'ultimo oggetto attivo... Nei casi in cui il pannello perdeva il fuoco risolve
  if (RD3_Glb.IsIE() && srcobj==document.body && srcobj!=this.ActiveElement)
  {
    // Se non devo fare altro con il fuoco, forzo una focus sull'activeElement
    if (!this.CheckFocus && !RD3_KBManager.FocusFieldTimerId)
      this.CheckFocus = true;
    //
    // Ho finito qui... Questo evento e' perso
    return;
  }
  //
  // Su IE<10 gli eventi di fuoco scattano in ordine inverso: prima scatta il getfocus e poi il lostfocus (questo perche' c'e' il frame di mezzo..)
  var retardEvent = false;
  if (RD3_Glb.IsIE(10,false) && this.ActiveElement && RD3_Glb.isInsideEditor(this.ActiveElement))
    retardEvent = true;
  //
  // Registro l'elemento attivo solo se e' un campo di input (o un DIV editabile)
  if ("INPUT-TEXTAREA-SELECT".indexOf(srcobj.tagName)>-1 || RD3_Glb.isInsideEditor(srcobj))
  {
    this.ActiveElement = srcobj;
  }
  else
  {
    // NON ho selezionato un campo di testo, vediamo se
    // nell'elemento fuocato c'e' dentro un input
    var inp = srcobj.hasChildNodes()? srcobj.childNodes[0] : null;
    if (inp && "INPUT-TEXTAREA-SELECT".indexOf(inp.tagName)>-1)
    {
      this.ActiveElement = inp;
      this.CheckFocus = true;
    }
  }
  //
  if (en && msk && srcobj.tagName=="INPUT")
  {
    // Se la cella ha il watermark mi ricordo di doverlo riapplicare
    var reapplywat = false;
    if (cell && cell.HasWatermark)
    {
      cell.RemoveWatermark();
      reapplywat = true;
    }
    //
    mc(msk, mskt, ev);
    //
    // Riapplico il watermark se la mascheratura non ha scritto nulla nella cella
    if (cell && cell.GetDOMObj(false) && cell.GetDOMObj(false).value=="" && reapplywat)
    {
      if (cell.ControlType==2)
      {
        var obj = cell.GetDOMObj(false);
        obj.value = cell.ParentField.WaterMark;
        cell.Text = cell.ParentField.WaterMark;
        RD3_Glb.AddClass(obj, "panel-field-value-watermark");
        cell.HasWatermark = true;
        //
        // Togliere il watermark ha rimesso la maxLenght a posto, quindi rimettendolo devo toglierla (solo su safari e chrome)
        if (cell.MaxLength>0 && cell.NumRows == 1 && (RD3_Glb.IsChrome() || RD3_Glb.IsSafari()))
          obj.removeAttribute("maxLength");
      }
      if (cell.ControlType==3)
      {
        cell.Text = cell.ParentField.WaterMark;
        cell.HasWatermark = true;
        cell.IntCtrl.SetWatermark();
        cell.IntCtrl.SetText(cell.ParentField.WaterMark, true, true);
      }
    }
  }
  //
  // In caso touch sposto ora il cursore in prima posizione
  if (en && srcobj.tagName=="INPUT" && cell && cell.HasWatermark && RD3_Glb.IsTouch())
  {
    srcobj.select();
    srcobj.selectionStart=0;
    srcobj.selectionEnd=0;
  }
  //
  this.ActiveObject = this.GetObject(srcobj);
  if (this.ActiveObject && this.ActiveObject.GotFocus)
  {
    // Siccome c'e' un oggetto legato all'elemento, lo registro
    // sicuramente come elemento attivo, mentre prima lo facevo
    // solo se era un campo di inout.
    // (pero' se c'e' un Input dentro registro quello)
    this.ActiveElement = srcobj;
    //
    if ("INPUT-TEXTAREA-SELECT".indexOf(srcobj.tagName)==-1  && !RD3_Glb.isInsideEditor(srcobj))
    {
      var inpobj = srcobj.hasChildNodes()? srcobj.childNodes[0] : null;
      if (inpobj && "INPUT-TEXTAREA-SELECT".indexOf(inpobj.tagName)>-1)
        this.ActiveElement = inpobj;
    }
    //
    if (this.FocusFieldTimerId)
      window.clearTimeout(this.FocusFieldTimerId);
    this.FocusFieldTimerId = 0;
    //
    // Se devo ritardare..
    if (retardEvent)
      window.setTimeout("RD3_DesktopManager.MessagePump.SendEvents(); var bj = RD3_DesktopManager.ObjectMap['"+this.ActiveObject.Identifier+"']; if (bj){ bj.GotFocus(RD3_KBManager.ActiveElement, null); }", 300);
    else
      this.ActiveObject.GotFocus(srcobj,eve);
  }
  //
  var setLastObject = true;
  if (RD3_Glb.IsIE() && this.ActiveObject instanceof IDPanel && srcobj.className=="panel-scroll-container")
    setLastObject = false;
  //
  // Registro oggetto valido se c'e'
  if (this.ActiveObject && this.ActiveObject!=RD3_DesktopManager.WebEntryPoint && setLastObject)
    this.LastActiveObject = this.ActiveObject;
}

// ***************************************************
// Gestione Masked Input per campi abilitati
// ***************************************************
KBManager.prototype.IDRO_LostFocus = function (ev, explicitObj)
{
  // Su iOS7 non si rimette a posto lo scroll quando la tastiera e' chiusa
  if ((RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7)) && RD3_Glb.IsMobile())
    document.body.scrollTop = 0;
  //
  // Comunico che sto perdendo il fuoco
  this.LoosingFocus = true;
  //
  var eve = (window.event)?window.event:ev;
  var srcobj = (window.event)?eve.srcElement:eve.currentTarget;
  if (explicitObj != undefined)
    srcobj = explicitObj;
  //
  var cell = this.GetCell(srcobj, true);
  var en = cell.IsEnabled;
  var msk = cell.Mask;
  //
  if (en && (msk || (cell.ParentField && cell.ParentField.WaterMark != "")) && srcobj.tagName=="INPUT")
  {
    // Se la cella ha il watermark mi ricordo di doverlo riapplicare
    var reapplywat = false;
    if (msk && cell && cell.HasWatermark)
    {
      cell.RemoveWatermark();
      reapplywat = true;
    }
    //
    if (msk)
      umc(ev);
    //
    // Riapplico il watermark se c'era o se ci deve essere
    // Nel desktop il Watermark su un campo vuoto viene messo dalla SetInactive che pero' nel Mobile non scatta.. in questo caso lo facciamo qui nella LostFocus se:
    // - il valore della cella e' ""
    // - il campo di pannello ha il watermark
    // (lo faccio anche sul desktop perche' la setInactive scatta se passo da una cella ad un altra, se clicco sul pannello invece non fa niente..)
    if (cell && cell.GetDOMObj(false) && cell.GetDOMObj(false).value == "" && (reapplywat || (!cell.HasWatermark && cell.ParentField && cell.ParentField.WaterMark != "")))
    {
      if (cell.ControlType == 2 && cell.ParentField)
      {
        var applyFunct = function () 
        {
          var obj = cell.GetDOMObj(false);
          if (obj.value == "") 
          {
            obj.value = cell.ParentField.WaterMark;
            cell.Text = cell.ParentField.WaterMark;
            RD3_Glb.AddClass(obj, "panel-field-value-watermark");
            cell.HasWatermark = true;
            //
            // Togliere il watermark ha rimesso la maxLenght a posto, quindi rimettendolo devo toglierla (solo su safari e chrome)
            if (cell.MaxLength > 0 && cell.NumRows == 1 && (RD3_Glb.IsChrome() || RD3_Glb.IsSafari()))
              obj.removeAttribute("maxLength");
          }
        }
        //
        // Per i campi data non devo rimettere subito il watermark: potrebbe aver perso il fuoco perche' l'utente ha cliccato il pulsante del calendario,
        // se mettiamo il watermark subito maskedinput non riesce a scrivere la data.
        // Quindi usiamo un timer, se entro Xms il campo e' ancora vuoto ci mettiamo il watermark
        if (!RD3_Glb.IsDateOrTimeObject(cell.ParentField.DataType))
          applyFunct();
        else
          window.setTimeout(applyFunct, 150);
      }
      //
      // Se e' aperta non faccio nulla, altrimenti la chiuderei... poi ci pensa la combo a rimettere a posto il watermark quando si chiude
      if (cell.ControlType == 3 && !cell.IntCtrl.IsOpen && cell.ParentField)
      {
        cell.Text = cell.ParentField.WaterMark;
        cell.HasWatermark = true;
        cell.IntCtrl.SetWatermark();
        cell.IntCtrl.SetText(cell.ParentField.WaterMark, true, true);
      }
    }
  }
  //
  var obj = this.GetObject(srcobj);
  if (obj && obj.LostFocus)
    obj.LostFocus(srcobj,eve);
  if (obj == this.ActiveObject)
    this.ActiveObject=null;
  //
  // Se c'e' una combo aperta e sono in un dispositivo touch
  // allora probabilmente ricevo solo il BLUR (chiusura della tastiera)
  // e quindi qui devo spingere l'acquisizione del valore della combo
  if (RD3_Glb.IsTouch() && RD3_DDManager.OpenCombo)
    RD3_DDManager.OpenCombo.OnMouseDown(eve);
  //
  // Ho terminato la gestione del LostFocus
  this.LoosingFocus = false;
}


// ***************************************************
// Controlla lunghezza TextArea
// ***************************************************
KBManager.prototype.IDRO_KeyPress = function (ev)
{
  var eve = (window.event)?window.event:ev;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var srcobj = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  var cell = this.GetCell(srcobj, true);
  var ml = cell.MaxLength;
  //
  // La pressione del tasto INVIO causa la chiusura della combo, se era aperta
  if (code==13 && RD3_DDManager.OpenCombo)
    RD3_DDManager.OpenCombo.Close();
  //
  if (srcobj.tagName == "TEXTAREA" && ml>0 && srcobj.value.length>=ml && code!=0)
  {
    // Limito il testo inserito...
    if (srcobj.value.length>ml)
      srcobj.value = srcobj.value.substr(0,ml);
    //
    this.CheckKey(srcobj, ev);
    return false;
  }
  //
  // Pressione tasto ENTER su campo di pannello
  if (srcobj.tagName!="TEXTAREA" && !RD3_Glb.isInsideEditor(srcobj))
  {
    var obj = this.GetObject(srcobj, true);
    //
    if (obj && obj.OnKeyPress)
      RD3_DesktopManager.CallEventHandler(obj.Identifier, "OnKeyPress", eve);
  }
  //
  if (code>=32 && cell)
  {
  	// Siccome ho premuto un tasto, se il campo era una password svuotata da ora in poi devo gestire l'invio del valore
  	cell.PwdSvuotata = undefined;
  }
  //
  this.CheckKey(srcobj, ev);
  //
  return true;
}

KBManager.prototype.IDRO_KeyUp = function (ev)
{
  var eve = (window.event)?window.event:ev;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var srcobj = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  var cell = this.GetCell(srcobj, true);
  var ml = cell.MaxLength;
  //
  // Facciamo un po' di controlli preventivi: cella presente, abilitata e di tipo giusto..
  if (!cell || !cell.IsEnabled || cell.ControlType==4 || cell.ControlType==5 || cell.ControlType==6 || cell.ControlType==10 || cell.ControlType==101 || cell.HasWatermark)
    return true;
  //
  // Lasciamo passare i tasti funzione (non ci interessano.. pero' su KITKAT c'e' un baco per cui i keycode arrivano sempre 0.. quindi 0 lo lascio passare)
  if ((code>0 && code <= 46) || srcobj.tagName!="INPUT" || (code >= 112 && code <= 123)) 
  {
    // CTRL+V su una text area: verifico la max length (solo per IE<10, per gli altri mi basta il maxlength sull'oggetto DOM)
    // Non lo devo fare in QBE
    if (RD3_Glb.IsIE(10, false) && srcobj.tagName =="TEXTAREA" && code == 86 && eve.ctrlKey && (cell && cell.PValue && !cell.PValue.InQBE())) 
    {
      if (srcobj.value.length > ml)
        srcobj.value = srcobj.value.substring(0, ml);
    }
    //
    return true;
  }
  //
  if (cell && cell.ParentField && cell.ParentField.AutoTab())
  {
    if (cell.Mask != "")
    {
      // Devo capire se la maschera e' piena, ma non posso togliere la maschera/rimetterla perche' non funziona bene..
      // Allora la considero piena se il testo non contiene caratteri di maschera ed e' pieno (controllliamo anche _ .. in un testo mascherato nbon ci puo' stare perche' lo usiamo per identificare i valori obbligatori)
      var hasMaskToken = false;
      var valn = srcobj.value.length;
      var valTxt = srcobj.value;
      for (var idx=0; idx<valn; idx++)
      {
        if ((cell.MaskType == "D" && isMaskToken(valTxt.charAt(idx), cell.MaskType)) || valTxt.charAt(idx) == '_')
        {
          hasMaskToken = true;
          break;
        }
      }
      //
      if (!hasMaskToken && valn>=cell.Mask.length)
      {
        // Devo smascherare per fare acquisire il valore
        umc(ev);
        cell.ParentField.ParentPanel.FocusNextField(cell.ParentField, ev);
      }
    }
    else if (srcobj.value.length>=ml && ml>0)
    {
      cell.ParentField.ParentPanel.FocusNextField(cell.ParentField, ev);
    }
  }
  //
  return true;
}


// ***************************************************
// Rende un INPUT readonly in modo migliore del
// comportamento di default
// ***************************************************
KBManager.prototype.IDRO_OnDrop= function (ev)
{
  var eve = (window.event)?window.event:ev;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var srcobj = (window.event)?eve.srcElement:eve.currentTarget;
  var cell = this.GetCell(srcobj);
  var en = cell.IsEnabled;
  var ml = cell.MaxLength;
  //
  if (srcobj.tagName == "TEXTAREA" && en && ml>0 && window.clipboardData)
  {
    // Limito il testo inserito...
    var pt = window.clipboardData.getData("Text");
    if (pt.length + srcobj.value.length > ml)
      window.clipboardData.setData("Text", pt.substr(0, ml-srcobj.value.length));
  }
  //
  // Campo abilitato, non devo fare nulla
  if (en)
    return true;
  else
    return false;
}


// ***************************************************
// Rende un INPUT readonly in modo migliore del
// comportamento di default
// ***************************************************
KBManager.prototype.IDRO_OnPaste= function (ev)
{
  var eve = (window.event)?window.event:ev;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var srcobj = (window.event)?eve.srcElement:eve.currentTarget;
  var cell = this.GetCell(srcobj, true);
  var en = cell.IsEnabled;
  var ml = cell.MaxLength;
  //
  if (srcobj.tagName == "TEXTAREA" && en && ml>0 && window.clipboardData)
  {
    // Limito il testo inserito...
    var pt = window.clipboardData.getData("Text");
    if (pt.length + srcobj.value.length > ml)
      window.clipboardData.setData("Text", pt.substr(0, ml-srcobj.value.length));
  }
  //
  // Campo abilitato, non devo fare nulla
  if (en)
    return true;
  else
    return false;
}


// ***************************************************
// Ritorna l'oggetto di modello corrispondente
// all'elemento del DOM passato
// ***************************************************
KBManager.prototype.GetObject= function (ele, wantvalue)
{
  while (ele && (ele.className == "panel-value-activator" || ele.className == "combo-img" || ele.className == "combo-activator"))
    ele = ele.previousSibling;
  //
  if (RD3_Glb.isInsideEditor(ele) && ele.tagName!="IFRAME")
  {
    var idEd = ele.ownerDocument.IDOwnerObject;
    if (idEd && idEd.indexOf("ide:")==0)
      return RD3_DesktopManager.ObjectMap[idEd];
  }
  //
  while (ele && ele!=document.body)
  {
    if (ele.id && ele.id!="")
    {
      var obj = RD3_DDManager.GetObject(ele.id, wantvalue);
      if (obj)
        return obj;
    }
    ele = ele.parentNode;
  }
  return null;
}


// ***************************************************
// Ritorna un oggetto che elenca le proprieta' della cella
// collegata all'elemento del DOM passato
// ***************************************************
KBManager.prototype.GetCell= function(ele, getSpan)
{
  if (getSpan==undefined)
    getSpan = false;
  //
  var obj = this.GetObject(ele);
  var cell = (obj && obj.GetCurrentCell ? obj.GetCurrentCell(0, ele) : null);
  //
  // Se l'oggetto e' uno span e devo fornirlo allora creo una PCell fittizia in cui copio le impostazioni dello span
  if (cell == null && getSpan && obj instanceof BookSpan)
    cell = this.GetSpanCell(obj);
  //
  return (cell ? cell : new PCell());
}

KBManager.prototype.GetSpanCell= function(obj)
{
  var cell = null;
  //
  // Se l'oggetto non ha una cella ma e' uno span di tipo edit abilitato creo una cella fittizia su cui lavorare
  // in questo modo funziona il mascheramento
  if (obj instanceof BookSpan && obj.Enabled && obj.ControlType==RD3_Glb.VISCTRL_EDIT)
  {
    cell = new PCell();
    //
    cell.ControlType = obj.ControlType;
    cell.Text = obj.Text;
    cell.MaxLength = obj.MaxLen;
    cell.IntCtrl = obj.SpanObj;
    //
    var vs = obj.GetVS();
    if (obj.Mask)
    {
      // Gestione Maschera Dinamica degli Span
      vs.OldMask = vs.Mask;
      vs.Mask = obj.Mask;
    }
    cell.Mask = vs.ComputeMask(obj.DataType, obj.MaxLen, obj.Scale);
    cell.MaskType = vs.ComputeMaskType(obj.DataType);
    if (obj.Mask)
      vs.Mask = vs.OldMask;
  }
  //
  return cell;
}


// ******************************************
// Gestore globale del double click
// ******************************************
KBManager.prototype.IDRO_DoubleClick= function(ev) 
{
  var eve = (window.event)?window.event:ev;
  var srcobj = (window.event)?eve.srcElement: eve.explicitOriginalTarget;
  //
  // Il doppio click e' stato fatto sul Resize Object.. succede se si fa doppio click sulla caption di una colonna
  // nell'area del resize.. in questo caso vado a prendere il MD_Target dal DDManager, che e' l'oggetto sotteso su cui avevamo cliccato
  if (srcobj.getAttribute && srcobj.getAttribute("id")=="resize-object")
  {
    var altobj = RD3_DDManager.MD_Target;
    //
    // Gestisco il doppio click su un oggetto resizabile SOLO se e' la caption di un pannello in lista.. non si sa mai...
    srcobj = altobj && altobj.className=="panel-field-caption-list" ? altobj : srcobj;
  }
  //
  var obj = this.GetObject(srcobj, true);
  //
  if (obj && obj.OnDoubleClick)
    return RD3_DesktopManager.CallEventHandler(obj.Identifier, "OnDoubleClick", eve);
  else
    return true;
}


// ******************************************
// Gestore globale del double click
// ******************************************
KBManager.prototype.IDRO_OnChange= function(ev, forceObj) 
{
  // Verifico se devo fare scattare o meno gli eventi di cambio layout
  if (this.StopChange)
    return false;
  //
  var eve = (window.event)?window.event:ev;
  var srcobj = (window.event)?eve.srcElement:eve.originalTarget;
  //
  // Il calendario forza l'aggiornamento del campo passandolo come parametro
  // se ci hanno passato un oggetto potrebbero volere che lo usiamo, anche se l'evento ne punta un altro..
  if (srcobj==undefined  || forceObj)
    srcobj = ev;
  //
  var obj = this.GetObject(srcobj, true);
  //
  var ok = true;
  if (obj && obj.OnChange)
    ok = RD3_DesktopManager.CallEventHandler(obj.Identifier, "OnChange", (forceObj ? srcobj : eve));
  //
  if (RD3_Glb.IsSafari() || RD3_Glb.IsChrome())
  {
    if (srcobj.tagName=="INPUT" && (srcobj.type=="radio" || srcobj.type=="checkbox"))
    {
      // Invio anche l'evento di focus che in questo caso non viene inviato da webkit
      this.IDRO_GetFocus(ev);
    }
  }
  //
  return ok;
}


// ******************************************
// Aggiunge al tooltip il numero di FK
// ******************************************
KBManager.prototype.GetFKTip= function(nfk)
{
  if (nfk==0)
    return "";
  //
  var s=" (";
  if (nfk>24)
  {
    s+="Ctrl+"; nfk-=24;
  }
  if (nfk>12)
  {
    s+="Shift+"; nfk-=12;
  }
  s+="F"+nfk+")";
  //
  return s;
}


// ******************************************
// Ritorna l'oggetto attivo
// ******************************************
KBManager.prototype.GetActiveElement= function()
{
  if (document.activeElement==undefined)
    return this.ActiveElement;
  else
    return document.activeElement;
}


// ********************************************************************************
// Al termine di una richiesta, vediamo se il fuoco e' attivato
// ********************************************************************************
KBManager.prototype.AfterProcessResponse= function()
{ 
  if (!this.DontCheckFocus)
    this.CheckFocus = true;
  this.DontCheckFocus = false;
}


// ********************************************************************************
// Messaggio di gestione periodica
// ********************************************************************************
KBManager.prototype.Tick= function()
{ 
  if (RD3_Glb.IsTouch() || RD3_Glb.IsMobile())
    this.CheckFocus = false;
  //  
  // Vediamo se devo controllare il fuoco...
  if (this.CheckFocus)
  {
    // Se c'e' un timer di fuoco attivo allora non faccio nulla: quando scattera' ci pensera' lui
    // ad impostare il fuoco corretto
    if (RD3_KBManager.FocusFieldTimerId)
      return;
    //
    this.CheckFocus = false;
    var ok = false;
    //
    // Se sono dentro ad un CkEditor non faccio altro... se chiamo la focus si offende...
    if (this.ActiveObject && typeof CKEDITOR != "undefined" && CKEDITOR.instances && CKEDITOR.instances[this.ActiveObject.Identifier + (this.ActiveObject.InList ? ":lcke" : ":fcke" )])
      return;
    //
    if (!RD3_Glb.IsIE())
    {
      // Non posso sapere chi ha il fuoco con questi browser, quindi
      // Riattivo l'elemento attuale
      if (this.ActiveElement)
      {
        try
        {
          this.ActiveElement.focus();
          //
          // Riapplico la maschera se presente
          this.CheckMask(this.ActiveElement);
          //
          ok = true;
        }
        catch(ex)
        {
        }
      }
    }
    else
    {
      // Se il fuoco e' in un campo di input, allora lo lascio, altrimenti lo muovo
      var o = document.activeElement;
      if (!o || ("INPUT-TEXTAREA-SELECT-IFRAME".indexOf(o.tagName)==-1 && !RD3_Glb.isInsideEditor(o)))
      {  
        if (this.ActiveElement)
        {
          try
          {
            this.ActiveElement.focus();
            //
            // Riapplico la maschera se presente
            this.CheckMask(this.ActiveElement);
            //
            ok = true;
          }
          catch(ex)
          {
          }
        }
      }
      else
      {
        // Nulla da fare l'oggetto attivo va gia' bene!
        ok = true;
        //
        // Riapplico la maschera se presente
        if (this.ActiveElement)
          this.CheckMask(this.ActiveElement);
      }
    }      
    //
    if (!ok)
      this.FocusSomeone();
  }
}

  
// ********************************************************************************
// Da il fuoco a qualcuno che lo vuole
// ********************************************************************************
KBManager.prototype.FocusSomeone= function()
{ 
  var ok = false;
  //
  // Se c'e' un frame attivo, la videata e' quella del frame
  var sf = null;
  if (this.ActiveObject && this.ActiveObject.WebForm)
    sf = this.ActiveObject;
  if (this.ActiveObject && this.ActiveObject.GetParentFrame)
    sf = this.ActiveObject.GetParentFrame();
  //
  // Tento di dare il fuoco all'elemento successivo
  if (sf)
  {
    try
    {
      ok = sf.WebForm.Focus(sf);
    }
    catch(ex)
    {
      ok = false;
    }
  }
  //
  // Fuoco il WEP se e' realizzato e visibile
  if (!ok && RD3_DesktopManager.WebEntryPoint && RD3_DesktopManager.WebEntryPoint.Realized &&
      RD3_DesktopManager.WebEntryPoint.WepBox.style.visibility=="")
  {
    RD3_DesktopManager.WebEntryPoint.Focus();
  }
}


// ******************************************
// Gestore globale del right click
// ******************************************
KBManager.prototype.IDRO_OnRightClick= function(ev) 
{
  var ris = false;
  var eve = (window.event)?window.event:ev;
  var srcobj = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  //
  // Chiudo eventuali menu' popup rimasti aperti
  RD3_DesktopManager.WebEntryPoint.CmdObj.ClosePopup();
  //
  this.ActiveObject = this.GetObject(srcobj);
  if (this.ActiveObject && this.ActiveObject.OnRightClick)
    ris = this.ActiveObject.OnRightClick(eve);
  //
  // Registro oggetto valido se c'e'
  if (this.ActiveObject && this.ActiveObject!=RD3_DesktopManager.WebEntryPoint)
    this.LastActiveObject = this.ActiveObject;
  //
  // Non passo mai il right click al browser
  RD3_Glb.StopEvent(eve);
  return ris;
}


// ******************************************
// Surroga l'evento di change che non viene lanciato
// quando clicco su un immagine: vedi anche DDManager.OnMouseDown
// ******************************************
KBManager.prototype.SurrogateChangeEvent= function()
{
  if (this.ActiveElement)
  {
    var obj = this.GetObject(this.ActiveElement, true);
    //
    // Il Blur forza la perdita del fuoco: quindi lancia l'onchange se deve.. per sicureppa poi lo gestiamo
    // anche noi da software..
    if (this.ActiveElement)
    {
      try
      {
        this.ActiveElement.blur();
      }
      catch(ex) {}
    }
    //
    if (obj && obj.OnChange)
    {
      // Questo e' un surrogate-change e serve per "spingere"
      // l'eventuale onchange del campo che aveva il fuoco.
      // Comunico che sto perdendo il fuoco perche' se il campo ha una maschera il sistema:
      // - guarda dov'e' il cursore
      // - smaschera il campo 
      // - legge il valore smascherato
      // - tenta di riposizionare il cursore dov'era
      RD3_KBManager.LoosingFocus = true;
      RD3_DesktopManager.CallEventHandler(obj.Identifier, "OnChange", this.ActiveElement);
      RD3_KBManager.LoosingFocus = false;
    }
  }
}


// ******************************************
// Verifica se l'elemento ha una maschera associata e
// se necessario chiama l'mc
// ******************************************
KBManager.prototype.CheckMask= function(obj)
{
  // Attenzione alla maschera... potrei dover chiamare il metodo mc() del maskedinp
  var cell = this.GetCell(obj, true);
  var en = cell.IsEnabled;
  var msk = cell.Mask;
  var mskt = cell.MaskType;
  //
  if (en && msk && obj.tagName=="INPUT") {
    mc(msk, mskt, null, obj);
    //
    // Il valore iniziale e' sempre quello della cella, mi serve solo per sapere se scatenare l'onchange quando l'input perde il fuoco
    glbInitValue = cell.Text;
  }
}


// *************************************************
// Verifica se l'oggetto di modello passato come
// parametro puo' gestire la pressione dei pulsanti
// *************************************************
KBManager.prototype.CanHandleKeys= function(obj)
{
  // Se c'e' una richiesta blocking... non posso editare
  if (RD3_DesktopManager.MessagePump.IsBlocking())
   return false;
  //
  // Cerco l'eventuale form in cui e' contenuto obj
  var parform = null;
  if (obj instanceof PField)
    parform = obj.ParentPanel.WebForm;
  if (obj instanceof WebFrame)
    parform = obj.WebForm;
  if (obj instanceof WebForm)
    parform = obj;
  if (obj instanceof Command && obj.FormIndex>0)
    parform = RD3_DesktopManager.ObjectMap["frm:"+obj.FormIndex];
  //
  // Se ho trovato la form
  if (parform)
  {
    // Se sono una sub-form, allora gestisco la pressione del tasto
    if (parform.SubFormObj)
      return true;
    //
    var act = RD3_DesktopManager.WebEntryPoint.ActiveForm;
    if (act && act.Identifier==parform.Identifier)
      return true;
    //
    var nf = RD3_DesktopManager.WebEntryPoint.StackForm.length;
    for (var t=0;t<nf;t++)
    {
      var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
      if (f.Docked && f.Identifier==parform.Identifier)
        return true;
    }
    //
    return false;
  }
  //
  // Non ho trovato la form... lascio passare
  return true;
}


// *************************************************
// Ritorna true se l'elemento fa parte di un gruppo in lista
// *************************************************
KBManager.prototype.IsListGroup= function(ele)
{
  var eid = ele.id;
  //
  if (eid && eid.indexOf(":lsg:")!=-1)
    return true;
  else
    return false;
}


// **********************************************************
// Un istanza di CKEditor ha preso il fuoco
// **********************************************************
KBManager.prototype.IDRO_GotFocusCK = function (ev)
{
  // Accedo all'editor
  var edit = ev.editor;
  //
  this.ActiveElement = ev.sender;
  //
  this.ActiveObject = RD3_DDManager.GetObject(edit.name, false);
  if (this.ActiveObject && this.ActiveObject.GotFocusCK)
  {
    if (this.FocusFieldTimerId)
      window.clearTimeout(this.FocusFieldTimerId);
    this.FocusFieldTimerId = 0;
    //
    this.ActiveObject.GotFocusCK(edit);
  }
  //
  // Registro oggetto valido se c'e'
  if (this.ActiveObject && this.ActiveObject!=RD3_DesktopManager.WebEntryPoint)
    this.LastActiveObject = this.ActiveObject;
}


// **********************************************************
// Metodo che verifica se il tasto premuto interessa
// al frame, alla form o all'applicazione e se e' necessario lo invia
// **********************************************************
KBManager.prototype.CheckKey = function(srcobj, eve)
{
  var keyClass = -1;
  var eventType = eve.type;
  //
  // Determino il tasto premuto tenendo conto delle follie dei browser:
  // IE ha keyCode!=0 e charCode==undefined in entrambe gli eventi
  // WebKit ha il keyCode!=0 e charCode==0 nel keyDown e keyCode!=0 e charCode!=0 nel keyPress
  // FireFox ha il keyCode!=0 e charCode==0 nel keyDown e keyCode==0 e charCode!=0 nel keyPress
  var key = 0;
  if (eventType == "keydown")
    key = eve.keyCode;
  else if (eventType == "keypress")
    key = (RD3_Glb.IsIE() ? eve.keyCode : eve.charCode);
  //
  if (key==0)
    return;
  //
  // Determino la classe di evento a cui appartiene il pulsante premuto
  // Invio, Esc
  if (key==13 || key==27)
  {
    // I tasti Invio e Esc mi arrivano sia dal KeyDown che dal KeyPress;
    // a me interessa solo quando arriva dal KeyDown
    if (eventType == "keydown")
      keyClass = RD3_Glb.KEYS_ENTERESC;
  }
  // F1->F12
  else if (eventType == "keydown" && key >= 112 && key <= 123)
    keyClass = RD3_Glb.KEYS_ENTERESC;
  // BackSpace, Tab
  else if (key==8 || key==9)
    keyClass = RD3_Glb.KEYS_MOVEMENT;
  // PageUp, PageDown, End, Home, Left, Top, Right, Bottom, Canc
  else if (eventType == "keydown" && ((key>=33 && key<=40) || key == 46))
    keyClass = RD3_Glb.KEYS_MOVEMENT;
  else if (eventType == "keypress")
    keyClass = RD3_Glb.KEYS_ALPHANUMERICAL;
  //
  if (keyClass==-1)
    return;
  //
  // Ora che ho deciso la classe vediamo se c'e' qualcuno di interessato
  var sendev = false;
  var obj = null;
  var ele = srcobj;
  //
  while (ele && ele!=document.body)
  {
    if (ele.className && ele.id && ele.id != "" && RD3_Glb.HasClass(ele, "frame-container"))
    {
      obj = RD3_DesktopManager.ObjectMap[ele.id]
      break;
    }
    //
    ele = ele.parentNode;
  }
  //
  if (obj && obj.HandledKeys!=undefined)
  { 
    // Ho trovato il frame, verifichiamo se gli interessa
    if ((obj.HandledKeys&keyClass)!=0)
      sendev = true;
    //
    // Se al frame interessa ho finito, altrimenti provo con la Form
    if (!sendev && obj.WebForm && (obj.WebForm.HandledKeys&keyClass)!=0)
      sendev = true;
  }
  else if (obj==null)
  {
    // Provo a  vedere se il metodo standard mi restituisce una Form
    obj = this.GetObject(srcobj, false);
    //
    if (obj && (obj instanceof WebForm) && (obj.HandledKeys&keyClass)!=0)
      sendev = true;
    else
      obj = null;
  }
  //
  // Se fino ad ora non interessa a nessuno proviamo con l'applicazione..
  if (!sendev && RD3_DesktopManager.WebEntryPoint && (RD3_DesktopManager.WebEntryPoint.HandledKeys&keyClass)!=0)
    sendev = true;
  //
  // Se ho trovato qualcuno di interessato allora invio l'evento
  if (sendev)
  {
    // lo invio in modo ritardato ma senza che gli eventi si sovrascrivano
    var ev = new IDEvent("keypress", obj ? obj.Identifier : "",eve, RD3_ClientParams.KeyPressEventType, key, keyClass, null, null, null, null, false, null, null, true);
  }
}


// **********************************************************
// Un istanza di CKEditor ha preso il fuoco
// **********************************************************
KBManager.prototype.CKinstanceReady = function (cked)
{
  var doc = cked.editor.document;
  var instname = cked.editor.name;
  var fldId = instname.length>5 ? instname.substring(0, instname.length-5) : "";
  var fld = RD3_DesktopManager.ObjectMap[fldId];
  if (!fld)
    return;
  //
  if (fld.UseTextSel)
  {
    var mu = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+fldId+"', 'KeyPressCKEditor', ev, '"+instname+"')");
    var k = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+fldId+"', 'KeyPressCKEditor', ev, '"+instname+"')");
    //
    if (doc.$.body.addEventListener)
      doc.$.body.addEventListener("mouseup", mu, true);
    else
      doc.$.body.attachEvent("onmouseup", mu);            
    //
    cked.editor.on('key', k);
  }
  //
  try
  {
    document.getElementById(cked.editor.id+"_contents").style.height = cked.editor.config.height;
  }
  catch (ex) {}
}

//************************************************************************************
// Webkit ha un baco sulle textarea contenute in div con il transform;
// allora intercettiamo l'invio e se il cursore e' in fondo forziamo noi lo scroll
//************************************************************************************
KBManager.prototype.TextAreaMobileKeyUp = function (ev)
{
  var eve = (window.event)?window.event:ev;
  var objInput = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  //
  if (code != 13 || objInput.tagName != "TEXTAREA")
    return;
  //
  var selEnd = -1;
  if( typeof(objInput.selectionStart) != "undefined" )
  {
		  selEnd = objInput.selectionEnd;
	}
	else 
	{
	  try
		{
			// Leggo la selezione corrente
	    var range = document.selection.createRange();
		  var rangeCopy = range.duplicate();
		  //
			// Seleziono tutto il testo della textArea
			rangeCopy.moveToElementText(objInput);
			//
			// Spostiamo il 'dummy' end point alla end point del range originale
			rangeCopy.setEndPoint( 'EndToEnd', range );
			//
		  // Calcoliamo il punto di partenza
		  var start = rangeCopy.text.length - range.text.length;
		  //
		  selEnd =  (start + range.text.length);
		}
		catch (ex) { }
	}
	//
	if (selEnd == objInput.value.length)
	  objInput.scrollTop = objInput.scrollHeight - objInput.offsetHeight;
}
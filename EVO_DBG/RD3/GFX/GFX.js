// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe base per la definizione di eventi locali
// ************************************************

function GFX(classe, flin, obj, skip, objout, customType)
{
  this.Classe = classe; // Classe di oggetti da animare: menu, sidebar, body, docked...
  this.Flin = flin;     // true->in, false->out
  this.Obj = obj;       // L'oggetto su cui si deve agire (puo' anche essere un WebForm nel caso di animazione di Form)
  this.ObjOut = objout; // Nel caso l'animazione richieda due oggetti questo e' l'oggetto su cui eseguire l'animazione di uscita..
  this.Skipped = skip;  // Mi memorizzo perche' la durata e' ZERO (skippata da codice o per configurazione)
  //
  this.Tipo = RD3_ClientParams.GFXDef[this.Classe]; // Tipo e Durata in ms dell'effetto grafico. Es: "fold:250"
  //
  // Se e' stata specificata un'animazione differente prendo quella
  if (customType)
    this.Tipo = customType;
  //
  this.Durata = 250;    // ms
  //
  this.Blocking = false;
  this.WebkitTick = 0;
  //
  var p = this.Tipo.indexOf(":");
  if (p>-1)
  {
    // L'animazione e' bloccante se tipo contiene !
    var exc = this.Tipo.indexOf("!");
    if (exc != -1)
    {
      this.Blocking = true;
      this.Tipo = this.Tipo.substring(0,exc);
    }
    //
    this.Durata = parseInt(this.Tipo.substring(p+1));
    this.Tipo = this.Tipo.substring(0,p);
  }
  //
  if (skip || this.Tipo=="none" || !RD3_ClientParams.EnableGFX || RD3_Glb.IsMobile())
    this.Durata = 0;
  //
  this.Finished = false; // Effetto terminato?
  this.Started = false;  // Effetto iniziato? (fatto almeno un Tick..)
  //
  this.CloseFormAnimation = false;  // Animazione di chiusura form?
  //
  this.OldValue = false;            // Per alcune animazioni e' necessario sapere il valore 'vecchio' del parametro per decidere cosa fare
  //
  // Variabili di gestione del collapse e del passaggio tra lista e dettaglio
  this.Immediate = false;
  //
  // Variabili per le animazioni di book
  this.UnrealizeOnFinish = false;   // True se alla fine dell'animazione devo fare l'unrealize della pagina animata in ingresso (sostituita da quella arrivata dal server, vedi BookPage.SetNumber)
  //
  this.ExecuteFinish = false;       // Semaforo per fare eseguire la fine dell'animazione 
}


// **************************************************************************** 
// Esegue lo start dell'animazione
// ****************************************************************************
GFX.prototype.Start = function()
{
  // Se non devo eseguirlo passo subito nello stato finale.
  // Non inizializzo la data proprio per dare l'informazione che l'effetto non e' mai partito
  if (this.Durata==0)
  {
    this.SetFinished();
    return;
  }
  //
  this.StartDate = new Date(); // Istante iniziale
  if (this.Obj && this.Obj.style)
    this.ObjOverflow = this.Obj.style.overflow; // Overflow iniziale
  //
  // Inizializzo lo stato degli oggetti in base alla classe
  switch(this.Classe)
  {
    case "menu":
      //
      this.MenuStart();
      //
    break; 

    case "sidebar":
      //
      this.SideBarStart();
      //
    break;
    
    case "start":
      //
      this.StartStart();
      //
    break;
    
    case "form":
      //
      this.FormStart();
      //
    break;
    
    case "frame":
      //
      this.FrameStart();
      //
    break;
    
    case "tree":
      //
      this.TreeStart();
      //
    break;
    
    case "modal":
      //
      this.ModalStart();
      //
    break;
    
    case "list":
      //
      this.ListStart();
      //
    break;
    
    case "tab":
      //
      this.TabStart();
      //
    break;
    
    case "popup":
      //
      this.PopupStart();
      //
    break;
    
    case "graph":
      //
      this.GraphStart();
      //
    break;
    
    case "book":
      //
      this.BookStart();
      //
    break;
    
    case "message":
      //
      this.MessageStart();
      //
    break;
    
    case "lastmessage":
      //
      this.LastMessageStart();
      //
    break;
    
    case "redirect":
      //
      this.RedirectStart();
      //
    break;
    
    case "preview":
      //
      this.PreviewStart();
      //
    break;
    
    case "docked":
      //
      this.DockedStart();
      //
    break;
    
    case "popupres":
      //
      this.PopupResizeStart();
      //
    break;
    
    case "tooltip":
      //
      this.TooltipStart();
      //
    break;
    
    case "taskbar":
      //
      this.TaskBarStart();
      //
    break;
    
    case "combo":
      //
      this.ComboStart();
      //
    break;
    
    case "group":
      //
      this.GroupStart();
      //
    break;
    
    case "zone":
      //
      this.ZoneStart();
      //
    break;
    
    case "unpinned":
      //
      this.UnpinnedStart();
      //
    break;
  }
}


// **************************************************************************** 
// fa avanzare gli effetti grafici 
// ****************************************************************************
GFX.prototype.Tick = function()
{
  // Se la fine dell'animazione era ritardata, lo gestisco ora
  if (this.WebkitTick > 0)
  {
    this.WebkitTick--;
    if (this.WebkitTick==0)
      this.SetFinished();
  }
  //
  if (this.IsFinished())
    return;
  //
  if (!this.Started && RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    // Se c'e' un'altra animazione webkit, la sovrapposizione rompe assai
    // allora aspetto serializzandole
    if (RD3_GFXManager.WebKitAnimating())
      return;
    //
    // E' la prima volta che arrivo nel tick
    // vediamo se posso gestire l'animazione tramite web kit
    // solo per i dispositivi mobile che altrimenti soffrono
    this.StartWebKit();
  } 
  //
  this.Started = true;
  //
  // Se sto davvero utilizzando webkit per l'animazione non devo fare nulla qui
  if (this.IsWebKit)
    return;
  //
  var d = new Date(); // Istante attuale
  var perc = (d-this.StartDate)/this.Durata; // Percentuale di completamento (da 0 a 1)
  if (perc>=1)
  { 
    perc = 1;
    //
    // Se il semaforo e' true allora finisco l'animazione
    if (this.ExecuteFinish)
    {  
      this.SetFinished();
      return;
    } 
  }
  //
  // Interpolazione quadratica
  perc=Math.sqrt(perc);
  //
  // Eseguo avanzamento effetto
  switch(this.Classe)
  {
    case "menu":
      //
      this.MenuTick(perc);
      //
    break;
    
    case "sidebar": 
      //
      if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
        this.SideBarRightTick(perc);
      else
        this.SideBarTick(perc);
      //
    break;
    
    case "start":
      //
      this.StartTick(perc);
      //
    break;
    
    case "form":
      //
      this.FormTick(perc);
      //
    break;

    case "frame":
      //
      this.FrameTick(perc);
      //
    break;
    
    case "tree":
      //
      this.TreeTick(perc);
      //
    break;
    
    case "modal":
      //
      this.ModalTick(perc);
      //
    break;
    
    case "list":
      //
      this.ListTick(perc);
      //
    break;

    case "tab":
      //
      this.TabTick(perc);
      //
    break;
    
    case "popup":
      //
      this.PopupTick(perc);
      //
    break;
    
    case "graph":
      //
      this.GraphTick(perc);
      //
    break;
    
    case "book":
      //
      this.BookTick(perc);
      //
    break;
    
    case "message":
      //
      this.MessageTick(perc);
      //
    break;
    
    case "lastmessage":
      //
      this.LastMessageTick(perc);
      //
    break;
    
    case "redirect":
      //
      this.RedirectTick(perc);
      //
    break;
    
    case "preview":
      //
      this.PreviewTick(perc);
      //
    break;
    
    case "docked":
      //
      this.DockedTick(perc);
      //
    break;
    
    case "popupres":
      //
      this.PopupResizeTick(perc);
      //
    break;
    
    case "tooltip":
      //
      this.TooltipTick(perc);
      //
    break;
    
    case "taskbar":
      //
      this.TaskBarTick(perc);
      //
    break;
    
    case "combo":
      //
      this.ComboTick(perc);
      //
    break;
    
    case "group":
      //
      this.GroupTick(perc);
      //
    break;
    
    case "zone":
      //
      this.ZoneTick(perc);
      //
    break;
    
    case "unpinned":
      //
      this.UnpinnedTick(perc);
      //
    break;
  }
  //
  if (perc==1)
  {
    // Metto a true il semaforo: al prossimo tick l'animazione viene completata
    this.ExecuteFinish = true;
  }
}


// **************************************************************************** 
// Imposta lo stato finale dell'oggetto perche' l'effetto e' terminato
// ****************************************************************************
GFX.prototype.SetFinished= function()
{
  if (this.IsWebKit)
  {
    // Per webkit, ObjW puo' essere negatvo
    if (this.ObjW<0)
      this.ObjW = - this.ObjW;
    if (this.ObjH<0)
      this.ObjH = - this.ObjH;
  }
  //
  if (this.TargetObj)
  {
    this.TargetObj.removeEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
    this.TargetObj = null;
  }
  this.ResetWebKitTiming();
  //
  switch (this.Classe)
  {
    case "menu":
      //
      this.MenuFinish();
      //
    break;
    
    case "sidebar":
      //
      this.SideBarFinish();
      //
    break;

    case "start":
      //
      this.StartFinish();
      //
    break;
    
    case "form":
      //
      this.FormFinish();
      //
    break;
    
    case "frame":
      //
      this.FrameFinish();
      //
    break;
    
    case "tree":
      //
      this.TreeFinish();
      //
    break;
    
    case "modal":
      //
      this.ModalFinish();
      //
    break;
    
    case "list":
      //
      this.ListFinish();
      //
    break;

    case "tab":
      //
      this.TabFinish();
      //
    break;
    
    case "popup":
      //
      this.PopupFinish();
      //
    break;
    
    case "graph":
      //
      this.GraphFinish();
      //
    break;
    
    case "book":
      //
      this.BookFinish();
      //
    break;
    
    case "message":
      //
      this.MessageFinish();
      //
    break;
    
    case "lastmessage":
      //
      this.LastMessageFinish();
      //
    break;
    
    case "redirect":
      //
      this.RedirectFinish();
      //
    break;
    
    case "preview":
      //
      this.PreviewFinish();
      //
    break;
    
    case "docked":
      //
      this.DockedFinish();
      //
    break;
    
    case "popupres":
      //
      this.PopupResizeFinish();
      //
    break;
    
    case "tooltip":
      //
      this.TooltipFinish();
      //
    break;
    
    case "taskbar":
      //
      this.TaskBarFinish();
      //
    break;
    
    case "combo":
      //
      this.ComboFinish();
      //
    break;
    
    case "group":
      //
      this.GroupFinish();
      //
    break;
    
    case "zone":
      //
      this.ZoneFinish();
      //
    break;
    
    case "unpinned":
      //
      this.UnpinnedFinish();
      //
    break;
  }
  //
  this.Finished = true;
  //
  // Elimino i riferimenti degli oggetti animati
  this.Obj = null;
  this.ObjOut = null;
}


// **************************************************************************** 
// ritorna vero se l'effetto e' terminato e deve essere rimosso
// ****************************************************************************
GFX.prototype.IsFinished= function()
{
  return this.Finished;
}


// ************************************************
// Conclude le animazioni su un determinato oggetto
// ************************************************
GFX.prototype.FinishGFX = function(fx)
{
  var fin = false;
  //
  // Ci puo' essere una sola animazione di form attiva in un dato istante
  if (this.Classe == "form" && fx.Classe == "form")
    fin = true;
  //
  // Ci puo' essere una sola animazione per docked alla stessa posizione, 
  if (this.Classe == "docked" && fx.Classe == "docked" && this.Obj && this.Obj.DockType == fx.Obj.DockType)
  {
    // Se sono una animazione di ingresso vinco io (e quella di uscita muore..) altrimenti devo finire io e continuare lei
    if (this.Flin)
      return true;
    else
    {
      fin = true;
      this.ObjDockType = this.Obj.DockType;
    }
  }
  //
  // Le animazioni Docked e Menu laterale non sono compatibili
  if ((this.Classe=="sidebar" && fx.Classe=="docked") || (this.Classe=="docked" && fx.Classe=="sidebar"))
    fin = true;
  //
  if (fx.Obj==this.Obj && this.CanBeFinished(fx.Classe, fx.Tipo))
    fin = true;
  //
  if (fin)
  {
    // Se l'animazione e' gia' partita finisco andando nello stato finale,
    // altrimenti ci sono alcuni casi (risposte concatenate) in cui se l'animazione non e' partita
    // non vado nello stato finale
    if (!this.Started && !this.Finished)
    {
      if (this.Classe=="list" && fx.Classe == "list")
        this.Finished = true;
    }
    //
    // Se l'oggetto in uscita di entrambe le animazioni e lo stesso e siamo entrambe animazioni di chiusura 
    // io non posso eliminare la form, altrimenti la prossima animazione non troverebbe l'oggetto: allora
    // elimino la mia impostazione di chiusura
    if (this.Classe == "form" && fx.Classe == "form" && this.ObjOut==fx.ObjOut && this.CloseFormAnimation && fx.CloseFormAnimation)
      this.CloseFormAnimation = false;
  }
  if (fin && !this.Finished)
    this.SetFinished();
  //
  // La fine dell'animazione ha sovrascritto il parametro AlreadyVisible.. lo metto a false
  if (this.Classe == "form" && fx.Classe == "form" && this.Obj && this.Obj.Realized)
  {
    this.Obj.AlreadyVisible = false;
  }
  //
  return this.BlockAnim(fx.Classe, fx.Tipo, fx);
}


// ************************************************
// True se questa animazione puo' essere bloccata da un
// animazione del tipo e classe specificata
// ************************************************
GFX.prototype.CanBeFinished = function(classe, tipo)
{
  // Un animazione di Messaggio non puo' bloccare un animazione di form
  if (this.Classe == "form" && classe == "message")
    return false;
  //
  // Un animazione di Messaggio non puo' bloccare un animazione di apertura modale
  if (this.Classe == "modal" && classe == "message")
    return false;
  //
  return true;
}


// ************************************************
// True se questa animazione deve vincere rispetto
//  a quella specificata, che deve essere bloccata
// ************************************************
GFX.prototype.BlockAnim = function(classe, tipo, fx)
{
  // Un animazione di Messaggio non puo' bloccare un animazione di form
  if (this.Classe == "form" && classe == "message")
    return true;
  //
  // Un animazione di Messaggio non puo' bloccare un animazione di ingresso modale
  if (this.Classe == "modal" && classe == "message")
    return true;
  //
  // Ci puo' essere una sola animazione per docked alla stessa posizione
  if (this.Classe == "docked" && classe == "docked" && ((this.Obj && this.Obj.DockType==fx.Obj.DockType)||(this.ObjDockType==fx.Obj.DockType)))
    return true;
  //
  return false;
}

// ***********************************************************
// Verifica se questa animazione e' di chiusura modale
// relativa all'identificatore passato, ed in quel caso la
// termina
// ***********************************************************
GFX.prototype.FinishModalClosing = function(ident)
{
  // Se sono una animazione modale non finita, e riguardo la stessa form
  // passata come parametro, e sono di chiusura allora finisco
  if (this.Classe=="modal" && this.Obj && this.Obj.Identifier==ident && !this.IsFinished() && !this.Flin && this.CloseFormAnimation)
    this.SetFinished();
}


// ************************************************
// Esegue lo start di una animazione di Form
// ************************************************
GFX.prototype.FormStart = function()
{
  this.InFrm = (this.Obj.Identifier) ? true : false;                      // L'oggetto di ingresso e' una WebForm o un Div?
  this.OutFrm = (this.ObjOut && this.ObjOut.Identifier) ? true : false;   // L'oggetto di uscita e' una WebForm o un Div?
  //
  // Dico alle form che sono animate
  if (this.InFrm)
    this.Obj.Animating = true;
  if (this.OutFrm)
    this.ObjOut.Animating = true;
  //
  var s =  this.InFrm ? this.Obj.FormBox.style : this.Obj.style;
  var so = null;
  if (this.ObjOut)
    so = this.OutFrm ? this.ObjOut.FormBox.style : this.ObjOut.style;
  //
  // Posiziono gli oggetti in maniera assoluta in modo da poterli spostare
  s.position = "absolute";
  if (this.ObjOut)
    so.position = "absolute";
  //
  // Gestisco gli overflow
  this.ObjOv = s.overflow;
  s.overflow = "hidden";
  if (this.ObjOut)
  {
    this.ObjOutOv = so.overflow;
    so.overflow = "hidden";
  }
  //
  // Li rendo entrambi visibili
  s.display = "";
  if (this.ObjOut)
    so.display = "";
  //
  // Su Firefox non supportiamo un po' di cose: l'animazione di scrolling per la form la trasformiamo in fold
  // e le animazioni le facciamo tutte dall'alto..
  if (RD3_Glb.IsFirefox(3))
  {
    if (this.Tipo == "scroll-h" || this.Tipo == "scroll-v")
      this.Tipo = this.Tipo.replace("scroll","fold");
    //
    this.Flin = true;
  }
  //
  // Imposto le proprieta' iniziali
  var wk = this.WillBeWebKit();
  //
  // Inizializzo in base al tipo di animazione
  if (this.Tipo == "fade")
  {
    // Posso inizializzare il fade.. do' l'opacita' massima (su IE lo do sia al Form Box sia al FrameBox, se no non funziona..)
    if (RD3_Glb.IsIE(10, false))
    {
      s.filter = "filter: alpha(opacity = 0);";
      //
      if (this.InFrm)
        this.Obj.FramesBox.style.filter = "filter: alpha(opacity = 0);";
    }
    else
    {
      s.opacity = 0;
    }
    //
    // Se ho un oggetto da fare uscire lo mostro con opacita' minima..
    if (this.ObjOut)
    {
      if (RD3_Glb.IsIE(10, false))
      {
        so.filter = "filter: alpha(opacity = 100);";
        //
        if (this.OutFrm)
          this.ObjOut.FramesBox.style.filter = "filter: alpha(opacity = 100);";
      }
      else
      {
        so.opacity = 1;
      }
    }
  }
  if (this.Tipo == "scroll-v")
  {
    if (this.Flin)
    {
      // Scroll dall'alto al basso
      // Posiziono la form nuova in alto
      this.ObjH = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetHeight;
      this.ObjH -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingTop"));
      this.ObjH -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingBottom"));
      if (wk)
        s.webkitTransform = "translateY(-" + this.ObjH + "px)";
      else
        s.top = "-" + this.ObjH + "px";
    }
    else
    {
      // Scroll dal basso all'alto
      // Posiziono la form nuova in basso
      this.ObjH = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetHeight;
      this.ObjPadding = parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingTop"));
      this.ObjH -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingBottom"));
      if (wk)
      {
        s.webkitTransform = "translateY(" + this.ObjH + "px)";
        this.ObjH = -this.ObjH;
      }
      else
        s.top = (this.ObjH) + "px";
    }
  }
  if (this.Tipo == "scroll-h")
  {
    if (this.Flin)
    {
      // Scroll dall'dx a sx
      // Posiziono la form nuova a destra
      this.ObjW = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetWidth;
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingLeft"));
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingRight"));
      if (wk)
      {
        s.webkitTransform = "translateX(" + this.ObjW + "px)";
        this.ObjW = -this.ObjW;
      }
      else
        s.left = (this.ObjW) + "px";
    }
    else
    {
      // Scroll da sx a dx
      // Posiziono la form nuova a sx
      this.ObjW = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetWidth;
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingLeft"));
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingRight"));
      if (wk)
        s.webkitTransform = "translateX(-" + this.ObjW + "px)";
      else
        s.left = "-" + this.ObjW + "px";
    }
  }
  if (this.Tipo == "fold-v")
  {
    if (this.Flin)
    {
      // Scroll dall'alto al basso
      // Posiziono la form nuova in alto
      this.ObjH = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetHeight;
      this.ObjH -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingTop"));
      this.ObjH -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingBottom"));
      s.top = "-" + this.ObjH + "px";
    }
    else
    {
      // Scroll dal basso all'alto
      // Posiziono la form nuova in basso
      this.ObjH = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetHeight;
      this.ObjPadding = parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingTop"));
      this.ObjH -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingBottom"));
      s.top = (this.ObjH) + "px";
    }
  }
  if (this.Tipo == "fold-h")
  {
    if (this.Flin)
    {
      // Fold dall'dx a sx
      // Posiziono la form nuova a destra 
      this.ObjW = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetWidth;
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingLeft"));
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingRight"));
      s.left = (this.ObjW) + "px";
      
    }
    else
    {
      // Fold da sx a dx
      // Posiziono la form nuova a sx
      this.ObjW = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetWidth;
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingLeft"));
      this.ObjW -= parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingRight"));
      s.left = "-" + this.ObjW + "px";
    }
  }
  //
  // Faccio l'adapt iniziale per mostrare correttamente i campi
  if(this.InFrm)
  {
    var rec = this.Obj.RecalcLayout;
    this.Obj.AdaptLayout();
    this.Obj.RecalcLayout = rec;
    this.StartDate = new Date(); // Istante iniziale : lo reimposto perche' l'adapt e' lento..
  }
  //
  // Ora che ho fatto adattare metto a zero le dimensioni nel caso di fold
  if (this.Tipo == "fold-h")
  {
    s.width = "0px";
    //
    // Riposiziono il frame
    if (!this.Flin)
      s.left = 0 + parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingLeft")) + "px";
  }
  if (this.Tipo == "fold-v")
  {
    s.height = "0px";
    if (this.Flin)
      s.top = 0 + parseFloat(RD3_Glb.GetStyleProp(RD3_DesktopManager.WebEntryPoint.FormsBox, "paddingTop")) + "px";
  }
}


// ************************************************
// Tick di una animazione di Form
// ************************************************
GFX.prototype.FormTick = function(perc)
{
  // Accedo agli stili necessari (gli oggetti possono essere Div o WebForm)
  var si = this.InFrm ? this.Obj.FormBox.style : this.Obj.style;
  var frsi = this.InFrm ? this.Obj.FramesBox.style : null;
  var so = null;
  var frso = null;
  if (this.ObjOut)
  {
    // Se ho un oggetto da fare uscire accedo ai suoi stili
    so = this.OutFrm ? this.ObjOut.FormBox.style : this.ObjOut.style;
    frso = this.OutFrm ? this.ObjOut.FramesBox.style : null;
  }
  //
  if (this.Tipo == "fade")
  {
    // Applico il fading corretto all'oggetto in entrata
    if (RD3_Glb.IsIE(10, false))
    {
      si.filter = "filter: alpha(opacity = "+Math.floor(perc*100)+");";
      if (frsi)
        frsi.filter = "filter: alpha(opacity = "+Math.floor(perc*100)+");";
    }
    else
    {
      si.opacity = perc;
    }
    //
    // Se ho un oggetto da fare uscire applico il fade inverso a lui
    if (this.ObjOut)
    {
      if (RD3_Glb.IsIE(10, false))
      {
        so.filter = "filter: alpha(opacity = "+Math.floor(100 - (perc*100))+");";
        if (frso)
          frso.filter = "filter: alpha(opacity = "+Math.floor(100 - (perc*100))+");";
      }
      else
      {
        so.opacity = 1 - perc;
      }
    }
  }
  if (this.Tipo == "scroll-v")
  {
    if (this.Flin)
    {
      // Scroll dall'alto al basso
      si.top = "-" + Math.floor(this.ObjH - perc*this.ObjH) + "px";
      if (this.ObjOut)
        so.top = Math.floor(perc*this.ObjH) + "px";
    }
    else
    {
      // Scroll dal basso all'alto
      si.top = Math.floor(this.ObjH - perc*this.ObjH  + this.ObjPadding) + "px";
      if (this.ObjOut)
        so.top = Math.floor(0 - perc*this.ObjH) + "px";
    }
  }
  if (this.Tipo == "scroll-h")
  {
    if (this.Flin)
    {
      // Scroll da dx a sx
      si.left = "-" + Math.floor(this.ObjW - perc*this.ObjW) + "px";
      if (this.ObjOut)
        so.left = Math.floor(perc*this.ObjW) + "px";
    }
    else
    {
      // Scroll da sx a dx
      si.left = Math.floor(this.ObjW - perc*this.ObjW) + "px";
      if (this.ObjOut)
        so.left = Math.floor(0 - perc*this.ObjW) + "px";
    }
  }
  if (this.Tipo == "fold-h")
  {
    if (this.Flin)
    {
      // Fold da dx a sx
      si.width = Math.floor(perc*this.ObjW) + "px";
      si.left = Math.floor(this.ObjW - (perc*this.ObjW)) + "px";
      //
      if (this.ObjOut)
        so.width = Math.floor((1-perc)*this.ObjW) + "px";
    }
    else
    {
      // Fold da sx a dx
      si.width = Math.floor(perc*this.ObjW) + "px";
      if (this.ObjOut)
      {
        so.width = Math.floor((1-perc)*this.ObjW) + "px";
        so.left = Math.floor(perc*this.ObjW) + "px";
      }
    }
  }
  if (this.Tipo == "fold-v")
  {
    if (this.Flin)
    {
      // Fold da up a dn
      si.height = Math.floor(perc*this.ObjH) + "px";
      //
      if (this.ObjOut)
      {
        so.height = Math.floor((1-perc)*this.ObjH) + "px";
        so.top = Math.floor(perc*this.ObjH) + "px";
      }
      //
      var ob = this.InFrm ? this.Obj.FormBox : this.Obj;
      ob.scrollTop = "0px";
    }
    else
    {
      // Fold da dn a up
      si.height = Math.floor(perc*this.ObjH) + "px";
      si.top = Math.floor(this.ObjH - (perc*this.ObjH)  + this.ObjPadding) + "px";
      //
      if (this.ObjOut)
      {
        so.height = Math.floor((1-perc)*this.ObjH) + "px";
      }
    }
  }
}


// ************************************************
// Fine di una animazione di Form
// ************************************************
GFX.prototype.FormFinish = function()
{
  this.InFrm = (this.Obj.Identifier) ? true : false;                      // L'oggetto di ingresso e' una WebForm o un Div?
  this.OutFrm = (this.ObjOut && this.ObjOut.Identifier) ? true : false;   // L'oggetto di uscita e' una WebForm o un Div?
  //
  // Dico alle form che la loro animazione e' finita
  if (this.InFrm)
    this.Obj.Animating = false;
  if (this.OutFrm)
    this.ObjOut.Animating = false;
  // 
  //
  // Accedo agli stili necessari (gli oggetti possono essere Div o WebForm)
  var si = this.InFrm ? this.Obj.FormBox.style : this.Obj.style;
  var frsi = this.InFrm ? this.Obj.FramesBox.style : null;
  var so = null;
  var frso = null;
  if (this.ObjOut)
  {
    so = this.OutFrm ? this.ObjOut.FormBox.style : this.ObjOut.style;
    frso = this.OutFrm ? this.ObjOut.FramesBox.style : null;
  }
  //
  // Se ho animato un oggetto in uscita resetto le sue impostazioni
  if (this.ObjOut)
  {
    so.position = "";
    so.top = "";
    so.left = "";
    if (this.IsWebKit)
      so.webkitTransform = "";
    if (this.ObjOutOv!=undefined)
      so.overflow = this.ObjOutOv;
    if (RD3_Glb.IsIE(10, false))
    {
      so.removeAttribute("filter");
      if (frso)
        frso.removeAttribute("filter");
    }
    else
    {
      so.opacity=1;
    }
  }
  //
  // Mostro l'oggetto da fare entrare rimuovendo il filtro o togliendo l'opacita'
  if (RD3_Glb.IsIE(10, false))
  {
    si.removeAttribute("filter");
    if (frsi)
      frsi.removeAttribute("filter");
  }
  else
  {
    si.opacity=1;
  }
  //
  // Reimposto la posizione corretta
  si.position = "";
  si.top = "";
  si.left = "";
  if (this.IsWebKit)
    si.webkitTransform = "";
  if (this.ObjOv!=undefined)
    si.overflow = this.ObjOv;
  //
  // Se gli oggetti non sono form (quindi e' il wepbox..) li nascondo o mostro direttamente
  if (!this.OutFrm && this.ObjOut)
    this.ObjOut.style.display = "none";
  if (!this.InFrm)
    this.Obj.style.display = "";
  // 
  // Se sono una animazione di chiusura form devo fare l'unrealize della form ed eliminarla dallo stack
  if (this.CloseFormAnimation && this.ObjOut && this.Classe == "form")
  {
    RD3_DesktopManager.WebEntryPoint.CompleteCloseFormAnimation(this.ObjOut, !this.InForm);
  }
  //
  var wep = RD3_DesktopManager.WebEntryPoint;
  //
  if (this.InFrm)
  {
    wep.ActiveForm = this.Obj;
  }
  else
  {
    wep.ActiveForm = null;
    wep.VisibleForm = null;
  }
  //
  var mustadapt = (this.Tipo == "none" || this.Durata == 0) && (this.Obj != this.ObjOut) ? true : false;
  wep.HandleFinishFormAnimation(mustadapt);
}


// ************************************************
// Start di una animazione di menu
// ************************************************
GFX.prototype.MenuStart = function()
{
  // Il menu' supporta solo l'animazione FOLD che viene eseguita, nel caso IN facendo apparire
  // l'oggetto ad altezza 0 e poi aumentandolo fino all'altezza prevista. Nel contempo viene
  // modificata l'altezza del FORMLIST in modo da pareggiare l'altezza
  //
  // Memorizzo l'altezza (offsetHeight sia dell'oggetto che del formlistbox)
  this.Obj.style.display = "";  // Metto l'oggetto nel DOM in modo da poterne calcolare l'altezza che deve raggiungere
  this.ObjSize = this.Obj.style.height;
  this.ObjEndSize = this.Obj.offsetHeight;
  var flb = RD3_DesktopManager.WebEntryPoint.FormListBox;
  this.ObjFLSize = (flb)?flb.offsetHeight:0;
  //
  this.Obj.style.overflowY = "hidden"; // Siccome devo modificare l'altezza dell'oggetto non voglio che mostri parti interne
  //
  if (this.Flin)
    this.Obj.style.height = "0px";      // Imposto lo stato iniziale, solo se deve entrare
}


// ************************************************
// Tick di una animazione di menu
// ************************************************
GFX.prototype.MenuTick = function(perc)
{
  var w = 0;
  var cw = 0;
  if (this.Flin)
  {
    w = Math.floor(this.ObjEndSize*perc);
    cw = this.ObjFLSize-w-2;
  }
  else
  {
    w = Math.floor(this.ObjEndSize*(1-perc));
    cw = this.ObjFLSize+this.ObjEndSize-w-2;
  }
  //
  this.Obj.style.height = w+"px";
  var flb = RD3_DesktopManager.WebEntryPoint.FormListBox;
  if (cw>0 && flb)
    flb.style.height = cw+"px";
}


// ************************************************
// Fine di una animazione di menu
// ************************************************
GFX.prototype.MenuFinish = function()
{
  if (this.StartDate)
  {
    this.Obj.style.overflow = this.ObjOverflow;
    this.Obj.style.height = this.ObjSize;
  }
  //
  this.Obj.style.display = this.Flin?"":"none";
  RD3_DesktopManager.WebEntryPoint.AdaptFormListBox();
  RD3_DesktopManager.WebEntryPoint.AdaptScrollBox();
}


// ************************************************
// Start dell'animazione della Sidebar
// ************************************************
GFX.prototype.SideBarStart = function()
{
  // La sidebar supporta solo l'animazione FOLD o SCROLL che viene eseguita, nel caso IN facendo apparire
  // l'oggetto a larghezza 0 e poi aumentandolo fino alla larghezza prevista. Nel contempo viene
  // modificata la larghezza e la posizione di tutte le altre finestre attive
  //
  // Memorizzo le dimensioni
  this.Obj.style.display = "";  // Metto l'oggetto nel DOM in modo da poterne calcolare la larghezza che deve raggiungere
  this.ObjSize = this.Obj.style.width;
  this.ObjEndSize = this.Obj.offsetWidth;
  this.ObjFOW = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetWidth;
  this.ObjFOL = RD3_DesktopManager.WebEntryPoint.FormsBox.offsetLeft;
  this.ObjSOW = RD3_DesktopManager.WebEntryPoint.StatusBarBox.offsetWidth;
  this.ObjSOL = RD3_DesktopManager.WebEntryPoint.StatusBarBox.offsetLeft;
  this.ObjTOW = RD3_DesktopManager.WebEntryPoint.ToolBarBox.offsetWidth;
  this.ObjTOL = RD3_DesktopManager.WebEntryPoint.ToolBarBox.offsetLeft;
  //
  var nf = RD3_DesktopManager.WebEntryPoint.StackForm.length;
  for (var t=0;t<nf;t++)
  {
    var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
    if (f.Docked)
    {
      switch(f.DockType)
      {
        case RD3_Glb.FORMDOCK_LEFT : 
          this.ObjDLOW = RD3_DesktopManager.WebEntryPoint.LeftDockedBox.offsetWidth;
          this.ObjDLOL = RD3_DesktopManager.WebEntryPoint.LeftDockedBox.offsetLeft;
          this.ObjDLS = RD3_DesktopManager.WebEntryPoint.LeftDockedBox.style;
        break;
        
        case RD3_Glb.FORMDOCK_TOP : 
          this.ObjDTOW = RD3_DesktopManager.WebEntryPoint.TopDockedBox.offsetWidth;
          this.ObjDTOL = RD3_DesktopManager.WebEntryPoint.TopDockedBox.offsetLeft;
          this.ObjDTS = RD3_DesktopManager.WebEntryPoint.TopDockedBox.style;
        break;
        
        case RD3_Glb.FORMDOCK_BOTTOM : 
          this.ObjDBOW = RD3_DesktopManager.WebEntryPoint.BottomDockedBox.offsetWidth;
          this.ObjDBOL = RD3_DesktopManager.WebEntryPoint.BottomDockedBox.offsetLeft;
          this.ObjDBS = RD3_DesktopManager.WebEntryPoint.BottomDockedBox.style;
        break;
        
        case RD3_Glb.FORMDOCK_RIGHT : 
          this.ObjDROW = RD3_DesktopManager.WebEntryPoint.RightDockedBox.offsetWidth;
          this.ObjDROL = RD3_DesktopManager.WebEntryPoint.RightDockedBox.offsetLeft;
          this.ObjDRS = RD3_DesktopManager.WebEntryPoint.RightDockedBox.style;
        break;
      }
    }
  }  
  //
  this.Obj.style.overflow = "hidden"; // Siccome devo modificare la larghezza dell'oggetto non voglio che mostri parti interne
  //
  // Assegno temporaneamente il posizionamento relativo all'oggetto, in modo da poter cambiare la sua posizione facendolo scorrere
  this.Obj.style.position = "relative";
}


// ************************************************
// Tick dell'animazione della sidebar (da destra)
// ************************************************
GFX.prototype.SideBarRightTick = function(perc)
{
  var w = 0;
  var cw = 0;
  var pos = 0;
  var sw = 0;
  var tw = 0;
  var dw = 0;
  if (this.Flin)
  {
    w = Math.floor(this.ObjEndSize*perc);
    cw = this.ObjFOW-w-2;
    sw = this.ObjSOW-w-2;
    tw = this.ObjTOW-w-2;
    dw = -w;
  }
  else
  {
    w = Math.floor(this.ObjEndSize*(1-perc));
    cw = this.ObjFOW+this.ObjEndSize-w-2;
    sw = this.ObjSOW+this.ObjEndSize-w-2;
    tw = this.ObjTOW+this.ObjEndSize-w-2;
    dw = this.ObjEndSize-w;
  }
  //
  // Calcolo il valore da assegnare alla posizione dell'oggetto per farlo scorrere
  pos = Math.floor(this.ObjEndSize - w);
  //
  if (this.Tipo == "scroll")
  {
    this.Obj.style.left = pos+"px";
  }
  //
  if (this.Tipo == "fold")
  {
    this.Obj.style.width = w+"px";
    this.Obj.style.left = pos+"px";
  }
  //
  var s = RD3_DesktopManager.WebEntryPoint.FormsBox.style;
  s.width = cw + "px"
  //
  s = RD3_DesktopManager.WebEntryPoint.StatusBarBox.style;
  s.width = sw + "px"
  //
  s = RD3_DesktopManager.WebEntryPoint.ToolBarBox.style;
  s.width = tw + "px"
  //
  if (this.ObjDRS)
    this.ObjDRS.left = (this.ObjDROL + dw) + "px";
  if (this.ObjDTS)
    this.ObjDTS.width = (this.ObjDTOW + dw) + "px";
  if (this.ObjDBS)
    this.ObjDBS.width = (this.ObjDBOW + dw) + "px";
}


// ************************************************
// Tick dell'animazione della sidebar
// ************************************************
GFX.prototype.SideBarTick = function(perc)
{
  var w = 0;
  var cw = 0;
  var pos = 0;
  var sw = 0;
  var tw = 0;
  var dtw = 0;
  var dbw = 0;
  var dlw = 0;
  if (this.Flin)
  {
    w = Math.floor(this.ObjEndSize*perc);
    cw = this.ObjFOW-w-2;
    sw = this.ObjSOW-w-2;
    tw = this.ObjTOW-w-2;
    if (this.ObjDTOW)
      dtw = this.ObjDTOW-w-2;
    if (this.ObjDBOW)
      dbw = this.ObjDBOW-w-2;
    if (this.ObjDLOW)
      dlw = this.ObjDLOW-w-2;
  }
  else
  {
    w = Math.floor(this.ObjEndSize*(1-perc));
    cw = this.ObjFOW+this.ObjEndSize-w-2;
    sw = this.ObjSOW+this.ObjEndSize-w-2;
    tw = this.ObjTOW+this.ObjEndSize-w-2;
    if (this.ObjDTOW)
      dtw = this.ObjDTOW+this.ObjEndSize-w-2;
    if (this.ObjDBOW)
      dbw = this.ObjDBOW+this.ObjEndSize-w-2;
    if (this.ObjDLOW)
      dlw = this.ObjDLOW+this.ObjEndSize-w-2;
  }
  //
  // Calcolo il valore da assegnare alla posizione dell'oggetto per farlo scorrere
  pos = Math.floor(w - this.ObjEndSize);
  //
  if (this.Tipo == "scroll")
  {
    this.Obj.style.left = pos+"px";
  }
  //
  if (this.Tipo == "fold")
  {
    this.Obj.style.width = w+"px";
  }
  //
  var s = RD3_DesktopManager.WebEntryPoint.FormsBox.style;
  s.left = (this.ObjFOL + (this.ObjFOW-cw)) + "px";
  s.width = cw + "px"
  //
  s = RD3_DesktopManager.WebEntryPoint.StatusBarBox.style;
  s.left = (this.ObjSOL + (this.ObjSOW-sw)) + "px";
  //
  s = RD3_DesktopManager.WebEntryPoint.ToolBarBox.style;
  s.left = (this.ObjTOL + (this.ObjTOW-tw)) + "px";
  //
  if (this.ObjDTS)
    this.ObjDTS.left = (this.ObjDTOL + (this.ObjDTOW-dtw)) + "px";
  if (this.ObjDBS)
    this.ObjDBS.left = (this.ObjDBOL + (this.ObjDBOW-dbw)) + "px";
  if (this.ObjDLS)
    this.ObjDLS.left = (this.ObjDLOL + (this.ObjDLOW-dlw)) + "px";
}


// ************************************************
// Fine dell'animazione della sidebar
// ************************************************
GFX.prototype.SideBarFinish = function()
{
  if (this.WillBeWebKit() && this.Durata>0)
  {
    this.SideBarTick(this.Flin?0.99:1.01);
    this.Obj.style.webkitTransform = "";
    RD3_DesktopManager.WebEntryPoint.FormsBox.style.webkitTransform = "";
    RD3_DesktopManager.WebEntryPoint.StatusBarBox.style.webkitTransform = "";
    RD3_DesktopManager.WebEntryPoint.ToolBarBox.style.webkitTransform = "";
    if (this.ObjDL) this.ObjDL.style.webkitTransform = "";
    if (this.ObjDT) this.ObjDT.style.webkitTransform = "";
    if (this.ObjDB) this.ObjDB.style.webkitTransform = "";
  }
  //
  if (this.StartDate)
  {
    this.Obj.style.overflow = this.ObjOverflow;
    this.Obj.style.width = this.ObjSize;
  }
  this.Obj.style.display = this.Flin?"":"none";
  //
  // Ripristino il posizionamento da CSS
  this.Obj.style.position = "";
  //
  //if (this.StartDate)
  //  RD3_DesktopManager.WebEntryPoint.AdaptLayout();
  //
  // Se ho una docked devo forzare il resize alla fine di tutte le animazioni:
  // se non e' successo niente nel frattempo va tutto bene, ma se per caso e' arrivato un messaggio dal server 
  // (ad esempio la risposta ad un resize..) potrebbe aver mangiato la mia dimensione iniziale e fare saltare 
  // l'adapt.. in quel caso ci penso io a dire che all'inizio ero largo 0
  if ((this.ObjDLOW || this.ObjDTOW || this.ObjDROW || this.ObjDBOW) && this.Flin)
    RD3_DesktopManager.WebEntryPoint.SideMenuBoxW = 0;
}


// ************************************************
// Start dell'animazione di avvio
// ************************************************
GFX.prototype.StartStart = function()
{
  // All'inizio puo' essere attivato un evento di fading sul body
  // Rendo il body completamente trasparente, per ora
  if (RD3_Glb.IsIE(10, false))
    document.body.style.filter = "filter: alpha(opacity = 0);";
  else
    document.body.style.opacity = 0;
}


// ************************************************
// Tick dell'animazione di avvio
// ************************************************
GFX.prototype.StartTick = function(perc)
{
  // All'inizio puo' essere attivato un evento di fading sul body
  // Rendo il body completamente trasparente, per ora
  if (RD3_Glb.IsIE(10, false))
    document.body.style.filter = "filter: alpha(opacity = "+Math.floor(perc*100)+");";
  else
    document.body.style.opacity = perc;  
}


// ************************************************
// Fine dell'animazione di avvio
// ************************************************
GFX.prototype.StartFinish = function()
{
  // All'inizio puo' essere attivato un evento di fading sul body
  // Rendo il body completamente trasparente, per ora
  if (RD3_Glb.IsIE(10, false))
    document.body.style.removeAttribute("filter");
  else
    document.body.style.opacity=1;
  //
  var wep = RD3_DesktopManager.WebEntryPoint;
  if (wep.ActiveForm)
    wep.ActiveForm.Animating = false;
  //
  var nf = wep.StackForm.length;
  for (var t=0;t<nf;t++)
  {
    if (wep.StackForm[t].Docked)
      wep.StackForm[t].Animating = false;
  }
  //
  if (RD3_GFXManager.FocusFldId && RD3_GFXManager.FocusFldId != "")
  {
    RD3_DesktopManager.HandleFocus2(RD3_GFXManager.FocusFldId, RD3_GFXManager.FocusFldRow);
    //
    RD3_GFXManager.FocusFldId = "";
    RD3_GFXManager.FocusFldRow = 0;
  }
}


// ************************************************
// Start dell'animazione di frame
// ************************************************
GFX.prototype.FrameStart = function()
{
  // Devo collassare/espandere un frame
  // Leggo la dimensione finale che il frame deve raggiungere e quella iniziale del frame
  this.ObjH = this.Flin ? this.Obj.ToolbarBox.offsetHeight : this.Obj.Height;
  this.ObjSh = this.Flin ? this.Obj.Height : this.Obj.ToolbarBox.offsetHeight;
  //
  // La dimensione iniziale del collassamento e' quella attuale del frame
  this.Obj.CollapsingHeight = this.ObjSh;
  //
  // Dico al frame che sta facendo una animazione di collassamento, calcolera' le dimensioni in maniera differente
  this.Obj.Collapsing = true;
  //
  if (this.Obj.ParentFrame)
  {
    // Durante lo slide il contenitore del frame deve avere overflow hidden, in modo da fare l'effetto fold
    var chbox = this.Obj.ParentFrame.ChildFrame1 == this.Obj ? this.Obj.ParentFrame.ChildBox1 : this.Obj.ParentFrame.ChildBox2;
    //
    // Potrebbe non esserci (ad es. Tabbed View)
    if (chbox)
      chbox.style.overflow = "hidden";
  }
  // 
  // Se sto allargando faccio adattare il mio frame in modo da vederlo subito
  if (!this.Flin)
  {
    this.Obj.ContentBox.style.display = "";
    //
    // Allargo gia' il frame alla dimensione finale in modo che i calcoli siano corretti
    var h = this.Obj.FrameBox.style.height;
    this.Obj.FrameBox.style.height = this.ObjH + "px";
    //
    // Ripristino il recalc; lo faccio adattare anche alla fine
    this.OldRec = this.Obj.RecalcLayout;
    this.Obj.AdaptLayout();
    this.Obj.RecalcLayout = this.OldRec;
    //
    // Se ho un frame unico metto il suo box alto come la toolbar
    if (!this.Obj.ParentFrame)
    {
      this.Obj.FrameBox.style.height = this.ObjSh + "px";
    }
    //
    this.StartDate = new Date(); // Istante iniziale: reimpostato perche' l'adapt all'inizio potrebbe essere lento.. 
  }
  //
  RD3_KBManager.CheckFocus = false;
  //
  // Metto a hidden gli overflow, in modo da non far comparire scrollbar durante l'animazione
  this.overX = this.Obj.ContentBox.style.overflowX;
  this.Obj.ContentBox.style.overflowX = "hidden";
  this.overY = this.Obj.ContentBox.style.overflowY;
  this.Obj.ContentBox.style.overflowY = "hidden";
}


// ************************************************
// Tick dell'animazione di frame
// ************************************************
GFX.prototype.FrameTick = function(perc)
{
  // Se il frame da collassare e' l'unico della Form (non ha un ParentFrame) basta ridimensionare il suo box
  // in caso contrario bisogna adattare tutti i frame della form..
  if (!this.Obj.ParentFrame)
  {
    if (this.Flin)
      this.Obj.FrameBox.style.height = Math.floor(this.ObjH + ((this.ObjSh - this.ObjH)*(1-perc))) + "px";
    else
      this.Obj.FrameBox.style.height = Math.floor(this.ObjH - ((this.ObjH-this.ObjSh) * (1-perc))) + "px";
  }
  else
  {
    if (this.Flin)
    {
      this.Obj.CollapsingHeight = Math.floor(this.ObjH + ((this.ObjSh - this.ObjH)*(1-perc)));
    }
    else
    {
      this.Obj.ContentBox.style.height = Math.floor((this.ObjH - this.ObjSh)*perc) + "px";
      this.Obj.CollapsingHeight = Math.floor(this.ObjH - ((this.ObjH-this.ObjSh) * (1-perc)));
    }
    //
    // Faccio adattare i frames della Form
    this.Obj.WebForm.Frames[0].SetCollapsingChildLayout();
  }
}


// ************************************************
// Fine dell'animazione di frame
// ************************************************
GFX.prototype.FrameFinish = function()
{
  // Dico al frame che l'animazione e' finita: puo' calcolare le dimensioni normalmente
  this.Obj.Collapsing = false;
  //
  if (this.Obj.ParentFrame)
  {
    // Devo togliere l'hidden dal frame se l'ho messo
    var chbox = this.Obj.ParentFrame.ChildFrame1 == this.Obj ? this.Obj.ParentFrame.ChildBox1 : this.Obj.ParentFrame.ChildBox2;
    //
    if (chbox)
      chbox.style.overflow = "";
  }
  //
  if (this.Flin)
  {
    // Nascondo il contenuto (non lo faccio se sono il frame il preview)
    if (!this.Obj.IsPreview)
      this.Obj.ContentBox.style.display = "none";
    //
    // Imposto l'immagine corretta del pulsante collapse
    this.Obj.CollapseButton.src = RD3_Glb.GetImgSrc("images/expand"+(this.Obj.SmallIcons?"_sm":"")+".gif");
    //
    // Nascondo l'icona
    this.Obj.IconImg.style.display = "none";
    //
    // Imposto il Tooltip corretto
    RD3_TooltipManager.SetObjTitle(this.Obj.CollapseButton, RD3_ServerParams.MostraRiquadro);
    //
    // Se ero il frame di preview, mi devo chiudere e cancellare
    this.Obj.WebForm.ClosePreview();
    //
    // Imposto l'altezza del frame (non lo faccio se sono il frame preview)
    if (!this.Obj.IsPreview)
      this.Obj.SetHeight();
  }
  else
  {
    // Mostro il contenuto
    this.Obj.ContentBox.style.display = "";
    //
    // Imposto l'immagine corretta del pulsante collapse
    if (!RD3_Glb.IsMobile()) this.Obj.CollapseButton.src = RD3_Glb.GetImgSrc("images/collapse"+(this.Obj.SmallIcons?"_sm":"")+".gif");
    //
    // Mostro l'icona (se la devo mostrare)
    if (this.Obj.Image != "")
      this.Obj.IconImg.style.display = "";
    //
    // Imposto il Tooltip corretto
    RD3_TooltipManager.SetObjTitle(this.Obj.CollapseButton, RD3_ServerParams.NascondiRiquadro);
    //
    // Ripristino l'altezza corretta
    this.Obj.SetHeight();
    //
    this.Obj.Focus();
  }
  //
  this.Obj.ContentBox.style.overflowX = this.overX ? this.overX : "";
  this.Obj.ContentBox.style.overflowY = this.overY ? this.overY : "";
  //
  this.Obj.SetShowToolbar();
  this.Obj.SetShowStatusBar();
  this.Obj.SetLockable();
  //
  // Dico ai comandi di ricontrollare la visibilita' dei comandi del menu'
  RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveFormChanged();
  //
  // Adatto il layout della form per spostare i frames
  if (this.Obj.WebForm.Realized && this.OldValue!=this.Obj.Collapsed)
  {
    // Devo forzare il ricalcolo del resize
    this.Obj.RecalcResize = true;
    //
    if (this.Immediate)
    {
      // Su chrome devo dargli un po' di tempo per applicare i cambiamenti prima di fare un Adapt immediato, se no
      // aggiorna male l'interfaccia utente anche se il DOM e' giusto
      if (RD3_Glb.IsChrome())
        setTimeout(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Obj.WebForm.Identifier+"', 'AdaptLayout', ev)"), 10);
      else
        this.Obj.WebForm.AdaptLayout();
    }
    else
      this.Obj.WebForm.RecalcLayout = true;
  }
  //
  RD3_KBManager.CheckFocus = true;
  RD3_KBManager.ActiveObject = null;
}


// ************************************************
// Inizio dell'animazione di fading dei nodi
// ************************************************
GFX.prototype.TreeStart = function()
{
  var s = this.Obj.style;
  s.display = "";  // Metto l'oggetto nel DOM in modo da poterne calcolare l'altezza che deve raggiungere
  //
  this.ObjEndSize = this.Obj.offsetHeight;
  //
  if (this.Flin)
    s.height = "0px";      // Imposto lo stato iniziale
  else
    s.height = this.Obj.offsetHeight+"px";  // Imposto lo stato iniziale: forzo l'altezza da css, se no dando subito l'overflow hidden sfarfalla
  //
  s.overflow = "hidden"; // Siccome devo modificare l'altezza dell'oggetto non voglio che mostri parti interne
}


// ************************************************
// Tick dell'animazione di fading dei nodi
// ************************************************
GFX.prototype.TreeTick = function(perc)
{
  var w = 0;
  var cw = 0;
  if (this.Flin)
  {
    w = Math.floor(this.ObjEndSize*perc);
  }
  else
  {
    w = Math.floor(this.ObjEndSize*(1-perc));
  }
  //
  this.Obj.style.height = w+"px";
}


// ************************************************
// Fine dell'animazione di fading dei nodi
// ************************************************
GFX.prototype.TreeFinish = function()
{
  if (this.StartDate)
  {
    this.Obj.style.overflow = "";
  }
  this.Obj.style.display = this.Flin?"":"none";
  this.Obj.style.height = "";
}


// ************************************************
// Inizio dell'animazione di apertura/chiusura modale
// ************************************************
GFX.prototype.ModalStart = function()
{
  // L'animazione delle modali preve l'entrata da uno dei vertici del rettangolo e l'uscita verso uno dei vertici
  // oppure lo zoom da/verso un punto
  // Dico alla form che e' in animazione
  this.Obj.Animating = true;
  //
  var s = this.Obj.PopupFrame.PopupBox.style;
  this.Obj.PopupFrame.SetVisible(true);
  //
  // Gestisco gli overflow (solo se non uso webkit)
  this.ObjOv = s.overflow;
  if (!this.WillBeWebKit())
    s.overflow = "hidden";
  //
  // Mi memorizzo la posizione dell'ultimo punto cliccato dall'utente
  this.TargetX = this.Obj.OpenX;
  this.TargetY = this.Obj.OpenY;
  //
  // Gestione iniziale delle dimensioni
  if (this.Flin)
  {
    // Mostro anche il FormBox
    this.Obj.FormBox.style.display = "";
    //
    // Faccio l'adapt iniziale per mostrare correttamente i campi
    var rec = this.Obj.RecalcLayout;
    //
    this.Obj.AdaptLayout();
    //
    this.Obj.RecalcLayout = rec;
    this.StartDate = new Date(); // Istante iniziale : lo reimposto perche' l'adapt e' lento..
    //
    // Se sono in apertura metto a 0 la dimensione del popup frame
    if (!this.WillBeWebKit())
    {
      s.width = "0px";
      s.height = "0px";
    }
    //
    // Adesso posiziono il punto in maniera corretta
    // Top-Right: Sposto il punto all'estrema destra
    if (this.Tipo == "point-tr")
      s.left = (this.Obj.FormLeft + this.Obj.FormWidth) + "px";
    //
    // Bottom-Left: sposto il punto in basso 
    if (this.Tipo == "point-bl")
      s.top = (this.Obj.FormTop + this.Obj.FormHeight) + "px";
    //
    // Bottom-Right: sposto il punto in basso e a destra
    if (this.Tipo == "point-br")
    {
      s.top = (this.Obj.FormTop + this.Obj.FormHeight) + "px";
      s.left = (this.Obj.FormLeft + this.Obj.FormWidth) + "px";
    }
    if (this.Tipo == "zoom")
    {
      s.top = this.TargetY + "px";
      s.left = this.TargetX + "px";
      //
      // Fade iniziale
      if (RD3_Glb.IsIE(10, false))
        s.filter = "filter: alpha(opacity = 0);";
      else
        s.opacity = 0;
    }
  }
  //
  // Ulteriori impostazioni per l'animazione zoom
  if (this.Tipo == "zoom" && !this.WillBeWebKit())
  {
    // Nascondo le immagini della caption: il fading e' brutto su di loro...
    this.Obj.SetButtonVisibility("hidden");
    //
    // Per non appesantire l'esecuzione nascondo i messaggi e i frames
    // -> visibility: per correggere un baco di IE nell'unrealize del plugin di adobe, se non la imposto il plugin non si distrugge correttamente..
    this.Obj.FramesBox.style.display = "none";
    this.Obj.FramesBox.style.visibility = "hidden";
    this.Obj.MessagesBox.style.display = "none";
  }
}


// ************************************************
// Tick dell'animazione di apertura/chiusura modale
// ************************************************
GFX.prototype.ModalTick = function(perc)
{
  if (this.Flin)
  {
    // Animazione di apertura modale
    // TL: e' sufficiente cambiare le dimensioni
    var s = this.Obj.PopupFrame.PopupBox.style;
    s.width = (perc*this.Obj.FormWidth) + "px";
    s.height = (perc*this.Obj.FormHeight) + "px";
    //
    // TR: sposto il left per compensare la nuova larghezza
    if (this.Tipo == "point-tr")
    {
      s.left = ((this.Obj.FormLeft+this.Obj.FormWidth)-perc*this.Obj.FormWidth) + "px";
    }
    //
    // BL: sposto il top per compensare la nuova altezza
    if (this.Tipo == "point-bl")
    {
      s.top = ((this.Obj.FormTop+this.Obj.FormHeight)-perc*this.Obj.FormHeight) + "px";
    }
    //
    // BR: sposto top e left per compensare la nuova altezza e larghezza
    if (this.Tipo == "point-br")
    {
      s.top = ((this.Obj.FormTop+this.Obj.FormHeight)-perc*this.Obj.FormHeight) + "px";
      s.left = ((this.Obj.FormLeft+this.Obj.FormWidth)-perc*this.Obj.FormWidth) + "px";
    }
    if (this.Tipo == "zoom")
    {
      var lf = 0;
      if (this.TargetX<=this.Obj.FormLeft)
        lf = this.TargetX + (this.Obj.FormLeft-this.TargetX)*perc;
      else
        lf = this.TargetX -(this.TargetX-this.Obj.FormLeft)*perc;
      //
      var tp = 0;
      if (this.TargetY<=this.Obj.FormTop)
        tp = this.TargetY + (this.Obj.FormTop-this.TargetY)*perc;
      else
        tp = this.TargetY - (this.TargetY-this.Obj.FormTop)*perc;
      //
      s.top = tp + "px";
      s.left = lf + "px";
      //
      if (RD3_Glb.IsIE(10, false))
        s.filter = "filter: alpha(opacity = "+Math.floor(perc*100)+");";
      else
        s.opacity = perc;
    }
  }
  else
  {
    // Animazione di chiusura modale
    // TL: e' sufficiente cambiare le dimensioni
    var s = this.Obj.PopupFrame.PopupBox.style;
    s.width = (1-perc)*this.Obj.FormWidth+"px";
    s.height = (1-perc)*this.Obj.FormHeight+"px";
    //
    // TR: Sposto il left per compensare la larghezza persa
    if (this.Tipo == "point-tr")
    {
      s.left = (this.Obj.FormLeft + perc*this.Obj.FormWidth) + "px";
    }
    //
    // BL: sposto il top per compensare l'altezza persa
    if (this.Tipo == "point-bl")
    {
      s.top = (this.Obj.FormTop + perc*this.Obj.FormHeight) + "px";
    }
    //
    // BR: sposto top e left per compensare l'altezza e la larghezza perse
    if (this.Tipo == "point-br")
    {
      s.top = (this.Obj.FormTop + perc*this.Obj.FormHeight) + "px";
      s.left = (this.Obj.FormLeft + perc*this.Obj.FormWidth) + "px";
    }
    if (this.Tipo == "zoom")
    {
      var lf = 0;
      if (this.Obj.FormLeft<=this.TargetX)
        lf = this.Obj.FormLeft + (this.TargetX-this.Obj.FormLeft)*perc;
      else
        lf = this.Obj.FormLeft - (this.Obj.FormLeft-this.TargetX)*perc;
      //
      var tp = 0;
      if (this.Obj.FormTop<=this.TargetY)
        tp = this.Obj.FormTop + (this.TargetY-this.Obj.FormTop)*perc;
      else
        tp = this.Obj.FormTop - (this.Obj.FormTop-this.TargetY)*perc;
      //
      s.top = tp + "px";
      s.left = lf + "px";
      //
      if (RD3_Glb.IsIE(10, false))
        s.filter = "filter: alpha(opacity = "+Math.floor(100 - (perc*100))+");";
      else
        s.opacity = 1 - perc;
    }
  }
}


// ************************************************
// Fine dell'animazione di apertura/chiusura modale
// ************************************************
GFX.prototype.ModalFinish = function()
{
  // Dico alle form che la loro animazione e' finita
  this.Obj.Animating = false;
  //
  // Reimposto il display e la posizione corretti in caso di animazione di apertura
  if (this.Flin)
  {
    if (this.ObjOv)
      this.Obj.PopupFrame.PopupBox.style.overflow = this.ObjOv;
    else
      this.Obj.PopupFrame.PopupBox.style.overflow = "";
    //
    if (!this.Skipped)
    {
      // Reimposto le posizioni corrette.. senza far scattare le animazioni pero'!!
      this.Obj.SetFormLeft(null, true);
      this.Obj.SetFormTop(null, true);
      this.Obj.SetFormWidth(null, true);
      this.Obj.SetFormHeight(null, true);
    }
    else
      this.Obj.PopupFrame.SetVisible(true);
    //
    // In caso webkit, resetto la trasformazione
    if (this.IsWebKit)
      this.Obj.PopupFrame.PopupBox.style.webkitTransform = "scale(1.0) translateX(0px) translateY(0px)";
    //
    this.Obj.AlreadyVisible = true;
  }
  //
  // Rimuovo il fading applicato se Zoom
  if (this.Tipo == "zoom")
  {
    if (RD3_Glb.IsIE(10, false))
      this.Obj.PopupFrame.PopupBox.style.removeAttribute("filter");
    else
      this.Obj.PopupFrame.PopupBox.style.opacity=1;
    //
    // Mostro le immagini della caption che avevo nascosto
    this.Obj.SetButtonVisibility("");    
    //
    // Mostro anche il FramesBox e i messaggi che avevo nascosto
    this.Obj.FramesBox.style.display = "";
    if (!this.CloseFormAnimation)
      this.Obj.FramesBox.style.visibility = "";
    this.Obj.MessagesBox.style.display = "";
  }
  //
  if (this.Flin)
  {
    // Faccio l'adapt per mostrare correttamente i campi e i messaggi.. (solo se animazione di ingresso)
    // Faccio l'adapt se ho skippato l'animazione oppure se per qualche motivo la form attiva non sono io
    var mustadapt = false;
    var f = RD3_DesktopManager.WebEntryPoint.ActiveForm;
    if ((f && f!=this.Obj) || (this.Durata==0))
      mustadapt = true;
    //
    RD3_DesktopManager.WebEntryPoint.HandleFinishFormAnimation(mustadapt);
    //
    // Se ho una gestione di fuoco lato server che non ho potuto fare perche' mi stavo animando
    if (RD3_GFXManager.ModalFocusFldId && RD3_GFXManager.ModalFocusFldId != "")
    {
      RD3_DesktopManager.HandleFocus2(RD3_GFXManager.ModalFocusFldId, RD3_GFXManager.ModalFocusFldRow);
      //
      RD3_GFXManager.ModalFocusFldId = "";
      RD3_GFXManager.ModalFocusFldRow = 0;
    }
    else if (this.Flin.Modal != 0)
    {
      // Ho aperto una modale ma il server non ha gestito il fuoco, mi devo percio' assicurare di togliere il fuoco da
      // un eventuale campo fuocato in una form sottostante
      RD3_KBManager.ActiveObject = null;
      RD3_KBManager.LastActiveObject = null;
      RD3_KBManager.ActiveElement = null;
      document.body.focus();
      RD3_KBManager.CheckFocus = true;
    }
  }
  else
  {
    // Se sono una animazione di chiusura form devo fare l'unrealize della form ed eliminarla dallo stack
    // (dallo stack lo rimuove la close delle modali.. -> wep.CloseForm)
    if (this.CloseFormAnimation)
    {
      RD3_DesktopManager.WebEntryPoint.CompleteCloseFormAnimation(this.Obj, false);
    }  
    else
    {
      // Se devo solo nascondere la form allora rimetto a posto l'overflow
      if (this.ObjOv)
        this.Obj.PopupFrame.PopupBox.style.overflow = this.ObjOv;
      else
        this.Obj.PopupFrame.PopupBox.style.overflow = "";
      //
      this.Obj.AlreadyVisible = false;
      this.Obj.PopupFrame.SetVisible(false);
    }
    //
    // Gestisco il pulsante chiudi tutto
    RD3_DesktopManager.WebEntryPoint.HandleCloseAllVisibility();
  }
}


// ************************************************
// Inizio di una animazione di Lista/Dettaglio
// ************************************************
GFX.prototype.ListStart = function()
{
  // Animazione del passaggio da Lista/Dettaglio e viceversa, animazioni supportate:
  // Fade, Scroll, Fold : Flin = true : Lista -> Dettaglio, false: Lista <- Dettaglio 
  // L'oggetto passato e' il Pannello
  // Devo avere tutti e due i layout per l'animazione: se non li ho passo subito in stato finale..
  if (!this.Obj.ListBox || !this.Obj.FormBox)
  {
    this.SetFinished();
    return;
  }
  if ((this.Flin && this.Obj.FormBox.style.display!="none") || (!this.Flin && this.Obj.ListBox.style.display!="none"))
  {
    // Il Layout che mi e' chiesto e' gia' visibile: vado subito in stato finale..
    this.SetFinished();
    return;
  }
  //
  // Rendo visibili tutti e due i Layout
  this.Obj.ListBox.style.display = "";
  this.Obj.FormBox.style.display = "";
  //
  // Bug di IE: devo forzare usando anche la visibility
  if (RD3_Glb.IsIE())
  {
    this.Obj.ListBox.style.visibility = "";
    this.Obj.FormBox.style.visibility = "";
  }
  //
  this.Obj.AnimatingPanel = true;
  var rec = this.Obj.RecalcLayout;
  this.Obj.AdaptLayout();
  this.StartDate = new Date(); // Istante iniziale : lo reimposto perche' l'adapt e' lento..
  this.Obj.RecalcLayout = rec;
  //
  // Impostazioni specifiche per tipo di animazione
  if (this.Tipo == "fade")
  {
    // Se devo passare in dettaglio do' opacita' 0 al dettaglio e 100 alla lista
    if (this.Flin) 
    {
      if (RD3_Glb.IsIE(10, false))
        this.Obj.FormBox.style.filter = "filter: alpha(opacity = 0);";
      else
        this.Obj.FormBox.style.opacity = 0;
      //
      if (RD3_Glb.IsIE(10, false))
        this.Obj.ListBox.style.filter = "filter: alpha(opacity = 100);";
      else
        this.Obj.ListBox.style.opacity = 1;
    }
    else
    {
      // Se devo passare in lista do' opacita' 0 alla lista e 100 al dettaglio
      if (RD3_Glb.IsIE(10, false))
        this.Obj.FormBox.style.filter = "filter: alpha(opacity = 100);";
      else
        this.Obj.FormBox.style.opacity = 1;
      //
      if (RD3_Glb.IsIE(10, false))
        this.Obj.ListBox.style.filter = "filter: alpha(opacity = 0);";
      else
        this.Obj.ListBox.style.opacity = 0;
    }
  }
  if (this.Tipo == "scroll-h")
  {
    // Metto l'overflow hidden al content box
    this.XOver = this.Obj.ContentBox.style.overflowX;
    this.YOver = this.Obj.ContentBox.style.overflowY;
    this.Obj.ContentBox.style.overflowX = "hidden";
    this.Obj.ContentBox.style.overflowY = "hidden";
    //
    // Leggo la dimensione orizzontale di cui scrollare
    this.ObjH = this.Obj.ContentBox.offsetWidth;
    //
    // Posiziono i Div nelle posizioni giuste
    if (this.Flin)
    {
      // Posiziono il dettaglio sulla destra
      if (this.WillBeWebKit())
      {
        this.Obj.FormBox.style.webkitTransform = "translateX("+this.ObjH+"px)";
        this.ObjH = -this.ObjH;
      }
      else
        this.Obj.FormBox.style.left= this.ObjH + "px";
      //
      this.Obj.ListBox.style.left= "0px";
    }
    else
    {
      // Posiziono la lista sulla sinista
      if (this.WillBeWebKit())
        this.Obj.ListBox.style.webkitTransform = "translateX(-"+this.ObjH+"px)";
      else
        this.Obj.ListBox.style.left= "-" + this.ObjH + "px";
      //
      this.Obj.FormBox.style.left= "0px";
    }
  }
  //
  if (this.Tipo == "scroll-v")
  {
    // Metto l'overflow hidden al content box
    this.XOver = this.Obj.ContentBox.style.overflowX;
    this.YOver = this.Obj.ContentBox.style.overflowY;
    this.Obj.ContentBox.style.overflowX = "hidden";
    this.Obj.ContentBox.style.overflowY = "hidden";
    //
    // Leggo la dimensione verticale di cui scrollare
    this.ObjH = this.Obj.ContentBox.offsetHeight;
    //
    // Posiziono i Div nelle posizioni giuste
    if (this.Flin)
    {
      // Posiziono il dettaglio sotto
      this.Obj.FormBox.style.top= this.ObjH + "px";
      this.Obj.ListBox.style.top= "0px";
    }
    else
    {
      // Posiziono la lista sopra
      this.Obj.ListBox.style.top= "-" + this.ObjH + "px";
      this.Obj.FormBox.style.top= "0px";
    }
  }
  //
  if (this.Tipo == "fold-h")
  {
    // Mi memorizzo le dimensioni attuali degli elementi
    this.FormW = this.Obj.FormBox.offsetWidth;
    this.ListW = this.Obj.ListBox.offsetWidth;
    //
    // Leggo la dimensione orizzontale a cui arrivare
    this.ObjH = this.Obj.ContentBox.offsetWidth;
    //
    if (this.Flin)
    {
      // Posiziono il dettaglio sulla destra e gli metto larghezza 0
      this.Obj.FormBox.style.left= this.ObjH + "px";
      this.Obj.FormBox.style.width= "0px";
      this.Obj.ListBox.style.left= "0px";
    }
    else
    {
      // Posiziono la lista sulla sinistra e gli metto larghezza 0
      this.Obj.ListBox.style.width= "0px";
      this.Obj.FormBox.style.left= "0px";
    }
  }
  //
  if (this.Tipo == "fold-v")
  {
    // Mi memorizzo le dimensioni attuali degli elementi
    this.FormH = this.Obj.FormBox.offsetHeight;
    this.ListH = this.Obj.ListBox.offsetHeight;
    //
    // Leggo la dimensione verticale a cui arrivare
    this.ObjH = this.Obj.ContentBox.offsetHeight;
    //
    if (this.Flin)
    {
      // Posiziono il dettaglio sotto e gli metto altezza 0
      this.Obj.FormBox.style.top= this.ObjH + "px";
      this.Obj.FormBox.style.height= "0px";
      this.Obj.ListBox.style.top= "0px";
    }
    else
    {
      // Posiziono la lista sopra e gli metto altezza 0
      this.Obj.ListBox.style.height= "0px";
      this.Obj.FormBox.style.top= "0px";
    }
  }
}


// ************************************************
// Tick di una animazione di Lista/Dettaglio
// ************************************************
GFX.prototype.ListTick = function(perc)
{
  if (this.Tipo == "fade")
  {
    // Uso un Fade in due Fasi: nel primo 50% faccio il fading out, nel restante faccio il fading In
    if (this.Flin)
    {
      if (perc<0.5)
      {
        // Faccio il fading out della lista, raddoppiando la percentuale..
        if (RD3_Glb.IsIE(10, false))
          this.Obj.ListBox.style.filter = "filter: alpha(opacity = "+Math.floor(100-((perc*2)*100))+");";
        else
          this.Obj.ListBox.style.opacity = 1 - (perc*2);
      }
      else
      {
        // Faccio il fading in del dettaglio: per sicurezza forzo a 0 la lista..
        if (RD3_Glb.IsIE(10, false))
          this.Obj.ListBox.style.filter = "filter: alpha(opacity = 0);";
        else
          this.Obj.ListBox.style.opacity = 0;
        //
        if (RD3_Glb.IsIE(10, false))
          this.Obj.FormBox.style.filter = "filter: alpha(opacity = "+Math.floor(perc*100)+");";
        else
          this.Obj.FormBox.style.opacity = perc;
      }
    }
    else
    {
      if (perc<0.5)
      {
        // Faccio il fading out del dettaglio, raddoppiando la percentuale..
        if (RD3_Glb.IsIE(10, false))
          this.Obj.FormBox.style.filter = "filter: alpha(opacity = "+Math.floor(100-((perc*2)*100))+");";
        else
          this.Obj.FormBox.style.opacity = 1 - (perc*2);
      }
      else
      {
        // Faccio il fading in della lista: per sicurezza forzo a 0 il dettaglio..
        if (RD3_Glb.IsIE(10, false))
          this.Obj.FormBox.style.filter = "filter: alpha(opacity = 0);";
        else
          this.Obj.FormBox.style.opacity = 0;
        //
        if (RD3_Glb.IsIE(10, false))
          this.Obj.ListBox.style.filter = "filter: alpha(opacity = "+Math.floor(perc*100)+");";
        else
          this.Obj.ListBox.style.opacity = perc;
      }
    }
  }
  //
  if (this.Tipo == "scroll-h")
  {
    if (this.Flin)
    {
      this.Obj.FormBox.style.left = this.ObjH*(1-perc) + "px";
      this.Obj.ListBox.style.left = 0 - this.ObjH*perc + "px";
    }
    else
    {
      this.Obj.FormBox.style.left = this.ObjH*perc + "px";
      this.Obj.ListBox.style.left = 0 - this.ObjH*(1-perc) + "px";
    }
  }
  //
  if (this.Tipo == "scroll-v")
  {
    if (this.Flin)
    {
      this.Obj.FormBox.style.top = this.ObjH*(1-perc) + "px";
      this.Obj.ListBox.style.top = 0 - this.ObjH*perc + "px";
    }
    else
    {
      this.Obj.FormBox.style.top = this.ObjH*perc + "px";
      this.Obj.ListBox.style.top = 0 - this.ObjH*(1-perc) + "px";
    }
  }
  //
  if (this.Tipo == "fold-h")
  {
    if (this.Flin)
    {
      // Restringo la lista
      this.Obj.ListBox.style.width= this.ObjH - (perc*this.ObjH) + "px";
      //
      // Allargo il dettaglio e lo sposto indietro per riprendere lo spazio
      this.Obj.FormBox.style.width = (perc*this.ObjH) + "px";
      this.Obj.FormBox.style.left = this.ObjH - (perc*this.ObjH) + "px";
    }
    else
    {
      // Allargo la lista
      this.Obj.ListBox.style.width = (perc*this.ObjH) + "px";
      //
      // Restringo il dettaglio e lo sposto a sinistra
      this.Obj.FormBox.style.width = this.ObjH - (perc*this.ObjH) + "px";
      this.Obj.FormBox.style.left = (perc*this.ObjH) + "px";
    }
  }
  //
  if (this.Tipo == "fold-v")
  {
    if (this.Flin)
    {
      // Restringo la lista
      this.Obj.ListBox.style.height= this.ObjH - (perc*this.ObjH) + "px";
      //
      // Allargo il dettaglio e lo sposto sopra per riprendere lo spazio
      this.Obj.FormBox.style.height = (perc*this.ObjH) + "px";
      this.Obj.FormBox.style.top = this.ObjH - (perc*this.ObjH) + "px";
    }
    else
    {
      // Allargo la lista
      this.Obj.ListBox.style.height = (perc*this.ObjH) + "px";
      //
      // Restringo il dettaglio e lo sposto sotto
      this.Obj.FormBox.style.height = this.ObjH - (perc*this.ObjH) + "px";
      this.Obj.FormBox.style.top = (perc*this.ObjH) + "px";
    }
  }
}


// ************************************************
// Fine di una animazione di Lista/Dettaglio
// ************************************************
GFX.prototype.ListFinish = function()
{
  // Impostazione per webkit
  if (this.ObjH<0)
    this.ObjH = -this.ObjH;
  //
  // Ora rendo visibile il layout giusto
  if (this.Obj.HasList && this.Obj.ListBox)
  {
    var s = this.Obj.ListBox.style;
    s.display = (this.Obj.PanelMode==RD3_Glb.PANEL_LIST) ? "" : "none";
    //
    // Tolgo il filtro del fading
    if (RD3_Glb.IsIE(10, false))
      s.removeAttribute("filter");
    else
      s.opacity=1;
    //
    // Rimetto le posizioni giuste
    if (this.IsWebKit)
      s.webkitTransform = "";
    s.left = "";
    s.top = "";
    //
    // Ripristino le dimensioni giuste
    if (this.Tipo == "fold-h" && this.ListW)
    {
      s.width = this.ListW + "px";
    }
    if (this.Tipo == "fold-v" && this.ListH)
    {
      s.height = this.ListH + "px";
    }
    //
    // Correggo un baco di Firefox: cosi' lo forzo a mettere gli oggetti al posto giusto, altrimenti dopo un folding
    // i pannelli vanno in posizioni sbagliate
    s.position = "static";
    s.position = "";
    this.Obj.ListBox.scrollTop = "0px";
  }
  if (this.Obj.HasForm && this.Obj.FormBox)
  {
    var s = this.Obj.FormBox.style;
    s.display = (this.Obj.PanelMode==RD3_Glb.PANEL_FORM) ? "" : "none";
    //
    // Tolgo il filtro del fading
    if (RD3_Glb.IsIE(10, false))
      s.removeAttribute("filter");
    else
      s.opacity=1;
    //
    // Posiziono correttamente gli oggetti
    if (this.IsWebKit)
      s.webkitTransform = "";
    s.left = "";
    s.top = "";
    //
    // Rimetto le dimensioni giuste
    if (this.Tipo == "fold-h" && this.FormW)
    {
      s.width = this.FormW + "px";
    }
    if (this.Tipo == "fold-v" && this.FormH)
    {
      s.height = this.FormH + "px";
    }
    //
    // Correggo un baco di Firefox: cosi' lo forzo a mettere gli oggetti al posto giusto, altrimenti dopo un folding
    // i pannelli vanno in posizioni sbagliate
    s.position = "static";
    s.position = "";
    this.Obj.FormBox.scrollTop = "0px";
  }
  //
  // Ripristino gli overflow corretti
  var cs = this.Obj.ContentBox.style;
  if (this.XOver)
    cs.overflowX = this.XOver;
  else
    cs.overflowX = "";
  //
  if (this.YOver)
    cs.overflowY = this.YOver;
  else
    cs.overflowY = "";
  //
  this.Obj.AnimatingPanel = false;
  //
  // Al termine devo adattare il layout e mostrare i valori se arrivo qui in maniera immediata
  // Non spingo un SetActual qui perche' chi la usa in modo immediato
  // deve poi farlo lui e sarebbe una duplicazione
  if (this.Durata == 0 || this.Tipo == "none")
  {
    if (this.Immediate)
      this.Obj.AdaptLayout();
    else
      this.Obj.RecalcLayout = true;
  }
  //
  // A volte, sembra non bastare l'impostazione della proprieta' style.display...
  // Occorre forzare! (e' un bug di IE)
  if (RD3_Glb.IsIE())
  {
    if (this.Obj.PanelMode==RD3_Glb.PANEL_LIST && !this.Obj.Realizing)
    {
      this.Obj.FormBox.style.visibility = "hidden";
      this.Obj.ListBox.style.visibility = "";
    }
    if (this.Obj.PanelMode==RD3_Glb.PANEL_FORM && !this.Obj.Realizing)
    {
      this.Obj.FormBox.style.visibility = "";
      this.Obj.ListBox.style.visibility = "hidden";
    }
  }
  //
  this.Obj.ResetPosition = true;
  this.Obj.RefreshToolbar = true;
}


// ************************************************
// Inizio di una animazione di cambio Tab
// ************************************************
GFX.prototype.TabStart = function()
{
  this.FirstTick = true;
}


// ************************************************
// Tick di una animazione di cambio Tab
// ************************************************
GFX.prototype.TabTick = function(perc)
{
  // Nel primo tick eseguo l'impostazione iniziale
  if (this.FirstTick)
  {
    this.FirstTick = false;
    //
    this.TabFirstTick();
  }
  else  // Nei tick successivi eseguo la vera e propria animazione
  {
    this.TabAnimationTick(perc);
  }
}


// ***********************************************************************
// Primo Tick di una animazione di Tab: esegue lo start dell'animazione,
// lo abbiamo spostato qui perche' cosi' parte a bocce ferme, quando le 
// proprieta' degli oggetti sono state gia' cambiate
// **********************************************************************
GFX.prototype.TabFirstTick = function()
{
  // Il tab prevede fade, scroll e fold (solo orizzontale), per lo scroll e fold la direzione (da destra a sinistra 
  // o viceversa) e' data da this.Flin: true da sx -> dx, false da sx <- dx
  // Rendo visibili entrambe le pagine
  this.Obj.ContentBox.style.display = "";
  this.ObjOut.ContentBox.style.display = "";
  //
  // Impostazioni iniziali a seconda dell'animazione da applicare
  if (this.Tipo == "fade")
  {
    // Nascondo la tab da fare entrare
    if (RD3_Glb.IsIE(10, false))
      this.Obj.ContentBox.style.filter = "filter: alpha(opacity = 0);";
    else
      this.Obj.ContentBox.style.opacity = 0;
    //
    // Mostro la tab da nascondere
    if (RD3_Glb.IsIE(10, false))
      this.ObjOut.ContentBox.style.filter = "filter: alpha(opacity = 100);";
    else
      this.ObjOut.ContentBox.style.opacity = 1;
  }
  if (this.Tipo == "scroll-h")
  {
    // Leggo la dimensione di cui scrollare
    this.ObjW = this.Obj.TabView.ContentBox.offsetWidth;
    //
    // In base alla direzione posiziono la nuova tab a destra o sinistra
    if (this.Flin)
    {
      // Posiziono la nuova Tab a sinistra
      if (this.WillBeWebKit())
        this.Obj.ContentBox.style.webkitTransform = "translateX(-"+this.ObjW + "px)";
      else
        this.Obj.ContentBox.style.left = "-" + this.ObjW + "px";
    }
    else
    {
      // Posiziono la nuova Tab a destra
      if (this.WillBeWebKit())
      {
        this.Obj.ContentBox.style.webkitTransform = "translateX("+this.ObjW + "px)";
        this.ObjW = -this.ObjW;
      }
      else
        this.Obj.ContentBox.style.left = this.ObjW + "px";
    }
  }
  if (this.Tipo == "fold-h")
  {
    // Leggo la dimensione massima da raggiungere
    this.ObjW = this.Obj.TabView.ContentBox.offsetWidth;
    //
    if (this.Flin)
    {
      // Per fare adattare correttamente i campi senza sfarfallamenti posiziono temporaneamente la nuova tab in un punto invisibile e
      // non ne modifico le dimensioni: dopo aver fatto l'adattamento la posiziono nel punto giusto e cambio la dimensione
      this.Obj.ContentBox.style.left = "-" + this.ObjW + "px";
    }
    else
    {
      // La nuova tab va posizionata a destra con dimensione 0: non modifico ora la dimensione se no l'adapt impazzisce: lo faccio dopo
      // (il posizionamento invece lo faccio ora cosi' evito sfarfallamenti)
      this.Obj.ContentBox.style.left = this.ObjW + "px";
    }
  }
  //
  // Eseguo il rendering/adapt iniziale
  if (!this.Obj.Content.Realized)
  {
    this.Obj.Content.Realize(this.Obj.ContentBox);
    //
    // Faccio fare l'adaptlayout sulla tabbed, in modo da dimensionarla correttamente..
    this.Obj.AdaptLayout();
    //
    // Se la tab che sto facendo entrare non e' ancora selezionata il suo adaptLayout non fa partire quello del contenuto,
    // in questo caso lo faccio io
    if (!this.Obj.Selected)
      this.Obj.Content.AdaptLayout();
    //
    // Se ho appena fatto realizzare una subform mi occupo degli eventuali comandi o timer che erano saltati
    if (this.Obj.Content instanceof SubForm) {
      RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveFormChanged();
      RD3_DesktopManager.WebEntryPoint.IndObj.ActiveFormChanged();
      RD3_DesktopManager.WebEntryPoint.TimerObj.ActiveFormChanged();
    }
  }
  else
  {
    // Il contenuto era gia' stato realizzato precedentemente... quindi posso adattare il suo
    // layout senza problemi...
    // Effettuo subito il ricalcolo cosi' a video vedo immediatamente il frame gia' ridimensionato
    // (Solo se la form e' stata gia' realizzata: altrimenti l'adapt potrebbe dare errore)
    if (this.Obj.TabView.WebForm.Realized && this.Obj.Realized)
      this.Obj.Content.AdaptLayout();
  }
  this.StartDate = new Date(); // Istante iniziale : lo reimposto perche' l'adapt/realize e' lento..
  //
  if (this.Tipo == "fold-h")
  {
    if (this.Flin)
    {
      // La nuova Tab va posizionata a sinistra con dimensione 0
      this.Obj.ContentBox.style.left = "0px";
      this.Obj.ContentBox.style.width = "0px";
    }
    else
    {
      // La nuova tab va posizionata a destra con dimensione 0
      this.Obj.ContentBox.style.width = "0px";
    }
  }
}


// ************************************************
// Tick successivo al primo dell'animazione di Tab:
// e' la vera e propria animazione..
// ************************************************
GFX.prototype.TabAnimationTick = function(perc)
{
  if (this.Tipo == "fade")
  {
    if (perc<0.4)
    {
      // Faccio il fading out della tab visibile, raddoppiando la percentuale..
      if (RD3_Glb.IsIE(10, false))
        this.ObjOut.ContentBox.style.filter = "filter: alpha(opacity = "+Math.floor(100-((perc*2)*100))+");";
      else
        this.ObjOut.ContentBox.style.opacity = 1 - (perc*2);
    }
    else
    {
      // Faccio il fading in della tab selezionata
      var oph = 1 - (perc*2);
      oph = oph<0 ? 0 : oph;
      if (RD3_Glb.IsIE(10, false))
        this.ObjOut.ContentBox.style.filter = "filter: alpha(opacity = "+oph*100+");";
      else
        this.ObjOut.ContentBox.style.opacity = oph;
      //
      if (RD3_Glb.IsIE(10, false))
        this.Obj.ContentBox.style.filter = "filter: alpha(opacity = "+Math.floor(perc*100)+");";
      else
        this.Obj.ContentBox.style.opacity = perc;
    }
  }
  if (this.Tipo == "scroll-h")
  {
    if (this.Flin)
    {
      // Sposto la Tab vecchia a destra
      this.ObjOut.ContentBox.style.left = (perc * this.ObjW) + "px";
      //
      // Sposto la nuova Tab a destra
      this.Obj.ContentBox.style.left = 0 - ((1-perc) * this.ObjW) + "px";
    }
    else
    {
      // Sposto a sinistra la tab vecchia
      this.ObjOut.ContentBox.style.left = 0 - (perc * this.ObjW) + "px";
      //
      // Sposto a sinistra la tab nuova
      this.Obj.ContentBox.style.left = ((1-perc) * this.ObjW) + "px";
    }
  }
  if (this.Tipo == "fold-h")
  {
    if (this.Flin)
    {
      // Riduco la dimensione della tab vecchia e la sposto a destra
      this.ObjOut.ContentBox.style.width = ((1-perc) * this.ObjW)+ "px";
      this.ObjOut.ContentBox.style.left = (perc * this.ObjW) + "px";
      //
      // Allargo la tab nuova
      this.Obj.ContentBox.style.width = (perc * this.ObjW) + "px";
    }
    else
    {
      // Riduco la dimensione della Tab vecchia
      this.ObjOut.ContentBox.style.width = ((1-perc) * this.ObjW)+ "px";
      //
      // Allargo la tab nuova e la sposto a sinistra
      this.Obj.ContentBox.style.width = (perc * this.ObjW) + "px";
      this.Obj.ContentBox.style.left = ((1-perc) * this.ObjW)+ "px";
    }
  }
}


// ************************************************
// Fine di una animazione di cambio Tab
// ************************************************
GFX.prototype.TabFinish = function()
{
  // Per webkit, ObjW puo' essere negatvo
  if (this.ObjW<0)
    this.ObjW = - this.ObjW;
  //
  // Imposto il display e la posizione corretti
  var obs = this.Obj.ContentBox.style;
  if (this.IsWebKit)
    obs.webkitTransform = "";
  obs.left = "";  
  obs.display = "";
  if (this.ObjW)
    obs.width = this.ObjW + "px";
  //
  // Tolgo il filtro del fading
  if (RD3_Glb.IsIE(10, false))
    obs.removeAttribute("filter");
  else
    obs.opacity=1;
  //
  // Impostazioni finali
  this.Obj.SelectPage(true);
  //
  if (this.ObjOut && this.ObjOut != this.Obj)
  {
    var obos = this.ObjOut.ContentBox.style;
    //
    // Nascondo la tab vecchia e imposto la posizione corretta
    obos.display = "none";
    obos.left = "";
    if (this.IsWebKit)
      obos.webkitTransform = "";
    //
    if (this.ObjW)
      obos.width = this.ObjW + "px";
    //
    // Tolgo l'attributo per il fading
    if (RD3_Glb.IsIE(10, false))
      obos.removeAttribute("filter");
    else
      obos.opacity=1;
    //
    // Deseleziono la tab
    this.ObjOut.SelectPage(false);
  }
  //
  if (this.Durata == 0 || this.Tipo == "none")
  {
    var screenTabbed = false;
    if (this.Obj.TabView.Identifier.indexOf("scz")>-1)
      screenTabbed = true;
    //
    // Eseguo il rendering/adapt iniziale che non avevo fatto perche' ho saltato lo start
    if (!this.Obj.Content.Realized)
    {
      if (!screenTabbed) {
        this.Obj.Content.Realize(this.Obj.ContentBox);
        //
        // Se ho appena fatto realizzare una subform mi occupo degli eventuali comandi o timer che erano saltati
        if (this.Obj.Content instanceof SubForm) {
          RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveFormChanged();
          RD3_DesktopManager.WebEntryPoint.IndObj.ActiveFormChanged();
          RD3_DesktopManager.WebEntryPoint.TimerObj.ActiveFormChanged();
        }
      }
    }
    else
    {
      // Il contenuto era gia' stato realizzato precedentemente... quindi posso adattare il suo
      // layout senza problemi...
      // Effettuo subito il ricalcolo cosi' a video vedo immediatamente il frame gia' ridimensionato
      // (Solo se la form e' stata gia' realizzata: altrimenti l'adapt potrebbe dare errore)
      if (this.Obj.TabView.WebForm.Realized && this.Obj.Realized)
        this.Obj.Content.AdaptLayout();
    }
  }
}


// ************************************************
// Start dell'animazione di apertura popup menu
// ************************************************
GFX.prototype.PopupStart = function()
{
  // L'animazione del popup menu ha due possibilita': Folding: apertura chiusura vedendo sempre il sopra, 
  // scrolling: apertura/chiusura vedendo sempre il fondo
  //
  // Nello start non facciamo nulla: passiamo al prossimo tick in modo da avere i comandi con gia' i valori corretti
  this.FirstTick = true;
}


// ************************************************
// Tick dell'animazione di apertura popup menu
// ************************************************
GFX.prototype.PopupTick = function(perc)
{
  // Nel primo tick facciamo quello che avremmo fatto nello start
  if (this.FirstTick)
  {
    this.FirstTick = false;
    //
    // in apertura devo far realizzare il popup menu
    if (this.Flin)
      this.Obj.RealizePopup(this.Node);
    //
    // Memorizzo la dimensione da raggiungere/originale
    var h = this.Obj.PopupContainerBox.offsetHeight;
    this.ObjH = h>5 ? h-5 : h;
    this.ObjT = this.Obj.PopupContainerBox.offsetTop;
    //
    if (this.Flin)
    {
      // Se sono in apertura metto a 0 l'altezza del menu
      this.Obj.PopupContainerBox.style.height = "0px";
      //
      // Se il menu e' sopra l'oggetto devo aprirlo facendo scorrere dal basso : sposto il top fino in fondo
      if (this.Obj.Direction == 3)
      {
        this.Obj.PopupContainerBox.style.top = this.ObjT + this.ObjH + "px";
      }
    }
    //
    if (this.Tipo == "scroll")
      this.Obj.PopupContainerBox.style.overflow = "hidden";
  }
  else
  {
    if (this.Tipo == "fold")
    {
      if (this.Flin)
      {
        this.Obj.PopupContainerBox.style.height = (perc*this.ObjH) + "px";
        //
        // Sposto il Top in alto
        if (this.Obj.Direction == 3)
        {
          this.Obj.PopupContainerBox.style.top = this.ObjT + this.ObjH - (perc*this.ObjH) + "px";
        }
      }
      else
      {
        this.Obj.PopupContainerBox.style.height = ((1-perc)*this.ObjH) + "px";
        //
        // Sposto il Top in basso, per chiuderlo verso il basso
        if (this.Obj.Direction == 3)
        {
          this.Obj.PopupContainerBox.style.top = this.ObjT + this.ObjH - ((1-perc)*this.ObjH) + "px";
        }
      }
    }
    if (this.Tipo == "scroll")
    {
      if (this.Flin)
      {
        this.Obj.PopupContainerBox.style.height = (perc*this.ObjH) + "px";
        this.Obj.PopupContainerBox.scrollTop = Math.floor((1-perc)*this.ObjH);
        //
        // Sposto il Top in alto
        if (this.Obj.Direction == 3)
        {
          this.Obj.PopupContainerBox.style.top = this.ObjT + this.ObjH - (perc*this.ObjH) + "px";
        }
      }
      else
      {
        this.Obj.PopupContainerBox.style.height = ((1-perc)*this.ObjH) + "px";
        this.Obj.PopupContainerBox.scrollTop =  Math.floor(perc*this.ObjH);
        //
        // Sposto il Top in basso, per chiuderlo verso il basso
        if (this.Obj.Direction == 3)
        {
          this.Obj.PopupContainerBox.style.top = this.ObjT + this.ObjH - ((1-perc)*this.ObjH) + "px";
        }
      }
    }
  }
}


// ************************************************
// Fine dell'animazione di apertura popup menu
// ************************************************
GFX.prototype.PopupFinish = function()
{
  // Se sono arrivato qui senza aver fatto lo start allora eseguo la realizzazione del popup menu (se sono un animazione di ingresso)
  if ((this.Durata == 0 || this.Tipo == "none") && this.Flin)
    this.Obj.RealizePopup(this.Node);
  //
  if (this.Flin)
  {
    if (this.Obj.PopupContainerBox)
    {
      this.Obj.PopupContainerBox.style.height = "";
      //
      if (this.Tipo == "scroll")
        this.Obj.PopupContainerBox.style.overflow = "";
    }
    //
    this.Obj.Gfx = null;
  }
  else
  {
    // Tolgo il box dal DOM
    if (this.Obj.PopupContainerBox)
    {
      this.Obj.PopupContainerBox.parentNode.removeChild(this.Obj.PopupContainerBox);
      this.Obj.PopupContainerBox = null;
    }
    //
    this.Obj.IsClosing = false;
    this.Obj.Gfx = null;
  }
}


// **************************************************
// Inizio dell'animazione di cambio immagine grafico
// **************************************************
GFX.prototype.GraphStart = function()
{
  // Flin = true: animazione tra due immagini, false: animazione da una immagine a nessuna immagine
  // Creo un clone dell'immagine vecchia
  this.OldImg =this.Obj.Img.cloneNode(true);
  //
  // Assegno ad entrambe le immagini un posizionamento assoluto
  this.Obj.Img.style.position = "absolute";
  this.OldImg.style.position = "absolute";
  //
  // Appendo il clone dopo l'immagine originale, in modo da coprirla
  this.Obj.Img.parentNode.appendChild(this.OldImg);
  //
  // Metto l'overflow hidden al contenitore del grafico
  this.OvX = this.Obj.ContentBox.style.overflowX;
  this.OvY = this.Obj.ContentBox.style.overflowY;
  this.Obj.ContentBox.style.overflowX = "hidden";
  this.Obj.ContentBox.style.overflowY = "hidden";
  //
  // Impostazioni specifiche per il tipo di animazione
  if (this.Tipo == "fade")
  {
    if (this.Flin)
    {
      // SU IE la vecchia immagine e' subito disponibile, quindi posso partire subito con l'animazione, sugli altri browser devo tenere
      // l'immagine precedente fino a quando il clone non e' stato caricato, poi posso pertire con l'animazione
      if (RD3_Glb.IsIE(10, false))
      {
        this.Obj.Img.style.filter = "filter: alpha(opacity = 0);";
        this.Obj.Img.src = this.Obj.File;
      }
      else
      {
        this.OldImg.style.opacity = 0;
        this.FirstTick = true;
        this.FirstStartDate = this.StartDate;
      }
    }
  }
  //
  this.StartDate = new Date(); // Istante iniziale : lo reimposto per dare fluidita' all'animazione
}


// **************************************************
// Tick dell'animazione di cambio immagine grafico
// **************************************************
GFX.prototype.GraphTick = function(perc)
{
  // Sugli altri browser devo aspettare che il clone sia stato caricato per iniziare l'animazione
  if (this.FirstTick)
  {
    if (this.Tipo == "fade")
    {
      // Se il clone e' stato caricato procedo con l'animazione: cambio l'url all'immagine originale e la rendo completamente
      // trasparente; adesso posso mostrare il clone che e' stato caricato
      if (this.OldImg.complete)
      {
        this.FirstTick = false;
        this.Obj.Img.src = this.Obj.File;
        if (this.Flin)
        {
          // Assegno opacita' 0 alla nuova immagine
          if (RD3_Glb.IsIE(10, false))
          {
            this.Obj.Img.style.filter = "filter: alpha(opacity = 0);";
            this.OldImg.style.filter = "filter: alpha(opacity = 1);";
          }
          else
          {
            this.Obj.Img.style.opacity = 0;
            this.OldImg.style.opacity = 1;
          }
        }
      }
      else
      {
        this.StartDate = new Date();
        //
        // Se ho superato la durata prevista ed il clone non e' ancora stato caricato 
        // finisco l'animazione: altrimenti rischio il loop..
        if (this.StartDate-this.FirstStartDate>this.Durata)
        {
          this.StartDate = this.FirstStartDate;
          this.Obj.Img.src = this.Obj.File;
        }
      }
    }
  }
  else
  {
    if (this.Tipo == "fade")
    {
      if (this.Flin)
      {
        // Faccio il fading out della vecchia ed il fading in della nuova
        if (RD3_Glb.IsIE(10, false))
          this.OldImg.style.filter = "filter: alpha(opacity = "+Math.floor((1-(perc))*100)+");";
        else
          this.OldImg.style.opacity = 1-perc;
        //
        if (RD3_Glb.IsIE(10, false))
          this.Obj.Img.style.filter = "filter: alpha(opacity = "+Math.floor((perc)*100)+");";
        else
          this.Obj.Img.style.opacity = perc;
      }
      else
      {
        // Faccio il fading out della vecchia immagine
        if (RD3_Glb.IsIE(10, false))
          this.OldImg.style.filter = "filter: alpha(opacity = "+Math.floor((1-perc)*100)+");";
        else
          this.OldImg.style.opacity = 1-perc;
      }
    }
  }
}


// **************************************************
// Fine dell'animazione di cambio immagine grafico
// **************************************************
GFX.prototype.GraphFinish = function()
{
  // Tolgo la vecchia immagine dal Dom (se esiste)
  if (this.OldImg && this.OldImg.parentNode)
  {
    this.OldImg.parentNode.removeChild(this.OldImg);
    this.OldImg = null;
  }
  //
  // Cambio l'url dell'immagine se non l'ho fatto nello start
  if (this.Durata == 0 || this.Tipo == "none")
  {
    this.Obj.Img.src = this.Obj.File;
  }
  //
  // Tolgo il filtro dalla immagine del grafico
  if (RD3_Glb.IsIE(10, false))
    this.Obj.Img.style.removeAttribute("filter");
  else
    this.Obj.Img.style.opacity=1;
  //
  // Tolgo il posizionamento assoluto dall'immagine
  this.Obj.Img.style.position = "";
  //
  // Se non c'e' nessuna immagine nascondo l'oggetto
  this.Obj.Img.style.visibility = (this.Obj.File == "") ? "hidden" : "";
  //
  // Ripristino l'overflow corretto
  this.Obj.ContentBox.style.overflowX = this.OvX ? this.OvX : "";
  this.Obj.ContentBox.style.overflowY = this.OvY ? this.OvY : "";
}


// **************************************************
// Start dell'animazione delle pagine del book
// **************************************************
GFX.prototype.BookStart = function()
{
  // Se non ho nessun oggetto da animare finisco subito l'animazione
  if (!this.Obj && !this.ObjOut)
  {
    this.SetFinished();
    return; 
  }
  //
  // Metto a hidden l'overflow del contenitore delle pagine,  selezionando l'oggetto disponibile
  this.ParentStyle = this.Obj ? this.Obj.ParentBook.ContentBox.style : this.ObjOut.ParentBook.ContentBox.style;
  this.OverX =  this.ParentStyle.overflowX;
  this.OverY =  this.ParentStyle.overflowY;
  this.ParentStyle.overflowX = "hidden";
  this.ParentStyle.overflowY = "hidden";
  //
  // Rendo visibili le pagine
  if (this.Obj)
  {
    this.ObjStyle = this.Obj.PageBox.style;
    this.ObjStyle.display = "";
    this.ObjStyle.zIndex = "20"; // Alzo l'indice della in ingresso, in modo che sia sempre visibile sopra quella vecchia e quella entrante
  }
  if (this.ObjOut)
  {
    this.ObjOutStyle = this.ObjOut.PageBox.style;
    this.ObjOutStyle.display = "";
    this.ObjOutStyle.zIndex = "19";
  }
  //
  // Se non ho mai fatto l'adapt iniziale lo faccio ora, in modo da fare comparire la pagina gia' con le box posizionate
  if (this.Obj && !this.Obj.Adapted)
    this.Obj.AdaptLayout();
  // 
  // Impostazioni specifiche per animazione
  if (this.Tipo == "fade")
  {
    // Metto a 0 l'opacita' della pagina da fare entrare e a 1 quella della pagina da fare uscire (se c'e')
    if (this.Obj)
    {
      if (RD3_Glb.IsIE(10, false))
        this.ObjStyle.filter = "filter: alpha(opacity = 0);";
      else
        this.ObjStyle.opacity = 0;
    }
    //
    if (this.ObjOut)
    {
      if (RD3_Glb.IsIE(10, false))
        this.ObjOutStyle.filter = "filter: alpha(opacity = 100);";
      else
        this.ObjOutStyle.opacity = 1;
    }
  }
  //
  if (this.Tipo == "fold")
  {
    // Leggo le dimensioni degli oggetti
    var newpgw = this.Obj ? this.Obj.PageBox.offsetWidth : this.ObjOut.PageBox.offsetWidth;
    var oldpgw = this.ObjOut ? this.ObjOut.PageBox.offsetWidth : newpgw;
    //
    // Supportiamo il fold solo se le due pagine hanno la stessa dimensione, altrimenti viene male..
    if (newpgw == oldpgw)
    {
      // Leggo la dimensione da raggiungere
      this.ObjW = this.Obj ? this.Obj.PageBox.offsetWidth : this.ObjOut.PageBox.offsetWidth;
      //
      if (this.Obj)
      {
        // Metto a hidden l'overflow delle pagine
        this.NewPagOv = this.ObjStyle.overflow;
        this.ObjStyle.overflow = "hidden";
        //
        if (this.Flin)
        {
          // Posiziono la nuova pagina a sinistra con dimensione 0
          this.ObjStyle.left = "0px";
        }
        else
        {
          // Posiziono la nuova pagina a destra con dimensione 0
          this.ObjStyle.left = (this.ObjOutW ? this.ObjOutW : this.ObjW) + "px";
        }
        //
        this.ObjStyle.width = "0px";
      }
      if (this.ObjOut)
      {
        this.OldPagOv = this.ObjOutStyle.overflow;
        this.ObjOutStyle.overflow = "hidden";
        this.ObjOutW = this.ObjOut.PageBox.offsetWidth;
      }
    }
    else
    {
      this.Tipo = "scroll";
    }
  }
  //
  if (this.Tipo == "scroll")
  {
    // Leggo le dimensioni degli oggetti coinvolti
    var bookw = this.Obj ? this.Obj.ParentBook.ContentBox.offsetWidth : this.ObjOut.ParentBook.ContentBox.offsetWidth;
    var newpgw = this.Obj ? this.Obj.PageBox.offsetWidth : this.ObjOut.PageBox.offsetWidth;
    var oldpgw = this.ObjOut ? this.ObjOut.PageBox.offsetWidth : newpgw;
    //
    // Decido la dimensione di cui scrollare
    // Se entrambe le pagine sono piu' piccole del book scrollo della dimensione del book
    if (newpgw<bookw  && oldpgw<bookw)
    {
      this.ObjW = bookw;
    }
    else
    {
      // Se devo scrollare da sinistra la dimensione di cui scrollare e' quella nuova, altrimenti e' quella vecchia
      this.ObjW = this.Flin ? newpgw : oldpgw;
    }
    //
    if (this.Obj)
    {
      if (this.Flin)
      {
        // Posiziono la nuova pagina a sinistra
        if (this.WillBeWebKit())
          this.ObjStyle.webkitTransform = "translateX(-" + this.ObjW + "px)";
        else
          this.ObjStyle.left = "-" + this.ObjW + "px";
      }
      else
      {
        // Posiziono la nuova pagina a destra
        if (this.WillBeWebKit())
        {
          this.ObjStyle.webkitTransform = "translateX(" + this.ObjW + "px)";
          this.ObjW = -this.ObjW;
        }
        else
          this.ObjStyle.left = this.ObjW + "px";
      }
    }
  }
  //
  this.StartDate = new Date(); // Istante iniziale : lo reimposto per dare fluidita' all'animazione
}


// **************************************************
// Tick dell'animazione delle pagine del book
// **************************************************
GFX.prototype.BookTick = function(perc)
{
  if (this.Tipo == "fade")
  {
    var percout = perc;
    var percin = perc;
    //
    // Se ho una pagina da nascondere per la prima parte della transizione nascondo lei e basta
    if (this.ObjOut)
    {
      percout = 1-(perc);
    }
    //
    if (this.Obj)
    {
      if (RD3_Glb.IsIE(10, false))
        this.ObjStyle.filter = "filter: alpha(opacity = "+(percin*100)+");";
      else
        this.ObjStyle.opacity = percin;
    }
    //
    if (this.ObjOut)
    {
      if (RD3_Glb.IsIE(10, false))
        this.ObjOutStyle.filter = "filter: alpha(opacity = "+(percout*100)+");";
      else
        this.ObjOutStyle.opacity = percout;
    }
  }
  if (this.Tipo == "scroll")
  {
    if (this.Flin)
    {
      // Sposto a destra la vecchia pagina se c'e'
      if (this.ObjOut)
      {
        this.ObjOutStyle.left = (this.ObjW*perc) + "px";
      }
      //
      // Sposto a destra la nuova pagina
      if (this.Obj)
        this.ObjStyle.left = 0 - (this.ObjW * (1-perc)) + "px";
    }
    else
    {
      // Sposto a sinistra la vecchia pagina (se presente)
      if (this.ObjOut)
      {
        this.ObjOutStyle.left = 0 - (this.ObjW*perc) + "px";
      }
      // Sposto a sinistra la nuova pagina
      if (this.Obj)
        this.ObjStyle.left = this.ObjW * (1-perc) + "px";
    }
  }
  if (this.Tipo == "fold")
  {
    if (this.Flin)
    {
      // Allargo la nuova pagina a sinistra
      if (this.Obj)
        this.ObjStyle.width = (perc*this.ObjW) + "px";
      //
      // Restringo la vecchia pagina e la sposto a destra
      if (this.ObjOut)
      {
        this.ObjOutStyle.width = ((1-perc)*this.ObjW) + "px";
        this.ObjOutStyle.left = (perc*this.ObjW) + "px";
      }
    }
    else
    {
      // Allargo la nuova pagina e la sposto a sinistra
      if (this.Obj)
      {
        this.ObjStyle.width = (perc*this.ObjW) + "px";
        this.ObjStyle.left = ((1-perc)*this.ObjW) + "px";
      }
      //
      // Restringo la vecchia pagina
      if (this.ObjOut)
        this.ObjOutStyle.width = ((1-perc)*this.ObjW) + "px";
    }
  }
}


// **************************************************
// Fine dell'animazione delle pagine del book
// **************************************************
GFX.prototype.BookFinish = function()
{
  // Se non ho nessun oggetto da animare finisco subito l'animazione
  if (!this.Obj && !this.ObjOut)
    return; 
  //
  // Se sono arrivato qui senza aver fatto lo start accedo agli stili che mi servono
  if (!this.ParentStyle)
    this.ParentStyle = this.Obj ? this.Obj.ParentBook.ContentBox.style : this.ObjOut.ParentBook.ContentBox.style;
  if (!this.ObjStyle && this.Obj)
    this.ObjStyle = this.Obj.PageBox.style;
  if (!this.ObjOutStyle && this.ObjOut)
    this.ObjOutStyle = this.ObjOut.PageBox.style;
  //
  if (this.ObjOut)
  {
    // Nascondo la vecchia pagina
    this.ObjOut.SetActive(false);
    //
    // Tolgo il filtro
    if (RD3_Glb.IsIE(10, false))
      this.ObjOutStyle.removeAttribute("filter");
    else
      this.ObjOutStyle.opacity=1;
    //
    this.ObjOutStyle.zIndex = "";
    this.ObjOutStyle.left = "";
    if (this.IsWebKit)
      this.ObjOutStyle.webkitTransform = "";
    //
    this.ObjOutStyle.overflow = this.OldPagOv ? this.OldPagOv : "";
    if (this.ObjOutW)
      this.ObjOutStyle.width = this.ObjOutW;
  }
  //
  if (this.Obj)
  {
    // Tolgo il filtro
    if (RD3_Glb.IsIE(10, false))
      this.ObjStyle.removeAttribute("filter");
    else
      this.ObjStyle.opacity=1;
    //
    this.ObjStyle.zIndex = "";
    this.ObjStyle.left = "";
    if (this.IsWebKit)
      this.ObjStyle.webkitTransform = "";
    this.ObjStyle.overflow = this.NewPagOv ? this.NewPagOv : "";
    //
    if (this.UnrealizeOnFinish)
    {
      // In questo caso Obj non e' la vera pagina: durante l'animazione il server ne ha mandata un altra che ha preso il suo posto,
      // Obj quindi alla fine dell'animazione deve scomparire e fare comparire la pagina vera.. pero' devo fare adattare la pagina vera prima di cancellare
      // la vecchia copia, altrimenti per un istante compare la pagina bianca..
      var ps = this.Obj.ParentBook.Pages[this.Obj.ParentBook.SelectedPage];
      ps.SetActive(true);
      ps.AdaptLayout();
      //
      this.Obj.UnrealizeDelayed();
    }
    else
    {
      // Mostro la pagina
      this.Obj.SetActive(true);
    }
  }
  //
  // Ripristino l'overflow del book
  this.ParentStyle.overflowX = this.OverX ? this.OverX : "";
  this.ParentStyle.overflowY = this.OverY ? this.OverY : "";
  //
  // Aggiorno la caption del book
  var parbook = this.Obj ? this.Obj.ParentBook : this.ObjOut.ParentBook;
  parbook.SetCaption();
  parbook.AnimatingNum = null;
  parbook.Fx = null;
  //
  // Annullo i riferimenti
  this.ParentStyle = null;
  this.ObjStyle = null;
  this.ObjOutStyle = null;
  this.Obj = null;
  this.ObjOut = null;
}


// **************************************************
// Inizio dell'animazione dei messaggi di form
// **************************************************
GFX.prototype.MessageStart = function()
{
  if ((this.NewHeight == this.OldHeight) || this.Obj.Animating)
  {
    this.SetFinished();
    return;
  }
}


// **************************************************
// Tick dell'animazione dei messaggi di form
// **************************************************
GFX.prototype.MessageTick = function(perc)
{
  if (this.Flin)
  {
    this.Obj.MessagesBox.style.height = this.OldHeight + perc*(this.NewHeight-this.OldHeight) + "px";
    //
    RD3_Glb.AdaptToParent(this.Obj.FramesBox, 0, this.Obj.CaptionBox.offsetHeight + this.Obj.MessagesBox.offsetHeight);
  }
  else
  {
    this.Obj.MessagesBox.style.height = this.OldHeight - perc*(this.OldHeight-this.NewHeight) + "px";
    //
    RD3_Glb.AdaptToParent(this.Obj.FramesBox, 0, this.Obj.CaptionBox.offsetHeight + this.Obj.MessagesBox.offsetHeight);
  }
}


// **************************************************
// Fine dell'animazione dei messaggi di form
// **************************************************
GFX.prototype.MessageFinish = function()
{
  var stmsgbx = this.Obj.MessagesBox.style;
  stmsgbx.height = this.NewHeight + "px";
  //
  // Se e' alta 0 devo togliere anche il bordo, se no c'e' una riga di troppo..
  stmsgbx.borderBottomWidth = this.NewHeight==0 ? "0px" : "";
  //
  // Adatto il FramesBox alla fine
  if (this.NewHeight != this.OldHeight && this.Obj.Realized && !this.Obj.Animating)
  {
    var oox = "";
    var ooy = "";
    //
    // Su Safari e Chrome tolgo le scrollbar al FrameBox prima di farlo adattare e poi rimetto l'overflow corretto, in questo modo lo costringo 
    // a toglierle veramente, altrimenti per un suo baco rimangono anche se il frame ci sta completamente
    if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
    {
      oox = this.Obj.FramesBox.style.overflowX;
      ooy = this.Obj.FramesBox.style.overflowY;
      this.Obj.FramesBox.style.overflowX = "hidden";
      this.Obj.FramesBox.style.overflowY = "hidden";
    }
    //
    RD3_Glb.AdaptToParent(this.Obj.FramesBox, 0, this.Obj.CaptionBox.offsetHeight + this.Obj.MessagesBox.offsetHeight);
    //
    if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
    {
      this.Obj.FramesBox.style.overflowX = oox;
      this.Obj.FramesBox.style.overflowY = ooy;  
    }
  }
}


// ***************************************************************
// Inizio dell'animazione di fading out dell'ultimo messaggio
// ***************************************************************
GFX.prototype.LastMessageStart = function()
{
  
}


// ***************************************************************
// Tick dell'animazione di fading out dell'ultimo messaggio
// ***************************************************************
GFX.prototype.LastMessageTick = function(perc)
{
  if (RD3_Glb.IsIE(10, false))
    this.Obj.MyBox.style.filter = "filter: alpha(opacity = "+Math.floor((1-perc)*100)+");";
  else
    this.Obj.MyBox.style.opacity = 1-perc;
}


// ***************************************************************
// Fine dell'animazione di fading out dell'ultimo messaggio
// ***************************************************************
GFX.prototype.LastMessageFinish = function()
{
  this.Obj.Unrealize();
}


// ***************************************************************
// Start dell'animazione di redirect dell'applicazione
// ***************************************************************
GFX.prototype.RedirectStart = function()
{
  
}


// ***************************************************************
// Tick dell'animazione di redirect dell'applicazione
// ***************************************************************
GFX.prototype.RedirectTick = function(perc)
{
  if (RD3_Glb.IsIE(10, false))
    document.body.style.filter = "filter: alpha(opacity = "+Math.floor(100 -(perc*100))+");";
  else
    document.body.style.opacity = 1 - perc;
}


// ***************************************************************
// Fine dell'animazione di redirect dell'applicazione
// ***************************************************************
GFX.prototype.RedirectFinish = function()
{
  // Chiudo la finestra se mi sono arrivati !!! 
  if (this.Url == "!!!")
  {
    // Usiamo qualche trucco
    if (RD3_Glb.IsIE())
      window.open('','_parent','');   // IE non chiede piu' conferma
    else if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
      window.open('', '_self', '');   // Chrome e Safari chiudono la pagina
    //
    window.close();
    return;
  }
  document.location.assign(this.Url);
}


// ***************************************************************
// Start dell'animazione di comparsa o scomparsa del preview Frame
// ***************************************************************
GFX.prototype.PreviewStart = function()
{
  // Accedo agli stili necessari all'animazione
  if (this.Obj.Frames[0].FrameBox)
  {
    this.FrSty = this.Obj.Frames[0].FrameBox.style;
  }
  else
  {
    this.Fr1sty = this.Obj.Frames[0].ChildBox1.style;
    this.Fr2sty = this.Obj.Frames[0].ChildBox2.style;
  }
  this.Presty = this.Obj.PreviewFrame.FrameBox.style;
  //
  // Animazione di ingresso
  if (this.Flin)
  {
    // Per prima cosa rendo visibile il contenuto originale e lo sovrappongo alla preview
    if (this.Obj.Frames[0].FrameBox)
    {
      this.FrSty.display = "";
    }
    else
    {
      this.Fr1sty.display = "";
      this.Fr2sty.display = "";
    }
    //
    if (this.Tipo == "fade")
    {
      // Posiziono in alto il previewframe
      this.Presty.top = "0px";
      //
      // Metto al Preview Frame Opacita' 0 per renderlo invisibile
      if (RD3_Glb.IsIE(10, false))
        this.Presty.filter = "filter: alpha(opacity = 0);";
      else
        this.Presty.opacity = 0;
    }
    //
    if (this.Tipo == "scroll")
    {
      // Posiziono in alto il previewframe
      this.Presty.top = (RD3_ServerParams.Theme.startsWith("zen") ? 2 : 0) + "px";
      //
      // Modifico la toolbar: la posiziono in alto e con zindex 10 in modo che il contenuto gli passi sotto 
      // e non sopra
      this.ToolSty = this.Obj.PreviewFrame.ToolbarBox.style;
      this.ToolSty.zIndex = 10;
      this.ToolSty.position = "absolute";
      this.ToolSty.top = "0px";
      this.ToolH = this.Obj.PreviewFrame.ToolbarBox.offsetHeight;
      //
      // In ingresso posiziono il preview frame sopra il contenuto originale
      this.ObjH = this.Obj.PreviewFrame.ContentBox.offsetHeight;
      //
      // Accedo allo stile del contenuto : faro' lo scroll di quello
      this.Presty = this.Obj.PreviewFrame.ContentBox.style;
      //
      this.Presty.top = "-" + (this.ObjH + this.ToolH)  + "px";
      this.Ofx = this.Presty.overflowX;
      this.Ofy = this.Presty.overflowY;
      //
      // Tolgo la scrollbar se no su ffx viene male
      this.Presty.overflowX = "hidden";
      this.Presty.overflowY = "hidden";
      //
      this.Presty.backgroundColor = RD3_Glb.GetStyleProp(this.Obj.FormBox, "backgroundColor");
    }
    //
    if (this.Tipo == "fold")
    {
      // Posiziono in alto il previewframe
      this.Presty.top = "0px";
      //
      // Leggo la dimensione da raggiungere
      this.ObjH = this.Obj.PreviewFrame.ContentBox.offsetHeight;
      //
      // Accedo allo stile del contenuto : faro' il fold di quello
      this.Presty = this.Obj.PreviewFrame.ContentBox.style;
      //
      // Metto a 0 l'altezza del contenuto
      this.Presty.height = "0px";
      //
      this.Presty.backgroundColor = RD3_Glb.GetStyleProp(this.Obj.FormBox, "backgroundColor");
    }
  }
  else  // Animazione di uscita
  {
    // Per prima cosa rendo visibile il contenuto originale
    if (this.Obj.Frames[0].FrameBox)
    {
      this.FrSty.display = "";
    }
    else
    {
      this.Fr1sty.display = "";
      this.Fr2sty.display = "";
    }
    //
    if (this.Tipo == "fade")
    {
      // Mantengo posizionato in alto il previewframe
      this.Presty.top = "0px";
      //
      // Nascondo il contenuto originario
      if (this.Obj.Frames[0].FrameBox)
      {
        if (RD3_Glb.IsIE(10, false))
          this.FrSty.filter = "filter: alpha(opacity = 0);";
        else
          this.FrSty.opacity = 0;
      }
      else
      {
        if (RD3_Glb.IsIE(10, false))
        {
          this.Fr1sty.filter = "filter: alpha(opacity = 0);";
          this.Fr2sty.filter = "filter: alpha(opacity = 0);";
        }
        else
        {
          this.Fr1sty.opacity = 0;
          this.Fr2sty.opacity = 0;
        }
      }
    }
    //
    if (this.Tipo == "scroll")
    {
      // Sposto il contenuto e non la toolbar!
      this.Presty = this.Obj.PreviewFrame.ContentBox.style;
      //
      // Modifico la toolbar: la posiziono in alto e con zindex 10 in modo che il contenuto gli passi sotto 
      // e non sopra
      this.ToolSty = this.Obj.PreviewFrame.ToolbarBox.style;
      this.ToolSty.zIndex = 10;
      this.ToolSty.position = "absolute";
      this.ToolSty.top = "0px";
      this.ToolH = this.Obj.PreviewFrame.ToolbarBox.offsetHeight;
      //
      // Leggo la dimensione del Preview Frame
      this.ObjH = this.Obj.PreviewFrame.ContentBox.offsetHeight;
      //
      this.Ofx = this.Presty.overflowX;
      this.Ofy = this.Presty.overflowY;
      //
      // Tolgo la scrollbar se no su ffx viene male
      this.Presty.overflowX = "hidden";
      this.Presty.overflowY = "hidden";
      //
      this.Presty.backgroundColor = RD3_Glb.GetStyleProp(this.Obj.FormBox, "backgroundColor");
    }
    //
    if (this.Tipo == "fold")
    {
      // Posiziono in alto il previewframe
      this.Presty.top = "0px";
      //
      // Leggo la dimensione attuale
      this.ObjH = this.Obj.PreviewFrame.ContentBox.offsetHeight;
      //
      // Accedo allo stile del contenuto : faro' il fold di quello
      this.Presty = this.Obj.PreviewFrame.ContentBox.style;
      //
      this.Presty.backgroundColor = RD3_Glb.GetStyleProp(this.Obj.FormBox, "backgroundColor");
    }
  }  
}


// ***************************************************************
// Tick dell'animazione di comparsa o scomparsa del preview Frame
// ***************************************************************
GFX.prototype.PreviewTick = function(perc)
{  
  if (this.Tipo == "fade")
  {
    if (this.Flin)
    {
      // Aumento la visibilita' del PreviewFrame
      if (RD3_Glb.IsIE(10, false))
        this.Presty.filter = "filter: alpha(opacity = " + 100*perc + ");";
      else
        this.Presty.opacity = perc;
      //
      // Nascondo gli altri frame
      if (this.Obj.Frames[0].FrameBox)
      {
        if (RD3_Glb.IsIE(10, false))
          this.FrSty.filter = "filter: alpha(opacity = " + (100 - (100*perc)) + ");";
        else
          this.FrSty.opacity = 1 - perc;
      }
      else
      {
        if (RD3_Glb.IsIE(10, false))
        {
          this.Fr1sty.filter = "filter: alpha(opacity = " + (100 - (100*perc)) + ");";
          this.Fr2sty.filter = "filter: alpha(opacity = " + (100 - (100*perc)) + ");";
        }
        else
        {
          this.Fr1sty.opacity = 1 - perc;
          this.Fr2sty.opacity = 1 - perc;
        }
      }
    }
    else
    {
      // Diminuisco la visibilita' del PreviewFrame
      if (RD3_Glb.IsIE(10, false))
        this.Presty.filter = "filter: alpha(opacity = " + (100 - (100*perc)) + ");";
      else
        this.Presty.opacity = 1 - perc;
      //
      // Mostro gli altri frame
      if (this.Obj.Frames[0].FrameBox)
      {
        if (RD3_Glb.IsIE(10, false))
          this.FrSty.filter = "filter: alpha(opacity = " + 100*perc + ");";
        else
          this.FrSty.opacity = perc;
      }
      else
      {
        if (RD3_Glb.IsIE(10, false))
        {
          this.Fr1sty.filter = "filter: alpha(opacity = " + 100*perc + ");";
          this.Fr2sty.filter = "filter: alpha(opacity = " + 100*perc + ");";
        }
        else
        {
          this.Fr1sty.opacity = perc;
          this.Fr2sty.opacity = perc;
        }
      }
    }
  }
  //
  if (this.Tipo == "scroll")
  {
    if (this.Flin)
    {
      this.Presty.top = ((0 - ((1-perc)*this.ObjH)) + this.ToolH) + "px";
    }
    else
    {
      this.Presty.top = ((0 - (perc*this.ObjH)) + this.ToolH) + "px";
    }
  }
  //
  if (this.Tipo == "fold")
  {
    if (this.Flin)
    {
      this.Presty.height = (perc*this.ObjH) + "px";
    }
    else
    {
      this.Presty.height = (this.ObjH - (perc*this.ObjH)) + "px";
    }
  }
}


// ***************************************************************
// Fine dell'animazione di comparsa o scomparsa del preview Frame
// ***************************************************************
GFX.prototype.PreviewFinish = function()
{
  if (this.Durata == 0 || this.Tipo == "none")
  {
    // Ho saltato lo start: accedo qui a tutti gli stili necessari
    if (this.Obj.Frames[0].FrameBox)
    {
      this.FrSty = this.Obj.Frames[0].FrameBox.style;
    }
    else
    {
      this.Fr1sty = this.Obj.Frames[0].ChildBox1.style;
      this.Fr2sty = this.Obj.Frames[0].ChildBox2.style;
    }
    //
    if (this.Tipo == "fade") 
      this.Presty = this.Obj.PreviewFrame.FrameBox.style;
    else
      this.Presty = this.Obj.PreviewFrame.ContentBox.style;
    //
    this.ToolSty = this.Obj.PreviewFrame.ToolbarBox.style;
    this.ToolH = this.Obj.PreviewFrame.ToolbarBox.offsetHeight;
  }
  //
  //
  if (this.IsWebKit)
    this.Obj.PreviewFrame.ContentBox.style.webkitTransform = "";
  //
  if (this.Flin)
  {
    // Nascondo gli altri frame
    if (this.Obj.Frames[0].FrameBox)
    {
      this.FrSty.display = "none";
    }
    else
    {
      this.Fr1sty.display = "none";
      this.Fr2sty.display = "none";
    }
    //
    if (this.Tipo == "fade")
    {
      // Rimuovo l'opacita' ed i filtri da tutti gli elementi
      if (RD3_Glb.IsIE(10, false))
        this.Presty.removeAttribute("filter");
      else
        this.Presty.opacity=1;
      //
      if (this.Obj.Frames[0].FrameBox)
      {
        if (RD3_Glb.IsIE(10, false))
          this.FrSty.removeAttribute("filter");
        else
          this.FrSty.opacity=1;
      }
      else
      {
        if (RD3_Glb.IsIE(10, false))
        {
          this.Fr1sty.removeAttribute("filter");
          this.Fr2sty.removeAttribute("filter");
        }
        else
        {
          this.Fr1sty.opacity=1;
          this.Fr2sty.opacity=1;
        }
      }
    }
    //
    if (this.Tipo == "scroll")
    {
      if (this.Ofx)
        this.Presty.overflowX = this.Ofx;
      if (this.Ofy)
        this.Presty.overflowY = this.Ofy;
      this.Presty.top = this.ToolH + "px";
      this.Presty.backgroundColor = "";
      //
      this.ToolSty.zIndex = 0;
      this.ToolSty.position = "";
      this.ToolSty.top = "";
    }
    //
    if (this.Tipo == "fold")
    {
      this.Presty.backgroundColor = "";
    }
    //
    this.Obj.RecalcLayout = false;
  }
  else
  {
    // Faccio riapparire il frame zero
    if (this.Obj.Frames[0].FrameBox)
    {
      this.Obj.Frames[0].FrameBox.style.display = "";
    }
    else
    {
      this.Obj.Frames[0].ChildBox1.style.display = "";
      this.Obj.Frames[0].ChildBox2.style.display = "";
    }
    //
    // Distruggo il form di preview
    this.Obj.PreviewFrame.Unrealize();
    //
    // Lo tolgo dall'array dei frames
    var n = this.Obj.Frames.length;
    for (var i=0;i<n;i++)
    {
      if (this.Obj.Frames[i]==this.Obj.PreviewFrame)
      {
        this.Obj.Frames.splice(i,1);
        break;
      }
    }
    //
    this.Obj.PreviewFrame = null;
    //
    if (this.Tipo == "fade")
    {
      // Rimuovo l'opacita' ed i filtri da tutti gli elementi
      if (this.Obj.Frames[0].FrameBox)
      {
        if (RD3_Glb.IsIE(10, false))
          this.FrSty.removeAttribute("filter");
        else
          this.FrSty.opacity=1;
      }
      else
      {
        if (RD3_Glb.IsIE(10, false))
        {
          this.Fr1sty.removeAttribute("filter");
          this.Fr2sty.removeAttribute("filter");
        }
        else
        {
          this.Fr1sty.opacity=1;
          this.Fr2sty.opacity=1;
        }
      }
    }
  }
  //
  // Ora rimuovo tutti i riferimenti..
  this.Presty = null;
  this.FrSty = null;
  this.Fr1sty = null;
  this.Fr2sty = null;
}


// **************************************************
// Start dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.DockedStart = function()
{
  // Per prima cosa faccio adattare la docked in modo da sapere la dimensione corretta (solo se e' un animazione di apertura)
  if (this.Flin)
  {
    this.Obj.SetActive(true,true);
    //
    // Rendo visibile la docked (senza far scattare animazioni innestate!)
    this.Obj.SetVisible(true, false);
    this.Obj.AdaptDocked();
    this.Obj.AdaptLayout();
  }
  //
  // Su FFX non supportiamo lo scroll.. non riesce a gestire bene lo scrolltop, manda in crash tutto..
  if (RD3_Glb.IsFirefox(3) && this.Tipo == "scroll")
    this.Tipo = "fold";
  //
  // Leggo la dimensione che mi interessa a seconda della posizione della Docked e la dimensione totale dello spazio per le Form
  this.Wep = RD3_DesktopManager.WebEntryPoint;
  if (this.Obj.DockType==RD3_Glb.FORMDOCK_LEFT)
  {
    this.ObjD = this.Wep.LeftDockedBox.offsetWidth;
    this.TotalD = this.Wep.WepBox.clientWidth - ((this.Wep.HasSideMenu())?this.Wep.SideMenuBox.offsetWidth:0) - this.Wep.RightDockedBox.offsetWidth;
  }
  if (this.Obj.DockType==RD3_Glb.FORMDOCK_TOP)
  {
    this.ObjD = this.Wep.TopDockedBox.offsetHeight;
    this.TotalD = this.Wep.WepBox.clientHeight - this.Wep.StatusBarBox.offsetHeight - this.Wep.ToolBarBox.offsetHeight - this.Wep.HeaderBox.offsetHeight - this.Wep.BottomDockedBox.offsetHeight;
  }
  if (this.Obj.DockType==RD3_Glb.FORMDOCK_RIGHT)
  {
    this.ObjD = this.Wep.RightDockedBox.offsetWidth;
    this.TotalD = this.Wep.WepBox.clientWidth - ((this.Wep.HasSideMenu())?this.Wep.SideMenuBox.offsetWidth:0) - this.Wep.LeftDockedBox.offsetWidth;
  }
  if (this.Obj.DockType==RD3_Glb.FORMDOCK_BOTTOM)
  {
    this.ObjD = this.Wep.BottomDockedBox.offsetHeight;
    this.TotalD = this.Wep.WepBox.clientHeight - this.Wep.StatusBarBox.offsetHeight - this.Wep.ToolBarBox.offsetHeight - this.Wep.HeaderBox.offsetHeight - this.Wep.TopDockedBox.offsetHeight;
  }
  //
  // Calcolo il top ed il left dell'area destinata a contenere le form
  this.FormsTop = this.Wep.StatusBarBox.offsetHeight+this.Wep.ToolBarBox.offsetHeight+this.Wep.HeaderBox.offsetHeight + (this.Obj.DockType==RD3_Glb.FORMDOCK_TOP ? 0 : this.Wep.TopDockedBox.offsetHeight);
  this.FormsLeft = ((this.Wep.HasSideMenu())?this.Wep.SideMenuBox.offsetWidth:0);
  //
  this.Wep.RecalcLayout = false;
  //
  if (this.Flin)  // Entrata
  {
    this.Wep.FormsBox.style.left = this.FormsLeft+(this.Obj.DockType==RD3_Glb.FORMDOCK_LEFT ? 0 : this.Wep.LeftDockedBox.offsetWidth)+"px";
    this.Wep.FormsBox.style.top = this.FormsTop+"px";
    //
    this.Wep.LeftDockedBox.style.top = this.FormsTop + "px";
    this.Wep.RightDockedBox.style.top = this.FormsTop + "px";
    //
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_LEFT)
    {
      this.Wep.LeftDockedBox.style.width = "0px";
      this.Wep.LeftDockedBox.style.top = this.FormsTop + "px";
      this.Wep.LeftDockedBox.style.left = this.FormsLeft + "px";
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_TOP)
    {
      this.Wep.TopDockedBox.style.height = "0px";
      this.Wep.TopDockedBox.style.top = this.FormsTop + "px";
      this.Wep.TopDockedBox.style.left = this.FormsLeft + "px";
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_RIGHT)
    {
      this.Wep.RightDockedBox.style.width = "0px";
      this.Wep.RightDockedBox.style.top = this.FormsTop + "px";
      this.Wep.RightDockedBox.style.left = (this.Wep.WepBox.clientWidth) + "px";
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_BOTTOM)
    {
      this.Wep.BottomDockedBox.style.height = "0px";
      this.Wep.BottomDockedBox.style.top = (this.Wep.WepBox.clientHeight) + "px";
      this.Wep.BottomDockedBox.style.left = this.FormsLeft + "px";
    }
  }
}


// **************************************************
// Tick dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.DockedTick = function(perc)
{
  if (this.Flin)  // Entrata
  {
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_LEFT)
    {
      var w = this.ObjD*perc;
      //
      this.Wep.LeftDockedBox.style.width = w + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      this.Wep.FormsBox.style.left = (this.FormsLeft + w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.LeftDockedBox.scrollLeft = this.ObjD - w;
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_TOP)
    {
      var h = this.ObjD*perc;
      //
      this.Wep.TopDockedBox.style.height = h + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.FormsBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.LeftDockedBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.RightDockedBox.style.top = (this.FormsTop + h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.TopDockedBox.scrollTop = this.ObjD - h;
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_RIGHT)
    {
      var w = this.ObjD*perc;
      //
      this.Wep.RightDockedBox.style.width = w + "px";
      this.Wep.RightDockedBox.style.left = (this.Wep.WepBox.clientWidth - w) + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.RightDockedBox.scrollLeft = 0;
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_BOTTOM)
    {
      var h = this.ObjD*perc;
      //
      this.Wep.BottomDockedBox.style.height = h + "px";
      this.Wep.BottomDockedBox.style.top = (this.Wep.WepBox.clientHeight - h) + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.LeftDockedBox.style.height = (this.TotalD - h) +"px";
      this.Wep.RightDockedBox.style.height = (this.TotalD - h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.BottomDockedBox.scrollTop = 0;
    }
  }
  else          // Uscita
  {
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_LEFT)
    {
      var w = this.ObjD*(1-perc);
      //
      this.Wep.LeftDockedBox.style.width = w + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      this.Wep.FormsBox.style.left = (this.FormsLeft + w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.LeftDockedBox.scrollLeft = this.ObjD - w;
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_TOP)
    {
      var h = this.ObjD*(1-perc);
      //
      this.Wep.TopDockedBox.style.height = h + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.FormsBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.LeftDockedBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.RightDockedBox.style.top = (this.FormsTop + h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.TopDockedBox.scrollTop = this.ObjD - h;
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_RIGHT)
    {
      var w = this.ObjD*(1-perc);
      //
      this.Wep.RightDockedBox.style.width = w + "px";
      this.Wep.RightDockedBox.style.left = (this.Wep.WepBox.clientWidth - w) + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.RightDockedBox.scrollLeft = 0;
    }
    if (this.Obj.DockType==RD3_Glb.FORMDOCK_BOTTOM)
    {
      var h = this.ObjD*(1-perc);
      //
      this.Wep.BottomDockedBox.style.height = h + "px";
      this.Wep.BottomDockedBox.style.top = (this.Wep.WepBox.clientHeight - h) + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.LeftDockedBox.style.height = (this.TotalD - h) +"px";
      this.Wep.RightDockedBox.style.height = (this.TotalD - h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.BottomDockedBox.scrollTop = 0;
    }
  }
}


// **************************************************
// Fine dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.DockedFinish = function()
{
  if (!this.Wep)
      this.Wep = RD3_DesktopManager.WebEntryPoint;
  //
  if (this.Flin)    // Apertura Docked
  {
    this.Obj.AdaptDocked();
    //
    this.Wep.CmdObj.ActiveFormChanged();
    this.Wep.IndObj.ActiveFormChanged();
    this.Wep.TimerObj.ActiveFormChanged();
    //
    // Se il pulsante chiudi tutto e' nascosto lo devo mostrare
    this.Wep.HandleCloseAllVisibility();
    //
    if (this.Wep.ActiveForm)
      RD3_DesktopManager.HandleFocus2(this.Wep.ActiveForm.Identifier,0);
    //
    // Faccio l'adapt di tutte le form
    this.Wep.AdaptLayout();
  }
  else      // Chiusura Docked
  {
    // Puo' essere o un animazione di chiusura oppure una animazione di hide form:
    // CloseFormAnimation distingue i due casi..
    if (this.CloseFormAnimation)
    { 
      // Distruggo la form
      this.Obj.Unrealize();
      //
      // Tolgo la form dallo stackform
      var n = this.Wep.StackForm.length;
      for (var i=0; i<n; i++)
      {
        var f = this.Wep.StackForm[i];
        if (f.Identifier==this.IdxForm)
        {
          this.Wep.StackForm.splice(i, 1);
          break;
        } 
      }
    }
    else
    {
      this.Obj.SetVisible(false,false);
      //
      // Faccio l'adapt di tutte le form
      this.Wep.AdaptLayout();
    }
    //
    // Gestisco i Command Set, gli indicatori ed i Timer
    this.Wep.CmdObj.ActiveFormChanged();
    this.Wep.IndObj.ActiveFormChanged();
    this.Wep.TimerObj.ActiveFormChanged();
  }
}



// **************************************************
// Start dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.PopupResizeStart = function()
{
  if (!this.Obj || !this.Obj.PopupFrame)
  {
    this.SetFinished();
    return;
  } 
  //
  // Stoppo l'adaptLayout in questa fase
  this.Obj.RecalcLayout = false;
  this.Obj.Animating = true;
  this.Obj.PopupResAnimating = true;
  //
  // Scelgo le animazioni da fare..
  this.LeftAnim = (this.Obj.FormLeft == this.Obj.PopupRect.x) ? false : true;
  this.TopAnim = (this.Obj.FormTop == this.Obj.PopupRect.y) ? false : true;
  this.WidthAnim = (this.Obj.FormWidth == this.Obj.PopupRect.w) ? false : true;
  this.HeightAnim = (this.Obj.FormHeight == this.Obj.PopupRect.h) ? false : true;
}


// **************************************************
// Start dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.PopupResizeTick = function(perc)
{
  var adapt = false;
  //
  if (this.LeftAnim)
  {
    var newl = this.Obj.FormLeft;
    var oldl = this.Obj.PopupRect.x;
    var lf = oldl + perc*(newl-oldl);
    //
    this.Obj.PopupFrame.SetLeft(lf);
  }
  if (this.TopAnim)
  {
    var newt = this.Obj.FormTop;
    var oldt = this.Obj.PopupRect.y;
    var tp = oldt + perc*(newt-oldt);
    //
    this.Obj.PopupFrame.SetTop(tp);
  }
  if (this.WidthAnim)
  {
    var neww = this.Obj.FormWidth;
    var oldw = this.Obj.PopupRect.w;
    var wt = oldw + perc*(neww-oldw);
    //
    this.Obj.PopupFrame.SetWidth(wt);
    adapt = true;
  }
  if (this.HeightAnim)
  {
    var newh = this.Obj.FormHeight;
    var oldh = this.Obj.PopupRect.h;
    var ht = oldh + perc*(newh-oldh);
    //
    this.Obj.PopupFrame.SetHeight(ht);
    adapt = true;
  }
  //
  if (adapt)
    this.Obj.PopupFrame.AdaptLayout();
}


// **************************************************
// Start dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.PopupResizeFinish = function()
{
  if (!this.Obj)
    return;
  //
  this.Obj.Animating = false;
  this.Obj.PopupResAnimating = false;
  //
  // Reimposto correttamente la posizione forzando la memorizzazione del nuovo valore:
  // in questo modo le prossime animazioni non vengono sporcate da questa..
  this.Obj.SetFormLeft(this.Obj.FormLeft, true);
  this.Obj.SetFormTop(this.Obj.FormTop, true);
  this.Obj.SetFormWidth(this.Obj.FormWidth, true);
  this.Obj.SetFormHeight(this.Obj.FormHeight, true);
  if (this.Obj.WindowState==RD3_Glb.WS_NORMAL)
    this.Obj.PopupFrame.ShowThickBorders(true);
  if (this.IsWebKit)
    this.Obj.PopupFrame.PopupBox.style.webkitTransform = "scale(1.0) translateX(0px) translateY(0px)";
  //
  var doadapt = true;
  if (this.Obj.AfterPopupResizeFinish)
    doadapt = this.Obj.AfterPopupResizeFinish();
  //
  // Se necessario faccio fare l'adaptLayout
  if (doadapt)
    this.Obj.AdaptLayout();
  //
  // FFX 3 non ripristina bene la videata dopo l'animazione... ci vuole una spintina...
  if (this.Flin && this.Obj.WindowState==RD3_Glb.WS_NORMAL && RD3_Glb.IsFirefox(3) && this.Obj.PopupFrame && this.Obj.PopupFrame.PopupBox)
  {
    var oldpf = this.Obj.PopupFrame.PopupBox;
    //
    // Tolgo e rimetto il popup frame dal DOM
    var oldpar = oldpf.parentNode;
    oldpf.parentNode.removeChild(oldpf);
    oldpar.appendChild(oldpf);
  }
  //
  this.Obj = null;
  //
  // Se durante il resize e' arrivato un comando di fuoco dal server allora lo devo
  // applicare
  if (RD3_GFXManager.ModalFocusFldId && RD3_GFXManager.ModalFocusFldId != "")
  {
    RD3_DesktopManager.HandleFocus2(RD3_GFXManager.ModalFocusFldId, RD3_GFXManager.ModalFocusFldRow);
    //
    RD3_GFXManager.ModalFocusFldId = "";
    RD3_GFXManager.ModalFocusFldRow = 0;
  }
}


// ***************************************************************
// Inizio dell'animazione del Tooltip
// ***************************************************************
GFX.prototype.TooltipStart = function()
{
  // Supporta solo l'animazione fade, Flin da' la direzione del fade: true fading in , false fading out e chiusura
  //
  // Se devo far comparire il Tooltip per prima cosa lo faccio aprire
  if (this.Flin)
  {
    this.Obj.Open();
    //
    // Se sono su IE devo inscatolare il Tooltip dentro un altro div, altrimenti per un suo baco i bordi non
    // compaiono finche' non tolgo il filtro (calcola il bounding box basandosi solo sul div, mentre i bordi sono fuori..)
    if (RD3_Glb.IsIE(10, false))
    {
      var ttsty = this.Obj.PopupBox.style;
      this.Ttop = parseInt(ttsty.top, 10);
      this.Tleft = parseInt(ttsty.left, 10);
      this.Twidth = parseInt(ttsty.width, 10);
      this.Theight = parseInt(ttsty.height, 10);
      //
      // Creo il div di inscatolamento e lo posiziono un po' piu' in alto a sinistra (in modo da contenere il baffo..) e un po' piu' largo..
      this.Wraptt = document.createElement("DIV");
      var sty = this.Wraptt.style;
      //
      // Decido la dimensione di cui allargare il DIV: 
      // Altezza o larghezza massima baffo + dimensione bordo + distanza bordo baffo
      var offs = (this.Obj.WhiskerBase>this.Obj.WhiskerHeight) ? this.Obj.WhiskerBase : this.Obj.WhiskerHeight;
      offs += (this.Obj.BorderRoundWidth + this.Obj.WhiskerOffset);
      //
      sty.top = (this.Ttop-offs)+"px";
      sty.left = (this.Tleft-offs)+"px";
      sty.width = (this.Twidth + (offs*2)) + "px";
      sty.height = (this.Theight + (offs*2)) + "px";
      sty.position = "absolute";
      //
      // Riparento e riposiziono il tooltip..
      ttsty.top = offs + "px";
      ttsty.left = offs + "px";
      //
      // Il tooltip deve stare sopra a tutto
      this.Wraptt.style.zIndex = 200;
      //
      this.Wraptt.appendChild(this.Obj.PopupBox);
      document.body.appendChild(this.Wraptt);
    }
    //
    // Mi memorizzo un riferimento allo stile che mi serve per fare l'animazione
    this.ObjStyle = RD3_Glb.IsIE(10, false) ? this.Wraptt.style : this.Obj.PopupBox.style;
    //
    // Ora lo rendo invisibile
    if (RD3_Glb.IsIE(10, false))
      this.ObjStyle.filter = "filter: alpha(opacity = 0);";
    else
      this.ObjStyle.opacity = 0;
  }
  else
  {
    // Se sono su IE devo inscatolare il Tooltip dentro un altro div, altrimenti per un suo baco i bordi non
    // compaiono finche' non tolgo il filtro (calcola il bounding box basandosi solo sul div, mentre i bordi sono fuori..)
    if (RD3_Glb.IsIE(10, false))
    {
      var ttsty = this.Obj.PopupBox.style;
      this.Ttop = parseInt(ttsty.top, 10);
      this.Tleft = parseInt(ttsty.left, 10);
      this.Twidth = parseInt(ttsty.width, 10);
      this.Theight = parseInt(ttsty.height, 10);
      //
      // Creo il div di inscatolamento e lo posiziono un po' piu' in alto a sinistra (in modo da contenere il baffo..) e un po' piu' largo..
      this.Wraptt = document.createElement("DIV");
      var sty = this.Wraptt.style;
      //
      // Decido la dimensione di cui allargare il DIV: 
      // Altezza o larghezza massima baffo + dimensione bordo + distanza bordo baffo
      var offs = (this.Obj.WhiskerBase>this.Obj.WhiskerHeight) ? this.Obj.WhiskerBase : this.Obj.WhiskerHeight;
      offs += (this.Obj.BorderRoundWidth + this.Obj.WhiskerOffset);
      //
      sty.top = (this.Ttop-offs)+"px";
      sty.left = (this.Tleft-offs)+"px";
      sty.width = (this.Twidth + (offs*2)) + "px";
      sty.height = (this.Theight + (offs*2)) + "px";
      sty.position = "absolute";
      //
      // Riparento e riposiziono il tooltip..
      ttsty.top = offs + "px";
      ttsty.left = offs + "px";
      //
      // Il tooltip deve stare sopra a tutto
      this.Wraptt.style.zIndex = 200;
      //
      this.Wraptt.appendChild(this.Obj.PopupBox);
      document.body.appendChild(this.Wraptt);
    }
    //
    // Mi memorizzo un riferimento allo stile che mi serve per fare l'animazione
    this.ObjStyle = RD3_Glb.IsIE(10, false) ? this.Wraptt.style : this.Obj.PopupBox.style;
  }
}

// ***************************************************************
// Tick dell'animazione del Tooltip
// ***************************************************************
GFX.prototype.TooltipTick = function(perc)
{
  // Decido la percentuale in base alla direzione dell'animazione
  var percanim = this.Flin ? perc : (1-perc);
  //
  if (RD3_Glb.IsIE(10, false))
    this.ObjStyle.filter = "filter: alpha(opacity = "+Math.floor(percanim*100)+");";
  else
    this.ObjStyle.opacity = percanim;
}


// ***************************************************************
// Fine dell'animazione del Tooltip
// ***************************************************************
GFX.prototype.TooltipFinish = function()
{
  if (this.Flin)
  {
    // Se ho saltato lo start e devo far comparire il Tooltip faccio qui l'open
    if (this.Durata == 0 || this.Tipo == "none")
    {
      this.Obj.Open();
      this.ObjStyle = this.Obj.PopupBox.style;
    }
    else
    {
      // Se sono su IE oltre a togliere il filtro devo togliere dal DOM il nuovo div e rirpristinare il ttoltip
      if (RD3_Glb.IsIE(10, false))
      {
        var ttsty = this.Obj.PopupBox.style;
        //
        // Riparento e riposiziono il tooltip..
        ttsty.top = this.Ttop + "px";
        ttsty.left = this.Tleft + "px";
        //
        document.body.removeChild(this.Wraptt);
        document.body.appendChild(this.Obj.PopupBox);
        //
        this.Wraptt = null;
        this.ObjStyle = this.Obj.PopupBox.style;
      }
    }
    //
    // Tolgo il filtro o l'opacita'
    if (RD3_Glb.IsIE(10, false))
      this.ObjStyle.removeAttribute("filter");
    else
      this.ObjStyle.opacity=1;
  }
  else
  {
    // Se sono su IE oltre a togliere il filtro devo togliere dal DOM il nuovo div e rirpristinare il ttoltip
    if (RD3_Glb.IsIE(10, false) && !(this.Durata == 0 || this.Tipo == "none"))
    {
      var ttsty = this.Obj.PopupBox.style;
      //
      // Riparento e riposiziono il tooltip..
      ttsty.top = this.Ttop + "px";
      ttsty.left = this.Tleft + "px";
      //
      document.body.removeChild(this.Wraptt);
      document.body.appendChild(this.Obj.PopupBox);
      //
      this.Wraptt = null;
      this.ObjStyle = this.Obj.PopupBox.style;
    }
    //
    // Se ho animato tolgo l'opacita' e il filtro
    if (!(this.Durata == 0 || this.Tipo == "none"))
    {
      // Tolgo il filtro o l'opacita'
      if (RD3_Glb.IsIE(10, false))
        this.ObjStyle.removeAttribute("filter");
      else
        this.ObjStyle.opacity=1;
    }
    //
    // Chiudo il Tooltip
    this.Obj.Close();
  }
}


// ***************************************************************
// Inizio dell'animazione del menu taskbar
// ***************************************************************
GFX.prototype.TaskBarStart = function()
{
  if (this.Flin)
  {
    // Mi memorizzo la dimensione finale
    this.ObjH = this.Obj.offsetHeight;
    //
    // Mi memorizzo il top finale..
    this.ObjT = this.Obj.offsetTop;
    //
    // Minimizzo la taskbar..
    this.Obj.style.height = "0px";
    this.Obj.style.top = this.ObjT+this.ObjH+"px";
  }
  else
  {
    // La TaskBar e' visibile? Se non e' visibile non faccio nulla..
    if (this.Obj.style.display!="block")
    {
      this.SetFinished();
      return;
    }
    //
    // Mi memorizzo la dimensione iniziale
    this.ObjH = this.Obj.offsetHeight;
    //
    // Mi memorizzo il top iniziale..
    this.ObjT = this.Obj.offsetTop;
    //
    // L'unica cosa che devo fare e' nascondere le immaginette di scroll del menu,
    // se no vengono tolte alla fine ed e' brutto..
    RD3_DesktopManager.WebEntryPoint.MenuScrollUp.style.display = "none";
    RD3_DesktopManager.WebEntryPoint.MenuScrollDown.style.display = "none";
  }
}


// ***************************************************************
// Tick dell'animazione del menu taskbar
// ***************************************************************
GFX.prototype.TaskBarTick = function(perc)
{
  if (this.Flin)
  {
    this.Obj.style.height = (perc*this.ObjH)+"px";
    this.Obj.style.top = this.ObjT+(this.ObjH-(perc*this.ObjH))+"px";
    this.Obj.scrollTop = 0;
  }
  else
  {
    this.Obj.style.height = ((1-perc)*this.ObjH)+"px";
    this.Obj.style.top = this.ObjT+(this.ObjH-((1-perc)*this.ObjH))+"px";
    this.Obj.scrollTop = 0;
  }
}


// ***************************************************************
// Fine dell'animazione del menu taskbar
// ***************************************************************
GFX.prototype.TaskBarFinish = function()
{
  if (this.Flin)
  {
    // Verifico se ho saltato lo start
    if (this.Durata==0 || this.Tipo=="none")
    {
      RD3_DesktopManager.WebEntryPoint.AdaptScrollBox();
    }
    else
    {  
      // Riposiziono correttamente il menu
      this.Obj.style.height = this.ObjH+"px";
      this.Obj.style.top = this.ObjT+"px";
      this.Obj.scrollTop = 0;
      //
      RD3_DesktopManager.WebEntryPoint.AdaptScrollBox();
    }
  }
  else
  {
    // Nascondo il menu e tutti i suoi oggetti
    RD3_DesktopManager.WebEntryPoint.TaskbarMenuBox.style.display = "none";
    RD3_DesktopManager.WebEntryPoint.MenuScrollUp.style.display = "none";
    RD3_DesktopManager.WebEntryPoint.MenuScrollDown.style.display = "none";
    RD3_DesktopManager.WebEntryPoint.TaskbarStartCell.style.backgroundPosition="";
  }
}


// ***************************************************************
// Inizio dell'animazione della combo
// ***************************************************************
GFX.prototype.ComboStart = function()
{
  // Apertura della combo
  if (this.Flin)
  {
    // Mi memorizzo la dimensione finale, il top e la posizione della scrollbar
    this.ObjH = this.Obj.ComboPopup.offsetHeight;
    this.ObjT = this.Obj.ComboPopup.offsetTop;
    this.ObjScr = this.Obj.ComboPopup.scrollTop;
    //
    // Minimizzo il Popup e nascondo le scrollbar
    this.Obj.ComboPopup.style.height = "0px";
    this.Obj.ComboPopup.style.overflow = "hidden";
    //
    // Se il popup e' sopra il valore sposto il top del popup
    if (this.Obj.ComboUpper)
     this.Obj.ComboPopup.style.top = this.ObjT + this.ObjH + "px";
  }
  else  // Chiusura della combo
  {
    // Mi memorizzo la dimensione iniziale, il top e la posizione della scrollbar
    this.ObjH = this.Obj.ComboPopup.offsetHeight;
    this.ObjT = this.Obj.ComboPopup.offsetTop;
    this.ObjScr = this.Obj.ComboPopup.scrollTop;
    //
    // Nascondo le scrollbar
    this.Obj.ComboPopup.style.overflow = "hidden";
  }
  //
  this.Obj.AnimatingCombo = true;
}


// ***************************************************************
// Tick dell'animazione della combo
// ***************************************************************
GFX.prototype.ComboTick = function(perc)
{
  // Se la combo e' stata "ricostruita" abbandono l'animazione
  // Nei book puo' capitare a causa del differenziatore...
  if (!this.Obj.ComboUpper && !this.Obj.ComboPopup)
    return;
  //
  // Apertura della combo
  if (this.Flin)
  {
    if (this.Tipo=="scroll")
    {
      if (this.Obj.ComboUpper)
      {
        this.Obj.ComboPopup.style.height = (perc*this.ObjH)+"px";
        this.Obj.ComboPopup.style.top = this.ObjT + Math.floor((1-perc)*this.ObjH)+"px";
        //
        if (!RD3_Glb.IsFirefox(3))
          this.Obj.ComboPopup.scrollTop = this.ObjScr;
      }
      else
      {
        this.Obj.ComboPopup.style.height = (perc*this.ObjH)+"px";
        //
        // Sotto Firefox non posso andare a modificare lo scrolltop, se no sfarfalla ed e' orribile..
        // quind sotto ffx il comportamento di scroll e fold e' uguale..
        if (!RD3_Glb.IsFirefox(3))
          this.Obj.ComboPopup.scrollTop = this.ObjScr + Math.floor((1-perc)*this.ObjH);
      }
    }
    if (this.Tipo=="fold")
    {
      if (this.Obj.ComboUpper)
      {
        this.Obj.ComboPopup.style.height = (perc*this.ObjH)+"px";
        this.Obj.ComboPopup.style.top = this.ObjT + Math.floor((1-perc)*this.ObjH)+"px";
        //
        if (!RD3_Glb.IsFirefox(3))
          this.Obj.ComboPopup.scrollTop = this.ObjScr + Math.floor((1-perc)*this.ObjH);
      } 
      else
      {
        this.Obj.ComboPopup.style.height = (perc*this.ObjH)+"px";
        //
        if (!RD3_Glb.IsFirefox(3))
          this.Obj.ComboPopup.scrollTop = this.ObjScr;
      }
    }
  }
  else  // Chiusura della combo
  {
    if (this.Tipo=="scroll")
    {
      if (this.Obj.ComboUpper)
      {
        this.Obj.ComboPopup.style.height = ((1-perc)*this.ObjH)+"px";
        this.Obj.ComboPopup.style.top = this.ObjT + Math.floor(perc*this.ObjH)+"px";
        //
        if (!RD3_Glb.IsFirefox(3))
          this.Obj.ComboPopup.scrollTop = this.ObjScr;
      }
      else
      {
        this.Obj.ComboPopup.style.height = ((1-perc)*this.ObjH)+"px";
        //
        if (!RD3_Glb.IsFirefox(3))
          this.Obj.ComboPopup.scrollTop = this.ObjScr + Math.floor(perc*this.ObjH);
      }
    }
    if (this.Tipo=="fold")
    {
      if (this.Obj.ComboUpper)
      {
        this.Obj.ComboPopup.style.height = ((1-perc)*this.ObjH)+"px";
         this.Obj.ComboPopup.style.top = this.ObjT + Math.floor(perc*this.ObjH)+"px";
         //
         if (!RD3_Glb.IsFirefox(3))
           this.Obj.ComboPopup.scrollTop = this.ObjScr + Math.floor(perc*this.ObjH); 
      }
      else
      {
        this.Obj.ComboPopup.style.height = ((1-perc)*this.ObjH)+"px";
        //
        if (!RD3_Glb.IsFirefox(3))
          this.Obj.ComboPopup.scrollTop = this.ObjScr;
      }
    }
  }
}


// ***************************************************************
// Fine dell'animazione della combo
// ***************************************************************
GFX.prototype.ComboFinish = function()
{
  // Se la combo e' stata "ricostruita" abbandono l'animazione
  // Nei book puo' capitare a causa del differenziatore...
  if (!this.Obj.ComboPopup)
    return;
  //
  // Apertura della combo
  if (this.Flin)
  {
    // Ripristino il Popup e nascondo le scrollbar
    this.Obj.ComboPopup.style.overflow = "";
    this.Obj.AdaptPopupLayout(true);
    //
    // Mi assicuro che l'item selezionato sia visibile
    //this.Obj.EnsureItemVisible();
    //
    // Se non l'ho ancora fatto, avvio il timer di riposizionamento
    if (!this.Obj.ComboPopupTimer)
      this.Obj.ComboPopupTimer = window.setInterval(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Obj.Identifier+"', 'OnTimerTick', ev, true)"), 250);
  }
  else  // Chiusura della combo
  {
    // Ripristino l'overflow e le dimensioni
    this.Obj.ComboPopup.style.height = "";
    this.Obj.ComboPopup.style.overflow = "";
    //
    // Nascondo la combo
    this.Obj.ComboPopup.style.display = "none";
  }
  //
  this.Obj.AnimatingCombo = false;
}

// ***************************************************************
// Inizio dell'animazione del gruppo
// ***************************************************************
GFX.prototype.GroupStart = function()
{
  // Creo un div per bloccare l'interfaccia utente durante l'animazione
  if (!RD3_Glb.IsMobile())
  {
    this.BlockBox = document.createElement("div");
    this.BlockBox.className = "blocking-box";
    document.body.appendChild(this.BlockBox);
    this.BlockBox.style.display = "block";
  }
  //
  // Aggiorno la visibilita' dei miei campi in quanto e' cambiato lo stato del gruppo
  if (this.Obj.Collapsed)
  {
    var n = this.Obj.MyFields.length;
    for (var i=0; i<n; i++)
      this.Obj.MyFields[i].UpdateFieldVisibility();
  }
  //
  var LayoutList = (this.Obj.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST);
  this.deltaH = (LayoutList ? this.Obj.ListHeight : this.Obj.FormHeight);
  if (this.Flin)
    this.deltaH = -this.deltaH;
  //
  var n = this.Obj.FieldsUnderMe.length;
  for (var i=0; i<n; i++)
  {
    var fld = this.Obj.FieldsUnderMe[i];
    fld.OriginalTop = (LayoutList ? fld.ListTop : fld.FormTop);
  }
}

// ***************************************************************
// Tick dell'animazione del gruppo
// ***************************************************************
GFX.prototype.GroupTick = function(perc)
{
  var LayoutList = (this.Obj.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST);
  var deltaH = Math.floor(perc * this.deltaH);
  //
  var n = this.Obj.FieldsUnderMe.length;
  for (var i=0; i<n; i++)
  {
    var fld = this.Obj.FieldsUnderMe[i];
    if (LayoutList)
      fld.SetListTop(fld.OriginalTop + deltaH);
    else
      fld.SetFormTop(fld.OriginalTop + deltaH);
  }
  //
  this.Obj.ParentPanel.CalcGroupsLayout();
  //
  // Cambio temporaneamente il Collapsed per forzare l'altezza del gruppo
  var old = this.Obj.Collapsed;
  this.Obj.Collapsed = false;
  //
  // Aggiusto l'altezza del gruppo
  if (LayoutList)
    this.Obj.SetListHeight(this.Flin ? this.Obj.ListHeight + deltaH : deltaH);
  else
    this.Obj.SetFormHeight(this.Flin ? this.Obj.FormHeight + deltaH : deltaH);
  //
  this.Obj.Collapsed = old;
  //
  // Se sto espandendo devo allargare il container del layout corrente
  if (!this.Flin)
  {
    var layoutBox = (LayoutList ? this.Obj.ParentPanel.ListBox : this.Obj.ParentPanel.FormBox);
    if (layoutBox.scrollHeight < layoutBox.offsetHeight);
      layoutBox.style.height = layoutBox.scrollHeight + "px";
  }
}

// ***************************************************************
// Fine dell'animazione del gruppo
// ***************************************************************
GFX.prototype.GroupFinish = function()
{
  var LayoutList = (this.Obj.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST);
  //
  if (this.Durata == 0 || this.Tipo == "none" || !this.Obj.Collapsed)
  {
    // Aggiorno la visibilita' dei miei campi in quanto e' cambiato lo stato del gruppo
    var n = this.Obj.MyFields.length;
    for (var i=0; i<n; i++)
      this.Obj.MyFields[i].UpdateFieldVisibility();
    //
    this.deltaH = (LayoutList ? this.Obj.ListHeight : this.Obj.FormHeight);
    if (this.Flin)
      this.deltaH = -this.deltaH;
  }
  //
  if (this.MoveFields)
  {
    var n = this.Obj.FieldsUnderMe.length;
    for (var i=0; i<n; i++)
    {
      var fld = this.Obj.FieldsUnderMe[i];
      if (LayoutList)
      {
        if (!fld.OriginalTop)
          fld.OriginalTop = fld.ListTop;
        fld.SetListTop(fld.OriginalTop + this.deltaH);
      }
      else
      {
        if (!fld.OriginalTop)
          fld.OriginalTop = fld.FormTop;
        fld.SetFormTop(fld.OriginalTop + this.deltaH);
      }
      fld.OriginalTop = null;
    }
  }
  //
  this.Obj.ParentPanel.CalcGroupsLayout();
  //
  // Rimuovo il blocco sulla UI
  if (this.BlockBox)
    this.BlockBox.parentNode.removeChild(this.BlockBox);
  delete this.BlockBox;
}


// ************************************************
// Dato lo stile "s", ne imposta il timing
// tramite webkit
// ************************************************
GFX.prototype.SetWebKitTiming = function(s)
{
  s.webkitTransitionDuration=this.Durata+"ms";
  //
  // in alcuni casi ci vuole il delay per ridurre lo sfarfallio,
  // in altri invece diventa dannoso
  if (this.Classe!="tab")
    s.webkitTransitionDelay="50ms";
  //
  if (!this.WebKitStyles)
    this.WebKitStyles = new Array();
  this.WebKitStyles.push(s);
}


// ************************************************
// Resetta le proprieta' di transizione delle
// animazioni webkit
// ************************************************
GFX.prototype.ResetWebKitTiming = function(s)
{
  if (this.WebKitStyles)
  {
    var i=0;
    for (i=0;i<this.WebKitStyles.length;i++)
    {
      this.WebKitStyles[i].webkitTransitionProperty = "";
      this.WebKitStyles[i].webkitTransitionDuration = "";
      this.WebKitStyles[i].webkitTransitionDelay = "";
    }
    this.WebKitStyles = null;
  }
}


// ***************************************************************
// Fine dell'animazione tramite webkit
// ***************************************************************
GFX.prototype.OnEndAnimation = function(ev)
{
  if (this.IsFinished() || this.WebkitTick > 0)
    return;
  //
  if (this.IsMyAnimation(ev))
  {
    // Sembra che la fine ritardata non sia di grande utilizzo
    // concludo l'animazione... fra qualche istante
    //if (this.Classe!="tab")
    //  this.WebkitTick = 4;
    //else
    this.SetFinished();
    //
    // e indico che ero io
    return true;
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.IsMyAnimation = function(ev)
{
  if (this.Obj == ev.target || (this.Obj && this.TargetObj == ev.target))
    return true;
  //
  switch(this.Classe)
  {
    case "graph":
      if ((this.Obj && this.Obj.Img == ev.target) || this.OldImg == ev.target)
        return true;
  }
  //
  return false;
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.StartWebKit = function()
{
  if (!RD3_ClientParams.UseWebKitGFX)
    return;
  //
  switch(this.Classe)
  {
    case "start":
      this.WebKitOpacityStart(1, this.Obj, true);
    break;

    case "redirect":
      this.WebKitOpacityStart(0, this.Obj, true);
    break;

    case "graph":
      this.WebKitGraphStart();
    break;

    case "form":
      this.WebKitFormStart();
    break;

    case "tab":
      this.WebKitTabStart();
    break;

    case "list":
      this.WebKitListStart();
    break;
    
    case "book":
      this.WebKitBookStart();
    break;
    
    case "tooltip":
      this.WebKitOpacityStart(this.Flin?"1":"0", this.Obj.PopupBox, true);
    break;
    
    case "modal":
      this.WebKitModalStart();
    break;

    case "popupres":
      this.WebKitPopupResizeStart();
    break;
    
    case "sidebar":
      this.WebKitSideBarStart();
    break;
    
    case "preview":
      this.WebKitPreviewStart();
    break;
  }
}


// ***************************************************************
// Torna TRUE se l'animazione sara' gestita tramite webkit
// Solo alcuni tipi hanno il problema di saperlo prima...
// ***************************************************************
GFX.prototype.WillBeWebKit = function()
{
  if (!RD3_ClientParams.UseWebKitGFX || !RD3_Glb.IsTouch() || RD3_Glb.IsIE(10, true))
    return;
  //
  switch(this.Classe)
  {
    case "form":
      if (this.Tipo == "scroll-h" || this.Tipo == "scroll-v")
        return true;
    break;
    
    case "tab":
      if (this.Tipo == "scroll-h")
        return true;
    break;
    
    case "list":
      if (this.Tipo == "scroll-h" && !RD3_Glb.IsChrome())
        return true;
    break;
    
    case "book":
      if (this.Obj && this.ObjOut && this.Tipo == "scroll")
        return true;
    break;
    
    case "modal":
      if (this.Tipo == "zoom")
        return true;
    break;
    
    case "sidebar":
      if (this.Tipo == "scroll" && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_LEFTSB)
        return true;
    break;
    
    case "preview":
      if (this.Tipo == "scroll")
        return true;
    break;
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitOpacityStart = function(op, obj, seteve)
{
  if (!obj)
    return;
  //
  // Segnalo che l'animazione sara' gestita tramite webkit
  this.IsWebKit = true;
  //
  // Attacco l'evento all'oggetto body
  if (seteve)
  {
    obj.removeEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
    obj.addEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
    this.TargetObj = obj;
  }
  //
  var s = obj.style;
  //
  // Imposto le proprieta' di trasformazione della opacita'
  s.webkitTransitionProperty="opacity";
  this.SetWebKitTiming(s);
  s.opacity = op;
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitGraphStart = function()
{
  if (this.Tipo == "fade")
  {
    if (this.Flin)
    {
      this.WebKitOpacityStart(0, this.OldImg, false);
      if (this.Obj)
        this.WebKitOpacityStart(1, this.Obj.Img, true);
    }
    else
    {
      // Faccio il fading out della vecchia immagine
      this.WebKitOpacityStart(0, this.OldImg, true);
    }
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitTranslateStart = function(obj, seteve, prop, val)
{
  if (!obj)
    return;
  //
  // Segnalo che l'animazione sara' gestita tramite webkit
  this.IsWebKit = true;
  //
  // Attacco l'evento all'oggetto body
  if (seteve)
  {
    obj.removeEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
    obj.addEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
    this.TargetObj = obj;
  }
  //
  var s = obj.style;
  //
  // Imposto le proprieta' di trasformazione del posizionamento
  s.webkitTransitionProperty="webkitTransform";
  this.SetWebKitTiming(s);
  s.webkitTransform = prop+"("+val+"px)";
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitFormStart = function()
{
  if (this.WillBeWebKit())
  {
    var obj = this.InFrm ? this.Obj.FormBox : this.Obj;
    //
    var objout = null;
    if (this.ObjOut)
      objout = this.OutFrm ? this.ObjOut.FormBox : this.ObjOut;
    //
    var prop = (this.Tipo == "scroll-h")? "translateX":"translateY";
    var val = (this.Tipo == "scroll-h")? this.ObjW:this.ObjH;
    //
    if (objout)
      this.WebKitTranslateStart(objout, false, prop, val);
    //
    this.WebKitTranslateStart(obj, true, prop, 0);
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitTabStart = function()
{
  if (this.WillBeWebKit())
  {
    // Impostazioni iniziali
    this.TabFirstTick();
    //
    // Gestione animazione
    this.WebKitTranslateStart(this.ObjOut.ContentBox, false, "translateX", this.ObjW);
    this.WebKitTranslateStart(this.Obj.ContentBox, true, "translateX", 0);
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitListStart = function()
{
  if (this.WillBeWebKit())
  {
    var o1 = (this.Flin)?this.Obj.FormBox:this.Obj.ListBox;
    var o2 = (this.Flin)?this.Obj.ListBox:this.Obj.FormBox;
    //
    // Gestione animazione
    this.WebKitTranslateStart(o2, false, "translateX", this.ObjH);
    this.WebKitTranslateStart(o1, true, "translateX", 0);
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitBookStart = function()
{
  if (this.WillBeWebKit())
  {
    // Gestione animazione
    if (this.ObjOut)
      this.WebKitTranslateStart(this.ObjOut.PageBox, false, "translateX", this.ObjW);
    if (this.Obj)
      this.WebKitTranslateStart(this.Obj.PageBox, true, "translateX", 0);
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitModalStart = function()
{
  if (this.WillBeWebKit())
  {
    // Segnalo che l'animazione sara' gestita tramite webkit
    this.IsWebKit = true;
    //
    // Attacco l'evento all'oggetto body
    //
    this.TargetObj = this.Obj.PopupFrame.PopupBox;
    this.TargetObj.removeEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
    this.TargetObj.addEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
    //
    var s = this.TargetObj.style;
    //
    if (this.Flin)
      s.webkitTransform = "scale(0.0) translateX(-"+this.Obj.FormWidth+"px) translateY(-"+this.Obj.FormHeight+"px)";
    //
    // Imposto le proprieta' di trasformazione del posizionamento
    s.webkitTransitionProperty="webkitTransform opacity";
    this.SetWebKitTiming(s);
    //
    // Proprieta' finali
    if (this.Flin)
    {
      s.opacity = "1";
      s.webkitTransform = "scale(1.0) translateX("+(this.Obj.FormLeft-this.TargetX)+"px) translateY("+(this.Obj.FormTop-this.TargetY)+"px)";
    }
    else
    {
      s.opacity = "0";
      s.webkitTransform = "scale(0.0) translateX("+this.TargetX+"px) translateY("+this.TargetY+"px)";
    }
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitPopupResizeStart = function()
{
  // Segnalo che l'animazione sara' gestita tramite webkit
  this.IsWebKit = true;
  //
  // Attacco l'evento all'oggetto body
  this.TargetObj = this.Obj.PopupFrame.PopupBox;
  this.TargetObj.removeEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
  this.TargetObj.addEventListener("webkitTransitionEnd", RD3_GFXManager.OnEndAnimation, false);
  //
  var s = this.TargetObj.style;
  //
  if (this.Flin)
    s.webkitTransform = "scaleX(1.0) scaleY(1.0) translateX(0px) translateY(0px)";
  //
  // Imposto le proprieta' di trasformazione del posizionamento
  s.webkitTransitionProperty="webkitTransform";
  this.SetWebKitTiming(s);
  //
  var scx = this.Obj.FormWidth / this.Obj.PopupRect.w;
  var scy = this.Obj.FormHeight / this.Obj.PopupRect.h;
  var tx = this.Obj.FormLeft+this.Obj.FormWidth/2-this.Obj.PopupRect.x-this.Obj.PopupRect.w/2;
  var ty = this.Obj.FormTop+this.Obj.FormHeight/2-this.Obj.PopupRect.y-this.Obj.PopupRect.h/2;
  tx = tx / scx;
  ty = ty / scy;
  s.webkitTransform = "scaleX("+scx+") scaleY("+scy+") translateX("+tx+"px) translateY("+ty+"px)";
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitSideBarStart = function()
{
  if (this.WillBeWebKit())
  {
    // Gestione animazione
    var w = this.ObjEndSize;
    if (!this.Flin)
      w = -w;
    //
    this.WebKitTranslateStart(this.Obj, true, "translateX", w);
    this.WebKitTranslateStart(RD3_DesktopManager.WebEntryPoint.FormsBox, false, "translateX", w);
    this.WebKitTranslateStart(RD3_DesktopManager.WebEntryPoint.StatusBarBox, false, "translateX", w);
    this.WebKitTranslateStart(RD3_DesktopManager.WebEntryPoint.ToolBarBox, false, "translateX", w);
    if (this.ObjDL) this.WebKitTranslateStart(this.ObjDL, false, "translateX", w);
    if (this.ObjDT) this.WebKitTranslateStart(this.ObjDT, false, "translateX", w);
    if (this.ObjDB) this.WebKitTranslateStart(this.ObjDB, false, "translateX", w);
  }
}


// ***************************************************************
// Inizio animazione tramite webkit (se si puo')
// ***************************************************************
GFX.prototype.WebKitPreviewStart = function()
{
  if (this.WillBeWebKit())
  {
    var h = this.Flin?this.ObjH+2*this.ToolH:-this.ObjH-2*this.ToolH;
    this.WebKitTranslateStart(this.Obj.PreviewFrame.ContentBox, true, "translateY", h);
  }
}

// **************************************************
// Start dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.ZoneStart = function()
{
  this.Wep = RD3_DesktopManager.WebEntryPoint;
  //
  // Per prima cosa faccio adattare la docked in modo da sapere la dimensione corretta (solo se e' un animazione di apertura)
  if (this.Flin)
  {
    var scz = this.Wep.GetScreenZone(this.ZonePos);
    scz.AdaptDocked();
    scz.AdaptLayout();
    //
    if (this.Obj)
    {
      this.Obj.SetActive(true,true);
      //
      // Rendo visibile la docked (senza far scattare animazioni innestate!)
      this.Obj.SetVisible(true, false);
      this.Obj.AdaptLayout();
    }
  }
  // Leggo la dimensione che mi interessa a seconda della posizione della Docked e la dimensione totale dello spazio per le Form
  if (this.ZonePos==RD3_Glb.FORMDOCK_LEFT)
  {
    this.ObjD = this.Wep.LeftDockedBox.offsetWidth;
    this.TotalD = this.Wep.WepBox.clientWidth - ((this.Wep.HasSideMenu())?this.Wep.SideMenuBox.offsetWidth:0) - this.Wep.RightDockedBox.offsetWidth;
  }
  if (this.ZonePos==RD3_Glb.FORMDOCK_TOP)
  {
    this.ObjD = this.Wep.TopDockedBox.offsetHeight;
    this.TotalD = this.Wep.WepBox.clientHeight - this.Wep.StatusBarBox.offsetHeight - this.Wep.ToolBarBox.offsetHeight - this.Wep.HeaderBox.offsetHeight - this.Wep.BottomDockedBox.offsetHeight;
  }
  if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT)
  {
    this.ObjD = this.Wep.RightDockedBox.offsetWidth;
    this.TotalD = this.Wep.WepBox.clientWidth - ((this.Wep.HasSideMenu())?this.Wep.SideMenuBox.offsetWidth:0) - this.Wep.LeftDockedBox.offsetWidth;
  }
  if (this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
  {
    this.ObjD = this.Wep.BottomDockedBox.offsetHeight;
    this.TotalD = this.Wep.WepBox.clientHeight - this.Wep.StatusBarBox.offsetHeight - this.Wep.ToolBarBox.offsetHeight - this.Wep.HeaderBox.offsetHeight - this.Wep.TopDockedBox.offsetHeight;
  }
  //
  // Calcolo il top ed il left dell'area destinata a contenere le form
  this.FormsTop = this.Wep.StatusBarBox.offsetHeight+this.Wep.ToolBarBox.offsetHeight+this.Wep.HeaderBox.offsetHeight + (this.ZonePos==RD3_Glb.FORMDOCK_TOP ? 0 : this.Wep.TopDockedBox.offsetHeight);
  this.FormsLeft = ((this.Wep.HasSideMenu())?this.Wep.SideMenuBox.offsetWidth:0);
  //
  this.Wep.RecalcLayout = false;
  //
  if (this.Flin)  // Entrata
  {
    this.Wep.FormsBox.style.left = this.FormsLeft+(this.ZonePos==RD3_Glb.FORMDOCK_LEFT ? 0 : this.Wep.LeftDockedBox.offsetWidth)+"px";
    this.Wep.FormsBox.style.top = this.FormsTop+"px";
    //
    this.Wep.LeftDockedBox.style.top = this.FormsTop + "px";
    this.Wep.RightDockedBox.style.top = this.FormsTop + "px";
    //
    if (this.ZonePos==RD3_Glb.FORMDOCK_LEFT)
    {
      this.Wep.LeftDockedBox.style.width = "0px";
      this.Wep.LeftDockedBox.style.top = this.FormsTop + "px";
      this.Wep.LeftDockedBox.style.left = this.FormsLeft + "px";
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_TOP)
    {
      this.Wep.TopDockedBox.style.height = "0px";
      this.Wep.TopDockedBox.style.top = this.FormsTop + "px";
      this.Wep.TopDockedBox.style.left = this.FormsLeft + "px";
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT)
    {
      this.Wep.RightDockedBox.style.width = "0px";
      this.Wep.RightDockedBox.style.top = this.FormsTop + "px";
      this.Wep.RightDockedBox.style.left = (this.Wep.WepBox.clientWidth) + "px";
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
    {
      this.Wep.BottomDockedBox.style.height = "0px";
      this.Wep.BottomDockedBox.style.top = (this.Wep.WepBox.clientHeight) + "px";
      this.Wep.BottomDockedBox.style.left = this.FormsLeft + "px";
    }
  }
}


// **************************************************
// Tick dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.ZoneTick = function(perc)
{
  if (this.Flin)  // Entrata
  {
    if (this.ZonePos==RD3_Glb.FORMDOCK_LEFT)
    {
      var w = this.ObjD*perc;
      //
      this.Wep.LeftDockedBox.style.width = w + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      this.Wep.FormsBox.style.left = (this.FormsLeft + w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.LeftDockedBox.scrollLeft = this.ObjD - w;
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_TOP)
    {
      var h = this.ObjD*perc;
      //
      this.Wep.TopDockedBox.style.height = h + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.FormsBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.LeftDockedBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.RightDockedBox.style.top = (this.FormsTop + h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.TopDockedBox.scrollTop = this.ObjD - h;
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT)
    {
      var w = this.ObjD*perc;
      //
      this.Wep.RightDockedBox.style.width = w + "px";
      this.Wep.RightDockedBox.style.left = (this.Wep.WepBox.clientWidth - w) + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.RightDockedBox.scrollLeft = 0;
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
    {
      var h = this.ObjD*perc;
      //
      this.Wep.BottomDockedBox.style.height = h + "px";
      this.Wep.BottomDockedBox.style.top = (this.Wep.WepBox.clientHeight - h) + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.LeftDockedBox.style.height = (this.TotalD - h) +"px";
      this.Wep.RightDockedBox.style.height = (this.TotalD - h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.BottomDockedBox.scrollTop = 0;
    }
  }
  else          // Uscita
  {
    if (this.ZonePos==RD3_Glb.FORMDOCK_LEFT)
    {
      var w = this.ObjD*(1-perc);
      //
      this.Wep.LeftDockedBox.style.width = w + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      this.Wep.FormsBox.style.left = (this.FormsLeft + w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.LeftDockedBox.scrollLeft = this.ObjD - w;
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_TOP)
    {
      var h = this.ObjD*(1-perc);
      //
      this.Wep.TopDockedBox.style.height = h + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.FormsBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.LeftDockedBox.style.top = (this.FormsTop + h) +"px";
      this.Wep.RightDockedBox.style.top = (this.FormsTop + h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.TopDockedBox.scrollTop = this.ObjD - h;
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT)
    {
      var w = this.ObjD*(1-perc);
      //
      this.Wep.RightDockedBox.style.width = w + "px";
      this.Wep.RightDockedBox.style.left = (this.Wep.WepBox.clientWidth - w) + "px";
      this.Wep.FormsBox.style.width = (this.TotalD - w) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.RightDockedBox.scrollLeft = 0;
    }
    if (this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
    {
      var h = this.ObjD*(1-perc);
      //
      this.Wep.BottomDockedBox.style.height = h + "px";
      this.Wep.BottomDockedBox.style.top = (this.Wep.WepBox.clientHeight - h) + "px";
      this.Wep.FormsBox.style.height = (this.TotalD - h) +"px";
      this.Wep.LeftDockedBox.style.height = (this.TotalD - h) +"px";
      this.Wep.RightDockedBox.style.height = (this.TotalD - h) +"px";
      //
      if (this.Tipo == "scroll")
        this.Wep.BottomDockedBox.scrollTop = 0;
    }
  }
}


// **************************************************
// Fine dell'animazione di apertura/chiusura docked
// **************************************************
GFX.prototype.ZoneFinish = function()
{
  if (!this.Wep)
      this.Wep = RD3_DesktopManager.WebEntryPoint;
  //
  if (this.Flin)    // Apertura Docked
  {
    var scz = this.Wep.GetScreenZone(this.Obj.DockType);
    scz.AdaptLayout();
    //
    this.Wep.CmdObj.ActiveFormChanged();
    this.Wep.IndObj.ActiveFormChanged();
    this.Wep.TimerObj.ActiveFormChanged();
    //
    // Se il pulsante chiudi tutto e' nascosto lo devo mostrare
    this.Wep.HandleCloseAllVisibility();
    //
    if (this.Wep.ActiveForm)
      RD3_DesktopManager.HandleFocus2(this.Wep.ActiveForm.Identifier,0);
    //
    // Faccio l'adapt di tutte le form
    this.Wep.AdaptLayout();
  }
  else      // Chiusura Docked
  {
    // Puo' essere o un animazione di chiusura oppure una animazione di hide form:
    // CloseFormAnimation distingue i due casi..
    if (this.CloseFormAnimation)
    { 
      // Distruggo la form
      if (this.Obj)
        this.Obj.Unrealize();
      //
      // Tolgo la form dallo stackform
      var n = this.Wep.StackForm.length;
      for (var i=0; i<n; i++)
      {
        var f = this.Wep.StackForm[i];
        if (f.Identifier==this.IdxForm)
        {
          this.Wep.StackForm.splice(i, 1);
          break;
        } 
      }
    }
    else
    {
      if (this.Obj)
        this.Obj.SetVisible(false,false);
      //
      // Faccio l'adapt di tutte le form
      this.Wep.AdaptLayout();
    }
    //
    // Gestisco i Command Set, gli indicatori ed i Timer
    this.Wep.CmdObj.ActiveFormChanged();
    this.Wep.IndObj.ActiveFormChanged();
    this.Wep.TimerObj.ActiveFormChanged();
  }
}

GFX.prototype.UnpinnedStart = function()
{
  this.Wep = RD3_DesktopManager.WebEntryPoint;
  var scz = this.Wep.GetScreenZone(this.ZonePos);
  this.ObjD = scz.ZoneSize;
  this.ObjBaseW = RD3_ClientParams.ZoneUnpinnedSize();
  if (scz.TabVisibility==RD3_Glb.SCRZONE_HIDTAB)
    this.ObjBaseW = 0;
  //
  this.BaseObjLeft = this.Wep.WepBox.offsetWidth - scz.ZoneSize - (this.Wep.MenuType==RD3_Glb.MENUTYPE_RIGHTSB ? this.Wep.SideMenuBox.offsetWidth : 0) - 5;
  this.BaseObjTop =  this.Wep.WepBox.offsetHeight - scz.ZoneSize - (this.Wep.MenuType==RD3_Glb.MENUTYPE_TASKBAR ? this.Wep.SideMenuBox.offsetHeight : 0) - 5;  
  //
  if (this.Flin)  // Entrata
  {
    if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT || this.ZonePos==RD3_Glb.FORMDOCK_LEFT)
      this.Obj.style.width = this.ObjD + "px";
    if (this.ZonePos==RD3_Glb.FORMDOCK_TOP || this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
      this.Obj.style.height = this.ObjD + "px";
    //
    scz.TabView.ContentBox.style.visibility = "hidden";
    scz.TabView.SetHeight(scz.ZoneSize);
    scz.AdaptLayout();
    //
    this.ObjD = this.ObjD - this.ObjBaseW;
    //
    if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT || this.ZonePos==RD3_Glb.FORMDOCK_LEFT)
      this.Obj.style.width = this.ObjBaseW+"px";
    if (this.ZonePos==RD3_Glb.FORMDOCK_TOP || this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
      this.Obj.style.height = this.ObjBaseW+"px";
    //
    scz.TabView.ContentBox.style.visibility = ""
    //
    if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT)
      this.Obj.scrollLeft = this.ObjBaseW + this.ObjD;
    if (this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
      this.Obj.scrollTop = this.ObjBaseW + this.ObjD;
  }
}

GFX.prototype.UnpinnedTick = function(perc)
{
  var w = this.ObjBaseW + (this.ObjD * perc);
  //
  if (!this.Flin)  // Uscita
  {
    w = this.ObjBaseW + (this.ObjD * (1-perc));
  }
  //
  this.Obj.scrollLeft = 0;
  this.Obj.scrollTop = 0;
  //
  if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT || this.ZonePos==RD3_Glb.FORMDOCK_LEFT)
  {
    this.Obj.style.width = w + "px";
    this.Obj.scrollLeft = 0;
    //
    if (this.ZonePos==RD3_Glb.FORMDOCK_RIGHT)
    {
      this.Obj.style.left = (this.BaseObjLeft + this.ObjBaseW + this.ObjD - w) + "px";
      this.Obj.scrollLeft = this.ObjBaseW + this.ObjD;
    }
  }
  if (this.ZonePos==RD3_Glb.FORMDOCK_TOP || this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
  {
    this.Obj.style.height = w + "px";
    //
    if (this.ZonePos==RD3_Glb.FORMDOCK_BOTTOM)
    {
      this.Obj.style.top = (this.BaseObjTop + this.ObjBaseW + this.ObjD - w) + "px";
      this.Obj.scrollTop = this.ObjBaseW + this.ObjD;
    }
  }
}

GFX.prototype.UnpinnedFinish = function()
{
  if (!this.Wep)
      this.Wep = RD3_DesktopManager.WebEntryPoint;
  //
  if (!this.Flin)
  {
    var scz = this.Wep.GetScreenZone(this.ZonePos);
    scz.TabView.SetOnlyTabs(true);
    scz.TabView.SetSelectedPage(-1);
    //
    if (!RD3_DesktopManager.WebEntryPoint.InResponse && !this.Skipped)
      RD3_DesktopManager.WebEntryPoint.AdaptLayout();
    else
      RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
  }
}
// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PopupFrame: rappresenta la base di tutti gli
// oggetti che appaiono in un contesto "popup"
// ************************************************

function PopupFrame(pform, owner)
{
  // Proprieta' di questo oggetto di modello
  // Sono le proprieta' base di tutti i frame
  this.Left = 0;            // Posizione del frame nella finestra browser
  this.Top = 0;             // Posizione del frame nella finestra browser
  this.Width = 0;           // Dimensioni del frame nella finestra browser
  this.Height = 0;          // Dimensioni del frame nella finestra browser
  this.Centered = true;     // Centrato nella finestra?
  this.Modal = true;        // Modalita' modale attiva?
  this.AutoClose = false;   // Permette all'utente di chiudere cliccando fuori
  this.ModalAnim = false;   // Forza animazione di form modale (dal basso)
  this.HasCaption = true;   // Ha la caption?
  this.WepClick = true;     // Avvisa il webentrypoint dei click?
  this.CanMove = true;      // Finestra spostabile?
  this.CanResize = false;               // Finestra ridimensionabile? (no di default..)
  this.Borders = 0;                     // RD3_Glb.BORDER_DEFAULT // Tipo di bordo della form popup
  this.RestoreFocus = true;      // Ripristinare il fuoco alla chiusura
  //
  // Identificatore di questo oggetto, creato di default solo se non e' gia' 
  // gia' stato creato dalla classe che lo estende
  if (!this.Identifier)
    this.Identifier = "POPUP" + Math.floor(Math.random() * 1000);
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;  // Se vero, gli oggetti del DOM sono gia' stati creati
  this.NoOpacity = true;  // Le finestre di popup non vogliono la trasparenza durante il D&D
  //
  // Oggetti visuali riguardanti la form
  this.PopupBox = null;   // Div globale del popup
  this.CoverBox = null;   // Div che copre totalmente il popup usato quando inattivo
  this.ModalBox = null;   // Div per bloccare l'input alle finestre sottostanti
  //
  this.CaptionBox = null; // Div che contiene la barra del titolo
  this.ContentBox = null; // Div che contiene il contenuto del frame
  //
  // Variabili per la gestione del bordo arrotondato
  this.CornerTL = null;     // Div con l'angolo da mostrare in alto a sinistra
  this.CornerTR = null;     // Div con l'angolo da mostrare in alto a destra
  this.CornerBL = null;     // Div con l'angolo da mostrare in basso a sinistra
  this.CornerBR = null;     // Div con l'angolo da mostrare in basso a destra
  this.BorderTop = null;    // Div con il bordo in alto
  this.BorderBottom = null; // Div con il bordo in basso
  this.BorderLeft = null;   // Div con il bordo a sinistra
  this.BorderRight = null;  // Div con il bordo a destra
  //
  // Variabili per la gestione del fuoco (caso MODALE)
  this.LastActiveObject = null;  // Oggetto che aveva il fuoco all'apertura della popup
  this.LastActiveElement = null; // Elemento che aveva il fuoco all'apertura della popup
  //
  this.TheForm = (pform)?pform:null; // Webform contenuta in questo popup
  this.Owner = owner;                // Oggetto che possiede la popup (non la form)
  this.ObjToAttach = null;           // Oggetto DOM a cui attaccarsi (per posizionamento e baffo) - puo' anche essere un Object contenente x e y (Point) - vedi Command::Popup
}


// ***************************************************************
// Setter delle proprieta'
// ***************************************************************
PopupFrame.prototype.SetLeft = function(value)
{
  if (value!=undefined)
    this.Left = value;
  //
  if (this.Realized)
  {
    this.PopupBox.style.left = this.Left + "px";
  }
}

PopupFrame.prototype.SetTop = function(value)
{
  if (value!=undefined)
    this.Top = value;
  //
  if (this.Realized)
  {
    this.PopupBox.style.top = this.Top + "px";
  }
}

PopupFrame.prototype.SetWidth = function(value)
{
  if (value!=undefined)
    this.Width = value;
  //
  if (this.Realized && this.Width > 0)
  {
    this.PopupBox.style.width = this.Width + "px";
  }
}

PopupFrame.prototype.SetHeight = function(value)
{
  if (value!=undefined)
    this.Height = value;
  //
  if (this.Realized && this.Height > 0)
  {
    this.PopupBox.style.height = this.Height + "px";
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// hidden : true per le popup delay a doppia comparsa, non devo subito fare l'animazione
// ***************************************************************
PopupFrame.prototype.Realize = function(cls, hidden)
{
  if (!RD3_Glb.IsMobile())
    cls="";
  this.Classe = cls;
  //
  // Se e' modale, aggiungo prima il box modale
  if (this.Modal)
  {
    this.ModalBox = document.createElement("div");
    this.ModalBox.className = "popup-modal-frame"+cls;
    //
    if (!RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
      this.ModalBox.style.zIndex = 10;
    //
    if (this.AutoClose)
    {
      var fstring = "return RD3_DesktopManager.CallEventHandler('" + this.Identifier + "', 'OnClickOut', ev)";
      if (RD3_DesktopManager.WebEntryPoint.UseZones())
        fstring = "ev.stopPropagation(); " + fstring;
      //
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        this.ModalBox.ontouchstart = new Function("ev", fstring);
      else
        this.ModalBox.onmousedown = new Function("ev", fstring);
    }
    else
      this.ModalBox.onclick = new Function("ev","return RD3_DesktopManager.WebEntryPoint.OnClick(ev);");
    //
    this.ModalBox.id = this.Identifier + ":mb";
    if (RD3_Glb.IsMobile())
    {
      if (!hidden)
        window.setTimeout("document.getElementById('"+this.ModalBox.id+"').style.opacity = 1;", 5);
      RD3_DesktopManager.WebEntryPoint.WepBox.appendChild(this.ModalBox);
    }
    else
    {
      document.body.appendChild(this.ModalBox);
    }    
  }
  //
  // Creo il popup-box e lo aggiungo "prima" al DOM
  this.PopupBox = document.createElement("div");
  this.PopupBox.className = "popup-frame-container"+cls;
  this.PopupBox.id = this.Identifier + ":pb";
  //
  if (cls=="-message-box")
  {
    if (!hidden)
      window.setTimeout("RD3_Glb.SetTransform(document.getElementById('"+this.PopupBox.id+"'), 'scale3d(1,1,1)');", 5);
  }
  if (cls=="-modal" || this.ModalAnim)
  { 
    if (RD3_Glb.IsIE(10, true))
      this.PopupBox.style.visibility = "hidden";
    //
    RD3_Glb.SetTransform(this.PopupBox, "translate3d(0px,"+(RD3_DesktopManager.WebEntryPoint.WepBox.offsetHeight-this.Top)+"px,0px)");
    RD3_Glb.SetTransitionProperty(this.PopupBox, "-webkit-transform");
    RD3_Glb.AddEndTransaction(this.PopupBox, new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)"), false);
    //
    if (RD3_Glb.IsIE(10, true))
      window.setTimeout("document.getElementById('"+this.PopupBox.id+"').style.visibility=''; RD3_Glb.SetTransform(document.getElementById('"+this.PopupBox.id+"'), 'translate3d(0px,0px,0px)');", 100);
    else
      window.setTimeout("RD3_Glb.SetTransform(document.getElementById('"+this.PopupBox.id+"'), 'translate3d(0px,0px,0px)');", 5);
  }
  if (cls=="-popover")
    window.setTimeout(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)"), 250);
  //
  // Se devo mettere i bordi piccoli li imposto con la classe
  if (this.Borders == RD3_Glb.BORDER_THIN || RD3_Glb.IsIE(6))
  {
    RD3_Glb.AddClass(this.PopupBox, "popup-border-thin"+cls);
  }
  //
  if (this.HasCaption)
  {
    this.CaptionBox = document.createElement("div");
    this.CaptionBox.className = "popup-frame-caption"+cls;
    this.CaptionBox.id = this.Identifier + ":cap";
    this.PopupBox.appendChild(this.CaptionBox);
  }
  //
  this.ContentBox = document.createElement("div");
  this.ContentBox.className = "popup-frame-content"+cls;
  //
  this.PopupBox.appendChild(this.ContentBox);
  //
  if (RD3_Glb.IsMobile())
    RD3_DesktopManager.WebEntryPoint.WepBox.appendChild(this.PopupBox);
  else
    document.body.appendChild(this.PopupBox);
  //
  this.PopupBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
  //
  this.Realized = true;
  //
  this.SetLeft();
  this.SetTop();
  this.SetWidth();
  this.SetHeight();
  this.AttachTo();
  //
  // Creo gli oggetti usati per mostrare il bordo attorno alla form (se devo mostrare il bordo THICK)
  if (this.Borders == RD3_Glb.BORDER_THICK && !RD3_Glb.IsIE(6) && !RD3_ServerParams.Theme.startsWith("zen"))
  {
    this.BorderTop = document.createElement("div");
    this.BorderTop.className = "popup-border-top";
    this.BorderBottom = document.createElement("div");
    this.BorderBottom.className = "popup-border-bottom";
    this.BorderLeft = document.createElement("div");
    this.BorderLeft.className = "popup-border-left";
    this.BorderRight = document.createElement("div");
    this.BorderRight.className = "popup-border-right";
    this.CornerTL = document.createElement("div");
    this.CornerTL.className = "popup-corner-top-left";
    this.CornerTR = document.createElement("div");
    this.CornerTR.className = "popup-corner-top-right";
    this.CornerBL = document.createElement("div");
    this.CornerBL.className = "popup-corner-bottom-left";
    this.CornerBR = document.createElement("div");
    this.CornerBR.className = "popup-corner-bottom-right";
    //
    var idt = this.TheForm ? this.TheForm.Identifier : this.Identifier;
    this.BorderTop.setAttribute("id", idt+":bd0");
    this.BorderBottom.setAttribute("id", idt+":bd1");
    this.BorderLeft.setAttribute("id", idt+":bd2");
    this.BorderRight.setAttribute("id", idt+":bd3");
    this.CornerTL.setAttribute("id", idt+":bd4");
    this.CornerTR.setAttribute("id", idt+":bd5");
    this.CornerBL.setAttribute("id", idt+":bd6");
    this.CornerBR.setAttribute("id", idt+":bd7");
    //
    this.PopupBox.appendChild(this.BorderTop);
    this.PopupBox.appendChild(this.BorderBottom);
    this.PopupBox.appendChild(this.BorderLeft);
    this.PopupBox.appendChild(this.BorderRight);
    this.PopupBox.appendChild(this.CornerTL);
    this.PopupBox.appendChild(this.CornerTR);
    this.PopupBox.appendChild(this.CornerBL);
    this.PopupBox.appendChild(this.CornerBR);
  }
  //
  if (!RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
    this.PopupBox.style.zIndex = 10;
  //
  // Mi aggiungo nella mappa degli oggetti
  RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
PopupFrame.prototype.AdaptLayout = function()
{ 
  // Riposiziono e ridimensiono il contenuto al form modale
  if (this.CaptionBox)
  {
    this.ContentBox.style.top = this.CaptionBox.offsetHeight + "px";
    RD3_Glb.AdaptToParent(this.CaptionBox, 0, -1);
  }
  //
  var ox = this.Classe=="-popover"?4:-1;
  var oy = this.Classe=="-popover"?2:0;
  //
  // non sposto nel caso di quadro
  if (RD3_Glb.IsQuadro())
  {
    ox = 0;
    oy = 0;
  }
  //
  RD3_Glb.AdaptToParent(this.ContentBox, ox, ((this.CaptionBox)?this.CaptionBox.offsetHeight:0)+oy);
  //
  // Gestisco la centratura nello schermo
  if (this.Centered)
  {
    var lft = (RD3_DesktopManager.WebEntryPoint.WepBox.clientWidth - this.PopupBox.offsetWidth) / 2;
    lft = lft<0? 0: lft;
    this.SetLeft(lft);
    //
    var tp = (RD3_DesktopManager.WebEntryPoint.WepBox.clientHeight - this.PopupBox.offsetHeight) / 2;
    tp = tp<0? 0: tp;
    this.SetTop(tp);
  }
  //
  // Posiziono attorno al frame gli oggetti visibili
  if (this.Borders == RD3_Glb.BORDER_THICK && !RD3_Glb.IsIE(6) && !RD3_ServerParams.Theme.startsWith("zen"))
  {
    if (this.BorderTop.style.display != "none")
    {
      this.BorderTop.style.top = (0 - this.BorderTop.offsetHeight) + "px";
      this.BorderTop.style.left = (0) + "px";
      this.BorderTop.style.width = (this.Width) + "px";
    }
    if (this.BorderBottom.style.display != "none")
    {
      this.BorderBottom.style.top = (0 + this.Height) + "px";
      this.BorderBottom.style.left = (0) + "px";
      this.BorderBottom.style.width = (this.Width) + "px";
    }
    if (this.BorderLeft.style.display != "none")
    {
      this.BorderLeft.style.left = (0 - this.BorderLeft.offsetWidth) + "px";
      this.BorderLeft.style.top = (0) + "px";
      this.BorderLeft.style.height = (this.PopupBox.offsetHeight) + "px";
    }
    if (this.BorderRight.style.display != "none")
    {
      this.BorderRight.style.left = (0 + this.Width) + "px";
      this.BorderRight.style.top = (0) + "px";
      this.BorderRight.style.height = (this.Height) + "px";
    }
    if (this.CornerTL.style.display != "none")
    {
      this.CornerTL.style.left = this.BorderLeft.offsetLeft + "px";
      this.CornerTL.style.top = this.BorderTop.offsetTop + "px";
    }
    if (this.CornerTR.style.display != "none")
    {
      this.CornerTR.style.left = this.BorderRight.offsetLeft + "px";
      this.CornerTR.style.top = this.BorderTop.offsetTop + "px";
    }
    if (this.CornerBL.style.display != "none")
    {
      this.CornerBL.style.left = this.BorderLeft.offsetLeft + "px";
      this.CornerBL.style.top = this.BorderBottom.offsetTop + "px";
    }
    if (this.CornerBR.style.display != "none")
    {
      this.CornerBR.style.left = this.BorderRight.offsetLeft + "px";
      this.CornerBR.style.top = this.BorderBottom.offsetTop + "px";
    }
  }
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PopupFrame.prototype.Unrealize = function()
{ 
  if (this.IDScroll)
    this.IDScroll.Unrealize();
  this.IDScroll = null;
  //
  if (this.OrgContentParent)
  {
    while(this.ContentBox.firstChild)
    {
      var obj = this.ContentBox.firstChild;
      this.ContentBox.removeChild(obj);
      this.OrgContentParent.appendChild(obj);
    }
  }
  if (this.OrgHeaderParent)
  {
    var obj = this.CaptionBox.firstChild;
    this.CaptionBox.removeChild(obj);
    this.OrgHeaderParent.insertBefore(obj,this.OrgHeaderSibling);
  }
  //
  // Su Chrome 29 a volte da' errore per il popupcontrol.. non si capisce chi l'annulla.. forse il garbage collector..
  if (this.PopupBox)
    this.PopupBox.parentNode.removeChild(this.PopupBox);
  if (this.ModalBox)
    this.ModalBox.parentNode.removeChild(this.ModalBox);
  if (this.ArrowBox)
    this.ArrowBox.parentNode.removeChild(this.ArrowBox);
  if (this.ArrowBorder)
    this.ArrowBorder.parentNode.removeChild(this.ArrowBorder);
  //
  // Mi tolgo dalla mappa degli oggetti
  RD3_DesktopManager.ObjectMap[this.Identifier] = null;
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Rimuovo i riferimenti dal DOM
  this.PopupBox = null; 
  this.CoverBox = null; 
  this.ModalBox = null;   
  this.ArrowBox = null;   
  this.CaptionBox = null; 
  this.ContentBox = null; 
  this.TheForm = null;
  //
  this.Realized = false;
}


// ********************************************************************************
// Realizza e mostra a video questa popup
// ********************************************************************************
PopupFrame.prototype.Open = function()
{ 
  if (this.Modal)
  {
    // Memorizzo l'oggetto che aveva il fuoco
    this.LastActiveObject = RD3_KBManager.ActiveObject;
    this.LastActiveElement = RD3_KBManager.ActiveElement;
  }
  //
  if (!this.Realized)
    this.Realize();
  //
  if (this.Modal)
  {
    try
    {
      this.ContentBox.tabIndex = 0;
      this.ContentBox.focus();
      RD3_KBManager.ActiveObject = this;
      RD3_KBManager.ActiveElement = this.ContentBox;
    }
    catch(ex)
    {
      document.body.focus();
    }
  }
  //
  this.AdaptLayout();
}


// ********************************************************************************
// Chiude la finestra
// ********************************************************************************
PopupFrame.prototype.Close = function()
{ 
  RD3_DDManager.RemovePopup(this);
  //
  if (RD3_Glb.IsMobile())
  {
     var ea = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'Close2', ev)");
    //
    // Su IE Mobile non sempre scatta l'endTransaction lasciando il poup frame in uno stato sbagliato, quindi uso un semplice timer per impostare la chiusura
    if (RD3_Glb.IsIE())
      window.setTimeout(ea, 500);
    else
      RD3_Glb.AddEndTransaction(this.PopupBox, ea, false); 
    //
    this.ModalBox.style.opacity = 0;
    //
    // Qui mi preparo per la chiusura tramite animazione
    if (this.Classe=="-message-box")
    {
      RD3_Glb.SetTransitionProperty(this.PopupBox, "opacity");
      this.PopupBox.style.opacity = 0;
    }
    else if (this.Classe=="-modal" || this.ModalAnim)
    {
      RD3_Glb.SetTransform(this.PopupBox, "translate3d(0px,"+(RD3_DesktopManager.WebEntryPoint.WepBox.offsetHeight-this.Top)+"px,0px)");
    }
    else if (this.Classe=="-popover")
    {
      this.PopupBox.style.opacity = 0;
      if (this.ArrowBox) this.ArrowBox.style.opacity = 0;
      if (this.ArrowBorder) this.ArrowBorder.style.opacity = 0;
      //
      this.Close2();
    }
  }
  else
  {
    this.Close2();
  }
}


// ********************************************************************************
// Chiude la finestra
// ********************************************************************************
PopupFrame.prototype.Close2 = function()
{ 
  if (this.Owner && this.Owner.OnClosePopup)
    this.Owner.OnClosePopup(this);
  //
  if (RD3_Glb.IsMobile() && this.TheForm)
    this.TheForm.Unrealize();
  else
    this.Unrealize();
  //
  // Voglio evitare che si apra qualunque tastiera
  if (RD3_Glb.IsAndroid())
  {
    RD3_DDManager.ChompClick();
  }
  else if (this.Modal && !RD3_Glb.IsMobile() && this.RestoreFocus)
  {
    // Ripristino l'oggetto che aveva il fuoco
    RD3_KBManager.ActiveObject = this.LastActiveObject;
    RD3_KBManager.ActiveElement = this.LastActiveElement;
    RD3_KBManager.CheckFocus = true;
  }
}


// ***********************************************************************************
// Restituisce true se a questo oggetto possono essere applicate delle trasformazioni
// ***********************************************************************************
PopupFrame.prototype.IsTransformable = function()
{
  return (this.CanMove || this.CanResize);
}


// ********************************************************************************
// Restituisce True se questo oggetto puo' essere spostato
// ********************************************************************************
PopupFrame.prototype.IsMoveable = function()
{
  return this.CanMove;
}


// ********************************************************************************
// Restituisce True se questo oggetto puo' essere ridimensionato
// ********************************************************************************
PopupFrame.prototype.IsResizable = function()
{
  return this.CanResize;
}


// ********************************************************************************
// Resituisce l'oggetto DOM su cui deve essere effettuata la trasformazione
// ********************************************************************************
PopupFrame.prototype.DropElement = function()
{
  return this.PopupBox;
}


// ********************************************************************************
// Metodo chiamato per effettuare la trasformazione
// ********************************************************************************
PopupFrame.prototype.OnTransform = function(x, y, w, h, evento)
{
  if (this.CanMove)
  {
    this.SetLeft(x);
    this.SetTop(y);
  }
  if (this.CanResize)
  {
    this.SetHeight(h);
    this.SetWidth(w);
  }
}

// ********************************************************************************
// Metodo scatenato dal click sul frame
// ********************************************************************************
PopupFrame.prototype.OnClick = function(ev)
{
  // Avverto Wep del click
  if (this.WepClick)
    RD3_DesktopManager.WebEntryPoint.OnClick(ev);
  //
  // Devo attivare la form?
   if (this.TheForm)
   {
     this.TheForm.OnFLClick(ev,true);
   }
  //
  return true;
}


// ********************************************************************************
// Porta a galla il popup, sopra gli altri
// ********************************************************************************
PopupFrame.prototype.BringToFront = function()
{
  if (this.PopupBox)
  {
    // Salvo e ripristino la posizione delle scrollbar, in questo modo non vengono perse
    if (this.TheForm)
      this.TheForm.SaveScrollPos();
    //
    this.PopupBox.parentNode.removeChild(this.PopupBox);
    //
    if (RD3_Glb.IsMobile())
      RD3_DesktopManager.WebEntryPoint.WepBox.appendChild(this.PopupBox);
    else
      document.body.appendChild(this.PopupBox);
    //
    if (this.TheForm)
      this.TheForm.SetScrollPos();
  }
}


// ********************************************************************************
// Imposta il popup come active o meno
// ********************************************************************************
PopupFrame.prototype.SetActive = function(value)
{
  if (!value && !this.CoverBox)
  {
    this.CoverBox = document.createElement("div");
    this.PopupBox.appendChild(this.CoverBox);
  }
  if (this.CoverBox)
  {
    this.CoverBox.className = "form-cover"+((value)?"":"-inactive");
  }
}


// ********************************************************************************
// Rende visibile la form o meno
// ********************************************************************************
PopupFrame.prototype.SetVisible= function(value)
{
  this.PopupBox.style.display = value?"":"none";
}


// ********************************************************************************
// Mostra o meno i bordi "grossi"
// ********************************************************************************
PopupFrame.prototype.ShowThickBorders= function(value)
{
  if (this.Borders!=RD3_Glb.BORDER_THICK || RD3_Glb.IsIE(6) || RD3_ServerParams.Theme.startsWith("zen"))
    return;
  //
  if (value)
  {
    RD3_Glb.RemoveClass(this.PopupBox, "popup-border-thin");
    this.BorderTop.style.display = "";
    this.BorderBottom.style.display = "";
    this.BorderLeft.style.display = "";
    this.BorderRight.style.display = "";
    this.CornerTL.style.display = "";
    this.CornerTR.style.display = "";
    this.CornerBL.style.display = "";
    this.CornerBR.style.display = "";
  }
  else
  {
    this.BorderTop.style.display = "none";
    this.BorderBottom.style.display = "none";
    this.BorderLeft.style.display = "none";
    this.BorderRight.style.display = "none";
    this.CornerTL.style.display = "none";
    this.CornerTR.style.display = "none";
    this.CornerBL.style.display = "none";
    this.CornerBR.style.display = "none";
    RD3_Glb.AddClass(this.PopupBox, "popup-border-thin");
  }
}

// ********************************************************************************
// Applica il cursore al frame
// ********************************************************************************
PopupFrame.prototype.ApplyCursor = function(cn)
{
  if (this.Borders==RD3_Glb.BORDER_THICK && !RD3_Glb.IsIE(6) && !RD3_ServerParams.Theme.startsWith("zen"))
  {
    this.CornerTL.style.cursor = cn;
    this.CornerBL.style.cursor = cn;
    this.CornerTR.style.cursor = cn;
    this.CornerBR.style.cursor = cn;
    this.BorderLeft.style.cursor = cn;
    this.BorderRight.style.cursor = cn;
    this.BorderTop.style.cursor = cn;
    this.BorderBottom.style.cursor = cn;
  }
}


// ********************************************************************************
// Preleva un header ed un contenuto
// ********************************************************************************
PopupFrame.prototype.Host = function(hdrbox, cntbox, scroller, scrollTopMargin)
{ 
  if (hdrbox)
  {
    this.OrgHeaderParent = hdrbox.parentNode;
    this.OrgHeaderSibling = hdrbox.nextSibling;
    hdrbox.parentNode.removeChild(hdrbox);
    this.CaptionBox.appendChild(hdrbox);
  }
  if (cntbox)
  {
    this.OrgContentParent = cntbox;
    while (cntbox.firstChild)
    {
      var obj = cntbox.firstChild;
      obj.parentNode.removeChild(obj);
      this.ContentBox.appendChild(obj);
    }
    //
    if (scroller)
    {
      var scr = obj;
      var cnt = this.ContentBox;
      //
      this.IDScroll = new IDScroll(this.Identifier, scr, cnt, this.Owner);
      //
      if (scrollTopMargin)
        this.IDScroll.MarginTop = scrollTopMargin;
    }
  }
}


// ********************************************************************************
// Preleva un header ed un contenuto
// ********************************************************************************
PopupFrame.prototype.HostForm = function(form)
{ 
  var tb = form.GetFirstToolbar();
  if (!tb) 
    tb = form.CaptionBox;
  //
  this.OrgHeaderParent = tb.parentNode;
  this.OrgHeaderSibling = tb.nextSibling;
  tb.parentNode.removeChild(tb);
  this.CaptionBox.appendChild(tb);
  //
  this.OrgContentParent = form.FramesBox.parentNode;
  form.FramesBox.parentNode.removeChild(form.FramesBox);
  this.ContentBox.appendChild(form.FramesBox);
  //
  window.setTimeout("RD3_DesktopManager.CallEventHandler('"+form.Identifier+"', 'AdaptLayout');",50);
}


// ********************************************************************************
// Esegue autoclose se richiesto
// ********************************************************************************
PopupFrame.prototype.OnClickOut = function(hdrbox, cntbox)
{ 
  if (this.AutoClose)
  {
    var ok = true;
    //
    // In caso di autoclose, permetto di mandare un messaggio all'owner
    if (this.Owner && this.Owner.OnAutoClosePopup)
      ok = this.Owner.OnAutoClosePopup(this);
    if (this.TheForm && this.TheForm.OnAutoClosePopup)
      ok = this.TheForm.OnAutoClosePopup(this);
    //
    if (ok) {
      this.Close();
      //
      // hdrbox e' l'evento se la funzione scatta da mouseDown o touchStart.
      // in questo caso blocchiamo l'evento in modo da non dare il fuoco al nuovo oggetto cliccato
      if (hdrbox.preventDefault)
        hdrbox.preventDefault();
    }
  }
}


// ***************************************************************
// Setter delle proprieta'
// ***************************************************************
PopupFrame.prototype.AttachTo = function(value)
{
  if (value!=undefined)
    this.ObjToAttach = value;
  //
  if (this.Realized && this.ObjToAttach)
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    //
    var xp = 0;
    var yp = 0;
    //
    if (this.ObjToAttach.Point)
    {
      xp = this.ObjToAttach.x;
      yp = this.ObjToAttach.y;
    }
    else
    {
      // Considero anche il translate3d...
      xp = RD3_Glb.GetScreenLeft(this.ObjToAttach,true);
      yp = RD3_Glb.GetScreenTop(this.ObjToAttach,true);
      //
      // Se c'e' la tastiera aperta la GetScreenTop torna il valore sbagliato.. allora qui lo rimetto a posto (e' usata in troppi posti..)
      if (RD3_Glb.IsMobile() && this.Type==RD3_Glb.CTRL_CPICKER && document.body.scrollTop>0)
        yp = (yp-document.body.scrollTop>0 ? yp-document.body.scrollTop : yp);
    }
    //
    var w = this.ObjToAttach.offsetWidth;
    var h = this.ObjToAttach.offsetHeight;
    var showArrow = true;
    //
    // Posiziono Popup
    if (RD3_Glb.IsSmartPhone())
    {
      this.SetLeft(0);
      this.SetTop(wep.offsetHeight-this.Height);
    }
    else
    {
      var xfin = xp+(w-this.Width) / 2;
      if (xfin<8)
        xfin = 8;
      if (xfin+this.Width>wep.offsetWidth)
        xfin = wep.offsetWidth-this.Width - 4; // (2px di bordo e 2px di margine da destra)
      this.SetLeft(xfin);
      //
      var sopra=false;
      var yfin = yp+h+12;
      //
      // Sotto non ci sto, sforo.. allora provo a spostarmi sopra
      if (yfin+this.Height>wep.offsetHeight)
      {
        yfin = yp-this.Height-15;
        sopra = true;
      }
      //
      // Non ci sto nemmeno sopra: posso solo mettermi a 0 e nascondere la freccia (tanto copriro' il campo..)
      if (yfin<0)
      {
        yfin = 2;
        showArrow = false;
      }
      //
      this.SetTop(yfin);
    }
    //
    // Creo Arrow
    if (!RD3_Glb.IsSmartPhone() && showArrow)
    {
      if (!this.ArrowBox)
      {
        this.ArrowBox = document.createElement("div");
        this.ArrowBox.setAttribute("id", this.Identifier+":arr");
        this.ArrowBox.className = "popover-arrow-box";
        this.PopupBox.parentNode.insertBefore(this.ArrowBox, this.PopupBox);
      }
      if (!this.ArrowBorder && !sopra && !this.TheForm)
      {
        this.ArrowBorder = document.createElement("div");
        this.ArrowBorder.setAttribute("id", this.Identifier+":arb");
        this.ArrowBorder.className = "popover-arrow-border";
        this.PopupBox.parentNode.appendChild(this.ArrowBorder);
      }
    }
    //
    // Posiziono Arrow
    var xarr = xp+w/2-10;
    if (xarr<this.Left)
      xarr = this.Left + 5; // +5 perche' la left e' per il box quadrato, che poi viene ruotato attorno al centro, diventando piu' largo
    //
    if (this.ArrowBox)
    {
      var topOfs = 10;
      if (RD3_Glb.IsMobile7())
      {
        RD3_Glb.SetTransform(this.ArrowBox, (sopra)?"rotate(225deg)":"");
        this.ArrowBox.style.background = (sopra)?"-webkit-gradient(linear, left top, right bottom, from(white), color-stop(0.5, white), color-stop(0.5, transparent), to(transparent))":"";
        topOfs = 11;
      }
      else
      {
        this.ArrowBox.style.background = (sopra||this.TheForm)?"black":"";
      }
      if (RD3_Glb.IsQuadro())
        xarr +=1;
      this.ArrowBox.style.left = xarr+"px";
      this.ArrowBox.style.top = (sopra?(this.Top+this.Height-12):(this.Top - topOfs))+"px";
    }
    //
    if (this.ArrowBorder)
    {
      this.ArrowBorder.style.top = (this.Top)+"px";
      this.ArrowBorder.style.left = (xarr-2)+"px";
    }
  }
}


// ***************************************************************
// Imposta il titolo "grezzo"
// ***************************************************************
PopupFrame.prototype.SetCaption = function(txt)
{
  if (this.CaptionBox)
  {
    if (!this.CaptionSpan)
    {
      this.CaptionSpan = document.createElement("span");
      this.CaptionSpan.className="popup-caption-span";
      this.CaptionBox.appendChild(this.CaptionSpan);
    }
    this.CaptionSpan.textContent = txt;
    //
    if (RD3_Glb.IsQuadro())
    {
      RD3_Glb.AdjustCaptionPosition(this.CaptionBox, this.CaptionSpan);
    }
  }
}

PopupFrame.prototype.OnEndAnimation= function(evento)
{ 
  // Non tutti i PopupFrame hanno una form (es: PopupControl)
  if (this.TheForm)
  {
    // Le modali vengono adatte in due fasi: la prima fase vengono aperte ma non adattate, alla fine dell'animazione vengono riadattate perche' in questo momento
    // conoscono la loro dimensione. Replichiamo la stessa struttura anche in Mobile
    if (RD3_DesktopManager.WebEntryPoint.InResponse)
      this.TheForm.RecalcLayout = true;
    else
      this.TheForm.AdaptLayout();
  }
  //
  // NPQ01653 : Sul tema Quadro alcuni browser non disegnano il selettore anche se e' presente nel DOM ed e' tutto a posto.. l'unica soluzione e' toglierlo e rimetterlo..
  if (this instanceof PopupControl && RD3_Glb.IsQuadro())
  {
    if (this.Type == RD3_Glb.CTRL_DATETIME || this.Type == RD3_Glb.CTRL_DATE  || this.Type == RD3_Glb.CTRL_TIME)
    {
      this.ContentBox.removeChild(this.DateSelector);
      this.ContentBox.appendChild(this.DateSelector); 
    }
  }
}
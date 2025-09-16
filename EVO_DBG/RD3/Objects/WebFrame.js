// ***************************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe WebFrame: rappresenta la base di tutti i frame visuali
// Le istanze di questa classe sono frame che hanno due figli
// cioe' sono dei semplici contenitori
// Tutti i frame visuali estendono questa classe
// ****************************************************************

function WebFrame(pform)
{
  // Proprieta' di questo oggetto di modello
  // Sono le proprieta' base di tutti i frame
  this.Identifier = "";         // Codice della frame (es: "xxx:3:1", dove xxx e' il tipo di oggetto,
                                // il primo numero e' un frame index e il secondo e' il form index)
  this.Collapsible = true;      // Il frame e' collassabile
  this.Collapsed = false;       // Il frame e' collassato
  this.Lockable = false;        // Il frame gestisce il lock
  this.Locked = false;          // Il frame e' bloccato
  this.Visible = true;          // Il frame e' visibile
  this.Enabled = true;          // Il frame e' abilitato
  this.Image = "";              // Icona da mostrare nella toolbar
  this.Caption = "";            // Titolo del frame (anche HTML)
  this.OrgWidth = 0;            // Larghezza iniziale del frame
  this.OrgHeight = 0;           // Altezza iniziale del frame
  this.Width = 0;               // Larghezza attuale del frame
  this.Height = 0;              // Altezza attuale del frame
  this.MinWidth = 0;            // Larghezza minima del frame
  this.MinHeight = 0;           // Altezza minima del frame
  this.MaxWidth = 9999;         // Larghezza massima del frame
  this.MaxHeight = 9999;        // Altezza massima del frame
  this.Vertical = false;        // Disposizione verticale?
  this.ShowToolbar = true;      // Il frame mostra la toolbar?
  this.ShowStatusBar = true;    // Il frame mostra la status bar?
  this.Scrollbar = 3;           // Quali scrollbar devono essere mostrate? (default RD3_Glb.FORMSCROLL_BOTH)
  this.SmallIcons = false;      // Usare icone piccole nella toolbar?
  this.OnlyContent = false;     // Mostrare solo contenuto senza toolbar ne bordi?
  this.CanDrag = false;         // Questo frame puo' effettuare drag?
  this.CanDrop = false;         // Questo frame puo' effettuare drop?
  this.HandledKeys = 0;         // Tasti da intercettare a livello di frame
  this.FrameBorder = false;     // Mostrare il bordo tra i due frame?
  //this.ClassName = null;      // Classe specifica da applicare al frame
  //
  // Oggetti secondari gestiti da questo oggetto di modello
  this.ChildFrame1 = null; // Primo frame che suddivide questo
  this.ChildFrame2 = null; // Secondo frame che suddivide questo
  //  
  // Altre variabili legate al frame
  this.WebForm = pform;                 // Form Padre
  this.ParentFrame = null;              // Frame padre
  this.ParentTab = null;                // Tab in cui e' contenuto questo frame
  this.IsPreview = false;               // Frame in preview?
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo frame : da ridefinire in tutte le classi
  if (RD3_Glb)
  {
    // Il click sul collapse deve essere gestito lato client o lato server, asincrono o sincrono
    this.CollapseEventDef = RD3_Glb.EVENT_ACTIVE;
    //
    // Definizione eventi di mouse
    this.MouseClickEventDef = RD3_Glb.EVENT_CLIENTSIDE;
    this.MouseDoubleClickEventDef = RD3_Glb.EVENT_CLIENTSIDE;
  }
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;     // Se vero, gli oggetti del DOM sono gia' stati creati
  this.RecalcLayout = false; // Se vero, al termine della richiesta verra' adattato il layout
  this.RecalcResize = false; // True se bisogna forzare il resize del Frame contenitore
  this.SendResize = false;   // Il recalc layout deve lanciare evento di resize?
  this.DeltaW = 0;           // Tracciano di quanto il frame si sta ridimensionando
  this.DeltaH = 0;           // Tracciano di quanto il frame si sta ridimensionando
  this.TBScrollTimer = 0;    // Timer per lo scrolling della toolbar
  this.TBScrollDir = 0;      // 1 dx, -1 sx
  //this.AlreadyResized = false;  // E' stato fatto o meno il primo resize?
  //
  this.Collapsing = false;    // Sto eseguendo una animazione di collassamento?
  this.CollapsingHeight = 0;  // Altezza attuale di collassamento
  //
  // Oggetti visuali riguardanti la form
  this.FrameBox = null;    // Div globale del frame: contiene tutta la form ed i suoi figli
  this.ToolbarBox = null;  // Div che contiene la toolbar
  this.TBScrollDx = null;  // Div che contiene l'indicazione di scrolling per la toolbarbox (appare se la toolbar ha lo scrollwidth>clientwidth)
  this.TBScrollSx = null;  // Div che contiene l'indicazione di scrolling per la toolbarbox (appare se la toolbar ha lo scrollwidth>clientwidth)
  this.ContentBox = null;  // Div che contiene il contenuto del frame
  //
  // Oggetti visuali relativi alla Toolbar
  this.CollapseButton = null;   // Immagine che contiene il pulsante del collassamento
  this.LockButton = null;       // Immagine rappresentante il pulsante di Lock
  this.SearchBox = null;        // Edit Box di ricerca
  this.IconImg = null;          // Immagine contenente l'icona del frame
  this.CaptionTxt = null;       // Testo della Caption (Span)
  //
  this.ChildBox1 = null;   // Box per il primo frame
  this.ChildBox2 = null;   // Box per il secondo frame
  //
  this.InResponse = false;  // Sto gestendo il messaggio dal server?
  //
  this.MD_XPos = 0; // Coordinata evento mouse down
  this.MD_YPos = 0; // Coordinata evento mouse down
  this.MD_Time = 0; // Istante evento mouse down
  this.MD_Button = 0; // Bottone premuto
  this.MD_Target = null; // Oggetto sorgente
  this.MD_Clicked = false; // Gia' cliccato?
  //
  this.IDScroll = null; // Oggetto scroller
  //
  this.ParentFrameIdentifier = "";  // ID del frame padre, valorizzato solo nel caso di SubPanel e SubForm contenute in Campi Statici
}


// *******************************************************************
// Inizializza questo WebFrame leggendo i dati da un nodo <wfr> XML
// *******************************************************************
WebFrame.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
  //
  // Carico gli elementi custom
  var objlist = node.childNodes;
  var n = objlist.length;
  //
  // Ciclo su tutti i nodi che rappresentano oggetti figli
  for (var i = 0; i < n; i++)
  {
    var objnode = objlist.item(i);
    var nome = objnode.nodeName;
    switch (nome)
    {
      case "cse":
        {
          var cls = objnode.getAttribute("cls");
          if (!window[cls])
            console.error("class " + cls + " not found");
          else
          {
            this.Content = CustomElement.createByName(cls, this);
            this.Content.LoadFromXml(objnode);
          }
        }
        break;
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
WebFrame.prototype.ChangeProperties = function(node)
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
WebFrame.prototype.LoadProperties = function(node)
{
  // Certifico che sto gestendo la risposta dal server
  this.InResponse = true;
  //
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
      case "clp": this.SetCollapsible(valore=="1"); break;
      case "col": this.SetCollapsed(valore=="1"); break;
      case "lkb": this.SetLockable(valore=="1"); break;
      case "lok": this.SetLocked(valore=="1"); break;
      case "vis": this.SetVisible(valore=="1"); break;
      case "ena": this.SetEnabled(valore=="1"); break;
      case "img": this.SetImage(valore); break;      
      case "cap": this.SetCaption(valore); break;
      case "wid": this.SetWidth(parseInt(valore)); break;
      case "hei": this.SetHeight(parseInt(valore)); break;
      case "miw": this.SetMinWidth(parseInt(valore)); break;
      case "mih": this.SetMinHeight(parseInt(valore)); break;
      case "maw": this.SetMaxWidth(parseInt(valore)); break;
      case "mah": this.SetMaxHeight(parseInt(valore)); break;
      case "orw": this.SetOrgWidth(parseInt(valore)); break;
      case "orh": this.SetOrgHeight(parseInt(valore)); break;
      case "ver": this.SetVertical(valore=="1"); break;
      case "stb": this.SetShowToolbar(valore=="1"); break;
      case "ssb": this.SetShowStatusBar(valore=="1"); break;
      case "scr": this.SetScrollbar(parseInt(valore)); break;
      case "smi": this.SetSmallIcon(valore=="1"); break;
      case "ocn": this.SetOnlyContent(valore=="1"); break;
      case "fr1": this.SetChildFrame1(valore); break;
      case "fr2": this.SetChildFrame2(valore); break;
      case "dra": this.SetCanDrag(valore=="1"); break;
      case "dro": this.SetCanDrop(valore=="1"); break;
      case "hks": this.SetHandledKeys(parseInt(valore)); break;
      case "dcl": this.DeleteFrame(valore); break;
      case "frb": this.SetFrameBorder(valore=="1"); break;
      case "cln": this.SetClassName(valore); break;
      
      case "clc": this.CollapseEventDef = parseInt(valore); break;
      case "mck": this.MouseClickEventDef = parseInt(valore); break;
      case "mdk": this.MouseDoubleClickEventDef = parseInt(valore); break;
      
      case "cla": this.CollapseAnimDef = valore; break;
      
      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
      break;
    }
  }
  //
  this.InResponse = false;
}


// *******************************************************************
// Setter delle proprieta'
// *******************************************************************
WebFrame.prototype.SetCollapsible= function(value) 
{
  if (value!=undefined)
    this.Collapsible = value;
  //
  if (this.Realized)
  {
    // Se e' contenuto in una tabbed, non e' collassabile
    var cancoll = this.Collapsible;
    if (this.ParentFrame && this.ParentFrame instanceof TabbedView)
      cancoll = false;
    //
    if (cancoll)
      this.CollapseButton.style.display = "";
    else
      this.CollapseButton.style.display = "none";
  }
}

WebFrame.prototype.SetCollapsed= function(value, immediate) 
{
  var old = this.Collapsed;
  //
  if (value!=undefined)
    this.Collapsed = value;
  //
  if (this.Realized && (old!=this.Collapsed || value==undefined))
  {
    // Il collapse ha senso solo per un frame contenuto
    if (!this.ChildBox1 && !this.ChildBox2)
    {
      // Imposto l'animazione, saltandola se non ho un valore (sono dentro la realize)
      var fx = new GFX("frame", this.Collapsed, this, (value==undefined) || (this.WebForm.Animating) || this.IsPreview, null, this.CollapseAnimDef);
      fx.Immediate = immediate ? true : false;
      //
      // Se value e' undefined devo forzare l'esecuzione, quindi rendo old diverso dal valore attuale 
      fx.OldValue = (value==undefined) ? !this.Collapsed : old;
      //
      RD3_GFXManager.AddEffect(fx);
    }
  }
}

WebFrame.prototype.SetLockable= function(value) 
{
  if (value!=undefined)
    this.Lockable = value;
  if (this.Realized && this.LockButton)
  {
    if (this.Lockable && !this.Collapsed)
      this.LockButton.style.display = "";
    else
      this.LockButton.style.display = "none";
  }
}

WebFrame.prototype.SetLocked= function(value) 
{
  if (value!=undefined)
    this.Locked = value;
  //
  if (this.Realized && this.LockButton)
  {
    var ext = (this.SmallIcons ? "_sm" : "") +  (RD3_Glb.IsMobile()?".png":".gif");
    //
    var usemask = !(RD3_Glb.IsAndroid() || RD3_Glb.IsIE() || RD3_Glb.IsEdge()) || RD3_Glb.IsAndroid(4,4,0);
    //
    if (!usemask && RD3_Glb.IsMobile7())
      ext = "-i" + ext;
    //
    // Imposto l'immagine/tooltip corretta per il pulsante locked
    if (this.Locked)
    {
      if (RD3_Glb.IsMobile7() && usemask)
      {
        this.LockButton.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/lock" + ext)+"')";
        this.LockButton.style.webkitMaskRepeat = "no-repeat";
        this.LockButton.style.webkitMaskSize = "25px 25px";
      }
      else
        this.LockButton.src = RD3_Glb.GetImgSrc("images/lock" + ext);
      RD3_TooltipManager.SetObjTitle(this.LockButton, RD3_ServerParams.TooltipUnlock + RD3_KBManager.GetFKTip(RD3_ClientParams.FKLocked));
    }
    else
    {
      if (!RD3_Glb.IsMobile()) this.LockButton.src = RD3_Glb.GetImgSrc("images/unlk" + ext);
      RD3_TooltipManager.SetObjTitle(this.LockButton, RD3_ServerParams.TooltipLock + RD3_KBManager.GetFKTip(RD3_ClientParams.FKLocked));
    }
  }
}

WebFrame.prototype.SetVisible= function(value) 
{
  var old = this.Visible;
  //
  if (value!=undefined)
    this.Visible = value;
  //
  if (this.Realized)
  {
    if (this.Visible)
    {
      this.FrameBox.style.display = "";
      this.RecalcLayout = true;
      //
      // il cambio di visibilita' deve far ricalcolare anche la visibilita' dei commandset e delle toolbar
      if (!old)
        this.WebForm.RecalcCommands = true;
    }
    else
    {
      this.FrameBox.style.display = "none";
    }
    //
    // Avverto la form del cambiamento in modo da far riposizionare i frame: se sono invisibile il mio spazio deve 
    // essere mangiato.
    if (this.WebForm.Realized && old!=this.Visible)
    {
      this.WebForm.RecalcLayout = true;
    }
    //
    this.RecalcResize = true;
  }
  //
  // Se sono in una Tab devo nascondere anche quella
  if (this.ParentTab && this.ParentTab.Realized)
      this.ParentTab.SetVisible(this.Visible);
}

WebFrame.prototype.SetEnabled= function(value) 
{
  if (value!=undefined)
    this.Enabled = value;
  //
  // Sovrascritta nelle classi derivate
}

WebFrame.prototype.SetImage= function(value) 
{
  if (value!=undefined)
    this.Image = value;
  //
  if (this.Realized)
  {
    if (!this.ChildBox1 && !this.ChildBox2)
    {
      if (this.Image == "")
      {
        // Nascondo l'icona
        this.IconImg.style.display = "none";
      }
      else
      {
        this.IconImg.src = RD3_Glb.GetImgSrc("images/" + this.Image);
        //
        // Mostro l'icona (solo se non siamo collassati)
        if (!this.Collapsed)
        {
          // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
          if (RD3_Glb.Adapt4Retina(this.Identifier, this.Image, 43))
            this.IconImg.style.display = "none";
          else
            this.IconImg.style.display = "";
        }
      }
    }
  }
}

WebFrame.prototype.SetCaption= function(value) 
{
  if (value!=undefined)
    this.Caption = value;
  //
  if (this.Realized)
  {
    if (!this.ChildBox1 && !this.ChildBox2)
    {
      // Se la form contiene DEMO nella caption, ma io sono la prima toolbar mostrata a video allora devo aggiungere DEMO alla mia caption (solo se non c'e')
      if (RD3_Glb.IsMobile() && this.WebForm && this.WebForm.WebCaption.indexOf("(DEMO)") > 0 && this.WebForm.GetFirstToolbar() === this.ToolbarBox && this.Caption.indexOf("(DEMO)") == -1) 
      {
        this.Caption = this.Caption + " (DEMO)";
        this.WebForm.WebCaption = this.WebForm.WebCaption.replace("(DEMO)", "");
      }
      //
      this.CaptionTxt.innerHTML = this.Caption;
      //
      // Se la caption non finisce per : e non e' stringa vuota allora aggiungo i :
      if (this.Caption != "" && this.Caption.substr(this.Caption.length-1,1) != ":" && !this.Collapsed && this.ShowStatusBar && !(this instanceof Tree))
        this.CaptionTxt.innerHTML += ":";
      //
      // Chrome fa casino con gli span vuoti, meglio nasconderlo
      if (RD3_Glb.IsChrome())
        this.CaptionTxt.style.display = (this.Caption == "" ? "none" : "");
      //
      // Caso mobile, sposto la caption in modo da non sovrapporsi con i bottoni se si puo'
      if (RD3_Glb.IsMobile()) 
      {
        RD3_Glb.AdjustCaptionPosition(this.ToolbarBox, this.CaptionTxt);
        //
        // La AdjustCaptionPosition allarga la caption occupando tutto lo spazio disponibili, ma se c'e' la status bar visibile non va fatto.
        if (this.ShowStatusBar)
          this.CaptionTxt.style.width = "";
      }
    }
  }
}

WebFrame.prototype.SetWidth= function(value)
{
  if (value!=undefined)
    this.Width = (value<0) ? 0 : value;
  //
  if (this.Realized)
  {
    if (this.FrameBox)
      this.FrameBox.style.width = this.Width + "px";
    //
    // Se la richiesta di modifica dimensioni proviene dal server mi devo ricordare di adattare il layout della form
    if (this.InResponse && this.WebForm)
      this.WebForm.RecalcLayout = true;
  }
}

WebFrame.prototype.SetHeight= function(value)
{
  if (value!=undefined)
    this.Height = (value<0) ? 0 : value;
  //
  if (this.Realized)
  {
    // Calcolo l'altezza da assegnare: se sono collassato devo essere alto come la toolbar
    var h = (this.ToolbarBox && this.Collapsed) ? this.ToolbarBox.offsetHeight : this.Height;
    //
    // Offset che tiene conto della diversa altezza della toolbar nei dispositivi touch rispetto al PC
    var offs = (RD3_Glb.IsTouch() && this.WebForm.Modal && !RD3_Glb.IsMobile())? 8:0;
    //
    if (this.FrameBox)
    {
      if (!this.Collapsed)
      {
        this.FrameBox.style.height = (this.Height+offs) + "px";
      }
      else
      {
        // Se l'altezza della toolbar e' 0 non faccio nulla: potrei essere in fase di realizzazione
        if (this.FrameBox.offsetHeight != h && h>0)
        {
          this.FrameBox.style.height = (h+offs) + "px";
        }
      }
    }
    //
    // Se la richiesta di modifica dimensioni proviene dal server mi devo ricordare di adattare il layout della form
    if (this.InResponse && this.WebForm)
      this.WebForm.RecalcLayout = true;
  }
}


WebFrame.prototype.SetOrgHeight= function(value) 
{
  this.OrgHeight = value;
}


WebFrame.prototype.SetOrgWidth= function(value) 
{
  this.OrgWidth = value;
}


WebFrame.prototype.SetMinWidth= function(value) 
{
  if (value!=undefined)
    this.MinWidth = value;
  //
  if (this.Realized)
  {
    this.WebForm.RecalcLayout = true;
  }
}

WebFrame.prototype.SetMaxWidth= function(value) 
{
  if (value!=undefined)
    this.MaxWidth = value;
  //
  if (this.Realized)
  {
    this.WebForm.RecalcLayout = true;
  }
}

WebFrame.prototype.SetMinHeight= function(value) 
{
  if (value!=undefined)
    this.MinHeight = value;
  //
  if (this.Realized)
  {
    this.WebForm.RecalcLayout = true;
  }
}

WebFrame.prototype.SetMaxHeight= function(value) 
{
  if (value!=undefined)
    this.MaxHeight = value;
  //
  if (this.Realized)
  {
    this.WebForm.RecalcLayout = true;
  }
}

WebFrame.prototype.SetVertical= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  if (value!=undefined)
    this.Vertical = value;
}

WebFrame.prototype.SetShowToolbar= function(value) 
{
  if (value!=undefined)
    this.ShowToolbar = value;
  //
  // Non devo fare niente: verra' ridefinita dalle classi derivate
}

WebFrame.prototype.SetShowStatusBar= function(value) 
{
  if (value!=undefined)
    this.ShowStatusBar = value;
  //
  // Sovrascritta nelle classi derivate
}

WebFrame.prototype.SetScrollbar= function(value) 
{
  if (value!=undefined)
    this.Scrollbar = value;
  //
  if (this.Realized)
  {
    // Assegno i valori giusti di overflow a seconda dell'impostazione
    if (this.ContentBox)
    {
      var ofx = "";
      var ofy = "";
      //
      switch(this.Scrollbar)
      {
        case RD3_Glb.FORMSCROLL_NONE : 
        {
          ofx = "hidden";
          ofy = "hidden";
        }
        break;
        
        case RD3_Glb.FORMSCROLL_HORIZ : 
        {
          ofx = "auto";
          ofy = "hidden";
        }
        break;
        
        case RD3_Glb.FORMSCROLL_VERT : 
        {
          ofx = "hidden";
          ofy = "auto";
        }
        break;
        
        case RD3_Glb.FORMSCROLL_BOTH : 
        {
          ofx = "auto";
          ofy = "auto";
        }
        break;
      }
      //
      // Se sono un SubForm, le scrollbar ce le ha la form!
      if (this instanceof SubForm || RD3_Glb.IsMobile())
      {
        ofx = "hidden";
        ofy = "hidden";
      }
      //
      this.ContentBox.style.overflowX = ofx;
      this.ContentBox.style.overflowY = ofy;
    }
    //
    if (this.IDScroll)
    {
      this.IDScroll.AllowXScroll = this instanceof Book && (this.Scrollbar==RD3_Glb.FORMSCROLL_HORIZ || this.Scrollbar==RD3_Glb.FORMSCROLL_BOTH);
      this.IDScroll.AllowYScroll = (this.Scrollbar==RD3_Glb.FORMSCROLL_VERT || this.Scrollbar==RD3_Glb.FORMSCROLL_BOTH);
      //
      if (this.IDScroll.AllowXScroll)
        this.IDScroll.CreateScrollObj(0);
      if (this.IDScroll.AllowYScroll)
        this.IDScroll.CreateScrollObj(1);
    }
  }
}

WebFrame.prototype.SetSmallIcon= function(value) 
{
  if (value!=undefined)
    this.SmallIcons = value;
  //
  if (this.Realized)
  {
    if (!RD3_Glb.IsMobile() && !this.ChildBox1 && !this.ChildBox2)
    {
      var ext = (this.SmallIcons ? "_sm" : "");
      //
      // Imposto l'immagine corretta per il pulsante collapse
      if (this.Collapsed)
        this.CollapseButton.src = RD3_Glb.GetImgSrc("images/expand" + ext +".gif");
      else
        this.CollapseButton.src = RD3_Glb.GetImgSrc("images/collapse" + ext + ".gif");
      //
      // Imposto l'immagine corretta per il pulsante locked
      if (this.Locked)
        this.LockButton.src = RD3_Glb.GetImgSrc("images/unlk" + ext +".gif");
      else
        this.LockButton.src = RD3_Glb.GetImgSrc("images/lock" + ext + ".gif");
    }
  }
}

WebFrame.prototype.SetOnlyContent= function(value) 
{
  if (value!=undefined)
    this.OnlyContent = value;
  //
  if (this.Realized)
  {
    if (!this.ChildBox1 && !this.ChildBox2)
    {
      if (this.OnlyContent)
      {
        this.ToolbarBox.style.display = "none";
      }
      else
      {
        this.ToolbarBox.style.display = "";
      }
    }
  }
}

WebFrame.prototype.SetChildFrame1= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  if (value!=undefined)
    this.ChildFrame1 = value; // All'inizio e' una stringa, poi diventera' un oggetto
}

WebFrame.prototype.SetChildFrame2= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  if (value!=undefined)
    this.ChildFrame2 = value; // All'inizio e' una stringa, poi diventera' un oggetto
}

WebFrame.prototype.SetCanDrag= function(value) 
{
  // Devo solo cambiare il valore...
  if (value!=undefined)
    this.CanDrag = value;
}

WebFrame.prototype.SetCanDrop= function(value) 
{
  // Devo solo cambiare il valore...
  if (value!=undefined)
    this.CanDrop = value;
}


// ******************************************************
// Setter dei tasti intercettati dalla form
// ******************************************************
WebFrame.prototype.SetHandledKeys = function(value)
{
  if (value!=undefined)
    this.HandledKeys = value;
  //
  // Questa proprieta' non puo' variare dopo essere stata inviata, e viene gestita
  // nel KBManager
}


WebFrame.prototype.SetFrameBorder = function(value)
{
  if (value!=undefined)
    this.FrameBorder = value;
  //
  // Questa proprieta' non puo' variare dopo essere stata inviata
  // Se questo frame mostra i bordi ed e' contenuto in una subform
  // allora anche la subform deve mostrare i bordi
  if (this.FrameBorder && this.WebForm && this.WebForm.SubFormObj)
    this.WebForm.SubFormObj.FrameBorder = true;
}


WebFrame.prototype.GetFrameBorder = function() 
{
  if (this.ChildFrame1 && this.ChildFrame2)
    return this.ChildFrame1.GetFrameBorder() || this.ChildFrame2.GetFrameBorder();
  else 
    return this.FrameBorder;
}


WebFrame.prototype.SetClassName = function(value)
{
  var old = this.ClassName;
  if (value!=undefined)
    this.ClassName = value;
  //
  if (this.Realized && this.FrameBox)
  {
    // Se c'e' un vecchio valore lo rimuovo, poi se ce n'e' uno nuovo lo aggiungo.
    // in questo modo posso gestire correttamente il cambio da classe "a" -> ""
    if (old)
      RD3_Glb.RemoveClass(this.FrameBox, old);
    if (this.ClassName)
      RD3_Glb.AddClass(this.FrameBox, this.ClassName);
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
WebFrame.prototype.Realize = function(parent)
{
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    // Sono un frame che contiene altri frame.
    // Creo i due in cui poi box realizzero' i due sottoframe
    this.ChildBox1 = document.createElement("div");
    this.ChildBox1.setAttribute("id", this.Identifier + ":f1");
    this.ChildBox1.className = "frame-container-" + (this.Vertical ? "top" : "left");
    this.ChildBox2 = document.createElement("div");
    this.ChildBox2.setAttribute("id", this.Identifier + ":f2");
    this.ChildBox2.className = "frame-container-" + (this.Vertical ? "bottom" : "rigth");
    //
    if (this.ChildFrame1.GetFrameBorder() || this.ChildFrame2.GetFrameBorder())
      RD3_Glb.AddClass(this.ChildBox2, "frame-border-" + (this.Vertical ? "top" : "left"));
    //
    // Aggiungo i box al dom
    parent.appendChild(this.ChildBox1);
    parent.appendChild(this.ChildBox2);
    //
    // Realizzo i frame secondari
    this.ChildFrame1.Realize(this.ChildBox1);
    this.ChildFrame2.Realize(this.ChildBox2);
    //
    // Mi assegno come padre dei miei figli
    this.ChildFrame1.ParentFrame = this;
    this.ChildFrame2.ParentFrame = this;
    //
    this.Realized = true;
  }
  else
  {
    // Realizzo i miei oggetti visuali
    // Creo il mio contenitore globale
    this.FrameBox = document.createElement("div");
    this.FrameBox.setAttribute("id", this.Identifier);
    this.FrameBox.className = "frame-container";
    if (RD3_Glb.IsChrome() && RD3_Glb.IsMobile())
      this.FrameBox.style.webkitTransformStyle = "flat";
    this.FrameBox.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseDown', ev)");
    this.FrameBox.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseUp', ev)");
    //
    // Realizzo la Toolbar
    this.RealizeToolbar();
    //
    this.ContentBox = document.createElement("div");
    this.ContentBox.setAttribute("id", this.Identifier+":cnt");
    this.ContentBox.className = "frame-content-container";
    if (!(this instanceof SubForm))
      this.ContentBox.style.margin = RD3_ClientParams.StandardPadding + "px";
    //
    // A causa dell'animazione, nelle modali mobile lo scrolltop si sposta
    if (RD3_Glb.IsMobile())
      window.setTimeout("document.getElementById('"+this.ContentBox.id+"').scrollTop='0px'",50);
     //
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsMobile() && !RD3_Glb.IsIE(10, true))
    {
      // e' un dispositivo touch, quindi uso gli eventi touch
      this.ContentBox.addEventListener("touchstart", new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchStart', ev)"), false);
      this.ContentBox.addEventListener("touchmove",  new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchMove', ev)"), false);
      this.ContentBox.addEventListener("touchend",   new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchEnd', ev)"), false);
      this.TouchStartX = -1;
      this.TouchStartY = -1;
    }
    //
    this.FrameBox.appendChild(this.ToolbarBox);
    this.FrameBox.appendChild(this.ContentBox);
    //
    parent.appendChild(this.FrameBox);
    //
    // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
    // Non imposto le proprieta' dimensionali, perche' tanto subito dopo ci sara'
    // un AdaptLayout...
    this.Realized = true;
    this.SetSmallIcon();
    this.SetCollapsible();
    this.SetCollapsed();
    this.SetLockable();
    this.SetLocked();
    this.SetVisible();
    this.SetEnabled();
    this.SetImage();  
    this.SetCaption();
    this.SetShowToolbar();
    this.SetShowStatusBar();
    this.SetScrollbar();
    this.SetOnlyContent();
    this.SetClassName();
    //
    if (this.SetSearchValue && this.SearchBox)
    {
      this.SetSearchBoxValue(this.SetSearchValue);
      this.SetSearchValue = null;
    }
    //
    if (this.Content)
      this.Content.Realize(this.ContentBox);
  }
}


// ***************************************************************
// Crea gli oggetti DOM relativi alla Toolbar
// ***************************************************************
WebFrame.prototype.RealizeToolbar = function()
{
  // Creo il contenitore esterno della toolbar
  this.ToolbarBox = document.createElement("div");
  this.ToolbarBox.setAttribute("id", "tl:" + this.Identifier);
  this.ToolbarBox.className = (this.SmallIcons) ? "frame-toolbarsmall-container" : "frame-toolbar-container";
  //
  this.TBScrollDx = document.createElement("div");
  this.TBScrollDx.setAttribute("id", "tbsbdx:" + this.Identifier);
  this.TBScrollDx.className = (this.SmallIcons) ? "frame-toolbarsmall-scrollbox-dx" : "frame-toolbar-scrollbox-dx";
  //
  this.TBScrollSx = document.createElement("div");
  this.TBScrollSx.setAttribute("id", "tbsbsx:" + this.Identifier);
  this.TBScrollSx.className = (this.SmallIcons) ? "frame-toolbarsmall-scrollbox-sx" : "frame-toolbar-scrollbox-sx";
  //
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
  {
    // e' un dispositivo touch, quindi uso lgi eventi touch
    this.ToolbarBox.addEventListener("touchstart", new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchStartTb', ev)"), false);
    this.ToolbarBox.addEventListener("touchmove",  new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchMoveTb', ev)"), false);
    this.ToolbarBox.addEventListener("touchend",   new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnTouchEndTb', ev)"), false);
    this.TbTouchStartX = -1;
    this.TbTouchStartY = -1;
  }
  else if (!RD3_Glb.IsMobile())
  {
    // non e' un dispositivo touch, quindi uso il mousemove
    this.ToolbarBox.onmousemove = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollToolbar', ev)");
    this.TBScrollDx.onmousemove = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollToolbar', ev)");
    this.TBScrollSx.onmousemove = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollToolbar', ev)");
  }
  //
  // Creo il pulsante di collassamento
  this.CollapseButton = document.createElement("img");
  this.CollapseButton.setAttribute("id", this.Identifier+":collapse");
  this.CollapseButton.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" frame-collapse-button";
  this.CollapseButton.style.marginLeft = "4px";
  //
  // Creo il pulsante di lock
  this.LockButton = document.createElement("img");
  this.LockButton.setAttribute("id", this.Identifier+":lock");
  this.LockButton.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" frame-lock-button";
  //
  // Creo edit box di ricerca
  if (RD3_Glb.IsMobile() && this instanceof IDPanel)
  {
    this.SearchBox = document.createElement("input");
    this.SearchBox.setAttribute("id", this.Identifier+":se");
    this.SearchBox.placeholder = ClientMessages.MOB_SEARCH_HINT;
    this.SearchBox.className = "frame-search-box" + ((this.SmallIcons)? "-small" : "");
    this.SearchBox.onchange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSearchChange', ev)");
    //
    if (RD3_Glb.IsIE(10, true))
      this.SearchBox.onkeypress = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSearchKeyPress', ev)");
    //
    var ku = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSearchKeyUp', ev)");
    var md = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSearchMouseDown', ev)");
    var ob = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSearchBlur', ev)");
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
    {
      this.SearchBox.addEventListener("touchstart", md, false);
      this.SearchBox.addEventListener("keyup", ku, true);
      this.SearchBox.addEventListener("blur", ob, true);
    }
    else if (document.addEventListener)
    {
      this.SearchBox.addEventListener("mousedown", md, false);
      this.SearchBox.addEventListener("keyup", ku, true);
      this.SearchBox.addEventListener("blur", ob, true);
    }
    else
    {
      this.SearchBox.attachEvent("onmousedown", md);
      this.SearchBox.attachEvent("onkeyup", ku, true);
      this.SearchBox.addEventListener("onblur", ob, true);
    }
  }
  //
  // Creo l'immagine relativa all'cona
  this.IconImg = document.createElement("img");
  this.IconImg.className = "frame-toolbar-icon";
  //
  // Creo lo span relativo alla caption
  this.CaptionTxt = document.createElement("span");
  this.CaptionTxt.setAttribute("id", this.Identifier+":caption");
  this.CaptionTxt.className = (this.SmallIcons) ? "frame-toolbarsmall-caption" : "frame-toolbar-caption";
  //
  // Su Touch l'evento di click puo' scattare anche quando premi su un pulsante (dipende dai margini impostati sugli oggetti)
  // Lo spegniamo perche' non e' necessario: il GoTop lo fa anche il TouchEnd
  if (!RD3_Glb.IsTouch())
    this.CaptionTxt.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCaptionClick', ev)");
  //
  // Assegno gli eventi di click e highlight
  this.CollapseButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCollapseClick', ev)");
  this.CollapseButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.CollapseButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.CollapseButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.CollapseButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  //RD3_Glb.AddHLEvents(this.CollapseButton, this.Identifier, "OnCollapseMouseOver", "OnCollapseMouseOut");
  //
  this.LockButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnLockClick', ev)");
  this.LockButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.LockButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.LockButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.LockButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  //
  // Inserisco gli elementi nel DOM
  this.ToolbarBox.appendChild(this.CollapseButton);
  this.ToolbarBox.appendChild(this.LockButton);
  if (RD3_Glb.IsMobile() && this instanceof IDPanel)
    this.ToolbarBox.appendChild(this.SearchBox);
  this.ToolbarBox.appendChild(this.IconImg);
  this.ToolbarBox.appendChild(this.CaptionTxt);
  this.FrameBox.appendChild(this.ToolbarBox);
  this.FrameBox.appendChild(this.TBScrollDx);
  this.FrameBox.appendChild(this.TBScrollSx);
}

// ********************************************************************************
// Gestore eventi di mouse su un pulsante della Toolbar di frame
// Il parametro deve valere "" per bottone senza effetti, "hover" per highlight
// e "down" per effetto cliccato
// ********************************************************************************
WebFrame.prototype.OnToolMouseUse = function(evento, parametro)
{ 
  var eve = (window.event)?window.event:evento;
  var obj = (window.event)?window.event.srcElement:evento.target;
  //
  // se ho trovato l'origine dell'evento
  if (obj)
  {
    // gestisco il caso di over, leave e down
    if (!RD3_Glb.IsMobile())
      obj.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "") + ((parametro == "") ? "" : "-" + parametro);
  }
}

// ********************************************************************************
// Il mouse e' stato mosso sulla toolbar 
// ********************************************************************************
WebFrame.prototype.OnScrollToolbar = function(evento)
{ 
  if (!this.ToolbarBox)
    return;
  //
  var x = window.event ? window.event.offsetX : evento.layerX;  
  var srcobj = (window.event)?window.event.srcElement:evento.explicitOriginalTarget;  
  //
  // Sistemo la X rispetto alla toolbar
  if (srcobj==this.ToolbarBox)
  {
    // Calcolo la X rispetto alla toolbar
    x -= this.ToolbarBox.scrollLeft;
  }
  //
  // Se sono sullo scrollbox, allora sicuramente inizio scroll dx
  if (srcobj==this.TBScrollDx)
  {
    // Calcolo la X rispetto alla toolbar
    x = this.ToolbarBox.clientWidth;
    srcobj = this.ToolbarBox;
  }  
  if (srcobj==this.TBScrollSx)
  {
    // Calcolo la X rispetto alla toolbar
    x = 0;
    srcobj = this.ToolbarBox;
  }  
  //
  // Ho trovato un altro oggetto...
  if (srcobj && srcobj!=this.ToolbarBox && srcobj.offsetLeft>0)
  {
    x -= this.ToolbarBox.scrollLeft;
    //
    // Calcolo la X rispetto all'altro oggetto
    if (srcobj.className=="panel-toolbar-button")
    {
      x += srcobj.offsetLeft;
      srcobj = this.ToolbarBox;
    }
  }
  //
  // Eseguo o fermo scroll, dipende dalla posizione nella scrollbar
  if (srcobj==this.ToolbarBox && this.ToolbarBox.scrollWidth>this.ToolbarBox.clientWidth+4)
  {
    if (x>this.ToolbarBox.clientWidth-24)
    {
      this.ScrollToolbar(1);
    }
    else if (x<24)
    {
      this.ScrollToolbar(-1);
    }
    else
    {
      this.ScrollToolbar(0);
    }
  }
}

// ********************************************************************************
// Effettuo scrolling della toolbar
// ********************************************************************************
WebFrame.prototype.ScrollingToolbar = function()
{ 
  var old = this.ToolbarBox.scrollLeft;
  this.ToolbarBox.scrollLeft+=this.TBScrollDir*(RD3_Glb.IsIE()?2:1);
  //
  // Se non si e' spostata, allora fermo il timer
  if (this.ToolbarBox.scrollLeft==old)
  {
    this.ScrollToolbar(0);
  }
}


// ********************************************************************************
// Inizio lo scrolling
// ********************************************************************************
WebFrame.prototype.ScrollToolbar = function(dir)
{ 
  // Se c'era un timer con direzione diversa, lo fermo
  if (this.TBScrollTimer && this.TBScrollDir!=dir)
  {
    window.clearInterval(this.TBScrollTimer);
    this.TBScrollTimer = 0;
    this.TBScrollDir = 0;
  }
  //
  // Se e' stata chiesta una direzione, la attivo
  if (!this.TBScrollTimer && dir)
  {
    this.TBScrollDir = dir;
    this.TBScrollTimer = window.setInterval("RD3_DesktopManager.CallEventHandler('"+ this.Identifier +"', 'ScrollingToolbar')", 10);
  }
  //
  // Quando fermo la scrollbar, controllo apparizione immaginette
  if (!dir)
    this.AdaptScrollBox();
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
WebFrame.prototype.AdaptLayout = function()
{ 
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    this.SetChildLayout();
    this.ChildFrame1.AdaptLayout();
    this.ChildFrame2.AdaptLayout();
  }
  else
  {
    if (this.ParentTab)
    {
      RD3_Glb.AdaptToParent(this.FrameBox, 0, 0);
      this.Width = this.FrameBox.clientWidth;
      this.Height = this.FrameBox.clientHeight;
    }
    //
    // Dimensiono la toolbar e il contenuto
    // ATTN: le tabbed non hanno margine laterale
    var pad = 0;
    if (!this instanceof TabbedView)
      pad = 2*RD3_ClientParams.StandardPadding;
    //
    RD3_Glb.AdaptToParent(this.ToolbarBox, 0, -1);
    RD3_Glb.AdaptToParent(this.ContentBox, this.GetHContentOffset()+pad, this.GetContentOffset()+pad);
    //
    // Memorizzo dei valori per evitare poi di doverli rileggere dopo e perdere tempo
    this.ContentBoxOffsetWidth = this.ContentBox.offsetWidth;
    this.ContentBoxOffsetHeight = this.ContentBox.offsetHeight;
    this.ContentBoxClientWidth = this.ContentBox.clientWidth;
    this.ContentBoxClientHeight = this.ContentBox.clientHeight;
    //
    this.AdaptScrollBox();      
    //
    if (this.SendResize)    
    {
      var def = this.IsResizeImmediate()? RD3_Glb.EVENT_ACTIVE : RD3_Glb.EVENT_SERVERSIDE;
      //
      // Per i grafici ed i book, invio la dimensione senza toolbar o altro... lo spazio disponibile
      // che l'immagine del grafico o le pagine del book possono contenere
      if (this instanceof Graph || this instanceof Book)
        var ev = new IDEvent("resize", this.Identifier, null, def, null, this.ContentBox.clientWidth, this.ContentBox.clientHeight);
      else
        var ev = new IDEvent("resize", this.Identifier, null, def, null, this.FrameBox.clientWidth, this.FrameBox.clientHeight);
    }
    //
    if (this.Content)
      this.Content.AdaptLayout();
  }
  //
  this.RecalcLayout = false;
  this.SendResize = false;
}


// ********************************************************************************
// Posiziona e mostra lo scrollbox se necessario
// ********************************************************************************
WebFrame.prototype.AdaptScrollBox = function()
{ 
  // Se non c'e' la toolbar oppure sono nel mobile, non adatto
  if (!this.ToolbarBox || RD3_Glb.IsMobile())
    return;
  //
  if (this.TBScrollDx)
  {
    if (this.ToolbarBox.scrollWidth-this.ToolbarBox.scrollLeft>this.ToolbarBox.clientWidth+4)
    {
      this.TBScrollDx.style.display = "block";
      this.TBScrollDx.style.left = (this.ToolbarBox.offsetWidth - this.TBScrollDx.offsetWidth) + "px";
    }
    else
    {
      this.TBScrollDx.style.display = "none";
    }
  }
  //
  if (this.TBScrollSx)
  {
    if (this.ToolbarBox.scrollLeft>0)
    {
      this.TBScrollSx.style.display = "block";
    }
    else
    {
      this.TBScrollSx.style.display = "none";
    }  
  }
}


// ********************************************************************************
// Il resize deve essere mandato immediatamente al server?
// ********************************************************************************
WebFrame.prototype.IsResizeImmediate = function()
{
  return false; 
}

// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
WebFrame.prototype.Unrealize = function()
{ 
  // Ridefinire anche nelle classi figlie
  //
  // Rimuovo il mio frame dal DOM
  if (this.FrameBox && this.FrameBox.parentNode)
    this.FrameBox.parentNode.removeChild(this.FrameBox);
  //
  // Passo il messaggio ai miei figli
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    this.ChildFrame1.Unrealize();
    this.ChildFrame2.Unrealize();
  }
  else if (this.Content)
    this.Content.Unrealize();
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  this.ScrollToolbar(0);
  //
  if (this.IDScroll)
    this.IDScroll.Unrealize();
  //
  // Annullo i riferimenti al DOM
  this.FrameBox = null;
  this.ToolbarBox = null;
  this.ContentBox = null;
  this.CollapseButton = null;
  this.IconImg = null;   
  this.CaptionTxt = null;
  this.ChildBox1 = null;
  this.ChildBox2 = null;
  //
  this.Realized = false;
  this.RealizeDone = false;
}


// ********************************************************************************
// Gestore evento di mouse over sul pulsante Collapse della Toolbar
// ********************************************************************************
WebFrame.prototype.OnCollapseMouseOver= function(evento)
{ 

}


// ********************************************************************************
// Gestore evento di mouse out sul pulsante Collapse della Toolbar
// ********************************************************************************
WebFrame.prototype.OnCollapseMouseOut= function(evento)
{ 

}


// ********************************************************************************
// Gestore evento di click sul pulsante Collapse della Toolbar
// ********************************************************************************
WebFrame.prototype.OnCollapseClick= function(evento)
{ 
  var ev = new IDEvent("col", this.Identifier, evento, this.CollapseEventDef, this.Collapsed ? "exp" : "col");
  if (ev.ClientSide)
  {
    this.CollapseButton.focus();
    //
    // L'esecuzione locale di un evento di collapse fa collassare o meno il frame
    this.SetCollapsed(!this.Collapsed, true);
  }
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
WebFrame.prototype.AfterProcessResponse= function()
{ 
  // Non devo fare l'adapting qui durante l'animazione di resize della popup!
  // Non devo fare il recalc del layout se sono figlio di una tab invisibile, tutti i valori sarebbero a 0
  if (this.RecalcLayout && this.Realized && !this.WebForm.PopupResAnimating && (!this.ParentTab || this.ParentTab.Selected))
    this.AdaptLayout();
  //
  if (this.Content)
    this.Content.AfterProcessResponse();
}


// ********************************************************************************
// La classe base non esegue alcun settaggio di focus
// ********************************************************************************
WebFrame.prototype.Focus= function()
{ 
  return false;
}

// ********************************************************************************
// Tutti i webframe generici possono ricevere il fuoco tramite navigazione da 
// tastiera (pero' poi lo accettano o rifiutano in base alla loro logica specifica)
// ********************************************************************************
WebFrame.prototype.HandlesTabFocus = function()
{
  return true;
}

// ********************************************************************************
// Metodi di utilita' per gestire il resize forzato
// ********************************************************************************
WebFrame.prototype.RequestResize = function()
{
  if (this.ChildFrame1 && this.ChildFrame2)
    return (this.ChildFrame1.RequestResize() || this.ChildFrame2.RequestResize());
  else
    return this.RecalcResize;
}

WebFrame.prototype.ClearRequestResize = function()
{
  if (this.ChildFrame1 && this.ChildFrame2)
  {
      this.ChildFrame1.ClearRequestResize();
      this.ChildFrame2.ClearRequestResize();
  }
  else
   this.RecalcResize = false;
}

// ********************************************************************************
// Ridimensiona il frame come richiesto
// ********************************************************************************
WebFrame.prototype.Resize = function(w, h)
{ 
  // Impossibile farlo prima di essere stato creato o se sono invisibile
  if (!this.Realized || !this.Visible)
    return;
  //
  // Lo devo fare comuque?
  var force = false;
  if (this.AlreadyResized == undefined)
  {
    force = true;
    this.AlreadyResized = true;
  }
  //
  // Verifico se uno dei miei figli ha bisogno di un resize forzato
  // Solo per frame fittizi, che non hanno memoria delle loro dimensioni
  if (this.ChildFrame1 && this.ChildFrame2 && this.RequestResize())
    force = true;
  //  
  var neww = this.CalcWidth();
  var newh = this.CalcHeight();
  //
  // Se il frame nasce collassato scatta comunque il resize: in questo caso non devo considerare come dimensione reale
  // la dimensione collassata (restituita dalla CalcHeight() ), altrimenti il frame non potra' tornare alle sue dimensioni originali
  if (force && this.Collapsed && this.ChildFrame1==null)
  {
    neww = this.Width;
    newh = this.Height;
  }
  //
  // Calcolo larghezza finale
  if (this.WebForm.ResModeW==RD3_Glb.FRESMODE_EXTEND)
    neww = (w>this.OrgWidth)? w : this.OrgWidth;
  if (this.WebForm.ResModeW==RD3_Glb.FRESMODE_STRETCH)
    neww = w;
  //
  // Minimo e massimo...
  if (neww<this.MinWidth)
    neww = this.MinWidth;
  if (neww>this.MaxWidth && this.MaxWidth>0)
    neww = this.MaxWidth;
  if (neww<32)
    neww = 32;
  //
  // Calcolo altezza finale
  if (this.WebForm.ResModeH==RD3_Glb.FRESMODE_EXTEND)
    newh = (h>this.OrgHeight)? h: this.OrgHeight;
  if (this.WebForm.ResModeH==RD3_Glb.FRESMODE_STRETCH)
    newh = h;
  //
  // Minimo e massimo...
  if (newh<this.MinHeight)
    newh = this.MinHeight;
  if (newh>this.MaxHeight && this.MaxHeight>0)
    newh = this.MaxHeight;
  if (newh<32 && !this.Collapsed)
    newh = 32;
  //
  // Effettuo ridimensionamento reale?
  if (force || neww!=this.CalcWidth() || newh!=this.CalcHeight())
  {
    if (this.ChildFrame1 && this.ChildFrame2)
    {
      // Devo effettuare ridimensionamento delle due parti
      if (this.Vertical)
      {
        var h1 = (this.ChildFrame1.OrgHeight)?this.ChildFrame1.OrgHeight:this.ChildFrame1.Height;
        var h2 = (this.ChildFrame2.OrgHeight)?this.ChildFrame2.OrgHeight:this.ChildFrame2.Height;
        //
        var ff = 0.5;
        if (h1+h2 != 0)
          ff = h1/(h1+h2);
        if (this.Height!=newh)
          h1 = Math.floor(newh * ff);
        //
        // Se il secondo frame e' invisibile o collassato allora do' tutta lo spazio disponibile al primo frame..
        var gainHeight = !this.ChildFrame2.Visible || this.ChildFrame2.Collapsed;
        if (this.ChildFrame2.ChildFrame1 && this.ChildFrame2.ChildFrame2)
          gainHeight = (!this.ChildFrame2.ChildFrame1.Visible && !this.ChildFrame2.ChildFrame2.Visible) || (this.ChildFrame2.ChildFrame1.Collapsed && this.ChildFrame2.ChildFrame2.Collapsed);
        //
        if (gainHeight)
          h1 = newh - this.ChildFrame2.CalcHeight();
        //
        // L'altezza dei frame deve essere multipla di 4 pixel, per un buon allinamento
        if (!RD3_Glb.IsMobile())
          h1 -= (h1%4);
        //
        this.ChildFrame1.Resize(neww, h1);
        //
        if (this.ChildFrame1.Visible || this.ChildFrame2.Visible)
          h2 = newh - this.ChildFrame1.CalcHeight() - ((this.ChildFrame1.FrameBorder || this.ChildFrame2.FrameBorder) ? RD3_ClientParams.FrameBorderTop : 0);
        this.ChildFrame2.Resize(neww, h2);
        //
        // Se il secondo frame non accetta l'altezza, e' corretto tentare di modificare quella del primo
        if (this.ChildFrame2.CalcHeight() != h2 && !gainHeight)
          this.ChildFrame1.Resize(neww, newh - this.ChildFrame2.CalcHeight());
      }
      else
      {        
        var w1 = (this.ChildFrame1.OrgWidth)?this.ChildFrame1.OrgWidth:this.ChildFrame1.Width;
        var w2 = (this.ChildFrame2.OrgWidth)?this.ChildFrame2.OrgWidth:this.ChildFrame2.Width;
        var ff = w1/(w1+w2);
        if (this.Width!=neww)
          w1 = Math.floor(neww * ff);
        //
        // Se il secondo frame e' invisibile allora do' tutta lo spazio disponibile al primo frame..
        if (!this.ChildFrame2.Visible || this.ChildFrame2.CalcWidth()==0)
           w1 = neww;
        //
        // La larghezza dei frame deve essere multipla di 4 pixel, per un buon allinamento   
        if (!RD3_Glb.IsMobile())        
          w1 -= (w1%4);
        //
        this.ChildFrame1.Resize(w1, newh);
        //
        // -1 per tenere conto del pixel di bordo tra due frame orizzontali..
        if (this.ChildFrame1.Visible || this.ChildFrame2.Visible)
          w2 = neww - this.ChildFrame1.CalcWidth() - ((this.ChildFrame1.FrameBorder || this.ChildFrame2.FrameBorder) ? RD3_ClientParams.FrameBorderLeft : 1);
        this.ChildFrame2.Resize(w2, newh);
        //
        // Se il secondo frame non accetta la larghezza, e' corretto tentare di modificare quella del primo
        if (this.ChildFrame2.CalcWidth() != w2)
          this.ChildFrame1.Resize(neww- this.ChildFrame2.CalcWidth(), newh);
      }
      //
      // Ridimensiono i childbox
      this.SetChildLayout();
    }
    else
    {
      // Lanciamo l'evento al server, se sono veramente cambiate le dimensioni
      if (neww!=this.Width || newh!=this.Height)
      {
        this.SendResize = true;
        this.DeltaW += neww-this.Width;
        this.DeltaH += newh-this.Height;
      }
      //
      // Ridimensiono il mio framebox
      this.SetWidth(neww);
      this.SetHeight(newh);
    }
    // Ora se il flag che forza il resize e' attivo lo posso spegnere (il resize e' stato fatto)
    // Lo spengo qui perche' la funzione e' ricorsiva, quindi se lo spengo prima
    // i subframe non sanno di doversi ridimensionare
    if (this.ChildFrame1 && this.ChildFrame2 && this.RequestResize())
      this.ClearRequestResize();
  }
}


// ********************************************************************************
// Calcola la larghezza di questo frame tenendo conto della sua visibilita'
// ********************************************************************************
WebFrame.prototype.CalcWidth = function()
{
  // Se non sono realizzato o sono nascosto la mia larghezza e' 0
  if (!this.Realized || !this.Visible)
    return 0;
  //
  // Se ho due figli chiedo a loro la dimensione
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    if (!this.Vertical)
    {
      return this.ChildFrame1.CalcWidth() + this.ChildFrame2.CalcWidth();
    }
    else
    {
      var c1 = this.ChildFrame1.CalcWidth();
      var c2 = this.ChildFrame2.CalcWidth();
      return (c1 > c2) ? c1 : c2;
    }
  }
  else
  {
    // Altrimenti restituisco la mia larghezza
    return this.Width;
  }
}


// ********************************************************************************
// Calcola l'altezza di questo frame tenendo conto della sua visibilita'
// e del suo collassamento
// ********************************************************************************
WebFrame.prototype.CalcHeight = function()
{
  // Se non sono realizzato o sono nascosto la mia altezza e' 0
  if (!this.Realized || !this.Visible)
    return 0;
  //
  // Se ho due figli chiedo a loro la dimensione
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    if (this.Vertical)
    {
        return this.ChildFrame1.CalcHeight() + this.ChildFrame2.CalcHeight();
    }
    else
    {
      var c1 = this.ChildFrame1.CalcHeight();
      var c2 = this.ChildFrame2.CalcHeight();
      return (c1 > c2) ? c1 : c2;
    }
  }
  else
  {
    // Altrimenti restituisco la mia altezza tenendo conto del collassamento
    if (this.Collapsing)
      return this.CollapsingHeight;
    else
      return (this.Collapsed && this.ToolbarBox)? this.ToolbarBox.offsetHeight : this.Height;
  }
}


// ********************************************************************************
// Risistema il layout dei frame figli
// ********************************************************************************
WebFrame.prototype.SetChildLayout = function()
{ 
  // Nel posizionamento e dimensionamento tengo conto della visibilita' del frame: se e' invisibile la dimensione e' 0
  var w1 = this.ChildFrame1.CalcWidth();
  var w2 = this.ChildFrame2.CalcWidth();
  //
  this.ChildBox1.style.width = w1 + "px";
  this.ChildBox2.style.width = w2 + "px";
  //
  // Leggo l'altezza del primo figlio tenendo conto della sua visibilita' e dimensione
  var h1 = this.ChildFrame1.CalcHeight();
  this.ChildBox1.style.height = h1 + "px";
  //
  var h2 = this.ChildFrame2.CalcHeight();
  this.ChildBox2.style.height = h2 + "px";
  //
  // Posiziono tenendo conto delle dimensioni calcolate 
  if (this.Vertical)
    this.ChildBox2.style.top = h1+"px";
  else
    this.ChildBox2.style.left = w1+"px";
}


// ********************************************************************************
// Indica quanto il contenuto deve essere piu' basso del frame per contenere
// la toolbar, le pagine...
// ********************************************************************************
WebFrame.prototype.GetContentOffset = function()
{ 
  return this.ToolbarBox.offsetHeight;
}

// ********************************************************************************
// Indica quanto il contenuto deve essere piu' stretto del frame.. (per tabbed 
// verticali)
// ********************************************************************************
WebFrame.prototype.GetHContentOffset = function()
{ 
  return 0;
}


// **********************************************************************
// Gestisco la pressione dei tasti FK a partire dal frame
// **********************************************************************
WebFrame.prototype.HandleFunctionKeys = function(eve)
{
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var ok = false;
  //
  // Passo il mesaggio alla form
  if (!ok)
    ok = this.WebForm.HandleFunctionKeys(eve);
  //
  return ok;
}


// ********************************************************************************
// Dice se il frame ha il fuoco
// ********************************************************************************
WebFrame.prototype.HasFocus = function()
{ 
  var o = RD3_KBManager.ActiveObject;
  //
  if (o && o.GetParentFrame)
    o = o.GetParentFrame();
  //
  return o==this;
}


// **********************************************************************
// Torna true se il frame puo' avere il fuoco
// **********************************************************************
WebFrame.prototype.CanHaveFocus= function()
{
  // Se e' collassato non funziona
  if (this.Collapsed)
    return false;
  //
  if ((typeof(this)=="IDPanel") || (typeof(this)=="Book"))
    return true;
  //
  return false;
}


// ********************************************************************************
// Salva le dimensioni attuali del frame
// ********************************************************************************
WebFrame.prototype.SaveSize = function()
{ 
  this.SavedWidth = this.Width;
  this.SavedHeight = this.Height;
  //
  this.SavedDeltaW = this.DeltaW;
  this.SavedDeltaH = this.DeltaH;
  //
  if (!this.ChildFrame1)
    this.SavedRecalcResize = this.RecalcResize;
}


// ********************************************************************************
// Ripristina le dimensioni del frame
// ********************************************************************************
WebFrame.prototype.ResetSize = function()
{ 
  // Nel caso di Frame Fittizi e' sufficiente rimettere a posto la Width e l'Height, mentre nel caso 
  // di frame veri e' necessario ripristinare anche le dimensioni reali
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    this.Width = this.SavedWidth;
    this.Height = this.SavedHeight;
  }
  else
  {
    var oldRec = this.WebForm.RecalcLayout;
    //
    this.SetWidth(this.SavedWidth);
    this.SetHeight(this.SavedHeight);
    //
    // Ripristino il Recalc.. non e' il punto giusto per cambiarlo..
    this.WebForm.RecalcLayout = oldRec;
    //
    this.RecalcResize = this.SavedRecalcResize;
  }
  //
  this.ResetDelta();
}


// ********************************************************************************
// Resetta i delta dei ridimensionamenti per i frame figli
// ********************************************************************************
WebFrame.prototype.ResetDelta = function()
{ 
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    this.ChildFrame1.ResetDelta();
    this.ChildFrame2.ResetDelta();
  }
  else
  {
    this.DeltaW = this.SavedDeltaW;
    this.DeltaH = this.SavedDeltaH;
  }
}


// ********************************************************************************
// Risistema il layout dei frame figli in maniera gerarchica
// ********************************************************************************
WebFrame.prototype.SetCollapsingChildLayout = function()
{ 
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    // Nel posizionamento e dimensionamento tengo conto della visibilita' del frame: se e' invisibile la dimensione e' 0
    var w1 = this.ChildFrame1.CalcWidth();
    var w2 = this.ChildFrame2.CalcWidth();
    //
    this.ChildBox1.style.width = w1 + "px";
    this.ChildBox2.style.width = w2 + "px";
    //
    this.ChildBox1.scrollTop = "0px";
    this.ChildBox2.scrollTop = "0px";
    //
    // Leggo l'altezza del primo figlio tenendo conto della sua visibilita' e dimensione
    var h1 = this.ChildFrame1.CalcHeight();
    this.ChildBox1.style.height = h1 + "px";
    //
    var h2 = this.ChildFrame2.CalcHeight();
    this.ChildBox2.style.height = h2 + "px";
    //
    // Posiziono tenendo conto delle dimensioni calcolate 
    if (this.Vertical)
      this.ChildBox2.style.top = h1+"px";
    else
      this.ChildBox2.style.left = w1+"px";
    //
    this.ChildFrame1.SetCollapsingChildLayout();
    this.ChildFrame2.SetCollapsingChildLayout();
  }
}

// *********************************************************
// Timer globale
// *********************************************************
WebFrame.prototype.Tick = function()
{
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    this.ChildFrame1.Tick();
    this.ChildFrame2.Tick();
  }
  else
  {
    // La classe base non fa nulla
  }
}


// *********************************************************
// Gestisce evento Mouse Down
// *********************************************************
WebFrame.prototype.OnMouseDown = function(evento)
{
  var x = evento.clientX;
  var y = evento.clientY;
  //
  if (RD3_Glb.IsTouch() && evento.targetTouches && evento.targetTouches.length>0)
  {
    x = evento.targetTouches[0].clientX;
    y = evento.targetTouches[0].clientY;
  }
  var delta = RD3_Glb.IsTouch()?24:4;
  //
  // Vediamo se devo skippare l'evento perche' sto aspettando un doppio click.
  var d = new Date();
  if (d-this.MD_Time<400 && Math.abs(x-this.MD_XPos)<delta && Math.abs(y-this.MD_YPos)<delta)
    return;
  //
  // Memorizzo i dati dell'evento
  this.MD_XPos = x;
  this.MD_YPos = y;
  this.MD_Time = d;
  this.MD_Button = RD3_Glb.IsTouch() ? 0 : evento.button;
  this.MD_Target = evento.target?evento.target:evento.srcElement;
  this.MD_Clicked = false;
}


// *********************************************************
// Vediamo se e' possibile avere un raw click o raw dblclick
// *********************************************************
WebFrame.prototype.OnMouseUp = function(evento)
{
  if (this.RawTouchTimer)
  {
    window.clearTimeout(this.RawTouchTimer);
    this.RawTouchTimer = null;
  }
  //
  var x = evento.clientX;
  var y = evento.clientY;
  //
  if (RD3_Glb.IsTouch() && evento.changedTouches && evento.changedTouches.length>0)
  {
    x = evento.changedTouches[0].clientX;
    y = evento.changedTouches[0].clientY;
  }
  //
  var delta = RD3_Glb.IsTouch()?24:4;
  var b = evento.button ? evento.button : 0;
  var t = evento.target?evento.target:evento.srcElement;
  var d = new Date();
  //
  // b=999 e' il tocco prolungato che simula il tasto dx
  var sm = (b==this.MD_Button || b == 999);
  if (b==999)
    b=2;
  //
  // Vediamo se il mouse up e' avvenuto nello stesso posto del down
  if (Math.abs(x-this.MD_XPos)<delta && Math.abs(y-this.MD_YPos)<delta && sm && t==this.MD_Target)
  {
    // Posso effettivamente avere un click
    var dbl = false;
    if (this.MD_Clicked && d-this.MD_Time<400)
      dbl = true;
    //
    // Aggiusto bottone per IE
    if (RD3_Glb.IsIE())
    {
      if (b & 0x01)
        b=0;
      else if (b & 0x02)
        b=2;
      else if (b & 0x04)
        b=1;
    }
    //
    // Considero coordinate relative al frame
    // In questo caso non mi interessa lo scrollLeft/scrollTop, infatti l'x e y sono assolute in base allo schermo,
    // questo significa che anche il left/top non devono contenere lo scrollTop - siccome GetScreenLeft lo considera qui lo dobbiamo togliere
    var xp = x - (RD3_Glb.GetScreenLeft(this.FrameBox) - document.body.scrollLeft);  
    var yp = y - (RD3_Glb.GetScreenTop(this.FrameBox) - document.body.scrollTop);
    if (xp<0)
      xp = 0;
    if (yp < 0)
      yp = 0;
    //
    // Prima di lanciare l'evento, verifico che esso non venga "bubblato" da un altro frame
    // a me sovrapposto.
    var ok = true;
    var tt = t;
    while (tt)
    {
      if (RD3_Glb.HasClass(tt,"frame-container"))
      {
        ok = (tt==this.FrameBox);
        break;
      }
      tt = tt.parentNode;
    }
    //
    if (ok)
      this.OnFrameClick(evento, dbl, b, xp, yp, x, y, t);
    //
    // Dopo aver gestito un doppio click, ritorno al tipo normale.
    this.MD_Clicked = !dbl;
  }
}

WebFrame.prototype.OnTouchDown = function(evento)
{
  this.OnMouseDown(evento);
  //
  this.RawTouchTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnRawRightClick')",750);
  //
  return true;
}

WebFrame.prototype.OnTouchUp = function(evento, click)
{
  if (click)
  {
    // Se ho cliccato e c'e' ancora il timer allora faccio scattare il Mouse Up, se il timer e' gia' scattato allora il click e'
    // stato gia' gestito e non faccio nulla
    if (this.RawTouchTimer != null)
      this.OnMouseUp(evento);
  }
  else 
  {
    // Se scrollo devo disabilitare il Timer, se presente
    if (this.RawTouchTimer)
    {
      window.clearTimeout(this.RawTouchTimer);
      this.RawTouchTimer = null;
    }
  }
  
  //
  return true;
}

WebFrame.prototype.OnRawRightClick = function()
{
  this.RawTouchTimer = null;
  var evento = new Object();
  evento.clientX = this.MD_XPos;
  evento.clientY = this.MD_YPos;
  evento.button = 999;
  evento.target = this.MD_Target;
  //
  this.OnMouseUp(evento);
}

// *********************************************************
// Lancio Evento Row: sovrascritto nelle classi derivate
// *********************************************************
WebFrame.prototype.OnFrameClick = function(evento, dbl, btn, x, y, xb, yb, tget)
{
  ;
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
WebFrame.prototype.GetTooltip = function(tip, obj)
{
  var ok = false;
  if (obj == this.LockButton)
  {
    if (this.Locked)
    {
      tip.SetTitle(ClientMessages.TIP_TITLE_TooltipUnlock);
      tip.SetText(RD3_ServerParams.TooltipUnlock + RD3_KBManager.GetFKTip(RD3_ClientParams.FKLocked));
    }
    else
    {
      tip.SetTitle(ClientMessages.TIP_TITLE_TooltipLock);
      tip.SetText(RD3_ServerParams.TooltipLock + RD3_KBManager.GetFKTip(RD3_ClientParams.FKLocked));
    }
    ok = true;
  }
  else if (obj == this.CollapseButton)
  {
    if (this.Collapsed)
    {
      tip.SetTitle(ClientMessages.TIP_TITLE_MostraRiquadro);
      tip.SetText(RD3_ServerParams.MostraRiquadro);
    }
    else
    {
      tip.SetTitle(ClientMessages.TIP_TITLE_NascondiRiquadro);
      tip.SetText(RD3_ServerParams.NascondiRiquadro);
    }
    ok = true;
  }
  //
  if (ok)
  {
    // Di default i bottoni di pannello mostrano il tooltip centrato sopra di essi
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + ((obj.offsetWidth-4)/2), RD3_Glb.GetScreenTop(obj));
    tip.SetPosition(0);
    return true;
  }
  //
  return false;
}


// *********************************************************
// Ritorna l'oggetto DOM contenente il frame
// *********************************************************
WebFrame.prototype.GetDOMObj = function()
{
  return this.ContentBox;
}

// *********************************************************
// Elimina un frame
// *********************************************************
WebFrame.prototype.DeleteFrame = function(value)
{
  // Mi cerco nell'array di mio padre
  var n = this.WebForm.Frames.length;
  for (var i=0; i<n; i++)
  {
    if (this.WebForm.Frames[i] == this)
    {
      this.WebForm.Frames.splice(i, 1);
      this.Unrealize();
      //
      break;
    }
  }
}


// ********************************************************************************
// Evento di inizio tocco sulla toolbar del frame
// ********************************************************************************
WebFrame.prototype.OnTouchStartTb = function(e)
{ 
  // Inizio lo scrolling solo se uno un solo dito
  if (e.targetTouches.length != 1)
    return false;
  //
  // Per gli input non gestisco gli eventi touch perche' voglio che appaia la tastiera
  var ele = RD3_Glb.ElementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  if (ele && ((ele.tagName=="INPUT" && ele.type != "button") || ele.tagName=="TEXTAREA" || RD3_Glb.isInsideEditor(ele)))
    return false;
  //
  // Ho toccato la toolbar e non su di un INPUT... allora tolgo il fuoco dal SearchBox per sicurezza
  if (RD3_Glb.IsMobile() && this.SearchBox)
    this.SearchBox.blur();
  //
  e.preventDefault();
  //
  var theTarget = RD3_Glb.ElementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  var isarrow = RD3_Glb.HasClass(theTarget,"panel-formlist-button") || RD3_Glb.HasClass(theTarget,"panel-formlist-arrow");
  if (isarrow)
  {
    RD3_Glb.AddClass(this.FormListButton, "panel-toolbar-active");
    RD3_Glb.AddClass(this.FormListButtonImg, "panel-toolbar-active");
  }
  //
  // Memorizzo la posizione
  this.TbTouchStartX = e.targetTouches[0].clientX;
  this.TbTouchStartY = e.targetTouches[0].clientY;
  this.TbTouchOrgX = this.TbTouchStartX;
  this.TbTouchOrgY = this.TbTouchStartY;
  this.TbMoved = false;
  //
  return false;
}


// ********************************************************************************
// Evento di movimento del ditino sulla toolbar del frame
// ********************************************************************************
WebFrame.prototype.OnTouchMoveTb = function(e)
{ 
  // Non era per me, continuo il giro
  if (this.TbTouchStartX==-1)
    return false;
  //
  // Prevent the browser from doing its default thing (scroll, zoom)
  e.preventDefault();
  //
  // Don't track motion when multiple touches are down in this element (that's a gesture)
  if (e.targetTouches.length != 1)
    return false;
  //
  var xd = e.targetTouches[0].clientX - this.TbTouchStartX;
  var yd = e.targetTouches[0].clientY - this.TbTouchStartY;
  //
  // Il ditino si e' mosso in orizzontale. Sposto la toolbar
  if (!RD3_Glb.IsMobile())
  {
    this.ToolbarBox.scrollLeft -= xd;
    this.AdaptScrollBox();
  }
  //
  // Memorizzo la nuova posizione
  this.TbTouchStartX = e.targetTouches[0].clientX;
  this.TbTouchStartY = e.targetTouches[0].clientY;
  if (Math.abs(this.TbTouchStartX-this.TbTouchOrgX)>RD3_ClientParams.TouchMoveLimit || Math.abs(this.TbTouchStartY-this.TbTouchOrgY)>RD3_ClientParams.TouchMoveLimit)
    this.TbMoved = true;
  //
  return false;
}


// ********************************************************************************
// Evento di movimento del ditino sulla toolbar del frame
// ********************************************************************************
WebFrame.prototype.OnTouchEndTb = function(e)
{ 
  // Non era per me, continuo il giro
  if (this.TbTouchStartX==-1)
    return false;
  //
  // Prevent the browser from doing its default thing (scroll, zoom)
  e.preventDefault();
  //
  // Stop tracking when the last finger is removed from this element
  if (e.targetTouches.length != 0)
    return false;
  //
  // Simulo il click se non mi ero mosso.
  if(e.changedTouches.length==1) 
  {
    var theTarget = RD3_Glb.ElementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    var theFrame = RD3_Glb.GetParentFrame(theTarget);
    var isbtn = theTarget.tagName=="IMG" || theTarget.tagName=="INPUT";
    var isarrow = RD3_Glb.HasClass(theTarget,"panel-formlist-button") || RD3_Glb.HasClass(theTarget,"panel-formlist-arrow");
    if (RD3_Glb.HasClass(theTarget,"toolbar-command-showcaption"))
      isbtn = true;
    //
    if (theTarget && theFrame==this && (isbtn||isarrow) && !this.TbMoved)
    {
      var theEvent = document.createEvent('MouseEvents');
      theEvent.initMouseEvent("click", true, true, window, 1, this.TbTouchStartX, this.TbTouchStartY, this.TbTouchStartX, this.TbTouchStartY);
      theTarget.dispatchEvent(theEvent);
      //
      if (!RD3_Glb.IsMobile())
      {
        if (RD3_Glb.HasClass(theTarget, "toolbar-frame-image"))
        {
          RD3_Glb.TouchHL(theTarget);
        }
        else
        {
          if (theTarget.tagName=="INPUT" || RD3_Glb.HasClass(theTarget, "toolbar-command-showcaption"))
          {
            RD3_Glb.TouchHL(theTarget);
          }
          else
          {        
            theTarget.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "") + "-down";
            window.setTimeout("document.getElementById('"+theTarget.id+"').className = 'frame-toolbar-button" + ((this.SmallIcons)? "-small" : "")+"'",300);
          }
        }
      }
    }
    //
    // Se tocco la caption, torno in cima
    if (theTarget == this.CaptionTxt && this.IDScroll && !this.TbMoved)
      this.IDScroll.GoTop();
    if (theTarget == this.CaptionTxt && this.WebForm.Messages.length>0)
      this.WebForm.OpenMessageBar(100);
    //
    // Se era una freccia, la decoloro
    if (isarrow)
    {
      RD3_Glb.RemoveClass(this.FormListButton, "panel-toolbar-active");
      RD3_Glb.RemoveClass(this.FormListButtonImg, "panel-toolbar-active");
    }
  }
  //
  this.TbTouchStartX=-1;
  this.TbTouchStartY=-1;
  this.TbTouchOrgX=-1;
  this.TbTouchOrgY=-1;
  this.TbMoved = false;  
  //
  return false;
}


// ********************************************************************************
// Eventi di tocco sul content
// ********************************************************************************
WebFrame.prototype.OnTouchStart = function(e)
{ 
  // Controllo chiusura calendario
  if (RD3_DesktopManager.WebEntryPoint.CalPopup.style.display!="none")
    RD3_DesktopManager.WebEntryPoint.CalPopup.style.display="none";
  //
  // e combo box
  if (RD3_DDManager.OpenCombo)
    RD3_DDManager.OpenCombo.Close();
  //
  // e popup vari
  RD3_DesktopManager.WebEntryPoint.OnClick(e);
  //
  // e messagebar
  this.WebForm.OpenMessageBar(-1);
  //
  this.FormScroll = true;
  this.WebForm.OnTouchStart(e);
}

WebFrame.prototype.OnTouchMove = function(e)
{ 
  if (this.FormScroll)
    this.WebForm.OnTouchMove(e);
}

WebFrame.prototype.OnTouchEnd = function(e)
{ 
  if (this.FormScroll)
    this.WebForm.OnTouchEnd(e);
  RD3_TooltipManager.DeactivateAll();
}

// ********************************************************************
// Gestione ridimensionamento Frame: questo frame e' ridimensionabile?
// ********************************************************************
WebFrame.prototype.IsTransformable = function(id)
{ 
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    // Sono ridimensionabile solo se entrambi i miei figli lo sono: verifico 
    // se uno dei due ha il flag altezza o larghezza fissa abilitato (altezza massima==altezza minima..)
    if (this.Vertical)
      return !((this.ChildFrame1.MinHeight==this.ChildFrame1.MaxHeight && this.ChildFrame1.MinHeight!=0) || (this.ChildFrame2.MinHeight==this.ChildFrame2.MaxHeight && this.ChildFrame2.MinHeight!=0) || RD3_ServerParams.EnableFrameResize==false);
    else
      return !((this.ChildFrame1.MinWidth==this.ChildFrame1.MaxWidth && this.ChildFrame1.MinWidth!=0) || (this.ChildFrame2.MinWidth==this.ChildFrame2.MaxWidth && this.ChildFrame2.MinWidth!=0) || RD3_ServerParams.EnableFrameResize==false);
  }
  else
  {
    // Non sono solo io a decidere se sono ridimensionabile; dipende anche da mio fratello, quindi chiedo a mio padre
    if (this.ParentFrame)
      return this.ParentFrame.IsTransformable(id);
    else
      return false; // Il Frame[0] non e' ridimensionabile!
  }
}

WebFrame.prototype.IsMoveable = function()
{ 
  return false;
}

WebFrame.prototype.DragObj= function(id, obj, x, y) 
{
  // Sul Frame[0] non e' permesso nessun resize
  if (!this.ParentFrame)
    return null;
  //
  var ox = x - RD3_Glb.GetScreenLeft(obj);
  var oy = y - RD3_Glb.GetScreenTop(obj);
  //
  var pos = 0;
  if (ox<=10)
    pos = 1;  // LEFT
  else if (ox>=(obj.offsetWidth-10))
    pos = 2; // RIGTH
  else if (oy<=10)
    pos = 3; // UP
  else if (oy>=(obj.offsetHeight-10))
    pos = 4; // DOWN
  //
  if (pos==0)
    return this;
  //
  // 
  if (pos ==1 && !(!this.ParentFrame.Vertical && this.ParentFrame.ChildFrame2==this))
    return this.ParentFrame.DragObj(id, obj, x, y);
  if (pos ==2 && !(!this.ParentFrame.Vertical && this.ParentFrame.ChildFrame1==this))
    return this.ParentFrame.DragObj(id, obj, x, y);
  if (pos ==3 && !(this.ParentFrame.Vertical && this.ParentFrame.ChildFrame2==this))
    return this.ParentFrame.DragObj(id, obj, x, y);  
  if (pos ==4 && !(this.ParentFrame.Vertical && this.ParentFrame.ChildFrame1==this))
    return this.ParentFrame.DragObj(id, obj, x, y);
  //
  return this;
}

WebFrame.prototype.DropElement = function()
{ 
  if (this.FrameBox)
    return this.FrameBox;
  else if (this.ParentFrame && this.ParentFrame.ChildFrame1==this)
    return this.ParentFrame.ChildBox1;
  else if (this.ParentFrame && this.ParentFrame.ChildFrame2==this)
    return this.ParentFrame.ChildBox2;
}

WebFrame.prototype.ApplyCursor = function(cn)
{ 
  if (this.ChildFrame1 && this.ChildFrame2)
  {
    this.ChildFrame1.ApplyCursor(cn);
    this.ChildFrame2.ApplyCursor(cn);
  }
  else
  {
    if (this.FrameBox)
      this.FrameBox.style.cursor=cn;
  }
}

WebFrame.prototype.CanResizeW = function()
{ 
  if (this.ParentFrame)
    return !this.ParentFrame.Vertical;
  else
    return false;  
}

WebFrame.prototype.CanResizeH = function()
{ 
  if (this.ParentFrame)
    return this.ParentFrame.Vertical;
  else
    return false;  
}

WebFrame.prototype.CanResizeL = function()
{ 
  // Posso ridimensionare a sinistra solo se mio padre e' orizzonatale ed io sono il secondo frame
  if (this.ParentFrame)
  {
    if (this.ParentFrame.ChildFrame2==this)
      return !this.ParentFrame.Vertical;
    else
    {
      return this.ParentFrame.CanResizeL();
    }
  }
  else
  {
    return false;
  }
}

WebFrame.prototype.CanResizeR = function()
{
  // Posso ridimensionare a destra solo se mio padre e' orizzonatale ed io sono il primo frame
  if (this.ParentFrame)
  {
    if (this.ParentFrame.ChildFrame1==this)
      return !this.ParentFrame.Vertical;
    else
    {
      return this.ParentFrame.CanResizeR();
    }
  }
  else
  {
    return false;
  }
}

WebFrame.prototype.CanResizeT = function()
{ 
  // Posso ridimensionare sopra solo se mio padre e' verticale ed io sono il secondo frame
  if (this.ParentFrame)
  {
    if (this.ParentFrame.ChildFrame2==this)
      return this.ParentFrame.Vertical;
    else
    {
      return this.ParentFrame.CanResizeT();
    }
  }
  else
  {
    return false;  
  }
}

WebFrame.prototype.CanResizeD = function()
{ 
  // Posso ridimensionare sotto solo se mio padre e' verticale ed io sono il primo frame
  if (this.ParentFrame)
  {
    if (this.ParentFrame.ChildFrame1==this)
      return this.ParentFrame.Vertical;
    else
    {
      return this.ParentFrame.CanResizeD();
    }
  }
  else
    return false; 
}


// ********************************************************************************
// Metodo chiamato per effettuare la trasformazione
// ********************************************************************************
WebFrame.prototype.OnTransform = function(x, y, w, h, evento)
{
  if (!this.ParentFrame)
    return;
  //
  var brother = this.ParentFrame.ChildFrame1==this ? this.ParentFrame.ChildFrame2 : this.ParentFrame.ChildFrame1;
  if (this.ParentFrame.Vertical)
  {
    // Gestisco le dimensioni minime,il frame non puo' rimpicciolirsi troppo o suo fratello non puo' rimpicciolirsi troppo
    var minimumH = RD3_ClientParams.FrameMinimumSize > this.MinHeight ? RD3_ClientParams.FrameMinimumSize : this.MinHeight;
    if (h < minimumH)
       h = minimumH;
    minimumH = RD3_ClientParams.FrameMinimumSize > brother.MinHeight ? RD3_ClientParams.FrameMinimumSize : brother.MinHeight;
    if (h>this.ParentFrame.CalcHeight() - minimumH)
      h = this.ParentFrame.CalcHeight() - minimumH;
    //
    // Gestisco ora le dimensioni massime
    if (this.MaxHeight > 0 && h>this.MaxHeight)
      h = this.MaxHeight;
    if (brother.MaxHeight > 0 && this.ParentFrame.CalcHeight() - h > brother.MaxHeight)
      h = this.ParentFrame.CalcHeight() - brother.MaxHeight;
    //
    var deltH = h - this.CalcHeight();
    //
    var resH = this.WebForm.ResModeH;
    var resW = this.WebForm.ResModeW;
    if (resH != RD3_Glb.FRESMODE_STRETCH)
      this.WebForm.ResModeH=RD3_Glb.FRESMODE_STRETCH;
    if (resW != RD3_Glb.FRESMODE_STRETCH)  
      this.WebForm.ResModeW=RD3_Glb.FRESMODE_STRETCH;
    //
    this.Resize(this.CalcWidth(), h);
    this.OrgHeight = this.Height;
    brother.Resize(brother.CalcWidth(), brother.CalcHeight() - deltH);
    brother.OrgHeight = brother.Height;
    //
    this.WebForm.ResModeH=resH;
    this.WebForm.ResModeW=resW;
    //
    this.ParentFrame.SetChildLayout();
    this.AdaptLayout();
    brother.AdaptLayout();
  }
  else
  {
    // Gestisco le dimensioni minime,il frame non puo' rimpicciolirsi troppo o suo fratello non puo' rimpicciolirsi troppo
    var minimumW = RD3_ClientParams.FrameMinimumSize > this.MinWidth ? RD3_ClientParams.FrameMinimumSize : this.MinWidth;
    if (w<minimumW)
       w = minimumW;
    minimumW = RD3_ClientParams.FrameMinimumSize > brother.MinWidth ? RD3_ClientParams.FrameMinimumSize : brother.MinWidth;
    if (w>this.ParentFrame.CalcWidth() - minimumW)
      w = this.ParentFrame.CalcWidth() - minimumW;
    //
    // Gestisco ora le dimensioni massime
    if (this.MaxWidth > 0 && w>this.MaxWidth)
      w = this.MaxWidth;
    if (brother.MaxWidth > 0 && this.ParentFrame.CalcWidth() - w > brother.MaxWidth)
      w = this.ParentFrame.CalcWidth() - brother.MaxWidth;
    //
    var deltW = w - this.CalcWidth();
    //
    var resH = this.WebForm.ResModeH;
    var resW = this.WebForm.ResModeW;
    if (resH != RD3_Glb.FRESMODE_STRETCH)
      this.WebForm.ResModeH=RD3_Glb.FRESMODE_STRETCH;
    if (resW != RD3_Glb.FRESMODE_STRETCH)  
      this.WebForm.ResModeW=RD3_Glb.FRESMODE_STRETCH;
    //
    this.Resize(w, this.CalcHeight());
    this.OrgWidth = this.Width;
    brother.Resize(brother.CalcWidth() - deltW, brother.CalcHeight());
    brother.OrgWidth = brother.Width;
    //
    this.WebForm.ResModeH=resH;
    this.WebForm.ResModeW=resW;
    //
    this.ParentFrame.SetChildLayout();
    this.AdaptLayout();
    brother.AdaptLayout();
  }
  //
  // Invio il messaggio di resize della Form
  var clw = this.WebForm.PopupFrame ? this.WebForm.PopupFrame.PopupBox.clientWidth :this.WebForm.FramesBox.clientWidth;
  var clh = this.WebForm.PopupFrame ? this.WebForm.PopupFrame.PopupBox.clientHeight : this.WebForm.FramesBox.clientHeight;
  var ev = new IDEvent("resize", this.WebForm.Identifier, null, this.WebForm.ResizeEventDef, null, clw, clh);
}


//*************************************************************************************
// Gestore evento cambio valore della cella di ricerca: invia al server il nuovo valore
//*************************************************************************************
WebFrame.prototype.OnSearchChange= function(evento, noblur)
{ 
  if (this.SearchBox.value != "")
    RD3_Glb.AddClass(this.SearchBox, "frame-search-box-deletable");
  else
    RD3_Glb.RemoveClass(this.SearchBox, "frame-search-box-deletable");
  //
  if (this.lastSearchSent != this.SearchBox.value) {
    var ev = new IDEvent("srcbox", this.Identifier, evento, RD3_Glb.EVENT_ACTIVE, this.SearchBox.value);
    this.lastSearchSent = this.SearchBox.value;
  }
  //
  if (noblur)
    return;
  //
  this.SearchBox.blur();
}

//*************************************************************
// Gestore evento INVIO : esegue subito la ricerca
//*************************************************************
WebFrame.prototype.OnSearchKeyPress = function(evento)
{ 
  if (evento.keyCode == 13)
    this.OnSearchChange(evento);
}

//***********************************************************
// Mostra o nasconde il pulsante per svuotare la ricerca
// ed esegue la ricerca attiva
//***********************************************************
WebFrame.prototype.OnSearchKeyUp = function(evento)
{ 
  if (this.SearchBox.value != "")
    RD3_Glb.AddClass(this.SearchBox, "frame-search-box-deletable");
  else
    RD3_Glb.RemoveClass(this.SearchBox, "frame-search-box-deletable");
  //
  // Su tablet attiviamo un timer per rendere attiva la ricerca
  if (!RD3_Glb.IsSmartPhone())
  {
    // Eliminiamo un timer gia' presente
    if (this.searchTimer != null)
    {
      window.clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }
    //
    // Attiviamo il timer
    var _this = this;
    this.searchTimer = window.setTimeout(function() 
    {
      if (_this.lastSearchSent != _this.SearchBox.value) {
        var ev = new IDEvent("srcbox", _this.Identifier, evento, RD3_Glb.EVENT_ACTIVE, _this.SearchBox.value);
        _this.lastSearchSent = _this.SearchBox.value;
      }
    }, 300);
  }
}

//***********************************************************
// Gestione del pulsante di svuotamento della ricerca
//***********************************************************
WebFrame.prototype.OnSearchMouseDown = function(ev)
{
  if (!RD3_Glb.IsSmartPhone() && !RD3_Glb.IsQuadro())
  {
    var w = this.CaptionTxt.offsetLeft - this.SearchBox.offsetLeft - 4;
    //
    // Massimo e minimo
    w = (w > 200 ? 200 : (w < 102 ? 102 : w));
    this.SearchBox.style.width = w + "px";
  }
  //
  if(!RD3_Glb.HasClass(this.SearchBox, "frame-search-box-deletable"))
    return;
  //
  var x = (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true)) ? ev.targetTouches[0].clientX : ev.clientX;
  var offs = x-(RD3_Glb.GetScreenLeft(this.SearchBox, true)+this.SearchBox.offsetWidth);
  if (offs<0 && offs >=-40)
  {
    // Prima di tutto svuotiamo la search
    this.SearchBox.value = "";
    //
    // Lo lancio io perche' altrimenti non scatta
    // Su Android il blur non va.. toglie il fuoco poi lui lo rimette.. e si ha un effetto bruttissimo 
    // (tastiera che esce ed entra.. campo che scompare su smartphone..) - tanto vale non farlo direttamente
    this.OnSearchChange(ev, RD3_Glb.IsAndroid());
    if (!RD3_Glb.IsAndroid())
      this.OnSearchBlur();
    delete this.lastSearchSent;
    //
    ev.preventDefault();
    RD3_Glb.StopEvent(ev);
    return false;    
  }
}

//********************************************************
// Perdita del fuoco della cella di ricerca
//********************************************************
WebFrame.prototype.OnSearchBlur = function(ev)
{
  this.SearchBox.style.width = "";
  //
  // Su iOS7 non si rimette a posto lo scroll quando la tastiera e' chiusa
  if ((RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7)) && RD3_Glb.IsMobile())
    window.setTimeout("document.body.scrollTop = 0;", 50);
}

WebFrame.prototype.SetSearchBoxValue = function(val)
{
  if (!this.Realized || !this.SearchBox)
  {
    this.SetSearchValue = val;
    return;
  }
  //
  this.SearchBox.value = val;
  delete this.lastSearchSent;
  //
  if (val != "")
    RD3_Glb.AddClass(this.SearchBox, "frame-search-box-deletable");
  else
    RD3_Glb.RemoveClass(this.SearchBox, "frame-search-box-deletable");
}

// ********************************************************************************
// Gestore evento di click sulla caption
// ********************************************************************************
WebFrame.prototype.OnCaptionClick= function(evento)
{ 
  // mostra i messaggi oppure
  // fa tornare in cima il contenuto
  if (this.WebForm.Messages.length>0)
    this.WebForm.OpenMessageBar(100);
  else if (this.IDScroll)
    this.IDScroll.GoTop();
}


// ********************************************************************************
// Ritorna l'oggetto DOM della toolbar custom attaccata a questo frame
// ********************************************************************************
WebFrame.prototype.GetCustomToolbar= function()
{ 
  if (!this.ToolbarBox)
    return;
  //
  var obj = this.ToolbarBox.firstChild;
  while (obj)
  {
    if (RD3_Glb.HasClass(obj,"toolbar-frame-container"))
      return obj;
    obj = obj.nextSibling;
  }
}

// ********************************************************************************
// Mouse Down riflesso da IDScroll o da un'altro frame
// ********************************************************************************
WebFrame.prototype.OnReflectMouseDown = function(ev, fromScroll, direction)
{ 
  // Se mi arriva un messaggio da IDScroll verifico se posso gestirlo o meno: se non lo posso gestire non faccio nulla 
  if (fromScroll && (!this.IsSubObj() || !this.MustReflectScrollToParent(direction)))
    return -1;
  // 
  // Se mi arriva il messaggio da IDScroll oppure se sono un figlio e lo devo riflettere su mio padre..
  if (fromScroll || (this.IsSubObj() && this.MustReflectScrollToParent(direction)))
  {
    var par = this.WebForm.SubFormObj;
    if (par instanceof SubForm)
      par = RD3_DesktopManager.ObjectMap[par.ParentFrameIdentifier];
    else if (par == null)
      par = RD3_DesktopManager.ObjectMap[this.ParentFrameIdentifier];
    //
    // Per sicurezza faccio un'ulteriore controllo..
    if (!par)
      return -1;
    //
    // Passo al mio Parent la palla: decide lui se gestire lo scroll o no.. (magari anche lui non e' interessato..)
    var ret = -1;
    if (par instanceof BookBox)
      ret = par.ParentPage.ParentBook.OnReflectMouseDown(ev, false, direction);
    else if (par instanceof PField)
      ret = par.ParentPanel.OnReflectMouseDown(ev, false, direction);
    //
    return ret;
  }
  else if (!fromScroll && this.IDScroll)
  {
    // Se e' riflesso e ho IDScroll lo gestisco io
    this.IDScroll.OnMouseDown(ev, true);
    //
    return 1;
  }
  //
  return -1;
}

// ********************************************************************************
// Mouse Move riflesso da IDScroll o da un'altro frame
// ********************************************************************************
WebFrame.prototype.OnReflectMouseMove = function(ev, fromScroll)
{ 
  if (fromScroll && !this.IsSubObj())
    return;
  //
  if (fromScroll || this.IsSubObj())
  {
    var par = this.WebForm.SubFormObj;
    if (par instanceof SubForm)
      par = RD3_DesktopManager.ObjectMap[par.ParentFrameIdentifier];
    else if (par == null)
      par = RD3_DesktopManager.ObjectMap[this.ParentFrameIdentifier];
    //
    // Passo al mio Parent la palla
    if (par instanceof BookBox)
      par.ParentPage.ParentBook.OnReflectMouseMove(ev, false);
    else if (par instanceof PField)
      par.ParentPanel.OnReflectMouseMove(ev, false);
  }
  else if (!fromScroll && this.IDScroll)
  {
    this.IDScroll.OnMouseMove(ev, true);
  }
}

// ********************************************************************************
// Mouse Up riflesso da IDScroll o da un'altro frame
// ********************************************************************************
WebFrame.prototype.OnReflectMouseUp = function(ev, fromScroll)
{ 
  if (fromScroll && !this.IsSubObj())
    return;
  //
  if (fromScroll || this.IsSubObj())
  {
    var par = this.WebForm.SubFormObj;
    if (par instanceof SubForm)
      par = RD3_DesktopManager.ObjectMap[par.ParentFrameIdentifier];
    else if (par == null)
      par = RD3_DesktopManager.ObjectMap[this.ParentFrameIdentifier];
    //
    // Passo al mio Parent la palla
    if (par instanceof BookBox)
      par.ParentPage.ParentBook.OnReflectMouseUp(ev, false);
    else if (par instanceof PField)
      par.ParentPanel.OnReflectMouseUp(ev, false);
  }
  else if (!fromScroll && this.IDScroll)
  {
    this.IDScroll.OnMouseUp(ev, true);
  }
}

// ********************************************************************************
// True se sono un sotto-oggetto (contenuto in subform o in subField)
// ********************************************************************************
WebFrame.prototype.IsSubObj  = function()
{
  return ((this.WebForm.SubFormObj || this.ParentFrameIdentifier != "") ? true : false);
}

// ********************************************************************************
// True se devo riflettere lo scroll in una direzione a mio padre (non lo gestisco..)
// ********************************************************************************
WebFrame.prototype.MustReflectScrollToParent  = function(direction)
{
  if (direction == 0)
    return (this.Scrollbar==RD3_Glb.FORMSCROLL_NONE || this.Scrollbar==RD3_Glb.FORMSCROLL_VERT);
  else if (direction == 1)
    return (this.Scrollbar==RD3_Glb.FORMSCROLL_NONE || this.Scrollbar==RD3_Glb.FORMSCROLL_HORIZ);
  //
  return false;
}


// ********************************************************************************
// Nasconde o mostra i pulsanti di Back dell'albero nel caso mobile
// ********************************************************************************
WebFrame.prototype.ChangeExpose  = function(exposed)
{
  if (exposed)
  {
    this.SetCaption();
    this.WebForm.AdaptToolbar = true;
  }
}


// *******************************************************************
// Chiamato quando cambia il colore di accento
// *******************************************************************
WebFrame.prototype.AccentColorChanged = function(reg, newc) 
{
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
WebFrame.prototype.OnAdaptRetina = function(w, h, par)
{
  if (this.IconImg)
  {
    this.IconImg.width = w;
    this.IconImg.height = h;
    this.IconImg.style.display = "";
  }
}


// ******************************************************************
// Memorizza o ripristina le posizione delle scrollbar
// usata quando una modale viene riportata in primo piano per non 
// perdere il posizionamento delle scrollbar
//
// vedi popupframe::BringToFront
// ******************************************************************
WebFrame.prototype.SaveScrollPos = function ()
{
  if (this.ContentBox)
  {
    // Mi memorizzo la posizione delle scrollbar del contenuto
    this.ScrollTopPosition = this.ContentBox.scrollTop;
    this.ScrollLeftPosition = this.ContentBox.scrollLeft;
  }
}


WebFrame.prototype.SetScrollPos = function ()
{
  if (this.ContentBox)
  {
    // Riposiziono le scrollbar nelle coordinate salvate
    this.ContentBox.scrollTop = this.ScrollTopPosition;
    this.ContentBox.scrollLeft = this.ScrollLeftPosition;
    //
    delete this.ScrollTopPosition;
    delete this.ScrollLeftPosition;
  }
}

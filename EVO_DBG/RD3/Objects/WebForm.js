// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe WebForm: rappresenta una form aperta
// ************************************************
function WebForm() 
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = "";                         // Codice della form (es: "frm:3")
  this.IdxForm = 0;                             // L'indice della form
  //
  this.Caption = "";                            // La caption
  this.WebCaption = "";                         // La caption (in formato HTML...)
  this.Image = "";                              // L'icona da mostrare
  this.Modal = 0;                               // 0=MDI, 1,-1: MODAL, 2: POPUP non modale
  this.Docked = false;                          // Se vero la form e' docked
  this.DockType = 0;                            // Indica il lato di aggancio della form
  this.Visible = true;                          // Visibilita' della form
  this.ToolbarPosition = RD3_Glb.FORMTOOL_LEFT; // Indica come e dove mostrare i bottoni della form
  this.BorderType = RD3_Glb.BORDER_THICK;       // Indica il tipo di bordo
  this.WindowState = RD3_Glb.WS_NORMAL;         // Stato della finestra
  this.VisualFlags = -1;                        // Flag visuali
  this.FormLeft = -1;                           // In caso di form modale, indicano dove deve apparire
  this.FormTop = -1;                            // In caso di form modale, indicano dove deve apparire
  this.FormWidth = -1;                          // In caso di form modale, indicano dove deve apparire
  this.FormHeight = -1;                         // In caso di form modale, indicano dove deve apparire
  //this.RelatedTo;
  this.RelatedPlacement = 0;
  this.NormalLeft = null;                       // Posizione e dimensione videata quando era in stato normale (e ora e' massimizzata o minimizzata)
  this.NormalTop = null;                        // Posizione e dimensione videata quando era in stato normale (e ora e' massimizzata o minimizzata)
  this.NormalWidth = null;                      // Posizione e dimensione videata quando era in stato normale (e ora e' massimizzata o minimizzata)
  this.NormalHeight = null;                     // Posizione e dimensione videata quando era in stato normale (e ora e' massimizzata o minimizzata)  
  this.NormalWindowState = null;
  this.ResModeW = RD3_Glb.FRESMODE_NONE;        // Modalita' di ridimensionamento della form
  this.ResModeH = RD3_Glb.FRESMODE_NONE;        // Modalita' di ridimensionamento della form
  this.PreviewFrame = null;                     // Il frame da mostrare in preview
  this.HandledKeys = 0;                         // Tasti da intercettare a livello di form
  this.BackButtonTxt = null;                    // Testo da mostrare nel back-button (qualora presente)
  this.CloseOnSelection = false;                // Devo chiudere la form quando si esegue una selezione?
  //this.ClassName = null;                      // Classe specifica da applicare alla Form
  //
  // Oggetti secondari gestiti da questo oggetto di modello
  this.Frames = new Array();                    // I frame che contengono gli oggetti visuali
  this.Messages = new Array();                  // Elenco dei messaggi della form
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo comando o command set
  //
  // Variabili secondarie di questo'oggetto
  this.AlreadyVisible = false;              // Questa form e' a video? 
  this.Animating = false;                   // C'e' un'animazione su questa form?
  this.OpenX = 0;                           // Posizione X di apertura della form modale (per zoom)
  this.OpenY=0;                             // Posizione Y di apertura della form modale (per zoom)
  this.PopupResAnim = false;                // Devo far partire l'animazione di resize della Popup?
  this.PopupResAnimating = false;           // Sto eseguendo l'animazione riguardante il popup?
  this.PopupRect = new Rect(-1,-1,-1,-1);   // Vecchia posizione della modale prima di fare il resize
  //
  // Click sui bottoni della toolbar della form deve andare prima al server
  // Ad esempio, l'evento di chiusura deve essere confermato dal server prima che il client
  // effettivamente possa chiudere la form. NOTA: non e' ammesso per la chiusura la
  // gestione locale  
  this.ClickEventDef = RD3_Glb.EVENT_ACTIVE;
  //
  // Click sulla form list per attivare la form
  this.ClickFLEventDef = RD3_Glb.EVENT_ACTIVE;
  //
  // Evento di resize/move
  this.ResizeEventDef = RD3_Glb.EVENT_ACTIVE;
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;        // Se vero, gli oggetti del DOM sono gia' stati creati
  this.RecalcLayout = false;    // Se vero, al termine della richiesta verra' adattato il layout
  this.AdaptToolbar = false;    // Se vero, al termine della richiesta verra' riadattata la toolbar
  this.NoOpacity = true;        // Le finestre di form modali non vogliono la trasparenza durante il D&D
  this.RecalcCommands = false;  // Se vero alla fine della richiesta verra' riverificata la visibilita' dei comandi
  this.AfterPopupResizeHide = false;  // Se vero alla fine di una animazione di resize popup viene nascosta la form
  //
  // Oggetti visuali riguardanti la form
  this.FormBox = null;           // Div globale della form: contiene tutta la form ed i suoi figli
  this.CaptionBox = null;        // Div che contiene la caption
  //
  this.ImgIcon = null;           // img che contiene l'icona da mostrare vicino alla caption
  this.CloseBtn = null;          // img che contiene l'immagine di chiusura della form
  this.ConfirmBtn = null;        // img che contiene l'immagine di conferma della form (per modali)
  this.MinBtn = null;            // Bottone di minizzazione
  this.MaxBtn = null;            // Bottone di massimizzazione
  this.HelpBtn = null;           // Bottone di help
  this.DebugBtn = null;          // Bottone di debug
  //
  this.CaptionTxt = null;        // span che contiene la caption della form (puo' contenere altro html..)
  this.FramesBox = null;         // Div che contiene i frames
  this.MessagesBox = null;       // Div che contiene tutti i messaggi
  //
  this.PopupFrame = null;        // PopupFrame in cui la form viene visualizzata se modale
  //
  // Oggetti visuali per gestire il titolo della form nella lista delle form attive
  this.FLBox = null;             // Contenitore della entry della form nella lista delle form aperte
  this.FLImg = null;             // Immagine nella form list
  this.FLCaption = null;         // Span che contiene la caption nella form list
  //this.SubFormObj = null;      // Puntatore al SubForm object se sono una sub-form
}



// *******************************************************************
// Inizializza questo WebForm leggendo i dati da un nodo <frm> XML
// *******************************************************************
WebForm.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
  //
  var objlist = node.childNodes;
  var n = objlist.length;
  //
  // Ciclo su tutti i nodi che rappresentano oggetti figli
  for (var i=0; i<n; i++) 
  {
    var objnode = objlist.item(i);
    var nome = objnode.nodeName;
    //
    // In base al tipo di oggetto, invio il messaggio di caricamento
    switch (nome)
    {
      case "msg":
      {
        var msg = new Message(this);
        msg.LoadFromXml(objnode);
        //
        // Verifchiamo se e' gia' presente
        var f = false;
        var nm = this.Messages.length;
        for (var im=0; im<nm; im++)
        {
          if (this.Messages[im].EqualsTo(msg))
          {
            f=true;
            this.Messages[im].Request = RD3_DesktopManager.CurrentRequest;
          }
        }
        if (!f)
          this.Messages.push(msg);
      }
      break;

      case "wfr":
      {
        var frame = new WebFrame(this);
        this.Frames.push(frame);
        frame.LoadFromXml(objnode);
      }
      break;

      case "bbr":
      {
        var frame = new ButtonBar(this);
        frame.LoadFromXml(objnode);
        this.Frames.push(frame);
      }
      break;

      case "tre":
      {
        var frame = new Tree(this);
        frame.LoadFromXml(objnode);
        this.Frames.push(frame);
      }
      break;

      case "book":
      {
        var frame = new Book(this);
        frame.LoadFromXml(objnode);
        this.Frames.push(frame);
      }
      break;

      case "pan":
      {
        var frame = new IDPanel(this);
        this.Frames.push(frame);
        frame.LoadFromXml(objnode);
      }
      break;
      
      case "suf":
      {
        var frame = new SubForm(this);
        this.Frames.push(frame);
        frame.LoadFromXml(objnode);
      }
      break;
      
      case "gra":
      {
        var frame = new Graph(this);
        frame.LoadFromXml(objnode);
        this.Frames.push(frame);
      }
      break;
      
      case "tbv":
      {
        var frame = new TabbedView(this);
        frame.LoadFromXml(objnode);
        this.Frames.push(frame);
      }
      break;
      
      case "tmh": // Timer di form multipla
      {
        RD3_DesktopManager.WebEntryPoint.TimerObj.LoadFromXml(objnode, true);
      }
      break;
      
      case "cmh": // Command set di form multipla
      {
        RD3_DesktopManager.WebEntryPoint.CmdObj.LoadFromXml(objnode, true);
      }
      break;

    }
  }    
  //
  // Riconnetto i figli di tutti i frames
  if (!this.Realized)
  {
    var n = this.Frames.length;
    for (var i=0; i<n; i++) 
    {
      var fr = this.Frames[i];
      if (fr.ChildFrame1 && (typeof fr.ChildFrame1 == "string"))
      {
        fr.ChildFrame1 = RD3_DesktopManager.ObjectMap[fr.ChildFrame1];
      }
      if (fr.ChildFrame2 && (typeof fr.ChildFrame2 == "string"))
      {
        fr.ChildFrame2 = RD3_DesktopManager.ObjectMap[fr.ChildFrame2];
      }
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
WebForm.prototype.ChangeProperties = function(node)
{
  // Semplicemente setto le proprieta' a partire dal nodo + verifico oggetti figli, come i messaggi
  this.LoadFromXml(node);
  //
  // Ci sono messaggi da realizzare?
  this.RealizeMessages();
  //
  // Verifica preview frame
   this.PopupPreview();
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
WebForm.prototype.LoadProperties = function(node)
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
      case "idx": this.SetFormIndex(parseInt(valore)); break;
      case "cap": this.SetCaption(valore); break;
      case "wcp": this.SetWebCaption(valore); break;
      case "img": this.SetImage(valore); break;
      case "mod": this.SetModal(parseInt(valore)); break;
      case "doc": this.SetDocked(valore=="1"); break;
      case "dot": this.SetDockType(parseInt(valore)); break;
      case "vis": this.SetVisible(valore=="1", true); break;
      case "tbp": this.SetToolbarPosition(parseInt(valore)); break;
      case "bdt": this.SetBorderType(parseInt(valore)); break;
      case "vfl": this.SetVisualFlags(parseInt(valore)); break;
      case "wst": this.SetWindowState(parseInt(valore)); break;
      case "lef": this.SetFormLeft(parseInt(valore)); break;
      case "top": this.SetFormTop(parseInt(valore)); break;
      case "wid": this.SetFormWidth(parseInt(valore)); break;
      case "hei": this.SetFormHeight(parseInt(valore)); break;
      case "rew": this.SetResModeW(parseInt(valore)); break;
      case "reh": this.SetResModeH(parseInt(valore)); break;
      case "pre": this.SetPreview(valore); break;
      case "hks": this.SetHandledKeys(parseInt(valore)); break;
      case "bbt": this.SetBackButtonText(valore); break;
      case "cln": this.SetClassName(valore); break;
      case "rlt": this.SetRelatedTo(valore); break;
      case "rlp": this.SetRelatedPosition(parseInt(valore)); break;

      case "clk": this.ClickEventDef = parseInt(valore); break;
      case "flc": this.ClickFLEventDef = parseInt(valore); break;
      case "res": this.ResizeEventDef = parseInt(valore); break;
      case "cls": this.CloseOnSelection = (valore=="1"); break;
      
      case "sha": this.ShowAnimDef = valore; break;
      case "mda": this.ModalAnimDef = valore; break;
      case "mga": this.MessageAnimDef = valore; break;
      case "lma": this.LastMessageAnimDef = valore; break;
      case "pra": this.PreviewAnimDef = valore; break;
      case "dka": this.DockedAnimDef = valore; break;
      case "ppr": this.PopResAnimDef = valore; break;
      case "own": this.Owner = valore; break;

      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
      break;
    }
  }
}


// *******************************************************************
// Setter delle proprieta'
// *******************************************************************
WebForm.prototype.SetFormIndex= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.IdxForm = value;
}

WebForm.prototype.SetModal= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.Modal = value;
}

WebForm.prototype.SetDocked= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.Docked = value;
}

WebForm.prototype.SetDockType= function(value) 
{
  var old = this.DockType;
  //
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.DockType = value;
  //
  // Se usa le zone invece puo' cambiare.. se era docked devo cambiare zona..
  if (this.DockType != old && this.Realized && RD3_DesktopManager.WebEntryPoint.UseZones())
  {
    var wep = RD3_DesktopManager.WebEntryPoint;
    //
    // Se old e' 0 era una form non docked che ora e' diventata docked.. devo solo toglierla dalla lista delle videate aperte
    if (old != 0)
    {
      // La tolgo dalla vecchia zona
      var oldZone = wep.GetScreenZone(old);
      oldZone.RemoveForm(this);
    }
    else
    {
      // Elimino la entry dalla lista delle Form aperte
      if (this.FLBox && this.FLBox.parentNode)
        this.FLBox.parentNode.removeChild(this.FLBox);
    }
    //
    // La aggiungo alla nuova zona
    var newZone = wep.GetScreenZone(this.DockType);
    var parentBox = newZone.AddForm(this);
    parentBox.appendChild(this.FormBox);
    //
    if (this.ParentTab)
      this.ParentTab.SetHeader(RD3_Glb.RemoveTags(this.Caption));
  }
}

WebForm.prototype.SetToolbarPosition= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.ToolbarPosition = value;
}

WebForm.prototype.SetBorderType= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.BorderType = value;
}

WebForm.prototype.SetVisualFlags= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.VisualFlags = value;
}

WebForm.prototype.SetResModeW= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.ResModeW = value;
}

WebForm.prototype.SetResModeH= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.ResModeH = value;
}

WebForm.prototype.SetCaption= function(value) 
{
  if (value!=undefined)
    this.Caption = value;
  //
  if (this.Realized)
  {
    if (this.Caption != "" && (this.HasCaption() || this.ShowFormList()))
    {
      if (this.FLCaption)
      {
        this.FLCaption.innerHTML = RD3_Glb.RemoveTags(this.Caption);
        //
        // Se e' gia' visibile, aggiorno direttamente il layout
        if (this.FLCaption.clientWidth>0)
          this.AdaptFormListLayout();
      }
      //
      // Devo mostrare la caption
      if (this.FLBox)
        this.FLBox.style.display = "";
    }
    else
    {
      // Devo nascondere la caption
      if (this.FLBox)
        this.FLBox.style.display = "none";
    }
    //
    if (this.ParentTab)
      this.ParentTab.SetHeader(RD3_Glb.RemoveTags(this.Caption));
  }
}


WebForm.prototype.SetWebCaption= function(value) 
{
  if (value!=undefined)
    this.WebCaption = value;
  //
  if (this.Realized)
  {
    if (this.WebCaption != "" && this.HasCaption())
    {
      this.CaptionTxt.innerHTML = this.WebCaption;
      //
      // Se l'innerhtml crea dei figli, allora gli do lo stesso mio ID
      // in modo che il D&D non si confonde e riesco a tirare la caption
      var objlist = this.CaptionTxt.childNodes;
      var n = objlist.length;
      for (var i=0; i<n; i++) 
      {
        try
        {
          objlist.item(i).id = this.CaptionTxt.id;
        }
        catch(ex)
        {
        }
      }
      //
      // Devo mostrare la caption
      this.CaptionBox.style.display = "" ;
      this.FramesBox.style.paddingTop = "";
    }
    else
    {
      // Devo nascondere la caption
      this.CaptionBox.style.display = "none" ;
      this.FramesBox.style.paddingTop = "0px";
    }
    //
    // Ho cambiato la caption... devo riadattare la toolbar
    this.AdaptToolbar = true;
  }
}

WebForm.prototype.SetImage= function(value) 
{
  if (value!=undefined)
    this.Image = value;
  //
  if (this.Realized && this.ImgIcon)
  {
    if (this.Image == "")
    {
      // Nascondo l'icona
      this.ImgIcon.style.display = "none";
      if (this.FLImg && this.FLImg.tagName=="IMG")
        this.FLImg.style.display = "none";
    }
    else
    {
      this.ImgIcon.src = RD3_Glb.GetImgSrc("images/" + this.Image);
      this.ImgIcon.style.display = "";
      if (this.FLImg && this.FLImg.tagName=="IMG")
      {
        this.FLImg.style.display = "";
        this.FLImg.src = this.ImgIcon.src;
      }
      //
      // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
      if (RD3_Glb.Adapt4Retina(this.Identifier, this.Image, 43))
      {
        if (this.ImgIcon)
          this.ImgIcon.style.display = "none";
        if (this.FLImg && this.FLImg.tagName=="IMG")
          this.FLImg.style.display = "none";
      }
    }
    //
    // Ho cambiato l'immagine... devo riadattare la toolbar
    this.AdaptToolbar = true;
    //
    if (this.ParentTab)
      this.ParentTab.SetImage(this.Image);
  }
}

WebForm.prototype.SetWindowState= function(value) 
{
  var old = this.WindowState;
  if (value!=undefined)
    this.WindowState = value;
  //
  // Aggiorno solo se e' cambiato il valore
  if (this.Realized && (old!=this.WindowState || value==undefined))
  {
    if (this.Modal)
    {
      switch (this.WindowState)
      {
        case RD3_Glb.WS_NORMAL:
          this.PopupFrame.SetVisible(true);          
          if (this.NormalLeft!=null)
          {
            // Assegno le dimensioni e non faccio AdaptLayout perche' lo fa l'animazione
            this.SetFormLeft(this.NormalLeft, false);
            this.SetFormTop(this.NormalTop, false);
            this.SetFormWidth(this.NormalWidth, false);
            this.SetFormHeight(this.NormalHeight, false);
          }
          else
          {
            // In questo caso devo fare io l'adaptlayout perche' non lo fa l'animazione, ma solo se e' stato cambiato o forzato
            // il Window State
            if (value!=undefined)
              this.AdaptLayout();
          }
          if (this.MaxBtn)
            this.MaxBtn.src = RD3_Glb.GetImgSrc("images/fmax.gif");
          //
          if (value!=undefined)
          {
            var ev = new IDEvent("repos", this.Identifier, null, this.ResizeEventDef, null, this.FormLeft, this.FormTop);
          }
        break;
        
        case RD3_Glb.WS_MAXIMIZE:
          this.PopupFrame.ShowThickBorders(false);
          this.PopupFrame.SetVisible(true);
          //
          if (old==RD3_Glb.WS_NORMAL)
          {
            this.NormalLeft = this.FormLeft;
            this.NormalTop = this.FormTop;
            this.NormalWidth = this.FormWidth;
            this.NormalHeight = this.FormHeight;
          }
          //
          if (this.MaxBtn)
            this.MaxBtn.src = RD3_Glb.GetImgSrc("images/fnor.gif");
          //
          var r = RD3_DesktopManager.WebEntryPoint.GetMaximizeArea();
          var or = new Rect(this.FormLeft, this.FormTop, this.FormWidth, this.FormHeight);
          this.SetFormLeft(r.x, false);
          this.SetFormTop(r.y, false);
          this.SetFormWidth(r.w, false);
          this.SetFormHeight(r.h, false);
          //
          if (r.x!=this.FormLeft || r.y!=this.FormTop || r.w!=this.FormWidth || r.h!=this.FormHeight)
          {
            var ev = new IDEvent("repos", this.Identifier, null, this.ResizeEventDef, null, this.FormLeft, this.FormTop);
          }
        break;
        
        case RD3_Glb.WS_MINIMIZE:
          this.NormalWindowState = old;
          //
          if (old==RD3_Glb.WS_NORMAL)
          {
            this.NormalLeft = this.FormLeft;
            this.NormalTop = this.FormTop;
            this.NormalWidth = this.FormWidth;
            this.NormalHeight = this.FormHeight;
          }
          //
          // Faccio mininizzare verso la FL se presente, altrimenti verso il centro del menu..
          var l = 0;
          var t = 0;
          if (this.Modal == 2 && this.FLBox)
          {
            l = RD3_Glb.GetScreenLeft(this.FLBox) + Math.floor(this.FLBox.offsetWidth/2);
            t = RD3_Glb.GetScreenTop(this.FLBox) + Math.floor(this.FLBox.offsetHeight/2);
            //
            // Se il menu e' troppo lungo la form list e' fuori dal video: se faccio minimizzare verso quella posizione quando
            // riapro la form il browser fa scrollare l'area lasciando uno spazio grigio: per correggere il problema faccio
            // minimizzare verso il fondo del browser se la FL non e' visibile..
            if (t>document.body.offsetHeight)
              t = document.body.offsetHeight - 10;
            if (l>document.body.offsetWidth)
              l = document.body.offsetWidth - 10;
          }
           else
          {
            // Facciamo la minimizzazione verso il centro del menu..
            switch (RD3_DesktopManager.WebEntryPoint.MenuType)
            {
              case RD3_Glb.MENUTYPE_LEFTSB:
              //
              l = 0;
              t = Math.floor(document.body.offsetHeight/2);
              //
              break;
              
              case RD3_Glb.MENUTYPE_RIGHTSB:
              //
              l = document.body.offsetWidth;
              t = Math.floor(document.body.offsetHeight/2);
              //
              break;
              
              case RD3_Glb.MENUTYPE_MENUBAR:
              //
              l = Math.floor(document.body.offsetWidth/2);
              t = 0;
              //
              break;
              
              case RD3_Glb.MENUTYPE_TASKBAR:
              //
              l = Math.floor(document.body.offsetWidth/2);
              t = document.body.offsetHeight;
              //
              break;
            }
          }
           //
           // Nel caso di dispositivi touch, la minimizzazione avvien in alto
           // altrimenti quando la form riappare, il browser scrolla sotto in modo
           // irrevocabile
          if (RD3_Glb.IsTouch())
          {
            t=-20; l=0;
          }
          //
          this.SetFormLeft(l, false);
          this.SetFormTop(t, false);
          this.SetFormWidth(1, false);
          this.SetFormHeight(1, false);
          //
          this.AfterPopupResizeHide = true;
        break;
      }
    }
    else
    {
      this.WindowState = RD3_Glb.WS_NORMAL;
    }
  }
}

// ******************************************************************
// Chiamata alla fine dell'animazione di resize modale, fa i tocchi 
// finali e decide se far fare o meno l'adaptlayout a GFX
// ******************************************************************
WebForm.prototype.AfterPopupResizeFinish = function() 
{
  if (this.AfterPopupResizeHide)
  {
    // Nascondiamo la Form
    this.AfterPopupResizeHide = false;
    this.PopupFrame.SetVisible(false);
    //
    // In questo caso blocchiamo l'adapt..
    return false;
  }
  //
  return true;
}


WebForm.prototype.SetVisible= function(value, doanim) 
{
  var old = this.Visible;
  if (value!=undefined)
    this.Visible = value;
  //
  if (this.Realized && (old!=this.Visible || value==undefined))
  {
    if (doanim)
    {
      if (this.Docked)    // DOCKED
      {
        var fx = new GFX("docked", this.Visible, this, false);
        //
        // In caso di chiusura devo solo nascondere..
        fx.CloseFormAnimation = false;
        RD3_GFXManager.AddEffect(fx);
        //
        return;
      }
      //
      if (this.Modal==0)    // MDI
      {
        // Non devo fare niente, ci pensa il server a mandare la nuova active form..
        // Devo solo Gestire la Form List
        if (this.FLBox)
        {
          this.FLBox.style.display = this.Visible? "" : "none";        
          //
          if (this.Visible)
            this.AdaptFormListLayout();
        }
        //
        return;
      }
      if (this.Modal!=0)    // MODAL O POPUP
      {
        var fx = new GFX("modal", this.Visible, this, false);
        fx.CloseFormAnimation = false;
        RD3_GFXManager.AddEffect(fx);
        //
        if (this.FLBox)
        {
          this.FLBox.style.display = this.Visible? "" : "none";
          //
          if (this.Visible)
            this.AdaptFormListLayout();
        }
      }
    }
    else
    {
      this.FormBox.style.display = this.Visible? "" : "none";
      // 
      // Gestiamo la Form List
      if (this.FLBox)
      {
        this.FLBox.style.display = this.Visible? "" : "none";
        //
        if (this.Visible)
          this.AdaptFormListLayout();
      }
    }
  }
}


WebForm.prototype.SetFormLeft= function(value, skipanim) 
{
  if (value!=undefined)
  {
    var old = this.FormLeft;
    this.FormLeft = value;
    this.PopupRect.x = (skipanim)? this.FormLeft : old;
  }
  //
  if (this.Realized && this.Modal)
  {
    if (skipanim)
    {
      // In caso mobile, non riposiziono form popover agganciate
      var ok = true;
      if (RD3_Glb.IsMobile() && this.PopupFrame.ObjToAttach && this.FormLeft==-1)
        ok = false;
      //
      if (ok)
        this.PopupFrame.SetLeft(this.FormLeft);
    }
    else
      this.PopupResAnim = true;
  }
}

WebForm.prototype.SetFormTop= function(value, skipanim) 
{
  if (value!=undefined)
  {
    var old = this.FormTop;
    this.FormTop = value;
    this.PopupRect.y = (skipanim) ? this.FormTop : old;
  }
  //
  if (this.Realized && this.Modal)
  {
    if (skipanim) 
    {
      // In caso mobile, non riposiziono form popover agganciate
      var ok = true;
      if (RD3_Glb.IsMobile() && this.PopupFrame.ObjToAttach && this.FormLeft==-1)
        ok = false;
      //
      if (ok)
        this.PopupFrame.SetTop(this.FormTop);
    }
    else
      this.PopupResAnim = true;
  }
}

WebForm.prototype.SetFormWidth= function(value, skipanim) 
{
  if (value!=undefined)
  {
    var old = this.FormWidth;
    this.FormWidth = value;
    this.PopupRect.w = (skipanim)? this.FormWidth : old;
  }
  //
  if (this.Realized && this.FormWidth>0)
  {
    if (this.Modal)
    {
      if (skipanim) 
      {
        this.PopupFrame.SetWidth(this.FormWidth);
        this.RecalcLayout = true;
      }
      else
      {
        this.PopupResAnim = true;
      }
    }
    else if (this.Docked && value!=undefined)
    {
      this.OnTransform(0, 0, this.FormWidth, this.FormHeight);
    }
  }
}

WebForm.prototype.SetFormHeight= function(value, skipanim) 
{
  if (value!=undefined)
  {
    var old = this.FormHeight;
    this.FormHeight = value;
    this.PopupRect.h = (skipanim) ? this.FormHeight : old;
  }
  //
  if (this.Realized && this.FormHeight>0)
  {
    if (this.Modal)
    {
      if (skipanim)
      {
        this.PopupFrame.SetHeight(this.FormHeight);
        this.RecalcLayout = true;
      }
      else
      {
        this.PopupResAnim = true;
      }
    }
    else if (this.Docked && value!=undefined)
    {
      this.OnTransform(0, 0, this.FormWidth, this.FormHeight);
    }
  }
}


// ******************************************************
// Setter dei tasti intercettati dalla form
// ******************************************************
WebForm.prototype.SetHandledKeys = function(value)
{
  if (value!=undefined)
    this.HandledKeys = value;
  //
  // Questa proprieta' non puo' variare dopo essere stata inviata, e viene gestita
  // nel KBManager
}


// ******************************************************
// Setter del testo del BackButton
// ******************************************************
WebForm.prototype.SetBackButtonText = function(value)
{
  if (value!=undefined)
    this.BackButtonTxt = value;
  //
  if (this.Realized && this.BackButtonCnt)
  {
    // Se deve esserci, lo mostro
    var doUpdateToolbar = false;
    if (this.HasBackButton() && this.BackButtonTxt && this.BackButtonTxt.length > 0)
    {
      // Mostro il bottone
      this.CaptureToolbarButton(this.BackButtonCnt);
      //
      // Ne aggiorno il testo
      this.BackButton.textContent = this.BackButtonTxt;
      //
      // Spingo un aggiornamento della toolbar. E' comparso il bottone BACK
      doUpdateToolbar = true;
    }
    else // Non ci deve essere BackButton
    {
      // Lo rimuovo dal DOM
      if (this.BackButtonCnt.parentNode)
      {
        this.BackButtonCnt.parentNode.removeChild(this.BackButtonCnt);
        //
        // Spingo un aggiornamento della toolbar. E' sparito il bottone BACK
        doUpdateToolbar = true;
      }
    }
    //
    if (doUpdateToolbar) 
    {
      if (this.HasCaption())
        this.AdaptToolbar = true;
      else
        this.GetFirstToolbar(true);
    }
  }
}


WebForm.prototype.SetClassName = function(value) 
{
  var old = this.ClassName;
  if (value!=undefined)
    this.ClassName = value;
  //
  if (this.Realized)
  {
    // Se c'e' un vecchio valore lo rimuovo, poi se ce n'e' uno nuovo lo aggiungo.
    // in questo modo posso gestire correttamente il cambio da classe "a" -> ""
    if (old)
      RD3_Glb.RemoveClass(this.FormBox, old);
    if (this.ClassName)
      RD3_Glb.AddClass(this.FormBox, this.ClassName);
  }
}


WebForm.prototype.SetRelatedTo = function (value) 
{
  // Vedi realize
  this.RelatedTo = value;
}


WebForm.prototype.SetRelatedPosition = function (value) 
{
  // Vedi realize
  this.RelatedPlacement = value;
}


WebForm.prototype.SetPreview= function(value) 
{
  // Vedi anche funzione successiva
  this.PreviewFrame = value;
}


// ***************************************************************
// Mostra il preview impostato precedentemene
// ***************************************************************
WebForm.prototype.PopupPreview= function() 
{
  if (this.PreviewFrame && !this.PreviewFrame.Identifier)
  {
    // Se il WEP non e' ancora realizzato, aspetto un po'
    if (!RD3_DesktopManager.WebEntryPoint.Realized)
      return;
    //
    // Ho appena aperto un preview frame (e' infatti ancora una stringa)
    // Vediamo se lo trovo...
    this.PreviewFrame = RD3_DesktopManager.ObjectMap[this.PreviewFrame];
    //
    if (this.PreviewFrame)
    {
      // Dico al frame che e' una preview
      this.PreviewFrame.IsPreview = true;
      //
      // Lo faccio apparire al posto del frame 0! (o dei suoi figli se e' una videata complessa)
      if (this.Frames[0].FrameBox)
      {
        this.Frames[0].FrameBox.style.display = "none";
      }
      else
      {
        this.Frames[0].ChildBox1.style.display = "none";
        this.Frames[0].ChildBox2.style.display = "none";
      }
      //
      this.PreviewFrame.Realize(this.FramesBox);
      RD3_Glb.AdaptToParent(this.PreviewFrame.FrameBox, 0, 2);
      //
      // Leggo eventuali dimensioni della pagina se sono un book
      if (this.PreviewFrame instanceof Book && this.PreviewFrame.Pages.length >0)
      {
        var pagbox = this.PreviewFrame.Pages[this.PreviewFrame.ActivePage].PageBox;
        //
        var h = pagbox.offsetHeight+1;
        var w = pagbox.offsetWidth+6;
        //
        // Se il book mostra i bordi della pagina, devo tenere conto del padding
        if (!this.PreviewFrame.HideBorder)
        {
          h += 4; // 2px
          w += 4;
        }
        //
        // Il frame e' piu' grande della pagina? se si lo dimensiono come la pagina
        var frh = this.PreviewFrame.FrameBox.offsetHeight;
        var frw = this.PreviewFrame.FrameBox.offsetWidth;
        //
        if (frh > (h + 32)) // Toolbar (28px+4px)
          this.PreviewFrame.FrameBox.style.height = (h + 32) + "px";
        else
          w += 18;      // La pagina e' piu' alta del frame -> ci sono le scrollbar verticali (caso normale). Provo a tenerne conto
        //
        if (frw > w)
          this.PreviewFrame.FrameBox.style.width = w + "px";
      }
      //
      // Devo dare uno zindex qui altrimenti il pannello sotto si sovrappone in modo strano
      this.PreviewFrame.FrameBox.style.zIndex = 100;
      //
      this.PreviewFrame.AdaptLayout();
      //
      // Ora eseguo l'animazione
      var fx = new GFX("preview", true, this, false, null, this.PreviewAnimDef);
      RD3_GFXManager.AddEffect(fx);
    }
  }
}


// ***************************************************************
// Chiude il preview impostato precedentemene
// ***************************************************************
WebForm.prototype.ClosePreview= function() 
{
  if (this.PreviewFrame)
  {
    // Eseguo l'animazione
    var fx = new GFX("preview", false, this, false, null, this.PreviewAnimDef);
    RD3_GFXManager.AddEffect(fx);
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
WebForm.prototype.Realize = function()
{
  // Calcolo dove dovro' inserire questa form
  var parent;
  var mob = RD3_Glb.IsMobile();
  var mob7 = RD3_Glb.IsMobile7();
  //
  if (this.SubFormObj)
  {
    if (this.SubFormObj instanceof SubForm)
      parent = this.SubFormObj.ContentBox;
    else if (this.SubFormObj instanceof BookBox)
      parent = this.SubFormObj.BoxBox;
  }
  else
    parent = RD3_DesktopManager.WebEntryPoint.FormsBox;
  //
  // Gestione apertura finestra modale
  if (this.Modal)
  {
    this.PopupFrame = new PopupFrame(this);
    if (this.Modal == 2)
    {
      if (mob)
        this.PopupFrame.AutoClose = true;
      else
        this.PopupFrame.Modal = false;
    }
    //
    // modale mobile con close on selection... posso cliccare fuori per chiuderla
    if (this.Modal == 1 && mob && this.CloseOnSelection)
      this.PopupFrame.AutoClose = true;
    //
    // Memorizzo l'oggetto che aveva il fuoco
    this.LastActiveObject = RD3_KBManager.ActiveObject;
    this.LastActiveElement = RD3_KBManager.ActiveElement;
    //
    if (this.FormLeft!=-1) this.PopupFrame.SetLeft(this.FormLeft);
    if (this.FormTop!=-1) this.PopupFrame.SetTop(this.FormTop);
    if (this.FormWidth!=-1) this.PopupFrame.SetWidth(this.FormWidth);
    if (this.FormHeight!=-1) this.PopupFrame.SetHeight(this.FormHeight);
    //
    this.PopupFrame.HasCaption = false;
    this.PopupFrame.Borders = this.BorderType;
    //
    if (this.RelatedTo && (this.Modal == 1 || this.Modal == -1))
      this.PopupFrame.AutoClose = true;
    //
    this.PopupFrame.Realize(this.Modal==2?"-popover":"-modal");
    //
    parent = this.PopupFrame.ContentBox;
    //
    // Mi memorizzo la mia posizione di partenza (per GFX zoom)
    this.OpenX = RD3_DesktopManager.MessagePump.XPos;
    this.OpenY = RD3_DesktopManager.MessagePump.YPos;
  }
  //
  if (this.Docked)
  {
    if (!RD3_DesktopManager.WebEntryPoint.UseZones())
    {
      if (this.DockType==RD3_Glb.FORMDOCK_LEFT)
      {
        parent = RD3_DesktopManager.WebEntryPoint.LeftDockedBox;
        parent.className = "left-dock-container-visible";
      }
      if (this.DockType==RD3_Glb.FORMDOCK_TOP)
      {
        parent = RD3_DesktopManager.WebEntryPoint.TopDockedBox;
        parent.className = "top-dock-container-visible";
      }
      if (this.DockType==RD3_Glb.FORMDOCK_RIGHT)
      {
        parent = RD3_DesktopManager.WebEntryPoint.RightDockedBox;
        parent.className = "right-dock-container-visible";
      }
      if (this.DockType==RD3_Glb.FORMDOCK_BOTTOM)
      {
        parent = RD3_DesktopManager.WebEntryPoint.BottomDockedBox;
        parent.className = "bottom-dock-container-visible";
      }
    }
    else
    {
      var scz = RD3_DesktopManager.WebEntryPoint.GetScreenZone(this.DockType);
      parent = scz.AddForm(this);
    }
    //
    // Devo far scattare l'aggiornamento dei comandi (per mostrare le mie toolbar) solo
    // se io non sono la form attiva, dato che in quel caso scatterebbe automaticamente
    var actf = RD3_DesktopManager.WebEntryPoint.ActiveForm;
    if (!actf || (actf && actf.IdxForm != this.IdxForm))
      RD3_DesktopManager.WebEntryPoint.RefreshCommands = true;
  }
  //
  // Realizzo i miei oggetti visuali
  // Creo il mio contenitore globale
  this.FormBox = document.createElement("div");
  this.FormBox.setAttribute("id", this.Identifier);
  this.FormBox.className = "form-container";
  this.FormBox.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseDownForm', ev)");
  //
  // Nelle finestra modali non voglio bordo, in questo modo
  // Evito il problema della differenza fra i vari temi a questo proposito
  if (this.PopupFrame || this.SubFormObj)
    this.FormBox.style.border = "none";
  //
  if (!mob && this.Docked && RD3_DesktopManager.WebEntryPoint.UseZones())
  {
    var scz = RD3_DesktopManager.WebEntryPoint.GetScreenZone(this.DockType);
    scz.RemoveFormBorder(this.FormBox);
  }
  //
  // Creo la box per i frames
  this.FramesBox = document.createElement("div");
  this.FramesBox.setAttribute("id", this.Identifier+":frs");
  this.FramesBox.className = "form-frames-container";
  //
  // Creo la lista dei messaggi
  this.MessagesBox = document.createElement("div");
  this.MessagesBox.setAttribute("id", this.Identifier+":msg");
  this.MessagesBox.className = "form-message-container";
  if (mob)
  {
    var mm = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMessageBarMouseMove', ev)");
    var md = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMessageBarMouseDown', ev)");
    var mu = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMessageBarMouseUp', ev)");
    this.MessagesBox.addEventListener(RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true) ? "touchmove" : "mousemove", mm, true); 
    this.MessagesBox.addEventListener(RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true) ?"touchstart" : "mousedown", md, true); 
    this.MessagesBox.addEventListener(RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true) ?"touchend" : "mouseup", mu, true); 
    this.MessagesBox.addEventListener(RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true) ?"touchcancel" : "mouseout", mu, true); 
  }
  //
  // Creo la box della caption
  this.CaptionBox = document.createElement("div");
  this.CaptionBox.setAttribute("id", this.Identifier+":cap");
  this.CaptionBox.className = "form-caption-container";
  this.CaptionBox.ondblclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMaximize', ev)");
  //
  // INIZIO GESTIONE TOOLBAR
  // Creo le immaginette
  var ext = (mob?".png":".gif");
  //
  var usemask = !(RD3_Glb.IsAndroid() || RD3_Glb.IsIE() || RD3_Glb.IsEdge()) || RD3_Glb.IsAndroid(4,4,0);
  if (!usemask && mob7)
    ext = "-i" + ext;
  //
  if (this.HasCloseButton())
  {
    this.CloseBtn = document.createElement("img");
    this.CloseBtn.setAttribute("id", this.Identifier+":clo");
    if (mob)
    { 
      if (mob7 && usemask)
      {
        this.CloseBtn.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/mno" + ext)+"')";
        this.CloseBtn.style.webkitMaskRepeat = "no-repeat";
        this.CloseBtn.style.webkitMaskSize = "25px 25px";
      }
      else
        this.CloseBtn.src = RD3_Glb.GetImgSrc("images/mno"+ext);
    }
    else
      this.CloseBtn.src = RD3_Glb.GetImgSrc("images/closef"+ext);
    this.CloseBtn.className = "form-caption-image close-button";
    this.CloseBtn.removeAttribute("width");
    this.CloseBtn.removeAttribute("height");
    RD3_TooltipManager.SetObjTitle(this.CloseBtn, RD3_ServerParams.ChiudiForm + RD3_KBManager.GetFKTip(RD3_ClientParams.FKCloseForm));
    this.CloseBtn.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClose', ev)");
    //
    // Per allineare bene, devo ricalcolare tutto quando arriva l'immagine
    if (!RD3_Glb.IsIE(10, false))
      this.CloseBtn.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'AdaptToolbarLayout', ev)");
  }
  //
  if (this.HasIcon())
  {
    this.ImgIcon = document.createElement("img");
    this.ImgIcon.setAttribute("id", this.Identifier+":ico");
    this.ImgIcon.className = "form-caption-icon";
    this.ImgIcon.removeAttribute("width");
    this.ImgIcon.removeAttribute("height");
    this.ImgIcon.ondblclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClose', ev)");
    //
    // Per allineare bene, devo ricalcolare tutto quando arriva l'immagine
    if (!RD3_Glb.IsIE(10, false))
      this.ImgIcon.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'AdaptToolbarLayout', ev)");
  }  
  //
  if (this.Modal)
  {
    if (this.CloseBtn)
    {
      if (mob7 && usemask)
      { 
        this.CloseBtn.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/mno" + ext)+"')";
        this.CloseBtn.style.webkitMaskRepeat = "no-repeat";
        this.CloseBtn.style.webkitMaskSize = "25px 25px";
      }
      else
        this.CloseBtn.src = RD3_Glb.GetImgSrc("images/mno"+ext);
      RD3_TooltipManager.SetObjTitle(this.CloseBtn, RD3_ServerParams.ModalChiudiForm);
      this.CloseBtn.className = "form-caption-modal-image close-button";
      this.CloseBtn.removeAttribute("width");
      this.CloseBtn.removeAttribute("height");
    }
    //
    if (this.HasConfirmButton())
    {
      this.ConfirmBtn = document.createElement("img");
      this.ConfirmBtn.setAttribute("id", this.Identifier+":con");
      this.ConfirmBtn.className = "form-caption-modal-image accept-button";
      if (mob7 && usemask)
      {
        this.ConfirmBtn.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/myes" + ext)+"')";
        this.ConfirmBtn.style.webkitMaskRepeat = "no-repeat";
        this.ConfirmBtn.style.webkitMaskSize = "25px 25px";
      }
      else
        this.ConfirmBtn.src = RD3_Glb.GetImgSrc("images/myes"+ext);
      this.ConfirmBtn.removeAttribute("width");
      this.ConfirmBtn.removeAttribute("height");
      RD3_TooltipManager.SetObjTitle(this.ConfirmBtn, RD3_ServerParams.ModalConfirm);
      this.ConfirmBtn.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnConfirm', ev)");
    }
    //
    if (this.HasMinButton())
    {
      this.MinBtn = document.createElement("img");
      this.MinBtn.setAttribute("id", this.Identifier+":min");
      this.MinBtn.className = "form-caption-modal-image min-button";
      this.MinBtn.src = RD3_Glb.GetImgSrc("images/fmin"+ext);
      this.MinBtn.removeAttribute("width");
      this.MinBtn.removeAttribute("height");
      this.MinBtn.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMinimize', ev)");
    }
    //
    if (this.HasMaxButton())
    {
      this.MaxBtn = document.createElement("img");
      this.MaxBtn.setAttribute("id", this.Identifier+":max");
      this.MaxBtn.className = "form-caption-modal-image max-button";
      this.MaxBtn.src = RD3_Glb.GetImgSrc("images/fmax"+ext);
      this.MaxBtn.removeAttribute("width");
      this.MaxBtn.removeAttribute("height");
      this.MaxBtn.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMaximize', ev)");
    }
    //
    if (this.HasHelpButton())
    {
      this.HelpBtn = document.createElement("img");
      this.HelpBtn.setAttribute("id", this.Identifier+":hlp");
      this.HelpBtn.className = "form-caption-modal-image help-button";
      this.HelpBtn.src = RD3_Glb.GetImgSrc("images/help"+ext);
      this.HelpBtn.removeAttribute("width");
      this.HelpBtn.removeAttribute("height");
      this.HelpBtn.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('wep', 'OnHelpButton', ev)");
    }
    //
    if (this.HasDebugButton())
    {
      this.DebugBtn = document.createElement("img");
      this.DebugBtn.setAttribute("id", this.Identifier+":dbg");
      this.DebugBtn.className = "form-caption-modal-image debug-button";
      this.DebugBtn.src = RD3_DesktopManager.WebEntryPoint.DebugImageBox.src;
      this.DebugBtn.removeAttribute("width");
      this.DebugBtn.removeAttribute("height");
      this.DebugBtn.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('wep', 'OnDebug', ev)");
    }
  }
  //
  if (this.HasBackButton())
  {
    this.BackButtonCnt = document.createElement("div");
    this.BackButtonCnt.setAttribute("id", this.Identifier+":bcn");
    this.BackButtonCnt.className = "panel-formlist-container";
    //
    this.BackButton = document.createElement("div");
    this.BackButton.setAttribute("id", this.Identifier+":bb");
    this.BackButton.className = "panel-toolbar-button panel-formlist-button";
    //
    this.BackButtonImg = document.createElement("div");
    this.BackButtonImg.setAttribute("id", this.Identifier+":bba");
    this.BackButtonImg.className = "panel-formlist-arrow";
    this.BackButtonCnt.appendChild(this.BackButtonImg);
    this.BackButtonCnt.appendChild(this.BackButton);
    //
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
      this.BackButtonCnt.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClose', ev)");
    else
      this.BackButtonCnt.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClose', ev)");
  }
  //
  // Ecco il testo  
  this.CaptionTxt = document.createElement("span");
  this.CaptionTxt.setAttribute("id", this.Identifier+":txt");
  this.CaptionTxt.className = "form-caption-text";
  if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
    this.CaptionTxt.ontouchend = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCaptionClick', ev)");
  else
    this.CaptionTxt.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCaptionClick', ev)");
  //
  // Aggiungo gli oggetti al DOM
  this.RealizeToolbar();
  //
  this.FormBox.appendChild(this.CaptionBox);
  //
  if (!mob)
  {
    this.FormBox.appendChild(this.MessagesBox);
    this.FormBox.appendChild(this.FramesBox);
  }
  else
  {
    this.FormBox.appendChild(this.FramesBox);
    this.FormBox.appendChild(this.MessagesBox);
  }
  //
  // Realizzo la entry nella FormList
  this.RealizeFormList();
  //
  // Realizzo i frames... devo farlo seguendo la gerarchia.
  if (this.Frames[0])
    this.Frames[0].Realize(this.FramesBox);
  //
  // Caso popup non modale
  // Nel caso mobile, creo e posiziono il popover
  if (this.Modal==2 && (RD3_KBManager.ActiveElement || RD3_KBManager.ActiveButton) && mob)
  {
    var w = this.FormWidth>0 ? this.FormWidth : this.Frames[0].CalcWidth();
    var h = this.FormHeight>0 ? this.FormHeight : this.Frames[0].CalcHeight();
    var wb = RD3_DesktopManager.WebEntryPoint.WepBox;
    //
    if (RD3_Glb.IsSmartPhone())
    {
      w = wb.offsetWidth;
      if (h> wb.offsetHeight * 0.8)
        h = wb.offsetHeight * 0.8;
    }
    else
    {
      if (w>wb.offsetWidth/2)
        w = wb.offsetWidth/2;
      if (h>wb.offsetHeight/2)
        h = wb.offsetHeight/2;
    }
    if (h<88)
      h = 88;   
    //
    this.PopupFrame.SetWidth(w);
    this.PopupFrame.SetHeight(h);
    var ObjToAttach = RD3_KBManager.ActiveButton == null ? RD3_KBManager.ActiveElement : RD3_KBManager.ActiveButton;
    this.PopupFrame.AttachTo(ObjToAttach);
    this.PopupFrame.Centered = false;
    //
    RD3_DesktopManager.WebEntryPoint.CmdObj.ConvertFormPopover(true, this);
    //
    // Aggiusto qualche stile un po' storto
    this.PopupFrame.ContentBox.style.paddingTop = "0px";
    this.PopupFrame.ContentBox.style.marginBottom = "2px";
    var tb = this.GetFirstToolbar();
    if (tb)
      RD3_Glb.SetBorderRadius(tb, "4px 4px 0px 0px");
  }
  //
  // Realizzo i messaggi
  this.RealizeMessages();
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  this.SetImage();
  this.SetCaption();
  this.SetWebCaption();
  this.SetVisible();
  this.SetWindowState();
  this.SetFormLeft(null, true);   // In questo caso devo far saltarre l'animazione!
  this.SetFormTop(null, true);
  this.SetFormWidth(null, true);
  this.SetFormHeight(null, true);
  this.SetBackButtonText();
  this.SetClassName();
  //
  // SOLO alla fine attacco la form al DOM,
  // cosi' si fa prima
  parent.appendChild(this.FormBox);
  //
  // Devo aprire la preview che si e' aperta mentre stavo aprendo la form?
  this.PopupPreview();
}


// ********************************************************************************
//  Realizzo tutti i messaggi non ancora realizzati
// ********************************************************************************
WebForm.prototype.RealizeMessages = function()
{ 
  // Se non sono stata ancora realizzata, lascio perdere
  if (!this.Realized)
    return;
  //
  // Se non mostro messaggi, non realizzo niente!
  if (!this.ShowMessages())
    return;
  //
  var n = this.Messages.length;
  var newmsg = 0;
  for (var i=0; i<n; i++)
  {
    if (!this.Messages[i].Realized)
    {
      this.Messages[i].Realize(this.MessagesBox);
      newmsg++;
    }
  }
  //
  // Rimuovo i messaggi temporanei
  var mob = RD3_Glb.IsMobile();
  if (!mob || newmsg>0)
    this.RemoveTemporaryMessages();
  //
  // Regolo l'altezza della messagesbox
  // Calcolo la dimensione dei messaggi
  n = this.Messages.length;
  var newheight = 0;
  for (var i=0; i<n; i++)
  {
    newheight += this.Messages[i].MyBox.offsetHeight;
    //
    // Mostro al massimo 3 messaggi insieme, dopo devono apparire le scrollbar (i messaggi partono da 0)
    if (i >= 2 && !mob)
      break;
  }
  //
  if (mob)
  {
    // Gestione mobile: se non ci sono messaggi, la messagebar sparisce
    this.MessagesBox.style.visibility = (this.Messages.length==0)?"hidden":"";
    //
    // Gestisco massima altezza della message bar.
    var maxh = this.FormBox.offsetHeight*0.8;
    if (newheight>maxh)
      newheight = maxh;
    this.MessagesBox.style.height = newheight+"px";
    //
    // Se la messagebar non era aperta, la riposiziono al posto giusto
    if (!this.MessageBarOpen())
    {
      this.OpenMessageBar(newmsg);
      if (newmsg>0)
      {
        if (this.MessageBarTimerId!=0)
          window.clearTimeout(this.MessageBarTimerId);
        this.MessageBarTimerId = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OpenMessageBar', -1)",5000);
      }
    }
  }
  else
  {
    // Decido la direzione dell'animazione
    var dir = true;
    if (n==0 && this.HasInfoMessages())
    {
      newheight = RD3_ClientParams.MinMessagesBoxHeight;
    }
    //
    // Calcolo la vecchia altezza (togliendo il bordo inferiore)
    var oldh = this.MessagesBox.offsetHeight;
    oldh = oldh<=0 ? 0 : oldh - (RD3_ServerParams.Theme.startsWith("zen") ? 0 : 1);
    dir = oldh<=newheight;
    //
    if (newheight != oldh && !this.Animating)
    {
      // Se cambia la dimensione della barra avvio l'animazione relativa al fold dei messaggi
      var fx = new GFX("message", dir, this, this.Animating, null, this.MessageAnimDef);
      fx.NewHeight = newheight;
      fx.OldHeight = oldh;
      RD3_GFXManager.AddEffect(fx);
    }
    //
    // Se sto animando imposto direttamente la nuova dimensione..
    if (this.Animating)
    {
      this.MessagesBox.style.height = newheight + "px";
      //
      // Se e' alta 0 devo togliere anche il bordo, se non c'e' una riga di troppo..
      this.MessagesBox.style.borderBottomWidth = newheight==0 ? "0px" : "";
    }
  }
}


// ********************************************************************************
//  Torna true se la form e' veramente MODALE
// ********************************************************************************
WebForm.prototype.IsModalPopup = function()
{ 
  return (this.Modal==1 || this.Modal==-1);
}


// ********************************************************************************
//  Creo la entry della form nella lista delle form aperte 
// ********************************************************************************
WebForm.prototype.RealizeFormList = function()
{ 
  // Non creo la formlist se docked o modal, oppure se il menu' e' in alto o in basso
  if (!this.HasFormList() || RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_MENUBAR)
    return;
  //
  var flt = null;
  //
  if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
  {
    var flt = RD3_DesktopManager.WebEntryPoint.TaskbarFormListCell;
    //
    // Creo gli elementi del DOM
    this.FLBox = document.createElement("span");
    this.FLImg = document.createElement("img");
    this.FLCaption = document.createElement("span");
    //
    // Assegno le classi agli oggetti DOM
    this.FLBox.className = "taskbar-form-list-item";
    this.FLImg.className = "taskbar-form-list-img";
    this.FLCaption.className = "taskbar-form-list-caption";
    this.FLBox.setAttribute("id", this.Identifier+":frl");
    //
    this.FLBox.appendChild(this.FLImg);
    this.FLBox.appendChild(this.FLCaption);
  }
  else
  {
    // Ottengo per prima cosa il div in cui inserire la entry
    var flt = RD3_DesktopManager.WebEntryPoint.FormListTitle;
    //
    // Creo gli elementi del DOM
    this.FLBox = document.createElement("div");
    this.FLImg = document.createElement("span");
    this.FLCaption = document.createElement("span");
    //
    // Assegno le classi agli oggetti DOM
    this.FLBox.className = "form-list-item";
    this.FLImg.className = "form-list-img";
    this.FLCaption.className = "form-list-caption";
    this.FLBox.setAttribute("id", this.Identifier+":frl");
    //
    // Inserisco gli oggetti nel DOM
    if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_LEFTSB)
    {
      this.FLBox.appendChild(this.FLImg);
      this.FLBox.appendChild(this.FLCaption);
    }
    else
    {
      this.FLBox.appendChild(this.FLCaption);
      this.FLBox.appendChild(this.FLImg);
      RD3_Glb.AddClass(this.FLImg, "form-list-img-right");
    }  
  }
  //
  // Gestisco il click
  this.FLBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnFLClick', ev)");
  //
  if (flt)
    flt.appendChild(this.FLBox);
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
WebForm.prototype.AdaptLayout = function(force)
{ 
  if (this.HostPage)
  {
    RD3_Glb.AdaptToParent(this.FormBox, 0, 0);
    //
    // L'header ha altezza fissa.. mentre il contenuto deve prendere il resto dello spazio
    RD3_Glb.AdaptToParent(this.ContentObj, 0, this.CaptionBox.offsetHeight);
    //
    return;
  }
  //
  var bresw = false;
  var bresh = false;
  var mob = RD3_Glb.IsMobile();
  var doCenter = mob && RD3_DesktopManager.WebEntryPoint.InResize;
  //
  // Non adesso!
  // Per prima cosa devo verificare se sono DockedPopover, se sono Docked Popover allora non devo fare il contollo sulle dimensioni di FormBox
  // perche' non contiene piu' i frames.. 
  var isDockedPopup = mob && this.Docked && this.DockType==RD3_Glb.FORMDOCK_LEFT && this.FramesBox.parentNode!=this.FormBox;
  //
  // Nel caso di subform il controllo se saltare o meno l'adaptLayout lo baso sul padre
  var frmMain = this.SubFormObj && this.SubFormObj.WebForm ? this.SubFormObj.WebForm : this;
  var clWidth = isDockedPopup ? this.FramesBox.clientWidth : this.FormBox.clientWidth;
  var clHeight = isDockedPopup ? this.FramesBox.clientHeight : this.FormBox.clientHeight;
  if (clWidth == 0 && clHeight == 0 && frmMain.Modal==0 && !force)
  {
    this.RecalcLayout = true;
    //    
    // Anche se sono invisibile se sono aperta devo adattare il nome nella lista
    this.AdaptFormListLayout();
    return;
  }
  //
  // Sono modale ma minimizzata, non mi serve fare adesso l'adattamento altrimenti diventa tutto 0, lo devo fare quando mi apro
  if (frmMain.Modal > 0 && frmMain.WindowState == RD3_Glb.WS_MINIMIZE) 
  {
    this.RecalcLayout = true;
    return;
  }
  //
  // Adatto il popupframe e la formlist
  if (this.PopupFrame)
  {
    // Se sono uno smartphone, vado a tutto schermo prima di
    // ridimensionare i frame, cosi' lo sapranno anche loro
    // Non pero' nel caso popover che e' gia' stato posizionato
    if (RD3_Glb.IsSmartPhone() && this.Modal!=2)
    {
      var wb = RD3_DesktopManager.WebEntryPoint.WepBox;
      this.SetFormWidth(wb.clientWidth, true);
      this.SetFormLeft(0,true);
      this.SetFormHeight(wb.clientHeight, true);
      this.SetFormTop(0,true);
    }
    //
    // Se sono Mobile, sono in un resize e non sono al primo giro (!WasAdapted) ridimensiono qui la videata,
    // cosi' tutto si adatta - e' lo stesso codice che c'e' alla fine, ma lo devo fare qui altrimenti non si adatta correttamente
    if (doCenter && this.WasAdapted && !RD3_Glb.IsSmartPhone())
    {
      if (this.Modal!=2)
      {
        // E' una modale; vediamo se posso allargare la modale per accomodare tutta la window
        var ch = this.CaptionBox.offsetHeight;
        //
        var mh = this.MessagesBox.offsetHeight;
        //
        // In Safari a questo punto la message bar non e' ancora pronta...
        // imposto dimensione da programma.
        if (mh==0 || mh==1) mh=25;
        //
        // Se non vengono mostrati i messaggi... la message-bar non occupa spazio!
        if (!this.ShowMessages() || mob)
          mh=0;
        var wb = RD3_DesktopManager.WebEntryPoint.WepBox;
        var w = this.FormWidth==-1 ? this.FramesBox.scrollWidth : this.FormWidth;
        var h = this.FormHeight==-1 ? this.FramesBox.scrollHeight + mh + ch : this.FormHeight;
        if (w>wb.clientWidth*0.9)
          w = wb.clientWidth*0.9;
        if (h>wb.clientHeight*0.9)
          h = wb.clientHeight*0.9;
          //
        this.SetFormLeft(Math.floor((wb.clientWidth-w)/2), true);
        this.SetFormTop(Math.floor((wb.clientHeight-h)/2), true);
        this.SetFormWidth(w, true);
        this.SetFormHeight(h, true);
        //
        // Comunico al server la posizione della Popup
        var ev = new IDEvent("repos", this.Identifier, null, this.ResizeEventDef, null, this.FormLeft, this.FormTop);
      }
      else
      {
        // Nel caso di Form Aperta in Popup la faccio semplicemente riattaccare all'oggetto
        this.PopupFrame.AttachTo();
      }
    }
    //
    // Se sono massimizzata ma non ho le mie dimensioni "originali" memorizzo quelle correnti
    // (puo' succedere se sono stata aperta massimizzata)
    if (!this.NormalLeft && this.FormLeft>0 && this.WindowState == RD3_Glb.WS_MAXIMIZE)
    {
      this.NormalLeft = this.FormLeft;
      this.NormalTop = this.FormTop;
      this.NormalWidth = this.FormWidth;
      this.NormalHeight = this.FormHeight;
    }
    //
    this.PopupFrame.AdaptLayout();
    //
    if (this.PopupFrame.Centered) // Solo la prima volta
    {
      // Se non erano state specificate le dimensioni e ho lo stretch, allora devo toglierlo
      // altrimenti la form si rimpicciolisce a zero
      if (this.FormWidth==-1 && this.ResModeW == RD3_Glb.FRESMODE_STRETCH) // 
      {
        this.ResModeW = RD3_Glb.FRESMODE_NONE;
        bresw = true;
      }
      if (this.FormHeight==-1 && this.ResModeH == RD3_Glb.FRESMODE_STRETCH) // 
      {
        this.ResModeH = RD3_Glb.FRESMODE_NONE;
        bresh = true;
      }
    }
  }
  else
  {
    this.AdaptFormListLayout();  
  }
  //
  // Gestione messaggi non mobile (quella mobile viene dopo i ridimensionamenti degli oggetti)
  if (!mob)
  {
    // Se serve parto con il box dei messaggi alto 0, ci pensano poi i messaggi a ridimensionarlo
    // Se non ho messaggi oppure non li devo mostrare imposto il box a 0
    if (this.Messages.length == 0 || (!this.ShowMessages() && this.Modal!=0))
    {
      if (this.HasInfoMessages() && this.ShowMessages())
        this.MessagesBox.style.height = RD3_ClientParams.MinMessagesBoxHeight+"px";
      else
      {
        this.MessagesBox.style.height = "0px";
        this.MessagesBox.style.borderBottomWidth = "0px";
      }
    }
    //
    this.RealizeMessages();
  }
  //
  // Il FramesBox aveva le scrollbar, prima del ridimensionamento?
  var sch1 = this.FramesBox.clientWidth<this.FramesBox.scrollWidth;
  var scv1 = this.FramesBox.clientHeight<this.FramesBox.scrollHeight;
  //
  // Dimensiono il div globale del form e il contenitore dei frames
  var ofw = 0;
  var ofh = 0;
  var dockedZoneMob = RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.UseZones();
  if (this.Docked && (this.DockType==RD3_Glb.FORMDOCK_LEFT || this.DockType==RD3_Glb.FORMDOCK_RIGHT) && !dockedZoneMob)
  {
    // Nel dimensionare le docked tengo conto anche dei bordi (correzione per seattle)
    ofw = parseFloat(RD3_Glb.GetStyleProp(this.FormBox, "borderLeftWidth")) + parseFloat(RD3_Glb.GetStyleProp(this.FormBox, "borderRightWidth"));
    if (!ofw)
      ofw = 0;
    //
    // Se sono Docked, mobile e non uso le zone mi serve per lasciare lo spazio..
    if (RD3_Glb.IsMobile() && ofw == 0)
     ofw = 2;
  }
  if (this.Docked && this.DockType==RD3_Glb.FORMDOCK_TOP)
  {
    // Se sono una form docked mi dimensiono contando anche il padding del contenitore docked
    var curs = RD3_Glb.GetCurrentStyle(RD3_DesktopManager.WebEntryPoint.TopDockedBox);
    ofh = parseInt("0"+curs.paddingTop) + parseInt("0"+curs.paddingBottom);
    if (!ofh)
      ofh = 0;
  }
  //
  // Se sono in popover la caption e' stata tolta dal mio formBox e messa nella caption del popover; quindi devo occupare tutto
  // lo spazio disponibile
  var offsetH = (this.Docked && mob && RD3_Glb.HasClass(this.CaptionBox, "popover")) ? 0 : this.CaptionBox.offsetHeight;
  RD3_Glb.AdaptToParent(this.FormBox, ofw, ofh);
  RD3_Glb.AdaptToParent(this.FramesBox, 0, offsetH + (mob?0:this.MessagesBox.offsetHeight));
  //
  // Devo sistemare la toolbar di form lato destro
  this.AdaptToolbar = true;
  //
  // Calcolo ridimensionamento per frame 0
  // Prima di calcolare lo spazio disponibile, tolgo l'overflow, cosi' non appaiono scrollbar che potrebbero essere inutili
  // in quanto poi il contenuto interno si ridimensionera'.
  var oldtop = this.FramesBox.scrollTop;
  var oox = this.FramesBox.style.overflowX;
  var ooy = this.FramesBox.style.overflowY;
  this.FramesBox.style.overflowX = "hidden";
  this.FramesBox.style.overflowY = "hidden";
  //  
  var sfb = RD3_Glb.GetCurrentStyle(this.FramesBox);
  var wfb = this.FramesBox.clientWidth - parseInt("0"+sfb.paddingLeft) - parseInt("0"+sfb.paddingRight);
  var hfb = this.FramesBox.clientHeight - parseInt("0"+sfb.paddingTop) - parseInt("0"+sfb.paddingBottom);
  //
  // Salvo le dimensioni dei frames
  this.SaveSize();
  //
  // e poi provo a ridimensionare senza le scrollba
  this.Frames[0].Resize(wfb,hfb);
  //
  this.FramesBox.style.overflowX = oox;
  this.FramesBox.style.overflowY = ooy;  
  //
  // WebKit ha un bug legato allo scrolltop che non e' ancora stato corretto ad oggi.
  // Vedi qui: http://code.google.com/p/chromium/issues/detail?id=2891  
  if (oldtop && (RD3_Glb.IsSafari() || RD3_Glb.IsChrome()) && !mob)
  {
    this.FramesBox.scrollTop = 0;
    this.FramesBox.scrollTop = oldtop;
  }
  //
  // Il FramesBox ha le scrollbar dopo il resize?
  var sch2 = this.FramesBox.clientWidth<this.Frames[0].Width;
  var scv2 = this.FramesBox.clientHeight<this.Frames[0].Height;
  //
  // Se ho ancora le scrollbar vediamo se le posso togliere
  if ((sch2 || scv2) && !mob)
  {
    // Devo ripristinare la larghezza altrimenti il frame non sa di quanto si deve ridimensionare veramente
    this.ResetSize();
    //
    // Anche se vengono eseguiti piu' doppi resize del necessario, questo modo 
    // garantisce risultati migliori.
    //
    // Uso la dimensione manuale perche' IE non aggiorna subito i valori, quindi non e' possibile
    // usare clientwidth e scrollwidth
    if (sch2)
      hfb -= 17;
    if (scv2)
      wfb -= 17;
    this.Frames[0].Resize(wfb,hfb);
  }
  //
  // Ora posso sistemare i messaggi lato mobile
  if (mob)
  {
    // Prima sistemo la posizione x del container
    var w = this.FormBox.offsetWidth * 0.6;
    if (w<320)
      w=320;
    if (w>this.FormBox.offsetWidth)
      w = this.FormBox.offsetWidth;
    //
    this.MessagesBox.style.width = w+"px";
    this.MessagesBox.style.left = ((this.FormBox.offsetWidth-w)/2)+"px";
    //
    // Se la form non mostra i messaggi nascondo la barra
    if (!this.ShowMessages())
    {
      this.MessagesBox.style.height = "0px";
      this.MessagesBox.style.borderBottomWidth = "0px";
      this.MessagesBox.style.borderWidth = "0px";
    }
    //
    // poi sistemo i messaggi
    this.RealizeMessages();
  }
  //
  // adatto il Frame 0
  this.Frames[0].AdaptLayout();  
  //
  // Calcolo ridimensionamento per frame preview
  if (this.PreviewFrame && this.PreviewFrame.FrameBox)
  {
    RD3_Glb.AdaptToParent(this.PreviewFrame.FrameBox, 0, 2);
    //
    // Leggo eventuali dimensioni della pagina se sono un book
    if (this.PreviewFrame instanceof Book && this.PreviewFrame.Pages.length >0)
    {
      var pagbox = this.PreviewFrame.Pages[this.PreviewFrame.ActivePage].PageBox;
      //
      var h = pagbox.offsetHeight;
      var w = pagbox.offsetWidth;
      //
      // Il frame e' piu' grande della pagina? se si lo dimensiono come la pagina
      var frh = this.PreviewFrame.FrameBox.offsetHeight;
      var frw = this.PreviewFrame.FrameBox.offsetWidth;
      //
      if (frh > (h + 32))
        this.PreviewFrame.FrameBox.style.height = (h + 32) + "px";
      if (frw > (w + 32))
        this.PreviewFrame.FrameBox.style.width = (w + 32) + "px";
    }
    //
    this.PreviewFrame.AdaptLayout();
  }  
  //
  // Adatto il popupframe e la formlist
  if (this.PopupFrame)
  {
    // E' una modale; vediamo se posso allargare la modale per accomodare tutta la window
    var ch = this.CaptionBox.offsetHeight;
    //
    var mh = this.MessagesBox.offsetHeight;
    //
    // In Safari a questo punto la message bar non e' ancora pronta...
    // imposto dimensione da programma.
    if (mh==0 || mh==1) mh=25;
    //
    // Se non vengono mostrati i messaggi... la message-bar non occupa spazio!
    if (!this.ShowMessages() || mob)
      mh=0;
    //
    // Se il server mi ha dato delle dimensioni utilizzo quelle (sempre che ci stiano...)
    var wb = RD3_DesktopManager.WebEntryPoint.WepBox;
    var w = this.FormWidth==-1 ? this.FramesBox.scrollWidth : this.FormWidth;
    var h = this.FormHeight==-1 ? this.FramesBox.scrollHeight + mh + ch : this.FormHeight;
    if (w>wb.clientWidth*0.9)
      w = wb.clientWidth*0.9;
    if (h>wb.clientHeight*0.9)
      h = wb.clientHeight*0.9;
    //
    // Lo faccio solo la prima volta...
    if (this.PopupFrame.Centered)
    {
      if (this.RelatedTo)
        this.AttachTo(w, h);
      //
      // Anche se devo centrare non imposto tutte le coordinate: se il server ne fornisce una tengo quella...
      // In questo punto non faccio scattare l'animazione di resize..
      if (this.FormLeft == -1)
        this.SetFormLeft(Math.floor((wb.clientWidth-w)/2), true);
      else
        this.SetFormLeft(null, true);
      if (this.FormTop == -1)
        this.SetFormTop(Math.floor((wb.clientHeight-h)/2), true);
      else
        this.SetFormTop(null, true);
      if (this.FormWidth==-1)
        this.SetFormWidth(w, true);
      else
        this.SetFormWidth(null, true);
      if (this.FormHeight==-1)
        this.SetFormHeight(h, true);
      else
        this.SetFormHeight(null, true);
      //
      this.PopupFrame.Centered = false;
      this.PopupResAnim = false;
      //
      // Comunico al server la posizione della Popup
      var ev = new IDEvent("repos", this.Identifier, null, this.ResizeEventDef, null, this.FormLeft, this.FormTop);
    }
    //
    // Modifico lo stile overflow in modo da evitare scrollbar inutili
    var old = this.FramesBox.style.overflow;
    this.FramesBox.style.overflow = "hidden";
    //
    this.PopupFrame.AdaptLayout();
    //
    RD3_Glb.AdaptToParent(this.FormBox);
    RD3_Glb.AdaptToParent(this.FramesBox, 0, this.CaptionBox.offsetHeight + (mob?0:this.MessagesBox.offsetHeight));
    //
    // Devo sistemare la toolbar di form lato destro
    this.AdaptToolbar = true;
    //
    this.FramesBox.style.overflow = old;
  }
  //
  // Aggiorno il contenitore docked
  if (!RD3_DesktopManager.WebEntryPoint.UseZones())
    this.AdaptDocked();
  //
  // Nel caso di modale la dimensione che invio deve essere quella totale, compresa la Caption
  var clw = this.PopupFrame ? this.PopupFrame.PopupBox.clientWidth :this.FramesBox.clientWidth;
  var clh = this.PopupFrame ? this.PopupFrame.PopupBox.clientHeight : this.FramesBox.clientHeight;
  //
  // Notifico l'evento di resize solo se almeno una delle dimensioni e' cambiata
  if (this.lastclw != clw || this.lastclh != clh)
  {
    var ev = new IDEvent("resize", this.Identifier, null, this.ResizeEventDef, null, clw, clh);
    this.lastclw = clw;
    this.lastclh = clh;
  }
  //
  // Mi ricordo che ho gia' adattato il layout
  this.RecalcLayout = false;
  //
  // Mi ricordo che almeno una volta e' stata adattata
  this.WasAdapted = true;
  //
  if (bresw)
    this.ResModeW = RD3_Glb.FRESMODE_STRETCH;
  if (bresh)
    this.ResModeH = RD3_Glb.FRESMODE_STRETCH;    
}


// ********************************************************************************
// Adatta la toolbar di form per mettere le toolbar a destra
// ********************************************************************************
WebForm.prototype.AdaptToolbarLayout = function()
{
  this.AdaptToolbar = false;
  //
  if (RD3_Glb.IsMobile())
  { 
    // verifico se c'e' una combo aperta
    var comboopen = (RD3_DDManager.OpenCombo && !RD3_DDManager.OpenCombo.IsPopOver() && RD3_DDManager.OpenCombo.Owner.ParentField.ParentPanel.WebForm==this);
    var dp = comboopen?"none":"";
    var dv = comboopen?"hidden":"";
    if (this.CloseBtn) this.CloseBtn.style.display = dp;
    if (this.ConfirmBtn) this.ConfirmBtn.style.display = dp;
    if (this.BackButtonCnt && this.BackButtonCnt.parentNode==this.CaptionBox)
    { 
      this.BackButtonCnt.style.visibility = dv; 
      // 
      // Se c'e' un BackButton e l'ho messo visibile allora devo nascondere il MenuButton: ce ne deve essere solo uno dei due
      dv = dv=="" ? "hidden" : dv;
    }
    var m = RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton;
    if (m && m.parentNode==this.CaptionBox) 
    {
      // Se devo mostrare il menu-button e sono su smartphone
      if (dv=="" && RD3_Glb.IsSmartPhone())
      {
        // Se non voglio il backButton lo nascondo altrimenti se mi hanno specificato un testo, lo uso
        if (!this.HasBackButton())
          dv = "hidden";
        else if (this.BackButtonTxt)
          RD3_DesktopManager.WebEntryPoint.CmdObj.SetMenuButtonCaption(this.BackButtonTxt);
      }
      //
      m.style.visibility = dv;
    }
    else if (!RD3_DesktopManager.WebEntryPoint.InResponse)
    {
      // Il MenuButton non e' mio.. pero' potrebbe essere di uno dei miei figli.. se sono in Response non faccio nulla, ci pensa AfterProcess,
      // ma se non sono in response ci devo pensare io
      for (var i=0; i<this.Frames.length; i++) 
      {
        var fr = this.Frames[i];
        if (!fr.ChildFrame1 && !fr.OnlyContent && fr instanceof IDPanel && fr.Realized && fr.RefreshToolbar)
        {
          fr.UpdateToolbar();
          break;
        }
      }
    }
    var ctb = this.GetCustomToolbar();
    if (ctb) ctb.style.display = dp;
    //
    var ofs = 0;
    if (this.ToolbarPosition==RD3_Glb.FORMTOOL_DISTRIB)
    {
      // Sulla caption mobile ci possono essere i bottoni CLOSE a SX e CONFIRM a DX, in mezzo c'e' il titolo
      if (this.CloseBtn)
        this.CloseBtn.style.left = "8px";
      if (this.ConfirmBtn)
        this.ConfirmBtn.style.left = (this.CaptionBox.offsetWidth-50)+"px";
     ofs += 50;
    }
    if (this.ToolbarPosition==RD3_Glb.FORMTOOL_RIGHT)
    {
      var dx = 50;
      if (this.ConfirmBtn)
      {
        this.ConfirmBtn.style.left = (this.CaptionBox.offsetWidth-dx)+"px";
        dx-=50;
        ofs += 50;
      }
      if (this.CloseBtn)
      {
        this.CloseBtn.style.left = (this.CaptionBox.offsetWidth-dx)+"px";
        ofs += 50;
      }
      var ctb = this.GetCustomToolbar();
      if (ctb)
        ctb.style.right = ofs+"px";
    }
    //
    // Sistemo la toolbar custom
    if (ctb)
      RD3_Glb.AdjustCustomToolbar(ctb, this.CaptionBox);
    //
    // Se c'e' l'icona la spingo a destra cosi' l'Adjust lavora meglio
    // Lo faccio solo se c'e' il bottone per andare indietro (su Tablet c'e' sempre, su smartphone solo se richiesto)
    if ((RD3_Glb.IsQuadro() || (RD3_Glb.IsMobile7() && !RD3_Glb.IsSmartPhone())) && this.HasIcon() && this.ImgIcon && this.Image!="" && (!RD3_Glb.IsSmartPhone() || this.HasBackButton))
      this.ImgIcon.style.marginLeft = "100px";
    //
    // e poi la caption
    RD3_Glb.AdjustCaptionPosition(this.CaptionBox, this.CaptionTxt);
    //
    // Se c'e' l'icona, il margin left lo "sposto" dalla caption all'icona che, a sua volta, spinge la caption
    // Lo faccio solo se c'e' il bottone per andare indietro (su Tablet c'e' sempre, su smartphone solo se richiesto)
    if ((RD3_Glb.IsQuadro() || (RD3_Glb.IsMobile7() && !RD3_Glb.IsSmartPhone())) && this.HasIcon() && this.ImgIcon && this.Image!="" && (!RD3_Glb.IsSmartPhone() || this.HasBackButton))
    {
      this.ImgIcon.style.marginLeft = this.CaptionTxt.style.marginLeft;
      this.CaptionTxt.style.marginLeft = "";
    }
    //
    return;
  }
  //
  var n = this.CaptionBox.childNodes.length;
  var j = -1; // Indice della CAPTION
  var lw = 0; // Larghezza complessiva di tutto quello che c'e' prima della caption
  var rw = 0; // Larghezza complessiva di tutto quello che c'e' dopo la caption
  //
  var offm = RD3_Glb.IsTouch()?2:0;
  //  
  for (var i=0;i<n;i++)
  {
    var o = this.CaptionBox.childNodes[i];
    if (j==-1)
    {
      if (o==this.CaptionTxt)
        j=i;
      else if (o.offsetWidth)
        lw = o.offsetLeft + o.offsetWidth + offm;
    }
    else
    {
       rw += o.offsetWidth + offm;
    }
  }
  //
  if (rw>0 && this.CaptionTxt)
  {
    rw+=2; // Considero un po' di margine
    //
    this.CaptionTxt.style.paddingLeft = "";
    this.CaptionTxt.style.paddingRight = "";
    this.CaptionTxt.style.width = "";
    //
    var pr = (this.CaptionBox.offsetWidth-rw-lw-this.CaptionTxt.offsetWidth);
    if (RD3_ServerParams.Theme.startsWith("zen")) {
      if (this.ToolbarPosition == RD3_Glb.FORMTOOL_RIGHT)
        pr -= 16;
      else if (this.ToolbarPosition == RD3_Glb.FORMTOOL_DISTRIB)
        pr -= 6;
    }
    //
    if (pr>0)
    {
      if (this.ToolbarPosition == RD3_Glb.FORMTOOL_DISTRIB)
      {
        var prdx = Math.floor(pr/2);
        var prsx = prdx;
        if (prdx*2<pr)
          prdx++;
        //
        this.CaptionTxt.style.paddingRight = prdx + "px";
        this.CaptionTxt.style.paddingLeft = prsx + "px";
      }
      else
      {
        this.CaptionTxt.style.paddingRight = pr + "px";
      }
    }
    else
    {
      // Devo impostare una larghezza minore...
      var w = this.CaptionTxt.offsetWidth + pr - 8;
      if (w>=0)
        this.CaptionTxt.style.width = w+"px";
    }
  }
}



// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
WebForm.prototype.AdaptDocked = function()
{ 
  var mob = RD3_Glb.IsMobile();
  var ofs = mob?0:2;
  var ofw = 0;
  //
  if (this.Docked)
  {
    if (this.DockType==RD3_Glb.FORMDOCK_LEFT)
    {
      // Nel dimensionare il contenitore tengo conto anche dei bordi (per Seattle)
      ofw = parseFloat(RD3_Glb.GetStyleProp(this.FormBox, "borderLeftWidth")) + parseFloat(RD3_Glb.GetStyleProp(this.FormBox, "borderRightWidth"));
      if (!ofw)
        ofw = 0;
      //
      RD3_DesktopManager.WebEntryPoint.LeftDockedBox.style.width = this.Visible ? this.Frames[0].Width+ofs+ofw+"px" : "0px";
    }
    if (this.DockType==RD3_Glb.FORMDOCK_TOP)
    {
      var h = this.Frames[0].Height + this.CaptionBox.offsetHeight + (mob?0:this.MessagesBox.offsetHeight) + ofs;
      //
      var s = RD3_Glb.GetCurrentStyle(this.FramesBox);
      h += parseInt("0"+s.paddingTop) + parseInt("0"+s.paddingBottom);
      //
      s = RD3_Glb.GetCurrentStyle(RD3_DesktopManager.WebEntryPoint.TopDockedBox);
      h += parseInt("0"+s.paddingTop) + parseInt("0"+s.paddingBottom);
      //
      RD3_DesktopManager.WebEntryPoint.TopDockedBox.style.height = this.Visible ?  h+"px" : "0px";
    }
    if (this.DockType==RD3_Glb.FORMDOCK_RIGHT)
    {
      // Nel dimensionare il contenitore tengo conto anche dei bordi (per Seattle)
      ofw = parseFloat(RD3_Glb.GetStyleProp(this.FormBox, "borderLeftWidth")) + parseFloat(RD3_Glb.GetStyleProp(this.FormBox, "borderRightWidth"));
      if (!ofw)
        ofw = 0;
      //
      RD3_DesktopManager.WebEntryPoint.RightDockedBox.style.width =this.Visible ?  this.Frames[0].Width+ofs+ofw+"px" : "0px";
    }
    if (this.DockType==RD3_Glb.FORMDOCK_BOTTOM)
    {
      var h = this.Frames[0].Height + this.CaptionBox.offsetHeight + (mob?0:this.MessagesBox.offsetHeight) + ofs;
      var s = RD3_Glb.GetCurrentStyle(this.FramesBox);
      h += parseInt("0"+s.paddingTop) + parseInt("0"+s.paddingBottom);
      RD3_DesktopManager.WebEntryPoint.BottomDockedBox.style.height =this.Visible ?   h+"px" : "0px";
    }
  }
}



// ********************************************************************************
// Calcola le dimensioni della form list e ne adatta la larghezza
// ********************************************************************************
WebForm.prototype.AdaptFormListLayout = function()
{ 
  // Se il menu e' nascosto salto l'adapt della form list
  if (this.FLCaption && !RD3_DesktopManager.WebEntryPoint.CmdObj.SuppressMenu)
   {
    // Dimensiono lo span che contiene la caption della linguetta
    RD3_Glb.AdaptToParent(this.FLCaption, this.FLImg.offsetWidth, -1);
    //
    var oldsw = this.FLCaption.style.width;
    var oldw = this.FLCaption.clientWidth;
    this.FLCaption.style.width = "auto";
    this.FLCaption.style.lineHeight = "";
    this.FLCaption.style.whiteSpace = "";      
    //
    if (this.FLCaption.clientWidth>oldw)
    {
      // Se e' veramente lunga, metto tooltip
      if (this.FLCaption.clientWidth>1.9*oldw)
        RD3_TooltipManager.SetObjTitle(this.FLCaption, RD3_Glb.RemoveTags(this.Caption));
      else
        RD3_TooltipManager.SetObjTitle(this.FLCaption, "");
      //
      // E' andata su due righe!
      this.FLCaption.style.lineHeight = "100%";
      this.FLCaption.style.whiteSpace = "normal";      
    }
    //
    this.FLCaption.style.width = oldsw;
  } 
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
WebForm.prototype.Unrealize = function()
{ 
  // Tolgo la form dal DOM
  if (this.FormBox && this.FormBox.parentNode)
    this.FormBox.parentNode.removeChild(this.FormBox);
  //
  // La tolgo dalla mappa degli oggetti
  RD3_DesktopManager.ObjectMap[this.Identifier] = null;
  //
  // Se sono una Form Multipla devo portare nella tomba i miei commandset
  if (this.IdxForm>65536)
   RD3_DesktopManager.WebEntryPoint.CmdObj.CloseMultipleForm(this.IdxForm);
  //
  // Passo il messaggio ai webframe
  this.Frames[0].Unrealize();
  //
  // Ora i messaggi
  var n = this.Messages.length;
  for (var i=0; i<n; i++)
    this.Messages[i].Unrealize();
  //
  // Elimino la entry dalla lista delle Form aperte
  if (this.FLBox && this.FLBox.parentNode)
    this.FLBox.parentNode.removeChild(this.FLBox);
  //
  // Elimino il popupframe
  if (this.PopupFrame)
  {
    this.PopupFrame.Unrealize();
    //
    // Ripristino l'oggetto che aveva il fuoco
    RD3_KBManager.ActiveObject = this.LastActiveObject;
    RD3_KBManager.ActiveElement = this.LastActiveElement;
    RD3_KBManager.CheckFocus = true;
    //
    // Uso un timer per reimpostare il fuoco nel punto voluto, 
    // in questo modo viene impostato correttamente anche se il server 
    // manda un altro campo
    var actOb = this.LastActiveObject;
    var actEl = this.LastActiveElement;
    window.setTimeout(function () {
      if (!actEl)
        return;
      //
      try 
      {
        RD3_KBManager.ActiveObject = actOb;
        RD3_KBManager.ActiveElement = actEl;
        RD3_KBManager.ActiveElement.focus();
        if (RD3_KBManager.ActiveElement.classList && RD3_KBManager.ActiveElement.classList.contains("combo-input"))
          RD3_KBManager.ActiveElement.scrollLeft = 0;
        RD3_KBManager.CheckFocus = false;
        RD3_KBManager.DontCheckFocus = true;
      }
      catch (ex) { }
    }, 300);
  }
  //
  if (this.Docked)
  {
    if (!RD3_DesktopManager.WebEntryPoint.UseZones())
    {
      // Se trovo un'altra docked dal mio lato allora non rimuovo la classe, altrimenti la rimuovo
      var removeclass = true;
      var nf = RD3_DesktopManager.WebEntryPoint.StackForm.length;
      for (var t=0;t<nf;t++)
      {
        var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
        if (f.Docked && f.DockType == this.DockType && f!=this)
          removeclass = false;
      }
      //
      if (this.DockType==RD3_Glb.FORMDOCK_LEFT)
      {
        var parent = RD3_DesktopManager.WebEntryPoint.LeftDockedBox;
        //
        if (removeclass)
        {
          parent.className = "left-dock-container";
          parent.style.width = "";
        }
      }
      if (this.DockType==RD3_Glb.FORMDOCK_TOP)
      {
        var parent = RD3_DesktopManager.WebEntryPoint.TopDockedBox;
        //
        if (removeclass)
        {
          parent.className = "top-dock-container";
          parent.style.height = "";
        }
      }
      if (this.DockType==RD3_Glb.FORMDOCK_RIGHT)
      {
        var parent = RD3_DesktopManager.WebEntryPoint.RightDockedBox;
        //
        if (removeclass)
        {
          parent.className = "right-dock-container";
          parent.style.width = "";
        }
      }
      if (this.DockType==RD3_Glb.FORMDOCK_BOTTOM)
      {
        var parent = RD3_DesktopManager.WebEntryPoint.BottomDockedBox;
        //
        if (removeclass)
        {
          parent.className = "bottom-dock-container";
          parent.style.height = "";
        }
      }
    }
    else
    {
      var scz = RD3_DesktopManager.WebEntryPoint.GetScreenZone(this.DockType);
      scz.RemoveForm(this);
    }
    //
    // Se sono io la form attiva verra' notificato l'evento di cambio form attiva, se non sono io
    // l'evento non scatta e devo occuparmi io di fare nascondere le mie toolbar
    var actf = RD3_DesktopManager.WebEntryPoint.ActiveForm;
    if (actf && actf.IdxForm != this.IdxForm)
      RD3_DesktopManager.WebEntryPoint.RefreshCommands = true;
  }
  //
  // Rimuovo i collegamenti al DOM
  this.FormBox = null;
  this.CaptionBox = null;
  this.CloseBtn = null;
  this.ConfirmBtn = null;
  this.CaptionTxt = null;  
  this.FramesBox = null;   
  this.ImgIcon = null;
  //
  this.FLBox = null;    
  this.FLImg = null;  
  this.FLCaption = null;
  //
  this.Realized = false;
}


// ********************************************************************************
// Gestore evento di click su pulsante CHIUDI
// ********************************************************************************
WebForm.prototype.OnClose= function(evento)
{ 
  var ev = new IDEvent("close", this.Identifier, evento, this.ClickEventDef);
  //  
  // La gestione locale non e' ammessa
  //if (ev.ClientSide)
  //{
  //  RD3_DesktopManager.WebEntryPoint.CloseForm(this.Identifier);
  //}
  //
  // Devo fermare l'evento, altrimenti il click passa alla caption e
  // se e' doppio la massimizza
  RD3_Glb.StopEvent(evento);
  //
  // Chiudo eventuali menu' popup rimasti aperti
  RD3_DesktopManager.WebEntryPoint.CmdObj.ClosePopup();
}


// ********************************************************************************
// Gestore evento di click su pulsante CONFERMA
// ********************************************************************************
WebForm.prototype.OnConfirm= function(evento)
{ 
  var ev = new IDEvent("confirm", this.Identifier, evento, this.ClickEventDef);
  //  
  // La gestione locale non e' ammessa
  //if (ev.ClientSide)
  //{
  //  RD3_DesktopManager.WebEntryPoint.CloseForm(this.Identifier);
  //}
}

// ********************************************************************************
// Modifica del window state
// ********************************************************************************
WebForm.prototype.OnMaximize= function(evento)
{ 
  if (!this.HasMaxButton())
    return;
  //
  var nst = (this.WindowState==RD3_Glb.WS_NORMAL)? RD3_Glb.WS_MAXIMIZE : RD3_Glb.WS_NORMAL;
  var ev = new IDEvent("chgwst", this.Identifier, evento, this.ResizeEventDef, null, nst);
  //  
  // Gestione locale
  if (ev.ClientSide)
  {
    if (this.Modal)
    {
      this.SetWindowState(nst);      
    }
  }
}

WebForm.prototype.OnMinimize= function(evento)
{ 
  if (this.Modal && this.WindowState!=RD3_Glb.WS_MINIMIZE)
  {  
    var ev = new IDEvent("chgwst", this.Identifier, evento, this.ResizeEventDef, null, RD3_Glb.WS_MINIMIZE);
    //  
    // Gestione locale
    if (ev.ClientSide)
    {
      this.SetWindowState(RD3_Glb.WS_MINIMIZE);
    }
  }
  //
  // Devo fermare l'evento, altrimenti il click passa alla popupframe e si cerca di
  // riattivare la form...
  RD3_Glb.StopEvent(evento);
  //
  // Chiudo eventuali menu' popup rimasti aperti
  RD3_DesktopManager.WebEntryPoint.CmdObj.ClosePopup();
}

WebForm.prototype.DontMinimize= function(evento)
{ 
  if (this.Modal && this.WindowState==RD3_Glb.WS_MINIMIZE && this.NormalWindowState!=null)
  {  
    var ev = new IDEvent("chgwst", this.Identifier, evento, this.ResizeEventDef, null, this.NormalWindowState);
    //  
    // Gestione locale
    if (ev.ClientSide)
    {
      var state = this.NormalWindowState;
      //
      // Sono modale e minimizzato, devo tornare allo stato precedente... ma lo stato percedente e' minimizzato!
      // puo' succedere se l'utente ha fatto F5 e il client si e' dimanticato la storia... in questo caso posso solo allargarmi
      if (state == RD3_Glb.WS_MINIMIZE)
        state = RD3_Glb.WS_MAXIMIZE;
      this.SetWindowState(state);
    }
  }
}



// ********************************************************************************
// Imposto l'attivazione o meno di questa form: se value e' true e visible e' true
// la mostro, altrimenti la nascondo
// force = false o undefined: non imposta il display
// ********************************************************************************
WebForm.prototype.SetActive = function(value, force)
{
  if (!this.Realized)
    return;
  //
  // Se sono in un popup, imposto la classe della caption
  if (this.PopupFrame)
  {
    if (value)
    {
      RD3_Glb.RemoveClass(this.CaptionBox, "form-caption-inactive");
    }
    else
    {
      RD3_Glb.AddClass(this.CaptionBox, "form-caption-inactive");
    }
    //
    this.PopupFrame.SetActive(value);
  }
  //
  if (this.IsModalPopup())
    return;
  if (this.Docked)
    return;
  //
  if (!force)
    force = false;
  //
  if (value && this.Visible)
  {
    // cambio lo stile della FormList
    if (this.FLBox)
    {
      if (RD3_DesktopManager.WebEntryPoint.HasSideMenu())
      {
        this.FLBox.className = "form-list-active-item";
        this.FLImg.className = "form-list-active-img";
        this.FLCaption.className = "form-list-active-caption";
      }
      else
      {
        RD3_Glb.AddClass(this.FLBox, "taskbar-form-list-active");
      }
    }
    //
    if (force && this.Modal==0)
      this.FormBox.style.display = "";
    //
    if (this.PopupFrame)
      this.PopupFrame.BringToFront();
  }
  else
  {
    // cambio lo stile della FormList
    if (this.FLBox)
    {
      if (RD3_DesktopManager.WebEntryPoint.HasSideMenu())
      {
        this.FLBox.className = "form-list-item";
        this.FLImg.className = "form-list-img";
        this.FLCaption.className = "form-list-caption";
      }
      else
      {
        RD3_Glb.RemoveClass(this.FLBox, "taskbar-form-list-active");
      }
    }
    this.AlreadyVisible = false;
    //
    if (force && this.Modal==0)
      this.FormBox.style.display = "none";
  }
  //
  if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
    RD3_Glb.AddClass(this.FLImg, "form-list-img-right");
  //
  if (RD3_Glb.IsMobile() && this.Modal==0 && value && !this.Docked)
  {
    // Mi prendo il menu' button e lo metto nella prima caption disponibile
    this.CaptureToolbarButton(RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton);
    //
    // Dopo averlo catturato lo devo anche gestire
    if (RD3_DesktopManager.WebEntryPoint.InResponse)
      this.AdaptToolbar = true;
    else
      this.AdaptToolbarLayout();
  }
}


// ********************************************************************************
// Metto l'oggetto passato in una delle mie toolbar
// ********************************************************************************
WebForm.prototype.CaptureToolbarButton= function(obj)
{ 
  if (!obj)
    return;
  //
  var tb = this.GetFirstToolbar(true);
  if (tb)
  {
    // Eseguo operazione
    if (obj.parentNode)
      obj.parentNode.removeChild(obj);
    tb.insertBefore(obj, tb.firstChild);
  }
}


// ********************************************************************************
// Gestore evento di click sulla entry nella FormList
// popclk = true se chiamata dal click sul popup frame che serve quando si
// cerca di attivare la form
// ********************************************************************************
WebForm.prototype.OnFLClick= function(evento, popclk, nolocal)
{ 
  // Se sono una SubForm non mi interessa
  if (this.SubFormObj)
    return;
  //
  var okmin = true;
  //
  // Se ero minimizzata, prima di tutto esco dalla minimizzazione
  if (this.Modal && this.WindowState==RD3_Glb.WS_MINIMIZE && !popclk)
  {
    this.DontMinimize();
    okmin = false;
   }
  //
  // Verifico se sono io la form attiva: se si non c'e' bisogno di fare altro
  var wep = RD3_DesktopManager.WebEntryPoint;
  //
  if (wep.ActiveForm==this || wep.ActiveForm==this.Identifier)
  {
    // Vediamo se devo minimizzarmi
    if (!popclk && okmin && this.HasMinButton() && this.Modal && !this.IsModalPopup())
    {
      this.OnMinimize(evento);
    }
    //
    return;
  }
  //
  // Lancio evento e faccio gestione locale se richiesto e se non ho un animazione bloccante in corso
  var ev = new IDEvent("flclk", this.Identifier, evento, this.ClickFLEventDef);
  if (ev.ClientSide && !RD3_GFXManager.Blocking() && !nolocal)
  {
    // Attivo la form chiamando il metodo di Wep
    wep.ActivateForm(this.Identifier);
    //
    // Chiudo eventuali menu' popup rimasti aperti
    wep.CmdObj.ClosePopup();
  }  
}


// ********************************************************************************
// Ho una Popup e il server ha cambiato la sua posizione o dimensione: devo animare
// questo cambiamento!
// ********************************************************************************
WebForm.prototype.StartPopupResizeGFX= function()
{
  // Controllo di essere veramente una modale...
  if (this.PopupFrame)
  {
    this.Animating = true;
    //
    var fx = new GFX("popupres", true, this, false, null, this.PopResAnimDef);
    RD3_GFXManager.AddEffect(fx);
  }
  //
  this.PopupResAnim = false;
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
WebForm.prototype.AfterProcessResponse= function()
{ 
  if (this.RecalcLayout && !this.PopupResAnim)
    this.AdaptLayout();
  //
  if (this.PopupResAnim)
    this.StartPopupResizeGFX();
  //
  // Se devo far ricalcolare la visibilita' dei comandi lo faccio ora
  if (this.RecalcCommands)
  {
    RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveFormChanged();
    this.RecalcCommands = false;
  }
  //
  if (this.AdaptToolbar && this.Realized)
    this.AdaptToolbarLayout();
  //
  // Giro il messaggio ai frames
  var n = this.Frames.length;
  for (var i=0;i<n;i++)
    this.Frames[i].AfterProcessResponse();
}


// ********************************************************************************
// Devo dare il fuoco a qualcosa nella form
// ********************************************************************************
WebForm.prototype.Focus= function(startframe, gotop)
{ 
  // Cerco il frame, poi fuoco i successivi
  var idx = 0;
  //
  // Se lo chiamo con gotop true o false voglio partire da quello prima o quello dopo, altrimenti fuoco in fila, partendo da startframe
  // (come prima della 13)
  var offs = 0;
  if (gotop != undefined)
    offs = gotop ? 1 : -1;
  //
  if (startframe)
  {
    var n = this.Frames.length;
    for (var i=0; i<n; i++)
    {
      if (this.Frames[i]==startframe)
      {
        idx = i + offs;
        break;
      }
    }
  }
  //  
  // Daro' il fuoco al primo frame che lo vuole
  var n = this.Frames.length;
  //
  if (startframe && gotop != undefined)
  {
    // In questo caso sto gestendo il tab o la navigazione con tastiera, non il fuoco generico della form
    if (gotop)
    {
      for (var i=idx; i<n; i++)
      {
        if (this.Frames[i].HandlesTabFocus() && this.Frames[i].Focus(gotop))
          return true;
      }
    }
    else
    {
      for (var i=idx; i>=0; i--)
      {
        if (this.Frames[i].HandlesTabFocus() && this.Frames[i].Focus(gotop))
          return true;
      }
    }
    //
    // Ho fatto un giro completo... se sono una subform passo la palla alla form principale, altrimenti reinizio il giro
    if (this.SubFormObj)
    {
      var parFrm = null; 
      if (this.SubFormObj instanceof SubForm)
        parFrm = this.SubFormObj.WebForm;
      if (parFrm)
        return parFrm.Focus(this.SubFormObj, gotop);
    }
    //
    // Parto o dall'inizio o dalla fine
    idx = gotop ? 0 : n-1;
  }
  //
  for (var i=0; i<n; i++)
  {
    if (this.Frames[(i+idx)%n].Focus(gotop))
      return true;
  }
  //
  return false;
}


// **********************************************************************
// Gestisco la pressione dei tasti FK a partire dalla form
// **********************************************************************
WebForm.prototype.HandleFunctionKeys = function(eve)
{
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var ok = false;
  //
  // Verifico la toolbar di form
  ok = RD3_DesktopManager.WebEntryPoint.CmdObj.HandleFunctionKeys(eve, this.IdxForm, -1);
  if (ok)
    return ok; // Nel caso esco subito perche' non devo fare verifiche ulteriori
  //
  // Calcolo il numero di FK da 1 a 48
  var fkn = (code-111) + (eve.shiftKey? 12 : 0)  + (eve.ctrlKey? 24 : 0);
  //
  // Vediamo se corrisponde ad uno dei miei tasti predefiniti
  if (fkn==RD3_ClientParams.FKCloseForm)
  {
    ok = true;
    this.OnClose(eve);
  }
  //
  // Passo il messaggio al desktop
  if (!ok)
    ok = RD3_DesktopManager.WebEntryPoint.HandleFunctionKeys(eve);
  //
  return ok;
}


// **********************************************************************
// Ritorna l'indice 0-based del frame indicato
// **********************************************************************
WebForm.prototype.GetFrameIndex = function(frame)
{
  var n = this.Frames.length;
  for (var i=0; i<n; i++) 
  {
    var fr = this.Frames[i];
    if (fr==frame)
    {
      return i;
    }
  }
  //
  return -1;
}


// ********************************************************************************
// Vediamo se uno dei panneli contenuti ha info-messages
// ********************************************************************************
WebForm.prototype.HasInfoMessages = function()
{ 
  var n = this.Frames.length;
  for (var i=0; i<n; i++) 
  {
    if (this.Frames[i].InfoMessage)
      return true;
  }
}


// ********************************************************************************
// Posso spostare la form se e' modale
// ********************************************************************************
WebForm.prototype.IsTransformable = function()
{
  // Se sono una sub-form di BookBox chiedo a lei
  if (this.SubFormObj && this.SubFormObj instanceof BookBox)
    return this.SubFormObj.IsTransformable();
  //
  return (this.PopupFrame!=null && (this.CanResize() || this.CanMove())) || (this.Docked && this.CanResize() && RD3_ServerParams.EnableFrameResize);
}

WebForm.prototype.IsDraggable = function()
{
  // Se sono una sub-form di BookBox chiedo a lei
  if (this.SubFormObj && this.SubFormObj instanceof BookBox)
    return this.SubFormObj.IsDraggable();
  //
  return false;
}

WebForm.prototype.DragObj = function(id)
{
  // Se una sub-form di BookBox
  if (this.SubFormObj && this.SubFormObj instanceof BookBox)
  {
    // E sono sull'intestazione, rispondo che occorre tirare la box
    if (id.substr(id.length-4)==":cap" || id.substr(id.length-4)==":txt")
      return this.SubFormObj;
    else
      return null;
  }
  else
    return this;
}

WebForm.prototype.IsMoveable = function()
{
  return this.PopupFrame!=null && this.CanMove();
}

WebForm.prototype.IsResizable = function()
{
  return (this.PopupFrame!=null && this.CanResize()) || (this.Docked && this.CanResize());
}

// ********************************************************************************
// Resituisce l'oggetto DOM su cui deve essere effettuata la trasformazione
// ********************************************************************************
WebForm.prototype.DropElement = function()
{
  if (this.Modal)
    return this.PopupFrame.PopupBox;
  else if (this.Docked)
    return this.FormBox;
}

// ********************************************************************************
// Metodo chiamato per effettuare la trasformazione
// ********************************************************************************
WebForm.prototype.OnTransform = function(x, y, w, h, evento)
{
  var mob = RD3_Glb.IsMobile();
  //
  if (this.PopupFrame)
  {
    // Non permetto alla form di uscire del tutto dal browser: altrimenti non la recupero piu'..
    if (y < 0)
      y = 0;
    if (y > document.body.clientHeight-this.CaptionBox.offsetHeight)
      y = document.body.clientHeight-this.CaptionBox.offsetHeight;
    if (x < 0 && x + this.FormWidth < 20)
      x = 0-this.FormWidth+20;
    if (x > document.body.clientWidth-20)
      x = document.body.clientWidth-20;
    //
    x = Math.round(x);
    y = Math.round(y);
    w = Math.round(w);
    h = Math.round(h);
    //
    // Sto solo spostando la Form o la sto ridimensionando?
    // se la sto solo spostando non serve fare l'adaptLayout (non la sposto con Animazione!)
    var moving = (this.FormHeight==h && this.FormWidth==w && this.FormTop!=y && this.FormLeft!=y);
    //
    this.SetFormTop(y, true);
    this.SetFormLeft(x, true);
    //
    // Per sicurezza controllo di poter modificare le dimensioni
    if (this.BorderType == RD3_Glb.BORDER_THICK)
    {
      this.SetFormHeight(h, true);
      this.SetFormWidth(w, true);
    }
    //
    if (!moving)
      this.AdaptLayout();
    //
    // Comunico al server la nuova posizione della Popup
    var ev = new IDEvent("repos", this.Identifier, null, this.ResizeEventDef, null, this.FormLeft, this.FormTop);
  }
  else if (this.Docked)
  {
    if ((this.DockType==RD3_Glb.FORMDOCK_LEFT || this.DockType==RD3_Glb.FORMDOCK_RIGHT) && this.Frames[0].Width!=w)
    {
      if (w<RD3_ClientParams.DockedMinResize)
        w = RD3_ClientParams.DockedMinResize;
      this.Frames[0].SetWidth(w);
    }
    //
    if (this.DockType==RD3_Glb.FORMDOCK_TOP || this.DockType==RD3_Glb.FORMDOCK_BOTTOM)
    {
      if (h<RD3_ClientParams.DockedMinResize)
        h = RD3_ClientParams.DockedMinResize;
      var h1 = h - this.CaptionBox.offsetHeight - (mob?0:this.MessagesBox.offsetHeight) - 2;
      //
      if (h1>0)
        this.Frames[0].SetHeight(h1);
    }
    //
    if (RD3_DesktopManager.WebEntryPoint.InResponse)
      RD3_DesktopManager.WebEntryPoint.RecalcLayout = true;
    else
      RD3_DesktopManager.WebEntryPoint.AdaptLayout();
  }
}

// ********************************************************************************
// Applico il cursore di trasformazione alla caption
// ********************************************************************************
WebForm.prototype.ApplyCursor = function(cn)
{
  // Puo' arrivare anche dopo che la form si e' chiusa...
  // la croce non la voglio... perche' in windows non c'e'
  if (this.Realized && cn!="move")
  {
    // Se il bordo e' grande applico il cursore anche agli oggetti bordo
    if (this.PopupFrame)
      this.PopupFrame.ApplyCursor(cn);
    else if (this.Docked)
    {
      RD3_DesktopManager.WebEntryPoint.FormsBox.style.cursor = cn;
      //
      switch (this.DockType)
      {
        case RD3_Glb.FORMDOCK_LEFT :
        break;
        
        case RD3_Glb.FORMDOCK_RIGHT :
          RD3_DesktopManager.WebEntryPoint.RightDockedBox.style.cursor=cn;
        break;
        
        case RD3_Glb.FORMDOCK_TOP :
          RD3_DesktopManager.WebEntryPoint.LeftDockedBox.style.cursor=cn;
          RD3_DesktopManager.WebEntryPoint.RightDockedBox.style.cursor=cn;
        break;
        
        case RD3_Glb.FORMDOCK_BOTTOM :
          RD3_DesktopManager.WebEntryPoint.LeftDockedBox.style.cursor=cn;
          RD3_DesktopManager.WebEntryPoint.RightDockedBox.style.cursor=cn;
          RD3_DesktopManager.WebEntryPoint.BottomDockedBox.style.cursor=cn;
        break;
      }
    }
  }
}


// ********************************************************************************
// Salva le dimensioni attuali dei frames
// ********************************************************************************
WebForm.prototype.SaveSize = function()
{ 
  var n = this.Frames.length;
  for (var i=0; i<n; i++) 
  {
    this.Frames[i].SaveSize();
  }  
}


// ********************************************************************************
// Ripristina le dimensioni dei frames
// ********************************************************************************
WebForm.prototype.ResetSize = function()
{ 
  var n = this.Frames.length;
  for (var i=0; i<n; i++) 
  {
    this.Frames[i].ResetSize();
  }  
}


// ********************************************************************************
// Gestore evento di mouse over su uno degli oggetti di questa form
// ********************************************************************************
WebForm.prototype.OnMouseOverObj= function(evento, obj)
{ 
  if (!this.Realized)
    return;
  //
  // Se il mouse e' sopra uno degli oggetti della Form List
  if ((obj == this.FLBox || obj == this.FLImg || obj == this.FLCaption) && RD3_DesktopManager.WebEntryPoint.HasSideMenu())
  {
    if (RD3_DesktopManager.WebEntryPoint.ActiveForm)
    {
      var activeFormId = RD3_DesktopManager.WebEntryPoint.ActiveForm.Identifier;
      //
      // Imposto la classe a seconda se sono la form attiva o meno
      if (activeFormId != this.Identifier)
      {
        this.FLCaption.className = "form-list-caption-hl";
        this.FLImg.className = "form-list-img-hl";
        //
        if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
          RD3_Glb.AddClass(this.FLImg, "form-list-img-hl-right");
      }
    }
  }
  //
  // Se e' un bottone della toolbar, uso highlight toolbar
  if (obj.parentNode == this.CaptionBox)
  {
    RD3_Glb.AddClass(obj, "form-caption-hover");
  }
  //
  // Se e' la form list del popup, la evidenzio
  if ((obj==this.PopupTextCell || obj==this.PopupText))
  {
    RD3_Glb.AddClass(this.PopupTextCell, "popup-menu-hover");
  }
}


// ********************************************************************************
// Gestore evento di mouse out su uno degli oggetti di questa form
// ********************************************************************************
WebForm.prototype.OnMouseOutObj= function(evento, obj)
{ 
  if (!this.Realized)
    return;
  //
  // Se il mouse era sopra uno degli oggetti della Form List
  if ((obj == this.FLBox || obj == this.FLImg || obj == this.FLCaption) && RD3_DesktopManager.WebEntryPoint.HasSideMenu())
  {
    if (RD3_DesktopManager.WebEntryPoint.ActiveForm)
    {
      var activeFormId = RD3_DesktopManager.WebEntryPoint.ActiveForm.Identifier;
      //
      // Imposto la classe a seconda se sono la form attiva o meno
      if (activeFormId != this.Identifier)
      {
        var mt = RD3_DesktopManager.WebEntryPoint.MenuType;
        this.FLCaption.className = "form-list-caption";
        this.FLImg.className = "form-list-img";
        //
        if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_RIGHTSB)
          RD3_Glb.AddClass(this.FLImg, "form-list-img-right");
      }
    }
  }
  //
  // Se e' un bottone della toolbar, uso highlight toolbar
  if (obj.parentNode == this.CaptionBox)
  {
    RD3_Glb.RemoveClass(obj, "form-caption-hover");
    RD3_Glb.RemoveClass(obj, "form-caption-press");
  }
  //
  // Se e' la form list del popup, la spengo
  if (obj==this.PopupTextCell)
  {
    RD3_Glb.RemoveClass(this.PopupTextCell, "popup-menu-hover");
  }
  //
  if (RD3_Glb.IsMobile())
  {
    if (obj == this.BackButton || obj == this.BackButtonImg)
    {
      RD3_Glb.RemoveClass(this.BackButton, "panel-button-press");
      RD3_Glb.RemoveClass(this.BackButtonImg, "panel-button-press");
    }
  }
}


// ********************************************************************************
// Gestore evento di mouse down su uno degli oggetti di questa form
// ********************************************************************************
WebForm.prototype.OnMouseDownObj= function(evento, obj)
{ 
  // Se il mouse e' sopra uno degli oggetti della Form List
  if (obj == this.FLBox || obj == this.FLImg || obj == this.FLCaption)
  {
    
  }
  //
  // Se e' un bottone della toolbar, uso highlight toolbar
  if (obj.parentNode == this.CaptionBox)
  {
    RD3_Glb.AddClass(obj, "form-caption-press");
  }
  //
  if (RD3_Glb.IsMobile())
  {
    // Se viene cliccato il backbutton devo fare l'hilight anche della punta della freccia
    if (obj == this.BackButton || obj == this.BackButtonImg)
    {
      RD3_Glb.AddClass(this.BackButton, "panel-button-press");
      RD3_Glb.AddClass(this.BackButtonImg, "panel-button-press");
    }
  }
}


// ********************************************************************************
// Funzioni per il reperimento degli stili visuali
// ********************************************************************************
WebForm.prototype.HasCaption= function()
{ 
  return this.VisualFlags & 0x1;
}

WebForm.prototype.CanResize= function()
{ 
  return (this.VisualFlags & 0x2) && ((this.Modal && this.WindowState == RD3_Glb.WS_NORMAL && this.BorderType == RD3_Glb.BORDER_THICK) || this.Docked);
}

WebForm.prototype.CanMove= function()
{ 
  return this.VisualFlags & 0x4 && this.Modal && this.WindowState == RD3_Glb.WS_NORMAL;
}

WebForm.prototype.HasMinButton= function()
{ 
  return this.VisualFlags & 0x8 && this.Modal && !this.IsModalPopup() && this.ToolbarPosition!=0;
}

WebForm.prototype.HasMaxButton= function()
{ 
  return (this.VisualFlags & 0x10) && this.Modal && this.ToolbarPosition!=0;
}

WebForm.prototype.HasCloseButton= function()
{ 
  return (this.VisualFlags & 0x20) && this.ToolbarPosition!=0;
}

WebForm.prototype.HasConfirmButton= function()
{ 
  return (this.VisualFlags & 0x40) && this.IsModalPopup() && this.ToolbarPosition!=0;
}

WebForm.prototype.HasHelpButton= function()
{ 
  return (this.VisualFlags & 0x80) && RD3_DesktopManager.WebEntryPoint.HelpFileBox.style.display!="none" && this.ToolbarPosition!=0;
}

WebForm.prototype.HasDebugButton= function()
{ 
  return (this.VisualFlags & 0x100) && RD3_DesktopManager.WebEntryPoint.DebugImageBox.style.display!="none" && this.ToolbarPosition!=0;
}

WebForm.prototype.HasIcon= function()
{ 
  return (this.VisualFlags & 0x200);
}

WebForm.prototype.ShowMessages= function()
{ 
  return (this.VisualFlags & 0x400);
}

WebForm.prototype.HasBackButton= function()
{ 
  return (this.VisualFlags & 0x800) && RD3_Glb.IsMobile();
}

WebForm.prototype.ShowFormList = function()
{ 
  return (this.VisualFlags & 0x1000);
}

// ********************************************************************************
// Imposta la visibilita' dei bottoni della toolbar
// ********************************************************************************
WebForm.prototype.SetButtonVisibility= function(value)
{
  if (this.CloseBtn)
    this.CloseBtn.style.visibility = value;
  if (this.ConfirmBtn)
    this.ConfirmBtn.style.visibility = value;
  if (this.MinBtn)
    this.MinBtn.style.visibility = value;
  if (this.MaxBtn)
    this.MaxBtn.style.visibility = value;
  if (this.HelpBtn)
    this.HelpBtn.style.visibility = value;
  if (this.DebugBtn)
    this.DebugBtn.style.visibility = value;
  if (this.ImgIcon)
    this.ImgIcon.style.visibility = value;
}


// ********************************************************************************
// Prende la toolbar specificata dal parametro cmd (e' un oggetto Command)
// e la mette al posto giusto nella caption
// ********************************************************************************
WebForm.prototype.AttachToolbar= function(cmd)
{
  if (!cmd.MyToolBox)
    return;
  //
  if (cmd.MyToolBox.parentNode)
  {
    // La toolbar fa gia' parte della mia caption: non c'e' bisogno che me la riprenda...
    if (cmd.MyToolBox.parentNode == this.CaptionBox)
      return;
    //
    cmd.MyToolBox.parentNode.removeChild(cmd.MyToolBox);
  }
  //
  // In base al tipo di toolbar, vediamo dove metterla
  switch(this.ToolbarPosition)
  {
    case RD3_Glb.FORMTOOL_NONE:
    case RD3_Glb.FORMTOOL_LEFT:
    case RD3_Glb.FORMTOOL_RIGHT:
      this.CaptionBox.insertBefore(cmd.MyToolBox, this.CaptionTxt.nextSibling);
    break;
    
    case RD3_Glb.FORMTOOL_DISTRIB:
      this.CaptionBox.insertBefore(cmd.MyToolBox, this.CaptionTxt);
    break;
  }
  //
  // Mi hanno dato la toolbar... me la adatto
  this.AdaptToolbar = true;
}


// *********************************************************
// Timer globale
// *********************************************************
WebForm.prototype.Tick = function()
{
  var n = this.Frames.length;
  for(var i=0; i<n; i++)
  {
    var f = this.Frames[i];
    if (f && f.Realized && f.Visible)
      f.Tick();
  }
}


// ********************************************************************************
//  Creo la entry della form list del menu' popup
// ********************************************************************************
WebForm.prototype.RealizeFormListPopup = function(popup, n)
{ 
  // Non creo la formlist se docked o modal
  if (!this.HasFormList())
    return;
  //
  // Creo il div della linea del menu'
  this.PopupItemBox = document.createElement("tr");
  this.PopupItemBox.setAttribute("id", this.Identifier+":tr");
  this.PopupItemBox.className = "popup-menu-item";
  this.PopupItemBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnFLClick', ev)");
  //
  // Creo la cella dell'icona
  this.PopupIconCell = document.createElement("td");
  this.PopupIconCell.setAttribute("id", this.Identifier+":tdi");
  this.PopupIconCell.className = "popup-cell-icon";
  //
  // Creo l'img dell'icona
  this.PopupImageBox = document.createElement("img");
  this.PopupImageBox.setAttribute("id", this.Identifier+":pm");
  this.PopupImageBox.className = "popup-menu-image";
  if (this.Image!="")
    this.PopupImageBox.src = RD3_Glb.GetImgSrc("images/" + this.Image);
  else
    this.PopupImageBox.style.display = "none";
  //
  // Creo la cella del testo
  this.PopupTextCell = document.createElement("td");
  this.PopupTextCell.setAttribute("id", this.Identifier+":txt");
  this.PopupTextCell.className = "popup-cell-text";
  //
  // Creo la linea di testo
  this.PopupText = document.createElement("span");
  this.PopupText.setAttribute("id", this.Identifier+":cap");
  this.PopupText.className = "popup-menu-text";
  this.PopupText.innerHTML = "<u>"+n+"</u>&nbsp;"+RD3_Glb.RemoveTags(this.Caption);  
  //
  // Creo la struttura
  this.PopupIconCell.appendChild(this.PopupImageBox);
  this.PopupTextCell.appendChild(this.PopupText);
  this.PopupItemBox.appendChild(this.PopupIconCell);
  this.PopupItemBox.appendChild(this.PopupTextCell);
  popup.appendChild(this.PopupItemBox);
}


// ********************************************************************************
//  Torna true se questa form e' parte della form list
// ********************************************************************************
WebForm.prototype.HasFormList = function()
{ 
  // Modali, docked e sub-form non hanno mai la voce nella form list
  if (this.IsModalPopup() || this.Docked || this.SubFormObj)
    return false;
  //
  return this.ShowFormList();
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
WebForm.prototype.GetTooltip = function(tip, obj)
{
  var ok = false;
  if (obj == this.CloseBtn)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_ChiudiForm);
    tip.SetText((this.Modal ? RD3_ServerParams.ModalChiudiForm : RD3_ServerParams.ChiudiForm) + RD3_KBManager.GetFKTip(RD3_ClientParams.FKCloseForm));
    ok = true;
  }
  else if (obj == this.ConfirmBtn)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_ModalConfirm);
    tip.SetText(RD3_ServerParams.ModalConfirm);
    ok = true;
  }
  else if (obj == this.FLCaption || obj == this.FLImg || obj == this.FLBox)
  {
    // Solo per i TaskBar
    if (RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
    {
      tip.SetImage("");
      tip.SetText(RD3_Glb.RemoveTags(this.Caption));
      tip.SetObj(this.FLBox);
      tip.SetAnchor(RD3_Glb.GetScreenLeft(this.FLBox) + 8, RD3_Glb.GetScreenTop(this.FLBox));
      return true;
    }
  }
  //
  if (ok)
  {
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + ((obj.offsetWidth+4)/2), RD3_Glb.GetScreenTop(obj));
    tip.SetPosition(0);
    return true;
  }
  //
  return false;
}

// **********************************************************************
// La form per ora non vuole essere droppata, ma se mai spostata...
// **********************************************************************
WebForm.prototype.GetDropList= function()
{
  return null;  
}


// ********************************************************************************
// Su quali oggetti e' possibile droppare?
// ********************************************************************************
WebForm.prototype.ComputeDropList = function(list,dragobj)
{
  // Se non sono stato realizzato... o non posso... niente DropList
  if (!this.Realized)
    return;
  //
  // Calcolo form drag obj
  var df = null;
  if (dragobj.GetParentFrame)
  {
    df = dragobj.GetParentFrame();
    if (df)
      df = df.WebForm;
  }
  //
  // Anch'io voglio essere droppabile perche' sono popup e quindi
  // devo impedire che il drag su di me passi sotto
  if (this.Modal && !this.IsModalPopup())
  {
    list.push(this);
    //
    // Calcolo le coordinate assolute...
    var o = this.FormBox;
    this.AbsLeft = RD3_Glb.GetScreenLeft(o,true);
    this.AbsTop = RD3_Glb.GetScreenTop(o,true);
    this.AbsRight = this.AbsLeft + o.offsetWidth - 1;
    this.AbsBottom = this.AbsTop + o.offsetHeight - 1;  
  }  
  //
  // Ora i frames
  var m = this.Frames.length;
  for(var j=0; j<m; j++)
  {
    var fr = this.Frames[j];
    var ok = fr.CanDrop || df==fr.WebForm;
    if (fr.ComputeDropList && ok)
      fr.ComputeDropList(list,dragobj);
  }
}


// *********************************************************
// E' arrivato un click su questa form...
// Vediamo se sono la form attiva
// *********************************************************
WebForm.prototype.OnMouseDownForm = function(evento)
{
  // io non sono la form attiva... ora lo faccio
  if (RD3_DesktopManager.WebEntryPoint.ActiveForm!=this && !this.Docked)
  {
    this.OnFLClick(evento);
  }
}


// *********************************************************
// Aggiunge gli oggetti alla toolbar della form
// in base alla posizione. La funzione e' stata estratta per
// facilitarne una eventuale customizzazione
// *********************************************************
WebForm.prototype.RealizeToolbar = function()
{
  switch(this.ToolbarPosition)
  {
    case RD3_Glb.FORMTOOL_NONE:
      if (this.ImgIcon) this.CaptionBox.appendChild(this.ImgIcon);
      if (this.CaptionTxt) this.CaptionBox.appendChild(this.CaptionTxt);
    break;
    
    case RD3_Glb.FORMTOOL_LEFT:
      if (this.ConfirmBtn) this.CaptionBox.appendChild(this.ConfirmBtn);
      if (this.CloseBtn) this.CaptionBox.appendChild(this.CloseBtn);
      if (this.MaxBtn) this.CaptionBox.appendChild(this.MaxBtn);
      if (this.MinBtn) this.CaptionBox.appendChild(this.MinBtn);
      if (this.HelpBtn) this.CaptionBox.appendChild(this.HelpBtn);
      if (this.DebugBtn) this.CaptionBox.appendChild(this.DebugBtn);
      if (this.ImgIcon) this.CaptionBox.appendChild(this.ImgIcon);
      if (this.CaptionTxt) this.CaptionBox.appendChild(this.CaptionTxt);
    break;
    
    case RD3_Glb.FORMTOOL_RIGHT:
    case RD3_Glb.FORMTOOL_DISTRIB:
      if (RD3_Glb.IsMobile())
      {
        if (this.CloseBtn) this.CaptionBox.appendChild(this.CloseBtn);
        if (this.CaptionTxt) this.CaptionBox.appendChild(this.CaptionTxt);
        if (this.ConfirmBtn) this.CaptionBox.appendChild(this.ConfirmBtn);
      }
      else
      {
        if (this.ImgIcon) this.CaptionBox.appendChild(this.ImgIcon);
        if (this.CaptionTxt) this.CaptionBox.appendChild(this.CaptionTxt);
        if (this.DebugBtn) this.CaptionBox.appendChild(this.DebugBtn);
        if (this.HelpBtn) this.CaptionBox.appendChild(this.HelpBtn);
        if (this.MinBtn) this.CaptionBox.appendChild(this.MinBtn);
        if (this.MaxBtn) this.CaptionBox.appendChild(this.MaxBtn);
        if (this.CloseBtn) this.CaptionBox.appendChild(this.CloseBtn);
        if (this.ConfirmBtn) this.CaptionBox.appendChild(this.ConfirmBtn);
      }
    break;
  }
}


// ********************************************************************************
// Evento di inizio tocco sulla form (chiamato solo se si puo' scrollare)
// ********************************************************************************
WebForm.prototype.OnTouchStart = function(e)
{ 
  // Memorizzo la posizione
  this.TouchStartX = e.targetTouches[0].clientX;
  this.TouchStartY = e.targetTouches[0].clientY;
  this.TouchOrgX   = e.targetTouches[0].clientX;
  this.TouchOrgY   = e.targetTouches[0].clientY;
  //
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
  this.TouchTimes  = new Array();
  this.TouchPosY   = new Array();
  this.TouchPosX   = new Array();
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  //
  this.ClearTouchScrollTimer();
}


// ********************************************************************************
// Evento di movimento del ditino sulla form (chiamato solo se si puo' scrollare)
// ********************************************************************************
WebForm.prototype.OnTouchMove = function(e)
{ 
  var xd = e.targetTouches[0].clientX - this.TouchStartX;
  var yd = e.targetTouches[0].clientY - this.TouchStartY;
  var tt = new Date();
  //
  // Memorizzo la nuova posizione
  this.TouchStartX = e.targetTouches[0].clientX;
  this.TouchStartY = e.targetTouches[0].clientY;
  //
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
    return false;  
  //
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  if (this.TouchTimes.length>3)
  {
    this.TouchTimes.shift();
    this.TouchPosY.shift();
    this.TouchPosX.shift();
  }
  //
  // Allora posso spostare il frames box se avesse bisogno delle scrollbar
  this.FramesBox.scrollLeft -= xd;
  this.FramesBox.scrollTop -= yd;
  //
  return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
WebForm.prototype.OnTouchEnd = function(e)
{ 
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
    return false;    
  //
  if (this.TouchTimes.length==3)
  {
    // Se stavo spostando il content box, verifico le velocita'
    var dt = this.TouchTimes[2]-this.TouchTimes[0];
    var dx = this.TouchPosX[0]-this.TouchPosX[2];
    var dy = this.TouchPosY[0]-this.TouchPosY[2];
    if (new Date()-this.TouchTimes[2]<100 && dt>0)
    {
      var vy = dy / dt;
      var vx = dx / dt;
      //
      // Attivo il timer e passo i dati
      if (Math.abs(vx)>0.3 || Math.abs(vy)>0.3)
      {
        this.TouchScrollTimerId = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TouchScrollTimer', null, ["+vx+","+vy+",0])", 10);
      }
    }
  }
  //
  this.TouchStartX=-1;
  this.TouchStartY=-1;
  //
  return false;
}


// ********************************************************************************
// Gestisce lo scroll via touch del pannello.
// v e' la velocita' di scroll in ms, il segno indica la direzione
// n e' il numero di volte che e' stata eseguita la funzione
// ********************************************************************************
WebForm.prototype.TouchScrollTimer = function(dummy, ap)
{ 
  // Caso scrolling content box
  if (ap.length==3)
  {
    var vx = ap[0];
    var vy = ap[1];
    var n  = ap[2];
    //
    this.FramesBox.scrollLeft += vx*10;
    this.FramesBox.scrollTop += vy*10;
    //
    if (n<40)
    {
      vx = vx*0.97;
      vy = vy*0.97;
      this.TouchScrollTimerId = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TouchScrollTimer', null, ["+vx+","+vy+","+(n+1)+"])", 10);
    }
  }
}


// ********************************************************************************
// Annulla timer di scroll
// ********************************************************************************
WebForm.prototype.ClearTouchScrollTimer = function()
{
  if (this.TouchScrollTimerId>0)
  {
    window.clearTimeout(this.TouchScrollTimerId);
    this.TouchScrollTimerId=0;
    this.TouchScroll=0;
  }
}


//**********************************************************
// Gestione Resize Docked: funzioni per gestire il tipo di 
// resize consentito
//**********************************************************
WebForm.prototype.CanResizeW = function()
{
  if (this.Docked && (this.DockType==RD3_Glb.FORMDOCK_TOP || this.DockType==RD3_Glb.FORMDOCK_BOTTOM))
    return false;
  else
    return true;
}

WebForm.prototype.CanResizeH = function()
{
  if (this.Docked && (this.DockType==RD3_Glb.FORMDOCK_LEFT || this.DockType==RD3_Glb.FORMDOCK_RIGHT))
    return false;
  else
    return true;
}

WebForm.prototype.CanResizeL = function()
{
  if (this.Docked && this.DockType!=RD3_Glb.FORMDOCK_RIGHT)
    return false;
  else
    return true;
}

WebForm.prototype.CanResizeR = function()
{
  if (this.Docked && this.DockType!=RD3_Glb.FORMDOCK_LEFT)
    return false;
  else
    return true;
}

WebForm.prototype.CanResizeT = function()
{
  if (this.Docked && this.DockType!=RD3_Glb.FORMDOCK_BOTTOM)
    return false;
  else
    return true;
}

WebForm.prototype.CanResizeD = function()
{
  if (this.Docked && this.DockType!=RD3_Glb.FORMDOCK_TOP)
    return false;
  else
    return true;
}

WebForm.prototype.SetPage = function(page, title)
{
  if (!this.WelcomeBox)
  {
    this.WelcomeBox = document.createElement("iframe");
    this.WelcomeBox.className = "welcome-container";
    this.WelcomeBox.frameBorder = 0;
    this.MessagesBox.style.display = "none";
    this.FormBox.appendChild(this.WelcomeBox);
    this.SetActive(true);
  }
  this.WelcomeBox.src = page;
  this.SetWebCaption(title);
}

WebForm.prototype.Host = function(content, header)
{
  this.HostPage = true;
  //
  if (this.CaptionBox && this.CaptionBox.parentNode)
    this.CaptionBox.parentNode.removeChild(this.CaptionBox);
  //
  this.CaptionBox = header;
  this.FormBox.appendChild(header);
  this.FormBox.appendChild(content);
  this.SetActive(true);
  //
  this.ContentObj = content;
}

// ********************************************************************************
// Ritorna la prima toolbar di form o di frame per infilare dentro dei bottoni
// flref - forza l'aggiornamento della toolbar
// ********************************************************************************
WebForm.prototype.GetFirstToolbar = function(flref)
{
  if (this.HasCaption())
    return this.CaptionBox;
  //
  // Cerco un frame con una toolbar
  for (var i=0; i<this.Frames.length; i++) 
  {
    var fr = this.Frames[i];
    if (fr instanceof TabbedView)
    {
      if (fr.SelectedPage>=0 && !fr.Tabs[fr.SelectedPage].Content.OnlyContent)
      {
        var frSel = fr.Tabs[fr.SelectedPage].Content;
        //
        // Se richiesto chiedo alla toolbar di aggiornarsi
        if (flref && frSel instanceof IDPanel && frSel.Realized)
          frSel.RefreshToolbar = true;
        return frSel.ToolbarBox;
      }
    }
    else if (!fr.ChildFrame1 && !fr.OnlyContent)
    {
      if (flref && fr instanceof IDPanel && fr.Realized)
        fr.RefreshToolbar = true;
      return fr.ToolbarBox;
    }
  }
}


// ********************************************************************************
// Una popover si sta chiudendo
// ********************************************************************************
WebForm.prototype.OnAutoClosePopup = function(ev)
{
  this.OnClose(window.event);
  return false;
}


// ********************************************************************************
// Ritorna l'oggetto DOM della toolbar custom attaccata a questa form
// ********************************************************************************
WebForm.prototype.GetCustomToolbar= function()
{ 
  if (!this.CaptionBox)
    return;
  //
  var obj = this.CaptionBox.firstChild;
  while (obj)
  {
    if (RD3_Glb.HasClass(obj,"toolbar-form-container"))
      return obj;
    obj = obj.nextSibling;
  }
}

// ********************************************************************************
// Torna true se la messagebar e' effettivamente visibile a video
// ********************************************************************************
WebForm.prototype.MessageBarOpen= function()
{
  return this.MessageBarIsOpen;
}

// ********************************************************************************
// Apre la message bar per un certo numero di messaggi in modo animato
// ********************************************************************************
WebForm.prototype.OpenMessageBar= function(num)
{
  // Quando chiudo rimuovo anche i messaggi temporanei
  this.MessageBarIsOpen = false;
  if (num<0)
  {
    // Rimuovo i messaggi temporanei
    num = 0;
    var old = this.Messages.length;
    this.RemoveTemporaryMessages();
    //
    // Se e' cambiato il numero, aggiusto l'altezza della message bar
    if (old!=this.Messages.length)
    {
      var newh = 0;
      for (var i=0; i<this.Messages.length; i++)
        newh += (this.Messages[i].Realized ? this.Messages[i].MyBox.offsetHeight : 0);
      if (newh==0)
      {
        var sc = "var m = document.getElementById('"+this.Identifier+":msg');";
        sc+= " if (m) { m.style.visibility = 'hidden'; }";
        window.setTimeout(sc,500);
      }
      else
      {
        this.MessagesBox.style.visibility = "";
        this.MessagesBox.style.height = newh+"px";
      }
    }
  }
  //
  // Calcolo la dimensione da far vedere.
  var newpos = -this.MessagesBox.offsetHeight+(this.Messages.length==0?0:num*32+8);
  if (newpos>0)
  newpos = 0;
  if (num>0 && this.Messages.length>0)
  this.MessageBarIsOpen = true;
  //
  var sc = "var m = document.getElementById('"+this.Identifier+":msg');";
  sc+= " if (m) { RD3_Glb.SetTransform(m, 'translate3d(0px,"+newpos+"px,0px)'); }";
  window.setTimeout(sc,50);
  //
  this.OnMessageBarMouseUp();
}


// ********************************************************************************
// Gestione movimento message bar
// ********************************************************************************
WebForm.prototype.OnMessageBarMouseMove= function(ev)
{
  if (this.MessageBarStartPos>0)
  {
    var y = RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true) ? ev.targetTouches[0].clientY : ev.clientY;
    var d = y - this.MessageBarStartPos;
    if (d>2)
      this.OpenMessageBar(100);
    if (d<-2)
      this.OpenMessageBar(-1);
  }
}

WebForm.prototype.OnMessageBarMouseDown= function(ev)
{
  this.MessageBarStartPos = RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true) ? ev.targetTouches[0].clientY : ev.clientY;
  if (this.MessageBarTimerId!=0)
  {
    window.clearTimeout(this.MessageBarTimerId);
    this.MessageBarTimerId = 0;
  }
}

WebForm.prototype.OnMessageBarMouseUp= function(ev)
{
  this.MessageBarStartPos = null;
}


WebForm.prototype.RemoveTemporaryMessages= function()
{
  // Rimuovo i messaggi temporanei
  for (var i=this.Messages.length-1; i>=0; i--)
  {
    if (this.Messages[i].Temporary)
    {
      // Se il messaggio riguarda un'altra richiesta lo elimino
      if (this.Messages[i].Request != RD3_DesktopManager.CurrentRequest && !RD3_DesktopManager.SkipClearTempMessages)
      {
        if (i==0)
        {
          // Sono l'ultimo messaggio temporaneo.. devo verificare se ci sono altri messaggi dopo di me..
          var l = this.Messages.length;
          if (l==1 && this.HasInfoMessages() && !RD3_Glb.IsMobile())
          {
            // Non ci sono altri messaggi ma l'altezza rimane fissa: 
            // devo fare il fading e non sparire di colpo
            var fx = new GFX("lastmessage", true, this.Messages[i], this.Animating, null, this.LastMessageAnimDef);
            RD3_GFXManager.AddEffect(fx);
            //
            // Tolgo il messaggio dall'array: alla fine del fading verra' fatto l'unrealize..
            this.Messages.splice(i,1);
          }
          else
          {
            this.Messages[i].Unrealize();
            this.Messages.splice(i,1);
          }
        }
        else
        {
          this.Messages[i].Unrealize();
          this.Messages.splice(i,1);
        }
      }
    }
  }
}


// ********************************************************************************
// Gestore evento di click sulla caption
// ********************************************************************************
WebForm.prototype.OnCaptionClick= function(evento)
{
  // mostra i messaggi oppure
  // fa tornare in cima il contenuto
  if (this.Messages.length>0)
  {
    this.OpenMessageBar(100);
  }
  else
  {
    var scr;
    //
    // Cerco il primo frame con un IDScroll
    for (var i=0; i<this.Frames.length; i++) 
    {
      var fr = this.Frames[i];
      if (fr instanceof TabbedView)
      {
        if (fr.SelectedPage>=0 && fr.Tabs[fr.SelectedPage].Content.IDScroll)
        {
          scr =  fr.Tabs[fr.SelectedPage].Content.IDScroll;
          break;
        }
      }
      else if (!fr.ChildFrame1 && fr.IDScroll)
      {
        scr = fr.IDScroll;
        break;
      }
    }
    //
    if (scr)
      scr.GoTop();
  }
}

// ********************************************************************************
// Restituisce la Form Master (io oppure il vertice della gerarchia delle SubForm)
// ********************************************************************************
WebForm.prototype.GetMasterForm= function()
{ 
  if (this.SubFormObj == null)
    return this;
  //
  if (this.SubFormObj instanceof BookBox)
    return this.SubFormObj.ParentPage.ParentBook.WebForm.GetMasterForm();
  if (this.SubFormObj instanceof SubForm)
    return this.SubFormObj.WebForm.GetMasterForm();
  //
  return this;
}


// ********************************************************************************
// Abilita o disabilita le IDScroll della form per questa app mobile
// ********************************************************************************
WebForm.prototype.EnableIDScroll= function(stato)
{ 
  for (var i=0; i<this.Frames.length; i++) 
  {
    var fr = this.Frames[i];
    if (fr instanceof TabbedView)
    {
      if (fr.SelectedPage>=0 && fr.Tabs[fr.SelectedPage].Content.IDScroll)
        fr.Tabs[fr.SelectedPage].Content.IDScroll.Enabled = stato;
    }
    else if (!fr.ChildFrame1 && fr.IDScroll)
    {
      fr.IDScroll.Enabled = stato;
    }
  }
}

//********************************************************************************
// Gestione del bottone back per Android
//********************************************************************************
WebForm.prototype.OnBackButton = function() 
{
  // Se c'e' a video la caption di un pannello allora bisogna controllare i frame
  if (this.HasCaption() == 0)
  {
    var firsttoolb = this.GetFirstToolbar(false);
    for (var i=0; i<this.Frames.length; i++) 
    {
      var fr = this.Frames[i];
      //
      // Se e' una Tabbed prendo la sua pagina selezionata (se presente).
      if (fr instanceof TabbedView)
      {
        if (fr.SelectedPage>=0 && !fr.Tabs[fr.SelectedPage].Content.OnlyContent)
          fr = fr.Tabs[fr.SelectedPage].Content;
      }
      //
      if (fr instanceof IDPanel)
      {
        // Se il pannello ha il bottone "torna alla lista", torno alla lista
        if (fr.FormListButtonCnt && fr.FormListButtonCnt.style.display=="" && fr.HasList)
        {
          fr.OnToolbarClick({},'list');
          return true;
        }
        // Se il pannello e' in dettaglio sbloccato e bloccabile, non faccio nulla
        if (fr.PanelMode==RD3_Glb.PANEL_FORM && !fr.Locked && fr.Lockable)
          return true;
      }
      //
      // Albero che visualizza nodi innestati, si torna al nodo precedente.
      if (fr instanceof Tree)
      {
        if (fr.ActiveNode && fr.ActiveNode.BackImg && fr.ActiveNode.BackImg.style.display=="")
        {
          fr.ActiveNode.OnBack({});
          return true;
        }
      }
      //
      // Verifico se il backbutton della Form e' attaccato e mostrato nel pannello
      if (this.HasBackButton() && firsttoolb==fr.ToolbarBox)
      {
        var m = RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton;
        var bb = this.BackButtonCnt;
        //
        // In questo caso sono un BackButton
        if (bb && bb.parentNode==fr.ToolbarBox && bb.style.display=="")
        {
          this.OnClose({});
          return true;   
        }
        else if (RD3_Glb.IsSmartPhone() && m && m.parentNode==fr.ToolbarBox && m.style.display=="")
        {
          // Qui sono il menu-button
          RD3_DesktopManager.WebEntryPoint.CmdObj.OnMenuButton();
          return true;  
        }
      }
    }
  }
  //
  // Se la form mostra il bottone "torna indiero", si chiude
  if (this.HasBackButton() && this.BackButtonTxt && this.BackButtonTxt.length > 0)
  {
    this.OnClose({});
    return true;   
  }
  //
  // Se la form mostra il bottone "chiudi" ed e' modale o popup, si chiude
  if (this.Modal != 0 && this.HasCloseButton() && this.CloseBtn && this.CloseBtn.style.display=="")
  {
    this.OnClose({});
    return true;    
  }
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
WebForm.prototype.OnAdaptRetina = function(w, h, par)
{
  if (this.ImgIcon)
  {
    this.ImgIcon.width = w;
    this.ImgIcon.height = h;
    this.ImgIcon.style.display = "";
  }
  if (this.FLImg && this.FLImg.tagName=="IMG")
  {
    this.FLImg.width = w;
    this.FLImg.height = h;
    this.FLImg.style.display = "";
  }
}


WebForm.prototype.AttachTo = function (width, height) 
{
  if (!this.PopupFrame || !this.RelatedTo)
    return;
  //
  var obj = RD3_DesktopManager.ObjectMap[this.RelatedTo];
  var dobj = (obj && obj.GetDOMObj) ? obj.GetDOMObj((obj.IsToolbar) ? "toolbar" : "") : null;
  //
  // Il server manda i val: riferendosi alle righe visibili del pannello, quindi se la riga base e' 50 comunque ci arriva un val:2 per la seconda riga, invece di un val:52.
  // Questo da' problemi solo se si fa il refresh: facendolo si cancellano i valori vecchi e se il pannello e' scrollato poi non si trova niente.. 
  // In questo caso dobbiamo provare a risalire al pannello, vedere in che posizione si trova e poi provare a cercare il valore giusto..
  if (!obj && this.RelatedTo.substring(0, 4) === "val:") 
  {
    var components = this.RelatedTo.split(":");
    if (components.length == 5) {
      var pan = RD3_DesktopManager.ObjectMap[("pan:" + components[3] + ":" + components[4])];
      var fld = RD3_DesktopManager.ObjectMap[("fld:" + components[2] + ":" + components[3] + ":" + components[4])];
      if (pan && fld) {
        obj = RD3_DesktopManager.ObjectMap[("val:" + (pan.ActualPosition + parseInt(components[1]) - 1) + ":" + components[2] + ":" + components[3] + ":" + components[4])];
        //
        // Non posso usare GetDOMObj perche' e' fatta per essere chiamata solo per i PValue da 0 a VisibleRows, quindi devo essere io 
        // a cercare nel campo la cella giusta (solo se sono in LISTA + LISTLIST
        if (pan.PanelMode != RD3_Glb.PANEL_FORM && fld.ListList)
          dobj = fld.PListCells[parseInt(components[1]) - 1].GetDOMObj();
      }
    }
  }
  //
  // Se non ho trovato l'oggetto nella mappa provo a cercarlo nel DOM
  if (!obj) 
  {
    dobj = document.getElementById(this.RelatedTo);
    if (dobj)
      obj = RD3_KBManager.GetObject(dobj);
  }
  //
  if (dobj) 
  {
    // Tengo conto anche di eventuali offset dovuti alle scrollbar, chiedendoli all'oggetto di modello
    // (per ora AccountOverFlowX e AccountOverFlowY ce li ha solo il TreeNode che li usava per il D&D)
    var ovx = obj.AccountOverFlowX ? obj.AccountOverFlowX() : 0;
    var ovy = obj.AccountOverFlowY ? obj.AccountOverFlowY() : 0;
    //
    var x = RD3_Glb.GetScreenLeft(dobj) - ovx;
    var y = RD3_Glb.GetScreenTop(dobj) - ovy;
    //
    // Se sforo a destra allora provo a mettermi sotto a sinistra
    if (x + width > document.body.offsetWidth)
      x = x + dobj.offsetWidth - width;
    //
    // Interpreto la direzione
    var nwY;
    switch (this.RelatedPlacement) 
    {
      case 0: // Below
        nwY = y + dobj.offsetHeight;
        //
        // Se sforo sotto allora provo a cambiare tutto e mettermi sopra
        if (nwY + height > document.body.offsetHeight)
          nwY = y - height;
        y = nwY;
        break;

      case 1: // Above
        var nwY = y - height;
        //  
        // Se sforo sopra allora provo a cambiare tutto e mettermi sotto
        if (nwY < 0)
          nwY = y + dobj.offsetHeight;
        //
        y = nwY;
        break;
    }
    //
    this.SetFormLeft(x);
    this.SetFormTop(y);
  }
};


// ******************************************************************
// Memorizza o ripristina le posizione delle scrollbar
// usata quando una modale viene riportata in primo piano per non 
// perdere il posizionamento delle scrollbar
//
// vedi popupframe::BringToFront
// ******************************************************************
WebForm.prototype.SaveScrollPos = function () 
{
  for (var i=0; i < this.Frames.length; i++)
    this.Frames[i].SaveScrollPos();
}


WebForm.prototype.SetScrollPos = function () 
{
  for (var i = 0; i < this.Frames.length; i++)
    this.Frames[i].SetScrollPos();
}

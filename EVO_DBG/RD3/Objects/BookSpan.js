// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe BookSpan: Rappresenta uno span contenuto
// in una box del book
// ************************************************

function BookSpan(pbox)
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = null;             // Identificatore dello span (univoco)
  this.Text = "";                     // Testo da mostrare (o path dell'immagine se l'ha)
  this.Value = "";                    // Valore dello span (in formato stringa comunque)
  this.Tooltip = "";                  // Tooltip da mostrare
  this.VisStyle = null;               // Visual Style associato a questa box
  this.DataType = 5;                  // Tipo di dati (default = DT_CHAR)
  this.MaxLen = 255;                  // Lunghezza massima (default = per campi carattere)
  this.Scale = 0;                     // Numero di decimali
  this.Visible = true;                // Span visibile?
  this.Enabled = false;               // Span abilitato?
  this.Stretch = RD3_Glb.STRTC_AUTO;  // Tipo di stretch da applicare all'immagine
  this.MimeType = "";                 // Tipo di contenuto BLOB
  this.HasImage = false;              // Span con immagine BLOB?
  this.IconImage = "";                // Icona da mostrare come parte della lista valori?
  this.ValueList = null;              // Lista valori per questo span
  this.ValueListIdx = -1;             // L'indice del valore attuale nella value list
  //
  this.BackColor = ""; // Colore di background
  this.ForeColor = ""; // Colore di foreground
  this.FontMod = "";   // Proprieta' del carattere
  this.Mask = "";      // Mascheratura
  this.Watermark = ""; // Allineamento
  this.ClassName;      // Classe aggiuntiva
  //
  // Oggetti figli di questo nodo
  //
  // Altre variabili di modello...
  this.ParentBox = pbox;        // L'oggetto box in cui e' inserita
  //
  // Variabili per la gestione di questo oggetto
  this.ControlType = RD3_Glb.VISCTRL_AUTO; // Tipo di oggetto
  this.Alternate = false;                  // Devo applicare lo stile alternato?
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo nodo
  this.ChgEventDef = RD3_Glb.EVENT_DEFERRED;  // Il Cambiamento deve essere attivo?
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;  // Se vero, gli oggetti del DOM sono gia' stati creati
  this.Realizing = false; // Se vero, siamo in fase di realizzazione
  //
  // Oggetti visuali relativi al nodo
  this.SpanObj = null;                 // Lo span oppure il campo di input oppure la combo
  this.SpanImg = null;                 // L'IMG contenente l'immagine (se span)
  this.SpanTxt = null;                 // Nodo di testo dello span
  this.SpanCal = null;                 // Immagine del calendario associato ad uno span di tipo data
  //this.HasWatermark=false;           // True se lo span ha il watermark applicato
}


// *******************************************************************
// Inizializza questa box leggendo i dati da un nodo <box> XML
// *******************************************************************
BookSpan.prototype.LoadFromXml = function(node) 
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
      case "val":
      {
        this.ValueList = new ValueList();
        this.ValueList.LoadFromXml(objnode);
        //
        if (this.Realized)
          this.RecreateDOM();
      }
      break;      
    }
  }      
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
BookSpan.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta'
  this.LoadFromXml(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
BookSpan.prototype.LoadProperties = function(node)
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
      case "txt": this.SetText(valore); break;
      case "val": this.SetValue(valore); break;
      case "tip": this.SetTooltip(valore); break;
      case "sty": this.SetVisStyle(valore); break;
      case "dat": this.SetDataType(parseInt(valore)); break;
      case "max": this.SetMaxLen(parseInt(valore)); break;
      case "sca": this.SetScale(parseInt(valore)); break;
      case "vis": this.SetVisible(valore=="1"); break;
      case "ena": this.SetEnabled(valore=="1"); break;
      case "str": this.SetStretch(parseInt(valore)); break;
      case "mim": this.SetMime(valore); break;
      case "him": this.SetHasImage(valore=="1"); break;      
      case "img": this.SetIconImage(valore); break;
      case "idx": this.SetVLIndex(parseInt(valore)); break;
      case "bkc": this.SetBackColor(valore); break;
      case "frc": this.SetForeColor(valore); break;
      case "ftm": this.SetFontMod(valore); break;
      case "msk": this.SetMask(valore); break;
      case "wtk": this.SetWatermark(valore); break;
      case "cln": this.SetClassName(valore); break;
      
      case "chg": this.ChgEventDef = parseInt(valore); break;
      
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
BookSpan.prototype.SetText= function(value) 
{
  if (value!=undefined)
    this.Text = value;
  //
  if (this.Realized)
  {
    if (!this.HasImage && this.MimeType=="")
    {
      if (this.ControlType==RD3_Glb.VISCTRL_COMBO)
      {
        // Se non ho il fuoco, attivo il watermark
        if (!this.HasFocus)
          this.SetWatermark();
        //
        // Se non ho il watermark allora uso il TEXT
        if (!this.HasWatermark)
          this.SpanObj.SetText(this.Text, false);
      }
      else if (this.ControlType==RD3_Glb.VISCTRL_EDIT)
      {
        if (this.Enabled)
        {
          // Se non ho il fuoco, attivo il watermark
          if (!this.HasFocus)
            this.SetWatermark();
          //
          // Se non ho il watermark allora uso il TEXT
          if (!this.HasWatermark)
            this.SpanObj.value = this.Text;
        }
        else
        {
          // Il server ha gia' modificato il testo per comporlo come innerHTML tenendo conto
          // del flag ShowHTML del visual style
          if (this.Text.indexOf("<") != -1 || this.Text.indexOf("&") != -1)
            this.SpanObj.innerHTML = this.Text;
          else
          {
            if (this.SpanObj.innerText !== undefined)
              this.SpanObj.innerText = this.Text;
            else
              this.SpanObj.textContent = this.Text;
          }
          //
          // Se ho un'immagine, la infilo all'inizio
          if (this.SpanImg)
            this.SpanObj.insertBefore(this.SpanImg, this.SpanObj.firstChild);
        }
      }
      else if (this.ControlType==RD3_Glb.VISCTRL_BUTTON)
        this.SpanObj.value = this.Text;
    }
    else if (this.HasImage && this.MimeType != "")
    {
      // E' cambiato il TEXT ed avevo gia' il MimeType.. Spingo un aggiornamento dell'immagine
      this.SetMime();
    }
  }
}

BookSpan.prototype.SetValue= function(value) 
{
  if (value!=undefined)
    this.Value = value;
  //
  if (this.Realized)
  {
    switch (this.ControlType)
    {
      case RD3_Glb.VISCTRL_COMBO:
        this.SpanObj.SetText(this.Value, true);
      break;
      
      case RD3_Glb.VISCTRL_CHECK:
        if (this.Enabled || RD3_Glb.IsMobile())
          this.ValueList.SetCheck(this.SpanObj, this.Value);
        else
          this.SpanObj.checked = (this.ValueListIdx==0); // Il primo valore della lista
      break;
  
      case RD3_Glb.VISCTRL_OPTION:
        this.ValueList.SetOption(this.ParentBox.BoxBox, this.Value);
      break;
    }
  }
}

BookSpan.prototype.SetVLIndex= function(value) 
{
  if (value!=undefined)
    this.ValueListIdx = value;
  //
  if (this.Realized)
  {
    // Se e' cambiato il valore di sicuro dobbiamo reimpostare l'immagine e il valore
    this.SetIconImage();
    this.SetValue();
  }
}

BookSpan.prototype.SetTooltip= function(value) 
{
  if (value!=undefined)
    this.Tooltip = value;
  //
  if (this.Realized)
  {
    if (this.ControlType == RD3_Glb.VISCTRL_COMBO)
      this.SpanObj.SetTooltip(this.Tooltip);
    else if (this.SpanObj)
      RD3_TooltipManager.SetObjTitle(this.SpanObj, this.Tooltip);
  }
}

BookSpan.prototype.SetVisStyle= function(value) 
{
  var oldVS = this.VisStyle;
  if (value!=undefined)
  {
    if (value==null || value.Identifier)
    {
      // Era gia' un visual style
      this.VisStyle = value;
    }
    else
    {
      this.VisStyle = RD3_DesktopManager.ObjectMap["vis:"+value];
    }
  }
  //
  if (this.Realized)
  {
    // Non applico il VS durante la realizzazione in quanto
    // le proprieta' dinamiche non sono state ancora lette tutte
    if (value != undefined)
    {
      // Se e' cambiato il controltype devo ricreare l'oggetto
      if (oldVS && this.VisStyle && oldVS.GetContrType() != this.VisStyle.GetContrType())
        this.RecreateDOM();
      //
      this.ApplyVisualStyle();
    }
  }  
}

BookSpan.prototype.SetMaxLen= function(value) 
{
  if (value!=undefined)
    this.MaxLen = value;
  //
  if (this.Realized)
  {
    if (this.Enabled && this.ControlType==RD3_Glb.VISCTRL_EDIT)
      this.SpanObj.maxlength = this.MaxLen;
  }
}

BookSpan.prototype.SetScale= function(value) 
{
  if (value!=undefined)
    this.Scale = value;
  //
  // Utilizzato per determinare la maschera di input
}

BookSpan.prototype.SetDataType= function(value) 
{
  if (value!=undefined)
    this.DataType = value;
  //
  // Utilizzato per determinare la maschera di input
}

BookSpan.prototype.SetVisible= function(value) 
{
  if (value!=undefined)
    this.Visible = value;
  //
  if (this.Realized)
  {
    // Per ora non cambia dopo l'inizializzazione iniziale
    if (this.SpanObj)
    {
      if (this.ControlType == RD3_Glb.VISCTRL_COMBO)
        this.SpanObj.SetVisible(this.Visible);
      else
        this.SpanObj.style.display = (this.Visible ? "" : "none");
    }
  }
}

BookSpan.prototype.SetEnabled= function(value) 
{
  var oldena = this.Enabled;
  //
  if (value!=undefined)
    this.Enabled = value;
  //
  if (this.Realized && oldena != this.Enabled)
  {
    // E' cambiato lo stato Enabled... devo gestire la cosa
    this.RecreateDOM();
  }
}

BookSpan.prototype.SetHasImage= function(value) 
{
  if (value!=undefined)
    this.HasImage = value;
  //
  if (this.Realized)
  {
    if (this.HasImage)
    {
      if (this.SpanImg==null)
      {
        // Non ho ancora creato l'immagine: lo faccio ora
        this.SpanImg = document.createElement("img");
        this.SpanImg.id = this.Identifier + ":img";
        this.SpanImg.className = "book-span-img";
        this.SpanImg.src = RD3_Glb.GetImgSrc(this.Text);
        this.SpanObj.appendChild(this.SpanImg);
        //
        var parContext = this;
        if (!RD3_Glb.IsIE(10, false))
          this.SpanImg.onload = function(ev) { parContext.OnReadyStateChange(ev); };
        else
          this.SpanImg.onreadystatechange = function(ev) { parContext.OnReadyStateChange(ev); };
        //
        // Annullo il nodo di testo
        if (this.SpanTxt)
          this.SpanTxt.nodeValue = "";      
      }
      else
        this.SpanImg.src = RD3_Glb.GetImgSrc(this.Text);
      //
      // Contengo un'immagine... rimuovo il margin
      this.SpanObj.style.margin = "0px";
    }
    else
    {
      // Non contengo un'immagine... ripristino il margin (solo se non sono una combo)
      if (this.SpanObj && this.ControlType!=RD3_Glb.VISCTRL_COMBO)
        this.SpanObj.style.margin = "";
    }
  }
}

BookSpan.prototype.SetIconImage= function(value) 
{
  if (value!=undefined)
    this.IconImage = value;
  //
  if (this.Realized && this.ControlType==RD3_Glb.VISCTRL_EDIT && this.DataType!=10 && this.GetVS().ShowImage())
  {
    // Vediamo se la lista valori ha una propria immagine
    if (this.ValueList && this.ValueListIdx != -1)
      this.IconImage = this.ValueList.ItemList[this.ValueListIdx].Image;
    //
    if (this.SpanImg==null && this.IconImage!="")
    {
      // Non ho ancora creato l'immagine: lo faccio ora
      this.SpanImg = document.createElement("img");
      this.SpanImg.id = this.Identifier + ":img";
      this.SpanImg.className = "book-span-img";
      this.SpanObj.appendChild(this.SpanImg);
      //
      this.Stretch = RD3_Glb.STRTC_NONE;
    }
    //
    if (this.SpanImg)
    {
      if (this.IconImage!="")
      {
        this.SpanImg.src = RD3_Glb.GetImgSrc("images/"+this.IconImage);
        this.SpanImg.style.display = "";
      }
      else
        this.SpanImg.style.display = "none";
    }
  }
}

BookSpan.prototype.SetStretch= function(value) 
{
  if (value!=undefined)
    this.Stretch = value;
  //
  if (this.Realized && this.SpanImg)
  {
    var s = this.SpanImg.style;
    switch (this.Stretch)
    {
      case RD3_Glb.STRTC_ENLARGE:
      case RD3_Glb.STRTC_CROP:
      {
        // Prima di leggere, rimuovo eventuali dimensioni preesistenti
        s.width = "auto";
        s.height = "auto";
        //
        // Recupero le dimensioni originali dell'immagine e della box che mi contiene
        var OrgW = this.SpanImg.width;
        var OrgH = this.SpanImg.height;
        //
        var boxw = this.ParentBox.BoxBox.clientWidth;
        var boxh = this.ParentBox.BoxBox.clientHeight;
        //
        // Se ho tutto... posso fare i miei calcoli
        if (OrgW && OrgH && boxw && boxh)
        {
          var Asp = OrgH / OrgW;
          //
          // Calcolo l'altezza che avrei se facessi la larghezza uguale a quella della box
          // Calcolo la larghezza che avrei se facessi l'altezza uguale a quella della box
          var NewHeight = boxw * Asp;
          var NewWidth = boxh / Asp;
          //
          // Se la nuova altezza supera l'altezza della box... non ci sta in verticale
          if (NewHeight > boxh)
          {
            if (this.Stretch==RD3_Glb.STRTC_ENLARGE)
            {
              // Adatto e centro in larghezza
              s.width = NewWidth + "px";
              s.height = boxh + "px";
              s.top = "0px";
              s.left = (boxw - NewWidth) / 2 + "px";
              
            }
            else if (this.Stretch==RD3_Glb.STRTC_CROP)
            {
              // Adatto e centro in altezza
              s.width = boxw + "px";
              s.height = NewHeight + "px";
              s.top = (boxh - NewHeight) / 2 + "px";
              s.left = "0px";
            }
          }
          else // non ci sta in orizzontale
          {
            if (this.Stretch==RD3_Glb.STRTC_ENLARGE)
            {
              s.width = boxw + "px";
              s.height = NewHeight + "px";
              s.top = (boxh - NewHeight) / 2 + "px";
              s.left = "0px";
            }
            else if (this.Stretch==RD3_Glb.STRTC_CROP)
            {
              // Adatto e centro in larghezza
              s.width = NewWidth + "px";
              s.height = boxh + "px";
              s.top = "0px";
              s.left = (boxw - NewWidth) / 2 + "px";
            }
          }
          //
          s.position = "absolute";
        }
      }
      break;
      
      case RD3_Glb.STRTC_FILL:
      {
        // La dimensione dell'immagine deve essere quella della BOX
        s.left = "0px";
        s.top = "0px";
        s.width = this.ParentBox.Width + this.ParentBox.ParentPage.UM;
        s.height = this.ParentBox.Height + this.ParentBox.ParentPage.UM;
        s.position = "";
      }
      break;
      
      case RD3_Glb.STRTC_AUTO:
      case RD3_Glb.STRTC_NONE:
      {
        // Nessuno Stretch necessario : annullo impostazioni
        s.left = "0px";
        s.top = "0px";
        s.width = "";
        s.height = "";
        s.position = "";
      }
      break;       
    }
  }
}

BookSpan.prototype.SetMime= function(value) 
{
  // Questa proprieta' non puo' cambiare a run time 
  if (value!=undefined)
    this.MimeType = value;
  //
  if (this.Realized)
  {
    // Se ho un mime type mostro ho un immagine o un "link"
    if (this.MimeType != "")
    {
      // E' un immagine
      if (this.MimeType.indexOf("image") != -1)
      {
        this.SetHasImage(true);
      }
      else
      {
        // Il blob contiene un file: visualizzo un "link"
        this.SpanTxt = document.createTextNode(RD3_ServerParams.ShowBlob.replace("(|1)",""));
        this.SpanObj.appendChild(this.SpanTxt);
        this.SpanObj.className = "book-span-file";
        this.SpanObj.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnFileClick', ev)");
      }
    }
  }
}

BookSpan.prototype.SetBackColor = function(value)
{
  if (value != undefined)
    this.BackColor = value;
  //
  if (this.Realized)
  {
    // Non applico il VS durante la realizzazione in quanto
    // le proprieta' dinamiche non sono state ancora lette tutte
    if (value != undefined)
      this.ApplyVisualStyle();
  }
}

BookSpan.prototype.SetForeColor = function(value)
{
  if (value != undefined)
    this.ForeColor = value;
  //
  if (this.Realized)
  {
    // Non applico il VS durante la realizzazione in quanto
    // le proprieta' dinamiche non sono state ancora lette tutte
    if (value != undefined)
      this.ApplyVisualStyle();
  }
}

BookSpan.prototype.SetFontMod = function(value)
{
  if (value != undefined)
    this.FontMod = value;
  //
  if (this.Realized)
  {
    // Non applico il VS durante la realizzazione in quanto
    // le proprieta' dinamiche non sono state ancora lette tutte
    if (value != undefined)
      this.ApplyVisualStyle();
  }
}

BookSpan.prototype.SetMask = function(value)
{
  if (value != undefined)
    this.Mask = value;
  //
  if (this.Realized)
  {
    // Non applico il VS durante la realizzazione in quanto
    // le proprieta' dinamiche non sono state ancora lette tutte
    if (value != undefined)
      this.ApplyVisualStyle();
  }
}

// *******************************************************************
// Applico la classe
// *******************************************************************
BookSpan.prototype.SetClassName = function(cls)
{
  var old = this.ClassName;
  if (cls != undefined)
    this.ClassName = cls;
  //
  if (this.Realized && (old != this.ClassName || !cls)) 
  {
    if (this.ControlType==RD3_Glb.VISCTRL_COMBO)
    {
      this.SpanObj.SetClassName(this.ClassName);
    }
    else
    {
      // Rimuovo la classe precedente
      if (old != "") 
        RD3_Glb.RemoveClass2(this.SpanObj, old);
      //
      // Applico la nuova classe alla fine della lista
      if (this.ClassName && this.ClassName != "")
        RD3_Glb.AddClass(this.SpanObj, this.ClassName);
    }
  }
}

BookSpan.prototype.SetWatermark = function(value)
{
  if (value != undefined)
    this.Watermark = value;
  //
  if (this.Realized && this.Enabled)
    this.ApplyWatermark();
}

// ***************************************************************
// Se necessario applica il watermark allo span
// ***************************************************************
BookSpan.prototype.ApplyWatermark = function()
{
  // Se non ho un watermark da applicare allora lo rimuovo
  // Se c'e' del testo allora rimuovo il watermark
  if (this.Watermark=="" || this.Text != "")
  {
    this.RemoveWatermark();
    return;
  }
  //
  // Se arrivo qui il testo e' "" e il watermark non lo e': quindi lo applico
  if (this.ControlType==RD3_Glb.VISCTRL_COMBO)
  {
    this.SpanObj.SetWatermark();
    this.SpanObj.SetText(this.Watermark);
  }
  //
  if (this.ControlType==RD3_Glb.VISCTRL_EDIT)
  {
    this.SpanObj.value = this.Watermark;
    RD3_Glb.AddClass(this.SpanObj,"panel-field-value-watermark");
  }
  //
  this.HasWatermark = true;
}


// ***************************************************************
// Se necessario rimuove il watermark dallo span
// ***************************************************************
BookSpan.prototype.RemoveWatermark = function()
{
  if (!this.HasWatermark)
    return;
  //
  if (this.ControlType==RD3_Glb.VISCTRL_EDIT)
  {
    this.SpanObj.value = "";
    RD3_Glb.RemoveClass(this.SpanObj,"panel-field-value-watermark");
  }
  if (this.ControlType==RD3_Glb.VISCTRL_COMBO)
  {
    this.SpanObj.RemoveWatermark();
    this.SpanObj.SetText(this.Text, false);
  }
  //
  this.HasWatermark = false;
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
BookSpan.prototype.Realize = function(parent)
{
  // Scelgo lo stile visuale giusto
  var vs = (this.VisStyle==null)?this.ParentBox.VisStyle:this.VisStyle;
  var bt = vs.GetBorders(1);
  //
  // realizzo i miei oggetti visuali: ci sono varie possibilita' in base allo stile visuale
  this.ControlType = vs.GetContrType();
  //
  // Auto vuole dire COMBO oppure EDIT...
  if (this.ControlType==RD3_Glb.VISCTRL_AUTO)
  {
    if (this.ValueList && this.ValueList.ItemList.length>0 && this.Enabled)
      this.ControlType = RD3_Glb.VISCTRL_COMBO;
    else
      this.ControlType = RD3_Glb.VISCTRL_EDIT;
  }
  //
  // Se disabilitato o senza lista valori, OPTION vale come EDIT
  if ((!this.Enabled || !this.ValueList) && this.ControlType==RD3_Glb.VISCTRL_OPTION)
    this.ControlType = RD3_Glb.VISCTRL_EDIT;
  //
  // Usate per convertire mm/inch in px
  var mmi = (this.ParentBox.ParentPage.UM=="mm" ? 25.4/96 : 1/96)
  //
  var ok = false;
  switch (this.ControlType)
  {
    case RD3_Glb.VISCTRL_EDIT:
      if (this.Enabled) // Creo il campo di input solo se abilitato
      {
        if (this.ParentBox.NumRows>1)
        {
          this.SpanObj = document.createElement("textarea");
          this.SpanObj.className = "book-span-textarea";
        }
        else
        {
          this.SpanObj = document.createElement("input");
          this.SpanObj.type = vs.IsPassword()? "password" : "text";
          this.SpanObj.className = "book-span-input";
        }
        //
        RD3_Glb.AutocompleteOff(this.SpanObj);
        this.SpanObj.style.left = (this.ParentBox.Wants4pxPadding() ? "4px" : "");
        //
        if (!RD3_Glb.IsIE(10, false))
        {
          var fo = function(ev) { RD3_KBManager.IDRO_GetFocus(ev); };
          var lo = function(ev) { RD3_KBManager.IDRO_LostFocus(ev); };
          //
          // Solo IE ha gli eventi (activate e deactivate) che informano i parent (bubble)
          this.SpanObj.onfocus = fo;
          this.SpanObj.onblur = lo;
        }
        //
        // Se ci sono dei bordi non personalizzati, devo inserire un margine "naturale" di 1px
        var ofs = 0;
        var hofs = 0;
        var vofs = 0;
        //      
        if (bt>=2 && bt<=8)
        {
          if (this.ParentBox.ParentPage.UM=="mm")
            ofs = 25.4/96;
          else
            ofs = 1/96;
          if (RD3_Glb.IsIE() || RD3_Glb.IsSafari())
          {
            hofs = ofs+ofs;
            vofs = ofs+ofs;
          }
          else if (RD3_Glb.IsChrome())
          {
            hofs = 0;
            vofs = ofs+ofs;
          }
        }  
        else
        {
          // Se sono un input
          hofs = 1;
          vofs = 0.5;
        }
        //
        // Cambio le dimensioni dell'input per tenere conto dell' immagine (15px, da convertire a seconda dell'unita' di misura)
        var parentContext = this;
        if ((this.DataType== 6 || this.DataType==8) && !RD3_Glb.IsMobile())
        {
          // Se sono una data devo mettere l'immagine del calendario
          if (!this.SpanCal)
          {
            this.SpanCal = document.createElement("img");
            this.SpanCal.className = "book-span-calendar";
            this.SpanCal.src = RD3_Glb.GetImgSrc("images/aeda.gif");
            //
            // Associo l'evento di Click
            this.SpanCal.onclick = function(ev) { parentContext.OnCalendarClick(ev); };
          }
          //
          var ws = this.ParentBox.Width-hofs;
          if (this.ParentBox.Wants4pxPadding())
            ws -= (4*mmi);
          if (ws > (15*mmi))
            ws -= (15*mmi);
          //
          this.SpanObj.style.width = (ws)+this.ParentBox.ParentPage.UM;
          this.SpanObj.style.height = (this.ParentBox.Height-vofs)+this.ParentBox.ParentPage.UM;
          //
          var ali = this.ParentBox.VisStyle.GetAlignment(1);
          if (this.ParentBox.Alignment != 1)
            ali = this.ParentBox.Alignment;
          if (ali == 4) // Allineamento a destra: il calendario va a sinistra
          {
            this.SpanObj.style.left = "15px";
            this.SpanCal.style.left = "0px";
          }
          else  // Il calendario va a destra
            this.SpanCal.style.left = (ws)+this.ParentBox.ParentPage.UM;
        }
        else
        {
          var ws = this.ParentBox.Width-hofs;
          var hs = this.ParentBox.Height-vofs;
          if (this.ParentBox.Wants4pxPadding())
            ws -= (4*mmi);
          //
          // Devo impostare alcune proprieta' del campo, altrimenti non viene bene
          this.SpanObj.style.width = ws+this.ParentBox.ParentPage.UM;
          this.SpanObj.style.height = hs+this.ParentBox.ParentPage.UM;
        }
        //
        this.SpanObj.onchange = function(ev) { parentContext.OnChange(ev); };
        this.SpanObj.onkeypress = function(ev) { parentContext.OnKeyPress(ev); };
        ok = true;
      }
    break;
    
    case RD3_Glb.VISCTRL_COMBO:
      // Se abilitato metto la combo box
      this.SpanObj = new IDCombo(this);
      this.SpanObj.RightAlign = this.IsRightAligned();
      this.SpanObj.MultiSel = false;
      this.SpanObj.UsePopover = true;
      ok = true;
    break;
    
    case RD3_Glb.VISCTRL_CHECK:
      if (RD3_Glb.IsMobile())
      {
        this.SpanObj = document.createElement("div");
        this.SpanObj.checked = true;
        //
        if (RD3_Glb.IsQuadro())
        {
          var vl = this.ValueList;
          //
          // Nel tema quadro, voglio costruire tutto il check io stesso
          var intdiv = document.createElement("div");
          intdiv.className = "radio-int-div";
          var s1 = document.createElement("span");
          s1.className = "radio-int-s1";
          s1.innerText =  (vl.ItemList.length>0)?vl.ItemList[0].Name:"ON";
          var s2 = document.createElement("span");
          s2.className = "radio-int-s2";
          var s3 = document.createElement("span");
          s3.className = "radio-int-s3";
          s3.innerText = (vl.ItemList.length>1)?vl.ItemList[1].Name:"OFF";
          intdiv.appendChild(s1);
          intdiv.appendChild(s2);
          intdiv.appendChild(s3);
          this.SpanObj.appendChild(intdiv);
        }
        else
        {
          // E' necessario uno span "a perdere" per avere un bordo
          var x = document.createElement("span")
          this.SpanObj.appendChild(x);
        }
        //
        if (!this.Enabled)
        {
          this.ValueList.SetCheck(this.SpanObj, this.Value);
          x.style.cursor = "default";
        }
      }
      else
      {
        this.SpanObj = document.createElement("input")
        this.SpanObj.type = "checkbox";
      }
      this.SpanObj.className = "book-span-check";
      this.SpanObj.disabled = !this.Enabled;
      //
      var parentContext = this;
      this.SpanObj.onclick = function(ev) { parentContext.OnChange(ev); };
      this.SpanObj.onkeypress = function(ev) { parentContext.OnKeyPress(ev); };
      ok = true;
    break;

    case RD3_Glb.VISCTRL_OPTION:
      var vert = RD3_Glb.IsMobile()?RD3_Glb.ConvertIntoPx(this.ParentBox.Height, this.ParentBox.ParentPage.UM)>84:this.ParentBox.NumRows>1;
      this.ValueList.RealizeOption(this, parent, this.Value, vert, false, this.Enabled);
      ok = true;
    break;
    
    case RD3_Glb.VISCTRL_BUTTON:
      this.SpanObj = document.createElement("input");
      this.SpanObj.type = "button";
      this.SpanObj.className = "book-span-button";
      this.SpanObj.value = this.Text;
      this.SpanObj.disabled = !this.Enabled;
      //
      // Devo impostare alcune proprieta' del campo, altrimenti non viene bene
      var ws = this.ParentBox.Width;
      var hs = this.ParentBox.Height;
      this.SpanObj.style.width = ws+this.ParentBox.ParentPage.UM;
      this.SpanObj.style.height = hs+this.ParentBox.ParentPage.UM;
      //
      ok = true;
    break;
  }
  //
  if (!ok)
  {
    // Devo creare span di testo
    this.SpanObj = document.createElement("span");
    this.SpanObj.className = "book-span";
    //
    // Se la box e' cliccabile, anche lo span lo e'
    if (this.ParentBox.CanClick)
      this.SpanObj.style.cursor = "pointer";
    //
    if (bt>=2 && bt<=8) // Se ci sono dei bordi non personalizzati, devo inserire un margine "naturale" di 1px
      this.SpanObj.style.margin = "1px";
    //
    if (this.ParentBox.NumRows==1)
      this.SpanObj.style.whiteSpace="pre";
  }
  //
  if (this.SpanObj)
  {
    if (this.ControlType==RD3_Glb.VISCTRL_COMBO)
    {
      this.SpanObj.Realize(parent, "book-span-combo");
      this.SpanObj.SetID(this.Identifier);
      this.SpanObj.SetEnabled(this.Enabled);
      this.SpanObj.SetShowValue(false);
      this.SpanObj.AssignValueList(this.ValueList, true);
      //
      // Devo impostare alcune proprieta' del campo, altrimenti non viene bene
      this.SpanObj.SetWidth(this.ParentBox.Width/mmi);
      this.SpanObj.SetHeight(this.ParentBox.Height/mmi);
    }
    else
    {
      this.SpanObj.setAttribute("id", this.Identifier);
      //
      if ((this.DataType== 6 || this.DataType==8) && this.Enabled  && !RD3_Glb.IsMobile())
      {
        // Se sono una data devo appendere il contenitore e l'immagine del calendario
        var al = vs.GetAlignment();
        if (this.ParentBox.Alignment != 1)
          al = this.ParentBox.Alignment;
        if (al == 4) // Allineamento a destra: il calendario va a sinistra
        {
          parent.appendChild(this.SpanCal);
          parent.appendChild(this.SpanObj);
        }
        else  // Il calendario va a destra dell'input
        {
          parent.appendChild(this.SpanObj);
          parent.appendChild(this.SpanCal);
        }
      }
      else
      {
        parent.appendChild(this.SpanObj);
      }
    }
  }
  //
  // Per un "bug" di IE, l'impostazione del valore del checkbox puo' avvenire
  // solo dopo averlo aggiunto al DOM
  if (this.SpanObj && this.ControlType==RD3_Glb.VISCTRL_CHECK)
  {
    if (this.Enabled && this.ValueList)
      this.ValueList.SetCheck(this.SpanObj, this.Value);
    else
      this.SpanObj.checked = (this.ValueListIdx==0); // Il primo valore della lista
  }
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  this.Realizing = true;
  //
  this.SetEnabled();
  this.SetMime();
  this.SetIconImage();
  this.SetText();
  this.SetTooltip();
  this.SetDataType();  
  this.SetMaxLen();
  this.SetScale();
  //
  // Impongo lo stile visuale dopo la scala in modo da poter impostare la maschera
  this.SetVisStyle();
  this.SetVisible();
  this.SetHasImage();
  this.SetStretch();
  this.SetBackColor();
  this.SetForeColor();
  this.SetFontMod();
  this.ApplyVisualStyle();
  this.SetClassName();
  //
  // Il check su mobile 7 usa il colore di sfondo, quindi deve essere reimpostato dopo aver impostato lo stile (potrebbe aver modificato il colore)
  if (RD3_Glb.IsMobile7() && this.SpanObj && this.ControlType==RD3_Glb.VISCTRL_CHECK && this.Enabled && this.ValueList)
    this.ValueList.SetCheck(this.SpanObj, this.Value);
  //
  this.Realizing = false;
}


// **********************************************************************
// Rimuove questa box
// **********************************************************************
BookSpan.prototype.Unrealize = function()
{
  // Tolgo l'oggetto dalla mappa comune
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Elimino gli oggetti visuali
  if (this.SpanObj)
  {
    if (this.ControlType == RD3_Glb.VISCTRL_COMBO)
      this.SpanObj.Unrealize();
    else
    {
      if (this.SpanObj.parentNode)
        this.SpanObj.parentNode.removeChild(this.SpanObj);
    }
  }
  //
  // Elimino i riferimenti
  this.SpanObj = null;  
  this.SpanImg = null;         
  this.SpanTxt = null;         
  //
  this.Realized = false; 
}


// ********************************************************************************
// Rimuove questa box in maniera ritardata (chiamato alla fine di una animazione
// se necessario)
// ********************************************************************************
BookSpan.prototype.UnrealizeDelayed = function()
{
  // Guardo nella mappa: se l'oggetto con il mio id sono io lo tolgo senza problemi, se e' un altro
  // allora lo lascio
  var ob = RD3_DesktopManager.ObjectMap[""+this.Identifier];
  if (ob == this)
    RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Elimino gli oggetti visuali
  if (this.SpanObj)
  {
    if (this.ControlType == RD3_Glb.VISCTRL_COMBO)
      this.SpanObj.Unrealize();
    else
    {
      if (this.SpanObj.parentNode)
        this.SpanObj.parentNode.removeChild(this.SpanObj);
    }
  }
  //
  // Elimino i riferimenti
  this.SpanObj = null;  
  this.SpanImg = null;         
  this.SpanTxt = null;         
  //
  this.Realized = false; 
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
BookSpan.prototype.AdaptLayout = function()
{
  // Se non sono stato realizzato... non faccio nulla
  if (!this.Realized)
    return;
  //
  // Gestisco l'eventuale stretch della mia immagine
  if (this.SpanImg)
    this.SetStretch();
}


// **********************************************************************
// Deve tornare vero se l'oggetto e' draggabile
// **********************************************************************
BookSpan.prototype.IsDraggable = function()
{
  // Lo span e' draggabile se il suo box e' draggabile
  return this.ParentBox.IsDraggable();
}


// **********************************************************************
// Deve tornare vero se l'oggetto e' trasformabile
// **********************************************************************
BookSpan.prototype.IsTransformable = function()
{
  // Lo span e' trasformabile se il suo box e' trasformabile
  return this.ParentBox.IsTransformable();
}


// **********************************************************************
// Drop effettuato sull'oggetto
// **********************************************************************
BookSpan.prototype.OnDrop = function(obj)
{
  // Il drop va effettuato sulla box
  return this.ParentBox.OnDrop(obj);
}

// **********************************************************************
// Restituisce l'oggetto di modello che deve gestire il d&d (anche se 
// il mouse se e' sullo span il d&d deve essere fatto sulla box)
// **********************************************************************
BookSpan.prototype.DragObj = function()
{
  // Il D&D va effettuato sulla BOX
  return this.ParentBox;
}


// **********************************************************************
// Gestore dell'evento di change dell'input
// **********************************************************************
BookSpan.prototype.OnChange = function(evento)
{
  // Invio variazione normale
  if (!this.HasWatermark)
    this.SendChanges(evento,0);
}

// **********************************************************************
// Gestore dell'evento di change della combo
// **********************************************************************
BookSpan.prototype.OnComboChange = function()
{
  // Invio variazione normale
  if (!this.HasWatermark)
    this.SendChanges(this.SpanObj,0);
}


// **********************************************************************
// Gestore dell'evento di keypress dell'input
// **********************************************************************
BookSpan.prototype.OnKeyPress = function(evento)
{
  if (window.event && evento==undefined)
    evento = window.event;
  //
  // Questo evento scatta per INPUT, TEXTAREA, COMBO
  // Non lo gestisco per la textarea
  if (evento.keyCode == 13 && (this.ParentBox.NumRows==1 || this.ControlType!=RD3_Glb.VISCTRL_EDIT))
  {
    // Se e' un INPUT editabile e ha una maschera, la tolgo prima di inviare il valore
    if (this.Mask || this.GetVS().Mask)
      umc(evento);
    //
    // Invio variazione immediata
    this.SendChanges(evento,RD3_Glb.EVENT_IMMEDIATE);
  }
}


// **********************************************************************
// Invia al server i dati del campo di INPUT o TEXTAREA
// **********************************************************************
BookSpan.prototype.SendChanges = function(evento, flag)
{
  if (this.Visible && this.Enabled && this.Realized)
  {
    var s = "";
    if (this.SpanObj)
    {
      if (this.ControlType == RD3_Glb.VISCTRL_COMBO)
        s = this.SpanObj.GetComboValue();
      else
        s = this.SpanObj.value;
    }
    var chg = false;
    //
    switch (this.ControlType)
    {
      case RD3_Glb.VISCTRL_EDIT:
        chg = (s!=this.Text);
        this.Text = s;
        if (this.GetVS().ComputeMaskType(this.DataType) == "N")
        {
          // Nel caso numerico devo mandare al server il valore togliendo il decimal dot e lasciando solo 
          // l'eventuale separatore dei decimali; poi ci pensa lui a mascherare
          if (RD3_DesktopManager.WebEntryPoint.UseDecimalDot)
            s = s.replace(/,/g, "");
          else
            s = s.replace(/\./g, "");
        }
      break;
      
      case RD3_Glb.VISCTRL_COMBO:
        chg = (s!=this.Value);
        this.Value = s;
      break;
      
      case RD3_Glb.VISCTRL_CHECK:
        s = this.ValueList.ItemList[(this.SpanObj.checked)?0:1].Value;
        chg = (s!=this.Value);
        this.Value = s;
        this.SetTooltip(this.ValueList.ItemList[(this.SpanObj.checked)?0:1].Tooltip);
      break;
      
      case RD3_Glb.VISCTRL_OPTION:
        s = this.ValueList.GetOption(this.ParentBox.BoxBox);
        chg = (s!=this.Value);
        this.Value = s;
      break;
    }
    //    
    if (chg)
    {
      // Invio l'evento
      var ev = new IDEvent("chg", this.Identifier, evento, this.ChgEventDef|flag, "", s);
    }
    else
    {
      // Non devo lanciare l'evento, ma se premo INVIO mando comunque tutti gli
      // eventi in sospeso al server
      if (flag == RD3_Glb.EVENT_IMMEDIATE)
        RD3_DesktopManager.SendEvents();
    }
  }
}


// **********************************************************************
// Torna il VS dello span (o quello del box se lo span non lo ha)
// **********************************************************************
BookSpan.prototype.GetVS= function() 
{
  return (this.VisStyle)?this.VisStyle:this.ParentBox.VisStyle;
}


// ********************************************************************************
// Gestore evento di apertura file
// ********************************************************************************
BookSpan.prototype.OnFileClick= function(evento)
{ 
  var eve = window.event?window.event:evento;
  var url = this.Text;
  if (url && url!="")
  {
    // Eseguo la preview del blob
    url = url.replace("&amp;", "&");  
    if (eve.shiftKey || eve.ctrlKey)
    {
      RD3_DesktopManager.OpenDocument(url, "", "");
    }
    else
    {
      var m = new PopupPreview(url, RD3_ServerParams.VisualizzaDocumento);
      m.Open();
    }
  }
}


// ***********************************************************
// Torna true se il campo e' allineato a dx per default
// ***********************************************************
BookSpan.prototype.IsRightAligned = function()
{
  // Vediamo l'allineamento della mia box
  // Se la box dice qualcosa di diverso da AUTOMATICO e da DESTRA allora
  // non sono allineato a destra
  var ali = this.ParentBox.VisStyle.GetAlignment(1);
  if (this.ParentBox.Alignment != 1)
    ali = this.ParentBox.Alignment;
  if (ali != 1 && ali != 4)
    return false;
  //
  // Se non e' numerico, non allineo a dx
  if (!RD3_Glb.IsNumericObject(this.DataType))
    return false;
  //
  // Se ha una lista valori
  if (this.ValueList)
    return false;
  //
  return true;
}


// **********************************************************************
// Il fuoco e' su questo campo (elemento DOM = srcele)
// **********************************************************************
BookSpan.prototype.GotFocus = function(srcele, evento)
{
  if (this.Enabled)
  {
    // Per prima cosa rimuovo il Focus Box da dove era: adesso ho io il fuoco
    var fb = RD3_DesktopManager.WebEntryPoint.FocusBox;
    var oldPar = null;
    if (fb && fb.parentNode)
    {
      oldPar = fb.parentNode;
      fb.parentNode.removeChild(fb);
    }
    //
    if (this.ControlType != RD3_Glb.VISCTRL_BUTTON)
    {
      var vs = this.GetVS();
      //
      // Vado al div del campo...
      while (srcele && srcele.tagName!="DIV")
        srcele = srcele.parentNode;
      //
      // Imposto le caratteristiche    
      fb.style.width = (srcele.clientWidth-2)+"px";
      fb.style.height = (srcele.clientHeight-2)+"px";
      fb.style.left = "0px";
      fb.style.top = "0px";
      //
      fb.style.backgroundColor = vs.GetColor(10); // VISCLR_EDITING
      fb.style.borderColor = vs.GetColor(11); // VISCLR_BORDERS
      //
      srcele.appendChild(fb);
      RD3_DesktopManager.WebEntryPoint.ResetHideFocusBox();
      //
      // Se ho preso il fuoco, sono password e non avevo gia' il fuoco allora svuoto il campo
      if (vs.IsPassword() && (oldPar != srcele))
        this.SpanObj.value = "";
      //
      this.RemoveWatermark();
      //
      // Ora ho io il fuoco
      this.HasFocus = true;
    }
  }
}


// **********************************************************************
// Il fuoco e' stato perso da questo campo
// **********************************************************************
BookSpan.prototype.LostFocus = function(srcele, evento)
{
  if (!this.Enabled)
    return;
  //
  // Se sono una combo aperta, non applico il watermark
  if (this.ControlType == RD3_Glb.VISCTRL_COMBO && this.SpanObj.IsOpen)
    return;
  //
  // Se sono un campo pwd quando prendo il fuoco mi svuoto; se l'utente esce dal campo subito dopo 
  // devo reimpostare il text che mi ero mangiato, invece se l'utente ha scritto qualcosa non devo fare niente
  // perche' il campo e' gia' allineato
  if (this.GetVS().IsPassword() && this.SpanObj && this.SpanObj.value.length==0)
    this.SpanObj.value = this.Text;
  //
  // Mando i cambiamenti dell'oggetto
  if (this.ControlType == RD3_Glb.VISCTRL_EDIT && this.Watermark != "")
    this.OnChange(evento);
  //
  this.ApplyWatermark();
  //
  // Ora non ho piu' il fuoco
  this.HasFocus = false;
}

// ***********************************************************
// Click sul pulsante del calendario per uno span abilitato
// di tipo data
// ***********************************************************
BookSpan.prototype.OnCalendarClick = function(evento)
{
  var srcobj = (window.event)?window.event.srcElement:evento.explicitOriginalTarget;
  //
  // L'input e' il primo fratello del pulsante 
  var inpobj = srcobj.parentNode.childNodes[0];
  //
  // Verifica abilitazione e tipo del campo
  if (!this.Enabled)
    return true;
  //
  var dt = this.DataType;
  //
  if (dt == 6 || dt==7 || dt==8)
  {
    // Devo aprire il calendario
    ShowCalendar(inpobj, inpobj.getAttribute("idmask"));
    //
    // Per ora il click arriva comunque al wep, quindi correggo cosi'...
    RD3_DesktopManager.WebEntryPoint.CalPopup.setAttribute("idjustopened", "1");
    //
    // Non faccio passare l'evento al body, se no chiude il calendario
    return false;
  }
  //
  return true;
}


// *******************************************************
// Metodo che gestisce il cambio dello stato dell'immagine
// *******************************************************
BookSpan.prototype.OnReadyStateChange = function()
{
  if (!RD3_Glb.IsIE(10, false) || this.SpanImg.readyState == "complete")
    this.SetStretch();
}


// *******************************************************
// Metodo che gestisce la cancellazione dell'oggetto da parte
// del motore differenziale
// *******************************************************
BookSpan.prototype.OnDeleteObject = function(node)
{
  // Mi rimuovo dalla lista delle box di mio padre, se c'e' ancora
  var arr = this.ParentBox.Spans;
  var n = arr.length;
  for (var i=0; i<n; i++)
  {
    if (arr[i]==this)
    {
      arr.splice(i, 1);
      break;
    }
  }
}


// *******************************************************
// Metodo che gestisce la variazione di larghezza della box
// *******************************************************
BookSpan.prototype.UpdateWidth = function(oldw, neww)
{
  if (this.Realized && this.Enabled)
  {
    if (this.ControlType==RD3_Glb.VISCTRL_EDIT)
    {
      this.SpanObj.style.width = (parseFloat(this.SpanObj.style.width) + (neww-oldw)) + this.ParentBox.ParentPage.UM;
      //
      // Se e' di tipo DATETIME non allineato a destra sposto anche l'immaginetta
      if ((this.DataType== 6 || this.DataType==8)  && !RD3_Glb.IsMobile())
      {
        var ali = this.ParentBox.VisStyle.GetAlignment(1);
        if (this.ParentBox.Alignment != 1)
          ali = this.ParentBox.Alignment;
        if (ali != 4) // Il calendario va a destra
          this.SpanCal.style.left = (parseFloat(this.SpanCal.style.left) + (neww-oldw)) + this.ParentBox.ParentPage.UM;
      }
    }
    if (this.ControlType==RD3_Glb.VISCTRL_COMBO)
    {
      // Usate per convertire mm/inch in px
      var mmi = (this.ParentBox.ParentPage.UM=="mm" ? 25.4/96 : 1/96)
      this.SpanObj.SetWidth((parseFloat(this.SpanObj.Width) + (neww-oldw))/mmi);
    }
    if (this.ControlType==RD3_Glb.VISCTRL_BUTTON)
      this.SpanObj.style.width = (parseFloat(this.SpanObj.style.width) + (neww-oldw)) + this.ParentBox.ParentPage.UM;
  }
}


// *******************************************************
// Metodo che gestisce la variazione di altezza della box
// *******************************************************
BookSpan.prototype.UpdateHeight = function(oldh, newh)
{
  if (this.Realized && this.Enabled)
  {
    if (this.ControlType==RD3_Glb.VISCTRL_EDIT)
      this.SpanObj.style.height = (parseFloat(this.SpanObj.style.height) + (newh-oldh)) + this.ParentBox.ParentPage.UM;
    if (this.ControlType==RD3_Glb.VISCTRL_COMBO)
    {
      // Usate per convertire mm/inch in px
      var mmi = (this.ParentBox.ParentPage.UM=="mm" ? 25.4/96 : 1/96)
      this.SpanObj.SetHeight((parseFloat(this.SpanObj.Height) + (newh-oldh))/mmi);
    }
    if (this.ControlType==RD3_Glb.VISCTRL_BUTTON)
      this.SpanObj.style.height = (parseFloat(this.SpanObj.style.height) + (newh-oldh)) + this.ParentBox.ParentPage.UM;
  }
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
BookSpan.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "")
    return this.ParentBox.GetTooltip(tip, obj);
  //
  tip.SetObj(this.SpanObj);
  tip.SetText(this.Tooltip);
  tip.SetImage("");
  tip.SetAutoAnchor(true);
  tip.SetPosition(2);
  return true;
}


// *******************************************
// Ricrea il dom facendo un'unrealize rapida 
// e realize
// ****************************************
BookSpan.prototype.RecreateDOM= function()
{
  if (this.SpanObj)
  {
    // Elimino gli oggetti visuali
    var parent = null;
    if (this.ControlType == RD3_Glb.VISCTRL_COMBO)
    {
      parent = this.ParentBox.BoxBox;
      this.SpanObj.Unrealize();
    }
    else
    {
      parent = this.SpanObj.parentNode;
      this.SpanObj.parentNode.removeChild(this.SpanObj);
    }
    //
    if (this.SpanCal)
      this.SpanCal.parentNode.removeChild(this.SpanCal);
    //
    // Elimino i riferimenti
    this.SpanObj = null;
    this.SpanImg = null;
    this.SpanTxt = null;
    this.SpanCal = null;
    //
    this.Realize(parent);
  }
  else if (this.ControlType==RD3_Glb.VISCTRL_OPTION)
  {
    // Svuoto l'option
    while (this.ParentBox.BoxBox.firstChild)
      this.ParentBox.BoxBox.removeChild(this.ParentBox.BoxBox.lastChild);
    //
    this.Realize(this.ParentBox.BoxBox);
  }
}

// *********************************************************
// Applica le proprieta' visuali allo span
// *********************************************************
BookSpan.prototype.ApplyVisualStyle = function()
{
  if (!this.SpanObj)
    return;
  //
  var vs = this.GetVS();
  //
  // Applico il VS ai controlli
  var aa;
  var ali = vs.GetAlignment(1);
  if (this.ParentBox.Alignment != 1)
    ali = this.ParentBox.Alignment;
  switch (ali)
  {
    case 3: aa = "center"; break;   // VISALN_CX
    case 4: aa = "right"; break;    // VISALN_DX
    case 5: aa = "justify"; break;  // VISALN_JX
    default: aa = (this.IsRightAligned() ? "right" : ""); break;
  }
  //
  if (this.ControlType == RD3_Glb.VISCTRL_COMBO)
  {
    this.SpanObj.SetVisualStyle(vs, true);
    vs.ApplyStyle(this.SpanObj.GetDOMObj(), this.Alternate, aa, this.BackColor, this.ForeColor, this.FontMod, this.Mask);
  }
  else
  {
    // Se non ho un mio stile visuale ma sono una TEXTAREA editabile (NumRows > 1) devo applicarlo
    // altrimenti le TEXTAREA non ereditano uno stile dal DIV padre ma ne usano uno proprio!
    var forceVS = false;
    if (!this.VisStyle && this.Enabled && this.ControlType == RD3_Glb.VISCTRL_EDIT && this.ParentBox.NumRows > 1)
      forceVS = true;
    //
    // Applico davvero lo stile solo se c'e' qualcosa di dinamico oppure se proprio io come span avevo il VS
    // Solo durante la fase di realizzazione iniziale, non di variazione
    if (!this.Realizing || this.VisStyle || forceVS || this.BackColor!="" || this.ForeColor!="" || this.FontMod!="" || this.Mask!="")
      vs.ApplyStyle(this.SpanObj, this.Alternate, aa, this.BackColor, this.ForeColor, this.FontMod, this.Mask);
    //
    var oldMask = vs.Mask;
    if (this.Mask != "")
      vs.Mask = this.Mask;
    //
    var msk = vs.ComputeMask(this.DataType, this.MaxLen, this.Scale);
    var mskt = vs.ComputeMaskType(this.DataType);
    //
    if (this.Mask != "")
      vs.Mask = oldMask;
    //
    this.SpanObj.setAttribute("idmask",msk);
    this.SpanObj.setAttribute("idmasktype",mskt);
    this.SpanObj.setAttribute("idenabled",this.Enabled?"1":"0");
  }
}


// *********************************************************
// Click sulla label di un radio: lo devo checkare
// *********************************************************
BookSpan.prototype.OnRadioLabelClick = function(ev)
{
  var obj = (window.event)?window.event.srcElement:ev.target;
  var prev = obj.previousSibling;
  //
  // Spingo il click sul radio.
  if (prev)
    prev.click();
  //
  if (RD3_Glb.IsMobile())
    this.ValueList.SetOptionClass(obj.parentNode,obj);
}


// *********************************************************
// Click sulla parte esterna del check: devo selezionare o 
// deselezionare e poi inviare al server
// *********************************************************
BookSpan.prototype.OnCheckBoxClick = function(ev)
{
  if (this.ControlType != RD3_Glb.VISCTRL_CHECK || !this.SpanObj || !this.Enabled || this.AlreadyChecked)
    return;
  //
  // Non posso cliccare direttamente sul check, perche' altrimenti quando l'utente clicca sul check l'evento bubbla a me che lo riclicco
  // e annullo la sua azione: invece se uso il srcobj se l'utente ha cliccato sul div clicco sul check, ma se l'utente ha cliccato sul check
  // il srcobj e' il check che non ha figli e allora non clicco!
  if (RD3_Glb.IsMobile())
  {
    this.OnToggleCheck(ev);
  }
  else
  {
    var srcobj = (window.event)?window.event.srcElement:ev.explicitOriginalTarget; 
    if (srcobj && srcobj.hasChildNodes())
      srcobj.childNodes[0].click();
  }
}


// ********************************************************************************
// Gestione click mobile su box
// ********************************************************************************
BookSpan.prototype.OnTouchDown= function(evento)
{ 
  return true;
}

BookSpan.prototype.OnTouchUp= function(evento, click)
{ 
  if (click && this.ParentBox.CanClick) 
  {
    // Se e' di tipo button, mi ricordo che l'active button e' questo
    // Se viene aperta una popup, si attacchera' a questo bottone
    if (this.ControlType==RD3_Glb.VISCTRL_BUTTON)
      RD3_KBManager.ActiveButton = this.SpanObj;
    //
    this.ParentBox.OnClick(evento);
  }
  if (click && this.Enabled && this.ControlType==RD3_Glb.VISCTRL_CHECK)
    this.OnToggleCheck(evento);
  if (click && this.Enabled && this.ControlType==RD3_Glb.VISCTRL_COMBO)
    this.SpanObj.OnClickActivator(evento);
  if (click && this.UsePopupControl() && this.Enabled && this.ControlType!=RD3_Glb.VISCTRL_COMBO)
  {
    var FakeCell = RD3_KBManager.GetSpanCell(this);
    var pc = new PopupControl(this.GetPopupControlType(),FakeCell);
    pc.Open();
  }
  return true;
}


// *******************************************************************
// Gestisce animazione checkbox
// *******************************************************************
BookSpan.prototype.OnToggleCheck = function(evento) 
{
  if (!this.ea)
  {
    var parentContext = this;
    this.ea = function(ev) { parentContext.OnEndAnimation(ev); };
  }
  //
  var obj = evento.target;
  if (obj.tagName=="SPAN")
    obj = obj.parentNode;
  //
  obj.checked = !obj.checked;
  if (RD3_Glb.IsQuadro())
  {
    var io = obj.firstChild;
    RD3_Glb.SetTransitionDuration(io, "200ms");
    var x = "translate3d("+(obj.checked?0:-53)+"px, 0px, 0px)";
    RD3_Glb.SetTransform(io, x);
    RD3_Glb.AddEndTransaction(io, this.ea, false);
  }
  else
  {
    RD3_Glb.SetTransitionDuration(obj, "200ms");
    obj.style.backgroundPosition = (obj.checked?"0%":"100%")+" -27px";
  }
  //
  RD3_Glb.AddEndTransaction(obj, this.ea, false);
  //
  // Mando i cambiamenti dell'oggetto
  this.OnChange(evento);
  //
  // Nel caso iOS7, spingo il valore che si aggiorna
  if (RD3_Glb.IsMobile7())
    this.SetValue();
}

// *******************************************************************
// Conclude animazione checkbox
// *******************************************************************
BookSpan.prototype.OnEndAnimation = function(evento) 
{
  var obj = evento.target ? evento.target : evento.srcElement;
  //
  RD3_Glb.SetTransitionDuration(obj, "0ms");
  RD3_Glb.RemoveEndTransaction(obj, this.ea, false);
}


BookSpan.prototype.UsePopupControl = function()
{
  // Popup control vale per data, ora e numerico. Non puo' essere combo e nemmeno check
  return this.Enabled && this.ControlType!=RD3_Glb.VISCTRL_COMBO && this.ControlType!=RD3_Glb.VISCTRL_CHECK && (RD3_Glb.IsDateOrTimeObject(this.DataType) || RD3_Glb.IsNumericObject(this.DataType));
}

BookSpan.prototype.GetPopupControlType = function()
{
  switch(this.DataType)
  {
    case 6: return RD3_Glb.CTRL_DATE;
    case 7: return RD3_Glb.CTRL_TIME;
    case 8: return RD3_Glb.CTRL_DATETIME;
    case 1:
    case 2:
    case 3:
    case 4: return RD3_Glb.CTRL_KEYNUM;
  }
}
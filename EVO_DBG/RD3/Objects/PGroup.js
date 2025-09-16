// ****************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PGroup: Rappresenta un gruppo di campi 
// ***************************************************

function PGroup(ppanel)
{
  // Proprieta' di questo oggetto di modello
  this.VisualStyle = -1;                // Visual Style associato al gruppo (-1: vedi il padre)
  this.Flags = 0;                       // Flag del gruppo
  this.Image = "";                      // Immagine di sfondo associata al gruppo
  this.Header = "";                     // Caption del gruppo
  this.Tooltip = "";                    // Tooltip del gruppo
  this.ListLeft = 0;                    // Posizione nella lista
  this.ListTop = 0;                     // Posizione nella lista (<0 per un gruppo in lista)
  this.ListWidth = 0;                   // Dimensione nella lista
  this.ListHeight = 0;                  // Dimensione nella lista
  this.FormLeft = 0;                    // Posizione in dettaglio
  this.FormTop = 0;                     // Posizione in dettaglio
  this.FormWidth = 0;                   // Dimensione in dettaglio
  this.FormHeight = 0;                  // Dimensione in dettaglio
  this.Page = 0;                        // Pagina a cui appartiene il gruppo
  this.ListHeaderPos = 0;               // Posizione dell'header rispetto alla riga del gruppo in lista
  this.FormHeaderPos = 0;               // Posizione dell'header rispetto alla riga del gruppo in dettaglio
  this.HeaderHeight = 0;                // Altezza dell'Header
  this.HeaderWidth = 0;                 // Larghezza dell'Header
  this.InList = false;                  // Gruppo formato da soli campi in lista?
  this.Identifier = "";                 // Identificatore del gruppo (univoco)
  this.ClassName = "";                  // Classe del gruppo
  //
  // Altre variabili di modello...
  this.ParentPanel = ppanel;            // L'oggetto pannello cui il gruppo appartiene
  this.IsListPositioned = false;        // True se il gruppo in lista e' stato gia' posizionato (messa a false all'inizio del calclayout del pannello)
  //
  this.Collapsible = false;             // Il gruppo e' collassabile
  this.Collapsed = false;               // Il gruppo e' collassato
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;                // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi al gruppo
  this.ListGroupBox = null;                 // Contenitore del gruppo in lista
  this.ListGroupSA = null;                  // Contenitore del gruppo nella scrolling area (se il gruppo e' diviso)
  this.FormGroupBox = null;                 // Contenitore del gruppo in form
  this.ListCaption = null;                  // Elemento Text della caption in lista
  this.ListCaptionSA = null;                // Elemento Text della caption in lista (Scrolling Area)
  this.FormCaption = null;                  // Elemento Text della caption in form
  this.ListHeader = null;                   // Span che contiene l'header del gruppo in layout list fuori lista
  this.FormHeader = null;                   // Span che contiene l'header del gruppo in layout form 
  this.ListCollapseButton = null;           // Immagine che contiene il pulsante del collassamento
  this.FormCollapseButton = null;           // Immagine che contiene il pulsante del collassamento
}


// *******************************************************************
// Inizializza questo PField leggendo i dati da un nodo XML
// *******************************************************************
PGroup.prototype.LoadFromXml = function(node)
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
PGroup.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta'
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
PGroup.prototype.LoadProperties = function(node)
{
  // NPQ 2092: lo stato di collassamento deve essere gestito
  // dopo aver gestito gli attributi mfl e mff;
  // in Java gli attributi vengono elencati in ordine alfabetico
  var val = node.getAttribute("col");
  if (val == "0" || val == "1")
  {
    node.removeAttribute("col");
    node.setAttribute("col", val);
  }
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
      case "flg": this.SetFlags(parseInt(valore)); break;
      case "img": this.SetImage(valore); break;
      case "cap": this.SetHeader(valore); break;
      case "tip": this.SetTooltip(valore); break;
      case "lle": this.SetListLeft(parseInt(valore)); break;
      case "lto": this.SetListTop(parseInt(valore)); break;
      case "lwi": this.SetListWidth(parseInt(valore)); break;
      case "lhe": this.SetListHeight(parseInt(valore)); break;
      case "fle": this.SetFormLeft(parseInt(valore)); break;
      case "fto": this.SetFormTop(parseInt(valore)); break;
      case "fwi": this.SetFormWidth(parseInt(valore)); break;
      case "fhe": this.SetFormHeight(parseInt(valore)); break;
      case "pag": this.SetPage(parseInt(valore)); break;
      case "lhp": this.SetListHeaderPosition(parseInt(valore)); break;
      case "fhp": this.SetFormHeaderPosition(parseInt(valore)); break;
      case "hhe": this.SetHeaderHeight(parseInt(valore)); break;
      case "hwi": this.SetHeaderWidth(parseInt(valore)); break;
      case "inl": this.SetInlist(valore == "1"); break;
      case "sty": this.SetVisualStyle(parseInt(valore)); break;
      case "clp": this.SetCollapsible(valore == "1"); break;
      case "col": this.SetCollapsed(valore == "1"); break;
      case "mfl": this.SetListMovedFields(valore == "1"); break;
      case "mff": this.SetFormMovedFields(valore == "1"); break;
      case "cln": this.SetClassName(valore); break;
      //
      case "cla": this.CollapseAnimDef = valore; break;
      //
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
PGroup.prototype.SetFlags = function(value)
{
  var old = this.Flags;
  //
  if (value != undefined)
    this.Flags = value;
  //
  if (this.Realized)
  {
    // Vediamo cosa e' cambiato
    // Controllo visibilita'
    var wasvis = old & 0x02; // OBJ_VISIBLE
    var isvis  = this.Flags & 0x02;
    //
    if (wasvis!=isvis || value==undefined)
      this.UpdateVisibility(true);
    //
    // Controllo abilitazione
    var wasena = old & 0x01; // OBJ_ENABLED
    var isena  = this.Flags & 0x01;
    //
    if (wasena!=isena || value==undefined)
      this.ParentPanel.UpdateGroupEnability(this);
  }
}

PGroup.prototype.SetImage = function(value)
{
  if (value != undefined)
    this.Image = value;
  //
  if (this.Realized)
  {
    if (this.Image != "")
    {
      if (this.ListGroupBox)
        this.ListGroupBox.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/" + encodeURI(this.Image) + ")";
      if (this.ListGroupSA)
        this.ListGroupSA.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/" + encodeURI(this.Image) + ")";
      if (this.FormGroupBox)
        this.FormGroupBox.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/" + encodeURI(this.Image) + ")";
    }
    else
    {
      if (this.ListGroupBox)
        this.ListGroupBox.style.backgroundImage = "";
      if (this.ListGroupSA)
        this.ListGroupSA.style.backgroundImage = "";
      if (this.FormGroupBox)
        this.FormGroupBox.style.backgroundImage = "";
    }
  }
}

PGroup.prototype.SetHeader = function(value)
{
  var old = this.Header;
  if (value != undefined)
    this.Header = value;
  //
  if (this.Realized)
  {
    if (this.ListCaption)
      this.ListCaption.nodeValue = this.Header;
    if (this.ListCaptionSA)
      this.ListCaptionSA.nodeValue = this.Header;
    if (this.FormCaption)
      this.FormCaption.nodeValue = this.Header;
    //
    // Se e' cambiato l'hader ricalcolo la sua dimensione (lo faccio scattare solo quando e' realmente cambiato l'header
    // e se e' necessario- ho un formheader oppure un listheader e non sono in list)
    if (this.Header!=old && (this.FormHeader || (!this.InList && this.ListHeader)))
    {
      // Creo un DIV con il testo dell'header
      var testel = document.createElement("div");
      testel.className = "group-header-box";
      testel.innerText = this.Header;
      //
      // Devo impostare gli stili: il calcolo mi serve solo per i fuori lista, quindi
      // se il gruppo ha un header form copio i suoi dettagli di stile, altrimenti li copio solo se il 
      // gruppo non e' in lista
      var s = this.FormHeader ? this.FormHeader.style : (!this.InList ? this.ListHeader.style : null);
      if (s)
      {
        testel.style.fontFamily = s.fontFamily;
        testel.style.fontWeight = s.fontWeight;
        testel.style.fontSize = s.fontSize;
        testel.style.fontStyle = s.fontStyle;
        testel.style.textDecoration = s.textDecoration;
      }
      //
      // Appendo il div al body, leggo la sua dimensione e lo tolgo
      document.body.appendChild(testel);
      var wh = testel.clientWidth;
      document.body.removeChild(testel);
      wh = this.Collapsible ? wh + 15 : wh;
      //
      this.SetHeaderWidth(wh);
    }
  }
}

PGroup.prototype.SetTooltip = function(value)
{
  if (value != undefined)
    this.Tooltip = value;
  //
  if (this.Realized)
  {
    if (this.ListGroupBox)
      RD3_TooltipManager.SetObjTitle(this.ListGroupBox, this.Tooltip);
    if (this.ListGroupSA)
      RD3_TooltipManager.SetObjTitle(this.ListGroupSA, this.Tooltip);
    if (this.FormGroupBox)
      RD3_TooltipManager.SetObjTitle(this.FormGroupBox, this.Tooltip);
  }
}

PGroup.prototype.SetListLeft = function(value)
{
  if (value != undefined)
    this.ListLeft = value;
  //
  if (this.Realized)
  {
    if (this.ListGroupBox)
    {
      this.ListGroupBox.style.left = this.ListLeft + "px";
      if (this.ListHeader)
        this.ListHeader.style.left = this.ListLeft + 4 + "px";
    }
    //
    this.ParentPanel.RecalcLayout = true;
  }
}

PGroup.prototype.SetListTop = function(value)
{
  if (value != undefined)
    this.ListTop = value;
  //
  if (this.Realized)
  {
    if (!this.InList) 
    {
      switch (this.ListHeaderPos)
      {
        case 1: // HDRGRP_NOHDR
          if (this.ListGroupBox) 
            this.ListGroupBox.style.top = this.ListTop + "px";
          if (this.ListHeader) 
            this.ListHeader.style.top = this.ListTop  + "px";
          break;
          
        case 2: // HDRGRP_ONBORDER
          if (this.ListGroupBox) 
            this.ListGroupBox.style.top = (this.ListTop - 5) + "px";
          if (this.ListHeader) 
            this.ListHeader.style.top = (this.ListTop - Math.floor(this.HeaderHeight/2) - 6)  + "px";
          break;
          
        case 3: // HDRGRP_OUTER
          if (this.ListGroupBox) 
            this.ListGroupBox.style.top = this.ListTop + "px";
          if (this.ListHeader) 
            this.ListHeader.style.top = (this.ListTop - this.HeaderHeight - 3) + "px";
          break;
          
        case 4: // HDRGRP_INNER
          if (this.ListGroupBox) 
            this.ListGroupBox.style.top = (this.ListTop - this.HeaderHeight - 6) + "px";
          if (this.ListHeader) 
            this.ListHeader.style.top = (this.ListTop - this.HeaderHeight - 3) + "px";
          break;
      }
    }
    //
    this.ParentPanel.RecalcLayout = true;
  }
}

PGroup.prototype.SetListWidth = function(value)
{
  if (value != undefined)
    this.ListWidth = value;
  //
  if (this.Realized)
  {
    if (this.ListGroupBox && this.ListWidth>1)
    {
      if (this.InList)
        this.ListGroupBox.style.width = (this.ListWidth - 1) + "px";  // Tolgo un pixel per correggere i bordi dei campi interni
      else
        this.ListGroupBox.style.width = this.ListWidth + "px";
    }
    //
    this.ParentPanel.RecalcLayout = true;
  }
}

PGroup.prototype.SetListHeight = function(value)
{
  if (value != undefined)
    this.ListHeight = value;
  //
  if (this.Realized && this.ListGroupBox && this.ListHeight>1)
  {
    if (this.InList)
    {
      this.ListGroupBox.style.height = (this.ListHeight-1) + "px";    // Tolgo un pixel per correggere i bordi dei campi interni
      if (this.ListGroupSA)
        this.ListGroupSA.style.height = this.ListGroupBox.style.height;
    }
    else
    {
      var sh = (this.Collapsed ? 0 : this.ListHeight);
      switch (this.ListHeaderPos)
      {
        case 1: // HDRGRP_NOHDR
          this.ListGroupBox.style.height = sh + "px";
          break;
          
        case 2: // HDRGRP_ONBORDER
          this.ListGroupBox.style.height = (sh+5) + "px";
          break;
          
        case 3: // HDRGRP_OUTER
          this.ListGroupBox.style.height = sh + "px";
          break;
          
        case 4: // HDRGRP_INNER
          this.ListGroupBox.style.height = (sh+this.HeaderHeight+6) + "px";
          break;
      }
    }
    //
    this.ParentPanel.RecalcLayout = true;
  }
}

PGroup.prototype.SetFormLeft = function(value)
{
  if (value != undefined)
    this.FormLeft = value;
  //
  if (this.Realized)
  {
    var ofs =  (RD3_Glb.IsMobile()?3:0);
    var ofsh = (RD3_Glb.IsMobile()?8:0);
    if (this.FormGroupBox)
    {
      this.FormGroupBox.style.left = (this.FormLeft+ofs) + "px";
      this.FormHeader.style.left = (this.FormLeft+4+ofsh) + "px";
    }
    //
    this.ParentPanel.RecalcLayout = true;
  }
}

PGroup.prototype.SetFormTop = function(value)
{
  if (value != undefined)
    this.FormTop = value;
  //
  if (this.Realized)
  {
    var ofs = (RD3_Glb.IsMobile()?3:0);
    switch (this.FormHeaderPos)
    {
      case 1: // HDRGRP_NOHDR
        if (this.FormGroupBox)
          this.FormGroupBox.style.top = (this.FormTop+ofs) + "px";
        if (this.FormHeader)
          this.FormHeader.style.top = (this.FormTop-ofs) + "px";
        break;
        
      case 2: // HDRGRP_ONBORDER
        if (this.FormGroupBox)
          this.FormGroupBox.style.top = (this.FormTop-5) + "px";
        if (this.FormHeader)
          this.FormHeader.style.top = (this.FormTop - Math.floor(this.HeaderHeight/2) - 6)  + "px";
        break;
        
      case 3: // HDRGRP_OUTER
        if (this.FormGroupBox)
          this.FormGroupBox.style.top = (this.FormTop+ofs) + "px";
        if (this.FormHeader)
          this.FormHeader.style.top = (this.FormTop - this.HeaderHeight - 3) + "px";
        break;
        
      case 4: // HDRGRP_INNER
        if (this.FormGroupBox)
          this.FormGroupBox.style.top = (this.FormTop - this.HeaderHeight - 6) + "px";
        if (this.FormHeader)
          this.FormHeader.style.top = (this.FormTop - this.HeaderHeight - 3) + "px";
        break;
    }
  }
}

PGroup.prototype.SetFormWidth = function(value)
{
  if (value != undefined)
    this.FormWidth = value;
  //
  if (this.Realized && this.FormGroupBox)
  {
    if (this.FormGroupBox && this.FormWidth>1)
    {
      var ofs = (RD3_Glb.IsMobile()?-8:0);
      this.FormGroupBox.style.width = (this.FormWidth+ofs) + "px";
    }
  }
}

PGroup.prototype.SetFormHeight = function(value)
{
  if (value != undefined)
    this.FormHeight = value;
  //
  if (this.Realized && this.FormGroupBox && this.FormHeight>0)
  {
    var sh = (this.Collapsed ? 0 : this.FormHeight + (RD3_Glb.IsMobile()?-9:0));
    switch (this.FormHeaderPos)
    {
      case 1: // HDRGRP_NOHDR
        this.FormGroupBox.style.height = sh + "px";
        break;
        
      case 2: // HDRGRP_ONBORDER
        this.FormGroupBox.style.height = (sh+5) + "px";
        break;
        
      case 3: // HDRGRP_OUTER
        this.FormGroupBox.style.height = sh + "px";
        break;
        
      case 4: // HDRGRP_INNER
        this.FormGroupBox.style.height = (sh+this.HeaderHeight+6) + "px";
        break;
    }
  }
}

PGroup.prototype.SetPage = function(value)
{
  if (value != undefined)
    this.Page = value;
  //
  if (this.Realized)
  {
    this.UpdateVisibility(true);
  }
}

PGroup.prototype.SetListHeaderPosition = function(value)
{
  // Non puo' cambiare a run time ed e' utilizzato nei setter delle posizioni
  if (value != undefined)
    this.ListHeaderPos = value;
  if (this.Realized)
  {
    if (!this.InList && this.ListHeader)
      this.ListHeader.style.display = (this.ListHeaderPos == 1) ? "none" : "";
  }
}

PGroup.prototype.SetFormHeaderPosition = function(value)
{
  // Non puo' cambiare a run time ed e' utilizzato nei setter delle posizioni
  if (value != undefined)
    this.FormHeaderPos = value;
  if (this.Realized)
  {
    if (this.FormHeader)
      this.FormHeader.style.display = (this.FormHeaderPos == 1) ? "none" : "";
  }
}

PGroup.prototype.SetHeaderHeight = function(value)
{
  if (value != undefined)
    this.HeaderHeight = value;
  //
  if (this.Realized)
  {
    // Imposto l'altezza dell'header
    if (this.ListGroupBox)
    {
      if (!this.InList && this.ListHeader)
        this.ListHeader.style.height = this.HeaderHeight + "px";
    }
    if (this.FormGroupBox && this.FormHeader)
    {
      this.FormHeader.style.height = this.HeaderHeight + "px";
    }
  }
}

PGroup.prototype.SetHeaderWidth = function(value)
{
  if (value != undefined)
    this.HeaderWidth = value;
  //
  if (this.Realized)
  {
    // Imposto l'altezza dell'header
    if (this.ListGroupBox)
    {
      if (!this.InList && this.ListHeader)
        this.ListHeader.style.width = (RD3_ServerParams.Theme.startsWith("zen") ? "auto" : this.HeaderWidth + "px");
    }
    if (this.FormGroupBox && this.FormHeader)
    {
      this.FormHeader.style.width = (RD3_ServerParams.Theme.startsWith("zen") ? "auto" : this.HeaderWidth + "px");
    }
  }
}

PGroup.prototype.SetInlist = function(value)
{
  // Questa proprieta' non puo' cambiare a runtime
  if (value != undefined)
    this.InList = value;
}

PGroup.prototype.SetVisualStyle = function(value)
{
  if (value!=undefined)
  {
    if (value.Identifier)
    {
      // Era gia' un visual style
      this.VisualStyle = value;
    }
    else
    {
      if (value != -1)
        this.VisualStyle = RD3_DesktopManager.ObjectMap["vis:"+value];
      else 
        this.VisualStyle = value;
    }
  }
  //
  if (this.Realized)
  {
    // Ottengo il Visual Style
    var vs = this.VisualStyle;
    if (vs == -1)
      vs = this.ParentPanel.VisualStyle;
    //
    if (this.ListGroupBox)
    {
      if (this.InList)
      {
        // Layout in lista (applico sempre lo sfondo)
        vs.ApplyGroupStyle(this.ListGroupBox, true, true);
        if (this.ListGroupSA)
          vs.ApplyGroupStyle(this.ListGroupSA, true, true);
        //
        // Mostro i bordi usando il VS del pannello
        this.ParentPanel.VisStyle.ApplyBorderStyle(this.ListGroupBox, 11);
        if (this.ListGroupSA)
          this.ParentPanel.VisStyle.ApplyBorderStyle(this.ListGroupSA, 11);
        //
        this.ListGroupBox.style.textAlign = "";
      }
      else
      {
        // Gruppo fuori lista (se sono in outer non imposto lo sfondo)
        var shback = (this.ListHeaderPos != 3) ? true : false;
        //
        // Se l'header e' OnBorder ed il suo sfondo e' trasparente non applico il suo sfondo ma applico quello 
        // del pannello, in questo modo copro la riga dell'intestazione
        if (this.ListHeaderPos==2 && vs.GetColor(12)=="transparent")
        {
          shback = false;
          //
          this.ListHeader.style.backgroundColor = this.ParentPanel.VisStyle.GetColor(6); // VISCLR_BACKPANEL = 6;
        }
        //
        vs.ApplyGroupStyle(this.ListHeader, false, shback);
        //
        // Imposto il bordo del gruppo
        vs.ApplyBorderStyle(this.ListGroupBox, 13);
        //
        // Imposto lo sfondo
        this.ListGroupBox.style.backgroundColor = vs.GetColor(12); // VISCLR_BACKGRPFORM
      }
    }
    //
    if (this.FormGroupBox && this.FormHeader)
    {
      // Gruppo in dettaglio  (se sono in outer non imposto lo sfondo)
      var shback = (this.FormHeaderPos != 3) ? true : false;
      //
      // Se l'header e' OnBorder ed il suo sfondo e' trasparente non applico il suo sfondo ma applico quello 
      // del pannello, in questo modo copro la riga dell'intestazione
      if (this.FormHeaderPos==2 && vs.GetColor(12)=="transparent")
      {
        shback = false;
        //
        this.FormHeader.style.backgroundColor = this.ParentPanel.VisStyle.GetColor(6); // VISCLR_BACKPANEL = 6;
      }
      //
      vs.ApplyGroupStyle(this.FormHeader, false, shback);
      //
      // Imposto il bordo del gruppo
      vs.ApplyBorderStyle(this.FormGroupBox, 13);
      //
      // Imposto lo sfondo
      this.FormGroupBox.style.backgroundColor = vs.GetColor(12); // VISCLR_BACKGRPFORM  
    }
  }
}

PGroup.prototype.SetClassName = function(value) 
{
  var oldC = this.ClassName;
  if (value!=undefined)
    this.ClassName = value;
  //
  // Se e' cambiata la classe o ancora non l'ho applicata allora la applico
  if (((oldC != this.ClassName) || value == undefined) && this.Realized) 
  {
    if (this.ListGroupBox) 
    {
      // Rimuovo la classe precedente
      if (oldC && oldC != "")
        RD3_Glb.RemoveClass2(this.ListGroupBox, oldC);
      //
      // Applico la nuova classe
      if (this.ClassName && this.ClassName != "")
        RD3_Glb.AddClass(this.ListGroupBox, this.ClassName);
    }
    if (this.FormGroupBox)
    {
      // Rimuovo la classe precedente
      if (oldC && oldC != "")
        RD3_Glb.RemoveClass2(this.FormGroupBox, oldC);
      //
      // Applico la nuova classe
      if (this.ClassName && this.ClassName != "")
        RD3_Glb.AddClass(this.FormGroupBox, this.ClassName);
    }
  }
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
PGroup.prototype.Realize = function(parent)
{
  // NOTA: parent qui e' undefined perche' il gruppo si deve
  //       realizzare sia nel layout form (FORMBOX) che lista (LISTBOX)
  //       viene quindi usato il riferimento al padre per recuperarli
  //
  // Creo gli oggetti per la lista se presente
  var mob = RD3_Glb.IsMobile();
  if (this.ParentPanel.HasList)
  {
    this.ListGroupBox = document.createElement("div");
    this.ListGroupBox.id = this.Identifier + ":lht";
    this.ListCaption = document.createTextNode("");
    //
    // E' un gruppo in lista?
    if (this.InList)
    {
      this.ListGroupBox.className = "group-list-box";
      //
      // Aggiungo l'elemento al DOM
      this.ListGroupBox.appendChild(this.ListCaption);
      this.ParentPanel.ListListBox.appendChild(this.ListGroupBox);
    }
    else
    {
      // Non e' un elemento in lista: devo creare il div per la caption del gruppo
      this.ListHeader = document.createElement("div");
      this.ListHeader.className = "group-header-box";
      this.ListHeader.setAttribute("id", this.Identifier+":hdr");
      //
      this.ListGroupBox.className = "group-form-box";
      //
      // Creo il pulsante di collassamento
      this.ListCollapseButton = document.createElement("img");
      this.ListCollapseButton.setAttribute("id", this.Identifier+":collapse");
      this.ListCollapseButton.className = "group-collapse-img";
      this.ListCollapseButton.style.verticalAlign = "baseline";
      if (!mob) this.ListCollapseButton.src = RD3_Glb.GetImgSrc("images/grcl.gif");
      this.ListHeader.appendChild(this.ListCollapseButton);
      //
      // Aggiungo l'elemento al DOM
      this.ListHeader.appendChild(this.ListCaption);
      this.ParentPanel.ListBox.appendChild(this.ListGroupBox);
      this.ParentPanel.ListBox.appendChild(this.ListHeader);
    }    
  }
  //
  // Creo gli oggetti per il dettaglio se presenti
  if (this.ParentPanel.HasForm)
  {
    this.FormGroupBox = document.createElement("div");
    this.FormGroupBox.className = "group-form-box";
    this.FormGroupBox.id = this.Identifier + ":lht";
    this.FormCaption = document.createTextNode("");
    //
    this.FormHeader = document.createElement("div");
    this.FormHeader.className = "group-header-box";
    this.FormHeader.setAttribute("id", this.Identifier+":hdr");
    //
    // Creo il pulsante di collassamento
    this.FormCollapseButton = document.createElement("img");
    this.FormCollapseButton.setAttribute("id", this.Identifier+":collapse");
    this.FormCollapseButton.className = "group-collapse-img";
    this.FormCollapseButton.style.verticalAlign = "baseline";
    if (!mob) this.FormCollapseButton.src = RD3_Glb.GetImgSrc("images/grcl.gif");
    this.FormHeader.appendChild(this.FormCollapseButton);
    //
    // Aggiungo l'elemento al DOM
    this.FormHeader.appendChild(this.FormCaption);
    this.ParentPanel.FormBox.appendChild(this.FormGroupBox);
    this.ParentPanel.FormBox.appendChild(this.FormHeader);
  }
  //
  this.Realized = true;
  //
  this.SetFlags(); 
  this.SetImage();
  this.SetHeader();
  this.SetTooltip(); 
  this.SetListLeft();
  this.SetListTop();
  this.SetListWidth();
  this.SetListHeight();
  this.SetFormLeft();
  this.SetFormTop();
  this.SetFormWidth();
  this.SetFormHeight();
  this.SetPage();
  this.SetListHeaderPosition();
  this.SetFormHeaderPosition();
  this.SetHeaderHeight();
  this.SetHeaderWidth();
  this.SetInlist();
  this.SetVisualStyle();
  this.SetCollapsible();
  this.SetClassName();
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PGroup.prototype.Unrealize = function()
{ 
  // Rimuovo il gruppo dal DOM
  if (this.ListGroupBox)
    this.ListGroupBox.parentNode.removeChild(this.ListGroupBox);
  if (this.ListGroupSA)
    this.ListGroupSA.parentNode.removeChild(this.ListGroupSA);
  if (this.ListHeader)
    this.ListHeader.parentNode.removeChild(this.ListHeader);
  if (this.FormGroupBox)
    this.FormGroupBox.parentNode.removeChild(this.FormGroupBox);
  if (this.FormHeader)
    this.FormHeader.parentNode.removeChild(this.FormHeader);
  //
  // Mi tolgo dalla mappa degli oggetti
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Elimino i riferimenti al DOM
  this.ListGroupBox = null;
  this.ListGroupSA = null;
  this.FormGroupBox = null;
  this.ListCaption = null;
  this.ListCaptionSA = null;
  this.FormCaption = null;
  this.ListHeader = null; 
  this.FormHeader = null;
  this.ListCollapseButton = null;
  this.FormCollapseButton = null;
  //
  this.Realized = false; 
}


// ********************************************************************************
// Restituisce true se questo gruppo e' visibile
// ********************************************************************************
PGroup.prototype.IsVisible = function()
{
  // Verifico se appartengo ad una pagina e la pagina e' visibile
  var vis = false;
  if (this.Page != -1)
  {
    if (this.ParentPanel.PanelPage == this.Page)
      vis = true;
    else
      vis = false;
  }
  else
    vis = true;
  //
  // Verifico la mia visibilita'
  if (vis)
  {
    // OBJ_VISIBLE = 0x2
    if ((this.Flags & 0x2) != 0)
      vis = true;
    else
      vis = false;
  }
  //
  return vis;
}


// ********************************************************************************
// Restituisce true se questo gruppo e' abilitato
// ********************************************************************************
PGroup.prototype.IsEnabled = function()
{
  return this.Flags & 0x01; // OBJ_ENABLED
}


// ********************************************************************************
// Gestisce la visibilita' del gruppo
// ********************************************************************************
PGroup.prototype.UpdateVisibility = function(updflag)
{
  // Aggiorno la visibilita' del gruppo
  var s = this.IsVisible();
  var sl = s && this.ListWidth>0;
  var sf = s && this.FormWidth>0;
  var dl =  sl? "" : "none";
  var df =  sf? "" : "none";
  //
  if (this.ListGroupBox)
    RD3_Glb.SetDisplay(this.ListGroupBox, (this.InList && this.ListHeaderPos == 1 ? "none" : dl));
  if (this.ListGroupSA)
    this.ListGroupSA.style.display = this.ListGroupBox.style.display;
  if (this.ListHeader)
    RD3_Glb.SetDisplay(this.ListHeader, (this.ListHeaderPos == 1 ? "none" : dl));
  if (this.FormGroupBox)
    RD3_Glb.SetDisplay(this.FormGroupBox, df);
  if (this.FormHeader)
    RD3_Glb.SetDisplay(this.FormHeader, (this.FormHeaderPos == 1 ? "none" : df));
  //
  // Avverto il pannello che la mia visibilita' e' cambiata
  // Sistemo anche l'abilitazione dei campi, infatti potrebbero essere rimasti
  // disabilitati perche' invisibili da sempre
  if (updflag)
  {
    this.ParentPanel.UpdateGroupVisibility(this);
    this.ParentPanel.UpdateGroupEnability(this);
  }
  else 
  {
    // Magari avevo saltato la gestione del collapsed perche' non ero visibile, provo a gestirla ora
    // (lo faccio qui perche' la mia visibilita' e' cambiata dal pannello, non dal server - panelPage)
    this.SetCollapsed();
  }
}


// ********************************************************************************
// Posiziona il gruppo nella posizione specificata in lista, solo se non e' gia' stato
// posizionato (IsListPositioned = false)
// ********************************************************************************
PGroup.prototype.SetListPosition = function(left, top, par, wid)
{
  if (!this.Realized)
    return;
  //
  var box = this.ListGroupBox;
  //
  // Se avevo gia' iniziato il posizionamento in lista, ma ora mi viene chiesto un parent diverso,
  // devo attivare la scrolling area box
  if (this.IsListPositioned && box.parentNode!=par && this.InList)
  {
    // Creo ed imposto la ListGroupSA
    if (!this.ListGroupSA)
    {
      this.ListGroupSA = document.createElement("div");
      this.ListGroupSA.id = this.Identifier + ":sa";
      this.ListGroupSA.className = "group-list-box";
      this.ListCaptionSA = document.createTextNode(this.Header);
      this.ListGroupSA.appendChild(this.ListCaptionSA);
      par.appendChild(this.ListGroupSA);
      //
      this.ListGroupSA.style.left = left + "px";
      this.ListGroupSA.style.top = top + "px";
      this.ListGroupSA.style.height = this.ListGroupBox.style.height;
      this.ListGroupSA.style.top = top + "px";
      //
      // Layout in lista (applico sempre lo sfondo)
      this.VisualStyle.ApplyGroupStyle(this.ListGroupSA, true, true);
      //
      // Mostro i bordi usando il VS del pannello
      this.ParentPanel.VisStyle.ApplyBorderStyle(this.ListGroupSA, 11);
      this.ListGroupSA.style.textAlign="";
      //
      RD3_TooltipManager.SetObjTitle(this.ListGroupSA, this.ListGroupBox.title);
      this.ListGroupSA.style.backgroundImage = this.ListGroupBox.style.backgroundImage;
      //
      this.ListWidth = 0;
    }
    // Continuo con quella
    box = this.ListGroupSA;
  }
  //
  if (!this.IsListPositioned && this.InList && box)
  {
    box.style.left = left + "px";
    box.style.top = top + "px";
    //
    if (box.parentNode!=par)
    {
      box.parentNode.removeChild(box);
      par.appendChild(box);
    }
    //
    this.IsListPositioned = true;
    this.ListWidth = 0;
  }
  //
  this.ListWidth += wid;
  box.style.width = (this.ListWidth>0 ? this.ListWidth-1 : 0 ) + "px";
}


// ********************************************************************************
// Reimposto le variabili per il posizionamento in lista (con fixedcol>0)
// ********************************************************************************
PGroup.prototype.ResetListPosition = function()
{
  this.IsListPositioned = false;
  if (this.ListGroupSA)
  {
    this.ListGroupSA.parentNode.removeChild(this.ListGroupSA);
    this.ListGroupSA = null;
  }
  //
  // Metto ListWidth a 0 perche' IDPanel prima chiama la ResetListPosition sui gruppi, poi cicla sui campi impostando la loro posiziona
  // ( e per i gruppi impostando ListWidth) e poi chiama UpdateVisibilty dei gruppi; in questo modo se non c'e' nessun campo visibile 
  // per questo gruppo sparisce anche l'intestazione in lista
  if (this.InList)
    this.ListWidth = 0;
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
PGroup.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "")
    return false;
  //
  var ok = false;
  if (obj == this.ListGroupBox || obj == this.ListHeader)
  {
    tip.SetObj(this.ListGroupBox);
    ok = true;
  }
  //
  if (obj == this.FormGroupBox || obj == this.FormHeader)
  {
    tip.SetObj(this.FormGroupBox);
    ok = true;
  }
  //
/*  if (obj == this.FormCollapseButton || obj == this.ListCollapseButton)
  {
    tip.SetObj(obj);
    tip.SetTitle("Titolo Group");
    tip.SetText("Testo Group");
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + ((obj.offsetWidth-4)/2), RD3_Glb.GetScreenTop(obj));
    tip.SetPosition(0);
    return true;
  }*/
  //
  if (ok)
  {
    tip.SetTitle(this.Header);
    tip.SetText(this.Tooltip);
    tip.SetAutoAnchor(true);
    tip.SetPosition(2);
    return true;
  }
  //
  return false;
}

// *********************************************************
// Imposta la proprieta' Collapsible
// *********************************************************
PGroup.prototype.SetCollapsible = function(value) 
{
  var old = this.Collapsible;
  if (value!=undefined)
    this.Collapsible = value;
  //
  if (this.Realized)
  {
    if (this.ListHeader)
    {
      this.ListHeader.onclick = (this.Collapsible ? new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCollapseClick', ev)") : null);
      this.ListHeader.style.cursor = (this.Collapsible ? "pointer" : "");
    }
    //
    if (this.FormHeader)
    {
      this.FormHeader.onclick = (this.Collapsible ? new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnCollapseClick', ev)") : null);
      this.FormHeader.style.cursor = (this.Collapsible ? "pointer" : "");
    }
    //
    if (this.ListCollapseButton)
      this.ListCollapseButton.style.display = (this.Collapsible ? "" : "none");
    //
    if (this.FormCollapseButton)
      this.FormCollapseButton.style.display = (this.Collapsible ? "" : "none");
    //
    // Se la proprieta' e' cambiata oppure sono in inizializzazione (value == undefined) devo gestire l'allargamento o restringimento dell'header
    // per fare spazio all'immagine
    if (this.Collapsible!=old || value == undefined)
    {
      // Nell'inizializzazione se il gruppo e' collasabile allargo l'header per contenere anche l'immagine
      if (value == undefined && this.Collapsible)
        this.SetHeaderWidth(this.HeaderWidth+15);
      else if (this.Collapsible!=old)
        this.SetHeaderWidth(this.Collapsible ? this.HeaderWidth+15 : this.HeaderWidth-15);
    }
  }
}

PGroup.prototype.SetListMovedFields = function(value)
{
  this.ListMovedFields = value;
}

PGroup.prototype.SetFormMovedFields = function(value)
{
  this.FormMovedFields = value;
}

// *********************************************************
// Imposta la proprieta' Collapsed
// *********************************************************
PGroup.prototype.SetCollapsed = function(value, evento) 
{
  var old = this.Collapsed;
  //
  if (value!=undefined)
    this.Collapsed = value;
  //
  if (this.Realized && (old != this.Collapsed || value == undefined) && this.IsVisible())
  {
    var LayoutList = (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST);
    //
    // Aggiorno l'immagine corretta per il pulsante collapse
    var imgSrc = RD3_Glb.GetImgSrc("images/gr" + (this.Collapsed ? "xp" : "cl") +".gif");
    if (LayoutList && this.ListCollapseButton)
      if (!RD3_Glb.IsMobile()) this.ListCollapseButton.src = imgSrc;
    if (!LayoutList && this.FormCollapseButton)
      if (!RD3_Glb.IsMobile()) this.FormCollapseButton.src = imgSrc;
    //
    // Decido se devo spostare i campi:
    var MoveFields = true;
    //
    // Se l'evento viene dal server controllo che i campi non siano gia' stati spostati
    if (!evento)
      MoveFields = !(LayoutList ? this.ListMovedFields : this.FormMovedFields);
    //
    // Controllo se nel layout e' cambiato Collapsed
    var WasCollapsed = ((LayoutList ? this.WasLCollapsed : this.WasFCollapsed) == true);
    if (MoveFields && value == undefined)
    {
      if (this.Collapsed != WasCollapsed)
        this.CalcLayout();
      else
        MoveFields = false;
    }
    //
    // Cerco i miei campi e quelli sotto di me
    this.FindObjectsUnderMe(WasCollapsed);
    //
    // Mi memorizzo Collapsed per il layout corrente
    if (LayoutList)
      this.WasLCollapsed = this.Collapsed;
    else
      this.WasFCollapsed = this.Collapsed;
    //
    // Ora, posso spostare i campi
    if (MoveFields)
    {
      // Calcolo di quanto devo muovere gruppo e campi sottostanti
      var deltaH = (LayoutList ? this.ListHeight : this.FormHeight);
      if (this.Collapsed)
        deltaH = -deltaH;
      //
      // Notifico gli eventi degli spostamenti dei campi sotto di me
      // Gli spostamenti reali verranno fatti dall'animazione
      n = this.FieldsUnderMe.length;
      for (var i=0; i<n; i++)
      {
        var fld = this.FieldsUnderMe[i];
        if (LayoutList)
        {
          var ev = new IDEvent("resize", fld.Identifier, evento, RD3_Glb.EVENT_SERVERSIDE, "list", fld.ListWidth, fld.ListHeight, fld.ListLeft, fld.ListTop + deltaH);
        }
        else
        {
          var ev = new IDEvent("resize", fld.Identifier, evento, RD3_Glb.EVENT_SERVERSIDE, "form", fld.FormWidth, fld.FormHeight, fld.FormLeft, fld.FormTop + deltaH);
        }
      }
    }
    //
    // Notifico l'evento di cambio Collapsed avvenuto
    // Se il server e' gia' allineato l'evento glielo mando in differita
    // perche' dovra' comunque essere informato del fatto che ho spostato i campi
    var evt = (old == this.Collapsed ? RD3_Glb.EVENT_DEFERRED : RD3_Glb.EVENT_ACTIVE);
    var ev = new IDEvent("grpcol", this.Identifier, evento, evt, !this.Collapsed ? "exp" : "col");
    //
    // Imposto l'animazione, saltandola se non ho un valore (sono dentro la realize)
    var fx = new GFX("group", this.Collapsed, this, (value==undefined) || this.ParentPanel.WebForm.Animating || !MoveFields, null, this.CollapseAnimDef);
    fx.Immediate = true;
    //
    // Comunico all'animazione se deve spostare i campi
    fx.MoveFields = MoveFields;
    //
    RD3_GFXManager.AddEffect(fx);
    //
    // Se mi sono espanso aggiorno i miei campi
    if (old != this.Collapsed && !this.Collapsed)
    {
      var n = this.ParentPanel.Fields.length;
      for (var i=0; i<n; i++)
      {
        var rw = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
        var fld = this.ParentPanel.Fields[i];
        if (fld.Group == this && rw < fld.PValues.length && fld.PValues[rw])
          fld.PValues[rw].UpdateScreen();
      }
    }
  }
}

// ********************************************************************************
// Gestore evento di click sul pulsante Collapse
// ********************************************************************************
PGroup.prototype.OnCollapseClick= function(evento)
{
  // Annullo l'elemento fuocato in modo che non venga rifuocato
  RD3_KBManager.ActiveElement = null;
  RD3_KBManager.LastActiveObject = null;
  RD3_KBManager.ActiveObject = null;
  //
  // L'esecuzione locale di un evento di collapse fa collassare o meno il gruppo
  this.SetCollapsed(!this.Collapsed, evento);
  //
  var fldToFocus;
  var lastFld = null;
  //
  // In lista evito di gestire il caso di scroll
  if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST)
    return;
  //
  for (var i = 0; i < this.ParentPanel.Fields.length; i++) {
    var fld = this.ParentPanel.Fields[i];
    //
    if (this.ParentPanel.AdvTabOrder && this.ParentPanel.PanelMode == RD3_Glb.PANEL_FORM)
      fld = this.ParentPanel.FormTabOrder[i];
    //
    // Se sono collassato devo dare fuoco all'ultimo campo visibile che sia prima del gruppo,
    // se sono espanso do' il fuoco al mio primo campo
    if (fld.Group == this) {
      fldToFocus = this.Collapsed ? lastFld : fld;
      break;
    }
    //
    // Mi memorizzo l'ultimo campo visibile
    lastFld = fld.IsVisible(this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow + 1) && fld.IsEnabled(this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow + 1) ? fld : lastFld;
  }
  // Siccome c'e' l'animazione uso un timer..
  if (fldToFocus) {
    if (this.Collapsed)
      fldToFocus.Focus();
    else {
      if (lastFld)
        lastFld.Focus();
      window.setTimeout(function () {
        fldToFocus.Focus();
      }, 200);
    }
  }
}

// ********************************************************************************
// Cerca i campi appartenenti al gruppo e quelli sottostanti
// ********************************************************************************
PGroup.prototype.FindObjectsUnderMe = function(flColl)
{
  this.MyFields = new Array();
  this.FieldsUnderMe = new Array();
  //
  var ofs = (RD3_Glb.IsMobile()?3:0);
  var pan = this.ParentPanel;
  var n = pan.Fields.length;
  //
  for (var i=0; i<n; i++)
  {
    var fld = pan.Fields[i];
    //
    // Se il campo e' in un'altra pagina non c'entra
    if (fld.Page != this.Page)
      continue;
    //
    var o = (fld.Group ? fld.Group : fld);
    if (pan.PanelMode == RD3_Glb.PANEL_LIST && fld.InList && !fld.ListList)
    {
      // Se il campo fa parte del gruppo
      if (fld.Group == this)
      {
        this.MyFields.push(fld);
      }
      else
      {
        // Se sta sotto del gruppo e non sporge ne a sinistra ne a destra del gruppo
        var h = (flColl ? 0 : this.ListHeight);
        if ((this.ListTop + h <= o.ListTop) && (this.ListLeft <= o.ListLeft) && (this.ListLeft + this.ListWidth >= o.ListLeft + o.ListWidth - ofs))
        {
          this.FieldsUnderMe.push(fld);
        }
      }
    }
    else if (pan.PanelMode == RD3_Glb.PANEL_FORM && fld.InForm)
    {
      // Se il campo fa parte del gruppo
      if (fld.Group == this)
      {
        this.MyFields.push(fld);
      }
      else
      {
        // Se sta sotto del gruppo e non sporge ne a sinistra ne a destra del gruppo
        var h = (flColl ? 0 : this.FormHeight);
        if ((this.FormTop + h <= o.FormTop) && (this.FormLeft <= o.FormLeft) && (this.FormLeft + this.FormWidth >= o.FormLeft + o.FormWidth - ofs))
        {
          this.FieldsUnderMe.push(fld);
        }
      }
    }
  }
}

// ********************************************************************************
// Calcola le dimensioni del div in base alla dimensione del contenuto
// ********************************************************************************
PGroup.prototype.CalcLayout = function()
{
  var LayoutList = (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST);
  //
  // I gruppi in lista si sistemano da soli
  if (LayoutList && this.InList)
    return false;
  //
  // Ora cerco tutti i campi appartenenti a questo gruppo e ne calcolo la MinLeft e MinTop
  var grect = new Rect(10000, 10000, 0, 0);
  var resize = false;
  var nf = this.ParentPanel.Fields.length;
  for (var j=0; j<nf; j++)
  {
    var f = this.ParentPanel.Fields[j];
    //
    // Se il campo e' visibile e appartiene ad un gruppo, aggiorno la posizione/dimensione del gruppo
    if (LayoutList)
    {
      // Il pannello e' in lista, considero solo i campi fuori lista
      if (f.InList && f.IsVisible(true) && f.Group==this)
      {
        // Il campo e' fuori-lista, mi serve il minimo LEFT/TOP ed il massimo RIGHT/BOTTOM
        if (f.ListLeft < grect.x) grect.x = f.ListLeft;
        if (f.ListTop < grect.y) grect.y = f.ListTop;
        if (f.ListLeft+f.ListWidth > grect.w) grect.w = f.ListLeft+f.ListWidth;
        if (f.ListTop+f.ListHeight > grect.h) grect.h = f.ListTop+f.ListHeight;
        resize = true;
      }
    }
    else
    {
      // Il pannello e' in form, considero solo i campi in form
      if (f.InForm && f.IsVisible(true) && f.Group==this)
      {
        // Il campo e' in form, mi serve il minimo LEFT/TOP ed il massimo RIGHT/BOTTOM
        if (f.FormLeft < grect.x) grect.x = f.FormLeft;
        if (f.FormTop < grect.y) grect.y = f.FormTop;
        if (f.FormLeft+f.FormWidth > grect.w) grect.w = f.FormLeft+f.FormWidth;
        if (f.FormTop+f.FormHeight > grect.h) grect.h = f.FormTop+f.FormHeight;
        resize = true;
      }
    }
  }
  //
  if (!resize)
    return false;
  //
  if (LayoutList)
  {
    // Gruppo di campi fuori/lista
    this.SetListLeft(grect.x-4 + this.ParentPanel.RowSelWidth());
    this.SetListTop(grect.y-4);
    this.SetListWidth(grect.w-grect.x+8);
    this.SetListHeight(grect.h-grect.y+8);
  }
  else
  {
    this.SetFormLeft(grect.x-4);
    this.SetFormTop(grect.y-4);
    this.SetFormWidth(grect.w-grect.x+8);
    this.SetFormHeight(grect.h-grect.y+8);
  }
  //
  return true;
}

// ********************************************************************************
// La caption e' stata toccata dall'utente
// ********************************************************************************
PGroup.prototype.OnTouchDown= function(evento, click)
{
  this.ParentPanel.OnTouchDown(evento);
  //
  return true;
}


PGroup.prototype.OnTouchUp= function(evento, click)
{
  if (click && RD3_Glb.IsTouch() && this.Collapsible)
    this.OnCollapseClick(evento);
  //
  this.ParentPanel.OnTouchUp(evento, click);
  //
  return true;
}
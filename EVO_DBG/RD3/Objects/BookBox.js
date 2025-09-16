// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe BookBox: Rappresenta una box di sezione
// o di mastro di un book
// ************************************************

function BookBox(ppage)
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = null;             // Identificatore della box (univoco)
  this.XPos = 0;                      // Posizione della box
  this.YPos = 0;                      // Posizione della box
  this.Width = 0;                     // Larghezza della box
  this.Height = 0;                    // Altezza della box
  this.VisStyle = null;               // Visual Style associato a questa box
  this.Image = "";                    // Immagine di sfondo da mostrare
  this.Interline = 0;                 // Interlinea
  this.Stretch = RD3_Glb.STRTC_AUTO;  // Tipo di stretch da applicare all'immagine
  this.Visible = true;                // Box visibile?
  this.CanDrag = false;               // E' possibile il drag?
  this.CanDrop = false;               // E' possibile il drop?
  this.CanTransform = false;          // E' possibile il movimento/ridimensionamento?
  this.CanScroll = false;             // E' possibile lo scroll del contenuto?
  this.CanClick = false;              // E' possibile cliccare sulla box?
  this.Tooltip = "";                  // Tooltip da mostrare
  this.GraphFile = "";                // File immagine del grafico da mostrare
  this.GraphMap = "";                 // Mappa dei click del grafico
  this.NumRows = 1;                   // Numero di righe di input che possono essere contenute in questo testo
  this.VisualFlags = -1;              // Flag visuali
  this.SubForm = null;                // Eventuale sub-form (se presente)
  this.Badge = "";                    // Testo del Badge da assegnare alla box
  this.ClassName;                     // Classe aggiuntiva
  //
  this.BackColor = ""; // Colore di background
  this.ForeColor = ""; // Colore di foreground
  this.FontMod = "";   // Proprieta' del carattere
  this.Alignment = 1;  // Allineamento orizzontale
  this.VAlignment = 1; // Allineamento verticale
  //
  // Oggetti figli di questo nodo
  this.SubSections = null;      // Sezioni dei sottoreport (solo se c'e' il sottoreport)
  this.Spans = null;            // Span in esso contenuti (solo se ci sono)
  //
  // Altre variabili di modello...
  this.ParentPage = ppage;      // L'oggetto pagina in cui e' inserita
  this.MastroWithSections=false;// Indica che questa box mastro conterra' delle sezioni 
  this.Alternate = false;       // La box deve applicare lo stile alternato?
  this.ParentSect = null;       // L'oggetto sezione in cui e' stata inserita la box (se box di sezione)
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo nodo
  this.ClickEventDef = RD3_Glb.EVENT_ACTIVE;      // Il click sulla box o su un punto del grafico
  this.DropEventDef = RD3_Glb.EVENT_ACTIVE;       // Drop sulla box
  this.TransformEventDef = RD3_Glb.EVENT_ACTIVE;  // Movimento/Ridimensionamento della box
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi alla box
  this.BoxBox = null;          // Il DIV complessivo della box (c'e' sempre)
  this.BoxImg = null;          // IMG che contiene lo sfondo della box (solo se c'e' l'immagine)
  this.BoxGraph = null         // Elemento IMG in cui viene renderizzato il grafico (solo se c'e' il grafico)
  this.BoxMap = null;          // Span in cui viene inserita la mappa di un grafico attivo (solo se c'e' un grafico attivo)
  this.BadgeObj = null;        // Il DIV che mostra il Badge
}


// *******************************************************************
// Inizializza questa box leggendo i dati da un nodo <box> XML
// *******************************************************************
BookBox.prototype.LoadFromXml = function(node) 
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
      case "sec":
      {
        var newnode = new BookSection(this.ParentPage);
        newnode.LoadFromXml(objnode);
        //
        // E' una sub-section, le comunico che io sono suo padre
        newnode.ParentBox = this;
        //
        if (!this.SubSections) this.SubSections = new Array();
          this.SubSections[this.SubSections.length] = newnode;
      }
      break;
      
      case "spn":
      {
        var newnode = new BookSpan(this);
        newnode.LoadFromXml(objnode);
        newnode.Alternate = this.Alternate;
        //
        if (!this.Spans) this.Spans = new Array();
        this.Spans[this.Spans.length] = newnode;
      }
      break;
      
      case "frm":
        this.SetSubForm("1", node);
      break;

    }
  }    
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
BookBox.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta'
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
BookBox.prototype.LoadProperties = function(node)
{
  // Ciclo su tutti gli attributi del nodo
  var attrlist = node.attributes;
  var mm = this.ParentPage.UM=="mm";
  var n = attrlist.length;
  for (var i=0; i<n; i++)
  {
    var attrnode = attrlist.item(i);
    var valore = attrnode.nodeValue;
    //
    switch(attrnode.nodeName)
    {
      case "xp":  this.SetXPos((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
      case "yp":  this.SetYPos((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
      case "wid": this.SetWidth((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
      case "hei": this.SetHeight((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
      case "sty": this.SetVisStyle(valore); break;
      case "img": this.SetImage(valore); break;
      case "int": this.SetInterline(valore); break;
      case "str": this.SetStretch(parseInt(valore)); break;
      case "vis": this.SetVisible(valore=="1"); break;
      case "vfl": this.SetVisualFlags(parseInt(valore)); break;
      case "dra": this.SetCanDrag(valore=="1"); break;
      case "dro": this.SetCanDrop(valore=="1"); break;
      case "tra": this.SetCanTransform(valore=="1"); break;
      case "scr": this.SetCanScroll(valore=="1"); break;
      case "act": this.SetCanClick(valore=="1"); break;
      case "tip": this.SetTooltip(valore); break;
      case "grf": this.SetGraphFile(valore); break;
      case "grm": this.SetGraphMap(valore); break;
      case "num": this.SetNumRows(parseInt(valore)); break;
      case "csf": this.SetSubForm(parseInt(valore), node); break;
      case "bkc": this.SetBackColor(valore); break;
      case "frc": this.SetForeColor(valore); break;
      case "ftm": this.SetFontMod(valore); break;
      case "aln": this.SetAlignment(parseInt(valore)); break;
      case "valn":this.SetVAlignment(parseInt(valore)); break;
      case "bdg": this.SetBadge(valore); break;
      case "cln": this.SetClassName(valore); break;
      
      case "clk": this.ClickEventDef = parseInt(valore); break;
      
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
BookBox.prototype.SetXPos= function(value) 
{
  if (value!=undefined)
  {
    if (this.XPos != value) 
      this.ParentPage.ParentBook.RecalcLayout = true;
    this.XPos = value;
  }
}

BookBox.prototype.SetYPos= function(value) 
{
  if (value!=undefined)
  {
    if (this.YPos != value)
      this.ParentPage.ParentBook.RecalcLayout = true;
    this.YPos = value;
  }
}

BookBox.prototype.SetWidth= function(value) 
{
  if (value!=undefined)
  {
    if (this.Width != value)
    {
      this.ParentPage.ParentBook.RecalcLayout = true;
      //
      // Propago la modifica ai miei span
      if (this.Realized && this.Spans)
      {
        var n = this.Spans.length;
        for(var i=0; i<n; i++)
          this.Spans[i].UpdateWidth(this.Width, value);
      }
    }
    //
    this.Width = value;
  }
}

BookBox.prototype.SetHeight= function(value) 
{
  if (value!=undefined)
  {
    if (this.Height != value)
    {
      this.ParentPage.ParentBook.RecalcLayout = true;
      //
      // Propago la modifica ai miei span
      if (this.Realized && this.Spans)
      {
        var n = this.Spans.length;
        for(var i=0; i<n; i++)
          this.Spans[i].UpdateHeight(this.Height, value);
      }
    }
    //
    this.Height = value;
  }
}

BookBox.prototype.SetNumRows= function(value) 
{
  var old = this.NumRows;
  if (value!=undefined)
  {
    this.NumRows = value;
    //
    // Se e' cambiato e sono gia' realizzata, ricreo i miei span
    if (this.Realized && this.Spans && (this.NumRows == 1) != (old == 1))
    {
      var n = this.Spans.length;
      for(var i=0; i<n; i++)
      {
        this.Spans[i].Unrealize();
        this.Spans[i].Realize(this.BoxBox);
        //
        // L'unrealize l'ha tolto dalla mappa... glielo rimetto
        RD3_DesktopManager.ObjectMap.add(this.Spans[i].Identifier, this.Spans[i]);
      }
    }
  }
}

BookBox.prototype.SetVisStyle= function(value) 
{
  var old = this.VisStyle;
  //
  if (value!=undefined)
  {
    if (value.Identifier)
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
  if (this.Realized && this.VisStyle)
  {
    // Non applico il VS durante la realizzazione in quanto
    // le proprieta' dinamiche non sono state ancora lette tutte
    if (value != undefined)
      this.ApplyVisualStyle();
    //
    // Se e' cambiato
    if (old != this.VisStyle)
      this.ParentPage.ParentBook.RecalcLayout = true;
  }
}

BookBox.prototype.SetImage= function(value) 
{
  if (value!=undefined)
    this.Image = value;
  //
  if (this.Realized)
  {
    if (this.Image == "")
    {
      if (this.BoxImg)
        this.BoxImg.style.display = "none";
      //
      // Svuoto solo se c'era l'immagine: potrebbe esserci un gradiente (!IE)
      if (this.BoxBox.style.backgroundImage.substr(0,4) == "url(")
        this.BoxBox.style.backgroundImage = "";
      //
      // La box non ha piu' un'immagine ripristino l'overflow
      this.SetCanScroll();
      //
      // Ripristino il padding di 1mm
      if (this.Wants4pxPadding())
      {
        var aa = "";
        var ali = this.VisStyle.GetAlignment(1); 
        if (this.Alignment != 1)
          ali = this.Alignment;
        switch (ali)
        {
          case 3: aa = "center"; break;   // VISALN_CX
          case 4: aa = "right"; break;    // VISALN_DX
          case 5: aa = "justify"; break;  // VISALN_JX
          default: aa = (this.IsRightAligned() ? "right" : ""); break;
        }
        //
        if (aa=="left" || aa=="")
        {
          this.BoxBox.style.paddingLeft = "4px";
          this.BoxBox.style.paddingRight = "";
        }
        else if (aa=="right")
        {
          this.BoxBox.style.paddingLeft = "";
          this.BoxBox.style.paddingRight = "4px";
        }
        //
        // Devo ricalcolare le dimensioni della box...
        this.ParentPage.ParentBook.RecalcLayout = true;
      }
    }
    else
    {
      if (this.Stretch==RD3_Glb.STRTC_NONE)
      {
        // In questi casi posso usare lo stile invece che un campo immagine
        this.BoxBox.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+encodeURI(this.Image)+")";
        //
        // Se c'era un'immagine non background, la devo nascondere
        if (this.BoxImg)
          this.BoxImg.style.display = "none";
      }
      else
      {
        if (!this.BoxImg)
        {
          this.BoxImg = document.createElement("img");
          this.BoxImg.setAttribute("id", this.Identifier+":img");
          this.BoxImg.className = "book-box-img";
          this.BoxImg.src = RD3_Glb.GetImgSrc(this.Image);
          this.BoxBox.appendChild(this.BoxImg);
          //
          // Sono una nuova immagine... eredito il cursor dalla box
          RD3_Glb.ApplyCursor(this.BoxImg, this.BoxBox.style.cursor);
          //
          var parentContext = this;
          if (!RD3_Glb.IsIE(10, false))
            this.BoxImg.onload = function(ev) { parentContext.OnReadyStateChange(ev); };
          else
            this.BoxImg.onreadystatechange = function(ev) { parentContext.OnReadyStateChange(ev); };
        }
        else
        {
          this.BoxImg.src = RD3_Glb.GetImgSrc(this.Image);
          this.BoxImg.style.display = "";
        }
        //
        // La box ha un'immagine, attivo l'overflow per non farla uscire dalla box se e' CROP
        // (negli altri casi non serve)
        if (this.Stretch==RD3_Glb.STRTC_CROP)
          this.BoxBox.style.overflow = "hidden";
        else      // La box non ha piu' un'immagine croppata, ripristino l'overflow
          this.SetCanScroll();
        //
        // Svuoto solo se c'era l'immagine: potrebbe esserci un gradiente (!IE)
        if (this.BoxBox.style.backgroundImage.substr(0,4) == "url(")
          this.BoxBox.style.backgroundImage = "";
        //
        // Elimino l'eventuale padding di 1mm
        if (!this.Wants4pxPadding())
        {
          this.BoxBox.style.paddingLeft = "";
          this.BoxBox.style.paddingRight = "";
          //
          // Devo ricalcolare le dimensioni della box...
          this.ParentPage.ParentBook.RecalcLayout = true;
        }
      }
    }
  }
}

BookBox.prototype.SetInterline= function(value) 
{
  if (value!=undefined)
    this.Interline = value;
  //
  if (this.Realized)
  {
    if (this.Interline > 0)
    {
      this.BoxBox.style.lineHeight = this.Interline + "pt";
    }
  }
}

BookBox.prototype.SetStretch= function(value) 
{
  if (value!=undefined)
    this.Stretch = value;
  //
  // Se e' cambiato lo stretch, aggiorno l'immagine (potrebbe non esserci
  // ancora dato che nel caso NONE uso il background image della box e negli
  // altri casi creo un BoxImg)
  if (this.Realized && this.Image!="" && this.Stretch!=RD3_Glb.STRTC_NONE && !this.BoxImg)
    this.SetImage();
  //
  if (this.Realized && this.BoxImg)
  {
    var s = this.BoxImg.style;
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
        var OrgW = this.BoxImg.width;
        var OrgH = this.BoxImg.height;
        //
        var boxw = this.BoxBox.clientWidth;
        var boxh = this.BoxBox.clientHeight;
        //
        // Se ho tutto... posso fare i miei calcoli
        if (OrgW && OrgH && boxw && boxh)
        {
          // Calcolo l'Aspect Ratio
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
      
      case RD3_Glb.STRTC_AUTO:
      case RD3_Glb.STRTC_FILL:
      {
        // La dimensione dell'immagine deve essere quella della BOX
        s.left = "0px";
        s.top = "0px";
        s.width = this.Width + this.ParentPage.UM;
        s.height = this.Height + this.ParentPage.UM;
        s.position = "";
      }
      break;
      
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

BookBox.prototype.SetVisible= function(value) 
{
  if (value!=undefined)
    this.Visible = value;
  //
  if (this.Realized)
  {
    this.BoxBox.style.display = (this.Visible ? "" : "none");
  }
}

BookBox.prototype.SetCanDrag= function(value) 
{
  if (value!=undefined)
    this.CanDrag = value;
  //
  if (this.Realized)
  {
    var cur = this.VisStyle.GetCursor();
    if (cur=="")
    {
      // Imposto il cursore corretto, ma solo se il VS non lo specificava
      var cn = "";
      if (this.CanDrag)
        cn = "move";
      else if (this.CanClick)
        cn = "pointer";
      RD3_Glb.ApplyCursor(this.BoxBox, cn);    
      if (this.BoxImg)
        RD3_Glb.ApplyCursor(this.BoxImg, cn);  
      //
      // Se la box e' draggabile e contiene una sub-form, allora aggiorno il cursore della caption
      if (this.SubForm && this.SubForm.CaptionBox)
      {
        RD3_Glb.ApplyCursor(this.SubForm.CaptionBox, cn);    
        if (this.SubForm.CloseBtn)
          RD3_Glb.ApplyCursor(this.SubForm.CloseBtn, "pointer");
      }
    }
  }
}

BookBox.prototype.SetCanDrop= function(value) 
{
  if (value!=undefined)
    this.CanDrop = value;
}

BookBox.prototype.SetCanTransform= function(value) 
{
  if (value!=undefined)
    this.CanTransform = value;
}

BookBox.prototype.SetVisualFlags= function(value) 
{
  // Devo solo impostare il valore, perche' viene usata
  // solo a runtime
  this.VisualFlags = value;
}

BookBox.prototype.SetCanScroll= function(value) 
{
  if (value!=undefined)
    this.CanScroll = value;
  //
  if (this.Realized && (this.Image=="" || this.Stretch!=RD3_Glb.STRTC_CROP))
  {
    this.BoxBox.style.overflowX = (this.CanScroll ? "hidden" : "hidden");
    this.BoxBox.style.overflowY = (this.CanScroll ? "auto" : "hidden");
    //
    if (RD3_Glb.IsTouch())
    {
      this.BoxBox.style.overflowY = (this.CanScroll ? "scroll" : "hidden");
      this.BoxBox.style.webkitOverflowScrolling = (this.CanScroll ? "touch" : "");
    }
  }
}

BookBox.prototype.SetCanClick= function(value) 
{
  if (value!=undefined)
    this.CanClick = value;
  //
  if (this.Realized)
  {
    var cur = this.VisStyle.GetCursor();
    if (cur=="")
    {
      // Imposto il cursore corretto, ma solo se il VS non lo specificava
      var cn = "";
      if (this.CanDrag)
        cn = "move";
      else if (this.CanClick)
        cn = "pointer";
      RD3_Glb.ApplyCursor(this.BoxBox, cn);    
      if (this.BoxImg)
        RD3_Glb.ApplyCursor(this.BoxImg, cn);    
    }
  }
}

BookBox.prototype.SetTooltip= function(value) 
{
  if (value!=undefined)
    this.Tooltip = value;
  //
  if (this.Realized)
    RD3_TooltipManager.SetObjTitle(this.BoxBox, this.Tooltip);
}

BookBox.prototype.isJQPlot= function()
{
  return (this.GraphFile.charAt(0) == "[");
}

BookBox.prototype.SetGraphFile= function(value) 
{
  if (value!=undefined)
    this.GraphFile = value;
  //
  if (this.Realized)
  {
    if (this.GraphFile == "")
    {
      if (this.BoxGraph)
        this.BoxGraph.style.display = "none";
    }
    else
    {
      if (!this.BoxGraph)
      {
        if (this.isJQPlot())
        {
          this.BoxGraph = document.createElement("div");
          this.BoxGraph.style.width = "100%";
          this.BoxGraph.style.height = "100%";
          this.BoxGraph.style.overflow = "hidden"; 
        }
        else
        {
          this.BoxGraph = document.createElement("img");
        }
        //
        this.BoxGraph.setAttribute("id", this.Identifier+":gra");
        this.BoxBox.appendChild(this.BoxGraph);        
        this.BoxGraph.className = "book-box-graph";
      }
      this.BoxGraph.style.display = "";
      //
      if (this.isJQPlot())
      {
        // I : sono un carattere riservato per JQuery: devo sostituirli con \:
        var divName = this.Identifier.replace(new RegExp(":","g"), "\\\\:");
        window.setTimeout("$.jqplot('" + divName + "\\\\:gra" + "',"+ this.GraphFile + ");", 100) ;
      }
      else
      {
        this.BoxGraph.src = this.GraphFile;
      }
    }
  }
}

BookBox.prototype.SetGraphMap= function(value) 
{
  if (value!=undefined)
    this.GraphMap = value;
  //
  if (this.Realized)
  {
    if (this.GraphMap == "")
    {
      if (this.BoxMap)
        this.BoxMap.style.display = "none";
    }
    else
    {
      if (this.isJQPlot())
      {
        // I : sono un carattere riservato per JQuery: devo sostituirli con \:
        var divName = this.Identifier.replace(new RegExp(":","g"), "\\\\:");
        window.setTimeout("$('#" + divName + "\\\\:gra" + "').bind('jqplotDataClick', function (ev, seriesIndex, pointIndex, data) {RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnGraphClick', null,'S'+((seriesIndex + 1)<=9 ? '0' : '')+(seriesIndex+1)+'I'+(pointIndex+1));});", 150);
        window.setTimeout("$(document).unload(function() {$('*').unbind(); });", 150);
      }
      else
      {
        if (!this.BoxMap)
        {
          this.BoxMap = document.createElement("span");
          this.BoxMap.setAttribute("id", this.Identifier+":map");
          this.BoxBox.appendChild(this.BoxMap);        
        }
        this.BoxMap.style.display = "";
        this.BoxMap.innerHTML = this.GraphMap;
        this.BoxGraph.useMap = "#" + this.Identifier + ":map";
      }
    }
  }
}

BookBox.prototype.SetSubForm= function(value, node)
{
  // Se la sub-form e' stata rimossa
  if (value == 0)
  {
    // Se c'era...
    if (this.SubForm)
    {
      this.SubForm.Unrealize();
      this.SubForm = null;
    }
  }
  else
  {
    // La sub-form e' stata aggiunta... se c'era gia' unrealizzo la vecchia form
    if (this.SubForm)
      this.SubForm.Unrealize();
    //
    // Prima di realizzare questa form, controllo se era gia' presente nella mappa...
    // Se lo e' gia' e' meglio rimuovere quella gia' presente... Altrimenti io la "copro"
    var fnode = null;
    for (var i=0; i<node.childNodes.length; i++)
    {
      // Cerchiamo il nodo di tipo Element, a seconda del tipo di applicazione cambia la posizione in cui si trova.. 
      // per sicurezza lo cerchiamo con un ciclo
      if (node.childNodes.item(i).nodeType==1)
      {
        fnode = node.childNodes.item(i);
        break;
      }
    }
    //
    // Se l'ho trovato
    if (fnode)
    {
      // Cerco la form nella mappa
      var fid = fnode.getAttribute("id");
      var oldf = RD3_DesktopManager.ObjectMap[fid];
      if (oldf)
      {
        // Se la trovo la stacco dal suo parent. Tra poco diventera' mia!
        if (oldf.SubFormObj)
          oldf.SubFormObj.SubForm = null;
        //
        // E la unrealizzo...
        oldf.Unrealize();
      }
    }
    //
    // Ed inserisco la nuova
    this.SubForm = new WebForm();
    this.SubForm.SubFormObj = this;
    this.SubForm.LoadFromXml(fnode);
    //
    // Ora posso proseguire
    if (this.Realized)
    {
      this.SubForm.Realize();
      this.SubForm.AdaptLayout();
      //
      // Adesso la nuova Form deve prendersi le sue toolbar
      RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveFormChanged();
      //
      // Se la box e' draggabile e contiene una sub-form, allora aggiorno il cursore della caption
      this.SetCanDrag();
    }
  }
}

BookBox.prototype.SetBackColor = function(value)
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

BookBox.prototype.SetForeColor = function(value)
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

BookBox.prototype.SetFontMod = function(value)
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

BookBox.prototype.SetAlignment = function(value)
{
  if (value != undefined)
    this.Alignment = value;
  //
  if (this.Realized)
  {
    // Non applico il VS durante la realizzazione in quanto
    // le proprieta' dinamiche non sono state ancora lette tutte
    if (value != undefined)
      this.ApplyVisualStyle();
  }
}

BookBox.prototype.SetVAlignment = function(value)
{
  if (value != undefined)
    this.VAlignment = value;
  //
  // L'allineamento verticale e' un mezzo delirio...
  // Non posso usare verticalAlign... :-(
  // e "flex" e' troppo evoluto... Gestisco l'allineamento nella AdaptBox
}

BookBox.prototype.SetBadge= function(value) 
{
  if (value != undefined)
    this.Badge = value;
  //
  if (this.Realized)
  {
    if (this.Badge == "" && this.BadgeObj != null)
    {
      this.BadgeObj.parentElement.removeChild(this.BadgeObj);
      this.BadgeObj = null;
    }
    else if (this.Badge != "")
    {
      if (this.BadgeObj == null)
      {
        this.BadgeObj = document.createElement("div");
        this.BadgeObj.setAttribute("id", this.Identifier+":bdg");
        this.BadgeObj.className = "badge-red";
        this.BadgeObj.style.position = "absolute";
      }
      this.BadgeObj.innerHTML = this.Badge;
    }
  }
}

// *******************************************************************
// Applico la classe
// *******************************************************************
BookBox.prototype.SetClassName = function(cls)
{
  var old = this.ClassName;
  if (cls != undefined)
    this.ClassName = cls;
  //
  if (this.Realized && (old != this.ClassName || !cls)) 
  {
    // Rimuovo la classe precedente
    if (old != "") 
      RD3_Glb.RemoveClass2(this.BoxBox, old);
    //
    // Applico la nuova classe alla fine della lista
    if (this.ClassName && this.ClassName != "")
      RD3_Glb.AddClass(this.BoxBox, this.ClassName);
  }
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
BookBox.prototype.Realize = function(parent, before)
{
  // Realizzo i miei oggetti visuali:
  // creo il mio contenitore globale
  if (this.VisStyle.HasBoxProto())
  {
    this.BoxBox = this.VisStyle.GetBoxProto();
  }
  else
  {
    this.BoxBox = document.createElement("div");
    this.BoxBox.className = "book-box";
  }
  //
  this.BoxBox.setAttribute("id", this.Identifier);
  //
  // Poi chiedo ai miei figli di realizzarsi
  if (this.SubSections)
  {
    var oldsec = null;
    var n = this.SubSections.length;
    for(var i=0; i<n; i++)
    {
      var sec = this.SubSections[i];
      //
      // Se sono una sezione in overlay e prima di me c'e' gia' un'altra sezione in overlay
      if (sec.Overlay && sec.MastroBox && oldsec && oldsec.Overlay)
      {
        // Io non verro' creata... tutte le box che contengo finiscono nella sezione attaccata alla pagina
        sec.OwnerSection = (oldsec.PageOwner ? oldsec : oldsec.OwnerSection);
        sec.SectionBox = oldsec.SectionBox;
        sec.PageOwner = false;
      }
      //
      sec.Realize(this.BoxBox);
      //
      // Ultima sezione inserita in questa box
      oldsec = sec;
    }
  }
  if (this.Spans)
  {
    var n = this.Spans.length;
    for(var i=0; i<n; i++)
    {
      this.Spans[i].Realize(this.BoxBox);
    }
  }
  //
  if (this.SubForm)
  {
    this.SubForm.Realize();
    //
    // Adesso la nuova Form deve prendersi le sue toolbar
    RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveFormChanged();
  }
  //
  // Associo gli eventi di Click
  if (!RD3_Glb.IsMobile())
  {
    var parentContext = this;
  	this.BoxBox.onclick = function(ev) { parentContext.OnClick(ev); };
  }
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  //
  this.SetImage(); // Deve venire prima, in questo modo l'immagine puo' avere il cursore giusto
  this.SetVisStyle();
  this.SetInterline();
  this.SetStretch();
  this.SetVisible();
  this.SetCanScroll();
  this.SetCanClick();
  this.SetTooltip();
  this.SetGraphFile();
  this.SetGraphMap(); 
  this.SetCanDrag();
  this.SetBackColor();
  this.SetForeColor();
  this.SetFontMod();
  this.SetAlignment();
  this.SetVAlignment();
  this.SetBadge();
  this.ApplyVisualStyle();
  this.SetClassName();
  //
  // La box non e' posizionata a video... verra' posizionata alla fine con l'AdaptLayout
  // Quindi e' meglio lasciarla invisibile... verra' mostrata quando viene dimensionata e posizionata (AdaptBox)
  this.BoxBox.style.display = "none";
  //
  // Dico al visual style che la box e' cotta
  this.VisStyle.SetBoxProto(this.BoxBox);
  //
  if (before)
    parent.insertBefore(this.BoxBox, before);
  else
    parent.appendChild(this.BoxBox);
}


// **********************************************************************
// Rimuove questa box
// **********************************************************************
BookBox.prototype.Unrealize = function()
{
  // Tolgo l'oggetto dalla mappa comune
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Passo il messaggio ai figli
  if (this.SubSections)
  {
    var n = this.SubSections.length;
    for(var i=0; i<n; i++)
    {
      this.SubSections[i].Unrealize();
    }
  }
  if (this.Spans)
  {
    var n = this.Spans.length;
    for(var i=0; i<n; i++)
    {
      this.Spans[i].Unrealize();
    }
  }
  //
  if (this.SubForm)
    this.SubForm.Unrealize();
  //
  // Elimino gli oggetti visuali
  // Se appartengo ad una sezione in overlay il parent potrebbe essere gia' stato tolto dal DOM
  if (this.BoxBox && this.BoxBox.parentNode)
    this.BoxBox.parentNode.removeChild(this.BoxBox);
  //
  // Annullo i riferimenti
  this.BoxBox = null;
  this.BoxGraphImg = null;
  this.BoxImg = null;
  this.BoxImgContainer = null;
  this.BoxMap = null;
  //
  this.Realized = false;
}


// **********************************************************************
// Rimuove questa box in maniera ritardata (chiamata alla fine di una 
// animazione se necessario)
// **********************************************************************
BookBox.prototype.UnrealizeDelayed = function()
{
  // Guardo nella mappa: se l'oggetto con il mio id sono io lo tolgo senza problemi, se e' un altro
  // allora lo lascio
  var ob = RD3_DesktopManager.ObjectMap[""+this.Identifier];
  if (ob == this)
    RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Passo il messaggio ai figli
  if (this.SubSections)
  {
    var n = this.SubSections.length;
    for(var i=0; i<n; i++)
    {
      this.SubSections[i].UnrealizeDelayed();
    }
  }
  if (this.Spans)
  {
    var n = this.Spans.length;
    for(var i=0; i<n; i++)
    {
      this.Spans[i].UnrealizeDelayed();
    }
  }
  //
  // Elimino gli oggetti visuali
  // Se appartengo ad una sezione in overlay il parent potrebbe essere gia' stato tolto dal DOM
  if (this.BoxBox && this.BoxBox.parentNode)
    this.BoxBox.parentNode.removeChild(this.BoxBox);
  //
  // Annullo i riferimenti
  this.BoxBox = null;
  this.BoxGraphImg = null;
  this.BoxImg = null;
  this.BoxImgContainer = null;
  this.BoxMap = null;
  //
  this.Realized = false;
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
BookBox.prototype.AdaptLayout = function()
{
  // Se non sono stata realizzata... non faccio nulla
  if (!this.Realized)
    return;
  //
  // Adatto la box
  this.AdaptBox();
  //
  // Gestisco l'eventuale stretch della mia immagine
  if (this.BoxImg)
    this.SetStretch();
  //
  // Passo il messaggio ai figli
  if (this.SubSections)
  {
    var n = this.SubSections.length;
    for(var i=0; i<n; i++)
    {
      this.SubSections[i].AdaptLayout();
    }
  }
  if (this.Spans)
  {
    var n = this.Spans.length;
    for(var i=0; i<n; i++)
    {
      this.Spans[i].AdaptLayout();
    }
  }
  if (this.SubForm)
    this.SubForm.AdaptLayout();
  //
  // Se ci sono stretch da applicare
  if (this.StretchW || this.StretchH)
  {
    // Se mi devo allargare perche' contengo sotto-sezioni che "toccano" il mio right/bottom
    // ed io non ho bordo (vedi AdaptLayout)
    if (this.StretchW)
    {
      this.WPx = Math.round(this.WPx + this.StretchW);
      this.BoxBox.style.width = this.WPx + "px";
      //
      // Lo annullo dato che l'ho applicato
      this.StretchW = 0;
    }
    if (this.StretchH)
    {
      this.HPx = Math.round(this.HPx + this.StretchH);
      this.BoxBox.style.height = this.HPx + "px";
      //
      // Lo annullo dato che l'ho applicato
      this.StretchH = 0;
    }
  }
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
BookBox.prototype.AfterProcessResponse= function()
{
  if (this.SubSections)
  {
    var n = this.SubSections.length;
    for(var i=0; i<n; i++)
      this.SubSections[i].AfterProcessResponse();
  }
  //
  if (this.SubForm)
    this.SubForm.AfterProcessResponse();
}


// **********************************************************************
// Deve tornare vero se l'oggetto e' draggabile
// **********************************************************************
BookBox.prototype.IsDraggable = function()
{
  return this.CanDrag;
}


// **********************************************************************
// Deve tornare vero se l'oggetto e' trasformabile
// **********************************************************************
BookBox.prototype.IsTransformable = function()
{
  return this.CanTransform;
}


// **********************************************************************
// Drop effettuato sull'oggetto
// **********************************************************************
BookBox.prototype.OnDrop = function(obj, evento)
{
  // Non lancio evento se:
  // 1) E' stata attivata la nuova gestione drop
  // 2) La box non accetta drop
  // 3) E' stato tirato qualcosa da un altro frame
  if (this.ParentPage.ParentBook.CanDrop || !this.CanDrop || obj.GetParentFrame()!=this.GetParentFrame())
    return false;
  //
  // Invio semplicemente l'evento di drop
  var ev = new IDEvent("drp", this.Identifier, evento, this.DropEventDef, obj.Identifier);
  return true;
}


// **********************************************************************
// Evento di box trasformata
// **********************************************************************
BookBox.prototype.OnTransform = function(x, y, w, h, evento)
{
  // Invio semplicemente l'evento di trasformazione
  var ev = new IDEvent("trasf", this.Identifier, evento, this.TransformEventDef, "", x, y, w, h);
}


// *****************************************************************************
// Restituisce l'oggetto visuale su cui deve venire applicata l'HL per il drag
// *****************************************************************************
BookBox.prototype.DropElement = function()
{
  return this.BoxBox;
}


// ********************************************************************************
// Gestore evento di click
// ********************************************************************************
BookBox.prototype.OnClick= function(evento)
{ 
  if (window.event && evento==undefined)
    evento = window.event;
  //
  if (this.Visible && this.CanClick)
  {
    // Voglio evitare un doppio click sugli oggetti
    if (RD3_Glb.IsAndroid() || (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch()))
      RD3_DDManager.ChompClick();
    //
    var ev = new IDEvent("clk", this.Identifier, evento, this.ClickEventDef);
  }
  else if (this.Visible && this.Spans && this.Spans.length==1 && this.Spans[0].ControlType==RD3_Glb.VISCTRL_CHECK)
  {
    // Io sono visibile e non cliccabile, ma ho un figlio solo di tipo checkbox: allora utilizzo il mio click per selezionarlo
    // o deselezionarlo
    this.Spans[0].OnCheckBoxClick(evento);
  }
}


// ********************************************************************************
// Gestore evento di click su un punto del grafico
// ********************************************************************************
BookBox.prototype.OnGraphClick= function(evento, point)
{ 
  if (this.Visible)
  {
    var ev = new IDEvent("graclk", this.Identifier, evento, this.ClickEventDef, point);
  }
}


// **********************************************************************
// Restituisce l'oggetto Dom a cui associare un Popup Menu
// **********************************************************************
BookBox.prototype.GetDOMObj = function()
{
  return this.BoxBox;
}


// ********************************************************************************
// Compone la lista di drop della box
// ********************************************************************************
BookBox.prototype.ComputeDropList = function(list, dragobj)
{
  // Se non sono stata realizzata... niente DropList
  if (!this.Realized)
    return;
  //
  // Questa box vuole essere droppata da dragobj?
  if (this.CanDrop && this!=dragobj)
  {
    list.push(this);
    //
    // Calcolo le coordinate assolute...
    this.AbsLeft = RD3_Glb.GetScreenLeft(this.BoxBox,true);
    this.AbsTop = RD3_Glb.GetScreenTop(this.BoxBox,true);
    this.AbsRight = this.AbsLeft + this.BoxBox.offsetWidth - 1;
    this.AbsBottom = this.AbsTop + this.BoxBox.offsetHeight - 1;
  }
  //
  // Ora tutte le sotto-sezioni della box
  if (this.SubSections)
  {
    var n  = this.SubSections.length;
    for (var i = 0; i<n; i++)
    {
      this.SubSections[i].ComputeDropList(list, dragobj);
    }
  }
  //
  // Se contengo una sub-form, chiedo anche a lei
  if (this.SubForm)
    this.SubForm.ComputeDropList(list, dragobj);
}


// **********************************************************************
// Ritorna il frame che contiene la box
// **********************************************************************
BookBox.prototype.GetParentFrame = function()
{
  return this.ParentPage.ParentBook;
}


// ***********************************************************
// Torna true se il campo e' allineato a dx per default
// ***********************************************************
BookBox.prototype.IsRightAligned = function()
{
  // Prima guardo il mio VS
  if (this.VisStyle)
  {
    var al = this.VisStyle.GetAlignment(1);
    if (this.Alignment != 1)
      al = this.Alignment;
    //
    if (al == 4)    // VISALN_DX
      return true;
  }
  //
  // Guardo il primo span
  if (this.Spans && this.Spans.length>0 && !this.Spans[0].Enabled)
    return this.Spans[0].IsRightAligned();
  //
  return false;
}


// ***********************************************************
// Torna true se la box conterra' sottosezioni
// ***********************************************************
BookBox.prototype.ContainsSections = function()
{
  return this.MastroWithSections || this.SubSections;
}


// ***********************************************************
// Vuole evidenziare il punto di drag?
// Lo chiedo al book
// ***********************************************************
BookBox.prototype.WantDragHL = function()
{
  return this.ParentPage.ParentBook.WantDragHL;
}

// ***********************************************************
// Vuole ripristinare il punto di drag?
// Lo chiedo al book
// ***********************************************************
BookBox.prototype.WantDropRestore = function()
{
  return this.ParentPage.ParentBook.WantDropRestore;
}

// ***********************************************************
// Metodo che cerca di adattare la box per tenere conto del 
// padding e dei bordi
// ***********************************************************
BookBox.prototype.AdaptBox = function()
{
  if (this.Realized)
  {
    var rect = new Rect();
    //
    // Non e' corretto convertire in PX le sole larghezze e altezze dato che avrei problemi con gli arrotondamenti
    // Posso solo convertire (e arrotondare) le coordinate RIGHT e BOTTOM e solo allora togliere i TOP e LEFT
    // In questo modo gli arrotondamenti sono corretti (es: box con LEFT=12mm e larghezza 12mm. 12mm convertito
    // in px diventa 45px... se converto separatamente ottengo LEFT=45px e WIDTH=45px ma se converto in maniera
    // corretta ottengo LEFT=45px e WIDTH=46px!!! dato che 12+12=24mm convertito e' 91px ed e' diverso da 45px+45px!).
    // Inoltre le coordinate delle box sono relative al parent e se non voglio commettere altri errori
    // di arrotondamento devo convertire le coordinate LEFT, TOP, RIGHT e BOTTOM sommando gli offset di tutti
    // i padri in cui sono contenuta... poi, dopo aver convertito, posso sottrarre gli offset del padre
    //
    // Prima calcolo il TOP/LEFT dell'oggetto padre
    var lpar = 0;
    var tpar = 0;
    var o = this.ParentSect;
    while (o)
    {
      lpar += o.XPos;
      tpar += o.YPos;
      //
      // Se o e' una sezione, suo padre e' una box
      // Se o e' una box, suo padre e' una sezione
      if (o instanceof BookSection)
        o = o.MastroBox;
      else
        o = o.ParentSect;
    }
    //
    // Ora ho il TopLeft di mio padre calcolato assoluto sulla pagina e posso convertire i miei dati
    rect.x = Math.round(RD3_Glb.ConvertIntoPx(this.XPos + lpar, this.ParentPage.UM)) - Math.round(RD3_Glb.ConvertIntoPx(lpar, this.ParentPage.UM));
    rect.y = Math.round(RD3_Glb.ConvertIntoPx(this.YPos + tpar, this.ParentPage.UM)) - Math.round(RD3_Glb.ConvertIntoPx(tpar, this.ParentPage.UM));
    rect.w = Math.round(RD3_Glb.ConvertIntoPx(this.XPos + lpar + this.Width, this.ParentPage.UM)) - rect.x - Math.round(RD3_Glb.ConvertIntoPx(lpar, this.ParentPage.UM));
    rect.h = Math.round(RD3_Glb.ConvertIntoPx(this.YPos + tpar + this.Height, this.ParentPage.UM)) - rect.y - Math.round(RD3_Glb.ConvertIntoPx(tpar, this.ParentPage.UM));
    //
    // Memorizzo le mie coordinate TOP/LEFT assolute (mi servono per adattare il mio contenuto)
    this.XAbsPx = Math.round(RD3_Glb.ConvertIntoPx(this.XPos + lpar, this.ParentPage.UM));
    this.YAbsPx = Math.round(RD3_Glb.ConvertIntoPx(this.YPos + tpar, this.ParentPage.UM));
    //
    // Recupero le dimensioni dei bordi e padding
    var rbrd = this.VisStyle.GetBookOffset(true);
    var rpad = this.VisStyle.GetBookOffset();   // bordo+padding
    rpad.x -= rbrd.x;
    rpad.y -= rbrd.y;
    rpad.w -= rbrd.w;
    rpad.h -= rbrd.h;
    //
    // Se sono contenuta in una sezione
    if (this.ParentSect)
    {
      // La box e' contenuta in una sezione... Se la sezione ha l'overlay
      // vado a prendere la sezione "vera", quella per la quale e' stato creato un oggetto nel DOM
      var sec = this.ParentSect;
      if (!sec.PageOwner)
        sec = sec.OwnerSection;
      //
      // Cerco il VS della sezione in cui sono contenuta
      var vspar = sec.VisStyle;
      if (vspar)
      {
        // Recupero la dimensione dei bordi della sezione in cui sono contenuta (solo bordi, no padding!)
        var rsecbrd = vspar.GetBookOffset(true);
        //
        // Se la sezione in cui sono contenuta ha un bordo ed io ho un bordo e le 
        //  coordinate left/top collidono mi sposto sopra il bordo della sezione
        // Se la sezione in cui sono contenuta NON ha un bordo ed io ho un bordo 
        // destro/sotto e le coordinate Bottom/Right collidono mi stringo
        if (rsecbrd.x>0 && rbrd.x!=0 && rect.x==0)
          rect.x -= rsecbrd.x;
        if (rsecbrd.w==0 && rbrd.w!=0 && rect.x+rect.w>=sec.WPx)
        {
          // Dovrei stringermi della dimensione del mio bordo... cosi' si vede... 
          // Invece faccio crescere la sezione della dimensione del mio... cosi' il mio bordo
          // si comporta allo stesso modo in cui si comporta il bordo della sezione... esce cosi' viene
          // coperto dall'oggetto seguente
          // rect.w -= rbrd.w;
          sec.StretchW = Math.max((!sec.StretchW ? 0 : sec.StretchW), rbrd.w);
          //
          // Qui c'e' un altro problemino... io spingo una sezione... ma potrebbe essere una sub-section...
          // quindi devo risalire la catena spingendo tutti a destra finche' non trovo qualcuno con un bordo...
          this.ParentPage.ParentBook.ParGrowWidth(sec.MastroBox, this.XAbsPx+rect.w, rbrd.w);
        }
        //
        if (rsecbrd.y>0 && rbrd.y!=0 && rect.y==0)
          rect.y -= rsecbrd.y;
        if (rsecbrd.h==0 && rbrd.h!=0 && rect.y+rect.h>=sec.HPx)
        {
          // Dovrei stringermi della dimensione del mio bordo... cosi' si vede... 
          // Invece faccio crescere la sezione della dimensione del mio... cosi' il mio bordo
          // si comporta allo stesso modo in cui si comporta il bordo della sezione... esce cosi' viene
          // coperto dall'oggetto seguente
          // rect.h -= rbrd.h;
          sec.StretchH = Math.max((!sec.StretchH ? 0 : sec.StretchH), rbrd.h);
          //
          // Qui c'e' un altro problemino... io spingo una sezione... ma potrebbe essere una sub-section...
          // quindi devo risalire la catena spingendo tutti a destra finche' non trovo qualcuno con un bordo...
          this.ParentPage.ParentBook.ParGrowHeight(sec.MastroBox, this.YAbsPx+rect.h, rbrd.h);
        }
      }
    }
    //
    // Ora mi stringo della dimensione del mio bordo (solo bordi sinistro e sopra)
    // Inoltre tolgo anche i miei padding
    rect.w -= rbrd.x + (rpad.x+rpad.w);
    rect.h -= rbrd.y + (rpad.y+rpad.h);
    //
    // Da ultimo se ho tennuto conto del padding di 1mm per box vuote con bordo
    if (this.Wants4pxPadding())
      rect.w -= 4;
    //
    // Correggo le dimensioni che non possono essere negative
    if (rect.w<0) rect.w = 0;
    if (rect.h<0) rect.h = 0;
    //
    this.BoxBox.style.left = rect.x + "px";
    this.BoxBox.style.top = rect.y + "px";
    this.BoxBox.style.width = rect.w + "px";
    this.BoxBox.style.height = rect.h + "px";
    //
    // Nella Realize ho fatto nascere la box invisibile... ora che l'ho posizionata puo' mostrarsi
    this.BoxBox.style.display = (this.Visible ? "" : "none");
    //
    // Memorizzo le coordinate... mi servono per adattare le sotto-sezioni che contengo (BookBox::AdaptBox)
    this.XPx = rect.x;
    this.YPx = rect.y;
    this.WPx = rect.w;
    this.HPx = rect.h;
    //
    if (this.MastroWithSections && (this.Image=="" || this.Stretch!=RD3_Glb.STRTC_CROP))
    {
      // Se io ho un bordo, allora il mio contenuto deve stare dentro!!! Altrimenti il mio bordo
      // non riesce a coprire quello del mio contenuto.
      // Pero' se io non ho bordo voglio che gli oggetti che contengo escano liberamente...
      var rbrd = this.VisStyle.GetBookOffset(true);
      this.BoxBox.style.overflowX = (this.CanScroll ? "hidden" : (rbrd.x||rbrd.w ? "hidden" : ""));
      if (RD3_Glb.IsTouch())
        this.BoxBox.style.overflowY = (this.CanScroll ? "scroll" : (rbrd.y||rbrd.h ? "hidden" : ""));
      else
        this.BoxBox.style.overflowY = (this.CanScroll ? "auto" : (rbrd.y||rbrd.h ? "hidden" : ""));
    }
    //
    // Ottimo. Ora se ho un badge, posiziono anche lui
    if (this.BadgeObj)
    {
      // Lo infilo nella pagina
      this.ParentPage.PageBox.appendChild(this.BadgeObj);      // Lo appendo a mio padre (diventa mio fratello)
      //
      var h = this.BadgeObj.clientHeight;
      var w = this.BadgeObj.clientWidth;
      //
      var x = this.XAbsPx + rect.w - w/2 + 3;
      var y = this.YAbsPx - h/2 - 2;
      //
      this.BadgeObj.style.left = x + "px"
      this.BadgeObj.style.top = y + "px"
    }
    //
    // Vertical alignment
    if (this.VAlignment != 1 && this.Spans && this.Spans.length > 0)     // VISVALN_TOP
    {
      var first = this.Spans[0].SpanObj;
      var last = this.Spans[this.Spans.length - 1].SpanObj;
      var TextHeight = last.offsetTop + last.offsetHeight - first.offsetTop;
      //
      var TextOfs = 0;
      if (this.VAlignment == 2)   // VISVALN_CENTER
        TextOfs = (rect.h - TextHeight) / 2 - 1;
      else if (this.VAlignment == 3)   // VISVALN_BOTTOM
        TextOfs = rect.h - TextHeight - 1;
      //
      this.BoxBox.style.paddingTop = (TextOfs + rpad.y) + "px";
      //
      // Dato che ho usato il padding e sono in box-model devo ridurre l'altezza della box
      this.BoxBox.style.height = (rect.h - TextOfs) + "px";
    }
  }
}


// *******************************************************
// Metodo che gestisce il cambio dello stato dell'immagine
// *******************************************************
BookBox.prototype.OnReadyStateChange = function()
{
  if (!RD3_Glb.IsIE(10, false) || this.BoxImg.readyState == "complete")
    this.SetStretch();
}


// *******************************************************
// Metodo che adatta delle coordinate da px all'unita'
// di misura della Box
// rect = parametro di IN-OUT con le coordinate
// *******************************************************
BookBox.prototype.AdaptCoords = function(rect)
{
  // Converto le coordinate in Unita' di misura
  var um = this.ParentPage.UM;
  RD3_Glb.ConvertRectPxIntoUM(rect, um);
  //
  // Applico la variazione minima
  var chg = 1/RD3_ClientParams.ChgResMM;
  if (um == "in")
    chg = 1/RD3_ClientParams.ChgResIN;
  //
  // Arrotondo
  rect.x = Math.round(rect.x*chg)/chg;
  rect.y = Math.round(rect.y*chg)/chg;
  rect.w = Math.round(rect.w*chg)/chg;
  rect.h = Math.round(rect.h*chg)/chg; 
}


// *******************************************************
// Metodo che restituisce l'unita' di misura della box
// *******************************************************
BookBox.prototype.GetUM = function()
{
  return this.ParentPage.UM;
}

// *******************************************************
// Restituisce TRUE se la box ha un padding di 4px (1mm) 
// dato che ha un bordo normale e non ha un'immagine
// Se non lo faccio il testo contenuto nella box si appoggia ai bordi
// *******************************************************
BookBox.prototype.Wants4pxPadding = function()
{
  // Se contengo una combo, non mi serve il padding... ci pensa gia' l'input della combo
  if (this.Spans && this.Spans.length==1 && this.Spans[0].ControlType==RD3_Glb.VISCTRL_COMBO)
    return false;
  //
  // Se contengo una subform non mi serve il padding
  if (this.SubForm != null)
    return false;
  //
  var aa = "";
  var ali = this.VisStyle.GetAlignment(1);
  if (this.Alignment != 1)
    ali = this.Alignment;
  switch (ali)
  {
    case 3: aa = "center"; break;   // VISALN_CX
    case 4: aa = "right"; break;    // VISALN_DX
    case 5: aa = "justify"; break;  // VISALN_JX
    default: aa = (this.IsRightAligned() ? "right" : ""); break;
  }
  //
  // Vediamo se io o il mio span ha un'immagine... in entrambi i casi non ho il padding di 4px
  var img = this.Image;
  if (img=="" && this.Spans && this.Spans.length==1)
    img = (this.Spans[0].HasImage ? this.Spans[0].Text : "");
  //
  // Se la box ha un bordo (non custom) e non contiene immagini... applico un padding di default di 1 mm (circa 4px)
  var bt = this.VisStyle.GetBorders(1);
  return (bt!=1 && bt!=9 && img=="" && (aa=="left" || aa=="" || aa=="right"));  // VISBRD_NONE=1, VISBRD_CUSTOM=9
}


// *******************************************************************************
// Metodo che restituisce la stringa da scrivere nella status bar
// durante la trasformazione della box.
// x,y,w,h sono le dimensioni e la posizione originale
// dx,dy,dw,dh sono i delta rispetto alle posizioni e alle dimensioni originali
// TrasfXMode e TrasfYMode servono per calcolare il tipo di trasformazione da applicare
// ******************************************************************************
BookBox.prototype.UpdateDDStatus = function(x, y, w, h, dx, dy, dw, dh, TrasfXMode, TrasfYMode)
{
  // Trasformo le coordinate in base alla mia unita' di misura (mi arrivano in px)
  var rect = new Rect(x, y, w, h);
  //
  this.AdaptCoords(rect);
  x = rect.x;
  y = rect.y;
  w = rect.w;
  h = rect.h;
  //
  rect = new Rect(dx, dy, dw, dh);
  //
  this.AdaptCoords(rect);
  dx = rect.x;
  dy = rect.y;
  dw = rect.w;
  dh = rect.h;
  //
  var um = this.ParentPage.UM;
  //
  // Sto trasformando; scrivo la stringa corretta
  if (TrasfXMode==0 && TrasfYMode==0)
  {
    // Spostamento della box
    return RD3_Glb.FormatMessage(ClientMessages.DDM_STATUS_Moving, "(X=" + (x+um) + ", Y=" + (y+um) + ")", "(X=" + ((x+dx)+um) + ", Y=" + ((y+dy)+um) + "), delta (dX=" + (dx+um) + ", dY=" + (dy+um) + ")");
  }
  else if (TrasfYMode==0)
  {
    // Sto ridimensionando in orizzontale
    return RD3_Glb.FormatMessage(ClientMessages.DDM_STATUS_Resizing, "W=" + (w+um), "W=" + ((w+dw)+um) + ", dW=" + (dw+um));
  }
  else if (TrasfXMode==0)
  {
    // Sto ridimensionando in verticale
    return RD3_Glb.FormatMessage(ClientMessages.DDM_STATUS_Resizing, "H=" + (h+um), "H=" + ((h+dh)+um) + ", dH=" + (dh+um));
  }
  else
  {
    // Ridimensiono in entrambe le direzioni
    return RD3_Glb.FormatMessage(ClientMessages.DDM_STATUS_Resizing, "(W=" + (w+um) + ", H=" + (h+um) + ")", "(W=" + ((w+dw)+um) + ", H=" + ((h+dh)+um) + "), delta (dW=" + (dw+um) + ", dH=" + (dh+um) + ")");
  }
}

// ********************************************************************************
// Aggiunge un nuovo figlio a questo oggetto
// ********************************************************************************
BookBox.prototype.InsertChild = function(node)
{
  // Vediamo se l'oggetto esiste gia'...
  var id = node.getAttribute("id");
  if (RD3_DesktopManager.ObjectMap[id])
    return;
  //
  var previd = node.getAttribute("previd");
  if (id.substring(0,3)=="spn")
  {
    // Creo il nuovo span e ne carico le proprieta'
    var newspan = new BookSpan(this);
    newspan.LoadFromXml(node);
    newspan.Alternate = this.Alternate;
    //
    // Creo l'array dei figli se non l'ho mai fatto
    if (!this.Spans) this.Spans = new Array();
    //
    // Calcolo dove inserire il nuovo span
    var previdx = RD3_Glb.FindObjById(this.Spans, previd);
    //
    // Inserisco al posto giusto e realizzo
    if (previdx != -1 && previdx < this.Spans.length)
    {
      if (this.Realized)
        newspan.Realize(this.BoxBox, this.Spans[previdx].SpanObj);
      this.Spans.splice(previdx, 0, newspan);
    }
    else
    {
      if (this.Realized)
        newspan.Realize(this.BoxBox);
      this.Spans[this.Spans.length] = newspan;
    }
    //
    // Se la box ha un cursore lo applico anche allo span (non per le combo, per loro ci pensa lei..)
    if (this.Realized && this.BoxBox.style.cursor != "" && !(newspan.SpanObj instanceof IDCombo))
      newspan.SpanObj.style.cursor = this.BoxBox.style.cursor;
    //
    // Se e' il primo span, ricalcolo l'allineamento... magari e' cambiato
    // a causa dello span (la IsRightAligned, infatti, guarda anche gli span)
    if (this.Realized)
      this.ApplyVisualStyle();
  }
  else if (id.substring(0,3)=="sec")
  {
    // Creo la nuova sub-section e ne carico le proprieta'
    var newsec = new BookSection(this.ParentPage);
    newsec.LoadProperties(node);
    //
    // E' una sub-section, le comunico che io sono suo padre
    newsec.ParentBox = this;
    //
    // Creo l'array delle sub-section se non l'ho mai fatto
    if (!this.SubSections) this.SubSections = new Array();
    //
     // Calcolo dove inserire la nuova sub-section
     var previdx = RD3_Glb.FindObjById(this.SubSections, previd);
     //
    // Gestione overlay
    if (newsec.Overlay)
    {
      // Cerco la sezione prima della quale verro' inserita.
      // Se mi devo inserire prima di qualcuno prendo quello prima di quello dove finiro'
      // (quindi quello che mi precedera' dopo che mi sono inserito) altrimenti se 
      // devo andare in fondo prendo quello che e' l'ultimo in questo momento 
      // (quindi quello che mi precedera' dopo che mi sono inserito)
      var prevSec = null;
      if (previdx>0)
        prevSec = this.SubSections[previdx-1];
      else if (previdx==-1)
        prevSec = this.SubSections[this.SubSections.length-1];
      //
      // Se ho trovato la sezione che mi precedera' e anche lei ha l'overlay
      if (prevSec && prevSec.Overlay)
      {
        // Ci possono essere 2 casi:
        // 1) lei e' una delle tante sezioni che si nasconde... in questo caso mi nascondo anch'io...
        // 2) lei e' una sezione che non si nasconde... ma dato che io finisco dopo di lei mi devo nascondere
        //
        // Se lei e' owner mi attacco a lei, altrimenti mi attacco al suo owner
        newsec.OwnerSection = (prevSec.PageOwner ? prevSec : prevSec.OwnerSection);
        newsec.SectionBox = newsec.OwnerSection.SectionBox;
        //
        // Ed io non sono owner!
        newsec.PageOwner = false;
      }
      //
      // Ora devo fare un controllino anche sulla sezione successiva a dove finisco...
      var nextSec = null;
      if (previdx!=-1 && previdx<this.SubSections.length-1)
        nextSec = this.SubSections[previdx+1];
      //
      // Se ho trovato la sezione dopo di me e anche lei ha l'overlay ed e' owner non va bene!
      // ci sono troppi owner! Io la precedo e sono l'unica che posso avere l'owner
      if (nextSec && nextSec.Overlay && nextSec.PageOwner)
      {
        // Per cominciare lei non e' piu' owner!
        nextSec.PageOwner = false;
        //
        // Ora devo prendere tutti i figli di nextSec... Per farlo, pero', devo prima
        // tener conto del fatto che io sono appena nata e non ancora realizzata.
        // Se io non sono owner... non c'e' problema... lei deve passare tutto al
        // mio owner che e' sicuramente gia' realizzato... ma se io sono owner
        // non ho ancora la SectionBox... quindi mi devo prima realizzare
        if (newsec.PageOwner && this.Realized)
          newsec.Realize(this.BoxBox, nextSec.SectionBox);
        //
        // Ora posso proseguire con il prendere i figli
        while (nextSec.SectionBox.childNodes.length)
        {
          var c = nextSec.SectionBox.childNodes[0];
          //
          // Li metto al posto giusto
          if (newsec.PageOwner)
            newsec.SectionBox.appendChild(nextSec.SectionBox.removeChild(c));
          else
            newsec.OwnerSection.SectionBox.appendChild(nextSec.SectionBox.removeChild(c));
        }
        //
        // Ora devo eliminare il suo oggetto DOM dal DOM
        nextSec.SectionBox.parentNode.removeChild(nextSec.SectionBox);
        //
        nextSec.OwnerSection = (newsec.PageOwner ? newsec : newsec.OwnerSection);
        nextSec.SectionBox = (newsec.PageOwner ? newsec.SectionBox : newsec.OwnerSection.SectionBox);
      }
    }
    //
    // Inserisco al posto giusto e realizzo
    if (previdx != -1 && previdx < this.SubSections.length)
    {
      if (!newsec.Realized && this.Realized)
        newsec.Realize(this.BoxBox, this.SubSections[previdx].SectionBox);
      this.SubSections.splice(previdx, 0, newsec);
    }
    else
    {
      if (!newsec.Realized && this.Realized)
        newsec.Realize(this.BoxBox);
      this.SubSections[this.SubSections.length] = newsec;
    }
  }
  //
  // Al termine devo ricalcolare il layout
  this.ParentPage.ParentBook.RecalcLayout = true;
}


// *******************************************************
// Metodo che gestisce la cancellazione dell'oggetto da parte
// del motore differenziale
// *******************************************************
BookBox.prototype.OnDeleteObject = function(node)
{
  // Mi rimuovo dalla lista delle box di mio padre, se c'e' ancora
  var arr = (this.ParentSect ? this.ParentSect.BoxList : this.ParentPage.MastroBoxes);
  if (arr)
  {
    // Mi cerco
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
}


// ********************************************************************************
// Applico il cursore di trasformazione alla caption
// ********************************************************************************
BookBox.prototype.ApplyCursor = function(cn)
{
  // Solo se il visual style non ne definiva uno specifico
  if (this.VisStyle.GetCursor()=="")
  {
    RD3_Glb.ApplyCursor(this.BoxBox, cn);
    if (this.BoxImg)
      RD3_Glb.ApplyCursor(this.BoxImg, cn);    
  }
}


// ********************************************************************************
// Interpreto i flag visuali
// ********************************************************************************
BookBox.prototype.CanResizeW= function()
{ 
  return (this.VisualFlags & 0x1) && this.CanTransform;
}

BookBox.prototype.CanResizeH= function()
{ 
  return (this.VisualFlags & 0x2) && this.CanTransform;
}

BookBox.prototype.CanMoveX= function()
{ 
  return (this.VisualFlags & 0x4) && this.CanTransform;
}

BookBox.prototype.CanMoveY= function()
{ 
  return (this.VisualFlags & 0x8) && this.CanTransform;
}

BookBox.prototype.CanCancelMove= function()
{ 
  return (this.VisualFlags & 0x10);
}

BookBox.prototype.IsMoveable= function()
{ 
  return this.CanMoveX() || this.CanMoveY();
}

BookBox.prototype.IsResizable= function()
{ 
  return this.CanResizeW() || this.CanResizeH();
}

BookBox.prototype.VisHyperLink = function()
{
  return this.VisualFlags & 0x20;
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
BookBox.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "")
    return false;
  //
  tip.SetObj(this.BoxBox);
  tip.SetText(this.Tooltip);
  tip.SetImage("");
  tip.SetAutoAnchor(true);
  tip.SetPosition(2);
  return true;
}

// *********************************************************
// Applica le proprieta' visuali alla box
// *********************************************************
BookBox.prototype.ApplyVisualStyle = function(value)
{
  var aa = "";
  var ali = this.VisStyle.GetAlignment(1); 
  if (this.Alignment != 1)
    ali = this.Alignment;
  switch (ali)
  {
    case 2: aa = "left"; break;     // VISALN_SX
    case 3: aa = "center"; break;   // VISALN_CX
    case 4: aa = "right"; break;    // VISALN_DX
    case 5: aa = "justify"; break;  // VISALN_JX
    default: aa = (this.IsRightAligned() ? "right" : ""); break;
  }
  //
  this.VisStyle.ApplyStyle(this.BoxBox, this.Alternate, aa, this.BackColor, this.ForeColor, this.FontMod, null, this.VisHyperLink());
  //
  // Ri-applico l'allineamento... i prototipi e quant'altro possono non averlo gestito
  this.BoxBox.style.textAlign = aa;
  //
  // Se la box prevede un padding predefinito di 1mm
  if (this.Wants4pxPadding())
  {
    if (aa=="left" || aa=="")
    {
      this.BoxBox.style.paddingLeft = "4px";
      this.BoxBox.style.paddingRight = "";
    }
    else if (aa=="right")
    {
      this.BoxBox.style.paddingLeft = "";
      this.BoxBox.style.paddingRight = "4px";
    }
  }
  else // No padding
  {
    // In caso di bordi custom il padding e' gia' stato impostato
    // dalla chiamata this.VisStyle.ApplyStyle
    if (this.VisStyle.GetBorders(1) != 9)
    {
      this.BoxBox.style.paddingLeft = "";
      this.BoxBox.style.paddingRight = "";
    }
  }
}


// **********************************************************************
// Gestore dell'evento di change dell'input
// **********************************************************************
BookBox.prototype.OnChange = function(evento)
{
  // Se ho un unico span allora lo giro a lui, potrebbe succedere per alcuni tipi di span editabili
  // (ad es: radio)
  if (this.Spans.length == 1)
    this.Spans[0].OnChange(evento);
}


// ********************************************************************************
// Gestione click mobile su box
// ********************************************************************************
BookBox.prototype.OnTouchDown= function(evento)
{ 
  return true;
}

BookBox.prototype.OnTouchUp= function(evento, click)
{ 
  if (click && this.CanClick)
  {
    // Voglio evitare un doppio click sugli oggetti
    if (RD3_Glb.IsAndroid() || (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch()))
      RD3_DDManager.ChompClick();
    //
    this.OnClick(evento);
  }
  return true;
}


// ******************************************************************
// Memorizza o ripristina le posizione delle scrollbar
// usata quando una modale viene riportata in primo piano per non 
// perdere il posizionamento delle scrollbar
//
// vedi popupframe::BringToFront
// ******************************************************************
BookBox.prototype.SaveScrollPos = function () 
{
  if (!this.BoxBox)
    return;
  //
  this.ScrollTopPosition = this.BoxBox.scrollTop;
  this.ScrollLeftPosition = this.BoxBox.scrollLeft;
}


BookBox.prototype.SetScrollPos = function () 
{
  if (!this.BoxBox)
    return;
  //
  if (this.ScrollTopPosition)
    this.BoxBox.scrollTop = this.ScrollTopPosition;
  if (this.ScrollLeftPosition)
    this.BoxBox.scrollLeft = this.ScrollLeftPosition;
  //
  delete this.ScrollTopPosition;
  delete this.ScrollLeftPosition;
}

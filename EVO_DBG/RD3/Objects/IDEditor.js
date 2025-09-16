// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe IDEditor: Controllo di tipo HTML Editor
// ************************************************

function IDEditor(owner)
{
  this.Identifier = "";                   // Identificativo dell'editor
  this.Owner = owner;                     // Possessore dell'editor
  this.ParentField = owner.ParentField;   // IDCombo Mobile lo chiede in un milione di punti... quindi lo copiamo qui..
  //  
  this.Left = 0;
  this.Top = 0;
  this.Width = 0;
  this.Height = 0;
  this.Enabled = true;
  this.Visible = true;
  this.Layout = 1;                // HTML=1, 2=TEXT
  this.BackCol = "#FFFFFF";       // Colore di sfondo da applicare
  this.ForeCol = "#000000";       // Colore del testo da applicare
  this.HTMLContent = "";          // Testo HTML contenuto nell'Input/Div
  this.HasToolbar = true;         // Toolbar dell'Editor visibile o meno
  //
  this.Tooltip = "";              // Tooltip
  this.VisualStyle = null;        // Stile visuale
  //
  this.FontList = null;           // Lista dei Font da permettere di usare
  this.ColorList = new Array();   // Lista dei colori da permettere di usare
  this.TokenList = null;          // Lista dei Token da permettere di usare
  this.CommandsEnabled = -1;      // Comandi di toolbar abilitati
  this.DefaultFormatting = "";    //
  // this.ClassName               // Classe speciale applicata
  //
  // Oggetti di modello
  this.ToolbarContainer = null;   // Contenitore della Toolbar
  this.EditorObj = null;          // Editor in anteprima
  this.TextObj = null;            // Editor Testuale (TEXTAREA)
  //
  this.ToolBold = null;
  this.ToolItalic = null;
  this.ToolUnder = null;
  this.ToolStrike = null;
  this.ToolOrdList = null;
  this.ToolUnOrdList = null;
  this.ToolLeft = null;
  this.ToolCenter = null;
  this.ToolRight = null;
  this.ToolJust = null;
  this.ToolBackCol = null;
  this.ToolForeCol = null;
  this.ToolFont = null;
  this.ToolFontSize = null;
  this.ToolToken = null;
  this.ToolLink = null;
  this.ToolIMG = null;
  this.ToolChange = null;
  this.ToolSeparators = new Array();
  //
  this.IMGUploadObj = null;
  this.BackColApplier = null;     // Div cliccabile, se premuto imposta come colore di sfondo l'ultimo selezionato
  this.BackColChooser = null;     // Apre il Picker per impostare il colore
  this.ForeColApplier = null;     // Div cliccabile, se premuto imposta come colore di testo l'ultimo selezionato
  this.ForeColChooser = null;     // Apre il Picker per impostare il colore
  this.InputMsg       = null;     // ImputMessage per il link
  //
  this.LastSelection = null;      // Ultima selezione testuale
  this.SelectionTimer = null;     // Timer per il controllo del cambiamento della selezione testuale
  this.LastTextSend = null;       // Ultimo invio forzato del testo
  //
  this.ToolStatus = new HashTable();  // Stato dei pulsanti della Toolbar
  this.ToolObjects = new Array;
  this.PressColor = RD3_ClientParams.EditorPressIE7Color;
  this.HilightColor = RD3_ClientParams.EditorHilightIE7Color;
  //
  this.Realized = false;
  this.IsDirty = false;
}

IDEditor.prototype.Realize = function(container, cls) 
{
  // Se non mi hanno ancora assegnato un identificativo, lo creo e mi inserisco nella mappa
  if (this.Identifier == "")
  {
    this.Identifier = "ide:" + Math.floor(Math.random() * 1000000000);
    RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
  } 
  //
  if (!this.Realized)
  {
    var mob = false;
    this.RealizeToolbar(container);
    //
    if (mob)
      this.EditorObj = document.createElement("DIV");
    else
      this.EditorObj = document.createElement("IFRAME");
    this.EditorObj.className = "ideditor-body";
    //
    this.TextObj = document.createElement("TEXTAREA");
    this.TextObj.className = "ideditor-body";
    RD3_Glb.AutocompleteOff(this.TextObj);
    //
    container.appendChild(this.EditorObj);
    container.appendChild(this.TextObj);
    //
    if (mob)
    {
      this.EditorObj.setAttribute("contentEditable", "true");
      if (document.queryCommandSupported('styleWithCSS'))
          document.execCommand('styleWithCSS', false, false);
      //
      // Eventi
      var parentContext = this;
      var lf = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnLoseFocus', ev);");
      var gf = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnGetFocus', ev);");
      var kd = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyDown', ev);");
      var mc = function(ev) { parentContext.OnMouseClick(ev); };
      var mover = function(ev) { parentContext.OnMouseOverObj(ev); };
      var mout = function(ev) { parentContext.OnMouseOutObj(ev); };
      //
      this.EditorObj.addEventListener("blur", lf, true);
      this.EditorObj.addEventListener("keydown", kd, true);
      this.EditorObj.addEventListener("mousedown", mc, true);
      this.TextObj.addEventListener("blur", lf, true);
      this.TextObj.addEventListener("keydown", kd, true);
      //
      // Se non e' IE attacco gli eventi di focus
      if (!RD3_Glb.IsIE(10, false))
      {
        this.EditorObj.addEventListener("focus", gf, true);
        this.TextObj.addEventListener("focus", gf, true);
      }
      //
      // Adesso il gestore personale (quello di IDScroll scatta prima e se scroll non fa scattare il mio..)
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        this.EditorObj.addEventListener("touchstart", mc, true);
    }
    else
    {
      // L'IFRAME acquisisce il documento solo quando viene messo nel DOM
      var doc = this.GetEditorDocument();
      if (doc && doc.body && !RD3_Glb.IsFirefox())
      {
        doc.IDOwnerObject = this.Identifier;
        doc.designMode = "on";
        if (doc.queryCommandSupported('styleWithCSS'))
          doc.execCommand('styleWithCSS', false, false);
        var parentContext = this;
        //
        var lf = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnLoseFocus', ev);");
        var gf = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnGetFocus', ev);");
        var kd = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyDown', ev);");
        var mc = function(ev) { parentContext.OnMouseClick(ev); };
        var mover = function(ev) { parentContext.OnMouseOverObj(ev); };
        var mout = function(ev) { parentContext.OnMouseOutObj(ev); };
        //
        if (document.addEventListener)
        {
          this.EditorObj.contentWindow.addEventListener("blur", lf, true);
          doc.body.addEventListener("keydown", kd, true);
          doc.body.addEventListener("mouseup", mc, true);
          this.TextObj.addEventListener("blur", lf, true);
          this.TextObj.addEventListener("keydown", kd, true);
          //
          // Se non e' IE attacco gli eventi di focus
          if (!RD3_Glb.IsIE(10, false))
          {
            this.EditorObj.contentWindow.addEventListener("focus", gf, true);
            this.TextObj.addEventListener("focus", gf, true);
          }
          //
          this.ToolbarContainer.addEventListener("mouseover", mover, true);
          this.ToolbarContainer.addEventListener("mouseout", mout, true);
          //
          // Adesso il gestore personale (quello di IDScroll scatta prima e se scroll non fa scattare il mio..)
          if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
            doc.body.addEventListener("touchend", mc, true);
        }
        else
        {
          doc.body.attachEvent("onblur", lf);
          doc.body.attachEvent("onkeydown", kd);
          doc.body.attachEvent("onmouseup", mc);
          this.TextObj.attachEvent("onblur", lf);
          this.TextObj.addEventListener("onkeydown", kd);
          //
          // Se non e' IE attacco gli eventi di focus
          if (!RD3_Glb.IsIE(10, false))
          {
            doc.body.attachEvent("onfocus", gf);
            this.TextObj.attachEvent("onfocus", gf);
          }
          //
          this.ToolbarContainer.attachEvent("onmouseover", mover);
          this.ToolbarContainer.attachEvent("onmouseout", mout);
          //
          // Adesso il gestore personale (quello di IDScroll scatta prima e se scroll non fa scattare il mio..)
          if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
            doc.body.attachEvent("ontouchend", mc);
        }
      }
      else
      {
        // Se il documento non c'e' probabilmente la videata non e' ancora nel DOM.. allora attacco un evento di load all'IFrame e quando scatta 
        // finisco le impostazioni.. (su Firefox lo devo fare sempre altrimenti non va.. dipende dall'ottimizzazione delle liste..)
        if (!RD3_Glb.IsIE(10, false))
          this.EditorObj.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEditorReadyStateChange', ev)");
        else
          this.EditorObj.onreadystatechange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEditorReadyStateChange', ev)");
      }
    }
    //
    this.ToolStatus.add(RD3_Glb.IDE_BOLD, false);
    this.ToolStatus.add(RD3_Glb.IDE_ITALIC, false);
    this.ToolStatus.add(RD3_Glb.IDE_UNDERLINE, false);
    this.ToolStatus.add(RD3_Glb.IDE_STRIKE, false);
    this.ToolStatus.add(RD3_Glb.IDE_UL, false);
    this.ToolStatus.add(RD3_Glb.IDE_OL, false);
    this.ToolStatus.add(RD3_Glb.IDE_LEFT, false);
    this.ToolStatus.add(RD3_Glb.IDE_CENTER, false);
    this.ToolStatus.add(RD3_Glb.IDE_JUSTIFY, false);
    this.ToolStatus.add(RD3_Glb.IDE_RIGHT, false);
    this.ToolStatus.add(RD3_Glb.IDE_CHANGE, false);
    //
    this.Realized = true;
  }
  //
  this.SetLayout();
  this.AssignColorList();
  this.AssignTokenList();
  this.AssignFontList();
  this.SetCommandEnabled();
  this.SetClassName();
}

IDEditor.prototype.RealizeToolbar = function(container) 
{
  var base = RD3_Glb.IsMobile() ? 36 : 24;
  //
  this.ToolbarContainer = document.createElement('DIV');
  this.ToolbarContainer.className = "ideditor-toolbar";
  //
  this.ToolBold = document.createElement('SPAN');
  this.ToolBold.className = "ideditor-toolbar-img";
  this.ToolBold.style.backgroundPosition = "0px 0px";
  this.ToolObjects[RD3_Glb.IDE_BOLD] = this.ToolBold;
  //
  this.ToolItalic = document.createElement('SPAN');
  this.ToolItalic.className = "ideditor-toolbar-img";
  this.ToolItalic.style.backgroundPosition = "0px -"+base+"px";
  this.ToolObjects[RD3_Glb.IDE_ITALIC] = this.ToolItalic;
  //
  this.ToolUnder = document.createElement('SPAN');
  this.ToolUnder.className = "ideditor-toolbar-img";
  this.ToolUnder.style.backgroundPosition = "0px -"+(base*2)+"px";
  this.ToolObjects[RD3_Glb.IDE_UNDERLINE] = this.ToolUnder;
  //
  this.ToolStrike = document.createElement('SPAN');
  this.ToolStrike.className = "ideditor-toolbar-img";
  this.ToolStrike.style.backgroundPosition = "0px -"+(base*3)+"px";
  this.ToolObjects[RD3_Glb.IDE_STRIKE] = this.ToolStrike;
  //
  var sep1 = document.createElement('SPAN');
  sep1.className = "ideditor-toolbar-sep";
  this.ToolSeparators.push(sep1);
  //
  this.ToolOrdList = document.createElement('SPAN');
  this.ToolOrdList.className = "ideditor-toolbar-img";
  this.ToolOrdList.style.backgroundPosition = "0px -"+(base*4)+"px";
  this.ToolObjects[RD3_Glb.IDE_OL] = this.ToolOrdList;
  //
  this.ToolUnOrdList = document.createElement('SPAN');
  this.ToolUnOrdList.className = "ideditor-toolbar-img";
  this.ToolUnOrdList.style.backgroundPosition = "0px -"+(base*5)+"px";
  this.ToolObjects[RD3_Glb.IDE_UL] = this.ToolUnOrdList;
  //
  var sep2 = document.createElement('SPAN');
  sep2.className = "ideditor-toolbar-sep";
  this.ToolSeparators.push(sep2);
  //
  this.ToolLeft = document.createElement('SPAN');
  this.ToolLeft.className = "ideditor-toolbar-img";
  this.ToolLeft.style.backgroundPosition = "0px -"+(base*6)+"px";
  this.ToolObjects[RD3_Glb.IDE_LEFT] = this.ToolLeft;
  //
  this.ToolCenter = document.createElement('SPAN');
  this.ToolCenter.className = "ideditor-toolbar-img";
  this.ToolCenter.style.backgroundPosition = "0px -"+(base*7)+"px";
  this.ToolObjects[RD3_Glb.IDE_CENTER] = this.ToolCenter;
  //
  this.ToolRight = document.createElement('SPAN');
  this.ToolRight.className = "ideditor-toolbar-img";
  this.ToolRight.style.backgroundPosition = "0px -"+(base*8)+"px";
  this.ToolObjects[RD3_Glb.IDE_RIGHT] = this.ToolRight;
  //
  this.ToolJust = document.createElement('SPAN');
  this.ToolJust.className = "ideditor-toolbar-img";
  this.ToolJust.style.backgroundPosition = "0px -"+(base*9)+"px";
  this.ToolObjects[RD3_Glb.IDE_JUSTIFY] = this.ToolJust;
  //
  var sep3 = document.createElement('SPAN');
  sep3.className = "ideditor-toolbar-sep";
  this.ToolSeparators.push(sep3);
  //
  // BACK COL
  this.ToolBackCol = document.createElement('SPAN');
  this.ToolBackCol.className = "ideditor-toolbar-img ideditor-main";
  this.ToolBackCol.style.backgroundPosition = (RD3_Glb.IsMobile()?8:0)+"px -"+(base*10)+"px";
  this.ToolObjects[RD3_Glb.IDE_BACK] = this.ToolBackCol;
  //
  this.BackColApplier = document.createElement('DIV');
  this.BackColApplier.className = "ideditor-applier";
  this.BackColApplier.style.backgroundColor = this.BackCol;
  this.ToolBackCol.appendChild(this.BackColApplier);
  //
  this.BackColChooser = document.createElement('SPAN');
  this.BackColChooser.className = "ideditor-toolbar-img ideditor-chooser";
  this.ToolObjects[RD3_Glb.IDE_BACKCH] = this.BackColChooser;
  //
  // FORE COL
  this.ToolForeCol = document.createElement('SPAN');
  this.ToolForeCol.className = "ideditor-toolbar-img ideditor-main";
  this.ToolForeCol.style.backgroundPosition = (RD3_Glb.IsMobile()?8:0)+"px -"+(base*11)+"px";
  this.ToolObjects[RD3_Glb.IDE_FORE] = this.ToolForeCol;
  //
  this.ForeColApplier = document.createElement('DIV');
  this.ForeColApplier.className = "ideditor-applier";
  this.ForeColApplier.style.backgroundColor = this.ForeCol;
  this.ToolForeCol.appendChild(this.ForeColApplier);
  //
  this.ForeColChooser = document.createElement('SPAN');
  this.ForeColChooser.className = "ideditor-toolbar-img ideditor-chooser";
  this.ToolObjects[RD3_Glb.IDE_FORECH] = this.ForeColChooser;
  //
  var sep4 = document.createElement('SPAN');
  sep4.className = "ideditor-toolbar-sep";
  this.ToolSeparators.push(sep4);
  //
  // LINK
  this.ToolLink = document.createElement('SPAN');
  this.ToolLink.className = "ideditor-toolbar-img";
  this.ToolLink.style.backgroundPosition = "0px -"+(base*12)+"px";
  this.ToolObjects[RD3_Glb.IDE_LINK] = this.ToolLink;
  //
  // IMG UPLOADER
  if (!RD3_Glb.IsMobile() && typeof FileReader != "undefined")
  {
    this.ToolIMG = document.createElement('SPAN');
    this.ToolIMG.className = "ideditor-toolbar-img";
    this.ToolIMG.style.backgroundPosition = "0px -"+(base*13)+"px";
    this.ToolObjects[RD3_Glb.IDE_IMAGE] = this.ToolIMG;
    //
    this.IMGUploadObj = document.createElement('input');
    this.IMGUploadObj.setAttribute("type", "file");
    this.IMGUploadObj.style.display = "none";
    this.IMGUploadObj.onchange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnHTML5Upload', ev)");
  }
  //
  var sep5 = document.createElement('SPAN');
  sep5.className = "ideditor-toolbar-sep";
  this.ToolSeparators.push(sep5);
  //
  // LAYOUT
  this.ToolChange = document.createElement('SPAN');
  this.ToolChange.className = "ideditor-toolbar-img";
  this.ToolChange.style.backgroundPosition = "0px -"+(base*14)+"px";
  this.ToolObjects[RD3_Glb.IDE_CHANGE] = this.ToolChange;
  //
  var sep6 = document.createElement('SPAN');
  sep6.className = "ideditor-toolbar-sep";
  this.ToolSeparators.push(sep6);
  //
  // FONT
  this.ToolFont = new IDCombo(this);
  this.ToolFont.Realize(this.ToolbarContainer, "panel-field-value-form");
  this.ToolFont.MultiSel = false;
  this.ToolFont.SetVisible(true);
  this.ToolFont.SetWritable(false);
  this.ToolFont.UsePopover = !this.ParentField.VisSlidePad();
  //
  // FONTSIZE
  this.ToolFontSize = new IDCombo(this);
  this.ToolFontSize.Realize(this.ToolbarContainer, "panel-field-value-form");
  this.ToolFontSize.MultiSel = false;
  this.ToolFontSize.SetWritable(false);
  this.ToolFontSize.UsePopover = !this.ParentField.VisSlidePad();
  //
  // TOKEN
  this.ToolToken = new IDCombo(this);
  this.ToolToken.Realize(this.ToolbarContainer, "panel-field-value-form");
  this.ToolToken.MultiSel = false;
  this.ToolToken.SetWritable(false);
  this.ToolToken.UsePopover = !this.ParentField.VisSlidePad();
  //
  // EVENTI
  if (!RD3_Glb.IsMobile())
  {
    this.ToolBold.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'B')");
    this.ToolItalic.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'I')");
    this.ToolUnder.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'U')");
    this.ToolStrike.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'S')");
    this.ToolOrdList.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'OL')");
    this.ToolUnOrdList.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'UL')");
    this.ToolLeft.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'L')");
    this.ToolCenter.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'C')");
    this.ToolRight.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'R')");
    this.ToolJust.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'J')");
    this.ToolLink.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'LINK')");
    if (this.ToolIMG)
      this.ToolIMG.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'IMG')");
    this.ToolChange.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'CHG')");
    this.ToolBackCol.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'BKG')");
    this.BackColChooser.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'BKGC')");
    this.ToolForeCol.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'FCG')");
    this.ForeColChooser.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onToolCommand', ev, 'FCGC')");
  }
  //
  this.ToolbarContainer.appendChild(this.ToolBold);
  this.ToolbarContainer.appendChild(this.ToolItalic);
  this.ToolbarContainer.appendChild(this.ToolUnder);
  this.ToolbarContainer.appendChild(this.ToolStrike);
  this.ToolbarContainer.appendChild(sep1);
  this.ToolbarContainer.appendChild(this.ToolOrdList);
  this.ToolbarContainer.appendChild(this.ToolUnOrdList);
  this.ToolbarContainer.appendChild(sep2);
  this.ToolbarContainer.appendChild(this.ToolLeft);
  this.ToolbarContainer.appendChild(this.ToolCenter);
  this.ToolbarContainer.appendChild(this.ToolRight);
  this.ToolbarContainer.appendChild(this.ToolJust);
  this.ToolbarContainer.appendChild(sep3);
  this.ToolbarContainer.appendChild(this.ToolBackCol);
  this.ToolbarContainer.appendChild(this.BackColChooser);
  this.ToolbarContainer.appendChild(this.ToolForeCol);
  this.ToolbarContainer.appendChild(this.ForeColChooser);
  this.ToolbarContainer.appendChild(sep4);
  this.ToolbarContainer.appendChild(this.ToolLink);
  if (this.ToolIMG)
    this.ToolbarContainer.appendChild(this.ToolIMG);
  this.ToolbarContainer.appendChild(sep5);
  this.ToolbarContainer.appendChild(this.ToolChange);
  this.ToolbarContainer.appendChild(sep6);
  //
  if (this.IMGUploadObj)
    this.ToolbarContainer.appendChild(this.IMGUploadObj);
  //
  container.appendChild(this.ToolbarContainer); 
}

IDEditor.prototype.UpdateToolbar = function(rng) 
{
  var insideBold = false;
  var insideItalic = false;
  var insideUnder = false;
  var insideStrike = false;
  var insideOrd = false;
  var insideUnord = false;
  var insideLeft = false;
  var insideCenter = false;
  var insideRight = false;
  var insideJust = false;
  var insideLink = false;
  var canLink = false;
  var fntFamily = "-";
  var fntSize = "0";
  //
  // Se mi hanno passato un range posso usarlo per capire dove sono
  if (rng)
  {
    var obj = null;
    //
    if (rng.startContainer)
    {
      // Faccio una verifica per il punto iniziale; Word si comporta cosi'
      obj = rng.startContainer;
    }
    else if (rng.parentElement)
    {
      // IE9 e minori
      obj = rng.parentElement();
    }
    //
    if (obj) // && RD3_Glb.isInsideEditor(obj))
    {
      while (obj != null)
      {
        if (obj.tagName == "BODY")
          break;
        //
        // Tag
        switch (obj.tagName)
        {
          case 'B':
          case 'STRONG':
            insideBold = true;
          break;
          
          case 'I':
          case 'EM':
            insideItalic = true;
          break;
          
          case 'U':
            insideUnder = true;
          break;
          
          case 'STRIKE':
            insideStrike = true;
          break;
          
          case 'OL':
            insideOrd = true;
          break;
          
          case 'UL':
            insideUnord = true;
          break;
          
          case 'A':
            insideLink = true;
          break;
          
        }
        //
        // Allineamenti
        if (obj.align=="left" || (obj.style && obj.style.textAlign=="left"))
          insideLeft = true;
        else if (obj.align=="center" || (obj.style && obj.style.textAlign=="center"))
          insideCenter = true;
        else if (obj.align=="right" || (obj.style && obj.style.textAlign=="right"))
          insideRight = true;
        else if (obj.align=="justify" || (obj.style && obj.style.textAlign=="justify"))
          insideJust = true;  
        //
        // Font
        try
        {
          var curSt = RD3_Glb.GetCurrentStyle(obj);
          if (fntFamily == "-")
          {
            fntFamily = curSt.fontFamily;
            //
            // Su chrome e' 'Timer New Roman'..
            fntFamily = fntFamily.replace(/\'/g, "");
          }
          //
          if (fntSize == "0")
          {
            fntSize = curSt.fontSize.replace("pt","");
            if (fntSize.indexOf("px") >= 0 && obj.tagName=="SPAN" && obj.style.fontSize.indexOf("pt") >= 0)
            {
              // Solo IE e' bravo e gestisce le dimensioni in pt.. tutti gli altri convertono automaticamente in px..
              // in questo caso provo a vedere se l'oggetto e' uno degli span con il size impostato da noi..
              fntSize = obj.style.fontSize.replace("pt","");
            }
            else
            {
              // I px non mi vanno bene.. continuiamo a provarci..
              fntSize = "0";
            }
          }
        }
        catch (ex) { }
        //
        var par = (RD3_Glb.IsIE(10, false) ? obj.parentElement : obj.parentNode);
        if (par)
          obj = par;
        else
          obj = null;
      }
    }
    //
    if (rng.text && rng.text != "")
      canLink = true;
    else if (!rng.collapsed)
      canLink = true;
  }
  //
  // Gestisco il Font, se non l'ho trovato... allora lascio la combo cosi' com'e'
  if (fntFamily  != "-" && this.FontList)
  {
    // La cerco nella lista.. sperando di averlo..
    var fntl = this.FontList.FindItemsByValue(fntFamily, false, ';');
    if (fntl.length>0)
      this.ToolFont.SetText(fntFamily, true, true);
    else
      this.ToolFont.SetText("", true, true); // E' un font che non conosco.. svuoto la combo
  }
  //
  if (fntSize  != "0" && this.FontSizeList)
  {
    // La cerco nella lista.. sperando di averlo..
    var fntl = this.FontSizeList.FindItemsByValue(fntSize, false, ';');
    if (fntl.length>0)
      this.ToolFontSize.SetText(fntSize, true, true);
    else
      this.ToolFontSize.SetText("", true, true); // E' un font che non conosco.. svuoto la combo
  }
  //
  // Uso le variabili per evidenziare i pulsanti impostando la selezione
  this.SetToolbarCommandStatus(RD3_Glb.IDE_BOLD, insideBold);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_ITALIC, insideItalic);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_UNDERLINE, insideUnder);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_STRIKE, insideStrike);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_UL, insideUnord);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_OL, insideOrd);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_LEFT, insideLeft);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_CENTER, insideCenter);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_JUSTIFY, insideJust);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_RIGHT, insideRight);
  this.SetToolbarCommandStatus(RD3_Glb.IDE_LINK, insideLink);
  //
  this.ToolLink.setAttribute("id_disabled", canLink ? "false" : "true");
  this.ToolLink.style.cursor = (this.Layout==1 && this.Enabled && canLink ? "pointer" : "default");
  //
  // Posiziono le Combo (non e' necessario farlo sempre..)
  if (rng == undefined)
  {
    var repos = false;
    var rect = this.GetToolbarLimit();
    var leftPos = rect.x;
    var topPos = rect.y+2;
    if (this.Width > 0 && leftPos+154>this.Width && this.ToolFont && this.ToolFont.Visible)
    {
      leftPos = 4;
      topPos = rect.y+2+(RD3_Glb.IsMobile()?36:24);
      repos = true;
    }
    //
    if (this.ToolFont && this.ToolFont.Visible)
    {
      this.ToolFont.SetHeight(20);
      this.ToolFont.SetWidth(150);
      this.ToolFont.SetTop(topPos);
      this.ToolFont.SetLeft(leftPos);
      leftPos += 154;
    }
    //
    if (this.Width > 0 && leftPos+40>this.Width && this.ToolFontSize && this.ToolFontSize.Visible)
    {
      leftPos = 4;
      topPos = rect.y+2+(RD3_Glb.IsMobile()?36:24);
      repos = true;
    }
    //
    if (this.ToolFontSize && this.ToolFontSize.Visible)
    {
      this.ToolFontSize.SetHeight(20);
      this.ToolFontSize.SetWidth(40);
      this.ToolFontSize.SetTop(topPos);
      this.ToolFontSize.SetLeft(leftPos);
      leftPos += 44;
    }
    //
    if (this.Width > 0 && leftPos+100>this.Width && this.ToolToken && this.ToolToken.Visible)
    {
      leftPos = 4;
      topPos = rect.y+2+(RD3_Glb.IsMobile()?36:24);
      repos = true;
    }
    //
    if (this.ToolToken && this.ToolToken.Visible)
    {
      this.ToolToken.SetHeight(20);
      this.ToolToken.SetWidth(100);
      this.ToolToken.SetTop(topPos);
      this.ToolToken.SetLeft(leftPos);
      leftPos += 104;
    }
    //
    // In questo caso, visto che le combo sono posizionate assolutamente e sono solo loro a fare andare a capo la toolbar.. devo alzare l'altezza da style..
    if (repos)
    {
      this.ToolbarContainer.style.height = (topPos + (RD3_Glb.IsMobile()?40:20) + 2) + "px";
      this.SetTop();
      this.SetHeight();
    }
  }
}

IDEditor.prototype.UpdateCursor = function()
{
  this.ToolBold.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolItalic.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolUnder.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolStrike.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolOrdList.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolUnOrdList.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolLeft.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolCenter.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolRight.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolJust.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolLink.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolBackCol.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.BackColChooser.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.BackColApplier.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolForeCol.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ForeColChooser.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ForeColApplier.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  this.ToolChange.style.cursor = (this.Enabled ? "pointer" : "default");
  if (this.ToolIMG)
    this.ToolIMG.style.cursor = (this.Layout==1 && this.Enabled ? "pointer" : "default");
  //
  // Tocca alle combo
  this.ToolFont.SetEnabled(this.Layout==1 && this.Enabled);
  this.ToolFontSize.SetEnabled(this.Layout==1 && this.Enabled);
  this.ToolToken.SetEnabled(this.Layout==1 && this.Enabled);
}

IDEditor.prototype.Unrealize = function() 
{
  // Mi tolgo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  if (this.ToolbarContainer && this.ToolbarContainer.parentNode)
    this.ToolbarContainer.parentNode.removeChild(this.ToolbarContainer);
  this.ToolbarContainer = null;
  //
  if (this.EditorObj && this.EditorObj.parentNode)
    this.EditorObj.parentNode.removeChild(this.EditorObj);
  this.EditorObj = null;
  //
  if (this.TextObj && this.TextObj.parentNode)
    this.TextObj.parentNode.removeChild(this.TextObj);
  this.TextObj = null;
  //
  if (this.SelectionTimer)
    window.clearInterval(this.SelectionTimer);
  this.SelectionTimer = null;
  //
  if (this.InputMsg)
    this.InputMsg.Unrealize();
  this.InputMsg = null;
  //
  // Annullo i puntatori (questi oggetti sono dentro il ToolbarContainer.. quindi quando tolgo lui dal DOM tolgo anche loro.. pero' devo rimuovere i puntatori)
  this.ToolBold = null;
  this.ToolItalic = null;
  this.ToolUnder = null;
  this.ToolStrike = null;
  this.ToolOrdList = null;
  this.ToolUnOrdList = null;
  this.ToolLeft = null;
  this.ToolCenter = null;
  this.ToolRight = null;
  this.ToolJust = null;
  this.ToolBackCol = null;
  this.ToolForeCol = null;
  this.ToolFontSize = null;
  this.ToolToken = null;
  this.ToolLink = null;
  this.ToolIMG = null;
  this.ToolChange = null;
  //
  this.IMGUploadObj = null;
  this.BackColApplier = null;
  this.BackColChooser = null;
  this.ForeColApplier = null;
  this.ForeColChooser = null;
  //
  if (this.ToolFont)
    this.ToolFont.Unrealize();
  this.ToolFont = null;
  //
  if (this.ToolFontSize)
    this.ToolFontSize.Unrealize();
  this.ToolFontSize = null;
  //
  if (this.ToolToken)
    this.ToolToken.Unrealize();
  this.ToolToken = null;
  //
  if (this.LastSelection && this.LastSelection.detach)
    this.LastSelection.detach();
  this.LastSelection = null;
  //
  // Svuoto il l'array
  this.ToolSeparators.splice(0, this.ToolSeparators.length);
  this.ToolSeparators = null;
  //
  this.ToolObjects.splice(0, this.ToolObjects.length);
  this.ToolObjects = null;
}

IDEditor.prototype.SetHasToolbar = function(hastb)
{
  var old = this.HasToolbar;
  this.HasToolbar = hastb;
  //
  if (this.Realized && (old != this.HasToolbar || hastb==undefined))
    this.ToolbarContainer.style.display = this.HasToolbar ? "" : "none";
}

IDEditor.prototype.SetWidth = function(w)
{
  var old = this.Width;
  if (w != undefined)
    this.Width = w;
  //
  if (this.Realized)
  {
    var oldtoolh = this.GetToolbarHeight();
    this.ToolbarContainer.style.width = (this.Width - 4) + "px"; // 4px padding
    //
    this.EditorObj.style.width = this.Width + "px";
    this.TextObj.style.width = this.Width + "px";
    //
    // Cambiare la width puo' anche cambiare l'altezza della toolbar.. quindi devo richiamare la SetTop in modo da
    // rimettere a posto il Top degli editor
    // Se la toolbar era stata alzata per colpa delle combo (quindi impostando l'height) allora lo tolgo.. 
    // poi ci pensa l'updateToolbar a metterla a posto se serve effettivamente
    if (old != this.Width && this.Width > old)
      this.ToolbarContainer.style.height = "";
    //
    this.SetTop();
    //
    // Allargare il campo potrebbe far cambiare l'altezza della toolbar (perche' magari ora ci stanno tutte le icone) 
    // in questo caso anche la posizione del frame e della textarea deve essere ricalcolata
    if (oldtoolh != this.GetToolbarHeight())
      this.SetHeight();
  }
}

IDEditor.prototype.SetHeight = function(h)
{
  if (h != undefined)
    this.Height = h;
  //
  if (this.Realized)
  {
    var ht = this.Height - this.GetToolbarHeight()-1;
    ht = (ht<=0 ? 0 : ht);
    //
    this.EditorObj.style.height = ht + "px";
    this.TextObj.style.height = ht + "px";
  }
}

IDEditor.prototype.SetTop = function(t)
{
  if (t != undefined)
    this.Top = t;
  //
  if (this.Realized)
  {
    this.ToolbarContainer.style.top = this.Top + "px";
    //
    var h = this.GetToolbarHeight() - 1; // -1 per bordo..
    this.EditorObj.style.top = (this.Top + h) + "px";
    this.TextObj.style.top = (this.Top + h) + "px";
  }
}

IDEditor.prototype.SetLeft = function(l)
{
  if (l != undefined)
    this.Left = l;
  //
  if (this.Realized)
  {
    this.ToolbarContainer.style.left = this.Left + "px";
    //
    this.EditorObj.style.left = this.Left + "px";
    this.TextObj.style.left = this.Left + "px";
  }
}

IDEditor.prototype.SetActive = function(act)
{
  if (act && this.Owner && this.Owner.ParentField)
  {
    var pf = this.Owner.ParentField;
    var vs = this.Owner.PValue ? this.Owner.PValue.GetVisualStyle() : pf.VisualStyle;
    //
    var backCol  = vs.GetColor(10); // VISCLR_EDITING
    var brdColor = vs.GetColor(11); // VISCLR_BORDERS
    var bt = vs.GetBorders((this.Owner.InList)? 1 : 6); // VISBDI_VALUE : VISBDI_VALFORM
    var r = vs.GetBookOffset(true,(this.Owner.InList)? 1 : 6); // r contiene le dimensioni di ogni bordo
    // r.x = bordo sinistro
    // r.y = bordo sopra
    // r.w = bordo destro
    // r.h = bordo sotto
    //
    // Evidenzio il mio bordo
    var s = this.EditorObj.style;
    if (backCol != "transparent")
      s.backgroundColor = backCol;
    else
    {
      // Imposto i bordi solo se non c'e' il colore di editing
      s.border = "2px solid " + brdColor;
      var neww = parseInt(s.width)-(2-r.x-r.w);
      var newh = parseInt(s.height)-(4-r.y-r.h);
      s.width = (neww<0 ? 0 : neww) + "px";
      s.height = (newh<0 ? 0 : newh) + "px";
    }
    //
    s = this.TextObj.style;
    if (backCol != "transparent")
      s.backgroundColor = backCol;
    else
    {
      // Imposto i bordi solo se non c'e' il colore di editing
      s.border = "2px solid " + brdColor;
      var neww = parseInt(s.width)-(2-r.x-r.w);
      var newh = parseInt(s.height)-(4-r.y-r.h);
      s.width = (neww<0 ? 0 : neww) + "px";
      s.height = (newh<0 ? 0 : newh) + "px";
    }
  }
}

IDEditor.prototype.Clone = function(owner)
{
  // TODO : AL MOMENTO L'EDITOR NON VIENE CLONATO
  var newEditor = new IDEditor(owner);
  //
  // La battezzo e la inserisco nella mappa
  newEditor.Identifier = "ide:" + Math.floor(Math.random() * 1000000000);
  RD3_DesktopManager.ObjectMap.add(newEditor.Identifier, newEditor);
  //
  // Copio le proprieta'
  newEditor.Left = this.Left;
  newEditor.Top = this.Top;
  newEditor.Width = this.Width;
  newEditor.Height = this.Height;
  newEditor.Enabled = this.Enabled;
  newEditor.Visible = this.Visible;
  //
  newEditor.Layout = this.Layout;
  newEditor.BackCol = this.BackCol;
  newEditor.ForeCol = this.ForeCol;
  newEditor.HTMLContent = this.HTMLContent;
  newEditor.HasToolbar = this.HasToolbar;
  newEditor.Tooltip = this.Tooltip;
  newEditor.VisualStyle = this.VisualStyle;
  newEditor.FontList = this.FontList;
  newEditor.ColorList = this.ColorList;
  newEditor.TokenList = this.TokenList;
  //
  // Clono l'input
  /*
  NewCombo.ComboInput = this.ComboInput.cloneNode(false);
  if (RD3_Glb.IsMobile())
    NewCombo.ComboInput.value = this.ComboInput.value;
  //
  // Se c'e' l'attivatore clono anche lui
  if (this.ComboActivator)
    NewCombo.ComboActivator = this.ComboActivator.cloneNode(false);
  //
  // Se c'e' l'immagine (ed e' visibile) clono anche lei
  if (this.ComboImg)
    NewCombo.ComboImg = this.ComboImg.cloneNode(false);
  //
  // Se c'e' il Badge clono anche lui
  if (this.ComboBadge)
    NewCombo.ComboBadge = this.ComboBadge.cloneNode(true);
    */
  //
  // Fatto
  return newEditor;
}

IDEditor.prototype.OnMouseOverObj= function(ev)
{
  if (!this.Enabled)
    return;
  //
  var eve = (window.event)?window.event:ev;
  var srcobj = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  //
  // In testuale solo il change e' consentito
  if (this.Layout!=1 && srcobj != this.ToolChange)
    return;
  //
  var keys = new Array();
  if (Object.keys)
  {
    keys = Object.keys(this.ToolObjects);
  }
  else
  {
    for (var ix in this.ToolObjects) 
    {
      if (this.ToolObjects.hasOwnProperty(ix))
        keys.push(ix);
    }
  }
  //
  for (var i=0; i<keys.length; i++)
  {
    var key = keys[i];
    var obj = this.ToolObjects[parseInt(key, 10)];
    //
    // Trovato, lo evidenzio
    if (obj == srcobj && obj.getAttribute("id_disabled") != "true")
      srcobj.style.backgroundColor = this.HilightColor;
  }
}

IDEditor.prototype.OnMouseOutObj= function(ev)
{
  if (!this.Enabled)
    return;
  //
  var eve = (window.event)?window.event:ev;
  var srcobj = (window.event)?eve.srcElement:eve.target;
  //
  // In testuale solo il change e' consentito
  if (this.Layout!=1 && srcobj != this.ToolChange)
    return;
  //
  var keys = new Array();
  if (Object.keys)
  {
    keys = Object.keys(this.ToolObjects);
  }
  else
  {
    for (var ix in this.ToolObjects) 
    {
      if (this.ToolObjects.hasOwnProperty(ix))
        keys.push(ix);
    }
  }
  //
  for (var i=0; i<keys.length; i++)
  {
    var key = keys[i];
    var obj = this.ToolObjects[parseInt(key, 10)];
    //
    // Trovato, lo evidenzio
    if (obj == srcobj)
    {
      if (obj == this.ToolBackCol || obj == this.ToolForeCol || obj == this.BackColChooser || obj == this.ForeColChooser || obj == this.ToolIMG || obj == this.ToolLink)
        srcobj.style.backgroundColor = "";
      else
        this.SetToolbarCommandStatus(parseInt(key, 10), this.ToolStatus[parseInt(key, 10)], true);
    }
  }
}

IDEditor.prototype.SetVisible = function(value) 
{
  if (value != this.Visible || value == undefined)
  {
    if (value != undefined)
      this.Visible = value;
    //
    // Aggiorno la visibilita' degli oggetti
    if (this.ToolbarContainer)
      RD3_Glb.SetDisplay(this.ToolbarContainer, this.Visible && this.HasToolbar ? "" : "none");
    if (this.EditorObj)
      RD3_Glb.SetDisplay(this.EditorObj, this.Visible && this.Layout==1 ? "" : "none");
    if (this.TextObj)
      RD3_Glb.SetDisplay(this.TextObj, this.Visible && this.Layout!=1 ? "" : "none");
  }
}

IDEditor.prototype.SetEnabled = function(value) 
{
  // Se e' cambiato lo stato
  if (value != this.Enabled || value==undefined)
  {
    if (value != undefined)
      this.Enabled = value;
    //
    if (this.Enabled)
    {
      var doc = this.GetEditorDocument();
      if (doc)
      {
        doc.designMode = "on";
        try
        {
          if (doc.queryCommandSupported('styleWithCSS'))
            doc.execCommand('styleWithCSS', false, false);
        }
        catch (ex) {}
      }      
      //
      this.TextObj.removeAttribute("readonly");
      this.ToolbarContainer.style.opacity = "";
    }
    else
    {
      var doc = this.GetEditorDocument();
      if (doc)
        doc.designMode = "off";
      //
      this.TextObj.setAttribute("readonly",true);
      this.ToolbarContainer.style.opacity = "0.6";
    }
    //
    // Adesso tocca ai cursori
    this.UpdateCursor();
  }
}

IDEditor.prototype.SetVisualStyle = function(vs, force)
{
  if (this.VisualStyle != vs || force)
  {
    // E' cambiato
    this.VisualStyle = vs;
    //
    if (this.ToolFont)
      this.ToolFont.SetVisualStyle(this.VisualStyle, false, force);
    if (this.ToolFontSize)
      this.ToolFontSize.SetVisualStyle(this.VisualStyle, false, force);  
    if (this.ToolToken)
      this.ToolToken.SetVisualStyle(this.VisualStyle, false, force);  
    //
    if (this.ToolbarContainer)
    {
      this.VisualStyle.ApplyBorderStyle(this.ToolbarContainer, (this.Owner.InList ? 1 : 9));
      var bc = this.VisualStyle.GetColor(11); // VISCLR_BORDERS = 11;
      //
      // Se il colore e' nel formato corretto lo applico anche come sfondo (come RGBA)
      if (bc.indexOf("#") != -1 && bc.length==7)
      {
        var r = parseInt(bc.substring(1, 3), 16);
        var g = parseInt(bc.substring(3, 5), 16);
        var b = parseInt(bc.substring(5, 7), 16);
        //
        if (RD3_Glb.IsIE(10, false))
        {
          // Non suppporta RGBA... allora li scegliamo noi
          this.ToolbarContainer.style.backgroundColor = RD3_ClientParams.EditorToolbarIE7Color;
        }
        else
        {
          this.ToolbarContainer.style.backgroundColor = "rgba("+r+", "+g+", "+b+", 0.15)";
          this.PressColor = "rgba("+r+", "+g+", "+b+", 0.75)";
          this.HilightColor = "rgba("+r+", "+g+", "+b+", 0.50)";
        }
        //
        for (var i=0; i<this.ToolSeparators.length; i++)
          this.ToolSeparators[i].style.borderRight = "1px solid " + bc;
      }
    }
  }
}

IDEditor.prototype.SetText = function(txt)
{
  if (txt != undefined)
    this.HTMLContent = txt;
  //
  if (this.Realized)
  {
    var doc = this.GetEditorDocument();
    if (doc && doc.body)
      doc.body.innerHTML = this.HTMLContent;
    //
    this.TextObj.value = this.HTMLContent;
  }
  //
  this.IsDirty = false;
}


IDEditor.prototype.HideContent = function(hide, disable)
{
  if (hide)
  {
    // Se richiesto, disabilito l'input
    if (disable)
    {
      var doc = this.GetEditorDocument();
      if (doc)
        doc.designMode = "off";
      //
      this.TextObj.setAttribute("readonly",true);
    }
    //
    // Nascondo gli oggetti
    if (this.ToolbarContainer)
      RD3_Glb.SetDisplay(this.ToolbarContainer, "none");
    if (this.EditorObj)
      RD3_Glb.SetDisplay(this.EditorObj, "none");
    if (this.TextObj)
      RD3_Glb.SetDisplay(this.TextObj, "none");
  }
  else
  {
    var doc = this.GetEditorDocument();
    if (this.Enabled && doc && doc.designMode != "on")
    {
      doc.designMode = "on";
      if (doc.queryCommandSupported('styleWithCSS'))
        doc.execCommand('styleWithCSS', false, false);
    }    
    //
    if (this.Enabled)
      this.TextObj.removeAttribute("readonly");
    //
    this.SetVisible();
  }
}

IDEditor.prototype.SetBackGroundImage = function(img)
{
  // TODO
}

IDEditor.prototype.SetTooltip = function(tip)
{
  // TODO
}

IDEditor.prototype.GetDOMObj = function()
{
  if (this.Realized)
  {
    if (this.Layout == 1)
      return this.EditorObj;
    else
      return this.TextObj;
  }
  //
  return null;
}

IDEditor.prototype.GetTooltip = function(tip, obj)
{
  // TODO
}

IDEditor.prototype.RemoveWatermark = function()
{
  // TODO
}

IDEditor.prototype.AssignFontList = function(fnt)
{
  if (fnt !== undefined)
    this.FontList = fnt;
  //
  if (this.Realized)
  {
    if (this.FontList && this.FontList.ItemList.length>0 && this.ToolFont)
    {
      // Se non ho la lista delle dimensioni la creo.. poi la assegno alla combo delle dimensioni
      if (!this.FontSizeList)
      {
        this.FontSizeList = new ValueList();
        //
        for (var fs=8; fs<24; fs++)
        {
          var fsl = fs;
          switch (fs)
          {
            case 13: fsl=14; break;
            case 14: fsl=16; break;
            case 15: fsl=18; break;
            case 16: fsl=20; break;
            case 17: fsl=22; break;
            case 18: fsl=24; break;
            case 19: fsl=26; break;
            case 20: fsl=28; break;
            case 21: fsl=36; break;
            case 22: fsl=48; break;
            case 23: fsl=72; break;
          }
          //
          var newitem = new ValueListItem();
          newitem.Name = "" + fsl;
          newitem.Value = "" + fsl;
          newitem.OrgNames = "" + fsl;
          newitem.HtmlNames = "" + fsl;
          //
          this.FontSizeList.ItemList.push(newitem);
        }
        //
        this.ToolFontSize.AssignValueList(this.FontSizeList, true);
        //
        // Dico alla combo di selezionare il primo valore..
        this.ToolFontSize.SetText(this.FontSizeList.ItemList[0].Value, true, true);
      }
      //
      this.ToolFont.AssignValueList(this.FontList, true);
      //
      // Dico alla combo di selezionare il primo valore se non ho attualmente una selezione..
      if (this.ToolFont.SelItems && this.ToolFont.SelItems.length==0)
        this.ToolFont.SetText(this.FontList.ItemList[0].Value, true, true);
      //
      var upd = false;
      if (this.ToolFont.Visible == false && this.IsCommandEnabled(RD3_Glb.IDE_FONT))
      {
        this.ToolFont.SetVisible(true);
        upd = true;
      }
      if (this.ToolFontSize.Visible == false && this.IsCommandEnabled(RD3_Glb.IDE_SIZE))
      {
        this.ToolFontSize.SetVisible(true);
        upd = true;
      }
      if (upd)
        this.UpdateToolbar();
    }
    else 
    {
     // Qui devo nascondere la combo perche' non abbiamo font.. 
     var upd = false;
     if (this.ToolFont.Visible)
     {
       this.ToolFont.SetVisible(false);
       upd = true;
     }
     if (this.ToolFontSize.Visible)
     {
       this.ToolFontSize.SetVisible(false);
       upd = true;
     }
     if (upd)
       this.UpdateToolbar();
    }
  }
}

IDEditor.prototype.AssignColorList = function(clr)
{
  if (clr !== undefined)
  {
    this.ColorList = clr;
    this.ColorForeList = null;
  }
  //
  if (this.Realized)
  {
    if (this.ColorList == null || this.ColorList.length == 0)
    {
      this.ToolBackCol.style.display = "none";
      this.BackColChooser.style.display = "none";
      this.ToolForeCol.style.display = "none";
      this.ForeColChooser.style.display = "none";
    }
    else
    {
      this.SetCommandEnabled();
    }
  }
}

IDEditor.prototype.AssignTokenList = function(tkl)
{
  if (tkl !== undefined)
    this.TokenList = tkl;
  //
  if (this.Realized)
  {
    if (this.TokenList && this.TokenList.ItemList.length>0 && this.ToolToken)
    {
      this.ToolToken.AssignValueList(this.TokenList, true);
      //
      if (this.ToolToken.Visible == false && this.IsCommandEnabled(RD3_Glb.IDE_TOKEN))
      {
        this.ToolToken.SetVisible(true);
        this.UpdateToolbar();
      }
    }
    else 
    {
     // Qui devo nascondere la combo perche' non abbiamo token.. 
     if (this.ToolToken.Visible)
     {
       this.ToolToken.SetVisible(false);
       this.UpdateToolbar();
     }
    }
  }
}

IDEditor.prototype.SetLayout = function(newLayout)
{
  var oldLayout = this.Layout;
  if (newLayout != undefined)
    this.Layout = newLayout;
  //
  if (this.Realized && (oldLayout!=this.Layout || newLayout==undefined))
  {
    if (this.Layout == 1)
    {
      RD3_Glb.SetDisplay(this.EditorObj, "");
      RD3_Glb.SetDisplay(this.TextObj, "none");
      //
      var doc = this.GetEditorDocument();
      if (doc && doc.body)
        doc.body.innerHTML = this.TextObj.value;
    }
    else
    {
      RD3_Glb.SetDisplay(this.EditorObj, "none");
      RD3_Glb.SetDisplay(this.TextObj, "");
      //
      this.TextObj.value = this.EditorObj.innerHTML;
      var doc = this.GetEditorDocument();
      if (doc && doc.body)
        this.TextObj.value = doc.body.innerHTML;
    }
    //
    // Adesso tocca ai cursori
    this.UpdateCursor();
    //
    // Cambio l'immagine di sfondo
    var base = RD3_Glb.IsMobile() ? 36 : 24;
    this.ToolChange.style.backgroundPosition = (this.Layout!=1 ? "0px -"+(base*15)+"px" : "0px -"+(base*14)+"px");
  }
}

IDEditor.prototype.IsUncommited = function()
{
  // Non applicabile perche' i vari browser (soprattutto quelli vecchi .. IE) modificano la rappresentazione HTML rispetto a quella che gli passi anche se l'utente non ci ha lavorato..
  //var data = this.getData();
  //if (data != this.HTMLContent)
    //return true;
  //
  return this.IsDirty; 
}

IDEditor.prototype.SetID = function(id)
{
  this.EditorObj.setAttribute("id", id+":html");
  this.TextObj.setAttribute("id", id+":txt");
  this.ToolbarContainer.setAttribute("id", id+":tlc");
  //
  this.ToolFont.SetID(id+":tcmb1");
  this.ToolFontSize.SetID(id+":tcmb2");
  this.ToolToken.SetID(id+":tcmb3");
  //
  if (this.Owner.SetZIndex)
  {
    this.Owner.SetZIndex(this.EditorObj);
    this.Owner.SetZIndex(this.TextObj);
  }
}

// ****************************************************************
// Torna TRUE se il comando e' abilitato
// ****************************************************************
IDEditor.prototype.IsCommandEnabled = function(cmd)
{
  return ((this.CommandsEnabled & cmd) > 0);
}

// ****************************************************************************************
// Torna TRUE se uno dei comandi passati nell'array e' abilitato o se sono tutti abilitati
// ****************************************************************************************
IDEditor.prototype.AreCommandsEnabled = function(orOper, cms)
{
  var ret = true;
  if (orOper)
    ret = false;
  //
  for (var i=0; i<cms.length; i++)
  {
    if (orOper)
      ret = ret || this.IsCommandEnabled(cms[i]);
    else
      ret = ret && this.IsCommandEnabled(cms[i]);
  }
  //
  return ret
}

// ****************************************************************
// Assegna i comandi abilitati
// ****************************************************************
IDEditor.prototype.SetCommandEnabled = function(val)
{
  var old = this.CommandsEnabled;
  if (val !== undefined)
    this.CommandsEnabled = val;
  //
  if (this.Realized && (old!=this.CommandsEnabled || val===undefined))
  {
    this.ToolBold.style.display = this.IsCommandEnabled(RD3_Glb.IDE_BOLD) ? "" : "none";
    this.ToolItalic.style.display = this.IsCommandEnabled(RD3_Glb.IDE_ITALIC) ? "" : "none";
    this.ToolUnder.style.display = this.IsCommandEnabled(RD3_Glb.IDE_UNDERLINE) ? "" : "none";
    this.ToolStrike.style.display = this.IsCommandEnabled(RD3_Glb.IDE_STRIKE) ? "" : "none";
    this.ToolSeparators[0].style.display = this.AreCommandsEnabled(true, [RD3_Glb.IDE_BOLD, RD3_Glb.IDE_ITALIC, RD3_Glb.IDE_UNDERLINE, RD3_Glb.IDE_STRIKE]) ? "" : "none";
    this.ToolOrdList.style.display = this.IsCommandEnabled(RD3_Glb.IDE_OL) ? "" : "none";
    this.ToolUnOrdList.style.display = this.IsCommandEnabled(RD3_Glb.IDE_UL) ? "" : "none";
    this.ToolSeparators[1].style.display = this.AreCommandsEnabled(true, [RD3_Glb.IDE_OL, RD3_Glb.IDE_UL]) ? "" : "none";
    this.ToolLeft.style.display = this.IsCommandEnabled(RD3_Glb.IDE_LEFT) ? "" : "none";
    this.ToolCenter.style.display = this.IsCommandEnabled(RD3_Glb.IDE_CENTER) ? "" : "none";
    this.ToolRight.style.display = this.IsCommandEnabled(RD3_Glb.IDE_RIGHT) ? "" : "none";
    this.ToolJust.style.display = this.IsCommandEnabled(RD3_Glb.IDE_JUSTIFY) ? "" : "none";
    this.ToolSeparators[2].style.display = this.AreCommandsEnabled(true, [RD3_Glb.IDE_LEFT, RD3_Glb.IDE_CENTER, RD3_Glb.IDE_RIGHT, RD3_Glb.IDE_JUSTIFY]) ? "" : "none";
    this.ToolBackCol.style.display = (this.ColorList.length>0 && this.IsCommandEnabled(RD3_Glb.IDE_BACK)) ? "" : "none";
    this.BackColChooser.style.display = (this.ColorList.length>0 && this.IsCommandEnabled(RD3_Glb.IDE_BACK)) ? "" : "none";
    this.ToolForeCol.style.display = (this.ColorList.length>0 && this.IsCommandEnabled(RD3_Glb.IDE_FORE)) ? "" : "none";
    this.ForeColChooser.style.display = (this.ColorList.length>0 && this.IsCommandEnabled(RD3_Glb.IDE_FORE)) ? "" : "none";
    this.ToolSeparators[3].style.display = this.AreCommandsEnabled(true, [RD3_Glb.IDE_BACK, RD3_Glb.IDE_FORE]) ? "" : "none";
    this.ToolLink.style.display = this.IsCommandEnabled(RD3_Glb.IDE_LINK) ? "" : "none";
    if (this.ToolIMG)
      this.ToolIMG.style.display = this.IsCommandEnabled(RD3_Glb.IDE_IMAGE) ? "" : "none";
    this.ToolSeparators[4].style.display = this.AreCommandsEnabled(true, [RD3_Glb.IDE_LINK, RD3_Glb.IDE_IMAGE]) ? "" : "none";
    this.ToolChange.style.display = this.IsCommandEnabled(RD3_Glb.IDE_CHANGE) ? "" : "none";
    this.ToolSeparators[5].style.display = this.AreCommandsEnabled(true, [RD3_Glb.IDE_CHANGE]) ? "" : "none";
    if (this.ToolFont)
      this.ToolFont.SetVisible(this.IsCommandEnabled(RD3_Glb.IDE_FONT) && (this.FontList!=null && this.FontList.ItemList.length>0));
    if (this.ToolFontSize)
      this.ToolFontSize.SetVisible(this.IsCommandEnabled(RD3_Glb.IDE_SIZE) && (this.FontList!=null && this.FontList.ItemList.length>0));
    if (this.ToolToken)
      this.ToolToken.SetVisible(this.IsCommandEnabled(RD3_Glb.IDE_TOKEN) && (this.TokenList!=null && this.TokenList.ItemList.length>0));
  }
}

IDEditor.prototype.SetDefaultFormatting = function(val)
{
  this.DefaultFormatting = val;
}

//********************************************************************
// Gestione dello spostamento del cursore o della selezione
// force : se true forziamo comunque l'aggiornamento della toolbar
//********************************************************************
IDEditor.prototype.OnSelectionTimer = function(ev, force)
{
  // Mi interessa solo se l'editor e' in anteprima
  if (this.Layout != 1)
    return;
  //
  if (force == undefined)
    force = false;
  //
  var sel = null;
  var doc = this.GetEditorDocument();
  //
  if (doc && doc.getSelection)
    sel = doc.getSelection();
  else if (doc && doc.selection)
    sel = doc.selection;
  //
  if (sel)
  {
    if (sel.anchorNode == undefined && document.selection)
    {
      // IE9 e minori, per prima cosa devo verificare che la selezione sia all'interno dell'editor in anteprima
      var rng = sel.createRange();
      if (!RD3_Glb.isInsideEditor(rng.parentElement()))
        return;
      //
      if (this.LastSelection)
      {
        // Se e' cambiata la selezione chiedo di aggiornare la toolbar
        if (!rng.isEqual(this.LastSelection) || force)
          this.UpdateToolbar(rng);
      }
      else
      {
        // Se non c'era una selezione potrebbe essere la prima volta che fuoco questo editor.. allora faccio comunque l'aggiornamento della toolbar
        this.UpdateToolbar(rng);
      }  
      //
      this.LastSelection = rng.duplicate();
    }
    else
    {
      // Per prima cosa devo verificare che la selezione sia all'interno dell'editor in anteprima
      // per farlo verifico se il punto di partenza vi e' contenuto
      if (!RD3_Glb.isInsideEditor(sel.anchorNode) || sel.rangeCount == 0)
        return;
      //
      // Considero solo il primo Range, verifico se e' diverso dall'ultimo memorizzato
      var rng = sel.getRangeAt(0);
      if (this.LastSelection)
      {
        // Se e' cambiato il punto iniziale o finale chiedo di aggiornare la toolbar
        if (rng.compareBoundaryPoints(Range.START_TO_START, this.LastSelection) != 0 || rng.compareBoundaryPoints(Range.END_TO_END , this.LastSelection) != 0 || force)
          this.UpdateToolbar(rng);
      }
      else
      {
        // Se non c'era una selezione potrebbe essere la prima volta che fuoco questo editor.. allora faccio comunque l'aggiornamento della toolbar
        this.UpdateToolbar(rng);
      }  
      //
      this.LastSelection = rng.cloneRange();
    }
  }
  //
  // Dopo aver gestito la selezione gestisco il DefaultFormatting.. pero' devo stare attento perche' se tocco l'oggetto selezionato potrei rompere la selezione..
  if ((this.DefaultFormatting != "" || RD3_ClientParams.AutoDefaultFormatting) && doc && doc.body)
  {
    var nc = doc.body.childNodes.length;
    for (var idc=0; idc<nc; idc++)
    {
      var nd = doc.body.childNodes.item(idc);
      var autoFormat = "";
      //
      // Se non ho un formato di default allora posso provare a prenderlo dall'ultimo P che vedo..
      if (this.DefaultFormatting == "" && RD3_ClientParams.AutoDefaultFormatting && nd.tagName && nd.tagName=="P")
        autoFormat = nd.style.cssText;
      //
      // Se e' un nodo di testo o un nodo element diverso da P lo embeddo in un nodo P (solo nodi inline possono stare dentro dei P)
      if (nd && (nd.nodeType!=1 || (nd.tagName && nd.tagName!="P" && RD3_Glb.GetStyleProp(nd, "display")=="inline")))
      {
        // Caso particolare.. un nodo vuoto o di solo invio non lo trasformiamo in un paragrafo.. a video non cambia niente ma l'utente vedrebbe il campo modificato..
        // stessa cosa per i nodi BR
        if ((nd.tagName=="BR")|| (nd.nodeType==3 && (nd.nodeValue == "" || nd.nodeValue == "\n")))
          continue;
        //
        if (this.LastSelection)
        {
          var par = this.LastSelection.parentElement ? this.LastSelection.parentElement : this.LastSelection.commonAncestorContainer;
          //
          // Non devo modificare l'oggetto che contiene la selezione corrente, altrimenti il cursore va all'inizio e non c'e' modo di rimetterlo dov'era..
          if (par && par == nd)
            continue;
        }
        //
        var pNode = doc.createElement("P");
        //
        try
        {
          // E' supportata da tutti... ma non voglio problemi..
          pNode.style.cssText = (this.DefaultFormatting != "" ? this.DefaultFormatting : autoFormat);
        }
        catch (ex) {}
        //
        var nextNode = nd.nextSibling;
        pNode.appendChild(nd);
        if (nextNode)
          doc.body.insertBefore(pNode, nextNode);
        else
          doc.body.appendChild(pNode);
        //
        // Modificato.. adesso l'editor e' sporco
        this.IsDirty = true;
      }
    }
  }
}

//************************************************************************************
// L'IFRAME ha finito il caricamento.. ora posso avere accesso al documento interno
//************************************************************************************
IDEditor.prototype.OnEditorReadyStateChange = function(ev)
{
  if (!RD3_Glb.IsIE(10, false) || this.EditorObj.readyState == "complete")
  {
    var doc = this.GetEditorDocument();
    //
    doc.IDOwnerObject = this.Identifier;
    var parentContext = this;
    //
    // Attacco gli eventi, prima non potevo farlo
    var lf = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnLoseFocus', ev);");
    var gf = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnGetFocus', ev);");
    var kd = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnKeyDown', ev);");
    var mc = function(ev) { parentContext.OnMouseClick(ev); };
    var mover = function(ev) { parentContext.OnMouseOverObj(ev); };
    var mout = function(ev) { parentContext.OnMouseOutObj(ev); };
    //
    if (document.addEventListener)
    {
      this.EditorObj.contentWindow.addEventListener("blur", lf, true);
      this.EditorObj.contentWindow.addEventListener("blur", lf, true);
      doc.body.addEventListener("keydown", kd, true);
      doc.body.addEventListener("mouseup", mc, true);
      this.TextObj.addEventListener("blur", lf, true);
      this.TextObj.addEventListener("keydown", kd, true);
      //
      // Se non e' IE attacco gli eventi di focus
      if (!RD3_Glb.IsIE(10, false))
      {
        this.EditorObj.contentWindow.addEventListener("focus", gf, true);
        this.TextObj.addEventListener("focus", gf, true);
      }
      //
      this.ToolbarContainer.addEventListener("mouseover", mover, true);
      this.ToolbarContainer.addEventListener("mouseout", mout, true);      
      //
      // Adesso il gestore personale (quello di IDScroll scatta prima e se scroll non fa scattare il mio..)
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        doc.body.addEventListener("touchend", mc, true);
      //
      // Spengo il menu contestuale
      doc.body.addEventListener("contextmenu", function (ev) { ev.preventDefault(); }, true);
    }
    else
    {
      doc.body.attachEvent("onblur", lf);
      doc.body.attachEvent("onkeydown", kd);
      doc.body.attachEvent("onmouseup", mc);
      this.TextObj.attachEvent("onblur", lf);
      this.TextObj.attachEvent("onkeydown", kd);
      //
      // Se non e' IE attacco gli eventi di focus
      if (!RD3_Glb.IsIE(10, false))
      {
        doc.body.attachEvent("onfocus", gf);
        this.TextObj.attachEvent("onfocus", gf);
      }
      //
      this.ToolbarContainer.attachEvent("onmouseover", mover);
      this.ToolbarContainer.attachEvent("onmouseout", mout);      
      //
      // Adesso il gestore personale (quello di IDScroll scatta prima e se scroll non fa scattare il mio..)
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        doc.body.attachEvent("ontouchend", mc);
      //
      // Spengo il menu contestuale
      doc.body.attachEvent("oncontextmenu", function (ev) { ev.preventDefault(); });
    }
    //
    // Reimposto l'abilitazione ed il testo
    this.SetEnabled();
    this.SetText();
  }
}

//********************************************************************
// Evento che scatta al blur dell'editor
//********************************************************************
IDEditor.prototype.OnLoseFocus = function(ev)
{
  if (!RD3_Glb.IsIE(10, false))
    RD3_KBManager.IDRO_LostFocus(ev, (this.Layout==1 ? this.EditorObj : this.TextObj));
  //
  // Lanciamo il change  
  // (Lo lanciamo obbligandolo ad usare l'oggetto che vogliamo noi)
  RD3_KBManager.IDRO_OnChange(this.Layout==1 ? this.EditorObj : this.TextObj, true);
}

//********************************************************************
// Evento che scatta al fuocus dell'editor
//********************************************************************
IDEditor.prototype.OnGetFocus = function(ev)
{
  // Lanciamo il change
  RD3_KBManager.IDRO_GetFocus(ev, (this.Layout==1 ? this.EditorObj : this.TextObj));
}

//********************************************************************
// Evento che scatta al keyDown
//********************************************************************
IDEditor.prototype.OnKeyDown = function(eve)
{
  // Se il campo e' attivo quando scatta se sono passati piu' di 15 secondi dall'ultimo invio dei dati li invio al server
  if (this.ParentField.ChangeEventDef == RD3_Glb.EVENT_ACTIVE && (this.LastTextSend==null || (new Date()-this.LastTextSend > 15000)) && this.Owner.PValue)
  {
    this.Owner.PValue.SendChanges(this.Layout==1 ? this.EditorObj : this.TextObj);
    this.LastTextSend = new Date();
  }
  //
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  //
  if (this.Layout==1)
  {
    if (this.SelectionTimer != null)
    {
      window.clearTimeout(this.SelectionTimer);
      this.SelectionTimer = null;
    }
    //
    this.SelectionTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSelectionTimer');" , 300);
    //
    
    var parentFld = null;
    if (this.Owner && this.Owner.ParentField)
      parentFld = this.Owner.ParentField
    //
    if (parentFld)
    {
      if (code == 9) // TAB
      {
        if (eve.shiftKey)
          parentFld.ParentPanel.FocusPrevField(parentFld, eve);
        else
          parentFld.ParentPanel.FocusNextField(parentFld, eve);
      }
      //
      if (code>=112 && code<=123) // Tasti funzione
      {
        // Simulo il lose focus, altrimenti le modifiche non vanno su..
        RD3_KBManager.IDRO_OnChange(this.Layout==1 ? this.EditorObj : this.TextObj);
        //
        // Adesso salvo
        parentFld.HandleFunctionKeys(eve);
        //
        // I tasti funzione incasinano il browser.. devo stopparli..
        RD3_Glb.StopEvent(eve);
        //
        // IE ha un problema.. se il fuoco rimane sull'editor il cursore non e' visibile (ma c'e'..) quindi siamo costretti a dare il fuoco a qualcun altro se possibile..
        if (RD3_Glb.IsIE())
          RD3_KBManager.FocusSomeone();
      }
    }
  }
  //
  // CTRL + C e CTRL + A non devono mettere dirty l'editor
  var skipDirty = (code == 67 || code == 65) && eve.ctrlKey;
  //
  // Su Mobile a volte non abbiamo il codice del pulsante premuto (es:Android), in questo caso diamo per buono che qualsiasi pulsante abbia modificato il valore
  if (!skipDirty && (RD3_Glb.IsTouch() || (code >= 46 && code<=90) || (code>=96 && code <=105) || (code>=186 && code<=222) || code==8))
    this.IsDirty = true;
}

IDEditor.prototype.OnMouseClick = function(eve)
{
  if (this.Layout!=1)
    return;
  //
  // Chiudiamo i popup
  RD3_DDManager.ClosePopup();
  //
  if (this.Enabled)
  {
    if (this.SelectionTimer != null)
    {
      window.clearTimeout(this.SelectionTimer);
      this.SelectionTimer = null;
    }
    //
    this.SelectionTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSelectionTimer');" , 300);
  }
}


//********************************************************************
// Assegna il fuoco all'editor
//********************************************************************
IDEditor.prototype.Focus = function()
{
  if (this.Layout==1)
  {
    var doc = this.GetEditorDocument();
    doc.body.focus();
    //
    // Dare il fuoco non mostra il cursore.. lo devo fare io..
    var sel = null;
    if (doc && doc.getSelection)
      sel = doc.getSelection();
    else if (doc && doc.selection)
      sel = doc.selection;
    //
    if (sel)
    {
      if (sel.anchorNode == undefined && doc.selection)
      {
        // TODO
      }
      else
      {
        // Metto il cursore all'inizio del body, ma solo se l'editor e' vuoto o la selezione non appartiene gia' all'editor
        if (this.HTMLContent == "" || sel.anchorNode==null)
          sel.collapse(doc.body, 0);
      }
    }
  }
  else
  {
    this.TextObj.focus(); 
  }
}


IDEditor.prototype.getData = function()
{
  var s = "";
  if (this.Layout == 1)
  {
    var doc = this.GetEditorDocument();
    if (doc && doc.body)
      s = doc.body.innerHTML;
  }
  else
  {
    s = this.TextObj.value;
  }
  //
  return s;
}

// *********************************************************
// Scatta nel Mobile se clicchi sull'IFRAME
//**********************************************************
IDEditor.prototype.OnTouchDown = function(ev, scrollInput)
{
  // Se sono disabilitato non faccio nulla.. lascio fare tutto ad IDScroll
  if (!this.Enabled)
    return true;
  //
  var retType = true;
  var targetEl = ev.target ? ev.target : ev.srcElement;
  //
  // Se e' l'editor o la toolbar stoppo lo scroll
  if (targetEl == this.EditorObj || targetEl == this.TextObj || targetEl == this.ToolbarContainer)
    retType = false;
  if (RD3_Glb.isInsideEditor(targetEl))
    retType = false;
  //
  return retType;
}

IDEditor.prototype.OnEditorTouchUp = function(evento, target)
{
  var cmd = "";
  switch (target)
  {
    case this.ToolBold : cmd = "B"; break;
    case this.ToolItalic : cmd = "I"; break;
    case this.ToolUnder : cmd = "U"; break;
    case this.ToolStrike : cmd = "S"; break;
    case this.ToolOrdList : cmd = "OL"; break;
    case this.ToolUnOrdList : cmd = "UL"; break;
    case this.ToolLeft : cmd = "L"; break;
    case this.ToolCenter : cmd = "C"; break;
    case this.ToolRight : cmd = "R"; break;
    case this.ToolJust : cmd = "J"; break;
    case this.ToolLink : cmd = "LINK"; break;
    case this.ToolIMG : cmd = "IMG"; break;
    case this.ToolChange : cmd = "CHG"; break;
    case this.ToolBackCol : cmd = "BKG"; break;
    case this.BackColChooser : cmd = "BKGC"; break;
    case this.ToolForeCol : cmd = "FCG"; break;
    case this.ForeColChooser : cmd = "FCGC"; break;
  }
  if (cmd != "")
  {
    this.RestoreSelection();
    this.onToolCommand(evento, cmd);
    return;
  }
  // Vediamo se e' stata toccata una combo..
  var tgt = target;
  while (tgt && (tgt.className == "combo-img" || tgt.className == "combo-activator"))
   tgt = tgt.previousSibling;
  //
  if (tgt && tgt.id != "")
  {
    if (tgt.id.indexOf(":tcmb1")!=-1)
      this.ToolFont.Open();
    if (tgt.id.indexOf(":tcmb2")!=-1)
      this.ToolFontSize.Open();
    if (tgt.id.indexOf(":tcmb3")!=-1)
      this.ToolToken.Open();
  }
}

IDEditor.prototype.onToolCommand = function(ev, cmd)
{
  // I comandi della toolbar funzionano solo in anteprima e se l'editor e' abilitato
  if (this.Layout != 1 && cmd != "CHG" || !this.Enabled)
  {
    var eve = (window.event ? window.event : ev);
    if (eve)
      RD3_Glb.StopEvent(eve);
    return;
  }
  //
  var doc = this.GetEditorDocument();
  if (!doc)
    return;
  //
  var eve = (window.event ? window.event : ev);
  //
  switch(cmd)
  {
    case 'B':
      doc.execCommand('bold', false);
      this.IsDirty = true;
    break;
    
    case 'I':
      doc.execCommand('italic', false);
      this.IsDirty = true;
    break;
    
    case 'U':
      doc.execCommand('underline', false);
      this.IsDirty = true;
    break;
    
    case 'S':
      doc.execCommand('strikeThrough', false);
      this.IsDirty = true;
    break;
    
    case 'UL':
      doc.execCommand('insertUnorderedList', false);
      this.IsDirty = true;
    break;
    
    case 'OL':
      doc.execCommand('insertOrderedList', false);
      this.IsDirty = true;
    break;
    
    case 'L':
      doc.execCommand('justifyLeft', false);
      this.IsDirty = true;
    break;
    
    case 'C':
      doc.execCommand('justifyCenter', false);
      this.IsDirty = true;
    break;
    
    case 'J':
      doc.execCommand('justifyFull', false);
      this.IsDirty = true;
    break;
    
    case 'R':
      doc.execCommand('justifyRight', false);
      this.IsDirty = true;
    break;
    
    case 'IMG':
      if (this.IMGUploadObj)
      {
        // Annullo la selezione precedente: in questo modo l'utente puo' inviare piu' volte lo stesso file
        this.IMGUploadObj.value = "";
        this.IMGUploadObj.click();
      }
    break;
    
    case 'LINK':
      var canLink = false;
      if (this.ToolLink.getAttribute("id_disabled") != "true")
        canLink = true;
      if (canLink)
      {
        if (!this.InputMsg)
        {
          this.InputMsg = new MessageBox(ClientMessages.IDE_LINK_MSG, RD3_Glb.MSG_INPUT, false);
          this.InputMsg.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onLinkCallback', ev)");
        }
        //
        this.InputMsg.Open();
      }
    break;
    
    case 'CHG':
      this.SetLayout(this.Layout==1 ? 2 : 1);
      this.UpdateToolbar();
    break;
    
    case 'BKG':
      doc.execCommand('backColor', false, this.BackCol);
      this.IsDirty = true;
    break;
    
    case 'BKGC':
      var pc = new PopupControl(RD3_Glb.CTRL_CPICKER, this.Owner, this.ToolBackCol);
      pc.Colors = this.ColorList;
      pc.HasCaption = false;
      pc.CallBackFunction = new Function("color","var par = ['BACK', color]; return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onColorCallback', null, par)");
			pc.Open();
			pc.LastActiveObject = this;
			pc.LastActiveElement = this.EditorObj;
    break;
    
    case 'FCG':
      doc.execCommand('foreColor', false, this.ForeCol);
      this.IsDirty = true;
    break;
    
    case 'FCGC':
      var pc = new PopupControl(RD3_Glb.CTRL_CPICKER, this.Owner, this.ToolForeCol);
      //
      // Il colore trasparente qui non mi interesssa... lo tolgo
      if (!this.ColorForeList && this.ColorList)
      {
        this.ColorForeList = this.ColorList.slice(0);
        //
        var trasp = -1;
        for (var i=0; i<this.ColorForeList.length; i++)
        {
          if (this.ColorForeList[i] == "transparent")
          {
            trasp = i;
            break;
          }
        }
        //
        if (trasp>=0)
          this.ColorForeList.splice(trasp, 1);
      }
      //
      pc.Colors = this.ColorForeList;
      pc.HasCaption = false;
      pc.CallBackFunction = new Function("color","var par = ['FORE', color]; return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'onColorCallback', null, par)");
			pc.Open();
			pc.LastActiveObject = this;
			pc.LastActiveElement = this.EditorObj;
    break;
  }
  //
  if (this.SelectionTimer != null)
  {
    window.clearTimeout(this.SelectionTimer);
    this.SelectionTimer = null;
  }
  //
  this.SelectionTimer = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnSelectionTimer',null, true);" , 100);
  //
  if (eve)
    RD3_Glb.StopEvent(eve);
}

// **************************************************************
// Callback per l'inserimento di un link
// **************************************************************
IDEditor.prototype.onLinkCallback = function(ev)
{
  // Devo partire riselezionando la vecchia posizione
  if (this.RestoreSelection(true) && this.InputMsg)
  {
    // Ok, dopo aver ripristinato la selezione posso aggiungere il link.. ma solo se l'utente l'ha scritto (se ha dato cancel non faccio nulla, pero' e' giusto aver 
    // ripristinato il cursore
    if (this.InputMsg.UserResponse != "")
    {
      var doc = this.GetEditorDocument();
      doc.execCommand('createLink', false, this.InputMsg.UserResponse);
      this.IsDirty = true;
    }
  }
}

IDEditor.prototype.OnHTML5Upload = function(ev)
{
  try
  {
    // Se non ho un owner con un campo non posso risalire alla form
    if (!this.Owner || !this.Owner.ParentField)
      return;
    //
    // Il file e' stato annullato.. nessun upload da fare
    if (this.IMGUploadObj.value == "")
      return;
    //
    var req = RD3_DesktopManager.MessagePump.CreateRequest();
    req.EditorId = this.Identifier;
    var msg = ClientMessages.SWF_FS_UPLOADING;
    //
    // Gestisco la progress bar
    RD3_DesktopManager.WebEntryPoint.DelayDialog.Open(msg, RD3_Glb.PROGRESS, 0);
    RD3_DesktopManager.WebEntryPoint.DelayDialog.SetProgress(0);
    RD3_DesktopManager.WebEntryPoint.DelayDialog.SetTotal(100);
    //
    req.upload.addEventListener("progress", function (evt) 
    {
      if (evt.lengthComputable)
        RD3_DesktopManager.WebEntryPoint.DelayDialog.SetProgress(Math.ceil(evt.loaded/evt.total*100));
      else
        RD3_DesktopManager.WebEntryPoint.DelayDialog.SetProgress(evt.loaded);
    }, false);
    //
    // A caricamento effettuato gestisco la risposta del server
    req.addEventListener("load", function (evt) 
    {
      if (this.status == 200)
        RD3_DesktopManager.CallEventHandler(this.EditorId, "onUploadResponse", evt, this.responseText);
    }, false);
    //
    // Gestisco eventuali errori
    req.upload.addEventListener("error", function (evt) 
    {
      RD3_DesktopManager.WebEntryPoint.DelayDialog.Close();
      //
      var msg = ClientMessages.SWF_ER_FILENOTSEND + "<br>" + req.status;
      var m = new MessageBox(msg, RD3_Glb.MSG_BOX, false);
      m.Open();
    }, false);
    //
    // Simulo una richiesta da multi-upload (mando un comando speciale, in cui e' presente anche l'ID del campo di pannello che ha effettuato l'upload..
    var uploadUrl = "?WCI=IWFiles&WCE=EditIMG:" + this.Owner.ParentField.Identifier;
    req.open("post", uploadUrl, true);
    var formData = new FormData();
    var list = this.IMGUploadObj.files;
    var n = list.length;
    for (var i=0; i<n; i++)
      formData.append("thefile"+i, list[i]);
    //
    req.send(formData);
  }
  catch (exc)
  {
    // Di sicuro in caso di errore chiudo la delay
    RD3_DesktopManager.WebEntryPoint.DelayDialog.Close();
  }
}

IDEditor.prototype.onUploadResponse = function(ev, responseTxt)
{
  RD3_DesktopManager.WebEntryPoint.DelayDialog.Close();
  //
  // Nel testo ci deve essere l'URL dell'immagine
  if (responseTxt != "" && this.RestoreSelection())
  {
    var doc = this.GetEditorDocument();
    doc.execCommand('insertImage', false, responseTxt);
    this.IsDirty = true;
    //
    // Su FFX e Chrome 39 non prende il fuoco l'editor e non c'e' modo di forzarglielo..allora lanciamo noi l'onChange per segnalare al server il cambiamento
    this.OnLoseFocus(ev);
    //
    // Mi memorizzo che l'immagine e' stata aggiunta.. serve per mandare al server i valori se scrivo e clicco sul pulsante di salvataggio
    this.ImgAdded = true;
  }
}

IDEditor.prototype.onColorCallback = function(ev, par)
{
  if (par.length != 2)
    return;
  //
  if (this.RestoreSelection())
  {
    if (par[0] == "BACK")
    {
      this.IsDirty = true;
      this.BackCol = par[1];
      if (this.BackColApplier)
        this.BackColApplier.style.backgroundColor = this.BackCol;
      //
      if (this.BackCol == "transparent")
      {
        // Qui dobbiamo fare altro: dobbiamo mangiare tutti i colori di sfondo presenti all'interno della selezione..
        var sel = null;
        //
        // Ottengo la selezione attuale
        var doc = this.GetEditorDocument();
        if (doc && doc.getSelection)
          sel = doc.getSelection();
        else if (doc && doc.selection)
          sel = doc.selection;
        //
        if (sel)
        {
          // Ramo IE<10
          if (sel.anchorNode == undefined && document.selection)
          {
            var rng = sel.createRange();
            var myHtmlText = rng.htmlText
            //
            // Qua non abbiamo molte possibilita'... cerchiamo solo di eliminare tutti i background-color.. provo ad usare una regExp..
            var patt = new RegExp("background-color:.*;", "g");
            myHtmlText = myHtmlText.replace(patt, "");
            //
            rng.pasteHTML(myHtmlText);
          }
          else
          {
            // Se la selezione non e' nell'editor non faccio nulla...
            if (sel.rangeCount == 0)
              return;
            //
            var rng = sel.getRangeAt(0);
            //
            if (rng.commonAncestorContainer && rng.commonAncestorContainer.nodeType==3 && rng.commonAncestorContainer.parentNode)
            {
              // Sono solo nodi di testo.. allora risalgo solo di un livello e vedo se il padre e' un FONT o uno SPAN con un background-color
              if (rng.commonAncestorContainer.parentNode.tagName=="FONT" || rng.commonAncestorContainer.parentNode.tagName=="SPAN")
                rng.commonAncestorContainer.parentNode.style.backgroundColor = "";
            }
            else
            {
              var nodesToRemove = new Array();
              //
              var startObj = rng.startContainer;
              if (rng.startOffset>0 && startObj.nodeType!=3)
                startObj = rng.startContainer.childNodes.item(rng.startOffset);
              //
              var endObj = rng.endContainer;
              if (rng.endOffset>0 && endObj.nodeType!=3)
                endObj = rng.endContainer.childNodes.item(rng.endOffset);
              //
              // Cerco di ciclare su tutta la selezione ed ottenere tutti i nodi di tipo FONT o SPAN
              var obj = startObj;
              while (obj)
              {
                // I Nodi di testo li salto.. non hanno figli
                if (obj.nodeType != 3)
                {
                  var ndList = obj.getElementsByTagName("FONT");
                  for (var itx=0; itx<ndList.length; itx++)
                    nodesToRemove.push(ndList.item(itx));
                  //
                  ndList = obj.getElementsByTagName("SPAN");
                  for (var itx=0; itx<ndList.length; itx++)
                    nodesToRemove.push(ndList.item(itx));
                  //
                  if (obj.tagName=="SPAN" || obj.tagName=="FONT")
                    nodesToRemove.push(obj);
                }
                //
                obj = obj.nextSibling;
                //
                if (obj == endObj)
                  break;
              }
              //
              // Ultimo controllo.. devo vedere se il padre diretto e' uno span o un font..
              if (rng.startOffset==0 && rng.startContainer.parentNode && (rng.startContainer.parentNode.tagName=="SPAN" || rng.startContainer.parentNode.tagName=="FONT"))
                nodesToRemove.push(rng.startContainer.parentNode);
              //
              // Adesso elaboro quello che ho trovato..
              var nFound = nodesToRemove.length;
              for (var itx=0; itx<nFound; itx++)
                nodesToRemove[itx].style.backgroundColor = "";
            }
          }
        }
      }
      else
      {
        var doc = this.GetEditorDocument();
        doc.execCommand('backColor', false, this.BackCol);
      }
    }
    //
    if (par[0] == "FORE")
    {
      this.IsDirty = true;
      this.ForeCol = par[1];
      if (this.ForeColApplier)
        this.ForeColApplier.style.backgroundColor = this.ForeCol;
      //
      var doc = this.GetEditorDocument();
      doc.execCommand('foreColor', false, this.ForeCol);
    }
  }
}

IDEditor.prototype.OnMultipleComboChange  = function(combo)
{
  // Devo partire ripristinando la selezione che e' stata tolta dalla combo
  // Inoltre non devo fare nulla se l'editor non e' in anteprima o e' disabilitato
  if (this.RestoreSelection() && this.Enabled && this.Layout==1)
  {
    this.IsDirty = true;
    //
    if (combo == this.ToolFont)
    {
      var fnt = this.ToolFont.GetComboValue();
      var doc = this.GetEditorDocument();
      if (fnt != "") {
        doc.execCommand('fontName', false, fnt);
        //
        // Cambiare il font modifica la selezione, quindi dobbiamo rimetterla a posto
        this.RestoreSelection();
      }
    }
    //
    if (combo == this.ToolFontSize)
    {
      var fns = this.ToolFontSize.GetComboValue();
      if (fns != "")
      {
        // Il content editable vuole solo i fontSize HTML (1-7)... invece noi vogliamo qualcosa di piu'.. quindi tocca a noi farla..
        // document.execCommand('fontSize', false, fns);
        var sel = null;
        //
        // Ottengo la selezione attuale
        var doc = this.GetEditorDocument();
        if (doc && doc.getSelection)
          sel = doc.getSelection();
        else if (doc && doc.selection)
          sel = doc.selection;
        //
        if (sel)
        {
          // Ramo IE<10
          if (sel.anchorNode == undefined && document.selection)
          {
            var rng = sel.createRange();
            var myHtmlText = rng.htmlText
            //
            // Qua non abbiamo molte possibilita'... vediamo solo se l'HTML inizia con span..
            if (myHtmlText.indexOf("<span") == 0)
            {
              var closingTag = myHtmlText.indexOf(">");
              myHtmlText = "<span style='font-size:"+ fns +"pt; ' >" + myHtmlText.substring(closingTag+1);
            }
            else
            {
              myHtmlText = "<span style='font-size:"+ fns +"pt; ' >" + myHtmlText + "</span>";
            }
            //
            rng.pasteHTML(myHtmlText);
          }
          else
          {
            // Se la selezione non e' dentro l'editor non faccio nulla..
            if (sel.rangeCount==0)
              return;
            //
            // Aggiungo uno span intorno alla selezione
            var rng = sel.getRangeAt(0);
            //
            // Per prima cosa devo vedere se la selezione ha gia' uno span.. verifico se il primo nodo o il suo primo figlio sono span..
            // -> non e' garantito prenderci.. dipende anche dove il browser decide di posizionare la selezione..
            var fndSpan = false;
            var objSp = rng.startContainer;
            if (rng.startOffset != 0 && objSp.childNodes.length>0 && rng.startOffset<objSp.childNodes.length)
              objSp = objSp.childNodes.item(rng.startOffset);
            //
            // se lui non e' uno span provo con il suo primo figlio..
            if (objSp && objSp.tagName != "SPAN" && objSp.childNodes && objSp.childNodes.length>0)
              objSp = objSp.childNodes.item(0);
            //
            // provo con il suo fratello (se appartiene alla selezione e se il nodo di partenza e' un nodo di testo e se la selezione e' al suo carattere finale..)
            if (objSp && objSp.tagName != "SPAN" && rng.startContainer != rng.endContainer && rng.startContainer.nodeType==3 && rng.startContainer.nodeValue.length == rng.startOffset && rng.startContainer.nextSibling)
              objSp = rng.startContainer.nextSibling;
            //
            // ultima possibilita' : proviamo a vedere se il padre diretto della selezione e' uno span (offset deve essere 0 in questo caso..)
            if (objSp && objSp.tagName != "SPAN" && rng.startContainer.parentNode && rng.startContainer.parentNode.tagName=="SPAN" && rng.startOffset==0)
              objSp = rng.startContainer.parentNode;
            //
            if (objSp && objSp.tagName == "SPAN")
            {
              objSp.style.fontSize = fns + "pt";
              fndSpan = true;
            }
            //
            if (!fndSpan)
            {
              var newNode = doc.createElement("SPAN");
              newNode.style.fontSize = fns + "pt";
              //
              newNode.appendChild(rng.extractContents());
              rng.insertNode(newNode);
            }
          }
        }
      }
    }
    //
    if (combo == this.ToolToken)
    {
      var tkl = this.ToolToken.GetComboValue();
      if (tkl != "")
      {
        if (tkl.indexOf("|") != -1)
        {
          // Gestione del Sorround
          var sel = null;
          //
          // Ottengo la selezione attuale
          var doc = this.GetEditorDocument();
          if (doc && doc.getSelection)
            sel = doc.getSelection();
          else if (doc && doc.selection)
            sel = doc.selection;
          //
          if (sel)
          {
            if (sel.anchorNode == undefined && doc.selection)
            {
              var rng = sel.createRange();
              var myHtmlText = rng.htmlText
              rng.pasteHTML(tkl.replace("|", myHtmlText));
            }
            else
            {
              var rng = sel.getRangeAt(0);
              //
              var newNode = doc.createElement("SPAN");
              newNode.innerHTML = tkl.replace("|", "<SPAN id='replace_node' ></SPAN>");
              //
              var toreplaceList = newNode.getElementsByTagName("SPAN");
              var toreplace = null;
              for (var ii=0; ii<toreplaceList.length; ii++)
                toreplace = (toreplaceList.item(ii).getAttribute("id")=="replace_node" ? toreplaceList.item(ii) : null);
              //
              if (toreplace && toreplace.parentNode)
              {
                var docFrag = rng.extractContents();
                toreplace.parentNode.insertBefore(docFrag, toreplace);
                toreplace.parentNode.removeChild(toreplace);
              }
              //
              // Quando li tolgo da newNode quelli dopo finiscono in cima.. quindi devo prendere sempre il primo (aggiungo un controllo sul while.. non vorrei che ci fosse qualche browser che lo mandasse in loop..)
              var nChild = newNode.childNodes.length;
              var ii = 0;
              while (newNode.childNodes.length>0 && ii<nChild)
              {
                rng.insertNode(newNode.childNodes.item(0));
                ii++;
              }
            }
          }
        }
        else
        {
          if (RD3_Glb.IsIE())
          {
            // Qua non funziona ne' la insertText ne' la insertHTML... me le devo fare io..
            var sel = null;
            //
            // Ottengo la selezione attuale
            var doc = this.GetEditorDocument();
            if (doc && doc.getSelection)
              sel = doc.getSelection();
            else if (doc && doc.selection)
              sel = doc.selection;
            //
            if (sel)
            {
              // Ramo IE<10
              if (sel.anchorNode == undefined && document.selection)
              {
                var rng = sel.createRange();
                //
                rng.pasteHTML(tkl);
              }
              else
              {
                var rng = sel.getRangeAt(0);
                rng.deleteContents();
                //
                var newNode = doc.createElement("SPAN");
                newNode.innerHTML = tkl;
                //
                rng.insertNode(newNode);
              }
            }
          }
          else
          {
            var doc = this.GetEditorDocument();
            doc.execCommand('insertHTML', false, tkl);
          }
        }
      }
    }
  }
}

// ******************************************************************************
// Ripristina la selezione; restituendo False se non e' stato possibile
//  onlySelection : la ripristina solo se e' una selezione, non se e' un cursore
// ******************************************************************************
IDEditor.prototype.RestoreSelection  = function(onlySelection)
{
  if (!this.LastSelection)
    return false;
  //
  var sel = null;
  //
  // Ottengo la selezione attuale
  var doc = this.GetEditorDocument();
  if (doc && doc.getSelection)
    sel = doc.getSelection();
  else if (doc && doc.selection)
    sel = doc.selection;
  //
  if (sel)
  {
    // Ramo IE<9
    if (sel.anchorNode == undefined && doc.selection)
    {
      var rng = doc.body.createTextRange();
      rng.setEndPoint("StartToStart", this.LastSelection);
      rng.setEndPoint("EndToEnd", this.LastSelection);
      rng.select();
      //
      return true;
    }
    else
    {
      // Riseleziono quello che era la selezione prima di perdere il fuoco per il link
      sel.removeAllRanges();
      sel.addRange(this.LastSelection);
      //
      // Faccio un controllo: devo avere del testo selezionato altrimenti non faccio nulla
      if (onlySelection && this.LastSelection.endContainer==this.LastSelection.startContainer && this.LastSelection.startOffset==this.LastSelection.endOffset)
        return false;
      //
      return true;
    }
  }
  //
  return false;
}

//*******************************************************
// Calcola l'altezza della toolbar 
//*******************************************************
IDEditor.prototype.GetToolbarHeight  = function()
{
  if (this.ToolbarContainer.offsetHeight > 0)
    return this.ToolbarContainer.offsetHeight;
  //
  // Cloniamo la toolbar e la proviamo ad attaccare temporaneamente al body per calcolarne l'altezza (per F5)
  var toolClone = this.ToolbarContainer.cloneNode(true);
  if (this.HasToolbar)
  {
    // La toolbar potrebbe essere nascosta (ad esempio in una tabbed) ma il clone deve essere comunque visibile per poter calcolare le dimensioni
    toolClone.style.display = "block";
    toolClone.style.visibility = "visibile";
  }
  //
  document.body.appendChild(toolClone);
  var h = toolClone.offsetHeight;
  toolClone.parentNode.removeChild(toolClone);
  toolClone = null;
  //
  return h;
}

IDEditor.prototype.GetToolbarLimit = function()
{
  // Cerco l'ultimo pulsante visibile nella toolbar
  var lastVisible = this.ToolChange;
  for (var i = this.ToolbarContainer.childNodes.length - 1; i >= 0; i--) { 
    var node = this.ToolbarContainer.childNodes.item(i);
    if (node.style['display'] != 'none') {
      lastVisible = node;
      break;
    } 
  }
  //
  var l = lastVisible.offsetLeft + lastVisible.offsetWidth + 2 + 6; // 6 e' il separatore
  var t = lastVisible.offsetTop;
  //
  if (l <= 8 || t <= 0)
  {
    // Cloniamo la toolbar e la proviamo ad attaccare temporaneamente al body per calcolarne i dati..
    var toolClone = this.ToolbarContainer.cloneNode(true);
    document.body.appendChild(toolClone);
    //
    // Per prima cosa devo trovare la posizione del nodo che mi interesssa (ToolChange)
    var itm = 0;
    for (itm=0; itm<this.ToolbarContainer.childNodes.length; itm++)
    {
      if (this.ToolbarContainer.childNodes.item(itm) == lastVisible)
        break;
    }
    //
    if (this.ToolbarContainer.childNodes.length > 0)
    {
      var changeClone = toolClone.childNodes.item(itm);
      l = changeClone.offsetLeft + changeClone.offsetWidth + 2;
      t = changeClone.offsetTop;
      //
      // 1px di differenza
      if (RD3_Glb.IsIE(10, false))
      {
        l++;
        t++;
      }
    }
    //
    toolClone.parentNode.removeChild(toolClone);
    toolClone = null;
  }
  //
  var obj = new Object();
  obj.x = l;
  obj.y = t;
  return obj;
}

//*****************************************************************************
// Gestiamo un comando arrivato dal server
//*****************************************************************************
IDEditor.prototype.OnServerEditorCommand = function(cmd, val, restSel)
{
  // Per prima cosa devo ripristinare la selezione se richiesto
  if (restSel)
    this.RestoreSelection();
  //
  // Adesso gestisco un paio di messaggi particolari..
  switch (cmd)
  {
    case "INS":
      // Insert TEXT
      if (RD3_Glb.IsIE())
      {
        // Qua non funziona ne' la insertText ne' la insertHTML... me le devo fare io..
        var sel = null;
        //
        // Ottengo la selezione attuale
        var doc = this.GetEditorDocument();
        if (doc && doc.getSelection)
          sel = doc.getSelection();
        else if (doc && doc.selection)
          sel = doc.selection;
        //
        if (sel)
        {
          // Ramo IE<10
          if (sel.anchorNode == undefined && doc.selection)
          {
            var rng = sel.createRange();
            //
            rng.pasteHTML(tkl);
          }
          else
          {
            var rng = sel.getRangeAt(0);
            rng.deleteContents();
            //
            var newNode = doc.createElement("SPAN");
            newNode.innerHTML = val;
            //
            rng.insertNode(newNode);
          }
        }
      }
      else
      {
        var doc = this.GetEditorDocument();
        doc.execCommand('insertHTML', false, val);
      }
      //
      this.IsDirty = true;
      //
      return;
    break;
    
    case "SUR":
      // Gestione del Sorround
      var sel = null;
      //
      // Ottengo la selezione attuale
      var doc = this.GetEditorDocument();
      if (doc && doc.getSelection)
        sel = doc.getSelection();
      else if (doc && doc.selection)
        sel = doc.selection;
      //
      if (sel)
      {
        if (sel.anchorNode == undefined && doc.selection)
        {
          var rng = sel.createRange();
          var myHtmlText = rng.htmlText
          rng.pasteHTML(tkl.replace("|", myHtmlText));
        }
        else
        {
          var rng = sel.getRangeAt(0);
          //
          var newNode = doc.createElement("SPAN");
          newNode.innerHTML = val.replace("|", "<SPAN id='replace_node' ></SPAN>");
          //
          var toreplaceList = newNode.getElementsByTagName("SPAN");
          var toreplace = null;
          for (var ii=0; ii<toreplaceList.length; ii++)
            toreplace = (toreplaceList.item(ii).getAttribute("id")=="replace_node" ? toreplaceList.item(ii) : null);
          //
          if (toreplace && toreplace.parentNode)
          {
            var docFrag = rng.extractContents();
            toreplace.parentNode.insertBefore(docFrag, toreplace);
            toreplace.parentNode.removeChild(toreplace);
          }
          //
          // Quando li tolgo da newNode quelli dopo finiscono in cima.. quindi devo prendere sempre il primo (aggiungo un controllo sul while.. non vorrei che ci fosse qualche browser che lo mandasse in loop..)
          var nChild = newNode.childNodes.length;
          var ii = 0;
          while (newNode.childNodes.length>0 && ii<nChild)
          {
            rng.insertNode(newNode.childNodes.item(0));
            ii++;
          }
        }
        //
        this.IsDirty = true;
      }
    break;
    
    case "BKG":
      this.BackCol = val;
    break;
    
    case "FCG":
      this.ForeCol = val;
    break;
  }
  //
  this.onToolCommand(null, cmd);
  //
  var sel = null;
  var doc = this.GetEditorDocument();
  if (doc && doc.getSelection)
    sel = doc.getSelection();
  else if (doc && doc.selection)
    sel = doc.selection;
  //
  if (sel)
  {
    var rng = null;
    if (sel.anchorNode == undefined && doc.selection)
      rng = sel.createRange();
    else
      rng = sel.getRangeAt(0);
    //
    this.UpdateToolbar(rng);
  } 
}

IDEditor.prototype.GetEditorDocument = function()
{
  var doc = null;
  try
  {
    if (this.EditorObj.contentDocument)
      doc = this.EditorObj.contentDocument;
    else if (this.EditorObj.contentWindow && this.EditorObj.contentWindow.document)
      doc = this.EditorObj.contentWindow.document;
  }
  catch (ex)
  {
    // SU IE10- contentWindow da' errore se l'oggetto non e' nel dom.. negli altri non da' errore ma da' null
  }
  //
  return doc;
}

IDEditor.prototype.SetToolbarCommandStatus = function(cmd, hili, force)
{
  if (this.ToolStatus[cmd] == hili && !force)
    return;
  //
  var obj = null;
  switch (cmd)
  {
    case RD3_Glb.IDE_BOLD : obj = this.ToolBold; break;
    case RD3_Glb.IDE_ITALIC : obj = this.ToolItalic; break;
    case RD3_Glb.IDE_UNDERLINE : obj = this.ToolUnder; break;
    case RD3_Glb.IDE_STRIKE : obj = this.ToolStrike; break;
    case RD3_Glb.IDE_UL : obj = this.ToolUnOrdList; break;
    case RD3_Glb.IDE_OL : obj = this.ToolOrdList; break;
    case RD3_Glb.IDE_LEFT : obj = this.ToolLeft; break;
    case RD3_Glb.IDE_CENTER : obj = this.ToolCenter; break;
    case RD3_Glb.IDE_JUSTIFY : obj = this.ToolJust; break;
    case RD3_Glb.IDE_RIGHT : obj = this.ToolRight; break;
    case RD3_Glb.IDE_CHANGE : obj = this.ToolChange; break;
  }
  //
  if (!obj)
    return;
  //
  obj.style.backgroundColor = (hili ? this.PressColor : "");
  this.ToolStatus[cmd] = hili;
}

// **********************************
// Aggiunge una classe custom all'editor
// **********************************
IDEditor.prototype.SetClassName = function(cls)
{
  var old = this.ClassName;
  if (cls != undefined)
    this.ClassName = cls;
  //
  if (this.Realized && (old != this.ClassName || !cls))
  {
    // Rimuovo la classe precedente
    if (old != "") 
    {
      RD3_Glb.RemoveClass2(this.EditorObj, old);
      RD3_Glb.RemoveClass2(this.TextObj, old);
    }
    //
    // Applico la nuova classe proveniente dalla Cella o dallo Span
    if (this.ClassName && this.ClassName != "")
    {
      RD3_Glb.AddClass(this.EditorObj, this.ClassName);
      RD3_Glb.AddClass(this.TextObj, this.ClassName);
    }
  }
}

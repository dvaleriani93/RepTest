// ***************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe IDCombo: Gestisce una Combo personalizzata
// ***************************************************

function IDCombo(owner)
{
  this.Identifier = "";           // Identificativo della combo
  this.Owner = owner;             // Possessore della combo
  //  
  this.Left = 0;
  this.Top = 0;
  this.Width = 0;
  this.Height = 0;
  this.Enabled = true;
  this.Visible = true;
  this.RightAlign = false;        // Il testo nella combo e' allineato a destra?
  this.ShowActivator = true;      // Indica se occorre mostrare l'attivatore
  this.Tooltip = "";              // Tooltip della combo
  this.Clickable = false;         // Combo cliccabile quando disabilitata?
  this.Badge = "";                // Badge della combo
  //
  this.ComboInput = null;         // Input della combo
  this.ComboActivator = null;     // Attivatore della combo
//this.ComboBadge = null;         // Badge della combo
  this.ComboImg = null;           // Immagine interna alla combo
  this.ComboPopup = null;         // Popup contenente le righe della combo
  this.UsePopover = false;        // Deve sempre usare un popover?
//  this.ComboPopupInput = null;  // Input fittizio usato per editing nel caso di combo che mostra i valori
//  this.ComboPopupTimer = 0;     // Timer usato per riposizionare il popup
  //
  this.IsOpen = false;            // Indica se la combo e' "aperta"
  this.ListOwner = true;          // Indica se la combo "possiede" la sua lista o le puo' essere messa e tolta
  this.IsOptional = false;        // Indica se la combo ammette il valore vuoto
  this.AllowFreeText = false;     // Indica se la combo ammette che venga lasciato un valore non presente nella lista
  this.ShowValue = false;         // Indica se la combo mostra il valore e non il nome dell'item
  this.Writable = true;           // Indica se l'input della Combo deve essere scrivibile o meno
  this.ActImage = "";             // Immagine da utilizzare per l'eventuale attivatore presente se la combo ha un oggetto di attivazione associato
  this.ActWidth = RD3_ClientParams.ComboActivatorSize;  // Larghezza attivatore (se presente)
//  this.ActEnaIfComboDis = false;// Indica se l'attivatore della combo e' abilitato anche se la combo e' disabilitata
  //
  this.OptionList = null;         // ValueList associata alla combo
  this.VisualStyle = null;        // Stile visuale della combo
  this.SelItems = new Array();    // Items selezionati nella combo
  this.PreviousInputText = "";    // Testo presente nell'input della combo per gestire bene il delta nel KeyUp
  this.OriginalText = "";         // Testo originale presente nell'input (usato per chiusura combo con UNDO)
  //this.ComboUpper=false;      // Il popup della combo si trova sopra o sotto il valore? (inizializzato al volo quando serve..)
  //this.AnimatingCombo=false          // C'e' una animazione in corso?
  this.MultiSel = true;           // Indica se la combo e' multiselezionabile
  this.ValueSep = ";";            // Separatore dei valori
  this.HLItem = null;
  
  //this.HasWatermark = false;    // La combo ha un watermark?
  //this.ClassName;               // Classe esterna associata al campo
}

// ***************************************************
// Crea gli oggetti visuali della Combo. Puo' essere
// chiamata anche per "duplicare" la combo
// ***************************************************
IDCombo.prototype.Realize = function(container, cls) 
{
  // Se non mi hanno ancora assegnato un identificativo, lo creo e mi inserisco nella mappa
  if (this.Identifier == "")
  {
    this.Identifier = "cmb:" + Math.floor(Math.random() * 1000000000);
    RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
  }
  //
  // L'input c'e' sempre!
  if (!this.ComboInput)
  {
    if (RD3_Glb.IsMobile())
    {
      this.ComboInput = document.createElement("div");
      this.ComboInput.value = this.ComboInput.textContent;
    }
    else
    {
      this.ComboInput = document.createElement("input");
      this.ComboInput.type = "text";
      RD3_Glb.AutocompleteOff(this.ComboInput);
    }
    this.ComboInput.className = "combo-input";
    this.ComboInput.setAttribute("id", this.Identifier);
    if (this.Owner.SetZIndex)
      this.Owner.SetZIndex(this.ComboInput);
  }
  container.appendChild(this.ComboInput);
  //
  // Attacco gli eventi
  var parentContext = this;
  this.ComboInput.onkeydown = function(ev) { parentContext.OnKeyDown(ev); };
  //
  // Se non e' IE attacco gli eventi di focus
  if (!RD3_Glb.IsIE(10, false))
  {
    var parentCol = this.Owner && this.Owner.ParentField ? this.Owner.ParentField : {};
    this.ComboInput.onfocus = function(ev) 
    { 
      RD3_KBManager.IDRO_GetFocus(ev); 
      //
      // Se il testo dell'input e' piu' lungo della larghezza allora posiziono il cursore all'inizio, magari non si vede bene..
      if (this.scrollWidth > this.offsetWidth) 
      {
        if (parentCol.comboFocusTimer)
          window.clearTimeout(parentCol.comboFocusTimer);
        //
        parentCol.comboFocusTimer = setTimeout(function () {
          delete parentCol.comboFocusTimer;
          if (RD3_KBManager.ActiveElement == this)
            setCursorPos(this, 0);
        }.bind(this), 50);
      }
    };
    this.ComboInput.onblur = function(ev) { RD3_KBManager.IDRO_LostFocus(ev); };
    //
    // In firefox l'evento di doppio click non arriva al body
    if (RD3_Glb.IsFirefox(3))
      this.ComboInput.ondblclick = function(ev) { RD3_KBManager.IDRO_DoubleClick(ev); };
  }
  //
  // Se e' stata fornita una classe particolare, la aggiungo
  if (cls)
    RD3_Glb.AddClass(this.ComboInput, cls);
  //
  // Se deve essere mostrato l'attivatore, lo creo
  if (this.ShowActivator)
  {
    if (!this.ComboActivator)
    {
      this.ComboActivator = document.createElement("DIV");
      this.ComboActivator.className = "combo-activator";
      this.ComboActivator.style.width = (this.ActWidth + 3) + "px";
      if (this.Owner.SetZIndex)
        this.Owner.SetZIndex(this.ComboActivator);
      //
      // E' nato l'attivatore... meglio riapplicare il VS appena posso... magari mi
      // hanno clonato da una combo che non aveva il vs
      this.VisualStyle = null;
    }
    container.appendChild(this.ComboActivator);
    //
    // Attacco l'evento (in Mobile non serve attaccare all'attivatore l'evento perche' e' l'intera combo che e' cliccabile/toccabile)
    if (!RD3_Glb.IsMobile())
      this.ComboActivator.onclick = function(ev) { parentContext.OnClickActivator(ev); };
  }
  //
  // Se ho l'immagine, aggiungo anche lei al container
  if (this.ComboImg)
    container.appendChild(this.ComboImg);
  if (this.ComboBadge)
    container.appendChild(this.ComboBadge);
  //
  // Se sono su mobile, adatto l'input
  if (RD3_Glb.IsMobile())
    this.AdaptMobileInput();
}

// ***************************************************
// Elimina gli oggetti visuali usati dalla Combo
// ***************************************************
IDCombo.prototype.Unrealize = function() 
{
  // Mi tolgo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Se ero aperta, mi chiudo
  if (this.IsOpen)
    this.Close();
  //
  if (this.ComboInput)
  {
    if (this.ComboInput.parentNode)
      this.ComboInput.parentNode.removeChild(this.ComboInput);
    this.ComboInput = null;
  }
  if (this.ComboImg)
  {
    if (this.ComboImg.parentNode)
      this.ComboImg.parentNode.removeChild(this.ComboImg);
    this.ComboImg = null;
  }
  if (this.ComboActivator)
  {
    if (this.ComboActivator.parentNode)
      this.ComboActivator.parentNode.removeChild(this.ComboActivator);
    this.ComboActivator = null; 
  }
  if (this.ComboPopup)
  {
    if (this.ComboPopup.parentNode)
      this.ComboPopup.parentNode.removeChild(this.ComboPopup);
    this.ComboPopup = null; 
  }
  if (this.ComboPopupInput)
  {
    if (this.ComboPopupInput.parentNode)
      this.ComboPopupInput.parentNode.removeChild(this.ComboPopupInput);
    this.ComboPopupInput = null;
  }
  if (this.IDScroll)
  {
    this.IDScroll.Unrealize();
    this.IDScroll = null;
  }
  if (this.CloneElem)
  {
    this.CloneElem.parentNode.removeChild(this.CloneElem);
    this.CloneElem = null;
  }
  //
  if (this.ComboBadge)
  {
    if (this.ComboBadge.parentNode)
      this.ComboBadge.parentNode.removeChild(this.ComboBadge);
    this.ComboBadge = null; 
  }
}


// ***************************************************
// Comunica alla combo se e' presente o meno l'attivatore
// ***************************************************
IDCombo.prototype.SetShowActivator = function(sh)
{
  this.ShowActivator = sh;
  if (!this.ShowActivator && this.ComboActivator)
    RD3_Glb.SetDisplay(this.ComboActivator, "none");
}


// ***************************************************
// Imposta lo stato di cliccabilita' della combo quando e' disabilitata
// ***************************************************
IDCombo.prototype.SetComboClickable = function(clk)
{
  // Se e' cambiato lo stato
  if (clk != this.Clickable)
  {
    // Cambio il valore
    this.Clickable = clk;
    //
    // Se sono disabilitata forse e' il caso di cambiare il cursore..
    if (!this.Enabled)
      this.UpdateCursor();
  }
}


// ***************************************************
// Imposta lo stato di abilitazione della combo
// ***************************************************
IDCombo.prototype.SetEnabled = function(value) 
{
  // Se e' cambiato lo stato
  if (value != this.Enabled)
  {
    this.Enabled = value;
    //
    // Nei dispositivi mobile, non voglio che compaia la tastiera
    // se il campo e' disabilitato
    if (RD3_Glb.IsTouch() && this.ComboInput)
    {
      if (this.Enabled)
        this.ComboInput.removeAttribute("readonly");
      else
        this.ComboInput.setAttribute("readonly",true);
    }
    //
    if (this.Enabled)
    {
      // Mostro l'attivatore solo se la combo lo prevede
      if (this.ComboActivator && this.ShowActivator && this.ActWidth>=0  && this.Visible)
      {
        RD3_Glb.SetDisplay(this.ComboActivator, "");
        //
        // Aggiorno lo stile dell'attivatore
        this.UpdateActivator();
      }
    }
    else
    {
      if (this.ComboActivator)
        RD3_Glb.SetDisplay(this.ComboActivator, (this.Visible && this.ActWidth >= 0 && this.ActImage!="" && this.ActEnaIfComboDis ? "" : "none"));
    }
    //
    // Se il VisualStyle dice che non occorre mostrare la descrizione
    if (this.SelItems.length>0 && !this.ShowDescription(this.VisualStyle))
    {
      // Devo mostrare o meno il valore a seconda se sono abilitata o meno
      this.SetComboValue(this.Enabled?this.GetComboFinalName(this.ShowValue):"");
    }
    //
    // Se c'e' l'attivatore ricalcolo la posizione e la larghezza dell'input
    if (this.ComboActivator)
    {
      this.SetLeft(this.Left);
      this.SetWidth(this.Width);
    }
    else if (RD3_Glb.IsMobile())
    {
      // Se sono su mobile, adatto l'input (lo faccio solo se non c'e' l'attivatore
      // dato che se c'e', l'ha gia' fatto la SetWidth)
      this.AdaptMobileInput();
    }
    //
    // Aggiorno il cursore della combo
    this.UpdateCursor();
    //
    // Aggiorno l'immagine (cliccabile/non cliccabile?)
    this.UpdateImage();
  }
}


// ********************************************************************************
// Aggiorna il cursore della combo
// ********************************************************************************
IDCombo.prototype.UpdateCursor= function()
{
  // Se il VS non ha un suo cursor, applico il default
  if (this.VisualStyle && this.VisualStyle.GetCursor()=="")
  {
    // Se la combo e' disabilitata e cliccabile, uso POINTER
    if (!this.Enabled && this.Clickable)
      this.ComboInput.style.cursor = "pointer";
    else
      this.ComboInput.style.cursor = (this.Enabled ? "" : "default");
  }
}


// ********************************************************************************
// Gestore evento di mouse down sulla combo
// ********************************************************************************
IDCombo.prototype.OnMouseDownObj= function(evento, obj)
{
  // Se non sono abilitata ma cliccabile, clicco sull'attivatore
  if (!this.Enabled && this.Clickable)
    this.OnClickActivator();
}

// ***************************************************
// Imposta lo stato di visibilita' della combo
// ***************************************************
IDCombo.prototype.SetVisible = function(value) 
{
  // Se e' cambiato lo stato
  if (value != this.Visible)
  {
    this.Visible = value;
    //
    // Aggiorno la visibilita' degli oggetti della combo
    this.ComboInput.style.visibility = (this.Visible ? "" : "hidden");
    if (this.ComboImg)
      this.ComboImg.style.visibility = (this.Visible && this.ComboImg.src!="" ? "" : "hidden");
    if (this.ComboActivator)
      RD3_Glb.SetDisplay(this.ComboActivator, this.Visible && this.ShowActivator && this.ActWidth>=0 && (this.Enabled || this.ActEnaIfComboDis) ? "" : "none");
    if (this.ComboPopup)
      this.ComboPopup.style.visibility = (this.Visible ? "" : "hidden");
    if (this.ComboPopupInput)
      this.ComboPopupInput.style.visibility = (this.Visible ? "" : "hidden");
  }
}


// ***************************************************
// Indica che la combo deve permettere inserimenti
// tramite maschera
// ***************************************************
IDCombo.prototype.SetMasked = function(msk)
{
  // Per gestire l'input mascherato devo girare il messaggio di change al KBManager
  // che, a sua volta, lo gira al maschedinp.js
  var oc = function(ev) { RD3_KBManager.IDRO_OnChange(ev); };
  if (RD3_Glb.IsIE(10, false))
  {
    if (msk)
      this.ComboInput.attachEvent("onchange",oc);
    else
      this.ComboInput.detachEvent("onchange",oc);
  }
  else
    this.ComboInput.onchange = (msk ? oc : null);
}


// ***************************************************
// Indica che la combo deve mostrare il valore e non
// la descrizione associata agli item della lista
// ***************************************************
IDCombo.prototype.SetShowValue = function(sh)
{
  this.ShowValue = sh;
  //
  // Se non mostro il valore, allora posso usare l'autocomplete dell'input.
  // Altrimenti devo usare il campo fittizio e l'onkeyup e' il suo
  var parentContext = this;
  if (!this.ShowValue)
    this.ComboInput.onkeyup = function(ev) { parentContext.OnKeyUp(ev); };
  else
    this.ComboInput.onkeyup = null;
}


// ***************************************************
// Assegna l'identificativo alla combo
// ***************************************************
IDCombo.prototype.SetID = function(id)
{
  this.ComboInput.setAttribute("id", id);
  if (this.Owner.SetZIndex)
  {
    this.Owner.SetZIndex(this.ComboInput);
    if (this.ComboActivator)
      this.Owner.SetZIndex(this.ComboActivator);
    if (this.ComboImg)
      this.Owner.SetZIndex(this.ComboImg);
  }
}


// ***************************************************
// Imposta lo stile visuale della combo
// ***************************************************
IDCombo.prototype.SetVisualStyle = function(vs, skipinput, force)
{
  if (this.VisualStyle != vs || force)
  {
    // E' cambiato
    var oldvs = this.VisualStyle;
    this.VisualStyle = vs;
    //
    // Lo applico all'input se devo
    if (!skipinput)
    {
      vs.ApplyValueStyle(this.ComboInput);
      //
      // Ho toccato lo stile visuale... Devo resettare lo stato della cache per quel
      // che riguarda i padding (che sono sicuramente stati toccati)
      this.PaddingRight = undefined;
      this.PaddingLeft = undefined;
    }
    //
    // Aggiorno il cursore della combo
    this.UpdateCursor();
    //
    // Se ho l'attivatore, applico lo stile anche a lui
    if (this.ComboActivator)
      this.UpdateActivator();
    //
    // E' cambiato lo stile... se e' cambiato il valore del flag SHOWDESCRIPTION, devo tenerne conto
    if (this.SelItems.length>0)
    {
      // Devo mostrare o meno il valore a seconda se sono abilitata o meno
      if (this.ShowDescription(this.VisualStyle) && !this.ShowDescription(oldvs))
        this.SetComboValue(this.GetComboFinalName(this.ShowValue));
      else if (!this.Enabled && !this.ShowDescription(this.VisualStyle) && this.ShowDescription(oldvs))
        this.SetComboValue("");
    }
    //
    // Se sono aperta, mi aggiorno
    if (this.IsOpen)
      this.Open(true);
  }
}

// ***************************************************
// Imposta il tooltip della combo
// ***************************************************
IDCombo.prototype.SetTooltip = function(tip)
{
  if (tip != this.Tooltip)
  {
    this.Tooltip = tip;
    //
    // Calcolo il tooltip della combo tenendo conto degli item interni
    if (this.Tooltip == "" && this.SelItems.length>0)
      tip = this.SelItems[0].Tooltip;
    //
    RD3_TooltipManager.SetObjTitle(this.ComboInput, tip);
  }
}

// ***************************************************
// Imposta il right align della combo
// ***************************************************
IDCombo.prototype.SetRightAlign = function(rig)
{
  if (rig != this.RightAlign)
  {
    this.RightAlign = rig && !RD3_ServerParams.RightAlignedIcons;
    //
    this.ComboInput.style.textAlign = (rig ? "right" : "left");
    //
    // Se ho l'attivatore, lo aggiorno
    if (this.ComboActivator)
      this.UpdateActivator();
    //
    // Devo riposizionare l'input
    this.SetLeft(this.Left);
    this.SetWidth(this.Width);
  }
}

// ***************************************************
// Imposta l'immagine di attivazione della combo
// ***************************************************
IDCombo.prototype.SetHasActivator = function(actimg, actwidth, actifdisab, cloned)
{
  if (actimg != this.ActImage || (actwidth-2) != this.ActWidth)
  {
    this.ActImage = actimg;
    this.ActWidth = actwidth-2;
    this.ActEnaIfComboDis = actifdisab;
    //
    // Aggiorno l'icona dell'attivatore
    if (this.ActImage!="" && this.ActWidth>=0)
      this.ComboActivator.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/" + this.ActImage + ")";
    else
      this.ComboActivator.style.backgroundImage = (cloned ? "" : "none");
    //
    // Aggiorno lo stato di visibilita' dell'attivatore
    RD3_Glb.SetDisplay(this.ComboActivator, (this.Visible && this.ActWidth >= 0 && (this.Enabled || (this.ActImage!="" && this.ActEnaIfComboDis)) ? "" : "none"));
    //
    // Infine le dimensioni dell'input
    this.SetLeft(this.Left);
    this.SetWidth(this.Width);
  }
}

// ***************************************************
// Metodo necessario per fornire la lista alla combo
// ***************************************************
IDCombo.prototype.AssignValueList = function(list, created)
{
  // Se sono aperta, su mobile, non uso un popover e sono durante il resize, skippo questo aggiornamento
  if (this.IsOpen && RD3_Glb.IsMobile() && !this.UsePopover && RD3_DesktopManager.WebEntryPoint.InResize)
    return;
  //
  var oldlist = this.OptionList;
  this.OptionList = list;
  //
  // Gestione del Watermark come nome dell'item vuoto opzionale
  if (this.Owner && this.Owner.ParentField && this.Owner.ParentField.UseWatermarkAsNull() && this.OptionList)
  {
    for (var vidx=0; vidx<this.OptionList.ItemList.length; vidx++) 
    {
      var vi = this.OptionList.ItemList[vidx];
      //
      // Cerco l'item opzionale (Nome e valore vuoti oppure valore LKENULL)
      if ((vi.Name == "" && vi.Value == "") || vi.Value == "LKENULL")
      {
        // Assegno il watermark alla lista
        vi.Name = this.Owner.ParentField.WaterMark;
        vi.OrgNames = this.Owner.ParentField.WaterMark;
        break;
      }
    }
  }
  //
  var superact = this.Owner.ParentField && this.Owner.ParentField.HasValueSource && this.Owner.ParentField.SuperActive && this.ActClicked;
  //
  // Se e' cambiata la lista, la selezione e' invalida! Cerco l'item nella nuova lista
  if (oldlist != this.OptionList)
  {
    // Se ho una lista
    if (this.OptionList)
    {
      // Se avevo una selezione, cerco di mantenerla
      if (this.MultiSel && !this.ListOwner)
        this.SelItems = this.OptionList.FindItemsLKE();
      else if (this.SelItems.length>0)
        this.SelItems = this.OptionList.FindItemsByArray(this.SelItems);
      else
      {
        this.SelItems = this.OptionList.FindItemsByValue(this.ComboInput.value, !this.ShowValue, this.ValueSep, !this.ListOwner);
        //
        // Caso particolare di LKE con PREVVAL
        if (this.SelItems.length==0 && !this.ListOwner)
        {
          this.SelItems = this.OptionList.FindItemsByValue("(" + this.ComboInput.value + ")", !this.ShowValue, this.ValueSep);
          //
          // MOBILE: Scelgo il primo valore se non ho trvato nulla..
          if (RD3_Glb.IsMobile() && this.SelItems.length==0)
            this.SelItems.push(this.OptionList.ItemList[0]);
        }
      }
    }
    else
    {
      // Non ho piu' una lista... la selezione e' invalida!
      this.SelItems = new Array();
    }
  }
  //
  // Se non avevo la lista ed ora ce l'ho ma non sono stato appena creato, apro subito il popup
  if ((oldlist==null || superact) && list && !created && this.ActClicked)
  {
    // Se non ho un item selezionato e c'e' un valore nell'input, posso filtrare
    if ((this.SelItems.length==0 || this.MultiSel || superact) && this.ComboInput.value!="")
    {
      // Se sono list-owner
      if (this.ListOwner)
      {
        // Filtro. Se la selezione non mostrerebbe nessun oggetto, li mostro tutti! (ma non per valuesource superattive)
        if (superact)
          this.OptionList.FilterComboItem(this.ComboInput.value, true);
        else if (this.OptionList.FilterComboItem(this.ComboInput.value, true) == 0)
          this.OptionList.FilterComboItem("");
      }
      else
      {
        // Evidenzio solamente gli item della lista
        this.OptionList.FilterComboItem(this.ComboInput.value, true, true);
      }
      //
      // In caso di superactive, resetto la selezione
      if (superact && this.SelItems)
        this.SelItems.length = 0;
      //
      this.HLItem = this.OptionList.GetNextVisibleItem(null);
      if (this.SelItems.length==0 && !this.MultiSel)
      {
        // Seleziono il primo item visibile della lista
        if (this.HLItem)
          this.SelItems.push(this.HLItem);
      }
      //
      // E aggiorno la lista!
      this.Open(true);
    }
    else
    {
      // Apro la combo e basta
      this.Open();      
      //
      // Se non avevo una lista e me ne e' appena arrivata una nuova ma il mio owner non 
      // ha piu' il fuoco mi chiudo subito confermando la scelta del primo item (senza spostare il fuoco)
      if (oldlist==null && !RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.HilightedCell != this.Owner)
        this.Close(false, true);
    }   
  }
  else if (oldlist && !list)
  {
    // Se avevo la lista e non ce l'ho piu', chiudo la combo se era aperta!
    if (this.IsOpen)
      this.Close(true);
  }
  else if (oldlist && list && !oldlist.Equals(list) && this.IsOpen)
  {
    // Se mi e' arrivata una lista diversa e ero gia' aperta, apro la combo
    this.Open();
  }
  else if (oldlist && list && oldlist!=list && this.ActClicked)
  {
    // Se mi e' arrivata una lista diversa (anche se ha gli stessi valori) e avevo cliccato sull'attivatore, apro la combo
    this.Open();
  }
  else if (this.Open && oldlist && list && oldlist.Equals(list)) {
    // Mi e' stata riassegnata la stessa lista ed ero gia' aperta: puo' succedere in alcuni casi speciali
    // (evento di onfocus)
    // Per prima cosa devo spostare i TR dalla lista vecchia a quella attuale (essendo uguali gli item sono nelle stesse posizioni)
    for (var ix = 0; ix < oldlist.ItemList.length; ix++)
      list.ItemList[ix].TR = oldlist.ItemList[ix].TR;
  }
  //
  // Quand'anche avessi cliccato sulla combo, ora non mi interessa piu'
  if (this.OptionList)
    this.ActClicked = false;
}


// ***************************************************
// Imposta il testo presente nella combo
// ***************************************************
IDCombo.prototype.SetText = function(txt, isvalue, closecombo)
{
  // Eventuali svuotamenti ritardati sono stati gestiti
  this.DeferEmpty = false;
  //
  // Se ho una lista e non sono list-owner, comanda la lista che mi hanno dato
  // In questo caso non accetto modifiche al testo (solo se sono la cella fuocata!)
  if (this.OptionList && !this.ListOwner && txt!="" && closecombo && this.Owner==RD3_DesktopManager.WebEntryPoint.HilightedCell)
    return;
  //
  this.SelItems = new Array();
  //
  // Se ho una lista cerco testo tra i valori (cerco per nome/valore a seconda del parametro isvalue - anche il separatore deve essere adatto in base al tipo di ricerca)
  if (this.OptionList && !(!txt && this.Owner.PValue && this.Owner.PValue.IsNewRow()))
    this.SelItems = this.OptionList.FindItemsByValue(txt, !isvalue, isvalue ? this.ValueSep : RD3_ClientParams.ComboNameSeparator);
  //
  // Aggiorno l'immagine
  this.UpdateImage();
  //
  // Se ho un item selezionato il testo nella combo e' il nome dell'item
  if (this.SelItems.length>0)
  {
    // Se il VisualStyle dice che non occorre mostrare la descrizione
    if (!this.Enabled && !this.ShowDescription(this.VisualStyle))
      this.SetComboValue("");
    else
      this.SetComboValue(this.GetComboFinalName(this.ShowValue));
  }
  else
    this.SetComboValue(txt);
  //
  // Memorizzo il testo attualmente presente nell'input (per gestire bene il KeyUp)
  this.PreviousInputText = this.ComboInput.value;
  //
  // Memorizzo il testo originale presente nell'input
  this.OriginalText = this.ComboInput.value;
  //
  // Se mi chiedono di chiudere la combo, lo faccio
  // (forse il server ha inviato un valore diverso da prima ed io mi devo allineare)
  if (closecombo && this.IsOpen)
    this.Close();
}


// ***************************************************
// Ritorna il valore/nome corrente della combo
// ***************************************************
IDCombo.prototype.GetComboValue = function()
{
  if (!this.ListOwner && this.IsOpen)
   {
    var dummyInp = (this.ComboPopupInput && this.ComboPopupInput.style.display=="");
    if (RD3_Glb.IsMobile() && dummyInp)
    {
      var s = this.ComboPopupInput.value; 
      if (s=="") s="*";
      return s;
    }
    else
      return this.ComboInput.value;
  }
  //
  return (this.SelItems.length>0 ? this.GetComboFinalName(true) : this.ComboInput.value);
}
IDCombo.prototype.GetComboName = function()
{
  if (!this.ListOwner && this.IsOpen)
    return this.ComboInput.value;
  //
  return (this.SelItems.length>0 ? this.GetComboFinalName(this.ShowValue) : this.ComboInput.value);
}
IDCombo.prototype.GetComboFinalName = function(ShowValue)
{
  var val = "";
  var sep = (ShowValue ? this.ValueSep : RD3_ClientParams.ComboNameSeparator);
  var n = this.SelItems.length;
  for (var j=0; j<n; j++)
    val += (val.length>0 ? sep : "") + (ShowValue ? this.SelItems[j].Value : this.SelItems[j].Name);
  //
  return val;
}


// ***************************************************
// Aggiorna lo stile dell'attivatore
// ***************************************************
IDCombo.prototype.UpdateActivator = function()
{
  // Copio BackGroundColor e Border dall'INPUT
  var sa = this.ComboActivator.style;
  var si = this.ComboInput.style;
  sa.backgroundColor = si.backgroundColor;
  sa.paddingTop = si.paddingTop;  
  sa.paddingBottom = si.paddingBottom;
  //
  // I bordi left/right li devo prendere da chi ancora li ha (potrebbero averli gia' tolti)
  var bw = (this.RightAlign ? si.borderRightWidth : si.borderLeftWidth);
  var bc = (this.RightAlign ? si.borderRightColor : si.borderLeftColor);
  var bs = (this.RightAlign ? si.borderRightStyle : si.borderLeftStyle);
  sa.borderTopWidth = si.borderTopWidth;
  sa.borderBottomWidth = si.borderBottomWidth;
  sa.borderLeftWidth = bw;
  sa.borderRightWidth = bw;
  sa.borderTopStyle = si.borderTopStyle;
  sa.borderBottomStyle = si.borderBottomStyle;
  sa.borderLeftStyle = bs;
  sa.borderRightStyle = bs;
  sa.borderTopColor = si.borderTopColor;
  sa.borderBottomColor = si.borderBottomColor;
  sa.borderLeftColor = bc;
  sa.borderRightColor = bc;
  //
  // L'attivatore non ha il bordo sx/dx
  if (this.RightAlign)
    sa.borderRight = "";
  else
    sa.borderLeft = "";
}


// ***************************************************
// Aggiorna l'immagine presente nella combo
// ***************************************************
IDCombo.prototype.UpdateImage = function()
{
  var oldimg = (this.ComboImg ? this.ComboImg.style.display : "none");
  //
  // Se ho un item selezionato
  if (this.SelItems.length>0)
  {
    // Se l'item ha un'immagine
    if (this.SelItems[0].Image!="")
    {
      // Vedo se devo riposizionare l'immagine
      var repos = false;
      //
      // Se non ho ancora creato l'immagine, lo faccio ora
      if (!this.ComboImg)
      {
        this.ComboImg = document.createElement("IMG");
        this.ComboImg.className = "combo-img";
        if (this.Owner.SetZIndex)
          this.Owner.SetZIndex(this.ComboImg);
        //
        // Se ho gia' posizionato l'input, inserisco anche l'immagine
        if (this.ComboInput.parentNode)
        {
          // Inserisco l'immagine dopo l'attivatore, se c'e'... Altrimenti va dopo l'input
          if (this.ComboActivator)
            this.ComboInput.parentNode.insertBefore(this.ComboImg, this.ComboActivator.nextSibling);
          else 
            this.ComboInput.parentNode.insertBefore(this.ComboImg, this.ComboInput.nextSibling);
        }
        //
        // L'ho creata... va riposizionata
        repos = true;
      }
      else
      {
        if (this.ComboImg.style.display == "none")
        {
          this.ComboImg.style.display = "";
          //
          // Ora e' visibile... va riposizionata
          repos = true;
        }
      }
      //
      // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
      if (RD3_Glb.Adapt4Retina(this.Identifier, this.SelItems[0].Image, 43))
        this.ComboImg.style.display = "none";
      //
      // Posiziono l'immagine se devo
      if (repos)
      {
        this.SetLeft(this.Left);
        this.SetTop(this.Top);
        this.SetWidth(this.Width);
        this.SetHeight(this.Height);
      }
      //
      this.ComboImg.src = RD3_Glb.GetImgSrc("images/"+this.SelItems[0].Image)
    }
    else
    {
      // L'item non ha un'immagine. Nascondo l'immagine se ce l'ho
      if (this.ComboImg)
        this.ComboImg.style.display = "none";
    }
  }
  else
  {
    // Non ho un item selezionato. Nascondo l'immagine se ce l'ho
    if (this.ComboImg)
      this.ComboImg.style.display = "none";
  }
  //
  // Se e' cambiata la visibilita' dell'immagine
  var newimg = (this.ComboImg ? this.ComboImg.style.display : "none");
  if (oldimg != newimg)
  {
    // Devo ricalcolare la mia larghezza dato che uso il padding per inserire l'immagine a sx
    this.SetLeft(this.Left);
    this.SetWidth(this.Width);
    this.SetTop(this.Top);
  }
  //
  // Se il VS non ha un suo cursor, applico il default
  if (this.ComboImg && this.VisualStyle && this.VisualStyle.GetCursor()=="")
  {
    // Se la combo e' disabilitata e cliccabile, uso POINTER
    if (!this.Enabled && this.Clickable)
      this.ComboImg.style.cursor = "pointer";
    else
      this.ComboImg.style.cursor = (this.Enabled ? "" : "default");
  }
}

// ***************************************************
// Imposta le coordinate della combo
// ***************************************************
IDCombo.prototype.SetLeft = function(x)
{
  // Per cominciare l'input
  this.Left = x;
  if (this.RightAlign && this.ComboActivator && this.ComboActivator.style.display=="")
    this.ComboInput.style.left = this.Left + this.ActWidth+1 + (RD3_ServerParams.Theme.startsWith("zen") ? (this.RightAlign && this.Owner.InList ? -4 : -10) : 0) + "px";
  else
    this.ComboInput.style.left = this.Left + "px";
  //
  // Se ho l'attivatore posiziono anche lui
  if (this.ComboActivator)
    this.ComboActivator.style.left = this.Left + (this.RightAlign ? 0 : this.Width-this.ActWidth-2 - (this.Owner instanceof BookSpan ? 2 : 0) + (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? 7 : 1) : 0)) + "px";
  //
  // Se ho l'immagine posiziono anche lei
  if (this.ComboImg && this.ComboImg.style.display=="")
  {
    // L'immagine va a sinistra e uso il padding per rendere inaccessibile l'area coperta dall'immagine
    this.ComboImg.style.left = (this.Left + 2) + "px";
    //
    if (RD3_Glb.IsMobile())
    {
      // Applico i padding dal VS all'immagine invece che all'input, di default il tema mobile ha i padding custom applicati
      // agli Input, dato che se c'e' l'immagine questa va prima degli input e' a lei che devo dare i padding
      var pad = 0;
      if (this.VisualStyle && this.VisualStyle.GetBorders(1)==9)
      {
        pad = this.VisualStyle.GetCustomPadding(4)/4;
        this.ComboImg.style.paddingLeft = pad + "pt"; // Padding in quarti di pt
      }
      //
      this.ComboInput.style.paddingLeft = (pad + RD3_ClientParams.ComboImageSize + 3 + 4 + 4) + "px";
    }
    else
    {
      this.ComboInput.style.paddingLeft = (2+RD3_ClientParams.ComboImageSize+1) + "px";    // 2px padding + immagine
    }
  }
  else
  {
    // Immagine non presente o immagine invisibile... niente padding
    this.ComboInput.style.paddingLeft = "";
  }
  //
  // Se ho il Badge posiziono anche lui
  if (this.ComboBadge != null)
  {
    var bLeft = this.Left + (this.Width - RD3_Glb.GetBadgeWidth(this.Badge, "grey") - 2);
    if (RD3_Glb.IsMobile())
      bLeft =  bLeft + 6;
    //
    if (this.ComboActivator && this.ComboActivator.style.display == "")
      bLeft = bLeft - this.ActWidth + (RD3_Glb.IsMobile() ? 0 : -6);
    else
    {
      // Ci sono solo io... sposto il badge il piu' a destra possibile
      bLeft = bLeft + (RD3_Glb.IsMobile() ? 16 : -3);
    }
    //
    this.ComboBadge.style.left = bLeft - (this.Owner instanceof BookSpan ? 2 : -2) + "px";
  }
}


IDCombo.prototype.SetTop = function(y)
{
  // Per cominciare l'input
  this.Top = y;
  this.ComboInput.style.top = this.Top + "px";
  //
  // Se ho l'attivatore posiziono anche lui
  if (this.ComboActivator)
    this.ComboActivator.style.top = this.Top + "px";
  //
  // Se ho l'immagine ed e' visibile posiziono anche lei
  if (this.ComboImg && this.ComboImg.style.display=="")
  {
    this.SetHeight(this.Height);
    this.ComboImg.style.top = (this.Top + 2) + "px";
  }
  //
  // Se ho il Badge posiziono anche lui
  if (this.ComboBadge != null)
    this.ComboBadge.style.top = (this.Top + 2) + "px";
}


IDCombo.prototype.SetWidth = function(w)
{
  // Per cominciare l'input
  this.Width = w;
  var neww = w;
  if (!RD3_Glb.IsMobile())
  {
    // In alcuni casi per gestire dei bordi strani serve un +1, 
    // ma non per l'ultimo campo in lista altrimenti copre il bordo della lista
    // e nemmeno se non c'e' l'attivatore, altrimenti il campo risulta troppo largo
    var marleft = (this.ComboActivator && this.ComboActivator.style.display=="")?1:0;
    if (marleft && this.Owner && this.Owner instanceof PCell && this.Owner.InList && !RD3_ServerParams.Theme.startsWith("zen"))
    {
      var pf = this.Owner.ParentField;
      if (pf.ParentPanel.GetLastListField() == pf)
        marleft = 0;
    }
    //
    this.ComboMarLeft = marleft;
    //
    // Le combo sono troppo larghe su zen di 1 px, non da' problemi tranne nel caso di TabOrder Avanzato 
    var zlofs = -2;
    if (this.Owner && this.Owner instanceof PCell && this.Owner.ParentField && this.Owner.ParentField.ParentPanel.AdvTabOrder)
      zlofs = -1;
    neww = (this.Width - (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? zlofs:4):4)+marleft);     // Padding 2px + mancava un px di larghezza e l'ho aggiunto
    if (this.ComboImg && this.ComboImg.style.display=="")
      neww -= RD3_ClientParams.ComboImageSize+1;   // immagine
    if (this.ComboActivator && this.ComboActivator.style.display=="")
      neww -= this.ActWidth+1 + (RD3_ServerParams.Theme.startsWith("zen")?(this.Owner.InList?-3:-9):0);
  }
  //
  // Se, non c'e' abbastanza posto nella combo, riduco il padding
  if (this.ComboImg && this.ComboImg.style.display=="" && this.Width && neww<0)
  {
    var newp = (2+RD3_ClientParams.ComboImageSize+1 + neww);    // 2px padding + immagine;
    if (newp<0) newp=0;
    this.ComboInput.style.paddingLeft = newp + "px";
  }
  //
  if (neww<0) neww=0;
  this.ComboInput.style.width = neww + "px";
  this.ComboInputW = neww;
  //
  // Se ho l'attivatore posiziono anche lui
  if (this.ComboActivator)
    this.ComboActivator.style.left = this.Left + (this.RightAlign ? 0 : this.Width-this.ActWidth-2 - (this.Owner instanceof BookSpan ? 2 : 0) + (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? 7 : 1) : 0)) + "px";
  //
  // Se ho il Badge posiziono anche lui
  if (this.ComboBadge != null)
  {
    var bLeft = this.Left + (this.Width - RD3_Glb.GetBadgeWidth(this.Badge, "grey") - 2);
    if (RD3_Glb.IsMobile())
      bLeft = bLeft + 6;
    //
    if (this.ComboActivator && this.ComboActivator.style.display == "")
      bLeft = bLeft - this.ActWidth + (RD3_Glb.IsMobile() ? 0 : -6);
    else
    {
      // Ci sono solo io... sposto il badge il piu' a destra possibile
      bLeft = bLeft + (RD3_Glb.IsMobile() ? 16 : -3);
    }
    //
    this.ComboBadge.style.left = bLeft - (this.Owner instanceof BookSpan ? 2 : -2) + "px";
  }
  //
  // Se sono su mobile, adatto l'input
  if (RD3_Glb.IsMobile())
    this.AdaptMobileInput();
}


IDCombo.prototype.SetHeight = function(h)
{
  // Per cominciare l'input
  this.Height = h;
  //
  // In caso di bordi NON custom devo tenere conto anche dei padding
  // per quello custom invece, PCell.UpdateDims ne tiene conto gia' lui
  var margy = 0;
  if (this.VisualStyle && !RD3_Glb.IsMobile() && this.VisualStyle.GetBorders(this.Owner.InList?1:6)!=9)
  {
    margy = this.VisualStyle.GetOffset(false, 1, this.Owner.InList, false)*2;
    //
    // Se non ho nessun bordo la classe CSS della COMBO imposta comunque un padding di 2+2.
    // Dovrei scriverlo dentro la GetOffset ma per sicurezza lo applico solo qui
    if (this.VisualStyle.GetBorders(this.Owner.InList?1:6) == 1 && margy == 0)
      margy = 4;
  }
  margy = (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? 0 : 2) : margy);
  var newh = h - margy;
  if (newh<0) newh=0;
  //
  this.ComboInput.style.height = newh + "px";    // Padding 2px
  //
  // Se ho l'attivatore posiziono anche lui
  if (this.ComboActivator)
    this.ComboActivator.style.height = this.Height - (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? 0 : 2) : 0) + "px";
  //
  // Se ho l'immagine la ricentro in altezza
  if (this.ComboImg && this.ComboImg.style.display=="")
    this.ComboImg.style.top = (this.Top + (this.Height - RD3_ClientParams.ComboImageSize - margy) / 2 + 1)  + "px";
  //
  // Se ho il Badge posiziono anche lui
  if (this.ComboBadge != null)
    this.ComboBadge.style.top = (this.Top + 2) + "px";
}

// ***************************************************
// Imposta lo sfondo della combo
// ***************************************************
IDCombo.prototype.SetBackGroundImage = function(img)
{
  this.ComboInput.style.backgroundImage = img;
}

// ***************************************************
// Imposta il ridimensionamento dell'immagine di sfondo della combo
// ***************************************************
IDCombo.prototype.SetBackGroundImageRM = function(br, bp)
{
  this.ComboInput.style.backgroundRepeat = br;
  this.ComboInput.style.backgroundPosition = bp;
}

// **********************************************************************
// Mette/toglie l'evidenziazione sulla cella
// **********************************************************************
IDCombo.prototype.SetActive = function(act)
{
  // Se c'e' l'attivatore ed e' visibile, attivo/disattivo anche lui!
  if (this.ComboActivator && this.ComboActivator.style.display=="")
  {
    // Se mi hanno attivato
    if (act)
    {
      var vs = this.VisualStyle;
      var r = vs.GetBookOffset(true,(this.Owner.InList)? 1 : 6); // r contiene le dimensioni di ogni bordo
      // r.x = bordo sinistro
      // r.y = bordo sopra
      // r.w = bordo destro
      // r.h = bordo sotto
      //      
      var s = this.ComboActivator.style;
      var si = this.ComboInput.style;
      var backCol  = vs.GetColor(10); // VISCLR_EDITING
      if (backCol != "transparent")
        s.backgroundColor = backCol;
      else if (!RD3_ServerParams.Theme.startsWith("zen"))
      {
        var brdColor = vs.GetColor(11); // VISCLR_BORDERS
        if (this.RightAlign)
        {
          s.borderLeft = "2px solid " + brdColor;
          si.borderLeft = "none";
          //
          // Ripristino larghezza input che e' stata modificata dalla mancanza dei bordi
          si.width = (parseInt(si.width)+2) + "px";
        }
        else
        {
          s.borderRight = "2px solid " + brdColor;
          si.borderRight = "none";
          //
          // Devo anche spostarlo in "dentro" di un po' se manca il bordo verticale
          if (r.w==0)
            s.left = (parseInt(s.left) - 2) + "px";
        }
        s.borderTop = "2px solid " + brdColor;
        s.borderBottom = "2px solid " + brdColor;
        //
        s.height = (parseInt(s.height)-(4-r.y-r.h)) + "px";
        //
        // Devo anche spostarlo in "dentro" di 1px
        if (!this.RightAlign)
        {
          s.left = (parseInt(s.left) - 1) + "px";
          //
          // Lasciando fermo l'attivatore!
          s.backgroundPosition = "3px center";
        }
        else
        {
          // Lascio fermo l'attivatore!
          s.backgroundPosition = "1px center";
        }
      }
    }
    else // Mi hanno disattivato, ripristino i bordi ed il colore di sfondo
    {
      // Forzo l'aggiornamento dell'attivatore
      this.UpdateActivator();
      //
      // Ripristino il background pos
      this.ComboActivator.style.backgroundPosition = "center center";
    }
  }
  //
  // Se ho l'immagine ripristino il padding sinistro che se ne va
  if (!act && this.ComboImg)
  {
    this.SetLeft(this.Left);
  }
  //
  // Se mi hanno disattivata e dovevo gestire lo svuotamento ritardato, 
  // lo faccio ora
  if (!act && this.DeferEmpty)
    this.SetText("", true, true);
  else if (!act && this.IsOpen)
    this.Close();
}


// ***************************************************
// Ritorna l'oggetto DOM principale della combo
// ***************************************************
IDCombo.prototype.GetDOMObj = function()
{
  return this.ComboInput;
}

// ***************************************************
// Nasconde/mostra il contenuto della combo
// ***************************************************
IDCombo.prototype.HideContent = function(hide, disable)
{
  if (hide)
  {
    // Se richiesto, disabilito l'input
    if (disable)
      this.ComboInput.disabled = "disabled";
    //
    // Nascondo gli oggetti
    this.SetComboValue("");
    if (this.ComboImg)
      this.ComboImg.style.display = "none";
    if (this.ComboActivator)
      RD3_Glb.SetDisplay(this.ComboActivator, "none");
    if (this.ComboPopup)
      this.ComboPopup.style.display = "none";
    if (this.ComboPopupInput)
      this.ComboPopupInput.style.display = "none";
    if (this.ComboBadge)
      this.SetBadge("");
    //
    this.Enabled = false;
    //
    this.SetComboClickable(false);
  }
  else
  {
    // Su chrome non basta togliere l'attributo DISABLED
    if (this.ComboInput.disabled && (RD3_Glb.IsChrome() || RD3_Glb.IsSafari()))
    {
      // Fa schifo ma non ho altro modo per obbligare WebKit ad aggiornare bene la cella
      var oldpar = this.ComboInput.parentNode;
      var oldsib = this.ComboInput.nextSibling;
      this.ComboInput.parentNode.removeChild(this.ComboInput);
      if (oldsib)
        oldpar.insertBefore(this.ComboInput, oldsib);
      else
        oldpar.appendChild(this.IntCtrl);
    }
    this.ComboInput.removeAttribute("disabled");
    //
    // Ripristino il testo dell'input.
    this.SetComboValue(this.OriginalText);
    //
    // Se abilitato, mostro l'attivatore
    if (this.Visible && this.ActWidth >= 0 && (this.Enabled || (this.ActImage!="" && this.ActEnaIfComboDis)) && this.ComboActivator)
      RD3_Glb.SetDisplay(this.ComboActivator, "");
    //
    // Aggiorno l'immagine
    this.UpdateImage();
  }
  //
  // Aggiorno le dimensioni della combo ora che e' cambiata la visibilita' dei controlli interni
  this.SetLeft(this.Left);
  this.SetWidth(this.Width);
  this.SetTop(this.Top);
}

// ***************************************************
// Gestione click sull'attivatore
// ***************************************************
IDCombo.prototype.OnClickActivator = function(ev)
{
  if (this.Owner && this.Owner.ListQBECell) 
    return this.Owner.ParentField.OnClickActivator(ev);
  //
  // Se ero aperta, mi chiudo ed ho finito
  if (this.IsOpen)
  {
    this.Close(this.MultiSel ? false : true);
    return;
  }
  //
  // Fuoco la cella attivata
  if (this.Writable)
    this.ComboInput.focus();
  //
  // Apro la combo se non ho un oggetto di attivazione associato
  // Altrimenti informo l'owner del click sull'attivatore
  if (this.Enabled && this.OptionList && this.ListOwner && (this.ActImage == "" || this.Owner.ListQBECell))
  {
    if (this.HasWatermark && this.Owner && this.Owner.RemoveWatermark)
      this.Owner.RemoveWatermark();
    //
    this.Open();
  }
  else if (this.Owner.OnComboActivatorClick)
  {
    if (RD3_Glb.IsIE()) 
    {
      // Su chrome fare this.ComboInput.focus(); fa scattare subito la gestione e quindi il cambio riga
      // su IE no, scatta dopo, quindi ci vuole un timer per fare arrivare al server il messaggio nell'ordine giusto.
      var my_cmb = this;
      window.setTimeout(function () {
        my_cmb.Owner.OnComboActivatorClick();
      }, 50);
    }
    else 
      this.Owner.OnComboActivatorClick();
    //
    // Mi ricordo che ho cliccato sull'attivatore. Quando e se il server
    // mi rispondera', ne tengo conto
    // Lo faccio solo se la combo non ha un oggetto di attivazione... se ce l'ha apro la combo solo se premo F2 o ALT-FRECCIAGIU
    var comboWithAct = (this.Owner && this.Owner.ParentField && this.Owner.ParentField.CanActivate);
    if (!comboWithAct)
      this.ActClicked = true;
  }
  //
  // Specifica per IDEditor: la combo aprendosi porta via il fuoco e la selezione.. invece noi la vogliamo tenere sotto..
  if (!this.Writable && this.Owner.RestoreSelection)
    this.Owner.RestoreSelection();
}

// ***************************************************
// Metodo per forzare l'apertura della combo
// ***************************************************
IDCombo.prototype.OpenComboForced = function()
{
  // Apro la combo se non ho un oggetto di attivazione associato
  // Altrimenti informo l'owner del click sull'attivatore
  if (this.Enabled && this.OptionList && this.ListOwner)
  {
    if (this.HasWatermark && this.Owner && this.Owner.RemoveWatermark)
      this.Owner.RemoveWatermark();
    //
    this.Open();
  }
  else if (this.Owner.OnComboActivatorClick)
  {
    this.Owner.OnComboActivatorClick(true);
    //
    // Mi ricordo che ho cliccato sull'attivatore. Quando e se il server
    // mi rispondera', ne tengo conto
    this.ActClicked = true;
  }
}

// ***************************************************
// Apre/aggiorna la combo (il popup)
// ***************************************************
IDCombo.prototype.Open = function(update)
{
  // Se sono smartlookup Mobile devo sempre aprirmi con l'intera lista
  var askList = false;
  if (RD3_Glb.IsMobile() && !this.ListOwner && this.Owner.Text != "*" && this.ComboPopup && this.ComboPopup.style.display=="none")
  {
    askList = true;
    if (this.ComboPopupInput)
    {
      this.ComboPopupInput.value = "";
      RD3_Glb.RemoveClass(this.ComboPopupInput, "combo-search-deletable");
    }
  }
  //
  // Se non ho la lista
  if (!this.OptionList || askList)
  {
    // Se c'e' l'attivatore, clicco su di lui in modalita' FORCEOPEN... cosi' mi arriva la lista
    if (this.Owner.OnComboActivatorClick)
    {
      this.Owner.OnComboActivatorClick(true);
      //
      // Mi ricordo che ho cliccato sull'attivatore. Quando e se il server
      // mi rispondera', ne tengo conto
      this.ActClicked = true;
    }
    //
    return;
  }
  //
  // Se non ho ancora l'oggetto nel DOM, lo creo
  var tbody = null;
  var parentContext = this;
  if (!this.ComboPopup)
  {
    this.ComboPopup = document.createElement("DIV");
    this.ComboPopup.className = "combo-popup";
    this.ComboPopup.setAttribute("id", this.Identifier+":cap");
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsMobile() && !RD3_Glb.IsIE(10, true))
    {
      this.ComboPopup.addEventListener("touchstart", function(ev) { parentContext.OnTouchStart(ev); }, false);
      this.ComboPopup.addEventListener("touchmove",  function(ev) { parentContext.OnTouchMove(ev); }, false);
      this.ComboPopup.addEventListener("touchend",   function(ev) { parentContext.OnTouchEnd(ev); }, false);
    }
    //
    // Se il menu e' TaskBar la combo deve avere z-index 10, in modo da potersi vedere anche sopra alle form modali..
    if (!RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
      this.ComboPopup.style.zIndex = 10;
    //
    var tbl = document.createElement("TABLE");
    tbl.className = "combo-popup-table";
    tbody = document.createElement("TBODY");
    tbl.appendChild(tbody);
    this.ComboPopup.appendChild(tbl);
    this.ComboTbl = tbl;
    //
    if (RD3_Glb.IsMobile())
    {
      var parp = (this.Owner instanceof PCell || this.Owner instanceof IDEditor) ? this.Owner.ParentField.ParentPanel : null;
      if (this.IsPopOver())
      {
        document.body.appendChild(this.ComboPopup);
      }
      else if (this.SlideForm())
      {
        if (!this.CloneElem)
        {
          this.CloneElem = parp.WebForm.FramesBox.cloneNode(false);
          parp.WebForm.FormBox.appendChild(this.CloneElem);
        }
        this.CloneElem.appendChild(this.ComboPopup);
      }
      else
      {
        // Lo appendo al content box, fratello di form box e list box
        parp.ContentBox.appendChild(this.ComboPopup);
      }
    }
  }
  else
  {
    // L'ho gia'... lo rendo visibile se l'ho nascosto
    this.ComboPopup.style.display = "";
    if (this.CloneElem)
      this.CloneElem.style.display = "";
    //
    // E recupero il body a cui aggiungero' i TR
    var obj = this.ComboPopup.firstChild;
    while (obj && obj.tagName!="TABLE")
      obj = obj.nextSibling;
    //
    if (!obj && this.ComboTbl)
      obj = this.ComboTbl;
    //
    if (obj)
      tbody = obj.tBodies[0];
  }
  //
  // Proseguo solo se ho trovato i miei oggetti
  if (!tbody)
    return;
  //
  // Se la lista non e' in fondo al DOM / caso mobile gestito sopra
  if (!RD3_Glb.IsMobile())
  {
    // L'overlay potrebbe essersi spostato, per sicurezza mi rimetto in fondo
    if (this.Owner && this.Owner.InListForm && this.ComboPopupInput) 
    {
      document.body.removeChild(this.ComboPopupInput);
      document.body.appendChild(this.ComboPopupInput);
    }
    //
    if (this.ComboPopup.parentNode != document.body || this.ComboPopup.nextSibling)
      document.body.appendChild(this.ComboPopup);
  }
  //
  // Nascondo temporaneamente il popup, lo mostro dopo aver fatto tutti i calcoli di posizionamento
  this.ComboPopup.style.visibility = "hidden";
  //
  // Se il mio owner e' un PCell che ha delle proprieta' dinamiche devo applicarle al VS
  if (this.Owner && this.Owner instanceof PCell && this.Owner.GetDynPropSign()!="|||-1|")
    this.Owner.ApplyDynPropToVisualStyle(this.VisualStyle);
  //
  // Applico lo stile al popup
  var backcol = this.VisualStyle.GetColor(4);
  if (backcol=="transparent")
    this.VisualStyle.SetColor("white", 4);
  var brd = this.VisualStyle.GetBorders(6);
  if (brd!=4)
    this.VisualStyle.SetBorderType(4, 6);
  // 
  // Non voglio applicare la maschera all'intero popup
  var oldMask = this.VisualStyle.Mask;
  this.VisualStyle.Mask = "";
  //
  this.VisualStyle.ApplyValueStyle(this.ComboPopup, false, false, false, false, false, false, false, null, false, false, false, true);
  //
  // Ripristino la maschera
  this.VisualStyle.Mask = oldMask;
  //
  if (backcol=="transparent")
    this.VisualStyle.SetColor("transparent", 4);
  if (brd!=4)
    this.VisualStyle.SetBorderType(brd, 6);
  //
  // Se sono in apertura (no update), rendo tutti gli item visibili
  if (!update)
  {
    this.OptionList.SetComboItemsVisible();
    //
    // Scelgo l'item da evidenziare
    if (this.SelItems.length > 0)
      this.HLItem = this.SelItems[0];
    else
      this.HLItem = this.OptionList.GetNextVisibleItem();
  }
  //
  // Popolo il popup con gli option
  this.OptionList.RealizeCombo(tbody, this.Identifier, this.VisualStyle, this.SelItems, this.MultiSel, this.HLItem, this.OptionList && !this.ListOwner);
  //
  var n = this.OptionList.ItemList.length;
  for (var i=0;i<n;i++)
  {
    var optlist = this.OptionList.ItemList[i];
    if (optlist.Image != "")
    {
      // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
      if (RD3_Glb.Adapt4Retina(this.Identifier, optlist.Image, 43, i))
      {
        // Nel caso debba retinare, nascondo per un attimo le immagini grandi 
        // per poi mostrarle quando saranno ridimensionate
        var it = optlist.TR;
        if (it && it.childNodes.length >= 1)
        {
          var itImg = it.childNodes[1].firstChild;
          if (itImg)
            itImg.style.display = "none";
        }
      }
    }
  }
  //
  // Se la combo mostra il valore, creo un input fittizio tramite il quale posso fare
  // l'editing con autocomplete
  if (!update && (this.ShowValue || RD3_Glb.IsMobile()))
  {
    // Se non l'ho ancora creato, lo faccio ora
    if (!this.ComboPopupInput)
    {
      this.ComboPopupInput = document.createElement("INPUT");
      RD3_Glb.AutocompleteOff(this.ComboPopupInput);
      if (RD3_Glb.IsMobile())
      {
        this.ComboPopupInput.className = "combo-search";
        this.ComboPopupInput.setAttribute("id", this.Identifier+":txt");
        this.ComboPopupInput.placeholder = ClientMessages.MOB_SEARCH_HINT;
        //
        if (this.IsPopOver() && !this.ListOwner)
        {
          this.ComboSearchArea = document.createElement("DIV");
          this.ComboSearchArea.className = "combo-search-area";
          this.ComboSearchArea.appendChild(this.ComboPopupInput);
          this.ComboPopup.insertBefore(this.ComboSearchArea, this.ComboPopup.firstChild);
        }
        else
          this.ComboPopup.insertBefore(this.ComboPopupInput, this.ComboPopup.firstChild);
      }
      else
      {
        this.ComboPopupInput.className = "combo-input";
        this.ComboPopupInput.style.height = (this.Height - (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? -6 : 3) : 5)) + "px";                  // Alto come l'input
        if (this.Owner && this.Owner.InListForm)
          this.ComboPopupInput.style.height = this.Height + "px";
        document.body.appendChild(this.ComboPopupInput);
        //
        // Applico lo stile all'input fittizio
        this.VisualStyle.ApplyValueStyle(this.ComboPopupInput);
        //
        // Il bordo e' 2px come se fosse una cella attiva
        this.ComboPopupInput.style.borderWidth = "2px";
        if (this.Owner.SetZIndex && this.Owner.InListForm)
          this.Owner.SetZIndex(this.ComboPopupInput);
      }
      //
      // Attacco gli eventi da usare per la multi-selezione
      this.ComboPopupInput.onkeyup = function(ev) { parentContext.OnKeyUp(ev); };
      //
      if (RD3_Glb.IsAndroid())
      {
        var md = function(ev) { parentContext.OnSearchMouseDown(ev); };
        if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
          this.ComboPopupInput.addEventListener("touchstart", md, false);
        else if (document.addEventListener)
          this.ComboPopupInput.addEventListener("mousedown", md, false);
        else
          this.ComboPopupInput.attachEvent("onmousedown", md);
      }
      //
      // Su iOS7 non si rimette a posto lo scroll quando la tastiera e' chiusa
      if (RD3_Glb.IsMobile() && (RD3_Glb.IsIphone(7) || RD3_Glb.IsIpad(7)))
        this.ComboPopupInput.onblur = function(ev) { document.body.scrollTop = 0; };
    }
    else
    {
      // Lo mostro e copio il valore corrente
      this.ComboPopupInput.style.display = "";
      //
      if (this.ComboSearchArea)
        this.ComboSearchArea.style.display = "";
      //
      // Se la combo non era aperta, svuoto il valore. Non lo faccio se e' un auto-lookup
      if (!this.IsOpen && this.ListOwner)
        this.ComboPopupInput.value = "";
    }
    //
    if (!RD3_Glb.IsMobile())
    {
      // Aggiorno il contenuto dell'input fittizio
      this.ComboPopupInput.value = this.GetComboFinalName(false);
      //
      // Memorizzo il testo originale presente nell'input (per gestire bene il KeyUp)
      this.PreviousInputText = this.ComboPopupInput.value;
    }
    else
    {
       if (!RD3_Glb.IsTouch() && this.Writable)
        window.setTimeout("document.getElementById('"+this.ComboPopupInput.id+"').focus()",500);
    }
  }
  //
  // Se il mio owner e' un PCell che ha delle proprieta' dinamiche devo ripulire il VS
  if (this.Owner && this.Owner instanceof PCell && this.Owner.GetDynPropSign()!="|||-1|")
    this.Owner.CleanVisualStyle(this.VisualStyle);
  //
  // Posiziono il popup con ridimensionamento
  if (!this.AnimatingCombo && !RD3_Glb.IsMobile())
    this.AdaptPopupLayout(true);
  //
  // Mi assicuro che l'item selezionato sia visibile
  this.EnsureItemVisible();
  //
  // Se l'input fake e' visibile
  if (this.ComboPopupInput && this.ComboPopupInput.style.display=="" && !RD3_Glb.IsMobile())
  {
    // Lo fuoco
    if (this.Writable)
      this.ComboPopupInput.focus();
    //
    // Alla fine dell'apertura della combo su !IE il fuoco viene ridato all'activeElement, che pero' e' l'input nascosto.. per correggere il problema sostituiamo
    // l'activeElement con quello corretto
    if (!RD3_Glb.IsIE(10, false))
      RD3_KBManager.ActiveElement = this.ComboPopupInput;
    //
    // Se ho appena aperto, seleziono tutto il testo
    if (!update)
      this.SelectAllDummyInpText();
  }
  //
  // Segnalo la combo aperta (usata poi anche dal pannello per aggiornare la toolbar)
  RD3_DDManager.OpenCombo = this;
  //
  // Ora se la combo non e' gia' aperta la faccio aprire con l'animazione
  if (!this.IsOpen)
  {
    if (RD3_Glb.IsMobile())
    {
      if (this.IsPopOver())
      {
        this.ComboPopup.style.visibility = "";
        this.ShowPopOverCombo(true);
      }
      else
      {
        this.ShowMobileCombo(true);
      }
    }
    else
    {
      this.ComboPopup.style.visibility = "";
      var fx = new GFX("combo", true, this, RD3_Glb.IsFirefox(3));
      RD3_GFXManager.AddEffect(fx);
    }
  }
  else
  {
    this.ComboPopup.style.visibility = "";
  }
  //
  // Questa e' la combo aperta
  this.IsOpen = true;
}

// ***************************************************
// Chiude la combo (il popup)
// ***************************************************
IDCombo.prototype.Close = function(undo, skipFocus)
{
  // Semaforo di chiusura per combo mobile
  if (RD3_Glb.IsMobile() && this.ClosingCombo)
    return;
  //
  // Se la combo era aperta
  if (this.ComboPopup && this.ComboPopup.style.display=="")
  {
    // Chiudiamo la combo con l'animazione..
    if (RD3_Glb.IsMobile())
    {
      // Tolgo il fuoco dall'input
      if (this.ComboPopupInput)
        this.ComboPopupInput.blur();
      //
      if (!this.IsPopOver())
      {
        this.ClosingCombo = true;
        this.ShowMobileCombo(false);
      }
      else
      {
        this.ShowPopOverCombo(false);
      }
    }
    else
    {
      var fx = new GFX("combo", false, this, RD3_Glb.IsFirefox(3));
      RD3_GFXManager.AddEffect(fx);
    }
  }
  //
  // Se il dummy input era visibile
  if (this.ComboPopupInput && !RD3_Glb.IsMobile())
    this.ComboPopupInput.style.display = "none";
  //
  // Se il timer e' in esecuzione, lo fermo
  if (this.ComboPopupTimer!=0)
  {
    window.clearInterval(this.ComboPopupTimer);
    this.ComboPopupTimer = 0;
  }
  //
  // Confermo il valore all'Owner
  if (undo)
  {
    // Cerco se nella lista c'e', per caso, il valore originale della combo
    var foundPrec = false;
    if (this.OptionList && !this.ListOwner)
    {
      var list = this.OptionList.ItemList;
      var last = list[list.length-1];
      if (last && last.Value=="LKEPREC")
      {
        this.OriginalText = (this.ShowValue ? last.Value : last.Name);
        foundPrec = true;
      }
      //
      // Non e' detto che LKEPREC sia sempre l'utimo, potrebbe anche essere il penultimo..
      last = list[list.length - 2];
      if (last && last.Value == "LKEPREC")
      {
        this.OriginalText = (this.ShowValue ? last.Value : last.Name);
        foundPrec = true;
      }
    }
    //
    // Ripristino il valore presente al momento dell'apertura
    // Se ho un testo originale uso quello, altrimenti uso il testo vuoto
    // Se sono MultiSel e chiusa voglio acquisire comunque il valore
    if (!this.MultiSel || !this.IsOpen) 
    {
      // Purtroppo se scrivo qualcosa this.OriginalText viene modificato quindi non lo posso usare per annullare il valore e tornare allo stato precedente alla chiusura
      // pero' se sono LKE e ho una lista ma non un valore precedente significa che in origine la combo era vuota,
      // quindi posso usare "" come valore. in caso contrario posso solo fidarmi di OriginalText
      if (this.OptionList && !this.ListOwner && !foundPrec)
        this.SetText("", this.ShowValue);
      else
        this.SetText(this.OriginalText!=undefined ? this.OriginalText : "", this.ShowValue);
    }
  }
  else
  {
    // Se ho un item selezionato lo valido
    if (this.SelItems.length>0)
    {
      // Aggiorno il valore dell'input
      this.SetComboValue(this.GetComboFinalName(this.ShowValue));
      //
      // Memorizzo il testo attualmente presente nell'input (per gestire bene il KeyUp)
      this.PreviousInputText = this.ComboInput.value;
      //
      // Memorizzo il testo originale presente nell'input
      this.OriginalText = this.ComboInput.value;
    }
    //
    // Se non ho un item selezionato
    if (this.SelItems.length==0)
    {
      // Non c'e' un item selezionato: se c'e' del testo dentro all'input vedo se la combo permette testo libero.
      // Se non lo permette, ripristino il valore originale (se c'e')
      if (this.ComboInput.value!="" && !this.AllowFreeText)
        this.SetText(this.OriginalText!=undefined ? this.OriginalText : "", this.ShowValue);
      //
      // Se non c'e' un valore ma la combo non ammette il valore opzionale, ripristino il valore originale
      if (this.ComboInput.value=="" && !this.IsOptional)
        this.SetText(this.OriginalText!=undefined ? this.OriginalText : "", this.ShowValue);
    }
  }
  //
  // Aggiorno l'immagine
  this.UpdateImage();
  //
  // Do' il fuoco all'input, se non sono al tocco
  if (!RD3_Glb.IsTouch() && this.Writable && !skipFocus)
    this.ComboInput.focus();
  //
  // Ora la combo non e' piu' aperta
  RD3_DDManager.OpenCombo = null;
  this.IsOpen = false;
  //
  // Informo l'owner che e' cambiato il valore
  if (this.Owner.OnComboChange)
  {
    // Se non sono list-owner e chiudo la combo, devo comunque informare il server di quel che ho fatto/selezionato
    if (!this.ListOwner)
      this.Owner.OnComboChange(true, true);
    else
      this.Owner.OnComboChange(!undo);
  }
  //
  if (this.Owner.OnMultipleComboChange)
  {
    this.Owner.OnMultipleComboChange(this);
  }
  //
  // Se il primo item selezionato ha uno stile lo applico
  // Devo aggiornare il VS di PValue siccome e' lui che comanda
  if (this.SelItems.length>0 && this.SelItems[0].VisualStyle && this.Owner.PValue)
  {
    this.Owner.PValue.SetVisualStyle(this.SelItems[0].VisualStyle);
    this.Owner.PValue.UpdateScreen();
  }
}

// ***************************************************
// Adatta le dimensioni del popup e lo posiziona al posto giusto
// ***************************************************
IDCombo.prototype.AdaptPopupLayout = function(resize)
{
  // Posiziono il popup
  var firstobj = this.ComboInput;
  if (this.RightAlign && this.ComboActivator && this.ComboActivator.style.display=="")
    firstobj = this.ComboActivator;
  //
  // Se sono la combo di una cella di edit in lista mi devo mettere sopra l'overlay
  if (this.Owner && this.Owner.InListForm) {
    firstobj = this.ComboInput.parentNode;
  }
  //
  var x = RD3_Glb.GetScreenLeft(firstobj);
  var y = RD3_Glb.GetScreenTop(firstobj);
  this.ComboPopup.style.top = (y + this.Height + (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? 7 : -2) : 0)) + "px";
  this.ComboPopup.style.left = (x-2 + (this.Owner instanceof BookSpan || RD3_ServerParams.Theme.startsWith("zen") ? 1 : 0)) + "px";
  //
  // Se mi e' stato chiesto di ridimensionare
  if (resize)
  {
    // Conservo lo scrollTop
    var oldtop = this.ComboPopup.scrollTop;
    //
    // Calcolo l'altezza giusta (Min-Max)
    this.ComboPopup.style.height = "";
    var popuph = this.ComboPopup.clientHeight;
    if (popuph < RD3_ClientParams.ComboPopupMinHeight)
      popuph = RD3_ClientParams.ComboPopupMinHeight;
    else if (popuph>RD3_ClientParams.ComboPopupMaxHeight)
      popuph = RD3_ClientParams.ComboPopupMaxHeight;
    this.ComboPopup.style.height = popuph + "px";
    //
    // Calcolo la larghezza giusta se non e' visibile l'input fittizio
    this.ComboPopup.firstChild.width = "";    // Sto misurando, la tabella NON deve spingere!
    this.ComboPopup.style.width = "";
    var popupw = this.ComboPopup.scrollWidth + (this.ComboPopup.offsetWidth-this.ComboPopup.clientWidth);
    //
    // Se la combo e' piu' stretta del campo, la faccio larga come il campo
    if (popupw < this.Width)
      popupw = this.Width + (RD3_ServerParams.Theme.startsWith("zen") ? (this.Owner.InList ? 7 : 1) : 0);
    this.ComboPopup.style.width = popupw + "px";
    this.ComboPopup.firstChild.width = "100%";    // La tabella deve spingere!
    //
    // Su IE ci possono essere dei problemi perche' non si tiene conto della scrollbar
    // allora rifaccio il calcolo e tutto va a posto
    if (RD3_Glb.IsIE() && popupw>this.Width && !RD3_ServerParams.Theme.startsWith("zen"))
    {
      var popupw = this.ComboPopup.scrollWidth + (this.ComboPopup.offsetWidth-this.ComboPopup.clientWidth);
      this.ComboPopup.style.width = popupw + "px";
    }
    //
    this.ComboPopup.scrollTop = oldtop;
    //
    // Se c'e' l'input dummy, ridimensiono anche lui
    if (this.ComboPopupInput && this.ComboPopupInput.style.display=="")
      this.ComboPopupInput.style.width = (this.ComboPopup.offsetWidth-8) + "px";   // Largo come il popup
  }
  //
  // Se il popup esce da sotto, lo mostro sopra
  if (y+this.Height+this.ComboPopup.offsetHeight > document.body.clientHeight)
  {
    this.ComboPopup.style.top = (y-this.ComboPopup.offsetHeight-(RD3_ServerParams.Theme.startsWith("zen") ? 1 : 2)) + "px";
    this.ComboUpper = true;
  }
  else
  {
    this.ComboUpper = false;
  }
  //
  // Devo controllare se sono finito fuori dallo schermo
  if (this.ComboPopup.offsetTop<0)
  {
    // Se sono finito fuori schermo metto il top a 0 e recupero sull'altezza
    var delta = this.ComboPopup.offsetTop;            // Valore <0
    this.ComboPopup.style.top = "0px";
    //
    // Per sicurezza verifico che non sia troppo piccolo
    var newh = this.ComboPopup.offsetHeight + delta;
    if (newh < RD3_ClientParams.ComboPopupMinHeight)
      newh = RD3_ClientParams.ComboPopupMinHeight;
    //
    this.ComboPopup.style.height = newh + "px";
  }
  //
  // Se sono finito fuori dallo schermo in larghezza lo sposto un po' piu' a sinistra
  if (this.ComboPopup.offsetLeft + this.ComboPopup.offsetWidth > RD3_DesktopManager.WebEntryPoint.WepBox.offsetWidth)
    this.ComboPopup.style.left = Math.max(0, RD3_DesktopManager.WebEntryPoint.WepBox.offsetWidth - this.ComboPopup.offsetWidth) + "px";
  //
  // Se c'e' l'input dummy, lo posiziono
  if (this.ComboPopupInput && this.ComboPopupInput.style.display=="")
  {
    this.ComboPopupInput.style.left = this.ComboPopup.style.left;                // Dove inizia il popup
    this.ComboPopupInput.style.top = (y-2) + "px";                               // Si sovrappone all'input
  }
}


// *********************************************************
// E' stata appena caricata un'immagine del popup, devo aggiornare le dimensioni!
// *********************************************************
IDCombo.prototype.OnComboImageLoaded = function()
{
  // Se sto animando, lo fara' il sistema alla fine dell'animazione
  if (!RD3_Glb.IsMobile() && !RD3_GFXManager.Animating())
    this.AdaptPopupLayout(true);
}


// ******************************************************************
// Gestione Hilight
// ******************************************************************
IDCombo.prototype.OnOptionMouseOver = function(ev, idxs)
{
  if (this.OptionList)
    this.HiligthItem(this.OptionList.ItemList[parseInt(idxs)]);
}
IDCombo.prototype.OnOptionMouseOut = function(ev, idxs)
{
  if (this.OptionList && !this.MultiSel)
    this.HiligthItem();
}

IDCombo.prototype.HiligthItem = function(item)
{
  if (this.OptionList)
  {
    if (this.HLItem)
      RD3_Glb.RemoveClass(this.HLItem.TR, "combo-option-hiligth");
    //
    this.HLItem = item;
    if (!this.HLItem && this.MultiSel)
      this.HLItem = this.OptionList.ItemList[0];
    //
    if (this.HLItem)
      RD3_Glb.AddClass(this.HLItem.TR, "combo-option-hiligth");
  }
}

// ******************************************************************
// Click su una opzione
// ******************************************************************
IDCombo.prototype.OnOptionClick = function(ev, idxs)
{
  // Cerco l'opzione selezionata
  var sel = this.OptionList.ItemList[parseInt(idxs)];
  //
  // Se e' abilitata
  if (sel && sel.Enabled)
  {
    // Recupero l'oggetto che e' stato cliccato
    var checkObj = (window.event)?window.event.srcElement:ev.target;
    //
    // Se ho cliccato su un TD
    if (checkObj.tagName == "TD")
    {
      // Passo la palla all'eventuale check in esso contenuto
      checkObj = checkObj.childNodes[0];
      //
      // Cambio lo stato del check
      if (checkObj)
        checkObj.checked = !checkObj.checked;
    }
    //
    // Se e' stato cliccato un check di opzione
    if (checkObj && checkObj.className == "combo-option-check")
    {
      // Rido' il fuoco all'input per poter continuare a scrivere
      if (this.Writable)
      {
        if (this.ComboPopupInput)
          this.ComboPopupInput.focus();
        else
          this.ComboInput.focus();
      }
      //
      this.OnOptionCheck(sel, checkObj.checked);
    }
    else
    {
      // la seleziono e chiudo il popup
      this.SelItems = new Array();
      this.SelItems.push(sel);
      //
      // Ho scelto un valore non devo piu' svuotarmi
      this.DeferEmpty = false;
      //
      this.Close();
    }
  }
}

// ***************************************************
// Gestione del cambio selezione di un opzione
// ***************************************************
IDCombo.prototype.OnOptionCheck = function(item, checked)
{
  if (checked)
  {
    // Se era selezionata la riga vuota o LKEPREC ... la tolgo
    if (this.SelItems.length == 1 && (this.SelItems[0].Value == "" || (this.OptionList && !this.ListOwner) && this.SelItems[0].Value == "LKEPREC"))
    {
      RD3_Glb.RemoveClass(this.SelItems[0].TR, "combo-option-selected");
      this.SelItems[0].TR.style.backgroundColor = "";
      this.SelItems = new Array();
    }
    //
    // Aggiungo l'item tra quelli selezionati
    this.SelItems.push(item);
    //
    // Aggiungo lo stile "selezionato"
    // ma non se l'item e' vuoto
    if (!this.MultiSel || item.Value!="")
    {
      RD3_Glb.AddClass(item.TR, "combo-option-selected");
      item.TR.style.backgroundColor = this.VisualStyle.GetColor(9); // VISCLR_HILIGHT
    }
  }
  else
  {
    // Rimuovo lo stile "selezionato"
    RD3_Glb.RemoveClass(item.TR, "combo-option-selected");
    item.TR.style.backgroundColor = "";
    //
    // Rimuovo l'item da quelli selezionati
    for (var i=0; i<this.SelItems.length; i++)
    {
      if (this.SelItems[i] == item)
      {
        this.SelItems.splice(i,1);
        break;
      }
    }
    //
    // Se non c'e' piu' nessun item selezionato ...
    if (this.SelItems.length == 0)
    {
      // seleziono l'opzione vuota, se c'e'
      var empty = this.OptionList.ItemList[0];
      if (empty.Name == "")
      {
        this.SelItems.push(empty);
        if (!this.MultiSel)
        {
          RD3_Glb.AddClass(empty.TR, "combo-option-selected");
          empty.TR.style.backgroundColor = this.VisualStyle.GetColor(9); // VISCLR_HILIGHT
        }
      }
    }        
  }
  //
  // Aggiorno il valore
  if (this.ComboPopupInput)
    this.ComboPopupInput.value = this.GetComboFinalName(false);
  this.SetComboValue(this.GetComboFinalName(this.ShowValue));
}

// ***************************************************
// Gestione mouse-down con combo aperta 
// (arriva da DD_Manager se vede una combo aperta)
// ***************************************************
IDCombo.prototype.OnMouseDown = function(ev)
{
  var x = (window.event)?window.event.clientX:ev.clientX;
  var y = (window.event)?window.event.clientY:ev.clientY;
  //
  // Vediamo se hanno cliccato su di me
  var firstobj = this.ComboInput;
  if (this.RightAlign && this.ComboActivator && this.ComboActivator.style.display=="")
    firstobj = this.ComboActivator;
  var l = RD3_Glb.GetScreenLeft(firstobj);
  var t = RD3_Glb.GetScreenTop(firstobj);
  var w = this.Width;
  var h = this.Height;
  //
  // Se c'e' un input-fake (ShowValue) piu' largo del campo devo usare la sua larghezza, non quella del campo
  if (this.ComboPopupInput && this.ComboPopupInput.style.display=="" && this.ComboPopupInput.offsetWidth > w)
    w = this.ComboPopupInput.offsetWidth;
  //
  // Se ho cliccato dentro all'input della combo non faccio nulla
  if ((x>=l && x<=l+w) && (y>=t && y<=t+h))
    return;
  //
  // Se la combo e' aperta, controllo se e' stato cliccato il popup
  if (this.ComboPopup)
  {
    l = RD3_Glb.GetScreenLeft(this.ComboPopup);
    t = RD3_Glb.GetScreenTop(this.ComboPopup);
    w = this.ComboPopup.offsetWidth;
    h = this.ComboPopup.clientHeight;
  }
  //
  // Se ho cliccato dentro al popup non faccio nulla
  if ((x>=l && x<=l+w) && (y>=t && y<=t+h))
    return;
  //
  // Gestisco click su caption form che non deve chiudere la combo,
  // ma solo tornare in cima
  if (RD3_Glb.IsMobile())
    return;
  //
  // Il click e' fuori dalla combo -> la chiudo rifuocando chi era attivo prima della CLOSE
  var focobj = (window.event)?window.event.srcElement:ev.target;
  //
  this.Close(this.MultiSel ? false : true);
  //
  if (focobj)
  {
    // Attenzione: l'oggetto potrebbe non essere fuocabile
    try
    {
      focobj.focus();
    }
    catch (ex) 
    {
      // Chissa' dove ha cliccato l'utente! Meglio ri-controllare il fuoco...
      RD3_KBManager.CheckFocus = true;
    }
  }
}


// ***************************************************
// Premuto un tasto (o nell'input o sul body con una combo aperta)
// ***************************************************
IDCombo.prototype.OnKeyDown = function(eve)
{
  if (window.event && eve==undefined)
    eve = window.event;
  //
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  //
  // UP(38), DOWN(40), PGUP(33), PGDOWN(34) senza ALT premuto
  if ((code==38 || code==40 || code==33 || code==34) && !eve.altKey)
  {
    // Se la combo e' aperta
    if (this.IsOpen)
    {
      // Se non ho la lista (capita moooolto di rado) meglio chiudere (con UNDO) e uscire
      if (!this.OptionList)
      {
        this.Close(true);
        return;
      }
      //
      // Seleziono il prossimo/precedente item
      var item = this.OptionList.GetNextVisibleItem((this.MultiSel ? this.HLItem : this.SelItems[0]), (code==38||code==33), (code==33||code==34))
      //
      if (this.MultiSel)
        this.HiligthItem(item);
      else
      {
        if (this.Owner && this.Owner instanceof PCell && this.Owner.GetDynPropSign()!="|||-1|")
          this.Owner.ApplyDynPropToVisualStyle(this.VisualStyle);
        //
        // Prima di selezionare il nuovo item deseleziono il precedente (ce n'e' uno solo) - e' OPEN quindi il TR c'e' .. 
        if (this.SelItems.length > 0)
        {
          this.SelItems[0].TR.style.backgroundColor = this.VisualStyle.GetColor(5); // VISCLR_BACKVALUE
          RD3_Glb.RemoveClass(this.SelItems[0].TR, "combo-option-selected");
        }
        //
        this.SelItems = new Array();
        this.SelItems.push(item);
        //
        // Adesso disegno l'item selezionato con la classe css giusta
        if (item.Value != "")
        {
          this.SelItems[0].TR.style.backgroundColor = this.VisualStyle.GetColor(9); // VISCLR_HILIGHT
          RD3_Glb.AddClass(this.SelItems[0].TR, "combo-option-selected");
        }
        //
        // Se il mio owner e' un PCell che ha delle proprieta' dinamiche devo ripulire il VS
        if (this.Owner && this.Owner instanceof PCell && this.Owner.GetDynPropSign()!="|||-1|")
          this.Owner.CleanVisualStyle(this.VisualStyle);
        //
        // Se c'e' un item selezionato e l'input fittizio e' aperto, aggiorno il valore
        if (this.SelItems.length>0 && this.ComboPopupInput && this.ComboPopupInput.style.display=="")
        {
          this.ComboPopupInput.value = this.SelItems[0].Name;
          //
          // Memorizzo il testo attualmente presente nell'input (per gestire bene il KeyUp)
          this.PreviousInputText = this.ComboPopupInput.value;
          //
          // Seleziono tutto il testo presente nell'input
          this.SelectAllDummyInpText();
        }
      }
      //
      // Garantisco che l'item sia visibile
      this.EnsureItemVisible();
      //
      // Ho gestito io le frecce: non lo deve fare il KBManager, se no farebbe un casino..
      RD3_Glb.StopEvent(eve);
      return;
    }
  }
  //
  // ENTER, TAB o ESC chiudono la combo
  if (code==13 || code==9 || code==27)
  {
    // Se la combo era aperta, ho gestito io i tasti: non lo deve fare il KBManager, se no farebbe un casino..
    if (this.IsOpen)
      RD3_Glb.StopEvent(eve);
    //
    if (this.IsOpen && code==13 && this.MultiSel && this.HLItem && (this.SelItems.length==0 || (this.SelItems.length==1 && this.SelItems[0].Value=="")))
      this.OnOptionCheck(this.HLItem, true);
    //
    // ESC = undo
    this.Close(code==27);
    //
    if (code == 9) 
    {
      // Ho premuto TAB e mio padre e' una PCell, faccio partire il messaggio al server
      if (this.Owner.OnComboChange)
      {
        // Se non sono list-owner e chiudo la combo, devo comunque informare il server di quel che ho fatto/selezionato
        if (!this.ListOwner)
          this.Owner.OnComboChange(true, true);
        else
          this.Owner.OnComboChange(!undo);
      }
      //
      // Se ci sono richieste in corso (il server sta rispondendo alle mie modifiche) non esco dalla combo, devo rimanere qui fino a che non risponde..
      if (RD3_DesktopManager.MessagePump.Requests.length > 0) 
        RD3_Glb.StopEvent(eve);
    }
    //
    return;
  }
  //
  // F2 o ALT-DOWN apre la combo se non e' gia' aperta
  if ((code==113 || (eve.altKey && code==40)) && !this.IsOpen && this.Enabled)
  {
    // Se premo F2, clicco sull'attivatore, altrimenti apro la combo
    if (code==113)
    {
      this.OnClickActivator();
    }
    else if (this.ListOwner)
    {
      // ALT-GIU' con lista e ListOwner : posso aprire la combo
      this.Open();
    }
    else if (this.Owner.OnComboActivatorClick)
    {
      // Se sono LKE (!ListOwner) la devo chiedere al server e quando arriva mi devo ricordare di aprire la combo
      // ( con un fake this.ActClicked )
      this.Owner.OnComboActivatorClick(true);
      this.ActClicked = true;
    }
    //
    // Ho gestito io le frecce: non lo deve fare il KBManager, se no farebbe un casino..
    RD3_Glb.StopEvent(eve);
    return;
  }
  //
  // Un qualunque altro tasto funzione chiude la combo e acquisisce il valoer
  if (((code>=114 && code<=123)||(code==112)) && this.IsOpen)
  {
    // Chiudiamo la combo acquisendo il valore
    this.Close();
    return;
  }
  //
  if (code==32 && this.IsOpen && this.MultiSel)
  {
    if (!this.HLItem)
      return;
    //
    // Recupero il check
    var check = this.HLItem.TR.childNodes[0].childNodes[0];
    if (!check)
      return;
    //
    check.checked = !check.checked;
    this.OnOptionCheck(this.HLItem, check.checked);
    //
    // Ho gestito io lo spazio: non lo deve fare il KBManager, se no farebbe un casino..
    RD3_Glb.StopEvent(eve);
    return; 
  }
}

// ***************************************************
// Premuto un tasto nell'input (ComboInput o ComboPopupInput)
// ***************************************************
IDCombo.prototype.OnKeyUp = function(eve)
{
  if (window.event && eve==undefined)
    eve = window.event;
  //
  // Se e' gia' stato gestito nel keyup
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var pf = this.Owner.ParentField;
  //
  // Alcuni tasti sono da gestire solo nel KEYDOWN (vedi sopra)
  if (code==38 || code==40 || code==33 || code==34)   // UP(38), DOWN(40), PGUP(33), PGDOWN(34) (navigano gli item della combo)
    return;    
  if (code==13 || code==9 || code==27)    // Enter, TAB, ESC (chiudono la combo)
    return;
  if (code>=112 && code<=123)   // Tasti funzione
    return;
  if (code==32 && this.IsOpen && this.MultiSel)   // attivazione check in combo multi-selezionabile
    return;
  //
  // Se arrivo dal ComboPopupInput, leggo da li' il valore
  var val = this.ComboInput.value;
  var dummyInp = (this.ComboPopupInput && this.ComboPopupInput.style.display=="");
  if (dummyInp)
    val = this.ComboPopupInput.value;
  //
  // Se non e' cambiato il valore non faccio nulla
  if (val == this.PreviousInputText)
    return;
  //
  if (RD3_Glb.IsMobile())
  {
    if (this.ComboPopupInput.value != "")
      RD3_Glb.AddClass(this.ComboPopupInput, "combo-search-deletable");
    else
      RD3_Glb.RemoveClass(this.ComboPopupInput, "combo-search-deletable");
  }
  //
  // Questo e' il valore corrente
  this.PreviousInputText = val;
  //
  // Non sono list owner... nessuna lista...
  if (!this.ListOwner)
  {
    //
    // Se sono mobile voglio tutta la lista!
    if (RD3_Glb.IsMobile() && val=="")
      val = "*";
    //
    this.OptionList = null;
    if (!this.MultiSel)
      this.SelItems = new Array();
    //
    // Indico che e' come se avessi cliccato sull'attivatore
    // Cosi' quando arrivera' la lista, la combo si apre
    this.ActClicked = true;
    //
    // Se il valore e' vuoto, chiudo la combo
    // Non la voglio chiudere se sono una combo in QBE: scrivo, premo canc ma voglio che rimanga aperta
    // Se sono in QBE (this.MultiSel) invece chiamo la Close se sono gia' chiusa, in questo caso voglio far acquisire subito il valore
    if (val=="")
    {
      this.OriginalText = "";
      if (!this.MultiSel || !this.IsOpen)
        this.Close(true);
      return;
    }
    // Nel caso QBECell LKE dobbiamo fare delle cose specifiche:
    // - se scrivi qualcosa va mandato un messaggio speciale al server per ottenere la lista
    // - se svuoti il campo deve rimanere la combo aperta (come in QBE), ma quando la chiudi deve svuotare il filtro
    if (this.Owner && this.Owner.ListQBECell) 
    {
      var ev = new IDEvent("qbecombo", this.Owner.ParentField.Identifier, null, RD3_Glb.EVENT_URGENT, this.Owner.ParentField.Identifier, val);
      return;
    }
  }
  //
  // Se non ho una lista informo solo l'owner della variazione del testo
  var superact = pf && pf.HasValueSource && pf.SuperActive && this.ComboInput.value!="";
  if (!this.OptionList || superact)
  {
    // Comunico la modifica del testo all'owner... cosi', magari, mi manda la lista
    if (this.Owner.OnComboChange)
    {
      var lo = this.ListOwner;
      if (superact)
        this.ListOwner = false;
      //
      if (!this.Owner.ListQBECell || (this.Owner.ListQBECell && val == ""))
        this.Owner.OnComboChange(true, this.IsOpen, true);
      //
      // Se e' una value source attiva inviare il cambiamento al server non basta, devo simulare il click sull'attivatore in modo da farmi mandare la lista
      if (superact || (this.Owner.ListQBECell && val != ""))
      {
        this.ListOwner = lo;
        //
        // Simulo un click sull'attivatore, in modo da farmi mandare la combo
        this.Owner.OnComboActivatorClick();
        this.ActClicked = true;
      }
    }
    //
    return;
  }
  //
  // Filtro gli item della combo usando il valore corrente
  this.OptionList.FilterComboItem(val, true);
  //
  // Se non ho un item selezionato o quello selezionato e' invisibile, ne cerco un altro
  if (this.SelItems.length==0 || !this.SelItems[0].Visible)
  {
    this.SelItems = new Array();
    this.HLItem = this.OptionList.GetNextVisibleItem(null);
    if (this.HLItem && !this.MultiSel)
      this.SelItems.push(this.HLItem);
  }
  //
  // Se non c'e' un valore e la combo e' opzionale
  if (val=="" && this.IsOptional)
  {
    // Se il primo item della combo ha proprio il valore vuoto, allora seleziono quello
    // altrimenti perdo la selezione
    this.SelItems = new Array();
    if (this.OptionList.ItemList[0].Name == "")
      this.SelItems.push(this.OptionList.ItemList[0]);
    //
    // Se lavoro in modalita' DUMMY-INPUT il testo vuoto vuol dire seleziona la prima riga dell'opzionalita'
    // Altrimenti la combo e' opzionale e non c'e' un valore... chiudo la combo
    if (dummyInp)
      this.Open(true);
    else
      this.Close();
  }
  else
  {
    // Aggiorno la combo
    this.Open(true);
  }
  //
  // Ora posso avvisare il mio owner
  if (this.Owner.OnComboChange)
    this.Owner.OnComboChange();
}


// ***************************************************
// Assicura che l'item indicato sia visibile, scrollando
// il popup se serve
// ***************************************************
IDCombo.prototype.EnsureItemVisible = function(idx)
{
  // Se non mi hanno fornito l'indice, uso quello dell'item selezionato
  if (idx==undefined)
    idx = this.OptionList.GetItemIndex(this.MultiSel ? this.HLItem : this.SelItems[0]);
  //
  // Chiedo alla lista di farlo
  this.OptionList.EnsureItemVisible(this.ComboPopup, idx);
}


// ***************************************************
// Assicura che il popup e l'input fake siano sempre
// posizionati correttamente
// ***************************************************
IDCombo.prototype.OnTimerTick = function()
{
  // Riposiziono il popup
  this.AdaptPopupLayout();
}


// ***************************************************
// Ritorna un clone della combo
// ***************************************************
IDCombo.prototype.Clone = function(owner)
{
  // Creo la nuova istanza
  var NewCombo = new IDCombo(owner);
  //
  // La battezzo e la inserisco nella mappa
  NewCombo.Identifier = "cmb:" + Math.floor(Math.random() * 1000000000);
  RD3_DesktopManager.ObjectMap.add(NewCombo.Identifier, NewCombo);
  //
  // Copio le proprieta'
  NewCombo.Left = this.Left;
  NewCombo.Top = this.Top;
  NewCombo.Width = this.Width;
  NewCombo.Height = this.Height;
  NewCombo.Enabled = this.Enabled;
  NewCombo.Visible = this.Visible;
  NewCombo.RightAlign = this.RightAlign;
  NewCombo.Clickable = this.Clickable;
  NewCombo.Tooltip = this.Tooltip;
  //
  NewCombo.ListOwner = this.ListOwner;
  NewCombo.ShowActivator = this.ShowActivator;
  NewCombo.IsOptional = this.IsOptional;
  NewCombo.AllowFreeText = this.AllowFreeText;
  NewCombo.ShowValue = this.ShowValue;
  NewCombo.ActImage = this.ActImage;
  NewCombo.ActWidth = this.ActWidth;
  NewCombo.ActEnaIfComboDis = this.ActEnaIfComboDis;
  NewCombo.VisualStyle = this.VisualStyle;
  NewCombo.OptionList = null;
  NewCombo.SelItem = null;
  NewCombo.PreviousInputText = this.PreviousInputText;
  NewCombo.OriginalText = this.OriginalText;
  NewCombo.MultiSel = this.MultiSel;
  NewCombo.HasWatermark = this.HasWatermark;
  NewCombo.UsePopover = this.UsePopover;
  NewCombo.Badge = this.Badge;
  NewCombo.ClassName = this.ClassName;
  //
  // E lo stato dei padding (per mobile)
  NewCombo.PaddingLeft = this.PaddingLeft;
  NewCombo.PaddingRight = this.PaddingRight;
  //
  // Clono l'input
  NewCombo.ComboInput = this.ComboInput.cloneNode(false);
  if (RD3_Glb.IsMobile())
    NewCombo.ComboInput.value = this.ComboInput.value;
  //
  // Aggiorno il valore di autocomplete, in modo da tenerlo spento
  RD3_Glb.AutocompleteOff(NewCombo.ComboInput);
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
  //
  // Fatto
  return NewCombo;
}


// *********************************************************
// Seleziona tutto il testo del dummy input
// *********************************************************
IDCombo.prototype.SelectAllDummyInpText = function()
{
  // Seleziono tutto il testo
  if (this.ComboPopupInput.createTextRange)
  {
    this.ComboPopupInput.createTextRange().select();
  }
  else
  {
    this.ComboPopupInput.selectionStart = 0;
    this.ComboPopupInput.selectionEnd = this.ComboPopupInput.value.length;
  }
}

// *********************************************************
// Imposta il tooltip
// *********************************************************
IDCombo.prototype.GetTooltip = function(tip, obj)
{
  if (obj == this.ComboImg || obj == this.ComboInput || obj == this.ComboActivator)
  {
    var tp = "";
    if (this.Tooltip != "")
      tp = this.Tooltip;
    else if (this.SelItems.length>0)
      tp = this.SelItems[0].Tooltip;
    //
    if (tp == "")
      return false;
    //
    if (this.Owner.GetTooltipTitle)
      tip.SetTitle(this.Owner.GetTooltipTitle());
    //
    // Imposto il tipo in base al tipo di errore dell'Owner
    if (this.Owner.ErrorType == 1)
      tip.SetStyle("error");
    else if (this.Owner.ErrorType == 2 || this.Owner.ErrorType == 3)
      tip.SetStyle("warning");
    //
    tip.SetText(tp);
    tip.SetAutoAnchor(true);
    tip.SetPosition(2);
    //
    return true;
  }
  //
  // Proviamo a chiederlo all'OptionList
  if (this.OptionList && this.OptionList.GetTooltipCombo(this.ComboPopup, tip, obj))
  {
    // Devo impostargli il title
    if (this.Owner.GetTooltipTitle)
      tip.SetTitle(this.Owner.GetTooltipTitle());
    return true;
  }
  //
  return false;
}


// *********************************************************
// Comunica alla combo che il mio testo e' "" ma non e' stato
// ancora svuotato l'input... occorrera' farlo non appena
// l'utente cambia cella
// *********************************************************
IDCombo.prototype.DeferEmptyCombo = function()
{
  this.DeferEmpty = true;
  //
  // Se la combo e' aperta la chiudo in modo "SOFT"
  if (this.IsOpen)
  {
    if (this.ComboPopup && this.ComboPopup.style.display=="")
    {
      // Chiudiamo la combo con l'animazione..
      var fx = new GFX("combo", false, this, RD3_Glb.IsFirefox(3));
      RD3_GFXManager.AddEffect(fx);
    }
    //
    // Se il timer e' in esecuzione, lo fermo
    if (this.ComboPopupTimer!=0)
    {
      window.clearInterval(this.ComboPopupTimer);
      this.ComboPopupTimer = 0;
    }
    //
    // Ora la combo non e' piu' aperta
    RD3_DDManager.OpenCombo = null;
    this.IsOpen = false;
  }
}

// ***********************************************
// Determina se deve essere mostrata solo l'icona
// ***********************************************
IDCombo.prototype.ShowDescription = function(vs)
{
  if (this.Owner.ParentField)
    return this.Owner.ParentField.ShowDescription(vs);
  //
  if (vs)
    return vs.ShowDescription();
  //
  return true;
}

// ***********************************************
// Aggiunge una classe custom all'input
// ***********************************************
IDCombo.prototype.SetClassName = function(cls)
{
  if (cls === this.ClassName)
    return;
  //
  // Rimuovo la classe precedente
  if (this.ClassName != "")
    RD3_Glb.RemoveClass2(this.ComboInput, this.ClassName);
  //
  // Applico la nuova classe proveniente dalla Cella o dallo Span
  this.ClassName = cls;
  if (this.ClassName && this.ClassName != "")
    RD3_Glb.AddClass(this.ComboInput, this.ClassName);
}

// ***********************************************
// Toglie il WaterMark dalla Combo
// ***********************************************
IDCombo.prototype.SetWatermark = function()
{
  if (this.HasWatermark)
    return;
  //
  this.HasWatermark = true;
  //
  RD3_Glb.AddClass(this.ComboInput, "panel-field-value-watermark");
}

// ***********************************************
// Toglie il WaterMark dalla Combo
// ***********************************************
IDCombo.prototype.RemoveWatermark = function()
{
  if (!this.HasWatermark)
    return;
  //
  this.HasWatermark = false;
  //
  RD3_Glb.RemoveClass(this.ComboInput, "panel-field-value-watermark");
}

// ********************************************************************************
// Eventi di tocco sul combo popup
// ********************************************************************************
IDCombo.prototype.OnTouchStart = function(e)
{ 
  // Inizio lo scrolling solo se uno un solo dito
  if (e.targetTouches.length != 1)
    return false;
  //
  e.preventDefault();
  //
  // Memorizzo la posizione
  this.TouchStartX = e.targetTouches[0].clientX;
  this.TouchStartY = e.targetTouches[0].clientY;
  this.TouchOrgX   = e.targetTouches[0].clientX;
  this.TouchOrgY   = e.targetTouches[0].clientY;
  //
  var obj = RD3_Glb.ElementFromPoint(this.TouchStartX, this.TouchStartY);
  while (obj && obj.tagName!="TR")
    obj = obj.parentNode;
  if (obj)
  {
    var p = obj.id.lastIndexOf(":");
    if (p>-1)
    {
      // Evidenzio la cella della combo toccata
      var idx = parseInt(obj.id.substring(p+1));
      this.OnOptionMouseOver(e, idx);
    }
  }
  //
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
  this.TouchTimes  = new Array();
  this.TouchPosY   = new Array();
  this.TouchPosX   = new Array();
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  //
  this.TouchMoved  = false; // Indica che il dito si e' mosso
  this.ClearTouchScrollTimer();
  //
  return false;
}

IDCombo.prototype.OnTouchMove = function(e)
{ 
  // Non era per me, continuo il giro
  if (this.TouchStartX==-1)
    return false;
  //
  // Prevent the browser from doing its default thing (scroll, zoom)
  e.preventDefault();
  //
  // Don't track motion when multiple touches are down in this element (that's a gesture)
  if (e.targetTouches.length != 1)
    return false;
  //
  var xd = e.targetTouches[0].clientX - this.TouchStartX;
  var yd = e.targetTouches[0].clientY - this.TouchStartY;
  var tt = new Date();
  //
  // Memorizzo la nuova posizione
  this.TouchStartX = e.targetTouches[0].clientX;
  this.TouchStartY = e.targetTouches[0].clientY;
  if (Math.abs(this.TouchStartX-this.TouchOrgX)>RD3_ClientParams.TouchMoveLimit || Math.abs(this.TouchStartY-this.TouchOrgY)>RD3_ClientParams.TouchMoveLimit)
  {
    this.TouchMoved = true;
    this.OnOptionMouseOut(e);
  }
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
  // Allora posso spostare il content box se avesse bisogno delle scrollbar
  this.ComboPopup.scrollLeft -= xd;
  this.ComboPopup.scrollTop -= yd;
  //
  return false;  
}

IDCombo.prototype.OnTouchEnd = function(e)
{ 
  // Non era per me, continuo il giro
  if (this.TouchStartX==-1)
    return false;
  //
  // Prevent the browser from doing its default thing (scroll, zoom)
  e.preventDefault();
  //
  // Stop tracking when the last finger is removed from this element
  if (e.targetTouches.length != 0 && e.changedTouches.length!=1)
    return false;
  //
  // Azione DD in corso, non posso agire io
  if (RD3_DDManager.IsDragging || RD3_DDManager.IsResizing)
    return false;    
  //
  // Simulo il click se non mi ero mosso.
  if (!this.TouchMoved) 
  {
    var sx = e.changedTouches[0].clientX;
    var sy = e.changedTouches[0].clientY;
    var doubletap = false;
    //
    // Tolgo evidenziazione
    this.OnOptionMouseOut(e);
    //
    // Vediamo se e' un singolo o doppio click
    if (new Date()-this.SingleTapTime<300 && Math.abs(sx-this.SingleTapX)<16 && Math.abs(sy-this.SingleTapY)<16)
    {
      doubletap = true;
      this.SingleTapTime = 0;
      this.SingleTapX = -100;
      this.SingleTapY = -100;
    }
    else
    {
      this.SingleTapTime = new Date();
      this.SingleTapX = sx;
      this.SingleTapY = sy;
    }
    //
    var theTarget = document.elementFromPoint(sx, sy);
    if (theTarget && theTarget.nodeType == 3) 
      theTarget = theTarget.parentNode;
    //
    var obj = null;
    var canact = true;
    //
    if (canact)
    {
      var theEvent = document.createEvent('MouseEvents');
      theEvent.initMouseEvent(doubletap?'dblclick':'click', true, true, window, 1, sx, sy, sx, sy);      
      theTarget.dispatchEvent(theEvent);
    }
  }
  else if (this.TouchTimes.length==3)
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
  this.TouchMoved = false;
  //
  return false;  
}


// ********************************************************************************
// Gestisce lo scroll via touch del pannello.
// v e' la velocita' di scroll in ms, il segno indica la direzione
// n e' il numero di volte che e' stata eseguita la funzione
// ********************************************************************************
IDCombo.prototype.TouchScrollTimer = function(dummy, ap)
{ 
  // Caso scrolling content box
  if (ap.length==3)
  {
    var vx = ap[0];
    var vy = ap[1];
    var n  = ap[2];
    //
    this.ComboPopup.scrollLeft += vx*10;
    this.ComboPopup.scrollTop += vy*10;
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
IDCombo.prototype.ClearTouchScrollTimer = function()
{
  if (this.TouchScrollTimerId>0)
  {
    window.clearTimeout(this.TouchScrollTimerId);
    this.TouchScrollTimerId=0;
    this.TouchScroll=0;
  }
}


// ********************************************************************************
// Imposta il valore del combo input (che puo' anche essere un DIV!)
// ********************************************************************************
IDCombo.prototype.SetComboValue = function(value)
{
  this.ComboInput.value = value;
  if (this.ComboInput.tagName=="DIV")
    this.ComboInput.textContent = value;
}


// ********************************************************************************
// Mostra la combo nel sistema mobile come pagina slide
// ********************************************************************************
IDCombo.prototype.ShowMobileCombo = function(fl)
{
  var parp = this.Owner.ParentField.ParentPanel;
  var pobj = this.GetObjToSlide(); // Oggetto da spostare
  var tb = this.GetToolbarToSlide(); // Toolbar da usare
  var parentContext = this;
  //
  if (!parp.Realized)
    return;
  //
  if (!this.ToolbarButtonCnt)
  {
    this.ToolbarButtonCnt = document.createElement("div");
    this.ToolbarButtonCnt.setAttribute("id", this.Identifier+":cnt");
    this.ToolbarButtonCnt.className = "panel-formlist-container";
    tb.insertBefore(this.ToolbarButtonCnt, tb.firstChild);
    //
    this.ToolbarButton = document.createElement("div");
    this.ToolbarButton.setAttribute("id", this.Identifier+":btn");
    this.ToolbarButton.className = "panel-toolbar-button panel-formlist-button";    
    this.ToolbarButton.onclick = function(ev) { parentContext.Close(ev); };
    //
    this.ToolbarButtonImg = document.createElement("div");
    this.ToolbarButtonImg.setAttribute("id", this.Identifier+":img");
    this.ToolbarButtonImg.className = "panel-formlist-arrow";
    this.ToolbarButtonImg.onclick = function(ev) { parentContext.Close(ev); };
    //
    this.ToolbarButtonCnt.appendChild(this.ToolbarButtonImg);
    this.ToolbarButtonCnt.appendChild(this.ToolbarButton);
  }
  //
  if (this.ToolbarButton.textContent == "")
  {
    var objt = (this.SlideForm()?parp.WebForm:parp);
    this.ToolbarButton.textContent = objt.Caption;
     objt.SetCaption(this.Owner.ParentField.FormHeader);
   }
  //
  RD3_Glb.SetTransitionProperty(pobj, "-webkit-transform");
  RD3_Glb.SetTransitionProperty(this.ComboPopup, "-webkit-transform");
  RD3_Glb.SetTransitionDuration(pobj, "0ms");
  RD3_Glb.SetTransitionDuration(this.ComboPopup, "0ms");
  RD3_Glb.SetTransitionTimingFunction(pobj, "ease");
  RD3_Glb.SetTransitionTimingFunction(this.ComboPopup, "ease");
  RD3_Glb.SetTransitionDuration(this.ToolbarButtonCnt, "0ms");
  //
  var yp = RD3_Glb.TranslateY(pobj);
  var yc = RD3_Glb.TranslateY(this.ComboPopup);
  //
  var pini = 0;
  var pfin = 0;
  var cini = 0;
  var cfin = 0;
  var btnini = 0;
  var btnfin = 0;
  var btnopini = 0;
  var btnopfin = 0;
  if (fl)
  {
    // Devo far apparire la combo
    pini = 0;
    pfin = -parp.ContentBox.offsetWidth;
    cini = parp.ContentBox.offsetWidth;
    cfin = 0;
    btnini = 200;
    btnopini = 0;
    btnfin = 0;
    btnopfin = 1;
  }
  else
  {
    // Devo tornare nel pannello
    pini = -parp.ContentBox.offsetWidth;
    pfin = 0;
    cini = 0;
    cfin = parp.ContentBox.offsetWidth;
    btnini = 0;
    btnopini = 1;
    btnfin = 200;
    btnopfin = 0;
  }
  //
  // Posiziono gli elementi usando il 3d
  RD3_Glb.SetTransform(pobj, "translate3d("+pini+"px,"+yp+"px,0px)");
  RD3_Glb.SetTransform(this.ComboPopup, "translate3d("+cini+"px,"+yc+"px,0px)");
  RD3_Glb.SetTransform(this.ToolbarButtonCnt, "translate3d("+btnini+"px,"+yc+"px,0px)");  
  this.ToolbarButtonCnt.style.opacity=btnopini;
  this.ToolbarButtonCnt.style.display = "";
  //
  this.ComboPopup.style.visibility = "";
  //
  // Dopo che ho sistemato gli oggetti nella tb, allora la sistemo per bene
  if (fl)
  {
    if (this.SlideForm())
      parp.WebForm.AdaptToolbarLayout();
    else
    {
      parp.UpdateToolbar();
      //
      if (RD3_Glb.IsQuadro())
      {
        // Su quadro devo forzare qui il left
        if (parp.CaptionTxt.offsetLeft < 44)
          parp.CaptionTxt.style.marginLeft = "44px";
      }
      //
      // Se il pannello ha la scrollbar mobile visibile la nascondo quando apro la combo
      if (parp.HasScrollbar && parp.PanelMode == RD3_Glb.PANEL_LIST)
        parp.ScrollBoxMobile.style.display = "none";
    }
    //
    if (parp && parp.IDScroll)
      parp.IDScroll.Enabled = false;
  }  
  else
  {
    if (this.IDScroll)
      this.IDScroll.Enabled = false;
    //
    // Se il pannello ha la scrollbar mobile visibile la mostro quando apro la combo
    if (!this.SlideForm() && parp.HasScrollbar && parp.PanelMode == RD3_Glb.PANEL_LIST)
      parp.ScrollBoxMobile.style.display = "";
  }
  //
  // Eseguo l'animazione
  var sc = "RD3_Glb.SetTransitionDuration(document.getElementById('"+ pobj.id+"'), '250ms');";
  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.ComboPopup.id+"'), '250ms');";  
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ pobj.id+"'), 'translate3d("+pfin+"px,"+yp+"px,0px)');";
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.ComboPopup.id+"'), 'translate3d("+cfin+"px,"+yc+"px,0px)');";
  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.ToolbarButtonCnt.id+"'), '250ms');";  
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.ToolbarButtonCnt.id+"'), 'translate3d("+btnfin+"px,0px,0px)');";
  sc += "document.getElementById('"+ this.ToolbarButtonCnt.id+"').style.opacity="+btnopfin+";";
  //
  if (!this.ea)
    this.ea = function(ev) { parentContext.OnEndAnimation(ev); };
  RD3_Glb.AddEndTransaction(this.ComboPopup, this.ea, false);
  window.setTimeout(sc,30);
}


// *******************************************************************
// Gestisce animazione combo mobile
// *******************************************************************
IDCombo.prototype.OnEndAnimation = function(ev) 
{
  if (RD3_Glb.GetTransitionDuration(this.ComboPopup)=="0ms")
    return;
  //
  this.ClosingCombo = false;
  var parp = this.Owner.ParentField.ParentPanel;
  var pobj = this.GetObjToSlide(); // Oggetto da spostare
  RD3_Glb.RemoveEndTransaction(this.ComboPopup, this.ea, false);
  RD3_Glb.SetTransitionProperty(this.ComboPopup, "");
  RD3_Glb.SetTransitionProperty(pobj, "");
  RD3_Glb.SetTransitionDuration(this.ComboPopup, "");
  RD3_Glb.SetTransitionDuration(pobj, "");
  if (!this.IsOpen)
  {
    this.ComboPopup.style.display = "none";
    this.ToolbarButtonCnt.style.display = "none";
    //
    var objt;
    if (this.SlideForm())
    {
      objt = parp.WebForm;
      parp.WebForm.AdaptToolbarLayout();
    }
    else
    {
      objt = parp;
      parp.UpdateToolbar();
    }
    objt.SetCaption(this.ToolbarButton.textContent);
    this.ToolbarButton.textContent = "";
  }
  //
  // E' bene creare una scrollbar, per poi distruggerla alla fine
  if (this.IDScroll)
  {
    this.IDScroll.Unrealize();
    this.IDScroll = null;
    if (parp && parp.IDScroll)
      parp.IDScroll.Enabled = true;
  }
  if (this.IsOpen)
  {
    this.IDScroll = new IDScroll(this.Identifier, this.ComboPopup, this.SlideForm()?this.CloneElem:parp.ContentBox, parp);
    if (parp && parp.IDScroll)
      parp.IDScroll.Enabled = false;
  }
  //
  if (!this.IsOpen)
  {
    // Tolgo evidenziazione da campo o riga
    this.Owner.ParentField.HiliteCombo(this.ComboInput,false);
    if (parp && parp.PanelMode==RD3_Glb.PANEL_LIST)
      parp.HiliteRow(0);
    //
    if (this.CloneElem)
      this.CloneElem.style.display = "none";
  }
}

// *******************************************************************
// Gestisce animazione combo mobile
// *******************************************************************
IDCombo.prototype.AdaptMobileCombo = function()
{
  var parp = this.Owner.ParentField.ParentPanel;
  var pobj = this.GetObjToSlide(); // Oggetto da spostare
  //
  var yp = RD3_Glb.TranslateY(pobj);
  var pfin = -parp.ContentBox.offsetWidth;
  RD3_Glb.SetTransform(pobj, "translate3d("+pfin+"px,"+yp+"px,0px)");
}

// ********************************************************************************
// La caption e' stata toccata dall'utente
// ********************************************************************************
IDCombo.prototype.OnTouchDown= function(evento)
{ 
  var obj = evento.target;
  //
  // Se ho cliccato sull'input, allora do il fuoco allo stesso
  if (obj==this.ComboPopupInput)
  {
    this.ComboPopupInput.focus();
    //
    this.OnSearchMouseDown(evento);
  }
  //
  // Evidenzio la riga della combo che e' stata toccata
  while (obj && obj.tagName!="TR")
    obj = obj.parentNode;
  if (obj)
  {
    this.HiliteObj = obj;
    RD3_Glb.AddClass(obj,"open-combo-hover");
  }
  //
  return true;
}


// ********************************************************************************
// La caption e' stata toccata dall'utente
// ********************************************************************************
IDCombo.prototype.OnTouchUp= function(evento, click)
{ 
  // Tolgo evidenziazione la riga della combo che e' stata toccata
  if (this.HiliteObj)
  {
    RD3_Glb.RemoveClass(this.HiliteObj,"open-combo-hover");
    this.HiliteObj = null;
  }
  //
  if (click)
  {
    // Chiudo ed acquisisco il valore
    var obj = evento.target ? evento.target : evento.srcElement;
    //
    if (obj == this.ComboPopupInput)
      return true;
    //
    while (obj && obj.id=="")
      obj = obj.parentNode;
    if (obj && obj.id)
    {
      var idx = parseInt(obj.id.substr(obj.id.lastIndexOf(":")+1),10);
      this.OnOptionClick(evento, idx);
    }
  }
  //
  return true;
}

IDCombo.prototype.OnSearchMouseDown= function(evento)
{ 
  var obj = evento.target;
  //
  // Se ho cliccato sull'input, allora do il fuoco allo stesso
  if (obj==this.ComboPopupInput)
  {
    if(RD3_Glb.HasClass(this.ComboPopupInput, "combo-search-deletable"))
    {
      var x = (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true)) ? evento.targetTouches[0].clientX : evento.clientX;
      var offs = x-(RD3_Glb.GetScreenLeft(this.ComboPopupInput, true)+this.ComboPopupInput.offsetWidth);
      if (offs<0 && offs >=-40)
      {
        // Prima di tutto svuotiamo la search
        this.ComboPopupInput.value = "";
        //
        // Lo lancio io perche' altrimenti non scatta
        this.OnKeyUp(evento);
      }
    }
  }
}

// ********************************************************************************
// Torna vero se la combo si deve aprire come popover
// ********************************************************************************
IDCombo.prototype.IsPopOver= function()
{ 
  return this.UsePopover;
}


// ********************************************************************************
// Apre la combo come popover
// ********************************************************************************
IDCombo.prototype.ShowPopOverCombo= function(flshow)
{
  if (!flshow)
  {
    // nascondo
    this.ComboPopover.Close();
    this.ComboPopup.style.display = "none";
  }
  else
  {
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    //
    var tbl = this.ComboPopup.firstChild;
    while (tbl && tbl.tagName!="TABLE")
      tbl = tbl.nextSibling;
    //
    if (!tbl && this.ComboTbl)
      tbl = this.ComboTbl;
    //
    // La combo deve sempre iniziare con il cerca non esposto
    if (!this.ListOwner)
      RD3_Glb.SetTransform(tbl, "translate3d(0px, 0px, 0px)");
    //
    var h = tbl.offsetHeight+44; // 44 = altezza caption popupframe
    if (h<88)
      h=88;
    if (h>(wep.offsetHeight-this.Height-44)/2)
      h = (wep.offsetHeight-this.Height-44)/2;
    //
    this.ComboPopup.style.setProperty("width","auto","important");
    tbl.style.setProperty("table-layout","auto","important");
    //
    var w = tbl.offsetWidth+30; // 10 = larghezza bordi popupframe - 20 : per disegnare bene la spunta
    //
    tbl.style.tableLayout = "";
    this.ComboPopup.style.width = "";
    //
    // Se non sono LKE devo nascondere l'input (lo faccio adesso perche' altrimenti sfaso i 
    // calcoli della larghezza della Combo)
    if (this.ListOwner && this.ComboSearchArea)
      this.ComboSearchArea.style.display = "none";
    if (this.ListOwner && this.ComboPopupInput)
      this.ComboPopupInput.style.display = "none";
    //
    if (w<54)
      w=54;
    if (w>wep.offsetWidth/2)
      w = wep.offsetWidth/2;
    if (RD3_Glb.IsSmartPhone())
    {
      w = wep.offsetWidth-2;
      h = tbl.offsetHeight+44;
      if (h>(wep.offsetHeight-44)*0.8)
        h = (wep.offsetHeight-44)*0.8;
    }
    //
    // Vediamo a chi mi devo attaccare
    var aobj = this.ComboInput;
    if (this.Owner instanceof BookSpan)
      aobj = this.Owner.ParentBox.BoxBox;
    //
    var p = new PopupFrame(null, this);
    p.Borders = RD3_Glb.BORDER_THIN;
    p.SetWidth(w);
    p.SetHeight(h);
    p.Centered = false;
    p.CanMove = false;
    p.AutoClose = true;
    p.ModalAnim = RD3_Glb.IsSmartPhone();
    p.Owner = this;
    p.AttachTo(aobj);
    p.Realize("-popover");
    //
    // Passo alla popover il tooltip della box come titolo
    if (this.Owner && this.Owner instanceof BookSpan)
      p.SetCaption(this.Owner.ParentBox.Tooltip);
    if (this.Owner && this.Owner instanceof PCell)
      p.SetCaption(this.Owner.ParentField.Header);
    //
    p.Host(null, this.ComboPopup, true, this.ListOwner ? 0 : 46);
    //
    RD3_DDManager.OpenPopup = p;
    p.Open();
    //
    this.ComboPopover = p;
  }
}


// ********************************************************************************
// Il popup e' stato chiuso!!!
// ********************************************************************************
IDCombo.prototype.OnAutoClosePopup= function(popup)
{
  this.Close();
  return false;
}


// ********************************************************************************
// Ritorna l'oggetto da spostare caso mobile
// ********************************************************************************
IDCombo.prototype.GetObjToSlide = function()
{
  var parp = this.Owner.ParentField.ParentPanel;
  var obj = parp.PanelMode==RD3_Glb.PANEL_LIST?parp.ListBox:parp.FormBox;
  //
  if (this.SlideForm())
    obj = parp.WebForm.FramesBox;
  //
  return obj;
}


// ********************************************************************************
// Ritorna vero se la combo sposta la form invece che il pannello
// ********************************************************************************
IDCombo.prototype.SlideForm = function()
{
  var parp = this.Owner.ParentField.ParentPanel;
  var parf = parp.WebForm;
  //
  if (parf.HasCaption())
    return true;
  else
    return false;
}


// ********************************************************************************
// Ritorna la toolbar in cui mostrare i bottoni caso mobile
// ********************************************************************************
IDCombo.prototype.GetToolbarToSlide = function()
{
  var parp = this.Owner.ParentField.ParentPanel;
  var parf = parp.WebForm;
  if (parf.HasCaption())
    return parf.CaptionBox;
  else
    return parp.ToolbarBox;
}

// ********************************************************************************
// Gestione Badge
// ********************************************************************************
IDCombo.prototype.SetBadge = function(val)
{
  this.Badge = val;
  //
  if (this.Badge == "")
  {
    if (this.ComboBadge != null && this.ComboBadge.parentNode)
      this.ComboBadge.parentNode.removeChild(this.ComboBadge);
    this.ComboBadge = null;
  }
  else
  {
    if (this.ComboBadge == null)
    {
      this.ComboBadge = document.createElement("div");
      this.ComboBadge.className = "badge-grey";
      this.ComboBadge.style.position = "absolute";
      //
      if (RD3_Glb.IsMobile())
        this.ComboBadge.style.marginTop = "6pt";
      //
      if (this.Owner.SetZIndex)
        this.Owner.SetZIndex(this.ComboBadge);
      this.ComboInput.parentElement.appendChild(this.ComboBadge);
    }
    //
    this.SetLeft(this.Left);
    this.SetTop(this.Top);
    //
    this.ComboBadge.innerHTML = this.Badge;
  }
  //
  // Se sono su mobile, adatto l'input
  if (RD3_Glb.IsMobile())
    this.AdaptMobileInput();
}

// ********************************************************************************
// Gestione padding (attivatore/badge)
// ********************************************************************************
IDCombo.prototype.AdaptMobileInput = function()
{
  // Se e' visibile l'attivatore o il badge, ellipso il testo
  if ((this.ComboActivator && this.ComboActivator.style.display=="") || this.Badge!="")
    this.ComboInput.style.textOverflow = "ellipsis";
  else
    this.ComboInput.style.textOverflow = "";
  //
  // Se non hanno ancora assegnato una width alla combo, non faccio altro
  if (!this.ComboInputW)
    return;
  //
  // Inoltre paddo per rendere inaccessibili le zone sotto all'attivatore/badge
  // Su mobile rendo inaccessibile anche la zona sotto l'attivatore
  var padLeft  = 0;
  var padRight = 0;
  if (this.ComboActivator && this.ComboActivator.style.display == "")
  {
    if (this.RightAlign)    // Combo allineata a destra, attivatore a sinistra
      padLeft = this.ActWidth;
    else
      padRight = this.ActWidth;
  }
  //
  if (this.ComboBadge != null)
  {
    var badgeW = RD3_Glb.GetBadgeWidth(this.Badge, "grey");

    if (this.ComboActivator && this.ComboActivator.style.display == "")
      padRight += badgeW + 12;
    else
    {
      // Ci sono solo io... Aumento il padding right per rendere inaccessibile il badge
      // (non paddo per tutto il badge dato che c'e' gia' il padding-right del campo che, comunque, io mantengo
      // e che quindi e' gia' incluso)
      padRight += badgeW - 4;
    }
  }
  //
  // Se la combo ha un'immagine, ne tengo conto
  if (RD3_Glb.IsMobile() && this.ComboImg && this.ComboImg.style.display == "")
    padLeft += RD3_ClientParams.ComboImageSize + 8;
  //
  // Do' un padding -> devo ridurre la larghezza per lasciare tutto inalterato
  var w = this.ComboInputW - (padLeft + padRight);
  //
  // Aggiungo il padding "standard" dello stile visuale (per non mangiarmelo)
  if (this.VisualStyle)
  {
    padLeft  += (this.VisualStyle.GetCustomPadding(2)*96/288); // fattore di conversione px/quarti di pt
    padRight += (this.VisualStyle.GetCustomPadding(4)*96/288);
  }
  //
  this.ComboInput.style.width = w + "px";
  //
  if (padLeft != this.PaddingLeft)
  {
    this.PaddingLeft = padLeft;
    this.ComboInput.style.paddingLeft  = padLeft + "px";
  }
  if (padRight != this.PaddingRight)
  {
    this.PaddingRight = padRight;
    this.ComboInput.style.paddingRight = padRight + "px";
  }
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
IDCombo.prototype.OnAdaptRetina = function(w, h, par)
{
  // Sono una combo chiusa
  if (par === undefined)
  {  
    if (this.ComboImg)
    {
      this.ComboImg.width = w;
      this.ComboImg.height = h;
      this.ComboImg.style.display = "";
      //
      // Devo riposizionare gli oggetti nella combo
      this.SetLeft(this.Left);
      this.SetTop(this.Top);
      this.SetWidth(this.Width);
      this.SetHeight(this.Height);
    }
  }
  else // Sono una combo aperta
  {
    var it = this.OptionList.ItemList[par].TR;
    if (it && it.childNodes.length >= 1)
    {
      var itImg = it.childNodes[1].firstChild;
      if (itImg)
      {
        itImg.width = w;
        itImg.height = h; 
        itImg.style.display = "";
      }
    }   
  }
}

IDCombo.prototype.SetWritable = function(w)
{
  this.Writable = w;
  //
  if (this.ComboInput)
  {
    if (this.Writable)
    {
      this.ComboInput.removeAttribute("readonly");
      if (!RD3_Glb.IsSafari())
       this.ComboInput.removeAttribute("disabled");
    }
    else
    {
      this.ComboInput.setAttribute("readonly",true);
      //
      // Su safari mettere il disabled rende il testo grigio..
      if (!RD3_Glb.IsSafari())
        this.ComboInput.setAttribute("disabled",true);
    }
  }
}
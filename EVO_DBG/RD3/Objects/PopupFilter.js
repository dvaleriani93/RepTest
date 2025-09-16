// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2018 Pro Gamma Srl - All rights reserved
//
// Classe PopupFilter: Implementa una finestra modale
// da utilizzare per filtrare un campo di lista
// Estende PopupFrame
// ************************************************

function PopupFilter(fld)
{
  this.ParentField = fld;       // Campo da filtrare
  this.Identifier = "POPPRE" + Math.floor(Math.random() * 100);  // Identificatore per gestire il click sul pulsante di chiusura 
                                                                 // (ci puo' essere un solo Msgbox attivo per volta, basterebbe anche una stringa fissa per identificatore)
  //
  // Elementi visuali della PopupPreview
  this.CloseButton = null;        // IMG che contiene il pulsante di chiusura
  this.CaptionTxt = null;         // SPAN che contiene il testo della caption
  this.PreviewFrame = null;       // IFrame che contiene il documento esterno
}

// Definisco l'estensione della classe
PopupFilter.prototype = new PopupFrame();

PopupFilter.FILTER_TYPE_CHAR = 1;
PopupFilter.FILTER_TYPE_NUMBER = 2;
PopupFilter.FILTER_TYPE_RADIO = 3;
PopupFilter.FILTER_TYPE_CHECK = 4;
PopupFilter.FILTER_TYPE_COMBO = 5;

PopupFilter.FILTER_VALUE = 1;
PopupFilter.FILTER_STARTS = 2;
PopupFilter.FILTER_ENDS = 3;
PopupFilter.FILTER_CONTAINS = 4;
PopupFilter.FILTER_DIFFERENT = 5;
PopupFilter.FILTER_MAJOR = 6;
PopupFilter.FILTER_MINOR = 7;
PopupFilter.FILTER_BEETWEEN = 8;
PopupFilter.FILTER_EMPTY = 9;
PopupFilter.FILTER_NOTEMPTY = 10;


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
PopupFilter.prototype.Realize = function(cls)
{
  this.Borders = RD3_ServerParams.Theme.startsWith("zen") ? RD3_Glb.BORDER_NONE : RD3_Glb.BORDER_THIN;
  this.Width = 400;
  this.Height = 400;
  this.Centered = false;
  this.HasCaption = false;
  this.CanMove = false;
  this.AutoClose = true;
  //
  // Chiamo la classe base
  PopupFrame.prototype.Realize.call(this, cls);
  //
  // Rendo trasparente l'overlay
  if (this.ModalBox) 
  {
    this.ModalBox.style.backgroundColor = "transparent";
    this.ModalBox.style.cursor = "pointer";
  }
  if (this.PopupBox)
    this.PopupBox.className += " filter-popup";
  if (this.ContentBox)
    this.ContentBox.className += " filter-popup";
  //
  this.SelectedFilters = this.ParentField.QBEFilter && !this.ParentField.LKE ? this.GetFilterFromQBE(this.ParentField.QBEFilter) : [];
  //  
  // Creo l'header del filtro con il nome del campo da cui deriva
  var popupHeaderContainer = document.createElement("DIV");
  popupHeaderContainer.className = "filter-header";
  //
  var sortHeaderField = document.createElement("SPAN");
  sortHeaderField.innerHTML = this.ParentField.Header;
  popupHeaderContainer.appendChild(sortHeaderField);
  //
  var closePopupImage = document.createElement("IMG");
  closePopupImage.src = RD3_ServerParams.Theme.startsWith("zen") ? RD3_Glb.GetImgSrc("images/cancel_sm.gif") : RD3_Glb.GetImgSrc("images/closef.gif");
  popupHeaderContainer.appendChild(closePopupImage);
  closePopupImage.onclick = function(ev) { _this.Close();};
  //
  this.ContentBox.appendChild(popupHeaderContainer);
  //
  if (this.ParentField.CanSort && this.ParentField.VisCanSort() && this.ParentField.ParentPanel.UseListQBE == RD3_Glb.PAN_QBEHEADER) 
  {
    this.RealizeSortFilter();
    //
    if (this.ParentField.ParentPanel.GroupingEnabled && this.ParentField.ParentPanel.ShowGroups) 
    {
      // Se il pannello sta raggruppando devo mostrare un nuovo controllo per gestire i ragguppamenti
      this.RealizeGroupFilter();
    }
  }
  //
  // I lookup semplici non permettono il filtro
  if (this.ParentField.QBEEnabled && (this.ParentField.IdxPanel <= 0 || (this.ParentField.IdxPanel > 0 && (this.ParentField.AutoLookup || this.ParentField.LKE))))
  {
    this.FilterArea = document.createElement("DIV");
    this.FilterArea.className = "filter-popup-area";
    //
    var ctrlType = this.ParentField.VisualStyle.GetContrType();
    var isCombo = this.ParentField.HasValueSource || this.ParentField.LKE || this.ParentField.ValueList || (this.ParentField.PValues.length >= 1 && this.ParentField.PValues[this.ParentField.ParentPanel.ActualPosition] && this.ParentField.PValues[this.ParentField.ParentPanel.ActualPosition].ValueList);
    //
    if (ctrlType === 4) {
      this.RealizeCheckFilter();
	    this.FilterArea.style.height = 80 + "px";
    }
    else if (ctrlType === 5) {
      this.RealizeRadioFilter();
	    this.FilterArea.style.height = 160 + "px";
    }
    else if (isCombo) {
      this.RealizeComboFilter();
	    this.ValueListArea.style.height = 160 + "px";
    }
    else {
      this.RealizeCharacterFilter();
      //
      // Gestisco l'altezza dinamica del popup
      if (this.SelectedFilters.length < 3) 
        this.FilterArea.style.height = ((this.SelectedFilters.length * 62) + 74) + "px";
    }
    if (isCombo || (ctrlType != 5 && ctrlType != 4)) {
      // All'apertura do' il fuoco al nuovo campo di filtro
      setTimeout(function () {
        var nw = document.getElementById("popup_filter_main_input");
        if (nw)
          nw.focus();
      }, 10);
    }
	  //
    this.ContentBox.appendChild(this.FilterArea);
    //
    // Ora creo i pulsanti del piede per filtrare/annullare
    var footerArea = document.createElement("DIV");
    footerArea.className = "filter-footer-area";
    var filterButton = document.createElement("BUTTON");
    filterButton.setAttribute("id","popup_filter_accept_button");
    filterButton.className = "filter-ok-button";
    filterButton.innerText = ClientMessages.FIL_DOFILTER;
    var clearButton = document.createElement("BUTTON");
    clearButton.className = "filter-clear-button";
    clearButton.innerText = ClientMessages.FIL_CLEARFILTER;
    //
    footerArea.appendChild(filterButton);
    footerArea.appendChild(clearButton);
    this.ContentBox.appendChild(footerArea);
    //
    // EVENTI
    var _this = this;
    filterButton.onclick = function () { _this.DoFilter(); };
    clearButton.onclick = function () { _this.ClearFilter(); };
  }
}


PopupFilter.prototype.AdaptLayout = function()
{
  // Calcolo le variazioni di dimensioni della FilterArea nel caso di filtri avanzati e combo LKE
  var delta;
  var oh;
  if (this.ParentField.LKE && this.FilterArea) 
  {
    var oh = this.FilterArea.oldHeight ? this.FilterArea.oldHeight : this.FilterArea.offsetHeight;
    this.FilterArea.oldHeight = this.FilterArea.offsetHeight;
    var delta =  oh - this.FilterArea.oldHeight;
  }
  //
  PopupFrame.prototype.AdaptLayout.call(this);
  //
  // Mi riadatto in base al contenuto
  this.ContentBox.style.setProperty("height", "auto", "important");
  var h = this.ContentBox.offsetHeight;
  this.ContentBox.style.height = "";
  this.SetHeight(h);
  //
  // Se sforo a destra devo rientrare
  if (this.Left+this.PopupBox.offsetWidth > document.body.offsetWidth)
    this.SetLeft(document.body.offsetWidth - this.PopupBox.offsetWidth - 10);
  //
  // Se sforo sotto provo a rientrare
  if (this.Top+this.PopupBox.offsetHeight > document.body.offsetHeight)
    this.SetTop(document.body.offsetHeight - this.PopupBox.offsetHeight - 10);
  //
  if (this.Top < 0)
    this.SetTop(10);
  //
  // Su IE potrei aver fatto scrollare il body per errore, provo a rimetterlo a posto
  if (RD3_Glb.IsIE()) 
  {
    document.body.scrollLeft = 0;
    document.body.scrollTop = 0;
  }
}


PopupFilter.prototype.RealizeSortFilter = function()
{
  var sortContainer = document.createElement("DIV");
  sortContainer.className = "filter-sort-area filter-card";
  //
  var sortCaption = document.createElement("DIV");
  sortCaption.className = "filter-sort-area-caption";
  sortCaption.innerText = ClientMessages.FIL_SORT_CAPTION;
  //
  var sortButtonsCnt = document.createElement("DIV");
  sortButtonsCnt.className = "filter-sort-buttons-container";
  //
  var ascBlock = document.createElement("DIV");
  ascBlock.className = "filter-sort-row";
  var ascImage = document.createElement("IMG");
  ascImage.src = RD3_Glb.GetImgSrc("images/sortup.gif");
  ascBlock.appendChild(ascImage);
  //
  var descBlock = document.createElement("DIV");
  descBlock.className = "filter-sort-row";
  var descImage = document.createElement("IMG");
  descImage.src = RD3_Glb.GetImgSrc("images/sortdn.gif");
  descBlock.appendChild(descImage);
  //
  var clearBlock = document.createElement("DIV");
  clearBlock.className = "filter-sort-row";
  var clearLabel = document.createElement("DIV");
  clearLabel.innerText = ClientMessages.FIL_SORT_CLEAR;
  clearBlock.appendChild(clearLabel);
  //
  if (this.ParentField.SortMode === 1 && this.ParentField.GroupMode == 0)
    descBlock.setAttribute("active", "");
  else if (this.ParentField.SortMode === -1 && this.ParentField.GroupMode == 0)
    ascBlock.setAttribute("active", "");
  else
    clearBlock.style.display = "none";
  //
  // Gestisco gli eventi
  var _this = this;
  ascBlock.onclick = function(ev) {
    // Invio il messaggio al server simulando il click sulla caption, forzando lo shift e YPos a 10 (lato server e' attivata
    // la gestione RD2 che sorta ascendente nel caso y<15)
    if (!ascBlock.getAttribute("active"))
    {  
      var ev = new IDEvent("clk", _this.ParentField.Identifier, ev, _this.ParentField.ClickEventDef, null, "cap");
      ev.YPos = 20;
      ev.ShiftPress = true;
    }
    _this.Close();
  };
  descBlock.onclick = function(ev) {
    if (!descBlock.getAttribute("active"))
    {  
      var ev = new IDEvent("clk", _this.ParentField.Identifier, ev, _this.ParentField.ClickEventDef, null, "cap");
      ev.YPos = 10;
      ev.ShiftPress = true;
    }
    _this.Close();
  };
  clearBlock.onclick = function(ev) {
    if (clearBlock.getAttribute("disabled") != "true")
    {  
      var ev = new IDEvent("clk", _this.ParentField.Identifier, ev, _this.ParentField.ClickEventDef, null, "cap");
      ev.CtrlPress = true;
      ev.ShiftPress = true;
    }
    _this.Close();
  };
  //
  sortContainer.appendChild(sortCaption);
  sortButtonsCnt.appendChild(ascBlock);
  sortButtonsCnt.appendChild(descBlock);
  sortButtonsCnt.appendChild(clearBlock);
  sortContainer.appendChild(sortButtonsCnt);
  this.ContentBox.appendChild(sortContainer);
}

PopupFilter.prototype.RealizeGroupFilter = function()
{
  var groupContainer = document.createElement("DIV");
  groupContainer.className = "filter-sort-area filter-card";
  //
  var groupCaption = document.createElement("DIV");
  groupCaption.className = "filter-sort-area-caption";
  groupCaption.innerText = ClientMessages.FIL_GROUP_CAPTION;
  //
  var groupButtonsCnt = document.createElement("DIV");
  groupButtonsCnt.className = "filter-sort-buttons-container";
  //
  var groupBlock = document.createElement("DIV");
  groupBlock.className = "filter-sort-row filter-group-row";
  var groupImage = document.createElement("IMG");
  groupImage.src = RD3_Glb.GetImgSrc("images/sortup.gif");
  groupBlock.appendChild(groupImage);
  //
  var groupDescBlock = document.createElement("DIV");
  groupDescBlock.className = "filter-sort-row filter-group-row";
  var groupDescImage = document.createElement("IMG");
  groupDescImage.src = RD3_Glb.GetImgSrc("images/sortdn.gif");
  groupDescBlock.appendChild(groupDescImage);
  //
  var degroupBlock = document.createElement("DIV");
  degroupBlock.className = "filter-sort-row filter-group-row";
  var degroupLabel = document.createElement("DIV");
  degroupLabel.innerText = ClientMessages.FIL_DEGROUP_LABEL;
  degroupBlock.appendChild(degroupLabel);
  //
  if (this.ParentField.SortMode === 1 && this.ParentField.GroupMode == 1)
    groupDescBlock.setAttribute("active", "");
  else if (this.ParentField.SortMode === -1 && this.ParentField.GroupMode == -1)
    groupBlock.setAttribute("active", "");
  else if (this.ParentField.GroupMode == 0)
    degroupBlock.setAttribute("disabled","true");
  //
  var _this = this;
  groupBlock.onclick = function (ev) {    
    if (!this.getAttribute("active"))
    { 
      var ev = new IDEvent("clk", _this.ParentField.Identifier, ev, _this.ParentField.ClickEventDef, null, "cap");
      ev.YPos = 1;
      ev.ShiftPress = true;
    }
    _this.Close();
  };
  groupDescBlock.onclick = function (ev) {    
    if (!this.getAttribute("active"))
    {
      var ev = new IDEvent("clk", _this.ParentField.Identifier, ev, _this.ParentField.ClickEventDef, null, "cap");
      ev.YPos = 30;
      ev.ShiftPress = true;
    }
    _this.Close();
  };
  degroupBlock.onclick = function (ev) {
    if (this.getAttribute("disabled") != "true")
    {
      var ev = new IDEvent("clk", _this.ParentField.Identifier, ev, _this.ParentField.ClickEventDef, null, "cap");
      ev.YPos = 2;
      ev.ShiftPress = true;
    }
    _this.Close();
  };
  //
  groupContainer.appendChild(groupCaption);
  groupButtonsCnt.appendChild(groupBlock);
  groupButtonsCnt.appendChild(groupDescBlock);
  groupButtonsCnt.appendChild(degroupBlock);
  groupContainer.appendChild(groupButtonsCnt);  
  this.ContentBox.appendChild(groupContainer);
}


PopupFilter.prototype.RealizeCheckFilter = function()
{
  var _this = this;
  this.FilterType = PopupFilter.FILTER_TYPE_CHECK;
  //
  // Il filtro dei check e' un radio, deve permettere di scegliere
  // - true
  // - false
  // - tutti i valori
  var trueRow = document.createElement("DIV");
  trueRow.className = "filter-row-filter row-line";
  var trueRadio = document.createElement("INPUT");
  trueRadio.type = "radio";
  trueRadio.name = "filterCheck";
  trueRadio.value = "on";
  trueRadio.id = "fil_check_true";
  var trueLabel = document.createElement("LABEL");
  trueLabel.innerText = ClientMessages.FIL_SELCHECK;
  trueLabel.setAttribute("for", "fil_check_true");
  trueRow.appendChild(trueRadio);
  trueRow.appendChild(trueLabel);
  //
  var falseRow = document.createElement("DIV");
  falseRow.className = "filter-row-filter row-line";
  var falseRadio = document.createElement("INPUT");
  falseRadio.type = "radio";
  falseRadio.name = "filterCheck";
  falseRadio.value = "";
  falseRadio.id = "fil_check_false";
  var falseLabel = document.createElement("LABEL");
  falseLabel.innerText = ClientMessages.FIL_SELUNCHECK;
  falseLabel.setAttribute("for", "fil_check_false");
  falseRow.appendChild(falseRadio);
  falseRow.appendChild(falseLabel);
  //
  // Stato iniziale
  var vl = this.ParentField.ValueList;
  if (this.ParentField.QBEFilter == "on" || (vl && vl.ItemList.length>=2 && this.ParentField.QBEFilter == vl.ItemList[0].Value))
    trueRadio.checked = true;
  else if (this.ParentField.QBEFilter == "on" || (vl && vl.ItemList.length>=2 && this.ParentField.QBEFilter == vl.ItemList[1].Value))
    falseRadio.checked = true;
  //
  this.FilterArea.appendChild(trueRow);
  this.FilterArea.appendChild(falseRow);
}


PopupFilter.prototype.RealizeRadioFilter = function()
{
  var _this = this;
  this.FilterType = PopupFilter.FILTER_TYPE_RADIO;
  //
  // Controlli generali: 
  // - seleziona tutti
  // - deseleziona tutti
  var commonControlsArea = document.createElement("DIV");
  commonControlsArea.className = "filter-common-controls filter-card";
  //
  var selAllRow = document.createElement("DIV");
  selAllRow.className = "filter-row-filter check-line";
  var selAllImg = document.createElement("IMG");
  selAllImg.src = RD3_Glb.GetImgSrc("images/pansel1.gif");
  selAllImg.className = "filter-common-ctrl";
  var selAllLabel = document.createElement("LABEL");
  selAllLabel.innerText = ClientMessages.FIL_SEL_ALL_LABEL;
  selAllRow.appendChild(selAllImg);
  selAllRow.appendChild(selAllLabel);
  //
  var unselAllRow = document.createElement("DIV");
  unselAllRow.className = "filter-row-filter check-line";
  var unselAllImg = document.createElement("IMG");
  unselAllImg.className = "filter-common-ctrl";
  unselAllImg.src = RD3_Glb.GetImgSrc("images/pansel0.gif");
  var unselAllLabel = document.createElement("LABEL");
  unselAllLabel.innerText = ClientMessages.FIL_UNS_ALL_LABEL;
  selAllRow.appendChild(unselAllImg);
  selAllRow.appendChild(unselAllLabel);
  unselAllRow.appendChild(unselAllImg);
  unselAllRow.appendChild(unselAllLabel);
  //
  commonControlsArea.appendChild(selAllRow);
  commonControlsArea.appendChild(unselAllRow);
  this.ContentBox.appendChild(commonControlsArea);
  //
  var vl = this.ParentField.ValueList;
  for (var i = 0; i < vl.ItemList.length; i++)
  {
    // Creo il check per l'item
    var checkRow = document.createElement("DIV");
    checkRow.className = "filter-row-filter row-line";
    var itemCheck = document.createElement("INPUT");
    itemCheck.type = "checkbox";
    itemCheck.value = vl.ItemList[i].Value;
    itemCheck.id = "check_item_row_" + i;
    itemCheck.className = "filter_check_item";
    var checkLabel = document.createElement("LABEL");
    checkLabel.innerText = vl.ItemList[i].Name;
    checkLabel.setAttribute("for", "check_item_row_" + i);
    checkRow.appendChild(itemCheck);
    checkRow.appendChild(checkLabel);
    //
    this.FilterArea.appendChild(checkRow);
    //
    if (this.SelectedFilters && this.SelectedFilters.length > 0)
      for (var k = 0; k < this.SelectedFilters.length; k++)
        if (this.SelectedFilters[k].type == PopupFilter.FILTER_VALUE && this.SelectedFilters[k].value == vl.ItemList[i].Value)
        {
          itemCheck.checked = true;
          break;
        }
  }
  //
  selAllRow.onclick = function (ev) {
    var checkList = document.getElementsByClassName("filter_check_item");
    for (var j=0; j<checkList.length; j++)
      checkList[j].checked = true;
  };
  unselAllRow.onclick = function (ev) {
    var checkList = document.getElementsByClassName("filter_check_item");
    for (var j=0; j<checkList.length; j++)
      checkList[j].checked = false;
  };
}


PopupFilter.prototype.RealizeComboFilter = function()
{
  var _this = this;
  this.FilterType = PopupFilter.FILTER_TYPE_COMBO;
  //
  if (this.ParentField.LKE && this.ParentField.QBEFilter) 
  {
    if (typeof this.ParentField.QBEFilter === 'string') 
    { 
      // Il server ha mandato la stringa QBEFilter, devo ricostruire l'oggetto con i filtri
      // checkName : true - quando il server restituisce i valori provo a vedere se c'e' il valore giusto in modo da mettere il nome corretto a video
      var sep = this.ParentField.QBEFilter.indexOf("@#@") > 0 ? "@#@" : this.ParentField.ComboValueSep;
      var qbeFilters = this.ParentField.QBEFilter.split(sep);
      var filters = [];
      for (var i = 0; i < qbeFilters.length; i++)
        filters.push({ type: PopupFilter.FILTER_VALUE, value: qbeFilters[i], name: (qbeFilters[i].indexOf("#") > 0 ? qbeFilters[i].substring(qbeFilters[i].indexOf("#") + 1) : qbeFilters[i]), checkName: true });
      //
      this.SelectedFilters = filters;
      this.CheckNames = true;
    }
    else
      this.SelectedFilters = this.ParentField.QBEFilter;
  }
  //
  // Creo l'area comune di filtro:
  // - seleziona tutto
  // - deselziona tutto (solo per valueSource)
  // - campo ricerca
  var commonControlsArea = document.createElement("DIV");
  commonControlsArea.className = "filter-common-controls filter-card";
  //
  var selAllRow = document.createElement("DIV");
  selAllRow.className = "filter-row-filter check-line";
  var selAllImg = document.createElement("IMG");
  selAllImg.src = RD3_Glb.GetImgSrc("images/pansel1.gif");
  selAllImg.className = "filter-common-ctrl";
  var selAllLabel = document.createElement("LABEL");
  selAllLabel.innerText = ClientMessages.FIL_SEL_ALL_LABEL;
  selAllRow.appendChild(selAllImg);
  selAllRow.appendChild(selAllLabel);
  //
  var unselAllRow = document.createElement("DIV");
  unselAllRow.className = "filter-row-filter check-line";
  var unselAllImg = document.createElement("IMG");
  unselAllImg.className = "filter-common-ctrl";
  unselAllImg.src = RD3_Glb.GetImgSrc("images/pansel0.gif");
  var unselAllLabel = document.createElement("LABEL");
  unselAllLabel.innerText = ClientMessages.FIL_UNS_ALL_LABEL;
  selAllRow.appendChild(unselAllImg);
  selAllRow.appendChild(unselAllLabel);
  unselAllRow.appendChild(unselAllImg);
  unselAllRow.appendChild(unselAllLabel);
  //
  commonControlsArea.appendChild(selAllRow);
  commonControlsArea.appendChild(unselAllRow);
  //
  selAllRow.onclick = function (ev) {
    var checkList = document.getElementsByClassName("filter_check_item");
    for (var j=0; j<checkList.length; j++)
    {
      // La selezione lavora solo sugli item attualmente visibili
      if (checkList[j].parentNode.parentNode.style.display == "" && !checkList[j].checked) 
      {
        checkList[j].checked = true;
        if (_this.ParentField.LKE) 
          checkList[j].onchange();
      }
    }
  };
  unselAllRow.onclick = function (ev) {
    var checkList = document.getElementsByClassName("filter_check_item");
    for (var j=0; j<checkList.length; j++)
    {
      // La deselezione lavora solo sugli item attualmente visibili
      if (checkList[j].parentNode.parentNode.style.display == "" && checkList[j].checked)
      {
        checkList[j].checked = false;
        if (_this.ParentField.LKE)
          checkList[j].onchange();
      }
    }
  };
  //
  var searchRow = document.createElement("DIV");
  searchRow.className = "filter-row-filter search-line";
  var searchInput = document.createElement("INPUT");
  searchInput.setAttribute("id", "popup_filter_main_input");
  searchInput.type = "search";
  searchInput.className = "filter-search-input";
  searchInput.placeholder = ClientMessages.FIL_SEARCH_PLACE;
  RD3_Glb.AutocompleteOff(searchInput);
  searchRow.appendChild(searchInput);
  //
  commonControlsArea.appendChild(searchRow);
  this.ContentBox.appendChild(commonControlsArea);
  //
  // Creo l'area in cui disegnare i risultati
  this.ValueListArea = document.createElement("DIV");
  this.ValueListArea.className = "filter-popup-area";
  this.ValueListTable = document.createElement("TABLE");
  this.ValueListTable.className = "combo-popup-table";
  this.ContentBox.appendChild(this.ValueListArea);
  this.TBbody = document.createElement("TBODY");
  this.ValueListArea.appendChild(this.ValueListTable);
  this.ValueListTable.appendChild(this.TBbody);
  //
  // In questo caso creo l'area con le 'card' per i campi selezionati
  // (riuso la FilterArea cambiando classe, perche' li voglio sotto)
  if (this.ParentField.LKE) 
  {
    this.FilterArea.className = "filter-combo-selected-area";
    this.RefreshLKESelected(this.SelectedFilters);
  }
  else
    this.FilterArea.style.display = "none";
  //
  var vl = this.ParentField.ValueList;
  //
  if (!vl) 
    var ev = new IDEvent("qbecombo", this.ParentField.Identifier, null, RD3_Glb.EVENT_URGENT, this.Identifier, this.ParentField.LKE ? "*" :"");
  else
    this.RealizeComboList(vl);
  //
  var _this = this;
  searchInput.oninput = function(ev) {
    RD3_KBManager.ActiveElement = this;
    //
    // Uso un timer per non fare troppe ricerche
    if (_this.SearchTimeout)
      window.clearTimeout(_this.SearchTimeout);
    //
    var userVal = this.value;
    var _search = this;
    _this.SearchTimeout = window.setTimeout(function() {
      if (_this.ParentField.LKE)
      {
        new IDEvent("qbecombo", _this.ParentField.Identifier, null, RD3_Glb.EVENT_ACTIVE, _this.Identifier, userVal ? userVal : "*");
      }
      else if (_this.LastValueList) 
      {
        _this.LastValueList.FilterComboItem(userVal, true);
        //
        var n = _this.LastValueList.ItemList.length;
        for (var i=0; i<n; i++)
          if (_this.LastValueList.ItemList[i].TR)
            _this.LastValueList.ItemList[i].TR.style.display = _this.LastValueList.ItemList[i].Visible ? "" : "none";
      }
      //
      _this.SearchTimeout = null;
    }, 300);
  };
}


PopupFilter.prototype.RealizeComboList = function(valueList)
{
  if (!valueList)
    return;
  //
  // Svuoto il body, forse c'era una vecchia lista
  try {
    while (this.TBbody.firstChild)
      this.TBbody.removeChild(this.TBbody.firstChild);
  }
  catch (ex) {}
  //
  var firstList = !this.LastValueList;
  this.LastValueList = valueList;
  this.LastValueList.SetComboItemsVisible();
  //
  this.LastValueList.RealizeCombo(this.TBbody, this, this.ParentField.VisualStyle, this.SelectedFilters, true, null, this.ParentField.LKE);
  //
  // Rimuovo la riga vuota delle combo (che non serve qui) 
  // e imposto la classe alla prima riga delle combo LKE che altrimenti e' grigia
  try {
    if (this.TBbody && this.TBbody.firstChild) {
      this.TBbody.firstChild.className = this.TBbody.firstChild.className.replace(" combo-option-hiligth", "");
      if (this.ParentField.Optional && !this.ParentField.LKE && !this.TBbody.firstChild.firstChild.firstChild)
        this.TBbody.removeChild(this.TBbody.firstChild);
    }
    if (this.TBbody && this.TBbody.lastChild) {
      // Le combo LKE hanno la riga vuota in fondo
      if (this.ParentField.Optional && this.ParentField.LKE && !this.TBbody.lastChild.firstChild.firstChild && this.TBbody.lastChild.innerText.trim() === "-")
        this.TBbody.removeChild(this.TBbody.lastChild);
    }
  }
  catch (ex) { }
  //
  if (firstList && this.TBbody.offsetWidth > 400)
  {
    this.SetWidth(this.TBbody.offsetWidth + 18);
    this.AdaptLayout();
  }
  if (firstList) 
  {
    // All'apertura do' il fuoco al nuovo campo di filtro
    setTimeout(function () {
      var nw = document.getElementById("popup_filter_main_input");
      if (nw)
        nw.focus();
    }, 10);
  }
  if (this.ParentField.LKE && this.CheckNames && this.SelectedFilters) {
    // Verifico se ho dei filtri con dei nomi fittizi, in quel caso provo a vedere se mi sono arrivati i nomi giusti dal server
    var update = false;
    for (var i = 0; i < this.SelectedFilters.length; i++)
      if (this.SelectedFilters[i].checkName) 
      {
        // Verifico se la lista contiene un item con il valore e il nome corretto
        var sels = this.LastValueList.FindItemsByRValue(this.SelectedFilters[i].value);
        if (sels && sels.length > 0) 
        {
          delete this.SelectedFilters[i].checkName;
          this.SelectedFilters[i].name = sels[0].Name;
          update = true;
        }
      }
    if (update)
      this.RefreshLKESelected();
  }
}


PopupFilter.prototype.RefreshLKESelected = function()
{  
  var oldHeight = this.FilterArea.clientHeight;
  //
  // Svuoto la FilterArea, forse c'era una vecchia lista
  this.FilterArea.innerHTML = "";
  //
  var _this = this;
  var deleteClick = function (ev)
  {
    var delVal = this.parentNode.getAttribute("lkeVal");
    //
    // Rimuovo dai selezionati
    var kk;
    for (kk = 0; kk < _this.SelectedFilters.length; kk++)
      if (_this.SelectedFilters[kk].value == delVal)
      {
        _this.SelectedFilters.splice(kk, 1);
        break;
      }
    //
    // Deseleleziono dalla combo
    for (kk = 0; kk < _this.LastValueList.ItemList.length; kk++)
      if (_this.LastValueList.ItemList[kk].RValue == delVal && _this.LastValueList.ItemList[kk].TR && _this.LastValueList.ItemList[kk].TR.firstChild.firstChild)
      {
        _this.LastValueList.ItemList[kk].TR.firstChild.firstChild.checked = false;
        break;
      }
    //
    _this.RefreshLKESelected();
  };
  //
  for (var i = 0; i < this.SelectedFilters.length; i++)
  {
    var selectVal = document.createElement("SPAN");
    selectVal.className = "filter-lke-chip";
    selectVal.setAttribute("lkeVal", this.SelectedFilters[i].value);
    selectVal.innerText = this.SelectedFilters[i].name;
    //
    var removeIcon = document.createElement("IMG");
    var removeImage	= "images/mstop.gif";
    if (RD3_ServerParams.Theme.startsWith("seattle"))
      removeImage = "images/delete_sm.gif";
    else if (RD3_ServerParams.Theme.startsWith("casual"))
      removeImage = "images/closef.gif";
    removeIcon.src = RD3_Glb.GetImgSrc(removeImage);
    selectVal.appendChild(removeIcon);
    this.FilterArea.appendChild(selectVal);
    //
    removeIcon.onclick = deleteClick;
  }
  //
  if (this.SelectedFilters.length == 0)
  {
    var emptyPlace = document.createElement("SPAN");
    emptyPlace.className = "empty_lke_placeholder";
    emptyPlace.innerText = ClientMessages.FIL_EMPTY_LKE;
    this.FilterArea.appendChild(emptyPlace);
  }
  //
  this.SetHeight(this.Height - oldHeight + this.FilterArea.clientHeight);
  //
  // Devo cercare di stare dentro lo schermo
  if (this.Realized) 
  {
    if (this.Top + this.PopupBox.offsetHeight > document.body.offsetHeight)
      this.SetTop(document.body.offsetHeight - this.PopupBox.offsetHeight - 10);
    //
    if (this.Top < 0)
      this.SetTop(10);
  }
}


PopupFilter.prototype.RealizeCharacterFilter = function()
{
  var _this = this;
  if (RD3_Glb.IsNumericObject(this.ParentField.DataType) || RD3_Glb.IsDateOrTimeObject(this.ParentField.DataType))
    this.FilterType = PopupFilter.FILTER_TYPE_NUMBER;
  else
    this.FilterType = PopupFilter.FILTER_TYPE_CHAR;
  //
  var keyp = function (ev) {
    var code = (ev.charCode) ? ev.charCode : ev.keyCode;
    if (code == 13) {
      // Cerco il pulsante e gli do' il fuoco
      var nw = document.getElementById("popup_filter_accept_button");
      if (nw)
        nw.focus();
    }
  };
  //
  var comboChange = function(ev)
  {
    var newVal = this.options[this.selectedIndex].value;
    //
    // Mostro o nascondo l'input
    var row = this.getAttribute("row");
    _this.SelectedFilters[parseInt(row)].type = parseInt(newVal);
    var v1 = document.getElementById("filt" + row + "1");
    var c1 = document.getElementById("filt" + row + "1:cal");
    var v2 = document.getElementById("filt" + row + "2");
    var c2 = document.getElementById("filt" + row + "2:cal");
    if (v1)
      v1.style.display = (newVal == PopupFilter.FILTER_EMPTY || newVal == PopupFilter.FILTER_NOTEMPTY) ? "none" : "";
    if (c1)
      c1.style.display = (newVal == PopupFilter.FILTER_EMPTY || newVal == PopupFilter.FILTER_NOTEMPTY) ? "none" : "";
    //
    // Nel caso between devo mostrare il secondo input e diminuire le larghezze
    if (newVal == PopupFilter.FILTER_BEETWEEN)
    {
      v1.className = "filter-mid-input";
      if (v2)
        v2.style.display = "";
      if (c2)
        c2.style.display = "";
    }
    else
    {
      v1.className = "";
      if (v2)
        v2.style.display = "none";
      if (c2)
        c2.style.display = "none";
    }
  };
  var deleteclick = function (ev) 
  {
    // Ottengo il numero di riga
    var row = this.getAttribute("row");
    //
    // Rimuovo la riga
    _this.SelectedFilters.splice(row, 1);
    //
    // Svuoto l'area dei filtri e la faccio rinascere
    while (_this.FilterArea.firstChild)
      _this.FilterArea.removeChild(_this.FilterArea.firstChild);
    _this.RealizeCharacterFilter();
  };
  var calendarclick = function (ev) 
  {
    ShowCalendar(this.previousSibling, RD3_Glb.GetDateMask(_this.ParentField.DataType));  // Il PField non ha la maschera
    RD3_DesktopManager.WebEntryPoint.CalPopup.setAttribute("idjustopened", "1");
  };
  //
  //
  // Gestisco l'altezza dinamica del popup
  var totalFilters = this.SelectedFilters;
  if (totalFilters.length < 3) 
  {
    window.setTimeout(function() {
      if (!_this.Realized)
        return;
      _this.FilterArea.style.height = ((totalFilters.length * 62) + 74) + "px";
      //
      // Mi riadatto in base al contenuto
      _this.AdaptLayout();
    }, 150);
  }
  if (this.SelectedFilters.length > 0) 
  {
    for (var j=0; j<this.SelectedFilters.length; j++)
    {
      var selFilterRow = document.createElement("DIV");
      selFilterRow.className = "filter-row-filter filter-card";
      //
	    var selInnerFilterRow = document.createElement("DIV");
      selInnerFilterRow.className = "filter-row-container";
      //
      var OrRow = document.createElement("DIV");
      OrRow.className = "filter-row-or" + (j > 0 ? " visible" : "");
      OrRow.innerText = "+";
	    if (j > 0)
        this.FilterArea.appendChild(OrRow);
      //
      var filterSelType = document.createElement("SELECT");
      this.CreateFilterOptions(this.FilterType, filterSelType);
      var filtValueInput = document.createElement("INPUT");
      RD3_Glb.AutocompleteOff(filtValueInput);
      filtValueInput.type = "text";
      var filterDelete = document.createElement("IMG");
	    var delImage = "images/mstop.gif";
	    if (RD3_ServerParams.Theme.startsWith("seattle"))
		    delImage = "images/delete_sm.gif";
	    else if (RD3_ServerParams.Theme.startsWith("casual"))
		    delImage = "images/closef.gif";
      filterDelete.src = RD3_Glb.GetImgSrc(delImage);
      filterDelete.className = "filter-delete-img";
      //
      var valueCal;
      if (RD3_Glb.IsDateOrTimeObject(this.ParentField.DataType))
      {
        // Calendario per filtri su data
        valueCal = document.createElement("IMG");
        valueCal.className = "filter-calendar";
        valueCal.id = "filt" + j + "1:cal";
        valueCal.src = RD3_Glb.GetImgSrc("images/aeda.gif");
      }
      //
      var filtToValueInput;
      var toValueCal;
      if (this.FilterType == PopupFilter.FILTER_TYPE_NUMBER) 
      {
        filtToValueInput = document.createElement("INPUT");
        filtToValueInput.type = "text";
        RD3_Glb.AutocompleteOff(filtToValueInput);
        filtToValueInput.className = "filter-mid-input" + ((valueCal) ? " filter-date" : "");
        filtToValueInput.style.display = "none";
        filtToValueInput.id = "filt" + j + "2";
        filtToValueInput.setAttribute("row", j);
        filtToValueInput.value = this.SelectedFilters[j].toValue ? this.SelectedFilters[j].toValue : "";
        //
        if (RD3_Glb.IsDateOrTimeObject(this.ParentField.DataType))
        {
          // Calendario per filtri su data
          toValueCal = document.createElement("IMG");
          toValueCal.className = "filter-calendar";
          toValueCal.id = "filt" + j + "2:cal";
          toValueCal.src = RD3_Glb.GetImgSrc("images/aeda.gif");
          toValueCal.style.display = "none";
        }
        filtToValueInput.onkeypress = keyp;
      }
      //
      // Eventi
      filterSelType.onchange = comboChange;
      filterDelete.onclick = deleteclick;
      if (valueCal) 
        valueCal.onclick = calendarclick;
      if (toValueCal)
        toValueCal.onclick = calendarclick;
      filtValueInput.onkeypress = keyp;
      //
      filterSelType.setAttribute("row", j);
      filtValueInput.setAttribute("row", j);
      filterDelete.setAttribute("row", j);
      filterSelType.id = "filt" + j + "0";
      filtValueInput.id = "filt" + j + "1";
      filterDelete.id = "filt" + j + ":del";
      filterSelType.value = this.SelectedFilters[j].type;
      filtValueInput.value = this.SelectedFilters[j].value ? this.SelectedFilters[j].value : "";
      if (this.SelectedFilters[j].type == PopupFilter.FILTER_EMPTY || this.SelectedFilters[j].type == PopupFilter.FILTER_NOTEMPTY) // se non serve l'input lo nascondo
      {
        filtValueInput.style.display = "none";
        if (filtToValueInput)
          filtToValueInput.style.display = "none";
        if (toValueCal)
          toValueCal.style.display = "none";
        if (valueCal)
          valueCal.style.display = "none";
      }
      if (this.SelectedFilters[j].type == PopupFilter.FILTER_BEETWEEN) // Se serve il secondo inpu lo mostro
      {
        filtValueInput.className = "filter-mid-input";
        if (filtToValueInput)
          filtToValueInput.style.display = "";
        if (toValueCal)
          toValueCal.style.display = "";
      }
      //
      selInnerFilterRow.appendChild(filterSelType);
      selInnerFilterRow.appendChild(filtValueInput);
      if (valueCal)
        selInnerFilterRow.appendChild(valueCal);
      if (filtToValueInput)
        selInnerFilterRow.appendChild(filtToValueInput);
      if (toValueCal)
        selInnerFilterRow.appendChild(toValueCal);
      selInnerFilterRow.appendChild(filterDelete);
	    selFilterRow.appendChild(selInnerFilterRow);
      this.FilterArea.appendChild(selFilterRow);
      //
      if (this.SelectedFilters[j].showCal) 
      {
        // Forzo l'apertura del calendario, ho cliccato l'attivatore sulla nuova riga 
        delete this.SelectedFilters[j].showCal;
        ShowCalendar(filtValueInput, RD3_Glb.GetDateMask(this.ParentField.DataType));
        RD3_DesktopManager.WebEntryPoint.CalPopup.setAttribute("idjustopened", "1");
      }
    }
  }
  // Creo l'entry per i nuovi filtri
  var filterRow = document.createElement("DIV");
  filterRow.className = "filter-row-filter filter-card";
  //
  var innerFilterRow = document.createElement("DIV");
  innerFilterRow.className = "filter-row-container";
  //
  var newRowOr = document.createElement("DIV");
  newRowOr.className = "filter-row-or" + (this.SelectedFilters.length > 0 ? " visible" : "");
  newRowOr.innerText = "+";
  if (this.SelectedFilters.length > 0)
    this.FilterArea.appendChild(newRowOr);
  //
  var filterType = document.createElement("SELECT");
  this.CreateFilterOptions(this.FilterType, filterType);
  var newValueInput = document.createElement("INPUT");
  newValueInput.setAttribute("id", "popup_filter_main_input");
  newValueInput.type = "text";
  RD3_Glb.AutocompleteOff(newValueInput);
  var newValueCal;
  if (RD3_Glb.IsDateOrTimeObject(this.ParentField.DataType))
  {
    // Calendario per filtri su data
    newValueCal = document.createElement("IMG");
    newValueCal.className = "filter-calendar";
    newValueCal.src = RD3_Glb.GetImgSrc("images/aeda.gif");
  }
  //
  // EVENTS
  filterType.onchange = function(ev) 
  {
    // Se scelgo dalla combo EMPTY o non EMPTY non devo aspettare l'edit dell'input (perche' non ha senso)
    // ma acquisisco subito il valore
    if (filterType.options[filterType.selectedIndex].value == PopupFilter.FILTER_EMPTY || filterType.options[filterType.selectedIndex].value == PopupFilter.FILTER_NOTEMPTY || filterType.options[filterType.selectedIndex].value == PopupFilter.FILTER_BEETWEEN)
    {
      // Devo acquisire le modifiche utente ai filtri
      _this.UpdateSelectedFilters();
      //
      // Crea una nuova riga tra i filtri
      _this.SelectedFilters.push({type: filterType.options[filterType.selectedIndex].value});
      //
      // Svuota l'area dei filtri e falla ricreare, in modo da aggiungere una nuova riga di insert
      while (_this.FilterArea.firstChild)
      _this.FilterArea.removeChild(_this.FilterArea.firstChild);
      _this.RealizeCharacterFilter();
    }
  }
  newValueInput.onchange = function(ev) 
  {
    // Devo acquisire le modifiche utente ai filtri
    _this.UpdateSelectedFilters();
    //
    // Crea una nuova riga tra i filtri
    _this.SelectedFilters.push({type: filterType.options[filterType.selectedIndex].value, value: this.value});
    //
    // Svuota l'area dei filtri e falla ricreare, in modo da aggiungere una nuova riga di insert
    while (_this.FilterArea.firstChild)
      _this.FilterArea.removeChild(_this.FilterArea.firstChild);
    _this.RealizeCharacterFilter();
  }
  newValueInput.onkeypress = keyp;
  if (newValueCal) 
  {
    newValueCal.onclick = function (ev) {
      // Devo acquisire le modifiche utente ai filtri
      _this.UpdateSelectedFilters();
      //
      // In questo caso devo fare qualcosa di specifico: infatti il calendario si apre e imposta la data corrente, scatta l'onChange che crea la nuova riga e il calendario rimane aperto 'male'
      // Allora invece di aprire il candario creo la nuova riga con un flag speciale che dice di aprire il calendario
      // Crea una nuova riga tra i filtri
      _this.SelectedFilters.push({type: filterType.options[filterType.selectedIndex].value, value: "", showCal:true});
      //
      // Svuota l'area dei filtri e falla ricreare, in modo da aggiungere una nuova riga di insert
      while (_this.FilterArea.firstChild)
        _this.FilterArea.removeChild(_this.FilterArea.firstChild);
      _this.RealizeCharacterFilter();
    };
  }
  //
  innerFilterRow.appendChild(filterType);
  innerFilterRow.appendChild(newValueInput);
  if (newValueCal)
    innerFilterRow.appendChild(newValueCal);
  filterRow.appendChild(innerFilterRow);
  this.FilterArea.appendChild(filterRow);
}


PopupFilter.prototype.CreateFilterOptions = function(type, select)
{
  var opts = [];
  if (type == PopupFilter.FILTER_TYPE_CHAR) // CHARACTER
  {
    if (this.ParentField.ComboValueSep == ";" && this.ParentField.QBELike) 
    {
      // I docID non possono usare questi filtri
      opts.push({val:PopupFilter.FILTER_STARTS, label: ClientMessages.FIL_STARTS});
      opts.push({val:PopupFilter.FILTER_ENDS, label: ClientMessages.FIL_ENDS});
      opts.push({val:PopupFilter.FILTER_CONTAINS, label: ClientMessages.FIL_CONTAINS});
    }
    opts.push({val:PopupFilter.FILTER_VALUE, label: ClientMessages.FIL_VALUE});
    opts.push({val:PopupFilter.FILTER_DIFFERENT, label: ClientMessages.FIL_DIFFERENT});
    opts.push({val:PopupFilter.FILTER_EMPTY, label: ClientMessages.FIL_EMPTY});
    opts.push({val:PopupFilter.FILTER_NOTEMPTY, label: ClientMessages.FIL_NOTEMPTY});
  }
  else if (type == PopupFilter.FILTER_TYPE_NUMBER) // NUMERIC or DATE
  {
    opts.push({val:PopupFilter.FILTER_VALUE, label: ClientMessages.FIL_VALUE});
    opts.push({val:PopupFilter.FILTER_MAJOR, label: ClientMessages.FIL_MAJOR});
    opts.push({val:PopupFilter.FILTER_MINOR, label: ClientMessages.FIL_MINOR});
    if (this.ParentField.DataType != 7 && this.ParentField.DataType != 8) // Se c'e' la parte time non posso mettere il beetween (i : danno fastidio)
      opts.push({val:PopupFilter.FILTER_BEETWEEN, label: ClientMessages.FIL_BETWEEN});
    opts.push({val:PopupFilter.FILTER_EMPTY, label: ClientMessages.FIL_EMPTY});
    opts.push({val:PopupFilter.FILTER_NOTEMPTY, label: ClientMessages.FIL_NOTEMPTY});
  }
  //
  for (var i=0; i < opts.length; i++)
  {
    var opt = document.createElement("OPTION");
    opt.innerText = opts[i].label;
    opt.value = opts[i].val;
    select.appendChild(opt);
  }
}

/**
* Aggiorna i filtri selezionati per le ricerche di tipo Char e Numerico
*/
PopupFilter.prototype.UpdateSelectedFilters = function()
{
  if (this.FilterType == PopupFilter.FILTER_TYPE_CHAR || this.FilterType == PopupFilter.FILTER_TYPE_NUMBER) 
  {
    // Aggiorno i filtri con gli ultimi valori
    for (var j=0; j < this.SelectedFilters.length; j++)
    {
      var type = document.getElementById("filt" + j + "0");
      var value = document.getElementById("filt" + j + "1");
      var toValue = document.getElementById("filt" + j + "2");
      //
      this.SelectedFilters[j].type = parseInt(type.options[type.selectedIndex].value);
      if (this.SelectedFilters[j].type != PopupFilter.FILTER_EMPTY && this.SelectedFilters[j].type != PopupFilter.FILTER_NOTEMPTY) 
      {
        if (!value.value)
          continue;
        //
        // Aggiorna il valore
        this.SelectedFilters[j].value = value.value;
        if (this.SelectedFilters[j].type == PopupFilter.FILTER_BEETWEEN)
        {
          if (!toValue.value)
            continue;
          this.SelectedFilters[j].toValue = toValue.value;
        }
        else
          this.SelectedFilters[j].toValue = "";
      }
    }
  }
}

//*************************************************
// Restituisce la stringa di ricerca adattandola in base al valore restituito
//*************************************************
PopupFilter.prototype.GetQBEForFilter = function(filter)
{
  switch (filter.type) 
  {
    case PopupFilter.FILTER_VALUE :
      // Nel caso DATA non mandiamo l'= all'inizio, cosi' scatta tutta la gestione standard delle date parziali
      if (this.FilterType == PopupFilter.FILTER_TYPE_NUMBER && RD3_Glb.IsDateOrTimeObject(this.ParentField.DataType))
        return filter.value;
      else
        return "=" + filter.value;
    break;
    
    case PopupFilter.FILTER_STARTS :
      return filter.value + "*";
    break;
    
    case PopupFilter.FILTER_ENDS :
      return "*" + filter.value;
    break;
    
    case PopupFilter.FILTER_CONTAINS :
      return "*" + filter.value + "*";
    break;
    
    case PopupFilter.FILTER_DIFFERENT :
      return "#" + filter.value;
    break;
    
    case PopupFilter.FILTER_MAJOR :
      return ">" + filter.value;
    break;
    
    case PopupFilter.FILTER_MINOR :
      return "<" + filter.value;
    break;
    
    case PopupFilter.FILTER_BEETWEEN :
      return filter.value + ":" + filter.toValue;
    break;
    
    case PopupFilter.FILTER_EMPTY :
      return "!";
    break;
    
    case PopupFilter.FILTER_NOTEMPTY :
      return ".";
    break;
  }
}

PopupFilter.prototype.GetFilterFromQBE = function(QBE)
{
  if (!QBE)
    return [];
  //
  var qbeFilters = QBE.split(this.ParentField.ComboValueSep);
  var filters = [];
  for (var i = 0; i<qbeFilters.length; i++)
  {
    var qbeFilter = qbeFilters[i];
    if (!qbeFilter || qbeFilter == "")
      continue;
    //
    if (qbeFilter.substring(0, 1) == "*") 
    {
      // Potrebbe essere FILTER_ENDS o FILTER_CONTAINS
      if (qbeFilter.substring(qbeFilter.length-1) == "*")
        filters.push({type: PopupFilter.FILTER_CONTAINS, value: qbeFilter.substring(1, qbeFilter.length-1)});
      else
        filters.push({type: PopupFilter.FILTER_ENDS, value: qbeFilter.substring(1)});
    }
    else if (qbeFilter.substring(qbeFilter.length-1) == "*")
    {
      // Finisce con * ma non c'e' all'inizio: e' FILTER_STARTS
      filters.push({type: PopupFilter.FILTER_STARTS, value: qbeFilter.substring(0, qbeFilter.length-1)});
    }
    else if (qbeFilter.substring(0, 1) == "#") 
    {
      filters.push({type: PopupFilter.FILTER_DIFFERENT, value: qbeFilter.substring(1)});
    }
    else if (qbeFilter.substring(0, 1) == ">") 
    {
      filters.push({type: PopupFilter.FILTER_MAJOR, value: qbeFilter.substring(1)});
    }
    else if (qbeFilter.substring(0, 1) == "<") 
    {
      filters.push({type: PopupFilter.FILTER_MINOR, value: qbeFilter.substring(1)});
    }
    else if (qbeFilter.indexOf(":")>0 && (this.ParentField.DataType != 7 && this.ParentField.DataType != 8))
    {
      // Contiene i : all'interno, e' un FILTER_BEETWEEN (non valido per le date contenenti TIME)
      var idx = qbeFilter.indexOf(":");
      filters.push({type: PopupFilter.FILTER_BEETWEEN, value: qbeFilter.substring(0, idx), toValue:qbeFilter.substring(idx+1)});
    }
    else if (qbeFilter == "!")
    {
      filters.push({type: PopupFilter.FILTER_EMPTY});
    }
    else if (qbeFilter == ".")
    {
      filters.push({type: PopupFilter.FILTER_NOTEMPTY});
    }
    else if (qbeFilter.substring(0, 1) == "=") 
    {
      // Filtro per valore (inizia con =)
      filters.push({ type: PopupFilter.FILTER_VALUE, value: qbeFilter.substring(1) });
    }
    else 
    {
      // Filtro per valore, dipende dalla configurazione dell'applicazione
      var tp = PopupFilter.FILTER_VALUE;
      if (!RD3_Glb.IsDateOrTimeObject(this.ParentField.DataType) && !RD3_Glb.IsNumericObject(this.ParentField.DataType))
        tp = !RD3_ServerParams.PanelsLikeSearch ? PopupFilter.FILTER_VALUE : (RD3_ServerParams.PanelsLikeMode == 1 ? PopupFilter.FILTER_STARTS : PopupFilter.FILTER_CONTAINS);
      filters.push({ type: tp, value: qbeFilter });
    }
  }
  //
  return filters;
}


PopupFilter.prototype.DoFilter = function()
{
  var QBEFilter = "";
  //
  // In questo caso devo aggionare i valori selezionati usando gli oggetti a video e poi generare i filtri QBE a partire da quelli
  if (this.FilterType == PopupFilter.FILTER_TYPE_CHAR || this.FilterType == PopupFilter.FILTER_TYPE_NUMBER) 
  {
    this.UpdateSelectedFilters();
    //
    // Aggiorno i filtri con gli ultimi valori
    for (var j=0; j < this.SelectedFilters.length; j++)
      QBEFilter += (j>0 ? this.ParentField.ComboValueSep : "") + this.GetQBEForFilter(this.SelectedFilters[j]);
    //
    // Se il filtro inizia con = uso un criterio vuoto per permettere di gestire bene = multipli
    if (QBEFilter.charAt(0) == "=" && this.SelectedFilters.length > 1)
      QBEFilter = ";" + QBEFilter;
  }
  else if (this.FilterType == PopupFilter.FILTER_TYPE_CHECK) 
  {
    var vl = this.ParentField.ValueList;
    var trueCheck = document.getElementById("fil_check_true");
    var falseCheck = document.getElementById("fil_check_false");
    var emptyCheck = document.getElementById("fil_check_empty");
    var notEmptyCheck = document.getElementById("fil_check_notempty");
    //
    if (trueCheck.checked)
      QBEFilter = vl && vl.ItemList.length>=2 ? vl.ItemList[0].Value : "on";
    else if (falseCheck.checked)
      QBEFilter = vl && vl.ItemList.length>=2 ? vl.ItemList[1].Value : "";
    else if (emptyCheck.checked)
      QBEFilter = "!";
    else if (notEmptyCheck.checked)
      QBEFilter = ".";
  }
  else if (this.FilterType == PopupFilter.FILTER_TYPE_RADIO)
  {
    var checkList = document.getElementsByClassName("filter_check_item");
    for (var j=0; j<checkList.length; j++)
      if (checkList[j].checked)
        QBEFilter += (QBEFilter.length > 0 ? this.ParentField.ComboValueSep : "") + checkList[j].value;
  }
  else if (this.FilterType == PopupFilter.FILTER_TYPE_COMBO)
  {
    if (this.ParentField.LKE) 
    {
      // Creo i filtri QBE a partire dagli item selezionati
      for (var h=0; h < this.SelectedFilters.length; h++)
        QBEFilter += (h>0 ? "@#@" : "") + this.SelectedFilters[h].value;
      //
      // In questo caso salvo i valori selezionati
      this.ParentField.SetQBEFilter(this.SelectedFilters.length > 0 ? this.SelectedFilters : "");
      //
      // Imposto il filtro anche sulle altre Lookup legate alla mia query
      var pp = this.ParentField.ParentPanel;
      for (var fi = 0; fi < pp.Fields.length; fi++) 
      {
        if (pp.Fields[fi].IdxPanel == this.ParentField.IdxPanel && this.ParentField.IdxPanel > 0)
          pp.Fields[fi].SetQBEFilter(this.SelectedFilters.length > 0 ? this.SelectedFilters : "");
      }
    }
    else if (this.LastValueList)
    {
      var n = this.LastValueList.ItemList.length;
      for (var k=0; k<n; k++) 
      {
        if (this.LastValueList.ItemList[k].TR && this.LastValueList.ItemList[k].TR.firstChild.firstChild && this.LastValueList.ItemList[k].TR.firstChild.firstChild.checked)
          QBEFilter += (QBEFilter.length > 0 ? this.ParentField.ComboValueSep : "") + this.LastValueList.ItemList[k].Value;
      }
    }
  }
  //
  // Adesso che ho il filtro QBE corretto posso mandarlo al server e chiudermi
  var ev = new IDEvent("qbeset", this.ParentField.Identifier, null, RD3_Glb.EVENT_URGENT, "qbefilter", QBEFilter);
  this.Close();
}

PopupFilter.prototype.ClearFilter = function()
{
  // Per le LKE devo annullare io il QBE lato client
  if (this.FilterType == PopupFilter.FILTER_TYPE_COMBO && this.ParentField.LKE) 
  {
    this.ParentField.SetQBEFilter("");
    //
    // Imposto il filtro anche sulle altre Lookup legate alla mia query
    var pp = this.ParentField.ParentPanel;
    for (var fi = 0; fi < pp.Fields.length; fi++) 
    {
      if (pp.Fields[fi].IdxPanel == this.ParentField.IdxPanel && this.ParentField.IdxPanel > 0)
        pp.Fields[fi].SetQBEFilter("");
    }
  }
  //
  // Mando un messaggio al server per chiedere di svuotare i filtri
  var ev = new IDEvent("qbeset", this.ParentField.Identifier, null, RD3_Glb.EVENT_URGENT, "clear", "");
  this.Close();
}


PopupFilter.prototype.Close = function()
{ 
  // Nascondo anche il calendario
	if (RD3_DesktopManager.WebEntryPoint.CalPopup)
	{
		if (RD3_DesktopManager.WebEntryPoint.CalPopup.getAttribute("idjustopened")=="1")
			RD3_DesktopManager.WebEntryPoint.CalPopup.setAttribute("idjustopened", "");
		else		
			RD3_DesktopManager.WebEntryPoint.CalPopup.style.display = "none";
	}
  //
  PopupFrame.prototype.Close.call(this);
}

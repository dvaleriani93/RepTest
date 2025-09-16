// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe ValueListItem: gestisce un item di una
// Lista Valori
// ************************************************

function ValueListItem()
{
  // ATTENZIONE: un value list item non e' nella mappa e non ha
  //             un identificatore proprio  
  // Proprieta' di questo oggetto
  this.Name = "";          // Nome da mostrare a video per questo item
  this.HtmlNames = "";     // Testo delle colonne in HTML (separato da |)
  this.OrgNames = "";      // Testo originale delle colonne (separato da |)
  this.Value= "";          // Valore interno
  this.Tooltip = "";       // Descrizione del nome
  this.Image = "";         // Icona del valore
  this.Visible = true;     // L'item e' visibile?
  this.Enabled = true;     // L'item e' abilitato?
  this.Group = "";         // Identificativo del gruppo dell'item
  this.VisualStyle = null; // Stile visuale
  this.RValue = null;      // Valore reale per LKE
  this.LKEsel = false;     // TRUE se questo e' l'item selezionato di un LKE
}

// *******************************************************************
// Inizializza questo Timer leggendo i dati da un nodo <tim> XML
// *******************************************************************
ValueListItem.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
ValueListItem.prototype.LoadProperties = function(node)
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
      case "txt": this.Name = valore; this.OrgNames = this.Name; break;
      case "val": this.Value = valore; break;
      case "img": this.Image = valore; break;
      case "tip": this.Tooltip = valore; break;
      case "ena": this.Enabled = (valore=="-1") ? true : false; break;      
      case "gru": this.Group = valore; break;      
      case "sty": this.VisualStyle = RD3_DesktopManager.ObjectMap["vis:"+parseInt(valore)]; break;
      case "rval": this.RValue = valore; break;
      case "lkes": this.LKEsel = (valore=="-1"); break;
    }
  }
}


// ***************************************************************
// Crea il radio button
// ****************************************************************
ValueListItem.prototype.RealizeOption= function(pspan, pobj, value, vertical, list, en, vl)
{
  var name = pspan.Identifier + ((list)?":l":"");
  var ie = RD3_Glb.IsIE(10, false);
  var first = vl.ItemList[0]==this;
  var last = vl.ItemList[vl.ItemList.length-1]==this;
  //
  // Per bug di IE e' necessario creare il radio tramite stringa HTML
  var obj;
  if (ie)
  {
    var s = "<input type=radio name='"+name+"' "+((this.Value == value)? "CHECKED":"")+">";
    obj = document.createElement(s);
  }
  else
  {
    obj = document.createElement("input");
    obj.type = "radio";
    obj.name = name;
    obj.checked = (this.Value == value);
  }
  obj.disabled = !en;
  //
  obj.className = "book-span-radio" + (RD3_Glb.IsIE(10, true) ? " radio-ie" : "");
  //
  var label = document.createElement("span");
  var cn = "book-span-radio-text";
  var cn2 = "";
  if (RD3_Glb.IsMobile())
  {
    if (vertical)
    {
      cn+="-vertical";
      if (first)
        label.style.marginTop = "-12px";
    }
    else
    {
      label.style.width = Math.floor(100/vl.ItemList.length)+"%";
      var br = (RD3_Glb.IsQuadro()?2:8)+"px";
      if (first)
      {
        RD3_Glb.SetBorderRadius(label, br+" 0px 0px "+br);
        label.style.marginLeft="0px";
      }
      if (last)
      {
        RD3_Glb.SetBorderRadius(label, "0px "+br+" "+br+" 0px");
      }
    }
  }
  label.className = cn;
  label.innerHTML = RD3_Glb.HTMLEncode(this.Name);
  if (RD3_Glb.IsMobile() && this.Value == value)
    RD3_Glb.AddClass(label,"radio-checked");
  //
  // Tooltip
  RD3_TooltipManager.SetObjTitle(obj, this.Tooltip);
  RD3_TooltipManager.SetObjTitle(label, this.Tooltip);
  //
  pobj.appendChild(obj);
  pobj.appendChild(label);
  //
  if (vertical && !RD3_Glb.IsMobile())
    pobj.appendChild(document.createElement("br"));
  //
  var oc = new Function("ev","return RD3_KBManager.IDRO_OnChange(ev)");  
  obj.onclick = oc;
  //
  if (pspan.OnRadioLabelClick)
  {
    var loc = new Function("ev","RD3_DesktopManager.CallEventHandler('"+pspan.Identifier+"','OnRadioLabelClick',ev);");
    label.onclick = loc;
  }
  //
  if (!ie)
  {
    var fo = new Function("ev","return RD3_KBManager.IDRO_GetFocus(ev)");
    var lo = new Function("ev","return RD3_KBManager.IDRO_LostFocus(ev)");
    //
    // Solo IE ha gli eventi (activate e deactivate) che informano i parent (bubble)
    obj.onfocus = fo;
    obj.onblur = lo;
    //
    // In firefox l'evento di doppio click non arriva al body
    if (RD3_Glb.IsFirefox(3))
    {
      var dc = new Function("ev","return RD3_KBManager.IDRO_DoubleClick(ev)");
      obj.ondblclick = dc;
    }
  }
}


// ***************************************************************
// Crea gli option di una combo
// ****************************************************************
ValueListItem.prototype.RealizeCombo= function(tbody, comboid, idx, vs, sel, multisel, hl, lke, hasImg, decodeCol)
{
  var isPopupFilterCombo = (comboid && comboid instanceof PopupFilter);
  //
  // Creo gli oggetti visuali
  var obj = document.createElement("TR");
  obj.className = "combo-option";
  if (!RD3_Glb.IsMobile() && !isPopupFilterCombo)
  {
    obj.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+comboid+"', 'OnOptionMouseOver', ev,"+idx+")");
    obj.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+comboid+"', 'OnOptionMouseOut', ev,"+idx+")");
    obj.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+comboid+"', 'OnOptionClick', ev,"+idx+")");
  }
  obj.id = (isPopupFilterCombo ? comboid.Identifier : comboid) + ":"+idx;
  tbody.appendChild(obj);
  //
  this.TR = obj;
  //
  var cols = this.HtmlNames.split('|');
  var ncols = cols.length;
  var thead = tbody.previousSibling;
  var multicol = (thead && thead.style.display == "");
  //
  // Se l'item ha un suo VisualStyle uso quello
  if (this.VisualStyle)
    vs = this.VisualStyle;
  //
  // Se la lista e' in formato tabellare sbircio quante colonne ha l'intestazione
  if (thead && thead.style.display != "none")
    ncols = thead.firstChild.childNodes.length - 2;
  //
  // Nella prima colonna il check se c'e'
  var td0 = document.createElement("TD");
  obj.appendChild(td0);
  if (multisel && this.Value != "" && this.Enabled && (!lke || (this.Value!="LKEPREC" && this.Value!="LKENULL" && this.Value!="LKEMORE" && this.Value!="LKEPLUS")))
  {
    var optsel = document.createElement("input");
    optsel.type = "checkbox";
    optsel.className = "combo-option-check" + (isPopupFilterCombo ? " filter_check_item" : "");
    //
    td0.appendChild(optsel);
    //
    // A causa di un baco di IE non si puo' checkare prima di avere un parent
    // NON spostare prima dell'appendChild
    optsel.checked = sel;
    //
    // Imposto la larghezza della colonna
    td0.style.paddingLeft = "2px";
    td0.style.paddingRight = "4px";
    td0.style.width = "12px";
    td0.style.cursor = "default";
    //
    if (isPopupFilterCombo && lke)
    {
      // Al check di una option devo aggiungere o rimuovere il valore selezionato 
      var _this = this;
      optsel.onchange = function(ev) 
      {
        if (this.checked) {
          comboid.SelectedFilters.push({type: PopupFilter.FILTER_VALUE, value: _this.RValue, name: _this.Name});
        }
        else
        {
          for (var kk = 0; kk < comboid.SelectedFilters.length; kk++)
            if (comboid.SelectedFilters[kk].value == _this.RValue)
            {
              comboid.SelectedFilters.splice(kk, 1);
              break;
            }
        }
        //
        comboid.RefreshLKESelected();
      };
    }
  }
  else
    td0.style.padding = "0px";
  //
  // Nella seconda colonna l'immagine se c'e'
  var td1 = document.createElement("TD");
  obj.appendChild(td1);
  var optimg = null;
  if (this.Image != "")
  {
    optimg = document.createElement("IMG");
    optimg.className = "combo-option-img" + (multicol && hasImg ? " combo-td-multi" : "");
    optimg.src = RD3_Glb.GetImgSrc("images/"+this.Image)
    td1.appendChild(optimg);
    //
    // Voglio sapere quando arrivano le immagini... cosi' la combo puo' essere dimensionata correttamente
    if (RD3_Glb.IsIE(10, false))
      optimg.onreadystatechange = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+comboid+"', 'OnComboImageLoaded', ev)");
    else
      optimg.onload = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+comboid+"', 'OnComboImageLoaded', ev)");
    //
    // Imposto la larghezza della colonna
    td1.style.width = RD3_ClientParams.ComboImageSize + "px";
    //
    if (RD3_Glb.IsMobile())
      td1.style.paddingLeft = "4px";
  }
  else
    td1.style.padding = "0px";
  //
  for (var i = 0; i < ncols; i++)
  {
    var tdn = document.createElement("TD");
    if (multicol)
      tdn.className = "combo-td-multi";
    obj.appendChild(tdn);
    var optcnt = document.createElement("SPAN");
    optcnt.className = "combo-option-name";
    optcnt.innerHTML = cols[i];
    tdn.appendChild(optcnt);
    //
    // Applico lo stile al nome dell'item
    var s = optcnt.style;
    var fn = vs.GetFont(1); // VISFNT_VALUE
    var fnt = fn.split(",");
    s.fontFamily = fnt[0];
    s.fontWeight=(fnt[1].indexOf("B")>-1)?"bold":"normal";
    s.fontStyle=(fnt[1].indexOf("I")>-1)?"italic":"normal";
    s.textDecoration=(fnt[1].indexOf("U")>-1)?"underline":"none";
    s.textDecoration=(fnt[1].indexOf("S")>-1)?"line-through":"none";
    s.fontSize = fnt[2]+"pt";
    if (this.Enabled)
      s.color = vs.GetColor(1); // VISCLR_FOREVALUE=1
    //
    // Se mi e' stata fornita una colonna per la decodifica e lo stile
    // visuale ha una maschera, la applico
    if (decodeCol && i==decodeCol-1 && vs.GetMask())
    {
      var m = vs.GetMask();
      if (m==">")
        s.textTransform = "uppercase";
      else if (m=="<")
        s.textTransform = "lowercase";
    }
    //
    if (!sel && this.Enabled && !isPopupFilterCombo)
      optcnt.style.cursor = "pointer";
    if (i==0 && this.Image != "" && RD3_Glb.IsMobile())
      s.paddingLeft = RD3_ClientParams.ComboImageSize + 10 + "px";
    //
    // Se l'item non ha tutte le colonne (<empty>, LKEPREC, LKENULL, LKEMORE)
    // spalmo la colonna su tutta la riga
    if (i == 0 && ncols > cols.length)
    {
      tdn.colSpan = ncols;
      break;
    }
  }
  //
  // Se e' selezionato applico il colore di sfondo
  if (sel)
  {
    // Non metto lo sfondo "azzurro" se l'item e' vuoto
    if (!multisel || this.Value!="")
    {
      obj.style.backgroundColor = vs.GetColor(9); // VISCLR_HILIGHT
      RD3_Glb.AddClass(obj, "combo-option-selected");
    }
  }
  else
  {
    // Non e' selezionato
    obj.style.backgroundColor = vs.GetColor(5); // VISCLR_BACKVALUE
    RD3_Glb.RemoveClass(obj, "combo-option-selected");
    //
    // Se e' abilitato
    if (this.Enabled)
    {
      // Aggiungo il cursor
      if (!isPopupFilterCombo)
        obj.style.cursor = "pointer";
      if (optimg) optimg.style.cursor = "pointer";
    }
    else
    {
      RD3_Glb.AddClass(obj, "combo-option-disabled");
    }
  }
  //
  if (hl && multisel)
    RD3_Glb.AddClass(obj, "combo-option-hiligth");
}

// ***************************************************************
// Restituisce TRUE se questo item matcha con il testo fornito
// ****************************************************************
ValueListItem.prototype.Matches= function(txt, searchMode, hilight)
{
  this.HtmlNames = RD3_Glb.HTMLEncode(this.OrgNames);
  //
  // Se il testo e' vuoto... tutto matcha!
  if (txt=="")
    return true;
  //
  var match = false;
  switch (searchMode)
  {
    case 0: // Start With
    {
      match = (this.OrgNames.toLowerCase().indexOf(txt.toLowerCase())==0);
      if (match && hilight)
        this.HtmlNames = "<span class=combo-option-name-hl>" + RD3_Glb.HTMLEncode(this.OrgNames.substring(0, txt.length)) + "</span>" + RD3_Glb.HTMLEncode(this.OrgNames.substring(txt.length));
    }
    break;
      
    case 1: // Word match
    {
      var pos = this.OrgNames.toLowerCase().indexOf(' ' + txt.toLowerCase());
      match = (pos!=-1);
      if (match && hilight)
      {
        pos++;  // Mangio lo spazio
        this.HtmlNames = RD3_Glb.HTMLEncode(this.OrgNames.substring(0, pos)) + "<span class=combo-option-name-hl>" + RD3_Glb.HTMLEncode(this.OrgNames.substring(pos, pos+txt.length)) + "</span>" + RD3_Glb.HTMLEncode(this.OrgNames.substring(pos+txt.length));
      }
    }
    break;
    
    case 2: // Full content search
    {
      var pos = this.OrgNames.toLowerCase().indexOf(txt.toLowerCase());
      match = (pos!=-1);
      if (match && hilight)
        this.HtmlNames = RD3_Glb.HTMLEncode(this.OrgNames.substring(0, pos)) + "<span class=combo-option-name-hl>" + RD3_Glb.HTMLEncode(this.OrgNames.substring(pos, pos+txt.length)) + "</span>" + RD3_Glb.HTMLEncode(this.OrgNames.substring(pos+txt.length));
    }
    break;
  }
  //
  return match;
}

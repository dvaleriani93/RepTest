// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe ValueList: gestisce una lista valori
// legata ad un campo di pannello o span di report
// ************************************************

function ValueList()
{
  // ATTENZIONE: una value list non e' nella mappa e non ha
  //             un identificatore proprio
  // Proprieta' di questo oggetto
  this.ItemList = new Array();           // Lista degli item
  this.Identifier = Math.random()+":lv"; // Numero casuale che identifica univocamente questa lista
  this.Headers = new Array();            // Intestazioni delle colonne
  this.DecodeColumn = 0;                 // Indice della colonna da usare come decodifica
}


// ***************************************************************
// Inizializza questa lista valori leggendo i dati da un nodo XML
// ****************************************************************
ValueList.prototype.LoadFromXml = function(node) 
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
      case "hdr": this.Headers = valore.split('|'); break;
      case "dcc": this.DecodeColumn = parseInt(valore); break;
    }
  }
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
      case "vli":
      {
        // Leggo l'item contenuto
        var newitem = new ValueListItem();
        //
        newitem.LoadFromXml(objnode);
        this.ItemList.push(newitem);
        //
        // Se e' specificata la colonna di decodifica, prendo quella
        if (this.DecodeColumn > 0)
        {
          var names = newitem.OrgNames.split("|");
          if (this.DecodeColumn <= names.length)
            newitem.Name = newitem.OrgNames.split("|")[this.DecodeColumn - 1];
        }
      }
      break;
    }
  }
  //
  // NON mi aggiungo alla mappa degli oggetti 
  // RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
}


// ***************************************************************
// Cerca gli items in base al valore
// ****************************************************************
ValueList.prototype.FindItemsByValue = function(value, byname, sep, isLKE) 
{
  var selitems = new Array();
  var values = value.split(sep);
  for (var j=0; j<values.length; j++)
  {
    var v = values[j];
    var n = this.ItemList.length;
    //
    // Se sono LKE, provo prima a cercare l'item selezionato
    var old_selitems_length = selitems.length;
    if (isLKE)
    {
      for (var i=0;i<n;i++)
      {
        if (this.ItemList[i].LKEsel)
        {
          selitems.push(this.ItemList[i]);
          break;
        }
      }
    }
    //
    // Se non ho trovato nulla di nuovo, uso il valore/nome
    if (old_selitems_length == selitems.length)
    {
      for (var i=0;i<n;i++)
      {
        if ((!byname && this.ItemList[i].Value == v) || (byname && this.ItemList[i].Name == v))
        {
          selitems.push(this.ItemList[i]);
          break;
        }
      }
    }
  }
  return selitems;
}

// ***************************************************************
// Cerca gli items in base ad un array di Item
// ****************************************************************
ValueList.prototype.FindItemsByArray = function(items, byname)
{
  var selitems = new Array();
  var ni = items.length;
  var nil = this.ItemList.length;
  for (var j = 0; j < ni; j++)
  {
    var item = items[j];
    for (var i = 0; i < nil; i++)
    {
      if ((!byname && this.ItemList[i].Value == item.Value) || (byname && this.ItemList[i].Name == item.Name))
      {
        selitems.push(this.ItemList[i]);
        break;
      }
    }
  }
  return selitems;
}

// ***************************************************************
// Cerca gli items in base alla selezione LKE
// ****************************************************************
ValueList.prototype.FindItemsLKE = function()
{
  var selitems = new Array();
  var n = this.ItemList.length;
  for (var i=0;i<n;i++)
  {
    var item = this.ItemList[i];
    if (item.Value == "LKEPREC" || item.Value == "LKENULL" || item.Value == "LKEMORE")
      continue;
    //
    if (parseInt(item.Value.substring(3)) > 1000)
      selitems.push(item);
  }
  return selitems;
}


// ***************************************************************
// Cerca gli items in base al RValue (per i filtri avanzati LKE)
// ****************************************************************
ValueList.prototype.FindItemsByRValue = function (rvalue) 
{
  var selitems = new Array();
  for (var i = 0; i < this.ItemList.length; i++) 
  {
    if (this.ItemList[i].RValue && this.ItemList[i].RValue == rvalue) 
    {
      selitems.push(this.ItemList[i]);
      break;
    }
  }
  return selitems;
}


// ***************************************************************
// Imposta il valore del campo check-box
// ****************************************************************
ValueList.prototype.SetCheck = function(obj, value, inqbe)
{
  // Guardo il primo valore della lista
  var fl = (value == this.ItemList[0].Value);
  if (RD3_Glb.IsMobile())
  {
    if (RD3_Glb.IsQuadro())
    {
      var io = obj.firstChild;
      RD3_Glb.SetTransform(io, "translate3d("+(fl?0:-53)+"px, 0px, 0px)");
    }
    else if (RD3_Glb.IsMobile7())
    {
      var io = obj.firstChild;
      RD3_Glb.SetTransform(io, "translate3d("+(fl?22:0)+"px, 0px, 0px)");
      obj.style.backgroundColor = fl?"":"transparent";
      obj.style.borderColor = fl?"#4cd864":"";
    }
    else
      obj.style.backgroundPosition = (fl?"0%":"100%")+" -27px";
  }
  if (inqbe && value === "---") 
  {
    obj.indeterminate = true;
    obj.setAttribute("checkstatus", "1");
  }
  else {
    obj.checked = fl;
    obj.indeterminate = false;
    obj.setAttribute("checkstatus", fl ? "0" : "2");
  }
}


// ***************************************************************
// Crea i radio button
// ****************************************************************
ValueList.prototype.RealizeOption= function(pspan, pobj, value, vertical, list, en)
{
  var n = this.ItemList.length;
  for (var i=0;i<n;i++)
  {
    this.ItemList[i].RealizeOption(pspan, pobj, value, vertical, list, en, this);
  }
}


// ***************************************************************
// Imposta tutti i radio button allo stato giusto dato il valore fornito
// ****************************************************************
ValueList.prototype.SetOption = function(srcobj, value)
{
  var mob = RD3_Glb.IsMobile();
  var c = srcobj.getElementsByTagName("input");
  if (c.length>0)
  {
    var n = this.ItemList.length;
    for (var i=0;i<n;i++)
    {
      var it = this.ItemList[i];
      c[i].checked = (it.Value == value);
      if (mob)
        RD3_Glb.SetClass(c[i].nextSibling,"radio-checked",it.Value == value);
    }
  }
}


// ***************************************************************
// Aggiorna la classe delle label (caso mobile)
// ****************************************************************
ValueList.prototype.SetOptionClass = function(srcobj, obj)
{
  var c = srcobj.getElementsByTagName("span");
  if (c.length>0)
  {
    var n = this.ItemList.length;
    for (var i=0;i<n;i++)
    {
      var it = this.ItemList[i];
      RD3_Glb.SetClass(c[i],"radio-checked",c[i]==obj);
    }
  }
}

// ***************************************************************
// Restituisce il valore dell'option selezionato
// ****************************************************************
ValueList.prototype.GetOption = function(srcobj)
{
  if (srcobj.tagName == "INPUT")
    srcobj = srcobj.parentNode;
  //
  var c = srcobj.getElementsByTagName("input");
  if (c.length>0)
  {
    var n = this.ItemList.length;
    for (var i=0;i<n;i++)
    {
      var it = this.ItemList[i];
      if (c[i].checked)
        return it.Value;
    }
  }
  return "";
}

// ***************************************************************
// Abilita/Disabilita i radio button
// ****************************************************************
ValueList.prototype.EnableOption = function(srcobj, en, vis)
{
  var c = srcobj.getElementsByTagName("input");
  if (c.length>0)
  {
    var n = this.ItemList.length;
    for (var i=0;i<n;i++)
    {
      var it = this.ItemList[i];
      var o = c[i];
      //
      o.disabled = !en;
      o.style.visibility = (vis ? "" : "hidden");
      if (o.nextSibling)
        o.nextSibling.style.visibility = (vis ? "" : "hidden");
    }  
  }
}


// ***************************************************************
// Crea gli item di una combo
// ****************************************************************
ValueList.prototype.RealizeCombo = function(tbody, comboid, vs, selitems, multisel, hlitem, lke)
{
  var isPopupFilterCombo = (comboid && comboid instanceof PopupFilter);
  //
  // Creo l'intestazione
  var thead = null;
  if (tbody.previousSibling)
  {
    thead = tbody.previousSibling;
    thead.style.display = (this.Headers.length > 0 ? "" : "none");
    if (thead.rows.length > 0)
      thead.deleteRow(0);
  }
  else if (this.Headers.length > 0)
  {
    thead = document.createElement("THEAD");
    tbody.parentNode.insertBefore(thead, tbody);
  }
  //
  var hasImg = false;
  var n = this.Headers.length;
  if (n > 0)
  {
    // Guardo se c'e' almeno un item con l'immagine
    var n1 = this.ItemList.length;
    for (var i=0;i<n1;i++)
    {
      if (this.ItemList[i].Image != "")
      {
        hasImg = true;
        break;
      }
    }
    //
    var tr = document.createElement("TR");
    tr.className = "combo-header";
    thead.appendChild(tr);
    //
    // Creo il TD per il check della multi-selezione
    var td0 = document.createElement("TH");
    td0.style.padding = "0px";
    thead.firstChild.appendChild(td0);
    //
    // Creo il TD per l'immagine
    var td1 = document.createElement("TH");
    if (hasImg)
      td1.className = "combo-td-multi";
    td1.style.padding = "0px";
    thead.firstChild.appendChild(td1);
    //
    for (var i = 0; i < n; i++)
    {
      var tdn = document.createElement("TH");
      tdn.className = "combo-header-column combo-td-multi";
      tdn.innerHTML = this.Headers[i];
      thead.firstChild.appendChild(tdn);
    }
  }
  //
  // Svuoto le righe
  while (tbody.rows.length>0)
    tbody.deleteRow(0);
  //
  var oldgroup = "";
  n = this.ItemList.length;
  for (var i=0;i<n;i++)
  {
    var it = this.ItemList[i];
    //
    // Se questo item e' invisibile, lo salto
    if (!it.Visible)
      continue;
    //
    // Gestisco i gruppi: se il gruppo e' cambiato e non e' empty string stampo il suo header
    if (it.Group != oldgroup && it.Group!="")
    {
      var trgroup = document.createElement("TR");
      var td0 = document.createElement("TD");
      var td1 = document.createElement("TD");
      var tdn = document.createElement("TD");
      if (this.Headers.length > 1)
        tdn.colSpan = this.Headers.length;
      //
      tdn.innerHTML = it.Group;
      trgroup.className = "combo-group-header";
      td0.style.padding = "0px";
      td1.style.padding = "0px";
      //
      trgroup.appendChild(td0);
      trgroup.appendChild(td1);
      trgroup.appendChild(tdn);
      tbody.appendChild(trgroup);
      //
      oldgroup = it.Group;
    }
    //
    // Cerco l'item in SelItems per vedere se va selezionato
    var ni = selitems.length;
    var checked = false;
    for (var j=0; j<ni && !checked; j++) 
    {
      if (isPopupFilterCombo) 
      {
        if (lke)
          checked = (selitems[j].value == it.RValue);
        else
          checked = (selitems[j].value == it.Value);
      }
      else
        checked = (selitems[j].Value == it.Value);
    }
    //
    if (!hlitem)
     hlitem = it;
    //
    var hl = (hlitem.Value == it.Value);
    //
    it.RealizeCombo(tbody, comboid, i, vs, checked, multisel, hl, lke, hasImg, this.DecodeColumn);
  }
}

// ***************************************************************
// Rende tutti gli item della combo visibili/invisibili
// ****************************************************************
ValueList.prototype.SetComboItemsVisible = function()
{
  // Rendo tutti gli item visibili, ripristinando anche il nome
  var n = this.ItemList.length;
  for (var i=0; i<n; i++)
  {
    var it = this.ItemList[i];
    //
    it.Visible = true;
    it.HtmlNames = RD3_Glb.HTMLEncode(it.OrgNames);
  }
}

// ***************************************************************
// Aggiunge/remove una classe ad un determinato Combo-Item
// ****************************************************************
ValueList.prototype.AddComboItemClass = function(srcobj, idx, cls)
{
  try
  {
    // Faccio l'hilight solo se l'item e' selezionato
    if (this.ItemList[parseInt(idx, 10)].Enabled)
    {
      var o = this.GetTR(srcobj, parseInt(idx));
      if (o)
        RD3_Glb.AddClass(o, "combo-option-hiligth");
    }
  }
  catch (ex) {}
}
ValueList.prototype.RemoveComboItemClass = function(srcobj, idx, cls)
{
  try
  {
    // Faccio l'hilight solo se l'item e' selezionato
    if (this.ItemList[parseInt(idx, 10)].Enabled)
    {
      var o = this.GetTR(srcobj, parseInt(idx));
      if (o)
        RD3_Glb.RemoveClass(o, "combo-option-hiligth");
    }
  }
  catch (ex) {}
}


// ***************************************************************
// Filtra gli item della lista utilizzando il testo fornito
// ****************************************************************
ValueList.prototype.FilterComboItem = function(txt, hilight, noFilter)
{
  // Se non devo filtrare, evidenzio solamente (usando il modo 2-FullContent)
  if (noFilter)
  {
    var n = this.ItemList.length;
    for (var i=0; i<n; i++)
    {
      var it = this.ItemList[i];
      it.Matches(txt, 2, hilight);
    }
    //
    return n;
  }
  //
  // Se nel campo c'e' qualcosa applico il filtro,
  var nvis = 0;
  var searchMode = 0;   // 0-StartWith, 1-WordBegin, 2-FullContent
  while (searchMode<3)
  {
    var n = this.ItemList.length;
    for (var i=0; i<n; i++)
    {
      var it = this.ItemList[i];
      it.Visible = it.Matches(txt, searchMode, hilight);
      if (it.Visible)
        nvis++;
    }
    //
    // Se, con questa modalita' di ricerca ho trovato qualcosa, smetto di provare
    if (nvis > 0)
      break;
    //
    // Provo in altro modo
    searchMode++;
  }
  //
  return nvis;
}

// ***************************************************************
// Seleziona, dato uno StartItem, il prossimo (precedente) item visibile
// ****************************************************************
ValueList.prototype.GetNextVisibleItem = function(startit, previous, inc10)
{
  // Calcolo l'indice da cui devo partire
  var n = this.ItemList.length;
  var startidx = -1;
  if (startit)
  {
    for (var i=0; i<n; i++)
    {
      if (this.ItemList[i]==startit)
      {
        // Trovato!
        startidx = i;
        break;
      }
    }
  }
  //
  // Se non l'ho trovato... uso dei "default"
  if (startidx == -1 && previous)
    startidx = n-1;
  //
  // Ora mi muovo di quanto richiesto
  startidx += (previous ? -1 : 1) * (inc10 ? 10:1);
  //
  // Ora, a partire da STARTIDX, cerco il prossimo/precedente visibile
  // Faccio 2 giri per il rolling-over
  var selidx = -1;
  for (var giro=0; giro<2; giro++)
  {
    if (previous && startidx<n)
    {
      for (var i=startidx; i>=0; i--)
      {
        if (this.ItemList[i].Visible && this.ItemList[i].Enabled)
        {
          selidx = i;
          break;
        }
      }
    }
    else if (!previous && startidx>=0)
    {
      for (var i=startidx; i<n; i++)
      {
        if (this.ItemList[i].Visible && this.ItemList[i].Enabled)
        {
          selidx = i;
          break;
        }
      }
    }
    //
    // E' necessario un altro giro? Se ho trovato qualcosa no!
    if (selidx!=-1)
      break;
    //
    // Non ho ancora trovato... faccio un altro giro ripartendo dall'inizio/fine
    startidx = (previous ? n-1 : 0)
  }
  //
  // Se non l'ho trovato, restituisco quello attualmente selezionato se visibile e abilitato
  if (selidx==-1 && startit && startit.Visible && startit.Enabled)
    return startit;
  //
  if (selidx>=0 && selidx<n)
    return this.ItemList[selidx];
  //
  // Niente da fare...
  return null;
}

// ***************************************************************
// Restituisce l'indice di un item
// ****************************************************************
ValueList.prototype.GetItemIndex = function(item)
{
  var n = this.ItemList.length;
  var idx = 0;
  for (var i=0; i<n; i++)
  {
    var it = this.ItemList[i];
    //
    // Se l'ho trovato ne torno l'indice
    if (it==item)
      return idx;
    //
    // Se e' visibile lo conto
    if (it.Visible)
      idx++;
  }
  return -1;   // Non trovato?
}

// ***************************************************************
// Restituisce il TOP dell'item indicato
// ****************************************************************
ValueList.prototype.EnsureItemVisible = function(popupobj, idx)
{
  if (idx<0 || idx>=this.ItemList.length)
    return;
  //
  var it = this.GetTR(popupobj, idx);
  if (!it)
    return;
   //
  var ittop = it.offsetTop;
  //
  if (RD3_Glb.IsMobile())
  {
    ; // Nulla da fare per il mobile...
  }
  else
  {
    if (ittop < popupobj.scrollTop)
      popupobj.scrollTop = ittop - (popupobj.clientHeight/2);
    else if (ittop + it.offsetHeight > popupobj.scrollTop + popupobj.clientHeight)
      popupobj.scrollTop = ittop + (popupobj.clientHeight/2) - popupobj.clientHeight;
  }
}

// ***************************************************************
// Cerca l'oggetto tra gli item e se lo trova ne torna il tooltip
// ***************************************************************
ValueList.prototype.GetTooltipCombo = function(srcobj, tip, obj)
{
  // Risalgo fino al TR che l'oggetto DOM corrispondente al ValueListItem
  while (obj && obj.tagName != "TR")
    obj = obj.parentNode;
  //
  var c = srcobj.getElementsByTagName("TR");
  if (obj && c.length>0)
  {
    var n = this.ItemList.length;
    for (var i=0; i<n; i++)
    {
      var it = this.ItemList[i];
      if (c[i]==obj)
      {
        // Trovato l'item! Se ha un tooltip bene, altrimenti torno FALSE
        if (it.Tooltip!="")
        {
          tip.SetObj(obj);
          tip.SetText(it.Tooltip);
          tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + obj.offsetWidth, RD3_Glb.GetScreenTop(obj) + (obj.offsetHeight/2));
          tip.SetPosition(1);
          return true;
        }
        else
          return false;
      }
    }
  }
  return false;
}

// ***************************************************************
// Cerca l'oggetto tra gli item e se lo trova ne torna il tooltip
// ***************************************************************
ValueList.prototype.GetTooltipOption = function(srcobj, tip, obj)
{
  var c = srcobj.getElementsByTagName("input");
  var s = srcobj.getElementsByTagName("span");
  if (c.length>0)
  {
    var n = this.ItemList.length;
    for (var i=0; i<n; i++)
    {
      var it = this.ItemList[i];
      if (c[i]==obj || s[i]==obj)
      {
        if (it.Tooltip.length>0)
        {
          tip.SetTitle(it.Name);
          tip.SetText(it.Tooltip);
          tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + obj.offsetWidth, RD3_Glb.GetScreenTop(obj) + (obj.offsetHeight/2));
          tip.SetPosition(1);
          return true;
        }
      }
    }
  }
  return false;
}



// *******************************************************************************
// Questo metodo restituisce l' idx-esimo TR contenuto nell'oggetto
// passato come parametro saltando gli header dei gruppi.
// listobj - oggetto in cui cercare i tag TR
// idx - indice del TD da trovare
// ********************************************************************************
ValueList.prototype.GetTR = function(listobj, idx)
{
  // Leggiamo tutti i TR
  var c = listobj.getElementsByTagName("TR");
  //
  // Cicliamo su tutti i tr saltando quelli di tipo group-header
  var n = c.length;
  var actidx = 0;
  for (var i=0; i<n; i++)
  {
    var o = c[i];
    //
    if (o)
    {
      // E' un oggetto: verifichiamo se e' quello giusto, se no incremento l'indice di controllo
      var cn = o.className;
      if (cn.indexOf("combo-group-header") == -1 && cn.indexOf("combo-header") == -1)
      {
        if (actidx == idx)
          return o;
        else
          actidx++;
      }
    }
  }
}


// **********************************************************************************
// Verifica l'uguaglianza tra due ValueList
// NB: due liste sono diverse anche se hanno gli stessi Item ma in ordine differente
// ***********************************************************************************
ValueList.prototype.Equals = function(list)
{
  // Se i puntatori sono gli stessi allora sono io!
  if (this==list)
    return true;
  //
  // Se abbiamo Item in numero differente allora siamo diverse
  if (this.ItemList.length != list.ItemList.length)
    return false;
  //
  // Se arriviamo qui abbiamo lo stesso numero di Item; li confrontiamo uno per uno e appena ne troviamo uno differente
  // usciamo 
  var count = this.ItemList.length;
  for (var i=0; i<count;i++)
  {
    var it1 = this.ItemList[i];
    var it2 = list.ItemList[i];
    //
    if ((it1.Name!=it2.Name) || (it1.Value!=it2.Value))
      return false;
  }
  //
  return true;
}
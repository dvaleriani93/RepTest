// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PListGroup: rappresenta un gruppo di record 
//                    in lista
// ************************************************

function PListGroup(panel)
{
  this.Label = "";                    // Label del gruppo
  this.StartingRecord = 0;            // Record iniziale del gruppo
  this.EndingRecord = 0;              // Record finale del gruppo
  this.Level = -1;                    // Livello del gruppo
  this.ParentPanel = panel;           // Pannello a cui appartiene il gruppo
  this.VisualStyle = 0;               // Visual Style del gruppo
  this.Expanded = false;              // Il gruppo e' espanso? (mostra i valori contenuti?)
  this.Identifier = "";               // Identificatore del gruppo
  //
  this.GroupList = new Array();       // Sotto-gruppi
  //
  // Variabili locali al gruppo
  this.ParentGroup = null;            // Eventuale gruppo padre (!- referenza circolare)
  this.Index = 0;                     // Posizione nell'array dei PValues
  this.Aggregations = new Array();    // Aggregazioni relative al gruppo
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo nodo
  this.ExpandEventDef = RD3_Glb.EVENT_ACTIVE;   	 // Il click sulla box/caption
}

// *******************************************************************
// Inizializza questo PListGroup leggendo i dati da un nodo <lsg> XML
// *******************************************************************
PListGroup.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
	this.LoadProperties(node);
	//
	// Gestisco eventuali figli
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
		  // Gruppo figlio
			case "lsg":
			{
				var newgrp = new PListGroup(this.ParentPanel);
				newgrp.ParentGroup = this;
	      this.GroupList.push(newgrp);
				newgrp.LoadFromXml(objnode);				
			}
			break;
			
			// Funzione di Aggregazione
			case "agr":
			{
			  // Inserisco nella posizione relativa al campo il risultato della funzione di aggregazione da mostrare
			  var agr = objnode.getAttribute("shw");
			  var fidx = objnode.getAttribute("fid");
				//
				this.Aggregations[parseInt(fidx)] = agr;
			}
			break;
		}
	}
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
PListGroup.prototype.LoadProperties = function(node)
{
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
      case "lbl": this.SetLabel(valore); break;
      case "str": this.SetStartingRecord(parseInt(valore)); break;
      case "end": this.SetEndingRecord(parseInt(valore)); break;
      case "lvl": this.SetLevel(parseInt(valore)); break;
      case "sty": this.SetVisualStyle(parseInt(valore)); break;
      case "exp": this.Expanded = (valore=="1"); break;
      
      case "evt": this.ExpandEventDef = parseInt(valore); break;
      
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
PListGroup.prototype.SetLabel = function(value) 
{
  this.Label = value; 
}

PListGroup.prototype.SetStartingRecord = function(value) 
{
  this.StartingRecord = value;
}

PListGroup.prototype.SetEndingRecord = function(value) 
{
  this.EndingRecord = value;
}

PListGroup.prototype.SetLevel = function(value) 
{
  this.Level = value;
  //
  // Il livello radice deve sempre essere espanso.. (su Mobile sono sempre tutti espansi..)
  if (this.Level == -1)
    this.Expanded = true;
}

PListGroup.prototype.SetVisualStyle= function(value) 
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
			this.VisualStyle = RD3_DesktopManager.ObjectMap["vis:"+value];
		}
	}
}

PListGroup.prototype.SetExpandedEx = function(ev, value) 
{ 
  this.SetExpanded(value); 
}
PListGroup.prototype.SetExpanded = function(value) 
{
  this.Expanded = value; 
  //
  // Aggiorno il pannello in base al mio nuovo stato
  this.ParentPanel.UpdateScrollBox();
  this.ParentPanel.ResetPosition = true;
  this.ParentPanel.RefreshToolbar = true;
}

PListGroup.prototype.Unrealize = function() 
{
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Annullo la referenza circolare; aiuto il garbage collector
  this.ParentGroup = null;
  //
  var n = this.GroupList.length;
  //
  // Passo il messaggio ai miai figli
  for (var i=0; i<n; i++)
  {
    this.GroupList[i].Unrealize();
  }
}

//******************************************************
// Dato l'indice di un PValue restituisce l'offset 
// da sommargli per tenere conto delle intestazioni
// dei gruppi che precedeno il valore
//******************************************************
PListGroup.prototype.GetPValOffset = function(idx) 
{
  // Se il valore appartiene al mio gruppo
  if (this.StartingRecord<=idx)
  {
    // Incremento il suo indice di uno per indicare la mia label (solo se non sono il gruppo radice)
    var ofs = this.Level==-1 ? 0 : 1;
    //
    // Se ho dei figli anche loro hanno delle intestazioni
    if (this.GroupList.length>0)
    {
      var n = this.GroupList.length;
      //
      for (var i=0; i<n; i++)
      {
        ofs += this.GroupList[i].GetPValOffset(idx);
      }
    }
    //
    return ofs;
  }
  //
  return 0;
}

//************************************************************************************
// Dato un array inserisce nelle celle corrette i gruppi, tenendo conto dell'offset
// dovuto alle intestazioni dei gruppi precedenti
//************************************************************************************
PListGroup.prototype.AddGroups = function(pvArray, offs) 
{
  if(!pvArray)
    return;
  //
  var myoffs = offs;
  //
  // Se non sono il gruppo radice mi infilo
  if (this.Level!=-1)
  {
    // Incremento di 1 l'offset, per indicare che tutti i gruppi seguenti devono shiftare di uno
    myoffs = offs+1;
    //
    // Mi infilo nell'array alla posizione corretta
    this.Index = this.StartingRecord+offs;
    pvArray[this.Index] = this;
  }
  //
  // Se ho dei gruppi contenuti faccio infilare anche loro
  var n = this.GroupList.length;
  for (var i=0; i<n; i++)
  {
    myoffs = this.GroupList[i].AddGroups(pvArray, myoffs);
  }
  //
  return myoffs;
}


//**********************************************************************
// Verifica che una riga sia visibile, in base allo stato di espansione
// dei gruppi e dei sottogruppi
//**********************************************************************
PListGroup.prototype.IsRowVisible = function(nrow, getHeader) 
{
  if (this.StartingRecord<=nrow && nrow<=this.EndingRecord)
  {
    // Se non sono espanso ma mi chiedono la prima riga con getHeader a true dico che e' visibile: 
    // in quel caso e' la mia intestazione
    if (getHeader && !this.Expanded && nrow==this.StartingRecord)
      return true;
    //
    // Se io non sono espanso la riga non e' di sicuro visibile..
    if (!this.Expanded)
      return false;
    //
    // Se io sono espanso passo la palla ai miei figli
    var vis = true;
    var n = this.GroupList.length;
    for (var i=0; i<n; i++)
    {
      vis &= this.GroupList[i].IsRowVisible(nrow, getHeader);
    }
    //
    return vis;
  }
  //
  // Se la riga non e' contenuta in me non so nulla del suo stato, quindi per me e' visibile
  return true;
}

// *******************************************************************
// Restituisce se il gruppo e' visibile in un pannello Gruppato, 
// in base allo stato di espansione dei suoi padri
// *******************************************************************
PListGroup.prototype.IsVisibleInGrouped = function()
{
  var vis = true;
  var par = this.ParentGroup;
  //
  while (par != null)
  {
    vis &= par.Expanded;
    //
    par = par.ParentGroup;
  }
  //
  return vis;
}


// *******************************************************************
// E' stato cliccato il pulsante di apertura/chiusura gruppo
// *******************************************************************
PListGroup.prototype.OnExpandGrp = function()
{
  // Cambio lo stato di espansione del gruppo
  this.SetExpanded(!this.Expanded);
  //
  // Mi posiziono nella riga corretta se ho aperto un gruppo che mostra i valori
  var rw = -1;
  if (this.ParentPanel.ListGroupRoot.IsRowVisible(this.StartingRecord))
  {
    var actrow = this.ParentPanel.ListGroupRoot.GetRowPos(this.StartingRecord, false);
    var actpos = this.ParentPanel.ListGroupRoot.GetRowPos(this.ParentPanel.ActualPosition);
    //
    rw = actrow - actpos;
    if (rw<0)
      rw = 0;
    if (rw>=this.ParentPanel.NumRows)
      rw = this.ParentPanel.NumRows-1;
    //
    this.ParentPanel.SetActualRow(rw);
    //
    RD3_KBManager.CheckFocus = false;
    RD3_KBManager.DontCheckFocus = true;
  }
  //
  // Se collasso un gruppo cerco di mostrare il pannello pieno
  if (!this.Expanded)
  {
    var pp = this.ParentPanel;
    //
    // Se la posizione relativa alla prima riga del pannello + le righe visibili e' maggiore delle righe del pannello significa
    // che compariranno dei vuoti, in questo caso sposto la posizione attuale in modo da non farli comparire
    var tr = pp.GetTotalRows() + (pp.TotalRows-pp.ListGroupRoot.EndingRecord);
    if (pp.CompactActualPosition + (pp.NumRows - 1) > tr)
    {
      // Calcolo le righe vuote visibili, e cerco di recuperarle
      var newpos = pp.CompactActualPosition - (pp.CompactActualPosition + pp.NumRows - tr) + 1;
      if (newpos <=0)
        newpos = 1;
      //
      var actps = pp.ListGroupRoot.GetServerIndex(newpos, false);
      this.ParentPanel.SetActualPosition(actps);
      //
      RD3_KBManager.CheckFocus = false;
      RD3_KBManager.DontCheckFocus = true;
    }
  }
  //
  // Lancio evento (1 espanso, 0 collassato)
  var ev = new IDEvent("grlexp", this.Identifier, null, this.ExpandEventDef, this.Expanded ? "1" : "0", rw, RD3_Glb.IsMobile() ? "-1" : this.ParentPanel.GetTotalRows());
}


//*********************************************************************************
// Restituisce l'indice nell'array dei PValues della riga di pannello (actualpos+ nrow)
// Sul nodo radice viene chiamato con offs e rootgroups nulli, sugli altri viene chiamato
// in maniera ricorsiva passando l'offset (le righe presenti prima del gruppo) ed il 
// gruppo radice
//*********************************************************************************
PListGroup.prototype.GetRowIndex = function(actualpos, nrow, offs , rootgroups)
{
  var index = -1;
  var row = actualpos + nrow;
  //
  // Gruppo Root
  if (this.Level == -1)
  {
    var actrow = 0;
    var n = this.GroupList.length;
    //
    // Ciclo su tutti i gruppi figli e chiedo quante righe hanno, se trovo un gruppo al cui interno cade la riga 
    // che cerco allora chiedo a lui l'indice
    for (var i=0; i<n; i++)
    {
      var ti = actrow + this.GroupList[i].GetNumRows();
      //
      if (actrow<=row && row<=ti)
      {
        index = this.GroupList[i].GetRowIndex(actualpos, nrow, actrow, this);
        break;
      }
      //
      actrow = ti;
    }
    //
    if (index == -1)
    {
      // Provo a restituire l'indice di una delle nuove righe..
      // Per prima cosa scopro quante righe reali ci sono nel pannello
      var newrowidx = actualpos + nrow - this.GetNumRows();
      index = this.GetPValOffset(this.EndingRecord) + this.EndingRecord + newrowidx;
    }
    //
    return index;
  }
  else
  {
    // Se arrivo qui la riga e' contenuta dentro di me, per prima cosa verifico se e' la mia intestazione
    if (offs+1 == row)
    {
      return this.Index;
    }
    //
    // Tengo conto della mia intestazione
    offs = offs+1
    //
    // Non e' la mia intestazione, se ho dei sottogruppi chiedo a loro di restituire l'offset
    if (this.GroupList.length>0)
    {
      var n = this.GroupList.length;
      //
      for (var i=0; i<n; i++)
      {
        var ti = offs + this.GroupList[i].GetNumRows();
        //
        if (offs<=row && row<=ti)
        {
          index = this.GroupList[i].GetRowIndex(actualpos, nrow, offs, rootgroups);
          break;
        }
        //
        offs = ti;
      }
      //
      return index;
    }
    else
    {
      // L'indice cercato deve essere uno dei miei valori.. 
      for (var i=this.StartingRecord; i<= this.EndingRecord; i++)
      {
        offs = offs+1;
        if (offs == row)
          return rootgroups.GetPValOffset(i) + i;
      }
      //
      // Non e' uno dei miei valori
      return -1;
    }
  }
}


//*********************************************************************************
// Restitituisco la riga della visione compatta relativa alla riga reale 
// passata come parametro
//*********************************************************************************
PListGroup.prototype.GetRowPos = function(index, except, getHeader)
{
  // Ritorno -1 se la riga non fa parte del gruppo, tranne nel caso del gruppo radice, in quel caso restituisco l'indice delle nuove righe
  if (index<this.StartingRecord || index>this.EndingRecord)
  {
    if (this.Level ==-1 && index>this.EndingRecord)
    {
      // Provo a restituire l'indice di una delle righe non gruppate
      // La riga nuova che mi interessa e' index - EndingRecord, a questa sommo le righe dei gruppi della visione compatta per
      // sapere in quale riga della visione compatta vado a finire
      return this.GetNumRows()+ index-this.EndingRecord;
    }
    else
    {
      return -1;
    }
  }
  //
  // La riga fa parte di me, ma se non sono espanso allora mostro solo la mia intestazione)
  if (!this.Expanded)
    return 1;
  //
  if (except==undefined || except==null)
    except = true;
  //
  // La riga e' visibile? se si continuo, altrimenti mi fermo qui, l'indice che cerco sono io
  if (!this.IsRowVisible(index, getHeader) && this.Level!=-1)
    return 1;
  //
  // ECCEZIONE: se la riga e' visibile, contenuta in questo gruppo, io non sono il gruppo radice e la riga e' 1 mi fermo: 
  // questa gestione fa si che aprendo il primo gruppo non venga selezionata sempre la riga del valore, altrimenti non si potrebbe scrollare
  // per vedere l'header del gruppo e chiuderlo.. pero' in alcuni casi e' necessario sapere la riga del Valore 1, quindi esiste un parametro
  // che impedisce questo controllo
  if (this.IsRowVisible(index, getHeader) && this.Level!=-1 && index==1 && except)
    return 1;
  //
  // Se ho dei sottogruppi chiedo a loro
  if (this.GroupList.length>0)
  {
    var row = this.Level==-1 ? 0 : 1;   // La root non ha l'intestazione, gli altri gruppi si..
    //
    var n = this.GroupList.length;
    //
    for (var i=0; i<n; i++)
    {
      // Cerco l'indice del valore dentro il sottogruppo
      var offs = this.GroupList[i].GetRowPos(index, except, getHeader);
      //
      // Se il sottogruppo non contiene il valore allora sommo all'offset le righe visibili del gruppo
      if (offs==-1)
      {
        row += this.GroupList[i].GetNumRows();
      }
      else
      {
        // Se il sottogruppo contiene la riga che cerco lo sommo a tutti gli offset che ho trovato e smetto
        row += offs;
        break;
      }
    }
    //
    return row;
  }
  else
  {
    // Sono un gruppo foglia espanso, calcolo a quale riga corrisponderebbe il valore (+1 per tenere conto della mia intestazione..)
    return (index - this.StartingRecord + 1) +1;
  }
}



//*********************************************************************************
// Restituisce per la riga voluta della visione compatta il relativo indice nella 
// visione server, cioe' se e' un PVal ne restituisce l'Index mentre se e' un gruppo
// ne restituisce lo StartingRecord
// nrowidx - indica se per le nuove righe devo restituire il vero indice oppure
//           l'ultimo record del pannello (ad esempio quando scrollo devo dire al server 
//           l'ultimo record, quando cambio riga devo dire l'indice..
//*********************************************************************************
PListGroup.prototype.GetServerIndex = function(row, nrowidx ,offs,  rootgroups)
{
  var index = -1;
  //
  // Gruppo Root
  if (this.Level == -1)
  {
    var actrow = 0;
    var n = this.GroupList.length;
    //
    // Ciclo su tutti i gruppi figli e chiedo quante righe hanno, se trovo un gruppo al cui interno cade la riga 
    // che cerco allora chiedo a lui l'indice
    for (var i=0; i<n; i++)
    {
      var ti = actrow + this.GroupList[i].GetNumRows();
      //
      if (actrow<=row && row<=ti)
      {
        index = this.GroupList[i].GetServerIndex(row, nrowidx, actrow, this);
        break;
      }
      //
      actrow = ti;
    }
    //
    if (index == -1)
    {
      // Restituisco l'ultimo record del pannello se non mi e' chiesto di restituire l'index di una delle nuove righe
      if (!nrowidx)
        return this.EndingRecord;
      //
      // Se mi e' chiesto di restituire l'indice fittizio delle righe nuove lo restituisco
      return (row - actrow)+this.EndingRecord;
    }
    //
    return index;
  }
  else
  {
    // Se arrivo qui la riga e' contenuta dentro di me, per prima cosa verifico se e' la mia intestazione
    if (offs+1 == row)
    {
      return this.StartingRecord;
    }
    //
    // Tengo conto della mia intestazione
    offs = offs+1
    //
    // Non e' la mia intestazione, se ho dei sottogruppi chiedo a loro di restituire l'offset
    if (this.GroupList.length>0)
    {
      var n = this.GroupList.length;
      //
      for (var i=0; i<n; i++)
      {
        var ti = offs + this.GroupList[i].GetNumRows();
        //
        if (offs<=row && row<=ti)
        {
          index = this.GroupList[i].GetServerIndex(row, nrowidx, offs, rootgroups);
          break;
        }
        //
        offs = ti;
      }
      //
      return index;
    }
    else
    {
      // L'indice cercato deve essere uno dei miei valori.. 
      for (var i=this.StartingRecord; i<= this.EndingRecord; i++)
      {
        offs = offs+1;
        if (offs == row)
          return i;
      }
      //
      // Non e' uno dei miei valori
      return -1;
    }
  }
}


//*********************************************************************************
// Restituisce il numero di righe visibili nel gruppo
//*********************************************************************************
PListGroup.prototype.GetNumRows = function()
{
  // Se un gruppo non e' espanso mostra solo la sua intestazione, quindi 1 riga
  if (!this.Expanded)
    return 1;
  //
  // Se ho dei sottogruppi chiedo a loro 
  if (this.GroupList.length>0)
  {
    var n = this.GroupList.length;
    var rows = this.Level==-1 ? 0 : 1;   // La root non ha l'intestazione, gli altri gruppi si..
    //
    // Il numero di righe dipende dal numero di righe mostrate dai gruppi + 1 (la mia intestazione)
    for (var i=0; i<n; i++)
    {
      rows += this.GroupList[i].GetNumRows();
    }
    //
    return rows;
  }
  else
  {
    // Gruppo vuoto, non ha record!
    if (this.StartingRecord === 1 && this.EndingRecord === 0)
      return 0;
    //
    // Le righe mostrate dipendono dai miei valori + 1 (la mia intestazione)
    return (this.EndingRecord - this.StartingRecord +1) +1;
  }
}

//*****************************************************
// Sezione di compatibilita' con PValue
//*****************************************************
PListGroup.prototype.IsVisible = function()
{
  return this.IsVisibleInGrouped();
}

PListGroup.prototype.GetVisualStyle= function()
{
  return this.VisualStyle;
}

PListGroup.prototype.AfterProcessResponse= function()
{
}

// ********************************************************************************
// Aggiorna il row selector, nascondendolo
// ********************************************************************************
PListGroup.prototype.UpdateRowSel= function(rsidx)
{
	var rsobj = (this.ParentPanel && this.ParentPanel.RowSel ? this.ParentPanel.RowSel[rsidx] : null);
	if (RD3_ServerParams.CompletePanelBorders && this.ParentPanel && this.ParentPanel.RowSel)
    rsobj = this.ParentPanel.RowSel[rsidx] ? this.ParentPanel.RowSel[rsidx].firstChild : null;
	//
	if (rsobj)
	{
		rsobj.style.display = "none";
	}
	else
	  this.ParentPanel.UpdateRSel = true;   // Lo faccio alla fine
}


//*********************************************************************************
// Data una riga della visione compatta restituisce -1 se a quella riga c'e' un 
// intestazione di gruppo oppure il numero di riga
//*********************************************************************************
PListGroup.prototype.IsHeader = function(compactrow, offs,  rootgroups)
{
  var index = -1;
  //
  // Gruppo Root
  if (this.Level == -1)
  {
    var actrow = 0;
    var n = this.GroupList.length;
    //
    // Ciclo su tutti i gruppi figli e chiedo quante righe hanno, se trovo un gruppo al cui interno cade la riga 
    // che cerco allora chiedo a lui l'indice
    for (var i=0; i<n; i++)
    {
      var ti = actrow + this.GroupList[i].GetNumRows();
      //
      if (actrow<=compactrow && compactrow<=ti)
      {
        index = this.GroupList[i].IsHeader(compactrow, actrow, this);
        break;
      }
      //
      actrow = ti;
    }
    //
    return index;
  }
  else
  {
    // Se arrivo qui la riga e' contenuta dentro di me, per prima cosa verifico se e' la mia intestazione
    if (offs+1 == compactrow)
      return -1;
    //
    // Tengo conto della mia intestazione
    offs = offs+1
    //
    // Non e' la mia intestazione, se ho dei sottogruppi chiedo a loro di restituire l'offset
    if (this.GroupList.length>0)
    {
      var n = this.GroupList.length;
      //
      for (var i=0; i<n; i++)
      {
        var ti = offs + this.GroupList[i].GetNumRows();
        //
        if (offs<=compactrow && compactrow<=ti)
        {
          index = this.GroupList[i].IsHeader(compactrow, offs, rootgroups);
          break;
        }
        //
        offs = ti;
      }
      //
      return index;
    }
    else
    {
      // L'indice cercato deve essere uno dei miei valori.. 
      for (var i=this.StartingRecord; i<= this.EndingRecord; i++)
      {
        offs = offs+1;
        if (offs == compactrow)
          return i;
      }
      //
      // Non e' uno dei miei valori
      return -1;
    }
  }
}
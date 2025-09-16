// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PValue: Rappresenta un valore di un
// campo di pannello
// ************************************************

function PValue(pfield)
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = null;       // Identificatore del campo (univoco)
  //
  this.Text = "";               // Stringa da mostrare nel campo
  this.Index = 0;               // Indice del valore (da 1 a TotalRows + VisibleRows)
  this.Visible = -1;            // Cella visibile? (-1 vedi campo, 0 no, 1 si')
  this.Enabled = -1;            // Cella abilitata? (-1 vedi campo, 0 no, 1 si')
  this.VisualStyle = -1;        // Stile visuale della cella (-1 vedi campo)
  this.Tooltip = "";            // Tooltip della cella
  this.ErrorText = "";          // Stringa di errore per il campo
  this.ErrorType = 0;           // Tipo di errore nel campo (0 nessuno, 1 errore, 2 warning con conferma, 3 warning senza conferma)
  this.ValueListIdx = -1;       // L'indice del valore attuale nella value list
  this.BackColor = "";          // Colore di background
  this.ForeColor = "";          // Colore di foreground
  this.FontMod = "";            // Proprieta' del carattere
  this.Mask = "";               // Mascheratura
  this.Alignment = -1;          // Allineamento 
  this.Badge = "";              // Badge dinamico del value
  this.CSSClass = "";           // Classe dinamica del value
  //
  // Le seguenti variabili vengono inizializzate solo quando serve
  //this.ValueList = null;      // La lista valori specifica per questo campo
  //this.ValueListType = 0;     // 0=nessuna lista valori, 1=lista valori smart lookup, 2=autolookup, 3=lookup semplice
  //this.LastValueListType = 0; // valore precedente del campo ValueListType
  //
  //this.BlobMime = "";         // Tipo di contenuto del blob (text, image, size, ...)
  //this.HTMLBlobMime = "";     // Tipo di contenuto del blob completo
  //this.BlobUrl = "";          // URL da aprire in caso di ZOOM blob
  //
  // Altre variabili di modello...
  this.ParentField = pfield;    // L'oggetto campo cui il valore appartiene
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;        // Se vero, gli oggetti del DOM sono gia' stati creati (in PField pero')
  //
  this.RefreshScreen = false;   // Se vero devo effettuare il refresh dello screen
}


// *******************************************************************
// Inizializza questa box leggendo i dati da un nodo <box> XML
// *******************************************************************
PValue.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
  //
  // Carico valori della lista valori
  var objlist = node.childNodes;
  var n = objlist.length;
  //
  for (var i=0; i<n; i++) 
  {
    var objnode = objlist.item(i);
    var nome = objnode.nodeName;
    //
    // In base al tipo di oggetto, invio il messaggio di caricamento
    switch (nome)
    {
      case "vls": // value list specifica per questo campo
      {
        this.ValueListType = parseInt(objnode.getAttribute("typ"));
        //
        if (this.ValueListType==0)
        {
          // Ho bisogno di segnarmi che in questa comunicazione la value list e' stata esplicitamente svuotata
          // dal server. Il semaforo verra' rimosso alla fine della comunicazione (AfterProcessResponse)
          this.ValueList = null;
          this.ValueListCleared = true;
        }
        else
        {
          this.ValueList = new ValueList();
          this.ValueList.LoadFromXml(objnode);
          this.RefreshScreen = true;
          //
          // Rimuovo il segnale di svuotamento lista
          if (this.ValueListCleared)
            delete this.ValueListCleared;
        }
      }
      break;

      case "cse":
      {
        // Creo il custom element
        var cls = objnode.getAttribute("cls");
        this.CustomElement = CustomElement.createByName(cls, this);
        this.CustomElement.LoadFromXml(objnode);
        //
        if (this.ParentField.Realized)
          this.UpdateScreen();
      }
      break;
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
PValue.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta' + caricamento lista valori
  this.LoadFromXml(node);
  //
  // Effetto aggironamento a video se richiesto
  if (this.RefreshScreen && this.ParentField.Realized)
    this.UpdateScreen();
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
PValue.prototype.LoadProperties = function(node)
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
      case "idx": this.SetIndex(parseInt(valore)); break;
      case "vis": this.SetVisible(parseInt(valore)); break; // NOTA: non e' un valore bool
      case "ena": this.SetEnabled(parseInt(valore)); break; // NOTA: non e' un valore bool     
      case "sty": this.SetVisualStyle(parseInt(valore)); break;
      case "tip": this.SetTooltip(valore); break;
      case "err": this.SetErrorText(valore); break;
      case "ety": this.SetErrorType(parseInt(valore)); break;
      case "rse": this.SetRowSelector(parseInt(valore)); break;
      case "mim": this.SetBlobMime(valore); break;
      case "mty": this.SetHTMLBlobMime(valore); break;
      case "url": this.SetBlobUrl(valore); break;
      case "bkc": this.SetBackColor(valore); break;
      case "frc": this.SetForeColor(valore); break;
      case "msk": this.SetMask(valore); break;
      case "ftm": this.SetFontMod(valore); break;
      case "aln": this.SetAlignment(parseInt(valore)); break;
      case "bdg": this.SetBadge(valore); break;
      case "cln": this.SetCSSClass(valore); break;
      
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
PValue.prototype.SetIndex= function(value) 
{
  if (value!=undefined)
  {
    this.Index = value;
  }
}

PValue.prototype.SetVisible= function(value) 
{
  var old = this.Visible;
  if (value!=undefined)
    this.Visible = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.Visible)
  {
    this.RefreshScreen = true;
  }
}

PValue.prototype.SetEnabled= function(value) 
{
  var old = this.Enabled;
  if (value!=undefined)
    this.Enabled = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.Enabled)
  {
    this.RefreshScreen = true;
  }
}

PValue.prototype.SetVisualStyle= function(value) 
{
  var old = this.VisualStyle;
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
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.VisualStyle)
  {
    this.RefreshScreen = true;
  }
}

PValue.prototype.SetTooltip= function(value) 
{
  var old = this.Tooltip;
  if (value!=undefined)
    this.Tooltip = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.Tooltip)
  {
    this.RefreshScreen = true;
  }
}

PValue.prototype.SetText= function(value) 
{
  var old = this.Text;
  if (value!=undefined)
    this.Text = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.Text)
    this.RefreshScreen = true;
}

PValue.prototype.SetErrorText= function(value) 
{
  var old = this.ErrorText;
  if (value!=undefined)
    this.ErrorText = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.ErrorText)
  {
    this.RefreshScreen = true;
  }
}

PValue.prototype.SetErrorType= function(value) 
{
  var old = this.ErrorType;
  if (value!=undefined)
    this.ErrorType = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.ErrorType)
  {
    this.RefreshScreen = true;
  }
}

PValue.prototype.SetRowSelector= function(value) 
{
  var old = this.RowSelector;
  if (value!=undefined)
    this.RowSelector = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.RowSelector)
  {
    this.RefreshScreen = true;
    //
    // Non posso semplicemente impostare RefreshScreen a true, dato
    // che io sono il primo campo e non e' detto che sia io quello
    // modificato... quindi potrebbe non esserci nell'XML un nodo 
    // CHG che avvia il mio ChangeProperties
    this.UpdateRowSel();
  }
  else if (!this.ParentField.Realized)
    this.ParentField.ParentPanel.UpdateRSel = true;
}

PValue.prototype.SetBlobMime= function(value) 
{
  if (value!=undefined)
    this.BlobMime = value;
  //
  // Questa proprieta' si aggiorna insieme al testo, non devo fare nulla
}

PValue.prototype.SetHTMLBlobMime= function(value) 
{
  if (value!=undefined)
    this.HTMLBlobMime = value;
  //
  // Questa proprieta' si aggiorna insieme al testo, non devo fare nulla
}


PValue.prototype.SetBlobUrl= function(value) 
{
  if (value!=undefined)
    this.BlobUrl = value;
  //
  // Questa proprieta' si aggiorna insieme al testo, non devo fare nulla (in RD3)
  //
  if (window.RD4_Enabled && this.BlobUrl.substr(0, 11) != "?WCI=IWBlob" && this.ParentField.DownloadSource)
  {
    this.ParentField.OnBlobCommand(null, this.ParentField.DownloadSource);
    this.ParentField.DownloadSource = "";
  }
}

PValue.prototype.SetBackColor = function(value)
{
  var old = this.BackColor;
  if (value!=undefined)
    this.BackColor = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.BackColor)
    this.RefreshScreen = true;
}

PValue.prototype.SetForeColor = function(value)
{
  var old = this.ForeColor;
  if (value!=undefined)
    this.ForeColor = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.ForeColor)
    this.RefreshScreen = true;
}

PValue.prototype.SetFontMod = function(value)
{
  var old = this.FontMod;
  if (value!=undefined)
    this.FontMod = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.FontMod)
    this.RefreshScreen = true;
}

PValue.prototype.SetMask = function(value)
{
  if (value!=undefined)
    this.Mask = value;
}

PValue.prototype.SetAlignment = function(value)
{
  var old = this.Alignment;
  if (value!=undefined)
    this.Alignment = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.Alignment)
    this.RefreshScreen = true;
}

PValue.prototype.SetBadge = function(value)
{
  var old = this.Badge;
  if (value!=undefined)
    this.Badge = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.Badge)
    this.RefreshScreen = true;
}

PValue.prototype.SetCSSClass = function(value)
{
  var old = this.CSSClass;
  if (value!=undefined)
    this.CSSClass = value;
  //
  // Se il campo e' realizzato tento aggiornamento visuale
  if (this.ParentField.Realized && old != this.CSSClass)
    this.RefreshScreen = true;
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
PValue.prototype.Realize = function(parent)
{
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  //
  this.SetVisible();
  this.SetEnabled();
  this.SetVisualStyle();
  this.SetTooltip();
  this.SetText();
  this.SetErrorText();
  this.SetErrorType();
}


// **********************************************************************
// Rimuove questo oggetto dalla mappa e dal DOM
// **********************************************************************
PValue.prototype.Unrealize = function()
{
  // Tolgo l'oggetto dalla mappa comune
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Controllo l'ActiveObject del Kb: se sono io lo elimino
  if (RD3_KBManager.ActiveObject == this)
    RD3_KBManager.ActiveObject = null;
}


// ************************************************************************
// Ritorna True se il campo e' visibile
// ************************************************************************
PValue.prototype.IsVisible = function(evento)
{
  // Campo non visibile
  if (!this.ParentField.IsVisible())
    return false;
  //
  // Cella non visibile
  if (this.Visible == 0)
    return false;
  //
  return true;
}


// *********************************************
// Restituisce true se il value e' abilitato
// *********************************************
PValue.prototype.IsEnabled = function()
{
  // Un campo QBE in Lista e' sempre abilitato se il campo puo' cercare
  if (this.ListQBEValue)
    return this.ParentField.QBEEnabled && (this.ParentField.IdxPanel <= 0 || (this.ParentField.IdxPanel > 0 && (this.ParentField.AutoLookup || this.ParentField.LKE))) && (this.ParentField.ParentPanel.Status == RD3_Glb.PS_DATA && !this.ParentField.ParentPanel.DOModified);
  //
  // Chiamo il metodo del padre passandogli il mio numero di riga, per far calcolare
  // correttamente lo stato di abilitazione (cosi' controlla anche il QBE e il caninsert/canupdate)
  return this.ParentField.IsEnabled(this.Index + 1);
}


// ************************************************************************
// Ritorna la lista valori da applicare in questa cella
// ************************************************************************
PValue.prototype.GetValueList = function()
{
  if (this.ValueList)
    return this.ValueList;
  //
  return this.ParentField.ValueList;
}


// ************************************************************************
// Ritorno il visual style da applicare in questa cella
// ************************************************************************
PValue.prototype.GetVisualStyle = function()
{
  var vs = this.VisualStyle;
  if (vs == -1)
    vs = this.ParentField.VisualStyle;  
  return vs;
}


// ************************************************************************
// Ritorna l'immagine del pulsante di attivazione
// "" = nessun attivatore, oppure attivatore nascosto
// ************************************************************************
PValue.prototype.ActivatorImage = function(vs, ignoreWidth)
{
  var pf = this.ParentField;
  var en = this.IsEnabled();
  //
  // In QBE solo la prima riga mostra gli attivatori
  if (pf.ParentPanel.Status == RD3_Glb.PS_QBE && this.Index>1)
    return "";
  //
  if (this.ListQBEValue) {
    // Mostro l'attivatore per il QBE in lista se posso filtrare o se posso ordinare
    if ((pf.CanSort && pf.VisCanSort() && pf.ParentPanel.UseListQBE == RD3_Glb.PAN_QBEHEADER) || (pf.QBEEnabled && (pf.IdxPanel <= 0 || (pf.IdxPanel > 0 && (pf.AutoLookup || pf.LKE)))))
      return pf.QBEFilter ? "filter.png" : "filter_no.png";
    else
      return "";
  }
  //
  // Il campo non deve mostrare l'immagine di attivazione
  if (pf.ActWidth<=0 && !ignoreWidth)
    return "";
  //
  // Tranne nel caso che abbiano un vs senza hyperlink, il parametro ShowDisabledFieldActivator e' true ed il campo ha un attivatore (non vale per valuelist, data e smartlookup)  
  if (!en && !RD3_ServerParams.ShowDisabledIcons && !(vs && !pf.VisHyperLink(vs) && RD3_ServerParams.ShowDisabledFieldActivator && pf.CanActivate && pf.ActivableDisabled))
    return "";
  //
  // Attivatore personalizzato?
  if (pf.ActImage!="")
    return pf.ActImage;
  //
  // I campi data mostrano l'attivatore specifico (se non sono attivabili)
  if (RD3_Glb.IsDateOrTimeObject(pf.DataType) && !RD3_Glb.IsMobile() && !pf.CanActivate) {
    // In QBE non mostro l'attivatore per i campi DT_TIME, non posso fare ricerche con i :
    if ((pf.ParentPanel.Status == RD3_Glb.PS_QBE && pf.DataType == 7))
      return "";
    else
      return en ? "aeda.gif" : "adda.gif";
  }
  //
  // I campi smart lookup mostrano l'attivatore combo se richiesto
  if (RD3_ServerParams.SmartLookupIcon && pf.IdxPanel>0)
    return en ? "aeco.gif" : "adco.gif";
  //
  if (pf.HasValueSource)
    return en ? "aeco.gif" : "adco.gif";
  //
  if (pf.CanActivate)
    return (en || pf.ActivableDisabled)? "aelo.gif" : "adlo.gif";
  //  
  // Nessun attivatore richiesto
  return "";
}


// *********************************************
// Restituisce l'oggetto attivatore se c'e'
// *********************************************
PValue.prototype.GetActivator = function(node)
{
  if (node.hasChildNodes())
  {
    var chlist = node.childNodes;
    var n = chlist.length;
    //
    for (var i=n-1; i>=0; i--)
     {
       var o = chlist[i];
       if (o.tagName == "IMG" && o.className == "panel-value-activator")
        return o;
    }
  }
  return null;
}


// ************************************************************************
// Ritorna
// 1 se l'attivatore deve andare a sinistra
// 2 se l'attivatore deve andare a destra
// ************************************************************************
PValue.prototype.ActivatorPosition = function(vs)
{
  if (RD3_ServerParams.RightAlignedIcons)
    return 2;
  //
  if (this.ListQBEValue)
    return 2; // DX
  //
  // Controllo allineamento campo
  var a = vs.GetAlignment(1); // VISALI_VALUE
  if (this.Alignment != -1)
    a = this.Alignment;
  else if (this.ParentField.Alignment != -1)
    a = this.ParentField.Alignment;
  //
  if (a==1) // VISALN_AUTO
    a = (RD3_Glb.IsNumericObject(this.ParentField.DataType)) ? 4 : 2; // VISALN_DX : VISALN_SX
  if (a!=4) // VISALN_DX
    a = 2;  // VISALN_SX
  //
  // Dalla parte opposta del valore...
  if (a==2)
    return 2; // DX
  else
    return 1; // SX
}


// ********************************************************************************
// Gestore evento di doppio click su campo
// ********************************************************************************
PValue.prototype.OnDoubleClick= function(evento)
{
  // Le combo disabilitate non cliccabili (vs.HasHyperlink = false)
  // risultano avere l'ActivatorImage!="" percui controllo meglio
  var canclick = true;
  var srcobj = (window.event)?evento.srcElement:evento.target;
  var cell = RD3_KBManager.GetCell(srcobj);
  if (cell && (cell.ControlType == 3 || cell.ControlType == 30) && !cell.IsCellClickable)
    canclick = false;
  //
  // Se il campo e' un DATE con un warning con conferma allora il doppio click non deve aprire il calendario ma confermare il valore
  if (cell && RD3_Glb.IsDateTimeObject(this.ParentField.DataType) && this.ErrorType==2)
    canclick = false;
  //
  // Se c'e' l'attivatore clicco li', altrimenti
  // clicco sul row selector
  var vs = this.GetVisualStyle();
  if (canclick && this.ActivatorImage(vs, true)!="")
  {
    // Se sono una cella di filtro in lista (this.ListQBEValue) e' giusto aprire il filtro al doppio click quindi faccio gestire l'attivatore
    // ma non se sono un check : per i check il filtro non ha senso perche' non aggiunge nessuna opzione
    // Prima di attivare invio eventuali variazioni
    this.SendChanges(evento);
    if (!(vs.GetContrType() == 4 && this.ListQBEValue))
      this.ParentField.OnClickActivator(evento);
  }
  else
  {
    var sendactivate = true;
    //
    // Non mando activate row se il doppio click e' avvenuto sull'attivatore combo
    if (RD3_Glb.HasClass(srcobj,"combo-activator"))
      sendactivate = false;
    // Nemmeno se faccio doppio click su un checkbox, radio, button (probabimente non volevo!)
    if (cell && cell.ControlType>=4 && cell.ControlType<=6)
      sendactivate = false;
    //
    if (sendactivate)
    {
      if (this.ParentField.ParentPanel.IsGrouped())
        this.ParentField.ParentPanel.OnRowSelectorClick(evento, this.ParentField.ParentPanel.GetRowForIndex(this.Index));
      else
        this.ParentField.ParentPanel.OnRowSelectorClick(evento, this.Index-this.ParentField.ParentPanel.ActualPosition);
    }
  }
}


// ********************************************************************************
// Torna true se il pannello e' in QBE
// ********************************************************************************
PValue.prototype.InQBE= function()
{ 
  return (this.ParentField.ParentPanel.Status == RD3_Glb.PS_QBE && this.Index == 1) || this.ListQBEValue == true;
}


// **********************************************************************
// Gestore dell'evento di change dell'input
// **********************************************************************
PValue.prototype.OnChange = function(evento)
{
  // Invio variazione normale se il campo non e' superattivo
  if (this.ParentField.SuperActive)
    this.SendChanges(evento, RD3_Glb.EVENT_SERVERSIDE);
  else
    this.SendChanges(evento, 0);
}


// **********************************************************************
// Gestore dell'evento di keypress dell'input
// **********************************************************************
PValue.prototype.OnKeyPress = function(evento)
{
  var code = (evento.charCode)?evento.charCode:evento.keyCode;
  if (code == 13)
  {
    // Se il campo ha una maschera la rimuovo, in modo da fare scattare gli automatismi, poi sara' la checkfocus a rimetterla..
    var srcobj = (window.event)?evento.srcElement:evento.target;
    var cell = RD3_KBManager.GetCell(srcobj);
    var en = cell.IsEnabled;
    var msk = cell.Mask;
    //
    if (en && msk  && msk!="" && srcobj.tagName=="INPUT")
    {
      umc(evento);
    }
    //
    // Invio variazione immediata
    this.SendChanges(evento, RD3_Glb.EVENT_IMMEDIATE);
    this.UpdateScreen();
    //
    // Se il parametro EnterChangeFocus e' attivo dopo aver gestito l'invio cambio riga
    if (RD3_ServerParams.EnterChangeFocus)
    {
      this.ParentField.ParentPanel.FocusNextField(this.ParentField, evento);
      //
      // Muovere il fuoco in questa fase fa si che l'invio sia gestito dal Browser sul nuovo campo con l'input.. 
      // Se e' una textarea sostituisce l'intero testo con una riga vuota!
      evento.preventDefault();
    }
    else
      RD3_KBManager.CheckFocus = true;
  }
}


// **********************************************************************
// Invia al server i dati del campo di INPUT o TEXTAREA
// **********************************************************************
PValue.prototype.SendChanges = function(evento, flag)
{
  var srcobj = null;
  //
  // Non invio variazione campi BLOB
  if (this.ParentField.DataType==10)
    return;
  //
  if (evento.tagName) // Evento puo' contenere anche il srcobj, nel caso del calendario
  {
    srcobj = evento;
  }
  else
  {
    if (evento.getData)
    {
      // E' un FCK editor!!!
    }
    else
    {
      // Normale input box, etc...
      //
      // Su FFX 58 a volte originalTarget e' 'restricted' e non c'e' modo per capirlo se non facendo un try/catch e leggendo una sua proprieta'...
      // allora proviamo e se non ci riusciamo usiamo il current
      if (RD3_Glb.IsFirefox()) {
        try {
          srcobj = (window.event) ? evento.srcElement : evento.originalTarget;
          //
          // Anche il TagName potrebbe essere restricted, bisogna provare ad accederci
          var t = srcobj.tagName;
        }
        catch (e) {
          srcobj = (window.event) ? evento.srcElement : evento.currentTarget;
        }
      }
      else
        srcobj = (window.event)?evento.srcElement:evento.originalTarget;
    }
  }
  //
  // Se premo su uno span, e' lui l'oggetto attivo
  // in questo caso torno all'input
  if (srcobj && srcobj.tagName=="SPAN")
  {
    var v = srcobj.previousSibling;
    if (v && v.tagName=="INPUT")
      srcobj = v;
  }
  //
  if (this.IsEnabled())
  {
    var s = (srcobj)?srcobj.value:"";
    if (s==undefined) s="";
    var chg = false;
    //
    // Se il valore coincide con la maschera non e' una vera modifica
    var cell = null;
    if (srcobj)
    {
      cell = RD3_KBManager.GetCell(srcobj);
      //
      // Su !IE arriva un change spurio se clicco su di una immagine, in questo caso se la cella ha un Watermark non faccio nulla
      // Su mobile arrivo qui anche se le celle hanno il watermark: devo comunque uscire
      if (cell && cell.HasWatermark && (!RD3_Glb.IsIE() || RD3_Glb.IsMobile()))
        return;
      //
      var en = cell.IsEnabled;
      var msk = cell.Mask;
      if (en && s.length>0 && msk  && msk!="" && srcobj.tagName=="INPUT")
      {
        // Provo a togliere la maschera e rileggo il valore
        // Mantengo se possibile il cursore nella stessa posizione
        var oldv = srcobj.value;
        var curpos = getCursorPos(srcobj);
        //
        umc(null);
        s = srcobj.value;
        //
        // Su IE l'autocompletamento della maschera non va.. devo rimpostare qui il testo altrimenti lo perdo
        // (sugli  altri browser riscatta qualcosa che rimette a posto il value..)
        if (RD3_Glb.IsIE() && (this.ParentField.DataType==7 || this.ParentField.DataType==8)) {
          // Devo controllare se :
          // c'e' stato autocompletamento (il vecchio valore conteneva hh e adesso non lo contiene o conteneva nn e adesso non lo contiene)
          if (oldv != s && ((oldv.indexOf("hh") != -1 && s.indexOf("hh") == -1) || (oldv.indexOf("nn") != -1 && s.indexOf("nn") == -1)))
            oldv = s;
        }
        //
        // Reimposto il valore corretto dell'input
        srcobj.value = oldv;
        //
        // Provo a riposizionare il cursore all'interno del campo
        // Lo faccio solo se non sto gestendo la perdita del fuoco di questa cella
        // dato che la setCursorPos riapplica il fuoco a questo campo!
        // Nel mobile non mi interessa riposizionare il cursore
        if (!RD3_KBManager.LoosingFocus && !RD3_Glb.IsMobile())
          setCursorPos(srcobj, curpos!=-1 ? curpos : oldv.length);
      }
      //
      // Prelevo il valore
      if (cell)
      {
        switch (cell.ControlType)
        {
          case 3: // IDCombo
          {
            s = cell.IntCtrl.GetComboValue();
            break;
          }
  
          case 8: // CustomElement
          {
            s = cell.IntCtrl.GetValue();
            break;
          }
  
          case 101: // IDEditor
          {
            if (RD3_ServerParams.UseIDEditor)
              s = cell.IntCtrl.getData()
            break;
          }
  
          case 4: // Checkbox
          {
            if (RD3_Glb.IsMobile())
            {
              if (srcobj.tagName=="SPAN")
                srcobj = srcobj.parentNode;
              s = srcobj.checked?"on":"";
            }
            break;
          }
        }
      }
    }
    //
    var isHTMLDirty = false;
    if (evento.getData)
    {
      s = evento.getData();
      isHTMLDirty = evento.checkDirty();
      evento = null;
      //
      // Se c'e' una cella attivata che contiene CKEDitor ed e' collegata al mio stessto campo la uso come cella su cui memorizzare le informazioni 
      // di dato acquisito
      var hcell = (this.ParentField.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.ParentField.PListCells ? this.ParentField.PListCells[0] : this.ParentField.PFormCell);
      if (hcell && hcell.ControlType == 101 && !RD3_ServerParams.UseIDEditor)
        cell = hcell;
    }
    //
    // Creo un altra variabile per i dati da inviare al server, per gestire la discrepanza tra la gestione client e server dei check
    var send = s;
    //
    var sendev = true;
    //
    // Se il testo e' vuoto e lo avevo svuotato io, non mando al server l'evento
    if (cell && cell.PwdSvuotata && s=="")
    {
      sendev = false;
      s = this.Text;
    }
    //
    if (srcobj)
    {
      switch (srcobj.type)
      {
        case "checkbox":
        {
          var vl = this.GetValueList();
          //
          if (srcobj.indeterminate) {
            s = this.ListQBEValue ? "" : "---";
            send = this.ListQBEValue ? "" : "---";
          }
          else
          {
            if (vl && vl.ItemList.length>=2)
              s = (srcobj.checked)?vl.ItemList[0].Value:vl.ItemList[1].Value;
            else
              s = (srcobj.checked)?"on":"";
            //
            send = (srcobj.checked)?"on":"";
          }
          //
          // Se non ho una lista valori associata non mando l'evento al server: necessario perche' potrei avere campi edit con VS check,
          // se mando il valore al server va in errore..
          if (!vl)
            sendev = false;
        }
        break;
        
        case "radio":
        {
          var vl = this.GetValueList();
          //
          // Se non ho una lista valori associata non mando l'evento al server: necessario perche' potrei avere campi edit con VS check,
          // se mando il valore al server va in errore..
          if (vl)
            s = vl.GetOption(srcobj);
          else
            sendev = false;
          //
          send = s;
        }
        break;
      }
    }
    //
    chg = (s!=this.Text);
    //
    var oldText = this.Text;
    this.Text = s;
    //
    if (cell)
    {
      cell.Text = s;
      //
      if (cell.ControlType == 101 && !RD3_ServerParams.UseIDEditor) 
      {
        // Anche solo mostrare il testo in un HTMLEditor puo' cambiarlo, ma se l'utente non ha fatto nulla non la devo acquisire come modifica
        if (chg && !isHTMLDirty)
          chg = false;
      }
      if (cell.ControlType==101 && RD3_ServerParams.UseIDEditor)
      {
        // Su IE<10 non c'e' modo di confrontare dei nodi/documenti.. dovrei farlo a mano.. TODO
        if (chg)
        {
          if (RD3_Glb.IsIE(10, false))
          {
            // Se la cella e' dirty allora e' cambiata e mandiamo il messaggio al server
            chg = cell.IntCtrl.IsDirty;
          }
          else
          {
            // Devo testare la effettiva differenza tra il Text vecchio e nuovo.. non come stringhe..
            var oldDocFrac = document.createDocumentFragment();
            var newDocFrac = document.createDocumentFragment();
            //
            var container = document.createElement("DIV");
            container.innerHTML = oldText;
            while (container.childNodes.length>0)
              oldDocFrac.appendChild(container.childNodes.item(0));
            //
            container.innerHTML = this.Text;
            while (container.childNodes.length>0)
              newDocFrac.appendChild(container.childNodes.item(0));
            container = null;
            //
            if (newDocFrac.isEqualNode && newDocFrac.isEqualNode(oldDocFrac))
              chg = false;
            //
            oldDocFrac = null;
            newDocFrac = null;
            //
            // Ultimo controllo.. se non e' dirty allora non e' cambiato..
            if (chg && !cell.IntCtrl.IsDirty)
              chg = false;
          }
        }
        //
        if (chg)
          cell.IntCtrl.HTMLContent = s;
        // 
        // Ho acquisito il valore, quindi non e' piu' dirty
        cell.IntCtrl.IsDirty = false;
      }
    }
    //
    // Se sono un campo LKE... invece di scrivere LKE1,LKE2,... scrivo la decodifica... 
    // che e' poi quello che tornera' indietro dal server
    if (chg && cell && cell.ControlType==3 && this.ParentField.LKE)
    {
      this.Text = cell.IntCtrl.GetComboName();
      if (cell)
      {
        cell.Text = s;
        cell.IntCtrl.OriginalText = s;
      }
      //
      // Se e' "-" (LKENULL) svuoto la cella
      if (this.Text == "-" && cell.IntCtrl.GetComboValue()=="LKENULL")
      {
        cell.IntCtrl.SetComboValue(this.Text);
      }
      // Se e' "(VAL)" (LKEPREC) tolgo le parentesi
      if (this.Text!="" && cell.IntCtrl.GetComboValue()=="LKEPREC")
      {
        this.Text = this.Text.substring(1, this.Text.length-1);
        cell.IntCtrl.SetComboValue(this.Text);
        //
        cell.Text = this.Text;
        cell.IntCtrl.OriginalText = this.Text;
      }
    }
    //
    // Se sono un PValue fittizio per la lista QBE devo avvertire il server che e' cambiato il criterio QBE
    if (chg && sendev && this.ListQBEValue)
    {
      chg = false;
      //
      if (cell && cell.ControlType == 3 && this.ParentField.LKE) 
      {
        // Nel caso LKE devo comporre la stringa QBE come farebbe il PopupFilter, perche' la imposto sul QBE e non uso
        // il canale standard per fare la decodifica
        var ns = cell.IntCtrl.SelItems ? cell.IntCtrl.SelItems.length : 0;
        var selList = [];
        s = "";
        for (var k = 0; k < ns; k++) {
          s += (k > 0 ? "@#@" : "") + cell.IntCtrl.SelItems[k].RValue;
          //
          // Devo anche memorizzare nel QBEFilter del campo LKE i valori selezionati per gestire la multiselezione,
          // altrimenti il server non la manda 
          selList.push({ name: cell.IntCtrl.SelItems[k].Name, type: 1, value: cell.IntCtrl.SelItems[k].RValue});
        }
        //
        this.ParentField.SetQBEFilter(selList.length > 0 ? selList : "");
      }
      //
      var ev = new IDEvent("qbeset", this.ParentField.Identifier, null, RD3_Glb.EVENT_URGENT, "qbefilter", s);
    }
    //
    if (chg && sendev)
    {
      // Invio l'evento.
      // Ritardo l'evento di 200 ms se sto premendo il mouse LEFT e il campo e' ATTIVO... magari ho cliccato
      // sulla toolbar del pannello e voglio aspettare un pochino per infilare anche l'evento di click nella
      // stessa richiesta
      // Lo faccio anche se il flag e' serverside e il campo e' superattivo
      // Lo faccio anche se il campo e' un LKE attivo
      // Se si tratta di una cella in edit di lista mandiamo sempre il valore al server in maniera immediata
      if (cell.InListForm)
        flag = flag | RD3_Glb.EVENT_IMMEDIATE;
      var ev;
      var sup = (this.ParentField.SuperActive && (flag&RD3_Glb.EVENT_SERVERSIDE)!=0);
      var actlke = (this.ParentField.LKE && this.ParentField.ChangeEventDef==RD3_Glb.EVENT_ACTIVE);
      var imm = ((this.ParentField.ChangeEventDef|flag) & RD3_Glb.EVENT_IMMEDIATE);
      //
      // Se e' multi-selezionabile invio anche la selezione attuale
      if (cell && cell.IntCtrl && cell.IntCtrl.MultiSel && this.ParentField.LKE && send.substr(0,3) != "LKE")
      {
        var txt = cell.IntCtrl.GetComboFinalName(true);
        txt += (txt.length > 0 && send.length > 0 ? ";" : "");
        send = txt + send;
      }
      //
      // Se il valore da mandare finisce con ' ' (trim != send) non lo mando subito al server (perche' lo trimmerebbe mangiando lo spazio)
      // se l'utente scrive un carattere dopo verra' mandato, se invece si ferma qui il valore con lo spazio verra' mandato alla fine e poi tornera' indietro trimmato        
      var supDelay = sup ? RD3_ClientParams.SuperActiveDelay : 200;
      if (sup && send && send.trim() != send)
        supDelay = 1500;
      //
      if ((RD3_DDManager.LButtonDown && imm) || sup || actlke)
      {
        ev = new IDEvent("chg", this.Identifier, evento, this.ParentField.ChangeEventDef | flag, "", send, "", "", "", supDelay, (sup||actlke) ? true : false);
      }
      else
      {
        ev = new IDEvent("chg", this.Identifier, evento, this.ParentField.ChangeEventDef|flag, "", send);  
      }
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


// **********************************************
// Ritorna true se la combo deve avere una riga vuota
// **********************************************
PValue.prototype.IsComboOptional = function()
{
  if (this.ParentField.Optional)
  {
    // Il campo e' dichiarato opzionale
    return true;
  }
  else if (this.InQBE())
  {
    // Il pannello e' in QBE
    return true;
  }
  else if (this.Text=="")
  {
    // Il campo non ha un valore quindi il NULL dev'essere contenuto nella combo
    return true;
  }
  else
  {
    var vl = this.GetValueList();
    if (vl)
    {
      // Controllo che il valore sia tra quelli della lista valori
      var found = false;
      var n = vl.ItemList.length;
      if (n > 0)
      {
        for (var i=0; i<n; i++)
         {
          if (this.Text == vl.ItemList[i].Value)
          {
            found = true;
            break;
          }
        }
      }
      //
      // La combo e' opzionale se il valore non e' nella lista valori
      return !found;
    }
  }
  //
  return false;
}


// **********************************************
// Ritorna true se il valore e' in una nuova riga del pannello
// **********************************************
PValue.prototype.IsNewRow= function()
{
  return this.Index>this.ParentField.ParentPanel.TotalRows;
}


// **********************************************
// Esegue aggiornamento visuale se questo valore
// e' mostrato a video
// **********************************************
PValue.prototype.UpdateScreen= function(value) 
{
  var vis = this.IsVisible();
  //
  var parf = this.ParentField;
  var parp = parf.ParentPanel;
  var ap = parp.ActualPosition;
  var nr = parp.NumRows;
  var ar = parp.ActualRow;
  //
  var upd = false;
  //
  // Se sono in QBE aggiorno solo la prima riga
  if (parp.Status == RD3_Glb.PS_QBE)
  {
    upd = this.Index==1;
  }
  else
  {
    if (this.ParentField.ParentPanel.IsGrouped())
    {
      if (parp.PanelMode == RD3_Glb.PANEL_LIST)
      {
          if (parf.InList)
          {
           // Per sapere se un valore e' visibile devo vedere se i suoi gruppi padri sono tutti espansi, e in quel caso
           // devo verificare che cada nella parte visualizzata del pannello
           var vis = parp.ListGroupRoot.IsRowVisible(this.Index);
           var pos = parp.GetRowForIndex(this.Index);
           //
           upd = vis && pos>=0 && pos<=(parp.NumRows-1);
          }
          else // Il Fld e' solo in form ed io sono in layout lista!
          {
           upd = false; 
          }
      }
      else
      {
        upd = (this.Index==ap+ar);
      }
    }
    else
    {
      if (parf.InList && parf.ListList)
        upd = (this.Index>=ap && this.Index<ap+nr);
      else
        upd = (this.Index==ap+ar);
    }
  }
  //
  if (upd)
  {
    // Curo anche la visibilita' della caption nel caso dynamic visible fuori lista/form
    if (parf.InList && parp.HasList && parp.PanelMode==RD3_Glb.PANEL_LIST)
    {
      // Se la colonna deve essere aggiornata piu' avanti, la salto
      if (!parf.DelayedUpdate)
      {
        var ur = (parf.ListList)? this.Index-ap : 0;
        //
        var lstrt = parf.ParentPanel.ListGroupRoot;
        if (parp.IsGrouped() && parf.ListList)
          ur = parp.GetRowForIndex(this.Index);
        //
        var cellPar = (parf.InList && parf.ListList ? parf.ListBox : parp.ListBox);
        if (parf.InList && parf.ListList && parp.IsFluidPanel())
          cellPar = parp.Rows[ur].childNodes[parf.RowChildIndex];
        parf.PListCells[ur].Update(this, cellPar);
        //
        // Se c'e' una cella ListForm visibile legata a me allora aggiorno anche quella
        if (RD3_DDManager.OpenListFormCell && RD3_DDManager.OpenListFormCell.PValue == this)
          RD3_DDManager.OpenListFormCell.Update(this, RD3_DDManager.OpenListFormCell.GetDOMObj().parentNode);
      }
      //
      if (!parf.ListList && parf.HdrList)
      {
        if (vis && parf.ListCaptionBox.style.display=="none")
          RD3_Glb.SetDisplay(parf.ListCaptionBox, "");
        if (!vis && parf.ListCaptionBox.style.display=="")
          RD3_Glb.SetDisplay(parf.ListCaptionBox, "none");
      }
    }
    //
    if (parf.InForm && parp.HasForm && parp.PanelMode==RD3_Glb.PANEL_FORM)
    {
      // Se il pannello e' gruppato anche in form devo andare a prendere i valori nella posizione giusta
      if (parp.IsGrouped())
        ap = parp.GetRowIndex(0);
      //
      parf.PFormCell.Update(parf.PValues[ap], parp.FormBox);
      //
      if (parf.HdrForm)
      {
        if (vis && parf.FormCaptionBox.style.display=="none")
          RD3_Glb.SetDisplay(parf.FormCaptionBox, "");
        if (!vis && parf.FormCaptionBox.style.display=="")
          RD3_Glb.SetDisplay(parf.FormCaptionBox, "none");
      }
    }
    //
    // Aggiorno RowSelector se applicabile
    if (this.RowSelector!=undefined && parp.PanelMode==RD3_Glb.PANEL_LIST && parp.RowSel)
      this.UpdateRowSel();
  }
  //
  this.RefreshScreen = false;
}


// ********************************************************************************
// Aggiorna il row selector
// ********************************************************************************
PValue.prototype.UpdateRowSel= function()
{
  var img = "rs.gif";
  switch (this.RowSelector)
  {
    case 1: img = "rse.gif"; break;  // Errore su documento
    case 2: img = "rsm.gif"; break;  // Modifica su documento
    case 3: img = "rse.gif"; break;  // Errore su documento Inserted
    case 4: img = "rsm.gif"; break;  // Modifica su documento Inserted
  }
  //
  var parp = this.ParentField.ParentPanel;
  var idx = this.Index-parp.ActualPosition;
  //
  // Se il pannello e' gruppato devo prendere il Row sel giusto, non posso fidarmi 
  // dell'Index e dell'ActualPosition
  if (parp.IsGrouped())
  {
    // La riga dove sono e' la riga compatta relativa a me - la riga compatta relativa all'actualposition
    idx = parp.GetRowForIndex(this.Index);
    if (idx<0 || idx>parp.NumRows)
      idx = -1;
  }
  //
  var rsobj = (parp && parp.RowSel && idx>=0 ? parp.RowSel[idx] : null);
  if (RD3_ServerParams.CompletePanelBorders && parp && parp.RowSel && idx>=0)
    rsobj = parp.RowSel[idx] ? parp.RowSel[idx].firstChild : null;
  //
  if (rsobj)
  {
    rsobj.src = RD3_Glb.GetImgSrc("images/"+img);
    if (parp.IsGrouped())
      rsobj.style.display = "";
  }
  else
    parp.UpdateRSel = true;   // Lo faccio alla fine
}


// ********************************************************************************
// Ritorna l'oggetto principale del DOM
// ********************************************************************************
PValue.prototype.GetDOMObj= function(type)
{ 
  // N.B. Questa funzione (per ora) viene chiamata solo per Index< Panel.NumRows
  // in quando il gestore del popup menu lato server identifica la cella riferendosi
  // alla finestra 0:numrows, non usando ActualPosition.
  //
  // Prelevo il div del campo che mi contiene
  var parf = this.ParentField;
  if (parf.ParentPanel.PanelMode == RD3_Glb.PANEL_FORM)
  {
    return parf.PFormCell.GetDOMObj();
  }
  else
  {
    if (parf.ListList)
      return parf.PListCells[this.Index-1].GetDOMObj();
    else
      return parf.PListCells[0].GetDOMObj();
  }
}


// ********************************************************************************
// Chiede di impostare l'FCK per questo valore
// ********************************************************************************
PValue.prototype.SetFCK= function(ev, list)
{ 
  var nm = this.ParentField.Identifier+(list? ":lcke" : ":fcke");
  var fck = CKEDITOR.instances[nm];
  if (fck)
  {
    // Se CK e' sporco con un valore diverso da quello che mi arriva dal server non lo sovrascrivo..
    var setVal = true;
    //
    // Lo faccio solo se l'elemento e' quello attivo, altrimenti e' una perdita di tempo
    // **Non uso il checkdirty() perche' non sempre funziona correttamente**
    if (RD3_KBManager.ActiveElement == fck)
    {
      var hcell = list ? this.ParentField.PListCells[0] : this.ParentField.PFormCell;
      if (hcell && hcell.ControlType == 101)
        setVal = (fck.getData()!=hcell.Text ? false : true);
    }
    else
    {
      // se non sono l'elemento attivo cerco tra gli eventi che ancora non sono stati inviati
      var ev = RD3_DesktopManager.MessagePump.GetEvent(this, "chg");
      setVal = (ev ? false : true);
    }
    // 
    if (setVal) 
    {
      fck.setData(this.Text);
      //
      // Non e' sporco, sono io che ho messo il nuovo valore, ma non basta.. dopo un po' ritorna dirty lo stesso.
      // devo usare un timer ...
      fck.resetDirty();
      setTimeout(function () { fck.resetDirty(); }, 50);
    }
  }
  this.ParentField.FCKTimerID=0;
}


// **********************************************************************
// Ritorna il frame che contiene il valore
// **********************************************************************
PValue.prototype.GetParentFrame = function()
{
  return this.ParentField.ParentPanel;
}


// ***************************************************************************
// Restituisce la firma del VS in base alla riga e alle impostazioni attuali
// ***************************************************************************
PValue.prototype.GetVSign = function(vs, list)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  //
  var inqbe = this.InQBE();
  var en = this.IsEnabled();
  //
  var sel = false;
  var alt = false;
  //
  if (list && pf.ListList)
  {
    if (pp.IsGrouped())
    {
      var selr = pp.GetServerIndex(pp.ActualRow);
      sel = (this.Index == selr);
      alt = pp.GetRowForIndex(this.Index)%2;
    }
    else
    {
      var selr = pp.ActualPosition + pp.ActualRow;
      sel = (this.Index == selr);
      alt=(this.Index-pp.ActualPosition)%2;
    }
  }
  //
  // Voglio in QBE i campi master, i campi di autolookup e i campi LKE... non i campi lookup semplici
  var trueqbe = (pf.IdxPanel<=0 || pf.AutoLookup || pf.LKE);
  //
  var aa = pf.IsRightAligned()?"right":"left";
  return vs.GetSign(list, alt, sel, !en, this.ErrorType==1, (this.ErrorType==2 || this.ErrorType==3), aa, inqbe && trueqbe);
}


// *******************************************************************
// Ritorna il controllo richiesto dal valore
// *******************************************************************
PValue.prototype.GetControlType = function()
{
  var vs = this.GetVisualStyle();
  //
  // Calcolo il controllo richiesto dal valore
  var ct = vs.GetContrType();
  if (ct == 1) // VISCTRL_AUTO
  {
    // Se ho una lista valori, o se il campo e' Value Source o SmartLookup uso la combo
    if (this.GetValueList() || this.ParentField.HasValueSource || this.ParentField.LKE)
      ct = 3; // VISCTRL_COMBO
    else
      ct = 2; // VISCTRL_EDIT
  }
  //
  // Campo BLOB
  if (this.ParentField.DataType == 10)
    ct = 10;
  //
  // Campo FCK
  if (this.ParentField.EditorType==1)
  {
    // IDEditor gestisce lui la abilitazione/disabilitazione..
    if (RD3_ServerParams.UseIDEditor)
      ct = (!this.InQBE() ? 101 : 2);
    else  
      ct = (this.IsEnabled() && !this.InQBE() ? 101 : 2);
  }
  //
  // Campo CHECK: se non ho una lista valori divento un EDIT
  if (ct==4 && !this.GetValueList())
    ct = 2; // VISCTRL_EDIT
  //
  // Campo CUSTOM
  if (this.CustomElement)
    ct = 8;
  //
  return ct;
}


// *******************************************************************
// Restituisce se il valore e' visibile in un pannello Gruppato
// *******************************************************************
PValue.prototype.IsVisibleInGrouped = function()
{
  // Se il pannello non e' gruppato oppure se io non appartengo ad un campo in listlist
  // allora la mia visibilita' e' pari a IsVisible()
  if (!this.ParentField.ParentPanel.IsGrouped() || !(this.ParentField.InList && this.ParentField.ListList))
  {
    return this.IsVisible();
  }
  //
  // Devo verificare se tutti i gruppi che mi contengono sono espansi; 
  // se si sono visibile, altrimenti no
  return this.ParentField.ParentPanel.ListGroupRoot.IsRowVisible(this.Index);
}


// ********************************************************************************
// Gestione finale del valore
// ********************************************************************************
PValue.prototype.AfterProcessResponse= function()
{
  // Rimuovo le liste dinamiche
  if (this.ValueListType==3 || this.ValueListType==1)
  {
    // DOPO aver renderizzato sia la combo list che form,
    // resetto la lista valori.
    this.ValueListType=0;
    this.ValueList=null;
  }
  //
  // Rimuovo il segnale di svuotamento lista
  if (this.ValueListCleared)
    delete this.ValueListCleared;
}


// *********************************************************
// Click sulla label di un radio: lo devo checkare
// *********************************************************
PValue.prototype.OnRadioLabelClick = function(ev)
{
  if (!this.IsEnabled())
    return;
  //
  var obj = (window.event)?window.event.srcElement:ev.target;
  var prev = obj.previousSibling;
  //
  // Spingo il click sul radio.
  if (prev)
  {
    // Su Android il click non funziona: non mette a checked e non lancia l'evento.. quindi lo faciamo noi al suo posto
    if (RD3_Glb.IsAndroid())
    {
      prev.checked = true;
      RD3_KBManager.IDRO_OnChange(ev);
    }
    else
    {
      prev.click();
    }
  }
  //
  if (RD3_Glb.IsMobile())
    this.GetValueList().SetOptionClass(obj.parentNode,obj);
}

// *********************************************************
// Ritorna TRUE se il campo mostra HTML
// *********************************************************
PValue.prototype.ShowHTML = function()
{
  // Mask =
  if (this.Mask=="=")
    return true;
  //
  // Il value non ha una mask ma il campo di pannello ha Mask =
  if (this.Mask=="" && this.ParentField.Mask=="=")
    return true;
  //
  return false;
}


// ********************************************************************************
// Torna vero se l'utente ha toccato il pallino di multiselezione
// ********************************************************************************
PValue.prototype.TouchMulSel= function(evento)
{ 
  // Vediamo se la cella e' scrivibile
  var cell = RD3_KBManager.GetCell(evento.target);
  if (cell && cell.IsEnabled)
  {
    // Se non ho cliccato proprio sul pallino, allora lascio passare l'evento
    if (RD3_Glb.HasClass(cell.IntCtrl,"panel-field-selected")||RD3_Glb.HasClass(cell.IntCtrl,"panel-field-unselected"))
    {
      var x = RD3_Glb.GetScreenLeft(cell.IntCtrl,true);
      //
      var xe = evento.clientX;
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        xe = evento.targetTouches.length>0? evento.targetTouches[0].clientX:evento.changedTouches[0].clientX;
      //
      if (xe>=x && xe<=x+32)
        return true; // cliccato su pallino
    }
  }
}


// ********************************************************************************
// La caption e' stata toccata dall'utente
// ATTN: evento qui puo' essere anche solo un oggetto con una sola proprieta'
// target, vedi anche PField.OnTouchDown
// ********************************************************************************
PValue.prototype.OnTouchDown= function(evento, scrollinput, target)
{ 
  // Se sono in lista, evidenzio e seleziono la riga
  var parp = this.ParentField.ParentPanel;
  if (target==undefined)
    target = evento.target ? evento.target : evento.srcElement;
  //
  parp.OnTouchDown(evento);
  //
  if (parp.PanelMode == RD3_Glb.PANEL_LIST && parp.Locked && this.ParentField.ListList)
  {
    // Evidenzio la riga, a meno che non tocchi un campo di pannello attivabile
    // con OnlyIcon
    if (!this.ParentField.CanActivate || !this.ParentField.VisOnlyIcon())
    {
      parp.HiliteRow(this.Index);
    }
  }
  else
  {
    // Se sono in form e posso scrivere questo valore, non eseguo lo scroll
    if (this.IsEnabled())
    {
      // Se ho toccato un editor
      if (this.ParentField.IsIDEditor(target))
      {
        // Posso arrivare qui anche dal touch sulla caption del campo: in questo caso non devo mai bloccare lo scroll, perche' non ci sono problemi..
        var realTarget = evento.target ? evento.target : evento.srcElement;
        if (!this.ParentField.IsIDEditor(realTarget))
        {
          // Non blocco lo scroll, ma se sonin lista eseguo l'hilight
          if (parp.PanelMode == RD3_Glb.PANEL_LIST)
            parp.HiliteRow(this.Index);
          return true;
        }
        //
        // Bene, ho toccato veramente un Editor.. innazitutto se ho toccato la toolbar devo solo stoppare lo scroll.. poi ci pensano i gestori a gestire il tocco
        if (this.ParentField.IsIDEditorToolbar(target))
        {
          // Il click sulla toolbar toglie la selezione.. la devo salvare!
          var cell = RD3_KBManager.GetCell(target);
          if (cell && cell.IntCtrl && cell.IntCtrl instanceof IDEditor)
          {
            var edObj = cell.IntCtrl;
            if (edObj.SelectionTimer != null)
            {
              window.clearTimeout(edObj.SelectionTimer);
              edObj.SelectionTimer = null;
            }
            edObj.OnSelectionTimer();
          }
          //
          return true;
        }
        //
        // Ho toccato uno dei due editor.. beh se non devo scrollare allora blocco direttamente lo scroll
        return false;
      }
      //
      // Se l'oggetto vuole il controllo e non e' una combo, non faccio nulla qui
      if (this.ParentField.UsePopupControl() && !this.ParentField.IsCombo(target))
      {
        // Se sono in lista, pero' evidenzio la riga
        if (parp.PanelMode == RD3_Glb.PANEL_LIST)
          parp.HiliteRow(this.Index);
        return true;
      }
      //
      if (target.tagName=="INPUT" || target.tagName=="TEXTAREA")
      {
        // Posso arrivare qui anche dal touch sulla caption del campo: in questo caso non devo mai bloccare lo scroll, perche' non ci sono problemi
        var realTarget = evento.target ? evento.target : evento.srcElement;
        var realInput = (realTarget.tagName=="INPUT" || realTarget.tagName=="TEXTAREA");
        //
        // Ho toccato un input. Se e' attivo lo scroll sui campi attivi, allora
        // evidenzio la riga anche in questo caso, altrimenti blocco scroll e fuoco il campo
        if (scrollinput || !realInput)
        {
          if (parp.PanelMode == RD3_Glb.PANEL_LIST)
            parp.HiliteRow(this.Index);
        }
        else
        {
          return false;
        }
      }
      //
      // Ho toccato una combo, la evidenzio
      if (this.ParentField.IsCombo(target))
      {
        if (parp.PanelMode == RD3_Glb.PANEL_FORM)
          this.ParentField.HiliteCombo(target, true);
        else
          parp.HiliteRow(this.Index);
      }
      //
      // Ho toccato un radio verticale abilitato con tema iOS7, ci metto evidenziazione grigia
      if (RD3_Glb.IsMobile7() && RD3_Glb.HasClass(target,"book-span-radio-text-vertical"))
      {
        target.style.backgroundColor = RD3_ClientParams.GetColorHL1();
      }
    }
    else
    {
      // lo faccio sia per le combo che per i campi attivabili. In questo modo se un campo
      // ha una procedura attaccata, lo evidenzio lo stesso. Pero' il campo in se DEVE essere abilitato.
      // Se il campo e' disabilitato proprio lui, non lo evidenzio comunque.
      if (this.ParentField.CanActivate && this.ParentField.ActivableDisabled && this.ParentField.Enabled)
        this.ParentField.HiliteCombo(target, true);
    }
  }
  return true;
}

// ********************************************************************************
// La caption e' stata toccata dall'utente
// ********************************************************************************
PValue.prototype.OnTouchUp= function(evento, click, target)
{ 
  var parp = this.ParentField.ParentPanel;
  if (target==undefined)
    target = evento.target ? evento.target : evento.srcElement;
  //
  parp.OnTouchUp(evento, click);
  //
  // Ho toccato un radio verticale abilitato con tema iOS7, rimetto a posto
  if (RD3_Glb.IsMobile7() && RD3_Glb.HasClass(target,"book-span-radio-text-vertical"))
  {
    target.style.backgroundColor = "";
  }
  //
  if (click)
  {
    // Voglio evitare un doppio click sugli oggetti
    if (RD3_Glb.IsAndroid() || (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch()))
      RD3_DDManager.ChompClick();
    //
    // Ho cliccato, segnalo che questa e' la riga attiva
    this.ParentField.GotFocus(target,evento);
    //
    // Se quando tocco un campo la form si deve chiudere, lo faccio ora
    if (parp.WebForm.CloseOnSelection)
    {
      this.OnDoubleClick(evento);
      return true;
    }
    //
    if (evento && parp.PanelMode == RD3_Glb.PANEL_LIST && parp.ShowMultipleSel && this.ParentField.ListList)
    {
      // Multiselezione? eseguo commit
      if (parp.Locked || this.TouchMulSel(evento))
      {
        parp.OnMultiSelClick(evento, this.Index-1);
        return true;
      }
    }
    //
    var cell = RD3_KBManager.GetCell(target);
    //
    // Se l'oggetto vuole il controllo, non faccio nulla qui
    if (this.ParentField.UsePopupControl() && cell.IsEnabled && !(cell.IntCtrl instanceof IDCombo))
    {
      // Se sono in lista, de-evidenzio la riga
      if (parp.PanelMode == RD3_Glb.PANEL_LIST)
      {
        this.ParentField.ParentPanel.HiliteRow(0);
        //
        // In IE10 [ParentField.GotFocus(target,evento)] fa si che se clicco su un'altra riga viene impostato il timer che dopo 10 
        // milli da fuoco al campo aprendo la tastiera.. non voglio che si apra perche' ho cliccato su un PopupControl, quindi
        // annullo il timer
        if (RD3_Glb.IsIE(10, true))
        {
          if (RD3_KBManager.FocusFieldTimerId)
            window.clearTimeout(RD3_KBManager.FocusFieldTimerId);
          RD3_KBManager.FocusFieldTimerId = 0;
        }
        
      }
      //
      var pc = new PopupControl(this.ParentField.GetPopupControlType(),cell);
      pc.Open();
      pc.LastActiveObject = null;
      pc.LastActiveElement = null;
      //
      return true;
    }   
    //
    // Se clicco su un campo attivabile con solo l'icona, attivo il campo
    if (this.ParentField.CanActivate && this.ParentField.VisOnlyIcon())
    {
      this.ParentField.OnClickActivator(evento);
    }
    else
    {
      // Se clicco mando il pannello in form (se posso)
      if (parp.PanelMode == RD3_Glb.PANEL_LIST && parp.HasForm && parp.AutomaticLayout && this.ParentField.ListList)
      {
        // Se sono su una nuova riga
        if (this.IsNewRow())
        {
          // E posso inserire, allora vado in inserimento
          if (this.ParentField.ParentPanel.CanInsert)
            this.ParentField.ParentPanel.OnToolbarClick(evento,"insert");
          else
            this.ParentField.ParentPanel.HiliteRow(0);
        }
        else
          this.ParentField.ParentPanel.OnToolbarClick(evento,"list");
      }
      else
      {
        // Non posso cambiare layout. Se ho cliccato su una combo in lista, tolgo evidenziazione dalla riga
        if (this.ParentField.IsCombo(target))
          this.ParentField.ParentPanel.HiliteRow(0);
        //
        // Se non posso cambiare layout, attivo il campo
        if (this.ParentField.CanActivate)
          this.ParentField.OnClickActivator(evento);
      }
    }
    //
    // Se la cella e' un check e sono in un dispositivo touch, allora
    // eseguo toggle
    if (RD3_Glb.IsTouch())
    {
      if (cell && cell.ControlType==4 && cell.IsEnabled)
        this.ParentField.OnToggleCheck(evento);
    }
    //
    if (RD3_Glb.IsTouch())
    {
      if (cell && cell.ControlType==5 && cell.IsEnabled)
        this.OnRadioLabelClick(evento);
    }
    //
    if (RD3_Glb.IsTouch())
    {
      // Se e' arrivato il click su di una cella di tipo BLOB ed il suo PVal (che sarei io ma e' meglio non correrre rischi..)
      // mostra il link lancio l'eento giusto sul PField
      if (cell && cell.ControlType==10 && cell.PValue.BlobMime=="size")
        cell.PValue.ParentField.OnBlobCommand(evento, "link");
    }
    //
    // Se sono in form e tocco una combo, la apro
    if (!parp.Locked)
    {
      if (cell.IntCtrl instanceof IDCombo && cell.IsEnabled && !this.ParentField.CanActivate)
      {
        if (cell.HasWatermark)
          cell.RemoveWatermark();
        cell.IntCtrl.Open();
      }
      else
      {
        // Avevo toccato una combo o un campo, tolgo evidenziazione
        if (parp.HilitedCombo)
          parp.HilitedCombo.HiliteCombo(null, false);
      }
    }
    //
    if (this.ParentField.IsIDEditorToolbar(target))
    {
      if (cell && cell.IntCtrl instanceof IDEditor && cell.IsEnabled)
        cell.IntCtrl.OnEditorTouchUp(evento, target);
    }
    //
    // Avevo evidenziato un campo che non e' una combo, oppure era una combo ma bloccata
    // Anche se ci clicco sopra deve subito andare via l'evidenziazione
    if (parp.HilitedCombo && (!this.ParentField.IsCombo(target) || !cell.IsEnabled || !this.ParentField.VisSlidePad()))
      parp.HilitedCombo.HiliteCombo(null, false);
  }
  else
  {
    // Tolgo riga evidenziata
    if (parp.PanelMode == RD3_Glb.PANEL_LIST)
    {
      this.ParentField.ParentPanel.HiliteRow(0);
    }
    //
    // Avevo toccato una combo, tolgo evidenziazione
    if (parp.HilitedCombo)
      parp.HilitedCombo.HiliteCombo(null, false);
  }
  return true;
}


// ********************************************************************************
// Effettuato swipe su valore
// ********************************************************************************
PValue.prototype.OnSwipe= function(evento, toright)
{ 
  // Se il campo e' in lista, attivo swipe sul pannello
  if (!toright)
  {
    var parf = this.ParentField;
    var parp = parf.ParentPanel;  
    if (parf.InList && parf.ListList && parp.PanelMode == RD3_Glb.PANEL_LIST)
    {
      parp.SetSwipe(true, parf, this.Index, evento);
    }
  }
}


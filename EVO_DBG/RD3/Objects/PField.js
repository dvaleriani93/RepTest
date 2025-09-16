// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PField: Rappresenta un campo di un pannello
// ************************************************

function PField(ppanel)
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = null;       // Identificatore del campo (univoco)
  //
  this.Index = 0;               // Numero di campo
  this.Visible = true;          // Campo visible?
  this.Enabled = true;          // Campo abilitato?
  this.VisualStyle = 0;         // Stile visuale
  this.ListList = true;         // Campo in lista come parte della lista?
  this.CanActivate = false;     // Campo attivabile?
  this.HasValueSource = false;  // Il campo ha una query value source?
  this.AutoLookup = false;      // Il campo e' di tipo autolookup?
  this.ActWidth = RD3_ClientParams.ActivatorWidth;
  this.ActImage = "";           // Attivatore personalizzato
  this.LKE = false;             // E' un campo SmartLookup?
  this.Optional = true;         // Campo opzionale?
  this.IsPK = false;            // Il campo e' una PK?
  this.DBCode = "";             // DB Code del campo del DB associato a questo campo di pannello
  this.ActivableDisabled=false; // Campo attivabile se disabilitato?
  this.CauseValidation = true;  // Campo validabile?
  this.Image = "";              // Icona da visualizzare sullo sfondo o nella caption
  this.ImageResizeMode = 1;     // Ridimensionamento dell'immagine di sfondo
  this.Header = "";             // Titolo del campo
  this.Tooltip = "";            // Tooltip del campo
  this.Page = 0;                // Indice della pagina a cui il campo appartiene
  this.Group = null;            // Oggetto group a cui il campo appartiene
  this.DataType = 0;            // Tipo di dato del campo
  this.MaxLength = 255;         // Lunghezza massima
  this.Scale = 0;               // Scala (per campi numerici)
  this.SortMode = 0;            // Tipo di sort
  this.GroupMode = 0;           // Tipo di raggruppamento
  this.IdxPanel = 0;            // Campo statico = -1; Campo Master = 0; Campo Lookup>0
  this.SubFrame = null;         // Il frame contenuto in questo campo statico
  this.ValueList = null;        // La value list di questo campo di pannello
  this.EditorType = 0;          // 0-normale, 1-fckeditor
  this.Command =  null;         // Il comando collegato a questo campo (utile per l'attivazione)
  this.CanSort = true;          // Il campo puo' effettuare sorting?
  this.QBEEnabled = true;       // Il campo e' abilitato in QBE?
  this.SuperActive = false;     // Il campo deve inviare la variazione ad ogni pressione di un tasto?
  this.Unbound = false;         // Campo Unbound?
  this.ComboMultiSel = true;    // Combo multi selezionabile?
  this.ComboValueSep = ";";     // Separatore dei valori per le combo multiselezionabili
  this.BackColor = "";          // Colore di background
  this.ForeColor = "";          // Colore di foreground
  this.FontMod = "";            // Proprieta' del carattere
  this.Mask = "";               // Mascheratura
  this.Alignment = -1;          // Allineamento
  this.Badge = "";              // Badge del campo 
  this.FontList;                // Lista dei Font (Stringhe)
  this.ColorList;               // Lista dei Colori (stringhe)
  this.TokenList;               // Lista dei Token (ValueList)
  this.ShowEditorTool = true;   // Mostrare la Toolbar dell'Editor?
  this.EdToolCommands = -1;     // Comandi di IDEditor abilitati
  this.DefaultFormatting = "";  // Formato di default per i paragrafi dell'editor
  this.QBEFilter = "";          // QBEFilter
  this.QBELike = true;          // QBE Like
  //  
  this.InList = true;           // Campo in lista?
  this.ListHeader = "";         // Titolo del campo in list (forma abbreviata)
  this.HdrList = true;          // Header presente in lista?
  this.HdrListAbove = false;    // Header in lista posizionato sopra?
  this.ListLeft = 0;            // Posizione nella lista
  this.ListTop = 0;             // Posizione nella lista
  this.ListWidth = 0;           // Dimensione nella lista
  this.ListHeight = 0;          // Dimensione nella lista
  this.ListNumRows = 1;         // Numero di righe del campo nella lista
  this.ListHResMode = 1;        // Ridimensionamento orizzontale layout lista
  this.ListVResMode = 1;        // Ridimensionamento verticale layout lista
  this.ListHeaderSize = 0;      // Dimensione Header in lista
  this.ListTabOrder = -1;       // Ordine di tabulazione (avanzato) in list
  //
  this.InForm = true;           // Campo in dettaglio?
  this.FormHeader = "";         // Titolo del campo in form (forma abbreviata)
  this.HdrForm = true;          // Header presente in form?
  this.HdrFormAbove = false;    // Header in form posizionato sopra?
  this.FormLeft = 0;            // Posizione nel dettaglio
  this.FormTop = 0;             // Posizione nel dettaglio
  this.FormWidth = 0;           // Dimensione nel dettaglio
  this.FormHeight = 0;          // Dimensione nel dettaglio
  this.FormNumRows = 1;         // Numero di righe del campo nel dettaglio    
  this.FormHResMode = 1;        // Ridimensionamento orizzontale layout form
  this.FormVResMode = 1;        // Ridimensionamento verticale layout form
  this.FormHeaderSize = 0;      // Dimensione Header in form
  this.FormTabOrder = -1;       // Ordine di tabulazione (avanzato) in form
  this.UseHL = false;           // Il Campo statico deve gestire l'hilight?
  this.VisualFlags = -1;        // Flag visuali
  this.UseTextSel = false;      // Attivo l'invio della selezione testuale?
  this.WaterMark = "";          // Watermark del campo
  this.ClassName;               // Classe delle celle
  this.ClassHeader;
  //this.BreakRow;              // True se il campo deve forzare il break della riga in lista

  //this.PosDimPerc;            // Array di 10 elementi (se != -1 -> pos/dim in percentuale*10)
  //
  // Oggetti figli di questo nodo
  this.PValues = new Array();   // Array dei valori, compresi i flags (da 1 a TotalRows)!
  this.PListCells = null;       // Array delle celle in list, compresi i flags (da 1 a VisibleRows)!
  this.PFormCell = null;        // Cella in form
  this.PQBECell = null;         // Cella per la ricerca QBE avanzata in lista
  this.PQBEValue = null;        // Valore fittizio per gestire ricerca QBE avanzata in lista
  //
  // Altre variabili di modello...
  this.FCKTimerID = 0;          // Timer per l'aggiornamento ritardato di FCK editor
  this.ParentPanel = ppanel;    // L'oggetto pannello cui il campo appartiene
  this.ConfirmBox = null;       // MessageConfirm per delblob
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo nodo
  this.ClickEventDef = RD3_Glb.EVENT_ACTIVE;     // Il click sulla box/caption
  this.ChangeEventDef = RD3_Glb.EVENT_DEFERRED;  // Modifica del campo
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;        // Se vero, gli oggetti del DOM sono gia' stati creati
  this.Realizing = false;       // Indica stato di realizzazione per velocizzare operazioni
  //this.FirstListFld = false;  // Indica se il campo e' gia' stato impostato per contenere gli header dei gruppi in caso di pannello gruppato
  //this.DoOpenCombo = false;   // Indica se a fine richiesta deve essere aperta la combo
  //this.DoOpenQBEPopupFilter = false;   // Indica se a fine richiesta deve essere aperto il filtro QBE in popup
  //
  // Oggetti visuali relativi al campo
  this.FormCaptionBox = null;   // Il DIV della caption del campo
  this.ListCaptionBox = null;   // Il DIV della caption della lista
  this.ListBox = null;          // il DIV che contiene tutte le celle
  this.SortImage = null;        // L'IMG che serve per il sorting
  //
  this.ListBlobUploadImg = null;  // Comandi per la toolbar del blob (list)
  this.ListBlobDeleteImg = null;  // Comandi per la toolbar del blob (list)
  this.ListBlobZoomImg = null;    // Comandi per la toolbar del blob (list)
  this.ListFlashUploader = null;  // Flash per l'upload (list)
  //
  this.FormBlobUploadImg = null;  // Comandi per la toolbar del blob (form)
  this.FormBlobDeleteImg = null;  // Comandi per la toolbar del blob (form)
  this.FormBlobZoomImg = null;    // Comandi per la toolbar del blob (form)
  this.FormFlashUploader = null;  // Flash per l'upload (form)
  //
  // Variabili per la gestione del resize di un subframe
  this.ListResizeSkipped = false; // E' stato saltato un resize in lista?
  this.FormResizeSkipped = false; // E' stato saltato un resize in form?
  this.ListDeltaH = 0;            // DeltaH totale per i resize in lista
  this.ListDeltaW = 0;            // DeltaW totale per i resize in lista
  this.FormDeltaH = 0;            // DeltaH totale per i resize in form
  this.FormDeltaW = 0;            // DeltaW totale per i resize in form
  //
  // Campi BLOB o MultiUpload
  this.MaxUploadSize = 10 * 1024 * 1024;// Dimensione massima dei file ammissibili
  this.MaxUploadFiles = 0;              // Numero massimo di file inviabili
  this.UploadExtensions = "*.*";        // Tipi dei file ammissibili
  this.UploadDescription = "";          // Descrizione dei file ammissibili
  //
  // MultiUpload
  this.MultiUpload = false;             // Indica se il campo e' multi upload
  this.FileUploading = null;            // File che si sta caricando
  this.UploadAll = false;               // Indica se si devono inviare tutti i file in coda
  this.MsgFileNotQueued = "";           // Testo da mostrare in caso di file rifiutati
  this.FileList = null;                 // Lista dei file
  this.MUPHeader = null;                // Puntatore all'intestazione
  
  //this.StartSel = -1;                 // Inizio della selezione testuale
  //this.EndSel = -1;                   // Fine della selezione testuale
  
  //this.BadgeObjForm=null;                 // Oggetto utilizzato per il Badge
  //this.BadgeObjList=null;                 // Oggetto utilizzato per il Badge

  this.AggregateOfField = -1;      // Indice del campo di cui mostra valori aggregati
}


// *******************************************************************
// Inizializza questa box leggendo i dati da un nodo <box> XML
// *******************************************************************
PField.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
  //
  // Carico valori dei campi
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
      case "val":
      {
        var newval = new PValue(this);
        newval.LoadFromXml(objnode);
        //
        // Lo infilo al posto giusto; se il pannello e' gruppato ed e' in lista ed io sono un campo listlist 
        // devo chiedere ai gruppi dove mi devo infilare, altrimenti mi metto al mio posto
        if (this.ParentPanel.IsGrouped())
          this.PValues[this.ParentPanel.ListGroupRoot.GetPValOffset(newval.Index)+newval.Index] = newval;
        else
          this.PValues[newval.Index] = newval;
      }
      break;
      
      case "vls":
      {
        // Vediamo se mi e' stata tolta la lista (es: tramite ClearValueList)
        if (objnode.getAttribute("del")=="1")
          this.ValueList = null;
        else
        {
          this.ValueList = new ValueList();
          this.ValueList.LoadFromXml(objnode);
        }
        //
        // Ho cambiato la value list del campo, quindi devo ricaricare il campo
        if (this.Realized)
          this.SetActualPosition(this.ParentPanel.ActualPosition);
      }
      break;
      
      case "vnl":
      {
        // E' la risposta del server a una ValueList del QBE avanzato
        // Prima di tutto carichiamo la lista
        var valueList = new ValueList();
        valueList.LoadFromXml(objnode);
        //
        // Cerchiamo la popup di filtro e se e' ancora aperta diamogli la ValueList che ci ha mandato il server
        // Se l'id e' il mio allora e' la risposta ad una combo PQBECell
        var popupId = objnode.getAttribute("popup");
        if (popupId == this.Identifier)
        {
          if (this.PQBECell && this.PQBEValue) {
            // Devo gestire le multiselezione, il QBEFilter in questo caso
            // contiene l'array dei valori selezionati, li devo corrispondere per RValue con la lista,
            // se corrisponde per renderlo 'selezionato' devo scrivere LKE>1000
            if (this.LKE && this.QBEFilter && this.QBEFilter instanceof Array) 
            {
              for (var j = 0; j < this.QBEFilter.length; j++) {
                var selectedValue = this.QBEFilter[j].value;
                for (var ix = 0; ix < valueList.ItemList.length; ix++)
                  if (valueList.ItemList[ix].RValue == selectedValue)
                    valueList.ItemList[ix].Value = "LKE"+ (1001+ix);
              }
            }
            //
            this.PQBEValue.ValueList = valueList;
            this.PQBECell.Update(this.PQBEValue, this.ParentPanel.IsFluidPanel() ? this.ParentPanel.ListQBEFluidRow.childNodes[this.RowChildIndex] : this.ListBox);
          }
        }
        else {
          var popupFilter = RD3_DesktopManager.ObjectMap[popupId];
          if (valueList && popupFilter)
            popupFilter.RealizeComboList(valueList);
        }
      }
      break;
      
      case "cls":
      {
        // Vediamo se mi e' stata tolta la lista
        if (objnode.getAttribute("del")=="1")
        {
          this.ColorList = null;
        }
        else
        {
          this.ColorList = new Array();
          //
          var attrlist = objnode.attributes;
          var na = attrlist.length;
          //
          // Su IE gli attributi arrivano al contrario..
          if (RD3_Glb.IsIE())
          {
            for (var ia = na-1; ia >= 0; ia--) 
            {
              var attrnode = attrlist.item(ia);
              this.ColorList.push(attrnode.nodeValue);
            }
          }
          else
          {
            for (var ia = 0; ia < na; ia++) 
            {
              var attrnode = attrlist.item(ia);
              this.ColorList.push(attrnode.nodeValue);
            }
          }
        }
        //
        // Ho cambiato la value list del campo, quindi devo ricaricare il campo
        if (this.Realized)
          this.SetActualPosition(this.ParentPanel.ActualPosition);
      }
      break;
      
      case "tks":
      {
        // Vediamo se mi e' stata tolta la lista (es: tramite ClearValueList)
        if (objnode.getAttribute("del")=="1")
          this.TokenList = null;
        else
        {
          this.TokenList = new ValueList();
          this.TokenList.LoadFromXml(objnode);
        }
        //
        // Ho cambiato la value list del campo, quindi devo ricaricare il campo
        if (this.Realized)
          this.SetActualPosition(this.ParentPanel.ActualPosition);
      }
      break;
      
      case "fls":
      {
        // Vediamo se mi e' stata tolta la lista (es: tramite ClearValueList)
        if (objnode.getAttribute("del")=="1")
          this.FontList = null;
        else
        {
          this.FontList = new ValueList();
          this.FontList.LoadFromXml(objnode);
        }
        //
        // Ho cambiato la value list del campo, quindi devo ricaricare il campo
        if (this.Realized)
          this.SetActualPosition(this.ParentPanel.ActualPosition);
      }
      break;
       
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
PField.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta' + caricamento lista valori
  this.LoadFromXml(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
PField.prototype.LoadProperties = function(node)
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
      case "idx": this.SetIndex(parseInt(valore)); break;
      case "vis": this.SetVisible(valore=="1"); break;
      case "ena": this.SetEnabled(valore=="1"); break;      
      case "sty": this.SetVisualStyle(parseInt(valore)); break;
      case "lli": this.SetListList(valore=="1"); break;
      case "act": this.SetCanActivate(valore=="1"); break;
      case "aci": this.SetActivatorImage(valore); break;
      case "acw": this.SetActivatorWidth(parseInt(valore)); break;      
      case "opt": this.SetOptional(parseInt(valore)); break;
      case "lke": this.SetLKE(valore=="1"); break;
      case "img": this.SetImage(valore); break;
      case "irm": this.SetImageResizeMode(parseInt(valore)); break;
      case "hdr": this.SetHeader(valore); break;
      case "tip": this.SetTooltip(valore); break;
      case "pag": this.SetPage(parseInt(valore)); break;
      case "gru": this.SetGroup(valore); break;
      case "dat": this.SetDataType(parseInt(valore)); break;
      case "max": this.SetMaxLength(parseInt(valore)); break;
      case "smo": this.SetSortMode(parseInt(valore)); break;
      case "inl": this.SetInList(valore=="1"); break;
      case "lih": this.SetListHeader(valore); break;
      case "hdl": this.SetHdrList(valore=="1"); break;
      case "hla": this.SetHdrListAbove(valore=="1"); break;
      case "lle": this.SetListLeft(parseInt(valore)); break;
      case "lto": this.SetListTop(parseInt(valore)); break;
      case "lwi": this.SetListWidth(parseInt(valore), true); break;
      case "lhe": this.SetListHeight(parseInt(valore), true); break;
      case "lnr": this.SetListNumRows(parseInt(valore)); break;
      case "lhr": this.SetListHResMode(parseInt(valore)); break;
      case "lvr": this.SetListVResMode(parseInt(valore)); break;
      case "lhs": this.SetListHeaderSize(parseInt(valore)); break;
      case "lta": this.SetListTabOrder(parseInt(valore)); break;
      case "inf": this.SetInForm(valore=="1"); break;
      case "foh": this.SetFormHeader(valore); break;
      case "hdf": this.SetHdrForm(valore=="1"); break;
      case "hfa": this.SetHdrFormAbove(valore=="1"); break;
      case "fle": this.SetFormLeft(parseInt(valore)); break;
      case "fto": this.SetFormTop(parseInt(valore)); break;
      case "fwi": this.SetFormWidth(parseInt(valore), true); break;
      case "fhe": this.SetFormHeight(parseInt(valore), true); break;
      case "fnr": this.SetFormNumRows(parseInt(valore)); break;
      case "fhr": this.SetFormHResMode(parseInt(valore)); break;
      case "fvr": this.SetFormVResMode(parseInt(valore)); break;
      case "fhs": this.SetFormHeaderSize(parseInt(valore)); break;
      case "fta": this.SetFormTabOrder(parseInt(valore)); break;
      case "idp": this.SetIdxPanel(parseInt(valore)); break;
      case "sub": this.SetSubFrame(valore); break;
      case "qvs": this.SetHasValueSource(valore=="1"); break;
      case "alo": this.SetAutoLookup(valore=="1"); break;
      case "edi": this.SetEditorType(parseInt(valore)); break;
      case "fsc": this.SetScale(parseInt(valore)); break;
      case "cmd": this.SetCommand(valore); break;
      case "cva": this.SetCauseValidation(valore=="1"); break;
      case "acd": this.SetActivableDisabled(valore=="1"); break;
      case "srt": this.SetFieldCanSort(valore=="1"); break;
      case "qen": this.SetQBEEnabled(valore=="1"); break;
      case "sac": this.SetSuperActive(valore=="1"); break;
      case "uhl": this.SetUseHL(valore=="1"); break;
      case "mup": this.SetMultiUpload(valore=="1"); break;
      case "mus": this.SetMaxUploadSize(parseInt(valore)); break;
      case "muf": this.SetMaxUploadFiles(parseInt(valore)); break;
      case "uex": this.SetUploadExtensions(valore); break;
      case "uds": this.SetUploadDescription(valore); break;
      case "vfl": this.SetVisualFlags(parseInt(valore)); break;
      case "unb": this.SetUnbound(valore=="1"); break;
      case "cms": this.SetComboMultiSel(valore=="1"); break;
      case "cvs": this.SetComboValueSep(valore); break;
      case "uts": this.SetUseTextSel(valore=="1"); break;
      case "bkc": this.SetBackColor(valore); break;
      case "frc": this.SetForeColor(valore); break;
      case "msk": this.SetMask(valore); break;
      case "ftm": this.SetFontMod(valore); break;
      case "aln": this.SetAlignment(parseInt(valore)); break;
      case "wtm": this.SetWaterMark(valore); break;
      case "ocb": this.DoOpenCombo = (valore=="1"); break;
      case "ipk": this.SetIsPK(valore=="1"); break;
      case "dbc": this.SetDBCode(valore); break;
      case "bdg": this.SetBadge(valore); break;
      case "uet": this.SetShowEditorTool(valore=="1"); break;
      case "itc": this.SetEditorCommands(parseInt(valore)); break;
      case "def": this.SetDefaultFormatting(valore); break;
      case "cln": this.SetClassName(valore); break;
      case "aof": this.SetAggregateOfField(parseInt(valore)); break;
      case "pdp": this.SetPosDimPerc(valore); break;
      case "qbf": this.SetQBEFilter(valore); break;
      case "gro": this.SetGroupMode(valore); break;
      case "fbr": this.SetBreakRow(valore == "1"); break;
      case "oqbf": this.DoOpenQBEPopupFilter = (valore=="1"); break;
      case "qbl": this.QBELike = (valore=="1"); break;
      
      case "clk": this.ClickEventDef = parseInt(valore); break;
      case "chg": this.ChangeEventDef = parseInt(valore); break;
      
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
PField.prototype.SetIndex= function(value) 
{
  if (value!=undefined)
    this.Index = value;
  //
  // L'indice non puo' cambiare dopo che e' stato impostato
}

PField.prototype.SetFieldCanSort= function(value) 
{
  if (value!=undefined)
    this.CanSort = value;
  //
  // Questa proprieta' non varia dopo l'inizializzazione
}

PField.prototype.SetQBEEnabled= function(value) 
{
  var old = this.QBEEnabled;
  if (value!=undefined)
    this.QBEEnabled = value;
  //
  // Se sono realizzato ed il pannello a cui appartengo e' in QBE ed e' cambiato lo stato
  if (this.Realized && this.ParentPanel.Status == RD3_Glb.PS_QBE && old!=this.QBEEnabled)
  {
    // Aggiorno la cella (la prima in lista o quella in form)
    if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST)
      this.PListCells[0].SetQBEEnabled(this.QBEEnabled);
    else
      this.PFormCell.SetQBEEnabled(this.QBEEnabled);
  }
}

PField.prototype.SetSuperActive= function(value) 
{
  if (value!=undefined)
    this.SuperActive = value;
  //
  // Questa proprieta' viene verificata ogni volta nel keypress di PValue
}

PField.prototype.SetUseHL= function(value) 
{
  if (value!=undefined)
    this.UseHL = value;
  //
  // Questa proprieta' viene verificata ogni volta nel mouse over-out
}

PField.prototype.SetMultiUpload = function(value) 
{
  // Verifico se si puo' fare l'upload HTML o siamo su un dispositivo touch
  if (value!=undefined)
    this.MultiUpload = value && ((RD3_ServerParams.UseHTML5Upload && typeof FileReader!="undefined") || RD3_Glb.IsTouch());
}

PField.prototype.SetMaxUploadSize = function(value) 
{
  if (value!=undefined)
    this.MaxUploadSize = value;
}

PField.prototype.SetMaxUploadFiles = function(value) 
{
  if (value!=undefined)
    this.MaxUploadFiles = value;
}

PField.prototype.SetUploadExtensions = function(value) 
{
  if (value!=undefined)
  {
    if (RD3_ServerParams.UseHTML5Upload && typeof FileReader != "undefined" && value != "*.*")
    {
      this.UploadExtensions = value.replace(/\*/g, '');
      this.UploadExtensions = this.UploadExtensions.replace(/;/g, ',');
    }
    else
      this.UploadExtensions = value;
  }
}

PField.prototype.SetUploadDescription = function(value) 
{
  if (value!=undefined)
    this.UploadDescription = value;
}

PField.prototype.SetVisualFlags= function(value) 
{
  var old = this.VisualFlags;
  var oldVis = this.Realized ? this.IsVisible() : true;
  var oldHiddenINList = this.Realized ? this.HiddenInList() : true;
  //
  if (value!=undefined)
    this.VisualFlags = value;
  //
  if (old != this.VisualFlags && this.Realized && !this.Realizing)
  {
    // Ricalcolo lo stato del mio CanSort
    // e poi aggiorno il campo
    this.SetCanSort();
    if (this.IsStatic())
      this.UpdateVisualStyle(this.VisualStyle);
    else
      this.ParentPanel.ResetPosition = true;
    //
    if (oldHiddenINList != this.HiddenInList() && !this.Realizing && this.InList)
    {
      this.ParentPanel.ResetPosition = true;
      this.ParentPanel.RecalcLayout = true;
      //
      // Forzo il resize+se il campo e' diventato visibile mi memorizzo che devo recuperare la sua larghezza
      if (oldVis !== this.IsVisible()) 
      {
        this.ParentPanel.ResVisFld = true;
        if (this.ParentPanel.ResOnlyVisFlds)
          this.UpdFldVs = true;
      }
    }
  }
  //
  // Nella fase di avvio se il pannello gestisce il ridimensionamento dei campi visibili e sono in una modale devo forzare il resize, altrimenti non 
  // verrebbe gestito
  if (this.Realizing && this.InList && this.ListList && this.HiddenInList() && (this.ParentPanel.ResOnlyVisFlds && this.ParentPanel.WebForm.Modal != 0))
    this.ParentPanel.ResVisFld = true;
}

PField.prototype.SetVisible= function(value) 
{
  var old = this.Visible;
  //
  if (value!=undefined)
    this.Visible = value;
  //
  if (this.Realized)
  {
    this.UpdateFieldVisibility();
    //
    if (old!=this.Visible && !this.Realizing)
    {
      var oldt = this.FirstListFld;
      //
      // Devo aggiornare i valori!
      this.SetActualPosition();
      //
      // Se il pannello e' gruppato ed io sono il primo campo in lista o lo sono diventato forzo il 
      // ridisegnamento di tutti i valori
      if ((oldt || this.FirstListFld) && this.ParentPanel.IsGrouped())
        this.ParentPanel.ResetPosition = true;
      //
      this.ParentPanel.RecalcLayout = true;
      //
      // Forzo il resize+se il campo e' diventato visibile mi memorizzo che devo recuperare la sua larghezza
      this.ParentPanel.ResVisFld = true;
      if (this.ParentPanel.ResOnlyVisFlds)
        this.UpdFldVs = true;
      //
      if (this.ParentPanel.IsFluidPanel())
        this.ParentPanel.RefreshRowsClasses = true;
    }
  }
}

PField.prototype.SetEnabled= function(value) 
{
  var old = this.Enabled;
  //
  if (value!=undefined)
    this.Enabled = value;
  //
  if (this.Realized)
  {
    if ((old!=this.Enabled||value==undefined) && !this.Realizing)
      this.SetActualPosition();
    //
    // Aggiusto il cursore del campo di tipo statico
    if (this.IsStatic())
    {
      // Un campo statico e' cliccabile se e' abilitato oppure se e' selezionato il flag ActivableDisabled
      var h = (this.IsEnabled() || this.ActivableDisabled) && this.VisHyperLink(this.VisualStyle);
      if (this.ListCaptionBox)
        this.ListCaptionBox.style.cursor = h? "pointer":"";
      if (this.FormCaptionBox)
        this.FormCaptionBox.style.cursor = h? "pointer":"";
      //
      if (this.IsButton())
      {
        if (this.ListCaptionBox)
          this.ListCaptionBox.disabled = !h;
        if (this.FormCaptionBox)
          this.FormCaptionBox.disabled = !h;
      }
    }
  }
}

PField.prototype.SetEditorType= function(value) 
{
  if (value!=undefined)
    this.EditorType = value;
  //
  // Funzione usata solo a livello di impostazione iniziale
}

PField.prototype.SetScale= function(value) 
{
  if (value!=undefined)
    this.Scale = value;
  // Valore utilizzato dalla render dei valori
}

PField.prototype.SetCommand= function(value) 
{
  if (value!=undefined)
    this.Command = RD3_DesktopManager.ObjectMap[value];
  // Non viene modificato dopo l'inizializzazione
}

PField.prototype.SetVisualStyle= function(value) 
{
  var oldvs = this.VisualStyle;
  //
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
  //
  if (this.Realized)
  {
    if (this.VisualStyle)
    {
      // Se e' statico, aggiorno anche il cursore
      if (this.IsStatic())
        this.SetEnabled();
      //
      this.UpdateVisualStyle(this.VisualStyle);
      //
      // Se ho un subframe, azzero i padding
      if (this.SubFrame || this.MultiUpload)
      {
        if (this.ListCaptionBox)
          this.ListCaptionBox.style.padding="0px";
        if (this.FormCaptionBox)
          this.FormCaptionBox.style.padding="0px";
      }
      //
      // Verifico se il VS e' cambiato e se il pannello padre e' stato gia' realizzato:
      // se non e' realizzato sono stato chiamato durante la sua realizzazione, quindi la renderizzazione sara' fatta comunque e non la forzo,
      // se e' realizzato forzo la renderizzazione
      if (((oldvs!=this.VisualStyle) || value==undefined) && this.ParentPanel.Realized)
        this.ParentPanel.ResetPosition = true;
    }
  }
}

PField.prototype.SetListList= function(value) 
{
  if (value!=undefined)
    this.ListList = value;
  //
  // L'appartenenza alla lista non puo' cambiare dopo che e' stata impostata
}

PField.prototype.SetListTabOrder= function(value) 
{
  if (value!=undefined)
    this.ListTabOrder = value;
  //
  // L'ordine di tabulazione cambia solo durante l'inizializzazione
}

PField.prototype.SetFormTabOrder= function(value) 
{
  if (value!=undefined)
    this.FormTabOrder = value;
  //
  // L'ordine di tabulazione cambia solo durante l'inizializzazione
}

PField.prototype.SetCanActivate= function(value) 
{
  if (value!=undefined)
    this.CanActivate = value;
  //
  // Questa proprieta' non puo' cambiare a run time
}

PField.prototype.SetHasValueSource= function(value) 
{
  if (value!=undefined)
    this.HasValueSource = value;
  //
  // Questa proprieta' viene impostata solo durante l'inizializzazione
}

PField.prototype.SetAutoLookup= function(value) 
{
  if (value!=undefined)
    this.AutoLookup = value;
  //
  // Questa proprieta' viene impostata solo durante l'inizializzazione
}

PField.prototype.SetActivatorImage= function(value) 
{
  var old = this.ActImage;
  if (value!=undefined)
    this.ActImage = value;
  //
  if (this.Realized && old!=this.ActImage)
  {
    // Devo riaggiornare tutta la colonna
    this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetActivatorWidth= function(value) 
{
  var old = this.ActWidth;
  if (value!=undefined)
    this.ActWidth = value;
  //
  if (this.Realized && old!=this.ActWidth)
  {
    // Devo riaggiornare tutta la colonna
    this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetOptional= function(value) 
{
  if (value!=undefined)
    this.Optional = value;
  //
  // Questa proprieta' e' definita nel VCE ma e' consigliato impostarla solo nella Load, quindi non dovrebbe mai cambiare;
  // nel caso qualcuno la dovesse usare biognera' far aggiornare i VS del campo.
}

PField.prototype.SetLKE= function(value) 
{
  if (value!=undefined)
    this.LKE = value;
  //
  // Cambia solo durante l'inizializzazione
}

PField.prototype.SetCauseValidation= function(value) 
{
  if (value!=undefined)
    this.CauseValidation = value;
  //
  if (this.Realized)
  {
    this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetActivableDisabled= function(value) 
{
  if (value!=undefined)
    this.ActivableDisabled = value;
  //
  if (this.Realized)
  {
    this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetImage= function(value) 
{
  var old = this.Image;
  //
  if (value!=undefined)
    this.Image = value;
  //
  if (this.Realized && (old!=this.Image || (value==undefined && this.Image!="")))
  {
    if (!RD3_ServerParams.ShowFieldImageInValue || this.IsStatic())
    {
      // L'immagine va mostrata negli header
      if (this.FormCaptionBox)
        this.ApplyBackgroundImage(this.FormCaptionBox.style);
      if (this.ListCaptionBox)
        this.ApplyBackgroundImage(this.ListCaptionBox.style);
    }
    //
    if (RD3_ServerParams.ShowFieldImageInValue)
    {
      // L'immagine va nel valore
      if (this.PFormCell)
      {
        if (this.Image != "")
        {
          var url = this.Image;
          if (!RD3_Glb.IsAbsoluteUrl(this.Image))
            url = RD3_Glb.GetAbsolutePath() + "images/" + this.Image;
          //
          this.PFormCell.SetBackGroundImage("url(" + encodeURI(url) + ")");
        }
        else
          this.PFormCell.SetBackGroundImage("");
      }
      if (this.PListCells && !this.DelayedUpdate)
      {
        var n = this.PListCells.length;
        for (var i=0; i<n; i++)
        {
          if (this.Image != "")
          {
            var url = this.Image;
            if (!RD3_Glb.IsAbsoluteUrl(this.Image))
              url = RD3_Glb.GetAbsolutePath() + "images/" + this.Image;
            //
            this.PListCells[i].SetBackGroundImage("url(" + encodeURI(url) + ")");
          }
          else
            this.PListCells[i].SetBackGroundImage("");
        }
      }
    }
  }
}

PField.prototype.SetImageResizeMode= function(value) 
{
  var old = this.ImageResizeMode;
  //
  if (value!=undefined)
    this.ImageResizeMode = value;
  //
  if (this.Realized && (old != this.ImageResizeMode || value == undefined))
  {
    if (!RD3_ServerParams.ShowFieldImageInValue || this.IsStatic())
    {
      // L'immagine va mostrata negli header
      var br = "";
      var bp = "";
      var bs = "";
      var bsPName = "background-size";
      if (RD3_Glb.IsFirefox(3))
        bsPName = "-moz-background-size";
      if (RD3_Glb.IsSafari())
        bsPName = "-webkit-background-size";
//        if (RD3_Glb.IsOpera())
//          bsPName = "-o-background-size";
      switch (this.ImageResizeMode)
      {
        case 1: // Repeat
          br = "repeat";
          break;

        case 2: // Center
          br = "no-repeat";
          if (!this.UseHL)
          bp = "center center";
          break;

        case 3: // Stretch
          bs = "100% 100%";
          break;
      }
      if (this.FormCaptionBox)
      {
        var s = this.FormCaptionBox.style;
        s.backgroundRepeat = br;
        s.backgroundPosition = bp;
        if (RD3_Glb.IsIE(10, false) || !s.setProperty)    // IE10 embeddato
          this.ApplyBackgroundImage(s);
        else
          s.setProperty(bsPName, bs, null);
        //
        // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
        if (this.ImageResizeMode != 3 && RD3_Glb.Adapt4Retina(this.Identifier, this.Image, this.FormHeight, 1))
          s.backgroundSize = "0px 0px";
      }
      if (this.ListCaptionBox)
      {
        var s = this.ListCaptionBox.style;
        s.backgroundRepeat = br;
        s.backgroundPosition = bp;
        if (RD3_Glb.IsIE(10, false) || !s.setProperty)    // IE10 embeddato
          this.ApplyBackgroundImage(s);
        else
          s.setProperty(bsPName, bs, null);
        //
        // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro     
        if (this.ImageResizeMode != 3 && RD3_Glb.Adapt4Retina(this.Identifier, this.Image, this.ListHeight, 2))
          s.backgroundSize = "0px 0px";
      }
    }
    //
    if (RD3_ServerParams.ShowFieldImageInValue)
    {
      // L'immagine va nel valore
      if (this.PFormCell)
        this.PFormCell.SetBackGroundImageRM(this.ImageResizeMode);
      //
      if (this.PListCells && !this.DelayedUpdate)
      {
        var n = this.PListCells.length;
        for (var i=0; i<n; i++)
          this.PListCells[i].SetBackGroundImageRM(this.ImageResizeMode);
      }
    }
  }
}

PField.prototype.ApplyBackgroundImage = function(style, otherbackstyle)
{
  if (otherbackstyle==undefined)
    otherbackstyle="";
  else if (otherbackstyle != "")
  {
    if (this.Image != "")
      otherbackstyle=", "+otherbackstyle;
  }
  //
  var imgPath = this.Image;
  if (!RD3_Glb.IsAbsoluteUrl(this.Image))
    imgPath = RD3_Glb.GetAbsolutePath() + "images/" + this.Image;
  imgPath = encodeURI(imgPath);
  //
  if (this.ImageResizeMode == 3 && this.Image != "")
  {
    if (RD3_Glb.IsIE(10, false))
    {
      style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + imgPath + "', sizingMethod='scale')";
      style.backgroundImage = "";
    }
    else
      style.backgroundImage = "url(" + imgPath + ")" + otherbackstyle;
  }
  else
  {
    if (RD3_Glb.IsIE(10, false))
    {
      var ft = "progid:DXImageTransform.Microsoft.AlphaImageLoader";
      if (style.filter.substring(0, ft.length) == ft)
        style.removeAttribute("filter");
    }
    //
    style.backgroundImage = (this.Image != "" ? "url(" + imgPath + ")" : "") + otherbackstyle;
  }
}

PField.prototype.SetHeader= function(value) 
{
  if (value!=undefined)
    this.Header = value;
  //
  // Il sistema chiama: SetHeader, SetListHeader e SetFormHeader. La prima e' pensata per
  // i campi statici, le altre 2 per i campi di pannello. Tutte e 3 le funzioni vengono chiamate
  // durante la realizzazione. In quel frangente non voglio che la SetHeader si attivi per 
  // ragioni di performance (innerHTML). Ma i campi statici non usano le altre 2 quindi
  // questa deve comunque passare anche se sono in fase di realizzazione
  if (this.Realized && !this.SubFrame && (!this.Realizing || this.IsStatic()))
  {
    if (this.MultiUpload)
    {
      if (RD3_Glb.IsIE(10, false))
        this.MUPHeader.innerText = this.Header;
      else
        this.MUPHeader.textContent = this.Header;
      //
      return;
    }
    // Se esiste una forma abbreviata uso quella, altrimenti uso l'header (per static sempre Header)
    var head = ((this.FormHeader=="" && this.Header!="") || this.IsStatic()) ? this.Header : this.FormHeader;
    if (this.FormCaptionBox)
    {
      // Eseguo eventuali script presenti nell'HTML (compatibilita' vecchie versioni)
      if (this.IsStatic())
        this.RunJScript(head);
      //
      if (this.IsButton())
        this.FormCaptionBox.value = head;
      else
      {
        if (RD3_ServerParams.Theme.startsWith("zen"))
          this.FormCaptionBox.innerHTML = "<span>" + head + "</span>";
        else
          this.FormCaptionBox.innerHTML = head;
      }
      //
      // Potrei aver rimosso i pulsanti del blob: se sono definiti li reinserisco
      if (this.FormBlobUploadImg)
      {
        this.FormCaptionBox.appendChild(this.FormBlobUploadImg);
        this.FormCaptionBox.appendChild(this.FormBlobDeleteImg);
        this.FormCaptionBox.appendChild(this.FormBlobZoomImg);
        //
        if (this.UseHTML5ForUpload() && this.FormFlashUploader)
          this.FormCaptionBox.appendChild(this.FormFlashUploader);
      }
    }
    //
    head = ((this.ListHeader=="" && this.Header!="") || this.IsStatic()) ? this.Header : this.ListHeader;
    if (this.ListCaptionBox)
    {
      // Se avevo una SortImage, la stacco da suo padre (che sono io)
      // dato che la innerHTML=head distrugge i miei figli!
      if (this.SortImage)
         this.SortImage.parentNode.removeChild(this.SortImage);
       if (this.FilterCommand)
         this.FilterCommand.parentNode.removeChild(this.FilterCommand);
      //
      // Eseguo eventuali script presenti nell'HTML (compatibilita' vecchie versioni)
      if (this.IsStatic())
        this.RunJScript(head);
      //
      if (this.IsButton())
        this.ListCaptionBox.value = head;
      else
      {
        if (RD3_ServerParams.Theme.startsWith("zen"))
          this.ListCaptionBox.innerHTML = "<span class='header-list-span-obj-zen' >" + head + "</span>";
        else
          this.ListCaptionBox.innerHTML= head;
      }
      //
      // Poi la riattacco
      if (this.SortImage)
        this.ListCaptionBox.appendChild(this.SortImage);
      if (this.FilterCommand)
        this.ListCaptionBox.appendChild(this.FilterCommand);
    }
  }
}

PField.prototype.SetTooltip= function(value) 
{
  if (value!=undefined)
    this.Tooltip = value;
  //
  if (this.Realized)
  {
    if (this.FormCaptionBox)
      RD3_TooltipManager.SetObjTitle(this.FormCaptionBox, this.Tooltip);
    if (this.ListCaptionBox)
      RD3_TooltipManager.SetObjTitle(this.ListCaptionBox, this.Tooltip);
  }
}

PField.prototype.SetPage= function(value) 
{
  if (value!=undefined)
    this.Page = value;
  //
  // Cambia solo durante l'inizializzazione
}

PField.prototype.SetGroup= function(value) 
{
  if (value != undefined)
  {
    if (value.Identifier)
    {
      // Era gia' un gruppo
      this.Group = value;
    }
    else
    {
      // Controllo se il gruppo e' stato creato, se non e' stato creato mi memorizzo l'identificatore
      var grp = RD3_DesktopManager.ObjectMap[value];
      if (grp)
        this.Group = grp;
      else
        this.Group = value;
    }
  }
  //
  // Cambia solo durante l'inizializzazione
}

PField.prototype.SetDataType= function(value) 
{
  if (value!=undefined)
    this.DataType = value;
  //
  if (this.Realized)
  {   
    var parentContext = this;
    //
    // Creo o distruggo la caption del blob
    if (this.DataType==10 && this.ListBlobUploadImg==null && this.FormBlobUploadImg==null)
    {
      var mob = RD3_Glb.IsMobile();
      //
      // In caso di dispositivo mobile, l'upload passa da PICUPAPP
      // Creo la stringa di chiamata solo in questo caso
      var zUrl = "";
      if (RD3_Glb.IsTouch())
      {
        var uploadUrl = window.location.href;
        uploadUrl += "?WCI=IWUpload";
        uploadUrl += "&WCE=" + this.Identifier;
        uploadUrl += "&SESSIONID=" + RD3_DesktopManager.WebEntryPoint.SessionID;
        //
        var cbUrl = window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+"uploadcomplete.htm";
        //        
        zUrl = "fileupload://new?returnstatus=false";       
        zUrl += "&posturl="+encodeURIComponent(uploadUrl);
        zUrl += "&callbackurl="+encodeURIComponent(cbUrl);
        zUrl += "&purpose="+encodeURIComponent("Scegli una foto da caricare");
        zUrl += "&referrerName="+encodeURIComponent(RD3_DesktopManager.WebEntryPoint.MainCaption);
      }
      //
      if (this.ListCaptionBox)
      {
        if (RD3_Glb.IsTouch())
        {
          this.ListBlobUploadImg = document.createElement("a");
          this.ListBlobUploadImg.href = zUrl;
          this.ListBlobUploadImg.className = "panel-blob-fileupload";
        }
        else if (this.UseHTML5ForUpload())
        {
          this.ListFlashUploader = this.CreateHTML5Uploader(true);
          this.ListBlobUploadImg = document.createElement("img");
          this.ListBlobUploadImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'upload:list'); };
          if (!mob) this.ListBlobUploadImg.src = RD3_Glb.GetImgSrc("images/upload.gif");
          this.ListBlobUploadImg.className = "panel-blob-button";
          //
          var drp = function(ev) { parentContext.OnHTML5Drop(ev); };
          var drg = function(ev) { parentContext.OnHTML5Drag(ev); };
          this.ListCaptionBox.ondrop = drp;
          this.ListCaptionBox.ondragover = drg;
        }
        else
        {
          this.ListBlobUploadImg = document.createElement("img");
          this.ListBlobUploadImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'upload'+parentContext.Index); };
          if (!mob) this.ListBlobUploadImg.src = RD3_Glb.GetImgSrc("images/upload.gif");
          this.ListBlobUploadImg.className = "panel-blob-button";
        }
        //
        RD3_TooltipManager.SetObjTitle(this.ListBlobUploadImg, RD3_ServerParams.CaricaDoc);
        this.ListCaptionBox.appendChild(this.ListBlobUploadImg);
        if (this.UseHTML5ForUpload() && !RD3_Glb.IsTouch())
          this.ListCaptionBox.appendChild(this.ListFlashUploader);
        //
        this.ListBlobDeleteImg = document.createElement("img");
        this.ListBlobDeleteImg.className = "panel-blob-button";
        this.ListBlobDeleteImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'delblob'+parentContext.Index); };
        RD3_TooltipManager.SetObjTitle(this.ListBlobDeleteImg, RD3_ServerParams.CancellaDoc);
        if (!mob) this.ListBlobDeleteImg.src = RD3_Glb.GetImgSrc("images/delbl.gif");
        this.ListCaptionBox.appendChild(this.ListBlobDeleteImg);
        //
        this.ListBlobZoomImg = document.createElement("img");
        this.ListBlobZoomImg.className = "panel-blob-button";
        this.ListBlobZoomImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'zoom'); };
        RD3_TooltipManager.SetObjTitle(this.ListBlobZoomImg, RD3_ServerParams.VisualizzaDocumento);
        if (!mob) this.ListBlobZoomImg.src = RD3_Glb.GetImgSrc("images/zoom.gif");
        this.ListCaptionBox.appendChild(this.ListBlobZoomImg);
      }
      //
      if (this.FormCaptionBox)
      {
        if (RD3_Glb.IsTouch()) 
        {
          this.FormBlobUploadImg = document.createElement("a");
          this.FormBlobUploadImg.href = zUrl;
          this.FormBlobUploadImg.className = "panel-blob-fileupload";
        }
        else if (this.UseHTML5ForUpload())
        {
          this.FormFlashUploader = this.CreateHTML5Uploader(false);
          this.FormBlobUploadImg = document.createElement("img");
          this.FormBlobUploadImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'upload:form'); };
          if (!mob) this.FormBlobUploadImg.src = RD3_Glb.GetImgSrc("images/upload.gif");
          this.FormBlobUploadImg.className = "panel-blob-button";
          //
          var drp = function(ev) { parentContext.OnHTML5Drop(ev); };
          var drg = function(ev) { parentContext.OnHTML5Drag(ev); };
          this.FormCaptionBox.ondrop = drp;
          this.FormCaptionBox.ondragover = drg;
        }
        else
        {
          this.FormBlobUploadImg = document.createElement("img");
          this.FormBlobUploadImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'upload'+parentContext.Index); };
          if (!mob) this.FormBlobUploadImg.src = RD3_Glb.GetImgSrc("images/upload.gif");
          this.FormBlobUploadImg.className = "panel-blob-button";
        }
        //
        RD3_TooltipManager.SetObjTitle(this.FormBlobUploadImg, RD3_ServerParams.CaricaDoc);
        this.FormCaptionBox.appendChild(this.FormBlobUploadImg);
        if (this.UseHTML5ForUpload() && !RD3_Glb.IsTouch())
          this.FormCaptionBox.appendChild(this.FormFlashUploader);
        //
        this.FormBlobDeleteImg = document.createElement("img");
        this.FormBlobDeleteImg.className = "panel-blob-button";
        this.FormBlobDeleteImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'delblob'+parentContext.Index); };
        RD3_TooltipManager.SetObjTitle(this.FormBlobDeleteImg, RD3_ServerParams.CancellaDoc);
        if (!mob) this.FormBlobDeleteImg.src = RD3_Glb.GetImgSrc("images/delbl.gif");
        this.FormCaptionBox.appendChild(this.FormBlobDeleteImg);
        //
        this.FormBlobZoomImg = document.createElement("img");
        this.FormBlobZoomImg.className = "panel-blob-button";
        this.FormBlobZoomImg.onclick = function(ev) { parentContext.OnBlobCommand(ev, 'zoom'); };
        RD3_TooltipManager.SetObjTitle(this.FormBlobZoomImg, RD3_ServerParams.VisualizzaDocumento);
        if (!mob) this.FormBlobZoomImg.src = RD3_Glb.GetImgSrc("images/zoom.gif");
        this.FormCaptionBox.appendChild(this.FormBlobZoomImg);      
      }
    }
    //
    if (this.DataType!=10)
    {
      if (this.ListBlobUploadImg!=null)
      {
        this.ListBlobUploadImg.parentNode.removeChild(this.ListBlobUploadImg);
        this.ListBlobDeleteImg.parentNode.removeChild(this.ListBlobDeleteImg);
        this.ListBlobZoomImg.parentNode.removeChild(this.ListBlobZoomImg);
        this.ListBlobUploadImg=null;
        this.ListBlobDeleteImg=null;
        this.ListBlobZoomImg=null;
      }
      if (this.FormBlobUploadImg!=null)
      {
        this.FormBlobUploadImg.parentNode.removeChild(this.FormBlobUploadImg);
        this.FormBlobDeleteImg.parentNode.removeChild(this.FormBlobDeleteImg);
        this.FormBlobZoomImg.parentNode.removeChild(this.FormBlobZoomImg);
        this.FormBlobUploadImg=null;
        this.FormBlobDeleteImg=null;
        this.FormBlobZoomImg=null;
      }
    }
  }
}

PField.prototype.SetMaxLength= function(value) 
{
  if (value!=undefined)
    this.MaxLength = value;
}

PField.prototype.SetSortMode= function(value) 
{
  if (this.Realizing)
    return;
  //
  if (value!=undefined)
    this.SortMode = value;
  //
  if (this.Realized && this.SortImage)
  {
    var im = "sortno";
    switch (this.SortMode)
    {
      case 1: im = "sortdn"; break;
      case -1: im = "sortup"; break;
    }
    im+=RD3_Glb.IsMobile()?".png":".gif";
    //
    var oldsrc = this.SortImage.src;
    if ((RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro()) && !RD3_Glb.IsIE() && !RD3_Glb.IsEdge())
      this.SortImage.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/"+im)+"')";
    else
      this.SortImage.src = RD3_Glb.GetImgSrc("images/"+im);
    //
    // Se e' cambiata l'immagine, chiedo al pannello di riposizionarla a fine richiesta (quando
    // tutto e' nel DOM!)
    if (this.SortImage.src != oldsrc)
      this.ParentPanel.AdaptFieldsSortImage = true;
  }
}


PField.prototype.SetGroupMode= function(value) 
{
  // Lo uso solo in PopupFilter per decidere se sto raggruppando o no
  if (value != undefined)
    this.GroupMode = value;
}

PField.prototype.AdaptSortImage= function()
{
  // Se non sono stato ancora realizzato o non ho piu' l'immagine... lascio perdere
  if (!this.Realized || !this.SortImage)
    return
  //
  // SortMode=0 non e' visibile se non in simplicity! Quindi e' inutile posizionarla!
  if (this.SortMode==1 || this.SortMode==-1 || RD3_ServerParams.Theme.startsWith("simplicity"))
  {
    // Posizionamento sortimage
    var a = this.VisualStyle.GetAlignment(2); // VISALI_HDRLIST
    if (a==1) // VISALN_AUTO
      a = (RD3_Glb.IsNumericObject(this.DataType)) ? 4 : 2; // VISALN_DX : VISALN_SX
    if (a!=4) // VISALN_DX
      a = 2;
    //
    var l = (a==2 ? this.ListCaptionBox.clientWidth - this.SortImage.offsetWidth : 0);
    var t = this.ListCaptionBox.clientHeight - this.SortImage.offsetHeight;
    //    
    this.SortImage.style.left = l + "px";
    this.SortImage.style.top = t + "px";
  }
}


PField.prototype.SetInList= function(value) 
{
  if (value!=undefined)
    this.InList = value;
  //
  // Il fatto che il campo sia nel layout lista non puo' cambiare dopo l'inizializzazione
}

PField.prototype.SetListHeader= function(value) 
{
  if (value!=undefined)
    this.ListHeader = value;
  //
  if (this.Realized && !this.SubFrame)
  {
    if (this.ListCaptionBox && !this.IsStatic())
    {
      var head = (this.ListHeader=="" && this.Header!="") ? this.Header : this.ListHeader;
      //
      // Se avevo una SortImage, la stacco da suo padre (che sono io)
      // dato che la innerHTML=head distrugge i miei figli!
      if (this.SortImage)
         this.SortImage.parentNode.removeChild(this.SortImage);
      if (this.FilterCommand)
         this.FilterCommand.parentNode.removeChild(this.FilterCommand);
      //
      if (RD3_ServerParams.Theme.startsWith("zen"))
        this.ListCaptionBox.innerHTML = "<span class='header-list-span-obj-zen' >" + head + "</span>";
      else
        this.ListCaptionBox.innerHTML = head;
      //
      // Poi la riattacco
      if (this.SortImage)
        this.ListCaptionBox.appendChild(this.SortImage);
      if (this.FilterCommand)
        this.ListCaptionBox.appendChild(this.FilterCommand);
      //
      // Potrei aver tolto i pulsanti del blob: se sono definiti allora li riaggiungo
      if (this.ListBlobUploadImg)
      {
        // Ne controllo solo uno: i pulsanti per il blob sono definiti o distrutti insieme
        this.ListCaptionBox.appendChild(this.ListBlobUploadImg);
        this.ListCaptionBox.appendChild(this.ListBlobDeleteImg);
        this.ListCaptionBox.appendChild(this.ListBlobZoomImg);
        //
        if (this.UseHTML5ForUpload() && this.ListFlashUploader)
          this.ListCaptionBox.appendChild(this.ListFlashUploader);
      }
    }
  }
}

PField.prototype.SetHdrList= function(value) 
{
  if (value!=undefined)
    this.HdrList = value;
  //
  if (this.Realized)
  {
    this.SetListPosition();
  }
}

PField.prototype.SetHdrListAbove= function(value) 
{
  if (value!=undefined)
    this.HdrListAbove = value;
  //
  if (this.Realized)
  {
    this.SetListPosition();
  }
}

PField.prototype.SetListLeft= function(value) 
{
  if (value!=undefined)
    this.ListLeft = value;
  //
  if (this.Realized)
  {
    this.SetListPosition();
  }
}

PField.prototype.SetListTop= function(value) 
{
  if (value!=undefined)
    this.ListTop = value;
  //
  if (this.Realized)
  {
    this.SetListPosition();
  }
}

PField.prototype.SetListWidth= function(value, florg) 
{
  var old = this.ListWidth;
  if (value!=undefined)
    this.ListWidth = value;
  if (florg)
    this.OrgListWidth = this.ListWidth;
  //
  if (this.Realized)
  {
    this.SetListPosition();
    //
    // Se la dimensione e' cambiata
    if (old != this.ListWidth)
    {
      // Devo aggiornare anche la dimensione degli oggetti interni ai campi!
      this.ParentPanel.ResetPosition = true;
      this.ParentPanel.DenyScroll = true;
      this.ParentPanel.AdaptFieldsSortImage = true;
      if (this.SubFrame)
        this.SubFrame.RecalcLayout = true;
    }
  }
}

PField.prototype.SetListHeight= function(value, florg) 
{
  var old = this.ListHeight;
  if (value!=undefined)
    this.ListHeight = value;
  if (florg)
    this.OrgListHeight = this.ListHeight;    
  //
  if (this.Realized)
  {
    this.SetListPosition();
    //
    // Se la dimensione e' cambiata
    if (old != this.ListHeight)
    {
      // Devo aggiornare anche la dimensione degli oggetti interni ai campi!
      this.ParentPanel.ResetPosition = true;
      this.ParentPanel.DenyScroll = true;
      if (this.SubFrame)
        this.SubFrame.RecalcLayout = true;
    }
  }
}

PField.prototype.SetListHeaderSize= function(value) 
{
  if (value!=undefined)
    this.ListHeaderSize = value;
  //
  if (this.Realized)
  {
    this.SetListPosition();
  }
}

PField.prototype.SetListNumRows= function(value) 
{
  if (value!=undefined)
    this.ListNumRows = value;
  //
  // Per ora non cambia a Run-time, vedere NPQ 1093
}

PField.prototype.SetListHResMode= function(value) 
{
  if (value!=undefined)
    this.ListHResMode = value;
  //
  // Cambia solo durante l'inizializzazione
}

PField.prototype.SetListVResMode= function(value) 
{
  if (value!=undefined)
    this.ListVResMode = value;
  //
  // Cambia solo durante l'inizializzazione
}

PField.prototype.SetInForm= function(value) 
{
  if (value!=undefined)
    this.InForm = value;
  //
  // Il fatto che il campo sia nel layout lista non puo' cambiare dopo l'inizializzazione
}

PField.prototype.SetFormHeader= function(value) 
{
  if (value!=undefined)
    this.FormHeader = value;
  //
  if (this.Realized && !this.SubFrame)
  {
    if (this.FormCaptionBox && !this.IsStatic())
    {
      var head = (this.FormHeader=="" && this.Header!="") ? this.Header : this.FormHeader;
      if (RD3_ServerParams.Theme.startsWith("zen"))
        this.FormCaptionBox.innerHTML = "<span>" + head + "</span>";
      else
        this.FormCaptionBox.innerHTML = head;
      //
      this.AdjustHeaderSize();
      //
      // Potrei aver rimosso i pulsanti del blob: se sono definiti li reinserisco
      if (this.FormBlobUploadImg)
      {
        this.FormCaptionBox.appendChild(this.FormBlobUploadImg);
        this.FormCaptionBox.appendChild(this.FormBlobDeleteImg);
        this.FormCaptionBox.appendChild(this.FormBlobZoomImg);
        //
        if (this.UseHTML5ForUpload() && this.FormFlashUploader)
          this.FormCaptionBox.appendChild(this.FormFlashUploader);
      }
    }
  }
}

PField.prototype.SetHdrForm= function(value) 
{
  if (value!=undefined)
    this.HdrForm = value;
  //
  if (this.Realized)
  {
    this.SetFormPosition();
  }
}

PField.prototype.SetHdrFormAbove= function(value) 
{
  if (value!=undefined)
    this.HdrFormAbove = value;
  //
  if (this.Realized)
  {
    this.SetFormPosition();
  }
}

PField.prototype.SetFormLeft= function(value) 
{
  if (value!=undefined)
    this.FormLeft = value;
  //
  if (this.Realized)
  {
    this.SetFormPosition();
  }
}

PField.prototype.SetFormTop= function(value) 
{
  if (value!=undefined)
    this.FormTop = value;
  //
  if (this.Realized)
  {
    this.SetFormPosition();
  }
}

PField.prototype.SetFormWidth= function(value, florg) 
{
  var old = this.FormWidth;
  if (value!=undefined)
    this.FormWidth = value;
  if (florg)
    this.OrgFormWidth = this.FormWidth;
  //
  if (this.Realized)
  {
    this.SetFormPosition();
    //
    // Se la dimensione e' cambiata
    if (old != this.FormWidth)
    {
      // Devo aggiornare anche la dimensione degli oggetti interni ai campi!
      this.ParentPanel.ResetPosition = true;
      this.ParentPanel.DenyScroll = true;
      if (this.SubFrame)
        this.SubFrame.RecalcLayout = true;
    }
  }
}

PField.prototype.SetFormHeight= function(value, florg) 
{
  var old = this.FormHeight;
  if (value!=undefined)
    this.FormHeight = value;
  if (florg)
    this.OrgFormHeight = this.FormHeight;
  //
  if (this.Realized)
  {
    this.SetFormPosition();
    //
    // Se la dimensione e' cambiata
    if (old != this.FormHeight)
    {
      // Devo aggiornare anche la dimensione degli oggetti interni ai campi!
      this.ParentPanel.ResetPosition = true;
      this.ParentPanel.DenyScroll = true;
      if (this.SubFrame)
        this.SubFrame.RecalcLayout = true;
    }
  }
}

PField.prototype.SetFormHeaderSize= function(value) 
{
  if (value!=undefined)
    this.FormHeaderSize = value;
  //
  if (this.Realized)
  {
    this.SetFormPosition();
    this.AdjustHeaderSize();
  }
}

PField.prototype.AdjustHeaderSize= function() 
{
  // Se vado su due righe, stringo le scritte (solo caso mobile, caso form)
  if (this.FormCaptionBox && this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM && RD3_Glb.IsMobile())
  {
    // Prima tolgo il LineHeight, cosi' posso ricalcolare correttamente i valori
    this.FormCaptionBox.style.lineHeight = "";
    //
    // Piccola correzione visualizzativa per chrome desktop..
    var applyLine = true;
    if (RD3_Glb.IsChrome() && !RD3_Glb.IsTouch() && RD3_Glb.HasClass(this.FormCaptionBox, "last-group-field") && this.FormCaptionBox.scrollHeight-this.FormCaptionBox.offsetHeight==1)
      applyLine = false;
    //
    if (this.FormCaptionBox.scrollHeight>this.FormCaptionBox.offsetHeight && applyLine)
    {
      if (!RD3_Glb.IsIE(10,false))
        this.FormCaptionBox.style.setProperty("line-height","100%","important");
      else
        this.FormCaptionBox.style.lineHeight = "100%";
    }
    else
    {
      if (!RD3_Glb.IsIE(10,false))
        this.FormCaptionBox.style.setProperty("line-height","","");
      else
        this.FormCaptionBox.style.lineHeight = "";
    }
  }
}

PField.prototype.SetFormNumRows= function(value) 
{
  if (value!=undefined)
    this.FormNumRows = value;
  //
  // Per ora non cambia a Run-time, vedere NPQ 1093
}

PField.prototype.SetFormHResMode= function(value) 
{
  if (value!=undefined)
    this.FormHResMode = value;
  //
  // Cambia solo durante l'inizializzazione
}

PField.prototype.SetFormVResMode= function(value) 
{
  if (value!=undefined)
    this.FormVResMode = value;
  //
  // Cambia solo durante l'inizializzazione
}

PField.prototype.SetIdxPanel= function(value) 
{
  if (value!=undefined)
    this.IdxPanel = value;
  //
  // Questa proprieta' non puo' essere cambiata dopo l'inizializzazione
}

PField.prototype.SetSubFrame= function(value) 
{
  if (value!=undefined)
  {
    // Se ho gia' un subframe realizzato prima di perderlo lo devo Unrealizzare
    // Entro qui solo per le subform, sono i soli oggetti di tipo frame che posso creare a run-time
    if (this.SubFrame != null && this.SubFrame.Realized == true && this.SubFrame.Unrealize)
    {
      this.SubFrame.Unrealize();
      //
      if (this.SubFrame instanceof SubForm) 
      {
        // La vecchia subform era stata messa nei Frames della videata, la devo cercare e togliere perche' 
        // non essendo piu' realizzata andrebbe in errore..
        var parFrm = this.ParentPanel.WebForm;
        for (var fri = 0; fri < parFrm.Frames.length; fri++)
        {
          if (parFrm.Frames[fri] == this.SubFrame) 
          {
            parFrm.Frames.splice(fri, 1);
            break;
          }  
        }
      }
    }
    //
    this.SubFrame = value;
  }
  //
  // Provo a prendere l'oggetto se non l'avevo gia' fatto
  if (this.SubFrame!=null && !this.SubFrame.Identifier)
  {
    // E' ancora l'ID del frame e non il subframe vero e proprio
    // Lo prelevo dallo stack dei frames della webform
    // ma solo se e' gia' arrivato
    var d = RD3_DesktopManager.ObjectMap[this.SubFrame];
    if (d!=undefined)
    {
      this.SubFrame = d;
      this.SubFrame.ParentFrameIdentifier = this.Identifier;
    }
    //
    // Sono a runtime (Realized && !Realizing) ed e' cambiato il subframe (value != undefined), in questo caso oltre che puntare
    // al nuovo subframe lo devo anche far creare, perche' altrimenti non lo fa nessuno
    if (value != undefined && this.Realized && !this.Realizing && this.SubFrame && !this.SubFrame.Realized && this.SubFrame.Identifier != undefined) 
    {
      var obj = (this.FormCaptionBox ? this.FormCaptionBox : this.ListCaptionBox);
      if (obj) {
        obj.innerHTML = "";
        this.UpdateSubFrameVisibility();
      }
    }
  }
}

PField.prototype.SetUnbound = function(value) 
{
  if (value!=undefined)
    this.Unbound = value;
  // Questa proprieta' non puo' essere cambiata dopo l'inizializzazione
}

PField.prototype.SetComboMultiSel = function(value) 
{
  if (value!=undefined)
    this.ComboMultiSel = value;
}

PField.prototype.SetComboValueSep = function(value)
  {
  if (value!=undefined)
    this.ComboValueSep = value;
}

PField.prototype.SetBackColor = function(value)
{
  var old = this.BackColor;
  if (value!=undefined)
    this.BackColor = value;
  //
  if (old != this.BackColor && this.Realized)
  {
    if (this.IsStatic())
      this.UpdateVisualStyle(this.VisualStyle);
    else
      this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetForeColor = function(value)
{
  var old = this.ForeColor;
  if (value!=undefined)
    this.ForeColor = value;
  //
  if (old != this.ForeColor && this.Realized)
  {
    if (this.IsStatic())
      this.UpdateVisualStyle(this.VisualStyle);
    else
      this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetFontMod = function(value)
{
  var old = this.FontMod;
  if (value!=undefined)
    this.FontMod = value;
  //
  if (old != this.FontMod && this.Realized)
  {
    if (this.IsStatic())
      this.UpdateVisualStyle(this.VisualStyle);
    else
      this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetMask = function(value)
{
  if (value!=undefined)
    this.Mask = value;
}

PField.prototype.SetAlignment = function(value)
{
  var old = this.Alignment;
  if (value!=undefined)
    this.Alignment = value;
  //
  if (old != this.Alignment && this.Realized)
  {
    this.UpdateVisualStyle(this.VisualStyle);
    //
    if (!this.IsStatic())
      this.ParentPanel.ResetPosition = true;
  }
}

PField.prototype.SetUseTextSel = function(value) 
{
  if (value!=undefined)
    this.UseTextSel = value;
}

PField.prototype.SetWaterMark = function(value) 
{
  var old = this.WaterMark;
  if (value!=undefined)
    this.WaterMark = value;
  //
  if (((old != this.WaterMark) || value==undefined) && this.ParentPanel.Realized)
    this.ParentPanel.ResetPosition = true;
}

PField.prototype.SetClassName = function(value) 
{
  var oldC = this.ClassName;
  var oldH = this.ClassHeader;
  //
  if (value!=undefined)
  {
    var clsCell = "";
    var clsHead = "";
    var cs = value.split(",");
    //
    if (cs.length == 1)
    {
      clsHead = cs[0];
      clsCell = cs[0];
    }
    else if (cs.length > 1) 
    {
      clsHead = cs[0];
      clsCell = cs[1];
    }
    //
    this.ClassName = clsCell;
    this.ClassHeader = clsHead;
  }
  //
  // Se e' cambiato lo stile delle celle o ancora non applicato allora lo devo applicare
  if (((oldC != this.ClassName) || value==undefined) && this.ParentPanel.Realized)
    this.ParentPanel.ResetPosition = true;
  //
  // Se e' cambiato lo stile dell'header o ancora non applicato allora lo devo applicare
  if (((oldH != this.ClassHeader) || value==undefined) && this.Realized)
  {
    if (this.FormCaptionBox) 
    {
      // Rimuovo la classe precedente
      if (oldH != "")
        RD3_Glb.RemoveClass2(this.FormCaptionBox, oldH);
      //
      // Applico la nuova classe
      if (this.ClassHeader && this.ClassHeader != "")
        RD3_Glb.AddClass(this.FormCaptionBox, this.ClassHeader);
    }
    //
    if (this.ListCaptionBox) 
    {
      // Rimuovo la classe precedente
      if (oldH != "")
        RD3_Glb.RemoveClass2(this.ListCaptionBox, oldH);
      //
      // Applico la nuova classe
      if (this.ClassHeader && this.ClassHeader != "")
        RD3_Glb.AddClass(this.ListCaptionBox, this.ClassHeader);
    }
  }
}

PField.prototype.SetAggregateOfField = function(value)
{
  this.AggregateOfField = value;
}

PField.prototype.SetPosDimPerc = function(value)
{
  this.PosDimPerc = [];
  var vs = value.split(",");
  for (var i=0; i<vs.length; i++)
  {
    if (vs[i] == "-1")
      this.PosDimPerc.push(-1);
    else
      this.PosDimPerc.push(parseFloat(vs[i])/10);
  }
}

PField.prototype.SetQBEFilter = function(value)
{
  if (value != undefined)
    this.QBEFilter = value;
  //
  if (this.Realized && this.QBEEnabled) {
    if (this.FilterCommand) 
    {
      RD3_Glb.SetClass(this.FilterCommand, "filter_no", !this.QBEFilter);
      RD3_Glb.SetClass(this.FilterCommand, "filter_yes", this.QBEFilter);
      if (this.ParentPanel.HasListVisibilityControl)
        this.FilterCommand.src = RD3_Glb.GetImgSrc("images/ellipsisis-v.png");
      else
        this.FilterCommand.src = RD3_Glb.GetImgSrc(this.QBEFilter ? "images/filter.png" : "images/filter_no.png");
    }
    //
    if (this.PQBEValue && this.PQBECell) {
      this.PQBEValue.Text = this.QBEFilter;
      //
      // Nel caso check lo stato 'indeterminato' e' quello vuoto : significa infatti tutti i valori
      if (this.VisualStyle.GetContrType() == 4 && !this.QBEFilter)
        this.PQBEValue.Text = "---";
      //
      if (this.LKE) 
      {
        // Quando il server manda un valore nel caso Combo LKE svuoto la lista, altrimenti si apre la combo
        if (this.PQBEValue.ValueList)
          delete this.PQBEValue.ValueList;
        //
        if (value && value instanceof Array) 
        {
          // In questo caso e' la multiselezione fatta dal PopupFilter, pero' nella combo devo sriverci i valori a video
          var filter = "";
          var sep = (this.PQBECell.IntCtrl.ShowValue ? this.PQBECell.IntCtrl.ValueSep : RD3_ClientParams.ComboNameSeparator);
          var n = value.length;
          for (var j = 0; j < n; j++)
            filter += (filter.length > 0 ? sep : "") + value[j].name;
          this.PQBEValue.Text = filter;
        }
        else if (value && value.indexOf("fld:") >= 0) 
        {
          // Sono LKE, mi e' arrivato un QBEFilter (solitamente non arrivano) e il testo contiene "fld:" allora il server mi ha mandato indietro
          // un filtro impostato su un altro campo della smartlookup.
          // Devo mostrare a video un valore sensato.
          // il formato e' questo:
          //
          // fld:.....#valore1@#@fld:.....#valore2
          //
          // In questo caso l'unica cosa che posso fare e' usare il valore, sperando che sia umano (non docID)
          var qbeFilters = value.split("@#@");
          var simpleString = "";
          for (var i = 0; i < qbeFilters.length; i++)
            simpleString += (simpleString.length > 0 ? this.ComboValueSep : "") + qbeFilters[i].substring(qbeFilters[i].indexOf("#") + 1);
          this.PQBEValue.Text = simpleString;
        }
      }
      //
      this.PQBECell.Update(this.PQBEValue, this.ParentPanel.IsFluidPanel() ? this.ParentPanel.ListQBEFluidRow.childNodes[this.RowChildIndex] : this.ListBox);
    }
  }
}

PField.prototype.SetIsPK = function(value) 
{
  if (value!=undefined)
    this.IsPK = value;
}

PField.prototype.SetDBCode = function(value) 
{
  if (value!=undefined)
    this.DBCode = value;
}

PField.prototype.SetBadge = function(value) 
{
  if (value!=undefined)
    this.Badge = value;
  //
  if (this.Realized && this.IsStatic())
  {
    if (this.Badge == "")
    {
      if (this.BadgeObjForm && this.BadgeObjForm.parentNode)
        this.BadgeObjForm.parentNode.removeChild(this.BadgeObjForm);
      if (this.BadgeObjList && this.BadgeObjList.parentNode)
        this.BadgeObjList.parentNode.removeChild(this.BadgeObjList);
      //
      this.BadgeObjForm = null;
      this.BadgeObjList = null;
    }
    else
    {
      if (this.BadgeObjForm == null && this.InForm && this.ParentPanel.HasForm)
      {
        this.BadgeObjForm = document.createElement("div");
        this.BadgeObjForm.className = "badge-red";
        this.BadgeObjForm.style.position = "absolute";
        //
        this.ParentPanel.FormBox.appendChild(this.BadgeObjForm);
      }
      //
      if (this.BadgeObjList == null && this.InList && this.ParentPanel.HasList)
      {
        this.BadgeObjList = document.createElement("div");
        this.BadgeObjList.className = "badge-red";
        this.BadgeObjList.style.position = "absolute";
        //
        this.ParentPanel.ListBox.appendChild(this.BadgeObjList);
      }
      //
      if (this.BadgeObjForm)
        this.BadgeObjForm.innerHTML = this.Badge;
      if (this.BadgeObjList)
        this.BadgeObjList.innerHTML = this.Badge;
      //
      this.SetListPosition();
      this.SetFormPosition();
    }
  }
}

PField.prototype.SetShowEditorTool = function(value) 
{
  if (value!=undefined)
    this.ShowEditorTool = value;
  //
  if (this.Realized)
    this.SetActualPosition(this.ParentPanel.ActualPosition);
}

PField.prototype.SetEditorCommands = function(value) 
{
  if (value!=undefined)
    this.EdToolCommands = value;
  //
  if (this.Realized)
    this.SetActualPosition(this.ParentPanel.ActualPosition);
}

PField.prototype.SetDefaultFormatting = function(value) 
{
  if (value!=undefined)
    this.DefaultFormatting = value;
  //
  // Lo devo passare alle celle
  if (this.Realized)
    this.SetActualPosition(this.ParentPanel.ActualPosition);
}


// ***************************************************************
// CALCOLO LAYOUT
// Crea gli oggetti DOM per la lista
// ***************************************************************
PField.prototype.SetNumRows= function(value) 
{
  var ie = RD3_Glb.IsIE();
  //
  // Questa funzione viene chiamata dal pannello per realizzare gli oggetti
  // Valore per la lista
  if (this.ParentPanel.HasList && !this.IsStatic() && (this.InList || this.ListList))
  {
    // Se il campo non e' parte della lista, allora
    // creo solo una box
    if (!this.ListList)
      value = 1;
    //
    // Se non ho ancora creato l'array delle celle lo faccio ora
    if (this.PListCells == null)
      this.PListCells = new Array();
    //
    // Ora gestisco la dimensione dell'array. Se e' troppo grande... elimino le celle in piu'
    if (this.PListCells.length>value)
    {
      // Unrealizzo le celle che moriranno
      for (var i = value; i<this.PListCells.length; i++)
      {
        if (this.PListCells[i])
          this.PListCells[i].Unrealize();
      }
    }
    //
    // Se e' troppo piccolo lo faccio crescere
    // Opero solo se non sono dentro alla lista oppure, se sono dentro alla lista, se 
    // la mia creazione non e' stata ritardata
    if (this.PListCells.length<value && (!this.ListList || !this.DelayedUpdate))
    {
      var act = this.ParentPanel.ActualPosition;
      //
      // Creo le celle necessarie a riempire il pannello
      for (var i = this.PListCells.length; i<value; i++)
      {
        // Creo la nuova cella
        var pcell = new PCell(this, true);
        this.PListCells[i] = pcell;
        //
        // La inizializzo fornendole il valore (a cui si attacca) e il container degli oggetti DOM
        if (this.ListList)
        {
          if (this.ParentPanel.IsFluidPanel()) {
            pcell.Update(this.PValues[i + act], this.ParentPanel.Rows[i + act - 1].childNodes[this.RowChildIndex]);
          }
          else 
          {
            // Se il pannello in lista non e' gruppato allora l'indice e' buono
            if (!this.ParentPanel.IsGrouped())
            {
              pcell.Update(this.PValues[i+act], this.ListBox);
            }
            else
            {
              var idx = this.ParentPanel.GetRowIndex(i, RD3_Glb.PANEL_LIST);
              //
              pcell.Update(this.PValues[idx], this.ListBox);
            }
          }
        }
        else
        {
          // Se sono fuori lista devo comunque prendere il PValue dalla posizione corretta
          if (!this.ParentPanel.IsGrouped())
          {
            pcell.Update(this.PValues[i+act], this.ParentPanel.ListBox);
          }
          else
          {
            var idx = this.ParentPanel.GetRowIndex(i, RD3_Glb.PANEL_LIST);
            //
            pcell.Update(this.PValues[idx], this.ParentPanel.ListBox);
          }
        }
      }
    }    
    this.PListCells.length = value;
    //
    if (RD3_ServerParams.ShowFieldImageInValue && !this.Realizing)
    {
      this.SetImage();
    }
  }
}

// ***************************************************************
// CALCOLO LAYOUT
// Posiziona gli oggetti DOM per la form
// ***************************************************************
PField.prototype.SetFormPosition= function() 
{
  if (this.Realizing)
    return;
  //
  // Se campo non e' presente a video, esco
  if (!this.ParentPanel.HasForm || !this.InForm)
    return;
  //
  // Caso statico in form
  if (this.IsStatic())
  {
    // Mi preoccupo solo della caption
    var rc = new Rect(this.FormLeft, this.FormTop, this.FormWidth, this.FormHeight);
    this.VisualStyle.AdaptCaptionRect(rc, false, false, true, (this.SubFrame || this.MultiUpload || this.IsButton()));
    //
    // In caso di bottoni su iPhone, devi stringere le dimensioni
    if (RD3_Glb.IsTouch() && this.IsButton())
    {
      rc.w--;
      rc.h--;
    }
    //
    RD3_Glb.SetDisplay(this.FormCaptionBox, (this.IsVisible() ? "" : "none"));
    //
    this.FormCaptionBox.style.left = rc.x + "px";
    this.FormCaptionBox.style.top = rc.y + "px";
    this.FormCaptionBox.style.width = rc.w + "px";
    this.FormCaptionBox.style.height = rc.h + "px";    
    //
    this.FormCaptionBox.style.paddingLeft = rc.pxl + "px";
    this.FormCaptionBox.style.paddingRight = rc.pxr + "px";
    this.FormCaptionBox.style.paddingTop = rc.pyt + "px";
    this.FormCaptionBox.style.paddingBottom = rc.pyb + "px";
    //
    if (this.BadgeObjForm)
    {
      this.BadgeObjForm.style.top = (rc.y-12>0 ? rc.y-12 : 0) + "px";
      this.BadgeObjForm.style.left = (rc.x + rc.w - RD3_Glb.GetBadgeWidth(this.Badge, "red") + 12)+"px";
    }
    //
    return;
  }
  //
  // calcolo i due rettangoli
  var d = (this.HdrForm)? this.FormHeaderSize+4 : 0; // Delta per presenza header
  var rv = null;
  var rc = null;
  //
  if (this.HdrFormAbove)
  {
    rc = new Rect(this.FormLeft, this.FormTop,   this.FormWidth, this.FormHeaderSize);
    rv = new Rect(this.FormLeft, this.FormTop+d, this.FormWidth, this.FormHeight-d  );
  }
  else
  {
    rc = new Rect(this.FormLeft,   this.FormTop, this.FormHeaderSize, this.FormHeight);
    rv = new Rect(this.FormLeft+d, this.FormTop, this.FormWidth-d,    this.FormHeight);
  }
  //
  // Gestisco posizionamento header
  if (this.HdrForm)
  {
    this.VisualStyle.AdaptCaptionRect(rc, false, this.HdrFormAbove);
    //
    RD3_Glb.SetDisplay(this.FormCaptionBox, (this.IsVisible() ? "" : "none"));
    //
    this.FormCaptionBox.style.left = rc.x + "px";
    this.FormCaptionBox.style.top = rc.y + "px";
    this.FormCaptionBox.style.width = rc.w + "px";
    this.FormCaptionBox.style.height = rc.h + "px";
    //
    // Se ZEN e non ci sono i bordi standard
    if (RD3_ServerParams.Theme.startsWith("zen") && rc.pyt == 3)
      rc.pyt = 8;
    //
    this.FormCaptionBox.style.paddingLeft = rc.pxl + "px";
    this.FormCaptionBox.style.paddingRight = rc.pxr + "px";
    this.FormCaptionBox.style.paddingTop = rc.pyt + "px";
    this.FormCaptionBox.style.paddingBottom = rc.pyb + "px";
  }
  else
  {
    RD3_Glb.SetDisplay(this.FormCaptionBox, "none");
  }  
  //
  // Gestisco posizionamento valore
  this.VisualStyle.AdaptRect(rv, 1, false);
  this.PFormCell.UpdateDims(rv.x, rv.y);
  //
  // Ho modificato la dimensione di un campo... dovro' ricalcolare il layout del pannello
  this.ParentPanel.RecalcLayout = true;
}


// ***************************************************************
// CALCOLO LAYOUT
// Posiziona gli oggetti DOM per la list
// Campo fuori lista!
// ***************************************************************
PField.prototype.SetListPosition= function() 
{
  if (this.Realizing)
    return;
  //  
  // Se campo non e' presente a video, esco
  if (!this.ParentPanel.HasList || !this.InList)
    return;
  //
  // Se e' un campo in lista... programmo solo l'aggiornamento del layout del pannello
  if (this.ListList)
  {
    this.ParentPanel.RecalcLayout = true;
    return;
  }
  //
  var left = this.ListLeft+this.ParentPanel.RowSelWidth();
  //
  // Caso statico in list
  if (this.IsStatic())
  {
    // Mi preoccupo solo della caption
    // 2px padding standard
    var rc = new Rect(left, this.ListTop, this.ListWidth, this.ListHeight);
    this.VisualStyle.AdaptCaptionRect(rc, false, false, true, (this.SubFrame || this.MultiUpload || this.IsButton()));
    //
    // In caso di bottoni su iPhone, devi stringere le dimensioni
    if (RD3_Glb.IsTouch() && this.IsButton())
    {
      rc.w--;
      rc.h--;
    }
    //
    // Per i campi aggregati il list Top contiene il valore del List Top del pannello (serve per far funzionare bene il resize)
    // ma siccome in realta' il campo e' dentro il ListListContainer quando lo posizioniamo in maniera assoluta non lo dobbiamo considerare
    // (serve solo nei casi in cui l'utente ha abbassato la lista)
    if (this.AggregateOfField >= 0)
      rc.y -= this.ParentPanel.ListTop;
    //
    RD3_Glb.SetDisplay(this.ListCaptionBox, (this.IsVisible() ? "" : "none"));
    //
    this.ListCaptionBox.style.left = rc.x + "px";
    this.ListCaptionBox.style.top = rc.y + "px";
    this.ListCaptionBox.style.width = rc.w + "px";
    this.ListCaptionBox.style.height = rc.h + "px";
    //
    this.ListCaptionBox.style.paddingLeft = rc.pxl + "px";
    this.ListCaptionBox.style.paddingRight = rc.pxr + "px";
    this.ListCaptionBox.style.paddingTop = rc.pyt + "px";
    this.ListCaptionBox.style.paddingBottom = rc.pyb + "px";
    //
    if (this.BadgeObjList)
    {
      this.BadgeObjList.style.top = (rc.y-12>0 ? rc.y-12 : 0) + "px";
      this.BadgeObjList.style.left = (rc.x + rc.w - RD3_Glb.GetBadgeWidth(this.Badge, "red") + 12)+"px";
    }
    //
    return;
  }
  //
  // calcolo i due rettangoli
  var d = (this.HdrList)? this.ListHeaderSize+4 : 0; // Delta per presenza header
  var rv = null;
  var rc = null;
  //
  if (this.HdrListAbove)
  {
    rc = new Rect(left, this.ListTop,   this.ListWidth, this.ListHeaderSize);
    rv = new Rect(left, this.ListTop+d, this.ListWidth, this.ListHeight-d  );
  }
  else
  {
    rc = new Rect(left,   this.ListTop, this.ListHeaderSize, this.ListHeight);
    rv = new Rect(left+d, this.ListTop, this.ListWidth-d,    this.ListHeight);
  }
  //
  // Gestisco posizionamento header
  if (this.HdrList)
  {
    this.VisualStyle.AdaptCaptionRect(rc, false, this.HdrListAbove);
    //
    RD3_Glb.SetDisplay(this.ListCaptionBox, (this.IsVisible() ? "" : "none"));
    //
    this.ListCaptionBox.style.left = rc.x + "px";
    this.ListCaptionBox.style.top = rc.y + "px";
    this.ListCaptionBox.style.width = rc.w + "px";
    this.ListCaptionBox.style.height = rc.h + "px";
    //
    this.ListCaptionBox.style.paddingLeft = rc.pxl + "px";
    this.ListCaptionBox.style.paddingRight = rc.pxr + "px";
    this.ListCaptionBox.style.paddingTop = rc.pyt + "px";
    this.ListCaptionBox.style.paddingBottom = rc.pyb + "px";
  }
  else
  {
    RD3_Glb.SetDisplay(this.ListCaptionBox, "none");
  }  
  //
  // Gestisco posizionamento div che contiene i valori
  this.VisualStyle.AdaptRect(rv, 1, false);
  this.PListCells[0].UpdateDims(rv.x, rv.y);
  //
  // Ho modificato la dimensione di un campo... dovro' ricalcolare il layout del pannello
  this.ParentPanel.RecalcLayout = true;
}


// ***************************************************************
// CALCOLO LAYOUT
// Posiziona gli oggetti DOM per la list
// Campo in lista!
// ***************************************************************
PField.prototype.SetListListPosition= function(left, top, par) 
{
  if (this.Realizing)
    return;
  //  
  // Solo se campo presente a video
  var pp = this.ParentPanel;
  if (pp.HasList && this.InList && this.ListList && this.Realized)
  {
    // Cambio parent se richiesto
    if (this.ListCaptionBox.parentNode!=par)
    {
      this.ListCaptionBox.parentNode.removeChild(this.ListCaptionBox);
      par.appendChild(this.ListCaptionBox);
    }
    //
    var lt = top;
    var lh = pp.HeaderSize;
    if (this.Group)
    {
      lt+=this.Group.ListHeight;
      lh-=this.Group.ListHeight;
    }
    //
    var panbrd = pp.VisStyle.GetBorders(1);
    var fldbrd = this.VisualStyle.GetBorders(1);
    var intbrd = this.VisualStyle.GetBorders(2);
    //
    // Posiziono la caption
    var rc = new Rect(left, lt, this.ListWidth, lh);
    this.VisualStyle.AdaptCaptionRect(rc, true, true);
    //
    // Se il pannello ha il bordo verticale e l'intestazione no, la sposto
    if ((panbrd == 4 || panbrd == 3) && intbrd != 4 && intbrd != 3) 
    {
      rc.x++;
      rc.w--;
      if (rc.x + rc.w == pp.ListWidth - 4)
        rc.w--;
    }
    //
    // Se il pannello ha il bordo orizzontale e l'intestazione no, la sposto
    if ((panbrd == 4 || panbrd == 2) && intbrd != 4 && intbrd != 2) 
    {
      rc.y++;
      rc.h--;
    }
    //
    var s = this.ListCaptionBox.style;
    if (RD3_ServerParams.Theme.startsWith("zen") && this.InList && this.ListList) 
    {
      rc.y -= 1;
      rc.h += 2;
      rc.w += 2;
    }
    if (this.CanUseListQBE()) 
    {
      if (!RD3_ServerParams.Theme.startsWith("zen"))
      {
        rc.w -= 15;
        if (rc.w < 0)
          rc.w = 5;
        rc.pxr += 15;
      }
    }
    //
    s.left = rc.x + "px";
    s.top = rc.y + "px";
    s.width = rc.w + "px";
    s.height = rc.h + "px";
    //
    s.paddingLeft = rc.pxl + "px";
    s.paddingRight = rc.pxr + "px";
    s.paddingTop = rc.pyt + "px";
    s.paddingBottom = rc.pyb + "px";
    //
    // Verifico se ho un bordo... se non ce l'ho ne tengo conto
    // altrimenti il mio "non bordo" potrebbe coprire il bordo del pannello (qualora ce l'abbia)
    var ofsx = ofsy = 0;
    //
    // Se il campo ha il bordo (oriz) e il pannello no devo spostare in giu
    if ((fldbrd == 4 || fldbrd == 2) && panbrd != 4 && panbrd != 2) 
      ofsy = 1;
    //
    // Se il campo non ha il bordo (vert) e il pannello si' devo spostare a dx
    if ((panbrd == 4 || panbrd == 3) && fldbrd != 4 && fldbrd != 3) 
    { 
      if (left==-1)
        ofsx=1;
    }
    //
    // Posiziono il DIV che contiene tutte le mie celle
    s = this.ListBox.style;
    s.left = (left + ofsx) + "px";
    //
    // Il -1 serve per tenere conto correttamente dell'offset fra le righe (NPQ00069)
    s.top = (this.ListTop - pp.ListTop + ofsy - 1) + "px";
    s.width = (this.ListWidth + 1 - 2*ofsx) + "px";
    var newh = pp.ListHeightRounded + 1 - 2*ofsy;
    if (pp.HeaderSize>0)
      newh -= pp.HeaderSize+pp.VisStyle.GetHeaderOffset();
    //
    if (RD3_Glb.IsQuadro() || RD3_Glb.IsMobile7() || RD3_Glb.IsMobile())
      newh++;
    //
    if (newh<0) newh=0;
    s.height = newh + "px";
    //
    // Ora penso alle celle se il mio aggiornamento non e' stato ritardato
    if (!this.DelayedUpdate)
    {
      var rh = pp.GetRowHeight();
      var ry = 0 + pp.GetHeaderSearchOffset();
      //
      if (this.CanUseRowQBE())
        this.PQBECell.UpdateDims(0, 0);
      //
      var n = this.PListCells.length;
      for (var i=0; i<n; i++)
      {
        this.PListCells[i].UpdateDims(0, ry);
        //
        // Prossima riga
        ry += rh;
      }
    }
    //
    // Cambio parent se richiesto
    if (this.ListBox.parentNode!=par)
    {
      this.ListBox.parentNode.removeChild(this.ListBox);
      par.appendChild(this.ListBox);
    }
    //
    // Mi memorizzo la mia posizione
    this.PGroupListLeft = left;
    //
    // Allineo anche i campi con valori aggregati
    var n = pp.Fields.length;
    for (var i = 0; i < n; i++)
    {
      var f = pp.Fields[i];
      if (f.AggregateOfField != this.Index)
        continue;
      //
      // Cambio parent se richiesto
      if (f.ListCaptionBox.parentNode != par)
        par.appendChild(f.ListCaptionBox);
      //
      f.SetListLeft(parseInt(s.left) - pp.RowSelWidth());
      f.SetListWidth(parseInt(s.width));
    }
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
PField.prototype.Realize = function(parent)
{
  this.Realizing = true;
  var parentContext = this;
  //
  // NOTA: parent qui e' undefined perche' il campo si deve
  //       realizzare sia nel layout form (FORMBOX) che lista (LISTBOX)
  //       viene quindi usato il riferimento al padre per recuperarli
  //
  // Creo gli oggetti per la form se presente
  if (this.ParentPanel.HasForm && this.InForm)
  {
    if (this.IsButton())
    {
      this.FormCaptionBox = document.createElement("input");
      this.FormCaptionBox.type = "button";
      this.FormCaptionBox.className = "panel-value-button";
      if (RD3_Glb.IsMobile() && this.VisShowActivator())
        RD3_Glb.AddClass(this.FormCaptionBox, "with-detail");
    }
    else
    {
      this.FormCaptionBox = document.createElement("div");
      if (this.IsStatic())
        this.FormCaptionBox.className = "panel-field-static";
      else
        this.FormCaptionBox.className = "panel-field-caption-form";
    }
    this.FormCaptionBox.setAttribute("id", this.Identifier+":fc");
    this.FormCaptionBox.style.zIndex = this.Index;
    //
    this.ParentPanel.FormBox.appendChild(this.FormCaptionBox);
    //
    if (!this.IsStatic())
    {
      this.PFormCell = new PCell(this, false);
      this.PFormCell.Update(this.PValues[0], this.ParentPanel.FormBox);
    }
  }
  //
  // Creo gli oggetti per la list se presente
  if (this.ParentPanel.HasList && this.InList)
  {
    if (this.IsButton())
    {
      this.ListCaptionBox = document.createElement("input");
      this.ListCaptionBox.type = "button";
      this.ListCaptionBox.className = "panel-value-button";
      if (RD3_Glb.IsMobile() && this.VisShowActivator())
        RD3_Glb.AddClass(this.ListCaptionBox, "with-detail");
    }
    else
    {
      this.ListCaptionBox = document.createElement("div");
      if (this.IsStatic())
        this.ListCaptionBox.className = "panel-field-static";
      else
        this.ListCaptionBox.className = this.ListList?"panel-field-caption-list":"panel-field-caption-form";
    }
    this.ListCaptionBox.setAttribute("id", this.Identifier+":lc");
    //
    if (!this.IsStatic() && this.ListList)
    {
      if (!RD3_Glb.IsMobile())
        this.ListCaptionBox.onclick = function(ev) { parentContext.OnClickCaption(ev); };
      this.ListCaptionBox.style.cursor = "pointer";
      //
      if (this.CanUseListQBE() || this.ParentPanel.HasListVisibilityControl)
      {
        // Abilito gli oggetti per la modalita' di ricerca QBE avanzata
        var imageSrc = this.ParentPanel.HasListVisibilityControl ? "images/ellipsisis-v.png" : "images/filter_no.png";
        this.FilterCommand = document.createElement("img");
        this.FilterCommand.className = "panel-filter-image filter_no";
        if (this.ParentPanel.HasListVisibilityControl)
          this.FilterCommand.className += " filter_more";
        this.FilterCommand.src = RD3_Glb.GetImgSrc(imageSrc);
        this.ListCaptionBox.appendChild(this.FilterCommand);
      }
      //
      // Creo il contenitore delle celle
      if (!this.ParentPanel.IsFluidPanel())
      {
        this.ListBox = document.createElement("div");
        this.ListBox.className = "panel-field-list-box";
        this.ListBox.setAttribute("id", this.Identifier+":lb");
      }
      //
      // Controllo se sono visibile... se non lo sono, ritardo la mia creazione
      if (this.IsHidden() && !this.ParentPanel.IsFluidPanel())
      {
        this.DelayedUpdate = true;
        this.ParentPanel.DelayedListUpdate = true;
      }
      //
      if (this.CanUseRowQBE()) 
      {
        this.PQBEValue = new PValue(this);
        this.PQBEValue.ListQBEValue = true;
        this.PQBEValue.Identifier = this.Identifier+":qbeval";
        RD3_DesktopManager.ObjectMap.add(this.PQBEValue.Identifier, this.PQBEValue);
        //
        // Nel caso check inizio dallo stato 'indeterminato' : significa 'tutti i valori' che e' esattamente quello che vedo senza filtri impostati
        if (this.VisualStyle.GetContrType() == 4)
          this.PQBEValue.Text = "---";
        //
        this.PQBECell = new PCell(this, true);
        this.PQBECell.ListQBECell = true;
        this.PQBECell.Update(this.PQBEValue, this.ParentPanel.IsFluidPanel() ? this.ParentPanel.ListQBEFluidRow.childNodes[this.RowChildIndex] : this.ListBox);
        //
        var isCombo = this.LKE || this.ValueList || (this.PValues.length >= 1 && this.PValues[this.ParentPanel.ActualPosition] && this.PValues[this.ParentPanel.ActualPosition].ValueList);
        if (isCombo && !this.ValueList && !this.LKE) {
          // Chiedo la Lista completa al server (non LKE, in quel caso ci pensa la combo)
          var ev = new IDEvent("qbecombo", this.Identifier, null, RD3_Glb.EVENT_URGENT, this.Identifier, "");
        }
      }
    }
    if (this.ListList)
    {
      if (!this.ParentPanel.IsFluidPanel())
      {
        this.ParentPanel.ListListBox.appendChild(this.ListCaptionBox);
        this.ParentPanel.ListListBox.appendChild(this.ListBox);
      }
      else 
      {
        this.ParentPanel.ListFluidHeader.childNodes[this.RowChildIndex].appendChild(this.ListCaptionBox);
      }
    }
    else
    {
      this.ListCaptionBox.style.zIndex = this.Index;
      this.ParentPanel.ListBox.appendChild(this.ListCaptionBox);
    }
    //
    // I valori per la lista vengono creati dalla funzione SetNumRows, se il campo e' parte della lista
  }
  //
  if (this.IsStatic())
  {
     if (this.MultiUpload)
      this.RenderMultiUpload();
    else
    {
      // Su Quadro e Mobile ci pensa IDScroll (equivalente a IsSeattle || IsCasual || IsSimplicity ..)
      if (this.ListCaptionBox && !RD3_Glb.IsMobile())
        this.ListCaptionBox.onclick = function(ev) { parentContext.OnClickCaption(ev); };
      if (this.FormCaptionBox && !RD3_Glb.IsMobile())
        this.FormCaptionBox.onclick = function(ev) { parentContext.OnClickCaption(ev); };
    }
  }
  //
  // Funzione per terminare le animazioni su questo campo
  this.ea = function(ev) { parentContext.OnEndAnimation(ev); };
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  //
  // Prelevo subito questi oggetti se presenti
  this.SetSubFrame();
  this.SetPage();
  this.SetGroup(this.Group); 
  //
  if (!(this.ParentPanel.IsFluidPanel() && this.ListList))
    this.SetNumRows(1); // Almeno una riga ci deve essere
  this.SetIndex();
  this.SetVisible();
  this.SetEnabled();
  this.SetVisualStyle();
  this.SetListList();
  this.SetCanActivate();
  this.SetOptional();
  this.SetImage();
  this.SetHeader();
  this.SetTooltip();
  this.SetDataType();
  this.SetMaxLength();
  this.SetInList();
  this.SetListHeader();
  this.SetHdrList();
  this.SetHdrListAbove();
  this.SetListLeft();
  this.SetListTop();
  this.SetListWidth();
  this.SetListHeight();
  this.SetListNumRows();
  this.SetListHResMode();
  this.SetListVResMode();
  this.SetInForm();
  this.SetFormHeader();
  this.SetHdrForm();
  this.SetHdrFormAbove();
  this.SetFormLeft();
  this.SetFormTop();
  this.SetFormWidth();
  this.SetFormHeight();
  this.SetFormNumRows();
  this.SetFormHResMode();
  this.SetFormVResMode();
  this.SetSortMode();
  this.SetImageResizeMode();
  this.SetBadge();
  this.SetClassName();
  this.SetQBEFilter();
  this.SetVisualFlags();
  //
  this.Realizing = false;
  //
  // Finisco alcune impostazioni perse prima
  this.SetFormPosition();
  this.SetListPosition();
}


// **********************************************************************
// Imposta il valore dei campi a video in base a PValues
// Passando R1 e R2, si impostano solo due righe invece che tutte
// **********************************************************************
PField.prototype.SetActualPosition = function(act, r1, r2)
{
  var pm = this.ParentPanel.PanelMode;
  //
  // I campi statici non devono vedere i dati
  if (this.IsStatic())
    return;
  //
  // Aggiorno solo la lista o la form...
  //  
  if (act==undefined)
    act = this.ParentPanel.ActualPosition;
  //
  var actr = this.ParentPanel.OldAttR;
  //
  // Lavoro per la lista
  if (this.InList && this.ParentPanel.HasList && this.PListCells && (pm==RD3_Glb.PANEL_LIST || pm==-1))
  {
    // Esprimo tutta la lista
    if (this.ListList)
    {
      // Se il mio aggiornamento non e' stato ancora ritardato
      if (!this.DelayedUpdate)
      {
        // Controllo se sono nascosto... Se lo sono ritardo l'aggiornamento
        // Spegniamo questo comportamento nel caso mobile per due motivi: innanzitutto nelle liste normali i campi devono essere tutti visibili
        // (altrimenti non potrei scrollare..) mentre solo nel caso di pannello paginato questa gestione entrerebbe in azione..
        // in quel caso se la form fosse Docked aperta in Popover il Tick che andrebbbe a renderizzare i campi non la troverebbe (non c'e' un puntatore)
        // ed il campo non verrebbe mai renderizzato (nemmeno tornando sulla pagina corretta)
        // Questa modifica potrebbe essere oggetto di un'ulteriore ottimizzazione futura.
        if (this.IsHidden() && !RD3_Glb.IsMobile() && !this.ParentPanel.IsFluidPanel())
        {
          this.DelayedUpdate = true;
          this.ParentPanel.DelayedListUpdate = true;
        }
        else
        {
          if (this.CanUseRowQBE())
            this.PQBECell.Update(this.PQBEValue, this.ParentPanel.IsFluidPanel() ? this.ParentPanel.ListQBEFluidRow.childNodes[this.RowChildIndex] : this.ListBox);
          //
          var n = this.ParentPanel.NumRows;
          for (var i=0; i<n; i++)
          {
            if (r1!=undefined && i!=r1 && i!=r2)
              continue;
            //
            var cell = this.PListCells[i];
            if (cell)
            {
              // Se il pannello in lista non e' gruppato allora l'indice e' buono
              if (this.ParentPanel.IsFluidPanel())
              {
                cell.Update(this.PValues[act + i], this.ParentPanel.Rows[act + i - 1].childNodes[this.RowChildIndex]);
              }
              else if (!this.ParentPanel.IsGrouped())
              {
                cell.Update(this.PValues[act+i], this.ListBox);
              }
              else
              {
                var idx = this.ParentPanel.GetRowIndex(i, RD3_Glb.PANEL_LIST, act);
                //
                cell.Update(this.PValues[idx], this.ListBox);
                //
                // Se sto selezionando/deselezionando l'header di un gruppo in lista per sicurezza faccio aggiornare anche la riga successiva.. 
                // infatti lato server la riga selezionata e' sempre la riga del gruppo.. anche lato client deve valere la stessa cosa, altrimenti
                // l'utente potrebbe non capire..
                if (r1!=undefined && cell && cell.ControlType==111 && i+1<n)
                {
                  cell = this.PListCells[i+1];
                  //
                  // Lo faccio solo se e' una cella reale.. se e' un'intestazione di gruppo non serve
                  if (cell.ControlType!=111)
                  {
                    idx = this.ParentPanel.GetRowIndex(i+1, RD3_Glb.PANEL_LIST, act);
                    cell.Update(this.PValues[idx], this.ListBox);
                  }
                }
              }
            }
          }
        }
      }
    }
    else
    {
      // Esprimo solo la riga corrente
      var v = this.PValues[act+this.ParentPanel.ActualRow];
      //
      // Se il pannello e' gruppato devo prendere comunque il Pval dalla posizione giusta
      if (this.ParentPanel.IsGrouped())
      {
        var idx = this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow, RD3_Glb.PANEL_LIST, act);
        v = this.PValues[idx];
      }
      //
      this.PListCells[0].Update(v, this.ParentPanel.ListBox);
      if (v && this.HdrList)
        {
          var vis = v.IsVisible();
          if (vis && this.ListCaptionBox.style.display=="none")
            RD3_Glb.SetDisplay(this.ListCaptionBox , "");
          if (!vis && this.ListCaptionBox.style.display=="")
            RD3_Glb.SetDisplay(this.ListCaptionBox, "none");
        }
      }
  }
  //
  if (this.InForm && this.ParentPanel.HasForm && this.PFormCell && (pm==RD3_Glb.PANEL_FORM || pm==-1))
  {
    var v = this.PValues[act];
    //
    // Se il pannello e' gruppato devo prendere comunque il PVal dalla posizione giusta
    if (this.ParentPanel.IsGrouped())
    {
      var idx = this.ParentPanel.GetRowIndex(0, RD3_Glb.PANEL_FORM, act);
      v = this.PValues[idx];
    }
    //
    this.PFormCell.Update(v, this.ParentPanel.FormBox);
    if (v && this.HdrForm)
      {
        var vis = v.IsVisible();
        if (vis && this.FormCaptionBox.style.display=="none")
          RD3_Glb.SetDisplay(this.FormCaptionBox, "");
        if (!vis && this.FormCaptionBox.style.display=="")
          RD3_Glb.SetDisplay(this.FormCaptionBox, "none");
      }
    }
  //
  // Dopo una setactualpos, devo ridarmi il fuoco se lo avevo, ma non se
  // il fuoco sta per essere dato a qualcun altro!
  if (RD3_KBManager.ActiveObject == this && RD3_KBManager.FocusFieldTimerId==0)
  {
    var cell = this.GetCurrentCell();
    if (cell)
      cell.SetActive();
    //
    // Se non e' attivo il FixActiveRow, fuoco il campo
    if (pm != RD3_Glb.PANEL_LIST || !this.ParentPanel.IsPanelFixActiveRowWhenScrolled())
    RD3_DesktopManager.HandleFocus2(this.Identifier, this.ParentPanel.ActualRow);
  }
}

// **********************************************************************
// Torna vero se tutti i valori sono gia' presenti per la riga richiesta
// **********************************************************************
PField.prototype.HasValues = function(act)
{
  var n = this.ParentPanel.NumRows;
  for (var i = act; i<act+n; i++)
  {
    if (this.PValues[i]==null || this.PValues[i]==undefined)
      return false;
  }
  //
  return true;
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
PField.prototype.AdaptLayout = function()
{ 
  // Se ho un subframe, passo la palla anche a lui
  if (this.SubFrame && this.SubFrame.Realized && this.IsVisible())
  {
    RD3_Glb.AdaptToParent(this.SubFrame.FrameBox, 0, 0);
    //
    // Modifico anche le dimensioni del frame, cosi' eventuali calcoli sulle percentuali possono 
    // venire calcolati correttamente
    this.SubFrame.SetWidth(this.SubFrame.FrameBox.offsetWidth);
    this.SubFrame.SetHeight(this.SubFrame.FrameBox.offsetHeight);
    //
    // Applico i resize saltati per questo layout se ce ne sono
    if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_FORM && this.FormResizeSkipped)
    {
      // Applico i resize saltati per il dettaglio
      if (this.FormDeltaW!=0 || this.FormDeltaH!=0)
      {
        this.SubFrame.DeltaW = this.FormDeltaW;
        this.SubFrame.DeltaH = this.FormDeltaH;
        this.SubFrame.SendResize = true;
      }
      //
      // Mi memorizzo che ho eseguito i resize saltati
      this.FormResizeSkipped = false;
      this.FormDeltaW = 0;
      this.FormDeltaH = 0;
    }
    if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.ListResizeSkipped)
    {
      // Applico i resize saltati per la lista
      if (this.ListDeltaW!=0 || this.ListDeltaH!=0)
      {
        this.SubFrame.DeltaW = this.ListDeltaW;
        this.SubFrame.DeltaH = this.ListDeltaH;
        this.SubFrame.SendResize = true;
      }
      //
      // Mi memorizzo che ho eseguito i resize saltati
      this.ListResizeSkipped = false;
      this.ListDeltaW = 0;
      this.ListDeltaH = 0;
    }
    //
    this.SubFrame.AdaptLayout();
  }
  //
  // Questa serve per riposizionare l'immagine di sort nella caption
  this.SetSortMode();
  //
  // Nel caso mobile e' interessante andare su due righe se l'intestazione non ci sta su una
  this.AdjustHeaderSize();
  //
  // Qualcosa potrebbe essere cambiato... meglio aggiornare la toolbar dei blob
  this.UpdateToolbar();
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
PField.prototype.Unrealize = function()
{ 
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Passo il messaggio ai valori
  var n = this.PValues.length;
  for (var i=0; i<n; i++)
  {
    if (this.PValues[i])
      this.PValues[i].Unrealize();
  }
  //
  // Passo il messaggio alle celle
  if (this.PListCells)
  {
    n = this.PListCells.length;
    for (var i=0; i<n; i++)
    {
      if (this.PListCells[i])
        this.PListCells[i].Unrealize();
    }
  }
  if (this.PFormCell)
    this.PFormCell.Unrealize();
  //
  // Controllo L'active element del KB, lo elimino se e' uno dei miei figli..
  if (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement.parentNode)
  {
    // Se l'active element esiste e l'id del suo parentnode contiene il mio identificatore allora elimino l'active element:
    // era uno dei miei valori..
    var aep = RD3_KBManager.ActiveElement.parentNode;
    //
    if (aep.id && aep.id.indexOf(this.Identifier,0) != -1)
      RD3_KBManager.ActiveElement = null;
  }
  //
  // Controllo l'active element del KB, lo elimino se e' uno dei miei figli..
  if (RD3_KBManager.ActiveElement)
  {
    // Se l'active element esiste e il suo id contiene il mio identificatore allora elimino l'active element:
    // era uno dei miei valori..
    var ae = RD3_KBManager.ActiveElement;
    //
    if (ae.id && ae.id.indexOf(this.Identifier) != -1)
      RD3_KBManager.ActiveElement = null;
  }
  //
  // Controllo l'ActiveObject del Kb: se sono io lo elimino
  if (RD3_KBManager.ActiveObject == this)
    RD3_KBManager.ActiveObject = null;
  //
  // Se ho un subframe, passo la palla anche a lui
  if (this.SubFrame)
  {
    // Il SubFrame e' gia' stato linkato
    if (this.SubFrame.Unrealize)
      this.SubFrame.Unrealize();
    else
    {
      // E' ancora l'ID del frame e non il subframe vero e proprio
      // Lo recupero dalla mappa e gli dico di unrealizzarsi
      this.SubFrame = RD3_DesktopManager.ObjectMap[this.SubFrame];
      if (this.SubFrame)
        this.SubFrame.Unrealize();
    }
  }
  //
  // Distruggo l'uploader
  if (this.MultiUpload)
  {
    // MultiUpload + HTML5
    if (this.FormFlashUploader && this.FormFlashUploader.parentNode)
      this.FormFlashUploader.parentNode.removeChild(this.FormFlashUploader);
    //
    this.ReqList = null;
    this.FileList = null;
    this.MUPHeader = null;
  }
  //
  if (RD3_DDManager.OpenListFormCell && RD3_DDManager.OpenListFormCell.ParentField == this) {
    var parentContainer = RD3_DDManager.OpenListFormCell.GetDOMObj().parentNode;
    RD3_DDManager.OpenListFormCell.Unrealize();
    delete RD3_DDManager.OpenListFormCell;
    if (parentContainer && parentContainer.parentNode)
      parentContainer.parentNode.removeChild(parentContainer);
  }
  //
  if (this.PQBEValue) 
  {
    this.PQBEValue.Unrealize();
    this.PQBEValue = null;
  }
  if (this.PQBECell)
    this.PQBECell = null;
}


// **********************************************************************
// Resetta la cache dei valori
// **********************************************************************
PField.prototype.ResetCache= function(node) 
{
  // Cancello i valori
  var from = parseInt(node.getAttribute("from"));
  var to = parseInt(node.getAttribute("to"));
  //
  if (!from)
  {
    // Devo togliere i valori dalla mappa chiamando la loro Unrealize
    for (var i = 0; i<=this.PValues.length; i++)
    {
      if (this.PValues[i])
       this.PValues[i].Unrealize();
    }
    //
    this.PValues = new Array();
  }
  else
  {
    for (var i = from; i<=to; i++)
    {
      // Tolgo il valore dalla Mappa
      if (this.PValues[i])
       this.PValues[i].Unrealize();
      this.PValues[i]=null;
    }
  }
}


// ********************************************************************************
// Gestore evento di click sulla caption della lista (sorting - campi statici)
// ********************************************************************************
PField.prototype.OnClickCaption= function(evento)
{ 
  if (window.event && evento==undefined)
    evento = window.event;
  //
  if (this.IsStatic())
  {
    // Voglio evitare un doppio click sugli oggetti
    if (RD3_Glb.IsAndroid() || (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch()))
      RD3_DDManager.ChompClick();
    //
    // Un campo statico e' cliccabile se e' abilitato oppure se e' attivo il flag ActivableDisabled e il suo visual style ha il flag cliccabile
    if ((this.IsEnabled() || this.ActivableDisabled) && !this.SubFrame && this.VisHyperLink(this.VisualStyle))
    {
      // Se e' collegato ad un comando, lo lancio adesso
      if (this.Command)
      {
        this.Command.OnClick(evento);
      }
      else
      {
        // Altrimenti lancio evento normale
        var ev = new IDEvent("clk", this.Identifier, evento, this.ClickEventDef, null, "cap");
      }
      //
      // Se sono Mobile mi memorizzo come oggetto che ha eseguito l'azione
      if (RD3_Glb.IsMobile())
      {
        var srcobj = (window.event)?evento.srcElement:evento.explicitOriginalTarget;
        RD3_KBManager.ActiveButton = srcobj;
      }
    }
  }
  else if (this.ListList && this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.ParentPanel.HasListVisibilityControl && !RD3_Glb.IsMobile()) 
  {
    this.ParentPanel.ListVisibilityCtrlToggleClicked(evento, this);
  }
  else if (this.ListList && this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.CanUseListQBE())
  {
    this.OnClickFilterQBE(evento);
  }
  else if (this.ParentPanel.CanSort && this.CanSort && this.VisCanSort() && this.ListList && !this.CanUseListQBE())
  {
    // Voglio evitare un doppio click sugli oggetti
    if (RD3_Glb.IsAndroid() || (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch()))
      RD3_DDManager.ChompClick();
    //
    var sendev = true;
    //
    // Su firefox il doppio click sull'area di resize fa partire anche il click.. percio'
    // qui devo verificare di non essere nell'area di resize per mandare il click al server
    if (RD3_Glb.IsFirefox())
    {
      var objpos = RD3_Glb.GetScreenLeft(this.ListCaptionBox) + this.ListCaptionBox.clientWidth;
      //
      // Verifico se sono nell'area di resize, se il pannello ha il resize delle colonne attivo e se il pannello e' in lista: in questo caso non mando il sort, perche' prima di me e' passato il doppio click
      if ((objpos-evento.clientX<=RD3_ClientParams.ResizeLimit) && this.ParentPanel.CanResizeColumn && this.ParentPanel.PanelMode==0)
        sendev = false;
    }
    //
    if (RD3_Glb.IsMobile())
    {
      var targetEl = evento.target ? evento.target : evento.srcElement;
      //
      if (targetEl && targetEl.id && targetEl.id.indexOf(":lsg:")!=-1)
        sendev = false;
    }
    //
    // Lancio il click solo se il pannello ha il sort attivo
    if (sendev)
      var ev = new IDEvent("clk", this.Identifier, evento, this.ClickEventDef, null, "cap");
    //
    // Lato client non posso fare nulla...
  }
}


// ********************************************************************************
// Gestore evento di click sull'icona di filtro avanzato QBE
// ********************************************************************************
PField.prototype.OnClickFilterQBE= function(evento)
{ 
  // E' necessario verificare che la ricerca possa essere fatta (il pannello deve essere in DATA)
  if (this.ParentPanel.Status == RD3_Glb.PS_DATA && !this.ParentPanel.DOModified)
  {
    var popup = new PopupFilter(this);
    popup.SetTop(RD3_Glb.GetScreenTop(this.ListCaptionBox,true)+this.ListCaptionBox.offsetHeight);
    popup.SetLeft(RD3_Glb.GetScreenLeft(this.ListCaptionBox,true));
    popup.Open();
  }
}


// ********************************************************************************
// Restituisce true se questo campo e' visibile
// ********************************************************************************
PField.prototype.IsVisible = function(flIgnoreGroup)
{
  // Verifico se appartengo ad una pagina e la pagina e' visibile
  var vis = false;
  //
  // Se pagina non definita, non la verifico
  if (this.Page == -1)
    vis = true;
  else
    vis = (this.ParentPanel.PanelPage == this.Page && this.ParentPanel.Pages[this.Page].IsVisible());
  //
  // Verifico la visibilita' del gruppo
  if (vis)
  {
    // Ero in un gruppo che non era visibile
    if (this.Group)
    {
      if (this.Group.IsVisible && !this.Group.IsVisible())
        vis = false;
      //
      // Io sono invisibile se appartengo ad un gruppo collassato ed il pannello e' in form o in lista e io non appartengo alla lista
      if (!flIgnoreGroup && this.Group.Collapsed && ((this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && !this.ListList) || this.ParentPanel.PanelMode == RD3_Glb.PANEL_FORM || (this.ParentPanel.PanelMode == -1 && (!this.ListList || this.InForm))))
        vis = false;
    }
  }
  //
  // Verifico la mia visibilita'
  if (vis)
    vis = this.Visible;
  //
  // Verifico la presenza del campo nel layout
  if (vis)
  {
    if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && !this.InList)
      vis = false;
    if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM && !this.InForm)
      vis = false;      
  }
  //
  // Se sono in Lista LISTLIST e il flag ShowInList e' false allora non sono visibile
  if (vis && (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST || (this.ParentPanel.PanelMode == -1 && this.ParentPanel.OldOriginalPanelMode == RD3_Glb.PANEL_LIST)) && this.InList && (this.ListList || this.AggregateOfField >= 0) && this.HiddenInList() && this.ParentPanel.HasListVisibilityControl)
    vis = false;
  //
  return vis;
}


// ********************************************************************************
// Restituisce true se questo campo e' abilitato
// NB: nrow mi arriva incrementato di 1 perche' altrimenti non potrei distinguere
// il caso nrow undefined e nrow = 0
// ********************************************************************************
PField.prototype.IsEnabled = function(nrow)
{
  // Se nrow e' definito allora controllo lo stato QBE
  if (nrow && this.ParentPanel.Status == RD3_Glb.PS_QBE)
  {
    // Le righe diversa dalla prima non sono abilitate
    if ((nrow-1) != 1)
      return false;
    //
    // Se sono un campo di lookup (no autolookup... quelle sono cercabili tramite combo) non sono abilitato
    // a meno che non sia una SmartLookup
    if (this.IdxPanel>0 && !this.AutoLookup && !this.LKE)
      return false;
    //
    // Se non sono abilitato in QBE, non sono abilitato
    if (!this.QBEEnabled)
      return false;
    //
    // Sono abilitato!
    return true;
  }
  //
  // Controllo se il Pannello e' lockato e il campo non e' statico...
  if (this.ParentPanel.Locked && !this.IsStatic() && this.CauseValidation)
    return false;
  //
  // Se pagina non definita, non la verifico
  var ena = false;
  if (this.Page == -1)
    ena = true;
  else
    ena = (this.ParentPanel.Pages[this.Page].IsEnabled());
  //
  // Verifico abilitazione del gruppo
  if (ena)
  {
    // Ero in un gruppo che non era visibile
    if (this.Group && this.Group.IsEnabled && !this.Group.IsEnabled())
      ena = false;
  }
  //
  // Verifico la mia visibilita'
  if (ena)
    ena = this.Enabled;
  //
  // Se ho la riga verifico per lo stato della cella
  if (nrow && ena)
  {
    // Se il pannello non e' gruppato allora prendo il PValue direttamente,
    // altrimenti se sono un campo in list list lo prendo dalla posizione corretta tenendo conto dell'offset
    // delle intestazioni dei gruppi
    var pval = null;
    //
    if (this.ParentPanel.IsGrouped())
      pval = this.PValues[(nrow-1)+this.ParentPanel.ListGroupRoot.GetPValOffset(nrow-1)];
    else
      pval = this.PValues[nrow-1];
    //
    if (pval && !pval.Enabled)
      ena = false;
  }
  //
  // Controllo infine lo stato del pannello (canupdate/caninsert) se il numero di riga e' definito
  if (nrow && ena)
  {
    var isnew = (nrow-1)>this.ParentPanel.TotalRows;
    //
    // Se il pannello puo' inserire ma non puo' aggiornare e non sono su una nuova riga nel caso DO devo verificare se
    // sono su una riga relativa ad un documento inserted (in quel caso conta come nuova riga): per fare questo utilizzo i row selector
    if (!isnew && this.ParentPanel.CanInsert && !this.ParentPanel.CanUpdate)
    {
      // I RowSel appartengono al primo campo
      var fld = this.ParentPanel.Fields[0];
      var pval = null;
      //
      // Prendo il PVal corretto
      if (this.ParentPanel.IsGrouped())
        pval = fld.PValues[(nrow-1)+this.ParentPanel.ListGroupRoot.GetPValOffset(nrow-1)];
      else
        pval = fld.PValues[nrow-1];
      //
      // Se il rowsel e' 3 o 4 (documento inserted) allora conta come nuova riga
      if (pval && (pval.RowSelector==3 ||pval.RowSelector==4))
        isnew = true;
    }
    //
    // Impossibile aggiornare
    if (!isnew && !this.ParentPanel.CanUpdate)
      ena = false;
    //
    // Impossibile inserire
    if (isnew && !this.ParentPanel.CanInsert)
      ena = false;
    //
    // Le colonne unbound non sono editabili in inserimento!
    if (this.Unbound && isnew)
      return false;
  }
  //
  return ena;
}


// *********************************************************************************
// Metodo chiamato dal pannello quando bisogna aggiornare la visibilita' del campo
// *********************************************************************************
PField.prototype.UpdateFieldVisibility = function()
{
  if (this.Realizing)
    return;
  //
  this.UpdateSubFrameVisibility();
  //
  if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM)
  {
    if (this.PFormCell)
    {
      var act = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
      //
      // Se il pannello e' gruppato devo andare a prendere i valori nella posizione giusta dell'array
      if (this.ParentPanel.IsGrouped())
      {
        act = this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow, RD3_Glb.PANEL_FORM);
      }
      //
      var v = this.PValues[act];
      if (v)
      {
        this.PFormCell.SetVisible(v.IsVisible());
        //
        // Caption form
        if (this.FormCaptionBox)
          RD3_Glb.SetDisplay(this.FormCaptionBox, ((this.HdrForm && v.IsVisible()) ? "" : "none"));
      }
    }
    else if (this.FormCaptionBox)
      RD3_Glb.SetDisplay(this.FormCaptionBox, (this.HdrForm && this.IsVisible()) ? "" : "none");
  }
  else
  {
    // Se sono nella lista penso anche al ListBox
    if (this.InList && this.ListList && this.ListBox)
      RD3_Glb.SetDisplay(this.ListBox, (this.IsVisible() ? "" : "none"));
    //
    // Caption Lista
    if (this.ListCaptionBox)
      RD3_Glb.SetDisplay(this.ListCaptionBox, ((this.HdrList && this.IsVisible() && (!this.ListList || this.ParentPanel.HeaderSize > 0)) ? "" : "none"));
    //
    if (this.ParentPanel.IsFluidPanel() && this.InList && this.ListList) 
    {
      // Devo aggiungere/rimuovere una classe CSS particolare che mi permette di capire se la colonna
      // e' nascosta oppure solo una singola cella (in un caso devo nasconderla, nell'altro deve spingere e quindi usare la visibility)
      if (this.ListCaptionBox)
        RD3_Glb.SetClass(this.ListCaptionBox, "fluid-column-hidden", !this.IsVisible());
      //
      if (this.PListCells)
      {
        for (var ri = 0; ri < this.PListCells.length; ri++)
        {
          var pd = this.PListCells[ri].GetDOMObj();
          if (pd)
            RD3_Glb.SetClass(pd, "fluid-column-hidden", !this.IsVisible());
        }
      }
      //
      if (this.PQBECell) 
      {
        var pqd = this.PQBECell.GetDOMObj();
        if (pqd)
          RD3_Glb.SetClass(pqd, "fluid-column-hidden", !this.IsVisible());
      }
    }
    //
    // Gestisco la visibilita' dei valori se il mio aggiornamento non e' stato ritardato
    if (this.PListCells && !this.DelayedUpdate)
    {
      if (this.ListList)
      {
        var n = this.ParentPanel.NumRows;
        var act = this.ParentPanel.ActualPosition;
        //
        //
        for (var i=0; i<n; i++)
        {
          if (!this.ParentPanel.IsGrouped())
          {
            var v = this.PValues[act+i];
            this.PListCells[i].SetVisible(v ? v.IsVisible() : this.IsVisible());
          }
          else
          {
            var idx = this.ParentPanel.GetRowIndex(i, RD3_Glb.PANEL_LIST);
            //
            var v = this.PValues[idx];
            this.PListCells[i].SetVisible(v ? v.IsVisible() : this.IsVisible());
          }
        }
      }
      else
      {
        var act = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
        //
        // Se il pannello e' gruppato devo andare a prendere i valori nella posizione giusta dell'array
        if (this.ParentPanel.IsGrouped())
        {
          act = this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow, RD3_Glb.PANEL_LIST);
        }
        //
        var v = this.PValues[act];
        this.PListCells[0].SetVisible(v ? v.IsVisible() : this.IsVisible());
        //
        // Se sono un campo fuori lista allora la visibilita' dell'Hdr dipende anche dalla visibilita' del Pval (se presente)
        if (this.ListCaptionBox && v)
         RD3_Glb.SetDisplay(this.ListCaptionBox, ((this.HdrList && v.IsVisible()) ? "" : "none"));
      }
    }
  }
}


// ***************************************************************
// Gestisce il cambio di layout dei subframe
// ***************************************************************
PField.prototype.UpdateSubFrameVisibility = function()
{
  // Vediamo se devo renderizzare ancora il subpanel?
  if (this.SubFrame && this.IsVisible() && (this.FormCaptionBox||this.ListCaptionBox))
  {
    if (!this.SubFrame.Realized)
    {
      var obj = (this.FormCaptionBox?this.FormCaptionBox:this.ListCaptionBox);
      //
      // Sono un campo statico... se mi hanno dato un allineamento a causa del VS... lo piazzo a left!
      obj.style.textAlign = "left";
      //
      // Ora posso realizzare il tutto
      this.SubFrame.Realize(obj);
      //
      // Se e' una pannello, allora aggiusto la lista
      if (this.SubFrame instanceof IDPanel)
        this.SubFrame.AdjustSubFrame(this,obj);
      //
      // Annullo i margini del subframe, perche' basta il mio padding.
      this.SubFrame.ContentBox.style.margin = "0px";
      //
      // Nel mobile tengo conto che i sotto pannelli probabilmente sono nei gruppi e
      // non voglio che sbordino
      if (obj.style.paddingBottom=="0px" && RD3_Glb.IsMobile())
        this.SubFrame.ContentBox.style.marginBottom = "4px";
    }
    //
    // Faccio l'append senza controllare se e' gia' nel layout giusto perche' UpdateFieldVisibility viene chiamata o quando cambio layout
    if (this.InList && this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.SubFrame.FrameBox.parentNode!=this.ListCaptionBox)
    {
      this.ListCaptionBox.appendChild(this.SubFrame.FrameBox);
      this.SubFrame.AdaptLayout();
    }
    if (this.InForm && this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM && this.SubFrame.FrameBox.parentNode!=this.FormCaptionBox)
    {
      this.FormCaptionBox.appendChild(this.SubFrame.FrameBox);
      this.SubFrame.AdaptLayout();
    }
  }
}

// ***************************************************************
// Sistema l'header in modo da poter gestire il click del sort
// ***************************************************************
PField.prototype.SetCanSort = function(value)
{
  // Non e' ancora il momento... oppure il campo non e' parte della lista
  if (!this.Realized || !this.ListList || !this.InList || !this.ListCaptionBox)
    return;
  //
  // Comunque il mio flag di sort e' piu' importante
  if (value == undefined)
    value = this.CanSort && this.VisCanSort();
  else
    value = value && (this.CanSort && this.VisCanSort());
  //
  // Attivo o meno i manufatti di sort
  if (!this.CanUseListQBE())
    this.ListCaptionBox.style.cursor = value? "pointer":"";
  if (value && !this.SortImage)
  {
    this.SortImage = document.createElement("img");
    this.SortImage.className = "panel-sort-image";
    var parentContext = this;
    this.SortImage.onclick = function(ev) { parentContext.OnClickCaption(ev); };
    this.ListCaptionBox.appendChild(this.SortImage);
  }
  //
  if (!value && this.SortImage)  
  {
    this.SortImage.parentNode.removeChild(this.SortImage);
    this.SortImage = null;
  }
  //
  if (!this.ParentPanel.Realizing)
    this.SetSortMode();
}


// ***************************************************************
// Ritorna la larghezza dell'input del campo
// ***************************************************************
PField.prototype.GetValueWidth = function(list, cell)
{
  var w = 0;
  if (list)
  {
    w = this.ListWidth;
    //
    // Verifico intestazione (se non sono parte della lista)
    if (!this.ListList)
    {
      if (this.HdrList && !this.HdrListAbove)
        w -= (this.ListHeaderSize+4);
    }
  }
  else
  {
    // Form
    w = this.FormWidth;
    if (this.HdrForm && !this.HdrFormAbove)
      w -= (this.FormHeaderSize+4);
    //
    // Se sono l'overlay di lista allora la larghezza dipende dalla cella che c'e' sotto e non dalla mia configurazione
    if (this.ParentPanel.IsFluidPanel() && cell && cell.InListForm && this.ListOverlayFormWidth)
      w = this.ListOverlayFormWidth;
  }
  //
  return w;  
}


// ***************************************************************
// Ritorna la larghezza dell'input del campo
// ***************************************************************
PField.prototype.GetValueHeight = function(list, cell)
{
  var h = 0;
  if (list)
  {
    h = this.ListHeight;
    //
    // Verifico intestazione (se non sono parte della lista)
    if (!this.ListList)
    {
      if (this.HdrList && this.HdrListAbove)
        h -= (this.ListHeaderSize+4);
    }
  }
  else
  {
    // Form
    h = this.FormHeight;
    if (this.HdrForm && this.HdrFormAbove)
      h -= (this.FormHeaderSize+4);
    //
    // Se sono l'overlay di lista allora la larghezza dipende dalla cella che c'e' sotto e non dalla mia configurazione
    if (this.ParentPanel.IsFluidPanel() && cell && cell.InListForm && this.ListOverlayFormHeight && !isNaN(this.ListOverlayFormHeight))
      h = this.ListOverlayFormHeight; 
  }
  //
  return h;
}


// **********************************************************************
// Gestore dell'evento di change dell'input
// **********************************************************************
PField.prototype.OnChange = function(evento, nr)
{
  // Lo rifletto sul value giusto
  var v = this.PValues[this.ParentPanel.ActualPosition + nr];
  //
  if (this.ParentPanel.IsGrouped())
    v = this.PValues[this.ParentPanel.GetRowIndex(nr)];
  //
  if (v)
    v.OnChange(evento);
}


// **********************************************************************
// Gestore dell'evento di keypress dell'input
// **********************************************************************
PField.prototype.OnKeyPress = function(evento, nr)
{
  // Lo rifletto sul value giusto
  var v = this.PValues[this.ParentPanel.ActualPosition + nr];
  //
  if (this.ParentPanel.IsGrouped)
    v = this.PValues[this.ParentPanel.GetRowIndex(nr)];
  //
  if (v)
    v.OnKeyPress(evento);
}


// **********************************************************************
// Prende il fuoco su questo campo
// **********************************************************************
PField.prototype.Focus = function (evento, row, selall, focusQBEList)
{
  // Se il campo non e' visibile ora, non imposto fuoco
  if (!this.IsVisible() || !this.Realized)
    return false;
  //
  // Se e' fuori dal buffer video, non faccio altro
  if (this.ParentPanel.ActualRow < 0 || this.ParentPanel.ActualRow >= this.ParentPanel.NumRows)
    return false;
  //
  if (this.ParentPanel.UseListQBE == RD3_Glb.PAN_QBEROW && RD3_KBManager.ActiveElement) 
  {
    // Se il pannello supporta il QBEROW e l'oggetto attivo e' la cella di ricerca non gestisco il fuoco
    var actObj = RD3_KBManager.GetObject(RD3_KBManager.ActiveElement, true);
    if (actObj && (actObj.ListQBEValue || actObj.ListQBECell))
      return false;
  }
  //
  if (this.ParentPanel.WebForm.Animating && this.ParentPanel.WebForm.Modal!=0)
  {
    RD3_GFXManager.ModalFocusFldId = this.Identifier;
    RD3_GFXManager.ModalFocusFldRow = row;
    //
    return true;
  }
  //
  // Se sto animando il pannello rimando la gestione del fuoco: potrei stare cambiando il layout
  // e gestire adesso il fuoco e' sbagliato
  if (this.ParentPanel.AnimatingPanel)
  {
    RD3_DesktopManager.HandleFocus2(this.Identifier, row);
    return;
  }
  //
  // C'e' aperta una combo non popover... meglio non dare il fuoco adesso
  if (RD3_DDManager.OpenCombo && !RD3_DDManager.OpenCombo.IsPopOver() && RD3_Glb.IsMobile())
  {
    return;
  }
  //
  // Cerco l'elemento da fuocare... prima il box
  var cell = null;
  if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_FORM)
  {
    cell = this.PFormCell;
  }
  else
  {
    var nr = 0;
    if (this.ListList)
      nr = row;
    if (this.PListCells)
      cell = this.PListCells[nr];
    //
    if (focusQBEList && this.PQBECell)
      cell = this.PQBECell;
  }
  //
  // Nessun elemento trovato?
  if (!cell)
  {
    if (this.IsButton())
    {
      var fobj = null;
      if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_FORM && this.FormCaptionBox)
        fobj = this.FormCaptionBox;
      else if (this.ListCaptionBox)
        fobj = this.ListCaptionBox;
      //
      if (fobj)
      {
        try
        {
          fobj.focus();
          RD3_KBManager.ActiveElement = fobj;
          return true;
        }
        catch(ex)
        {
          return false
        }
      }
      else
        return false;
    }
    else
    {
      return false;
    }
  }
  //
  // Sto per dare il fuoco ad una intestazione di gruppo, prima di farlo devo verificare se io sono
  // il primo campo in lista, se lo sono procedo dando il fuoco, altrimenti lo faccio fare al primo campo in lista
  if (cell.ControlType == 111)
  {
    var firstfld = this.ParentPanel.GetFirstListField();
    if (firstfld && this != firstfld)
      return firstfld.Focus(evento, row, selall);
  }
  //
  // Se do il fuoco alla cella perche' e' in errore ma c'e' una combo aperta,
  // salto questa assegnazione altrimenti essa si chiude
  if (cell.ErrorType == 1 && RD3_DDManager.OpenCombo)
    return false;
  //
  var fc = cell.Focus(selall, evento);
  //
  // Nel caso di cella fluida dare il fuoco non cambia automaticamente la riga del pannello,
  // quindi se necessario lo facciamo noi
  if (this.ParentPanel.IsFluidPanel() && this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && row != this.ParentPanel.ActualRow)
    this.ParentPanel.ChangeActualRow(row, evento);
  //
  // Solo se le cella e' attiva, altrimenti potrei tornare in cima durante lo scroll
  if (this.ParentPanel.IsFluidPanel() && this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.ListList && cell.PValue && cell.PValue.IsEnabled())
  {
    var cObj = cell.GetDOMObj();
    this.ParentPanel.CodeScroll = true;
    //
    // Devo verificare se scrollare il pannello in modo da far vedere la riga selezionata
    // 1) lo scrolltop e' superiore alla posizione della cella : significa che questa e' nella parte precedente
    //    -> bisogna tenere conto anche dell'header sticky che copre la prima riga della lista
    // 3) l'offset della cella e' superiore allo scrolltop+altezza : non e' visibile perche' e nella porzione successiva
    if (this.ParentPanel.ListListBox.scrollTop + this.ParentPanel.ListFluidHeader.offsetHeight > cObj.offsetTop)
      this.ParentPanel.ListListBox.scrollTop = cObj.offsetTop - this.ParentPanel.ListFluidHeader.offsetHeight;
    else if (this.ParentPanel.ListListBox.scrollTop + this.ParentPanel.ListListBox.offsetHeight < cObj.offsetTop + cObj.offsetHeight) {
      // Provo a modificare l'altezza in modo da far entrare
      this.ParentPanel.ListListBox.scrollTop = cObj.offsetTop + cObj.offsetHeight - this.ParentPanel.ListListBox.offsetHeight;
    }
    //
    // Devo verificare se il prossimo campo in lista e' visibile, se non lo e' prima devo scrollare orizzontalmente la lista in modo da visualizzarlo
    if (cObj.offsetLeft + cObj.offsetWidth > this.ParentPanel.ListListBox.scrollLeft + this.ParentPanel.ListListBox.offsetWidth) {
      this.ParentPanel.ListListBox.scrollLeft = this.ParentPanel.ListListBox.scrollLeft + cObj.offsetWidth;
      //
      // Adesso verifico se vedo la cella o no, se non la vedo magari ho fatto un salto maggiore (es: shift-Tab dall'inizio alla fine in una lista con scroll orizzontale)
      if (cObj.offsetLeft + cObj.offsetWidth > this.ParentPanel.ListListBox.scrollLeft + this.ParentPanel.ListListBox.offsetWidth)
        this.ParentPanel.ListListBox.scrollLeft = cObj.offsetLeft;
    }
    //
    // Gestisco shift-tab, devo almeno posizionarmi in modo da far vedere l'intero campo
    if (cObj.offsetLeft < this.ParentPanel.ListListBox.scrollLeft)
      this.ParentPanel.ListListBox.scrollLeft = cObj.offsetLeft;
    //
    // Lo scroll e' asincrono, quindi uso in timer per rimuovere il semaforo
    var ppan = this.ParentPanel;
    window.setTimeout(function () {
      delete ppan.CodeScroll;
    }, 0);
    //
    this.FocusListCell(cell, cObj);
  }
  //
  return fc;
}


// **********************************************************************
// Il fuoco e' su questo campo (elemento DOM = srcele)
// **********************************************************************
PField.prototype.GotFocus = function(srcele, evento)
{
  // Risalgo finche' trovo qualcuno con l'ID
  while (srcele && !srcele.id)
    srcele = srcele.parentNode;
  //
  // Vediamo quale cella devo evidenziare
  var cell = null;
  //
  // Vediamo se devo cambiare riga nel pannello
  if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.ListList)
  {
    if (this.PQBECell && this.PQBECell.GetDOMObj(true) == srcele)
      cell = this.PQBECell;
    else
    {
      var n = this.PListCells.length;
      for (var i=0; i<n; i++)
      {
        if (this.PListCells[i].GetDOMObj(true)==srcele || this.PListCells[i].TooltipDiv==srcele)
        {
          // Se il pannello e' in QBE non gestisco la presa del fuoco su una riga diversa dalla prima
          if (this.ParentPanel.Status==RD3_Glb.PS_QBE && i!=0)
            return;
          //
          // Trovata la cella!
          this.ParentPanel.ChangeActualRow(i, evento);
          cell = this.PListCells[i];
          break;
        }
      }
    }
  }
  else if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.PListCells)
    cell = this.PListCells[0];
  else
    cell = this.PFormCell;
    //
  // Evidenzio la cella
  if (cell)
  {
    // Devo mandare al server un messaggio dicendo che ho preso il fuoco io
    this.ParentPanel.FieldFocus(this.Index, true);
    //
    cell.SetActive();
    //
    // Ho dato il fuoco ad un campo Edit di una lista sboccata.. posso mostrare l'input overlay
    this.FocusListCell(cell, srcele);
    //
    // Se si e' attivata la cella di edit, arrivo da un click del mouse e ho un check allora cambio direttamente il valore, in questo modo l'utente non deve fare il doppio click 
    // (per attivare la cella di edit e poi modificare il check)
    if (evento && evento.type == "click" && this.ListFormCell && this.ListFormCell.ControlType == 4 && this.ListFormCell.IsEnabled && !this.ListFormCell.IsReadOnly && this.ListFormCell.SubIntCtrl && !this.SkipCheckOnFocus) 
    {
      this.SkipCheckOnFocus = true;
      //
      // Cambio il valore
      this.ListFormCell.SubIntCtrl.checked = !this.ListFormCell.SubIntCtrl.checked;
      //
      // Acquisiamo la modifica (IDRO_OnChange rilancia la GotFocus, quindi dobbiamo usare un semaforo per evitare il loop (SkipCheckOnFocus) )
      RD3_KBManager.IDRO_OnChange(this.ListFormCell.SubIntCtrl, true);
      //
      delete this.SkipCheckOnFocus;
    }
  }
}


// **********************************************************************
// Il fuoco non e' piu' su questo campo (elemento DOM = srcele)
// **********************************************************************
PField.prototype.LostFocus = function(srcele, evento, nosend)
{
  // Devo mandare al server un messaggio dicendo che ho perso il fuoco
  if (!nosend)
    this.ParentPanel.FieldFocus(this.Index, false);
  //
  while (srcele && !srcele.id)
    srcele = srcele.parentNode;
  //
  var fb = RD3_DesktopManager.WebEntryPoint.FocusBox;
  if (fb.parentNode==srcele)
    RD3_DesktopManager.WebEntryPoint.SetHideFocusBox();
}


// **********************************************************************
// Gestisco la pressione dei tasti di navigazione
// **********************************************************************
PField.prototype.HandleNavKeys = function(eve)
{
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var srcobj = (window.event)?eve.srcElement:eve.explicitOriginalTarget;
  //
  var istxt = (srcobj.tagName=="TEXTAREA" || RD3_Glb.isInsideEditor(srcobj));
  var listGroup = RD3_KBManager.IsListGroup(srcobj);
  var ok = false;
  //
  switch (code)
  {
    case 33: // PAGEUP
      if (!istxt && this.ParentPanel.PrevButton.style.display!="none")
      {
        // Non posso usare il next perche' se l'utente tiene premuto pagDN il browser non riesce a gestire la risposta del server
        // Questo perche' il next non puo' essere mangiato altrimenti ce'e' un disallineamento.
        //
        // Allora invece di fare il next facciamo lo scroll di this.ParentPanel.NumRows-1 righe (come farebbe il click su NEXT)
        if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST)
        {
          var deltaRows = this.ParentPanel.NumRows-1;
          if (this.ParentPanel.ActualPosition > 1)
          {
            var ok = true;
            var n = this.ParentPanel.ActualPosition - deltaRows;
            //
            // Se il pannello e' gruppato ottengo l'indice corrispondente alla riga precedente del pannello
            if (this.ParentPanel.IsGrouped())
            {
              // se sono alla prima riga della visione compatta mi fermo
              if (this.ParentPanel.CompactActualPosition==1)
                ok = false;
              //
              n = this.ParentPanel.GetServerIndex(-deltaRows);
              //
              // Se c'e' un gruppo aperto non posso mettermi sulla sua intestazione: la prima riga ha indice StartingRecord,
              // ma lo ha anche l'intestazione: in questo caso passo al gruppo precedente, faro' un salto di 1..
              if (n==this.ParentPanel.ActualPosition)
                n = this.ParentPanel.ActualPosition-1;
            }
            if (n <= 0)
              n = 1;
            //
            if (ok)
            {
              this.ParentPanel.ScrollTo(n, eve, 200);
              this.ParentPanel.UpdateScrollPos();
            }
          }
        }
        else        
          this.ParentPanel.OnToolbarClick(eve, "prev");
        //
        ok = true;
      }
    break;

    case 34: // PAGEDN
      if (!istxt && this.ParentPanel.NextButton.style.display!="none")
      {
        // Non posso usare il next perche' se l'utente tiene premuto pagDN il browser non riesce a gestire la risposta del server
        // Questo perche' il next non puo' essere mangiato altrimenti ce'e' un disallineamento.
        //
        // Allora invece di fare il next facciamo lo scroll di this.ParentPanel.NumRows-1 righe (come farebbe il click su NEXT)
        if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST)
        {
          var deltaRows = this.ParentPanel.NumRows-1;
          //
          // Gestisco il tasto giu' solo fino a che non sono in fondo al pannello (sia quando e' gruppato che quando e' normale
          if (this.ParentPanel.IsGrouped() && this.ParentPanel.CompactActualPosition + this.ParentPanel.NumRows < this.ParentPanel.GetTotalRows()+1)
          {
            // Passo alla riga successiva
            n = this.ParentPanel.GetServerIndex(deltaRows);
            //
            // Dato che quando chiedo di posizionarmi su un gruppo aperto la prima riga e l'intestazione hanno lo 
            // stesso indice, in questo caso particolare scrollo di 2 invece che di 1..
            var no = this.ParentPanel.GetServerIndex(deltaRows-1);
            //
            if (n==no)
              n = this.ParentPanel.GetServerIndex(deltaRows+1);
            //
            this.ParentPanel.ScrollTo(n, eve, 200);
            this.ParentPanel.UpdateScrollPos();
            //
            break;
          }
          //
          if (this.ParentPanel.ActualPosition + this.ParentPanel.NumRows <= this.ParentPanel.TotalRows)
          {
            var n = this.ParentPanel.ActualPosition+deltaRows;
            if (n + this.ParentPanel.NumRows >= this.ParentPanel.TotalRows)
              n = this.ParentPanel.TotalRows - this.ParentPanel.NumRows + 1;
            //
            // Se il pannello e' gruppato ottengo l'indice della seconda riga del pannello e scrollo fino a lui
            if (this.ParentPanel.IsGrouped())
            {
              n = this.ParentPanel.GetServerIndex(deltaRows);
              //
              // Devo veramente scrollare?
              // Rifaccio il controllo, tenendo conto dei dati dei gruppi
              ok = this.ParentPanel.CompactActualPosition + this.ParentPanel.NumRows < this.ParentPanel.GetTotalRows()+1;
              if (!ok)
                break;
            }
            //
            this.ParentPanel.ScrollTo(n, eve, 200);
            this.ParentPanel.UpdateScrollPos();
          }
        }
        else
          this.ParentPanel.OnToolbarClick(eve, "next");
        //
        ok = true;
      }
    break;    

    case 35: // CTRL+END
      if (!istxt && eve.ctrlKey && this.ParentPanel.BottomButton.style.display!="none")
      {
        this.ParentPanel.OnToolbarClick(eve, "bottom");
        ok = true;
      }
    break;

    case 36: // CTRL+HOME
      if (!istxt && eve.ctrlKey && this.ParentPanel.TopButton.style.display!="none")
      {
        this.ParentPanel.OnToolbarClick(eve, "top");
        ok = true;
      }
    break;    
    
    case 9: // TAB
    {
      if (listGroup)
      {
        ok = true;
        break;
      }
      //
      // Se sono arrivato qui potrei avere una lista di edit in lista aperta, se non ce l'ho non faccio nulla
      var focusWasInQBEList = false;
      if (this.ListFormCell && RD3_DDManager.OpenListFormCell == this.ListFormCell) {
        if (this.ListFormCell.PValue && this.ListFormCell.PValue.ListQBEValue)
          focusWasInQBEList = true;
        //
        // ACQUISISCO IL VALORE ATTUALE E CHIUDO LA MIA FORMCELL
        // Faccio il blur, poi per sicurezza chiamo anche l'onChange in modo da mandare il messaggio al server e l'UpdaeScreen in modo da aggiornare la cella in lista
        // che sta sotto la cella in FormList
        var parentContainer = RD3_DDManager.OpenListFormCell.GetDOMObj().parentNode;
        if (RD3_DDManager.OpenListFormCell.GetDOMObj().blur)
          RD3_DDManager.OpenListFormCell.GetDOMObj().blur();
        RD3_KBManager.IDRO_OnChange(RD3_DDManager.OpenListFormCell.GetDOMObj(), true);
        RD3_DDManager.OpenListFormCell.PValue.UpdateScreen();
        //
        if (parentContainer && parentContainer.parentNode)
          parentContainer.parentNode.removeChild(parentContainer);
        //
        delete RD3_DDManager.OpenListFormCell;
        RD3_KBManager.ActiveElement = null;
      }
      //
      if (eve.shiftKey)
        this.ParentPanel.FocusPrevField(this, eve, focusWasInQBEList);
      else
        this.ParentPanel.FocusNextField(this, eve, focusWasInQBEList);
      ok = true;
    }
    break;
    
    case 37: // SX
    {
      // Se ho premuto sinistra su una intestazione di gruppo devo collassarlo se e' gia' espanso
      if (listGroup && this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.ParentPanel.IsGrouped())
      {
        // Cerco l'indice del gruppo nell'array dei PValue
        var eid = srcobj.id;
        //
        // Prendo la stringa identificativa del gruppo
        var grpid = eid.substring(eid.indexOf(":lsg:"));
        //
        // Tolgo la prima parte della stringa e leggo l'indice
        var grpidx = parseInt(grpid.substring(5));
        //
        // Accedo al gruppo
        var grp = this.PValues[grpidx];
        if (!grp || !(grp instanceof PListGroup))
        {
          ok = true;
          break;
        }
        //
        // Se il gruppo e' espanso lo collasso
        if (grp.Expanded)
          grp.OnExpandGrp();
        //
        ok = true;
        break;
      }
      //
      var ini = true;
      //
      // Vediamo se sono all'inizio del campo
      if (RD3_Glb.IsEditFld(srcobj) || srcobj.tagName == "TEXTAREA")
        ini = getCursorPos(srcobj)==0; // Definito in maskedinp.js
      //
      if (ini && !eve.ctrlKey && !eve.shiftKey)
      {
        this.ParentPanel.FocusPrevField(this, eve);
        ok = true;        
      }
    }
    break;

    case 39: // DX
    {
      // Se ho premuto destra su una intestazione di gruppo devo espanderlo se non e' gia' espanso
      if (listGroup && this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.ParentPanel.IsGrouped())
      {
        // Cerco l'indice del gruppo nell'array dei PValue
        var eid = srcobj.id;
        //
        // Prendo la stringa identificativa del gruppo
        var grpid = eid.substring(eid.indexOf(":lsg:"));
        //
        // Tolgo la prima parte della stringa e leggo l'indice
        var grpidx = parseInt(grpid.substring(5));
        //
        // Accedo al gruppo
        var grp = this.PValues[grpidx];
        if (!grp || !(grp instanceof PListGroup))
        {
          ok = true;
          break;
        }
        //
        // Se il gruppo non e' espanso lo espando
        if (!grp.Expanded)
          grp.OnExpandGrp();
        //
        ok = true;
        break;
      }
      //
      var fin = true;
      //
      // Vediamo se sono all'inizio del campo
      if (RD3_Glb.IsEditFld(srcobj) || srcobj.tagName == "TEXTAREA")
        fin = getCursorPos(srcobj)==srcobj.value.length; // Definito in maskedinp.js
      //
      if (fin && !eve.ctrlKey && !eve.shiftKey)
      {
        this.ParentPanel.FocusNextField(this, eve);
        ok = true;        
      }
    }
    break;

    case 38: // SU
      if (!istxt) // Solo se non e' una textarea...
      {
        if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST)
        {
          // se sono in lista, mi sposto oppure scrollo
          if (this.ParentPanel.IsFluidPanel()) 
          {
            // In questo caso gestisco il giu' spostando la cella di edit ()
            if (this.ParentPanel.ActualRow > 0 && this.ListList) 
            {
              // Se sono arrivato qui devo avere una lista di edit in lista aperta, se non ce l'ho non faccio nulla
              if (this.ListFormCell && RD3_DDManager.OpenListFormCell == this.ListFormCell && !(this.ListFormCell.PValue && this.ListFormCell.PValue.ListQBEValue)) {
                // Prima di cambiare riga devo acquisire il valore
                if (srcobj.blur)
                  srcobj.blur();
                RD3_KBManager.IDRO_OnChange(srcobj, true);
                this.ListFormCell.PValue.UpdateScreen();
                delete RD3_DDManager.OpenListFormCell;
                //
                // Adesso posso cambiare riga e mostrare il nuovo input
                this.ParentPanel.ChangeActualRow(this.ParentPanel.ActualRow - 1, eve);
                this.Focus(eve, this.ParentPanel.ActualRow, true);
                this.ParentPanel.FieldFocus(this.Index, true);
              }
            }
            //
            ok = true;
          }
          else if (this.ParentPanel.ActualRow>0)
          {
            this.Focus(eve, this.ParentPanel.ActualRow-1, true);
          }
          else
          {
            if (this.ParentPanel.ActualPosition > 1)
            {
              var ok = true;
              var n = this.ParentPanel.ActualPosition-1;
              //
              // Se il pannello e' gruppato ottengo l'indice corrispondente alla riga precedente del pannello
              if (this.ParentPanel.IsGrouped())
              {
                // se sono alla prima riga della visione compatta mi fermo
                if (this.ParentPanel.CompactActualPosition==1)
                  ok = false;
                //
                n = this.ParentPanel.GetServerIndex(-1);
                //
                // Se c'e' un gruppo aperto non posso mettermi sulla sua intestazione: la prima riga ha indice StartingRecord,
                // ma lo ha anche l'intestazione: in questo caso passo al gruppo precedente, faro' un salto di 1..
                if (n==this.ParentPanel.ActualPosition)
                  n = this.ParentPanel.ActualPosition-1;
              }
              //
              if (ok)
              {
                this.ParentPanel.ScrollTo(n, eve, 200);
                this.ParentPanel.UpdateScrollPos();
              }
            }
            else
            {
              // Sono sulla prima riga in lista in assoluto, in questo caso se ho la cella QBE in riga do' il fuoco a lei
              if (this.PQBECell)
                this.PQBECell.Focus();
            }
          }
        }
        else
        {
          this.ParentPanel.FocusPrevField(this, eve, true);
        }
        //
        ok = true;
      }
    break;

    case 40: // GIU
      if (!istxt) // Solo se non e' una textarea...
      {
        // Se siamo su !IE non gestiamo alt-down se siamo su una combo: ci pensera' lei a gestirlo
        if (!RD3_Glb.IsIE())
        {
          var cel = this.GetCurrentCell(this.ParentPanel.ActualRow, srcobj);
          if (cel && cel.ControlType==3 && eve.altKey)
            return false;
        }
        //
        if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST)
        {
          if (this.ParentPanel.IsFluidPanel()) 
          {
            // In questo caso gestisco il giu' spostando la cella di edit ()
            if (this.ParentPanel.ActualRow < this.ParentPanel.NumRows - 1 && this.ListList) {
              // Se sono arrivato qui devo avere una lista di edit in lista aperta, se non ce l'ho non faccio nulla
              if (this.ListFormCell && RD3_DDManager.OpenListFormCell == this.ListFormCell && !(this.ListFormCell.PValue && this.ListFormCell.PValue.ListQBEValue)) {
                // Prima di cambiare riga devo acquisire il valore
                if (srcobj.blur)
                  srcobj.blur();
                RD3_KBManager.IDRO_OnChange(srcobj, true);
                this.ListFormCell.PValue.UpdateScreen();
                delete RD3_DDManager.OpenListFormCell;
                //
                // Adesso posso cambiare riga e mostrare il nuovo input
                this.ParentPanel.ChangeActualRow(this.ParentPanel.ActualRow + 1, eve);
                this.Focus(eve, this.ParentPanel.ActualRow, true);
                this.ParentPanel.FieldFocus(this.Index, true);
              }
            }
            //
            ok = true;
          }
          else if (this.PQBECell && srcobj.id && srcobj.id == this.Identifier+":qv") 
          {
            // Il fuoco e' sulla mia QBECell, in questo caso devo dare il fuco alla mia prima riga.
            // (rimuovo l'oggetto attivo, altrimenti il Focus si rifiuta di muoversi)
            if (RD3_KBManager.ActiveElement == srcobj)
              delete RD3_KBManager.ActiveElement;
            this.Focus(eve, 0, true);
          }
          else if (this.ParentPanel.ActualRow<this.ParentPanel.NumRows-1)
          {
            // se sono in lista, mi sposto oppure scrollo
            this.Focus(eve, this.ParentPanel.ActualRow+1, true);
          }
          else
          {
            // Gestisco il tasto giu' solo fino a che non sono in fondo al pannello (sia quando e' gruppato che quando e' normale
            if (this.ParentPanel.IsGrouped() && this.ParentPanel.CompactActualPosition + this.ParentPanel.NumRows < this.ParentPanel.GetTotalRows()+1)
            {
              // Passo alla riga successiva
              n = this.ParentPanel.GetServerIndex(1);
              //
              // Dato che quando chiedo di posizionarmi su un gruppo aperto la prima riga e l'intestazione hanno lo 
              // stesso indice, in questo caso particolare scrollo di 2 invece che di 1..
              var no = this.ParentPanel.GetServerIndex(0);
              //
              if (n==no)
                n = this.ParentPanel.GetServerIndex(2);
              //
              this.ParentPanel.ScrollTo(n, eve, 200);
              this.ParentPanel.UpdateScrollPos();
              //
              break;
            }
            //
            if (this.ParentPanel.ActualPosition + this.ParentPanel.NumRows <= this.ParentPanel.TotalRows)
            {
              var n = this.ParentPanel.ActualPosition+1;
              //
              // Se il pannello e' gruppato ottengo l'indice della seconda riga del pannello e scrollo fino a lui
              if (this.ParentPanel.IsGrouped())
              {
                n = this.ParentPanel.GetServerIndex(1);
                //
                // Devo veramente scrollare?
                // Rifaccio il controllo, tenendo conto dei dati dei gruppi
                ok = this.ParentPanel.CompactActualPosition + this.ParentPanel.NumRows < this.ParentPanel.GetTotalRows()+1;
                if (!ok)
                  break;
              }
              //
              this.ParentPanel.ScrollTo(n, eve, 200);
              this.ParentPanel.UpdateScrollPos();
            }
          }
        }
        else
        {
          // se sono in form, mi sposto nel campo seguente
          this.ParentPanel.FocusNextField(this, eve);
        }
        //
        ok = true;
      }
    break;
    
  }
  //
  if (ok && RD3_DesktopManager.WebEntryPoint.CalPopup)
  {
    // Controllo chiusura calendario
    if (RD3_DesktopManager.WebEntryPoint.CalPopup.style.display!="none")
      RD3_DesktopManager.WebEntryPoint.CalPopup.style.display="none";
  }
  //
  return ok;
}


// **********************************************************************
// Gestisco la pressione dei tasti FK a partire da questo campo
// **********************************************************************
PField.prototype.HandleFunctionKeys = function(eve)
{
  // In realta' lo fa il pannello...
  return this.ParentPanel.HandleFunctionKeys(eve);
}


// **********************************************************************
// Torna TRUE se il campo e' statico
// **********************************************************************
PField.prototype.IsStatic = function()
{
  return this.IdxPanel<0;
}


// **********************************************************************
// Torna TRUE se il campo e' un bottone
// **********************************************************************
PField.prototype.IsButton = function()
{
  return (this.VisualStyle && this.VisualStyle.GetContrType() == 6 && this.IsStatic());
}


// *********************************************************************************
// Gestisce la visualizzazione o meno dei pulsanti della Toolbar
// *********************************************************************************
PField.prototype.UpdateToolbar = function()
{
  if (this.DataType==10) // BLOB
  {
    var upl = false;
    var del = false;
    var zom = false;
    //
    var pv = this.PValues[this.ParentPanel.ActualPosition+this.ParentPanel.ActualRow];
    //
    if (this.ParentPanel.IsGrouped())
      pv = this.PValues[this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow)];
    //
    var mim = (pv)?pv.BlobMime:null;
    if (!mim)
      mim = "empty";
    //
    // Se sono abilitato e non in QBE, mostro anche la cancellazione/caricamento, ma solo se non sono su una riga vuota
    var m = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
    //
    if (this.ParentPanel.IsGrouped() && pv)
      m = pv.Index;
    //
    if (this.IsEnabled(m+1) && this.ParentPanel.Status!=RD3_Glb.PS_QBE && !this.ParentPanel.IsNewRow(this.ParentPanel.ActualPosition, this.ParentPanel.ActualRow))
    {
      upl = this.ParentPanel.IsCommandEnabled(RD3_Glb.PCM_BLOBEDIT);
      del = this.ParentPanel.IsCommandEnabled(RD3_Glb.PCM_BLOBDELETE);        
    }
    //
    if (mim!="empty" && mim!="upload")
      zom = this.ParentPanel.IsCommandEnabled(RD3_Glb.PCM_BLOBSAVEAS);
    //
    // Mostro o nascondo fisicamente i campi
    RD3_Glb.SetDisplay(this.ListBlobUploadImg,(upl)?"":"none");
    RD3_Glb.SetDisplay(this.FormBlobUploadImg,(upl)?"":"none");
    RD3_Glb.SetDisplay(this.ListBlobDeleteImg,(del)?"":"none");
    RD3_Glb.SetDisplay(this.FormBlobDeleteImg,(del)?"":"none");
    RD3_Glb.SetDisplay(this.ListBlobZoomImg,(zom)?"":"none");
    RD3_Glb.SetDisplay(this.FormBlobZoomImg,(zom)?"":"none");
    //
    // Posiziono i campi
    var tw = RD3_ClientParams.BlobButtonWidth *((upl?1:0)+(del?1:0)+(zom?1:0));
    //
    // Lavoro per la form
    if (this.FormBlobUploadImg)
    {
      var top = 0;
      var left = this.FormCaptionBox.clientWidth - tw;
      if (!this.HdrFormAbove)
      {
        top = 20;
        left = 0;
      }
      //
      if (upl)
      {
        this.FormBlobUploadImg.style.left = left + "px";
        this.FormBlobUploadImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (del)
      {
        this.FormBlobDeleteImg.style.left = left + "px";
        this.FormBlobDeleteImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (zom)
      {
        this.FormBlobZoomImg.style.left = left + "px";
        this.FormBlobZoomImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
    }
    //
    // Lavoro per la list
    if (this.ListBlobUploadImg)
    {
      var top = 0;
      var left = this.ListCaptionBox.clientWidth - tw;
      if (!this.HdrListAbove)
      {
        top = 20;
        left = 0;
      }
      //
      if (upl)
      {
        this.ListBlobUploadImg.style.left = left + "px";
        this.ListBlobUploadImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (del)
      {
        this.ListBlobDeleteImg.style.left = left + "px";
        this.ListBlobDeleteImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }
      if (zom)
      {
        this.ListBlobZoomImg.style.left = left + "px";
        this.ListBlobZoomImg.style.top = top + "px";
        left+=RD3_ClientParams.BlobButtonWidth;
      }    
    }
  }
}


// ********************************************************************************
// Gestore evento di click su un pulsante della Toolbar
// ********************************************************************************
PField.prototype.OnBlobCommand= function(evento, button)
{
  var pv = this.PValues[this.ParentPanel.ActualPosition+this.ParentPanel.ActualRow];
  //
  if (this.ParentPanel.IsGrouped())
    pv = this.PValues[this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow)];
  //
  if (button == "zoom" || button == "link")
  {
    var url = pv.BlobUrl;
    if (url && url!="")
    {
      url = url.replace("&amp;", "&");
      if (window.RD4_Enabled && url.substr(0, 11) == "?WCI=IWBlob")
      {
        // L'url e' cosi' composto: ?WCI=IWBlob&WCE=FFXXXXXXX
        // FF e' l'identificativo del frame
        // XXXXXXX e' l'identificativo del blobcache
        var wce = url.substring(16);
        //
        // Creo l'evento con par1 contenente il WCE
        var ev = new IDEvent("IWBlob", "", null, RD3_Glb.EVENT_ACTIVE, "", wce);
        this.DownloadSource = button;
        return;
      }
      //
      // Uso una PREVIEW se ho il MIMETYPE ed e' uno di quelli che prevedono la preview (PDF, IMG, TXT, ...)
      if (button == "zoom" && RD3_Glb.BlobShowPreview(pv.HTMLBlobMime))
      {
        // Eseguo la preview del blob
        var m = new PopupPreview(url, RD3_ServerParams.VisualizzaDocumento, pv.HTMLBlobMime);
        m.Open();
      }
      else
        RD3_DesktopManager.OpenDocument(url, "", "");
    }
  }
  else if(button.substr(0,6) == "upload" && pv.BlobMime == "upload")
  {
    var nr = (this.ListList)? this.ParentPanel.ActualRow : 0;
    var cell = (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST) ? this.PListCells[nr] : this.PFormCell;
    //
    cell.UploadBlob();
  }
  else
  {
    var ok = true;
    if (button.substr(0,7) == "delblob")
    {
      this.DoHighlightDelete(true);
      //
      // Compongo il messaggio da mostrare
      var msg = RD3_Glb.FormatMessage(ClientMessages.PAN_MSG_ConfirmDeleteBLOB, this.Header);
      //
      // Creo una confirm ed imposto la CallBack
      this.MessageConfirm = new MessageBox(msg, RD3_Glb.MSG_CONFIRM, false);
      this.MessageConfirm.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnDelBlobConfirm', ev, '"+ button +"')");    
      this.MessageConfirm.Open();
      ok = false;
    }
    //
    // Cliccato sul pulsante di caricamento di un BLOB HTML5: rimando il click all'input nascosto
    if (button.substr(0,6) == "upload" && this.UseHTML5ForUpload())
    {
      if (button.indexOf("list")!=-1)
      {
        this.ListFlashUploader.value = "";
        this.ListFlashUploader.click();
      }
      else
      {
        this.FormFlashUploader.value = "";
        this.FormFlashUploader.click();
      }
      //
      // In questa fase non devo fare nulla: il click fa aprire la scelta del file
      ok = false;
    }
    //
    if (ok)
    {
      // Vediamo se questo comando e' bloccante
      var blk = 0;
      if (button=="zoom") blk = (this.ParentPanel.BlockingCommands & RD3_Glb.PCM_BLOBSAVEAS);
      else if (button.substr(0,6) == "upload") blk = (this.ParentPanel.BlockingCommands & RD3_Glb.PCM_BLOBEDIT);
      else if (button.substr(0,7) == "delblob") blk = (this.ParentPanel.BlockingCommands & RD3_Glb.PCM_BLOBDELETE);
      //
      var ev = new IDEvent("pantb", this.ParentPanel.Identifier, evento, this.ParentPanel.ToolbarEventDef|(blk ? RD3_Glb.EVENT_BLOCKING : 0), button);
    }
    //
    // Nessuna gestione locale per upload e delete blob...
  }
}


// ********************************************************************************
// Lanciato quando il testo del FCK cambia
// ********************************************************************************
PField.prototype.OnFCKSelectionChange= function(fck)
{
  var nr = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
  //
  if (this.ParentPanel.IsGrouped())
    nr = this.ParentPanel.GetRowIndex(this.ParentPanel.ActualRow);
  //
  try
  {
    var ed = fck.editor ? fck.editor : fck;
    //
    var uncommitted = false;
    var hcell = (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.PListCells ? this.PListCells[0] : this.PFormCell);
    if (hcell && hcell.ControlType == 101)
        uncommitted = (hcell.Text != ed.getData());
    //
    if (ed && ed.checkDirty && ed.checkDirty() || uncommitted)
    {
      var s = ed.getData();
      //
      if (this.PValues[nr].Text != s && this.FCKTimerID==0)
      {
        this.OnChange(ed,this.ParentPanel.ActualRow);
      }  
      //
      ed.resetDirty();
    }
  }
  catch (ex)
  {}
}


// *******************************************************************
// Funzione Callback chiamata dopo la pressione di uno dei pulsanti
// della confirm per cancellare un blob
// *******************************************************************
PField.prototype.OnDelBlobConfirm = function(ev, button)
{
  if (this.MessageConfirm)
  {
    this.DoHighlightDelete(false);
    //
    // Se l'utente ha dato l'ok mando il delblob
    if (this.MessageConfirm.UserResponse == "Y")
      var ev = new IDEvent("pantb", this.ParentPanel.Identifier, ev, this.ParentPanel.ToolbarEventDef, button);
    //
    // Elimino il riferimento alla confirm
    this.MessageConfirm = null;
  }
}


// ***********************************************************
// Torna true se il campo e' allineato a dx per default
// ***********************************************************
PField.prototype.IsRightAligned = function()
{
  // Se ho un VS che dice "RIGHT" allora e' si'
  var al = (this.Alignment != -1 ? this.Alignment : this.VisualStyle.GetAlignment(1)); // VISALI_VALUE
  if (al==4)  // VISALN_DX
    return true;
  //
  // Se non e' numerico, non allineo a dx
  if (!RD3_Glb.IsNumericObject(this.DataType))
    return false;
  //
  // Se ha una lista valori
  if (this.ValueList)
  {
    // Solo se il tipo di controllo non e' EDIT. Se e' EDIT, infatti,
    // decide il valore e non il fatto che ci sia la lista valori!
    var vs = this.VisualStyle;
    if (!vs || vs.GetContrType()!=2) // VISCTRL_EDIT
      return false;
  }
  //
  // Oppure se e' di tipo autolookup non si allinea
  if (this.AutoLookup)
    return false;
  //
  // Se ho un VS che dice qualcosa di diverso da AUTO, allora e' no
  if (al!=1)  // VISALN_AUTO
    return false;
  //
  return true;
}


// **********************************************************************
// Torna true se il campo puo' avere il fuoco (sulla riga nr)
// **********************************************************************
PField.prototype.CanHaveFocus= function(nr)
{
  // Un campo statico non puo' prendere il fuoco, ma se e' un pulsante si
  if (this.IsStatic())
    return this.IsButton() && (this.ActivableDisabled || this.IsEnabled());
  //
  // Prelevo il visual style della riga nr
  if (nr==undefined)
    nr = this.ParentPanel.ActualRow;
  var np = nr + this.ParentPanel.ActualPosition;
  //
  if (this.ParentPanel.IsGrouped())
    np = this.ParentPanel.GetRowIndex(nr);
  //
  var en = this.Enabled;
  //
  // Recupero la cella
  var cell = this.GetCurrentCell(nr);
  //
  // Vediamo i vari casi
  var ct = -1;
  if (cell) 
  {
    ct = cell.ControlType;
    if (ct == 6) // VISCTRL_BUTTON
      en = cell.IsEnabled;
  }
  //
  // Se il campo e' disabilitato ed il pannello non e' in QBE non devo avere il fuoco
  if (!en && this.ParentPanel.Status != RD3_Glb.PS_QBE)
    return false;
  //
  // Se la colonna e' invisibile non devo avere il fuoco
  if (!this.IsVisible())
    return false;
  //
  var vs = this.VisualStyle;
  if (this.PValues[np] && !(this.PValues[np] instanceof PListGroup))
  {
    en = this.PValues[np].IsEnabled();
    vs = this.PValues[np].GetVisualStyle();
    //
    // Se la cella e' invisibile non devo avere il fuoco
    if (!this.PValues[np].IsVisible())
      return false;
  }
  //
  switch (ct)
  {
    case 2: // VISCTRL_EDIT
      if (!en && (this.VisHyperLink(vs) || this.EditorType!=0 || vs.ShowHTML() || (this.PValues[np] && this.PValues[np].ShowHTML())))
        return false;
      break;
    
    case 30: // VISCTRL_COMBO
      if ((RD3_Glb.IsSafari() || RD3_Glb.IsChrome()) && !(cell.IsFluidCell() && en)) // In WebKit le combo disabilitate non possono essere fuocate
        return false;
      break;
        
    case 4: // VISCTRL_CHECK
      return (!en && this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST) || en; // I check box disabilitati non possono essere fuocati (in lista lo lasciamo fare, in modo da permettere la navigazione)
      
    case 5: // VISCTRL_OPTION
      return en; // I radio button disabilitati non possono essere fuocati
      
    case 6: // VISCTRL_BUTTON
      return cell.IsEnabled;
      
    case 8: // VISCTRL_CUSTOM
      return cell.IntCtrl.CanHaveFocus();
      
    case 10: // VISCTRL_BLOB
      if (RD3_Glb.IsSafari() || this.ParentPanel.Status == RD3_Glb.PS_QBE || RD3_Glb.IsChrome()) // In safari gli span e le img non prendono il fuoco (anche i BLOB vuoti a causa QBE.. e poi su IE va in crash..)
        return false;
      break;
        
    case 101: // VISCTRL_FCK
      return (en && RD3_ServerParams.UseIDEditor); // non includo il campo FCK nella lista dei fuocabili per ora...        
    
    case -1:
        // Nessuna cella in quello che e' un campo non statico... forse non sono state ancora renderizzate.. comunque non lo posso fuocare
        return false;
      break;
  }
  //
  return true;
}


// ********************************************************************************
// Ridimensiona i campi in form
// ********************************************************************************
PField.prototype.ResizeForm = function(dw, dh, ex, ey)
{ 
  var oldl = this.Formleft;
  var oldt = this.FormTop;
  var oldw = this.FormWidth;
  var oldh = this.FormHeight;
  var FormHResMode = this.FormHResMode;
  var FormVResMode = this.FormVResMode;
  //
  // Per cominciare controllo se qualche dimensione e' in percentuale
  if (this.PosDimPerc)
  {
    if (dw && this.PosDimPerc[RD3_Glb.PFLPOS_FXPPERC] != -1)
    {
      if (!this.HdrForm && !this.HdrFormAbove)
        this.SetFormLeft(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLPOS_FXPPERC] / 100) + (this.FormHeaderSize+4));
      else
        this.SetFormLeft(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLPOS_FXPPERC] / 100));
      if (FormHResMode==RD3_Glb.RESMODE_MOVE)
        FormHResMode = RD3_Glb.FRESMODE_NONE;
    }
    if (dw && this.PosDimPerc[RD3_Glb.PFLDIM_FWIDTHPERC] != -1)
    {
      if (!this.HdrForm && !this.HdrFormAbove)
        this.SetFormWidth(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLDIM_FWIDTHPERC] / 100) - (this.FormHeaderSize+4));
      else
        this.SetFormWidth(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLDIM_FWIDTHPERC] / 100));
      if (FormHResMode==RD3_Glb.RESMODE_STRETCH)
        FormHResMode = RD3_Glb.FRESMODE_NONE;
      //
      // Ho ricalcolato la larghezza in percentuale, devo ricalcolare il delta da applicare
      dw = this.FormWidth - oldw;
    }
    if (dw && this.PosDimPerc[RD3_Glb.PFLDIM_FHEADERPERC] != -1)
    {
      this.SetFormHeaderSize(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLDIM_FHEADERPERC] / 100));
      if (FormHResMode==RD3_Glb.RESMODE_STRETCH)
        FormHResMode = RD3_Glb.FRESMODE_NONE;
    }
    //
    if (dh && this.PosDimPerc[RD3_Glb.PFLPOS_FYPPERC] != -1) 
    {
      if (!this.HdrForm || this.HdrFormAbove)
        this.SetFormTop(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLPOS_FYPPERC] / 100) + (this.FormHeaderSize+4));
      else
        this.SetFormTop(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLPOS_FYPPERC] / 100));
      if (FormVResMode==RD3_Glb.RESMODE_MOVE)
        FormVResMode = RD3_Glb.FRESMODE_NONE;
    }
    if (dh && this.PosDimPerc[RD3_Glb.PFLDIM_FHEIGHTPERC] != -1)
    {
      if (!this.HdrForm || this.HdrFormAbove)
        this.SetFormHeight(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLDIM_FHEIGHTPERC] / 100) - (this.FormHeaderSize+4));
      else
        this.SetFormHeight(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLDIM_FHEIGHTPERC] / 100));
      if (FormVResMode==RD3_Glb.RESMODE_STRETCH)
        FormVResMode = RD3_Glb.FRESMODE_NONE;
      //
      // Ho ricalcolato la larghezza in percentuale, devo ricalcolare il delta da applicare
      dh = this.FormHeight - oldh;
    }
  }
  //
  if (FormHResMode==RD3_Glb.RESMODE_STRETCH)
  {
    // In questo caso voglio calcolare l'aspect ratio della caption, se essa e' a sx
    if (!this.IsStatic() && !this.HdrFormAbove && this.HdrForm && RD3_Glb.IsSmartPhone())
    {
      if (this.OrgFormHeaderSize==undefined)
        this.OrgFormHeaderSize = this.FormHeaderSize;
      //
      var asorg = (this.OrgFormHeaderSize+0.0)/this.OrgFormWidth;
      //
      // quindi il dw deve essere spartito, fra la caption e il campo
      var dwh = Math.floor(dw*asorg);
      var newfh = this.FormHeaderSize+dwh;
      if (dwh<0 && newfh<80 && this.OrgFormHeaderSize>80)
      {
        newfh = 80;
        dwh = this.FormHeaderSize-newfh;
      }
      //
      this.SetFormHeaderSize(newfh);
    }
    //
    var neww = this.FormWidth+dw;
    var minw = ex?this.OrgFormWidth:48;
    if (dw<0 && neww<minw)
      neww = minw;    
    //
    this.SetFormWidth(neww);
  }
  //
  if (FormHResMode==RD3_Glb.RESMODE_MOVE)
    this.SetFormLeft(this.FormLeft+dw);
  //
  if (FormVResMode==RD3_Glb.RESMODE_STRETCH)
  {
    var newh = this.FormHeight+dh;
    var minh = ey?this.OrgFormHeight:48;
    if (dh<0 && newh<minh)
      newh = minh;
    //
    // Se la videata e' in estendi devo ricalcolare il delta tenendo conto della dimensione minima,
    // infatti se sono sceso sotto la minima il mio contenuto non si deve ridimensionare di tutto il delta ma solo di una parte
    if (ey)
      dh = newh - this.FormHeight;
    //
    this.SetFormHeight(newh);
  }
  //
  if (FormVResMode==RD3_Glb.RESMODE_MOVE)
    this.SetFormTop(this.FormTop+dh);
  //
  if (this.FormLeft!=oldl || this.FormTop!=oldt || this.FormWidth!=oldw || this.FormHeight!=oldh)  
    var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "form", this.FormWidth, this.FormHeight, this.FormLeft, this.FormTop);
  //
  // Effettuo ridimensionamento SUB-FRAME
  if (this.SubFrame && this.SubFrame.Realized)
  {
    // Annullo i delta se non sono stretch o percentuale
    if (FormHResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_FWIDTHPERC] == -1))
      dw = 0;
    if (FormVResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_FHEIGHTPERC] == -1))
      dh = 0;
    //
    if (dw!=0 || dh!=0)
    {
      this.SubFrame.Width = this.FormWidth;
      this.SubFrame.Height = this.FormHeight;
      this.SubFrame.DeltaW = dw;
      this.SubFrame.DeltaH = dh;
      this.SubFrame.SendResize = true;
    }
  }
  else
  {
    // Mi ricordo di aver saltato questo resize..
    this.FormResizeSkipped = true;
    //
    // Sommo il delta di questo resize al delta totale
    // Annullo i delta se non sono stretch o percentuale
    if (FormHResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_FWIDTHPERC] == -1))
      dw = 0;
    if (FormVResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_FHEIGHTPERC] == -1))
      dh = 0;
    //
    this.FormDeltaH += dh;
    this.FormDeltaW += dw;
  }
}


// ********************************************************************************
// Ridimensiona i campi in list
// ********************************************************************************
PField.prototype.ResizeList= function(dw, dh, ex, ey)
{ 
  var oldl = this.ListLeft;
  var oldt = this.ListTop;
  var oldw = this.ListWidth;
  var oldh = this.ListHeight;
  var ListHResMode = this.ListHResMode;
  var ListVResMode = this.ListVResMode;
  //
  // Per cominciare controllo se qualche dimensione e' in percentuale
  if (this.PosDimPerc)
  {
    if (dw && this.PosDimPerc[RD3_Glb.PFLPOS_LXPPERC] != -1)
    {
      if (!this.HdrList && !this.HdrListAbove)
        this.SetListLeft(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLPOS_LXPPERC] / 100) + (this.ListHeaderSize+4));
      else
        this.SetListLeft(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLPOS_LXPPERC] / 100));
      if (ListHResMode==RD3_Glb.RESMODE_MOVE)
        ListHResMode = RD3_Glb.FRESMODE_NONE;
    }
    if (dw && this.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC] != -1)
    {
      var maxw = (this.ListList ? this.ParentPanel.ListWidth : this.ParentPanel.Width);
      if (!this.HdrList && !this.HdrListAbove)
        this.SetListWidth(Math.floor(maxw * this.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC] / 100) - (this.ListHeaderSize+4));
      else
        this.SetListWidth(Math.floor(maxw * this.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC] / 100));
      if (ListHResMode==RD3_Glb.RESMODE_STRETCH)
        ListHResMode = RD3_Glb.FRESMODE_NONE;
      //
      // Ho ricalcolato la larghezza in percentuale, devo ricalcolare il delta da applicare
      dw = this.ListWidth - oldw;
    }
    if (dw && this.PosDimPerc[RD3_Glb.PFLDIM_LHEIGHTPERC] != -1)
    {
      if (!this.HdrList || this.HdrListAbove)
        this.SetListHeight(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLDIM_LHEIGHTPERC] / 100) - (this.ListHeaderSize+4));
      else
        this.SetListHeight(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLDIM_LHEIGHTPERC] / 100));
      if (ListHResMode==RD3_Glb.RESMODE_STRETCH)
        ListHResMode = RD3_Glb.FRESMODE_NONE;
    }
    //
    if (dh && this.PosDimPerc[RD3_Glb.PFLPOS_LYPPERC] != -1) 
    {
      if (!this.HdrList || this.HdrListAbove)
        this.SetListTop(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLPOS_LYPPERC] / 100) + (this.ListHeaderSize+4));
      else
        this.SetListTop(Math.floor(this.ParentPanel.Height * this.PosDimPerc[RD3_Glb.PFLPOS_LYPPERC] / 100));
      if (ListVResMode==RD3_Glb.RESMODE_MOVE)
        ListVResMode = RD3_Glb.FRESMODE_NONE;
    }
    if (dh && this.PosDimPerc[RD3_Glb.PFLDIM_LHEADERPERC] != -1)
    {
      this.SetListHeaderSize(Math.floor(this.ParentPanel.Width * this.PosDimPerc[RD3_Glb.PFLDIM_LHEADERPERC] / 100));
      if (ListVResMode==RD3_Glb.RESMODE_STRETCH)
        ListVResMode = RD3_Glb.FRESMODE_NONE;
      //
      // Ho ricalcolato la larghezza in percentuale, devo ricalcolare il delta da applicare
      dh = this.ListHeight - oldh;
    }
  }
  //
  if (ListHResMode==RD3_Glb.RESMODE_MOVE)
    this.SetListLeft(this.ListLeft+dw);
  //
  if (ListVResMode==RD3_Glb.RESMODE_MOVE)
    this.SetListTop(this.ListTop+dh);
  //
  if (ListHResMode==RD3_Glb.RESMODE_STRETCH)
  {
    var neww = this.ListWidth+dw;
    var minw = ex?this.OrgListWidth:48;
    if (dw<0 && neww<minw)
      neww = minw;
    this.SetListWidth(neww);
  }
  //
  if (ListVResMode==RD3_Glb.RESMODE_STRETCH)
  {
    var newh = this.ListHeight+dh;
    var minh = ey?this.OrgListHeight:48;
    if (dh<0 && newh<minh)
      newh = minh;
    //
    // Se la videata e' in estendi devo ricalcolare il delta tenendo conto della dimensione minima,
    // infatti se sono sceso sotto la minima il mio contenuto non si deve ridimensionare di tutto il delta ma solo di una parte
    if (ey && !this.ListList)
      dh = newh - this.ListHeight;
    //
    this.SetListHeight(newh);
  }
  //
  // Se e' cambiato qualcosa, lancio evento
  if (this.ListLeft!=oldl || this.ListTop!=oldt || this.ListWidth!=oldw || this.ListHeight!=oldh)
    var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "list", this.ListWidth, this.ListHeight, this.ListLeft, this.ListTop);
  //
  // Effettuo ridimensionamento SUB-FRAME
  if (this.SubFrame && this.SubFrame.Realized)
  {
    // Annullo i delta se non sono stretch o percentuale
    if (ListHResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC] == -1))
      dw = 0;
    if (ListVResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_LHEADERPERC] == -1))
      dh = 0;
    //
    if (dw!=0 || dh!=0)
    {
      this.SubFrame.Width = this.ListWidth;
      this.SubFrame.Height = this.ListHeight;
      this.SubFrame.DeltaW = dw;
      this.SubFrame.DeltaH = dh;
      this.SubFrame.SendResize = true;
    }
  }
  else
  {
    // Mi ricordo di aver saltato questo resize..
    this.ListResizeSkipped = true;
    //
    // Sommo il delta di questo resize al delta totale
    // Annullo i delta se non sono stretch o percentuale
    if (ListHResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC] == -1))
      dw = 0;
    if (ListVResMode != RD3_Glb.RESMODE_STRETCH && (!this.PosDimPerc || this.PosDimPerc[RD3_Glb.PFLDIM_LHEADERPERC] == -1))
      dh = 0;
    //
    this.ListDeltaH += dh;
    this.ListDeltaW += dw;
  }
}


// **********************************************************************
// Gestisco la pressione dei tasti FK a partire dal campo
// Non si puo' chiamare Handle... perche' se lo il KBManager invia
// direttamente il comando invece che mandarlo al pannello
// **********************************************************************
PField.prototype.FieldFunctionKeys = function(eve)
{
  // Se ho un comando collegato, vedo se il tasto e' per lui
  var ok = false;
  //
  if (this.Command && this.IsEnabled() && this.IsVisible())
  {
    var old = this.Command.IsMenu;
    this.Command.IsMenu = true;
    ok = this.Command.HandleFunctionKeys(eve, -1, -1);
    this.Command.IsMenu = old;
  }
  //
  return ok;
}


// **********************************************************************
// Ritorna il frame che contiene il campo
// **********************************************************************
PField.prototype.GetParentFrame = function()
{
  return this.ParentPanel;
}


// ********************************************************************************
// Gestore evento di click su attivatore
// ********************************************************************************
PField.prototype.OnClickActivator= function(evento)
{ 
  if (window.event && evento==undefined)
   evento = window.event;
  //
  var actClick = false;
  var srcobj = (window.event)?evento.srcElement:evento.explicitOriginalTarget;
  //
  // A volte se tocco la caption in form e' come cliccare sul campo in se
  if (RD3_Glb.IsMobile() && srcobj==this.FormCaptionBox && this.PFormCell)
  {
    srcobj = this.PFormCell.IntCtrl.ComboInput?this.PFormCell.IntCtrl.ComboInput:this.PFormCell.IntCtrl;
  }
  //
  // Il campo di input e' il nodo precedente all'attivatore
  if (srcobj && srcobj.className && srcobj.className.indexOf("-activator")!=-1)
  {
    if (!srcobj.previousSibling && srcobj.className.indexOf("fluid-activator") != -1)
      srcobj = srcobj.parentNode;
    else
      srcobj = srcobj.previousSibling;
    //
    actClick = true;
  }
  if (srcobj && srcobj.className=="combo-img")  // Click su immagine di combo disabilitate
    srcobj = srcobj.parentNode;
  //
  var cell = RD3_KBManager.GetCell(srcobj);
  //
  if (cell && cell.ListQBECell) 
  {
    if (this.ParentPanel.Status == RD3_Glb.PS_DATA && !this.ParentPanel.DOModified)
    {
      // Apro il popup di filtro
      var popup = new PopupFilter(this);
      var intObj = cell.ControlType == 3 ? cell.IntCtrl.ComboInput : cell.IntCtrl ;
      popup.SetTop(RD3_Glb.GetScreenTop(intObj, true) + intObj.offsetHeight);
      popup.SetLeft(RD3_Glb.GetScreenLeft(intObj, true));
      //
      if (RD3_Glb.IsIE()) 
      {
        // IE sfasa il body se deve scrollare a destra, in questa fase 
        // uso la larghezza di default e provo a gestirlo prima..
        // poi se serve viene riposizionato anche dopo
        if (popup.Left + 400 > document.body.offsetWidth)
          popup.SetLeft(document.body.offsetWidth - 400 - 10);
      }
      //
      popup.Open();
    }
    return true;
  }
  //
  // Verifica abilitazione...
  var en = cell.IsEnabled;
  //
  // Il click non deve essere gestito come attivatore...
  if (!en && !this.ActivableDisabled)
    return true;
  //
  // Se e' su una riga diversa, gestisco subito il cambio riga
  // ATTN: senza queste righe safari e chrome vanno in errore perche'
  // non accettano il cambio di riga mentre c'e' la combo QVS aperta
  this.GotFocus(srcobj,evento);
  //
  // Non voglio che torni il fuoco al campo altrimenti si apre la tastiera
  if (RD3_Glb.IsMobile())
  {  
    RD3_KBManager.ActiveObject = null;
    RD3_KBManager.ActiveElement = null;
    RD3_KBManager.DontCheckFocus = true;
  }
  else
   RD3_KBManager.ActiveElement = srcobj;
  //
  if (this.ListFormCell && this.InList && this.ListList && this.ParentPanel.IsFluidPanel() && cell.InList && cell.PValue && cell.PValue.IsEnabled()) 
  {
    // Ho cliccato l'attivatore di una cella in lista fluida, devo apettare che compaia la cella reale e poi cliccare il suo attivatore..
    RD3_KBManager.ActiveElement = this.ListFormCell.GetDOMObj();
    var t = this.OnClickActivator({ srcElement: this.ListFormCell.GetDOMObj(), explicitOriginalTarget: this.ListFormCell.GetDOMObj() });
    if (!t && evento)
      evento.stopPropagation();
    return t;
  }
  //
  // Vediamo se e' un campo data
  var dt = this.DataType;
  //
  // Se il campo e' data ed e' abilitato apro il calendario, altrimenti procedo con il click
  if ((dt == 6 || dt==7 || dt==8) && en && !this.CanActivate)
  {
    // La cella sta attualmente mostrando un watermak, lo devo togliere prima di aprire il calendario altrimenti il sistema di Mascheratura
    // non e' in grado di gestire una stringa arbitraria 
    if (cell.HasWatermark) 
      cell.RemoveWatermark();
    //
    // Devo aprire il calendario
    var msk = (cell.Mask!="" ? cell.Mask : this.Mask);
    ShowCalendar(cell.IntCtrl, msk);
    //
    // Per ora il click arriva comunque al wep, quindi correggo cosi'... ma solo nel caso di click sull'attivatore (potrei essere arrivato qui premendo F2..)
    if (actClick)
    {
      RD3_DesktopManager.WebEntryPoint.CalPopup.setAttribute("idjustopened", "1");
      //
      // Su !IE il fuoco si perde.. lo rimettiamo in modo da poter gestire i tasti di navigazione correttamente..
      if (!RD3_Glb.IsIE())
        srcobj.focus();
    }
    //
    // Non faccio passare l'evento al body, se no chiude il calendario
    return false;
  }
  //
  // Se la cella e' una combo allora faccio click sul suo attivatore, in modo che possa gestire correttamente il tutto
  // (apertura combo compresa)
  if (cell && cell.ControlType == 3 && cell.IntCtrl)
  {
    cell.IntCtrl.OnClickActivator();
    return;
  }
  //
  // Prelevo il PValue legato all'oggetto sorgente
  var obj = RD3_KBManager.GetObject(srcobj, true);
  //
  // Invio al server l'evento di click sull'attivatore (click sul pvalue)
  if (obj)
    new IDEvent("clk", obj.Identifier, evento, this.ClickEventDef);
  //
  // Lato client non posso fare nulla...  
}


// **********************************************************************
// Fatto right click su questo campo?
// **********************************************************************
PField.prototype.OnRightClick = function(eve)
{
  if (this.ParentPanel.ActivateRightClick)
  {
    this.OnClickActivator(eve);
  }
}


// ********************************************************************************
// Ritorna l'oggetto principale del DOM
// ********************************************************************************
PField.prototype.GetDOMObj= function(type)
{ 
  // Prelevo il mio div, arrivo qui solo per un campo statico, per un altro campo vado direttamente al valore
  if (!this.IsStatic())
    return null;
  //
  var panp = this.ParentPanel;
  //
  if (panp.PanelMode == RD3_Glb.PANEL_FORM)
  {
    return this.FormCaptionBox;
  }
  else
  {
    return this.ListCaptionBox;
  }
}


// ********************************************************************************
// Gestore evento di mouse over su uno degli oggetti di questo campo
// ********************************************************************************
PField.prototype.OnMouseOverObj= function(evento, obj)
{ 
  // Se il mouse e' sulla caption in form di un campo statico ne effettuo l'hilight se necessario
  if (this.IsStatic() && obj == this.FormCaptionBox && this.UseHL)
  {
    this.FormCaptionBox.style.backgroundPosition = "0px -" + this.FormCaptionBox.offsetHeight + "px";
  }
  //
  // Se il mouse e' sulla caption in lista di un campo statico ne effettuo l'hilight se necessario
  if (this.IsStatic() && obj == this.ListCaptionBox && this.UseHL)
  {
    this.ListCaptionBox.style.backgroundPosition = "0px -" + this.ListCaptionBox.offsetHeight + "px";
  }
}


// ********************************************************************************
// Gestore evento di mouse out su uno degli oggetti di questo campo
// ********************************************************************************
PField.prototype.OnMouseOutObj= function(evento, obj)
{ 
  // Se il mouse era sulla caption di un campo statico ne tolgo l'hilight se necessario
  if (this.IsStatic() && obj == this.FormCaptionBox && this.UseHL)
  {
    this.FormCaptionBox.style.backgroundPosition = "";
  }
  //
  // Se il mouse e' sulla caption in lista di un campo statico ne effettuo l'hilight se necessario
  if (this.IsStatic() && obj == this.ListCaptionBox && this.UseHL)
  {
    this.ListCaptionBox.style.backgroundPosition = "";
  }
}


// ********************************************************************************
// Gestore evento di mouse down su uno degli oggetti di questo campo
// ********************************************************************************
PField.prototype.OnMouseDownObj= function(evento, obj)
{ 
  // Se il mouse e' sulla caption di un campo statico ne effettuo l'animazione
  if (this.IsStatic() && obj == this.FormCaptionBox && this.UseHL)
  {
    this.FormCaptionBox.style.backgroundPosition = "0px -" + this.FormCaptionBox.offsetHeight*2 + "px";
  }
  //
  // Se il mouse e' sulla caption in lista di un campo statico ne effettuo l'hilight se necessario
  if (this.IsStatic() && obj == this.ListCaptionBox && this.UseHL)
  {
    this.ListCaptionBox.style.backgroundPosition = "0px -" + this.ListCaptionBox.offsetHeight*2 + "px";
  }
  //
  // Se sono su una cella, giro il MouseDown alla cella
  var cell = this.GetCurrentCell(0, obj);
  if (cell)
    cell.OnMouseDownObj(evento, obj);
}

// *******************************************************
// Metodo che estrae eventuali script dal testo e li esegue
// (compatibilita' con RD-RD2)
// *******************************************************
PField.prototype.RunJScript = function(html)
{
  var p1 = html.indexOf("<!--scr>");
  while (p1!=-1)
  {
    var p2 = html.indexOf("-->", p1);
    if (p2!=-1)
    {
      // Eseguo lo "script"
      window.setTimeout(html.substring(p1+8,p2), 100);
      //
      // Mi sposto alla fine dello script
      p1 = p2+3;
    }
    else
    {
      // Strano... non ho trovato la fine dello script... proseguo comunque
      alert("Error while parsing static field Javascript");
    }
    //
    // Cerco il prossimo script
    p1 = html.indexOf("<!--scr>", p1);
  }
}

// ****************************************************************
// Verifica se per una determinata riga disabilitata e' possibile
// gestire il Click (chiamato da PCell)
// - nrow e' 0-based, passare PValue.Index
// ****************************************************************
PField.prototype.IsCellClickable = function(nrow, vs)
{
  var en = this.IsEnabled(nrow+1);
  //
  if (!en && !this.ActivableDisabled)
    return false;
  //
  if (this.VisHyperLink(vs))
    return true;
  //
  if (this.CanActivate)
    return true;
  //
  return false;
}

// ****************************************************************
// Verifica se per una determinata riga disabilitata e' possibile
// gestire il Click sulla combo disabilitata (chiamato da PCell)
// ****************************************************************
PField.prototype.IsComboClickable = function(nrow, vs)
{
  var en = this.IsEnabled(nrow);
  //
  if (!en && !this.ActivableDisabled)
    return false;
  //
  if (this.VisHyperLink(vs) && this.CanActivate)
    return true;
  //
  return false;
}

// ****************************************************************
// Restituisce la cella corrente
// ****************************************************************
PField.prototype.GetCurrentCell = function(nr, srcobj)
{
  // Se mi hanno dato un oggetto del DOM, provo a cercare la cella che lo possiede
  if (srcobj)
  {
    while (srcobj && (srcobj.className == "panel-value-activator" || srcobj.className == "combo-img" || srcobj.className == "combo-activator"))
      srcobj = srcobj.previousSibling;
    //
    while (srcobj && !srcobj.id)
      srcobj = srcobj.parentNode;
    //
    // Se non c'e' un padre con ID... lascio perdere!
    if (!srcobj)
      return null;
    //  
    // Se l'ID e' di una cella in lista, estraggo il numero di riga dall'ID e torno la cella giusta
    // Se l'ID e' di una cella in form, torno la cella in form
    var srcid = srcobj.id;
    if (srcid.indexOf(":lv") != -1)
    {
      nr = parseInt(srcid.substring(srcid.indexOf(":lv")+3), 10);
      return this.PListCells[nr];
    }
    else if (srcid.indexOf(":fv") != -1)
      return this.PFormCell;
    else if (srcid.indexOf(":gv") != -1 && this.ListFormCell)
      return this.ListFormCell;
    else if (srcid.indexOf(":qv") != -1)
      return this.PQBECell;
    //
    // Nessuna cella!
    return null;
  }
  //
  // Niente... Restituisco la cella della riga richiesta (se fornita) o della riga attiva
  if (nr==undefined)
    nr = this.ParentPanel.ActualRow;
  //
  // Recupero la mia cella
  var cell = null;
  if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.InList)
  {
    // Se la riga attiva e' fuori dal buffer video, non va bene...
    if (nr < 0 || nr >= this.ParentPanel.NumRows)
      return null;
    //
    if (!this.PListCells)
      return null;
    if (this.ListList)
      return this.PListCells[nr];
    else
      return this.PListCells[0];
  }
  //
  if (this.ParentPanel.PanelMode == RD3_Glb.PANEL_FORM && this.InForm)
  {
    return this.PFormCell;
  }
  //
  return null;
}

// *******************************************************************************
// Metodo per aggiornare in maniera ritardata questa colonna (in list dentro alla lista)
// *******************************************************************************
PField.prototype.HandleDelayedUpdate = function()
{
  // Rimuovo il ListBox dal DOM... e lo rimetto alla fine cosi' faccio prima
  var oldpar = this.ListBox.parentNode;
  var oldsib = this.ListBox.nextSibling;
  var removeFromDOM = RD3_Glb.IsIE(10, false) && !RD3_Glb.IsIE(6);
  if (removeFromDOM)
    this.ListBox.parentNode.removeChild(this.ListBox);
  //
  // Creo le celle necessarie a riempire il pannello e le posiziono al posto giusto
  var act = this.ParentPanel.ActualPosition;
  var ry = 0 + this.ParentPanel.GetHeaderSearchOffset();
  var rh = this.ParentPanel.GetRowHeight();
  //
  if (this.CanUseRowQBE()) 
  {
    this.PQBECell.Update(this.PQBECell.PValue, this.ListBox);
    this.PQBECell.UpdateDims(0, 0);
  }
  //
  for (var i = 0; i<this.PListCells.length; i++)
  {
    // Questo e' il valore associato alla cella
    var v = this.PValues[i+act];
    //
    // Se il pannello in lista e' gruppato allora cerco il PValue in maniera corretta
    if (this.ParentPanel.IsGrouped())
    {
      var idx = this.ParentPanel.GetRowIndex(i, RD3_Glb.PANEL_LIST);
      //
      v = this.PValues[idx];
    }
    //
    // Recupero la cella
    var pcell = this.PListCells[i];
    if (!pcell)
    {
      // La cella non c'e' ancora... la creo
      pcell = new PCell(this, true);
      this.PListCells[i] = pcell;
    }
    //
    // La inizializzo fornendole il valore (a cui si attacca) e il container degli oggetti DOM
    pcell.Update(v, this.ListBox);
    //
    // Posiziono la cella
    pcell.UpdateDims(0, ry);
    //
    // Aggiorno la visiblilta'
    pcell.SetVisible(v ? v.IsVisible() : this.IsVisible());
    //
    // Aggiorno l'immagine
    if (this.Image != "")
    {
      var url = this.Image;
      if (!RD3_Glb.IsAbsoluteUrl(this.Image))
        url = RD3_Glb.GetAbsolutePath() + "images/" + this.Image;
      //
      pcell.SetBackGroundImage("url(" + encodeURI(url) + ")");
    }
    else
      pcell.SetBackGroundImage("");
    //
    // Prossima riga
    ry += rh;
  }
  //
  // Ora rimetto la colonna nel DOM
  if (removeFromDOM)
  {
    if (oldsib)
      oldpar.insertBefore(this.ListBox, oldsib);
    else
      oldpar.appendChild(this.ListBox);
  }
  //
  // Questo campo e' fatto
  this.DelayedUpdate = false;
}

// *******************************************************************************
// Ritorna TRUE se la colonna non e' mostrata all'utente (invisibile o in zona scrollata)
// *******************************************************************************
PField.prototype.IsHidden = function()
{
  if (!this.IsVisible())
    return true;
  //
  var pp = this.ParentPanel;
  //
  // Questo controllo non ci interessa per i pannelli fluidi
  if (pp.IsFluidPanel())
    return false;
  //
  // Se il ListBox e' fuori dal DOM non posso fare calcoli: per quello che ne so sono visibile all'utente..
  if (!pp.ListBox || !pp.ListBox.parentNode)
    return false;
  //
  // Mi interessa solo il layout LIST
  if (pp.PanelMode != RD3_Glb.PANEL_LIST)
    return false;
  //
  // Se il pannello e' contenuto in una tabbed ed il pannello non ha ancora una larghezza, 
  // prendo quella della tabbed... puo' capitare a causa dell'animazione che "spinge" il
  // realize durante l'apertura della tabbed
  var panw = pp.Width;
  if (pp.ParentTab && pp.ParentFrame && panw==0)
    panw = pp.ParentFrame.Width;
  //
  // Se il pannello e la form si ridimensionano... meglio prendere
  // la larghezza della form se e' superiore a quella del pannello
  if (pp.HResMode==3 && pp.WebForm.ResModeW!=1) // RD3_Glb.RESMODE_STRETCH && RD3_Glb.FRESMODE_STRETCH
  {
    var frmwidth = (pp.WebForm.Modal>0 ? pp.WebForm.FormWidth : RD3_DesktopManager.WebEntryPoint.FormsBox.clientWidth);
    if (frmwidth > panw)
      panw = frmwidth;
  }
  //
  // Entro se il pannello e' piu' largo del frame
  var listLeft = this.PGroupListLeft ? this.PGroupListLeft : this.ListLeft;
  if (pp.ListWidth > panw)
  {
    // Ci sono scrollbar. Vediamo se sono in una zona nascosta
    var pleft = pp.ListBox.parentNode.scrollLeft;
    if (listLeft > pleft + panw)                   // Nascosto a destra
      return true;
    else if (listLeft + this.ListWidth < pleft)    // Nascosto a sinistra
      return true;
  }
  else if (pp.FixedColumns>0 && pp.ScrollAreaBox && this.ListBox && this.ListBox.parentNode==pp.ScrollAreaBox)
  {
    // Se il pannello ha le fixed columns ed io sono nella zona scrollabile
    var pscrleft = pp.ScrollAreaBox.scrollLeft;
    if (listLeft > pscrleft + panw)                   // Nascosto a destra
      return true;
    else if (listLeft + this.ListWidth < pscrleft)    // Nascosto a sinistra
      return true;
  }
  //
  return false;
}


PField.prototype.UseHTML5ForUpload = function()
{
  if (RD3_Glb.IsMobile())
    return false;
  //
  // Verifico se devo usare HTML5 ed e' supportato
  var htmlok = RD3_ServerParams.UseHTML5Upload && typeof FileReader != "undefined";
  //
  // Controllo che il campo sia attivo
  if (this.DataType==10 && this.ChangeEventDef != RD3_Glb.EVENT_ACTIVE)
    htmlok = false;
  //
  return htmlok;
}

// *****************************************************************
// Renderizzo un campo MultiUpload
// *****************************************************************
PField.prototype.RenderMultiUpload = function()
{
  // Se il campo si renderizza in entrambi i layout, prendo quello attivo al momento
  // Altrimenti prendo quel che c'e'...
  var parentContext = this;
  var obj = null;
  if (this.InList && this.InForm)
    obj = (this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST ? this.ListCaptionBox : this.FormCaptionBox);
  else
    obj = (this.InList ? this.ListCaptionBox : this.FormCaptionBox);
  //
  if (!obj)
    return;
  //
  // Se e' un dispositivo touch, allora uso picup ed esco
  if (RD3_Glb.IsTouch())
  {
    var uploadUrl = window.location.href;
    uploadUrl += "?WCI=IWFiles";
    uploadUrl += "&WCE=" + this.Identifier;
    uploadUrl += "&SESSIONID=" + RD3_DesktopManager.WebEntryPoint.SessionID;
    //
    var cbUrl = window.location.href.substring(0,window.location.href.lastIndexOf("/")+1)+"uploadcomplete.htm";
    //
    zUrl = "fileupload://new?returnstatus=false";       
    zUrl += "&posturl="+encodeURIComponent(uploadUrl);
    zUrl += "&callbackurl="+encodeURIComponent(cbUrl);
    zUrl += "&purpose="+encodeURIComponent("Scegli una foto da caricare");
    zUrl += "&referrerName="+encodeURIComponent(RD3_DesktopManager.WebEntryPoint.MainCaption);
    //
    this.MUPHeader = document.createElement("a");
    this.MUPHeader.href = zUrl;
    this.MUPHeader.innerHTML = this.Caption;
    obj.appendChild(this.MUPHeader);
    RD3_Glb.AddClass(obj,"mup-header-button");
    return;
  }
  //
  if (!this.FormFlashUploader)
  {
    this.FormFlashUploader = this.CreateHTML5Uploader(false);
    var idUploader = this.Identifier + ":jsuf";
    document.body.appendChild(this.FormFlashUploader);
    RD3_Glb.AddClass(obj, "multi-js-upload");
    this.VisualStyle.ApplyMUPStyle(obj, true);
    //
    //var ck = new Function("ev","document.getElementById('"+idUploader+"').click();");
    var ck = function(ev) { parentContext.OnHTML5UploadClick(ev, idUploader); };
    var drp = function(ev) { parentContext.OnHTML5Drop(ev); };
    var drg = function(ev) { parentContext.OnHTML5Drag(ev); };
    //
    if (obj.addEventListener)
    {
      obj.addEventListener("click", ck, true);
      obj.addEventListener("drop", drp, true);
      obj.addEventListener("dragover", drg, true);
    }
    else
    {
      obj.attachEvent("onclick",ck);
      obj.attachEvent("ondrop",drp);
      obj.addEventListener("ondragover", drg);
    }
  }
  //
  if (!this.ReqList)
    this.ReqList = new HashTable();
  //
  this.MUPHeader = document.createElement("span");
  this.MUPHeader.style.cursor = "pointer";
  obj.appendChild(this.MUPHeader);
  //
  this.FileList = document.createElement("table");
  this.FileList.className = "mup-table";
  this.FileList.FileItems = new HashTable(true);
  obj.appendChild(this.FileList);
  var tbody = document.createElement("tbody");
  this.FileList.appendChild(tbody);
}

// *********************************************
// Aggiunta di un file alla lista del multi upload
// *********************************************
PField.prototype.AddFile = function(file)
{
  var parentContext = this;
  var FileItem = document.createElement("tr");
  this.VisualStyle.ApplyMUPStyle(FileItem, false);
  //
  // Identificativo del file
  FileItem.FileID = file;
  FileItem.setAttribute("id", file+":fi");
  //
  // Bottone annulla
  var td = document.createElement("td");
  td.className = "mup-row-button";
  FileItem.appendChild(td);
  FileItem.AbortImg = document.createElement("img");
  FileItem.AbortImg.src = "images/cancel_sm.gif";
  RD3_TooltipManager.SetObjTitle(FileItem.AbortImg, ClientMessages.SWF_TP_ABORTTHIS);
  FileItem.AbortImg.style.cursor = "pointer";
  FileItem.AbortImg.onclick = function(ev) { parentContext.SWFUpload_AbortUpload(ev, FileItem.FileID); };
  td.appendChild(FileItem.AbortImg);
  FileItem.AbortImg.setAttribute("id", file+":abort");
  //
  FileItem.FileStatus = document.createElement("td");
  FileItem.FileStatus.className = "mup-row-filestatus-js";
  FileItem.appendChild(FileItem.FileStatus);
  FileItem.FileStatus.setAttribute("id", file+":status");
  //
  this.FileList.childNodes[0].appendChild(FileItem);
  this.FileList.FileItems.add(FileItem.FileID, FileItem);
  //
  return FileItem;
}

// *********************************************
// Rimozione un file dalla lista del multi upload
// *********************************************
PField.prototype.RemoveFile = function(fileID)
{
  var FileItem = this.FileList.FileItems[fileID];
  this.FileList.childNodes[0].removeChild(FileItem);
  this.FileList.FileItems.remove(fileID);
}

// ****************************************************************
// Crea un HTML5 Uploader
// ****************************************************************
PField.prototype.CreateHTML5Uploader = function(list)
{
  var fileInput = document.createElement("input");
  var idUploader = this.Identifier + ":jsu" + (list ? "l" : "f");
  //
  fileInput.setAttribute("id", idUploader);
  fileInput.setAttribute("type", "file");
  fileInput.style.display = "none";
  var parentContext = this;
  fileInput.onchange = function(ev) { parentContext.OnHTML5Upload(ev, idUploader); };
  //
  if (this.MultiUpload)
    fileInput.setAttribute("multiple", "1");
  if (this.UploadExtensions != "*.*")
    fileInput.setAttribute("accept", this.UploadExtensions);
  //
  return fileInput;
}


// *******************************************************************************
// Metodo per annullare l'upload di uno o tutti i file
// evento - evento scatenante
// fileID - ID del file da annullare; se null vengono annullati tutti i file in coda
// *******************************************************************************
PField.prototype.SWFUpload_AbortUpload = function(evento, fileID)
{
  var req = this.ReqList[fileID];
  if (req)
    req.abort();
  this.HTML5UploadComplete(fileID);
  //
  RD3_Glb.StopEvent(evento);
  return false;
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
PField.prototype.GetTooltip = function(tip, obj)
{
  // Sono sulla caption in lista o in form o un figliodiretto (tema ZEN)
  if (obj == this.FormCaptionBox || obj == this.ListCaptionBox || (obj.parentNode && obj.parentNode == this.FormCaptionBox && obj.tagName=="SPAN") || (obj.parentNode && obj.parentNode == this.ListCaptionBox && obj.tagName=="SPAN"))
  {
    if (this.Tooltip == "")
      return false;
    //
    // Se non c'e' il titolo non mostro neanche l'icona perche' e' brutto
    if (this.Header == "")
      tip.SetImage("");
    else
      tip.SetTitle(this.Header);
    //
    tip.SetText(this.Tooltip);
    tip.SetAutoAnchor(true);
    tip.SetPosition(2);
    return true;
  }
  //
  // Sono su una dei bottoni della toolbar del BLOB
  var ok = false;
  if (obj == this.ListBlobUploadImg || obj == this.FormBlobUploadImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_CaricaDoc);
    tip.SetText(RD3_ServerParams.CaricaDoc);
    ok = true;
  }
  else if (obj == this.ListBlobDeleteImg || obj == this.FormBlobDeleteImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_CancellaDoc);
    tip.SetText(RD3_ServerParams.CancellaDoc);
    ok = true;
  }
  else if (obj == this.ListBlobZoomImg || obj == this.FormBlobZoomImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_VisualizzaDocumento);
    tip.SetText(RD3_ServerParams.VisualizzaDocumento);
    ok = true;
  }
  //
  if (ok)
  {
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + (obj.offsetWidth/2), RD3_Glb.GetScreenTop(obj));
    tip.SetPosition(0);
    return true;
  }
  //
  // Sono su un valore
  var cell = this.GetCurrentCell(0, obj);
  if (cell)
    return cell.GetTooltip(tip, obj);
  //
  return false;
}

// ********************************************************************************
// Funzioni per il reperimento degli stili visuali
// ********************************************************************************
PField.prototype.VisCanSort= function()
{
  return this.VisualFlags & 0x1;
}

PField.prototype.VisOnlyIcon = function()
{
  return this.VisualFlags & 0x8;
}

PField.prototype.VisShowActivator = function()
{
  return this.VisualFlags & 0x10;
}

PField.prototype.VisHyperLink = function(vs)
{
  return (this.VisualFlags & 0x80) || (vs && vs.HasHyperLink());
}

PField.prototype.VisSlidePad = function()
{
  // Il flag visuale "popup control" deve essere disabilitato
  return (this.VisualFlags & 0x40)==0 || RD3_Glb.IsSmartPhone();
}

PField.prototype.UsePopupControl = function()
{
  // Popup control vale per data, ora e numerico. Non puo' essere combo
  return (this.VisualFlags & 0x40) && !this.ValueList && (RD3_Glb.IsDateOrTimeObject(this.DataType) || RD3_Glb.IsNumericObject(this.DataType));
}

PField.prototype.AutoTab = function()
{
  return (this.VisualFlags & 0x200);
}

PField.prototype.UseWatermarkAsNull = function()
{
  return (this.VisualFlags & 0x00000400);
}

PField.prototype.HandlesTabOrder = function()
{
  return (this.VisualFlags & 0x00000800);
}

PField.prototype.CanHideInList = function () 
{
  return (this.VisualFlags & 0x00001000);
}

PField.prototype.HiddenInList = function () 
{
  return (this.VisualFlags & 0x00002000);
}

PField.prototype.GetPopupControlType = function()
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


// *******************************************************************************
// Metodo chiamato dal DDManager quando viene iniziato un D&D
// ident: id dell'oggetto su cui l'utente ha cliccato per iniziare il D&D
// *******************************************************************************
PField.prototype.IsDraggable = function (ident)
{
  // Il campo e' draggabile (riposizionabile in lista) se:
  // - il campo e' effettivamente in lista
  // - l'utente ha cliccato sulla caption della lista 
  // - il pannello permette il riordinamento della lista
  //
  // Estraggo gli ultimi tre caratteri dell'id
  var ext = (ident && ident.length>3) ? ident.substring(ident.length-3) : "";
  //
  if (this.ListList && ext == ":lc" && this.ParentPanel.CanReorderColumn)
  {
    return true;
  }
  else
  {
    // Il campo e' draggabile anche se il pannello permette il drag generico 
    // e sto tirando una cella ABILITATA
    var pc = this.DragObj(ident);    
    return this.ParentPanel.CanDrag && !pc.IsEnabled && (ident.indexOf(":lv")>0 || ident.indexOf(":fv")>0);
  }
}

// *****************************************************************************
// Restituisce l'oggetto visuale su cui deve venire applicata l'HL per il drag
// *****************************************************************************
PField.prototype.DropElement = function()
{
  return this.ListCaptionBox;
}


// **********************************************************************
// Preleva tutti gli oggetti su cui questo campo puo' essere
// droppato. Calcola anche le posizioni assolute degli elementi
// stessi
// **********************************************************************
PField.prototype.GetDropList= function()
{
  var l = new Array();
  this.ParentPanel.ComputeDropList(l, this);
  return l;  
}


// *****************************************************************************
// Evento scatenato quando si fa il drop di un oggetto su questo campo
// *****************************************************************************
PField.prototype.OnDrop = function(dragfield, ev)
{
  //if (dragfield && dragfield instanceof PField)
    this.ParentPanel.ChangeListConfiguration(dragfield, this, ev);
  return true;
}


// *******************************************************************************
// Metodo chiamato dal DDManager quando il mouse e' suno degli oggetti del PField
// ident: id dell'oggetto su cui il mouse si trova
// *******************************************************************************
PField.prototype.IsTransformable = function (ident)
{
  // Il campo e' trasformabile (ridimensionabile in lista) se:
  // - il campo e' effettivamente in lista
  // - l'utente ha il mouse sulla caption della lista 
  // - Il pannello permette il ridimensionamento della lista
  //
  // Estraggo gli ultimi tre caratteri dell'id
  var ext = (ident && ident.length>3) ? ident.substring(ident.length-3) : "";
  //
  if (this.ListList && ext == ":lc" && this.ParentPanel.CanResizeColumn)
  {
    // La lista fluida permette di ridimensionare solo le colonne fisse
    if (this.ParentPanel.IsFluidPanel())
      return this.ListHResMode == RD3_Glb.RESMODE_NONE;
    else
      return true;
  }
  else
    return false;

}

// *******************************************************************************
// La colonna puo' ridimensionarsi in larghezza
// *******************************************************************************
PField.prototype.CanResizeW = function ()
{
  return true;
}

// *******************************************************************************
// La colonna non puo' ridimensionarsi in altezza
// *******************************************************************************
PField.prototype.CanResizeH = function ()
{
  return false;
}

// *******************************************************************************
// La colonna non puo' allargarsi o restringersi a partire da sinistra
// *******************************************************************************
PField.prototype.CanResizeL = function ()
{
  return false;
}

// *******************************************************************************
// La colonna puo' allargarsi o restringersi sulla destra
// *******************************************************************************
PField.prototype.CanResizeR = function ()
{
  return true;
}

// *******************************************************************************
// Per la colonna deve essere attivo il Drag, non il Move!
// *******************************************************************************
PField.prototype.IsMoveable = function()
{
  return false;
}


// *******************************************************************************
// Mi occupo di applicare il cursore corretto alla caption della lista
// *******************************************************************************
PField.prototype.ApplyCursor = function (cn)
{
  var curs = cn;
  if (curs == "move" || curs == "")
    curs = this.CanSort ? "pointer" : "";
  //
  this.ListCaptionBox.style.cursor = curs;
}


// **********************************************************************
// Evento di ridimensionamento
// **********************************************************************
PField.prototype.OnTransform = function(x, y, w, h, evento)
{
  // La ListWidth e' la dimensione esterna, mentre quella che mi arriva e' la dimensione interna:
  // percio' devo sommarci il delta di padding e bordo prima di impostarla se no non ci capiamo
  var rc = new Rect(x, y, w, h);
  this.VisualStyle.AdaptCaptionRect(rc, true, true);
  var wid = w>rc.w ? w + (w - rc.w) : w;
  //
  // Dimensione minima 50 px
  wid = wid<50 ? 50 : Math.ceil(wid);
  //
  // Se la dimensione non e' cambiata non faccio nulla...
  if (wid == this.ListWidth)
    return;
  //
  // Creo l'evento (che si aggiunge all'elenco se deve)
  var ev = new IDEvent("rescol", this.Identifier, evento, RD3_Glb.EVENT_ACTIVE, "", wid);
  //
  // Se l'evento ha le caratteristiche per essere gestito lato client, lo faccio ora
  if (ev.ClientSide)
  {
    // Imposto la nuova larghezza
    this.SetListWidth(wid, false);
    //
    // Faccio adattare il pannello
    this.ParentPanel.AfterProcessResponse();
  }
}


// **********************************************************************
// Gestore del doppio click sulla colonna
// **********************************************************************
PField.prototype.OnDoubleClick = function(eve)
{
  // Verifico se l'oggetto su cui e' stato fatto doppio click e' l'header in lista..
  var srcobj = (window.event) ? eve.srcElement : eve.explicitOriginalTarget;
  //
  // Il doppio click e' stato fatto sul Resize Object.. succede se si fa doppio click sulla caption di una colonna
  // nell'area del resize.. in questo caso vado a prendere il MD_Target dal DDManager, che e' l'oggetto sotteso su cui avevamo cliccato
  if (srcobj.getAttribute("id")=="resize-object")
    srcobj = RD3_DDManager.MD_Target;
  //
  // Se non esiste sorgente non faccio nulla...
  if (!srcobj)
    return true;
  //
  var ident = RD3_Glb.GetRD3ObjectId(srcobj);
  var ext = (ident && ident.length>3) ? ident.substring(ident.length-3) : "";
  //
  var objpos = RD3_Glb.GetScreenLeft(srcobj) + srcobj.clientWidth;
  //
  // Se l'utente ha cliccato sull'header in lista nell'area dove compare il resize gestisco il doppio click
  // Non lo faccio se il campo e' una TextArea
  if (this.ListList && ext == ":lc" && this.ListNumRows==1 && (objpos-eve.clientX<=RD3_ClientParams.ResizeLimit) && this.ParentPanel.CanResizeColumn)
  {
    // Creo una stringa HTML con il contenuto di tutti i pvalue
    var txt = new Array();
    var n = this.PValues.length;
    var hasact = false;
    for (var i=1; i<n; i++)
    {
      var pv = this.PValues[i];
      if (pv)
      {
        txt.push("<span>");
        txt.push(pv.Text);
        txt.push("</span><br/>");
        //
        // cerco di capire se dimensionare secondo gli attivatori, lo faccio se almeno uno dei valori ha l'attivatore..
        if (!hasact && pv.ActivatorImage(pv.GetVisualStyle())!="")
          hasact=true;
      }
      else
      {
        continue;
      }
    }
    //
    // Devo calcolare la dimensione in px del testo:
    // creo al volo un div con dentro il testo nel body e ne calcolo la larghezza..
    var txtdiv = document.createElement("div");
    txtdiv.innerHTML = txt.join("");
    //
    var sty = txtdiv.style;
    sty.position = "absolute";
    sty.top = "0px";
    sty.left = "0px";
    sty.overflow = "auto";
    //
    document.body.appendChild(txtdiv);
    var w = txtdiv.clientWidth;
    document.body.removeChild(txtdiv);
    //
    // Alla larghezza devo sommare la dimensione dell'attivatore se presente
    if (hasact)
      w+= this.ActWidth+2;
    //
    this.OnTransform(this.ListLeft, this.ListTop, w, this.ListHeight, eve);
  }
  //
  return true;
}


// *********************************************************
// Qual'e' l'oggetto pcell da tirare?
// *********************************************************
PField.prototype.DragObj = function(id)
{
  // Drag delle celle?
  if (id!=undefined && (id.indexOf(":lv")>0 || id.indexOf(":fv")>0))
  {
    if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM)
    {
      return this.PFormCell;
    }
    else
    {
      var p = id.indexOf(":lv");
      var n = parseInt(id.substr(p+3));
      return this.PListCells[n];
    }
  }
  else
  {
    // drag della caption?
    return this;
  }
}


// ********************************************************************************
// Su quali celle e' possibile droppare?
// ********************************************************************************
PField.prototype.ComputeDropList = function(list,dragobj)
{
  // Se non sono stata realizzata... niente DropList
  if (!this.Realized)
    return;
  //  
  if (dragobj instanceof PField)
  {
    // Accettiamo il Drop solo se il campo e' in Lista
    if (this.ListList && this.ParentPanel.CanReorderColumn && dragobj!=this)
    {
      // Se sono un campo che non si vede (pannello con fixed-column o pannello troppo lungo)
      if (this.IsHidden())
        return;
      //
      list.push(this);
      //
      // Calcolo le coordinate assolute...
      this.AbsLeft = RD3_Glb.GetScreenLeft(this.ListCaptionBox,true);
      this.AbsTop = RD3_Glb.GetScreenTop(this.ListCaptionBox,true);
      this.AbsRight = this.AbsLeft + this.ListCaptionBox.offsetWidth - 1;
      this.AbsBottom = this.AbsTop + this.ListCaptionBox.offsetHeight - 1;
    }
    //
    return;
  }  
  //
  // Non e' nello schermo, oppure non e' ammesso
  if (!this.ParentPanel.CanDrop || this.IsHidden() || this.IsStatic())
    return;
  //
  // Chiedo alle celle
  if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM)
    this.PFormCell.ComputeDropList(list,dragobj);
  else
  {
    if (this.ListList)
    {
      var n = this.PListCells.length;
      for (var i=0; i<n; i++)
        this.PListCells[i].ComputeDropList(list,dragobj);
    }
    else
      this.PListCells[0].ComputeDropList(list,dragobj);
  }
}


// ********************************************************************************
// E' il primo campo della lista?
// ********************************************************************************
PField.prototype.IsFirstListList = function()
{
  // Se non sono in lista e list list non sono di sicuro il primo campo della lista
  if (!(this.InList && this.ListList))
    return false;
  //
  var parp = this.ParentPanel;
  var n = parp.Fields.length;
  //
  for (var i=0; i<n; i++)
  {
    var f = parp.Fields[i];
    //
    if (parp.AdvTabOrder)
      f = parp.ListTabOrder[i];
    //
    // Cerco il primo campo in lista
    if (f && f.InList && f.ListList && f.IsVisible())
    {
      // Trovato il primo campo in lista: se sono io ritorno true, se non sono io ritorno false
      return (f==this);
    }
  }
  //
  return false;
}


// **********************************************************
// E' stato dato il fuoco ad uno degli input di intestazione
// gruppo
// **********************************************************
PField.prototype.PListGetFocus = function(srcobj)
{
  // Leggiamo l'id del gruppo
  var id = srcobj.id;
  //
  // Se non sono un campo in lista oppure il pannello non e' in lista o non e' gruppato esco
  if (!(this.InList && this.ListList) || !this.ParentPanel.IsGrouped() || this.ParentPanel.PanelMode!=RD3_Glb.PANEL_LIST)
    return;
  //
  // Ciclo su tutte le celle in lista per trovare quella a cui appartiene l'oggetto
  for (var i=0; i<this.PListCells.length; i++)
  {
    var cell = this.PListCells[i];
    //
    if (cell && cell.GroupId && cell.GroupId == id)
    {
      // Ho trovato la cella giusta!
      // Mi posiziono sulla riga corretta ed esco
      this.ParentPanel.SetActualRow(i);
      this.ParentPanel.SetStatusBarText();
      return;
    }
  }
}


// *******************************************************
// Reimposto le dimensioni dei gruppi in lista
// *******************************************************
PField.prototype.setPListGroupPosition = function()
{
  if (!this.DelayedUpdate)
  {
    var n = this.PListCells.length;
    for (var i=0; i<n; i++)
    {
      this.PListCells[i].EnlargeCell = true;
      this.PListCells[i].UpdateDims();
    }
  }
}


// **********************************************************************
// Una delle celle del campo con CKEditor ha preso il fuoco
// **********************************************************************
PField.prototype.GotFocusCK = function(editor)
{
  // Vediamo quale cella devo evidenziare
  var cell = null;
  //
  // Vediamo se devo cambiare riga nel pannello
  if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.ListList)
  {
    var nr = editor.RowNumber;
    //
    if (this.ParentPanel.Status==RD3_Glb.PS_QBE && nr!=0)
      return;
    //
    this.ParentPanel.ChangeActualRow(nr, evento);
    cell = this.PListCells[nr];
  }
  else if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.PListCells)
    cell = this.PListCells[0];
  else
    cell = this.PFormCell;
  //
  // Evidenzio la cella
  if (cell)
    cell.SetActive();
}

// *************************************************************
// Chiamato da CKEditor quando l'utente preme un tasto
// o seleziona con il mouse
// *************************************************************
PField.prototype.KeyPressCKEditor = function(evt, editorname)
{
  if (editorname)
  {
    var parentContext = this;
    var k = function(ev) { parentContext.SendtextSelChange(ev, editorname); };
    //
    // Se c'e' gia' un timer lo blocco (improbabile.. ma per sicurezza facciamolo)
    if (RD3_KBManager.SelTextTimer)
      window.clearTimeout(RD3_KBManager.SelTextTimer);
    //
    // Attivo il timer per fare scattare la gestione della selezione testuale dopo 10 milli: in questo modo il campo ha sempre il testo aggiornato
    RD3_KBManager.SelTextTimer = window.setTimeout(k, 50);
    RD3_KBManager.SelTextSrc = null;
    RD3_KBManager.SelTextObj = null;
  }
}


// **********************************************************************
// Invio al server il cambio della selezione testuale
// **********************************************************************
PField.prototype.SendtextSelChange = function(evt, editorname)
{  
  if (editorname)
  {
    // devo leggere il valore da una istanza di CKEditor!
    var inst = CKEDITOR.instances[editorname];
    //
    if (inst && inst.getSelection() && inst.getSelection().getType()== CKEDITOR.SELECTION_TEXT && inst.getSelection().getRanges().length>0)
    {
      var startSel = inst.getSelection().getRanges()[0].startOffset;
      var endSel = inst.getSelection().getRanges()[0].endOffset;
      //
      var oldstart = this.StartSel;
      var oldend = this.EndSel;
      //
      if (oldstart != startSel || oldend != endSel)
      {
        var ev = new IDEvent("txtsel", this.Identifier, null, this.ParentPanel.TextSelEventDef, "", startSel, endSel, "", "", this.ParentPanel.TextSelEventDef==RD3_Glb.EVENT_ACTIVE ? 250 : 600000, true);
        //
        this.StartSel = startSel;
        this.EndSel = endSel;
      }
    }
  }
  else
  {
    var srcele = null;
    if (evt.tagName)
      srcele = evt;
    else
      srcele = (window.event) ? window.event.srcElement: evt.explicitOriginalTarget;
    //
    if (srcele==null || !this.UseTextSel || this.ParentPanel.Status==RD3_Glb.PS_QBE)
      return;
    //
    // Risalgo finche' trovo qualcuno con l'ID
    while (srcele && !srcele.id)
      srcele = srcele.parentNode;
    //
    // vediamo su quale cella devo leggere la selezione
    var cell = null;
    //
    if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.ListList)
    {
      var n = this.PListCells.length;
      for (var i=0; i<n; i++)
      {
        if (this.PListCells[i].GetDOMObj(true)==srcele)
        {
          // Trovata la cella!
          cell = this.PListCells[i];
          break;
        }
      }
    }
    else if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST && this.PListCells)
      cell = this.PListCells[0];
    else
      cell = this.PFormCell;
    //
    // Ho trovato la cella: se e' Edit o CK leggo la posizione della selezione
    if (cell && (cell.ControlType==2 || cell.ControlType==101))
    {
      var startSel = -1;
      var endSel = -1;
      //
      // Leggo la selezione per una cella EDIT
      if (cell.ControlType==2)
      {
        // Devo usare metodi differenti a seconda che sia una TextArea o un Input (NumRows>1: Textarea)
        if (cell.NumRows>1)
        {
          startSel = RD3_Glb.getTextAreaSelection(cell.GetDOMObj(), false);
          endSel = RD3_Glb.getTextAreaSelection(cell.GetDOMObj(), true);
        }
        else
        {
          startSel = getCursorPos(cell.GetDOMObj());
          endSel = RD3_Glb.getSelEnd(cell.GetDOMObj());
        }
      }
      //
      var oldstart = this.StartSel;
      var oldend = this.EndSel;
      if (oldstart != startSel || oldend != endSel)
      {
        var ev = new IDEvent("txtsel", this.Identifier, null, this.ParentPanel.TextSelEventDef, "", startSel, endSel, "", "", this.ParentPanel.TextSelEventDef==RD3_Glb.EVENT_ACTIVE ? 250 : 600000, true);
        //
        this.StartSel = startSel;
        this.EndSel = endSel;
      }
    }
  }
}

// ***********************************************
// Determina se deve essere mostrata solo l'icona
// ***********************************************
PField.prototype.ShowDescription = function(vs)
{
  if (this.VisOnlyIcon())
    return false;
  //
  if (vs)
    return vs.ShowDescription();
  //
  return true;
}

// ***********************************************
// Determina se deve essere mostrato il valore
// ***********************************************
PField.prototype.ShowValue = function (vs) 
{
  if (this.VisOnlyIcon())
    return false;
  //
  if (vs)
    return vs.ShowValue();
  //
  // Default false
  return false;
}

// *************************************************************************
// True se sulla cella deve comparire il watermark
// *************************************************************************
PField.prototype.CellMustHaveWaterMark = function(en, qbe, inlist, valIndex, cell)
{
  // Se non ho watermark o la cella e' in QBE o disabilitata allora esco subito: 
  // non devo mettere il watermark
  if (this.WaterMark == "" || !en)
    return false;
  //
  // Se la cella e' in QBE e siamo in un tema Desktop allora non mostriamo il watermark, in un tema mobile lo mostriamo
  if (qbe && !RD3_Glb.IsMobile())
    return false;
  //
  // Il testo del PVal e' vuoto, il campo e' mascherato e nell'input c'e' scritto qualcosa che non e' il watermark: 
  // non scrivo il watermark.. lascio stare, se no potrei togliere la maschera.. 
  if (cell.Mask && cell.GetDOMObj(false).value!="" && cell.GetDOMObj(false).value==GetInitValue(cell.Mask, cell.MaskType))
    return false;
  //
  // Se la cella e' in lista ed io sono List List allora devo applicare il watermark solo sulla prima riga nuova
  if (inlist && this.ListList)
    return valIndex==this.ParentPanel.TotalRows+1;
  //
  // Se sono in form o fuori lista allora posso applicare il watermark
  return true;
}

// *****************************************************
// De/Evidenzio il BLOB che sto per cancellare
// ******************************************************
PField.prototype.DoHighlightDelete = function(highlight)
{
  // Se il pannello non vuole l'evidenziazione non faccio nulla
  if (!this.ParentPanel.HighlightDelete)
    return;
  //
  var cont = null;
  if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST)
    cont = this.PListCells[this.ListList ? this.ParentPanel.ActualRow : 0].GetDOMObj();
  else
    cont = this.PFormCell.GetDOMObj();
  //
  // Se devo evidenziare
  if (highlight)
  {
    this.HLDelObject = document.createElement("DIV");
    this.HLDelObject.className = "panel-highlight-delete";
    this.HLDelObject.style.left = "0px";
    this.HLDelObject.style.top = "0px";
    this.HLDelObject.style.width = (cont.clientWidth - 2*RD3_ClientParams.HLDBorderWidth) + "px";
    this.HLDelObject.style.height = (cont.clientHeight - 2*RD3_ClientParams.HLDBorderWidth) + "px";
    cont.appendChild(this.HLDelObject);
  }
  else // Devo togliere l'evidenziazione
  {
    cont.removeChild(this.HLDelObject);
    this.HLDelObject = undefined;
  }
}

// ********************************************************************************
// Sporca il visual style con le proprieta' visuali dinamiche
// ********************************************************************************
PField.prototype.ApplyDynPropToVisualStyle = function(vs)
{
  if (this.BackColor != "" || this.ForeColor != "")
  {
    vs.OldColor = new Array();
    //
    var n = vs.Color.length;
    for (var i=0; i<n; i++)
      vs.OldColor[i] = vs.Color[i];
    //
    if (this.BackColor != "")
      vs.Color[4] = this.BackColor;  
    if (this.ForeColor != "") 
      vs.Color[1] = this.ForeColor;
  }
  //
  if (this.FontMod != "")
  {
    vs.OldFont = new Array();
    //
    var n = vs.Font.length;
    for (var i=0; i<n; i++)
      vs.OldFont[i] = vs.Font[i];
    //
    var f = vs.GetFont(1).split(',');
    f[1] = this.FontMod;
    vs.Font[1] = f.join(',');
  }
  //
  if (this.Alignment != -1)
  {
    vs.OldAlign = new Array();
    //
    for (var i = 0; i < vs.Alignments.length; i++)
      vs.OldAlign[i] = vs.Alignments[i];
    vs.Alignments[1] = this.Alignment;
  }
}

// ********************************************************************************
// Ripristina il visual style dallo sporco delle proprieta' visuali dinamiche
// ********************************************************************************
PField.prototype.CleanVisualStyle = function(vs)
{
  if (vs.OldColor != undefined)
  {
    vs.Color = vs.OldColor;
    vs.OldColor = undefined;
  }
  //
  if (vs.OldFont != undefined)
  {
    vs.Font = vs.OldFont;
    vs.OldFont = undefined;
  }
  //
  if (vs.OldAlign != undefined)
  {
    vs.Alignments = vs.OldAlign;
    vs.OldAlign = undefined;
  }
}

// *********************************************
// Aggiorna lo stile visuale del campo
// *********************************************
PField.prototype.UpdateVisualStyle = function(vs)
{
  var cr = this.IsRightAligned();
  var st = this.IsStatic();
  var nn = !this.Optional && this.ParentPanel.Status!=RD3_Glb.PS_QBE && !this.ParentPanel.Locked && !st;
  var hasDynProp = (st && (this.BackColor!="" || this.ForeColor!="" || this.FontMod!="" || this.Alignment!=-1));
  //
  // Applico il VS alle caption, ai campi verra' applicato durante la renderizzazione
  if (this.ListCaptionBox)
  {
    if (this.ListList)
    {
      var aa = cr?"right":"left";
      vs.ApplyValueStyle(this.ListCaptionBox, true, !st, false, false, false, false, false, aa, false, nn); // Header in lista
      //
      // Se l'allineamento dinamico e' automatico o spento mi calcolo l'allineamento corretto, altrimenti mi calcolo l'allinemanto
      // dinamico
      var al = this.Alignment;
      if (al==1 || al==-1)
        al = vs.GetAlignment(!st?2:1);
      //
      switch (al)
      {
        case 2: aa = "left";    break;
        case 3: aa = "center";  break;      
        case 4: aa = "right";   break;
        case 5: aa = "justify"; break;
      }
      //
      // Se l'allineamento e' diverso da quello della caption lo applico
      if (aa != this.ListCaptionBox.style.textAlign)
        this.ListCaptionBox.style.textAlign = aa;
    }
    else
    {
      if (hasDynProp)
      {
        this.ListCaptionBox.setAttribute("vsign", "");
        this.ApplyDynPropToVisualStyle(vs);
      }
      //
      var aa = (cr && this.HdrListAbove) ?"right":"left";
      vs.ApplyValueStyle(this.ListCaptionBox, false, !st, false, false, false, false, false, aa, false, nn, false, false, this.IsButton()); // Header fuori lista
      //
      if (hasDynProp)
        this.CleanVisualStyle(vs);
      //
      // Questa eccezione rende possibile impostare il colore del testo dei bottoni
      // anche nel tema mobile 7
      if (RD3_Glb.IsMobile7() && this.IsButton() && this.ForeColor!="")
      {
        this.ListCaptionBox.style.setProperty("color",this.ForeColor,"important");
      }
    }
  }
  if (this.FormCaptionBox)
  {
    if (hasDynProp)
    {
      this.FormCaptionBox.setAttribute("vsign", "");
      this.ApplyDynPropToVisualStyle(vs);
    }
    //
    var aa = (cr && this.HdrFormAbove) ?"right":"left";
    if (this.HdrFormAbove) {
      // Se il VS e' centrato allora devo centrare
      var al = this.Alignment;
      if (al==1 || al==-1)
        al = vs.GetAlignment(!st?2:1);
      //
      switch (al)
      {
        case 2: aa = "left";    break;
        case 3: aa = "center";  break;      
        case 4: aa = "right";   break;
        case 5: aa = "justify"; break;
      }
    }
    vs.ApplyValueStyle(this.FormCaptionBox, false, !st, false, false, false, false, false, aa, false, nn, false, false, this.IsButton()); // Header in form
    //
    if (hasDynProp)
      this.CleanVisualStyle(vs);
    //
    // Questa eccezione rende possibile impostare il colore del testo dei bottoni
    // anche nel tema mobile 7
    if (RD3_Glb.IsMobile7() && this.IsButton() && this.ForeColor!="")
    {
      this.FormCaptionBox.style.setProperty("color",this.ForeColor,"important");
    }
  }
}


// ********************************************************************************
// Gestione finale del campo
// ********************************************************************************
PField.prototype.AfterProcessResponse= function()
{ 
  // Invio il messaggio di fine richiesta ai valori
  var n = this.PValues.length;
  for (var i=0; i<n; i++)
  {
    if (this.PValues[i])
      this.PValues[i].AfterProcessResponse();
  }
  //
  // Vedo se devo aprire la combo
  if (this.DoOpenCombo)
  {
    this.DoOpenCombo = false;
    //
    var cell = this.GetCurrentCell();
    if (!cell)
      return;
    //
    // Il click non deve essere gestito come attivatore...
    if (!cell.IsEnabled && !this.ActivableDisabled)
      return;
    //
    // Se la cella e' una combo allora faccio click sul suo attivatore, in modo che possa gestire correttamente il tutto
    // (apertura combo compresa)
    if (cell.ControlType == 3 && cell.IntCtrl)
      cell.IntCtrl.OpenComboForced();
  }
  //
  if (this.DoOpenQBEPopupFilter)
  {
    delete this.DoOpenQBEPopupFilter;
    if (this.CanUseListQBE() || this.CanUseRowQBE())
    {
      var popup = new PopupFilter(this);
      if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST)
      {
        if (this.HdrList)
        {
          popup.SetTop(RD3_Glb.GetScreenTop(this.ListCaptionBox,true)+this.ListCaptionBox.offsetHeight);
          popup.SetLeft(RD3_Glb.GetScreenLeft(this.ListCaptionBox,true));
        }
      }
      else
      {
        if (this.HdrForm)
        {
          popup.SetTop(RD3_Glb.GetScreenTop(this.FormCaptionBox,true) + this.FormCaptionBox.offsetHeight);
          popup.SetLeft(RD3_Glb.GetScreenLeft(this.FormCaptionBox,true));
        }
      }
      //
      popup.Open();
    }
  }
  //
  // Alla fine nel caso Combo LKE svuoto la lista, altrimenti si apre la combo
  if (this.PQBEValue && this.PQBEValue.ValueList && this.LKE)
    delete this.PQBEValue.ValueList;
}


// **********************************************************************************
// Scatta per i BLOB di tipo immagine in anteprima per gestirne il ridimensionamento
// **********************************************************************************
PField.prototype.BLOBImageReadyStateChanged= function(evento)
{
  var srcobj = (window.event)?window.event.srcElement:evento.explicitOriginalTarget;
  //
  if (RD3_Glb.IsIE(10, true))
    srcobj = evento.srcElement
  //
  srcobj = srcobj.parentNode;   
  //
  var cell = RD3_KBManager.GetCell(srcobj);
  if (cell)
    cell.ResizeBLOBImage();
    
}


// ********************************************************************************
// La caption e' stata toccata dall'utente
// ********************************************************************************
PField.prototype.OnTouchDown= function(evento, scrollinput)
{ 
  if (this.IsButton() || (this.VisHyperLink(this.VisualStyle) && this.VisShowActivator()))
  {
    // Bottone abilitato, evidenzio
    var obj = this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST?this.ListCaptionBox:this.FormCaptionBox;
    RD3_Glb.AddClass(obj,"button-hover");
    //
    if (!RD3_Glb.IsMobile7())
    {
      var st = "-webkit-gradient(linear, 0% 0%, 0% 100%, from("+RD3_ClientParams.GetColorHL1()+"), to("+RD3_ClientParams.GetColorHL2()+"))";
      if (RD3_Glb.IsIE(10, true))
        st = "linear-gradient(180deg, "+RD3_ClientParams.GetColorHL1()+", "+RD3_ClientParams.GetColorHL2()+")";
      //
      if (this.VisShowActivator() && this.IsButton())
      {
        // Mi memorizzo l'immagine, cosi' posso riprisitnarla nel touch up
        obj.setAttribute("OldBkgImage", obj.style.backgroundImage);
        //
        obj.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/detailw.png), "+st;
        obj.style.backgroundPosition = (obj.offsetWidth-27)+"px 50%, 0% 0%";
      }
      else
      {
        // Mi memorizzo l'immagine, cosi' posso riprisitnarla nel touch up
        obj.setAttribute("OldBkgImage", obj.style.backgroundImage);
        this.ApplyBackgroundImage(obj.style, st);
      }
      //
      this.ParentPanel.hilitedButton = this;
    }
  }
  //
  // Se sono in form, giro l'evento alla cella, cioe' al PValue ad essa associato.
  if (!this.IsStatic() && this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM && this.PFormCell && this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM && this.PFormCell.PValue)
  {
    var objt = (this.PFormCell.IntCtrl.ComboInput?this.PFormCell.IntCtrl.ComboInput:this.PFormCell.IntCtrl);
    if (objt instanceof IDEditor)
      objt = objt.GetDOMObj();
    //
    return this.PFormCell.PValue.OnTouchDown(evento, scrollinput, objt);
  }
  else // In questo caso devo lanciare io il touch al padre
  {
    this.ParentPanel.OnTouchDown(evento);
  }
  //
  return true;
}

// ********************************************************************************
// La caption e' stata toccata dall'utente
// ********************************************************************************
PField.prototype.OnTouchUp= function(evento, click)
{ 
  // Se sono in form, giro l'evento alla cella, cioe' al PValue ad essa associato.
  if (!this.IsStatic() && this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM && this.PFormCell && this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM && this.PFormCell.PValue)
  {
    var objt = (this.PFormCell.IntCtrl.ComboInput?this.PFormCell.IntCtrl.ComboInput:this.PFormCell.IntCtrl);
    if (objt instanceof IDEditor)
      objt = objt.GetDOMObj();
    //
    return this.PFormCell.PValue.OnTouchUp(evento, click, objt);
  }
  else
  {
    this.ParentPanel.OnTouchUp(evento, click);
  }
  // Altrimenti me lo gestisco in proprio.
  if (click)
  {
    // Voglio evitare un doppio click sugli oggetti
    if (RD3_Glb.IsAndroid() || (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch()))
      RD3_DDManager.ChompClick();
    //
    if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST || this.IsStatic())
      this.OnClickCaption(evento);
    //
    // Se sono in form e tocco una combo, la apro
    if (this.ParentPanel.PanelMode==RD3_Glb.PANEL_FORM)
    {
      if (this.IsCombo() && this.PFormCell && this.PFormCell.IsEnabled)
        this.PFormCell.IntCtrl.Open();
    }
  }
  else
  {
    // Ho toccato una combo, smetto di evidenziarla
    if (this.ParentPanel.HilitedCombo)
      this.ParentPanel.HilitedCombo.HiliteCombo(null, false);
  }
  if (this.IsButton() || this.VisHyperLink(this.VisualStyle))
  {
    // Bottone abilitato, smetto di evidenziare
    var obj = this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST?this.ListCaptionBox:this.FormCaptionBox;
    RD3_Glb.RemoveClass(obj,"button-hover");
    //
    // Ci sono alcuni casi in cui arrivo qui senza l'old (ad esempio quando clicchi e fai lo swipe: idscroll chiama onTouchUp due volte, 
    // la prima con l'old - che viene messo a posto - la seconda senza) in quel caso se non ho un'immagine di sfondo da rimettere a posto non faccio nulla..
    if (obj.hasAttribute("OldBkgImage") || this.Image != "")
    { 
      if (this.VisShowActivator() && this.IsButton())
      {
        obj.style.backgroundImage = "";
        obj.style.backgroundPosition = "";
      }
      //
      // Riprisitno la vecchia immagine se presente
      var st = obj.getAttribute("OldBkgImage");
      obj.removeAttribute("OldBkgImage");
      //
      // Se ho un'immagine allora vince quella (altrimenti si accodano..)
      st = this.Image != "" ? "" : st; 
      this.ApplyBackgroundImage(obj.style, st);
      //
      if (this.ParentPanel.hilitedButton == this)
        delete this.ParentPanel.hilitedButton;
    }
  }
  return true;
}


// *******************************************************************
// Gestisce animazione checkbox
// *******************************************************************
PField.prototype.OnToggleCheck = function(evento) 
{
  var obj = evento.target;
  if (RD3_Glb.IsIE(10, true))
    obj = evento.srcElement;
  //
  while (obj.className.substr(0,9)=="radio-int")
    obj = obj.parentNode;
  if (obj.firstChild && obj.firstChild.className=="panel-value-check")
    obj = obj.firstChild;
  if (obj.tagName=="SPAN")
    obj = obj.parentNode;
  //
  var objf = RD3_KBManager.GetObject(obj, true);
  if (!objf || !objf.IsEnabled())
    return;
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
    RD3_Glb.AddEndTransaction(obj, this.ea, false);
  }
  //
  // Mando i cambiamenti dell'oggetto?
  if (objf.OnChange)
    RD3_DesktopManager.CallEventHandler(objf.Identifier, "OnChange", evento);
}


// *******************************************************************
// Gestisce Chack a tre stati per il QBE
// *******************************************************************
PField.prototype.OnThreeStateCheck = function(evento, listQBE)
{
  // Se non siamo in QBE o siamo su uno dei browser che non supportano l'indeterminate non facciamo nulla
  if ((this.ParentPanel.Status !== RD3_Glb.PS_QBE && !listQBE) || RD3_Glb.IsIE(10, false) || RD3_Glb.IsSafari(5))
    return;
  //
  var obj = evento.target;
  if (RD3_Glb.IsIE(10, true))
    obj = evento.srcElement;
  //
  switch (obj.getAttribute("checkstatus")) {
    // checked, going indeterminate
    case "0":
        obj.setAttribute("checkstatus", "1");
        obj.indeterminate = true;
        break;
    
    // indeterminate, going unchecked
    case "1":
        obj.setAttribute("checkstatus", "2");
        obj.indeterminate = false;
        obj.checked = false;           
        break;
    
    // unchecked, going checked
    default:  
        obj.setAttribute("checkstatus", "0");
        obj.indeterminate = false;
        obj.checked = true;
    break;
  }
}


// *******************************************************************
// Conclude animazione checkbox
// *******************************************************************
PField.prototype.OnEndAnimation = function(evento) 
{
  var obj = evento.target;
  RD3_Glb.SetTransitionDuration(obj, "0ms");
  RD3_Glb.RemoveEndTransaction(obj, this.ea, false);
}


// ********************************************************************************
// La combo (in form) e' stata toccata dall'utente
// ********************************************************************************
PField.prototype.HiliteCombo= function(obj, fl)
{ 
  var parf = this;
  var parp = parf.ParentPanel;
  //
  // Uso l'oggetto che avevo memorizzato?
  if (!fl && parp.HilitedCombo)
  {
    var o = parp.HilitedCombo;
    parp.HilitedCombo = null;
    o.HiliteCombo(null,fl);
    return;
  }
  //
  var cell = null;
  if (obj==null)
    cell = this.PFormCell;
  else
    cell = RD3_KBManager.GetCell(obj);
  if (cell==null)
    return;
  //
  if (fl)
  {
    // Se c'e' un'altra combo evidenziata per prima cosa devo renderderla normale
    if (parp.HilitedCombo)
      parp.HilitedCombo.HiliteCombo(null, false);
    //
    parp.HilitedCombo = this;
    //
    if (parf.FormCaptionBox && !RD3_Glb.IsQuadro())
      RD3_Glb.AddClass(parf.FormCaptionBox,"combo-hover");
    if (cell.IntCtrl.ComboInput)
    {
      RD3_Glb.AddClass(cell.IntCtrl.ComboInput,"combo-hover");
      if (this.ActImage=="")
      {
        if (!RD3_Glb.IsIE(10,false))
          cell.IntCtrl.ComboActivator.style.setProperty("background-image","url(images/detailw.png)","important");
        else
          cell.IntCtrl.ComboActivator.style.backgroundImage = "url(images/detailw.png)";
      }
    }
    else
    {
      RD3_Glb.AddClass(cell.IntCtrl,"combo-hover");
      if (cell.ActObj && this.ActImage=="")
      {
        if (!RD3_Glb.IsIE(10,false))
          cell.ActObj.style.setProperty("background-image","url(images/detailw.png)","important");
        else
          cell.ActObj.style.backgroundImage = "url(images/detailw.png)";
      }
    }
    //
    // Aggiungo e posiziono al volo un div prima della caption form in modo che mostri la riga evidenziata nel modo giusto
    if (!parp.HiliteBox)
    {
      parp.HiliteBox = document.createElement("div");
      parp.HiliteBox.className = "cell-hover";
      //
      var brtop = "0px 0px ";
      var brbottom = "0px 0px";
      if (RD3_Glb.HasClass(cell.IntCtrl.ComboInput?cell.IntCtrl.ComboInput:cell.IntCtrl,"first-group-field"))
        brtop = "6px 6px ";
      if (RD3_Glb.HasClass(cell.IntCtrl.ComboInput?cell.IntCtrl.ComboInput:cell.IntCtrl,"last-group-field"))
        brbottom = "6px 6px";
      if (!RD3_Glb.IsMobile7())
        RD3_Glb.SetBorderRadius(parp.HiliteBox, brtop+brbottom);
      parp.HiliteBox.style.position = "absolute";
    }
    //
    var s = parp.HiliteBox.style;
    s.left = parf.FormLeft + "px";
    s.top = parf.FormTop + "px";
    s.width = parf.FormWidth + "px";
    s.height = (parf.FormHeight-2) + "px";
    if (parf.FormCaptionBox)
      parf.FormCaptionBox.parentNode.insertBefore(parp.HiliteBox, parf.FormCaptionBox);
  }
  else
  {
    if (parf.FormCaptionBox)
      RD3_Glb.RemoveClass(parf.FormCaptionBox,"combo-hover");
    if (cell.IntCtrl.ComboInput)
    {
      RD3_Glb.RemoveClass(cell.IntCtrl.ComboInput,"combo-hover");
      if (this.ActImage=="")
        cell.IntCtrl.ComboActivator.style.backgroundImage = "";
    }
    else
    {
      RD3_Glb.RemoveClass(cell.IntCtrl,"combo-hover");
      if (cell.ActObj && this.ActImage=="")
        cell.ActObj.style.backgroundImage = "";
    }
    if (parp.HiliteBox && parp.HiliteBox.parentNode)
      parp.HiliteBox.parentNode.removeChild(parp.HiliteBox);
    parp.HiliteBox = null;
  }
}


// ********************************************************************************
// Torna vero se l'oggetto toccato e' parte di una combo
// ********************************************************************************
PField.prototype.IsCombo= function(obj)
{ 
  // In questo caso, cerco la mia pformcell
  if (obj==undefined)
  {
    if (this.PFormCell)
      return this.PFormCell.IntCtrl instanceof IDCombo;
    else
      return false;
  }
  //
  if (obj.tagName == undefined)
    obj = obj.parentNode;
  //
  if (obj.tagName=="DIV" && (RD3_Glb.HasClass(obj,"combo-input") || RD3_Glb.HasClass(obj,"combo-activator")))
    return true;
}

PField.prototype.IsIDEditor= function(obj)
{ 
  // In questo caso, cerco la mia pformcell
  if (obj==undefined)
  {
    if (this.PFormCell)
      return this.PFormCell.IntCtrl instanceof IDEditor;
    else
      return false;
  }
  //
  if (RD3_Glb.isInsideEditor(obj))
    return true;
  //
  if (this.IsIDEditorToolbar(obj))
    return true;
  //
  if (obj.tagName == undefined)
    obj = obj.parentNode;
  //
  // Potrebbe essere la textarea..
  if (obj.tagName == "TEXTAREA" && RD3_Glb.HasClass(obj,"ideditor-body"))
    return true;
}

PField.prototype.IsIDEditorToolbar = function(obj)
{
  if (!obj)
    return false;
  //
  if (obj.tagName == undefined)
    obj = obj.parentNode;
  //
  // Verifico se e' un oggetto di toolbar
  if ((obj.tagName=="SPAN" && (RD3_Glb.HasClass(obj,"ideditor-toolbar-img") || RD3_Glb.HasClass(obj,"ideditor-applier"))) || (obj.tagName=="DIV" &&RD3_Glb.HasClass(obj,"ideditor-toolbar")))
    return true;
  //  
  // Potrebbe essere una combo di toolbar..
  if (obj.tagName=="DIV" && (RD3_Glb.HasClass(obj,"combo-input") || RD3_Glb.HasClass(obj,"combo-activator")))
  {
    if (obj.parentNode && obj.parentNode.tagName=="DIV" && RD3_Glb.HasClass(obj.parentNode,"ideditor-toolbar"))
      return true;
  }
  //
  return false;
}

// ********************************************************************************
// Gestione della scelta di un file da un INPUT FILE
// ********************************************************************************
PField.prototype.HandleFileSelect = function(evento)
{
  var srcobj = (window.event)?window.event.srcElement:evento.explicitOriginalTarget;
  var cell = RD3_KBManager.GetCell(srcobj);
  //
  // Memorizzo nella cella il file che l'utente ha scelto
  cell.FileToUpload = evento.target.files[0];
}


// ********************************************************************************
// Imposta le classi per la multiselezione
// ********************************************************************************
PField.prototype.UpdateMultipleSel= function(attivo, stati, onlyback) 
{
  // Se non ho le celle, non faccio altro
  if (!this.PListCells)
    return;
  //
  for (var i=0;i<this.PListCells.length;i++)
  {
    this.UpdateMultiSelCell(i, attivo && i<this.ParentPanel.TotalRows, stati[i+1], onlyback);
  } 
}

PField.prototype.UpdateMultiSelCell= function(riga, attivo, stato, onlyback)
{
  if (!this.PListCells[riga] || !this.PListCells[riga].IntCtrl)
    return;
  //
  var obj = this.PListCells[riga].IntCtrl;
  if (obj instanceof IDCombo)
    obj = obj.ComboInput;
  if (onlyback)
    RD3_Glb.SetClass(obj, "panel-field-selected-back", attivo && stato);
  else
  {
    RD3_Glb.SetClass(obj, "panel-field-selected", attivo && stato);
    RD3_Glb.SetClass(obj, "panel-field-unselected", attivo && !stato);
    //
    if (this.PListCells[riga].Tooltip!="" && this.PListCells[riga].TooltipDiv)
      RD3_Glb.SetClass(this.PListCells[riga].TooltipDiv, "panel-value-tooltip-multiplesel", attivo);
      
  }
}

// ********************************************************************************
// Gestore del caricamento delle immagini per le combo disabilitate Mobile
// ********************************************************************************
PField.prototype.COMBOImageReadyStateChanged= function(evento)
{
  var srcobj = (window.event)?window.event.srcElement:evento.explicitOriginalTarget;
  srcobj = srcobj.parentNode;   
  //
  var cell = RD3_KBManager.GetCell(srcobj);
  if (cell)
    cell.UpdateDims();
}

//********************************************************************************
// Nel caso il server chieda di dare il fuoco ad una riga e' necessario adattarla 
// se sono in un pannello gruppato
//********************************************************************************
PField.prototype.TranslateServerRow = function(row, absrow)
{
  if (this.ParentPanel.IsGrouped())
  {
    var serverIndex = absrow != undefined ? parseInt(absrow, 10) : this.ParentPanel.ActualPosition + parseInt(row, 10);
    var nr = this.ParentPanel.GetRowForIndex(serverIndex);
    //
    return nr==-1 ? row : nr;
  }
  //
  return row;
}

//********************************************************************************
// Gestione dell'invio al server di file usando le api HTML5
//********************************************************************************
PField.prototype.OnHTML5Upload = function(ev, idUploader, dropFiles)
{
  var objUploader = document.getElementById(idUploader);
  //
  if (dropFiles == undefined)
  {
    if (!objUploader || !objUploader.files || objUploader.files.length == 0)
      return;
  }
  //
  if (window.RD4_Enabled)
  {
    var fld = this;
    var files = dropFiles || objUploader.files;
    for (var i = 0; i < files.length; i++)
    {
      var file = files[i];
      var reader = new FileReader();
      reader.onload = function (e)
      {
        // Creo l'evento con par1 contenente il WCE (l'id del campo)
        new IDEvent((fld.MultiUpload ? "IWFiles" : "IWUpload"), "", null, RD3_Glb.EVENT_ACTIVE, "", fld.Identifier, file.name, file.type, e.target.result, null, null, file.size);
      };
      //
      reader.readAsDataURL(file);
    }
  }
  else
  {
    try
    {
      var req = RD3_DesktopManager.MessagePump.CreateRequest();
      //
      var msg = ClientMessages.SWF_FS_UPLOADING;
      
      if (!this.MultiUpload)
      {
        var fname = "";
        if (objUploader && objUploader.files && objUploader.files.length > 0)
          fname = objUploader.files[0].name;
        else if (dropFiles && dropFiles.length > 0)
          fname = dropFiles[0].name;
        //
        msg = RD3_Glb.FormatMessage(ClientMessages.SWF_MG_UPLOADING, fname);
      }
      //
      if (this.MultiUpload)
      {
        // Se sono un multiupload preparo il campo per tenere traccia del progresso
        var reqId = "REQ"+Math.floor(Math.random() * 100);
        this.ReqList[reqId] = req;
        req.reqid = reqId;
        req.reqFld = this;
        //
        var fileItem = this.AddFile(reqId);
        //
        // Gestisco la progress bar
        req.upload.reqid = reqId;
        req.upload.addEventListener("progress", function (evt) 
        {
          if (evt.lengthComputable)
          {
            var fileStatus = document.getElementById(this.reqid+":status");
            if (!fileStatus)
              return;
            var perc = Math.ceil(evt.loaded/evt.total*100);
            fileStatus.style.backgroundSize = perc + "% 100%";
            if (evt.loaded == evt.total || perc == 100)
            {
              var fileAbort = document.getElementById(this.reqid+":abort");
              if (fileAbort)
                fileAbort.style.display = "none";
            }
          }
        }, false);
        //
        // A caricamento effettuato gestisco la risposta del server
        req.addEventListener("load", function () 
        {
          if (this.status == 200)
            RD3_DesktopManager.ProcessXmlText(this.responseText);
          //
          if (this.reqFld)
          {
            this.reqFld.HTML5UploadComplete(this.reqid);
            this.reqFld = null;
          }
        }, false);
      }
      else
      {
        RD3_DesktopManager.WebEntryPoint.DelayDialog.Open(msg, RD3_Glb.PROGRESS, 0);
        RD3_DesktopManager.WebEntryPoint.DelayDialog.SetProgress(0);
        RD3_DesktopManager.WebEntryPoint.DelayDialog.SetTotal(100);
        //
        // Gestisco la progress bar
        req.upload.addEventListener("progress", function (evt) 
        {
          if (evt.lengthComputable)
            RD3_DesktopManager.WebEntryPoint.DelayDialog.SetProgress(Math.ceil(evt.loaded/evt.total*100));
          else
            RD3_DesktopManager.WebEntryPoint.DelayDialog.SetProgress(evt.loaded);
        }, false);
        //
        // A caricamento effettuato gestisco la risposta del server
        req.addEventListener("load", function () 
        {
          if (this.status == 200)
            RD3_DesktopManager.WebEntryPoint.OnBlobUpload(this.responseText);
        }, false);
        //
        // Gestisco eventuali errori
        req.upload.addEventListener("error", function (evt) 
        {
          var msg = ClientMessages.SWF_ER_FILENOTSEND + "<br>" + req.status;
          var m = new MessageBox(msg, RD3_Glb.MSG_BOX, false);
          m.Open();
        }, false);
      }
      //
      // Preparo la stringa per mostrare la dimensione massima del file
      var maxSizeString = this.MaxUploadSize;
      var units = {0:"B", 1:"KB", 2:"MB", 3:"GB"};
      for (var b=0; b<=3; b++)
      {
        if (this.MaxUploadSize < Math.pow(1024, b+1))
        {
          maxSizeString = Math.round(this.MaxUploadSize / Math.pow(1024, b), 0) + " " + units[b];
          break;
        }
      }
      //
      // ok.. configuro la richiesta ed invio il file
      var uploadUrl = "?WCI=" + (this.MultiUpload ? "IWFiles" : "IWUpload");
      uploadUrl += "&WCE=" + this.Identifier;
      //
      req.open("post", uploadUrl, true);
      //
      var formData = new FormData();
      var list = dropFiles ? dropFiles : objUploader.files;
      var n = list.length;
      msg = "";
      var accepted = false;
      for (var i=0; i<n; i++)
      {
        var file = list[i];
        var ok = false;
        //
        // Verifico se il file e' di un tipo valido: lo devo fare anche qui perche' se arrivo dal D&D non so cosa mi hanno trascinato..
        if (this.UploadExtensions == "*.*")
        {
          ok = true;
        }
        else
        {
          // Verifico se il tipo e' ammesso (se mi arriva "" - il browser non ha riconosciuto il tipo - e mi hanno
          // chiesto un tipo specifico non lo mando
          var mimes = this.UploadExtensions.split(',');
          for (var idx=0; idx<mimes.length; idx++)
          {
            var mimeAccepted = mimes[idx];
            //
            // Se il nome del file termina con uno dei mime validi allora e' ok
            if (file.name.substring(file.name.length - mimeAccepted.length) == mimeAccepted)
            {
              ok = true;
              break;
            }
          }
          //
          if (!ok)
          {
            msg += msg=="" ? ClientMessages.SWF_ER_FILENOTSEND : "";
            msg += "<br>" + file.name + " : " + ClientMessages.SWF_ER_VALIDATIONFAILED;
          }
        }
        //
        if (ok)
        {
          if (file.size == 0)
          {
            ok = false;
            //
            msg += msg=="" ? ClientMessages.SWF_ER_FILENOTSEND : "";
            msg += "<br>" + file.name + " : " + ClientMessages.SWF_ER_VALIDATIONFAILED;
          }
          //
          // Verifico la dimensione del file (nel caso sia troppo grande lo devo segnalare)
          if (file.size > this.MaxUploadSize)
          {
            ok = false;
            //
            msg += msg=="" ? ClientMessages.SWF_ER_FILENOTSEND : "";
            msg += "<br>" + file.name + " : " + ClientMessages.SWF_ER_FILESIZEEXCEEDED + " (max " + maxSizeString + ")";
          }
        }
        //
        if (ok)
        {
          formData.append("thefile"+i, file);
          accepted = true;
        }
      }
      //
      // Se ho selezionato almeno un file invio la richiesta, altrimenti segnalo eventuali errori
      if (accepted)
      {
        RD3_DesktopManager.SendEvents(true);
        req.send(formData);
      }
      else
      {
        // Se accepted e' false nessun file e' stato inviato: in questo caso annullo la progressBar
        if (this.MultiUpload)
          this.HTML5UploadComplete(req.reqid);
        else
          RD3_DesktopManager.WebEntryPoint.DelayDialog.Close();
      }
      //
      // Se ci sono degli errori li mostro
      if (msg != "")
      {
        // Mostro gli errori
        var m = new MessageBox(msg, RD3_Glb.MSG_BOX, false);
        m.Open();
      }
    }
    catch(t)
    {
      RD3_DesktopManager.WebEntryPoint.DelayDialog.Close();
    }
  }
}

// ********************************************************************************
// Il server ha risposto ad una richiesta di MultiUpload javascript,
// devo rimuovere la progressbar dal campo
// ********************************************************************************
PField.prototype.HTML5UploadComplete = function(idRequest)
{
  // Per prima cosa devo rimuovere l'entry dalla lista
  var fileEntry = document.getElementById(idRequest+":fi");
  if (fileEntry)
    fileEntry.parentNode.removeChild(fileEntry);
  //
  this.FileList.FileItems.remove(idRequest);
  this.ReqList.remove(idRequest);
}

// **************************************************************************************
// Devo riflettere il click sull'uploader nascosto per aprire la finestra di scelta file
// **************************************************************************************
PField.prototype.OnHTML5UploadClick = function(ev, idUploader)
{
  var srcobj = window.event ? window.event.srcElement : ev.explicitOriginalTarget;
  //
  // Se il click avviene sul pulsante di abort non facio nulla
  if (srcobj && srcobj.id && srcobj.id.indexOf(":abort") != -1)
    return;
  //
  // Annullo la selezione precedente: in questo modo l'utente puo' inviare piu' volte lo stesso file
  // (altrimenti non scatta l'evento di OnChange)
  document.getElementById(idUploader).value = "";
  document.getElementById(idUploader).click();
}

// **************************************************************************************
// Drop di un file sul campo MultiUpload
// **************************************************************************************
PField.prototype.OnHTML5Drop = function(ev)
{
  if (!this.MultiUpload && this.DataType!=10)
    return;
  //
  var srcobj = window.event ? window.event.srcElement : ev.explicitOriginalTarget;
  //
  if (ev && ev.dataTransfer && ev.dataTransfer.files)
    this.OnHTML5Upload(ev, srcobj.id, ev.dataTransfer.files);
  //
  RD3_Glb.StopEvent(ev);
  return false;
}

PField.prototype.OnHTML5Drag = function(ev)
{
  // Abilito il Drag dei file
  if (ev && ev.dataTransfer)
  {
    var srcobj = window.event ? window.event.srcElement : ev.explicitOriginalTarget;
    var obj = RD3_KBManager.GetObject(srcobj, true);
    //
    var upl = this.DataType == 10 || this.MultiUpload;
    //
    // Verifico se e' consentito l'upload per i blob attivi
    if (this.DataType == 10)
    {
      upl = false;
      var m = this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
      if (this.IsEnabled(m+1) && this.ParentPanel.Status!=RD3_Glb.PS_QBE && !this.ParentPanel.IsNewRow(this.ParentPanel.ActualPosition, this.ParentPanel.ActualRow))
        upl = this.ParentPanel.IsCommandEnabled(RD3_Glb.PCM_BLOBEDIT);
    }
    //
    // Se il pannello e' in lista ed il campo BLOB e' in lista consento l'upload solo sulla riga attiva (altrimenti lato server fa casino)
    if (upl && this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.InList && this.ListList && obj != null && obj instanceof PValue)
    {
      upl = obj.Index == this.ParentPanel.ActualPosition + this.ParentPanel.ActualRow;
    }
    //
    if (upl)
      ev.dataTransfer.dropEffect = "copy";
    else
      ev.dataTransfer.dropEffect = "none";
  }
  //
  RD3_Glb.StopEvent(ev);
  return false;
}
// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
PField.prototype.OnAdaptRetina = function(w, h, par)
{
  var style;
  if (par == 1)
    style = this.FormCaptionBox.style;
  else if (par == 2)
    style = this.ListCaptionBox.style;
  if (style)
    style.backgroundSize = w+"px "+h+"px";
}

// *******************************************************************
// Chiamato quando arriva dal server un comando per l'IDEditor
// *******************************************************************
PField.prototype.OnServerEditorCommand = function(cmd, val, restSel)
{
  if (!RD3_ServerParams.UseIDEditor || this.EditorType!=1)
    return;
  //
  // Devo selezionare la cella giusta..
  var nr = (this.ListList)? this.ParentPanel.ActualRow : 0;
  var cell = (this.ParentPanel.PanelMode==RD3_Glb.PANEL_LIST) ? this.PListCells[nr] : this.PFormCell;
  //
  if (cell && cell.IsEnabled && cell.ControlType==101 && cell.IntCtrl instanceof IDEditor)
    cell.IntCtrl.OnServerEditorCommand(cmd, val, restSel);
}


// *******************************************************************
// Chiamato per sapere se mostrare le icone di filtro in lista per il QBE
// *******************************************************************
PField.prototype.CanUseListQBE = function()
{
  return !RD3_Glb.IsMobile() && (this.ParentPanel.UseListQBE == RD3_Glb.PAN_QBEHEADER) && this.ParentPanel.CanSearch && ((this.CanSort && this.VisCanSort()) || (this.QBEEnabled && (this.IdxPanel <= 0 || (this.IdxPanel > 0 && (this.AutoLookup || this.LKE))))) && (this.DataType != 10);
}

// *******************************************************************
// Chiamato per sapere se mostrare le icone di filtro in lista di tipo ROW per il QBE
// *******************************************************************
PField.prototype.CanUseRowQBE = function () 
{
  return !RD3_Glb.IsMobile() && (this.ParentPanel.UseListQBE == RD3_Glb.PAN_QBEROW) && this.ParentPanel.CanSearch && (this.DataType != 10);
}


// *******************************************************************
// Restituisce la larghezza dell'attivatore impostata dal server.
// nel caso di cella di ricerca QBE invece usiamo sempre la larghezza standard,
// in questo modo se l'utente ha nascosto l'attivatore lo vediamo comunque
// *******************************************************************
PField.prototype.GetActivatorWidth = function (pcell) 
{
  if (pcell && pcell.ListQBECell)
    return RD3_ClientParams.ActivatorWidth;
  //
  return this.ActWidth;
}


PField.prototype.SetFluidListListPosition = function () 
{
  if (this.Realizing)
    return;
  //  
  // Solo se campo presente a video
  var pp = this.ParentPanel;
  if (pp.HasList && this.InList && this.ListList && this.Realized) 
  {
    // Posiziono la caption
    // mi servono i padding, ma in questo caso non voglio modificare la larghezza tetendo conto dei bordi etc etc
    // perche' c'e':
    // -> border-box
    // -> il flex-basis funziona in modo diverso dalla width
    var rc = new Rect(0, 0, this.ListWidth, 20);
    this.VisualStyle.AdaptCaptionRect(rc, true, true);
    rc.w = this.ListWidth; 
    var s = this.ListCaptionBox.style;
    //
    s.flexBasis = rc.w + "px";
    s.order = this.Order;
    if (this.ListHResMode == RD3_Glb.RESMODE_STRETCH) 
    {
      s.flexShrink = "1";
      s.flexGrow = "1";
    }
    else 
    {
      s.flexShrink = "0";
      s.flexGrow = "0";
    }
    //
    s.paddingLeft = rc.pxl + "px";
    s.paddingRight = rc.pxr + "px";
    s.paddingTop = rc.pyt + "px";
    s.paddingBottom = rc.pyb + "px";
    //
    // Allineo anche i campi con valori aggregati
    var pthis = this;
    window.setTimeout(function () {
      var n = pp.Fields.length;
      for (var i = 0; i < n; i++) 
      {
        var f = pp.Fields[i];
        if (f.AggregateOfField != pthis.Index)
          continue;
        //
        f.SetListLeft(pthis.ListCaptionBox.offsetLeft - pp.RowSelWidth());
        f.SetListWidth(pthis.ListCaptionBox.offsetWidth);  
      }
    }, 0);
  }
}


// **********************************************************************
// Una cella ha preso il fuoco, se e' ListList verifico se mostrare
// la cella di editing
// **********************************************************************
PField.prototype.FocusListCell = function (cell, srcele) 
{
  if (cell) 
  {
    if (this.ParentPanel.IsFluidPanel() && this.ParentPanel.PanelMode == RD3_Glb.PANEL_LIST && this.ListList && cell.ControlType != 6 && cell.PValue && cell.PValue.IsEnabled() && cell.InList) 
    {
      // Prima di abilitare la nuova cella di overlay verifico se ne devo nascondere un'altra
      // Non lo faccio se do il fuoco a me stesso sulla stessa riga
      if (RD3_DDManager.OpenListFormCell && !(RD3_DDManager.OpenListFormCell == this.ListFormCell && RD3_DDManager.OpenListFormCell.PValue == this.ListFormCell.PValue)) 
      {
        // Faccio il blur, poi per sicurezza chiamo anche l'onChange in modo da mandare il messaggio al server e l'UpdaeScreen in modo da aggiornare la cella in lista
        // che sta sotto la cella in FormList
        var parentContainer = RD3_DDManager.OpenListFormCell.GetDOMObj().parentNode;
        var dmObj = RD3_DDManager.OpenListFormCell.GetDOMObj();
        if (RD3_DDManager.OpenListFormCell.ControlType == 4)
          dmObj = RD3_DDManager.OpenListFormCell.SubIntCtrl;
        if (dmObj.blur)
          dmObj.blur();
        //
        // IDRO_OnChange va chiamato sul DOMObj perche' e' lui ad avere l'id, nel caso di check invece il blur va chiamato sul 
        // subintctrl (e' lui l'input, l'intctrl e' un dv contenitore)
        RD3_KBManager.IDRO_OnChange(RD3_DDManager.OpenListFormCell.GetDOMObj(), true);
        RD3_DDManager.OpenListFormCell.PValue.UpdateScreen();
        //
        // Potrebbero aver ridato il fuoco al me su una riga diversa, in questo caso non programmo il timer per nascondermi
        if (!this.ListFormCell || RD3_DDManager.OpenListFormCell != this.ListFormCell)
          window.setTimeout(function () {
            if (parentContainer && parentContainer.parentNode)
              parentContainer.parentNode.removeChild(parentContainer);
          }, 0);
        //
        delete RD3_DDManager.OpenListFormCell;
        RD3_KBManager.ActiveElement = null;
      }
      //
      // Non gesisco il fuoco durante l'animazione
      // -> possibile miglioramento : usare un timer per rischedulare il fuoco, 
      //    attualmente lo fa gia' il sistema, quindi dovrebbe essere sicuro saltare semplicemente questa gestione
      if (this.ParentPanel.WebForm.Animating || cell.ControlType == 4 || cell.ControlType == 5)
        return;
      //
      // Se non ho un Overlay e una cella ListForm la creo
      if (!this.ListFormCell) {
        this.ListFormCell = new PCell(this, false);
        this.ListFormCell.InListForm = true;
        //
        this.ListFormOverlay = document.createElement("div");
        this.ListFormOverlay.className = "panel-list-overlay";
      }
      //
      document.body.appendChild(this.ListFormOverlay);
      //
      var cellRect = srcele.getBoundingClientRect();
      var ofy = 0;
      if (RD3_ServerParams.Theme.startsWith("zen"))
        ofy = 1;
      var ofw = 0;
      if (RD3_ServerParams.Theme.startsWith("zen"))
        ofw = 1;
      this.ListFormOverlay.style.top = (cellRect.top - ofy) + "px"
      this.ListFormOverlay.style.left = cellRect.left + "px"
      this.ListFormOverlay.style.width = (cellRect.width + ofw) + "px"
      this.ListFormOverlay.style.height = (cellRect.height + ofy) + "px"
      //
      // Ottengo la posizione assoluta in cui mostrare l'input
      // l'input per essere posizionato bene e senza effetto 'scalino'
      // deve essere:
      //   top : il top deve essere il padding della TD, in modo che copra bene la prima riga
      //   left : 0
      //   width: largo come il TD
      //   height: se e' una textarea allora deve essere alto come la cella, altrimenti come la prima riga.
      //           per ottenere questo effetto impostiamo come sua altezza il font-size (+ 5 per parificare il padding di default)
      var tp = parseFloat(RD3_Glb.GetStyleProp(cell.GetDOMObj(), "padding"), 10);
      // tp += parseFloat(RD3_Glb.GetStyleProp(cell.GetDOMObj(), "borderWidth"), 10);
      if (isNaN(tp))
        tp = 0;
      this.ListOverlayFormWidth = cellRect.width - tp;
      if (this.ListNumRows > 1)
        this.ListOverlayFormHeight = cellRect.height - tp;
      else
      {
        if (cell.ControlType === 4)
          this.ListOverlayFormHeight = 25;
        else
          this.ListOverlayFormHeight = parseFloat(RD3_Glb.GetStyleProp(cell.GetDOMObj(), "fontSize"), 10) + 5;      
      }
      //
      var lp = tp;
      if (cell.ControlType === 30)
        lp = lp + 2;
      //
      // Faccio disegnare la cella ed applico lo stile
      this.ListFormCell.Update(cell.PValue, this.ListFormOverlay);
      this.ListFormCell.PValue.GetVisualStyle().ApplyValueStyle(this.ListFormOverlay, false, false, false, false, false, cell.PValue.ErrorType == 1, (cell.PValue.ErrorType == 2 || cell.PValue.ErrorType == 3), this.IsRightAligned() ? "right" : "left", (cell.PValue.InQBE() && (this.IdxPanel <= 0 || this.AutoLookup || this.LKE)), false, false, true, false);
      this.ListFormCell.UpdateDims(lp, tp);
      this.ListFormCell.Focus();
      this.ListFormCell.SetActive();
      //
      var oid = this.Identifier + ":gv" + (cell.PValue.ListQBEValue ? "-1" : "0");
      if (this.ListFormCell.ControlType != 3 && this.ListFormCell.ControlType != 8)
        this.ListFormCell.IntCtrl.setAttribute("id", oid);
      else
        this.ListFormCell.IntCtrl.SetID(oid);
      //
      RD3_DDManager.OpenListFormCell = this.ListFormCell;
    }
  }
}

PField.prototype.SetBreakRow = function (value) 
{
  this.BreakRow = value;
}

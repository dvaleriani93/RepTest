// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Panel: Rappresenta un frame di tipo
// Panel
// ************************************************

function IDPanel(pform)
{
  // Chiamo il costruttore superiore
  WebFrame.call(this,pform);
  //
  // Proprieta' di questo oggetto di modello
  this.PanelMode = 0;          // LIST 0 / FORM 1: default LIST
  this.Status = 0;             // QBE, DATA, UPDATED
  this.DOMaster = false;       // Pannello DO master?
  this.DOModified = false;     // Pannello DO modificato?
  this.DOSingleDoc = false;    // Pannello DO su singolo documento?
  this.DOCanSave = true;       // Il pannello puo' salvare il documento master?
  this.IsDO = false;           // MQ DO?
  this.HasDocTemplate = false; // Il Pannello ha il docTemplate?
  this.NumRows = 0;            // Numero di righe da visualizzare
  this.MaxHRow = 0;            // Massima altezza in px di una riga nella lista
  this.PanelPage = 0;          // La pagina di pannello attualmente selezionata
  this.HeaderSize = 0;         // Dimensione dei titoli delle colonne nella lista
  this.ShowRowSelector = true; // Mostrare selettori di riga?
  this.ShowMultipleSel =false; // Mostrare selettori per la multiselezione?
  this.EnableMultipleSel=true; // Abilitare il pannello alla multiselezione?  
  this.SelAllOnlyVis = false;  // La selezione di tutte le righe deve agire solo su quelle visibili?
  this.DynamicRows = 0;        // Numero max di righe dinamiche
  this.DynamicHeight = true;   // Altezza frame dinamica?
  this.HasScrollbar = true;    // Ha una scrollbar per navigare nei record?
  this.HasList = true;         // Ha un layout lista?
  this.HasForm = true;         // Ha un layout dettaglio?
  this.CanUpdate = true;       // Puo' modificare?
  this.CanDelete = true;       // Puo' cancellare?
  this.CanInsert = true;       // Puo' inserire?
  this.CanSearch = true;       // Puo' ricercare?
  this.CanSort = true;         // Puo' ordinare?
  this.ListLeft = 0;           // Posizione della lista
  this.ListTop = 0;            // Posizione della lista
  this.ListWidth = 0;          // Dimensione della lista
  this.ListHeight = 0;         // Dimensione della lista
  this.ActualRow = 0;          // Riga selezionata (da 0 a NumRows-1)
  this.ListPos = 1;            // Actual Position in list quando e' passata in form
  this.VResMode = 3;           // Tipo di ridimensionamento verticale della lista (default = stretch)
  this.HResMode = 3;           // Tipo di ridimensionamento orizzontale della lista (default = stretch)
  this.VisStyle = 0;           // Indice dello stile visuale del pannello
  this.FixedColumns = 0;       // Numero di righe fissate (non scrollano in orizzontale)
  this.QBETip = "";            // Stringa da mostrare nei tip QBE del pannello
  this.EnabledCommands = -1;   // Maschera dei comandi abilitati
  this.ExtEnabledCommands = -1;   // Maschera dei comandi abilitati estesi
  this.HasBook = false;        // Il Pannello contiene un Book?
  this.AdvTabOrder = false;    // Advanced Tab Order attivo?
  this.ActivateRightClick = false;  // La pressione del tasto destro su di un campo deve attivarlo?
  this.InfoMessages = false;   // Sono presenti i messaggi informativi (frequenti!)
  this.ConfirmDelete = true;   // Devo chiedere conferma per il salvataggio?
  this.HighlightDelete = true; // Devo evidenziare la riga che sto per cancellare?
  this.BlockingCommands = 0;   // Maschera dei comandi che generano eventi bloccanti
  this.CanReorderColumn = false;  // Le colonne in lista possono essere riordinate dall'utente?
  this.CanResizeColumn = false;   // Le colonne in lista possono essere ridimensionate dall'utente?
  this.GroupingEnabled = false;   // Il pannello supporta i gruppi in lista?
  this.ShowGroups = false;        // Mostrare il pulsante di gestione gruppi?
  this.TooltipOnEachRow = false;  // Mostrare il tooltip del campo su ogni riga?
  this.EnableInsertWhenLocked = false; // Il bottone di inserimento puo' essere mostrato quando il pannello e' bloccato?
  this.ResOnlyVisFlds = false;         // Il Resize deve riservare lo spazio per i campi invisibili?
  this.TableName = "";            // Codice della tabella/classe utilizzata dal pannello
  this.AutomaticLayout = false;   // Gestione automatica del layout
  this.VisualFlags = 0;           // Flag visuali
  this.LoadingPolicy = 1;       // 0 = manual, 1 = auto, 2 = continuous
  this.PullToRefresh = true; 
  this.UseListQBE = 0;
  this.HasListVisibilityControl = false;
  this.FluidPanel = false;
  this.AllowPanelNavigation = true; // Se false i pannelli DO non consentono la navigazione se il documento e' modificato
  //
  this.ActualPosition = 1;     // Numero del record relativo alla prima riga del pannello
  this.TotalRows = 0;          // Numero totali di record nel pannello
  this.MoreRows = false;       // Ci sono altre righe nel recordset?  
  //
  this.ListTabOrder = null;    // Ordine dei campi in lista se AdvTabOrder = true
  this.FormTabOrder = null;    // Ordine dei campi in form  se AdvTabOrder = true
  this.ListGroupRoot = null;
  //
  this.RefreshToolbar = false;    // Devo riorganizzare la toolbar al termine della richiesta?
  this.ResetPosition = false;     // Devo mostrare di nuovi i valori a video al termine della richiesta?
  this.ScrollToPos = false;       // Devo farlo in modo scrolling?
  this.DenyScroll = false;        // Impedisce modo scrolling anche se poi viene richiesto?
  this.QbeScroll = false;         // Sono passato da qbe a data e devo riposizionare la scrollbar forzando la renderizzazione? (vedi setpanelstatus per spiegazioni)
  this.UpdateListGroups = false;  // Devo far riposizionare i gruppi negli array?
  //this.ResVisFld = false;       // Dei campi hanno cambiato la visibilita': devo applicare il resize
  //
  this.LastResizedField = 0;   // Ultimo campo ridimensionato in lista
  this.LastListResizeW = 0;    // Dimensioni del frame in lista (ultimo ridimensionamento)
  this.LastListResizeH = 0;    // Dimensioni del frame in lista (ultimo ridimensionamento)
  this.LastFormResizeW = 0;    // Dimensioni del frame in form  (ultimo ridimensionamento)
  this.LastFormResizeH = 0;    // Dimensioni del frame in form  (ultimo ridimensionamento)
  //
  this.CompactActualPosition = 0; // Riga attuale nella visione compatta
  //
  // Variabili di collegamento con il DOM
  //  
  // Oggetti secondari gestiti da questo oggetto di modello
  this.Pages = new Array();    // Lista delle pagine di pannello
  this.Groups = new Array();   // Lista dei gruppi di pannello
  this.Fields = new Array();   // Lista dei campi di pannello
  this.MultiSelStatus = null;  // Array di valori booleani per la gestione della multiselezione
  this.MsgBox = null;          // Msg box utilizzata per chiedere le conferme
  //
  // Struttura per la definizione degli eventi di questo pannello
  this.RowSelectEventDef = RD3_Glb.EVENT_ACTIVE;
  this.ScrollEventDef = RD3_Glb.EVENT_ACTIVE;
  this.ToolbarEventDef = RD3_Glb.EVENT_ACTIVE;
  this.PageClickEventDef = RD3_Glb.EVENT_ACTIVE;  // Click su una pagina
  this.MultiSelEventDef = RD3_Glb.EVENT_SERVERSIDE|RD3_Glb.EVENT_CLIENTSIDE;  // Cambio di multiselezione
  this.FocusEventDef = RD3_Glb.EVENT_CLIENTSIDE;
  this.TextSelEventDef = RD3_Glb.EVENT_DEFERRED; // Modifica del campo
  this.MouseOverEventDef = RD3_Glb.EVENT_CLIENTSIDE;
  //
  // Oggetti DOM di questo pannello
  this.ListBox = null;         // Il DIV che contiene tutto il layout lista del pannello
  this.FormBox = null;         // Il DIV che contiene tutto il layout form del pannello
  this.ListListBox = null;     // Il Div che contiene la lista
  this.ScrollAreaBox = null;   // Il Div che contiene la parte scrollabile della lista (in caso di FixedCol>0)
  //
  this.PagesBox = null;        // Il Div che contiene le pagine, renderizzato tra la toolbar box ed il contentbox
  this.PagesFiller = null;     // Span riempitore inserito dopo le pagine
  //
  this.ScrollBox = null;       // Il DIV che contiene la scrollbar del pannello
  this.ScrollClone = null;     // Il DIV che contiene la scrollbar del pannello
  this.ScrollBoxInt = null;    // Il DIV all'interno di ScrollBox che serve per attivare e dimensionare la scrollbar
  //
  this.ScrollBoxTouch = null;  // Il DIV sovrapposto a ScrollBox per dispositivi touch
  this.ScrollIntTouch = null;  // Il DIV intero a ScrollBoxTouch per i dispositivi touch (scrollbar)
  //
  this.RowSel = null;          // Array per i row selectors (se presenti)
  this.UpdateRSel = false;     // Usato per indicare se occorre aggiornare i RowSel quando non ho ancora le righe!
  //
  // Oggetti DOM per Toolbar
  this.StatusBar = null;            // Span contenente la status bar del pannello
  this.QBETIcon = null;             // Immagine per i QBETip
  this.TopButton = null;            // IMG rappresentante il pulsante di Top
  this.PrevButton = null;           // IMG rappresentante il pulsante di Prev
  this.NextButton = null;           // IMG rappresentante il pulsante di Next
  this.BottomButton = null;         // IMG rappresentante il pulsante di Bottom
  this.SearchButton = null;         // IMG che rappresenta il pulsante di ingresso in QBE
  this.FindButton = null;           // IMG che rappresenta il pulsante FIND DATA
  this.CancelButton = null;         // IMG che rappresenta il pulsante di annullamento modifiche
  this.FormListButton = null;       // IMG che rappresenta il pulsante di cambio di modo (lista/dettaglio)
  this.RefreshButton = null;        // IMG che rappresente il pulsante di aggiornamento dei dati
  this.DelButton = null;            // IMG che rappresenta il pulsante di cancellazione dei dati
  this.NewButton = null;            // IMG che rappresenta il pulsante di inserimento
  this.DuplButton = null;           // IMG che rappresente il pulsante di duplicazione
  this.SaveButton = null;           // IMG che rappresenta il pulsante di save
  this.PrintButton = null;          // IMG che rappresenta il pulsante di stampa
  this.CsvButton = null;            // IMG che rappresenta il pulsante di esportazione
  this.AttachButton = null;         // IMG che rappresenta il pulsante degli attachments
  this.GroupButton = null;          // IMG che rappresenta il pulsante della raggruppabilita'
  this.CustomButtons = null;        // IMGs che rappresentano i custom commands
  this.TBZones = null;              // SPANs che suddividono la toolbar in parti
  //
  this.MultiSelectAllCmd = null;    // IMG per selezionare tutte le righe
  this.MultiSelectNoneCmd = null;   // IMG per togliere la selezione da tutte le righe
  this.ToggleMultiSelCmd = null;    // IMG per mettere o togliere i check della multiselezione
  //
  // Altre variabili globali
  this.LastPositionTime = null;     // Data e ora dell'ultimo posizionamento (per evitare scrolling durante esso)
  this.OldAttR = 0;                 // Ultima riga selezionata (usata nel posizionamento ritardato)
  this.QBETipBox = null;            // Oggetto MessageTooltip che mostra i QBETip
  this.Realizing = false;           // Indica stato di realizzazione per velocizzare operazioni
  this.AnimatingPanel = false;      // Sul pannello e' attiva una animazione?
  this.ListListZIndex = -1;         // ZIndex degli oggetti ListList
  this.ScrollTimer = 0;             // Timer per programmare lo scroll finale
  this.SkipScroll = -1;             // Variabile per saltare l'onscroll quando impostato da javascript
  this.FluidRows = 1;
  //
  this.RefreshRowsClasses = false;
  this.RowsToRefresh = new Array();
}
//
// Definisco l'estensione della classe
IDPanel.prototype = new WebFrame();


// *******************************************************************
// Inizializza questo Tree leggendo i dati da un nodo <wfr> XML
// *******************************************************************
IDPanel.prototype.LoadFromXml = function(node) 
{
  // Chiamo la classe base
  WebFrame.prototype.LoadFromXml.call(this, node);
  //
  // Carico campi del pannello
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
      case "fld":
      {
        var newfld = new PField(this);
        this.Fields.push(newfld);
        newfld.LoadFromXml(objnode);        
      }
      break;
      
      case "grp":
      {
        // Leggo il nodo di primo livello, e poi passo il messaggio
        // di caricamento
        var newgrp = new PGroup(this);
        newgrp.LoadFromXml(objnode);
        this.Groups.push(newgrp);
      }
      break;
      
      case "ppg":
      {
        // Leggo il nodo di primo livello, e poi passo il messaggio
        // di caricamento
        var newppg = new PPage(this);
        newppg.LoadFromXml(objnode);
        this.Pages.push(newppg);
      }
      break;
      
      case "lsg":
      {
        // Se ho dei gruppi li devo rimuovere prima di creare quelli nuovi
        if (this.ListGroupRoot)
        {
          this.ResetGroups();
          this.UpdateListGroups = true;
        }
        //
        // Leggo il nodo di primo livello, e poi passo il messaggio
        // di caricamento
        var newgrp = new PListGroup(this);
        newgrp.LoadFromXml(objnode);
        //
        // Lo memorizzo come nodo Root dei gruppi in lista
        this.ListGroupRoot = newgrp;
        // 
        // Aggiorno la posizione attuale
        this.CompactActualPosition = this.ListGroupRoot.GetRowPos(this.ActualPosition);
        //
        // Se il pannello e' interamente vuoto allora e' come se non fosse gruppato
        if (this.GetTotalRows() === 0)
          this.CompactActualPosition = 1;
      }
      break;
    }
  }    
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
IDPanel.prototype.LoadProperties = function(node)
{
  // Chiamo la classe base
  WebFrame.prototype.LoadProperties.call(this, node);
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
      case "mod": this.SetPanelMode(parseInt(attrnode.nodeValue)); break;
      case "sta": this.SetPanelStatus(parseInt(attrnode.nodeValue)); break;
      case "num": this.SetNumRows(parseInt(attrnode.nodeValue)); break;
      case "mhr": this.SetMaxHRow(parseInt(attrnode.nodeValue)); break;
      case "pag": this.SetPanelPage(parseInt(attrnode.nodeValue)); break;
      case "hds": this.SetHeaderSize(parseInt(attrnode.nodeValue)); break;
      case "srs": this.SetShowRowSelector(attrnode.nodeValue=="1"); break;
      case "sms": this.SetShowMultipleSel(attrnode.nodeValue=="1"); break;
      case "ems": this.SetEnableMultipleSel(attrnode.nodeValue=="1"); break;
      case "sov": this.SetSelAllOnlyVis(attrnode.nodeValue=="1"); break;
      case "dyr": this.SetDynamicRows(parseInt(attrnode.nodeValue)); break;
      case "dyh": this.SetDynamicHeight(attrnode.nodeValue=="1"); break;
      case "hsc": this.SetHasScrollbar(attrnode.nodeValue=="1"); break;
      case "hli": this.SetHasList(attrnode.nodeValue=="1"); break;
      case "hfo": this.SetHasForm(attrnode.nodeValue=="1"); break;
      case "upd": this.SetCanUpdate(attrnode.nodeValue=="1"); break;
      case "del": this.SetCanDelete(attrnode.nodeValue=="1"); break;
      case "ins": this.SetCanInsert(attrnode.nodeValue=="1"); break;
      case "sea": this.SetCanSearch(attrnode.nodeValue=="1"); break;
      case "sor": this.SetCanSort(attrnode.nodeValue=="1"); break;
      case "lle": this.SetListLeft(parseInt(attrnode.nodeValue)); break;
      case "lto": this.SetListTop(parseInt(attrnode.nodeValue)); break;
      case "lwi": this.SetListWidth(parseInt(attrnode.nodeValue)); break;
      case "lhe": this.SetListHeight(parseInt(attrnode.nodeValue)); break;
      case "atr": this.SetActualRow(parseInt(attrnode.nodeValue),node.attributes["ftr"]!=undefined, true); break;
      case "vre": this.SetVResMode(parseInt(attrnode.nodeValue)); break;
      case "hre": this.SetHResMode(parseInt(attrnode.nodeValue)); break;
      case "sty": this.SetVisualStyle(parseInt(attrnode.nodeValue)); break;
      case "fix": this.SetFixedColumns(parseInt(attrnode.nodeValue)); break;
      case "qtp": this.SetQbeTip(attrnode.nodeValue); break;
      case "acp": this.SetActualPosition(parseInt(attrnode.nodeValue), true, true); break;
      case "tot": this.SetTotalRows(parseInt(attrnode.nodeValue)); break;
      case "enc": this.SetEnabledCommands(parseInt(attrnode.nodeValue)); break;
      case "eec": this.SetExtEnabledCommands(parseInt(attrnode.nodeValue)); break;
      case "bok": this.SetHasBook(attrnode.nodeValue=="1"); break;
      case "dom": this.SetDOModified(attrnode.nodeValue=="1"); break;
      case "mst": this.SetDOMaster(attrnode.nodeValue=="1"); break;
      case "csa": this.SetDOCanSave(attrnode.nodeValue=="1"); break;
      case "sdo": this.SetSingleDoc(attrnode.nodeValue=="1"); break;
      case "mor": this.SetMoreRows(attrnode.nodeValue=="1"); break;
      case "ata": this.SetAdvancedTabOrder(attrnode.nodeValue=="1"); break;
      case "arc": this.SetActivateRightClick(attrnode.nodeValue=="1"); break;
      case "inf": this.SetInfoMessages(attrnode.nodeValue=="1"); break;
      case "cde": this.SetConfirmDelete(attrnode.nodeValue=="1"); break;
      case "hde": this.SetHighlightDelete(attrnode.nodeValue=="1"); break;
      case "cbk": this.SetBlockingCommands(parseInt(attrnode.nodeValue)); break;
      case "rcl": this.SetCanReorderColum(attrnode.nodeValue=="1"); break;
      case "rsc": this.SetCanResizeColum(attrnode.nodeValue=="1"); break;
      case "grn": this.SetGroupingEnabled(attrnode.nodeValue=="1"); break;
      case "sgr": this.SetShowGroups(attrnode.nodeValue=="1"); break;
      case "tor": this.SetTooltipOnEachRow(attrnode.nodeValue=="1"); break;
      case "eil": this.SetEnableInsertWhenLocked(attrnode.nodeValue=="1"); break;
      case "rvf": this.SetResOnlyVisFlds(attrnode.nodeValue=="1"); break;
      case "vfl": this.SetVisualFlags(parseInt(valore)); break;
      case "dsn": this.SetTableName(valore); break;
      case "qbf": this.SetAutomaticLayout(attrnode.nodeValue=="1"); break;
      case "ido": this.SetIsDO(attrnode.nodeValue=="1"); break;
      case "hdt": this.SetHasDocTemplate(attrnode.nodeValue=="1"); break;
      case "lpl": this.SetLoadingPolicy(parseInt(valore)); break;
      case "pre": this.SetPullToRefresh(attrnode.nodeValue=="1"); break;
      case "lqb": this.SetUseListQBE(attrnode.nodeValue); break;
      case "pfp": this.SetFluidPanel(attrnode.nodeValue == "1"); break;
      case "amp": this.SetAllowPanelNavigation(valore == "1"); break;
      
      case "rck": this.RowSelectEventDef = parseInt(attrnode.nodeValue); break;
      case "pck": this.PageClickEventDef = parseInt(attrnode.nodeValue); break;
      case "tck": this.ToolbarEventDef = parseInt(attrnode.nodeValue); break;
      case "sck": this.ScrollEventDef = parseInt(attrnode.nodeValue); break;
      case "mse": this.MultiSelEventDef = parseInt(attrnode.nodeValue); break;
      case "fed": this.FocusEventDef = parseInt(attrnode.nodeValue); break;
      case "tsk": this.TextSelEventDef = parseInt(valore); break;
      case "moe": this.MouseOverEventDef = parseInt(attrnode.nodeValue); break;
      
      case "cla": this.ChangeLayoutAnimDef = valore; break;
      case "qta": this.QBETipAnimDef = valore; break;
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
IDPanel.prototype.ChangeProperties = function(node)
{
  // Vediamo se nel nodo di cambiamento sono indicati nuovi valori per i campi
  var objlist = node.childNodes;
  var n = objlist.length;
  for (var i = 0; i<n; i++)
  {
    var fv = objlist.item(i);
    //
    if (fv.nodeName == "fvl")
    {
      this.ResetPosition = true; // Al termine dovro' mostrare i valori
      this.ScrollToPos = true;   // In modo scrolling
      //
      // Prelevo il campo correlato
      var id = fv.getAttribute("id");
      var fld = RD3_DesktopManager.ObjectMap[id];
      if (fld)
        fld.LoadFromXml(fv);
    }
    //
    if (fv.nodeName == "lsg")
    {
      // Se ho dei gruppi li devo rimuovere prima di creare quelli nuovi
      if (this.ListGroupRoot)
        this.ResetGroups();
      //
      // Leggo il nodo di primo livello, e poi passo il messaggio
      // di caricamento
      var newgrp = new PListGroup(this);
      newgrp.LoadFromXml(fv);
      //
      // Lo memorizzo come nodo Root dei gruppi in lista
      this.ListGroupRoot = newgrp;
      //
      this.UpdateListGroups = true;
      //
      // Aggiorno la poszione attuale
      this.CompactActualPosition = this.ListGroupRoot.GetRowPos(this.ActualPosition);
    }
  }
  //
  // Proseguo con il cambio di proprieta'
  this.LoadProperties(node);
}


// *******************************************************************
// Setter delle proprieta'
// *******************************************************************
IDPanel.prototype.SetPanelMode= function(value, immediate) 
{
  var old = this.PanelMode;
  //
  // Passaggio da list a form...
  if (this.PanelMode==RD3_Glb.PANEL_LIST && value==RD3_Glb.PANEL_FORM)
    this.ListPos = this.ActualPosition;
  //
  if (value!=undefined)
    this.PanelMode = value;
  //
  if (this.Realized && (old!=this.PanelMode || value==undefined))
  {
    if (this.IDScroll && RD3_Glb.IsSmartPhone() && this.CanSearch)
      this.IDScroll.MarginTop = (this.PanelMode==RD3_Glb.PANEL_LIST)?44:0;
    //
    // Se sto cambiando layout
    if (!this.Realizing)
    {
      // Non posso effettuare scroll
      this.DenyScroll=true;
      //
      // Devo informare i gruppi del loro stato di collassamento
      var ng = this.Groups.length;
      for (var i=0; i<ng; i++)
        this.Groups[i].SetCollapsed();
      //
      // Verifico se c'e' un ActiveElement che riguarda un PValue appartenente a me: 
      // se lo e' e riguarda il layout che ho spento lo annullo
      // Infatti puo' capitare che l'activeelement rimanga impostato
      // ad un campo dlla lista quando invece il pannello e' gia' in form
      if (RD3_KBManager.ActiveElement)
      {
        var obj = RD3_KBManager.GetObject(RD3_KBManager.ActiveElement, true);
        //
        if (obj && obj instanceof PValue && obj.ParentField.ParentPanel==this)
        {
          // Come in RD3_KBManager.GetObject devo risalire la catena per cercare il primo oggetto con l'ID
          var objEl = RD3_KBManager.ActiveElement;
          while(!objEl.id && objEl.parentNode)
            objEl = objEl.parentNode;
          //
          var isList = objEl.id.indexOf(":lv") >= 0;
          if ((this.PanelMode==RD3_Glb.PANEL_LIST && !isList) || (this.PanelMode!=RD3_Glb.PANEL_LIST && isList))
            RD3_KBManager.ActiveElement = null;
        }
      }
    }
    //
    // Innesco ridimensionamento?
    if (old!=this.PanelMode && this.PanelMode==RD3_Glb.PANEL_LIST && this.LastListResizeW>0)
    {
      if (this.LastListResizeW!=this.Width || this.LastListResizeH!=this.Height)
      {
        this.SendResize = true;
        this.DeltaW = this.Width - this.LastListResizeW;
        this.DeltaH = this.Height - this.LastListResizeH;
      }
    }
    //
    if (old!=this.PanelMode && this.PanelMode==RD3_Glb.PANEL_FORM && this.LastFormResizeW>0)
    {
      if (this.LastFormResizeW!=this.Width || this.LastFormResizeH!=this.Height)
      {
        this.SendResize = true;
        this.DeltaW = this.Width - this.LastFormResizeW;
        this.DeltaH = this.Height - this.LastFormResizeH;
      }
    }  
    //
    // Se il pannello e' gruppato e sono passato in lista allora infilo i gruppi negli array dei PValues dei PField
    if (this.IsGrouped() && (this.PanelMode==RD3_Glb.PANEL_LIST||this.PanelMode==-1))
      this.UpdateListGroups = true;
    //  
    //
    if (value==RD3_Glb.PANEL_LIST && this.NumRows==1 && !this.SendResize && !this.DynamicRows)
    {
      // Sono tornato in lista, se il numero di righe e' 1 allora forse non ero ancora mai
      // andato in lista, quindi stimo quante righe ci vanno prima che me lo dica il server
      // Questo mi permette di preparare il pannello prima e l'utente attende meno tempo
      //
      // Per sapere quante righe ci stanno, tolgo dall'altezza del pannelo l'intestazione ed il GAP intestazione-righe
      // (se c'e' l'intestazione)
      var rowsh = this.ListHeight - (this.HeaderSize > 0 ? this.HeaderSize + this.VisStyle.GetHeaderOffset() : 0) - this.GetHeaderSearchOffset();
      //
      // Ora il numero di righe lo calcolo cosi'. Sommo a quel che e' rimasto sopra un GAP tra le righe
      // (se il pannello ha 6 righe ci sono solo 5 gap!). Poi divido per l'altezza di ogni riga (compreso il suo GAP)
      var n = Math.floor((rowsh+this.VisStyle.GetRowOffset())/this.GetRowHeight());
      //
      this.SetNumRows(n);
      this.SetActualPosition();
      //
      // Ho fatto io il SetActualPosition, non c'e' bisogno di spingerlo alla fine della richiesta
      this.ResetPosition = false;
    }    
    //
    if (this.PanelMode==RD3_Glb.PANEL_LIST && !this.Realizing && !RD3_Glb.IsMobile())
      this.ListBox.style.visibility = "hidden";
    //
    if (!this.Realizing)
    {
      var n = this.Fields.length;
      for (var i=0; i<n; i++)
      {
        var f = this.Fields[i];
        f.UpdateFieldVisibility();
        //
        if (f.MultiUpload)
        {
          // Sposto il contenuto del campo nel nuovo layout
          if (this.PanelMode==RD3_Glb.PANEL_LIST && f.ListCaptionBox && f.FormCaptionBox)
            f.ListCaptionBox.appendChild(f.FormCaptionBox.firstChild);
          else if (this.PanelMode==RD3_Glb.PANEL_FORM && f.FormCaptionBox && f.ListCaptionBox)
            f.FormCaptionBox.appendChild(f.ListCaptionBox.firstChild);
        }
      }
    }
    //
    if (this.PanelMode==RD3_Glb.PANEL_LIST && !this.Realizing && !RD3_Glb.IsMobile())
      this.ListBox.style.visibility = "";
    //
    // Dato che ho cambiato il layout... meglio riposizionare le SortImages dei campi
    if (old!=this.PanelMode && this.PanelMode==RD3_Glb.PANEL_LIST)
      this.AdaptFieldsSortImage = true;
    //
    var skip = (value==undefined) || (old ==this.PanelMode) || (this.WebForm.Animating && !RD3_Glb.IsMobile()) || !this.HasList || !this.HasForm;
    if (RD3_Glb.IsMobile())
    {
      // In caso mobile, uso un sistema di animazione diverso.     
      if (skip)
      {
        // IMMEDIATA: arrivo gia' nello stato finale
        // Uso setdisplay per impostare anche la visibilita' a hidden
        if (this.ListBox)
          this.ListBox.style.visibility = (this.PanelMode==RD3_Glb.PANEL_LIST)?"":"hidden";
        if (this.FormBox)
          this.FormBox.style.visibility = (this.PanelMode==RD3_Glb.PANEL_LIST)?"hidden":"";
        if (this.PagesBox)
          this.PagesBox.style.visibility = (this.PanelMode==RD3_Glb.PANEL_LIST)?"hidden":"";
      }
      else
      {
        // DIFFERITA: mostro i due div, poi li sposto con una funzione ritardata
        // Attenzione la visibilita' verra' impostata solo dopo
        this.ListBox.style.visibility  = "";
        this.FormBox.style.visibility  = "";
        if (this.PagesBox)
            this.PagesBox.style.visibility  = "";
        if (this.ScrollBoxMobile)
          this.ScrollBoxMobile.style.display = "none";
        //
        // I bottoni Search e FormList devono essere attivati solo se serve, altrimenti
        // appaiono e poi scompaiono piu' tardi nell'updatetoolbar. Per questa ragione
        // ho copiato alcune righe di codice dalla updatetoolbar a qui.
        if (this.CanSearch && this.PanelMode==RD3_Glb.PANEL_LIST && this.Locked)
        {
          this.SearchBox.style.display="";
          if (this.SearchMargin) this.SearchMargin.style.display="";
        }
        var cannav = this.CanNavigate();
        var canchg = this.IsCommandEnabled(RD3_Glb.PCM_FORMLIST) && (this.Status != RD3_Glb.PS_QBE || !this.AutomaticLayout) && (this.Status == RD3_Glb.PS_QBE || cannav) && this.HasList && this.HasForm;
        canchg &= this.PanelMode==RD3_Glb.PANEL_FORM && this.Locked; // Caso Mobile: il tasto form list e' solo in form per tornare in list, solo se il pannello e' bloccato
        if (canchg)
          this.FormListButtonCnt.style.display="";
        //
        // Se e' quadro, voglio che la toolbar si sistemi subito
        this.AnimatingToolbar = !RD3_Glb.IsQuadro();
        this.AnimatingPanel = true;
        //
        // Adatto il layout cosi' quando diventa visibile e' gia' a posto (Come in GFX)
        this.AdaptLayout();
        //
        if (RD3_Glb.IsQuadro())
          this.UpdateToolbar();
        //
        // Eseguo animazione
        this.OnFormListAni();
      }
    }
    else
    {
      // Imposto l'animazione: salto allo stato finale se non c'e' value oppure se il vecchio valore non e' cambiato
      var fx = new GFX("list", (this.PanelMode>old), this, skip, null, this.ChangeLayoutAnimDef);
      fx.Immediate = immediate;
      RD3_GFXManager.AddEffect(fx);
    }
  }
}

IDPanel.prototype.SetPanelStatus= function(value) 
{
  var old = this.Status;
  //
  if (value!=undefined)
    this.Status = value;
  //
  if (this.Realized && (value==undefined || old!=this.Status))
  {
    this.SetStatusBarText();
    if (!this.Realizing)
      this.SetCanSort();
    this.RefreshToolbar = true;
    this.ResetPosition = true;
    //
    // Se sono passato da QBE a DATA devo far riposizionare anche la scrollbar (ho cambiato riga, negli altri casi
    // la riga attuale non cambia..)
    if ((old == RD3_Glb.PS_QBE) && this.Status == RD3_Glb.PS_DATA && this.ScrollBox)
    {
      // Non posso mettere ScrollToPos a true perche' non farei la render dei campi ma solo la renderizzazione veloce 
      // e sbaglierei a disegnare le righe.
      // non posso riposizionare qui la scrollbar perche' l'utente potrebbe cambiare la riga attiva nell'afterfind
      // quindi mi memorizzo che devo comunque spostare la scrollbar alla fine di tutto, anche se ScrollToPos e' false
      this.QbeScroll = true;
    }
    //
    this.ScrollToPos = false;
    //
    // Se e' cambiato lo stato reimposto il visual style dei campi non obbligatori
    // in questo modo posso aggiornare il colore delle caption non obbligatorie
    if (old!=this.Status)
      this.UpdateNotNullFields();
  }
}


IDPanel.prototype.SetDOMaster= function(value) 
{
  if (value!=undefined)
    this.DOMaster = value;
  //
  if (this.Realized)
  {
    this.SetStatusBarText();
    this.RefreshToolbar = true;
  }
}

IDPanel.prototype.SetDOCanSave= function(value) 
{
  if (value!=undefined)
    this.DOCanSave = value;
  //
  if (this.Realized)
  {
    this.RefreshToolbar = true;
  }
}

IDPanel.prototype.SetDOModified= function(value) 
{
  if (value!=undefined)
    this.DOModified = value;
  //
  if (this.Realized)
  {
    this.SetStatusBarText();
    this.RefreshToolbar = true;
  }
}

IDPanel.prototype.SetSingleDoc= function(value) 
{
  if (value!=undefined)
    this.DOSingleDoc = value;
  //
  if (this.Realized)
  {
    this.SetStatusBarText();
    this.RefreshToolbar = true;
  }
}

IDPanel.prototype.SetNumRows= function(value) 
{
  var old = this.NumRows;
  //
  // Questo valore viene inviato dal server quando il pannello
  // va in form. Io non devo cambiare il numero di righe che
  // e' invece sepcifico della lista-
  if (value==1 && this.PanelMode==RD3_Glb.PANEL_FORM)
    return;
  //
  if (value!=undefined)
    this.NumRows = value;
  //
  if (this.NumRows<1)
    this.NumRows = 1;
  //
  if (this.Realized && (this.NumRows!=old || value==undefined))
  {
    // Passo il messaggio anche ai campi che devono sistemare
    // Gli oggetti visuali della lista
    if (!this.IsFluidPanel()) {
      var n = this.Fields.length;
      for (var i=0; i<n; i++)
      {
        this.Fields[i].SetNumRows(this.NumRows);
      }
    }
    else {
      if (!this.Rows)
        this.Rows = [];
      //
      if (this.NumRows > this.Rows.length) 
      {
        // Le righe sono aumentate, creo le righe mancanti
        var toCreate = this.NumRows - this.Rows.length;
        for (var i = 0; i < toCreate; i++) {
          var tr = document.createElement("div");
          tr.className = "list-fluid-row";
          tr.style.minWidth = this.FluidMinRowWidth + "px";
          this.ListListBox.appendChild(tr);
          this.Rows.push(tr);
          //
          for (var s = 0; s < this.FluidRows; s++) 
          {
            var str = document.createElement("div");
            str.className = "list-fluid-subrow";
            tr.appendChild(str);
            //
            str.style.minWidth = this.FluidMinRowWidth + "px";
          }
        }
      }
      else 
      {
        // le righe sono diminuite, rimuovo quelle in piu' dall'array
        var delRows = this.Rows.splice(this.NumRows, this.Rows.length - this.NumRows);
        for (var i = 0; i < delRows.length; i++)
          this.ListListBox.removeChild(delRows[i]);
      }
      //
      // Passo il messaggio anche ai campi che devono sistemare
      // Gli oggetti visuali della lista
      var visitedFlds = [];
      if (this.AdvTabOrder) 
      {
        // Per prima cosa lavoro gli oggetti delle lista nell'ordine vero della lista, cosi' nascono nell'ordine giusto
        // poi rifaccio un giro e lavoro tutti i campi saltati (in questo modo non salto nulla e non ho problemi)
        for (var j = 0; j < this.Fields.length; j++) 
        {
          var fl = this.ListTabOrder[j];
          if (fl && fl.InList && fl.ListList && !fl.IsStatic()) {
            fl.SetNumRows(this.NumRows);
            visitedFlds.push(fl);
          }
        }
      }
      //
      var n = this.Fields.length;
      for (var i = 0; i < n; i++)
        if (visitedFlds.indexOf(this.Fields[i]) == -1)
          this.Fields[i].SetNumRows(this.NumRows);
    }
    //
    // Sistemo i row selectors
    if (!this.Realizing)
      this.SetShowRowSelector();
    //
    this.RecalcLayout = true;
    //
    // Faccio una reset Position in modo da spingere la SetActualPosition alla fine della richiesta:
    // se arrivo qui da un resize la fa lui e poi annulla il flag, se arrivo qui dal server forzare 
    // la render non fa male, perche' altrimenti non lo farebbe nessuno..
    this.ResetPosition = true;
  }
}

IDPanel.prototype.SetMaxHRow= function(value) 
{
  if (value!=undefined)
    this.MaxHRow = value;
  //
  if (this.Realized)
  {
    this.RecalcLayout = true;
  }
}

IDPanel.prototype.SetPanelPage= function(value, immediate) 
{
  var old = this.PanelPage;
  //
  if (value!=undefined)
    this.PanelPage = value;
  //
  if (this.Realized && (value==undefined || old!=this.PanelPage))
  {
    // Ciclo su tutte le pagine e ne imposto la visibilita'
    var n = this.Pages.length;
    for (var i=0; i<n; i++)
      this.Pages[i].UpdateSelection();
    //
    // Aggioro la visibilita' dei gruppi
    var n = this.Groups.length;
    for (var i=0; i<n; i++)
      this.Groups[i].UpdateVisibility();
    //
    // Aggioro la visibilita' dei campi
    var n = this.Fields.length;
    for (var i=0; i<n; i++) 
    {
      this.Fields[i].UpdateFieldVisibility();
      //
      // Dobbiamo gestire i campi delayed che ora sono magari diventati visibili, se li vedo allora li gestisco, altrimenti
      // o rimane la lista vuota o mancano gli oggetti
      if (this.Fields[i].DelayedUpdate && !this.Fields[i].IsHidden())
        this.Fields[i].HandleDelayedUpdate();
    }
    //
    // Al termine devo adattare il layout e mostrare i valori
    if (immediate)
    {
      this.ResetPosition = true;
      this.AdaptLayout();
      if (this.ResetPosition)
        this.SetActualPosition();
    }
    else
    {
      this.RecalcLayout = true;
      this.ResetPosition= true;
    }
  }
}

IDPanel.prototype.SetHeaderSize= function(value) 
{
  if (value!=undefined)
    this.HeaderSize = value;
  //
  if (this.Realized)
  {
    this.RecalcLayout = true;
  }
}

IDPanel.prototype.SetLoadingPolicy= function(value) 
{
  if (value!=undefined)
    this.LoadingPolicy = value;
  //
  if (this.Realized)
  {
    if (this.LoadingPolicy==2 && this.MoreAreaBox)
    {
      // tolgo la more area box in basso nel list box
      this.MoreAreaBox.parentNode.removeChild(this.MoreAreaBox);
      this.MoreAreaBox = null;
      this.MoreButton = null;
    }
    if (this.LoadingPolicy<2 && RD3_Glb.IsMobile() && !this.MoreAreaBox && this.ListBox) // non continuous...
    {
      // Creo la more area box in basso nel list box
      this.MoreAreaBox = document.createElement("div");
      this.MoreAreaBox.className = "panel-more-area";
      this.MoreButton = document.createElement("div");
      this.MoreButton.className = "panel-more-button";
      this.MoreButton.textContent = ClientMessages.MOB_MORE_TEXT;
      var f = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMoreButton', ev)");
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        this.MoreButton.ontouchend = f;
      else
        this.MoreButton.onclick = f;
      this.MoreAreaBox.appendChild(this.MoreButton);
      this.ListBox.appendChild(this.MoreAreaBox);
      this.ListBox.style.overflow = "visible";
    }
    this.RecalcLayout = true;
  }
}


IDPanel.prototype.SetPullToRefresh= function(value) 
{
  if (value!=undefined)
    this.PullToRefresh = value;
  //
  if (this.Realized)
  {
    var ptr = this.PullToRefresh && this.Status!=RD3_Glb.PS_QBE && (!this.IsDO || this.HasDocTemplate);
    //
    if (!ptr && this.PullAreaBox)
    {
      this.PullAreaBox.parentNode.removeChild(this.PullAreaBox);
      this.PullAreaBox = null;
      this.PullArrow = null;
      this.PullText = null;
      if (this.IDScroll) 
        this.IDScroll.PullTrigger = 0;
    }
    if (ptr && !this.PullAreaBox && this.ListBox && RD3_Glb.IsMobile())
    {
      // Creo l'area di refresh
      this.PullAreaBox = document.createElement("div");
      this.PullAreaBox.className = "panel-pull-area"+(this.SearchAreaBox?" panel-pull-search":"");
      //
      this.PullArrow = document.createElement("span");
      this.PullArrow.className = "pull-arrow";
      this.PullAreaBox.appendChild(this.PullArrow);
      //
      this.PullText = document.createElement("span");
      this.PullText.className = "pull-text";
      this.PullText.textContent = ClientMessages.MOB_PULL_TEXT;
      this.PullAreaBox.appendChild(this.PullText);
      //
      this.ListBox.appendChild(this.PullAreaBox);
      this.ListBox.style.overflow = "visible";
      this.RecalcLayout = true;
    }
  }
}


IDPanel.prototype.SetUseListQBE= function(value) 
{
  if (value!=undefined)
    this.UseListQBE = value;
  //
  // Non puo' cambiare a run-time, verra' usato dai campi per disegnarsi in maniera speciale
}


IDPanel.prototype.SetShowRowSelector= function(value) 
{
  var old = this.ShowRowSelector;
  if (value!=undefined)
    this.ShowRowSelector = value;
  //
  if (this.Realized)
  {
    if (this.IsFluidPanel() && this.ListBox)
      RD3_Glb.SetClass(this.ListBox, "has-row-selector", this.ShowRowSelector);
    //
    if (!this.ShowRowSelector && this.RowSel)
    {
      // Se non ci sono i row selector, li tolgo dal video
      var n = this.RowSel.length;
      for (var i=0; i<n; i++)
      {
        this.RowSel[i].parentNode.removeChild(this.RowSel[i]);
      }
      this.RowSel = null;
      //
      // Sistemo il pannello perche' i campi devono spostarsi
      this.RecalcLayout = true;
    }
    //
    // Realizzo anche i row selector se non lo avevo gia' fatto
    if (this.ShowRowSelector && this.ListBox)
    {
      // In questo caso devo creare un div di 'tappo' sulla sinistra
      if (this.UseListQBE == RD3_Glb.PAN_QBEROW && RD3_ServerParams.CompletePanelBorders && !this.ListQBELCap) 
      {
        this.ListQBELCap = document.createElement("div");
        this.ListQBELCap.className = "panel-field-value-list filter-clear-btn";
        this.ListQBELCap.style.zIndex = this.ListListZIndex;
        if (this.VisStyle)
          this.VisStyle.ApplyBorderStyle(this.ListQBELCap, 1);
        //
        if (!this.IsFluidPanel())
          this.ListBox.appendChild(this.ListQBELCap);
        else 
        {
          this.ListQBELCap.className += " list-rs-cap";
          if (this.ListQBEFluidRow.firstChild.firstChild)
            this.ListQBEFluidRow.firstChild.insertBefore(this.ListQBELCap, this.ListQBEFluidRow.firstChild.firstChild);
          else
            this.ListQBEFluidRow.firstChild.appendChild(this.ListQBELCap);
        }
        //
        var intCap = document.createElement("img");
        intCap.src = RD3_Glb.GetImgSrc("images/filter_clear.png");
        intCap.className = "panel-row-selector";
        if (!RD3_ServerParams.Theme.startsWith("zen"))
          intCap.style.padding = "0px";
        this.ListQBELCap.appendChild(intCap);
        //
        var _this = this;
        this.ListQBELCap.onclick = function(ev) {
          var ev = new IDEvent("qbeclall", _this.Identifier, null, RD3_Glb.EVENT_URGENT);
        }
      }
      //
      if (!this.RowSel)
        this.RowSel = new Array();
      //
      if (this.RowSel.length!=this.NumRows)
      {
        // Creo o distruggo i row sel, poi adatto il layout
        var n = this.RowSel.length;
        for (var i=this.NumRows; i<n; i++)
          this.RowSel[i].parentNode.removeChild(this.RowSel[i]);
        //
        this.RowSel.length = this.NumRows;
        //
        var rsimg = RD3_Glb.GetImgSrc("images/rs.gif");
        for (var i=0; i<this.NumRows; i++)
        {
          if (!this.RowSel[i])
          {
            var rs = null;
            if (this.ShowMultipleSel)
            {
              rs = document.createElement("input");
              rs.type = "checkbox";
              rs.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelClick', ev)");
            }
            else
            {
              rs = document.createElement("img");
              rs.src = rsimg;
              rs.removeAttribute("width");
              rs.removeAttribute("height");
              rs.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnRowSelectorClick', ev)");
            }
            rs.setAttribute("id", this.Identifier+":rs"+i);
            rs.className = "panel-row-selector";
            rs.style.zIndex = this.ListListZIndex;
            //
            if (RD3_ServerParams.CompletePanelBorders)
            {
              var rsouter = document.createElement("div");
              rsouter.className = "panel-field-value-list panel-outer-row-sel";
              rsouter.style.zIndex = this.ListListZIndex;
              if (this.VisStyle)
                this.VisStyle.ApplyBorderStyle(rsouter, 1);
              //
              rsouter.appendChild(rs);
              if (!this.IsFluidPanel())
                this.ListBox.appendChild(rsouter);
              else 
              {
                if (this.Rows[i].firstChild.firstChild)
                  this.Rows[i].firstChild.insertBefore(rsouter, this.Rows[i].firstChild.firstChild);
                else
                  this.Rows[i].firstChild.appendChild(rsouter);
              }
              //
              rs.style.position = "static";
              rs.style.padding = "0px";
              if (this.ShowMultipleSel && !RD3_Glb.IsIE(10, false))
                rs.style.margin = (RD3_ServerParams.Theme.startsWith("zen") ? "7px 8px" : "1px");
              //
              if (RD3_Glb.IsIE(10, false))
              {
                rs.style.position = "relative";
                rs.style.left = "-1px";
                rs.style.top = "-1px";
              }
              //
              rs = rsouter;
            }
            else
            {
              if (!this.IsFluidPanel())
                this.ListBox.appendChild(rs);
              else
              {
                if (this.Rows[i].firstChild.firstChild)
                  this.Rows[i].firstChild.insertBefore(rs, this.Rows[i].firstChild.firstChild);
                else
                  this.Rows[i].firstChild.appendChild(rs);
              }
            }
            //
            this.RowSel[i] = rs;
          }
        }
        //
        // Aggiorno lo stato della multiselezione
        this.UpdateMultipleSel();
        //
        this.RecalcLayout = true;
        //
        // Se cambio i row sel devo fare una set actual position per far si che i pvalues disegnino le immagini giuste
        // in base al loro stato
        if (!this.ShowMultipleSel && old!=this.ShowRowSelector)
          this.ResetPosition = true;
      }
    }
  }
}

IDPanel.prototype.SetAdvancedTabOrder= function(value) 
{
  if (value!=undefined)
    this.AdvTabOrder = value;
  //
  // Questa proprieta' viene modificata solo durante l'inizializzazione
}

IDPanel.prototype.SetActivateRightClick= function(value) 
{
  if (value!=undefined)
    this.ActivateRightClick = value;
  //
  // Questa proprieta' deve essere valutata quando renderizzo i controlli
}

IDPanel.prototype.SetInfoMessages= function(value) 
{
  if (value!=undefined)
    this.InfoMessage = value;
  //
  if (this.Realized && value!=undefined)
  {
    // Il server ha cambiato il valore, devo modificare il layout dei messaggi
    this.WebForm.RealizeMessages();
  }
}

IDPanel.prototype.SetConfirmDelete= function(value) 
{
  if (value!=undefined)
    this.ConfirmDelete = value;
  //
  // Questa proprieta' viene valutata solo durante il click sulla toolbar quindi non
  // sono necessarie ulteriori operazioni
}

IDPanel.prototype.SetHighlightDelete= function(value) 
{
  if (value!=undefined)
    this.HighlightDelete = value;
  //
  // Questa proprieta' viene valutata solo durante il click sulla toolbar quindi non
  // sono necessarie ulteriori operazioni
}

IDPanel.prototype.SetBlockingCommands= function(value) 
{
  if (value!=undefined)
    this.BlockingCommands = value;
  //
  // Questa proprieta' non richiede altro... da ora in poi i comandi richiesti generano eventi bloccanti
}

IDPanel.prototype.SetCanReorderColum= function(value) 
{
  if (value!=undefined)
    this.CanReorderColumn = value;
  //
  // Questa proprieta' non richiede altro...
}

IDPanel.prototype.SetCanResizeColum= function(value) 
{
  if (value!=undefined)
    this.CanResizeColumn = value;
  //
  // Questa proprieta' non richiede altro...
}

IDPanel.prototype.SetGroupingEnabled= function(value) 
{
  if (value!=undefined)
    this.GroupingEnabled = value;
  //
  // Se sono realizzato faccio aggiornare la toolbar
  if (this.Realized)
    this.RefreshToolbar = true;
}

IDPanel.prototype.SetShowGroups= function(value) 
{
  if (value!=undefined)
    this.ShowGroups = value;
  //
  // Se sono realizzato faccio aggiornare la toolbar
  if (this.Realized && this.IsGrouped())
  {
    // Imposto la posizione attuale
    this.CompactActualPosition = this.ListGroupRoot.GetRowPos(this.ActualPosition);
    //
    this.RefreshToolbar = true;
  }
}


IDPanel.prototype.SetShowMultipleSel= function(value) 
{
  var old = this.ShowMultipleSel;
  //
  if (value!=undefined)
    this.ShowMultipleSel = value;
  //
  if (this.Realized && this.EnableMultipleSel && (old!=this.ShowMultipleSel || value==undefined))
  {
    // Cambio i comandi nella toolbar, poi sistemo i rowselector (se mostrati)
    if (this.MultiSelectAllCmd || (RD3_ServerParams.CompletePanelBorders && this.ToggleMultiSelCmd))
    {
      if (this.MultiSelectAllCmd)
      {
        if (!RD3_Glb.IsMobile()) this.ToggleMultiSelCmd.src = RD3_Glb.GetImgSrc(this.ShowMultipleSel?"images/pansel.gif":"images/pansel1.gif");
        var hlimit = RD3_ServerParams.CompletePanelBorders ? 0 : 32;
        this.MultiSelectAllCmd.style.display = (this.ShowMultipleSel && this.HeaderSize >= hlimit)?"":"none";
        this.MultiSelectNoneCmd.style.display = (this.ShowMultipleSel && this.HeaderSize >= hlimit)?"":"none";
        RD3_TooltipManager.SetObjTitle(this.ToggleMultiSelCmd, ((this.ShowMultipleSel)?RD3_ServerParams.TooltipShowRowSel:RD3_ServerParams.TooltipShowCheck) + RD3_KBManager.GetFKTip(RD3_ClientParams.FKSelTog));
      }
      else if (RD3_ServerParams.CompletePanelBorders && this.ToggleMultiSelCmd)
      {
        if (!RD3_Glb.IsMobile()) this.ToggleMultiSelCmd.src = RD3_Glb.GetImgSrc("images/pansel1.gif");
      }
      //
      // Questo serve per cambiare i rowsel da bottoni attivatori a checkboxes
      if (this.ShowRowSelector)
      {
        this.SetShowRowSelector(false);
        this.SetShowRowSelector(true);        
        this.UpdateRSel = true;
      }
      else if (RD3_Glb.IsMobile())
      {
        this.UpdateMultipleSel();
        this.RefreshToolbar = true;
      }
    }
  }
}

IDPanel.prototype.SetEnableMultipleSel= function(value) 
{
  if (value!=undefined)
  {
    if (!value)
      this.SetShowMultipleSel(false);
    this.EnableMultipleSel = value;
  }
  //
  if (this.Realized && this.ListBox)
  {
    // Se necessario creo la Box per la caption della multiselezione
    if (RD3_ServerParams.CompletePanelBorders && !this.ToggleMultiSelBox)
    {
      this.ToggleMultiSelBox = document.createElement("div");
      this.ToggleMultiSelBox.className = "panel-field-caption-list";
      this.ToggleMultiSelBox.style.zIndex = this.ListListZIndex;
      if (!this.IsFluidPanel())
        this.ListBox.appendChild(this.ToggleMultiSelBox);
      else 
      {
        if (this.ListFluidHeader.firstChild.firstChild)
          this.ListFluidHeader.firstChild.insertBefore(this.ToggleMultiSelBox, this.ListFluidHeader.firstChild.firstChild);
        else
          this.ListFluidHeader.firstChild.appendChild(this.ToggleMultiSelBox);
        this.ToggleMultiSelBox.className += " fluid-header-commands";
      }
      //
      if (this.VisStyle)
        this.VisStyle.ApplyValueStyle(this.ToggleMultiSelBox, true, true, false, false, false, false, false, "left", false, false); // Header in lista
      //
      if (RD3_ServerParams.Theme.startsWith("zen")) {    // No right border for ZEN
        if (!RD3_Glb.IsIE(10,false))
          this.ToggleMultiSelBox.style.setProperty("border-right","none","important");
        else
          this.ToggleMultiSelBox.style.borderRight = "none";
        if (RD3_Glb.IsIE())
          this.ToggleMultiSelBox.style.borderBottomWidth = "0px";
      }
    }
    //
    // Creo/distruggo toolbar di selezione multipla
    if (!this.EnableMultipleSel)
    {
      if (this.MultiSelectAllCmd)
        this.MultiSelectAllCmd.parentNode.removeChild(this.MultiSelectAllCmd);
      if (this.MultiSelectNoneCmd)
        this.MultiSelectNoneCmd.parentNode.removeChild(this.MultiSelectNoneCmd);
      if (this.ToggleMultiSelCmd)
        this.ToggleMultiSelCmd.parentNode.removeChild(this.ToggleMultiSelCmd);
      this.MultiSelStatus = null;
      //
      // Annullo anche i puntatori
      this.MultiSelectAllCmd = null;
      this.MultiSelectNoneCmd = null;
      this.ToggleMultiSelCmd = null;
      //
      if (this.ToggleMultiSelBox)
      {
        this.ToggleMultiSelBox.onclick = "";
        this.ToggleMultiSelBox.style.cursor = "";
      }
    }
    else
    {
      if (!this.ToggleMultiSelCmd)
      {
        // Creo i comandi, poi li posiziona la recalc
        this.ToggleMultiSelCmd = document.createElement("img");
        this.ToggleMultiSelCmd.setAttribute("id", this.Identifier+":ms0");
        this.ToggleMultiSelCmd.className = "panel-multisel-command";
        if (!RD3_Glb.IsMobile()) this.ToggleMultiSelCmd.src = RD3_Glb.GetImgSrc("images/pansel.gif");
        if (RD3_ServerParams.CompletePanelBorders)
          this.ToggleMultiSelCmd.onclick = new Function("ev","RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'selms');  RD3_Glb.StopEvent(ev);");
        else
          this.ToggleMultiSelCmd.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'seltog')");
        this.ToggleMultiSelCmd.style.zIndex = this.ListListZIndex;
        //
        if (RD3_ServerParams.CompletePanelBorders)
        {
          this.ToggleMultiSelBox.appendChild(this.ToggleMultiSelCmd);
          this.ToggleMultiSelBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'selms')");
          this.ToggleMultiSelBox.style.cursor = "pointer";
        }
        else if (!this.IsFluidPanel())
          this.ListBox.appendChild(this.ToggleMultiSelCmd);
        else
        {
          this.ListFluidHeader.firstChild.appendChild(this.ToggleMultiSelCmd);
          this.ToggleMultiSelCmd.className += " fluid-header-commands";
        }
        //
        if (!RD3_ServerParams.CompletePanelBorders)
        {
          this.MultiSelectAllCmd = document.createElement("img");
          this.MultiSelectAllCmd.setAttribute("id", this.Identifier+":ms1");
          this.MultiSelectAllCmd.className = "panel-multisel-command";
          if (!RD3_Glb.IsMobile()) this.MultiSelectAllCmd.src = RD3_Glb.GetImgSrc("images/pansel1.gif");
          RD3_TooltipManager.SetObjTitle(this.MultiSelectAllCmd, RD3_ServerParams.TooltipSelectAll + RD3_KBManager.GetFKTip(RD3_ClientParams.FKSelAll));
          this.MultiSelectAllCmd.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'selall')");
          this.MultiSelectAllCmd.style.zIndex = this.ListListZIndex;
          this.ListBox.appendChild(this.MultiSelectAllCmd);
          //
          this.MultiSelectNoneCmd = document.createElement("img");
          this.MultiSelectNoneCmd.setAttribute("id", this.Identifier+":ms0");
          this.MultiSelectNoneCmd.className = "panel-multisel-command";
          if (!RD3_Glb.IsMobile()) this.MultiSelectNoneCmd.src = RD3_Glb.GetImgSrc("images/pansel0.gif");
          RD3_TooltipManager.SetObjTitle(this.MultiSelectNoneCmd, RD3_ServerParams.TooltipDeseleziona + RD3_KBManager.GetFKTip(RD3_ClientParams.FKSelNone));
          this.MultiSelectNoneCmd.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'selnone')");
          this.MultiSelectNoneCmd.style.zIndex = this.ListListZIndex;
          this.ListBox.appendChild(this.MultiSelectNoneCmd);
        }
        //
        this.RecalcLayout = true;
      }
      //
      if (this.MultiSelStatus==null)
        this.MultiSelStatus = new Array();
      //
      // Devo anche gestire la visibilita' corretta: ma lo fa la SetShowMultipleSel (lo faccio qui perche' c'e'
      // bisogno dell'array MultiSelStatus)
      this.SetShowMultipleSel();
    }    
  }
}

IDPanel.prototype.SetSelAllOnlyVis = function(value) 
{
  if (value!=undefined)
    this.SelAllOnlyVis = value;
  //
  // Questa proprieta' non richiede altro...
}

IDPanel.prototype.SetDynamicRows= function(value) 
{
  if (value!=undefined)
    this.DynamicRows = value;
  //
  // Nulla da fare ora, si vedra' al prossimo cambio di righe
}

IDPanel.prototype.SetDynamicHeight= function(value) 
{
  if (value!=undefined)
    this.DynamicHeight = value;
  //
  // Nulla da fare ora, si vedra' al prossimo cambio di righe
}

IDPanel.prototype.SetHasScrollbar= function(value) 
{
  if (value!=undefined)
    this.HasScrollbar = value;
  //
  if (this.Realized)
  {
    if (this.IsFluidPanel())
    {
      // gestire scrollbar (facile, in questo caso basta usare l'overflow su listlist)
      this.ListListBox.style.offsetY = this.HasScrollbar ? "" : "hidden";
      return;
    }
    //
    if (!this.mwFunction)
      this.mwFunction = new Function("ev", "return RD3_DesktopManager.CallEventHandler('" + this.Identifier + "', 'OnMouseWheel', ev)");
    //
    // Se non devo avere la scrollbar, la rimuovo
    if (!this.HasScrollbar && this.ScrollBox)
    {
      this.ScrollBox.parentNode.removeChild(this.ScrollBox);
      //
      this.ScrollBox = null;
      this.ScrollBoxInt = null;
      this.ScrollBoxTouch = null;
      this.ScrollIntTouch = null;
      //
      this.ListListBox.onmousewheel = null;
      this.ScrollAreaBox.onmousewheel = null;
      if (this.ListListBox.addEventListener)
      {
        this.ListListBox.removeEventListener("wheel", this.mwFunction, true);
        this.ScrollAreaBox.removeEventListener("wheel", this.mwFunction, true);
      }
      //
      if (RD3_ServerParams.CompletePanelBorders && this.ScrollBoxCap)
      {
          this.ScrollBoxCap.parentNode.removeChild(this.ScrollBoxCap);
          this.ScrollBoxCap = null;
      }
      if (RD3_ServerParams.CompletePanelBorders && this.ListQBERCap) 
      {
        this.ListQBERCap.parentNode.removeChild(this.ListQBERCap);
        this.ListQBERCap = null;
      }
    }
    if (!this.HasScrollbar)
    {
      if (this.ScrollBoxMobile)
      {
        this.ScrollBoxMobile.parentNode.removeChild(this.ScrollBoxMobile);
        this.ScrollBoxMobile = null;
        //
        if (RD3_Glb.IsSmartPhone() && this.SearchAreaBox)
          this.SearchAreaBox.style.paddingRight = "";
      }
      if (this.ScrollBoxHint)
      {
        this.ScrollBoxHint.parentNode.removeChild(this.ScrollBoxHint);
        this.ScrollBoxHint = null;
      }
    }
    //
    // Devo avere la scrollbar, la attivo
    if (RD3_Glb.IsMobile() && this.HasScrollbar)
    {
      // Nel caso mobile creo un piccolo DIV sovrapposto al lato dx del pannello
      // con le lettere. Quando l'utente lo preme, eseguo una veloce query QBE
      this.ScrollBoxMobile = document.createElement("div");
      this.ScrollBoxMobile.setAttribute("id", this.Identifier+":sb");
      this.ScrollBoxMobile.className = "panel-scroll-container";
      var mm = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMobile', ev)");  
      var mu = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMobileUp', ev)");  
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
      {
        this.ScrollBoxMobile.addEventListener("touchstart", mm, true); 
        this.ScrollBoxMobile.addEventListener("touchmove", mm, true); 
        this.ScrollBoxMobile.addEventListener("touchend", mu, true); 
        this.ScrollBoxMobile.addEventListener("touchcancel", mu, true); 
      }
      else
      {
        this.ScrollBoxMobile.addEventListener("mousemove", mm, true); 
        this.ScrollBoxMobile.addEventListener("mousedown", mm, true); 
        this.ScrollBoxMobile.addEventListener("mouseup", mu, true); 
        this.ScrollBoxMobile.addEventListener("mouseout", mu, true); 
      }
      //
      this.ContentBox.appendChild(this.ScrollBoxMobile);
      //
      this.ScrollBoxHint = document.createElement("div");
      this.ScrollBoxHint.id= this.Identifier+":sbh";
      this.ScrollBoxHint.className = "panel-scroll-hint";
      //
      this.ContentBox.appendChild(this.ScrollBoxHint);
      //
      if (RD3_Glb.IsSmartPhone()  && this.SearchAreaBox)
        this.SearchAreaBox.style.paddingRight = "38px";
    }
    else
    {
      if (this.HasScrollbar && !this.ScrollBox && this.ListBox)
      {
        this.ScrollBox = document.createElement("div");
        this.ScrollBox.setAttribute("id", this.Identifier+":sb");
        this.ScrollBox.className = "panel-scroll-container";
        this.ScrollBoxInt = document.createElement("div");
        this.ScrollBoxInt.setAttribute("id", this.Identifier+":sc");
        this.ScrollBoxInt.className = "panel-scroll-content";
        this.ScrollBox.appendChild(this.ScrollBoxInt);
        //
        this.ScrollBox.style.zIndex = this.ListListZIndex;
        this.ListBox.appendChild(this.ScrollBox);
        //
        if (RD3_ServerParams.CompletePanelBorders)
        {
          this.ScrollBoxCap = document.createElement("div");
          this.ScrollBoxCap.setAttribute("id", this.Identifier+":sbc");
          this.ScrollBoxCap.className = "panel-field-caption-list scroll-cap";
          this.ScrollBoxCap.style.zIndex = this.ListListZIndex;
          this.ListBox.appendChild(this.ScrollBoxCap);
          //
          if (this.VisStyle)
          {
            this.VisStyle.ApplyValueStyle(this.ScrollBoxCap, true, true, false, false, false, false, false, "left", false, false); // Header in lista
            this.VisStyle.ApplyBorderStyle(this.ScrollBox, 1);
          }
          //
          if (RD3_ServerParams.Theme.startsWith("zen"))    // No right border for ZEN
          {
            if (!RD3_Glb.IsIE(10,false))
              this.ScrollBoxCap.style.setProperty("border-left","none","important");
            else
              this.ScrollBoxCap.style.borderLeft = "none";
          }
          //
          if (this.UseListQBE == RD3_Glb.PAN_QBEROW) 
          {
            this.ListQBERCap = document.createElement("div");
            this.ListQBERCap.setAttribute("id", this.Identifier + ":srbc");
            this.ListQBERCap.className = "panel-field-caption-list";
            this.ListQBERCap.style.zIndex = this.ListListZIndex;
            this.ListBox.appendChild(this.ListQBERCap);
            //
            if (this.VisStyle) {
              this.VisStyle.ApplyValueStyle(this.ListQBERCap, true, true, false, false, false, false, false, "left", false, false); // Header in lista
              this.VisStyle.ApplyBorderStyle(this.ListQBERCap, 1);
            }
            this.ListBox.appendChild(this.ListQBERCap);
          }
        }
        //
        if (RD3_Glb.IsTouch())
        {        
          this.ScrollBoxTouch = document.createElement("div");
          this.ScrollBoxTouch.setAttribute("id", this.Identifier+":sct");
          this.ScrollBoxTouch.className = "panel-scroll-touch-container";
          //
          this.ScrollIntTouch = document.createElement("div");
          this.ScrollIntTouch.setAttribute("id", this.Identifier+":sbt");
          this.ScrollIntTouch.className = "panel-scroll-touch-box";
          this.ScrollBoxTouch.appendChild(this.ScrollIntTouch);
          //
          this.ScrollBoxTouch.style.zIndex = this.ListListZIndex;
          this.ListBox.appendChild(this.ScrollBoxTouch);
        }
        //
        this.ScrollBox.onscroll = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScroll', ev)");        
        //
        // Con IE devo avere la scrollbar clonata
        // Con il nuovo tipo di scrolling non c'e' n'e' piu' bisogno!
        //if (RD3_Glb.IsIE())
        // this.ScrollBox.onmouseenter = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMouseEnter', ev)");
        if (RD3_Glb.IsFirefox())
          this.ScrollBox.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMouseEnter', ev)");
        //
        // Su IE9+ e tutti gli altri browser uso onwheel
        if (this.ListListBox.addEventListener)
        {
          this.ListListBox.addEventListener("wheel", this.mwFunction, true);        
          this.ScrollAreaBox.addEventListener("wheel", this.mwFunction, true);        
        }
        else 
        {
          // Su IE<9 uso onmousewheel
          this.ListListBox.onmousewheel = this.mwFunction;
          this.ScrollAreaBox.onmousewheel = this.mwFunction;
        }
      }
    }
  }
}

IDPanel.prototype.SetHasList= function(value) 
{
  if (value!=undefined)
    this.HasList = value;
  //
  // Questo parametro viene modificato solo in fase di inizializzazione
}

IDPanel.prototype.SetHasForm= function(value) 
{
  if (value!=undefined)
    this.HasForm = value;
  //
  // Questo parametro viene modificato solo in fase di inizializzazione
}

IDPanel.prototype.SetCanUpdate= function(value) 
{
  var old = this.CanUpdate;
  if (value!=undefined)
    this.CanUpdate = value;
  //
  if (this.Realized)
  {
    // Se e' cambiato, aggiorno il pannello, dato che passo da ENABLED a DISABLED
    // Inoltre aggiorno al toolbar
    if (old != this.CanUpdate)
    {
      this.ResetPosition = true;
      this.RefreshToolbar = true;
    }
  }
}

IDPanel.prototype.SetCanDelete= function(value) 
{
  var old = this.CanDelete;
  if (value!=undefined)
    this.CanDelete = value;
  //
  if (this.Realized)
  {
    // Se e' cambiato, aggiorno il pannello, dato che passo da ENABLED a DISABLED
    // Inoltre aggiorno al toolbar
    if (old != this.CanDelete)
    {
      this.RefreshToolbar = true;
    }
  }
}

IDPanel.prototype.SetCanInsert= function(value) 
{
  var old = this.CanInsert;
  if (value!=undefined)
    this.CanInsert = value;
  //
  if (this.Realized)
  {
    // Se e' cambiato, aggiorno il pannello, dato che passo da ENABLED a DISABLED
    // Inoltre aggiorno al toolbar
    if (old != this.CanInsert)
    {
      this.RefreshToolbar = true;
    }
  }
}

IDPanel.prototype.SetCanSearch= function(value) 
{
  if (value!=undefined)
    this.CanSearch = value;
  //
  if (this.Realized)
  {
    this.RefreshToolbar = true;
  }
}

IDPanel.prototype.SetCanSort= function(value) 
{
  if (value!=undefined)
    this.CanSort = value;
  //
  if (this.Realized)
  {
    // Passo il messaggio a tutti i campi che sistemeranno la caption
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
      this.Fields[i].SetCanSort(this.CanSort && this.Status==RD3_Glb.PS_DATA);
  }
}

IDPanel.prototype.SetListLeft= function(value) 
{
  if (value!=undefined)
    this.ListLeft = value;
  //
  if (this.Realized)
  {
    if (this.HasList)
    {
      this.ListListBox.style.left = this.ListLeft + "px";
      this.RecalcLayout = true;
    }
  }
}

IDPanel.prototype.SetListTop= function(value) 
{
  if (value!=undefined)
    this.ListTop = value;
  //
  if (this.Realized)
  {
    if (this.HasList)
    {
      this.ListListBox.style.top = this.ListTop + "px";
      this.RecalcLayout = true;
    }
  }
}

IDPanel.prototype.SetListWidth= function(value) 
{
  if (value!=undefined)
    this.ListWidth = value;
  //
  if (this.Realized)
  {
    if (this.HasList)
    {
      // Allargo la lista, la gestione del numero di campi visibili e della scrollbar viene fatta dal CalcLayout
      this.ListListBox.style.width = (this.ListWidth+4) + "px"; // Tenere conto dei bordi
      //
      this.RecalcLayout = true;
    }
  }
}

IDPanel.prototype.SetListHeight= function(value) 
{
  // Nel caso mobile non modifico l'altezza della lista se sono in form
  // questo perche' con le righe dinamiche quando vado in form il sistema
  // sente di dover modificare l'altezza anche della lista e questo
  // poi rompe l'animazione di ritorno
  // Su IE no, perche' farlo significa essere legati all'ordine degli attributi, su IE l'attributo 
  // 'vai in lista' viene dopo a 'nuova altezza lista'
  if (this.PanelMode == RD3_Glb.PANEL_FORM && RD3_Glb.IsMobile() && !RD3_Glb.IsIE())
    return;
  //
  var old = this.ListHeight;
  //
  if (value!=undefined)
    this.ListHeight = value;
  //
  if (this.Realized && (value==undefined || this.ListHeight!=old))
  {
    if (this.HasList)
    {
      var h = this.ListHeight;
      //
      // Arrotondo ad un numero intero di righe
      if (this.GetRowHeight())
      {
        // Voglio arrotondare. Prendo l'altezza della lista e gli tolgo l'intestazione + il GAP intestazione-campi se
        // c'e' l'intestazione
        var cellsh = h - (this.HeaderSize > 0 ? this.HeaderSize + this.VisStyle.GetHeaderOffset() : 0) - this.GetHeaderSearchOffset();
        //
        // Ora calcolo il modulo della divisione tra l'altezza delle celle e l'altezza di una riga...
        // Prima di farlo devo tenere conto del fatto che c'e' un GAP tra le righe in meno rispetto al numero
        // di righe. Quindi lo aggiungo e faccio il modulo
        h -= (cellsh + this.VisStyle.GetRowOffset()) % this.GetRowHeight();
      }
      //
      // Protezione per valori < 0
      if (h<1) h=1;
      //
      // Alzo la lista, la gestione del numero di righe viene fatta dal CalcLayout
      // Il -1 serve per coprire correttamente i bordi dell'ultima cella (NPQ00069)
      this.ListListBox.style.height = (h-1) + "px";
      this.ListHeightRounded = h;
      //
      this.RecalcLayout = true;
    }
  }
}

IDPanel.prototype.SetActualRow= function(value, force, fromServer)
{
  this.OldAttR = this.ActualRow;
  //
  if (value!=undefined)
  {
    // Se il server mi ha mandato la riga a cui andare, ma sono un pannello gruppato devo cercare di capire dove vuole che vada
    // ed impostare quella giusta
    if (fromServer && this.IsGrouped() && RD3_Glb.IsMobile())
    {
      var serverIndex = this.ActualPosition + value;
      var nr = this.GetRowForIndex(serverIndex);
      if (nr != -1)
        value = nr;
    }
    //
    this.ActualRow = value;
  }
  //
  if (this.Realized && force && this.HasList && RD3_Glb.IsMobile())
    this.HiliteRow(0);
  //
  if (this.Realized && (this.ActualRow!=this.OldAttR || value==undefined) && this.HasList)
  {
    // Aggiusto posizionamento a video...
    this.ResetPosition=true;
    this.RefreshToolbar = true;
    this.DenyScroll = true; // Questa volta lo scroll e' impossibile
    //
    if (this.IsFluidPanel() && fromServer && this.ListListBox.childNodes.length >= this.ActualRow) 
    {
      // In questo caso devo scrollare la lista in modo da far vedere la riga selezionata...
      var pthis = this;
      window.setTimeout(function () { 
        pthis.ListListBox.scrollTop = pthis.ListListBox.childNodes[pthis.ActualRow].offsetTop;
      }, 0);
      
    }
  }
  //
  // Se e' attivo il FixActiveRow
  if (this.PanelMode==RD3_Glb.PANEL_LIST && this.IsPanelFixActiveRowWhenScrolled())
  {
    // Se sono fuori dal buffer video, tolgo il fuoco dalla griglia
    // Altrimenti rimetto il fuoco nella griglia
    if (this.ActualRow < 0 || this.ActualRow >= this.NumRows)
    {
      RD3_KBManager.ActiveObject = null;
      RD3_KBManager.LastActiveObject = null;
      RD3_KBManager.ActiveElement = null;
      RD3_KBManager.CheckFocus = false;
      document.body.focus();
    }
    else if (RD3_KBManager.ActiveObject instanceof PField && RD3_KBManager.FocusFieldTimerId==0 && RD3_KBManager.ActiveObject.ParentPanel == this)
    {
      RD3_KBManager.FocusFieldTimerId = window.setTimeout(function() 
      {
        RD3_KBManager.FocusFieldTimerId = 0;
        if (RD3_KBManager.ActiveObject instanceof PField)
          RD3_DesktopManager.CallEventHandler(RD3_KBManager.ActiveObject.Identifier, 'Focus', null, this.ActualRow); 
      }.bind(this), 10);
    }
  }
}

IDPanel.prototype.SetVResMode= function(value) 
{
  if (value!=undefined)
    this.VResMode = value;
  //
  // Questa proprieta' non varia dopo l'inizializzazione
}

IDPanel.prototype.SetHResMode= function(value) 
{
  if (value!=undefined)
    this.HResMode = value;
  //
  // Questa proprieta' non varia dopo l'inizializzazione
}

IDPanel.prototype.SetVisualStyle= function(value) 
{
  var old = this.VisStyle;
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
    // Cambio le impostazioni visuali del pannello
    // Colore di sfondo del pannello
    var gradDir = this.VisStyle.GetGradDir(6); // VISCLR_BACKPANEL
    if (gradDir != 1)
    {
      var fromColor = this.VisStyle.GetColor(6);  // VISCLR_BACKPANEL
      var toColor = this.VisStyle.GetGradColor(6);  // VISCLR_BACKPANEL
      //
      if (this.ContentBox)
      {
        var s = this.ContentBox.style;
        //
        if (RD3_Glb.IsIE(10, false))
        {
          s.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType="+(gradDir==2?1:0)+",StartColorStr="+fromColor+",EndColorStr="+toColor+")";
          //
          // Se non c'e' un colore di sfondo lo metto comunque... 
          // altrimenti IE non gestisce il click sul div perche' lo crede trasparente!
          s.backgroundColor = fromColor;
        }
        else if (RD3_Glb.IsWebKit())
        {
          s.backgroundColor = "transparent";
          s.background = "-webkit-gradient(linear, " + (gradDir==2? "left center, right center" : "center top, center bottom") + ", from("+fromColor+"), to("+toColor+"))";
        }
        else if (RD3_Glb.IsFirefox())
        {
          s.background = "-moz-linear-gradient(" + (gradDir==2? "left" : "top") + ", "+fromColor+", "+toColor+")";
        }
        else if (RD3_Glb.IsIE(10, true))
        {
          s.background = "linear-gradient(" + (gradDir==2? "90deg" : "180deg") + ", "+fromColor+", "+toColor+")";
          //
          // Se non c'e' un colore di sfondo lo metto comunque... 
          // altrimenti IE non gestisce il click sul div perche' lo crede trasparente!
          s.backgroundColor = fromColor;
        }
      }
    }
    else
    {
      var color = this.VisStyle.GetColor(6);
      //
      if (this.HasList)
        this.ListBox.style.backgroundColor = color; // VISCLR_BACKPANEL
      if (this.HasForm)
        this.FormBox.style.backgroundColor = color; // VISCLR_BACKPANEL
      //
      // Applico il colore anche al contenitore, ma non in caso Mobile+DockLeft+Trasparente (in questo caso vince il css che lo vuole bianco)
      if (this.ContentBox && !(RD3_Glb.IsMobile() && this.WebForm.DockType==RD3_Glb.FORMDOCK_LEFT && color=="transparent"))
        this.ContentBox.style.backgroundColor = color; // VISCLR_BACKPANEL
    }
    //
    // Bordo dei campi
    if (this.ListListBox)
      this.VisStyle.ApplyBorderStyle(this.ListListBox,0);
    //
    // Dispositivo touch. Mostro la scrollbar in questo modo
    if (this.ScrollBoxTouch)
      this.VisStyle.ApplyBorderStyle(this.ScrollBoxTouch,0);
    //
    if (this.ScrollBoxCap)
      this.VisStyle.ApplyValueStyle(this.ScrollBoxCap, true, true, false, false, false, false, false, "left", false, false); // Header in lista
    if (this.ListQBERCap)
      this.VisStyle.ApplyValueStyle(this.ListQBERCap, true, true, false, false, false, false, false, "left", false, false); // Header in lista
    if (this.ScrollBox && RD3_ServerParams.CompletePanelBorders)
      this.VisStyle.ApplyBorderStyle(this.ScrollBox, 1);
    //
    if (this.ToggleMultiSelBox)
      this.VisStyle.ApplyValueStyle(this.ToggleMultiSelBox, true, true, false, false, false, false, false, "left", false, false); // Header in lista
    if (RD3_ServerParams.CompletePanelBorders && this.ShowRowSelector && this.ListBox)
    {
      for (var i=0; i < this.NumRows; i++)
        this.VisStyle.ApplyBorderStyle(this.RowSel[i], 1);
    }
    //
    // Classe CSS da Visual Style, la applico solo se il VS e' cambiato
    if (old && old.GetClassName && old.GetClassName())
        RD3_Glb.RemoveClass(this.FrameBox, old.GetClassName());
    if (this.VisStyle.GetClassName && this.VisStyle.GetClassName())
      RD3_Glb.AddClass(this.FrameBox, this.VisStyle.GetClassName());
  }
}

IDPanel.prototype.SetFixedColumns= function(value) 
{
  var old = this.FixedColumns;
  //
  if (value!=undefined)
    this.FixedColumns = value;
  //
  if (this.Realized && (old!=this.FixedColumns || value==undefined))
  {
    this.RecalcLayout = true;
  }
}

IDPanel.prototype.SetQbeTip= function(value) 
{
  if (value!=undefined)
    this.QBETip = value;
  if (this.Realized)
  {
    this.QBETip = this.QBETip.replace(/QBEF1/g, "qbe-field");
    this.QBETip = this.QBETip.replace(/QBEF2/g, "qbe-value");
    this.QBETipBox.SetWidth(0);
    this.QBETipBox.SetHeight(0);
    this.QBETipBox.SetText(this.QBETip);
    //
    // Siamo un detail DO, il server ha svuotato il QBETip, ma non va a svuotare il QBEFilter dei campi 
    // (in realta' lo fa ma non me lo dice), quindi lo tolgo io
    if (value == "" && this.IsDO && !this.DOMaster) 
    {
      for (var i = 0; i < this.Fields.length; i++) 
      {
        var f = this.Fields[i];
        if (f.InList && f.ListList && f.QBEFilter)
          f.SetQBEFilter("");
      }
    }
  }
}

IDPanel.prototype.SetActualPosition= function(value, delay, scroll) 
{
  var old = this.ActualPosition;
  //
  if (value!=undefined)
  {
    this.ActualPosition = value;
    //
    // Mi memorizzo l'equivalente dell'actualposition in visione compatta
    if (this.IsGrouped())
      this.CompactActualPosition = this.ListGroupRoot.GetRowPos(this.ActualPosition, true, true);
  }
  //
  if (this.Realized && (old!=this.ActualPosition || value==undefined))
  {
    if (delay)
    {
      // Chiedo aggiornamento al termine delle operazioni,
      // ma solo se non era gia' stato chiesto
      if (!this.ResetPosition)
      {
        this.ResetPosition = true;
        this.ScrollToPos = scroll;
      }
    }
    else
    {
      // Su firefox, cerco di eliminare l'onda dell'aggiornamento della lista!
      // Per farlo rimuovo l'intera lista dal DOM... aggiorno tutto, poi la ripristino!
      var fctop = 0;
      var wasfoc = false;
      if (RD3_Glb.IsFirefox(3) && this.PanelMode==RD3_Glb.PANEL_LIST)
      {
        // Se ci sono colonne fissate, memorizzo la posizione della scrollbar
        if (this.FixedColumns!=0)
          fctop = this.ScrollAreaBox.scrollLeft;
        //
        // Se c'e' un elemento con il fuoco devo verificare se mi appartiene: se si lo pederebbe, quindi quando la lista verra' rimessa nel DOM dovro' rimettere a posto il fuoco
        if (RD3_KBManager.ActiveElement)
        {
          var p = RD3_KBManager.ActiveElement;
          while (p!=null)
          {
            if (p==this.ListBox)
            {
              wasfoc = true;
              break;
            }
            p = p.parentNode;
          }
        }
        //
        this.ContentBox.removeChild(this.ListBox);
      }
      //
      if (this.UpdateListGroups)
      {
        var n = this.Fields.length;
        //
        // Ciclo su tutti i campi e faccio infilare i gruppi nelle posizioni corrette
        for (var i=0; i<n; i++)
        {
          var f = this.Fields[i];
          //
          if (f.InList&&f.ListList)
            this.ListGroupRoot.AddGroups(f.PValues, 0);
        }
        //
        this.UpdateListGroups = false;
        //
        // Se il pannello ha le righe dinamiche dico al server quante righe sto attualmente mostrando
        if (this.IsGrouped() && (this.PanelMode==RD3_Glb.PANEL_LIST || this.PanelMode==-1) && this.DynamicRows > 0)
          var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_ACTIVE, "dynrows", this.GetTotalRows(), 0);
      }
      //
      // I dati devono essere gia' arrivati, in quanto vengono caricati prima dal ChangeProperties
      // Innanzitutto mando il messaggio ai campi
      var n = this.Fields.length;
      for (var i=0; i<n; i++)
        this.Fields[i].SetActualPosition(this.ActualPosition, undefined, undefined, scroll);
      //
      // Se ho scrollato devo aggiornare i RowSelector
      if (scroll)
        this.UpdateRSel = true;
      //
      // Aggiorno lo stato della multiselezione
      this.UpdateMultipleSel();
      //
      // Se e' stata cambiata la ActualPosition devo cambiare la posizione della ScrollBar
      // durante questa operazione non faccio scattare eventi di scrolling!
      if (value==undefined)
        this.UpdateScrollPos(true);
      //    
      // Certifico che l'ho gia' fatto
      this.ResetPosition = false;
      this.DenyScroll = false;
      //
      // Per Firefox, rimetto la lista nel DOM
      if (RD3_Glb.IsFirefox(3) && this.PanelMode==RD3_Glb.PANEL_LIST)
      {
        this.ContentBox.appendChild(this.ListBox);
        //
        // Devo ripristinare l'emento che aveva il fuoco, altrimenti lo perdo
        if (wasfoc && RD3_KBManager.ActiveElement)
          RD3_KBManager.ActiveElement.focus();
        //
        // Devo riposizionare la scrollbar. Questa operazione l'ha sicuramente azzerata!
        if (RD3_Glb.IsFirefox(3))
          this.UpdateScrollPos(true);
        else
          this.QbeScroll = true;
        //
        // Se ci sono colonne fissate, ripristino la posizione della scrollbar
        if (this.FixedColumns!=0)
          this.ScrollAreaBox.scrollLeft = fctop;
      }
    }
    //
    // Ho cambiato posizione: aggiorno la toolbar (se sono in list viene fatto dalla setactualrow se necessario,
    // in form e' necessario farlo qui)
    if (this.HasForm)
      this.RefreshToolbar = true;
    //
    if (RD3_Glb.IsMobile())
    {
      for (var i=0; i<this.Groups.length; i++)
        this.UpdateFieldClass(this.Groups[i]);
    }
  }
}

IDPanel.prototype.SetTotalRows= function(value) 
{
  var old = this.TotalRows;
  if (value!=undefined)
    this.TotalRows = value;
  //
  if (this.Realized)
  {
    this.UpdateScrollBox();
    //
    this.SetStatusBarText();
    this.RefreshToolbar = true;
    //
    // Se e' cambiato il numero totale di righe, devo riverificare i campi... potrebbero diventare
    // editabili solo perche' passo da una riga di inserimento ad una riga di aggiornamento
    // in un pannello che non puo' inserire ma puo' aggiornare
    if (old != this.TotalRows)
    {
      this.ResetPosition = true;
      this.DenyScroll = true;
    }
  }
}


IDPanel.prototype.SetMoreRows= function(value) 
{
  if (value!=undefined)
    this.MoreRows = value;
  //
  if (this.Realized)
  {
    this.SetStatusBarText();
  }
}

IDPanel.prototype.SetEnabledCommands = function(value)
{
   if (value!=undefined)
    this.EnabledCommands = value; 
  //
  if (this.Realized)
  {
    this.RefreshToolbar = true;
  }
}

IDPanel.prototype.SetExtEnabledCommands = function(value)
{
   if (value!=undefined)
    this.ExtEnabledCommands = value; 
  //
  if (this.Realized)
    this.RefreshToolbar = true;
}

IDPanel.prototype.SetHasBook = function(value)
{
   if (value!=undefined)
    this.HasBook = value;
  //
  // Questo valore non viene modificato dopo l'inizializzazione
}

IDPanel.prototype.ResetCache= function(ev, node) 
{
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    this.Fields[i].ResetCache(node);
  }  
  //
  // Dopo aver svuotato gli array se ho dei gruppi li devo far reinfilare negli array dei PVal alle posizioni giuste
  if (this.IsGrouped())
   this.UpdateListGroups = true;
}


IDPanel.prototype.ResetGroups= function() 
{
  // Elimino i gruppi
  if (this.ListGroupRoot)
    this.ListGroupRoot.Unrealize();
  //
  this.ListGroupRoot = null;
  this.UpdateListGroups = false;
}

IDPanel.prototype.MultipleSelection= function(ev, node) 
{
  if (this.MultiSelStatus==null)
    this.MultiSelStatus = new Array();
  //
  var row = parseInt(node.getAttribute("row"));
  var value = parseInt(node.getAttribute("value"));
  //
  if (row==-1)
  {
    // Cambia la selezione nel suo complesso...
    this.ChangeSelection(value, true);
    //
    // Tronco l'array all'attuale numero di record
    this.MultiSelStatus.length = (this.Status!=RD3_Glb.PS_QBE ? this.TotalRows+1 : 1);
  }
  else
  {
    this.MultiSelStatus[row]=(value==1);
  }
  //
  if (this.Realized)
  {
    this.UpdateMultipleSel();
  }
}

IDPanel.prototype.SetTooltipOnEachRow = function(value) 
{
  if (value != undefined)
    this.TooltipOnEachRow = value;
}

IDPanel.prototype.SetEnableInsertWhenLocked = function(value) 
{
  if (value != undefined)
    this.EnableInsertWhenLocked = value;
  //
  if (this.Realized)
  {
    // TODO: ottimizzare
    this.RefreshToolbar = true;
  }
}

IDPanel.prototype.SetResOnlyVisFlds = function(value) 
{
  if (value != undefined)
    this.ResOnlyVisFlds = value;
}
 
IDPanel.prototype.SetVisualFlags = function(value) 
{
  var old = this.VisualFlags;
  this.VisualFlags = value;
  if (this.Realized)
  {
    if (!this.VisHiliteRow())
      this.HiliteRow(0);
    //
    // Se cambia il flag HidePages, aggiorno la visualizzazione delle linguette
    if ((old & 0x4000) != this.VisHidePages())
      this.AdaptPagesLayout();
  }
}
 
IDPanel.prototype.VisHiliteRow = function()
{
  return this.VisualFlags & 0x2000;
}
 
IDPanel.prototype.VisHidePages = function()
{
  return this.VisualFlags & 0x4000;
}
 
IDPanel.prototype.SetTableName = function(value) 
{
  if (value != undefined)
    this.TableName = value;
}

IDPanel.prototype.SetAutomaticLayout = function(value) 
{
  if (value != undefined)
    this.AutomaticLayout = value;
}

IDPanel.prototype.SetIsDO = function(value) 
{
  if (value != undefined)
    this.IsDO = value;
}

IDPanel.prototype.SetHasDocTemplate = function(value) 
{
  if (value != undefined)
    this.HasDocTemplate = value;
  //
  if (this.Realized)
    this.RefreshToolbar = true;
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
IDPanel.prototype.Realize = function(parent)
{
  // Chiamo la classe base
  if (!this.Realized)
    WebFrame.prototype.Realize.call(this, parent);
  this.Realizing = true;
  //
  // La classe base mette Realized=true, io lo resetto e poi lo rimetto
  this.Realized = false;
  //
  this.CompileFieldList();
  //
  // Funzione per attaccare al listbox un evento di fine animazione, usato nella transizione da list a form
  this.ea = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnEndAnimation', ev)");
  //
  // Non voglio proprio che il contentbox scrolli. Lo fa quando si posizionano il list box e form box.
  if (RD3_Glb.IsMobile())
    this.ContentBox.onscroll = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'NoScroll', ev)");
  //
  if (this.HasForm)
  {
    this.FormBox = document.createElement("div");
    this.FormBox.setAttribute("id", this.Identifier+":fb");
    this.FormBox.className = "panel-form-container";
    if (RD3_Glb.IsMobile())
      this.FormBox.onscroll = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'NoScroll', ev)");
    this.ContentBox.appendChild(this.FormBox);
  }
  //
  if (this.HasList)
  {
    this.CalcFluidRowGrid();
    //
    this.ListBox = document.createElement("div");
    this.ListBox.setAttribute("id", this.Identifier+":lb");
    this.ListBox.className = "panel-list-container";
    if (RD3_Glb.IsMobile())
      this.ListBox.onscroll = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'NoScroll', ev)");
    //
    // Con IE devo avere la scrollbar clonata
    // Con il nuovo tipo di scrolling non ce n'e' piu' bisogno!
    //if (RD3_Glb.IsIE())
    // this.ListBox.onmousemove = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMouseLeave', ev)");
    //
    this.ContentBox.appendChild(this.ListBox);
    //
    this.ListListBox = document.createElement("div");
    this.ListListBox.className = "panel-list-list-container" + (this.IsFluidPanel() ? " list-fluid" : "");
    //
    if (!RD3_Glb.IsTouch())
      this.ListListBox.onscroll = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollListList', ev)");
    //
    // Guardo quale zIndex dare agli oggetti in ListList
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      if (f.InList && f.ListList)
      {
        this.ListListZIndex = f.Index;
        break;
      }
    }
    this.ListListBox.style.zIndex = this.ListListZIndex;
    this.ListBox.appendChild(this.ListListBox);
    //
    if (RD3_Glb.IsSmartPhone() && this.CanSearch)
    {
      // Creo la search area box in alto nel list box
      this.SearchAreaBox = document.createElement("div");
      this.SearchAreaBox.className = "panel-search-area";
      this.ListBox.appendChild(this.SearchAreaBox);
      this.ListBox.style.overflow = "visible";
      //
      // Sposto la searchbox qui e la adatto
      this.SearchBox.parentNode.removeChild(this.SearchBox);
      this.SearchAreaBox.appendChild(this.SearchBox);
      RD3_Glb.AddClass(this.SearchBox, "frame-search-phone");
    }
    else
    {
      if (RD3_Glb.IsQuadro() && this.CanSearch)
      {
        // Aggiungo un div per il margine destro della search box
        this.SearchMargin = document.createElement("div");
        this.SearchMargin.className = "frame-search-margin";
        this.ToolbarBox.appendChild(this.SearchMargin);
      }
    }
    //
    if (!this.IsFluidPanel()) 
    {
      this.ScrollAreaBox = document.createElement("div");
      this.ScrollAreaBox.className = "panel-scroll-area";
      this.ScrollAreaBox.style.zIndex = this.ListListZIndex;
      this.ListBox.appendChild(this.ScrollAreaBox);
    }
    else
    {
      this.RefreshRowsClasses = true;
      this.ListBox.setAttribute("tabIndex", "0");
      this.ListFluidHeader = document.createElement("div");
      this.ListFluidHeader.className = "list-fluid-header";
      this.ListListBox.appendChild(this.ListFluidHeader);
      //
      for (var s = 0; s < this.FluidRows; s++) 
      {
        var str = document.createElement("div");
        str.className = "list-fluid-subheader";
        this.ListFluidHeader.appendChild(str);
      }
      //
      // All'avvio devo comunque e sempre ridimensionare la lista, il server mi manda l'altezza sbagliata
      this.MustResizeListH = true;
      //
      // Se necessario devo creare la riga per QBERow
      if (this.UseListQBE == RD3_Glb.PAN_QBEROW)
      {
        var qtr = document.createElement("div");
        qtr.className = "list-fluid-row";
        this.ListListBox.appendChild(qtr);
        //
        for (var s = 0; s < this.FluidRows; s++) 
        {
          var qstr = document.createElement("div");
          qstr.className = "list-fluid-subrow";
          qtr.appendChild(qstr);
        }
        //
        this.ListQBEFluidRow = qtr;
      }
    }
  }
  //
  if (RD3_Glb.IsMobile())
    this.IDScroll = new IDScroll(this.Identifier, (this.PanelMode==RD3_Glb.PANEL_LIST?this.ListBox:this.FormBox), this.ContentBox, this);
  //
  var n = this.Pages.length;
  if (n > 0)
  {
    // Creo il div in cui vengono contenute le pagine
    this.PagesBox = document.createElement("div");
    this.PagesBox.className = "pages-container";
    this.PagesBox.id = this.Identifier + ":pgb";
    //
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsMobile() && !RD3_Glb.IsIE(10, true))
    {
      // e' un dispositivo touch, quindi uso gli eventi touch
      this.PagesBox.addEventListener("touchstart", new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnPageTouchStart', ev)"), false);
      this.PagesBox.addEventListener("touchmove",  new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnPageTouchMove', ev)"), false);
      this.PagesBox.addEventListener("touchend",   new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnPageTouchEnd', ev)"), false);
    }    
    //
    // Lo inserisco nel DOM
    if (RD3_Glb.IsMobile())
      this.FrameBox.appendChild(this.PagesBox);
    else
      this.FrameBox.insertBefore(this.PagesBox, this.ContentBox);
    //
    // Faccio realizzare le pagine
    for (var i=0; i<n; i++)
    {
      this.Pages[i].Realize(this.PagesBox);
    }
    //
    // Ora creo il filler per riempire la pagina e lo appendo al DOM
    this.PagesFiller = document.createElement("span");
    this.PagesFiller.className = "pages-filler";
    this.PagesBox.appendChild(this.PagesFiller);
  }
  //
  // Ora realizzo tutte i gruppi non ancora realizzati
  n = this.Groups.length;
  for (var i=0; i<n; i++)
  {
    this.Groups[i].Realize();
  }
  //
  // Ora realizzo tutte i fields non ancora realizzati
  n = this.Fields.length;
  for (var i=0; i<n; i++)
    if (this.Fields[i].CanHideInList() && !RD3_Glb.IsMobile()) {
      this.HasListVisibilityControl = true;
      break;
    }
  //
  for (var i=0; i<n; i++)
    this.Fields[i].Realize();
  //
  // Ora posso collassare i gruppi perche' solo adesso i campi hanno il riferimento al gruppo
  n = this.Groups.length;
  for (var i=0; i<n; i++)
    this.Groups[i].SetCollapsed();
  //
  this.Realized = true;
  //
  this.SetPanelStatus();
  this.SetPanelMode();
  this.SetNumRows();
  this.SetMaxHRow();
  this.SetHeaderSize();
  this.SetShowRowSelector();
  this.SetEnableMultipleSel();
  this.SetShowMultipleSel();
  this.SetDynamicRows();
  this.SetDynamicHeight();
  this.SetHasScrollbar();
  this.SetHasList();
  this.SetHasForm();
  this.SetCanUpdate();
  this.SetCanDelete();
  this.SetCanInsert();
  this.SetCanSearch();
  this.SetCanSort();
  this.SetListLeft();
  this.SetListTop();
  this.SetListWidth();
  this.SetListHeight();
  this.SetActualRow();
  this.SetVResMode();
  this.SetHResMode();
  this.SetVisualStyle();
  this.SetFixedColumns();
  this.SetQbeTip();
  this.SetTotalRows();
  this.SetPanelPage();
  this.SetLoadingPolicy();
  //
  this.OldOriginalPanelMode = this.PanelMode;
  //
  // Con questa impostazione spingo l'aggiornamento di entrambi i layout
  this.PanelMode = -1;
  this.SetActualPosition();
  //
  // Ho fatto io il SetActualPosition, non c'e' bisogno di spingerlo alla fine della richiesta
  this.ResetPosition = false;
  this.PanelMode = this.OldOriginalPanelMode;
  delete this.OldOriginalPanelMode;
  //
  this.Realizing = false;
  //
  this.UpdateToolbar();
  this.SetStatusBarText();
  //
  this.RecalcLayout = false;
  this.ResetPosition = false;
  //
  if (RD3_Glb.IsMobile())
  {
    for (var i=0; i<this.Groups.length; i++)
      this.UpdateFieldClass(this.Groups[i]);
  }
  else
  {
    if (this.MouseOverEventDef != RD3_Glb.EVENT_CLIENTSIDE)
    {
      var _this = this;
      var movf = function(ev) {
        _this.HandleOnMouseOver(ev);
      };
      //
      if (document.addEventListener)
        this.ContentBox.addEventListener("mouseover", movf, false); 
      else
        this.ContentBox.attachEvent("onmouseover", movf);
    }
  }
}


// ********************************************************************************
// Calcola l'elenco dei campi in caso di advtaborder
// ********************************************************************************
IDPanel.prototype.CompileFieldList = function()
{ 
  if (this.AdvTabOrder)
  {
    var min = -1;
    this.ListTabOrder = new Array();
    this.FormTabOrder = new Array();
    //
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      this.ListTabOrder[f.ListTabOrder] = f;
      this.FormTabOrder[f.FormTabOrder] = f;
    }
  }
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
IDPanel.prototype.AdaptLayout = function()
{ 
  // Per migliorare le performance, elimino la listlistbox dal dom (non per IE6 che ha problemi con i check box!)
  var refoc = null;
  var removeFromDOM = (RD3_Glb.IsIE(10, false) && !RD3_Glb.IsIE(6) && this.PanelMode==RD3_Glb.PANEL_LIST && this.FixedColumns==0);
  if (removeFromDOM)
  {
    // Se l'oggetto che aveva il fuoco era dentro al pannello, IE lo perde!
    var oldActiveElem = document.activeElement;
    //
    this.ContentBox.removeChild(this.ListBox);
    //
    if (document.activeElement != oldActiveElem)
      refoc = oldActiveElem;
  }
  //
  // Se presenti dimensiono le linguette delle pagine
  // Lo faccio prima della chiamata alla classe base in modo che
  // essa puo' mettere a posto bene il content box
  if (this.Pages.length > 0)
  {
    // Se sono dentro una Tab prima di fare l'adattamento delle pagine devo dimensionare correttamente il FrameBox
    // se no vengono disegnate male..
    if (this.ParentTab)
    {
      RD3_Glb.AdaptToParent(this.FrameBox, 0, 0);
    }
    //
    this.AdaptPagesLayout();
  }
  //
  var res = this.SendResize;
  //
  // Chiamo la classe base
  var flDontCheckSB = false;
  WebFrame.prototype.AdaptLayout.call(this);
  //
  // Non dovrei ridimensionare... Pero' se ho posticipato un resize lo devo fare comunque
  if (!res)
  {
    res |= (this.PanelMode==RD3_Glb.PANEL_FORM && (this.MustResizeFormW || this.MustResizeFormH)) | 
           (this.PanelMode==RD3_Glb.PANEL_LIST && (this.MustResizeListW || this.MustResizeListH));
  }
  //
  if (res || (this.ResVisFld && this.ResOnlyVisFlds))
  {
    // A parte Safari, gli altri brw calcolano immediatamente la scrollbar nel contentbox
    if (!RD3_Glb.IsSafari() && this.DeltaW<0)
      flDontCheckSB = true;
    //
    // Chiamo il resize dei campi in form e in lista
    if (this.HasForm)
    {
      // Dunque... ho la form... se sono in form, ridimensiono la form... Se avevo posticipato il resize prendo
      // i delta che non ho fatto... se, invece, il layout attivo non e' quello giusto mi ricordo che quando cambiero'
      // layout dovro' ridimensionare il layout form
      if (this.PanelMode==RD3_Glb.PANEL_FORM && this.Visible)
      {
        if (!this.DeltaW && this.MustResizeFormW) this.DeltaW = this.MustResizeFormW;
        if (!this.DeltaH && this.MustResizeFormH) this.DeltaH = this.MustResizeFormH;
        this.ResizeForm();
        this.MustResizeFormW = 0;
        this.MustResizeFormH = 0;
      }
      else if (this.LastFormResizeW==0 && (this.DeltaW || this.DeltaH))   // Solo se non ho mai resizato il layout form... mi ricordo di questi delta
      {
        this.MustResizeFormW = (this.MustResizeFormW==undefined ? 0 : this.MustResizeFormW) + this.DeltaW;
        this.MustResizeFormH = (this.MustResizeFormH==undefined ? 0 : this.MustResizeFormH) + this.DeltaH;
      }
    }
    if (this.HasList)
    {
      // Dunque... ho la lista... se sono in list, ridimensiono la lista... Se avevo posticipato il resize prendo
      // i delta che non ho fatto... se, invece, il layout attivo non e' quello giusto mi ricordo che quando cambiero'
      // layout dovro' ridimensionare il layout list
      if (this.PanelMode==RD3_Glb.PANEL_LIST && this.Visible)
      {
        if (!this.DeltaW && this.MustResizeListW) this.DeltaW = this.MustResizeListW;
        if (!this.DeltaH && this.MustResizeListH) this.DeltaH = this.MustResizeListH;
        //
        // Se ho un resize non applicato lo devo considerare quando faccio i calcoli del delta.
        // Solo quando non sono attive le animazioni, altrimenti il codice li considera correttamente
        if (!RD3_ClientParams.EnableGFX && this.DeltaH && this.DeltaH != 0 && this.MustResizeListH)
          this.DeltaH += (isNaN(this.MustResizeListH) ? 0 : this.MustResizeListH);
        //
        if (this.IsFluidPanel()) 
          this.ResizeFluidList();
        else
          this.ResizeList();
        this.MustResizeListW = 0;
        this.MustResizeListH = 0;
      }
      else if (this.LastListResizeW==0 && (this.DeltaW || this.DeltaH))   // Solo se non ho mai resizato il layout lista... mi ricordo di questi delta
      {
        this.MustResizeListW = (this.MustResizeListW==undefined ? 0 : this.MustResizeListW) + this.DeltaW;
        this.MustResizeListH = (this.MustResizeListH==undefined ? 0 : this.MustResizeListH) + this.DeltaH;
      }
    }
    this.DeltaW = 0;
    this.DeltaH = 0;
    this.SetActualPosition();
    //
    if (RD3_Glb.IsMobile())
      this.RefreshToolbar = true;
  }
  this.ResVisFld = false;
  //
  // Aggiusto il layout
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    if (this.IsFluidPanel()) 
    {
      this.CalcFluidListLayout();
    }
    else 
    {
      this.CalcListLayout(flDontCheckSB);
      if (this.IsGrouped())
        this.CalcListGroupLayout();
    }
  }
  //
  // Aggiusto il layout dei gruppi
  this.CalcGroupsLayout();
  //
  // Passo la palla ai figli, che potrebbero avere dei subframes
  // Se sono su IE, vedo se qualche campo ha un Sub-Frame... Se e' cosi' devo
  // rimettere subito nel DOM il pannello, altrimenti non funziona bene il resize...
  // Pero', se lo faccio dopo, e' molto piu' veloce
  var restoreListInDom = true;
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    //
    if (removeFromDOM && restoreListInDom && f.SubFrame && f.SubFrame.Realized && f.IsVisible())
    {
      // Hai... devo ripristinarlo qui!
      this.ContentBox.appendChild(this.ListBox);
      restoreListInDom = false;
    }
    //
    f.AdaptLayout();
  }  
  //
  // Su Safari e Chrome c'e' un baco con la gestione delle scrollbar, che rimangono anche se il pannello ci sta completamente, 
  // allora qui le tolgo e poi sara' la SetScrollbar a rimetterle (l'AdaptFormListLayout non legge le dimensioni dal DOM quindi la modifica non ha impatto su di lei)
  // facendo cosi' Safari e Chrome calcolano bene le scrollbar, togliendole se non servono.. lo devo fare qui per un motivo di tempi inspiegabile,
  // se lo faccio dopo l'AdaptFormListLayout o dentro la setScrollbar non funziona..
  if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
  {
    this.ContentBox.style.overflowX = "hidden";
    this.ContentBox.style.overflowY = "hidden";
  }
  //
  // Ridimensiono i contenitori del pannello in lista e in form
  this.AdaptFormListLayout();
  //
  // Rimetto le scrollbar dove devo
  this.SetScrollbar();
  //
  // Mostro/Nascondo bottone carica altre righe
  if (this.MoreAreaBox)
  {
    this.MoreAreaBox.style.display = (this.TotalRows>this.NumRows)?"":"none";
    if (this.IsMyScroll() && this.IDScroll)
      this.IDScroll.MarginBottom = (this.TotalRows>this.NumRows)?40:0;
    this.MoreButton.className = "panel-more-button";
  }
  //
  // ora rimetto la listbox dal dom...
  if (removeFromDOM)
  {
    if (restoreListInDom)
      this.ContentBox.appendChild(this.ListBox);
    //
    // Devo riposizionare la scrollbar. Questa operazione l'ha sicuramente azzerata!
    this.QbeScroll = true;
    //
    // Se nel rimuovere la listbox dal dom ho perso il fuoco, lo rimetto a posto!
    if (refoc)
    {
      if (refoc.tagName == "DIV" && refoc.getAttribute("contenteditable") != "true")
        RD3_KBManager.CheckFocus=true;
      else
        refoc.focus();
    }
  }
  //
  // Con queste righe di codice si fanno sparire
  // le scrollbar che IE tende a mettere quando si rimpiccilisce lo spazio
  // disponibile
  // Se lo faccio durante un animazione di form/list e per caso il pannello ha le scrollbar queste righe fanno vedere per un istante la lista..
  // Lo stesso succede durante un animazione di collassamento
  if (!this.AnimatingPanel && !this.Collapsing)
  {
    var oldScrollTop = this.ContentBox.scrollTop;
    this.ContentBox.scrollTop = oldScrollTop + 1000;
    this.ContentBox.scrollTop = oldScrollTop;
  }
  //
  // Comunico a IDScroll che portrebbe essere cambiata l'altezza... 
  // ma non mentre sposto da lista a form e viceversa e poi solo se e' MIO
  // se c'e' l'ha una combo che si sta spostando non va bene
  if (this.IsMyScroll() && this.PullAreaBox && this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    this.IDScroll.PullTrigger = -this.PullAreaBox.offsetTop+this.PullAreaBox.offsetHeight/2;
    //
    // Nel caso quadro esiste un'area coperta piu' grande, ma deve funzionare come prima
    if (RD3_Glb.IsQuadro())
      this.IDScroll.PullTrigger -= 40;
  }
  else if (this.IDScroll)
    this.IDScroll.PullTrigger = 0;
  //
  if (this.IsMyScroll() && !this.AnimatingToolbar)
   this.IDScroll.ChangeSize();
}

// *******************************************************************************
// Dimensione e dispone le linguette delle pagine del pannello
// *******************************************************************************
IDPanel.prototype.AdaptPagesLayout = function()
{
  var ismob = RD3_Glb.IsMobile();
  //
  var thinpage = false;         // True se le pagine devono essere piccole per cercare di stare su una sola riga
  var n = this.Pages.length;    // Numero di pagine del pannello
  var availablew = 0;           // Spazio disponibile
  var usedw;                    // Spazio attualmente occupato
  //
  // Se il pannello e' collassato, le pagine sono invisibili
  // Se il pannello non vuole mostrare le pagine, pure
  if (this.Collapsed || this.VisHidePages())
  {
    this.PagesBox.style.display="none";
    return;
  }
  //
  this.PagesFiller.style.display = "none";
  this.PagesBox.style.display="";
  //
  // Dimensiono il contenitore delle pagine perche' usi tutto lo spazio orizzontale di cui puo' disporre
  RD3_Glb.AdaptToParent(this.PagesBox, 0, -1);
  availablew = this.PagesBox.clientWidth;
  //
  // Adatto tutte le linguette
  usedw = 0;
  for (var i=0; i<n; i++)
  {
    // La variabile thinpage mi dice quale dimensione minima usare come larghezza della linguetta
    var w = ((thinpage) ? RD3_ClientParams.TabWidthThin : RD3_ClientParams.TabWidth);
    //
    // Se la pagina e' visibile allora dimensiono la sua linguetta
    var p = this.Pages[i];
    if (p.IsVisible())
    {
      // Se devo usare la dimensione piu' piccola riazzero la larghezza di HeaderCont impostata da questo stesso ciclo
      if (thinpage)
        p.HeaderCont.style.width = "";
      //
      // Se devo imposto la dimensione minima alla linguetta
      if (!ismob)
      {
        if (p.HeaderCont.offsetWidth <= w && p.HeaderCont.offsetWidth > 0)
          p.HeaderCont.style.width = w + "px";
      }
      //
      // Calcolo lo spazio occupato fin'ora
      usedw += ismob ? p.CaptionContainer.offsetWidth : p.PageContainer.offsetWidth;
      //
      // Se ho sforato la larghezza a disposizione per le linguette
      if (usedw > availablew)
      {
        // Se non ho ancora usando la dimensione piccola per le linguette, faccio in modo 
        // che il ciclo riparta con alcune variabili modificate
        if (!thinpage)
        {
          // Resetto l'indice del ciclo per ripassare da tutte le linguette
          // e imposto thinpage per utilizzare la dimensione minima piu' piccola,
          // e azzero anche la dimensione utilizzata
          i = -1;
          thinpage = true;
          usedw = 0;
          continue;
        }
        else  // Ho appena cambiato riga, quindi lo spazio occupato e' solo quello di questa linguetta
        {
          usedw = ismob ? p.CaptionContainer.offsetWidth : p.PageContainer.offsetWidth;
          continue;
        }
      }
    }
  }
  //
  // Ridimensiono il filler dell'ultima riga tenendo anche conto di eventuali errori di dimensionamento
  if (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())
    availablew -= 10;
  //
  var pfw = (availablew - usedw);
  if (this.PagesFiller.offsetWidth > pfw)
    pfw = (pfw - (this.PagesFiller.offsetWidth - pfw));
  if (pfw < 0)
    pfw = 0;
  this.PagesFiller.style.width = pfw + "px";
  //
  this.PagesFiller.style.display = "";
  //
  // IE, a volte sbaglia... nonostante sia tutto preciso al pixel puo' mandare a capo il filler per 1px
  if (RD3_Glb.IsIE() && this.PagesFiller.offsetLeft==0)
    this.PagesFiller.style.width = (pfw > 0 ? pfw - 1 : 0) + "px";
  //
  if (ismob)
    this.PagesBox.style.top = (this.Height - this.PagesBox.offsetHeight)+"px";
}

// ********************************************************************************
// Calcola le dimensioni dei div che contengono il pannello in lista o in form
// in base al contenuto
// ********************************************************************************
IDPanel.prototype.AdaptFormListLayout = function()
{
  var nheight = 0;     // nuova altezza del div
  var nwidth = 0;      // nuova larghezza del div
  var ro = this.RowSelWidth(); // dimensione row selector
  //
  // Se il pannello e' in lista le dimensioni iniziali sono la dimensione della lista stessa
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    var ofs = (this.ScrollBox && !RD3_Glb.IsMobile())?18:0;                          // Troppo lenta!
    //
    nwidth = this.ListLeft + (RD3_ServerParams.CompletePanelBorders ? 0 : ro) + this.ListWidth-1 + ofs + 2; // 2px Bordi
    nheight = this.ListTop + this.ListHeightRounded + 2;      // 2px Bordi
    //
    // Se ci sono delle fixed col devo comunque tenere un po' di margine.
    if (this.FixedColumns > 0 && this.ScrollAreaBox && this.ScrollAreaBox.style.display != "none")
      nheight = this.ListTop + parseInt(this.ScrollAreaBox.style.height);
  }
  //
  // Per tutti i campi di pannello visibili
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    if (f.IsVisible(true))
    {
      var cl = 0;  // dimensione occupata da sinistra del campo comprensiva della larghezza
      var ct = 0;  // dimensione occupata dall'alto del campo comprensiva dell'altezza
      //
      // Considero i campi fuori lista e in layout form
      if (this.PanelMode==RD3_Glb.PANEL_FORM)
      {
        if (!f.Group)
        {
          cl = f.FormLeft+f.FormWidth;
          ct = f.FormTop+f.FormHeight;
          //
          // Se e' un campo statico con un badge, ne tengo conto
          if (f.IsStatic() && f.Badge!="")
            cl += 12;
        }
        else
        {
          // VS del gruppo: serve per calcolare i bordi
          var groupvs = f.Group.VisualStyle;
          if (groupvs == -1)
            groupvs = this.VisualStyle;
          //
          // Se il campo e' contenuto in un gruppo dimensiono il pannello in modo che possa contenere l'intero gruppo
          // Lo posso fare perche' la AdaptFormListLayout viene chiamata solo dall'AdaptLayout dopo che ha dimensionato
          // correttamente i gruppi
          cl = f.Group.FormLeft+f.Group.FormWidth + groupvs.GetOffset(true, 3, false, true);
          ct = f.Group.FormTop+(f.Group.Collapsed ? 0 : f.Group.FormHeight + groupvs.GetOffset(false, 3, false, true));
        }
      }
      else
      {
        if (!f.ListList && (f.AggregateOfField == -1 || (this.FixedColumns == 0 && f.AggregateOfField >= 0)))
        {
          // Se il campo fuori lista e' contenuto in un gruppo fuori lista
          // allora dimensiono il pannello in modo che possa contenere l'intero gruppo
          if (f.Group && !f.Group.InList)
          {
            // VS del gruppo: serve per calcolare i bordi
            var groupvs = f.Group.VisualStyle;
            if (groupvs == -1)
              groupvs = this.VisualStyle;
            //
            cl = f.Group.ListLeft+f.Group.ListWidth + groupvs.GetOffset(true, 3, true, true);
            ct = f.Group.ListTop+(f.Group.Collapsed ? 0 : f.Group.ListHeight + groupvs.GetOffset(false, 3, true, true));
          }
          else
          {
            cl = f.ListLeft+f.ListWidth+ro;
            ct = f.ListTop+f.ListHeight;
            //
            // Se e' un campo statico con un badge, ne tengo conto
            if (f.IsStatic() && f.Badge!="")
              cl += 12;
          }
        }
        else if (f.AggregateOfField >= 0 && this.FixedColumns > 0 && this.ScrollAreaBox.style.display == "none") {
          // Ho un campo di somma e le colonne fisse ma l'area non e' scrollabile. In questo caso devo comunque alzare l'altezza per 
          // mostrare il campo somma che e' contenuto in ListBox e ha overflow:hidden; altrimenti rimarrebbe nascosto
          ct = this.ListTop + this.ListHeightRounded + 2 + f.ListHeight;
        }
      }
      //
      // se il campo sfora in una dimensione allargo il div
      if (cl > nwidth)
        nwidth = cl;
      if (ct > nheight)
        nheight = ct;
    }
  }
  //
  // Aumento di 2px per tenere conto dei bordi esterni degli oggetti
  nwidth+=2;
  nheight+=2;
  //
  // Imposto la dimensione del contenitore giusto a seconda del layout corrente del pannello
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    this.ListBox.style.width = nwidth + "px";
    this.ListBox.style.height = nheight + "px";
  }
  if (this.PanelMode==RD3_Glb.PANEL_FORM)
  {
    this.FormBox.style.width = nwidth + "px";
    this.FormBox.style.height = nheight + "px";
  }
  //
  RD3_Glb.AdaptToParent(this.ToolbarBox, 0, -1);
}

// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto (LIST)
// ********************************************************************************
IDPanel.prototype.CalcListLayout = function(flDontCheckSB)
{ 
  // Se non ha la lista, esco
  if (!this.ListBox)
    return;
  //
  var ll = this.ListLeft + this.RowSelWidth();
  if (RD3_ServerParams.CompletePanelBorders)
    ll = this.ListLeft;
  //
  // Considero le fixed columns?
  var fxc = this.FixedColumns;
  if (fxc>0)
  {
    // Vediamo se ce n'e' bisogno: se i campi della lista stanno tutti nel pannello
    // disabilito le fixed cols
    var d = 0;
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      if (f.InList && f.ListList && f.IsVisible())
      {
        d+=f.ListWidth;
      }
    }
    //
    if (d+ll < this.ContentBox.clientWidth + (flDontCheckSB?17:0) - (this.ScrollBox?this.ScrollBox.offsetWidth:0) - 3)
      fxc = 0;
  }
  //
  // Posiziono il list list container
  // Il lato sx tiene conto dei rowselector
  this.ListListBox.style.left = ll + "px";
  this.ListListBox.style.top = this.ListTop + "px";
  //
  // mostro o meno la scrolling area
  this.ScrollAreaBox.style.display = (fxc>0)? "" : "none";
  //
  // Dico ai gruppi che sto ricalcolando il loro layout, inoltre
  // ne aggiorno la visibilita'
  var n = this.Groups.length;
  for (var i=0; i<n; i++)
    this.Groups[i].ResetListPosition();
  //
  // Se il pannello ha un bordo, toglo 1 px in alto
  var brd = this.VisStyle.GetBorders(1);
  var panHasBrd = (brd == 4 || brd == 2); //  Bordo(VISBDI_VALUE) == VISBRD_FRAME o VISBRD_HORIZ 
  var n = this.Fields.length;
  //
  var d = (panHasBrd ? -1 : 0); // offset dei campi all'interno del list container
  var t = (panHasBrd ? -1 : 0); // posizione top dei campi
  var ft = 0; // memorizza la posizione top del primo campo, utile per posizionare i row sel
  var ncol = 0; // numero di colonne posizionate finora
  //
  if (RD3_ServerParams.CompletePanelBorders)
    d += this.RowSelWidth();
  //
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder)
      f = this.ListTabOrder[i];
    //
    if (f.InList && f.ListList)
    {
      if (f.IsVisible())
      {
        // Conto il numero di colonne posizionate
        ncol++;
        //
        // Calcolo l'oggetto che deve contenere questo campo
        var par = (fxc>0 && ncol>fxc)? this.ScrollAreaBox : this.ListListBox;
        //
        // Il campo appartiene ad un gruppo, lo posiziono nella lista al posto corretto
        if (f.Group)
          f.Group.SetListPosition(d, t, par, f.ListWidth);
        //
        // Devo metterlo al punto giusto nella lista, saltando i campi invisibili
        f.SetListListPosition(d,t,par);
        //
        // Memorizzo il listtop dei campi in lista
        ft = f.ListTop;
        //
        d+=f.ListWidth;
        //
        if (ncol==fxc)
        {
          // Ho esaurito le colonne fisse, posiziono lo scroll container
          this.ScrollAreaBox.style.left = (ll + d) + "px";
          this.ScrollAreaBox.style.top = this.ListListBox.style.top;
          //
          // Verifico se la scroll area contiene anche campi totali; nel caso la alzo q.b.
          var offsetH = 0;
          for (var j = 0; j < n; j++)
          {
            var f1 = this.Fields[j];
            if (f1.AggregateOfField == -1 || !f1.IsVisible())
              continue;
            //
            offsetH = Math.max(offsetH, f1.ListTop + f1.ListHeight - this.ListTop - this.ListHeightRounded - 2);
          }
          //
          this.ScrollAreaBox.style.height = (this.ListHeightRounded + offsetH + 18) + "px";
          //
          var nw = (this.ContentBox.clientWidth - (this.ScrollBox?this.ScrollBox.offsetWidth:0) - (ll+d) - 3);
          this.ScrollAreaBox.style.width = (nw>=0 ? nw : 0) + "px";
          //
          // Riparto dall'interno dello scroll container
          d=0;
        }
      }
    }
    //
    f.UpdateFieldVisibility();
  }  
  //
  var ng = this.Groups.length;
  for (var i=0; i<ng; i++)
    this.Groups[i].UpdateVisibility();
  //
  if (fxc == 0) 
    this.ListWidth = d+1;
  else
    this.ListWidth = this.ContentBox.clientWidth - (this.ScrollBox?this.ScrollBox.offsetWidth:0) - ll - 3;
  if (this.ListWidth<1)
    this.ListWidth = 1;
  var lstWidth = this.ListWidth;
  if (RD3_ServerParams.CompletePanelBorders)
  {
    var scrW = 0;
    if (this.ScrollBox && !RD3_Glb.IsMobile())
      scrW = RD3_Glb.IsEdge() ? 13 : 18;
    lstWidth = this.ListWidth + scrW;
    //
    // Su IE>10 devo aggiungere 1 px, altrimenti la scrollbar non scrolla se clicchi le frecce..
    if (RD3_Glb.IsIE(10,true))
      lstWidth++;
  }
  //
  this.ListListBox.style.width = (lstWidth-1) + "px";
  //
  // Posiziono la scrollbar
  if (this.ScrollBox)
  {
    this.ScrollBox.style.left = (ll + this.ListWidth) + "px";
    this.ScrollBox.style.top = (ft + (panHasBrd ? 1 : 0)) + ((RD3_ServerParams.CompletePanelBorders && !RD3_ServerParams.Theme.startsWith("zen")) ? -1 : 0) + this.GetHeaderSearchOffset() + "px";
    this.ScrollBox.style.height = ((this.NumRows-1)*this.GetRowHeight()+this.MaxHRow + 1) + (RD3_ServerParams.CompletePanelBorders ? -2 : 0) + "px";
    //
    if (RD3_ServerParams.CompletePanelBorders && !RD3_Glb.IsIE(10,true))
      this.ScrollBox.style.width = RD3_Glb.IsEdge() ? "12px" : "17px";
    //
    if (this.ScrollBoxTouch)
    {
      this.ScrollBoxTouch.style.left = this.ScrollBox.offsetLeft+"px";
      this.ScrollBoxTouch.style.top = this.ScrollBox.offsetTop+"px";
      this.ScrollBoxTouch.style.height = (this.ScrollBox.offsetHeight-2)+"px";
    }
    //
    // Configuro la caption per la scrollbar se devo
    if (RD3_ServerParams.CompletePanelBorders && this.ScrollBoxCap)
    {
      var panbrd = this.VisStyle.GetBorders(1);
      var intbrd = this.VisStyle.GetBorders(2);
      //
      var rc = new Rect(ll+this.ListWidth, t+this.ListTop, RD3_Glb.IsEdge() ? 13 : 18, this.HeaderSize);
      this.VisStyle.AdaptCaptionRect(rc, true, true);
      //
      // Se il pannello ha il bordo verticale e l'intestazione no, la sposto
      if ((panbrd == 4 || panbrd == 3) && intbrd != 4 && intbrd != 3) 
      {
        rc.x++;
        rc.w--;
        if (rc.x + rc.w == lstWidth - 4)
          rc.w--;
      }
      //
      if (RD3_ServerParams.Theme.startsWith("zen"))
      {
        rc.w += !RD3_Glb.IsIE() ? 3 : 2;
        if (!RD3_Glb.IsIE())
          rc.h += 1;
        if (RD3_Glb.IsChrome())
          rc.w += 1;
      }
      //
      // Se il pannello ha il bordo orizzontale e l'intestazione no, la sposto
      if ((panbrd == 4 || panbrd == 2) && intbrd != 4 && intbrd != 2) 
      {
        rc.y++;
        rc.h--;
      }
      //
      // Se la lista ha il bordo orizzontale o quadrato allora devo spostare la caption in basso di 1 px
      if (panbrd == 2 || panbrd == 4)
        rc.y++;
      //
      // Se la lista non ha bordo devo recuperare 1 px a sinistra
      if (panbrd == 1 || panbrd == 2)
        rc.x--;
      //
      // Su IE>10 devo aggiungere 1 px, altrimenti la scrollbar non scrolla se clicchi le frecce..
      if (RD3_Glb.IsIE(10,true))
        rc.w++;
      //
      var s = this.ScrollBoxCap.style;
      s.left = rc.x + "px";
      s.top = rc.y + "px";
      s.width = rc.w + "px";
      s.height = rc.h + "px";
      //
      s.paddingLeft = rc.pxl + "px";
      s.paddingRight = rc.pxr + "px";
      s.paddingTop = rc.pyt + "px";
      s.paddingBottom = rc.pyb + "px";
    }
    //
    if (RD3_ServerParams.CompletePanelBorders && this.ListQBERCap) 
    {
      var panbrd = this.VisStyle.GetBorders(1);
      var intbrd = this.VisStyle.GetBorders(2);
      //
      var rcaptop = t + this.ListTop + this.HeaderSize + this.VisStyle.GetHeaderOffset();
      var rcapwidth = RD3_Glb.IsEdge() ? 13 : 18;
      if (!RD3_ServerParams.Theme.startsWith("zen")) 
      {
        rcaptop += 1;
        if (RD3_Glb.IsIE())
          rcapwidth += 1;
      }
      var rc = new Rect(ll + this.ListWidth, rcaptop, rcapwidth, this.GetRowHeight());
      this.VisStyle.AdaptCaptionRect(rc, true, true);
      if (RD3_ServerParams.Theme.startsWith("zen")) {
        rc.w += !RD3_Glb.IsIE() ? 3 : 2;
        if (!RD3_Glb.IsChrome())
          rc.h += 1;
        if (!RD3_Glb.IsIE())
          rc.h += 1;
      }
      //
      var s = this.ListQBERCap.style;
      s.left = rc.x + "px";
      s.top = rc.y + "px";
      s.width = rc.w + "px";
      s.height = rc.h + "px";
      //
      s.paddingLeft = rc.pxl + "px";
      s.paddingRight = rc.pxr + "px";
      s.paddingTop = rc.pyt + "px";
      s.paddingBottom = rc.pyb + "px";
    }
  }
  if (this.ScrollBoxMobile)
  {
    var h = this.ContentBox.offsetHeight-30;
    var ofsw = this.ScrollBoxMobile.offsetWidth;
    if (ofsw == 0)
      ofsw = parseInt(RD3_Glb.GetStyleProp(this.ScrollBoxMobile, "width"));
    this.ScrollBoxMobile.style.left = (this.ContentBox.offsetWidth-ofsw-2) + "px";
    this.ScrollBoxMobile.style.height = h+"px";    
    //
    // Aggiorno il contenuto
    var step=1;
    var s = "#";
    for (var i=65;i<91;i+=step)
      s += "<br>"+String.fromCharCode(i);
    this.ScrollBoxMobile.innerHTML = s;
    this.ScrollBoxMobile.style.lineHeight = (h/2.9)+"%";
  }
  //
  // Posiziono i rowselector
  if (this.RowSel)
  {
    var rsd = this.ListLeft;
    var rst = ft;
    if (RD3_ServerParams.Theme.startsWith("zen") && !RD3_ServerParams.CompletePanelBorders) {
      rst += 3;
      if (this.ShowMultipleSel) {
        rsd += 5;
        rst += 5;
      }
    }
    //
    if (this.UseListQBE == RD3_Glb.PAN_QBEROW && this.ListQBELCap) 
    {
      var rc2 = new Rect(rsd, (rst + ((RD3_Glb.IsTouch() && this.ShowMultipleSel) ? 2 : 0)), this.RowSelWidth(), this.GetRowHeight());
      this.VisStyle.AdaptCaptionRect(rc2, true, true);
      //
      if (RD3_ServerParams.Theme.startsWith("zen")) 
      {
        rc2.w += 2;
        if (!RD3_Glb.IsIE() && !RD3_Glb.IsChrome())
          rc2.h += 1;
      }
      //
      var s = this.ListQBELCap.style;
      s.left = rc2.x + "px";
      s.top = rc2.y + "px";
      s.width = rc2.w + "px";
      s.height = rc2.h + "px";
      //
      s.paddingLeft = rc2.pxl + "px";
      s.paddingRight = rc2.pxr + "px";
      s.paddingTop = rc2.pyt + "px";
      s.paddingBottom = rc2.pyb + "px";
    }
    //
    rst += this.GetHeaderSearchOffset();
    for (var i=0; i<this.NumRows; i++)
    {
      this.RowSel[i].style.left = rsd + "px";
      this.RowSel[i].style.top = (rst+((RD3_Glb.IsTouch() && this.ShowMultipleSel)?2:0)) + "px";
      //
      if (RD3_ServerParams.CompletePanelBorders)
      {
        var panbrd = this.VisStyle.GetBorders(1);
        var intbrd = this.VisStyle.GetBorders(2);
        //
        var rc = new Rect(rsd, (rst+((RD3_Glb.IsTouch() && this.ShowMultipleSel)?2:0)), this.RowSelWidth(), this.GetRowHeight());
        this.VisStyle.AdaptCaptionRect(rc, true, true);
        //
        if (RD3_ServerParams.Theme.startsWith("zen"))
        {
          rc.w += 2;
          if (!RD3_Glb.IsChrome())
            rc.h += 1;
          if (RD3_Glb.IsIE(10, true))
            rc.h--;
        }
        //
        // Se il pannello ha il bordo verticale e l'intestazione no, la sposto
        if ((panbrd == 4 || panbrd == 3) && intbrd != 4 && intbrd != 3) 
        {
          rc.x++;
          rc.w--;
          if (rc.x + rc.w == lstWidth - 4)
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
        // Se la lista ha bordo verticale devo recuperare un px di larghezza
        if (panbrd == 3)
          rc.w++;
        //
        // Su IE<10 devo centrare manualmente impostando i padding
        if (RD3_Glb.IsIE(10, false))
        {
          rc.w = rc.w + rc.pxl + rc.pxr;
          rc.h = rc.h + rc.pyt + rc.pyb;
          rc.pxl = 0;
          rc.pxr = 0;
          rc.pyt = 0;
          rc.pyb = 0;
          //
          var dim = this.ShowMultipleSel ? 20 : 15;
          var midW = Math.floor((rc.w - dim)/2);
          var midH = Math.floor((rc.h - dim)/2);
          //
          if (midW > 0)
          {
            rc.pxl = midW;
            rc.pxr = midW;
            rc.w = rc.w - rc.pxl - rc.pxr;
          }
          if (midH > 0)
          {
            rc.pyt = midH;
            rc.pyb = midH;
            rc.h = rc.h - rc.pyt - rc.pyb;
          }
        }
        //
        var s = this.RowSel[i].style;
        s.left = rc.x + "px";
        s.top = rc.y + "px";
        s.width = rc.w + "px";
        s.height = rc.h + "px";
        s.lineHeight = rc.h + rc.pyt + rc.pyb + "px";
        //
        s.paddingLeft = rc.pxl + "px";
        s.paddingRight = rc.pxr + "px";
        s.paddingTop = rc.pyt + "px";
        s.paddingBottom = rc.pyb + "px";
      }
      //
      rst += this.GetRowHeight();
    }
  }
  //
  // Positiono i comandi della toolbar multisel
  var hlimit = RD3_ServerParams.CompletePanelBorders ? 0 : 32;
  var vis = this.HeaderSize >= hlimit && this.ShowRowSelector;
  //
  if (this.ToggleMultiSelBox)
  {
    var panbrd = this.VisStyle.GetBorders(1);
    var intbrd = this.VisStyle.GetBorders(2);
    //
    var rc = new Rect(ll, t+this.ListTop, this.RowSelWidth(), this.HeaderSize);
    this.VisStyle.AdaptCaptionRect(rc, true, true);
    //
    if (RD3_ServerParams.Theme.startsWith("zen"))
    {
      rc.w += 3;
      if (RD3_Glb.IsChrome())
        rc.h += 2;
      else if (!RD3_Glb.IsIE())
        rc.h += 1;
    }
    //
    // Se il pannello ha il bordo verticale e l'intestazione no, la sposto
    if ((panbrd == 4 || panbrd == 3) && intbrd != 4 && intbrd != 3) 
    {
      rc.x++;
      rc.w--;
      if (rc.x + rc.w == lstWidth - 4)
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
    // Se la lista ha il bordo orizzontale o quadrato allora devo spostare la caption in basso di 1 px
    if (panbrd == 2 || panbrd == 4)
      rc.y++;
    //
    // Se la lista ha bordo verticale devo recuperare un px di larghezza
    if (panbrd == 3)
      rc.w++;
    //
    var s = this.ToggleMultiSelBox.style;
    s.left = rc.x + "px";
    s.top = rc.y + "px";
    s.width = rc.w + "px";
    s.height = rc.h + "px";
    s.lineHeight = rc.h + "px";
    //
    s.paddingLeft = rc.pxl + "px";
    s.paddingRight = rc.pxr + "px";
    s.paddingTop = rc.pyt + "px";
    s.paddingBottom = rc.pyb + "px";
    //
    s.visibility = vis? "":"hidden";
  }
  //
  if (this.ToggleMultiSelCmd)
  {
    if (RD3_ServerParams.CompletePanelBorders)
    {
      this.ToggleMultiSelCmd.style.position = "static";
      this.ToggleMultiSelCmd.style.paddingLeft = (RD3_ServerParams.Theme.startsWith("zen") ? 0 : rc.pxl) + "px";
    }
    else
    {
      this.ToggleMultiSelCmd.style.left = (this.ListLeft + (RD3_ServerParams.Theme.startsWith("zen") ? 9 : 5)) + "px";
      this.ToggleMultiSelCmd.style.top = this.ListTop + "px";
      this.ToggleMultiSelCmd.style.visibility = vis? "":"hidden";
      //
      if (RD3_ServerParams.Theme.startsWith("zen"))
      {
        this.ToggleMultiSelCmd.style.position = "absolute";
        this.ToggleMultiSelCmd.style.width = "12px";
        this.ToggleMultiSelCmd.style.height = "12px";
      }
    }    
  }
  if (this.MultiSelectAllCmd)
  {
    this.MultiSelectAllCmd.style.left = (this.ListLeft + (RD3_ServerParams.Theme.startsWith("zen") ? 9 : 5)) + "px";
    this.MultiSelectAllCmd.style.top = (this.ListTop + (RD3_Glb.IsTouch()?14:(RD3_ServerParams.Theme.startsWith("zen")?13:11))) + "px";
    this.MultiSelectAllCmd.style.visibility = vis? "":"hidden";
    if (RD3_ServerParams.Theme.startsWith("zen"))
    {
      this.MultiSelectAllCmd.style.position = "absolute";
      this.MultiSelectAllCmd.style.width = "12px";
      this.MultiSelectAllCmd.style.height = "12px";
    }
  }
  if (this.MultiSelectNoneCmd)
  {
    this.MultiSelectNoneCmd.style.left = (this.ListLeft + (RD3_ServerParams.Theme.startsWith("zen") ? 9 : 5)) + "px";
    this.MultiSelectNoneCmd.style.top = (this.ListTop + (RD3_Glb.IsTouch()?28:(RD3_ServerParams.Theme.startsWith("zen")?26:22))) + "px";
    this.MultiSelectNoneCmd.style.visibility = vis? "":"hidden";
    if (RD3_ServerParams.Theme.startsWith("zen"))
    {
      this.MultiSelectNoneCmd.style.position = "absolute";
      this.MultiSelectNoneCmd.style.width = "12px";
      this.MultiSelectNoneCmd.style.height = "12px";
    }
  }  
}

// ********************************************************************************
// Calcola le dimensioni dei gruppi in base alla dimensione del loro contenuto
// ********************************************************************************
IDPanel.prototype.CalcGroupsLayout= function()
{
  var resize = false;
  //
  var ng = this.Groups.length;
  for (var i=0; i<ng; i++)
    resize |= this.Groups[i].CalcLayout();
  //
  // Se qualche gruppo e' cambiato e sono su mobile, devo adattare il mio container
  if (resize && RD3_Glb.IsMobile())
    this.AdaptFormListLayout();
  //
  // Adesso per il tema Mobile dobbiamo gestire i bordi interni dei campi
  if (RD3_Glb.IsMobile() && !RD3_Glb.IsMobile7() && !RD3_Glb.IsQuadro())
  {
    for (var i=0; i<this.Groups.length; i++)
      this.UpdateFieldClass(this.Groups[i]);
  }
}


// ********************************************************************************
// Ritorna il primo campo in lista
// ********************************************************************************
IDPanel.prototype.GetFirstListField= function()
{
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[i];
    //
    if (f.IsVisible() && f.InList && f.ListList)
      return f;
  }  
  //
  return null;
}


// ********************************************************************************
// Evento di scrolling della lista del pannello
// ********************************************************************************
IDPanel.prototype.OnScroll = function(ev)
{ 
  // Su firefox scattano  degli Onscroll dovuti alla rimozione della scrollbar,
  // pero' scattano quando il pannello e' in Form: in questo caso li ignoriamo
  if (RD3_Glb.IsFirefox() && this.PanelMode==RD3_Glb.PANEL_FORM)
    return;
  //
  // Uso questo trucco per forzare sempre lo scroll quando sono arrivato in fondo,
  // altrimenti causa timer potrei non mandare al server l'ultimo scroll e l'utente potrebbe non vedere le ultime righe
  if (this.SkipScroll == -1 && this.PanelMode==RD3_Glb.PANEL_LIST && !this.IsNewRow(this.ActualPosition, this.ActualRow) && this.ScrollBox.scrollTop + this.ScrollBox.clientHeight >= this.ScrollBox.scrollHeight)
    this.LastPositionTime = new Date() - 200;
  //
  // Registro la posizione attuale della toolbar in modo da poterla
  // ripristinare
  this.ScrollBoxInt.setAttribute("idtop",this.ScrollBox.scrollTop);
  //
  // Stavo riposizionando...
  if (((new Date()) - this.LastPositionTime) < (RD3_Glb.IsFirefox(3) ? 100 : 50))
  {
    // Verifico lo skipscroll: se e' impostato verifico per quale scrolltop e' impostato: se e' quello attuale allora
    // skippo veramente lo scroll; se e' impostato per un'altro scrolltop significa che qualcuno ha mosso la scrollbar..
    // allora non skippo (e annullo lo skipscroll)
    if (this.SkipScroll != -1)
    { 
      this.SkipScroll = -1;
      //
      if (this.SkipScroll == (this.ScrollClone)?this.ScrollClone.scrollTop:this.ScrollBox.scrollTop)
        return;
    }
    //
    if (this.ScrollTimer)
      window.clearTimeout(this.ScrollTimer); 
    //
    this.ScrollTimer = window.setTimeout(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"','OnScroll', ev)"),100);
    //
    return;
  }
  //
  var t = (this.ScrollClone)?this.ScrollClone.scrollTop:this.ScrollBox.scrollTop;
  //
  var n = Math.floor(t/this.GetRowHeight())+1;
  defaultStatus = n+"-"+(n+this.NumRows-1)+" su "+this.GetTotalRows();
  //
  // Se la visione e' gruppata allora devo capire quale indice reale associare alla riga a cui sono 
  // andato del pannello, perche' al server e al sistema serve quella
  if (this.IsGrouped())
  {
    if (n+this.NumRows >= this.GetTotalRows()+1)
    {
      // Mi devo posizionare alla fine del pannello, devo fare un controllo: chiedo l'indice relativo alla riga e poi faccio
      // il caloclo contrario, se la posizione che ottengo non permette di vedere tutti i campi passo al record successivo
      var s = this.ListGroupRoot.GetServerIndex(n);
      var c = this.ListGroupRoot.GetRowPos(s);
      //
      if (c+this.NumRows < this.GetTotalRows()+1)
        s = s+1;
      n = s;  
    }
    else
      n = this.ListGroupRoot.GetServerIndex(n);
  }
  //
  this.ScrollTo(n, ev);
  return true;
}


// ********************************************************************************
// Gestisce scrollbar clonata in IE
// ********************************************************************************
IDPanel.prototype.OnScrollMouseEnter = function(ev)
{ 
  if (this.ScrollClone)
    document.body.removeChild(this.ScrollClone);
  //
  this.ScrollClone = this.ScrollBox.cloneNode(true);
  this.ScrollClone.style.zIndex = 100;
  //this.ScrollClone.style.border = "1px solid green";
  this.ScrollClone.onscroll = this.ScrollBox.onscroll;
  //
  if (RD3_Glb.IsIE())
    this.ScrollClone.onmouseleave = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMouseLeave', ev)");
  if (RD3_Glb.IsFirefox())
    this.ScrollClone.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScrollMouseLeave', ev)");
  //
  this.ScrollClone.style.left = RD3_Glb.GetScreenLeft(this.ScrollBox)+"px";
  this.ScrollClone.style.top = RD3_Glb.GetScreenTop(this.ScrollBox)+"px";
  document.body.insertBefore(this.ScrollClone, document.body.childNodes[0]);
  this.LastPositionTime = new Date();
  this.SkipScroll = this.ScrollBox.scrollTop;
  this.ScrollClone.scrollTop = this.ScrollBox.scrollTop;
  return true;
}


// ********************************************************************************
// Gestisce scrollbar clonata in IE
// ********************************************************************************
IDPanel.prototype.OnScrollMouseLeave = function(ev)
{ 
  if (RD3_Glb.IsIE())
  {
    if (this.ScrollClone && this.ScrollClone!=document.elementFromPoint(window.event.clientX, window.event.clientY))
    {
      this.LastPositionTime = new Date();
      this.SkipScroll = this.ScrollClone.scrollTop;
      this.ScrollBox.scrollTop = this.ScrollClone.scrollTop;
      document.body.removeChild(this.ScrollClone);
      this.ScrollClone = null;
    }
  }
  //
  if (RD3_Glb.IsFirefox() && this.ScrollClone)
  {
    this.LastPositionTime = new Date();
    this.SkipScroll = this.ScrollClone.scrollTop;
    this.ScrollBox.scrollTop = this.ScrollClone.scrollTop;
    document.body.removeChild(this.ScrollClone);
    this.ScrollClone = null;
  }
}


// ********************************************************************************
// Evento di scrolling della lista del pannello
// ********************************************************************************
IDPanel.prototype.OnMouseWheel = function(ev)
{ 
  if (RD3_Glb.IsFirefox())
    this.OnScrollMouseLeave();
  //
  // Su chrome, safari, IE<9 ci arriva wheelDelta, su IE9+ e FFX arriva deltaY
  // ma su IE9+ deltaMode e' 0 (quindi deltaY e' in px)
  // su FFX deltaMode e' 1 (quindi deltaY e' in linee e va moltiplicato per avere un valore di px decente)
  var eve = window.event ? window.event : ev;
  var srcElement = eve.srcElement ? eve.srcElement : eve.target;
  var delta = eve.wheelDelta != undefined ? eve.wheelDelta : (eve.deltaMode == 0 ? -eve.deltaY : -eve.deltaY*40);
  //
  // Scroll orizzontale su FFX o IE9+
  if (eve.deltaX != undefined && eve.deltaX != 0)
    return true;
  //
  //  Scroll orizzontale su Chrome o Safari o IE<9
  if (eve.wheelDeltaX && eve.wheelDeltaX != 0)
    return true;
  //
  // Eseguo scrolling, se combo non aperta!
  if (!RD3_DDManager.OpenCombo)
    this.ScrollBox.scrollTop -= delta/2;
  //
  // Informo il TooltipManager
  RD3_TooltipManager.DeactivateAll();
  //
  RD3_Glb.StopEvent(ev);
  return false;
}


// ********************************************************************************
// Gestisco lo scrolling (da scrollbar o tasti) verso una specifica posizione di
// pannello
// ********************************************************************************
IDPanel.prototype.ScrollTo = function(n, evento, delayms)
{ 
  // Il numero di righe visualizzate del pannello e' 1 se sono in form, numrows se sono in list
  var nr = (this.PanelMode==RD3_Glb.PANEL_LIST)?this.NumRows:1;
  //
  // Il numero di righe visualizzate del pannello e' 1 se sono in form, numrows se sono in list
  var cannav = this.CanNavigate() && (this.GetTotalRows()>nr || this.ActualPosition>1);
  //
  if (!cannav)
    return;
  //
  // Se la cella attiva ha una modifica in sospeso, e' bene che faccia il suo sendchanges
  var actele = RD3_KBManager.ActiveElement;
  if (actele)
  {
    var actobj = RD3_KBManager.GetCell(actele);
    if (actobj && actobj instanceof PCell && actobj.PValue && actobj.IsUncommitted())
      actobj.PValue.SendChanges(actele);
  }
  //
  var evt = this.ScrollEventDef;
  //
  // Se il pannello e' gruppato e in lista lato client devo acrollare a n, ma al server devo dire di posizionarsi
  // alla riga reale, cosi' puo' mandarmi i valori corretti.
  var sn = n;
  //
  if (this.IsGrouped() && this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    var rowpos = this.ListGroupRoot.GetRowPos(sn, true, true);
    sn = this.ListGroupRoot.GetServerIndex(rowpos + this.ActualRow, true);
    //
    // Al server mando la riga sn, pero' c'e' il rischio di avere dei buchi,
    // quindi vado indietro fino a quando non trovo un header di gruppo o non arrivo al top del pannello (NumRows)
    // in questo caso non dovrei avere dei buchi..
    var origSn = sn;
    var rown = this.ActualRow;
    for (var i = sn; i > sn - this.NumRows + this.ActualRow; i--) {
      var localrowpos = this.ListGroupRoot.GetRowPos(i, true, true);
      if (this.ListGroupRoot.IsHeader(localrowpos) == -1)
        break;
      if (!this.GetFirstListField().PValues[i]) {
        sn = i;
        rown += 1;
        //
        if (rown >= this.NumRows)
          break;
      }
    }
    //
    // Devo anche spostare l'actualRow, altrimenti il server non e' posizionato bene
    if (this.ScrollGroupTimeout) {
      window.clearTimeout(this.ScrollGroupTimeout);
      delete this.ScrollGroupTimeout;
    }
    var _this = this;
    this.ScrollGroupTimeout = window.setTimeout(function () {
      delete _this.ScrollGroupTimeout;
      var ev = new IDEvent("chgrow", _this.Identifier, evento, evt |= RD3_Glb.EVENT_IMMEDIATE, null, rown, origSn, undefined, undefined, delayms);
    }, 400);
  }
  //
  // Se non ho i dati da far vedere e' utile che l'evento sia immediato
  var f = this.GetFirstListField();
  if (f!=null && f.HasValues(sn))
    evt |= RD3_Glb.EVENT_IMMEDIATE;
  //
  // Creo l'evento (che si aggiunge all'elenco se deve)
  var ev = new IDEvent("panscr", this.Identifier, evento, evt, null, sn, undefined, undefined, undefined, delayms);
  //
  // Se c'e' un evento di change in sospeso, e' meglio mandare tutto al server
  var ec = RD3_DesktopManager.MessagePump.GetEvent("", "chg");
  if (ec)
    RD3_DesktopManager.SendEvents(true);
  //
  // Se l'evento ha le caratteristiche per essere gestito lato client,
  // lo faccio ora
  if (ev.ClientSide)
  {
    // Se e' attivo il FixActiveRow e sono in lista, tengo fisso l'ActiveRow
    if (this.PanelMode==RD3_Glb.PANEL_LIST && this.IsPanelFixActiveRowWhenScrolled())
    {
      // Se NON sto gestendo i tasti per muovermi (delayms) allora muovo l'ActualRow
      // altrimenti informo il server che la riga e' cambiata
      if (!delayms)
        this.SetActualRow(this.ActualRow - (n - this.ActualPosition));
      else
      {
        // Qui devo informare il server che la riga e' cambiata. Infatti il server ricevera' un panscr (vedi sopra) 
        // e tentera' di tenere fisso l'ActiveRow (non puo' sapere che la causa dello scroll e' un tasto e che quindi
        // la riga attiva va cambiata... glielo dico io)
        // 
        // Se il pannello e' gruppato aggiungo anche la riga assoluta a cui mi devo portare, in modo che il server
        // possa gestire il buffer video di conseguenza , nel caso sia su una nuova riga
        // mando al server un indice che supera i record, il server si posizionera' su indice-riga, mantenendo
        // la posizione corretta
        var absrow = 0;
        if (this.IsGrouped())
          absrow = this.ListGroupRoot.GetServerIndex(this.CompactActualPosition+this.ActualRow, true);
        //
        var ev = new IDEvent("chgrow", this.Identifier, evento, evt, null, this.ActualRow, absrow);
      }
    }
    //
    if (RD3_Glb.IsSafari() && !RD3_Glb.IsTouch())
      window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'DelayScroll', null, " + n + ")", 5);
    else
      this.SetActualPosition(n, false, true);
  }
}


// ********************************************************************************
// Gestisco lo scrolling (da scrollbar o tasti) verso una specifica posizione di
// pannello
// ********************************************************************************
IDPanel.prototype.DelayScroll = function(evento, n)
{ 
  this.SetActualPosition(n, false, true);
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
IDPanel.prototype.Unrealize = function()
{ 
  // Se ci sono aggiornamenti in background, li fermo... e' inutile proseguire
  this.DelayedListUpdate = false;
  //
  // Chiamo la classe base
  WebFrame.prototype.Unrealize.call(this);
  //
  // Se ho il clone della scrollbar devo togliere anche lui dal DOM
  if (this.ScrollClone)
    document.body.removeChild(this.ScrollClone);
  //
  // Passo il messaggio anche ai campi che cosi' possono gestire i subframes
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    this.Fields[i].Unrealize();
  }
  //
  // Devo togliere anche i gruppi e le pagine
  var n = this.Groups.length;
  for (var i=0; i<n; i++)
  {
    this.Groups[i].Unrealize();
  }
  var n = this.Pages.length;
  for (var i=0; i<n; i++)
  {
    this.Pages[i].Unrealize();
  }
  //
  if (this.QBETipBox)
    this.QBETipBox.Unrealize();
  //
  if (this.MultiSelCommand)
  {
    RD3_DesktopManager.WebEntryPoint.CmdObj.ClientCommands.remove(this.Identifier+":cms:0");
    this.MultiSelCommand.Unrealize();
    this.MultiSelCommand = null;
  }
  //
  this.Realized = false;
}


// ***************************************************************
// Crea gli oggetti DOM relativi alla Toolbar
// ***************************************************************
IDPanel.prototype.RealizeToolbar = function()
{
  // Chiamo la classe base
  WebFrame.prototype.RealizeToolbar.call(this);
  //
  // Creo le zone
  this.TBZones = new Array();
  for (var i=0;i<=10;i++) // MAX TB ZONES
  {
    // Nel caso mobile tutti i comandi
    // vengono inseriti direttamente nella toolbox
    if (RD3_Glb.IsMobile())
    {
      this.TBZones[i] = this.ToolbarBox;
    }
    else
    {
      this.TBZones[i] = document.createElement("span");
      this.TBZones[i].className = (this.SmallIcons) ? "panel-toolbarsmall-zone" : "panel-toolbar-zone";
      this.ToolbarBox.appendChild(this.TBZones[i]);
    }
  }
  //
  // La zona ZERO e' invisibile...
  if (!RD3_Glb.IsMobile())
    this.TBZones[0].style.display = "none";
  //
  // Sposto i bottoni standard nelle zone
  this.ToolbarBox.removeChild(this.CollapseButton);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_COLLAPSE];
  this.TBZones[i].appendChild(this.CollapseButton);
  this.CollapseButton.style.marginLeft = "";
  //
  this.ToolbarBox.removeChild(this.LockButton);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_LOCK];
  this.TBZones[i].appendChild(this.LockButton);
  //
  if (RD3_Glb.IsMobile())
  {
    this.ToolbarBox.removeChild(this.SearchBox);
    i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_LOCK];
    this.TBZones[i].appendChild(this.SearchBox);
  }
  //  
  this.ToolbarBox.removeChild(this.IconImg);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_STATUSBAR];
  this.TBZones[i].appendChild(this.IconImg);
  //  
  this.ToolbarBox.removeChild(this.CaptionTxt);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_STATUSBAR];
  this.TBZones[i].appendChild(this.CaptionTxt);
  //
  // Creo la Status Bar
  this.StatusBar = document.createElement("span");
  this.StatusBar.setAttribute("id", this.Identifier+":status");
  this.StatusBar.className = (this.SmallIcons) ? "panel-toolbarsmall-status" : "panel-toolbar-status";
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_STATUSBAR];
  this.TBZones[i].appendChild(this.StatusBar);
  //
  // Creo l'immagine per i QBETip e il MessageTooltip
  this.QBETIcon = document.createElement("img");
  if (!RD3_Glb.IsMobile()) this.QBETIcon.src = RD3_Glb.GetImgSrc("images/qbef.gif");
  this.QBETIcon.setAttribute("id", this.Identifier+":qbetip");
  this.QBETIcon.className = (this.SmallIcons) ? "panel-toolbarsmall-qbetip" : "panel-toolbar-qbetip";
  this.QBETIcon.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseOverObj', ev)");
  this.QBETIcon.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMouseOutObj', ev)");
  this.QBETipBox = new MessageTooltip(this);
  this.QBETipBox.SetTitle(ClientMessages.TIP_TITLE_QBETIP);
  this.QBETipBox.SetStyle("info");
  this.QBETipBox.SetObj(this.QBETIcon);
  this.QBETipBox.SetDelay(0,0);
  this.QBETipBox.SetPosition(2);
  this.QBETipBox.SetCanClose(false);
  if (!this.QBETipAnimDef)
    this.QBETipBox.SetAnimDef(RD3_ClientParams.GFXDef["qbetip"]);
  else
    this.QBETipBox.SetAnimDef(this.QBETipAnimDef);
  this.TBZones[i].appendChild(this.QBETIcon);
  //
  // Pulsanti di navigazione
  this.TopButton = document.createElement("img");
  this.TopButton.setAttribute("id", this.Identifier+":top");
  this.TopButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-top-button";
  this.TopButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'top')");
  this.TopButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.TopButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.TopButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.TopButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.TopButton, RD3_ServerParams.PanelInizio);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_NAVIGATE];
  this.TBZones[i].appendChild(this.TopButton);
  //
  this.PrevButton = document.createElement("img");
  this.PrevButton.setAttribute("id", this.Identifier+":prev");
  this.PrevButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-prev-button";
  this.PrevButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'prev')");
  this.PrevButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.PrevButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.PrevButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.PrevButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.PrevButton, RD3_ServerParams.PanelPaginaPrec);
  this.TBZones[i].appendChild(this.PrevButton);
  //
  this.NextButton = document.createElement("img");
  this.NextButton.setAttribute("id", this.Identifier+":next");
  this.NextButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-next-button";
  this.NextButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'next')");
  this.NextButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.NextButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.NextButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.NextButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.NextButton, RD3_ServerParams.PanelPaginaSucc);
  this.TBZones[i].appendChild(this.NextButton);
  //
  this.BottomButton = document.createElement("img");
  this.BottomButton.setAttribute("id", this.Identifier+":bottom");
  this.BottomButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-bottom-button";
  this.BottomButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'bottom')");
  this.BottomButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.BottomButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.BottomButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.BottomButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.BottomButton, RD3_ServerParams.PanelFine);
  this.TBZones[i].appendChild(this.BottomButton);
  //
  // Pulsante di cerca
  this.SearchButton = document.createElement("img");
  this.SearchButton.setAttribute("id", this.Identifier+":search");
  this.SearchButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-search-button";
  this.SearchButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'search')");
  this.SearchButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.SearchButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.SearchButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.SearchButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.SearchButton, RD3_ServerParams.TooltipCerca + RD3_KBManager.GetFKTip(RD3_ClientParams.FKEnterQBE));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_SEARCH];
  this.TBZones[i].appendChild(this.SearchButton);
  //
  // Pulsante di trova
  this.FindButton = document.createElement("img");
  this.FindButton.setAttribute("id", this.Identifier+":find");
  this.FindButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-find-button";
  this.FindButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'find')");
  this.FindButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.FindButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.FindButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.FindButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.FindButton, RD3_ServerParams.TooltipTrova + RD3_KBManager.GetFKTip(RD3_ClientParams.FKFindData));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_FIND];
  this.TBZones[i].appendChild(this.FindButton);
  //
  // Pulsante di form/list
  this.FormListButton = document.createElement(RD3_Glb.IsMobile()?"div":"img");
  this.FormListButton.setAttribute("id", this.Identifier+":formlist");
  this.FormListButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-formlist-button";
  this.FormListButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'list')");
  this.FormListButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.FormListButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.FormListButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.FormListButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.FormListButton, RD3_ServerParams.TooltipFormList + RD3_KBManager.GetFKTip(RD3_ClientParams.FKFormList));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_FORMLIST];
  if (RD3_Glb.IsMobile())
  {
    // Per fare il bottone con la freccia, devo creare un contenitore e poi mettere dentro i due div interni
    this.FormListButtonCnt = document.createElement("div");
    this.FormListButtonCnt.setAttribute("id", this.Identifier+":txt");
    this.FormListButtonCnt.className = "panel-formlist-container";
    this.TBZones[i].insertBefore(this.FormListButtonCnt, this.SearchBox);
    //
    this.FormListButton.textContent = RD3_Glb.IsMobile7()?ClientMessages.MOB_TOOLBAR_LIST:ClientMessages.MOB_TOOLBAR_TOLIST;
    this.FormListButtonImg = document.createElement("div");
    this.FormListButtonImg.setAttribute("id", this.Identifier+":spi");
    this.FormListButtonImg.className = "panel-formlist-arrow";
    this.FormListButtonImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'list')");
    this.FormListButtonCnt.appendChild(this.FormListButtonImg);
    this.FormListButtonCnt.appendChild(this.FormListButton);
  }
  else
  {
    this.TBZones[i].appendChild(this.FormListButton);
  }
  //
  // Pulsante di CANCEL
  this.CancelButton = document.createElement("img");
  this.CancelButton.setAttribute("id", this.Identifier+":cancel");
  this.CancelButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-cancel-button";
  this.CancelButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'cancel')");
  this.CancelButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.CancelButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.CancelButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.CancelButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.CancelButton, RD3_ServerParams.TooltipCancel + RD3_KBManager.GetFKTip(RD3_ClientParams.FKCancel));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_CANCEL];
  if (RD3_Glb.IsMobile())
    this.TBZones[i].insertBefore(this.CancelButton, this.FormListButtonCnt);
   else
    this.TBZones[i].appendChild(this.CancelButton);
  //
  // Pulsante di refresh
  this.RefreshButton = document.createElement("img");
  this.RefreshButton.setAttribute("id", this.Identifier+":refresh");
  this.RefreshButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-refresh-button";
  this.RefreshButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'refresh')");
  this.RefreshButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.RefreshButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.RefreshButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.RefreshButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.RefreshButton, RD3_ServerParams.TooltipRefresh + RD3_KBManager.GetFKTip(RD3_ClientParams.FKRefresh));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_REQUERY];
  this.TBZones[i].appendChild(this.RefreshButton);
  //
   // Pulsante di cancellazione
  this.DelButton = document.createElement("img");
  this.DelButton.setAttribute("id", this.Identifier+":del");
  this.DelButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-delete-button";
  this.DelButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'delete')");
  this.DelButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.DelButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.DelButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.DelButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.DelButton, RD3_ServerParams.TooltipDelete + RD3_KBManager.GetFKTip(RD3_ClientParams.FKDelete));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_DELETE];
  this.TBZones[i].appendChild(this.DelButton);
  //
  // Pulsante di inserimento
  this.NewButton = document.createElement("img");
  this.NewButton.setAttribute("id", this.Identifier+":new");
  this.NewButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-insert-button";
  this.NewButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'insert')");
  this.NewButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.NewButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.NewButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.NewButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.NewButton, RD3_ServerParams.TooltipInsert + RD3_KBManager.GetFKTip(RD3_ClientParams.FKInsert));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_INSERT];
  this.TBZones[i].appendChild(this.NewButton);
  //
  // Pulsante di duplicazione
  this.DuplButton = document.createElement("img");
  this.DuplButton.setAttribute("id", this.Identifier+":dupl");
  this.DuplButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-duplicate-button";
  this.DuplButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'dupl')");
  this.DuplButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.DuplButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.DuplButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.DuplButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.DuplButton, RD3_ServerParams.TooltipDuplicate + RD3_KBManager.GetFKTip(RD3_ClientParams.FKDuplicate));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_DUPLICATE];
  this.TBZones[i].appendChild(this.DuplButton);
  //
  // Pulsante di salvataggio
  this.SaveButton = document.createElement("img");
  this.SaveButton.setAttribute("id", this.Identifier+":save");
  this.SaveButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-save-button";
  this.SaveButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'save')");
  this.SaveButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.SaveButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.SaveButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.SaveButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.SaveButton, RD3_ServerParams.TooltipUpdate + RD3_KBManager.GetFKTip(RD3_ClientParams.FKUpdate));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_UPDATE];
  this.TBZones[i].appendChild(this.SaveButton);
  //
  this.PrintButton = document.createElement("img");
  this.PrintButton.setAttribute("id", this.Identifier+":print");
  this.PrintButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-print-button";
  this.PrintButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'print')");
  this.PrintButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.PrintButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.PrintButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.PrintButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.PrintButton, RD3_ServerParams.Print + RD3_KBManager.GetFKTip(RD3_ClientParams.FKPrint));
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_PRINT];
  this.TBZones[i].appendChild(this.PrintButton);
  //
  // Imposto il pulsante di Esportazione
  this.CsvButton = document.createElement("img");
  this.CsvButton.setAttribute("id", this.Identifier+":csv");
  this.CsvButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-export-button";
  this.CsvButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'csv')");
  this.CsvButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.CsvButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.CsvButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.CsvButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.CsvButton, RD3_ServerParams.TooltipExport);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_CSV];
  this.TBZones[i].appendChild(this.CsvButton);
  //
  // Imposto il pulsante di Allegati
  this.AttachButton = document.createElement("img");
  this.AttachButton.setAttribute("id", this.Identifier+":attach");
  this.AttachButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-attach-button";
  this.AttachButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'attach')");
  this.AttachButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.AttachButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.AttachButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.AttachButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.AttachButton, RD3_ServerParams.ComandoAllegati);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_ATTACH];
  this.TBZones[i].appendChild(this.AttachButton);
  //
  // Imposto il pulsante di Raggruppamento
  this.GroupButton = document.createElement("img");
  this.GroupButton.setAttribute("id", this.Identifier+":group");
  this.GroupButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-group-button";
  this.GroupButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'group')");
  this.GroupButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.GroupButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.GroupButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.GroupButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  RD3_TooltipManager.SetObjTitle(this.GroupButton, RD3_ServerParams.ComandoGruppi);
  i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_GROUP];
  this.TBZones[i].appendChild(this.GroupButton);
  //
  // Imposto i custom commands
  var a = RD3_DesktopManager.WebEntryPoint.CustomCommands;
  var n = a.length;
  //
  if (n>0) 
    this.CustomButtons = new Array();
  //
  for (var i=0; i<n; i++)
  {
    var cb = document.createElement("img");
    cb.setAttribute("id", this.Identifier+":custom"+i);
    cb.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "");
    cb.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'cb"+ i +"')");
    cb.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
    cb.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
    cb.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
    cb.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
    RD3_TooltipManager.SetObjTitle(cb, a[i].Tooltip + RD3_KBManager.GetFKTip(a[i].FKNum));
    var ofs = 18+i
    if (i>=8)
      ofs = 37 + i - 8; // I comandi custom da 9 a 16 sono nelle posizioni 37 - 45
    var j = RD3_DesktopManager.WebEntryPoint.CommandZones[ofs];
    this.TBZones[j].appendChild(cb);
    this.CustomButtons[i] = cb;
  }
  //
  // Creo il pulsante per attivare la multiselezione
  if (RD3_Glb.IsMobile())
  {
    this.MulSelButton = document.createElement("img");
    this.MulSelButton.setAttribute("id", this.Identifier+":ms");
    this.MulSelButton.className = "panel-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" panel-mulsel-button";
    this.MulSelButton.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'seltog')");
    this.MulSelButton.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
    this.MulSelButton.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
    this.MulSelButton.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
    this.MulSelButton.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
    i = RD3_DesktopManager.WebEntryPoint.CommandZones[1];
    this.TBZones[i].appendChild(this.MulSelButton);
  }
  //
  // Tolgo le zone vuote
  var n = this.TBZones.length;
  for (var i=0; i<n; i++)
  {
    if (!this.TBZones[i].hasChildNodes())
      this.ToolbarBox.removeChild(this.TBZones[i]);
  }
}

IDPanel.prototype.SetSmallIcon= function(value) 
{
  // Chiamo la classe base
  WebFrame.prototype.SetSmallIcon.call(this, value);
  //
  if (this.Realized)
  {
    var mob = RD3_Glb.IsMobile();
    var mob7 = RD3_Glb.IsMobile7();
    var ext = (this.SmallIcons && !mob ? "_sm" : "") + (mob?".png":".gif");
    //
    var usemask = !(RD3_Glb.IsAndroid() || RD3_Glb.IsIE() || RD3_Glb.IsEdge()) || RD3_Glb.IsAndroid(4,4,0);
    //
    if (!usemask && mob7)
      ext = "-i" + ext;
    //
    if (!mob) this.TopButton.src = RD3_Glb.GetImgSrc("images/top" + ext);
    if (!mob) this.PrevButton.src = RD3_Glb.GetImgSrc("images/prev" + ext);
    if (!mob) this.NextButton.src = RD3_Glb.GetImgSrc("images/next" + ext);
    if (!mob) this.BottomButton.src = RD3_Glb.GetImgSrc("images/bottom" + ext);
    if (!mob) this.SearchButton.src = RD3_Glb.GetImgSrc("images/search" + ext);
    if (!mob) this.FindButton.src = RD3_Glb.GetImgSrc("images/find" + ext);
    if (!mob)
    {
      if (RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen"))
        this.FormListButton.src = RD3_Glb.GetImgSrc("images/"+(this.PanelMode==RD3_Glb.PANEL_LIST?"listf":"list")+ext);
      else
        this.FormListButton.src = RD3_Glb.GetImgSrc("images/list" + ext);
    }
    //
    if (mob7 && usemask)
    {
      this.CancelButton.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/cancel" + ext)+"')";
      this.CancelButton.style.webkitMaskRepeat = "no-repeat";
      this.CancelButton.style.webkitMaskSize = "25px 25px";
    }
    else
      this.CancelButton.src = RD3_Glb.GetImgSrc("images/cancel" + ext);
    //
    if (mob7 && usemask)
    {
      this.RefreshButton.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/refresh" + ext)+"')";
      this.RefreshButton.style.webkitMaskRepeat = "no-repeat";
      this.RefreshButton.style.webkitMaskSize = "25px 25px";
    }
    else
      this.RefreshButton.src = RD3_Glb.GetImgSrc("images/refresh" + ext);
    //
    if (mob7 && usemask)
    {
      this.DelButton.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/delete" + ext)+"')";
      this.DelButton.style.webkitMaskRepeat = "no-repeat";
      this.DelButton.style.webkitMaskSize = "25px 25px";
    }
    else
      this.DelButton.src = RD3_Glb.GetImgSrc("images/delete" + ext);
    //
    if (mob7 && usemask)
    {
      this.NewButton.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/new" + ext)+"')";
      this.NewButton.style.webkitMaskRepeat = "no-repeat";
      this.NewButton.style.webkitMaskSize = "25px 25px";
    }
    else
      this.NewButton.src = RD3_Glb.GetImgSrc("images/new" + ext);
    //
    if (!mob) this.DuplButton.src = RD3_Glb.GetImgSrc("images/dupl" + ext);
    //
    if (mob7 && usemask)
    {  
      this.SaveButton.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/update" + ext)+"')";
      this.SaveButton.style.webkitMaskRepeat = "no-repeat";
      this.SaveButton.style.webkitMaskSize = "25px 25px";
    }
    else
      this.SaveButton.src = RD3_Glb.GetImgSrc("images/update" + ext);
    //
    if (!mob) this.PrintButton.src = RD3_Glb.GetImgSrc("images/print" + ext);
    if (!mob) this.CsvButton.src = RD3_Glb.GetImgSrc("images/csv" + ext);
    if (!mob) this.AttachButton.src = RD3_Glb.GetImgSrc("images/clip" + ext);
    if (!mob) this.GroupButton.src = RD3_Glb.GetImgSrc("images/"+(this.ShowGroups?"grpdis":"grpen")+ext);
    if (this.MulSelButton) 
    {
      if (mob7 && usemask)
      {  
        this.MulSelButton.style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/mulsel" + ext)+"')";
        this.MulSelButton.style.webkitMaskRepeat = "no-repeat";
        this.MulSelButton.style.webkitMaskSize = "25px 25px";
      }
      else
        this.MulSelButton.src = RD3_Glb.GetImgSrc("images/mulsel" + ext);
    }
    //
    // Imposto immagine dei custom commands
    var a = RD3_DesktopManager.WebEntryPoint.CustomCommands;
    var n = a.length;
    for (var i=0; i<n; i++)
    {
      if (mob7 && usemask)
        this.CustomButtons[i].style.webkitMaskImage = "url('"+RD3_Glb.GetImgSrc("images/" + a[i].Image + ext)+"')";
      else
        this.CustomButtons[i].src = RD3_Glb.GetImgSrc("images/" + a[i].Image + ext);
      //
      // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
      if (RD3_Glb.Adapt4Retina(this.Identifier, a[i].Image + ext, 43, i))
      {
        if (mob7 && usemask)
          this.CustomButtons[i].style.webkitMaskSize = "0px 0px";
        else
          this.CustomButtons[i].style.display = "none";
      }
    }
  }
}

IDPanel.prototype.SetShowToolbar= function(value) 
{
  // Chiamo la classe base
  WebFrame.prototype.SetShowToolbar.call(this, value);
  //
  if (this.Realized)
  {
    this.UpdateToolbar();
  }
}

IDPanel.prototype.SetShowStatusBar= function(value) 
{
  // Chiamo la classe base
  WebFrame.prototype.SetShowStatusBar.call(this, value);
  //
  if (this.Realized)
  {
    this.StatusBar.style.display = ((this.ShowStatusBar && !this.Collapsed) ? "" : "none");
    this.QBETIcon.style.visibility = ((this.ShowStatusBar && !this.Collapsed) ? "" : "hidden");
    //
    // Aggiusto il testo della caption, se finisce per ":"
    var s = this.CaptionTxt.innerHTML;
    var s1 = s.substr(s.length-1,1);
    if (this.ShowStatusBar && !this.Collapsed)
    {
      // Se la caption non finisce per : e non e' stringa vuota allora aggiungo i :
      if (s1!=":" && s!="")
        this.CaptionTxt.innerHTML = s+":";
    }
    else
    {
      if (s1==":")
        this.CaptionTxt.innerHTML = s.substr(0,s.length-1);
    }
    
  }
}

IDPanel.prototype.SetLocked= function(value) 
{
  var old = this.Locked;
  //
  // Chiamo la classe base
  WebFrame.prototype.SetLocked.call(this, value);
  //
  if (this.Realized && (value==undefined || old!=this.Locked))
  {
    this.ResetPosition = true;
    this.ScrollToPos = false;
    this.RefreshToolbar = true;
    //
    // Se e' cambiato il locked reimposto il visual style dei campi non obbligatori
    // in questo modo posso aggiornare il colore delle caption non obbligatorie
    if (old!=this.Locked)
    {
      this.UpdateNotNullFields();
    }
    //
    // Se sblocco un pannello caso mobile, non evidenzio piu' la riga in blu
    if (RD3_Glb.IsMobile() && !this.Locked && this.PanelMode==RD3_Glb.PANEL_LIST)
    {
      this.HiliteRow(0);
    }
  }
}


// ********************************************************************************
// Collassamento del pannello... a differenza di cio' che fanno i frames normali
// io mi devo occupare anche dei miei sub-frames... dato che il server fa cosi'...
// ********************************************************************************
IDPanel.prototype.SetCollapsed= function(value, immediate) 
{
  // Per cominciare chiamo la classe base
  var old = this.Collapsed;
  WebFrame.prototype.SetCollapsed.call(this, value, immediate);
  //
  // Se l'operazione e' immediata ed e' cambiato il mio stato di collassamento
  // sistemo anche i miei sub-frames cosi' come fa il server
  if (immediate && this.Realized && old!=this.Collapsed)
  {
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      if (this.Fields[i].SubFrame && this.Fields[i].SubFrame.Identifier)
        this.Fields[i].SubFrame.SetCollapsed(value, immediate);
    }
  }
}


// ********************************************************************************
// Gestore evento di click su un pulsante della Toolbar
// ********************************************************************************
IDPanel.prototype.OnToolbarClick= function(evento, button)
{
  // Su android arrivano click duplicati (!!!)
  if (RD3_Glb.IsAndroid() && evento)
  {
    if (Math.abs(evento.clientX-this.LastTX)<10 && Math.abs(evento.clientY-this.LastTY)<10 && ((new Date())-this.LastTTime)<600)
      return;
    //
    this.LastTX = evento.clientX;
    this.LastTY = evento.clientY;
    this.LastTTime = new Date();
  }
  //
  this.ClearTouchScrollTimer();
  this.SetSwipe(false);
  //
  var ok = true;
  var ev = null;
  //
  // Su Android evento puo' essere null, perche' in alcuni casi rimando con un timer il click sulla toolbar (vedi PValue onTouchUp)
  var IsSwipe = RD3_Glb.IsMobile() && evento && evento.target==this.SwipeButton;
  if (RD3_Glb.IsIE(10, true))
    IsSwipe = RD3_Glb.IsMobile() && evento && evento.srcElement==this.SwipeButton;
  //
  if (button == "delete" && this.ConfirmDelete && !IsSwipe)
  {
    this.DoHighlightDelete(true);
    //
    // Decido quale messaggio mostrare
    var count = 1;
    var msg = "";
    if (!this.ShowMultipleSel || this.PanelMode==RD3_Glb.PANEL_FORM)
      msg = RD3_Glb.FormatMessage(ClientMessages.PAN_MSG_ConfirmDeleteRS, this.Caption);
    else
    {
      count = 0;
      for (var i=1; i<=this.TotalRows; i++)
      {
        if (this.MultiSelStatus[i])
          count++;
      }
      //
      if (count == 0)
        msg = RD3_Glb.FormatMessage(ClientMessages.PAN_MSG_ConfirmDeleteNR, this.Caption);
      else if (count == 1)
        msg = RD3_Glb.FormatMessage(ClientMessages.PAN_MSG_ConfirmDeleteRS, this.Caption);
      else if (count < this.TotalRows)
        msg = RD3_Glb.FormatMessage(ClientMessages.PAN_MSG_ConfirmDeleteRR, this.Caption, count);
      else
        msg = RD3_Glb.FormatMessage(ClientMessages.PAN_MSG_ConfirmDeleteAR, this.Caption);
    }
    // Chiedo conferma per la cancellazione
    this.MsgBox = new MessageBox(msg, count > 0 ? RD3_Glb.MSG_CONFIRM : RD3_Glb.MSG_BOX, false);
    this.MsgBox.RestoreFocus = false;
    if (count > 0)
      this.MsgBox.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnDeleteConfirm', ev, 'delete')");
    this.MsgBox.Open();
    ok = false;
  }
  //
  // Se sto duplicando o esportando con la multiselezione attiva verifico che ci sia almeno una riga selezionata,
  // altrimenti chiedo conferma all'utente
  if ((button == "dupl" || button == "csv") && !IsSwipe && this.ShowMultipleSel)
  {
    var count = 0;
    for (var i=1; i<=this.TotalRows; i++)
    {
      if (this.MultiSelStatus[i])
        count++;
    }
    //
    if (count == 0)
    {
      var msg = button == "dupl" ? ClientMessages.PAN_MSG_ConfirmDuplicateNR : ClientMessages.PAN_MSG_ConfirmExportNR;
      msg = RD3_Glb.FormatMessage(msg, this.Caption);
      //
      // Chiedo conferma per l'operazione
      this.MsgBox = new MessageBox(msg, RD3_Glb.MSG_CONFIRM, false);
      this.MsgBox.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnDeleteConfirm', ev, '"+button+"')");
      this.MsgBox.Open();
      ok = false;
    }
  }
  //
  if (ok)
  {
    // Vediamo se questo comando e' bloccante
    var blk = 0;
    switch (button)
    {
      case "list" : blk = (this.BlockingCommands & RD3_Glb.PCM_FORMLIST); break;
      case "search" : blk = (this.BlockingCommands & RD3_Glb.PCM_SEARCH); break;
      case "find" : blk = (this.BlockingCommands & RD3_Glb.PCM_FIND); break;
      case "insert" : blk = (this.BlockingCommands & RD3_Glb.PCM_INSERT); break;
      case "delete" : blk = (this.BlockingCommands & RD3_Glb.PCM_DELETE); break;
      case "cancel" : blk = (this.BlockingCommands & RD3_Glb.PCM_CANCEL); break;
      case "refresh" : blk = (this.BlockingCommands & RD3_Glb.PCM_REQUERY); break;
      case "save" : blk = (this.BlockingCommands & RD3_Glb.PCM_UPDATE); break;
      case "dupl" : blk = (this.BlockingCommands & RD3_Glb.PCM_DUPLICATE); break;
      case "print" : blk = (this.BlockingCommands & RD3_Glb.PCM_PRINT); break;
      case "attach" : blk = (this.BlockingCommands & RD3_Glb.PCM_ATTACH); break;
      case "group" : blk = (this.BlockingCommands & RD3_Glb.PCM_ATTACH); break;
      case "csv" : blk = (this.BlockingCommands & RD3_Glb.PCM_CSV); break;
      case "cb0" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM1); break;
      case "cb1" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM2); break;
      case "cb2" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM3); break;
      case "cb3" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM4); break;
      case "cb4" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM5); break;
      case "cb5" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM6); break;
      case "cb6" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM7); break;
      case "cb7" : blk = (this.BlockingCommands & RD3_Glb.PCM_CUSTOM8); break;
      
      case "top": 
      case "prev": 
      case "next": 
      case "bottom": 
        blk = (this.BlockingCommands & RD3_Glb.PCM_NAVIGATION);
        break;
    }
    //    
    ev = new IDEvent("pantb", this.Identifier, evento, this.ToolbarEventDef|(blk ? RD3_Glb.EVENT_BLOCKING : 0), button);
  }
  //
  if (ok && ev.ClientSide && !blk)
  {
    switch (button)
    {
      case "lock" :   this.SetLocked(true); break;
      case "unlock" : this.SetLocked(false); break;
      case "insert" : if (this.Locked) this.SetLocked(false); break;
      
      case "list"   : 
        //
        // Durante la gestione locale del passaggio da form a list possono avvenire molte cose,
        // e' meglio che il server sia avvertito il piu' in fretta possibile
        RD3_DesktopManager.SendEvents();
        //
        this.SetPanelMode(this.PanelMode==RD3_Glb.PANEL_LIST? RD3_Glb.PANEL_FORM : RD3_Glb.PANEL_LIST, true); 
        //
        // Scrolling del pannello sulla riga giusta
        if (this.PanelMode==RD3_Glb.PANEL_FORM)
        {
          var ar = this.ActualRow;
          this.SetActualRow(0);
          this.SetActualPosition(this.ActualPosition+ar);
        }
        else
        {
          var ap = this.ActualPosition;
          var ar = 0;
          //
          // Stesso algoritmo lato server
          if (ap - this.ListPos >= this.NumRows)
          {
            // Sono andato troppo oltre, devo tornare indietro
            ar = this.NumRows - 1;
            ap -= ar; 
          }
          else if (ap - this.ListPos < 0)
          {
            // Vado all'inizio
            ar = 0;
          }
          else
          {
            // Torno dov'ero
            ar = ap - this.ListPos;
            ap = this.ListPos;
          }
          //
          // Controllo non essere andato oltre il numero di record
          if (ap > this.TotalRows)
          {
            ap = (this.TotalRows<1)?1:this.TotalRows;
            ar = 0;
          }
          //          
          // Voglio che l'ActualRow lavori veramente
          var v = (ar!=this.ActualRow)? ar : undefined;
          this.SetActualRow(v);
          //
          // Voglio che l'ActualPosition lavori veramente
          var v = (ap!=this.ActualPosition)? ap : undefined;
          this.SetActualPosition(v);
          //
          // Se l'ActualPosition e' cambiato e' probabile che nella lista dei messaggi in uscita ci sia un panscr
          // dovuto alla SetPanelMode
          if (v !== undefined)
          {
            // Se c'e' lo aggiorno con il nuovo ActualPosition che e' cambiato dopo che la SetPanelMode l'ha programmato
            var panscr = (window.RD4_Enabled ? RD3_DesktopManager.MessagePumpRD4 : RD3_DesktopManager.MessagePump).GetEvent(this.Identifier, "panscr");
            if (panscr)
              var ev = new IDEvent("panscr", this.Identifier, evento, this.ScrollEventDef, null, this.ActualPosition);
          }
        }
        this.UpdateScrollPos();
      break;
      
      case "top"    : 
        this.ChangeActualRow(0, null); 
        this.SetActualPosition(1, false, false); 
        this.UpdateScrollPos();
        RD3_KBManager.CheckFocus = false;
      break;
      
      case "bottom" : 
        this.ChangeActualRow(this.NumRows-1, null); 
        this.SetActualPosition(this.TotalRows-this.NumRows+1, false, false); 
        this.UpdateScrollPos();
        RD3_KBManager.CheckFocus = false;
      break;
      
      case "next"   :
      {
        var n = (this.PanelMode==RD3_Glb.PANEL_LIST)? this.NumRows : 1;
        var nr = this.ActualPosition + n - 1;
        if (nr > this.TotalRows-n+1)
          nr = this.TotalRows-n+1;
        this.SetActualPosition(nr, false, true); 
        this.UpdateScrollPos();
      }
      break;
      
      case "prev"   :
      {
        var n = (this.PanelMode==RD3_Glb.PANEL_LIST)? this.NumRows : 1;
        var nr = this.ActualPosition - n + 1;
        if (nr < 1)
          nr = 1;
        this.SetActualPosition(nr, false, true); 
        this.UpdateScrollPos();
      }
      break;
    }
  }
  //
  // Per un BUG di IE dopo il salvataggio se si rida' il fuoco all'editor questo anche se e' editabile non lo riesce a prendere. L'unico modo per risolverlo e' dare il fuoco al BODY
  // dopo 250 milli se il salvataggio arriva da un editor, in questo caso quando l'utente ridara' il fuoco al campo funzionera' bene
  if (ok && button == "save" && RD3_Glb.IsIE() && RD3_KBManager.ActiveObject && RD3_KBManager.ActiveObject instanceof PField && RD3_KBManager.ActiveObject.EditorType == 1) {
    document.body.tabIndex = 0;
    window.setTimeout("RD3_KBManager.ActiveObject = null; RD3_KBManager.LastActiveObject = null; RD3_KBManager.ActiveElement = null; document.body.focus();", 250);
  }
}


// ********************************************************************************
// Gestore evento di click su un pulsante per la gestione della multiselezione
// ********************************************************************************
IDPanel.prototype.OnMultiSelCmd= function(evento, button)
{
  // Voglio evitare un doppio click sugli oggetti
  if (RD3_Glb.IsAndroid() || (RD3_Glb.IsIE(10, true) && RD3_Glb.IsTouch()))
    RD3_DDManager.ChompClick();
  //
  // Se sto mostrando la multiselezione con i bordi completi quando clicco il pulsante mi sevo comportare in modo diverso: invece
  // di spegnerla devo mostrare un popup per decidere cosa fare
  if (RD3_ServerParams.CompletePanelBorders && button == "selms")
  {
    if (this.ShowMultipleSel)
    {
      // Se non ho creato il CommandSet lo creo (solo la prima volta.. poi lo riuso)
      if (!this.MultiSelCommand)
      {
        this.MultiSelCommand = new Command();
        this.MultiSelCommand.Identifier = this.Identifier+":msc:0";
        this.MultiSelCommand.IsMenu = false;
        RD3_DesktopManager.ObjectMap.add(this.MultiSelCommand.Identifier, this.MultiSelCommand);
        //
        var cmdSelectAll = new Command();
        cmdSelectAll.Identifier = this.Identifier+":msc:1";
        cmdSelectAll.IsMenu = false;
        cmdSelectAll.Caption = ClientMessages.TIP_TITLE_TooltipSelectAll;
        cmdSelectAll.Image = "pansel1.gif";
        cmdSelectAll.ParentCmdSet = this.MultiSelCommand;
        cmdSelectAll.ClickEventDef = RD3_Glb.EVENT_CLIENTSIDE;
        cmdSelectAll.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'selall')");
        RD3_DesktopManager.ObjectMap.add(cmdSelectAll.Identifier, cmdSelectAll);
        this.MultiSelCommand.Commands.push(cmdSelectAll);
        //
        var cmdSelectNone = new Command();
        cmdSelectNone.Identifier = this.Identifier+":msc:2";
        cmdSelectNone.IsMenu = false;
        cmdSelectNone.Caption = ClientMessages.TIP_TITLE_TooltipDeseleziona;
        cmdSelectNone.Image = "pansel0.gif";
        cmdSelectNone.ParentCmdSet = this.MultiSelCommand;
        cmdSelectNone.ClickEventDef = RD3_Glb.EVENT_CLIENTSIDE;
        cmdSelectNone.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'selnone')");
        RD3_DesktopManager.ObjectMap.add(cmdSelectNone.Identifier, cmdSelectNone);
        this.MultiSelCommand.Commands.push(cmdSelectNone);
        //
        var cmdSelector = new Command();
        cmdSelector.Identifier = this.Identifier+":msc:3";
        cmdSelector.IsMenu = false;
        cmdSelector.Caption = ClientMessages.TIP_TITLE_SelectPopupCmd;
        cmdSelector.Image = "pansel.gif";
        cmdSelector.ParentCmdSet = this.MultiSelCommand;
        cmdSelector.ClickEventDef = RD3_Glb.EVENT_CLIENTSIDE;
        cmdSelector.CallBackFunction = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnMultiSelCmd', ev, 'seltog')");
        RD3_DesktopManager.ObjectMap.add(cmdSelector.Identifier, cmdSelector);
        this.MultiSelCommand.Commands.push(cmdSelector);
        //
        this.MultiSelCommand.Realize();
        //
        // Aggiungo il command set fittizio alla lista dei comandi fittizi (per gestire la chiusura cliccando fuori.. verra' rimosso dall'Unreralize)
        RD3_DesktopManager.WebEntryPoint.CmdObj.ClientCommands.add(this.Identifier+":cms:0", this.MultiSelCommand);
      }
      //
      // In QBE non mostro i comandi per selezionare/deselezionare (tanto non funzionano)
      this.MultiSelCommand.Commands[0].Visible = (this.Status != RD3_Glb.PS_QBE);
      this.MultiSelCommand.Commands[1].Visible = (this.Status != RD3_Glb.PS_QBE);
      //
      // Creo un'oggetto fittizio per memorizzare le configurazioni del popup menu
      var conf = document.createElement("SPAN");
      conf.setAttribute("objid", this.Identifier+":ms0");
      conf.setAttribute("dir", "1");
      this.MultiSelCommand.Popup(conf);
      //
      return;
    }
    else
    {
      // Ho cliccato sul pulsante per mostrare la multiselezione: modifico il comando e lo faccio passare
      button = "seltog";
    }
  }
  //
  var ev = new IDEvent("pantb", this.Identifier, evento, this.ToolbarEventDef, button);
  if (ev.ClientSide)
  {
    switch (button)
    {
      case "seltog":
        this.SetShowMultipleSel(!this.ShowMultipleSel); 
        this.AdaptLayout();
      break;
      
      case "selall":
        this.ChangeSelection(2, false); // 0 = NONE, 1 = INVERT, 2 = ALL
        this.UpdateMultipleSel();
      break;

      case "selnone":
        this.ChangeSelection(0, false); // 0 = NONE, 1 = INVERT, 2 = ALL
        this.UpdateMultipleSel();
      break;
    }
  }
}


// **************************************************************
// Imposta il testo della Status Bar
// **************************************************************
IDPanel.prototype.SetStatusBarText = function()
{
  if (this.Realizing)
    return;
  //
  var st = "";
  var cn = (this.SmallIcons) ? "panel-toolbarsmall-status" : "panel-toolbar-status";
  var ist = (this.DOModified && this.DOMaster)? RD3_Glb.PS_UPDATED :  this.Status;
  //
  switch(ist)
  {
    case RD3_Glb.PS_QBE:
      st = RD3_ServerParams.SBP_QBE;
      cn = (this.SmallIcons) ? "panel-statussmall-qbe" : "panel-status-qbe";
    break;
    
    case RD3_Glb.PS_DATA:
    {
      if (this.IsNewRow(this.ActualPosition, this.ActualRow))
      {
        if (this.CanInsert)
          st = RD3_ServerParams.SBP_INSERT;
        else
          st = RD3_ServerParams.SBP_DATA1.replace("|1", this.ActualPosition + this.ActualRow);
      }
      else
      {
        if (!this.ShowMultipleSel || this.PanelMode==RD3_Glb.PANEL_FORM)
        {
          st = RD3_ServerParams.RigaNM;
          if (this.IsGrouped() && this.PanelMode==RD3_Glb.PANEL_LIST)
            st = st.replace("|1", this.ListGroupRoot.GetServerIndex(this.CompactActualPosition + this.ActualRow));
          else
            st = st.replace("|1", (this.ActualPosition + this.ActualRow));
          //
          st = st.replace("|2", this.TotalRows);
        } 
        else
        {
          var count = 0;
          for (var i=1; i<=this.TotalRows; i++)
          {
            if (this.MultiSelStatus[i])
              count++;
          }
          //
          if (count == 1)
            st = RD3_Glb.FormatMessage(ClientMessages.PAN_STBAR_SelRow, this.TotalRows);
          else
            st = RD3_Glb.FormatMessage(ClientMessages.PAN_STBAR_SelRows, this.TotalRows, count);
        }
        //
        // Se ci sono piu' righe
        if (this.MoreRows)
          st += "+";
      }
      cn = (this.SmallIcons) ? "panel-statussmall-data" : "panel-status-data";
    }
    break;
    
    case RD3_Glb.PS_UPDATED:
      st = RD3_ServerParams.SBP_UPD;
      cn = (this.SmallIcons) ? "panel-statussmall-updated" : "panel-status-updated";
    break;
  }
  //
  // Se non lavoro SingleDoc aggiorno la statusbar
  // altrimenti la svuoto (cosi' compare solo il nome del documento e non "Riga 1 di 1")
  if (!this.DOSingleDoc || (this.DOMaster && this.DOModified))
  {
    this.StatusBar.className = cn;
    this.StatusBar.innerHTML = "&nbsp;"+st;
    //
    // Se il testo della caption non finisce per ":" lo aggiungo (solo se la caption non e' stringa vuota e non siamo collassati e la status bar non e' nascosta)
    var s = this.CaptionTxt.innerHTML;
    if (s!= "" && s.substr(s.length-1,1) != ":" && !this.Collapsed && this.ShowStatusBar)
      this.CaptionTxt.innerHTML += ":";
  }
  else
  {
    this.StatusBar.className = "";
    this.StatusBar.innerHTML = "";
    //
    // Se il testo della caption finisce per ":" lo tolgo
    var s = this.CaptionTxt.innerHTML;
    if (s.substr(s.length-1,1) == ":")
      this.CaptionTxt.innerHTML = s.substr(0, s.length-1);
  }
  //
  // Se la toolbar e' scrollata e ho cambiato il messaggio, la rimetto a posto
  if (this.ToolbarBox.scrollLeft && this.TBScrollTimer==0 && !RD3_Glb.IsTouch())
     this.ScrollToolbar(-1);
}


// *********************************************************************************
// Gestisce la visualizzazione o meno dei pulsanti della Toolbar
// *********************************************************************************
IDPanel.prototype.UpdateToolbar = function()
{
  // Devo comunque aggiornare lo stato di pull-to-refresh
  // anche se la toolbar non c'e' o si sta animando
  this.SetPullToRefresh();
  //
  // Lo devo fare dopo...
  if (this.AnimatingToolbar)
    return;
  //
  // Il numero di righe visualizzate del pannello e' 1 se sono in form, numrows se sono in list
  var nr = (this.PanelMode==RD3_Glb.PANEL_LIST)?this.NumRows:1;
  //
  // Posso navigare se il pannello e' in stato data e se ci sono abbastanza righe
  var cannav = this.CanNavigate();
  //
  if (this.ScrollBox)
  {
    var cannavsc = cannav && (this.GetTotalRows()>nr || this.ActualPosition>1);
    //
    // Devo bloccare lo scroll solo se effettivamente c'e' stato un riposizionamento, altrimenti blocco
    // lo scroll per 50 ms e se l'utente sta scrollando con il mouse o con la scrollbar potrei perdere qualcosa
    var oldScrollH = this.ScrollBoxInt.style.height;
    var newScrollH = cannavsc ? this.ScrollBoxInt.getAttribute("idheight") : "0px";
    if (oldScrollH != newScrollH) {
      this.LastPositionTime = new Date();
      this.ScrollBoxInt.style.height = newScrollH;
    }
    //
    // Verifico se sono nel caso di inserimento in un pannello con meno righe rispetto a quelle visibili: in questo
    // caso la scrollbar scomparirebbe perche' non serve ma il pannello sarebbe scrollato (per le nuove righe..)
    // e non si potrebbe tornare indietro: allora allungo la scrollbar... (vedi anche UpdateScrollBox)
    if (cannavsc && this.PanelMode==RD3_Glb.PANEL_LIST && this.GetTotalRows()<=this.NumRows && this.ActualPosition!=1)
    {
      // calcolo quante righe di dati sto effettivamente mostrando.. sono le righe totali-l'indice della prima riga+1
      var fullRows = 1 + (this.GetTotalRows()-this.ActualPosition);
      this.ScrollBoxInt.style.height = ((this.GetTotalRows()-1) + (this.NumRows-fullRows)) * this.GetRowHeight() + this.MaxHRow + "px";
    }
    //
    if (parseInt(this.ScrollBoxInt.getAttribute("idtop"))>0)
    {
      this.SkipScroll = cannavsc ? parseInt("0"+this.ScrollBoxInt.getAttribute("idtop"),10) : 0;
      this.ScrollBox.scrollTop = cannavsc ? this.ScrollBoxInt.getAttribute("idtop") : "0px";
    }
    //
    this.UpdateScrollTouch();
  }
  //
  // Se non ho toolbar..
  if (this.ToolbarBox.offsetWidth==0)
  {
    // Gestisco comunque la visibilita' della scrollbar Mobile
    if (RD3_Glb.IsMobile() && this.ScrollBoxMobile)
      this.ScrollBoxMobile.style.display = (this.PanelMode == RD3_Glb.PANEL_LIST ? "" : "none");
    //
    // Passo il messaggio ai campi
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
      this.Fields[i].UpdateToolbar();
    //
    return;
  }
  //
  var newrow = this.IsNewRow(this.ActualPosition, this.ActualRow);
  var mob = RD3_Glb.IsMobile();
  //
  // verifico se c'e' una combo aperta
  var comboopen = (RD3_DDManager.OpenCombo && RD3_DDManager.OpenCombo.Owner.ParentField.ParentPanel==this && !RD3_DDManager.OpenCombo.IsPopOver());
  //
  var cannav2 = cannav && this.IsCommandEnabled(RD3_Glb.PCM_NAVIGATION) && (this.GetTotalRows() > nr || this.ActualPosition > 1) && (!this.IsFluidPanel() || this.PanelMode !== RD3_Glb.PANEL_LIST);
  //
  this.TopButton.style.display = cannav2 ? "" : "none";
  this.PrevButton.style.display = cannav2 ? "" : "none";
  this.NextButton.style.display = cannav2 ? "" : "none";
  this.BottomButton.style.display = cannav2 ? "" : "none";
  //
  var canqbet = this.Status==RD3_Glb.PS_DATA && this.QBETip.length>0 && this.ShowStatusBar && !this.Collapsed;
  this.QBETIcon.style.display = canqbet ? "" : "none";
  //
  var cansrc = this.IsCommandEnabled(RD3_Glb.PCM_SEARCH) && cannav && this.CanSearch && this.UseListQBE == RD3_Glb.PAN_NOQBELIST;
  this.SearchButton.style.display = cansrc ? "" : "none";
  //
  var cansb = this.CanSearch && this.PanelMode==RD3_Glb.PANEL_LIST && this.Locked;
  if (mob)
  {
    this.SearchBox.style.display = cansb ? "" : "none";
    if (this.SearchMargin) this.SearchMargin.style.display = cansb ? "" : "none";
  }
  //
  var canfnd = this.IsCommandEnabled(RD3_Glb.PCM_FIND) && this.Status==RD3_Glb.PS_QBE && this.CanSearch;
  this.FindButton.style.display = canfnd ? "" : "none";
  //
  var canchg = this.IsCommandEnabled(RD3_Glb.PCM_FORMLIST) && (this.Status != RD3_Glb.PS_QBE || !this.AutomaticLayout) && (this.Status == RD3_Glb.PS_QBE || cannav) && this.HasList && this.HasForm;
  if (mob)
  {
    canchg &= this.PanelMode==RD3_Glb.PANEL_FORM && this.Locked; // Caso Mobile: il tasto form list e' solo in form per tornare in list, solo se il pannello e' bloccato
    this.FormListButtonCnt.style.display = canchg ? "" : "none";
  }
  else
  {
    this.FormListButton.style.display = canchg ? "" : "none";
  }
  if ((RD3_ServerParams.Theme.startsWith("seattle") || RD3_ServerParams.Theme.startsWith("zen")) && !mob)
  {
    var ext = (this.SmallIcons ? "_sm" : "") + ".gif"
    this.FormListButton.src = RD3_Glb.GetImgSrc("images/"+(this.PanelMode==RD3_Glb.PANEL_LIST?"listf":"list")+ext);
  }
  //
  var cancan = this.IsCommandEnabled(RD3_Glb.PCM_CANCEL) && ((this.Status==RD3_Glb.PS_UPDATED || (mob && !this.Locked && this.Lockable)) && (this.CanUpdate || this.CanInsert) || this.Status == RD3_Glb.PS_QBE || this.DOModified);
  if (mob)
    cancan &= (this.PanelMode==RD3_Glb.PANEL_FORM || !this.HasForm) && !comboopen;
  this.CancelButton.style.display = cancan ? "" : "none";
  //
  var canref = this.IsCommandEnabled(RD3_Glb.PCM_REQUERY) && this.Status!=RD3_Glb.PS_QBE && (!this.IsDO || this.HasDocTemplate);
  if (mob)
    canref &= this.PanelMode==RD3_Glb.PANEL_LIST && this.Locked && !this.ShowMultipleSel;
  this.RefreshButton.style.display = canref ? "" : "none";
  //
  var candel = this.IsCommandEnabled(RD3_Glb.PCM_DELETE) && (!this.Locked || mob) && this.Status==RD3_Glb.PS_DATA && this.CanDelete;
  if (mob)
  {
    candel &= (this.PanelMode==RD3_Glb.PANEL_FORM || !this.HasForm || this.ShowMultipleSel) && this.Locked; // Caso Mobile: il tasto delete e' solo in form e solo se il pannello e' bloccato, a meno che il pannello non abbia il form
    candel &= !this.IsNewRow(this.ActualPosition, this.ActualRow);
  }
  this.DelButton.style.display = candel ? "" : "none";
  //
  var canins = this.IsCommandEnabled(RD3_Glb.PCM_INSERT) && (!this.Locked || this.EnableInsertWhenLocked || (this.IsDO && this.DOSingleDoc && newrow)) && (this.Status == RD3_Glb.PS_QBE || cannav) && this.CanInsert;
  if (mob)
    canins &= this.PanelMode==RD3_Glb.PANEL_LIST && !this.ShowMultipleSel;
  this.NewButton.style.display = canins ? "" : "none";
  //
  var candup = this.IsCommandEnabled(RD3_Glb.PCM_DUPLICATE) && !this.Locked && cannav && this.CanInsert && !newrow;
  this.DuplButton.style.display = candup ? "" : "none";
  //
  var canupd = this.IsCommandEnabled(RD3_Glb.PCM_UPDATE) && !this.Locked && this.Status!=RD3_Glb.PS_QBE && (this.CanInsert || this.CanUpdate || (this.DOModified && this.DOCanSave));
  if (mob)
    canupd &= !comboopen && ((!this.Locked && (this.PanelMode==RD3_Glb.PANEL_FORM || !this.HasForm)) || this.Status==RD3_Glb.PS_UPDATED);
  this.SaveButton.style.display = canupd ? "" : "none";
  //
  var canprn = this.IsCommandEnabled(RD3_Glb.PCM_PRINT) && cannav && this.HasBook;
  this.PrintButton.style.display = canprn ? "" : "none";
  //
  var cangrp = this.IsCommandEnabled(RD3_Glb.PCM_GROUP) && this.Status==RD3_Glb.PS_DATA && this.PanelMode==RD3_Glb.PANEL_LIST && this.GroupingEnabled && !mob;
  this.GroupButton.style.display = cangrp ? "" : "none";
  var sm = (this.SmallIcons ? "_sm" : "") + ".gif"
  if (!mob) this.GroupButton.src = RD3_Glb.GetImgSrc("images/"+(this.ShowGroups?"grpdis":"grpen")+sm);
  //
  var canexp = this.IsCommandEnabled(RD3_Glb.PCM_CSV) && cannav && this.PanelMode==RD3_Glb.PANEL_LIST;
  this.CsvButton.style.display = canexp ? "" : "none";
  //
  var canattach = this.IsCommandEnabled(RD3_Glb.PCM_ATTACH);
  this.AttachButton.style.display = canattach ? "" : "none";
  //
  // Nel caso mobile gestisco anche il bottone lock
  var canlock = this.Lockable && this.Locked && !this.Collapsed && (this.PanelMode==RD3_Glb.PANEL_FORM || !this.HasForm) && !this.ShowMultipleSel;
  if (mob)
  {
    canlock &= !this.IsNewRow(this.ActualPosition, this.ActualRow);
    this.LockButton.style.display = canlock ? "" : "none";
    var canscroll = this.PanelMode==RD3_Glb.PANEL_LIST;
    if (this.ScrollBoxMobile)
      this.ScrollBoxMobile.style.display = canscroll ? "" : "none";
  }
  //
  var canms = false;
  if (mob)
  {
    canms = this.PanelMode==RD3_Glb.PANEL_LIST && this.Locked && this.EnableMultipleSel && this.ShowToolbar;
    this.MulSelButton.style.display = canms ? "" : "none";
  }
  //
  // Mostro o nascondo i custom commands
  if (this.CustomButtons)
  {
    var a = 262144; // CUSTOM1
    var n = this.CustomButtons.length;
    for (var i=0; i<n; i++)
    {
      // Custom 9 deve ricominciare da 0 (perche' cambia intero) ed essere <0 (in modo da poter decidere di andare sui nuovi flag)
      if (i == 8)
       a = -0x1;
      //
      this.CustomButtons[i].style.display=(this.IsCommandEnabled(a) && !comboopen)?"":"none";
      a *= 2;
    }
  }
  //
  // Se la Toolbar e' nascosta devo nascondere anche le zone, altrimenti rimangono i padding che spingono eventuali toolbar di pannello
  // Parto da 3 perche' le zone 0,1,2 devono rimanere visibili..
  if (!mob)
  {
    var n = this.TBZones.length;
    for (var i=3; i<n; i++)
    {
      // La zona che contiene i command set personalizati deve sempre essere visibile; se e' vuota non e' nel DOM quindi non da fastidio;
      // se ci sono rimane sempre visibile. Se li vuoi nascondere devi nascondere i comandi o la toolbar.
      if (i != RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_CMDSET])
        this.TBZones[i].style.display = (this.ShowToolbar) ? "" : "none";
    }
  }
  //
  // In caso mobile, imposto il lato dx dei bottoni sulla destra
  if (mob && this.ToolbarBox.offsetWidth>0)
  {
    var xp = this.ToolbarBox.offsetWidth;
    var listmod = !this.Locked && !this.HasForm;
    var isq = RD3_Glb.IsQuadro();
    var mob7 = RD3_Glb.IsMobile7();
    var ofs = (mob7)? 45: 50;
    //
    // Lato DX in lista ha solo inserisci e aggiorna
    // se non ha il dettaglio, puo' avere anche unlock
    if (this.PanelMode == RD3_Glb.PANEL_LIST && !listmod)
    {
      if (canins)
      {
        xp -= ofs;
        this.NewButton.style.left = xp+"px";
      }
      if (canlock)
      {
        xp -= ofs;
        this.LockButton.style.left = xp+"px";
      }
      if (canref)
      {
        xp -= ofs;
        this.RefreshButton.style.left = xp+"px";
      }
      if (candel)
      {
        xp -= ofs;
        this.DelButton.style.left = xp+"px";
      }
      if (canms)
      {
        xp -= ofs;
        this.MulSelButton.style.left = xp+"px";
      }
    }
    else
    {
      if (this.Locked)
      {
        // In form uso lock e delete
        if (canlock)
        {
         xp -= ofs;
         this.LockButton.style.left = xp+"px";
        }
        if (candel)
        {
         xp -= ofs;
         this.DelButton.style.left = xp+"px";
        }
      }
      else
      {
        // Gestisco solo Insert, Update e Annulla
        if (canins)
        {
         xp -= ofs;
         this.NewButton.style.left = xp+"px";
        }
        if (canupd)
        {
         xp -= ofs;
         this.SaveButton.style.left = xp+"px";
        }
        if (cancan)
        {
          this.CancelButton.style.left = "4px";
        }
      }
    }
    //
    // Se ci sono i custom command, li posiziono ora
    if (this.CustomButtons)
    {
      for (var i=this.CustomButtons.length-1; i>=0; i--)
      {
        if (this.CustomButtons[i].style.display == "")
        {
          xp -= ofs;
          this.CustomButtons[i].style.left = xp+"px";
        }
      }
    }
    //
    // Nel caso QUADRO, il bottone di search va qui
    if (isq && cansb && !RD3_Glb.IsSmartPhone())
    {
      xp -= this.SearchBox.offsetWidth+16;
      this.SearchBox.style.left = xp+"px";
      if (this.SearchMargin) this.SearchMargin.style.left = (xp+113)+"px";
    }
    //
    // Se il pannello ha una toolbar associata, la sposto ora
    var ctb = this.GetCustomToolbar();
    if (ctb)
    {
      ctb.style.right = (this.ToolbarBox.offsetWidth-xp)+"px";
      ctb.style.visibility = comboopen?"hidden":"";
    }
    //
    // Gestisco back button di form
    var m = RD3_DesktopManager.WebEntryPoint.CmdObj.MenuButton;
    var bb = this.WebForm.BackButtonCnt;
    if ((bb && bb.parentNode==this.ToolbarBox) || (m && m.parentNode==this.ToolbarBox))
    {
      var lft = 0;
      if (bb && bb.parentNode==this.ToolbarBox)
      {
        bb.style.visibility = canchg||cancan||comboopen?"hidden":"";
        if (!canchg)
          lft = (bb.offsetLeft + bb.offsetWidth + 8);
                     
      }
      if (m && m.parentNode==this.ToolbarBox)
      {
        if (bb && bb.parentNode==this.ToolbarBox && bb.style.visibility=="")
        {
          m.style.visibility = "hidden";
        }
        else
        {
          // Se devo mostrare il menu-button e sono su smartphone
          var dv = canchg||cancan||comboopen?"hidden":"";
          if (dv=="" && RD3_Glb.IsSmartPhone())
          {
            // Se la mia form non vuole il backButton lo nascondo altrimenti se mi hanno specificato un testo, lo uso
            if (!this.WebForm.HasBackButton())
              dv = "hidden";
            else if (this.WebForm.BackButtonTxt)
              RD3_DesktopManager.WebEntryPoint.CmdObj.SetMenuButtonCaption(this.WebForm.BackButtonTxt);
          }
          //
          // Ho il bottone del menu'. Lo posiziono dove meglio credo
          m.style.visibility = dv;
          if (dv=="" && m.style.display!="none")
          {
            var mm = RD3_Glb.IsSmartPhone()?m.lastChild:m;
            lft += (mm.offsetLeft + mm.offsetWidth + 8);         
          }
        }
      }
      //
      if (!isq)
        this.SearchBox.style.left = lft==0 ? "" : lft+"px";
    }    
    //
    // Al termine sistemo la caption e la toolbar custom in modo che sia visibile al massimo
    if (ctb)
      RD3_Glb.AdjustCustomToolbar(ctb, this.ToolbarBox);
    RD3_Glb.AdjustCaptionPosition(this.ToolbarBox, this.CaptionTxt);
    //
    // La AdjustCaptionPosition allarga la caption occupando tutto lo spazio disponibili, ma se c'e' la status bar visibile non va fatto.
    if (this.ShowStatusBar)
      this.CaptionTxt.style.width = "";
  }
  //
  // Passo il messaggio ai campi
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
    this.Fields[i].UpdateToolbar();
  //
  this.AdaptScrollBox();
  //
  // Certifico che l'ho gia' fatto
  this.RefreshToolbar = false;
}


// ****************************************************************
// Torna TRUE se il comando e' abilitato
// ****************************************************************
IDPanel.prototype.IsCommandEnabled = function(cmd)
{
  // (Se e' un comando riguardante i blob showtoolbar non conta)
  if (cmd > 0)
    return (this.EnabledCommands & cmd) && (this.ShowToolbar || cmd==RD3_Glb.PCM_BLOBEDIT || cmd==RD3_Glb.PCM_BLOBDELETE || cmd==RD3_Glb.PCM_BLOBNEW || cmd==RD3_Glb.PCM_BLOBSAVEAS) && !this.Collapsed;
  else
    return (this.ExtEnabledCommands & Math.abs(cmd)) && this.ShowToolbar && !this.Collapsed;
}


// *********************************************************************************
// Metodo chiamato da un gruppo quando la sua visibilita' cambia
// *********************************************************************************
IDPanel.prototype.UpdateGroupVisibility = function(group)
{
  if (this.Realized)
  {
    var recalcSize = false;
    //
    // Mando il messaggio a tutti i campi di questo gruppo
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      if (this.Fields[i].Group == group)
      {
        // Se il campo e' nella lista, dovro' aggiornare tutto il layout
        if (this.PanelMode==RD3_Glb.PANEL_LIST && this.Fields[i].ListList)
        {
          this.RecalcLayout = true;
          break;
        }
        //
        // Se il gruppo e' Form o List adattiamo il tutto alla fine
        recalcSize = true;
        //
        // Provo ad aggiornare solo la visibilita' dei campi
        this.Fields[i].UpdateFieldVisibility();
      }
    }
    //
    // La CalcGroupsLayout non fa nulla per i gruppi invisibili, quindi se e' tornato visibile e' meglio farla qui
    this.CalcGroupsLayout();
    //
    if (recalcSize)
      this.AdaptFormListLayout();
  }
}


// *********************************************************************************
// Metodo chiamato da un gruppo quando la sua abilitazione cambia
// *********************************************************************************
IDPanel.prototype.UpdateGroupEnability = function(group)
{
  if (this.Realized)
  {
    // Mando il messaggio a tutti i campi di questo gruppo
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      if (this.Fields[i].Group == group)
      {
        // Provo ad aggiornare solo la visibilita' dei campi
        this.Fields[i].SetEnabled();
      }
    }
  }
}


// *********************************************************************************
// Metodo chiamato da una pagina quando la sua abilitazione cambia
// *********************************************************************************
IDPanel.prototype.UpdatePageEnability = function(page)
{
  if (this.Realized)
  {
    // Mando il messaggio a tutti i campi di questo gruppo
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      if (this.Fields[i].Page == page)
      {
        // Provo ad aggiornare solo la visibilita' dei campi
        this.Fields[i].SetEnabled();
      }
    }
  }
}


// ********************************************************************************
// Restituisce la larghezza del row selector
// ********************************************************************************
IDPanel.prototype.RowSelWidth = function()
{
  var rsw = RD3_ClientParams.RowSelWidth + (RD3_ServerParams.Theme.startsWith("zen") ? 14 : 0);
  return (this.ShowRowSelector? rsw : 0);
}

// ********************************************************************************
// Restituisce l'altezza complessiva delle righe, compreso il gap
// ********************************************************************************
IDPanel.prototype.GetRowHeight = function()
{
  return this.MaxHRow + this.VisStyle.GetRowOffset();
}


// ********************************************************************************
// Evento di click sul rowsel del pannello
// ********************************************************************************
IDPanel.prototype.OnRowSelectorClick = function(evento, nrow)
{ 
  var row = undefined;
  //
  // Passato da pvalue?
  if (nrow!=undefined)
   {
    row = nrow;
  }
  else
  {
    var eve = (window.event)?window.event:evento;
    var obj = (window.event)?window.event.srcElement:evento.target;
    var p = obj.id.indexOf(":rs");
    row = parseInt(obj.id.substring(p+3));
  }    
  //
  // Se il pannello e' gruppato aggiungo anche la riga assoluta a cui mi devo portare, in modo che il server
  // possa gestire il buffer video di conseguenza , nel caso sia su una nuova riga
  // mando al server un indice che supera i record, il server si posizionera' su indice-riga, mantenendo
  // la posizione corretta
  var absrow = 0;
  if (this.IsGrouped())
  {
    absrow = this.ListGroupRoot.GetServerIndex(this.CompactActualPosition+row, true);
  }
  //
  var ev = new IDEvent("panrs", this.Identifier, eve, this.RowSelectEventDef, row, absrow);
  if (ev.ClientSide)
  {
    this.ChangeActualRow(row);
    //
    // Impedisco il riposizionamento del fuoco automatico: farebbe cambiare riga
    RD3_KBManager.CheckFocus = false;
  }
  return true;
}


// ********************************************************************************
// Evento di click sul rowsel del pannello
// ********************************************************************************
IDPanel.prototype.OnMultiSelClick = function(evento, nrow)
{ 
  var eve = (window.event)?window.event:evento;
  var obj = (window.event)?window.event.srcElement:evento.target;
  var p = obj.id.indexOf(":rs");
  var row = parseInt(obj.id.substring(p+3));
  //
  // Passato da pvalue?
  if (nrow!=undefined)
    row = nrow;
  //
  if (this.ShowMultipleSel)
  {
    var selr = row;
    //
    if (this.IsGrouped())
    {
      selr = this.IsHeader(row);
      //
      // Non gestisco la selezione sugli header!
      if (selr == -1)
        return true;
    }
    //
    var ch = obj.checked;
    if (RD3_Glb.IsMobile())
      ch = !this.MultiSelStatus[this.IsGrouped()?selr:this.ActualPosition+row];
    //
    var ev = new IDEvent("panms", this.Identifier, eve, this.MultiSelEventDef, selr, ch ? "-1" : "0");
    if (ev.ClientSide)
    {
      if (this.IsGrouped())
        this.MultiSelStatus[selr] = ch;
      else
        this.MultiSelStatus[this.ActualPosition+row] = ch;
      //
      this.SetStatusBarText();
    }
  }  
  return true;
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
IDPanel.prototype.AfterProcessResponse= function()
{ 
  // Chiamo la classe base che esegue un recalc layout se richiesto
  WebFrame.prototype.AfterProcessResponse.call(this);
  //
  // Gestisco ulteriori aggiustamenti
  if (this.ResetPosition || this.UpdateListGroups)
  {
    this.SetActualPosition(undefined, undefined, this.ScrollToPos && !this.DenyScroll);
    this.ResetPosition = false;
    this.ScrollToPos = false;
  }
  //
  if (this.QbeScroll)
  {
    this.QbeScroll = false;
    this.UpdateScrollPos();
  }
  //
  if (this.RefreshToolbar)
    this.UpdateToolbar();
  //
  if (this.UpdateRSel)
  {
    this.UpdateRSel = false;
    this.UpdateRowSel();
  }
  //
  // E' cambiata la visibilita di celle o di campi, se ho la lista fluida devo rimettere un po' a posto le classi
  if ((this.RefreshRowsClasses || this.RowsToRefresh.length > 0) && this.IsFluidPanel()) 
    this.UpdateFluidRowClasses();
  //
  if (this.AdaptFieldsSortImage)
  {
    // Una o piu' immagini di SORT sono cambiate. Le riposiziono
    this.AdaptFieldsSortImage = false;
    //
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      f.AdaptSortImage();
    }
  }
  //
  this.OldAttR = this.ActualRow;
  //
  // Invio il messaggio di fine richiesta ai campi
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    this.Fields[i].AfterProcessResponse();
  }
  //
  //  Ripristino il margin top della scrollarea se avevo usato il pull to refresh
  if (this.OrgMarginTop!=undefined)
  {
    var x = this.IDScroll.PullTrigger;
    this.IDScroll.PullTrigger = 0;
    this.IDScroll.MarginTop = 0;
    this.IDScroll.ChangeSize(true);
    //
    this.IDScroll.PullTrigger = x;
    this.IDScroll.MarginTop = this.OrgMarginTop;
    this.OrgMarginTop = undefined;
  }
}


// ********************************************************************************
// Gestore evento di click sul pulsante Lock della Toolbar
// ********************************************************************************
IDPanel.prototype.OnLockClick= function(evento)
{ 
  // Chiamo il corrispondente pulsante della toolbar
  this.OnToolbarClick(evento, this.Locked ? "unlock" : "lock");
}


// ********************************************************************************
// Bisogna dare il fuoco al pannello
// ********************************************************************************
IDPanel.prototype.Focus= function(gotop)
{ 
  // Pannello invisibile o collassato... niente da fare
  if (this.Collapsed || !this.Visible)
    return false;
  //
  // Se sono in una tabbed, controllo che io sia visibile
  if (this.ParentTab && this.ParentFrame && this.ParentFrame.GetSelectedFrame()!=this)
    return false;
  //
  // Questa funzione e' la gestione del fuoco automatica, ma non ci interessa nel caso di pannelli fluidi, altrimenti
  // da il fuoco alla cella selezionata e muove la scrollbar.
  // Ci interessa pero' dare il fuoco alla lista per gestire i pulsanti della toolbar
  if ((this.IsFluidPanel() && this.PanelMode == RD3_Glb.PANEL_LIST))
  {
    if (this.ListBox)
      this.ListBox.focus();
    return true;
  }
  //
  // Do il fuoco al primo campo che lo vuole
  var rw = gotop ? 0 : this.ActualRow;
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    if (this.Fields[i].CanHaveFocus(rw) && this.Fields[i].HandlesTabOrder() && this.Fields[i].Focus(null, rw))
      return true;
  }
  //
  return false;
}

IDPanel.prototype.HandlesTabFocus = function()
{
  // Non permetto la navigazione con il tab su un sottopannello che non puo' ne' 
  // aggiornare ne' inserire
  if (this.ParentFrameIdentifier && (!this.CanUpdate && !this.CanUpdate))
    return false;
  //  
  return true;
}


// ********************************************************************************
// Cambio riga dovuto a movimento del cursore
// ********************************************************************************
IDPanel.prototype.ChangeActualRow= function(newrow, evento)
{ 
  var oldrow = this.ActualRow;
  if (newrow != oldrow)
  {
    var evt = this.ScrollEventDef;
    var ev;
    //
    // Creo l'evento (che si aggiunge all'elenco se deve)
    if (evento)
    {
      // Se il pannello e' gruppato aggiungo anche la riga assoluta a cui mi devo portare, in modo che il server
      // possa gestire il buffer video di conseguenza , nel caso sia su una nuova riga
      // mando al server un indice che supera i record, il server si posizionera' su indice-riga, mantenendo
      // la posizione corretta
      var absrow = 0;
      if (this.IsGrouped())
      {
        absrow = this.ListGroupRoot.GetServerIndex(this.CompactActualPosition+newrow, true);
      }
      //
      ev = new IDEvent("chgrow", this.Identifier, evento, evt, null, newrow, absrow);
    }
    //
    // Se l'evento ha le caratteristiche per essere gestito lato client,
    // lo faccio ora
    if (!evento || (ev && ev.ClientSide))
    {
      this.SetActualRow(newrow);
      //
      var n = this.Fields.length;
      for (var i=0; i<n; i++)
      {
        // Se ho un resetposition devo rinfrescare l'intero pannello e non solo le due righe coinvolte
        if (this.ResetPosition)
          this.Fields[i].SetActualPosition(this.ActualPosition);
        else
          this.Fields[i].SetActualPosition(this.ActualPosition,oldrow,newrow);
      }
      //
      this.SetStatusBarText();
      //
      this.ResetPosition = false;
    }    
  }
}


// ********************************************************************************
// Dimensiona la scrollbare tenendo conto delle righe totali o quelle visibili 
// nella visione gruppata
// ********************************************************************************
IDPanel.prototype.UpdateScrollBox = function()
{
  if (this.ScrollBoxInt)
  {
    // Calcolo l'altezza del contenuto della scrollbar
    var h = (this.TotalRows-1) * this.GetRowHeight() + this.MaxHRow;
    //
    // Questo lo fa anche UpdateToolbar, se sono scrollato in lista con meno righe di quelle visibili puo' essere solo per l'inerimento..
    // Verifico se sono nel caso di inserimento in un pannello con meno righe rispetto a quelle visibili: in questo
    // caso la scrollbar scomparirebbe perche' non serve ma il pannello sarebbe scrollato (per le nuove righe..)
    // e non si potrebbe tornare indietro: allora allungo la scrollbar... (vedi UpdateToolbar)
    if (this.PanelMode==RD3_Glb.PANEL_LIST && this.GetTotalRows()<=this.NumRows && this.ActualPosition!=1)
    {
      var fullRows = 1 + (this.GetTotalRows()-this.ActualPosition);
      h = ((this.GetTotalRows()-1) + (this.NumRows-fullRows)) * this.GetRowHeight() + this.MaxHRow;
    }
    //
    // Se il pannello e' gruppato devo impostare la dimensione in base alle righe veramente visibili..
    if (this.IsGrouped())
    {
      var n = this.ListGroupRoot.GetNumRows()-1;
      //
      // Gestione righe non gruppate: se il pannello ha piu' record di quelli gruppati tengo conto dei record mancanti
      if (this.TotalRows>this.ListGroupRoot.EndingRecord)
        n += this.TotalRows - this.ListGroupRoot.EndingRecord;
      //
      h = n * this.GetRowHeight() + this.MaxHRow;
    }
    //
    if (h<0) h=0;
    this.ScrollBoxInt.style.height = (h+1) + "px";
    this.ScrollBoxInt.setAttribute("idheight",this.ScrollBoxInt.style.height);
    //
    this.UpdateScrollPos();
  }
}


// ********************************************************************************
// Dimensiona la scrollint in base alla posizione e al numero di righe
// nella visione gruppata
// ********************************************************************************
IDPanel.prototype.UpdateScrollTouch = function()
{
  if (this.ScrollBoxTouch)
  {
    // L'altezza dello scrollbox touch e' una proporzione dell'intero RS, ma con un minimo
    if (this.TotalRows==0 || this.Status==RD3_Glb.PS_QBE)
    {
      this.ScrollIntTouch.style.display = "none";
    }
    else
    {
      var oh = this.ScrollBoxTouch.offsetHeight;
      var ih = this.ScrollIntTouch.offsetHeight;
      var h = Math.ceil(oh*this.NumRows/this.TotalRows);
      if (h<24)
        h=24;
      this.ScrollIntTouch.style.height = h+"px";
      //
      var st = Math.ceil(oh*(this.ActualPosition-1)/this.TotalRows);
      if (st>oh-ih)
        st = oh-ih;
      this.ScrollIntTouch.style.top = st+"px";
      //
      this.ScrollIntTouch.style.display = "";
    }
  }
}


// ********************************************************************************
// Muove il pannello in base alla posizione del ditino
// ********************************************************************************
IDPanel.prototype.MoveScrollTouch = function(yscr)
{
  if (this.ScrollBoxTouch && this.TotalRows>0 && this.Status!=RD3_Glb.PS_QBE)
  {
    // Percentuale su cui ha cliccato
    var py = (yscr - RD3_Glb.GetScreenTop(this.ScrollBoxTouch))/this.ScrollBoxTouch.offsetHeight;
    if (py<0)
      py=0;
    if (py>1)
      py=1;
    //
    // Posiziono lo scrolltop dello scrollbox nello stesso punto percentuale
    this.LastPositionTime=0;
    this.ScrollBox.scrollTop = py*this.ScrollBoxInt.offsetHeight;
    this.UpdateScrollTouch();
  }
}


// ********************************************************************************
// Aggiorna la posizione della scrollbar
// ********************************************************************************
IDPanel.prototype.UpdateScrollPos= function(force)
{
  if (this.Realizing && !force)
    return;
  //
  if (this.ScrollBox)
  {
    this.LastPositionTime = new Date();
    var st = (this.ActualPosition - 1) * this.GetRowHeight();
    //
    // Se il pannello e' gruppato devo impostare la posizione in base alle righe veramente visibili..
    if (this.IsGrouped())
      st = (this.CompactActualPosition - 1) * this.GetRowHeight();
    //
    // Mi memorizzo la nuova posizione per il riposizionamento (vedi UpdateToolbar)
    this.SkipScroll = st;
    this.ScrollBoxInt.setAttribute("idtop", st);
    this.ScrollBox.scrollTop = st;
    //
    this.UpdateScrollTouch();
  }
}


// **********************************************************************
// Gestisco la pressione dei tasti FK a partire dal pannello
// **********************************************************************
IDPanel.prototype.HandleFunctionKeys = function(eve)
{
  // Vediamo se il tasto e' attivo...
  var code = (eve.charCode)?eve.charCode:eve.keyCode;
  var ok = false;
  //
  // Verifico i comandi legati ai campi
  var n = this.Fields.length;
  for (var i=0; i<n && !ok; i++)
    ok = this.Fields[i].FieldFunctionKeys(eve);
  //
  if (ok)
    return ok;
  //
  // Innanzitutto verifico la toolbar di frame
  ok = RD3_DesktopManager.WebEntryPoint.CmdObj.HandleFunctionKeys(eve, this.WebForm.IdxForm, this.WebForm.GetFrameIndex(this)+1);
  if (ok)
    return ok; // Nel caso esco subito perche' non devo fare verifiche ulteriori
  //
  // Calcolo il numero di FK da 1 a 48
  var fkn = (code-111) + (eve.shiftKey? 12 : 0)  + (eve.ctrlKey? 24 : 0);
  //
  // La mia toolbar e' visibile?
  var IsToolbarVisible = (this.ToolbarBox!=null && this.ToolbarBox.style.display!="none");
  //
  // Vediamo se corrisponde ad uno dei miei tasti predefiniti
  if (fkn==RD3_ClientParams.FKEnterQBE && IsToolbarVisible && this.SearchButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "search");
  }
  if (fkn==RD3_ClientParams.FKFindData && IsToolbarVisible && this.FindButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "find");
  }
  if (fkn==RD3_ClientParams.FKFormList && IsToolbarVisible && this.FormListButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "list");
  }
  if (fkn==RD3_ClientParams.FKRefresh && IsToolbarVisible && this.RefreshButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "refresh");
  }
  if (fkn==RD3_ClientParams.FKCancel && IsToolbarVisible && this.CancelButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "cancel");
  }
  if (fkn==RD3_ClientParams.FKInsert && IsToolbarVisible && this.NewButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "insert");
  }
  if (fkn==RD3_ClientParams.FKDelete && IsToolbarVisible && this.DelButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "delete");
  }
  if (fkn==RD3_ClientParams.FKUpdate && IsToolbarVisible && this.SaveButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "save");
  }
  if (fkn==RD3_ClientParams.FKDuplicate && IsToolbarVisible && this.DuplButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "dupl");
  }
  if (fkn==RD3_ClientParams.FKPrint && IsToolbarVisible && this.PrintButton.style.display=="")
  {
    ok = true;
    this.OnToolbarClick(eve, "print");
  }
  if (fkn == RD3_ClientParams.FKSelAll && this.EnableMultipleSel && this.ShowMultipleSel)
  {
    ok = true;
    this.OnMultiSelCmd(eve, "selall");
  }
  if (fkn == RD3_ClientParams.FKSelNone && this.EnableMultipleSel && this.ShowMultipleSel)
  {
    ok = true;
    this.OnMultiSelCmd(eve, "selnone");
  }  
  if (fkn == RD3_ClientParams.FKSelTog && this.EnableMultipleSel)
  {
    ok = true;
    this.OnMultiSelCmd(eve, "seltog");
  }  
  if (fkn==RD3_ClientParams.FKLocked && IsToolbarVisible && this.LockButton.style.display=="")
  {
    ok = true;
    this.OnLockClick(eve);
  }
  if (fkn==RD3_ClientParams.FKActRow)
  {
    ok = true;
    this.OnRowSelectorClick(eve, this.ActualRow);
  }
  if (fkn==RD3_ClientParams.FKActField && RD3_KBManager.ActiveObject && RD3_KBManager.ActiveObject.ParentPanel==this)
  {
    ok = true;
    RD3_KBManager.ActiveObject.OnClickActivator(eve);
  }
  //
  var a = RD3_Glb.PCM_CUSTOM1;
  for (var i = 0; i < RD3_DesktopManager.WebEntryPoint.CustomCommands.length; i++)
  {
    // Custom 9 deve ricominciare da 0 (perche' cambia intero) ed essere <0 (in modo da poter decidere di andare sui nuovi flag)
    if (i == 8)
     a = -0x1;
    //
    var cm = RD3_DesktopManager.WebEntryPoint.CustomCommands[i];
    if (cm.FKNum == fkn && this.IsCommandEnabled(a))
    {
      this.OnToolbarClick(eve, "cb" + i);
      ok = true;
      break;
    }
    //
    a *= 2;
  }
  //
  // Se il tasto non e' stato identificato, chiamo la classe base
  if (!ok)
    ok = WebFrame.prototype.HandleFunctionKeys.call(this, eve);
  //
  return ok;
}


// **********************************************************************
// Da il fuoco al campo successivo, eventualmente scrolla in giu' il pannello
// **********************************************************************
IDPanel.prototype.FocusNextField = function(fld, eve)
{
  var panelCompleted = false;
  var nr = this.ActualRow;
  var scrolla = false;
  //
  // Vado sul prossimo campo utile
  var f = this.GetNextField(fld);
  if (!f)
  {
    panelCompleted = true;
    //
    f = this.GetFirstField();
    if (this.ActualRow<this.NumRows-1)
      nr++;
    else
      scrolla = true;
  }
  //  
  // Verifico se e' fuocabile
  var alreadyAtBottom = false;
  while (f!=fld && f && !f.CanHaveFocus())
  {
    f = this.GetNextField(f);
    if (!f)
    {
      panelCompleted = true;
      //
      // Abbiamo gia' fatto il giro intero del pannello, se non abbiamo trovato nessun campo che vuole il fuoco non lo troveremo mai..
      // usciamo dal loop
      if (alreadyAtBottom)
        break;
      //
      f = this.GetFirstField();
      if (this.ActualRow<this.NumRows-1)
        nr++;
      else
        scrolla = true;
      //
      alreadyAtBottom = true;
    }
  }
  //
  // Se posso ancora scrollare allora vado avanti.. altrimenti se sono tornato all'inizio del pannello
  // passo al prossimo
  var cannotScroll = scrolla && this.ActualPosition+this.NumRows-1 >= this.TotalRows;
  if (panelCompleted && (cannotScroll || this.Status == RD3_Glb.PS_QBE || this.PanelMode==RD3_Glb.PANEL_FORM))
  {
    this.WebForm.Focus(this, true);
    return;
  }
  //
  // Se sono in form, non eseguo alcun scrolling
  if (this.PanelMode==RD3_Glb.PANEL_FORM)
    scrolla = false;
  //  
  if (f)
  {
    // Se la cella e' attiva, seleziono tutto il testo
    var selall = f.IsEnabled();
    //
    var r = f.Focus(eve, nr, selall);
    //
    // Siccome mi sono mosso in avanti, porto il cursore in cima al campo
    var o = RD3_KBManager.GetActiveElement();
    if (o && (RD3_Glb.IsEditFld(o) || o.tagName=="TEXTAREA") && !selall)
    {
      setCursorPos(o,0); // Definito in maskedinp.js
    }
    //
    // Se il campo di pannello ha rifiutato il fuoco e c'e' la cella QBE e attualmente siamo su una cella QBE diamo il fuoco alla cella QBE del campo
    if (!r && o && this.UseListQBE == RD3_Glb.PAN_QBEROW && f.PQBECell) {
      var actObj = RD3_KBManager.GetObject(o, true);
      if (actObj && (actObj.ListQBEValue || actObj.ListQBECell))
        f.PQBECell.Focus();
    }
  }
  //
  if (scrolla && this.ActualPosition<this.TotalRows-this.NumRows+1)
  {
    this.ScrollTo(this.ActualPosition+1,eve);
    this.UpdateScrollPos();
  }
}


// **********************************************************************
// Da il fuoco al campo precedente, eventualmente scrolla in su il pannello
// **********************************************************************
IDPanel.prototype.FocusPrevField = function(fld, eve)
{
  var panelCompleted = false;
  var f = this.GetPrevField(fld);
  var nr = this.ActualRow;
  var scrolla = false;
  //
  if (!f)
  {
    panelCompleted = true;
    //
    f = this.GetLastField();
    if (this.ActualRow>0)
      nr--;
    else
      scrolla = true;
  }
  //  
  // Verifico se e' fuocabile
  var alreadyAtTop = false;
  while (f!=fld && f && !f.CanHaveFocus())
  {
    f = this.GetPrevField(f);
    if (!f)
    {
      panelCompleted = true;
      //
      // Abbiamo gia' fatto il giro intero del pannello, se non abbiamo trovato nessun campo che vuole il fuoco non lo troveremo mai..
      // usciamo dal loop
      if (alreadyAtTop)
        break;
      //
      f = this.GetLastField();
      if (this.ActualRow>0)
        nr--;
      else
        scrolla = true;
      //
      alreadyAtTop = true;
    }
  }
  //
  // Se posso ancora scrollare allora vado avanti.. altrimenti se sono tornato all'inizio del pannello
  // passo al prossimo
  var cannotScroll = scrolla && this.ActualPosition==1;
  if (panelCompleted && (cannotScroll || this.Status == RD3_Glb.PS_QBE || this.PanelMode==RD3_Glb.PANEL_FORM))
  {
    this.WebForm.Focus(this, false);
    return;
  }
  //
  // Se sono in form, non eseguo alcun scrolling
  if (this.PanelMode==RD3_Glb.PANEL_FORM)
    scrolla = false;
  //  
  if (f)
  {
    // Se la cella e' attiva, seleziono tutto il testo
    var selall = f.IsEnabled();
    //
    var r = f.Focus(eve, nr, selall);
    //
    // Siccome mi sono mosso all'indietro, porto il cursore in fondo al valore
    var o = RD3_KBManager.GetActiveElement();
    if (o && (RD3_Glb.IsEditFld(o) || o.tagName=="TEXTAREA") && !selall)
    {
      setCursorPos(o,o.value.length); // Definito in maskedinp.js
    }
    //
    // Se il campo di pannello ha rifiutato il fuoco e c'e' la cella QBE e attualmente siamo su una cella QBE diamo il fuoco alla cella QBE del campo
    if (!r && o && this.UseListQBE == RD3_Glb.PAN_QBEROW && f.PQBECell) {
      var actObj = RD3_KBManager.GetObject(o, true);
      if (actObj && (actObj.ListQBEValue || actObj.ListQBECell))
        f.PQBECell.Focus();
    }
  }
  //
  if (scrolla && this.ActualPosition>1)
  {
    this.ScrollTo(this.ActualPosition-1,eve);
    this.UpdateScrollPos();
  }
}


// **********************************************************************
// Ritorna il primo campo del pannello
// **********************************************************************
IDPanel.prototype.GetFirstField = function()
{
  var n = this.Fields.length;
  for (var i = 0; i<n; i++)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[i];
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_FORM)
      f = this.FormTabOrder[i];
    //
    if (!f.IsStatic() && f.IsVisible() && f.HandlesTabOrder())
      return f;
  }
  //
  // Nessun campo visibile
  return null;
}


// **********************************************************************
// Ritorna l'ultimo campo del pannello
// **********************************************************************
IDPanel.prototype.GetLastField = function()
{
  var n = this.Fields.length;
  for (var i = n-1; i>=0; i--)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[i];
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_FORM)
      f = this.FormTabOrder[i];
    //
    if (!f.IsStatic() && f.IsVisible() && f.HandlesTabOrder())
      return f;
  }
  //
  // Nessun campo visibile
  return null;
}

// **********************************************************************
// Ritorna l'ultimo campo del pannello
// **********************************************************************
IDPanel.prototype.GetLastListField = function()
{
  var n = this.Fields.length;
  for (var i = n-1; i>=0; i--)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[i];
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_FORM)
      f = this.FormTabOrder[i];
    //
    if (!f.IsStatic() && f.IsVisible() && f.InList && f.ListList)
      return f;
  }
  //
  // Nessun campo visibile
  return null;
}

// **********************************************************************
// Ritorna il prossimo campo del pannello
// **********************************************************************
IDPanel.prototype.GetNextField = function(fld)
{
  var n = this.Fields.length;
  //
  for (var x = 0; x<n; x++)
  {
    var f = this.Fields[x];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[x];
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_FORM)
      f = this.FormTabOrder[x];
    //
    if (f.Index==fld.Index)
      break;
  }
  //
  for (var i = x+1; i<n; i++)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[i];
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_FORM)
      f = this.FormTabOrder[i];
    //
    if (f && (!f.IsStatic() || f.IsButton()) && f.IsVisible() && f.HandlesTabOrder())
      return f;
  }
  //
  // Nessun campo successivo
  return null;
}


// **********************************************************************
// Ritorna il campo precedente del pannello
// **********************************************************************
IDPanel.prototype.GetPrevField = function(fld)
{
  var n = this.Fields.length;
  //
  for (var x = 0; x<n; x++)
  {
    var f = this.Fields[x];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[x];
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_FORM)
      f = this.FormTabOrder[x];
    //
    if (f.Index==fld.Index)
      break;
  }
  //
  for (var i = x-1; i>=0; i--)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_LIST)
      f = this.ListTabOrder[i];
    if (this.AdvTabOrder && this.PanelMode==RD3_Glb.PANEL_FORM)
      f = this.FormTabOrder[i];
    //
    if ((!f.IsStatic() || f.IsButton()) && f.IsVisible() && f.HandlesTabOrder())
      return f;
  }
  //
  // Nessun campo precedente
  return null;
}


// ********************************************************************************
// Cambia la multiselezione
// 0 = NONE, 1 = INVERT, 2 = ALL
// ********************************************************************************
IDPanel.prototype.ChangeSelection= function(sel, force)
{
  var begin = (this.SelAllOnlyVis && !force ? this.ActualPosition : 1);
  var end = (this.SelAllOnlyVis && !force ? this.ActualPosition + this.NumRows -1 : this.TotalRows);
  for (var i=begin; i<=end; i++)
  {
    switch (sel)
    {
      case 0:
        this.MultiSelStatus[i]= false;
      break;
      
      case 1:
        this.MultiSelStatus[i]= !this.MultiSelStatus[i];
      break;

      case 2:
        this.MultiSelStatus[i]= true;
      break;
    }
  }
}


// ********************************************************************************
// Aggiorna lo stato degli indicatori della multiselezione
// ********************************************************************************
IDPanel.prototype.UpdateMultipleSel= function()
{
  // caso mobile, uso le classi
  if (RD3_Glb.IsMobile() && this.EnableMultipleSel)
  {
    // Scelgo la colonna migliore per la multiselezione
    var col = -1;
    for (var i=0; i<this.Fields.length; i++)
    {
      var pf = this.Fields[i];
      if (pf.InList && pf.ListList)
      {
        // Vediamo se c'e' un blob o un campo html...
        var ok = true;
        if (pf.DataType==10)
          ok = false;
        if (pf.VisualStyle.ShowHTML())
          ok = false;
        if (ok)
        {
          col = i;
          break;
        }
      }
    }
    if (col>=0)
    {
      for (var i=0; i<this.Fields.length; i++)
      {
        var pf = this.Fields[i];
        if (pf.InList && pf.ListList)
          pf.UpdateMultipleSel(this.ShowMultipleSel, this.MultiSelStatus, col!=i);
      }
    }
  }
  else if (this.ShowMultipleSel && this.MultiSelStatus && this.RowSel)
  {
    var n = this.RowSel.length;
    for (var i=0; i<n; i++)
    {
      if (this.IsGrouped())
      {
        // Disabilito i check sulle righe nuove
        var disabled = this.IsNewRow(this.ActualPosition, i);
        //
        var idxrw = this.IsHeader(i);
        if (idxrw == -1)
          disabled = true;
        //
        var rs = RD3_ServerParams.CompletePanelBorders ? this.RowSel[i].firstChild : this.RowSel[i];
        rs.disabled = disabled;    
        if (!disabled)
          rs.checked = this.MultiSelStatus[idxrw];
        else
          rs.checked = false;
      }
      else
      {
        var disabled = (this.ActualPosition + i > this.TotalRows || this.Status == RD3_Glb.PS_QBE);
        //
        var rs = RD3_ServerParams.CompletePanelBorders ? this.RowSel[i].firstChild : this.RowSel[i];
        rs.disabled = disabled;
        if (!disabled)
          rs.checked = this.MultiSelStatus[this.ActualPosition+i];
        else
          rs.checked = false;
      }
    }
  }
  //
  // Occorre aggiornare il testo della StatusBar
  this.SetStatusBarText();
}

// **********************************************************************
// Gestore dell'evento di MouseOver
// **********************************************************************
IDPanel.prototype.OnMouseOverObj = function(ev)
{
  var obj = (window.event)?window.event.srcElement:ev.target;
  if (!obj)
    return;
  //
  //Se sono sull'icona del QBETip
  if (obj == this.QBETIcon)
  {
    if (this.QBETip.length>0)
    {
      // Posiziono il QBETipBox
      this.QBETipBox.SetAnchor(RD3_Glb.GetScreenLeft(obj) + (obj.offsetWidth/2), RD3_Glb.GetScreenTop(obj) + obj.offsetHeight);
      //
      // Mostro il QBETip con l'animazione
      this.QBETipBox.Activate();
    }
  }
}

// **********************************************************************
// Gestore dell'evento di MouseOut
// **********************************************************************
IDPanel.prototype.OnMouseOutObj = function(ev)
{
  var obj = (window.event)?window.event.srcElement:ev.target;
  if (!obj)
    return;
  //
  //Se sono sull'icona del QBETip
  if (obj == this.QBETIcon)
  {
    // Chiudo il QBETip con l'animazione
    this.QBETipBox.Deactivate(true);
  }
}

// ********************************************************************************
// Gestore eventi di mouse su un pulsante della Toolbar di pannello
// Il parametro deve valere "" per bottone senza effetti, "hover" per highlight
// e "down" per effetto cliccato
// ********************************************************************************
IDPanel.prototype.OnToolMouseUse = function(evento, parametro)
{ 
  var eve = (window.event)?window.event:evento;
  var obj = (window.event)?window.event.srcElement:evento.target;
  //
  // se ho trovato l'origine dell'evento
  if (obj)
  {
    var prefix = "panel";
    if (obj.className.indexOf("frame")>=0)
      prefix = "frame";
    //
    // gestisco il caso di over, leave e down
    if (!RD3_Glb.IsMobile())
    {
      obj.className = prefix + "-toolbar-button"+ ((this.SmallIcons)? "-small" : "") + ((parametro == "") ? "" : "-" + parametro);
    }
    else
    {
      if (!RD3_Glb.IsTouch())
      {
        // Devo solo gestire la colorazione della freccia
        // Il caso touch e' gia' gestito in webframe
        var isarrow = RD3_Glb.HasClass(obj,"panel-formlist-button") || RD3_Glb.HasClass(obj,"panel-formlist-arrow");
        if (isarrow)
        {
          if (parametro=="down")
          {
            RD3_Glb.AddClass(this.FormListButton, "panel-toolbar-active");
            RD3_Glb.AddClass(this.FormListButtonImg, "panel-toolbar-active");
          }
          else
          {
            RD3_Glb.RemoveClass(this.FormListButton, "panel-toolbar-active");
            RD3_Glb.RemoveClass(this.FormListButtonImg, "panel-toolbar-active");
          }
        }
      }
    }
  }
}

// *******************************************************************
// Funzione Callback chiamata dopo la pressione di uno dei pulsanti
// della confirm per cancellare i dati
// -> utilizzata anche come callback per la confirm della duplicazione
// o esportazione senza righe multiselezionate (vedi OnToolbarClick)
// *******************************************************************
IDPanel.prototype.OnDeleteConfirm = function(ev, button)
{
  if (this.MsgBox)
  {
    if (button == "delete")
      this.DoHighlightDelete(false);
    //
    // Se l'utente ha dato l'ok mando il delete
    if (this.MsgBox.UserResponse == "Y")
      var ev = new IDEvent("pantb", this.Identifier, ev, this.ToolbarEventDef, button);
    //
    // Elimino il riferimento alla confirm
    this.MsgBox = null;
  }
}


// ********************************************************************************
// Indica quanto il contenuto deve essere piu' basso del frame per contenere
// la toolbar, le pagine...
// ********************************************************************************
IDPanel.prototype.GetContentOffset = function()
{ 
  var ofs = this.ToolbarBox.offsetHeight;
  if (this.PagesBox)
  {
    var val = 0;
    //
    // Se non sono mobile oppure se sono Mobile ed in Form (ma non durante l'animazione)
    // dimensiono il content-container tenendo conto della toolbar delle pagine (quindi in lista oppure durante il passaggio
    // da lista a form il contenitore occupa l'intero spazio)
    if (!RD3_Glb.IsMobile() || (this.PanelMode==RD3_Glb.PANEL_FORM && !this.AnimatingPanel))
      val = this.PagesBox.offsetHeight;
    //
    ofs += val;
  }
  return ofs;
}


// ********************************************************************************
// Ridimensiona i campi in form
// ********************************************************************************
IDPanel.prototype.ResizeForm = function()
{   
  var dw = this.DeltaW;
  var dh = this.DeltaH;
  var fw = 0;
  var fh = 0;
  //
  // questo flag indica solo estensione invece che adattamento dei campi
  var ex = this.WebForm.ResModeW == RD3_Glb.FRESMODE_EXTEND;
  var ey = this.WebForm.ResModeH == RD3_Glb.FRESMODE_EXTEND;
  //
  // Calcolo il bounding box allo stato attuale
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    if (f.InForm)
    {
      if (f.FormLeft+f.FormWidth>fw)
        fw = f.FormLeft+f.FormWidth;
      if (f.FormTop+f.FormHeight>fh)
        fh = f.FormTop+f.FormHeight;
     }      
  }
  //
  // Se non sono su mobile ho alcuni padding di cui tenere conto
  if (!RD3_Glb.IsMobile())
  {
    fw+=8;
    fh+=8;
  }
  //
  // Ridimensiono i campi come richiesto, tentando di togliere le scrollbar
  if ((this.ContentBox.clientWidth-dw)<fw && dw>0)
  {
    dw -= (fw-(this.ContentBox.clientWidth-dw));
    if (dw<0)
      dw = 0;
  }
  if ((this.ContentBox.clientHeight-dh)<fh && dh>0)
  {
    dh -= (fh-(this.ContentBox.clientHeight-dh));
    if (dh<0)
      dh = 0;
  }
  //
  // Ora ridimensiono i campi in form
  if (dw!=0 || dh!=0)
  {
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      if (f.InForm)
        f.ResizeForm(dw, dh, ex, ey);
    }
  }
  //
  this.LastFormResizeW = this.Width;
  this.LastFormResizeH = this.Height;
}


// ********************************************************************************
// Ridimensiona i campi in lista
// ********************************************************************************
IDPanel.prototype.ResizeList = function()
{ 
  var dw = this.DeltaW;
  var dh = this.DeltaH;
  var fw = this.ListLeft+this.ListWidth;
  var fh = this.ListTop+this.ListHeight;
  var ft = 0;
  //
  // questo flag indica solo estensione invece che adattamento dei campi
  var ex = this.WebForm.ResModeW == RD3_Glb.FRESMODE_EXTEND;
  var ey = this.WebForm.ResModeH == RD3_Glb.FRESMODE_EXTEND;
  //
  if (this.FixedColumns>0 || this.ResOnlyVisFlds)
  {
    // In questo caso la vera larghezza del pannello non dipende da ListWidth, ma
    // la calcolo sommando le larghezza dei campi
    fw = this.ListLeft;
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      if (f.InList && f.ListList && f.IsVisible())
      {
        fw+=f.ListWidth;
      }
    }
  }
  //
  fw+=this.RowSelWidth();
  if (this.ScrollBox)
    fw+=19;
  if (this.FixedColumns>0)
    fh+=19; // Altezza scrollarea (possibile scrollbar che appare)
  //
  var fwf = fw; // Bounding Box per i campi in lista ma fuori lista
  var fhf = fh;
  //
  // Calcolo il bounding box allo stato attuale
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    if (ft==0 && f.ListList)
      ft = f.ListTop;
    if (f.ListList)
      f.OldListWidth = f.ListWidth;
    if (f.InList && !f.ListList && (f.AggregateOfField == -1 || (this.FixedColumns == 0 && f.AggregateOfField >= 0)))
    {
      if (f.ListLeft+f.ListWidth>fwf)
        fwf = f.ListLeft+f.ListWidth;
      if (f.ListTop+f.ListHeight>fhf)
        fhf = f.ListTop+f.ListHeight;
     }
  }
  //
  // In mobile i campi possono essere proprio a filo della videata
  if (!RD3_Glb.IsMobile())
  {
    fw+=8;
    fh+=8;
    fwf+=8;
    fhf+=8;
  }
  //
  var dwf = dw; // Delta relativi ai campi fuori lista
  var dhf = dh;
  //
  if (this.ResOnlyVisFlds)
  {
    var dimvis = 0;
    var dimw = 0;
    var nf = this.Fields.length;
    //
    // Ciclo su tutti i campi, memorizzandomi la larhgezza totale dei campi visibili
    for (var iff=0; iff<nf; iff++)
    {
      var f = this.Fields[iff];
      //
      if (f.InList && f.ListList)
      {
        if (f.IsVisible())
        {
          dimvis+=f.ListWidth;
          //
          // Se il campo prima era invisibile e adesso e' visibile devo recuperare la sua larghezza
          if (f.UpdFldVs)
          {
            f.UpdFldVs = false;
            dimw += f.ListWidth;
          }
        }
        else if (f.UpdFldVs)
        {
          // Se il campo prima era visibile e adesso e' invisibile devo recuperare la sua larghezza
          f.UpdFldVs = false;
          dimw -= f.ListWidth;
        }
      }
    }
    //
    // Allargo per recuperare i campi diventati invisibili
    if (dimvis<this.ListWidth)
      dw += this.ListWidth - dimvis;
    //
    // Restringo per recuperare lo spazio per far vedere i campi che adesso sono tornati visibili
    dw -= dimw;
  }
  //
  // Ridimensiono i campi come richiesto, tentando di togliere le scrollbar
  if ((this.ContentBox.clientWidth-dw)<fw && dw>0)
  {
    dw -= (fw-(this.ContentBox.clientWidth-dw));
    //
    // La videata e' cresciuta... e, in questo caso, non voglio che il pannello si riduca...
    // Se il crescere della videata non e' sufficiente a far sparire le scrollbar... forse
    // e' perche' la videata e' stata disegnata "cosi'"... e quindi le scrollbar devono rimanere!
    if (dw<0)
      dw = 0;
  }
  if ((this.ContentBox.clientHeight-dh)<fh && dh>0 && !this.Collapsed)
  {
    dh -= (fh-(this.ContentBox.clientHeight-dh));
    //
    // La videata e' cresciuta... e, in questo caso, non voglio che il pannello si riduca...
    // Se il crescere della videata non e' sufficiente a far sparire le scrollbar... forse
    // e' perche' la videata e' stata disegnata "cosi'"... e quindi le scrollbar devono rimanere!
    if (dh<0)
      dh = 0;
  }
  // Applico i calcoli di prima, pero' al bounding box per i campi fuori lista
  if ((this.ContentBox.clientWidth-dwf)<fwf && dwf>0)
  {
    dwf-= (fwf-(this.ContentBox.clientWidth-dwf));
    //
    if (dwf<0)
      dwf = 0;
  }
  if ((this.ContentBox.clientHeight-dhf)<fhf && dhf>0  && !this.Collapsed)
  {
    dhf -= (fhf-(this.ContentBox.clientHeight-dhf));
    //
    if (dhf<0)
      dhf = 0;
  }
  //
  // Ora ridimensiono i campi in form
  if (dwf!=0 || dhf!=0)
  {
    // Lavoro i campi fuori lista
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      if (f.InList && !f.ListList)
        f.ResizeList(dwf, dhf, ex, ey);
    }
  }
  //
  // Lavoro i campi in lista
  // Scelgo il numero di righe
  if (dh!=0)
  {
    if (this.VResMode==RD3_Glb.RESMODE_MOVE)
    {
      this.SetListTop(this.ListTop + dh);
      //
      // Sposto in basso anche i campi della lista
      var n = this.Fields.length;
      for (var i=0; i<n; i++)
      {
        var f = this.Fields[i];
        if (f.InList && f.ListList)
          this.Fields[i].ListTop += dh;
      }
      //
      var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "top", this.ListTop, this.NumRows);
    }
    if (this.VResMode==RD3_Glb.RESMODE_STRETCH)
    {
      this.SetListHeight(this.ListHeight + dh);
      //
      // Nel caso di pannello fluido l'altezza della lista non ha alcun impatto sul numero di righe da mostrare
      if (!this.IsFluidPanel()) {
        var nr = Math.floor((this.ListTop + this.ListHeight - ft + this.VisStyle.GetRowOffset() - this.GetHeaderSearchOffset())/this.GetRowHeight());
        if (nr!=this.NumRows)
        {
          this.SetNumRows(nr);
          //
          // Ho gia' i valori da far vedere?   
          var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "height", this.ListHeight, nr);
          this.ScrollTo(this.ActualPosition);
          //
          // Ho fatto io la SetActualPosition grazie allo ScrollTo, non c'e' bisogno di farla alla fine della richiesta
          this.ResetPosition = false;
          this.RefreshToolbar = true;
          //
          // L'evento di cambiamento di numero di righe e' importante.
          // Voglio assicurarmi che il server abbia subito il dato.
          RD3_DesktopManager.SendEvents();
        }
      }
    }
  }
  //
  // Infine ridimensiono i campi dentro la lista
  if (dw!=0)
  {
    if (this.HResMode==RD3_Glb.RESMODE_MOVE)
    {
      this.SetListLeft(this.ListLeft + dw);
    }
    if (this.HResMode == RD3_Glb.RESMODE_STRETCH && !this.IsFluidPanel())
    {
      var giro = 0;
      var odw = dw; // Dimensione da allargare o restringere
      var pc = 0; // Dimensione complessiva campi comuni, calcolata alla fine del primo giro
      var max = 0;  // Dimensione pagina massima
      //
      // calcolo la pagina piu' grande
      var pm = this.GetMaxPage();
      while (giro++<2)
      {    
        // Nel primo giro ottimizzo i campi della pagina piu' grande, negli altri quelli della pagina i-esima        
        for (var pa = ((giro==1)?pm:0); pa<((giro==1)?pm+1:this.Pages.length); pa++)
        {
          // Devo ridimensionare i campi interni alla lista
          var ancora = (giro==1)?true:pa!=pm;
          //
          if (giro==1)
          {
            dw = odw;
          }
          else
          {
            // prima vediamo di quanto la posso allargare/stringere
            var n = this.Fields.length;
            var pd = 0;
            for (var i=0; i<n; i++)
            {
              var f = this.Fields[i];
              if (f.ListList && f.Visible && f.InList && !f.HiddenInList() && f.Page==pa)
                pd+=f.ListWidth;
            }
            dw = max-pc-pd;  
          }
          //
          // Faccio un primo giro sui campi per gestire i campi in percentuale...
          // A loro do quel che serve per far si' che la percentuale sia rispettata
          // Quindi, quando ho deciso quanto dare ai campi percentuali, riduco la dimensione
          // da allargare/restringere che spalmo sui campi adattabili rimanenti
          var newPanWidth = this.ListWidth - (RD3_ServerParams.CompletePanelBorders ? this.RowSelWidth() : 0) + this.DeltaW;
          for (var i=0; i<n; i++)
          {
            var f = this.Fields[i];
            if (f.InList && f.ListList && f.Visible && !f.HiddenInList() && ((f.Page==-1 && giro==1) || f.Page==pa) &&
                f.PosDimPerc && f.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC] != -1)
            {
              var neww = Math.floor(newPanWidth * (f.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC]) / 100);
              var old = f.ListWidth;
              f.ListWidth = neww;
              //
              // Riduco il delta da applicare della quantita' che ho utilizzato per questo campo
              dw -= (neww-old);
            }
          }
          //
          while (dw!=0 && ancora)
          {
            ancora = false;
            var n = this.Fields.length;
            var j = -1;
            var i = this.LastResizedField+1;
            while (i!=j && dw!=0)
            {
              if (j==-1)
                j=this.LastResizedField+1;
              // 
              // Faccio ripartire anche j dall'inizio (NPQ 1263)
              if (j==n) j=0;
              //
              // Riparto dall'inizio se devo
              if (i==n) i=0;
              //
              var f = this.Fields[i];
              if (f.InList && f.ListList && f.Visible && !f.HiddenInList() && ((f.Page==-1 && giro==1) || f.Page==pa) && 
                  !(f.PosDimPerc && f.PosDimPerc[RD3_Glb.PFLDIM_LWIDTHPERC] != -1))   // Se il campo e' in percentuale, l'ho gia' gestito sopra... lo salto
              {
                var minw = (ex)?f.OrgListWidth:48;
                if (f.ListHResMode==RD3_Glb.RESMODE_STRETCH && (dw>0 || f.ListWidth>minw))
                {
                  // Puo' essere ridimensionato!
                  if (dw>0)
                  {
                    f.ListWidth++;
                    dw--;
                  }
                  else
                  {
                    f.ListWidth--;
                    dw++;
                  }
                  this.LastResizedField = i;
                  ancora = true;
                }
              }
              //
              i++; // Prossimo campo
              if (i==n) i=0;
            }
          }
        }
        //
        if (giro==1)
        {
          // Ho finito il primo giro, mi predispongo per il secondo
          if (pm==-1)
            break; // Secondo giro inutile
          //
          // Calcolo dimensione campi comuni e massima della pagina
          var n = this.Fields.length;
          for (var i=0; i<n; i++)
          {
            var f = this.Fields[i];
            if (f.ListList && f.Visible && !f.HiddenInList() && f.InList)
            {
              if (f.Page==-1 || f.Page==pm)
                max+=f.ListWidth;
              if (f.Page==-1)
                pc+=f.ListWidth;
            }
          }
        }
      }
      //
      // Invio eventi di resize dei campi in lista
      var listl = (RD3_Glb.IsMobile() ? this.ListLeft : this.RowSelWidth() + this.ListLeft);
      var n = this.Fields.length;
      for (var i=0; i<n; i++)
      {
        var f = this.Fields[i];
        if (this.AdvTabOrder)
          f = this.ListTabOrder[i];
        //
        if (f.ListList)
        {
          // Dopo aver messo a posto le dimensioni devo impostare anche il ListLeft
          f.ListLeft = listl;
          listl += f.ListWidth;
          //
          if (f.OldListWidth != f.ListWidth)
            var ev = new IDEvent("resize", f.Identifier, null, this.ResVisFld ? RD3_Glb.EVENT_ACTIVE : RD3_Glb.EVENT_SERVERSIDE, "list", f.ListWidth, f.ListHeight, f.ListLeft, f.ListTop);
        }
      }
    }    
  }
  //
  // Allineo i campi con valori aggregati sotto la lista
  if (!this.IsFluidPanel()) 
  {
    var n = this.Fields.length;
    for (var i = 0; i<n; i++)
    {
      var f = this.Fields[i];
      if (f.InList && f.AggregateOfField >= 0)
      {
        if (f.OffsetFromList == undefined)
          f.OffsetFromList = this.DynamicRows == 0 ? (f.ListTop - this.ListHeight - this.ListTop) : 8;
        f.SetListTop(this.ListTop + this.ListHeightRounded + f.OffsetFromList);
      }
    }
  }
  //
  this.LastListResizeW = this.Width;
  this.LastListResizeH = this.Height;
}


// ********************************************************************************
// Calcolo la pagina piu' grande
// ********************************************************************************
IDPanel.prototype.GetMaxPage = function()
{ 
  // Non ci sono pagine
  if (this.Pages.length==0)
    return -1;
  //
  // La calcolo veramente
  var m = 0;
  var p = 0;
  for (var i=0;i<this.Pages.length;i++)
  {
    var w = 0;
    for (var j=0;j<this.Fields.length;j++)
    {
      var f = this.Fields[j];
      if (f.Page==i && f.Visible && !f.HiddenInList() && f.ListList && f.InList)
        w+=f.ListWidth;
    }
    //
    if (w>m)
    {
      m=w;
      p=i;
    }
  }
  //
  return p;
}


// ********************************************************************************
// Aggiorna il visual style dei campi obbligatori (la caption potrebbe cambiare)
// ********************************************************************************
IDPanel.prototype.UpdateNotNullFields = function()
{
  if (this.Realizing)
    return;
  //
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    if (!f.Optional && !f.IsStatic())
      f.SetVisualStyle();
  }
}


// ********************************************************************************
// Evento di scrolling della lista interna del pannello (errore...)
// ********************************************************************************
IDPanel.prototype.OnScrollListList = function(ev)
{ 
  // Elimino effetto spostamento lista in IE
  if (RD3_Glb.IsIE() && !this.IsFluidPanel())
  {
    this.ListListBox.scrollTop = 0;
    this.ListListBox.scrollLeft = 0;
  }
  //
  // In alcuni casi lo scroll lo facciamo da codice e non dobbiamo togliere la cella
  if (this.IsFluidPanel() && !this.CodeScroll) 
  {
    // Una delle celle di edit e' aperta
    if (RD3_DDManager.OpenListFormCell && RD3_DDManager.OpenListFormCell.ParentField && RD3_DDManager.OpenListFormCell.ParentField.ParentPanel == this) {
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
    // In questo caso mi interessa sapere quando sono arrivato in fondo alla lista
    var isBottom = this.ListListBox.scrollTop + this.ListListBox.offsetHeight >= this.ListListBox.scrollHeight - 10;
    if (isBottom && this.NumRows < this.TotalRows) {
      this.OnMoreButton();
    }
  }
}


// ********************************************************************************
// Evento di scrolling della lista interna del pannello (errore...)
// ********************************************************************************
IDPanel.prototype.NoScroll = function(ev)
{ 
  var targetEl = ev.target ? ev.target : ev.srcElement;
  //
  // Elimino effetto spostamento strambo
  targetEl.scrollTop = 0;
  targetEl.scrollLeft = 0;
}


// ********************************************************************************
// Gestore del mouse down su uno degli elementi del pannello
// ********************************************************************************
IDPanel.prototype.OnMouseDownObj = function(evento, obj)
{ 
  var eve = (window.event)?window.event:evento;
  var obj = (window.event)?window.event.srcElement:evento.target;
  //
  // se ho trovato l'origine dell'evento ed e' uno dei pulsanti della toolbar invio l'evento di down al gestore corretto (perche' negli altri browser l'evento di mouse down non viene notificato..)
  if (obj && !RD3_Glb.IsIE() && (obj==this.TopButton || obj==this.PrevButton || obj==this.NextButton || obj==this.BottomButton || obj==this.SearchButton || obj==this.FindButton || obj==this.CancelButton
               || obj==this.FormListButton || obj==this.RefreshButton || obj==this.DelButton || obj==this.NewButton || obj==this.DuplButton
               || obj==this.SaveButton || obj==this.PrintButton || obj==this.CsvButton || obj==this.AttachButton || obj==this.GroupButton))
  {
    this.OnToolMouseUse(evento, "down");
  }
}

// ********************************************************************************
// Aggiornamento RowSelector
// ********************************************************************************
IDPanel.prototype.UpdateRowSel = function()
{
  // Se il pannello non ha campi... non c'e' niente da aggiornare...
  if (!this.Fields[0])
    return;
  //
  var n = this.NumRows;
  for (var i=0; i<n; i++)
  {
    if (!this.IsGrouped())
    {
      var v = this.Fields[0].PValues[this.ActualPosition+i];
      if (v)
        v.UpdateRowSel();
    }
    else
    {
      // Per selezionare i valori giusti devo prendere dall'array dei PVal quelli visibili
      var idx = this.GetRowIndex(i, RD3_Glb.PANEL_LIST);
      var v = this.Fields[0].PValues[v];
      //
      if (v)
        v.UpdateRowSel(i);
    }
  }
}

// *********************************************************
// Timer globale
// *********************************************************
IDPanel.prototype.Tick = function()
{
  // Se ho ancora campi da creare, li creo
  if (this.DelayedListUpdate)
  {
    // Forse ho finito
    this.DelayedListUpdate = false;
    //
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      // Se questo campo non e' ancora stato creato, lo creo ora
      var f = this.Fields[i];
      if (f.DelayedUpdate)
      {
        // Non ho finito
        this.DelayedListUpdate = true;
        //
        // Gestisco l'aggiornamento ritardato
        f.HandleDelayedUpdate();
        //
        // La prossima colonna nel prossimo Tick
        break;
      }
    }
  }
}


// *********************************************************
// E' arrivato un click a livello di frame
// *********************************************************
IDPanel.prototype.OnFrameClick = function(evento, dbl, btn, x, y, xb, yb, tget)
{
  // calcolo la colonna / riga alla quale e' avvenuto il click
  var row = -1;
  var col = -1;
  //
  var id = RD3_Glb.GetRD3ObjectId(tget);
  if (id == undefined)
    return;
  //
  // Ho cliccato su un campo...
  if (id.substr(0,4)=="fld:")
  {
    col = parseInt(id.substr(4),10);
    if (id.indexOf(":fv")>0)
      row = 0;
    if (id.indexOf(":lv")>0)
      row = parseInt(id.substr(id.indexOf(":lv")+3),10);
    //
    // Se il campo ha il watermark, glielo tolgo
    var cell = RD3_KBManager.GetCell(tget);
    if (cell)
     cell.RemoveWatermark();
  }
  //
  if (RD3_Glb.IsMobile()) {
    var _this = this;
    window.setTimeout(function () {
      var ev = new IDEvent("rawclk", _this.Identifier, evento, dbl ? _this.MouseDoubleClickEventDef : _this.MouseClickEventDef, dbl, btn, Math.floor(xb) + "-" + Math.floor(yb), Math.floor(x) + "-" + Math.floor(y), col, null, false, row);
    }, 10);
  }
  else
    var ev = new IDEvent("rawclk", this.Identifier, evento, dbl?this.MouseDoubleClickEventDef:this.MouseClickEventDef, dbl, btn, Math.floor(xb)+"-"+Math.floor(yb), Math.floor(x)+"-"+Math.floor(y), col, null, false, row);
}

// *********************************************************
// Imposta il tooltip
// *********************************************************
IDPanel.prototype.GetTooltip = function(tip, obj)
{
  // Guardiamo se e' un bottone della tooltbar di pannello
  var ok = false;
  if (obj == this.TopButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_PanelInizio);
    tip.SetText(RD3_ServerParams.PanelInizio);
    ok = true;
  }
  else if (obj == this.PrevButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_PanelPaginaPrec);
    tip.SetText(RD3_ServerParams.PanelPaginaPrec);
    ok = true;
  }
  else if (obj == this.NextButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_PanelPaginaSucc);
    tip.SetText(RD3_ServerParams.PanelPaginaSucc);
    ok = true;
  }
  else if (obj == this.BottomButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_PanelFine);
    tip.SetText(RD3_ServerParams.PanelFine);
    ok = true;
  }
  else if (obj == this.SearchButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipCerca);
    tip.SetText(RD3_ServerParams.TooltipCerca + RD3_KBManager.GetFKTip(RD3_ClientParams.FKEnterQBE));
    ok = true;
  }
  else if (obj == this.FindButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipTrova);
    tip.SetText(RD3_ServerParams.TooltipTrova + RD3_KBManager.GetFKTip(RD3_ClientParams.FKFindData));
    ok = true;
  }
  else if (obj == this.FormListButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipFormList);
    tip.SetText(RD3_ServerParams.TooltipFormList + RD3_KBManager.GetFKTip(RD3_ClientParams.FKFormList));
    ok = true;
  }
  else if (obj == this.CancelButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipCancel);
    tip.SetText(RD3_ServerParams.TooltipCancel + RD3_KBManager.GetFKTip(RD3_ClientParams.FKCancel));
    ok = true;
  }
  else if (obj == this.RefreshButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipRefresh);
    tip.SetText(RD3_ServerParams.TooltipRefresh + RD3_KBManager.GetFKTip(RD3_ClientParams.FKRefresh));
    ok = true;
  }
  else if (obj == this.DelButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipDelete);
    tip.SetText(RD3_ServerParams.TooltipDelete + RD3_KBManager.GetFKTip(RD3_ClientParams.FKDelete));
    ok = true;
  }
  else if (obj == this.NewButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipInsert);
    tip.SetText(RD3_ServerParams.TooltipInsert + RD3_KBManager.GetFKTip(RD3_ClientParams.FKInsert));
    ok = true;
  }
  else if (obj == this.DuplButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipDuplicate);
    tip.SetText(RD3_ServerParams.TooltipDuplicate + RD3_KBManager.GetFKTip(RD3_ClientParams.FKDuplicate));
    ok = true;
  }
  else if (obj == this.SaveButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipUpdate);
    tip.SetText(RD3_ServerParams.TooltipUpdate + RD3_KBManager.GetFKTip(RD3_ClientParams.FKUpdate));
    ok = true;
  }
  else if (obj == this.PrintButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_Print);
    tip.SetText(RD3_ServerParams.Print + RD3_KBManager.GetFKTip(RD3_ClientParams.FKPrint));
    ok = true;
  }
  else if (obj == this.CsvButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipExport);
    tip.SetText(RD3_ServerParams.TooltipExport);
    ok = true;
  }
  else if (obj == this.AttachButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_ComandoAllegati);
    tip.SetText(RD3_ServerParams.ComandoAllegati);
    ok = true;
  }
  else if (obj == this.GroupButton)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_ComandoGruppi);
    tip.SetText(RD3_ServerParams.ComandoGruppi);
    ok = true;
  }
  else // Comando custom
  {
    var a = RD3_DesktopManager.WebEntryPoint.CustomCommands;
    var n = a.length;
    for (var i=0; i<n; i++)
    {
      if (obj == this.CustomButtons[i])
      {
        tip.SetTitle(a[i].Caption);
        tip.SetText(a[i].Tooltip + RD3_KBManager.GetFKTip(a[i].FKNum));
        ok = true;
        break;
      }
    }
  }
  //
  if (obj == this.ToggleMultiSelCmd)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipRowSel);
    if (RD3_ServerParams.CompletePanelBorders && this.ShowMultipleSel)
      tip.SetText(RD3_ServerParams.TooltipMultipleCommandset + RD3_KBManager.GetFKTip(RD3_ClientParams.FKSelTog));
    else
      tip.SetText((this.ShowMultipleSel)?RD3_ServerParams.TooltipShowRowSel:RD3_ServerParams.TooltipShowCheck) + RD3_KBManager.GetFKTip(RD3_ClientParams.FKSelTog);
    ok = true;
  }
  else if (obj == this.MultiSelectAllCmd)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipSelectAll);
    tip.SetText(RD3_ServerParams.TooltipSelectAll + RD3_KBManager.GetFKTip(RD3_ClientParams.FKSelAll));
    ok = true;
  }
  else if (obj == this.MultiSelectNoneCmd)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipDeseleziona);
    tip.SetText(RD3_ServerParams.TooltipDeseleziona + RD3_KBManager.GetFKTip(RD3_ClientParams.FKSelNone));
    ok = true;
  }
  //
  if (ok)
  {
    // Di default i bottoni di pannello mostrano il tooltip centrato sopra di essi
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + ((obj.offsetWidth-4)/2), RD3_Glb.GetScreenTop(obj));
    tip.SetPosition(0);
    return true;
  }
  else
    return WebFrame.prototype.GetTooltip.call(this, tip, obj);
}


// ********************************************************************************
// Metodo chiamato quando deve essere modificato il layout della lista:
// sourcefield e' il field tirato o modificato
// targetfield e' il field su cui eseguire il drop
// ********************************************************************************
IDPanel.prototype.ChangeListConfiguration = function(sourcefield, targetfield, evento)
{
  // Non devo fare nulla se:
  // - e' lo stesso campo
  // - il campo source e' quello subito prima di target
  if (sourcefield == targetfield)
    return;
  //
  var i, n;
  if (this.AdvTabOrder)
  {
    if (sourcefield.ListTabOrder == targetfield.ListTabOrder-1)
      return;
  }
  else
  {
    // Devo andare a cercare i campi nell'array dei pfield.. non posso usare l'index perche' se il Tab order non e' avanzato
    // riordino i campi nell'array ma non tocco i loro index..
    var srcidx = -1;
    var taridx = -1;
    //
    n = this.Fields.length;
    for (i = 0; i<n; i++)
    {
      if (this.Fields[i]==sourcefield)
        srcidx = i;
      if (this.Fields[i]==targetfield)
        taridx = i;
    }
    //
    // Esco se non trovo uno dei due campi oppure sono successivi..
    if (srcidx==-1 || taridx==-1 || srcidx==taridx-1)
      return;
  }
  // Gestione gruppi: se i due campi appartengono allo stesso gruppo non c'e' bisogno di fare nulla, altrimenti:
  // - se il campo di destinazione appartiene ad un gruppo applichiamo il drop al primo campo del gruppo (quindi spostiamo il campo trascinato prima del gruppo di destinazione)
  // - se il campo trascinato appartiene ad un gruppo dobbiamo trascinare tutti i campi del gruppo sul campo di destinazione (così spostiamo l'intero gruppo e non lo spezziamo)
  // Lo faccio solo se il gruppo trascinato/destinazione e' visibile (ListHeaderPost != 1)
  if (targetfield.Group && targetfield.Group.ListHeaderPos!=1 && sourcefield.Group !== targetfield.Group) 
  { 
    // Ho trascinato un campo non gruppato o appartenente ad un altro gruppo su un campo di un gruppo: devo prendere il primo campo appartenente al gruppo e considerare quello il 
    // campo di destinazione
    n = this.Fields.length;
    for (i=0; i<n; i++)
    {
      var fg = this.Fields[i];
      if (this.AdvTabOrder)
        fg = this.ListTabOrder[i];
      if (fg.Group == targetfield.Group) {
          targetfield = fg;
          break; 
      }
    }  
  }
  //
  var srcList = [];
  if (sourcefield.Group && sourcefield.Group.ListHeaderPos!=1 && sourcefield.Group !== targetfield.Group) 
  {
    // Se ho trascinato un campo appartenente ad un gruppo su un campo senza gruppo o con un gruppo differente devo 
    // trascinare l'intero gruppo: popolo un array con i campi del gruppo nell'ordine giusto e poi applico il riordinamento
    // su tutti loro
    n = this.Fields.length;
    for (i=0; i<n; i++)
    {
      var fg = this.Fields[i];
      if (this.AdvTabOrder)
        fg = this.ListTabOrder[i];
      if (fg.Group == sourcefield.Group)
          srcList.push(fg);
    }  
  }
  else
    srcList.push(sourcefield);
  //
  for (i = 0; i<srcList.length; i++) 
  {
    // Creo l'evento (che si aggiunge all'elenco se deve)
    var ev = new IDEvent("rdcol", this.Identifier, evento, RD3_Glb.EVENT_ACTIVE, "", srcList[i].Identifier, targetfield.Identifier);
    this.ReorderList(srcList[i], targetfield); 
  }
  //
  // Ora faccio il ricalcolo del layout lato client
  if (srcList.length > 0) {
    this.CalcListLayout(false);
    if (this.IsGrouped() && this.PanelMode==RD3_Glb.PANEL_LIST)
      this.CalcListGroupLayout();
  }
}

// ********************************************************************************
// Chiamato quando la un campo e' droppato su di un altro: riordina la lista
// di conseguenza
// ********************************************************************************
IDPanel.prototype.ReorderList = function(sourcefield, targetfield)
{
  // Se non sono realizzato non faccio nulla..
  if (!this.Realized || !this.CanReorderColumn)
    return;
  //
  var oldidx = -1;
  var newidx = -1;
  //
  if (this.AdvTabOrder)
  {
    // Tolgo il campo tirato dall'array del taborder
    var n  = this.ListTabOrder.length;
    for (var i = 0; i<n; i++)
    {
      if (sourcefield == this.ListTabOrder[i])
      {
        this.ListTabOrder.splice(i, 1);
        oldidx = i+1;
        break;
      }
    }
    //
    // Adesso rimetto a posto la lista: inserisco il campo tirato prima di quello di destinazione
    n  = this.ListTabOrder.length;
    for (var i = 0; i<n; i++)
    {
      if (targetfield == this.ListTabOrder[i])
      {
        this.ListTabOrder.splice(i, 1, sourcefield, targetfield);
        newidx = i+1;
        break;
      }
    }
    //
    // Adesso devo rimettere a posto gli indici dei tabOrder nei campi
    n  = this.ListTabOrder.length;
    for (var i = 0; i<n; i++)
    {
      this.ListTabOrder[i].ListTabOrder = i;
    }
  }
  else
  {
    // Tolgo il campo tirato dall'array dei campi
    var listFields = this.Fields.slice();
    var n  = listFields.length;
    for (var i = 0; i < n; i++)
    {
      if (sourcefield == listFields[i])
      {
        listFields.splice(i, 1);
        oldidx = i+1;
        break;
      }
    }
    //
    // Adesso rimetto a posto la lista: inserisco il campo tirato prima di quello di destinazione
    n  = listFields.length;
    for (var i = 0; i < n; i++)
    {
      if (targetfield == listFields[i])
      {
        listFields.splice(i, 1, sourcefield, targetfield);
        newidx = i+1;
        break;
      }
    }
    //
    // Attivo il tabOrder avanzato
    n  = listFields.length;
    for (var i = 0; i < n; i++)
    {
      this.Fields[i].FormTabOrder = i;
      listFields[i].ListTabOrder = i;
    }
    //
    this.AdvTabOrder = true;
    this.CompileFieldList();
  }
  //
  // Se ho le fixed columns devo verificare se ho tirato il campo dentro l'area fissa o fuori..
  if (this.FixedColumns!=0 && oldidx>=0 && newidx>=0)
  {
    // Ho tirato una colonna dell'area fissa
    if (oldidx<=this.FixedColumns)
    {
      // Ho tirato la colonna dall'area fissa all'area scrollabile?
      if (newidx>this.FixedColumns)
      {
        // Allora diminuisco di uno l'area fissa.. (minimo 1)
        this.FixedColumns = this.FixedColumns>1 ? this.FixedColumns-1 : this.FixedColumns;
      }
    }
    else  // Ho tirato una colonna dell'area scrollabile
    {
      // Ho tirato la colonna nell'area fissa?
      if (newidx<=this.FixedColumns)
      {
        // Allora aumento di 1 le colonne fisse (massimo numero di colonne -1)
        this.FixedColumns = this.FixedColumns>=this.Fields.length-1 ? this.FixedColumns : this.FixedColumns+1;
      }
    }
  }
  //
  // Adesso devo ricalcolare i ListLeft dei campi ListList, serve per gestire correttamente lo scroll orizzontale della lista 
  // quando un campo spostato prende il fuoco
  var ll = 0;
  var nf = this.Fields.length;
  for (var i = 0; i < nf; i++)
  {
    var f = this.Fields[i];
    //
    if (this.AdvTabOrder)
      f = this.ListTabOrder[i];
    //
    if (f.InList && f.ListList && f.IsVisible())
    {
      f.ListLeft = ll;
      f.PGroupListLeft = ll;
      ll += f.ListWidth;
    }
  } 
}


// ********************************************************************************
// Su quali celle e' possibile droppare?
// ********************************************************************************
IDPanel.prototype.ComputeDropList = function(list,dragobj)
{
  // Se non sono stato realizzato... o non posso... niente DropList
  if (!this.Realized)
    return;
  //
  // Anch'io voglio essere droppabile...
  // Controllo prima dei campi perche' la drop list viene poi analizzata al contrario
  // Se non e' attivo il Drop non aggiungo
  if (!this.CanDrop && !this.CanReorderColumn)
    return;
  //
  // Se e' un D&D di un PField ed il pannello ammette il riordino delle colonne
  // non aggiungo me stesso... dato che non posso tirare una colonna sul pannello
  var isColDD = (this.CanReorderColumn && (dragobj instanceof PField));
  if (!isColDD)
    list.push(this);
  //
  // Calcolo le coordinate assolute...
  var o = this.ContentBox;
  this.AbsLeft = RD3_Glb.GetScreenLeft(o,true);
  this.AbsTop = RD3_Glb.GetScreenTop(o,true);
  if (!RD3_Glb.IsIE())
  {
    // Sugli altri browser devo tenere conto della scrollbar...
    this.AbsLeft -= this.ContentBox.scrollLeft;
    this.AbsTop -= this.ContentBox.scrollTop;
  }
  //
  this.AbsRight = this.AbsLeft + o.offsetWidth - 1;
  this.AbsBottom = this.AbsTop + o.offsetHeight - 1;
  //
  // Giro su tutti i campi e lo chiedo a loro
  var n = this.Fields.length;
  for (var i=0; i<n; i++)
  {
    var f = this.Fields[i];
    f.ComputeDropList(list,dragobj);
  }
}


// ***************************************************************************************
// Restituisce il numero di righe totali del pannello, tenendo conto della gestione dei 
// gruppi
// ***************************************************************************************
IDPanel.prototype.GetTotalRows = function()
{
  if (this.ListGroupRoot==null || this.PanelMode==RD3_Glb.PANEL_FORM || this.Status==RD3_Glb.PS_QBE)
    return this.TotalRows;
  //
  return this.ListGroupRoot.GetNumRows();
}


// ***************************************************************************************
// Ritorna true se il pannello ha i raggruppamenti attivi e li sta mostrando
// ***************************************************************************************
IDPanel.prototype.IsGrouped = function()
{
  return this.ListGroupRoot!=null;
}


// ******************************************************************************************************
// Restituisce l'indice nell'array dei PValues relativo alla riga specificata del pannello
// nrow, da 0 a visibleRow-1
// layout : layout di cui si desidera sapere l'indice, se undefined viene preso quello del pannello
// act: actual position, se null si prende quella del pannello
// *******************************************************************************************************
IDPanel.prototype.GetRowIndex = function(nrow, layout, act)
{
  if (!this.IsGrouped())
    return this.ActualPosition + nrow;
  //
  if (layout==undefined||layout==null)
    layout = this.PanelMode;
  //
  if (layout == RD3_Glb.PANEL_LIST)
  {
    if (act==undefined||act==null||act==this.ActualPosition)
      act = this.CompactActualPosition;
    else
      act = this.ListGroupRoot.GetRowPos(act);
    //  
    return this.ListGroupRoot.GetRowIndex(act, nrow);
  }
  //
  if (layout == RD3_Glb.PANEL_FORM)
  {
    if (act==undefined||act==null)
      act = this.ActualPosition;
    //
    var idx = act + nrow;
    return this.ListGroupRoot.GetPValOffset(idx) + idx;
  }
}


// *************************************************
// Dato un indice restituisce la riga visibile a cui si trova nel pannello,
// se e' fuori dal buffer video restituisce -1
// *************************************************
IDPanel.prototype.GetRowForIndex = function(idx)
{
  if (!this.IsGrouped())
    return -1;
  //
  var rw = this.ListGroupRoot.GetRowPos(idx, false);
  rw = rw - this.CompactActualPosition;
  //
  if (rw<0 || rw>this.NumRows)
    return -1;
  //
  return rw;
}


// *****************************************************
// Data una riga del buffer video (0<=row<=NumRows)
// restituisce l'index del PValue lato server
// ******************************************************
IDPanel.prototype.GetServerIndex = function(row)
{
  if (!this.IsGrouped())
    return -1;
  //
  return this.ListGroupRoot.GetServerIndex(this.CompactActualPosition+row, true);
}


// ********************************************************
//  Restituisce true se la la riga selezionata da actpos e row
// e' una nuova riga, sia in visione reale che gruppata 
// (in visione gruppata va passata la riga reale, senza fare
// conversioni)
// ********************************************************
IDPanel.prototype.IsNewRow = function(actpos, row)
{
  if (!this.IsGrouped())
    return actpos+row > this.TotalRows;
  //
  // Passo in modalita' gruppata: scopro a quale Index corrisponde la riga selezionata, se e' maggiore di TotalRows sono in una nuova riga
  return this.GetServerIndex(row)>this.TotalRows;
}


// *****************************************************
// Data una riga del buffer video restituisce -1
// se e' un header di gruppo oppure l'indice della riga reale
// ******************************************************
IDPanel.prototype.IsHeader = function(row)
{
  return this.ListGroupRoot.IsHeader(this.CompactActualPosition+row);
}


// *****************************************************
// Ridimensiono correttamente la label dei gruppi
// ******************************************************
IDPanel.prototype.CalcListGroupLayout = function()
{
  var f = this.GetFirstListField();
  //
  f.setPListGroupPosition();
}


// *****************************************************
// Una cella ha preso o perso il fuoco..
// ******************************************************
IDPanel.prototype.FieldFocus = function(fldidx, getfocus)
{
  var ev = new IDEvent("fev", this.Identifier , null, this.FocusEventDef, fldidx, getfocus ? "1" : "0", null, null, null, this.FocusEventDef==RD3_Glb.EVENT_ACTIVE ? 250 : null);
}

// *****************************************************
// De/Evidenzio le righe che sto per cancellare
// ******************************************************
IDPanel.prototype.DoHighlightDelete = function(highlight)
{
  // Se il pannello non vuole l'evidenziazione non faccio nulla
  if (!this.HighlightDelete)
    return;
  //
  // Caso mobile gestito in autonomia
  if (RD3_Glb.IsMobile())
  {
    var nsel = 0;
    if (this.ShowMultipleSel && this.MultiSelStatus)
    {
      for (var i=0;i<this.MultiSelStatus.length;i++)
      {
        if (this.MultiSelStatus[i])
          nsel++;
      }
    }
    if (this.PanelMode==RD3_Glb.PANEL_LIST && nsel==0)
      this.HiliteRow(highlight?this.ActualRow+1:0);
    return;
  }
  //
  // Se devo evidenziare
  if (highlight)
  {
    this.HLDelObjects = new Array();
    //
    // Se sono in lista
    if (this.PanelMode==RD3_Glb.PANEL_LIST)
    {
      // Se mostro la multiselezione
      var row = this.ActualPosition + (this.ShowMultipleSel ? 0 : this.ActualRow);
      var top = this.HeaderSize + this.VisStyle.GetHeaderOffset();
      do
      {
        var selr = (this.IsGrouped() ? this.IsHeader(row - 1) : row);
        if (!this.ShowMultipleSel || (selr !== -1 && this.MultiSelStatus[selr]))
        {
          var nr = (this.UseListQBE == RD3_Glb.PAN_QBEROW ? row + 1 : row);
          var hlObj = document.createElement("DIV");
          hlObj.className = "panel-highlight-delete";
          hlObj.style.top = (top -RD3_ClientParams.HLDBorderWidth/2) + ((nr - this.ActualPosition) * this.GetRowHeight()) + "px";
          hlObj.style.width = (this.ListListBox.offsetWidth - 2*RD3_ClientParams.HLDBorderWidth -1) + "px";
          hlObj.style.height = (this.GetRowHeight() - 2*RD3_ClientParams.HLDBorderWidth + RD3_ClientParams.HLDBorderWidth) + "px";
          this.ListListBox.appendChild(hlObj);
          this.HLDelObjects.push(hlObj);
        }
        row++;
      }
      while (this.ShowMultipleSel && row <= Math.min(this.NumRows, this.TotalRows))
    }
    else // Sono in form
    {
      var hlObj = document.createElement("DIV");
      hlObj.className = "panel-highlight-delete";
      hlObj.style.width = (this.FormBox.offsetWidth - 2*RD3_ClientParams.HLDBorderWidth) + "px";
      hlObj.style.height = (this.FormBox.offsetHeight - 2*RD3_ClientParams.HLDBorderWidth) + "px";
      this.FormBox.appendChild(hlObj);
      this.HLDelObjects.push(hlObj);
    }
  }
  else // Devo togliere l'evidenziazione
  {
    var par = (this.PanelMode==RD3_Glb.PANEL_LIST ? this.ListListBox : this.FormBox);
    while (this.HLDelObjects.length > 0)
      par.removeChild(this.HLDelObjects.pop());
    //
    this.HLDelObjects = undefined;
  }
}

// ********************************************************************************
// Evento di inizio tocco sul pannello
// ********************************************************************************
IDPanel.prototype.OnTouchStart = function(e)
{ 
  // Chiamo la classe base
  WebFrame.prototype.OnTouchStart.call(this, e);
  //
  // Inizio lo scrolling solo se uno un solo dito
  if (e.targetTouches.length != 1)
    return false;
  //
  // Per gli input non gestisco gli eventi touch perche' voglio che appaia la tastiera
  var ele = RD3_Glb.ElementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
  if (ele && ((ele.tagName=="INPUT" && ele.type != "button") || ele.tagName=="TEXTAREA" || RD3_Glb.isInsideEditor(ele)))
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
  this.HandleTouchEvent(e, "down");
  //
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
  this.TouchTimes  = new Array();
  this.TouchPosY   = new Array();
  this.TouchPosX   = new Array();
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  //
  this.TouchMoved  = this.TouchScrollTimerId>0; // Indica che il dito si e' mosso (se stavo scrollando, faccio finta che si sia mosso, cosi' non clicca)
  this.TouchScroll = false; // Indica che voglio scrollare il pannello
  this.TouchScrollArea = false; // Indica che sto strisciando nella scrollarea
  this.TouchMove   = false; // Indica che sto muovendo la "scrollbar" del pannello
  this.TouchList   = null;  // Il PValue su cui ho cliccato
  this.ClearTouchDiv();
  this.ClearTouchScrollTimer();
  if (this.ScrollBoxTouch)
    RD3_Glb.RemoveClass(this.ScrollBoxTouch, "panel-scroll-active");
  //
  // Posso cambiare layout solo se l'operazione non scrollerebbe il pannello
  var xo = this.WebForm.FramesBox;
  this.TouchChangeLayoutSX = this.PanelMode==RD3_Glb.PANEL_LIST && xo.scrollLeft+xo.clientWidth>=xo.scrollWidth;
  this.TouchChangeLayoutDX = this.PanelMode==RD3_Glb.PANEL_FORM && xo.scrollLeft==0;
  //
  // Se sono in lista, verifico se l'utente vuole scrollarla
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    if (ele)
    {
      if (ele==this.ScrollIntTouch || ele==this.ScrollBoxTouch)
      {
        this.TouchMove = true;
        RD3_Glb.AddClass(this.ScrollBoxTouch, "panel-scroll-active");
        this.MoveScrollTouch(e.targetTouches[0].clientY);
      }
      //
      // Recupero l'ID dell'oggetto (curato)
      var tid = this.GetTouchID(ele);
      //
      // e poi l'oggetto
      var obj = RD3_DDManager.GetObject(tid,true);
      if (obj instanceof PValue)
          this.TouchList = obj;
      //
      // Vediamo se questo oggetto e' nella scrollarea
      var o = ele;
      while (o)
      {
        if (o==this.ScrollAreaBox)
        {
          this.TouchScrollArea = true;
          break;
        }
        o = o.parentNode;
      }
    }
  }
  //
  return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
IDPanel.prototype.OnTouchMove = function(e)
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
    this.HandleTouchEvent(e, "move");
    this.TouchMoved = true;
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
  // Il ditino si e' mosso in orizzontale?
  var xod = (this.TouchStartX - this.TouchOrgX);
  var yod = (this.TouchStartY - this.TouchOrgY);
  //
  if (this.TouchMove)
  {
    this.MoveScrollTouch(e.targetTouches[0].clientY);
    this.FormScroll = false;
  }
  else if (Math.abs(yod)<40 && Math.abs(xod)>120 && this.FormListButton.style.display!="none" && !this.TouchScrollArea
           && ((xod>0 && this.TouchChangeLayoutDX) || (xod<0 && this.TouchChangeLayoutSX)))
  {
    this.TouchChangeLayoutDX = false;
    this.TouchChangeLayoutSX = false;
    //
    // Se sono in lista, cambio anche riga
    if (this.PanelMode==RD3_Glb.PANEL_LIST && this.TouchList)
    {
      // Ricalcolo l'elemento da evidenziare in base al punto medio in Y indicato dal ditino
      var ele = RD3_Glb.ElementFromPoint(e.targetTouches[0].clientX, (e.targetTouches[0].clientY+this.TouchOrgY)/2);
      if (ele)
      {
        // Recupero l'ID dell'oggetto (curato)
        var tid = this.GetTouchID(ele);
        //
        // e da quello recupero l'oggetto
        var obj = RD3_DDManager.GetObject(tid,true);
        //
        if (obj instanceof PValue)
          this.TouchList = obj;
      }
      //        
      this.ChangeActualRow(this.TouchList.Index-this.ActualPosition,true);
    }
    //
    this.FormListButton.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "") + "-down";
    window.setTimeout("document.getElementById('"+this.FormListButton.id+"').className = 'frame-toolbar-button" + ((this.SmallIcons)? "-small" : "")+"'",300);
    this.OnToolbarClick(e,"list");
    //
    this.FormScroll = false;
  }
  else if (this.TouchList && !RD3_DDManager.OpenCombo && Math.abs(yod)>5 && Math.abs(xod)<Math.abs(yod))
  {
    // Rilevo scrolling sulla lista del pannello
    // Per ora il touch div e' disabilitato!
    /*if (!this.TouchDiv)
    {
      // Creo e mostro lo scroll-artifact, in modo che sotto il dito
      this.TouchDiv = document.createElement("DIV");
      this.TouchDiv.className = "panel-scroll-artifact";
      this.ListListBox.appendChild(this.TouchDiv);
      this.TouchDiv.style.height = (this.GetRowHeight() - 2) + "px";
      this.TouchDiv.style.width = (this.ListListBox.offsetWidth - 3) + "px";
    }*/
    //
    if (this.TouchDiv)
      this.TouchDiv.style.top = (e.targetTouches[0].clientY-RD3_Glb.GetScreenTop(this.ListListBox)-this.GetRowHeight()/2) + "px";
    //
    RD3_TooltipManager.DeactivateAll();
    this.LastPositionTime=0;
    if (this.ScrollBox)
      this.ScrollBox.scrollTop -= yd;
    this.TouchScroll = true;
    this.UpdateScrollTouch();
    this.FormScroll = false;
  }
  else if (!RD3_DDManager.IsDragging && !RD3_DDManager.IsResizing)
  {
    // Se sono qui non sto muovendo la scrollbar del pannello, non sto scorrendo lungo la
    // lista in verticale e non sto cambiando layout. Allora posso spostare il formbox/listbox
    // se avessero bisogno delle scrollbar
    var oldx = this.ContentBox.scrollLeft;
    var oldy = this.ContentBox.scrollTop;
    if (this.Scrollbar == RD3_Glb.FORMSCROLL_HORIZ || this.Scrollbar == RD3_Glb.FORMSCROLL_BOTH)
      this.ContentBox.scrollLeft -= xd;
    if (this.Scrollbar == RD3_Glb.FORMSCROLL_VERT || this.Scrollbar == RD3_Glb.FORMSCROLL_BOTH)
      this.ContentBox.scrollTop -= yd;
    //
    // Non scrollo la form se ho appena scrollato il pannello in se
    // Non lo faccio nemmeno se il pannello non si puo' scrollare
    if (this.Scrollbar != RD3_Glb.FORMSCROLL_NONE)
      this.FormScroll = this.FormScroll && oldx==this.ContentBox.scrollLeft && oldy==this.ContentBox.scrollTop;
    else
      this.FormScroll = false;
  }
  //
  if (this.TouchScrollArea)
  {
    // Se sono qui sto muovendo la scrollarea in orizzontale (?)
    var oldx = this.ScrollAreaBox.scrollLeft;
    this.ScrollAreaBox.scrollLeft -= xd;
    //
    // non scrollo la form se ho appena scrollato la scrollarea
    this.FormScroll = this.FormScroll && oldx==this.ScrollAreaBox.scrollLeft;
  }
  //
  // Chiamo la classe base
  WebFrame.prototype.OnTouchMove.call(this, e);
  //
  return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
IDPanel.prototype.OnTouchEnd = function(e)
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
  this.ClearTouchDiv();
  //
  // Simulo il click se non mi ero mosso.
  if (!this.TouchMoved) 
  {
    this.HandleTouchEvent(e, "up");
  }
  else
  {
    // Mi sono mosso, se ero sulla lista, controllo la velocita'
    if (this.TouchScroll && this.TouchTimes.length==3)
    {
      var dt = this.TouchTimes[2]-this.TouchTimes[0];
      var dy = this.TouchPosY[0]-this.TouchPosY[2];
      if (new Date()-this.TouchTimes[2]<100 && dt>0)
      {
        var v = dy / dt;
        if (Math.abs(v)>0.3)
        {
          // Considero tre velocita' di scroll: bassa, media, alta
          // corrispondenti ad una riga ogni 15, 30, 45 ms
          var n = 1;
          if (Math.abs(v)>2.3)
            n = 3;
          else if (Math.abs(v)>1.3)            
            n = 2;
          //
          if (v<0)
            n = -n;
          //
          this.TouchScrollTimerId = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TouchScrollTimer', null, [" + n + ",0])", 50);
        }
      }
    }
    else if (!this.TouchScroll && this.TouchTimes.length==3 && !RD3_DDManager.IsDragging && !RD3_DDManager.IsResizing)
    {
      // Se stavo spostando il content box, verifico le velocita'
      var dt = this.TouchTimes[2]-this.TouchTimes[0];
      var dx = this.TouchPosX[0]-this.TouchPosX[2];
      var dy = this.TouchPosY[0]-this.TouchPosY[2];
      //
      // Se il pannello non ammette scrollbar orizzonali annullo il DX
      // Se il pannello non ammette scrollbar verticali annullo il DY
      if (this.Scrollbar != RD3_Glb.FORMSCROLL_HORIZ && this.Scrollbar != RD3_Glb.FORMSCROLL_BOTH)
        dx = 0;
      if (this.Scrollbar != RD3_Glb.FORMSCROLL_VERT && this.Scrollbar != RD3_Glb.FORMSCROLL_BOTH)
        dy = 0;
      //
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
  }
  //
  // Chiamo la classe base
  WebFrame.prototype.OnTouchEnd.call(this, e);
  //
  this.TouchStartX=-1;
  this.TouchStartY=-1;
  this.TouchMoved = false;
  this.TouchMove = false;
  if (this.ScrollBoxTouch)
    RD3_Glb.RemoveClass(this.ScrollBoxTouch, "panel-scroll-active");
  //
  return false;
}


// ********************************************************************************
// Gestisce lo scroll via touch del pannello.
// v e' la velocita' di scroll in ms, il segno indica la direzione
// n e' il numero di volte che e' stata eseguita la funzione
// ********************************************************************************
IDPanel.prototype.TouchScrollTimer = function(dummy, ap)
{ 
  // Caso scrolling lista
  if (ap.length==2)
  {
    // Scroll disabilitato!
    if (!this.TouchScroll)
      return;
    //
    var v = ap[0];
    var n = ap[1];
    //
    var yd = this.GetRowHeight() * v;
    //
    // scrolling di 1-3 riga
    this.LastPositionTime=0;
    var ancora = false;
    if (this.ScrollBox)
    {
      var old = this.ScrollBox.scrollTop;
      this.ScrollBox.scrollTop += yd;
      var ancora = this.ScrollBox.scrollTop!=old;
    }
    this.UpdateScrollTouch();
    //
    // Rallento
    if ((n==10 || n==20) && Math.abs(v)>1)
    {
      if (v<0)
        v++;
      else
        v--;
    }
    //
    if (n<40 && ancora)
    {
      var t = 50;
      if (n>30)
        t = 150+(n-30)*20;
      this.TouchScrollTimerId = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TouchScrollTimer', null, [" + v + ","+ (n+1) + "])", t);
    }
    else
    {
      this.TouchScrollTimerId = 0;
    }
  }
  //
  // Caso scrolling content box
  if (ap.length==3)
  {
    var vx = ap[0];
    var vy = ap[1];
    var n  = ap[2];
    //
    var ox = this.ContentBox.scrollLeft;
    var oy = this.ContentBox.scrollTop;
    this.ContentBox.scrollLeft += vx*10;
    this.ContentBox.scrollTop += vy*10;
    var ancora = this.ContentBox.scrollLeft!=ox || this.ContentBox.scrollTop!=oy;
    //
    if (n<40 && ancora)
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
IDPanel.prototype.ClearTouchScrollTimer = function()
{
  if (this.TouchScrollTimerId>0)
  {
    window.clearTimeout(this.TouchScrollTimerId);
    this.TouchScrollTimerId=0;
    this.TouchScroll=0;
  }
}


// ********************************************************************************
// Nasconde oggetto di scroll
// ********************************************************************************
IDPanel.prototype.ClearTouchDiv= function()
{
  if (this.TouchDiv)
  {
    this.ListListBox.removeChild(this.TouchDiv);
    this.TouchDiv = null;
  }
}


// ********************************************************************************
// Evento di inizio tocco sulle pagine di pannello. Gestisco solo click singolo
// ********************************************************************************
IDPanel.prototype.OnPageTouchStart = function(e)
{ 
  // Inizio lo scrolling solo se uno un solo dito
  if (e.targetTouches.length != 1)
    return false;
  //
  this.TouchStartX = e.targetTouches[0].clientX;
  this.TouchStartY = e.targetTouches[0].clientY;
  this.TouchOrgX   = e.targetTouches[0].clientX;
  this.TouchOrgY   = e.targetTouches[0].clientY;  
  this.TouchMoved = false;
  //
  e.preventDefault();
  //
  return false;
}


// ********************************************************************************
// Evento di movimento del ditino sulle pagine di pannello
// ********************************************************************************
IDPanel.prototype.OnPageTouchMove = function(e)
{ 
  this.TouchStartX = e.targetTouches[0].clientX;
  this.TouchStartY = e.targetTouches[0].clientY;
  if (Math.abs(this.TouchStartX-this.TouchOrgX)>RD3_ClientParams.TouchMoveLimit || Math.abs(this.TouchStartY-this.TouchOrgY)>RD3_ClientParams.TouchMoveLimit)
  {
    this.TouchMoved = true;
  }
  //
  e.preventDefault();
  //
  return false;
}


// ********************************************************************************
// Evento di movimento del ditino sulle pagine di pannello
// ********************************************************************************
IDPanel.prototype.OnPageTouchEnd = function(e)
{ 
  // Prevent the browser from doing its default thing (scroll, zoom)
  e.preventDefault();
  //
  // Stop tracking when the last finger is removed from this element
  if (e.targetTouches.length != 0 && e.changedTouches.length!=1)
    return false;
  //
  // Simulo il click se non mi ero mosso.
  if (!this.TouchMoved) 
  {
    var sx = e.changedTouches[0].clientX;
    var sy = e.changedTouches[0].clientY;
    //
    var theTarget = RD3_Glb.ElementFromPoint(sx, sy);
    if (theTarget)
    {
      RD3_Glb.TouchHL(theTarget,"panel-page-active");
      //      
      var theEvent = document.createEvent("MouseEvents");
      theEvent.initEvent("click", true, true, window, 1, sx, sy, sx, sy);
      theTarget.dispatchEvent(theEvent);
    }
  }    
  //
  return false;
}


// ********************************************************************************
// Gestione eventi touch di click
// ********************************************************************************
IDPanel.prototype.HandleTouchEvent = function(e, evtype)
{
  var sx = e.changedTouches[0].clientX;
  var sy = e.changedTouches[0].clientY;
  var doubletap = false;
  //
  // Vediamo se e' un singolo o doppio click
  if (evtype=="up")
  {
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
  }
  //
  var theTarget = RD3_Glb.ElementFromPoint(sx, sy);
  //
  // In alcuni casi cambio target (testo di radio, campo check, combo disabilitate)
  if (theTarget && theTarget.className == "book-span-radio-text")
    theTarget = theTarget.previousSibling;
  if (theTarget && theTarget.firstChild && theTarget.firstChild.className == "panel-value-check")
    theTarget = theTarget.firstChild;
  if (theTarget && theTarget.tagName=="SPAN" && theTarget.className == "combo-input")
    theTarget = theTarget.parentNode;    
  if (theTarget && theTarget.tagName=="IMG" && theTarget.className == "combo-img-dis")
    theTarget = theTarget.parentNode;    
  //
  if (evtype=="down")
    this.TouchObj = theTarget;
  //
  var obj = null;
  var canact = false;
  if (theTarget)
  {
    var iscap = theTarget.id.substr(-3)==":lc";
    var acttag = theTarget.tagName=="A" || theTarget.tagName=="INPUT";
    canact = (theTarget.tagName=="IMG" || acttag || iscap);
    //
    // Recupero l'ID dell'oggetto (curato)
    var tid = this.GetTouchID(theTarget);
    //
    // e da quello recupero l'oggetto
    obj = RD3_DDManager.GetObject(tid,true);
    //
    if (obj instanceof PField)
    {
      iscap = iscap && !obj.IsStatic();
      canact = obj.CanActivate || iscap;
    }
    if (obj instanceof PValue)
      canact = obj.ParentField.CanActivate;
    if (theTarget.className=="panel-value-activator" || theTarget.className=="combo-activator" || theTarget.className=="panel-blob-span")
      canact = true;
    if (acttag)
      canact = true;      
  }
  //
  if (evtype!="down" && this.TouchObj && this.TouchObj.id!="")
  {
    if (obj && obj.UseHL && obj.IsStatic())
      obj.OnMouseOutObj(e,theTarget);
    else
      RD3_Glb.TouchHL(this.TouchObj, "panel-field-down", false);
  }
  //
  if (canact)
  {
    // Illumino lo sfondo della caption per indicare che e' stata premuta
    if (theTarget.id!="")
    {
      if (evtype=="up")
      {
        if (obj && obj.UseHL && obj.IsStatic())
        {
          var zd = "RD3_DesktopManager.CallEventHandler('"+obj.Identifier+"', 'OnMouseDownObj', null, document.getElementById('"+theTarget.id+"'))";
          window.setTimeout(zd,10);
          //
          var zo = "RD3_DesktopManager.CallEventHandler('"+obj.Identifier+"', 'OnMouseOutObj', null, document.getElementById('"+theTarget.id+"'))";
          window.setTimeout(zo,RD3_ClientParams.TouchHLDelay);
        }
        else
          RD3_Glb.TouchHL(theTarget);
      }
      //
      // In caso di down, evidenzio solo se la lista non e' in fase di scrollamento
      // in tal caso infatti, essa verra' fermata.
      if (evtype=="down" && (this.TouchScrollTimerId==0 || this.TouchScrollTimerId==undefined))
      {
        // In caso di USE HL, occorre agire in modo diverso
        if (obj && obj.UseHL && obj.IsStatic())
          obj.OnMouseOverObj(e,theTarget);
        else
          RD3_Glb.TouchHL(theTarget, "panel-field-down", true, 0);
      }
    }
    //
    if (evtype=="up")
    {
      var theEvent = document.createEvent('MouseEvents');
      theEvent.initMouseEvent(doubletap?'dblclick':'click', true, true, window, 1, sx, sy, sx, sy);
      theTarget.dispatchEvent(theEvent);
    }
  }
  //
  // cambio riga alla fine, per non entrare in conflitto con gli eventi precedenti
  if (this.TouchList && evtype=="up")
  {
    if (doubletap)
      this.TouchList.OnDoubleClick(e);
    else
      this.ChangeActualRow(this.TouchList.Index-this.ActualPosition,true);
  }
}


// ********************************************************************************
// Ritorna l'ID dell'oggetto toccato (curato)
// ********************************************************************************
IDPanel.prototype.GetTouchID = function(theTarget)
{
  // Per la struttura delle combo disabilitate, posso andare a prendere l'ID
  // anche al livello superiore.
  var tid = theTarget.id;
  if (tid=="" && theTarget.tagName=="SPAN")
    tid = theTarget.parentNode.id;
  //
  // Se non trovo ancora l'ID scavo piu' profondamente
  var tt = theTarget;
  while (tt && tid=="")
  {
    tt = tt.parentNode;
    tid = tt.id;
  }  
  //
  return tid;
}


// *******************************************************************
// Evidenzia la riga indicata (da 1 a TotalRows)
// *******************************************************************
IDPanel.prototype.HiliteRow = function(nr) 
{
  if (!this.VisHiliteRow() && nr>0)
    return;
  //
  if (this.IsGrouped() && nr != 0)
    nr = this.GetRowForIndex(nr);
  else
    nr -= this.ActualPosition;
  this.HiliteRow2(this.LastHiliteRow,false);
  this.HiliteRow2(nr,true);
  this.LastHiliteRow = nr;
}

IDPanel.prototype.HiliteRow2 = function(nr, fl) 
{ 
  if (nr>=0 && nr<=this.NumRows)
  {
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      if (f.ListList && f.PListCells.length>nr)
        f.PListCells[nr].SetHilite(fl);
    }
  }
}


// *******************************************************************
// Gestisce animazione lista/form
// e anche bottone torna alla lista e search box
// *******************************************************************
IDPanel.prototype.OnFormListAni = function() 
{
  RD3_Glb.SetTransitionProperty(this.ListBox, "-webkit-transform");
  RD3_Glb.SetTransitionProperty(this.FormBox, "-webkit-transform");
  RD3_Glb.SetTransitionDuration(this.ListBox, "0ms");
  RD3_Glb.SetTransitionDuration(this.FormBox, "0ms");
  RD3_Glb.SetTransitionTimingFunction(this.ListBox, "ease");
  RD3_Glb.SetTransitionTimingFunction(this.FormBox, "ease");
  //
  if (this.PagesBox)
  {
    RD3_Glb.SetTransitionProperty(this.PagesBox, "-webkit-transform");
    RD3_Glb.SetTransitionDuration(this.PagesBox, "0ms");
    RD3_Glb.SetTransitionTimingFunction(this.PagesBox, "ease");
  }
  //
  RD3_Glb.SetTransitionDuration(this.SearchBox, "0ms");
  RD3_Glb.SetTransitionDuration(this.FormListButtonCnt, "0ms");
  //
  var ylist = RD3_Glb.TranslateY(this.ListBox);
  var yform = RD3_Glb.TranslateY(this.FormBox);
  //
  if (this.IDScroll)
    this.IDScroll.Enabled = false;
  //
  // Eseguo l'animazione in quattro step: 1, posiziono gli elementi, li rendo visibili, li animo e poi li nascondo
  var listini = 0;
  var listfin = 0;
  var formini = 0;
  var formfin = 0;
  var sbini   = 0;
  var flini   = 0;
  var sbfin   = 0;
  var flfin   = 0;
  var sbopini = 0;
  var flopini = 0;
  var sbopfin = 0;
  var flopfin = 0;
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    // Devo tornare in lista, la lista entra da sinistra
    listini = -this.ContentBox.offsetWidth;
    listfin = 0;
    formini = 0;
    formfin = this.ContentBox.offsetWidth;
    //
    // Search box entra da sinistra
    sbini = -200;
    sbopini = 0;
    flini = 0;
    flopini = 1;
    sbfin = 0;
    sbopfin = 1;
    flfin = 200;
    flopfin = 0;
  }
  else
  {
    // Devo andare in form, che entra da destra
    listini = 0;
    listfin = -this.ContentBox.offsetWidth;
    formini = this.ContentBox.offsetWidth;
    formfin = 0;
    //
    // Search box esce da destra
    sbini = 0;
    sbopini = 1;
    flini = 200;
    flopini = 0;
    sbfin = -200;
    sbopfin = 0;
    flfin = 0;
    flopfin = 1;
  }
  //
  // Posiziono gli elementi usando il 3d
  RD3_Glb.SetTransform(this.ListBox, "translate3d("+listini+"px,"+ylist+"px,0px)");
  RD3_Glb.SetTransform(this.FormBox, "translate3d("+formini+"px,"+yform+"px,0px)");
  if (this.PagesBox)
    RD3_Glb.SetTransform(this.PagesBox, "translate3d("+formini+"px,0px,0px)");
  if (!RD3_Glb.IsIE()) 
  {
    RD3_Glb.SetTransform(this.SearchBox, "translate3d("+sbini+"px,0px,0px)");
    RD3_Glb.SetTransform(this.FormListButtonCnt, "translate3d("+flini+"px,0px,0px)");
  }
  this.SearchBox.style.opacity=sbopini;
  this.FormListButtonCnt.style.opacity=flopini;
  //
  // Eseguo l'animazione
  var duration = RD3_Glb.IsIE() ? 400 : 250;
  var sc = "RD3_Glb.SetTransitionDuration(document.getElementById('" + this.ListBox.id + "'), '" + duration + "ms');";
  sc += "RD3_Glb.SetTransitionDuration(document.getElementById('" + this.FormBox.id + "'), '" + duration + "ms');";
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.ListBox.id+"'), 'translate3d("+listfin+"px,"+ylist+"px,0px)');";
  sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.FormBox.id+"'), 'translate3d("+formfin+"px,"+yform+"px,0px)');";
  if (this.PagesBox)
  {
    sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.PagesBox.id+"'), 'translate3d("+formfin+"px,0px,0px)');";
    sc += "RD3_Glb.SetTransitionDuration(document.getElementById('" + this.PagesBox.id + "'), '" + duration + "ms');";
  }
  //
  // Questa animazione multipla viene gestita male da IEMobile, in questo caso la saltiamo e li facciamo mostrare/nascondere direttamente alla fine
  if (!RD3_Glb.IsIE()) 
  {
    sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.SearchBox.id+"'), '250ms');";
    sc += "RD3_Glb.SetTransitionDuration(document.getElementById('"+ this.FormListButtonCnt.id+"'), '250ms');";  
    sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.SearchBox.id+"'), 'translate3d("+sbfin+"px,0px,0px)');";
    sc += "RD3_Glb.SetTransform(document.getElementById('"+ this.FormListButtonCnt.id+"'), 'translate3d("+flfin+"px,0px,0px)');";  
    sc += "document.getElementById('"+ this.SearchBox.id+"').style.opacity="+sbopfin+";";
    sc += "document.getElementById('"+ this.FormListButtonCnt.id+"').style.opacity="+flopfin+";";
  }
  //
  // IE BUG: gli eventi di endTransition scattano un po' quando pare loro... in questo caso lo facciamo scattare con un timer
  var _this = this;
  if (!RD3_Glb.IsIE())
    RD3_Glb.AddEndTransaction(this.ListBox, this.ea, false);
  else
    window.setTimeout(function () { _this.ea(); }, 830);
  //
  window.setTimeout(sc, RD3_Glb.IsIE() ? 400 : 30);
}


// *******************************************************************
// Gestisce animazione lista/form
// *******************************************************************
IDPanel.prototype.OnEndAnimation = function(ev) 
{  
  if (RD3_Glb.GetTransitionDuration(this.ListBox)=="0ms")
    return;
  if (this.IDScroll)
    this.IDScroll.Enabled = true;
  //
  this.AnimatingPanel = false;
  this.AnimatingToolbar = false;
  RD3_Glb.RemoveEndTransaction(this.ListBox, this.ea, false);
  this.ListBox.style.visibility = (this.PanelMode==RD3_Glb.PANEL_LIST)?"":"hidden";
  this.FormBox.style.visibility = (this.PanelMode==RD3_Glb.PANEL_LIST)?"hidden":"";
  RD3_Glb.SetTransitionProperty(this.ListBox, "");
  RD3_Glb.SetTransitionProperty(this.FormBox, "");
  RD3_Glb.SetTransitionDuration(this.ListBox, "");
  RD3_Glb.SetTransitionDuration(this.FormBox, "");
  RD3_Glb.SetTransitionDuration(this.SearchBox, "");
  RD3_Glb.SetTransitionDuration(this.FormListButtonCnt, "");
  //
  // Mostro i pulsanti che avevo nascosto durante l'animazione (su !IE viene fatto dall'animazione stessa)
  if (RD3_Glb.IsIE())
  {
    this.SearchBox.style.opacity = (this.PanelMode==RD3_Glb.PANEL_LIST ? 1 : 0);
    this.FormListButtonCnt.style.opacity = (this.PanelMode==RD3_Glb.PANEL_LIST ? 0 : 1);
  }
  //
  if (this.PagesBox)
  {
    this.PagesBox.style.visibility = (this.PanelMode==RD3_Glb.PANEL_LIST)?"hidden":"";  
    RD3_Glb.SetTransitionProperty(this.PagesBox, "");
    RD3_Glb.SetTransitionDuration(this.PagesBox, "");
  }
  //
  // Se c'e' lo scroll, imposto il box da scrollare
  if (this.IDScroll)
  {
    this.IDScroll.SetBox(this.PanelMode==RD3_Glb.PANEL_LIST?this.ListBox:this.FormBox);
    //
    // In Form imposto il TA della scrollbar al minimo altrimenti se clicco da qualche parte mi scrolla subito a dove ho cliccato
    // in list non devo farlo perche' c'e' la gestione gotop-cambio layout che fa tutto bene..
    if (this.PanelMode==RD3_Glb.PANEL_FORM)
      this.IDScroll.TA = new Array(this.IDScroll.Min[0], this.IDScroll.Min[1]);
  }
  //
  // Continuo con gli adattamenti
  this.AdaptLayout();
  this.ResetPosition = true;
  this.RefreshToolbar = true;
  this.AfterProcessResponse();
  //
  // Verifico se c'e' un ActiveElement che riguarda un PValue appartenente a me: se lo e' e riguarda il layout che ho spento lo annullo
  // Infatti nel caso mobile che gestisce meno il fuoco del desktop puo' capitare che l'activeelement rimanga impostato
  // ad un campo dlla lista quando invece il pannello e' gia' in form
  if (RD3_KBManager.ActiveElement)
  {
    var obj = RD3_KBManager.GetObject(RD3_KBManager.ActiveElement, true);
    //
    if (obj && obj instanceof PValue && obj.ParentField.ParentPanel==this)
    {
      // Come in RD3_KBManager.GetObject devo risalire la catena per cercare il primo oggetto con l'ID
      var objEl = RD3_KBManager.ActiveElement;
      while(!objEl.id && objEl.parentNode)
        objEl = objEl.parentNode;
      //
      var isList = objEl.id.indexOf(":lv")!=0;
      if ((this.PanelMode==RD3_Glb.PANEL_LIST && !isList) || (this.PanelMode!=RD3_Glb.PANEL_LIST && isList))
        RD3_KBManager.ActiveElement = null;
    }
  }
  //
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
    this.HiliteRow(0);
}


// *********************************************************************************
// Aggiorno le classi del primo e ultimo campo in form di questo gruppo
// *********************************************************************************
IDPanel.prototype.UpdateFieldClass = function(group)
{
  for (var layout=0; layout <=1; layout++)
  {
    var first = new Array();
    var last = new Array();
    //
    var n = this.Fields.length;
    for (var i=0; i<n; i++)
    {
      var f = this.Fields[i];
      //
      var considerField = false;
      if (layout == 0)
        considerField = f.InList && !f.ListList && f.PListCells && f.PListCells[0];
      else
        considerField = f.PFormCell && f.InForm;
      //
      if (considerField && f.Group == group && f.Visible)
      {
        if (first.length == 0)
          first.push(f);
        //
        if (last.length == 0)
          last.push(f);
        //
        var firstTop = (layout == 0 ? first[0].ListTop : first[0].FormTop );
        var lastTop = (layout == 0 ? last[0].ListTop : last[0].FormTop );
        var fieldTop = (layout == 0 ? f.ListTop : f.FormTop );
        //
        if (fieldTop < firstTop)
        {
          first.splice(0, first.length);
          first.push(f);
        }
        if (fieldTop == firstTop && first[0] != f)
          first.push(f);
        //
        if (fieldTop > lastTop)
        {
          last.splice(0, last.length);
          last.push(f);
        }
        if (fieldTop == lastTop && first[0] != f)
          last.push(f);
        //
        // Se un gruppo ha la classe la devo togliere, perche' non e' detto che la debba avere.. lo sapro' solo alla fine..
        if ((layout==0 && RD3_Glb.HasClass(f.ListCaptionBox, "first-group-field")) || (layout==1 && RD3_Glb.HasClass(f.FormCaptionBox, "first-group-field")))
        {
          RD3_Glb.RemoveClass((layout==0 ? f.ListCaptionBox : f.FormCaptionBox), "first-group-field");
          var obj = (layout==0 ? f.PListCells[0].IntCtrl : f.PFormCell.IntCtrl);
          if (obj instanceof IDCombo)
            obj = obj.ComboInput;
          RD3_Glb.RemoveClass(obj, "first-group-field");
        }
        //
        if ((layout==0 && RD3_Glb.HasClass(f.ListCaptionBox, "last-group-field")) || (layout==1 && RD3_Glb.HasClass(f.FormCaptionBox, "last-group-field")))
        {
          RD3_Glb.RemoveClass((layout==0 ? f.ListCaptionBox : f.FormCaptionBox), "last-group-field");
          var obj = (layout==0 ? f.PListCells[0].IntCtrl : f.PFormCell.IntCtrl);
          if (obj instanceof IDCombo)
            obj = obj.ComboInput;
          RD3_Glb.RemoveClass(obj, "last-group-field");
        }
      }
    }
    //
    if (first.length>0)
    {
      var ln = first.length;
      for(var i = 0; i < ln; i++)
      {
        var f = first[i];
        //
        RD3_Glb.AddClass((layout==0 ? f.ListCaptionBox : f.FormCaptionBox), "first-group-field");
        var obj = (layout==0 ? f.PListCells[0].IntCtrl : f.PFormCell.IntCtrl);
        if (obj instanceof IDCombo)
          obj = obj.ComboInput;
        if (obj instanceof IDEditor)
        {
          RD3_Glb.AddClass(obj.EditorObj, "last-group-field");
          RD3_Glb.AddClass(obj.TextObj, "last-group-field");
          obj = null;
        }
        //
        if (obj)
          RD3_Glb.AddClass(obj, "first-group-field");
      }
    }
    //
    if (last.length>0)
    {
      var ln = last.length;
      for(var i = 0; i < ln; i++)
      {
        var f = last[i];
        //
        RD3_Glb.AddClass((layout==0 ? f.ListCaptionBox : f.FormCaptionBox), "last-group-field");
        var obj = (layout==0 ? f.PListCells[0].IntCtrl : f.PFormCell.IntCtrl);
        if (obj instanceof IDCombo)
          obj = obj.ComboInput;
        if (obj instanceof IDEditor)
        {
          RD3_Glb.AddClass(obj.EditorObj, "last-group-field");
          RD3_Glb.AddClass(obj.TextObj, "last-group-field");
          obj = null;
        }
        //
        if (obj)
          RD3_Glb.AddClass(obj, "last-group-field");
      }
    }
  }
}


// ********************************************************************************
// Il pannello e' stato toccato dall'utente
// ********************************************************************************
IDPanel.prototype.OnTouchUp= function(evento, click)
{ 
  // Chiamo la classe base
  WebFrame.prototype.OnTouchUp.call(this, evento, click);
  //
  if (this.HilitedCombo)
    this.HilitedCombo.HiliteCombo(null, false);
  if (this.hilitedButton) {
    // Bottone abilitato, smetto di evidenziare
    var obj = this.PanelMode==RD3_Glb.PANEL_LIST ? this.hilitedButton.ListCaptionBox : this.hilitedButton.FormCaptionBox;
    RD3_Glb.RemoveClass(obj,"button-hover");
    //
    // Ci sono alcuni casi in cui arrivo qui senza l'old (ad esempio quando clicchi e fai lo swipe: idscroll chiama onTouchUp due volte, 
    // la prima con l'old - che viene messo a posto - la seconda senza) in quel caso se non ho un'immagine di sfondo da rimettere a posto non faccio nulla..
    if (obj.hasAttribute("OldBkgImage") || this.hilitedButton.Image != "")
    { 
      if (this.hilitedButton.VisShowActivator() && this.hilitedButton.IsButton())
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
      st = this.hilitedButton.Image != "" ? "" : st; 
      this.hilitedButton.ApplyBackgroundImage(obj.style, st);
    }
    delete this.hilitedButton;
  }
  //
  return true;
}


// ********************************************************************************
// Il pannello e' stato scrollato oltre l'ultima riga... ce ne sono altre?
// ********************************************************************************
IDPanel.prototype.OnScrollBottom= function()
{ 
  if (this.IsMyScroll() && (this.IDScroll && this.IDScroll.Enabled) && this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    if (this.LoadingPolicy==2)
      var ev = new IDEvent("more", this.Identifier, null, RD3_Glb.EVENT_ACTIVE);
    else
      this.WasToBottom = true;
  }
}


// ********************************************************************************
// Ho premuto il pulsante ancora righe... effettuo il caricamento
// ********************************************************************************
IDPanel.prototype.OnMoreButton= function()
{ 
  if (this.PanelMode==RD3_Glb.PANEL_LIST)
  {
    var ev = new IDEvent("more", this.Identifier, null, RD3_Glb.EVENT_ACTIVE);
    if (this.MoreButton)
      this.MoreButton.className = "panel-more-load";
    if (this.IDScroll)
      this.IDScroll.ResetSpeedData();
  }
}


// ********************************************************************************
// Ho scrollato fino in fondo... carico ancora righe?
// ********************************************************************************
IDPanel.prototype.OnEndScroll= function(d)
{ 
  if (d==1 && this.LoadingPolicy==1 && this.WasToBottom)
  {
    // Azzero i dati per la velocita' se no riparte lo scroll
    this.OnMoreButton();
  }
  this.WasToBottom = false;
}


// ********************************************************************************
// Inizia il pull to refresh
// ********************************************************************************
IDPanel.prototype.OnPullTrigger= function(active, dy, click, ev)
{ 
  var a = 180+dy*2;
  if (dy>0)
    a=180;
  if (dy<-90)
    a=0;
  //
  if (this.PullArrow.className!="pull-arrow")
    this.PullArrow.className = "pull-arrow";
  if (RD3_Glb.IsAndroid() && !RD3_Glb.IsAndroid(4,4,0))
    a = active?180:0;
  var rot = "rotateZ("+a+"deg)";
  if (RD3_Glb.GetTransform(this.PullArrow)!=rot)
    RD3_Glb.SetTransform(this.PullArrow, rot);
  var msg = active?ClientMessages.MOB_PULL_RELEASE:ClientMessages.MOB_PULL_TEXT;
  if (this.PullText.textContent!=msg)
    this.PullText.textContent = msg;
  RD3_Glb.SetClass(this.PullText,"pull-text-refresh",active && !click);
  if (active)
  {
    if (this.PullActiveTime==undefined)
      this.PullActiveTime = new Date();
  }
  else
    this.PullActiveTime = undefined;
  //
  // Eseguo refresh?
  if (click && active)
  {
    // Aspetto un po' per evitare pull incontrollati
    var ofs = new Date() - this.PullActiveTime;
    if (ofs>300)
    {
      this.OrgMarginTop = this.IDScroll.MarginTop;
      this.IDScroll.MarginTop = -this.PullAreaBox.offsetTop;
      this.IDScroll.Org[1]=0;
      this.OnToolbarClick(ev, "refresh");
      this.PullText.textContent = ClientMessages.MOB_PULL_REFRESH;
      this.PullArrow.className = "pull-arrow-refresh";
      RD3_Glb.SetTransform(this.PullArrow, "");
    }
  }
}


// ********************************************************************************
// Ho finito di usare la scrollbar mobile...
// ********************************************************************************
IDPanel.prototype.OnScrollMobileUp= function(ev)
{ 
  if (this.MobileScrollChanged)
    this.OnSearchChange(ev);
  this.MobileScrollChanged = false;
  this.ScrollBoxHint.style.opacity = 0;
  window.setTimeout("document.getElementById('"+this.Identifier+":sbh').style.display = ''",250);
  this.ScrollBoxMobile.className = "panel-scroll-container";
  RD3_Glb.StopEvent(ev);
  return false;
}

// ********************************************************************************
// Sto usando la scrollbar mobile...
// ********************************************************************************
IDPanel.prototype.OnScrollMobile= function(ev)
{ 
  var s = window.getComputedStyle(this.ScrollBoxMobile);
  //
  var ok = s.backgroundColor != "rgba(0, 0, 0, 0)";
  //
  // Android non gestisce bene lo stato Active; se il tocco e' sulla scrollbar lo faccio passare comunque ed imposto io lo sfondo
  if ((!ok && RD3_Glb.IsAndroid()) || RD3_Glb.IsIE(10, true))
  {
    ok = true;
    this.ScrollBoxMobile.className = "panel-scroll-container-active";
  }
  //
  if (ok)
  {
    var y = ev.clientY;
    if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
    {
      if (ev.targetTouches.length != 1)
        return false;
      y = ev.targetTouches[0].clientY;
    }
    //
    var oldv = this.SearchBox.value;
    var x = Math.floor((y - RD3_Glb.GetScreenTop(this.ScrollBoxMobile))*27 / this.ScrollBoxMobile.offsetHeight);
    if (x>=0 && x<=26)
    {
      if (x==0)
        this.SearchBox.value = "<A";
      else
        this.SearchBox.value = String.fromCharCode(x+64) + "*";
      if (this.SearchBox.value!=oldv)
      {
        if (RD3_ClientParams.MobileScrollbarOnTouchUp)
          this.MobileScrollChanged = true;
        else
          this.OnSearchChange(ev);
      }
      //
      this.ScrollBoxHint.textContent = (x==0)?"#":this.SearchBox.value;
      this.ScrollBoxHint.style.opacity = 1;
      this.ScrollBoxHint.style.display = "block";
      this.ScrollBoxHint.style.left = ((this.ContentBox.offsetWidth-this.ScrollBoxHint.offsetWidth)/2)+"px";
    }
    //
    RD3_Glb.StopEvent(ev);
  }
  return false;
}


// *******************************************************************************
// TOrna true se IDScroll e' attaccato al mio pannello adesso
// *******************************************************************************
IDPanel.prototype.IsMyScroll = function()
{
  return (this.IDScroll && (this.IDScroll.MyBox==this.FormBox || this.IDScroll.MyBox==this.ListBox))
}


// *******************************************************************************
// Sistema questo pannello per essere a posto come subframe
// *******************************************************************************
IDPanel.prototype.AdjustSubFrame = function(pf,pobj)
{
  if (!RD3_Glb.IsMobile())
    return;
  //
  // il primo e l'ultimo campo della lista devono avere i bordi arrotondati, se non c'e' la caption del pannello
  if (this.HasList && this.OnlyContent)
  {
    var ultimo = null;
    var primo = null;
    for (var i=0;i<this.Fields.length;i++)
    {
      var j = i;
      if (this.ListTabOrder!=null)
        j = this.ListTabOrder[i];
      var pf = this.Fields[j];
      if (pf.ListList)
      {
        if (primo==null)
          primo = pf;
        ultimo = pf;
      }
    }
    if (primo!=null && primo.ListCaptionBox && !RD3_Glb.IsMobile7())
      RD3_Glb.SetBorderTopLeftRadius(primo.ListCaptionBox, "8px");
    if (ultimo!=null && ultimo.ListCaptionBox && !RD3_Glb.IsMobile7())
      RD3_Glb.SetBorderTopRightRadius(ultimo.ListCaptionBox, "8px");
  }
}


// ********************************************************************************
// Gestore swipe su pannello
// ********************************************************************************
IDPanel.prototype.SetSwipe= function(attivo, campo, riga, evento)
{ 
  // Se sono un SubFrame e ho solo la ScrollVerticale blocco lo swipe: lo scroll orizzontale verra' gestito da mio padre
  if (this.IsSubObj() && this.MustReflectScrollToParent(0))
    return false;
  //
  if (attivo && this.CanDelete && !this.IsNewRow(this.ActualPosition, riga-1) && !this.ShowMultipleSel)
  {
    // Devo far apparire il bottone...
    if (!this.SwipeButton)
    {
      this.SwipeButton = document.createElement("div");
      this.SwipeButton.setAttribute("id", this.Identifier+":swipe");
      this.SwipeButton.className = "swipe-button" + (this.HasScrollbar ? " swipe-button-scrollbar" : "");
      this.SwipeButton.textContent = ClientMessages.MOB_SWIPE_TEXT;
      var f = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'delete')");
      if (RD3_Glb.IsTouch() && !RD3_Glb.IsIE(10, true))
        this.SwipeButton.ontouchend = f;
      else
        this.SwipeButton.onclick = f;
      this.ListListBox.appendChild(this.SwipeButton);
    }
    // Lo posiziono al centro della riga.
    var yt = campo.PListCells[riga-1].GetDOMObj().offsetTop + this.HeaderSize;
    var he = campo.PListCells[riga-1].GetDOMObj().offsetHeight;
    this.SwipeButton.style.display = "";
    this.SwipeButton.style.top = (yt + (he - this.SwipeButton.offsetHeight)/2)+"px";
    this.SwipeButton.style.width = "80px";
    //
    if (campo.PListCells[riga-1].Badge && campo.PListCells[riga-1].Badge != "")
      this.SwipeButton.style.right = "85px";
    campo.GotFocus((evento.target ? evento.target : evento.srcElement),evento);
  }
  //
  if (!attivo)
  {
    if (this.SwipeButton && this.SwipeButton.style.display=="")
    {
      this.SwipeButton.style.width = "";
      window.setTimeout("document.getElementById('"+this.SwipeButton.id+"').style.display='none'",250);
      return true;
    }
  }
}

// ********************************************************************************
// Nasconde o mostra i pulsanti di Back dell'albero nel caso mobile
// ********************************************************************************
IDPanel.prototype.ChangeExpose  = function(exposed)
{
  if (exposed && this.Realized)
  {
    this.UpdateToolbar();
  }
}


// *******************************************************************
// Chiamato quando cambia il colore di accento
// *******************************************************************
IDPanel.prototype.AccentColorChanged = function(reg, newc) 
{
  // Se c'e' una riga selezionata, ne modifico lo stile
  if (this.LastHiliteRow)
  {
    this.HiliteRow2(this.LastHiliteRow,true);
  }
}

// *****************************************************************
// Chiamata da Command.js quando un commando di toolbar si vuole 
// aggiungere al pannello; lo dobbiamo mettere nella zona giusta
// *****************************************************************
IDPanel.prototype.AppendCmsToToolbar = function(toolObj) 
{
  // Appendo il tool alla zona giusta
  var i = RD3_DesktopManager.WebEntryPoint.CommandZones[RD3_Glb.CZ_CMDSET];
  this.TBZones[i].appendChild(toolObj);
  //
  // Adesso devo verificare se la zona e' realmente nella toolbar (su IE7 devo usare parentElement, perche' parentNode non e' mai nullo ma e' il document..)
  var par = (RD3_Glb.IsIE(10, false) ? this.TBZones[i].parentElement : this.TBZones[i].parentNode);
  //
  if (par == null)
  {
    // Se non e' nella toolbar (perche' era vuota) la devo mettere.. per farlo ciclo avanti sulle zone fino a trovare la prima che appartiene alla toolbar..
    // poi mi metto prima di lei.. se ho finito le zone allora la appendo in fondo..
    for (var itz = i+1; itz < this.TBZones.length; itz++)
    {
      var parTz = (RD3_Glb.IsIE(10, false) ? this.TBZones[itz].parentElement : this.TBZones[itz].parentNode);
      //
      if (parTz != null)
      {
        parTz.insertBefore(this.TBZones[i], this.TBZones[itz]);
        break;
      }
    }
    //
    // Se e' ancora staccata allora la aggiungo in fondo
    par = (RD3_Glb.IsIE(10, false) ? this.TBZones[i].parentElement : this.TBZones[i].parentNode);
    //
    if (par == null)
      this.ToolbarBox.appendChild(this.TBZones[i]);
  }
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
IDPanel.prototype.OnAdaptRetina = function(w, h, par)
{
  if (par !== undefined && this.CustomButtons && this.CustomButtons[par])
  {
    var mob7 = RD3_Glb.IsMobile7();
    var usemask = !(RD3_Glb.IsAndroid() || RD3_Glb.IsIE()) || RD3_Glb.IsAndroid(4,4,0);
    //
    if (mob7 && usemask)
    {
      this.CustomButtons[par].style.webkitMaskSize = w + "px " + h +"px";
      this.CustomButtons[par].style.webkitMaskRepeat = "no-repeat";
    }
    else
    {
      this.CustomButtons[par].width = w;
      this.CustomButtons[par].height = h;
      //
      if (RD3_DesktopManager.WebEntryPoint.InResponse)
        this.RefreshToolbar = true;
      else
        this.UpdateToolbar();
    }
  }
  //
  WebFrame.prototype.OnAdaptRetina.call(this, w, h, par);
}


// *******************************************************************
// Gestisce l'invio al server del mouseOver
// *******************************************************************
IDPanel.prototype.HandleOnMouseOver = function(ev)
{
  var targetEl = ev.target;
  //
  // Primo controllo, se ho gia' un elemento in hover devo verificare che il target non sia suo figlio,
  // in quel caso non mi interessa gestirlo
  if (targetEl && this.MouseOverElement && RD3_Glb.IsNodeChildOf(this.MouseOverElement, targetEl))
    return;
  //
  // Se ho un timer di attivazione e l'elemento su cui sono e' diverso dal vecchio disattivo il timer, il mouseover sul vecchio elemento non mi serve
  if (this.MouseOverTimer && this.MouseOverElement != targetEl)
  {
    window.clearTimeout(this.MouseOverTimer);
    this.MouseOverTimer = null;
  }
  //
  // A questo punto devo verificare se l'elemento su cui sono mi interessa.
  // Mi interessa solo se:
  // -> e' una PCell, quindi risalgo  all'Id del padre e poi cerco l'oggetto di modello, se e' un PValue ho trovato il giusto
  var rd3Obj = RD3_Glb.GetParentRD3Object(targetEl);
  var modelObj = RD3_DDManager.GetObject(rd3Obj ? rd3Obj.id : "", true);
  if (modelObj && modelObj instanceof PValue) {
    this.MouseOverElement = rd3Obj;
    var _this = this;
    this.MouseOverTimer = window.setTimeout(function() {
      var id = _this.MouseOverElement.id;
      var row = id.indexOf(":lv") > 0 ? parseInt(id.substr(id.indexOf(":lv")+3,9999)) : 0;
      var ev = new IDEvent("moev", _this.Identifier, null, _this.MouseOverEventDef, modelObj.ParentField.Index, row);
    }, RD3_ClientParams.MouseOverDelay);
  }
}


// *******************************************************************
// Se il pannello deve mostrare la riga QBE in lista nello stato DATA
// torna il gap da applicare
// *******************************************************************
IDPanel.prototype.GetHeaderSearchOffset = function () 
{
  if (this.UseListQBE == RD3_Glb.PAN_QBEROW)
    return this.GetRowHeight();
  //
  return 0;
}

// *******************************************************************
// Torna TRUE se e' attiva la modalita' FixActiveRow while scrolling
// *******************************************************************
IDPanel.prototype.IsPanelFixActiveRowWhenScrolled = function () 
{
  // Se il parametro e' FALSE, allora non e' attivo
  if (!RD3_ServerParams.PanelFixActiveRowWhenScrolled)
    return false;
  //
  // Se e' mobile non e' attivo (anche se e' fluid panel, in quel caso non serve)
  if (RD3_Glb.IsMobile() || this.IsFluidPanel())
    return false;
  //
  // E' attivo
  return true;
}


// *******************************************************************
// Chiamato quando cambia il colore di accento
// *******************************************************************
IDPanel.prototype.ListVisibilityCtrlToggleClicked = function (ev, fld) 
{
  var pthis = this;
  //
  var backcontainer = document.createElement("DIV");
  backcontainer.className = "list-configurator-backdrop";
  var listContainer = document.createElement("DIV");
  listContainer.className = "list-configurator-container";
  backcontainer.appendChild(listContainer);
  //
  if (!RD3_Glb.IsMobile() && RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)
    backcontainer.style.zIndex = 15;
  //
  // Verifico se devo mostrare il popup di filtro (solo se il campo puo' cercare e sono in PAN_QBEHEADER)
  if (fld && !RD3_Glb.IsMobile() && (this.UseListQBE == RD3_Glb.PAN_QBEHEADER) && this.CanSearch && (fld.QBEEnabled && (fld.IdxPanel <= 0 || (fld.IdxPanel > 0 && (fld.AutoLookup || fld.LKE)))) && (fld.DataType != 10) && (this.Status == RD3_Glb.PS_DATA && !this.DOModified)) {
    var fFilter = document.createElement("DIV");
    fFilter.className = "list-configurator-field-line filter";
    fFilter.textContent = ClientMessages.LFIL_FILTER_CAPT;
    //
    fFilter.onclick = function (ev) {
      backcontainer.click();
      fld.OnClickFilterQBE(ev);
    }
    //
    listContainer.appendChild(fFilter);
  }
  // 
  // Verifico se devo mostrare anche i comandi di ordinamento (se il campo puo' ordinare)
  if (fld && !RD3_Glb.IsMobile() && (fld.CanSort && fld.VisCanSort())) {
    var fSortUp = document.createElement("DIV");
    fSortUp.className = "list-configurator-field-line sort_up";
    fSortUp.textContent = ClientMessages.LFIL_SORT_DESC;
    listContainer.appendChild(fSortUp);
    //
    var fSortDown = document.createElement("DIV");
    fSortDown.className = "list-configurator-field-line sort_down";
    fSortDown.textContent = ClientMessages.LFIL_SORT_ASC;
    listContainer.appendChild(fSortDown);
    //
    var fSortClear = document.createElement("DIV");
    fSortClear.className = "list-configurator-field-line sort_clear";
    fSortClear.textContent = ClientMessages.LFIL_SORT_CLEAR;
    listContainer.appendChild(fSortClear);
    //
    if (this.GroupingEnabled && this.ShowGroups) 
    {
      var fGroupUp = document.createElement("DIV");
      fGroupUp.className = "list-configurator-field-line group_up";
      fGroupUp.textContent = ClientMessages.LFIL_GROUP_LBL_D;
      listContainer.appendChild(fGroupUp);
      //
      var fGroupDown = document.createElement("DIV");
      fGroupDown.className = "list-configurator-field-line group_down";
      fGroupDown.textContent = ClientMessages.LFIL_GROUP_LBL;
      listContainer.appendChild(fGroupDown);
      //
      var fGroupClear = document.createElement("DIV");
      fGroupClear.className = "list-configurator-field-line group_clear";
      fGroupClear.textContent = ClientMessages.LFIL_DEGROUP_LBL;
      listContainer.appendChild(fGroupClear);
      //
      var groupFn = function (ev) {
        backcontainer.click();
        var ev = new IDEvent("clk", fld.Identifier, ev, fld.ClickEventDef, null, "cap");
        if (RD3_Glb.HasClass(this, "group_up"))
          ev.YPos = 1;
        else if (RD3_Glb.HasClass(this, "group_down"))
          ev.YPos = 30;
        else
          ev.YPos = 2;
        ev.ShiftPress = true;
      };
      fGroupUp.onclick = groupFn;
      fGroupDown.onclick = groupFn;
      fGroupClear.onclick = groupFn;
    }
    //
    var sortFn = function (ev) {
      backcontainer.click();
      var ev = new IDEvent("clk", fld.Identifier, ev, fld.ClickEventDef, null, "cap");
      if (RD3_Glb.HasClass(this, "sort_up"))
        ev.YPos = 20;
      else if (RD3_Glb.HasClass(this, "sort_down"))
        ev.YPos = 10;
      else 
        ev.CtrlPress = true;
      ev.ShiftPress = true;
    };
    fSortUp.onclick = sortFn;
    fSortDown.onclick = sortFn;
    fSortClear.onclick = sortFn;
  }
  //
  for (var i = 0; i < this.Fields.length; i++)
  {
    var f = this.Fields[i];
    if (this.AdvTabOrder)
      f = this.ListTabOrder[i];
    //
    if (f.InList && f.ListList && f.Visible && f.CanHideInList()) 
    {
      var fLine = document.createElement("DIV");
      fLine.className = "list-configurator-field-line" + (!f.HiddenInList() ? " inlist" : " notlist");
      //
      fLine.linkedField = f;
      fLine.textContent = f.ListHeader;
      //
      fLine.onclick = function (ev) {
        ev.stopPropagation();
        //
        // Se io sono visibile in lista e il primo elemento della lista e' uguale all'ultimo signifa che sono l'unico campo visibile della lista
        // in questo caso non mi posso nascondere perche' altrimenti non ci sarebbe modo di rimostrare altri campi
        if (!this.linkedField.HiddenInList() && this.linkedField.ParentPanel.GetFirstListField() == this.linkedField.ParentPanel.GetLastListField()) 
          return;
        //
        this.linkedField.SetVisualFlags((this.linkedField.VisualFlags & (~0x00002000)) | (!this.linkedField.HiddenInList() ? 0x00002000 : 0));
        RD3_Glb.RemoveClass2(this, "inlist");
        RD3_Glb.RemoveClass2(this, "notlist");
        RD3_Glb.AddClass(this, !this.linkedField.HiddenInList() ? " inlist" : " notlist");
        //
        var ev = new IDEvent("fldlistvis", this.linkedField.Identifier, null, RD3_Glb.EVENT_DEFERRED, this.linkedField.Identifier, (this.linkedField.HiddenInList() ? "-1" : "0"));
        //
        // Devo cercare se c'e' un campo aggregato e nascondere/mostrare anche quello
        var p = this.linkedField.ParentPanel;
        for (var ix = 0; ix < p.Fields.length; ix++)
        {
          var fx = p.Fields[ix];
          if (fx.InList && fx.AggregateOfField == this.linkedField.Index) 
          {
            fx.SetVisualFlags((fx.VisualFlags & (~0x00002000)) | (this.linkedField.HiddenInList() ? 0x00002000 : 0));
            var ev = new IDEvent("fldlistvis", fx.Identifier, null, RD3_Glb.EVENT_DEFERRED, fx.Identifier, (fx.HiddenInList() ? "-1" : "0"));
            break; 
          } 
        }
      }
      //
      listContainer.appendChild(fLine);
    }
  }
  //
  document.body.appendChild(backcontainer);
  //
  // Lo posiziono
  var rootEl = fld.ListCaptionBox;
  if (listContainer.offsetWidth >= rootEl.offsetWidth)
    listContainer.style.left = (RD3_Glb.GetScreenLeft(rootEl)) + "px";
  else
    listContainer.style.left = ev.clientX + "px";
  listContainer.style.top = (RD3_Glb.GetScreenTop(rootEl) + rootEl.offsetHeight) + "px";
  if (listContainer.offsetTop + listContainer.offsetHeight >= document.body.offsetHeight)
    listContainer.style.top = (listContainer.offsetTop - (listContainer.offsetTop + listContainer.offsetHeight - document.body.offsetHeight )) + "px";
  if (listContainer.offsetLeft + listContainer.offsetWidth >= document.body.offsetWidth)
    listContainer.style.left = (listContainer.offsetLeft - (listContainer.offsetLeft + listContainer.offsetWidth - document.body.offsetWidth + 4)) + "px";
  //
  listContainer.onclick = function (ev) { ev.stopPropagation(); };
  backcontainer.onclick = function () {
    this.parentNode.removeChild(this);
    //
    // Stacco i riferimenti agli oggetti javascript (evitiamo problemi di memoria)
    for (var cc = 0; cc < this.childNodes; cc++)
      delete this.childNodes[cc].linkedField;
    //
    // Aggiorno la lista con le nuove impostazioni
    pthis.SetActualPosition(undefined, undefined, pthis.ScrollToPos && !pthis.DenyScroll);
    pthis.AdaptLayout();
    pthis.ResetPosition = false;
    pthis.RecalcLayout = false;
    //
    // Mando al server le nuove impostazioni
    if (RD3_DesktopManager.MessagePump)
      RD3_DesktopManager.MessagePump.SendEvents();
  }
}

IDPanel.prototype.IsFluidPanel = function () 
{
  return this.FluidPanel && this.HasList;
}


/*
* Calcola i dati per configurare la lista fluida:
* - ad ogni campo assegna il suo order
* - calcola quante sottorighe ci sono in base ai campi che vanno a capo
* - calcola la larghezza minima delle righe in base alla larghezza dei campi
*/
IDPanel.prototype.CalcFluidRowGrid = function () 
{
  if (!this.IsFluidPanel())
    return;
  //
  var childIndex = 0;
  var n = this.Fields.length;
  var start =  1;
  var minRw = 0;
  var currentMinRw = 0;
  var currentListWidth = 0;
  var maxListWidth = 0;
  var hasBreak = false;
  //
  for (var i = 0; i < this.Fields.length; i++) {
    var f = this.AdvTabOrder ? this.ListTabOrder[i] : this.Fields[i];
    if (f.InList && f.ListList) {
      if (f.BreakRow) 
      {
        hasBreak = true;
        //
        // La prima riga contiene i row selector
        if (childIndex == 0 && this.ShowRowSelector)
          currentMinRw += 32;
        if (childIndex == 0 && this.ShowRowSelector)
          currentListWidth += 32;
        //
        childIndex++;
        //
        // Mi memorizzo la larghezza minima maggiore e riparto da 0; mi serve per fare in modo che tutte le subroe abbiano almeno 
        // la stessa larghezza minima
        if (currentMinRw > minRw)
          minRw = currentMinRw;
        if (currentListWidth > maxListWidth)
          maxListWidth = currentListWidth;
        currentMinRw = 0;
        currentListWidth = 0;
      }
      f.RowChildIndex = childIndex;
      f.Order = start;
      start++;
      //
      // Inremento la laghezza minima della riga:
      // se il campo e' fisso e' la larghezza del campo, altrimenti e' 50 (vedi CSS)
      currentMinRw += f.ListHResMode == RD3_Glb.RESMODE_STRETCH ? 50 : f.ListWidth;
      //
      // Devo ricalcolare la larghezza base della lista in base al break, 
      // utilizzando come larghezza reale la riga piu' lunga
      currentListWidth += f.ListWidth;
    }
  }
  //
  this.FluidRows = childIndex + 1;
  //
  if (hasBreak)
  {
    this.FluidMinRowWidth = minRw;
    // TODO: decidere il comportamento corretto, ritargliare la lista o lasciarla larga come a design time?
    //this.SetListWidth(maxListWidth);
  }
}


/*
* In base al delta del resize
* - allarga/restringe/riposiziona i campi fuori lista
* - allarga la lista
* - alza la lista
*/
IDPanel.prototype.ResizeFluidList = function () 
{
  var dw = this.DeltaW;
  var dh = this.DeltaH;
  var fw = this.ListLeft + this.ListWidth;
  var fh = this.ListTop + this.ListHeight;
  var ft = 0;
  //
  // questo flag indica solo estensione invece che adattamento dei campi
  var ex = this.WebForm.ResModeW == RD3_Glb.FRESMODE_EXTEND;
  var ey = this.WebForm.ResModeH == RD3_Glb.FRESMODE_EXTEND;
  //
  fw += this.RowSelWidth();
  var fwf = fw; // Bounding Box per i campi in lista ma fuori lista
  var fhf = fh;
  //
  // Calcolo il bounding box allo stato attuale
  var n = this.Fields.length;
  for (var i = 0; i < n; i++) 
  {
    var f = this.Fields[i];
    //
    if (f.ListList)
      f.OldListWidth = f.ListWidth;
    if (f.InList && !f.ListList) 
    {
      if (f.ListTop < ft)
        ft = f.ListTop;
      if (f.ListLeft + f.ListWidth > fwf)
        fwf = f.ListLeft + f.ListWidth;
      if (f.ListTop + f.ListHeight > fhf)
        fhf = f.ListTop + f.ListHeight;
    }
  }
  //
  var dwf = dw; // Delta relativi ai campi fuori lista
  var dhf = dh;
  fh = ft;
  //
  // Ridimensiono i campi come richiesto, tentando di togliere le scrollbar
  if ((this.ContentBox.clientWidth - dw) < fw && dw > 0) 
  {
    dw -= (fw - (this.ContentBox.clientWidth - dw));
    //
    // La videata e' cresciuta... e, in questo caso, non voglio che il pannello si riduca...
    // Se il crescere della videata non e' sufficiente a far sparire le scrollbar... forse
    // e' perche' la videata e' stata disegnata "cosi'"... e quindi le scrollbar devono rimanere!
    if (dw < 0)
      dw = 0;
  }
  if ((this.ContentBox.clientHeight - dh) < fh && dh > 0 && !this.Collapsed) 
  {
    dh -= (fh - (this.ContentBox.clientHeight - dh));
    //
    // La videata e' cresciuta... e, in questo caso, non voglio che il pannello si riduca...
    // Se il crescere della videata non e' sufficiente a far sparire le scrollbar... forse
    // e' perche' la videata e' stata disegnata "cosi'"... e quindi le scrollbar devono rimanere!
    if (dh < 0)
      dh = 0;
  }
  // Applico i calcoli di prima, pero' al bounding box per i campi fuori lista
  if ((this.ContentBox.clientWidth - dwf) < fwf && dwf > 0) 
  {
    dwf -= (fwf - (this.ContentBox.clientWidth - dwf));
    //
    if (dwf < 0)
      dwf = 0;
  }
  if ((this.ContentBox.clientHeight - dhf) < fhf && dhf > 0 && !this.Collapsed) 
  {
    dhf -= (fhf - (this.ContentBox.clientHeight - dhf));
    //
    if (dhf < 0)
      dhf = 0;
  }
  //
  // Ora ridimensiono i campi fuori lista
  if (dwf != 0 || dhf != 0) 
  {
    var n = this.Fields.length;
    for (var i = 0; i < n; i++) 
    {
      var f = this.Fields[i];
      if (f.InList && !f.ListList)
        f.ResizeList(dwf, dhf, ex, ey);
    }
  }
  //
  // Lavoro i campi in lista
  //
  // Il server per gestire le righe dinamiche modifica l'altezza della lista.
  // Pero' questo non va bene, perche' siccome non c'e' un limite la lista crescera' all'infinito
  // quindi non seguo il server ma reimposto l'altezza della lista come il minimo tra
  // - altezza del pannello
  // - posizione del primo campo fuori lista
  this.SetListHeight(this.ListHeight + dh);
  var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "height", this.ListHeight, 0);
  //
  // Infine ridimensiono i campi dentro la lista
  if (dw != 0) {
    if (this.HResMode == RD3_Glb.RESMODE_MOVE) 
    {
      this.SetListLeft(this.ListLeft + dw);
    }
    if (this.HResMode == RD3_Glb.RESMODE_STRETCH) 
    {
      this.SetListWidth(this.ListWidth + dw);
      //
      // In questo caso devo dire al server la nuova larghezza, in modo che a un F5 rimandi i dati giusti.
      // In RD3 normale non serve perche' viene ricalcolata ogni volta usando le lerghezze dei campi e sono quelle che vengono mandate al server e tornano indietro.
      // Nel caso fluido i campi adattabili fanno tutto da soli (si flexano) quindi il server non conosce la loro vera dimensione e non si puo' usare
      // per calcolare il bounding box della lista
      var ev = new IDEvent("resize", this.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "listwidth", this.ListWidth, 0);
    }
  }
  //
  // Allineo i campi con valori aggregati sotto la lista
  var n = this.Fields.length;
  for (var i = 0; i < n; i++) 
  {
    var f = this.Fields[i];
    if (f.InList && f.AggregateOfField >= 0) 
    {
      if (f.OffsetFromList == undefined)
        f.OffsetFromList = f.ListTop - this.ListHeight - this.ListTop;
      f.SetListTop(this.ListTop + this.ListHeightRounded + f.OffsetFromList);
    }
  }
  //
  this.LastListResizeW = this.Width;
  this.LastListResizeH = this.Height;
}


/* 
* - posiziona la lista (left/top)
* - posiziona i row selector e i comandi per gestire la multiselezione
* - posiziona i campi LISTLIST e imposta le loro dimensioni in base al tipo di resize
* - posiziona i campi SOMMA
*/
IDPanel.prototype.CalcFluidListLayout = function () 
{
  // Se non ha la lista, esco
  if (!this.ListBox)
    return;
  //
  var ll = this.ListLeft;
  //
  // Posiziono il list list container
  this.ListListBox.style.left = this.ListLeft + "px";
  this.ListListBox.style.top = this.ListTop + "px";
  //
  // Dico ai gruppi che sto ricalcolando il loro layout, inoltre
  // ne aggiorno la visibilita'
  var n = this.Groups.length;
  for (var i = 0; i < n; i++)
    this.Groups[i].ResetListPosition();
  //
  var n = this.Fields.length;
  //
  var d = (0); // offset dei campi all'interno del list container
  var t = (0); // posizione top dei campi
  var ft = 0; // memorizza la posizione top del primo campo, utile per posizionare i row sel
  var ncol = 0; // numero di colonne posizionate finora
  //
  for (var i = 0; i < n; i++) {
    var f = this.Fields[i];
    if (this.AdvTabOrder)
      f = this.ListTabOrder[i];
    //
    f.UpdateFieldVisibility();
    if (f.InList && f.ListList)
      f.SetFluidListListPosition();
  }
  //
  var ng = this.Groups.length;
  for (var i = 0; i < ng; i++)
    this.Groups[i].UpdateVisibility();
  //
  // Ricalcolo le dimensioni della griglia
  this.ListWidth = this.ContentBox.clientWidth - ll - 8;
  this.ListListBox.style.width = this.ListWidth+"px";
  //
  // Posiziono i rowselector
  if (this.RowSel) {
    if (this.UseListQBE == RD3_Glb.PAN_QBEROW && this.ListQBELCap) {
      var rc2 = new Rect(0, 0, this.RowSelWidth(), this.GetRowHeight());
      this.VisStyle.AdaptCaptionRect(rc2, true, true);
      //
      if (RD3_ServerParams.Theme.startsWith("zen")) {
        rc2.w += 2;
        if (!RD3_Glb.IsIE() && !RD3_Glb.IsChrome())
          rc2.h += 1;
      }
      //
      var s = this.ListQBELCap.style;
      s.flexBasis = rc2.w + "px";
      //s.height = rc2.h + "px";
      //
      s.paddingLeft = rc2.pxl + "px";
      s.paddingRight = rc2.pxr + "px";
      s.paddingTop = rc2.pyt + "px";
      s.paddingBottom = rc2.pyb + "px";
    }
    //
    for (var i = 0; i < this.NumRows; i++) {
      if (RD3_ServerParams.CompletePanelBorders) {
        var panbrd = this.VisStyle.GetBorders(1);
        var intbrd = this.VisStyle.GetBorders(2);
        //
        var rc = new Rect(0, (0 + ((RD3_Glb.IsTouch() && this.ShowMultipleSel) ? 2 : 0)), this.RowSelWidth(), this.GetRowHeight());
        this.VisStyle.AdaptCaptionRect(rc, true, true);
        //
        if (RD3_ServerParams.Theme.startsWith("zen")) {
          rc.w += 2;
          if (!RD3_Glb.IsChrome())
            rc.h += 1;
          if (RD3_Glb.IsIE(10, true))
            rc.h--;
        }
        //
        // Se il pannello ha il bordo verticale e l'intestazione no, la sposto
        if ((panbrd == 4 || panbrd == 3) && intbrd != 4 && intbrd != 3) {
          rc.x++;
          rc.w--;
          if (rc.x + rc.w == lstWidth - 4)
            rc.w--;
        }
        //
        // Se il pannello ha il bordo orizzontale e l'intestazione no, la sposto
        if ((panbrd == 4 || panbrd == 2) && intbrd != 4 && intbrd != 2) {
          rc.y++;
          rc.h--;
        }
        //
        // Se la lista ha bordo verticale devo recuperare un px di larghezza
        if (panbrd == 3)
          rc.w++;
        //
        // Su IE<10 devo centrare manualmente impostando i padding
        if (RD3_Glb.IsIE(10, false)) {
          rc.w = rc.w + rc.pxl + rc.pxr;
          rc.h = rc.h + rc.pyt + rc.pyb;
          rc.pxl = 0;
          rc.pxr = 0;
          rc.pyt = 0;
          rc.pyb = 0;
          //
          var dim = this.ShowMultipleSel ? 20 : 15;
          var midW = Math.floor((rc.w - dim) / 2);
          var midH = Math.floor((rc.h - dim) / 2);
          //
          if (midW > 0) {
            rc.pxl = midW;
            rc.pxr = midW;
            rc.w = rc.w - rc.pxl - rc.pxr;
          }
          if (midH > 0) {
            rc.pyt = midH;
            rc.pyb = midH;
            rc.h = rc.h - rc.pyt - rc.pyb;
          }
        }
        //
        var s = this.RowSel[i].style;
        s.flexBasis = rc.w + "px";
        //s.height = rc.h + "px";
        //s.lineHeight = rc.h + rc.pyt + rc.pyb + "px";
        //
        s.paddingLeft = rc.pxl + "px";
        s.paddingRight = rc.pxr + "px";
        s.paddingTop = rc.pyt + "px";
        s.paddingBottom = rc.pyb + "px";
      }
    }
  }
  //
  // Positiono i comandi della toolbar multisel
  var hlimit = RD3_ServerParams.CompletePanelBorders ? 0 : 32;
  var vis = this.HeaderSize >= hlimit && this.ShowRowSelector;
  //
  if (this.ToggleMultiSelBox) {
    var panbrd = this.VisStyle.GetBorders(1);
    var intbrd = this.VisStyle.GetBorders(2);
    //
    var rc = new Rect(ll, t + this.ListTop, this.RowSelWidth(), this.HeaderSize);
    this.VisStyle.AdaptCaptionRect(rc, true, true);
    //
    if (RD3_ServerParams.Theme.startsWith("zen")) {
      rc.w += 3;
      if (RD3_Glb.IsChrome())
        rc.h += 2;
      else if (!RD3_Glb.IsIE())
        rc.h += 1;
    }
    //
    // Se il pannello ha il bordo verticale e l'intestazione no, la sposto
    if ((panbrd == 4 || panbrd == 3) && intbrd != 4 && intbrd != 3) {
      rc.x++;
      rc.w--;
      if (rc.x + rc.w == lstWidth - 4)
        rc.w--;
    }
    //
    // Se il pannello ha il bordo orizzontale e l'intestazione no, la sposto
    if ((panbrd == 4 || panbrd == 2) && intbrd != 4 && intbrd != 2) {
      rc.y++;
      rc.h--;
    }
    //
    // Se la lista ha il bordo orizzontale o quadrato allora devo spostare la caption in basso di 1 px
    if (panbrd == 2 || panbrd == 4)
      rc.y++;
    //
    // Se la lista ha bordo verticale devo recuperare un px di larghezza
    if (panbrd == 3)
      rc.w++;
    //
    var s = this.ToggleMultiSelBox.style;
    s.flexBasis = rc.w + "px";
    //s.height = rc.h + "px";
    //s.lineHeight = rc.h + "px";
    //
    s.paddingLeft = rc.pxl + "px";
    s.paddingRight = rc.pxr + "px";
    s.paddingTop = rc.pyt + "px";
    s.paddingBottom = rc.pyb + "px";
    //
    s.display = vis ? "" : "none";
  }
  //
  if (this.ToggleMultiSelCmd) {
    if (RD3_ServerParams.CompletePanelBorders) {
      this.ToggleMultiSelCmd.style.position = "static";
      this.ToggleMultiSelCmd.style.paddingLeft = (RD3_ServerParams.Theme.startsWith("zen") ? 0 : rc.pxl) + "px";
    }
    else {
      this.ToggleMultiSelCmd.style.left = (this.ListLeft + (RD3_ServerParams.Theme.startsWith("zen") ? 9 : 5)) + "px";
      this.ToggleMultiSelCmd.style.top = this.ListTop + "px";
      this.ToggleMultiSelCmd.style.visibility = vis ? "" : "hidden";
      //
      if (RD3_ServerParams.Theme.startsWith("zen")) {
        this.ToggleMultiSelCmd.style.position = "absolute";
        this.ToggleMultiSelCmd.style.width = "12px";
        this.ToggleMultiSelCmd.style.height = "12px";
      }
    }
  }
  if (this.MultiSelectAllCmd) {
    this.MultiSelectAllCmd.style.left = (this.ListLeft + (RD3_ServerParams.Theme.startsWith("zen") ? 9 : 5)) + "px";
    this.MultiSelectAllCmd.style.top = (this.ListTop + (RD3_Glb.IsTouch() ? 14 : (RD3_ServerParams.Theme.startsWith("zen") ? 13 : 11))) + "px";
    this.MultiSelectAllCmd.style.visibility = vis ? "" : "hidden";
    if (RD3_ServerParams.Theme.startsWith("zen")) {
      this.MultiSelectAllCmd.style.position = "absolute";
      this.MultiSelectAllCmd.style.width = "12px";
      this.MultiSelectAllCmd.style.height = "12px";
    }
  }
  if (this.MultiSelectNoneCmd) {
    this.MultiSelectNoneCmd.style.left = (this.ListLeft + (RD3_ServerParams.Theme.startsWith("zen") ? 9 : 5)) + "px";
    this.MultiSelectNoneCmd.style.top = (this.ListTop + (RD3_Glb.IsTouch() ? 28 : (RD3_ServerParams.Theme.startsWith("zen") ? 26 : 22))) + "px";
    this.MultiSelectNoneCmd.style.visibility = vis ? "" : "hidden";
    if (RD3_ServerParams.Theme.startsWith("zen")) {
      this.MultiSelectNoneCmd.style.position = "absolute";
      this.MultiSelectNoneCmd.style.width = "12px";
      this.MultiSelectNoneCmd.style.height = "12px";
    }
  }  
}

IDPanel.prototype.SetFluidPanel = function (value) 
{
  this.FluidPanel = value;
}

IDPanel.prototype.UpdateFluidRowClasses = function () 
{
  var fr = function(rw) 
  {
    if (!rw)
      return;
    //
    // Togliamo le classi CSS
    var r = rw.lastChild;
    while (r) {
      RD3_Glb.RemoveClass(r, "subrow-last-visible");
      r = r.previousSibling;
    }
    //
    // Identifichiamo l'ultima riga visibile
    r = rw.lastChild;
    while (r && r.offsetHeight <= 2)
      r = r.previousSibling;
    //
    // Diamo la classe CSS giusta
    if (r)
      RD3_Glb.AddClass(r, "subrow-last-visible");
  }
  //
  if (this.RefreshRowsClasses) 
  {
    // All rows
    for (var i=0; i < this.Rows.length; i++)
    {
      fr(this.Rows[i]);
    }
  }
  else 
  {
    // Only some rows
    for (var i = 0; i < this.RowsToRefresh.length; i++) {
      fr(this.Rows[this.RowsToRefresh[i] - 1]);
    }
  }
  //
  this.RefreshRowsClasses = false;
  this.RowsToRefresh = [];
}

IDPanel.prototype.SetAllowPanelNavigation = function(value)
{
  this.AllowPanelNavigation = value;
}

IDPanel.prototype.CanNavigate = function ()
{
  return this.Status == RD3_Glb.PS_DATA && (this.AllowPanelNavigation || !this.DOModified);
}

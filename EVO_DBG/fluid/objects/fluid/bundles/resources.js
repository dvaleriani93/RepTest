/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


Client.IdfResources = function ()
{
};

Client.IdfResources.languagesMap = {
  ENG: "en", // From IDF
  en: "en",
  ITA: "it", // From IDF
  it: "it"
};


Client.IdfResources.msg_it = {
  // File/BLOB upload
  SWF_TP_ABORTTHIS: "Annulla l'invio di questo file",
  SWF_MG_UPLOADING: "Caricamento del file |1 in corso ...!",
  SWF_ER_FILESIZEEXCEEDED: "File troppo grande",
  SWF_ER_FILENOTSEND: "Il file non &egrave; stato caricato.",
  SWF_ER_VALIDATIONFAILED: "File non valido",
  //
  // Tooltip titles
  TIP_TITLE_QbeTip: "Criteri di ricerca",
  TIP_TITLE_PanelStart: "Inizio",
  TIP_TITLE_PanelPrevPage: "Pagina precedente",
  TIP_TITLE_PanelNextPage: "Pagina successiva",
  TIP_TITLE_PanelEnd: "Fine",
  TIP_TITLE_Search: "Cerca",
  TIP_TITLE_Find: "Trova",
  TIP_TITLE_FormList: "Cambio layout",
  TIP_TITLE_Cancel: "Annulla",
  TIP_TITLE_Reload: "Aggiorna",
  TIP_TITLE_Delete: "Elimina",
  TIP_TITLE_Insert: "Inserisci",
  TIP_TITLE_Duplicate: "Duplica",
  TIP_TITLE_Update: "Salva",
  TIP_TITLE_Print: "Stampa",
  TIP_TITLE_Export: "Esporta",
  TIP_TITLE_Attach: "Allegati",
  TIP_TITLE_Group: "Raggruppa",
  TIP_TITLE_ShowMultiSel: "Selezione record",
  TIP_TITLE_HideMultiSel: "Nascondi multiselezione",
  TIP_TITLE_SelectAll: "Seleziona tutti",
  TIP_TITLE_UnselectAll: "Deseleziona tutti",
  TIP_TITLE_ReverseSelection: "Inverti selezione",
  TIP_TITLE_Unlock: "Sblocca",
  TIP_TITLE_Lock: "Blocca",
  TIP_TITLE_ShowFrame: "Mostra",
  TIP_TITLE_HideFrame: "Nascondi",
  TIP_TITLE_ChiudiForm: "Chiudi",
  TIP_TITLE_ModalConfirm: "Conferma",
  TIP_TITLE_ChiudiAppl: "Chiudi",
  TIP_TITLE_MostraMenu: "Mostra menu",
  TIP_TITLE_NascondiMenu: "Nascondi menu",
  TIP_TITLE_BookInizio: "Inizio",
  TIP_TITLE_BookPaginaPrec: "Pagina precedente",
  TIP_TITLE_BookPaginaSucc: "Pagina successiva",
  TIP_TITLE_BookFine: "Fine",
  TIP_TITLE_CreatePDF: "Stampa",
  TIP_TITLE_LoadDoc: "Carica",
  TIP_TITLE_DeleteDoc: "Cancella",
  TIP_TITLE_ShowDoc: "Visualizza",
  TIP_TITLE_QbeRow: "Premi INVIO per eseguire la ricerca",
  TIP_TITLE_PopupSort: "Ordina per |1, premi SHIFT per aggiungere all'ordinamento",
  TIP_TITLE_PopupSortShift: "Aggiungi |1 all'ordinamento",
  //
  WEP_CAL_DayNames: new Array("lu", "ma", "me", "gi", "ve", "sa", "do"),
  WEP_CAL_MonthNames: new Array("gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"),
  WEP_CAL_CloseButtonCaption: "Chiudi",
  //
  DDM_STATUS_Moving: "Muovi da |1 a |2",
  DDM_STATUS_Resizing: "Ridimensiona da |1 a |2",
  //
  DLG_DELAY_Abort: "Sei sicuro di voler annullare l'operazione?",
  //
  // Message box messages
  MSG_POPUP_MsgBoxCaption: "Messaggio",
  MSG_POPUP_MsgConfirmCaption: "Conferma",
  MSG_POPUP_MsgInputCaption: "Inserisci",
  MSG_POPUP_MsgErrorCaption: "Errore",
  MSG_POPUP_DeleteButton: "Cancella",
  MSG_POPUP_OkButton: "OK",
  MSG_POPUP_CancelButton: "Annulla",
  MSG_POPUP_YesButton: "Ok",
  MSG_POPUP_NoButton: "Annulla",
  //
  // Confirm delete messages
  PAN_MSG_ConfirmDeleteRS: "Confermi la cancellazione della riga selezionata del pannello |1?",
  PAN_MSG_ConfirmDeleteNR: "Nessuna riga selezionata. E' necessario selezionare almeno una riga per procedere con la cancellazione.",
  PAN_MSG_ConfirmDeleteRR: "Confermi la cancellazione delle |2 righe selezionate del pannello |1?",
  PAN_MSG_ConfirmDeleteAR: "Confermi la cancellazione di tutte le righe del pannello |1?",
  PAN_MSG_ConfirmDeleteBLOB: "Confermi la cancellazione del documento contenuto nel campo |1?",
  //
  // Confirm duplicate/export messages
  PAN_MSG_ConfirmDuplicateNR: "Nessuna riga selezionata. Confermi comunque la duplicazione nel pannello |1?",
  PAN_MSG_ConfirmExportNR: "Nessuna riga selezionata. Confermi comunque l'esportazione nel pannello |1?",
  //
  // Status bar messages
  PAN_STBAR_SelRow: "Selez. 1 riga su |1",
  PAN_STBAR_SelRows: "Selez. |2 righe su |1",
  //
  // Locked popup messages
  WEP_POPUP_Blocked: "Il documento richiesto \350 stato bloccato dal browser",
  WEP_SRV_NOTFOUND: "Impossibile contattare il server dell'applicazione.\n\nPremi OK per riprovare.\n\nSe il problema persiste, contatta l'assistenza tecnica.",
  WEP_OWA_CANOFF: "Impossibile contattare il server dell'applicazione.\n\nPassare alla modalit\340 offline?",
  WEP_OWA_CANON: "Il server dell'applicazione \350 nuovamente disponibile.\n\nPassare alla modalit\340 online?",
  WEP_OWA_NOON: "Non sono stato in grado di tornare in modalit\340 online.\n\nL'applicazione rimane offline.",
  WEP_OWA_OFFLINE: "L'applicazione \350 in modalit\340 offline",
  //
  // Template mobile
  MOB_SEARCH_HINT: "Cerca",
  MOB_TOOLBAR_TOLIST: "Torna alla lista",
  MOB_TOOLBAR_LIST: "Lista",
  MOB_SWIPE_TEXT: "Elimina",
  MOB_MORE_TEXT: "Mostra altre righe",
  MOB_PULL_TEXT: "Tira in gi\371 per aggiornare",
  MOB_PULL_RELEASE: "Rilascia per aggiornare",
  MOB_PULL_REFRESH: "Aggiornamento in corso...",
  //
  IDV_WELCOME_MSG: "Cosa posso fare per te?",
  IDV_ERROR_SILENCE: "Non sento la tua voce, per favore controlla il volume del microfono",
  IDV_ERROR_NOMICRO: "Il tuo dispositivo non ha il microfono",
  IDV_ERROR_DENIED: "Hai negato il permesso di usare il microfono",
  IDV_ERROR_BLOCKED: "Il microfono \350 bloccato, <a href='chrome://settings/contentExceptions#media-stream'>clicca qui per cambiare</a>",
  //
  IDE_LINK_MSG: "Inserisci il link",
  //
  GRA_LAN_CODE: "it",
  //
  FIL_SORT_CAPTION: "Ordinamento",
  FIL_SORT_DESC: "",
  FIL_SORT_ASC: "",
  FIL_SORT_CLEAR: "Nessuno",
  FIL_VALUE: "Uguale a",
  FIL_STARTS: "Inizia con",
  FIL_NOTSTARTS: "Non inizia con",
  FIL_ENDS: "Finisce con",
  FIL_NOTENDS: "Non finisce con",
  FIL_CONTAINS: "Contiene",
  FIL_NOTCONTAINS: "Non contiene",
  FIL_DIFFERENT: "Diverso da",
  FIL_EMPTY: "Valore vuoto",
  FIL_NOTEMPTY: "Valore non vuoto",
  FIL_MAJOR: "Maggiore",
  FIL_MINOR: "Minore",
  FIL_BETWEEN: "Intervallo",
  FIL_DOFILTER: "Applica",
  FIL_CLEARFILTER: "Rimuovi tutti",
  FIL_CLEARALLFILTERS: "Rimuovi tutti i filtri",
  FIL_SELCHECK: "Selezionati",
  FIL_SELUNCHECK: "Non selezionati",
  FIL_SELALL: "Tutti",
  FIL_SEL_ALL_LABEL: "Seleziona tutti",
  FIL_UNS_ALL_LABEL: "Deseleziona tutti",
  FIL_SEARCH_PLACE: "Cerca...",
  FIL_EMPTY_LKE: "Nessun valore selezionato",
  FIL_GROUP_CAPTION: "Raggruppamento",
  FIL_GROUP_LABEL: "",
  FIL_GROUP_LABEL_D: "",
  FIL_DEGROUP_LABEL: "Rimuovi",
  FIL_OPEN_FILTER_POPUP: "Apri il popup di filtro",
  //
  LFIL_FILTER_CAPT: "Filtra",
  LFIL_SORT_DESC: "Ordina DESC",
  LFIL_SORT_ASC: "Ordina ASC",
  LFIL_SORT_CLEAR: "Rimuovi ordinamento",
  LFIL_GROUP_LBL: "Raggruppa DESC",
  LFIL_GROUP_LBL_D: "Raggruppa ASC",
  LFIL_DEGROUP_LBL: "Rimuovi gruppo",
  LFIL_VIS_LBL: "Colonne visibili",
  //
  // Server messages
  SRV_MSG_UpdateView: "Aggiorna la visualizzazione",
  SRV_MSG_ResetQBE: "I criteri di ricerca sono stati azzerati",
  SRV_MSG_BackToApp: "Torna all'applicazione",
  SRV_MSG_RequiredValue: "È necessario inserire un valore",
  SRV_MSG_DeleteDoc: "Cancella Documento",
  SRV_MSG_LoadDoc: "Carica Documento",
  SRV_MSG_CloseView: "Chiude la videata",
  SRV_MSG_CloseModal: "Chiude la videata",
  SRV_MSG_CloseApp: "Chiude l'applicazione",
  SRV_MSG_CloseAll: "Chiudi Tutto",
  SRV_MSG_Attach: "Gestisci Allegati",
  SRV_MSG_Comments: "Gestisci Commenti",
  SRV_MSG_ConfirmDelete: "Confermi la cancellazione?",
  SRV_MSG_ConfirmChoice: "Conferma la scelta",
  SRV_MSG_CreatePDF: "Crea un file PDF per la stampa",
  SRV_MSG_Confirm: "Confermi?",
  SRV_MSG_Print: "Stampa il report",
  SRV_MSG_OpenDoc: "Click per aprire il documento (|1)",
  SRV_MSG_ChooseDoc: "Scegli un documento da caricare (max dim. |1):",
  SRV_MSG_ShowMenu: "Mostra il menù",
  SRV_MSG_ShowFrame: "Mostra il riquadro",
  SRV_MSG_HideMenu: "Nasconde il menù",
  SRV_MSG_HideFrame: "Nasconde il riquadro",
  SRV_MSG_PageNumOf: "Pagina |1 di |2",
  SRV_MSG_PanelPrevPage: "Pagina precedente",
  SRV_MSG_BookPrevPage: "Pagina precedente",
  SRV_MSG_PanelNextPage: "Pagina successiva",
  SRV_MSG_BookNextPage: "Pagina successiva",
  SRV_MSG_StatusData1: "Riga |1",
  SRV_MSG_StatusData2: "Riga |1 di |2",
  SRV_MSG_StatusInsert: "Nuova riga",
  SRV_MSG_StatusQBE: "Inserisci criteri di ricerca",
  SRV_MSG_StatusUpdated: "DATI MODIFICATI",
  SRV_MSG_Cancel: "Annulla le modifiche",
  SRV_MSG_ClearFilters: "Rimuovi i filtri",
  SRV_MSG_Search: "Cerca i dati tramite i criteri di ricerca",
  SRV_MSG_Delete: "Cancella la riga selezionata",
  SRV_MSG_UnselectAllRows: "Deseleziona tutte le righe",
  SRV_MSG_Duplicate: "Duplica la riga",
  SRV_MSG_FormList: "Visualizza la lista o il dettaglio",
  SRV_MSG_FormListAuto: "Visualizza la lista",
  SRV_MSG_Insert: "Vai ad una riga vuota per inserire un nuovo dato",
  SRV_MSG_Lock: "Blocca i dati",
  SRV_MSG_ShowMultiSel: "Mostra i checkbox per la selezione multipla delle righe",
  SRV_MSG_ShowRowSel: "Mostra i bottoni per la selezione delle righe",
  SRV_MSG_Reload: "Ricarica i dati dal database",
  SRV_MSG_SelectAllRows: "Seleziona tutte le righe",
  SRV_MSG_Find: "Trova i dati nel database",
  SRV_MSG_Unlock: "Permetti di modificare i dati",
  SRV_MSG_Update: "Registra le modifiche",
  SRV_MSG_BookEnd: "Vai alla fine",
  SRV_MSG_PanelEnd: "Vai alla fine",
  SRV_MSG_PanelStart: "Vai all'inizio",
  SRV_MSG_BookStart: "Vai all'inizio",
  SRV_MSG_OpenViews: "Videate Aperte",
  SRV_MSG_ShowDoc: "Visualizza Documento",
  SRV_MSG_RowNum: "Riga |1",
  SRV_MSG_RowNumOf: "Riga |1 di |2",
  SRV_MSG_Export: "Esporta i dati in Excel",
  SRV_MSG_ErrorNum: "Errore:",
  SRV_MSG_ErrorEffects: "Effetti:",
  SRV_MSG_ErrorAction: "Cosa fare:",
  SRV_MSG_ErrorSource: "Causa:",
  SRV_MSG_ErrorButton: "Torna all'applicazione",
  SRV_MSG_Wait: "Attendere prego...",
  SRV_MSG_Group: "Mostra/Nasconde i raggruppamenti",
  SRV_MSG_ShowSelCommands: "Mostra i comandi per la selezione delle righe",
  //
  PAN_BLOBLINK: "Clicca per aprire il documento (|1)",
  //
  // Client Fluid Resources
  COMMAND_PLACEHOLDER: "Inserisci comando",
  MSG_StatusNoRows: "Nessuna riga",
  MSG_NoRows: "Non ci sono dati da visualizzare",
  MSG_NoRowsInsert: "Premi {{icon-add}} per aggiungere una nuova riga",
  MSG_NoRowsClear: "Premi {{icon-remove-circle}} per rimuovere i filtri",
  MSG_NoRowsClearInsert: "Premi {{icon-remove-circle}} per rimuovere i filtri oppure premi {{icon-add}} per aggiungere una nuova riga",
  MSG_ChartException: "<details><summary>Il grafico non può essere visualizzato a causa di un eccezione. Clicca per ulteriori dettagli.</summary><p>|1</p></details>"
};


Client.IdfResources.msg_en = {
  // file/BLOB upload
  SWF_TP_ABORTTHIS: "Stop sending this file",
  SWF_MG_UPLOADING: "Uploading |1 file ...!",
  SWF_ER_FILESIZEEXCEEDED: "File too big",
  SWF_ER_FILENOTSEND: "The file has not been uploaded.",
  SWF_ER_VALIDATIONFAILED: "Invalid file",
  //
  // Tooltip titles
  TIP_TITLE_QbeTip: "Search criteria",
  TIP_TITLE_PanelStart: "Top",
  TIP_TITLE_PanelPrevPage: "Previous page",
  TIP_TITLE_PanelNextPage: "Next page",
  TIP_TITLE_PanelEnd: "Bottom",
  TIP_TITLE_Search: "Search",
  TIP_TITLE_Find: "Find",
  TIP_TITLE_FormList: "Change layout",
  TIP_TITLE_Cancel: "Cancel",
  TIP_TITLE_Reload: "Refresh",
  TIP_TITLE_Delete: "Delete",
  TIP_TITLE_Insert: "Insert",
  TIP_TITLE_Duplicate: "Duplicate",
  TIP_TITLE_Update: "Save",
  TIP_TITLE_Print: "Print",
  TIP_TITLE_Export: "Export",
  TIP_TITLE_Attach: "Attachments",
  TIP_TITLE_Group: "Group",
  TIP_TITLE_ShowMultiSel: "Select records",
  TIP_TITLE_HideMultiSel: "Hide multiple selection",
  TIP_TITLE_SelectAll: "Select all",
  TIP_TITLE_UnselectAll: "Deselect all",
  TIP_TITLE_ReverseSelection: "Reverse selection",
  TIP_TITLE_Unlock: "Unlock",
  TIP_TITLE_Lock: "Lock",
  TIP_TITLE_ShowFrame: "Expand",
  TIP_TITLE_HideFrame: "Collapse",
  TIP_TITLE_ChiudiForm: "Close",
  TIP_TITLE_ModalConfirm: "Confirm",
  TIP_TITLE_ChiudiAppl: "Close",
  TIP_TITLE_MostraMenu: "Show menu",
  TIP_TITLE_NascondiMenu: "Hide menu",
  TIP_TITLE_BookInizio: "Top",
  TIP_TITLE_BookPaginaPrec: "Previous page",
  TIP_TITLE_BookPaginaSucc: "Next page",
  TIP_TITLE_BookFine: "Bottom",
  TIP_TITLE_CreatePDF: "Print",
  TIP_TITLE_LoadDoc: "Upload",
  TIP_TITLE_DeleteDoc: "Delete",
  TIP_TITLE_ShowDoc: "View",
  TIP_TITLE_QbeRow: "Press ENTER to search",
  TIP_TITLE_PopupSort: "Sort by |1, press SHIFT to add to current sorting",
  TIP_TITLE_PopupSortShift: "Add |1 to current sorting",
  //
  WEP_CAL_DayNames: new Array("mo", "tu", "we", "th", "fr", "sa", "su"),
  WEP_CAL_MonthNames: new Array("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"),
  WEP_CAL_CloseButtonCaption: "Close",
  //
  DDM_STATUS_Moving: "Moving from |1 to |2",
  DDM_STATUS_Resizing: "Resizing from |1 to |2",
  //
  DLG_DELAY_Abort: "Are you sure you want to cancel the operation?",
  //
  // Message box parameters
  MSG_POPUP_MsgBoxCaption: "Message",
  MSG_POPUP_MsgConfirmCaption: "Confirm",
  MSG_POPUP_MsgInputCaption: "Input",
  MSG_POPUP_MsgErrorCaption: "Error",
  MSG_POPUP_DeleteButton: "Delete",
  MSG_POPUP_OkButton: "OK",
  MSG_POPUP_CancelButton: "Cancel",
  MSG_POPUP_YesButton: "Ok",
  MSG_POPUP_NoButton: "Cancel",
  //
  // Confirm delete messages
  PAN_MSG_ConfirmDeleteRS: "Are you sure you want to delete the selected row in the |1 panel?",
  PAN_MSG_ConfirmDeleteNR: "No rows selected. You must select a row to proceed.",
  PAN_MSG_ConfirmDeleteRR: "Are you sure you want to delete the |2 selected rows in the |1 panel?",
  PAN_MSG_ConfirmDeleteAR: "Are you sure you want to delete all the rows in the |1 panel?",
  PAN_MSG_ConfirmDeleteBLOB: "Are you sure you want to delete the document contained in the |1 field?",
  //
  // Confirm duplicate/export messages
  PAN_MSG_ConfirmDuplicateNR: "No rows selected. Confirm however the duplication in the panel |1?",
  PAN_MSG_ConfirmExportNR: "No rows selected. Confirm however the exportation in the panel |1?",
  //
  // Status bar messages
  PAN_STBAR_SelRow: "Sel. 1 row out of |1",
  PAN_STBAR_SelRows: "Sel. |2 rows out of |1",
  //
  // Locked popup messages
  WEP_POPUP_Blocked: "The requested document has been locked by the browser",
  WEP_SRV_NOTFOUND: "Cannot connect to the application server.\n\nPress OK to try again.\n\nIf the problem persists, contact technical support.",
  WEP_OWA_CANOFF: "Cannot connect to the application server.\n\nDo you want to switch to offline mode?",
  WEP_OWA_CANON: "The application server is now available again.\n\nDo you want to switch to online mode?",
  WEP_OWA_NOON: "Could not switch to online mode.\n\nThe application will remain offline.",
  WEP_OWA_OFFLINE: "The application is in offline mode",
  //
  // Mobile template
  MOB_SEARCH_HINT: "Search",
  MOB_TOOLBAR_TOLIST: "Return to list",
  MOB_TOOLBAR_LIST: "List",
  MOB_SWIPE_TEXT: "Delete",
  MOB_MORE_TEXT: "Show more rows",
  MOB_PULL_TEXT: "Pull down to refresh",
  MOB_PULL_RELEASE: "Release to refresh",
  MOB_PULL_REFRESH: "Refreshing...",
  //
  IDV_WELCOME_MSG: "What can I do for you?",
  IDV_ERROR_SILENCE: "No speech was detected; you may need to adjust your microphone volume",
  IDV_ERROR_NOMICRO: "No microphone was found",
  IDV_ERROR_DENIED: "Permission to use the microphone was denied by the user",
  IDV_ERROR_BLOCKED: "The microphone is blocked, <a href='chrome://settings/contentExceptions#media-stream'>click here to change</a>",
  //
  IDE_LINK_MSG: "Enter the link",
  //
  GRA_LAN_CODE: "en",
  //
  FIL_SORT_CAPTION: "Sorting",
  FIL_SORT_DESC: "",
  FIL_SORT_ASC: "",
  FIL_SORT_CLEAR: "Clear",
  FIL_VALUE: "Equals to",
  FIL_STARTS: "Starts with",
  FIL_NOTSTARTS: "Not starts with",
  FIL_ENDS: "Ends with",
  FIL_NOTENDS: "Not ends with",
  FIL_CONTAINS: "Contains",
  FIL_NOTCONTAINS: "Not contains",
  FIL_DIFFERENT: "Different from",
  FIL_EMPTY: "Empty value",
  FIL_NOTEMPTY: "Not empty",
  FIL_MAJOR: "Major",
  FIL_MINOR: "Minor",
  FIL_BETWEEN: "Interval",
  FIL_DOFILTER: "Apply",
  FIL_CLEARFILTER: "Clear all",
  FIL_CLEARALLFILTERS: "Clear all filters",
  FIL_SELCHECK: "Selected",
  FIL_SELUNCHECK: "Unselected",
  FIL_SELALL: "All",
  FIL_SEL_ALL_LABEL: "Select all",
  FIL_UNS_ALL_LABEL: "Unselect all",
  FIL_SEARCH_PLACE: "Search...",
  FIL_EMPTY_LKE: "No values selected",
  FIL_GROUP_CAPTION: "Grouping",
  FIL_GROUP_LABEL: "",
  FIL_GROUP_LABEL_D: "",
  FIL_DEGROUP_LABEL: "Remove",
  FIL_OPEN_FILTER_POPUP: "Open filter popup",
  //
  LFIL_FILTER_CAPT: "Filter",
  LFIL_SORT_DESC: "Sort DESC",
  LFIL_SORT_ASC: "Sort ASC",
  LFIL_SORT_CLEAR: "Clear sort",
  LFIL_GROUP_LBL: "Group ASC",
  LFIL_GROUP_LBL_D: "Group DESC",
  LFIL_DEGROUP_LBL: "Clear group",
  LFIL_VIS_LBL: "Visible columns",
  //
  // Server messages
  SRV_MSG_UpdateView: "Update display",
  SRV_MSG_ResetQBE: "The search criteria have been reset",
  SRV_MSG_BackToApp: "Return to application",
  SRV_MSG_RequiredValue: "You must enter a value",
  SRV_MSG_DeleteDoc: "Delete document",
  SRV_MSG_LoadDoc: "Upload document",
  SRV_MSG_CloseView: "Closes the form",
  SRV_MSG_CloseModal: "Closes the form",
  SRV_MSG_CloseApp: "Closes the application",
  SRV_MSG_CloseAll: "Close all",
  SRV_MSG_Attach: "Manage attachments",
  SRV_MSG_Comments: "Manage comments",
  SRV_MSG_ConfirmDelete: "Confirm deletion?",
  SRV_MSG_ConfirmChoice: "Confirm your choice",
  SRV_MSG_CreatePDF: "Create a PDF file for printing",
  SRV_MSG_Confirm: "Confirm?",
  SRV_MSG_Print: "Print the report",
  SRV_MSG_OpenDoc: "Click to open the document (|1)",
  SRV_MSG_ChooseDoc: "Choose a document to load (max size |1):",
  SRV_MSG_ShowMenu: "Displays the menu",
  SRV_MSG_ShowFrame: "Displays the frame",
  SRV_MSG_HideMenu: "Hides the menu",
  SRV_MSG_HideFrame: "Hides the frame",
  SRV_MSG_PageNumOf: "Page |1 of |2",
  SRV_MSG_PanelPrevPage: "Previous page",
  SRV_MSG_BookPrevPage: "Previous page",
  SRV_MSG_PanelNextPage: "Next page",
  SRV_MSG_BookNextPage: "Next page",
  SRV_MSG_StatusData1: "Row |1",
  SRV_MSG_StatusData2: "Row |1 di |2",
  SRV_MSG_StatusInsert: "New row",
  SRV_MSG_StatusQBE: "Enter the search criteria",
  SRV_MSG_StatusUpdated: "CHANGED DATA",
  SRV_MSG_Cancel: "Undo changes",
  SRV_MSG_ClearFilters: "Clear filters",
  SRV_MSG_Search: "Find data using search criteria",
  SRV_MSG_Delete: "Delete the selected row",
  SRV_MSG_UnselectAllRows: "Deselect all rows",
  SRV_MSG_Duplicate: "Duplicate the row",
  SRV_MSG_FormList: "Displays list or detail",
  SRV_MSG_FormListAuto: "Displays list",
  SRV_MSG_Insert: "Go to an empty row to enter new data",
  SRV_MSG_Lock: "Lock data",
  SRV_MSG_ShowMultiSel: "Displays the checkboxes for multiple selection of rows",
  SRV_MSG_ShowRowSel: "Displays the buttons for selecting rows",
  SRV_MSG_Reload: "Reloads data from the database",
  SRV_MSG_SelectAllRows: "Select all rows",
  SRV_MSG_Find: "Find data in the database",
  SRV_MSG_Unlock: "Allow to edit data",
  SRV_MSG_Update: "Saves the changes",
  SRV_MSG_BookEnd: "Go to end",
  SRV_MSG_PanelEnd: "Go to end",
  SRV_MSG_PanelStart: "Go to start",
  SRV_MSG_BookStart: "Go to start",
  SRV_MSG_OpenViews: "Open forms",
  SRV_MSG_ShowDoc: "Show document",
  SRV_MSG_RowNum: "Row |1",
  SRV_MSG_RowNumOf: "Row |1 of |2",
  SRV_MSG_Export: "Export data in Excel",
  SRV_MSG_ErrorNum: "Error:",
  SRV_MSG_ErrorEffects: "Effects:",
  SRV_MSG_ErrorAction: "To do:",
  SRV_MSG_ErrorSource: "Cause:",
  SRV_MSG_ErrorButton: "Return to application",
  SRV_MSG_Wait: "Please wait...",
  SRV_MSG_Group: "Toggles display of groups",
  SRV_MSG_ShowSelCommands: "Displays the commands for selecting rows",
  //
  PAN_BLOBLINK: "Click to open document (|1)",
  //
  // Client Fluid Resources
  COMMAND_PLACEHOLDER: "Insert command",
  MSG_StatusNoRows: "No rows",
  MSG_NoRows: "There's no data to show",
  MSG_NoRowsInsert: "Press {{icon-add}} to add a new row",
  MSG_NoRowsClear: "Press {{icon-remove-circle}} to clear all filters",
  MSG_NoRowsClearInsert: "Press {{icon-remove-circle}} to clear all filters or press {{icon-add}} to add a new row",
  MSG_ChartException: "<details><summary>There was an exception during the rendering of the chart. Click to see more.</summary><p>|1</p></details>"
};


Client.IdfResources.t = function (msgName, params)
{
  params = params || [];
  //
  // Get language code from wep (IDF) or from device (IDC)
  let langCode = Client.mainFrame.wep?.language || Client.mainFrame.device.language.split("-")[0];
  //
  // Translate it using languages map or use it as is
  langCode = Client.IdfResources.languagesMap[langCode] || langCode;
  //
  // If there aren't resources for given language, fallback to english
  if (!Client.IdfResources["msg_" + langCode])
    langCode = Client.IdfResources.languagesMap.en;
  //
  // Get message translated in given language
  let msg = Client.IdfResources["msg_" + langCode][msgName] || "";
  //
  // Replace message parameters
  for (let i = 0; i < params.length; i++) {
    let par = params[i] === undefined ? "" : params[i];
    let parPlaceholder = "|" + (i + 1);
    let parIndex = msg.indexOf(parPlaceholder);
    //
    // If current param is "", remove previous space
    if (par === "" && msg.charAt(parIndex - 1) === " ")
      msg = msg.substr(0, parIndex - 1) + msg.substr(parIndex);
    //
    msg = msg.replace(parPlaceholder, par);
  }
  //
  return msg;
};

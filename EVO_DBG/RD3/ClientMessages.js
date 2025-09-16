// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Messages displayed by the client
// ************************************************

var ClientMessagesSet =
{
  'ITA':
  {
    // Caricamento di file/BLOB
    SWF_TP_ABORTTHIS   : "Annulla l'invio di questo file",
    //
    SWF_MG_UPLOADING : "Caricamento del file |1 in corso ...!",
    //
    SWF_ER_FILESIZEEXCEEDED : "File troppo grande",
    SWF_ER_FILENOTSEND      : "Il file non &egrave; stato caricato.",
    SWF_ER_VALIDATIONFAILED : "File non valido",
    //
    // Titoli dei Tooltip
    TIP_TITLE_QBETIP              : "Criteri di ricerca",
    TIP_TITLE_PanelInizio         : "Inizio",
    TIP_TITLE_PanelPaginaPrec     : "Pagina precedente",
    TIP_TITLE_PanelPaginaSucc     : "Pagina successiva",
    TIP_TITLE_PanelFine           : "Fine",
    TIP_TITLE_TooltipCerca        : "Cerca",
    TIP_TITLE_TooltipTrova        : "Trova",
    TIP_TITLE_TooltipFormList     : "Cambio layout",
    TIP_TITLE_TooltipCancel       : "Annulla",
    TIP_TITLE_TooltipRefresh      : "Aggiorna",
    TIP_TITLE_TooltipDelete       : "Elimina",
    TIP_TITLE_TooltipInsert       : "Inserisci",
    TIP_TITLE_TooltipDuplicate    : "Duplica",
    TIP_TITLE_TooltipUpdate       : "Salva",
    TIP_TITLE_Print               : "Stampa",
    TIP_TITLE_TooltipExport       : "Esporta",
    TIP_TITLE_ComandoAllegati     : "Allegati",
    TIP_TITLE_ComandoGruppi       : "Raggruppa",
    TIP_TITLE_TooltipRowSel       : "Selezione record",
    TIP_TITLE_TooltipSelectAll    : "Seleziona tutti",
    TIP_TITLE_TooltipDeseleziona  : "Deseleziona tutti",
    TIP_TITLE_TooltipUnlock       : "Sblocca",
    TIP_TITLE_TooltipLock         : "Blocca",
    TIP_TITLE_MostraRiquadro      : "Mostra",
    TIP_TITLE_NascondiRiquadro    : "Nascondi",
    TIP_TITLE_ChiudiForm          : "Chiudi",
    TIP_TITLE_ModalConfirm        : "Conferma",
    TIP_TITLE_ChiudiAppl          : "Chiudi",
    TIP_TITLE_MostraMenu          : "Mostra menu",
    TIP_TITLE_NascondiMenu        : "Nascondi menu",
    TIP_TITLE_BookInizio          : "Inizio",
    TIP_TITLE_BookPaginaPrec      : "Pagina precedente",
    TIP_TITLE_BookPaginaSucc      : "Pagina successiva",
    TIP_TITLE_BookFine            : "Fine",
    TIP_TITLE_CreatePDF           : "Stampa",
    TIP_TITLE_CaricaDoc           : "Carica",
    TIP_TITLE_CancellaDoc         : "Cancella",
    TIP_TITLE_VisualizzaDocumento : "Visualizza",
    TIP_TITLE_SelectPopupCmd      : "Nascondi Multiselezione",
    //
    WEP_CAL_DayNames              : new Array("lu","ma","me","gi","ve","sa","do"),
    WEP_CAL_MonthNames            : new Array("gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"),
    WEP_CAL_CloseButtonCaption    : "Chiudi",
    //
    DDM_STATUS_Moving   : "Muovi da |1 a |2",
    DDM_STATUS_Resizing : "Ridimensiona da |1 a |2",
    //
    DLG_DELAY_Abort : "Sei sicuro di voler annullare l''operazione?",
    //
    // Parametri per le MsgBox
    MSG_POPUP_MsgBoxCaption     : "Messaggio", // Caption delle MsgBox
    MSG_POPUP_MsgConfirmCaption : "Conferma",  // Caption dei MsgConfirm
    MSG_POPUP_MsgInputCaption   : "Inserisci", // Caption dei MsgInput
    MSG_POPUP_MsgErrorCaption   : "Errore",    // Caption degli errori
    MSG_POPUP_OkButton          : "OK",        // Testo del pulsante di una MsgBox
    MSG_POPUP_CancelButton      : "Annulla",   // Testo del pulsante Annulla di una MsgInput
    MSG_POPUP_YesButton         : "Ok",        // Testo del pulsante YES di una MsgConfirm
    MSG_POPUP_NoButton          : "Annulla",   // Testo del pulsante NO di una MsgConfirm
    //
    // Messaggi di conferma di cancellazione
    PAN_MSG_ConfirmDeleteRS   : "Confermi la cancellazione della riga selezionata del pannello |1?",
    PAN_MSG_ConfirmDeleteNR   : "Nessuna riga selezionata. E' necessario selezionare almeno una riga per procedere con la cancellazione.",
    PAN_MSG_ConfirmDeleteRR   : "Confermi la cancellazione delle |2 righe selezionate del pannello |1?",
    PAN_MSG_ConfirmDeleteAR   : "Confermi la cancellazione di tutte le righe del pannello |1?",
    PAN_MSG_ConfirmDeleteBLOB : "Confermi la cancellazione del documento contenuto nel campo |1?",
    //
    // Messaggi di conferma per duplicazione/esportazione
    PAN_MSG_ConfirmDuplicateNR   : "Nessuna riga selezionata. Confermi comunque la duplicazione nel pannello |1?",
    PAN_MSG_ConfirmExportNR      : "Nessuna riga selezionata. Confermi comunque l'esportazione nel pannello |1?",
    //
    // Testi della status bar
    PAN_STBAR_SelRow     : "Selez. 1 riga su |1",
    PAN_STBAR_SelRows    : "Selez. |2 righe su |1",
    //
    // Messaggio per un poopup bloccato
    WEP_POPUP_Blocked : "Il documento richiesto \350 stato bloccato dal browser",
    WEP_SRV_NOTFOUND  : "Impossibile contattare il server dell'applicazione.\n\nPremi OK per riprovare.\n\nSe il problema persiste, contatta l'assistenza tecnica.",
    WEP_OWA_CANOFF    : "Impossibile contattare il server dell'applicazione.\n\nPassare alla modalit\340 offline?",
    WEP_OWA_CANON     : "Il server dell'applicazione \350 nuovamente disponibile.\n\nPassare alla modalit\340 online?",
    WEP_OWA_NOON      : "Non sono stato in grado di tornare in modalit\340 online.\n\nL'applicazione rimane offline.",
    WEP_OWA_OFFLINE   : "L'applicazione \350 in modalit\340 offline",
    //
    // Template mobile
    MOB_SEARCH_HINT   : "Cerca",
    MOB_TOOLBAR_TOLIST: "Torna alla lista",
    MOB_TOOLBAR_LIST  : "Lista",
    MOB_SWIPE_TEXT    : "Elimina",
    MOB_MORE_TEXT     : "Mostra altre righe",
    MOB_PULL_TEXT     : "Tira in gi\371 per aggiornare",
    MOB_PULL_RELEASE  : "Rilascia per aggiornare",
    MOB_PULL_REFRESH  : "Aggiornamento in corso...",
    //
    IDV_WELCOME_MSG   : "Cosa posso fare per te?",
    IDV_ERROR_SILENCE : "Non sento la tua voce, per favore controlla il volume del microfono",
    IDV_ERROR_NOMICRO : "Il tuo dispositivo non ha il microfono",
    IDV_ERROR_DENIED  : "Hai negato il permesso di usare il microfono",
    IDV_ERROR_BLOCKED : "Il microfono \350 bloccato, <a href='chrome://settings/contentExceptions#media-stream'>clicca qui per cambiare</a>",
    //
    IDE_LINK_MSG      : "Inserisci il link",
    //
    GRA_LAN_CODE      : "it",
    //
    FIL_SORT_CAPTION  : "Ordinamento",
    FIL_SORT_DESC     : "",
    FIL_SORT_ASC      : "",
    FIL_SORT_CLEAR    : "Nessuno",
    FIL_VALUE         : "Uguale a",
    FIL_STARTS        : "Inizia con",
    FIL_ENDS          : "Finisce con",
    FIL_CONTAINS      : "Contiene",
    FIL_DIFFERENT     : "Diverso da",
    FIL_EMPTY         : "Valore vuoto",
    FIL_NOTEMPTY      : "Valore non vuoto",
    FIL_MAJOR         : "Maggiore",
    FIL_MINOR         : "Minore",
    FIL_BETWEEN       : "Intervallo",
    FIL_DOFILTER      : "Applica",
    FIL_CLEARFILTER   : "Rimuovi tutti",
    FIL_SELCHECK      : "Selezionati",
    FIL_SELUNCHECK    : "Non selezionati",
    FIL_SELALL        : "Tutti",
    FIL_SEL_ALL_LABEL : "Seleziona tutti",
    FIL_UNS_ALL_LABEL : "Deseleziona tutti",
    FIL_SEARCH_PLACE  : "Cerca...",
    FIL_EMPTY_LKE     : "Nessun valore selezionato",
    FIL_GROUP_CAPTION  : "Raggruppamento",
    FIL_GROUP_LABEL   : "",
    FIL_GROUP_LABEL_D : "",
    FIL_DEGROUP_LABEL : "Rimuovi",
    //
    LFIL_FILTER_CAPT  : "Filtra",
    LFIL_SORT_DESC    : "Ordina DESC",
    LFIL_SORT_ASC     : "Ordina ASC",
    LFIL_SORT_CLEAR   : "Rimuovi ordinamento",
    LFIL_GROUP_LBL    : "Raggruppa DESC",
    LFIL_GROUP_LBL_D  : "Raggruppa ASC",
    LFIL_DEGROUP_LBL  : "Rimuovi gruppo"
  },

  'ENG':
  {
    // File/BLOB upload
    SWF_TP_ABORTTHIS   : "Stop sending this file",
    //
    SWF_MG_UPLOADING : "Uploading |1 file ...!",
    //
    SWF_ER_FILESIZEEXCEEDED : "File too big",
    SWF_ER_FILENOTSEND      : "The file has not been uploaded.",
    SWF_ER_VALIDATIONFAILED : "Invalid file",
    //
    // Tooltip captions
    TIP_TITLE_QBETIP              : "Search criteria",
    TIP_TITLE_PanelInizio         : "Top",
    TIP_TITLE_PanelPaginaPrec     : "Previous page",
    TIP_TITLE_PanelPaginaSucc     : "Next page",
    TIP_TITLE_PanelFine           : "Bottom",
    TIP_TITLE_TooltipCerca        : "Search",
    TIP_TITLE_TooltipTrova        : "Find",
    TIP_TITLE_TooltipFormList     : "Change layout",
    TIP_TITLE_TooltipCancel       : "Cancel",
    TIP_TITLE_TooltipRefresh      : "Refresh",
    TIP_TITLE_TooltipDelete       : "Delete",
    TIP_TITLE_TooltipInsert       : "Insert",
    TIP_TITLE_TooltipDuplicate    : "Duplicate",
    TIP_TITLE_TooltipUpdate       : "Save",
    TIP_TITLE_Print               : "Print",
    TIP_TITLE_TooltipExport       : "Export",
    TIP_TITLE_ComandoAllegati     : "Attachments",
    TIP_TITLE_ComandoGruppi       : "Group",
    TIP_TITLE_TooltipRowSel       : "Select records",
    TIP_TITLE_TooltipSelectAll    : "Select all",
    TIP_TITLE_TooltipDeseleziona  : "Deselect all",
    TIP_TITLE_TooltipUnlock       : "Unlock",
    TIP_TITLE_TooltipLock         : "Lock",
    TIP_TITLE_MostraRiquadro      : "Expand",
    TIP_TITLE_NascondiRiquadro    : "Collapse",
    TIP_TITLE_ChiudiForm          : "Close",
    TIP_TITLE_ModalConfirm        : "Confirm",
    TIP_TITLE_ChiudiAppl          : "Close",
    TIP_TITLE_MostraMenu          : "Show menu",
    TIP_TITLE_NascondiMenu        : "Hide menu",
    TIP_TITLE_BookInizio          : "Top",
    TIP_TITLE_BookPaginaPrec      : "Previous page",
    TIP_TITLE_BookPaginaSucc      : "Next page",
    TIP_TITLE_BookFine            : "Bottom",
    TIP_TITLE_CreatePDF           : "Print",
    TIP_TITLE_CaricaDoc           : "Upload",
    TIP_TITLE_CancellaDoc         : "Delete",
    TIP_TITLE_VisualizzaDocumento : "View",
    TIP_TITLE_SelectPopupCmd      : "Hide multiple selection",
    //
    WEP_CAL_DayNames              : new Array("mo","tu","we","th","fr","sa","su"),
    WEP_CAL_MonthNames            : new Array("january","february","march","april","may","june","july","august","september","october","november","december"),
    WEP_CAL_CloseButtonCaption    : "Close",
    //
    DDM_STATUS_Moving   : "Moving from |1 to |2",
    DDM_STATUS_Resizing : "Resizing from |1 to |2",
    //
    DLG_DELAY_Abort : "Are you sure you want to cancel the operation?",
    //
    // MsgBox parameters
    MSG_POPUP_MsgBoxCaption     : "Message", // MsgBox caption
    MSG_POPUP_MsgConfirmCaption : "Confirm", // MsgConfirm caption
    MSG_POPUP_MsgInputCaption   : "Input",   // MsgInput caption
    MSG_POPUP_MsgErrorCaption   : "Error",   // Error caption
    MSG_POPUP_OkButton          : "OK",      // MsgBox button text
    MSG_POPUP_CancelButton      : "Cancel",  // MsgInput Cancel button text
    MSG_POPUP_YesButton         : "Ok",      // MsgConfirm YES button text
    MSG_POPUP_NoButton          : "Cancel",  // MsgConfirm NO button text
    //
    // Confirm delete messages
    PAN_MSG_ConfirmDeleteRS   : "Are you sure you want to delete the selected row in the |1 panel?",
    PAN_MSG_ConfirmDeleteNR   : "No rows selected. You must select a row to proceed.",
    PAN_MSG_ConfirmDeleteRR   : "Are you sure you want to delete the |2 selected rows in the |1 panel?",
    PAN_MSG_ConfirmDeleteAR   : "Are you sure you want to delete all the rows in the |1 panel?",
    PAN_MSG_ConfirmDeleteBLOB : "Are you sure you want to delete the document contained in the |1 field?",
    //
    // Messaggi di conferma per duplicazione/esportazione
    PAN_MSG_ConfirmDuplicateNR   : "No rows selected. Confirm however the duplication in the panel |1?",
    PAN_MSG_ConfirmExportNR      : "No rows selected. Confirm however the exportation in the panel |1?",
    //
    // Status bar text
    PAN_STBAR_SelRow     : "Sel. 1 row out of |1",
    PAN_STBAR_SelRows    : "Sel. |2 rows out of |1",
    //
    // Message for a locked popup
    WEP_POPUP_Blocked : "The requested document has been locked by the browser",
    WEP_SRV_NOTFOUND  : "Cannot connect to the application server.\n\nPress OK to try again.\n\nIf the problem persists, contact technical support.",
    WEP_OWA_CANOFF    : "Cannot connect to the application server.\n\nDo you want to switch to offline mode?",
    WEP_OWA_CANON     : "The application server is now available again.\n\nDo you want to switch to online mode?",
    WEP_OWA_NOON      : "Could not switch to online mode.\n\nThe application will remain offline.",
    WEP_OWA_OFFLINE   : "The application is in offline mode",
    //
    // Mobile template
    MOB_SEARCH_HINT   : "Search",
    MOB_TOOLBAR_TOLIST: "Return to list",
    MOB_TOOLBAR_LIST  : "List",
    MOB_SWIPE_TEXT    : "Delete",
    MOB_MORE_TEXT     : "Show more rows",
    MOB_PULL_TEXT     : "Pull down to refresh",
    MOB_PULL_RELEASE  : "Release to refresh",
    MOB_PULL_REFRESH  : "Refreshing...",
    //
    IDV_WELCOME_MSG   : "What can I do for you?",
    IDV_ERROR_SILENCE : "No speech was detected; you may need to adjust your microphone volume",
    IDV_ERROR_NOMICRO : "No microphone was found",
    IDV_ERROR_DENIED  : "Permission to use the microphone was denied by the user",
    IDV_ERROR_BLOCKED : "The microphone is blocked, <a href='chrome://settings/contentExceptions#media-stream'>click here to change</a>",   
    //
    IDE_LINK_MSG      : "Enter the link",
    //
    GRA_LAN_CODE      : "en",
    //
    FIL_SORT_CAPTION  : "Sorting",
    FIL_SORT_DESC     : "",
    FIL_SORT_ASC      : "",
    FIL_SORT_CLEAR    : "Clear",
    FIL_VALUE         : "Equals to",
    FIL_STARTS        : "Starts with",
    FIL_ENDS          : "Ends with",
    FIL_CONTAINS      : "Contains",
    FIL_DIFFERENT     : "Different from",
    FIL_EMPTY         : "Empty value",
    FIL_NOTEMPTY      : "Not empty",
    FIL_MAJOR         : "Major",
    FIL_MINOR         : "Minor",
    FIL_BETWEEN       : "Interval",
    FIL_DOFILTER      : "Apply",
    FIL_CLEARFILTER   : "Clear all",
    FIL_SELCHECK      : "Selected",
    FIL_SELUNCHECK    : "Unselected",
    FIL_SELALL        : "All",
    FIL_SEL_ALL_LABEL : "Select all",
    FIL_UNS_ALL_LABEL : "Unselect all",
    FIL_SEARCH_PLACE  : "Search...",
    FIL_EMPTY_LKE     : "No values selected",
    FIL_GROUP_CAPTION : "Grouping",
    FIL_GROUP_LABEL   : "",
    FIL_GROUP_LABEL_D : "",
    FIL_DEGROUP_LABEL : "Remove",
    //
    LFIL_FILTER_CAPT  : "Filter",
    LFIL_SORT_DESC    : "Sort DESC",
    LFIL_SORT_ASC     : "Sort ASC",
    LFIL_SORT_CLEAR   : "Clear sort",
    LFIL_GROUP_LBL    : "Group ASC",
    LFIL_GROUP_LBL_D  : "Group DESC",
    LFIL_DEGROUP_LBL  : "Clear group"
  }
};

var ClientMessages = ClientMessagesSet[window.RD3_AppLanguage] || ClientMessagesSet['ENG'];
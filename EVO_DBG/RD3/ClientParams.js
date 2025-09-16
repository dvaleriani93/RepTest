// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Parametri definiti localmente che non vengono
// quindi comunicati dal server. 
// ************************************************

function ClientParams()
{
  // Animazioni
  this.GFXDef = new HashTable();
  //
  this.EnableGFX = true;      // Abilitazione globale delle animazioni
  this.UseWebKitGFX = true;   // Vero se si possono usare le animazioni weblit quando disponibili
  //
  this.GFXDef.add("menu", "fold:250");        // Supportati fold e none
  this.GFXDef.add("sidebar", "scroll:250");   // scroll, fold e none
  this.GFXDef.add("start", "fade:250");       // fade e none
  this.GFXDef.add("form", "scroll-v:250!");   // fade, scroll-v, scroll-h, fold-v, fold-h, none
  this.GFXDef.add("frame", "fold:250!");      // fold e none
  this.GFXDef.add("tree", "fold:250");        // fold e none
  this.GFXDef.add("modal", "zoom:250!");      // point-tl, point-tr, point-bl, point-br, zoom e none
  this.GFXDef.add("list", "scroll-h:250!");   // fade, scroll-v, scroll-h, fold-v, fold-h, none
  this.GFXDef.add("tab", "scroll-h:250!");    // fade, scroll-h, fold-h,none
  this.GFXDef.add("popup", "scroll:250");     // fold, scroll, none
  this.GFXDef.add("graph", "fade:250");       // fade, none
  this.GFXDef.add("book", "scroll:250!");     // fade, scroll, fold, none
  this.GFXDef.add("message", "fold:250");     // fold, none
  this.GFXDef.add("lastmessage", "fade:250"); // fade, none
  this.GFXDef.add("qbetip", "fade:250");      // fade, none
  this.GFXDef.add("redirect", "fade:250!");   // fade, none
  this.GFXDef.add("preview", "scroll:250!");  // fade, scroll, fold, none
  this.GFXDef.add("docked", "scroll:250!");   // scroll, fold, none
  this.GFXDef.add("popupres", "fold:250!");   // fold, none
  this.GFXDef.add("tooltip", "fade:250");     // fade, none
  this.GFXDef.add("taskbar", "fold:250");     // fold, none
  this.GFXDef.add("combo", "scroll:250");     // fold, scroll, none
  this.GFXDef.add("group", "fold:250");       // fold, none
  this.GFXDef.add("zone", "scroll:250!");     // scroll, fold, none
  this.GFXDef.add("unpinned", "scroll:250!"); // scroll

  // Souni
  this.SoundDef = new HashTable();
  //
  // SoundManager usa HTML5 o Flash; su IE8- non c'e' nessuno dei due
  this.EnableSound = !RD3_Glb.IsIE() || RD3_Glb.IsIE(9, true);      // Abilitazione globale dei suoni
  //
  this.SoundDef.add("close", "close.mp3");     // Suono di chiusura form
  this.SoundDef.add("open", "open.mp3");       // Suono di apertura form
  this.SoundDef.add("delete", "delete.mp3");   // Suono di avvenuta cancellazione
  this.SoundDef.add("update", "update.mp3");   // Suono di avvenuto salvataggio
  this.SoundDef.add("login", "login.mp3");     // Suono di avvenuto login
  this.SoundDef.add("logoff", "logoff.mp3");   // Suono di avvenuto logoff
  this.SoundDef.add("command", "command.mp3"); // Suono di invio comando al server (menu', etc...)
  this.SoundDef.add("info", "info.mp3");       // Suono di apertura messaggio informativo
  this.SoundDef.add("warning", "warning.mp3"); // Suono di apertura messaggio warning
  this.SoundDef.add("error", "error.mp3");     // Suono di apertura messaggio errore

  // Animazioni per l'hilight dei treenode
  this.HilightTreeNodes = true;
  
  // Icona della comunicazione Ajax in corso
  this.ShowAjaxIndicator = true;

  // Parametri per il D&D
  this.DragSensibility = RD3_Glb.IsMobile()?-1:6; // Numero di pixel di cui l'oggetto deve essere spostato prima di iniziare il drag
  this.MinSize = 4;         // Minima dimensione in px degli oggetti da ridimensionare
  this.ResizeLimit = RD3_Glb.IsTouch()?16:10; // Distanza del mouse dal bordo in px per attivare resize
  this.ChgResMM = 1;        // Minima variazione (in mm) durante la trasformazione
  this.ChgResIN = 0.04;     // Minima variazione (in inch) durante la trasformazione
  this.MoveBorders = "";    // Stile dei bordi durante il movimento di una box,
                            // Se stringa vuota, utilizza il bordo dell'oggetto.
                            // Esempio: "2px dotted blue"
                                
  // Parametri per la comunicazione con il server
  this.MaxOpenRequests = 2; // Numero di richieste al server massime contemporanee
  this.DelayDlgTime = RD3_Glb.IsMobile()?1500:5000; // Tempo in ms prima di aprire una finestra modale bloccante
  this.DelayDlgShowTime = 1500; // Tempo in ms prima che la finestra modale venga visualizzata se l'utente non fa nulla
  
  // Tempi di ritardo per la trasmissione degli eventi al server
  this.SuperActiveDelay = 200;
  this.DelayTimes = new HashTable();
  this.DelayTimes.add("panscr", 50); // Ritardo standard per lo scrolling del pannello: non e' bene metterlo inferiore a 50 perche' IE lancia molti evento di scrolling!
  //
  // Parametri per le dialog popup
  this.PopupDlgMinW = 240;        // Minima larghezza in pixel assumibile da una dialog modale
  this.PopupInputMinW = 400;      // Minima larghezza in pixel assumibile da una input box
  this.PopupProgressSpeed = 2;    // Velocita' di animazione della progress bar
  //
  // Parametri per le form
  this.MaxMessagesBoxHeight = "54px";
  this.MinMessagesBoxHeight = 22;     // Usato se ci sono pannelli infomessages
  this.StandardPadding = RD3_Glb.IsMobile()?0:2; // Margine standard per il contenuto di tutti i frame della form (in pixel)
  
  // Parametri per i pannelli
  this.RowSelWidth = 20;     // Larghezza del Row Selector
  this.ActivatorWidth = (RD3_Glb.IsTouch() || RD3_Glb.IsMobile())?26:17;  // Larghezza standard del pulsante di attivazione campi
  this.BlobButtonWidth = (RD3_Glb.IsTouch() || RD3_Glb.IsMobile())?28:22; // Larghezza standard dei bottoni della toolbar blob
  this.TabWidth = 100;       // Larghezza standard delle linguette delle tabbed view
  this.TabWidthThin = 40;    // Larghezza ridotta delle linguette delle tabbed view
  this.HLDBorderWidth = 2;   // Larghezza del bordo del DIV per evidenziare durante la cancellazione
  
  // Tasti funzionali standard
  this.FKActField = 2;  // Attivatore del singolo campo
  this.FKEnterQBE = 3;  // Tasto entra in QBE
  this.FKFindData = 3;  // Tasto trova i dati
  this.FKFormList = 4;  // Tasto form/list
  this.FKRefresh  = 6;  // Tasto refresh
  this.FKCancel   = 6;  // Tasto cancel
  this.FKInsert   = 7;  // Tasto insert
  this.FKDelete   = 8;  // Tasto delete
  this.FKUpdate   = 9;  // Tasto salva
  this.FKLocked   = 11; // Tasto lock/unlock
  this.FKActRow   = 12; // Tasto attivatore di riga
  this.FKSelAll   = 14; // Tasto seleziona tutto SHIFT+F2
  this.FKSelNone  = 15; // Tasto annulla selezione SHIFT+F3
  this.FKSelTog   = 16; // Tasto mostra selezione SHIFT+F4
  this.FKDuplicate= 19; // Tasto Duplicate SHIFT+F7
  this.FKCloseForm= 26; // Tasto Close Form CTRL+F2 (perche' CTRL+F4 chiude il browser!)
  this.FKPrint    = 36; // Tasto Print CTRL+F12
  
  this.DefaultButton = true;            // Pulsante di default per le MsgConfirm e MsgInput: true Yes-Ok, false No-Cancel
  
  // Parametri per le IDCombo
  this.ComboPopupMinHeight = 14;
  this.ComboPopupMaxHeight = 210;
  this.ComboActivatorSize = (RD3_Glb.IsTouch() || RD3_Glb.IsMobile())?24:15;
  this.ComboImageSize = RD3_Glb.IsMobile()?30:16;
  this.ComboNameSeparator = "; ";
  
  // Parametri per la taskbar
  this.TaskMenuAccellCode = 220;        // Keycode tasto da premere con CTRL per aprire il menu' taskbar
  
  // Parametri per la gestione dell'invio dei tasti
  this.KeyPressEventType = RD3_Glb.EVENT_ACTIVE;  // Tipo di gestione dell'evento
  this.DelayTimes.add("keypress", 350);           // Ritardo massimo con cui sono inviati gli eventi al server (solo se IMMEDIATE)

  // Parametri per la gestione del resize
  this.SideMenuResizable = true;  // Permette o meno il resize del menu laterale
  this.SideMenuMinWidth = 120;    // Dimensione minima del menu laterale (quando ridimensionato dall'utente)
  this.DockedMinResize = 100;     // Dimensione minima delle docked (quando ridimensionate dall'utente)
  this.FrameMinimumSize = 50      // Dimensione minima di un Frame (quando ridimensionato dall'utente)
  //
  this.FrameBorderTop = 1;        // Spessore del bordo superiore dei frame
  this.FrameBorderLeft = 1;       // Spessore del bordo sinistro dei frame
  
  // Parametri per la gestione degli eventi touch
  this.TouchMoveLimit = 24; // Distanza in px dopo la quale viene disattivato il click su un oggetto
  this.TouchHLDelay = 300;  // Tempo in ms per cui un tasto viene illuminato quando attivato
  
  // Parametri per la gestione del popup blocker
  this.RedirectWhenBlocked = false;
  this.AlertWhenBlocked = true;

  // Indica ogni quanto occorre riprovare a tornare online nel caso di offline di emergenza (sec)
  this.OWAOfflineCheck = 60;
  
  // Se vero, la scrollbar mobile aspetta ontouchup invece che essere istantanea
  this.MobileScrollbarOnTouchUp = true;
  
  // Se vero, attivo il retina
  this.MobileRetina = true;
  
  // Timer (ms) di auto-commit per la voce (se non arriva nulla entro questo tempo, il comando viene inviato al server)
  this.VoiceAutoCommitDelay = 2000;
  
  // Parametri per IDEditor
  this.AutoDefaultFormatting = false;
  this.EditorToolbarIE7Color = "rgb(230, 235, 240)";
  this.EditorHilightIE7Color = "rgb(205, 213, 221)";
  this.EditorPressIE7Color = "rgb(187, 195, 202)";
  
  // Ritardo di invio del MouseOver (ms)
  this.MouseOverDelay = 750;
  
  // Se true permette di scrollare le liste anche toccando sugli input
  this.IDScrollInput = RD3_Glb.IsAndroid() ? false : true;   
}


ClientParams.prototype.GetColorHL1= function()
{
  if (RD3_Glb.IsQuadro())
    return RD3_DesktopManager.WebEntryPoint.AccentColor;
  else if (RD3_Glb.IsMobile7())
    return "rgb(200, 200, 200)";
  else
    return "rgb(5, 140, 245)";
}

ClientParams.prototype.GetColorHL2= function()
{
  if (RD3_Glb.IsQuadro())
    return RD3_DesktopManager.WebEntryPoint.AccentColor;
  else if (RD3_Glb.IsMobile7())
    return "rgb(200, 200, 200)";
  else
    return "rgb(1, 95, 230)";
}

ClientParams.prototype.GetColorMenu1= function()
{
  if (RD3_Glb.IsQuadro())
    return "#777777";
  else
    return "#e8eaed";
}

ClientParams.prototype.GetColorMenu2= function()
{
  if (RD3_Glb.IsQuadro())
    return "#363636";
  else
    return "#c0c4cc";
}

ClientParams.prototype.ZoneUnpinnedSize= function(vertical)
{
  if (RD3_Glb.IsMobile())
  {
    if (vertical)
      return 72;
    else
      return 50;
  }
  else
  {
    return 25;
  }
}
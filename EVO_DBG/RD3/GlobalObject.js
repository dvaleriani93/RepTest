// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Definizioni e funzioni globali
// ************************************************

function GlobalObject()
{
  // tipi di eventi
  this.EVENT_CLIENTSIDE = 1; // L'evento verra' gestito (anche) lato client
  this.EVENT_SERVERSIDE = 2; // L'evento verra' gestito (anche) lato server
  this.EVENT_IMMEDIATE = 4;  // L'evento viene inviato al server prima possibile
  this.EVENT_BLOCKING = 8;   // Occorre attendere la risposta lato server prima di poter proseguire
  //
  this.EVENT_URGENT   = 15;    // EVENT_CLIENTSIDE + EVENT_SERVERSIDE + EVENT_IMMEDIATE + EVENT_BLOCKING
  this.EVENT_ACTIVE   = 7;    // EVENT_CLIENTSIDE + EVENT_SERVERSIDE + EVENT_IMMEDIATE
  this.EVENT_DEFERRED = 3;    // EVENT_CLIENTSIDE + EVENT_SERVERSIDE
  
  // tipi di effetti grafici
  this.GFX_SHOWFOLD = 1; // Un oggetto deve passare da display:none a display:block; usando un effetto di apertura
  this.GFX_HIDEFOLD = 2; // Un oggetto deve passare da display:block a display:none; usando un effetto di chiusura
  this.GFX_HIGHON   = 3; // Attiva evidenziazione oggetto (come quando il cursore e' su un link)
  this.GFX_HIGHOFF  = 4; // Disattiva evidenziazione oggetto (come quando il cursore esce da un link)
  
  // posizionamento dei bottoni all'interno della form
  this.FORMTOOL_NONE = 0;    // No bottoni toolbar
  this.FORMTOOL_LEFT = 1;    // Bottoni toolbar a sinistra
  this.FORMTOOL_RIGHT = 2;   // Bottoni toolbar a destra
  this.FORMTOOL_DISTRIB = 3; // Bottoni toolbar "separati" (OK a sinistra, CANCEL a destra con titolo in mezzo)

  // scrollbar che la form puo' avere
  this.FORMSCROLL_NONE  = 0;   // No scrollbar
  this.FORMSCROLL_HORIZ = 1;   // Solo scrollbar orizzontale
  this.FORMSCROLL_VERT  = 2;   // Solo scrollbar verticale
  this.FORMSCROLL_BOTH  = 3;   // Entrambe le scrollbar (default)
  
  // tipi di form docked
  this.FORMDOCK_NONE   = 1;
  this.FORMDOCK_LEFT   = 2;
  this.FORMDOCK_RIGHT  = 3;
  this.FORMDOCK_TOP    = 4;
  this.FORMDOCK_BOTTOM = 5;

  // modalita' di ridimensionamento della form
  this.FRESMODE_NONE    = 1;  // Nessun ridimensionamento
  this.FRESMODE_EXTEND  = 2;  // Solo estensione
  this.FRESMODE_STRETCH = 3;  // Completo

  // modalita' di ridimensionamento della form
  this.RESMODE_NONE    = 1;  // Nessun ridimensionamento
  this.RESMODE_MOVE  = 2;    // Muovi
  this.RESMODE_STRETCH = 3;  // Adatta

  // tipi di menu applicativo
  this.MENUTYPE_LEFTSB   = 1;
  this.MENUTYPE_RIGHTSB  = 2;
  this.MENUTYPE_MENUBAR  = 3;
  this.MENUTYPE_TASKBAR  = 4;
  this.MENUTYPE_GROUPED  = 5;
  
  // stili di visualizzazione degli indicatori
  this.STYLE_TIME = 6;
  this.STYLE_DATE = 7;
  
  // allineamento degli indicatori
  this.IND_ALI_SX = 2;
  this.IND_ALI_CX = 3;
  this.IND_ALI_DX = 4;
  
  // layout dei pannelli
  this.PANEL_LIST = 0;
  this.PANEL_FORM = 1;
  
  // Librerie grafiche
  this.JFREECHART  = 1;
  this.FUSIONCHART = 2;
  this.JQPLOT = 5;
  this.CHARTJS = 6;
  this.GOOGLECHART = 7;
  
  // Posizionamento delle Tab
  this.TABOR_TOP    = 1;
  this.TABOR_LEFT   = 2;
  this.TABOR_BOTTOM = 3;
  this.TABOR_RIGHT  = 4;
  
  // Strech dei book
  this.STRTC_AUTO    = 1;
  this.STRTC_NONE    = 2;
  this.STRTC_FILL    = 3;
  this.STRTC_ENLARGE = 4;
  this.STRTC_CROP    = 5;
  
  // Tipo di controllo
  this.VISCTRL_AUTO   = 1;
  this.VISCTRL_EDIT   = 2;
  this.VISCTRL_COMBO  = 3;
  this.VISCTRL_CHECK  = 4;
  this.VISCTRL_OPTION = 5;
  this.VISCTRL_BUTTON = 6;
  this.VISCTRL_HTMLEDIT = 7;
  
  // Stati del pannello
  this.PS_QBE     = 1;
  this.PS_DATA    = 2;
  this.PS_UPDATED = 3;
  
  // Comandi del pannello
  this.PCM_FORMLIST   = 0x1;
  this.PCM_SEARCH     = 0x2;
  this.PCM_FIND       = 0x4;
  this.PCM_INSERT     = 0x8;
  this.PCM_DELETE     = 0x10;
  this.PCM_CANCEL     = 0x20;
  this.PCM_REQUERY    = 0x40;
  this.PCM_UPDATE     = 0x80;
  this.PCM_DUPLICATE  = 0x100;
  this.PCM_LOOKUP     = 0x200;
  this.PCM_BLOBEDIT   = 0x400;
  this.PCM_BLOBDELETE = 0x800;
  this.PCM_BLOBNEW    = 0x1000;
  this.PCM_BLOBSAVEAS = 0x2000;
  this.PCM_PRINT      = 0x4000;
  this.PCM_ATTACH     = 0x10000;
  this.PCM_CSV        = 0x20000;
  this.PCM_GROUP      = 0x8000;
  
  this.PCM_CUSTOM1 = 0x40000;
  this.PCM_CUSTOM2 = 0x80000;
  this.PCM_CUSTOM3 = 0x100000;
  this.PCM_CUSTOM4 = 0x200000;
  this.PCM_CUSTOM5 = 0x400000;
  this.PCM_CUSTOM6 = 0x800000;
  this.PCM_CUSTOM7 = 0x1000000;
  this.PCM_CUSTOM8 = 0x2000000;
  
  this.PCM_CUSTOM1 = -0x1;
  this.PCM_CUSTOM2 = -0x2;
  this.PCM_CUSTOM3 = -0x4;
  this.PCM_CUSTOM4 = -0x8;
  this.PCM_CUSTOM5 = -0x16;
  this.PCM_CUSTOM6 = -0x32;
  this.PCM_CUSTOM7 = -0x64;
  this.PCM_CUSTOM8 = -0x128;
  
  this.PCM_NAVIGATION = 0x40000000;

  this.CZ_FORMLIST = 0;
  this.CZ_SEARCH = 1;
  this.CZ_FIND = 2;
  this.CZ_INSERT = 3;
  this.CZ_DELETE = 4;
  this.CZ_CANCEL = 5;
  this.CZ_REQUERY = 6;
  this.CZ_UPDATE = 7;
  this.CZ_DUPLICATE = 8;
  this.CZ_LOOKUP = 9;
  this.CZ_BLOBEDIT = 10;
  this.CZ_BLOBDELETE = 11;
  this.CZ_BLOBNEW = 12;
  this.CZ_BLOBSAVEAS = 13;
  this.CZ_PRINT = 14;
  this.CZ_GROUP = 15;
  this.CZ_ATTACH = 16;
  this.CZ_CSV = 17;
  this.CZ_CUSTOM1 = 18;
  this.CZ_CUSTOM2 = 19;
  this.CZ_CUSTOM3 = 20;
  this.CZ_CUSTOM4 = 21;
  this.CZ_CUSTOM5 = 22;
  this.CZ_CUSTOM6 = 23;
  this.CZ_CUSTOM7 = 24;
  this.CZ_CUSTOM8 = 25;
  //
  this.CZ_NAVIGATE = 30;
  //
  this.CZ_COLLAPSE = 32;
  this.CZ_LOCK = 33;
  this.CZ_STATUSBAR = 34;
  this.CZ_CMDSET = 35;
  this.CZ_QBETIP = 36;
  
  // Tipo di Message Box
  this.MSG_BOX = 0;
  this.MSG_CONFIRM = 1;
  this.MSG_INPUT = 2;
  
  // Tipo di Delay Dialog
  this.DELAY = 0;
  this.PROGRESS = 1;

  // Tipo di bordo per popup
  this.BORDER_DEFAULT = 0; 
  this.BORDER_NONE = 1; 
  this.BORDER_THIN = 2; 
  this.BORDER_THICK = 3;

  // Window state
  this.WS_NORMAL = 0; 
  this.WS_MAXIMIZE = 1; 
  this.WS_MINIMIZE = 2;

  // Comandi del book
  this.BCM_PRINT      = 0x1;
  this.BCM_NAVIGATION = 0x2;
  this.BCM_CSV        = 0x4;
  
  // Intercettazione tasti
  this.KEYS_ENTERESC = 1;       // Tasto invio-esc
  this.KEYS_MOVEMENT = 2;       // Tasti movimento (tasti cursore + pgdown/pgup + end/home + del/cancel + tab)
  this.KEYS_ALPHANUMERICAL = 4; // Tasti alfanumerici (numeri+lettere)
  
  // Tipi di controlli
  this.CTRL_DATE = 1;     // Controllo per le date
  this.CTRL_TIME = 2;     // Controllo per le ore
  this.CTRL_DATETIME = 3; // Controllo per le date/ore
  this.CTRL_KEYNUM = 4;   // Tastierino numerico
  this.CTRL_CPICKER = 5;  // Color Picker
  
  this.PFLPOS_LXPPERC = 0;
  this.PFLPOS_LYPPERC = 1;
  this.PFLPOS_FXPPERC = 2;
  this.PFLPOS_FYPPERC = 3;
  this.PFLDIM_LWIDTHPERC = 4;
  this.PFLDIM_LHEIGHTPERC = 5;
  this.PFLDIM_LHEADERPERC = 6;
  this.PFLDIM_FWIDTHPERC = 7;
  this.PFLDIM_FHEIGHTPERC = 8;
  this.PFLDIM_FHEADERPERC = 9;
  
  this.SCRZONE_VISTAB = 0;
  this.SCRZONE_HIDTAB = 1;
  this.SCRZONE_AUTTAB = 2;
  //
  this.SCRZONE_PINNEDZONE = 0;
  this.SCRZONE_UNPINNEDZONE = 1;
  this.SCRZONE_HIDDENZONE = 2;
  //
  this.SCRZONE_SELECTEDMENU = -1;
  this.SCRZONE_SELECTEDNONE = -2;
  //
  this.SCRZONE_SWIPENONE = 1;
  this.SCRZONE_SWIPECOLLAPSABLE = 2;
  this.SCRZONE_SWIPEHIDE = 3;
  //
  this.SWIPE_LEFT = 1;
  this.SWIPE_RIGHT = 2;
  this.SWIPE_TOP = 3;
  this.SWIPE_BOTTOM = 4;
  this.SWIPE_TOPLEFT = 5;
  this.SWIPE_BOTTOMLEFT = 6;
  this.SWIPE_TOPRIGHT = 7;
  this.SWIPE_BOTTOMRIGHT = 8;
  //
  this.SCRZONE_VERTICALPOPOVER = 0;
  this.SCRZONE_VERTICALCOLLAPSE = 1;
  this.SCRZONE_VERTICALHIDE = 2;
  this.SCRZONE_VERTICALNOCHANGE = 3;
  //
  this.SwipeDelta = 80;
  this.SwipeLimit = 40;
  
  // Comandi di IDEditor
  this.IDE_BOLD       = 0x1;
  this.IDE_ITALIC     = 0x2;
  this.IDE_UNDERLINE  = 0x4;
  this.IDE_STRIKE     = 0x8;
  this.IDE_UL         = 0x10;
  this.IDE_OL         = 0x20;
  this.IDE_LEFT       = 0x40;
  this.IDE_CENTER     = 0x80;
  this.IDE_JUSTIFY    = 0x100;
  this.IDE_RIGHT      = 0x200;
  this.IDE_BACK       = 0x400;
  this.IDE_FORE       = 0x800;
  this.IDE_LINK       = 0x1000;
  this.IDE_IMAGE      = 0x2000;
  this.IDE_CHANGE     = 0x4000;
  this.IDE_FONT       = 0x8000;
  this.IDE_SIZE       = 0x10000;
  this.IDE_TOKEN      = 0x20000;
  this.IDE_FORECH     = 0x40000;
  this.IDE_BACKCH     = 0x80000;

  this.PAN_NOQBELIST = 0;
  this.PAN_QBEHEADER = -1;
  this.PAN_QBEROW = -2;
  
  // Cache immagini  
  this.ImagesCache = new HashTable();
}


// *******************************************************************
// Calcola il log2 del numero inserito
// *******************************************************************
GlobalObject.prototype.log2 = function(indice)
{
  var l = 0;
  while (indice != 0)
  {
    l++; indice >>= 1;
  }
  l--;
  return l;
}


// *******************************************************************
// Aggiunge all'oggetto la gfestione degli eventi MouseOver e MouseOut
// per la gestione dell'illuminazione dell'oggetto alla selezione
// *******************************************************************
GlobalObject.prototype.AddHLEvents = function(obj, ident, mouseovereventname, mouseouteventname)
{
  if (!mouseovereventname)
    mouseovereventname = "OnMouseOver";
  //
  if (!mouseouteventname)
    mouseouteventname = "OnMouseOut";
  //
  var mif = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+ident+"', '"+mouseovereventname+"', ev)");
  var mof = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+ident+"', '"+mouseouteventname+"', ev)");
  if (obj.addEventListener)
  {
    obj.addEventListener("mouseover", mif, false); 
    obj.addEventListener("mouseout", mof, false); 
  }
  else
  {
    obj.onmouseover = mif;
    obj.onmouseout = mof;
  }
}


// *******************************************************************
// Rimuove i tag HTML presenti nella stringa passata
// *******************************************************************
GlobalObject.prototype.RemoveTags = function(value)
{
  // Variabili locali per navigare la stringa
  var stringlength = value.length;        // Lunghezza della stringa passata
  var returnstring = "";                  // Stringa di ritorno senza Tag HTML
  var flAppend = true;                    // True se il carattere deve essere inserito nella stringa di ritorno
  //
  // Ciclo su tutti i caratteri della stringa
  for (var i = 0; i < stringlength; i++)
  {
    var ch = value.charAt(i);
    //
    switch (ch)
    {
      // Se e' l'inizio di un tag non devo far appendere i caratteri successivi
      case "<": flAppend = false; break;
      
      // Se e' la fine di un tag devo far appendere i caratteri successivi
      case ">": flAppend = true; break;
      
      // Se e' un altro carattere lo faccio appendere o meno a seconda dell'impostazione
      default:
      {
        if (flAppend)
          returnstring +=ch;
        break;
      }
    }
  }
  //
  return returnstring;
}


// *******************************************************************
// Ritorna la coordinate assolute nello schermo dell'oggetto OBJ
// *******************************************************************
GlobalObject.prototype.GetScreenLeft= function(obj, fltranslate)
{
  var x = obj.scrollLeft;
  var w = (RD3_DesktopManager.WebEntryPoint)?RD3_DesktopManager.WebEntryPoint.WepBox:document.body;
  while (obj && obj!=w)
  {
    x += obj.offsetLeft - obj.scrollLeft + obj.clientLeft;
    if (fltranslate)
      x+=this.TranslateX(obj);
    obj = obj.offsetParent;
  }
  //
  x += document.body.scrollLeft;
  //
  return x;  
}

GlobalObject.prototype.GetScreenTop= function(obj,fltranslate)
{
  var y = obj.scrollTop;
  var w = (RD3_DesktopManager.WebEntryPoint)?RD3_DesktopManager.WebEntryPoint.WepBox:document.body;
  while (obj && obj!=w)
  {
    y += obj.offsetTop - obj.scrollTop + obj.clientTop;
    if (fltranslate)
      y+=this.TranslateY(obj);
    obj = obj.offsetParent;
  }
  //
  y += document.body.scrollTop;
  //
  return y;
}


// ******************************************************************
// Mette i parametri nella stringa
// ******************************************************************
GlobalObject.prototype.FormatMessage = function(txt, p1, p2, p3, p4, p5)
{
  if (p1==undefined) p1="";
  if (p2==undefined) p2="";
  if (p3==undefined) p3="";
  if (p4==undefined) p4="";
  if (p5==undefined) p5="";
  txt = txt.replace("|1",p1);
  txt = txt.replace("|2",p2);
  txt = txt.replace("|3",p3);
  txt = txt.replace("|4",p4);
  txt = txt.replace("|5",p5);  
  return txt;
}

// ******************************************************************
// Adatta l'oggetto passato per riempire totalmente il parent
// ******************************************************************
GlobalObject.prototype.AdaptToParent = function(obj, offsetW, offsetH)
{
  if (!offsetW)
    offsetW = 0;
  if (!offsetH)
    offsetH = 0;
  //
  if (obj.parentNode)
  {
    var sf = this.GetCurrentStyle(obj);
    var sp = this.GetCurrentStyle(obj.parentNode);
    //
    // Se non e' possibile calcolare il currentStyle esco, ci deve essere un problema..
    if (!sp)
      return;
    //
    // se non e' stato specificato -1 nell'offsetW posso ridimensionare la larghezza
    if (offsetW != -1)
    {
      // calcolo le nuove dimensioni in base all'oggetto padre
      var availableW = (obj.parentNode.clientWidth - offsetW);
      //
      // IE10 ha dei problemi con il tema ZEN ad identificare le dimensioni, a volte clientWidth e' 0 mentre ofsetWidth e' > 0... in questo caso
      // proviamo ad usare la width dello stile e se non ci riusciamo usiamo l'offsetWidth
      if (RD3_ServerParams.Theme.startsWith("zen") && this.IsIE(10,true) && obj.parentNode.clientWidth == 0 && obj.parentNode.offsetWidth > 0)
        availableW = (obj.parentNode.offsetWidth - offsetW);
      //
      // Per considerare il margine dx uso lo stile proprio dell'oggetto in quanto il computed style
      // lo "ricalcola" al volo
      availableW = availableW - parseInt("0"+sf.marginLeft, 10) - parseInt("0"+obj.style.marginRight, 10) - parseInt("0"+sp.paddingLeft, 10) - parseInt("0"+sp.paddingRight, 10);
      //
      // Considero margini e padding oggetto interno
      var considerPadding = true;
      if (RD3_Glb.IsMobile() && sf.boxSizing && sf.boxSizing=="border-box")
        considerPadding = false;
      if (considerPadding)
        availableW = availableW - parseInt("0"+sf.paddingLeft, 10) - parseInt("0"+sf.paddingRight, 10) - parseInt("0"+sf.borderLeft, 10) - parseInt("0"+sf.borderRight, 10);
      //
      // Su IE10 (e firefox) a volte borderTop e' "" mentre borderTopWidth ha il valore giusto.. in quel caso riapplico il valore corretto..
      if (considerPadding && (this.IsIE(10,true) || RD3_Glb.IsFirefox()))
      {
        if (sf.borderLeft=="" && sf.borderLeftWidth != "" && sf.borderLeftStyle != "" && sf.borderLeftStyle != "none")
          availableW = availableW - parseInt("0"+sf.borderLeftWidth, 10);
        if (sf.borderRight=="" && sf.borderRightWidth != "" && sf.borderRightStyle != "" && sf.borderRightStyle != "none")
          availableW = availableW - parseInt("0"+sf.borderRightWidth, 10);
          
      }
      //
      var newWidth = availableW;
      //
      // assegno le nuove dimensioni
      obj.style.width = ((newWidth < 0) ? 0 : newWidth) + "px";
    }
    //
    // se non e' stato specificato -1 nell'offsetH posso ridimensionare l'altezza
    if (offsetH != -1)
    {
      // calcolo le nuove dimensioni in base all'oggetto padre
      var availableH = (obj.parentNode.clientHeight - offsetH);
      //
      // Per considerare il margine bottom uso lo stile proprio dell'oggetto in quanto il computed style
      // lo "ricalcola" al volo
      availableH = availableH - parseInt("0"+sf.marginTop, 10) - parseInt("0"+obj.style.marginBottom, 10) - parseInt("0"+sp.paddingTop, 10) - parseInt("0"+sp.paddingBottom, 10);
      //
      // Considero margini e padding oggetto interno
      availableH = availableH - parseInt("0"+sf.paddingTop, 10) - parseInt("0"+sf.paddingBottom, 10) - parseInt("0"+sf.borderTop, 10) - parseInt("0"+sf.borderBottom, 10);
      //
      // Su IE10 (e firefox) a volte borderTop e' "" mentre borderTopWidth ha il valore giusto.. in quel caso riapplico il valore corretto..
      if (considerPadding && (this.IsIE(10,true) || RD3_Glb.IsFirefox()))
      {
        if (sf.borderTop=="" && sf.borderTopWidth != "" && sf.borderTopStyle != "" && sf.borderTopStyle != "none")
          availableH = availableH - parseInt("0"+sf.borderTopWidth, 10);
        if (sf.borderBottom=="" && sf.borderBottomWidth != "" && sf.borderBottomStyle != "" && sf.borderBottomStyle != "none")
          availableH = availableH - parseInt("0"+sf.borderBottomWidth, 10);
      }
      //
      var newHeight = availableH;
      //
      // assegno le nuove dimensioni
      obj.style.height = ((newHeight < 0) ? 0 : newHeight) + "px";
    }
  }
}


// **********************************************
// Applica il cursore all'oggetto e a tutti i suoi figli
// **********************************************
GlobalObject.prototype.ApplyCursor = function(obj, curs)
{
  obj.style.cursor = curs;
  //
  var i;
  var c = obj.childNodes;
  var l = c.length;
  for (i=0; i<l; i++)
   {
     if (c[i].style)
      c[i].style.cursor = curs;
  }
}


// ***************************************************
// Ritorna TRUE se il campo e' numerico
// ***************************************************
GlobalObject.prototype.IsNumericObject= function (dt)
{
  return dt==1 || dt==2 || dt==3 || dt==4; // DT_NUM_CURRENCY||DT_NUM_FIXED||DT_NUM_FLOAT||DT_NUM_INTEGER 
}

// ****************************************************************
// Ritorna TRUE se il campo e' data o data/ora, (non se e' solo ora)
// ****************************************************************
GlobalObject.prototype.IsDateTimeObject= function (dt)
{
  return dt==6 || dt==8; // DT_DATE || DT_DATETIME 
}

// ****************************************************************
// Ritorna TRUE se il campo e' data, data/ora o ora
// ****************************************************************
GlobalObject.prototype.IsDateOrTimeObject= function (dt)
{
  return dt==6 || dt==7 || dt==8; // DT_DATE || DT_TIME || DT_DATETIME 
}

GlobalObject.prototype.GetDateMask = function (dt)
{
  if (dt == 6)
    return RD3_ServerParams.DateMask;
  else if (dt == 7)
    return RD3_ServerParams.TimeMask;
  else if (dt == 8)
    return RD3_ServerParams.DateMask + " " + RD3_ServerParams.TimeMask;
  return "";
}

// **********************************************
// Torna true se il browser e' InternetExplorer
// operation: undefined ==, false <, true >=
// **********************************************
GlobalObject.prototype.IsIE= function(ver, operation)
{
  if (this.uaIE==undefined)
  {
    this.uaIE = navigator.userAgent.indexOf("MSIE")>-1;
    this.uaIEVer = parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("MSIE ")+5));
    //
    // Internet Explorer 11 user agent: 
    //    Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; rv:11.0) like Gecko
    if (!this.uaIE && (navigator.userAgent.indexOf("Trident/7.0") != -1 || navigator.userAgent.indexOf("Trident/8.0") != -1))
    {
      this.uaIE = true;
      this.uaIEVer = 11;
    }
  }
  //
  if (!ver)
    return this.uaIE;
  else
  {
    if (operation == undefined)
      return (this.uaIE && this.uaIEVer==ver);
    if (operation == false)
      return (this.uaIE && this.uaIEVer<ver);
    else
      return (this.uaIE && this.uaIEVer>=ver);
  }
}

// **********************************************
// Torna true se il browser e' Safari
// **********************************************
GlobalObject.prototype.IsSafari= function(ver)
{
  if (this.uaSafari==undefined)
  {
    // Non deve contenere la stringa IEMobile, altrimenti e' un IE11 che finge di essere un safari
    this.uaSafari = navigator.userAgent.indexOf("IEMobile")==-1 && navigator.userAgent.indexOf("Safari")>-1 && navigator.userAgent.indexOf("Chrome") < 0;
    this.uaSafariVer = parseInt(navigator.userAgent.substring(navigator.userAgent.indexOf("Version/")+8));
  }
  //
  if (!ver)
    return this.uaSafari;
  else
    return (this.uaSafari && this.uaSafariVer==ver);
}


// **********************************************
// Torna true se il browser e' un iPhone
// **********************************************
GlobalObject.prototype.IsIphone= function(ver)
{
  if (this.uaIphone==undefined)
  {
    // Non deve contenere la stringa IEMobile, altrimenti e' un IE11 che finge di essere un safari
    this.uaIphone = navigator.userAgent.indexOf("IEMobile")==-1 && navigator.userAgent.indexOf("iPhone")>-1;
    this.uaIphoneVer = parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf("Version/")+8, 2));
    //
    // Se sono dentro l'IPA lo UserAgent e' diverso
    if (this.uaIphone && !this.uaIphoneVer && navigator.userAgent.indexOf("Version/") == -1 && navigator.userAgent.indexOf(" OS "))
      this.uaIphoneVer = parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf(" OS ")+4, 2));
    //
    if (this.uaIphoneVer && this.uaIphoneVer.trim)
      this.uaIphoneVer = this.uaIphoneVer.replace(".", "").trim();
  }
  //
  if (!ver)
    return this.uaIphone;
  else
    return (this.uaIphone && this.uaIphoneVer>=ver);
}


// **********************************************
// Torna true se il browser e' un iPad
// **********************************************
GlobalObject.prototype.IsIpad= function(ver)
{
  if (this.uaIpad==undefined)
  {
    // Ipad nell'useragent : vecchi ipad (o IPA) / safari + eventi touch + !iphone  = nuovi ipad
    this.uaIpad = navigator.userAgent.indexOf("iPad")>-1 || (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("iPhone") == -1 && navigator.userAgent.indexOf("Chrome") == -1 && 'ontouchstart' in window);
    this.uaIpadVer = parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf("Version/")+8, 2));
    //
    // Se sono dentro l'IPA lo UserAgent e' diverso
    if (this.uaIpad && !this.uaIpadVer && navigator.userAgent.indexOf("Version/") == -1 && navigator.userAgent.indexOf(" OS "))
      this.uaIpadVer = parseInt(navigator.userAgent.substr(navigator.userAgent.indexOf(" OS ")+4, 2));
    //
    if (this.uaIpadVer && this.uaIpadVer.trim)
      this.uaIpadVer = this.uaIpadVer.replace(".", "").trim();
  }
  //
  if (!ver)
    return this.uaIpad;
  else
    return (this.uaIpad && this.uaIpadVer>=ver);
}


// **********************************************
// Torna true se il browser e' un Android
// **********************************************
GlobalObject.prototype.IsAndroid= function(maj, minor, branch)
{
  if (this.uaAndroid==undefined)
  {
    // Non deve contenere la stringa IEMobile, altrimenti e' un IE11 che finge di essere un android
    this.uaAndroid = navigator.userAgent.indexOf("IEMobile")==-1 && navigator.userAgent.indexOf("Android")>-1;
    //
    try
    {
      var androidVer = "";
      //
      if (navigator.userAgent.indexOf("Shell")!=-1)
      {
        var androidIdx = navigator.userAgent.indexOf("Version/");
        androidVer = navigator.userAgent.substr(androidIdx+8)
      }
      else
      {
        var androidIdx = navigator.userAgent.indexOf("Android");
        var endverIdx = navigator.userAgent.indexOf(";", androidIdx);
        androidVer = navigator.userAgent.substring(androidIdx+8, endverIdx)
      }
      //
      var vers = androidVer.split(".");
      this.uaAndroidMajorVer = vers[0];
      this.uaAndroidMinorVer = vers[1];
      this.uaAndroidBuildVer = vers[2];
    }
    catch (ex)
    {
      this.uaAndroidMajorVer = 4;
      this.uaAndroidMinorVer = 0;
      this.uaAndroidBuildVer = 3;
    }
  }
  //
  if (!maj)
    return this.uaAndroid;
  else
  {
    var ok = false;
    if (this.uaAndroidMajorVer > maj)
      ok = true;
    else if (this.uaAndroidMajorVer == maj && this.uaAndroidMinorVer > minor)
      ok = true;
    else if (this.uaAndroidMajorVer == maj && this.uaAndroidMinorVer == minor && this.uaAndroidBuildVer >= branch)
      ok = true;
    return this.uaAndroid && ok;
  }
}


// **********************************************
// Torna true se il browser e' toccabile
// **********************************************
GlobalObject.prototype.IsTouch= function()
{
  return this.IsIpad() || this.IsIphone() || this.IsAndroid() || (this.IsIE(10,true) && this.IsMobile() && window.navigator.msMaxTouchPoints>0);
}



// **********************************************
// Torna true se il browser e' Safari
// **********************************************
GlobalObject.prototype.IsFirefox= function(ver)
{
  if (this.uaFirefox==undefined)
  {
    this.uaFirefox = navigator.userAgent.indexOf("Firefox")>-1;
    var ffxidx = navigator.userAgent.indexOf("Firefox/");
    this.uaFirefoxVer = Math.floor(parseFloat(navigator.userAgent.substring(ffxidx+8, ffxidx+12)));
  }
  //
  if (!ver)
    return this.uaFirefox;
  else
    return (this.uaFirefox && this.uaFirefoxVer==ver);
}


// **********************************************
// Torna true se il browser e' Microsoft Edge
// **********************************************
GlobalObject.prototype.IsEdge= function()
{
  if (this.uaEdge==undefined)
    this.uaEdge = navigator.userAgent.indexOf("Edge/")>-1;
  return this.uaEdge;
}


// **********************************************
// Torna true se il browser e' Chrome
// **********************************************
GlobalObject.prototype.IsChrome= function()
{
  if (this.uaChrome==undefined)
    this.uaChrome = navigator.userAgent.indexOf("Safari")>-1 && navigator.userAgent.indexOf("Chrome") > -1;
  return this.uaChrome;
}


// **********************************************
// Torna true se il browser e' webkit
// **********************************************
GlobalObject.prototype.IsWebKit= function()
{
  return this.IsChrome() || this.IsSafari() || (this.IsTouch() && !this.IsIE());
}


// **********************************************
// Fa in modo che l'evento venga veramente cancellato
// **********************************************
GlobalObject.prototype.StopEvent= function(eve)
{
  if (eve.preventDefault)
  {
    eve.preventDefault();
    eve.stopPropagation();
  }
  else
  {
    try
    {
      eve.keyCode = 505;
      eve.keyCode = 0;
    }
    catch(ex)
    {
    }
    eve.returnValue = false;
    eve.cancelBubble = true;
  }
}


// ****************************************************
// FUNZIONE RD2
// Restituisce un frame per nome (cross-browser)
// ****************************************************
function GetFrame(af, nome)
{
  var fr = null;
  if (document.all)
    fr = af[nome];
  else
  {
    for (var i = 0; i<af.length; i++ ) 
    {
      // Protezione, se il frame e' remoto non posso accedere alle sue informazioni (name).. in quel caso vado avanti
      try
      {
        var s=af[i].name;
        if (s.indexOf(nome)!=-1) 
        {
          fr = af[i];
          break;
        }
      }
      catch (ex) {}
    }
  }
  //
  return (fr) ? fr : window;
}

// **********************************************
// FUNZIONE RD2
// Mi dice se un oggetto e' UNDEFINED
// **********************************************
function IsUndefined(obj)
{
  var ris=false;
  try
  {
    var z=obj.tagName;
  }
  catch(e) 
  { 
    ris=true; 
  };
  return ris;
}

// *******************************************************
// Restituisce la posizione del lato bottom dell'oggetto
// *******************************************************
GlobalObject.prototype.CalcBottom = function(element)
{
  var h = element.offsetHeight;
  //
  if (element.offsetTop)
    h += element.offsetTop;
  //
  return h;
}


// *******************************************************
// Definisce un oggetto di tipo rettangolo
// *******************************************************
function Rect(x,y,w,h)
{
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
}


// ****************************************************
// Restituisce una proprieta' di stile
// ****************************************************
GlobalObject.prototype.GetCurrentStyle = function(elemento)
{
  if (elemento.currentStyle)
    return(elemento.currentStyle);
  //
  if(document.defaultView && document.defaultView.getComputedStyle)
    return(document.defaultView.getComputedStyle(elemento,""));
  //
  return null;
}


// ****************************************************
// Restituisce una proprieta' di stile
// ****************************************************
GlobalObject.prototype.GetStyleProp = function(elemento,prop)
{
  if (elemento.currentStyle)
    return(elemento.currentStyle[prop]);
  //
  if(document.defaultView.getComputedStyle)
    return(document.defaultView.getComputedStyle(elemento,'')[prop]);
  //
  return null;
}


// *****************************************************************
// Restituisce true se il nodo contiene un figlio di primo
// livello con il nome desiderato
// *****************************************************************
GlobalObject.prototype.HasNode = function(node, tag)
{
  if (node.hasChildNodes())
  {
    var l = node.childNodes;
    var n = l.length;
    for (var i=0; i<n; i++)
    {
      if(l[i].nodeName == tag)
        return true;
    }
  }
  //
  return false;
}


// *****************************************************************
// Risale la catena dei padri fino a che trova un nodo RD3 con un id
// valido (e restituisce l'ID trovato)
// *****************************************************************
GlobalObject.prototype.GetRD3ObjectId = function(obj)
{
  var id = obj.id;
  //
  var objt = obj;
  while ((id == "" || !this.IsRD3Identifier(id)) && objt.parentNode)
  {
    id = objt.parentNode.id;
    //
    objt = objt.parentNode;
  }
  //
  return id;
}


// *****************************************************************
// Risale la catena dei padri fino a che trova un nodo RD3 con un id
// valido e restituisce il Nodo (non l'ID)
// *****************************************************************
GlobalObject.prototype.GetParentRD3Object = function(obj)
{
  var objt = obj;
  while (objt)
  {
    if (objt.id && this.IsRD3Identifier(objt.id))
      return objt;
    //
    objt = objt.parentNode;
  }
  //
  return null;
}


// *****************************************************************
// Restituisce true se l'id e' un identificativo RD3 valido
// (lungo almeno 4 caratteri, con un : come quarto carattere)
// *****************************************************************
GlobalObject.prototype.IsRD3Identifier = function(id)
{
  if ((id && id.length>=4 && id.indexOf(":") == 3) || (id && id == "wep"))
    return true;
  else
    return false;
}


// *****************************************************************
// Restituisce true se il nodo contiene un figlio di primo
// livello con il nome desiderato
// *****************************************************************
GlobalObject.prototype.LoadJsCssFile = function (fn, first, ext, callback) { GlobalObject.LoadJsCssFile(fn, first, ext, callback); }
GlobalObject.LoadJsCssFile = function(fn, first, ext, callback)
{
  if (!ext)
  {
    // Calcolo l'estensione
    if (fn.lastIndexOf(".") != -1)
      ext = fn.substring(fn.lastIndexOf(".") + 1);
    else
      ext = "";
  }
  //
  // Se e' buona la gestisco
  var newel = null;
  if (ext.toUpperCase() == "JS")
  {
    newel = document.createElement('script')
    newel.setAttribute("type", "text/javascript")
    newel.setAttribute("src", fn)
  }
  else if (ext.toUpperCase() == "CSS")
  {
    if (typeof fetch == "undefined")
    {
      newel = document.createElement("link")
      newel.setAttribute("rel", "stylesheet")
      newel.setAttribute("type", "text/css")
      newel.setAttribute("href", fn)
    }
    else
    {
      fetch(fn)
        .then(function (response) { return response.text(); })
        .then(function (css) {
          if (css) {
            obj = document.createElement("style");
            obj.type = "text/css";
            obj.appendChild(document.createTextNode(css));
            //
            var h = document.getElementsByTagName("head")[0];
            if (first && h.firstChild)
              h.insertBefore(obj, h.firstChild);
            else
              h.appendChild(obj);
          }
          //
          if (callback)
            callback();
        });
      //
      return;
    }
  }
  //
  if (callback)
  {
    if (newel.attachEvent)
    {
      // IE8-
      newel.onreadystatechange = function ()
      {
        //once the script is loaded, run the callback
        if (newel.readyState === "loaded" || newel.readyState === "complete")
          callback();
      };
    }
    else
    {
      newel.onload = function () { callback() };
      newel.onerror = function () { callback(new Error("Error loading " + fn)); };
    }
  }
  //
  // Se ho creato l'oggetto lo aggiungo all'HEAD
  if (newel)
  {
    var h = document.getElementsByTagName("head")[0];
    if (first && h.firstChild)
      h.insertBefore(newel, h.firstChild);
    else
      h.appendChild(newel);
  }
}


// **********************************************************
// Converte un valore in mm o inch in pixel
// um: unita' di misura, in o mm
// **********************************************************
GlobalObject.prototype.ConvertIntoPx = function(value, um)
{
  if (um == "mm")
    return value * 96.0/25.4;
  else
    return value * 96.0;
}


// **********************************************************
// Converte un rect da pixel a mm o inch
// um: unita' di misura, in o mm
// **********************************************************
GlobalObject.prototype.ConvertRectPxIntoUM = function(rect, um)
{
  if (um == "mm")
  {
    rect.x = rect.x / (96.0/25.4);
    rect.y = rect.y / (96.0/25.4);
    rect.w = rect.w / (96.0/25.4);
    rect.h = rect.h / (96.0/25.4);
  }
  else
  {
    rect.x = rect.x / 96.0;
    rect.y = rect.y / 96.0;
    rect.w = rect.w / 96.0;
    rect.h = rect.h / 96.0;
  }
}


// **********************************************************
// Converte un valore da pixel a mm o inch
// um: unita' di misura, in o mm
// **********************************************************
GlobalObject.prototype.ConvertPxIntoUM = function(value, um)
{
  if (um == "mm")
  {
    return value / (96.0/25.4);
  }
  else
  {
    return value / 96.0;
  }
}

// **********************************************************
// Restituisce il SRC dell'immagine
// **********************************************************
GlobalObject.prototype.GetImgSrc = function(imgid)
{
  // Vuoto = Vuoto
  if (imgid == "" || imgid==null || imgid==undefined)
    return "";
  //
  var imsrc = this.ImagesCache[imgid];
  if (!imsrc)
  {
    // Non e' nella mappa... la cerco
    if (this.uaIE && this.uaIEVer<8)
    {
      // Sono su IE7<... che usa un IFRAME con un messaggio MULTIPART... cerco il frame
      // e cerco all'interno del frame
      var imfrm = document.getElementById('ImgFrm');
      if (imfrm)
      {
        var im = imfrm.contentWindow.document.getElementById(imgid);
        if (im)
          imsrc = im.src;
      }
    }
    else
    {
      // Altri browser... uso un DIV normale...
      var im = document.getElementById(imgid);
      if (im)
        imsrc = im.src;
    }
    //
    if (imsrc)
      this.ImagesCache.add(imgid, imsrc);
  }
  //
  if (imsrc)
    return imsrc;
  else
    return imgid;
}

// **********************************************************
// Cerca un oggetto nell'array per ID
// **********************************************************
GlobalObject.prototype.FindObjById = function(arr, id)
{
  if (id != "")
  {
    var idx=0;
    for (idx=0; idx<arr.length; idx++)
    {
      if (arr[idx].Identifier==id)
        return idx;
    }
  }
  //
  return -1;
}

// **********************************************************
// Torna TRUE se il MimeType fornito e' buono per essere
// mostrato in una preview window
// **********************************************************
GlobalObject.prototype.BlobShowPreview = function(mime)
{
  // Se il MIME e' sconosciuto... la Preview non e' una buona idea!
  if (!mime)
    return false;
  //
  // IE e' bravo con il plugin di word
  if (this.IsIE(10, false) && mime=="application/msword")
    return true;
  //
  // Immagini, testo, pdf
  if (mime.indexOf("image/")!=-1 || mime=="application/pdf" || mime.indexOf("text/")!=-1)
    return true;
  //
  // Niente da fare... meglio una nuova finestra del browser!
  return false;
}


// **********************************************************
// Torna TRUE se l'elemento ha la classe CSS attiva
// **********************************************************
GlobalObject.prototype.HasClass = function(ele, cls)
{
  if (!ele || !ele.className)
    return false;
  //
  var clName = " " + ele.className + " ";
  return (clName && clName.indexOf && clName.indexOf(" " + cls + " ")>=0);
}


// **********************************************************
// Aggiunge la classe all'elemento
// **********************************************************
GlobalObject.prototype.AddClass = function(ele, cls)
{
  if (!ele) return;
  if (!this.HasClass(ele,cls))
  {
    var s = ele.className;
    if (s.charAt(s.length-1)!=" ")
      s+=" ";
    s+=cls;
    ele.className = s;
  }
}


// **********************************************************
// Toglie la classe all'elemento
// **********************************************************
GlobalObject.prototype.RemoveClass = function(ele, cls)
{
  if (!ele) return;
  if (this.HasClass(ele,cls))
  {
    var s = ele.className;
    s = s.replace(cls, "");
    s = this.Trim(s);
    ele.className = s;
  }
}

// **********************************************************
// Toglie la classe all'elemento controllando correttamente
// l'univocita'
// **********************************************************
GlobalObject.prototype.RemoveClass2 = function(ele, cls)
{
  if (!ele) return;
  if (this.HasClass(ele,cls))
  {
    var s = " " + ele.className + " ";
    s = s.replace(" " + cls + " ", " ");
    s = this.Trim(s);
    ele.className = s;
  }
}

// **********************************************************
// Aggiunge o toglie la classe all'elemento
// **********************************************************
GlobalObject.prototype.SetClass = function(ele, cls, fladd)
{
  if (fladd)
    this.AddClass(ele,cls);
  else
    this.RemoveClass(ele,cls);
}


// **********************************************************
// Sostituisce una classe sull'elemento, decide anche la direzione
// **********************************************************
GlobalObject.prototype.SwitchClass = function(obj, cls1, cls2, fl12)
{
  if (!fl12)
  {
    var t = cls1; cls1=cls2; cls2=t;
  }
  if (this.HasClass(obj,cls1))
  {
    this.RemoveClass(obj,cls1);
    this.AddClass(obj,cls2);
  }
}


// **********************************************************
// Trim di una stringa
// **********************************************************
GlobalObject.prototype.Trim = function (stringa)
{
  while (stringa.substring(0,1) == " ")
    stringa = stringa.substring(1, stringa.length);
  while (stringa.substring(stringa.length-1, stringa.length) == " ")
    stringa = stringa.substring(0,stringa.length-1);
  return stringa;
}


// **********************************************************
// Restituisce l'URL assoluta del server, solo su IE+https
// **********************************************************
GlobalObject.prototype.GetAbsolutePath = function()
{
  // Gestiamo il perscorso assoluto solo per IE su https
  if (!RD3_Glb.IsIE() || window.location.protocol!="https:")
    return "";
  //
  var loc = window.location.href;
  //
  // Se l'URL non contiene / allora la restituisco tutta
  if (loc.lastIndexOf("/") == -1)
    return loc+"/";
  //
  // Restituisco l'URL fino all'ultimo /
  return loc.substring(0, loc.lastIndexOf("/"))+"/"; 
}


// **********************************************************
// Verifica se un url e' assoluto
// **********************************************************
GlobalObject.prototype.IsAbsoluteUrl = function(url)
{
  if (url.substr(0, 5) == "blob:")
    return true;
  if (url.substr(0, 5) == "data:")
    return true;
  if (url.substr(0, 5) == "http:")
    return true;
  if (url.substr(0, 6) == "https:")
    return true;
  return false;
}


// ************************************************************
// Posizione finale della selezione su di un campo Input
// ************************************************************
GlobalObject.prototype.getSelEnd = function(objInput)
{
  if( typeof(objInput.selectionEnd) != "undefined" )
    return objInput.selectionEnd;
  else 
  {
    var t1,t2;  
    var i1;
    //
    t1 = document.selection.createRange();
    //
    if (t1.text=="")
      return getCursorPos(objInput);
    //
    t2 = objInput.createTextRange();
    i1= 0;
    try
    {
      while (t2.compareEndPoints("StartToEnd",t1))
      {
        i1++;
        t2.moveStart("character");
      }
      //
      return i1;
    }
    catch (ex)
    {
      // In IE non si riesce a sapere la posizione del cursore nelle TEXTAREA
      return -1;
    }
  }
}


// ***************************************************************************
// Restituisco la posizione iniziale o finale della selezione in una textarea
// endPoint = true posizione finale, altrimenti iniziale
// ***************************************************************************
GlobalObject.prototype.getTextAreaSelection = function(objInput, endPoint)
{
  if( typeof(objInput.selectionStart) != "undefined" )
  {
    if (endPoint)
      return objInput.selectionEnd;
    else
      return objInput.selectionStart;
  }
  else 
  {
    try
    {
      // Leggo la selezione corrente
      var range = document.selection.createRange();
      var rangeCopy = range.duplicate();
      //
      // Seleziono tutto il testo della textArea
      rangeCopy.moveToElementText(objInput);
      //
      // Spostiamo il 'dummy' end point alla end point del range originale
      rangeCopy.setEndPoint( 'EndToEnd', range );
      //
      // Calcoliamo il punto di partenza
      var start = rangeCopy.text.length - range.text.length;
      //
      if (endPoint)
        return (start + range.text.length);
      else
        return start;
    }
    catch (ex)
    {
      // Se ci sono problemi restituisco -1
      return -1;
    }
  }
}


// *************************************************************
// Esegue l'encoding HTML delle costanti
// *************************************************************
GlobalObject.prototype.HTMLEncode = function(value)
{
  var res = value;
  //
  // ampersands (&)
  res = res.replace(/&/g,'&amp;');
  //
  // less-thans (<)
  res = res.replace(/</g,'&lt;');
  //
  // greater-thans (>)
  res = res.replace(/>/g,'&gt;');
  //
  return res
}


// *************************************************************
// Illumina un oggetto toccato
// *************************************************************
GlobalObject.prototype.TouchHL = function(obj, hlclass, bset, delay)
{
  if (hlclass==undefined)
    hlclass="panel-field-active";
  if (bset==undefined)
    bset=true;
  if (delay==undefined)
    delay = RD3_ClientParams.TouchHLDelay;
  //
  while (obj && obj.id=="")
    obj=obj.parentNode;
  //
  if (obj)
  {
    if (!bset)
    {
      this.RemoveClass(obj,hlclass);
    }
    else
    {
      this.AddClass(obj,hlclass);
      if (delay>0)
        window.setTimeout("RD3_Glb.RemoveClass(document.getElementById('"+obj.id+"'),'"+hlclass+"')",delay);              
    }
  }
}


// *************************************************************
// Torna vero se l'oggetto indicato e' un input editabile
// *************************************************************
GlobalObject.prototype.IsEditFld = function(obj)
{
  if (RD3_Glb.isInsideEditor(obj))
    return true;
  //
  if (obj.tagName!="INPUT")
    return false;
  //
  var s = obj.type;
  return (s=="text" || s=="number" || s=="tel" || s=="date" || s=="time" || s=="datetime");
}


// *************************************************************
// Ritorna l'oggetto alle coordinate del cursore
// *************************************************************
GlobalObject.prototype.ElementFromPoint = function(sx, sy)
{
  var obj = document.elementFromPoint(sx, sy);
  if (obj && obj.nodeType == 3) 
    obj = obj.parentNode;
  return obj;
}


// *************************************************************
// ritorna l'oggetto webframe in cui e' contenuto l'oggetto DOM indicato
// *************************************************************
GlobalObject.prototype.GetParentFrame = function(domobj)
{
  if (this.isInsideEditor(domobj) && domobj.tagName!="IFRAME")
  {
    var idEd = domobj.ownerDocument.IDOwnerObject;
    if (idEd && idEd.indexOf("ide:")==0)
    {
      var obj = RD3_DesktopManager.ObjectMap[idEd];
      if (obj && obj instanceof IDEditor)
        domobj = obj.EditorObj;
    }
  }
  //
  while (domobj)
  {
    if (this.HasClass(domobj, "frame-container"))
      return RD3_DDManager.GetObject(domobj.id);
    //
    domobj = domobj.parentNode;
  }
  //
  return null;
}

// *************************************************************
// Imposta il display di un oggetto, su IE imposta anche la 
// visibility, per correggere un baco
// *************************************************************
GlobalObject.prototype.SetDisplay = function(domobj, displ, force)
{
  if (!domobj)
    return;
  //
  var s = domobj.style;
  //
  s.display = displ;
  if (RD3_Glb.IsIE(10, false) || force)
    s.visibility = (displ == "none") ? "hidden" : "";
}


// *************************************************************
// Ritorna TRUE se sto utilizzando il tema Mobile
// *************************************************************
GlobalObject.prototype.IsMobile = function()
{
  return (typeof(RD3_Mobile) != "undefined" && RD3_Mobile);
}


// *************************************************************
// Ritorna TRUE se sto utilizzando il tema Mobile di iOS7
// *************************************************************
GlobalObject.prototype.IsMobile7 = function()
{
  return (typeof(RD3_Mobile7) != "undefined" && RD3_Mobile7);
}


// *************************************************************
// Ritorna TRUE se sto utilizzando il tema Mobile QUADRO
// *************************************************************
GlobalObject.prototype.IsQuadro = function()
{
  return (RD3_ServerParams.Theme.startsWith("quadro"));
}


// *************************************************************
// Ritorna TRUE se sto utilizzando uno smartphone
// *************************************************************
GlobalObject.prototype.IsSmartPhone= function()
{
  if (this.IsPhone==undefined) {
    this.IsPhone = this.IsMobile() && window.innerWidth<=850 && window.innerHeight<=850;
    //
    // Iphone XS e XSMax hanno nuovamente rotto le dimensioni, allora cambiamo approccio: se l'userAgent dice 'iphone' allora e' di sicuro un telefono,
    // indipendentemente dalle sua dimensioni
    if (!this.IsPhone && this.IsMobile() && this.IsIphone())
      this.IsPhone = true;
  }
  //
  return this.IsPhone;
}


// *************************************************************
// Calcola la posizione Y della matrice di traslazione 3d
// dell'oggetto passato come parametro
// *************************************************************
GlobalObject.prototype.TranslateY = function(obj)
{
  // Solo per mobile
  if (!this.IsMobile())
    return 0;
  //
  // In IE non si puo' piu' usare il computed style: converte il translate3d in una matrix3d da cui non e' possibile estrarre le coordinate
  if (RD3_Glb.IsIE(10, true)) 
  {
    var s = obj.style;
    var tr = RD3_Glb.GetTransform(s);
    tr = tr.replace(/3d/g, '');   // tanslate3d.. va rimosso il 3d perche' da' problemi dopo (e' un numero).
    var m = tr.replace(/[^0-9-.,]/g, '').split(',');
    try {
      var y = parseInt(m[1]);
      //
      if (isNaN(y))
        y=0;
      return y;
    }
    catch (ex) {
      return 0;
    }
  }
  else
  {
    var s = window.getComputedStyle(obj);
    var y = 0;
    var m = RD3_Glb.GetTransform(s).replace(/[^0-9-.,]/g, '').split(',');
    y = parseInt(m[5]);
    //
    if (isNaN(y))
      y=0;
    return y;
  }
}

GlobalObject.prototype.TranslateX = function(obj)
{
  // Solo per mobile
  if (!this.IsMobile())
    return 0;
  //
  // In IE non si puo' piu' usare il computed style: converte il translate3d in una matrix3d da cui non e' possibile estrarre le coordinate
  if (RD3_Glb.IsIE(10, true)) 
  {
    var s = obj.style;
    var tr = RD3_Glb.GetTransform(s);
    tr = tr.replace(/3d/g, ''); // tanslate3d.. va rimosso il 3d perche' da' problemi dopo (e' un numero).
    var m = tr.replace(/[^0-9-.,]/g, '').split(',');
    try {
      var x = parseInt(m[0]);
      //
      if (isNaN(x))
        x=0;
      return x;
    }
    catch (ex) {
      return 0;
    }
  }
  else
  {
    var s = window.getComputedStyle(obj);
    var x = 0;
    var m = RD3_Glb.GetTransform(s).replace(/[^0-9-.,]/g, '').split(',');
    var x = parseInt(m[4]);
    //
    if (isNaN(x))
      x=0;
    return x;
  }
}

// ********************************************************************************
// Evento di scrolling strambo di box varie durante translate
// ********************************************************************************
GlobalObject.prototype.NoScroll = function(ev)
{
  if (this.IsAndroid() && RD3_DesktopManager.WebEntryPoint.ScrollMobilePage)
  {
    RD3_DesktopManager.WebEntryPoint.ScrollMobilePage = false;
    return;
  }
  //
  var targetEl = ev.target ? ev.target : ev.srcElement;
  //
  // Elimino effetto spostamento strambo
  targetEl.scrollTop = 0;
  targetEl.scrollLeft = 0;
}


// ********************************************************************************
// Ordino gli elementi dell'array
// ********************************************************************************
GlobalObject.prototype.SortObj = function(a,b)
{
  return a.left-b.left; 
}

// ********************************************************************************
// calcoli i limiti destro e sinistro dei bottoni nella tb
// flcustom dice se deve considerare anche l'eventuale tb custom innestata
// ********************************************************************************
GlobalObject.prototype.GetToolbarLimit = function(tb, flcustom)
{ 
  var sx = 0;
  var dx = tb.offsetWidth;
  var limit = 24;
  //
  // carico nell'array tutti gli oggetti che devo posizionare
  var a = new Array();
  //
  var obj = tb.firstChild;
  while (obj)
  {
    if (obj.offsetWidth>0 && obj.offsetLeft>=0)
    {
      var entra = (obj.id=="menu-button-container" && obj.style.visibility=="");
      entra = entra || (flcustom && obj.style.visibility=="" && (this.HasClass(obj,"toolbar-frame-container") || this.HasClass(obj,"toolbar-form-container")));
      if (entra)
      {
        // Giro sugli oggetti interni e aggiungo anche quelli
        var obj2 = obj.firstChild;
        while (obj2)
        {
          if (obj2.offsetWidth>0 && !RD3_Glb.HasClass(obj2,"toolbar-separator") && obj2.style.display=="")
            a.push({obj:obj2,left:obj2.offsetLeft+obj.offsetLeft,right:obj2.offsetLeft+obj2.offsetWidth+obj.offsetLeft});
          obj2 = obj2.nextSibling;
        }
      }
      else
      {
        var oldObj = obj;
        //
        // Nel caso di container del menu-button su quadro considero suo figlio (il vero menu button)
        if (this.IsQuadro() && obj.id=="menu-button-container" && obj.firstChild)
          obj = obj.firstChild;
        //
        // Mobile7 usa l'hidden sul backbutton, ma la sua dimensione e' il 100% anche se e' nascosto.
        // Allora la mettiamo a 0 noi
        if (this.IsMobile7() && obj.id == "menu-button-container" && obj.style.visibility == "hidden")
          a.push({obj:obj,left:obj.offsetLeft,right:obj.offsetLeft});
        else if (obj.tagName!="SPAN")
          a.push({obj:obj,left:obj.offsetLeft,right:obj.offsetLeft+obj.offsetWidth});
        //
        obj = oldObj;
      }
    }
    obj = obj.nextSibling;
  }
  a = a.sort(RD3_Glb.SortObj);
  //
  for (var i=0;i<a.length;i++)
  {
    // Se il lato sx e' staccato, esco
    if (a[i].left-sx>limit)
      break;
    //
    sx = a[i].right;
  }
  //
  for (var i=a.length-1;i>=0;i--)
  {
    // Se il lato dx e' staccato, esco
    if (dx-a[i].right>limit)
      break;
    //
    dx = a[i].left;
  }
  //
  return {sx:sx, dx:dx};
}


// ********************************************************************************
// Ritorna il primo separatore della toolbar passata (custom)
// ********************************************************************************
GlobalObject.prototype.GetToolbarSeparator= function(tb)
{ 
  var obj = tb.firstChild;
  while (obj)
  {
    if (RD3_Glb.HasClass(obj,"toolbar-separator"))
      return obj;
    obj = obj.nextSibling;
  }
}


// ********************************************************************************
// Posiziona la caption del pannello in funzione dei bottoni presenti
// ********************************************************************************
GlobalObject.prototype.AdjustCaptionPosition= function(tbbox, ctxt)
{ 
  var dt = tbbox.offsetWidth;
  //
  // Non e' il momento
  if (dt==0)
    return;
  //
  // Elimino eventuali margini (se la videata viene ri-aperta passo da qui con
  // i magini gia' impostati e la offsetWidth e' meno del previsto)
  ctxt.style.marginLeft = "";
  ctxt.style.marginRight = "";
  ctxt.style.width = "";
  //
  var dc = ctxt.offsetWidth;
  var pd = RD3_Glb.GetToolbarLimit(tbbox, true);
  var pc = { sx:dt/2-dc/2, dx: dt/2+dc/2 };
  var ok = pd.sx<=pc.sx && pd.dx>=pc.dx;
  if (this.IsQuadro())
  {
    ok = false;
    pd.sx += 4;
    pd.dx -= 8;
  }
  //
  if (pd.sx<pd.dx && !ok)
  {
    ctxt.style.marginLeft = pd.sx+"px";
    ctxt.style.marginRight = (dt-pd.dx)+"px";
    if (RD3_Glb.IsMobile())
      ctxt.style.width = (pd.dx-pd.sx)+"px";
    //
    if (this.IsQuadro() || this.IsMobile7())
    {
      if (pd.sx == 4)
        ctxt.style.borderLeft = "none";
      else
        ctxt.style.borderLeft = "";
    }
  }
}


// ********************************************************************************
// Se la toolbar custom ha un separatore, allora sposta i comandi prima di esso
// dal lato sinistro della toolbar del pannello
// ********************************************************************************
GlobalObject.prototype.AdjustCustomToolbar= function(tbc, tbbox)
{ 
  var sep = this.GetToolbarSeparator(tbc);
  if (sep)
  {
    // Vediamo le posizioni possibili
    var pd = RD3_Glb.GetToolbarLimit(tbbox);
    pd.sx+=8;
    if (this.IsQuadro())
      pd.sx+=6;
    var w = pd.dx-pd.sx-tbc.offsetWidth+sep.offsetWidth;
    if (w>=0)
      sep.style.width = w+"px";
    else
      sep.style.width = "";
  }
}


// ********************************************************************************
// torna true se uno dei padri dell'oggetto ha come overflowY: scroll
// ********************************************************************************
GlobalObject.prototype.CanScroll= function(obj)
{ 
  while (obj) 
  {
    var st = null;
    try
    {
      st = window.getComputedStyle(obj)
    }
    catch(e) {}
    //
    if (st && st.overflowY=="scroll")
      return true;
    obj = obj.parentNode;
  }
}

// ********************************************************************************
// Restituisce la larghezza del Badge
// ********************************************************************************
GlobalObject.prototype.GetBadgeWidth= function(val, type)
{ 
  var bdg = document.createElement("DIV");
  bdg.className ="badge-"+type;
  bdg.innerHTML = val;
  bdg.style.position = "absolute";
  //
  document.body.appendChild(bdg);
  var dim = bdg.offsetWidth;
  document.body.removeChild(bdg);
  //
  return dim;
}


GlobalObject.prototype.SetBorderRadius = function(obj, val)
{ 
  if (this.IsIE(10, true))
    obj.style.borderRadius = val;
  else
    obj.style.webkitBorderRadius = val;
}

GlobalObject.prototype.SetTransitionProperty = function(obj, val)
{ 
  if (this.IsIE(10, true))
  {
    val = val.replace(/-webkit-transform/g, "transform");
    obj.style.transitionProperty = val;
  }
  else
  {
    obj.style.webkitTransitionProperty = val;
  }
}

GlobalObject.prototype.SetTransitionDuration = function(obj, val)
{ 
  if (this.IsIE(10, true))
    obj.style.transitionDuration = val;
  else
    obj.style.webkitTransitionDuration = val;
}

GlobalObject.prototype.SetTransform = function(obj, val)
{ 
  if (this.IsIE(10, true))
    obj.style.transform = val;
  else
    obj.style.webkitTransform = val;
}

GlobalObject.prototype.SetTransitionTimingFunction = function(obj, val)
{ 
  if (this.IsIE(10, true))
    obj.style.transitionTimingFunction = val;
  else
    obj.style.webkitTransitionTimingFunction = val;
}

GlobalObject.prototype.SetBorderTopLeftRadius = function(obj, val)
{ 
  if (this.IsIE(10, true))
    obj.style.borderTopLeftRadius = val;
  else
    obj.style.webkitBorderTopLeftRadius = val;
}

GlobalObject.prototype.SetBorderTopRightRadius = function(obj, val)
{ 
  if (this.IsIE(10, true))
    obj.style.borderTopRightRadius = val;
  else
    obj.style.webkitBorderTopRightRadius = val;
}

GlobalObject.prototype.AddEndTransaction = function(obj, funct, val)
{ 
  var eventN = this.IsIE(10, true) ? "transitionend" : "webkitTransitionEnd";
  obj.addEventListener(eventN, funct, val); 
}

GlobalObject.prototype.RemoveEndTransaction = function(obj, funct, val)
{ 
  var eventN = this.IsIE(10, true) ? "transitionend" : "webkitTransitionEnd";
  obj.removeEventListener(eventN, funct, val);
}

GlobalObject.prototype.GetTransitionDuration = function(obj)
{ 
  if (this.IsIE(10, true))
    return obj.style.transitionDuration;
  else
    return obj.style.webkitTransitionDuration;
}

GlobalObject.prototype.GetTransform = function(obj)
{ 
  // Questa funzione viene chiamata o con il computedStyle o con un'oggetto DOM
  if (obj.style)
    obj = obj.style;
  //
  if (this.IsIE(10, true))
    return obj.transform;
  else
    return obj.webkitTransform;
}

GlobalObject.prototype.GetTransitionTimingFunction = function(obj)
{ 
  if (this.IsIE(10, true))
    return obj.style.transitionTimingFunction;
  else
    return obj.style.webkitTransitionTimingFunction;
}

GlobalObject.prototype.IsPortrait = function(wantReal)
{ 
  if (!wantReal && RD3_DesktopManager.WebEntryPoint.CmdObj.ForceVerticalMenu)
    return true;
  //
  var portrait = RD3_DesktopManager.WebEntryPoint.WepBox.offsetHeight>RD3_DesktopManager.WebEntryPoint.WepBox.offsetWidth;
  //
  // Su Android 4.1 potrei usare lo screen, visto che wepBox cambia dimensioni quando la tastiera e' aperta (e magari diventa orizzontale anche se siamo verticali)
  // - su IOS Screen non funziona: non cambiano in base all'orientamento
  // - Android 4.2 si comporta come IOS, allora posso usare le MediaQueries (che funzionano anche in 4.1)
  if (this.IsAndroid())
    portrait = window.matchMedia("all and (orientation: portrait)").matches;
  //
  // Su iOS7 wep non va bene, uso la orientation
  if (this.IsIpad(7)  || this.IsIphone(7))
    portrait = window.orientation==0 || window.orientation == 180;
  //
  return portrait;
}

// ***************************************************************
// Se e' attivo il RETINA carica un'immagine fittizia per conoscerne le dimensioni
// Torna TRUE se c'e' un'operazione pendente (e quindi il chiamante non puo' proseguire)
// Torna FALSE se non c'e' nulla da fare
// ***************************************************************
GlobalObject.prototype.Adapt4Retina = function(objid, imageName, limit, par)
{
  // Se non e' uno dei temi che supportano retina, allora non faccio niente
  if (!RD3_Glb.IsMobile7() && !RD3_Glb.IsQuadro())
    return false;
  //
  // Se il parametro e' spento, non faccio nulla (tutto come prima)
  if (!RD3_ClientParams.MobileRetina) 
    return false;
  //
  // Se l'immagine e' vuota non ho niente da fare
  if (imageName == "")
    return false;
  //
  // Se contiene images/ lo tolgo... ci penso io a rimetterlo
  if (imageName.indexOf("images/") != -1)
    imageName = imageName.substring(imageName.indexOf("images/") + 7);
  imageName = imageName.replace(")","");
  //
  // Se non ho mai creato la mappa dei retina, la creo
  if (!this.RetinaMap)
    this.RetinaMap = new HashTable();
  //
  // Cerco l'immagine nella mappa
  var icon = this.RetinaMap[imageName];
  if (!icon || icon.width == 0)
  {
    // Se non ho mai visto prima questa immagine, creo una Icon per sapere quanto e' grande l'immagine
    icon = new Image();
    //
    // Metto questo oggetto nella mappa
    this.RetinaMap[imageName] = icon;
    //
    // Carico l'immagine nell'oggetto Image
    icon.onload = new Function("ev","return RD3_Glb.OnRetinaImageLoad('" + objid + "', '" + imageName + "', " + limit + (par!==undefined ? ", '" + par + "'" : "") + ")");
    icon.src = (imageName && imageName.startsWith("data:")) ? imageName : this.GetImgSrc("images/" + imageName);
  }
  else // Ho gia' visto prima questa immagine... simulo un onload
    setTimeout("RD3_Glb.OnRetinaImageLoad('" + objid + "', '" + imageName + "', " + limit + (par!==undefined ? ", '" + par + "'" : "") + ")", 1);
  //
  return true;
}

// *******************************************************
// Metodo che gestisce il cambio dello stato dell'immagine
// *******************************************************
GlobalObject.prototype.OnRetinaImageLoad = function(objid, imageName, limit, par)
{
  var obj = RD3_DesktopManager.ObjectMap[objid];
  if (!obj || (!obj.Realized && !(obj instanceof PValue) && !(obj instanceof IDCombo)))
    return;
  //
  // Ora estraggo dalla mappa l'oggetto associato a questa immagine
  var icon = this.RetinaMap[imageName];
  var iconH = icon.height;
  var iconW = icon.width;
  //
  // Sostituisco l'eventuale oggetto Image con un oggetto "piu' light" che non contiene l'immagine
  this.RetinaMap[imageName] = {width: iconW, height: iconH};
  //
  // Controllo le dimensioni dell'immagine e se eccede i "limit" px di altezza, 
  // allora dimezzo le dimensioni per farne una versione retina
  if (iconH > limit)
  {
    iconH = icon.height/2;
    iconW = icon.width/2;
  }
  //
  // Se mi arriva un PValue, devo cercare la PCell corrispondente
  if (obj instanceof PValue)
    obj = obj.ParentField.GetCurrentCell(obj.Index-1);
  //
  if (iconW && obj && obj.OnAdaptRetina)
    obj.OnAdaptRetina(iconW, iconH, par);
}

// *******************************************************************
// Restituisce true se l'oggetto e' un div editabile o un suo figlio
// ********************************************************************
GlobalObject.prototype.isInsideEditor = function(srcobj)
{
  // Se non uso IDEditor non faccio nessun controllo
  if(!RD3_ServerParams.UseIDEditor)
    return false;
  //
  if (this.IsMobile())
  {
    while (srcobj)
    {
      if (srcobj.tagName=="DIV" && srcobj.getAttribute("contentEditable") != null && srcobj.getAttribute("contentEditable").toLowerCase()=="true")
        return true;
      //
      srcobj = srcobj.parentNode;
    }
    //
    return false;
  } 
  //
  if (srcobj && srcobj.ownerDocument && (srcobj.ownerDocument.designMode=="on" || srcobj.ownerDocument.designMode=="On"))
    return true;
  //
  if (srcobj && srcobj.tagName=="IFRAME" && srcobj.src=="")
  {
    var doc = null;
    if (srcobj.contentDocument)
      doc = srcobj.contentDocument;
    else if (srcobj.contentWindow && srcobj.contentWindow.document)
      doc = srcobj.contentWindow.document;
    if (doc && (doc.designMode=="on" || doc.designMode=="On"))
      return true;
  }
  //
  // Ultimo test..
  if (srcobj && srcobj.ownerDocument && srcobj.ownerDocument.URL == "about:blank")
    return true;
  //
  return false;
}

GlobalObject.prototype.IsNodeChildOf = function(parentN, targetNode)
{
  var t = targetNode;
  while (t)
  {
    if (t == parentN)
      return true;
    t = t.parentNode;
  }
  //
  return false;
}

GlobalObject.prototype.AutocompleteOff = function (node) 
{
  if (this.AutocompleteTimer) 
  {
    clearTimeout(this.AutocompleteTimer);
    delete this.AutocompleteTimer;
  }
  //
  if (!this.InputList)
    this.InputList = [];
  this.InputList.push(node);
  //
  this.AutocompleteTimer = setTimeout(function () {
    for (var i = 0; i < RD3_Glb.InputList.length; i++) {
      var curInput = RD3_Glb.InputList[i];
      //
      // Attualmente off e' la scelta corretta, nel caso chrome cambi gestione e' possibile invertire le righe per ottenere un valore univoco
      var value = "off";
      //let value = Math.ceil(Math.random()*10000)+"-"+Math.floor(Math.random()*10000);
      if (curInput.getAttribute("type") === "password")
        value = "new-password";
      //
      if (curInput.className && curInput.className.indexOf("let-autocomplete-") >= 0) {
        var val = curInput.className.substring(curInput.className.indexOf("let-autocomplete-")).split(" ")[0];
        value = val ? val.replace("let-autocomplete-", "") : "on";
      }
      //
      curInput.setAttribute("autocomplete", value);
    }
    delete RD3_Glb.InputList;
    delete RD3_Glb.AutocompleteTimer;
  }, 350);
}

GlobalObject.prototype.IsRD3 = function () 
{
  return true;
}

GlobalObject.prototype.IsBts = function () 
{
  return false;
}

GlobalObject.prototype.IsIonic = function () 
{
  return false;
}

GlobalObject.SetCookie = function(name, value, exsecs)
{
  var d = new Date();
  d.setTime(d.getTime() + (exsecs * 1000));
  document.cookie = name + "=" + value + ";expires="+ d.toUTCString();
}

GlobalObject.SendCookies = function ()
{
  var cookies = document.cookie.split(";");
  var map = {};
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim().split("=");
    map[decodeURIComponent(cookie[0])] = decodeURIComponent(cookie[1]);
  }
  ExecuteOnWorker("self.cookies = " + JSON.stringify(map) + ";");
}

// *******************************************************************
// Compatibilita' per IE6
// ********************************************************************
if (String.prototype.startsWith == undefined)
{
  String.prototype.startsWith = function(str)
  {
    return (this.substr(0, str.length)== str);
  }
}

GlobalObject.prototype.IsCustomComponentChild= function(obj)
{ 
  while (obj) 
  {
    if (obj == document)
      return false;
    //
    if (obj.classList && obj.classList.contains("inde-custom-component"))
      return true;
    //
    if (obj.id && RD3_Glb.IsRD3Identifier(obj.id))
      return false;
    //
    obj = obj.parentNode;
  }
  //
  return false;
}

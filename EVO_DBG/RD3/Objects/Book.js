// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Book: Rappresenta un frame di tipo
// Book
// ************************************************

function Book(pform)
{
  // Chiamo il costruttore superiore
  WebFrame.call(this,pform);
  //
  // Proprieta' di questo oggetto di modello
  this.SelectedPage = 0;		          // La pagina selezionata nell'anteprima
  this.TotalPages = 0;                // Il numero totale di pagine del book
  this.TotalPagesConfirmed = false;   // Il numero totale di pagine e' quello definitivo?
  this.HideBorder = false;   					// Devo nascondere il bordo della pagina?
  this.WantDragHL = false;            // Vuole evidenziare il punto di drag delle box?
  this.WantDropRestore = true;        // Vuole ripristinare l'oggetto iniziale al momento del drop?
  this.EnabledCommands = -5;          // Maschera dei comandi abilitati (tutti tranne l'esportazione)
  this.CacheSize = 1;                 // Numero di pagine contemporaneamente presenti sul client
  this.FixedWidth = 0;                // Zona fissa a sinistra nelle pagine
  this.FixedHeight = 0;               // Zona fissa in alto nelle pagine
  //
  this.ScrollOrientation = 0;         // 0=orizzontale, 1=verticale
  this.SnapToPage = true;         		// true/false
  this.OptimizeDOM = false;	         	// se true organizza scrolling stile iBook
  //
  // Oggetti secondari gestiti da questo oggetto di modello
  this.Pages = new Array();        // Lista delle pagine dell'anteprima
  this.PlaceHolders = new Array(); // Lista dei placeholders al posto delle pagine
  this.MobilePageContainer = null; // Contenitore delle pagine che viene scrollato in caso mobile
  this.RefreshMobileContainer= true; // Indica se devo aggiornare il container visuale
  this.ForceSetPage = false; 				 // Indica se devo forzare l'aggiornamento della pagina nel container mobile
  //
  // Variabili per la gestione delle animazioni
  this.AnimatingNum = null;   // Numero della pagina che sto attualmente animando (null se non c'e' nessuna animazione in corso)
  this.ActivePage = 0;        // Numero della pagina attualmente selzionata nell'anteprima (durante l'animazione e' diversa da SelectedPage)
  this.Fx = null;             // Animazione in corso
  //
  // Struttura per la definizione degli eventi di questo pannello
  this.ToolbarEventDef = RD3_Glb.EVENT_ACTIVE;
  //
  // Oggetti visuali relativi alla Toolbar
  this.StatusBarTxt = null;              // Span contenitore della status bar
  this.ToolbarNav = null;             // Span contenitore delle immagini della toolbar di navigazione
  this.NextImg = null;                // Immagine avanti di una pagina
  this.PrevImg = null;                // Immagine indietro di una pagina
  this.BeginImg = null;               // Immagine Vai all'inizio
  this.EndImg = null;                 // Immagine Vai alla fine
  this.PrintImg = null;               // Immagine Stampa
  this.ExportImg = null;              // Immagine Esporta
  this.ToolbarSeparator1 = null;      // Separatore tra il nome del book ed i comandi di navigazione
  this.ToolbarSeparator2 = null;      // Separattore tra i comandi di navigazione ed il pulsante stampa
}
//
// Definisco l'estensione della classe
Book.prototype = new WebFrame();


// *******************************************************************
// Inizializza questo Tree leggendo i dati da un nodo <wfr> XML
// *******************************************************************
Book.prototype.LoadFromXml = function(node) 
{
  // Chiamo la classe base
  WebFrame.prototype.LoadFromXml.call(this,node);
  //
  // Carico nodi dell'albero
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
      case "pag":
      {
        // Leggo il nodo di primo livello, e poi passo il messaggio di caricamento
        // Attenzione: e' la Page che si infila nel punto giusto dell'array Pages
        var newnode = new BookPage(this);
        newnode.LoadFromXml(objnode);
      }
      break;
    }
  }    
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
Book.prototype.LoadProperties = function(node)
{
  // Chiamo la classe base
  WebFrame.prototype.LoadProperties.call(this,node);
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
      case "pag": this.SetSelectedPage(parseInt(valore)); break;
      case "ptt": this.SetTotalPages(parseInt(valore)); break;
      case "pcf": this.SetTotalPagesConfirmed(valore=="1"); break;
      case "hib": this.SetHideBorder(valore=="1"); break;
      case "enc": this.SetEnabledCommands(parseInt(valore)); break;
      case "dgp": this.DeletePage(parseInt(valore)); break;
      case "csz": this.SetCacheSize(parseInt(valore)); break;
      case "fiw": this.SetFixedWidth(parseInt(valore)); break;
      case "fih": this.SetFixedHeight(parseInt(valore)); break;
      case "scd": this.SetScrollDir(parseInt(valore)); break;
      case "fsn": this.SetForceSnap(valore=="1"); break;
      case "opt": this.SetOptimizeDOM(valore=="1"); break;
      
      case "tck": this.ToolbarEventDef = parseInt(valore); break;
      
      case "cpa": this.ChangePageAnimDef = valore; break;
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
Book.prototype.ChangeProperties = function(node)
{
  // Vediamo se nel nodo di cambiamento sono indicati anche nodi figli...
  var objlist = node.childNodes;
  //
  // In IE il primo nodo e' gia' l'elemento, negli altri il primo nodo e' un "\n"
  var pag = RD3_Glb.HasNode(node, "pag");
  //
  if (objlist.length>0 && pag)
  {
    // In questo caso elimino i figli miei e poi carico gli altri
    this.LoadFromXml(node);
    //
    // Realizzo le nuove pagine arrivate
    var reshow = false;
    if (RD3_Glb.IsFirefox(3) && this.Realized && this.ContentBox.style.display!="none")
    {
      // Spengo per un attimo il content box cosi' FFX non sfarfalla
      this.ContentBox.style.display = "none";
      reshow = true;
    }
    //
    if (this.Realized)
      this.Realize(null);
    //
    // Mostro (di nuovo?) la pagina selezionata
    this.SetSelectedPage(this.SelectedPage);
    //
    // Cambio la status bar del book
    this.SetCaption();
    //
    if (reshow && this.Realized)
      this.ContentBox.style.display = "";
  }
  else
  {
    // Normale cambio di proprieta'
    this.LoadProperties(node);
  }
}


// *******************************************************************
// Setter delle proprieta'
// *******************************************************************
Book.prototype.SetSelectedPage= function(value) 
{
	var old = this.SelectedPage;
  if (value!=undefined)
    this.SelectedPage = value;
  //
  if (this.Realized)
  {
    // Cerco la pagina attualmente selezionata e quella da selezionare
    var oldp = null;
    var newp = null;
    if (old!=this.SelectedPage)
    {
    	this.RefreshMobileContainer = true;
    	this.ForceSetPage = true;
    }
    //
    if (!RD3_Glb.IsMobile())
    {
	    var n = this.Pages.length;
	    for (var i=0; i<n; i++)
	    {
	      var p = this.Pages[i];
	      if (p)
	      {
	        // Se la pagina e' quella da selezionare me la memorizzo per fare l'animazione
	        if (p.Number == this.SelectedPage)
	        {  
	          newp = p;
	          //
	          if (p.Number == this.ActivePage)
	            oldp = p;
	        } 
	        else
	        {
	          // Se e' la pagina attualmente attiva me la memorizzo per fare l'animazione, altrimenti la disattivo per sicurezza
	          if (p.Number == this.ActivePage)
	            oldp = p;
	          else
	            p.SetActive(false);
	        }  
	      }
	    }
	    //
	    // Faccio l'animazione se devo cambiare veramente pagina (e ho una pagina nuova da mostrare..)
	    if (oldp != newp && newp)
	    {
	      // Decido la direzione dello spostamento true ingresso da sinistra, false ingresso da destra
	      var side = true;
	      if (oldp)
	      {
	        side = (oldp.Number >= newp.Number);
	      }  
	      //
	      // Se non ho una animazione in corso oppure se sto animando la pagina sbagliata eseguo la nuova animazione
	      if (!this.AnimatingNum || this.AnimatingNum != newp.Number)
	      {
	        this.Fx = new GFX("book", side, newp, value==undefined, oldp, this.ChangePageAnimDef);
	        RD3_GFXManager.AddEffect(this.Fx);
	        //
	        // Se l'animazione e' skippata va subito al Finish e annulla Fx e AnimatingNum, quindi in quel caso non devo
	        // impostare AnimatingNum, altrimenti dopo ci sara' un errore Javascript perche' c'e' AnimatingNum e non Fx
	        if (this.Fx)
	          this.AnimatingNum = newp.Number;
	      }
	    }
	    else if (this.SelectedPage==0 && oldp)
	    {
	      // Devo passare da una pagina a nessuna pagina
	      if (!this.AnimatingNum || this.AnimatingNum != 0)
	      {
	        this.Fx = new GFX("book", true, null, value==undefined, oldp, this.ChangePageAnimDef);
	        RD3_GFXManager.AddEffect(this.Fx);
	        //
	        // Se l'animazione e' skippata va subito al Finish e annulla Fx e AnimatingNum, quindi in quel caso non devo
	        // impostare AnimatingNum, altrimenti dopo ci sara' un errore Javascript perche' c'e' AnimatingNum e non Fx
	        if (this.Fx)
	          this.AnimatingNum = 0;
	      }
	    }
	  }
  }
}

Book.prototype.SetTotalPages= function(value) 
{
	var old = this.TotalPages;
  if (value!=undefined)
    this.TotalPages = value;
  //
  if (this.Realized)
  {
  	if (old!=this.TotalPages && value!=undefined)
  		this.RefreshMobileContainer = true;
    //
    // Se stavo mostrando una pagina e non ci sono piu' pagine, vado in pagina 0
    if (old!=this.TotalPages && this.SelectedPage && this.TotalPages == 0)
      this.SetSelectedPage(0);
  	//
    this.SetCaption();
  }
}

Book.prototype.SetTotalPagesConfirmed= function(value) 
{
	var old = this.TotalPagesConfirmed;
  if (value!=undefined)
    this.TotalPagesConfirmed = value;
  //
  if (this.Realized)
  {
  	if (old!=this.TotalPagesConfirmed && value!=undefined)
  		this.RefreshMobileContainer = true;
  	//
    this.SetCaption();
  }
}

Book.prototype.SetScrollDir= function(value) 
{
	var old = this.ScrollOrientation;
  if (value!=undefined)
    this.ScrollOrientation = value;
  //
  if (this.Realized)
  {
  	if (old!=this.ScrollOrientation && value!=undefined)
  		this.RefreshMobileContainer = true;
  }
}

Book.prototype.SetForceSnap= function(value) 
{
	var old = this.SnapToPage;
  if (value!=undefined)
    this.SnapToPage = value;
  //
  if (this.Realized)
  {
  	if (old!=this.SnapToPage && value!=undefined)
  		this.RefreshMobileContainer = true;
  }
}

Book.prototype.SetOptimizeDOM= function(value) 
{
	var old = this.OptimizeDOM;
  if (value!=undefined)
    this.OptimizeDOM = value;
  //
  if (this.Realized)
  {
  	if (old!=this.OptimizeDOM && value!=undefined)
  		this.RefreshMobileContainer = true;
  }
}


Book.prototype.SetHideBorder= function(value) 
{
  if (value!=undefined)
  {
    this.HideBorder = value;
    //
    if (this.Realized)
      this.ContentBox.className = "book-container"+(this.HideBorder?"-noborder":"");  
  }
}

Book.prototype.SetEnabledCommands = function(value)
{
  if (value!=undefined)
    this.EnabledCommands = value; 
  //
  if (this.Realized)
  {
    this.UpdateToolbar();
  }
}

Book.prototype.SetCacheSize = function(value)
{
  if (value!=undefined)
    this.CacheSize = value; 
}

Book.prototype.SetFixedWidth = function(value)
{
  var old = this.FixedWidth;
  if (value!=undefined)
    this.FixedWidth = value;
  //
  if (old != this.FixedWidth)
    this.UpdateFixed = true;
}

Book.prototype.SetFixedHeight = function(value)
{
  var old = this.FixedHeight;
  if (value!=undefined)
    this.FixedHeight = value; 
  //
  if (old != this.FixedHeight)
    this.UpdateFixed = true;
}

// ***************************************************************
// Elimina una particolare pagina dall'elenco delle pagine presenti nel client
// ***************************************************************
Book.prototype.DeletePage = function(value)
{
  var p = this.Pages[value];
  if (p)
    p.Unrealize();
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
Book.prototype.Realize = function(parent)
{
  var realizing = this.Realized;
  //
  // Chiamo la classe base
  if (!this.Realized)
    WebFrame.prototype.Realize.call(this,parent);
  //
  // cambio la classe e ridimensiono nuovamente il ContentBox per tenere conto di eventuali bordi
  this.ContentBox.className = "book-container"+(this.HideBorder?"-noborder":"");  
  //
  if (!realizing)
  	this.UpdateMobileContainer();
  //
  // Ora realizzo tutte le pagine non ancora realizzate pagina selezionata
  var n = this.Pages.length;
  for (var i=0; i<n; i++)
  {
    if (this.Pages[i])
    {
      this.Pages[i].Realize(this.MobilePageContainer?this.MobilePageContainer:this.ContentBox);
      //
      // Attivo le pagine solo durante la realizzazione iniziale: negli altri casi passo dalla SetSelectedPage con Realized = true
      if (!realizing)
        this.Pages[i].SetActive(this.Pages[i].Number == this.SelectedPage);
    }
  }
  //
  this.UpdateToolbar();
  this.UpdateFixedZones();
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
Book.prototype.AdaptLayout = function()
{ 
  // Se non sono realizzato non faccio nulla (es: potrei essere in una tab non ancora mostrata)
  if (!this.Realized)
    return;
  //
  // Faccio questo per eliminare eventuali scrollbar messe dai browser..
  var ov = this.ContentBox.style.overflow;
  this.ContentBox.style.overflow = "hidden";
  //
  // Chiamo la classe base
  WebFrame.prototype.AdaptLayout.call(this);
  //
  // Giro il messaggio alle pagine
  var n = this.Pages.length;
  for (var i=0; i<n; i++)
  {
    if (this.Pages[i])
      this.Pages[i].AdaptLayout();
  }
  //
  // Rimetto lo stile corretto, adesso che le dimensioni sono giuste sta al browser decidere se mettere o meno le scrollbar
  this.ContentBox.style.overflow = ov;
  //
  this.RefreshMobileContainer = true;
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
Book.prototype.AfterProcessResponse= function()
{ 
  // Chiamo la classe base che esegue un recalc layout se richiesto
  WebFrame.prototype.AfterProcessResponse.call(this);
  //
  // Giro il messaggio alle pagine
  var n = this.Pages.length;
  for (var i=0; i<n; i++)
  {
    if (this.Pages[i])
      this.Pages[i].AfterProcessResponse();
  }
  //
  if (this.RefreshMobileContainer)
  {
  	this.UpdateMobileContainer();
  	//
  	// Se devo ricalcolare il layout a causa dell'apparizione di una pagina, lo faccio subito
    if (this.RecalcLayout)
    {
  	  this.RecalcLayout = false;
      this.AdaptLayout();
      //
      // l'ho appena fatto!
      this.RefreshMobileContainer = false; 
  	}
  }
  //
  // Se devo aggiornare la zona fissa, lo faccio
  if (this.UpdateFixed)
  {
    this.UpdateFixed = false;
    this.UpdateFixedZones();
  }
}


//***************************************************************
// Metodi della classe base ridefiniti
//***************************************************************

// ***************************************************************
// Crea gli oggetti DOM relativi alla Toolbar
// ***************************************************************
Book.prototype.RealizeToolbar = function()
{
  // Chiamo il metodo base
  WebFrame.prototype.RealizeToolbar.call(this);
  //
  // Creo gli oggetti Dom Specifici di questa Toolbar
  this.StatusBarTxt = document.createElement("span")
  this.ToolbarNav = document.createElement("span");
  this.NextImg = document.createElement("img");
  this.PrevImg = document.createElement("img");
  this.BeginImg = document.createElement("img");
  this.EndImg = document.createElement("img");
  this.PrintImg = document.createElement("img");
  this.ExportImg = document.createElement("img");
  this.ToolbarSeparator1 = document.createElement("span");
  this.ToolbarSeparator2 = document.createElement("span");
	//  
  this.BeginImg.setAttribute("id", this.Identifier+":top");
  this.PrevImg.setAttribute("id", this.Identifier+":next");
  this.NextImg.setAttribute("id", this.Identifier+":prev");
  this.EndImg.setAttribute("id", this.Identifier+":bottom");
  this.ExportImg.setAttribute("id", this.Identifier+":print");
  //
  // Imposto le classi
  this.StatusBarTxt.className = (this.SmallIcons) ? "book-toolbarsmall-status" : "book-toolbar-status";
  this.NextImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
  this.PrevImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
  this.BeginImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
  this.EndImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
  this.PrintImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
  this.ExportImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
  this.ToolbarSeparator1.className = "book-toolbar-sep";
  this.ToolbarSeparator2.className = "book-toolbar-sep";
  //
  // Assegno i Tooltip RTC
  RD3_TooltipManager.SetObjTitle(this.NextImg, RD3_ServerParams.BookPaginaSucc);
  RD3_TooltipManager.SetObjTitle(this.PrevImg, RD3_ServerParams.BookPaginaPrec);
  RD3_TooltipManager.SetObjTitle(this.BeginImg, RD3_ServerParams.BookInizio);
  RD3_TooltipManager.SetObjTitle(this.EndImg, RD3_ServerParams.BookFine);
  RD3_TooltipManager.SetObjTitle(this.PrintImg, RD3_ServerParams.CreatePDF);
  RD3_TooltipManager.SetObjTitle(this.ExportImg, RD3_ServerParams.TooltipExport);
  //
  // Imposto la gestione dei vari click
  this.NextImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'next')");
  this.PrevImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'prev')");
  this.BeginImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'top')");
  this.EndImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'bottom')");
  this.PrintImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'print')");
  this.ExportImg.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolbarClick', ev, 'csv')");
  //
  // Gestione provvisoria Hilight bottoni
  this.NextImg.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.NextImg.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.NextImg.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.NextImg.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");  
  //
  this.PrevImg.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.PrevImg.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.PrevImg.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.PrevImg.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");  
  //
  this.BeginImg.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.BeginImg.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.BeginImg.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.BeginImg.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");  
  //
  this.EndImg.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.EndImg.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.EndImg.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.EndImg.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");  
  //
  this.PrintImg.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.PrintImg.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.PrintImg.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.PrintImg.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");  
  //
  this.ExportImg.onmouseover = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");
  this.ExportImg.onmousedown = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'down')");
  this.ExportImg.onmouseout = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, '')");
  this.ExportImg.onmouseup = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnToolMouseUse', ev, 'hover')");  
  //
  // Aggiungo gli elementi al DOM
  this.ToolbarBox.appendChild(this.StatusBarTxt);
  this.ToolbarBox.appendChild(this.ToolbarSeparator1);
  this.ToolbarBox.appendChild(this.ToolbarNav);
  this.ToolbarNav.appendChild(this.BeginImg);
  this.ToolbarNav.appendChild(this.PrevImg);
  this.ToolbarNav.appendChild(this.NextImg);
  this.ToolbarNav.appendChild(this.EndImg);
  this.ToolbarBox.appendChild(this.ToolbarSeparator2);
  this.ToolbarBox.appendChild(this.PrintImg);
  this.ToolbarBox.appendChild(this.ExportImg);
}

Book.prototype.SetSmallIcon= function(value) 
{
  if (value!=undefined)
    this.SmallIcons = value;
  //
  if (this.Realized)
  {
    if (!this.ChildBox1 && !this.ChildBox2)
    {
      var ext = (this.SmallIcons ? "_sm" : "");
      //
      // Aggiorno le classi degli oggetti della toolbar
      this.CollapseButton.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "")+" frame-collapse-button";
      this.ToolbarBox.className = (this.SmallIcons) ? "frame-toolbarsmall-container" : "frame-toolbar-container";      
      this.StatusBarTxt.className = (this.SmallIcons) ? "book-toolbarsmall-status" : "book-toolbar-status";
      this.NextImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
      this.PrevImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
      this.BeginImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
      this.EndImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
      this.PrintImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
      this.ExportImg.className = "book-toolbar-button" + ((this.SmallIcons)? "-small" : "");
      //
      // Imposto l'immagine corretta per il pulsante collapse
      if (!RD3_Glb.IsMobile())
      {
	      if (this.Collapsed)
	      {
	        this.CollapseButton.src = RD3_Glb.GetImgSrc("images/expand" + ext +".gif");
	        RD3_TooltipManager.SetObjTitle(this.CollapseButton, RD3_ServerParams.MostraRiquadro);
	      }
	      else
	      {
	        this.CollapseButton.src = RD3_Glb.GetImgSrc("images/collapse"+ ext +".gif");
	        RD3_TooltipManager.SetObjTitle(this.CollapseButton, RD3_ServerParams.NascondiRiquadro);
	      }
	      //
	      // Imposto le immagini per i pulsanti di navigazione e stampa
	      this.NextImg.src = RD3_Glb.GetImgSrc("images/next" + ext +".gif");
	      this.PrevImg.src = RD3_Glb.GetImgSrc("images/prev" + ext +".gif");
	      this.BeginImg.src = RD3_Glb.GetImgSrc("images/top" + ext +".gif");
	      this.EndImg.src = RD3_Glb.GetImgSrc("images/bottom" + ext +".gif");
	      this.PrintImg.src = RD3_Glb.GetImgSrc("images/print" + ext +".gif");
	      this.ExportImg.src = RD3_Glb.GetImgSrc("images/csv" + ext +".gif");
	    }
	    else
	    {
        // Se e' mobile, nascondo le immagini per i pulsanti di navigazione e stampa
        this.ToolbarNav.style.display = "none";
	      this.NextImg.style.display = "none";
	      this.PrevImg.style.display = "none";
	      this.BeginImg.style.display = "none";
	      this.EndImg.style.display = "none";
	      this.PrintImg.style.display = "none";
	      this.ExportImg.style.display = "none";
	    }
    }
  }
}

Book.prototype.SetCaption= function(value) 
{
  if (value!=undefined)
    this.Caption = value;
  //
  if (this.Realized && !this.OnlyContent)
  {
    var captxt = RD3_Glb.FormatMessage(RD3_ServerParams.PaginaNM, this.SelectedPage, this.TotalPages)+(this.TotalPagesConfirmed ? "" : "+");
    //
    this.CaptionTxt.innerHTML = this.Caption;
    //
    this.StatusBarTxt.innerHTML = (this.Caption != "" && this.Caption != " " ? ": " : "") + captxt;
    //
    // Se la toolbar e' scrollata e ho cambiato il messaggio, la rimetto a posto
    if (this.ToolbarBox.scrollLeft && this.TBScrollTimer==0 && !RD3_Glb.IsTouch())
       this.ScrollToolbar(-1);
    //
    // Caso mobile, sposto la caption in modo da non sovrapporsi con i bottoni se si puo'
    if (RD3_Glb.IsMobile()) 
    {
    	RD3_Glb.AdjustCaptionPosition(this.ToolbarBox, this.CaptionTxt);
      //
      // La AdjustCaptionPosition allarga la caption occupando tutto lo spazio disponibili, ma se c'e' la status bar visibile non va fatto.
      if (this.ShowStatusBar)
        this.CaptionTxt.style.width = "";
    }
  }
}


Book.prototype.SetCollapsed = function(value, immediate) 
{
  // Chiamo la classe base
  WebFrame.prototype.SetCollapsed.call(this, value);
}

Book.prototype.SetShowToolbar = function(value) 
{
  // Chiamo la classe base
  WebFrame.prototype.SetShowToolbar.call(this, value);
  //
  if (this.Realized)
  {
    this.UpdateToolbar();
  }
}

Book.prototype.SetShowStatusBar = function(value) 
{
  // Chiamo la classe base
  WebFrame.prototype.SetShowStatusBar.call(this, value);
  //
  if (this.Realized)
  {
    var sh = !this.Collapsed && this.ShowStatusBar;
    this.StatusBarTxt.style.display = sh ? "" : "none";
  }
}

//***************************************************
// Fine ridefinizione funzioni
//***************************************************


// ********************************************************************************
// Mostra o nasconde i pulsanti della toolbar a seconda dello stato
// ********************************************************************************
Book.prototype.UpdateToolbar = function() 
{
  if (!RD3_Glb.IsMobile())
  {
    this.ToolbarNav.style.display = this.IsCommandEnabled(RD3_Glb.BCM_NAVIGATION) ? "" : "none";
    this.PrintImg.style.display = this.IsCommandEnabled(RD3_Glb.BCM_PRINT) ? "" : "none";
    this.ExportImg.style.display = this.IsCommandEnabled(RD3_Glb.BCM_CSV) ? "" : "none";
  }
  //
  this.AdaptScrollBox();
}


// ****************************************************************
// Torna TRUE se il comando e' abilitato
// ****************************************************************
Book.prototype.IsCommandEnabled = function(cmd)
{
  return (this.EnabledCommands & cmd) && this.ShowToolbar && !this.Collapsed;
}



// ********************************************************************************
// Gestore evento di click su un pulsante della Toolbar
// button: 'next', 'prev', 'top', 'bottom', 'print'
// ********************************************************************************
Book.prototype.OnToolbarClick= function(evento, button, pag)
{
  var evt = this.ToolbarEventDef;
  //
  // Calcolo la pagina a cui devo andare e verifico se ce l'ho gia' in cache
  var vai = false;
  var selpg = this.SelectedPage;
  switch (button)
  {
    case "next": selpg += 1; break;
    case "prev": selpg -= 1; break;
    case "top":  selpg = 1;  break;
    case "bottom": selpg = (this.TotalPagesConfirmed? this.TotalPages : -1 ); break;
    case "goto":  selpg = pag;  break;
  }
  //
  if (this.TotalPagesConfirmed && selpg>this.TotalPages)
    selpg = this.TotalPages;
  //
  // Decido se operare lato client (no in caso di esportazione)
  if (selpg > 0 && this.Pages[selpg] && button != "csv")
    vai = true;
  //
  // Se non ho la pagina in cache mando l'evento immediatamente
  if (!vai || this.CacheSize != 1)
    evt |= RD3_Glb.EVENT_IMMEDIATE;
  var ev = new IDEvent("booktb", this.Identifier, evento, evt, button, pag);
  //
  // Se l'evento puo' essere gestito lato client e ho la pagina in cache la mostro
  if (ev.ClientSide== 1 && vai && selpg!=this.SelectedPage)
  {
  	// In caso mobile non devo nascondere tutte le pagine perche' esse
  	// in realta' rimangono visibili
  	if (RD3_Glb.IsMobile())
  	{
  		// Se devo ottimizzare il DOM, aggiorno il container mobile
  		this.SelectedPage = selpg;
  		if (this.OptimizeDOM)
  			this.RefreshMobileContainer = true;
  	}
  	else
    	this.SetSelectedPage(selpg);
    //
    // Cambio la status bar del book
    this.SetCaption();  
  }
}


// **********************************************************************
// Metodo che svuota la cache delle pagine
// **********************************************************************
Book.prototype.ResetCache = function(ev, node)
{
  // Elimino dalla cache tutte le pagine non visibili... 
  // Tengo quella attualmente visibile cosi' posso lavorare in differenziale
  var from = (this.CacheSize == 1 ? 0 : parseInt(node.getAttribute("from")));
  var to = (this.CacheSize == 1 ? 0 : parseInt(node.getAttribute("to")));
  var n = this.Pages.length;
  for (var i = 0; i<n; i++)
  {
    var p = this.Pages[i];
    if (!p)
      continue;
    //
    // Single-page: elimino tutte le pagine tranne quella attiva
    if (this.CacheSize == 1 || from == 0 || to == 0)
    {
      if (p.Number != this.SelectedPage)
        p.Unrealize();
    }
    else
    {
      // Multi-page: elimino tutte le pagine fuori dall'intervallo comunicato dal server
      if (p.Number < from || p.Number > to)
        p.Unrealize();
    }
  }
  //
  // Dovro' ricalcolare il layout!
  this.RecalcLayout = true;
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
Book.prototype.Unrealize = function()
{ 
  // Chiamo la classe base
  WebFrame.prototype.Unrealize.call(this);
  //
  // Tolgo tutte le pagine
  var n = this.Pages.length;
  for (var i = 0; i<n; i++)
  {
    var p = this.Pages[i];
    if (p)
      p.Unrealize();
  }
  //
  if (this.IDScroll)
  	this.IDScroll.Unrealize();
  this.IDScroll = undefined;
}


// ********************************************************************************
// Gestore eventi di mouse su un pulsante della Toolbar di pannello
// Il parametro deve valere "" per bottone senza effetti, "hover" per highlight
// e "down" per effetto cliccato
// ********************************************************************************
Book.prototype.OnToolMouseUse = function(evento, parametro)
{ 
  var eve = (window.event)?window.event:evento;
  var obj = (window.event)?window.event.srcElement:evento.target;
  //
  // se ho trovato l'origine dell'evento
  if (obj)
  {
    var prefix = "book";
    if (obj.className.indexOf("frame")>=0)
      prefix = "frame";
    //
    // gestisco il caso di over, leave e down
    obj.className = prefix + "-toolbar-button"+ ((this.SmallIcons)? "-small" : "") + ((parametro == "") ? "" : "-" + parametro);
  }
}


// ********************************************************************************
// Il resize deve essere mandato immediatamente al server?
// ********************************************************************************
Book.prototype.IsResizeImmediate = function()
{
  // Devo ottenere immediatamente la nuova immagine del grafico...
  return true; 
}

// ********************************************************************************
// Gestisce l'aumento della larghezza/altezza di box e sezioni quando i loro figli
// hanno bordo e loro no
// ********************************************************************************
Book.prototype.ParGrowWidth = function(obj, absRight, brdw)
{
  while (obj)
  {
    var robrd = obj.VisStyle.GetBookOffset(true);
    //
    // Se ha un suo bordo... non devo fare altro! Ci avra' gia' pensato lui ai suoi padri
    if (robrd.w!=0)
      return;
    //
    // Se il suo bordo right e' inferiore a quello fornito... da ora in poi non mi
    // interessa piu'... i suoi figli saranno sicuramente lontani dal bordo right!
    if (obj.XAbsPx+obj.WPx<absRight)
      return;
    //
    // Se gli e' gia' stato detto... ho finito. Ci avra' gia' pensato qualcun altro
    if (obj.StretchW>=brdw)
      return;
    //
    // Lui si deve allargare!
    obj.StretchW = Math.max((!obj.StretchW ? 0 : obj.StretchW), brdw);
    //
    // Risalgo: se obj e' una sezione, suo padre e' una box, se obj e' una box, suo padre e' una sezione
    if (obj instanceof BookSection)
      obj = obj.MastroBox;
    else
      obj = obj.ParentSect;
  }
}
Book.prototype.ParGrowHeight = function(obj, absBottom, brdh)
{
  while (obj)
  {
    var robrd = obj.VisStyle.GetBookOffset(true);
    //
    // Se ha un suo bordo... non devo fare altro! Ci avra' gia' pensato lui ai suoi padri
    if (robrd.h!=0)
      return;
    //
    // Se il suo bordo bottom e' inferiore a quello fornito... da ora in poi non mi
    // interessa piu'... i suoi figli saranno sicuramente lontani dal bordo bottom!
    if (obj.YAbsPx+obj.HPx<absBottom)
      return;
    //
    // Se gli e' gia' stato detto... ho finito. Ci avra' gia' pensato qualcun altro
    if (obj.StretchH>=brdh)
      return;
    //
    // Si deve allargare!
    obj.StretchH = Math.max((!obj.StretchH ? 0 : obj.StretchH), brdh);
    //
    // Risalgo: se obj e' una sezione, suo padre e' una box, se obj e' una box, suo padre e' una sezione
    if (obj instanceof BookSection)
      obj = obj.MastroBox;
    else
      obj = obj.ParentSect;
  }
}


// *********************************************************
// E' arrivato un click a livello di frame
// *********************************************************
Book.prototype.OnFrameClick = function(evento, dbl, btn, x, y, xb, yb, tget)
{
  // Risalgo alla DIV della box
  while (tget && tget.tagName!="DIV")
    tget = tget.parentNode;
  //
  // Se non ho trovato un oggetto valido, non faccio altro
  if (!tget)
    return;
  //
  // calcolo box alla quale e' avvenuto il click
  var id = RD3_Glb.GetRD3ObjectId(tget);
  //
  // Prendiamo l'oggetto vero
  var obj = RD3_DesktopManager.ObjectMap[id];
  var box = obj;
  //
  // Cliccata sezione? vediamo se e' trasparente!
  if (obj && obj instanceof BookSection)
  {
    // Sezione trasparente, risalgo alla box
    if (obj.SectionBox.style.backgroundColor=="transparent")
    {
      if (obj.ParentBox)
      {
        id = obj.ParentBox.Identifier;
        box = obj.ParentBox;
      }
      else
      {
        id = obj.MastroBox.Identifier;
        box = obj.MastroBox;
      }
    }
  }
  //
  // Convertiamo le coordinate rispetto alla box nella UM del book
  if (box instanceof BookBox)
  {
    x = xb - RD3_Glb.GetScreenLeft(box.BoxBox);
    y = yb - RD3_Glb.GetScreenTop(box.BoxBox);  
    var r = new Rect(x,y,0,0);
    box.AdaptCoords(r);
    x = r.x;
    y = r.y;
  }
  //
  var ev = new IDEvent("rawclk", this.Identifier, evento, dbl?this.MouseDoubleClickEventDef:this.MouseClickEventDef, dbl, btn, Math.floor(xb)+"-"+Math.floor(yb), Math.floor(x)+"-"+Math.floor(y), id);
}

// *********************************************************
// Imposta il tooltip
// *********************************************************
Book.prototype.GetTooltip = function(tip, obj)
{
  //
  // Ora guardiamo se e' un bottone della tooltbar di pannello
  var ok = false;
  if (obj == this.BeginImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_BookInizio);
    tip.SetText(RD3_ServerParams.BookInizio);
    ok = true;
  }
  else if (obj == this.PrevImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_BookPaginaPrec);
    tip.SetText(RD3_ServerParams.BookPaginaPrec);
    ok = true;
  }
  else if (obj == this.NextImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_BookPaginaSucc);
    tip.SetText(RD3_ServerParams.BookPaginaSucc);
    ok = true;
  }
  else if (obj == this.EndImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_BookFine);
    tip.SetText(RD3_ServerParams.BookFine);
    ok = true;
  }
  else if (obj == this.PrintImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_CreatePDF);
    tip.SetText(RD3_ServerParams.CreatePDF);
    ok = true;
  }
  else if (obj == this.ExportImg)
  {
    tip.SetTitle(ClientMessages.TIP_TITLE_TooltipExport);
    tip.SetText(RD3_ServerParams.TooltipExport);
    ok = true;
  }
  //
  if (ok)
  {
    // Di default i bottoni di book mostrano il tooltip centrato sopra di essi
    tip.SetAnchor(RD3_Glb.GetScreenLeft(obj) + ((obj.offsetWidth-4)/2), RD3_Glb.GetScreenTop(obj));
    tip.SetPosition(0);
    return true;
  }
  else
    return WebFrame.prototype.GetTooltip.call(this, tip, obj);
}


// ********************************************************************************
// Compone la lista di drop della pagina
// ********************************************************************************
Book.prototype.ComputeDropList = function(list, dragobj)
{
  // Se non sono stato realizzato o non ho pagine... niente DropList
  if (!this.Realized || this.Pages.length == 0 || !this.Pages[this.ActivePage])
    return;
  //
  this.Pages[this.ActivePage].ComputeDropList(list, dragobj);
}


// ********************************************************************************
// Evento di inizio tocco sul book
// ********************************************************************************
Book.prototype.OnTouchStart = function(e)
{ 
  // Chiamo la classe base
  WebFrame.prototype.OnTouchStart.call(this, e);
	//
	// Inizio lo scrolling solo se uno un solo dito
	if (e.targetTouches.length != 1)
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
  // Memorizzo i dati per la velocita' (che verra' calcolata per ogni 100 ms)
	this.TouchTimes  = new Array();
	this.TouchPosY   = new Array();
	this.TouchPosX   = new Array();
  this.TouchTimes.push(new Date());
  this.TouchPosY.push(this.TouchStartY);
  this.TouchPosX.push(this.TouchStartX);
  //
  this.HandleTouchEvent(e, "down");
  //
	this.TouchMoved  = false; // Indica che il dito si e' mosso
	this.ClearTouchScrollTimer();
	this.TouchPagePrev = false;
	this.TouchPageNext = false;
	if (!this.AnimatingNum && this.ActivePage>0 && this.Pages.length>0)
	{
		this.TouchPagePrev = this.ContentBox.scrollLeft==0;
		this.TouchPageNext = this.ContentBox.scrollLeft+this.ContentBox.clientWidth>=this.Pages[this.ActivePage].PageBox.offsetWidth;
	}
	//
	return false;
}


// ********************************************************************************
// Evento di movimento del ditino sul pannello
// ********************************************************************************
Book.prototype.OnTouchMove = function(e)
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
	if (Math.abs(yod)<40 && xod>120 && this.TouchPagePrev)
	{
		this.TouchPagePrev=false;
		this.PrevImg.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "") + "-down";
		window.setTimeout("document.getElementById('"+this.PrevImg.id+"').className = 'frame-toolbar-button" + ((this.SmallIcons)? "-small" : "")+"'",300);
		this.OnToolbarClick(e,"prev");
		this.FormScroll = false;
	}
	else if (Math.abs(yod)<40 && xod<-120 && this.TouchPageNext)
	{
		this.TouchPageNext=false;
		this.NextImg.className = "frame-toolbar-button" + ((this.SmallIcons)? "-small" : "") + "-down";
		window.setTimeout("document.getElementById('"+this.NextImg.id+"').className = 'frame-toolbar-button" + ((this.SmallIcons)? "-small" : "")+"'",300);
		this.OnToolbarClick(e,"next");
		this.FormScroll = false;
	}
	else if (!RD3_DDManager.IsDragging && !RD3_DDManager.IsResizing)
	{
		// Cerco una box di sezione o mastro scrollabile
		this.TouchScrollBox = null;
		var theTarget = RD3_Glb.ElementFromPoint(this.TouchStartX, this.TouchStartY);
		while (theTarget)
		{
			var obj = RD3_DDManager.GetObject(theTarget.id,true);
			if (obj instanceof BookBox)
			{
				if (obj.CanScroll)
				{
					this.TouchScrollBox = obj.BoxBox;
					break;
				}
			}
			//
			theTarget = theTarget.parentNode;
		}
		//
		if (!this.TouchScrollBox)
			this.TouchScrollBox = this.ContentBox;
		//
		// Allora posso spostare il content box se avesse bisogno delle scrollbar
		var oldx = this.TouchScrollBox.scrollLeft;
		var oldy = this.TouchScrollBox.scrollTop;
		this.TouchScrollBox.scrollLeft -= xd;
		this.TouchScrollBox.scrollTop -= yd;
		//
		// non scrollo la form se ho appena scrollato il book in se
		this.FormScroll = this.FormScroll && oldx==this.TouchScrollBox.scrollLeft && oldy==this.TouchScrollBox.scrollTop;
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
Book.prototype.OnTouchEnd = function(e)
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
	// Simulo il click se non mi ero mosso.
	if (!this.TouchMoved) 
	{
		this.HandleTouchEvent(e, "up");
	}
	else if (this.TouchTimes.length==3)
	{
		// Se stavo spostando il content box, verifico le velocita'
		var dt = this.TouchTimes[2]-this.TouchTimes[0];
		var dx = this.TouchPosX[0]-this.TouchPosX[2];
		var dy = this.TouchPosY[0]-this.TouchPosY[2];
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
	//
	// Chiamo la classe base
  WebFrame.prototype.OnTouchEnd.call(this, e);
	//
	this.TouchStartX=-1;
	this.TouchStartY=-1;
	this.TouchMoved = false;
	this.TouchMove = false;
	//
	return false;
}


// ********************************************************************************
// Gestisce lo scroll via touch del pannello.
// v e' la velocita' di scroll in ms, il segno indica la direzione
// n e' il numero di volte che e' stata eseguita la funzione
// ********************************************************************************
Book.prototype.TouchScrollTimer = function(dummy, ap)
{ 
	// Caso scrolling content box
	if (ap.length==3)
	{
		var vx = ap[0];
		var vy = ap[1];
		var n  = ap[2];
		//
		if (this.TouchScrollBox)
		{
			this.TouchScrollBox.scrollLeft += vx*10;
			this.TouchScrollBox.scrollTop += vy*10;
		}
		//
		if (n<40)
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
Book.prototype.ClearTouchScrollTimer = function()
{
	if (this.TouchScrollTimerId>0)
	{
		window.clearTimeout(this.TouchScrollTimerId);
		this.TouchScrollTimerId=0;
		this.TouchScroll=0;
	}
}


// ********************************************************************************
// Gestisce evento di touch
// ********************************************************************************
Book.prototype.HandleTouchEvent = function(e, evtype)
{
	var sx = e.changedTouches[0].clientX;
	var sy = e.changedTouches[0].clientY;
	var doubletap = false;
	//
	// Vediamo se e' un singolo o doppio click
	if (evtype=="up")
	{
		this.FormScroll = false;
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
	// Controllo che l'oggetto sia generato proprio dal mio frame
	var theFrame = RD3_Glb.GetParentFrame(theTarget);
	if (theFrame!=this)
		return;
	//
	var obj = null;
	var canact = false;
	if (theTarget)
	{
		canact = (theTarget.tagName=="IMG" || theTarget.tagName=="INPUT");
		//
		obj = RD3_DDManager.GetObject(theTarget.id,true);
		if (obj instanceof BookBox)
			canact = obj.CanClick;
		if (obj instanceof BookSpan)
		{
			canact = obj.ParentBox.CanClick;
			theTarget = theTarget.parentNode;
		}
		if (theTarget.className=="combo-activator")
			canact = true;
	}
	//
	if (evtype=="down")
		this.TouchObj = theTarget;
	//
	if (evtype!="down" && this.TouchObj && this.TouchObj.id!="")
		RD3_Glb.TouchHL(this.TouchObj, "panel-field-down", false);
	//	
	if (canact)
	{
		// Illumino lo sfondo della caption per indicare che e' stata premuta
		if (theTarget.id!="")
		{
			if (evtype=="up")
				RD3_Glb.TouchHL(theTarget);
			if (evtype=="down")
				RD3_Glb.TouchHL(theTarget, "panel-field-down", true, 0);
		}
		//
		if (evtype=="up")
		{
			var theEvent = document.createEvent('MouseEvents');
			theEvent.initMouseEvent(doubletap?'dblclick':'click', true, true, window, 1, sx, sy, sx, sy);
			theTarget.dispatchEvent(theEvent);
		}
	}
}


// ********************************************************************************
// Aggiorna il box che si occupa di contenere e scrollare le pagine nel caso mobile
// ********************************************************************************
Book.prototype.UpdateMobileContainer = function()
{ 
  if (!this.Realized)
    return;
  //
	this.RefreshMobileContainer = false;
	//
	if (!RD3_Glb.IsMobile())
		return;
	//
	if (!this.MobilePageContainer)
	{
		this.MobilePageContainer = document.createElement("div");
    this.MobilePageContainer.setAttribute("id", this.Identifier+":mob");
    this.MobilePageContainer.className = "book-mobile-container";
    this.ContentBox.appendChild(this.MobilePageContainer);
	}
	//
	// Imposto la larghezza/altezza del container
	var hmax = 0;
	var wmax = 0;
	var ofsb =  this.HideBorder?0:2;
	var distx = this.HideBorder?0:8;
	var disty = this.HideBorder?0:8;
	var n = this.Pages.length;
  for (var i=1; i<n; i++)
  {
    if (this.Pages[i] && this.Pages[i].PageBox)
    {
    	if (this.Pages[i].WidthPx>wmax)
    		wmax = this.Pages[i].WidthPx;
    	if (this.Pages[i].HeightPx>hmax)
    		hmax = this.Pages[i].HeightPx;
    }
	}
	wmax = Math.floor(wmax)+ofsb;
	hmax = Math.floor(hmax)+ofsb;
	if (hmax==ofsb)
		hmax = this.ContentBoxOffsetHeight-(this.HideBorder?0:8);
	if (wmax==ofsb)
		wmax = this.ContentBoxOffsetWidth-(this.HideBorder?0:8);
	//
	var worg = wmax;
	var horg = hmax;
	//
	// Imposto le posizioni delle pagine all'interno del contenitore
	var x=0;
	var y=0;
	var mp = this.TotalPages+(this.TotalPagesConfirmed?0:1);
	//
	// Se le pagine sono molto piu' piccole del container non e' sufficiente un placeholder in piu' per andare a pagina successiva.. infatti IDScroll cambia pagina solo se riesci a 
	// spostare la pagina all'inizio, ma se la pagina e' troppo piccola non ci riesci.. in questo caso bisogna aggiungere ulteriori placeholder in modo da averne almeno uno che possa
	// arrivare ad inizio pagina
	if (!this.TotalPagesConfirmed && this.ContentBoxOffsetWidth != 0 && wmax-ofsb < this.ContentBoxOffsetWidth-10)
	{
	  var placNum = Math.floor(this.ContentBoxOffsetWidth/(wmax-ofsb));
	  mp += placNum;
	}
	//
  for (var i=1; i<=mp; i++)
  {
    if (this.Pages[i] && this.Pages[i].PageBox)
    {
    	var showpage = true;
    	if (this.OptimizeDOM)
    		showpage = Math.abs(i-this.SelectedPage)<=Math.ceil((this.CacheSize-1)/2);
			if (showpage)
			{      
	      // Se questa pagina era invisibile dovro' ri-adattarla alla fine
	      if (this.Pages[i].PageBox.style.display == "none")
	        this.RecalcLayout = true;
	      //
	      if (this.ScrollOrientation==0)
	    		this.Pages[i].PageBox.style.left = x+"px";
				else
	    		this.Pages[i].PageBox.style.top = y+"px";
	    }
    	//
    	this.Pages[i].PageBox.style.display = showpage?"":"none";
    	//
    	if (this.PlaceHolders[i])
    		this.PlaceHolders[i].style.display = "none";
		}
		else
		{
			// Creo il placeholder
    	if (!this.PlaceHolders[i])
    	{
    		this.PlaceHolders[i] = document.createElement("div");
		    this.PlaceHolders[i].className = "book-page-placeholder book-page-container"+(this.HideBorder?"-noborder":"");
		    this.PlaceHolders[i].textContent = i;
    		this.MobilePageContainer.appendChild(this.PlaceHolders[i]);
    	}
    	this.PlaceHolders[i].style.display = "";

  		var s = this.PlaceHolders[i].style;
      if (this.ScrollOrientation==0)
	  		s.left = x+"px";
	  	else
	  		s.top = y+"px";
  		s.width = (worg-ofsb)+"px";
  		s.height = (horg-ofsb)+"px";
		}
		//
		x+=wmax+distx;
		y+=hmax+disty;		
	}
	//
	// Rimuovo eventuali placeholder rimasti in piu'
	for (var i = mp+1; i<this.PlaceHolders.length; i++)
	{
		if (this.PlaceHolders[i])
  		this.PlaceHolders[i].style.display = "none";
	}
	//
	// Imposto le dimensioni del container
	var updateIDScroll = false;
	if (this.ScrollOrientation==0)
	{
		if (this.MobilePageContainerOffsetWidth!=x)
		{
			this.MobilePageContainer.style.width = x+"px";
			this.MobilePageContainerOffsetWidth = this.MobilePageContainer.offsetWidth;
			updateIDScroll= true;
		}
		if (this.MobilePageContainerOffsetHeight!=hmax+disty)
		{
			this.MobilePageContainer.style.height = (hmax+disty)+"px";
			this.MobilePageContainerOffsetHeight = this.MobilePageContainer.offsetHeight;
			updateIDScroll= true;
		}
	}
	else
	{
		if (this.MobilePageContainerOffsetWidth!=wmax+distx)
		{
			this.MobilePageContainer.style.width = (wmax+distx)+"px";
			this.MobilePageContainerOffsetWidth = this.MobilePageContainer.offsetWidth;
			updateIDScroll= true;
		}
		if (this.MobilePageContainerOffsetHeight!=y)
		{		
			this.MobilePageContainer.style.height = y+"px";
			this.MobilePageContainerOffsetHeight = this.MobilePageContainer.offsetHeight;
			updateIDScroll= true;
		}
	}
	//
	if (!this.IDScroll)
	{
		this.IDScroll = new IDScroll(this.Identifier, this.MobilePageContainer, this.ContentBox, this);
		this.SetScrollbar();
	}
	//
	// Se c'e' una zona fixed a sinistra non c'e' snap
	if (this.ScrollOrientation==0)
	{
		if (this.FixedWidth==0)
  		this.IDScroll.SetSnap(wmax+distx,0, this.SnapToPage, this.OptimizeDOM?Math.ceil((this.CacheSize-1)/2):0);
  }
  else
  {
		if (this.FixedHeight==0)
  		this.IDScroll.SetSnap(0, hmax+disty, this.SnapToPage, this.OptimizeDOM?Math.ceil((this.CacheSize-1)/2):0);
  }
	//
	// Se ho cambiato delle pagine aggiorno la dimensione del container
	if (updateIDScroll)
		this.IDScroll.CalcLimits();
	//
	// Imposto la pagina attiva
	if (this.ForceSetPage || this.SnapToPage)
	{
		if (this.ScrollOrientation==0)
			this.IDScroll.SetPage(this.SelectedPage,0);
		else
			this.IDScroll.SetPage(0,this.SelectedPage);
	}
	this.ForceSetPage = false;
}


// ********************************************************************************
// Mostra la pagina indicata
// ********************************************************************************
Book.prototype.OnScrollToPage = function(ev, d, pag)
{ 
	if (pag!=this.SelectedPage)
	{
		this.OnToolbarClick(ev, "goto", pag);
	}
}

// ********************************************************************************
// Aggiorna le zone fisse
// ********************************************************************************
Book.prototype.UpdateFixedZones = function()
{
  // Controllo tutte le pagine
  var n = this.Pages.length;
  for (var i=0; i<n; i++)
  {
    var p = this.Pages[i];
    if (p)
      p.UpdateFixedZones();
  }
  //
  // Attacco l'evento per gestire le zone fisse
  this.ContentBox.onscroll = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScroll', ev)");        
}

// ********************************************************************************
// Scroll della pagina: se ci sono zone fisse avviso la pagina
// ********************************************************************************
Book.prototype.OnScroll = function(ev)
{
  if (this.Pages[this.SelectedPage])
    this.Pages[this.SelectedPage].OnScroll(ev);
}


// ******************************************************************
// Memorizza o ripristina le posizione delle scrollbar
// usata quando una modale viene riportata in primo piano per non 
// perdere il posizionamento delle scrollbar
//
// vedi popupframe::BringToFront
// ******************************************************************
Book.prototype.SaveScrollPos = function () 
{
  if (!this.Pages || !this.Realized)
    return;
  //
  var n = this.Pages.length;
  for (var i = 0; i < n; i++)
    if (this.Pages[i])
      this.Pages[i].SaveScrollPos();
}


Book.prototype.SetScrollPos = function () 
{
  if (!this.Pages || !this.Realized)
    return;
  //
  var n = this.Pages.length;
  for (var i = 0; i < n; i++)
    if (this.Pages[i])
      this.Pages[i].SetScrollPos();
}


Book.prototype.CheckScrollbar = function (obj, x, y) 
{
  if (obj instanceof BookBox) 
  {
    // Se non sono stato realizzato o non ho pagine... niente DropList
    if (!this.Realized || this.Pages.length == 0 || !this.Pages[this.ActivePage])
      return;
    //
    // Cerco il padre con scrollbar che lo contiene
    var pg = this.Pages[this.ActivePage];
    if (!pg)
      return;
    //
    var n = pg.MastroBoxes.length;
    for (var i = 0; i < n; i++) 
    {
      var box = pg.MastroBoxes[i];
      if (box.CanScroll && box.BoxBox) 
      {
        var pt = RD3_Glb.GetScreenTop(box.BoxBox);
        var pl = RD3_Glb.GetScreenLeft(box.BoxBox);
        var pr = pl + box.BoxBox.clientWidth;
        var pb = pt + box.BoxBox.clientHeight;

        var dd = RD3_Glb.IsTouch() ? 4 : 8;
        //
        if (y < pb && y > pb - dd && box.BoxBox.scrollHeight > box.BoxBox.clientHeight && x >= pl && x <= pr) 
        {
          Book.ScrollaBC(box.Identifier, 0, dd);
          RD3_DDManager.ScrollTimerID = window.setInterval("Book.ScrollaBC('" + box.Identifier + "', 0, " + dd + ")", 20);
        }
        else if (y > pt && y < pt + dd && box.BoxBox.scrollHeight > box.BoxBox.clientHeight && x >= pl && x <= pr) 
        {
          Book.ScrollaBC(box.Identifier, 0, -dd);
          RD3_DDManager.ScrollTimerID = window.setInterval("Book.ScrollaBC('" + box.Identifier + "', 0, -" + dd + ")", 20);
        }
        else if (x < pr && x > pr - dd && box.BoxBox.scrollWidth > box.BoxBox.clientWidth && y >= pt && y <= pb) 
        {
          Book.ScrollaBC(box.Identifier, dd, 0);
          RD3_DDManager.ScrollTimerID = window.setInterval("Book.ScrollaBC('" + box.Identifier + "', " + dd + ", 0)", 20);
        }
        else if (x > pl && x < pl + dd && box.BoxBox.scrollWidth > box.BoxBox.clientWidth && y >= pt && y <= pb) 
        {
          Book.ScrollaBC(box.Identifier, -dd, 0);
          RD3_DDManager.ScrollTimerID = window.setInterval("Book.ScrollaBC('" + box.Identifier + "', -" + dd + ", 0)", 20);
        }
      }
    }
  }
}

// **********************************************
// Scrolla l'oggetto selezionato
// **********************************************
Book.ScrollaBC = function (frid, deltaX, deltaY) 
{
  var obj = RD3_DesktopManager.ObjectMap[frid];
  var bc = obj.BoxBox;
  //
  var oy = bc.scrollTop;
  var ox = bc.scrollLeft;
  bc.scrollTop += deltaY;
  bc.scrollLeft += deltaX;
  var dy = (bc.scrollTop) - oy;
  var dx = (bc.scrollLeft) - ox;
  //
  // Aggiusto posizioni varie
  if (RD3_DDManager.DropList) 
  {
    var n = RD3_DDManager.DropList.length;
    for (var i = 0; i < n; i++) 
    {
      var dobj = RD3_DDManager.DropList[i];
      if (dobj.BoxBox && dobj.ParentPage == obj.ParentPage) 
      {
        dobj.AbsLeft -= dx;
        dobj.AbsRight -= dx;
        dobj.AbsTop -= dy;
        dobj.AbsBottom -= dy;
      }
    }
  }
  //
  RD3_DDManager.HLDropElem.style.left = (RD3_DDManager.HLDropElem.offsetLeft - dx) + "px";
  RD3_DDManager.HLDropElem.style.top = (RD3_DDManager.HLDropElem.offsetTop - dy) + "px";

  // Anche in caso di moving, aggiusto le coordinate iniziali
  // per poter tenere conto delle scrollbar
  // Non lo faccio per Chrome che scrolla anche lui gli oggetti
  if (!RD3_Glb.IsChrome()) 
  {
    RD3_DDManager.TrueOrigLeft -= dx;
    RD3_DDManager.TrueOrigTop -= dy;
  }
}


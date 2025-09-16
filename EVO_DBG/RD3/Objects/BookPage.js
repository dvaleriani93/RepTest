// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe BookPage: Rappresenta una pagina
// di un Book
// ************************************************

function BookPage(pbook)
{
  // Proprieta' di questo oggetto di modello
  this.Identifier = null;       // Identificatore del nodo (univoco)
  this.Number = "";             // Numero della pagina
  this.Width = 0;               // In 1/100mm o 1/1000in
  this.Height = 0;              // In 1/100mm o 1/1000in
  this.UM = "mm";               // Unita' di misura (mm o in)
  this.FitMode = 1;             // 1-none, 2-larghezza, 3-pagina
  this.HeightPx = 0;            // Altezza convertita in px
  this.WidthPx = 0;             // Larghezza covertita in px
  //
  // Oggetti figli della pagina
  this.MastroBoxes = new Array();  // Elenco delle box presenti nella mastro
  this.Sections = new Array();     // Elenco delle sezioni presenti nella pagina
  //
  // Altre variabili di modello...
  this.ParentBook = pbook;      // L'oggetto book a cui appartengo
  this.Active = false;          // Questa pagina e' attualmente visibile?
  this.Adapted = false;         // L'adaptLayout e' stato mai fatto?
  this.ShowPageOnInit = true;   // Durante la realizzazione devo nascondere la mia pagina?
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi al nodo
  this.PageBox = null;     // Il DIV complessivo della pagina
}


// *******************************************************************
// Inizializza questo TreeNode leggendo i dati da un nodo <trn> XML
// *******************************************************************
BookPage.prototype.LoadFromXml = function(node)
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
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
      case "box":
      {
        var newbox = new BookBox(this);
        newbox.LoadFromXml(objnode);
        //
        this.MastroBoxes[this.MastroBoxes.length] = newbox;
      }
      break;
      
      case "sec":
      {
        var newsec = new BookSection(this);
        newsec.LoadFromXml(objnode);
        //
        this.Sections[this.Sections.length] = newsec;
      }
      break;      
    }
  }   
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
BookPage.prototype.ChangeProperties = function(node)
{
  // In una pagina possono cambiare solo le proprieta', se dei figli vengono modificati
  // hanno un loro nodo chg, se vengono aggiunti e tolti scatta l'automatismo del differenziale
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
BookPage.prototype.LoadProperties = function(node)
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
      case "num": this.SetNumber(parseInt(valore)); break;
      case "um": this.SetUM(valore); break;
      case "wid": this.SetWidth((this.UM=="mm")? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
      case "hei": this.SetHeight((this.UM=="mm")? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
      case "fit": this.SetFitMode(parseInt(valore)); break;

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
BookPage.prototype.SetNumber= function(value) 
{
  if (value!=undefined)
    this.Number = value;
  //
  // Se la pagina era gia' presente, la distruggo
  if (this.ParentBook.Pages[this.Number])
  {
    // Prima di distruggerla devo verificare se c'e' una animazione che riguardi la pagina (o in ingresso o in uscita)
    // se c'e' una animazione non la distruggo, ma dico all'animazione di farlo lei alla fine
    if (this.ParentBook.AnimatingNum && this.ParentBook.AnimatingNum == this.Number)
    {
      this.ParentBook.Fx.UnrealizeOnFinish = true;
      //
      // Mi imposto per nascondere la mia pagina durante la realizzazione: sara' l'animazione a rendermi visibile quando finisce..
      this.ShowPageOnInit = false;
    }
    else
    {
      this.ParentBook.Pages[this.Number].Unrealize();
    }
  }
  //
  this.ParentBook.Pages[this.Number] = this;
  //
  // E mi infilo nella mappa!
  if (this.Identifier)
    RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
}

BookPage.prototype.SetUM= function(value) 
{
  if (value!=undefined)
    this.UM = value;
}

BookPage.prototype.SetFitMode= function(value) 
{
  if (value!=undefined)
    this.FitMode = value;
}

BookPage.prototype.SetWidth= function(value) 
{
  if (value!=undefined)
  {
    this.Width = value;
    this.WidthPx = RD3_Glb.ConvertIntoPx(value, this.UM);
  }
  //
  if (this.Realized)
  {
    this.PageBox.style.width = this.WidthPx + "px";
    //
    // Spingo l'aggiornamento delle zone fisse, se ce ne sono
    this.ParentBook.UpdateFixed = true;
  }
}

BookPage.prototype.SetHeight= function(value) 
{
  if (value!=undefined)
  {
    this.Height = value;
    this.HeightPx = RD3_Glb.ConvertIntoPx(value, this.UM);
  }
  //
  if (this.Realized)
  {
    this.PageBox.style.height = this.HeightPx + "px";  
    //
    // Spingo l'aggiornamento delle zone fisse, se ce ne sono
    this.ParentBook.UpdateFixed = true;
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
BookPage.prototype.Realize = function(parent)
{
  // Questa pagina era gia' stata realizzata
  if (this.Realized)
    return;
  //
  // realizzo i miei oggetti visuali
  // Creo il mio contenitore globale
  this.PageBox = document.createElement("div");
  this.PageBox.setAttribute("id", this.Identifier);
  this.PageBox.className = "book-page-container"+(this.ParentBook.HideBorder?"-noborder":"");
  //
  // Se non devo essere visibile all'avvio mi nascondo..
  if (!this.ShowPageOnInit)
    this.PageBox.style.display = "none";
  //
  // Poi chiedo ai miei figli di realizzarsi
  var n = this.MastroBoxes.length;
  for(var i=0; i<n; i++)
  {
    this.MastroBoxes[i].Realize(this.PageBox);
  }
  //
  // Per la corretta gestione dell'overlay mi serve ricordarmi di qual'e' l'ultima
  // sezione che ho inserito in una particolare box... e' importante per poter "mergiare"
  // tra loro le sezioni con overlay
  var boxSections = new HashTable();
  n = this.Sections.length;
  for(var i=0; i<n; i++)
  {
    var sec = this.Sections[i];
    //
    // Se sono una sezione in overlay controllo se non sono la prima nella mia box
    if (sec.Overlay && sec.MastroBox)
    {
      var sisterSec = boxSections[sec.MastroBox.Identifier];
      if (sisterSec && sisterSec.Overlay)
      {
        // Nella mia box c'e' gia' prima di me una sezione in overlay... mi "mergio" con lei
        sec.OwnerSection = (sisterSec.PageOwner ? sisterSec : sisterSec.OwnerSection);
        sec.SectionBox = sec.OwnerSection.SectionBox;
        sec.PageOwner = false;
      }
    }
    //
    sec.Realize(this.PageBox);
    //
    // Ora io sono l'ultima in questa box
    if (sec.MastroBox)
      boxSections[sec.MastroBox.Identifier] = sec;
  }
  boxSections = null;
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  //
  this.SetWidth();
  this.SetHeight();
  //
  // Solo alla fine attacco la pagina al DOM in modo che la preparazione sia piu' veloce
  parent.appendChild(this.PageBox);
  //
  // Ora che sono nel DOM, posso gestire meglio gli eventuali adattamenti della pagina se necessario
  this.ParentBook.RecalcLayout = true;
}


// **********************************************************************
// Rimuove questo nodo
// **********************************************************************
BookPage.prototype.Unrealize = function()
{
  // Tolgo l'oggetto dalla mappa comune
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Tolgo l'oggetto dalla mappa del parent
  this.ParentBook.Pages[this.Number] = null;
  //
  // Passo il messaggio ai figli
  var n=this.MastroBoxes.length;
  for (var i=0; i<n; i++)
  {
    this.MastroBoxes[i].Unrealize();
  }
  n=this.Sections.length;
  for (var i=0; i<n; i++)
  {
    this.Sections[i].Unrealize();
  }
  //
  // Elimino gli oggetti visuali
  if (this.PageBox && this.PageBox.parentNode)
    this.PageBox.parentNode.removeChild(this.PageBox);
  //
  if (this.FixedLeftScroll)
    this.FixedLeftScroll.Unrealize();
  this.FixedLeftScroll = null;
  //
  if (this.FixedTopScroll)
    this.FixedTopScroll.Unrealize();
  this.FixedTopScroll = null;
  //
  if (this.FixedTopLeftScroll)
    this.FixedTopLeftScroll.Unrealize();
  this.FixedTopLeftScroll = null;
}


// *******************************************************************************
// Rimuove questo nodo in modo ritardato (chiamato se necessario
// alla fine di una animazione)
// *******************************************************************************
BookPage.prototype.UnrealizeDelayed = function()
{
  // Guardo nella mappa: se l'oggetto con il mio id sono io lo tolgo senza problemi, se e' un altro
  // allora lo lascio
  var ob = RD3_DesktopManager.ObjectMap[""+this.Identifier];
  if (ob == this)
    RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  // Passo il messaggio ai figli
  var n=this.MastroBoxes.length;
  for (var i=0; i<n; i++)
  {
    this.MastroBoxes[i].Unrealize();
  }
  n=this.Sections.length;
  for (var i=0; i<n; i++)
  {
    this.Sections[i].UnrealizeDelayed();
  }
  //
  // Elimino gli oggetti visuali
  if (this.PageBox)
    this.PageBox.parentNode.removeChild(this.PageBox);
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
BookPage.prototype.AdaptLayout = function()
{
  // Se non sono stata realizzata... e' inutile adattarmi
  if (!this.Realized)
    return;
  //
  // Se non sono quella attiva... non mi adatto (vedi SetActive)
  if (this.PageBox.style.display == "none")
    return;
  //
  // Passo il messaggio ai figli
  var n=this.MastroBoxes.length;
  for (var i=0; i<n; i++)
  {
    this.MastroBoxes[i].AdaptLayout();
  }
  n=this.Sections.length;
  for (var i=0; i<n; i++)
  {
    this.Sections[i].AdaptLayout();
  }
  //
  this.Adapted = true;
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
BookPage.prototype.AfterProcessResponse= function()
{
  // Passo il messaggio ai figli
  var n=this.MastroBoxes.length;
  for (var i=0; i<n; i++)
    this.MastroBoxes[i].AfterProcessResponse();
  //
  n=this.Sections.length;
  for (var i=0; i<n; i++)
    this.Sections[i].AfterProcessResponse();
}


// ********************************************************************************
// Imposto l'attivazione o meno di questa pagina
// ********************************************************************************
BookPage.prototype.SetActive = function(value)
{
  if (!this.Realized)
    return;
  //
  this.Active = value;
  //
  // Mostro o nascondo il pagebox
  this.PageBox.style.display = (value)?"":"none";
  //
  // Gestisco anche la visibilita' delle aree fisse
  if (this.FixedPageBox)
    this.FixedPageBox.style.display = (value)?"":"none";
  if (this.FixedTopPageBox)
    this.FixedTopPageBox.style.display = (value)?"":"none";
  if (this.FixedLeftPageBox)
    this.FixedLeftPageBox.style.display = (value)?"":"none";
  if (this.FixedTopLeftPageBox)
    this.FixedTopLeftPageBox.style.display = (value)?"":"none";
  //
  // Se non sono attiva ma il book punta a me come pagina attiva annullo il suo puntatore
  if (!this.Active && this.ParentBook.ActivePage == this.Number)
    this.ParentBook.ActivePage = 0;
  //
  if (this.Active)
  {
    this.ParentBook.ActivePage = this.Number;
    //
    // In base al fitmode, imposto l'overflow del book-container
    if (!RD3_Glb.IsMobile())
    {
      var bcs = this.ParentBook.ContentBox.style;
      bcs.overflowX = (this.FitMode!=1)? "hidden" : "auto"; // In X nascondo se estendo a tutta pagina o in larghezza
      bcs.overflowY = (this.FitMode==3)? "hidden" : "auto"; // In Y nascondo solo se estendo a tutta pagina
    }
  }
}


// ********************************************************************************
// Compone la lista di drop della pagina
// ********************************************************************************
BookPage.prototype.ComputeDropList = function(list, dragobj)
{
  // Se non sono stata realizzata... niente DropList
  if (!this.Realized)
    return;
  //
  // Chiedo a tutte le box se vogliono essere droppate da dragobj
  var n  = this.MastroBoxes.length;
  for (var i = 0; i<n; i++)
  {
    this.MastroBoxes[i].ComputeDropList(list, dragobj);
  }
  //
  // Ora tutte le sezioni della pagina
  n  = this.Sections.length;
  for (var i = 0; i<n; i++)
  {
    this.Sections[i].ComputeDropList(list, dragobj);
  }
}

// ********************************************************************************
// Aggiunge un nuovo figlio a questo oggetto
// ********************************************************************************
BookPage.prototype.InsertChild = function(node)
{
  // Vediamo se l'oggetto esiste gia'...
  var id = node.getAttribute("id");
  if (RD3_DesktopManager.ObjectMap[id])
    return;
  //
  var previd = node.getAttribute("previd");
  if (id.substring(0,3)=="box")
  {
    // Creo la nuova box e ne carico le proprieta'
    var newbox = new BookBox(this);
    newbox.LoadProperties(node);
    //
    // Calcolo dove inserire la nuova box
    var previdx = RD3_Glb.FindObjById(this.MastroBoxes, previd);
    //
    // Inserisco al posto giusto e realizzo
    if (previdx != -1 && previdx < this.MastroBoxes.length)
    {
      if (this.Realized)
        newbox.Realize(this.PageBox, this.MastroBoxes[previdx].BoxBox);
      this.MastroBoxes.splice(previdx, 0, newbox);
    }
    else
    {
      if (this.Realized)
        newbox.Realize(this.PageBox);
      this.MastroBoxes[this.MastroBoxes.length] = newbox;
    }
  }
  else if (id.substring(0,3)=="sec")
  {
    // Creo la nuova sezione e ne carico le proprieta'
    var newsec = new BookSection(this);
    newsec.LoadProperties(node);
    //
    // Calcolo dove inserire la nuova sezione
    var previdx = RD3_Glb.FindObjById(this.Sections, previd);
    //
    // Gestione overlay
    if (newsec.Overlay)
    {
      // Cerco la sezione prima della quale verro' inserita.
      // Se mi devo inserire prima di qualcuno prendo quello prima di quello dove finiro'
      // (quindi quello che mi precedera' dopo che mi sono inserito) altrimenti se 
      // devo andare in fondo prendo quello che e' l'ultimo in questo momento 
      // (quindi quello che mi precedera' dopo che mi sono inserito)
      var prevSec = null;
      if (previdx>0)
      {
        for (var i=previdx-1; i>=0 && !prevSec; i--)
          if (this.Sections[i].MastroBox == newsec.MastroBox)
            prevSec = this.Sections[i];
      }
      else if (previdx==-1)
      {
        // Cerco l'ultima sezione presente nella pagina nella mia stessa MastroBox
        for (var i=this.Sections.length-1; i>=0 && !prevSec; i--)
          if (this.Sections[i].MastroBox == newsec.MastroBox)
            prevSec = this.Sections[i];
      }
      //
      // Se ho trovato la sezione che mi precedera' e anche lei ha l'overlay
      // e si trova nella mia stessa box, io devo attaccarmi a lei!
      if (prevSec && prevSec.Overlay && prevSec.MastroBox==newsec.MastroBox)
      {
        // Ci possono essere 2 casi:
        // 1) lei e' una delle tante sezioni che si nasconde... in questo caso mi nascondo anch'io...
        // 2) lei e' una sezione che non si nasconde... ma dato che io finisco dopo di lei mi devo nascondere
        //
        // Se lei e' owner mi attacco a lei, altrimenti mi attacco al suo owner
        newsec.OwnerSection = (prevSec.PageOwner ? prevSec : prevSec.OwnerSection);
        newsec.SectionBox = newsec.OwnerSection.SectionBox;
        //
        // Ed io non sono owner!
        newsec.PageOwner = false;
      }
      //
      // Ora devo fare un controllino anche sulla sezione successiva a dove finisco...
      var nextSec = null;
      if (previdx!=-1 && previdx<this.Sections.length-1)
      {
        for (var i=previdx+1; i<this.Sections.length && !nextSec; i++)
          if (this.Sections[i].MastroBox == newsec.MastroBox)
            nextSec = this.Sections[i];
      }
      //
      // Se ho trovato la sezione dopo di me e anche lei ha l'overlay ed e' owner non va bene!
      // ci sono troppi owner! Io la precedo e sono l'unica che posso avere l'owner
      if (nextSec && nextSec.Overlay && nextSec.PageOwner)
      {
        // Per cominciare lei non e' piu' owner!
        nextSec.PageOwner = false;
        //
        // Ora devo prendere tutti i figli di nextSec... Per farlo, pero', devo prima
        // tener conto del fatto che io sono appena nata e non ancora realizzata.
        // Se io non sono owner... non c'e' problema... lei deve passare tutto al
        // mio owner che e' sicuramente gia' realizzato... ma se io sono owner
        // non ho ancora la SectionBox... quindi mi devo prima realizzare
        if (newsec.PageOwner && this.Realized)
          newsec.Realize(this.PageBox, nextSec.SectionBox);
        //
        // Ora posso proseguire con il prendere i figli
        while (nextSec.SectionBox.childNodes.length)
        {
          var c = nextSec.SectionBox.childNodes[0];
          //
          // Li metto al posto giusto
          if (newsec.PageOwner)
            newsec.SectionBox.appendChild(nextSec.SectionBox.removeChild(c));
          else
            newsec.OwnerSection.SectionBox.appendChild(nextSec.SectionBox.removeChild(c));
        }
        //
        // Ora devo eliminare il suo oggetto DOM dal DOM
        nextSec.SectionBox.parentNode.removeChild(nextSec.SectionBox);
        //
        nextSec.OwnerSection = (newsec.PageOwner ? newsec : newsec.OwnerSection);
        nextSec.SectionBox = (newsec.PageOwner ? newsec.SectionBox : newsec.OwnerSection.SectionBox);
        //
        // Se, per caso, c'erano sezioni che avevano nextSec come owner... ora cambiano l'owner!
        var n = this.Sections.length;
        for (var i=0; i<n; i++)
          if (this.Sections[i].OwnerSection == nextSec)
            this.Sections[i].OwnerSection = nextSec.OwnerSection;
      }
    }
    //
    // Inserisco al posto giusto e realizzo
    if (previdx != -1 && previdx < this.Sections.length)
    {
      if (!newsec.Realized && this.Realized)
        newsec.Realize(this.PageBox, this.Sections[previdx].SectionBox);
      this.Sections.splice(previdx, 0, newsec);
    }
    else
    {
      if (!newsec.Realized && this.Realized)
        newsec.Realize(this.PageBox);
      this.Sections[this.Sections.length] = newsec;
    }
    //
    // Se la nuova sezione non ha l'overlay
    if (!newsec.Overlay)
    {
      // Devo controllare se, per caso, e' finita in mezzo a sezioni con overlay nascoste...
      // In quel caso devo:
      // 1) renderla visibile creando il suo oggetto DOM
      // 2) spostare in quell'oggetto DOM tutti i suoi figli
      // 3) spostare in quell'oggetto DOM tutti i figli delle sezioni con overlay nascoste che seguono
      var nextSec = null;
      if (previdx!=-1 && previdx<this.Sections.length-1)
      {
        for (var i=previdx+1; i<this.Sections.length && !nextSec; i++)
          if (this.Sections[i].MastroBox == newsec.MastroBox)
            nextSec = this.Sections[i];
      }
      //
      if (nextSec && nextSec.Overlay && !nextSec.PageOwner)
      {
        // Hai, la sezione prima della quale sono finita ha l'overlay ed e' nascosta...
        // Devo renderla visibile: creo l'oggetto DOM
        nextSec.SectionBox = nextSec.OwnerSection.SectionBox.cloneNode(false);
        nextSec.SectionBox.setAttribute("id", nextSec.Identifier);
        //
        // Ora sposto tutte le box delle sezioni con overlay che mi seguono, 
        // dentro al nuovo container della sezione che mi segue.
        // Lo faccio per tutte le sezioni con overlay che mi seguono (compresa quella
        // che mi segue e che sto rendendo visibile) fino a quando trovo una sezione
        // senza overlay o una sezione con overlay gia' visibile
        var visSec = null;
        var n = this.Sections.length;
        for (var i=previdx+1; i<n; i++)
        {
          var sec = this.Sections[i];
          //
          // Se questa sezione e' visibile (senza overlay o con overlay visibile), ho finito
          if (!sec.Overlay || sec.PageOwner)
          {
            // Se sono nella stessa Mastro, mi ricordo che questa e' visibile
            // (alla fine dovro' mettere la nextSec prima di questa)
            if (sec.MastroBox == nextSec.MastroBox)
              visSec = sec;
            break;
          }
          //
          // L'owner di questa sezione e' la sezione che ho reso visibile
          sec.OwnerSection = nextSec;
          sec.SectionBox = nextSec.SectionBox;
          //
          // Sposto le box
          var n1 = sec.BoxList.length;
          for(var i1=0; i1<n1; i1++)
          {
            var b = sec.BoxList[i1];
            nextSec.SectionBox.appendChild(b.BoxBox);
          }
        }
        //
        // Dico che ora e' owner e non si deve piu' nascondere
        nextSec.PageOwner = true;
        nextSec.OwnerSection = null;
        //
        // Inserisco il nuovo oggetto DOM dentro alla pagina, inserendolo al posto giusto
        // (prima della prossima sezione visibile se l'ho trovata o alla fine)
        if (visSec)
          visSec.SectionBox.parentNode.insertBefore(nextSec.SectionBox, visSec.SectionBox);
        else
          nextSec.MastroBox.BoxBox.appendChild(nextSec.SectionBox);
        //
        // Inoltre mi devo spostare prima di lei
        nextSec.SectionBox.parentNode.insertBefore(newsec.SectionBox, nextSec.SectionBox);
      }
    }
  }
  //
  // Al termine devo ricalcolare il layout
  this.ParentBook.RecalcLayout = true;
}

// ********************************************************************************
// Aggiorna le zone fisse
// ********************************************************************************
BookPage.prototype.UpdateFixedZones = function()
{
  // Se non sono stata realizzata, esco
  if (!this.Realized)
    return;
  //
  // Le zone fisse non possono essere piu' grandi della pagina!
  var fixW = Math.min(this.Width, this.ParentBook.FixedWidth / (this.UM=="mm" ? 100.0 : 1000.0));
  var fixH = Math.min(this.Height, this.ParentBook.FixedHeight / (this.UM=="mm" ? 100.0 : 1000.0));
  //
  // Se c'e' una zona fissa a sinistra e non ho ancora creato la zona fissa, lo faccio
  if (fixW != 0 && !this.FixedLeftPageBox)
  {
    this.FixedLeftPageBox = document.createElement("div");
    this.FixedLeftPageBox.setAttribute("id", this.Identifier+"fixLeft");
    this.FixedLeftPageBox.className = "book-page-container-fixed book-page-container-fixed-left";
    this.ParentBook.ContentBox.appendChild(this.FixedLeftPageBox);
    //
    if (RD3_Glb.IsMobile())
    {
      this.FixedLeftScroll = new IDScroll(this.ParentBook.Identifier+":fxl", this.ParentBook.ContentBox, this.FixedLeftPageBox, this.ParentBook);
      this.FixedLeftScroll.AllowXScroll = false;
      this.FixedLeftScroll.AllowYScroll = false;
    }
  }
  else if (fixW == 0 && this.FixedLeftPageBox)
  {
    // Ho la zona fissa ma non serve piu'... la distruggo e risposto le box nella pagina
    while (this.FixedLeftPageBox.childNodes.length)
      this.PageBox.appendChild(this.FixedLeftPageBox.childNodes[0]);
    //
    if (this.FixedLeftPageBox.parentNode)
      this.FixedLeftPageBox.parentNode.removeChild(this.FixedLeftPageBox);
    this.FixedLeftPageBox = null;
    //
    if (this.FixedLeftScroll)
      this.FixedLeftScroll.Unrealize();
    this.FixedLeftScroll = null;
  }
  //
  // Se c'e' una zona fissa in alto e non ho ancora creato la zona fissa, lo faccio
  if (fixH != 0 && !this.FixedTopPageBox)
  {
    this.FixedTopPageBox = document.createElement("div");
    this.FixedTopPageBox.setAttribute("id", this.Identifier+"fixTop");
    this.FixedTopPageBox.className = "book-page-container-fixed book-page-container-fixed-top";
    this.ParentBook.ContentBox.appendChild(this.FixedTopPageBox);
    //
    if (RD3_Glb.IsMobile())
    {
      this.FixedTopScroll = new IDScroll(this.ParentBook.Identifier+":fxt", this.ParentBook.ContentBox, this.FixedTopPageBox, this.ParentBook);
      this.FixedTopScroll.AllowXScroll = false;
      this.FixedTopScroll.AllowYScroll = false;
    }
  }
  else if (fixH == 0 && this.FixedTopPageBox)
  {
    // Ho la zona fissa ma non serve piu'... la distruggo e risposto le box nella pagina
    while (this.FixedTopPageBox.childNodes.length)
      this.PageBox.appendChild(this.FixedTopPageBox.childNodes[0]);
    //
    if (this.FixedTopPageBox.parentNode)
      this.FixedTopPageBox.parentNode.removeChild(this.FixedTopPageBox);
    this.FixedTopPageBox = null;
    //
    if (this.FixedTopScroll)
      this.FixedTopScroll.Unrealize();
    this.FixedTopScroll = null;
  }
  //
  // Se ho entrambe le zone fisse mi serve il "tappo" in alto a sinistra
  if (fixW != 0 && fixW != 0 && !this.FixedTopLeftPageBox)
  {
    this.FixedTopLeftPageBox = document.createElement("div");
    this.FixedTopLeftPageBox.setAttribute("id", this.Identifier+"fixTopLeft");
    this.FixedTopLeftPageBox.className = "book-page-container-fixed book-page-container-fixed-left book-page-container-fixed-top";
    this.ParentBook.ContentBox.appendChild(this.FixedTopLeftPageBox);
    //
    if (RD3_Glb.IsMobile())
    {
      this.FixedTopLeftScroll = new IDScroll(this.ParentBook.Identifier+":fxtl", this.ParentBook.ContentBox, this.FixedTopLeftPageBox, this.ParentBook);
      this.FixedTopLeftScroll.AllowXScroll = false;
      this.FixedTopLeftScroll.AllowYScroll = false;
    }
  }
  else if ((fixW == 0 || fixW == 0) && this.FixedTopLeftPageBox)
  {
    // Ho il tappo ma non serve piu'... la distruggo e risposto le box nella pagina
    while (this.FixedTopLeftPageBox.childNodes.length)
      this.PageBox.appendChild(this.FixedTopLeftPageBox.childNodes[0]);
    //
    if (this.FixedTopLeftPageBox.parentNode)
      this.FixedTopLeftPageBox.parentNode.removeChild(this.FixedTopLeftPageBox);
    this.FixedTopLeftPageBox = null;
    //
    if (this.FixedTopLeftScroll)
      this.FixedTopLeftScroll.Unrealize();
    this.FixedTopLeftScroll = null;
  }
  //
  // Se ho una qualunque zona fissa, creo il contenitore per le pagine
  if ((fixW || fixH) && !this.FixedPageBox)
  {
    this.FixedPageBox = document.createElement("div");
    this.FixedPageBox.setAttribute("id", this.Identifier+"fix");
    this.FixedPageBox.className = "book-page-container-fixed";
    if (RD3_Glb.IsMobile())
      this.ParentBook.MobilePageContainer.insertBefore(this.FixedPageBox, this.ParentBook.MobilePageContainer.firstChild);
    else
      this.ParentBook.ContentBox.insertBefore(this.FixedPageBox, this.ParentBook.ContentBox.firstChild);
    this.FixedPageBox.appendChild(this.PageBox);
    //
    // Questo non scrolla piu'
    this.ParentBook.ContentBox.style.overflow = "hidden";
    if (RD3_Glb.IsIE())
    {
      this.ParentBook.ContentBox.style.overflowX = "hidden";
      this.ParentBook.ContentBox.style.overflowY = "hidden";
    }
    //
    if (RD3_Glb.IsMobile())
    {
      if (this.ParentBook.IDScroll)
        this.ParentBook.IDScroll.Unrealize();
      this.ParentBook.IDScroll = new IDScroll(this.ParentBook.Identifier, this.PageBox, this.FixedPageBox, this.ParentBook);
      this.ParentBook.SetScrollbar();
      //
      RD3_Glb.SetTransform(this.PageBox, "translate3d(0px,0px,0px)");
    }
    else
    {
      // Attacco l'evento per gestire le zone fisse
      this.FixedPageBox.style.overflow = "auto";
      this.FixedPageBox.onscroll = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnScroll', ev)");        
    }
  }
  else if ((fixW == 0 && fixH == 0) && this.FixedPageBox)
  {
    // Ho il contenitore delle pagine ma non mi serve piu'... ripristino
    while (this.FixedPageBox.childNodes.length)
      this.ParentBook.ContentBox.appendChild(this.FixedPageBox.childNodes[0]);
    //
    if (this.FixedPageBox.parentNode)
      this.FixedPageBox.parentNode.removeChild(this.FixedPageBox);
    this.FixedPageBox = null;
    //
    this.ParentBook.ContentBox.style.overflow = "";
    //
    // Ripristino la pagina
    this.PageBox.style.marginLeft = "";
    this.PageBox.style.marginTop = "";
    //
    // Ripristino IDScroll su mobile
    if (RD3_Glb.IsMobile())
    {
      if (this.ParentBook.IDScroll)
        this.ParentBook.IDScroll.Unrealize();
      this.ParentBook.IDScroll = null;
      //
      this.ParentBook.UpdateMobileContainer();
    }
  }
  //
  // Ora adatto le dimensioni delle zone fisse
  if (this.FixedLeftPageBox || this.FixedTopPageBox)
  {
    var wx = Math.round(RD3_Glb.ConvertIntoPx(fixW, this.UM));
    var hx = Math.round(RD3_Glb.ConvertIntoPx(fixH, this.UM));
    var bgColor = RD3_Glb.GetCurrentStyle(this.PageBox).backgroundColor;
    if (bgColor == "transparent" || bgColor == "rgba(0, 0, 0, 0)")
      bgColor = RD3_Glb.GetCurrentStyle(this.ParentBook.WebForm.FormBox).backgroundColor;
    //
    if (this.FixedLeftPageBox)
    {
      this.FixedLeftPageBox.style.height = this.HeightPx+1 + "px";
      this.FixedLeftPageBox.style.width = wx + "px";
      this.FixedLeftPageBox.style.backgroundColor = bgColor;
    }
    if (this.FixedTopPageBox)
    {
      this.FixedTopPageBox.style.width = this.WidthPx+1 + "px";
      this.FixedTopPageBox.style.height = hx + "px";
      this.FixedTopPageBox.style.backgroundColor = bgColor;
    }
    if (this.FixedTopLeftPageBox)
    {
      this.FixedTopLeftPageBox.style.width = wx + "px";
      this.FixedTopLeftPageBox.style.height = hx + "px";
      this.FixedTopLeftPageBox.style.backgroundColor = bgColor;
      this.FixedTopLeftPageBox.style.zIndex = 2;
    }
    if (this.FixedPageBox)
    {
      this.FixedPageBox.style.left = wx + "px";
      this.FixedPageBox.style.top = hx + "px";
      if (this.ParentBook.ContentBox.clientWidth>wx)
        this.FixedPageBox.style.width = this.ParentBook.ContentBox.clientWidth-wx + "px";
      if (this.ParentBook.ContentBox.clientHeight>hx)
        this.FixedPageBox.style.height = this.ParentBook.ContentBox.clientHeight-hx + "px";
      if (RD3_Glb.IsMobile())
        this.ParentBook.IDScroll.CalcLimits();
      //
      // Rendo inaccessibile la zona "coperta" della pagina
      this.PageBox.style.marginLeft = -wx + "px";
      this.PageBox.style.marginTop = -hx + "px";
    }
  }
  //
  // Da ultimo sposto le box dalla pagina alle zone fisse e viceversa
  var n = this.MastroBoxes.length;
  for(var i=0; i<n; i++)
  {
    var b = this.MastroBoxes[i];
    if (this.FixedLeftPageBox && b.XPos + b.Width <= fixW && b.YPos >= fixH)
      this.FixedLeftPageBox.appendChild(b.BoxBox);
    else if (this.FixedTopPageBox && b.YPos + b.Height <= fixH && b.XPos >= fixW)
      this.FixedTopPageBox.appendChild(b.BoxBox);
    else if (this.FixedTopLeftPageBox && b.XPos + b.Width <= fixW && b.YPos + b.Height <= fixH)
      this.FixedTopLeftPageBox.appendChild(b.BoxBox);
    else
      this.PageBox.appendChild(b.BoxBox);
  }
}

// ********************************************************************************
// Scroll della pagina
// ********************************************************************************
BookPage.prototype.OnScroll = function(ev)
{
  // Se non ho zone fisse, ho gia' finito
  if (!this.FixedLeftPageBox && !this.FixedTopPageBox)
    return;
  //
  // Se sono su mobile, ev e' un oggetto siffatto (vedi IDScroll:PositionScrollbar)
  // {target:[array 2 dimensioni con dx:dy], time:[tempo totale animazione], funct:[funzione animazione]}
  var dx = 0;
  var dy = 0;
  if (RD3_Glb.IsMobile())
  {
    dx = -ev.target[0];
    dy = -ev.target[1];
  }
  else
  {
    var srcEl = null;
    if (ev.srcElement)
      srcEl = ev.srcElement;
    else if (ev.explicitOriginalTarget)
      srcEl = ev.originalTarget;
    //
    if (srcEl)
    {
      dx = srcEl.scrollLeft;
      dy = srcEl.scrollTop;
    }
  }
  //
  if (dx<0) dx=0;
  if (dy<0) dy=0;
  //
  // Se ho la zona fissa a sinistra
  if (this.FixedLeftPageBox)
  {
    if (RD3_Glb.IsMobile())
    {
      RD3_Glb.SetTransitionDuration(this.FixedLeftPageBox, ev.time);
      RD3_Glb.SetTransitionTimingFunction(this.FixedLeftPageBox, ev.funct);
      RD3_Glb.SetTransform(this.FixedLeftPageBox, "translate3d(0px,"+-dy+"px, 0px)");
    }
    else
      this.FixedLeftPageBox.style.top = -dy + "px";
  }
  //
  // Se ho la zona fissa in alto
  if (this.FixedTopPageBox)
  {
    if (RD3_Glb.IsMobile())
    {
      RD3_Glb.SetTransitionDuration(this.FixedTopPageBox, ev.time);
      RD3_Glb.SetTransitionTimingFunction(this.FixedTopPageBox, ev.funct);
      RD3_Glb.SetTransform(this.FixedTopPageBox, "translate3d("+-dx+"px,0px, 0px)");
    }
    else
      this.FixedTopPageBox.style.left = -dx + "px";
  }
}


// ******************************************************************
// Memorizza o ripristina le posizione delle scrollbar
// usata quando una modale viene riportata in primo piano per non 
// perdere il posizionamento delle scrollbar
//
// vedi popupframe::BringToFront
// ******************************************************************
BookPage.prototype.SaveScrollPos = function () 
{
  if (!this.MastroBoxes)
    return;
  //
  var n = this.MastroBoxes.length;
  for (var i = 0; i < n; i++)
    this.MastroBoxes[i].SaveScrollPos();
}


BookPage.prototype.SetScrollPos = function () 
{
  if (!this.MastroBoxes)
    return;
  //
  var n = this.MastroBoxes.length;
  for (var i = 0; i < n; i++)
    this.MastroBoxes[i].SetScrollPos();
}

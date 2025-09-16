// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe BookSection: Rappresenta una sezione
// in una pagina di un book
// ************************************************

function BookSection(ppage)
{
	// Proprieta' di questo oggetto di modello
  this.Identifier = null;				// Identificatore della sezione (univoco)
  this.XPos = 0;								// Posizione della sezione
  this.YPos = 0;								// Posizione della sezione
  this.Width = 0;								// Altezza della sezione
  this.Height = 0;							// Altezza della sezione
  this.VisStyle = 0;						// Visual Style associato a questa sezione
  this.NumCol = 1;							// Numero di colonne
  this.ColSpace = 0;						// Spazio fra le colonne
  this.RecNumber = 0;						// Numero del record della sezione
  this.Visible = true;					// Sezione visibile?
  this.MastroBox = null;				// La Box mastro che contiene questa sezione
  this.Overlay = false;         // La sezione deve essere sovrapposta?
  this.ClassName;               // Classe aggiuntiva
  //
  // Oggetti figli di questo nodo
  this.BoxList = new Array(); 	// Box contenute in questa sezione
  //
  // Altre variabili di modello...
  this.ParentPage = ppage;      // L'oggetto pagina in cui e' inserita
  this.ParentBox = null;        // Se sub-section indica la box che mi contiene
  this.PageOwner = true;        // Sono il possessore della mia SectionBox? (false solo per box in overlay successive alla prima box)
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo nodo
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi al nodo
  this.SectionBox = null;     // Il DIV complessivo della sezione
}


// *******************************************************************
// Inizializza questa box leggendo i dati da un nodo <box> XML
// *******************************************************************
BookSection.prototype.LoadFromXml = function(node) 
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
				var newbox = new BookBox(this.ParentPage);
				newbox.ParentSect = this;
				newbox.Alternate = (this.RecNumber % 2 == 0);
      	newbox.LoadFromXml(objnode);
     		//
      	this.BoxList[this.BoxList.length] = newbox;
			}
			break;
		}
	}		
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
BookSection.prototype.ChangeProperties = function(node)
{
	// Normale cambio di proprieta'
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
BookSection.prototype.LoadProperties = function(node)
{
  // Ciclo su tutti gli attributi del nodo
  var attrlist = node.attributes;
  var mm = this.ParentPage.UM=="mm";
  var n = attrlist.length;
  for (var i=0; i<n; i++)
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    //
    switch(nome)
    {
    	case "xp": this.SetXPos((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
    	case "yp": this.SetYPos((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
    	case "wid": this.SetWidth((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
    	case "hei": this.SetHeight((mm)? parseInt(valore)/100.0 : parseInt(valore)/1000.0); break;
    	case "sty": this.SetVisStyle(valore); break;
    	case "vis": this.SetVisible(valore=="1"); break;
    	case "col": this.SetNumCol(parseInt(valore)); break;
    	case "csp": this.SetColSpace(parseInt(valore)); break;
    	case "mas": this.SetMastroBox(valore); break;
    	case "rec": this.SetRecNumber(parseInt(valore)); break;
    	case "ovr": this.SetOverlay(valore=="1"); break;
      case "cln": this.SetClassName(valore); break;
    	    	    	
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
BookSection.prototype.SetXPos= function(value) 
{
	if (value!=undefined)
	{
		if (this.XPos != value)
  		this.ParentPage.ParentBook.RecalcLayout = true;
		this.XPos = value;
	}
}

BookSection.prototype.SetYPos= function(value) 
{
	if (value!=undefined)
	{
		if (this.YPos != value)
  		this.ParentPage.ParentBook.RecalcLayout = true;
		this.YPos = value;
	}
}

BookSection.prototype.SetWidth= function(value) 
{
	if (value!=undefined)
	{
		if (this.Width != value)
  		this.ParentPage.ParentBook.RecalcLayout = true;
		this.Width = value;
	}
}

BookSection.prototype.SetHeight= function(value) 
{
	if (value!=undefined)
	{
		if (this.Height != value)
  		this.ParentPage.ParentBook.RecalcLayout = true;
		this.Height = value;
	}
}

BookSection.prototype.SetVisStyle= function(value) 
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
	if (this.Realized && this.PageOwner)
	{
		this.VisStyle.ApplyStyle(this.SectionBox, this.RecNumber % 2 == 0); // Alternato, se pari
    //
    if (this.VisStyle != old)
      this.ParentPage.ParentBook.RecalcLayout = true;
	}
}

BookSection.prototype.SetVisible= function(value) 
{
	if (value!=undefined)
		this.Visible = value;
	//
	if (this.Realized)
	{
	  if (this.PageOwner)
  	  this.SectionBox.style.display = (this.Visible ? "" : "none");
  	else
	  {
	    // Non sono owner... quindi tutte le mie box sono dentro qualcun altro...
	    // Devo nascondere/rendere visibili anche loro!
      var n = this.BoxList.length;
      for (var i = 0; i<n; i++)
      {
        var b = this.BoxList[i];
        //
        // Se io e la box siamo in disaccordo con lo stato di visibilita'... aggiorno la box
        if (b.Visible != this.Visible)
      		b.BoxBox.style.display = (this.Visible ? "" : "none");
      }
	  }
	}
}

BookSection.prototype.SetNumCol= function(value) 
{
	if (value!=undefined)
		this.NumCol = value;
}

BookSection.prototype.SetColSpace= function(value) 
{
	if (value!=undefined)
		this.ColSpace = value;
}

BookSection.prototype.SetMastroBox= function(value) 
{
  var old = this.MastroBox;
	if (value!=undefined)
		this.MastroBox = RD3_DesktopManager.ObjectMap[value];
	//
	// Indico alla box che conterra' delle sezioni
	if (this.MastroBox)
		this.MastroBox.MastroWithSections = true;
  //
  // Se sono gia' stata realizzata e sono davvero cambiata, devo spostarmi
  if (this.Realized && old!=this.MastroBox && this.MastroBox && this.MastroBox.Realized)
  	this.MastroBox.BoxBox.appendChild(this.SectionBox);
}

BookSection.prototype.SetRecNumber= function(value) 
{
  var oldRecNum = this.RecNumber;
  //
	if (value!=undefined)
		this.RecNumber = value;
	//
	if (this.Realized)
	{
	  // Dunque mi devo posizionare DOPO la sezione che ha il RecNumber precedente al mio
    var PrevSecIdx = -1;
    var FirstSecIdx = -1;
    var MySecIdx = -1;
    //
    var arr = (this.ParentBox ? this.ParentBox.SubSections : this.ParentPage.Sections);
    var n = arr.length;
    for (var i=0; i<n; i++)
    {
      if (arr[i].RecNumber == this.RecNumber-1)
        PrevSecIdx = i;
      //
      if (arr[i].RecNumber == 1)
        FirstSecIdx = i;
      //
      if (arr[i] == this)
        MySecIdx = i;
    }
    //
    // Se l'ho trovata... mi posiziono al posto giusto
    if (PrevSecIdx>=0)
    {
	    // Mi riposiziono in memoria
	    arr.splice(MySecIdx, 1);             // mi rimuovo
	    //
      // Mi sono rimosso, se ero prima devo tener conto del fatto che il buco e' stato chiuso
      if (MySecIdx<PrevSecIdx)
        PrevSecIdx--;
      //
	    arr.splice(PrevSecIdx+1, 0, this);   // mi posiziono dopo di lei
    }
    else // Non l'ho trovata... mi devo mettere all'inizio!
    {
	    // Mi riposiziono in memoria
	    arr.splice(MySecIdx, 1);             // mi rimuovo
	    arr.splice(FirstSecIdx, 0, this);    // mi posiziono all'inizio
	  }
	  //
	  // Se sono in overlay mi devo occupare anche delle box!
	  if (this.Overlay)
	  {
	    // Se sono il possessore, do' anche a me stesso lo zIndex
	    if (this.PageOwner)
	      this.SectionBox.style.zIndex = 0;
	    //
  	  // Ora mi occupo delle mie box... uso lo zIndex
      var n = this.BoxList.length;
      for (var i = 0; i<n; i++)
        this.BoxList[i].BoxBox.style.zIndex = this.RecNumber * 1000 + i;
	  }
	  //
	  // Se sono owner
	  if (this.PageOwner)
	  {
	    // E sono passato da pari a dispari o viceversa
	    if ((oldRecNum%2) != (this.RecNumber%2))
	    {
	      // Aggiorno lo stile visuale della sezione
    		this.VisStyle.ApplyStyle(this.SectionBox, this.RecNumber % 2 == 0); // Alternato, se pari
    		//
    		// Devo riapplicare il VS anche a tutte le box!!!
        for (var i = 0; i<n; i++)
        {
          var b = this.BoxList[i];
  				b.Alternate = (this.RecNumber % 2 == 0);
  				b.SetVisStyle();
  			}
  		}
  	}
	}
}

BookSection.prototype.SetOverlay= function(value) 
{
	if (value!=undefined)
		this.Overlay = value;
	//
	// Non puo' cambiare se non all'apertura della form
}

// *******************************************************************
// Applico la classe
// *******************************************************************
BookSection.prototype.SetClassName = function(cls)
{
  var old = this.ClassName;
  if (cls != undefined)
    this.ClassName = cls;
  //
  if (this.Realized && (old != this.ClassName || !cls)) 
  {
    // Rimuovo la classe precedente
    if (old != "") 
      RD3_Glb.RemoveClass2(this.SectionBox, old);
    //
    // Applico la nuova classe alla fine della lista
    if (this.ClassName && this.ClassName != "")
      RD3_Glb.AddClass(this.SectionBox, this.ClassName);
  }
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
BookSection.prototype.Realize = function(parent, before)
{
  if (this.PageOwner)
  {
    this.SectionBox = document.createElement("div");
    this.SectionBox.setAttribute("id", this.Identifier);
    this.SectionBox.className = "book-section";  
  }
	//
  // Poi chiedo ai miei figli di realizzarsi
  var n = this.BoxList.length;
  for(var i=0; i<n; i++)
  {
    this.BoxList[i].Realize(this.SectionBox);
  }
  //
  // Eseguo l'impostazione iniziale delle mie proprieta' (quelle che cambiano l'aspetto visuale)
  this.Realized = true;
  //
  this.SetXPos();
  this.SetYPos();
  this.SetWidth();
  this.SetHeight();
  this.SetVisStyle();
  this.SetVisible();
  this.SetClassName();
  //
  // La sezione non e' posizionata a video... verra' posizionata alla fine con l'AdaptLayout
  // Quindi e' meglio lasciarla invisibile... verra' mostrata quando viene dimensionata e posizionata (AdaptSect)
  if (this.PageOwner)
  	this.SectionBox.style.display = "none";
  //
  // Appendo al DOM solo se ho creato un mio box di sezione
  if (this.PageOwner)
  {
    if (this.MastroBox)
    {
    	this.MastroBox.BoxBox.appendChild(this.SectionBox);
    }
    else
    {
      if (before)
        parent.insertBefore(this.SectionBox, before);
      else
    		parent.appendChild(this.SectionBox);
  	}
  }
}


// **********************************************************************
// Rimuove questa box
// **********************************************************************
BookSection.prototype.Unrealize = function()
{
	// Tolgo l'oggetto dalla mappa comune
	RD3_DesktopManager.ObjectMap.remove(this.Identifier);
	//
	// Passo il messaggio ai figli
  var n = this.BoxList.length;
  for(var i=0; i<n; i++)
  {
    this.BoxList[i].Unrealize();
  }
  //
  // Elimino gli oggetti visuali 
  // Controllo se sono l'owner della section o meno
  if (this.PageOwner && this.SectionBox && this.SectionBox.parentNode)
    this.SectionBox.parentNode.removeChild(this.SectionBox);
}


// **********************************************************************
// Rimuove questa box in maniera ritardata (chiamato dall'animazione
// se necessario)
// **********************************************************************
BookSection.prototype.UnrealizeDelayed = function()
{
  // Guardo nella mappa: se l'oggetto con il mio id sono io lo tolgo senza problemi, se e' un altro
  // allora lo lascio
	var ob = RD3_DesktopManager.ObjectMap[""+this.Identifier];
	if (ob == this)
	  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
	//
	// Passo il messaggio ai figli
  var n = this.BoxList.length;
  for(var i=0; i<n; i++)
  {
    this.BoxList[i].UnrealizeDelayed();
  }
  //
  // Elimino gli oggetti visuali 
  // Controllo se sono l'owner della section o meno
  if (this.PageOwner && this.SectionBox)
    this.SectionBox.parentNode.removeChild(this.SectionBox);
}


// ********************************************************************************
// Ricalcola le dimensioni della sezione
// ********************************************************************************
BookSection.prototype.AdaptSect = function()
{
  // Non adatto la sezione se non e' stata realizzata o se e' una sezione che non contiene box
  // dato che e' una sezione con overlay le cui box sono pero' state renderizzate altrove
  if (this.Realized && this.PageOwner)
  {
    var rect = new Rect();
    //
    // Non e' corretto convertire in PX le sole larghezze e altezze dato che avrei problemi con gli arrotondamenti
    // Posso solo convertire (e arrotondare) le coordinate RIGHT e BOTTOM e solo allora togliere i TOP e LEFT
    // In questo modo gli arrotondamenti sono corretti (es: box con LEFT=12mm e larghezza 12mm. 12mm convertito
    // in px diventa 45px... se converto separatamente ottengo LEFT=45px e WIDTH=45px ma se converto in maniera
    // corretta ottengo LEFT=45px e WIDTH=46px!!! dato che 12+12=24mm convertito e' 91px ed e' diverso da 45px+45px!).
  	// Inoltre le coordinate delle sezioni sono relative al parent e se non voglio commettere altri errori
  	// di arrotondamento devo convertire le coordinate LEFT, TOP, RIGHT e BOTTOM sommando gli offset di tutti
  	// i padri in cui sono contenuta... poi, dopo aver convertito, posso sottrarre gli offset del padre
  	//
  	// Prima calcolo il TOP/LEFT dell'oggetto padre
  	var lpar = 0;
  	var tpar = 0;
  	var o = this.MastroBox;
  	while (o)
  	{
  	  lpar += o.XPos;
  	  tpar += o.YPos;
  	  //
  	  // Se o e' una sezione, suo padre e' una box
  	  // Se o e' una box, suo padre e' una sezione
  	  if (o instanceof BookSection)
  	    o = o.MastroBox;
  	  else
  	    o = o.ParentSect;
  	}
  	//
  	// Ora ho il TopLeft di mio padre calcolato assoluto sulla pagina e posso convertire i miei dati
    rect.x = Math.round(RD3_Glb.ConvertIntoPx(this.XPos + lpar, this.ParentPage.UM)) - Math.round(RD3_Glb.ConvertIntoPx(lpar, this.ParentPage.UM));
    rect.y = Math.round(RD3_Glb.ConvertIntoPx(this.YPos + tpar, this.ParentPage.UM)) - Math.round(RD3_Glb.ConvertIntoPx(tpar, this.ParentPage.UM));
  	rect.w = Math.round(RD3_Glb.ConvertIntoPx(this.XPos + lpar + this.Width, this.ParentPage.UM)) - rect.x - Math.round(RD3_Glb.ConvertIntoPx(lpar, this.ParentPage.UM));
  	rect.h = Math.round(RD3_Glb.ConvertIntoPx(this.YPos + tpar + this.Height, this.ParentPage.UM)) - rect.y - Math.round(RD3_Glb.ConvertIntoPx(tpar, this.ParentPage.UM));
    //
    // Memorizzo le mie coordinate TOP/LEFT assolute (mi servono per adattare il mio contenuto)
    this.XAbsPx = Math.round(RD3_Glb.ConvertIntoPx(this.XPos + lpar, this.ParentPage.UM));
    this.YAbsPx = Math.round(RD3_Glb.ConvertIntoPx(this.YPos + tpar, this.ParentPage.UM));
    //
  	// Recupero le dimensioni dei bordi e padding
  	var rbrd = this.VisStyle.GetBookOffset(true);
  	var rpad = this.VisStyle.GetBookOffset();   // bordo+padding
  	rpad.x -= rbrd.x;
  	rpad.y -= rbrd.y;
  	rpad.w -= rbrd.w;
  	rpad.h -= rbrd.h;
  	//
  	// Se sono contenuta in una box
  	if (this.MastroBox)
  	{
  	  // Cerco il VS della box in cui sono contenuta
  	  var vspar = this.MastroBox.VisStyle;
  	  if (vspar)
  	  {
  	    // Recupero la dimensione dei bordi della sezione in cui sono contenuta (solo bordi, no padding!)
  	    var rboxbrd = vspar.GetBookOffset(true);
  	    //
  	    // Se sono una sezione multi-colonnare e sia la box in cui sono contenuta che me stessa abbiamo
  	    // un bordo vedrei la collisione solo per la prima fila a sinistra (primo if: rect.x==0) e 
  	    // in alto (terzo if: rect.y==0).
  	    // Ma se io mi sposto in alto a sinistra, devono spostarsi in alto a sinista tutte le sezioni della
  	    // stessa mastro box!!! Altrimenti si sposta solo la prima riga e la prima colonna!
  	    var movedX = false;
  	    var movedY = false;
  	    //
  	    // Se la box in cui sono contenuta ha un bordo ed io ho un bordo e le 
  	    //  coordinate left/top collidono mi sposto sopra il bordo della box
  	    // Se la box in cui sono contenuta NON ha un bordo ed io ho un bordo 
  	    // destro/sotto e le coordinate Bottom/Right collidono mi stringo
  	    if (rboxbrd.x>0 && rbrd.x!=0 && rect.x==0)
  	    {
	        rect.x -= rboxbrd.x;
	        //
	        // Sono una sezione multi-colonnare. Informo la mia MastroBox che tutte le altre mie sorelle
	        // si dovranno spostare della stessa dimensione di cui mi sono spostata io
	        if (this.NumCol != 1)
	          this.MastroBox.MovedX = rboxbrd.x;
	        //
	        // Ma io non lo devo fare ancora... l'ho gia' fatto
	        movedX = true;
	      }
	      if (rboxbrd.w==0 && rbrd.w!=0 && rect.x+rect.w>=this.MastroBox.WPx)
	      {
	        // Dovrei stringermi della dimensione del mio bordo... cosi' si vede... 
	        // Invece faccio crescere la sezione della dimensione del mio... cosi' il mio bordo
	        // si comporta allo stesso modo in cui si comporta il bordo della sezione... esce cosi' viene
	        // coperto dall'oggetto seguente
	        // rect.w -= rbrd.w;
	        this.MastroBox.StretchW = Math.max((!this.MastroBox.StretchW ? 0 : this.MastroBox.StretchW), rbrd.w);
	        //
	        // Qui c'e' un altro problemino... io spingo una box... ma potrebbe essere contenuta in una section...
	        // quindi devo risalire la catena spingendo tutti a destra finche' non trovo qualcuno con un bordo...
	        this.ParentPage.ParentBook.ParGrowWidth(this.MastroBox.ParentSection, this.XAbsPx+rect.x+rect.w, rbrd.w);
	      }
  	    //
    	  if (rboxbrd.y>0 && rbrd.y!=0 && rect.y==0)
    	  {
	        rect.y -= rboxbrd.y;
	        //
	        // Sono una sezione multi-colonnare. Informo la mia MastroBox che tutte le altre mie sorelle
	        // si dovranno spostare della stessa dimensione di cui mi sono spostata io
	        if (this.NumCol != 1)
  	        this.MastroBox.MovedY = rboxbrd.y;
	        //
	        // Ma io non lo devo fare ancora... l'ho gia' fatto
	        movedY = true;
	      }
	      if (rboxbrd.h==0 && rbrd.h!=0 && rect.y+rect.h>=this.MastroBox.HPx)
	      {
	        // Dovrei stringermi della dimensione del mio bordo... cosi' si vede... 
	        // Invece faccio crescere la sezione della dimensione del mio... cosi' il mio bordo
	        // si comporta allo stesso modo in cui si comporta il bordo della sezione... esce cosi' viene
	        // coperto dall'oggetto seguente
          // rect.h -= rbrd.h;
	        this.MastroBox.StretchH = Math.max((!this.MastroBox.StretchH ? 0 : this.MastroBox.StretchH), rbrd.h);
	        //
	        // Qui c'e' un altro problemino... io spingo una box... ma potrebbe essere contenuta in una section...
	        // quindi devo risalire la catena spingendo tutti a destra finche' non trovo qualcuno con un bordo...
	        this.ParentPage.ParentBook.ParGrowHeight(this.MastroBox.ParentSection, this.YAbsPx+rect.y+rect.h, rbrd.h);
	      }
	      //
	      // Se sono una sezione multi-colonnare, verifico se, per caso, una delle mie sorelle si e' spostata...
	      // Se lo ha fatto, devo farlo anch'io!!!
	      if (this.NumCol != 1)
	      {
	        // Se non mi sono gia' mossa a causa dei miei bordi mi sposto
      	  if (!movedX && this.MastroBox.MovedX)
        	  rect.x -= this.MastroBox.MovedX;
      	  if (!movedY && this.MastroBox.MovedY)
      	    rect.y -= this.MastroBox.MovedY;
        }
  	  }
  	}
  	//
  	// Ora mi stringo della dimensione del mio bordo (solo bordi sinistro e sopra)
  	// Inoltre tolgo anche i miei padding
  	rect.w -= rbrd.x + (rpad.x+rpad.w);
  	rect.h -= rbrd.y + (rpad.y+rpad.h);
  	//
  	// Correggo le dimensioni che non possono essere negative
  	if (rect.w<0) rect.w = 0;
  	if (rect.h<0) rect.h = 0;
  	//
  	this.SectionBox.style.left = rect.x + "px";
  	this.SectionBox.style.top = rect.y + "px";
  	this.SectionBox.style.width = rect.w + "px";
  	this.SectionBox.style.height = rect.h + "px";
    //
    // Nella Realize ho fatto nascere la sezione invisibile... ora che l'ho posizionata puo' mostrarsi
	  this.SectionBox.style.display = (this.Visible ? "" : "none");
  	//
  	// Memorizzo le coordinate... mi servono per adattare le box che contengo (vedi BookBox::AdaptBox)
  	this.XPx = rect.x;
  	this.YPx = rect.y;
  	this.WPx = rect.w;
  	this.HPx = rect.h;
  }
}


// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
BookSection.prototype.AdaptLayout = function()
{
  // Se non sono stata realizzata... non faccio nulla
  if (!this.Realized)
    return;
  //
  // Adatto la sezione
  this.AdaptSect();
  //
	// Passo il messaggio ai figli
  var n = this.BoxList.length;
  for(var i=0; i<n; i++)
  {
    this.BoxList[i].AdaptLayout();
  }
  //
  // Cerco la sezione che possiede le mie box (gestione OVERLAY)
  var sec = this;
  if (!sec.PageOwner)
    sec = sec.OwnerSection;
  //
  // Se ci sono stretch da applicare
  if (sec.StretchW || sec.StretchH)
  {
    // Se mi devo allargare perche' contengo box che "toccano" il mio right/bottom
    // ed io non ho bordo (vedi AdaptLayout delle box)
    if (sec.StretchW)
    {
    	sec.WPx = Math.round(sec.WPx + sec.StretchW);
      sec.SectionBox.style.width = sec.WPx + "px";
      //
      // Lo annullo dato che l'ho applicato
      sec.StretchW = 0;
    }
    if (sec.StretchH)
    {
    	sec.HPx = Math.round(sec.HPx + sec.StretchH);
      sec.SectionBox.style.height = sec.HPx + "px";
      //
      // Lo annullo dato che l'ho applicato
      sec.StretchH = 0;
    }
  }
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
BookSection.prototype.AfterProcessResponse= function()
{
	// Passo il messaggio ai figli
  var n = this.BoxList.length;
  for(var i=0; i<n; i++)
    this.BoxList[i].AfterProcessResponse();
}


// ********************************************************************************
// Compone la lista di drop della sezione
// ********************************************************************************
BookSection.prototype.ComputeDropList = function(list, dragobj)
{
  // Se non sono stata realizzata... niente DropList
  if (!this.Realized)
    return;
  //
	// Chiedo a tutte le box se vogliono essere droppate da dragobj
  var n  = this.BoxList.length;
  for (var i = 0; i<n; i++)
  {
  	this.BoxList[i].ComputeDropList(list, dragobj);
  }
}

// ********************************************************************************
// Aggiunge un nuovo figlio a questo oggetto
// ********************************************************************************
BookSection.prototype.InsertChild = function(node)
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
		var newbox = new BookBox(this.ParentPage);
		newbox.ParentSect = this;
		newbox.Alternate = (this.RecNumber % 2 == 0);
  	newbox.LoadProperties(node);
 		//
 		// Calcolo dove inserire la nuova box
 		var previdx = RD3_Glb.FindObjById(this.BoxList, previd);
 		//
  	// Inserisco al posto giusto e realizzo
	  if (previdx != -1 && previdx < this.BoxList.length)
	  {
	    if (this.Realized)
    	  newbox.Realize(this.SectionBox, this.BoxList[previdx].BoxBox);
	    this.BoxList.splice(previdx, 0, newbox);
    }
	  else
	  {
	    if (this.Realized)
    	  newbox.Realize(this.SectionBox);
    	this.BoxList[this.BoxList.length] = newbox;
    }
    //
    // E' nata una nuova box... ricalcolo lo zIndex
    if (this.Overlay && this.Realized)
    {
      var n = this.BoxList.length;
      for (var i = 0; i<n; i++)
        this.BoxList[i].BoxBox.style.zIndex = this.RecNumber * 1000 + i;
    }
  }
	//
	// Al termine devo ricalcolare il layout
	this.ParentPage.ParentBook.RecalcLayout = true;
}


// *******************************************************
// Metodo che gestisce la cancellazione dell'oggetto da parte
// del motore differenziale
// *******************************************************
BookSection.prototype.OnDeleteObject = function(node)
{
  var arr = (this.ParentBox ? this.ParentBox.SubSections : this.ParentPage.Sections);
  var n = arr.length;
  //
  // Se ho l'overlay e sono owner... devo fare qualcosa di meglio!!!
  if (arr && this.Overlay && this.PageOwner)
  {
    // Devo far diventare owner la sezione che mi segue... ed io devo diventare non owner
    // Cosi' quando mi uccidono non faccio nulla...
    for (var i=0; i<n; i++)
      if (arr[i]==this)
        break;
    //
    var nextSec = null;
    for (i=i+1; i<n && !nextSec; i++)
      if (arr[i].MastroBox == this.MastroBox)
        nextSec = arr[i];
    //
    // Se ho trovato una sezione dopo di me che, come me, ha l'overlay
    if (nextSec && nextSec.Overlay)
    {
      // Per cominciare io non sono owner... e lei si'
      this.PageOwner = false;
      this.OwnerSection = nextSec;
      //
      nextSec.PageOwner = true;
      //
	    nextSec.SectionBox = this.SectionBox;
	    //
	    // Gia' che ci sono, ribattezzo l'oggetto DOM con il nome giusto
	    nextSec.SectionBox.setAttribute("id", nextSec.Identifier);
    }
  }
  //
  // Se rimuovo una sezione che non ha l'overlay
  if (arr && !this.Overlay)
  {
    // Vedo se:
    // 1) dopo di me c'e' una sezione con overlay che e' visibile 
    // 2) e prima di me c'e' una sezione con overlay
    // Se questo e' il caso quella dopo di me deve diventare invisibile (deve
    // praticamente infilarsi nella fila delle sezioni invisibili)... Infatti
    // quella dopo di me era visibile solo perche' c'ero io
    for (var i=0; i<n; i++)
      if (arr[i]==this)
        break;
    //
    var prevSec = null;
    var nextSec = null;
    for (var j=i+1; j<n && !nextSec; j++)
      if (arr[j].MastroBox == this.MastroBox)
        nextSec = arr[j];
    for (var j=i-1; j>=0 && !prevSec; j--)
      if (arr[j].MastroBox == this.MastroBox)
        prevSec = arr[j];
    //
    // Quindi se prima di me c'e' una sezione con overlay e dopo di me c'e' una
    // sezione con overlay che e' visibile, quella dopo di me deve diventare invisibile!
    if (prevSec && nextSec && prevSec.Overlay && nextSec.Overlay && nextSec.PageOwner)
    {
      // La sezione che mi segue non e' piu' owner
      nextSec.PageOwner = false;
      //
      // Il suo owner diventa lo stesso dela sezione che mi precede
      nextSec.OwnerSection = (prevSec.PageOwner ? prevSec : prevSec.OwnerSection);
      //
      // Se c'erano sezioni che puntavano a nextSec, ora devono puntare al suo owner
      for (var i1=0; i1<n; i1++)
      {
        if (arr[i1].OwnerSection == nextSec)
          arr[i1].OwnerSection = nextSec.OwnerSection;
      }
      //
      // Sposto il contenuto della sezione che mi segue dentro al suo owner
      while (nextSec.SectionBox.childNodes.length)
      {
        // Metto le box al posto giusto
        var c = nextSec.SectionBox.childNodes[0];
        nextSec.OwnerSection.SectionBox.appendChild(c);
      }
      //
      // Ora elimino il suo oggetto DOM
      nextSec.SectionBox.parentNode.removeChild(nextSec.SectionBox);
      //
      // Ora il suo oggetto DOM e' quello del suo owner
      nextSec.SectionBox = nextSec.OwnerSection.SectionBox;
    }
  }
	//
	// Mi rimuovo dalla lista delle sezioni di mio padre, se c'e' ancora
  if (arr)
  {
    // Mi cerco
    for (var i=0; i<n; i++)
    {
      if (arr[i]==this)
      {
        arr.splice(i, 1);
        break;
      }
    }
  }
}

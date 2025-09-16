// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe IndHandler: gestisce la lista in memoria
// di tutti gli indicatori dell'applicazione
// ************************************************

function IndHandler()
{
  // Proprieta' di questo oggetto di modello
  this.Indicators = new Array();    // Lista degli indicatori
  this.Identifier = "inh";          // Identificatore di questo oggetto
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
}


// **************************************************************
// Inizializza questo IndHandler leggendo i dati da un nodo XML
// **************************************************************
IndHandler.prototype.LoadFromXml = function(node) 
{
	if (node.nodeName != this.Identifier)
		return;
	//
	// Inizializzo le proprieta'
  var objlist = node.childNodes;
	var n = objlist.length;
	//
	// Ciclo sui nodi figli e aggiungo tutti gli indicatori
	for (var i=0; i<n; i++) 
  {
		var objnode = objlist.item(i);
		var nome = objnode.nodeName;
		//
		switch (nome)
		{
		  // Leggo l'indicatore contenuto
			case "ind":
      {
  			var newind = new Indicator();
  			newind.LoadFromXml(objnode);
  			this.Indicators.push(newind);
  		}
  	}
	}
	//
  // Mi Aggiungo alla mappa degli oggetti 
  RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
}


// ***************************************************************
// Aggiunge un nuovo figlio a questo oggetto
// ***************************************************************
IndHandler.prototype.InsertChild = function(node)
{
  var objlist = node.childNodes;
	var n = objlist.length;
	//
	// Ciclo su tutti i nodi che rappresentano oggetti figli
	for (var i=0; i<n; i++) 
  {
		var objnode = objlist.item(i);
		var nome = objnode.nodeName;
		if (nome == "ind")
		{
    	// Creo il nuovo indicatore
      var newind = new Indicator();
      newind.LoadFromXml(objnode);
      this.Indicators.push(newind);
      //
      if (this.Realized)
        newind.Realize(RD3_DesktopManager.WebEntryPoint.StatusBarBox);
    }
  }
}


// ***************************************************************
// Crea gli oggetti DOM relativi a questo oggetto:
// L'oggetto Parent indica dove devono essere contenuti i figli
// ***************************************************************
IndHandler.prototype.Realize = function(parent)
{
  // Ciclo su tutti gli indicatori
  var n = this.Indicators.length;
  for(var i = 0; i < n; i++)
  {
    var ind = this.Indicators[i];
    //
    this.Indicators[i].Realize(parent);
  }
  //
  this.Realized = true;
}


// ********************************************************************
// Distrugge gli oggetti DOM relativi a questo oggetto e ai suoi figli
// ********************************************************************
IndHandler.prototype.Unrealize = function()
{
  var n = this.Indicators.length;
  for(var i = 0; i < n; i++)
  {
    this.Indicators[i].Unrealize();
  }
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  this.Realized = false;
}


// ********************************************************************
// Metodo che gestisce il ridimensionamento e la dimensione
// degli indicatori dinamici
// ********************************************************************
IndHandler.prototype.AdaptLayout = function()
{
  // Se non ho completato la fase di realizzazione di tutti i miei figli non devo gestire cambiamenti di layout,
  // quando tutti gli indicatori saranno stati realizzati wep chiamera' l'AdaptLayout
  if (!this.Realized)
    return;
  //
  var tb = RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR;
  //
  // Calcolo la larghezza totale occupata dagli indicatori non dinamici
  // e quanti indicatori sono dinamici (FixedWidth = 0)
  // tolgo 10px dalla larghezza disponibile per considerare il padding della status bar (6px paddleft + 4px paddright)
  var sbwidth = RD3_DesktopManager.WebEntryPoint.StatusBarBox.clientWidth - 10;  // larghezza status bar
  var indwidth = 0;                                                              // spazio occupato dagli indicatori
  var dynindcount = 0;                                                           // numero di indicatori dinamici
  var viscount = 0;                                                              // numedo di indicatori visibili
  var n = this.Indicators.length;
  //
  for (var i = 0; i < n; i++)
  {
    var ind = this.Indicators[i];
    if (ind.IsVisible())
    {
      // Conto l'indicatore visibile
      viscount++;
      //
      // Dimensiono l'indicatore e lo conto se ha ridimensionamento dinamico
      if (ind.FixedWidth > 0)
      {
        // Reimposto la dimensione perche' se era stata fissata nella Realize era troppo presto, non essendo wep visibile 
        // calcola male le dimensioni; questo e' il punto giusto per farla..
        if (ind.FixedWidth>1)
          ind.SetVisualWidth(ind.FixedWidth);
        //
        indwidth += ind.MyBox.offsetWidth + ((i<n-1)?2:0);  // aggiungo 2px alla larghezza per considerare il margine destro dell'indicatore
      }
      if (ind.FixedWidth == 0)
      {
        dynindcount++;
      }
      //
      // Rendo invisibile il bordo all'indicatore vuoto, per farlo lo rendo uguale
      // allo sfondo per non variare offsetWidth
      if (ind.TextBox.innerHTML == "" && RD3_DesktopManager.WebEntryPoint.MenuType!=RD3_Glb.MENUTYPE_TASKBAR)
      {
        ind.MyBox.className = "indicator-box-empty";
      }
    }
  }
  //
  // Se non ci sono indicatori visibili nascondo la status bar
  if (viscount == 0)
  {
    RD3_DesktopManager.WebEntryPoint.StatusBarBox.className = "status-bar-invisible";
    return;
  }
  else
  {
    RD3_DesktopManager.WebEntryPoint.StatusBarBox.className = "";
  }
  //
  // Se rimane dello spazio disponibile lo distribuisco tra gli eventuali indicatori dinamici
  if (sbwidth > indwidth && dynindcount > 0)
  {
    // Calcolo lo spazio disponbile ad ogni indicatore dinamico
    var dynwidth= Math.floor((sbwidth - indwidth) / dynindcount);
    //
    // A tutti gli indicatori dinamici aggiungo alla loro larghezza il delta calcolato
    for (var i = 0; i < n; i++)
    {
      var ind = this.Indicators[i];
      if (ind.FixedWidth == 0 && ind.IsVisible())
      {
        ind.SetVisualWidth(dynwidth);
      }
    }
  }
  else // Gli indicatori occupano piu' spazio della status bar
  {
    // TODO non ci posso fare niente.. i calcoli li faccio a partire dalla larghezza minima di ogni indicatore..
  }
  //
  // L'ultimo indicatore visibile non ha il margine dx
  if (!tb)
  {
	  var tr = false;
	  for (var i = n-1; i >= 0; i--)
	  {
	    var ind = this.Indicators[i];
	    if (!tr && ind.IsVisible())
	    {
	      ind.MyBox.style.marginRight = "0px";
	      tr = true;
	      //
	      if (viscount==1)
	        ind.MyBox.style.width = (parseInt(ind.MyBox.style.width, 0)+2)+"px";
	    }
	    else
	    {
	    	ind.MyBox.style.marginRight = "";
	    }
	  }
	}
  //
  if (tb)
  {
		var w = 4;
	  var n = this.Indicators.length;
  	for (var i = 0; i < n; i++)
	  {
	    var ind = this.Indicators[i];
	    if (ind.IsVisible())
	    {
	    	w+=ind.MyBox.offsetWidth;
	    }
	  }
	  //
  	RD3_DesktopManager.WebEntryPoint.TaskbarTrayCell.style.width = w + "px";
  }
}


// *****************************************************************************
// Segnala che la form attiva e' cambiata: cicla su tutti i figli passandogli il 
// messaggio
// *****************************************************************************
IndHandler.prototype.ActiveFormChanged = function()
{ 
  var n = this.Indicators.length;
  for(var i = 0; i < n; i++)
  {
    this.Indicators[i].ActiveFormChanged();
  }
}

// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe VisAttrList: gestisce gli stili visuali 
// dell'applicazione
// ************************************************

function VisAttrList()
{
	// Proprieta' di questo oggetto di modello
  this.VSList = new Array();      // Lista degli stili visuali
  this.Identifier = "vsl";
  this.Realized = false;          // Se vero, gli stili sono stati realizzati (rilinkati)
}


// *******************************************************************
// Inizializza questo VisAttrList leggendo i dati da un nodo <vsl> XML
// *******************************************************************
VisAttrList.prototype.LoadFromXml = function(node) 
{
	// Inizializzo le proprieta' locali
	this.LoadProperties(node);
	//
	// Inizializzo le proprieta' ciclando su tutti i nodi
	var objlist = node.childNodes;
	var n = objlist.length;
	//
	// Ciclo su tutti i figli e aggiungo tutti i visualstyle
	for (var i = 0; i < n; i++) 
  {
		var objnode = objlist.item(i);
		var nome = objnode.nodeName;
		//
		// In base al tipo di oggetto, invio il messaggio di caricamento
		switch (nome)
		{
			case "vis":
			{
			  var vis = new VisAttrObj();
      	vis.LoadFromXml(objnode);
     		//
      	this.VSList.push(vis);
      	//
      	// Se la lista e' gia' stata realizzata, realizzo subito lo stile
      	if (this.Realized)
      	  vis.Realize();
			}
			break;
		}
	}
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
VisAttrList.prototype.LoadProperties = function(node)
{
	// Inizializzo le proprieta' ciclando su tutti gli attributi
	var attrlist = node.attributes;
	var n = attrlist.length;
	//
	for (var i = 0; i < n; i++) 
  {
		var attrnode = attrlist.item(i);
		var nome = attrnode.nodeName;
		var valore = attrnode.nodeValue;
		//
		switch(nome)
		{
		  case "id" : 
		  {
		    this.Identifier = valore;
		    RD3_DesktopManager.ObjectMap.add(valore, this); 
		    break;
		  }
		}
	}
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
VisAttrList.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta'
  this.LoadFromXml(node);
}


// ********************************************************************************
// In questo passo viene impostata correttamente la catena dell'ereditarieta'
// dei Visual Style
// ********************************************************************************
VisAttrList.prototype.Realize = function()
{
  // Passo il messaggio a tutti i miei figli
  var n = this.VSList.length;
  for (var i = 0; i < n; i++)
  {
    this.VSList[i].Realize();
  }
  //
  this.Realized = true;
}

// ********************************************************************************
// Rimuove l'oggetto e i suoi figli dalla mappa degli oggetti
// ********************************************************************************
VisAttrList.prototype.Unrealize = function()
{
  // Passo il messaggio a tutti i miei figli
  var n = this.VSList.length;
  for (var i = 0; i < n; i++)
  {
    this.VSList[i].Unrealize();
  }
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  this.Realized = false;
}


// *******************************************************************
// Ricrea i prototipi dei visual styles
// *******************************************************************
VisAttrList.prototype.Tick = function() 
{
	var d = new Date();
	//
	// Passo il messaggio a tutti i miei figli
  var n = this.VSList.length;
  for (var i = 0; i < n; i++)
  {
    if (this.VSList[i].Tick())
    {
    	// Vediamo se e' passato troppo tempo...
    	if (new Date()-d > 20)
    		return;
    }
  }
}

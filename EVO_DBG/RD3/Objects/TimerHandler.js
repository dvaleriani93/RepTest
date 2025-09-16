// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe TimerHandler: gestisce la lista in memoria
// di tutti i timer dell'applicazione
// ************************************************

function TimerHandler()
{
  // Proprieta' di questo oggetto di modello
  this.TimerList = new Array();  // Lista dei Timer
  this.Identifier = "tmh";       // Identificatore di questo oggetto
  //
  // Proprieta' di collegamento con il DOM
  this.Realized = false;        // Indica se l'handler e' stato realizzato
}


// ***************************************************************
// Inizializza questo TimerHandler leggendo i dati da un nodo XML
// ****************************************************************
TimerHandler.prototype.LoadFromXml = function(node, torealize) 
{
	if (node.nodeName != this.Identifier)
		return;
	//
	// Inizializzo le proprieta' ciclando su tutti i nodi della lista
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
			case "tim":
			{
			  // Leggo il timer contenuto (potrebbe gia' esistere)
			  var newtimer = RD3_DesktopManager.ObjectMap[objnode.getAttribute("id")];
			  if (newtimer)
			  {
			  	// Lo sostituisco, quindi dovro' derealizzare il precedente
			  	if (torealize)
			  		newtimer.Unrealize();
			  }
			  else
			  {			  	
			  	// Creo il nuovo timer
			  	newtimer = new ATimer();
				  this.TimerList.push(newtimer);
			  }
			  newtimer.LoadFromXml(objnode);
			  //
			  if (torealize)
			  	newtimer.Realize();				
			}
			break;
		}
	}
	//
  // Mi Aggiungo alla mappa degli oggetti 
  RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
}


// ***************************************************************
// Aggiunge un nuovo figlio a questo oggetto
// ***************************************************************
TimerHandler.prototype.InsertChild = function(node)
{
  var objlist = node.childNodes;
	var n = objlist.length;
	//
	// Ciclo su tutti i nodi che rappresentano oggetti figli
	for (var i=0; i<n; i++) 
  {
		var objnode = objlist.item(i);
		var nome = objnode.nodeName;
		if (nome == "tim")
		{
    	// Creo il nuovo timer
    	var newtimer = new ATimer();
      this.TimerList.push(newtimer);
      newtimer.LoadFromXml(objnode);
      //
      if (this.Realized)
      	newtimer.Realize();				
    }
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
TimerHandler.prototype.Realize = function()
{
  // Io non ho oggetti visuali quindi passo subito a fare realizzare i miei figli
  var n = this.TimerList.length;
  for(var i=0; i<n; i++)
  {
    this.TimerList[i].Realize();
  }
  //
  this.Realized = true;
}


// ***************************************************************
// Cancella gli oggetti DOM collegati a questo oggetto
// ***************************************************************
TimerHandler.prototype.Unrealize = function()
{
  // Io non ho oggetti visuali quindi passo subito a fare cancellare i miei figli
  var n = this.TimerList.length;
  for(var i=0; i<n; i++)
  {
    this.TimerList[i].Unrealize();
  }
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  this.Realized = false;
}


// *****************************************************************************
// Segnala che la form attiva e' cambiata: passa il messaggio a tutti i figli
// *****************************************************************************
TimerHandler.prototype.ActiveFormChanged = function()
{
  var n = this.TimerList.length;
  for(var i = 0; i < n; i++)
  {
    this.TimerList[i].ActiveFormChanged();
  }
}


// *****************************************************************************
// Segnala che una form e' stata chiusa: passa il messaggio a tutti i figli
// *****************************************************************************
TimerHandler.prototype.FormClosed = function(form)
{
  var n = this.TimerList.length;
  for(var i = 0; i < n; i++)
  {
    this.TimerList[i].FormClosed(form);
  }
}
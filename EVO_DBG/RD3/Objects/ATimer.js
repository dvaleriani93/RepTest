// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe ATimaer: gestisce un timer lato client
// ************************************************

function ATimer()
{
  // Proprieta' di questo oggetto di modello
  this.IdxForm = 0;             // Indice della form associata al timer
  this.NumTicks = 0;            // Numero di scatti dopo i quali il timer si deve disabilitare
  this.Interval = 0;            // Intervallo tra due scatti (in millisecondi)
  this.Enabled = false;         // Se vero il timer e' abilitato, se falso il timer e' disabilitato
  this.Identifier = "";         // Identificatore del timer
  //
  // Variabili per la gestione dell'oggetto timer
  this.Ticks = 0;               // Numero di scatti eseguiti dalla attivazione del timer 
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo timer
  this.TickEventDef = RD3_Glb.EVENT_ACTIVE;
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;        // Se vero, il Timer del browser e' stato creato
  //
  // Oggetti relativi al timer del browser
  this.MyTimer = null;         // Timer del browser
}

// *******************************************************************
// Inizializza questo Timer leggendo i dati da un nodo <tim> XML
// *******************************************************************
ATimer.prototype.LoadFromXml = function(indnode) 
{
  // Inizializzo le proprieta' locali
	this.LoadProperties(indnode);
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
ATimer.prototype.ChangeProperties = function(node)
{
	// Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
ATimer.prototype.LoadProperties = function(node)
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
    	case "frm": this.SetFormIndex(parseInt(attrnode.nodeValue)); break;
    	case "num": this.SetNumTicks(parseInt(attrnode.nodeValue)); break;
    	case "int": this.SetInterval(parseInt(attrnode.nodeValue)); break;
    	case "ena": this.SetEnabled(attrnode.nodeValue=="1"); break;
    	
    	case "tke": this.TickEventDef = parseInt(attrnode.nodeValue); break;
    	
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
ATimer.prototype.SetFormIndex= function(value) 
{
	// Devo solo impostare il valore in quanto questa proprieta'
	// non puo' cambiare dopo che l'oggetto e' stato realizzato
	this.IdxForm = value;
}

ATimer.prototype.SetNumTicks = function(value) 
{
	if (value!=undefined)
  	this.NumTicks = value;
  //
  if (this.Realized && this.Enabled)
	{
	  // Verifico se il numero di scatti attuali e' maggiore del nuovo numero di scatti impostati: 
	  // se si mi disabilito subito
	  if (this.NumTicks > 0 && this.Ticks >= this.NumTicks)
    {
      // Disabilito il timer
      this.SetEnabled(false);
    }
	}
}

ATimer.prototype.SetInterval = function(value) 
{
	if (value!=undefined)
  	this.Interval = value;
  //
	if (this.Realized && this.Enabled)
	{
    // Il timer e' stato gia' creato ed abilitato: lo distruggo e ne creo uno nuovo
    window.clearInterval(this.MyTimer);
		this.MyTimer = window.setInterval(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TimerTick', ev)"), this.Interval);
	}
}

ATimer.prototype.SetEnabled = function(value) 
{
	if (value!=undefined)
  	this.Enabled = value;
  //
	if (this.Realized)
	{
	  if (this.Enabled && this.CanEnable())
	  {
	  	// Rinnovo il timer
	    window.clearInterval(this.MyTimer);
	    this.MyTimer = window.setInterval(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TimerTick', ev)"), this.Interval);
	  }
	  else
	  {
	    this.TimerDisable();
	  }
	}
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
ATimer.prototype.Realize = function()
{
  // Eseguo l'impostazione iniziale delle mie proprieta'
  this.Realized = true;
  //
  // In questo caso basta gestire l'abilitazione iniziale
  this.SetEnabled();
}

// ***************************************************************
// Cancella gli oggetti DOM relativi a questo oggetto
// ***************************************************************
ATimer.prototype.Unrealize = function()
{
  // Disabilito il timer
  this.SetEnabled(false);
  this.Realized = false;
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
}


// ***************************************************************
// Funzione chiamata allo scatto di questo timer
// ***************************************************************
ATimer.prototype.TimerTick = function()
{
  // Per prima cosa incremento i numeri degli scatti
  this.Ticks++;
  //
  // Creo l'evento
	var ev = new IDEvent("timer", this.Identifier, null, this.TickEventDef);
  //
  // Verifico se mi devo disabilitare
  if (this.NumTicks > 0 && this.Ticks >= this.NumTicks)
  {
    // Disabilito il timer
    this.SetEnabled(false);
  }
}


// ***************************************************************
// Restituisce true se il timer puo' essere abilitato (sempre se e' 
// di applicazione, solo se tra le form aperte c'e' quella giusta per
// timer di form)
// ***************************************************************
ATimer.prototype.CanEnable = function()
{
  var en = this.Enabled;
  //
  if (en)
  {
    // Sono abilitato, quindi potrei scattare, ma devo controllare se sono di form o di applicazione 
    // (se sono di applicazione allora posso essere attivato senza ulteriori controlli)
    if (this.IdxForm != 0)
    {
      // Sono un timer di form e non sono ancora attivo: mi posso attivare solo se la mia form e' aperta
      var frmid = "frm:" + this.IdxForm;
      //
      // Cerco nella mappa degli oggetti se la form esiste
      var fr = RD3_DesktopManager.ObjectMap[frmid];
      if (!fr)
          en = false;
    }
  }
  //
  return en;
}


// *****************************************************************************
// Metodo che disabilita il timer interno
// *****************************************************************************
ATimer.prototype.TimerDisable = function()
{
  // Disabilito il timer se e' impostato
  if (this.MyTimer)
    window.clearInterval(this.MyTimer);
  this.MyTimer = null;
  //
  // Azzero gli scatti fatti dal timer
  this.Ticks = 0;
}


// *****************************************************************************
// Segnala che la form attiva e' cambiata: verifico se mi posso attivare
// *****************************************************************************
ATimer.prototype.ActiveFormChanged = function()
{
  // Se sono un timer di form, ricontrollo ora che la form e' cambiata
  if (this.IdxForm > 0)
    this.SetEnabled();
}


// *****************************************************************************
// Segnala che una certa form e' stata chiusa: se questo e' un timer di form si
// deve fermare
// *****************************************************************************
ATimer.prototype.FormClosed = function(form)
{
  // Se sono un timer di form e la form chiusa e' la mia
  if (form.IdxForm == this.IdxForm)
  {
    // Rieseguo la verifica dell'attivazione: la form attiva non e' di sicuro piu' la mia, quindi il timer si disabilita
    this.SetEnabled();
  }
}


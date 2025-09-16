// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Gestore effetti grafici
// ************************************************

// ******************************************************
// Classe GFXManager : rappresenta l'entita' che 
// contiene l'elenco degli effetti grafici attivi
// e li fa esegire nel tempo
// ******************************************************
function GFXManager()
{
  this.ActiveEffects = new Array(); // Elenco degli effetti grafici attivi
  //
  this.StopAnimation = false; // Non devono essere accettate nuove animazioni: utilizzato quando e' in atto una animazione di chiusura applicazione
  //
  // Gestione fuoco in apertura form (gestito se uno fa la setfocus lato server nella load di una form modale..)
  //this.ModalFocusFldId = "";
  //this.ModalFocusFldRow = 0;
  //this.FocusFldId = "";
  //this.FocusFldRow = 0;
}
  
// ************************************************
// Aggiunge un effetto grafico da eseguire
// ************************************************
GFXManager.prototype.AddEffect = function(fx)
{
  if (this.StopAnimation)
    return;
  //
	// Controllo se sullo stesso oggetto ci sono altre animazioni e le termina
	var end = this.FinishGFX(fx);
	//
	// Se devo fermare l'animazione la porto subito nello stato finale
	if (end)
	  fx.Durata = 0;
	//
	// Esegue lo start
	fx.Start();
	//
	// Poi aggiunge la nuova, se non e' gia' terminata
	if (!fx.IsFinished())
  	this.ActiveEffects.push(fx);
}

// *********************************************************************************************
// Fa avanzare gli effetti grafici
// *********************************************************************************************
GFXManager.prototype.Tick = function()
{
	// fa avanzare gli effetti grafici
  var n = this.ActiveEffects.length;
  for(var i=0; i<n; i++)
  {
    this.ActiveEffects[i].Tick();
  }
  //
  // Tolgo tutti gli effetti terminati
  for(var i=n-1; i>=0; i--)
  {
    if (this.ActiveEffects[i].IsFinished())
    {
    	this.ActiveEffects.splice(i,1);
    }
  }
}


// ************************************************
// Torna true se almeno un effetto e' in essere
// ************************************************
GFXManager.prototype.Animating= function()
{
	return this.ActiveEffects.length>0;
}

// ************************************************
// Torna true se almeno un effetto attivo e' di tipo WebKit
// ************************************************
GFXManager.prototype.WebKitAnimating= function()
{
	var n = this.ActiveEffects.length;
  for(var i=0; i<n; i++)
  {
    if (this.ActiveEffects[i].IsWebKit && this.ActiveEffects[i].Started)
      return true;
  }
  //
  return false;
}


// *******************************************************
// Torna true se almeno un effetto bloccante e' in essere
// *******************************************************
GFXManager.prototype.Blocking= function()
{
	var n = this.ActiveEffects.length;
  for(var i=0; i<n; i++)
  {
    if (this.ActiveEffects[i].Blocking)
      return true;
  }
  //
  return false;
}


// ************************************************
// Conclude le animazioni su un determinato oggetto
// ************************************************
GFXManager.prototype.FinishGFX = function(fx)
{
  // Variabile per sapere se la nuova animazione deve essere bloccata
  var block = false;
  var n = this.ActiveEffects.length;
  for(var i=0; i<n; i++)
  {
    block = block || this.ActiveEffects[i].FinishGFX(fx);
  }
  //
  return block;
}

// *****************************************************
// Ferma tutte le animazioni attualmente in esecuzione
// *****************************************************
GFXManager.prototype.FinishAllGFX = function()
{
  var n = this.ActiveEffects.length;
  for(var i=0; i<n; i++)
  {
    this.ActiveEffects[i].SetFinished();
  }
}


// **************************************************************
// Cerca se c'e' una animazione di chiusura modale relativa alla
// form passata ed in quel caso la termina
// ***************************************************************
GFXManager.prototype.FinishModalClosing= function(ident)
{
	var n = this.ActiveEffects.length;
  for(var i=0; i<n; i++)
  {
    this.ActiveEffects[i].FinishModalClosing(ident);
  }
}


// ************************************************
// Lanciata dal webkit al termine di una animazione
// da lui gestita
// ************************************************
GFXManager.prototype.OnEndAnimation = function(ev)
{
	// Verifico quale animazione avevo attiva sull'oggetto dell'evento
	// Attenzione THIS non e' quello giusto qui
  for(var i=0; i<RD3_GFXManager.ActiveEffects.length; i++)
  {
  	// Chiedo ad ogni effetto attivo se l'evento si riferisce ad esso.
  	// E' poi lui che lo dichiara finito e quindi lo toglie
  	// dall'elenco degli effetti attivi
		if (RD3_GFXManager.ActiveEffects[i].OnEndAnimation(ev))
  		break;
  }
}


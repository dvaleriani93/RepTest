// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Callback per gli eventi client
// Questa classe e' pensata per essere personalizzata
// in modo da gestire eventi locali
// ************************************************

function ClientEvents()
{
}

// **************************************************************************** 
// Questa classe serve per gestire eventi locali in modo
// pesonalizzato. Se questa funzione ritorna true, allora l'evento
// viene gestito normalmente altrimenti non viene gestito
// ****************************************************************************
ClientEvents.prototype.HandleEvent = function(idevent)
{
	return true;
}

// **************************************************************************** 
// Chiamata quando l'utente preme il bottone di debug
// ****************************************************************************
ClientEvents.prototype.OnDebug = function(idevent)
{
	return true;
}

// **************************************************************************** 
// Chiamata quando l'utente preme il bottone di help
// ****************************************************************************
ClientEvents.prototype.OnHelp = function(idevent)
{
	return true;
}


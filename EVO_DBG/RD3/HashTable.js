// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe HashTable: rappresenta una mappa di oggetti
// facilmente accessibili tramite chiave stringa
// ************************************************

function HashTable(get)
{
  this.length = 0;
  if (get)
  	this.Items = new Array();
}

// **************************************
// Aggiunge un oggetto all'HashTable
// **************************************
HashTable.prototype.add = function(key, obj)
{
  this["" + key] = obj;
  this.length++;
  if (this.Items)
  	this.Items.push(obj);
}


// **************************************
// Rimuove un oggetto dall'HashTable
// **************************************
HashTable.prototype.remove = function(key)
{
  if (this.Items)
  {
  	var obj = this[key];
  	var n=this.Items.length;
  	for (var i=0; i<n; i++)
  	{
  		if (this.Items[i]==obj)
  		{
  			this.Items.splice(i,1)
  			break;
  		}
  	}
  }
  delete this["" + key];
  this.length--;
}


// **************************************
// Ritorna un oggetto della lista (se attivata)
// **************************************
HashTable.prototype.GetItem= function(index)
{
	if (this.Items)
		return this.Items[index];
}

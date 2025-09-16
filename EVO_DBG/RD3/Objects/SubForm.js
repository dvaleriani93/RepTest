// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Panel: Rappresenta un frame di tipo
// Grafico
// ************************************************

function SubForm(pform)
{
  // Chiamo il costruttore superiore
  WebFrame.call(this,pform); 
  //
  this.pSubForm = null;     // Puntatore alla form contenuta in me
}
//
// Definisco l'estensione della classe
SubForm.prototype = new WebFrame();



// *******************************************************************
// Inizializza questo SubForm leggendo i dati da un nodo XML
// *******************************************************************
SubForm.prototype.LoadFromXml = function(node) 
{
  // Chiamo la classe base
  WebFrame.prototype.LoadFromXml.call(this,node);
  //
  // Carico campi del pannello
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
      case "frm":
      {
        // Se il nodo contiene l'attributo csf allora la SetSubForm
        // ha gia' caricato la form, quindi non lo devo rifare
        if (this.pSubForm && node.getAttribute("csf"))
          break;
        //
        this.pSubForm = new WebForm();
        this.pSubForm.SubFormObj = this;
        this.pSubForm.LoadFromXml(objnode); 
      }
      break;
    }
  }
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
SubForm.prototype.LoadProperties = function(node)
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
      case "suw": this.SetWidth(parseInt(valore)); break;
      case "suh": this.SetHeight(parseInt(valore)); break;
      case "csf": this.SetSubForm(parseInt(valore), node); break;
      
      case "id": 
        this.Identifier = valore;
        RD3_DesktopManager.ObjectMap.add(valore, this);
        break;
    }
  }
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
SubForm.prototype.ChangeProperties = function(node)
{
  // Eseguo il cambio di proprieta'
  this.LoadProperties(node);
}


// **********************************************************************
// Imposta la proprieta' SubForm
// **********************************************************************
SubForm.prototype.SetSubForm= function(value, node)
{
  // Se la sub-form e' stata rimossa
  if (value == 0)
  {
    // Se c'era...
    if (this.pSubForm)
    {
      this.pSubForm.Unrealize();
      this.pSubForm = null;
    }
  }
  else
  {
    // La sub-form e' stata aggiunta... se c'era gia' unrealizzo la vecchia form
    if (this.pSubForm)
      this.pSubForm.Unrealize();
    //
    // Prima di realizzare questa form, controllo se era gia' presente nella mappa...
    // Se lo e' gia' e' meglio rimuovere quella gia' presente... Altrimenti io la "copro"
    var fnode = null;
    for (var i=0; i<node.childNodes.length; i++)
    {
      // Cerchiamo il nodo di tipo Element, a seconda del tipo di applicazione cambia la posizione in cui si trova.. 
      // per sicurezza lo cerchiamo con un ciclo
      if (node.childNodes.item(i).nodeType==1)
      {
        fnode = node.childNodes.item(i);
        break;
      }
    }
    if (this.Realized)
    {
      var fid = fnode.getAttribute("id");
      var oldf = RD3_DesktopManager.ObjectMap[fid];
      if (oldf)
      {
        // La stacco dal suo parent (dato che l'ho gia' unrealizzata io!)
        if (oldf.SubFormObj)
          oldf.SubFormObj.SubForm = null;
        //
        // E la unrealizzo...
        oldf.Unrealize();
      }
    }
    //
    // Ed inserisco la nuova
    this.pSubForm = new WebForm();
    this.pSubForm.SubFormObj = this;
    this.pSubForm.LoadFromXml(fnode);
    //
    // Ora posso proseguire
    if (this.Realized)
    {
      this.pSubForm.Realize();
      this.pSubForm.AdaptLayout();
      //
      // Adesso la nuova Form deve prendersi le sue toolbar
      RD3_DesktopManager.WebEntryPoint.CmdObj.ActiveFormChanged();
    }
  }
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
SubForm.prototype.Realize = function(parent)
{
  // Chiamo la classe base
  if (!this.Realized)
    WebFrame.prototype.Realize.call(this,parent);
  //
  // Creo gli oggetti del DOM
  if (this.pSubForm)
    this.pSubForm.Realize();
  //
  this.Realized = true;
  //
  // La SubForm e' trasparente al DD; sono gli oggetti interni che lo gestiscono
  this.CanDrag = true;
  this.CanDrop = true;
  //
  // Inizializzazione
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
SubForm.prototype.Unrealize = function()
{ 
  // Chiamo la classe base
  WebFrame.prototype.Unrealize.call(this);
  //
  // Propago l'evento al mio container
  if (this.pSubForm)
    this.pSubForm.Unrealize();
  //
  this.Realized = false;
}

// ********************************************************************************
// Calcola le dimensioni dei div in base alla dimensione del contenuto
// ********************************************************************************
SubForm.prototype.AdaptLayout = function()
{
  // Se non e' visibile, salto l'adattamento
  if (!this.Visible)
  {
    this.RecalcLayout = true;
    return;
  }
  //
  WebFrame.prototype.AdaptLayout.call(this);
  //
  // Propago l'evento al mio container
  if (this.pSubForm)
    this.pSubForm.AdaptLayout(true);
}

// *********************************************************
// Timer globale
// *********************************************************
SubForm.prototype.Tick = function()
{
  // Propago l'evento al mio container
  if (this.pSubForm)
    this.pSubForm.Tick();
}

// ********************************************************************************
// Qualcuno ha dato qui il fuoco
// ********************************************************************************
SubForm.prototype.Focus = function()
{
  // Passo la richiesta al mio container
  if (this.pSubForm)
    return this.pSubForm.Focus();
  //
  return false;
}


// ********************************************************************************
// Devo gestire le variazioni avvenute
// ********************************************************************************
SubForm.prototype.AfterProcessResponse= function()
{ 
  // Chiamo la classe base che esegue un recalc layout se richiesto
  WebFrame.prototype.AfterProcessResponse.call(this);
  //
  // Propago l'evento al mio container
  if (this.pSubForm)
    this.pSubForm.AfterProcessResponse();
}

// *********************************************************
// Imposta il tooltip
// *********************************************************
SubForm.prototype.GetTooltip = function(tip, obj)
{
  if (this.pSubForm)
    return this.pSubForm.GetTooltip(tip, obj);
}

// ********************************************************************************
// Su cosa e' possibile droppare?
// ********************************************************************************
SubForm.prototype.ComputeDropList = function(list,dragobj)
{
  if (this.pSubForm)
    this.pSubForm.ComputeDropList(list, dragobj);
}

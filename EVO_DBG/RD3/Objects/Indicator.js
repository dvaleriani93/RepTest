// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Indicator: rappresenta un indicatore 
// dell'applicazione
// ************************************************

function Indicator()
{
  // Proprieta' di questo oggetto di modello
  this.IdxForm = 0;                      // Indice della form a cui e' associato l'indicatore
  this.FixedWidth = 0;                  // Larghezza dell'indicatore (1: come il contenuto, 0 dinamica e >1 lunghezza fissa)
                                        // Se l'indicatore e' a larghezza fissa questa width e' la width dell'indicatore a run-time
                                        // Se gli indicatori sono dinamici la width a run time e' differente da questo valore (che e' 1)
  this.Tooltip = "";                    // Tooltip dell'indicatore
  this.Style = -1;                      // Stile (puo' essere data o ora)
  this.Enabled = true;                  // Indica se l'indicatore e' attivo
  this.Visible = true;                  // Indica se l'indicatore e' visibile
  this.Text = "";                       // Testo dell'indicatore
  this.Image = "";                      // Immagine dell'indicatore
  this.Alignment = RD3_Glb.IND_ALI_SX;  // Allineamento dell'indicatore (a destra o sinistra nella status bar: valido solo per indicatori dell'applicazione)
  this.Identifier = "";                 // Identificatore di questo oggetto
  //
  // Struttura per la definizione delle caratteristiche degli eventi di questo comando o command set
  this.ClickEventDef = RD3_Glb.EVENT_ACTIVE;
  //
  // Variabili di questo oggetto
  this.TimeTimer = null;        // Timer per gestire gli stili ora e data: aggiorna l'orologio o la data (ogni secondo o ogni minuto)
  //
  // Variabili di collegamento con il DOM
  this.Realized = false; // Se vero, gli oggetti del DOM sono gia' stati creati
  //
  // Oggetti visuali relativi alla visualizzazione in Menu
  this.MyBox = null;            // Span che contiene tutto l'indicatore
  this.IndicatorImg = null;     // Immagine dell'indicatore (IMG)
  this.TextBox = null;          // Span che contiene il testo (per il mouse over)
}


// *******************************************************************
// Inizializza questo Indicator leggendo i dati da un nodo <cmd> XML
// *******************************************************************
Indicator.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
Indicator.prototype.LoadProperties = function(node)
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
      case "frm": this.SetFormIndex(parseInt(valore)); break;
      case "wid": this.SetFixedWidth(parseInt(valore)); break;
      case "tip": this.SetTooltip(valore); break;
      case "sty": this.SetStyle(parseInt(valore)); break;
      case "ena": this.SetEnabled(valore == "1"); break;
      case "vis": this.SetVisible(valore == "1"); break;
      case "cap": this.SetText(valore); break;
      case "img": this.SetImage(valore); break;
      case "ali": this.SetAlign(parseInt(valore)); break;

      case "clk": this.ClickEventDef = parseInt(valore); break;
      
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
Indicator.prototype.ChangeProperties = function(node)
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// *******************************************************************
// Setter delle proprieta'
// *******************************************************************
Indicator.prototype.SetFormIndex= function(value) 
{
  // Devo solo impostare il valore in quanto questa proprieta'
  // non puo' cambiare dopo che l'oggetto e' stato realizzato
  this.IdxForm = value;
}

Indicator.prototype.SetAlign= function(value) 
{
  if (value!=undefined)
    this.Alignment = value;
  //
  if (this.Realized)
  {
    switch (this.Alignment)
    {
      case RD3_Glb.IND_ALI_SX:
        this.MyBox.style.textAlign = "left";
        break;
      case RD3_Glb.IND_ALI_CX:
        this.MyBox.style.textAlign = "center";
        break;
      case RD3_Glb.IND_ALI_DX:
        this.MyBox.style.textAlign = "right";
        break;
    }    
  }
}

Indicator.prototype.SetFixedWidth = function(value) 
{
  if (value!=undefined)  
    this.FixedWidth = value;
  //
  if (this.Realized)
  {
    // Width = 1 significa che l'indicatore deve essere largo come il suo contenuto
    // Width = 0 significa che la larghezza deve essere dinamica
    // altrimenti la larghezza e' fissa e verra' impostata dall'adaptLayout di IndHandler
    if (this.FixedWidth <= 1)
    {
      // Elimino dimensioni gia' impostate
      this.MyBox.style.width = "";
    }
    //
    RD3_DesktopManager.WebEntryPoint.IndObj.AdaptLayout();
  }
}


Indicator.prototype.SetTooltip = function(value) 
{
  if (value!=undefined)
    this.Tooltip = value;
  //
  if (this.Realized)
    RD3_TooltipManager.SetObjTitle(this.MyBox, this.Tooltip);
}

Indicator.prototype.SetStyle = function(value) 
{
  if (value!=undefined)
    this.Style = value;
  //
  if (this.Realized)
  {
    switch (this.Style)
    {
      case RD3_Glb.STYLE_TIME:
      {
        // Se e' impostato un Timer lo disabilito
        if (this.TimeTimer != null)
        {
          window.clearInterval(this.TimeTimer);          
        }
        // Creo il timer per aggiornare l'ora (ogni secondo)
        this.TimeTimer = window.setInterval(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TimeTick', ev)"), 1000);
        //
        // Imposto l'ora iniziale (tenendo conto dei minuti con una cifra o due)
        var data = new Date();
        var minutes = data.getMinutes();
        this.TextBox.innerHTML = data.getHours() + "." + (minutes < 10 ? "0" + minutes : minutes);
      }
      break;
      
      case RD3_Glb.STYLE_DATE:
      {
        // Se e' impostato un Timer lo disabilito
        if (this.TimeTimer != null)
        {
          window.clearInterval(this.TimeTimer);          
        }
        // Creo il timer per aggiornare la data (ogni minuto)
        this.TimeTimer = window.setInterval(new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'TimeTick', ev)"), 60000);
        //
        // Imposto la data
        var data = new Date();
        var txt = (data.getDate() < 10 ? "0" : "") + data.getDate();
        txt += "/" + (data.getMonth()+1 < 10 ? "0" : "") + (data.getMonth()+1);
        txt += "/" + data.getFullYear();
        this.TextBox.innerHTML = txt;
      }
      break;
      
      default:
      {
        // Se e' impostato un Timer lo disabilito
        if (this.TimeTimer != null)
        {
          window.clearInterval(this.TimeTimer);
          this.TimeTimer = null;
        }
        //
        // Imposto il testo
        this.TextBox.innerHTML = this.Text;
        break;
      }
    }
    //
    RD3_DesktopManager.WebEntryPoint.IndObj.AdaptLayout();
  }
}

Indicator.prototype.SetEnabled = function( value) 
{
  if (value!=undefined)  
    this.Enabled = value;
  //
  if (this.Realized)
  {
    if (this.IsEnabled())
    {
      // Assegno la classe corretta
      RD3_Glb.RemoveClass(this.TextBox,"indicator-disabled");      
      RD3_Glb.RemoveClass(this.IndicatorImg,"indicator-disabled");
    }
    else
    {
      // Assegno la classe corretta
      RD3_Glb.AddClass(this.TextBox,"indicator-disabled");      
      RD3_Glb.AddClass(this.IndicatorImg,"indicator-disabled");
    }
  }
}

Indicator.prototype.SetVisible = function(value) 
{
  if (value!=undefined)
    this.Visible = value;
  //
  if (this.Realized)
  {
    if (this.IsVisible())
    {
      this.MyBox.style.display = "";
    }
    else
    {
      this.MyBox.style.display = "none";
    }
    //
    RD3_DesktopManager.WebEntryPoint.IndObj.AdaptLayout();
  }
}

Indicator.prototype.SetText = function(value) 
{
  if (value!=undefined)
    this.Text = value;
  //
  if (this.Realized)
  {
    this.TextBox.innerHTML = this.Text;
    //
    RD3_DesktopManager.WebEntryPoint.IndObj.AdaptLayout();
  }
}

Indicator.prototype.SetImage = function(value) 
{
  if (value!=undefined)
    this.Image = value;
  //
  if (this.Realized)
  {
    if (this.Image != "")
    {
      this.IndicatorImg.src = RD3_Glb.GetImgSrc("images/" + this.Image);
      this.IndicatorImg.style.display = "";
    }
    else
      this.IndicatorImg.style.display = "none";
    //
    RD3_DesktopManager.WebEntryPoint.IndObj.AdaptLayout();
  }
}


// *********************************************************************
// Crea gli elementi DOM dell' indicatore
// L'oggetto parent e' l'oggetto in cui deve essere inserito l'indicatore
// *********************************************************************
Indicator.prototype.Realize = function(parent)
{
  // Creo gli elementi del DOM
  this.MyBox = document.createElement("span");
  this.MyBox.setAttribute("id", this.Identifier);
  this.IndicatorImg = document.createElement("img");
  this.TextBox = document.createElement("span");
  //
  // Assegno le Classi agli oggetti DOM
  this.MyBox.className = ((RD3_DesktopManager.WebEntryPoint.MenuType==RD3_Glb.MENUTYPE_TASKBAR)?"taskbar-":"")+"indicator-box";
  this.MyBox.onclick = new Function("ev","return RD3_DesktopManager.CallEventHandler('"+this.Identifier+"', 'OnClick', ev)");
  //
  this.IndicatorImg.className = "indicator-image";
  this.TextBox.className = "indicator-text";
  //
  // Assegno gli elementi al DOM
  this.MyBox.appendChild(this.IndicatorImg);
  this.MyBox.appendChild(this.TextBox);
  parent.appendChild(this.MyBox);
  //
  // Renderizzo i valori iniziali
  this.Realized = true;
  this.SetFixedWidth();
  this.SetTooltip();
  this.SetEnabled();
  this.SetVisible();
  this.SetStyle();
  this.SetImage();
 }
 

// ***********************************************************************************
// Ritorna vero se e' visibile
// ***********************************************************************************
Indicator.prototype.IsVisible = function()
{
  var vis = this.Visible;
  //
  if (this.IdxForm > 0) 
  {
    var fnd = false;
    var actf = RD3_DesktopManager.WebEntryPoint.ActiveForm;
    if (actf && actf.IdxForm == this.FormIndex)
      fnd = true;
    //
    var nf = RD3_DesktopManager.WebEntryPoint.StackForm.length;
    for (var t=0;t<nf;t++)
    {
      var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
      if (f.Docked && f.IdxForm == this.FormIndex)
        fnd = true;
    }
    //
    if (!fnd)
      vis = false;
  }
  //
  return vis;
}


// ********************************************************************************
// Ritorna vero se e' abilitato
// ********************************************************************************
Indicator.prototype.IsEnabled = function()
{ 
  var ena = this.Enabled;
  //
  // Se sono di form, vediamo se e' quella attiva
  if (this.IdxForm > 0) 
  { 
    var fnd = false;
    var actf = RD3_DesktopManager.WebEntryPoint.ActiveForm;
    if (actf && actf.IdxForm == this.FormIndex)
      fnd = true;
    //
    var nf = RD3_DesktopManager.WebEntryPoint.StackForm.length;
    for (var t=0;t<nf;t++)
    {
      var f = RD3_DesktopManager.WebEntryPoint.StackForm[t];
      if (f.Docked && f.IdxForm == this.FormIndex)
        fnd = true;
    }
    //
    if (!fnd)
      ena = false;    
  }
  //
  return ena;  
}


// ********************************************************
// Gestore del click sull' indicatore
// ********************************************************
Indicator.prototype.OnClick = function(evento)
{
  if (this.IsVisible() && this.IsEnabled())
  {
    // Posso lanciare il click!
    var ev = new IDEvent("clk", this.Identifier, evento, this.ClickEventDef);
  }
}


// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
Indicator.prototype.Unrealize = function()
{ 
  if (this.Realized)
  {
    // Se un timer e' abilitato lo disabilito
    if (this.TimeTimer != null)
    {
       window.clearInterval(this.TimeTimer);
       this.TimeTimer = null;
    }
    //
    // Mi rimuovo dalla mappa
    RD3_DesktopManager.ObjectMap.remove(this.Identifier);
    //
    // Rimuovo gli oggetti dal DOM
    var parel = this.MyBox.parentNode;
    parel.removeChild(this.MyBox);
    //
    // Rimuovo i riferiment
    this.MyBox = null;
    this.IndicatorImg = null;
    this.TextBox = null;
    this.Realized = false;
  }
}


// ***********************************************************************************
// Tick del timer per gli stili ora e data: a seconda dello stile aggiorno l'orario
// o la data
// ***********************************************************************************
Indicator.prototype.TimeTick = function()
{ 
  var data = new Date();
  //
  switch (this.Style)
  {
    case RD3_Glb.STYLE_TIME:
    {
      var minutes = data.getMinutes();
      this.TextBox.innerHTML = data.getHours() + "." + (minutes < 10 ? "0" + minutes : minutes);    
      break;
    }
    //
    case RD3_Glb.STYLE_DATE:
    {
      var data = new Date();
      var txt = (data.getDate() < 10 ? "0" : "") + data.getDate();
      txt += "/" + (data.getMonth()+1 < 10 ? "0" : "") + (data.getMonth()+1);
      txt += "/" + data.getFullYear();
      this.TextBox.innerHTML = txt;
      break;
    }
  }
}


// ********************************************************************************
// Metodo che restituisce la larghezza effettiva di questo indicatore: se e' fisso
// restituisco la larghezza fissa, se e' dinamico o come il contenuto
// calcolo la larghezza degli elementi contenuti e la restituisco 
// ********************************************************************************
Indicator.prototype.GetInternalWidth = function()
{ 
  // Se sono invisibile la mia larghezza e' zero
  if (!this.IsVisible())
    return 0;
  //
  // Se sono fisso ritorno la mia larghezza a design time
  if (this.FixedWidth > 1)
    return this.FixedWidth;
  //
  // Calcolo la larghezza dell'immagine e del testo
  var indwidth = 0;
  if (this.Image != "")
    indwidth += this.IndicatorImg.offsetWidth ;
  //
  indwidth += this.TextBox.offsetWidth;
  return indwidth;
}


// ****************************************************************************************
// Metodo che imposta la larghezza del Box dell'indicatore al valore impostato
// (se 0 rimuove l'impostazione della larghezza dallo style)
// Ha effetto solo se l'indicatore non e' fixed
// Non modifica la Width impostata a design time (necessaria per sapere se l'indicatore
// e' fisso o dinamico) ma solo la dimensione presentata a video
// *****************************************************************************************
Indicator.prototype.SetVisualWidth = function(value)
{
  var setwidth = value;
  //
  // Se l'indicatore e' fixed ignoro il valore passato
  if (this.FixedWidth > 1)
    setwidth = this.FixedWidth;
  //
  // se passo un valore > di 0 imposto la dimensione, se passo 0 la tolgo
  if (setwidth == 0)
    this.MyBox.style.width = "";
  else
    this.MyBox.style.width = setwidth + "px";
  //
  // Se la larghezza dell'indicatore e' diversa a causa di padding o bordi la correggo.
  if (this.MyBox.offsetWidth != setwidth)
  {
    var newW = setwidth - (this.MyBox.offsetWidth - setwidth);
    this.MyBox.style.width = ((newW >= 0) ? newW : 0) + "px";
  }
}


// ***********************************************************************************
// Controlla se questo indicatore e' attivo e/o visibile
// ***********************************************************************************
Indicator.prototype.ActiveFormChanged = function()
{
  this.SetVisible();
  this.SetEnabled();
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
Indicator.prototype.GetTooltip = function(tip, obj)
{
  if (this.Tooltip == "")
    return false;
  //
  tip.SetText(this.Tooltip);
  tip.SetImage("");
  tip.SetAutoAnchor(true);
  tip.SetPosition(2);
  return true;
}
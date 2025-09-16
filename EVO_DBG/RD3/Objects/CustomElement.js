// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe CustomElement: Rappresenta un wrapper per gli elementi custom
// Custom Element
// ************************************************

function CustomElement(parent)
{
  this.Parent = parent;
  //
  if (parent instanceof PCell)
  {
    this.Left = 0;
    this.Top = 0;
    this.Width = 0;
    this.Height = 0;
    this.Enabled = true;
    this.Visible = true;
    this.Tooltip = "";              // Tooltip dell'elemento
    //this.VisualStyle;             // Stile visuale dell'elemento
    //this.Value;
  }
}

// **************************************************************
// Crea un custom element dato il nome della classe
// **************************************************************
CustomElement.createByName = function (cls, parent)
{
  var ce = new window[cls](parent);
  ce.className = cls;
  return ce;
}

// **************************************************************
// Metodo per caricare una o piu' dipendenze (CSS/JS)
// **************************************************************
CustomElement.LoadRequirements = function (urls, type, callback)
{
  if (typeof urls === "string")
    urls = [urls];
  //
  GlobalObject.LoadJsCssFile(urls.shift(), false, type, function (err)
  {
    if (err) {
      if (callback)
        callback(err);
      return;
    }
    //
    if (urls.length > 0)
      CustomElement.LoadRequirements(urls, type, callback);
    else if (callback)
      callback();
  });
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
CustomElement.prototype.LoadFromXml = function (node)
{
  // Inizializzo le proprieta' locali
  this.LoadProperties(node);
  //
  // Carico le invocazioni dei metodi
  var objlist = node.childNodes;
  var n = objlist.length;
  //
  // Ciclo su tutti i nodi che rappresentano oggetti figli
  for (var i = 0; i < n; i++)
  {
    var objnode = objlist.item(i);
    var nome = objnode.nodeName;
    switch (nome)
    {
      case "invoke": this.InvokeMethod(objnode); break;
    }
  }
}

// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
CustomElement.prototype.ChangeProperties = function (node)
{
  this.LoadFromXml(node);
  //
  // Se sono il CustomElement del PValue e sono gia' realizzato
  // spingo l'aggiornamento della corrispondente cella
  if (this.Parent instanceof PValue && this.Parent.ParentField.Realized)
    this.Parent.UpdateScreen();
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
CustomElement.prototype.LoadProperties = function (node)
{
  // Ciclo su tutti gli attributi del nodo
  var attrlist = node.attributes;
  var n = attrlist.length;
  for (var i = 0; i < n; i++)
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    //
    switch (nome)
    {
      case "cls": this.className = valore; break;
      case "evl": this.eventsList = valore.split("|"); break;
      case "id":
        {
          this.Identifier = valore;
          RD3_DesktopManager.ObjectMap.add(valore, this);
          break;
        }

      default: this[nome] = JSON.parse(valore);
    }
  }
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
CustomElement.prototype.Realize = function (parent, cls)
{
  if (this.Parent instanceof PCell) {
    // Se e' stata fornita una classe particolare, la aggiungo
    if (cls)
      RD3_Glb.AddClass(this.GetDOMObj(), cls);
    //
    this.GetDOMObj().setAttribute("id", this.Identifier);
    this.Parent.SetZIndex(this.GetDOMObj());
  }
  //
  RD3_Glb.AddClass(parent, "inde-custom-component");
  //
  this.Realized = true;
}

// ***************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta
// per essere distrutto
// ***************************************************************
CustomElement.prototype.Unrealize = function ()
{
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
  //
  if (this.Parent instanceof PCell)
    this.GetDOMObj().remove();
  //
  this.Realized = false;
}

// ***************************************************************
// Calcola le dimensioni dei div in base alla dimensione del
// contenuto
// ***************************************************************
CustomElement.prototype.AdaptLayout = function ()
{
}

// ***************************************************************
// Metodo invocato alla fine di ogni richiesta
// ***************************************************************
CustomElement.prototype.AfterProcessResponse = function ()
{
  if (this.methodInvocations && this.Realized)
  {
    while (this.methodInvocations.length > 0)
      this.InvokeMethod(this.methodInvocations.shift());
    delete this.methodInvocations;
  }
}

// **************************************************************
// Invoca un metodo su questo oggetto in base al nodo xml arrivato.
// **************************************************************
CustomElement.prototype.InvokeMethod = function (node)
{
  if (!this.Realized)
  {
    this.methodInvocations = this.methodInvocations || [];
    this.methodInvocations.push(node);
    return;
  }
  //
  var method = node.getAttribute("met");
  var arguments = JSON.parse(node.getAttribute("args"));
  this[method].apply(this, arguments);
}

// **************************************************************
// Notifica un evento al server
// **************************************************************
CustomElement.prototype.SendEvent = function(name, arguments, event)
{
  if (name === "$ChangeProp$" || (this.eventsList && this.eventsList.indexOf(name) >= 0))
    new IDEvent("cseev", this.Identifier, event, RD3_Glb.EVENT_URGENT, null, name, JSON.stringify(arguments || []));
  else
    console.warn(name + " event not sent beacause isn't implemented server side");
}

// **************************************************************
// Notifica al server il cambio di una proprieta'
// **************************************************************
CustomElement.prototype.SendProperty = function (name, value)
{
  this.SendEvent("$ChangeProp$", [name, value == undefined ? this[name] : value]);
}

// ***************************************************
// Ritorna l'oggetto DOM principale dell'elemento
// ***************************************************
CustomElement.prototype.GetDOMObj = function()
{
}

// ***************************************************
// Imposta lo stato di abilitazione dell'elemento
// ***************************************************
CustomElement.prototype.SetEnabled = function(value)
{
  // Se e' cambiato lo stato
  if (value != this.Enabled)
    this.Enabled = value;
}

// ***************************************************
// Imposta lo stato di visibilita' dell'elemento
// ***************************************************
CustomElement.prototype.SetVisible = function(value) 
{
  // Se e' cambiato lo stato
  if (value != this.Visible)
  {
    this.Visible = value;
    this.GetDOMObj().style.visibility = (this.Visible ? "" : "hidden");
  }
}

// ***************************************************
// Assegna l'identificativo all'elemento
// ***************************************************
CustomElement.prototype.SetID = function(id)
{
  var domObj = this.GetDOMObj();
  domObj.setAttribute("id", id);
  this.Parent.SetZIndex(domObj);
}

// ***************************************************
// Imposta le coordinate dell'elemento
// ***************************************************
CustomElement.prototype.SetLeft = function(x)
{
  this.Left = x;
  this.GetDOMObj().style.left = this.Left + "px";
}
CustomElement.prototype.SetTop = function(y)
{
  this.Top = y;
  this.GetDOMObj().style.top = this.Top + "px";
}
CustomElement.prototype.SetWidth = function(w)
{
  this.Width = w;
  this.GetDOMObj().style.width = this.Width + "px";
}
CustomElement.prototype.SetHeight = function(h)
{
  this.Height = h;
  this.GetDOMObj().style.height = this.Height + "px";
}

// ***************************************************
// Imposta lo stile visuale dell'elemento
// ***************************************************
CustomElement.prototype.SetVisualStyle = function(vs, skipinput, force)
{
  this.VisualStyle = vs;
}

// ***************************************************
// Imposta il tooltip dell'elemento
// ***************************************************
CustomElement.prototype.SetTooltip = function(tip)
{
  if (tip != this.Tooltip)
  {
    this.Tooltip = tip;
    RD3_TooltipManager.SetObjTitle(this.GetDOMObj(), tip);
  }
}

// *********************************************************
// Imposta il tooltip dell'elemento
// *********************************************************
CustomElement.prototype.GetTooltip = function(tip)
{
  if (!this.Tooltip)
    return false;
  //
  var title;
  if (this.Parent instanceof PCell)
    title = this.Parent.GetTooltipTitle();
  else
    title = this.Parent.Caption;
  //
  tip.SetTitle(title);
  tip.SetText(this.Tooltip);
  tip.SetAutoAnchor(true);
  tip.SetPosition(2);
  //
  return true;
}

// ***************************************************
// Imposta il valore dell'elemento
// ***************************************************
CustomElement.prototype.SetText = function(txt)
{
  this.Value = txt;
  this.SetValue(txt);
}
CustomElement.prototype.SetValue = function (value)
{
  this.Value = value;
}

// ***************************************************
// Ritorna il valore corrente dell'elemento
// ***************************************************
CustomElement.prototype.GetValue = function()
{
  return this.Value;
}

// ***************************************************
// Imposta lo sfondo dell'elemento
// ***************************************************
CustomElement.prototype.SetBackGroundImage = function(img)
{
  this.BackGroundImage = img;
}

// **********************************************************************
// Mette/toglie l'evidenziazione sull'elemento
// **********************************************************************
CustomElement.prototype.SetActive = function(act)
{
}

// ***********************************************
// Imposta il watermark dell'elemento
// ***********************************************
CustomElement.prototype.SetWatermark = function()
{
  if (this.HasWatermark)
    return;
  //
  this.HasWatermark = true;
  //
  RD3_Glb.AddClass(this.GetDOMObj(), "panel-field-value-watermark");
}

// ***********************************************
// Rimuove il watermark dell'elemento
// ***********************************************
CustomElement.prototype.RemoveWatermark = function()
{
  if (!this.HasWatermark)
    return;
  //
  this.HasWatermark = false;
  //
  RD3_Glb.RemoveClass(this.GetDOMObj(), "panel-field-value-watermark");
}

// ***************************************************
// Nasconde/mostra il contenuto dell'elemento
// ***************************************************
CustomElement.prototype.HideContent = function(hide, disable)
{
}

CustomElement.prototype.SetCanResize = function(canResize)
{
  if (this.GetDOMObj())
  {
    this.GetDOMObj().classList.toggle((this.InList ? "list" : "form") + "-cell-variable-size", canResize);
    this.GetDOMObj().classList.toggle((this.InList ? "list" : "form") + "-cell-noresize", !canResize);
  }
}

CustomElement.prototype.SetFlexOrder = function(order)
{
  if (this.GetDOMObj())
    this.GetDOMObj().style.order = order;
}

// ***************************************************
// Imposta il tabIndex
// ***************************************************
CustomElement.prototype.SetTabIndex = function (tindex) 
{
  this.GetDOMObj().setAttribute("tabIndex", tindex);
}

// ***************************************************
// Evento da invocare quando cambia il valore
// ***************************************************
CustomElement.prototype.OnChange = function()
{
  if (this.Parent instanceof PCell)
    this.Parent.OnCustomChange();
}

// ***************************************************
// Metodo invocato ogni volta che la cella si aggiorna
// ***************************************************
CustomElement.prototype.UpdateCell = function()
{
}

// ***************************************************
// L'elemento puo' ricevere il fuoco?
// ***************************************************
CustomElement.prototype.CanHaveFocus = function()
{
  return true;
}

// ***************************************************
// L'elemento riceve il fuoco
// ***************************************************
CustomElement.prototype.Focus = function()
{
}

// ***************************************************
// Copia le proprieta' da un altro custom element
// ***************************************************
CustomElement.prototype.CopyFrom = function(ce)
{
  var proto = Object.getPrototypeOf(this);
  var propDefs = Object.getOwnPropertyDescriptors(proto);
  for (var prop in propDefs)
  {
    if (propDefs[prop].get)
      this[prop] = ce[prop];
  }
  //
  var keys = Object.keys(ce);
  for (var k = 0; k < keys.length; k++)
  {
    var key = keys[k];
    switch (key)
    {
      case "Parent":
      case "className":
      case "Left":
      case "Top":
      case "Width":
      case "Height":
      case "Enabled":
      case "Visible":
      case "Tooltip":
      case "VisualStyle":
      case "Value":
        break;

      case "methodInvocations":
        {
          for (var i = 0; i < ce.methodInvocations.length; i++)
            this.InvokeMethod(ce.methodInvocations[i]);
          delete ce.methodInvocations;
          break;
        }

      default:
        this[key] = ce[key];
    }
  }
}

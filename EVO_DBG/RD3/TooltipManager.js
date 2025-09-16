// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Gestore Tooltip
// ************************************************


// *****************************************************
// Classe TooltipManager
// Gestore dei tooltip
// *****************************************************
function TooltipManager()
{
  // Variabili del Tooltip Manager
  //
  this.BaseTooltip = null;    // Tooltip principale
  this.BaseTooltipBis = null; // Tooltip usato in caso di concorrenza
  this.CustomTooltip = null;  // Tooltip custom da sostituire al tooltip standard per gli oggetti che lo richiedono
  //
  this.Style = "info";   // Stile di default dei tooltip
  this.DelayShow = 750;  // Tempo in ms dopo il quale viene mostrato il tooltip
  this.DelayHide = 4000; // Tempo in ms dopo il quale viene nascosto il tooltip
  this.AnimDef = "fade:250"; // Tipo di animazione
  //
  this.OldXPos = -1; // Ultima posizione X del mouse
  this.OldYPos = -1; // Ultima posizione Y del mouse
  //
  this.Enabled = true; // Indica se il TooltipManager e' abilitato
  //
  this.Tooltips = new Array();  // Array dei tooltip spot
}


// ******************************************
// Inizializzazione del gestore
// ******************************************
TooltipManager.prototype.Init = function()
{
  // Creo il tooltip base
  this.BaseTooltip = new MessageTooltip(this);
  this.BaseTooltipBis = new MessageTooltip(this);
  //
  // Aggiungo al document i listener degli eventi
  // di MouseOver, MouseMove, MouseOut, MouseDown, Click e KeyDown
  // utili per mostrare i Tooltips
  var mo = new Function("ev","return RD3_TooltipManager.OnMouseOver(ev)");
  var mm = new Function("ev","return RD3_TooltipManager.OnMouseMove(ev)");
  var mt = new Function("ev","return RD3_TooltipManager.OnMouseOut(ev)");
  var md = new Function("ev","return RD3_TooltipManager.OnMouseDown(ev)");
  var mc = new Function("ev","return RD3_TooltipManager.OnClick(ev)");
  var kd = new Function("ev","return RD3_TooltipManager.OnKeyDown(ev)");
  //
  if (document.addEventListener)
  {
    document.addEventListener("mouseover", mo, true);
    document.addEventListener("mousemove", mm, true);
    document.addEventListener("mouseout", mt, true);
    document.addEventListener("mousedown", md, true);
    document.addEventListener("click", mc, true);
    document.body.addEventListener("keydown", kd, true);
  }
  else
  {
    document.attachEvent("onmouseover", mo);
    document.attachEvent("onmousemove", mm);
    document.attachEvent("onmouseout", mt);
    document.attachEvent("onmousedown", md);
    document.attachEvent("onclick", mc);
    document.body.attachEvent("onkeydown", kd);    
  }
}


// ************************************************
// Gestione del MouseOver su un oggetto
// ************************************************
TooltipManager.prototype.OnMouseOver = function(ev)
{
  // Se il TooltipManager non e' abilitato ... non faccio nulla
  // -> Su mobile spegniamo i tooltip: questo fa si che funzionino solo i tooltip mostrati con la showtooltip
  if (!this.Enabled || RD3_Glb.IsMobile())
    return;
  //
  // Se e' in atto un D&D ... non faccio nulla
  if (RD3_DDManager.IsDragging)
    return;
  //
  var x = (window.event)?window.event.clientX:ev.clientX;
  var y = (window.event)?window.event.clientY:ev.clientY;
  var obj = (window.event)?window.event.srcElement:ev.target;
  if (!obj)
    return;
  //
  // Ottengo l'oggetto di modello giusto
  var o = RD3_KBManager.GetObject(obj);
  //
  // Se l'oggetto gestisce i tooltip
  if (o && o.GetTooltip)
  {
    // Se il BaseTooltip e' mostrato devo usare un'altro tooltip
    // altrimenti si vede il nuovo tooltip in quello che si sta chiudendo
    if (this.BaseTooltip.Opened)
    {
      var t = this.BaseTooltip;
      this.BaseTooltip = this.BaseTooltipBis;
      this.BaseTooltipBis = t;
    }
    //
    // Reimposto al default il tooltip base
    this.BaseTooltip.Reset();
    this.BaseTooltip.SetStyle(this.Style);
    this.BaseTooltip.SetObj(obj);
    this.BaseTooltip.SetDelay(this.DelayShow, this.DelayHide);
    this.BaseTooltip.SetAnimDef(this.AnimDef);
    //
    // Se l'oggetto ha un suo tooltip uso quello
    if (o.CustomTooltip && (!o.CustomTooltip.Obj || o.CustomTooltip.Obj == obj))
    {
      this.CustomTooltip = o.CustomTooltip;
      this.CustomTooltip.Activate(x,y);
    }
    // Chiedo all'oggetto se ha un tooltip da mostrare
    else if (o.GetTooltip(this.BaseTooltip, obj))
    {
      this.BaseTooltip.SetOwner(o);
      this.BaseTooltip.Activate(x,y);
    }
  }
}

// ******************************************
// Gestione del MouseOver su un oggetto
// ******************************************
TooltipManager.prototype.OnMouseMove = function(ev)
{
  // Se il TooltipManager non e' abilitato ... non faccio nulla
  if (!this.Enabled)
    return;
  //
  var x = (window.event)?window.event.clientX:ev.clientX;
  var y = (window.event)?window.event.clientY:ev.clientY;
  //
  // Verifico che il mouse sia mossoveramente
  if (this.OldXPos==x && this.OldYPos==y)
    return;
  //
  this.OldXPos = x;
  this.OldYPos = y;
  //
  // Se il tooltip e' attivo per qualche oggetto
  if (this.BaseTooltip.Owner != this)
  {
    //
    // Se e' in atto un D&D ... disattivo il tooltip
    if (RD3_DDManager.IsDragging)
    {
      this.BaseTooltip.SetOwner(this);
      this.BaseTooltip.Deactivate();
    }
    else
    {
      // Se e' un tooltip con chiusura programmata
      // e si stava per aprire ... lo riprogrammo
      if (this.BaseTooltip.DelayShow>0 && this.BaseTooltip.ShowTimerID>0)
         this.BaseTooltip.Activate(x,y);
     }
  }
}

// ************************************************
// Gestione del MouseDown su un oggetto
// ************************************************
TooltipManager.prototype.OnMouseDown = function(ev)
{
  // Se il TooltipManager non e' abilitato ... non faccio nulla
  if (!this.Enabled)
    return;
  //
  this.DeactivateAll();
}

// ************************************************
// Gestione del Click su un oggetto
// ************************************************
TooltipManager.prototype.OnClick = function(ev)
{
  // Se il TooltipManager non e' abilitato ... non faccio nulla
  if (!this.Enabled)
    return;
  //
  var obj = (window.event)?window.event.srcElement:ev.target;
  if (!obj)
    return;
  //
  // Se ho cliccato su un tooltip lo chiudo
  var o = RD3_KBManager.GetObject(obj);
  if (o instanceof MessageTooltip && o.DelayHide > 0)
    o.Deactivate(o.ReusableTooltip);
}

// ************************************************
// Gestione del MouseOut su un oggetto
// ************************************************
TooltipManager.prototype.OnMouseOut = function(ev)
{
  // Se il TooltipManager non e' abilitato ... non faccio nulla
  if (!this.Enabled)
    return;
  //
  // Se e' in atto un D&D ... non faccio nulla
  if (RD3_DDManager.IsDragging)
    return;
  //
  // Se e' un tooltip custom lo disattivo
  if (this.CustomTooltip)
  {
    this.CustomTooltip.Deactivate();
    return;
  }
  // Se il tooltip e' attivo per qualche oggetto
  if (this.BaseTooltip.Owner != this)
  {
    // Se e' un tooltip con chiusura programmata
    if (this.BaseTooltip.DelayShow>0)
    {
      // Lo disattivo
      this.BaseTooltip.SetOwner(this);
      this.BaseTooltip.Deactivate();
    }
  }
}

// ************************************************
// Gestione del KeyDown su un oggetto
// ************************************************
TooltipManager.prototype.OnKeyDown = function(ev)
{
  // Se il TooltipManager non e' abilitato ... non faccio nulla
  if (!this.Enabled)
    return;
  //
  this.DeactivateAll();
}

// ************************************************
// Disattiva tutti i tooltip temporizzati
// ************************************************
TooltipManager.prototype.DeactivateAll = function()
{
  // Se il TooltipManager non e' abilitato ... non faccio nulla
  if (!this.Enabled)
    return;
  //
  // Se il tooltip e' attivo per qualche oggetto
  if (this.BaseTooltip.Owner != this)
  {
    // Se e' un tooltip con chiusura programmata
    if (this.BaseTooltip.DelayShow>0)
      this.BaseTooltip.Deactivate(true);
  }
  //
  // Verifico se ci sono dei tooltip che dipendono
  // dall'inattivita' dell'utente da disattivare
  for (var i in this.Tooltips)
  {
    var tip = this.Tooltips[i];
    if (tip.ShowOnInactivity)
      tip.Deactivate();
  }
}

// ************************************************
// Attiva o disattiva il TooltipManager
// ************************************************
TooltipManager.prototype.SetEnabled = function(enabled)
{
  this.Enabled = enabled;
}

// ************************************************
// Imposta il title di un'oggetto, se occorre
// ************************************************
TooltipManager.prototype.SetObjTitle = function(obj, title)
{
  // Se siamo disabilitati e non in mobile invece di mostrare i tooltip avanzati
  // uso quelli del browser (In mobile i tooltip del browser non ci devono essere..)
  if (!this.Enabled && !RD3_Glb.IsMobile())
  {
    if (title != "")
      obj.setAttribute("title", title);
    else
      obj.removeAttribute("title");
  }
}

// ***************************************************************
// Gestisce un tooltip
// ***************************************************************
TooltipManager.prototype.HandleTooltip = function(node)
{
  var tip = new MessageTooltip();
  //
  var ObjID = node.getAttribute("id");
  if (ObjID != "")
  {
    // Cerco l'oggetto per ID nel DOM
    var obj = document.getElementById(ObjID);
    if (obj)
    {
      // Se l'ho trovato recupero l'oggetto relativo
      tip.SetOwner(RD3_KBManager.GetObject(obj));
      tip.SetObj(obj);
    }
    else
    {
      // Cerco l'oggetto nella mappa
      var o = RD3_DesktopManager.ObjectMap[ObjID];
      if (o)
      {
        // Se l'ho trovato recupero il rispettivo oggetto nel DOM
        tip.SetOwner(o);
        if (o.GetDOMObj)
          tip.SetObj(o.GetDOMObj());
      }
    }
    //
    // Se non ho trovato l'oggetto DOM non faccio nulla
    if (!tip.Obj)
      return;
  }
  //
  tip.SetTitle(node.getAttribute("title"));
  tip.SetText(node.getAttribute("text"));
  //
  var AnchorX = node.getAttribute("anchorx");
  var AnchorY = node.getAttribute("anchory");
  if (AnchorX!=null && AnchorY!=null)
    tip.SetAnchor(parseInt(AnchorX), parseInt(AnchorY));
  //
  var Position = node.getAttribute("position");
  if (Position!=null)
    tip.SetPosition(parseInt(Position));
  //
  var ShowDelay = node.getAttribute("showdelay");
  var HideDelay = node.getAttribute("hidedelay");
  ShowDelay = (ShowDelay == null ? 750 : parseInt(ShowDelay));
  HideDelay = (HideDelay == null ? 4000 : parseInt(HideDelay));
  tip.SetDelay(ShowDelay, HideDelay);
  //
  var ShowOnInactivity = node.getAttribute("showoninactivity");
  if (ShowOnInactivity!=null)
    tip.SetShowOnInactivity(ShowOnInactivity!="0");
  //
  var Width = node.getAttribute("width");
  if (Width!=null)
    tip.SetWidth(parseInt(Width));
  //
  var Height = node.getAttribute("height");
  if (Height!=null)
    tip.SetHeight(parseInt(Height));
  //
  var Style = node.getAttribute("style");
  if (Style!=null)
    tip.SetStyle(Style);
  else
    tip.SetStyle(this.Style);
  //
  var HasWhisker = node.getAttribute("haswhisker");
  if (HasWhisker!=null)
    tip.SetHasWhisker(HasWhisker!="0");
  //
  var Image = node.getAttribute("image");
  if (Image!=null)
    tip.SetImage(Image);
  //
  tip.SetAnimDef(this.AnimDef);
  //
  // Se e' un tooltip custom
  if (tip.DelayShow == -1)
  {
    tip.SetDelay(0, 0);
    tip.SetCanClose(false);
    tip.SetAnimDef("none");
    //
    // Lo passo all'owner
    tip.Owner.CustomTooltip = tip;
  }
  else
  {
    // Lo aggiungo al mio array
    this.Tooltips.push(tip);
    //
    // Lo attivo
    tip.Activate();
  }
}

// ***************************************************************
// Evento notificato dalla deattivazione di un tooltip
// ***************************************************************
TooltipManager.prototype.OnDeactivate = function(tooltip)
{
  if (tooltip == this.CustomTooltip)
    return;
  //
  if (tooltip == this.BaseTooltip || tooltip == this.BaseTooltipBis)
  {
    tooltip.SetOwner(this);
    tooltip.SetObj(null);
    return;
  }
  //
	var n = this.Tooltips.length;
	for (var i=0; i<n; i++)
  {
    if (this.Tooltips[i] == tooltip)
      this.Tooltips.splice(i,1);
  }
  tooltip.SetOwner(null);
}

// ****************************************************************
// Verifica se un oggetto e' visibile scorrendo la catena dei padri
// ****************************************************************
TooltipManager.prototype.IsObjVisible = function(obj)
{
  // Scorro la catena dei padri (obj compreso)
  while (obj && obj!=document.body)
  {
    // Se e' invisibile ... ho finito
    if (obj.style && (obj.style.display == "none" || obj.style.visibility == "hidden"))
      return false;
    //
    obj = obj.parentNode;
  }
  //
  // Se obj e' nullo allora non e' nel body (quindi invisibile)
  return (obj != null);
}

// ***************************************************************
// Disattiva tutti i tooltip attivati su oggetti di una form
// ***************************************************************
TooltipManager.prototype.ResetTooltip = function(node)
{
  var formID = node.getAttribute("id");
  var i = 0;
  while (i < this.Tooltips.length)
  {
    var tip = this.Tooltips[i];
    if (tip.Obj && this.IsObjParent(tip.Obj, formID))
      tip.Deactivate();
    else
      i++;
  }
}

// ****************************************************************
// Verifica se un oggetto ha un padre con un certo ID
// ****************************************************************
TooltipManager.prototype.IsObjParent = function(obj, parentID)
{
  // Scorro la catena dei padri (obj compreso)
  obj = obj.parentNode;
  while (obj && obj!=document.body)
  {
    if (obj.getAttribute('id') == parentID)
      return true;
    //
    obj = obj.parentNode;
  }
  //
  return false;
}
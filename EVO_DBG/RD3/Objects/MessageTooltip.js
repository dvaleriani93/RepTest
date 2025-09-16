// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe MessageTooltip: Implementa una finestra di messaggi
// da usare come Tooltip
// Estende PopupFrame
// ************************************************

function MessageTooltip(owner)
{
  this.Style = "info";       // Stile del tooltip (info, warning, error)
  this.Image = RD3_Glb.IsMobile()?"":RD3_Glb.GetImgSrc("images/minfo_sm.gif");
                             // L'immagine da mostrare a fianco del messaggio
  this.Title = "";           // Il titolo del messaggio
  this.MessageText = "";     // Il testo del messaggio da mostrare
  this.RoundBorders = true;  // I bordi sono arrotondati?
  this.Position = 0;         // Posizione in cui mostrarlo 0:top 1:right; 2:bottom; 3:left;
  this.HasWhisker = true;    // Mostra il baffo?
  this.Obj = null;           // Oggetto a cui e' associato
  this.AnchorX = -1;         // Cordinata X dove deve essere ancorato il tooltip
  this.AnchorY = -1;         // Cordinata Y dove deve essere ancorato il tooltip
  this.AutoAnchor = false;   // Indica se il tooltip deve essere ancorato dove si trova il mouse
  this.DelayShow = 750;      // Tempo in ms dopo il quale viene mostrato il tooltip
  this.DelayHide = 4000;     // Tempo in ms dopo il quale viene nascosto il tooltip
  this.ShowTimerID = 0;      // Timer usato per mostrare il tooltip
  this.HideTimerID = 0;      // Timer usato per nascondere il tooltip
  this.ReposTimerID = 0;     // Timer usato per riposizionare il tooltip
  this.Owner = owner;        // Proprietario del tooltip
  this.Opened = false;       // Indica se il tooltip e' aperto
  this.CanClose = false;     // Indica se deve essere presente il bottone di chiusura
  this.ShowOnInactivity = false; // Indica se l'apertura del tooltip e' condizionata all'inattivita' dell'utente
  this.AnimDef = "fade:250"; // Tipo di animazione
  this.ReusableTooltip = false; // Tooltip riutilizzabile: la close fatta tramite pulsante non lo distrugge definitivamente
  //
  // Alcune dimensioni
  this.BorderRoundWidth = 3;   // Dimensioni dei bordi arrotondati
  this.MaxBorderLength = 1000; // Dimensioni dell'immagine sprite con i bordi e i baffi
  this.WhiskerBase =   RD3_Glb.IsMobile()?11:9;  // Larghezza in pixel del baffo
  this.WhiskerHeight = RD3_Glb.IsMobile()?12:10; // Altezza in pixel del baffo
  this.WhiskerOffset = RD3_Glb.IsMobile()?7:5;   // Distanza del baffo dal bordo
  this.CloseImgWidth = 15;     // Dimensioni in pixel dell'immagine di chiusura
  this.MaxTooltipWidth = 300;  // Larghezza massima che puo' avere il tooltip
  //
  // Oggetti visuali specifici di questo oggetto
  this.ImgObj = null;   // IMG contenente l'immagine
  this.TitleBox = null; // DIV contenente il Title
  this.MsgBox = null;   // DIV contenente il Text
  this.Whisker = null;  // IMG contenente il baffo
  this.CloseObj = null; // IMG contenente l'immagine di chiusura
  //
  // Eseguo inizializzazione
  this.Init();
}
// Definisco l'estensione della classe
MessageTooltip.prototype = new PopupFrame();

// ***************************************************************
// Inizializza l'oggetto
// ***************************************************************
MessageTooltip.prototype.Init = function()
{
  // Cambio l'identificativo
  this.Identifier = "TOOLTIP" + Math.floor(Math.random() * 1000000);
  //
  // Mi aggiungo nella mappa degli oggetti
  RD3_DesktopManager.ObjectMap.add(this.Identifier, this);
  //
  // IE6 non supporta alcune cose
  if (RD3_Glb.IsIE(6))
  {
    this.RoundBorders = false;
    this.HasWhisker = false;
  }
  //
  // Il mobile si arrangia a curvare i bordi
  if (RD3_Glb.IsMobile())
  	this.RoundBorders = false;
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
MessageTooltip.prototype.Realize = function()
{
  // Impostazioni iniziali 
  this.Centered = false;
  this.Modal = false;
  this.CanMove = false;
  this.CanResize = false;
  this.HasCaption = false;
  this.Borders = RD3_Glb.BORDER_NONE;
  //
  // Chiamo la classe base
  PopupFrame.prototype.Realize.call(this);
  this.PopupBox.setAttribute("id", this.Identifier);
  //
  // Creo l'immagine
  this.ImgObj = document.createElement("img");
  this.ImgObj.className = "messagetooltip-image";
  this.ContentBox.appendChild(this.ImgObj);
  this.SetImage();
  //
  // Creo il SPAN per il titolo
  this.TitleBox = document.createElement("span");
  this.TitleBox.className = "messagetooltip-title";
  this.ContentBox.appendChild(this.TitleBox);
  this.SetTitle();
  //
  // Creo il DIV per il messaggio
  this.MsgBox = document.createElement("div");
  this.MsgBox.className = "messagetooltip-text";
  this.ContentBox.appendChild(this.MsgBox);
  this.SetText();
  //
  // Creo i DIV per i bordi arrotondati
  this.BorderTop = document.createElement("div");
  this.BorderTop.className = "messagetooltip-border-top";
  this.PopupBox.appendChild(this.BorderTop);
  //
  this.BorderRight = document.createElement("div");
  this.BorderRight.className = "messagetooltip-border-right";
  this.PopupBox.appendChild(this.BorderRight);
  //
  this.BorderBottom = document.createElement("div");
  this.BorderBottom.className = "messagetooltip-border-bottom";
  this.PopupBox.appendChild(this.BorderBottom);
  //
  this.BorderLeft = document.createElement("div");
  this.BorderLeft.className = "messagetooltip-border-left";
  this.PopupBox.appendChild(this.BorderLeft);
  //
  this.SetRoundBorders();
  //
  // Creo DIV per il baffo
  this.Whisker = document.createElement("div");
  this.Whisker.className = "messagetooltip-whisker";
  this.PopupBox.appendChild(this.Whisker);
  this.SetHasWhisker();
  //
  // Creo l'IMG per il bottone di chiusura
  this.CloseObj = document.createElement("div");
  this.CloseObj.className = "messagetooltip-close-image";
  this.CloseObj.style.backgroundPosition = (this.CloseImgWidth-this.MaxBorderLength+this.BorderRoundWidth) + "px " + (-this.BorderRoundWidth) + "px";
  this.CloseObj.onclick = new Function("ev","RD3_DesktopManager.ObjectMap['"+this.Identifier+"'].Deactivate(" +(this.ReusableTooltip ? "true" : "") + ")");
  this.ContentBox.appendChild(this.CloseObj);
  this.SetCanClose();
  //
  this.SetStyle();
}

// ********************************************************************************
// Reimposta le impostazioni di default
// ********************************************************************************
MessageTooltip.prototype.Reset = function()
{
  this.SetTitle("");
  this.SetText("");
  this.SetRoundBorders(true);
  this.SetHasWhisker(true);
  this.SetPosition(0);
  this.SetStyle("info");
  this.SetAnchor(-1,-1);
  this.SetAutoAnchor(false);
  this.SetObj(null);
  this.SetDelay(750,4000);
  this.SetWidth(0);
  this.SetHeight(0);
  this.SetAnimDef("fade:250");
}

// ********************************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta per essere
// distrutto
// ********************************************************************************
MessageTooltip.prototype.Unrealize = function()
{
  if (this.Realized)
  {
    // Chiamo la classe base
    PopupFrame.prototype.Unrealize.call(this);
    //
    // Rimuovo i riferimenti dal DOM
    this.ImgObj = null;
    this.TitleBox = null;
    this.MsgBox = null;
    this.Whisker = null;
    this.CloseObj = null;
    this.Owner = null;
  }
  else
  {
	  // Mi tolgo comunque dalla mappa degli oggetti perche'
	  // i tooltip vengono aggiunti alla mappa anche nella Init
	  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
	}
}

// ***************************************************
// Dimensiono la Box in base al contenuto
// ***************************************************
MessageTooltip.prototype.AdaptLayout = function(recalc)
{
//	PopupFrame.prototype.AdaptLayout.call(this);
	var mob = RD3_Glb.IsMobile();
	var mie = mob && (RD3_Glb.IsIE() || RD3_Glb.IsEdge());
  //
  // Metto il bordo superiore al messaggio se c'e' un titolo
  this.MsgBox.style.borderTopWidth = (this.Title.length>0 ? 1 : 0) + "px";
  //
  // Aggiungo 4px di margine sinitro al titolo se c'e' l'immagine
  this.TitleBox.style.marginLeft = (this.Image.length>0 ? 4 : 0) + "px";
  //
  // Aggiungo al margine sinitro del testo la larghezza dell'immagine + 4px
  var ml = (this.Image.length>0 ? this.ImgObj.offsetWidth+4 : 0);
  this.MsgBox.style.marginLeft = ml + "px";
  //
  // Se non e' stata specificata una larghezza
  if (this.Width == 0 || recalc)
  {
    // Adatto il tooltip al contenuto
    this.MsgBox.style.width = (this.MaxTooltipWidth - ml) + "px";
    var ch = this.MsgBox.childNodes[0];
    if (ch)
      this.MsgBox.style.width = Math.max(ch.offsetWidth, this.TitleBox.offsetWidth+(this.CanClose?this.CloseImgWidth+2:0)) + "px";
    //
    this.SetWidth(this.MsgBox.offsetLeft + this.MsgBox.offsetWidth);
  }
  else
    this.MsgBox.style.width = (this.Width - ml) + "px";
  //
  // Se non e' stata specificata un'altezza
  if (this.Height == 0 || recalc)
  {
    // Adatto il tooltip al contenuto
    this.MsgBox.style.height = (this.MaxTooltipWidth - this.MsgBox.offsetTop) + "px";
    var ch = this.MsgBox.childNodes[0];
    if (ch)
      this.MsgBox.style.height = ch.offsetHeight + "px";
    //
    this.SetHeight(this.MsgBox.offsetTop + this.MsgBox.offsetHeight);
  }
  else
    this.MsgBox.style.height = (this.Height - this.TitleBox.offsetHeight) + "px";
  //
  // Posiziono il bottone di chiusura
  this.CloseObj.style.left = (this.Width - this.CloseImgWidth) + "px";
  //
  if (this.RoundBorders)
  {
    this.BorderTop.style.top = (0 - this.BorderTop.offsetHeight) + "px";
    this.BorderTop.style.left = (-this.BorderRoundWidth) + "px";
    this.BorderTop.style.width = (this.Width + this.BorderRoundWidth) + "px";
    //
    this.BorderRight.style.left = (0 + this.Width) + "px";
    this.BorderRight.style.top = (-this.BorderRoundWidth) + "px";
    this.BorderRight.style.height = (this.Height + this.BorderRoundWidth) + "px";
    this.BorderRight.style.backgroundPosition = (this.BorderRoundWidth - this.MaxBorderLength) + "px 0px";
    //
    this.BorderBottom.style.top = (0 + this.Height) + "px";
    this.BorderBottom.style.left = (0) + "px";
    this.BorderBottom.style.width = (this.Width + this.BorderRoundWidth) + "px";
    this.BorderBottom.style.backgroundPosition = (this.Width + this.BorderRoundWidth - this.MaxBorderLength) + "px " + (this.BorderRoundWidth - this.MaxBorderLength) + "px";
    //
    this.BorderLeft.style.left = (0 - this.BorderLeft.offsetWidth) + "px";
    this.BorderLeft.style.top = (0) + "px";
    this.BorderLeft.style.height = (this.Height + this.BorderRoundWidth) + "px";
    this.BorderLeft.style.backgroundPosition = "0px " + (this.Height + this.BorderRoundWidth - this.MaxBorderLength) + "px";
  }
  //
  if (this.HasWhisker)
  {
    switch (this.aPosition)
    {
      case 0: // top
        this.Whisker.style.left = (0 + this.aWhiskerOffset) + "px";
        this.Whisker.style.top = (this.Height + (mob?-1:0) + (mie?4:0) + (this.RoundBorders ? this.BorderRoundWidth-2 : 0)) + "px";
        this.Whisker.style.height = this.WhiskerHeight + "px";
        this.Whisker.style.width = this.WhiskerBase + "px";
        if (mob)
        {
        	if (mie)
        	{
        		this.Whisker.style.borderLeft = "none";
						this.Whisker.style.borderTop = "none";
						this.Whisker.style.background = "linear-gradient(to top left, #efeff4 0%, #efeff4 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)";
        	}
        	else
        	{
         		this.Whisker.style.webkitMaskImage="-webkit-gradient(linear, right bottom, left top, from(black), color-stop(0.50, black), color-stop(0.50, rgba(0,0,0,0)), to(rgba(0,0,0,0)))"
         	}
        }
				else
	        this.Whisker.style.backgroundPosition = -this.BorderRoundWidth - (1*this.WhiskerBase) + "px " + (-this.BorderRoundWidth) + "px";
        break;

      case 1: // right
        this.Whisker.style.left = (-this.WhiskerHeight  + (mob?3:0) - (this.RoundBorders ? this.BorderRoundWidth-2 : 0)) + "px";
        this.Whisker.style.top = (this.aWhiskerOffset) + "px";
        this.Whisker.style.height = this.WhiskerBase + "px";
        this.Whisker.style.width = this.WhiskerHeight + "px";
        if (mob)
       	{
        	if (mie)
        	{
        		this.Whisker.style.borderRight = "none";
						this.Whisker.style.borderTop = "none";
						this.Whisker.style.background = "linear-gradient(to top right, white 0%, white 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)";
        	}
        	else
        	{
         		this.Whisker.style.webkitMaskImage="-webkit-gradient(linear, left bottom, right top, from(black), color-stop(0.50, black), color-stop(0.50, rgba(0,0,0,0)), to(rgba(0,0,0,0)))";
         	}
        }
				else
	        this.Whisker.style.backgroundPosition = -this.BorderRoundWidth - (3*this.WhiskerBase) + "px " + (-this.BorderRoundWidth) + "px";
        break;

      case 2: // bottom
        this.Whisker.style.left = (this.aWhiskerOffset) + "px";
        this.Whisker.style.top = (-this.WhiskerHeight + (mob?3:0)  - (this.RoundBorders ? this.BorderRoundWidth-2 : 0)) + "px";
        this.Whisker.style.height = this.WhiskerHeight + "px";
        this.Whisker.style.width = this.WhiskerBase + "px";
        if (mob)
        {
        	if (mie)
        	{
        		this.Whisker.style.borderRight = "none";
						this.Whisker.style.borderBottom = "none";
						this.Whisker.style.background = "linear-gradient(to bottom right, #efeff4 0%, #efeff4 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)";
        	}
        	else
        	{
	         	this.Whisker.style.webkitMaskImage="-webkit-gradient(linear, left top, right bottom, from(black), color-stop(0.50, black), color-stop(0.50, rgba(0,0,0,0)), to(rgba(0,0,0,0)))"
	        }
	      }
				else
        	this.Whisker.style.backgroundPosition = -this.BorderRoundWidth - (0*this.WhiskerBase) + "px " + (-this.BorderRoundWidth) + "px";
        break;

      case 3: // left
        this.Whisker.style.left = (this.Width + (mob?-1:0) + (mie?4:0) +(this.RoundBorders ? this.BorderRoundWidth-2 : 0)) + "px";
        this.Whisker.style.top = (this.aWhiskerOffset) + "px";
        this.Whisker.style.height = this.WhiskerBase + "px";
        this.Whisker.style.width = this.WhiskerHeight + "px";
        if (mob)
        {
        	if (mie)
        	{
        		this.Whisker.style.borderLeft = "none";
						this.Whisker.style.borderBottom = "none";
						this.Whisker.style.background = "linear-gradient(to bottom left, white 0%, white 50%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)";
        	}
        	else
        	{
         		this.Whisker.style.webkitMaskImage="-webkit-gradient(linear, right top, left bottom, from(black), color-stop(0.50, black), color-stop(0.50, rgba(0,0,0,0)), to(rgba(0,0,0,0)))";
         	}
        }
				else
	        this.Whisker.style.backgroundPosition = -this.BorderRoundWidth - (2*this.WhiskerBase) + "px " + (-this.BorderRoundWidth) + "px";
        break;
    }
  }
}

// ********************************************************************************
// Programma l'apertura del tooltip
// ********************************************************************************
MessageTooltip.prototype.Activate = function(x,y)
{
  this.Deactivate(true);
  //
  if (this.AutoAnchor)
    this.SetAnchor(x,y);
  //
  // Programmo l'animazione d'apertura se l'oggetto e' visibile
  var f = "var me = RD3_DesktopManager.ObjectMap['"+this.Identifier+"'];";
  f += "if (me && (!me.Obj || RD3_TooltipManager.IsObjVisible(me.Obj)))";
  f += "RD3_GFXManager.AddEffect(new GFX('tooltip', true, me), null, null, '"+this.AnimDef+"')";
  this.ShowTimerID = window.setTimeout(f, this.DelayShow);
}

// ********************************************************************************
// Annulla ogni programmazione del tooltip
// ********************************************************************************
MessageTooltip.prototype.Deactivate = function(Reactivating)
{
  // Se stavo per mostrare il tooltip ... annullo
  if (this.ShowTimerID!=0)
  {
    window.clearTimeout(this.ShowTimerID);
    this.ShowTimerID = 0;
  }
  //
  // Se stavo per nascondere il tooltip ... lo faccio subito
  if (this.HideTimerID!=0)
  {
    window.clearTimeout(this.HideTimerID);
    this.HideTimerID = 0;
  }
  //
  // Se era attivo il timer di riposizionamento ... lo fermo
  if (this.ReposTimerID != 0)
  {
    clearInterval(this.ReposTimerID);
    this.ReposTimerID = 0;
  }
  //
  if (!Reactivating)
  {
    // Informo il TooltipManager che un tooltip si sta disattivando
    RD3_TooltipManager.OnDeactivate(this);
  }
  //
  if (this.Opened)
    RD3_GFXManager.AddEffect(new GFX('tooltip', false, this, null, null, this.AnimDef));
}

// ********************************************************************************
// Realizza e mostra a video questa popup
// ********************************************************************************
MessageTooltip.prototype.Open = function()
{ 
  this.ShowTimerID = 0;
  this.Opened = true;
  //
  if (!this.Realized)
    this.Realize();
  else
    this.PopupBox.style.display = "";
  //
  // Faccio in modo che il tooltip sia sopra a tutto
  if (this.PopupBox.parentNode == document.body)
    document.body.removeChild(this.PopupBox);
  document.body.appendChild(this.PopupBox);
  //
  var offsetW = 0;
  var offsetH = 0;
  this.aPosition = this.Position;
  this.aWhiskerOffset = this.WhiskerOffset;
  //
  this.aAnchorX = this.AnchorX;
  this.aAnchorY = this.AnchorY;
  //
  if (this.Obj)
  {
    this.LastObjTop = RD3_Glb.GetScreenTop(this.Obj, true);
    this.LastObjLeft = RD3_Glb.GetScreenLeft(this.Obj, true);
  }
  //
  // Faccio 8 giri per decidere dove posizionare il tooltip
  // Il 1°bit di giro indica se il baffo e' spostato dall'altra parte
  // Il 2°bit di giro indica se la posizione e' stata invertita di 2
  // Il 3°bit di giro indica se la posizione e' stata invertita di 1
  var giro = 0;
  while (giro<10)
  {
    this.AdaptLayout();
    //
    var wep = RD3_DesktopManager.WebEntryPoint.WepBox;
    //
    // Se non e' stato specificato ne' l'oggetto ne l'ancoraggio
    // posiziono il tooltip al centro dello schermo
    if (!this.Obj && (this.AnchorX == -1 || this.AnchorY == -1))
    {
      this.aAnchorX = wep.clientWidth/2;
      this.aAnchorY = wep.clientHeight/2;
      offsetW = -(this.Width/2);
      offsetH = -(this.Height/2);
      break;
    }
    //
    // Se e' stato specificato come oggetto il FrameBox di un WebFrame
    // ma non le coordinate allora mostro il tooltip al centro del frame
    if (this.Owner instanceof WebFrame && this.Obj==this.Owner.FrameBox && (this.AnchorX == -1 || this.AnchorY == -1))
    {
      this.aAnchorX = RD3_Glb.GetScreenLeft(this.Obj, true) + (this.Obj.clientWidth/2);
      this.aAnchorY = RD3_Glb.GetScreenTop(this.Obj, true) + (this.Obj.clientHeight/2);
      offsetW = -(this.Width/2);
      offsetH = -(this.Height/2);
      break;
    }
    //
    switch (this.aPosition)
    {
      case 0: // top
      {
        offsetH = -(this.RoundBorders ? this.BorderRoundWidth : 0) - (this.HasWhisker ? this.WhiskerHeight : 0) - this.Height;
        offsetW =  -(this.HasWhisker ? (this.WhiskerBase/2) + this.aWhiskerOffset : 0);
        //
        if (this.AutoAnchor)
          this.aAnchorY = this.AnchorY - 10;
        else if (this.Obj && this.AnchorX==-1)
        {
          this.aAnchorY = this.LastObjTop;
          this.aAnchorX = this.LastObjLeft + (this.Obj.offsetWidth/2);
        }
        break;
      }

      case 1: // right
      {
        offsetH = -(this.HasWhisker ?  (this.WhiskerBase/2) + this.aWhiskerOffset : 0);
        offsetW = (this.RoundBorders ? this.BorderRoundWidth : 0) + (this.HasWhisker ? this.WhiskerHeight : 0);
        //
        if (this.AutoAnchor)
          this.aAnchorX = this.AnchorX + 10;
        else if (this.Obj && this.AnchorX==-1)
        {
          this.aAnchorY = this.LastObjTop + (this.Obj.offsetHeight/2);
          this.aAnchorX = this.LastObjLeft + this.Obj.offsetWidth;
        }
        break;
      }

      case 2: // bottom
      {
        offsetH = (this.RoundBorders ? this.BorderRoundWidth : 0) + (this.HasWhisker ? this.WhiskerHeight : 0);
        offsetW = -(this.HasWhisker ? (this.WhiskerBase/2) + this.aWhiskerOffset : 0);
        //
        if (this.AutoAnchor)
          this.aAnchorY = this.AnchorY + 10;
        else if (this.Obj && this.AnchorX==-1)
        {
          this.aAnchorY = this.LastObjTop + this.Obj.offsetHeight;
          this.aAnchorX = this.LastObjLeft + (this.Obj.offsetWidth/2);
        }
        break;
      }

      case 3: // left
      {
        offsetH = -(this.HasWhisker ? (this.WhiskerBase/2) + this.aWhiskerOffset : 0);
        offsetW = -this.Width - (this.RoundBorders ? this.BorderRoundWidth : 0) - (this.HasWhisker ? this.WhiskerHeight : 0);
        //
        if (this.AutoAnchor)
          this.aAnchorX = this.AnchorX - 10;
        else if (this.Obj && this.AnchorX==-1)
        {
          this.aAnchorY = this.LastObjTop + (this.Obj.offsetHeight/2);
          this.aAnchorX = this.LastObjLeft;
        }
        break;
      }
    }
    //
    // Ora calcolo le dimensioni del tooltip
    var w = this.Width;
    var h = this.Height;
    var l = this.aAnchorX + offsetW;
    var t = this.aAnchorY + offsetH;
    //
    if (this.RoundBorders)
    {
      w += 2*this.BorderRoundWidth;
      h += 2*this.BorderRoundWidth;
      l -= this.BorderRoundWidth;
      t -= this.BorderRoundWidth;
    }
    //
    if (this.HasWhisker)
    {
      if (this.aPosition == 0 || this.aPosition == 2)
      {
        h += this.WhiskerHeight;
        t -= this.WhiskerHeight;
      }
      else
      {
        w += this.WhiskerHeight;
        l -= this.WhiskerHeight;
      }
    }
    //
    // Guardo se ci sta tutto a video
    if (l+w > wep.clientWidth || l < 0 || t+h > wep.clientHeight || t < 0)
    {
      // Faccio ricalcolare l'ancoraggio
      if (!this.AutoAnchor)
        this.SetAnchor(-1,-1);
      //
      // Se non ha il baffo salto un giro
      giro += (this.HasWhisker ? 1 : 2);
      //
      // Guardo se devo spostare il baffo
      if ((giro & 1) > 0)
        this.aWhiskerOffset = ((this.aPosition%1)==0 ? this.Width : this.Height) - this.WhiskerBase - this.WhiskerOffset;
      else
        this.aWhiskerOffset = this.WhiskerOffset;
      //
      // Inverto le posizioni di 2 unita' (ad es. sopra=0/sotto=2)
      if ((giro & 2) > 0)
        this.aPosition = (this.aPosition + 2) % 4;
      //
      // Inverto le posizioni di 1 unita' (ad es. sopra=0/destra=1)
      if ((giro & 4) > 0)
        this.aPosition = (this.aPosition + 1) % 4;
      //
      // Se sono arrivato al giro 8 e 9 provo a mettere i tooltip
      // sopra o sotto centrato rispetto allo schermo
      if (giro >= 8)
      {
        this.aPosition = (giro == 8 ? 0 : 2); // Top o Bottom
        w = this.Width + (this.RoundBorders ? 2 : 0) * this.BorderRoundWidth;
        this.aAnchorX = this.AnchorX;
        this.aWhiskerOffset = this.AnchorX - this.WhiskerBase - ((wep.clientWidth - w) / 2);
      }
    }
    else
      break;
  }
  //
  // Ora posso posizionare il tooltip
  this.PopupBox.style.top = (this.aAnchorY + offsetH) + "px";
  this.PopupBox.style.left = (this.aAnchorX + offsetW) + "px";
  //
  // Programmo l'animazione di chiusura
  if (this.DelayHide > 0)
    this.HideTimerID = window.setTimeout("RD3_DesktopManager.ObjectMap['"+this.Identifier+"'].Deactivate()", this.DelayHide);
  //
  if (this.ReposTimerID == 0 && !this.AutoAnchor)
    this.ReposTimerID = setInterval("RD3_DesktopManager.ObjectMap['"+this.Identifier+"'].Tick()", 250);
}


// ********************************************************************************
// Chiude il Tooltip
// ********************************************************************************
MessageTooltip.prototype.Close = function()
{
  this.HideTimerID = 0;
  this.Opened = false;
  //
  if (this.Realized)
  {
    this.PopupBox.style.display = "none";
    //
    // Se e' custom devo rimuoverlo dal DOM e annullare il puntatore del Manager
    if (RD3_TooltipManager.CustomTooltip == this)
    {
      RD3_TooltipManager.CustomTooltip = null;
      document.body.removeChild(this.PopupBox);
    }
    //
    // Se non ha piu' un proprietario lo distruggo
    if (!this.Owner)
      this.Unrealize();
  }
}


// ********************************************************************************
// Cambia il valore del testo del messaggio
// ********************************************************************************
MessageTooltip.prototype.SetText = function(value)
{
  if (value != undefined)
    this.MessageText = value;
  //
  if (this.Realized)
  {
    this.MsgBox.innerHTML = this.MessageText;
    //
    // Se c'e' un solo nodo di tipo TEXT allora il tooltip e' testo puro. Cambio i \n in <br/>
    if (this.MsgBox.childNodes.length==1 && !this.MsgBox.childNodes[0].tagName)
    {
      this.MessageText = this.MessageText.replace(/\n/g, "<br/>");
      this.MsgBox.innerHTML = this.MessageText;
    }
    //
    // Sposto dentro ad uno SPAN tutti i figli
    if (this.MsgBox.childNodes.length>1 || (this.MsgBox.childNodes.length==1 && !this.MsgBox.childNodes[0].tagName))
    {
      var span = document.createElement("SPAN");
      while (this.MsgBox.childNodes.length>0)
        span.appendChild(this.MsgBox.childNodes[0]);
      //
      this.MsgBox.appendChild(span);
    }
  }
}

// ********************************************************************************
// Cambia il titolo
// ********************************************************************************
MessageTooltip.prototype.SetTitle = function(value)
{
  if (value != undefined)
    this.Title = value;
  //
  if (this.Realized)
    this.TitleBox.innerHTML = this.Title;
}

// ********************************************************************************
// Cambia l'icona
// ********************************************************************************
MessageTooltip.prototype.SetImage = function(value)
{
  if (value != undefined)
    this.Image = value;
  //
  if (this.Realized)
  {
    if (this.Image == "")
      this.ImgObj.style.display = "none";
    else
    {
      this.ImgObj.src = RD3_Glb.GetImgSrc(this.Image);
      this.ImgObj.style.display = "inline";
      //
      // Se non e' in cache potrebbe arrivare tra poco
      if (!RD3_Glb.IsIE(10, false))
        this.ImgObj.onload = new Function("ev","RD3_DesktopManager.ObjectMap['"+this.Identifier+"'].AdaptLayout("+(RD3_Glb.IsMobile()?"":"true")+")");
      else
        this.ImgObj.onreadystatechange = new Function("ev","var ttp=RD3_DesktopManager.ObjectMap['"+this.Identifier+"']; if (ttp && ttp.Opened) ttp.AdaptLayout("+(RD3_Glb.IsMobile()?"":"true")+");");
    }
    //
    if ((RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro()) && this.Image != "")
    {
      // Se passo da una mia immagine a una immagine dell'utente devo annullare le dimensioni che ho fissato nella SetStyle
   	  this.ImgObj.removeAttribute("width");
   	  this.ImgObj.removeAttribute("height");
   	  //
      // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
		  var img = "";
      switch (this.Style)
      {
        case "info": img = "info_24.png"; break;
        case "warning": img ="warn_24.png"; break;
        case "error": img ="stop_24.png"; break;
      }
      //
      if (RD3_Glb.Adapt4Retina(this.Identifier, img, 24))
        this.ImgObj.style.display = "none";
   	}
  }
}

// ********************************************************************************
// Cambia lo stile
// ********************************************************************************
MessageTooltip.prototype.SetStyle = function(value)
{
  if (value != undefined)
  {
    this.Style = value;
    var mob = RD3_Glb.IsMobile();
    //
    switch (this.Style)
    {
      case "info": // info
        this.Image = RD3_Glb.GetImgSrc(mob?"images/info_24.png":"images/minfo_sm.gif");
        break;

     case "warning": // warning
        this.Image = RD3_Glb.GetImgSrc(mob?"images/warn_24.png":"images/mwarn_sm.gif");
       break;
       
     case "error": // error
        this.Image = RD3_Glb.GetImgSrc(mob?"images/stop_24.png":"images/mstop_sm.gif");
       break;
       
     default: // custom
       if (this.Style != "")
	     	 this.Image = RD3_Glb.GetImgSrc(mob?"images/"+this.Style+".png":"images/"+this.Style+".gif");
       else
         this.Image = "";
       break;
    }
  }
  //
  if (this.Realized)
  {
    this.SetImage();
    //
    if (this.ImgObj && (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro()))
    {
      // L'immagine e' del template, fisso le dimensioni
	  	if (this.Style == "info" || this.Style == "warning" || this.Style == "error")
		  {
		  	this.ImgObj.width = 24;
			  this.ImgObj.height = 24;
      }
  		else
  		{
        // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
  		  var img = "";
        switch (this.Style)
        {
          case "info": img = "info_24.png"; break;
          case "warning": img ="warn_24.png"; break;
          case "error": img ="stop_24.png"; break;
        }
 	  		if (RD3_Glb.Adapt4Retina(this.Identifier, img, 24))
          this.ImgObj.style.display = "none";
        else
        {
          // Se passo da una mia immagine a una immagine dell'utente devo annullare le dimensioni che ho fissato nella SetStyle
          this.ImgObj.removeAttribute("width");
          this.ImgObj.removeAttribute("height");
        }
 	  	}
    }
    //
    this.PopupBox.className = "messagetooltip-frame-container";
    this.TitleBox.className = "messagetooltip-title";
    if (this.Style != "")
    {
      this.PopupBox.className += " messagetooltip-frame-container-" + this.Style;
      this.TitleBox.className += " messagetooltip-title-" + this.Style;
      if (!RD3_Glb.IsMobile())
      {
	      this.BorderTop.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/tooltip_" + this.Style + ".gif)";
	      this.BorderRight.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/tooltip_" + this.Style + ".gif)";
	      this.BorderBottom.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/tooltip_" + this.Style + ".gif)";
	      this.BorderLeft.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/tooltip_" + this.Style + ".gif)";
	      this.Whisker.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/tooltip_" + this.Style + ".gif)";
	      this.CloseObj.style.backgroundImage = "url("+RD3_Glb.GetAbsolutePath()+"images/tooltip_" + this.Style + ".gif)";
	    }
    }
  }
}

// ********************************************************************************
// Cambia la posizione in cui viene mostrato rispetto all'oggetto associato
// ********************************************************************************
MessageTooltip.prototype.SetRoundBorders = function(value)
{
  if (value != undefined)
  {
    if (RD3_Glb.IsIE(6))
      this.RoundBorders = false;
    else
      this.RoundBorders = value;
  }
  //
  if (this.Realized)
  {
    if (this.RoundBorders)
    {
      this.BorderTop.style.display = "";
      this.BorderRight.style.display = "";
      this.BorderBottom.style.display = "";
      this.BorderLeft.style.display = "";
      this.BorderTop.style.visibility = "visible";
      this.BorderRight.style.visibility = "visible";
      this.BorderBottom.style.visibility = "visible";
      this.BorderLeft.style.visibility = "visible";
    }
    else
    {
      this.BorderTop.style.display = "none";
      this.BorderRight.style.display = "none";
      this.BorderBottom.style.display = "none";
      this.BorderLeft.style.display = "none";
      this.BorderTop.style.visibility = "hidden";
      this.BorderRight.style.visibility = "hidden";
      this.BorderBottom.style.visibility = "hidden";
      this.BorderLeft.style.visibility = "hidden";
    }
  }
}

// ********************************************************************************
// Cambia la posizione in cui viene mostrato rispetto all'oggetto associato
// ********************************************************************************
MessageTooltip.prototype.SetPosition = function(value)
{
  if (value != undefined)
    this.Position = value;
  //
  // Non devo fare nulla in quanto questa informazione
  // viene utilizzata quando viene mostrato il tooltip
}

// ********************************************************************************
// Imposta il tooltip con il baffo
// ********************************************************************************
MessageTooltip.prototype.SetHasWhisker = function(value)
{
  if (value != undefined)
  {
    if (RD3_Glb.IsIE(6))
      this.HasWhisker = false;
    else
      this.HasWhisker = value;
  }
  //
  if (this.Realized)
  {
    this.Whisker.style.display = (this.HasWhisker ? "" : "none");
    this.Whisker.style.visibility = (this.HasWhisker ? "visible" : "hidden");
  }
}

// ********************************************************************************
// Cambia l'oggetto proprietario
// ********************************************************************************
MessageTooltip.prototype.SetOwner = function(value)
{
  this.Owner = value;
}

// ********************************************************************************
// Cambia l'oggetto DOM associato
// ********************************************************************************
MessageTooltip.prototype.SetObj = function(value)
{
  this.Obj = value;
  //
  // Non devo fare nulla in quanto questa informazione
  // viene utilizzata quando viene mostrato il tooltip
}

// ********************************************************************************
// Cambia l'ancoraggio
// ********************************************************************************
MessageTooltip.prototype.SetAnchor = function(valueX, valueY)
{
  this.AnchorX = valueX;
  this.AnchorY = valueY;
  //
  // Non devo fare nulla in quanto questa informazione
  // viene utilizzata quando viene mostrato il tooltip
}

// ********************************************************************************
// Imposta l'ancoraggio automatico
// ********************************************************************************
MessageTooltip.prototype.SetAutoAnchor = function(value)
{
  this.AutoAnchor = value;
  //
  // Non devo fare nulla in quanto questa informazione
  // viene utilizzata quando viene mostrato il tooltip
}

// ********************************************************************************
// Imposta i tempi di ritardo di apertura e chiusura
// ********************************************************************************
MessageTooltip.prototype.SetDelay = function(show, hide)
{
  this.DelayShow = show;
  this.DelayHide = hide;
  //
  this.SetCanClose(this.DelayHide <= 0);
  //
  // Non devo fare nulla in quanto questa informazione
  // viene utilizzata quando viene mostrato il tooltip
}

// ********************************************************************************
// Imposta la visibilita' del bottone di chiusura
// ********************************************************************************
MessageTooltip.prototype.SetCanClose = function(value)
{
  if (value != undefined)
    this.CanClose = value;
  //
  if (this.Realized)
    this.CloseObj.style.display = (this.CanClose ? "" : "none");
}

// ********************************************************************************
// Imposta l'apertura del tooltip condizionata all'inattivita' dell'utente
// ********************************************************************************
MessageTooltip.prototype.SetShowOnInactivity = function(value)
{
  if (value != undefined)
    this.ShowOnInactivity = value;
  //
  // Non devo fare nulla in quanto questa informazione
  // viene utilizzata quando viene mostrato il tooltip
}

// ********************************************************************************
// Imposta l'animazione del tooltip
// ********************************************************************************
MessageTooltip.prototype.SetAnimDef = function(value)
{
  if (value != undefined)
    this.AnimDef = value;
  //
  // Non devo fare nulla in quanto questa informazione
  // viene utilizzata quando viene mostrato il tooltip
}

// ********************************************************************************
// Tick che verifica se l'oggetto si e' spostato:
// in tal caso riposiziona il tooltip
// ********************************************************************************
MessageTooltip.prototype.Tick = function()
{
  if (this.Obj)
  {
    var p = this.Obj.parentNode;
    var inDOM = false;
    while (p && !inDOM)
    {
      inDOM = (p==document.body);
      p = p.parentNode;
    }
    //
    if (inDOM && RD3_TooltipManager.IsObjVisible(this.Obj))
    {
      var deltaTop =  RD3_Glb.GetScreenTop(this.Obj, true) - this.LastObjTop;
      var deltaLeft = RD3_Glb.GetScreenLeft(this.Obj, true) - this.LastObjLeft;
      //
      // Se l'oggetto non si e' spostato ... non faccio nulla
      if (deltaTop==0 && deltaLeft==0)
        return;
      //
      // Se il tooltip era a chiusura programmata
      if (this.DelayHide > 0)
      {
        // Lo chiudo subito
        this.Deactivate();
        return;
      }
      //
      // Riapro il tooltip nella nuova posizione
      this.LastObjTop += deltaTop;
      this.LastObjLeft += deltaLeft;
      this.AnchorX += deltaLeft;
      this.AnchorY += deltaTop;
      this.Activate();
    }
    else
    {
      // L'oggetto non e' piu' nel DOM
      this.Deactivate();
    }
  }
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
MessageTooltip.prototype.OnAdaptRetina = function(w, h, par)
{
  if (this.ImgObj)
  {
    this.ImgObj.width = w;
    this.ImgObj.height = h; 
	  this.ImgObj.style.display = "";
  }
}

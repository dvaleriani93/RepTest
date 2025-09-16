// ************************************
// Pro Gamma Instant Developer
// D&D javascript library
// (c) 1999-2007 Pro Gamma Srl
// all rights reserved
// www.progamma.com
// ************************************

var DragObjects = new Array(0);   // Elenco oggetti draggabili
var DropObjects = new Array(0);   // Elenco oggetti su cui può essere droppato un oggetto
var TranObjects = new Array(0);   // Elenco oggetti Trasformabili
var ChgdArrays = false;           // Se uguale a TRUE indica che gli array sopra sono stati cambiati
var ResBrd = 4;                   // Bordo per oggetti Trasformabili (2 pixel fuori dal bordo)
var MinSize = 5;                  // Minima dimensione (W/H) dell'oggetto
var ChgResMM = 1;                 // Minima variazione (in mm)
var ChgResIN = 0.04;              // Minima variazione (in inch)
var StartX = 0;                   // Coordinate di inizio (MouseDown)
var StartY = 0;                   // Coordinate di inizio (MouseDown)
var HitObj = null;                // Oggetto sotto al mouse
var DropDst = null;               // Oggetto su cui viene droppato il DropSrc
var InitDone = false;
var OffsBorder = 1;               // L'offset che tiene conto dell'HideBorder quando riposiziono gli oggetti
var MoveID = 0;										// Timer per scrolling vicino ai bordi
var UseScrollBar = false;         // Attiva o disattiva lo scrolling tramite scrollbar
var UseBorders   = true;          // Attiva o disattiva lo scrolling vicino ai bordi

// Vecchi eventi di mouse
var OldMouseMove = null;
var OldMouseDown = null;
var OldMouseUp = null;
var OldKeyDown = null;

// **********************************************
// Inizializzazione
// **********************************************
function Init()
{
  if (!InitDone)
  {
    OldMouseMove = document.body.onmousemove; document.body.onmousemove = OnMouseMove;
    OldMouseDown = document.body.onmousedown; document.body.onmousedown = OnMouseDown;
    OldMouseUp = document.body.onmouseup; document.body.onmouseup = OnMouseUp;
    OldKeyDown = document.body.onkeydown; document.body.onkeydown = OnKeyDown;
    //
    InitDone = true;
  }
}

// **********************************************
// Elimino dall'elenco degli oggetti draggabili quelli che mi
// arriveranno tra poco grazie all'RD. Devo eliminare tutti
// gli oggetti che "appartengono" al frame ID fornito
// **********************************************
function ResetDD(FrmID)
{
  var l = DragObjects.length;
  for (i=0; i<l; i++)
  {
    if (DragObjects[i] && (FrmID=='' || DragObjects[i].id.indexOf(FrmID)==0))
    {
      DragObjects[i] = null;
      ChgdArrays = true;
    }
  }
  //
  l = DropObjects.length;
  for (i=0; i<l; i++)
  {
    if (DropObjects[i] && (FrmID=='' || DropObjects[i].id.indexOf(FrmID)==0))
    {
      DropObjects[i] = null;
      ChgdArrays = true;
    }
  }
  //
  l = TranObjects.length;
  for (i=0; i<l; i++)
  {
    if (TranObjects[i] && (FrmID=='' || TranObjects[i].id.indexOf(FrmID)==0))
    {
      TranObjects[i] = null;
      ChgdArrays = true;
    }
  }
}

// **********************************************
// Compatto i 3 array eliminando gli oggetti nulli (annullati dalla ResetDD sopra)
// **********************************************
function EndResetDD()
{
  // Se gli array non sono stati cambiati... ho già finito
  if (!ChgdArrays)
    return;
  //
  // Gli array sono stati cambiati... devo compattarli
  ChgdArrays = false;
  //
  var OldDragObjects = DragObjects;
  var OldDropObjects = DropObjects;
  var OldTranObjects = TranObjects;
  //
  DragObjects = new Array(0);
  DropObjects = new Array(0);
  TranObjects = new Array(0);
  //
  var l = OldDragObjects.length;
  for (i=0; i<l; i++)
  {
    var obj = OldDragObjects[i];
    if (obj!=null)
      DragObjects[DragObjects.length] = obj;
  }
  //
  l = OldDropObjects.length;
  for (i=0; i<l; i++)
  {
    var obj = OldDropObjects[i];
    if (obj!=null)
      DropObjects[DropObjects.length] = obj;
  }
  //
  l = OldTranObjects.length;
  for (i=0; i<l; i++)
  {
    var obj = OldTranObjects[i];
    if (obj!=null)
      TranObjects[TranObjects.length] = obj;
  }
  //
  OldDragObjects = null;
  OldDropObjects = null;
  OldTranObjects = null;
}

// **********************************************
// Aggiunta oggetti Drag/Drop/Transform
// **********************************************
function AddDrag(obj)
{
  Init();
  //
  CalcLayout(obj);
  obj.drgbl = true;
  obj.ondragstart = OnDragStart;
  DragObjects[DragObjects.length] = obj;
}
function AddDrop(obj)
{
  Init();
  //
  CalcLayout(obj);
  obj.drpbl = true;
  obj.ondragstart = OnDragStart;
  DropObjects[DropObjects.length] = obj;
}
function AddTrans(obj)
{
  Init();
  //
  CalcLayout(obj);
  obj.transbl = true;
  obj.ondragstart = OnDragStart;
  TranObjects[TranObjects.length] = obj;
}
function CalcLayout(obj)
{
  // Memorizzo le coordinate originali relative dell'oggetto rispetto al padre
  obj.relorgx = obj.offsetLeft;
  obj.relorgy = obj.offsetTop;
  //
  // Calcolo e memorizzo le coordinate assolute (rispetto alla BookPage) in PX
  var p = obj;
  obj.absorgx = (obj.parentNode.className=='bookpage'?0:1);
  obj.absorgy = (obj.parentNode.className=='bookpage'?0:1);
  while (p.className!='bookcont')
  {
    obj.absorgx += p.offsetLeft;
    obj.absorgy += p.offsetTop;
    p = p.offsetParent;
  }
  //
  // Memorizzo le dimensioni originali
  obj.orgw = obj.style.pixelWidth;
  obj.orgh = obj.style.pixelHeight;
  //
  // Memorizzo le coordinate e dimensioni originali in UM definite a design time (es: mm, in)
  obj.orgxum = obj.style.left;
  obj.orgyum = obj.style.top;
  obj.orgwum = obj.style.width;
  obj.orghum = obj.style.height;
  //
  obj.orgum = obj.orgxum.substring(obj.orgxum.length-2, obj.orgxum.length);
}
function OnDragStart()
{
  // Blocco ogni eventuale D&D che parte del browser
  return false;
}

// **********************************************
// Evidenzia (e ripristina) l'oggetto sorgente (quello che si muove o viene draggato)
// **********************************************
function HLDDSrc(obj)
{
  // Nascondo per un attimo l'oggetto (così posso spostarlo liberamente nel DOM)
  obj.style.visibility = 'hidden';
  //
  obj.OldFilter = obj.style.filter;
  obj.style.filter = 'Alpha(opacity=60)';
  //
  obj.OldzIndex = obj.style.zIndex;
  obj.style.zIndex = 1000;
  //
  // Memorizzo gli eventuali delta dovuti a scrollbar
  obj.OldScrollx = 0;
  obj.OldScrolly = 0;
  var el = obj;
  while (el && el.className!='bookpage')
  {
    obj.OldScrollx += (el.scrollLeft ? el.scrollLeft : 0);
    obj.OldScrolly += (el.scrollTop ? el.scrollTop : 0);
    el = el.parentNode;
  }
  //
  // Sottraggo le eventuali scrollbar dalle coordinate assolute dell'oggetto
  obj.absorgx -= obj.OldScrollx;
  obj.absorgy -= obj.OldScrolly;
  //
  // Memorizzo il vecchio parent e sposto l'oggetto nella BookPage (così si può muovere liberamente)
  obj.OldParent = obj.parentNode;
  var bp = GetBookPage(obj);
  obj.parentNode.removeChild(obj);
  bp.insertBefore(obj);
  //
  // Sposto l'oggetto alle coordinate originali assolute
  obj.style.pixelLeft = obj.absorgx;
  obj.style.pixelTop = obj.absorgy;
  //
  // Ricalcolo le coordinate e dimensioni originali in UM definite a design time (es: mm, in)
  obj.orgxum = obj.style.left;
  obj.orgyum = obj.style.top;
  //
  // Ripristino al visibilità dell'oggetto
  obj.style.visibility = 'inherit';
}
function ResDDSrc(obj, repos)
{
  obj.style.filter = obj.OldFilter;
  obj.style.zIndex = obj.OldzIndex;
  ApplyCursor(obj, 'default');
  //
  // Rimetto l'oggetto nella posizione originale nel DOM
  if (repos)
  {
    obj.OldParent.insertBefore(obj);
    //
    obj.style.pixelLeft = obj.relorgx;
    obj.style.pixelTop = obj.relorgy;
    //
    // Ripristino le coordinate assolute dell'oggetto sommando il vecchio offset
    // dovuto alle scrollbar
    obj.absorgx += obj.OldScrollx;
    obj.absorgy += obj.OldScrolly;
  }
  //
  obj.OldScrollx = 0;
  obj.OldScrolly = 0;
}

// **********************************************
// Evidenzia (e ripristina) l'oggetto destinazione (quello su cui è possibile droppare)
// **********************************************
function HLDDDst(obj)
{
  obj.OldClassName = obj.className;
  obj.className = 'DDDstDiv';
  //
  obj.OldzIndex = obj.style.zIndex;
  obj.style.zIndex = 999;
}
function ResDDDst(obj)
{
  obj.className = obj.OldClassName;
  obj.style.zIndex = obj.OldzIndex;
}

// **********************************************
// Evidenzia (e ripristina) l'oggetto in fase di trasformazione
// **********************************************
function HLTSrc(obj)
{
  // Nascondo per un attimo l'oggetto (così posso spostarlo liberamente nel DOM)
  obj.style.visibility = 'hidden';
  //
  obj.OldClassName = obj.className;
  obj.className = 'DDTranDiv';
  obj.OldzIndex = obj.style.zIndex;
  obj.style.zIndex = 999;
  //
  // Memorizzo gli eventuali delta dovuti a scrollbar
  obj.OldScrollx = 0;
  obj.OldScrolly = 0;
  var el = obj;
  while (el && el.className!='bookpage')
  {
    obj.OldScrollx += (el.scrollLeft ? el.scrollLeft : 0);
    obj.OldScrolly += (el.scrollTop ? el.scrollTop : 0);
    el = el.parentNode;
  }
  //
  // Sottraggo le eventuali scrollbar dalle coordinate assolute dell'oggetto
  obj.absorgx -= obj.OldScrollx;
  obj.absorgy -= obj.OldScrolly;
  //
  // Memorizzo il vecchio parent e sposto l'oggetto nella BookPage (così si può muovere liberamente)
  obj.OldParent = obj.parentNode;
  var bp = GetBookPage(obj);
  obj.parentNode.removeChild(obj);
  bp.insertBefore(obj);
  //
  // Sposto l'oggetto alle coordinate originali assolute
  obj.style.pixelLeft = obj.absorgx;
  obj.style.pixelTop = obj.absorgy;
  //
  // Ricalcolo le coordinate e dimensioni originali in UM definite a design time (es: mm, in)
  obj.orgxum = obj.style.left;
  obj.orgyum = obj.style.top;
  //
  // Ripristino al visibilità dell'oggetto
  obj.style.visibility = 'inherit';
}
function ResTSrc(obj, repos)
{
  obj.className = obj.OldClassName;
  obj.style.zIndex = obj.OldzIndex;
  ApplyCursor(obj, 'default');
  //
  if (repos)
  {
    // Rimetto l'oggetto nella posizione originale nel DOM
    obj.OldParent.insertBefore(obj);
    //
    // Se l'oggetto si poteva muovere... ricalcolo le coordinate originali
    // dato che potrebbe essere stato mosso
    if (obj.CanMove)
    {
      // Ho rimesso l'oggetto nella sua vecchia posizione nel DOM... sottraggo l'offset del padre
      var p = obj.OldParent;
      var xoldpar=0;
      var yoldpar=0;
      while (p.className!='bookcont')
      {
        xoldpar += p.offsetLeft;
        yoldpar += p.offsetTop;
        p = p.offsetParent;
      }
      //
      // Queste sono le coordinate assolute (quando l'oggetto era ancora al top del DOM)
      obj.absorgx = obj.style.pixelLeft;
      obj.absorgy = obj.style.pixelTop;
      //
      // Queste sono ora le sue coordinate relative (sottraggo gli offset di tutti i padri)
      obj.relorgx = obj.absorgx - xoldpar;
      obj.relorgy = obj.absorgy - yoldpar;
      //
      // Sposto l'oggetto alle sue nuove coordinate relative
      obj.style.pixelLeft = obj.relorgx;
      obj.style.pixelTop = obj.relorgy;
    }
    else // L'oggetto non si poteva muovere... aggiorno la sua posizione
    {
      obj.style.pixelLeft = obj.relorgx;
      obj.style.pixelTop = obj.relorgy;
      //
      // Ripristino le coordinate assolute dell'oggetto sommando il vecchio offset
      // dovuto alle scrollbar
      obj.absorgx += obj.OldScrollx;
      obj.absorgy += obj.OldScrolly;
    }
  }
  //
  obj.OldScrollx = 0;
  obj.OldScrolly = 0;
}

// **********************************************
// Ritorna TRUE se l'oggetto è figlio del book
// **********************************************
function IsBookChild(obj)
{
  while (obj!=null)
  {
    if (obj && obj.className=='bookpage')
      return true;
    obj = obj.parentNode;
  }
  return false;
}

// **********************************************
// Ritorna l'oggetto BookPage partendo dall'oggetto indicato
// **********************************************
function GetBookPage(obj)
{
  while (obj!=null && obj.className!='bookpage')
    obj = obj.parentNode;
  return obj;
}

// **********************************************
// Eventi gestione del mouse
// **********************************************
function OnMouseDown(evento)
{
	evento = window.event ? window.event : evento;
	//
	// Simulo un mousemove per "validare" l'eventuale HitObj
	if (HitObj)
  	OnMouseMove(evento);
	//
  // Se c'è un oggetto sotto al cursore
  if (HitObj)
  {
    // Mi interessano solo i DIV
    var evobj = window.event ? evento.srcElement : evento.target;
    //
    if (evobj.tagName=='SPAN' || evobj.tagName=='INPUT' || evobj.tagName=='TEXTAREA' || evobj.tagName=='IMG')
      evobj = evobj.parentNode;
    //
    // Inizio operazione. Il cursore è relativo al BODY mentre le mie coordinate sono relative alla pagina... 
    // sottraggo l'offset della pagina dalle coordinate del cursore
    var bp = GetBookPage(evobj);
    if (bp)
    {
    	if (HitObj.drgbl)
    	{
	      if (bp.parentNode.currentStyle.padding != "0px")
	      	OffsBorder = 4;
	      else
	      	OffsBorder = 1;
	    }
    	if (HitObj.transbl)
    	{
    		OffsBorder = 0;
	    }
      //
      StartX = evento.clientX - bp.parentNode.offsetLeft + OffsBorder;
      StartY = evento.clientY - bp.parentNode.offsetTop + OffsBorder;
      //
      // Tengo conto delle eventuali scrollbar
      var scrollx = 0;
      var scrolly = 0;
      var el = evobj;
      while (el)
      {
        scrollx += (el.scrollLeft ? el.scrollLeft : 0);
        scrolly += (el.scrollTop ? el.scrollTop : 0);
        el = el.parentNode;
      }
      //
      // Aggiorno il cursore e comunico l'inizio della relativa operazione
      UpdCursor(StartX+scrollx, StartY+scrolly, true);
      //
      // Se l'oggetto può essere tirato/mosso/trasformato lo evidenzio
      if (HitObj.CanDrag)
        HLDDSrc(HitObj);
      else if (HitObj.CanMove || HitObj.CanRszNW || HitObj.CanRszN || HitObj.CanRszNE || HitObj.CanRszE || HitObj.CanRszSE || HitObj.CanRszS || HitObj.CanRszSW || HitObj.CanRszW)
        HLTSrc(HitObj);
      //
      // Se al momento non ci sono scrollbar di pagina... non le faccio apparire durante il D&D
      bp.OldOverflowX = '';
      bp.OldOverflowY = '';
      if (GetStyleProp(bp,"overflowX")!='hidden' && bp.scrollWidth==bp.offsetWidth)
      {
        bp.OldOverflowX = GetStyleProp(bp,"overflowX");
        bp.style.overflowX = 'hidden';
      }
      if (GetStyleProp(bp,"overflowY")!='hidden' && bp.scrollHeight==bp.offsetHeight)
      {
        bp.OldOverflowY = GetStyleProp(bp,"overflowY");
        bp.style.overflowY = 'hidden';
      }
      //
      // Chiamo subito Mouse Move...
      OnMouseMove(evento);
    }
    else
    {
      // Avevo un HitObj ma l'oggetto che scatena l'evento di OnMouseDown non è più un figlio di un book...
      // Meglio annullare l'oggetto selezionato
      ApplyCursor(HitObj, 'default');
      HitObj.CanDrag = false;
      HitObj.CanMove = false;
      HitObj.CanRszNW = HitObj.CanRszN = HitObj.CanRszNE = HitObj.CanRszE = HitObj.CanRszSE = HitObj.CanRszS = HitObj.CanRszSW = HitObj.CanRszW = false;
      //
      HitObj = null;
    }
  }
  else
  {
    // Nessuna operazione
    StartX = 0;
    StartY = 0;
    defaultStatus = '';
  }
  //
  if (OldMouseDown) OldMouseDown();
}
function OnMouseMove(evento)
{
	evento = window.event ? window.event : evento;
	//
	if (MoveID!=0)
	{
		clearInterval(MoveID);
		MoveID=0;
	}
	//
  // Mi interessano solo i DIV
  var evobj = window.event ? evento.srcElement : evento.target;
  if (evobj.tagName=='SPAN' || evobj.tagName=='INPUT' || evobj.tagName=='TEXTAREA' || evobj.tagName=='IMG')
    evobj = evobj.parentNode;
  //
  // Se l'oggetto che scatena il MouseMove è figlio del book... allora proseguo
  if (IsBookChild(evobj))
  {
    // Il cursore è relativo al BODY mentre le mie coordinate sono relative alla pagina... sottraggo l'offset
    // della pagina dalle coordinate del cursore
    var bp = GetBookPage(evobj);
    var curx = evento.clientX - bp.parentNode.offsetLeft;
    var cury = evento.clientY - bp.parentNode.offsetTop;
    //
    // Tengo conto delle eventuali scrollbar
    var scrollx = 0;
    var scrolly = 0;
    var el = evobj;
    while (el)
    {
      scrollx += (el.scrollLeft ? el.scrollLeft : 0);
      scrolly += (el.scrollTop ? el.scrollTop : 0);
      el = el.parentNode;
    }
    //
    // Se c'è una azione già avviata
    if ((StartX || StartY) && HitObj!=null)
    {    	    	
      // Calcolo gli spostamenti dall'inizio dell'operazione
      var deltaX = curx - StartX;
      var deltaY = cury - StartY;
      //
      // Gestione Full Resize
      if (HitObj.CanRszNW || HitObj.CanRszW || HitObj.CanRszSW) 
      {
        deltaX = -deltaX;
        if (HitObj.CanRszW) deltaY = 0;
        if (HitObj.orgw+deltaX >= MinSize)
        {
          HitObj.style.pixelLeft = (HitObj.OldParent?HitObj.absorgx:HitObj.relorgx) - deltaX;
          HitObj.style.pixelWidth = HitObj.orgw + deltaX;
        }
      }
      if (HitObj.CanRszNE || HitObj.CanRszE || HitObj.CanRszSE)
      {
        if (HitObj.CanRszW) deltaY = 0;
        if (HitObj.orgw+deltaX >= MinSize)
          HitObj.style.pixelWidth = HitObj.orgw + deltaX;
      }
      if (HitObj.CanRszNW || HitObj.CanRszN || HitObj.CanRszNE)
      {
        deltaY = -deltaY;
        if (HitObj.CanRszN) deltaX = 0;
        if (HitObj.orgh+deltaY >= MinSize)
        {
          HitObj.style.pixelTop = (HitObj.OldParent?HitObj.absorgy:HitObj.relorgy) - deltaY;
          HitObj.style.pixelHeight = HitObj.orgh + deltaY;
        }
      }
      if (HitObj.CanRszSW || HitObj.CanRszS || HitObj.CanRszSE)
      {
        if (HitObj.CanRszS) deltaX = 0;
        if (HitObj.orgh+deltaY >= MinSize)
          HitObj.style.pixelHeight = HitObj.orgh + deltaY;
      }
      //
      // Se può essere mosso/draggato
      if (HitObj.CanMove || HitObj.CanDrag)
      {
        // Lo muovo
        HitObj.style.pixelLeft = (HitObj.OldParent?HitObj.absorgx:HitObj.relorgx) + deltaX;
        HitObj.style.pixelTop = (HitObj.OldParent?HitObj.absorgy:HitObj.relorgy) + deltaY;
        //
        // Se può essere draggato
        if (HitObj.CanDrag)
        {
          // Vediamo se c'è un oggetto sotto di me (scarto me stesso)
          var dobj = HitTest(curx+scrollx, cury+scrolly, HitObj);
          if (dobj && dobj.drpbl)
          {
            // Se è cambiato dall'ultima volta
            if (DropDst!=dobj)
            {
              // Ripristino lo stato del vecchio oggetto
              if (DropDst)
                ResDDDst(DropDst);
              //
              // Cambio cursore ed evidenzio l'oggetto su cui posso droppare
              DropDst = dobj;
              ApplyCursor(HitObj, 'hand');
              //
              // Evidenzio il nuovo oggetto
              HLDDDst(DropDst);
            }
          }
          else  // Nessun oggetto (o nessun oggetto droppabile)
          {
            // Se c'era un vecchio oggetto droppabile... lo ripristino
            if (DropDst)
            {
              ResDDDst(DropDst);
              DropDst = null;
            }
            //
            // Drop non permesso
            ApplyCursor(HitObj, 'not-allowed');
          }
        }
      }
      //
      // Aggiorno la Status Bar
      var mod = '';
      if (evento.ctrlKey)
        mod = ' (Copy)';
      else if (evento.shiftKey)
        mod = ' (Link)';
      //
      var Res = (HitObj.orgum=='mm' ? 1/ChgResMM : 1/ChrResIN);
      if (HitObj.CanMove)
      {
        var x1 = Math.round(parseFloat(HitObj.orgxum)*Res)/Res;
        var y1 = Math.round(parseFloat(HitObj.orgyum)*Res)/Res;
        var x2 = Math.round(parseFloat(HitObj.style.left)*Res)/Res;
        var y2 = Math.round(parseFloat(HitObj.style.top)*Res)/Res;
        dx = Math.round((x2-x1)*Res)/Res;
        dy = Math.round((y2-y1)*Res)/Res;
        //
        defaultStatus = 'Moving from (X='+x1+HitObj.orgum+', Y='+y1+HitObj.orgum+') to (X='+x2+HitObj.orgum+', Y='+y2+HitObj.orgum+')  dX='+dx+HitObj.orgum+', dY='+dy+HitObj.orgum;
      }
      else if (HitObj.CanRszNW || HitObj.CanRszN || HitObj.CanRszNE || HitObj.CanRszE || HitObj.CanRszSE || HitObj.CanRszS || HitObj.CanRszSW || HitObj.CanRszW)
      {
        var w1 = Math.round(parseFloat(HitObj.orgwum)*Res)/Res;
        var h1 = Math.round(parseFloat(HitObj.orghum)*Res)/Res;
        var w2 = Math.round(parseFloat(HitObj.style.width)*Res)/Res;
        var h2 = Math.round(parseFloat(HitObj.style.height)*Res)/Res;
        dw = Math.round((w2-w1)*Res)/Res;
        dh = Math.round((h2-h1)*Res)/Res;
        //
        defaultStatus = 'Resizing from (W='+w1+HitObj.orgum+', H='+h1+HitObj.orgum+') to (W='+w2+HitObj.orgum+', H='+h2+HitObj.orgum+')  dW='+dw+HitObj.orgum+', dH='+dh+HitObj.orgum;
      }
      else if (HitObj.CanDrag)
      {
      	defaultStatus = 'Dragging object ' + mod;
      }
     	//
	    // Vediamo se sono vicino alle scrollbar
	    if (UseBorders)
	    {
		    var bc = bp.parentNode;
		    curx = evento.clientX - bc.offsetLeft + document.body.scrollLeft;
		    cury = evento.clientY - bc.offsetTop + document.body.scrollTop;
		    if (bc.scrollHeight>bc.offsetHeight)
		    {
		  		var oy = bc.scrollTop;
		  		// Sopra o sotto?	  		
		  		if (cury<12)
		  		{
			  		bc.scrollTop -= 8;
			  		MoveID = setInterval("ScrollaBC('" + bc.id + "', 0, -12)",20);
			  	}
			  	if (cury>bc.clientHeight-12)
			  	{
			  		bc.scrollTop += 8;
			  		MoveID = setInterval("ScrollaBC('" + bc.id + "', 0, 12)",20);
			  	}
			  	//
		  		StartY -= (bc.scrollTop)-oy;
		    }
		    if (bc.scrollWidth>bc.offsetWidth)
		    {
		  		var ox = bc.scrollLeft;
		  		// Sopra o sotto?	  		
		  		if (curx<12)
		  		{
			  		bc.scrollLeft -= 8;
			  		MoveID = setInterval("ScrollaBC('" + bc.id + "', -12, 0)",20);
			  	}
			  	if (curx>bc.clientWidth-12)
			  	{
			  		bc.scrollLeft += 8;
			  		MoveID = setInterval("ScrollaBC('" + bc.id + "', 12, 0)",20);
			  	}
			  	//
		  		StartX -= (bc.scrollLeft)-ox;
		    }
		  }
    }
    else  // Nessuna operazione in corso: cerco un eventuale oggetto sotto al cursore
    {
      // Se avevo un oggetto selezionato... lo deseleziono
      if (HitObj)
      {
        ApplyCursor(HitObj, 'default');
        HitObj.CanDrag = false;
        HitObj.CanMove = false;
        HitObj.CanRszNW = HitObj.CanRszN = HitObj.CanRszNE = HitObj.CanRszE = HitObj.CanRszSE = HitObj.CanRszS = HitObj.CanRszSW = HitObj.CanRszW = false;
        //
        HitObj = null;
      }
      //
      // Se l'oggetto sotto al cursore è uno di quelli "interessanti"
      if (evobj.drgbl || evobj.transbl)
      {
        // Se è draggabile... controllo se il mouse è sopra una delle sue scrollbars
        if (evobj.drgbl)
        {
          var o = window.event ? evento.srcElement : evento.target;
          //
          // Se c'è una scrollbar e sono sopra di lei... scarto l'oggetto trovato
          if ((GetStyleProp(o,"overflowY")!='hidden' && o.scrollHeight>o.offsetHeight && curx>evobj.absorgx+evobj.orgw-20) ||
              (evobj && GetStyleProp(o,"overflowX")!='hidden' && o.scrollWidth!=o.offsetWidth && cury>evobj.absorgy+evobj.orgh-20))
          {          
            evobj = null;
          }
        }
        //
        // Questo è l'oggetto interessante!
        if (evobj!=null)
        {
          HitObj = evobj;
          //
          // Tengo conto delle scrollbar dell'oggetto
          while (evobj)
          {
            curx += (evobj.scrollLeft ? evobj.scrollLeft : 0);
            cury += (evobj.scrollTop ? evobj.scrollTop : 0);
            evobj = evobj.parentNode;
          }
          //
          // Aggiorno il cursore
          UpdCursor(curx, cury, false);
        }
      }
    }
  }
  else
  {
 		if ((evobj.className == "FrmContent" || evobj.className == "bookcont") && (StartX!=0 || StartY!=0) && UseScrollBar)
 		{
 			try
 			{
	 			// Sono sulle scrollbar
	 			var bc = (evobj.className == "FrmContent")?evobj.getElementsByTagName("DIV")[0]:evobj;  	
	 			if (bc.className == "bookcont")
	 			{
			    var curx = window.event.clientX - bc.offsetLeft + document.body.scrollLeft;
			    var cury = window.event.clientY - bc.offsetTop + document.body.scrollTop;
			    //
			  	if (bc.scrollHeight>bc.offsetHeight && curx>bc.offsetWidth-18)
			  	{
			  		var p1 = ((bc.scrollTop+0.0+bc.offsetHeight/2) / bc.scrollHeight) * bc.offsetHeight;
			  		var oy = bc.scrollTop;
			  		// Sopra o sotto?	  		
			  		if (cury>p1)
				  		bc.scrollTop += 8;
				  	else
				  		bc.scrollTop -= 8;
				  	//
			  		StartY -= (bc.scrollTop)-oy;
			  	}
			  	if (bc.scrollWidth>bc.offsetWidth && cury>bc.offsetHeight-18)
			  	{
			  		var p1 = ((bc.scrollLeft+0.0+bc.offsetWidth/2) / bc.scrollWidth) * bc.offsetWidth;
			  		var ox = bc.scrollLeft;
			  		// Destra o sinistra?	  		
			  		if (curx>p1)
				  		bc.scrollLeft += 8;
				  	else
				  		bc.scrollLeft -= 8;
				  	//
				  	StartX -= (bc.scrollLeft)-ox;
			  	}
			 	}
			}
			catch(ex)
			{
			}
	  }
	}
  //
  if (OldMouseMove) 
  	OldMouseMove();
}
function OnMouseUp(undo)
{
	var frd = GetFrame(window.parent.frames,'RD');
	var frm = GetFrame(window.parent.frames,'Main');
	var clicked = false;
	//
  // Se c'è un oggetto selezionato ed un'operazione in corso
  if (HitObj && (StartX || StartY))
  {
    var objMoved = false;
    //
    // Se non è l'Abort dell'operazione corrente
    var bp = GetBookPage(window.event.srcElement);
    if (!undo)
    {
      // Se l'oggetto è cambiato
      // Devo tenere conto dell'offset fra bookpage e bookcont
      var lx = (HitObj.OldParent?HitObj.absorgx:HitObj.relorgx);
      var ax = HitObj.style.pixelLeft + OffsBorder;
      var ly = (HitObj.OldParent?HitObj.absorgy:HitObj.relorgy);
      var ay = HitObj.style.pixelTop + OffsBorder;      
      //
      if (lx!=ax || ly!=ay || HitObj.orgw!=HitObj.style.pixelWidth || HitObj.orgh!=HitObj.style.pixelHeight)
      {
        // Segnalo che l'oggetto è stato mosso e la richiesta inviata al server
        objMoved = true;
        //
        // Comunico l'operazione e aggiorno le coordinate/dimensioni originali
        if (HitObj.CanMove || HitObj.CanRszNW || HitObj.CanRszN || HitObj.CanRszNE || HitObj.CanRszE || HitObj.CanRszSE || HitObj.CanRszS || HitObj.CanRszSW || HitObj.CanRszW)
        {
          // Estraggo lo stato dei modificatori
          if (frm)
          {
            frm.SK = window.event.shiftKey;
          	frm.CK = window.event.ctrlKey;
          	frm.AK = window.event.altKey;
          }
          //
          if (frd)
          {
            // Invio solo le quantità modificate
            var Res = (HitObj.orgum=='mm' ? 1/ChgResMM : 1/ChrResIN);
            //
            var lex = HitObj.style.pixelLeft;
            var tox = HitObj.style.pixelTop;
            var wix = HitObj.style.pixelWidth;
            var hex = HitObj.style.pixelHeight;
            //
            var le = HitObj.style.left;
            var to = HitObj.style.top;
            var wi = HitObj.style.width;
            var he = HitObj.style.height;
            //
            var x=(lex!=(HitObj.OldParent?HitObj.absorgx:HitObj.relorgx) ? Math.round(parseFloat(le)*Res)/Res : '');
            var y=(tox!=(HitObj.OldParent?HitObj.absorgy:HitObj.relorgy) ? Math.round(parseFloat(to)*Res)/Res : '');
            var w=(wix!=HitObj.orgw ? Math.round(parseFloat(wi)*Res)/Res : '');
            var h=(hex!=HitObj.orgh ? Math.round(parseFloat(he)*Res)/Res : '');
            //
            frd.pb('WCI=IWForm&WCE=DD:T:' + HitObj.id + ':' + x + ':' + y + ':' + w + ':' + h);
          }
        }
      }
      else
      {
      	// Ho cliccato e lasciato nello stesso posto, vediamo se devo essere attivato
      	try
      	{
	      	var ati = HitObj.getElementsByTagName('INPUT')[0];
	      	ati.click();
	      	clicked = true;
	      }
	      catch(ex)
	      {
	      }
      }
      //
      // Se poteva essere draggato
      if (HitObj.CanDrag)
      {
        // Se era stato trovato un oggetto droppabile su cui droppare
        if (DropDst && DropDst.drpbl && !clicked)
        {
          // Segnalo che l'oggetto è stato mosso e la richiesta inviata al server
          objMoved = true;
          //
          // Estraggo lo stato dei modificatori
          if (frm)
          {
            frm.SK = window.event.shiftKey;
          	frm.CK = window.event.ctrlKey;
          	frm.AK = window.event.altKey;
          }
          //
          if (frd)
            frd.pb('WCI=IWForm&WCE=DD:D:' + HitObj.id + ':' + DropDst.id);
        }
        else
        {
          // Riporto l'oggetto alle coordinate iniziali
          HitObj.style.pixelLeft = (HitObj.OldParent?HitObj.absorgx:HitObj.relorgx) - OffsBorder;
          HitObj.style.pixelTop = (HitObj.OldParent?HitObj.absorgy:HitObj.relorgy) - OffsBorder;
        }
      }
      else
      {
        if (HitObj.orgw != HitObj.style.pixelWidth) HitObj.orgw = HitObj.style.pixelWidth;
        if (HitObj.orgh != HitObj.style.pixelHeight) HitObj.orgh = HitObj.style.pixelHeight;
      }
    }
    else  // UNDO: ripristino le coordinate dell'oggetto
    {
      HitObj.style.pixelLeft = (HitObj.OldParent?HitObj.absorgx:HitObj.relorgx) - OffsBorder;
      HitObj.style.pixelTop = (HitObj.OldParent?HitObj.absorgy:HitObj.relorgy) - OffsBorder;
      if (HitObj.style.pixelWidth != HitObj.orgw) HitObj.style.pixelWidth = HitObj.orgw;
      if (HitObj.style.pixelHeight != HitObj.orgh) HitObj.style.pixelHeight = HitObj.orgh;
      //
      // Ripristino la visibilità delle scrollbars
      if (bp.OldOverflowX!='') bp.style.overflowX = bp.OldOverflowX;
      if (bp.OldOverflowY!='') bp.style.overflowY = bp.OldOverflowY;
      bp.OldOverflowX = '';
      bp.OldOverflowY = '';
    }
    //
    // Svuoto la selezione (c'è sempre qualcosa che rimane selezionato!)
    var oldfoc = document.activeElement;
    if (bp) bp.focus();
    //
    // La BP.focus() sposta le scrollbar posizionandole a 0,0...
    // La NextRD() le posizionerebbe correttamente le scrollbar ma
    // questa arriva troppo tardi... dopo che il server ha risposto...
    // Intanto le posiziono qui... poi verranno nuovamente riposizionate
    ApplyPANScr();
    //
    document.selection.clear();
    //
    // L'oggetto non è stato mosso... provo a conservare il fuoco su di lui
    if (!objMoved && oldfoc)
      oldfoc.focus();
  }
  //
  // Pronto per una nuova operazione
  StartX = 0;
  StartY = 0;
  defaultStatus = "";
  //
  if (HitObj)
  {
    if (HitObj.CanDrag)
      ResDDSrc(HitObj, undo);
    else if (HitObj.CanMove || HitObj.CanRszNW || HitObj.CanRszN || HitObj.CanRszNE || HitObj.CanRszE || HitObj.CanRszSE || HitObj.CanRszS || HitObj.CanRszSW || HitObj.CanRszW)
      ResTSrc(HitObj, true);
    //
    // Fine dell'operazione
    HitObj.CanDrag = false;
    HitObj.CanMove = false;
    HitObj.CanRszNW = HitObj.CanRszN = HitObj.CanRszNE = HitObj.CanRszE = HitObj.CanRszSE = HitObj.CanRszS = HitObj.CanRszSW = HitObj.CanRszW = false;
    //
    ApplyCursor(HitObj, 'default');
    //
    HitObj = null;
  }
  if (DropDst)
  {
    ResDDDst(DropDst);
    DropDst = null;
  }
  //
  if (OldMouseUp) OldMouseUp();
}

function OnKeyDown(evento)
{
	evento = window.event ? window.event : evento;
	//	
  // ESC = Abort operation
	if (evento.keyCode==27)
	  OnMouseUp(true);
	//
	if (OldKeyDown) 
		OldKeyDown();
}

// **********************************************
// Verifica se alle coordinate indicate è disponibile 
// un oggetto che può accettare un drag
// **********************************************
function HitTest(x, y, notobj)
{
  var i, l;
  //
  l = DropObjects.length;
  for (i=0; i<l; i++)
  {
    var obj = DropObjects[i];
    if (obj!=notobj && ((x>=obj.absorgx && x<=obj.absorgx+obj.orgw) && (y>=obj.absorgy && y<=obj.absorgy+obj.orgh)))
      return obj;
  }
  //
  return null;
}

// **********************************************
// Aggiorna il cursore corrente (Start indica se questa
// richiesta coincide con l'avvio di un'operazione)
// **********************************************
function UpdCursor(x, y, start)
{
  HitObj.style.cursor = 'default';
  //
  // Se l'oggetto è trasformabile
  if (HitObj.transbl)
  {
    // Calcolo quale operazione è permessa
    if ((x>=HitObj.absorgx-ResBrd && x<=HitObj.absorgx+ResBrd) && (y>=HitObj.absorgy-ResBrd && y<=HitObj.absorgy+ResBrd))
    {
      HitObj.style.cursor = 'nw-resize';
      HitObj.CanRszNW = start;
    }
    else if ((x>=HitObj.absorgx+ResBrd && x<=HitObj.absorgx+HitObj.orgw-ResBrd) && (y>=HitObj.absorgy-ResBrd && y<=HitObj.absorgy+ResBrd))
    {
      HitObj.style.cursor = 'n-resize';
      HitObj.CanRszN = start;
    }
    else if ((x>=HitObj.absorgx+HitObj.orgw-ResBrd && x<=HitObj.absorgx+HitObj.orgw+ResBrd) && (y>=HitObj.absorgy-ResBrd && y<=HitObj.absorgy+ResBrd))
    {
      HitObj.style.cursor = 'ne-resize';
      HitObj.CanRszNE = start;
    }
    else if ((x>=HitObj.absorgx+HitObj.orgw-ResBrd && x<=HitObj.absorgx+HitObj.orgw+ResBrd) && (y>=HitObj.absorgy+ResBrd && y<=HitObj.absorgy+HitObj.orgh-ResBrd))
    {
      HitObj.style.cursor = 'e-resize';
      HitObj.CanRszE = start;
    }
    else if ((x>=HitObj.absorgx+HitObj.orgw-ResBrd && x<=HitObj.absorgx+HitObj.orgw+ResBrd) && (y>=HitObj.absorgy+HitObj.orgh-ResBrd && y<=HitObj.absorgy+HitObj.orgh+ResBrd))
    {
      HitObj.style.cursor = 'se-resize';
      HitObj.CanRszSE = start;
    }
    else if ((x>=HitObj.absorgx+ResBrd && x<=HitObj.absorgx+HitObj.orgw-ResBrd) && (y>=HitObj.absorgy+HitObj.orgh-ResBrd && y<=HitObj.absorgy+HitObj.orgh+ResBrd))
    {
      HitObj.style.cursor = 'n-resize';
      HitObj.CanRszS = start;
    }
    else if ((x>=HitObj.absorgx-ResBrd && x<=HitObj.absorgx+ResBrd) && (y>=HitObj.absorgy+HitObj.orgh-ResBrd && y<=HitObj.absorgy+HitObj.orgh+ResBrd))
    {
      HitObj.style.cursor = 'sw-resize';
      HitObj.CanRszSW = start;
    }
    else if ((x>=HitObj.absorgx-ResBrd && x<=HitObj.absorgx+ResBrd) && (y>=HitObj.absorgy+ResBrd && y<=HitObj.absorgy+HitObj.orgh-ResBrd))
    {
      HitObj.style.cursor = 'e-resize';
      HitObj.CanRszW = start;
    }
  }
  //
  if (HitObj.style.cursor == 'default')
  {
    // Se è draggabile ha la priorità rispetto al Muovibile (Trasformabile)
    if (HitObj.drgbl)
    {
      HitObj.style.cursor = 'move';
      HitObj.CanDrag = start;
    }
    else if (HitObj.transbl && (x>=HitObj.absorgx+ResBrd && x<=HitObj.absorgx+HitObj.orgw-ResBrd) && 
                               (y>=HitObj.absorgy+ResBrd && y<=HitObj.absorgy+HitObj.orgh-ResBrd))
    {
      // Se non è draggabile ma è muovibile
      HitObj.style.cursor = 'move';
      HitObj.CanMove = start;
    }
  }
  //
  // Propago il cursore a tutti i miei figli
  ApplyCursor(HitObj, HitObj.style.cursor);
}

// **********************************************
// Applica il cursore all'oggetto e a tutti i suoi figli
// **********************************************
function ApplyCursor(obj, curs)
{
  obj.style.cursor = curs;
  //
  var i;
  var c = obj.childNodes;
  var l = c.length;
  for (i=0; i<l; i++)
    c[i].style.cursor = HitObj.style.cursor;
}


// **********************************************
// Scrolla l'oggetto selezionato
// **********************************************
function ScrollaBC(objid, deltaX, deltaY)
{
	var bc = document.getElementById(objid);
	if (bc!=null)
	{
		var oy = bc.scrollTop;
		var ox = bc.scrollLeft;
		bc.scrollTop += deltaY;
		bc.scrollLeft += deltaX;
		StartY -= (bc.scrollTop)-oy;
		StartX -= (bc.scrollLeft)-ox;
		if (HitObj!=null && (HitObj.CanDrag || HitObj.CanMove))
		{
			HitObj.style.pixelLeft += (bc.scrollLeft)-ox;
			HitObj.style.pixelTop += (bc.scrollTop)-oy;
		}
	}
}

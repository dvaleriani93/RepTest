// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe VisAttrObj: Rappresenta uno degli stili
// visuali dell'applicazione
// ************************************************

function VisAttrObj()
{
  // Proprieta' di questo oggetto di modello
  this.Alignments = new Array();        // Array degli allineamenti
  this.BorderTypes = new Array();       // Array dei tipi di bordo
  this.Color = new Array();             // Array dei colori
  this.Font = new Array();              // Array dei font 
  this.CustomColors = new Array();      // Array dei colori dei custom borders
  this.CustomWidth = new Array();       // Array delle larghezze dei custom borders
  this.CustomType = new Array();        // Array dei tipi dei custom borders
  this.CustomPadding = new Array();     // Array dei padding dei custom borders
  this.GradColor = new Array();         // Array dei colori finali dei gradienti
  this.GradDir = new Array();           // Array delle direzioni dei gradienti
  this.Opacity = new Array();           // Array delle opacita'
  this.ContrType = -1;                  // 
  this.Cursor = -1;                     // Stringa di definizione del cursore
  this.Mask = -1;                       // Maschera del Visual Style
  this.RowOffset = -1;                  // Spazio tra le righe
  this.HeaderOffset = -1;               // Spazio tra l'intestazione e la prima riga
  this.Flags = -1;                      // Flag del Visual Style
  this.LetterSpacing = -1;              // Spazi tra le lettere
  this.WordSpacing = -1;                // Spazi tra le parole
  this.HorizontalScale = -1;            // Scaling orizzontale
  this.Derived = null;                  // Visual Style padre
  this.Identifier = "";                 // Identificatore di questo oggetto
  this.iShowHTML = null;                // I campi devono mostrare i tag HTML?
  this.iClassName = null;               // ClassName aggiuntivo
  this.iClassHeader = null;             // ClassName aggiuntivo (da usare in maniera specifica per gli Header dei campi)
  //
  this.iProto = null;                   // Il prototipo di CELLA (pannelli) da clonare per velocizzarne la creazione
  //
  this.iBoxProto = null;                // Il prototipo di ELEMENT (box) da clonare per velocizzarne la creazione
  this.iBoxProtoCollection=new Array(); // Gli oggetti prototipo pronti per l'uso
  this.iBoxProtoQty = 0;                // Quanti oggetti prototipo devono essere preparati
  this.iBoxProtoPtr = 0;                // Puntatore al prototipo da restituire
}


// *******************************************************************
// Inizializza questo VisAttrObj leggendo i dati da un nodo <vis> XML
// *******************************************************************
VisAttrObj.prototype.LoadFromXml = function(node) 
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
VisAttrObj.prototype.ChangeProperties = function(node)
{
  // Normale cambio di proprieta'
  this.LoadProperties(node);
  //
  // Il prototipo non e' piu' buono
  this.iProto = null;
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
VisAttrObj.prototype.LoadProperties = function(node)
{
  // Inizializzo le proprieta' ciclando su tutti gli attributi del VisualStyle
  var attrlist = node.attributes;
  var n = attrlist.length;
  //
  for (var i = 0; i < n; i++) 
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    var index = 0;
    if (nome.length > 3)
    {
      index = parseInt(nome.substring(3, nome.length));
      nome = nome.substring(0,3);
    }
    //
    switch(nome)
    {
      case "con" : this.SetContrType(parseInt(valore)); break;
      case "msk" : this.SetMask(valore); break;
      case "cur" : this.SetCursor(valore); break;
      case "off" : this.SetRowOffset(parseInt(valore)); break;
      case "hof" : this.SetHeaderOffset(parseInt(valore)); break;
      case "fla" : this.SetFlag(parseInt(valore)); break;
      case "les" : this.SetLetterSpacing(parseInt(valore)); break;
      case "wos" : this.SetWordSpacing(parseInt(valore)); break;
      case "hor" : this.SetHorizontalScale(parseInt(valore)); break;
      case "der" : this.SetDerived(parseInt(valore)); break;
      case "cln" : this.SetClassName(valore); break;
      case "clh" : this.SetClassHeader(valore); break;
      
      case "ali" : this.SetAlignment(parseInt(valore), index); break;
      case "bor" : this.SetBorderType(parseInt(valore), index); break;
      case "col" : this.SetColor(valore, index); break;
      case "fon" : this.SetFont(valore, index); break;
      case "ccl" : this.SetCustomColor(valore, index); break;
      case "cwd" : this.SetCustomWidth(parseInt(valore), index); break;
      case "cty" : this.SetCustomType(parseInt(valore), index); break;
      case "cpd" : this.SetCustomPadding(parseInt(valore), index); break;
      case "gco" : this.SetGradientColor(valore, index); break;
      case "gdi" : this.SetGradientDirection(parseInt(valore), index); break;
      case "opa" : this.SetOpacity(parseInt(valore),index); break;
      
      case "id" : this.SetIdentifier(valore); break;
    }
  }
}


// ***********************************************************
// Setter delle proprieta'
// ***********************************************************
VisAttrObj.prototype.SetContrType = function(value) 
{
  this.ContrType = value;
}


VisAttrObj.prototype.SetMask = function(value) 
{
  this.Mask = value;
  this.iShowHTML = null;
}


VisAttrObj.prototype.SetCursor = function(value) 
{
  this.Cursor = value;
}


VisAttrObj.prototype.SetRowOffset = function(value) 
{
  this.RowOffset = value;
}


VisAttrObj.prototype.SetHeaderOffset = function(value) 
{
  this.HeaderOffset = value;
}


VisAttrObj.prototype.SetFlag = function(value) 
{
  this.Flags = value;
}


VisAttrObj.prototype.SetLetterSpacing = function(value) 
{
  this.LetterSpacing = value;
}


VisAttrObj.prototype.SetWordSpacing = function(value) 
{
  this.WordSpacing = value;   
}


VisAttrObj.prototype.SetHorizontalScale = function(value) 
{
  this.HorizontalScale = value;
}


VisAttrObj.prototype.SetDerived = function(value) 
{
  this.Derived = value;
}


VisAttrObj.prototype.SetAlignment = function(value, index) 
{
  this.Alignments[index] = value;
}


VisAttrObj.prototype.SetBorderType = function(value, index) 
{
  this.BorderTypes[index] = value;
}


VisAttrObj.prototype.SetColor = function(value, index) 
{
  this.Color[index] = value;
}


VisAttrObj.prototype.SetFont = function(value, index) 
{
  this.Font[index] = value;
}


VisAttrObj.prototype.SetCustomColor = function(value, index) 
{
  this.CustomColors[index] = value;
}


VisAttrObj.prototype.SetCustomWidth = function(value, index) 
{
  this.CustomWidth[index] = value;
}


VisAttrObj.prototype.SetCustomType = function(value, index) 
{
  this.CustomType[index] = value;
}


VisAttrObj.prototype.SetCustomPadding = function(value, index) 
{
  this.CustomPadding[index] = value;
}


VisAttrObj.prototype.SetGradientColor = function(value, index) 
{
  this.GradColor[index] = value;
}


VisAttrObj.prototype.SetGradientDirection = function(value, index) 
{
  this.GradDir[index] = value;
}


VisAttrObj.prototype.SetOpacity = function(value, index) 
{
  this.Opacity[index] = value;
}


VisAttrObj.prototype.SetIdentifier = function(value) 
{
  this.Identifier = value;
  RD3_DesktopManager.ObjectMap.add(value,this);
}


VisAttrObj.prototype.SetClassName = function(value) 
{
  this.iClassName = value;
}

VisAttrObj.prototype.SetClassHeader = function(value) 
{
  this.iClassHeader = value;
}


// ********************************************************************************
// La realizzazione di un Visual Style serve ad impostare la catena di derivazione
// ********************************************************************************
VisAttrObj.prototype.Realize = function()
{
  // Se la proprieta' Derived e' diversa da null leggo dalla mappa degli oggetti il VisAttrObj padre
  if (this.Derived!=null && !this.Derived.Identifier)
  {
    if (this.Derived>=0)
      this.Derived = RD3_DesktopManager.ObjectMap["vis:" + this.Derived];
  }
}


// ********************************************************************************
// Rimuove l'oggetto dalla mappa degli oggetti
// ********************************************************************************
VisAttrObj.prototype.Unrealize = function()
{
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
}


// ********************************************************
// Restituisce l'allineamento specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetAlignment = function(ali) 
{
  var al = this.Alignments[ali];
  if (al==null) al=-1; // valore di default
  //
  // Se e' ereditato leggo l'allineamento del padre
  if (al == -1 && this.Derived)
  {
    al = this.Derived.GetAlignment(ali);
    this.Alignments[ali] = al;
  }
  //
  return al;
}

// ********************************************************
// Restituisce il bordo specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetBorders = function(border) 
{
  var bor = this.BorderTypes[border];
  if (bor==null) bor=-1; // valore di default
  //
  // Se e' ereditato leggo il bordo del padre
  if (bor == -1 && this.Derived)
  {
    bor = this.Derived.GetBorders(border);
    this.BorderTypes[border] = bor;
  }
  //
  return bor;
}

// ********************************************************
// Restituisce il colore specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetColor = function(colorid) 
{
  var col = this.Color[colorid];
  if (col==null) col=-2; // valore di default
  //
  // Se e' ereditato leggo il colore del padre
  if (col == -2 && this.Derived) 
  {
    col = this.Derived.GetColor(colorid);
    this.Color[colorid] = col;
  }
  //
  return col;
}

// ********************************************************
// Restituisce il font specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetFont = function(fontid) 
{
  var font = this.Font[fontid];
  if (font==null) font=-1; // valore di default
  //
  // Se e' ereditato leggo il font del padre
  if (font == -1 && this.Derived) 
  {
    font = this.Derived.GetFont(fontid);
    this.Font[fontid] = font;
  }
  //
  return font;
}

// ********************************************************
// Restituisce il custom color specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetCustomColor = function(customborder) 
{
  // Il valore di default non viene mandato dal server, percio' se nell'array c'e' una cella nulla
  // devo valutare il valore di default, che e' -2 se questo visual style e' derived e 13684944 altrimenti
  var ccol = this.CustomColors[customborder];
  if (ccol == null)
    ccol = this.Derived ? -2 : '#D0D0D0';
  //
  // Se e' ereditato leggo il valore del padre
  if (ccol == -2) 
  {
    ccol = this.Derived.GetCustomColor(customborder);
    this.CustomColors[customborder] = ccol;
  }
  // 
  return ccol;
}

// ********************************************************
// Restituisce il custom width specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetCustomWidth = function(customborder)
{
  // Il valore di default non viene mandato dal server, percio' se nell'array c'e' una cella nulla
  // devo valutare il valore di default, che e' -1 se questo visual style e' derived e 1 altrimenti
  var cwid = this.CustomWidth[customborder];
  if (cwid == null)
    cwid = this.Derived ? -1 : 1;
  //
  // Se e' ereditato leggo il valore del padre
  if (cwid == -1) 
  {
    cwid = this.Derived.GetCustomWidth(customborder);
    this.CustomWidth[customborder] = cwid;
  }
  //
  return cwid;
}

// ********************************************************
// Restituisce il custom type specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetCustomType = function(customborder) 
{
  // Il valore di default non viene mandato dal server, percio' se nell'array c'e' una cella nulla
  // devo valutare il valore di default, che e' -1 se questo visual style e' derived e 1 altrimenti
  var ctyp = this.CustomType[customborder];
  if (ctyp == null)
    ctyp = this.Derived ? -1 : 1;
  //
  // Se e' ereditato leggo il valore del padre
  if (ctyp == -1)
  {
    ctyp = this.Derived.GetCustomType(customborder);
    this.CustomType[customborder] = ctyp;
  }
  //
  return ctyp;
}

// ********************************************************
// Restituisce il custom type specificato del Visual Style
// Decodificato come style del border
// ********************************************************
VisAttrObj.prototype.GetCustomStyle = function(customborder) 
{
  var t = this.GetCustomType(customborder);
  switch(t)
  {
    case 1: // VISCTYP_SOLID
      return "solid";
    case 2: // VISCTYP_DOTTED
      return "dotted";      
    case 3: // VISCTYP_DASHED
      return "dashed";      
    case 4: // VISCTYP_DOUBLE
      return "double";      
  }
  return "none";
}


// ********************************************************
// Restituisce il custom padding specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetCustomPadding = function(customborder) 
{
  // Il valore di default non viene mandato dal server, percio' se nell'array c'e' una cella nulla
  // devo valutare il valore di default, che e' -1 se questo visual style e' derived e 1 altrimenti
  var cpad = this.CustomPadding[customborder];
  if (cpad == null)
    cpad = this.Derived ? -1 : 1;
  //
  // Se e' ereditato leggo il valore del padre
  if (cpad == -1) 
  {
    cpad = this.Derived.GetCustomPadding(customborder);
    this.CustomPadding[customborder] = cpad;
  }
  //
  return cpad;
}

// ********************************************************
// Restituisce il grad color specificato del Visual Style
// ********************************************************
VisAttrObj.prototype.GetGradColor = function(colorid) 
{
  var grad = this.GradColor[colorid];
  if (grad==null) grad=-1; // valore di default
  //
  // Se e' ereditato leggo il valore del padre
  if (grad == -1 && this.Derived) 
  {
    grad = this.Derived.GetGradColor(colorid);
    this.GradColor[colorid] = grad;
  }
  //
  return grad;
}

// ********************************************************
// Restituisce la grad dir specificata del Visual Style
// ********************************************************
VisAttrObj.prototype.GetGradDir = function(colorid) 
{
  // Il valore di default non viene mandato dal server, percio' se nell'array c'e' una cella nulla
  // devo valutare il valore di default, che e' -1 se questo visual style e' derived e 1 altrimenti
  var gdir = this.GradDir[colorid];
  if (gdir == null)
    gdir = this.Derived ? -1 : 1;
  //
  // Se e' ereditato leggo il valore del padre
  if (gdir == -1) 
  {
    gdir = this.Derived.GetGradDir(colorid);
    this.GradDir[colorid] = gdir;
  }
  //
  return gdir;
}

// ********************************************************
// Restituisce l'opacita specificata del Visual Style
// ********************************************************
VisAttrObj.prototype.GetOpacity = function(colorid) 
{
  // Il valore di default non viene mandato dal server, percio' se nell'array c'e' una cella nulla
  // devo valutare il valore di default, che e' -1 se questo visual style e' derived e 100 altrimenti
  var op = this.Opacity[colorid];
  if (op == null)
    op = this.Derived ? -1 : 100;
  //
  // Se e' ereditato leggo il valore del padre
  if (op == -1) 
  {
    op = this.Derived.GetOpacity(colorid);
    this.Opacity[colorid] = op;
  }
  //
  return op;
}

// ********************************************************
// Restituisce il Contr Type del Visual Style
// ********************************************************
VisAttrObj.prototype.GetContrType = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.ContrType == -1 && this.Derived) 
    this.ContrType = this.Derived.GetContrType();
  //
  return this.ContrType;
}

// ********************************************************
// Restituisce la Mask del Visual Style
// ********************************************************
VisAttrObj.prototype.GetMask = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.Mask == -1 && this.Derived) 
    this.Mask = this.Derived.GetMask();
  //
  return this.Mask;
}


// ********************************************************
// Restituisce la Cursor del Visual Style
// ********************************************************
VisAttrObj.prototype.GetCursor = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.Cursor == -1 && this.Derived) 
    this.Cursor = this.Derived.GetCursor();
  //
  return this.Cursor;
}

// ********************************************************
// Restituisce il rowOffset del Visual Style
// ********************************************************
VisAttrObj.prototype.GetRowOffset = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.RowOffset == -1 && this.Derived) 
    this.RowOffset = this.Derived.GetRowOffset();
  //
  return this.RowOffset;
}

// ********************************************************
// Restituisce il HeaderOffset del Visual Style
// ********************************************************
VisAttrObj.prototype.GetHeaderOffset = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.HeaderOffset == -1 && this.Derived) 
    this.HeaderOffset = this.Derived.GetHeaderOffset();
  //
  return this.HeaderOffset;
}

// ********************************************************
// Restituisce i flag del Visual Style
// ********************************************************
VisAttrObj.prototype.GetFlags = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.Flags == -1 && this.Derived) 
    this.Flags = this.Derived.GetFlags();
  //
  return this.Flags;
}

// ********************************************************
// Restituisce il letter spacing del Visual Style
// ********************************************************
VisAttrObj.prototype.GetLetterSpacing = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.LetterSpacing == -1 && this.Derived) 
    this.LetterSpacing = this.Derived.GetLetterSpacing();
  //
  return this.LetterSpacing;
}

// ********************************************************
// Restituisce il word spacing del Visual Style
// ********************************************************
VisAttrObj.prototype.GetWordSpacing = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.WordSpacing == -1 && this.Derived) 
    this.WordSpacing = this.Derived.GetWordSpacing();
  //
  return this.WordSpacing;
}

// ********************************************************
// Restituisce l'horizontal scale del Visual Style
// ********************************************************
VisAttrObj.prototype.GetHorizontalScale = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.HorizontalScale == -1 && this.Derived) 
    this.HorizontalScale = this.Derived.GetHorizontalScale();
  //
  return this.HorizontalScale;
}

// ********************************************************
// Restituisce la Classe del Visual Style
// ********************************************************
VisAttrObj.prototype.GetClassName = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.iClassName == null && this.Derived) 
    this.iClassName = this.Derived.GetClassName();
  //
  return this.iClassName;
}

// ********************************************************
// Restituisce la Classe del Visual Style relativa agli Header
// ********************************************************
VisAttrObj.prototype.GetClassHeader = function() 
{
  // Se e' ereditato leggo il valore del padre
  if (this.iClassHeader == null && this.Derived) 
    this.iClassHeader = this.Derived.GetClassHeader();
  //
  return this.iClassHeader;
}

// ***********************************************************
// Applico questo stile alla box di un book
// se alt=true usa sfondo righe alternate
// aa: allineamento di default
// ***********************************************************
VisAttrObj.prototype.ApplyStyle = function(divobj, alt, aa, bcDyn, fcDyn, fmDyn, mkDyn, forceHyper)
{
  // Firma del VS.
  var apDyn = fcDyn + "|" + fmDyn + "|" + mkDyn;
  var vsign = this.Identifier + "*" + (alt?"1":"0") + "$" + bcDyn + "|" + apDyn;
  //
  // Controllo se a questo oggetto era gia' stato applicato il visual style con gli stessi parametri
  // Questo serve per velocizzare le operazioni
  var asign = divobj.getAttribute("vsign");
  if (asign==vsign)
    return;
  //
  var onlyback = false;
  //
  if (asign)
  {
    var bsign = asign.substr(0,asign.indexOf("*"));
    var csign = vsign.substr(0,vsign.indexOf("*"));
    onlyback = (bsign == csign);
    //
    // Se mi sembra di dover cambiare solo lo sfondo, controllo la parte dinamica
    if (onlyback)
    {
      // Devo cambiare solo lo sfondo se il resto della parte dinamica (a parte lo sfondo dinamico) coincide
      var abc = asign.substr(asign.indexOf("$") + 1);
      abc = abc.substr(abc.indexOf("|")+1);
      onlyback = (abc == apDyn);
    }
  }
  //
  divobj.setAttribute("vsign", vsign);

  var s = divobj.style;
  var bidx = (alt)?5:4; // VISCLR_BACKVALUE = 4; VISCLR_ALTVALUE = 5;
  var bc = this.GetColor(bidx);
  var gf = this.GetGradColor(bidx);
  var gd = this.GetGradDir(bidx);
  //
  // Se e' stato fornito un BackColor dinamico applico quello
  if (bcDyn != undefined && bcDyn != "")
    bc = bcDyn;
  //
  // Colore di sfondo
  if ("INPUT-TEXTAREA".indexOf(divobj.tagName)==-1)
  {
    if (alt && bc=="transparent")
      bc = this.GetColor(4); // VISCLR_BACKVALUE
    if (alt && gd==1 && gf==-1)
    {
      gf = this.GetGradColor(4);  // VISCLR_BACKVALUE
      gd = this.GetGradDir(4);    // VISCLR_BACKVALUE
    }
    //
    // Se non c'e' un gradiente
    if (gd<=1)  // VISGRADDIR_NONE
      s.backgroundColor = bc;
  }
  //
  // Opacita' di sfondo
  var opa = this.GetOpacity(bidx);
  if (opa<100)
    s.filter = "Alpha(opacity="+opa+")";
  else if (s.removeAttribute)
    s.removeAttribute('filter');
  s.opacity = opa/100;
  //
  // Gradiente di sfondo
  if (gd>1 && bc!="transparent" && gf!=-1) // VISGRADDIR_NONE
  {
    if (RD3_Glb.IsIE(10, false))
    {
      s.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType="+(gd==2?1:0)+",StartColorStr="+bc+",EndColorStr="+gf+")";
      //
      // Se non c'e' un colore di sfondo lo metto comunque... 
      // altrimenti IE non gestisce il click sul div perche' lo crede trasparente!
      if (divobj.tagName=="DIV")
        s.backgroundColor = bc;
    }
    else if (RD3_Glb.IsWebKit())
    {
      s.backgroundColor = "transparent";
      s.background = "-webkit-gradient(linear, " + (gd==2? "left center, right center" : "center top, center bottom") + ", from("+bc+"), to("+gf+"))";
    }
    else if (RD3_Glb.IsFirefox())
    {
      s.background = "-moz-linear-gradient(" + (gd==2? "left" : "top") + ", "+bc+", "+gf+")";
    }
    else if (RD3_Glb.IsIE(10, true))
    {
      s.background = "linear-gradient(" + (gd==2? "90deg" : "180deg") + ", "+bc+", "+gf+")";
    }
  }
  else
  {
    if (RD3_Glb.IsIE(10, false))
    {
      if (s.filter.indexOf("progid:DXImageTransform.Microsoft.Gradient") >= 0)
        s.removeAttribute("filter");
    }
    else if (RD3_Glb.IsWebKit())
    {
      if (s.background.indexOf("-webkit-gradient") >= 0)
        s.background = bc;
    }
    else if (RD3_Glb.IsFirefox() || RD3_Glb.IsIE(10, true))
    {
      if (s.background.indexOf("linear-gradient") >= 0)
        s.background = bc;
    }
  }
  //
  // Solo colore di sfondo? Me ne vado...
  if (onlyback)
    return;  
  //
  // Allineamento del valore VISALI_VALUE=1
  var ali = aa?aa:"left";
  switch(this.GetAlignment(1))
  {
    case 2: // VISALN_SX
      ali = "left";
    break;
    
    case 3: // VISALN_CX
      ali = "center";
    break;

    case 4: // VISALN_DX
      ali = "right";
    break;
    
    case 5: // VISALN_JX
      ali = "justify";
    break;
  }
  //
  s.textAlign = ali;
  //
  // Mascheratura
  var m = this.GetMask();
  //
  // Se e' stata fornita una Mask dinamica applico quella
  if (mkDyn != undefined && mkDyn != "")
    m = mkDyn;
  //
  if (m==">")
    s.textTransform = "uppercase";
  else if (m=="<")
    s.textTransform = "lowercase";
  else
    s.textTransform = "";
  //
  // Cursore
  var cur = this.GetCursor();
  if (cur!="")
    RD3_Glb.ApplyCursor(divobj,cur);
  //
  // Se era una box cliccabile, associo la classe per la cliccabilita'
  if (divobj.tagName=="DIV")
  {
	  RD3_Glb.SetClass(divobj, "book-box-clickable", (this.HasHyperLink() || forceHyper) && this.GetContrType()!=RD3_Glb.VISCTRL_BUTTON);
	}
  //
  // Colore del testo
  var fc = this.GetColor(1); // VISCLR_FOREVALUE=1
  //
  // Se e' stato fornito un ForeColor dinamico applico quello
  if (fcDyn != undefined && fcDyn != "")
    fc = fcDyn;
  //
  s.color = fc;
  //
  // Letter spacing
  var ls = this.GetLetterSpacing();
  if (ls>0 || ls<-1)
    s.letterSpacing = (ls/100)+"pt";
  //
  // Letter spacing
  var ws = this.GetWordSpacing();
  if (ws>0 || ws<-1)
    s.wordSpacing = (ws/100)+"pt";
  //
  // Scala orizzontale
  var hs = this.GetHorizontalScale();
  if (hs>0 && hs!=100)
  {
    // Solo IE ha l'horizontal scaling
    if (RD3_Glb.IsIE(10, false))
      s.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+hs/100+")";
  }
  //
  // Bordi
  if ("INPUT-TEXTAREA-SPAN".indexOf(divobj.tagName)==-1)
  {
    var bs = "none";
    var bw = "0px";
    var bc = this.GetColor(11); // VISCLR_BORDERS = 11;
    var bt = this.GetBorders(1);
    var done = false;
    switch(bt)  // VISBDI_VALUE=1
    {
      case 2: // VISBRD_HORIZ = 2;
        s.borderColor = bc;
        s.borderStyle = "solid";
        s.borderTopWidth = "1px";
        s.borderRightWidth = "0px";
        s.borderBottomWidth = "1px";
        s.borderLeftWidth = "0px";
        done = true;
      break;
      case 3: // VISBRD_VERT = 3;
        s.borderColor = bc;
        s.borderStyle = "solid";
        s.borderTopWidth = "0px";
        s.borderRightWidth = "1px";
        s.borderBottomWidth = "0px";
        s.borderLeftWidth = "1px";
        done = true;
      break;
      case 4: // VISBRD_FRAME = 4;
        bs = "solid";
        bw = "1px";
      break;
      case 5: // VISBRD_SUNKEN = 5;
        bs = "inset";
        bw = "2px";      
      break;
      case 6: // VISBRD_RAISED = 6;
        bs = "outset";
        bw = "2px";      
      break;
      case 7: // VISBRD_ETCHED = 7;
        bs = "groove";
        bw = "2px";      
      break;
      case 8: // VISBRD_BUMP = 8;
        bs = "ridge";
        bw = "2px";      
      break;
      case 9: // VISBRD_CUSTOM = 9;
        var pt = 0;
        s.borderTopStyle = this.GetCustomStyle(1); // TOP = 1
        pt = this.GetCustomWidth(1)/4;
        s.borderTopWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
        s.borderTopColor = this.GetCustomColor(1);
        s.paddingTop = (this.GetCustomPadding(1)/4)+"pt"; // Padding in quarti di pt
        s.borderRightStyle = this.GetCustomStyle(2); // RIGHT = 2
        pt = this.GetCustomWidth(2)/4;
        s.borderRightWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
        s.borderRightColor = this.GetCustomColor(2);
        s.paddingRight = (this.GetCustomPadding(2)/4)+"pt"; // Padding in quarti di pt
        s.borderBottomStyle = this.GetCustomStyle(3); // BOTTOM = 3
        pt = this.GetCustomWidth(3)/4;
        s.borderBottomWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
        s.borderBottomColor = this.GetCustomColor(3);
        s.paddingBottom = (this.GetCustomPadding(3)/4)+"pt"; // Padding in quarti di pt
        s.borderLeftStyle = this.GetCustomStyle(4); // LEFT = 4
        pt = this.GetCustomWidth(4)/4;
        s.borderLeftWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
        s.borderLeftColor = this.GetCustomColor(4);
        s.paddingLeft = (this.GetCustomPadding(4)/4)+"pt"; // Padding in quarti di pt
        done = true;
      break;
    }
    //
    if (!done)
      s.border = bw+" "+bs+" "+bc;
  }
  //
  // Infine il font
  var fn = this.GetFont(1); // VISFNT_VALUE
  var fnt = fn.split(",");
  //
  // Se e' stato fornito un FontMod dinamico applico quello
  if (fmDyn != undefined && fmDyn != "")
    fnt[1] = fmDyn;
	//  	
  s.fontFamily = this.ConvertFont(fnt[0]);
  s.fontWeight=(fnt[1].indexOf("B")>-1)?"bold":"normal";
  s.fontStyle=(fnt[1].indexOf("I")>-1)?"italic":"normal";
  var td = "none";
  if (fnt[1].indexOf("U")>-1)
    td = "underline";
  else if (fnt[1].indexOf("S")>-1)
    td = "line-through";    
  s.textDecoration=td;
  s.fontSize = this.ConvertSize(fnt[2]);
  //
  //  Se l'oggetto da stilizzare non contiene la mia classe la aggiungo in fondo
  var myClass = this.GetClassName();
  var vsClass = divobj.getAttribute("vsclass");
  if (vsClass !== myClass)
  {
    // Se un altro VS ha impostato una classe prima di impostare la mia devo togliere quella precedente 
    if (vsClass != "")
      RD3_Glb.RemoveClass2(divobj, vsClass);
    //
    if (myClass && myClass != "")
      RD3_Glb.AddClass(divobj, myClass);
    divobj.setAttribute("vsclass", myClass ? myClass : "");
  }
}


// ***********************************************************
// Applico questo stile alla box di un valore
// sty determina il tipo di stilizzazione da applicare:
// list: true = list, false = form
// hdr:  true = header, false = value
// alt:  true = riga alternata, false = riga normale
// sel:  true = riga selezionata, false = riga normale
// ro:   true = readonly, false = riga normale
// er:   true = riga in errore
// wa:   true = riga in warning
// aa:   allineamento di default
// qbe:  true = stato QBE
// notnull:  true = stile campi obbligatori
// onlyback: true = applicare solo colore di sfondo
// skipvsigncheck: true = non controllare vsign
// button: true = divobj is a button
// ***********************************************************
VisAttrObj.prototype.ApplyValueStyle = function(divobj, list, hdr, alt, sel, ro, er, wa, aa, qbe, notnull, onlyback, skipvsigncheck, button) 
{
  // I pannelli saltano il controllo del VSIGN per ridurre al minimo il numero di accessi al DOM
  // Le celle dei pannelli, infatti, memorizzano lo stato del VS applicato dentro alla cella stessa
  if (!skipvsigncheck)
  {
    // Firma del VS. Nota: LIST, HDR non possono cambiare per lo stesso oggetto
    var vsign = this.GetSign(list, alt, sel, ro, er, wa, aa, qbe, notnull);
    //
    // Controllo se a questo oggetto era gia' stato applicato il visual style con gli stessi parametri
    // Questo serve per velocizzare le operazioni
    var asign = divobj.getAttribute("vsign");
    if (asign==vsign)
      return;
    //
    var onlyback = false;
    //
    if (asign)
    {
      var bsign = asign.substr(0,asign.indexOf("$"));
      var csign = vsign.substr(0,vsign.indexOf("$"));
      onlyback = (bsign == csign);
    }
    //
    divobj.setAttribute("vsign", vsign);
  }
  //
  var s = divobj.style;
  //
  var ancora = true;
  var bc = "";
  var bidx = alt ? 5 : 4; // VISCLR_BACKVALUE : VISCLR_ALTVALUE
  while (ancora)
  {
    ancora = false;
    bidx = alt ? 5 : 4; // VISCLR_BACKVALUE : VISCLR_ALTVALUE
    if (qbe)
      bidx = 14; // VISCLR_BACKQBE
    else if (hdr)
      bidx = (list)? 7 : 17; // VISCLR_BACKHEAD : VISCLR_BACKHEADFORM
    else if (er)
      bidx = 22; // VISCLR_ERRBACK
    else if (wa)
      bidx = 23; // VISCLR_WARNBACK      
    else if (ro)
      bidx = sel ? 16 : (alt? 18 : 15); // VISCLR_HILIGHTREADONLY : VISCLR_ALTREADONLY : VISCLR_BACKREADONLY
    else if (sel)
      bidx = 9; // VISCLR_HILIGHT
    //
    bc = this.GetColor(bidx);
    if (alt && bc=="transparent")
    {
      alt = false;
      ancora = true;
    }
  }
  //
  if (button && bc == "transparent")
  {
    if (s.removeAttribute)
      s.removeAttribute('backgroundColor');
    else
      s.removeProperty('background-color');
  }
  else {
    // Se sono mobile e c'e' un colore applicato tramite proprieta' visuali di campo allora lo applico usando l'important
    if (RD3_Glb.IsMobile() && s.setProperty && this.OldColor && this.OldColor[bidx] !== bc)
      s.setProperty("background-color", bc, "important");
    else
      s.backgroundColor = bc;
  }
  //  
  // Opacita' di sfondo
  var opa = this.GetOpacity(bidx);
  if (opa<100)
    s.filter = "Alpha(opacity="+opa+")";
  else if (s.removeAttribute)
    s.removeAttribute('filter');
  s.opacity = opa/100;
  //
  // Gradiente di sfondo
  var gf = this.GetGradColor(bidx);
  var gd = this.GetGradDir(bidx);
  if (gd>1 && bc!="transparent" && gf!=-1) // VISGRADDIR_NONE
  {
    // Il filtro gradiente viene applicato, ma non alle caption dei pannelli in seattle
    // che usano l'immagine di sfondo. Questo serve per evitare di perdere il cleartype
    if (RD3_Glb.IsIE(10, false))
    {
      if (divobj.className!="panel-field-caption-list" || !RD3_ServerParams.Theme.startsWith("seattle"))
        s.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType="+(gd==2?1:0)+",StartColorStr="+bc+",EndColorStr="+gf+")";
    }
    else if (RD3_Glb.IsWebKit())
    {
      s.background = "-webkit-gradient(linear, " + (gd==2? "left center, right center" : "center top, center bottom") + ", from("+bc+"), to("+gf+"))";
    }
    else if (RD3_Glb.IsFirefox())
    {
      s.background = "-moz-linear-gradient(" + (gd==2? "left" : "top") + ", "+bc+", "+gf+")";
    }
    else if (RD3_Glb.IsIE(10, true))
    {
      s.background = "linear-gradient(" + (gd==2? "90deg" : "180deg") + ", "+bc+", "+gf+")";
    }
  }
  else  // Non e' un gradiente
  {
    if (RD3_Glb.IsIE(10, false))
    {
      if (s.filter.indexOf("progid:DXImageTransform.Microsoft.Gradient") >= 0)
        s.removeAttribute("filter");
    }
    else if (RD3_Glb.IsWebKit())
    {
      if (s.background.indexOf("-webkit-gradient") >= 0)
        s.background = bc;
    }
    else if (RD3_Glb.IsFirefox() || RD3_Glb.IsIE(10, true))
    {
      if (s.background.indexOf("linear-gradient") >= 0)
        s.background = bc;
    }
    // Se sto gestendo l'header in lista e mi hanno fornito un
    // colore di background non trasparente, devo rimuovere il backgroundImage
    // che e' scritto nel CSS
    if ("INPUT-TEXTAREA".indexOf(divobj.tagName)==-1 && hdr && list && s.backgroundColor!="" && s.backgroundColor!="transparent")
      s.backgroundImage = "none";
  }
  //
  // Solo colore di sfondo? Me ne vado...
  if (onlyback)
    return;
  //
  // Allineamento del valore VISALI_VALUE=1
  var aidx = 1;
  if (hdr)
    aidx = (list)?2:3; // VISALI_HDRLIST:VISALI_HDRFORM
  //
  var ali = aa?aa:"left";
  switch(this.GetAlignment(aidx))
  {
    case 2: // VISALN_SX
      ali = "left";
    break;
    
    case 3: // VISALN_CX
      ali = "center";
    break;

    case 4: // VISALN_DX
      ali = "right";
    break;
    
    case 5: // VISALN_JX
      ali = "justify";
    break;
  }
  //
  s.textAlign = ali;
  //
  // Mascheratura
  if (!hdr)
  {
    var m = this.GetMask();
    if (m==">")
      s.textTransform = "uppercase";
    else if (m=="<")
      s.textTransform = "lowercase";
    else
      s.textTransform = "";
  }
  //
  // Cursore
  var cur = this.GetCursor();
  if (cur!="")
    RD3_Glb.ApplyCursor(divobj,cur);
  //
  // Colore del testo
  var fid = 1;  // VISCLR_FOREVALUE
  if (hdr)
    fid = 2; // VISCLR_FOREHEAD
  else if (er)
    fid = 20; // VISCLR_ERRVALUE
  else if (wa)
    fid = 21; // VISCLR_WARNVALUE
  //
  if (notnull)
    fid = 19; // VISCLR_FOREHEADNN
  //
  var fc = this.GetColor(fid);
  //
  if (fc=="transparent")
  {
    // Il colore non era stato specificato, vediamo se ne posso reperire un altro.
    switch(fid)
    {
      case 19: // in caso di header notnull prendo il colore dell'header
        fc = this.GetColor(2);
      break;
      
      case 20:
      case 21: // in caso di errore o warning prendo il colore del testo normale
        fc = this.GetColor(1);
      break;      
    }
  }
  //  
  s.color = fc;
  //
  // Letter spacing
  var ls = this.GetLetterSpacing();
  if (ls>0 || ls<-1)
    s.letterSpacing = (ls/100)+"pt";
  //
  // Letter spacing
  var ws = this.GetWordSpacing();
  if (ws>0 || ws<-1)
    s.wordSpacing = (ws/100)+"pt";
  //
  // Scala orizzontale
  var hs = this.GetHorizontalScale();
  if (hs>0 && hs!=100)
  {
    s.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+hs/100+")";
  }
  //
  // Bordi
  var bs = "none";
  var bw = "0px";
  var bc = this.GetColor(11); // VISCLR_BORDERS = 11;
  var bid = (list)? 1 : 6; // VISBDI_VALUE : VISBDI_VALFORM
  if (hdr)
    bid = (list)? 2 : 4; // VISBDI_HEAD : VISBDI_HDRFORM
  //
  var bt = this.GetBorders(bid);
  var done = false;
  switch(bt)  
  {
    case 2: // VISBRD_HORIZ = 2;
      s.borderColor = bc;
      s.borderStyle = "solid";
      s.borderTopWidth = (list)?"1px":"0px";
      s.borderRightWidth = "0px";
      s.borderBottomWidth = "1px";
      s.borderLeftWidth = "0px";
      done = true;
    break;
    case 3: // VISBRD_VERT = 3;
      s.borderColor = bc;
      s.borderStyle = "solid";
      s.borderTopWidth = "0px";
      s.borderRightWidth = "1px";
      s.borderBottomWidth = "0px";
      s.borderLeftWidth = "1px";
      done = true;
    break;
    case 4: // VISBRD_FRAME = 4;
      bs = "solid";
      bw = "1px";
    break;
    case 5: // VISBRD_SUNKEN = 5;
      bs = "inset";
      bw = "2px";      
    break;
    case 6: // VISBRD_RAISED = 6;
      bs = "outset";
      bw = "2px";      
    break;
    case 7: // VISBRD_ETCHED = 7;
      bs = "groove";
      bw = "2px";      
    break;
    case 8: // VISBRD_BUMP = 8;
      bs = "ridge";
      bw = "2px";      
    break;
    case 9: // VISBRD_CUSTOM = 9;
      var pt = 0;
      s.borderTopStyle = this.GetCustomStyle(1); // TOP = 1
      pt = this.GetCustomWidth(1)/4;
      s.borderTopWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderTopColor = this.GetCustomColor(1);
      s.paddingTop = (this.GetCustomPadding(1)/4)+"pt"; // Padding in quarti di pt
      s.borderRightStyle = this.GetCustomStyle(2); // RIGHT = 2
      pt = this.GetCustomWidth(2)/4;
      s.borderRightWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderRightColor = this.GetCustomColor(2);
      s.paddingRight = (this.GetCustomPadding(2)/4)+"pt"; // Padding in quarti di pt
      s.borderBottomStyle = this.GetCustomStyle(3); // BOTTOM = 3
      pt = this.GetCustomWidth(3)/4;
      s.borderBottomWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderBottomColor = this.GetCustomColor(3);
      s.paddingBottom = (this.GetCustomPadding(3)/4)+"pt"; // Padding in quarti di pt
      s.borderLeftStyle = this.GetCustomStyle(4); // LEFT = 4
      pt = this.GetCustomWidth(4)/4;
      s.borderLeftWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderLeftColor = this.GetCustomColor(4);
      s.paddingLeft = (this.GetCustomPadding(4)/4)+"pt"; // Padding in quarti di pt
      done = true;
    break;
  }
  //
  if (!done)
  {
    if (bs == "none")
    {
      if (button)
      {
        if (s.removeAttribute)
          s.removeAttribute("border");
        else
          s.removeProperty('border');
      }
      else
        s.border = "none";
    }
    else
      s.border = bw+" "+bs+" "+bc;
  }
  //
  // Infine il font
  var fidx;
  if (hdr)
  {
    fidx = 2;   // VISFNT_HEAD
  }
  else
  {
    fidx = 1;   // VISFNT_VALUE
    if (er)
      fidx = 4; // VISFNT_ERR
    else if (wa)
      fidx = 5; // VISFNT_WARN
    else if (notnull)
      fidx = 6; // VISFNT_NOTNULL
  }
  //
  var fn = this.GetFont(fidx); 
  var fnt = fn.split(",");
  s.fontFamily = this.ConvertFont(fnt[0]);
  s.fontWeight=(fnt[1].indexOf("B")>-1)?"bold":"normal";
  s.fontStyle=(fnt[1].indexOf("I")>-1)?"italic":"normal";
  var td = "none";
  if (fnt[1].indexOf("U")>-1)
    td = "underline";
  else if (fnt[1].indexOf("S")>-1)
    td = "line-through";    
  s.textDecoration=td;
  s.fontSize = this.ConvertSize(fnt[2]);
  //
  //  Se l'oggetto da stilizzare non contiene la mia classe la aggiungo in fondo
  var myClass = hdr ? this.GetClassHeader() : this.GetClassName();
  var vsClass = divobj.getAttribute("vsclass");
  if (vsClass !== myClass)
  {
    // Se un altro VS ha impostato una classe prima di impostare la mia devo togliere quella precedente 
    if (vsClass != "")
      RD3_Glb.RemoveClass2(divobj, vsClass);
    //
    if (myClass && myClass != "")
      RD3_Glb.AddClass(divobj, myClass);
    divobj.setAttribute("vsclass", myClass ? myClass : "");
  }
}


// ******************************************************************
// Applico questo stile ad un gruppo
// inlist true indica che devono essere lette le impostazioni 
// riguardanti la lista
// back a true indica di impostare lo sfondo, false non lo imposta
// *****************************************************************
VisAttrObj.prototype.ApplyGroupStyle = function(divobj, inlist, back) 
{
  var s = divobj.style;
  //
  // Colore di sfondo
  if (back)
  {
    var bidx = (inlist)? 8 : 12; // VISCLR_BACKGROUP = 8; VISCLR_BACKGRPFORM = 12;
    var bc = this.GetColor(bidx);
    s.backgroundColor = bc;
  }
  //
  // Opacita' di sfondo
  var opa = this.GetOpacity(bidx);
  if (opa<100)
    s.filter = "Alpha(opacity="+opa+")";
  else if (s.removeAttribute)
    s.removeAttribute('filter');
  s.opacity = opa/100;
  //
  // Gradiente di sfondo
  var gf = this.GetGradColor(bidx);
  var gd = this.GetGradDir(bidx);
  if (gd>1 && bc!="transparent" && gf!=-1) // VISGRADDIR_NONE
  {
    // Il filtro gradiente viene applicato, ma non alle caption dei gruppi in lista in seattle
    // che usano l'immagine di sfondo. Questo serve per evitare di perdere il cleartype
    if (RD3_Glb.IsIE(10, false))
    {
      if (divobj.className!="group-list-box" || !RD3_ServerParams.Theme.startsWith("seattle"))
        s.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType="+(gd==2?1:0)+",StartColorStr="+bc+",EndColorStr="+gf+")";
    }
    else if (RD3_Glb.IsWebKit())
    {
      s.backgroundColor = "transparent";
      s.background = "-webkit-gradient(linear, " + (gd==2? "left center, right center" : "center top, center bottom") + ", from("+bc+"), to("+gf+"))";
    }
    else if (RD3_Glb.IsFirefox())
    {
      s.background = "-moz-linear-gradient(" + (gd==2? "left" : "top") + ", "+bc+", "+gf+")";
    }
    else if (RD3_Glb.IsIE(10, true))
    {
      s.background = "linear-gradient(" + (gd==2? "90deg" : "180deg") + ", "+bc+", "+gf+")";
    }
  }
  else
  {
    if (RD3_Glb.IsIE(10, false))
    {
      if (s.filter.indexOf("progid:DXImageTransform.Microsoft.Gradient") >= 0)
        s.removeAttribute("filter");
    }
    else if (RD3_Glb.IsWebKit())
    {
      if (s.background.indexOf("-webkit-gradient") >= 0)
        s.background = bc;
    }
    else if (RD3_Glb.IsFirefox() || RD3_Glb.IsIE(10, true))
    {
      if (s.background.indexOf("linear-gradient") >= 0)
        s.background = bc;
    }
    // Se sto gestendo l'header in lista e mi hanno fornito un
    // colore di background non trasparente, devo rimuovere il backgroundImage
    // che e' scritto nel CSS
    if (inlist && back && s.backgroundColor!="" && s.backgroundColor!="transparent")
      s.backgroundImage = "none";
  }
  //
  // Allineamento del valore
  var ali = "left";
  var alidx = (inlist) ? 2 : 3 ; // VISALI_HDRLIST = 2; VISALI_HDRFORM = 3
  switch(this.GetAlignment(alidx))
  {
    case 3: // VISALN_CX
      ali = "center";
    break;

    case 4: // VISALN_DX
      ali = "right";
    break;
    
    case 5: // VISALN_JX
      ali = "justify";
    break;
  }
  //
  s.textAlign = ali;
  //
  // Mascheratura
  var m = this.GetMask();
  if (m==">")
    s.textTransform = "uppercase";
  else if (m=="<")
    s.textTransform = "lowercase";
  else
    s.textTransform = "";
  //
  // Colore del testo
  var fcidx = (inlist) ? 3 : 13 ; // VISCLR_FOREGROUP = 3; VISCLR_FOREGRPFORM = 13
  var fc = this.GetColor(fcidx);
  s.color = fc;
  //
  // Letter spacing
  var ls = this.GetLetterSpacing();
  if (ls>0 || ls<-1)
    s.letterSpacing = (ls/100)+"pt";
  //
  // Letter spacing
  var ws = this.GetWordSpacing();
  if (ws>0 || ws<-1)
    s.wordSpacing = (ws/100)+"pt";
  //
  // Scala orizzontale
  var hs = this.GetHorizontalScale();
  if (hs>0 && hs!=100)
  {
    s.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+hs/100+")";
  }
  //
  // Infine il font
  var fn = this.GetFont(3); // VISFNT_GROUP
  var fnt = fn.split(",");
  s.fontFamily = this.ConvertFont(fnt[0]);
  s.fontWeight=(fnt[1].indexOf("B")>-1)?"bold":"normal";
  s.fontStyle=(fnt[1].indexOf("I")>-1)?"italic":"normal";
  s.textDecoration=(fnt[1].indexOf("U")>-1)?"underline":"none";
  s.textDecoration=(fnt[1].indexOf("S")>-1)?"line-through":"none";
  s.fontSize = this.ConvertSize(fnt[2]);
  //
  //  Se l'oggetto da stilizzare non contiene la mia classe la aggiungo in fondo
  var myClass = this.GetClassName();
  var vsClass = divobj.getAttribute("vsclass");
  if (vsClass !== myClass)
  {
    // Se un altro VS ha impostato una classe prima di impostare la mia devo togliere quella precedente 
    if (vsClass != "")
      RD3_Glb.RemoveClass2(divobj, vsClass);
    //
    if (myClass && myClass != "")
      RD3_Glb.AddClass(divobj, myClass);
    divobj.setAttribute("vsclass", myClass ? myClass : "");
  }
}


// ******************************************************************
// Applico questo stile ad un gruppo in lista
// *****************************************************************
VisAttrObj.prototype.ApplyListGroupStyle = function(divobj, firstcell, isinput, aa) 
{
  var s = divobj.style;
  //
  // Colore di sfondo
  // Se e' definito un gradiente applico il colore di destinazione, altrimenti applico il colore di sfondo
  var bidx = 8; // VISCLR_BACKGROUP = 8;
  var gd = this.GetGradDir(bidx);
  //
  if (gd>1) 
  {
    var gf = this.GetGradColor(bidx);
    s.backgroundColor = gf;
  }
  else  // VISGRADDIR_NONE
  {
    var bc = this.GetColor(bidx);
    s.backgroundColor = bc;
  }
  //
  // Opacita' di sfondo
  var opa = this.GetOpacity(bidx);
  if (opa<100)
    s.filter = "Alpha(opacity="+opa+")";
  else if (s.removeAttribute)
    s.removeAttribute('filter');
  s.opacity = opa/100;
  //
  // Bordi
  var bc = this.GetColor(11); // VISCLR_BORDERS = 11;
  //
  var bt = this.GetBorders(1);
  //
  // Forzo il bordo orizzontale (VISBRD_HORIZ = 2;)
  if (!RD3_Glb.IsMobile())
    bt = 2;
  if (bt !=9 && RD3_Glb.IsMobile())
    bt = 2;
  //
  switch(bt)
  { 
    case 2: // VISBRD_HORIZ = 2;
      s.borderColor = bc;
      s.borderStyle = "solid";
      s.borderTopWidth = isinput ? "0px"  : "1px";
      s.borderRightWidth = "0px";
      s.borderBottomWidth = isinput ? "0px"  : "1px";
      s.borderLeftWidth = firstcell ? "1px" : "0px";
    break;
    
    case 9: // VISBRD_CUSTOM = 9;
      var pt = 0;
      s.borderTopStyle = this.GetCustomStyle(1); // TOP = 1
      pt = this.GetCustomWidth(1)/4;
      s.borderTopWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderTopColor = this.GetCustomColor(1);
      s.paddingTop = (this.GetCustomPadding(1)/4)+"pt"; // Padding in quarti di pt
      s.borderRightStyle = this.GetCustomStyle(2); // RIGHT = 2
      pt = this.GetCustomWidth(2)/4;
      s.borderRightWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderRightColor = this.GetCustomColor(2);
      s.paddingRight = (this.GetCustomPadding(2)/4)+"pt"; // Padding in quarti di pt
      s.borderBottomStyle = this.GetCustomStyle(3); // BOTTOM = 3
      pt = this.GetCustomWidth(3)/4;
      s.borderBottomWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderBottomColor = this.GetCustomColor(3);
      s.paddingBottom = (this.GetCustomPadding(3)/4)+"pt"; // Padding in quarti di pt
      s.borderLeftStyle = this.GetCustomStyle(4); // LEFT = 4
      pt = this.GetCustomWidth(4)/4;
      s.borderLeftWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderLeftColor = this.GetCustomColor(4);
      s.paddingLeft = (this.GetCustomPadding(4)/4)+"pt"; // Padding in quarti di pt
    break;
  }
  //
  // Allineamento del valore
  var ali = (isinput || firstcell) ? "left" : (aa ? aa : "left");
  var alidx = 2; // VISALI_HDRLIST = 2;
  switch(this.GetAlignment(alidx))
  {
    case 3: // VISALN_CX
      ali = "center";
    break;

    case 4: // VISALN_DX
      ali = "right";
    break;
    
    case 5: // VISALN_JX
      ali = "justify";
    break;
  }
  //
  s.textAlign = ali;
  //
  // Mascheratura
  var m = this.GetMask();
  if (m==">")
    s.textTransform = "uppercase";
  else if (m=="<")
    s.textTransform = "lowercase";
  else
    s.textTransform = "";
  //
  // Colore del testo
  var fcidx = 3; // VISCLR_FOREGROUP = 3;
  var fc = this.GetColor(fcidx);
  s.color = fc;
  //
  // Letter spacing
  var ls = this.GetLetterSpacing();
  if (ls>0 || ls<-1)
    s.letterSpacing = (ls/100)+"pt";
  //
  // Letter spacing
  var ws = this.GetWordSpacing();
  if (ws>0 || ws<-1)
    s.wordSpacing = (ws/100)+"pt";
  //
  // Scala orizzontale
  var hs = this.GetHorizontalScale();
  if (hs>0 && hs!=100)
  {
    s.filter = "progid:DXImageTransform.Microsoft.Matrix(M11="+hs/100+")";
  }
  //
  // Infine il font
  var fn = this.GetFont(3); // VISFNT_GROUP
  var fnt = fn.split(",");
  s.fontFamily = this.ConvertFont(fnt[0]);
  s.fontWeight=(fnt[1].indexOf("B")>-1)?"bold":"normal";
  s.fontStyle=(fnt[1].indexOf("I")>-1)?"italic":"normal";
  s.textDecoration=(fnt[1].indexOf("U")>-1)?"underline":"none";
  s.textDecoration=(fnt[1].indexOf("S")>-1)?"line-through":"none";
  s.fontSize = this.ConvertSize(fnt[2]);
  //
  //  Se l'oggetto da stilizzare non contiene la mia classe la aggiungo in fondo
  var myClass = this.GetClassName();
  var vsClass = divobj.getAttribute("vsclass");
  if (vsClass !== myClass)
  {
    // Se un altro VS ha impostato una classe prima di impostare la mia devo togliere quella precedente 
    if (vsClass != "")
      RD3_Glb.RemoveClass2(divobj, vsClass);
    //
    if (myClass && myClass != "")
      RD3_Glb.AddClass(divobj, myClass);
    divobj.setAttribute("vsclass", myClass ? myClass : "");
  }
}


// ***********************************************************
// Applico i bordi di questo stile
// sty determina il tipo di stilizzazione da applicare:
// 9  - Form Attiva - Form/Fuori Lista
// 10 - Form Sola Lettura - Form/Fuori Lista
// 11 - Header di un campo in lista 
// 12 - Header di un campo in dettaglio o fuori lista
// 13 - Gruppo fuori lista
// ***********************************************************
VisAttrObj.prototype.ApplyBorderStyle = function(divobj, sty) 
{
  var s = divobj.style;
  //
  // Bordi
  var bs = "none";
  var bw = "0px";
  var bc = this.GetColor(11); // VISCLR_BORDERS = 11;
  var bid = 1 // VISBDI_VALUE=1
  switch (sty)
  {
    case 9  :
    case 10 : bid = 6; break;  // VISBDI_VALFORM
    case 11 : bid = 2; break;  // VISBDI_HEAD
    case 12 : bid = 4; break;  // VISBDI_HDRFORM
    case 13 : bid = 5; break;  // VISBDI_GRPFORM
  }
  var bt = this.GetBorders(bid);
  var done = false;
  switch(bt)  
  {
    case 2: // VISBRD_HORIZ = 2;
      s.borderColor = bc;
      s.borderStyle = "solid";
      s.borderTopWidth = (sty==9 || sty==10 || sty==12)?"0px":"1px";
      s.borderRightWidth = "0px";
      s.borderBottomWidth = (sty==13) ? "0px" : "1px";  // Il bordo orizzontale per i gruppi e' solo sopra
      s.borderLeftWidth = "0px";
      done = true;
    break;
    case 3: // VISBRD_VERT = 3;
      s.borderColor = bc;
      s.borderStyle = "solid";
      s.borderTopWidth = "0px";
      s.borderRightWidth = (sty==13) ? "0px" : "1px"; // Il bordo verticale per i gruppi ha solo la riga sinistra
      s.borderBottomWidth = "0px";
      s.borderLeftWidth = "1px";
      done = true;
    break;
    case 4: // VISBRD_FRAME = 4;
      bs = "solid";
      bw = "1px";
    break;
    case 5: // VISBRD_SUNKEN = 5;
      bs = "inset";
      bw = "2px";      
    break;
    case 6: // VISBRD_RAISED = 6;
      bs = "outset";
      bw = "2px";      
    break;
    case 7: // VISBRD_ETCHED = 7;
      bs = "groove";
      bw = "2px";      
    break;
    case 8: // VISBRD_BUMP = 8;
      bs = "ridge";
      bw = "2px";      
    break;
    case 9: // VISBRD_CUSTOM = 9;
      var pt = 0;
      s.borderTopStyle = this.GetCustomStyle(1); // TOP = 1
      pt = this.GetCustomWidth(1)/4;
      s.borderTopWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderTopColor = this.GetCustomColor(1);
      s.paddingTop = (this.GetCustomPadding(1)/4)+"pt"; // Padding in quarti di pt
      s.borderRightStyle = this.GetCustomStyle(2); // RIGHT = 2
      pt = this.GetCustomWidth(2)/4;
      s.borderRightWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderRightColor = this.GetCustomColor(2);
      s.paddingRight = (this.GetCustomPadding(2)/4)+"pt"; // Padding in quarti di pt
      s.borderBottomStyle = this.GetCustomStyle(3); // BOTTOM = 3
      pt = this.GetCustomWidth(3)/4;
      s.borderBottomWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderBottomColor = this.GetCustomColor(3);
      s.paddingBottom = (this.GetCustomPadding(3)/4)+"pt"; // Padding in quarti di pt
      s.borderLeftStyle = this.GetCustomStyle(4); // LEFT = 4
      pt = this.GetCustomWidth(4)/4;
      s.borderLeftWidth = ((pt<0.75 && pt>0) ? "0.75": pt)+"pt"; // Width in quarti di pt
      s.borderLeftColor = this.GetCustomColor(4);
      s.paddingLeft = (this.GetCustomPadding(4)/4)+"pt"; // Padding in quarti di pt
      done = true;
    break;
  }
  //
  if (!done)
  {
    s.border = bw+" "+bs+" "+bc;
  }
}

// ***********************************************************
// Applico questo stile al campo multi upload
// sty determina il tipo di stilizzazione da applicare:
// hdr:  true = header, false = value
// ***********************************************************
VisAttrObj.prototype.ApplyMUPStyle = function(divobj, hdr) 
{
  var s = divobj.style;
  //
  // VISCLR_BACKHEAD : VISCLR_BACKVALUE
  var bidx = hdr ? 7 : 4;
  //
  var bc = this.GetColor(bidx)
  s.backgroundColor = bc;
  //  
  // Opacita' di sfondo
  var opa = this.GetOpacity(bidx);
  if (opa<100)
    s.filter = "Alpha(opacity="+opa+")";
  else if (s.removeAttribute)
    s.removeAttribute('filter');
  s.opacity = opa/100;
  //
  // Gradiente di sfondo
  var gf = this.GetGradColor(bidx);
  var gd = this.GetGradDir(bidx);
  if (gd>1 && bc!="transparent" && gf!=-1) // VISGRADDIR_NONE
  {
    // Il filtro gradiente viene applicato, ma non alle caption dei pannelli in seattle
    // che usano l'immagine di sfondo. Questo serve per evitare di perdere il cleartype
    if (RD3_Glb.IsIE(10, false))
    {
      if (divobj.className!="panel-field-caption-list" || !RD3_ServerParams.Theme.startsWith("seattle"))
        s.filter = "progid:DXImageTransform.Microsoft.Gradient(GradientType="+(gd==2?1:0)+",StartColorStr="+bc+",EndColorStr="+gf+")";
    }
    else if (RD3_Glb.IsWebKit())
    {
      s.backgroundColor = "transparent";
      s.background = "-webkit-gradient(linear, " + (gd==2? "left center, right center" : "center top, center bottom") + ", from("+bc+"), to("+gf+"))";
    }
    else if (RD3_Glb.IsFirefox())
    {
      s.background = "-moz-linear-gradient(" + (gd==2? "left" : "top") + ", "+bc+", "+gf+")";
    }
    else if (RD3_Glb.IsIE(10, true))
    {
      s.background = "linear-gradient(" + (gd==2? "90deg" : "180deg") + ", "+bc+", "+gf+")";
    }
  }
  else  // Non e' un gradiente
  {
    if (RD3_Glb.IsIE(10, false))
    {
      if (s.filter.indexOf("progid:DXImageTransform.Microsoft.Gradient") >= 0)
        s.removeAttribute("filter");
    }
    else if (RD3_Glb.IsWebKit())
    {
      if (s.background.indexOf("-webkit-gradient") >= 0)
        s.background = bc;
    }
    else if (RD3_Glb.IsFirefox() || RD3_Glb.IsIE(10, true))
    {
      if (s.background.indexOf("linear-gradient") >= 0)
        s.background = bc;
    }
    // Se sto gestendo l'header in lista e mi hanno fornito un
    // colore di background non trasparente, devo rimuovere il backgroundImage
    // che e' scritto nel CSS
    if (hdr && s.backgroundColor!="" && s.backgroundColor!="transparent")
      s.backgroundImage = "none";
  }
  //
  // Colore del testo
  // VISCLR_FOREHEAD : VISCLR_FOREVALUE
  s.color = this.GetColor(hdr ? 2 : 1);
  //
  // Infine il font
  var fidx = (hdr)? 2: 1; // VISFNT_HEAD : VISFNT_VALUE
  var fn = this.GetFont(fidx); 
  var fnt = fn.split(",");
  s.fontFamily = this.ConvertFont(fnt[0]);
  s.fontWeight=(fnt[1].indexOf("B")>-1)?"bold":"normal";
  s.fontStyle=(fnt[1].indexOf("I")>-1)?"italic":"normal";
  var td = "none";
  if (fnt[1].indexOf("U")>-1)
    td = "underline";
  else if (fnt[1].indexOf("S")>-1)
    td = "line-through";    
  s.textDecoration=td;
  s.fontSize = this.ConvertSize(fnt[2]);
  //
  //  Se l'oggetto da stilizzare non contiene la mia classe la aggiungo in fondo
  var myClass = hdr ? this.GetClassHeader() : this.GetClassName();
  var vsClass = divobj.getAttribute("vsclass");
  if (vsClass !== myClass)
  {
    // Se un altro VS ha impostato una classe prima di impostare la mia devo togliere quella precedente 
    if (vsClass != "")
      RD3_Glb.RemoveClass2(divobj, vsClass);
    //
    if (myClass && myClass != "")
      RD3_Glb.AddClass(divobj, myClass);
    divobj.setAttribute("vsclass", myClass ? myClass : "");
  }
}


// **********************************************************
// Restituisce true se questo VS ha il flag password attivo
// **********************************************************
VisAttrObj.prototype.IsPassword = function()
{
  return (this.GetFlags() & 0x10000)!=0; // FL_VIS_PASSWORD
}


// **********************************************************
// Restituisce true se questo VS ha il flag password attivo
// **********************************************************
VisAttrObj.prototype.HasHyperLink = function()
{
  return (this.GetFlags() & 0x200000)!=0; // FL_VIS_HYPERLINK
}


// ***********************************************************
// Torna True se questo stile chiede di mostrare l'immagine
// ***********************************************************
VisAttrObj.prototype.ShowImage= function() 
{
  return (this.GetFlags() & 0x80000)!=0; // FL_VIS_SHOWIMAGE
}


// ***********************************************************
// Torna True se questo stile chiede di mostrare la descrizione
// ***********************************************************
VisAttrObj.prototype.ShowDescription= function() 
{
  return (this.GetFlags() & 0x40000)!=0; // FL_VIS_SHOWDESCR
}

// ***********************************************************
// Torna True se questo stile chiede di mostrare il valore
// ***********************************************************
VisAttrObj.prototype.ShowValue = function () 
{
  return (this.GetFlags() & 0x20000) != 0; // FL_VIS_SHOWVALUE
}


// ***********************************************************
// Torna True se questo stile vuole mostrare tag HTML
// ***********************************************************
VisAttrObj.prototype.ShowHTML= function() 
{
  if (this.iShowHTML==null)
    this.iShowHTML = this.GetMask() == "=";
  return this.iShowHTML;
}


// ***********************************************************
// Calcola la maschera completa per gli oggetti
// ***********************************************************
VisAttrObj.prototype.ComputeMask= function(dt, ml, sc)
{
  var msk = this.GetMask();
  //
  if (msk == "=" || msk == ">" || msk == "<")
    return ""; // Non dovra' essere applicata nessuna particolare maschera
  //
  if (msk=="")
  {
    // Calcolo in base al tipo di dato
    switch (dt)
    {
      case 6: // DT_DATE
        msk = RD3_ServerParams.DateMask;
      break;
      
      case 7: // DT_TIME
        msk = RD3_ServerParams.TimeMask;
      break;
  
      case 8: // DT_DATETIME
        msk = RD3_ServerParams.DateMask + " " + RD3_ServerParams.TimeMask;
      break;
      
      case 4: // DT_CURRENCY
      case 3: // DT_DECIMAL ? DT_NUM_FIXED in Glb sul server...
        msk = RD3_ServerParams.CurrencyMask;
      break;

      case 2: // DT_FLOAT
        msk = RD3_ServerParams.FloatMask;
      break;

      case 1: // DT_INTEGER        
        //
        // Maschera per gli interi: # per maxlength-1 seguiti da uno 0
        for (var t=0; t<ml-1; t++)
          msk += "#";
        msk += "0";
      break;
    }
  }
  //
  // Sistemo in base alla lunghezza ed alla scala
  if (msk!="")
  {
    switch (dt)
    {
      case 1:
      case 2:
      case 3:
      case 4: // NUMERICI
        // Devo adattare la maschera a seconda della scala scelta e del tipo (cambio il numero di cifre decimali ed intere)
        // Per il dati float non devo fare nessun adattamento
        if (dt != 2)
        {
          // Leggo la posizione del separatore delle cifre decimali
          var p = msk.lastIndexOf(".");
          //
          // A seconda del tipo di dato devo cambiare il numero di cifre decimali: creo una variabile temporanea
          // La scala e' 0 per un itero, il numero di cifre decimali per un currency e quella del campo per un fixed
          var sct = sc;
          if (dt == 4)  
            sct = msk.length - p -1;  // DT_CURRENCY
          if (dt == 1)  
            sct = 0;                  // DT_INTEGER
          //
          // Sistemazione parte intera
          // Mosdifico la maschera dando tante cifre intere quanto la lunghezza massima meno la scala
          var mci = ml - sct;
          if (mci > 0)
          {
            // Valuto la maschera a partire dal punto a ritroso, se non c'e' il punto parto dalla fine
            // Quando raggiungo il numero voluto di cifre intere taglio la maschera
            if (p == -1)
              p = msk.length;
            for (var z = p-1; z>=0; z--)
            {
              var ch = msk.charAt(z);
              //
              // Se ho trovato una cifra decremento l'indice delle cifre intere
              if (ch == "0" || ch == "#")
              {
                mci--;
                //
                // Se ho trovato il numero massimo di cifre intere ma la maschera continuerebbe allora taglio l'inizio della maschera
                if (mci == 0 && z>0)
                {
                  msk = msk.substr(z);
                  break;
                }
              }
            }
          }
          //
          // Sistemo la parte decimale della maschera: dimensiono la maschera tagliando eventuali cifre decimali in eccesso
          // Rileggo la posizione del punto, la maschera potrebbe essere cambiata
          p = msk.lastIndexOf(".");
          //
          // Esiste un separatore decimale e nella maschera devono essere comprese delle cifre decimali
          if (p > -1 && sct >= 0)
          {
            // Se non ci devono cifre decimali taglio la maschera dal punto in poi (punto compreso)
            if (sct = 0)
              msk = msk.substring(0, p-1); 
            else
            {
              // Ciclo sulla maschera dal punto fino alla fine, quando raggiungo le cifre decimali volute taglio la maschera
              var mskl = msk.length;
              for (var z=p+1; z<mskl; z++)
              {
                var ch = msk.charAt(z);
                if (ch == "0" || ch == "#")
                {
                  sct--;
                  //
                  // Se ho raggiunto il numero desiderato di cifre decimali taglio la maschera
                  if (sct == 0)
                  {
                    msk = msk.substring(0, z);
                    break;
                  }
                }
              }
            }
          }
        }
        //
        // Controllo 0=NULL in maschera
        var mskl = msk.length;
        for (var z=0; z<mskl; z++)
        {
          // Ciclo sulla maschera fino al punto, ogni volta che trovo uno 0 lo sostituisco con un #
          var ch = msk.charAt(z);
          if (ch == ".")
            break;
          if (ch == "0")
            msk = msk.substr(0,z) + "#" + msk.substring(z+1);
        }
        //
        if (!RD3_DesktopManager.WebEntryPoint.UseDecimalDot)
        {
          var p = msk.lastIndexOf(".");
          msk = msk.replace(/,/g, ".");
          if (p>-1)
            msk = msk.substr(0,p)+","+msk.substring(p+1);
        }
      break;
      
      case 5:
      case 9:
      case 12: // CARATTERI
      {
      	// Se la maschera e' troppo lunga la tronco, pero' non la allungo perche'
      	// non e' detto che sia la cosa giusta da fare
        if (msk.length > ml)
          msk = msk.substr(0,ml);
      }
      break;    
    }
  }
  //
  return msk;
}


// ***********************************************************
// Calcola il tipo di maschera in base al tipo di dati
// ***********************************************************
VisAttrObj.prototype.ComputeMaskType= function(dt)
{
  switch(dt)
  {
    case 1:
    case 2:
    case 3:
    case 4: // NUMERICI
      return "N";
  
    case 6:
    case 7:
    case 8: // DATE
      return "D";
    
    default:
      return "A";
  }
}


// **********************************************************
// Crea gli oggetti prototipo interni...
// ***********************************************************
VisAttrObj.prototype.SetProto= function(cell)
{
  if (this.iProto==null)
  {
    this.iProto = new PCell();
    this.iProto.CloneFrom(cell);
  }
}


// ***********************************************************
// Ritorna l'offset di cui restringere le dimensioni di un
// campo in base ai bordi e al padding
// oriz = true: offset orizzontale, false: verticale
// type = 1: valore, 2 caption, 3 gruppo
// list = true: lista, false: form
// onlyborder = true: solo bordo, altrimenti bordo+padding
// ***********************************************************
VisAttrObj.prototype.GetOffset= function(oriz, type, list, onlyborder)
{
  // In base al tipo di bordo, posso calcolarne la dimensione ed il padding.
  //
  // Prima calcolo il tipo di bordo da utilizzare
  var bdi = type;
  if (!list)
  {
    switch(bdi)
    {
      case 1: // VISBDI_VALUE
        bdi = 6; // VISBDI_VALFORM
      break;

      case 2: // VISBDI_HEAD
        bdi = 4; // VISBDI_HDRFORM
      break;

      case 3: // VISBDI_GROUP
        bdi = 5; // VISBDI_GRPFORM
      break;      
    }
  }
  //
  // Prelevo il tipo di bordo
  var bt = this.GetBorders(bdi);
  var ho = 0;
  var vo = 0;
  //
  switch(bt)  
  {
    case 2: // VISBRD_HORIZ = 2;
      vo = 2; // Se il bordo e' orizzontale ho un offset verticale
    break;
    
    case 3: // VISBRD_VERT = 3;
      ho = 2; // Se ho un bordo verticale l'offset e' orizzontale
    break;
    
    case 4: // VISBRD_FRAME = 4;
      ho = 2;
      vo = 2;
    break;
    
    case 5: // VISBRD_SUNKEN = 5;
    case 6: // VISBRD_RAISED = 6;
    case 7: // VISBRD_ETCHED = 7;
    case 8: // VISBRD_BUMP = 8;
      ho = 4;
      vo = 4;
    break;
    
    case 9: // VISBRD_CUSTOM = 9;
      vo = ((this.GetCustomWidth(1)+this.GetCustomWidth(3))*96/288);
      ho = ((this.GetCustomWidth(2)+this.GetCustomWidth(4))*96/288);
    break;
  }
  //
  // Aggiungo le dimensioni del padding, se specificato
  if (bt==9 && !onlyborder)
  {
    vo += ((this.GetCustomPadding(1)+this.GetCustomPadding(3))*96/288); // fattore di conversione px/quarti di pt
    ho += ((this.GetCustomPadding(2)+this.GetCustomPadding(4))*96/288);
  }
  //
  // ritorno il risultato
  if (oriz)
    return ho;
  else
    return vo;
}


// ***********************************************************
// Adatta le dimensioni di un rettangolo in base ai bordi
// specificati in questo visual style in modo da essere uguali
// a quelle passate in input
//
// rect = il rettangolo
// type = 1: valore, 2 caption, 3 gruppo
// list = true: lista, false: form
// ***********************************************************
VisAttrObj.prototype.AdaptRect= function(rect, type, list)
{
  // calcolo le dimensioni dei bordi
  var ho = this.GetOffset(true, type, list);
  var vo = this.GetOffset(false, type, list);
  //
  if (ho>0)
    rect.w -= (ho-1);
  if (vo>0)
    rect.h -= (vo-1);
  //
  if (rect.w<0) rect.w = 0;
  if (rect.h<0) rect.h = 0;
}


// ***********************************************************
// Adatta le dimensioni del rettangolo della caption
// in modo da essere uguali a quelle passate in input,
// ma anche in modo da allineare il valore. Calcola anche
// il padding che dovra' essere applicato
//
// rect = il rettangolo della caption
// list = true: lista, false: form
// vert = false: campi orizzontali, true: campi verticali
// st = true: calcolo per campi statici  
// onlyborder = true: solo bordo, altrimenti bordo+padding
// ***********************************************************
VisAttrObj.prototype.AdaptCaptionRect= function(rect, list, vert, st, onlyborder)
{
  var bdi = st ? 1 : 2; // La caption di un campo statico fa riferimento alle impostazioni del valore (1), 
                        // la caption di un campo normale usa le impostazioni dell'intestazione (2)
  if (!list)
  {
    switch(bdi)
    {
      case 1: // VISBDI_VALUE
        bdi = 6; // VISBDI_VALFORM
      break;

      case 2: // VISBDI_HEAD
        bdi = 4; // VISBDI_HDRFORM
      break;
    }
  }
  //
  // Prelevo il tipo di bordo
  var bt = this.GetBorders(bdi);
  //
  // Nel caso il campo faccia uso di bordi custom entro in questo ramo e non faccio il resto della funzione
  if (bt==9)
  {
    var hb = 0; // Bordo orizzonatale
    var vb = 0; // Bordo verticale
    //
    //
    // Leggo le larghezze dei bordi
    hb = this.GetOffset(true, st ? 1 : 2, list, true);
    vb = this.GetOffset(false, st ? 1 : 2, list, true);
    //
    if (!onlyborder)
    {
      // Applico i padding
      rect.pxl = this.GetCustomPadding(4)*96/288; // fattore di conversione px/quarti di pt
      rect.pxr = this.GetCustomPadding(2)*96/288;
      rect.pyt = this.GetCustomPadding(1)*96/288;
      rect.pyb = this.GetCustomPadding(3)*96/288;
      //
      // Sommo i padding left e right e recupero sulla larghezza
      rect.w -= (rect.pxl+rect.pxr);
      //
      // Sommo i padding top e bottom e recupero sull'altezza
      rect.h -= (rect.pyt+rect.pyb);
    }
    else
    {
      rect.pxl = 0;
      rect.pxr = 0;
      rect.pyt = 0;
      rect.pyb = 0;
    }
    //
    // Diminuisco il rettangolo delle dimensioni dei bordi -1 (comportamento standard)
    rect.w -= (hb-1);
    rect.h -= (vb-1);
    //
    if (rect.w<0) rect.w = 0;
    if (rect.h<0) rect.h = 0;
    //
    return;
  }
  //
  // calcolo le dimensioni dei bordi della caption
  var hc = 0; 
  var vc = 0;
  var hv = 0;
  var vv = 0;
  //
  // calcolo le dimensioni dei bordi del valore
  var hv = this.GetOffset(true, 1, list, onlyborder);
  var vv = this.GetOffset(false, 1, list, onlyborder);
  //
  // Per i campi statici considero sempre uno spostamento in basso
  // come se ci fosse sempre da allineare un campo con bordo
  if (st)
  {
    hc = hv;
    vc = vv;
    //
    // Nel caso di campo statico senza bordo, voglio
    // aumentare l'effetto di questa funzione in modo che il campo
    // venga effettivamente spostato in basso per allineare un eventuale
    // campo statico con bordo nelle vicinanze, oppure un campo non statico
    if (hc==0)
    {
      hc=-2;
      //
      // Siccome non c'e' bordo, devo recuperare lo sbordamento
      rect.w--;
    }
    if (vc==0)
    {
      if (RD3_ServerParams.Theme.startsWith("zen") && this.GetContrType() == RD3_Glb.VISCTRL_BUTTON) 
      {
        vc = 1;
        rect.h = rect.h - 1;
      }
      else 
      {
        vc=-2;
        //
        // Siccome non c'e' bordo, devo recuperare lo sbordamento
        rect.h--;
      }
    }
  }
  else    
  {
    hc = this.GetOffset(true, 2, list, onlyborder);
    vc = this.GetOffset(false, 2, list, onlyborder);
  }
  //
  // Se non e' richiesto solo il bordo, gestisco i padding
  if (!onlyborder)
  {
    // Sommo alle dimensioni del valore il padding std dei campi (2px)
    hv += 4;
    vv += 4;
    //
    // Calcolo il padding della caption
    var px = 2;
    var py = 2;
    //
    if (vert)
      px = 2; //px = (hv-hc)/2; NON ESEGUO SPOSTAMENTO X
    else
      py = (vv-vc)/2;
    //
    if (px<0) px=0;
    if (py<0) py=0;
    //
    rect.pxl = px;
    rect.pxr = px;
    rect.pyt = py;
    rect.pyb = py;
    //
    if (hc<0) hc=0;
    if (vc<0) vc=0;
    //
    // Aggiusto dim. rett capt.
    hc+=2*px;
    vc+=2*py;
  }
  else
  {
    rect.pxl = 0;
    rect.pxr = 0;
    rect.pyt = 0;
    rect.pyb = 0;
  }
  //
  rect.w -= (hc-1);
  rect.h -= (vc-1);
  //
  if (rect.w<0) rect.w = 0;
  if (rect.h<0) rect.h = 0;
}


// **********************************************************
// Crea gli oggetti prototipo interni...
// ***********************************************************
VisAttrObj.prototype.SetBoxProto= function(obj)
{
  // In questo caso non clono i figli, solo lui!!!
  if (this.iBoxProto==null)
  {
    this.iBoxProto = obj.cloneNode(false);
    //
    // Svuoto solo se c'era l'immagine: potrebbe esserci un gradiente (!IE)... l'immagine di sfondo e' una peculiarita' della box, non del VS
    if (this.iBoxProto.style.backgroundImage.substr(0,4) == "url(")
      this.iBoxProto.style.backgroundImage = "";
    //
    // La Box puo' avere a sua Volta una classe gia' impostata, la devo rimuovere perche' la nuova istanza non sa di averla
    if (this.iBoxProto.className != "book-box") {
      var vsCls = this.GetClassName();
      if (vsCls) 
      {
        this.iBoxProto.className = "book-box " + vsCls;
        this.iBoxProto.setAttribute("vsclass", vsCls);
      }
      else
      {
        this.iBoxProto.className = "book-box";
        this.iBoxProto.setAttribute("vsclass", "");
      }
    }
  }
}

// ***********************************************************
// Restituisce i prototipi creati
// ***********************************************************
VisAttrObj.prototype.GetBoxProto= function()
{
  if (this.iBoxProto!=null)
  {
    if (this.iBoxProtoPtr>0)
      return this.iBoxProtoCollection[--this.iBoxProtoPtr];
    //    
    this.iBoxProtoQty++;
    //
    return this.iBoxProto.cloneNode(false);
  }
}

// ***********************************************************
// Il prototipo e' gia' presente?
// ***********************************************************
VisAttrObj.prototype.HasBoxProto= function()
{
  return this.iBoxProto!=null;
}


// ***********************************************************
// Vediamo se devo creare dei prototipi
// ***********************************************************
VisAttrObj.prototype.Tick= function()
{
  if (this.HasBoxProto() && this.iBoxProtoPtr<this.iBoxProtoQty)
  {
    var a = this.iBoxProtoCollection;
    var p = this.iBoxProto;
    //
    // In un tick al massimo copio 100 prototipi
    var n = this.iBoxProtoQty-this.iBoxProtoPtr;
    n = (n>100)? 100 : n;
    for (var i=0; i<n; i++)
    {
      a[this.iBoxProtoPtr++] = p.cloneNode(false);
    }
    return true;
  }  
  return false;
}


// ***********************************************************
// Ritorna un RECT con i 4 offset dovuti ai bordi e padding
// Se OnlyBorder e' TRUE viene richiesto solo il bordo
// rect.x=LEFT, rect.y=TOP, rect.w=RIGHT, rect.h=BOTTOM
// ***********************************************************
VisAttrObj.prototype.GetBookOffset= function(onlyborder, bidx)
{
  // In base al tipo di bordo, posso calcolarne la dimensione ed il padding.
  var rect = new Rect(0,0,0,0);
  //
  // Prelevo il tipo di bordo
  if (bidx==undefined)
		bidx=1;
  var bt = this.GetBorders(bidx);
  switch(bt)  
  {
    case 2: // VISBRD_HORIZ = 2;
      rect.y=1; rect.h=1;
    break;
    
    case 3: // VISBRD_VERT = 3;
      rect.x=1; rect.w=1;
    break;
    
    case 4: // VISBRD_FRAME = 4;
      rect.x=1; rect.y=1; rect.w=1; rect.h=1;
    break;
    
    case 5: // VISBRD_SUNKEN = 5;
    case 6: // VISBRD_RAISED = 6;
    case 7: // VISBRD_ETCHED = 7;
    case 8: // VISBRD_BUMP = 8;
      rect.x=2; rect.y=2; rect.w=2; rect.h=2;
    break;
    
    case 9: // VISBRD_CUSTOM = 9;
      rect.y = this.GetCustomWidth(1)*96/288;
      rect.w = this.GetCustomWidth(2)*96/288;
      rect.h = this.GetCustomWidth(3)*96/288;
      rect.x = this.GetCustomWidth(4)*96/288;
      //
      // Aggiungo le dimensioni del padding, se specificato
      if (!onlyborder)
      {
        rect.y += this.GetCustomPadding(1)*96/288;
        rect.w += this.GetCustomPadding(2)*96/288;
        rect.h += this.GetCustomPadding(3)*96/288;
        rect.x += this.GetCustomPadding(4)*96/288;
      }
    break;
  }
  //
  // ritorno il risultato
  return rect;
}

// ******************************************************************************
// Restituisce la firma del VS per essere applicato in un pannello
// ******************************************************************************
VisAttrObj.prototype.GetSign = function(list, alt, sel, ro, er, wa, aa, qbe, notnull) 
{
  return this.Identifier + "*" + (er?"1":"0") + (wa?"1":"0") + (notnull?"1":"0") + "$" + (alt?"1":"0") + (sel?"1":"0") + (ro?"1":"0") + (qbe?"1":"0");
}


// ******************************************************************************
// Converte il nome del font per adattarlo al dispositivo
// ******************************************************************************
VisAttrObj.prototype.ConvertFont = function(fnt) 
{
  if (RD3_Glb.IsMobile() && (fnt=="Tahoma" || fnt=="Arial"))
  	return "HelveticaNeue,"+fnt;
	else
		return fnt;
}

// ******************************************************************************
// Converte il nome del font per adattarlo al dispositivo
// ******************************************************************************
VisAttrObj.prototype.ConvertSize = function(siz) 
{
  if (RD3_Glb.IsMobile() && (siz=="14" || siz=="15"))
  	return "20px";
	else
		return siz+"pt";
}

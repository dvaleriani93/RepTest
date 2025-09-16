// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe Message: gestisce un messaggio di una form
// ************************************************

function Message(pform)
{
  // Proprieta' di questo oggetto di modello
  this.Code = "";               // Codice del messaggio
  this.Text = "";            		// Testo del messaggio (html)
  this.Image = "";            	// Icona specifica del messaggio
  this.Type = 3;         				// Tipo di messaggio: 1-info, 2-warn, 3-error
  this.Temporary = true;        // Messaggio temporaneo?
  this.Request = "";            // Codice della richiesta in cui e' stato realizzato o cambiato questo messaggio
  //
  this.ParentForm = pform;      // Form che possiede il messaggio
  //
  // Variabili di collegamento con il DOM
  this.Realized = false;        // Se vero, il Timer del browser e' stato creato
  this.MyBox = null;            // Div che contiene il messaggio
  this.ImgBox = null;       		// Img per l'icona
  this.SpanText = null;       	// Span per il testo
}

// *******************************************************************
// Inizializza questo Timer leggendo i dati da un nodo <tim> XML
// *******************************************************************
Message.prototype.LoadFromXml = function(node) 
{
  // Inizializzo le proprieta' locali
	this.LoadProperties(node);
}


// **********************************************************************
// Esegue un evento di change che riguarda le proprieta' di questo oggetto
// **********************************************************************
Message.prototype.ChangeProperties = function(node)
{
	// Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}


// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
Message.prototype.LoadProperties = function(node)
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
    	case "cod": this.SetCode(attrnode.nodeValue); break;
    	case "txt": this.SetText(attrnode.nodeValue); break;
    	case "img": this.SetImage(attrnode.nodeValue); break;
    	case "typ": this.SetType(parseInt(attrnode.nodeValue)); break;
    	case "tem": this.SetTemporary(attrnode.nodeValue=="1"); break;
    	
    	case "id": 
    		this.Identifier = valore;
    		RD3_DesktopManager.ObjectMap.add(valore, this);
    	break;
    }
  }
  //
  this.Request = RD3_DesktopManager.CurrentRequest;
  //
  // Un messaggio temporaneo vuoto viene subito cancellato
  if (this.Realized && this.Text=="" && this.Temporary)
  {
  	this.Request = "";
  	//
  	// Se sono diventato temporaneo, la form mi deve cancellare
  	if (RD3_Glb.IsMobile())
  		this.ParentForm.OpenMessageBar(-1);
  	else
  		this.ParentForm.RealizeMessages();
  }
}


Message.prototype.SetCode = function(value) 
{
	if (value!=undefined)
  	this.Code = value;
  //
	if (this.Realized)
	{
		// ???
	}
}

Message.prototype.SetText = function(value) 
{
	if (value!=undefined)
  	this.Text = value;
  //
	if (this.Realized)
	{
		this.SpanText.innerHTML = this.Text;
		if (RD3_Glb.IsMobile())
			this.SpanText.style.verticalAlign = this.SpanText.offsetHeight<20?"-6px":"";
    //
    // Chrome, in alcuni casi, fa casino con il vertical Align... non lo propaga ai sotto-figli
    // dello span qualora presenti... meglio rinforzare il concetto...
    if (RD3_Glb.IsChrome() && this.SpanText.offsetHeight<20)
      this.SpanText.innerHTML = this.Text;
	}
}

Message.prototype.SetImage = function(value) 
{
	if (value!=undefined)
  	this.Image = value;
  //
	if (this.Realized)
	{
	  if (this.Image != "")
  		this.ImgBox.src = RD3_Glb.GetImgSrc("images/"+this.Image);
    else
      this.ImgBox.removeAttribute("src");
    //
   	if ((RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro()) && this.Image != "")
   	{
      // Se passo da una mia immagine a una immagine dell'utente devo annullare le dimensioni che ho fissato nella SetType
			this.ImgBox.removeAttribute("width");
			this.ImgBox.removeAttribute("height");
      //
      // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
      if (RD3_Glb.Adapt4Retina(this.Identifier, this.Image, 24))
			  this.ImgBox.style.display = "none";
    }
	}
}

Message.prototype.SetType = function(value) 
{
	if (value!=undefined)
  	this.Type = value;
  //
	if (this.Realized)
	{
		if (this.Image=="")
		{
			var mob = RD3_Glb.IsMobile();
			switch(this.Type)
			{
				case 1: // INFO
					this.ImgBox.src = RD3_Glb.GetImgSrc("images/"+(mob?"info_24.png":"minfo_sm.gif"));
				break;

				case 2: // WARN
					this.ImgBox.src = RD3_Glb.GetImgSrc("images/"+(mob?"warn_24.png":"mwarn_sm.gif"));
				break;
				
				case 3: // ERR
					this.ImgBox.src = RD3_Glb.GetImgSrc("images/"+(mob?"stop_24.png":"mstop_sm.gif"));
				break;
			}
      //
      // L'immagine e' del template, fisso le dimensioni
   	  if (RD3_Glb.IsMobile7() || RD3_Glb.IsQuadro())
			{
  			this.ImgBox.width = 24;
  			this.ImgBox.height = 24;
  		}
		}
	}
}

Message.prototype.SetTemporary = function(value) 
{
	if (value!=undefined)
  	this.Temporary = value;
}


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// ***************************************************************
Message.prototype.Realize = function(parent)
{
  // Eseguo l'impostazione iniziale delle mie proprieta'
  this.Realized = true;
  //
	// Creo il mio contenitore globale
  this.MyBox = document.createElement("div");
  this.MyBox.setAttribute("id", this.Identifier);
  this.MyBox.className = "form-message-div";
  //
  this.ImgBox = document.createElement("img");
  this.ImgBox.setAttribute("id", this.Identifier+":img");
  this.ImgBox.className = "form-message-icon";
  //
  this.SpanText = document.createElement("span");
  this.SpanText.setAttribute("id", this.Identifier+":txt");
  this.SpanText.className = "form-message-text";
  //
  this.MyBox.appendChild(this.ImgBox);
  this.MyBox.appendChild(this.SpanText);
  parent.appendChild(this.MyBox);
  //
  this.SetImage();
  this.SetType();
  this.SetText();
}


// ***************************************************************
// Cancella gli oggetti DOM relativi a questo oggetto
// ***************************************************************
Message.prototype.Unrealize = function()
{
  this.Realized = false;
  //
  // Tolgo il messaggio dal video
  if (this.MyBox && this.MyBox.parentNode)
  	this.MyBox.parentNode.removeChild(this.MyBox);
  //
  // Mi rimuovo dalla mappa
  RD3_DesktopManager.ObjectMap.remove(this.Identifier);
}


// ***************************************************************
// Dice se due messaggi sono uguali
// ***************************************************************
Message.prototype.EqualsTo = function(m)
{
	return m.Text == this.Text && m.Type==this.Type && m.Temporary==this.Temporary;
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
Message.prototype.OnAdaptRetina = function(w, h, par)
{
  if (this.ImgBox)
  {
    this.ImgBox.width = w;
    this.ImgBox.height = h; 
    this.ImgBox.style.display = "";
  }
}

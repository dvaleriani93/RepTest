// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PDFPrint: gestisce la stampa di un PDF
// ************************************************

function PDFPrint(node)
{
  // Proprieta' di questo oggetto di modello
  this.PDFUrl = node.getAttribute("id");  	 // URL del file PDF da stampare
  this.Message = node.getAttribute("msg");   // Messaggio da mostrare durante il download
  this.FromPage = parseInt(node.getAttribute("from")); // Pagina iniziale
  this.ToPage = parseInt(node.getAttribute("to"));     // Pagina finale
  this.FitToPaper = node.getAttribute("fit")!="0"; // Fit To Paper
  this.PrintDialog = node.getAttribute("dlg")=="1"; // Print Dialog?
  this.IE = RD3_Glb.IsIE(10, false);                  // Siamo su IE? se non siamo su IE la PrintPdf non funziona
  //
  // Oggetti relativi alla gestione di questo file
  this.StartPrint = null; // data e ora di inizio stampa
  //
  // Oggetti relativi al DOM
  this.PDFBox =  document.createElement("div"); // Oggetto PDF
  this.PDFBox.className = "pdf-object"; // Oggetto PDF
  document.body.appendChild(this.PDFBox);
  //
  // Mostro la delay di attesa.. solo su IE
  if (this.IE)
    RD3_DesktopManager.WebEntryPoint.DelayDialog.Open(this.Message, 0);
  //
  // Creo gia' l'oggetto PDF per iniziare il download del file
  this.PDFBox.innerHTML = "<object type='application/pdf' classid='clsid:CA8A9780-280D-11CF-A24D-444553540000' width='0' height='0'><param name='src' value='"+ this.PDFUrl +"'></object>";
  this.PDFObj = this.PDFBox.childNodes[0];
}

// *******************************************************************
// Controlla se il file e' arrivato, e ne esegue la stampa
// Ritorna True se l'oggetto PDF deve essere rimosso.
// *******************************************************************
PDFPrint.prototype.Tick = function() 
{
	if (this.StartPrint==null)
	{
		// Non ho ancora iniziato la stampa... vediamo se il file e' arrivato
		if (this.PDFObj.readyState==4)
		{
			// Il file e' arrivato, inizio la stampa
			this.StartPrint = new Date();
			if (this.PrintDialog)
				this.PDFObj.printWithDialog();
			else if (this.FromPage>0 && this.ToPage>0)
				this.PDFObj.printPagesFit(this.FromPage, this.ToPage, this.FitToPaper);
			else
				this.PDFObj.printAllFit(this.FitToPaper);
			//
			// Chiudo la Delay.. controllo se sono IE ma non servirebbe.. tanto se arrivo qui la stampa e' andata e va solo su IE
			if (this.IE)
			  RD3_DesktopManager.WebEntryPoint.DelayDialog.Close();
			//
			// Avviso il server che il file e' arrivato e se vuole puo' cancellarlo
			var ev = new IDEvent("pdfprint", this.PDFUrl, null, RD3_Glb.EVENT_SERVERSIDE|RD3_Glb.EVENT_IMMEDIATE);
		}
	}
	else
	{
		var t = new Date();
		//
		// Aspetto 20 secondi prima di rimuovere tutto dal DOM
		if (t - this.StartPrint > 20000)
		{
			this.PDFBox.parentNode.removeChild(this.PDFBox);
			return true;
		}
	}
	//
	return false;
}

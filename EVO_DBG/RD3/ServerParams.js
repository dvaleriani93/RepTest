// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Parametri relativi al funzionamento applicativo
// definiti dal server
// ************************************************

function ServerParams()
{
  // Proprieta' di questo oggetto di modello rappresentanti i parametri dell'applicazione
  this.Theme = "";                        // Tema grafico dell'applicazione
  this.SmartLookupIcon = false;           // true se la smart lookup deve far apparire un'icona
  this.ShowDisabledIcons = false;         // true se le icone disabilitate devono essere mostrate a video
  this.RightAlignedIcons = false;         // true se le icone devono essere allineate a destra
  this.ShowFieldImageInValue = true;      // Le immagini dei campi devono essere mostrate nei campi o nelle intestazioni?
  this.ShowDisabledFieldActivator = true; // True se per i campi disabilitati attivabili con uno stile visuale senza hyperlink deve essere mostrato comunque l'attivatore
  this.TooltipErrorMode = 1;              // Modalita' con cui vengono mostrati gli errori tramite tooltip
  this.EnableFrameResize = false;         // Ridimensionamento frame,docked e menu laterale abilitato?
  this.UseHTML5Upload = true;             // Utilizza HTML per inviare i file
  this.CompletePanelBorders = false;      // Migliora la visualizzazione dei pannelli utilizzando bordi aggiuntivi
  this.UseZones = true;                   // Utilizza le Zone Docked
  this.BorderType = RD3_Glb.BORDER_DEFAULT; // Di default uso il bordo di default
  this.UseIDEditor = true;                // Utilizza l'editor di Inde per l'HTML
  this.EnterChangeFocus = false;          // Invio sui campi di testo o sulle combo oltre che inviare il valore fuoca il prossimo campo
  this.PanelFixActiveRowWhenScrolled = true;  // Indica se la riga attiva del pannello deve rimanere fissa durante lo scrolling
  this.PanelsLikeSearch = true;
  this.PanelsLikeMode = 1;                // 1 START 2 CONTAINS
  //
  this.CurrencyMask = "#,###,###,##0.00"; // Maschere di default
  this.DateMask = "dd/mm/yyyy";
  this.TimeMask = "hh:nn";
  this.FloatMask = "#,###,###,###.####";
  //
  // Proprieta' di questo oggetto di modello rappresentanti le costanti RTC
  this.Aggiorna = "";
  this.AzzeraQBE = "";
  this.BottoneRitorna = "";
  this.CampoObbl = "";
  this.CancellaDoc = "";
  this.CaricaDoc = "";
  this.ChiudiForm = "";
  this.ModalChiudiForm = "";
  this.ChiudiAppl = "";
  this.ChiudiTutto = "";
  this.ComandoAllegati = "";
  this.ComandoGruppi = "";
  this.ComandoCommenti = "";
  this.ConfirmDelete = "";
  this.ModalConfirm = "";
  this.CreatePDF = "";
  this.ConfirmMenu = "";
  this.Print = "";
  this.ShowBlob = "";
  this.UploadBlob = "";
  this.MostraMenu = "";
  this.MostraRiquadro = "";
  this.NascondiMenu = "";
  this.NascondiRiquadro = "";
  this.PaginaNM = "";
  this.PanelPaginaPrec = "";
  this.BookPaginaPrec = "";
  this.PanelPaginaSucc = "";
  this.BookPaginaSucc = "";
  this.SBP_DATA1 = "";
  this.SBP_DATA2 = "";
  this.SBP_INSERT = "";
  this.SBP_QBE = "";
  this.SBP_UPD = "";
  this.TooltipCancel = "";
  this.TooltipCerca = "";
  this.TooltipDelete = "";
  this.TooltipDeseleziona = "";
  this.TooltipDuplicate = "";
  this.TooltipFormList = "";
  this.TooltipInsert = "";
  this.TooltipLock = "";
  this.TooltipShowCheck = "";
  this.TooltipShowRowSel = "";
  this.TooltipRefresh = "";
  this.TooltipSelectAll = "";
  this.TooltipTrova = "";
  this.TooltipUnlock = "";
  this.TooltipUpdate = "";
  this.BookFine = "";
  this.PanelFine = "";
  this.PanelInizio = "";
  this.BookInizio = "";
  this.VideateAperte = "";
  this.VisualizzaDocumento = "";
  this.RigaN = "";
  this.RigaNM = "";
  this.TooltipExport = "";
  this.ErrorNum = "";
  this.ErrorEffects = "";
  this.ErrorAction = "";
  this.ErrorSrc = "";
  this.ErrorButton = "";
  this.DelayDefaultMessage = "";
  this.TooltipMultipleCommandset = "";
  //
  // Messaggio visualizzato quando l'utente chiude il browser senza prima chiudere l'applicazione
  this.UnloadMessage = "PREMI CANCEL, POI CHIUDI L'APPLICAZIONE\nCON IL PULSANTE APPOSITO IN ALTO A DESTRA";
  //
  // Se viene ridefinito a undefined allora l'utente potra' chiudere il browser senza alcun messaggio
  this.UnloadMessage = undefined;
}


// *******************************************************************
// Inizializza i parametri leggendo i dati da un nodo XML
// *******************************************************************
ServerParams.prototype.LoadFromXml = function(node) 
{
  // Semplicemente setto le proprieta' a partire dal nodo
  this.LoadProperties(node);
}

// **************************************************************
// Inizializza le proprieta' di questo oggetto leggendole dal
// nodo xml arrivato.
// **************************************************************
ServerParams.prototype.LoadProperties = function(node)
{
  // Inizializzo le proprieta' ciclando su tutti gli attributi
  var attrlist = node.attributes;
  var n = attrlist.length;
  //
  for (var i = 0; i < n; i++) 
  {
    var attrnode = attrlist.item(i);
    var nome = attrnode.nodeName;
    var valore = attrnode.nodeValue;
    //
    switch(nome)
    {
      case "thm" : this.SetTheme(valore); break;
      case "sli" : this.SetSmartLookupIcon(valore!="NO"); break;
      case "shd" : this.SetShowDisabledIcons(valore == "1"); break;
      case "rai" : this.SetRightAlignedIcons(valore == "1"); break;
      case "sfi" : this.SetShowFieldImageInValue(valore == "1"); break;
      case "sda" : this.SetShowDisabledFieldActivator(valore == "1"); break;
      case "tem" : this.SetTooltipErrorMode(valore); break;
      case "frs" : this.SetEnableFrameResize(valore == "1"); break;
      case "jsu" : this.SetUseHTML5Upload(valore == "1"); break;
      case "cpb" : this.SetCompletePanelBorders(valore == "1"); break;
      case "uzn" : this.SetUseZones(valore == "1"); break;
      case "brt" : this.SetBorderType(valore); break;
      case "ued" : this.SetUseIDEditor(valore == "1"); break;
      case "ent" : this.SetEnterChangeFocus(valore == "1"); break;
      case "ars" : this.SetPanelFixActiveRowWhenScrolled(valore == "1"); break;
      case "pls" : this.SetPanelsLikeSearch(valore == "1"); break;
      case "plm" : this.SetPanelsLikeMode(parseInt(valore)); break;
      
      case "cmk" : this.SetCurrencyMask(valore); break;
      case "dmk" : this.SetDateMask(valore); break;
      case "tmk" : this.SetTimeMask(valore); break;
      case "fmk" : this.SetFloatMask(valore); break;
      
      case "M001" : this.Aggiorna = valore; break;
      case "M002" : this.AzzeraQBE = valore; break;
      case "M003" : this.BottoneRitorna = valore; break;
      case "M004" : this.CampoObbl = valore; break;
      case "M005" : this.CancellaDoc = valore; break;
      case "M006" : this.CaricaDoc = valore; break;
      case "M007" : this.ChiudiForm = valore; break;
      case "M008" : this.ModalChiudiForm = valore; break;
      case "M009" : this.ChiudiAppl = valore; break;
      case "M010" : this.ChiudiTutto = valore; break;
      case "M011" : this.ComandoAllegati = valore; break;
      case "M012" : this.ComandoCommenti = valore; break;
      case "M013" : this.ConfirmDelete = valore; break;
      case "M014" : this.ModalConfirm = valore; break;
      case "M015" : this.CreatePDF = valore; break;
      case "M016" : this.ConfirmMenu = valore; break;
      case "M017" : this.Print = valore; break;
      case "M018" : this.ShowBlob = valore; break;
      case "M019" : this.UploadBlob = valore; break;
      case "M020" : this.MostraMenu = valore; break;
      case "M021" : this.MostraRiquadro = valore; break;
      case "M022" : this.NascondiMenu = valore; break;
      case "M023" : this.NascondiRiquadro = valore; break;
      case "M024" : this.PaginaNM = RD3_Glb.IsIphone()?"|1/|2":valore; break;
      case "M025" : this.PanelPaginaPrec = valore; break;
      case "M026" : this.BookPaginaPrec = valore; break;
      case "M027" : this.PanelPaginaSucc = valore; break;
      case "M028" : this.BookPaginaSucc = valore; break;
      case "M029" : this.SBP_DATA1 = RD3_Glb.IsIphone()?"|1":valore; break;
      case "M030" : this.SBP_DATA2 = RD3_Glb.IsIphone()?"|1/|2":valore; break;
      case "M031" : this.SBP_INSERT = RD3_Glb.IsIphone()?"NEW":valore; break;
      case "M032" : this.SBP_QBE = RD3_Glb.IsIphone()?"QBE":valore; break;
      case "M033" : this.SBP_UPD = RD3_Glb.IsIphone()?"MOD":valore; break;
      case "M034" : this.TooltipCancel = valore; break;
      case "M035" : this.TooltipCerca = valore; break;
      case "M036" : this.TooltipDelete = valore; break;
      case "M037" : this.TooltipDeseleziona = valore; break;
      case "M038" : this.TooltipDuplicate = valore; break;
      case "M039" : this.TooltipFormList = valore; break;
      case "M040" : this.TooltipInsert = valore; break;
      case "M041" : this.TooltipLock = valore; break;
      case "M042" : this.TooltipShowCheck = valore; break;
      case "M043" : this.TooltipShowRowSel = valore; break;
      case "M044" : this.TooltipRefresh = valore; break;
      case "M045" : this.TooltipSelectAll = valore; break;
      case "M046" : this.TooltipTrova = valore; break;
      case "M047" : this.TooltipUnlock = valore; break;
      case "M048" : this.TooltipUpdate = valore; break;
      case "M049" : this.BookFine = valore; break;
      case "M050" : this.PanelFine = valore; break;
      case "M051" : this.PanelInizio = valore; break;
      case "M052" : this.BookInizio = valore; break;
      case "M053" : this.VideateAperte = valore; break;
      case "M054" : this.VisualizzaDocumento = valore; break;
      case "M055" : this.RigaN = RD3_Glb.IsIphone()?"|1":valore; break;
      case "M056" : this.RigaNM = RD3_Glb.IsIphone()?"|1/|2":valore; break;
      case "M057" : this.TooltipExport = valore; break;
      case "M058" : this.ErrorNum = valore; break;
      case "M059" : this.ErrorEffects = valore; break;
      case "M060" : this.ErrorAction = valore; break;
      case "M061" : this.ErrorSrc = valore; break;
      case "M062" : this.ErrorButton = valore; break;
      case "M063" : this.DelayDefaultMessage = valore; break;
      case "M064" : this.ComandoGruppi = valore; break;
      case "M065" : this.TooltipMultipleCommandset = valore; break;
    }
  }
}


// ***************************************
// Setter delle proprieta'
// ***************************************

ServerParams.prototype.SetTheme = function(value)
{
  this.Theme = value;
}

ServerParams.prototype.SetSmartLookupIcon = function(value)
{
  this.SmartLookupIcon = value;
}

ServerParams.prototype.SetShowDisabledIcons = function(value)
{
  this.ShowDisabledIcons = value;
}

ServerParams.prototype.SetRightAlignedIcons = function(value)
{
  this.RightAlignedIcons = value;
}

ServerParams.prototype.SetShowFieldImageInValue = function(value)
{
  this.ShowFieldImageInValue = value;
}

ServerParams.prototype.SetCurrencyMask = function(value)
{
  this.CurrencyMask = value;
}

ServerParams.prototype.SetDateMask = function(value)
{
  this.DateMask = value;
}

ServerParams.prototype.SetTimeMask = function(value)
{
  this.TimeMask = value;
}

ServerParams.prototype.SetFloatMask = function(value)
{
  this.FloatMask = value;
}

ServerParams.prototype.SetShowDisabledFieldActivator = function(value)
{
  this.ShowDisabledFieldActivator = value;
}

ServerParams.prototype.SetTooltipErrorMode = function(value)
{
  this.TooltipErrorMode = value;
}

ServerParams.prototype.SetEnableFrameResize = function(value)
{
  this.EnableFrameResize = value;
}

ServerParams.prototype.SetUseHTML5Upload = function(value)
{
  this.UseHTML5Upload = value;
}

ServerParams.prototype.SetCompletePanelBorders = function(value)
{
  this.CompletePanelBorders = value;
}

ServerParams.prototype.SetUseZones = function(value)
{
  this.UseZones = value;
}

ServerParams.prototype.SetBorderType = function(value)
{
  this.BorderType = value;
}

ServerParams.prototype.SetUseIDEditor = function(value)
{
  this.UseIDEditor = value;
}

ServerParams.prototype.SetEnterChangeFocus = function(value)
{
  this.EnterChangeFocus = value;
}

ServerParams.prototype.SetPanelFixActiveRowWhenScrolled = function(value)
{
  this.PanelFixActiveRowWhenScrolled = value;
}

ServerParams.prototype.SetPanelsLikeSearch = function (value) 
{
  this.PanelsLikeSearch = value;
}

ServerParams.prototype.SetPanelsLikeMode = function (value) 
{
  this.PanelsLikeMode = value;
}

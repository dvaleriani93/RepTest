// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe PValue: Rappresenta una cella di un campo di pannello
// ************************************************

function PCell(pfield, list)
{
  this.ParentField = pfield;    // L'oggetto campo cui la cella appartiene
  this.InList = list;           // Indica se la cella e' in layout list o form
  // this.ListQBECell;
  //
  this.PValue = null;           // PValue di cui questa cella sta mostrando il valore (attaccato in PCell::Update)
  //
  /* Controllo interno alla cella
       CT          Controlli
       2 (Edit)    INPUT, TEXTAREA, SPAN
       3 (Combo)   IDCombo
       4 (Check)   DIV contenente il check
       5 (Option)  DIV contenente gli input con tutti gli span e altro
       6 (Button)  INPUT di tipo button
       8 (Custom)  Custom element
       10 (BLOB)   DIV contenente tutto il BLOB
       101 (FCK)   DIV contenente tutto l'FCK
  */ 
  this.IntCtrl = null;          // Controllo interno alla cella
//  this.SubIntCtrl = null;     // Controllo interno al DIV nel caso Check, BLOB, FCK
  //
  // Proprieta' CELLA
  this.InitProperties();

  // Definire le proprieta' nel costruttore aiuta l'ottimizzazione degli engine javascript
  this.FluidResizeObserver = null;
}


// ***********************************************************
// Inizializza tutte le proprieta' di questa cella
// ***********************************************************
PCell.prototype.InitProperties = function()
{
  this.IsCellHidden = false;     // per QBE (vedi this.HideCellContent())
  //                            
  // Proprieta' CELLA            
  this.ControlType = -1;        // 2-EDIT, 3-COMBO, 4-CHECK, 5-OPTION, 6-BUTTON, 8-CUSTOM, 10-BLOB, 101-FCKEDIT, 111 - LISTGROUPHEADER
  this.NumRows = 1;             // 1-INPUT, >1-TEXTAREA
  //                            
  this.IsVisible = true;        // La cella e' visibile
  this.IsCtrlVisible = true;    // I controlli interni alla cella sono visibili (per CHECK e RADIO in QBE)
  this.IsEnabled = true;        // La cella e' abilitata
  this.IsReadOnly = false;      // Il controllo e' read-only (solo nel caso ControlType=2: INPUT/TEXTAREA)
  this.BackGroundImage = "";    // Immagine di sfondo
  this.BackGroundImageRM = "";  // Ridimensionamento immagine di sfondo
  this.Tooltip = "";            // Tooltip
  this.VisualStyleSign = "";    // Marchio dello stile visuale (per sapere se l'ho gia' applicato correttamente)
  this.DynPropSign = "|||-1|";  // Marchio delle proprieta' visuali dinamiche (per sapere se le ho gia' applicate correttamente)
  this.IsCellClickable = false;  
  //                            
  this.ErrorType = 0;           // Tipo di errore nella cella (0-nessuno, 1-errore, 2-warning con conferma, 3-warning senza conferma)
//  this.ErrorBox = null;         // DIV di errore
  //                            
  // Attivatore                 
  this.ActObj = null;           // Oggetto ATTIVATORE
//  this.ActObjVisible = true;  // L'attivatore e' visibile?
//  this.ActObjSrc = "";        // Immagine dell'attivatore
//  this.ActPos = 1;            // Posizione dell'attivatore (1=LEFT, 2=RIGHT)
//  this.ActObjX = 0;           // Coordinata LEFT dell'attivatore
//  this.ActObjY = 0;           // Coordinata TOP dell'attivatore
//  this.ActObjW = 0;           // Width dell'attivatore
//  this.ActObjCurs = "";       // Cursore da utilizzare sull'attivatore
  //
  this.Text = "";               // Testo della cella
  this.ValueAlign = "left";     // Allineamento del testo della cella
//  this.BlobCellType = "";       // Stato della cella di tipo BLOB
  //
//  this.Mask = "";             // Maschera della cella
//  this.MaskType = "";         // Tipo di maschera della cella (vedi maskedinp.js)
//  this.MaskDataSign = "";     // Segno della maschera
  this.MaxLength = -1;          // Massimo numero di caratteri che la cella puo' contenere
  //
//  this.Badge = "";            // Badge del campo
//  this.BadgeObj = null;       // Oggetto Badge
//  this.BadgeObjX = 0;         // Coordinata LEFT del badge
//  this.BadgeObjY = 0;         // Coordinata TOP del badge
  //
  this.CtrlRectX = 0;
  this.CtrlRectY = 0;
  this.CtrlRectW = 0;
  this.CtrlRectH = 0;
  //
  // Pannelli gruppati
  // this.leftPadding = 0;              // Padding applicato all'oggetto gruppo, per indentare le intestazioni
  // this.GroupCollapseButton = null;   // Pulsante di espansione/collassamento
  // this.GroupCollapseSrc = "";
  // this.GroupLabel = null;            // Nome del gruppo
  // this.EnlargeCell = false;          // Devo allargare la colonna a tutta la riga
  // this.Positioned = false;           // Cella posizionata?
  // this.GroupCollapseVis = true;      // Immagine di collassamento visibile?
  // this.GroupId = "";                 // Id del gruppo associato
  // this.FirstGroupField = false;      // La mia cella e' un intestazione di gruppo?
  
  //this.HasWatermark = false;          // La cella ha attualmente un watermark?
  // this.ClassName;                    // ClassName applicato alla cella
}


// ***********************************************************
// Inizializza la cella a partire dal value fornito
// parent: oggetto DOM entro cui inserire il DIV se non l'ho ancora fatto
// ***********************************************************
PCell.prototype.Update = function(pval, parent)
{
  // Ora sono collegata a questo valore
  this.OldPValue = this.PValue;
  this.PValue = pval;
  //
  // Se ho un valore, aggiorno la cella, altrimenti la svuoto
  if (pval)
  {
    // Potrebbe essere un PValue o un PValue fittizio per i gruppi..
    if (pval instanceof PValue)
    {
      // Se sono un PValue verifico di non passare da un PListGroup ad un OPValue, nel caso svuoto la cella..
      //if (this.OldPValue && this.OldPValue instanceof PListGroup)
        //this.ClearElement(true);
      //
      this.Render(parent);
    }
    //  
    if (pval instanceof PListGroup)
      this.RenderPListGroup(parent);  
  }
  else
  {
    this.HideCellContent(true, parent);
    //
    // Aggiorno le dimensioni... potrebbero essere cambiate
    this.UpdateDims();
  }
}


// ****************************************************************************
// La cella e' stata unrealizzata
// ****************************************************************************
PCell.prototype.Unrealize = function()
{
  if (this.FluidResizeObserver) {
    this.FluidResizeObserver.disconnect();
    this.FluidResizeObserver = null;
  }
  // Rimuovo i controlli dal DOM
  if (this.IntCtrl)
  {
    if (this.ControlType != 3 && this.ControlType != 8)   // COMBO, CUSTOM
    {
      if (this.ControlType == 101)
      {
        if (RD3_ServerParams.UseIDEditor)
        {
          this.IntCtrl.Unrealize();   // IDEditor
        }
        else
        {
          var nm = this.ParentField.Identifier + (this.InList ? ":lcke" : ":fcke");
          var ed = CKEDITOR.instances[nm];
          //
          if (ed)
          {
            try {
              document.body.appendChild(this.IntCtrl);
              ed.destroy(true);
            } catch(ex) {}
            try {
              CKEDITOR.remove(nm);
            } catch(ex) {}
          }
        }
      }
      //
      if (this.IntCtrl.parentNode)
        this.IntCtrl.parentNode.removeChild(this.IntCtrl);
      //
      if (this.ActObj && this.ActObj.parentNode)
        this.ActObj.parentNode.removeChild(this.ActObj);
      this.ActObj = null;
      //
      if (this.ErrorBox && this.ErrorBox.parentNode)
        this.ErrorBox.parentNode.removeChild(this.ErrorBox);
      this.ErrorBox = null;
      //
      if (this.OptionValueList)
        this.OptionValueList = null;
      //
      if (this.BadgeObj != null && this.BadgeObj.parentNode)
        this.BadgeObj.parentNode.removeChild(this.BadgeObj);
      this.BadgeObj = null;
      //
      if (this.TooltipDiv && this.TooltipDiv.parentNode)
        this.TooltipDiv.parentNode.removeChild(this.TooltipDiv);
      this.TooltipDiv = null;
    }
    else
      this.IntCtrl.Unrealize();   // IDCombo, Custom
    //
    if (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement == this.IntCtrl)
      RD3_KBManager.ActiveElement = null;
    //
    // E mi dimentico di lui
    this.IntCtrl = null;
  }
  //
  // Mi stacco dai miei "padri"
  this.PValue = null;
  this.ParentField = null;
  //
  // Se ero selezionato... ora non lo sono piu'
  if (RD3_DesktopManager.WebEntryPoint.HilightedCell==this)
    RD3_DesktopManager.WebEntryPoint.HilightedCell = null;
}


// ****************************************************************************
// Aggiorna gli oggetti DOM di questa cella
// ****************************************************************************
PCell.prototype.Render = function(parent)
{
  // Verifico la visibilita': se la cella deve essere invisibile e non ho FIX da applicare
  // (quindi nessuno mi ha reso visibile o invisibile quando non c'era ancora il controllo interno)
  // faccio presto: se ho il contollo lo nascondo e ho finito!
  var pvis = this.PValue.IsVisible();
  //
  if (pvis != this.IsVisible && this.ParentField && this.ParentField.ParentPanel.IsFluidPanel())
    this.ParentField.ParentPanel.RowsToRefresh.push(this.PValue.Index);
  //
  if (!pvis && this.FixIsVisible==undefined)
  {
    if (this.IntCtrl)
    {
      this.IsVisible = false;
      //
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
      {
        RD3_Glb.SetDisplay(this.IntCtrl, "none");
        this.HandleFluidVisibility();
        //
        // Ora l'attivatore
        if (this.ActObj && this.ActObjVisible)
        {
          this.ActObj.style.display = "none";
          this.ActObjVisible = false;
        }
      }
      else
        this.IntCtrl.SetVisible(false);
      //
      // Infine l'error box
      if (this.ErrorBox)
        this.ErrorBox.style.display = "none";
      //
      // La cella e' invisibile, non faccio piu' nulla
      return;
    }
  }
  //
  // Ottengo il visual style
  var vs = this.PValue.GetVisualStyle();
  var ct = this.PValue.GetControlType();
  //
  // Eccezione: se e' una combo disabilitata, faccio qualcosa di diverso
  if (ct == 3 && (!this.PValue.IsEnabled() || this.IsFluidCell()))
  {
    // Se non c'e' ShowDescription o se la cella e' cliccabile uso un oggetto speciale (no combo ma DIV, com'era in RD2)
    var pf = this.ParentField;
    var canclick = (pf.CanActivate && pf.ActivableDisabled) && pf.VisHyperLink(vs);
    if (!pf.ShowDescription(vs) || canclick || RD3_Glb.IsTouch() || RD3_Glb.IsMobile() || this.IsFluidCell())
      ct = 30;    // Disabled combo
  }
  //
  // Verifico compatibilita' oggetto con control type
  var cloned = false;
  if (this.ControlType != ct && ct != 101 && ct != 5 && ct != 8 && !(RD3_Glb.IsIE(6) && ct == 4) && !this.ListQBECell)  // Non clono FCK, OPTION e CHECK su IE6
  {
    // Verifico di non sostituire l'elemento con il fuoco...
    var wasfoc = (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement==this.GetDOMObj(true));
    //
    // Se sono in lista, vediamo se la cella puo' essere creata tramite 
    // clonazione di una delle altre celle del parent field
    if (this.InList)
    {
      var cell = null;
      //
      // Faccio 2 giri: al primo giro cerco una cella con le mie stesse caratteristiche...
      // Se non la trovo, al secondo giro, mi accontento di una cella con il mio stesso controllo
      var giro = 1;
      while (giro<=2)
      {
        var n = this.ParentField.PListCells.length;
        for (var i=0; i<n; i++)
        {
          var c = this.ParentField.PListCells[i];
          //
          // Se trovo me stessa... vuol dire che non c'e' niente di meglio...
          // Tanto se stanno creando me, vuol dire che dopo di me non c'e' nessuno
          if (c==this)
            break;
          //
          // Non posso mai usare custom element come matrici della clone
          if (c.ControlType == 8)
            continue;
          //
          // Se la cella e' realizzata e sono al secondo giro oppure sono al primo giro e la cella ha
          // le mie stesse caratteristiche, l'ho trovata (eseguo il cloning solo da una cella che abbia il PValue, non il PListGroup)
          if (c.IntCtrl && (giro==2 || this.IsGoodClone(c)) && c.PValue instanceof PValue)
          {
            cell = c;
            break;
          }
        }
        //
        if (cell)
          break;
        //
        giro++;
      }
      //
      // Se l'ho trovata... clono lei
      if (cell)
      {
        this.CloneFrom(cell);
        cloned = true;
      }
    }
    //
    // Se il controllo non va ancora bene, vuol dire che non sono riuscito a clonare dalla cella
    // Vediamo se posso clonare la cella a partire dal visual style
    if (!cloned && vs.iProto && !this.IsFluidCell())
    {
      this.CloneFrom(vs.iProto);
      cloned = true;
      //
      // Se, quando ho clonato la cella per fare il prototipo, questa aveva bordi custom potrei avere un problema 
      // dato che le varie ApplyStyle, ApplyValueStyle non tolgono i padding se il bordo non e' custom.
      // Quindi puo' succedere questo: se VS e' uno stile visuale che ha i bordi custom in un layout (es: form)
      // e non li ha nell'altro layout (es: list) ed io ho fatto un clone della cella quando questa era in layout form lei aveva i bordi custom.
      // Ora questa cella (che ho appena clonato) e' in layout list (e li' il VS non ha i bordi custom). Le varie ApplyStyle
      // e ApplyValueStyle non tolgono i padding quindi rimangono ed e' un problema.
      // Quindi, dopo aver fatto il clone, controllo. Se io sono in lista e il VS non ha bordi custom in LIST, oppure io sono
      // in form e il VS non ha bordi custom in FORM, tolgo il padding (che il VS non toglierebbe piu')
      var listBrd = vs.GetBorders(1);   // 1 - VISBDI_VALUE
      var frmBrd = vs.GetBorders(6);    // 6 - VISBDI_VALFORM
      if (listBrd == 9 || frmBrd == 9)  // 9 = VISBRD_CUSTOM
      {
        // Almeno uno dei due layout ha un bordo custom...
        // Se nel layout richiesto da questa cella i bordi non sono custom devo pulire il padding!
        if ((this.InList && listBrd != 9) || (!this.InList && frmBrd != 9)) // 9 = VISBRD_CUSTOM
        {
          var o = this.GetDOMObj();
          if (o && o.style)
            o.style.padding = "";
          //
          // Lo devo fare anche sull'attivatore
          if (this.ActObj)
            this.ActObj.style.padding = "";
        }
        //
        // Normalmente non resetto i marcatori dello stile... ma qui ho clonato da un VS e non so 
        // in quale layout si trovava la cella e potrebbe essere che lei era in layout list ma fuori lista 
        // ed ora io sono in form... oppure io ora sono in list fuori-lista e lei era in form... 
        // la classe corrisponde (e' sempre FORM) ma il layout e' cambiato e il VS potrebbe avere bordi differenti nei due layout
        // Quindi se il VS ha bordi differenti nei 2 layout devo riapplicare il VS
        if (listBrd != frmBrd)
        {
          // Il VS ha almeno un bordo custom e non sono tutti e due custom... meglio ricalcolare lo stile
          this.VisualStyleSign = "";
          this.DynPropSign = "|||-1|";
        }
      }
      //
      // Ho clonato dal VS... sistemo la classe che potrebbe non essere quella corretta
      // se ho clonato una cella con layout diverso dal mio
      if (this.InList != vs.iProto.InList)
      {
        // Rimuovo la vecchia classe ed aggiungo la nuova
        var cls = this.GetDOMObj().className;
        var newcls = cls;
        if (this.InList && this.ParentField.ListList)
          newcls = newcls.replace("-value-form", "-value-list");
        else
          newcls = newcls.replace("-value-list", "-value-form");
        //
        // Se e' cambiata la classe la applico e resetto i marcatori
        if (cls != newcls)
        {
          this.GetDOMObj().className = newcls;
          this.VisualStyleSign = "";
          this.DynPropSign = "|||-1|";
        }
        //
        // Se ho clonato per una cella in ListList devo rimuovere gli zIndex
        if (this.InList && this.ParentField.ListList)
        {
          var obj = this.GetDOMObj();
          if (RD3_Glb.IsIE(10, false))
            obj.style.removeAttribute('zIndex');
          else
            obj.style.removeProperty('z-index');
          //
          if (this.ActObj)
          {
            if (RD3_Glb.IsIE(10, false))
              this.ActObj.style.removeAttribute('zIndex');
            else
              this.ActObj.style.removeProperty('z-index');
          }
        }
      }
    }
    //
    // Se ho sostituito l'oggetto che aveva il fuoco con uno clonato, ripristino il fuoco
    if (cloned && wasfoc)
      RD3_KBManager.ActiveElement = this.GetDOMObj();
  }
  //
  // Poi creo i controlli interni
  var created = false;
  switch (ct)
  {
    case 2: // VISCTRL_EDIT
      created = this.RenderEdit(vs, parent, cloned);
    break;

    case 3: // VISCTRL_COMBO
      created = this.RenderCombo(vs, parent, cloned);
    break;
    
    case 30:  // Disabled COMBO
      created = this.RenderDisabledCombo(vs, parent, cloned);
    break;

    case 4: // VISCTRL_CHECK
      created = this.RenderCheck(vs, parent, cloned);
    break;
    
    case 5: // VISCTRL_OPTION (OPTION non clonano l'elemento)
      created = this.RenderOption(vs, parent, cloned);
    break;
    
    case 6: // VISCTRL_BUTTON
      created = this.RenderButton(vs, parent, cloned);
    break;
    
    case 8: // VISCTRL_CUSTOM
      created = this.RenderCustom(vs, parent, cloned);
    break;
    
    case 10: // CAMPO BLOB
      created = this.RenderBlob(vs, parent, cloned);
    break;
    
    case 101: // CAMPO FCK (FCK non clonano l'elemento)
      if (RD3_ServerParams.UseIDEditor)
        created = this.RenderIDEditor(vs, parent, cloned);
      else
        created = this.RenderFCK(vs, parent, cloned);
    break;
  }
  //
  // Se ho clonato o l'ho creato lo "battezzo"
  if (cloned || created)
  {
    var oid;
    if (this.InList && !this.ListQBECell)
    {
      var lstgrp = this.ParentField.ParentPanel.ListGroupRoot;
      var act = this.ParentField.ParentPanel.ActualPosition;
      //
      var row = this.PValue.Index - act;
      if (this.ParentField.InList && !this.ParentField.ListList)
        row = 0;
      //
      // In un pannello gruppato per sapere a quale riga sono devo: trovare la riga equivalente al PValue 
      // e sottrarre la riga equivalente dell'ActualPosition nella visione compatta
      if (this.ParentField.ParentPanel.IsGrouped() && this.ParentField.InList && this.ParentField.ListList)
      {
        row = this.ParentField.ParentPanel.GetRowForIndex(this.PValue.Index);
      }  
      //
      oid = this.ParentField.Identifier+":lv" + row;
    }
    else if (this.ListQBECell)
      oid = this.ParentField.Identifier + ":qv";
    else
      oid = this.ParentField.Identifier+":fv";
    //
    if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType==101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
    {
      this.IntCtrl.setAttribute("id", oid);
      this.SetZIndex(this.IntCtrl);
    }
    else
      this.IntCtrl.SetID(oid);
    //
    // Se ho clonato, vediamo se ci sono proprieta' cambiate prima che l'oggetto venisse clonato
    if (cloned)
    {
      // Se qualcuno ha cambiato alcune delle proprieta' della cella prima di
      // aver creato il DIV, le applico ora
      this.SetVisible();
      this.SetBackGroundImage();
      this.SetBackGroundImageRM();
    }
  }
  //
  // Se l'oggetto non e' nello stato di visibilita' corretto, lo adeguo
  if (pvis != this.IsVisible)
  {
    this.IsVisible = pvis;
    //
    if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
    {
      if (this.IntCtrl)
      {
        RD3_Glb.SetDisplay(this.IntCtrl, (pvis ? "" : "none"));
        this.HandleFluidVisibility();
      }
      //
      // L'attivatore...
      if (this.ActObj)
      {
        var actvis = (pvis && this.PValue.ActivatorImage(vs) != "");
        if (this.ActObjVisible != actvis)
        {
          this.ActObj.style.display = (actvis ? "" : "none");
          this.ActObjVisible = actvis;
          //
          // Se visibile, aggiorno la posizione dell'attivatore
          if (actvis)
          {
            this.UpdateDims();
            //
            // Adatto anche l'input poiche' l'attivatore e' diventato visibile
            this.AdaptInputForAct();
          }
        }
      }
    }
    else
      this.IntCtrl.SetVisible(pvis);
  }
  //
  // Se la cella e' visibile
  if (this.IsVisible)
  {
    // Aggiorno l'immagine di sfondo
    if (this.ParentField.Image != "" && RD3_ServerParams.ShowFieldImageInValue)
    {
      var url = this.ParentField.Image;
      if (!RD3_Glb.IsAbsoluteUrl(this.ParentField.Image))
        url = RD3_Glb.GetAbsolutePath() + "images/" + this.ParentField.Image;
      //
      this.SetBackGroundImage("url(" + encodeURI(url) + ")");
    }
    else
      this.SetBackGroundImage("");
    //
    if (this.ParentField.ImageResizeMode != 1 && RD3_ServerParams.ShowFieldImageInValue)
      this.SetBackGroundImageRM(this.ParentField.ImageResizeMode);
    //
    // Sottolineatura di errore
    if (this.PValue.ErrorType != this.ErrorType)
    {
      this.ErrorType = this.PValue.ErrorType;
      //
      // Se c'era ma non ci vuole, lo nascondo
      if (this.ErrorType==0 && this.ErrorBox)
      {
        this.ErrorBox.parentNode.removeChild(this.ErrorBox);
        this.ErrorBox = null;
      }
      //
      // Se ci vuole ma non c'era, lo creo
      if (this.ErrorType!=0 && !this.ErrorBox)
      {
        this.ErrorBox = document.createElement("div");
        this.SetZIndex(this.ErrorBox);
        parent.appendChild(this.ErrorBox);
      }
      //
      // C'e' e ci vuole, lo aggiorno
      if (this.ErrorType!=0 && this.ErrorBox)
      {
        this.ErrorBox.className = "panel-value-" + ((this.ErrorType==1)? "error":"warning");
        //
        // Gia' che ci sono, lo dimensiono come me... Puo' capitare che non venga chiamato l'UpdateDim
        var margy = ((this.ControlType==2 && !RD3_Glb.IsMobile()) ? 5 : 1);
        //
        // Questo e' lo stesso codice che c'e' nell'UpdateDims, nel Mobile lo metto perche'
        // tutti gli input hanno il margine, servirebbe anche in !Mobile, ma per sicurezza non lo metto; se qualcuno fa una cella con un
        // margine custom ed ogni tanto l'errore e' sbagliato basta togliere questo if e farlo entrare comunque
        if (RD3_Glb.IsMobile())
        {
          if (this.ControlType == 6)
          {
            margy = -1;
          }
          else
          {
            // Quando calcolo i margini gestisco anche il tipo di bordo
            var vs = this.PValue ? this.PValue.GetVisualStyle() : this.ParentField.VisualStyle;
            var bid = (this.InList)? 1 : 6; // VISBDI_VALUE : VISBDI_VALFORM
            var bt = vs.GetBorders(bid);
            switch(bt)  
            {
              case 1: // VISBRD_NONE = 1;
                margy = margy - 1;
              break;
              case 3: // VISBRD_VERT = 3;
                margy = margy - 1;
              break;
              case 9: // VISBRD_CUSTOM = 9;
                margy = vs.GetOffset(false, 1, this.InList, false)-1;
              break;
            }
          }
        }
        //
        this.ErrorBox.style.left = this.CtrlRectX + "px";
        this.ErrorBox.style.top = (this.CtrlRectY+this.CtrlRectH+margy-2) + "px";
        this.ErrorBox.style.width = (this.CtrlRectW + (this.ActObj && this.ActObjVisible ? this.ParentField.GetActivatorWidth(this)+2 : 0) + (this.ControlType==2 ? 5 : 1)) + "px";    // 1px bordo + 2px padding per input
      }
    }
    //
    // Aggiorno il tooltip
    if (this.PValue.ErrorText != "")
      this.SetTooltip(this.PValue.ErrorText);
    else if (this.PValue.Tooltip != "")
      this.SetTooltip(this.PValue.Tooltip);
    else if (ct == 30 && !RD3_Glb.IsMobile()) {
      // Gestione del tooltip nel caso di disabled combo, e' speciale perche' invece di venire dal PValue puo'
      // anche venire dall'item selezionato (vedi RenderDisabledCombo) - non lo faccio nel mobile, in quel caso non e' corretto mostrare sempre la descrizione
      // dell'item selezionato, deve essere fatto esplicitamente dall'utente
      var vl = this.PValue.GetValueList();
      var selit = (vl ? vl.FindItemsByValue(this.PValue.Text, false) : null);
      if (!selit || selit.length==0)
        this.SetTooltip("");
      else
        this.SetTooltip(selit[0].Tooltip);
    }
    else
      this.SetTooltip("");
    //
    // The PValue Class has the precedence, if not set or "" use the field class. If that is "" clear the class
    var newClassName = this.PValue.CSSClass || this.ParentField.ClassName;
    if (newClassName != this.ClassName)
    {
      // Se non sono ne' combo ne' IDEditor aggiungo la classe all'oggetto interno
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor)) 
      {
        // Rimuovo la classe precedente
        if (this.ClassName != "")
          RD3_Glb.RemoveClass2(this.IntCtrl, this.ClassName);
        if (this.ClassName && this.ClassName.indexOf("enable-spellcheck") >=0 )
          this.IntCtrl.setAttribute("spellcheck", "");
        //
        // Applico la nuova classe proveniente dal PField
        this.ClassName = newClassName;
        if (this.ClassName && this.ClassName != "")
          RD3_Glb.AddClass(this.IntCtrl, this.ClassName);
        if (this.ClassName && this.ClassName.indexOf("enable-spellcheck") >=0 )
          this.IntCtrl.setAttribute("spellcheck", "true");
      }
      else
      {
        // Dico all'oggetto interno di applicare la classe
        this.ClassName = newClassName;
        this.IntCtrl.SetClassName(this.ClassName);
      }
    }
    //
    // Ho aggiornato il tutto... ora se la cella era stata svuotata, la ripristino
    this.HideCellContent(false, parent);
  }
  else  // La cella e' invisibile
  {
    // Se c'era un ErrorBox... lo elimino!
    if (this.ErrorBox)
    {
      this.ErrorBox.parentNode.removeChild(this.ErrorBox);
      this.ErrorBox = null;
      this.ErrorType = 0;
    }
  }
  //
  // Gestisco clone visual style (se non e' FCK / option / CUSTOM!)
  if (ct != 101 && ct != 5 && ct != 8 && !this.IsFluidCell())
    vs.SetProto(this);
  //
  // Ora lo posiziono al posto giusto nel DOM
  if (cloned && parent)
  {
    if (this.ControlType == 3 || this.ControlType == 8 || (this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
    {
      this.IntCtrl.Realize(parent, (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form"));
    }
    else
    {
      parent.appendChild(this.IntCtrl);
      //
      if (this.ActObj)
      {
        this.SetZIndex(this.ActObj);
        parent.appendChild(this.ActObj);
      }
      if (this.ErrorBox)
      {
        this.SetZIndex(this.ErrorBox);
        parent.appendChild(this.ErrorBox);
      }
      if (this.BadgeObj)
      {
        this.SetZIndex(this.BadgeObj);
        parent.appendChild(this.BadgeObj);
      }
    }
  }
}


// *****************************************************************
// Creo i controlli per un campo tramite INPUT/TEXTAREA
// *****************************************************************
PCell.prototype.RenderEdit = function(vs, parent, cloned)
{
  var parentContext = this.ParentField;
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var inqbe = this.PValue.InQBE();
  var ie = RD3_Glb.IsIE(10, false);
  //
  var nr = (this.InList)?pf.ListNumRows:pf.FormNumRows;
  var en = this.PValue.IsEnabled();
  var created = false;
  //
  // I campi numerici li facciamo comunque diventare INPUT, altrimenti sulla TextArea la mascheratura non funziona
  if (nr > 1 && RD3_Glb.IsNumericObject(pf.DataType))
    nr = 1;
  //
  // Tutti i valori oltre la prima riga in QBE diventano disabilitati
  if (this.InList && pf.ListList && this.PValue.Index>1 && pp.Status==RD3_Glb.PS_QBE)
    en = false;
  //
  // La lista fluida non e' ediatbile: ci pensera' poi la cella di edit
  if (this.IsFluidCell())
    en = false;
  //
  if (!en && (vs.ShowHTML() || this.PValue.ShowHTML() || pf.EditorType==1 || pf.VisHyperLink(vs) || RD3_Glb.IsMobile() || RD3_Glb.IsTouch() || 
    this.IsFluidCell()))
  {
    // Se il controllo presente nella cella non e' EDIT o era scrivibile ora non lo e' piu'... devo cambiare qualcosa
    if (this.ControlType != 2 || !this.IsReadOnly)    // VISCTRL_EDIT
    {
      // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
      if (this.ControlType != -1)
        this.ClearElement(true);
      //
      // Creo uno span e gli metto dentro l'HTML
      this.IntCtrl = document.createElement("span");
      this.IntCtrl.className = (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
      parent.appendChild(this.IntCtrl);
      //
      // Per FCKEditor disabilitato mi serve Auto
      if (pf.EditorType == 1)
        this.IntCtrl.style.overflow = "auto";
      //
      // Ho creato il controllo
      created = true;
    }
    //
    // Comunue controllo la classe aggiuntiva
    var addhtml = false;
    var addta = false;
    if (vs.ShowHTML() || this.PValue.ShowHTML() || pf.EditorType==1 || pf.VisHyperLink(vs))
      addhtml = true;
    //
    // In caso touch ho bisogno sempre della textarea altrimenti non va a capo il testo
    if (nr>1 && (!addhtml || ((RD3_Glb.IsMobile() || RD3_Glb.IsTouch()) && !this.PValue.ShowHTML())))
      addta = true;
    //
    // Per i campi di input ho comunque bisogno dell'input altrimenti non viene fornito il padding giusto (2px)
    if (nr==1 && !addhtml && (RD3_Glb.IsMobile() || RD3_Glb.IsTouch()))
      addhtml = true;
    //
    if (addta) RD3_Glb.AddClass(this.IntCtrl, "panel-value-textarea"); else RD3_Glb.RemoveClass(this.IntCtrl, "panel-value-textarea");
    if (addhtml) RD3_Glb.AddClass(this.IntCtrl, "panel-value-html"); else RD3_Glb.RemoveClass(this.IntCtrl, "panel-value-html");
    //
    // la cella fluida appare disabilitata ma deve essere cliccabile solo se il PValue e' effettivamente disabilitato, altrimenti
    // c'e' l'attivatore e deve venire gestito come negli altri casi
    var cc = this.ParentField.IsCellClickable(this.PValue.Index, vs) && (this.PValue.Text && this.PValue.Text.length > 0) && !(this.IsFluidCell() && this.PValue.IsEnabled());
    if (cc != this.IsCellClickable || created || cloned)
    {
      this.IsCellClickable = cc;
      //
      if (this.IsCellClickable && !RD3_Glb.IsMobile())
      {
        this.IntCtrl.style.cursor = "pointer";
        this.IntCtrl.onclick = function(ev) { parentContext.OnClickActivator(ev); };
      }
      else
      {
        this.IntCtrl.style.cursor = "default";
        this.IntCtrl.onclick = null;
      }
    }
    //
    // La cella non contiene INPUT/TEXTAREA
    this.IsReadOnly = true;
  }
  else
  {
    // Vediamo se l'elemento che sto trattando era quello attivo
    var wasfoc = false;
    //
    if (nr==1) // INPUT
    {
      // Se il controllo presente nella cella non e' EDIT o era readonly ora non lo e' piu'... devo cambiare qualcosa
      if (this.ControlType != 2 || this.IsReadOnly || this.NumRows>1 || (this.IntCtrl && vs.IsPassword() !== (this.IntCtrl.type == "password")))    // VISCTRL_EDIT
      {
        // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
        if (this.ControlType != -1)
        {
          wasfoc = (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement == this.GetDOMObj());
          this.ClearElement(true);
        }
        //
        // Creo INPUT
        this.IntCtrl = document.createElement("input");
        this.IntCtrl.type = vs.IsPassword() ? "password" : "text";
        this.IntCtrl.className = "panel-value-input " + (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
        RD3_Glb.AutocompleteOff(this.IntCtrl);
        parent.appendChild(this.IntCtrl);
        //
        // Default mask
        this.Mask = "";
        this.MaskType = "";
        this.MaskDataSign = "";
        //
        // Default MaxLength
        this.MaxLength = -1;
        //
        // Ho creato il controllo
        created = true;
      }
      if (RD3_Glb.IsTouch())
      {
        // In caso di iphone/ipad e numero o data, allora scelgo la tastiera numerica
        var tt = vs.IsPassword()? "password" : "text";
        if (RD3_Glb.IsTouch())
        {
          if (RD3_Glb.IsNumericObject(pf.DataType) || RD3_Glb.IsDateOrTimeObject(pf.DataType))
            tt = "tel";
        }
        //
        if (this.IntCtrl.type!=tt)
          this.IntCtrl.type=tt;
      }
      //
      if (RD3_Glb.IsMobile())
      {
        var mustBlockFld = ((RD3_Glb.IsIpad() || RD3_Glb.IsIphone() || RD3_Glb.IsIE() || RD3_Glb.IsAndroid()) && this.ParentField && this.ParentField.UsePopupControl());
        //
        // Se il campo usa il PopupControl lo blocco in modo che non si apra la tastiera
        if (mustBlockFld && !this.PopupControlReadOnly)
        {
            this.IntCtrl.setAttribute("readonly", true);
            this.PopupControlReadOnly = true;
        }
        if (!mustBlockFld && this.PopupControlReadOnly)
        {
          this.IntCtrl.removeAttribute("readonly");
          this.PopupControlReadOnly = false;
        }
      }
    }
    else
    {
      // Se il controllo presente nella cella non e' EDIT o era readonly ora non lo e' piu'... devo cambiare qualcosa
      if (this.ControlType != 2 || this.IsReadOnly || this.NumRows==1)    // VISCTRL_EDIT
      {
        // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
        if (this.ControlType != -1)
        {
          wasfoc = (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement == this.GetDOMObj());
          this.ClearElement(true);
        }
        //
        // Creo TEXTAREA
        this.IntCtrl = document.createElement("textarea");
        this.IntCtrl.className = "panel-value-textarea " + (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
        RD3_Glb.AutocompleteOff(this.IntCtrl);
        parent.appendChild(this.IntCtrl);
        //
        // Default mask
        this.Mask = "";
        this.MaskType = "";
        this.MaskDataSign = "";
        //
        // Default MaxLength
        this.MaxLength = -1;
        //
        if (RD3_Glb.IsMobile())
          this.IntCtrl.style.overflowY = "scroll";
        //
        // Ho creato il controllo
        created = true;
      }
    }
    //
    // Ripristino elemento selezionato
    if (wasfoc)
      RD3_KBManager.ActiveElement = this.GetDOMObj();
    //
    // La cella contiene INPUT/TEXTAREA
    this.IsReadOnly = false;
  }
  //
  // Ora questa cella usa questo controllo
  this.ControlType = 2;   // VISCTRL_EDIT
  this.NumRows = nr;
  //
  // Per gli INPUT posso calcolare la maschera
  if (!this.IsReadOnly)
  {
    // Maschera solo per gli INPUT
    if (this.NumRows==1)
    {
      // In QBE non metto la maschera...
      if (inqbe)
      {
        this.Mask = "";
        this.MaskType = "";
        this.MaskDataSign = "";
      }
      else
      {
        // Vediamo se ho gia' calcolato la maschera... se non l'ho fatto o e' cambiato qualcosa
        // la ricalcolo
        var dynmask = this.GetDynPropSign().split("|")[4];
        var maskSign = pf.DataType + "|" + pf.MaxLength + "|" + pf.Scale + "|" + vs.GetMask() + "|" + dynmask;
        if (this.MaskDataSign != maskSign)
        {
          if (dynmask != "")
            this.ApplyDynPropToVisualStyle(vs);
          //
          var newMask = vs.ComputeMask(pf.DataType, pf.MaxLength, pf.Scale);
          //
          // Se sono attiva devo disattivarmi e ri-attivarmi (per la maschera)
          var reActivate = false;
          if (RD3_DesktopManager.WebEntryPoint.HilightedCell==this && newMask!=this.Mask)
          {
            // Se ho modificato il VS la SetInactive riesegue l'apply sporcando le variabili memorizzate, quindi le devo pulire e poi reimpostare
            if (dynmask != "")
              this.CleanVisualStyle(vs);
            //
            reActivate = true;
            this.SetInactive();
            //
            if (dynmask != "")
              this.ApplyDynPropToVisualStyle(vs);
          }
          //
          this.Mask = newMask;
          this.MaskType = vs.ComputeMaskType(pf.DataType);
          this.MaskDataSign = maskSign;
          //
          if (dynmask != "")
            this.CleanVisualStyle(vs);
          //
          if (reActivate)
            this.SetActive();
        }
      }
    }
    //
    // Se cambia lo stato enabled
    if (this.IsEnabled != en || created)
    {
      this.IsEnabled = en;
      //
      // Se il VS non ha un suo cursor, applico il default
      if (vs.GetCursor()=="")
        this.IntCtrl.style.cursor = (this.IsEnabled ? "" : "default");
    }
    //    
    // Mi preparo per gestire il watermark
    var newText = this.PValue.Text;
    var mustHaveWatermark = false;
    //
    // Scopro se su questa cella devo gestire il watermark: preparo gia' il testo
    if (newText=="" && this.ParentField.CellMustHaveWaterMark(en, inqbe, this.InList, this.PValue.Index, this))
    {
      newText = this.ParentField.WaterMark;
      mustHaveWatermark = true;
    }
    //    
    // In QBE (e watermark su safari..) va tolto il MaxLength...
    var newML = (inqbe || (mustHaveWatermark && (RD3_Glb.IsChrome() || RD3_Glb.IsSafari())) ? -1 : pf.MaxLength);
    if (this.MaxLength != newML)
    {
      this.MaxLength = newML;
      //      
      if (this.MaxLength <= 0)
        this.IntCtrl.removeAttribute("maxLength");
      else
        this.IntCtrl.setAttribute("maxLength", this.MaxLength);
    }
    //
    // Adesso gestisco il watermark vero e proprio, aggiungendo o togliendo la classe
    if (mustHaveWatermark != this.HasWatermark)
    {
      // Aggiungo la classe all'input
      if (mustHaveWatermark)
        RD3_Glb.AddClass(this.IntCtrl, "panel-field-value-watermark");
      else 
        RD3_Glb.RemoveClass(this.IntCtrl, "panel-field-value-watermark");
      //
      this.HasWatermark = mustHaveWatermark;
    }
    //
    // Se sono password e sono fuocata e mi danno tutti * e io ho gia' un valore,
    // allora non devo mettere il nuovo testo
    if (vs.IsPassword() && RD3_KBManager.ActiveElement==this.IntCtrl && this.Text!="")
    {
      // Tengo il testo scritto dall'utente solo se il server mi manda 
      // qualcosa di diverso da '********' e "" (stringa vuota)
      var mantieni = (newText != "");
      for (var idx = 0; idx<newText.length; idx++)
      {
        if (newText.substr(idx,1)!="*")
        {
          mantieni=false;
          break;
        }
      }
      if (mantieni)
        newText = this.Text;
    }
    //
    // Gestisco il valore. Se e' cambiato
    if (this.Text != newText)
    {
      var toupdate = created || cloned || !this.IsUncommitted();
      //
      // Lo aggiorno
      this.Text = newText;
      //
      // Se ci sono cambiamenti nel testo inseriti dall'utente,
      // non voglio che il server mi mangi quello che l'utente sta facendo!
      if (toupdate)
        this.IntCtrl.value = newText;
      //
      // Se non ho ricreato l'elemento ed il fuoco e' sul controllo che e'
      // abilitato e ha una maschera... riapplico la maschera
      if (newText=="" && !created && this.Mask && RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement==this.IntCtrl)
        mc(this.Mask, this.MaskType, null, this.IntCtrl);
      //
      // Se e' cambiato il valore mentre il calendario era aperto, aggiorno il calendario
      if (RD3_Glb.IsDateTimeObject(pf.DataType) && RD3_KBManager.ActiveElement == this.IntCtrl && !RD3_Glb.IsMobile())
      {
        if (document.getElementById("calpopup").style.display != "none")
          ShowCalendar(this.IntCtrl, this.Mask);
      }
    }
  }
  else // READONLY -> Span
  {
    // Se e' cambiato il testo lo aggiorno
    if (this.Text != this.PValue.Text)
    {
      // Devo mostrare il testo come HTML nello span
      this.Text = this.PValue.Text;
      this.IntCtrl.innerHTML = this.PValue.Text;
      //
      // IE<10 non supporta pre-wrap
      if (RD3_Glb.IsIE(10, false))
        this.IntCtrl.style.whiteSpace = (nr == 1 ? "nowrap" : "normal");
      else
        this.IntCtrl.style.whiteSpace = (nr == 1 ? "nowrap" : "pre-wrap");
      //
      // CKEditor deve wrappare
      if (pf.EditorType == 1)
        this.IntCtrl.style.whiteSpace = "normal";
    }
    //
    // La cella non e' abilitata
    this.IsEnabled = false;
  }
  //
  // Verifico attivatore
  var actimg = this.PValue.ActivatorImage(vs);
  if (actimg == "")
  {
    // Non c'e' l'immagine dell'attivatore.. Se ce l'avevo ed e' visibile lo nascondo
    if (this.ActObj!=null && this.ActObjVisible)
    {
      // L'attivatore non deve essere mostrato, ma e' gia' presente, lo nascondo
      this.ActObj.style.display = "none";
      this.ActObjVisible = false;
      //
      // E' stato nascosto l'attivatore... adatto l'input
      this.AdaptInputForAct();
    }
  }
  else // C'e' l'immagine dell'attivatore
  {
    // Se non ho ancora creato l'oggetto lo faccio ora
    if (this.ActObj==null)
    {
      this.ActObj = document.createElement("DIV");
      this.ActObj.className = "panel-value-activator";
      this.SetZIndex(this.ActObj);
      //
      this.ActObj.style.width = (pf.GetActivatorWidth(this) + 2) + "px";
      //
      // Spingo aggiornamento altezza attivatore
      this.CtrlRectH = 0;
      //
      // Lo inserisco vicino all'oggetto originale
      if (!this.IsFluidCell())
        parent.insertBefore(this.ActObj, this.IntCtrl.nextSibling);
      else {
        // Nel caso di cella fluida lo inserisco all'interno della cella
        // in modo che non si aggiunga alla table
        this.IntCtrl.appendChild(this.ActObj);
        this.ActObj.className += " fluid-activator";
      }
      //
      // Inizializzo i dati specifici dell'attivatore
      this.ActObjVisible = true;
      this.ActObjSrc = "";
      this.ActPos = 1;
      this.ActObjX = 0;
      this.ActObjY = 0;
      this.ActObjW = pf.GetActivatorWidth(this)+2;
      this.ActObjCurs = "";
      //
      // E' nato l'attivatore... adatto l'input
      this.AdaptInputForAct();
    }
    //
    // Lo riaggancio, potrei averlo perso modificando il value
    if (this.IsFluidCell())
      this.IntCtrl.appendChild(this.ActObj);
    //
    // Aggancio la gestione del click se c'e' l'attivatore ed e' stato clonato o non ha un suo click 
    // (si verifica anche se apro una videata, attacco il prototipo al vs, chiudo la videata e la riapro: il prototipo non ha gli eventi e non funzionano gli attivatori)  
    if (!this.ActObj.onclick)
      this.ActObj.onclick = function(ev) { parentContext.OnClickActivator(ev); };
    //
    // Ora aggiorno l'attivatore: Immagine
    if (this.ActObjSrc != actimg)
    {
      this.ActObjSrc = actimg;
      var imgurl = "url("+RD3_Glb.GetAbsolutePath()+"images/" + encodeURI(this.ActObjSrc) + ")";
      if (RD3_Glb.IsMobile() && pf.ActImage!="")
        this.ActObj.style.setProperty("background-image",imgurl,"important");
      else
        this.ActObj.style.backgroundImage = imgurl;
    }
    //
    // Visible e Cursore
    var s = null;
    if (this.ActObjVisible != this.PValue.IsVisible())
    {
      this.ActObjVisible = this.PValue.IsVisible();
      if (!s) s = this.ActObj.style;
      s.display = (this.ActObjVisible ? "" : "none");
      //
      // E' stato reso visibile l'attivatore... adatto l'input
      this.AdaptInputForAct();
    }
    var cur = (en || (pf.CanActivate && pf.ActivableDisabled))? "pointer":"";
    if (this.ActObjCurs != cur)
    {
      this.ActObjCurs = cur;
      if (!s) s = this.ActObj.style;
      s.cursor = this.ActObjCurs;
    }
    //
    // Verifico la posizione dell'attivatore
    var actpos = this.PValue.ActivatorPosition(vs);
    if (actpos != this.ActPos)
    {
      this.ActPos = actpos;
      //
      // Devo riposizionare l'attivatore
      this.ActObjX = -1;
      //
      // L'attivatore ha cambiato lato, devo adattare l'input
      this.AdaptInputForAct();
    }
  }
  //
  // Applico lo stile visuale
  if (this.UpdateVisualStyle(vs, this.ActObj))
  {
    // L'attivatore non vuole il bordo sx/dx
    if (this.ActObj)
    {
      if (this.ActPos==1)
        this.ActObj.style.borderRight = "";
      else
        this.ActObj.style.borderLeft = "";
      //
      // Inoltre, se la cella ha un colore di sfondo trasparente
      // l'attivatore non puo' coprire il suo bordo... meglio toglierlo!
      if (this.ActObjVisible && this.IntCtrl.style.backgroundColor == "transparent")
      {
        if (this.ActPos==1)
          this.IntCtrl.style.borderLeft = "none";
        else
          this.IntCtrl.style.borderRight = "none";
      }
    }
  }
  //
  if (this.PValue.Badge != this.Badge)
  {
    this.Badge = this.PValue.Badge;
    //
    if (this.Badge == "")
    {
      if (this.BadgeObj != null && this.BadgeObj.parentNode)
        this.BadgeObj.parentNode.removeChild(this.BadgeObj);
      //  
      this.BadgeObj = null;
      this.BadgeObjX = null;
      this.BadgeObjY = null;
    }
    else
    {
      if (this.BadgeObj == null)
      {
        this.BadgeObj = document.createElement("div");
        this.BadgeObj.className = "badge-grey";
        this.BadgeObj.style.position = "absolute";
        //
        if (RD3_Glb.IsMobile())
          this.BadgeObj.style.marginTop = "6pt";
        //
        this.SetZIndex(this.BadgeObj);
        parent.appendChild(this.BadgeObj);
      }
      //
      this.BadgeObj.innerHTML = this.Badge;
    }
  }
  //
  // Verifico l'allineamento: se allineamento=auto
  var a = null;
  if (this.PValue && this.PValue.Alignment != -1)
    a = this.PValue.Alignment;
  else if (this.ParentField.Alignment != -1)
    a = this.ParentField.Alignment;
  else
    a = vs.GetAlignment(1);
  if (a==1)
  {
    // Aveva l'allineamento automatico... controllo se va bene
    var al = pf.IsRightAligned()?"right":"left";
    if (this.ValueAlign != al)
    {
      this.ValueAlign = al;
      this.IntCtrl.style.textAlign = al;
    }
  }
  //
  // Se ho creato la cella, devo agganciare gli eventi
  if (created || (cloned && !ie))
  {
    // Attacco l'evento di onchange
    var oc = function(ev) { RD3_KBManager.IDRO_OnChange(ev); };
    if (ie)
      this.IntCtrl.attachEvent("onchange",oc);
    else
      this.IntCtrl.onchange = oc;
    //
    if (!ie)
    {
      var fo = function(ev) { RD3_KBManager.IDRO_GetFocus(ev); };
      var lo = function(ev) { RD3_KBManager.IDRO_LostFocus(ev); };
      //
      // Solo IE ha gli eventi (activate e deactivate) che informano i parent (bubble)
      if (this.IsReadOnly && !this.IsCellClickable)
      {
        this.IntCtrl.onclick = fo;
      }
      else
      {
        this.IntCtrl.onfocus = fo;
        //
        // su questi browser il click su un campo clicccabile non readonly non scatta con il tasto destro e se fatto con il sinistro arriva al server troppo tardi 
        // (il chgrow arriva dopo il click.. quindi il server non e' posizionato correttamente.. - solo se usi l'eveto onMouseClick - raw)
        if ((RD3_Glb.IsFirefox() || RD3_Glb.IsChrome() || RD3_Glb.IsSafari()) && this.IsCellClickable)
          this.IntCtrl.onmousedown = fo;   
        //
        this.IntCtrl.onblur = lo;
      }
      //
      // In firefox l'evento di doppio click non arriva al body
      if (RD3_Glb.IsFirefox(3))
      {
        var dc = function(ev) { RD3_KBManager.IDRO_DoubleClick(ev); };
        this.IntCtrl.ondblclick = dc;
      }
    }
    //
    if (RD3_Glb.IsMobile() && !RD3_Glb.IsIE())
    {
      if (this.NumRows > 1)
        this.IntCtrl.addEventListener("keyup", new Function("ev", "return RD3_KBManager.TextAreaMobileKeyUp(ev)"), false);
    }
  }  
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}


// *****************************************************************
// Renderizzo un campo tramite COMBO
// *****************************************************************
PCell.prototype.RenderCombo = function(vs, parent, cloned)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var inqbe = this.PValue.InQBE();
  var ie = RD3_Glb.IsIE();
  //
  var en = this.PValue.IsEnabled();
  var created = false;
  //
  // Vediamo se l'elemento che sto trattando era quello attivo
  var wasfoc = false;
  //
  // Se il controllo presente nella cella non e' COMBO devo cambiare qualcosa
  if (this.ControlType != 3)        // VISCTRL_COMBO
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
    {
      wasfoc = (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement==this.GetDOMObj());
      this.ClearElement(true);
    }
  }
  //
  // Se il controllo presente nella cella non e' COMBO... lo creo
  if (this.ControlType != 3)    // VISCTRL_COMBO
  {
    this.IntCtrl = new IDCombo(this);
    this.IntCtrl.Realize(parent, (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form"));
    //
    // Una nuova combo parte abilitata
    this.IsEnabled = true;
    //
    // Ripristino elemento selezionato
    if (wasfoc)
      RD3_KBManager.ActiveElement = this.IntCtrl.GetDOMObj();
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 3;
    //
    // Ho creato il controllo
    created = true;
  }
  //
  // Applico lo stile visuale
  if (this.UpdateVisualStyle(vs))
    this.IntCtrl.SetVisualStyle(vs, true, true);
  //
  // Aggiorno lo stato della combo
  var vl = this.PValue.GetValueList();
  this.IntCtrl.ListOwner = !pf.LKE;
  this.IntCtrl.AllowFreeText = pf.LKE || pf.HasValueSource;
  this.IntCtrl.SetShowValue((pf.HasValueSource && !pf.SuperActive) || (!pf.ShowDescription(vs) && pf.ShowValue(vs)));
  this.IntCtrl.IsOptional = this.PValue.IsComboOptional();
  this.IntCtrl.SetRightAlign(this.ListQBECell ? false : pf.IsRightAligned());
  this.IntCtrl.SetHasActivator(this.PValue.ActivatorImage(vs), pf.GetActivatorWidth(this), pf.ActivableDisabled, cloned);
  this.IsCellClickable = pf.IsComboClickable(this.PValue.Index, vs)&&(this.PValue.Text && this.PValue.Text.length>0);
  this.IntCtrl.SetComboClickable(this.IsCellClickable);
  this.IntCtrl.MultiSel = pf.ComboMultiSel && inqbe;
  this.IntCtrl.ValueSep = pf.ComboValueSep;
  this.IntCtrl.UsePopover = !pf.VisSlidePad();
  this.IntCtrl.SetBadge(this.PValue.Badge);
  //
  // Le ValueSource gestiscono l'input mascherato (se non e' attiva la multiselezione)
  var forceMasked = false;
  if (pf.HasValueSource && !this.IntCtrl.MultiSel)
  {
    // Vediamo se ho gia' calcolato la maschera... se non l'ho fatto o e' cambiato qualcosa
    // la ricalcolo
    var maskSign = pf.DataType + ":" + pf.MaxLength + ":" + pf.Scale;
    var dynmask = this.GetDynPropSign().split("|")[4];
    if (this.MaskDataSign != maskSign || dynmask != "")
    {
      if (dynmask != "")
        this.ApplyDynPropToVisualStyle(vs);
      //
      this.Mask = vs.ComputeMask(pf.DataType, pf.MaxLength, pf.Scale);
      this.MaskType = vs.ComputeMaskType(pf.DataType);
      this.MaskDataSign = maskSign;
      //
      if (dynmask != "")
        this.CleanVisualStyle(vs);
    }
    //
    // Se il campo non ha maschera, voglio comunque che sia "attivo"
    if (this.Mask == "")
      forceMasked = true;
  }
  else
  {
    this.Mask = "";
    this.MaskType = "";
    this.MaskDataSign = "";
    //
    // Per una ValueSource in QBE e' necessario applicare la maschera, perche' altrimenti non viene attaccato l'evento di 
    // IDRO_OnChange
    if (pf.HasValueSource && this.IntCtrl.MultiSel)
      forceMasked = true;
  }
  //
  // Informo la combo se l'input e' mascherato
  this.IntCtrl.SetMasked(this.Mask != "" || forceMasked);
  //
  // Se e' cambiata la visibilita' o lo stato di scrivibile della COMBO, la aggiorno
  if (this.IsEnabled != en)
  {
    this.IntCtrl.SetEnabled(en);
    this.IsEnabled = en;
  }
  //
  // Se la cella e' in QBE o il campo e' opzionale, e c'e' una lista verifico se la lista possiede la riga vuota
  if ((inqbe || pf.Optional) && vl && !this.PValue.ValueList && vl.ItemList[0] && vl.ItemList[0].Value != "")
  {
    // Manca il valore vuoto... lo inserisco io
    vl.ItemList.splice(0, 0, new ValueListItem());
    //
    // Mi ricordo che ho aggiunto un item fittizio... lo rimuovero' appena esco dal QBE
    vl.AddedEmptyQBEItem = true;
  }
  else if (!inqbe && !pf.Optional && vl && vl.AddedEmptyQBEItem)
  {
    // Non sono piu' in QBE ed il campo non e' opzionale. Se avevo inserito un valore vuoto... lo elimino
    vl.ItemList.splice(0, 1);
    //
    vl.AddedEmptyQBEItem = false;
  }
  //
  // Aggiorno la ValueList della combo
  var oldopen = this.IntCtrl.IsOpen;
  //
  // Ci sono casi in cui non posso applicare la value lista del server.
  // In particolare in caso di query value source con combo aperta e server
  // che mi dice che non ho piu' la lista.
  var updatevl = true;
  if (oldopen && !vl && pf.HasValueSource)
    updatevl=false;
  //
  if (updatevl)
    this.IntCtrl.AssignValueList(vl, created || cloned);
  //
  // Mi preparo per gestire il watermark
  var newText = this.PValue.Text;
  if (newText=="" && !this.IntCtrl.IsOpen && this.ParentField.CellMustHaveWaterMark(en, inqbe, this.InList, this.PValue.Index, this))
  {
    newText = this.ParentField.WaterMark;
    this.HasWatermark = true;
  }
  else
    this.HasWatermark = false;
  //
  // Nel caso mobile non chiudo la combo che sta su una pagina separata
  var closecombo = !RD3_Glb.IsMobile();
  if (this.HasWatermark != this.IntCtrl.HasWatermark)
  {
    if (this.HasWatermark)
      this.IntCtrl.SetWatermark();
    else if (this.IntCtrl.HasWatermark) // HasWatermark puo' essere undefined: pero' devo rimuoverlo solo se presente
    {
      this.IntCtrl.RemoveWatermark();
      // 
      // Avevo il watermark e ora l'ho tolto; quindi cambiero' il text e questo fara' chiudere la combo se aperta..
      // allora devo verificare se la combo e' stata aperta in questa richiesta, se si non la devo far chiudere
      if (!oldopen && this.IntCtrl.IsOpen)
        closecombo = false;
    }
  }
  //
  // Se il testo e' rimasto lo stesso e non sono clonata, non ho il watermark e sono una Autolookup verifico se
  // e' cambiata la decodifica, in quel caso forzo la riscrittura del testo
  var dochange = false;
  if (newText == this.Text && !cloned && !this.HasWatermark && !pf.LKE && !pf.HasValueSource)
  {
    dochange = this.IntCtrl.OriginalText != this.IntCtrl.GetComboFinalName(this.IntCtrl.ShowValue);
    //
    // Se il valore e' "" potrei mostrare la decodifica oppure no, dipende se nella lista c'e' un valore opzionale e se sono su una riga in inserimento o meno.
    // Devo quindi provare a vedere se c'e' il valore vuoto e se e' decodificabile.. ma e' un codice molto complesso e deve occuparsene IDCombo...
    // Ma siccome e' tutto dentro SetText la soluzione migliore e' farlo girare sempre se c'e' un valore di decodifica per il testo vuoto!
    // In QBE non forzo il sistema, lo lascio fare quello che deve
    if (!inqbe && !dochange && this.Text == "" && this.IntCtrl.OptionList)
      dochange = this.IntCtrl.OptionList.FindItemsByValue("", false, this.IntCtrl.ValueSep).length > 0;
  }
  //
  // Se e' cambiato il valore, lo imposto
  // Aggiorno anche in caso di clonazione in quanto potrebbe essere passata AutoLookup a non
  if (newText != this.Text || cloned || dochange)
  {
    // Non aggiorno le combo aperte!
    var toupdate = !this.IntCtrl.IsOpen && (created || cloned || !pf.SuperActive || (pf.SuperActive && !this.IntCtrl.IsOpen));
    //
    // Caso specifico: la combo e' aperta ma il server mi ha mandato esplicitamente la lista vuota. Se il Text e' diverso da "" allora la chiudo e mostro il nuovo testo
    // e' diversa dal caso sotto perche' in quel caso la lista e' stata persa e non rimandata mentre adesso e' stata proprio tolta
    if (!toupdate && this.IntCtrl.IsOpen && pf.LKE && this.PValue && this.PValue.ValueListCleared && this.Text !== "")
      toupdate = true;
    //
    // Caso speciale : una LKE senza lista valori gia' aperta va chiusa (l'utente ha scritto qualcosa che il server non ha riconosciuto e ha mandato lista vuota
    // se la combo e' su una nuova riga viene chiusa - vedi this.Text=="" - altrimenti rimane aperta con la lista vecchia ma non funzionante - viene visualizzata la 
    // lista vecchia ma la combo non ce l'ha quindi su giu' e click non vanno , questo perche' il keyup svuota la optionList senza cancellare gli oggetti 
    // corrispondenti dal DOM - )
    if (!toupdate && this.IntCtrl.IsOpen && pf.LKE && !vl && this.Text !== "") {
      // Non chiudo la combo, la lascio aperta in modo che l'utente non perda quello che ha scritto.. ma se il Body della combo contiene righe lo svuoto, 
      // perche' adesso la lista DEVE essere vuota
      try {
        var tBody;
        var tObj = this.IntCtrl.ComboTbl;
        //
        if (tObj)
          tBody = tObj.tBodies[0];
        if (tBody) {
          // Svuoto le righe
          while (tBody.rows.length > 0)
            tBody.deleteRow(0);
        }
      }
      catch (ex) {

      }
    }
    //
    this.Text = newText;
    //
    // Vediamo se devo informare la combo che il testo e' cambiato... C'e' solo un caso in cui 
    // non voglio farlo: LKE attiva mentre l'utente scrive... Se l'utente ha scritto qualcosa
    // che non da' risultati il server invia "" ma io voglio lasciare li' il testo... 
    // cosi' l'utente lo puo' correggere.
    // Mi devo poi ricordare della cosa perche' se l'utente cambia cella o preme un tasto funzione
    // il testo deve svuotarsi, sempre se e' ancora la cella attiva
    if (this.ComboEditing && this.Text=="" && RD3_DesktopManager.WebEntryPoint.HilightedCell==this)
    {
      // Informo la combo che non le ho ancora fornito il valore EMPTY
      // Lo fara' lei quando verra' deselezionata o verra' premuto un tasto funzione
      this.IntCtrl.DeferEmptyCombo();
    }
    else
    {
      // Passo il testo alla combo. 
      // ATTENZIONE: La proprieta' this.Text contiene il valore dell'item e non il testo dell'item
      if (toupdate)
        this.IntCtrl.SetText(this.Text, true, closecombo);
    }
    //
    // La combo non e' piu' in fase di editing
    this.ComboEditing = false;
  }
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  // Se ZEN e la combo e' stata clonata, meglio controllare le dimensioni
  if (RD3_ServerParams.Theme.startsWith("zen") && cloned) 
  {
     this.IntCtrl.SetWidth(this.IntCtrl.Width);
     this.IntCtrl.SetHeight(this.IntCtrl.Height);

  }
  //
  return created;
}

// *****************************************************************
// Renderizzo un campo COMBO disabilitato
// *****************************************************************
PCell.prototype.RenderDisabledCombo = function(vs, parent, cloned)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var inqbe = this.PValue.InQBE();
  var ie = RD3_Glb.IsIE();
  //
  var created = false;
  //
  // Se il controllo presente nella cella non e' DISABLEDCOMBO devo svuotare tutta la cella
  if (this.ControlType != 30)
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
      this.ClearElement(true);
  }
  //
  // Se il controllo presente nella cella non e' DISABLEDCOMBO... lo creo
  var img = null;
  var span = null;
  if (this.ControlType != 30)
  {
    // Creo un DIV che contiene il controllo
    this.IntCtrl = document.createElement("div");
    this.IntCtrl.className = (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
    parent.appendChild(this.IntCtrl);
    //
    // Creo l'immagine
    img = document.createElement("img");
    this.IntCtrl.appendChild(img);
    img.className = "combo-img-dis";
    if (RD3_Glb.IsMobile() && pf.VisOnlyIcon())
      img.style.position = "absolute";
    else
      img.style.position = "relative";
    if (RD3_Glb.IsIE(10, false))
      img.style.verticalAlign = "text-bottom";
    //
    // Creo lo span
    span = document.createElement("span");
    span.className = "combo-input";
    this.IntCtrl.appendChild(span);
    //
    // Alle combo disabilitate metto sempre l'ellipsis (se non mostrano solo l'icona)
    if ((RD3_Glb.IsMobile() || RD3_Glb.IsTouch()) && !pf.VisOnlyIcon())
      RD3_Glb.AddClass(this.IntCtrl, "panel-value-html");
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 30;
    //
    // Ho creato il controllo
    created = true;
  }
  else
  {
    // La combo disabled esiste gia'... Recupero i puntatori agli oggetti interni
    img = this.IntCtrl.firstChild;
    span = img.nextSibling;
  }
  //
  // Ora recupero i dati
  var vl = this.PValue.GetValueList();
  var selit = (vl ? vl.FindItemsByValue(this.PValue.Text, false) : null);
  var newtxt;
  var newimg;
  var newtip;
  //
  // Le lookup hanno questo comportamento particolare : se c'e' la combo di edit aperta il server rimanda la lista
  // ma in quel caso noi NON dobbiamo scrivere la decodifica perche' altrimenti la tabella si sfasa ed e' brutto.
  // Quindi:
  // - se siamo una cella di lista fluida
  // - se c'e' una cella di edit legata al nostro PValue ed e' combo
  // - se le combo e' aperta
  //
  // -> annullo l'item selezionato e mostro il valore
  if (this.IsFluidCell() && this.PValue.ValueListType == 3 && RD3_DDManager.OpenListFormCell && RD3_DDManager.OpenListFormCell.PValue == this.PValue && RD3_DDManager.OpenListFormCell.ControlType == 3 && (RD3_DDManager.OpenCombo || RD3_DDManager.OpenListFormCell.IntCtrl.ActClicked))
    selit = null;
  //
  if (!selit || selit.length==0)
  {
    // Se non c'e' piu' la lista o non ho trovato il valore -> la cella e' vuota,
    // ma se il VS dice che devo mostrare la descrizione mostro comunque il Text del PValue
    newtxt = (pf.ShowDescription(vs) ? this.PValue.Text : "");
    newimg = "";
    newtip = "";
  }
  else
  {
    // Recupero i dettagli dall'item selezionato
    newtxt = (pf.ShowDescription(vs) ? selit[0].Name : (pf.ShowValue(vs) ? selit[0].Value : ""));
    newimg = (selit[0].Image != "" && vs.ShowImage() ? selit[0].Image : "");
    newtip = selit[0].Tooltip;
  }
  //
  // Aggiorno l'immagine (uso il LEFT per ricordarmi che non la voglio vedere (vedi HideCellContent))
  if (newimg != "")
  {
    img.src = RD3_Glb.GetImgSrc("images/"+newimg);
    img.style.display = "";
    img.style.left = "";
    this.ForeImage = newimg;
  }
  else
  {
    img.style.display = "none";
    img.style.left = "-999px";
    this.ForeImage = "";
  }
  //
  // Aggiorno il testo
  if (this.Text != newtxt)
  {
    this.Text = newtxt;
    //
    if (RD3_Glb.IsIE(10, false))
      span.innerText = newtxt;
    else
      span.textContent = newtxt;
    //
    // Preparo per l'editing della combo che viene renderizzata come disabilitata
    if (RD3_Glb.IsMobile())
      span.value = newtxt;
  }
  //
  // Aggiorno il tooltip
  this.SetTooltip(newtip);
  //
  var act = this.ParentField.ParentPanel.ActualPosition;
  var row = this.PValue.Index - act;
  //
  // In un pannello gruppato per sapere a quale riga sono devo: trovare la riga equivalente al PValue 
  // e sottrarre la riga equivalente dell'ActualPosition nella visione compatta
  if (this.ParentField.ParentPanel.IsGrouped() && this.ParentField.InList && this.ParentField.ListList)
    row = this.ParentField.ParentPanel.GetRowForIndex(this.PValue.Index);
  var newRow = this.ParentField.ParentPanel.IsNewRow(act, row);
  //
  // Click sulla combo disabilitata
  //
  // Combo disabilitata per QBE in lista, se e' disabilitata significa gia' che il campo non puo' cercare in QBE,
  // Non puo' nemmeno ordinare (perche' con il QBEROW l'ordinamento si gestisce dall'header)
  // Quindi si aprirebbe un popup vuoto, che non ha senso.. percio' non lo facciamo aprire
  var canclick = (pf.CanActivate && pf.ActivableDisabled) && pf.VisHyperLink(vs) && !newRow && !this.ListQBECell;
  if (canclick != this.IsCellClickable || created || cloned)
  {
    this.IsCellClickable = canclick;
    //
    var curs;
    if (canclick)
    {
      var parentContext = this.ParentField;
      var fo = function(ev) { parentContext.OnClickActivator(ev); };
      //
      // I vari browser non gestiscono l'onfocus se non su un INPUT/TEXTAREA/SELECT
      // Quindi attacco l'onclick al div!
      this.IntCtrl.onclick = fo;
      curs = "pointer";
    }
    else
    {
      this.IntCtrl.onclick = null;
      curs = "default";
    }
    //
    if (RD3_Glb.IsMobile())
    {
      if (canclick)
        RD3_Glb.AddClass(this.IntCtrl,"panel-value-clickable");
      else
        RD3_Glb.RemoveClass(this.IntCtrl,"panel-value-clickable");
    }
    //
    this.IntCtrl.style.cursor = curs;
    //
    if ((selit && selit.length>0) || (newtxt && newtxt.length>0) || cloned)
    {
      img.style.cursor = curs;
      span.style.cursor = curs;
    }
  }
  //
  if (this.PValue.Badge != this.Badge)
  {
    this.Badge = this.PValue.Badge;
    //
    if (this.Badge == "")
    {
      if (this.BadgeObj != null && this.BadgeObj.parentNode)
        this.BadgeObj.parentNode.removeChild(this.BadgeObj);
      //  
      this.BadgeObj = null;
      this.BadgeObjX = null;
      this.BadgeObjY = null;    
    }
    else
    {
      if (this.BadgeObj == null)
      {
        this.BadgeObj = document.createElement("div");
        this.BadgeObj.className = "badge-grey";
        this.BadgeObj.style.position = "absolute";
        //
        if (RD3_Glb.IsMobile())
          this.BadgeObj.style.marginTop = "6pt";
        //
        this.SetZIndex(this.BadgeObj);
        parent.appendChild(this.BadgeObj);
      }
      //
      this.BadgeObj.innerHTML = this.Badge;
    }
  }
  //
  if (this.IsFluidCell() && !this.IsCellClickable) 
  {
    // Sono una combo abilitata ma mostrata in lista fluida, quindi appaio disabilitata.
    // In questo caso devo:
    // -> agganciare gli eventi di click
    // -> creare l'attivatore
    if (created || cloned || !this.IntCtrl.onclick)
    {
      var fo = function (ev) { RD3_KBManager.IDRO_GetFocus(ev); };
      this.IntCtrl.onclick = fo;
      this.IntCtrl.className += " combo-fluid-list-cell";
    }
    //
    var actimg = this.PValue.ActivatorImage(vs) || (this.PValue.IsEnabled() && this.ParentField.ValueList ? "aeco.gif" : "");
    if (actimg == "")
    {
      // Non c'e' l'immagine dell'attivatore.. Se ce l'avevo ed e' visibile lo nascondo
      if (this.ActObj != null && this.ActObjVisible) {
        // L'attivatore non deve essere mostrato, ma e' gia' presente, lo nascondo
        this.ActObj.style.display = "none";
        this.ActObjVisible = false;
      }
    }
    else
    {
      // Se non ho ancora creato l'oggetto lo faccio ora
      if (this.ActObj == null) 
      {
        this.ActObj = document.createElement("DIV");
        this.ActObj.className = "panel-value-activator fluid-activator";
        this.SetZIndex(this.ActObj);
        this.ActObj.style.width = (pf.GetActivatorWidth(this) + 2) + "px";
        this.ActObjVisible = true;
      }
      //
      this.IntCtrl.appendChild(this.ActObj);
      //
      // Aggancio la gestione del click se c'e' l'attivatore ed e' stato clonato o non ha un suo click 
      // (si verifica anche se apro una videata, attacco il prototipo al vs, chiudo la videata e la riapro: il prototipo non ha gli eventi e non funzionano gli attivatori)  
      var parFld = this.ParentField;
      if (!this.ActObj.onclick)
        this.ActObj.onclick = function (ev) { parFld.OnClickActivator(ev); };
      //
      //
      // Ora aggiorno l'attivatore: Immagine
      if (this.ActObjSrc != actimg) {
        this.ActObjSrc = actimg;
        var imgurl = "url(" + RD3_Glb.GetAbsolutePath() + "images/" + encodeURI(this.ActObjSrc) + ")";
        if (RD3_Glb.IsMobile() && pf.ActImage != "")
          this.ActObj.style.setProperty("background-image", imgurl, "important");
        else
          this.ActObj.style.backgroundImage = imgurl;
      }
      //
      // Visible e Cursore
      var s = null;
      if (this.ActObjVisible != this.PValue.IsVisible()) {
        this.ActObjVisible = this.PValue.IsVisible();
        if (!s) s = this.ActObj.style;
        s.display = (this.ActObjVisible ? "" : "none");
      }
      //
      this.UpdateVisualStyle(vs, this.ActObj);
    }
  }
  //
  // Aggiorno lo stato ENABLED
  this.IsEnabled = false;
  //
  // Applico lo stile visuale
  this.UpdateVisualStyle(vs);
  //
  // Se non ho una immagine non ho bisogno del padding
  if (RD3_Glb.IsMobile() && newimg == "")
    span.style.paddingLeft = "0px";
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}

// *****************************************************************
// Renderizzo un campo tramite CHECK
// *****************************************************************
PCell.prototype.RenderCheck = function(vs, parent, cloned)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var inqbe = this.PValue.InQBE();
  var ie = RD3_Glb.IsIE(10, false);
  //
  var nr = (this.InList)?pf.ListNumRows:pf.FormNumRows;
  var en = this.PValue.IsEnabled();
  var vis = (this.InList && pf.ListList && this.PValue.Index>1 && pp.Status==RD3_Glb.PS_QBE ? false : true);
  var created = false;
  //
  // Se il controllo presente nella cella non e' CHECK devo cambiare qualcosa
  if (this.ControlType != 4)        // VISCTRL_CHECK
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
      this.ClearElement(true);
  }
  //
  // Se il controllo presente nella cella non e' CHECK... lo creo
  if (this.ControlType != 4)    // VISCTRL_CHECK
  {
    // Creo il DIV che conterra' l'INPUT
    this.IntCtrl = document.createElement("div");
    this.IntCtrl.className = (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
    parent.appendChild(this.IntCtrl);
    //
    // Poi creo l'INPUT (se mobile, un DIV per lo switch)
    if (RD3_Glb.IsMobile())
    {
      this.SubIntCtrl = document.createElement("div");
      this.SubIntCtrl.checked = true;
      if (RD3_Glb.IsQuadro())
      {
        var vl = this.PValue.GetValueList();
        //
        // Nel tema quadro, voglio costruire tutto il check io stesso
        var intdiv = document.createElement("div");
        intdiv.className = "radio-int-div";
        var s1 = document.createElement("span");
        s1.className = "radio-int-s1";
        s1.innerText =  (vl.ItemList.length>0)?vl.ItemList[0].Name:"ON";
        var s2 = document.createElement("span");
        s2.className = "radio-int-s2";
        var s3 = document.createElement("span");
        s3.className = "radio-int-s3";
        s3.innerText = (vl.ItemList.length>1)?vl.ItemList[1].Name:"OFF";
        intdiv.appendChild(s1);
        intdiv.appendChild(s2);
        intdiv.appendChild(s3);
        this.SubIntCtrl.appendChild(intdiv);
      }
      else
      {
        // E' necessario uno span "a perdere" per avere un bordo
        this.SubIntCtrl.appendChild(document.createElement("span"));
      }
    }
    else
    {
      this.SubIntCtrl = document.createElement("input");
      this.SubIntCtrl.type = "checkbox";
    }
    this.IntCtrl.appendChild(this.SubIntCtrl);
    this.SubIntCtrl.className = "panel-value-check";
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 4;
    //
    // Posizionamento default controllo interno
    this.SubCtrlRectX = 0;
    this.SubCtrlRectY = 0;
    this.SubCtrlRectW = 0;
    this.SubCtrlRectH = 0;
    //
    // Ho creato il controllo
    created = true;
    //
    // Il controllo lo creo abilitato, quindi per gestire correttamente l'abilitazione mi devo memorizzare lo stato corretto
    this.IsEnabled = true;
  }
  //
  // Se e' cambiata la visibilita' o lo stato di scrivibile del CHECK, lo aggiorno
  if (this.IsEnabled != en)
  {
    this.SubIntCtrl.disabled = !en;
    this.IsEnabled = en;
    if (RD3_Glb.IsMobile())
      this.SubIntCtrl.style.cursor = en?"":"default";
    //
    // Nel caso il check sia disabled permettiamo al DIV di prendere il fuoco
    if (!en)
      this.IntCtrl.tabIndex = 100;
    else
      this.IntCtrl.removeAttribute("tabIndex");
  }
  if (this.IsCtrlVisible != vis)
  {
    this.SubIntCtrl.style.visibility = (vis ? "" : "hidden");
    this.IsCtrlVisible = vis;
  }
  //
  var ie6checked = false;
  //
  // Se e' cambiato il valore, lo imposto
  if (this.PValue.Text != this.Text)
  {
    this.Text = this.PValue.Text;
    var vl = this.PValue.GetValueList();
    if (vl)
    {
      // Se era stato aggiunto un item vuoto dalla RenderCombo, lo tolgo
      if (vl.AddedEmptyQBEItem && vl.ItemList[0] && vl.ItemList[0].Value == "")
      {
        vl.ItemList.splice(0, 1);
        vl.AddedEmptyQBEItem = false;
      }
      //
      vl.SetCheck(this.SubIntCtrl, this.Text, inqbe);
      //
      // Se non sono in QBE il Text "---" non viene accettato, quindi devo annullarlo in modo che 
      // - se riscatta la render in QBE verra' impostato nuovamente
      // - la change funzionera'
      if (this.Text === "---" && !inqbe)
        this.Text = "";
      //
      // Su IE6 non si riesce a rendere checked un oggetto se viene spostato nel DOM
      if (RD3_Glb.IsIE(6) && this.Text == vl.ItemList[0].Value)
      {
        var oh = this.SubIntCtrl.outerHTML;
        this.SubIntCtrl.outerHTML = oh.substring(0, oh.length-1) + " checked>";
        this.SubIntCtrl = this.IntCtrl.firstChild;
        ie6checked = true;
      }
    }
  }
  //
  // Applico lo stile visuale
  this.UpdateVisualStyle(vs);
  //
  // Appendo eventi
  if (created || (cloned && !ie) || ie6checked)
  {
    var parFld = this.ParentField;
    var isListQBE = this.ListQBECell;
    var oc = function (ev) { parFld.OnThreeStateCheck(ev, isListQBE); RD3_KBManager.IDRO_OnChange(ev); };
    //
    // Deve prima scattare il cambio riga e poi il click; quindi occorre dare il fuoco e (per IE)
    // dare il tempo che questo venga gestito prima di cliccare il controllo
    var ocb = function(ev) 
    { 
      var srcobj=(window.event)?window.event.srcElement:ev.explicitOriginalTarget; 
      if (srcobj.hasChildNodes())
      {
        if (srcobj.childNodes[0].disabled) 
        {
          // Se il check non e' abilitato non puo' prendere il fuoco, pero'
          // possiamo comunque provare a far cambiare riga al pannello
          RD3_KBManager.IDRO_GetFocus(null, srcobj.childNodes[0]);
        }
        else 
        {
          srcobj.childNodes[0].focus();
          //
          // Per IE, perche' funzioni bene il cambio riga + selezione bisogna dargli tempo
          window.setTimeout(function () {
            srcobj.childNodes[0].click();
          }, 0);
        }
      }
    };
    //
    if (ie)
    {
      this.SubIntCtrl.attachEvent("onclick",oc);
      this.IntCtrl.attachEvent("onclick",ocb);
    }
    else
    {
      if (RD3_Glb.IsMobile())
        this.IntCtrl.onclick = function(ev) { parFld.OnToggleCheck(ev); };
      else
      {      
        this.SubIntCtrl.onclick = oc;
        this.IntCtrl.onclick = ocb;
      }
    }
    //    
    if (!ie)
    {
      var fo = function(ev) { RD3_KBManager.IDRO_GetFocus(ev); };
      var lo = function(ev) { RD3_KBManager.IDRO_LostFocus(ev); };
      //
      // Solo IE ha gli eventi (activate e deactivate) che informano i parent (bubble)
      this.SubIntCtrl.onfocus = fo;
      this.SubIntCtrl.onblur = lo;
      //
      // In firefox l'evento di doppio click non arriva al body
      if (RD3_Glb.IsFirefox(3))
      {
        var dc = function(ev) { RD3_KBManager.IDRO_DoubleClick(ev); };
        this.SubIntCtrl.ondblclick = dc;
      }
    }
  }
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}


// *****************************************************************
// Renderizzo un campo BLOB
// *****************************************************************
PCell.prototype.RenderBlob = function(vs, parent, cloned)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var inqbe = this.PValue.InQBE();
  var ie = RD3_Glb.IsIE();
  //
  var nr = (this.InList)?pf.ListNumRows:pf.FormNumRows;
  var en = this.PValue.IsEnabled();
  var inp = null;
  var ie = RD3_Glb.IsIE(10, false);
  var oldBlobMime = this.BlobCellType;
  var created = false;
  //
  // Se il controllo presente nella cella non e' BLOB devo svuotare tutta la cella
  if (this.ControlType != 10)
  {
    if (this.ControlType != -1)
      this.ClearElement(true);
  }
  else
  {
    // Il controllo e' gia' BLOB... vediamo se il contenuto della cella e' quello giusto
    if (this.BlobCellType != this.PValue.BlobMime)
    {
      // Il tipo di cella non e' corretto... svuoto il contenuto della cella
      if (this.SubIntCtrl)
      {
        this.SubIntCtrl.parentNode.removeChild(this.SubIntCtrl);
        this.SubIntCtrl = null;
        //
        // Annullo eventuali impostazioni fatte sui sub-controlli: le devo riapplicare se necessario (ho distrutto il controllo)
        this.SubCtrlRectIMG = null;
        this.SubCtrlRectW = null;
        this.SubCtrlRectH = null;
      }
      //
      this.BlobCellType = undefined;
    }
  }
  //
  // Se non ho ancora creato il contenuto
  if (!this.IntCtrl)
  {
    // Creo un DIV che contiene il controllo
    this.IntCtrl = document.createElement("div");
    this.IntCtrl.className = (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
    parent.appendChild(this.IntCtrl);
    //
    // Imposto overflow in base al campo
    this.IntCtrl.style.overflow = (nr>1) ? "auto":"hidden";
    //
    // Ho creato il controllo
    created = true;
  }
  //
  // In base al tipo di blob, renderizzo in modo diverso
  var mime = this.PValue.BlobMime;
  switch (mime)
  {
    case "upload": // Uploading di un blob
    {
      if (this.BlobCellType!=mime)
      {
        this.SubIntCtrl = document.createElement("form");
        this.SubIntCtrl.className = "panel-blob-form";
        this.SubIntCtrl.encoding = "multipart/form-data";
        this.SubIntCtrl.method = "post";
        this.SubIntCtrl.action = "?WCI=IWUpload&WCE=F"+pp.WebForm.IdxForm;
        this.SubIntCtrl.target = "blobframe";
        this.IntCtrl.appendChild(this.SubIntCtrl);
        //
        // Aggiungo gli elementi interni alla form
        var sp = document.createElement("div");
        sp.innerHTML = this.PValue.Text;
        this.Text = this.PValue.Text;
        this.SubIntCtrl.appendChild(sp);
        //
        if (ie)
        {
          inp = document.createElement("<input type=file name='blob'>");
          inp.style.position = "absolute";
        }
        else
        {
          inp = document.createElement("input");
          inp.name = "blob";
          inp.type = "file";
        }
        //
        inp.style.height = "19px";
        inp.style.width = (pf.GetValueWidth(this.InList, this) - 10); // Padding = 2px + 1px per evitare scrolling
        //
        if (window.RD4_Enabled)
        {
          // Attacco l'evento di onchange
          var oc = function(ev) { pf.HandleFileSelect(ev); };
          inp.addEventListener('change', oc, false);
        }
        //
        this.SubIntCtrl.appendChild(inp);
      }
    }
    break;
      
    case "text": // Blob di tipo testo
    {
      if (this.BlobCellType!=mime)
      {
        this.SubIntCtrl = document.createElement("p");
        this.SubIntCtrl.className = "panel-blob-text";
        this.SubIntCtrl.tabIndex = 0;
        this.IntCtrl.appendChild(this.SubIntCtrl);
      }
      //
      // Se e' cambiato il testo, lo aggiorno
      if (this.Text != this.PValue.Text)
      {
        this.Text = this.PValue.Text;
        this.SubIntCtrl.innerHTML = this.Text;
      }
    }
    break;
    
    case "image": // Blob di tipo immagine
    {
      if (this.BlobCellType!=mime)
      {
        this.SubIntCtrl = document.createElement("img");
        this.SubIntCtrl.className = "panel-blob-image";
        this.SubIntCtrl.tabIndex = 0;
        this.IntCtrl.appendChild(this.SubIntCtrl);
      }
      //
      // Se e' cambiata l'immagine, la aggiorno
      if (this.Text != this.PValue.Text)
      {
        this.Text = this.PValue.Text;
        this.SubIntCtrl.src = RD3_Glb.GetImgSrc(this.Text);
        //
        if (!RD3_Glb.IsIE(10, false))
          this.SubIntCtrl.onload = function(ev) { pf.BLOBImageReadyStateChanged(ev); };
        else
          this.SubIntCtrl.onreadystatechange = function(ev) { pf.BLOBImageReadyStateChanged(ev); };
      }
    }
    break;
    
    case "size": // blob non scaricato
    {
      if (this.BlobCellType!=mime)
      {
        this.SubIntCtrl = document.createElement("span");
        this.SubIntCtrl.className = "panel-blob-span";
        this.SubIntCtrl.tabIndex = 0;
        this.IntCtrl.appendChild(this.SubIntCtrl);
      }
      //
      // Gestisco il click sul link del blob
      if (this.BlobCellType!=mime || cloned)
        this.SubIntCtrl.onclick = function(ev) { pf.OnBlobCommand(ev, 'link'); };
      //
      // Se e' cambiato il testo, lo aggiorno
      if (this.Text != this.PValue.Text)
      {
        this.Text = this.PValue.Text;
        this.SubIntCtrl.innerHTML = this.Text;
      }
    }
    break;

    case "empty": // blob nullo
    {
      // Lascio il campo vuoto
      this.Text = "";
    }
    break;
    
    default: // Blob di tipo oggetto
    {
      if (this.BlobCellType!=mime)
      {
        this.SubIntCtrl = document.createElement("iframe");
        this.SubIntCtrl.className = "panel-blob-object";
        this.SubIntCtrl.style.width = "100%";
        this.SubIntCtrl.style.height = "100%";
        this.SubIntCtrl.frameBorder = "no";
        this.IntCtrl.appendChild(this.SubIntCtrl);
      }
      //
      // Se e' cambiato il testo, lo aggiorno
      if (this.Text != this.PValue.Text)
      {
        this.Text = this.PValue.Text;
        this.SubIntCtrl.src = this.Text;
      }
    }
    break;
  }
  //
  // Bene. Ora sono un BLOB nello stato giusto
  this.ControlType = 10;
  this.BlobCellType = mime;
  //
  // Aggiorno lo stato ENABLED
  this.IsEnabled = en;
  //
  // Applico lo stile visuale
  // Se c'e' un campo di INPUT (vedi caso "upload"), applico lo stile anche a lui
  this.UpdateVisualStyle(vs, inp);
  //
  // Eventi di focus
  if ((created || (cloned && !ie) || oldBlobMime == "empty") && (this.PValue.BlobMime=="text" || this.PValue.BlobMime=="image" || this.PValue.BlobMime=="size"))
  {
    var fo = function(ev) { RD3_KBManager.IDRO_GetFocus(ev); };
    var lo = function(ev) { RD3_KBManager.IDRO_LostFocus(ev); };
    //
    // Solo IE ha gli eventi (activate e deactivate) che informano i parent (bubble)
    this.SubIntCtrl.onfocus = fo;
    this.SubIntCtrl.onblur = lo;
    //
    // In firefox l'evento di doppio click non arriva al body
    if (RD3_Glb.IsFirefox(3))
    {
      var dc = function(ev) { RD3_KBManager.IDRO_DoubleClick(ev); };
      this.SubIntCtrl.ondblclick = dc;
    }
  }
  //
  if ((created || cloned) && this.ParentField.UseHTML5ForUpload())
  {
    var drp = function(ev) { pf.OnHTML5Drop(ev); };
    var drg = function(ev) { pf.OnHTML5Drag(ev); };
    this.IntCtrl.ondrop = drp;
    this.IntCtrl.ondragover = drg;
  }
  //
  // Aggiorno la toolbar del blob
  pf.UpdateToolbar();
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}

// *****************************************************************
// Renderizzo un campo tramite IDEditor
// *****************************************************************
PCell.prototype.RenderIDEditor = function(vs, parent, cloned)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var fck = null;
  var created = false;
  var wasfoc = false;
  //
  if (this.ControlType != 101)        // VISCTRL_FCK
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
    {
      wasfoc = (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement==this.GetDOMObj());
      this.ClearElement(true);
    }
  }
  //
  // La ClearElement lo rimette abilitato.. quindi imposto qui l'abilitazione corretta
  this.IsEnabled = this.PValue.IsEnabled();
  //
  // Se il controllo presente nella cella non e' FCK... lo creo
  if (this.ControlType != 101)    // VISCTRL_FCK
  {
    this.IntCtrl = new IDEditor(this);
    this.IntCtrl.Realize(parent, (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form"));
    //
    // Ripristino elemento selezionato
    if (wasfoc)
      RD3_KBManager.ActiveElement = this.IntCtrl.GetDOMObj();
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 101;
    //
    // Ho creato il controllo
    created = true;
  }
  //
  // Applico lo stile visuale
  var extObj = this.IntCtrl.Layout==1 ? this.IntCtrl.TextObj : this.IntCtrl.EditorObj;
  if (this.UpdateVisualStyle(vs, extObj))
    this.IntCtrl.SetVisualStyle(vs, true);
  //
  // Aggiorno lo stato..
  this.IntCtrl.SetHasToolbar(pf.ShowEditorTool);
  this.IntCtrl.SetEnabled(this.IsEnabled);
  this.IntCtrl.AssignFontList(pf.FontList);
  this.IntCtrl.AssignColorList(pf.ColorList);
  this.IntCtrl.AssignTokenList(pf.TokenList);
  this.IntCtrl.SetCommandEnabled(pf.EdToolCommands);
  this.IntCtrl.SetDefaultFormatting(pf.DefaultFormatting);
  //
  var newText = this.PValue.Text;
  if (newText != this.Text || cloned)
  {
    this.Text = newText;
    //
    // Se ci sono cambiamenti nel testo inseriti dall'utente,
    // non voglio che il server mi mangi quello che l'utente sta facendo!
    if (!this.IntCtrl.IsUncommited())
      this.IntCtrl.SetText(this.Text);
  }
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  this.IntCtrl.UpdateToolbar();
  //
  return created;
}

// *****************************************************************
// Renderizzo un campo tramite FCKEditor
// *****************************************************************
PCell.prototype.RenderFCK = function(vs, parent, cloned)
{
  // Per FCK guardo l'ultimo elemento della lista
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  this.IsEnabled = this.PValue.IsEnabled();
  var fck = null;
  var created = false;
  //
  // Se il controllo presente nella cella non e' FCKEDITOR ... devo cambiare qualcosa
  if (this.ControlType != 101)        // CAMPO FCK
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
      this.ClearElement(true);
  }
  //
  // Se il controllo presente nella cella non e' FCKEDITOR... lo creo
  if (this.ControlType != 101)        // CAMPO FCK
  {
    // Creo il DIV che conterra' l'FCK
    this.IntCtrl = document.createElement("div");
    this.IntCtrl.className = (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
    parent.appendChild(this.IntCtrl);
    //
    // Creo CKEditor
    RD3_Glb.AddClass(this.IntCtrl, "panel-field-value-htmleditor");
    //
    var nm = this.ParentField.Identifier + (this.InList ? ":lcke" : ":fcke" );
    this.SubIntCtrl = document.createElement("textarea");
    this.SubIntCtrl.name = nm;
    this.SubIntCtrl.id = nm;
    this.SubIntCtrl.style.visibility = "hidden";
    //
    // Metto il div e la Textarea nel body, altrimenti ckeditor non riesce a sostituire la Textarea (non la trova!)
    this.IntCtrl.appendChild(this.SubIntCtrl);
    document.body.appendChild(this.IntCtrl);
    CKEDITOR.replace(nm, this.CustomizeCK());
    //
    // Rimetto l'intctrl nella posizione giusta: si porta dietro sia la textarea sia CKEditor
    parent.appendChild(this.IntCtrl);
    // Accedo all'istanza dell'editor
    var inst = CKEDITOR.instances[nm];
    //
    // Attacco alla perdita del fuoco dell'editor il controllo se il valore e' cambiato
    var oc = function(ev) { pf.OnFCKSelectionChange(ev); };
    var of = function(ev) { RD3_KBManager.IDRO_GotFocusCK(ev); };
    var ir = function(ev) { RD3_KBManager.CKinstanceReady(ev); };
    //
    inst.on('instanceReady', ir);
    inst.on('blur', oc);
    if (!RD3_Glb.IsIE(10, false))
      inst.on('focus', of);
    //
    var lstgrp = this.ParentField.ParentPanel.ListGroupRoot;
    var act = this.ParentField.ParentPanel.ActualPosition;
    var row = this.PValue.Index - act;
    //
    // In un pannello gruppato per sapere a quale riga sono devo: trovare la riga equivalente al PValue 
    // e sottrarre la riga equivalente dell'ActualPosition nella visione compatta
    if (this.ParentField.ParentPanel.IsGrouped() && this.ParentField.InList && this.ParentField.ListList)
      row = this.ParentField.ParentPanel.GetRowForIndex(this.PValue.Index);
    //
    inst.RowNumber = row;
    //
    // Assegno il testo iniziale all'editor
    this.Text = this.PValue.Text;
    inst.setData(this.Text);
    //
    // Ora il controllo e' questo
    this.ControlType = 101;
    //
    // Ho creato il controllo
    created = true;
  }
  else
  {
    if (this.ParentField.FCKTimerID>0)
      window.clearTimeout(this.ParentField.FCKTimerID);
    //
    this.ParentField.FCKTimerID = window.setTimeout("RD3_DesktopManager.CallEventHandler('"+this.PValue.Identifier+"', 'SetFCK', null, " + this.InList + ")", 200);  
  }
  //
  // Applico lo stile visuale
  this.UpdateVisualStyle(vs);
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}


// ********************************************************
// Funzione Dummy per permettere la personalizzazione di
// una istanza di CKeditor
// ********************************************************
PCell.prototype.CustomizeCK = function()
{
  var conf = new Object();
  //
  // Dimensiono prendendo l'altezza del campo - altezza toolbar
  var h = this.ParentField.GetValueHeight(this.InList) - 105; 
  h = h<50 ? 50 : h;
  conf.height = h+"px";
  //
  // Disabilito il resize del CKEDITOR interno
  conf.resize_enabled = false;
  //
  return conf;
}


// *****************************************************************
// Renderizzo un campo tramite OPTION
// *****************************************************************
PCell.prototype.RenderOption = function(vs, parent, cloned)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var inqbe = this.PValue.InQBE();
  var ie = RD3_Glb.IsIE(10, false);
  //
  var nr = (this.InList)?pf.ListNumRows:pf.FormNumRows;
  var en = this.PValue.IsEnabled();
  var vis = (this.InList && pf.ListList && this.PValue.Index>1 && pp.Status==RD3_Glb.PS_QBE ? false : true);
  var created = false;
  //
  // Se il controllo presente nella cella non e' OPTION o sono su una riga nuova devo cambiare qualcosa
  if (this.ControlType != 5 || (!en && this.PValue.IsNewRow()))        // VISCTRL_OPTION
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
      this.ClearElement(true);
  }
  //
  // Recupero la ValueList... se non c'e'... e' meglio uscire!
  var vl = this.PValue.GetValueList();
  if (!vl)
    return;
  //
  // Se era stato aggiunto un item vuoto dalla RenderCombo, lo tolgo
  if (vl.AddedEmptyQBEItem && vl.ItemList[0] && vl.ItemList[0].Value == "")
  {
    vl.ItemList.splice(0, 1);
    vl.AddedEmptyQBEItem = false;
  }
  //
  // Se il controllo presente nella cella non e' OPTION... lo creo
  if (this.ControlType != 5)    // VISCTRL_OPTION
  {
    // Creo il DIV che conterra' gli OPTION
    this.IntCtrl = document.createElement("div");
    this.IntCtrl.className = (this.InList && this.ParentField.ListList ? "panel-field-value-list" : "panel-field-value-form");
    parent.appendChild(this.IntCtrl);
    //
    // Creo l'OPTION solo se la cella e' scrivibile o, se readonly, non sono su una nuova riga
    if (en || !this.PValue.IsNewRow())
    {
      vl.RealizeOption(this.PValue, this.IntCtrl, this.PValue.Text, nr>1, this.InList, en);
      this.Text = this.PValue.Text;
      this.OptionValueList = vl;
    }
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 5;
    //
    // Ho creato il controllo
    created = true;
  }
  else
  {
    // Se siamo in un Option ma ancora non abbiamo creato le option le dobbiamo creare
    if (this.IntCtrl.childNodes.length==0)
    {
      // Creo l'OPTION solo se la cella e' scrivibile o, se readonly, non sono su una nuova riga
      if (en || !this.PValue.IsNewRow())
      {
        vl.RealizeOption(this.PValue, this.IntCtrl, this.PValue.Text, nr>1, this.InList, en);
        this.Text = this.PValue.Text;
        this.OptionValueList = vl;
      }
    }
    else
    {
      // Se avevo una lista ed e' diversa da quella attuale devo ricreare le option
      if (this.OptionValueList && !this.OptionValueList.Equals(vl))
      {
        // Svuoto il Div
        this.IntCtrl.innerHTML = "";
        //
        // Creo l'OPTION solo se la cella e' scrivibile o, se readonly, non sono su una nuova riga
        if (en || !this.PValue.IsNewRow())
        {
          vl.RealizeOption(this.PValue, this.IntCtrl, this.PValue.Text, nr>1, this.InList, en);
          this.Text = this.PValue.Text;
          this.OptionValueList = vl;
        }
      }
      else if (this.PValue.Text != this.Text) // Option gia' creati, imposto solo il valore se e' cambiato
      {
        this.Text = this.PValue.Text;
        vl.SetOption(this.IntCtrl, this.Text);
      }
    }
  }
  //
  // Se e' cambiata la visibilita' o lo stato di scrivibile dell'OPTION, lo aggiorno
  if (this.IsEnabled != en || this.IsCtrlVisible != vis)
  {
    vl.EnableOption(this.IntCtrl, en, vis);
    //
    this.IsEnabled = en;
    this.IsCtrlVisible = vis;
  }
  //
  // Verifico attivatore
  var actimg = this.PValue.ActivatorImage(vs);
  if (actimg == "") 
  {
    // Non c'e' l'immagine dell'attivatore.. Se ce l'avevo ed e' visibile lo nascondo
    if (this.ActObj != null && this.ActObjVisible) 
    {
      // L'attivatore non deve essere mostrato, ma e' gia' presente, lo nascondo
      this.ActObj.style.display = "none";
      this.ActObjVisible = false;
      //
      // E' stato nascosto l'attivatore... adatto l'input
      this.AdaptInputForAct();
    }
  }
  else // C'e' l'immagine dell'attivatore
  {
    // Se non ho ancora creato l'oggetto lo faccio ora
    if (this.ActObj == null) 
    {
      this.ActObj = document.createElement("DIV");
      this.ActObj.className = "panel-value-activator";
      this.SetZIndex(this.ActObj);
      //
      this.ActObj.style.width = (pf.ActWidth + 2) + "px";
      //
      // Spingo aggiornamento altezza attivatore
      this.CtrlRectH = 0;
      //
      // Lo inserisco vicino all'oggetto originale
      parent.insertBefore(this.ActObj, this.IntCtrl.nextSibling);
      //
      // Inizializzo i dati specifici dell'attivatore
      this.ActObjVisible = true;
      this.ActObjSrc = "";
      this.ActPos = 2;
      this.ActObjX = 0;
      this.ActObjY = 0;
      this.ActObjW = pf.ActWidth + 2;
      this.ActObjCurs = "";
      //
      // E' nato l'attivatore... adatto l'input
      this.AdaptInputForAct();
    }
    //
    // Aggancio la gestione del click se c'e' l'attivatore ed e' stato clonato o non ha un suo click 
    // (si verifica anche se apro una videata, attacco il prototipo al vs, chiudo la videata e la riapro: il prototipo non ha gli eventi e non funzionano gli attivatori) 
    var parentContext = this.ParentField;
    if (!this.ActObj.onclick)
      this.ActObj.onclick = function (ev) { parentContext.OnClickActivator(ev); };
    //
    // Ora aggiorno l'attivatore: Immagine
    if (this.ActObjSrc != actimg) 
    {
      this.ActObjSrc = actimg;
      var imgurl = "url(" + RD3_Glb.GetAbsolutePath() + "images/" + encodeURI(this.ActObjSrc) + ")";
      if (RD3_Glb.IsMobile() && pf.ActImage != "")
        this.ActObj.style.setProperty("background-image", imgurl, "important");
      else
        this.ActObj.style.backgroundImage = imgurl;
    }
    //
    // Visible e Cursore
    var s = null;
    if (this.ActObjVisible != this.PValue.IsVisible()) 
    {
      this.ActObjVisible = this.PValue.IsVisible();
      if (!s) s = this.ActObj.style;
      s.display = (this.ActObjVisible ? "" : "none");
      //
      // E' stato reso visibile l'attivatore... adatto l'input
      this.AdaptInputForAct();
    }
    var cur = (en || (pf.CanActivate && pf.ActivableDisabled)) ? "pointer" : "";
    if (this.ActObjCurs != cur) 
    {
      this.ActObjCurs = cur;
      if (!s) s = this.ActObj.style;
      s.cursor = this.ActObjCurs;
    }
  }
  //
  // Applico lo stile visuale
  if (this.UpdateVisualStyle(vs, this.ActObj))
  {
    // L'attivatore non vuole il bordo sx/dx
    if (this.ActObj) 
    {
      if (this.ActPos == 1)
        this.ActObj.style.borderRight = "";
      else
        this.ActObj.style.borderLeft = "";
      //
      // Inoltre, se la cella ha un colore di sfondo trasparente
      // l'attivatore non puo' coprire il suo bordo... meglio toglierlo!
      if (this.ActObjVisible && this.IntCtrl.style.backgroundColor == "transparent") {
        if (this.ActPos == 1)
          this.IntCtrl.style.borderLeft = "none";
        else
          this.IntCtrl.style.borderRight = "none";
      }
    }
  }
  //
  // Se il radio e' disabilitato, gestisco l'onclick per fare il cambio riga
  if (!ie && !en && (created || cloned))
  {
    var fo = function(ev) { RD3_KBManager.IDRO_GetFocus(ev); };
    //
    // I vari browser non gestiscono l'onfocus se non su un INPUT/TEXTAREA/SELECT
    // Quindi attacco l'onclick al div!
    this.IntCtrl.onclick = fo;
  }
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}


// *****************************************************************
// Creo i controlli per un campo tramite BUTTON
// *****************************************************************
PCell.prototype.RenderButton = function(vs, parent, cloned)
{
  if (this.IsFluidCell())
    return this.RenderFluidButton(vs, parent, cloned);
  //
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var ie = RD3_Glb.IsIE();
  //
  var en = pf.IsCellClickable(this.PValue.Index, vs);
  var created = false;
  //
  // Se il controllo presente nella cella non e' BUTTON devo cambiare qualcosa
  if (this.ControlType != 6)        // VISCTRL_BUTTON
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
      this.ClearElement(true);
    //
    // Creo INPUT
    this.IntCtrl = document.createElement("input");
    this.IntCtrl.type = "button";
    this.IntCtrl.className = "panel-value-button"
    //
    parent.appendChild(this.IntCtrl);
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 6;
    //
    // Ho creato il controllo
    created = true;
    //
    // Il controllo lo creo abilitato, quindi per gestire correttamente l'abilitazione mi devo memorizzare lo stato corretto
    this.IsEnabled = true;
  }
  //
  if (created || cloned || this.IsEnabled != en)
  {
    if (en)
    {
      this.IntCtrl.style.cursor = "pointer";
      this.IntCtrl.onclick = function(ev) { pf.OnClickActivator(ev); };
    }
    else
    {
      this.IntCtrl.style.cursor = "default";
      this.IntCtrl.onclick = null;
    }
  }
  //
  // Se e' cambiata l'abilitazione del BUTTON, lo aggiorno
  if (this.IsEnabled != en)
  {
    this.IntCtrl.disabled = !en;
    this.IsEnabled = en;
  }
  //
  // Se e' cambiato il valore, lo imposto
  if (this.PValue.Text != this.Text)
  {
    this.Text = this.PValue.Text;
    this.IntCtrl.value = this.Text;
  }
  //
  // Applico lo stile visuale
  this.UpdateVisualStyle(vs);
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}


// *****************************************************************
// Renderizzo un campo custom
// *****************************************************************
PCell.prototype.RenderCustom = function(vs, parent, cloned)
{
  var pf = this.ParentField;
  var en = this.PValue.IsEnabled();
  var inqbe = this.PValue.InQBE();
  var created = false;
  //
  // Vediamo se l'elemento che sto trattando era quello attivo
  var wasfoc = false;
  //
  // Se il controllo presente nella cella non e' CUSTOM devo cambiare qualcosa
  if (this.ControlType != 8)        // VISCTRL_CUSTOM
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
    {
      wasfoc = (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement==this.GetDOMObj());
      this.ClearElement(true);
    }
  }
  //
  // Se il controllo presente nella cella non e' CUSTOM... lo creo
  if (this.ControlType != 8)    // VISCTRL_CUSTOM
  {
    this.IntCtrl = CustomElement.createByName(this.PValue.CustomElement.className, this);
    this.IntCtrl.CopyFrom(this.PValue.CustomElement);
    this.IntCtrl.Realize(parent, (this.InList ? "panel-field-value-list" : "panel-field-value-form"));
    //
    // Un nuovo elemento custom parte abilitato
    this.IsEnabled = true;
    //
    // Ripristino elemento selezionato
    if (wasfoc)
      RD3_KBManager.ActiveElement = this.IntCtrl.GetDOMObj();
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 8;
    //
    // Ho creato il controllo
    created = true;
  }
  else
    this.IntCtrl.CopyFrom(this.PValue.CustomElement);
  //
  // Applico lo stile visuale
  if (this.UpdateVisualStyle(vs))
    this.IntCtrl.SetVisualStyle(vs, true, true);
  //
  // Se e' cambiata la visibilita' o lo stato di scrivibile, la aggiorno
  if (this.IsEnabled != en)
  {
    this.IntCtrl.SetEnabled(en);
    this.IsEnabled = en;
  }
  //
  // Gestisco il watermark
  var mustHaveWatermark = this.ParentField.CellMustHaveWaterMark(en, inqbe, this.InList, this.PValue.Index, this);
  var pl = this.ParentField.WaterMark ? this.ParentField.WaterMark : "";
  if (mustHaveWatermark != this.HasWatermark  || (this.HasWatermark && mustHaveWatermark && this.IntCtrl.WaterMark !== pl)) {
    if (mustHaveWatermark)
      this.IntCtrl.SetWatermark(this.ParentField.WaterMark);
    else
      this.IntCtrl.RemoveWatermark();
    this.HasWatermark = mustHaveWatermark;
  }
  //
  var newText = this.PValue.Text;
  //
  // Se e' cambiato il valore, lo imposto
  if (newText != this.Text || cloned)
  {
    this.Text = newText;
    //
    // Passo il testo all'elemento
    this.IntCtrl.SetText(this.Text);
  }
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  // Aggiorno il custom element
  this.IntCtrl.UpdateCell();
  // Sono una cella fluid in lista che contiene un elemento, in questo caso
  // ho bisogno di un RESIZEOBSERVER che quando cambio larghezza causa FLEX me lo dica 
  // in modo da gestire il resize
  // 
  // Lo faccio solo per le form perche' gli oggetti normali dovrebbero essere gia' flexati e quindi non dovrebbe essere necessario
  if (this.IsFluidCell() && this.ParentField && this.ParentField.ListHResMode == RD3_Glb.RESMODE_STRETCH && this.IntCtrl instanceof CustomElementSubForm) 
  {
    this.FluidResizeObserver = new ResizeObserver(function (entries, obs) {
      var nw = -1;
      //
      if (entries.length > 0) {
        var entry = entries[0];
        if (entry.contentBoxSize) {
          if (entry.contentBoxSize[0]) {
            nw = entry.contentBoxSize[0].inlineSize;
          } else {
            // legacy
            nw = entry.contentBoxSize.inlineSize;
          }
        } else {
          // ancora piu' legacy
          nw = entry.contentRect.width;
        }
      }
      //
      if (nw > 0) {
        this.CtrlRectW = nw;
        this.IntCtrl.SetWidth(nw);
        this.IntCtrl.UpdateCell();
      }
    }.bind(this));
    //
    this.FluidResizeObserver.observe(this.IntCtrl.GetDOMObj());
  }
  //
  return created;
}


// *********************************************
// Elimino tutto contenuto della cella
// *********************************************
PCell.prototype.ClearElement = function(keeppos)
{
  // La clear fa tornare l'elemento visible, quindi se sono fluida devo dichiarare che il padre contiene elementi visbili
  if (this.IsFluidCell() && this.InList && this.IntCtrl.parentNode)
    RD3_Glb.SetClass(this.IntCtrl.parentNode, "subrow-empty", false);
  //
  // Rimuovo il IntCtrl
  if (this.IntCtrl)
  {
    // Se contenevo un DIV "fittizio" dovro' riapplicare le coordinate X e Y
    // Lo stesso devo fare se sto "sostituendo" un controllo con un altro (in questo caso solo se sono gia' stato posizionato prima...)
    if (this.ControlType == 999 || (keeppos && (this.CtrlRectX || this.CtrlRectY || this.Positioned) && this.FixRectX==undefined))
    {
      this.FixRectX = this.CtrlRectX;
      this.FixRectY = this.CtrlRectY;
    }
    //
    if (this.ControlType != 3 && this.ControlType != 8)   // COMBO, CUSTOM
    {
      if (this.ControlType == 101)
      {
        if (RD3_ServerParams.UseIDEditor)
        {
          this.IntCtrl.Unrealize();
        }
        else
        {
          var nm = this.ParentField.Identifier + (this.InList ? ":lcke" : ":fcke" );
          var ed = CKEDITOR.instances[nm];
          //
          if (ed)
          {
             try {
              document.body.appendChild(this.IntCtrl);
              ed.destroy(true);
            } catch(ex) {}
            try {
              CKEDITOR.remove(nm);
            } catch(ex) {}
          }
        }
      }
      //
      if (this.IntCtrl.parentNode)
        this.IntCtrl.parentNode.removeChild(this.IntCtrl);
      //
      if (this.ActObj)
      {
        if (this.ActObj.parentNode)
          this.ActObj.parentNode.removeChild(this.ActObj);
        this.ActObj = null;
      }
      if (this.ErrorBox)
      {
        if (this.ErrorBox.parentNode)
          this.ErrorBox.parentNode.removeChild(this.ErrorBox);
        this.ErrorBox = null;
      }
      //
      // Gestione pannelli gruppati, elimino solo i puntatori, perche' gli oggetti sono dentro a IntCtrl
      if (this.GroupCollapseButton)
      {
        this.GroupCollapseButton = null;
        this.GroupCollapseSrc = "";
      }
      if (this.GroupLabel)
      {
        this.GroupLabel = null;
        this.leftPadding = 0;
      }
      if (this.GroupId)
        this.GroupId = null;
      //
      if (this.OptionValueList)
        this.OptionValueList = null;
      //
      if (this.BadgeObj)
      {
        if (this.BadgeObj != null && this.BadgeObj.parentNode)
          this.BadgeObj.parentNode.removeChild(this.BadgeObj);
        this.BadgeObj = null;
        this.BadgeObjX = null;
        this.BadgeObjY = null;
        this.Badge = "";
      }
      //
      if (this.TooltipDiv)
      {
        if (this.TooltipDiv.parentNode)
          this.TooltipDiv.parentNode.removeChild(this.TooltipDiv);
        this.TooltipDiv = null;
        this.Tooltip = "";
      }
      //
      if (this.PopupControlReadOnly)
        this.PopupControlReadOnly = false;
    }
    else
      this.IntCtrl.Unrealize();
    //
    this.IntCtrl = null;
    this.SubIntCtrl = null;   // Mi dimentico anche di eventuali sotto-controlli interni
  }
  //
  if (this.ClassName)
    delete this.ClassName;
  //
  // Resetto alcune proprieta'
  this.InitProperties();
  //
  this.HasWatermark = false;
}


// *********************************************
// Posiziono il DIV
// *********************************************
PCell.prototype.UpdateDims = function(x, y)
{
  // Nel caso di pannello fluido e cella in lista uso la funzione specifica
  if (this.IsFluidCell())
  {
    this.UpdateFluidDims();
    return;
  }
  // Se non ho il controllo interno, non posso applicare subito le modifiche... 
  // lo devo fare piu' tardi... quando verra' creato il controllo
  if (!this.IntCtrl)
  {
    // OK... non c'e' il controllo... non mi hanno dato le dimensioni... non faccio nulla!
    if (x!=undefined)
    {
      this.FixRectX = x;
      this.FixRectY = y;
    }
  }
  else
  {
    // Se mi posizionano in 0-0 mi ricordo che mi hanno posizionato, altrimenti in questo caso
    // non riesco a distinguere tra cella posizionata o nuova..
    if (x==0 && y==0)
      this.Positioned = true;
    //
    var pf = this.ParentField;
    var w = pf.GetValueWidth(this.InList, this);
    //
    // Se sono l'header dei gruppi in lista (pannelli gruppati) allora devo allargarmi per mostrarlo
    if (this.ControlType == 111 && this.EnlargeCell)
    {
      // Per prima cosa divento grande come tutta la lista
      w = this.ParentField.ParentPanel.ListWidth - 1 - this.leftPadding;
      //
      // Ciclo su tutti i campi in lista fino a trovare il primo che ha una aggregazione:
      // l'intestazione arriva fino a lui..
      var nfld = this.ParentField.ParentPanel.Fields.length;
      for (var fld = 0; fld<nfld;fld++)
      {
        var fldt = this.ParentField.ParentPanel.Fields[fld];
        if (this.ParentField.ParentPanel.AdvTabOrder)
          fldt = this.ParentField.ParentPanel.ListTabOrder[fld];
        //
        if (fldt && fldt.InList && fldt.ListList && fldt.PGroupListLeft)
        {
          if (this.PValue.Aggregations[fldt.Index]!=null)
          {
            w = fldt.PGroupListLeft - this.leftPadding;
            if (w<=0)
              w = pf.GetValueWidth(this.InList);
            //
            break;
          }
        }
      }
      //
      // Su ZEN i gruppi sono troppo larghi a causa dei bordi custom
      if (RD3_ServerParams.Theme.startsWith("zen"))
        w -= 10;
      //
      // Adesso adatto l'input (9 di immagine, 4 di padding, 5 di margine di sicurezza)
      var winp = w - (RD3_ServerParams.Theme.startsWith("zen") ? 22 : 18);
      if (winp<=0)
        winp = 0;
      this.GroupLabel.style.width = winp + "px";
      //
      this.EnlargeCell = false;
    }
    //
    var h = pf.GetValueHeight(this.InList, this);
    //
    // Se mi avevano dato la posizione quando ancora non c'ero... uso quella posizione
    // Altrimenti uso quelle che mi hanno dato come parametri
    var flForceRepos = false;
    if (this.FixRectX!=undefined) 
    { 
      x = this.FixRectX;
      y = this.FixRectY;
      flForceRepos = true;
    }
    //
    // Sistemo il TOP/LEFT
    var st = null;
    if (x!=undefined && (flForceRepos || this.CtrlRectX != x))
    {
      this.CtrlRectX = x;
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
      {
        if (!st) st = this.IntCtrl.style;
        //
        // Attivatore a SX
        if (this.ActObj && this.ActObjVisible && this.ActPos==1)   // SX
          st.left = (x + this.ParentField.GetActivatorWidth(this) + 2) + "px";
        else
          st.left = x + "px";
      }
      else
        this.IntCtrl.SetLeft(x);
      
    }
    if (y!=undefined && (flForceRepos || this.CtrlRectY != y))
    {
      this.CtrlRectY = y;
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
      {
        if (!st) st = this.IntCtrl.style;
        st.top = y + "px";
      }
      else
        this.IntCtrl.SetTop(y);
    }
    //
    // Padding da fornire alla cella (solo su Mobile qualora sia presente un attivatore o un badge)
    var padLeft  = 0;
    var padRight = 0;
    //
    // Se c'e' l'attivatore, sistemo anche a lui
    if (this.ActObj && this.ActObjVisible)
    {
      // Stringo il campo per rendere non accessibile la zona sotto all'attivatore
      // Nel caso mobile, invece, l'attivatore e' trasparente quindi paddo l'input
      if (!RD3_Glb.IsMobile())
        w -= pf.GetActivatorWidth(this) + (this.ActPos==1 ? 2 : (RD3_ServerParams.Theme.startsWith("zen") && this.InList ? 8 : 1));    // Per ZEN devo tenere conto del padding destro del campo
      else
      {
        if (this.ActPos == 1)   // Campo allineato a destra, attivatore a sinistra
          padLeft += pf.GetActivatorWidth(this) + 2;
        else
          padRight += pf.GetActivatorWidth(this) + 1;
      }
      //
      // ActivatorX
      if (this.ActObjX != this.CtrlRectX + (this.ActPos==1 ? 0 : w-1))
      {
        this.ActObjX = this.CtrlRectX + (this.ActPos==1 ? 0 : w-1);
        this.ActObj.style.left = this.ActObjX + "px";
      }
      //
      // ActivatorY
      if (this.ActObjY != this.CtrlRectY)
      {
        this.ActObjY = this.CtrlRectY;
        this.ActObj.style.top = this.ActObjY + "px";
      }
      //
      // ActivatorW
      if (this.ActObjW != pf.GetActivatorWidth(this)+2)
      {
        this.ActObjW = pf.GetActivatorWidth(this)+2;
        this.ActObj.style.width = this.ActObjW + "px";
      }
    }
    //
    // Solo se sono EDIT o Disabled combo
    // (le combo lo fanno da se')
    if (this.ControlType == 2 || this.ControlType == 30)
    {
      // Se c'e' il badge, sistemo anche lui
      if (this.Badge && this.BadgeObj)
      {
        var badgeW = RD3_Glb.GetBadgeWidth(this.Badge, "grey") + 4;     // +2px per lato
        var badX = this.CtrlRectX + w - badgeW;
        var badY = this.CtrlRectY + 2;
        //
        // Stringo il campo e rendo non accessibile la zona sotto il badge
        if (RD3_Glb.IsMobile())
        {
          // Se c'e' l'attivatore a destra devo mettermi alla sua sinistra
          if (this.ActObj && this.ActObjVisible && this.ActPos!=1)
          {
            badX -= this.ActObjW + 12;      // l'attivatore su mobile ha un margin -27px
            //
            // Aumento ulteriormente il padding right per lo spazio tra i 2 oggetti: attivatore e badge
            padRight += badgeW + 4;
          }
          else
          {
            // Ci sono solo io... Aumento il padding right per rendere inaccessibile il badge
            // (non paddo per tutto il badge dato che c'e' gia' il padding-right del campo che, comunque, io mantengo
            // e che quindi e' gia' incluso)
            padRight += badgeW - 8;
          }
          //
          if (this.InList && this.ParentField)
          {
            // Se sono l'ultimo campo in lista ed il pannello ha la scrollbar mi sposto in pochino a sinistra
            var idp = this.ParentField.ParentPanel;
            if (idp.GetLastListField() == this.ParentField && idp.HasScrollbar)
            {
              badX -= 30;
              padRight += 30;
            }
          }
        }
        //
        if (this.BadgeObjX != badX)
        {
          this.BadgeObjX = badX;
          this.BadgeObj.style.left = this.BadgeObjX + "px";
        }
        if (this.BadgeObjY != badY)
        {
          this.BadgeObjY = badY;
          this.BadgeObj.style.top = this.BadgeObjY + "px";
        }
      }
      //
      if (RD3_Glb.IsMobile() && (padLeft || padRight))
      {
        // Do' un padding -> devo ridurre la larghezza per lasciare tutto inalterato
        w -= padLeft + padRight;
        //
        // Aggiungo il padding "standard" dello stile visuale (per non mangiarmelo)
        var vs = this.PValue ? this.PValue.GetVisualStyle() : this.ParentField.VisualStyle;
        padLeft  += (vs.GetCustomPadding(2)*96/288); // fattore di conversione px/quarti di pt
        padRight += (vs.GetCustomPadding(4)*96/288);
        //
        if (padLeft != this.PaddingLeft)
        {
          this.PaddingLeft = padLeft;
          this.IntCtrl.style.paddingLeft  = padLeft + "px";
        }
        if (padRight != this.PaddingRight)
        {
          this.PaddingRight = padRight;
          this.IntCtrl.style.paddingRight = padRight + "px";
        }
      }
    }
    //
    // Calcolo i padding/bordi
    //   Input/Textarea: Padding 2px +1px (solo su !Mobile)
    //   Altri: 1px bordo
    //
    var margx = ((this.ControlType==2 && !RD3_Glb.IsMobile()) ? 5 : 1);
    var margy = ((this.ControlType==2 && !RD3_Glb.IsMobile()) ? 5 : 1);
    var margya = 1;
    //
    // Se sono l'header di un gruppo non metto bordi..
    if (this.ControlType == 111)
      margx = 0;
    //
    if (this.ControlType == 6)
    {
      margx = -1;
      margy = RD3_ServerParams.Theme.startsWith("zen") ? 1 : -1;
    }
    else
    {
      // Quando calcolo i margini gestisco anche il tipo di bordo
      var vs = this.PValue ? this.PValue.GetVisualStyle() : this.ParentField.VisualStyle;
      var bid = (this.InList)? 1 : 6; // VISBDI_VALUE : VISBDI_VALFORM
      var bt = vs.GetBorders(bid);
      switch(bt)  
      {
        case 1: // VISBRD_NONE = 1;
          margx = margx - 1;
          margy = margy - 1;
        break;
        case 2: // VISBRD_HORIZ = 2;
          margx = margx - 1;
        break;
        case 3: // VISBRD_VERT = 3;
          margy = margy - 1;
        break;
        case 4: // VISBRD_FRAME = 4;
          if ((this.ControlType == 4 || this.ControlType == 5) && RD3_ServerParams.Theme.startsWith("zen"))
            margy = 3; // bordo + bordo + limite
        break;
        case 9: // VISBRD_CUSTOM = 9;
          margx = vs.GetOffset(true, 1, this.InList, false)-1;
          margy = vs.GetOffset(false, 1, this.InList, false)-1;
          if (!RD3_Glb.IsMobile())
            margya = margy;
          //
          // Per ZEN arrotondo i margini dei bordi custom, altrimenti i bordi delle celle non is sovrappongono correttamente
          if (RD3_ServerParams.Theme.startsWith("zen"))
          {
            margx = Math.floor(margx);
            margy = Math.floor(margy);
            margya = Math.floor(margya);
            //
            // Per i pannelli gruppati uso 1px di margine
            if (this.ControlType == 111)
              margy = margya = 1;
          }
        break;
      }
    }
    //
    // Se e' il giro di resize a causa della SetInactive della cella e ho
    // l'attivatore devo ricalcolarne l'altezza
    if (this.CtrlRectH==-1 && this.ActObj)
      this.ActObj.style.height = (this.ParentField.GetValueHeight(this.InList, this)-margy) + "px";
    //
    // Se c'e' l'ErrorBox (e non e' un aggiornamento dovuto alla focusbox)
    if (this.ErrorBox && this.CtrlRectH>0)
    {
      this.ErrorBox.style.left = this.CtrlRectX + "px";
      this.ErrorBox.style.top = (this.CtrlRectY+this.CtrlRectH+margy-2) + "px";
      this.ErrorBox.style.width = (this.CtrlRectW + (this.ActObj && this.ActObjVisible ? pf.GetActivatorWidth(this)+2 : 0) + (this.ControlType==2 ? 5 : 1)) + "px";    // 1px bordo + 2px padding per input
    }
    //
    // Se mi hanno dato X e Y, devo solo riposizionare la cella quindi ho finito
    if (x!=undefined && !flForceRepos)
    {
      if (RD3_Glb.IsMobile() && this.Tooltip!="")
      {
        // Spingo aggiornamento tooltip che prima non poteva avvenire
        var s = this.Tooltip;
        this.Tooltip = "";
        this.SetTooltip(s,true);
      }
      return;
    }
    //
    // Nel caso combo viene messo un bordo aggiuntivo internamente.. devo verificare se forzare il ridimensionamento
    var adaptW = false;
    if (this.ControlType == 3 && this.InList)   // COMBO InLIST
    {
      // Il margine ci deve essere per tutti i campi in lista tranne l'ultimo
      var marLeft = 1;
      if (this.InList && this.ParentField.ParentPanel.GetLastListField() == this.ParentField)
        marLeft = 0;
      //
      // Se il margine che devo applicare e' diverso da quello presente sulla combo allora rifaccio adattare la dimensione (anche se 
      // non e' cambiata)
      adaptW = (marLeft != this.IntCtrl.ComboMarLeft);
    }
    // Devo sistemare anche le dimensioni del controllo
    if (this.CtrlRectW != w-margx || adaptW)
    {
      this.CtrlRectW = w-margx;
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
      {
        if (!st) st = this.IntCtrl.style;
        st.width = (this.CtrlRectW<0 ? 0 : this.CtrlRectW) + "px";
        //
        if (this.ErrorBox)
          this.ErrorBox.style.width = (this.CtrlRectW + (this.ActObj && this.ActObjVisible ? pf.GetActivatorWidth(this)+2 : 0) + (this.ControlType==2 ? 5 : 1)) + "px";    // 1px bordo + 2px padding per input
      }
      else
        this.IntCtrl.SetWidth(this.CtrlRectW);
    }
    if (this.CtrlRectH != h-margy)
    {
      this.CtrlRectH = h-margy;
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
      {
        if (!st) st = this.IntCtrl.style;
        st.height = this.CtrlRectH + "px";
        //
        // Se ho l'attivatore, devo ridimensionare anche lui
        if (this.ActObj)
          this.ActObj.style.height = (h-margya - (RD3_ServerParams.Theme.startsWith("zen") && !this.InList ? 2 : 0)) + "px";
      }
      else
        this.IntCtrl.SetHeight(this.CtrlRectH);
    }
    //
    // Infine penso ai SottoControlli interni
    if (this.ControlType == 30) // DISABLDED COMBO
    {
      // centro l'immagine in un caso
      if (RD3_Glb.IsMobile() && pf.VisOnlyIcon())
      {
        var img = this.IntCtrl.firstChild;
        var ix = img.offsetWidth;
        var iy = img.offsetHeight;
        //
        // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
        if (this.PValue && RD3_Glb.Adapt4Retina(this.PValue.Identifier, this.ForeImage, 43, "FORE"))
          img.style.display = "none";
        else
        {
          // Intanto imposto delle dimensioni standard, quando l'immagine arrivera' la posiziono correttamente
          if (ix==0 || iy==0)
          {
            ix = (ix==0 ? 26 : ix);
            iy = (iy==0 ? 26 : iy);
            //
            var parentContext = this.ParentField;
            img.onload = function(ev) { parentContext.COMBOImageReadyStateChanged(ev); };
          }        
          //
          img.style.left = ((this.CtrlRectW - ix)/2)+"px";
          img.style.top = ((this.CtrlRectH + margy - iy)/2)+"px";
        }
      }
    }
    if (this.ControlType == 4) // CHECK
    {
      st = null;
      if (RD3_Glb.IsMobile())
      {
        this.SubCtrlRectW = RD3_Glb.IsMobile7()?49:93;
        this.SubCtrlRectH = 27;
        //
        // Lo centro verticalmente, lo posiziono in base all'allineamento
        var ali = this.GetDynAlignment();
        if (ali=="" && this.PValue)
          ali = this.PValue.GetVisualStyle().GetAlignment(1);
        //
        var xp = w-this.SubCtrlRectW-12;
        if (ali==2 || ali=="left")
          xp = 12;
        if (ali==3 || ali=="center")
          xp = (w-this.SubCtrlRectW)/2;
        if (this.SubCtrlRectX != xp)
        {
          this.SubCtrlRectX = xp;
          if (!st) st = this.SubIntCtrl.style;
          st.left = this.SubCtrlRectX + "px";
        }
        //           
        var yp = (h-this.SubCtrlRectH)/2;
        if (this.SubCtrlRectY!=yp)
        {
          this.SubCtrlRectY = yp;
          if (!st) st = this.SubIntCtrl.style;
          st.top = this.SubCtrlRectY + "px";
        }
      }
      else if (RD3_Glb.IsIE(10, false))
      {
        if (this.SubCtrlRectX != (w/2 - 9))
        {
          this.SubCtrlRectX = (w/2 - 9);
          if (!st) st = this.SubIntCtrl.style;
          st.left = this.SubCtrlRectX + "px";
        }
        if (this.SubCtrlRectY != (h/2 - 9))
        {
          this.SubCtrlRectY = (h/2 - 9);
          if (!st) st = this.SubIntCtrl.style;
          st.top = this.SubCtrlRectY + "px";
        }
        if (this.SubCtrlRectW != 18)
        {
          this.SubCtrlRectW = 18;
          if (!st) st = this.SubIntCtrl.style;
          st.width = "18px";
        }
        if (this.SubCtrlRectH != 18)
        {
          this.SubCtrlRectH = 18;
          if (!st) st = this.SubIntCtrl.style;
          st.height = "18px";
        }
      }
      else
      {
        if (this.SubCtrlRectX != (w/2 - 11))
        {
          this.SubCtrlRectX = (w/2 - 11);
          if (!st) st = this.SubIntCtrl.style;
          st.left = this.SubCtrlRectX + "px";      
        }
      }
      //
      // Gestisco l'allineamento del check: se e' DESTRA devo invertire cella ed intestazione, 
      // altrimenti devo posizionarli normalmente (ma solo se la cella e' in form o fuori lista)
      // nota: non vale per tema mobile
      if ((!this.InList && !RD3_Glb.IsMobile() && this.ParentField.HdrForm && !this.ParentField.HdrFormAbove) || (this.InList && !this.ParentField.ListList && this.ParentField.HdrList && !this.ParentField.HdrListAbove))
      {
        // Calcolo l'allineamento che devo avere
        var ali = this.GetDynAlignment();
        if (ali=="" && this.PValue)
          ali = this.PValue.GetVisualStyle().GetAlignment(1);
        //
        // Se l'allinneamento e' destro devo invertire label e valore
        if (ali==4 || ali=="right")
        {
          var l = this.InList ? this.ParentField.ListLeft+this.ParentField.ParentPanel.RowSelWidth() : this.ParentField.FormLeft;
          //
          this.IntCtrl.style.left = l + "px";
          this.CtrlRectX = l;
          var ps = this.InList ? this.ParentField.ListCaptionBox.style : this.ParentField.FormCaptionBox.style;
          ps.left = l + this.CtrlRectW + 4 + 2 + "px"; // 2px di bordo
        }
        else  // in caso contrario la Label deve essere a sinistra e il valore a destra
        {
          var l = this.InList ? this.ParentField.ListLeft+this.ParentField.ParentPanel.RowSelWidth() : this.ParentField.FormLeft;
          var d = this.InList ? this.ParentField.ListHeaderSize+4 : this.ParentField.FormHeaderSize+4;
          //
          this.IntCtrl.style.left = l + d + "px";
          this.CtrlRectX = l + d;
          var ps = this.InList ? this.ParentField.ListCaptionBox.style : this.ParentField.FormCaptionBox.style;
          ps.left = l + "px";
        }
      }
    }
    if (this.ControlType == 101 && !RD3_ServerParams.UseIDEditor) // FCKEDITOR
    {
      var nm = this.ParentField.Identifier + (this.InList ? ":lcke" : ":fcke" );
      if (RD3_Glb.IsSafari()||RD3_Glb.IsChrome())
      {
        h += 5;
        w -= 13;
      }
      var cmd = "try { CKEDITOR.instances['" + nm + "'].resize(" + w + ", " + (h-25) + ", null, true); } catch (ex) {}";
      window.setTimeout(cmd, 100);
    }
    //
    // Se sono un BLOB, e ho associato un'immagine e il mime type e' immagine allora ridimensiono
    if (this.ControlType == 10 && this.PValue && this.PValue.BlobMime == "image") // BLOB
      this.ResizeBLOBImage();
    //
    // Ora sono a posto
    if (flForceRepos)
    {
      this.FixRectX = undefined;
      this.FixRectY = undefined;
    }
  }
}

// *********************************************
// Adatta la dimensione dell'input tenendo conto dell'attivatore
// *********************************************
PCell.prototype.AdaptInputForAct = function()
{
  // Se non e' INPUT esco
  if (!(this.ControlType == 2 || (this.ControlType == 5 && this.ListQBECell) )|| this.NumRows>1 || this.IsReadOnly || RD3_Glb.IsMobile())
    return;
  //
  // Se l'attivatore c'e' ed e' visibile
  if (this.ActObj && this.ActObjVisible)
  {
    if (this.ActPos==1)   // SX
      this.IntCtrl.style.left = (this.CtrlRectX + this.ParentField.GetActivatorWidth(this) + 2) + "px";
    else
      this.IntCtrl.style.left = this.CtrlRectX + "px";
  }
  else // Niente attivatore
  {
    this.IntCtrl.style.left = this.CtrlRectX + "px";
    this.IntCtrl.style.width = (this.CtrlRectW<0 ? 0 : this.CtrlRectW) + "px";
  }
}

// *********************************************
// Mostra/Nasconde i controlli interni alla cella
// (la cella si e' staccata dal PValue e quindi e' vuota)
// *********************************************
PCell.prototype.HideCellContent = function(hide, parent)
{
  if (this.IsCellHidden != hide)
  {
    this.IsCellHidden = hide;
    //
    var vs = this.ParentField.VisualStyle;
    //
    // Se sto nascondendo un bottone in lista
    // applico il DefaultPanelStyle perche' ha i bordi corretti
    if (vs.GetContrType() == 6 && hide && this.ParentField.ParentPanel.Status==RD3_Glb.PS_QBE && this.InList && this.ParentField.ListList)
    {
      while (vs.Derived)
        vs = vs.Derived;
    }
    //
    switch (this.ControlType)
    {
      case 2: // INPUT/TEXTAREA/SPAN
      {
        if (this.IsReadOnly)
        {
          this.IntCtrl.innerHTML = (hide ? "" : this.Text);
        }
        else
        {
          // Se nascondo la cella la disabilito in modo che non possa prendere il fuoco
          // Risolve il problema del cambio riga in QBE
          if (hide && this.ParentField.ParentPanel.Status==RD3_Glb.PS_QBE)
            this.IntCtrl.disabled = "disabled";
          else
          {
            // Su chrome non basta togliere l'attributo DISABLED
            if (this.IntCtrl.disabled && (RD3_Glb.IsChrome() || RD3_Glb.IsSafari()))
            {
              // Fa schifo ma non ho altro modo per obbligare WebKit ad aggiornare bene la cella
              var oldpar = this.IntCtrl.parentNode;
              var oldsib = this.IntCtrl.nextSibling;
              this.IntCtrl.parentNode.removeChild(this.IntCtrl);
              if (oldsib)
                oldpar.insertBefore(this.IntCtrl, oldsib);
              else
                oldpar.appendChild(this.IntCtrl);
            }
            //
            this.IntCtrl.removeAttribute("disabled");
          }
          //
          this.IntCtrl.value = (hide ? "" : this.Text);
        }
        //
        // Aggiorno attivatore ed ErrorBox
        if (hide)
        {
          // Se c'e' l'attivatore ed e' visibile
          if (this.ActObj && this.ActObjVisible)
          {
            this.ActObj.style.display = "none";
            this.ActObjVisible = false;
            //
            // E' stato nascosto l'attivatore... adatto l'input
            this.AdaptInputForAct();
          }
          //
          // Se c'e' l'ErrorBox
          if (this.ErrorBox)
            this.ErrorBox.style.display = "none";
        }
        else // Devo ripristinare la cella
        {
          // Non e' necessario ripristinare l'attivatore in quanto e' gia'
          // stato ripristinato dalla chiamata alla RenderEdit
          //
          // Ripristino l'error box
          if (this.ErrorBox)
            this.ErrorBox.style.display = "";
        }
      }
      break;
      
      case 3: // COMBO
        this.IntCtrl.HideContent(hide, this.ParentField.ParentPanel.Status==RD3_Glb.PS_QBE);
        //
        // Se ripristino, devo ridare il valore alla combo!
        // Io potrei non sentire modifiche dato che il TEXT potrebbe non cambiare!
        if (!hide)
          this.IntCtrl.SetText(this.Text, true, true);
      break;
      
      case 8: // CUSTOM
        this.IntCtrl.HideContent(hide, this.ParentField.ParentPanel.Status==RD3_Glb.PS_QBE);
        //
        // Se ripristino, devo ridare il valore all'elemento custom!
        // Io potrei non sentire modifiche dato che il TEXT potrebbe non cambiare!
        if (!hide)
          this.IntCtrl.SetText(this.Text);
      break;
      
      case 30: // DISABLEDCOMBO
      {
        // Nascondo i controlli interni
        var img = this.IntCtrl.firstChild;
        var span = img.nextSibling;
        img.style.display = (hide || img.style.left=="-999px" ? "none" : "");
        span.style.display = (hide ? "none" : "");
        //
        // Se devo nascondere, rimuovo eventuali onclick
        if (hide && this.IsCellClickable)
        {
          this.IsCellClickable = false;
          this.IntCtrl.onclick = null;
          this.IntCtrl.style.cursor = "default";
        }
      }
      break;
      
      case 4: // CHECK
      {
        this.SubIntCtrl.style.display = (hide ? "none" : "");
        //
        // Se nascondo il contenuto disabilito il check, perche' mettero' a false this.IsEnabled
        if(hide)
          this.SubIntCtrl.disabled = true;
      }
      break;

      case 5: // OPTION
      {
        // Cerco una value-list
        var vl = null;
        if (this.PValue)
          vl = this.PValue.GetValueList();
        if (!vl && this.OldPValue)
          vl = this.OldPValue.GetValueList();
        if (!vl)
          vl = this.ParentField.ValueList;
        if (vl)
        {
          vl.EnableOption(this.IntCtrl, this.IsEnabled, !hide);
          this.IsCtrlVisible = !hide;
        }
      }
      break;
      
      case 10: // BLOB
        if (this.SubIntCtrl)
          this.SubIntCtrl.style.display = (hide ? "none" : "");
      break;
      
      case 101: // FCK
        if (RD3_ServerParams.UseIDEditor)
          this.IntCtrl.HideContent(hide, this.ParentField.ParentPanel.Status==RD3_Glb.PS_QBE);
      break;
      
      case 6: // BUTTON
        this.IntCtrl.style.display = (hide ? "none" : "");
      break;
      
      case 111: // ListGroup Header
      {
        if (this.InList && hide && this.IntCtrl)
        {
          this.ClearElement(true);
          this.ControlType = -1;
          //
          // Dunque, sono qui perche' non ho il PVALUE e mi e' stato chiesto di nascondere la cella... che non c'e'!
          // Cosa posso fare? Creare un DIV "fittizio"
          this.IntCtrl = document.createElement("DIV");
          this.IntCtrl.className = "panel-field-value-list";
          parent.appendChild(this.IntCtrl);
          //
          var pf = this.ParentField;
          var w = pf.GetValueWidth(this.InList);
          var h = pf.GetValueHeight(this.InList);
          this.IntCtrl.style.width = (w>0 ? w-1 : 0) + "px";
          this.IntCtrl.style.height = (h>0 ? h-1 : 0) + "px";
          //
          // Non ho il PVALUE!
          vs.ApplyValueStyle(this.IntCtrl, this.InList, false, false, false, true, false, false, null, false, false, false, true);
          //
          // DIV fittizio!
          this.ControlType = 999;
        }
      }
      break;
      
      case -1:  // Nessun controllo!
        if (this.InList && hide && !this.IntCtrl)
        {
          // Dunque, sono qui perche' non ho il PVALUE e mi e' stato chiesto di nascondere la cella... che non c'e'!
          // Cosa posso fare? Creare un DIV "fittizio"
          this.IntCtrl = document.createElement("DIV");
          this.IntCtrl.className = "panel-field-value-list";
          parent.appendChild(this.IntCtrl);
          //
          var pf = this.ParentField;
          var w = pf.GetValueWidth(this.InList);
          var h = pf.GetValueHeight(this.InList);
          this.IntCtrl.style.width = (w>0 ? w-1 : 0) + "px";
          this.IntCtrl.style.height = (h>0 ? h-1 : 0) + "px";
          //
          // Non ho il PVALUE!
          vs.ApplyValueStyle(this.IntCtrl, this.InList, false, false, false, true, false, false, null, false, false, false, true);
          //
          // DIV fittizio!
          this.ControlType = 999;
        }
      break;
    }
    //
    // Se sto nascondendo, meglio aggiornare il colore di sfondo delle celle...
    // Magari ero su una riga che aveva qualche colore... e non basta svuotare l'input!
    if (hide && this.GetDOMObj())
    {
      // Se sono selezionata, devo aggiornare tutto!
      var onlyback = true;
      if (RD3_DesktopManager.WebEntryPoint.HilightedCell == this)
      {
        onlyback = false;
        this.SetInactive();
      }
      //
      vs.ApplyValueStyle(this.GetDOMObj(), this.InList, false, false, false, true, false, false, null, false, false, onlyback, true);
      //
      // Dovro' aggiornare il colore di sfondo di questa cella!
      this.VisualStyleSign = this.VisualStyleSign.substring(0, this.VisualStyleSign.indexOf("$") + 1);
      var dps = this.DynPropSign.split("|");
      dps[0] = "";
      this.DynPropSign = dps.join("|");
    }
    //
    // Se sto nascondendo e' meglio nascondere l'immagine di sfondo
    if (hide && this.BackGroundImage!="")
      this.SetBackGroundImage("");
    //
    // Se nascondo il contenuto, la cella non e' piu' abilitata, ne' mascherata
    if (hide)
    {
      this.IsEnabled = false;
      //
      // Se sono un Input quando mi nascondo divento non cliccabile
      if (this.ControlType==2)
      {
        // Le celle ReadOnly !cliccabili attaccno gli eventi di fuoco al click, in questo caso 
        // non lo devo staccare, perche' altrimenti : 
        // 1) nessuno lo rimette
        // 2) non e' un click che va al server, quindi non serve rimuoverlo
        if (!(this.IsReadOnly && !this.IsCellClickable))
          this.IntCtrl.onclick = null;
        this.IsCellClickable = false;
        this.IntCtrl.style.cursor = "default";
      }
      //
      this.Mask = "";
      this.MaskType = "";
      this.MaskDataSign = "";
      //
      // Se nascondo un input con MaxLength>0 gli rimuovo l'attributo
      if (this.MaxLength > 0)
      {
        this.MaxLength = -1;
        this.IntCtrl.removeAttribute("maxLength");
      }
      //
      if (this.Badge != "")
      {
        if (this.BadgeObj != null && this.BadgeObj.parentNode)
          this.BadgeObj.parentNode.removeChild(this.BadgeObj);
        this.BadgeObj = null;
        this.BadgeObjX = null;
        this.BadgeObjY = null;
        this.Badge = "";
      }
      //
      // Se nascondo il contenuto anche il Tooltip deve venire rimosso
      if (this.Tooltip != "")
        this.SetTooltip("");
    }
  }
}


// *********************************************
// Aggiorna lo stile visuale della cella
// *********************************************
PCell.prototype.UpdateVisualStyle = function(vs, extobj)
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  //
  // Tutti i valori oltre la prima riga in QBE diventano disabilitati
  var en = this.PValue.IsEnabled();
  if (this.InList && pf.ListList && this.PValue.Index>1 && pp.Status==RD3_Glb.PS_QBE)
    en = false;
  //
  // Voglio in QBE i campi master, i campi di autolookup e i campi LKE... non i campi lookup semplici
  var inqbe = this.PValue.InQBE() && (pf.IdxPanel<=0 || pf.AutoLookup || pf.LKE);
  //
  // Vediamo se sono sulla riga selezionata o su una riga alternata
  var sel = false;
  var alt = false;
  if (this.InList && pf.ListList)
  {
    if (pp.IsGrouped())
    {
      sel = (this.PValue.Index == pp.GetServerIndex(pp.ActualRow));
      alt = (pp.GetRowForIndex(this.PValue.Index)%2==0 ? false : true);
    }
    else
    {
      sel = (this.PValue.Index == (pp.ActualPosition + pp.ActualRow));
      alt = ((this.PValue.Index-pp.ActualPosition)%2==0 ? false : true);
    }
    //
    // Se e' attivo il FixActiveRow e la riga selezionata e' fuori dal buffer video, non c'e' selezione
    if (pp.IsPanelFixActiveRowWhenScrolled() && (pp.ActualRow < 0 || pp.ActualRow >= pp.NumRows))
      sel = false;
  }
  //
  // Ora vediamo se devo aggiornare davvero lo stile visuale
  var et = this.PValue.ErrorType;
  var vsSign = vs.Identifier + "*" + (et==1?"1":"0") + (et==2 || et==3?"1":"0") + "$" + (alt?"1":"0") + (sel?"1":"0") + (en?"1":"0") + (inqbe?"1":"0") + (extobj ? "-OBJ" : "");
  var dpSign = this.GetDynPropSign();
  //
  var onlyback = false;
  if (vsSign != this.VisualStyleSign || dpSign != this.DynPropSign)
  {
    // Se l'unica cosa che cambia nello stile visuale e' l'errore e sono una combo non sto a fare inactive-active perche'
    // aprirei e chiuderei la combo
    var skiphilight = false;
    if (dpSign == this.DynPropSign && this.ControlType == 3)
    {
      var vsign1 = vsSign.substring(0, vsSign.indexOf("*")) + vsSign.substring(vsSign.indexOf("$"));
      var vsign2 = this.VisualStyleSign.substring(0, this.VisualStyleSign.indexOf("*")) + this.VisualStyleSign.substring(this.VisualStyleSign.indexOf("$"));
      //
      if (vsign1==vsign2)
        skiphilight = true;
    }
    //
    // Devo aggiornare lo stile visuale... ma se io sono attiva prima mi disattivo
    var washilight = false;
    if (this == RD3_DesktopManager.WebEntryPoint.HilightedCell && !skiphilight)
    {
      // Ricordandomi che ero attiva
      washilight = true;
      this.SetInactive();
    }
    //
    if (dpSign != "|||-1|")
      this.ApplyDynPropToVisualStyle(vs);
    //
    // Se mi hanno passato l'oggetto esteso, vediamo se devo cambiare solo lui
    var onlyobj = (vsSign.substring(0, vsSign.indexOf("$")+5) == this.VisualStyleSign.substring(0, this.VisualStyleSign.indexOf("$")+5));
    if (!extobj || !onlyobj || dpSign != this.DynPropSign)
    {
      // Vediamo se devo aggiornare solo lo sfondo
      onlyback = (vsSign.substring(0, vsSign.indexOf("$")) == this.VisualStyleSign.substring(0, this.VisualStyleSign.indexOf("$"))) && (dpSign.substring(dpSign.indexOf("|")) == this.DynPropSign.substring(this.DynPropSign.indexOf("|")));
      //
      // Se non basta il colore di sfondo... controllo l'allineamento
      var aa;
      if (!onlyback)
        aa = this.ListQBECell ? "left" : (pf.IsRightAligned() ? "right" : "left");
      //
      vs.ApplyValueStyle(this.GetDOMObj(), this.InList, false, alt, sel, !en, et==1, (et==2 || et==3), aa, inqbe, false, onlyback, true, this.ControlType == 6);
      //
      // Ho toccato lo stile visuale... Devo resettare lo stato della cache per quel
      // che riguarda i padding (che sono sicuramente stati toccati)
      if (!onlyback)
      {
        this.PaddingRight = undefined;
        this.PaddingLeft = undefined;
      }
      //
      // In caso di combo devo aggiornare il posizionamento dell'input rispetto all'attivatore
      if (this.IntCtrl instanceof IDCombo)
        this.IntCtrl.SetLeft(this.IntCtrl.Left);
    }
    //
    // Se c'e' un oggetto in piu', applico anche a lui
    if (extobj)
      vs.ApplyValueStyle(extobj, this.InList, false, alt, sel, !en, et==1, (et==2 || et==3), null, inqbe, false, false, true);
    //
    if (dpSign != "|||-1|")
      this.CleanVisualStyle(vs);
    //
    // Ora il VS e' a posto
    this.VisualStyleSign = vsSign;
    this.DynPropSign = dpSign;
    //
    // Se ero attiva, mi riattivo
    if (washilight && sel)
      this.SetActive();
    //
    // Applicato!
    return true;
  }
  //
  // Non necessario
  return false;
}


// ***********************************************************
// Aggiorna la cella dato che e' cambiato il valore QBEEnabled del campo
// ***********************************************************
PCell.prototype.SetQBEEnabled = function(qbeen)
{
  // E' cambiato il valore QBEEnabled di PField... che, a sua volta, potrebbe
  // aver cambiato il valore della funzione PField.IsEnabled()
  var en = this.PValue.IsEnabled();
  if (this.ControlType!=-1 && this.IsEnabled!=en)
  {
    // Mi memorizzo il parent prima di pulire la cella (anche la posizione, perche' la Clear la rimuove)
    var parentN = this.GetDOMObj().parentNode;
    var posX = this.CtrlRectX;
    var posY = this.CtrlRectY;
    //
    // E' cambiato lo stato ENABLED... devo ricostruire questa cella!
    this.ClearElement();
    //
    this.Render(parentN);
    //
    this.UpdateDims(posX, posY);
  }
}


// ***********************************************************
// Aggiorna l'immagine di sfondo della cella
// ***********************************************************
PCell.prototype.SetBackGroundImage = function(img)
{
  // Se il sistema sta tentando di impostare un'immagine di sfondo ad un DIV fittizio
  // non faccio nulla; (anche ad un gruppo in lista)
  if (img != "" && (this.ControlType == 999 || this.ControlType == 111))
    return;
  //
  // Se non mi hanno fornito IMG e' perche' mi chiedono di controllare se 
  // mi hanno comunicato l'immagine di sfondo della cella quando ancora 
  // non c'era il controllo interno
  if (img==undefined && this.FixBackGroundImage!=undefined)
    img = this.FixBackGroundImage;
  //
  // Se e' cambiato
  if (img!=undefined && this.BackGroundImage!=img)
  {
    // Se ho il controllo, opero
    if (this.IntCtrl)
    {
      this.BackGroundImage = img;
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_serverParams.UseIDEditor))   // COMBO, CUSTOM
      {
        this.IntCtrl.style.backgroundImage = img;
        //
        // Se devo retinare, nascondo l'immagine (cosi non si vede grande) e quando arriva la rimostro
        if (this.PValue && RD3_Glb.Adapt4Retina(this.PValue.Identifier, img, 43, img))
        {
          this.IntCtrl.style.backgroundSize = "0px 0px"; 
          //
          // Ora l'immagine non e' a posto... se mi clonano anche i cloni dovranno ri-sistemare la background image!
          this.BackGroundImage = "";
        }
      }
      else
        this.IntCtrl.SetBackGroundImage(img);
      //
      // Se c'era un FIX ora ho il controllo... quindi sono a posto!
      this.FixBackGroundImage = undefined;
    }
    else
    {
      // Non ho il DIV! Devo ricordarmi di applicare questa modifica appena lo creo/clono
      this.FixBackGroundImage = img;
    }
  }
}

// ***********************************************************
// Aggiorna il ridimensionamento dell'immagine di sfondo della cella
// ***********************************************************
PCell.prototype.SetBackGroundImageRM = function(newRM)
{
  // Se non c'e' l'immagine di sfondo e' meglio no fare nulla
  if (this.BackGroundImage == "")
    return;
  //
  // Se non mi hanno fornito newRM e' perche' mi chiedono di controllare se 
  // mi hanno comunicato il ridimensionamento dell'immagine di sfondo
  // della cella quando ancora non c'era il controllo interno
  if (newRM==undefined && this.FixBackGroundImageRM!=undefined)
    newRM = this.FixBackGroundImageRM;
  //
  // Se e' cambiato
  if (newRM!=undefined && this.BackGroundImageRM!=newRM)
  {
    // Se ho il controllo, opero
    if (this.IntCtrl)
    {
      this.BackGroundImageRM = newRM;
      //
      var br = "";
      var bp = "";
      switch (this.BackGroundImageRM)
      {
        case 1: // Repeat
        case 3: // Stretch
          br = "repeat";
          bp = "";
          break;

        case 2: // Center
          br = "no-repeat";
          bp = "center center";
          break;
      }
      //
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_serverParams.UseIDEditor))   // COMBO, CUSTOM
      {
        var s = this.IntCtrl.style;
        s.backgroundRepeat = br;
        s.backgroundPosition = bp;
      }
      else if (this.IntCtrl.SetBackGroundImageRM)
        this.IntCtrl.SetBackGroundImageRM(br, bp);
      //
      // Se c'era un FIX ora ho il controllo... quindi sono a posto!
      this.FixBackGroundImageRM = undefined;
    }
    else
    {
      // Non ho il DIV! Devo ricordarmi di applicare questa modifica appena lo creo/clono
      this.FixBackGroundImageRM = newRM;
    }
  }
}

// ***********************************************************
// Aggiorna il tooltip della cella
// ***********************************************************
PCell.prototype.SetTooltip = function(tip, recalc)
{
  var mob = RD3_Glb.IsMobile();
  //
  // Se il tooltip e' vuoto prendo quello del campo (se il pannello lo vuole)
  if (tip == "" && this.ParentField.ParentPanel.TooltipOnEachRow && !mob)
    tip = this.ParentField.Tooltip;
  //
  // Se e' cambiato, lo applico
  if (tip != this.Tooltip)
  {
    var old = this.Tooltip;
    this.Tooltip = tip;
    //
    if (mob)
    {
      var intObj = (this.ControlType != 3 && this.ControlType != 8) ? this.IntCtrl : this.IntCtrl.GetDOMObj();
      //
      // Per posizionare il tooltip la cella deve essere gia' stata posizionata; se abbiamo gia' l'oggetto lo popoliamo, oppure lo popoliamo se ci arriva la chiamata dalla UpdateDims
      // Pero' ci possono essere casi in cui ci arriva l'update del tip su una cella gia' posizionata senza che dopo arrivi l'updateDims..
      if (this.InList && (this.IsReadOnly || !this.IsEnabled) && this.IsVisible && (this.TooltipDiv || recalc || (old=="" && intObj.parentNode)))
      {
        // Creo il div del tooltip
        if (this.Tooltip!="")
        {
          if (!this.TooltipDiv)
          {
            this.TooltipDiv = document.createElement("div");
            this.TooltipDiv.className = "panel-value-tooltip";
            this.TooltipDiv.id = this.IntCtrl.id;
            intObj.parentNode.appendChild(this.TooltipDiv);
            intObj.setAttribute("oldPaddingB",intObj.style.paddingBottom);
            intObj.setAttribute("oldPaddingT",intObj.style.paddingTop);
          }
          //
          this.TooltipDiv.style.top = (this.CtrlRectY+19)+"px";
          intObj.style.paddingBottom = "16pt";
          intObj.style.paddingTop = "0px";
          this.TooltipDiv.style.display = "";
          //
          // Gestione allineamento tooltip
          var vs = this.PValue ? this.PValue.GetVisualStyle() : this.ParentField.VisualStyle;
          if (vs)
          {
            var a = null;
            if (this.PValue && this.PValue.Alignment != -1)
              a = this.PValue.Alignment;
            else if (this.ParentField.Alignment != -1)
              a = this.ParentField.Alignment;
            else
              a = vs.GetAlignment(1);
            //
            var ali = "left";
            switch(a)
            {
              case 1: // VISALN_AUTO
                ali = this.ParentField.IsRightAligned()?"right":"left";
              break;
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
            this.TooltipDiv.style.textAlign = ali;
          }
          //
          if (RD3_Glb.HasClass(intObj,"panel-field-selected") || RD3_Glb.HasClass(intObj,"panel-field-unselected"))
            RD3_Glb.SetClass(this.TooltipDiv, "panel-value-tooltip-multiplesel", true);
        }
        else
        {
          // Devo rimuovere il tooltip
          if (this.TooltipDiv)
            this.TooltipDiv.style.display = "none";
          //
          var oPadB = intObj.getAttribute("oldPaddingB");
          var oPadT = intObj.getAttribute("oldPaddingT");
          //
          if (oPadB)
            intObj.style.paddingBottom = oPadB;
          if (oPadT)  
            intObj.style.paddingTop = oPadT;
        }
        //
        if (this.TooltipDiv)
          this.TooltipDiv.innerHTML = this.Tooltip;
      }
    }
    else
    {
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType==101 && RD3_ServerParams.UseIDEditor))   // COMBO
        RD3_TooltipManager.SetObjTitle(this.IntCtrl, this.Tooltip);
      else
        this.IntCtrl.SetTooltip(this.Tooltip);
    }
  }
  //
  if (RD3_ServerParams.TooltipErrorMode > 1 && !mob)
  {
    if (this.ErrorType == 1)
    {
      if (!this.TooltipErrorObj)
        this.TooltipErrorObj = new MessageTooltip(this);
      //
      var obj = this.GetDOMObj();
      this.TooltipErrorObj.SetObj(obj);
      this.GetTooltip(this.TooltipErrorObj, obj);
      this.TooltipErrorObj.SetDelay(0,0);
      try
      {
        // Obj potrebbe non essere ancora attaccato al Dom se sono clonato e sono in fase di start (f5)
        var hOfs = (this.ControlType == 3 ? 0 : obj.offsetHeight);
        this.TooltipErrorObj.SetAnchor(RD3_Glb.GetScreenLeft(obj), RD3_Glb.GetScreenTop(obj) + hOfs);
      }
      catch(ex) {}
      this.TooltipErrorObj.SetAutoAnchor(false);
      this.TooltipErrorObj.SetPosition(this.ControlType == 3 ? 0 : 2);
      //
      if (RD3_ServerParams.TooltipErrorMode == 2)
        this.TooltipErrorObj.ReusableTooltip = true;
      //
      // Se il parametro e' 3 e il tooltip non e' gia' visibile allora lo mostro
      if ((RD3_ServerParams.TooltipErrorMode == 3 || (RD3_ServerParams.TooltipErrorMode == 2 && RD3_DesktopManager.WebEntryPoint.HilightedCell === this)) && !this.TooltipErrorObj.Opened)
        this.TooltipErrorObj.Activate();
    }
    else if (this.TooltipErrorObj)
    {
      // Non ho piu' un errore, quindi nascondo il tooltip
      this.TooltipErrorObj.SetOwner(null);
      this.TooltipErrorObj.Deactivate();
      this.TooltipErrorObj = null;
    }
  }
}


// ***********************************************************
// Aggiorna la visibilita' della cella
// ***********************************************************
PCell.prototype.SetVisible = function(vis)
{
  // Se non mi hanno fornito VIS e' perche' mi chiedono di controllare se 
  // mi hanno comunicato la visiblita' della cella quando ancora non c'era il controllo interno
  if (vis==undefined && this.FixIsVisible!=undefined)
    vis = this.FixIsVisible;
  //
  // Se e' cambiato
  if (vis!=undefined && this.IsVisible!=vis)
  {
    // Se ho il controllo, opero
    if (this.IntCtrl)
    {
      this.IsVisible = vis;
      //
      if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
      {
        RD3_Glb.SetDisplay(this.IntCtrl, (vis ? "" : "none"));
        this.HandleFluidVisibility();
        //
        // Attivatore
        if (this.ActObj) 
        {
          // Calcolo se l'attivatore e' davvero visibile
          var actvis = (vis && this.PValue && this.PValue.ActivatorImage(this.PValue.GetVisualStyle()) != "");
          if (this.ActObjVisible != actvis)
          {
            this.ActObj.style.display = (actvis ? "" : "none");
            this.ActObjVisible = actvis;
            //
            // Se visibile, aggiorno la posizione dell'attivatore
            if (actvis)
              this.UpdateDims();
            //
            // Devo far adattare l'input in entrambi i casi (attivatore visibile/invisibile) perche' non so se
            // quando l'input tornera' visibile ci sara' ancora l'attivatore. Se non dovesse esserci l'input sarebbe sfasato
            // CONTRO: Se l'attivatore rimane dimensiono l'input 2 volte, quando viene nascosto e quando viene mostrato
            this.AdaptInputForAct();
          }
        }
      }
      else
        this.IntCtrl.SetVisible(vis);
      //
      // ErrorBox
      if (this.ErrorBox)
        this.ErrorBox.style.display = (vis ? "" : "none");
      //
      // Se c'era un FIX ora ho il controllo... quindi sono a posto!
      this.FixIsVisible = undefined;
    }
    else
    {
      // Non ho il controllo! Devo ricordarmi di applicare questa modifica appena lo creo/clono
      this.FixIsVisible = vis;
    }
    //
    // Se sono fluido, in lista ed ho un PValue, aggiungo questa riga a quelle da aggiornare
    if (this.ParentField && this.ParentField.ParentPanel.IsFluidPanel() && this.InList && this.PValue)
      this.ParentField.ParentPanel.RowsToRefresh.push(this.PValue.Index);
  }
}


// ***********************************************************
// Restituisce l'oggetto del DOM associato alla cella
// ***********************************************************
PCell.prototype.GetDOMObj = function(external)
{
  if (this.ControlType==111 && external)
    return this.GroupLabel;
  else if (this.ControlType != 3 && this.ControlType != 8 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO, CUSTOM
    return this.IntCtrl;
  else
    return this.IntCtrl.GetDOMObj();
}


// ***********************************************************
// E' stata fuocata la cella
// ***********************************************************
PCell.prototype.Focus = function(selall, evento)
{
  // Le celle vuote non possono prendere il fuoco
  if ((this.PValue == null) || (this.ControlType==999)|| (this.ControlType==-1))
    return;
  //
  // Nel mobile non do il fuoco ad un campo readonly
  if (RD3_Glb.IsMobile() && (this.IsReadOnly || !this.IsEnabled))
    return;
  //
  // Se sto dando il fuoco ad una form docked devo verificare che sia visibile nel Mobile.. infatti nel caso di dispositivo in verticale
  // la form potrebbe essere invibile.. e dargli il fuoco non e' corretto (darebbe anche problemi di scroll)
  var parfrm = this.ParentField.ParentPanel.WebForm.GetMasterForm();
  var st = (parfrm.FramesBox && parfrm.FramesBox.parentNode ? parfrm.FramesBox.parentNode.style : null);
  if (RD3_Glb.IsMobile() && parfrm.Docked && st && st.display=="none")
  {
    RD3_KBManager.CheckFocus = true;
    //
    return false;
  }
  //
  // Eseguo impostazione
  try
  {
    // Rendo visibile questa cella scrollando il pannello (solo in orizzontale)
    var parf = this.ParentField;
    var parp = parf.ParentPanel;
    var fixc = parp.FixedColumns;
    var listidx = parf.ListTabOrder==-1 ? parf.Index : parf.ListTabOrder;
    // 
    // Non mi occupo dello scroll se sono un campo in listlist, il pannello ha le fixed col e io sono nell'area di scroll; 
    // questo caso e' gia' gestito dal framework
    var handled = (parf.ListList && fixc > 0 && listidx > fixc) || this.InListForm;
    if (!handled)
    {
      // Calcolo il mio left ed il mio right
      var l = this.CtrlRectX + (parp.PanelMode==RD3_Glb.PANEL_LIST && parf.InList && parf.ListList ? parf.ListLeft : 0);
      var r = l + parf.GetValueWidth(this.InList, this);
      //
      // La posizione finale della mia cella e' visibile nel pannello? 
      if ((r-parp.ContentBox.scrollLeft) > parp.ContentBox.clientWidth)
      {
        // Non ci sto, devo scrollare!
        var scrl = r-parp.ContentBox.clientWidth+1;
        //
        // Controllo se il left esce da SX. In questo caso scrollo meno a meno che non sia RightAligned
        if (l<scrl && this.ValueAlign=="left") scrl = l;
        //
        // Non vado sotto 0
        if (scrl<0) scrl = 0;
        //            
        parp.ContentBox.scrollLeft = scrl;
      }
      else if (parp.ContentBox.scrollLeft>l && (this.ValueAlign=="left" || parf.GetValueWidth(this.InList, this)<parp.ContentBox.clientWidth))
      {
        parp.ContentBox.scrollLeft = l;
      }
    }
    if (RD3_Glb.IsMobile())
    {
      // Controllo di essere visibile e se no sposto il pannello con la traslazione 3d
      var objp = (parp.PanelMode==RD3_Glb.PANEL_LIST)? parp.ListBox : parp.FormBox;
      var yt = RD3_Glb.TranslateY(objp);
      var h = objp.parentNode.offsetHeight;
      var newt = 0;
      var hc = this.ParentField.GetValueHeight(this.InList);
      var okt = false;
      if (this.CtrlRectY+yt<0)
      {
        // Il campo e' sopra la parte visibile, lo porto dentro
        newt = this.CtrlRectY;
        okt = true;
      }
      if (this.CtrlRectY+hc+yt>h)
      {
        // Il campo e' sotto la parte visibile, lo porto dentro
        newt = this.CtrlRectY+hc-h;
        okt = true;
      }
      if (okt)
        RD3_Glb.SetTransform(objp, "translate3d(0px,-"+newt+"px,0px)");
    }
    //
    // Se la cella usa il popup control apro quello anziche' dargli il fuoco che aprirebbe la tastiera
    if (RD3_Glb.IsMobile() && this.ParentField.UsePopupControl() && this.IsEnabled && !(this.IntCtrl instanceof IDCombo))
    {
      var pc = new PopupControl(this.ParentField.GetPopupControlType(), this);
      pc.Open();
      pc.LastActiveObject = null;
      pc.LastActiveElement = null;
      return true;
    }
    //
    // Fuoco l'oggetto giusto
    var obj = this.GetDOMObj();
    //
    // Nel caso di Check devo dare il fuoco all'oggetto interno..
    if (this.ControlType == 4)
      obj = this.SubIntCtrl;
    //
    // Nel caso Radio devo dare il fuoco all'oggetto Interno
    if (this.ControlType == 5 && obj.childNodes.length>0)
    {
      // Innanzitutto prendiamo il primo oggetto (e' sempre un input)
      var intObj = obj.childNodes[0];
      //
      // Adesso cicliamo e cerchiamo l'input checked se c'e'
      for (var intId=0; intId<obj.childNodes.length; intId++)
      {
        if (obj.childNodes[intId].checked)
        {
          intObj = obj.childNodes[intId];
          break;
        }
      }
      //
      obj = intObj;
    }
    //
    // Se sono un intestazione di gruppo fuoco l'input
    if (this.ControlType == 111)
      obj = this.GroupLabel;
    //
    // Questa, a volte, fuoca il menu'... specialmente all'avvio dell'applicazione
    // Quindi meglio farne 2... tanto se la prima ha avuto successo... la seconda non fa nulla
    obj.focus();
    obj.focus();
    //
    // Se e' INPUT o COMBO
    if ((this.ControlType==2 && !this.IsReadOnly) || this.ControlType==3)
    {
      // Ho fuocato a mano il campo e non faro' gestire il focus al KBManager... quindi
      // devo gestire io a mano l'applicazione della maschera
      var en = this.IsEnabled;
      var msk = this.Mask;
      var mskt = this.MaskType;
      //
      // Vedi KBManager.IDRO_GetFocus
      if (en && msk && mskt)
        mc(msk, mskt, null, this.GetDOMObj());
      //
      // Eseguo selezione completa se richiesto
      if (en)
      {
        var proceed = true;
        //
        if (this.HasWatermark)
          selall = false;
        //
        // Se il campo e' abilitato verifico se devo impostare una posizione particolare
        if (RD3_DesktopManager.SelFld && RD3_DesktopManager.SelFld == this.ParentField.Identifier && !this.HasWatermark)
        {
          try
          {
            var start = parseInt(RD3_DesktopManager.SelSt);
            var end = parseInt(RD3_DesktopManager.SelEn);
            //
            if (obj.createTextRange)
            {
              var t = obj.createTextRange();
              t.move("character",start);
              t.moveEnd("character",(end-start));
              t.select();
            }
            else
            {
              obj.selectionStart = start;
              obj.selectionEnd = end;
            }
            //
            proceed = false;
          }
          catch(ex)
          {
            //proceed = true;
          }
        }
        //
        if (proceed)
        {
          if (selall)
          {
            if (obj.createTextRange)
            {
              var t = obj.createTextRange();
              t.select();
            }
            else
            {
              obj.selectionStart = 0;
              obj.selectionEnd = obj.value.length;
            }
            //
            this.ParentField.SendtextSelChange(this.GetDOMObj(true));
            if (RD3_KBManager.SelTextTimer)
            {
              window.clearTimeout(RD3_KBManager.SelTextTimer);
              RD3_KBManager.SelTextSrc = null;
              RD3_KBManager.SelTextObj = null;
              RD3_KBManager.SelTextTimer = null;
            }
          }
          else
          {
            if (this.HasWatermark)
            {
              setCursorPos(obj, 0);
              obj.scrollLeft = 0;
            }
            else if (obj.createTextRange)
            {
              // Se la cella contiene qualcosa ed il cursore e' all'inizio, elimino l'eventuale selezione
              if (this.Text!="" && ((this.NumRows==1 && getCursorPos(obj)<=0) || (this.NumRows>1 && RD3_Glb.getTextAreaSelection(obj, false)<=0)))
              {
                var t = obj.createTextRange();
                t.collapse(false);
                t.select();
              }
            }
          }
        }
        //
        // Annullo le proprieta' della selezione, sia che l'ho gestita o meno
        RD3_DesktopManager.SelFld = null;
        RD3_DesktopManager.SelSt = null;
        RD3_DesktopManager.SelEn = null;
      }
      else if (evento && (RD3_Glb.IsChrome() || RD3_Glb.IsSafari()))  // Gestiamo il cursore solo se c'e' l'evento: abbiamo visto che l'evento arriva solo nel caso di navKey, e non nel caso di Mouse click
      {
        // Se stiamo dando il fuoco ad un'input readonly o non abilitato su safari o chrome porto il cursore all'inizio del campo
        setCursorPos(obj, 0);
        obj.scrollLeft = 0;
      }
    }
    else if (this.ControlType==101 && !RD3_ServerParams.UseIDEditor)     // CKEDITOR
    {
      if (RD3_DesktopManager.SelFld && RD3_DesktopManager.SelFld == this.ParentField.Identifier)
      {
        var nm = this.ParentField.Identifier + (this.InList ? ":lcke" : ":fcke" );
        var inst = CKEDITOR.instances[nm];
        //
        var start = parseInt(RD3_DesktopManager.SelSt);
        var end = parseInt(RD3_DesktopManager.SelEn);
        //
        inst.focus();
        //
        // Su IE
        if (RD3_Glb.IsIE())
        {
          inst.document.$.selection.empty();
          var range = inst.document.$.selection.createRange();
          range.moveStart('character', start-1);
          range.moveEnd('character', end-1);
          range.select();
        }
        else // Altri
        {
          var startPos = new Object();
          startPos.node = inst.document.$.body;
          startPos.currPos = start-1;
          //
          var endPos = new Object();
          endPos.node = inst.document.$.body;
          endPos.currPos = end;
          //
          var p1 = this.SearchRangeNode(startPos);
          var p2 = this.SearchRangeNode(endPos);
          //
          var range = inst.document.$.createRange();
          range.setStart(p1.node, p1.pos);
          range.setEnd(p2.node, p2.pos);
          //
          var sel = inst.document.getWindow().$.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
      //
      // Annullo le proprieta' della selezione, sia che l'ho gestita o meno
      RD3_DesktopManager.SelFld = null;
      RD3_DesktopManager.SelSt = null;
      RD3_DesktopManager.SelEn = null;
    }
    else if (this.ControlType == 8)     // CUSTOM
      this.IntCtrl.Focus();
    else if (this.ControlType==101 && RD3_ServerParams.UseIDEditor)     // IDEditor
      this.IntCtrl.Focus();
    else if (this.ControlType == 4 && obj.disabled && obj.parentNode) 
    {
      // Un chek disabilitato non prende il fuoco, in questo caso lo devo dare a suo padre e poi 
      // chiamare a mano l'evento
      obj.parentNode.focus();
      obj.parentNode.focus();
      RD3_KBManager.IDRO_GetFocus(null, obj);
    }
    else if (this.ControlType == 111) 
    {
      // Mettiamo il fuoco all'inizio per le intestazioni di gruppo
      setCursorPos(obj, 0);
      obj.scrollLeft = 0;
    }
    //
    // Convinco il KB manager a non controllare il fuoco per un po'
    // visto che l'ho appena dato io con successo all'elemento
    RD3_KBManager.CheckFocus = false;
    //
    // Se c'e' un timer di fuoco pendente, lo mangio.. ho gia' dato il fuoco a chi di dovere!
    if (RD3_KBManager.FocusFieldTimerId)
    {
      window.clearTimeout(RD3_KBManager.FocusFieldTimerId);
      RD3_KBManager.FocusFieldTimerId = 0;
    }
    //
    return true;
  }
  catch(ex)
  {
    RD3_KBManager.CheckFocus = true;
    //
    return false;
  }
}

// **********************************************************************
// Mette/toglie l'evidenziazione sulla cella
// **********************************************************************
PCell.prototype.SetActive = function()
{
  // Un header di gruppo non e' mai fuocabile
  if (this.ControlType == 111)
    return;
  //
  // Vediamo chi era gia' attivato
  var oldCell = RD3_DesktopManager.WebEntryPoint.HilightedCell;
  //
  // La cella gia' attiva sono io... non faccio null'altro
  if (oldCell==this)
  {
    // Se, pero', sono una combo deferrata, allora lo comunico ugualmente
    if (this.ControlType==3 && this.IntCtrl.DeferEmpty)
      this.IntCtrl.SetText("", true, true);
    return;
  }
  //
  // Se c'era gia' una cella attiva, la disattivo
  if (oldCell)
    oldCell.SetInactive();
  //
  // Se la cella e' abilitata e' fuocabile
  if (this.IsEnabled && this.ControlType != 6 && !RD3_Glb.IsMobile())
  {
    // Ora proseguo con me. Recupero i dati di questa cella
    var pf = this.ParentField;
    var vs = this.PValue ? this.PValue.GetVisualStyle() : pf.VisualStyle;
    //
    var backCol  = vs.GetColor(10); // VISCLR_EDITING
    var brdColor = vs.GetColor(11); // VISCLR_BORDERS
    var bt = vs.GetBorders((this.InList)? 1 : 6); // VISBDI_VALUE : VISBDI_VALFORM
    var r = vs.GetBookOffset(true,(this.InList)? 1 : 6); // r contiene le dimensioni di ogni bordo
    // r.x = bordo sinistro
    // r.y = bordo sopra
    // r.w = bordo destro
    // r.h = bordo sotto
    //
    // Evidenzio il mio bordo
    var s = this.GetDOMObj().style;
    if (backCol != "transparent")
      s.backgroundColor = backCol;
    else if (!RD3_ServerParams.Theme.startsWith("zen"))
    {
      // Imposto i bordi solo se non c'e' il colore di editing
      s.border = "2px solid " + brdColor;
      var neww = parseInt(s.width)-(4-r.x-r.w);
      var newh = parseInt(s.height)-(4-r.y-r.h);
      s.width = (neww<0 ? 0 : neww) + "px";
      s.height = (newh<0 ? 0 : newh) + "px";
    }
    //
    // Se c'e' l'attivatore ed e' visibile, evidenzio anche lui!
    if (this.ActObj && this.ActObjVisible)
    {
      var ss = this.ActObj.style;
      if (backCol != "transparent")
        ss.backgroundColor = backCol;
      else if (!RD3_ServerParams.Theme.startsWith("zen"))
      {
        if (this.ActPos==1)
        {
          ss.borderLeft = "2px solid " + brdColor;
          s.borderLeft = "none";
          //
          // Lascio fermo l'attivatore!
          ss.backgroundPosition = "1px center";
          //
          // Ripristino larghezza del campo che e' stata mangiata dalla sparizione del bordo
          s.width = (parseInt(s.width) + 2) + "px";
        }
        else
        {
          ss.borderRight = "2px solid " + brdColor;
          s.borderRight = "none";
          //
          // Devo anche spostarlo in "dentro" di un po'
          var dd = 3 - 2*r.w;
          ss.left = (parseInt(ss.left) - dd) + "px";
          //
          // Lascio fermo l'attivatore!
          ss.backgroundPosition = "3px center";
        }
        ss.borderTop = "2px solid " + brdColor;
        ss.borderBottom = "2px solid " + brdColor;
        //
        // Purtroppo sembra che senza bordi l'attivatore sia anche piu' corto...
        var dh = (r.y==0 && r.h==0)?3:4;
        ss.height = (parseInt(ss.height)-(dh-r.y-r.h)) + "px";
      }
    }
    //
    // Se e' una COMBO o un CUSTOM la informo che e' diventata attiva
    if (this.ControlType == 3 || this.ControlType == 8 || (this.ControlType == 101 && RD3_ServerParams.UseIDEditor))
      this.IntCtrl.SetActive(true);
    //
    // Ora questa e' la cella attiva
    RD3_DesktopManager.WebEntryPoint.HilightedCell = this;
    //
    // Se e' un campo password, lo svuoto... non gestiamo il delta!
    // lo faccio solo se conteneva solo degli asterischi
    if (this.ControlType==2 && this.NumRows==1)
    {
      var vs = this.PValue.GetVisualStyle();
      if (vs.IsPassword())
      {
        var svuota = true;
        for (var idx = 0; idx<this.Text.length; idx++)
        {
          if (this.Text.substr(idx,1)!="*")
          {
            svuota=false;
            break;
          }
        }
        //
        if (svuota)
        {
          this.IntCtrl.value = "";
          this.PwdSvuotata = true;
        }
      }
    }
    //
    // Se ho un tooltip di errore e il parametro e' 2 mostro tooltip
    if (this.TooltipErrorObj && !this.TooltipErrorObj.Opened && RD3_ServerParams.TooltipErrorMode == 2)
      this.TooltipErrorObj.Activate();
  }
  else
  {
    // Non posso fuocarla... dichiaro la perdita del fuoco
    this.ParentField.LostFocus(this.IntCtrl,null, true);
  }
}


// **********************************************************************
// Toglie l'evidenziazione sulla cella
// **********************************************************************
PCell.prototype.SetInactive = function()
{
  // Per cominciare non sono piu' attiva
  RD3_DesktopManager.WebEntryPoint.HilightedCell = null;
  //
  // Devo forzare l'aggiornamento dello stile visuale e delle dimensioni
  this.VisualStyleSign = "";
  this.DynPropSign = "|||-1|";
  this.CtrlRectW = -1;
  this.CtrlRectH = -1;
  this.ActObjX = -1;
  //
  // Se e' un campo password, obbligo l'aggiornamento anche di quello (vedi SetActive)... non gestiamo il delta!
  if (this.ControlType==2 && this.NumRows==1 && this.PValue)
  {
    var vs = this.PValue.GetVisualStyle();
    if (vs.IsPassword())
      this.Text = "";
  }
  //
  // Se e' un campo mascherato, lo smaschero
  if (this.Mask!="" && this.ControlType==2 && this.IntCtrl && this.Text=="")
    this.IntCtrl.value = "";
  //
  // Se la cella che sta perdendo il fuoco e' CK verifico se i dati sono cambiati: lo faccio qui perche' la
  // lost focus di CK scatta troppo tardi (dopo questa gestione di fuoco)
  if (this.ControlType == 101 && !RD3_ServerParams.UseIDEditor)
  {
    var nm = this.ParentField.Identifier + (this.InList ? ":lcke" : ":fcke");
    this.ParentField.OnFCKSelectionChange(CKEDITOR.instances[nm]);
  } 
  //
  // Aggiorno la cella
  this.Update(this.PValue, this.GetDOMObj().parentNode);
  //
  // Se e' una COMBO o un CUSTOM la informo che e' diventata disattiva
  if (this.ControlType == 3 || this.ControlType == 8 || (this.ControlType == 101 && RD3_ServerParams.UseIDEditor))
    this.IntCtrl.SetActive(false);
  //
  // Se ho un tooltip di errore e il parametro e' 2 nascondo il tooltip
  if (this.TooltipErrorObj && this.TooltipErrorObj.Opened && RD3_ServerParams.TooltipErrorMode == 2)
    this.TooltipErrorObj.Deactivate(true);
  //
  // Se c'e' l'attivatore, ripristino il background pos
  if (this.ActObj && this.ActObjVisible)
    this.ActObj.style.backgroundPosition = "center center";
}


// **********************************************************************
// Chiamata da una IDCombo per informare che e' cambiato il testo nella combo
// **********************************************************************
PCell.prototype.OnComboChange = function(save, forcesend, superact)
{
  var oldText = this.Text;
  //
  // Mi copio il valore attualmente presente nella combo
  this.Text = this.IntCtrl.GetComboValue();
  //
  // Se la combo e' stata chiusa giro il messaggio al PValue
  if (save && this.PValue)
  {
    var obj = this.IntCtrl.GetDOMObj();
    var flag = ((save && this.ParentField.HasValueSource) || forcesend ? RD3_Glb.EVENT_IMMEDIATE : 0)
    if (this.ParentField.HasValueSource && this.ParentField.SuperActive && superact)
      flag = RD3_Glb.EVENT_SERVERSIDE;
    //
    this.PValue.SendChanges(obj, flag);
    //
    // Se e' una LKE ed il testo e' cambiato mi ricordo che la combo e' in fase di editing
    if (this.ParentField.LKE && oldText!=this.Text)
      this.ComboEditing = true;
  }
}

// **********************************************************************
// Chiamata da una IDCombo quando viene cliccato l'attivatore
// **********************************************************************
PCell.prototype.OnComboActivatorClick = function(forceOpenCombo)
{
  // Se una combo LKE ha anche un oggetto di attivazione associato, allora clicco sempre sull'attivatore
  // Lo stesso faccio se me lo chiedono... per esempio perche' ho premuto CTRL-F2 nella combo.. in questo
  // caso voglio comunque aprire la combo LKE anche se c'e' un oggetto di attivazione associato
  if (this.ParentField.LKE && this.IsEnabled && (forceOpenCombo || !this.ParentField.CanActivate))
  {
    // Memorizzo * nel mio text, cosi' PValue non mi rompe le scatole ed io non rompo la combo
    // Tanto questo e' quel che succedera' dopo l'evento
    if (this.Text == "" || this.Text==this.IntCtrl.OriginalText || RD3_Glb.IsMobile())
      this.Text = "*";
    //
    // Se e' multi-selezionabile invio anche la selezione attuale
    var txt = "";
    if (this.IntCtrl.MultiSel)
    {
      txt += this.IntCtrl.GetComboFinalName(true);
      txt += (txt.length > 0 && this.Text.length > 0 ? ";" : "");
    }
    txt += this.Text
    //
    // In questo caso "simulo" un * confermato... che fa apparire la combo
    if (this.ListQBECell)
      var ev = new IDEvent("qbecombo", this.ParentField.Identifier, null, RD3_Glb.EVENT_URGENT, this.ParentField.Identifier, txt);
    else
      var ev = new IDEvent("chg", this.PValue.Identifier, null, this.ParentField.ChangeEventDef|RD3_Glb.EVENT_IMMEDIATE, "", txt);
  }
  else
  {
    // Invio al server l'evento di click sull'attivatore (click sul pvalue)
    if (this.ParentField.HasValueSource && this.ParentField.SuperActive)
      var ev = new IDEvent("clk", this.PValue.Identifier, null, RD3_Glb.EVENT_SERVERSIDE, "", "", "", "", "", RD3_ClientParams.SuperActiveDelay, true);
    else
      var ev = new IDEvent("clk", this.PValue.Identifier, null, this.ParentField.ClickEventDef);
  }
}


// **********************************************************************
// Chiamata da un CustomElement per informare che e' cambiato il valore
// **********************************************************************
PCell.prototype.OnCustomChange = function(save, forcesend, superact)
{
  var oldText = this.Text;
  //
  // Mi copio il valore attualmente presente nell'elemento
  this.Text = this.IntCtrl.GetValue();
  //
  if (oldText != this.Text)
  {
    var obj = this.IntCtrl.GetDOMObj();
    var flag = this.ParentField.ChangeEventDef==RD3_Glb.EVENT_ACTIVE;
    //
    this.PValue.SendChanges(obj, flag);
  }
}


// **********************************************************************
// Comunica alla cella di inviare il BLOB (submit dell'oggetto FORM)
// **********************************************************************
PCell.prototype.UploadBlob = function()
{
  if (this.ControlType == 10)   // CAMPO BLOB
  {
    if (!this.SubIntCtrl[0].value)
      return;
    //
    if (window.RD4_Enabled)
    {
      var fld = this.ParentField;
      var file = cell.FileToUpload;
      var reader = new FileReader();
      reader.onload = function(e)
      {
        // Creo l'evento con par1 contenente il WCE (l'id della form)
        var ev = new IDEvent("IWUpload", "", null, RD3_Glb.EVENT_ACTIVE, "", fld.Identifier, file.name, file.type, e.target.result, null, null, file.size);
      };
      //
      reader.readAsDataURL(this.FileToUpload);
    }
    else
    {
      try
      {
        RD3_DesktopManager.WebEntryPoint.DelayDialog.Open(RD3_ServerParams.DelayDefaultMessage, RD3_Glb.DELAY);
        //
        this.SubIntCtrl.submit();
      }
      catch(t)
      {
        RD3_DesktopManager.WebEntryPoint.DelayDialog.Close();
      }
    }
  }
}

// **********************************************************************
// Clona gli oggetti del DOM copiando dentro di me lo stato degli oggetti
// **********************************************************************
PCell.prototype.CloneFrom = function(srccell)
{
  // Se c'e' gia' qualcosa nella cella, la svuoto!
  if (this.ControlType != -1)
    this.ClearElement(true);
  //
  // Poi, se e' attiva... meglio ripristinarla prima di clonarla!
  if (RD3_DesktopManager.WebEntryPoint.HilightedCell==srccell)
    srccell.SetInactive();
  //
  // Copio lo stato della cella
//  this.InList = srccell.InList;     // NON CLONARE MAI!
  this.ControlType = srccell.ControlType;
  this.ErrorType = srccell.ErrorType;
  this.NumRows = srccell.NumRows;
  this.IsVisible = srccell.IsVisible;
  this.IsCtrlVisible = srccell.IsCtrlVisible;
  this.FixIsVisible = srccell.FixIsVisible;   // Modifica VISIBLE senza controllo interno
  this.IsEnabled = srccell.IsEnabled;
  this.IsReadOnly = srccell.IsReadOnly;
  this.BackGroundImage = srccell.BackGroundImage;
  this.FixBackGroundImage = srccell.FixBackGroundImage; // Modifica BACKGROUNDIMAGE senza controllo interno
  this.BackGroundImageRM = srccell.BackGroundImageRM;
  this.FixBackGroundImageRM = srccell.FixBackGroundImageRM; // Modifica BACKGROUNDIMAGERESIZEMODE senza controllo interno
  this.VisualStyleSign = srccell.VisualStyleSign;
  this.DynPropSign = srccell.DynPropSign;
  this.IsCellClickable = srccell.IsCellClickable;
  this.ValueAlign = srccell.ValueAlign;
  this.Text = srccell.Text;
  this.BlobCellType = srccell.BlobCellType;
  this.IsCellHidden = srccell.IsCellHidden;
  this.Badge = srccell.Badge;
  this.Tooltip = srccell.Tooltip;
  //
  this.Mask = srccell.Mask;
  this.MaskType = srccell.MaskType;
  this.MaskDataSign = srccell.MaskDataSign;
  this.MaxLength = srccell.MaxLength;
  //
  this.HasWatermark = srccell.HasWatermark;
  this.ClassName = srccell.ClassName;
  //
  if (srccell.PopupControlReadOnly != undefined)
    this.PopupControlReadOnly = srccell.PopupControlReadOnly;
  if (srccell.ForeImage != undefined)
    this.ForeImage = srccell.ForeImage;
  //
  // Copio anche i rect della cella
  this.CtrlRectX = srccell.CtrlRectX;
  this.CtrlRectY = srccell.CtrlRectY;
  this.CtrlRectW = srccell.CtrlRectW;
  this.CtrlRectH = srccell.CtrlRectH;
  //
  // Ora clono i controlli interni
  if (srccell.IntCtrl)
  {
    if (this.ControlType==3)   // COMBO
    {
      this.IntCtrl = srccell.IntCtrl.Clone(this);
      RD3_Glb.RemoveClass(this.IntCtrl.ComboInput, "cell-hover");
    }
    else if (this.ControlType == 101 && RD3_ServerParams.UseIDEditor)
    {
      this.IntCtrl = srccell.IntCtrl.Clone(this);
    }
    else
    {
      this.IntCtrl = srccell.IntCtrl.cloneNode(true);
      RD3_Glb.RemoveClass(this.IntCtrl, "cell-hover");
      //
      // Reimposto il valore della TEXTAREA ... che non viene copiato durante il cloning!
      // Chrome, dalla versione 14, copia il value dell'input ma poi non lo disegna a video!
      if (this.ControlType == 2 && this.NumRows > 1 && (RD3_Glb.IsWebKit() || RD3_Glb.IsFirefox()))
        this.IntCtrl.value = srccell.IntCtrl.value;
      if (this.ControlType == 2 && this.NumRows == 1 && RD3_Glb.IsChrome())
        this.IntCtrl.value = srccell.IntCtrl.value;
      //
      // Aggiorno il valore di autocomplete, in modo da tenerlo spento
      RD3_Glb.AutocompleteOff(this.IntCtrl);
      //
      // Se la cella ha un sottocontrollo interno prendo quello.
      // Normalmente c'e' un solo sottocontrollo. Nel caso FCK ce n'e' piu' d'uno e quello che
      // mi interessa e' l'ultimo... quindi lastChild va bene
      if (srccell.SubIntCtrl)
      {
        this.SubIntCtrl = this.IntCtrl.lastChild;
        //
        // Copio lo stato checked... che non viene copiato durante la CLONE da IE!
        if ((RD3_Glb.IsIE() || RD3_Glb.IsMobile()) && this.ControlType == 4)        // CHECK
          this.SubIntCtrl.checked = srccell.SubIntCtrl.checked;
        //
        // Copio anche le proprieta' del sottocontrollo
        this.SubCtrlRectX = srccell.SubCtrlRectX;
        this.SubCtrlRectY = srccell.SubCtrlRectY;
        this.SubCtrlRectW = srccell.SubCtrlRectW;
        this.SubCtrlRectH = srccell.SubCtrlRectH;
        if (this.ControlType == 10)
          this.SubCtrlRectIMG = srccell.SubCtrlRectIMG;
      }
      //
      // Attivatore
      if (srccell.ActObj)
      {
        // Clono l'attivatore
        if (srccell.IsFluidCell())
        {
          // Se l'attivatore era contenuto nell'IntCTRL in realta' l'ho gia' clonato, devo prendermi il riferimento a lui..
          // quindi per semplicita':
          // se la cella aveva un attivatore cerco se l'intCTRL ha un figli con span con classe 'panel-value-activator', se ce l'ha punto a lui
          if (this.IntCtrl) {
            var list = this.IntCtrl.getElementsByClassName("panel-value-activator");
            if (list && list.length == 1)
              this.ActObj = list[0];
          }
          //
          if (!this.ActObj)
            this.ActObj = srccell.ActObj.cloneNode(false);
        }
        else
          this.ActObj = srccell.ActObj.cloneNode(false);
        //
        // Copio anche lo stato dell'attivatore
        this.ActObjVisible = srccell.ActObjVisible;
        this.ActObjSrc = srccell.ActObjSrc;
        this.ActPos = srccell.ActPos;
        this.ActObjX = srccell.ActObjX;
        this.ActObjY = srccell.ActObjY;
        this.ActObjW = srccell.ActObjW;
        this.ActObjCurs = srccell.ActObjCurs;
      }
      else
        this.ActObj = null;
      //
      if (srccell.BadgeObj)
      {
        // Clono il Badge
        this.BadgeObj = srccell.BadgeObj.cloneNode(true);
        //
        // Copio anche lo stato del Badge
        this.BadgeObjX = srccell.BadgeObjX;
        this.BadgeObjY = srccell.BadgeObjX;
      }
      else
        this.BadgeObj = null;
      //
      // E lo stato dei padding (per mobile)
      this.PaddingLeft = srccell.PaddingLeft;
      this.PaddingRight = srccell.PaddingRight;
    }
  }
  else
  {
    // La cella non ha un controllo interno
    this.IntCtrl = null;
    this.ControlType = -1;
  }
}

// **********************************************************************
// Torna TRUE se la cella fornita e' simile a quel che cerco
// **********************************************************************
PCell.prototype.IsGoodClone = function(srccell)
{
  if (this.PValue.GetControlType() != srccell.ControlType) return false;              // Controllo diverso
  if ((this.NumRows==1) != (srccell.NumRows==1)) return false;                        // Diverso tipo di controllo (INPUT!=TEXTAREA)
  if (this.PValue.ErrorType != srccell.ErrorType) return false;                       // Tipo di errore diverso
  if (this.PValue.IsVisible() != srccell.IsVisible) return false;                     // Diversa visibilita'
  if (this.PValue.GetVisualStyle() != (srccell.PValue ? srccell.PValue.GetVisualStyle() : null)) return false;  // Diverso VS
  //
  // Se sono in lista dentro alla lista vediamo se trovo una cella simile
  if (this.InList && this.ParentField.ListList && srccell.PValue)
  {
    // Se sono di classi differenti non sono un buon clone
    if (((this.PValue instanceof PListGroup)&&(srccell.PValue instanceof PValue)) || ((this.PValue instanceof PValue)&&(srccell.PValue instanceof PListGroup)))
      return false;
    //
    // Non mischio celle fluide con celle pienamente editabili
    if (this.IsFluidCell() != srccell.IsFluidCell())
      return false;
    //
    // Se sono due Header di gruppo
    if (this.PValue instanceof PListGroup)
      return true;
    var sel    = false;
    var selsrc = false;
    var alt    = false;
    var altsrc = false;
    var pp = this.ParentField.ParentPanel;
    //
    sel = (this.PValue.Index == pp.ActualPosition + pp.ActualRow);
    selsrc = (srccell.PValue.Index == pp.ActualPosition + pp.ActualRow);
    alt = ((this.PValue.Index-pp.ActualPosition)%2==0 ? false : true);
    altsrc = ((srccell.PValue.Index-pp.ActualPosition)%2==0 ? false : true);
    //
    // Se e' attivo il FixActiveRow e la riga selezionata e' fuori dal buffer video, non c'e' selezione
    if (pp.IsPanelFixActiveRowWhenScrolled() && (pp.ActualRow < 0 || pp.ActualRow >= pp.NumRows))
      sel = selsrc = false;
    //
    if (sel!=selsrc || alt!=altsrc) return false;
  }
  //
  return true;
}


// *********************************************************
// Imposta il tooltip
// *********************************************************
PCell.prototype.GetTooltip = function(tip, obj)
{
  // Verifico se c'e' gia' un tooltip di errore
  if (this.TooltipErrorObj && this.TooltipErrorObj != tip)
  {
    if (RD3_ServerParams.TooltipErrorMode == 2 || RD3_ServerParams.TooltipErrorMode == 3)
      return false;
  }
  //
  // Se e' una COMBO o un CUSTOM lo chiedo a lei
  if (this.ControlType == 3 || this.ControlType == 8 || (this.ControlType == 101 && RD3_ServerParams.UseIDEditor))
    return this.IntCtrl.GetTooltip(tip, obj);
  //
  // Se e' un OPTION
  if (this.ControlType == 5)
  {
    // Provo a chiedere alla ValueList
    var vl = (this.PValue ? this.PValue.GetValueList() : null);
    if (vl && vl.GetTooltipOption(this.IntCtrl, tip, obj))
    {
      // Devo impostargli il title tenendo presente che
      // il valueList potrebbe aver gia' impostato il title con il nome del valore
      tip.SetTitle(this.GetTooltipTitle() + (tip.Title.length>0 ? ": " + tip.Title : ""));
      tip.SetObj(this.IntCtrl); 
      return true;
    }
  }
  //
  if (this.Tooltip == "")
    return false;
  //
  if (this.ErrorType == 1)
    tip.SetStyle("error");
  else if (this.ErrorType == 2 || this.ErrorType == 3)
    tip.SetStyle("warning");
  //
  tip.SetTitle(this.GetTooltipTitle());
  tip.SetText(this.Tooltip);
  tip.SetAutoAnchor(true);
  tip.SetPosition(2);
  return true;
}

// *********************************************************
// Restituisce il titolo del tooltip (chiamato dal controllo interno)
// *********************************************************
PCell.prototype.GetTooltipTitle = function()
{
  return this.ParentField.Header;
}


// *********************************************************
// Ritorna l'oggetto DOM da tirare
// *********************************************************
PCell.prototype.DropElement = function()
{
  return this.GetDOMObj();
}


// ********************************************************************************
// Su quali celle e' possibile droppare?
// ********************************************************************************
PCell.prototype.ComputeDropList = function(list,dragobj)
{
  if (dragobj==this)
    return;
  //
  var o = this.GetDOMObj();
  if (o)
  {
    list.push(this);
    //
    // Calcolo le coordinate assolute...
    this.AbsLeft = RD3_Glb.GetScreenLeft(o,true);
    this.AbsTop = RD3_Glb.GetScreenTop(o,true);
    this.AbsRight = this.AbsLeft + o.offsetWidth - 1;
    this.AbsBottom = this.AbsTop + o.offsetHeight - 1;
    //
    // Mobile + form: allargo il riquadro fino a contenere anche la Caption
    if (!this.InList && RD3_Glb.IsMobile() && this.ParentField.HdrForm)
    {
      if (this.ParentField.HdrFormAbove)
        this.AbsTop -= this.ParentField.FormHeaderSize;
      else
        this.AbsLeft -= this.ParentField.FormHeaderSize;
    }
  }
}


// **********************************************************************
// Ritorna il frame che contiene la cella
// **********************************************************************
PCell.prototype.GetParentFrame = function()
{
  return this.ParentField.GetParentFrame();
}

// ********************************************************************************
// Gestore evento di mouse down su uno degli oggetti di questa cella
// ********************************************************************************
PCell.prototype.OnMouseDownObj= function(evento, obj)
{
  // Se e' una COMBO, giro il MouseDown alla combo
  if (this.ControlType==3)
    this.IntCtrl.OnMouseDownObj(evento, obj);
}


// ********************************************************************************
// Renderizza un PValue fittizio per la gestione dei gruppi in lista
// ********************************************************************************
PCell.prototype.RenderPListGroup = function(parent)
{
  // Mi memorizzo se devo mostrare l'intestazione o meno
  var firstfield = this.ParentField.IsFirstListList();
  //
  // Nel caso il campo abbia la colonna impostata per contenere gli header
  // tolgo l'impostazione 
  if (!firstfield && this.ParentField.FirstListFld)
  {
    this.ParentField.FirstListFld = false;
    this.ParentField.ListBox.className = "panel-field-list-box";
  }
  //
  // Per prima cosa devo impostare la classe corretta alla colonna se non ce l'ha
  if (!this.ParentField.FirstListFld && firstfield)
  {
    this.ParentField.FirstListFld = true;
    this.ParentField.ListBox.className = "panel-field-grouped-list-box";
  }
  //
  // Svuoto la cella se contiene un controllo di tipo differente
  if (this.ControlType != 111 || this.FirstGroupField!=firstfield)
  {
    // Nel caso questa cella era di tipo diverso controllo che non avesse il fuoco: se ce l'aveva gli faccio rimuovere il
    // Focus Box e annullo il puntatore all'oggetto attivo
    var wasfoc = (RD3_KBManager.ActiveElement && RD3_KBManager.ActiveElement == this.GetDOMObj());
    if (wasfoc)
    {
      RD3_DesktopManager.WebEntryPoint.SetHideFocusBox();
      RD3_KBManager.ActiveElement = null;
    }
    //
    this.ClearElement(true);
    this.ControlType = 111;
    //
    // Creo il controllo interno
    this.IntCtrl = document.createElement("DIV");
    this.IntCtrl.className = "group-container";
    //
    if (firstfield)
    {
      // Per il primo campo creiamo un input: cosi' puo' prendere il fuoco..
      this.GroupLabel = document.createElement(RD3_Glb.IsMobile() ? "SPAN" : "input");
      RD3_Glb.AutocompleteOff(this.GroupLabel);
      if (!RD3_Glb.IsMobile())
        this.GroupLabel.type = "text";
      //
      this.GroupId = this.ParentField.Identifier + ":lsg:"+this.PValue.Index;
      this.GroupLabel.setAttribute("id", this.GroupId);
      //
      // Al primo campo diamo l'overflow visibile: l'intestazione deve uscire..
      this.IntCtrl.style.overflow = "visible";
    }
    else
    {
      this.GroupLabel = document.createElement("SPAN");  
      if (!this.PValue.Aggregations || this.PValue.Aggregations.length == 0)
        this.IntCtrl.className = "group-container group-container-list";
    }
    //
    this.GroupLabel.className = "group-label";
    //
    this.IntCtrl.appendChild(this.GroupLabel);
    //
    if (!RD3_Glb.IsIE(10, false) && firstfield && !RD3_Glb.IsMobile())
    {
      var fo = function(ev) { RD3_KBManager.IDRO_GetFocus(ev); };
      //
      // Solo IE ha gli eventi (activate e deactivate) che informano i parent (bubble)
      this.GroupLabel.onfocus = fo;
    }
    //
    // Appendo il controllo al parent
    parent.appendChild(this.IntCtrl);
  }
  else if (firstfield)  // Era gia' un PListGroup: devo almeno aggiornare l'ID
  {
    this.GroupId = this.ParentField.Identifier + ":lsg:"+this.PValue.Index;
    this.GroupLabel.setAttribute("id", this.GroupId);
  }
  //
  // Il primo campo deve essere sempre visibile, mostriamo la Label
  if (firstfield && !this.IsVisible) {
    this.IntCtrl.style.display = "";
    this.IsVisible = true;
  }
  //
  // Disabilito la cella: qui non ci si puo' scrivere!
  this.IsEnabled = false;
  //
  // Applico il padding all'intestazione in base al livello del gruppo e se devo mostrare o meno l'intestazione
  // Mantengo sia nel caso mobile che nel caso RD3 la stessa espressione per calcolare il padding, cambio pero'
  // l'unita' di misura (nel Mobile tutti i padding sono espressi in pt)
  var lp = firstfield ? (this.PValue.Level * 20 + 2) : 0;
  if (this.leftPadding != lp)
  {
    this.leftPadding = lp;
    var pLeft = RD3_Glb.IsMobile() ? (this.leftPadding + 10) + "pt" : this.leftPadding + "px";
    //
    // Su ZEN serve important per vincere sul css
    if (RD3_ServerParams.Theme.startsWith("zen") && this.IntCtrl.style.setProperty) 
      this.IntCtrl.style.setProperty("padding-left", pLeft, "important"); 
    else
      this.IntCtrl.style.paddingLeft = pLeft;
  }
  //
  // Scrivo l'intestazione corretta
  var label = firstfield ? this.PValue.Label : this.PValue.Aggregations[this.ParentField.Index];
  if (!label)
    label = "";
  //
  if (this.Text != label)
  {
    this.Text = label;
    if (firstfield && !RD3_Glb.IsMobile())
      this.GroupLabel.value = this.Text;
    else
      this.GroupLabel.innerHTML = this.Text;
  }
  //
  if (!RD3_Glb.IsMobile())
  {
    // Se mi serve l'immagine di apertura/chiusura la creo
    if (!this.GroupCollapseButton && firstfield)
    {
      this.GroupCollapseButton = document.createElement("IMG");
      this.GroupCollapseButton.className = "group-collapse-img";
      this.IntCtrl.insertBefore(this.GroupCollapseButton, this.GroupLabel);
      this.GroupCollapseVis = true;
    }
    //
    // Se sono il primo campo attacco gli eventi corretti all'attivatore dell'header
    if (firstfield)
    {
      var parentContext = this.PValue;
      var oc = function(ev) { parentContext.OnExpandGrp(ev, ''); };
      this.IntCtrl.onclick = oc;
      //
      this.IntCtrl.style.cursor = "pointer";
      if (this.GroupLabel)
        this.GroupLabel.style.cursor = "pointer";
    }
    //
    // Gestisco l'immagine dell'attivatore (se presente)
    var actsrc = RD3_Glb.GetImgSrc("images/" + (this.PValue.Expanded ? "grcl.gif" : "grxp.gif"));
    if (this.GroupCollapseButton && this.GroupCollapseSrc != actsrc)
    {
      if (!RD3_Glb.IsMobile())
      {
        this.GroupCollapseSrc = actsrc;
        this.GroupCollapseButton.src = this.GroupCollapseSrc;
      }
    }
    //
    // Gestisco la visibilita' dell'immagine
    if (this.GroupCollapseButton && this.GroupCollapseVis != firstfield)
    {
      this.GroupCollapseVis = firstfield;
      this.GroupCollapseButton.style.display = this.GroupCollapseVis ? "" : "none";
    }
    //
    // Ora gestisco il VisualStyle
    var vs = this.PValue.GetVisualStyle();
    var vsSign = vs.Identifier + "*00$0000";
    var onlyback = false;
    //
    if (vsSign != this.VisualStyleSign)
    {
      // Devo aggiornare lo stile visuale... ma se io sono attiva prima mi disattivo
      if (this == RD3_DesktopManager.WebEntryPoint.HilightedCell)
        RD3_DesktopManager.WebEntryPoint.HilightedCell = null;
      //
      var aa = this.ParentField.IsRightAligned()?"right":"left";
      vs.ApplyListGroupStyle(this.GetDOMObj(), firstfield, false, aa);
      //
      // Al primo campo devo applicare il VS anche sull'input
      if (firstfield)
        vs.ApplyListGroupStyle(this.GroupLabel, false, true, aa);
      //
      // Ora il VS e' a posto
      this.VisualStyleSign = vsSign;
    }
  }
  //
  // Dimensiono correttamente la dimensione della linea
  this.EnlargeCell = firstfield;
  this.FirstGroupField = firstfield;
  this.UpdateDims();
}

// ********************************************************************************
// Calcola il marchio delle proprieta' visuali dinamiche applicate
// ********************************************************************************
PCell.prototype.GetDynPropSign = function()
{
  var bc = (this.PValue && this.PValue.BackColor != "" ? this.PValue.BackColor : this.ParentField.BackColor);
  var fc = (this.PValue && this.PValue.ForeColor != "" ? this.PValue.ForeColor : this.ParentField.ForeColor);
  var fm = (this.PValue && this.PValue.FontMod != "" ? this.PValue.FontMod : this.ParentField.FontMod);
  var al = (this.PValue && this.PValue.Alignment != -1 ? this.PValue.Alignment : this.ParentField.Alignment);
  var mk = (this.PValue && this.PValue.Mask != "" ? this.PValue.Mask : this.ParentField.Mask);
  return bc + "|" + fc + "|" + fm + "|" + al + "|" + mk;
}

// ********************************************************************************
// Decodifica l'allineamento dinamico
// ********************************************************************************
PCell.prototype.GetDynAlignment = function()
{
  var a = (this.PValue && this.PValue.Alignment != -1 ? this.PValue.Alignment : this.ParentField.Alignment);
  if (a != -1)
  {
    var ali = "";
    switch(a)
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
    return ali;
  }
  return "";
}

// ********************************************************************************
// Sporca il visual style con le proprieta' visuali dinamiche
// ********************************************************************************
PCell.prototype.ApplyDynPropToVisualStyle = function(vs)
{
  var bc = (this.PValue && this.PValue.BackColor != "" ? this.PValue.BackColor : this.ParentField.BackColor);
  var fc = (this.PValue && this.PValue.ForeColor != "" ? this.PValue.ForeColor : this.ParentField.ForeColor);
  if (bc != "" || fc != "")
  {
    vs.OldColor = new Array();
    //
    var n = vs.Color.length;
    for (var i=0; i<n; i++)
      vs.OldColor[i] = vs.Color[i];
    //
    if (bc != "")
    {
      vs.Color[5] = bc; // VISCLR_BACKVALUE
      vs.Color[4] = bc; // VISCLR_ALTVALUE
      vs.Color[14] = bc; // VISCLR_BACKQBE
      vs.Color[22] = bc; // VISCLR_ERRBACK
      vs.Color[23] = bc; // VISCLR_WARNBACK
      vs.Color[16] = bc; // VISCLR_HILIGHTREADONLY
      vs.Color[18] = bc; // VISCLR_ALTREADONLY
      vs.Color[15] = bc; // VISCLR_BACKREADONLY
      vs.Color[9] = bc; // VISCLR_HILIGHT
    }
    //
    if (fc != "")
    {
      vs.Color[1] = fc; // VISCLR_FOREVALUE
      vs.Color[2] = fc; // VISCLR_FOREHEAD
      vs.Color[20] = fc; // VISCLR_ERRVALUE
      vs.Color[21] = fc; // VISCLR_WARNVALUE
    }
  }
  //
  var fm = (this.PValue && this.PValue.FontMod != "" ? this.PValue.FontMod : this.ParentField.FontMod);
  if (fm != "")
  {
    vs.OldFont = new Array();
    //
    var n = vs.Font.length;
    for (var i=0; i<n; i++)
      vs.OldFont[i] = vs.Font[i];
    //
    // VISFNT_VALUE
    var f = vs.GetFont(1).split(',');
    f[1] = fm;
    vs.Font[1] = f.join(',');
    //
    // VISFNT_ERR
    f = vs.GetFont(4).split(',');
    f[1] = fm;
    vs.Font[4] = f.join(',');
    //
    // VISFNT_WARN
    f = vs.GetFont(5).split(',');
    f[1] = fm;
    vs.Font[5] = f.join(',');
    //
    // VISFNT_NOTNULL
    f = vs.GetFont(6).split(',');
    f[1] = fm;
    vs.Font[6] = f.join(',');
  }
  //
  var al = (this.PValue && this.PValue.Alignment != -1 ? this.PValue.Alignment : this.ParentField.Alignment);
  if (al != -1)
  {
    vs.OldAlign = new Array();
    //
    // Mi faccio una copia di vs.Alignments perche' potrebbe essere vuoto
    // e in tal caso vs.Alignments[i] sarebbe undefined
    for (var i = 0; i < vs.Alignments.length; i++)
      vs.OldAlign[i] = vs.Alignments[i];
    vs.Alignments[1] = al;
  }
  //
  var mk = (this.PValue && this.PValue.Mask != "" ? this.PValue.Mask : this.ParentField.Mask);
  if (mk != "")
  {
    vs.OldMask = vs.Mask;
    vs.Mask = mk;
  }
}

// ********************************************************************************
// Ripristina il visual style dallo sporco delle proprieta' visuali dinamiche
// ********************************************************************************
PCell.prototype.CleanVisualStyle = function(vs)
{
  if (vs.OldColor != undefined)
  {
    vs.Color = vs.OldColor;
    vs.OldColor = undefined;
  }
  //
  if (vs.OldFont != undefined)
  {
    vs.Font = vs.OldFont;
    vs.OldFont = undefined;
  }
  //
  if (vs.OldAlign != undefined)
  {
    vs.Alignments = vs.OldAlign;
    vs.OldAlign = undefined;
  }
  //
  if (vs.OldMask != undefined)
  {
    vs.Mask = vs.OldMask;
    vs.OldMask = undefined;
  }
}

// ********************************************************************************
// Dato un nodo HTML ed una posizione, restituisce il nodo foglia
// e l'offset al suo interno che corrisponde
// ********************************************************************************
PCell.prototype.SearchRangeNode = function(actPos)
{
  var trimRegex = /[ \t\n\r]+$/g;
  var ffx = RD3_Glb.IsFirefox();
  //
  var n = actPos.node.childNodes.length;
  for (var i=0; i<n; i++)
  {
    var obj = actPos.node.childNodes[i];
    var txt = (obj.nodeType==3 ? obj.nodeValue : (ffx ? obj.textContent : obj.innerText));
    //
    txt = txt.replace(trimRegex, '');
    if (txt == "")
      continue;
    //
    // Se questo nodo ha figli, devo entrarci dentro
    var objPos = new Object();
    objPos.node = obj;
    objPos.currPos = actPos.currPos;
    var o = this.SearchRangeNode(objPos);
    if (o != null)
      return o;
    //
    // Se pos e' contenuto nel testo e questo nodo non ha altri figli, l'ho trovato
    if (actPos.currPos<txt.length)
    {
      var o = new Object();
      o.pos = actPos.currPos;
      o.node = obj;
      return o;
    }
    //
    // Niente da fare... Proseguo nella ricerca
    actPos.currPos -= txt.length;
  }
  //
  return null;
}

// **************************************************
// Rimuove il watermark dalla cella
// **************************************************
PCell.prototype.RemoveWatermark = function()
{
  // Se non ho watermark allora non faccio nulla
  if (!this.HasWatermark)
    return;
  //
  if (this.ControlType == 3 || this.ControlType == 8 || (this.ControlType == 101 && RD3_ServerParams.UseIDEditor))
  {
    this.Text = this.PValue ? this.PValue.Text : "";
    this.HasWatermark = false;
    //
    this.IntCtrl.RemoveWatermark();
    this.IntCtrl.SetText(this.Text, true, false);
    return;
  }
  //
  // Rimuovo la classe
  RD3_Glb.RemoveClass(this.IntCtrl, "panel-field-value-watermark");
  //
  // Rimuovo il testo (metto Stringa Vuota)
  this.Text = this.PValue ? this.PValue.Text : "";
  this.IntCtrl.value = this.Text;
  this.HasWatermark = false;
  //
  // Su chrome e safari quando tolgo il watermark rimetto a posto anche la lunghezza massima
  if ((RD3_Glb.IsChrome() || RD3_Glb.IsSafari()))
  {
    this.MaxLength = this.ParentField.MaxLength;
    //
    if (this.MaxLength <= 0)
      this.IntCtrl.removeAttribute("maxLength");
    else
      this.IntCtrl.setAttribute("maxLength", this.MaxLength);
  }
}

// *****************************************************************
// Imposta lo zIndex di un oggetto uguale a this.Index
// *****************************************************************
PCell.prototype.SetZIndex = function(obj)
{
  // Se FuoriLista o in Form imposto lo zIndex
  var pf = this.ParentField;
  if (!this.InList || !pf.ListList)
    obj.style.zIndex = pf.Index;
}

// *****************************************************************
// Ridimensione L'immagine mostrata nella cella in base al ridimensionamento 
// impostato sul PField
// *****************************************************************
PCell.prototype.ResizeBLOBImage = function()
{
  // Esco se: non sono un blob, oppure non ho l'immagine oppure se sono su IE e l'immagine non e' caricata completamente
  if (this.ControlType != 10 || !this.SubIntCtrl || (RD3_Glb.IsIE(10, false) && this.SubIntCtrl && this.SubIntCtrl.readyState != "complete"))
    return;
  //
  var s = this.SubIntCtrl.style;
  switch(this.ParentField.ImageResizeMode)
  {
    case 1 : // Repeat
      if (this.SubCtrlRectW != -1)
      {
        s.width = "";
        this.SubCtrlRectW = -1;
      }
      if (this.SubCtrlRectH != -1)
      {
        s.height = "";
        this.SubCtrlRectH = -1;
      }
      break;
    
    case 2 : // Center
      // Se e' cambiata l'immagine oppure sono cambiate le dimensioni per cui mi sono adattato allora devo riadattarmi
      if (this.Text != this.SubCtrlRectIMG || this.SubCtrlRectW != this.CtrlRectW || this.SubCtrlRectH != this.CtrlRectH)
      {
        this.SubCtrlRectIMG = this.SubIntCtrl.src;
        //
        s.width = "auto";
        s.height = "auto";
        //
        // Recupero le dimensioni originali dell'immagine
        var OrgW = this.SubIntCtrl.width;
        var OrgH = this.SubIntCtrl.height;
        //
        // Su IE in apertura l'animazione di avvio incasina le cose: in questo caso provo ad attaccare l'immagine al body per leggerne le dimensioni
        if (RD3_Glb.IsIE() && (OrgW==0 && OrgH==0))
        {
          document.body.appendChild(this.SubIntCtrl);
          OrgW = this.SubIntCtrl.width;
          OrgH = this.SubIntCtrl.height;
          this.IntCtrl.appendChild(this.SubIntCtrl);
        }
        //
        // Se ho tutto... posso fare i miei calcoli
        if (OrgW && OrgH && this.CtrlRectW && this.CtrlRectH)
        {
          // Calcolo l'Aspect Ratio
          var Asp = OrgH / OrgW;
          //
          // Calcolo l'altezza che avrei se facessi la larghezza uguale a quella della box
          // Calcolo la larghezza che avrei se facessi l'altezza uguale a quella della box
          var NewHeight = (this.CtrlRectW-6) * Asp;
          var NewWidth = (this.CtrlRectH-6) / Asp;
          //
          // Se la nuova altezza supera l'altezza della cella... non ci sta in verticale
          if (NewHeight > this.CtrlRectH)
          {
            // Adatto e centro in larghezza
            s.width = NewWidth +"px";
            s.height = this.CtrlRectH - 6 +"px";
            s.position = "absolute";
            //
            this.SubCtrlRectW = this.CtrlRectW;
            this.SubCtrlRectH = this.CtrlRectH;
            //
            if (this.SubCtrlRectL != (this.CtrlRectW - NewWidth)/2)
            {
              s.left = (this.CtrlRectW - NewWidth)/2 +"px";
              this.SubCtrlRectL = (this.CtrlRectW - NewWidth)/2;
            }
            if (this.SubCtrlRectT != 0)
            {
              s.top = "0px";
              this.SubCtrlRectT = 0;
            }
          }
          else // non ci sta in orizzontale
          {
            s.width = this.CtrlRectW-6 +"px";
            s.height = NewHeight +"px";
            s.position = "absolute";
            //
            this.SubCtrlRectW = this.CtrlRectW;
            this.SubCtrlRectH = this.CtrlRectH;
            //
            if (this.SubCtrlRectL != 0)
            {
              s.left = "0px";
              this.SubCtrlRectL = 0;
            }
            if (this.SubCtrlRectT != (this.CtrlRectH - NewHeight)/2)
            {
              s.top = (this.CtrlRectH - NewHeight)/2 + "px";
              this.SubCtrlRectT = (this.CtrlRectH - NewHeight)/2;
            }
          }
        }
      }
      break;
    
    case 3 : // Stretch
      var ofs = (RD3_Glb.IsFirefox() ? 1 : 0);
      if (this.SubCtrlRectW != this.CtrlRectW - 6)
      {
        s.width = this.CtrlRectW - 6 +"px";
        this.SubCtrlRectW = this.CtrlRectW - 6;
      }
      if (this.SubCtrlRectH != this.CtrlRectH - 6 - ofs)
      {
        s.height = this.CtrlRectH - 6 - ofs +"px";
        this.SubCtrlRectH = this.CtrlRectH - 6 - ofs;
      }
      break;
  }
}


// ***********************************************************
// Evidenzia o meno la cella
// ***********************************************************
PCell.prototype.SetHilite = function(fl)
{
  if (this.IntCtrl)
  { 
    var parf = this.ParentField;
    var parp = parf.ParentPanel;
    //
    // Uso stile multiselezione
    if (parp.PanelMode == RD3_Glb.PANEL_LIST && parp.ShowMultipleSel && parf.ListList)
    {
      var obj = this.IntCtrl;
      if (obj instanceof IDCombo)
        obj = obj.ComboInput;
      if (obj instanceof IDEditor)
        obj = obj.GetDOMObj();
      //
      var wassel = parp.MultiSelStatus[this.PValue.Index];
      //
      // Con la multiselezione, se il campo era gia' selezionato non faccio nulla,
      // altrimenti gli applico lo stile giusto a seconda se e' il campo con il pallino o meno
      if (!wassel)
      {
        var cls = RD3_Glb.HasClass(obj,"panel-field-unselected")?"panel-field-selected":"panel-field-selected-back";
        RD3_Glb.SetClass(obj, cls, fl);
      }
      //
      return;
    }
    //
    if (this.IntCtrl instanceof IDCombo)
    {
      if (fl)
      {
        RD3_Glb.AddClass(this.IntCtrl.ComboInput, "cell-hover");
        this.IntCtrl.ComboActivator.style.backgroundImage = "url(images/detailw.png)";
      }
      else
      {
        RD3_Glb.RemoveClass(this.IntCtrl.ComboInput, "cell-hover");
        this.IntCtrl.ComboActivator.style.backgroundImage = "";
      }
    }
    else if (this.IntCtrl instanceof IDEditor)
    {
      // TODO 
    }
    else
    {
      if (fl)
      { 
        RD3_Glb.AddClass(this.IntCtrl, "cell-hover");
        if (this.ActObj)
        {
          if (!RD3_Glb.IsIE(10,false))
            this.ActObj.style.setProperty("background-image","url(images/detailw.png)","important");
          else
            this.ActObj.style.backgroundImage = "url(images/detailw.png)";
        }
      }
      else
      {
        RD3_Glb.RemoveClass(this.IntCtrl, "cell-hover");
        if (this.ActObj)
          this.ActObj.style.backgroundImage = "";
      }
    }
  }
}


// *****************************************************************
// Ritorna TRUE se il valore dell'input/textarea e' diverso dal testo
// della cella oppure se c'e' un evento di modifica pendente su di esso
// *****************************************************************
PCell.prototype.IsUncommitted = function()
{
  var o = this.GetDOMObj();
  //
  // Lo faccio solo se l'elemento e' quello attivo, altrimenti e' una perdita di tempo
  if (o && !this.HasWatermark && RD3_KBManager.ActiveElement==o && (o.tagName=="INPUT" || o.tagName=="TEXTAREA"))
  {
    // Se infilo in un INPUT un testo contente \n questo se li mangia.. quindi facendo il confronto risulterebbe cambiato..
    // in questo caso mangio eventuali \n dal testo prima di fare il confronto, in modo che non risulti questa modifica
    var valTxt = this.Text;
    if (o.tagName=="INPUT")
      valTxt = valTxt.replace(/\n/g, "");
    //
    // Il \r me lo mangio dovunque
    valTxt = valTxt.replace(/\r/g, "");
    //
    // Su IE6-IE9 il campo ritorna i \r, che devono quindi essere mangiati
    var valFld = o.value;
    if (RD3_Glb.IsIE(10,false))
      valFld = valFld.replace(/\r/g, "");
    //
    // Se ho una maschera devo mascherare il valore "" in modo da fare il confronto con il valore iniziale..
    // se il campo vale ",00" ed il Text e' "" in realta' sono uguali.. ma lo sapro' solo se applico la maschera a destra o tolgo la maschera a sinistra..
    // -> nel caso di valori gia' mascherati il server invia il Text buono.. quindi non dovrei avere problemi..
    // -> lo faccio solo se nel value c'e' qualcosa (valFld!=""), infatti "" viene mascherato solo se il campo ha il fuoco dentro..
    //    quindi ci potrebbero essere casi in cui entrambi valgono "".. ed in quel caso non devo mascherare
    if (this.Mask && this.Mask!="" && (valTxt=="" && valFld!=""))
      valTxt = GetInitValue(this.Mask, this.MaskType);
    //
    if (valFld!=valTxt)
      return true;
  }
  //
  // cerco negli eventi
  var ev = null;
  if (window.RD4_Enabled)
    ev = RD3_DesktopManager.MessagePumpRD4.GetEvent(this.PValue, "chg");
  else
   ev = RD3_DesktopManager.MessagePump.GetEvent(this.PValue, "chg");
  //
  if (ev && this.ParentField && this.ParentField.ParentPanel && this.ParentField.ParentPanel.IsDO)
  {
    // Ho un evento di CHG per il mio PValue, in teoria dovrei essere uncommitted, ma devo verificare se effettivamente il mio Text e' uguale al Text
    // del PValue, perche' potrebbe essere stata la cella della lista (o viceversa) ad essere stata modificata, in questo caso io devo adeguarmi..
    // solo per i pannelli DO, solo in DO si puo' passare da lista a dettaglio con modifiche
    //
    // Verifico se effettivamente c'e' un evento di cambio layout del pannello prima di continuare con il controllo; se ho un campo DO 
    // superattivo potrei avere dei CHG ma essere uncommited comunque..
    var ev2 = null;
    if (window.RD4_Enabled)
      ev2 = RD3_DesktopManager.MessagePumpRD4.GetEvent(this.ParentField.ParentPanel, "pantb");
    else
     ev2 = RD3_DesktopManager.MessagePump.GetEvent(this.ParentField.ParentPanel, "pantb");
    //
    if (ev2 && ev2.ObjName == "list")
      return this.Text === this.PValue.Text;
  }
  return (ev)?true:false;
}

// *******************************************************************
// Chiamato quando ho l'immagine da retinare
// *******************************************************************
PCell.prototype.OnAdaptRetina = function(w, h, par)
{
  if (par && par == "FORE" && this.ControlType == 30)
  {
    var imgS = this.IntCtrl.firstChild.style;
    imgS.width = w+"px";
    imgS.height = h+"px";
    imgS.top = "2px";
    imgS.left = "2px";
    imgS.display = "";
  }
  else
  {
    if (this.IntCtrl)
      this.IntCtrl.style.backgroundSize = w+"px "+h+"px";
    //
    // Ora posso dare l'immagine alla cella
    this.BackGroundImage = par;
    //
    // Ora che la cella ha l'immagine, la adatto
    if (this.ParentField.ImageResizeMode != 1 && RD3_ServerParams.ShowFieldImageInValue)
      this.SetBackGroundImageRM(this.ParentField.ImageResizeMode);
  }
}


PCell.prototype.UpdateFluidDims = function () 
{
  // Se non ho il controllo interno, non posso applicare subito le modifiche... 
  // lo devo fare piu' tardi... quando verra' creato il controllo
  if (!this.IntCtrl) {
    return;
  }
  else {
    var pf = this.ParentField;
    var w = pf.GetValueWidth(this.InList);
    var h = pf.GetValueHeight(this.InList);
    //
    // Padding da fornire alla cella (solo su Mobile qualora sia presente un attivatore o un badge)
    var padLeft = 0;
    var padRight = 0;
    //
    //var margx = ((this.ControlType == 2) ? 5 : 1);
    var margy = ((this.ControlType == 2) ? 5 : 1);
    var margya = 1;
    //
    // mi servono i padding, ma in questo caso non voglio modificare la larghezza tetendo conto dei bordi etc etc
    // perche' c'e':
    // -> border-box
    // -> il flex-basis funziona in modo diverso dalla width
    var margx = 0;
    //
    // Se c'e' l'ErrorBox (e non e' un aggiornamento dovuto alla focusbox)
    if (this.ErrorBox) 
    {
      // Posiziono l'error box in maniera assoluta sopra di me
      this.ErrorBox.style.left = this.IntCtrl.offsetLeft + "px";
      this.ErrorBox.style.top = (this.IntCtrl.offsetTop + this.IntCtrl.offsetHeight) + "px";
      this.ErrorBox.style.width = (this.CtrlRectW + (this.ActObj && this.ActObjVisible ? pf.GetActivatorWidth(this) + 2 : 0) + (this.ControlType == 2 ? 5 : 1)) + "px";    // 1px bordo + 2px padding per input
    }
    //
    // Nel caso combo viene messo un bordo aggiuntivo internamente.. devo verificare se forzare il ridimensionamento
    var adaptW = false;
    var st;
    if (this.ControlType == 3 && this.InList)   // COMBO InLIST
    {
      // Il margine ci deve essere per tutti i campi in lista tranne l'ultimo
      var marLeft = 1;
      if (this.InList && this.ParentField.ParentPanel.GetLastListField() == this.ParentField)
        marLeft = 0;
      //
      // Se il margine che devo applicare e' diverso da quello presente sulla combo allora rifaccio adattare la dimensione (anche se 
      // non e' cambiata)
      adaptW = (marLeft != this.IntCtrl.ComboMarLeft);
    }
    // Devo sistemare anche le dimensioni del controllo
    if (this.CtrlRectW != w - margx || adaptW) {
      this.CtrlRectW = w - margx;
      if (this.ControlType != 3 && !(this.ControlType == 101 && RD3_ServerParams.UseIDEditor))   // COMBO
      {
        if (!st) st = this.GetDOMObj().style;
        st.flexBasis = (this.CtrlRectW < 0 ? 0 : this.CtrlRectW) + "px";
        st.order = this.ParentField.Order;
        if (this.ParentField.ListHResMode == RD3_Glb.RESMODE_STRETCH) {
          st.flexShrink = "1";
          st.flexGrow = "1";
        }
        else {
          st.flexShrink = "0";
          st.flexGrow = "0";
        }
        //
        if (this.ErrorBox)
          this.ErrorBox.style.width = (this.CtrlRectW + (this.ActObj && this.ActObjVisible ? pf.GetActivatorWidth(this) + 2 : 0) + (this.ControlType == 2 ? 5 : 1)) + "px";    // 1px bordo + 2px padding per input
      }
      else
        this.IntCtrl.SetWidth(this.CtrlRectW);
    }
    //
    // Infine penso ai SottoControlli interni
    if (this.ControlType == 4) // CHECK
    {
      st = null;
      if (RD3_Glb.IsIE(10, false)) {
        if (this.SubCtrlRectX != (w / 2 - 9)) {
          this.SubCtrlRectX = (w / 2 - 9);
          if (!st) st = this.SubIntCtrl.style;
          st.left = this.SubCtrlRectX + "px";
        }
        if (this.SubCtrlRectY != (h / 2 - 9)) {
          this.SubCtrlRectY = (h / 2 - 9);
          if (!st) st = this.SubIntCtrl.style;
          st.top = this.SubCtrlRectY + "px";
        }
        if (this.SubCtrlRectW != 18) {
          this.SubCtrlRectW = 18;
          if (!st) st = this.SubIntCtrl.style;
          st.width = "18px";
        }
        if (this.SubCtrlRectH != 18) {
          this.SubCtrlRectH = 18;
          if (!st) st = this.SubIntCtrl.style;
          st.height = "18px";
        }
      }
      else {
        if (this.SubCtrlRectX != (w / 2 - 11)) {
          this.SubCtrlRectX = (w / 2 - 11);
          if (!st) st = this.SubIntCtrl.style;
          st.left = this.SubCtrlRectX + "px";
        }
      }
      //
      // Gestisco l'allineamento del check: se e' DESTRA devo invertire cella ed intestazione, 
      // altrimenti devo posizionarli normalmente (ma solo se la cella e' in form o fuori lista)
      // nota: non vale per tema mobile
      if ((!this.InList && !RD3_Glb.IsMobile() && this.ParentField.HdrForm && !this.ParentField.HdrFormAbove) || (this.InList && !this.ParentField.ListList && this.ParentField.HdrList && !this.ParentField.HdrListAbove)) {
        // Calcolo l'allineamento che devo avere
        var ali = this.GetDynAlignment();
        if (ali == "" && this.PValue)
          ali = this.PValue.GetVisualStyle().GetAlignment(1);
        //
        // Se l'allinneamento e' destro devo invertire label e valore
        if (ali == 4 || ali == "right") {
          var l = this.InList ? this.ParentField.ListLeft + this.ParentField.ParentPanel.RowSelWidth() : this.ParentField.FormLeft;
          //
          this.IntCtrl.style.left = l + "px";
          this.CtrlRectX = l;
          var ps = this.InList ? this.ParentField.ListCaptionBox.style : this.ParentField.FormCaptionBox.style;
          ps.left = l + this.CtrlRectW + 4 + 2 + "px"; // 2px di bordo
        }
        else  // in caso contrario la Label deve essere a sinistra e il valore a destra
        {
          var l = this.InList ? this.ParentField.ListLeft + this.ParentField.ParentPanel.RowSelWidth() : this.ParentField.FormLeft;
          var d = this.InList ? this.ParentField.ListHeaderSize + 4 : this.ParentField.FormHeaderSize + 4;
          //
          this.IntCtrl.style.left = l + d + "px";
          this.CtrlRectX = l + d;
          var ps = this.InList ? this.ParentField.ListCaptionBox.style : this.ParentField.FormCaptionBox.style;
          ps.left = l + "px";
        }
      }
    }
    //
    // Se sono un BLOB, e ho associato un'immagine e il mime type e' immagine allora ridimensiono
    if (this.ControlType == 10 && this.PValue && this.PValue.BlobMime == "image") // BLOB
      this.ResizeBLOBImage();
  }
}

PCell.prototype.IsFluidCell = function () 
{
  if (this.InList && this.ParentField && this.ParentField.ParentPanel.IsFluidPanel() && this.ParentField.ListList && !this.InListForm)
    return true;
  //
  return false;
}


// *****************************************************************
// Creo i controlli per un campo tramite BUTTON (il lista fluida)
// *****************************************************************
PCell.prototype.RenderFluidButton = function (vs, parent, cloned) 
{
  var pf = this.ParentField;
  var pp = pf.ParentPanel;
  var ie = RD3_Glb.IsIE();
  //
  var en = pf.IsCellClickable(this.PValue.Index, vs);
  var created = false;
  //
  // Se il controllo presente nella cella non e' BUTTON devo cambiare qualcosa
  if (this.ControlType != 6)        // VISCTRL_BUTTON
  {
    // Se c'e' gia' un controllo... e' sicuramente quello sbagliato!
    if (this.ControlType != -1)
      this.ClearElement(true);
    //
    // Creo il contenitore esterno per la lista
    this.IntCtrl = document.createElement("div");
    this.IntCtrl.className = "panel-field-value-list list-fluid-button";
    //
    parent.appendChild(this.IntCtrl);
    //
    // Creo INPUT
    this.SubIntCtrl = document.createElement("input");
    this.SubIntCtrl.type = "button";
    this.SubIntCtrl.className = "panel-value-button fluid-button"
    //
    this.IntCtrl.appendChild(this.SubIntCtrl);
    //
    // Ora questo e' il controllo di questa cella
    this.ControlType = 6;
    //
    // Ho creato il controllo
    created = true;
    //
    // Il controllo lo creo abilitato, quindi per gestire correttamente l'abilitazione mi devo memorizzare lo stato corretto
    this.IsEnabled = true;
  }
  //
  if (created || cloned || this.IsEnabled != en) {
    if (en) {
      this.SubIntCtrl.style.cursor = "pointer";
      this.SubIntCtrl.onclick = function (ev) { pf.OnClickActivator(ev); };
    }
    else {
      this.SubIntCtrl.style.cursor = "default";
      this.SubIntCtrl.onclick = null;
    }
  }
  //
  // Se e' cambiata la visibilita' del BUTTON, lo aggiorno
  if (this.IsEnabled != en) {
    this.SubIntCtrl.disabled = !en;
    this.IsEnabled = en;
  }
  //
  // Se e' cambiato il valore, lo imposto
  if (this.PValue.Text != this.Text) {
    this.Text = this.PValue.Text;
    this.SubIntCtrl.value = this.Text;
  }
  //
  // Applico lo stile visuale
  var oldC = this.IntCtrl;
  this.IntCtrl = this.SubIntCtrl;
  this.UpdateVisualStyle(vs);
  this.IntCtrl = oldC;
  //
  // Aggiorno le dimensioni dell'oggetto
  this.UpdateDims();
  //
  return created;
}

PCell.prototype.HandleFluidVisibility = function()
{
  if (!this.IsFluidCell() || !this.InList || !this.IntCtrl)
    return;
  //
  RD3_Glb.SetClass(this.IntCtrl, "fluid-list-hide", !this.IsVisible);
  //
  // C'e' un caso particolare: se una sotto-riga in lista ha tutti i figli invisibili deve nascondersi,
  // ma normalmente non succederebbe perche' fluid-list-hide imposta visibility hidden e display block
  // (questo perche' un campo nascosto deve comunque occupare spazio per allineare eventuali altri campi alla sua destra)
  //
  // Quindi devo verificare se la sotto-riga ha tutti i figli invisibili, nel qual caso va nascosta
  var prnt = this.IntCtrl.parentNode;
  if (prnt)
    RD3_Glb.SetClass(prnt, "subrow-empty", prnt.getElementsByClassName("fluid-list-hide").length == prnt.childNodes.length);
}

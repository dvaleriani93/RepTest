// ************************************************
// Instant Developer RD3 Framework
// (c) 1999-2009 Pro Gamma Srl - All rights reserved
//
// Classe CustomElementSubForm: Rappresenta un wrapper per gli 
// elementi custom contenenti sub form
// ************************************************
function CustomElementSubForm(parent)
{
  // Chiamo il costruttore base
  CustomElement.call(this, parent);
}
//
// Definisco l'estensione della classe
CustomElementSubForm.prototype = new CustomElement();

// ***************************************************
// Ritorna l'oggetto DOM principale dell'elemento
// ***************************************************
CustomElementSubForm.prototype.GetDOMObj = function()
{
  return this.IntDiv;  
}

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
CustomElementSubForm.prototype.Realize = function (parent, cls)
{
  // Creo il DIV dentro cui sara' contenuta la subform
  if (!this.IntDiv)
  {
    this.IntDiv = document.createElement("DIV");
    RD3_Glb.AddClass(this.IntDiv, "panel-cell-subform");
    parent.appendChild(this.IntDiv);
  }
  //
  CustomElement.prototype.Realize.call(this, parent, cls);
}

// ***************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta
// per essere distrutto
// ***************************************************************
CustomElementSubForm.prototype.Unrealize = function ()
{
  CustomElement.prototype.Unrealize.call(this);
  //
  // Se ho una sub-form la aggiungo alla lista di quelle da unrealizzare
  if (this.SubForm)
  {
    var suf = RD3_DesktopManager.ObjectMap[this.SubForm];
    if (suf)
    {
      this.SubFormToUnrealize = this.SubFormToUnrealize || [];
      this.SubFormToUnrealize.push(suf);
    }
  }
  //
  // Se ho delle subform da unrealizzare
  if (this.SubFormToUnrealize)
    this.SubFormToUnrealize.forEach(function (suf) {
      if (suf.Realized)
        suf.Unrealize();
    }.bind(this));
}

// ***************************************************
// Copia le proprieta' da un altro custom element
// ***************************************************
CustomElementSubForm.prototype.CopyFrom = function(ce)
{
  CustomElement.prototype.CopyFrom.call(this, ce);
  //
  // Copio la proprieta' SubForm (non posso fidarmi della CopyFrom perche' se
  // ce non ha la proprieta' SubForm la mia non viene "spenta")
  this.SubForm = ce.SubForm;
}

// ***************************************************
// Metodo invocato ogni volta che la cella si aggiorna
// ***************************************************
CustomElementSubForm.prototype.UpdateCell = function()
{
  CustomElement.prototype.UpdateCell.call(this);
  //
  // Se avevo una sub form ed e' cambiata, stacco la vecchia
  if (this.oldSubForm && this.oldSubForm != this.SubForm)
  {
    var suf = RD3_DesktopManager.ObjectMap[this.oldSubForm];
    if (suf.Realized && suf.FrameBox.parentNode === this.IntDiv)
    {
      suf.FrameBox.parentNode.removeChild(suf.FrameBox);
      //
      // Mi ricordo di aver messo questa sub-form nel limbo
      this.SubFormToUnrealize = this.SubFormToUnrealize || [];
      this.SubFormToUnrealize.push(suf);
    }
    //
    delete this.oldSubForm;
  }
  //
  // Se ho una sub form
  if (this.SubForm)
  {
    // C'e' un caso in cui non mi interessa... e' la Render della cella nel layout FORM durante la creazione del pannello
    if (this.Parent instanceof PCell && this.Parent.ParentField.ParentPanel && this.Parent.ParentField.ParentPanel.PanelMode == -1)
      return;
    //
    var suf = RD3_DesktopManager.ObjectMap[this.SubForm];
    if (!suf.Realized)
      suf.Realize(this.IntDiv); // Mai realizzata -> la realizzo
    else
    {
      // Era gia' realizzata ma non e' dentro di me (puo' capitare se scrollo perche' la form si muove tra le celle
      // oppure se passo da form a list). In entrambi i casi la sposto nella mia cella
      if (!suf.FrameBox.parentNode || suf.FrameBox.parentNode !== this.IntDiv)
        this.IntDiv.appendChild(suf.FrameBox);
    }
    //
    // Adatto me e la sub-form
    var w = this.Parent.CtrlRectW;
    var h = this.Parent.CtrlRectH;
    //
    // Se il pannello e' fluido, prendo l'altezza dalla subform
    if (this.Parent.IsFluidCell())
    {
      // L'altezza e' quella del primo frame
      h = suf.pSubForm.Frames[0].Height;
      //
      // Se e' un pannello e non mostra la toolbar tengo conto solo della lista
      if (suf.pSubForm.Frames[0] instanceof IDPanel && suf.pSubForm.Frames[0].OnlyContent)
        h = suf.pSubForm.Frames[0].OrgHeight + 8;
      //
      // Se la form ha la caption, aggiungo anche quella
      if (suf.pSubForm.HasCaption())
        h += suf.pSubForm.CaptionTxt.clientHeight + 4;
      //
      // Eccezione : se non sono visibile divento alto 0 - vedi CustomElementSubForm.prototype.SetVisible
      if (this.Visible == false)
        h = 0;
    }
    //
    this.SetWidth(w);
    suf.SetWidth(w);
    //
    this.SetHeight(h);
    suf.SetHeight(h);
    //
    suf.RecalcLayout = true;
    //
    this.oldSubForm = this.SubForm;
  }
}

// ***************************************************
// Imposta lo stato di visibilita' dell'elemento
// ***************************************************
CustomElementSubForm.prototype.SetVisible = function(value) 
{
  var oldValue = this.Visible;
  CustomElement.prototype.SetVisible.call(this, value);
  //
  if (!value && oldValue != value) 
  {
    this.OldVisibleHeight = this.Height;
    this.SetHeight(0);
  }
  else if (value && oldValue != value && this.OldVisibleHeight)
  {
    this.SetHeight(this.OldVisibleHeight);
    this.UpdateCell();
  }
}
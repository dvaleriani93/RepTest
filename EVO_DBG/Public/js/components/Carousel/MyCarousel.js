function MyCarousel(owner) {
    // Chiama il costruttore base
    CustomElement.call(this, owner);


    // ***************************************************************
    // Custom Properties
    // ***************************************************************
}

// Definisco l'estensione della classe
MyCarousel.prototype = new CustomElement();

// Carico eventuali dipendenze/CSS
CustomElement.LoadRequirements("public/js/components/Carousel/lib/carousel.min.css", "CSS");
CustomElement.LoadRequirements(["public/js/components/Carousel/lib/carousel.js"], "JS");

// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
MyCarousel.prototype.Realize = function (parent, cls) {
    // Creo il mio oggetto DOM
    this.MyBox = document.createElement("DIV");

    this.opts = {};
    this.opts.onCardSelection = function (id) {
        console.log(id)
        this.SendEvent("OnCardSelection", [id]);
    }.bind(this)

    console.log('realize')



    // Inizializzo lo stepbar
    this.Carousel = new Carousel(this.MyBox, this.opts);
    // this.Stepbar.singleStepAnimation = this.singleStepAnimation;
    // this.Stepbar.validateSkippedSteps = this.validateSkippedSteps;

    // Aggiungo il mio oggetto al DOM
    parent.appendChild(this.MyBox);

    // Chiamo il metodo base
    CustomElement.prototype.Realize.call(this, parent, cls);

}

// ***************************************************************
// Toglie gli elementi visuali dal DOM perche' questo oggetto sta
// per essere distrutto
// ***************************************************************
MyCarousel.prototype.Unrealize = function () {
    // Eventuali operazioni per liberare la memoria

    // Chiamo il metodo base
    CustomElement.prototype.Unrealize.call(this);
}

// ***************************************************************
// Metodi custom della libreria
// ***************************************************************

// ***************************************************************
// AddStep => Metodo per aggiungere un nuovo check point allo steper
// ***************************************************************
MyCarousel.prototype.add = function (obj) {

    let click = obj.action;
    obj.action = () => {
        eval(click);
    }
    this.Carousel.add(obj);
}

MyCarousel.prototype.clear = function () {
    this.Carousel.clear();
}


// ***************************************************************
// Gestione degli eventi standard
// ***************************************************************


// ***************************************************************
// Calcola le dimensioni dei div in base alla dimensione del
// contenuto
// ***************************************************************
MyCarousel.prototype.AdaptLayout = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un frame
    // Se serve adatto il mio oggetto DOM alle dimensioni dell'oggetto che mi contiene
    //
    // Chiamo il metodo base
    CustomElement.prototype.AdaptLayout.call(this);
}

// ***************************************************
// Ritorna l'oggetto DOM principale dell'elemento
// ***************************************************
MyCarousel.prototype.GetDOMObj = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un campo
    return this.MyBox;
}

// ***************************************************
// Imposta lo stato di abilitazione dell'elemento
// ***************************************************
MyCarousel.prototype.SetEnabled = function (value) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetEnabled.call(this, value);
}

// ***************************************************
// Imposta lo stato di visibilita' dell'elemento
// ***************************************************
MyCarousel.prototype.SetVisible = function (value) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetVisible.call(this, value);
}

// ***************************************************
// Imposta le coordinate della slider
// ***************************************************
MyCarousel.prototype.SetLeft = function (x) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo nei temi diversi da Ionic e Bootstrap

    // Chiamo il metodo base
    CustomElement.prototype.SetLeft.call(this, x);
}
MyCarousel.prototype.SetTop = function (y) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo nei temi diversi da Ionic e Bootstrap

    // Chiamo il metodo base
    CustomElement.prototype.SetTop.call(this, y);
}
MyCarousel.prototype.SetWidth = function (w) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetWidth.call(this, w);
}
MyCarousel.prototype.SetHeight = function (h) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetHeight.call(this, h);
}

// ***************************************************
// Imposta lo stile visuale dell'elemento
// ***************************************************
MyCarousel.prototype.SetVisualStyle = function (vs) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetVisualStyle.call(this, vs);
}

// ***************************************************
// Imposta il valore nell'elemento
// ***************************************************
MyCarousel.prototype.SetValue = function (value) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetValue.call(this, value);
}

// ***************************************************
// Ritorna il valore corrente dell'elemento
// ***************************************************
MyCarousel.prototype.GetValue = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    return CustomElement.prototype.GetValue.call(this);
}

// ***************************************************
// Imposta lo sfondo dell'elemento
// ***************************************************
MyCarousel.prototype.SetBackGroundImage = function (img) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetBackGroundImage.call(this, img);
}

// **********************************************************************
// Mette/toglie l'evidenziazione sull'elemento
// **********************************************************************
MyCarousel.prototype.SetActive = function (act) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetActive.call(this, act);
}

// ***********************************************
// Imposta il watermark dell'elemento
// ***********************************************
MyCarousel.prototype.SetWatermark = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.SetWatermark.call(this);
}

// ***********************************************
// Rimuove il watermark dell'elemento
// ***********************************************
MyCarousel.prototype.RemoveWatermark = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.RemoveWatermark.call(this);
}

// ***************************************************
// Nasconde/mostra il contenuto dell'elemento
// ***************************************************
MyCarousel.prototype.HideContent = function (hide, disable) {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.HideContent.call(this, hide, disable);
}

// ***************************************************
// Metodo invocato ogni volta che la cella si aggiorna
// ***************************************************
MyCarousel.prototype.UpdateCell = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.UpdateCell.call(this);
}

// ***************************************************
// L'elemento puo' ricevere il fuoco?
// ***************************************************
MyCarousel.prototype.CanHaveFocus = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    return CustomElement.prototype.CanHaveFocus.call(this);
}

// ***************************************************
// L'elemento riceve il fuoco
// ***************************************************
MyCarousel.prototype.Focus = function () {
    // Metodo chiamato solo per i CustomElement contenuti in un campo

    // Chiamo il metodo base
    CustomElement.prototype.Focus.call(this);
}
function MyStepbar(owner) {
	// Chiama il costruttore base
	CustomElement.call(this, owner);
	//console.log(this._options)

	this._options = this._options ? this._options : {
		currentStep: 0
	};


	//console.log(this._options)
	// ***************************************************************
	// Custom Properties
	// ***************************************************************
	this.singleStepAnimation = 1000;
	this.validateSkippedSteps = false;

	//console.log('definizione')
}

// Definisco l'estensione della classe
MyStepbar.prototype = new CustomElement();

// Carico eventuali dipendenze/CSS
CustomElement.LoadRequirements("public/js/components/Stepbar/lib/stepbar.css", "CSS");
CustomElement.LoadRequirements(["public/js/components/Stepbar/lib/stepbar.js"], "JS");


/*
Object.defineProperty(MyStepBar.prototype, "MyOtherProp", {
	get: function() {
		return this._MyOtherProp;
	},
	set: function(value) {
		this._MyOtherProp = value;
	}
});
*/


//NO GETTERS O SETTERS PERCHé INDE FA SCHIFO

/*
Object.defineProperty(MyStepbar.prototype, "currentStep", {
	get: function() {
		if (this.Stepbar){
			return this.Stepbar.currentStep;
		}else{
			return this._options.currentStep;
		}
	},
	set: function(value) {
		
	}
});
*/


// ***************************************************************
// Crea gli oggetti DOM utili a questo oggetto
// L'oggetto parent indica all'oggetto dove devono essere contenuti
// i suoi oggetti figli nel DOM
// ***************************************************************
MyStepbar.prototype.Realize = function (parent, cls) {
	// Creo il mio oggetto DOM
	this.MyBox = document.createElement("DIV");
	this.MyBox.classList.add('progress-bar-wrapper');

	this.opts = this._options;
	this.opts.onStepValidation = function (index) {
		this.SendEvent("OnStepValidation", [index]);
	}.bind(this)


	this.opts.onStepSelection = function (index) {
		//console.log(index)
		this.SendEvent("OnStepSelection", [index]);
	}.bind(this)

	//console.log('realize')



	// Inizializzo lo stepbar
	this.Stepbar = new StepBar(this.MyBox, this.opts);
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
MyStepbar.prototype.Unrealize = function () {
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
MyStepbar.prototype.add = function (structure) {

	let click = structure.action;
	structure.action = () => {
		eval(click);
	}
	this.Stepbar.add(structure);
}

// ***************************************************************
// RemoveStep => Metodo per rimuovere un check point dallo steper
// ***************************************************************
MyStepbar.prototype.remove = function (index) {
	this.Stepbar.remove(index);
}

//Pulizia totale della stepbar
MyStepbar.prototype.clear = function () {
	this.Stepbar.clear();
}

// ***************************************************************
// MoveTo => Metodo per forzare il focus su un checkPoint
// ***************************************************************
MyStepbar.prototype.moveNext = function () {
	this.Stepbar.moveNext();
}
MyStepbar.prototype.movePrevious = function () {
	this.Stepbar.movePrevious();
}
MyStepbar.prototype.moveFirst = function () {
	this.Stepbar.moveFirst();
}
MyStepbar.prototype.moveLast = function () {
	this.Stepbar.moveLast();
}
// ***************************************************************
// Validate => Metodo per validare un checkPoint
// ***************************************************************
MyStepbar.prototype.validate = function (index = this.Stepbar.currentStep, state = true) {
	index = index || index === 0 ? index : undefined;

	this.Stepbar.validate(index, state)
}

MyStepbar.prototype.lock = function (index = this.Stepbar.currentStep, state = true) {
	index = index || index === 0 ? index : undefined;

	this.Stepbar.lock(index, state)
}

MyStepbar.prototype.warning = function (index = this.Stepbar.currentStep, state = true) {
	index = index || index === 0 ? index : undefined;

	this.Stepbar.warning(index, state)
}
MyStepbar.prototype.error = function (index = this.Stepbar.currentStep, state = true) {
	index = index || index === 0 ? index : undefined;
	//console.log('sono dinta')
	this.Stepbar.error(index, state)
}

MyStepbar.prototype.tooltip = function (index = this.Stepbar.currentStep, value = '') {
	index = index || index === 0 ? index : undefined;
	this.Stepbar.tooltip(index, value)
}

MyStepbar.prototype.title = function (index = this.Stepbar.currentStep, value = '') {
	index = index || index === 0 ? index : undefined;
	this.Stepbar.title(index, value)
}

MyStepbar.prototype.currentStep = function (index) {
	index = index || index === 0 ? index : undefined;

	//console.log('setter', index)
	this._options.currentStep = index;
	if (this.Stepbar) {
		this.Stepbar.currentStep = this._options.currentStep;
	}

	//console.log(this._options)
}


// ***************************************************************
// Gestione degli eventi standard
// ***************************************************************


// ***************************************************************
// Calcola le dimensioni dei div in base alla dimensione del
// contenuto
// ***************************************************************
MyStepbar.prototype.AdaptLayout = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un frame
	// Se serve adatto il mio oggetto DOM alle dimensioni dell'oggetto che mi contiene
	//
	// Chiamo il metodo base
	CustomElement.prototype.AdaptLayout.call(this);
}

// ***************************************************
// Ritorna l'oggetto DOM principale dell'elemento
// ***************************************************
MyStepbar.prototype.GetDOMObj = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo
	return this.MyBox;
}

// ***************************************************
// Imposta lo stato di abilitazione dell'elemento
// ***************************************************
MyStepbar.prototype.SetEnabled = function (value) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetEnabled.call(this, value);
}

// ***************************************************
// Imposta lo stato di visibilita' dell'elemento
// ***************************************************
MyStepbar.prototype.SetVisible = function (value) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetVisible.call(this, value);
}

// ***************************************************
// Imposta le coordinate della slider
// ***************************************************
MyStepbar.prototype.SetLeft = function (x) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo nei temi diversi da Ionic e Bootstrap

	// Chiamo il metodo base
	CustomElement.prototype.SetLeft.call(this, x);
}
MyStepbar.prototype.SetTop = function (y) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo nei temi diversi da Ionic e Bootstrap

	// Chiamo il metodo base
	CustomElement.prototype.SetTop.call(this, y);
}
MyStepbar.prototype.SetWidth = function (w) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetWidth.call(this, w);
}
MyStepbar.prototype.SetHeight = function (h) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetHeight.call(this, h);
}

// ***************************************************
// Imposta lo stile visuale dell'elemento
// ***************************************************
MyStepbar.prototype.SetVisualStyle = function (vs) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetVisualStyle.call(this, vs);
}

// ***************************************************
// Imposta il valore nell'elemento
// ***************************************************
MyStepbar.prototype.SetValue = function (value) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetValue.call(this, value);
}

// ***************************************************
// Ritorna il valore corrente dell'elemento
// ***************************************************
MyStepbar.prototype.GetValue = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	return CustomElement.prototype.GetValue.call(this);
}

// ***************************************************
// Imposta lo sfondo dell'elemento
// ***************************************************
MyStepbar.prototype.SetBackGroundImage = function (img) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetBackGroundImage.call(this, img);
}

// **********************************************************************
// Mette/toglie l'evidenziazione sull'elemento
// **********************************************************************
MyStepbar.prototype.SetActive = function (act) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetActive.call(this, act);
}

// ***********************************************
// Imposta il watermark dell'elemento
// ***********************************************
MyStepbar.prototype.SetWatermark = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.SetWatermark.call(this);
}

// ***********************************************
// Rimuove il watermark dell'elemento
// ***********************************************
MyStepbar.prototype.RemoveWatermark = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.RemoveWatermark.call(this);
}

// ***************************************************
// Nasconde/mostra il contenuto dell'elemento
// ***************************************************
MyStepbar.prototype.HideContent = function (hide, disable) {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.HideContent.call(this, hide, disable);
}

// ***************************************************
// Metodo invocato ogni volta che la cella si aggiorna
// ***************************************************
MyStepbar.prototype.UpdateCell = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.UpdateCell.call(this);
}

// ***************************************************
// L'elemento puo' ricevere il fuoco?
// ***************************************************
MyStepbar.prototype.CanHaveFocus = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	return CustomElement.prototype.CanHaveFocus.call(this);
}

// ***************************************************
// L'elemento riceve il fuoco
// ***************************************************
MyStepbar.prototype.Focus = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo

	// Chiamo il metodo base
	CustomElement.prototype.Focus.call(this);
}

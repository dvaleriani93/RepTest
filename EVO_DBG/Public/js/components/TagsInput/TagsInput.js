//Source: https://bootstrap-tagsinput.github.io/bootstrap-tagsinput/examples/
function TagsInput(owner) {
	this.confirmKeys = [13, 32];
	this.trimValue = true;
	this.allowDuplicates = false;
	this.delimiter = ';'
	//this._pattern = '';
	//
	// Call base constructor
	CustomElement.call(this, owner);

}
//
// Define extension of class
TagsInput.prototype = new CustomElement();
//
CustomElement.LoadRequirements("public/js/components/tagsinput/lib/bootstrap-tagsinput.css", "CSS");
CustomElement.LoadRequirements("public/js/components/tagsinput/lib/bootstrap-tagsinput.min.js", "JS");

// ***************************************************
// Ritorna l'oggetto DOM principale
// ***************************************************
TagsInput.prototype.GetDOMObj = function () {
	return this.TagsInputBox;
}

Object.defineProperty(TagsInput.prototype, "pattern", {
	get: function () {
		return this._pattern;
	},
	set: function (value) {
		if (this && value) {
			this._pattern = value;
			console.log('setter done', value, this);
		}
	}
});

// ***************************************************
// Crea gli oggetti visuali
// ***************************************************
TagsInput.prototype.Realize = function (parent, cls) {
	this.TagsInputBox = document.createElement("DIV");
	if (GlobalObject.prototype.IsIonic() || GlobalObject.prototype.IsBts())
		this.TagsInputBox.style.position = "relative";
	this.TagsInputInp = document.createElement("INPUT");
	$(this.TagsInputInp).data("role", "tagsinput");
	this.TagsInputBox.appendChild(this.TagsInputInp);
	//
	$(this.TagsInputInp).tagsinput({ confirmKeys: this.confirmKeys });
	$(this.TagsInputInp).tagsinput({ trimValue: this.trimValue });
	$(this.TagsInputInp).tagsinput({ allowDuplicates: this.allowDuplicates });
	$(this.TagsInputInp).tagsinput({ delimiter: this.delimiter });
	//$(this.TagsInputInp).tagsinput({ delimiterRegex: this.delimiter });
	//

	console.log(this.TagsInputInp)
	var pthis = this;

	//pthis._pattern = this.pattern;
	this.InputObserver = new MutationObserver(function (mutationsList) {
		for (var mutation of mutationsList) {
			if (mutation.type == 'childList')
				pthis.Value = pthis.TagsInputInp.value.replaceAll(',', ';');
		}
		pthis.OnChange();
	});
	//
	this.InputObserver.observe(this.TagsInputBox, { childList: true, subtree: true });
	//
	$(this.TagsInputInp).on("beforeItemAdd", function (event) {
		// event.item: contains the item
		// event.cancel: set to true to prevent the item getting added

		console.log(pthis._pattern)
		if (!pthis._pattern) {
			event.cancel = false;
			console.log('a')
		} else {
			let regEx;
			console.log(pthis._pattern.trim().toUpperCase())
			switch (pthis._pattern.trim().toUpperCase()) {
				case 'email'.trim().toUpperCase():
					regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					console.log('b')
					break;
				default:
					console.log('c')
					// Di default se viene inserito qualche pattern che non viene riconosciuto, la stringa viene considerato una regEx
					try { regEx = new RegExp(pthis._pattern); }
					catch (e) { console.error(`Si è verificato un errore imprevisto durante la conversione di una RegEx`) };
					break;
			}

			event.cancel = regEx ? !regEx.test(String(event.item).toLowerCase()) : false;
		}
		/*
				if (pthis._pattern.length > 0) {
					let re = '';
					switch (pthis._pattern.trim().toUpperCase()) {
						case 'email'.toUpperCase():
							re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
							break;
			
						default:
							try {
								re = new RegExp(pthis._pattern);
							} catch {
								console.error('Errore durante il cast della regular expression')
								event.cancel = false;
							}
							break;
					}
					if (re) {
						event.cancel = !re.test(String(event.item).toLowerCase());
					}
				}
			
		*/


		pthis.OnChange();
	});
	//
	parent.appendChild(this.TagsInputBox);
	//
	CustomElement.prototype.Realize.call(this, parent, cls);
}


TagsInput.prototype.addToken = function (value) {
	console.log(value)
	if (value) {
		console.log(this.TagsInputInp)
		this.TagsInputInp.tagsinput('add', value);
	}
}


// ***************************************************
// Imposta il testo presente
// ***************************************************
TagsInput.prototype.SetValue = function (value) {
	console.log(value)
	oldTags = $(this.TagsInputInp).tagsinput("items");
	newTags = value.split(";");
	for (let i = 0; i < Math.max(newTags.length, oldTags.length); i++) {
		let newTag = newTags[i];
		let oldTag = oldTags[i];
		if (oldTag && newTag !== oldTag)
			$(this.TagsInputInp).tagsinput("remove", oldTag);
		if (newTag)
			$(this.TagsInputInp).tagsinput("add", newTag);
	}
	//
	CustomElement.prototype.SetValue.call(this, value);
}

// ***************************************************
// Imposta lo stato di abilitazione dell'elemento
// ***************************************************
TagsInput.prototype.SetEnabled = function (value) {
	CustomElement.prototype.SetEnabled.call(this, value);
	//
	if (this.Enabled) {
		if (this.DivForDisabled)
			this.DivForDisabled.remove();
	} else if (!this.Enabled) {
		if (!this.DivForDisabled) {
			this.DivForDisabled = document.createElement("DIV");
			this.DivForDisabled.style.position = "absolute";
			this.DivForDisabled.style.width = "100%";
			this.DivForDisabled.style.height = "100%";
			this.DivForDisabled.style.left = "0px";
			this.DivForDisabled.style.top = "0px";
		}
		this.TagsInputBox.appendChild(this.DivForDisabled);
	}
}

// ***************************************************
// L'elemento puo' ricevere il fuoco?
// ***************************************************
TagsInput.prototype.CanHaveFocus = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo
	//
	// Chiamo il metodo base
	return CustomElement.prototype.CanHaveFocus.call(this);
}

// ***************************************************
// L'elemento riceve il fuoco
// ***************************************************
TagsInput.prototype.Focus = function () {
	// Metodo chiamato solo per i CustomElement contenuti in un campo
	$(this.TagsInputInp).tagsinput("focus");
	//
	// Chiamo il metodo base
	CustomElement.prototype.Focus.call(this);
}
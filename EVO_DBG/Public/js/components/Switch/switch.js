/* ---------------------------------- */

//--TOGGLE SWITCH--//

// =============================================================================
// Switch v. 2.5
// -Inclusione delle icone Font Awesome
// -Auto-resizing del selector
// =============================================================================
function createSwitch(element, sMenu) {
	try{
		const objMENU = JSON.parse(decodeURI(sMenu)),
		idElement = Math.floor(Math.random() * 100); /* Genero un numero casuale come id per gestire più switch contemporaneamente */

		let container = document.createElement('div'),
		selector = document.createElement('div'),
		startingItem = null, /* Elemento preselezionato */
		isExecuted = false; /* Esecuzione dell'elemento preselezionato*/


		// Configurazione iniziale del container
		container.id = 'switch-container_' + idElement;
		container.classList.add('switch-container');

		// Configurazione iniziale del selector
		selector.id = 'switch-selector_' + idElement;
		selector.classList.add('switch-selector');
		container.appendChild(selector);

		// Funzione per gestire lo spostamento del selector al click su un item o in caso di preselezione
		function setSwitch(target){
			if (target){
				function selectorResize(){
					selector.style.top = target.offsetTop + 'px';
					selector.style.left = target.offsetLeft + 'px';
					selector.style.height = target.offsetHeight + 'px';
					selector.style.width = target.offsetWidth + 'px';
				}

				selectorResize();
				selector.innerHTML = target.innerHTML;

				var resizeObserver = new ResizeObserver(selectorResize);
				resizeObserver.observe(target);
			}
		}

		// Utilizzo un array ORDINATO di indici
		// NOTA: Gli indici dell'array servono per l'ordinamento degli elementi nello switch (non dovrebbero esistere chiavi duplicate, ma l'oggetto IDMap di Inde le intercetta)
		let arKeys = Object.keys(objMENU).sort();
		arKeys.forEach(function(key) {
			// Configurazione degli item
			let button = document.createElement('div');
			button.classList.add('switch-item');
			if ((objMENU[key]['additionalStyle']).length > 0){button.style =  objMENU[key]['additionalStyle'];}
			button.innerHTML = (objMENU[key]['icon'] + ' ' + objMENU[key]['item']).trim();

			// Al click sull'item, eseguo la sunzione e riposiziono il selector
			button.addEventListener("click", function() {
				RD3_SendCommand(objMENU[key]['command'], objMENU[key]['params']);
				setSwitch(button);
			});

			// Controllo se l'elemento è preselezionato e se deve essere eseguito
			if (objMENU[key]['isPreselected'] == true) {
				startingItem = button;
				if (objMENU[key]['isExecuted'] == true) {
					isExecuted = true;
				}
			}

			container.appendChild(button);
		});

		// Svuoto l'elemento da eventuali residui e posiziono lo switch
		element.innerHTML = '';
		element.appendChild(container);

		// Nel caso ci sia un elemento preselezionato, lo setto ed eventualmente eseguo la sua azione
		if (startingItem){
			setSwitch(startingItem);
			if (isExecuted){
				startingItem.click();
			}
		}else{
			selector.style.display = 'none';
		}
	}
	catch{
		// Mostro dei messaggi di errore
		element.innerHTML = 'Impossibile caricare lo switch';
		console.error('Impossibile caricare lo switch');
	}
}
//--//

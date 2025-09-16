if (typeof window.Loader === 'undefined') {
	window.Loader = class {
		constructor() {
			if (!document.getElementById('loader')) {
				this.loader = document.createElement('iframe');
				this.loader.src = 'public/pages/loader/index.html';
				this.loader.id = 'loader';
				this.loader.style.display = "block";
				this.loader.style.position = "absolute";
				this.loader.style.top = "0px";
				this.loader.style.left = "0px";
				this.loader.style.width = "100%";
				this.loader.style.height = "100%";
				this.loader.style.backgroundColor = "white";
				this.loader.style.zIndex = '9999';
			}
		}

		setImage(path) {
			if (path) {

			}
		}
		setTimeout(timeout = 0) {
			if (timeout > 0) {
				setTimeout(() => {
					this.destroy();
				}, timeout);
			}
		}

		display() {
			document.body.appendChild(this.loader);
		}

		destroy() {
			if (this.loader) this.loader.remove();
		}
	}
}

//	Avvio il caricamento del loader (verrà disattivato nell'afterServerLoad())
let loader = new Loader();
loader.setTimeout(0);
loader.setImage('public/images/loader.png');
loader.display();




const loadScript = path => {
	if (path) {
		const extension = path.split('.').pop();

		let node;
		switch (extension.toUpperCase()) {
			case 'JS':
				node = document.createElement('script');
				node.type = 'text/javascript';
				node.async = false;
				node.src = path;
				break;
			case 'CSS':
				node = document.createElement('link');
				node.rel = 'stylesheet';
				node.type = 'text/css';
				node.href = path;
				break;
			default:
				console.warn(`Impossibile caricare la risorsa ${path}: Estensione ${extension} non gestita`);
				break;
		}

		if (node && !(document.getElementById(path))) {
			node.id = path;
			//console.time(path);
			document.body.appendChild(node);
			//console.timeEnd(path);
		}
	}
};




function load() {
	fetch("public/dependencies.json")
		.then(response => response.json())
		.then(json => {
			/*console.log(json);*/
			if (json) {
				json.forEach(dependency => {
					loadScript(dependency.path);

					/*
						//Carico la risorsa
						CustomElement.LoadRequirements(dependency.path, dependency.extension);
	
						//Eseguo il fetch per riscaricare la risorsa e per dare alla pagina il tempo di integrarsela
						fetch(dependency.path)
							.then((response) => { })
							.catch(error => console.error(`Errore durante il caricamento del file ${dependency}: ${error}`));
							*/
				});
			}
		})
		.then(() => { loadScript('public/js/afterClientLoad.js') })
		.catch(error => {
			console.error(error);

			//Mando alla pagina di login per rigenerare il file dependency.json
			RD3_SendCommand('Logout');
		});
}





window.addEventListener("load", () => {
	load();

	//PULISCI LOG UTENTI - Marco 28/10/2022
	//L'event handler dell'unload si attiva anche al refresh della pagina.
	//Quando si carica dopo il refresh entra in questo evento e controlla se è avvenuto un'aggiornamento della pagina. 
	//Se sì allora va a correggere il log offline settato nell'unload e lo rimette online.

	if (String(window.performance.getEntriesByType("navigation")[0].type) === "reload") {

		RD3_SendCommand('PulisciLogUtenti');

	}


	//Autorefresh dopo 10 secondi di attesa
	//setTimeout(()=>{if(document.getElementById('loader')) location.reload();}, 10000);
});

function RD3_CustomInit() {
	RD3_TooltipManager.DelayShow = 100;
	RD3_TooltipManager.DelayHide = 15000;

	//tasti funzione

	RD3_ClientParams.FKActField = 0;
	RD3_ClientParams.FKActRow = 0;	// era F12
	RD3_ClientParams.FKCancel = 0;
	RD3_ClientParams.FKCloseForm = 0;
	RD3_ClientParams.FKDelete = 0;
	RD3_ClientParams.FKDuplicate = 0;
	RD3_ClientParams.FKEnterQBE = 0;
	RD3_ClientParams.FKFindData = 0;
	RD3_ClientParams.FKFormList = 0;
	RD3_ClientParams.FKInsert = 0;
	RD3_ClientParams.FKLocked = 0;
	RD3_ClientParams.FKPrint = 0;
	RD3_ClientParams.FKRefresh = 0;
	RD3_ClientParams.FKSelAll = 0;
	RD3_ClientParams.FKSelNone = 0;
	RD3_ClientParams.FKSelTog = 0;
	RD3_ClientParams.FKUpdate = 0;

	//dalay per trim automatico campi attivi per ogni tasto (8 dec.)
	RD3_ClientParams.SuperActiveDelay = 400;
}

//INSERIMENTO LOG UTENTI - Marco 28/10/2022
//Questo evento è praticamente uguale all'event handler del load. 
//Il load però parte solo quando non c'è una cache dietro (ad esempio il load non parte premendo le frecce avanti - indietro del browser per via della loro cache).
//Questo evento quindi parte ogni volta che si riapre e va a inserire il log nuovo per indicare che l'utente è uscito e poi rientrato sul sito.
//Nel comando ci sono i controlli per evitare di inserirlo se un log dell'utente è ancora online.

window.addEventListener("pageshow", () => {

	RD3_SendCommand('InserisciLog');

});

//AGGIORNAMENTO LOG UTENTI - Marco 28/10/2022
//Questo evento intercetta l'unload del browser in qualunque modo (anche nel refresh, ma che poi ho fixato).
//Appena parte l'unload va nell'ultimo log online dell'utente e lo setta offline.
window.onbeforeunload = function() {
   
		RD3_SendCommand('AggiornaLogUtenti');
   	   
   return;
}

//Serve a disabilitare il contextmenu del browser così da mostrare soltanto il nostro. 03/01/2024 rif Mattia/Antonio
//Dato che in alcuni casi apparivano entrambi con quello del Br. copriva il Nostro.
document.addEventListener("contextmenu", function(e) { 
   e.preventDefault();
});

//ridimensionamento dei tab per la stepbar
function changeWidth(width) {

    var clsWidth = ''

    clsWidth = document.getElementsByClassName('selected-tab-caption-container-0');
    applyWidth(width, clsWidth);

    clsWidth = document.getElementsByClassName('tab-caption-container-0');
    applyWidth(width, clsWidth);

    clsWidth = document.getElementsByClassName('tab-caption-0');
    applyWidth(width, clsWidth);

    clsWidth = document.getElementsByClassName('tab-caption-h1-0');
    applyWidth(width, clsWidth);

    clsWidth = document.getElementsByClassName('selected-tab-caption-0');
    applyWidth(width, clsWidth);
}

function applyWidth(width, clsWidth) {
    //alert('new width ' + width);
    for (var index = 0; index < clsWidth.length; index++) {
        clsWidth[index].style.width = (width + 'px');
    }
}
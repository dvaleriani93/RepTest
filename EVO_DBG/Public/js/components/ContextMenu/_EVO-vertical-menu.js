// Il file presenta un riferimento esterno: file custom.js -> funzione setPosition
if (typeof window.ContextMenu === 'undefined') {
	window.ContextMenu = class {
		menus = [];
		constructor(options) {
			//Elimino l'elemento precedentemente creato
			let contextMenu = document.getElementById("context-menu");
			if (contextMenu) {
				contextMenu.remove();
			}

			this.options = options;
			const position = this.options.position ?
				this.options.position : { x: 0, y: 0 };

			this.container = this.#createContainer();
			if (this.container) {
				this.x = position.x;
				this.y = position.y;

				/*
				this.container.style.left = position.x + "px";
				this.container.style.top = position.y + "px";
				*/
				document.body.appendChild(this.container);

				this.container.classList.add("menu--show");
				this.container.id = "context-menu";
			}
		}

		#createContainer() {
			const container = document.createElement("ul");
			container.classList.add("menu");

			return container;
		}

		#createItem(structure) {
			let item;
			item = document.createElement("li");
			item.classList.add("menu--item");
			if (structure) {
				let button = document.createElement("span");

				if (structure.icon) {
					button.innerHTML = structure.icon;
				}

				let title = document.createElement("span");
				title.innerHTML = structure.title;
				title.classList.add("span-title");

				button.appendChild(title);

				if (typeof structure.callback === "function") {
					const callback = structure.callback;
					item.addEventListener("click", () => {
						callback();

						if (!structure.submenus) {
							removeContextMenu();
						}
					});
				}
				else {
					const callback = structure.callback;
					item.addEventListener("click", () => {
						eval(callback);

						if (!structure.submenus) {
							removeContextMenu();
						}
					});
				}



				if (!structure.isEnabled) {
					item.classList.add("menu--item--disabled");
				}

				item.appendChild(button);

				//  console.log(structure.submenus)

				//Gestione delle voci di menu annidate
				if (structure.submenus && structure.submenus.length > 0) {
					//title.innerHTML = title.innerHTML + " >";

					const submenus = this.#createStructure(structure.submenus, this.#createContainer());
					item.appendChild(submenus);
					item.classList.add('menu--father');


					item.addEventListener('mouseover', (event) => {
						this.#setPosition(submenus);
					});
				}
			}

			return item;
		}

		#setPosition(element) {
			// punti dell'area a(x1,y1) alto sinistra, b(x2,y1) alto destra, c(x1,y2)basso sinistra, d(x2,y2) basso destra

			const getIntValue = (value) => {
				return Number(value.replace('px', ''));
			}


			if (element) {
				const item = element.parentElement;
				const menu = item.parentElement;

				console.log(menu, item)
				let width = element.clientWidth,
					height = element.clientHeight,
					screenWidth = window.innerWidth,
					screenHeight = window.innerHeight;

				// Metto il menu a destra o a sinistra?
				const bRight = screenWidth >= menu.offsetLeft + menu.clientWidth + width;
				//console.log(bRight, screenWidth, menu.offsetLeft, menu.clientWidth, width)

				var a = getIntValue(menu.style.top) + item.offsetTop + height
				console.log(a)
				// Metto il menu in basso o in alto?
				const bBottom = screenHeight >= getIntValue(menu.style.top) + item.offsetTop + height;
				console.log(bBottom, screenHeight, getIntValue(menu.style.top), item.offsetTop, item.clientHeight, height)

				element.style.left = (bRight ? item.clientWidth : (-1 * width)) + 'px';
				element.style.top = (bBottom ? 0 : -1 * (item.offsetTop + item.offsetHeight - height)) + 'px';
			}
		}
		/*
			//Aggiungo un elemento per volta
			add(item) {
								const menu = this.#createItem(item);
								if (menu) {
													 this.menus.push(menu);
													 this.container.appendChild(menu);
								}
			}
		*/
		//Creo il menu sulla base di un tracciato
		#createStructure(structure, container = this.container) {
			if (!container) {
				container = this.#createContainer();

			}
			if (structure) {
				structure.forEach(group => {
					//console.log('nuovo gruppo')
					if (group) {
						group.forEach(item => {
							//console.log(item.title);
							if (item) {
								container.appendChild(this.#createItem(item))
								// console.log(container);
							}
						});

						if (structure[structure.length - 1] !== group) {
							container.append(this.#createSeparator())
						}
					}
				});
			}
			return container;
		}

		#createSeparator() {
			let sepatator = document.createElement('span');
			sepatator.classList.add('menu--separator');
			//this.container.appendChild(sepatator);
			return sepatator;
		}

		creaDaTracciato(structure) {
			const contextualMenu = this.#createStructure(structure, this.container);
			//this.container.appendChild(contextualMenu, this.container);

			//console.log(this.container)
		}
	}
}


/* ***************************************************************************************************************** */
// "Endpoint" per le funzionalità base del tasto destro
/* ***************************************************************************************************************** */
const defaultContextMenu = (method, target) => {
	switch (method.toUpperCase()) {
		case 'CtrlX'.toUpperCase():
			// Copia il testo indicato
			defaultContextMenu('CtrlC', target);

			// Informo il framework che deve aggiornare il campo
			RD3_SendCommand('ContextMenu', 'shortcut=CtrlX');
			break;

		case 'CtrlC'.toUpperCase():
			function copy(value) {
				let copyArea = document.createElement("textarea");
				document.body.appendChild(copyArea);
				copyArea.value = value;
				copyArea.select();
				document.execCommand("copy");
				document.body.removeChild(copyArea);
			}

			copy(window.getSelection().toString() ? window.getSelection().toString() : target.value);
			break;
		case 'CtrlV'.toUpperCase():
			setTimeout(async () => {
				// Lettura del campo dalla clipboard
				let sValue = await navigator.clipboard.readText();

				// Informo il framework che deve aggiornare il campo
				RD3_SendCommand('ContextMenu', 'shortcut=CtrlV&value='.concat(sValue));
			}, 10);
			break;
		default:
			break;
	}

	removeContextMenu();
}

/* ***************************************************************************************************************** */
function contextMenuCreate(structure = [], init = {}) {
	// Creazione tracciato di default
	let bOk = false;
	if (init?.target) {
		const target = document.getElementById(init.target)
	//	console.log(target)
		if (target) {
			if (!structure) {
				structure = [];
			}
			let group = [];
			let isLocked = target.classList.contains('EVO-bloccato');

			if (target.value && target.value.length > 0) {
				// Se il campo è sbloccato aggiungo il taglia
				if (!isLocked) {
					group.push({
						'icon': '<i class="fa-solid fa-scissors"></i>',
						'title': 'Taglia',
						'isEnabled': true,
						'callback': () => { defaultContextMenu('CtrlX', target); },
						'submenus': []
					});
				}

				group.push({
					'icon': '<i class="fa-solid fa-copy"></i>',
					'title': 'Copia',
					'isEnabled': true,
					'callback': () => { defaultContextMenu('CtrlC', target); },
					'submenus': []
				});
			}

			// Se siamo su Chromium
			if (!(isLocked) && navigator.userAgent.search('Chrome')) {
				// Incolla
				group.push({
					'icon': '<i class="fa-solid fa-paste"></i>',
					'title': 'Incolla',
					'isEnabled': true,
					'callback': () => { defaultContextMenu('CtrlV', target); },
					'submenus': []
				});
			}

		//	console.log('group: '+group.length);
		//  console.log('structure: '+structure.length);

			if (group.length > 0) {
				structure.unshift(group);
				bOk = true;
			}
			if (structure.length > 0){
				bOk = true;
			}
		}
	}

	if (bOk){
		if (structure) {
			const contextMenu = new ContextMenu(init);
			contextMenu.creaDaTracciato(structure)
			setPosition(contextMenu.container, init?.position?.x, init?.position?.y, 5, 5, 12, 12);
		}
	}
}

function removeContextMenu() {
	let contextMenu = document.getElementById('context-menu');
	if (contextMenu) {
		contextMenu.remove()
	}
}

window.addEventListener("click", function (event) {
	let contextMenu = document.getElementById('context-menu');
	if (contextMenu && event.target != contextMenu && !(contextMenu.contains(event.target))) {
		removeContextMenu()
	}
});
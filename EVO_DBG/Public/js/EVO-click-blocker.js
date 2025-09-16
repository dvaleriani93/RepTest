function clickBlocker(element, tDelay1 = 500, tDelay2 = 350, tCheck = 0) {
	if (element) {
		element.addEventListener('click', event => {
			setTimeout(() => {
				element.style.pointerEvents = 'none';
				/*console.log('stai buono cit.Gianluca')*/
				setTimeout(() => {
					function check() {
						let loader = document.getElementById('header-ajax-indicator')
						if (loader && loader.style.visibility == 'hidden') {
							element.style.pointerEvents = 'auto';
							/*console.log('Puoi cliccare')*/
							clearInterval(timer);
						} else {
							/*console.log('aspetta ancora un po\'')*/
						}
					}
					let timer = setInterval(check, tCheck);
				}, tDelay2)
			}, tDelay1)
		})
	}
}

//Blocco lo spam sulle videate MDI
clickBlocker(document.querySelector('#forms-container'), 300, 50)

//Blocco lo spam sulla Navbar
clickBlocker(document.querySelector('#mainmenu'), 0, 0)

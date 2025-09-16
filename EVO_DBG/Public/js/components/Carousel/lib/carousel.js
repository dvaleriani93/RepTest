if (typeof window.Carousel === 'undefined') {
    window.Carousel = class {
        constructor(container, opt = {}) {
            if (container) {
                let cont = document.createElement('div');
                cont.classList.add('CMPInterfacciaCorrieri_carousel');

                container.appendChild(cont);
                this.container = cont;

                this.opt = opt ? opt : {};
            }
        }

        add(obj) {
            if (obj) {
                let card = document.createElement('span');
                card.classList.add('CMPInterfacciaCorrieri_carousel_card');

                let logo = document.createElement('span');
                logo.classList.add('CMPInterfacciaCorrieri_carousel_card_logo');

                let img = document.createElement('img');
                img.src = obj.image;

                logo.appendChild(img);
                card.appendChild(logo);

                let title = document.createElement('span');
                title.classList.add('CMPInterfacciaCorrieri_carousel_card_title');
                title.innerHTML = obj.title;
                card.appendChild(title);

                this.container.appendChild(card);

                if (typeof (this.opt.onCardSelection) == 'function') {
                    let onCardSelection = this.opt.onCardSelection;
                    card.addEventListener('click', (e) => {
                        onCardSelection(obj.id);

                        console.log(card)
                        console.log(card.classList)
                        console.log(card.classList.contains('CMPInterfacciaCorrieri_carousel_card__selected'))

                        this.cards.forEach(card => {
                            if (!(card.classList.contains('CMPInterfacciaCorrieri_carousel_card__selected')) && card.classList.contains('CMPInterfacciaCorrieri_carousel_card__active')) {
                                card.classList.add('CMPInterfacciaCorrieri_carousel_card__selected');
                            } else {
                                card.classList.remove('CMPInterfacciaCorrieri_carousel_card__selected');
                            }
                        })
                    });

                    card.addEventListener('mouseenter', (e) => {
                        e.target.classList.add('CMPInterfacciaCorrieri_carousel_card__active');
                    });

                    card.addEventListener('mouseleave', (e) => {
                        e.target.classList.remove('CMPInterfacciaCorrieri_carousel_card__active');
                    });

                }


                if (!this.cards) {
                    this.cards = [];
                }

                this.cards.push(card);
            }
        }

        clear() {
            if (this.cards) {
                this.cards.forEach(card => {
                    console.log(card)
                    card.remove();
                })

                this.cards = [];
            }
        }
    }

}

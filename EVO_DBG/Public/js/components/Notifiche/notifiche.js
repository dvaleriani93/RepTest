/*


[
   {
      "icon"
      "title"
      "tooltip" => def. titolo
      "description"
      "state" true = letto ; false = non letto
      "NomeDLL"
      "Parametri"
   }
]

*/
function caricaNotifiche(container, list) {
   if (container && list) {
      container.innerText = '';
      if (list.length === 0) {
         container.appendChild(new DOMParser().parseFromString('<div class="EVO-GestioneNotifiche"><span>Non ci sono notifiche</span></div>', 'text/html').body.firstChild);
      } else {
         const main = document.createElement('ul');
         main.classList.add('EVO-GestioneNotifiche');

         list.forEach(element => {
            const template = `<li class="${element.state ? 'EVO-GestioneNotifiche-NonLetto' : ''}">
               <section class="EVO-GestioneNotifiche-Icona">
                    <span onMouseOver="makeTooltip(this);" alt="${element?.applicazione ? element.applicazione : 'Nuova notifica'}">
                        ${element.state ? '<i class="fas fa-bell"></i>' : '<i class="fa-regular fa-bell"></i>'}
                    </span>
                </section>
               <section class="EVO-GestioneNotifiche-Caption">
                  ${element?.applicazione && element?.data ? '<span>' + element?.applicazione + ' - ' + element?.data + '</span>' : ''}
                  <span onMouseOver="makeTooltip(this);" alt="${element?.tooltip ? element.tooltip : element.title}">${element.title}</span>
                  <span>${element?.description}</span>
               </section>
                <section class="EVO-GestioneNotifiche-Leggi">
                  <span onMouseOver="makeTooltip(this);" alt="Apri notifica">
                    <i class="fas fa-angle-right"></i>
                    </span>
                </section>
            </li>`;

            const notification = new DOMParser().parseFromString(template, 'text/html').body.firstChild;
            main.appendChild(notification);

            // Chiamata per l'apertura della videata
            notification.addEventListener('click', () => {
               RD3_SendCommand('Topbar', `command=Notifiche&action=ApriNotifica&id=${element.id}`);
            });

            const bell = notification.querySelector('.EVO-GestioneNotifiche-Icona span');
            bell.addEventListener('click', (event) => {
               event.stopPropagation();

               // Toggle della classe CSS
               notification.classList.toggle('EVO-GestioneNotifiche-NonLetto');

               const isUnread = notification.classList.contains('EVO-GestioneNotifiche-NonLetto')

               bell.innerText = '';
               bell.appendChild(new DOMParser().parseFromString(isUnread ? '<i class="fas fa-bell"></i>' : '<i class="fa-regular fa-bell"></i>', 'text/html').body.firstChild);

               // Invio i dati al server
               RD3_SendCommand('Topbar', `command=Notifiche&action=LeggiNotifica&id=${element.id}&state=${!isUnread}`);
            });
         });
         container.appendChild(main);
      }
   }
}

// Carica le notifiche e le mostra a video (ongi 10s)
let timerNotifiche = setInterval(() => {
   RD3_SendCommand('Topbar', 'command=Notifiche&action=ContaNotifiche')
}, 30000)
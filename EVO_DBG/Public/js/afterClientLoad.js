// ****************************************************************************************************
// Le funzioni presenti in questo file vengono eseguite solamente una volta: al caricamento della pagina
// ****************************************************************************************************



// ****************************************************************************************************
// Dichiarare le funzioni eseguite nell'afterClientLoad
// ****************************************************************************************************
const clock = () => {
   const liveClock = document.getElementById('liveclock')
   if (!liveClock) {
      return;
   } else {
      const months = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

      function updateClock() {
         const date = new Date();
		 var Hour = date.getHours();
		 var Minute = date.getMinutes();
		 var Seconds = date.getSeconds();
		 
		 if(Hour.toString().length == 1) {
			 Hour = '0'+Hour;
		 }
		 
		 if(Minute.toString().length == 1) {
			 Minute = '0'+Minute;
		 }
		 
        if(Seconds.toString().length == 1) {
             Seconds = '0'+Seconds;
        } 
		 
         liveClock.innerHTML = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} ${Hour}:${Minute}:${Seconds}`;
      }

      setInterval(updateClock, 1000);
   }
}

// ****************************************************************************************************
// Dichiarare le funzioni eseguite nell'afterClientLoad
// ****************************************************************************************************
const afterClientLoad = () => {
   clock();

   // Informo Inde che l'inizializzazione lato client è stata conclusa
   RD3_SendCommand('ClientEvents', 'event=afterClientLoad');
}

afterClientLoad();


// ****************************************************************************************************
// After Server Load (risposta del server alla chiamata JS)
// ****************************************************************************************************
const afterServerLoad = () => {
   loadMenuAccordion();

   loader.destroy();
}
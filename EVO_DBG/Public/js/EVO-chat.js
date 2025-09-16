// =============================================================================
// NotificheDesktop v. 1.0
// Per riferimento chiedere a Marco
// =============================================================================

function MostraNotificaChat(sNome, sMessaggio, sFoto, sCMDNotifica) {

    if (Notification.permission === "granted") {

        const notification = new Notification(sNome, {
            body: sMessaggio,
            icon: sFoto
        });

        notification.onclick = (e) => {
	   
            RD3_SendCommand(sCMDNotifica);

        };

    } else if (Notification.permission !== "denied") {

        Notification.requestPermission().then(permission => {

            if (permission === "granted") {

                const notification = new Notification(sNome, {
                    body: sMessaggio,
                    icon: sFoto
                });

                notification.onclick = (e) => {
		   
                    RD3_SendCommand(sCMDNotifica);
		  
                };
            };
        });
    }
};



//Controlla se la scrollbar dei messaggi è tutta su.

/* document.getElementById("fld:0:13:3:fc").addEventListener("scroll", function (e) {
	if (document.getElementById("fld:0:13:3:fc").scrollTop == 0){
		RD3_SendCommand("AggiungiMessaggi");
        console.log('Scrollato');
	}})
*/

function AggiungiMessaggi(){

if (document.getElementById("fld:0:13:3:fc").scrollTop == 0) {

    RD3_SendCommand("AggiungiMessaggi");

    console.log('Scrollato');
  }

}

var ScrollbarChat = document.getElementById("fld:0:13:3:fc")

if(ScrollbarChat){
	ScrollbarChat.addEventListener("scroll", AggiungiMessaggi())
}


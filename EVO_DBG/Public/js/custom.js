
// *********************************************************
// Setter della Caption del Web Entry Point
// *********************************************************
WebEntryPoint.prototype.SetMainCaption = function (value) {
    /*if (value !== undefined)
    {
        var myContent = value.replace("titoloSchedaBrowser", "myTitoloSchedaBrowser");
        var myCaption = "<div style='display:none;'>" + myContent + "</div>" ;
        document.body.insertAdjacentHTML('beforeend',myCaption);
        var myCaptionElm = document.getElementById('myTitoloSchedaBrowser');
        if(myCaptionElm != 'undefined' && myCaptionElm != null)        {
            window.myTitle=myCaptionElm.innerText;
            myCaptionElm.parentElement.remove();
        }
    }*/

    if (value != undefined)
        this.MainCaption = value;
    //
    // Se la videata e' gia' stata realizzata, aggiusto le proprieta' visuali
    if (this.Realized && this.MainCaptionBox) {
        this.MainCaptionBox.innerHTML = this.MainCaption;
        if (window.myTitle) {
            document.title = window.myTitle;
        } else {
            //DEFAULT INDE
            document.title = this.MainCaptionBox.innerText;
        }
        //
        // E' cambiata la caption... devo ricalcolare la dimensione del DIVIDERBOX
        if (this.DividerBox)
            this.DividerBox.style.paddingRight = "0px";
        //
        if (!RD3_Glb.IsMobile())
            RD3_Glb.AdaptToParent(this.HeaderBox, 0, -1);
        //
        // Effettuo il resize dell'header
        this.AdaptHeader();
    }
}

/*
=======================================================================================
04/10/2018 Loris Code, ma in realtà è loro, comunque sia, va a togliere il terzo stato
dalle checkbox.
*/

PField.prototype.OnThreeStateCheck = function (evento) {
    return;
}

ValueList.prototype.SetCheck = function (obj, value, inqbe) {
    // Guardo il primo valore della lista
    var fl = (value == this.ItemList[0].Value);
    if (RD3_Glb.IsMobile()) {
        if (RD3_Glb.IsQuadro()) {
            var io = obj.firstChild;
            RD3_Glb.SetTransform(io, "translate3d(" + (fl ? 0 : -53) + "px, 0px, 0px)");
        } else if (RD3_Glb.IsMobile7()) {
            var io = obj.firstChild;
            RD3_Glb.SetTransform(io, "translate3d(" + (fl ? 22 : 0) + "px, 0px, 0px)");
            obj.style.backgroundColor = fl ? "" : "transparent";
            obj.style.borderColor = fl ? "#4cd864" : "";
        } else
            obj.style.backgroundPosition = (fl ? "0%" : "100%") + " -27px";
    }

    obj.checked = fl;
    obj.indeterminate = false;
    obj.setAttribute("checkstatus", fl ? "0" : "2");
}
/*
=======================================================================================
*/

function RBOKeepAlive(delay) {
    // Timer per controllare le sessioni utenti attive, viene fatto partire dal CORE nell' evento OnComman("ClientEvents")
    RD3_SendCommand('RBOKeepAlive');
    const keepAlive = setInterval(() => { RD3_SendCommand('RBOKeepAlive'); /*console.log('keepAlive Sent', delay);*/}, delay)
    console.log('keepAlive Timer Start');
}

function tooltip_on(obj) {
    var title = $(obj).attr('alt');
    title = $.trim(title);

    if (title != "" && title !== undefined) {
        var tooltip = $('<span class="tooltip_jq"/>');
        tooltip.html(title);
        tooltip.appendTo('body');
        $(this).mouseover(function (e) {
            var top = e.pageY;
            var left = e.pageX;
            tooltip.css({
                display: 'block',
                top: top + 5,
                left: left + 5
            });
        });
        $(this).mouseout(function () {
            tooltip.remove();
        });
    }
}

function listuser() {
    var el = document.getElementById('dropdown-content');
    if (el.style.display === "none") {
        el.style.display = "block";
    } else {
        el.style.display = "none";
    }
}

function closeMenu() {
    $.each($("#mainmenu").find('a'), function () {
        if ($("a").hasClass("openItem")) {
            $("a").removeClass("openItem");
            $.each($("#mainmenu a ul li a"), function () {
                $(this).removeClass("openItem");
            });
        }
    });
    $(".submenu").css("display", "none");
}

function changemenu() {
    if ($("#mainmenu").hasClass("my-menu")) {
        $("#mainmenu").removeClass("my-menu");
        $("#mainmenu").addClass("vertical");
        closeMenu();
    } else {
        $("#mainmenu").addClass("my-menu");
        $("#mainmenu").removeClass("vertical");
    }
    if ($("#mainmenulist").hasClass("my-nav")) {
        $("#mainmenulist").removeClass("my-nav");
        $("#mainmenulist").removeClass("mg-accordion");
        $("#mainmenulist").removeClass("mg-flat");
    } else {
        $("#mainmenulist").addClass("my-nav");
        $("#mainmenulist").addClass("mg-accordion");
        $("#mainmenulist").addClass("mg-flat");
    }
    if ($("li").hasClass("dropdown")) {
        $("li").addClass("no_dropdown");
        $("li").removeClass("dropdown");
    } else {
        $("li").removeClass("no_dropdown");
        $("li").addClass("dropdown");
    }
}



function setDimDockLeft(collapsed) {
    if (collapsed == "Y") {
        //console.log(collapsed);
    }
    var w = window.innerWidth;
    var h = window.innerHeight;
    var lh = h - 70;
    $("#left-dock-container").css({ "top": "70px", "height": lh });
    $("#top-dock-container").css({ "width": w, "left": "238px" });
}

//Funzione derivata da Changeback(...)
//Rif Alex 
function genericChangeback(sParam) {
    if (sParam) {
        try {
            let objValues = JSON.parse(sParam);
            Object.keys(objValues).forEach(function (key) {
                document.documentElement.style.setProperty(key, objValues[key]);
                //console.log('sono dentro');
            });
        } catch {
            //console.log('ERRORE: La funzione richiede una stringa con formattazione JSON');
        }
    }
}

function setCaptionMessageConfirmEx(content) {
    var cols = document.getElementsByClassName('popup-frame-caption')[0];
    cols.setAttribute('Titolo-MessageConfirmEx', content);
}

//TOOLTIP GENERICO
function makeTooltip(element) {
    let tooltip = document.createElement('span');

    try {
        tooltip.innerHTML = decodeURI(element.getAttribute('alt'));
    } catch {
        tooltip.innerHTML = element.getAttribute('alt');
    }

    //Attributi vari
    tooltip.setAttribute('id', 'tooltip')
    tooltip.setAttribute('class', 'tooltip_jq_InfoInsMod')


    document.getElementsByTagName("body")[0].appendChild(tooltip);

    element.addEventListener('mousemove', function () {
        let tooltip = document.getElementById('tooltip');

        tooltip.style.position = "absolute";

        setPosition(tooltip, event.clientX, event.clientY);

    });

    element.addEventListener('mouseout', function () {
        if (document.getElementById('tooltip')) { document.getElementById('tooltip').remove(); }

    });
}

function setPosition(element, iPositionX, iPositionY, iDistanceX = 20, iDistanceY = 20, iMarginX = 0, iMarginY = 0) {
    //Conversione dei dati in input
    iPositionX = parseInt(iPositionX, 10);
    iPositionY = parseInt(iPositionY, 10);

    // Left
    element.style.left = ((element.clientWidth + iPositionX + iDistanceX) <= window.innerWidth - iMarginX ? (iPositionX + iDistanceX) : (iPositionX - iDistanceX - element.clientWidth)) + 'px';

    // Top
    element.style.top = ((element.clientHeight + iPositionY + iDistanceY) <= window.innerHeight - iMarginY ? (iPositionY + iDistanceY) : (iPositionY - iDistanceY - element.clientHeight)) + 'px';

    /*
        //Setto la posizione X
        if ((element.clientWidth + iPositionX + iDistanceX) > window.innerWidth) {
            element.style.left = (iPositionX - element.clientWidth - iDistanceX) + 'px';
        } else {
            element.style.left = (iPositionX + iDistanceX) + 'px';
        }
    
        //Setto la posizione Y
        if ((element.clientHeight + iPositionY + iDistanceY) > window.innerHeight) {
            element.style.top = (iPositionY - element.clientHeight - iDistanceY) + 'px';
        } else {
            element.style.top = (iPositionY + iDistanceY) + 'px';
        }
    */
}

function transbox() {
    try {
        $(document).ready(function () {
            var allBoxes = $("div.boxes").children("div");
            transitionBox(null, allBoxes.first());
        });
    } catch (e) {

    }
}

function transitionBox(from, to) {
    function next() {
        var nextTo;
        if (to.is(":last-child")) {
            nextTo = to.closest(".boxes").children("div").first();
        } else {
            nextTo = to.next();
        }
        to.fadeIn(500, function () {
            setTimeout(function () {
                transitionBox(to, nextTo);
            }, 1000);
        });
    }

    if (from) {
        from.fadeOut(500, next);
    } else {
        next();
    }
}

function navbarsel(index) {
    $('div.navbuttons').each(function () {
        var idx = $(this).attr('index');
        //alert(idx);
        if (idx == index) {
            $(this).addClass('EVO-navbar-page-active');
        }
        else {
            $(this).removeClass('EVO-navbar-page-active');
        }
    });
}

// ******************************************
// Funzione per copiare stringhe negli appunti
// Danelutti 02/03/2021
// ******************************************

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

// ******************************************



// ******************************************
// 2022/08/23 - Alex
// Funzione per la rimozione dei popup quando si clicca fuori dal form stesso
// ******************************************

function addPopUpForm(className) {
    const form = document.getElementsByClassName(className)[0];
    if (form) {
        const handler = (event) => {
            if (form.contains(event.target)) {
                // Riattivo l'evento
                addPopUpForm(className);
            } else {
                // Rimuovo l'evento
                window.removeEventListener('click', (event) => { handler(event); });

                // Chiudo il form
                RD3_SendCommand('CloseForm', `ID=${className.replace('POPUP-', '')}`);
            }
        };

        // Attivo l'evento sull'oggetto windows
        window.addEventListener('click', (event) => { handler(event); }, { once: true });
    }
}

function RigeneraCSSLogin(){
               
                document.getElementById('header-container').style.display='none'; 
                document.getElementById('forms-container').style.top='0px'; 
                document.getElementById('forms-container').style.height = '100%'; 
                document.getElementById('forms-container').style.width = '100%'; 
                document.getElementById('top-dock-container').style.height = '0%'; 
                
                var coll1 = document.getElementsByClassName('pwd-recovery-container'); 
                coll1[0].style.height = '100%'; 
                coll1[0].style.width = '100%'; 
                
                coll1 = document.getElementsByClassName('form-frames-container'); 
                coll1[0].style.height = '100%'; 
                coll1[0].style.width = '100%';
               
}

async function getClipboardText() {
    try {
        const text = await navigator.clipboard.readText();
        return text;
    } catch (err) {
        console.error('Errore nel leggere il testo degli appunti: ', err);
    }
  }
  
async function TopbarMenuCMD() {
    const clipboardText = await getClipboardText();
    RD3_SendCommand('TOPBARCMD', `${clipboardText}`);
}
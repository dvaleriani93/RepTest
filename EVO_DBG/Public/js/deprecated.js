// ****************************************************************************************************
// Indicare di seguito tutte le funzione deprecate o in fase di dismissione
// ****************************************************************************************************


// 30/06/2022 - Alex: Funzione sostituida dalla genericChangeback()
function changeback(backbody, backheader, backcontainer, color, colorsubmenu, buttonbackground, buttonbackgroundhover, buttoncolor, buttoncolorhover, borderfield, labelfield, statusbackground, statuscolor, selectedbackground, shadowcolor, linkcolor, linkcolorhover, logoff) {
   //alert(backbody + backheader + backcontainer + color);
   document.documentElement.style.setProperty('--back-body', backbody);
   document.documentElement.style.setProperty('--back-header', backheader);
   document.documentElement.style.setProperty('--back-container', backcontainer);
   document.documentElement.style.setProperty('--color', color);
   document.documentElement.style.setProperty('--color-submenu', colorsubmenu);
   document.documentElement.style.setProperty('--button-background', buttonbackground);
   document.documentElement.style.setProperty('--button-background-hover', buttonbackgroundhover);
   document.documentElement.style.setProperty('--button-color', buttoncolor);
   document.documentElement.style.setProperty('--button-color-hover', buttoncolorhover);
   document.documentElement.style.setProperty('--border-field', borderfield);
   document.documentElement.style.setProperty('--label-field', labelfield);
   document.documentElement.style.setProperty('--status-background', statusbackground);
   document.documentElement.style.setProperty('--status-color', statuscolor);
   document.documentElement.style.setProperty('--selected-background', selectedbackground);
   document.documentElement.style.setProperty('--shadow-color', shadowcolor);
   document.documentElement.style.setProperty('--link-color', linkcolor);
   document.documentElement.style.setProperty('--link-color-hover', linkcolorhover);
   document.documentElement.style.setProperty('--logoff', logoff);
}
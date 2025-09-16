/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var glbDecSep = ",";
var glbThoSep = ".";
var glbPrompt = "_";
var glbMask = "";
var glbMaskType = "";
var glbObjInput;
var glbInitValue;
var glbVirtualPos = -1;


function getCursorPos(objInput)
{
  if (glbVirtualPos > -1)
    return glbVirtualPos;
  //
  if (typeof (objInput.selectionStart) != "undefined")
    return objInput.selectionStart;
  else
  {
    try
    {
      var t1 = document.selection.createRange();
      var t2 = objInput.createTextRange();
      var i1 = 0;
      while (t2.compareEndPoints("StartToStart", t1))
      {
        i1++;
        t2.moveStart("character");
      }
      return i1;
    }
    catch (ex)
    {
      // In IE non si riesce a sapere la posizione del cursore nelle TEXTAREA
      return -1;
    }
  }
}

function setCursorPos(objInput, newpos)
{
  if (glbVirtualPos > -1)
  {
    if (newpos < 0)
      newpos = 0;
    glbVirtualPos = newpos;
    return;
  }
  //
  try
  {
    if (typeof (objInput.selectionStart) != "undefined")
    {
      objInput.select();
      objInput.selectionStart = newpos;
      objInput.selectionEnd = newpos;
    }
    else
    {
      var t = objInput.createTextRange();
      t.move("character", newpos);
      t.select();
    }
  }
  catch (ex) {
  }
}

function setToken(ris, mask, token, value)
{
  var s = value.toString();
  while (s.length < token.length)
    s = "0" + s;
  s = s.substring(0, token.length);
  var i = mask.indexOf(token);
  if (i > -1)
  {
    ris = ris.substr(0, i) + s + ris.substr(i + token.length);
  }
  return ris;
}

function getToken(ris, mask, token)
{
  var i = mask.indexOf(token);
  var s;
  if (i == -1)
    return i;
  else
  {
    s = ris.substr(i, token.length);
    //
    // Remove leading zero AND clear the 00 value
    // NOT for hours and minutes and seconds, they admit the 00 value
    if (token !== "hh" && token !== "nn" && token !== "ss") {
      while (s.length > 0 && s.charAt(0) == "0")
        s = s.substr(1);
    }
    //
    return parseInt(s);
  }
}

function unmask(s)
{
  var r, i, c;
  i = 0;
  r = "";
  while (i < s.length)
  {
    c = s.charAt(i);
    if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '-' || c == glbDecSep)
    {
      r += c;
    }
    i++;
  }
  return r;
}

function formatNumber(s, mask)
{
  var rdec, rint, segno;
  var decm, decv;
  //
  // Calcolo segno
  segno = "";
  if (s.length > 0 && s.charAt(0) == "-")
  {
    segno = "-";
    s = s.substr(1);
  }
  //
  // Estraggo 0 iniziali
  // Posso arrivare fino primo numero dopo la virgola
  var limite = s.length - 1;
  decm = s.indexOf(glbDecSep);
  if (decm > -1)
    limite = decm - 1;
  //
  decm = 0;
  while (decm < limite && s.charAt(decm) == "0")
    decm++;
  if (decm > 0)
    s = s.substr(decm);
  //
  // Applico maschera decimale
  decm = mask.indexOf(glbDecSep);
  decv = s.indexOf(glbDecSep);
  rdec = "";
  rint = "";
  //
  while (decm > -1 && decm < mask.length)
  {
    var c = mask.charAt(decm);
    if (c == "0" || c == "#")
    {
      if (decv > -1 && decv < s.length - 1)
        rdec += s.charAt(++decv);
      else if (c == "0")
        rdec += c;
      else
        break; // Non seguo pi� la maschera!
    }
    else
    {
      rdec += c;
    }
    decm++;
  }
  //
  // Applico maschera intera
  decm = mask.indexOf(glbDecSep);
  decv = s.indexOf(glbDecSep);
  if (decm == -1)
    decm = mask.length;
  decm--;
  if (decv == -1)
    decv = s.length;
  decv--;
  //
  while (decm >= 0)
  {
    c = mask.charAt(decm);
    if (c == "0" || c == "#")
    {
      if (decv >= 0)
        rint = s.charAt(decv--) + rint;
      else if (c == "0")
        rint = c + rint;
      else
        break; // Maschera finita
    }
    else
    {
      rint = c + rint;
    }
    decm--;
  }
  //
  // Aggiustamenti finali
  //
  if (rint.length > 0 && rint.charAt(0) == glbThoSep)
    rint = rint.substr(1);
  //
  // Se l'ultimo carattere � una "virgola" allora devo toglierlo
  if (rdec.length == 1)
    rdec = "";
  //
  return segno + rint + rdec;
}

function isMaskToken(c, masktype)
{
  switch (masktype)
  {
    case 'D':
      if (c == 'g' || c == 'm' || c == 'a' || c == 'y' || c == 'd' || c == 'h' || c == 'n' || c == 's')
        return true;
      break;

    case 'A':
      if (c == 'a' || c == 'A' || c == '#' || c == '&' || c == '%')
        return true;
      break;

    case 'N':
      if (c == '#' || c == '0')
        return true;
      break;
  }
  return false;
}

function skipMaskChars(mask, attpos, masktype)
{
  var c;
  if (masktype != "N")
  {
    while (attpos < mask.length)
    {
      c = mask.charAt(attpos);
      if (isMaskToken(c, masktype))
        return attpos;
      attpos++;
    }
  }
  return attpos;
}

function isNumber(ch)
{
  return (ch >= 48 && ch <= 57);
}

function isAlfa(ch)
{
  return (ch >= 65 && ch <= 90);
}

function checkValue(ris, attpos, mask, masktype)
{
  var c, i1, i2, vt, ok;

  c = mask.charAt(attpos);
  i1 = attpos;
  i2 = attpos;
  while (i1 >= 0)
  {
    if (mask.charAt(i1) != c)
    {
      i1++;
      break;
    }
    i1--;
  }
  while (i2 < mask.length)
  {
    if (mask.charAt(i2) != c)
    {
      i2--;
      break;
    }
    i2++;
  }
  vt = parseInt(ris.substring(i1, i2 + 1));
  ok = true;
  switch (masktype)
  {
    case 'D':
      if (c == 'g' || c == 'd')
      {
        if (vt > 31)
        {
          vt = 31;
          ok = false;
        }
      }
      if (c == 'm')
      {
        if (vt > 12)
        {
          vt = 12;
          ok = false;
        }
      }
      if (c == 'h')
      {
        if (vt > 23)
        {
          vt = 23;
          ok = false;
        }
      }
      if (c == 'n' || c == 's')
      {
        if (vt > 59)
        {
          vt = 59;
          ok = false;
        }
      }
      break;
  }
  if (!ok)
  {
    ris = ris.substr(0, i1) + vt.toString() + ris.substr(i2 + 1);
  }
  return ris;
}

function nextDay(ris, mask, offset)
{
  var Oggi = new Date();
  var i;
  //
  i = getToken(ris, mask, "yyyy");
  if (i > 0)
  {
    Oggi.setFullYear(i);
  }
  else
  {
    i = getToken(ris, mask, "yy");
    if (i > 0)
    {
      Oggi.setFullYear(i) % 100;
    }
  }
  i = getToken(ris, mask, "aaaa");
  if (i > 0)
  {
    Oggi.setFullYear(i);
  }
  else
  {
    i = getToken(ris, mask, "aa");
    if (i > 0)
    {
      Oggi.setFullYear(i) % 100;
    }
  }
  i = getToken(ris, mask, "mm");
  if (i > 0)
  {
    Oggi.setMonth(i - 1);
  }
  i = getToken(ris, mask, "dd");
  if (i > 0)
  {
    Oggi.setDate(i + offset);
  }
  i = getToken(ris, mask, "gg");
  if (i > 0)
  {
    Oggi.setDate(i + offset);
  }
  //
  i = getToken(ris, mask, "hh");
  if (i >= 0)
    Oggi.setHours(i);
  i = getToken(ris, mask, "nn");
  if (i >= 0)
    Oggi.setMinutes(i);
  i = getToken(ris, mask, "ss");
  if (i >= 0)
    Oggi.setSeconds(i);
  //
  ris = setToken(ris, mask, "yyyy", Oggi.getFullYear());
  if (getToken(ris, mask, "yyyy") == 0)
    ris = setToken(ris, mask, "yy", Oggi.getFullYear() % 100);
  ris = setToken(ris, mask, "aaaa", Oggi.getFullYear());
  if (getToken(ris, mask, "aaaa") == 0)
    ris = setToken(ris, mask, "aa", Oggi.getFullYear() % 100);
  ris = setToken(ris, mask, "mm", Oggi.getMonth() + 1);
  ris = setToken(ris, mask, "dd", Oggi.getDate());
  ris = setToken(ris, mask, "gg", Oggi.getDate());
  ris = setToken(ris, mask, "hh", Oggi.getHours());
  ris = setToken(ris, mask, "nn", Oggi.getMinutes());
  ris = setToken(ris, mask, "ss", Oggi.getSeconds());
  //
  return ris;
}

function insertChar(objInput, ch, mask, masktype)
{
  var ris, attpos, c, ok, l1, l2, dec, t1;
  //
  // Gli input type number non possono essere mascherati, non prendono bene i separatori
  if (objInput && objInput.tagName == "INPUT" && objInput.type == "number")
    return;
  //
  if (isNumber(ch) || isAlfa(ch))
  {
    if (typeof (objInput.selectionStart) != "undefined")
    {
      if (objInput.selectionStart != objInput.selectionEnd)
        deleteChars(0);
    }
    else
    {
      t1 = document.selection.createRange();
      if (t1.text.length > 0)
        deleteChars(0);
    }
  }
  //
  ris = objInput.value;
  attpos = getCursorPos(objInput);
  //
  attpos = skipMaskChars(mask, attpos, masktype);
  ok = false;
  //
  // Se sono un numero, il carattere digitato non e' il separatore di decimali, il testo non contiene
  // il separatore decimale ma la maschera si' allora la lunghezza massima ammessa e' solo la "parte intera"
  var maskLen = mask.length;
  if (masktype == 'N' && ch != 188 && ch != 190 && ris.indexOf(glbDecSep) == -1 && mask.indexOf(glbDecSep) != -1)
    maskLen = mask.substr(0, mask.indexOf(glbDecSep)).length;
  //
  // Se il campo e' pieno ma il primo carattere e' un '-' accetto comunque la pressione del tasto
  // Abilito + e - anche in un campo data completo
  if (attpos < maskLen || (masktype == 'N' && attpos == maskLen && ris.length > 0 && ris.charAt(0) == '-') || (masktype == 'D' && attpos == maskLen && ris.length > 0 && (ch == 187 || ch == 61 || ch == 189)))
  {
    c = mask.charAt(attpos);
    switch (masktype)
    {
      case 'D':
        if (isMaskToken(c, masktype) && isNumber(ch))
        {
          ris = ris.substr(0, attpos) + String.fromCharCode(ch) + ris.substr(attpos + 1);
          ris = checkValue(ris, attpos, mask, masktype);
          ok = true;
        }
        //
        if (ch == 187 || ch == 61) // + = today
          ris = nextDay(ris, mask, 1);
        if (ch == 189) // - = today
          ris = nextDay(ris, mask, -1);
        break;

      case 'A':
        if (c == '&')
        {
          if (isAlfa(ch) || isNumber(ch))
          {
            ris = ris.substr(0, attpos) + String.fromCharCode(ch).toUpperCase() + ris.substr(attpos + 1);
            ok = true;
          }
        }
        if (c == '%')
        {
          var ch = getCustomMaskChar(ch);
          if (ch != undefined)
          {
            ris = ris.substr(0, attpos) + ch + ris.substr(attpos + 1);
            ok = true;
          }
        }
        if (c == 'a')
        {
          if (isAlfa(ch))
          {
            ris = ris.substr(0, attpos) + String.fromCharCode(ch).toLowerCase() + ris.substr(attpos + 1);
            ok = true;
          }
        }
        if (c == 'A')
        {
          if (isAlfa(ch))
          {
            ris = ris.substr(0, attpos) + String.fromCharCode(ch).toUpperCase() + ris.substr(attpos + 1);
            ok = true;
          }
        }
        if (c == '#')
        {
          if (isNumber(ch))
          {
            ris = ris.substr(0, attpos) + String.fromCharCode(ch) + ris.substr(attpos + 1);
            ok = true;
          }
        }
        break;

      case 'N':
        if (isNumber(ch))
        {
          dec = ris.indexOf(glbDecSep);
          if (attpos > dec && dec != -1)
            ris = ris.substr(0, attpos) + String.fromCharCode(ch) + ris.substr(attpos + 1);    // Inserimento+sovrascrittura decimali
          else if (ris.length < maskLen || (ris.length == maskLen && ris.charAt(0) == '-'))
            ris = ris.substr(0, attpos) + String.fromCharCode(ch) + ris.substr(attpos);      // Inserimento normale fino a riempimento
          else if (ris.length == maskLen && dec !== attpos)
            ris = ris.substr(0, attpos) + String.fromCharCode(ch) + ris.substr(attpos + 1);    // Inserimento campo pieno
          //
          l1 = ris.length;
          ris = formatNumber(unmask(ris), mask);
          l2 = ris.length;
          attpos += l2 - l1 + 1;
          //
          // Se la maschera ha il separatore delle migliaia ed io sono sopra al separatore delle migliaia avanzo di un carattere
          // Se la maschera ha il separatore decimale ed io sono sopra al separatore decimale avanzo di un carattere (solo se il valore e' pieno)
          if (mask.indexOf(glbThoSep) != -1 && ris[attpos] == glbThoSep)
            attpos++;
          else if (mask.indexOf(glbDecSep) && ris[attpos] == glbDecSep && ris.length == mask.length)
            attpos++;
        }
        if (ch == 188 || ch == 190)
        {
          dec = ris.indexOf(glbDecSep);
          if (dec > -1)
            attpos = dec + 1;
          else
          {
            if (mask.indexOf(glbDecSep) > -1)
            {
              ris += glbDecSep;
              attpos = ris.length;
            }
          }
        }
        if (ch == 189)
        {
          if (ris.substr(0, 1) == "-")
          {
            attpos--;
            ris = ris.substr(1);
          }
          else
          {
            attpos++;
            ris = "-" + ris;
          }
        }
        break;
    }
  }
  //
  if (ok)
  {
    attpos++;
    attpos = skipMaskChars(mask, attpos, masktype);
  }
  objInput.value = ris;
  setCursorPos(objInput, attpos);
  return false;
}

function getCustomMaskChar(ch) {}   // Da ridefinire in custom3.js

function deleteChar(objInput, attpos, offs, mask, masktype)
{
  var ris, dc, l1, l2, dec, decm;

  ris = objInput.value;
  if (attpos >= 0 && attpos < ris.length)
  {
    dc = mask.substr(attpos, 1);
    switch (masktype)
    {
      case "A":
        if (isMaskToken(dc, masktype))
          dc = glbPrompt;
        break;

      case "N":
        var ch = ris.charAt(attpos);
        dec = ris.indexOf(glbDecSep);
        if (dec == -1)
          dec = ris.length;
        decm = mask.indexOf(glbDecSep);
        if (decm == -1)
          decm = mask.length;
        dc = mask.substr(decm + (attpos - dec), 1);
        if (attpos < dec || dec == -1)
        {
          offs = 0;
        }
        else
        {
          if (offs == -1 && dc == "#")
            offs = 1;
        }
        l1 = ris.length;
        if (isMaskToken(dc, masktype) || ch == "-")
          ris = unmask(ris.substr(0, attpos) + ris.substr(attpos + 1));
        else
          ris = unmask(ris);
        break;
    }
    if (masktype != "N")
      ris = ris.substr(0, attpos) + dc + ris.substr(attpos + 1);
    else
    {
      ris = formatNumber(ris, mask);
      l2 = ris.length;
      attpos += l2 - l1 + 1 + offs;
      if (attpos < 0)
        attpos = 0;
      if (attpos > l2)
        attpos = l2;
    }
  }
  objInput.value = ris;
  return attpos;
}

function deleteChars(offs)
{
  var ris, startpos, endpos, t1, i, moveto, nsd, attpos;

  startpos = getCursorPos(glbObjInput);
  //
  if (typeof (glbObjInput.selectionEnd) != "undefined")
  {
    endpos = glbObjInput.selectionEnd;
  }
  else
  {
    t1 = document.selection.createRange();
    endpos = startpos + t1.text.length;
  }
  if (glbVirtualPos >= 0)
    endpos = glbVirtualPos;
  //
  // Controllo presenza caratteri sep decimale nell'intervallo
  if (glbMaskType == "N")
  {
    nsd = 0;
    ris = glbObjInput.value;
    for (i = endpos - 1; i >= startpos; i--)
      if (ris.charAt(i) == glbThoSep)
        nsd++;
    startpos += nsd;
  }
  //
  if (endpos > startpos)
  {
    attpos = endpos - 1;
    for (i = endpos - 1; i >= startpos; i--)
    {
      if (glbMaskType == "N")
      {
        moveto = deleteChar(glbObjInput, attpos, -1, glbMask, glbMaskType);
        attpos = moveto - 1;
      }
      else
        moveto = deleteChar(glbObjInput, i, offs, glbMask, glbMaskType);
    }
  }
  else
  {
    startpos += offs;
    moveto = deleteChar(glbObjInput, startpos, offs, glbMask, glbMaskType);
  }
  setCursorPos(glbObjInput, moveto);
}

function hk(evento, forcekey)
{
  var ok, ch;
  var keyCode;
  var altKey;
  var ctrlKey;
  //
  // No handling needed for case mask
  if (glbMask === ">" || glbMask === "<")
    return true;
  //
  if (evento != null)
  {
    keyCode = window.event ? evento.keyCode : evento.which;
    altKey = evento.altKey;
    ctrlKey = evento.ctrlKey || evento.metaKey;
  }
  //
  ok = false;
  ch = keyCode;
  //
  if (forcekey != undefined)
  {
    ch = forcekey;
    altKey = false;
    ctrlKey = false;
  }
  else
  {
    glbVirtualPos = -1;
  }
  //
  // Su Firefox i tasti + e - hanno keyCode differenti
  /*
   if (RD3_Glb && RD3_Glb.IsFirefox())
   {
   if (ch == 173)
   ch = 109;
   if (ch == 171)
   ch = 107;
   }
   */
  //
  // Gestione tastierino num.
  if (ch >= 96 && ch <= 105)
    ch -= 48;
  if (ch >= 107 && ch <= 110)
    ch += 80;
  //
  // Gestione shift+7 (/)
  if (ch == 55 && evento?.shiftKey)
    ch = 111;
  //
  if (ch == 17 || ch == 18 || (altKey && !ctrlKey))
    return true; // Tasto CTRL/ALT, lascio premere - MA NON ALTGR
  //
  if (ctrlKey && ch >= 64 && ch <= 95)
  {
    var s = String.fromCharCode(ch);
    if (s == "C" || s == "X" || s == "V")
    {
      // in questo caso, seleziono TUTTO il campo...
      if (document.all)
        glbObjInput.createTextRange().select();
      else
      {
        glbObjInput.selectionStart = 0;
        glbObjInput.selectionEnd = glbObjInput.value.length;
      }
    }
    if (glbMaskType == "N" && s == "V") {
      window.setTimeout(function () {
        if (!glbObjInput)
          return;
        //
        // Per prima cosa eseguiamo il trim
        if (glbObjInput.value)
          glbObjInput.value = glbObjInput.value.trim();
        //
        // Verifichiamo se il valore e' un numero, se non lo e' svuotiamo il campo
        var v = glbObjInput.value;
        if (glbDecSep === ",") {
          // Il parseFloat non gestisce correttamente la numerazione "all'italiana", vuole il formato x,xxx.xx o xxxx.xx
          v = v.replace(/\./g, "");
          v = v.replace(",", ".");
        }
        try {
          if (!((v - parseFloat(v) + 1) >= 0))
            glbObjInput.value = "";
        }
        catch (ex) {
          glbObjInput.value = "";
        }
      }, 0);
    }
    //
    return true; // Ctrl-Lettera, lascio passare
  }
  //
  // Gli input type number non possono essere mascherati, non prendono bene i separatori
  if (glbObjInput && glbObjInput.tagName == "INPUT" && glbObjInput.type == "number")
    return true;
  //
  if (ch == 8)
    deleteChars(-1);
  else if (ch == 46)
    deleteChars(0);
  else if (ch >= 33 && ch <= 40)
    ok = true;
  else if (ch == 9 || ch == 13)
    ok = true;
  else
    insertChar(glbObjInput, ch, glbMask, glbMaskType);
  return ok;
}

function GetInitValue(mask, masktype)
{
  var dc, ris, i;

  ris = "";
  for (i = 0; i < mask.length; i++)
  {
    dc = mask.charAt(i);
    switch (masktype)
    {
      case "N":
        if (dc == glbDecSep || dc == "0")
          ris += dc;
        break;

      case "A":
        if (isMaskToken(dc, masktype))
          ris += glbPrompt;
        else
          ris += dc;
        break;

      case "D":
        ris += dc;
        break;
    }
  }
  //
  // Se l'ultimo carattere � una "virgola" allora devo toglierlo
  if (masktype == "N" && ris.length > 0 && ris.substr(ris.length - 1) == glbDecSep)
    ris = ris.substr(0, ris.length - 1);
  return ris;
}

function mc(mask, masktype, evento, srcele, usevirt)
{
  var dec, s;
  var srcElement = srcele;
  if (!srcElement)
    srcElement = evento.target;
  //
  glbObjInput = srcElement;
  glbMask = mask;
  glbMaskType = masktype;
  s = glbObjInput.value;
  glbInitValue = s;
  glbVirtualPos = usevirt ? 0 : -1;
  //
  // Gli input type number non possono essere mascherati, non prendono bene i separatori
  if (glbObjInput && glbObjInput.tagName == "INPUT" && glbObjInput.type == "number")
    return;
  //
  // No real masking needed for casing mask
  if (mask === ">" || mask === "<")
    return;
  //
  if (s == "")
  {
    s = GetInitValue(mask, masktype);
    glbObjInput.value = s;
    //
    if (masktype == "N")
    {
      dec = s.indexOf(glbDecSep);
      if (dec > -1)
      {
        setTimeout("setCursorPos(glbObjInput, " + dec + ");", 10);
        if (usevirt)
          glbVirtualPos = dec;
      }
      else
      {
        setTimeout("setCursorPos(glbObjInput, " + s.length + ");", 10);
        if (usevirt)
          glbVirtualPos = s.length;
      }
    }
    else
    {
      setTimeout("setCursorPos(glbObjInput,0);", 10);
      if (usevirt)
        glbVirtualPos = 0;
    }
  }
  else
  {
    // Se ho dovuto completare la maschera, risistemo il fuoco...
    if (masktype == "A" && mask.length > s.length) // Complete with mask...
    {
      s += GetInitValue(mask, masktype).substr(s.length);
      glbObjInput.value = s;
      setTimeout("setCursorPos(glbObjInput,0);", 10);
      if (usevirt)
        glbVirtualPos = 0;
    }
    else if (masktype == "N")
    {
      // Se il cursore � all'inizio della stringa lo porto avanti
      // fino al primo carattere diverso da '0'
      if (getCursorPos(glbObjInput) == 0)
      {
        if (usevirt)
        {
          dec = s.indexOf(glbDecSep);
          if (dec > -1)
            glbVirtualPos = dec;
          else
            glbVirtualPos = s.length;
        }
        else
        {
          var p = 0;
          while (p < s.length && s.substr(p, 1) == '0')
            p++;
          //
          if (p > 0)
            setTimeout("setCursorPos(glbObjInput," + p + ");", 10);
        }
      }
    }
  }
}

function umc(evento)
{
  if (!glbObjInput)
    return;
  //
  // Gli input type number non possono essere mascherati, non prendono bene i separatori
  if (glbObjInput && glbObjInput.tagName == "INPUT" && glbObjInput.type == "number")
    return;
  //
  // No unmasking needed for case mask
  if (glbMask === ">" || glbMask === "<")
    return;
  //
  // Se l'ultimo carattere � una "virgola" allora devo toglierlo
  try
  {
    if (glbMaskType == "N" && glbObjInput.value.length > 0 && glbObjInput.value.substr(glbObjInput.value.length - 1) == glbDecSep)
    {
      glbObjInput.value = glbObjInput.value.substr(0, glbObjInput.value.length - 1);
    }
  }
  catch (ex) {
  }
  //
  var s = GetInitValue(glbMask, glbMaskType);
  if (glbObjInput.value == s && glbMaskType != "A")
    glbObjInput.value = "";
  if (glbMaskType == "A")
  {
    s = glbObjInput.value;
    //
    // Partendo da DX, rimuovo tutti i prompt e tutti i caratteri uguali alla maschera
    for (var j = Math.min(s.length - 1, glbMask.length - 1); j >= 0; j--)
    {
      var ss = s.substr(j, 1);
      //
      // Se questo carattere concide con il prompt... lo salto... lo rimuovo alla fine
      if (ss == glbPrompt)
        continue;
      //
      // Il carattere non e' il prompt... verifico se coincide con il carattere della maschera
      var sm = glbMask.substr(j, 1);
      if (ss == sm)
      {
        // Bene... il carattere coincide con il corrispondente carattere della masck...
        // Lo sostituisco con il prompt solo se il carattere della mask chiedeva una lettera...
        // In quel caso c'e' gia' il prompt e non voglio sostituire inutilmente
        if (sm != 'A' && sm != 'a')
          s = s.substr(0, j) + glbPrompt + s.substr(j + 1);
      }
      else
      {
        // Il carattere non corrisponde a quello della maschera... se e' diverso anche dal prompt
        // ho finito
        if (ss != glbPrompt)
          break;
      }
    }
    //
    // Ora elimino tutti i prompt, partendo dal fondo
    for (var j = s.length - 1; j >= 0; j--)
      if (s.substr(j, 1) == glbPrompt)
        s = s.substring(0, j);
    //
    glbObjInput.value = s;
  }
  //
  // Se il campo e' una data ed c'e' ancora la maschera
  if (glbMaskType == "D" && glbObjInput.value.length > 0)
  {
    var now = new Date();
    //
    // Se e' stato specificato il giorno
    var filledDate = false;
    if (!isNaN(getToken(glbObjInput.value, glbMask, "dd")) || !isNaN(getToken(glbObjInput.value, glbMask, "mm")) || !isNaN(getToken(glbObjInput.value, glbMask, "yy")) || !isNaN(getToken(glbObjInput.value, glbMask, "yyyy")))
    {
      filledDate = true;
      //
      // Se il giorno non e' stato definito oppure se e' stato definito parzialmente (1d -> restituisce il valore 1 ma sul server viene rifiutato)
      var dd = getToken(glbObjInput.value, glbMask, "dd");
      if (isNaN(dd))
      {
        glbObjInput.value = setToken(glbObjInput.value, glbMask, "dd", now.getDate());
      }
      if (!isNaN(dd) && glbObjInput.value.indexOf("d") >= 0)
      {
        // Se ho un numero valido ma ho anche un token parziale mangio il d rimasto (non posso causare problemi, se ho scritto 9d o d9 ottengo sempre 09)
        glbObjInput.value = setToken(glbObjInput.value, glbMask, "dd", dd);
      }
      //
      var mm = getToken(glbObjInput.value, glbMask, "mm");
      if (isNaN(mm))
      {
        // Se non ho scritto il mese metto il mese corrente
        glbObjInput.value = setToken(glbObjInput.value, glbMask, "mm", now.getMonth() + 1);
      }
      if (!isNaN(mm) && glbObjInput.value.indexOf("m") >= 0)
      {
        // Se ho un numero valido ma ho anche un token parziale (0m) metto comunque il mese corrente
        glbObjInput.value = setToken(glbObjInput.value, glbMask, "mm", now.getMonth() + 1);
      }
      //
      // Se l'anno non � stato specificato gli metto l'anno corrente
      var yy = getToken(glbObjInput.value, glbMask, "yyyy");
      if (yy == -1)
      {
        yy = getToken(glbObjInput.value, glbMask, "yy");
        if (isNaN(yy) || glbObjInput.value.indexOf("y") >= 0)
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "yy", now.getFullYear().toString().substr(2, 2));
      }
      else
      {
        if (isNaN(yy) || glbObjInput.value.indexOf("y") >= 0)
        {
          // Se ho lasciato yyyy allora metto l'anno attuale, se ho completato tolo un pezzo dell'anno (20yy) allora porto il numero alla fine e completo il resto
          // con l'anno attuale (15yy -> 2015 5yyy -> 2025)
          if (isNaN(yy))
            glbObjInput.value = setToken(glbObjInput.value, glbMask, "yyyy", now.getFullYear().toString().substr(0, 4));
          else if (glbObjInput.value.indexOf("y") >= 0)
            glbObjInput.value = setToken(glbObjInput.value, glbMask, "yyyy", now.getFullYear().toString().substr(0, 4 - ("" + yy).length) + ("" + yy));
        }
      }
      //
      // Devo gestire il massimale sul giorno del mese, spostando eventualmente
      // indietro il giorno
      var m = moment({year: getToken(glbObjInput.value, glbMask, "yyyy"), month: getToken(glbObjInput.value, glbMask, "mm") - 1, date: 1});
      if (m.isValid()) {
        var ld = m.daysInMonth();
        if (getToken(glbObjInput.value, glbMask, "dd") > ld)
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "dd", ld);
      }
    }
    //
    // La maschera contiene una porzione ora, devo verificare se riempirla
    if (glbMask.indexOf("hh") != -1 || glbMask.indexOf("nn") != -1 || glbMask.indexOf("ss") != -1)
    {
      // Se � stata specificata una parte dell'orario, popolo il resto che manca
      // oppure se e' stata gia' riempita la porzione data devo comunque riempire la porzione ora
      var hh1 = getToken(glbObjInput.value, glbMask, "hh");
      var nn1 = getToken(glbObjInput.value, glbMask, "nn");
      var ss1 = getToken(glbObjInput.value, glbMask, "ss");
      if (!isNaN(hh1) || !isNaN(nn1) || !isNaN(ss1) || filledDate)
      {
        if (isNaN(hh1))
        {
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "hh", ("00" + now.getHours()).substr(-2));
          hh1 = getToken(glbObjInput.value, glbMask, "hh");
        }
        else
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "hh", ("" + hh1).replace(/h/g, "0"));
        //
        if (isNaN(nn1)) {
          var min = now.getHours() === hh1 ? now.getMinutes() : "00";
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "nn", min);
          nn1 = getToken(glbObjInput.value, glbMask, "nn");
        }
        else
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "nn", ("" + nn1).replace(/n/g, "0"));
        //
        if (isNaN(ss1))
        {
          var sec = now.getMinutes() === nn1 ? now.getSeconds() : "00";
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "ss", sec);
        }
        else
          glbObjInput.value = setToken(glbObjInput.value, glbMask, "ss", ("" + ss1).replace(/n/g, "0"));
      }
    }
  }
  //
  /*
   if (glbObjInput.value!=glbInitValue)
   {
   // Tento di mandare il messaggio al kbmanager, se non ci riesco provo
   // in modalit� RD2
   var kbex = true;
   try
   {
   if (evento)
   RD3_KBManager.IDRO_OnChange(evento);
   }
   catch(ex)
   {
   kbex = false;
   }
   //
   if (!kbex)
   {
   try
   {
   glbObjInput.onchange(evento);
   }
   catch(ex) { }
   }
   }
   //
   // Gestione focus globale
   try
   {
   BlurHandler();
   }
   catch(ex) { }
   */
}


function mask_unmask(value, mask, masktype) {
  if (mask === ">" || mask === "<")
    return value;
  //
  // Se l'ultimo carattere e' una "virgola" allora devo toglierlo
  try {
    if (masktype == "N" && value.length > 0 && value.substr(value.length - 1) == glbDecSep) {
      value = value.substr(0, value.length - 1);
    }
  }
  catch (ex) {
  }
  //
  var s = GetInitValue(mask, masktype);
  if (value == s && masktype != "A")
    value = "";
  if (masktype == "A") {
    s = value;
    //
    // Partendo da DX, rimuovo tutti i prompt e tutti i caratteri uguali alla maschera
    for (var j = Math.min(s.length - 1, mask.length - 1); j >= 0; j--) {
      var ss = s.substr(j, 1);
      //
      // Se questo carattere concide con il prompt... lo salto... lo rimuovo alla fine
      if (ss == glbPrompt)
        continue;
      //
      // Il carattere non e' il prompt... verifico se coincide con il carattere della maschera
      var sm = mask.substr(j, 1);
      if (ss == sm) {
        // Bene... il carattere coincide con il corrispondente carattere della masck...
        // Lo sostituisco con il prompt solo se il carattere della mask chiedeva una lettera...
        // In quel caso c'e' gia' il prompt e non voglio sostituire inutilmente
        if (sm != 'A' && sm != 'a')
          s = s.substr(0, j) + glbPrompt + s.substr(j + 1);
      }
    }
    //
    // Ora elimino tutti i prompt
    value = s.replace(new RegExp(glbPrompt, "g"), "");
  }
  //
  if (masktype == "N" && value.length > 0) {
    // Devo rimuovere il separatore delle migliaia e sostituire il separatore dei decimali con .
    var dec = glbDecSep === "." ? "\\" + glbDecSep : glbDecSep;
    var tho = glbThoSep === "." ? "\\" + glbThoSep : glbThoSep;
    value = value.replace(new RegExp(tho, "g"), "");
    value = value.replace(new RegExp(dec, "g"), ".");
  }
  //
  if (masktype == "D" && value.length > 0) {
    // We need to send the value in the date format to the server
    var mmntmask = mask.toUpperCase().replace("NN", "mm");
    var vl = moment(value, mmntmask);
    value = vl.format();
  }
  //
  return value;
}

function mask_mask(value, mask, masktype) {
  if (mask === ">" || mask === "<")
    return value;
  //
  var s = GetInitValue(mask, masktype);
  if (value == s && masktype != "A")
    value = "";
  if (masktype == "A") {
    var valIndex = 0;
    // Ciclo sul valore della maschera fino a trovare un placeholder, a quel punto lo riempio
    // con il primo carattere del value e così via..
    for (var j = 0; j < s.length; j++) {
      if (s.charAt(j) === glbPrompt && value.length > valIndex) {
        s = s.substring(0, j) + value.charAt(valIndex) + s.substring(j + 1);
        valIndex++;
      }
    }
    value = s;
  }
  if (masktype == "N") {
    value = numformat(mask, value);
  }
  if (masktype == "D") {
    var mmntmask = mask.toUpperCase().replace("NN", "mm");
    //
    // I don't know what the server has for this field. It could be a database date or a masked string...
    // first we try to use the raw date format.. if it fails we can try the mask,
    // maybe is an already masked string...
    // 
    // On cloud if the server sent a value with the timezone (Z) we need to use the complete format, the cloud server doesn't mask the value
    var vl = moment(value, !Client.mainFrame.isIDF && value?.indexOf("Z") > 0  ? "YYYY-MM-DDTHH:mm:ss.SSSSZ" : mmntmask);
    if (!vl.isValid())
      vl = moment(value);
    if (vl.isValid())
      value = vl.format(mmntmask);
  }
  //
  return value;
}





/**
 * Javascript-number-formatter
 * Lightweight & Fast JavaScript Number Formatter
 *
 * @preserve IntegraXor Web SCADA - JavaScript Number Formatter (http://www.integraxor.com/)
 * @author KPL
 * @maintainer Rob Garrison
 * @copyright 2019 ecava
 * @license MIT
 * @link http://mottie.github.com/javascript-number-formatter/
 * @version 2.0.9
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
          typeof define === 'function' && define.amd ? define(factory) :
          (global = global || self, global.numformat = factory());
}(this, function () {
  'use strict';

  const maskRegex = /[0-9\-+#]/;
  const notMaskRegex = /[^\d\-+#]/g;

  function getIndex(mask) {
    return mask.search(maskRegex);
  }

  function processMask(mask = "#.##") {
    const maskObj = {};
    const len = mask.length;
    const start = getIndex(mask);
    maskObj.prefix = start > 0 ? mask.substring(0, start) : "";

    // Reverse string: not an ideal method if there are surrogate pairs
    const end = getIndex(mask.split("").reverse().join(""));
    const offset = len - end;
    const substr = mask.substring(offset, offset + 1);
    // Add 1 to offset if mask has a trailing decimal/comma
    const indx = offset + ((substr === "." || (substr === ",")) ? 1 : 0);
    maskObj.suffix = end > 0 ? mask.substring(indx, len) : "";

    maskObj.mask = mask.substring(start, indx);
    maskObj.maskHasNegativeSign = maskObj.mask.charAt(0) === "-";
    maskObj.maskHasPositiveSign = maskObj.mask.charAt(0) === "+";
    //
    maskObj.decimal = glbDecSep;
    maskObj.separator = glbThoSep;
    //
    // Split the decimal for the format string if any
    let result = maskObj.mask.split(maskObj.decimal);
    maskObj.integer = result[0];
    maskObj.fraction = result[1];
    return maskObj;
  }

  function processValue(value, maskObj, options) {
    let isNegative = false;
    const valObj = {
      originalValue: value,
      value
    };
    if (value < 0) {
      isNegative = true;
      // Process only abs(), and turn on flag.
      valObj.value = -valObj.value;
    }

    valObj.sign = isNegative ? "-" : "";

    // Fix the decimal first, toFixed will auto fill trailing zero.
    valObj.value = Number(valObj.value).toFixed(maskObj.fraction && maskObj.fraction.length);
    // Convert number to string to trim off *all* trailing decimal zero(es)
    valObj.value = Number(valObj.value).toString();

    // Fill back any trailing zero according to format
    // look for last zero in format
    const posTrailZero = maskObj.fraction && maskObj.fraction.lastIndexOf("0");
    let [valInteger = "0", valFraction = ""] = valObj.value.split(".");
    if (!valFraction || (valFraction && valFraction.length <= posTrailZero)) {
      valFraction = posTrailZero < 0
              ? ""
              : (Number("0." + valFraction).toFixed(posTrailZero + 1)).replace("0.", "");
    }
    //
    valObj.integer = valInteger;
    valObj.fraction = valFraction;
    addSeparators(valObj, maskObj);

    // Remove negative sign if result is zero
    if (valObj.result === "0" || valObj.result === "") {
      // Remove negative sign if result is zero
      isNegative = false;
      valObj.sign = "";
    }

    if (!isNegative && maskObj.maskHasPositiveSign) {
      valObj.sign = "+";
    }
    else if (isNegative && maskObj.maskHasPositiveSign) {
      valObj.sign = "-";
    }
    else if (isNegative) {
      valObj.sign = options && options.enforceMaskSign && !maskObj.maskHasNegativeSign
              ? ""
              : "-";
    }

    return valObj;
  }

  function addSeparators(valObj, maskObj) {
    valObj.result = "";
    // Look for separator
    const szSep = maskObj.integer.split(maskObj.separator);
    // Join back without separator for counting the pos of any leading 0
    const maskInteger = szSep.join("");

    const posLeadZero = maskInteger && maskInteger.indexOf("0");
    if (posLeadZero > -1) {
      while (valObj.integer.length < (maskInteger.length - posLeadZero))
        valObj.integer = "0" + valObj.integer;
    }
    else if (Number(valObj.integer) === 0 && valObj.originalValue === "") {
      valObj.integer = "";
      valObj.fraction = "";
    }

    // Process the first group separator from decimal (.) only, the rest ignore.
    // get the length of the last slice of split result.
    const posSeparator = (szSep[1] && szSep[szSep.length - 1].length);
    if (posSeparator) {
      const len = valObj.integer.length;
      const offset = len % posSeparator;
      for (let indx = 0; indx < len; indx++) {
        valObj.result += valObj.integer.charAt(indx);
        // -posSeparator so that won't trail separator on full length
        if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
          valObj.result += maskObj.separator;
        }
      }
    }
    else {
      valObj.result = valObj.integer;
    }

    valObj.result += (maskObj.fraction && valObj.fraction)
            ? maskObj.decimal + valObj.fraction
            : "";
    return valObj;
  }

  var numformat = (mask, value, options = {}) => {
    if (!mask || isNaN(Number(value))) {
      // Invalid inputs
      return value;
    }

    const maskObj = processMask(mask);
    const valObj = processValue(value, maskObj, options);
    return maskObj.prefix + valObj.sign + valObj.result + maskObj.suffix;
  };

  return numformat;

}));



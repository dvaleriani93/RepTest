/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client,emojify */

/**
 * @class "HtmlEditor" UI element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the progress bar
 */
Client.HtmlEditor = function (element, parent, view)
{
  // The constructor will be called twice during object initialization
  // first time, without any parameter, then with them.
  if (element === undefined)
    return;
  if (view === undefined)
    return;
  //
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("div");
  this.domObj.id = (Math.random() + "").substring(2);
  //
  // Hammer sets this to 'none' on the root, but this element needs the value 'auto'
  // so we restore this value here
  this.domObj.style.webkitUserSelect = "auto";
  //
  this.trumboObj = document.createElement("div");
  this.trumboObj.id = (Math.random() + "").substring(2);
  //
  this.domObj.appendChild(this.trumboObj);
  //
  parent.appendChildObject(this, this.domObj);
  //
  // I must load the plugins and the language files
  this.reqLoaded = false;
  this.elList = [element];
  //
  this.loadPlugins(true, () => {
    this.loadLanguage(element, () => {
      this.reqLoaded = true;
      for (let i = 0; i < this.elList.length; i++) {
        let elit = this.elList[i];
        //
        this.updateElement(elit, (i === 0));
        if (elit.events) {
          this.attachEvents(elit.events);
          this.init(elit.events);
        }
      }
    });
  });
};


// Make Client.HtmlEditor extend Client.Element
Client.HtmlEditor.prototype = new Client.Element();


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.HtmlEditor.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  let pos = events.indexOf("onChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.onChange = true;
  }
  //
  pos = events.indexOf("onInput");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.onInput = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Prepare the event of change value
 */
Client.HtmlEditor.prototype.changeValueEvent = function ()
{
  return {obj: this.id, id: "chgProp", content: {name: "value", value: $('#' + this.trumboObj.id).trumbowyg('html'), clid: Client.id}};
};


/**
 * Update element properties
 * @param {Object} el - properties to update
 * @param {Boolean} calledFromCode
 */
Client.HtmlEditor.prototype.updateElement = function (el, calledFromCode)
{
  if (this.reqLoaded === false && this.elList) {
    this.elList.push(el);
    return;
  }
  //
  // configure emojify
  emojify.setConfig({
    img_dir: '//cdnjs.cloudflare.com/ajax/libs/emojify.js/1.1.0/images/basic/'
  });
  //
  // Remove bounced properties (for telecollaboration)
  this.purgeMyProp(el);
  //
  this.options = this.options || {};
  //
  // is necessary re-create the element if at least one of these properties are changed
  let createElement = el.btns !== undefined ||
          el.hideButtonTexts !== undefined ||
          el.semantic !== undefined ||
          el.resetCss !== undefined ||
          el.removeformatPasted !== undefined ||
          el.autogrowOnEnter !== undefined ||
          el.autogrow !== undefined ||
          el.imageWidthModalEdit !== undefined ||
          el.lang !== undefined ||
          el.plugins !== undefined;
  //
  // if is necessary ricreate trumbo element add to element all  properties that require api call
  if (!calledFromCode && createElement) {
    // remove all nodes of wrapper
    let myNode = document.getElementById(this.domObj.id);
    while (myNode.firstChild)
      myNode.removeChild(myNode.firstChild);
    //
    let newEl = document.createElement("div");
    newEl.id = (Math.random() + "").substring(2);
    this.trumboObj.id = newEl.id;
    this.trumboObj = newEl;
    //
    this.domObj.appendChild(this.trumboObj);
    //
    el.value = this.value;
    el.disabled = this.disabled;
    //
    this.updateElement(el, true);
    this.init();
  }
  //
  if (el.btns !== undefined) {
    let buttons = el.btns.split(";");
    //
    if (buttons.length && buttons[0].length)
      this.options.btns = buttons.map(item => item.split(","));
    else
      delete this.options.btns;
    //
    delete el.btns;
  }
  //
  if (el.hideButtonTexts !== undefined) {
    this.options.hideButtonTexts = el.hideButtonTexts;
    delete el.hideButtonTexts;
  }
  //
  if (el.semantic !== undefined) {
    this.options.semantic = el.semantic;
    delete el.semantic;
  }
  //
  if (el.resetCss !== undefined) {
    this.options.resetCss = el.resetCss;
    delete el.resetCss;
  }
  //
  if (el.removeformatPasted !== undefined) {
    this.options.removeformatPasted = el.removeformatPasted;
    delete el.removeformatPasted;
  }
  //
  if (el.autogrowOnEnter !== undefined) {
    this.options.autogrowOnEnter = el.autogrowOnEnter;
    delete el.autogrowOnEnter;
  }
  //
  if (el.autogrow !== undefined) {
    this.options.autogrow = el.autogrow;
    delete el.autogrow;
  }
  //
  if (el.imageWidthModalEdit !== undefined) {
    this.options.imageWidthModalEdit = el.imageWidthModalEdit;
    delete el.imageWidthModalEdit;
  }
  //
  if (el.lang !== undefined) {
    this.options.lang = el.lang;
    delete el.lang;
  }
  //
  if (el.plugins !== undefined) {
    this.options.plugins = el.plugins;
    delete el.plugins;
  }
  //
  // transform div into  editor
  $('#' + this.trumboObj.id).trumbowyg(this.options);
  //
  // run emojify
  emojify.run();
  //
  // disable/enable editor
  if (el.disabled !== undefined) {
    $('#' + this.trumboObj.id).trumbowyg(el.disabled ? "disable" : "enable");
    this.disabled = el.disabled;
    delete el.disabled;
  }
  //
  // set value in editor
  if (el.value !== undefined) {
    this.value = el.value || "";
    $('#' + this.trumboObj.id).trumbowyg('html', this.value);
    delete el.value;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Initialize the dropzone
 */
Client.HtmlEditor.prototype.init = function ()
{
  if (this.initTimer) {
    clearTimeout(this.initTimer);
    delete this.initTimer;
  }
  //
  // Check if the domObj is in the DOM, maybe is not (for example if we are in an IonItem we are out-of-dom during the initial phase)
  let pobj = this.domObj;
  while (pobj) {
    if (pobj.id === "app-ui")
      break;
    pobj = pobj.parentNode;
  }
  //
  if (!pobj || pobj.id !== "app-ui") {
    this.initTimer = setTimeout(() => {
      delete this.initTimer;
      this.init();
    }, 25);
    return;
  }
  //
  // Add tbwchange event
  $('#' + this.trumboObj.id).trumbowyg().on('tbwchange', event => {
    event = event || {};
    event = {timeStamp: event.timeStamp, isTrigger: event.isTrigger};
    this.valueHasChanged = true;
    //
    if (this.onInput) {
      this.valueHasChanged = this.onChange;
      //
      let e = [this.changeValueEvent()];
      e.push({obj: this.id, id: "onInput", content: this.saveEvent(event)});
      Client.mainFrame.sendEvents(e);
    }
  }); // Listen for `tbwfocus` event;
  //
  // Add tbwblur event
  let blurFunction = event => {
    let e = [];
    //
    event = event || {};
    event = {timeStamp: event.timeStamp, isTrigger: event.isTrigger};
    //
    if (this.valueHasChanged) {
      this.valueHasChanged = false;
      //
      e.push(this.changeValueEvent());
      //
      if (this.onChange)
        e.push({obj: this.id, id: "onChange", content: this.saveEvent(event)});
      if (e.length)
        Client.mainFrame.sendEvents(e);
    }
    //
    // At the blur save the current position
    $('#' + this.trumboObj.id).trumbowyg('saveRange');
  };
  //
  $('#' + this.trumboObj.id).trumbowyg().on('tbwblur', blurFunction);
  //
  // The HTML plain textarea doesn't notify the tbwblur event, so we need to try to subscribe to the native event
  let txts = this.trumboObj?.parentNode?.getElementsByClassName("trumbowyg-textarea") || [];
  if (txts && txts.length > 0)
    txts[0].addEventListener("blur", blurFunction);
  //
  // will transform an :emoji: to img tag at each input
  $('.trumbowyg-editor').on('input propertychange', () => emojify.run());
};


/**
 * Return selected text
 * @param {function} cb
 */
Client.HtmlEditor.prototype.getSelectedText = function (cb)
{
  // first save current selection
  $('#' + this.trumboObj.id).trumbowyg('saveRange');
  //
  // then return selected text
  let e = [{obj: this.id, id: "cb", content: {res: $('#' + this.trumboObj.id).trumbowyg('getRangeText'), cbId: cb}}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Switch editor mode
 * @param {function} cb
 */
Client.HtmlEditor.prototype.switchMode = function (cb)
{
  $('#' + this.trumboObj.id).trumbowyg('toggle');
};


/**
 * Replace selection
 * @param {string} string
 */
Client.HtmlEditor.prototype.replaceSelection = function (string)
{
  // first save current selection
  $('#' + this.trumboObj.id).trumbowyg('saveRange');
  let range = $('#' + this.trumboObj.id).trumbowyg('getRange');
  if (!range)
    $('#' + this.trumboObj.id).focus();
  //
  let oldStartOffset = range ? range.startOffset : 0;
  //
  // Get a map from the root node to the selected node, so we can navigate it back and if the structure is the same
  // we can restore the focus
  let traverseMap = [];
  let nd = range ? range.startContainer : this.trumboObj.firstChild;
  let child = 0;
  while (nd !== document.body && nd !== this.trumboObj)
  {
    if (nd.previousSibling) {
      child++;
      nd = nd.previousSibling;
    }
    else if (nd.parentNode) {
      traverseMap.push(child);
      child = 0;
      nd = nd.parentNode;
    }
    if (!nd)
      break;
  }
  //
  // replace selection in text area
  document.execCommand('insertHTML', false, string);
  //
  // update "value" in trumbowyg
  $('#' + this.trumboObj.id).trumbowyg('html', $('#' + this.trumboObj.id).html());
  //
  // Restore the range, get the new range and move the cursor after the inserted text
  $('#' + this.trumboObj.id).trumbowyg('restoreRange');
  //
  setTimeout(() => {
    try {
      let selection = getSelection();
      //
      // I cannot use the range, maybe the old object was removed and another object was created
      // so we navigate the dom tree searching the new object that is in the original position.
      // if we find it we can select it and move the cursor after the new text length
      let tgtNode = this.trumboObj;
      for (let c = traverseMap.length - 1; c >= 0; c--)
        tgtNode = tgtNode.childNodes.item(traverseMap[c]);
      //
      if (tgtNode) {
        if (selection.rangeCount > 0)
          selection.removeAllRanges();
        //
        let range = document.createRange();
        range.setStart(tgtNode, oldStartOffset + string.length);
        range.setEnd(tgtNode, oldStartOffset + string.length);
        selection.addRange(range);
      }
    }
    catch (ex) {
      console.log(ex);
    }
  }, 200);
  //
  // send event to update "value" property in client
  Client.mainFrame.sendEvents([this.changeValueEvent()]);
};


/**
 * Focus editor
 * @param {Object} options
 */
Client.HtmlEditor.prototype.focus = function (options)
{
  Client.Element.prototype.focus.call(this, options);
  setTimeout(() => {
    let range = $('#' + this.trumboObj.id).trumbowyg('getRange');
    if (range)
      $('#' + this.trumboObj.id).trumbowyg('restoreRange');
    else
      $('#' + this.trumboObj.id).focus();
  }, 100);
};


/**
 * Loads the plugins of the editor AFTER the view creation and when finished calls the callback. Used to create the editor without blocking the
 * view creation. The editor starts as a div and then becomes a trumbo
 * @param {Boolean} start
 * @param {Function} callback
 */
Client.HtmlEditor.prototype.loadPlugins = function (start, callback)
{
  // I must load all the plugins and call the callback when finished
  if (start || !this.plugList) {
    this.plugList = [
      "objects/htmleditor/plugins/base64/trumbowyg.base64.min.js",
      "objects/htmleditor/plugins/colors/trumbowyg.colors.js",
      "objects/htmleditor/plugins/emoji/trumbowyg.emoij.min.js",
      "objects/htmleditor/plugins/fontfamily/trumbowyg.fontfamily.js",
      "objects/htmleditor/plugins/fontsize/trumbowyg.fontsize.js",
      "objects/htmleditor/plugins/history/trumbowyg.history.js",
      "objects/htmleditor/plugins/indent/trumbowyg.indent.js",
      "objects/htmleditor/plugins/mathml/trumbowyg.mathml.js",
      "objects/htmleditor/plugins/mention/trumbowyg.mention.js",
      "objects/htmleditor/plugins/pasteimage/trumbowyg.pasteimage.min.js"
    ];
    //
    // Add prefix if needed
    this.plugList.forEach((plug, i, list) => list[i] = (Client.mainFrame.isIDF ? "fluid/" : "") + plug);
  }
  //
  while (this.plugList.length > 0) {
    let p = this.plugList.pop();
    if (Client.mainFrame.requireMap[p] !== "complete") {
      // add the script and when loaded complete the list
      let script = document.createElement("script");
      script.type = "text/javascript";
      script.onload = () => {
        Client.mainFrame.requireMap[p] = "complete";
        this.loadPlugins(false, callback);
      };
      script.onerror = () => {
        console.error("error while loading Trumbowyg plugin " + p);
        this.loadPlugins(false, callback);
      };
      script.src = Client.Utils.abs(p);
      document.body.appendChild(script);
      //
      return;
    }
  }
  // All loaded!
  callback();
};


/**
 * Loads the language file from the server and sets it content. The language file is a JSON.
 * We don't use a script because we could overwrite the plugin translations.
 * the language file must be loaded before the plugins, but we cannot guarantee that:
 * if a user opens a view with Trumbo, loads a language and the plugins and then closes the view and changes the language
 * le plugin translation are lost. We could reload all the plugins every time, but is no good. So we fetch the language JSON and set its properties.
 * @param {Object} element
 * @param {Function} callback
 */
Client.HtmlEditor.prototype.loadLanguage = function (element, callback)
{
  if (!element.lang) {
    // try to load the browser language
    element.lang = navigator.language;
    if (element.lang.length > 2)
      element.lang = element.lang.substring(0, 2); // the language files are in the format 'it' and not 'it-IT'
  }
  //
  // Since "en" is the default language, there isn't a "en.js" file to load, so do nothing
  if (element.lang === "en")
    return callback();
  //
  let xhr = new XMLHttpRequest();
  xhr.open("GET", Client.Utils.abs((Client.mainFrame.isIDF ? "fluid/" : "") + "objects/htmleditor/langs/" + element.lang + ".js"));
  xhr.onload = () => {
    try {
      let content = xhr.responseText;
      content = JSON.parse(content);
      let k = Object.keys(content);
      if (!jQuery.trumbowyg.langs[element.lang])
        jQuery.trumbowyg.langs[element.lang] = {};
      //
      // for each property add the translation to the language
      for (let n = 0; n < k.length; n++) {
        if (jQuery.trumbowyg.langs[element.lang][k[n]] === undefined)
          jQuery.trumbowyg.langs[element.lang][k[n]] = content[k[n]];
      }
    }
    catch (ex) {
    }
    callback();
  };
  xhr.onerror = () => callback();
  xhr.send();
};


/**
 * Returns the object that can be focused
 */
Client.HtmlEditor.prototype.getFocusableObj = function ()
{
  if (this.domObj.firstChild.classList.contains("trumbowyg-editor-hidden"))
    return this.domObj.getElementsByTagName("TEXTAREA")[0];
  else
    return this.trumboObj;
};


Client.HtmlEditor.prototype.close = function (firstLevel, triggerAnimation) 
{
  if (this.trumboObj)
    $('#' + this.trumboObj.id).trumbowyg('destroy');
  delete this.trumboObj;
  //
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
};

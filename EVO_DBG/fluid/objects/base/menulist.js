/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class A menu list container
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the dialog
 * @extends Client.Container
 */
Client.MenuList = function (element, parent, view)
{
  Client.Container.call(this, element, parent, view);
  //
  this.addEventsListeners();
  //
  // if the menulist is defined at the view level,
  // the div element is not attached to the DOM because will be shown in a dialog
  if (parent instanceof Client.View)
    this.domObj.parentNode.removeChild(this.domObj);
  this.domObj.className = "menu-list " + this.domObj.className;
};


// Make Client.MenuList extend Client.Dialog
Client.MenuList.prototype = new Client.Container();


/**
 * Add events listeners
 */
Client.MenuList.prototype.addEventsListeners = function ()
{
  this.domObj.addEventListener("click", (ev) => {
    if (this.changeCallback)
      this.changeCallback(ev);
    this.hide();
  }, true);
};


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.MenuList.prototype.updateElement = function (el)
{
  // Change image
  if (el.whisker) {
    this.whisker = el.whisker;
    delete el.whisker;
  }
  //
  Client.Container.prototype.updateElement.call(this, el);
};



/**
 * Show the menu near an element
 * @param {Object} el - properties to update
 */
Client.MenuList.prototype.show = function (ref)
{
  var pthis = this;
  this.domObj.style.height = "";
  this.dialog = new Client.Dialog({options: {autoclose: true, ref: {id: ref, whisker: this.whisker}}}, this.view, this.view);
  this.dialog.domObj.appendChild(this.domObj);
  this.dialog.positionElement();
  //
  var maxHeight = (this.dialog.domObj.parentNode.clientHeight - this.dialog.domObj.offsetTop - 2);
  if (this.domObj.offsetHeight > maxHeight)
    this.domObj.style.height = maxHeight + "px";
  //
  this.dialog.autoClose = function (ev) {
    pthis.autoHide(ev);
  };
};


/**
 * Close the menu
 */
Client.MenuList.prototype.autoHide = function (ev)
{
  // Avoid internal click
  var clickedEl = ev.target;
  var parent = clickedEl;
  while (parent) {
    if (parent === this.domObj)
      return;
    parent = parent.parentNode;
  }
  //
  this.hide();
};


/**
 * Hide the menu
 */
Client.MenuList.prototype.hide = function ()
{
  if (this.dialog) {
    this.dialog.close();
  }
  this.dialog = null;
};

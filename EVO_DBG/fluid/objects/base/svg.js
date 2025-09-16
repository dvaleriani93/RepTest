/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class A SVG element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the span
 */
Client.SVG = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};


// Make Client.Span extend Client.Element
Client.SVG.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.SVG.prototype.updateElement = function (el)
{
  if (el.src) {
    if (!this.use) {
      this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");
      this.domObj.appendChild(this.use);
    }
    this.use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + el.src);
    delete el.src;
  }
  if (el.className !== undefined) {
    this.domObj.setAttribute("class", el.className);
    delete el.className;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};

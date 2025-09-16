/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A clickable button
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.Button = function (element, parent, view)
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
  var tag = element.tag || "button";
  this.domObj = document.createElement(tag);
  delete element.tag;
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);
};


// Make Client.Button extend Client.Element
Client.Button.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Button.prototype.updateElement = function (el)
{
  // The inner text property must be treated specially:
  // if the button has a child setting the property removes it ... so we must:
  // - save the children
  // - set the property
  // - restore the children (in the correct order)
  if (el.innerText !== undefined) {
    // Save the children
    var chs = [];
    for (var i = 0; i < this.domObj.children.length; i++)
      chs.push(this.domObj.children.item(i));
    //
    // Set the property
    this.domObj.innerText = el.innerText;
    //
    // Restore the children
    for (var i = 0; i < chs.length; i++)
      this.domObj.appendChild(chs[i]);
    //
    // We handled the property... remove from the element representation and continue with others properties
    delete el.innerText;
  }
  // If there is an activation key remember it
  if (el.cmdKey) {
    this.cmdKey = el.cmdKey.toUpperCase();
    //
    // Base class must not use the cmdKey property
    delete el.cmdKey;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class A link element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the link
 */
Client.Link = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("a");
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};


// Make Client.Link extend Client.Element
Client.Link.prototype = new Client.Element();


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.Link.prototype.attachEvents = function (events)
{
  Client.Element.prototype.attachEvents.call(this, events);
  //
  if (Client.mainFrame.isEditing())
    this.domObj.addEventListener("click", function (ev) {
      ev.preventDefault();
    });

};

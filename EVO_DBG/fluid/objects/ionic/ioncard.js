/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */


/**
 * @class A container for the entire ionic page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonCard = function (element, parent, view)
{
  element.tag = "ion-card";
  Client.Container.call(this, element, parent, view);
};

Client.IonCard.prototype = new Client.Container();


/**
 * @class A container for the entire ionic page
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the button
 */
Client.IonCardSection = function (element, parent, view)
{
  element.tag = this.getTag(element.type);
  Client.Container.call(this, element, parent, view);
};

Client.IonCardSection.prototype = new Client.Container();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonCardSection.prototype.updateElement = function (el)
{
  if (el.type) {
    this.changeTag(this.getTag(el.type));
    delete el.type;
  }
  Client.Container.prototype.updateElement.call(this, el);
};


/**
 * Get Section Tag
 * @param {string} type
 */
Client.IonCardSection.prototype.getTag = function (type)
{
  switch (type) {
    case "header":
      return "ion-card-header";
    case "title":
      return "ion-card-title";

    default:
      return "ion-card-content";
  }
};

/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class An item of a menulist element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the span
 */
Client.MenuItem = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("div");
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  this.domObj.className = "menu-item " + this.domObj.className;
  //
  parent.appendChildObject(this, this.domObj);
};

// Make Client.MenuItem extend Client.Element
Client.MenuItem.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.MenuItem.prototype.updateElement = function (el)
{
  // Change image
  if (el.image) {
    if (!this.imageObj) {
      if (el.image.substring(0, 4) === "svg:") {
        this.imageObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.imageObj.setAttribute("class", "menu-item-svg");
        this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        this.imageObj.appendChild(this.use);
      }
      else if (el.image.substring(0, 4) === "cls:") {
        this.imageObj = document.createElement("div");
      }
      else {
        this.imageObj = document.createElement("img");
        this.imageObj.className = "menu-item-img";
      }
      this.domObj.appendChild(this.imageObj);
    }
    //
    if (this.use)
      this.use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + el.image.substring(4));
    else if (this.imageObj.tagName === "div")
      this.imageObj.className = "menu-item-cls " + el.image.substring(4);
    else
      this.imageObj.src = el.image;
    //
    delete el.image;
  }
  //
  if (el.caption || el.detail) {
    if (!this.rightObj) {
      this.rightObj = document.createElement("div");
      this.rightObj.className = "menu-item-right";
      this.domObj.appendChild(this.rightObj);
    }
  }
  //
  // Change name
  if (el.caption) {
    if (!this.nameObj) {
      this.nameObj = document.createElement("div");
      this.nameObj.className = "menu-item-name";
      this.rightObj.appendChild(this.nameObj);
    }
    //
    if (el.hllen)
      this.nameObj.innerHTML = el.caption.substring(0, el.hlpos) + "<span class='element-autocomplete-value-hl'>" +
              el.caption.substr(el.hlpos, el.hllen) + "</span>" + el.caption.substring(el.hlpos + el.hllen);
    else
      this.nameObj.innerText = el.caption;
    delete el.hlpos;
    delete el.hllen;
    delete el.highlight;
  }
  //
  // Change name
  if (el.detail) {
    if (!this.descObj) {
      this.descObj = document.createElement("div");
      this.descObj.className = "menu-item-detail";
      this.rightObj.appendChild(this.descObj);
    }
    this.descObj.innerText = el.detail;
    delete el.detail;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


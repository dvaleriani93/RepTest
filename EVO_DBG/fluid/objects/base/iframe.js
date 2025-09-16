/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class An iframe element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the iframe
 */
Client.Iframe = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("iframe");
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};


// Make Client.Iframe extend Client.Element
Client.Iframe.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Iframe.prototype.updateElement = function (el)
{
  // To handle load trigger the base class must not handle src: we must fisrt handle the animations and then set the SRC: if we found the load trigger
  // we must use the animation (apply the step 0 at the exact moment when we set the src, when the loading is finished we can use the animation to create a smooth transition)
  var src;
  if (el.src) {
    src = el.src;
    delete el.src;
  }
  if (el.innerHTML) {
    this.domObj.contentWindow.document.documentElement.innerHTML = el.innerHTML;
    delete el.innerHTML;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  if (src) {
    if (this.loadTrigger)
      this.handleLoadTrigger();
    //
    // Now apply the new src
    this.domObj.src = src;
  }
};


/**
 * Handles the load trigger
 */
Client.Iframe.prototype.handleLoadTrigger = function () {
  // First: apply the step 0 of the animation before applying the new src
  for (var a = 0; a < this.animations.length; a++) {
    if (this.animations[a].trigger === "load") {
      // Create the load animation
      var animDef;
      if (Client.ClientAnimation[this.animations[a].type] !== undefined)
        animDef = Client.ClientAnimation[this.animations[a].type](this.animations[a], this);
      //
      if (animDef && animDef.segments && animDef.segments.length > 0) {
        // Get the from of the first segment
        var from = animDef.segments[0].from;
        var style = null;
        var obj = {};
        //
        // Copy the from state in a new object, grouping the style properties in a Style object
        for (var prop in from) {
          if (prop.substring(0, 6) === "style_") {
            // Create the style object
            if (!style)
              style = {};
            //
            // Add the property to the style and clear from the object
            style[prop.substring(6, prop.length)] = from[prop];
          }
          else
            obj[prop] = from[prop];
        }
        //
        // If the style is defined add it to the object
        if (style)
          obj.style = style;
        //
        // Now apply the from updating the element
        obj.fromanim = true;
        this.updateElement(obj);
      }
    }
  }
};


/**
 * Add to this element an animation definition
 * @param {Array} animationsList - array of animations
 */
Client.Iframe.prototype.attachAnimations = function (animationsList)
{
  // Call the base class
  Client.Element.prototype.attachAnimations.call(this, animationsList);
  //
  // Now search if there is a 'specific' animation for this object
  for (var i = 0; i < this.animations.length; i++) {
    var def = this.animations[i];
    //
    // Check if must use a 'load' animation
    if (def.trigger === "load") {
      var pthis = this;
      if (!this.loadTrigger)
        this.domObj.addEventListener("load", function (ev) {
          pthis.onAnimationTrigger(ev, "load");
        });
      this.loadTrigger = true;
    }
  }
};


/**
 * Function called when a condition must trigger the animations
 * @param {MouseEvent} ev -
 * @param {String} trigger - trigger that has been fired
 */
Client.Iframe.prototype.onAnimationTrigger = function (ev, trigger)
{
  // No animation for this object
  if (this.animate === false)
    return;
  //
  var handled = false;
  if (trigger === "load") {
    for (var a = 0; a < this.animations.length; a++) {
      // Check if this animation must be triggered
      if (this.animations[a].trigger === "load") {
        handled = true;
        var def = this.animations[a];
        var animDef;
        if (Client.ClientAnimation[def.type] !== undefined)
          animDef = Client.ClientAnimation[def.type](def, this);
        //
        if (animDef) {
          var triggerAnimation = new Client.ClientAnimation(animDef, this);
          triggerAnimation.play(false);
        }
      }
    }
  }
  //
  // If the animation is not handled by the Image pass the event to the base class
  if (!handled)
    Client.Element.prototype.onAnimationTrigger.call(this, ev, trigger);
};

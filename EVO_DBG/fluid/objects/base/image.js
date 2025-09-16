/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/**
 * @class An image
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the image
 */
Client.Image = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("img");
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};


// Make Client.Image extend Client.Element
Client.Image.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Image.prototype.updateElement = function (el)
{
  if (el.width === "")
    delete el.width;  // Base class must not use the width property
  if (el.height === "")
    delete el.height;  // Base class must not use the heigth property
  //
  // To handle load trigger the base class must not handle src: we must fisrt handle the animations and then set the SRC: if we found the load trigger
  // we must use the animation
  var src;
  if (el.src !== undefined) {
    src = el.src;
    delete el.src;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  if (src !== undefined) {
    if (src) {
      if (this.loadTrigger)
        this.handleLoadTrigger();
      this.domObj.src = Client.Utils.abs(src);
      if (this.domObj.complete && this.domObj.onload)
        this.domObj.onload();
    }
    else {
      this.domObj.src = "";
    }
  }
};


/**
 * Handles the load trigger
 */
Client.Image.prototype.handleLoadTrigger = function () {
  // First: start the timer to apply the step 0 of the animation
  // if the image is cached the onload triggers before the timer, so we can disable it and show the image without fading
  var _this = this;
  this.loadTimer = window.setTimeout(function () {
    // Apply the first step of the animation AND clear the timer
    _this.loadTimer = null;
    //
    for (var a = 0; a < _this.animations.length; a++) {
      if (_this.animations[a].trigger === "load") {
        // Create the load animation
        var animDef;
        if (Client.ClientAnimation[_this.animations[a].type] !== undefined)
          animDef = Client.ClientAnimation[_this.animations[a].type](_this.animations[a], _this);
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
          _this.updateElement(obj);
        }
      }
    }
  }, 50);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.Image.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  Client.Element.prototype.attachEvents.call(this, events);
  //
  var pthis = this;
  if (events.indexOf("onLoad") >= 0) {
    this.domObj.onload = function (ev) {
      var e = [{obj: pthis.id, id: "chgProp", content: {name: "width", value: pthis.domObj.width, clid: Client.id}},
        {obj: pthis.id, id: "chgProp", content: {name: "height", value: pthis.domObj.height, clid: Client.id}},
        {obj: pthis.id, id: "chgProp", content: {name: "naturalWidth", value: pthis.domObj.naturalWidth, clid: Client.id}},
        {obj: pthis.id, id: "chgProp", content: {name: "naturalHeight", value: pthis.domObj.naturalHeight, clid: Client.id}},
        {obj: pthis.id, id: "onLoad", content: pthis.saveEvent(ev)}];
      Client.mainFrame.sendEvents(e);
    };
  }
};


/**
 * Add to this element an animation definition
 * @param {Array} animationsList - array of animations
 */
Client.Image.prototype.attachAnimations = function (animationsList)
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
Client.Image.prototype.onAnimationTrigger = function (ev, trigger)
{
  // No animation for this object
  if (this.animate === false)
    return;
  //
  var handled = false;
  if (trigger === "load") {
    if (this.loadTimer) {
      // The onload is triggered before the timer tick : the image is cached: in this case no animations and clear the timer
      window.clearTimeout(this.loadTimer);
      this.loadTimer = null;
      return;
    }
    //
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

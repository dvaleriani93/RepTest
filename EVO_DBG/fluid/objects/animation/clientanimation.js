/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class Base class for an Animation
 * @param {Object} anim - the element description
 * @param {Client.Element} element - element to apply the animation
 */
Client.ClientAnimation = function (anim, element)
{
  this.animationDef = anim;
  this.element = element;
  this.currentSegment = -1;
  this.currentRepetition = 1;
  this.status = Client.ClientAnimation.statusMap.STOPPED;
  this.reverted = false;
};

/**
 * Map of the animation status
 */
Client.ClientAnimation.statusMap = {
  ONGOING: "o",
  STOPPED: "s"
};


/**
 * Update the element with a state (object describing various properties of object and style)
 * @param {Object} state animation state
 */
Client.ClientAnimation.prototype.setState = function (state)
{
  var style = null;
  var obj = {};
  //
  // Copy the state in a new object, grouping the style properties in a Style object
  for (var prop in state) {
    if (prop.substring(0, 6) === "style_") {
      // Create the style object
      if (!style)
        style = {};
      //
      // Add the property to the style and clear from the object
      style[prop.substring(6, prop.length)] = state[prop];
    }
    else
      obj[prop] = state[prop];
  }
  //
  // If the style is defined add it to the object
  if (style)
    obj.style = style;
  //
  // Now update the element
  obj.fromanim = true;
  this.element.updateElement(obj);
};


/*
 * Function executed on the ending of the animation
 * @param {Object} prop final state of the animation
 */
Client.ClientAnimation.prototype.endFunction = function ()
{
  // Check if this is the final segment of the final repetion of the animation
  var finalSegment = false;
  if (this.currentRepetition <= 1 && ((!this.reverted && this.currentSegment === this.animationDef.segments.length - 1) || (this.reverted && this.currentSegment === 0)))
    finalSegment = true;
  //
  // Send the event to the server or call a callback when finished (only if not final, if final we must call the callback after the final state is set)
  if (!finalSegment) {
    if (this.animationDef.endcallback)
      this.animationDef.endcallback();
    else
      this.element.onEndAnimation(this.currentSegment, finalSegment, false, this.animationDef.id);
  }
  //
  // To the next segment: if ended we stop the animation and send the message to the client
  if (!this.reverted)
    this.currentSegment++;
  else
    this.currentSegment--;
  //
  if (finalSegment) {
    // Clear configuration of the animation
    this.status = Client.ClientAnimation.statusMap.STOPPED;
    this.currentSegment = -1;
    this.currentRepetition = 1;
    //
    // The animation can have a final state, to be set after the last segment is executed
    if (this.animationDef.finalState)
      this.setState(this.animationDef.finalState);
    //
    // Clear the CCS transition properties
    this.clearCSS();
    //
    // Reset at end if requested
    if (this.animationDef.autoreset)
      this.reset();
    //
    if (this.animationDef.endcallback)
      this.animationDef.endcallback();
    else
      this.element.onEndAnimation(this.currentSegment, finalSegment, false, this.animationDef.id);
    //
    return;
  }
  else if (((!this.reverted && this.currentSegment >= this.animationDef.segments.length) || (this.reverted && this.currentSegment <= 0)) && this.currentRepetition > 0)
  {
    // An animation is ended but must be repeated.. decrement the repetion index and restert from the first segment
    this.currentRepetition--;
    this.currentSegment = (this.reverted ? this.animationDef.segments.length - 1 : 0);
  }
  //
  // Execute next segment
  this.executeCSS(this.reverted);
};


/**
 * Executes the currentsegment animation using CSS transitions
 * @param {bool} revert - play the animation in reverted mode
 */
Client.ClientAnimation.prototype.executeCSS = function (revert) {
  // Calculate the property to use (Cross-Browser)
  var easingProp = "transitionTimingFunction";
  var durationProp = "transitionDuration";
  var delayProp = "transitionDelay";
  var transformProp = "transitionProperty";
  var eventName = "transitionend";
  var domObj = this.element.getRootObject();
  if (this.element instanceof Client.Widget)
    domObj = this.element.getAnimationRoot();
  //
  // Clear values to set the from correctly
  domObj.style[durationProp] = "0ms";
  //
  var settedProps = "";
  var from = revert ? this.animationDef.segments[this.currentSegment].to : this.animationDef.segments[this.currentSegment].from;
  var to = revert ? this.animationDef.segments[this.currentSegment].from : this.animationDef.segments[this.currentSegment].to;
  //
  // Populate the transform properties list and set the beginning value
  for (var p in from) {
    var pname = p.substring(0, 6) === "style_" ? p.substring(6, p.length) : p;
    settedProps += (settedProps.length === 0 ? "" : ",") + pname;
    domObj.style[pname] = from[p];
  }
  //
  // To force the layouting of the browser to apply the animation we must read an offsetproperty, so we can set the final values in the same function
  var layout = domObj.offsetTop + domObj.offsetHeight;
  //
  // Execute the animation: set the transform property and the final values
  // Now set the easing function, the delay and the duration of the segment
  // For the easing function map 'bounce' with a custom bezier function (http://cubic-bezier.com/#0,1.8,1,1.8)
  domObj.style[transformProp] = domObj.style[transformProp] !== "" ? domObj.style[transformProp] + ", " + settedProps : settedProps;
  domObj.style[easingProp] = (this.animationDef.segments[this.currentSegment].easing === "bounce" ? "cubic-bezier(0, 1.8, 1, 1.8)" : this.animationDef.segments[this.currentSegment].easing);
  if (this.animationDef.segments[this.currentSegment].delay && this.animationDef.segments[this.currentSegment].delay > 0)
    domObj.style[delayProp] = this.animationDef.segments[this.currentSegment].delay + "ms";
  domObj.style[durationProp] = this.animationDef.segments[this.currentSegment].duration + "ms";
  //
  for (var p in to) {
    var pname = p.substring(0, 6) === "style_" ? p.substring(6, p.length) : p;
    domObj.style[pname] = to[p];
  }
  //
  // Add the event to finish the segment
  var pthis = this;
  if (!this.endingFunction)
    this.endingFunction = function (tw) {
      if (tw.target === domObj)
        pthis.endFunction(tw);
    };
  domObj.addEventListener(eventName, this.endingFunction);
};


/*
 * Clears the CSS properties used to apply the animation
 */
Client.ClientAnimation.prototype.clearCSS = function () {
  // Calculate the property to use (Cross-Browser)
  var easingProp = "transitionTimingFunction";
  var durationProp = "transitionDuration";
  var delayProp = "transitionDelay";
  var transformProp = "transitionProperty";
  var eventName = "transitionend";
  //
  // Remove the event listener and the properties setted
  var domObj = this.element.getRootObject();
  if (this.element instanceof Client.Widget)
    domObj = this.element.getAnimationRoot();
  domObj.removeEventListener(eventName, this.endingFunction);
  domObj.style[easingProp] = "";
  domObj.style[durationProp] = "";
  domObj.style[delayProp] = "";
  domObj.style[transformProp] = "";
};


/*
 * Start the playing of this animation
 * @param {Bool} revert - True to play the animation in the reverse order, false or undefined to play in the forward order
 */
Client.ClientAnimation.prototype.play = function (revert)
{
  // If the animation is going dont'play
  if (this.status !== Client.ClientAnimation.statusMap.STOPPED || !this.animationDef || !this.animationDef.segments || this.animationDef.segments.length === 0)
    return;
  //
  this.currentRepetition = this.animationDef.repetitions;
  this.reverted = revert;
  this.currentSegment = revert ? this.animationDef.segments.length - 1 : 0;
  //
  // Play the animation using the CSS transforms
  // Execute the 'first initialization of the object' if needed
  if (this.animationDef.startingState)
    this.setState(this.animationDef.startingState);
  //
  this.status = Client.ClientAnimation.statusMap.ONGOING;
  this.executeCSS(revert);
};


/**
 * Stop an animation on this element
 */
Client.ClientAnimation.prototype.stop = function ()
{
  // Clear the CSS tansition variables, going to the final state (using CSS is not possibile to stop
  // the animation in the current state)
  this.clearCSS();
  if (this.status !== Client.ClientAnimation.statusMap.STOPPED)
    this.endFunction();
  //
  // Send the event to the server (telling that the animation got stopped)
  if (this.status !== Client.ClientAnimation.statusMap.STOPPED)
    this.element.onEndAnimation(this.currentSegment, false, true);
  //
  // Clear configuration of the animation
  this.status = Client.ClientAnimation.statusMap.STOPPED;
  this.currentSegment = -1;
  this.currentRepetition = 1;
};


/**
 * Reset an animation, the element is reset on the initial status before the animation.
 * If the animation is ongoing it will be stopped
 */
Client.ClientAnimation.prototype.reset = function ()
{
  if (this.status !== Client.ClientAnimation.statusMap.STOPPED)
    this.stop();
  //
  // No segments, no animation
  if (this.animationDef.segments.length === 0)
    return;
  //
  // Apply the first status of all the segments, starting with the last
  for (var i = this.animationDef.segments.length - 1; i >= 0; i--)
    this.setState(this.animationDef.segments[i].from);
};


/**
 * Creates an animation of SlideIn
 * @param {Object} param - Animation params
 * @param {Client.Element} ele - Element to animate
 */
Client.ClientAnimation.slideIn = function (param, ele)
{
  // Get params (if not set use defaults)
  var direction = param.from !== undefined ? param.from : "left";
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  //
  // For the correct calculations the object must be visible
  var eleRootObj = ele.getRootObject();
  if (ele instanceof Client.Widget)
    eleRootObj = ele.getAnimationRoot();
  var oldVisibility;
  if (ele.oldDisplay !== undefined)
  {
    oldVisibility = eleRootObj.style.visibility;
    eleRootObj.style.visibility = "hidden";
    eleRootObj.style.display = ele.oldDisplay;
  }
  //
  // Detect the position of the object
  var t = eleRootObj.offsetTop;
  var l = eleRootObj.offsetLeft;
  var w = 0;
  var h = 0;
  //
  // Consider border
  try {
    // Get data from computed style
    var so = window.getComputedStyle(eleRootObj, null);
    t -= parseInt(so.borderTopWidth);
    l -= parseInt(so.borderLeftWidth);
  }
  catch (ex) {
  }
  //
  // Calculate the window of the slide (the parent dimensions)
  var pn = eleRootObj.parentNode;
  var p = document.getElementById("app-ui");
  if (pn) {
    w = pn.offsetWidth;
    h = pn.offsetHeight;
  }
  else {
    // No parent, use the App-UI
    w = p.offsetWidth;
    h = p.offsetHeight;
  }
  //
  // If the offsetparent is another element we must remove the offset of the parent from my offset to know
  // the offset between me and my parent
  if (eleRootObj.offsetTop > 0 && eleRootObj.offsetParent !== eleRootObj.parentNode) {
    if (pn) {
      // Remove the offset of the parent.. so we have the relative distance between parent and child
      t -= pn.scrollTop + pn.offsetTop;
      l -= pn.scrollLeft + pn.offsetLeft;
    }
    else {
      // No parent, use the App-UI
      t -= p.scrollTop;
      l -= p.scrollLeft;
    }
  }
  //
  var to = {};
  var from = {};
  var transformName = "style_transform";
  to[transformName] = "translate3d(0px, 0px ,0px)";
  from[transformName] = "translate3d(0px, 0px ,0px)";
  //
  // Calculate the 'From' point
  switch (direction) {
    case "top" :
      t = 0 - t - eleRootObj.offsetHeight;
      from[transformName] = "translate3d(0px, " + t + "px, 0px)";
      break;

    case "bottom" :
      from[transformName] = "translate3d(0px, " + (h - t) + "px, 0px)";
      break;

    case "left" :
      l = 0 - l - eleRootObj.offsetWidth;
      from[transformName] = "translate3d(" + l + "px, 0px , 0px)";
      break;

    case "right" :
      from[transformName] = "translate3d(" + (w - l) + "px, 0px, 0px)";
      break;
  }
  //
  // The element must be returned to the correct status
  if (ele.oldDisplay !== undefined) {
    eleRootObj.style.visibility = oldVisibility;
    eleRootObj.style.display = "none";
  }
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates an animation of SlideOut
 * @param {Object} param - Animation params
 * @param {Client.Element} ele - Element to animate
 */
Client.ClientAnimation.slideOut = function (param, ele)
{
  var anim = Client.ClientAnimation.slideIn(param, ele);
  var fr = anim.segments[0].from;
  anim.segments[0].from = anim.segments[0].to;
  anim.segments[0].to = fr;
  //
  return anim;
};


/**
 * Creates an animation of translate X or Y
 * @param {Object} param - Animation params
 */
Client.ClientAnimation.translate = function (param)
{
  // Get params (if not set use defaults)
  var direction = param.from !== undefined ? param.from : "left";
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  var startPosition = param.startPosition !== undefined ? param.startPosition : "0px";
  var endPosition = param.movelength !== undefined ? param.movelength : "100px";
  //
  var to = {};
  var from = {};
  var transformName = "style_transform";
  to[transformName] = "translate3d(0px, 0px ,0px)";
  from[transformName] = "translate3d(0px, 0px ,0px)";
  //
  // Calculate the 'From' point
  switch (direction) {
    case "top" :
      from[transformName] = "translate3d(0px, " + startPosition + ", 0px)";
      to[transformName] = "translate3d(0px, " + endPosition + ", 0px)";
      break;

    case "bottom" :
      from[transformName] = "translate3d(0px, " + startPosition + ", 0px)";
      to[transformName] = "translate3d(0px, " + endPosition + ", 0px)";
      break;

    case "left" :
      from[transformName] = "translate3d(" + startPosition + ", 0px , 0px)";
      to[transformName] = "translate3d(" + endPosition + ", 0px , 0px)";
      break;

    case "right" :
      from[transformName] = "translate3d(" + startPosition + ", 0px, 0px)";
      to[transformName] = "translate3d(" + endPosition + ", 0px, 0px)";
      break;
  }
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates an animation of fade
 * @param {Object} param - Animation params
 */
Client.ClientAnimation.fade = function (param)
{
  // Get params (if not set use defaults)
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  var fadeFrom = param.from !== undefined ? param.from : 0;
  var fadeTo = param.to !== undefined ? param.to : 1;
  //
  var from = {style_opacity: fadeFrom};
  var to = {style_opacity: fadeTo};
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates an animation of scale
 * @param {Object} param - Animation params
 */
Client.ClientAnimation.zoom = function (param)
{
  // Get params (if not set use defaults)
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  var scaleFrom = param.from !== undefined ? param.from : 1;
  var scaleTo = param.to !== undefined ? param.to : 1.2;
  var scaleAxis = param.axis !== undefined ? param.axis : "xy";
  //
  var from = {};
  var to = {};
  var transformName = "style_transform";
  from[transformName] = "scale(" + (scaleAxis.indexOf("x") !== -1 ? scaleFrom : "1") + "," + (scaleAxis.indexOf("y") !== -1 ? scaleFrom : "1") + ") perspective(1px)";
  to[transformName] = "scale(" + (scaleAxis.indexOf("x") !== -1 ? scaleTo : "1") + "," + (scaleAxis.indexOf("y") !== -1 ? scaleTo : "1") + ") perspective(1px)";
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates an animation of flip
 * @param {Object} param - Animation params
 */
Client.ClientAnimation.flip = function (param)
{
  // Get params (if not set use defaults)
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  var rotationFrom = param.from !== undefined ? param.from : 180;
  var rotationTo = param.to !== undefined ? param.to : 180;
  var origin = param.origin !== undefined ? param.origin : "50%, 50%, 0px";
  var rotation = param.rotation !== undefined ? param.rotation : "horizontal";
  //
  var from = {};
  var to = {};
  var transformName = "style_transform";
  var transformOriginName = "style_transformOrigin";
  //
  from[transformName] = (rotation === "vertical" ? "rotateY(" : "rotateX(") + rotationFrom + ")";
  from[transformOriginName] = origin;
  //
  to[transformName] = (rotation === "vertical" ? "rotateY(" : "rotateX(") + rotationTo + ")";
  to[transformOriginName] = origin;
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates an animation of expansion (width or height)
 * @param {Object} param - Animation params
 * @param {Client.Element} ele - Element to animate
 */
Client.ClientAnimation.expand = function (param, ele)
{
  // Get params (if not set use defaults)
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  var direction = param.expanddirection !== undefined ? param.expanddirection : "horizontal";
  var expandFrom = param.from !== undefined ? param.from : "100%";
  var expandTo = param.to !== undefined ? param.to : "100%";
  //
  // If the value is a % we must substitute with the real dimension at runtime
  var eleRootObj = ele.getRootObject();
  if (ele instanceof Client.Widget)
    eleRootObj = ele.getAnimationRoot();
  //
  // Memorize the original H and W, so if the animation must reset its value we could
  eleRootObj.setAttribute("originalH", eleRootObj.style.height);
  eleRootObj.setAttribute("originalW", eleRootObj.style.width);
  //
  if ((expandFrom.indexOf && expandFrom.indexOf("%") > 0) || (expandTo.indexOf && expandTo.indexOf("%") > 0)) {
    // For the correct calculations the object must be visible
    var oldVisibility;
    if (ele.oldDisplay !== undefined)
    {
      oldVisibility = eleRootObj.style.visibility;
      eleRootObj.style.visibility = "hidden";
      eleRootObj.style.display = ele.oldDisplay;
    }
    //
    // If the element has an 'original height' (eg: set when an exit animation triggers and memorizes the real height of the object)
    var actHeight;
    if (ele.oldExpandedHeigh !== undefined) {
      actHeight = eleRootObj.style.height;
      eleRootObj.style.height = ele.oldExpandedHeigh;
    }
    var actWidth;
    if (ele.oldExpandedWidth !== undefined) {
      actWidth = eleRootObj.style.width;
      eleRootObj.style.width = ele.oldExpandedWidth;
    }
    // Get data from computed style
    var dim = "0px";
    try {
      var so = window.getComputedStyle(eleRootObj, null);
      dim = direction === "horizontal" ? so.width : so.height;
    }
    catch (ex) {
    }
    //
    // Set the from-to dimension
    if (expandFrom.indexOf && expandFrom.indexOf("%") > 0) {
      try {
        var dimVal = parseFloat(dim, 10);
        var prc = parseFloat(expandFrom, 10);
        expandFrom = (dimVal * prc / 100) + "px";
      }
      catch (exc) {
        // 100%
        expandFrom = dim;
      }
    }
    if (expandTo.indexOf && expandTo.indexOf("%") > 0) {
      try {
        var dimVal = parseFloat(dim, 10);
        var prc = parseFloat(expandTo, 10);
        expandTo = (dimVal * prc / 100) + "px";
      }
      catch (exc) {
        // 100%
        expandTo = dim;
      }
    }
    //
    // Return the element to the correct dimension
    if (ele.oldExpandedHeigh !== undefined) {
      eleRootObj.style.height = actHeight;
      eleRootObj.style.height = actWidth;
    }
    //
    // The element must be returned to the correct status
    if (ele.oldDisplay !== undefined) {
      eleRootObj.style.visibility = oldVisibility;
      eleRootObj.style.display = "none";
    }
  }
  //
  var from = {style_width: expandFrom};
  if (direction === "vertical")
    from = {style_height: expandFrom};
  //
  var to = {style_width: expandTo};
  if (direction === "vertical")
    to = {style_height: expandTo};
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates an animation of recolor (changes backgronund color from user-set to actual)
 * @param {Object} param - Animation params
 * @param {Client.Element} ele - Element to animate
 */
Client.ClientAnimation.recolor = function (param, ele)
{
  // Get params (if not set use defaults)
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  var color = param.color !== undefined ? param.color : "#FFFFFF";
  var actColor = "#000000";
  var eleRootObj = ele.getRootObject();
  if (ele instanceof Client.Widget)
    eleRootObj = ele.getAnimationRoot();
  try {
    var so = window.getComputedStyle(eleRootObj, null);
    actColor = so.backgroundColor;
    //
    eleRootObj.setAttribute("origcolor", actColor);
  }
  catch (ex) {
  }
  //
  var from = {style_backgroundColor: color};
  var to = {style_backgroundColor: actColor};
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates an animation of generic style property change
 * @param {Object} param - Animation params
 */
Client.ClientAnimation.change = function (param)
{
  // Get params (if not set use defaults)
  var easing = param.easing !== undefined ? param.easing : "easeTo";
  var duration = param.duration !== undefined ? param.duration : 250;
  var delay = param.delay !== undefined ? param.delay : 0;
  var property = param.property !== undefined ? param.property : null;
  var propertyFrom = param.from !== undefined ? param.from : null;
  var propertyTo = param.to !== undefined ? param.to : null;
  //
  // This animation has no defaults, if the user forget a value don't animate
  if (!property || !propertyFrom || !propertyTo)
    return null;
  //
  var from = {};
  var to = {};
  from["style_" + property] = propertyFrom;
  to["style_" + property] = propertyTo;
  //
  return {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing, delay: delay}]};
};


/**
 * Creates a generic animation
 * @param {Object} param - Animation params
 */
Client.ClientAnimation.custom = function (param)
{
  var segments = param.segments !== undefined ? param.segments : null;
  //
  // This animation has no defaults, if the user forget a value don't animate
  if (!segments)
    return null;
  //
  return {repetitions: 1, segments: segments};
};

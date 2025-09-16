/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container that shows only one element at a time
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the container
 * @extends Client.Element
 */
Client.AltContainer = function (element, parent, view)
{
  Client.Container.call(this, element, parent, view);
  //
  if (element === undefined)
    return;
  //
  this.updateElement(element);
  this.attachEvents(element.events);
};


// Make Client.AltContainer extend Client.Container
Client.AltContainer.prototype = new Client.Container();

/**
 * Map of the animation status
 */
Client.AltContainer.SwipingDirection = {
  VERTICAL: 1,
  HORIZONTAL: 0
};

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.AltContainer.prototype.updateElement = function (el)
{
  Client.Container.prototype.updateElement.call(this, el);
  //
  if (el.selectedPage !== undefined && this.elements) {
    var oldSelectedPage = this.selectedPage;
    //
    // Set the selected page. 0 if no page is selected
    this.selectedPage = isNaN(parseInt(el.selectedPage)) ? 0 : parseInt(el.selectedPage);
    //
    // Base class must not use the selectedPage property
    delete el.selectedPage;
    //
    // If this is the first changepage (oldSelectedPage === undefined)  or the page is really changed apply the selection
    if (oldSelectedPage === undefined || this.selectedPage !== oldSelectedPage) {
      // Check if the element to animate are views with only a child, if have more children don't use the animation
      var useAnimation = true;
      if (this.changePageAnimation && oldSelectedPage !== undefined && (oldSelectedPage < this.ne() && this.selectedPage < this.ne())) {
        var exitElement = this.elements[oldSelectedPage];
        var enterElement = this.elements[this.selectedPage];
        if (exitElement instanceof Client.View && exitElement.ne() !== 1)
          useAnimation = false;
        if (enterElement instanceof Client.View && enterElement.ne() !== 1)
          useAnimation = false;
        if (this.parentWidget && !this.parentWidget.visible)
          useAnimation = false;
      }
      // No animation for this object
      if (this.animate === false)
        useAnimation = false;
      //
      // Use the animation if a change page animation is set AND this is not the first time that the Container is shown
      // (first opening MUST BE without animation)
      if (useAnimation && this.changePageAnimation && oldSelectedPage !== undefined && (oldSelectedPage < this.ne() && this.selectedPage < this.ne())) {
        this.animateChangePage(oldSelectedPage);
      }
      else
        this.showSelPage();
      //
      // If the selected page is changed send the message to the server
      if (this.changePage && oldSelectedPage !== this.selectedPage) {
        var e = [{obj: this.id, id: "onChangePage", content: {oldPage: oldSelectedPage, newPage: this.selectedPage}}];
        Client.mainFrame.sendEvents(e);
      }
      //
      // In editing we must get all hidden elements and try to reupdate them, they could be hidden because were
      // in a hidden page
      if (Client.mainFrame.isEditing() && oldSelectedPage !== this.selectedPage) {
        var emptyElements = this.domObj.getElementsByClassName("emptycontainer");
        for (var el = 0; el < emptyElements.length; el++) {
          var el = Client.eleMap[emptyElements.item(el).id.substring(4)];
          if (el)
            el.updateElement({});
        }
      }
    }
  }
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.AltContainer.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  Client.Container.prototype.attachEvents.call(this, events);
  //
  var pos = events.indexOf("onChangePage");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.changePage = true;
  }
};


/**
 * One of my children element has been removed
 * @param {Element} child
 */
Client.AltContainer.prototype.onRemoveChildObject = function (child)
{
  // realign the selected page index
  if (this.elements) {
    var idx = this.elements.indexOf(child);
    if (idx >= 0 && idx < this.selectedPage)
      this.selectedPage--;
    else if (idx === this.selectedPage) {
      // If removed page was the selected one, another page may have replaced it at the same position.
      // So I have to make this page visible.
      setTimeout(function () {
        if (this.elements && this.elements[this.selectedPage]) {
          let el = this.elements[this.selectedPage];
          //
          // If el is a view, the element to make visibile is its first child
          if (el instanceof Client.View && el.elements)
            el = el.elements[0];
          //
          if (el)
            el.updateElement({visible: true});
        }
      }.bind(this), 0);
    }
  }
};


/**
 * Animates a change page transition
 * @param {int} oldSelectedPage - old page
 * @param {Object} animation - the animation to play
 */
Client.AltContainer.prototype.animateChangePage = function (oldSelectedPage, animation)
{
  var anim = animation ? animation : this.changePageAnimation;
  //
  var type = anim.type;
  var duration = anim.duration !== undefined ? anim.duration : 250;
  var easing = anim.easing !== undefined ? anim.easing : "easeTo";
  //
  // Get the pages to animate
  var exitElement = this.elements[oldSelectedPage];
  var enterElement = this.elements[this.selectedPage];
  //
  if (exitElement instanceof Client.View)
    exitElement = exitElement.elements[0];
  if (enterElement instanceof Client.View)
    enterElement = enterElement.elements[0];
  //
  if (!enterElement || !exitElement)
    return;
  //
  // Remove the focused element if is contained in an animating page
  if (document.activeElement && (Client.Utils.isMyParent(document.activeElement, enterElement.id) || Client.Utils.isMyParent(document.activeElement, exitElement.id)))
    document.activeElement.blur();
  //
  // Detect direction of entering/exiting
  var enterDirection = this.selectedPage > oldSelectedPage ? "right" : "left";
  var exitDirection = this.selectedPage > oldSelectedPage ? "left" : "right";
  //
  // Check if the animation is a 'vertical' animation
  if (type === "slide" && (anim.from === "top" || anim.from === "bottom"))
    type = "vertical";
  if (type === "flip" && anim.rotation === "vertical")
    type = "vflip";
  //
  if (type === "vertical" || type === "vflip") {
    enterDirection = this.selectedPage > oldSelectedPage ? "bottom" : "top";
    exitDirection = this.selectedPage > oldSelectedPage ? "top" : "bottom";
  }
  else if (type === "parallax") {
    enterDirection = this.selectedPage > oldSelectedPage ? "left" : "right";
    exitDirection = this.selectedPage > oldSelectedPage ? "left" : "right";
  }
  else if (type === "zoomout") {
    enterDirection = this.selectedPage > oldSelectedPage ? "" : "left";
    exitDirection = this.selectedPage > oldSelectedPage ? "left" : "";
  }

  //
  // Check if there is another pageAnimation running, in that case stop that..
  // Stop with true sets the animation in the final status and calls the callback, so the pages are in the correct status
  if (this.exitingElement)
    this.exitingElement.stopAnimation(true);
  if (this.enteringElement)
    this.enteringElement.stopAnimation(true);
  //
  // For calculating the correct coordinates the pages must be visible..
  var enterRootObj = enterElement.getRootObject();
  if (enterElement instanceof Client.Widget)
    enterRootObj = enterElement.getAnimationRoot();
  //
  var oldVis = enterRootObj.style.visibility;
  var oldDisp = enterElement.oldDisplay === undefined ? "" : enterElement.oldDisplay;
  if (enterElement.oldDisplay === undefined)
    enterElement.oldDisplay = "";
  enterRootObj.style.visibility = "hidden";
  enterRootObj.style.display = oldDisp;
  //
  // Create the Enter and Exit animation
  var enterAnimation = this.createPageAnimation(enterElement, false, enterDirection, type, duration, easing);
  var exitAnimation = this.createPageAnimation(exitElement, true, exitDirection, type, duration, easing);
  //
  if (enterAnimation.skipAnimation) {
    enterRootObj.style.visibility = oldVis;
    this.showSelPage();
    return;
  }
  //
  // make the entering page hidden, its the animation that will set it visibile
  enterRootObj.style.display = "none";
  enterRootObj.style.visibility = oldVis;
  //
  // Set the callback of an animation to be called, in that callback we set the final status setting the visibility of the elements
  var pthis = this;
  enterAnimation.endcallback = function () {
    pthis.onEndChangePageAnimation();
  };
  //
  if (type === "vflip" || type === "flip")
    this.domObj.classList.add("altcontainer-flip-container");
  //
  // Call and play the animation
  this.exitingElement = exitElement;
  this.enteringElement = enterElement;
  this.exitingElement.playAnimation(exitAnimation);
  this.enteringElement.playAnimation(enterAnimation);
};


/**
 * Attach events handler
 * @param {Client.Element} element - element to animate
 * @param {boolean} exit - true if must generate an exita animation
 * @param {String} direction - direction to animate
 * @param {String} type - type of the animation
 * @param {int} duration - duration of the animation
 * @param {String} easing - easing function
 */
Client.AltContainer.prototype.createPageAnimation = function (element, exit, direction, type, duration, easing)
{
  var transformName = "style_transform";
  //
  let elementDomObj = element.getRootObject();
  if (element instanceof Client.Widget)
    elementDomObj = element.getAnimationRoot();
  //
  if (type === "slide" || type === "vertical") {
    var y = elementDomObj.offsetTop;
    var x = elementDomObj.offsetLeft;
    //
    // Consider border
    try {
      // Get data from computed style
      var so = window.getComputedStyle(elementDomObj, null);
      y -= parseInt(so.borderTopWidth);
      x -= parseInt(so.borderLeftWidth);
    }
    catch (ex) {
    }
    //
    var w = elementDomObj.parentNode ? elementDomObj.parentNode.offsetWidth : elementDomObj.offsetWidth;
    var h = elementDomObj.parentNode ? elementDomObj.parentNode.offsetHeight : elementDomObj.offsetHeight;
    //
    // If the offsetParent is not the parentNode then must remove from y the parent OffsetTop
    if (elementDomObj.parentNode && (y > 0 || x > 0) && elementDomObj.offsetParent !== elementDomObj.parentNode) {
      y = y - elementDomObj.parentNode.offsetTop;
      x = x - elementDomObj.parentNode.offsetLeft;
      //
      try {
        // Get data from computed style
        var so = window.getComputedStyle(elementDomObj.parentNode, null);
        y -= parseInt(so.borderTopWidth);
        x -= parseInt(so.borderLeftWidth);
        w = w - parseInt(so.borderRightWidth) - parseInt(so.borderLeftWidth);
        h = h - parseInt(so.borderTopWidth) - parseInt(so.borderBottomWidth);
      }
      catch (ex) {
      }
    }
    //
    var from = {};
    var to = {};
    from[transformName] = (type === "vertical" ? "translate3d(-" + x + "px, -" + y + "px, 0px)" : "translate3d(0px, -" + y + "px, 0px)");
    to[transformName] = (type === "vertical" ? "translate3d(-" + x + "px, -" + y + "px, 0px)" : "translate3d(0px, -" + y + "px, 0px)");
    //
    switch (direction) {
      case "top" :
        var t = 0 - y - h;
        if (!exit)
          from[transformName] = "translate3d(0px, " + t + "px, 0px)";
        else
          to[transformName] = "translate3d(0px, " + t + "px, 0px)";
        break;

      case "bottom" :
        if (!exit)
          from[transformName] = "translate3d(0px, " + (h - y) + "px, 0px)";
        else
          to[transformName] = "translate3d(0px, " + (h - y) + "px, 0px)";
        break;

      case "left" :
        var l = 0 - x - w;
        if (!exit)
          from[transformName] = "translate3d(" + l + "px, -" + y + "px, 0px)";
        else
          to[transformName] = "translate3d(" + l + "px, -" + y + "px, 0px)";
        break;

      case "right" :
        if (!exit)
          from[transformName] = "translate3d(" + (w - x) + "px, -" + y + "px, 0px)";
        else
          to[transformName] = "translate3d(" + (w - x) + "px, -" + y + "px, 0px)";
        break;
    }
    //
    var anim = {repetitions: 1, segments: [{from: from, to: to, duration: duration, easing: easing}]};
    anim.finalState = {};
    anim.finalState[transformName] = "translate3d(0px, 0px, 0px)";
    //
    // If we had to render the item 'visible' also the animation must do it.. but after setting the first state
    if (element.oldDisplay !== undefined)
      anim.startingState = {style_display: element.oldDisplay};
    //
    if (from[transformName] === to[transformName])
      anim.skipAnimation = true;
    //
    return anim;
  }
  else if (type === "flip" || type === "vflip") {  // Flip Animation
    // Even on Safari 11 we need webkit here
    var startingState = Client.mainFrame.device.browserName === "Safari" ? {style_webkitBackfaceVisibility: "hidden", style_webkitTransformStyle: "preserve-3d"} : {style_backfaceVisibility: "hidden", style_transformStyle: "preserve-3d"};
    if (element.oldDisplay !== undefined)
      startingState.style_display = element.oldDisplay;
    //
    // The pages must be overlapping, so we need a translate3d x/y to overlap them
    var translate = this.getTranslateOverlap(element);
    //
    // Calculate from rotation
    var from = {};
    var to = {};
    //
    if (!exit) {
      // ENTERING PAGE - STARTS FLIPPED
      if (type === "vflip") {
        from[transformName] = translate + (direction === "top" ? "rotateX(180deg)" : "rotateX(-180deg)");
        to[transformName] = translate + "rotateX(0deg)";
      }
      else {
        from[transformName] = translate + (direction === "left" ? "rotateY(-180deg)" : "rotateY(180deg)");
        to[transformName] = translate + "rotateY(0deg)";
      }
    }
    else {
      // EXITING PAGE - STARTS VISIBLE
      if (type === "vflip") {
        from[transformName] = translate + "rotateX(0deg)";
        to[transformName] = translate + (direction === "top" ? "rotateX(180deg)" : "rotateX(-180deg)");
      }
      else {
        from[transformName] = translate + "rotateY(0deg)";
        to[transformName] = translate + (direction === "left" ? "rotateY(-180deg)" : "rotateY(180deg)");
      }
    }
    //
    startingState[transformName] = from[transformName];
    var anim = {repetitions: 1, startingState: startingState, finalState: {}, segments: [{from: from, to: to, duration: duration, easing: easing}]};
    anim.finalState[transformName] = "translate3d(0px, 0px, 0px)";
    //
    return anim;
  }
  else if (type === "parallax") {
    var startingState = {};
    if (element.oldDisplay !== undefined)
      startingState.style_display = element.oldDisplay;
    //
    var from = {};
    var to = {};
    if (direction === "left") {
      if (exit) {
        // Animation of the old page, it has a lower index than the new one and it's exiting
        to [transformName] = "translate3d(-33%, 0px, 0px)";
        from[transformName] = "translate3d(0px, 0px, 0px)";
        //
        to.style_opacity = "1";
        from.style_opacity = "0.9";
        //
        to.style_filter = "brightness(90%)";
        from.style_filter = "brightness(100%)";
      }
      else {
        // Animation of the new page, it has a higher index than the old one and it's entering
        var coord = this.calculateCoord(elementDomObj);
        to[transformName] = "translate3d(0%, -" + coord.y + "px, 0px)";
        from[transformName] = "translate3d(" + coord.w + "px, -" + coord.y + "px, 0px)";
        //
        elementDomObj.classList.add("altcontainer-parallax-page");
        //
        var scrollbar = this.hasScrollBars(elementDomObj.parentNode, "X");
        if (!scrollbar) {
          var of = elementDomObj.parentNode.style.overflow;
          if (of !== "hidden")
          {
            this.divOverflow = of;
            elementDomObj.parentNode.style.overflow = "hidden";
          }
        }
      }
    }
    else if (direction === "right") {
      if (exit) {
        // Animation of the old page, it has a higher index than the new one and it's exiting
        var coord = this.calculateCoord(elementDomObj);
        to [transformName] = "translate3d(" + coord.w + "px, -" + coord.y + "px, 0px)";
        from[transformName] = "translate3d(0%, -" + coord.y + "px, 0px)";
        //
        to.style_opacity = "0.9";
        from.style_opacity = "1";
        //
        elementDomObj.classList.add("altcontainer-parallax-page");
        //
        var scrollbar = this.hasScrollBars(elementDomObj.parentNode, "X");
        if (!scrollbar) {
          var of = elementDomObj.parentNode.style.overflow;
          if (of !== "hidden")
          {
            this.divOverflow = of;
            elementDomObj.parentNode.style.overflow = "hidden";
          }
        }
      }
      else {
        // Animation of the new page, it has a lower index than the old one and it's entering
        to [transformName] = "translate3d(0px, 0px, 0px)";
        from[transformName] = "translate3d(-33%, 0px, 0px)";
        //
        to.style_filter = "brightness(100%)";
        from.style_filter = "brightness(90%)";
      }
    }
    startingState[transformName] = from[transformName];
    startingState.style_opacity = from.style_opacity;
    var anim = {repetitions: 1, startingState: startingState, finalState: {}, segments: [{from: from, to: to, duration: duration, easing: easing}]};
    anim.finalState.style_opacity = "";
    anim.finalState.style_filter = "";
    //
    return anim;
  }
  else if (type === "zoomout") {
    var startingState = {};
    if (element.oldDisplay !== undefined)
      startingState.style_display = element.oldDisplay;
    //
    var from = {};
    var to = {};
    var so = window.getComputedStyle(elementDomObj, null);
    if (exit) {
      if (direction === "left") {
        // slide
        to [transformName] = "translate3d(-100%, 0px, 0px)";
        from[transformName] = "translate3d(0px, 0px, 0px)";
        //
        if (so.position !== "absolute")
          elementDomObj.style.position = "relative";
        elementDomObj.style.zIndex = "1";
      }
      else {
        // zoomout
        var y = 0;
        if (so.position !== "absolute")
        {
          var coord = this.calculateCoord(elementDomObj);
          y = coord.y;
        }
        from [transformName] = "translate3d(0%, -" + y + "px, 0px)";
        to[transformName] = "translate3d(0%, -" + y + "px, 0px) scale(0.8)";
        //
        to.style_opacity = "0.9";
        from.style_opacity = "1";
        //
        to.style_filter = "brightness(90%)";
        from.style_filter = "brightness(100%)";
        //
        if (so.position !== "absolute")
          elementDomObj.style.position = "relative";
        elementDomObj.style.zIndex = "0";
      }
    }
    else {
      if (direction === "left") {
        // slide
        to [transformName] = "translate3d(0%, 0px, 0px)";
        from[transformName] = "translate3d(-100%, 0px, 0px)";
        //
        if (so.position !== "absolute")
          elementDomObj.style.position = "relative";
        elementDomObj.style.zIndex = "1";
      }
      else {
        // zoomin
        var y = 0;
        if (so.position !== "absolute")
        {
          var coord = this.calculateCoord(elementDomObj);
          y = coord.y;
        }
        to [transformName] = "translate3d(0%, -" + y + "px, 0px)";
        from[transformName] = "translate3d(0%, -" + y + "px, 0px) scale(0.8)";
        //
        to.style_opacity = "1";
        from.style_opacity = "0.9";
        //
        to.style_filter = "brightness(100%)";
        from.style_filter = "brightness(90%)";
        //
        if (so.position !== "absolute")
          elementDomObj.style.position = "relative";
        elementDomObj.style.zIndex = "0";
      }
    }
    //
    startingState[transformName] = from[transformName];
    startingState.style_opacity = from.style_opacity;
    var anim = {repetitions: 1, startingState: startingState, finalState: {}, segments: [{from: from, to: to, duration: duration, easing: easing}]};
    anim.finalState.style_opacity = "";
    anim.finalState.style_filter = "";
    //
    return anim;
  }
  else {  // FADE animation
    var startingState = {};
    if (element.oldDisplay !== undefined)
      startingState.style_display = element.oldDisplay;
    //
    // The pages must be overlapping, so we need a translate3d x/y to overlap them
    var translate = this.getTranslateOverlap(element);
    //
    // Calculate from opacity
    var from = {};
    var to = {};
    from[transformName] = translate;
    to[transformName] = translate;
    //
    if (exit) {
      from.style_opacity = "1";
      to.style_opacity = "0";
    }
    else {
      from.style_opacity = "0";
      to.style_opacity = "1";
    }
    //
    startingState[transformName] = from[transformName];
    startingState.style_opacity = from.style_opacity;
    var anim = {repetitions: 1, startingState: startingState, finalState: {}, segments: [{from: from, to: to, duration: duration, easing: easing}]};
    anim.finalState[transformName] = "translate3d(0px, 0px, 0px)";
    anim.finalState.style_opacity = "";
    //
    return anim;
  }
};


/*
 * Callback called when an animation of change page is finished
 */
Client.AltContainer.prototype.onEndChangePageAnimation = function ()
{
  if (this.exitingElement) {
    let exitEl = this.exitingElement.getRootObject();
    if (this.exitingElement instanceof Client.Widget)
      exitEl = this.exitingElement.getAnimationRoot();
    //
    exitEl.classList.remove("altcontainer-parallax-page");
    if (this.divOverflow !== undefined && exitEl.parentNode)
      exitEl.parentNode.style.overflow = this.divOverflow;
    //
    this.exitingElement.updateElement({fromanim: true, visible: false});
    exitEl.style["transform"] = "";
    this.exitingElement = null;
  }
  if (this.enteringElement) {
    let enterEl = this.enteringElement.getRootObject();
    if (this.enteringElement instanceof Client.Widget)
      enterEl = this.enteringElement.getAnimationRoot();
    //
    enterEl.classList.remove("altcontainer-parallax-page");
    if (this.divOverflow !== undefined && enterEl.parentNode)
      enterEl.parentNode.style.overflow = this.divOverflow;
    //
    this.enteringElement.updateElement({fromanim: true, visible: true});
    enterEl.style["transform"] = "";
    this.enteringElement = null;
  }
  //
  this.domObj.classList.remove("altcontainer-flip-container");
  delete this.divOverflow;
  //
  // Call the event (with the correct id)
  this.onEndAnimation(0, true, false, this.changePageAnimation.id);
};


/**
 * Adds an animation with a change trigger
 * @param {Object} animation - animation definition object
 */
Client.AltContainer.prototype.addChangeTrigger = function (animation)
{
  // Memorize that the changePage must use the animation
  if (!this.changePageAnimation)
    this.changePageAnimation = animation;
};


/**
 * Function called when a condition must trigger the animations
 * @param {MouseEvent} ev -
 * @param {String} trigger - trigger that has been fired
 */
Client.AltContainer.prototype.onAnimationTrigger = function (ev, trigger)
{
  // No animation for this object
  if (this.animate === false)
    return;
  //
  var handled = false;
  if (trigger === "mouseover" || trigger === "mouseout") {
    for (var a = 0; a < this.animations.length; a++) {
      // Check if this animation must be triggered
      if (this.animations[a].trigger === "hover" && this.animations[a].type === "flip") {
        handled = true;
        var def = this.animations[a];
        //
        if (!this.elements)
          return;
        //
        // Check if the target and the related target are children of this object
        // Trying to emulate the onMouseEnter event that is implemented only in IE
        var isTargetIn = false;
        var isRelatedOut = true;
        var el = ev.target;
        while (el)
        {
          if (el === this.domObj) {
            isTargetIn = true;
            break;
          }
          el = el.parentNode;
        }
        //
        el = ev.relatedTarget;
        while (el)
        {
          if (el === this.domObj) {
            isRelatedOut = false;
            break;
          }
          el = el.parentNode;
        }
        //
        // Change page only if coming from an outside element
        if (isTargetIn && isRelatedOut) {
          var pg = (trigger === "mouseover" ? this.selectedPage + 1 : this.selectedPage - 1);
          if (pg >= this.ne() || pg < 0)
            return;
          this.changePageAnimation = def;
          this.updateElement({selectedPage: pg});
        }
      }
    }
  }
  //
  // If the animation is not handled by the AltContainer pass the event to the base class
  if (!handled)
    Client.Container.prototype.onAnimationTrigger.call(this, ev, trigger);
};


/**
 * Add to this element an animation definition
 * @param {Array} animationsList - array of animations
 */
Client.AltContainer.prototype.attachAnimations = function (animationsList)
{
  // Call the base class
  Client.Container.prototype.attachAnimations.call(this, animationsList);
  //
  // Now search if there is a 'specific' animation for this object
  for (var i = 0; i < this.animations.length; i++) {
    var def = this.animations[i];
    //
    if (def.trigger === "swipe") {
      // Wich direction are we interested in?
      this.SwipeDetectDirection = (def.from === "top" || def.from === "bottom" ? Client.AltContainer.SwipingDirection.VERTICAL : Client.AltContainer.SwipingDirection.HORIZONTAL);
      //
      // Get the global hammer instance
      var hammer = Client.mainFrame.getHammerManager();
      //
      // Create the pan recognizer
      if (!hammer.get("pan")) {
        var recognizer = new Hammer.Pan({direction: this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL ? Hammer.DIRECTION_HORIZONTAL : Hammer.DIRECTION_VERTICAL});
        hammer.add(recognizer);
      }
      //
      // Create the functions
      var pthis = this;
      this.isPanning = false;
      this.panDetected = function (ev) {
        if (def.type === "parallax" || def.type === "zoomout") {
          // If the pan has already started there's nothing to do
          if (pthis.isPanning)
            return;
          //
          pthis.isPanning = true;
          //
          // Find the page to show
          var oldPage = undefined;
          var newPage;
          if (ev.direction === Hammer.DIRECTION_RIGHT) {
            oldPage = pthis.selectedPage;
            newPage = pthis.selectedPage - 1 < 0 ? undefined : pthis.selectedPage - 1;
          }
          else if (ev.direction === Hammer.DIRECTION_LEFT) {
            oldPage = pthis.selectedPage;
            newPage = pthis.selectedPage + 1 >= pthis.elements.length ? undefined : pthis.selectedPage + 1;
          }
          //
          // Start animation
          if (newPage !== undefined) {
            pthis.selectedPage = newPage;
            pthis.animateChangePage(oldPage, def);
          }
        }
        else
        {
          // Pan on children of this container
          var obj = ev.target;
          while (obj) {
            if (obj.id === pthis.id) {
              pthis.panOnPage(ev);
              break;
            }
            obj = obj.parentNode;
          }
        }
      };
      this.panEndDetected = function (ev) {
        delete pthis.isPanning;
        pthis.panEndOnPage(ev);
      };
      //
      // Add the pan events
      hammer.on("pan", this.panDetected);
      hammer.on("panend", this.panEndDetected);
    }
  }
};


/**
 * Prepare the pages for a swipe-slide animation
 * @param {HammerEvent} ev
 */
Client.AltContainer.prototype.preparePageSwipe = function (ev)
{
  this.swipeDetected = true;
  //
  // Select next page using the swipe direction (going nextwards or backwards)
  if (ev.direction === Hammer.DIRECTION_LEFT || ev.direction === Hammer.DIRECTION_UP) {
    // Forward navigation
    this.swipePageDestination = this.selectedPage + 1;
    if (this.swipePageDestination >= this.ne())
      this.swipePageDestination = undefined;
  }
  if (ev.direction === Hammer.DIRECTION_RIGHT || ev.direction === Hammer.DIRECTION_DOWN) {
    // Backward navigation
    this.swipePageDestination = this.selectedPage - 1;
    if (this.swipePageDestination < 0)
      this.swipePageDestination = undefined;
  }
  var transformName = "transform";
  //
  let curRootObj = currentPage.getRootObject();
  if (currentPage instanceof Client.Widget)
    curRootObj = currentPage.getAnimationRoot();
  //
  // If there is a newPage to swipe make it visible
  if (this.swipePageDestination !== undefined && this.elements) {
    // Make the page visible
    var nextPage = this.elements[this.swipePageDestination];
    var currentPage = this.elements[this.selectedPage];
    //
    var nextRootObj = nextPage.getRootObject();
    if (nextPage instanceof Client.Widget)
      nextRootObj = nextPage.getAnimationRoot();
    //
    var oldVisibility = null;
    if (nextRootObj.style.display === "none") {
      oldVisibility = nextRootObj.style.visibility;
      nextRootObj.style.visibility = "hidden";
      nextRootObj.style.display = nextPage.oldDisplay;
      nextPage.visible = true;
    }
    //
    // The pages must be overlapped, to obtain this:
    // - if this container has a 'static' position make him relative
    // - add classes that make the pages position absolute
    var pos = "static";
    try {
      var so = window.getComputedStyle(this.domObj, null);
      pos = so.position;
    }
    catch (ex) {
    }
    if (pos === "static")
      this.domObj.classList.add("altcontainer-swiping-page-container");
    nextRootObj.classList.add("altcontainer-swiping-page");
    curRootObj.classList.add("altcontainer-swiping-page");
    //
    // Position the moving page using translate 3d
    var dim = this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL ? this.domObj.offsetWidth : this.domObj.offsetHeight;
    this.swipePageTransform = this.swipePageDestination > this.selectedPage ? dim : -dim;
    this.currentPageTransform = 0;
    if (this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL) {
      nextRootObj.style[transformName] = "translate3d(" + this.swipePageTransform + "px, 0px, 0px)";
      curRootObj.style[transformName] = "translate3d(" + this.currentPageTransform + "px, 0px, 0px)";
    }
    else {
      nextRootObj.style[transformName] = "translate3d(0px, " + this.swipePageTransform + "px, 0px)";
      curRootObj.style[transformName] = "translate3d(0px, " + this.currentPageTransform + "px, 0px)";
    }
    //
    // Show the next page (now out of the altContainer area)
    if (oldVisibility !== null)
      nextRootObj.style.visibility = oldVisibility;
  }
  else {
    this.currentPageTransform = 0;
    var currentPage = this.elements[this.selectedPage];
    if (this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL)
      curRootObj.style[transformName] = "translate3d(" + this.currentPageTransform + "px, 0px, 0px)";
    else
      curRootObj.style[transformName] = "translate3d(0px, " + this.currentPageTransform + "px, 0px)";
  }
};

/**
 * Move the item on pan
 * @param {MouseEvent} ev
 */
Client.AltContainer.prototype.panOnPage = function (ev)
{
  // Check if we are interested in this swipe
  if ((ev.direction === Hammer.DIRECTION_LEFT || ev.direction === Hammer.DIRECTION_RIGHT) && this.SwipeDetectDirection !== Client.AltContainer.SwipingDirection.HORIZONTAL)
    return;
  if ((ev.direction === Hammer.DIRECTION_UP || ev.direction === Hammer.DIRECTION_DOWN) && this.SwipeDetectDirection !== Client.AltContainer.SwipingDirection.VERTICAL)
    return;
  //
  // Non pan accepted when completing the animation
  if (this.endingSwipeAnimation)
    return;
  //
  // No pages
  if (!this.elements)
    return;
  //
  // Beginning of a swipe, prepare the pages
  if (!this.swipeDetected)
    this.preparePageSwipe(ev);
  //
  // Get the next page (if any) and the current
  var nextPage = this.swipePageDestination !== undefined ? this.elements[this.swipePageDestination] : null;
  var currentPage = this.elements[this.selectedPage];
  //
  // Apply the distance to the coordinates, considering if going to the next page or to the prev page
  var nextPageTrans = this.swipePageTransform + ev.deltaX;
  var currentPageTrans = this.currentPageTransform + ev.deltaX;
  if (this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.VERTICAL) {
    nextPageTrans = this.swipePageTransform + ev.deltaY;
    currentPageTrans = this.currentPageTransform + ev.deltaY;
  }
  //
  // If not nextpage use the distance / 2
  if (!nextPage) {
    if (this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL)
      currentPageTrans = this.currentPageTransform + Math.floor(ev.deltaX / 2);
    else
      currentPageTrans = this.currentPageTransform + Math.floor(ev.deltaY / 2);
  }
  //
  // Check limits
  var dim = this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL ? this.domObj.offsetWidth : this.domObj.offsetHeight;
  if (nextPage) {
    if (this.swipePageDestination > this.selectedPage) {
      // Moving Forward between pages
      // If moving to the Left stop when the Next page is at 10% of the space
      if (ev.direction === Hammer.DIRECTION_LEFT || ev.direction === Hammer.DIRECTION_UP) {
        if (nextPageTrans < (0 - dim / 10)) {
          nextPageTrans = Math.floor(0 - dim / 10);
          currentPageTrans = Math.floor(0 - dim - dim / 10);
        }
      }
      //
      // The current Page must be at max at the 10% left
      if (currentPageTrans > dim / 10) {
        currentPageTrans = Math.floor(dim / 10);
        if (nextPage)
          nextPageTrans = Math.floor(dim + dim / 10);
      }
    }
    else {
      // Moving Backward between pages
      // If moving to the Left stop when the current page is at 10% of the space
      if (ev.direction === Hammer.DIRECTION_LEFT || ev.direction === Hammer.DIRECTION_UP) {
        if (currentPageTrans < dim / 10) {
          currentPageTrans = Math.floor(0 - dim / 10);
          nextPageTrans = Math.floor(0 - dim - dim / 10);
        }
      }
      //
      // The next page must be at max at the 10% left
      if (nextPageTrans > dim / 10) {
        nextPageTrans = Math.floor(dim / 10);
        currentPageTrans = Math.floor(dim + dim / 10);
      }
    }
  }
  //
  // Apply the transformation
  var transformName = "transform";
  let nextPageEl = nextPage?.getRootObject();
  let curPageEl = currentPage?.getRootObject();
  if (nextPage instanceof Client.Widget)
    nextPageEl = nextPage.getAnimationRoot();
  if (currentPage instanceof Client.Widget)
    curPageEl = currentPage.getAnimationRoot();
  //
  if (this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL) {
    if (nextPageEl)
      nextPageEl.style[transformName] = "translate3d(" + nextPageTrans + "px, 0px, 0px)";
    curPageEl.style[transformName] = "translate3d(" + currentPageTrans + "px, 0px, 0px)";
  }
  else {
    if (nextPageEl)
      nextPageEl.style[transformName] = "translate3d(0px, " + nextPageTrans + "px, 0px)";
    curPageEl.style[transformName] = "translate3d(0px, " + currentPageTrans + "px, 0px)";
  }
};


/**
 * Event raised when the pan ends
 * @param {MouseEvent} ev
 */
Client.AltContainer.prototype.panEndOnPage = function (ev)
{
  if (!this.swipeDetected)
    return;
  if (!this.elements)
    return;
  //
  // Create the end transition handler
  var pthis = this;
  if (!this.endTransition)
    this.endTransition = function (ev) {
      pthis.onEndSwipeAnimation(ev);
    };
  //
  var nextPage = this.swipePageDestination !== undefined ? this.elements[this.swipePageDestination] : null;
  var currentPage = this.elements[this.selectedPage];
  //
  let nextRootObj = nextPage?.getRootObject();
  let curRootObj = currentPage?.getRootObject();
  if (nextPage instanceof Client.Widget)
    nextRootObj = nextPage.getAnimationRoot();
  if (currentPage instanceof Client.Widget)
    curRootObj = currentPage.getAnimationRoot();
  //
  // Detect to wich page we must move
  var transformName = "transform";
  var dim = this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL ? this.domObj.offsetWidth : this.domObj.offsetHeight;
  if (nextPage) {
    var targetNextPagePosition = 0;
    var targetCurrentPagePosition = 0;
    //
    // Go to the next page if the distance is > of the 20%
    if (ev.distance > (dim / 10) * 2) {
      // Go to the next page
      // The next page is on the right or bottom
      if (this.swipePageDestination > this.selectedPage)
        targetCurrentPagePosition = -dim;
      else  // The next page is on the left or top
        targetCurrentPagePosition = dim;
    }
    else {
      // Return to the current page
      // The next page is on the right or bottom
      if (this.swipePageDestination > this.selectedPage)
        targetNextPagePosition = dim;
      else  // The next page is on the left or top
        targetNextPagePosition = -dim;
    }
    //
    nextRootObj.classList.add("altcontainer-swipe-animation");
    curRootObj.classList.add("altcontainer-swipe-animation");
    //
    // Add the end animation handler
    var eventN = "transitionend";
    nextRootObj.addEventListener(eventN, this.endTransition);
    //
    // Start the animation
    this.endingSwipeAnimation = true;
    if (ev.distance < (dim / 10) * 2)
      this.swipeUndo = true;
    if (this.SwipeDetectDirection === Client.AltContainer.SwipingDirection.HORIZONTAL) {
      nextRootObj.style[transformName] = "translate3d(" + targetNextPagePosition + "px, 0px, 0px)";
      curRootObj.style[transformName] = "translate3d(" + targetCurrentPagePosition + "px, 0px, 0px)";
    }
    else {
      nextRootObj.style[transformName] = "translate3d(0px, " + targetNextPagePosition + "px, 0px)";
      curRootObj.style[transformName] = "translate3d(0px, " + targetCurrentPagePosition + "px, 0px)";
    }
  }
  else {
    // Return to current page
    curRootObj.classList.add("altcontainer-swipe-animation");
    //
    // Add the end animation handler
    var eventN = "transitionend";
    var pthis = this;
    curRootObj.addEventListener(eventN, this.endTransition);
    //
    // Start the animation
    this.endingSwipeAnimation = true;
    curRootObj.style[transformName] = "translate3d(0px, 0px, 0px)";
  }
};

/**
 * Event raised when the pan animation ends
 * @param {MouseEvent} ev
 */
Client.AltContainer.prototype.onEndSwipeAnimation = function (ev)
{
  if (!this.elements)
    return;
  //
  // Set the final visibility of the pages
  var nextPage = null;
  var currentPage = this.elements[this.selectedPage];
  if (this.swipePageDestination !== undefined) {
    nextPage = this.elements[this.swipePageDestination];
    nextPage.updateElement({visible: this.swipeUndo ? false : true});
    currentPage.updateElement({visible: this.swipeUndo ? true : false});
    //
    if (!this.swipeUndo) {
      var oldPage = this.selectedPage;
      this.selectedPage = this.swipePageDestination;
      //
      // The server must be alerted of the new selected page
      var e = [];
      e.push({obj: this.id, id: "chgProp", content: {name: "selectedPage", value: this.selectedPage, clid: Client.id}});
      e.push({obj: this.id, id: "onChangePage", content: {oldPage: oldPage, newPage: this.selectedPage}});
      Client.mainFrame.sendEvents(e);
    }
  }
  //
  // Remove the classes from the pages and the container
  var eventN = Client.mainFrame.device.browserName === "IE" ? "transitionend" : "webkitTransitionEnd";
  this.domObj.classList.remove("altcontainer-swiping-page-container");
  if (nextPage) {
    var nextDomObj = nextPage.getRootObject();
    if (nextPage instanceof Client.Widget)
      nextDomObj = nextPage.getAnimationRoot();
    nextDomObj.classList.remove("altcontainer-swiping-page");
    nextDomObj.classList.remove("altcontainer-swipe-animation");
    nextDomObj.style.transform = "";
    nextDomObj.removeEventListener(eventN, this.endTransition);
  }
  var curDomObj = currentPage.getRootObject();
  if (currentPage instanceof Client.Widget)
    curDomObj = currentPage.getAnimationRoot();
  curDomObj.classList.remove("altcontainer-swiping-page");
  curDomObj.classList.remove("altcontainer-swipe-animation");
  curDomObj.style.transform = "";
  curDomObj.removeEventListener(eventN, this.endTransition);
  //
  // Clear global variables
  this.endingSwipeAnimation = false;
  this.swipeDetected = false;
  delete this.swipePageDestination;
  this.swipePageTransform = null;
  this.currentPageTransform = null;
  delete this.swipeUndo;
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of removing
 */
Client.AltContainer.prototype.close = function (firstLevel, triggerAnimation)
{
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
  //
  // Detach hammer function
  if (this.panDetected) {
    Client.mainFrame.getHammerManager().off("pan", this.panDetected);
    this.panDetected = null;
  }
  if (this.panEndDetected) {
    Client.mainFrame.getHammerManager().off("panend", this.panEndDetected);
    this.panEndDetected = null;
  }
};


/**
 * Insert the new element and make it not visible.
 * @param {Object} content - contains the element to insert and the id of the existing element. The new element is inserted before this element
 */
Client.AltContainer.prototype.insertBefore = function (content)
{
  // If the element inserted is before the selectedPage we must increase the selectedIndex
  if (content.sib) {
    for (var ix = 0; ix < this.ne(); ix++) {
      if (this.elements[ix].id === content.sib && ix <= this.selectedPage) {
        // The server must be alerted of the new selected page
        this.selectedPage++;
        var e = [];
        e.push({obj: this.id, id: "chgProp", content: {name: "selectedPage", value: this.selectedPage, clid: Client.id}});
        Client.mainFrame.sendEvents(e);
        break;
      }
    }
  }
  //
  var elem = Client.Container.prototype.insertBefore.call(this, content);
  //
  // If it's an Element (check if the element was created, if the requisites were not met the element creation could be postponed)
  if (elem) {
    if (elem.updateElement)
      elem.updateElement({visible: false});
    else if (elem.elements) {
      // If it's a View and it has children
      for (var i = 0; i < elem.ne(); i++) {
        if (elem.elements[i].visible)
          elem.elements[i].tabHidden = true;
        elem.elements[i].updateElement({visible: false});
      }
    }
  }
  return elem;
};


/**
 * Get the transform function that will get a page to the 0 top posizion (overlapping pages, for fade or flip changing)
 * @param {Element} elementt - page to get to the top
 */
Client.AltContainer.prototype.getTranslateOverlap = function (element)
{
  var elementDomObj = element.getRootObject();
  if (element instanceof Client.Widget)
    elementDomObj = element.getAnimationRoot();
  //
  var y = elementDomObj.offsetTop;
  var x = elementDomObj.offsetLeft;
  //
  // Consider border
  try {
    // Get data from computed style
    var so = window.getComputedStyle(elementDomObj, null);
    y -= parseInt(so.borderTopWidth);
    x -= parseInt(so.borderLeftWidth);
  }
  catch (ex) {
  }
  //
  // If the offsetParent is not the parentNode then must remove from y the parent OffsetTop
  if (elementDomObj.parentNode && (y > 0 || x > 0) && elementDomObj.offsetParent !== elementDomObj.parentNode) {
    y = y - elementDomObj.parentNode.offsetTop;
    x = x - elementDomObj.parentNode.offsetLeft;
    //
    try {
      // Get data from computed style
      var so = window.getComputedStyle(elementDomObj.parentNode, null);
      y -= parseInt(so.borderTopWidth);
      x -= parseInt(so.borderLeftWidth);
    }
    catch (ex) {
    }
  }
  return "translate3d(-" + x + "px, -" + y + "px, 0px) ";
};


/**
 * Calculate the coordinates, the width and the height of the element
 * @param {HTMLElement} elementDomObj
 * @returns {Object}
 */
Client.AltContainer.prototype.calculateCoord = function (elementDomObj)
{
  var y = elementDomObj.offsetTop;
  var x = elementDomObj.offsetLeft;
  //
  // Consider border
  try {
    // Get data from computed style
    var so = window.getComputedStyle(elementDomObj, null);
    y -= parseInt(so.borderTopWidth);
    x -= parseInt(so.borderLeftWidth);
  }
  catch (ex) {
  }
  //
  var w = elementDomObj.offsetWidth;
  var h = elementDomObj.offsetHeight;
  //
  // If the offsetParent is not the parentNode then must remove from y the parent OffsetTop
  if (elementDomObj.parentNode && (y > 0 || x > 0) && elementDomObj.offsetParent !== elementDomObj.parentNode) {
    y = y - elementDomObj.parentNode.offsetTop;
    x = x - elementDomObj.parentNode.offsetLeft;
    //
    try {
      // Get data from computed style
      var so = window.getComputedStyle(elementDomObj.parentNode, null);
      y -= parseInt(so.borderTopWidth);
      x -= parseInt(so.borderLeftWidth);
      w = w - parseInt(so.borderRightWidth) - parseInt(so.borderLeftWidth);
      h = h - parseInt(so.borderTopWidth) - parseInt(so.borderBottomWidth);
    }
    catch (ex) {
    }
  }
  return {x: x, y: y, w: w, h: h};
};


/**
 * Return true if scrollbars are visible
 * @param {HTMLElement} domNode - the element that displays scrollbars
 * @param {String} dimension - X to check for horizontal scrollbars, Y to check for vertical scroolbars
 * @returns {Boolean}
 */
Client.AltContainer.prototype.hasScrollBars = function (domNode, dimension) {
  dimension = dimension.toUpperCase();
  if (dimension === 'Y')
    var length = 'Height';
  else if (dimension === 'X')
    var length = 'Width';
  //
  var scrollLength = 'scroll' + length;
  var clientLength = 'client' + length;
  var overflowDimension = 'overflow' + dimension;
  var hasVScroll = domNode[scrollLength] > domNode[clientLength];
  //
  // Check the overflow and overflowY properties for "auto" and "visible" values
  var cStyle = getComputedStyle(domNode);
  return hasVScroll && (cStyle[overflowDimension] === "visible" || cStyle[overflowDimension] === "auto") || cStyle[overflowDimension] === "scroll";
};


/**
 * Sets visible the selected page and hides all the others
 */
Client.AltContainer.prototype.showSelPage = function () 
{
  // Make not selected pages invisible
  for (var c = 0; c < this.ne(); c++) {
    var el = this.elements[c];
    //
    // If the selected page is a view, make invisible its children
    if (el instanceof Client.View) {
      for (var i = 0; i < el.ne(); i++) {
        var child = el.elements[i];
        if (c === this.selectedPage) {
          // Must show the element, but only if is hidden by the change page action
          if (child.tabHidden && !child.visible)
            child.updateElement({visible: true});
          delete child.tabHidden;
        }
        else if (c !== this.selectedPage && child.visible) {
          // Must hide the element, but only if it's visibile
          child.updateElement({visible: false});
          child.tabHidden = true;
        }
      }
    }
    else
      this.elements[c].updateElement({visible: c === this.selectedPage});
  }
};

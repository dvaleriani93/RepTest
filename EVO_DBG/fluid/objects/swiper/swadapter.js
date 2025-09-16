/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A round progressbar element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the progress bar
 */
Client.Swiper = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("div");
  this.domObj.className = "swiper-container";
  this.wrapObj = document.createElement("div");
  this.wrapObj.className = "swiper-wrapper";
  //
  this.domObj.appendChild(this.wrapObj);
  //
  this.createChildren(element);
  //
  parent.appendChildObject(this, this.domObj);
  //
  this.parameters = {};
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  this.initSwiper();
};

// Make Client.Swiper extend Client.Element
Client.Swiper.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Swiper.prototype.updateElement = function (el)
{
  this.purgeMyProp(el);
  //
  if (el.options) {
    if (typeof el.options === "string")
      el.options = JSON.parse(el.options);
    this.parameters = el.options;
    delete el.options;
  }
  //
  if (el.className) {
    this.domObj.className = "swiper-container " + el.className;
    delete el.className;
  }
  //
  if (el.navigation !== undefined) {
    if (el.navigation) {
      if (!this.navPrev) {
        this.navPrev = document.createElement("div");
        this.navPrev.className = "swiper-button-prev";
        this.navNext = document.createElement("div");
        this.navNext.className = "swiper-button-next";
        this.domObj.appendChild(this.navNext);
        this.domObj.appendChild(this.navPrev);
      }
      //
      if (!this.parameters.navigation)
        this.parameters.navigation = {};
      this.parameters.navigation.nextEl = this.navNext;
      this.parameters.navigation.prevEl = this.navPrev;
    }
    else {
      if (this.parameters.navigation)
        delete this.parameters.navigation;
      if (this.navPrev) {
        this.navPrev.remove();
        this.navNext.remove();
        this.navPrev = undefined;
        this.navNext = undefined;
      }
    }
    //
    delete el.navigation;
    this.reinitSwiper();
  }
  //
  if (el.pagination !== undefined) {
    //
    if (el.pagination !== "none") {
      if (!this.pagObj) {
        this.pagObj = document.createElement("div");
        this.pagObj.className = "swiper-pagination";
        this.domObj.appendChild(this.pagObj);
      }
      //
      if (!this.parameters.pagination)
        this.parameters.pagination = {};
      this.parameters.pagination.el = this.pagObj;
      this.parameters.pagination.type = el.pagination === "dynbullets" ? "bullets" : el.pagination;
      this.parameters.pagination.dynamicBullets = el.pagination === "dynbullets";
      if (this.parameters.pagination.clickable === undefined)
        this.parameters.pagination.clickable = true;
    }
    else {
      if (this.parameters.pagination)
        delete this.parameters.pagination;
      if (this.pagObj) {
        this.pagObj.remove();
        this.pagObj = undefined;
      }
    }
    //
    delete el.pagination;
    this.reinitSwiper();
  }
  //
  if (el.scrollbar !== undefined) {
    if (el.scrollbar) {
      if (!this.scrollObj) {
        this.scrollObj = document.createElement("div");
        this.scrollObj.className = "swiper-scrollbar";
        this.domObj.appendChild(this.scrollObj);
      }
      //
      if (!this.parameters.scrollbar)
        this.parameters.scrollbar = {};
      this.parameters.scrollbar.el = this.scrollObj;
      if (this.parameters.scrollbar.draggable === undefined)
        this.parameters.scrollbar.draggable = true;
      if (this.parameters.scrollbar.snapOnRelease === undefined)
        this.parameters.scrollbar.snapOnRelease = true;
    }
    else {
      if (this.parameters.scrollbar)
        delete this.parameters.scrollbar;
      if (this.scrollObj) {
        this.scrollObj.remove();
        this.scrollObj = undefined;
      }
    }
    //
    delete el.scrollbar;
    this.reinitSwiper();
  }
  //
  if (el.vertical !== undefined) {
    this.parameters.direction = el.vertical ? "vertical" : "horizontal";
    delete el.vertical;
    this.reinitSwiper();
  }
  //
  if (el.spaceBetween !== undefined) {
    this.parameters.spaceBetween = el.spaceBetween;
    delete el.spaceBetween;
    this.reinitSwiper();
  }
  //
  if (el.slidesPerView !== undefined) {
    this.parameters.slidesPerView = el.slidesPerView === 0 ? "auto" : el.slidesPerView;
    delete el.slidesPerView;
    this.reinitSwiper();
  }
  //
  if (el.slidesPerColumn !== undefined) {
    this.parameters.slidesPerColumn = el.slidesPerColumn;
    delete el.slidesPerColumn;
    this.reinitSwiper();
  }
  //
  if (el.slidesPerGroup !== undefined) {
    this.parameters.slidesPerGroup = el.slidesPerGroup;
    delete el.slidesPerGroup;
    this.reinitSwiper();
  }
  //
  if (el.centeredSlides !== undefined) {
    this.parameters.centeredSlides = el.centeredSlides;
    delete el.centeredSlides;
    this.reinitSwiper();
  }
  //
  if (el.freeMode !== undefined) {
    this.parameters.freeMode = el.freeMode;
    delete el.freeMode;
    this.reinitSwiper();
  }
  //
  if (el.slideToClickedSlide !== undefined) {
    this.parameters.slideToClickedSlide = el.slideToClickedSlide;
    delete el.slideToClickedSlide;
    this.reinitSwiper();
  }
  //
  if (el.mousewheel !== undefined) {
    this.parameters.mousewheel = el.mousewheel;
    delete el.mousewheel;
    this.reinitSwiper();
  }
  //
  if (el.keyboard !== undefined) {
    this.parameters.keyboard = {enabled: el.keyboard};
    delete el.keyboard;
    this.reinitSwiper();
  }
  //
  if (el.grabCursor !== undefined) {
    this.parameters.grabCursor = el.grabCursor;
    delete el.grabCursor;
    this.reinitSwiper();
  }
  //
  if (el.loop !== undefined) {
    this.parameters.loop = el.loop;
    delete el.loop;
    this.reinitSwiper();
  }
  //
  if (el.effect !== undefined) {
    this.parameters.effect = el.effect;
    delete el.effect;
    this.reinitSwiper();
  }
  //
  if (el.autoPlayDelay !== undefined) {
    if (el.autoPlayDelay)
      this.parameters.autoplay = {delay: el.autoPlayDelay};
    else
      delete this.parameters.autoplay;
    delete el.autoPlayDelay;
    this.reinitSwiper();
  }
  //
  if (el.autoHeight !== undefined) {
    this.parameters.autoHeight = el.autoHeight;
    delete el.autoHeight;
    this.reinitSwiper();
  }
  //
  if (el.zoom !== undefined) {
    this.parameters.zoom = el.zoom;
    delete el.zoom;
    this.reinitSwiper();
  }
  //
  if (el.breakpoints !== undefined) {
    this.parameters.breakpoints = el.breakpoints;
    delete el.breakpoints;
    this.reinitSwiper();
  }
  //
  if (el.disabled !== undefined) {
    if (this.swiper)
      this.swiper.allowTouchMove = !el.disabled;
    else
      this.parameters.allowTouchMove = !el.disabled;
    delete el.disabled;
  }
  //
  if (el.index !== undefined) {
    if (this.swiper)
      this.swiper.slideTo(el.index);
    else
      this.parameters.initialSlide = el.index;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.Swiper.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pos = events.indexOf("onChange");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendOnChange = true;
  }
  //
  var pos = events.indexOf("onClick");
  if (pos >= 0) {
    events.splice(pos, 1);
    //this.sendOnClick = true;
    this.domObj.onclick = function (ev) {
      var data = this.saveEvent(ev);
      this.addImageData(data);
      Client.mainFrame.sendEvents([{obj: this.id, id: "onClick", content: data}]);
    }.bind(this);
  }
  //
  var pos = events.indexOf("onDblclick");
  if (pos >= 0) {
    events.splice(pos, 1);
    this.sendOnDblclick = true;
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child child element that requested the insertion
 * @param {HTMLElement} domObj child DOM object to add
 */
Client.Swiper.prototype.appendChildObject = function (child, domObj)
{
  domObj.classList.add("swiper-slide");
  if (this.swiper)
    this.swiper.appendSlide(domObj);
  else
    this.wrapObj.appendChild(domObj);
};


/**
 * One of my children element has been moved by the insertBefore function as the sibling position was required
 * The child object was first added to this object, then it is positioned at the right place
 *
 * in this case the slides must be updated using the new positions
 * @param {int} position
 */
Client.Swiper.prototype.onPositionChildObject = function (position) {
  if (!this.swiper)
    return;
  //
  if (!this.updateSlidesTimeout) {
    this.updateSlidesTimeout = setTimeout(function () {
      this.updateSlidesTimeout = undefined;
      this.swiper.updateSlides();
      this.swiper.updateSlidesClasses();
    }.bind(this), 0);
  }
};


/**
 * One of my children element has been removed
 * @param {Element} child
 */
Client.Swiper.prototype.onRemoveChildObject = function (child)
{
  if (this.swiper) {
    var idx = this.elements.indexOf(child);
    this.swiper.removeSlide(idx);
  }
  Client.Container.prototype.onRemoveChildObject.call(this, child);
};


/**
 * Init (or reinit) swiper object
 */
Client.Swiper.prototype.initSwiper = function ()
{
  if (this.swiper)
    this.swiper.destroy(true, false);
  //
  // Enable the resize observer and the overflow, so the navigation buttons are enabled/disabled with the content and the swiper updates itself on the 
  // resize/change of visibility
  this.parameters.resizeObserver = true;
  this.parameters.watchOverflow = true;
  //
  this.swiper = new Swiper(this.domObj, this.parameters);
  //
  this.swiper.on("slideChange", function (ev) {
    var x = [{obj: this.id, id: "chgProp", content: {name: "index", value: this.swiper.realIndex, clid: Client.id}}];
    if (this.sendOnChange)
      x.push({obj: this.id, id: "onChange", content: {realIndex: this.swiper.realIndex, activeIndex: this.swiper.activeIndex, previousIndex: this.swiper.previousIndex}});
    Client.mainFrame.sendEvents(x);
  }.bind(this), true);
  //
  this.swiper.on("tap", function (ev) {
    if (this.sendOnClick) {
      var data = this.saveEvent(ev);
      Client.mainFrame.sendEvents([{obj: this.id, id: "onClick", content: data}]);
    }
  }.bind(this), true);
  //
  this.swiper.on("doubleTap", function (ev) {
    if (this.sendOnDblclick) {
      var data = this.saveEvent(ev);
      Client.mainFrame.sendEvents([{obj: this.id, id: "onDblclick", content: data}]);
    }
  }.bind(this), true);
};


/**
 * Init (or reinit) swiper object
 */
Client.Swiper.prototype.reinitSwiper = function ()
{
  if (!this.swiper)
    return;
  if (!this.reinitTimeout) {
    this.reinitTimeout = setTimeout(function () {
      this.reinitTimeout = undefined;
      this.initSwiper();
    }.bind(this), 0);
  }
};


/**
 * Slide to next slide
 */
Client.Swiper.prototype.slideNext = function (speed)
{
  if (this.swiper)
    this.swiper.slideNext(speed);
};


/**
 * Slide to prev slide
 */
Client.Swiper.prototype.slidePrev = function (speed)
{
  if (this.swiper)
    this.swiper.slidePrev(speed);
};


/**
 * Slide to slide
 */
Client.Swiper.prototype.slideTo = function (index, speed)
{
  if (this.swiper)
    this.swiper.slideTo(index, speed);
};


/**
 * Update swiper
 */
Client.Swiper.prototype.update = function ()
{
  if (this.swiper)
    this.swiper.update();
};


/**
 * zoom in
 */
Client.Swiper.prototype.zoomIn = function ()
{
  if (this.swiper)
    this.swiper.zoom.in();
};

/**
 * zoom out
 */
Client.Swiper.prototype.zoomOut = function ()
{
  if (this.swiper)
    this.swiper.zoom.out();
};

/**
 * zoom toggle
 */
Client.Swiper.prototype.zoomToggle = function ()
{
  if (this.swiper)
    this.swiper.zoom.toggle();
};


/**
 * zoom toggle
 */
Client.Swiper.prototype.addImageData = function (ev)
{
  if (this.swiper.zoom.enabled) {
    var as = this.swiper.slides[this.swiper.activeIndex];
    var zc = as.getElementsByClassName("swiper-zoom-container")[0];
    var img = undefined;
    //
    if (zc) {
      img = zc.getElementsByTagName("IMG")[0];
      if (!img)
        zc.getElementsByTagName("SVG")[0];
      if (!img)
        zc.getElementsByTagName("CANVAS")[0];
    }
    //
    if (img) {
      var sx = img.naturalWidth / img.offsetWidth;
      var sy = img.naturalHeight / img.offsetHeight;
      ev.imageX = Math.round(ev.offsetX * sx);
      ev.imageY = Math.round(ev.offsetY * sy);
    }
  }
};


/**
 * set Max Zoom per slide
 */
Client.Swiper.prototype.setMaxZoom = function (index, maxZoom)
{
  if (this.swiper) {
    var as = this.swiper.slides[index];
    var zc = as.getElementsByClassName("swiper-zoom-container")[0];
    if (zc)
      zc.setAttribute("data-swiper-zoom", maxZoom);
  }
};


/**
 * autoplay
 */
Client.Swiper.prototype.startAutoplay = function ()
{
  if (this.swiper)
    this.swiper.autoplay.start();
};


/**
 * autoplay
 */
Client.Swiper.prototype.stopAutoplay = function ()
{
  if (this.swiper)
    this.swiper.autoplay.stop();
};


/**
 * autoplay
 */
Client.Swiper.prototype.isAutoplayRunning = function (cbId)
{
  if (this.swiper) {
    var e = [{obj: this.id, id: "cb", content: {res: !!this.swiper.autoplay.running, cbId: cbId}}];
    Client.mainFrame.sendEvents(e);
  }
};


Client.Swiper.prototype.close = function (firstLevel, triggerAnimation)
{
  if (this.swiper) {
    this.swiper.destroy(true, false);
    delete this.swiper;
  }
  Client.Element.prototype.close.call(this, firstLevel, triggerAnimation);
};

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
Client.IonSpinner = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  this.domObj = document.createElement("ion-spinner");
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  parent.appendChildObject(this, this.domObj);
};

Client.IonSpinner.prototype = new Client.Element();

/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.IonSpinner.prototype.updateElement = function (el)
{
  var update = this.domObj.parentNode === null;
  var create = this.domObj.parentNode === null;
  //
  if (el.color !== undefined) {
    this.color = el.color;
    update = true;
    delete el.color;
  }
  if (el.type !== undefined) {
    this.type = el.type;
    update = true;
    create = true;
    delete el.type;
  }
  if (el.duration !== undefined) {
    this.duration = el.duration;
    create = true;
    update = true;
    delete el.duration;
  }
  if (el.paused !== undefined) {
    this.paused = el.paused;
    update = true;
    delete el.paused;
  }
  if (el.className !== undefined) {
    this.className = el.className;
    update = true;
    delete el.className;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  //
  if (update) {
    var cs = "spinner-" + this.type + " spinner-" + Client.Ionic.platform + "-" + this.type;
    //
    if (this.color)
      cs += " spinner-" + Client.Ionic.platform + "-" + this.color;
    //
    if (this.paused)
      cs += " spinner-paused";
    //
    if (this.className)
      cs += " " + this.className;
    //
    this.setClassName(cs);
  }
  if (create)
    this.createSvg();
};


/**
 * Create svg
 */
Client.IonSpinner.prototype.createSvg = function ()
{
  while (this.domObj.firstChild)
    this.domObj.firstChild.remove();
  //
  var s = Client.IonSpinner.SPINNERS[this.type || "ios"];
  if (!s)
    return;
  //
  var tmpl = "";
  var t = "";
  var l = s.lines || s.circles;
  //
  for (var i = 0; i < l; i++) {
    var dur = this.duration || s.dur;
    var d = s.fn(dur, i, l);
    //
    var style = "";
    if (d.style.transform)
      style += "transform:" + d.style.transform + ";";
    if (d.style.left)
      style += "left:" + d.style.left + ";";
    if (d.style.top)
      style += "top:" + d.style.top + ";";
    if (d.style.animationDelay)
      style += "animation-delay:" + d.style.animationDelay + ";";
    style += "animation-duration:" + dur + "ms";
    //
    t = "<svg viewBox='0 0 64 64' style='" + style + "'>";
    if (s.lines)
      t += "<line y1='" + d.y1 + "' y2='" + d.y2 + "' transform='translate(32,32)'</line></svg>";
    else
      t += "<circle r='" + d.r + "' transform='translate(32,32)'></circle></svg>";
    tmpl += t;
  }
  //
  this.domObj.innerHTML = tmpl;
};


Client.IonSpinner.SPINNERS = {
  ios: {
    dur: 1000,
    lines: 12,
    fn: function (dur, index, total) {
      var transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
      var animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        y1: 17,
        y2: 29,
        style: {
          transform: transform,
          webkitTransform: transform,
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },
  'ios-small': {
    dur: 1000,
    lines: 12,
    fn: function (dur, index, total) {
      var transform = 'rotate(' + (30 * index + (index < 6 ? 180 : -180)) + 'deg)';
      var animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        y1: 12,
        y2: 20,
        style: {
          transform: transform,
          webkitTransform: transform,
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },
  bubbles: {
    dur: 1000,
    circles: 9,
    fn: function (dur, index, total) {
      var /** @type {?} */ animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        r: 5,
        style: {
          top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
          left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },
  circles: {
    dur: 1000,
    circles: 8,
    fn: function (dur, index, total) {
      var animationDelay = -(dur - ((dur / total) * index)) + 'ms';
      return {
        r: 5,
        style: {
          top: (9 * Math.sin(2 * Math.PI * index / total)) + 'px',
          left: (9 * Math.cos(2 * Math.PI * index / total)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  },
  crescent: {
    dur: 750,
    circles: 1,
    fn: function (dur) {
      return {
        r: 26,
        style: {}
      };
    }
  },
  dots: {
    dur: 750,
    circles: 3,
    fn: function (dur, index, total) {
      var animationDelay = -(110 * index) + 'ms';
      return {
        r: 6,
        style: {
          left: (9 - (9 * index)) + 'px',
          animationDelay: animationDelay,
          webkitAnimationDelay: animationDelay
        }
      };
    }
  }
};

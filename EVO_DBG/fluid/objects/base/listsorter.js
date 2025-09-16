/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A ListSorter
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the dialog
 * @extends Client.Element
 */
Client.ListSorter = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  // The user has not defined the src, use the default image
  if (element.src === undefined) {
    if (Client.IonHelper && Client.mainFrame && Client.mainFrame.theme.ionIcons === "5")
      element.src = "ion:svg_reorder-three";
    else if (Client.IonHelper)
      element.src = "ion:reorder";
    else
      element.src = "svg:icon-listsorter";
  }
  //
  this.visible = true;
  this.showIcon = true;
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  parent.appendChildObject(this, this.domObj);
};

// Make Client.ListSorter extend Client.Element
Client.ListSorter.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.ListSorter.prototype.updateElement = function (el)
{
  if (el.src) {
    var icon = el.src;
    var oldDom;
    if (icon.substring(0, 4) === "svg:") {
      // Check if the domObj exists and is a SVG, if not it must be removed and recreated
      if (!this.domObj || this.domObj.tagName.toLowerCase() !== "svg") {
        if (this.domObj && this.domObj.parentNode)
          oldDom = this.domObj;
        //
        this.domObj = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        this.domObj.appendChild(this.use);
        this.domObj.setAttribute("class", "listhandle");
      }
      //
      this.use.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#" + icon.substring(4));
    }
    else if (icon.substring(0, 4) === "cls:") {
      // Check if the domObj exists and is a DIV, if not it must be removed and recreated
      if (!this.domObj || this.domObj.tagName.toLowerCase() !== "div") {
        if (this.domObj && this.domObj.parentNode)
          oldDom = this.domObj;
        //
        this.domObj = document.createElement("div");
        this.use = null;
      }
      //
      var cn = icon.substring(4).split(",");
      this.domObj.className = "listhandle " + cn[0];
      if (cn.length)
        this.domObj.textContent = cn[1];
    }
    else if (icon.substring(0, 4) === "ion:" && Client.IonHelper) {
      if (!this.domObj || this.domObj.tagName.toLowerCase() !== "ion-icon") {
        if (this.domObj && this.domObj.parentNode)
          oldDom = this.domObj;
        //
        this.domObj = document.createElement("ion-icon");
        Client.IonHelper.setIonIcon(icon.substring(4), this.domObj, "listhandle");
      }
    }
    else {
      // Check if the domObj exists and is a DIV, if not it must be removed and recreated
      if (!this.domObj || this.domObj.tagName.toLowerCase() !== "img") {
        if (this.domObj && this.domObj.parentNode)
          oldDom = this.domObj;
        //
        this.domObj = document.createElement("img");
        this.use = null;
      }
      this.domObj.src = icon;
      this.domObj.className = "listhandle";
    }
    //
    delete el.src;
    //
    // If there was an old dom object that was replaced by a new domObj
    // we must do the replace also in the dom parentNode
    if (oldDom)
      oldDom.parentNode.replaceChild(this.domObj, oldDom);
  }
  //
  if (el.className !== undefined) {
    var d = this.domObj.className;
    var cs = d;
    var idx = d.indexOf(" § ");
    if (idx > -1)
      cs = d.substring(0, idx);
    this.domObj.setAttribute("class", cs + " § " + el.className);
    delete el.className;
  }
  //
  if (el.showIcon !== undefined) {
    this.showIcon = el.showIcon;
    //
    var v = this.visible && this.showIcon;
    this.domObj.style.display = v ? "" : "none";
    //
    // Set the tag on the parent to let him reorder when touching not on the handle
    this.parent.domObj.setAttribute("slip", this.showIcon ? "" : "slip-let-reorder");
    //
    delete el.showIcon;
  }
  //
  if (el.visible !== undefined) {
    this.visible = el.visible;
    //
    var v = this.visible && this.showIcon;
    this.domObj.style.display = v ? "" : "none";
    //
    setTimeout(function () {
      if (this.parent && this.parent.parent && this.parent.parent.slipInstance) {
        if (this.visible)
          this.parent.parent.slipInstance.attach(this.parent.parent.domObj);
        else
          this.parent.parent.slipInstance.detach();
      }
    }.bind(this), 50);
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.ListSorter.prototype.attachEvents = function (events)
{
  // Check if there is a listcontainer (parent.parent) and has not already the instance
  if (this.parent && this.parent.parent && !this.parent.parent.slipInstance) {
    var parentList = this.parent.parent;
    var pListDom = parentList.domObj;
    parentList.slipInstance = new Slip(pListDom);
    //
    var reorderFunction = function (e) {
      //
      // Unlock clicks and swipes
      Client.mainFrame.preventClick();
      //
      // stop reorder event propagation
      e.stopPropagation();
      //
      // Apply reorder: change the position of the reordered items
      e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
      //
      var draggedElement = parentList.elements[e.detail.originalIndex];
      var nextElement = parentList.elements[e.detail.spliceIndex];
      //
      // If the datamap is ordered we must get the next real element (has the 'rowPosition' property) and send to the server its position for splice index (the client splice index
      // has also the footers and headers..)
      var orderedSplice = e.detail.spliceIndex;
      if (e.detail.spliceIndex < parentList.elements.length) {
        var sIdx = e.detail.spliceIndex;
        var nextE = nextElement;
        while (nextE) {
          if (nextE.rowPosition !== undefined && nextE !== draggedElement)
            break;
          nextE = parentList.elements[++sIdx];
        }
        if (nextE) {
          orderedSplice = nextE.rowPosition;
          nextElement = nextE;
        }
      }
      else {
        // We are at the end.. so we must get the last element and then increment its position by 1
        var sIdx = parentList.elements.length - 1;
        var prevE = parentList.elements[parentList.elements.length - 1];
        while (prevE) {
          if ((prevE.rowPosition !== undefined && prevE !== draggedElement) || sIdx === 0)
            break;
          prevE = parentList.elements[--sIdx];
        }
        if (prevE) {
          orderedSplice = prevE.rowPosition + 1;
          nextElement = null;
        }
      }
      //
      // Execute the reordering of the array
      // Remove from the original position and set in the new position
      parentList.elements.splice(e.detail.originalIndex, 1);
      parentList.elements.splice(e.detail.spliceIndex, 0, draggedElement);
      //
      // Now get the sorter contained in the dragged element and send the message to the server
      for (var i = 0; i < draggedElement.elements.length; i++) {
        if (draggedElement.elements[i] instanceof Client.ListSorter) {
          draggedElement.elements[i].reorderComplete(orderedSplice, draggedElement.rowPosition !== undefined ? draggedElement.rowPosition : e.detail.originalIndex, nextElement);
          break;
        }
      }
    };
    //
    // Function executed on tap, if preventDefault is called the reorder operation begins immediately (for handles)
    var beforewaitFunction = function (e) {
      var tgt = e.target;
      if (tgt.tagName === "use")
        tgt = tgt.parentNode;
      //
      // If the touch is on an handle begin the reorder
      if (tgt.classList.contains("listhandle"))
        e.preventDefault();
    };
    //
    // Stop the reorder operation on this row if not on the Handle
    var beforeReorder = function (e) {
      var tgt = e.target;
      if (tgt.tagName === "use")
        tgt = tgt.parentNode;
      //
      var stopReorder = false;
      //
      // If the touch is not on an handle don't do the reorder
      if (!tgt.classList.contains("listhandle")) {
        // Check if the target is contained in an element with the attribute "slip-let-reorder",
        // if true let the reorder begin, otherwise block the reorder operation
        stopReorder = true;
        var t = tgt;
        while (t) {
          if (t === pListDom)
            break;
          //
          if (t.getAttribute("slip") === "slip-let-reorder") {
            stopReorder = false;
            break;
          }
          //
          t = t.parentNode;
        }
      }
      if (stopReorder)
        e.preventDefault();
      else {
        // Avoid any other click until reorder finish
        Client.mainFrame.preventClick(24 * 60 * 60 * 1000);
        //
        if (Client.IonHelper) {
          Client.IonHelper.hapticFeedback({type: ">m"});
          Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "start"});
        }
      }
    };
    //
    parentList.domObj.addEventListener('slip:reorder', reorderFunction);
    parentList.domObj.addEventListener('slip:beforewait', beforewaitFunction);
    parentList.domObj.addEventListener('slip:beforereorder', beforeReorder);
    parentList.domObj.addEventListener('slip:afterreorder', function () {
      // Unlock clicks and swipes
      Client.mainFrame.preventClick();
      if (Client.IonHelper) {
        Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "end"});
        Client.IonHelper.hapticFeedback({type: ">m"});
      }
    });
    parentList.domObj.addEventListener('slip:reordering', function () {
      if (Client.IonHelper) {
        Client.IonHelper.hapticFeedback({type: "gestureSelection", style: "changed"});
      }
    });
    //
    // Stop swipe handling
    parentList.domObj.addEventListener('slip:beforeswipe', function (ev) {
      ev.preventDefault();
    });
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Called on the end of a successful reorder operation
 * @param {Int} newIndex
 * @param {Int} originalIndex
 * @param {Client.Element} nextElement
 */
Client.ListSorter.prototype.reorderComplete = function (newIndex, originalIndex, nextElement)
{
  // In the server the arrays don't have the 'template element' (0) as we have in the client, so the index must be adapted
  // but only in 'useWindow' datamap (normal datamaps doesn't have the template in the client)
  var offset = 0;
  if (this.parent && this.parent.parent && this.parent.parent.rowCont !== undefined)
    offset = 1;
  //
  var e = [{obj: this.id, id: "onReorder", content: {newIndex: newIndex - offset, originalIndex: originalIndex - offset, nextElementID: nextElement ? nextElement.id : "", clid: Client.id}, bc: true}];
  Client.mainFrame.sendEvents(e);
};


/**
 * Called from the server when a reorder operation is done (for multi-client purpose)
 * @param {Object} content - object with the operation data
 */
Client.ListSorter.prototype.onReorder = function (content)
{
  // The message is broadcasted to all clients, also the original:
  // in this case we use clid for skipping the message in the original client
  if (content.clid && content.clid === Client.id)
    return;
  //
  var parentList = this.parent.parent;
  var newIdx = content.newIndex;
  var parentIdx = -1;
  //
  // Search the position of the parent in the master list
  for (var ch = 0; ch < parentList.elements.length; ch++) {
    if (parentList.elements[ch] === this.parent) {
      parentIdx = ch;
      break;
    }
  }
  //
  // If my parent is not on the correct position we must reposition him in the elements array and in the DOM
  if (parentIdx !== newIdx && parentIdx !== -1) {
    // Reposition the elements array - remove the parent from the old position and add into the new
    parentList.elements.splice(parentIdx, 1);
    parentList.elements.splice(newIdx, 0, this.parent);
    //
    // Now we must reposition the elements also in the DOM
    // If the new position is not the last we can use the insertBefore, else we must use the appendChild
    parentList.domObj.removeChild(this.parent.domObj);
    if (newIdx !== parentList.elements.length - 1)
      parentList.domObj.insertBefore(this.parent.domObj, parentList.elements[newIdx + 1].domObj);
    else
      parentList.domObj.appendChild(this.parent.domObj);
  }
};


/**
 * Update element properties
 */
Client.ListSorter.prototype.cancel = function ()
{
  if (this.parent && this.parent.parent && this.parent.parent.slipInstance) {
    this.parent.parent.slipInstance.cancel();
    //
    // Unlock clicks and swipes
    Client.mainFrame.preventClick();
  }
};
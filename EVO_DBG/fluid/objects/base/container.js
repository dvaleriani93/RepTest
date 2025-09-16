/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000-2021
 * All rights reserved
 */

/* global Client */

/**
 * @class A container element
 * @param {Object} element - the element description
 * @param {View|Element} parent - the parent element
 * @param {View} view - the view containing the container
 * @extends Client.Element
 */
Client.Container = function (element, parent, view)
{
  Client.Element.call(this, element, parent, view);
  //
  if (element === undefined)
    return;
  //
  if (element.layout === "table")
    this.domObj = document.createElement("table");
  else if (element.tag) {
    this.domObj = document.createElement(element.tag === "" ? "DIV" : element.tag);
    delete element.tag;
  }
  else
    this.domObj = document.createElement("div");
  //
  // During testauto or telecollaboration always send onScroll event
  if (Client.isTestAuto || Client.clientType) {
    element.events = element.events || [];
    element.events.push("onScroll");
  }
  //
  this.updateElement(element);
  this.attachEvents(element.events);
  //
  parent.appendChildObject(this, this.domObj);
  //
  // Create children after attaching element as external components, rely on dom structure
  this.createChildren(element);
};


// Make Client.Container extend Client.Element
Client.Container.prototype = new Client.Element();


/**
 * Update element properties
 * @param {Object} el - properties to update
 */
Client.Container.prototype.updateElement = function (el)
{
  var pthis = this;
  //
  // First remove logged properties to avoid wrong position setting
  this.purgeMyProp(el);
  //
  // Is this container a listbox?
  if (el.rowCount !== undefined) {
    this.rowCount = el.rowCount;
    delete el.rowCount;
    this.r1 = -1;
    this.r2 = -1;
    //
    setTimeout(function () {
      pthis.updateListBox();
    }, 0);
  }
  //
  // Get "more rows" indicator
  if (el.moreRows !== undefined) {
    //
    this.moreRowsGuard = el.moreRows ? Client.eleMap[el.moreRows] : undefined;
    //
    if (this.moreRows === undefined) {
      // Search for the first parent that has overflow-y: auto/scroll
      setTimeout(() => {
        let obj = Client.Utils.getScrollableParent(this.domObj);
        obj?.addEventListener("scroll", ev => this.getNextPage(ev));
      }, 0);
    }
    //
    // True: delay "more rows" reactivation to wait for new elements
    if (el.moreRows && !this.moreRowsTimer) {
      this.moreRowsTimer = setTimeout(function () {
        this.moreRows = true;
        delete this.moreRowsTimer;
        if (!this.moreRowsElement) {
          this.moreRowsElement = document.createElement("div");
          this.moreRowsElement.className = "more-rows";
          this.domObj.appendChild(this.moreRowsElement);
        }
        // Launch immediately
        this.getNextPage();
      }.bind(this), 30);
    }
    //
    // False -> immediate
    if (!el.moreRows) {
      this.moreRows = false;
      if (!this.moreRows && this.moreRowsElement) {
        this.domObj.removeChild(this.moreRowsElement);
        this.moreRowsElement = null;
      }
    }
    delete el.moreRows;
  }
  //
  // Acquire scrolling speed
  if (el.scrollDuration) {
    this.scrollDuration = el.scrollDuration;
    delete el.scrollDuration;
  }
  //
  // Acquire template name "item"
  if (el.templateName) {
    this.templateName = el.templateName;
    delete el.templateName;
  }
  //
  // Change actual position
  if (el.position !== undefined) {
    //
    // Reset interval position
    delete this.posCounter;
    if (this.posInterval) {
      clearInterval(this.posInterval);
      delete this.posInterval;
    }
    //
    var oldPosition = this.position;
    this.position = el.position;
    //
    setTimeout(function () {
      var ok = pthis.setPosition();
      if (ok) {
        if (pthis.handleFocus) {
          pthis.setFocus(oldPosition);
          pthis.handleFocus = false;
        }
      }
      else {
        pthis.posCounter = 20;
        if (pthis.posInterval) {
          clearInterval(pthis.posInterval);
          delete pthis.posInterval;
        }
        pthis.posInterval = setInterval(function () {
          var ok = pthis.setPosition();
          if (ok) {
            if (pthis.handleFocus) {
              pthis.setFocus(oldPosition);
              pthis.handleFocus = false;
            }
          }
          pthis.posCounter--;
          if (ok || pthis.posCounter <= 0) {
            clearInterval(pthis.posInterval);
            delete pthis.posInterval;
            delete pthis.posCounter;
          }
        }, 100);
      }
    }, 0);
    //
    delete el.position;
  }
  //
  // Change window position
  if ((el.firstRec !== undefined && el.firstRec !== this.firstRec) ||
          (el.lastRec !== undefined && el.lastRec !== this.lastRec)) {
    this.changeWindow(el.firstRec !== undefined ? el.firstRec : this.firstRec,
            el.lastRec !== undefined ? el.lastRec : this.lastRec);
    delete el.firstRec;
    delete el.lastRec;
  }
  //
  // Timestamp scroll position modification
  if (el.scrollLeft !== undefined || el.scrollTop !== undefined) {
    this.scrollSetTime = new Date();
  }
  //
  // Add required "layout" class
  if (el.className !== undefined && this.layout) {
    el.className = "container-" + this.layout + " " + el.className;
  }
  //
  Client.Element.prototype.updateElement.call(this, el);
  //
  // Change layout
  if (el.layout) {
    var oldLayout = this.layout;
    this.layout = el.layout;
    //
    this.domObj.classList.remove("container-horizontal");
    this.domObj.classList.remove("container-vertical");
    this.domObj.classList.remove("container-absolute");
    this.domObj.classList.remove("container-table");
    //
    if (el.layout === "horizontal") {
      this.domObj.classList.add("container-horizontal");
      //
      // If the old layout was "table" I have to remove tr and td elements
      if (oldLayout === "table")
        this.changeLayout();
    }
    else if (el.layout === "vertical") {
      this.domObj.classList.add("container-vertical");
      //
      // If the old layout was "table" I have to remove tr and td elements
      if (oldLayout === "table")
        this.changeLayout();
    }
    else if (el.layout === "absolute") {
      this.domObj.classList.add("container-absolute");
      //
      // If the old layout was "table" I have to remove tr and td elements
      if (oldLayout === "table")
        this.changeLayout();
    }
    else if (el.layout === "table") {
      // If there isn't the number of columns or it's 0, use the number of rows
      this.numCols = el.numCols ? el.numCols : el.numRows;
      //
      // If there is neither the number of columns nor the number of rows set a default value
      if (!this.numCols)
        this.numCols = 2;
      //
      // The number of columns is enough to build the table. I will count the rows while inserting the children
      this.numRows = 0;
      this.columnsInserted = 0;
      //
      delete el.layout;
      delete el.numCols;
      delete el.numRows;
      //
      this.changeLayout();
    }
  }
  else if ((el.numCols || el.numRows) && this.layout === "table") {
    this.numCols = el.numCols || this.numCols;
    this.numRows = el.numRows || this.numRows;
    delete el.numCols;
    delete el.numRows;
    this.changeLayout();
  }
  //
  // Make the list template invisible as soon as possible
  if (this.parent.rowCount === 0 && this.rownum === undefined) {
    this.domObj.style.visibility = "hidden";
  }
  //
  if ((this.layout === "horizontal" || this.layout === "vertical") && this.createDropTargets) {
    window.setTimeout(function () {
      this.createDropTargets();
    }.bind(this), 15);
  }
};


/**
 * Remove or add tr and td elements when changing from "table" layout to another layout or viceversa.
 */
Client.Container.prototype.changeLayout = function ()
{
  // Remove the domObj children
  while (this.domObj.lastChild)
    this.domObj.removeChild(this.domObj.lastChild);
  //
  this.columnsInserted = 0;
  //
  // Attach again the children
  for (var i = 0; i < this.ne(); i++)
    this.appendChildObject(this, this.elements[i].domObj);
};


/**
 * Attach events handler
 * @param {Array} events - array of the events to handle
 */
Client.Container.prototype.attachEvents = function (events)
{
  if (!events)
    return;
  //
  var pthis = this;
  var idx = events.indexOf("onScroll");
  if (idx >= 0) {
    events.splice(idx, 1);
    this.domObj.onscroll = function (ev) {
      if (pthis.scrollSetTime === undefined || new Date() - pthis.scrollSetTime > 100) {
        var e = [];
        if (pthis.getScrollTop() !== this.lastScrollTop)
          e.push({obj: pthis.id, id: "chgProp", content: {name: "scrollTop", value: pthis.getScrollTop(), clid: Client.id}});
        if (pthis.getScrollLeft() !== this.lastScrollLeft)
          e.push({obj: pthis.id, id: "chgProp", content: {name: "scrollLeft", value: pthis.getScrollLeft(), clid: Client.id}});
        e.push({obj: pthis.id, id: "onScroll", content: pthis.saveEvent(ev)});
        Client.mainFrame.sendEvents(e);
        pthis.lastScrollTop = pthis.getScrollTop();
        pthis.lastScrollLeft = pthis.getScrollLeft();
      }
    };
    this.lastScrollTop = this.getScrollTop();
    this.lastScrollLeft = this.getScrollLeft();
  }
  //
  Client.Element.prototype.attachEvents.call(this, events);
};


/**
 * Append a child DOM Object to this element DOM Object
 * Usually the child element is not contained in this element array
 * it will be pushed there just after this function call.
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.Container.prototype.appendChildObject = function (child, domObj)
{
  if (this.layout === "table") {
    if (this.numCols) {
      // If I have to insert the first column of the row, create the row first
      if (this.columnsInserted === 0) {
        this.lastRowInserted = document.createElement("tr");
        this.domObj.appendChild(this.lastRowInserted);
        this.numRows++;
      }
      //
      // Create the cell of the table and append it to the row
      var cell = document.createElement("td");
      cell.appendChild(domObj);
      this.lastRowInserted.appendChild(cell);
      if (child.visible === false || domObj.style.display === "none")
        cell.style.display = "none";
      else
        this.columnsInserted = (this.columnsInserted + 1) % this.numCols;
    }
  }
  else
    this.domObj.appendChild(domObj);
};


/**
 * One of my children element has been removed
 * @param {Element} child
 */
Client.Container.prototype.onRemoveChildObject = function (child)
{
  if (this.layout === "table" && this.domObj.lastChild) {
    var domObj = child.getRootObject();
    //
    // Removing the last cell?
    if (domObj && domObj.parentNode) {
      // navigate backward and delete every empty cell/row
      var tr = domObj.parentNode.parentNode;
      while (tr) {
        //
        var td = tr.lastChild;
        while (td) {
          var atd = td;
          td = td.previousSibling;
          //
          if (!atd.firstChild || atd.firstChild === domObj)
            atd.remove();
          else
            break;
        }
        //
        var atr = tr;
        tr = tr.previousSibling;
        //
        if (!atr.firstChild)
          atr.remove();
        else
          break;
      }
      //
      // Restore count
      this.columnsInserted = 0;
      this.lastRowInserted = this.domObj.lastChild;
      if (this.lastRowInserted)
        this.columnsInserted = this.lastRowInserted.childNodes.length % this.numCols;
    }
  }
};


/**
 * Return the object representing a cell given its row and column
 * @param {int} row - the cell row
 * @param {int} column - the cell column
 * @returns {HTMLElement}
 */
Client.Container.prototype.getCell = function (row, column)
{
  if (this.layout === "table") {
    var rows = this.domObj.getElementsByTagName("tr");
    if (rows && rows.length >= row) {
      var selRow = rows[row];
      var cols = selRow.getElementsByTagName("td");
      if (cols && cols.length >= column)
        return cols[column];
    }
  }
};


/**
 * Set the rowspan property of a cell
 * @param {int} row - the cell row
 * @param {int} column - the cell column
 * @param {int} rowspan - the rowspan property value
 */
Client.Container.prototype.setRowSpan = function (row, column, rowspan)
{
  var cell = this.getCell(row, column);
  if (cell) {
    cell.rowSpan = rowspan;
    for (var i = 1; i < rowspan; i++)
      this.removeCell(row + i, column);
  }
};


/**
 * Set the colspan property of a cell
 * @param {int} row - the cell row
 * @param {int} column - the cell column
 * @param {int} colspan - the colspan property value
 */
Client.Container.prototype.setColSpan = function (row, column, colspan)
{
  var cell = this.getCell(row, column);
  if (cell) {
    cell.colSpan = colspan;
    for (var i = 1; i < colspan; i++)
      this.removeCell(row, column + i);
  }
};


/**
 * Put an element in a cell
 * @param {Object} element - the element to put
 * @param {int} row - the cell row
 * @param {int} column - the cell column
 * @param {String} operation - if "replace" remove the current element and add the new one, if "add" append the new element
 */
Client.Container.prototype.setCellContent = function (element, row, column, operation) {
  var cell = this.getCell(row, column);
  if (cell) {
    if (operation === "replace") {
      while (cell.hasChildNodes())
        cell.removeChild(cell.lastChild);
    }
    //
    if (Client.eleMap[element]?.domObj)
      cell.appendChild(Client.eleMap[element].domObj);
  }
};


/**
 * Remove the elements contained in a cell
 * @param {int} row - the cell row
 * @param {int} column - the cell column
 */
Client.Container.prototype.removeCellContent = function (row, column)
{
  var cell = this.getCell(row, column);
  if (cell) {
    while (cell.hasChildNodes()) {
      var node = cell.lastChild;
      cell.removeChild(node);
      var el = Client.Utils.findElementFromDomObj(node);
      el.close();
    }
  }
};


/**
 * Remove a cell from the table
 * @param {int} row - the cell row
 * @param {int} column - the cell column
 */
Client.Container.prototype.removeCell = function (row, column)
{
  var cell = this.getCell(row, column);
  if (cell) {
    // Remove cell elements
    this.removeCellContent(row, column);
    //
    // Remove the cell
    cell.parentNode.removeChild(cell);
  }
};


/**
 * Add a row to the table
 * @param {int} pos - the position to add the row. If undefined the row will be added at the end.
 */
Client.Container.prototype.addTableRow = function (pos) {
  if (this.layout === "table") {
    var row = document.createElement("tr");
    for (var i = 0; i < this.numCols; i++) {
      var col = document.createElement("td");
      row.appendChild(col);
    }
    //
    if (pos !== undefined) {
      if (this.domObj.children.length >= pos)
        this.domObj.insertBefore(row, this.domObj.children[pos]);
    }
    else
      this.domObj.appendChild(row);
    //
    this.numRows++;
  }
};


/**
 * Remove a row from the table
 * @param {int} pos - the position of the row to remove
 */
Client.Container.prototype.removeTableRow = function (pos)
{
  var rows = document.getElementsByTagName("tr");
  if (rows && rows.length > pos) {
    var r = rows[pos];
    for (var i = 0; i < r.length; i++) {
      this.removeCell(pos, i);
    }
  }
};


/**
 * Add a column to the table
 * @param {int} pos - the position to add the column. If undefined the column will be added at the end.
 */
Client.Container.prototype.addTableColumn = function (pos) {
  var i, col;
  if (this.layout === "table") {
    var rows = document.getElementsByTagName("tr");
    if (rows) {
      if (pos !== undefined) {
        if (rows.length >= pos) {
          for (i = 0; i < rows.length; i++) {
            col = document.createElement("td");
            rows[i].insertBefore(col, rows[pos]);
          }
        }
      }
      else {
        for (i = 0; i < rows.length; i++) {
          col = document.createElement("td");
          rows[i].appendChild(col);
        }
      }
      //
      this.numCols++;
    }
  }
};


/**
 * Remove a column from the table
 * @param {int} pos - the position of the column to remove
 */
Client.Container.removeTableColumn = function (pos)
{
  var rows = document.getElementsByTagName("tr");
  if (rows && rows.length > pos) {
    for (var i = 0; i < rows.length; i++)
      this.removeCell(i, pos);
  }
};


/**
 * Returns the scrollTop of this object
 */
Client.Container.prototype.getScrollTop = function ()
{
  return this.domObj.scrollTop + (this.offsetY || 0);
};


/**
 * Sets the scrollTop of this object
 * @param {int} top - scrollTop
 */
Client.Container.prototype.setScrollTop = function (top)
{
  this.domObj.scrollTop = top;
};



/**
 * Returns the scrollLeft of this object
 */
Client.Container.prototype.getScrollLeft = function ()
{
  return this.domObj.scrollLeft;
};


/**
 * Sets the scrollLeft of this object
 * @param {int} left - scrollTop
 */
Client.Container.prototype.setScrollLeft = function (left)
{
  this.domObj.scrollLeft = left;
};


/**
 * Update this container as a list box
 * @param {bool} repos - true, need to update scroll top due to orientation change
 */
Client.Container.prototype.updateListBox = function (repos)
{
  if (this.skipUpdate) {
    this.skipUpdate = false;
    return;
  }
  //
  // Setting LB properties (only first time)
  this.initListBox();
  //
  // Now I can set the height of the container based on record number and size
  var nc = Math.max(Math.floor(this.domObj_offsetWidth / this.recWidth), 1);
  var nr = Math.ceil(this.rowCount / nc);
  //
  if (this.rowCount !== this.oldCount || repos) {
    var h = this.scrollDiv.offsetHeight;
    this.scrollDiv.style.height = (this.recHeight * nr) + "px";
    //
    // Lets try to mantain current position when resizing
    if (repos && h)
      this.setScrollTop(this.getScrollTop() * (this.recHeight * nr / h));
    //
    this.oldCount = this.rowCount;
  }
  //
  // Let's see the visible window
  // calc first/last row, 0-based
  var t1 = Math.floor(this.getScrollTop() / this.recHeight);
  var t2 = Math.ceil((this.getScrollTop() + this.domObj_clientHeight) / this.recHeight);
  //
  var r1 = t1 * nc;
  var r2 = t2 * nc;
  //
  this.firstRec = r1;
  this.lastRec = r2;
  //
  // Open up the window, adding 2 more screen
  var nv = Math.floor(this.domObj_offsetHeight / this.recHeight);
  //
  // TODO: 1.33 is the window factor. We should parametrize it
  // or auto-calculate it depenging on network performances
  var ww = Math.floor(nv * nc * 1.33);
  //
  r1 -= ww;
  r2 += ww;
  if (r1 < 0)
    r1 = 0;
  if (r2 > this.rowCount)
    r2 = this.rowCount;
  //
  // Let's see how many records we need
  // TODO: 0.33 is the message limiting factor. The normal value is
  // window factor - 1
  var d1 = Math.abs(r1 - this.r1);
  var d2 = Math.abs(r2 - this.r2);
  var dt = (d1 > d2) ? d1 : d2;
  var limit = Math.floor(1 + nv * nc * 0.33);
  if (limit < 1)
    limit = 1;
  //
  // If we are handling only a few rows, we have to update every time
  if (this.rowCount <= ww)
    limit = 1;
  if (this.rowCount < limit)
    limit = this.rowCount;
  //
  // Ask the DM for these records
  if (dt > limit) {
    this.r1 = r1;
    this.r2 = r2;
    var ee = this.sendProp("firstRec", "lastRec");
    ee.push({obj: this.id, id: "onMissingRecord", content: {start: r1, end: r2}});
    Client.mainFrame.sendEvents(ee);
  }
};


/**
 * Handle the navigation in the listbox using the keyboard
 * @param {KeyboardEvent} ev - the event occured when the user pressed a key
 */
Client.Container.prototype.moveListBox = function (ev)
{
  // Find the element corresponding to the html element that triggered the keyboard event
  var el = Client.Utils.findElementFromDomObj(ev.target);
  //
  // If the element can handle key down
  if ((el && !el.handleKeyDown) || (el && el.handleKeyDown && !el.handleKeyDown(ev))) {
    var cmd;
    switch (ev.keyCode) {
      case 9: // TAB
        if (ev.shiftKey) {
          // If the active element is the first element that can get focus in the container
          // set the command to be sent to the datamap
          if (Client.Utils.isFirstFocusableNode(document.activeElement))
            cmd = "prev";
          else {
            // The active element is not the first element that can get focus in the container,
            // move the focus to the previous element
            this.moveFocus("prev");
            ev.preventDefault();
          }
        }
        else {
          // If the active element is the last element that can get focus in the container
          // set the command to be sent to the datamap
          if (Client.Utils.isLastFocusableNode(document.activeElement))
            cmd = "next";
          else {
            // The active element is not the last element that can get focus in the container,
            // move the focus to the next element
            this.moveFocus("next");
            ev.preventDefault();
          }
        }
        break;
      case 33:  // PAGE-UP
        cmd = "pageup";
        break;
      case 34:  // PAGE-DOWN
        cmd = "pagedown";
        break;
      case 35:  // END
        if (ev.ctrlKey || ev.metaKey)
          cmd = "last";
        break;
      case 36:  // HOME
        if (ev.ctrlKey || ev.metaKey)
          cmd = "first";
        break;
      case 37:  // Left arrow
        // If the active element is the first element that can get focus in the container
        // set the command to be sent to the datamap
        if (Client.Utils.isFirstFocusableNode(document.activeElement))
          cmd = "prev";
        else {
          // The active element is not the first element that can get focus in the container,
          // move the focus to the previous element
          this.moveFocus("prev");
          ev.preventDefault();
        }
        break;
      case 38:  // Up arrow
        cmd = "up";
        break;
      case 39:  // Right arrow
        // If the active element is the last element that can get focus in the container
        // set the command to be sent to the datamap
        if (Client.Utils.isLastFocusableNode(document.activeElement))
          cmd = "next";
        else {
          // The active element is not the last element that can get focus in the container,
          // move the focus to the next element
          this.moveFocus("next");
          ev.preventDefault();
        }
        break;
      case 40:  // Down arrow
        cmd = "down";
        break;
    }
    //
    // If there is a command to be handled by the datamap
    if (cmd) {
      ev.preventDefault();
      //
      // Calculate the column
      var nc = Math.max(Math.floor(this.domObj_offsetWidth / this.recWidth), 1);
      //
      // Calculate the row
      var nr = Math.floor(this.domObj_offsetHeight / this.recHeight);
      //
      // Remember that the focus can be moved
      this.handleFocus = true;
      //
      // Trigger the onnavigate event that will call the onNavigate of the DataMap
      this.domObj.onnavigate({cmd: cmd, columns: nc, rows: nr, type: "navigate"});
    }
  }
};


/**
 * Update this container as a list box
 */
Client.Container.prototype.initListBox = function ()
{
  // First I will create an internal div to enable scrolling
  if (!this.scrollDiv) {
    this.scrollDiv = document.createElement("div");
    this.scrollDiv.className = "window-scroller";
    //
    if (this.domObj.style.position === "")
      this.domObj.style.position = "relative";
    if (this.domObj.style.overflow === "" && this.domObj.style.overflowY === "")
      this.domObj.style.overflowY = "auto";
    //
    this.domObj.appendChild(this.scrollDiv);
    //
    // Now I'm able to see the size of a single record
    this.tmpl = this.elements[0];
    var s = window.getComputedStyle(this.tmpl.domObj);
    this.recWidth = this.tmpl.domObj.offsetWidth + parseInt(s.marginLeft) + parseInt(s.marginRight);
    this.recHeight = this.tmpl.domObj.offsetHeight + parseInt(s.marginTop) + parseInt(s.marginBottom);
    this.cacheProp();
    //
    // Hide template object instead of making it invisible
    this.tmpl.domObj.style.display = "none";
    //
    // Attach onscroll to listbox
    this.domObj.addEventListener("scroll", function () {
      if (!this.scrollStartTime) {
        this.scrollStartTime = new Date().getTime();
        this.scrollPosition = this.getScrollTop();
        requestAnimationFrame(this.fireScrollRaf.bind(this));
        this.updateListBox();
      }
    }.bind(this));
    //
    // Attach key down
    this.domObj.tabIndex = "0";
    this.domObj.addEventListener("keydown", function (ev) {
      this.moveListBox(ev);
    }.bind(this), true);
  }
};


/**
 * high frequency scroll watcher
 */
Client.Container.prototype.fireScrollRaf = function ()
{
  var again = true;
  //
  var p = this.getScrollTop();
  var d = new Date().getTime();
  //
  // Maybe the container become invisible... disabling raf in this case
  var h = this.domObj.clientHeight;
  //
  var dy = p - this.scrollPosition;
  var dt = d - this.scrollStartTime;
  var speed = Math.floor(Math.abs(dy) * 1000 / dt);
  if (dt > 80 && dt < 300 && speed > 1000) {
    // device is busy during a high speed scrolling
    // let's offset the row requested
    this.offsetY = dy;
  }
  //
  if (p !== this.scrollPosition && h > 0) {
    this.scrollStartTime = d;
    this.scrollPosition = p;
  }
  else if (dt > 2000 || h === 0) {
    again = false;
    this.scrollStartTime = undefined;
    this.scrollPosition = undefined;
  }
  //
  if (again)
    requestAnimationFrame(this.fireScrollRaf.bind(this));
  //
  if (h > 0)
    this.updateListBox();
  //
  this.offsetY = 0;
};


/**
 * Cache listbox properties
 */
Client.Container.prototype.cacheProp = function ()
{
  this.domObj_offsetWidth = this.domObj.offsetWidth;
  this.domObj_offsetHeight = this.domObj.offsetHeight;
  this.domObj_clientHeight = this.domObj.clientHeight;
};


/**
 * Move the element in the right position of the grid
 * @param {Element} el - the element to move
 */
Client.Container.prototype.moveToListPosition = function (el)
{
  // If the container is not yet initialized, redo this action after a while
  var pthis = this;
  if (!this.recWidth) {
    setTimeout(function () {
      pthis.moveToListPosition(el);
    }, 0);
    return;
  }
  //
  // Calculate the column
  var nc = Math.max(Math.floor(this.domObj_offsetWidth / this.recWidth), 1);
  //
  var y = Math.floor(el.rownum / nc);
  var x = el.rownum % nc;
  //
  if (el.domObj.style.position !== "absolute") {
    el.domObj.style.position = "absolute";
    el.domObj.style.left = 0;
    el.domObj.style.top = 0;
  }
  //
  // Using translate3d leads to beffer animations.
  var topOffset = this.getListTopOffset();
  el.domObj.style.transform = "translate3d(" + (x * this.recWidth) + "px," + ((y * this.recHeight) + topOffset) + "px,0px)";
};


/**
 * Resize the element when the document view is resized
 * @param {Event} ev - the event occured when the document view was resized
 */
Client.Container.prototype.onResize = function (ev)
{
  // First, update template size
  this.updateTemplateSize();
  //
  // Verify if the next page is to get
  if (this.moreRows)
    this.getNextPage();
  //
  // Then, update actual list elements
  Client.Element.prototype.onResize.call(this, ev);
};


/**
 * Update cached template size
 * @param {Event} ev - the event occured when the document view was resized
 */
Client.Container.prototype.updateTemplateSize = function ()
{
  if (this.rowCount !== undefined && this.tmpl) {
    //
    this.tmpl.domObj.style.display = "";
    var s = window.getComputedStyle(this.tmpl.domObj);
    if (this.tmpl.domObj.offsetWidth > 0) {
      this.recWidth = this.tmpl.domObj.offsetWidth + parseInt(s.marginLeft) + parseInt(s.marginRight);
      this.recHeight = this.tmpl.domObj.offsetHeight + parseInt(s.marginTop) + parseInt(s.marginBottom);
      this.tmpl.domObj.style.display = "none";
      this.cacheProp();
      this.updateListBox(true);
    }
  }
};


/**
 * Scroll to position
 * @param {int} pos - the position to move to
 */
Client.Container.prototype.setPosition = function (pos)
{
  var force = true;
  var scrollObj = this.domObj;
  //
  if (pos === undefined) {
    pos = this.position;
    force = false;
  }
  //
  // Calculate record position
  var y;
  var h;
  if (this.recWidth) { // use window
    var nc = Math.max(Math.floor(this.domObj_offsetWidth / this.recWidth), 1);
    y = Math.floor(pos / nc) * this.recHeight;
    h = this.recHeight;
  }
  else { // no window
    //
    // Search for a scrollable container
    var ok = false;
    while (scrollObj) {
      var s = window.getComputedStyle(scrollObj);
      if (s.overflowY !== "visible") {
        ok = true;
        break;
      }
      if (scrollObj.id === "app-ui")
        break;
      scrollObj = scrollObj.parentNode;
    }
    //
    // No scroll will occur
    if (!ok)
      scrollObj = this.domObj;
    //
    // Search for template name
    var tn = this.templateName || "";
    if (!tn) {
      for (var i = 1; i < this.ne(); i++) {
        if (this.elements[i].name === this.elements[i - 1].name) {
          tn = this.elements[i].name;
          break;
        }
      }
    }
    // Search my elements for the position
    if (tn) {
      var c = 0;
      for (var i = 0; i < this.ne(); i++) {
        var e = this.elements[i];
        if (tn === e.name) {
          if (c === this.position) {
            y = e.getRootObject().offsetTop;
            h = e.getRootObject().offsetHeight;
            break;
          }
          c++;
        }
      }
    }
  }
  //
  if (y !== undefined) {
    var ycalc = undefined;
    //
    if (!force) {
      if (y < scrollObj.scrollTop)
        ycalc = y;
      if (y + h > scrollObj.scrollTop + scrollObj.clientHeight)
        ycalc = y + h - scrollObj.clientHeight;
    }
    else
      ycalc = y;
    //
    if (ycalc !== undefined)
      this.scrollWithAnimation(scrollObj, ycalc);
    //
    if (force)
      this.skipUpdate = true;
  }
  return y !== undefined;
};


/**
 * Move scrollTop with an animation
 * @param {DomElement} scrollObj
 * @param {int} newTop
 */
Client.Container.prototype.scrollWithAnimation = function (scrollObj, newTop)
{
  if (this.domObj) {
    // Check if the object can be scrolled now
    // - the domObj and all its parents must be in the DOM
    // - in the chain no node must have 'display:none'
    // - in the chain no node must have an animation (transition)
    var canscroll = true;
    //
    var appui = document.getElementById("app-ui");
    var obj = this.domObj;
    while (obj) {
      if (obj === appui || obj === document)
        break;
      //
      // To know if an animation is ended we use the currentStyle that is live updated during the transition.
      // So if we have a transition we memorize the currentStyle Transition, if at the next tick is the same we could scroll
      // because the transition is probably ended
      var s = obj.style;
      var currentTransition = window.getComputedStyle ? window.getComputedStyle(obj).transition : obj.currentStyle['transition'];
      if (!obj.parentNode || s.display === "none" || (s.transition !== "" && currentTransition !== "" && currentTransition !== this.scrollBlockedTransition)) {
        this.scrollBlockedTransition = currentTransition;
        canscroll = false;
        break;
      }
      obj = obj.parentNode;
    }
    //
    if (!canscroll) {
      if (!this.scrollTimeout) {
        if (!this.nScrollTry)
          this.nScrollTry = 0;
        else
          this.nScrollTry++;
        //
        // To much nScrollTry try, skip the operation
        if (this.nScrollTry > 15) {
          delete this.nScrollTry;
          return;
        }
        //
        this.scrollTimeout = setTimeout(function () {
          delete this.scrollTimeout;
          this.scrollWithAnimation(scrollObj, newTop);
        }.bind(this), 100);
      }
      return;
    }
  }
  //
  // Reset scroll variables
  if (this.scrollTimeout) {
    clearTimeout(this.scrollTimeout);
    delete this.scrollTimeout;
  }
  delete this.scrollBlockedTransition;
  delete this.nScrollTry;
  //
  // Execute scroll now
  var max = scrollObj.scrollHeight - scrollObj.clientHeight;
  if (newTop > max) {
    newTop = max;
    //
    // Send the new value to the server because we cannot fulfill its request
    var e = [];
    e.push({obj: this.id, id: "chgProp", content: {name: "scrollTop", value: newTop, clid: Client.id}});
    Client.mainFrame.sendEvents(e);
  }
  //
  if (this.scrollDuration && this.scrollDuration > 0 && this.animate !== false) {
    //
    if (!this.tweenScroll)
      this.tweenScroll = new Tweenable();
    else if (this.tweenScroll.isPlaying())
      this.tweenScroll.stop();
    //
    var config = {
      from: {scrollTop: scrollObj.scrollTop},
      to: {scrollTop: newTop},
      duration: this.scrollDuration,
      easing: "easeTo",
      step: function (tw) {
        scrollObj.scrollTop = tw.scrollTop;
      },
      finish: function (tw) {
        scrollObj.scrollTop = tw.scrollTop;
      }
    };
    //
    this.tweenScroll.tween(config);
  }
  else
    scrollObj.scrollTop = newTop;
};


/**
 * Set the focus of the container finding the child element that have to get it
 * @param {int} oldPos - the position of the previous focused element
 */
Client.Container.prototype.setFocus = function (oldPos)
{
  var newPos = this.position;
  if (oldPos === undefined)
    oldPos = 0;
  //
  // Get the element containing the element to focus
  var e;
  var curPos;
  //
  var newEl = this.getElementToFocus();
  if (newEl) {
    //
    // If I'm moving forward or I'm moving more than one position back
    // get the first child of the element to focus that can get focus
    if (newPos > oldPos || oldPos - newPos > 1) {
      e = newEl.getFirstFocusableElement();
      curPos = 0;
    }
    else if (newPos < oldPos) { // If I'm moving back, get the last child of the element to focus that can get focus
      e = newEl.getLastFocusableElement();
      curPos = e.domObj.value.length;
    }
  }
  else {
    // An element to focus was not found. If the current position of a child element of the container
    // is the same of the new position, that will be the element to focus
    var p;
    for (var i = 0; i < this.ne(); i++) {
      if (this.elements[i].rownum === newPos) {
        p = this.elements[i];
        break;
      }
    }
    //
    // If an element to focus was found, get its first child that can get focus
    if (p)
      e = p.getFirstFocusableElement();
  }
  //
  // If an element to focus was found, set the focus
  if (e) {
    e.focus();
    Client.Utils.setCursorPos(document.activeElement, curPos);
  }
};


/**
 * Move the focus from a child element to another
 * @param {String} dir - "prev" if the focus has to go to the previous child element
 *                       "next" if the focus has to go to the next child element
 */
Client.Container.prototype.moveFocus = function (dir)
{
  // Get the element containing the element to focus
  var el = this.getElementToFocus();
  if (el) {
    var actEl = document.activeElement;
    var ae = Client.Utils.findElementFromDomObj(actEl);
    //
    // If the previous element has to get focus
    if (dir === "prev") {
      var previousEl = el.getPrevFocusableElement(ae);
      if (previousEl) {
        previousEl.focus();
        Client.Utils.setCursorPos(document.activeElement, document.activeElement.value.length);
      }
    }
    else if (dir === "next") {
      // If the next element has to get focus
      var nextEl = el.getNextFocusableElement(ae);
      if (nextEl) {
        nextEl.focus();
        Client.Utils.setCursorPos(document.activeElement, 0);
      }
    }
  }
};


/**
 * Get the element that should receive the focus
 * @returns {Client.Element|undefined}
 */
Client.Container.prototype.getElementToFocus = function ()
{
  var el;
  var actEl = document.activeElement;
  //
  // Get actual position
  var pos = this.position;
  //
  // If the position is not setted find the object corresponding to the focused element and get its position
  if (pos === undefined) {
    var ae = Client.Utils.findElementFromDomObj(actEl);
    pos = ae.rownum;
    if (pos === undefined)
      pos = 0;
  }
  // Check if the focused element is one of my children
  var parent = actEl.parentNode;
  while (parent) {
    if (parent === this.domObj) {
      // Search the element at the new position
      for (var i = 0; i < this.ne(); i++) {
        if (this.elements[i].rownum === pos) {
          el = this.elements[i];
          break;
        }
      }
      break;
    }
    parent = parent.parentNode;
  }
  //
  return el;
};


/**
 * Change window position to show the same record of the other client
 * @param {int} firstRec - the first record to show
 * @param {int} lastRec - the last record to show
 */
Client.Container.prototype.changeWindow = function (firstRec, lastRec)
{
  this.firstRec = firstRec;
  this.lastRec = lastRec;
  var pthis = this;
  setTimeout(function () {
    pthis.setPosition(firstRec);
  }, 0);
};


/**
 * Getting Next Page to show if scrolling is toward end and more rows is true
 * @param {Event} ev
 */
Client.Container.prototype.getNextPage = function (ev)
{
  var obj = ev?.srcElement;
  //
  // If called directly, we need to use the scrolling container
  if (!obj)
    obj = Client.Utils.getScrollableParent(this.domObj);
  //
  if (this.moreRows) {
    var toGet = false;
    if (this.moreRowsGuard) {
      let guard = this.moreRowsGuard.domObj || this.moreRowsElement;
      //
      if (guard && guard.offsetParent !== obj)
      {
        // Let's check all the gerarchy to find the object with the correct offsetparent
        let tempGuard = guard;
        while (tempGuard && tempGuard.offsetParent !== obj) {
          if (tempGuard.id === "app-ui") {
            tempGuard = undefined;
            break;
          }
          //
          tempGuard = tempGuard.parentNode;
        }
        //
        // If there is no correct object tempguard will be null (we have traced back all the object and the last parent will be undefined)
        // this is only a protection, it should not trigger
        if (tempGuard)
          guard = tempGuard;
      }
      //
      if (guard) {
        if (guard.offsetTop < obj.scrollTop + obj.clientHeight * 3 / 2)
          toGet = true;
      }
    }
    else {
      if (obj.scrollTop + obj.clientHeight >= obj.scrollHeight - obj.clientHeight / 2)
        toGet = true;
    }
    //
    if (toGet) {
      this.moreRows = false;
      var ee = [];
      ee.push({obj: this.id, id: "chgProp", content: {name: "scrollTop", value: obj.scrollTop, clid: Client.id}});
      ee.push({obj: this.id, id: "onNextPage", content: {pos: obj.scrollTop}});
      Client.mainFrame.sendEvents(ee);
    }
  }
};


/**
 * Remove the "more rows" indicator and insert the new element
 * @param {Object} content - contains the element to insert and the id of the existing element. The new element is inserted before this element
 */
Client.Container.prototype.insertBefore = function (content)
{
  if (this.moreRowsElement) {
    this.domObj.removeChild(this.moreRowsElement);
    this.moreRowsElement = null;
  }
  return Client.Element.prototype.insertBefore.call(this, content);
};


/**
 * If there is a 'top element' in the list that is not the template returns its dimension
 * (for using with the reveal scrollcontainer + usewindow datamap)
 */
Client.Container.prototype.getListTopOffset = function ()
{
  return 0;
};


/**
 * Tell to the children that the visibility has changed
 * @param {Boolean} visible
 */
Client.Container.prototype.visibilityChanged = function (visible)
{
  // Update content size after becoming visible
  if (visible)
    this.updateTemplateSize();
  Client.Element.prototype.visibilityChanged.call(this, visible);
};

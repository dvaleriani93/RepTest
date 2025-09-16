/*
 * Instant Developer Cloud
 * Copyright Pro Gamma Spa 2000 - 2021
 * All rights reserved
 */

var Client = Client || {};


/**
 * @class A frame containing buttons
 * @param {Object} widget
 * @param {View|Element} parent - the parent element
 * @param {View} view
 */
Client.IdfTabbedView = function (widget, parent, view)
{
  // Set default events definition
  widget = Object.assign({
    clickEventDef: Client.IdfMessagesPump?.eventTypes.ACTIVE,
    changePageAnimationDef: Client.IdfWebEntryPoint.getAnimationDefault("tab"),
    onlyContent: true
  }, widget);
  //
  Client.IdfFrame.call(this, widget, parent, view);
  //
  // Create the dropdown button and move it into the tabbar
  let dropButton = this.view.createElement(this.dropMenuButtonConf, Client.eleMap[this.tabsContainerConf.id], this.view);
  let tabBar = Client.eleMap[this.tabsContainerConf.id].tabbar;
  tabBar.insertBefore(dropButton.getRootObject(), tabBar.firstChild);
  dropButton.updateElement({visible: this.showDropDownButton()});
};


// Make Client.IdfTabbedView extend Client.IdfFrame
Client.IdfTabbedView.prototype = new Client.IdfFrame();

Client.IdfTabbedView.getRequirements = Client.IdfFrame.getRequirements;

Client.IdfTabbedView.transPropMap = Object.assign({}, Client.IdfFrame.transPropMap, {
  sel: "selectedPage",
  pla: "placement",
  hid: "hiddenTabs",
  cpa: "changePageAnimationDef"
});

Client.IdfTabbedView.place = {
  TOP: 1,
  BOTTOM: 3
};

Client.IdfTabbedView.tabDropLimit = 12;

/**
 * Convert properties values
 * @param {Object} props
 */
Client.IdfTabbedView.convertPropValues = function (props)
{
  props = props || {};
  //
  Client.IdfFrame.convertPropValues(props);
  //
  for (let p in props) {
    switch (p) {
      case Client.IdfTabbedView.transPropMap.hid:
        props[p] = props[p] === "1";
        break;

      case Client.IdfTabbedView.transPropMap.sel:
        // IDF is 1 based and IDC 0 based
        props[p] = parseInt(props[p], 10) - 1;
        break;

      case Client.IdfTabbedView.transPropMap.pla:
        props[p] = parseInt(props[p], 10);
        break;
    }
  }
};


/**
 * Create elements configuration
 * @param {Object} widget
 */
Client.IdfTabbedView.prototype.createElementsConfig = function (widget)
{
  Client.IdfFrame.prototype.createElementsConfig.call(this, widget);
  //
  // The Tabbed view has a different structure
  this.tabsContainerConf = this.createElementConfig({c: "IonTabs", className: "tabbed-view-box", ignoreTabbar: true});
  this.contentContainerConf.children.push(this.tabsContainerConf);
  //
  this.dropMenuButtonConf = this.createElementConfig({c: "IonButton", icon: "arrow-dropdown", className: "generic-btn tab-dropdown-button", events: ["onClick"]});
  //
  // Set animation (if required)
  let isVela = Client.mainFrame.idfTheme === "vela";
  let a = Client.IdfWebEntryPoint.getAnimationByDef(this.changePageAnimationDef);
  if (a && !isVela)
    this.tabsContainerConf.animations = [{trigger: "change", ...a}];
};


/**
 * Append a child DOM Object to root object DOM
 * @param {Element} child - child element that requested the insertion
 * @param {HTMLElement} domObj - child DOM object to add
 */
Client.IdfTabbedView.prototype.appendChildObject = function (child, domObj)
{
  let el = Client.eleMap[this.tabsContainerConf.id];
  el.appendChildObject(child, domObj);
  el.elements.push(child);
  child.parent = el;
  //
  Client.eleMap[this.dropMenuButtonConf.id]?.updateElement({visible: this.showDropDownButton()});
};


/**
 * Update inner elements properties
 * @param {Object} props
 */
Client.IdfTabbedView.prototype.updateElement = function (props)
{
  props = props || {};
  let el = Client.eleMap[this.tabsContainerConf.id];
  //
  Client.IdfFrame.prototype.updateElement.call(this, props);
  //
  if (props.selectedPage !== undefined) {
    this.selectedPage = props.selectedPage;
    el.updateElement({selectedPage: props.selectedPage});
    this.elements[this.selectedPage].focus();
  }
  //
  if (props.placement !== undefined) {
    this.placement = props.placement;
    el.updateElement({placement: (props.placement === Client.IdfTabbedView.place.BOTTOM ? "bottom" : "top")});
  }
  //
  // hiddenTabs from IDF, onlycontent from IDC
  if (props.hiddenTabs !== undefined) {
    this.hiddenTabs = props.hiddenTabs;
    Client.Widget.updateElementClassName(el, "only-content", !this.hiddenTabs);
  }
};


/**
 * Remove a single page
 * @param {Client.IdfTab} page
 */
Client.IdfTabbedView.prototype.deletePage = function (page)
{
  page.close();
  //
  // Remove from my element list
  let elements = this.elements || [];
  for (let i = 0; i < elements.length; i++)
    if (elements[i] === page) {
      elements.splice(i, 1);
      break;
    }
  //
  // Remove also from the IonTabs list
  let el = Client.eleMap[this.tabsContainerConf.id];
  if (el) {
    elements = el.elements || [];
    for (let i = 0; i < elements.length; i++)
      if (elements[i] === page) {
        elements.splice(i, 1);
        break;
      }
  }
  //
  Client.eleMap[this.dropMenuButtonConf.id]?.updateElement({visible: this.showDropDownButton()});
};


/**
 * Handle an event
 * @param {Object} event
 */
Client.IdfTabbedView.prototype.onEvent = function (event)
{
  let events = Client.IdfFrame.prototype.onEvent.call(this, event);
  //
  switch (event.id) {
    case "chgProp":
      // This event has been generated by a widget child element, but server side it has to be notified to widget (valid for IDC)
      if (event.content.name === "selectedPage") {
        this.selectedPage = event.content.value;
        //
        if (this.elements[this.selectedPage]?.elements[0]?.delayResize)
          Client.mainFrame.sendEvents(this.elements[this.selectedPage].elements[0].handleResize());
        if (this.elements[this.selectedPage]?.elements[0]?.delayedUpdate)
          this.elements[this.selectedPage].elements[0].handleDelayedUpdate();
        //
        // Give event the IDF format
        if (Client.mainFrame.isIDF)
          events.push({
            id: "tab",
            def: this.clickEventDef,
            content: {
              oid: this.elements[this.selectedPage].id,
              obn: this.id
            }
          });
      }
      //
      if (!Client.mainFrame.isIDF) {
        event.obj = this.id;
        events.push(event);
      }
      break;

    case "onChangePage":
      // This event has been generated by a widget child element, but server side it has to be notified to widget (valid for IDC)
      if (!Client.mainFrame.isIDF) {
        event.obj = this.id;
        events.push(event);
      }
      break;

    case "onClick":
      if (event.obj === this.dropMenuButtonConf.id) {
        let tabBar = Client.eleMap[this.tabsContainerConf.id].tabbar;
        let rct = tabBar.getBoundingClientRect();
        //
        let buttons = [];
        let alertOpts = {
          style: "tab-list-controls",
          buttons,
          rect: {
            top: rct.top + rct.height,
            left: rct.left
          }
        };
        //
        for (let i = 0; i < this.elements.length; i++) {
          if (!(this.elements[i] instanceof Client.IdfTab) || !this.elements[i]?.visible)
            continue;
          //
          let data = Client.Widget.extractCaptionData(this.elements[i].caption);
          let but = {id: i, text: data.caption};
          //
          // Set the focus to the selected tab
          if (i === this.selectedPage) {
            but.focus = true;
            but.cssClass = "active-page";
          }
          //
          // Add the image
          if (data.icon && Client.Widget.isIconImage(data.icon))
            but.icon = data.icon;
          //
          buttons.push(but);
        }
        //
        Client.IonHelper.createAlert(alertOpts, (r, values, ev) => {
          // Dropdown closed by clicking out
          if (r === null)
            return;
          let evts = [];
          //
          this.updateElement({selectedPage: r});
          //
          // Scroll to the selected tab
          let linkObj = this.elements[this.selectedPage]?.mainObjects[0]?.linkObj;
          linkObj?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "center"});
          //
          if (Client.mainFrame.isIDF)
            evts.push({
              id: "tab",
              def: this.clickEventDef,
              content: {
                oid: this.elements[this.selectedPage].id,
                obn: this.id
              }
            });
          else
            evts.push({
              id: "chgProp",
              obj: this.id,
              content: {
                name: "selectedPage",
                value: this.selectedPage
              }
            });
          //
          if (evts.length > 0)
            Client.mainFrame.sendEvents(evts);
        });
      }
      break;
  }
  //
  return events;
};


/**
 * Get root object. Root object is the object where children will be inserted
 * @param {Boolean} el - if true, get the element itself istead of its domObj
 */
Client.IdfTabbedView.prototype.getRootObject = function (el)
{
  let rootObject = this.mainObjects[0];
  return el ? rootObject : rootObject.domObj;
};


/**
 * Get click detail
 * @param {Object} event
 * @param {Widget} srcWidget
 */
Client.IdfTabbedView.prototype.getClickDetail = function (event, srcWidget)
{
  let detail = Client.IdfFrame.prototype.getClickDetail.call(this, event, srcWidget);
  //
  // TODO: identify the click on the page tab
  if (Client.mainFrame.isIDF)
    detail.par4 = srcWidget?.id;
  else {
    if (srcWidget instanceof Client.IdfTab)
      detail.tab = srcWidget.index;
  }
  //
  return detail;
};


/**
 * Get tabbar height
 */
Client.IdfTabbedView.prototype.getTabbarHeight = function ()
{
  return this.tabbarHeight || 0;
};


/**
 * Calculate objects dimensions
 */
Client.IdfTabbedView.prototype.calcDimensions = function ()
{
  Client.IdfFrame.prototype.calcDimensions.call(this);
  //
  let tabbar = Client.eleMap[this.tabsContainerConf.id].tabbar;
  this.tabbarHeight = tabbar.offsetHeight;
  if (this.tabbarHeight !== 0) {
    let compStyle = getComputedStyle(tabbar);
    this.tabbarHeight += (parseInt(compStyle.marginTop) || 0) + (parseInt(compStyle.marginBottom) || 0);
  }
};


/**
 * Remove the element and its children from the element map
 * @param {boolean} firstLevel - if true remove the dom of the element too
 * @param {boolean} triggerAnimation - if true and on firstLevel trigger the animation of 'removing'
 */
Client.IdfTabbedView.prototype.close = function (firstLevel, triggerAnimation)
{
  Client.IdfFrame.prototype.close.call(this, firstLevel, triggerAnimation);
  delete this.dropMenuButtonConf;
};


/**
 * Check if we need to show the dropdown button
 * @returns {boolean}
 */
Client.IdfTabbedView.prototype.showDropDownButton = function ()
{
  return !Client.mainFrame.idfMobile && this.elements.length >= Client.IdfTabbedView.tabDropLimit;
};

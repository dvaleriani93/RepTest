/*
@license

dhtmlxChart v.6.3.1 GPL

This software is covered by GPL license.
To use it in non-GPL project, you need obtain Commercial or Enterprise license
Please contact sales@dhtmlx.com. Usage without proper license is prohibited.
(c) XB Software.

*/
if (window.dhx){ window.dhx_legacy = dhx; delete window.dhx; }(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["dhx"] = factory();
	else
		root["dhx"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/codebase/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 27);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var dom = __webpack_require__(33);
exports.el = dom.defineElement;
exports.sv = dom.defineSvgElement;
exports.view = dom.defineView;
exports.create = dom.createView;
exports.inject = dom.injectView;
exports.KEYED_LIST = dom.KEYED_LIST;
function disableHelp() {
    dom.DEVMODE.mutations = false;
    dom.DEVMODE.warnings = false;
    dom.DEVMODE.verbose = false;
    dom.DEVMODE.UNKEYED_INPUT = false;
}
exports.disableHelp = disableHelp;
function resizer(handler) {
    var resize = window.ResizeObserver;
    var activeHandler = function (node) {
        var height = node.el.offsetHeight;
        var width = node.el.offsetWidth;
        handler(width, height);
    };
    if (resize) {
        return exports.el("div.dhx-resize-observer", {
            _hooks: {
                didInsert: function (node) {
                    new resize(function () { return activeHandler(node); }).observe(node.el);
                }
            }
        });
    }
    return exports.el("iframe.dhx-resize-observer", {
        _hooks: {
            didInsert: function (node) {
                node.el.contentWindow.onresize = function () { return activeHandler(node); };
                activeHandler(node);
            }
        }
    });
}
exports.resizer = resizer;
function resizeHandler(container, handler) {
    return exports.create({ render: function () { return resizer(handler); } }).mount(container);
}
exports.resizeHandler = resizeHandler;
function awaitRedraw() {
    return new Promise(function (res) {
        requestAnimationFrame(function () {
            res();
        });
    });
}
exports.awaitRedraw = awaitRedraw;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var defaultColors = [
    "#394E79",
    "#5E83BA",
    "#C2D2E9",
    "#647B37",
    "#98A468",
    "#F0D0A9",
    "#EEB98E",
    "#9A8BA5",
    "#E3C5D5"
];
function getDefaultColor(index) {
    if (index === void 0) { index = 0; }
    return defaultColors[index];
}
exports.getDefaultColor = getDefaultColor;
function locator(value) {
    if (!value) {
        return function () { return ""; };
    }
    if (typeof value === "string") {
        return function (obj) { return obj[value]; };
    }
    else {
        return value;
    }
}
exports.locator = locator;
function log10(x) {
    return Math.log(x) / Math.LN10;
}
exports.log10 = log10;
exports.getTextWidth = anyArgsMemo(function (text, font) {
    if (font === void 0) { font = ""; }
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    if (font) {
        ctx.font = font;
    }
    return ctx.measureText(text).width;
});
function anyArgsMemo(fn) {
    var cached = {};
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var mem = cached;
        for (var i = 0; i < args.length - 1; i++) {
            mem[args[i]] = mem[args[i]] || {};
            mem = mem[args[i]];
        }
        var last = args.length - 1;
        if (mem[last]) {
            return mem[last];
        }
        return mem[last] = fn.apply(void 0, args);
    };
}
function memo(fn) {
    var cached = {};
    return function (arg) {
        if (cached[arg]) {
            return cached[arg];
        }
        return cached[arg] = fn(arg);
    };
}
function getRgbaFromColor(color) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 2, 2);
    var rgba = ctx.getImageData(1, 1, 1, 1).data;
    return [rgba[0], rgba[1], rgba[2]];
}
var memoizedColorFromRgba = memo(getRgbaFromColor);
function getColorShade(color, light) {
    var _a = memoizedColorFromRgba(color).map(function (value) { return Math.floor(value * light + 255 * (1 - light)); }), r = _a[0], g = _a[1], b = _a[2];
    return "rgb(" + r + "," + g + "," + b + ")";
}
exports.getColorShade = getColorShade;
exports.getFontStyle = memo(function (className) {
    var chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chart.setAttribute("class", "dhx_chart");
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("class", className);
    chart.setAttribute("visibility", "hidden");
    text.textContent = "test";
    chart.appendChild(text);
    document.body.appendChild(chart);
    var style = getComputedStyle(text);
    var font = style.fontSize + " " + style.fontFamily;
    document.body.removeChild(chart);
    return font;
});
function linearGradient(grad, id) {
    var stops = grad.stops;
    var colors = stops.map(function (item) { return dom_1.sv("stop", { "offset": item.offset * 100 + "%", "stop-color": item.color, "stop-opacity": item.opacity || 1 }); });
    var gradient = dom_1.sv("linearGradient", {
        id: id,
        gradientTransform: "rotate(90)"
    }, colors);
    return gradient;
}
exports.linearGradient = linearGradient;
function getRadialGradient(opts, stops, id) {
    var colors = stops.map(function (item) { return dom_1.sv("stop", { "offset": item.offset, "stop-color": item.color, "stop-opacity": item.opacity || 1 }); });
    var gradient = dom_1.sv("radialGradient", __assign({ id: id, cx: 0, cy: 0, gradientUnits: "userSpaceOnUse" }, opts), colors);
    return gradient;
}
exports.getRadialGradient = getRadialGradient;
function euclideanDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}
exports.euclideanDistance = euclideanDistance;
function verticalCenteredText(text) {
    return dom_1.sv("tspan", {
        dy: "0.5ex"
    }, text);
}
exports.verticalCenteredText = verticalCenteredText;
function verticalTopText(text) {
    return dom_1.sv("tspan", {
        dy: "-0.5ex"
    }, text);
}
exports.verticalTopText = verticalTopText;
function verticalBottomText(text) {
    return dom_1.sv("tspan", {
        dy: "1.5ex"
    }, text);
}
exports.verticalBottomText = verticalBottomText;
function calcPointRef(pointId, serieId) {
    return pointId + "_" + serieId;
}
exports.calcPointRef = calcPointRef;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ChartType;
(function (ChartType) {
    ChartType["bar"] = "bar";
    ChartType["line"] = "line";
    ChartType["spline"] = "spline";
    ChartType["scatter"] = "scatter";
    ChartType["area"] = "area";
    ChartType["donut"] = "donut";
    ChartType["pie"] = "pie";
    ChartType["pie3D"] = "pie3D";
    ChartType["radar"] = "radar";
    ChartType["xBar"] = "xbar";
    ChartType["splineArea"] = "splineArea";
})(ChartType = exports.ChartType || (exports.ChartType = {}));
var ChartEvents;
(function (ChartEvents) {
    ChartEvents["toggleSeries"] = "toggleSeries";
    ChartEvents["chartMouseMove"] = "chartMouseMove";
    ChartEvents["chartMouseLeave"] = "chartMouseLeave";
    ChartEvents["resize"] = "resize";
})(ChartEvents = exports.ChartEvents || (exports.ChartEvents = {}));
var ScaleType;
(function (ScaleType) {
    ScaleType["left"] = "left";
    ScaleType["right"] = "right";
    ScaleType["top"] = "top";
    ScaleType["bottom"] = "bottom";
    ScaleType["radial"] = "radial";
})(ScaleType = exports.ScaleType || (exports.ScaleType = {}));
var PointType;
(function (PointType) {
    PointType["circle"] = "circle";
    PointType["rect"] = "rect";
    PointType["triangle"] = "triangle";
    PointType["rhombus"] = "rhombus";
    PointType["simpleRect"] = "simpleRect";
    PointType["simpleCircle"] = "simpleCircle";
    PointType["empty"] = "empty";
})(PointType = exports.PointType || (exports.PointType = {}));
var TooltipType;
(function (TooltipType) {
    TooltipType["simple"] = "simple";
    TooltipType["right"] = "right";
    TooltipType["left"] = "left";
    TooltipType["top"] = "top";
    TooltipType["bot"] = "bot";
})(TooltipType = exports.TooltipType || (exports.TooltipType = {}));
var Shape;
(function (Shape) {
    Shape["rect"] = "rect";
    Shape["circle"] = "circle";
})(Shape = exports.Shape || (exports.Shape = {}));
var HorizontalPosition;
(function (HorizontalPosition) {
    HorizontalPosition["left"] = "left";
    HorizontalPosition["center"] = "center";
    HorizontalPosition["right"] = "right";
})(HorizontalPosition = exports.HorizontalPosition || (exports.HorizontalPosition = {}));
var VerticalPosition;
(function (VerticalPosition) {
    VerticalPosition["top"] = "top";
    VerticalPosition["middle"] = "middle";
    VerticalPosition["bottom"] = "bottom";
})(VerticalPosition = exports.VerticalPosition || (exports.VerticalPosition = {}));
var NoScaleSubType;
(function (NoScaleSubType) {
    NoScaleSubType["basic"] = "basic";
    NoScaleSubType["percentOnly"] = "percentOnly";
    NoScaleSubType["valueOnly"] = "valueOnly";
})(NoScaleSubType = exports.NoScaleSubType || (exports.NoScaleSubType = {}));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = __webpack_require__(11);
var counter = (new Date()).valueOf();
function uid() {
    return "u" + (counter++);
}
exports.uid = uid;
function extend(target, source, deep) {
    if (deep === void 0) { deep = true; }
    if (source) {
        for (var key in source) {
            var sobj = source[key];
            var tobj = target[key];
            if (deep && typeof tobj === "object" && !(tobj instanceof Date) && !(tobj instanceof Array)) {
                extend(tobj, sobj);
            }
            else {
                target[key] = sobj;
            }
        }
    }
    return target;
}
exports.extend = extend;
function copy(source, withoutInner) {
    var result = {};
    for (var key in source) {
        if (!withoutInner || key[0] !== "$") {
            result[key] = source[key];
        }
    }
    return result;
}
exports.copy = copy;
function naturalSort(arr) {
    return arr.sort(function (a, b) {
        var nn = typeof a === "string" ? a.localeCompare(b) : a - b;
        return nn;
    });
}
exports.naturalSort = naturalSort;
function findIndex(arr, predicate) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
function isEqualString(from, to) {
    if (from.length > to.length) {
        return false;
    }
    for (var i = 0; i < from.length; i++) {
        if (from[i].toLowerCase() !== to[i].toLowerCase()) {
            return false;
        }
    }
    return true;
}
exports.isEqualString = isEqualString;
function singleOuterClick(fn) {
    var click = function (e) {
        if (fn(e)) {
            document.removeEventListener("click", click);
        }
    };
    document.addEventListener("click", click);
}
exports.singleOuterClick = singleOuterClick;
function detectWidgetClick(widgetId, cb) {
    var click = function (e) { return cb(html_1.locate(e, "dhx_widget_id") === widgetId); };
    document.addEventListener("click", click);
    return function () { return document.removeEventListener("click", click); };
}
exports.detectWidgetClick = detectWidgetClick;
function unwrapBox(box) {
    if (Array.isArray(box)) {
        return box[0];
    }
    return box;
}
exports.unwrapBox = unwrapBox;
function wrapBox(unboxed) {
    if (Array.isArray(unboxed)) {
        return unboxed;
    }
    return [unboxed];
}
exports.wrapBox = wrapBox;
function isDefined(some) {
    return some !== null && some !== undefined;
}
exports.isDefined = isDefined;
function range(from, to) {
    if (from > to) {
        return [];
    }
    var result = [];
    while (from <= to) {
        result.push(from++);
    }
    return result;
}
exports.range = range;
function isNumeric(val) {
    return !isNaN(val - parseFloat(val));
}
exports.isNumeric = isNumeric;
function downloadFile(data, filename, mimeType) {
    if (mimeType === void 0) { mimeType = "text/plain"; }
    var file = new Blob([data], { type: mimeType });
    if (window.navigator.msSaveOrOpenBlob) {
        // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    }
    else {
        var a_1 = document.createElement("a");
        var url_1 = URL.createObjectURL(file);
        a_1.href = url_1;
        a_1.download = filename;
        document.body.appendChild(a_1);
        a_1.click();
        setTimeout(function () {
            document.body.removeChild(a_1);
            window.URL.revokeObjectURL(url_1);
        }, 0);
    }
}
exports.downloadFile = downloadFile;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TreeFilterType;
(function (TreeFilterType) {
    TreeFilterType["all"] = "all";
    TreeFilterType["level"] = "level";
    TreeFilterType["leafs"] = "leafs";
})(TreeFilterType = exports.TreeFilterType || (exports.TreeFilterType = {}));
var DropPosition;
(function (DropPosition) {
    DropPosition["top"] = "top";
    DropPosition["bot"] = "bot";
    DropPosition["in"] = "in";
})(DropPosition = exports.DropPosition || (exports.DropPosition = {}));
var DataEvents;
(function (DataEvents) {
    DataEvents["afterAdd"] = "afteradd";
    DataEvents["beforeAdd"] = "beforeadd";
    DataEvents["removeAll"] = "removeall";
    DataEvents["beforeRemove"] = "beforeremove";
    DataEvents["afterRemove"] = "afterremove";
    DataEvents["change"] = "change";
    DataEvents["load"] = "load";
    DataEvents["loadError"] = "loaderror";
})(DataEvents = exports.DataEvents || (exports.DataEvents = {}));
var DragEvents;
(function (DragEvents) {
    DragEvents["beforeDrag"] = "beforedrag";
    DragEvents["beforeDrop"] = "beforeDrop";
    DragEvents["dragStart"] = "dragstart";
    DragEvents["dragEnd"] = "dragend";
    DragEvents["canDrop"] = "candrop";
    DragEvents["cancelDrop"] = "canceldrop";
    DragEvents["dropComplete"] = "dropcomplete";
    DragEvents["dragOut"] = "dragOut";
    DragEvents["dragIn"] = "dragIn"; // fire on source
})(DragEvents = exports.DragEvents || (exports.DragEvents = {}));
var DragMode;
(function (DragMode) {
    DragMode["target"] = "target";
    DragMode["both"] = "both";
    DragMode["source"] = "source";
})(DragMode = exports.DragMode || (exports.DragMode = {}));
var DropBehaviour;
(function (DropBehaviour) {
    DropBehaviour["child"] = "child";
    DropBehaviour["sibling"] = "sibling";
    DropBehaviour["complex"] = "complex";
})(DropBehaviour = exports.DropBehaviour || (exports.DropBehaviour = {}));
var DataDriver;
(function (DataDriver) {
    DataDriver["json"] = "json";
    DataDriver["csv"] = "csv";
    DataDriver["xml"] = "xml";
})(DataDriver = exports.DataDriver || (exports.DataDriver = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dataproxy_1 = __webpack_require__(7);
var drivers_1 = __webpack_require__(20);
function isEqualObj(a, b) {
    for (var key in a) {
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
exports.isEqualObj = isEqualObj;
function naturalCompare(a, b) {
    if (isNaN(a) || isNaN(b)) {
        var ax_1 = [];
        var bx_1 = [];
        a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            ax_1.push([$1 || Infinity, $2 || ""]);
        });
        b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
            bx_1.push([$1 || Infinity, $2 || ""]);
        });
        while (ax_1.length && bx_1.length) {
            var an = ax_1.shift();
            var bn = bx_1.shift();
            var nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
            if (nn) {
                return nn;
            }
        }
        return ax_1.length - bx_1.length;
    }
    return a - b;
}
exports.naturalCompare = naturalCompare;
function findByConf(item, conf) {
    if (typeof conf === "function") {
        if (conf.call(this, item)) {
            return item;
        }
    }
    else if (conf.by && conf.match) {
        if (item[conf.by] === conf.match) {
            return item;
        }
    }
}
exports.findByConf = findByConf;
function isDebug() {
    var dhx = window.dhx;
    if (typeof dhx !== "undefined") {
        return typeof (dhx.debug) !== "undefined" && dhx.debug;
    }
    // return typeof DHX_DEBUG_MODE !== "undefined" && DHX_DEBUG_MODE;
}
exports.isDebug = isDebug;
function dhxWarning(msg) {
    // tslint:disable-next-line:no-console
    console.warn(msg);
}
exports.dhxWarning = dhxWarning;
function dhxError(msg) {
    throw new Error(msg);
}
exports.dhxError = dhxError;
function toProxy(proxy) {
    var type = typeof proxy;
    if (type === "string") {
        return new dataproxy_1.DataProxy(proxy);
    }
    else if (type === "object") {
        return proxy;
    }
}
exports.toProxy = toProxy;
function toDataDriver(driver) {
    if (typeof driver === "string") {
        var dhx = window.dhx;
        var drivers = (dhx && dhx.dataDrivers) || drivers_1.dataDrivers;
        if (drivers[driver]) {
            return new drivers[driver]();
        }
        else {
            // tslint:disable-next-line:no-console
            console.warn("Incorrect data driver type:", driver);
            // tslint:disable-next-line:no-console
            console.warn("Available types:", JSON.stringify(Object.keys(drivers)));
        }
    }
    else if (typeof driver === "object") {
        return driver;
    }
}
exports.toDataDriver = toDataDriver;
function copyWithoutInner(obj, forbidden) {
    var result = {};
    for (var key in obj) {
        if (key[0] !== "$" && (!forbidden || !forbidden[key])) {
            result[key] = obj[key];
        }
    }
    return result;
}
exports.copyWithoutInner = copyWithoutInner;
function isTreeCollection(obj) {
    return Boolean(obj.getRoot);
}
exports.isTreeCollection = isTreeCollection;
function hasJsonOrArrayStructure(str) {
    if (typeof str === "object") {
        return true;
    }
    if (typeof str !== "string") {
        return false;
    }
    try {
        var result = JSON.parse(str);
        return Object.prototype.toString.call(result) === "[object Object]"
            || Array.isArray(result);
    }
    catch (err) {
        return false;
    }
}
exports.hasJsonOrArrayStructure = hasJsonOrArrayStructure;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
function getCoordinates(percent, radiusX, radiusY) {
    var x = Math.cos(2 * Math.PI * percent) * radiusX;
    var y = Math.sin(2 * Math.PI * percent) * radiusY;
    return [x, y];
}
exports.getCoordinates = getCoordinates;
function shiftCoordinates(item, dx, dy) {
    return [item[0] + dx, item[1] + dy];
}
exports.shiftCoordinates = shiftCoordinates;
exports.pieLikeHandlers = {
    onmouseover: function (shiftX, shiftY, _, node) {
        node.el.setAttribute("transform", "translate(" + shiftX + ", " + shiftY + ") scale(1.05)");
        node.el.classList.add("dhx_pie-transform-delay");
    },
    onmouseout: function (_, node) {
        node.el.setAttribute("transform", "translate(0, 0)");
        node.el.classList.remove("dhx_pie-transform-delay");
    }
};
function checkMiss(v, r) {
    var miss = .000001;
    return v - miss < r && v + miss > r;
}
function drawBackgroundCircle(radius, color) {
    return dom_1.sv("circle", { cx: 0, cy: 0, r: radius, fill: color, stroke: "none", class: "background-circle" });
}
function arc(r, flag) {
    return "M" + -r + ",0A" + r + "," + r + " 0 " + (flag ? 0 : 1) + " 1 " + r + ",0A" + r + "," + r + " 0 " + (flag ? 0 : 1) + " 1 " + -r + ",0";
}
function radarScale(data, width, height) {
    var radius = height / 2;
    var scalePercent = 1 / data.scales.length;
    var largeArcFlag = scalePercent > .5 ? 1 : 0;
    var svg = [];
    var background = drawBackgroundCircle(radius, "#FAFBFD");
    svg.push(background);
    var currentPercent = -.25;
    var grid = [];
    var axis = data.axis;
    var gridClass = "radar-grid " + (data.zebra ? "zebra" : "");
    for (var i = 1; i < axis.length; i += 2) {
        var r1 = radius * axis[i - 1];
        var r2 = radius * axis[i];
        var d = arc(r1, true) + " " + arc(r2, false);
        var arcs = dom_1.sv("path", { d: d, fill: "none", stroke: "black", class: gridClass });
        grid.push(arcs);
    }
    svg.push(grid);
    data.scales.forEach(function (item) {
        var _a = getCoordinates(currentPercent, radius, radius), startX = _a[0], startY = _a[1];
        var nextPercent = currentPercent + scalePercent;
        var _b = getCoordinates(nextPercent, radius, radius), endX = _b[0], endY = _b[1];
        var d = "M " + startX + " " + startY + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 1 " + endX + " " + endY + " L 0 0";
        var path = dom_1.sv("path", {
            d: d,
            stroke: "black",
            fill: "none",
            class: "radar-scale"
        });
        svg.push(path);
        var _c = [8, 8], yTextPadding = _c[0], xTextPadding = _c[1];
        var dy = checkMiss(currentPercent, 0) || checkMiss(currentPercent, 0.5) ? 0 : currentPercent < 0 || currentPercent > 0.5 ? -yTextPadding : yTextPadding;
        var dx = checkMiss(currentPercent, -0.25) || checkMiss(currentPercent, 0.25) ? 0 : currentPercent < -0.25 || currentPercent > 0.25 ? -xTextPadding : xTextPadding;
        if (checkMiss(currentPercent, -0.25) || checkMiss(currentPercent, 0.25)) {
            var alignFn = checkMiss(currentPercent, -0.25) ? common_1.verticalTopText : common_1.verticalBottomText;
            var text = dom_1.sv("text", { x: startX + dx, y: startY + dy, class: "scale-text" }, [alignFn(item)]);
            svg.push(text);
        }
        else {
            var className = currentPercent >= -0.25 && currentPercent <= 0.25 ? "start-text scale-text" : "end-text scale-text";
            var text = dom_1.sv("text", { x: startX + dx, y: startY + dy, class: className }, [common_1.verticalCenteredText(item)]);
            svg.push(text);
        }
        currentPercent = nextPercent;
    });
    currentPercent = -.25;
    if (data.realAxis) {
        var scaleText = data.realAxis.map(function (item, index) {
            var _a = getCoordinates(-0.25, radius * axis[index], radius * axis[index]), x = _a[0], y = _a[1];
            return dom_1.sv("text", { x: x, y: y, dx: -10, class: "radar-axis-text" }, [common_1.verticalCenteredText(item.toString())]);
        });
        svg.push(scaleText);
    }
    return dom_1.sv("g", { transform: "translate(" + width / 2 + ", " + height / 2 + ")" }, svg);
}
exports.radarScale = radarScale;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ajax_1 = __webpack_require__(19);
var DataProxy = /** @class */ (function () {
    function DataProxy(url) {
        this.url = url;
    }
    DataProxy.prototype.load = function () {
        return ajax_1.ajax.get(this.url);
    };
    DataProxy.prototype.save = function (data, mode) {
        switch (mode) {
            case "delete":
                return ajax_1.ajax.delete(this.url, data);
            case "update":
            case "insert":
            default: return ajax_1.ajax.post(this.url, data);
        }
    };
    return DataProxy;
}());
exports.DataProxy = DataProxy;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, setImmediate) {(function () {
  global = this

  var queueId = 1
  var queue = {}
  var isRunningTask = false

  if (!global.setImmediate)
    global.addEventListener('message', function (e) {
      if (e.source == global){
        if (isRunningTask)
          nextTick(queue[e.data])
        else {
          isRunningTask = true
          try {
            queue[e.data]()
          } catch (e) {}

          delete queue[e.data]
          isRunningTask = false
        }
      }
    })

  function nextTick(fn) {
    if (global.setImmediate) setImmediate(fn)
    // if inside of web worker
    else if (global.importScripts) setTimeout(fn)
    else {
      queueId++
      queue[queueId] = fn
      global.postMessage(queueId, '*')
    }
  }

  Deferred.resolve = function (value) {
    if (!(this._d == 1))
      throw TypeError()

    if (value instanceof Deferred)
      return value

    return new Deferred(function (resolve) {
        resolve(value)
    })
  }

  Deferred.reject = function (value) {
    if (!(this._d == 1))
      throw TypeError()

    return new Deferred(function (resolve, reject) {
        reject(value)
    })
  }

  Deferred.all = function (arr) {
    if (!(this._d == 1))
      throw TypeError()

    if (!(arr instanceof Array))
      return Deferred.reject(TypeError())

    var d = new Deferred()

    function done(e, v) {
      if (v)
        return d.resolve(v)

      if (e)
        return d.reject(e)

      var unresolved = arr.reduce(function (cnt, v) {
        if (v && v.then)
          return cnt + 1
        return cnt
      }, 0)

      if(unresolved == 0)
        d.resolve(arr)

      arr.map(function (v, i) {
        if (v && v.then)
          v.then(function (r) {
            arr[i] = r
            done()
            return r
          }, done)
      })
    }

    done()

    return d
  }

  Deferred.race = function (arr) {
    if (!(this._d == 1))
      throw TypeError()

    if (!(arr instanceof Array))
      return Deferred.reject(TypeError())

    if (arr.length == 0)
      return new Deferred()

    var d = new Deferred()

    function done(e, v) {
      if (v)
        return d.resolve(v)

      if (e)
        return d.reject(e)

      var unresolved = arr.reduce(function (cnt, v) {
        if (v && v.then)
          return cnt + 1
        return cnt
      }, 0)

      if(unresolved == 0)
        d.resolve(arr)

      arr.map(function (v, i) {
        if (v && v.then)
          v.then(function (r) {
            done(null, r)
          }, done)
      })
    }

    done()

    return d
  }

  Deferred._d = 1


  /**
   * @constructor
   */
  function Deferred(resolver) {
    'use strict'
    if (typeof resolver != 'function' && resolver != undefined)
      throw TypeError()

    if (typeof this != 'object' || (this && this.then))
      throw TypeError()

    // states
    // 0: pending
    // 1: resolving
    // 2: rejecting
    // 3: resolved
    // 4: rejected
    var self = this,
      state = 0,
      val = 0,
      next = [],
      fn, er;

    self['promise'] = self

    self['resolve'] = function (v) {
      fn = self.fn
      er = self.er
      if (!state) {
        val = v
        state = 1

        nextTick(fire)
      }
      return self
    }

    self['reject'] = function (v) {
      fn = self.fn
      er = self.er
      if (!state) {
        val = v
        state = 2

        nextTick(fire)

      }
      return self
    }

    self['_d'] = 1

    self['then'] = function (_fn, _er) {
      if (!(this._d == 1))
        throw TypeError()

      var d = new Deferred()

      d.fn = _fn
      d.er = _er
      if (state == 3) {
        d.resolve(val)
      }
      else if (state == 4) {
        d.reject(val)
      }
      else {
        next.push(d)
      }

      return d
    }

    self['catch'] = function (_er) {
      return self['then'](null, _er)
    }

    var finish = function (type) {
      state = type || 4
      next.map(function (p) {
        state == 3 && p.resolve(val) || p.reject(val)
      })
    }

    try {
      if (typeof resolver == 'function')
        resolver(self['resolve'], self['reject'])
    } catch (e) {
      self['reject'](e)
    }

    return self

    // ref : reference to 'then' function
    // cb, ec, cn : successCallback, failureCallback, notThennableCallback
    function thennable (ref, cb, ec, cn) {
      // Promises can be rejected with other promises, which should pass through
      if (state == 2) {
        return cn()
      }
      if ((typeof val == 'object' || typeof val == 'function') && typeof ref == 'function') {
        try {

          // cnt protects against abuse calls from spec checker
          var cnt = 0
          ref.call(val, function (v) {
            if (cnt++) return
            val = v
            cb()
          }, function (v) {
            if (cnt++) return
            val = v
            ec()
          })
        } catch (e) {
          val = e
          ec()
        }
      } else {
        cn()
      }
    };

    function fire() {

      // check if it's a thenable
      var ref;
      try {
        ref = val && val.then
      } catch (e) {
        val = e
        state = 2
        return fire()
      }

      thennable(ref, function () {
        state = 1
        fire()
      }, function () {
        state = 2
        fire()
      }, function () {
        try {
          if (state == 1 && typeof fn == 'function') {
            val = fn(val)
          }

          else if (state == 2 && typeof er == 'function') {
            val = er(val)
            state = 1
          }
        } catch (e) {
          val = e
          return finish()
        }

        if (val == self) {
          val = TypeError()
          finish()
        } else thennable(ref, function () {
            finish(3)
          }, finish, function () {
            finish(state == 1 && 3)
          })

      })
    }


  }

  // Export our library object, either for node.js or as a globally scoped variable
  if (true) {
    module['exports'] = Deferred
  } else {}
})()

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(9), __webpack_require__(30).setImmediate))

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var EventSystem = /** @class */ (function () {
    function EventSystem(context) {
        this.events = {};
        this.context = context || this;
    }
    EventSystem.prototype.on = function (name, callback, context) {
        var event = name.toLowerCase();
        this.events[event] = this.events[event] || [];
        this.events[event].push({ callback: callback, context: context || this.context });
    };
    EventSystem.prototype.detach = function (name, context) {
        var event = name.toLowerCase();
        var eStack = this.events[event];
        if (context && eStack && eStack.length) {
            for (var i = eStack.length - 1; i >= 0; i--) {
                if (eStack[i].context === context) {
                    eStack.splice(i, 1);
                }
            }
        }
        else {
            this.events[event] = [];
        }
    };
    EventSystem.prototype.fire = function (name, args) {
        if (typeof args === "undefined") {
            args = [];
        }
        var event = name.toLowerCase();
        if (this.events[event]) {
            var res = this.events[event].map(function (e) { return e.callback.apply(e.context, args); });
            return res.indexOf(false) < 0;
        }
        return true;
    };
    EventSystem.prototype.clear = function () {
        this.events = {};
    };
    return EventSystem;
}());
exports.EventSystem = EventSystem;
function EventsMixin(obj) {
    obj = obj || {};
    var eventSystem = new EventSystem(obj);
    obj.detachEvent = eventSystem.detach.bind(eventSystem);
    obj.attachEvent = eventSystem.on.bind(eventSystem);
    obj.callEvent = eventSystem.fire.bind(eventSystem);
}
exports.EventsMixin = EventsMixin;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(34);
function toNode(node) {
    if (typeof node === "string") {
        node = (document.getElementById(node) || document.querySelector(node));
    }
    return node || document.body;
}
exports.toNode = toNode;
function eventHandler(prepare, hash) {
    var keys = Object.keys(hash);
    return function (ev) {
        var data = prepare(ev);
        var node = ev.target;
        while (node) {
            var cssstring = node.getAttribute ? (node.getAttribute("class") || "") : "";
            if (cssstring.length) {
                var css = cssstring.split(" ");
                for (var j = 0; j < keys.length; j++) {
                    if (css.indexOf(keys[j]) > -1) {
                        return hash[keys[j]](ev, data);
                    }
                }
            }
            node = node.parentNode;
        }
        return true;
    };
}
exports.eventHandler = eventHandler;
function locate(target, attr) {
    if (attr === void 0) { attr = "dhx_id"; }
    var node = locateNode(target, attr);
    return node ? node.getAttribute(attr) : "";
}
exports.locate = locate;
function locateNode(target, attr, dir) {
    if (attr === void 0) { attr = "dhx_id"; }
    if (dir === void 0) { dir = "target"; }
    if (target instanceof Event) {
        target = target[dir];
    }
    while (target) {
        if (target.getAttribute && target.getAttribute(attr)) {
            return target;
        }
        target = target.parentNode;
    }
}
exports.locateNode = locateNode;
function getBox(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var scrollTop = window.pageYOffset || body.scrollTop;
    var scrollLeft = window.pageXOffset || body.scrollLeft;
    var top = box.top + scrollTop;
    var left = box.left + scrollLeft;
    var right = body.offsetWidth - box.right;
    var bottom = body.offsetHeight - box.bottom;
    var width = box.right - box.left;
    var height = box.bottom - box.top;
    return { top: top, left: left, right: right, bottom: bottom, width: width, height: height };
}
exports.getBox = getBox;
var scrollWidth = -1;
function getScrollbarWidth() {
    if (scrollWidth > -1) {
        return scrollWidth;
    }
    var scrollDiv = document.createElement("div");
    document.body.appendChild(scrollDiv);
    scrollDiv.style.cssText = "position: absolute;left: -99999px;overflow:scroll;width: 100px;height: 100px;";
    scrollWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollWidth;
}
exports.getScrollbarWidth = getScrollbarWidth;
function fitPosition(node, config) {
    return calculatePosition(getRealPosition(node), config);
}
exports.fitPosition = fitPosition;
function isIE() {
    var ua = window.navigator.userAgent;
    return ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
}
exports.isIE = isIE;
function getRealPosition(node) {
    var rects = node.getBoundingClientRect();
    return {
        left: rects.left + window.pageXOffset,
        right: rects.right + window.pageXOffset,
        top: rects.top + window.pageYOffset,
        bottom: rects.bottom + window.pageYOffset
    };
}
exports.getRealPosition = getRealPosition;
var Position;
(function (Position) {
    Position["left"] = "left";
    Position["right"] = "right";
    Position["bottom"] = "bottom";
    Position["top"] = "top";
})(Position = exports.Position || (exports.Position = {}));
function calculatePosition(pos, config) {
    var _a = config.mode === Position.bottom || config.mode === Position.top
        ? placeBottomOrTop(pos, config)
        : placeRightOrLeft(pos, config), left = _a.left, top = _a.top;
    return {
        left: Math.round(left) + "px",
        top: Math.round(top) + "px",
        minWidth: Math.round(config.width) + "px",
        position: "absolute"
    };
}
exports.calculatePosition = calculatePosition;
function getWindowBorders() {
    return {
        rightBorder: window.pageXOffset + window.innerWidth,
        bottomBorder: window.pageYOffset + window.innerHeight
    };
}
function horizontalCentering(pos, width, rightBorder) {
    var nodeWidth = pos.right - pos.left;
    var diff = (width - nodeWidth) / 2;
    var left = pos.left - diff;
    var right = pos.right + diff;
    if (left >= 0 && right <= rightBorder) {
        return left;
    }
    if (left < 0) {
        return 0;
    }
    return rightBorder - width;
}
function verticalCentering(pos, height, bottomBorder) {
    var nodeHeight = pos.bottom - pos.top;
    var diff = (height - nodeHeight) / 2;
    var top = pos.top - diff;
    var bottom = pos.bottom + diff;
    if (top >= 0 && bottom <= bottomBorder) {
        return top;
    }
    if (top < 0) {
        return 0;
    }
    return bottomBorder - height;
}
function placeBottomOrTop(pos, config) {
    var _a = getWindowBorders(), rightBorder = _a.rightBorder, bottomBorder = _a.bottomBorder;
    var left;
    var top;
    var bottomDiff = bottomBorder - pos.bottom - config.height;
    var topDiff = pos.top - config.height;
    if (config.mode === Position.bottom) {
        if (bottomDiff >= 0) {
            top = pos.bottom;
        }
        else if (topDiff >= 0) {
            top = topDiff;
        }
    }
    else {
        if (topDiff >= 0) {
            top = topDiff;
        }
        else if (bottomDiff >= 0) {
            top = pos.bottom;
        }
    }
    if (bottomDiff < 0 && topDiff < 0) {
        if (config.auto) {
            return placeRightOrLeft(pos, __assign({}, config, { mode: Position.right, auto: false }));
        }
        top = bottomDiff > topDiff ? pos.bottom : topDiff;
    }
    if (config.centering) {
        left = horizontalCentering(pos, config.width, rightBorder);
    }
    else {
        var leftDiff = rightBorder - pos.left - config.width;
        var rightDiff = pos.right - config.width;
        if (leftDiff >= 0) {
            left = pos.left;
        }
        else if (rightDiff >= 0) {
            left = rightDiff;
        }
        else {
            left = rightDiff > leftDiff ? pos.left : rightDiff;
        }
    }
    return { left: left, top: top };
}
function placeRightOrLeft(pos, config) {
    var _a = getWindowBorders(), rightBorder = _a.rightBorder, bottomBorder = _a.bottomBorder;
    var left;
    var top;
    var rightDiff = rightBorder - pos.right - config.width;
    var leftDiff = pos.left - config.width;
    if (config.mode === Position.right) {
        if (rightDiff >= 0) {
            left = pos.right;
        }
        else if (leftDiff >= 0) {
            left = leftDiff;
        }
    }
    else {
        if (leftDiff >= 0) {
            left = leftDiff;
        }
        else if (rightDiff >= 0) {
            left = pos.right;
        }
    }
    if (leftDiff < 0 && rightDiff < 0) {
        if (config.auto) {
            return placeBottomOrTop(pos, __assign({}, config, { mode: Position.bottom, auto: false }));
        }
        left = leftDiff > rightDiff ? leftDiff : pos.right;
    }
    if (config.centering) {
        top = verticalCentering(pos, config.height, rightBorder);
    }
    else {
        var bottomDiff = pos.bottom - config.height;
        var topDiff = bottomBorder - pos.top - config.height;
        if (topDiff >= 0) {
            top = pos.top;
        }
        else if (bottomDiff > 0) {
            top = bottomDiff;
        }
        else {
            top = bottomDiff > topDiff ? bottomDiff : pos.top;
        }
    }
    return { left: left, top: top };
}


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var AxisCreator_1 = __webpack_require__(51);
var types_1 = __webpack_require__(2);
var SvgScales_1 = __webpack_require__(23);
var common_1 = __webpack_require__(1);
var renderScale = {
    left: SvgScales_1.left,
    right: SvgScales_1.right,
    bottom: SvgScales_1.bottom,
    top: SvgScales_1.top
};
var renderGrid = {
    left: SvgScales_1.leftGrid,
    right: SvgScales_1.rightGrid,
    bottom: SvgScales_1.bottomGrid,
    top: SvgScales_1.topGrid
};
var Scale = /** @class */ (function () {
    function Scale(_data, config, position) {
        this._data = _data;
        this._padding = false;
        this._charts = [];
        this._position = position;
        this._setDefaults(config);
        this._isXDirection = position === types_1.ScaleType.bottom || position === types_1.ScaleType.top;
        if (position !== types_1.ScaleType.radial) {
            if (position === types_1.ScaleType.left || position === types_1.ScaleType.right) {
                this.config.size = this.config.size || 40 + (this.config.title ? 40 : 0);
            }
            else {
                this.config.size = this.config.size || 20 + (this.config.title ? 40 : 0);
            }
        }
    }
    Scale.prototype.addPadding = function () {
        this._padding = true;
    };
    Scale.prototype.getSize = function () {
        return this.config.size;
    };
    Scale.prototype.scaleReady = function (sizes) {
        var points = [];
        this._charts.forEach(function (chart) {
            chart.getPoints().forEach(function (item) { return points.push(item[1]); }); // y-value
        });
        this._axis = new AxisCreator_1.AxisCreator(points, this.config).getScale();
        var position = this._position;
        if (position !== "radial") {
            sizes[position] += this.config.size;
        }
    };
    Scale.prototype.point = function (pos) {
        if (this.config.log) {
            return this._logPoint(pos);
        }
        else {
            return this._isXDirection ? (pos - this._axis.min) / (this._axis.max - this._axis.min) : 1 - (pos - this._axis.min) / (this._axis.max - this._axis.min);
        }
    };
    Scale.prototype.add = function (val) {
        this._charts.push(val);
    };
    Scale.prototype.paint = function (width, height) {
        var _this = this;
        if (this.config.hidden) {
            return null;
        }
        var steps = this._axis.steps;
        var points = steps.map(function (item) { return [_this._isXDirection ? _this.point(item) * width : _this.point(item) * height, item]; });
        return renderScale[this._position](points, this.config, width, height);
    };
    Scale.prototype.scaleGrid = function () {
        var _this = this;
        var getPoints = function (width, height) {
            return _this._axis.steps.map(function (item) { return [_this._isXDirection ? _this.point(item) * width : _this.point(item) * height, item]; });
        };
        var type = this._position;
        var grid = this.config.grid;
        var dashed = this.config.dashed;
        var hidden = this.config.hidden;
        var getSpecificLevel = function () { return _this._axis.steps.indexOf(_this.config.targetLine); };
        var getSpecificNumber = function () { return _this.point(_this.config.targetValue); };
        return {
            paint: function (width, height) {
                var targetLine = getSpecificLevel();
                var points = getPoints(width, height);
                var targetValue = getSpecificNumber();
                var config = { targetLine: targetLine, dashed: dashed, grid: grid, targetValue: targetValue, hidden: hidden };
                return renderGrid[type](points, width, height, config);
            }
        };
    };
    Scale.prototype._setDefaults = function (config) {
        var defaults = {
            scalePadding: 20,
            textPadding: 11,
            grid: true,
            targetLine: null,
            showText: true
        };
        if (config.locator) {
            this.locator = common_1.locator(config.locator);
        }
        this.config = __assign({}, defaults, config);
    };
    Scale.prototype._logPoint = function (pos) {
        var logPos;
        var sign = Math.abs(pos) / pos;
        var steps = this._axis.steps;
        var count = steps.length - 1;
        var index = steps.indexOf(pos);
        if (index !== -1) {
            logPos = index / count;
        }
        else {
            var dx = this._axis.min < 0 ? steps.indexOf(0) : 0;
            var exp = sign * (common_1.log10(Math.abs(pos)) - 1);
            logPos = (dx + exp) / count;
        }
        return this._isXDirection ? logPos : 1 - logPos;
    };
    return Scale;
}());
exports.Scale = Scale;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var BaseSeria_1 = __webpack_require__(14);
var ScaleSeria = /** @class */ (function (_super) {
    __extends(ScaleSeria, _super);
    function ScaleSeria() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScaleSeria.prototype.addScale = function (type, scale) {
        if (type === types_1.ScaleType.bottom || type === types_1.ScaleType.top) {
            this.xScale = scale;
            this._xLocator = scale.locator;
        }
        else {
            this.yScale = scale;
            this._yLocator = common_1.locator(this.config.value);
        }
    };
    ScaleSeria.prototype.paint = function (width, height) {
        _super.prototype.paint.call(this, width, height);
    };
    ScaleSeria.prototype.dataReady = function (prev) {
        var _this = this;
        if (!this.config.active) {
            return this._points = [];
        }
        this._points = this._data.map(function (item, index) {
            // raw values
            var x = _this._xLocator(item);
            var y = _this._yLocator(item);
            var set = [x, y, item.id, x, y];
            if (prev) {
                set[1] += prev[index][1];
            }
            return set;
        });
        return this._points;
    };
    ScaleSeria.prototype._calckFinalPoints = function (width, height) {
        var _this = this;
        this._points.forEach(function (item, index) {
            // scaled values
            item[0] = _this.xScale.point(item[0]) * width;
            item[1] = _this.yScale.point(item[1]) * height;
        });
    };
    ScaleSeria.prototype._defaultLocator = function (v) {
        return [this._yLocator(v), this._xLocator(v)];
    };
    return ScaleSeria;
}(BaseSeria_1.default));
exports.default = ScaleSeria;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(3);
var types_1 = __webpack_require__(2);
var common_1 = __webpack_require__(1);
var line_1 = __webpack_require__(54);
var BaseSeria = /** @class */ (function () {
    function BaseSeria(_data, config, other) {
        this._data = _data;
        this.id = config.id = config.id || core_1.uid();
        this._events = other;
        this._points = [];
        this._setDefaults(config);
    }
    BaseSeria.prototype.toggle = function () {
        this.config.active = !this.config.active;
    };
    BaseSeria.prototype.getClosest = function (x, y) {
        var res = [Infinity, null, null, null];
        for (var _i = 0, _a = this._points; _i < _a.length; _i++) {
            var point = _a[_i];
            var dist = this._getClosestDist(x, y, point[0], point[1]);
            if (res[0] > dist) {
                res[0] = dist;
                res[1] = point[0];
                res[2] = point[1];
                res[3] = point[2];
            }
        }
        return res;
    };
    BaseSeria.prototype.getTooltipType = function (_id) {
        return types_1.TooltipType.top;
    };
    BaseSeria.prototype.getTooltipText = function (id) {
        if (this.config.tooltip) {
            var p = this._defaultLocator(this._data.getItem(id));
            if (this.config.tooltipTemplate) {
                return this.config.tooltipTemplate(p);
            }
            return p[0];
        }
    };
    BaseSeria.prototype.dataReady = function (prev) {
        return this._points = [];
    };
    BaseSeria.prototype.paint = function (width, height) {
        return this._calckFinalPoints(width, height);
    };
    BaseSeria.prototype.getPoints = function () {
        return this._points;
    };
    BaseSeria.prototype.addScale = function (type, scale) {
        // do nothing
    };
    BaseSeria.prototype._getClosestDist = function (x, y, px, py) {
        return common_1.euclideanDistance(x, y, px, py);
    };
    BaseSeria.prototype._calckFinalPoints = function (_width, _height) {
        // do nothing
    };
    BaseSeria.prototype._setDefaults = function (config) {
        this.config = config;
    };
    BaseSeria.prototype._defaultLocator = function (_) { return [null, null]; };
    BaseSeria.prototype._getPointType = function (form, color, showTooltip) {
        if (showTooltip) {
            return line_1.getShadeHelper(form, color, line_1.hoverMode);
        }
        else {
            return line_1.getShadeHelper(form, color, line_1.standarMode);
        }
    };
    return BaseSeria;
}());
exports.default = BaseSeria;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var BaseSeria_1 = __webpack_require__(14);
var NoScaleSeria = /** @class */ (function (_super) {
    __extends(NoScaleSeria, _super);
    function NoScaleSeria() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._center = [0, 0]; // (x, y)
        _this._tooltipData = []; // (x, y)
        return _this;
    }
    NoScaleSeria.prototype.scaleReady = function (sizes) {
        for (var key in sizes) {
            sizes[key] += this.config.paddings;
        }
        return sizes;
    };
    NoScaleSeria.prototype.dataReady = function () {
        var _this = this;
        var data = this._data;
        this._sum = data.reduce(function (sum, item) { return item.$hidden ? sum : sum + parseFloat(_this._valueLocator(item)); }, 0);
        this._points = data.reduce(function (items, item, i) {
            if (item.$hidden) {
                return items;
            }
            var t = _this._textLocator(item);
            var v = _this._valueLocator(item);
            var x = v / _this._sum;
            var c = _this._colorLocator ? _this._colorLocator(item) : common_1.getDefaultColor(i);
            items.push([x, v, item.id, t, c]);
            return items;
        }, []);
        return this._points;
    };
    NoScaleSeria.prototype.toggle = function (id) {
        var item = this._data.getItem(id);
        if (!item) {
            return;
        }
        this._data.update(id, { $hidden: !item.$hidden });
    };
    NoScaleSeria.prototype.getClosest = function (x, y) {
        var percent = 1 - (Math.atan2(x - this._center[0], y - this._center[1]) + Math.PI) / Math.PI / 2;
        var points = this._points;
        for (var i = 0; i < points.length; i++) {
            if (points[i][0] >= percent) {
                return [0, this._tooltipData[i][0], this._tooltipData[i][1], points[i][2]];
            }
            percent -= points[i][0];
        }
        return [Infinity, null, null, null];
    };
    NoScaleSeria.prototype.getTooltipText = function (id) {
        if (this.config.tooltip) {
            var p = this._defaultLocator(this._data.getItem(id));
            if (this.config.tooltipTemplate) {
                return this.config.tooltipTemplate(p);
            }
            return p[0];
        }
    };
    NoScaleSeria.prototype.getTooltipType = function (_id) {
        return types_1.TooltipType.simple;
    };
    NoScaleSeria.prototype._setDefaults = function (config) {
        var _this = this;
        var defaults = {
            subType: types_1.NoScaleSubType.basic,
            paddings: 20
        };
        this.config = __assign({}, defaults, config);
        this._drawPointType = this._getPointType(types_1.PointType.empty, "none", this.config.tooltip);
        this._valueLocator = common_1.locator(config.value);
        this._textLocator = common_1.locator(config.text);
        if (config.color) {
            this._colorLocator = common_1.locator(config.color);
        }
        else if (config.monochrome) {
            this._colorLocator = function (item) { return common_1.getColorShade(config.monochrome, _this._getPercent(item) * 2); }; // 2 for more bright
        }
    };
    NoScaleSeria.prototype._defaultLocator = function (v) {
        return [this._valueLocator(v), this._textLocator(v)];
    };
    NoScaleSeria.prototype._getPercent = function (item) {
        return parseFloat(this._valueLocator(item)) / this._sum;
    };
    return NoScaleSeria;
}(BaseSeria_1.default));
exports.default = NoScaleSeria;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
var ScaleSeria_1 = __webpack_require__(13);
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Line.prototype.paint = function (width, height) {
        var _this = this;
        _super.prototype.paint.call(this, width, height);
        var color = this.config.pointColor || this.config.color;
        var css = "chart " + this.config.type + " " + (this.config.css || "") + " " + (this.config.dashed ? "dash-line" : "");
        var svg = [];
        if (this.config.strokeWidth) {
            svg.push(this._getForm(this._points, this.config, css, width, height));
        }
        if (this.config.pointType) {
            var point_1 = this._getPointType(this.config.pointType, color, false);
            svg = svg.concat(this._points.map(function (p) { return point_1(p[0], p[1], common_1.calcPointRef(p[2], _this.id)); }));
        }
        return dom_1.sv("g", { class: "seria", _key: this.id }, svg);
    };
    Line.prototype._getForm = function (points, config, css, width, height) {
        var d = points.map(function (item, index) { return (index ? "L" : "M") + (item[0] + " " + item[1]); }).join(" ");
        var path = dom_1.sv("path", {
            "id": "seria" + config.id,
            d: d,
            "stroke": config.color,
            "class": css,
            "stroke-width": this.config.strokeWidth,
            "fill": "none"
        });
        return path;
    };
    Line.prototype._setDefaults = function (config) {
        var defaults = {
            alpha: 1,
            strokeWidth: 2,
            active: true,
            tooltip: true
        };
        this.config = __assign({}, defaults, config);
    };
    return Line;
}(ScaleSeria_1.default));
exports.default = Line;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(3);
var html_1 = __webpack_require__(11);
var View = /** @class */ (function () {
    function View(_container, config) {
        this._uid = core_1.uid();
        this.config = config || {};
    }
    View.prototype.mount = function (container, vnode) {
        if (vnode) {
            this._view = vnode;
        }
        if (container && this._view && this._view.mount) {
            // init view inside of HTML container
            this._container = html_1.toNode(container);
            if (this._container.tagName) {
                this._view.mount(this._container);
            }
            else if (this._container.attach) {
                this._container.attach(this);
            }
        }
    };
    View.prototype.unmount = function () {
        var rootView = this.getRootView();
        if (rootView && rootView.node) {
            rootView.unmount();
            this._view = null;
        }
    };
    View.prototype.getRootView = function () {
        return this._view;
    };
    View.prototype.getRootNode = function () {
        return this._view && this._view.node && this._view.node.el;
    };
    View.prototype.paint = function () {
        if (this._view && ( // was mounted
        this._view.node || // already rendered node
            this._container)) { // not rendered, but has container
            this._doNotRepaint = false;
            this._view.redraw();
        }
    };
    return View;
}());
exports.View = View;
function toViewLike(view) {
    return {
        getRootView: function () { return view; },
        paint: function () { return view.node && view.redraw(); },
        mount: function (container) { return view.mount(container); }
    };
}
exports.toViewLike = toViewLike;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(10);
var loader_1 = __webpack_require__(36);
var sort_1 = __webpack_require__(39);
var dataproxy_1 = __webpack_require__(7);
var helpers_1 = __webpack_require__(5);
var types_1 = __webpack_require__(4);
var core_1 = __webpack_require__(3);
var DataCollection = /** @class */ (function () {
    function DataCollection(config, events) {
        this.config = config || {};
        this._order = [];
        this._pull = {};
        this._changes = { order: [] };
        this._initOrder = null;
        this._sort = new sort_1.Sort();
        this._loader = new loader_1.Loader(this, this._changes);
        this.events = events || new events_1.EventSystem(this);
        this.events.on(types_1.DataEvents.loadError, function (response) {
            if (typeof response !== "string") {
                helpers_1.dhxError(response);
            }
            else {
                helpers_1.dhxWarning(response);
            }
        });
    }
    DataCollection.prototype.add = function (obj, index) {
        var _this = this;
        if (!this.events.fire(types_1.DataEvents.beforeAdd, [obj])) {
            return;
        }
        if (Array.isArray(obj)) {
            return obj.map(function (element, key) {
                if (key !== 0) {
                    index = index + 1;
                }
                var id = _this._addCore(element, index);
                _this._onChange("add", element.id, element);
                _this.events.fire(types_1.DataEvents.afterAdd, [element]);
                return id;
            });
        }
        else {
            var id = this._addCore(obj, index);
            this._onChange("add", obj.id, obj);
            this.events.fire(types_1.DataEvents.afterAdd, [obj]);
            return id;
        }
    };
    DataCollection.prototype.remove = function (id) {
        var _this = this;
        if (id) {
            if (id instanceof Array) {
                id.map(function (element) {
                    var obj = _this._pull[element];
                    if (obj) {
                        if (!_this.events.fire(types_1.DataEvents.beforeRemove, [obj])) {
                            return;
                        }
                        _this._removeCore(obj.id);
                        _this._onChange("remove", element, obj);
                    }
                    _this.events.fire(types_1.DataEvents.afterRemove, [obj]);
                });
            }
            else {
                var obj = this._pull[id];
                if (obj) {
                    if (!this.events.fire(types_1.DataEvents.beforeRemove, [obj])) {
                        return;
                    }
                    this._removeCore(obj.id);
                    this._onChange("remove", id, obj);
                }
                this.events.fire(types_1.DataEvents.afterRemove, [obj]);
            }
        }
    };
    DataCollection.prototype.removeAll = function () {
        this._removeAll();
        this.events.fire(types_1.DataEvents.removeAll);
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.exists = function (id) {
        return !!this._pull[id];
    };
    DataCollection.prototype.getNearId = function (id) {
        var item = this._pull[id];
        if (!item) {
            return this._order[0].id || "";
        }
    };
    DataCollection.prototype.getItem = function (id) {
        return this._pull[id];
    };
    DataCollection.prototype.update = function (id, obj, silent) {
        var item = this.getItem(id);
        if (item) {
            if (helpers_1.isEqualObj(obj, item)) {
                return;
            }
            if (obj.id && id !== obj.id) {
                helpers_1.dhxWarning("this method doesn't allow change id");
                if (helpers_1.isDebug()) {
                    // tslint:disable-next-line:no-debugger
                    debugger;
                }
            }
            else {
                core_1.extend(this._pull[id], obj, false);
                if (this.config.update) {
                    this.config.update(this._pull[id]);
                }
                if (!silent) {
                    this._onChange("update", id, this._pull[id]);
                }
            }
        }
        else {
            helpers_1.dhxWarning("item not found");
        }
    };
    DataCollection.prototype.getIndex = function (id) {
        var res = core_1.findIndex(this._order, function (item) { return item.id === id; });
        if (this._pull[id] && res >= 0) {
            return res;
        }
        return -1;
    };
    DataCollection.prototype.getId = function (index) {
        if (!this._order[index]) {
            return;
        }
        return this._order[index].id;
    };
    DataCollection.prototype.getLength = function () {
        return this._order.length;
    };
    DataCollection.prototype.filter = function (rule, config) {
        config = core_1.extend({
            add: false,
            multiple: true
        }, config);
        if (!config.add) {
            this._order = this._initOrder || this._order;
            this._initOrder = null;
        }
        this._filters = this._filters || {};
        if (!config.multiple || !rule) {
            this._filters = {};
        }
        if (rule) {
            if (typeof rule === "function") {
                var f = "_";
                this._filters[f] = {
                    match: f,
                    compare: rule
                };
            }
            else {
                if (!rule.match) {
                    delete this._filters[rule.by];
                }
                else {
                    rule.compare = rule.compare || (function (val, match) { return val === match; });
                    this._filters[rule.by] = rule;
                }
            }
            this._applyFilters();
        }
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.find = function (conf) {
        for (var key in this._pull) {
            var res = helpers_1.findByConf(this._pull[key], conf);
            if (res) {
                return res;
            }
        }
        return null;
    };
    DataCollection.prototype.findAll = function (conf) {
        var res = [];
        for (var key in this._pull) {
            var item = helpers_1.findByConf(this._pull[key], conf);
            if (item) {
                res.push(item);
            }
        }
        return res;
    };
    DataCollection.prototype.sort = function (by) {
        if (!by) {
            this._order = [];
            for (var key in this._pull) {
                this._order.push(this._pull[key]);
            }
            this._applyFilters();
        }
        else {
            this._sort.sort(this._order, by);
            if (this._initOrder && this._initOrder.length) {
                this._sort.sort(this._initOrder, by);
            }
        }
        this.events.fire(types_1.DataEvents.change);
    };
    DataCollection.prototype.copy = function (id, index, target, targetId) {
        var _this = this;
        if (id instanceof Array) {
            return id.map(function (elementId, key) {
                if (!_this.exists(elementId)) {
                    return null;
                }
                var newid = core_1.uid();
                var elementIndex = index === -1 ? -1 : index + key;
                if (target) {
                    if (!(target instanceof DataCollection) && targetId) {
                        target.add(helpers_1.copyWithoutInner(_this.getItem(elementId)), elementIndex);
                        return;
                    }
                    if (target.exists(elementId)) {
                        target.add(__assign({}, helpers_1.copyWithoutInner(_this.getItem(elementId)), { id: newid }), elementIndex);
                        return newid;
                    }
                    else {
                        target.add(helpers_1.copyWithoutInner(_this.getItem(elementId)), elementIndex);
                        return elementId;
                    }
                }
                _this.add(__assign({}, helpers_1.copyWithoutInner(_this.getItem(elementId)), { id: newid }), elementIndex);
                return newid;
            });
        }
        else {
            if (!this.exists(id)) {
                return null;
            }
            var newid = core_1.uid();
            if (target) {
                if (!(target instanceof DataCollection) && targetId) {
                    target.add(helpers_1.copyWithoutInner(this.getItem(id)), index);
                    return;
                }
                if (target.exists(id)) {
                    target.add(__assign({}, helpers_1.copyWithoutInner(this.getItem(id)), { id: newid }), index);
                    return newid;
                }
                else {
                    target.add(helpers_1.copyWithoutInner(this.getItem(id)), index);
                    return id;
                }
            }
            this.add(__assign({}, helpers_1.copyWithoutInner(this.getItem(id)), { id: newid }), index);
            return newid;
        }
    };
    DataCollection.prototype.move = function (id, index, target, targetId) {
        var _this = this;
        if (id instanceof Array) {
            return id.map(function (elementId, key) {
                var elementIndex = index === -1 ? -1 : index + key;
                if (target && target !== _this && _this.exists(elementId)) {
                    var item = core_1.copy(_this.getItem(elementId), true);
                    if (target.exists(elementId)) {
                        item.id = core_1.uid();
                    }
                    if (targetId) {
                        item.parent = targetId;
                    }
                    target.add(item, elementIndex);
                    _this.remove(elementId);
                    return item.id;
                }
                if (_this.getIndex(elementId) === elementIndex) {
                    return null;
                }
                var spliced = _this._order.splice(_this.getIndex(elementId), 1)[0];
                if (index === -1) {
                    index = _this._order.length;
                }
                _this._order.splice(elementIndex, 0, spliced);
                _this.events.fire(types_1.DataEvents.change);
                return elementId;
            });
        }
        else {
            if (target && target !== this && this.exists(id)) {
                var item = core_1.copy(this.getItem(id), true);
                if (target.exists(id)) {
                    item.id = core_1.uid();
                }
                if (targetId) {
                    item.parent = targetId;
                }
                target.add(item, index);
                // remove data from original collection
                this.remove(id);
                return item.id;
            }
            if (this.getIndex(id) === index) {
                return null;
            }
            // move other elements
            var spliced = this._order.splice(this.getIndex(id), 1)[0];
            if (index === -1) {
                index = this._order.length;
            }
            this._order.splice(index, 0, spliced);
            this.events.fire(types_1.DataEvents.change); // if target not this, it trigger add and remove
            return id;
        }
    };
    DataCollection.prototype.load = function (url, driver) {
        if (typeof url === "string") {
            url = new dataproxy_1.DataProxy(url);
        }
        return this._loader.load(url, driver);
    };
    DataCollection.prototype.parse = function (data, driver) {
        this._removeAll();
        return this._loader.parse(data, driver);
    };
    DataCollection.prototype.$parse = function (data) {
        var apx = this.config.approximate;
        if (apx) {
            data = this._approximate(data, apx.value, apx.maxNum);
        }
        this._parse_data(data);
        this.events.fire(types_1.DataEvents.change, ["load"]);
        this.events.fire(types_1.DataEvents.load);
    };
    DataCollection.prototype.save = function (url) {
        this._loader.save(url);
    };
    // todo: loop through the array and check saved statuses
    DataCollection.prototype.isSaved = function () {
        return !this._changes.order.length; // todo: bad solution, errors and holded elments are missed...
    };
    DataCollection.prototype.map = function (cb) {
        var result = [];
        for (var i = 0; i < this._order.length; i++) {
            result.push(cb.call(this, this._order[i], i));
        }
        return result;
    };
    DataCollection.prototype.mapRange = function (from, to, cb) {
        if (from < 0) {
            from = 0;
        }
        if (to > this._order.length - 1) {
            to = this._order.length - 1;
        }
        var result = [];
        for (var i = from; i <= to; i++) {
            result.push(cb.call(this, this._order[i], i));
        }
        return result;
    };
    DataCollection.prototype.reduce = function (cb, acc) {
        for (var i = 0; i < this._order.length; i++) {
            acc = cb.call(this, acc, this._order[i], i);
        }
        return acc;
    };
    DataCollection.prototype.serialize = function (driver) {
        if (driver === void 0) { driver = types_1.DataDriver.json; }
        var data = this.map(function (item) {
            var newItem = __assign({}, item);
            Object.keys(newItem).forEach(function (key) {
                if (key[0] === "$") {
                    delete newItem[key];
                }
            });
            return newItem;
        });
        var dataDriver = helpers_1.toDataDriver(driver);
        if (dataDriver) {
            return dataDriver.serialize(data);
        }
    };
    DataCollection.prototype.getInitialData = function () {
        return this._initOrder;
    };
    DataCollection.prototype._removeAll = function () {
        this._pull = {};
        this._order = [];
        this._changes.order = [];
        this._initOrder = null;
    };
    DataCollection.prototype._addCore = function (obj, index) {
        if (this.config.init) {
            obj = this.config.init(obj);
        }
        obj.id = obj.id ? obj.id.toString() : core_1.uid();
        if (this._pull[obj.id]) {
            helpers_1.dhxError("Item already exist");
        }
        // todo: not ideal solution
        if (this._initOrder && this._initOrder.length) {
            this._addToOrder(this._initOrder, obj, index);
        }
        this._addToOrder(this._order, obj, index);
        return obj.id;
    };
    DataCollection.prototype._removeCore = function (id) {
        if (this.getIndex(id) >= 0) {
            this._order = this._order.filter(function (el) { return el.id !== id; });
            delete this._pull[id];
        }
        if (this._initOrder && this._initOrder.length) {
            this._initOrder = this._initOrder.filter(function (el) { return el.id !== id; });
        }
    };
    DataCollection.prototype._parse_data = function (data) {
        var index = this._order.length;
        if (this.config.prep) {
            data = this.config.prep(data);
        }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            if (this.config.init) {
                obj = this.config.init(obj);
            }
            obj.id = (obj.id || obj.id === 0) ? obj.id : core_1.uid();
            this._pull[obj.id] = obj;
            this._order[index++] = obj;
        }
    };
    DataCollection.prototype._approximate = function (data, values, maxNum) {
        var len = data.length;
        var vlen = values.length;
        var rlen = Math.floor(len / maxNum);
        var newData = Array(Math.ceil(len / rlen));
        var index = 0;
        for (var i = 0; i < len; i += rlen) {
            var newItem = core_1.copy(data[i]);
            var end = Math.min(len, i + rlen);
            for (var j = 0; j < vlen; j++) {
                var sum = 0;
                for (var z = i; z < end; z++) {
                    sum += data[z][values[j]];
                }
                newItem[values[j]] = sum / (end - i);
            }
            newData[index++] = newItem;
        }
        return newData;
    };
    DataCollection.prototype._onChange = function (status, id, obj) {
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var item = _a[_i];
            // update pending item if previous state is "saving" or if item not saved yet
            if (item.id === id && !item.saving) {
                // update item
                if (item.error) {
                    item.error = false;
                }
                item = __assign({}, item, { obj: obj, status: status });
                this.events.fire(types_1.DataEvents.change, [id, status, obj]);
                return;
            }
        }
        this._changes.order.push({ id: id, status: status, obj: __assign({}, obj), saving: false });
        this.events.fire(types_1.DataEvents.change, [id, status, obj]);
    };
    DataCollection.prototype._addToOrder = function (array, obj, index) {
        if (index >= 0 && array[index]) {
            this._pull[obj.id] = obj;
            array.splice(index, 0, obj);
        }
        else {
            this._pull[obj.id] = obj;
            array.push(obj);
        }
    };
    DataCollection.prototype._applyFilters = function () {
        var _this = this;
        if (this._filters && Object.keys(this._filters).length) {
            var fOrder = this._order.filter(function (item) {
                return Object.keys(_this._filters).every(function (key) {
                    return item[key] ?
                        _this._filters[key].compare(item[key], _this._filters[key].match, item)
                        : _this._filters[key].compare(item);
                });
            });
            if (!this._initOrder) {
                this._initOrder = this._order;
            }
            this._order = fOrder;
        }
    };
    return DataCollection;
}());
exports.DataCollection = DataCollection;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(5);
function toQueryString(data) {
    return Object.keys(data).reduce(function (entries, key) {
        var value = typeof data[key] === "object" ? JSON.stringify(data[key]) : data[key];
        entries.push(key + "=" + encodeURIComponent(value));
        return entries;
    }, []).join("&");
}
function inferResponseType(contentType) {
    if (!contentType) {
        return "text";
    }
    if (contentType.indexOf("json") >= 0) {
        return "json";
    }
    if (contentType.indexOf("xml") >= 0) {
        return "xml";
    }
    return "text";
}
function send(url, data, method, headers, responseType) {
    function parseResponse(responseText, genResponseType) {
        switch (genResponseType) {
            case "json": {
                return JSON.parse(responseText);
            }
            case "text": {
                return responseText;
            }
            case "xml": {
                var driver = helpers_1.toDataDriver(types_1.DataDriver.xml);
                if (driver) {
                    return driver.toJsonObject(responseText);
                }
                else {
                    return { parseError: "Incorrect data driver type: 'xml'" };
                }
            }
            default: {
                return responseText;
            }
        }
    }
    var allHeaders = headers || {};
    if (responseType) {
        allHeaders.Accept = "application/" + responseType;
    }
    if (method !== "GET") {
        allHeaders["Content-Type"] = allHeaders["Content-Type"] || "application/json";
    }
    if (method === "GET") {
        var urlData = data && typeof data === "object" ?
            toQueryString(data) :
            data && typeof data === "string" ?
                data : "";
        if (urlData) {
            url += (url.indexOf("?") === -1) ? "?" : "&";
            url += urlData;
        }
        data = null;
    }
    if (!window.fetch) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    if (responseType === "raw") {
                        resolve({
                            url: xhr.responseURL,
                            headers: xhr.getAllResponseHeaders()
                                .trim()
                                .split(/[\r\n]+/)
                                .reduce(function (acc, cur) {
                                var kv = cur.split(": ");
                                acc[kv[0]] = kv[1];
                                return acc;
                            }, {}),
                            body: xhr.response
                        });
                    }
                    if (xhr.status === 204) {
                        resolve();
                    }
                    else {
                        resolve(parseResponse(xhr.responseText, responseType || inferResponseType(xhr.getResponseHeader("Content-Type"))));
                    }
                }
                else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    message: xhr.responseText
                });
            };
            xhr.open(method, url);
            for (var headerKey in allHeaders) {
                xhr.setRequestHeader(headerKey, allHeaders[headerKey]);
            }
            switch (method) {
                case "POST":
                case "DELETE":
                case "PUT":
                    xhr.send(data !== undefined ? JSON.stringify(data) : "");
                    break;
                case "GET":
                    xhr.send();
                    break;
                default:
                    xhr.send();
                    break;
            }
        });
    }
    else {
        return window.fetch(url, {
            method: method,
            body: data ? JSON.stringify(data) : null,
            headers: allHeaders,
        })
            .then(function (response) {
            if (response.ok) {
                var genResponseType = responseType || inferResponseType(response.headers.get("Content-Type"));
                if (genResponseType === "raw") {
                    return {
                        // @ts-ignore
                        headers: Object.fromEntries(response.headers.entries()),
                        url: response.url,
                        body: response.body
                    };
                }
                if (response.status !== 204) {
                    switch (genResponseType) {
                        case "json": {
                            return response.json();
                        }
                        case "xml": {
                            var driver = helpers_1.toDataDriver(types_1.DataDriver.xml);
                            if (driver) {
                                return response.text()
                                    .then(driver.toJsonObject);
                            }
                            else {
                                return response.text();
                            }
                        }
                        default:
                            return response.text();
                    }
                }
            }
            else {
                return response.text()
                    .then(function (message) { return Promise.reject({
                    status: response.status,
                    statusText: response.statusText,
                    message: message
                }); });
            }
        });
    }
}
exports.ajax = {
    get: function (url, data, config) { return send(url, data, "GET", config && config.headers, config !== undefined ? config.responseType : undefined); },
    post: function (url, data, config) { return send(url, data, "POST", config && config.headers, config !== undefined ? config.responseType : undefined); },
    put: function (url, data, config) { return send(url, data, "PUT", config && config.headers, config !== undefined ? config.responseType : undefined); },
    delete: function (url, data, config) { return send(url, data, "DELETE", config && config.headers, config !== undefined ? config.responseType : undefined); }
};

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var JsonDriver_1 = __webpack_require__(21);
var CsvDriver_1 = __webpack_require__(22);
var XMLDriver_1 = __webpack_require__(37);
exports.dataDrivers = {
    json: JsonDriver_1.JsonDriver,
    csv: CsvDriver_1.CsvDriver
};
exports.dataDriversPro = __assign({}, exports.dataDrivers, { xml: XMLDriver_1.XMLDriver });


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var JsonDriver = /** @class */ (function () {
    function JsonDriver() {
    }
    JsonDriver.prototype.toJsonArray = function (data) {
        return this.getRows(data);
    };
    JsonDriver.prototype.serialize = function (data) {
        return data;
    };
    JsonDriver.prototype.getFields = function (row) {
        return row;
    };
    JsonDriver.prototype.getRows = function (data) {
        return typeof data === "string" ? JSON.parse(data) : data;
    };
    return JsonDriver;
}());
exports.JsonDriver = JsonDriver;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var CsvDriver = /** @class */ (function () {
    function CsvDriver(config) {
        var initConfig = {
            skipHeader: 0,
            nameByHeader: false,
            rowDelimiter: "\n",
            columnDelimiter: ",",
        };
        this.config = __assign({}, initConfig, config);
        if (this.config.nameByHeader) {
            this.config.skipHeader = 1;
        }
    }
    CsvDriver.prototype.getFields = function (row, headers) {
        var parts = row.trim().split(this.config.columnDelimiter);
        var obj = {};
        for (var i = 0; i < parts.length; i++) {
            obj[headers ? headers[i] : i + 1] = parts[i];
        }
        return obj;
    };
    CsvDriver.prototype.getRows = function (data) {
        return data.trim().split(this.config.rowDelimiter);
    };
    CsvDriver.prototype.toJsonArray = function (data) {
        var _this = this;
        var rows = this.getRows(data);
        var names = this.config.names;
        if (this.config.skipHeader) {
            var top_1 = rows.splice(0, this.config.skipHeader);
            if (this.config.nameByHeader) {
                names = top_1[0].trim().split(this.config.columnDelimiter);
            }
        }
        return rows.map(function (row) { return _this.getFields(row, names); });
    };
    CsvDriver.prototype.serialize = function (data, withoutHeader) {
        var header = data[0] ? Object.keys(data[0])
            .filter(function (key) { return key[0] !== "$"; })
            .join(this.config.columnDelimiter) : "";
        var readyData = this._serialize(data);
        if (withoutHeader) {
            return readyData;
        }
        return header + readyData;
    };
    CsvDriver.prototype._serialize = function (data) {
        var _this = this;
        return data.reduce(function (csv, row) {
            var cells = Object.keys(row).reduce(function (total, key, i) {
                if (key[0] === "$" || key === "items") {
                    return total;
                }
                return "" + total + row[key] + (i === row.length - 1 ? "" : _this.config.columnDelimiter);
            }, "");
            if (row.items) {
                return csv + "\n" + cells + _this._serialize(row.items);
            }
            return "" + csv + _this.config.rowDelimiter + cells;
        }, "");
    };
    return CsvDriver;
}());
exports.CsvDriver = CsvDriver;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
var defaultTextTemplate = function (item) { return item.toString(); };
function bottom(points, config, width, height) {
    var title = config.title, textPadding = config.textPadding, scalePadding = config.scalePadding, textTemplate = config.textTemplate, showText = config.showText;
    var template = textTemplate || defaultTextTemplate;
    var text = [];
    var extraTittlePadding = 0;
    if (showText) {
        extraTittlePadding = textPadding;
        text = points.map(function (p) { return p[0] !== 0 ? dom_1.sv("text", { class: "scale-text top-text", x: p[0], y: height + textPadding }, [common_1.verticalCenteredText(template(p[1]))])
            : dom_1.sv("text", { class: "scale-text start-text top-text", x: p[0], y: height + textPadding }, [common_1.verticalCenteredText(template(p[1]))]); });
    }
    var id = core_1.uid();
    var svTitle = null;
    var mainLine = dom_1.sv("path", { class: "main-scale", d: "M0 " + height + " H" + (width - 0.5), id: id }); // -0.5 instead of 0, coz stroke-linecap: square and dirrent stroke size
    if (title) {
        svTitle = dom_1.sv("text", { dx: width / 2, dy: scalePadding + extraTittlePadding }, [
            dom_1.sv("textPath", { href: "#" + id, class: "scale-title" }, title)
        ]);
    }
    return dom_1.sv("g", [
        mainLine,
        svTitle
    ].concat(text));
}
exports.bottom = bottom;
function bottomGrid(points, width, height, config) {
    var dashed = config.dashed, grid = config.grid, targetLine = config.targetLine, targetValue = config.targetValue;
    var len = points.length;
    var gridLines = [];
    var className = "grid-line " + (dashed ? "dash-line" : "");
    for (var i = 0; i < len; i++) {
        if (i === 0 && points[i][0] === 0 && !config.hidden) {
            continue;
        }
        if (i === targetLine) {
            var d = "M" + points[i][0] + " 0 V " + height;
            var path = dom_1.sv("path", { d: d, class: className + " spec-grid-line" });
            gridLines.push(path);
            continue;
        }
        if (grid) {
            var d = "M" + points[i][0] + " 0 V " + height;
            var path = dom_1.sv("path", { d: d, class: className });
            gridLines.push(path);
            if (i === len - 1 && points[i][0] !== width) {
                var additionD = "M" + width + " 0 V " + height;
                var additionPath = dom_1.sv("path", { d: additionD, class: className });
                gridLines.push(additionPath);
            }
        }
    }
    if (targetValue) {
        var d = "M" + targetValue * width + " 0 V " + height;
        var path = dom_1.sv("path", { d: d, class: className + " spec-grid-line" });
        gridLines.push(path);
    }
    return dom_1.sv("g", gridLines);
}
exports.bottomGrid = bottomGrid;
function top(points, config, width, _height) {
    var title = config.title, textPadding = config.textPadding, scalePadding = config.scalePadding, textTemplate = config.textTemplate, showText = config.showText;
    var template = textTemplate || defaultTextTemplate;
    var text = [];
    var extraTittlePadding = 0;
    if (showText) {
        extraTittlePadding = textPadding;
        text = points.map(function (p) { return p[0] !== 0 ? dom_1.sv("text", { x: p[0], y: -textPadding, class: "scale-text" }, [common_1.verticalCenteredText(template(p[1]))])
            : dom_1.sv("text", { x: p[0], y: -textPadding, class: "scale-text start-text" }, [common_1.verticalCenteredText(template(p[1]))]); });
    }
    var id = core_1.uid();
    var mainLine = dom_1.sv("path", { d: "M0 0 H" + width, class: "main-scale", id: id });
    var svTitle = null;
    if (title) {
        svTitle = dom_1.sv("text", { dx: width / 2, dy: -scalePadding - extraTittlePadding }, [
            dom_1.sv("textPath", { href: "#" + id, class: "scale-title" }, title)
        ]);
    }
    return dom_1.sv("g", [
        mainLine,
        svTitle
    ].concat(text));
}
exports.top = top;
function topGrid(points, _width, height, config) {
    var dashed = config.dashed, grid = config.grid, targetLine = config.targetLine;
    var len = points.length;
    var gridLines = [];
    var className = "grid-line " + (dashed ? "dash-line" : "");
    for (var i = 0; i < len; i++) {
        if (i === 0 && points[i][0] === 0 && !config.hidden) {
            continue;
        }
        if (i === targetLine) {
            var d = "M" + points[i][0] + " 0 V " + height;
            var path = dom_1.sv("path", { d: d, class: className + " spec-grid-line" });
            gridLines.push(path);
            continue;
        }
        if (grid) {
            var d = "M" + points[i][0] + " 0 V " + height;
            var path = dom_1.sv("path", { d: d, class: className });
            gridLines.push(path);
            if (i === len - 1 && points[i][0] !== 0) {
                var additionD = "M0 0 V " + height;
                var additionPath = dom_1.sv("path", { d: additionD, class: className });
                gridLines.push(additionPath);
            }
        }
    }
    return dom_1.sv("g", gridLines);
}
exports.topGrid = topGrid;
function left(points, config, _width, height) {
    var title = config.title, textPadding = config.textPadding, scalePadding = config.scalePadding, textTemplate = config.textTemplate, showText = config.showText;
    var template = textTemplate || defaultTextTemplate;
    var text = [];
    var extraTittlePadding = 0;
    if (showText) {
        var style_1 = common_1.getFontStyle("scale-text");
        var maxTextWidth_1 = 0;
        text = points.map(function (p) {
            var scaleText = template(p[1]);
            if (title) {
                var textWidth = common_1.getTextWidth(scaleText, style_1);
                if (maxTextWidth_1 < textWidth) {
                    maxTextWidth_1 = textWidth;
                }
            }
            return dom_1.sv("text", { class: "scale-text end-text", x: -textPadding, y: p[0] }, [common_1.verticalCenteredText(scaleText)]);
        });
        extraTittlePadding = maxTextWidth_1 + textPadding;
    }
    var id = core_1.uid();
    var mainLine = dom_1.sv("path", { class: "main-scale", d: "M0 " + height + " V 0.5", id: id }); // 0.5 instead of 0, coz stroke-linecap: square and dirrent stroke size
    var svTitle = null;
    if (title) {
        svTitle = dom_1.sv("text", { dx: height / 2, dy: -scalePadding - extraTittlePadding }, [
            dom_1.sv("textPath", { href: "#" + id, class: "scale-title" }, title)
        ]);
    }
    return dom_1.sv("g", [
        mainLine,
        svTitle
    ].concat(text));
}
exports.left = left;
function leftGrid(points, width, height, config) {
    var dashed = config.dashed, grid = config.grid, targetLine = config.targetLine, targetValue = config.targetValue;
    var len = points.length;
    var gridLines = [];
    var className = "grid-line " + (dashed ? "dash-line" : "");
    for (var i = 0; i < len; i++) {
        if (i === 0 && points[i][0] === height && !config.hidden) {
            continue;
        }
        if (targetLine === i) {
            var d = "M0 " + points[i][0] + " H " + width;
            var path = dom_1.sv("path", { d: d, class: className + " spec-grid-line" });
            gridLines.push(path);
            continue;
        }
        if (grid) {
            var d = "M0 " + points[i][0] + " H " + width;
            var path = dom_1.sv("path", { d: d, class: className });
            gridLines.push(path);
            if (i === len - 1 && points[i][0] !== width) {
                var additionD = "M0 0 H" + width;
                var additionPath = dom_1.sv("path", { d: additionD, class: className });
                gridLines.push(additionPath);
            }
        }
    }
    if (targetValue) {
        var d = "M0 " + targetValue * height + " H " + width;
        var path = dom_1.sv("path", { d: d, class: className + " spec-grid-line" });
        gridLines.push(path);
    }
    return dom_1.sv("g", gridLines);
}
exports.leftGrid = leftGrid;
function right(points, config, width, height) {
    var title = config.title, textPadding = config.textPadding, scalePadding = config.scalePadding, textTemplate = config.textTemplate, showText = config.showText;
    var template = textTemplate || defaultTextTemplate;
    var text = [];
    var extraTittlePadding = 0;
    if (showText) {
        var style_2 = common_1.getFontStyle("scale-text");
        var maxTextWidth_2 = 0;
        text = points.map(function (p) {
            var scaleText = template(p[1]);
            if (title) {
                var textWidth = common_1.getTextWidth(scaleText, style_2);
                if (maxTextWidth_2 < textWidth) {
                    maxTextWidth_2 = textWidth;
                }
            }
            return dom_1.sv("text", { x: width + textPadding, class: "scale-text start-text", y: p[0] }, [common_1.verticalCenteredText(scaleText)]);
        });
        extraTittlePadding = textPadding + maxTextWidth_2;
    }
    var id = core_1.uid();
    var mainLine = dom_1.sv("path", { d: "M" + width + " " + height + " V 0", class: "main-scale", id: id });
    var svTitle = null;
    if (title) {
        svTitle = dom_1.sv("text", { dx: height / 2, dy: scalePadding + extraTittlePadding }, [
            dom_1.sv("textPath", { href: "#" + id, class: "scale-title" }, title)
        ]);
    }
    return dom_1.sv("g", [
        mainLine,
        svTitle
    ].concat(text));
}
exports.right = right;
function rightGrid(points, width, height, config) {
    var dashed = config.dashed, grid = config.grid, targetLine = config.targetLine;
    var len = points.length;
    var gridLines = [];
    var className = "grid-line " + (dashed ? "dash-line" : "");
    for (var i = 0; i < len; i++) {
        if (i === 0 && points[i][0] === height && !config.hidden) {
            continue;
        }
        if (targetLine === i) {
            var d = "M0 " + points[i][0] + " H " + width;
            var path = dom_1.sv("path", { d: d, class: className + " spec-grid-line" });
            gridLines.push(path);
            continue;
        }
        if (grid) {
            var d = "M0 " + points[i][0] + " H " + width;
            var path = dom_1.sv("path", { d: d, class: className });
            gridLines.push(path);
            if (i === len - 1 && points[i][0] !== width) {
                var additionD = "M0 0 H" + width;
                var additionPath = dom_1.sv("path", { d: additionD, class: className });
                gridLines.push(additionPath);
            }
        }
    }
    return dom_1.sv("g", gridLines);
}
exports.rightGrid = rightGrid;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var ScaleSeria_1 = __webpack_require__(13);
var Area = /** @class */ (function (_super) {
    __extends(Area, _super);
    function Area() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Area.prototype.paint = function (width, height, prev) {
        _super.prototype.paint.call(this, width, height);
        var svg = [];
        this._form(width, height, svg, prev);
        this._markers(svg);
        return dom_1.sv("g", { class: "seria", _key: this.id }, svg);
    };
    Area.prototype.paintformAndMarkers = function (width, height, prev) {
        _super.prototype.paint.call(this, width, height);
        var svg = [];
        var markers = [];
        this._form(width, height, svg, prev);
        this._markers(markers);
        return [
            dom_1.sv("g", { class: "seria", _key: this.id }, svg),
            dom_1.sv("g", { class: "seria_markers", _key: this.id + "_markers" }, markers)
        ];
    };
    Area.prototype._markers = function (svg) {
        var _this = this;
        if (this.config.pointType) {
            var color = this.config.pointColor || this.config.color;
            var point_1 = this._getPointType(this.config.pointType, color, false);
            svg.push.apply(svg, this._points.map(function (p) { return point_1(p[0], p[1], common_1.calcPointRef(p[2], _this.id)); }));
        }
    };
    Area.prototype._form = function (width, height, svg, prev) {
        var css = "chart " + this.config.type + " " + (this.config.css || "") + " " + (this.config.dashed ? "dash-line" : "");
        var _a = this.config, id = _a.id, fill = _a.fill, alpha = _a.alpha, color = _a.color, strokeWidth = _a.strokeWidth;
        var points = this._points;
        var last = points[points.length - 1];
        var d = "";
        if (prev) {
            // bottom line in stacked area
            for (var i = prev.length - 1; i >= 0; i--) {
                var item = prev[i];
                d += (i === points.length - 1 ? "M" + item[0] + " " + item[1] + " " : "L" + item[0] + " " + item[1] + " ");
            }
            // top line in stacked area
            d += points.map(function (item, index) { return (!index ? "V " + item[1] : "L " + item[0] + " " + item[1]); }).join(" ") + "Z";
        }
        else {
            d += points.map(function (item, index) { return (index ? "L" + item[0] + " " + item[1] : "M0 " + height + " L0 " + item[1] + " L" + item[0] + " " + item[1]); }).join(" ") + ("L" + width + " " + last[1] + " V " + height);
        }
        if (strokeWidth) {
            var len_1 = points.length - 1;
            var strokePadding_1 = function (index) { return index === len_1 ? -.5 : (index ? 0 : .5); };
            var line = points.map(function (item, index) { return (index ? "L" : "M") + (item[0] + strokePadding_1(index) + " " + item[1]); }).join(" ");
            var linePath = dom_1.sv("path", {
                "d": line,
                "stroke-width": strokeWidth,
                "stroke": color,
                "fill": "none",
                "class": css
            });
            svg.push(linePath);
        }
        var path = dom_1.sv("path", {
            "id": "seria" + id,
            d: d,
            "class": css,
            fill: fill,
            "fill-opacity": alpha,
            "stroke": "none"
        });
        svg.push(path);
        return svg;
    };
    Area.prototype._setDefaults = function (config) {
        var defaults = {
            alpha: 0.3,
            strokeWidth: 2,
            fill: config.color || "#5E83BA",
            color: "#5E83BA",
            active: true,
            tooltip: true,
            pointType: types_1.PointType.empty
        };
        this.config = __assign({}, defaults, config);
        var showTooltip = this.config.tooltip;
        var point = this.config.pointType;
        var color = this.config.pointColor || this.config.color;
        if (point) {
            this._drawPointType = this._getPointType(point, color, showTooltip);
        }
    };
    return Area;
}(ScaleSeria_1.default));
exports.default = Area;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var ScaleSeria_1 = __webpack_require__(13);
var Bar = /** @class */ (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._shift = 0;
        return _this;
    }
    Bar.prototype.addScale = function (type, scale) {
        _super.prototype.addScale.call(this, type, scale);
        scale.addPadding();
    };
    Bar.prototype.seriesShift = function (shift) {
        this._shift = shift;
        return this.config.barWidth;
    };
    Bar.prototype.paint = function (width, height, prev) {
        _super.prototype.paint.call(this, width, height);
        if (!this.config.active) {
            return null;
        }
        var svg = [];
        if (this._gradient) {
            svg.push(dom_1.sv("defs", [this._gradient()]));
        }
        var css = "chart " + this.config.type + " " + (this.config.css || "") + " " + (this.config.dashed ? "dash-line" : "");
        var form = this._getForm(this._points, css, width, height, prev);
        svg = svg.concat(form);
        return dom_1.sv("g", { class: "seria", _key: this.id }, svg);
    };
    Bar.prototype.getTooltipType = function (_id, _x, y) {
        if (this.config.baseLine !== undefined && this._baseLinePosition < y) {
            return types_1.TooltipType.bot;
        }
        return types_1.TooltipType.top;
    };
    Bar.prototype._getClosestDist = function (x, y, px, py) {
        if (this.config.stacked && y < py) {
            return Infinity;
        }
        return Math.abs(x - px);
    };
    Bar.prototype._path = function (item, prev) {
        item[0] += this._shift;
        return "\nM " + (item[0] - (this.config.barWidth / 2)) + " " + prev + "\nV " + item[1] + "\nh " + this.config.barWidth + "\nV " + prev;
    };
    Bar.prototype._base = function (height) {
        var baseLine = this.config.baseLine;
        return this._baseLinePosition = baseLine !== undefined ? this.yScale.point(baseLine) * height : height - 1;
    };
    Bar.prototype._text = function (item, prev) {
        return {
            x: item[0],
            y: (prev + item[1]) / 2,
            class: "bar-text"
        };
    };
    Bar.prototype._getForm = function (points, css, _width, height, prev) {
        var _this = this;
        var _a = this.config, fill = _a.fill, alpha = _a.alpha, showText = _a.showText, showTextTemplate = _a.showTextTemplate;
        var svg = [];
        var base = this._base(height);
        var getPrev = function (index) { return !prev ? base : prev[index][1]; };
        var series = points.map(function (item, index) { return dom_1.sv("path", {
            "_key": "seria" + _this.config.id + index,
            "d": _this._path(item, getPrev(index)),
            "class": css,
            fill: fill,
            "fill-opacity": alpha
        }); });
        svg.push.apply(svg, series);
        if (showText || showTextTemplate) {
            var isWrite_1 = function (item, index) { return Math.abs(getPrev(index) - item[1]) > 16 ? true : false; }; // hide text, where height < 16
            var text = points.map(function (item, index) {
                var value = _this._getText(item);
                return isWrite_1(item, index) ? dom_1.sv("text", _this._text(item, getPrev(index)), [showTextTemplate ? common_1.verticalCenteredText(showTextTemplate(value)) : common_1.verticalCenteredText(value)]) : null;
            });
            svg.push.apply(svg, text);
        }
        return svg;
    };
    Bar.prototype._getText = function (item) {
        return item[4].toString();
    };
    Bar.prototype._setDefaults = function (config) {
        var defaults = {
            barWidth: 30,
            alpha: 1,
            active: true,
            tooltip: true,
            pointType: types_1.PointType.empty
        };
        this.config = __assign({}, defaults, config);
        var showTooltip = this.config.tooltip;
        var point = this.config.pointType;
        var color = this.config.pointColor || this.config.color;
        if (point) {
            this.config.pointType = point;
            this._drawPointType = this._getPointType(point, color, showTooltip);
        }
        if (this.config.gradient) {
            var id_1 = "gradient" + core_1.uid();
            var gradient_1 = this.config.gradient(this.config.fill);
            this._gradient = function () { return common_1.linearGradient(gradient_1, id_1); };
            this.config.fill = "url(#" + id_1 + ")";
        }
    };
    return Bar;
}(ScaleSeria_1.default));
exports.default = Bar;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function spline(initPoints, link) {
    var len = initPoints.length;
    var points;
    if (len < 3) {
        points = initPoints;
    }
    else {
        var p0 = initPoints[0];
        var p1 = initPoints[0];
        var p2 = initPoints[1];
        var p3 = initPoints[2];
        points = [initPoints[0].slice(0, 2)];
        for (var i = 1; i < len; i++) {
            points.push([
                ((-p0[0] + 6 * p1[0] + p2[0]) / 6),
                ((-p0[1] + 6 * p1[1] + p2[1]) / 6),
                ((p1[0] + 6 * p2[0] - p3[0]) / 6),
                ((p1[1] + 6 * p2[1] - p3[1]) / 6),
                p2[0],
                p2[1]
            ]);
            p0 = p1;
            p1 = p2;
            p2 = p3;
            p3 = initPoints[i + 2] || p3;
        }
    }
    var d = "";
    for (var i = 0; i < points.length; i++) {
        var point = points[i];
        var n = point.length;
        if (!i) {
            d += (link ? "L" : "M") + (point[n - 2] + " " + point[n - 1]);
        }
        else if (n > 4) {
            d += "C" + point[0] + " " + point[1] + "\n\t\t\t\t" + point[2] + " " + point[3] + "\n\t\t\t\t" + point[4] + " " + point[5];
        }
        else {
            d += "S" + point[0] + " " + point[1] + "\n\t\t\t\t" + point[2] + " " + point[3];
        }
    }
    return d;
}
exports.default = spline;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(28);
var Chart_1 = __webpack_require__(29);
exports.Chart = Chart_1.Chart;
var dom_1 = __webpack_require__(0);
exports.vmdom = { sv: dom_1.sv };


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var events_1 = __webpack_require__(10);
var view_1 = __webpack_require__(17);
var ts_data_1 = __webpack_require__(35);
var ComposeLayer_1 = __webpack_require__(45);
var Legend_1 = __webpack_require__(47);
var index_1 = __webpack_require__(49);
var index_2 = __webpack_require__(53);
var Stacker_1 = __webpack_require__(63);
var Tooltip_1 = __webpack_require__(64);
var types_1 = __webpack_require__(2);
var Chart = /** @class */ (function (_super) {
    __extends(Chart, _super);
    function Chart(node, config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this, null, config) || this;
        // using zero values ensure that widget will not attempt to render self in the hidden state
        _this._width = 0;
        _this._height = 0;
        _this._left = 0;
        _this._top = 0;
        var dataConfig = {};
        if (config.maxPoints) {
            dataConfig.approximate = {
                value: config.series.map(function (a) { return a.value; }),
                maxNum: config.maxPoints
            };
        }
        if (Array.isArray(config.data)) {
            _this.events = new events_1.EventSystem(_this);
            _this.data = new ts_data_1.DataCollection(dataConfig, _this.events);
            _this.data.parse(config.data);
        }
        else if (config.data && config.data.events) {
            _this.data = config.data;
            _this.events = _this.data.events;
            _this.events.context = _this;
        }
        else {
            _this.events = new events_1.EventSystem(_this);
            _this.data = new ts_data_1.DataCollection(dataConfig, _this.events);
        }
        _this._globalHTMLHandlers = {
            onmousemove: function (e) {
                var _a = _this._layers.getSizes(), left = _a.left, top = _a.top, bottom = _a.bottom, right = _a.right;
                var pageX = e.pageX, pageY = e.pageY;
                var rects = _this.getRootView().node.el.getBoundingClientRect();
                _this._left = rects.left + window.pageXOffset;
                _this._top = rects.top + window.pageYOffset;
                var x = pageX - left - _this._left;
                var y = pageY - top - _this._top;
                if (x >= 0 && x <= _this._width - right - left && y >= 0 && y <= _this._height - bottom - top) {
                    _this.events.fire(types_1.ChartEvents.chartMouseMove, [x, y, _this._left + left, _this._top + top]);
                }
                else {
                    _this.events.fire(types_1.ChartEvents.chartMouseLeave);
                }
            },
            onmouseleave: function () { return _this.events.fire(types_1.ChartEvents.chartMouseLeave); }
        };
        _this._layers = new ComposeLayer_1.ComposeLayer();
        _this.setConfig(config);
        _this._initEvents();
        var render = function (vm, obj) {
            if (!_this.data.getLength()) {
                return dom_1.el("div");
            }
            var content = [
                dom_1.resizer(function (x, y) {
                    _this._width = x;
                    _this._height = y || 400; // if height is not provided, use default value
                    var view = _this.getRootView();
                    if (view && view.node && view.node.el) {
                        var rects = view.node.el.getBoundingClientRect();
                        _this._left = rects.left + window.pageXOffset;
                        _this._top = rects.top + window.pageYOffset;
                    }
                    _this.events.fire(types_1.ChartEvents.resize, [{
                            width: _this._width,
                            height: _this._height
                        }]);
                    _this.paint();
                })
            ];
            if (_this._width && _this._height) {
                content.push(_this._layers.toVDOM(_this._width, _this._height));
            }
            return dom_1.el(".dhx_widget.dhx_chart", {
                class: config.css ? config.css : "",
                onmousemove: _this._globalHTMLHandlers.onmousemove,
                onmouseleave: _this._globalHTMLHandlers.onmouseleave
            }, content);
        };
        _this.mount(node, dom_1.create({ render: render }));
        return _this;
    }
    Chart.prototype.getSeries = function (key) {
        return this._series[key];
    };
    Chart.prototype.eachSeries = function (handler) {
        var result = [];
        for (var key in this._series) {
            result.push(handler.call(this, this._series[key]));
        }
        return result;
    };
    Chart.prototype.destructor = function () {
        this._tooltip.destructor();
        this.events.clear();
        this.unmount();
    };
    Chart.prototype.setConfig = function (config) {
        var _this = this;
        this.config = config;
        this._layers.clear();
        this._series = {};
        this._scales = {};
        var min;
        // let baseLine;
        if (config.scales) {
            for (var key in config.scales) {
                var scale = __assign({}, config.scales[key]);
                if (config.scales[key].min !== undefined) {
                    min = config.scales[key].min;
                }
                scale.type = scale.type || this._detectScaleType(scale, key);
                if (config.scales.radial && key !== "radial") {
                    scale.hidden = true;
                }
                this._setScale(scale, key);
            }
        }
        var stack = new Stacker_1.default();
        this._layers.add(stack);
        config.series.forEach(function (cfg) {
            if (cfg.baseLine !== undefined && cfg.baseLine < min) {
                cfg.baseLine = undefined;
            }
            var serieConfig = __assign({}, cfg);
            serieConfig.type = serieConfig.type || config.type;
            var chartFactory = index_2.default[serieConfig.type];
            if (serieConfig.barWidth || _this.config.barWidth) {
                serieConfig.barWidth = serieConfig.barWidth || _this.config.barWidth;
            }
            var chart = new chartFactory(_this.data, serieConfig, _this.events);
            var chartScales = serieConfig.scales || [types_1.ScaleType.bottom, types_1.ScaleType.left];
            chartScales.forEach(function (type) {
                var scale = _this._scales[type];
                if (!scale) {
                    return;
                }
                chart.addScale(type, scale);
                if (!serieConfig.stacked) {
                    scale.add(chart);
                }
                else {
                    scale.add(stack);
                }
            });
            _this._series[chart.id] = chart;
            if (serieConfig.stacked) {
                stack.add(chart);
            }
            else {
                _this._layers.add(chart);
            }
        });
        if (config.legend) {
            var legendConfig = __assign({}, config.legend);
            if (legendConfig.series) {
                legendConfig.$seriesInfo = legendConfig.series.map(function (id) { return _this._series[id]; });
            }
            var legend = new Legend_1.Legend(this.data, legendConfig, this.events);
            this._layers.add(legend);
        }
        this._tooltip = new Tooltip_1.Tooltip(document.body, { chart: this });
        this.paint();
    };
    Chart.prototype._setScale = function (config, position) {
        var scale = new index_1.default[config.type](this.data, config, position);
        if (scale.config.grid && scale.config.type !== "radial") {
            this._layers.add(scale.scaleGrid());
        }
        this._layers.add(scale);
        this._scales[position] = scale;
    };
    Chart.prototype._detectScaleType = function (config, key) {
        if (key === "radial") {
            return key;
        }
        if (config.text) {
            return "text";
        }
        return "numeric";
    };
    Chart.prototype._initEvents = function () {
        var _this = this;
        // hide/show series on legend click
        this.events.on(types_1.ChartEvents.toggleSeries, function (id, pieLike) {
            if (pieLike) {
                var serie = _this._series[Object.keys(_this._series)[0]];
                if (serie) {
                    serie.toggle(id);
                    _this.paint();
                }
            }
            else if (_this._series[id]) {
                _this._series[id].toggle();
                _this.paint();
            }
        }, this);
        // repaint on data change
        this.events.on(ts_data_1.DataEvents.change, function () { return _this.paint(); });
    };
    return Chart;
}(view_1.View));
exports.Chart = Chart;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(31);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(9)))

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(9), __webpack_require__(32)))

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

/**
* Copyright (c) 2017, Leon Sorokin
* All rights reserved. (MIT Licensed)
*
* domvm.js (DOM ViewModel)
* A thin, fast, dependency-free vdom view layer
* @preserve https://github.com/leeoniya/domvm (v3.2.6, micro build)
*/

(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

// NOTE: if adding a new *VNode* type, make it < COMMENT and renumber rest.
// There are some places that test <= COMMENT to assert if node is a VNode

// VNode types
var ELEMENT	= 1;
var TEXT		= 2;
var COMMENT	= 3;

// placeholder types
var VVIEW		= 4;
var VMODEL		= 5;

var ENV_DOM = typeof window !== "undefined";
var win = ENV_DOM ? window : {};
var rAF = win.requestAnimationFrame;

var emptyObj = {};

function noop() {}

var isArr = Array.isArray;

function isSet(val) {
	return val != null;
}

function isPlainObj(val) {
	return val != null && val.constructor === Object;		//  && typeof val === "object"
}

function insertArr(targ, arr, pos, rem) {
	targ.splice.apply(targ, [pos, rem].concat(arr));
}

function isVal(val) {
	var t = typeof val;
	return t === "string" || t === "number";
}

function isFunc(val) {
	return typeof val === "function";
}

function isProm(val) {
	return typeof val === "object" && isFunc(val.then);
}



function assignObj(targ) {
	var args = arguments;

	for (var i = 1; i < args.length; i++)
		{ for (var k in args[i])
			{ targ[k] = args[i][k]; } }

	return targ;
}

// export const defProp = Object.defineProperty;

function deepSet(targ, path, val) {
	var seg;

	while (seg = path.shift()) {
		if (path.length === 0)
			{ targ[seg] = val; }
		else
			{ targ[seg] = targ = targ[seg] || {}; }
	}
}

/*
export function deepUnset(targ, path) {
	var seg;

	while (seg = path.shift()) {
		if (path.length === 0)
			targ[seg] = val;
		else
			targ[seg] = targ = targ[seg] || {};
	}
}
*/

function sliceArgs(args, offs) {
	var arr = [];
	for (var i = offs; i < args.length; i++)
		{ arr.push(args[i]); }
	return arr;
}

function cmpObj(a, b) {
	for (var i in a)
		{ if (a[i] !== b[i])
			{ return false; } }

	return true;
}

function cmpArr(a, b) {
	var alen = a.length;

	if (b.length !== alen)
		{ return false; }

	for (var i = 0; i < alen; i++)
		{ if (a[i] !== b[i])
			{ return false; } }

	return true;
}

// https://github.com/darsain/raft
// rAF throttler, aggregates multiple repeated redraw calls within single animframe
function raft(fn) {
	if (!rAF)
		{ return fn; }

	var id, ctx, args;

	function call() {
		id = 0;
		fn.apply(ctx, args);
	}

	return function() {
		ctx = this;
		args = arguments;
		if (!id) { id = rAF(call); }
	};
}

function curry(fn, args, ctx) {
	return function() {
		return fn.apply(ctx, args);
	};
}

/*
export function prop(val, cb, ctx, args) {
	return function(newVal, execCb) {
		if (newVal !== undefined && newVal !== val) {
			val = newVal;
			execCb !== false && isFunc(cb) && cb.apply(ctx, args);
		}

		return val;
	};
}
*/

/*
// adapted from https://github.com/Olical/binary-search
export function binaryKeySearch(list, item) {
    var min = 0;
    var max = list.length - 1;
    var guess;

	var bitwise = (max <= 2147483647) ? true : false;
	if (bitwise) {
		while (min <= max) {
			guess = (min + max) >> 1;
			if (list[guess].key === item) { return guess; }
			else {
				if (list[guess].key < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	} else {
		while (min <= max) {
			guess = Math.floor((min + max) / 2);
			if (list[guess].key === item) { return guess; }
			else {
				if (list[guess].key < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	}

    return -1;
}
*/

// https://en.wikipedia.org/wiki/Longest_increasing_subsequence
// impl borrowed from https://github.com/ivijs/ivi
function longestIncreasingSubsequence(a) {
	var p = a.slice();
	var result = [];
	result.push(0);
	var u;
	var v;

	for (var i = 0, il = a.length; i < il; ++i) {
		var j = result[result.length - 1];
		if (a[j] < a[i]) {
			p[i] = j;
			result.push(i);
			continue;
		}

		u = 0;
		v = result.length - 1;

		while (u < v) {
			var c = ((u + v) / 2) | 0;
			if (a[result[c]] < a[i]) {
				u = c + 1;
			} else {
				v = c;
			}
		}

		if (a[i] < a[result[u]]) {
			if (u > 0) {
				p[i] = result[u - 1];
			}
			result[u] = i;
		}
	}

	u = result.length;
	v = result[u - 1];

	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}

	return result;
}

// based on https://github.com/Olical/binary-search
function binaryFindLarger(item, list) {
	var min = 0;
	var max = list.length - 1;
	var guess;

	var bitwise = (max <= 2147483647) ? true : false;
	if (bitwise) {
		while (min <= max) {
			guess = (min + max) >> 1;
			if (list[guess] === item) { return guess; }
			else {
				if (list[guess] < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	} else {
		while (min <= max) {
			guess = Math.floor((min + max) / 2);
			if (list[guess] === item) { return guess; }
			else {
				if (list[guess] < item) { min = guess + 1; }
				else { max = guess - 1; }
			}
		}
	}

	return (min == list.length) ? null : min;

//	return -1;
}

function isEvProp(name) {
	return name[0] === "o" && name[1] === "n";
}

function isSplProp(name) {
	return name[0] === "_";
}

function isStyleProp(name) {
	return name === "style";
}

function repaint(node) {
	node && node.el && node.el.offsetHeight;
}

function isHydrated(vm) {
	return vm.node != null && vm.node.el != null;
}

// tests interactive props where real val should be compared
function isDynProp(tag, attr) {
//	switch (tag) {
//		case "input":
//		case "textarea":
//		case "select":
//		case "option":
			switch (attr) {
				case "value":
				case "checked":
				case "selected":
//				case "selectedIndex":
					return true;
			}
//	}

	return false;
}

function getVm(n) {
	n = n || emptyObj;
	while (n.vm == null && n.parent)
		{ n = n.parent; }
	return n.vm;
}

function VNode() {}

var VNodeProto = VNode.prototype = {
	constructor: VNode,

	type:	null,

	vm:		null,

	// all this stuff can just live in attrs (as defined) just have getters here for it
	key:	null,
	ref:	null,
	data:	null,
	hooks:	null,
	ns:		null,

	el:		null,

	tag:	null,
	attrs:	null,
	body:	null,

	flags:	0,

	_class:	null,
	_diff:	null,

	// pending removal on promise resolution
	_dead:	false,
	// part of longest increasing subsequence?
	_lis:	false,

	idx:	null,
	parent:	null,

	/*
	// break out into optional fluent module
	key:	function(val) { this.key	= val; return this; },
	ref:	function(val) { this.ref	= val; return this; },		// deep refs
	data:	function(val) { this.data	= val; return this; },
	hooks:	function(val) { this.hooks	= val; return this; },		// h("div").hooks()
	html:	function(val) { this.html	= true; return this.body(val); },

	body:	function(val) { this.body	= val; return this; },
	*/
};

function defineText(body) {
	var node = new VNode;
	node.type = TEXT;
	node.body = body;
	return node;
}

// creates a one-shot self-ending stream that redraws target vm
// TODO: if it's already registered by any parent vm, then ignore to avoid simultaneous parent & child refresh

var tagCache = {};

var RE_ATTRS = /\[(\w+)(?:=(\w+))?\]/g;

function cssTag(raw) {
	{
		var cached = tagCache[raw];

		if (cached == null) {
			var tag, id, cls, attr;

			tagCache[raw] = cached = {
				tag:	(tag	= raw.match( /^[-\w]+/))		?	tag[0]						: "div",
				id:		(id		= raw.match( /#([-\w]+)/))		? 	id[1]						: null,
				class:	(cls	= raw.match(/\.([-\w.]+)/))		?	cls[1].replace(/\./g, " ")	: null,
				attrs:	null,
			};

			while (attr = RE_ATTRS.exec(raw)) {
				if (cached.attrs == null)
					{ cached.attrs = {}; }
				cached.attrs[attr[1]] = attr[2] || "";
			}
		}

		return cached;
	}
}

// (de)optimization flags

// forces slow bottom-up removeChild to fire deep willRemove/willUnmount hooks,
var DEEP_REMOVE = 1;
// prevents inserting/removing/reordering of children
var FIXED_BODY = 2;
// enables fast keyed lookup of children via binary search, expects homogeneous keyed body
var KEYED_LIST = 4;
// indicates an vnode match/diff/recycler function for body
var LAZY_LIST = 8;

function initElementNode(tag, attrs, body, flags) {
	var node = new VNode;

	node.type = ELEMENT;

	if (isSet(flags))
		{ node.flags = flags; }

	node.attrs = attrs;

	var parsed = cssTag(tag);

	node.tag = parsed.tag;

	// meh, weak assertion, will fail for id=0, etc.
	if (parsed.id || parsed.class || parsed.attrs) {
		var p = node.attrs || {};

		if (parsed.id && !isSet(p.id))
			{ p.id = parsed.id; }

		if (parsed.class) {
			node._class = parsed.class;		// static class
			p.class = parsed.class + (isSet(p.class) ? (" " + p.class) : "");
		}
		if (parsed.attrs) {
			for (var key in parsed.attrs)
				{ if (!isSet(p[key]))
					{ p[key] = parsed.attrs[key]; } }
		}

//		if (node.attrs !== p)
			node.attrs = p;
	}

	var mergedAttrs = node.attrs;

	if (isSet(mergedAttrs)) {
		if (isSet(mergedAttrs._key))
			{ node.key = mergedAttrs._key; }

		if (isSet(mergedAttrs._ref))
			{ node.ref = mergedAttrs._ref; }

		if (isSet(mergedAttrs._hooks))
			{ node.hooks = mergedAttrs._hooks; }

		if (isSet(mergedAttrs._data))
			{ node.data = mergedAttrs._data; }

		if (isSet(mergedAttrs._flags))
			{ node.flags = mergedAttrs._flags; }

		if (!isSet(node.key)) {
			if (isSet(node.ref))
				{ node.key = node.ref; }
			else if (isSet(mergedAttrs.id))
				{ node.key = mergedAttrs.id; }
			else if (isSet(mergedAttrs.name))
				{ node.key = mergedAttrs.name + (mergedAttrs.type === "radio" || mergedAttrs.type === "checkbox" ? mergedAttrs.value : ""); }
		}
	}

	if (body != null)
		{ node.body = body; }

	return node;
}

function setRef(vm, name, node) {
	var path = ["refs"].concat(name.split("."));
	deepSet(vm, path, node);
}

function setDeepRemove(node) {
	while (node = node.parent)
		{ node.flags |= DEEP_REMOVE; }
}

// vnew, vold
function preProc(vnew, parent, idx, ownVm) {
	if (vnew.type === VMODEL || vnew.type === VVIEW)
		{ return; }

	vnew.parent = parent;
	vnew.idx = idx;
	vnew.vm = ownVm;

	if (vnew.ref != null)
		{ setRef(getVm(vnew), vnew.ref, vnew); }

	var nh = vnew.hooks,
		vh = ownVm && ownVm.hooks;

	if (nh && (nh.willRemove || nh.didRemove) ||
		vh && (vh.willUnmount || vh.didUnmount))
		{ setDeepRemove(vnew); }

	if (isArr(vnew.body))
		{ preProcBody(vnew); }
	else {}
}

function preProcBody(vnew) {
	var body = vnew.body;

	for (var i = 0; i < body.length; i++) {
		var node2 = body[i];

		// remove false/null/undefined
		if (node2 === false || node2 == null)
			{ body.splice(i--, 1); }
		// flatten arrays
		else if (isArr(node2)) {
			insertArr(body, node2, i--, 1);
		}
		else {
			if (node2.type == null)
				{ body[i] = node2 = defineText(""+node2); }

			if (node2.type === TEXT) {
				// remove empty text nodes
				if (node2.body == null || node2.body === "")
					{ body.splice(i--, 1); }
				// merge with previous text node
				else if (i > 0 && body[i-1].type === TEXT) {
					body[i-1].body += node2.body;
					body.splice(i--, 1);
				}
				else
					{ preProc(node2, vnew, i, null); }
			}
			else
				{ preProc(node2, vnew, i, null); }
		}
	}
}

var unitlessProps = {
	animationIterationCount: true,
	boxFlex: true,
	boxFlexGroup: true,
	boxOrdinalGroup: true,
	columnCount: true,
	flex: true,
	flexGrow: true,
	flexPositive: true,
	flexShrink: true,
	flexNegative: true,
	flexOrder: true,
	gridRow: true,
	gridColumn: true,
	order: true,
	lineClamp: true,

	borderImageOutset: true,
	borderImageSlice: true,
	borderImageWidth: true,
	fontWeight: true,
	lineHeight: true,
	opacity: true,
	orphans: true,
	tabSize: true,
	widows: true,
	zIndex: true,
	zoom: true,

	fillOpacity: true,
	floodOpacity: true,
	stopOpacity: true,
	strokeDasharray: true,
	strokeDashoffset: true,
	strokeMiterlimit: true,
	strokeOpacity: true,
	strokeWidth: true
};

function autoPx(name, val) {
	{
		// typeof val === 'number' is faster but fails for numeric strings
		return !isNaN(val) && !unitlessProps[name] ? (val + "px") : val;
	}
}

// assumes if styles exist both are objects or both are strings
function patchStyle(n, o) {
	var ns =     (n.attrs || emptyObj).style;
	var os = o ? (o.attrs || emptyObj).style : null;

	// replace or remove in full
	if (ns == null || isVal(ns))
		{ n.el.style.cssText = ns; }
	else {
		for (var nn in ns) {
			var nv = ns[nn];

			if (os == null || nv != null && nv !== os[nn])
				{ n.el.style[nn] = autoPx(nn, nv); }
		}

		// clean old
		if (os) {
			for (var on in os) {
				if (ns[on] == null)
					{ n.el.style[on] = ""; }
			}
		}
	}
}

var didQueue = [];

function fireHook(hooks, name, o, n, immediate) {
	if (hooks != null) {
		var fn = o.hooks[name];

		if (fn) {
			if (name[0] === "d" && name[1] === "i" && name[2] === "d") {	// did*
				//	console.log(name + " should queue till repaint", o, n);
				immediate ? repaint(o.parent) && fn(o, n) : didQueue.push([fn, o, n]);
			}
			else {		// will*
				//	console.log(name + " may delay by promise", o, n);
				return fn(o, n);		// or pass  done() resolver
			}
		}
	}
}

function drainDidHooks(vm) {
	if (didQueue.length) {
		repaint(vm.node);

		var item;
		while (item = didQueue.shift())
			{ item[0](item[1], item[2]); }
	}
}

var doc = ENV_DOM ? document : null;

function closestVNode(el) {
	while (el._node == null)
		{ el = el.parentNode; }
	return el._node;
}

function createElement(tag, ns) {
	if (ns != null)
		{ return doc.createElementNS(ns, tag); }
	return doc.createElement(tag);
}

function createTextNode(body) {
	return doc.createTextNode(body);
}

function createComment(body) {
	return doc.createComment(body);
}

// ? removes if !recycled
function nextSib(sib) {
	return sib.nextSibling;
}

// ? removes if !recycled
function prevSib(sib) {
	return sib.previousSibling;
}

// TODO: this should collect all deep proms from all hooks and return Promise.all()
function deepNotifyRemove(node) {
	var vm = node.vm;

	var wuRes = vm != null && fireHook(vm.hooks, "willUnmount", vm, vm.data);

	var wrRes = fireHook(node.hooks, "willRemove", node);

	if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE && isArr(node.body)) {
		for (var i = 0; i < node.body.length; i++)
			{ deepNotifyRemove(node.body[i]); }
	}

	return wuRes || wrRes;
}

function _removeChild(parEl, el, immediate) {
	var node = el._node, vm = node.vm;

	if (isArr(node.body)) {
		if ((node.flags & DEEP_REMOVE) === DEEP_REMOVE) {
			for (var i = 0; i < node.body.length; i++)
				{ _removeChild(el, node.body[i].el); }
		}
		else
			{ deepUnref(node); }
	}

	delete el._node;

	parEl.removeChild(el);

	fireHook(node.hooks, "didRemove", node, null, immediate);

	if (vm != null) {
		fireHook(vm.hooks, "didUnmount", vm, vm.data, immediate);
		vm.node = null;
	}
}

// todo: should delay parent unmount() by returning res prom?
function removeChild(parEl, el) {
	var node = el._node;

	// already marked for removal
	if (node._dead) { return; }

	var res = deepNotifyRemove(node);

	if (res != null && isProm(res)) {
		node._dead = true;
		res.then(curry(_removeChild, [parEl, el, true]));
	}
	else
		{ _removeChild(parEl, el); }
}

function deepUnref(node) {
	var obody = node.body;

	for (var i = 0; i < obody.length; i++) {
		var o2 = obody[i];
		delete o2.el._node;

		if (o2.vm != null)
			{ o2.vm.node = null; }

		if (isArr(o2.body))
			{ deepUnref(o2); }
	}
}

function clearChildren(parent) {
	var parEl = parent.el;

	if ((parent.flags & DEEP_REMOVE) === 0) {
		isArr(parent.body) && deepUnref(parent);
		parEl.textContent = null;
	}
	else {
		var el = parEl.firstChild;

		do {
			var next = nextSib(el);
			removeChild(parEl, el);
		} while (el = next);
	}
}

// todo: hooks
function insertBefore(parEl, el, refEl) {
	var node = el._node, inDom = el.parentNode != null;

	// el === refEl is asserted as a no-op insert called to fire hooks
	var vm = (el === refEl || !inDom) ? node.vm : null;

	if (vm != null)
		{ fireHook(vm.hooks, "willMount", vm, vm.data); }

	fireHook(node.hooks, inDom ? "willReinsert" : "willInsert", node);
	parEl.insertBefore(el, refEl);
	fireHook(node.hooks, inDom ? "didReinsert" : "didInsert", node);

	if (vm != null)
		{ fireHook(vm.hooks, "didMount", vm, vm.data); }
}

function insertAfter(parEl, el, refEl) {
	insertBefore(parEl, el, refEl ? nextSib(refEl) : null);
}

var onemit = {};

function emitCfg(cfg) {
	assignObj(onemit, cfg);
}

function emit(evName) {
	var targ = this,
		src = targ;

	var args = sliceArgs(arguments, 1).concat(src, src.data);

	do {
		var evs = targ.onemit;
		var fn = evs ? evs[evName] : null;

		if (fn) {
			fn.apply(targ, args);
			break;
		}
	} while (targ = targ.parent());

	if (onemit[evName])
		{ onemit[evName].apply(targ, args); }
}

var onevent = noop;

function config(newCfg) {
	onevent = newCfg.onevent || onevent;

	{
		if (newCfg.onemit)
			{ emitCfg(newCfg.onemit); }
	}

	
}

function bindEv(el, type, fn) {
	el[type] = fn;
}

function exec(fn, args, e, node, vm) {
	var out = fn.apply(vm, args.concat([e, node, vm, vm.data]));

	// should these respect out === false?
	vm.onevent(e, node, vm, vm.data, args);
	onevent.call(null, e, node, vm, vm.data, args);

	if (out === false) {
		e.preventDefault();
		e.stopPropagation();
	}
}

function handle(e) {
	var node = closestVNode(e.target);
	var vm = getVm(node);

	var evDef = e.currentTarget._node.attrs["on" + e.type], fn, args;

	if (isArr(evDef)) {
		fn = evDef[0];
		args = evDef.slice(1);
		exec(fn, args, e, node, vm);
	}
	else {
		for (var sel in evDef) {
			if (e.target.matches(sel)) {
				var evDef2 = evDef[sel];

				if (isArr(evDef2)) {
					fn = evDef2[0];
					args = evDef2.slice(1);
				}
				else {
					fn = evDef2;
					args = [];
				}

				exec(fn, args, e, node, vm);
			}
		}
	}
}

function patchEvent(node, name, nval, oval) {
	if (nval === oval)
		{ return; }

	var el = node.el;

	if (nval == null || isFunc(nval))
		{ bindEv(el, name, nval); }
	else if (oval == null)
		{ bindEv(el, name, handle); }
}

function remAttr(node, name, asProp) {
	if (name[0] === ".") {
		name = name.substr(1);
		asProp = true;
	}

	if (asProp)
		{ node.el[name] = ""; }
	else
		{ node.el.removeAttribute(name); }
}

// setAttr
// diff, ".", "on*", bool vals, skip _*, value/checked/selected selectedIndex
function setAttr(node, name, val, asProp, initial) {
	var el = node.el;

	if (val == null)
		{ !initial && remAttr(node, name, false); }		// will also removeAttr of style: null
	else if (node.ns != null)
		{ el.setAttribute(name, val); }
	else if (name === "class")
		{ el.className = val; }
	else if (name === "id" || typeof val === "boolean" || asProp)
		{ el[name] = val; }
	else if (name[0] === ".")
		{ el[name.substr(1)] = val; }
	else
		{ el.setAttribute(name, val); }
}

function patchAttrs(vnode, donor, initial) {
	var nattrs = vnode.attrs || emptyObj;
	var oattrs = donor.attrs || emptyObj;

	if (nattrs === oattrs) {
		
	}
	else {
		for (var key in nattrs) {
			var nval = nattrs[key];
			var isDyn = isDynProp(vnode.tag, key);
			var oval = isDyn ? vnode.el[key] : oattrs[key];

			if (nval === oval) {}
			else if (isStyleProp(key))
				{ patchStyle(vnode, donor); }
			else if (isSplProp(key)) {}
			else if (isEvProp(key))
				{ patchEvent(vnode, key, nval, oval); }
			else
				{ setAttr(vnode, key, nval, isDyn, initial); }
		}

		// TODO: bench style.cssText = "" vs removeAttribute("style")
		for (var key in oattrs) {
			!(key in nattrs) &&
			!isSplProp(key) &&
			remAttr(vnode, key, isDynProp(vnode.tag, key) || isEvProp(key));
		}
	}
}

function createView(view, data, key, opts) {
	if (view.type === VVIEW) {
		data	= view.data;
		key		= view.key;
		opts	= view.opts;
		view	= view.view;
	}

	return new ViewModel(view, data, key, opts);
}

//import { XML_NS, XLINK_NS } from './defineSvgElement';
function hydrateBody(vnode) {
	for (var i = 0; i < vnode.body.length; i++) {
		var vnode2 = vnode.body[i];
		var type2 = vnode2.type;

		// ELEMENT,TEXT,COMMENT
		if (type2 <= COMMENT)
			{ insertBefore(vnode.el, hydrate(vnode2)); }		// vnode.el.appendChild(hydrate(vnode2))
		else if (type2 === VVIEW) {
			var vm = createView(vnode2.view, vnode2.data, vnode2.key, vnode2.opts)._redraw(vnode, i, false);		// todo: handle new data updates
			type2 = vm.node.type;
			insertBefore(vnode.el, hydrate(vm.node));
		}
		else if (type2 === VMODEL) {
			var vm = vnode2.vm;
			vm._redraw(vnode, i);					// , false
			type2 = vm.node.type;
			insertBefore(vnode.el, vm.node.el);		// , hydrate(vm.node)
		}
	}
}

//  TODO: DRY this out. reusing normal patch here negatively affects V8's JIT
function hydrate(vnode, withEl) {
	if (vnode.el == null) {
		if (vnode.type === ELEMENT) {
			vnode.el = withEl || createElement(vnode.tag, vnode.ns);

		//	if (vnode.tag === "svg")
		//		vnode.el.setAttributeNS(XML_NS, 'xmlns:xlink', XLINK_NS);

			if (vnode.attrs != null)
				{ patchAttrs(vnode, emptyObj, true); }

			if ((vnode.flags & LAZY_LIST) === LAZY_LIST)	// vnode.body instanceof LazyList
				{ vnode.body.body(vnode); }

			if (isArr(vnode.body))
				{ hydrateBody(vnode); }
			else if (vnode.body != null && vnode.body !== "")
				{ vnode.el.textContent = vnode.body; }
		}
		else if (vnode.type === TEXT)
			{ vnode.el = withEl || createTextNode(vnode.body); }
		else if (vnode.type === COMMENT)
			{ vnode.el = withEl || createComment(vnode.body); }
	}

	vnode.el._node = vnode;

	return vnode.el;
}

// prevent GCC from inlining some large funcs (which negatively affects Chrome's JIT)
//window.syncChildren = syncChildren;
window.lisMove = lisMove;

function nextNode(node, body) {
	return body[node.idx + 1];
}

function prevNode(node, body) {
	return body[node.idx - 1];
}

function parentNode(node) {
	return node.parent;
}

var BREAK = 1;
var BREAK_ALL = 2;

function syncDir(advSib, advNode, insert, sibName, nodeName, invSibName, invNodeName, invInsert) {
	return function(node, parEl, body, state, convTest, lis) {
		var sibNode, tmpSib;

		if (state[sibName] != null) {
			// skip dom elements not created by domvm
			if ((sibNode = state[sibName]._node) == null) {
				state[sibName] = advSib(state[sibName]);
				return;
			}

			if (parentNode(sibNode) !== node) {
				tmpSib = advSib(state[sibName]);
				sibNode.vm != null ? sibNode.vm.unmount(true) : removeChild(parEl, state[sibName]);
				state[sibName] = tmpSib;
				return;
			}
		}

		if (state[nodeName] == convTest)
			{ return BREAK_ALL; }
		else if (state[nodeName].el == null) {
			insert(parEl, hydrate(state[nodeName]), state[sibName]);	// should lis be updated here?
			state[nodeName] = advNode(state[nodeName], body);		// also need to advance sib?
		}
		else if (state[nodeName].el === state[sibName]) {
			state[nodeName] = advNode(state[nodeName], body);
			state[sibName] = advSib(state[sibName]);
		}
		// head->tail or tail->head
		else if (!lis && sibNode === state[invNodeName]) {
			tmpSib = state[sibName];
			state[sibName] = advSib(tmpSib);
			invInsert(parEl, tmpSib, state[invSibName]);
			state[invSibName] = tmpSib;
		}
		else {
			if (lis && state[sibName] != null)
				{ return lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state); }

			return BREAK;
		}
	};
}

function lisMove(advSib, advNode, insert, sibName, nodeName, parEl, body, sibNode, state) {
	if (sibNode._lis) {
		insert(parEl, state[nodeName].el, state[sibName]);
		state[nodeName] = advNode(state[nodeName], body);
	}
	else {
		// find closest tomb
		var t = binaryFindLarger(sibNode.idx, state.tombs);
		sibNode._lis = true;
		var tmpSib = advSib(state[sibName]);
		insert(parEl, state[sibName], t != null ? body[state.tombs[t]].el : t);

		if (t == null)
			{ state.tombs.push(sibNode.idx); }
		else
			{ state.tombs.splice(t, 0, sibNode.idx); }

		state[sibName] = tmpSib;
	}
}

var syncLft = syncDir(nextSib, nextNode, insertBefore, "lftSib", "lftNode", "rgtSib", "rgtNode", insertAfter);
var syncRgt = syncDir(prevSib, prevNode, insertAfter, "rgtSib", "rgtNode", "lftSib", "lftNode", insertBefore);

function syncChildren(node, donor) {
	var obody	= donor.body,
		parEl	= node.el,
		body	= node.body,
		state = {
			lftNode:	body[0],
			rgtNode:	body[body.length - 1],
			lftSib:		((obody)[0] || emptyObj).el,
			rgtSib:		(obody[obody.length - 1] || emptyObj).el,
		};

	converge:
	while (1) {
//		from_left:
		while (1) {
			var l = syncLft(node, parEl, body, state, null, false);
			if (l === BREAK) { break; }
			if (l === BREAK_ALL) { break converge; }
		}

//		from_right:
		while (1) {
			var r = syncRgt(node, parEl, body, state, state.lftNode, false);
			if (r === BREAK) { break; }
			if (r === BREAK_ALL) { break converge; }
		}

		sortDOM(node, parEl, body, state);
		break;
	}
}

// TODO: also use the state.rgtSib and state.rgtNode bounds, plus reduce LIS range
function sortDOM(node, parEl, body, state) {
	var kids = Array.prototype.slice.call(parEl.childNodes);
	var domIdxs = [];

	for (var k = 0; k < kids.length; k++) {
		var n = kids[k]._node;

		if (n.parent === node)
			{ domIdxs.push(n.idx); }
	}

	// list of non-movable vnode indices (already in correct order in old dom)
	var tombs = longestIncreasingSubsequence(domIdxs).map(function (i) { return domIdxs[i]; });

	for (var i = 0; i < tombs.length; i++)
		{ body[tombs[i]]._lis = true; }

	state.tombs = tombs;

	while (1) {
		var r = syncLft(node, parEl, body, state, null, true);
		if (r === BREAK_ALL) { break; }
	}
}

function alreadyAdopted(vnode) {
	return vnode.el._node.parent !== vnode.parent;
}

function takeSeqIndex(n, obody, fromIdx) {
	return obody[fromIdx];
}

function findSeqThorough(n, obody, fromIdx) {		// pre-tested isView?
	for (; fromIdx < obody.length; fromIdx++) {
		var o = obody[fromIdx];

		if (o.vm != null) {
			// match by key & viewFn || vm
			if (n.type === VVIEW && o.vm.view === n.view && o.vm.key === n.key || n.type === VMODEL && o.vm === n.vm)
				{ return o; }
		}
		else if (!alreadyAdopted(o) && n.tag === o.tag && n.type === o.type && n.key === o.key && (n.flags & ~DEEP_REMOVE) === (o.flags & ~DEEP_REMOVE))
			{ return o; }
	}

	return null;
}

function findHashKeyed(n, obody, fromIdx) {
	return obody[obody._keys[n.key]];
}

/*
// list must be a sorted list of vnodes by key
function findBinKeyed(n, list) {
	var idx = binaryKeySearch(list, n.key);
	return idx > -1 ? list[idx] : null;
}
*/

// have it handle initial hydrate? !donor?
// types (and tags if ELEM) are assumed the same, and donor exists
function patch(vnode, donor) {
	fireHook(donor.hooks, "willRecycle", donor, vnode);

	var el = vnode.el = donor.el;

	var obody = donor.body;
	var nbody = vnode.body;

	el._node = vnode;

	// "" => ""
	if (vnode.type === TEXT && nbody !== obody) {
		el.nodeValue = nbody;
		return;
	}

	if (vnode.attrs != null || donor.attrs != null)
		{ patchAttrs(vnode, donor, false); }

	// patch events

	var oldIsArr = isArr(obody);
	var newIsArr = isArr(nbody);
	var lazyList = (vnode.flags & LAZY_LIST) === LAZY_LIST;

//	var nonEqNewBody = nbody != null && nbody !== obody;

	if (oldIsArr) {
		// [] => []
		if (newIsArr || lazyList)
			{ patchChildren(vnode, donor); }
		// [] => "" | null
		else if (nbody !== obody) {
			if (nbody != null)
				{ el.textContent = nbody; }
			else
				{ clearChildren(donor); }
		}
	}
	else {
		// "" | null => []
		if (newIsArr) {
			clearChildren(donor);
			hydrateBody(vnode);
		}
		// "" | null => "" | null
		else if (nbody !== obody) {
			if (el.firstChild)
				{ el.firstChild.nodeValue = nbody; }
			else
				{ el.textContent = nbody; }
		}
	}

	fireHook(donor.hooks, "didRecycle", donor, vnode);
}

// larger qtys of KEYED_LIST children will use binary search
//const SEQ_FAILS_MAX = 100;

// TODO: modify vtree matcher to work similar to dom reconciler for keyed from left -> from right -> head/tail -> binary
// fall back to binary if after failing nri - nli > SEQ_FAILS_MAX
// while-advance non-keyed fromIdx
// [] => []
function patchChildren(vnode, donor) {
	var nbody		= vnode.body,
		nlen		= nbody.length,
		obody		= donor.body,
		olen		= obody.length,
		isLazy		= (vnode.flags & LAZY_LIST) === LAZY_LIST,
		isFixed		= (vnode.flags & FIXED_BODY) === FIXED_BODY,
		isKeyed		= (vnode.flags & KEYED_LIST) === KEYED_LIST,
		domSync		= !isFixed && vnode.type === ELEMENT,
		doFind		= true,
		find		= (
			isKeyed ? findHashKeyed :				// keyed lists/lazyLists
			isFixed || isLazy ? takeSeqIndex :		// unkeyed lazyLists and FIXED_BODY
			findSeqThorough							// more complex stuff
		);

	if (isKeyed) {
		var keys = {};
		for (var i = 0; i < obody.length; i++)
			{ keys[obody[i].key] = i; }
		obody._keys = keys;
	}

	if (domSync && nlen === 0) {
		clearChildren(donor);
		if (isLazy)
			{ vnode.body = []; }	// nbody.tpl(all);
		return;
	}

	var donor2,
		node2,
		foundIdx,
		patched = 0,
		everNonseq = false,
		fromIdx = 0;		// first unrecycled node (search head)

	if (isLazy) {
		var fnode2 = {key: null};
		var nbodyNew = Array(nlen);
	}

	for (var i = 0; i < nlen; i++) {
		if (isLazy) {
			var remake = false;
			var diffRes = null;

			if (doFind) {
				if (isKeyed)
					{ fnode2.key = nbody.key(i); }

				donor2 = find(fnode2, obody, fromIdx);
			}

			if (donor2 != null) {
                foundIdx = donor2.idx;
				diffRes = nbody.diff(i, donor2);

				// diff returns same, so cheaply adopt vnode without patching
				if (diffRes === true) {
					node2 = donor2;
					node2.parent = vnode;
					node2.idx = i;
					node2._lis = false;
				}
				// diff returns new diffVals, so generate new vnode & patch
				else
					{ remake = true; }
			}
			else
				{ remake = true; }

			if (remake) {
				node2 = nbody.tpl(i);			// what if this is a VVIEW, VMODEL, injected element?
				preProc(node2, vnode, i);

				node2._diff = diffRes != null ? diffRes : nbody.diff(i);

				if (donor2 != null)
					{ patch(node2, donor2); }
			}
			else {
				// TODO: flag tmp FIXED_BODY on unchanged nodes?

				// domSync = true;		if any idx changes or new nodes added/removed
			}

			nbodyNew[i] = node2;
		}
		else {
			var node2 = nbody[i];
			var type2 = node2.type;

			// ELEMENT,TEXT,COMMENT
			if (type2 <= COMMENT) {
				if (donor2 = doFind && find(node2, obody, fromIdx)) {
					patch(node2, donor2);
					foundIdx = donor2.idx;
				}
			}
			else if (type2 === VVIEW) {
				if (donor2 = doFind && find(node2, obody, fromIdx)) {		// update/moveTo
					foundIdx = donor2.idx;
					var vm = donor2.vm._update(node2.data, vnode, i);		// withDOM
				}
				else
					{ var vm = createView(node2.view, node2.data, node2.key, node2.opts)._redraw(vnode, i, false); }	// createView, no dom (will be handled by sync below)

				type2 = vm.node.type;
			}
			else if (type2 === VMODEL) {
				// if the injected vm has never been rendered, this vm._update() serves as the
				// initial vtree creator, but must avoid hydrating (creating .el) because syncChildren()
				// which is responsible for mounting below (and optionally hydrating), tests .el presence
				// to determine if hydration & mounting are needed
				var withDOM = isHydrated(node2.vm);

				var vm = node2.vm._update(node2.data, vnode, i, withDOM);
				type2 = vm.node.type;
			}
		}

		// found donor & during a sequential search ...at search head
		if (!isKeyed && donor2 != null) {
			if (foundIdx === fromIdx) {
				// advance head
				fromIdx++;
				// if all old vnodes adopted and more exist, stop searching
				if (fromIdx === olen && nlen > olen) {
					// short-circuit find, allow loop just create/init rest
					donor2 = null;
					doFind = false;
				}
			}
			else
				{ everNonseq = true; }

			if (olen > 100 && everNonseq && ++patched % 10 === 0)
				{ while (fromIdx < olen && alreadyAdopted(obody[fromIdx]))
					{ fromIdx++; } }
		}
	}

	// replace List w/ new body
	if (isLazy)
		{ vnode.body = nbodyNew; }

	domSync && syncChildren(vnode, donor);
}

// view + key serve as the vm's unique identity
function ViewModel(view, data, key, opts) {
	var vm = this;

	vm.view = view;
	vm.data = data;
	vm.key = key;

	if (opts) {
		vm.opts = opts;
		vm.config(opts);
	}

	var out = isPlainObj(view) ? view : view.call(vm, vm, data, key, opts);

	if (isFunc(out))
		{ vm.render = out; }
	else {
		vm.render = out.render;
		vm.config(out);
	}

	// these must be wrapped here since they're debounced per view
	vm._redrawAsync = raft(function (_) { return vm.redraw(true); });
	vm._updateAsync = raft(function (newData) { return vm.update(newData, true); });

	vm.init && vm.init.call(vm, vm, vm.data, vm.key, opts);
}

var ViewModelProto = ViewModel.prototype = {
	constructor: ViewModel,

	_diff:	null,	// diff cache

	init:	null,
	view:	null,
	key:	null,
	data:	null,
	state:	null,
	api:	null,
	opts:	null,
	node:	null,
	hooks:	null,
	onevent: noop,
	refs:	null,
	render:	null,

	mount: mount,
	unmount: unmount,
	config: function(opts) {
		var t = this;

		if (opts.init)
			{ t.init = opts.init; }
		if (opts.diff)
			{ t.diff = opts.diff; }
		if (opts.onevent)
			{ t.onevent = opts.onevent; }

		// maybe invert assignment order?
		if (opts.hooks)
			{ t.hooks = assignObj(t.hooks || {}, opts.hooks); }

		{
			if (opts.onemit)
				{ t.onemit = assignObj(t.onemit || {}, opts.onemit); }
		}
	},
	parent: function() {
		return getVm(this.node.parent);
	},
	root: function() {
		var p = this.node;

		while (p.parent)
			{ p = p.parent; }

		return p.vm;
	},
	redraw: function(sync) {
		var vm = this;
		sync ? vm._redraw(null, null, isHydrated(vm)) : vm._redrawAsync();
		return vm;
	},
	update: function(newData, sync) {
		var vm = this;
		sync ? vm._update(newData, null, null, isHydrated(vm)) : vm._updateAsync(newData);
		return vm;
	},

	_update: updateSync,
	_redraw: redrawSync,
	_redrawAsync: null,
	_updateAsync: null,
};

function mount(el, isRoot) {
	var vm = this;

	if (isRoot) {
		clearChildren({el: el, flags: 0});

		vm._redraw(null, null, false);

		// if placeholder node doesnt match root tag
		if (el.nodeName.toLowerCase() !== vm.node.tag) {
			hydrate(vm.node);
			insertBefore(el.parentNode, vm.node.el, el);
			el.parentNode.removeChild(el);
		}
		else
			{ insertBefore(el.parentNode, hydrate(vm.node, el), el); }
	}
	else {
		vm._redraw(null, null);

		if (el)
			{ insertBefore(el, vm.node.el); }
	}

	if (el)
		{ drainDidHooks(vm); }

	return vm;
}

// asSub means this was called from a sub-routine, so don't drain did* hook queue
function unmount(asSub) {
	var vm = this;

	var node = vm.node;
	var parEl = node.el.parentNode;

	// edge bug: this could also be willRemove promise-delayed; should .then() or something to make sure hooks fire in order
	removeChild(parEl, node.el);

	if (!asSub)
		{ drainDidHooks(vm); }
}

function reParent(vm, vold, newParent, newIdx) {
	if (newParent != null) {
		newParent.body[newIdx] = vold;
		vold.idx = newIdx;
		vold.parent = newParent;
		vold._lis = false;
	}
	return vm;
}

function redrawSync(newParent, newIdx, withDOM) {
	var isRedrawRoot = newParent == null;
	var vm = this;
	var isMounted = vm.node && vm.node.el && vm.node.el.parentNode;

	var vold = vm.node, oldDiff, newDiff;

	if (vm.diff != null) {
		oldDiff = vm._diff;
		vm._diff = newDiff = vm.diff(vm, vm.data);

		if (vold != null) {
			var cmpFn = isArr(oldDiff) ? cmpArr : cmpObj;
			var isSame = oldDiff === newDiff || cmpFn(oldDiff, newDiff);

			if (isSame)
				{ return reParent(vm, vold, newParent, newIdx); }
		}
	}

	isMounted && fireHook(vm.hooks, "willRedraw", vm, vm.data);

	var vnew = vm.render.call(vm, vm, vm.data, oldDiff, newDiff);

	if (vnew === vold)
		{ return reParent(vm, vold, newParent, newIdx); }

	// todo: test result of willRedraw hooks before clearing refs
	vm.refs = null;

	// always assign vm key to root vnode (this is a de-opt)
	if (vm.key != null && vnew.key !== vm.key)
		{ vnew.key = vm.key; }

	vm.node = vnew;

	if (newParent) {
		preProc(vnew, newParent, newIdx, vm);
		newParent.body[newIdx] = vnew;
	}
	else if (vold && vold.parent) {
		preProc(vnew, vold.parent, vold.idx, vm);
		vold.parent.body[vold.idx] = vnew;
	}
	else
		{ preProc(vnew, null, null, vm); }

	if (withDOM !== false) {
		if (vold) {
			// root node replacement
			if (vold.tag !== vnew.tag || vold.key !== vnew.key) {
				// hack to prevent the replacement from triggering mount/unmount
				vold.vm = vnew.vm = null;

				var parEl = vold.el.parentNode;
				var refEl = nextSib(vold.el);
				removeChild(parEl, vold.el);
				insertBefore(parEl, hydrate(vnew), refEl);

				// another hack that allows any higher-level syncChildren to set
				// reconciliation bounds using a live node
				vold.el = vnew.el;

				// restore
				vnew.vm = vm;
			}
			else
				{ patch(vnew, vold); }
		}
		else
			{ hydrate(vnew); }
	}

	isMounted && fireHook(vm.hooks, "didRedraw", vm, vm.data);

	if (isRedrawRoot && isMounted)
		{ drainDidHooks(vm); }

	return vm;
}

// this also doubles as moveTo
// TODO? @withRedraw (prevent redraw from firing)
function updateSync(newData, newParent, newIdx, withDOM) {
	var vm = this;

	if (newData != null) {
		if (vm.data !== newData) {
			fireHook(vm.hooks, "willUpdate", vm, newData);
			vm.data = newData;

			
		}
	}

	return vm._redraw(newParent, newIdx, withDOM);
}

function defineElement(tag, arg1, arg2, flags) {
	var attrs, body;

	if (arg2 == null) {
		if (isPlainObj(arg1))
			{ attrs = arg1; }
		else
			{ body = arg1; }
	}
	else {
		attrs = arg1;
		body = arg2;
	}

	return initElementNode(tag, attrs, body, flags);
}

//export const XML_NS = "http://www.w3.org/2000/xmlns/";
var SVG_NS = "http://www.w3.org/2000/svg";

function defineSvgElement(tag, arg1, arg2, flags) {
	var n = defineElement(tag, arg1, arg2, flags);
	n.ns = SVG_NS;
	return n;
}

function defineComment(body) {
	var node = new VNode;
	node.type = COMMENT;
	node.body = body;
	return node;
}

// placeholder for declared views
function VView(view, data, key, opts) {
	this.view = view;
	this.data = data;
	this.key = key;
	this.opts = opts;
}

VView.prototype = {
	constructor: VView,

	type: VVIEW,
	view: null,
	data: null,
	key: null,
	opts: null,
};

function defineView(view, data, key, opts) {
	return new VView(view, data, key, opts);
}

// placeholder for injected ViewModels
function VModel(vm) {
	this.vm = vm;
}

VModel.prototype = {
	constructor: VModel,

	type: VMODEL,
	vm: null,
};

function injectView(vm) {
//	if (vm.node == null)
//		vm._redraw(null, null, false);

//	return vm.node;

	return new VModel(vm);
}

function injectElement(el) {
	var node = new VNode;
	node.type = ELEMENT;
	node.el = node.key = el;
	return node;
}

function lazyList(items, cfg) {
	var len = items.length;

	var self = {
		items: items,
		length: len,
		// defaults to returning item identity (or position?)
		key: function(i) {
			return cfg.key(items[i], i);
		},
		// default returns 0?
		diff: function(i, donor) {
			var newVals = cfg.diff(items[i], i);
			if (donor == null)
				{ return newVals; }
			var oldVals = donor._diff;
			var same = newVals === oldVals || isArr(oldVals) ? cmpArr(newVals, oldVals) : cmpObj(newVals, oldVals);
			return same || newVals;
		},
		tpl: function(i) {
			return cfg.tpl(items[i], i);
		},
		map: function(tpl) {
			cfg.tpl = tpl;
			return self;
		},
		body: function(vnode) {
			var nbody = Array(len);

			for (var i = 0; i < len; i++) {
				var vnode2 = self.tpl(i);

			//	if ((vnode.flags & KEYED_LIST) === KEYED_LIST && self. != null)
			//		vnode2.key = getKey(item);

				vnode2._diff = self.diff(i);			// holds oldVals for cmp

				nbody[i] = vnode2;

				// run preproc pass (should this be just preProc in above loop?) bench
				preProc(vnode2, vnode, i);
			}

			// replace List with generated body
			vnode.body = nbody;
		}
	};

	return self;
}

var nano = {
	config: config,

	ViewModel: ViewModel,
	VNode: VNode,

	createView: createView,

	defineElement: defineElement,
	defineSvgElement: defineSvgElement,
	defineText: defineText,
	defineComment: defineComment,
	defineView: defineView,

	injectView: injectView,
	injectElement: injectElement,

	lazyList: lazyList,

	FIXED_BODY: FIXED_BODY,
	DEEP_REMOVE: DEEP_REMOVE,
	KEYED_LIST: KEYED_LIST,
	LAZY_LIST: LAZY_LIST,
};

function protoPatch(n, doRepaint) {
	patch$1(this, n, doRepaint);
}

// newNode can be either {class: style: } or full new VNode
// will/didPatch hooks?
function patch$1(o, n, doRepaint) {
	if (n.type != null) {
		// no full patching of view roots, just use redraw!
		if (o.vm != null)
			{ return; }

		preProc(n, o.parent, o.idx, null);
		o.parent.body[o.idx] = n;
		patch(n, o);
		doRepaint && repaint(n);
		drainDidHooks(getVm(n));
	}
	else {
		// TODO: re-establish refs

		// shallow-clone target
		var donor = Object.create(o);
		// fixate orig attrs
		donor.attrs = assignObj({}, o.attrs);
		// assign new attrs into live targ node
		var oattrs = assignObj(o.attrs, n);
		// prepend any fixed shorthand class
		if (o._class != null) {
			var aclass = oattrs.class;
			oattrs.class = aclass != null && aclass !== "" ? o._class + " " + aclass : o._class;
		}

		patchAttrs(o, donor);

		doRepaint && repaint(o);
	}
}

VNodeProto.patch = protoPatch;

function nextSubVms(n, accum) {
	var body = n.body;

	if (isArr(body)) {
		for (var i = 0; i < body.length; i++) {
			var n2 = body[i];

			if (n2.vm != null)
				{ accum.push(n2.vm); }
			else
				{ nextSubVms(n2, accum); }
		}
	}

	return accum;
}

function defineElementSpread(tag) {
	var args = arguments;
	var len = args.length;
	var body, attrs;

	if (len > 1) {
		var bodyIdx = 1;

		if (isPlainObj(args[1])) {
			attrs = args[1];
			bodyIdx = 2;
		}

		if (len === bodyIdx + 1 && (isVal(args[bodyIdx]) || isArr(args[bodyIdx]) || attrs && (attrs._flags & LAZY_LIST) === LAZY_LIST))
			{ body = args[bodyIdx]; }
		else
			{ body = sliceArgs(args, bodyIdx); }
	}

	return initElementNode(tag, attrs, body);
}

function defineSvgElementSpread() {
	var n = defineElementSpread.apply(null, arguments);
	n.ns = SVG_NS;
	return n;
}

ViewModelProto.emit = emit;
ViewModelProto.onemit = null;

ViewModelProto.body = function() {
	return nextSubVms(this.node, []);
};

nano.defineElementSpread = defineElementSpread;
nano.defineSvgElementSpread = defineSvgElementSpread;

return nano;

})));
//# sourceMappingURL=domvm.micro.js.map


/***/ }),
/* 34 */
/***/ (function(module, exports) {

if (Element && !Element.prototype.matches) {
    var proto = Element.prototype;
    proto.matches = proto.matchesSelector ||
        proto.mozMatchesSelector || proto.msMatchesSelector ||
        proto.oMatchesSelector || proto.webkitMatchesSelector;
}


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(4));
__export(__webpack_require__(18));
__export(__webpack_require__(40));
__export(__webpack_require__(41));
__export(__webpack_require__(7));
__export(__webpack_require__(5));
__export(__webpack_require__(22));
__export(__webpack_require__(21));
__export(__webpack_require__(43));
__export(__webpack_require__(20));
__export(__webpack_require__(19));


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(Promise) {
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(5);
var types_1 = __webpack_require__(4);
var Loader = /** @class */ (function () {
    function Loader(parent, changes) {
        this._parent = parent;
        this._changes = changes; // todo: [dirty] mutation
    }
    Loader.prototype.load = function (url, driver) {
        var _this = this;
        return this._parent.loadData = url.load().then(function (data) {
            _this._parent.removeAll();
            // const parcedData = this.parse(data, driver);
            return _this.parse(data, driver);
        }).catch(function (error) {
            _this._parent.events.fire(types_1.DataEvents.loadError, [error]);
        });
    };
    Loader.prototype.parse = function (data, driver) {
        if (driver === void 0) { driver = "json"; }
        if (driver === "json" && !helpers_1.hasJsonOrArrayStructure(data)) {
            this._parent.events.fire(types_1.DataEvents.loadError, ["Uncaught SyntaxError: Unexpected end of input"]);
        }
        driver = helpers_1.toDataDriver(driver);
        data = driver.toJsonArray(data);
        this._parent.$parse(data);
        return data;
    };
    Loader.prototype.save = function (url) {
        var _this = this;
        var _loop_1 = function (el) {
            if (el.saving || el.pending) {
                helpers_1.dhxWarning("item is saving");
            }
            else {
                var prevEl_1 = this_1._findPrevState(el.id);
                if (prevEl_1 && prevEl_1.saving) {
                    var pending = new Promise(function (res, rej) {
                        prevEl_1.promise.then(function () {
                            el.pending = false;
                            res(_this._setPromise(el, url));
                        }).catch(function (err) {
                            _this._removeFromOrder(prevEl_1);
                            _this._setPromise(el, url);
                            helpers_1.dhxWarning(err);
                            rej(err);
                        });
                    });
                    this_1._addToChain(pending);
                    el.pending = true;
                }
                else {
                    this_1._setPromise(el, url);
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var el = _a[_i];
            _loop_1(el);
        }
        this._parent.saveData.then(function () {
            _this._saving = false;
        });
    };
    Loader.prototype._setPromise = function (el, url) {
        var _this = this;
        el.promise = url.save(el.obj, el.status);
        el.promise.then(function () {
            _this._removeFromOrder(el);
        }).catch(function (err) {
            el.saving = false;
            el.error = true;
            helpers_1.dhxError(err);
        });
        el.saving = true;
        this._saving = true;
        this._addToChain(el.promise);
        return el.promise;
    };
    Loader.prototype._addToChain = function (promise) {
        // tslint:disable-next-line:prefer-conditional-expression
        if (this._parent.saveData && this._saving) {
            this._parent.saveData = this._parent.saveData.then(function () { return promise; });
        }
        else {
            this._parent.saveData = promise;
        }
    };
    Loader.prototype._findPrevState = function (id) {
        for (var _i = 0, _a = this._changes.order; _i < _a.length; _i++) {
            var el = _a[_i];
            if (el.id === id) {
                return el;
            }
        }
        return null;
    };
    Loader.prototype._removeFromOrder = function (el) {
        this._changes.order = this._changes.order.filter(function (item) { return !helpers_1.isEqualObj(item, el); });
    };
    return Loader;
}());
exports.Loader = Loader;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var xml_1 = __webpack_require__(38);
var ARRAY_NAME = "items";
var ITEM_NAME = "item";
// convert xml tag to js object, all subtags and attributes are mapped to the properties of result object
function tagToObject(tag, initialObj) {
    initialObj = initialObj || {};
    // map attributes
    var a = tag.attributes;
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            initialObj[a[i].name] = a[i].value;
        }
    }
    // map subtags
    var b = tag.childNodes;
    for (var i = 0; i < b.length; i++) {
        if (b[i].nodeType === 1) {
            var name_1 = b[i].tagName;
            if (initialObj[name_1]) {
                if (typeof initialObj[name_1].push !== "function") {
                    initialObj[name_1] = [initialObj[name_1]];
                }
                initialObj[name_1].push(tagToObject(b[i], {}));
            }
            else {
                initialObj[name_1] = tagToObject(b[i], {}); // sub-object for complex subtags
            }
        }
    }
    return initialObj;
}
var XMLDriver = /** @class */ (function () {
    function XMLDriver() {
    }
    XMLDriver.prototype.toJsonArray = function (data) {
        return this.getRows(data);
    };
    XMLDriver.prototype.toJsonObject = function (data) {
        var doc;
        if (typeof data === "string") {
            doc = this._fromString(data);
        }
        return tagToObject(doc);
    };
    XMLDriver.prototype.serialize = function (data) {
        return xml_1.jsonToXML(data);
    };
    XMLDriver.prototype.getFields = function (row) {
        return row;
    };
    XMLDriver.prototype.getRows = function (data) {
        if (typeof data === "string") {
            data = this._fromString(data);
        }
        if (data) {
            var childNodes = data.childNodes && data.childNodes[0] && data.childNodes[0].childNodes;
            if (!childNodes || !childNodes.length) {
                return null;
            }
            return this._getRows(childNodes);
        }
        return [];
    };
    XMLDriver.prototype._getRows = function (nodes) {
        var result = [];
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].tagName === ITEM_NAME) {
                result.push(this._nodeToJS(nodes[i]));
            }
        }
        return result;
    };
    XMLDriver.prototype._fromString = function (data) {
        try {
            return (new DOMParser()).parseFromString(data, "text/xml");
        }
        catch (_a) {
            return null;
        }
    };
    XMLDriver.prototype._nodeToJS = function (node) {
        var result = {};
        if (this._haveAttrs(node)) {
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                var _a = attrs[i], name_2 = _a.name, value = _a.value;
                result[name_2] = this._toType(value);
            }
        }
        if (node.nodeType === 3) {
            result.value = result.value || this._toType(node.textContent);
            return result;
        }
        var childNodes = node.childNodes;
        if (childNodes) {
            for (var i = 0; i < childNodes.length; i++) {
                var subNode = childNodes[i];
                var tag = subNode.tagName;
                if (!tag) {
                    continue;
                }
                if (tag === ARRAY_NAME && subNode.childNodes) {
                    result[tag] = this._getRows(subNode.childNodes);
                }
                else {
                    if (this._haveAttrs(subNode)) {
                        result[tag] = this._nodeToJS(subNode);
                    }
                    else {
                        result[tag] = this._toType(subNode.textContent);
                    }
                }
            }
        }
        return result;
    };
    XMLDriver.prototype._toType = function (val) {
        if (val === "false" || val === "true") {
            return val === "true";
        }
        if (!isNaN(val)) {
            return Number(val);
        }
        return val;
    };
    XMLDriver.prototype._haveAttrs = function (node) {
        return node.attributes && node.attributes.length;
    };
    return XMLDriver;
}());
exports.XMLDriver = XMLDriver;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var INDENT_STEP = 4;
function jsonToXML(data, root) {
    if (root === void 0) { root = "root"; }
    var result = "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<" + root + ">";
    for (var i = 0; i < data.length; i++) {
        result += "\n" + itemToXML(data[i]);
    }
    return result + ("\n</" + root + ">");
}
exports.jsonToXML = jsonToXML;
function ws(count) {
    return " ".repeat(count);
}
function itemToXML(item, indent) {
    if (indent === void 0) { indent = INDENT_STEP; }
    var result = ws(indent) + "<item>\n";
    for (var key in item) {
        if (Array.isArray(item[key])) {
            result += ws(indent + INDENT_STEP) + ("<" + key + ">\n");
            result += item[key].map(function (subItem) { return itemToXML(subItem, indent + INDENT_STEP * 2); }).join("\n") + "\n";
            result += ws(indent + INDENT_STEP) + ("</" + key + ">\n");
        }
        else {
            result += ws(indent + INDENT_STEP) + ("<" + key + ">" + item[key] + "</" + key + ">\n");
        }
    }
    result += ws(indent) + "</item>";
    return result;
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = __webpack_require__(5);
var Sort = /** @class */ (function () {
    function Sort() {
    }
    Sort.prototype.sort = function (array, by) {
        var _this = this;
        if (by.rule && typeof by.rule === "function") {
            this._sort(array, by);
        }
        else if (by.by) {
            by.rule = function (a, b) {
                var aa = _this._checkVal(by.as, a[by.by]);
                var bb = _this._checkVal(by.as, b[by.by]);
                return helpers_1.naturalCompare(aa.toString(), bb.toString());
            };
            this._sort(array, by);
        }
    };
    Sort.prototype._checkVal = function (method, val) {
        return method ? method.call(this, val) : val;
    };
    Sort.prototype._sort = function (arr, conf) {
        var _this = this;
        var dir = {
            asc: 1,
            desc: -1
        };
        return arr.sort(function (a, b) {
            return conf.rule.call(_this, a, b) * (dir[conf.dir] || dir.asc);
        });
    };
    return Sort;
}());
exports.Sort = Sort;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(3);
var datacollection_1 = __webpack_require__(18);
var dataproxy_1 = __webpack_require__(7);
var helpers_1 = __webpack_require__(5);
var types_1 = __webpack_require__(4);
function addToOrder(store, obj, parent, index) {
    if (index !== undefined && index !== -1 && store[parent] && store[parent][index]) {
        store[parent].splice(index, 0, obj);
    }
    else {
        if (!store[parent]) {
            store[parent] = [];
        }
        store[parent].push(obj);
    }
}
var TreeCollection = /** @class */ (function (_super) {
    __extends(TreeCollection, _super);
    function TreeCollection(config, events) {
        var _a;
        var _this = _super.call(this, config, events) || this;
        var root = _this._root = "_ROOT_" + core_1.uid();
        _this._childs = (_a = {}, _a[root] = [], _a);
        _this._initChilds = null;
        return _this;
    }
    TreeCollection.prototype.add = function (obj, index, parent) {
        var _this = this;
        if (index === void 0) { index = -1; }
        if (parent === void 0) { parent = this._root; }
        if (typeof obj !== "object") {
            obj = {
                value: obj
            };
        }
        if (Array.isArray(obj)) {
            return obj.map(function (element, key) {
                if (key > 0 && index !== -1) {
                    index = index + 1;
                }
                element.parent = element.parent ? element.parent.toString() : parent;
                var id = _super.prototype.add.call(_this, element, index);
                if (Array.isArray(element.items)) {
                    for (var _i = 0, _a = element.items; _i < _a.length; _i++) {
                        var item = _a[_i];
                        _this.add(item, -1, element.id);
                    }
                }
                return id;
            });
        }
        else {
            obj.parent = obj.parent ? obj.parent.toString() : parent;
            var id = _super.prototype.add.call(this, obj, index);
            if (Array.isArray(obj.items)) {
                for (var _i = 0, _a = obj.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    this.add(item, -1, obj.id);
                }
            }
            return id;
        }
    };
    TreeCollection.prototype.getRoot = function () {
        return this._root;
    };
    TreeCollection.prototype.getParent = function (id, asObj) {
        if (asObj === void 0) { asObj = false; }
        if (!this._pull[id]) {
            return null;
        }
        var parent = this._pull[id].parent;
        return asObj ? this._pull[parent] : parent;
    };
    TreeCollection.prototype.getItems = function (id) {
        if (this._childs && this._childs[id]) {
            return this._childs[id];
        }
        return [];
    };
    TreeCollection.prototype.getLength = function (id) {
        if (id === void 0) { id = this._root; }
        if (!this._childs[id]) {
            return null;
        }
        return this._childs[id].length;
    };
    TreeCollection.prototype.removeAll = function (id) {
        var _a;
        if (id) {
            var childs = this._childs[id].slice();
            for (var _i = 0, childs_1 = childs; _i < childs_1.length; _i++) {
                var child = childs_1[_i];
                this.remove(child.id);
            }
        }
        else {
            _super.prototype.removeAll.call(this);
            var root = this._root;
            this._initChilds = null;
            this._childs = (_a = {}, _a[root] = [], _a);
        }
    };
    TreeCollection.prototype.getIndex = function (id) {
        var parent = this.getParent(id);
        if (!parent || !this._childs[parent]) {
            return -1;
        }
        return core_1.findIndex(this._childs[parent], function (item) { return item.id === id; });
    };
    TreeCollection.prototype.sort = function (by) {
        var _this = this;
        if (!by) {
            this._childs = {};
            // [dirty]
            this._parse_data(Object.keys(this._pull).map(function (key) { return _this._pull[key]; }));
            if (this._filters) {
                for (var key in this._filters) {
                    var filter = this._filters[key];
                    this.filter(filter.rule, filter.config);
                }
            }
        }
        else {
            for (var key in this._childs) {
                this._sort.sort(this._childs[key], by);
            }
            if (this._initChilds && Object.keys(this._initChilds).length) {
                for (var key in this._initChilds) {
                    this._sort.sort(this._initChilds[key], by);
                }
            }
        }
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.map = function (cb, parent, direct) {
        if (parent === void 0) { parent = this._root; }
        if (direct === void 0) { direct = true; }
        var result = [];
        if (!this.haveItems(parent)) {
            return result;
        }
        for (var i = 0; i < this._childs[parent].length; i++) {
            result.push(cb.call(this, this._childs[parent][i], i));
            if (direct) {
                var childResult = this.map(cb, this._childs[parent][i].id, direct);
                result = result.concat(childResult);
            }
        }
        return result;
    };
    TreeCollection.prototype.filter = function (rule, config) {
        var _this = this;
        if (config === void 0) { config = {}; }
        if (!rule) {
            this.restoreOrder();
            return;
        }
        if (!this._initChilds) {
            this._initChilds = this._childs;
        }
        config.type = config.type || types_1.TreeFilterType.leafs;
        // [todo] we can store multiple filter rules, like in datacollection
        this._filters = {};
        this._filters._ = {
            rule: rule,
            config: config
        };
        var newChilds = {};
        this._recursiveFilter(rule, config, this._root, 0, newChilds);
        var parents = [];
        var _loop_1 = function (i) {
            var check = newChilds[i].map(function (element) {
                return !_this.haveItems(element.id) && _this.getParent(element.id) !== _this.getRoot();
            }).find(function (item) { return item ? item : null; });
            if (newChilds[i].length > 0 && newChilds[i] !== newChilds[this_1.getRoot()] && check) {
                var item = newChilds[this_1.getRoot()].find(function (element) {
                    if (element.id === i) {
                        return element;
                    }
                });
                if (item) {
                    parents.push(item);
                }
            }
        };
        var this_1 = this;
        for (var i in newChilds) {
            _loop_1(i);
        }
        newChilds[this.getRoot()] = parents;
        this._childs = newChilds;
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.restoreOrder = function () {
        if (this._initChilds) {
            this._childs = this._initChilds;
            this._initChilds = null;
        }
        this.events.fire(types_1.DataEvents.change);
    };
    TreeCollection.prototype.copy = function (id, index, target, targetId) {
        var _this = this;
        if (target === void 0) { target = this; }
        if (targetId === void 0) { targetId = this._root; }
        if (id instanceof Array) {
            return id.map(function (elementId, key) {
                if (!_this.exists(elementId)) {
                    return null;
                }
                var currentChilds = _this._childs[elementId];
                var elementIndex = index === -1 ? -1 : index + key;
                if (target === _this && !_this.canCopy(elementId, targetId)) {
                    return null;
                }
                var itemCopy = helpers_1.copyWithoutInner(_this.getItem(elementId), { items: true });
                if (target.exists(elementId)) {
                    itemCopy.id = core_1.uid();
                }
                if (!helpers_1.isTreeCollection(target)) {
                    target.add(itemCopy, elementIndex);
                    return;
                }
                if (_this.exists(elementId)) {
                    itemCopy.parent = targetId;
                    if (target !== _this && targetId === _this._root) {
                        itemCopy.parent = target.getRoot();
                    }
                    target.add(itemCopy, elementIndex);
                    elementId = itemCopy.id;
                }
                if (currentChilds) {
                    for (var _i = 0, currentChilds_2 = currentChilds; _i < currentChilds_2.length; _i++) {
                        var child = currentChilds_2[_i];
                        var childId = child.id;
                        var childIndex = _this.getIndex(childId);
                        if (typeof elementId === "string") {
                            _this.copy(childId, childIndex, target, elementId);
                        }
                    }
                }
                return elementId;
            });
        }
        else {
            if (!this.exists(id)) {
                return null;
            }
            var currentChilds = this._childs[id];
            if (target === this && !this.canCopy(id, targetId)) {
                return null;
            }
            var itemCopy = helpers_1.copyWithoutInner(this.getItem(id), { items: true });
            if (target.exists(id)) {
                itemCopy.id = core_1.uid();
            }
            if (!helpers_1.isTreeCollection(target)) {
                target.add(itemCopy, index);
                return;
            }
            if (this.exists(id)) {
                itemCopy.parent = targetId;
                if (target !== this && targetId === this._root) {
                    itemCopy.parent = target.getRoot();
                }
                target.add(itemCopy, index);
                id = itemCopy.id;
            }
            if (currentChilds) {
                for (var _i = 0, currentChilds_1 = currentChilds; _i < currentChilds_1.length; _i++) {
                    var child = currentChilds_1[_i];
                    var childId = child.id;
                    var childIndex = this.getIndex(childId);
                    if (typeof id === "string") {
                        this.copy(childId, childIndex, target, id);
                    }
                }
            }
            return id;
        }
    };
    TreeCollection.prototype.move = function (id, index, target, targetId) {
        var _this = this;
        if (target === void 0) { target = this; }
        if (targetId === void 0) { targetId = this._root; }
        if (id instanceof Array) {
            return id.map(function (elementId, key) {
                if (!_this.exists(elementId)) {
                    return null;
                }
                var elementIndex = index === -1 ? -1 : index + key;
                if (target !== _this) {
                    if (!helpers_1.isTreeCollection(target)) {
                        target.add(helpers_1.copyWithoutInner(_this.getItem(elementId)), elementIndex);
                        _this.remove(elementId);
                        return;
                    }
                    var returnId = _this.copy(elementId, elementIndex, target, targetId);
                    _this.remove(elementId);
                    return returnId;
                }
                if (!_this.canCopy(elementId, targetId)) {
                    return null;
                }
                var parent = _this.getParent(elementId);
                var parentIndex = _this.getIndex(elementId);
                var spliced = _this._childs[parent].splice(parentIndex, 1)[0];
                spliced.parent = targetId;
                if (!_this._childs[parent].length) {
                    delete _this._childs[parent];
                }
                if (!_this.haveItems(targetId)) {
                    _this._childs[targetId] = [];
                }
                if (elementIndex === -1) {
                    elementIndex = _this._childs[targetId].push(spliced);
                }
                else {
                    _this._childs[targetId].splice(elementIndex, 0, spliced);
                }
                _this.events.fire(types_1.DataEvents.change);
                return elementId;
            });
        }
        else {
            if (!this.exists(id)) {
                return null;
            }
            if (target !== this) {
                if (!helpers_1.isTreeCollection(target)) { // move to datacollection
                    target.add(helpers_1.copyWithoutInner(this.getItem(id)), index);
                    this.remove(id);
                    return;
                }
                var returnId = this.copy(id, index, target, targetId);
                this.remove(id);
                return returnId;
            }
            // move inside
            if (!this.canCopy(id, targetId)) {
                return null;
            }
            var parent_1 = this.getParent(id);
            var parentIndex = this.getIndex(id);
            // get item from parent array and move to target array
            var spliced = this._childs[parent_1].splice(parentIndex, 1)[0];
            spliced.parent = targetId; // need for next moving, ... not best solution, may be full method for get item
            if (!this._childs[parent_1].length) {
                delete this._childs[parent_1];
            }
            if (!this.haveItems(targetId)) {
                this._childs[targetId] = [];
            }
            if (index === -1) {
                index = this._childs[targetId].push(spliced);
            }
            else {
                this._childs[targetId].splice(index, 0, spliced);
            }
            this.events.fire(types_1.DataEvents.change);
            return id;
        }
    };
    TreeCollection.prototype.eachChild = function (id, cb, direct, checkItem) {
        if (direct === void 0) { direct = true; }
        if (checkItem === void 0) { checkItem = function () { return true; }; }
        if (!this.haveItems(id)) {
            return;
        }
        for (var i = 0; i < this._childs[id].length; i++) {
            cb.call(this, this._childs[id][i], i);
            if (direct && checkItem(this._childs[id][i])) {
                this.eachChild(this._childs[id][i].id, cb, direct, checkItem);
            }
        }
    };
    TreeCollection.prototype.getNearId = function (id) {
        return id; // for selection
    };
    TreeCollection.prototype.loadItems = function (id, driver) {
        var _this = this;
        if (driver === void 0) { driver = "json"; }
        var url = this.config.autoload + "?id=" + id;
        var proxy = new dataproxy_1.DataProxy(url);
        proxy.load().then(function (data) {
            driver = helpers_1.toDataDriver(driver);
            data = driver.toJsonArray(data);
            _this._parse_data(data, id);
            _this.events.fire(types_1.DataEvents.change);
        });
    };
    TreeCollection.prototype.refreshItems = function (id, driver) {
        if (driver === void 0) { driver = "json"; }
        this.removeAll(id);
        this.loadItems(id, driver);
    };
    TreeCollection.prototype.eachParent = function (id, cb, self) {
        if (self === void 0) { self = false; }
        var item = this.getItem(id);
        if (!item) {
            return;
        }
        if (self) {
            cb.call(this, item);
        }
        if (item.parent === this._root) {
            return;
        }
        var parent = this.getItem(item.parent);
        cb.call(this, parent);
        this.eachParent(item.parent, cb);
    };
    TreeCollection.prototype.haveItems = function (id) {
        return id in this._childs;
    };
    TreeCollection.prototype.canCopy = function (id, target) {
        if (id === target) {
            return false;
        }
        var canCopy = true;
        this.eachParent(target, function (item) { return item.id === id ? canCopy = false : null; }); // locate return string
        return canCopy;
    };
    TreeCollection.prototype.serialize = function (driver, checkItem) {
        if (driver === void 0) { driver = types_1.DataDriver.json; }
        var data = this._serialize(this._root, checkItem);
        var dataDriver = helpers_1.toDataDriver(driver);
        if (dataDriver) {
            return dataDriver.serialize(data);
        }
    };
    TreeCollection.prototype.getId = function (index, parent) {
        if (parent === void 0) { parent = this._root; }
        if (!this._childs[parent] || !this._childs[parent][index]) {
            return;
        }
        return this._childs[parent][index].id;
    };
    TreeCollection.prototype._removeAll = function (id) {
        var _a;
        if (id) {
            var childs = this._childs[id].slice();
            for (var _i = 0, childs_2 = childs; _i < childs_2.length; _i++) {
                var child = childs_2[_i];
                this.remove(child.id);
            }
        }
        else {
            _super.prototype._removeAll.call(this);
            var root = this._root;
            this._initChilds = null;
            this._childs = (_a = {}, _a[root] = [], _a);
        }
    };
    TreeCollection.prototype._removeCore = function (id) {
        if (this._pull[id]) {
            var parent_2 = this.getParent(id);
            this._childs[parent_2] = this._childs[parent_2].filter(function (item) { return item.id !== id; });
            if (parent_2 !== this._root && !this._childs[parent_2].length) {
                delete this._childs[parent_2];
            }
            if (this._initChilds && this._initChilds[parent_2]) {
                this._initChilds[parent_2] = this._initChilds[parent_2].filter(function (item) { return item.id !== id; });
                if (parent_2 !== this._root && !this._initChilds[parent_2].length) {
                    delete this._initChilds[parent_2];
                }
            }
            this._fastDeleteChilds(this._childs, id);
            if (this._initChilds) {
                this._fastDeleteChilds(this._initChilds, id);
            }
        }
    };
    TreeCollection.prototype._addToOrder = function (_order, obj, index) {
        var childs = this._childs;
        var initChilds = this._initChilds;
        var parent = obj.parent;
        this._pull[obj.id] = obj;
        addToOrder(childs, obj, parent, index);
        if (initChilds) {
            addToOrder(initChilds, obj, parent, index);
        }
    };
    TreeCollection.prototype._parse_data = function (data, parent) {
        if (parent === void 0) { parent = this._root; }
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var obj = data_1[_i];
            if (this.config.init) {
                obj = this.config.init(obj);
            }
            if (typeof obj !== "object") {
                obj = {
                    value: obj
                };
            }
            obj.id = obj.id ? obj.id.toString() : core_1.uid();
            obj.parent = obj.parent ? obj.parent.toString() : parent;
            this._pull[obj.id] = obj;
            if (!this._childs[obj.parent]) {
                this._childs[obj.parent] = [];
            }
            this._childs[obj.parent].push(obj);
            if (obj.items && obj.items instanceof Object) {
                this._parse_data(obj.items, obj.id);
            }
        }
    };
    TreeCollection.prototype._fastDeleteChilds = function (target, id) {
        if (this._pull[id]) {
            delete this._pull[id];
        }
        if (!target[id]) {
            return;
        }
        for (var i = 0; i < target[id].length; i++) {
            this._fastDeleteChilds(target, target[id][i].id);
        }
        delete target[id];
    };
    TreeCollection.prototype._recursiveFilter = function (rule, config, current, level, newChilds) {
        var _this = this;
        var childs = this._childs[current];
        if (!childs) {
            return;
        }
        var condition = function (item) {
            switch (config.type) {
                case types_1.TreeFilterType.all: {
                    return true;
                }
                case types_1.TreeFilterType.level: {
                    return level === config.level;
                }
                case types_1.TreeFilterType.leafs: {
                    return !_this.haveItems(item.id);
                }
            }
        };
        if (typeof rule === "function") {
            var customRule = function (item) { return !condition(item) || rule(item); };
            var filtered = childs.filter(customRule);
            if (filtered.length) {
                newChilds[current] = filtered;
            }
        }
        else if (rule.by && rule.match) {
            var customRule = function (item) { return !condition(item) || item[rule.by].toString().toLowerCase().indexOf(rule.match.toString().toLowerCase()) !== -1; };
            newChilds[current] = childs.filter(customRule);
        }
        for (var _i = 0, childs_3 = childs; _i < childs_3.length; _i++) {
            var child = childs_3[_i];
            this._recursiveFilter(rule, config, child.id, level + 1, newChilds);
        }
    };
    TreeCollection.prototype._serialize = function (parent, fn) {
        var _this = this;
        if (parent === void 0) { parent = this._root; }
        return this.map(function (item) {
            var itemCopy = {};
            for (var key in item) {
                if (key === "parent" || key === "items") {
                    continue;
                }
                itemCopy[key] = item[key];
            }
            if (fn) {
                itemCopy = fn(itemCopy);
            }
            if (_this.haveItems(item.id)) {
                itemCopy.items = _this._serialize(item.id, fn);
            }
            return itemCopy;
        }, parent, false);
    };
    return TreeCollection;
}(datacollection_1.DataCollection));
exports.TreeCollection = TreeCollection;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var html_1 = __webpack_require__(11);
var CollectionStore_1 = __webpack_require__(42);
var types_1 = __webpack_require__(4);
var helpers_1 = __webpack_require__(5);
function getPosition(e) {
    var y = e.clientY;
    var element = html_1.locateNode(e);
    if (!element) {
        return null;
    }
    var treeLine = element.childNodes[0];
    var _a = treeLine.getBoundingClientRect(), top = _a.top, height = _a.height;
    return (y - top) / height;
}
function dragEventContent(element, elements) {
    var rect = element.getBoundingClientRect();
    var ghost = document.createElement("div");
    var clone = element.cloneNode(true);
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.maxHeight = rect.height + "px";
    clone.style.fontSize = window.getComputedStyle(element.parentElement).fontSize;
    clone.style.opacity = "0.8";
    clone.style.fontSize = window.getComputedStyle(element.parentElement).fontSize;
    ghost.appendChild(clone);
    if (elements && elements.length) {
        elements.forEach(function (node, key) {
            var nodeClone = node.cloneNode(true);
            nodeClone.style.width = rect.width + "px";
            nodeClone.style.height = rect.height + "px";
            nodeClone.style.maxHeight = rect.height + "px";
            nodeClone.style.top = ((key + 1) * 12 - rect.height) - (rect.height * key) + "px";
            nodeClone.style.left = (key + 1) * 12 + "px";
            nodeClone.style.opacity = "0.6";
            nodeClone.style.zIndex = "" + (-key - 1);
            ghost.appendChild(nodeClone);
        });
    }
    ghost.className = "dhx_drag-ghost";
    return ghost;
}
var DragManager = /** @class */ (function () {
    function DragManager() {
        var _this = this;
        this._transferData = {};
        this._canMove = true;
        this._selectedIds = [];
        this._onMouseMove = function (e) {
            if (!_this._transferData.id) {
                return;
            }
            var pageX = e.pageX, pageY = e.pageY;
            if (!_this._transferData.ghost) {
                if (Math.abs(_this._transferData.x - pageX) < 3 && Math.abs(_this._transferData.y - pageY) < 3) {
                    return;
                }
                else {
                    var ghost = _this._onDragStart(_this._transferData.id, _this._transferData.targetId);
                    if (!ghost) {
                        _this._endDrop();
                        return;
                    }
                    else {
                        _this._transferData.ghost = ghost;
                        document.body.appendChild(_this._transferData.ghost);
                    }
                }
            }
            _this._moveGhost(pageX, pageY);
            _this._onDrag(e);
        };
        this._onMouseUp = function () {
            if (!_this._transferData.x) {
                return;
            }
            if (_this._transferData.ghost) {
                _this._removeGhost();
                _this._onDrop();
            }
            else {
                _this._endDrop();
            }
            document.removeEventListener("mousemove", _this._onMouseMove);
            document.removeEventListener("mouseup", _this._onMouseUp);
        };
    }
    DragManager.prototype.setItem = function (id, item) {
        CollectionStore_1.collectionStore.setItem(id, item);
    };
    DragManager.prototype.onMouseDown = function (e, selectedIds, itemsForGhost) {
        if (e.which !== 1) {
            return;
        }
        e.preventDefault();
        document.addEventListener("mousemove", this._onMouseMove);
        document.addEventListener("mouseup", this._onMouseUp);
        var item = html_1.locateNode(e, "dhx_id");
        var id = item && item.getAttribute("dhx_id");
        var targetId = html_1.locate(e, "dhx_widget_id");
        if (selectedIds && selectedIds.indexOf(id) !== -1 && selectedIds.length > 1) {
            this._selectedIds = selectedIds;
            this._itemsForGhost = itemsForGhost;
        }
        else {
            this._selectedIds = [];
            this._itemsForGhost = null;
        }
        if (id && targetId) {
            var _a = html_1.getBox(item), left = _a.left, top_1 = _a.top;
            this._transferData.initXOffset = e.pageX - left;
            this._transferData.initYOffset = e.pageY - top_1;
            this._transferData.x = e.pageX;
            this._transferData.y = e.pageY;
            this._transferData.targetId = targetId;
            this._transferData.id = id;
            this._transferData.item = item;
        }
    };
    DragManager.prototype._moveGhost = function (x, y) {
        if (this._transferData.ghost) {
            this._transferData.ghost.style.left = x - this._transferData.initXOffset + "px";
            this._transferData.ghost.style.top = y - this._transferData.initYOffset + "px";
        }
    };
    DragManager.prototype._removeGhost = function () {
        document.body.removeChild(this._transferData.ghost);
    };
    DragManager.prototype._onDrop = function () {
        if (!this._canMove) {
            this._endDrop();
            return;
        }
        var target = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        var config = target && target.config;
        if (!target || config.dragMode === types_1.DragMode.source) {
            this._endDrop();
            return;
        }
        if (target.events.fire(types_1.DragEvents.beforeDrop, [this._lastId, this._transferData.target])) {
            var to = {
                id: this._lastId,
                target: target
            };
            var from = {
                id: this._transferData.id,
                target: this._transferData.target
            };
            this._move(from, to);
            to.target.events.fire(types_1.DragEvents.dropComplete, [to.id, this._transferData.dropPosition]);
        }
        this._endDrop();
    };
    DragManager.prototype._onDragStart = function (id, targetId) {
        var target = CollectionStore_1.collectionStore.getItem(targetId);
        var config = target.config;
        if (config.dragMode === types_1.DragMode.target) {
            return null;
        }
        var item = target.data.getItem(id);
        var ghost = dragEventContent(this._transferData.item, this._itemsForGhost);
        var ans = target.events.fire(types_1.DragEvents.beforeDrag, [item, ghost]);
        if (!ans || !id) {
            return null;
        }
        target.events.fire(types_1.DragEvents.dragStart, [id, this._selectedIds]);
        this._toggleTextSelection(true);
        this._transferData.target = target;
        this._transferData.dragConfig = config;
        return ghost;
    };
    DragManager.prototype._onDrag = function (e) {
        var clientX = e.clientX, clientY = e.clientY;
        var element = document.elementFromPoint(clientX, clientY);
        var collectionId = html_1.locate(element, "dhx_widget_id");
        if (!collectionId) {
            if (this._canMove) {
                this._cancelCanDrop();
            }
            return;
        }
        var target = CollectionStore_1.collectionStore.getItem(collectionId);
        var id = html_1.locate(element, "dhx_id");
        if (!id) {
            this._cancelCanDrop();
            this._lastCollectionId = collectionId;
            this._lastId = null;
            this._canDrop();
            return;
        }
        if (target.config.dropBehaviour === types_1.DropBehaviour.complex) {
            var pos = getPosition(e);
            if (pos <= 0.25) {
                this._transferData.dropPosition = types_1.DropPosition.top;
            }
            else if (pos >= 0.75) {
                this._transferData.dropPosition = types_1.DropPosition.bot;
            }
            else {
                this._transferData.dropPosition = types_1.DropPosition.in;
            }
        }
        else if (this._lastId === id && this._lastCollectionId === collectionId) {
            return;
        }
        var from = {
            id: this._transferData.id,
            target: this._transferData.target
        };
        if (target.config.dragMode === "source") {
            return;
        }
        from.target.events.fire(types_1.DragEvents.dragOut, [id, target]);
        if (collectionId !== this._transferData.targetId || !helpers_1.isTreeCollection(from.target.data) ||
            (helpers_1.isTreeCollection(from.target.data) && from.target.data.canCopy(from.id, id))) {
            this._cancelCanDrop(); // clear last
            this._lastId = id;
            this._lastCollectionId = collectionId;
            var canMove = from.target.events.fire(types_1.DragEvents.dragIn, [id, this._transferData.dropPosition, CollectionStore_1.collectionStore.getItem(collectionId)]);
            if (canMove) {
                this._canDrop();
            }
        }
        else {
            this._cancelCanDrop();
        }
    };
    DragManager.prototype._move = function (from, to) {
        var fromData = from.target.data;
        var toData = to.target.data;
        var index = 0;
        var targetId = to.id;
        var behaviour = helpers_1.isTreeCollection(toData) ? to.target.config.dropBehaviour : undefined;
        switch (behaviour) {
            case types_1.DropBehaviour.child:
                break;
            case types_1.DropBehaviour.sibling:
                targetId = toData.getParent(targetId);
                index = toData.getIndex(to.id) + 1;
                break;
            case types_1.DropBehaviour.complex:
                var dropPosition = this._transferData.dropPosition;
                if (dropPosition === types_1.DropPosition.top) {
                    targetId = toData.getParent(targetId);
                    index = toData.getIndex(to.id);
                }
                else if (dropPosition === types_1.DropPosition.bot) {
                    targetId = toData.getParent(targetId);
                    index = toData.getIndex(to.id) + 1;
                }
                break;
            default:
                // list move
                if (!to.id) {
                    index = -1;
                }
                else if (from.target === to.target && toData.getIndex(from.id) < toData.getIndex(to.id)) {
                    index = toData.getIndex(to.id) - 1;
                }
                else {
                    index = toData.getIndex(to.id);
                }
        }
        if (this._transferData.dragConfig.dragCopy) {
            if (this._selectedIds instanceof Array && this._selectedIds.length > 1) {
                this._selectedIds.map(function (selctedId) {
                    fromData.copy(selctedId, index, toData, targetId);
                    if (index > -1) {
                        index++;
                    }
                });
            }
            else {
                fromData.copy(from.id, index, toData, targetId);
            }
        }
        else {
            if (this._selectedIds instanceof Array && this._selectedIds.length > 1) {
                this._selectedIds.map(function (selctedId) {
                    fromData.move(selctedId, index, toData, targetId);
                    if (index > -1) {
                        index++;
                    }
                });
            }
            else {
                fromData.move(from.id, index, toData, targetId); // typescript bug??
            }
        }
    };
    DragManager.prototype._endDrop = function () {
        this._toggleTextSelection(false);
        if (this._transferData.target) {
            this._transferData.target.events.fire(types_1.DragEvents.dragEnd, [this._transferData.id, this._selectedIds]);
        }
        this._cancelCanDrop();
        this._canMove = true;
        this._transferData = {};
        this._lastId = null;
        this._lastCollectionId = null;
    };
    DragManager.prototype._cancelCanDrop = function () {
        this._canMove = false;
        var collection = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        if (collection && this._lastId) {
            collection.events.fire(types_1.DragEvents.cancelDrop, [this._lastId]);
        }
        this._lastCollectionId = null;
        this._lastId = null;
    };
    DragManager.prototype._canDrop = function () {
        this._canMove = true;
        var target = CollectionStore_1.collectionStore.getItem(this._lastCollectionId);
        if (target && this._lastId) {
            target.events.fire(types_1.DragEvents.canDrop, [this._lastId, this._transferData.dropPosition]);
        }
    };
    DragManager.prototype._toggleTextSelection = function (add) {
        if (add) {
            document.body.classList.add("dhx_no-select");
        }
        else {
            document.body.classList.remove("dhx_no-select");
        }
    };
    return DragManager;
}());
var dhx = window.dhxHelpers = window.dhxHelpers || {};
dhx.dragManager = dhx.dragManager || new DragManager();
exports.dragManager = dhx.dragManager;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CollectionStore = /** @class */ (function () {
    function CollectionStore() {
        this._store = {};
    }
    CollectionStore.prototype.setItem = function (id, target) {
        this._store[id] = target;
    };
    CollectionStore.prototype.getItem = function (id) {
        if (!this._store[id]) {
            return null;
        }
        return this._store[id];
    };
    return CollectionStore;
}());
var dhx = window.dhxHelpers = window.dhxHelpers || {};
dhx.collectionStore = dhx.collectionStore || new CollectionStore();
exports.collectionStore = dhx.collectionStore;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = __webpack_require__(10);
var types_1 = __webpack_require__(44);
var types_2 = __webpack_require__(4);
var Selection = /** @class */ (function () {
    function Selection(_config, data, events) {
        var _this = this;
        this.events = events || (new events_1.EventSystem(this));
        this._data = data;
        this._data.events.on(types_2.DataEvents.removeAll, function () {
            _this._selected = null;
        });
        this._data.events.on(types_2.DataEvents.change, function () {
            if (_this._selected) {
                var near = _this._data.getNearId(_this._selected);
                if (near !== _this._selected) {
                    _this._selected = null;
                    if (near) {
                        _this.add(near);
                    }
                }
            }
        });
    }
    Selection.prototype.getId = function () {
        return this._selected;
    };
    Selection.prototype.getItem = function () {
        if (this._selected) {
            return this._data.getItem(this._selected);
        }
        return null;
    };
    Selection.prototype.remove = function (id) {
        id = id || this._selected;
        if (!id) {
            return true;
        }
        if (this.events.fire(types_1.SelectionEvents.beforeUnSelect, [id])) {
            this._data.update(id, { $selected: false });
            this._selected = null;
            this.events.fire(types_1.SelectionEvents.afterUnSelect, [id]);
            return true;
        }
        return false;
    };
    Selection.prototype.add = function (id) {
        if (this._selected === id) {
            return;
        }
        this.remove();
        if (this.events.fire(types_1.SelectionEvents.beforeSelect, [id])) {
            this._selected = id;
            this._data.update(id, { $selected: true });
            this.events.fire(types_1.SelectionEvents.afterSelect, [id]);
        }
    };
    return Selection;
}());
exports.Selection = Selection;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SelectionEvents;
(function (SelectionEvents) {
    SelectionEvents["beforeUnSelect"] = "beforeunselect";
    SelectionEvents["afterUnSelect"] = "afterunselect";
    SelectionEvents["beforeSelect"] = "beforeselect";
    SelectionEvents["afterSelect"] = "afterselect";
})(SelectionEvents = exports.SelectionEvents || (exports.SelectionEvents = {}));


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var Filters_1 = __webpack_require__(46);
var ComposeLayer = /** @class */ (function () {
    function ComposeLayer() {
        this._data = [];
        this._sizes = { left: 20, right: 20, top: 10, bottom: 10 };
    }
    ComposeLayer.prototype.add = function (obj) {
        this._data.push(obj);
    };
    ComposeLayer.prototype.clear = function () {
        this._data.forEach(function (item) { return item.destructor && item.destructor(); });
        this._data = [];
    };
    ComposeLayer.prototype.getSizes = function () {
        return this._sizes;
    };
    ComposeLayer.prototype.toVDOM = function (width, height) {
        var sizes = { left: 20, right: 20, top: 10, bottom: 10 };
        var toPaint = this._data.filter(function (l) { return !l.dataReady || l.dataReady().length; });
        this._data.forEach(function (l) { return !l.scaleReady || l.scaleReady(sizes); });
        var shift = 0;
        var shiftCount = 0;
        toPaint.forEach(function (item) {
            if (item.seriesShift) {
                shift += item.seriesShift();
                shiftCount++;
            }
        });
        var step = shift / shiftCount;
        shift = shiftCount ? (step - shift) / 2 : 0;
        toPaint.forEach(function (item) {
            if (item.seriesShift) {
                item.seriesShift(shift);
                shift += step;
            }
        });
        this._sizes = sizes;
        var chartsContent = dom_1.sv("g", {
            transform: "translate(" + sizes.left + ", " + sizes.top + ")"
        }, [
            dom_1.sv("rect.dhx_chart-graph_area", { width: width - sizes.left - sizes.right, height: height - sizes.top - sizes.bottom, fill: "transparent" }),
            toPaint.map(function (item) {
                return item.paint(width - (sizes.left + sizes.right), height - (sizes.top + sizes.bottom));
            })
        ]);
        var defs = dom_1.sv("defs", [Filters_1.dropShadow(), Filters_1.shadow()]);
        return dom_1.sv("svg", {
            width: width,
            height: height
        }, [defs, chartsContent]);
    };
    return ComposeLayer;
}());
exports.ComposeLayer = ComposeLayer;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
exports.shadow = function () { return dom_1.sv("filter", { id: "shadow" }, [
    dom_1.sv("feDiffuseLighting", {
        "in": "SourceGraphic",
        "result": "light",
        "lighting-color": "white"
    }, [
        dom_1.sv("feDistantLight", { azimuth: 90, elevation: 25 })
    ]),
    dom_1.sv("feComposite", {
        in: "SourceGraphic",
        in2: "light",
        operator: "arithmetic",
        k1: "1",
        k2: "0",
        k3: "0",
        k4: "0"
    })
]); };
exports.dropShadow = function () { return dom_1.sv("filter", {
    id: "dropshadow",
    x: "-100%",
    y: "-100%",
    width: "300%",
    height: "300%"
}, [
    dom_1.sv("feGaussianBlur", { in: "SourceAlpha", stdDeviation: 2 }),
    dom_1.sv("feOffset", { dx: 0, dy: 0, result: "offsetblur" }),
    dom_1.sv("feOffset", { dx: 0, dy: 0, result: "offsetblur" }),
    dom_1.sv("feFlood", { "flood-color": "rgba(85,85,85,0.5)" }),
    dom_1.sv("feComposite", { in2: "offsetblur", operator: "in" }),
    dom_1.sv("feMerge", [dom_1.sv("feMergeNode"), dom_1.sv("feMergeNode", { in: "SourceGraphic" })])
]); };


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(2);
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
var legend_1 = __webpack_require__(48);
function getDefaultMargin(halign, valign) {
    switch (valign) {
        case types_1.VerticalPosition.middle: {
            switch (halign) {
                case types_1.HorizontalPosition.right:
                    return 60;
                case types_1.HorizontalPosition.left:
                    return 120;
                case types_1.HorizontalPosition.center:
                    throw new Error("cant place legend on center, middle");
            }
        }
        case types_1.VerticalPosition.top:
            return 20;
        case types_1.VerticalPosition.bottom:
            return 60;
    }
}
var Legend = /** @class */ (function () {
    function Legend(_data, config, _events) {
        var _this = this;
        this._data = _data;
        this._events = _events;
        var defaults = {
            form: types_1.Shape.rect,
            itemPadding: 20,
            halign: types_1.HorizontalPosition.right,
            valign: types_1.VerticalPosition.middle
        };
        this.config = __assign({}, defaults, config);
        this.config.margin = config.margin || getDefaultMargin(this.config.halign, this.config.valign);
        this._handlers = {
            onclick: function (id, pieLike) { return _this._events.fire(types_1.ChartEvents.toggleSeries, [id, pieLike]); }
        };
    }
    Legend.prototype.scaleReady = function (sizes) {
        if (this.config.valign === types_1.VerticalPosition.middle) {
            if (this.config.halign === types_1.HorizontalPosition.right) {
                sizes.right += this.config.size || 200;
            }
            else if (this.config.halign === types_1.HorizontalPosition.left) {
                sizes.left += this.config.size || 200;
            }
        }
        else {
            if (this.config.valign === types_1.VerticalPosition.top) {
                sizes.top += this.config.size || 40;
            }
            else if (this.config.valign === types_1.VerticalPosition.bottom) {
                sizes.bottom += this.config.size || 40;
            }
        }
    };
    Legend.prototype.paint = function (width, height) {
        var _this = this;
        var data = this._getData();
        var config = this.config;
        var positionX;
        var positionY;
        var font = common_1.getFontStyle("legend-text");
        var figureWidth = 10; // get Figure width from config ??
        var margin = config.margin, itemPadding = config.itemPadding;
        var svg = [];
        var isMid = config.valign === types_1.VerticalPosition.middle;
        var xPadding = 0;
        var yPadding = 0;
        data.forEach(function (item) {
            svg.push(dom_1.sv("g", {
                transform: "translate(" + xPadding + "," + yPadding + ")",
                onclick: [_this._handlers.onclick, item.id, _this.config.values],
                class: "legend-item " + (!item.active ? "not-active" : "")
            }, [
                dom_1.sv("text", {
                    x: figureWidth / 2 + 5,
                    y: 0,
                    class: "start-text legend-text"
                }, [common_1.verticalCenteredText(item.text)]),
                legend_1.legendShape(config.form, item)
            ]));
            if (!isMid) {
                var textWidth = common_1.getTextWidth(item.text, font);
                xPadding += textWidth + itemPadding + figureWidth * 1.5;
            }
            else {
                yPadding += itemPadding + 2;
            }
        });
        switch (config.valign) {
            case types_1.VerticalPosition.top:
                positionY = -margin - figureWidth / 2;
                break;
            case types_1.VerticalPosition.middle:
                positionY = (height - yPadding) / 2 + itemPadding / 2;
                break;
            case types_1.VerticalPosition.bottom:
                positionY = height + margin;
                break;
        }
        switch (config.halign) {
            case types_1.HorizontalPosition.left:
                positionX = isMid ? -margin : figureWidth / 2;
                break;
            case types_1.HorizontalPosition.center:
                positionX = (width - xPadding) / 2;
                break;
            case types_1.HorizontalPosition.right:
                positionX = isMid ? width + margin + figureWidth / 2 : width - xPadding + itemPadding + figureWidth / 2;
                break;
        }
        return dom_1.sv("g", { transform: "translate(" + positionX + ", " + positionY + ")" }, svg);
    };
    Legend.prototype._getData = function () {
        var drawData = [];
        if (this.config.values) {
            var text_1 = common_1.locator(this.config.values.text);
            var fill_1 = common_1.locator(this.config.values.color);
            this._data.map(function (item) {
                drawData.push({
                    id: item.id,
                    text: text_1(item).toString(),
                    alpha: 1,
                    fill: fill_1(item).toString(),
                    active: !item.$hidden
                });
            });
        }
        else {
            var series = this.config.$seriesInfo;
            for (var key in series) {
                var serie = series[key];
                var seriaConfig = serie.config;
                var useColor = seriaConfig.fill && seriaConfig.color;
                drawData.push({
                    id: seriaConfig.id,
                    text: seriaConfig.name || seriaConfig.value,
                    alpha: seriaConfig.alpha,
                    fill: seriaConfig.fill || seriaConfig.color,
                    color: useColor && seriaConfig.color,
                    active: seriaConfig.active
                });
            }
        }
        return drawData;
    };
    return Legend;
}());
exports.Legend = Legend;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(0);
var figureWidth = 10;
var forms = {
    circle: function (color, fill, fillOpacity) {
        return dom_1.sv("circle", {
            "id": core_1.uid(),
            "r": figureWidth / 2,
            fill: fill,
            "class": "figure " + (color !== "none" ? "with-stroke" : ""),
            "stroke-width": 2,
            "fill-opacity": fillOpacity,
            "stroke": color,
            "transform": "translate(0, -1)"
        });
    },
    rect: function (color, fill, fillOpacity) {
        return dom_1.sv("rect", {
            "id": core_1.uid(),
            fill: fill,
            "fill-opacity": fillOpacity,
            "width": figureWidth,
            "stroke-width": 2,
            "height": figureWidth,
            "class": "figure " + (color !== "none" ? "with-stroke" : ""),
            "stroke": color,
            "transform": "translate(" + -figureWidth / 2 + ", " + -figureWidth / 2 + ")"
        });
    }
};
function legendShape(form, item) {
    if (typeof form === "string") {
        form = forms[form];
    }
    return form((item.color || "none"), item.fill, (item.alpha || 1));
}
exports.legendShape = legendShape;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RadialScale_1 = __webpack_require__(50);
var Scale_1 = __webpack_require__(12);
var TextScale_1 = __webpack_require__(52);
var scaleTypes = {
    radial: RadialScale_1.RadialScale,
    text: TextScale_1.TextScale,
    numeric: Scale_1.Scale
};
exports.default = scaleTypes;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var circle_1 = __webpack_require__(6);
var types_1 = __webpack_require__(2);
var Scale_1 = __webpack_require__(12);
var RadialScale = /** @class */ (function (_super) {
    __extends(RadialScale, _super);
    function RadialScale(_data, config) {
        return _super.call(this, _data, config, types_1.ScaleType.radial) || this;
    }
    RadialScale.prototype.paint = function (width, height) {
        var _this = this;
        if (this.config.hidden) {
            return null;
        }
        var zebra = this.config.zebra;
        var attribute = this.config.value;
        var realAxis = this.config.showAxis ? this._axis.steps : null;
        var axis = this._axis.steps.map(function (step) { return _this.point(step); });
        var scales = this._data.map(function (item) { return item[attribute]; });
        var config = { scales: scales, axis: axis, realAxis: realAxis, zebra: zebra };
        return circle_1.radarScale(config, width, height);
    };
    RadialScale.prototype.point = function (val) {
        return (val - this._axis.min) / (this._axis.max - this._axis.min);
    };
    return RadialScale;
}(Scale_1.Scale));
exports.RadialScale = RadialScale;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = __webpack_require__(1);
var allowedBases = [1, 2, 3, 5, 10];
var AxisCreator = /** @class */ (function () {
    function AxisCreator(_data, conf) {
        if (conf === void 0) { conf = {}; }
        this._data = _data;
        var defaults = {
            min: Math.min.apply(Math, this._data),
            max: Math.max.apply(Math, this._data),
            maxTicks: this._data.length < 20 ? this._data.length : 20
        };
        this.config = __assign({}, defaults, conf);
        if (this.config.padding) {
            this._addPadding();
        }
    }
    AxisCreator.prototype.getScale = function () {
        var steps;
        if (this.config.log) {
            steps = this._logSteps();
        }
        else {
            var step = this._getStep();
            steps = this._calculateSteps(step);
        }
        return {
            min: steps[0],
            max: steps[steps.length - 1],
            steps: steps
        };
    };
    AxisCreator.prototype._getStep = function () {
        var ticks = this.config.maxTicks;
        var dif = this.config.max - this.config.min;
        var exponent = Math.floor(common_1.log10(dif / ticks));
        var step = Math.pow(10, exponent);
        var rawBase = (dif / step) / ticks;
        var nearestBase = allowedBases[allowedBases.concat([rawBase]).sort(function (a, b) { return a - b; }).indexOf(rawBase)];
        return nearestBase * step;
    };
    AxisCreator.prototype._calculateSteps = function (step) {
        var firstIndex = Math.floor(this.config.min / step);
        var lastIndex = Math.ceil(this.config.max / step);
        var steps = [];
        for (var i = firstIndex; i <= lastIndex; i++) {
            var currentStep = step * i;
            if (Math.floor(currentStep) !== currentStep) {
                currentStep = parseFloat(currentStep.toFixed(8));
            }
            steps.push(currentStep);
        }
        return steps;
    };
    AxisCreator.prototype._logSteps = function () {
        var steps = [];
        if (this.config.min < 0) {
            var negativeExponent = Math.ceil(common_1.log10(-this.config.min));
            for (var i = negativeExponent; i > 0; i--) {
                steps.push(-(Math.pow(10, i)));
            }
            steps.push(0);
        }
        if (this.config.max > 0) {
            var positiveExponent = Math.ceil(common_1.log10(this.config.max));
            for (var i = 1; i <= positiveExponent; i++) {
                steps.push(Math.pow(10, i));
            }
        }
        return steps;
    };
    AxisCreator.prototype._addPadding = function () {
        this.config.min -= this.config.padding;
    };
    return AxisCreator;
}());
exports.AxisCreator = AxisCreator;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = __webpack_require__(1);
var Scale_1 = __webpack_require__(12);
var SvgScales_1 = __webpack_require__(23);
var renderScale = {
    left: SvgScales_1.left,
    right: SvgScales_1.right,
    bottom: SvgScales_1.bottom,
    top: SvgScales_1.top
};
var renderGrid = {
    left: SvgScales_1.leftGrid,
    right: SvgScales_1.rightGrid,
    bottom: SvgScales_1.bottomGrid,
    top: SvgScales_1.topGrid
};
var TextScale = /** @class */ (function (_super) {
    __extends(TextScale, _super);
    function TextScale() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TextScale.prototype.scaleReady = function (sizes) {
        var max = this._data.getLength() - 1;
        var steps = this._data.map(this.locator);
        this._axis = { max: max, steps: steps };
        sizes[this._position] += this.config.size;
    };
    TextScale.prototype.point = function (value) {
        var pos = this._axis.steps.indexOf(value);
        if (this._padding) {
            var max = this._axis.max + 1;
            var padding = .5 / max;
            var point = pos / max;
            return this._isXDirection ? padding + point : 1 - padding - point;
        }
        else {
            return this._isXDirection ? pos / this._axis.max : 1 - pos / this._axis.max;
        }
    };
    TextScale.prototype.paint = function (width, height) {
        var _this = this;
        if (this.config.hidden) {
            return null;
        }
        var points = this._axis.steps.map(function (item, index) { return [_this._isXDirection ? _this._getAxisPoint(index) * width : _this.point(item) * height, item]; });
        return renderScale[this._position](points, this.config, width, height);
    };
    TextScale.prototype.scaleGrid = function () {
        var _this = this;
        var getPoints = function (width, height) {
            return _this._axis.steps.map(function (item, index) { return [_this._isXDirection ? _this._getAxisPoint(index) * width : _this._getAxisPoint(index) * height, item]; });
        };
        var type = this._position;
        var grid = this.config.grid;
        var dashed = this.config.dashed;
        var hidden = this.config.hidden;
        var getSpecificLevel = function () { return _this._axis.steps.indexOf(_this.config.targetLine); };
        return {
            paint: function (width, height) {
                var targetLine = getSpecificLevel();
                var points = getPoints(width, height);
                var config = { targetLine: targetLine, dashed: dashed, grid: grid, hidden: hidden };
                return renderGrid[type](points, width, height, config);
            }
        };
    };
    TextScale.prototype._setDefaults = function (config) {
        var defaults = {
            scalePadding: 30,
            textPadding: 12,
            grid: true,
            targetLine: null,
            showText: true
        };
        this.locator = common_1.locator(config.text);
        this.config = __assign({}, defaults, config);
    };
    TextScale.prototype._getAxisPoint = function (index) {
        var max = this._axis.max;
        if (this._padding) {
            var count = max + 1;
            var padding = .5 / count;
            var point = index / count;
            return this._isXDirection ? padding + point : 1 - padding - point;
        }
        else {
            return this._isXDirection ? index / max : 1 - index / max;
        }
    };
    return TextScale;
}(Scale_1.Scale));
exports.TextScale = TextScale;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Area_1 = __webpack_require__(24);
var Bar_1 = __webpack_require__(25);
var BarX_1 = __webpack_require__(55);
var Donut_1 = __webpack_require__(56);
var Line_1 = __webpack_require__(16);
var Pie_1 = __webpack_require__(57);
var Pie3D_1 = __webpack_require__(58);
var Radar_1 = __webpack_require__(59);
var Scatter_1 = __webpack_require__(60);
var Spline_1 = __webpack_require__(61);
var SplineArea_1 = __webpack_require__(62);
var seriesTypes = {
    line: Line_1.default, spline: Spline_1.default, area: Area_1.default, splineArea: SplineArea_1.default, scatter: Scatter_1.default, pie: Pie_1.default, pie3D: Pie3D_1.default, donut: Donut_1.default, radar: Radar_1.default, bar: Bar_1.default, xbar: BarX_1.default
};
exports.default = seriesTypes;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
function hoverMode(cfg) {
    // cfg.fill = cfg.stroke; ??
    return cfg;
}
exports.hoverMode = hoverMode;
function standarMode(cfg) {
    return cfg;
}
exports.standarMode = standarMode;
var forms = {
    circle: function (color, fill, _alpha, x, y, id, mode) {
        var config = {
            "_ref": id,
            "cx": x,
            "cy": y,
            "r": 4,
            "class": "figure point-circle",
            fill: fill,
            "stroke": color,
            "stroke-width": 2
        };
        return dom_1.sv("circle", mode(config));
    },
    rect: function (color, fill, _alpha, x, y, id, mode) {
        var config = {
            "_ref": id,
            "x": x - 4,
            "y": y - 4,
            "width": 8,
            "height": 8,
            "class": "figure point-rect",
            fill: fill,
            "stroke": color,
            "stroke-width": 2
        };
        return dom_1.sv("rect", mode(config));
    },
    rhombus: function (color, fill, _alpha, x, y, id, mode) {
        var config = {
            "_ref": id,
            "points": x - 5 + "," + y + " " + x + "," + (y + 5) + " " + (x + 5) + "," + y + " " + x + "," + (y - 5),
            "class": "figure point-rhombus",
            fill: fill,
            "stroke": color,
            "stroke-width": 2
        };
        return dom_1.sv("polygon", mode(config));
    },
    triangle: function (color, fill, _alpha, x, y, id, mode) {
        var config = {
            "_ref": id,
            "points": x + "," + (y - 5) + " " + (x + 5) + "," + (y + 5) + " " + (x - 5) + "," + (y + 5),
            "class": "figure point-triangle",
            fill: fill,
            "stroke": color,
            "stroke-width": 2
        };
        return dom_1.sv("polygon", mode(config));
    },
    simpleCircle: function (color, _fill, _alpha, x, y, id, mode) {
        var config = {
            _ref: id,
            cx: x,
            cy: y,
            r: 3,
            class: "figure point-simple-circle",
            fill: color
        };
        return dom_1.sv("circle", mode(config));
    },
    simpleRect: function (color, _fill, _alpha, x, y, id, mode) {
        var config = {
            _ref: id,
            x: x - 3,
            y: y - 3,
            width: 6,
            height: 6,
            class: "figure point-simple-rect",
            fill: color
        };
        return dom_1.sv("rect", mode(config));
    },
    empty: function () {
        return null;
    }
};
function getHelper(type) {
    var helper = forms[type.toString()];
    if (!helper) {
        throw new Error("unknown point type");
    }
    return helper;
}
exports.getHelper = getHelper;
function getShadeHelper(type, color, mode) {
    var helper = getHelper(type);
    color = color || "none";
    var shade = common_1.getColorShade(color, 0.2);
    return function (x, y, id) {
        return helper(color, shade, "", x, y, id, mode);
    };
}
exports.getShadeHelper = getShadeHelper;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(2);
var Bar_1 = __webpack_require__(25);
var BarX = /** @class */ (function (_super) {
    __extends(BarX, _super);
    function BarX() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BarX.prototype.addScale = function (type, scale) {
        var realtype = (type === types_1.ScaleType.top || type === types_1.ScaleType.bottom) ?
            types_1.ScaleType.left :
            types_1.ScaleType.top;
        _super.prototype.addScale.call(this, realtype, scale);
    };
    BarX.prototype.paint = function (width, height, prev) {
        return _super.prototype.paint.call(this, height, width, prev);
    };
    BarX.prototype.getTooltipType = function (id, x, y) {
        if (this.config.baseLine !== undefined && this._baseLinePosition > x) {
            return types_1.TooltipType.left;
        }
        return types_1.TooltipType.right;
    };
    BarX.prototype.getClosest = function (x, y) {
        var res = [Infinity, null, null, null];
        for (var _i = 0, _a = this._points; _i < _a.length; _i++) {
            var point = _a[_i];
            var dist = this._getClosestDist(x, y, point[1], point[0]);
            if (res[0] > dist) {
                res[0] = dist;
                res[1] = point[1];
                res[2] = point[0];
                res[3] = point[2];
            }
        }
        return res;
    };
    BarX.prototype._getText = function (item) {
        return item[4].toString();
    };
    BarX.prototype._getClosestDist = function (x, y, px, py) {
        if (this.config.stacked && x > px) {
            return Infinity;
        }
        return Math.abs(y - py);
    };
    BarX.prototype._path = function (item, prev) {
        item[0] += this._shift;
        return "\nM " + prev + " " + (item[0] - (this.config.barWidth / 2)) + "\nH " + item[1] + "\nv " + this.config.barWidth + "\nH " + prev;
    };
    BarX.prototype._base = function (height) {
        var baseLine = this.config.baseLine;
        return this._baseLinePosition = baseLine !== undefined ? this.yScale.point(baseLine) * height : 0;
    };
    BarX.prototype._text = function (item, prev) {
        return {
            y: item[0],
            x: (prev + item[1]) / 2,
            class: "bar-text"
        };
    };
    return BarX;
}(Bar_1.default));
exports.default = BarX;


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var circle_1 = __webpack_require__(6);
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var NoScaleSeria_1 = __webpack_require__(15);
var Donut = /** @class */ (function (_super) {
    __extends(Donut, _super);
    function Donut() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Donut.prototype.paint = function (width, height) {
        var _this = this;
        var radius = height / 2;
        var currentPercent = -.25; // 0 percent is (1, 0) point, -.25 is (0, -1) point
        var svg = [];
        var links = [];
        var tooltipData = [];
        var err = this._points.length === 1 ? -.000001 : 0;
        this._points.forEach(function (item) {
            var percent = item[0], value = item[1], id = item[2], text = item[3], color = item[4];
            var _a = circle_1.getCoordinates(currentPercent, radius, radius), startX = _a[0], startY = _a[1];
            var avPercent = currentPercent + percent / 2;
            currentPercent += percent + err;
            var _b = circle_1.getCoordinates(currentPercent, radius, radius), endX = _b[0], endY = _b[1];
            var largeArcFlag = percent > .5 ? 1 : 0;
            var middleLine = circle_1.getCoordinates(avPercent, radius, radius);
            var isRight = avPercent > -0.25 && avPercent < 0.25;
            var isUp = avPercent > 0.5 || avPercent < 0;
            switch (_this.config.subType) {
                case types_1.NoScaleSubType.basic: {
                    var className = isRight ? "donut-value-title start-text" : "donut-value-title end-text";
                    var textPadding = 10;
                    var dy = isUp ? -textPadding * 2 : textPadding;
                    var linkStart = circle_1.getCoordinates(avPercent, radius + 10, radius + 10);
                    var className2 = isRight ? "donut-value start-text" : "donut-value end-text";
                    var text1 = dom_1.sv("text", { x: linkStart[0], y: linkStart[1] + dy, class: className }, [
                        common_1.verticalCenteredText(text.toString())
                    ]);
                    var text2 = dom_1.sv("text", { x: linkStart[0], y: linkStart[1] + dy + 16, class: className2 }, [
                        common_1.verticalCenteredText(value.toString())
                    ]);
                    links.push(text1);
                    links.push(text2);
                    break;
                }
                case types_1.NoScaleSubType.valueOnly: {
                    var className = isRight ? "donut-value start-text" : "donut-value end-text";
                    var textPadding = 10;
                    var dy = isUp ? -textPadding : textPadding;
                    var linkStart = circle_1.getCoordinates(avPercent, radius + 10, radius + 10);
                    var textSvg = dom_1.sv("text", { x: linkStart[0], y: linkStart[1] + dy, class: className }, [
                        common_1.verticalCenteredText(text.toString())
                    ]);
                    links.push(textSvg);
                    break;
                }
                case types_1.NoScaleSubType.percentOnly:
                    var percentText = dom_1.sv("text", { x: middleLine[0] * 7 / 9, y: middleLine[1] * 7 / 9, class: "pie-inner-value" }, [
                        common_1.verticalCenteredText(Math.round(percent * 100) + "%")
                    ]);
                    links.push(percentText);
            }
            var d = "M " + startX + " " + startY + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 1 " + endX + " " + endY + " L 0 0";
            var _c = circle_1.getCoordinates(avPercent, 4, 4), shiftX = _c[0], shiftY = _c[1];
            var currentSector = dom_1.sv("path", {
                d: d,
                _key: id,
                fill: color,
                class: "chart donut",
                onmouseout: [circle_1.pieLikeHandlers.onmouseout],
                onmouseover: [circle_1.pieLikeHandlers.onmouseover, shiftX, shiftY]
            });
            svg.push(currentSector);
            if (_this._points.length === 1) {
                tooltipData.push([width / 2, height / 2]);
            }
            else {
                tooltipData.push([middleLine[0] * .8 + width / 2, middleLine[1] * .8 + height / 2]);
            }
        });
        this._center = [width / 2, height / 2];
        this._tooltipData = tooltipData;
        svg.push(dom_1.sv("circle", {
            cx: 0,
            cy: 0,
            r: radius * 5 / 9,
            fill: "var(--EVO-fill-chart-js)"
        }));
        svg = svg.concat(links);
        return dom_1.sv("g", { transform: "translate(" + width / 2 + ", " + height / 2 + ")" }, svg);
    };
    return Donut;
}(NoScaleSeria_1.default));
exports.default = Donut;


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(3);
var dom_1 = __webpack_require__(0);
var circle_1 = __webpack_require__(6);
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var NoScaleSeria_1 = __webpack_require__(15);
var Pie = /** @class */ (function (_super) {
    __extends(Pie, _super);
    function Pie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pie.prototype.paint = function (width, height) {
        var _this = this;
        var _a = this.config, stroke = _a.stroke, strokeWidth = _a.strokeWidth, gradient = _a.gradient, useLines = _a.useLines, showText = _a.showText, showTextTemplate = _a.showTextTemplate, subType = _a.subType;
        var radius = height / 2;
        var currentPercent = -.25; // 0 percent is (1, 0) point, -.25 is (0, -1) point
        var tooltipData = [];
        var svg = [];
        var defs = [];
        var links = [];
        var pie = [];
        var lines = [];
        var err = this._points.length === 1 ? -.000001 : 0; // if move to start point it will be empty circle
        this._points.forEach(function (item) {
            var percent = item[0], value = item[1], id = item[2], text = item[3], color = item[4];
            var fill = color;
            if (gradient) {
                var grad = gradient(color);
                var gradientId = "gradient" + core_1.uid();
                var radialGradient = common_1.getRadialGradient(grad.options, grad.stops, gradientId);
                fill = "url(#" + gradientId + ")";
                defs.push(radialGradient);
            }
            var _a = circle_1.getCoordinates(currentPercent, radius, radius), startX = _a[0], startY = _a[1];
            var avPercent = currentPercent + percent / 2;
            var lineLength = avPercent < .25 ? 5 : -5; // from 0 to 180 right pointer, 180 to 360 left pointer
            var middleLine = circle_1.getCoordinates(avPercent, radius, radius);
            var _b = [5, 30], startPart = _b[0], endPart = _b[1];
            var _c = [circle_1.getCoordinates(avPercent, radius + startPart, radius + startPart), circle_1.getCoordinates(avPercent, radius + endPart, radius + endPart)], linkStart = _c[0], linkEnd = _c[1];
            var className = avPercent > -0.25 && avPercent < 0.25 ? "pie-value start-text" : "pie-value end-text";
            if (useLines) {
                links.push(dom_1.sv("path", { d: "M" + linkStart[0] + " " + linkStart[1] + " L" + linkEnd[0] + " " + linkEnd[1] + " h " + lineLength, class: "pie-value-connector" }));
                var textSvg = dom_1.sv("text", { x: linkEnd[0], y: linkEnd[1], dx: lineLength / 2 + lineLength > 0 ? 10 : -10, class: className }, [
                    common_1.verticalCenteredText(text.toString())
                ]);
                links.push(textSvg);
            }
            else {
                var textPadding = 5;
                var dy = avPercent > 0.5 || avPercent < 0 ? -textPadding : textPadding;
                var textSvg = dom_1.sv("text", { x: linkStart[0], y: linkStart[1] + dy, class: className }, [
                    common_1.verticalCenteredText(text.toString())
                ]);
                links.push(textSvg);
            }
            if (showText || showTextTemplate) {
                var linkText = dom_1.sv("text", { x: middleLine[0] * .7, y: middleLine[1] * .7, class: "pie-inner-value" }, [
                    showTextTemplate ? common_1.verticalCenteredText(showTextTemplate(value.toString())) : common_1.verticalCenteredText(value.toString())
                ]);
                links.push(linkText);
            }
            if (subType === types_1.NoScaleSubType.percentOnly) {
                var percentText = dom_1.sv("text", { x: middleLine[0] * 0.5, y: middleLine[1] * 0.5, class: "pie-inner-value" }, [
                    common_1.verticalCenteredText(Math.round(percent * 100) + "%")
                ]);
                links.push(percentText);
            }
            currentPercent += percent + err;
            var _d = circle_1.getCoordinates(currentPercent, radius, radius), endX = _d[0], endY = _d[1];
            var largeArcFlag = percent > .5 ? 1 : 0;
            var d = "M " + startX + " " + startY + " A " + radius + " " + radius + " 0 " + largeArcFlag + " 1 " + endX + " " + endY + " L 0 0";
            var _e = circle_1.getCoordinates(avPercent, 4, 4), shiftX = _e[0], shiftY = _e[1];
            var currentSector = dom_1.sv("path", {
                d: d,
                class: "chart pie",
                _key: id,
                fill: fill,
                onmouseover: [circle_1.pieLikeHandlers.onmouseover, shiftX, shiftY],
                onmouseout: [circle_1.pieLikeHandlers.onmouseout]
            });
            pie.push(currentSector);
            if (_this._points.length > 1 && stroke) {
                var strokeOpts = {
                    "stroke-width": strokeWidth,
                    stroke: stroke
                };
                var line = dom_1.sv("path", __assign({ d: "M0 0 L" + endX + " " + endY, fill: "none" }, strokeOpts));
                lines.push(line);
            }
            if (_this._points.length === 1) {
                tooltipData.push([width / 2, height / 2]);
            }
            else {
                tooltipData.push([middleLine[0] * .7 + width / 2, middleLine[1] * .7 + height / 2]);
            }
        });
        this._center = [width / 2, height / 2];
        this._tooltipData = tooltipData;
        svg.push(dom_1.sv("defs", defs));
        svg = svg.concat(pie);
        svg = svg.concat(lines);
        svg = svg.concat(links);
        return dom_1.sv("g", { transform: "translate(" + width / 2 + ", " + height / 2 + ")" }, svg);
    };
    return Pie;
}(NoScaleSeria_1.default));
exports.default = Pie;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var circle_1 = __webpack_require__(6);
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var NoScaleSeria_1 = __webpack_require__(15);
var Pie = /** @class */ (function (_super) {
    __extends(Pie, _super);
    function Pie() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pie.prototype.paint = function (width, height) {
        var _this = this;
        var _a = this.config, subType = _a.subType, useLines = _a.useLines, showText = _a.showText, showTextTemplate = _a.showTextTemplate;
        var radiusX = height / 2;
        var radiusY = radiusX * .5;
        var connector = radiusX / 5;
        var tooltipData = [];
        var currentPercent = -.25;
        var svg = [];
        var links = [];
        var err = this._points.length === 1 ? -.000001 : 0;
        this._points.forEach(function (item) {
            var percent = item[0], value = item[1], id = item[2], text = item[3], color = item[4];
            var _a = circle_1.getCoordinates(currentPercent, radiusX, radiusY), startX = _a[0], startY = _a[1];
            var avPercent = currentPercent + percent / 2;
            var lineLength = avPercent < .25 ? 5 : -5;
            var middleLine = circle_1.getCoordinates(avPercent, radiusX, radiusY);
            var delta = 0;
            if (avPercent > 0 && avPercent < 0.5) {
                delta = connector * Math.sin(2 * Math.PI * avPercent);
            }
            var linkStart = circle_1.getCoordinates(avPercent, radiusX + 5 + delta, radiusY + 5 + delta);
            var linkEnd = circle_1.getCoordinates(avPercent, radiusX + 30 + delta, radiusY + 30 + delta);
            var nextPercent = currentPercent + percent + err;
            var _b = circle_1.getCoordinates(nextPercent, radiusX, radiusY), endX = _b[0], endY = _b[1];
            var largeArcFlag = percent > .5 ? 1 : 0;
            var className = avPercent > -0.25 && avPercent < 0.25 ? "pie-value start-text" : "pie-value end-text";
            if (useLines) {
                links.push(dom_1.sv("path", { d: "M" + linkStart[0] + " " + linkStart[1] + " L" + linkEnd[0] + " " + linkEnd[1] + " h " + lineLength, class: "pie-value-connector" }));
                var textSvg = dom_1.sv("text", { x: linkEnd[0], y: linkEnd[1], dx: lineLength / 2 + lineLength > 0 ? 10 : -10, class: className }, [
                    common_1.verticalCenteredText(text.toString())
                ]);
                links.push(textSvg);
            }
            else {
                var textPadding = 10;
                var dy = avPercent > 0.5 || avPercent < 0 ? -textPadding : textPadding;
                var textSvg = dom_1.sv("text", { x: linkStart[0], y: linkStart[1] + dy, class: className }, [
                    common_1.verticalCenteredText(text.toString())
                ]);
                links.push(textSvg);
            }
            if (showText || showTextTemplate) {
                var textSvg = dom_1.sv("text", { x: middleLine[0] * .7, y: middleLine[1] * .7, class: "pie-inner-value" }, [
                    showTextTemplate ? common_1.verticalCenteredText(showTextTemplate(value)) : common_1.verticalCenteredText(value.toString())
                ]);
                links.push(textSvg);
            }
            if (subType === types_1.NoScaleSubType.percentOnly) {
                var percentText = dom_1.sv("text", { x: middleLine[0] * 0.6, y: middleLine[1] * 0.6, class: "pie-inner-value" }, [
                    common_1.verticalCenteredText(Math.round(percent * 100) + "%")
                ]);
                links.push(percentText);
            }
            // 3d block
            var addition = "";
            if (currentPercent <= 0 && nextPercent >= .5) {
                addition = "M " + radiusX + " 0 v " + connector + " A " + radiusX + " " + radiusY + " 0 1 1 " + -radiusX + " " + connector + " v " + -connector;
            }
            else if (currentPercent <= 0 && nextPercent < .5) {
                addition = "M " + radiusX + " 0 v " + connector + " A " + radiusX + " " + radiusY + " 0 0 1 " + endX + " " + (endY + connector) + " v " + -connector;
            }
            else if (currentPercent > 0 && currentPercent <= .5 && nextPercent >= .5) {
                addition = "M " + startX + " " + startY + " v " + connector + " A " + radiusX + " " + radiusY + " 0 0 1 " + -radiusX + " " + connector + " v " + -connector;
            }
            else if (currentPercent > 0 && nextPercent < .5) {
                addition = "M " + startX + " " + startY + " v " + connector + " A " + radiusX + " " + radiusY + " 0 0 1 " + endX + " " + (endY + connector) + " v " + -connector;
            }
            if (addition) {
                var additionPath = dom_1.sv("path", {
                    _key: id + "__shadow__",
                    d: addition,
                    fill: color,
                    class: "chart pie3d addition",
                    stroke: "none",
                    filter: "url(#shadow)"
                });
                svg.push(additionPath);
            }
            // end 3d block
            var d = "M " + startX + " " + startY + " A " + radiusX + " " + radiusY + " 0 " + largeArcFlag + " 1 " + endX + " " + endY + " L 0 0";
            svg.push(dom_1.sv("path", {
                d: d,
                _key: id,
                fill: color,
                stroke: "none",
                class: "chart pie3d"
            }));
            if (_this._points.length === 1) {
                tooltipData.push([width / 2, height / 2]);
            }
            else {
                tooltipData.push([middleLine[0] * .7 + width / 2, middleLine[1] * .7 + height / 2]);
            }
            currentPercent = nextPercent;
        });
        this._center = [width / 2, height / 2];
        this._tooltipData = tooltipData;
        svg = svg.concat(links);
        return dom_1.sv("g", { transform: "translate(" + width / 2 + ", " + height / 2 + ")" }, svg);
    };
    return Pie;
}(NoScaleSeria_1.default));
exports.default = Pie;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var circle_1 = __webpack_require__(6);
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var BaseSeria_1 = __webpack_require__(14);
var Radar = /** @class */ (function (_super) {
    __extends(Radar, _super);
    function Radar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Radar.prototype.addScale = function (type, scale) {
        this._scale = scale;
    };
    Radar.prototype.scaleReady = function (sizes) {
        for (var key in sizes) {
            sizes[key] += this.config.paddings;
        }
        return sizes;
    };
    Radar.prototype.dataReady = function (prev) {
        var _this = this;
        if (!this.config.active) {
            return this._points = [];
        }
        this._points = this._data.map(function (item, index) {
            // raw values
            var value = _this._locator(item);
            var set = [value, value, item.id, value, value];
            if (prev) {
                set[1] += prev[index][1];
            }
            return set;
        });
        return this._points;
    };
    Radar.prototype.getTooltipText = function (id) {
        if (this.config.tooltip) {
            var p = this._defaultLocator(this._data.getItem(id));
            if (this.config.tooltipTemplate) {
                return this.config.tooltipTemplate(p);
            }
            return p;
        }
    };
    Radar.prototype.paint = function (width, height) {
        var _this = this;
        _super.prototype.paint.call(this, width, height);
        if (!this.config.active) {
            return;
        }
        var config = this.config;
        var svg = [];
        var d = this._points.map(function (item, first) { return (first ? "L" : "M") + (item[0] + " " + item[1]); }).join(" ") + "Z";
        svg.push(dom_1.sv("path", {
            d: d,
            "stroke": config.color,
            "stroke-width": config.strokeWidth,
            "fill": config.fill,
            "fill-opacity": config.alpha,
            "class": "chart radar"
        }));
        if (config.pointType) {
            var points = this._points.map(function (p) { return _this._drawPointType(p[0], p[1], common_1.calcPointRef(p[2], _this.id)); });
            svg.push(dom_1.sv("g", points));
        }
        return dom_1.sv("g", { id: "seria" + config.id }, svg);
    };
    Radar.prototype._calckFinalPoints = function (width, height) {
        var _this = this;
        var radius = height / 2;
        var scalePercent = 1 / this._data.getLength();
        var currentPercent = -.25 - scalePercent;
        this._points.forEach(function (item, index) {
            currentPercent += scalePercent;
            var value = _this._scale.point(item[0]);
            var real = circle_1.getCoordinates(currentPercent, value * radius, value * radius);
            // scaled values
            item[0] = real[0] + width / 2;
            item[1] = real[1] + height / 2;
        });
    };
    Radar.prototype._defaultLocator = function (v) { return this._locator(v); };
    Radar.prototype._setDefaults = function (config) {
        var defaults = {
            strokeWidth: 2,
            active: true,
            tooltip: true,
            paddings: 5,
            color: "none",
            fill: "none",
            pointType: types_1.PointType.circle
        };
        this._locator = common_1.locator(config.value);
        config.scales = config.scales || [types_1.ScaleType.radial];
        this.config = __assign({}, defaults, config);
        if (this.config.pointType) {
            var color = this.config.pointColor || this.config.color;
            this._drawPointType = this._getPointType(this.config.pointType, color, this.config.tooltip);
        }
    };
    return Radar;
}(BaseSeria_1.default));
exports.default = Radar;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = __webpack_require__(2);
var Line_1 = __webpack_require__(16);
var common_1 = __webpack_require__(1);
var Scatter = /** @class */ (function (_super) {
    __extends(Scatter, _super);
    function Scatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Scatter.prototype.addScale = function (type, scale) {
        if (type === types_1.ScaleType.bottom || type === types_1.ScaleType.top) {
            this.xScale = scale;
            this._xLocator = common_1.locator(this.config.value);
        }
        else {
            this.yScale = scale;
            this._yLocator = common_1.locator(this.config.valueY);
        }
    };
    Scatter.prototype._setDefaults = function (config) {
        var defaults = {
            active: true,
            tooltip: true,
            pointType: types_1.PointType.rect
        };
        this.config = __assign({}, defaults, config);
        var showTooltip = this.config.tooltip;
        var point = this.config.pointType;
        var color = this.config.pointColor || this.config.color;
        if (point) {
            this._drawPointType = this._getPointType(point, color, showTooltip);
        }
    };
    return Scatter;
}(Line_1.default));
exports.default = Scatter;


/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var spline_1 = __webpack_require__(26);
var Line_1 = __webpack_require__(16);
var Spline = /** @class */ (function (_super) {
    __extends(Spline, _super);
    function Spline() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Spline.prototype._getForm = function (points, config, css, width, height) {
        var color = config.color;
        var className = config.css;
        var d = spline_1.default(points);
        return dom_1.sv("path", {
            "id": "seria" + config.id,
            d: d,
            "class": className,
            "stroke": color,
            "stroke-width": 2,
            "fill": "none"
        });
    };
    return Spline;
}(Line_1.default));
exports.default = Spline;


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var spline_1 = __webpack_require__(26);
var Area_1 = __webpack_require__(24);
var SplineArea = /** @class */ (function (_super) {
    __extends(SplineArea, _super);
    function SplineArea() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SplineArea.prototype._form = function (width, height, svg, prev) {
        var _a = this.config, fill = _a.fill, alpha = _a.alpha, strokeWidth = _a.strokeWidth, color = _a.color, id = _a.id;
        var className = this.config.css;
        var d = "";
        var first = this._points[0];
        if (prev) {
            d = spline_1.default([].concat(prev).reverse()) + " " + spline_1.default(this._points, true) + " Z";
        }
        else {
            d = "M" + first[0] + " " + height + " V " + first[1] + " " + spline_1.default(this._points) + " V" + height + " H " + first[0];
        }
        if (strokeWidth) {
            var line = spline_1.default(this._points);
            var splinePath = dom_1.sv("path", {
                "d": line,
                "stroke-width": strokeWidth,
                "stroke": color,
                "fill": "none",
                "stroke-linecap": "butt",
                "class": className
            });
            svg.push(splinePath);
        }
        var path = dom_1.sv("path", {
            "id": "seria" + id,
            d: d,
            "class": className,
            fill: fill,
            "fill-opacity": alpha,
            "stroke": "none"
        });
        svg.push(path);
        return svg;
    };
    return SplineArea;
}(Area_1.default));
exports.default = SplineArea;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var Stacker = /** @class */ (function () {
    function Stacker() {
        this._series = [];
    }
    Stacker.prototype.add = function (seria) {
        this._series.push(seria);
    };
    Stacker.prototype.dataReady = function (prev) {
        this._toPaint = this._series.filter(function (serie) {
            var next = serie.dataReady(prev);
            if (next.length) {
                prev = next;
                return true;
            }
            return false;
        });
        return prev || [];
    };
    Stacker.prototype.getPoints = function () {
        if (this._toPaint.length) {
            return this._toPaint[0].getPoints().concat(this._toPaint[this._toPaint.length - 1].getPoints());
        }
        return [];
    };
    Stacker.prototype.paint = function (width, height, prev) {
        var svg = [];
        var markers = [];
        this._toPaint.forEach(function (seria) {
            if (seria.paintformAndMarkers) {
                var _a = seria.paintformAndMarkers(width, height, prev), content = _a[0], seriesMarkers = _a[1];
                svg.push(content);
                markers.push(seriesMarkers);
            }
            else {
                var content = seria.paint(width, height, prev);
                svg.push(content);
            }
            prev = seria.getPoints();
        });
        return dom_1.sv("g", svg.concat(markers));
    };
    return Stacker;
}());
exports.default = Stacker;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dom_1 = __webpack_require__(0);
var common_1 = __webpack_require__(1);
var types_1 = __webpack_require__(2);
var view_1 = __webpack_require__(17);
var getAttrs = function (textWidth, x, y, type, chartType) {
    var dy = chartType === types_1.ChartType.bar ? 5 : 0;
    switch (type) {
        case types_1.TooltipType.top: {
            var h1 = (textWidth + 20 - 8 - 4) / 2;
            var h2 = textWidth + 20 - 4;
            var d = "M0 0 l4 -4 h" + h1 + " a2 2 0 0 0 2 -2 v-18 a2 2 0 0 0 -2 -2 h" + -h2 + " a2 2 0 0 0 -2 2 v18 a2 2 0 0 0 2 2 h" + h1 + " Z";
            var textX = 0;
            var textY = -15;
            return {
                d: d,
                left: x,
                top: y - 6 + dy,
                textX: textX,
                textY: textY
            };
        }
        case types_1.TooltipType.bot: {
            var h1 = (textWidth + 20 - 8 - 4) / 2;
            var h2 = textWidth + 20 - 4;
            var d = "M0 0 l4 4 h" + h1 + " a2 2 0 0 1 2 2 v18 a2 2 0 0 1 -2 2 h" + -h2 + " a2 2 0 0 1 -2 -2 v-18 a2 2 0 0 1 2 -2 h" + h1 + " Z";
            var textX = 0;
            var textY = 15;
            return {
                d: d,
                left: x,
                top: y + 6 - dy,
                textX: textX,
                textY: textY
            };
        }
        case types_1.TooltipType.right: {
            var h = textWidth + 20 - 4;
            var d = "M0 0 l4 -4 v-5 a2 2 0 0 1 2 -2 h" + h + " a2 2 0 0 1 2 2 v18 a2 2 0 0 1 -2 2 h" + -h + " a2 2 0 0 1 -2 -2 v-5 Z";
            var textX = h / 2 + 6;
            var textY = 0;
            return {
                d: d,
                left: x + 1,
                top: y,
                textX: textX,
                textY: textY
            };
        }
        case types_1.TooltipType.left: {
            var h = textWidth + 20 - 4;
            var d = "M0 0 l-4 -4 v-5 a2 2 0 0 0 -2 -2 h" + -h + " a2 2 0 0 0 -2 2 v18 a2 2 0 0 0 2 2 h" + h + " a2 2 0 0 0 2 -2 v-5 Z";
            var textX = -h / 2 - 6;
            var textY = 0;
            return {
                d: d,
                left: x - 1,
                top: y,
                textX: textX,
                textY: textY
            };
        }
        case types_1.TooltipType.simple: {
            var h = textWidth + 20 - 4;
            var d = "M0 0 v-4 a2 2 0 0 1 2 -2 h" + h + " a2 2 0 0 1 2 2 v18 a2 2 0 0 1 -2 2 h" + -h + " a2 2 0 0 1 -2 -2 v-6 Z";
            var textX = h / 2 + 2;
            var textY = 6;
            return {
                d: d,
                left: x - h / 2 - 2,
                top: y - 5,
                textX: textX,
                textY: textY
            };
        }
    }
};
var Tooltip = /** @class */ (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip(container, config) {
        var _this = _super.call(this, container, config) || this;
        _this._chart = config.chart;
        _this._state = { leftOffset: 0, topOffset: 0, value: "", x: 0, y: 0, type: null, chartType: null, isVisible: false };
        _this.mount(container, dom_1.create({ render: function () { return _this._draw(); } }));
        _this._chart.events.on(types_1.ChartEvents.chartMouseMove, function (x, y, left, top) {
            var closest = [Infinity, null, null, null, null]; // (dist, x, y, id, serieid)
            _this._chart.eachSeries(function (serie) {
                var serieClosest = serie.getClosest(x, y);
                if (closest[0] > serieClosest[0]) {
                    closest[0] = serieClosest[0];
                    closest[1] = serieClosest[1];
                    closest[2] = serieClosest[2];
                    closest[3] = serieClosest[3];
                    closest[4] = serie.id;
                }
            });
            var tooltipSeries = _this._chart.getSeries(closest[4]);
            if (tooltipSeries) {
                var ref = common_1.calcPointRef(closest[3], closest[4]);
                if (ref === _this._lastPointRef) {
                    return;
                }
                var text = tooltipSeries.getTooltipText(closest[3]);
                if (text) {
                    var tooltipType = tooltipSeries.getTooltipType(closest[3], closest[1], closest[2]);
                    _this._enableActivePoint(ref);
                    _this._state.leftOffset = left;
                    _this._state.topOffset = top;
                    _this._state.value = text;
                    _this._state.x = closest[1];
                    _this._state.y = closest[2];
                    _this._state.type = tooltipType;
                    _this._state.chartType = tooltipSeries.config.type;
                    _this._state.isVisible = true;
                    _this.paint();
                }
            }
        }, _this);
        _this._chart.events.on(types_1.ChartEvents.chartMouseLeave, function () { return _this._hide(); }, _this);
        return _this;
    }
    Tooltip.prototype.destructor = function () {
        this._chart.events.detach(types_1.ChartEvents.chartMouseLeave, this);
        this._chart.events.detach(types_1.ChartEvents.chartMouseMove, this);
        this.unmount();
    };
    Tooltip.prototype._hide = function () {
        this._disableLastActivePoint();
        this._state.isVisible = false;
        this.paint();
    };
    Tooltip.prototype._enableActivePoint = function (ref) {
        var rootView = this._chart.getRootView();
        var point = rootView && rootView.refs && rootView.refs[ref];
        if (point) {
            this._disableLastActivePoint();
            this._lastPointRef = ref;
            point.patch({ class: point.attrs.class + " active-figure" });
        }
    };
    Tooltip.prototype._disableLastActivePoint = function () {
        if (this._lastPointRef) {
            var rootView = this._chart.getRootView();
            var point = rootView && rootView.refs && rootView.refs[this._lastPointRef];
            if (point) {
                point.patch({ class: point.attrs.class.replace(" active-figure", "") });
            }
            this._lastPointRef = null;
        }
    };
    Tooltip.prototype._draw = function () {
        var _a = this._state, value = _a.value, x = _a.x, y = _a.y, type = _a.type, chartType = _a.chartType, isVisible = _a.isVisible;
        var attrs;
        if (isVisible && value !== "") {
            var style = common_1.getFontStyle("tooltip-text");
            var textWidth = common_1.getTextWidth(value, style);
            attrs = getAttrs(textWidth, x, y, type || types_1.TooltipType.top, chartType);
        }
        else {
            attrs = { textX: 0, textY: 0, d: null, left: 0, top: 0 };
        }
        return dom_1.el(".dhx_chart.tooltip-container", {
            style: {
                pointerEvents: "none",
                width: 0,
                height: 0,
                visibility: isVisible ? "visible" : "hidden",
                position: "absolute",
                left: attrs.left + this._state.leftOffset + "px",
                top: attrs.top + this._state.topOffset + "px"
            }
        }, isVisible ? [
            dom_1.sv("svg", [
                dom_1.sv("path", { d: attrs.d, class: "tooltip-form" }),
                dom_1.sv("text", { x: attrs.textX, y: attrs.textY, class: "tooltip-text" }, [
                    common_1.verticalCenteredText(value)
                ])
            ])
        ] : null);
    };
    return Tooltip;
}(view_1.View));
exports.Tooltip = Tooltip;


/***/ })
/******/ ]);
});if (window.dhx_legacy) { if (window.dhx){ for (var key in dhx) dhx_legacy[key] = dhx[key]; } window.dhx = dhx_legacy; delete window.dhx_legacy; }
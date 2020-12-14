"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccessibilityChecks = exports.AccessibilityHelpers = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var outlineStyle = '8px solid red';
var whitelist = ['.c-map-with-pins'];

var AccessibilityHelpers = /*#__PURE__*/function () {
  function AccessibilityHelpers() {
    (0, _classCallCheck2.default)(this, AccessibilityHelpers);
  }

  (0, _createClass2.default)(AccessibilityHelpers, [{
    key: "setAriaProp",
    value: function setAriaProp(element, ariaProp, ariaValue) {
      element.setAttribute("aria-".concat(ariaProp), ariaValue);
    }
  }, {
    key: "toggleAriaState",
    value: function toggleAriaState(element, ariaProp) {
      if (!element.hasAttribute("aria-".concat(ariaProp))) return;
      var currAriaValue = element.getAttribute("aria-".concat(ariaProp));
      var newAriaValue = !(currAriaValue == 'true');
      element.setAttribute("aria-".concat(ariaProp), newAriaValue);
    }
  }, {
    key: "setTabIndex",
    value: function setTabIndex(target, tabIndex) {
      var els = [];

      if (typeof target === 'string') {
        els = document.querySelectorAll("".concat(selector));
      } else if (target instanceof HTMLElement) {
        els = [target];
      } else if (target instanceof NodeList) {
        els = target;
      }

      var _iterator = _createForOfIteratorHelper(els),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var el = _step.value;
          el.tabIndex = tabIndex;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);
  return AccessibilityHelpers;
}();

exports.AccessibilityHelpers = AccessibilityHelpers;
var AccessibilityChecks = {
  checkAltTags: function checkAltTags() {
    var accessibilityStyleSheet = document.createElement('style');
    accessibilityStyleSheet.innerHTML = "img:not([alt]) { outline: ".concat(outlineStyle, "; }");

    var _iterator2 = _createForOfIteratorHelper(whitelist),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _selector = _step2.value;
        accessibilityStyleSheet.innerHTML += "".concat(_selector, " img:not([alt]) { outline: none; }");
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    document.head.appendChild(accessibilityStyleSheet);
  }
};
exports.AccessibilityChecks = AccessibilityChecks;
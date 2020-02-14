"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccessibilityChecks = exports.AccessibilityHelpers = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var outlineStyle = '8px solid red';
var whitelist = ['.c-map-with-pins'];

var AccessibilityHelpers =
/*#__PURE__*/
function () {
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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = els[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;
          el.tabIndex = tabIndex;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = whitelist[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var _selector = _step2.value;
        accessibilityStyleSheet.innerHTML += "".concat(_selector, " img:not([alt]) { outline: none; }");
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    document.head.appendChild(accessibilityStyleSheet);
  }
};
exports.AccessibilityChecks = AccessibilityChecks;
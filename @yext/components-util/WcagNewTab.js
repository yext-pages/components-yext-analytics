"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instance = exports.WCAGNewTab = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var blank = "_blank";
var relnofollow = "nofollow noopener noreferrer";

var WCAGNewTab = /*#__PURE__*/function () {
  function WCAGNewTab() {
    (0, _classCallCheck2.default)(this, WCAGNewTab);
  }

  (0, _createClass2.default)(WCAGNewTab, [{
    key: "wcagify",
    value: function wcagify() {
      var newWindowAllLinks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var _iterator = _createForOfIteratorHelper(document.querySelectorAll('a[href^="http"],a[target="_blank"]')),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var selector = _step.value;

          if (selector.target === blank || newWindowAllLinks) {
            if (newWindowAllLinks && selector.target !== blank) {
              selector.target = blank;
            }

            selector.rel = relnofollow;
            var spanToAppend = this.createTextNode();
            selector.appendChild(spanToAppend);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "createTextNode",
    value: function createTextNode() {
      var ariaSpan = document.createElement('span');
      var innerText = document.createTextNode(' Link Opens in New Tab');
      ariaSpan.classList.add('sr-only');
      ariaSpan.classList.add('wcag-new-tab-hover');
      ariaSpan.appendChild(innerText);
      return ariaSpan;
    }
  }]);
  return WCAGNewTab;
}();

exports.WCAGNewTab = WCAGNewTab;
var Instance = new WCAGNewTab();
exports.Instance = Instance;
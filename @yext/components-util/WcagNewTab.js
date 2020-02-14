"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instance = exports.WCAGNewTab = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var blank = "_blank";
var relnofollow = "nofollow noopener noreferrer";

var WCAGNewTab =
/*#__PURE__*/
function () {
  function WCAGNewTab() {
    (0, _classCallCheck2.default)(this, WCAGNewTab);
  }

  (0, _createClass2.default)(WCAGNewTab, [{
    key: "wcagify",
    value: function wcagify() {
      var newWindowAllLinks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = document.querySelectorAll('a[href^="http"],a[target="_blank"]')[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
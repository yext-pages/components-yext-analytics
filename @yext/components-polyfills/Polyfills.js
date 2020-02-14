"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Polyfills = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Polyfills =
/*#__PURE__*/
function () {
  function Polyfills() {
    (0, _classCallCheck2.default)(this, Polyfills);
  }

  (0, _createClass2.default)(Polyfills, null, [{
    key: "init",
    value: function init(scope) {
      this.win = scope || window;
      this.dom = this.win.document;
      this.CustomEvents();
      this.Matches();
      this.NodeListForEach();
      this.FlatMap();
      this.Closest();
      this.Prepend();
    }
  }, {
    key: "CustomEvents",
    value: function CustomEvents() {
      if (typeof this.win.CustomEvent === "function" || typeof this.win.Event === "function") return false;
      var dom = this.dom;

      function CustomEvent(event, params) {
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined
        };
        var evt = dom.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }

      CustomEvent.prototype = this.win.Event.prototype;
      this.win.CustomEvent = CustomEvent;
      this.win.Event = CustomEvent;
    } // Polyfill from https://developer.mozilla.org/en-US/docs/Web/API/Element/matches

  }, {
    key: "Matches",
    value: function Matches() {
      // prevent overriding browser implementation
      if (Element.prototype.matches) return false;

      Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
        var matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i = matches.length;

        while (--i >= 0 && matches.item(i) !== this) {}

        return i > -1;
      };
    } // Polyfill for NodeList.forEach from https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach

  }, {
    key: "NodeListForEach",
    value: function NodeListForEach() {
      if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = function (callback, thisArg) {
          thisArg = thisArg || window;

          for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
          }
        };
      }
    } // Polyfill from https://estada.ch/2019/6/10/javascript-arrayprototypeflatmap-polyfill/

  }, {
    key: "FlatMap",
    value: function FlatMap() {
      if (Array.prototype.flatMap) return false;
      Object.defineProperty(Array.prototype, 'flatMap', {
        value: function value(callback, thisArg) {
          var self = thisArg || this;

          if (self === null) {
            throw new TypeError('Array.prototype.flatMap ' + 'called on null or undefined');
          }

          if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
          }

          var list = []; // 1. Let O be ? ToObject(this value).

          var o = Object(self); // 2. Let len be ? ToLength(? Get(O, "length")).

          var len = o.length >>> 0;

          for (var k = 0; k < len; ++k) {
            if (k in o) {
              var part_list = callback.call(self, o[k], k, o);
              list = list.concat(part_list);
            }
          }

          return list;
        }
      });
    } // https://developer.mozilla.org/en-US/docs/Web/API/Element/closest#Polyfill

  }, {
    key: "Closest",
    value: function Closest() {
      if (!Element.prototype.matches) {
        Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }

      if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
          var el = this;

          do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
          } while (el !== null && el.nodeType === 1);

          return null;
        };
      }
    }
  }, {
    key: "Prepend",
    value: function Prepend() {
      // Source: https://github.com/jserz/js_piece/blob/master/DOM/ParentNode/prepend()/prepend().md
      (function (arr) {
        arr.forEach(function (item) {
          if (item.hasOwnProperty('prepend')) {
            return;
          }

          Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
              var argArr = Array.prototype.slice.call(arguments),
                  docFrag = document.createDocumentFragment();
              argArr.forEach(function (argItem) {
                var isNode = argItem instanceof Node;
                docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
              });
              this.insertBefore(docFrag, this.firstChild);
            }
          });
        });
      })([Element.prototype, Document.prototype, DocumentFragment.prototype]);
    }
  }]);
  return Polyfills;
}();

exports.Polyfills = Polyfills;
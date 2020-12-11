"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Observer = /*#__PURE__*/function () {
  function Observer() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.documentElement;
    (0, _classCallCheck2.default)(this, Observer);
    this._el = element;
    this._mutationObserver = undefined;
  }

  (0, _createClass2.default)(Observer, [{
    key: "add",
    value: function add(callback) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        attributes: true,
        childList: true
      };
      if (this._mutationObserver) return;
      var observer = new MutationObserver(callback);
      observer.observe(this._el, opts);
      this._mutationObserver = observer;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (!this._mutationObserver) return;

      this._mutationObserver.disconnect();

      this._mutationObserver = undefined;
    }
  }]);
  return Observer;
}();

exports.Observer = Observer;
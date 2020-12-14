"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OptimizedResizeInstance = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Throttle = require("components-yext-analytics/@yext/components-util/Throttle.js");

var OptimizedResize = /*#__PURE__*/function () {
  function OptimizedResize() {
    var scope = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
    (0, _classCallCheck2.default)(this, OptimizedResize);
    this.eventTypeName = 'optimizedResize';
    this.throttle = new _Throttle.Throttle('resize', this.eventTypeName, scope);
    this.init = false;
  }

  (0, _createClass2.default)(OptimizedResize, [{
    key: "on",
    value: function on(cb) {
      if (!this.init) {
        this.init = true;
        this.throttle.start();
      }

      window.addEventListener(this.eventTypeName, cb);
    }
  }, {
    key: "remove",
    value: function remove(cb) {
      window.removeEventListener(this.eventTypeName, cb);
    } // This will halt the triggering of ALL callbacks added with '.on()'.
    // Only call this if you are sure there are no other functions/classes
    // using this class.

  }, {
    key: "kill",
    value: function kill() {
      this.throttle.end();
      this.init = false;
    }
  }]);
  return OptimizedResize;
}();

var OptimizedResizeInstance = new OptimizedResize();
exports.OptimizedResizeInstance = OptimizedResizeInstance;
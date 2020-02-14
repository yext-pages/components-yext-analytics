"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Throttle = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var Throttle =
/*#__PURE__*/
function () {
  // adapted from: https://developer.mozilla.org/en-US/docs/Web/Events/resize
  function Throttle(eventName, customName, scope) {
    var _this = this;

    (0, _classCallCheck2.default)(this, Throttle);
    this.eventName = eventName;
    this.customName = customName;
    this.scope = scope;
    this.running = false;

    this.listener = function () {
      if (_this.running) {
        return;
      }

      _this.running = true;
      requestAnimationFrame(function () {
        _this.scope.dispatchEvent(new CustomEvent(_this.customName));

        _this.running = false;
      });
    };
  }

  (0, _createClass2.default)(Throttle, [{
    key: "start",
    value: function start() {
      this.scope.addEventListener(this.eventName, this.listener);
    }
  }, {
    key: "end",
    value: function end() {
      this.scope.removeEventListener(this.eventName, this.listener);
    }
  }]);
  return Throttle;
}();

exports.Throttle = Throttle;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Debug = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var param = 'xYextDebug';

var Debug =
/*#__PURE__*/
function () {
  function Debug() {
    (0, _classCallCheck2.default)(this, Debug);
  }

  (0, _createClass2.default)(Debug, null, [{
    key: "hasQueryParam",
    value: function hasQueryParam() {
      if ('URL' in window && typeof URL === "function") {
        var params = new URL(window.location.href).searchParams;
        return params && params.get(param) == 'true';
      }

      return false;
    }
  }, {
    key: "enable",
    value: function enable() {
      document.documentElement.classList.add(param);
    }
  }, {
    key: "disable",
    value: function disable() {
      document.documentElement.classList.remove(param);
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      var enabled = this.hasQueryParam();

      if (enabled) {
        this.enable();
      }

      return enabled;
    }
  }]);
  return Debug;
}();

exports.Debug = Debug;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OnReady = OnReady;
exports.UserAgent = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function OnReady(cb) {
  if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
    cb.bind(this)();
  } else {
    document.addEventListener('DOMContentLoaded', cb.bind(this));
  }
}

var UserAgent = /*#__PURE__*/function () {
  (0, _createClass2.default)(UserAgent, null, [{
    key: "fromWindow",
    value: function fromWindow() {
      return new this(window.navigator.userAgent);
    }
  }]);

  function UserAgent(ua) {
    (0, _classCallCheck2.default)(this, UserAgent);
    this.userAgent = ua;
  }

  (0, _createClass2.default)(UserAgent, [{
    key: "isGooglePageSpeed",
    value: function isGooglePageSpeed() {
      return this.userAgent.indexOf("Google Page Speed Insights") > -1 || this.userAgent.indexOf("Chrome-Lighthouse") > -1;
    }
  }]);
  return UserAgent;
}();

exports.UserAgent = UserAgent;
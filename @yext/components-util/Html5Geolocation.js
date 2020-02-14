"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HTML5Geolocation = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var HTML5Geolocation =
/*#__PURE__*/
function () {
  function HTML5Geolocation() {
    (0, _classCallCheck2.default)(this, HTML5Geolocation);
  }

  (0, _createClass2.default)(HTML5Geolocation, null, [{
    key: "initClass",
    value: function initClass() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.inflight = false;
      this.successes = [];
      this.failures = [];
      this.options = options;
    }
  }, {
    key: "enabled",
    value: function enabled() {
      return "geolocation" in navigator;
    }
  }, {
    key: "getCurrentLocation",
    value: function getCurrentLocation(success, failure) {
      var _this = this;

      if (this.cached) {
        return success(this.cached);
      }

      if (success != null) {
        this.successes.push(success);
      }

      if (failure != null) {
        this.failures.push(failure);
      }

      if (this.inflight) {
        return;
      }

      this.inflight = true;
      return this.geolocate(function (latitude, longitude) {
        _this.successes.forEach(function (element) {
          return element(latitude, longitude);
        });

        _this.successes = [];
        _this.failures = [];
        return _this.inflight = false;
      }, function (error) {
        _this.failures.forEach(function (element) {
          return element(error);
        });

        _this.successes = [];
        _this.failures = [];
        return _this.inflight = false;
      });
    }
  }, {
    key: "geolocate",
    value: function geolocate(success, failure) {
      var _this2 = this;

      if (!this.enabled()) {
        if (failure != null) {
          failure(new Error('geolocation is not enabled'));
        }

        return;
      }

      return navigator.geolocation.getCurrentPosition(function (position) {
        _this2.cached = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        if (success != null) {
          return success({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      }, function (error) {
        if (failure != null) {
          return failure(error);
        }
      }, this.options);
    }
  }]);
  return HTML5Geolocation;
}();

exports.HTML5Geolocation = HTML5Geolocation;
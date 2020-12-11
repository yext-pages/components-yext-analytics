"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReverseGeolocation = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var ReverseGeolocation = /*#__PURE__*/function () {
  function ReverseGeolocation() {
    (0, _classCallCheck2.default)(this, ReverseGeolocation);
  }

  (0, _createClass2.default)(ReverseGeolocation, null, [{
    key: "initClass",
    value: function initClass() {
      this.inflight = false;
      this.successes = [];
      this.failures = [];
      this.url = '/geocode-ip';
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

      return $.getJSON(this.url, function (data) {
        _this2.cached = {
          latitude: data.latitude,
          longitude: data.longitude
        };

        if (success != null) {
          return success({
            latitude: data.latitude,
            longitude: data.longitude
          });
        }
      }, function (error) {
        console.log("IP Geolocation Error: Could not hit geocode-ip endpoint. Please ensure config is set up for reverse geocoding.");

        if (failure != null) {
          return failure(error);
        }
      });
    }
  }]);
  return ReverseGeolocation;
}();

exports.ReverseGeolocation = ReverseGeolocation;
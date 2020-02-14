"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoSearchFormBinder = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _Html5Geolocation = require("components-yext-analytics/@yext/components-util/Html5Geolocation.js");

var _SpinnerModal = require("components-yext-analytics/@yext/components-spinner-modal/SpinnerModal.js");

var GeoSearchFormBinder =
/*#__PURE__*/
function () {
  function GeoSearchFormBinder(input, form, submitHandler, spinnerParent) {
    (0, _classCallCheck2.default)(this, GeoSearchFormBinder);
    this.input = input;
    this.form = form;
    this.useSpinner = spinnerParent != undefined;
    this.running = false; // Google's example values

    var geoLocationOptions = {
      "timeout": 5 * 1000,
      "maximumAge": 5 * 60 * 1000
    };

    _Html5Geolocation.HTML5Geolocation.initClass(geoLocationOptions);

    if (typeof submitHandler === 'function') {
      this.submitHandler = submitHandler;
    } else {
      console.warn('the submit handler should be a function, was: ', (0, _typeof2.default)(submitHandler));
    }

    if (this.useSpinner) {
      this.spinner = new _SpinnerModal.SpinnerModal(spinnerParent);
    }
  }

  (0, _createClass2.default)(GeoSearchFormBinder, [{
    key: "fillPosition",
    value: function fillPosition(position) {
      if ('latitude' in position && 'longitude' in position) {
        var query = "".concat(position.latitude, ",").concat(position.longitude);
        this.input.name = 'qp';
        var q = document.createElement('input');
        q.name = 'q';
        q.type = 'hidden';
        q.value = query;
        this.form.appendChild(q);

        if (this.submitHandler) {
          this.submitHandler();
          return;
        } // This will not get fired if you provide a submitHandler function.
        // It's useful because browsers do not fire the 'submit' event when form
        // submits are triggered via javascript.  So if you need to do something
        // with the form before it submits, pass a submitHandler!!!!!!


        this.form.submit();
      }
    }
  }, {
    key: "geolocateAndSearch",
    value: function geolocateAndSearch() {
      if (this.running) return;
      this.running = true;

      if (this.useSpinner) {
        this.spinner.showSpinner();
      }

      this.form.classList.add('js-geolocating');
      document.body.classList.add('js-geolocating');

      _Html5Geolocation.HTML5Geolocation.geolocate(this.geoLocationSuccess.bind(this), this.geoLocationFailure.bind(this));
    }
  }, {
    key: "geoLocationSuccess",
    value: function geoLocationSuccess(position) {
      this.running = false;
      this.fillPosition(position);
    }
  }, {
    key: "geoLocationFailure",
    value: function geoLocationFailure(error) {
      this.running = false;

      if (error.code == error.PERMISSION_DENIED) {
        console.warn(error.message);
      } else {
        alert('Sorry, we could not geolocate you at this time');
      }

      console.error(error);
      Array.from(document.getElementsByClassName('js-geolocating')).forEach(function (element) {
        element.classList.remove('js-geolocating');
      });

      if (this.useSpinner) {
        this.spinner.hideSpinner();
      }
    }
  }]);
  return GeoSearchFormBinder;
}();

exports.GeoSearchFormBinder = GeoSearchFormBinder;
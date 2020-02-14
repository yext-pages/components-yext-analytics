"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MapboxTypeAhead = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _HTML5Geolocation = require("./HTML5Geolocation.js");

var globalIdCounter = 0;

var MapboxTypeAhead =
/*#__PURE__*/
function () {
  (0, _createClass2.default)(MapboxTypeAhead, null, [{
    key: "initAll",
    value: function initAll() {
      Array.from(document.querySelectorAll('.MapboxTypeAhead-parent')).forEach(function (parent) {
        if (!parent.id) {
          console.error('MapboxTypeAhead-parent must have an id', parent);
          return;
        }

        var targetEl = parent.querySelector('.MapboxTypeAhead');

        if (!targetEl || !targetEl.id) {
          console.error('MapboxTypeAhead target must a child of the parent element and have an id', targetEl);
        }

        parent.TypeAhead = new MapboxTypeAhead({
          parentId: parent.id,
          inputId: targetEl.id
        });
      });
    }
  }]);

  function MapboxTypeAhead(options) {
    var _this = this;

    (0, _classCallCheck2.default)(this, MapboxTypeAhead);

    if (!options.parentId || !options.inputId) {
      console.error("you must provide a parentId and inputId", options);
      return;
    }

    Object.assign(this, options);
    this.accessToken = this.accessToken || 'pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw';
    this.decodeMode = this.decodeMode || 'mapbox.places';
    this.globalSearch = this.globalSearch || false;
    this.country = this.country || 'us';
    this.limit = this.limit || 5;
    this.language = this.language || document.documentElement && document.documentElement.lang || 'en';
    this.input = document.getElementById(this.inputId);
    this.input.setAttribute('autocomplete', 'off');
    this.selectOptions = [];
    this.geolocationBias = this.geolocationBias || false;

    if (this.geolocationBias) {
      _HTML5Geolocation.HTML5Geolocation.getCurrentLocation(function (pos) {
        return _this.geoSuccess(pos);
      }, function (error) {
        return _this.geoError(error);
      });
    }

    this.ariaStatusSetup();
    this.appendScript();
    this.setProximityString(null);
  }

  (0, _createClass2.default)(MapboxTypeAhead, [{
    key: "autoCompleteData",
    value: function autoCompleteData() {
      return {
        source: this.selectOptions,
        appendTo: "#".concat(this.parentId),
        classes: {
          'ui-autocomplete': 'autocomplete-styling'
        }
      };
    }
  }, {
    key: "geoSuccess",
    value: function geoSuccess(pos) {
      if (this.geolocationBias) {
        this.setProximityString(pos);
      }
    }
  }, {
    key: "geoError",
    value: function geoError(err) {
      if (this.geolocationBias) {
        console.error(err);
        this.setProximityString(null);
      }
    }
  }, {
    key: "setProximityString",
    value: function setProximityString(pos) {
      this.proximityString = "";
      if (pos && pos.latitude && pos.longitude) this.proximityString = "&proximity=" + pos.latitude + "%2C" + pos.longitude;
    }
  }, {
    key: "checkPolyfill",
    value: function checkPolyfill() {
      this.nativeDatalist = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement);

      if (!this.nativeDatalist) {
        $(this.input).autocomplete(this.autoCompleteData());
      } else {
        this.datalistSetup();
      }
    }
  }, {
    key: "appendScript",
    value: function appendScript() {
      var _this2 = this;

      // GENERATOR TODO: refactor to use singleton to load these scripts and resolve a promise when loaded
      var href = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css';
      var link = document.createElement('link');
      var scriptSrc = 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js';
      link.rel = 'stylesheet';
      link.href = href;
      document.body.appendChild(link);
      $.getScript(scriptSrc, function (data, textStatus, jqxhr) {
        if (jqxhr.status == 200) {
          _this2.constructorCallback();
        }
      });
    }
  }, {
    key: "constructorCallback",
    value: function constructorCallback() {
      this.checkPolyfill();
      var that = this;
      this.input.addEventListener('keyup', function (evt) {
        var queryString = this.value;

        if (queryString.length != 0) {
          if (that.jqxhr && that.jqxhr.readyState != 4) {
            that.jqxhr.abort();
          }

          var apiQuery = "https://api.mapbox.com/geocoding/v5/".concat(that.decodeMode, "/").concat(queryString, ".json?access_token=").concat(that.accessToken, "&language=").concat(that.language, "&limit=").concat(that.limit).concat(that.proximityString);

          if (!that.globalSearch) {
            apiQuery += "&country=".concat(that.country);
          }

          that.jqxhr = $.get(apiQuery).done(function (data) {
            that.setOptions(data);
          }).fail(function () {
            that.pruneOptions();
          });
        }
      });
    }
  }, {
    key: "datalistSetup",
    value: function datalistSetup() {
      this.dataList = document.createElement('datalist');
      this.dataList.id = "mapbox-typeahead-datalist-".concat(++globalIdCounter);
      this.dataList.className = 'mapbox-typeahead';
      this.input.setAttribute('list', this.dataList.id);
      $(this.dataList).insertAfter(this.input);
    }
  }, {
    key: "ariaStatusSetup",
    value: function ariaStatusSetup() {
      this.status = document.createElement('span');
      this.status.id = 'aria-status';
      this.status.className = 'sr-only';
      this.status.setAttribute('aria-live', 'polite');
      this.status.innerHTML = 'Type to begin querying for matching results';
      $(this.status).insertAfter(this.input);
    }
  }, {
    key: "setOptions",
    value: function setOptions(data) {
      var _this3 = this;

      this.pruneOptions();

      if (data && data.features.length) {
        var places = data.features;
        places.forEach(function (place) {
          if (place.place_name) {
            _this3.selectOptions.push(place.place_name);
          }
        });

        if (!this.nativeDatalist) {
          $(this.input).autocomplete(this.autoCompleteData());
        } else {
          if (this.selectOptions.length > 0) {
            this.selectOptions.forEach(function (choice) {
              var option = document.createElement('option');
              option.value = choice;

              _this3.dataList.appendChild(option);
            });
          }
        }
      }

      if (this.selectOptions.length > 1) {
        this.status.innerHTML = "".concat(this.selectOptions.length, " options available. Use up and down arrow keys to navigate.");
      } else if (this.selectOptions.length == 1) {
        this.status.innerHTML = '1 option available. Use up and down arrow keys to navigate.';
      } else {
        this.status.innerHTML = 'No results found for this query.';
      }
    }
  }, {
    key: "pruneOptions",
    value: function pruneOptions() {
      this.selectOptions = [];

      if (!this.nativeDatalist) {
        $(this.input).autocomplete(this.autoCompleteData());
      } else {
        this.dataList.innerHTML = '';
      }
    }
  }]);
  return MapboxTypeAhead;
}();

exports.MapboxTypeAhead = MapboxTypeAhead;
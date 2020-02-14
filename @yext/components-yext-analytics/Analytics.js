"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instance = exports.Analytics = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("@babel/polyfill/noConflict");

var _DelayNavigation = require("./DelayNavigation.js");

var _Helpers = require("./Helpers.js");

var _Utils = require("components-yext-analytics/@yext/components-analytics-debugger/Utils.js");

var _Browser = require("components-yext-analytics/@yext/components-util/Browser.js");

var _slugify = _interopRequireDefault(require("slugify"));

var Analytics =
/*#__PURE__*/
function () {
  // Takes Window as reference for better minification references
  function Analytics(win) {
    var _this = this;

    var eventNameCalculator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _Helpers.CalcEventNameForElement;
    (0, _classCallCheck2.default)(this, Analytics);
    var analyticsQName = win.YextAnalyticsObject || 'ya';
    this._eventNameCalculator = eventNameCalculator;
    this.win = win;
    this.dom = win.document;
    this.set({
      pageurl: win.location.pathname,
      pagesReferrer: win.document.referrer
    });
    this.registeredListeners = {};
    this.StandardEvents = {
      WebsiteClick: 'website',
      DrivingDirections: 'directions',
      MobileCall: 'phone',
      CTAClick: 'cta'
    };
    this.delayNavigation = true;
    this.conversionTrackingEnabled = false;
    this.cookieParam = '_yfpc';
    (0, _Browser.OnReady)(function () {
      // Always observe clicks so we can fire the catch-all interaction events
      _this.registerObserver('click'); // Drain the command queue, if present


      if (win[analyticsQName]) {
        var cq = win[analyticsQName].q || [];

        while (cq.length) {
          var commandArgs = cq.shift();

          _this.processCommand.apply(_this, (0, _toConsumableArray2.default)(commandArgs));
        }
      } // Replace the command queue with a proxy to this instance


      win[analyticsQName] = function () {
        return _this.processCommand.apply(_this, arguments);
      };
    });
  }

  (0, _createClass2.default)(Analytics, [{
    key: "setCalcEventName",
    value: function setCalcEventName(calculator) {
      this._eventNameCalculator = calculator;
    }
  }, {
    key: "CalcEventNameForElement",
    value: function CalcEventNameForElement(target) {
      return this._eventNameCalculator(target);
    }
  }, {
    key: "loaded",
    value: function loaded() {
      return this.siteData.siteId !== undefined && this.siteData.businessids !== undefined;
    }
  }, {
    key: "create",
    value: function create(busId, site, staging) {
      this.set({
        businessids: busId,
        siteId: site,
        isStaging: staging
      });
      return true;
    }
  }, {
    key: "set",
    value: function set(data) {
      this.siteData = Object.assign(this.siteData || {}, data);
    }
  }, {
    key: "setDelayNavigation",
    value: function setDelayNavigation(bool) {
      this.delayNavigation = bool;
    }
  }, {
    key: "setConversionTrackingEnabled",
    value: function setConversionTrackingEnabled(bool) {
      this.conversionTrackingEnabled = bool && !this.doNotTrackEnabled();
    }
  }, {
    key: "pageview",
    value: function pageview() {
      this.send({
        eventType: 'pageview'
      });
    }
  }, {
    key: "click",
    value: function click(opts) {
      this.registerObserverForSelector('click', opts.selector, opts.name);
    }
  }, {
    key: "trackEvent",
    value: function trackEvent(eventName, cb) {
      this.send({
        eventType: eventName
      }, cb);
    } // Internal from here on out!

    /**
     * @return {number} The random number to include as a URL param
     */

  }, {
    key: "_generateRandomCookie",
    value: function _generateRandomCookie() {
      return Math.floor(Math.random() * new Date().getTime());
    }
    /**
     * Stores a cookie on the user's browser with the given value. `Expires` is set to ensure the
     * cookie is persistent, `Samesite=None` so the value can be included in cross-site requests, and
     * `Secure` is required when using `Samesite=None`: https://www.chromestatus.com/feature/5633521622188032
     *
     * @param {string} cookieValue The value to set as the first party cookie
     */

  }, {
    key: "_setCookie",
    value: function _setCookie(cookieValue) {
      var cookieString = this.cookieParam + '=' + cookieValue,
          now = new Date();
      now.setTime(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      cookieString += ';path=/';
      cookieString += ';expires=' + now.toGMTString();
      cookieString += ';samesite=None; Secure ';
      document.cookie = cookieString;
    }
    /**
      * Retrieves the identifier stored as a cookie on the user's browser, if present. Otherwise
      * generates a random number to use.
      *
      * @return {string} The random number to include as a URL param
      */

  }, {
    key: "_cookieValue",
    value: function _cookieValue() {
      var _this2 = this;

      var cookieValue = '';
      document.cookie.split(';').forEach(function (cookie) {
        var keyValue = cookie.split('='),
            key = keyValue[0],
            value = keyValue[1];

        if (key && value && key.trim() === _this2.cookieParam) {
          cookieValue = value.trim();
        }
      });

      if (!cookieValue) {
        cookieValue = this._generateRandomCookie().toString();
      }

      return cookieValue;
    }
  }, {
    key: "once",
    value: function once(task) {
      if (!task) return;
      var invoked = false;
      return function () {
        if (invoked) return;
        invoked = true;
        task();
      };
    }
  }, {
    key: "send",
    value: function send(data, cb) {
      this.fire(this.pixelURL(data), cb);
    }
  }, {
    key: "registerObserverForSelector",
    value: function registerObserverForSelector(eventType, selector, eventName) {
      this.registerObserver(eventType); // GENERATOR TODO: Do we want to be able to track multiple events for the same selector?

      _Helpers.SelectorTracking[selector] = eventName;
    }
  }, {
    key: "registerObserver",
    value: function registerObserver(eventType) {
      if (!this.registeredListeners.hasOwnProperty(eventType)) {
        // this used to call a polyfill at the top of the page that was migrated to
        // the Polyfills Components (test in IE)
        this.dom.body.addEventListener(eventType, this.handleEvent.bind(this));
        this.registeredListeners[eventType] = true;
      }
    }
  }, {
    key: "unRegisterObserver",
    value: function unRegisterObserver(eventType, selector, eventName) {
      if (_Helpers.SelectorTracking.hasOwnProperty(selector)) {
        delete _Helpers.SelectorTracking[selector];
      } // GENERATOR TODO: coordinate remove of selector tracking with unregistering event listener

    }
  }, {
    key: "processCommand",
    value: function processCommand(command) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (arguments.length === 0) {
        throw 'Received Analytics Command with no Arguments';
      }

      if (typeof this[command] === 'function') {
        return this[command].apply(this, args);
      } else {
        throw "Unknown command ".concat(command);
      }
    }
  }, {
    key: "pixelURL",
    value: function pixelURL(optionalData) {
      var combinedData = Object.assign({
        product: 'storepages',
        v: this.seed()
      }, this.siteData, optionalData);

      if (this.conversionTrackingEnabled) {
        var cookieValue = this._cookieValue();

        this._setCookie(cookieValue);

        combinedData[this.cookieParam] = cookieValue;
      }

      if (optionalData.eventType) {
        (0, _Utils.PrintEvent)(optionalData.eventType);
      }

      var analyticsDomain = this.conversionTrackingEnabled ? 'realtimeanalytics.yext.com' : 'www.yext-pixel.com';
      var queryString = Object.entries(combinedData).map(function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return "".concat(key, "=").concat(encodeURIComponent(value));
      }).join('&');
      return "https://".concat(analyticsDomain, "/store_pagespixel?").concat(queryString);
    }
  }, {
    key: "getConversionParams",
    value: function getConversionParams(el) {
      for (var current = el; current !== null; current = current.parentNode) {
        if (!current.dataset) {
          continue;
        }

        if (current.dataset.yaCid) {
          var params = {
            cid: current.dataset.yaCid
          };
          return params;
        }
      }
    } // ported from https://assets.sitescdn.net/ytag/ytag.min.js

  }, {
    key: "conversionURL",
    value: function conversionURL(data) {
      var queryString = Object.entries(data).map(function (_ref3) {
        var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        return "".concat(key, "=").concat(encodeURIComponent(value));
      }).join('&');
      return "https://realtimeanalytics.yext.com/conversiontracking/conversion?".concat(queryString);
    }
  }, {
    key: "seed",
    value: function seed() {
      return Date.now() + Math.floor(1000 * Math.random());
    }
  }, {
    key: "fire",
    value: function fire(pixel, cb) {
      if (!this.loaded()) {
        throw new Error("Attempted to observe fire ".concat(pixel, " on ").concat(event.type, " before initializing Yext.Analytics.SiteData"));
      }

      var px = this.dom.createElement('img');
      px.src = pixel;
      px.style.width = '0';
      px.style.height = '0';
      px.style.position = 'absolute';
      px.alt = '';

      if (cb) {
        // The callback passed to this function should be invoked after the pixel has successfully
        // fired and we're confident the tracking server has received the request.  The most common
        // use of the callback is to navigate the user agent away from the current domain - say, a click
        // on an anchor tag with an off-domain href.  In those situations, we want to 'delay' the
        // actual browser navigation because the act of moving to another domain will cause some
        // user agents to cancel all in-flight network requests that the current page originated,
        // including an image load like the one we use here for analytics transport.
        //
        // That said, it's critical that the callback is _eventually_ invoked since it represents
        // preservation of the user's intent (to navigate away).  `onload` and `onerror` provide
        // most of the coverage we need - the majority of the time the pixel should load in < 100ms,
        // and in the unlikely scenario the pixel server was unavailable the error should happen
        // quickly.  However, there are situations in which the user-agent could connect to the
        // pixel server but listen indefinitely for a response - high load or stuck threads, for
        // example.  The setTimeout(), thereforce, acts as an absolute failsafe.
        //
        // The once wrapper ensures that the cb function is only invoked a single time.
        var onceCB = this.once(cb);
        px.onload = onceCB;
        px.onerror = onceCB;
        setTimeout(onceCB, 1000);
      }

      this.dom.body.appendChild(px);
    }
  }, {
    key: "fireWithEvent",
    value: function fireWithEvent(pixel, event) {
      var _this3 = this;

      if (this.delayNavigation) {
        (0, _DelayNavigation.DelayNavigation)(function (done) {
          return _this3.fire(pixel, done);
        }, event);
      } else {
        this.fire(pixel);
      }
    }
  }, {
    key: "analyticsSlug",
    value: function analyticsSlug(text) {
      return (0, _slugify.default)(text, '_').toLowerCase();
    }
  }, {
    key: "handleConversion",
    value: function handleConversion(event) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var params = _this4.getConversionParams(event.target);

        if (!params) {
          return resolve();
        }

        Object.assign(params, {
          v: Date.now() + Math.floor(1E3 * Math.random())
        });

        var url = _this4.conversionURL(params);

        _this4.fire(url, resolve);
      });
    }
  }, {
    key: "handleEvent",
    value: function () {
      var _handleEvent = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(event) {
        var selector, eventName;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.t0 = _regenerator.default.keys(_Helpers.SelectorTracking);

              case 1:
                if ((_context.t1 = _context.t0()).done) {
                  _context.next = 9;
                  break;
                }

                selector = _context.t1.value;

                if (!_Helpers.SelectorTracking.hasOwnProperty(selector)) {
                  _context.next = 7;
                  break;
                }

                if (!(0, _Helpers.SearchElementForSelector)(event.target, selector)) {
                  _context.next = 7;
                  break;
                }

                this.fireWithEvent(this.pixelURL({
                  eventType: _Helpers.SelectorTracking[selector]
                }), event);
                return _context.abrupt("return");

              case 7:
                _context.next = 1;
                break;

              case 9:
                eventName = this.CalcEventNameForElement(event.target);

                if (eventName) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return");

              case 12:
                if (!this.conversionTrackingEnabled) {
                  _context.next = 15;
                  break;
                }

                _context.next = 15;
                return this.handleConversion(event);

              case 15:
                this.fireWithEvent(this.pixelURL({
                  eventType: eventName
                }), event);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleEvent(_x) {
        return _handleEvent.apply(this, arguments);
      }

      return handleEvent;
    }()
  }, {
    key: "doNotTrackEnabled",
    value: function doNotTrackEnabled() {
      return this.win.doNotTrack == '1' || this.win.navigator.doNotTrack == 'yes' || this.win.navigator.doNotTrack == '1' || this.win.navigator.msDoNotTrack == '1';
    }
  }]);
  return Analytics;
}();

exports.Analytics = Analytics;
var Instance = new Analytics(window);
exports.Instance = Instance;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Instance = exports.Analytics = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("@babel/polyfill/noConflict");

var _DelayNavigation = require("./DelayNavigation.js");

var _Helpers = require("./Helpers.js");

var _Utils = require("components-yext-analytics/@yext/components-analytics-debugger/Utils.js");

var _Browser = require("components-yext-analytics/@yext/components-util/Browser.js");

var _slugify = _interopRequireDefault(require("slugify"));

var conversionDomain = 'realtimeanalytics.yext.com';
var eventDomain = 'www.yext-pixel.com';
var conversionEndpoint = 'conversiontracking/conversion';
var listingsEndpoint = 'listings';
var eventEndpoint = 'store_pagespixel';

var Analytics = /*#__PURE__*/function () {
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
    this.listingsClickFired = false;
    this.CONSTANTS = {
      COOKIE_PARAM: '_yfpc',
      COOKIE_REMOVAL_VALUE: '__temp__' // Only for expired cookies to be removed

    };

    var queryParams = this._getQueryParams();

    this.y_source = queryParams.y_source;

    if ('y_source' in queryParams) {
      // Remove the conversion source param to prevent re-submission on page reload
      delete queryParams.y_source;

      var queryString = this._buildQueryString(queryParams);

      window.history.replaceState(window.history.state, document.title, window.location.pathname + (queryString ? '?' + queryString : ''));
    }

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

      this._fireListingsTagIfShould();
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
    key: "generateRandomCookie_",
    value: function generateRandomCookie_() {
      return Math.floor(Math.random() * new Date().getTime());
    }
    /**
    * Retrieves the identifier stored as a cookie on the user's browser, if present. Otherwise
    * returns empty. This is accomplished by attempting to set a cookie at domains in order of
    * increasing specificity (e.g. ".com", then ".example.com", then ".subdomain.example.com"), and
    * the first one that we can set a cookie in is the root domain. Check if we already have a cookie
    * in the root domain and if not, check if a cookie exists without a domain, for legacy reasons.
    *
    * @private
    * @return {string} The value to include as a URL param, or empty
    */

  }, {
    key: "fetchCookie_",
    value: function fetchCookie_() {
      var _this2 = this;

      var cookieValue = '';

      var checkDomain = function checkDomain(domain) {
        if (_this2.canSetCookieWithDomain_(domain)) {
          var removedValue = _this2.removeCookieByDomain_(domain);

          if (removedValue) {
            // We found and removed a value, so put it back
            cookieValue = removedValue;

            _this2.setCookie_(cookieValue, domain);
          } // Exit the loop once we've reached root domain (the first domain where we can set a cookie)


          return true;
        }
      };

      this.forEachDomainIncreasingSpecificity_(checkDomain); // If no cookie was present in the root domain, check for a cookie that doesn't have a domain
      // specified (by passing an empty string to checkDomain, indicating no domain).

      if (!cookieValue) checkDomain('');
      return cookieValue;
    }
    /**
    * Stores a cookie on the user's browser with the given value and domain, with name COOKIE_PARAM.
    *
    * @private
    * @param {string} cookieValue The value to set as the first party cookie
    * @param {string} cookieDomain The domain in which to set the cookie
    */

  }, {
    key: "setCookie_",
    value: function setCookie_(cookieValue, cookieDomain) {
      var cookieString = this.formatCookie_(this.CONSTANTS.COOKIE_PARAM, cookieValue, cookieDomain);
      this.win.document.cookie = cookieString;
    }
    /**
    * Creates a formatted cookie string given a key, value, domain, and, optionally, a path. 
    * `Expires` is set to ensure the cookie is persistent, `Samesite=None` so the value can be 
    * included in cross-site requests,`Domain` defaults to root domain (if possible) to enable 
    * tracking across subdomains, and `Secure` is required when using 
    * `Samesite=None`: https://www.chromestatus.com/feature/5633521622188032
    * 
    * @private
    * @param {string} cookieName The name of the cookie
    * @param {string} cookieValue The value of the cookie
    * @param {string} domain The domain to set the cookie for
    * @param {string=} path The path to set the cookie for
    * @return {string} A cookie string which can be directly added to a document's cookies
    */

  }, {
    key: "formatCookie_",
    value: function formatCookie_(cookieName, cookieValue, domain) {
      var path = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '/';
      var cookieString = cookieName + '=' + cookieValue,
          now = new Date();
      now.setTime(now.getTime() + 90 * 24 * 60 * 60 * 1000);
      cookieString += ';path=' + path;
      cookieString += ';expires=' + now.toUTCString();
      if (domain) cookieString += ';domain=' + domain;
      cookieString += ';samesite=None;';

      if (this.win.location.protocol === 'https:') {
        cookieString += ' Secure ';
      }

      return cookieString;
    }
    /**
    * Returns whether we are able to set a cookie (formatted like the actual cookie for tracking)
    * at a specified domain or not. Preserves existing cookies in the same domain (but not their
    * expiration dates).
    * 
    * @private
    * @param {string} domain The value for the cookie's domain attribute
    * @return {boolean} Whether a dummy cookie was successfully set with domain set to domain.
    */

  }, {
    key: "canSetCookieWithDomain_",
    value: function canSetCookieWithDomain_(domain) {
      var lostCookie = this.removeCookieByDomain_(domain);
      var existingCookies = this.allCookies_();
      this.setCookie_(this.CONSTANTS.COOKIE_REMOVAL_VALUE, domain);
      var newCookies = this.allCookies_();

      if (existingCookies.length < newCookies.length) {
        // Cookie was successfully saved, so wipe it and put back the old cookie if there was one
        if (lostCookie) {
          this.setCookie_(lostCookie, domain);
        } else {
          this.clearCookie_(domain);
        }

        return true;
      }

      return false;
    }
    /**
    * Sets a cookie with name COOKIE_PARAM to make it expire immediately.
    * 
    * @private
    * @param {string=} cookieDomain The domain of the cookie to clear
    * @param {string=} cookiePath The path of the cookie to be deleted (defaults to '/')
    */

  }, {
    key: "clearCookie_",
    value: function clearCookie_() {
      var cookieDomain = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var cookiePath = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
      var cookieName = this.CONSTANTS.COOKIE_PARAM;
      var epoch = new Date(0);
      var cookieString = cookieName + '=' + this.CONSTANTS.COOKIE_REMOVAL_VALUE;
      cookieString += ';path=' + cookiePath;
      cookieString += ';expires=' + epoch.toUTCString();
      if (cookieDomain) cookieString += ';domain=' + cookieDomain + ';';
      cookieString += ';samesite=None;';

      if (this.win.location.protocol === 'https:') {
        cookieString += ' Secure ';
      }

      this.dom.cookie = cookieString;
    }
    /**
    * Removes a COOKIE_PARAM cookie by domain, then returns its value if successful and empty string
    * otherwise.
    * 
    * @private
    * @param {string} cookieDomain The domain to remove the cookie from
    * @return {string} The value of the cookie, or empty string if not found.
    */

  }, {
    key: "removeCookieByDomain_",
    value: function removeCookieByDomain_(cookieDomain) {
      var prevRemainingCookies = this.persistentCookies_();
      this.clearCookie_(cookieDomain);
      var remainingCookies = this.persistentCookies_();

      if (remainingCookies.length < prevRemainingCookies.length) {
        var removedValue = this.listDifference_(prevRemainingCookies, remainingCookies)[0] || '';
        return removedValue;
      }

      return '';
    } // todo (jalloy) idt this works in IE (?) does that matter ?

    /**
    * Returns the list difference between a superlist and sublist, accounting for number of
    * occurrences.
    * 
    * @private
    * @param {!Array<?>} superlist The full array
    * @param {!Array<?>} sublist The subarray
    * @return {!Array<?>} The elements in superset that are not in subset
    */

  }, {
    key: "listDifference_",
    value: function listDifference_(superlist, sublist) {
      var superlistCopy = Array.from(superlist);

      for (var i = 0; i < sublist.length; i++) {
        var index = superlistCopy.indexOf(sublist[i]);

        if (index !== -1) {
          superlistCopy.splice(index, 1);
        }
      }

      return superlistCopy;
    }
    /**
    * Retrieves a list of values of cookies with the name of COOKIE_PARAM that are present and not 
    * set to be removed (i.e. having the specific value this script uses to indicate a removed
    * cookie).
    * 
    * @private
    * @return {!Array<string>} The non-temporary values associated to COOKIE_PARAM
    */

  }, {
    key: "persistentCookies_",
    value: function persistentCookies_() {
      var _this3 = this;

      return this.allCookies_().filter(function (val) {
        return val !== _this3.CONSTANTS.COOKIE_REMOVAL_VALUE;
      });
    }
    /**
    * Retrieves a list of values of cookies with the name of COOKIE_PARAM that are present.
    * 
    * @private
    * @return {!Array<string>} All values associated to COOKIE_PARAM
    */

  }, {
    key: "allCookies_",
    value: function allCookies_() {
      var cookieName = this.CONSTANTS.COOKIE_PARAM;
      var arr = [];
      this.forEachCookieNameValue_(function (name, value) {
        if (name === cookieName) {
          arr.push(value);
        }
      });
      return arr;
    }
    /**
    * Runs nameValueFunc on each cookie's key and value (after trimming), only if the key and value 
    * are both truthy.
    * 
    * @private
    * @param {function(string, string)} nameValueFunc A function to run on each cookie key-value pair
    */

  }, {
    key: "forEachCookieNameValue_",
    value: function forEachCookieNameValue_(nameValueFunc) {
      this.win.document.cookie.split(';').forEach(function (cookie) {
        var keyValue = cookie.split('='),
            key = keyValue[0],
            value = keyValue[1];

        if (key && value) {
          nameValueFunc(key.trim(), value.trim());
        }
      });
    }
    /**
    * Runs a function on each possible domain in order of increasing specificity (e.g. .com,
    * .example.com, .full.example.com). Note that empty string, indicating unset domain, is iterated
    * through at the end. A truthy return value indicates to break out of the loop.
    * 
    * @private
    * @param {function(string): (boolean|undefined)} func A function to call on each possible domain 
    */

  }, {
    key: "forEachDomainIncreasingSpecificity_",
    value: function forEachDomainIncreasingSpecificity_(func) {
      var exitedLoop = false;
      var domainParts = this.win.location.hostname.split('.').reverse();
      var currDomain = '';

      for (var i = 0; i < domainParts.length; i++) {
        currDomain = '.' + domainParts[i] + currDomain;

        if (func(currDomain)) {
          exitedLoop = true;
          break;
        }
      }

      if (!exitedLoop) func('');
    }
    /**
    * Stores a tracking cookie on the user's browser with the given value in the root domain, and
    * removes first party cookies from all other domains (which may be present for legacy reasons).
    *
    * @private
    * @param {string} cookieValue The value to set as the first party cookie
    */

  }, {
    key: "setCookieAndRemoveOldCookies_",
    value: function setCookieAndRemoveOldCookies_(cookieValue) {
      var _this4 = this;

      var rootDomainReached = false;
      var totalCookies = this.allCookies_().length;
      var numCookiesEncountered = 0; // Iterate until we find the topmost domain (the root domain), where we set the cookie, 
      // then continue iterating, just deleting any cookies we find afterwards.

      this.forEachDomainIncreasingSpecificity_(function (domain) {
        if (rootDomainReached) {
          if (_this4.removeCookieByDomain_(domain)) numCookiesEncountered++;
        } else {
          if (_this4.canSetCookieWithDomain_(domain)) {
            // In root domain, so set cookie
            if (_this4.removeCookieByDomain_(domain)) numCookiesEncountered++;

            _this4.setCookie_(cookieValue, domain);

            rootDomainReached = true;
          }
        }

        if (numCookiesEncountered >= totalCookies && rootDomainReached) {
          // Break if we've already encountered every cookie and we already set one in root domain
          return true;
        }
      });
    }
    /**
      * Fire a listings conversion click event once. This event must not be fired before the user
      * opts in to conversion tracking.
      */

  }, {
    key: "_fireListingsTagIfShould",
    value: function _fireListingsTagIfShould() {
      if (this.listingsClickFired || !this.conversionTrackingEnabled || !this.y_source) {
        return;
      }

      var cookieValue = this.fetchCookie_();

      if (!cookieValue) {
        cookieValue = this.generateRandomCookie_().toString();
      }

      this.setCookieAndRemoveOldCookies_(cookieValue);
      var data = (0, _defineProperty2.default)({
        y_source: this.y_source,
        referrer: document.referrer,
        location: window.location.href
      }, this.CONSTANTS.COOKIE_PARAM, cookieValue);

      var url = this._getTrackerUrl(conversionDomain, listingsEndpoint, data);

      this.fire(url);
      this.listingsClickFired = true;
    }
    /**
     * Build a query string from the given data
     *
     * @param {Object} data The data to be serialized in the query
     * @return {string} The data as a query string, 'key=value' joined by '&'
     */

  }, {
    key: "_buildQueryString",
    value: function _buildQueryString(data) {
      return Object.entries(data).filter(function (_ref) {
        var _ref2 = (0, _slicedToArray2.default)(_ref, 1),
            key = _ref2[0];

        return key;
      }).map(function (_ref3) {
        var _ref4 = (0, _slicedToArray2.default)(_ref3, 2),
            key = _ref4[0],
            value = _ref4[1];

        return (Array.isArray(value) ? value : [value]).map(function (val) {
          return key + '=' + encodeURIComponent(val === undefined ? '' : val);
        }).join('&');
      }).join('&');
    }
    /**
     * Get the URL for an analytics event
     *
     * @param {string} domain The domain of the URL
     * @param {string} endpoint The path after the domain
     * @param {Object} data The data to be serialized in the query
     * @return {string} The full URL
     */

  }, {
    key: "_getTrackerUrl",
    value: function _getTrackerUrl(domain, endpoint, data) {
      var queryString = this._buildQueryString(data);

      return "https://".concat(domain, "/").concat(endpoint, "?").concat(queryString);
    }
    /**
     * Get the URL query parameters from window.location.search
     *
     * @return {Object} The URL parameters
     */

  }, {
    key: "_getQueryParams",
    value: function _getQueryParams() {
      return window.location.search.substring(1).split('&').map(function (param) {
        return param.split('=');
      }).reduce(function (params, _ref5) {
        var _ref6 = (0, _slicedToArray2.default)(_ref5, 2),
            key = _ref6[0],
            value = _ref6[1];

        var decodedVal = value && decodeURIComponent(value);

        if (key in params) {
          if (Array.isArray(params[key])) {
            params[key].push(decodedVal);
          } else {
            params[key] = [params[key], decodedVal];
          }
        } else {
          params[key] = decodedVal;
        }

        return params;
      }, {});
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
        var cookieValue = this.fetchCookie_();

        if (!cookieValue) {
          cookieValue = this.generateRandomCookie_().toString();
        }

        this.setCookieAndRemoveOldCookies_(cookieValue);
        combinedData[this.CONSTANTS.COOKIE_PARAM] = cookieValue;
      }

      if (optionalData.eventType) {
        (0, _Utils.PrintEvent)(optionalData.eventType);
      }

      var analyticsDomain = this.conversionTrackingEnabled ? conversionDomain : eventDomain;
      return this._getTrackerUrl(analyticsDomain, eventEndpoint, combinedData);
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
      return this._getTrackerUrl(conversionDomain, conversionEndpoint, data);
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
      var _this5 = this;

      if (this.delayNavigation) {
        (0, _DelayNavigation.DelayNavigation)(function (done) {
          return _this5.fire(pixel, done);
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
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        var params = _this6.getConversionParams(event.target);

        if (!params) {
          return resolve();
        }

        Object.assign(params, {
          v: Date.now() + Math.floor(1E3 * Math.random())
        });

        var url = _this6.conversionURL(params);

        _this6.fire(url, resolve);
      });
    }
  }, {
    key: "handleEvent",
    value: function () {
      var _handleEvent = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(event) {
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
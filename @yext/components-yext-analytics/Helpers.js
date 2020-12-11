"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetParams = GetParams;
exports.CheckAnchorQueries = CheckAnchorQueries;
exports.SearchElementForSelector = SearchElementForSelector;
exports.CalcEventNameForElement = CalcEventNameForElement;
exports.CalcEventNameMap = CalcEventNameMap;
exports.SelectorTracking = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _Utils = require("components-yext-analytics/@yext/components-analytics-debugger/Utils.js");

var _Analytics = require("./Analytics.js");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var SelectorTracking = {};
exports.SelectorTracking = SelectorTracking;

function GetParams(url) {
  var queries = {};
  var parts = url.split('?');

  if (parts.length == 2) {
    parts[1].split('&').forEach(function (pair) {
      var params = pair.split('=');
      queries[params[0]] = params[1];
    });
  }

  return queries;
}

function CheckAnchorQueries(anchor) {
  if (anchor && anchor.href) {
    var eName = GetParams(anchor.href)['ya-track'];

    if (eName) {
      return eName;
    }
  }

  return false;
}

function SearchElementForSelector(el, s) {
  /* Loop up the DOM tree through parent elements to try to find an element that matches the given selector */
  while (el && el.tagName && !el.matches(s)) {
    el = el.parentNode;
  }

  if (el && el.tagName && el.matches(s)) {
    return el;
  }

  return null;
}

function CalcEventNameForElement(element) {
  var type = null;
  var trackDetails = null;
  var srcEl = null;

  for (var selector in SelectorTracking) {
    if (!element.matches(selector)) continue;
    trackDetails = SelectorTracking[selector];
  }

  if (!trackDetails) {
    var potentialYaTrackedEl = SearchElementForSelector(element, '[data-ya-track]');

    if (potentialYaTrackedEl) {
      srcEl = potentialYaTrackedEl;
      trackDetails = potentialYaTrackedEl.dataset ? potentialYaTrackedEl.dataset.yaTrack : potentialYaTrackedEl.getAttribute('data-ya-track');
    }
  }

  var preventDefaultEvent = SearchElementForSelector(element, '[data-ya-prevent-default]');

  if (!preventDefaultEvent && !trackDetails) {
    var anchor = SearchElementForSelector(element, 'a');

    if (anchor) {
      srcEl = anchor;
      var anchorQuery = CheckAnchorQueries(anchor);
      if (anchorQuery) trackDetails = anchorQuery;

      if (!anchorQuery && !trackDetails) {
        type = 'link';
      }
    }
  }

  if (!preventDefaultEvent && !trackDetails && !type) {
    var button = SearchElementForSelector(element, 'button');

    if (button) {
      srcEl = button;
      type = 'button';
    }
  }

  if (!preventDefaultEvent && !trackDetails && !type) {
    var input = SearchElementForSelector(element, 'input');

    if (input && input.type != 'hidden') {
      srcEl = input;
      type = 'input';
    }
  }

  var dataYaTrack = type || trackDetails;

  if (!dataYaTrack) {
    (0, _Utils.Warn)(element);
    return;
  }

  var scopeAncestors = [];

  while (element && element.tagName) {
    if (element.matches('[data-ya-scope]')) {
      scopeAncestors.push(element);
    }

    element = element.parentNode;
  }

  var tags = [srcEl].concat(scopeAncestors);

  var _iterator = _createForOfIteratorHelper(tags.entries()),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
          hierarchyIdx = _step$value[0],
          hierarchyElement = _step$value[1];

      var tagVal = hierarchyIdx == 0 ? dataYaTrack : hierarchyElement.dataset ? hierarchyElement.dataset.yaScope : hierarchyElement.getAttribute('data-ya-scope');

      if (tagVal.indexOf('#') > -1) {
        var attributeName = hierarchyIdx == 0 ? 'data-ya-track' : 'data-ya-scope';
        var ancestor = hierarchyIdx + 1 < tags.length ? tags[hierarchyIdx + 1] : document;
        var siblings = Array.from(ancestor.querySelectorAll("[".concat(attributeName, "='").concat(tagVal, "']")));

        var _iterator2 = _createForOfIteratorHelper(siblings.entries()),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
                siblingIdx = _step2$value[0],
                sibling = _step2$value[1];

            if (hierarchyElement == sibling) {
              tagVal = tagVal.replace('#', siblingIdx + 1);
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }

      tags[hierarchyIdx] = tagVal;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return tags.reverse().join('_');
}

;
/**
 * Builds a map of all event names on page.
 */

function CalcEventNameMap() {
  var map = new Map();
  var allLinks = Array.from(document.links);
  var allOtherTracked = Array.from(document.querySelectorAll('button, input, select, textarea'));

  var _iterator3 = _createForOfIteratorHelper(allLinks.concat(allOtherTracked)),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var el = _step3.value;
      if (el.tagName.toLowerCase() == 'input' && el.type == 'hidden') continue;

      var name = _Analytics.Instance.CalcEventNameForElement(el);

      if (!name) continue;

      if (!map.has(name)) {
        var container = [];
        map.set(name, container);
      }

      var elements = map.get(name);
      elements.push(el);
      map.set(name, elements);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  return map;
}
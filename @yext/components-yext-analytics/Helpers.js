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

var _Analytics = require("components-yext-analytics/@yext/components-yext-analytics/Analytics.js");

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
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = tags.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
          hierarchyIdx = _step$value[0],
          hierarchyElement = _step$value[1];

      var tagVal = hierarchyIdx == 0 ? dataYaTrack : hierarchyElement.dataset ? hierarchyElement.dataset.yaScope : hierarchyElement.getAttribute('data-ya-scope');

      if (tagVal.indexOf('#') > -1) {
        var attributeName = hierarchyIdx == 0 ? 'data-ya-track' : 'data-ya-scope';
        var ancestor = hierarchyIdx + 1 < tags.length ? tags[hierarchyIdx + 1] : document;
        var siblings = Array.from(ancestor.querySelectorAll("[".concat(attributeName, "='").concat(tagVal, "']")));
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = siblings.entries()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
                siblingIdx = _step2$value[0],
                sibling = _step2$value[1];

            if (hierarchyElement == sibling) {
              tagVal = tagVal.replace('#', siblingIdx + 1);
              break;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      tags[hierarchyIdx] = tagVal;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
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
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = allLinks.concat(allOtherTracked)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return != null) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return map;
}
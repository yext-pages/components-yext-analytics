"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrintEvent = PrintEvent;
exports.PrintEvents = PrintEvents;
exports.Warn = Warn;

var _Debug = require("components-yext-analytics/@yext/components-util/Debug.js");

var _Helpers = require("components-yext-analytics/@yext/components-yext-analytics/Helpers.js");

function PrintEvents() {
  if (!_Debug.Debug.isEnabled()) return;

  for (var _i = 0, _Array$from = Array.from((0, _Helpers.CalcEventNameMap)().keys()); _i < _Array$from.length; _i++) {
    var name = _Array$from[_i];
    console.log(name);
  }
}

function Warn(target) {
  if (!_Debug.Debug.isEnabled()) return;
  console.warn('could not track element', target);
}

function PrintEvent(eventName) {
  if (!_Debug.Debug.isEnabled()) return;
  console.log("%c[YextAnalytics]%c- Fired event: ".concat(eventName), 'color: blue;', 'color: black;');
}
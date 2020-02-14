"use strict";

require("@babel/polyfill/noConflict");

var _Polyfills = require("components-yext-analytics/@yext/components-polyfills/Polyfills.js");

var _Analytics = require("components-yext-analytics/@yext/components-yext-analytics/Analytics.js");

// This file is here so that imports on old sites don't fail. It does nothing on new sites.
_Polyfills.Polyfills.init();

module.exports = function () {
  return _Analytics.Instance;
};
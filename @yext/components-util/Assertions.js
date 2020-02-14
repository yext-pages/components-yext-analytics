"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertType = assertType;
exports.assertInstance = assertInstance;
exports.Type = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var Type = {
  UNDEFINED: 'undefined',
  NULL: 'object',
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#null
  BOOLEAN: 'boolean',
  NUMBER: 'number',
  BIGINT: 'bigint',
  STRING: 'string',
  SYMBOL: 'symbol',
  FUNCTION: 'function',
  OBJECT: 'object'
};
exports.Type = Type;

function assertType(object, type) {
  if (typeof type != 'string') {
    throw new Error('Assertion error: \'type\' must be a string');
  }

  if ((0, _typeof2.default)(object) !== type) {
    throw new Error("Expected an object of type '".concat(type, "'"));
  }
}

function assertInstance(object, instanceClass) {
  try {
    assertType(instanceClass, 'function');
  } catch (err) {
    throw new Error('Assertion error: \'instanceClass\' must be a function');
  }

  if (!(object instanceof instanceClass)) {
    throw new Error("Expected an instance of '".concat(instanceClass.name, "'"));
  }
}
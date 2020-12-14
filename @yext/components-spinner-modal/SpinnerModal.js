"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpinnerModal = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var SpinnerModal = /*#__PURE__*/function () {
  function SpinnerModal() {
    var parentElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    (0, _classCallCheck2.default)(this, SpinnerModal);
    this.parentElement = parentElement;
  }

  (0, _createClass2.default)(SpinnerModal, [{
    key: "showSpinner",
    value: function showSpinner() {
      this.parentElement.classList.add('SpinnerModal-parent');
      this.parentElement.querySelector('.SpinnerModal').classList.add('SpinnerModal--visible');
    }
  }, {
    key: "hideSpinner",
    value: function hideSpinner() {
      this.parentElement.classList.remove('SpinnerModal-parent');
      this.parentElement.querySelector('.SpinnerModal').classList.remove('SpinnerModal--visible');
    }
  }]);
  return SpinnerModal;
}();

exports.SpinnerModal = SpinnerModal;
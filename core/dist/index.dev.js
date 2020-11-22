"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// utils
var FormatTime = function FormatTime(date) {
  return "[ ".concat(date.getDate(), "/").concat(date.getMonth(), "/").concat(date.getFullYear(), " ").concat(date.getHours(), ":").concat(date.getMinutes(), ":").concat(date.getSeconds(), " ]");
};

var Core =
/*#__PURE__*/
function () {
  function Core(selector) {
    _classCallCheck(this, Core);

    this.$root = document.querySelector(selector);
  }

  _createClass(Core, [{
    key: "find",
    value: function find(selector) {
      var $el = this.$root.querySelector(selector);
      return $el;
    }
  }]);

  return Core;
}();

var root = new Core("#root");

var timer = function timer() {
  var timerEl = root.find("#timer");
  var date = new Date();
  var time = FormatTime(date);
  timerEl.innerHTML = time;
  setTimeout(function () {
    timer();
  }, 1000);
};

timer();
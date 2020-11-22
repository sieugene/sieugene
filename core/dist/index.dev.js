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
    this.inputs = [];
    this.$input = null;
  } //DOM


  _createClass(Core, [{
    key: "find",
    value: function find(selector) {
      var $el = this.$root.querySelector(selector);
      return $el;
    }
  }, {
    key: "findAll",
    value: function findAll(selector) {
      var $el = this.$root.querySelectorAll(selector);
      return $el;
    }
  }, {
    key: "toHtml",
    value: function toHtml(el, template) {
      var $el = this.find(el);
      $el.innerHTML = ($el.innerHTML + template).trim();
    } //Input

  }, {
    key: "setInput",
    value: function setInput($el) {
      this.$input = $el;
      $el.addEventListener("input", inputChange);
      $el.addEventListener("keydown", pressKey);
    }
  }, {
    key: "savePrevText",
    value: function savePrevText($el) {
      var input = this.find("[data-input=\"".concat($el.dataset.input, "\"]"));
      input.outerHTML = "<input \n                      type=\"text\" \n                      id=\"command\" \n                      data-input=\"".concat(input.dataset.input, "\" \n                      value=\"").concat($el.value, "\"\n                      disabled=\"true\">\n                      </input>");
      input.value = $el.value;
    }
  }, {
    key: "disableInput",
    value: function disableInput($el) {
      var id = Number($el.dataset.input) + 1;
      $el.removeEventListener("input", inputChange);
      $el.removeEventListener("keydown", pressKey);
      this.$input = null;
      this.addInput(id);
      this.savePrevText($el);
    }
  }, {
    key: "addInput",
    value: function addInput(id) {
      this.toHtml(".terminal-content", InputTemplate(id));
      this.focusOnLast();
      this.disableInputs();
    } //Inputs

  }, {
    key: "setInputs",
    value: function setInputs(inputs) {
      this.inputs = inputs;
    }
  }, {
    key: "disableInputs",
    value: function disableInputs() {
      if (this.inputs && this.inputs.length) {
        var LAST = this.inputs.length - 1;
        this.inputs.forEach(function (element, idx) {
          if (LAST !== idx) {
            element.disabled = true;
          }
        });
      }
    }
  }, {
    key: "focusOnLast",
    value: function focusOnLast() {
      var inputs = this.findAll("#command");
      root.setInputs(inputs);
      var last = inputs[inputs.length - 1];
      last.focus();
      this.setInput(last);
    } //Terminal

  }, {
    key: "terminalEventClick",
    value: function terminalEventClick() {
      var _this = this;

      var terminal = this.find(".terminal");
      terminal.addEventListener("click", function (event) {
        var target = event.target;

        if (target.className === "terminal") {
          _this.focusOnLast.bind(_this)();
        }
      });
    } //Core

  }, {
    key: "init",
    value: function init() {
      this.focusOnLast();
      this.terminalEventClick();
      this.disableInputs();
    }
  }]);

  return Core;
}();

var root = new Core("#root");
root.init();

var timer = function timer() {
  var timerEl = root.find("#timer");
  var date = new Date();
  var time = FormatTime(date);
  timerEl.innerHTML = time;
  setTimeout(function () {
    timer();
  }, 1000);
};

timer(); //event Handlers

function inputChange(event) {}

function pressKey(event) {
  var keys = ["Enter", "Tab"];

  if (keys.includes(event.key)) {
    event.preventDefault();
    root.disableInput(root.$input);
  }
}

var commandInputs = function commandInputs() {
  var input = root.find("[data-input='0']"); // debugger;
}; // commandInputs();
// Templates


var InputTemplate = function InputTemplate(id) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  return "<div class=\"terminal-input\">\n  <div class=\"path cyan\">admin > </div>\n  <input type=\"text\" id=\"command\" data-input=\"".concat(id, "\" value=\"").concat(value, "\">\n</div>");
};
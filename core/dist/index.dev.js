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
    this.$help = null;
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

      if (template && template === "clear" && $el) {
        $el.innerHTML = "";
      } else if ($el) {
        $el.innerHTML = ($el.innerHTML + template).trim();
      }
    }
  }, {
    key: "toOuter",
    value: function toOuter(el, template) {
      var $el = this.find(el);

      if ($el && template) {
        $el.outerHTML = template;
      }
    }
  }, {
    key: "getData",
    value: function getData($el) {
      return $el.dataset;
    } //Input

  }, {
    key: "setInput",
    value: function setInput($el) {
      this.$input = $el;
      $el.addEventListener("input", inputChange);
      $el.addEventListener("keydown", pressKey);
    }
  }, {
    key: "disableInput",
    value: function disableInput($el) {
      var id = Number($el.dataset.input) + 1;
      $el.removeEventListener("input", inputChange);
      $el.removeEventListener("keydown", pressKey);
      this.$input = null;
      this.addInput(id); //сохранение прошлого инпута

      var dataset = "[data-input=\"".concat(this.getData($el).input, "\"]");
      this.toOuter(dataset ? dataset : 0, InputTemplate($el.dataset.input, $el.value, "", true));
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
      var inputs = this.findAll("[data-type='input']");
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
    }
  }, {
    key: "helpEventClicks",
    value: function helpEventClicks() {
      this.clearPrevEventHelp();
      this.$help = this.findAll("[data-type='help']");

      if (this.$help && this.$help.length >= 1) {
        this.$help.forEach(function (element) {
          element.addEventListener("click", helpCommandsClick);
        });
      }
    }
  }, {
    key: "clearPrevEventHelp",
    value: function clearPrevEventHelp() {
      if (this.$help && this.$help.length >= 1) {
        this.$help.forEach(function (element) {
          element.removeEventListener("click", helpCommandsClick);
        });
        this.$help = null;
      }
    } //Core

  }, {
    key: "init",
    value: function init() {
      this.focusOnLast();
      this.terminalEventClick();
      this.disableInputs();
      this.helpEventClicks();
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
  var keys = ["Enter"];
  var autoComplete = ["Tab", "Space"];

  if (keys.includes(event.key)) {
    event.preventDefault();
    root.toHtml(".terminal-content", commandInputs(formatText(root.$input.value)));
    root.disableInput(root.$input);
    root.helpEventClicks();
  } else if (autoComplete.includes(event.code)) {
    event.preventDefault();
    var text = formatText(root.$input.value);
    var match = searchMatches(text);
    root.$input.value = match;
  }
}

function helpCommandsClick(event) {
  var $target = event.target;
  var action = $target.dataset && $target.dataset.action && $target.dataset.action;

  if (action) {
    var emulateEventClick = {
      key: "Enter",
      preventDefault: function preventDefault() {}
    };
    root.$input.value = action;
    pressKey(emulateEventClick);
  }
} //functions


var commandInputs = function commandInputs(command) {
  var template;

  switch (command) {
    case "contacts":
      template = ContactsTemplate();
      break;

    case "clear":
      template = "clear";
      break;

    case "help":
      template = HelpTemplate();
      break;

    case "about":
      template = AboutTemplate();
      break;

    default:
      template = "<div class=\"red\">command not found</div>";
      break;
  }

  return template;
};

var formatText = function formatText(text) {
  if (text && text.length >= 1) {
    return text.toLowerCase().replace(/\s/g, "");
  } else {
    return text;
  }
};

var searchMatches = function searchMatches(text) {
  var arr = ["contacts", "clear", "help", "about"];
  var res = arr.filter(function (el) {
    return el.indexOf(text) > -1;
  });
  return text && text.length >= 1 && res && res.length >= 1 ? res[0] : text;
}; // Templates


var InputTemplate = function InputTemplate(id) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "admin >";
  var disabled = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var disableInput = disabled ? 'disabled' : '';
  return "<div class=\"terminal-input\">\n  <div class=\"path cyan\">".concat(path, "</div>\n  <input type=\"text\" id=\"command").concat(id, "\" data-input=\"").concat(id, "\" value=\"").concat(value && value.length >= 1 ? value : "", "\" data-type=\"input\" ").concat(disableInput, ">\n</div>");
};

var ContactsTemplate = function ContactsTemplate() {
  return "<div class=\"group-btns\">\n  <button>\n    <a href=\"https://github.com/sieugene\" target=\"_blank\"\n      >Github</a\n    >\n  </button>\n  <button>\n    <a\n      href=\"https://www.linkedin.com/in/sieugene/\"\n      target=\"_blank\"\n      >LinkedIn</a\n    >\n  </button>\n</div>";
};

var HelpTemplate = function HelpTemplate() {
  return "\n  <div class=\"help\" data-type=\"help\">\n  <ul>\n    <li class=\"purple\" data-action=\"about\">about</li>\n    <li class=\"purple\" data-action=\"contacts\">contacts</li>\n    <li class=\"purple\" data-action=\"clear\">clear</li>\n  </ul>\n  <ul>\n    <li class=\"cyan\" data-action=\"about\">information about me</li>\n    <li class=\"cyan\" data-action=\"contacts\">my contacts</li>\n    <li class=\"cyan\" data-action=\"clear\">clearing the terminal</li>\n  </ul>\n</div>\n  ";
};

var AboutTemplate = function AboutTemplate() {
  return "\n  <div class=\"info\">\n  Welcome to my website. My name is Eugene, I am a frontend\n  developer. The site is currently being developed, and the\n  content will appear in the future\n</div>\n  ";
};
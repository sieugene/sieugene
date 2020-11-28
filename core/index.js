// utils
const FormatTime = (date) => {
  return `[ ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ]`;
};

class Core {
  constructor(selector) {
    this.$root = document.querySelector(selector);
    this.inputs = [];
    this.$input = null;
    this.$help = null;
  }
  //DOM
  find(selector) {
    const $el = this.$root.querySelector(selector);
    return $el;
  }
  findAll(selector) {
    const $el = this.$root.querySelectorAll(selector);
    return $el;
  }
  toHtml(el, template) {
    let $el = this.find(el);
    if (template && template === "clear" && $el) {
      $el.innerHTML = "";
    } else if ($el) {
      $el.innerHTML = ($el.innerHTML + template).trim();
    }
  }
  toOuter(el, template) {
    let $el = this.find(el);
    if ($el && template) {
      $el.outerHTML = template;
    }
  }
  getData($el) {
    return $el.dataset;
  }
  //Input
  setInput($el) {
    this.$input = $el;
    $el.addEventListener("input", inputChange);
    $el.addEventListener("keydown", pressKey);
  }
  disableInput($el) {
    const id = Number($el.dataset.input) + 1;
    $el.removeEventListener("input", inputChange);
    $el.removeEventListener("keydown", pressKey);
    this.$input = null;
    this.addInput(id);
    //сохранение прошлого инпута
    const dataset = `[data-input="${this.getData($el).input}"]`;
    this.toOuter(
      dataset ? dataset : 0,
      InputTemplate($el.dataset.input, $el.value, "",true)
    );
  }
  addInput(id) {
    this.toHtml(".terminal-content", InputTemplate(id));
    this.focusOnLast();
    this.disableInputs();
  }
  //Inputs
  setInputs(inputs) {
    this.inputs = inputs;
  }
  disableInputs() {
    if (this.inputs && this.inputs.length) {
      const LAST = this.inputs.length - 1;
      this.inputs.forEach((element, idx) => {
        if (LAST !== idx) {
          element.disabled = true;
        }
      });
    }
  }
  focusOnLast() {
    const inputs = this.findAll("[data-type='input']");
    root.setInputs(inputs);
    const last = inputs[inputs.length - 1];
    last.focus();
    this.setInput(last);
  }
  //Terminal
  terminalEventClick() {
    const terminal = this.find(".terminal");
    terminal.addEventListener("click", (event) => {
      const target = event.target;
      if (target.className === "terminal") {
        this.focusOnLast.bind(this)();
      }
    });
  }
  helpEventClicks() {
    this.clearPrevEventHelp();

    this.$help = this.findAll("[data-type='help']");
    if (this.$help && this.$help.length >= 1) {
      this.$help.forEach((element) => {
        element.addEventListener("click", helpCommandsClick);
      });
    }
  }
  clearPrevEventHelp() {
    if (this.$help && this.$help.length >= 1) {
      this.$help.forEach((element) => {
        element.removeEventListener("click", helpCommandsClick);
      });
      this.$help = null;
    }
  }
  //Core
  init() {
    this.focusOnLast();
    this.terminalEventClick();
    this.disableInputs();
    this.helpEventClicks();
  }
}

const root = new Core("#root");
root.init();

const timer = () => {
  const timerEl = root.find("#timer");
  let date = new Date();
  const time = FormatTime(date);
  timerEl.innerHTML = time;
  setTimeout(() => {
    timer();
  }, 1000);
};
timer();

//event Handlers
function inputChange(event) {}
function pressKey(event) {
  const keys = ["Enter"];
  const autoComplete = ["Tab", "Space"];
  if (keys.includes(event.key)) {
    event.preventDefault();
    root.toHtml(
      ".terminal-content",
      commandInputs(formatText(root.$input.value))
    );
    root.disableInput(root.$input);
    root.helpEventClicks();
  } else if (autoComplete.includes(event.code)) {
    event.preventDefault();
    const text = formatText(root.$input.value);
    const match = searchMatches(text);
    root.$input.value = match;
  }
}
function helpCommandsClick(event) {
  const $target = event.target;
  const action =
    $target.dataset && $target.dataset.action && $target.dataset.action;
  if (action) {
    const emulateEventClick = {
      key: "Enter",
      preventDefault: () => {},
    };
    root.$input.value = action;
    pressKey(emulateEventClick);
  }
}
//functions
const commandInputs = (command) => {
  let template;
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
      template = `<div class="red">command not found</div>`;
      break;
  }
  return template;
};
const formatText = (text) => {
  if (text && text.length >= 1) {
    return text.toLowerCase().replace(/\s/g, "");
  } else {
    return text;
  }
};
const searchMatches = (text) => {
  let arr = ["contacts", "clear", "help", "about"];
  let res = arr.filter(function (el) {
    return el.indexOf(text) > -1;
  });
  return text && text.length >= 1 && res && res.length >= 1 ? res[0] : text;
};
// Templates
const InputTemplate = (id, value = "", path = "admin >",disabled = false) => {
  const disableInput = disabled ? 'disabled' : ''
  return `<div class="terminal-input">
  <div class="path cyan">${path}</div>
  <input type="text" id="command${id}" data-input="${id}" value="${
    value && value.length >= 1 ? value : ""
  }" data-type="input" ${disableInput}>
</div>`;
};

const ContactsTemplate = () => {
  return `<div class="group-btns">
  <button>
    <a href="https://github.com/sieugene" target="_blank"
      >Github</a
    >
  </button>
  <button>
    <a
      href="https://www.linkedin.com/in/sieugene/"
      target="_blank"
      >LinkedIn</a
    >
  </button>
</div>`;
};

const HelpTemplate = () => {
  return `
  <div class="help" data-type="help">
  <ul>
    <li class="purple" data-action="about">about</li>
    <li class="purple" data-action="contacts">contacts</li>
    <li class="purple" data-action="clear">clear</li>
  </ul>
  <ul>
    <li class="cyan" data-action="about">information about me</li>
    <li class="cyan" data-action="contacts">my contacts</li>
    <li class="cyan" data-action="clear">clearing the terminal</li>
  </ul>
</div>
  `;
};

const AboutTemplate = () => {
  return `
  <div class="info">
  Welcome to my website. My name is Eugene, I am a frontend
  developer. The site is currently being developed, and the
  content will appear in the future
</div>
  `;
};

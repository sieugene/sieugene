// utils
const FormatTime = (date) => {
  return `[ ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ]`;
};

class Core {
  constructor(selector) {
    this.$root = document.querySelector(selector);
    this.inputs = [];
    this.$input = null;
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
  //Input
  setInput($el) {
    this.$input = $el;
    $el.addEventListener("input", inputChange);
    $el.addEventListener("keydown", pressKey);
  }
  savePrevText($el) {
    const dataset = $el.dataset ? $el.dataset.input && $el.dataset.input : 0;
    let input = this.find(`[data-input="${dataset}"]`);
    if (input) {
      input.outerHTML = `<input 
      type="text" 
      id="command" 
      data-input="${dataset}" 
      value="${$el.value}"
      disabled="true">
      </input>`;
      input.value = $el.value;
    }
  }
  disableInput($el) {
    const id = Number($el.dataset.input) + 1;

    $el.removeEventListener("input", inputChange);
    $el.removeEventListener("keydown", pressKey);
    this.$input = null;
    this.addInput(id);
    this.savePrevText($el);
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
  //Core
  init() {
    this.focusOnLast();
    this.terminalEventClick();
    this.disableInputs();
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
  const keys = ["Enter", "Tab"];
  if (keys.includes(event.key)) {
    event.preventDefault();
    root.toHtml(".terminal-content", commandInputs(root.$input.value));
    root.disableInput(root.$input);
  }
}

const commandInputs = (command) => {
  let template;
  if (command && command.length >= 1) {
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
      default:
        template = `<div class="red">command not found</div>`;
        break;
    }
  }
  return template;
};
// Templates
const InputTemplate = (id, value = "") => {
  return `<div class="terminal-input">
  <div class="path cyan">admin > </div>
  <input type="text" id="command${id}" data-input="${id}" value="${value}" data-type="input">
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
  return `<div class="help">
  <ul>
    <li>about</li>
    <li>contacts</li>
    <li>clear</li>
  </ul>
</div>`;
};

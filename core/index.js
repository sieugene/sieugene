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
    $el.innerHTML = ($el.innerHTML + template).trim();
  }
  //Input
  setInput($el) {
    this.$input = $el;
    $el.addEventListener("input", inputChange);
    $el.addEventListener("keydown", pressKey);
  }
  savePrevText($el) {
    let input = this.find(`[data-input="${$el.dataset.input}"]`);
    input.outerHTML = `<input 
                      type="text" 
                      id="command" 
                      data-input="${input.dataset.input}" 
                      value="${$el.value}"
                      disabled="true">
                      </input>`;
    input.value = $el.value;
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
    const inputs = this.findAll("#command");
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
    root.disableInput(root.$input);
  }
}
const commandInputs = () => {
  const input = root.find("[data-input='0']");
  // debugger;
};
// commandInputs();

// Templates
const InputTemplate = (id, value = "") => {
  return `<div class="terminal-input">
  <div class="path cyan">admin > </div>
  <input type="text" id="command" data-input="${id}" value="${value}">
</div>`;
};

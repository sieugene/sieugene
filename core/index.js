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
    this.$theme = localStorage.getItem("theme");
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
  addClass($el, className) {
    $el.classList.add(className);
  }
  removeClass($el, className) {
    $el.classList.remove(className);
  }
  //Input
  setInput($el) {
    this.$input = $el;
    $el.addEventListener("keypress", inputChange);
    $el.addEventListener("keydown", pressKey);
  }
  disableInput($el) {
    const id = Number($el.dataset.input) + 1;
    $el.removeEventListener("keypress", inputChange);
    $el.removeEventListener("keydown", pressKey);
    this.$input = null;
    this.addInput(id);
    //сохранение прошлого инпута
    const dataset = `[data-input="${this.getData($el).input}"]`;
    this.toOuter(
      dataset ? dataset : 0,
      InputTemplate($el.dataset.input, $el.value, "", true)
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
    this.$terminal = terminal;
    this.$terminal.addEventListener("click", (event) => {
      const target = event.target;
      if (
        target.classList &&
        target.classList.length &&
        target.classList[0] === "terminal"
      ) {
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
  initTheme() {
    if (!this.$theme) {
      localStorage.setItem("theme", "dark");
      this.changeTheme("dark");
    } else {
      this.changeTheme(this.$theme);
    }
  }
  changeTheme(theme) {
    if (theme === "white") {
      this.removeClass(this.$terminal, "dark");
      this.addClass(this.$terminal, theme);
      this.$theme = theme;
      localStorage.setItem("theme", theme);
    } else {
      this.removeClass(root.$terminal, "white");
      this.addClass(root.$terminal, theme);
      this.$theme = theme;
      localStorage.setItem("theme", theme);
    }
  }
  //Core
  init() {
    this.focusOnLast();
    this.terminalEventClick();
    this.initTheme();
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
function inputChange(event) {
  const debug = document.querySelector(".debug");

  console.log(event.which);
  const html = () => {
    return `<div>
      which: ${event.which}
      <br/>
      charCode ${event.charCode}
      <br/>
      KeyG ${event.KeyG}
      <br/>
      key ${event.key}
      <br/>
      keyCode ${event.keyCode}
      <br/>
      metaKey ${event.metaKey}
    </div>`;
  };

  debug.innerHTML = html();
}
function supportSpace(event) {
  //Unidentified - for android
  const keySpace = [32];
  var keyCode =
    event &&
    event.target &&
    event.target.value &&
    event.target.value.charAt(event.target.selectionStart - 1).charCodeAt();
  const condition =
    keySpace.includes(event.which) || keySpace.includes(keyCode);
  if (condition) {
    return true;
  } else {
    return false;
  }
}
function pressKey(event) {
  const keys = ["enter", 13];
  const autoComplete = ["tab", "space", " ", 32];
  const enterCondition =
    keys.includes(event.code.toLowerCase()) ||
    keys.includes(event.which) ||
    keys.includes(event.key);
  const spaceCondition =
    autoComplete.includes(event.code.toLowerCase()) ||
    autoComplete.includes(event.key.toLowerCase()) ||
    supportSpace(event);

  if (enterCondition) {
    event.preventDefault();
    root.toHtml(
      ".terminal-content",
      commandInputs(formatText(root.$input.value))
    );
    root.disableInput(root.$input);
    root.helpEventClicks();
  } else if (spaceCondition) {
    event.preventDefault();
    const text = formatText(root.$input.value);
    const match = searchMatches(text);
    root.$input.value = match;
  }
}
function helpCommandsClick(event) {
  const emulateEventClick = {
    key: "Enter",
    code: "Enter",
    preventDefault: () => {},
  };
  const $target = event.target;
  const action =
    $target.dataset && $target.dataset.action && $target.dataset.action;
  if (action !== "theme") {
    root.$input.value = action;
    pressKey(emulateEventClick);
  } else {
    const theme = root.$theme === "dark" ? "white" : "dark";
    root.$input.value = `${action}=${theme}`;
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
    case "theme=white":
      root.changeTheme("white");
      template = `<div class="command-text lighten-purple">theme switched to light</div>`;
      break;
    case "theme=dark":
      root.changeTheme("dark");
      template = `<div class="command-text lighten-purple">theme switched to dark</div>`;
      break;
    case "theme":
    case "theme=":
      template = `<div class="command-text red">specify dark or white</div>`;
      break;
    default:
      template = `<div class="command-text red">command not found</div>`;
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
  let arr = ["contacts", "clear", "help", "about", "theme="];
  let res = arr.filter(function (el) {
    return el.indexOf(text) > -1;
  });
  return text && text.length >= 1 && res && res.length >= 1 ? res[0] : text;
};
// Templates
const InputTemplate = (id, value = "", path = "admin >", disabled = false) => {
  const disableInput = disabled ? "disabled" : "";
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
  <button>
  <a
    href="mailto:sieugene@mail.ru"
    >Mail</a
  >
</button>
</div>`;
};

const HelpTemplate = () => {
  return `
  <div class="help" data-type="help">
  <div class="help-text" class="purple" data-action="help">
    <div class="purple name-help" data-action="help">
      help
    </div>
    <div class="cyan desc-help" data-action="help">
      help information
    </div>
  </div>
  <div class="help-text" class="purple" data-action="about">
    <div class="purple name-help" data-action="about">
      about
    </div>
    <div class="cyan desc-help" data-action="about">
      information about me
    </div>
  </div>
  <div class="help-text" class="purple" data-action="contacts">
    <div class="purple name-help" data-action="contacts">
      contacts
    </div>
    <div class="cyan desc-help" data-action="contacts">
      my contacts
    </div>
  </div>
  <div class="help-text" class="purple" data-action="clear">
    <div class="purple name-help" data-action="clear">
      clear
    </div>
    <div class="cyan desc-help" data-action="clear">
      clearing the terminal
    </div>
  </div>
  <div class="help-text" class="purple" data-action="theme">
    <div class="purple name-help" data-action="theme">
      theme
    </div>
    <div class="cyan desc-help" data-action="theme">
      changes the subject of the terminal, an example of the theme=dark ; theme=white
    </div>
  </div>
</div>
  `;
};

const AboutTemplate = () => {
  return `
  <div class="info">
  My name is Eugene, I am a frontend developer, the main stack of react redux.
</div>
  `;
};

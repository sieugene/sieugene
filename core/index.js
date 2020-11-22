// utils
const FormatTime = (date) => {
  return `[ ${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ]`;
};

class Core {
  constructor(selector) {
    this.$root = document.querySelector(selector);
  }
  find(selector) {
    const $el = this.$root.querySelector(selector);
    return $el;
  }
}

const root = new Core("#root");

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

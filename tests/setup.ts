import "@testing-library/jest-dom/vitest";

HTMLDialogElement.prototype.showModal ??= function showModal() {
  this.setAttribute("open", "");
};

HTMLDialogElement.prototype.close ??= function close() {
  this.removeAttribute("open");
};

Object.defineProperty(HTMLDialogElement.prototype, "open", {
  get() {
    return this.hasAttribute("open");
  },
  set(value: boolean) {
    if (value) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  },
});

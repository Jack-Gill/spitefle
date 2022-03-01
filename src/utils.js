export const canCopy = () =>
  !!(global.document && global.document.queryCommandSupported("copy"));

export const createElementToCopyFrom = (text) => {
  if (!global.document) return null;

  const span = global.document.createElement("span");
  span.textContent = text;
  span.style.all = "unset";
  span.style.position = "fixed";
  span.style.top = 0;
  span.style.clip = "rect(0, 0, 0, 0)";
  span.style.whiteSpace = "pre";
  span.style.webkitUserSelect = "text";
  span.style.MozUserSelect = "text";
  span.style.msUserSelect = "text";
  span.style.userSelect = "text";
  span.addEventListener("copy", (event) => {
    event.stopPropagation();
  });

  return span;
};

export const copyFromElement = (el) => {
  if (!canCopy()) return false;

  const selection = global.document.getSelection();

  // Reset the current state of selection/focus
  el.blur();
  selection.removeAllRanges();

  const range = global.document.createRange();
  global.document.body.appendChild(el);
  range.selectNodeContents(el);
  selection.addRange(range);
  global.document.execCommand("copy");

  return true;
};

export const cleanUpElement = (el) => {
  if (!canCopy()) return false;

  const selection = global.document.getSelection();
  selection.removeAllRanges();
  global.document.body.removeChild(el);

  return true;
};

export const copy = (text) => {
  if (!canCopy()) return false;

  // Create a temporary element to copy text from and copy the text
  // The text is now on the users' clipboard (if supported)
  const el = createElementToCopyFrom(text);
  copyFromElement(el);

  // Remove that element and clear the selection
  cleanUpElement(el);

  return true;
};

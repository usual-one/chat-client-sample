export function createElement(tag, classTokens = [], attributes = null) {
  const element = document.createElement(tag);

  for (const token of classTokens) {
    element.classList.add(token);
  }

  if (!attributes) return element;
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }

  return element;
}

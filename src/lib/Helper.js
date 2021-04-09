function setAttributes (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key])
    el.setAttribute('autocomplete', 'off')
  }
}

function createDomElement (field) {
  const el = document.createElement(field.type)
  setAttributes(el, field.attributes)
  return el
}

function addDomElement (container, el) {
  container.appendChild(el)
}

export { setAttributes, createDomElement, addDomElement }

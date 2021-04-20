function isRequired (field) {
  if (field.rules) {
    if (field.rules.length > 0) {
      return true
    }
  }
  return false
}

function isArray (arr) {
  return Array.isArray(arr)
}

function setAttributes (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key])
    el.setAttribute('autocomplete', 'off')
  }
}

function createDomElement (field) {
  const wrapper = document.createElement('div')
  const el = document.createElement(field.type)
  setAttributes(el, field.attributes)
  wrapper.appendChild(el)
  return wrapper
}

function addDomElement (container, el) {
  container.appendChild(el)
}

function getDefaultMessageError (messages, rule) {
  const rules = {
    required: 'This field is required',
    min: 'This field must be more characters long',
    max: 'This field must be more characters long',
    between: 'This field must be between values defined',
    equal: 'This field must be equal to value defined',
    email: 'This email format is not valid',
    types: 'Must to allowed file types',
    maxsize: 'This file has size more than max size',
    custom_rule: 'Error'
  }

  // Get error message by rule.
  let message = ''
  if (messages && messages[rule]) {
    message += messages[rule] ? messages[rule] : rules['custom_rule']
  } else {
    message += rules[rule] ? rules[rule] : rules['custom_rule']
  }
  return message
}

function scanValue (type, value) {
  let typeOfNumber = ['number', 'range']
  let newVal = null
  if (value) {
    newVal = typeOfNumber.includes(type) ? parseInt(value) : value
  }
  return newVal
}

async function preprocessField (field, fields, values) {
  const fnc = field.preprocess
  field = await fnc.call(null, field, fields, values)
  return field
};

export {
  setAttributes,
  createDomElement,
  addDomElement,
  getDefaultMessageError,
  isArray,
  isRequired,
  preprocessField,
  scanValue
}

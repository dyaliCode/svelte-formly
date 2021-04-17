import { afterUpdate, onMount } from 'svelte'
import { writable, get } from 'svelte/store'
import { valuesForm } from '../lib/stores'
import * as coreRules from './rules'

/**
 * Validation fields.
 * @param {object fields to validate} fields
 * @param {default fields with config} storeValues
 */
export async function validateFields (fnc, storeValues) {
  let fields = fnc.call()
  let valid = true
  let values = {}

  // console.log(`fields`, fields)

  Object.keys(fields).map(async key => {
    let field = fields[key]

    if (field.rules) {
      const statusObjField = validate(field)
      fields[field.name] = { ...fields[key], ...statusObjField }
      if (statusObjField.validation.errors.length > 0) {
        valid = false
      }
    }

    const fieldName = field.name
    const fieldValue = field.value

    values = { ...values, [fieldName]: fieldValue }
  })

  // fields = { ...fields, values, valid }
  // storeValues.set({
  //   fields,
  //   values,
  //   valid
  // })
  fields = { ...fields, values, valid }
  storeValues.set(fields)
}

/**
 * Validate field by rule.
 * @param {configs field} field
 */
export function validate (field) {
  const { value, rules } = field
  let valid = true
  let rule
  let errors = []

  rules.map(validator => {
    // For file type.
    if (validator === 'file') {
      if (value) {
        Object.keys(value).map(i => {
          Object.keys(field.file).map(r => {
            valid = rules[r].call(null, value[i], field.file[r])
            if (!valid) {
              errors = [...errors, r]
            }
          })
        })
      }
    } else {
      // For custom rule.
      if (typeof validator === 'function') {
        valid = validator.call()
        rule = validator.name
      } else {
        const args = validator.split(/:/g)
        rule = args.shift()
        valid = coreRules[rule].call(null, value, args)
      }
      if (!valid) {
        errors = [...errors, rule]
      }
    }
  })

  return { ...field, validation: { errors, dirty: errors.length > 0 } }
}

/**
 * Validate fields form and store status.
 * @param {object fields to validate} fn
 */
export function validator (fn) {
  const storeValues = writable({ fields: [], value: {}, valid: true })
  onMount(() => validateFields(fn, storeValues))
  afterUpdate(() => validateFields(fn, storeValues))
  return storeValues
}

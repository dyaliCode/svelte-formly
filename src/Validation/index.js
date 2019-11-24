import { afterUpdate } from "svelte";
import { writable, get } from "svelte/store";
import * as rules from "./rules";

/**
 * Validation fields.
 * @param {object fields to validate} fn
 * @param {default fields with config} storeValues
 */
function validateFields(fn, storeValues) {
  let fields = fn.call();
  let $storeValue = get(storeValues);

  Object.keys(fields).map(key => {
    const field = fields[key];
    if (field.validators) {
      const statusObjField = validate(field);
      console.log(key, statusObjField);
      fields[key] = { ...fields[key], ...statusObjField };
      if (statusObjField.validation.errors.length > 0) {
        $storeValue.valid = false;
      }
    } else {
      fields[key] = {
        ...fields[key],
        validation: { errors: [], dirty: false }
      };
    }
  });

  fields = { ...fields, valid: $storeValue.valid };
  storeValues.set(fields);
}

/**
 * Validate field by rule.
 * @param {configs field} field
 */
function validate(field) {
  const { value, validators } = field;
  let valid = true;
  let rule;
  let errors = [];

  validators.map(validator => {
    const args = validator.split(/:/g);
    rule = args.shift();
    valid = rules[rule].call(null, value, args);
    console.log(rule, valid);
    if (!valid) {
      errors = [...errors, rule];
    }
  });

  return { ...field, validation: { errors, dirty: errors.length > 0 } };
}

/**
 * Validate fields form and store status.
 * @param {object fields to validate} fn
 */
export function validator(fn) {
  const storeValues = writable({ valid: true });
  // validateFields(fn, storeValues);
  afterUpdate(() => validateFields(fn, storeValues));
  return storeValues;
}

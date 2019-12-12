import { afterUpdate } from "svelte";
import { writable } from "svelte/store";
import * as rules from "./rules";

/**
 * Validation fields.
 * @param {object fields to validate} fn
 * @param {default fields with config} storeValues
 */
function validateFields(fn, storeValues) {
  let fields = fn.call();
  let valid = true;
  Object.keys(fields).map(key => {
    const field = fields[key];
    if (field.validators) {
      const statusObjField = validate(field);
      fields[key] = { ...fields[key], ...statusObjField };
      if (statusObjField.validation.errors.length > 0) {
        valid = false;
      }
    } else {
      fields[key] = {
        ...fields[key],
        validation: { errors: [], dirty: false }
      };
    }
  });

  fields = { ...fields, valid };
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
    // For file type.
    if (validator === "file") {
      if (value) {
        Object.keys(value).map(i => {
          Object.keys(field.file).map(r => {
            valid = rules[r].call(null, value[i], field.file[r]);
            if (!valid) {
              errors = [...errors, r];
            }
          });
        });
      }
    } else {
      // For custom rule.
      if (typeof validator === "function") {
        valid = validator.call();
        rule = validator.name;
      } else {
        const args = validator.split(/:/g);
        rule = args.shift();
        valid = rules[rule].call(null, value, args);
      }
      if (!valid) {
        errors = [...errors, rule];
      }
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
  afterUpdate(() => validateFields(fn, storeValues));
  return storeValues;
}

import { writable } from 'svelte/store'

export const storeValues = writable({
  valid: true
})
export const currentFieldStore = writable(null)
export const valuesForm = writable({
  valid: true,
  values: {}
})
export const fieldsStore = writable([])
export const values_form = writable([])
export const fields_store = writable([])
export const form = writable(null)
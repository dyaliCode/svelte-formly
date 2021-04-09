import { writable } from 'svelte/store'

export const valuesForm = writable({
  isValidForm: true,
  values: {}
})

export const settingStore = writable({
  style: null
})

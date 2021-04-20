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

export const settingStore = writable({
  style: null
})

export const alertsStore = writable([])

export const testStore = writable([])

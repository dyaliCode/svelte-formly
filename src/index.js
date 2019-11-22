// import Component from './Component.svelte'

// const target = document.createElement('div')
// document.body.appendChild(target)

// new Component({
//   target,
//   props: {}
// })

import Field from "./Components/Field.svelte";
import { valuesForm } from "./Components/stores";
import { form, bindClass } from "./Validation";

export { Field, valuesForm, form, bindClass };
export const formly = { Field, valuesForm, form, bindClass };

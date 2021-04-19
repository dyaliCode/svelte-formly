<script>
  import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
  import clsx from 'clsx';

  // Declar variables.
  export let type = 'text';
  export let id = '';
  export let name = '';
  export let value = '';
  export let classe = '';
  export let min = null;
  export let max = null;
  export let step = null;
  export let autocomplete = 'off';
  export let placeholder = null;
  export let required = null;
  export let disabled = null;
  export let readonly = null;

  let typeOfNumber = ['number', 'range'];

  const dispatch = createEventDispatcher();
  let defaulClasses = null;

  // Change value field.
  function onChangerValue(event) {
    dispatch('changeValue', {
      name: name,
      value: scanValue(event.target.value),
    });
  }

  function scanValue(value) {
    let newVal = null;
    if (value) {
      newVal = typeOfNumber.includes(type) ? parseInt(value) : value;
    }
    return newVal;
  }

  afterUpdate(() => {
    value = value ? value : null;
  });
</script>

<input
  {type}
  {id}
  {name}
  {value}
  class={clsx(classe, defaulClasses)}
  {placeholder}
  {required}
  {disabled}
  {readonly}
  {min}
  {max}
  {step}
  {autocomplete}
  on:input={onChangerValue}
/>

<script>
  import { createEventDispatcher } from 'svelte';
  import clsx from 'clsx';

  import { scanValue } from '../lib/helpers';

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

  const dispatch = createEventDispatcher();
  let defaulClasses = null;

  // Change value field.
  function onChangerValue(event) {
    dispatch('changeValue', {
      name: name,
      value: scanValue(type, event.target.value),
    });
  }
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

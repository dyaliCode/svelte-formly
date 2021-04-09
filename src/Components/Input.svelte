<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import clsx from 'clsx';
  import { settingStore } from './stores.js';

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
      value: event.target.value,
    });
  }

  onMount(() => {
    // Added default classes by style type.
    settingStore.subscribe((data) => {
      if (data.style) {
        defaulClasses = data.style === 'bootstrap' ? 'form-control' : '';
      }
    });

    // Insert default values.
    type = type === 'datetimelocal' ? 'datetime-local' : type;
    value = type === 'range' ? (value = min) : value;
    dispatch('changeValue', {
      name,
      value,
    });
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

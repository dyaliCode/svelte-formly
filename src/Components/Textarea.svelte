<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import clsx from 'clsx';
  import { settingStore } from './stores.js';

  // Declar variables.
  export let id = '';
  export let name = '';
  export let value = '';
  export let classe = '';
  export let placeholder = '';
  export let rows = 4;
  export let cols = 50;
  export let required = false;
  export let disabled = false;
  export let readonly = false;

  const dispatch = createEventDispatcher();
  let defaulClasses = null;

  // Change value.
  function onChangerValue(event) {
    dispatch('changeValue', {
      name: name,
      value: event.target.value,
    });
  }

  // Insert default value.
  onMount(() => {
    // Added default classes by style type.
    settingStore.subscribe((data) => {
      if (data.style) {
        defaulClasses = data.style === 'bootstrap' ? 'form-control' : '';
      }
    });

    dispatch('changeValue', {
      name,
      value,
    });
  });
</script>

<textarea
  {id}
  {name}
  class={clsx(classe)}
  {placeholder}
  {required}
  {disabled}
  {readonly}
  {rows}
  {cols}
  on:input={onChangerValue}
/>
{value}

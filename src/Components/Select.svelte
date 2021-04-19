<script>
  import { createEventDispatcher } from 'svelte';
  import clsx from 'clsx';

  // Declar variables.
  export let id = '';
  export let name = '';
  export let classe = '';
  export let options = [];
  export let disabled = false;
  export let value;
  const dispatch = createEventDispatcher();

  // Change value.
  function onChangeValue(event) {
    dispatch('changeValue', {
      name: name,
      value: event.target.value,
    });
  }
</script>

<select
  {id}
  {name}
  class={clsx(classe)}
  {disabled}
  on:input={onChangeValue}
  bin:value
>
  {#if options}
    {#each options as option}
      <option value={option.value} selected={option.value === value}
        >{option.title}</option
      >
    {/each}
  {/if}
</select>

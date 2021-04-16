<script>
  import {
    afterUpdate,
    beforeUpdate,
    createEventDispatcher,
    onMount,
    tick,
  } from 'svelte';
  import clsx from 'clsx';
  // Declar variables.
  export let id = '';
  export let name = '';
  export let classe = '';
  export let options = [];
  export let disabled = false;
  export let multiple = false;
  export let value;
  const dispatch = createEventDispatcher();

  // Change value.
  function onChangeValue(event) {
    dispatch('changeValue', {
      name: name,
      value: event.target.value,
    });
  }
  // Insert default value.
  onMount(() => {
    if (options) {
      if (options.length > 0) {
        dispatch('changeValue', {
          name: name,
          value: value ? value : options[0].value,
        });
      }
    }
  });

  // beforeUpdate(() => {
  //   if (options) {
  //     if (options.length > 0) {
  //       const data = value ? value : options[0].value;
  //       dispatch('changeValue', {
  //         name: name,
  //         value: data,
  //       });
  //     }
  //   }
  // });

  afterUpdate(() => {
    if (options) {
      if (options.length > 0) {
        const data = value ? value : null;
        dispatch('changeValue', {
          name: name,
          value: data,
        });
      }
    }
  });
</script>

<strong>{value}</strong>
<hr />
<select
  {id}
  {name}
  class={clsx(classe)}
  {disabled}
  on:input={onChangeValue}
  bind:value
>
  {#each options as option (option.value)}
    <option value={option.value} selected={value ? value : options[1].value}
      >{option.title}</option
    >
  {/each}
</select>

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
    dispatch('changeValue', {
      name: name,
      value: value ? value : null,
    });
  });

  afterUpdate(() => {
    const data = value ? value : null;
    // console.log(`afterUpdate ${name}`, data);
    dispatch('changeValue', {
      name: name,
      value: data,
    });
  });
</script>

<strong>{value}</strong>
<hr />
<pre>
  <code>
    {JSON.stringify(options, null, 2)}
  </code>
</pre>
<select
  {id}
  {name}
  class={clsx(classe)}
  {disabled}
  on:input={onChangeValue}
  bind:value
>
  {#each options as option (option.value)}
    <option value={option.value} selected={value ? value : options[0].value}
      >{option.title}</option
    >
  {/each}
</select>

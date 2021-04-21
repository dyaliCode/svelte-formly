<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import clsx from 'clsx';

  import { isRequired } from '../lib/helpers';

  // Declar variables.
  export let field = {};
  const defaultAttr = {
    id: '',
    classes: '',
    disabled: false,
  };
  let classe = null;
  let defaulClasses = null;

  // Dispatch.
  const dispatch = createEventDispatcher();

  // Change value.
  function onChangeValue(event) {
    dispatch('changeValue', {
      name: field.name,
      value: event.target.value,
    });
  }

  // Lifecycle.
  afterUpdate(() => {
    field.value = field.value == undefined ? null : field.value;
    classe = clsx(field.attributes.classes, defaulClasses);
    field.attributes = { ...defaultAttr, ...field.attributes };
  });
</script>

<select
  name={field.name}
  value={field.value}
  id={field.attributes.id}
  class={clsx(classe)}
  required={isRequired(field)}
  disabled={field.attributes.disabled}
  on:input={onChangeValue}
>
  {#if field.extra}
    {#if field.extra.options}
      {#each field.extra.options as option}
        <option value={option.value} selected={option.value === field.value}
          >{option.title}</option
        >
      {/each}
    {/if}
  {/if}
</select>

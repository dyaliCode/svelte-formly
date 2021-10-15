<script>
  import { createEventDispatcher, afterUpdate } from 'svelte';
  import clsx from 'clsx';

  import { isRequired } from '../lib/helpers';

  // Declar variables.
  export let field = {};
  const defaultAttributes = {
    id: '',
    classes: '',
    disabled: false,
  };
  const fieldAttributes = field.attributes ? field.attributes : {};
  field.attributes = { ...defaultAttributes, ...fieldAttributes };

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
  });
</script>

<select
  name={field.name}
  id={field.attributes.id}
  class={classe}
  required={isRequired(field)}
  disabled={field.attributes.disabled}
  on:change={onChangeValue}
>
  {#if field.extra}
    {#if field.extra.options}
      {#each field.extra.options as option}
        <option value={option.value}>{option.title}</option>
      {/each}
    {/if}
  {/if}
</select>

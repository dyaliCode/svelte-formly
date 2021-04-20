<script>
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
  import clsx from 'clsx';

  // Declar variables.
  export let field = {};
  const defaultAttr = {
    classes: '',
  };
  let classe = null;
  let defaulClasses = null;
  export let items = getItems(field);

  function getItems(field) {
    let list = [];
    if (field.extra) {
      if (field.extra.items) {
        list = field.extra.items;
      }
    }
    return list;
  }

  // Dispatch.
  const dispatch = createEventDispatcher();

  // Change value.
  function onChangeValue(event) {
    dispatch('changeValue', {
      name: field.name,
      value: event.target.value,
    });
  }

  // Insert default value.
  onMount(() => {
    if (items.length > 0) {
      dispatch('changeValue', {
        name: field.name,
        value: items[0].value,
      });
    }
  });

  // Lifecycle.
  afterUpdate(() => {
    field.value = field.value == undefined ? null : field.value;
    classe = clsx(field.attributes.classes, defaulClasses);
    field.attributes = { ...defaultAttr, ...field.attributes };
  });
</script>

{#each items as item, i}
  <div
    class={field.extra.aligne === 'inline'
      ? 'form-check form-check-inline'
      : 'form-check'}
  >
    <input
      type="radio"
      class={classe}
      id={item.id}
      name={field.name}
      value={item.value}
      checked={item.value === field.value}
      on:input={onChangeValue}
    />
    <span>{item.title}</span>
  </div>
{/each}

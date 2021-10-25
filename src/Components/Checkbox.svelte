<script>
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
  import clsx from 'clsx';

  // Declar variables.
  export let field = {};
  let values = [];
  const defaultAttributes = {
    classes: '',
  };
  let classe = null;
  let defaulClasses = null;

  // Dispatch.
  const dispatch = createEventDispatcher();

  // Change value.
  function onChangeValue(event) {
    if (values.length > 0) {
      values.map((item, index) => {
        if (item.name === event.target.name) {
          values[index].checked = event.target.checked;
        }
      });
      dispatch('changeValue', {
        name: field.name,
        value: values,
      });
    }
  }

  // Insert default
  onMount(() => {
    if (field.extra.items.length > 0) {
      field.extra.items.map((i) => {
        values = [
          ...values,
          {
            name: i.name,
            value: i.value,
            checked: i.checked ? i.checked : false,
          },
        ];
      });
    }
  });

  // Lifecycle.
  afterUpdate(() => {
    field.value = field.value == undefined ? null : field.value;
    classe = clsx(field.attributes.classes, defaulClasses);
    field.attributes = { ...defaultAttributes, ...field.attributes };
  });
</script>

{#each field.extra.items as item, i}
  <div
    class={field.extra.aligne === 'inline' ? 'form-check-inline' : 'form-check'}
  >
    <input
      type="checkbox"
      class={classe}
      value={item.value}
      name={item.name}
      checked={item.checked ? item.checked : false}
      on:input={onChangeValue}
    />
    <span>{item.title}</span>
  </div>
{/each}

<script>
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
  import clsx from 'clsx';

  // Declar variables.
  export let field = {};
  let values = [];
  const defaultAttr = {
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
      field.extra.items[0].checked = true;
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
      dispatch('changeValue', {
        name: field.name,
        value: values,
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

{#each field.extra.items as item, i}
  <div
    class={field.extra.aligne === 'inline' ? 'form-check-inline' : 'form-check'}
  >
    <input
      type="checkbox"
      class={clsx(classe)}
      id={item.id}
      name={item.name}
      checked={item.checked ? item.checked : false}
      on:input={onChangeValue}
    />
    <span>{item.title}</span>
  </div>
{/each}

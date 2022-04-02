<script>
  import { createEventDispatcher, onMount, afterUpdate } from "svelte";
  import clsx from "clsx";

  import { isRequired } from "../lib/helpers";

  // Declar variables.
  export let field = {};
  const defaultAttributes = {
    id: "",
    classes: "",
    disabled: false,
  };
  const fieldAttributes = field.attributes ? field.attributes : {};
  field.attributes = { ...defaultAttributes, ...fieldAttributes };

  let classe = null;
  let defaulClasses = null;
  let multiple = false;

  // Dispatch.
  const dispatch = createEventDispatcher();

  // Change value.
  function onChangeValue(event) {
    let value;
    if (multiple) {
      let values = [];
      const selectedOptions = event.currentTarget.selectedOptions;
      for (let i = 0; i < selectedOptions.length; i++) {
        values.push(selectedOptions[i].value);
      }
      value = values;
    } else {
      value = event.target.value;
    }

    dispatch("changeValue", {
      name: field.name,
      value,
    });
  }

  function checkSelected(is_multiple, option_value, field_value) {
    if (is_multiple) {
      if (field_value && field_value.length) {
        const res = field_value.indexOf(option_value) != -1;
        return res;
      }
      return null;
    }
    return option_value === field_value;
  }

  // Lifecycle.
  onMount(() => {
    if (field.extra) {
      multiple = field.extra.multiple ? field.extra.multiple : null;
    }
  });

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
  {multiple}
  on:change={onChangeValue}
>
  {#if field.extra}
    {#if field.extra.options}
      {#each field.extra.options as option}
        <option
          value={option.value}
          selected={checkSelected(multiple, option.value, field.value)}
        >
          {option.title}
        </option>
      {/each}
    {/if}
  {/if}
</select>

<script>
  import { afterUpdate, createEventDispatcher } from "svelte";
  import clsx from "clsx";
  import { inArray } from "../lib/helpers";

  // Declar variables.
  export let field = {};
  let values = [];
  const defaultAttributes = {
    classes: "",
  };
  let classe = null;
  let defaulClasses = null;

  // Dispatch.
  const dispatch = createEventDispatcher();

  // Change value.
  function onChangeValue(event) {
    if (field.extra.items.length > 0) {
      // values.map((item, index) => {
      //   if (item.name === event.target.name) {
      //     values[index].checked = event.target.checked;
      //   }
      // });
      field.extra.items.map((item) => {
        if (item.name === event.target.name) {
          if (event.target.checked) {
            values = [...values, item.value];
          } else {
            values = values.filter((value) => value !== item.value);
          }
        }
      });
      console.log("values", values);
      dispatch("changeValue", {
        name: field.name,
        value: values,
      });
    }
  }

  // Init.
  if (field.extra.items.length > 0) {
    field.extra.items.map((item) => {
      if (field.value && field.value.length) {
        item.checked = inArray(field.value, item.value);
      }
      if (item.checked) {
        values = [...values, item.value];
        field.value = [...field.value, item.value];
      }
    });

    dispatch("changeValue", {
      name: field.name,
      value: values,
    });
  }

  // Lifecycle.
  afterUpdate(async () => {
    field.value =
      field.value == undefined || !field.value.length
        ? values.length
          ? values
          : null
        : field.value;
    classe = clsx(field.attributes.classes, defaulClasses);
    field.attributes = { ...defaultAttributes, ...field.attributes };
  });
</script>

{#each field.extra.items as item, i}
  <div
    class={field.extra.aligne === "inline" ? "form-check-inline" : "form-check"}
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

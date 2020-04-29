<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let id = "";
  export let name = "";
  export let value = "";
  export let classe = "";
  export let rows = 4;
  export let cols = 50;
  export let required = false;
  export let disabled = false;
  export let readonly = false;
  const dispatch = createEventDispatcher();
  // Change value.
  function onChangerValue(event) {
    dispatch("changeValue", {
      name: name,
      value: event.target.value
    });
  }
  // Insert default value.
  onMount(() => {
    dispatch("changeValue", {
      name,
      value
    });
  });
</script>

<textarea
  {id}
  {name}
  class={clsx(classe)}
  {required}
  {disabled}
  {readonly}
  {rows}
  {cols}
  on:input={onChangerValue}>
  {value}
</textarea>

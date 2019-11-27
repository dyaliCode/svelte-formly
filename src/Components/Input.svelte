<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";

  export let type = "text";
  export let id = "";
  export let name = "";
  export let value = "";
  export let classe = "";
  export let min = null;
  export let max = null;
  export let step = null;
  export let autocomplete = "off";
  export let placeholder = null;
  export let disabled = null;

  const dispatch = createEventDispatcher();

  function onChangerValue(event) {
    dispatch("changeValue", {
      name: name,
      value: event.target.value
    });
  }

  onMount(() => {
    type = type === "datetimelocal" ? "datetime-local" : type;
    value = type === "range" ? (value = min) : value;

    dispatch("changeValue", {
      name,
      value
    });
  });
</script>

<input
  {type}
  {id}
  {name}
  {value}
  class={clsx(classe)}
  {placeholder}
  {disabled}
  {min}
  {max}
  {step}
  {autocomplete}
  on:input={onChangerValue} />

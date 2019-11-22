<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";

  export let label;
  export let type = "text";
  export let id = "";
  export let name = "";
  export let value = "";
  export let classe = "";
  export let placeholder = "";
  export let required = false;
  export let disabled = false;
  export let min = false;
  export let max = false;
  export let readonly = false;
  const formControlClass = "form-control";

  const dispatch = createEventDispatcher();

  function onChangerValue(event) {
    dispatch("changeValue", {
      name: name,
      value: event.target.value
    });
  }

  onMount(() => {
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
  class={clsx(classe, formControlClass)}
  {placeholder}
  {required}
  {disabled}
  min={min ? min : null}
  autocomplete={type === 'password' ? 'off' : null}
  on:input={onChangerValue} />

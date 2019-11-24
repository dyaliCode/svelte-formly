<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";

  export let type = "text";
  export let id = "";
  export let name = "";
  export let value = "";
  export let classe = "";
  export let min = false;
  export let max = false;
  export let placeholder = "";
  export let disabled = false;
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
  {disabled}
  {min}
  {max}
  autocomplete={type === 'password' ? 'off' : null}
  on:input={onChangerValue} />

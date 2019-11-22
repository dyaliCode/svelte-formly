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
  export let rows = 4;
  export let cols = 50;
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

<textarea
  {type}
  {id}
  {name}
  class={clsx(classe, formControlClass)}
  {required}
  {disabled}
  {rows}
  {cols}
  on:input={onChangerValue} />

<div class="valid-feedback">Looks good!</div>
<div class="invalid-feedback">Please choose a {name}.</div>

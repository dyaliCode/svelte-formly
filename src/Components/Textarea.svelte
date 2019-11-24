<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";

  export let id = "";
  export let name = "";
  export let value = "";
  export let classe = "";
  export let rows = 4;
  export let cols = 50;
  export let required = false;
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

<textarea
  {id}
  {name}
  class={clsx(classe, formControlClass)}
  {required}
  {disabled}
  {rows}
  {cols}
  s
  on:input={onChangerValue}>
  {value}
</textarea>

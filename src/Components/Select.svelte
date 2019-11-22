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
  export let size = undefined;
  export let invalid = false;
  export let readonly = false;
  const formControlClass = "form-control";

  export let options = [];

  const dispatch = createEventDispatcher();

  function onChangeValue(event) {
    dispatch("changeValue", {
      name: name,
      value: event.target.value
    });
  }

  onMount(() => {
    if (options.length > 0) {
      dispatch("changeValue", {
        name: name,
        value: options[0].value
      });
    }
  });
</script>

<select
  {id}
  {name}
  {value}
  class={clsx(classe, formControlClass)}
  on:input={onChangeValue}>
  {#each options as option (option.value)}
    <option value={option.value}>{option.title}</option>
  {:else}
    <option>Any</option>
  {/each}
</select>

<div class="valid-feedback">Looks good!</div>
<div class="invalid-feedback">Please choose a {label}.</div>

<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let id = "";
  export let name = "";
  export let classe = "";
  export let options = [];
  export let disabled = false;
  export let multiple = false;
  const dispatch = createEventDispatcher();
  // Change value.
  function onChangeValue(event) {
    dispatch("changeValue", {
      name: name,
      value: event.target.value
    });
  }
  // Insert default value.
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
  class={clsx(classe)}
  {disabled}
  {multiple}
  on:input={onChangeValue}>
  {#each options as option (option.value)}
    <option value={option.value}>{option.title}</option>
  {:else}
    <option>Any</option>
  {/each}
</select>

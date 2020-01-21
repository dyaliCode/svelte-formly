<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let name = "";
  export let classe = "";
  export let aligne = "default";
  export let items = [];
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
    if (items.length > 0) {
      dispatch("changeValue", {
        name: name,
        value: items[0].value
      });
    }
  });
</script>

{#each items as item, i}
  <div class={aligne === 'inline' ? 'form-check-inline' : 'form-check'}>
    <input
      type="radio"
      class={clsx(classe)}
      id={item.id}
      {name}
      value={item.value}
      checked={i === 0}
      on:input={onChangeValue} />
    <span>{item.title}</span>
  </div>
{/each}

<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let classe = "";
  export let aligne = "default";
  export let items = [];
  const dispatch = createEventDispatcher();
  // Change value.
  function onChangeValue(event) {
    dispatch("changeValue", {
      name: event.target.name,
      value: event.target.checked
    });
  }
  // Insert default
  onMount(() => {
    if (items.length > 0) {
      items[0].checked = true;
      items.map(i => {
        dispatch("changeValue", {
          name: i.name,
          value: i.checked ? i.checked : false
        });
      });
    }
  });
</script>

{#each items as item, i}
  <div class={aligne === 'inline' ? 'form-check-inline' : 'form-check'}>
    <input
      type="checkbox"
      class={clsx(classe)}
      id={item.id}
      name={item.name}
      checked={item.checked ? item.checked : false}
      on:input={onChangeValue} />
    <span>{item.title}</span>
  </div>
{/each}

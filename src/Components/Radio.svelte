<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let name = "";
  export let classe = "";
  export let aligne = "default";
  export let radios = [];
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
    if (radios.length > 0) {
      dispatch("changeValue", {
        name: name,
        value: radios[0].value
      });
    }
  });
</script>

{#each radios as radio, i}
  <div class={aligne === 'inline' ? 'form-check-inline' : 'form-check'}>
    <input
      type="radio"
      class={clsx(classe)}
      id={radio.id}
      {name}
      value={radio.value}
      checked={i === 0}
      on:input={onChangeValue} />
    <span>{radio.title}</span>
  </div>
{/each}

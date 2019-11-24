<script>
  import { createEventDispatcher, onMount } from "svelte";
  import clsx from "clsx";

  export let name = "";
  export let aligne = "default";
  export let radios = [];
  const formControlClass = "form-control";
  const dispatch = createEventDispatcher();

  function onChangeValue(event) {
    dispatch("changeValue", {
      name: name,
      value: event.target.value
    });
  }

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
    <label class="form-check-label">
      <input
        type="radio"
        class="form-check-input"
        id={radio.id}
        {name}
        value={radio.value}
        checked={i === 0}
        on:input={onChangeValue} />
      {radio.title}
    </label>
  </div>
{/each}

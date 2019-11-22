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

  export let aligne = "default";
  export let radios = [];

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
        {name}
        value={radio.value}
        checked={i === 0}
        on:input={onChangeValue} />
      {radio.title}
    </label>
  </div>
{/each}

<div class="valid-feedback">Looks good!</div>
<div class="invalid-feedback">Please choose a {label}.</div>

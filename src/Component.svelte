<script>
  import { get } from "svelte/store";
  import { valuesForm, Field } from "./index.js";

  const fields = [
    {
      "type": "text",
      "name": "text",
      "id": "text",
      "placeholder": "text",
      "value": "text",
      "readonly": true
    },
    {
      "type": "color",
      "name": "color",
      "id": "color",
      "label": "Color Form"
    }
  ];

  let message = "";
  let values = {};
  let color = "#ff3e00";

  function onSubmit() {
    const data = get(valuesForm);
    if (data.isValidForm) {
      values = data.values;
      console.log("values", values);
    }
  }
</script>

<style>
  * {
    color: var(--theme-color);
  }
  .custom-form :global(.form-group) {
    padding: 10px;
    border: solid 1px var(--theme-color);
    margin-bottom: 10px;
  }
  .custom-form :global(.custom-form-group) {
    padding: 10px;
    background: var(--theme-color);
    color: white;
    margin-bottom: 10px;
  }
  .custom-form :global(.class-description) {
    color: var(--theme-color);
  }
</style>

<h1 style="--theme-color: {color}">Svelte Formly</h1>
<h3>{message}</h3>
<form
  on:submit|preventDefault={onSubmit}
  class="custom-form"
  style="--theme-color: {color}">
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>

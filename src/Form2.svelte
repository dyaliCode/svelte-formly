<script>
  import { Field } from "./index";

  let message = "";
  let data = {};
  let color = "#ff3e00";

  function getValuesForm(event) {
    data = event.detail;
  }

  function onSubmit() {
    const { values } = data;
    if (values.valid) {
      message = JSON.stringify(values, null, 4);
    } else {
      message = "Your form is not valid!";
    }
  }

  const form_name = "form2";
  const fields2 = [
    {
      type: "checkbox",
      name: "check1",
      value: "value1",
      attributes: {
        id: "check1",
        label: "Checkbox Default:",
        classes: ["checker"],
      },
      rules: ["required"],
      extra: {
        items: [
          {
            name: "item1",
            value: "value1",
            title: "Value 1",
          },
          {
            name: "item2",
            value: "value2",
            title: "Value 2",
          },
        ],
      },
      prefix: {
        classes: ["form-group mb-3"],
      },
    },
    {
      type: "checkbox",
      name: "check2",
      value: "value2",
      attributes: {
        id: "check2",
        label: "Checkbox Inline:",
        classes: ["checker"],
      },
      extra: {
        aligne: "inline",
        items: [
          {
            name: "item1",
            value: "value1",
            title: "Value 1",
          },
          {
            name: "item2",
            value: "value2",
            title: "Value 2",
          },
        ],
      },
      prefix: {
        classes: ["form-group mb-3"],
      },
    },
  ];
</script>

<h4 style="--theme-color: {color}">{form_name}</h4>

<pre>
  <code>
    {message}
  </code>
</pre>
<form
  on:submit|preventDefault={onSubmit}
  class="custom-form"
  style="--theme-color: {color}"
>
  <Field fields={fields2} name={form_name} on:form_values={getValuesForm} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>

<style>
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
  .custom-form :global(.label) {
    color: var(--theme-color);
  }
</style>

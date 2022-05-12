<script>
  import { Field } from "./index";

  let message = "";
  let data = {};
  let color = "#ff3e00";

  function getValuesForm(event) {
    data = event.detail;
  }

  function onSubmit() {
    console.log("data", data);
    const { values } = data;
    if (values.valid) {
      message = JSON.stringify(values, null, 4);
    } else {
      message = "Your form is not valid!";
    }
  }

  const form_name = "form1";
  const fields1 = [
    {
      type: "input",
      name: "first-name",
      value: "first-name",
      attributes: {
        type: "text",
        label: "First name",
        id: "firstname",
        classes: ["form-control"],
      },
      prefix: {
        classes: ["form-group", "col-4"],
      },
      rules: ["required", "min:20"],
    },
    {
      type: "input",
      name: "lastname",
      value: "last-name",
      attributes: {
        type: "text",
        label: "Last name",
        id: "lastname",
        classes: ["form-control"],
      },
      prefix: {
        classes: ["form-group", "col-4"],
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
  <Field fields={fields1} name={form_name} on:form_values={getValuesForm} />
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

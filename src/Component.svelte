<script>
  import { get } from "svelte/store";
  import { Field, valuesForm } from "./index.js";

  const fields = [
    {
      type: "text",
      name: "firstname",
      id: "firstname",
      validation: ["required"]
    },
    {
      type: "text",
      name: "lastname",
      id: "lastname",
      validation: ["required", notEqual],
      messages: {
        notEqual: "Last name not equal to First name"
      }
    }
  ];

  function notEqual() {
    const values = get(valuesForm).values;
    if (values.firstname === values.lastname) {
      return false;
    }
    return true;
  }

  function submitHandler() {
    const data = get(valuesForm);
    console.log("data", data);
  }
</script>

<style>
  .custom-form :global(.form-group) {
    border: solid 1px #ff3e00;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 14px;
  }
  .custom-form :global(.form-group input) {
    margin-bottom: 10px;
  }
  .custom-form :global(.form-group .invalid-feedback) {
    color: red;
  }
</style>

<h1>Svelte Formly</h1>

<form on:submit={submitHandler} class="custom-form">
  <Field {fields} />
  <button type="submit">Send</button>
</form>

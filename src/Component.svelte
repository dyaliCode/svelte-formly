<script>
  import { onMount, onDestroy } from "svelte";
  import { valuesForm, Field } from "./index.js";

  let message = "";

  const fields = [
    {
      type: "text",
      name: "firstname",
      value: "",
      id: "firstname",
      placeholder: "Tap your first name",
      validation: ["required", "min:6"]
    },
    {
      type: "text",
      name: "lastname",
      value: "",
      id: "lastname",
      placeholder: "Tap your lastname"
    },
    {
      type: "email",
      name: "email",
      value: "",
      id: "email",
      placeholder: "Tap your email",
      validation: ["required", "email"]
    }
  ];

  function onSubmit() {
    valuesForm.subscribe(data => {
      if (data.isValidForm) {
        message = "Congratulation! now your form is valid";
      } else {
        message = "Your form is not valid!";
      }
    });
  }

  onDestroy(valuesForm);
</script>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <h2>{message}</h2>
          <h5 class="card-title">Card title</h5>
          <form on:submit|preventDefault={onSubmit} novalidate>
            <Field {fields} />
            <button class="btn btn-primary" type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  import { onMount, onDestroy } from "svelte";
  import { valuesForm, Field } from "./index.js";

  let message = "";

  const fields = [
    {
      type: "text",
      name: "firstname",
      id: "firstname",
      placeholder: "Tap your first name"
      // validation: ["required", "min:6"]
    },
    {
      type: "textarea",
      name: "message",
      label: "Message",
      placeholder: "Add your message",
      disabled: true,
      value: "My"
    },
    {
      type: "radio",
      name: "ville",
      label: "ville",
      validation: ["required"],
      radios: [
        {
          value: null,
          title: "Any"
        },
        {
          value: 1,
          title: "Agadir",
          id: "ville1"
        },
        {
          value: 2,
          title: "Casablanca",
          id: "ville2"
        }
      ]
    }
  ];

  function onSubmit() {
    valuesForm.subscribe(data => {
      console.log("data", data);
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

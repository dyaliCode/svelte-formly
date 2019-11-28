<script>
  import { get } from "svelte/store";
  import { Field, valuesForm } from "./index.js";

  let values = [];
  let valueRange = null;
  function onSubmit() {
    const data = get(valuesForm);
    if (data.isValidForm) {
      values = data.values;
      console.log("values", values);
      valueRange = values.range;
    }
  }

  valuesForm.subscribe(data => {
    valueRange = data.values.range;
  });

  const fields = [
    {
      type: "text",
      name: "firstname",
      value: "",
      id: "firstname",
      class: ["form-control"],
      placeholder: "Tap your first name",
      validation: ["required", "min:6"],
      messages: {
        required: "Firstname field is required!",
        min: "First name field must have more that 6 caracters!"
      }
    },
    {
      prefix: {
        tag: "<span>",
        class: ["custom-form-group"]
      },
      type: "text",
      name: "lastname",
      value: "",
      id: "lastname",
      placeholder: "Tap your lastname",
      description: {
        class: ["custom-class-desc"],
        text: "Custom text for description"
      }
    },
    {
      type: "email",
      name: "email",
      value: "",
      id: "email",
      placeholder: "Tap your email",
      validation: ["required", "email"]
    },
    {
      type: "radio",
      name: "gender",
      radios: [
        {
          id: "female",
          value: "female",
          title: "Female"
        },
        {
          id: "male",
          value: "male",
          title: "Male"
        }
      ]
    },
    {
      type: "select",
      name: "city",
      id: "city",
      label: "City",
      validation: ["required"],
      options: [
        {
          value: 1,
          title: "Agadir"
        },
        {
          value: 2,
          title: "Casablanca"
        }
      ]
    }
  ];
</script>

<style>
  h1 {
    color: #ff3e00;
  }
  .custom-form :global(.form-group) {
    padding: 10px;
    border: solid 1px #ff3e00;
    margin-bottom: 10px;
  }
  .custom-form :global(.custom-form-group) {
    padding: 10px;
    background: #ff3e00;
    color: white;
    margin-bottom: 10px;
  }
  .custom-form :global(.class-description) {
    color: #ff3e00;
  }
</style>

<h1>Svelte Formly</h1>

<form on:submit|preventDefault={onSubmit} class="custom-form">
  <Field {fields} />
  <button type="submit">Send</button>
</form>

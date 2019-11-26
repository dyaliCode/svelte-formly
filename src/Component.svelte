<script>
  import { onDestroy } from "svelte";
  import { valuesForm, Field } from "./index.js";

  let message = "";

  const fields = [
    {
      type: "text",
      name: "firstname",
      value: "",
      id: "firstname",
      classe: "any-class",
      placeholder: "Tap your first name",
      validation: ["required", "min:6"],
      messages: {
        required: "First name field is required",
        min: "First name must be 6 characters long"
      },
      description: {
        text: "Description field first name",
        classes: ["class-description"]
      },
      prefix: {
        tag: "div",
        classes: ["default-field", "form-control"],
        id: "my-id"
      }
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
      validation: ["required", "email"],
      messages: {
        required: "email field is required"
      }
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
      messages: {
        required: "City field is required"
      },
      options: [
        {
          value: 1,
          title: "Agadir"
        },
        {
          value: 2,
          title: "Casablanca"
        }
      ],
      description: {
        text: "Description field city",
        classes: ["class-description"]
      }
    }
  ];

  function onSubmit() {
    valuesForm.subscribe(data => {
      if (data.isValidForm) {
        message = "Congratulation! now your form is valid";
        const values = data.values;
      } else {
        message = "Your form is not valid!";
      }
    });
  }

  onDestroy(valuesForm);
</script>

<h2>{message}</h2>
<form on:submit|preventDefault={onSubmit} novalidate>
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>

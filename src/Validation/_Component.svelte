<script>
  import { get } from "svelte/store";
  import { valuesForm, Field } from "./index.js";

  let message = "";

  // const fields = [
  //   {
  //     type: "text",
  //     name: "firstname",
  //     value: "",
  //     id: "firstname",
  //     classe: "any-class",
  //     autocomplete: "off",
  //     placeholder: "Tap your first name",
  //     validation: ["required", "min:6"],
  //     messages: {
  //       required: "First name field is required",
  //       min: "First name must be 6 characters long"
  //     },
  //     description: {
  //       text: "",
  //       classes: ["class-description"]
  //     },
  //     prefix: {
  //       tag: "div",
  //       classes: ["default-field", "form-control"],
  //       id: "my-id"
  //     }
  //   },
  //   {
  //     type: "text",
  //     name: "lastname",
  //     value: "",
  //     id: "lastname",
  //     placeholder: "Tap your lastname"
  //   },
  //   {
  //     type: "email",
  //     name: "email",
  //     value: "",
  //     id: "email",
  //     placeholder: "Tap your email",
  //     validation: ["required", "email"],
  //     messages: {
  //       required: "email field is required"
  //     }
  //   },
  //   {
  //     type: "radio",
  //     name: "gender",
  //     radios: [
  //       {
  //         id: "female",
  //         value: "female",
  //         title: "Female"
  //       },
  //       {
  //         id: "male",
  //         value: "male",
  //         title: "Male"
  //       }
  //     ]
  //   },
  //   {
  //     type: "select",
  //     name: "city",
  //     id: "city",
  //     label: "City",
  //     validation: ["required"],
  //     messages: {
  //       required: "City field is required"
  //     },
  //     options: [
  //       {
  //         value: 1,
  //         title: "Agadir"
  //       },
  //       {
  //         value: 2,
  //         title: "Casablanca"
  //       }
  //     ],
  //     description: {
  //       text: "Description field city",
  //       classes: ["class-description"]
  //     }
  //   }
  // ];

  let values = [];
  // const fields = [
  //   {
  //     type: "text",
  //     name: "username",
  //     id: "username",
  //     label: "Username",
  //     placeholder: "Your username",
  //     class: ["form-control", "form-text"],
  //     disabled: false,
  //     validation: ["required", "max:10"],
  //     messages: {
  //       required: "Username field is required!!"
  //     },
  //     prefix: {
  //       class: ["form-group"]
  //     }
  //   },
  //   {
  //     type: "radio",
  //     name: "gender",
  //     id: "gender",
  //     label: "Gender",
  //     prefix: {
  //       class: ["form-group"]
  //     },
  //     radios: [
  //       {
  //         value: 1,
  //         title: "Women"
  //       },
  //       {
  //         value: 2,
  //         title: "Man"
  //       }
  //     ],
  //     aligne: "inline"
  //   },
  //   {
  //     type: "date",
  //     name: "date",
  //     id: "date",
  //     label: "Date"
  //   },
  //   {
  //     type: "datetimelocal",
  //     name: "datetimelocal",
  //     id: "datetimelocal",
  //     label: "Date time local"
  //   },
  //   {
  //     type: "range",
  //     name: "range",
  //     id: "range",
  //     label: "Range",
  //     min: 10,
  //     max: 20,
  //     step: 5
  //   },
  //   {
  //     type: "color",
  //     name: "color",
  //     id: "color",
  //     label: "color",
  //     value: "#ff5050"
  //   }
  // ];

  const fields = [
    {
      type: "text",
      name: "username",
      id: "username",
      label: "Username"
    }
  ];

  function onSubmit() {
    const valuesFormData = get(valuesForm);
    values = valuesFormData.values;
  }
</script>

<style>
  .block {
    width: 200px;
    height: 150px;
  }
</style>

<h2>{message}</h2>
<pre>
  <code>{JSON.stringify(values)}</code>
</pre>
<div
  class="block"
  style="background-color: {values.color ? values.color : 'red'}" />

<form on:submit|preventDefault={onSubmit}>
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>

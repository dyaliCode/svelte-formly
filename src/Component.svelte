<script>
  import { get } from "svelte/store";
  import { valuesForm, Field } from "./index.js";

  const fields = [
    // {
    //   type: "text",
    //   name: "firstname",
    //   id: "firstname",
    //   class: ["form-control"],
    //   placeholder: "Tap your first name"
    // },
    // {
    //   type: "checkbox",
    //   name: "checkbox",
    //   id: "checkbox",
    //   class: ["form-control"],
    //   items: [
    //     {
    //       title: "Radio 1",
    //       name: "radio1"
    //     },
    //     {
    //       title: "Radio 2",
    //       name: "radio2",
    //       checked: true
    //     },
    //     {
    //       title: "Radio 3",
    //       name: "radio3"
    //     }
    //   ],
    //   aligne: "inline"
    // },
    {
      type: "file",
      name: "file",
      id: "file",
      multiple: true,
      validation: ["file"],
      file: {
        types: ["png", "jpg"],
        maxsize: 0.5
      }
    }
  ];

  function onSubmit() {
    const data = get(valuesForm);
    console.log("data.values", data.values);
  }
</script>

<style>
  .custom-form :global(.form-group) {
    /* width: 30%; */
    border: solid 1px red;
  }
  .custom-form :global(.form-group .list-files .file) {
    background-color: #303534;
    color: white;
  }
</style>

<form on:submit|preventDefault={onSubmit} class="custom-form">
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>

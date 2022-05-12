<script>
  import { createEventDispatcher } from "svelte";
  import { get } from "svelte/store";
  import { values_form, Field } from "./index";

  // Dispatch.
  const dispatch = createEventDispatcher();

  let message = "";
  let values = {};
  let color = "#ff3e00";

  function onSubmit() {
    const d = get(values_form);
    console.log("d", d);
    d.map((item) => {
      console.log("item", item);
      return item;
    });
    // console.log("vls", vls);
    // console.log("d", d);

    // const data = get(values_form);
    // if (data.valid) {
    //   message = JSON.stringify(data, null, 4);
    // } else {
    //   message = "Your form is not valid!";
    // }
    // console.log("form1", data.values);
  }

  const fields1 = [
    {
      type: "input",
      name: "First name",
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
      rules: ["required"],
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

<!-- <h4 style="--theme-color: {color}">Form1</h4> -->

<form
  on:submit|preventDefault={onSubmit}
  class="custom-form"
  style="--theme-color: {color}"
>
  <Field fields={fields1} name="form1" />
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

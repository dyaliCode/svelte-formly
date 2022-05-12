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
    const data = get(values_form["form2"]);
    if (data.valid) {
      message = JSON.stringify(data, null, 4);
    } else {
      message = "Your form is not valid!";
    }

    console.log("form2", data.values);

    // Dispatch.
    // 		dispatch("submitForm", {
    //       name: 'form2',
    //       values: data.values,
    //     });
  }

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

<!-- <h4 style="--theme-color: {color}">Form2</h4> -->

<form
  on:submit|preventDefault={onSubmit}
  class="custom-form"
  style="--theme-color: {color}"
>
  <Field fields={fields2} name="form2" />
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

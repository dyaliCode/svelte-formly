<script>
  import { get } from "svelte/store";
  import { valuesForm, Field } from "./index.js";

  const fields = [
    {
      type: "file",
      name: "file",
      id: "file",
      label: "file",
      multiple: true,
      showPreview: true
    }
  ];

  let message = "";
  let values = {};
  let color = "#ff3e00";

  function onSubmit() {
    const data = get(valuesForm);
    console.log("data.values", data.values);
    // if (data.isValidForm) {
    //   values = data.values;
    //   color = values.color ? values.color : color;
    //   message = "Congratulation! now your form is valid";
    // } else {
    //   message = "Your form is not valid!";
    // }
  }
</script>

<form on:submit|preventDefault={onSubmit}>
  <Field {fields} />
  <button type="submit">Send</button>
</form>

<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { valuesForm, Field } from "./index.js";

  import loadOptions from "./Components/beers.js";
  let _items = [];
  $: items = _items;
  onMount(async () => {
    _items = await loadOptions("Coffee Imperial Stout");
  });

  const fields = [
    {
      type: "autocomplete",
      name: "tags",
      id: "autocomplete",
      multiple: true
    },
    {
      type: "file",
      name: "file",
      id: "file",
      multiple: true,
      showPreview: true
    },
    {
      type: "checkbox",
      name: "checkbox",
      id: "checkbox",
      items: [
        {
          title: "ch 1",
          name: "ch1",
          checked: true
        },
        {
          title: "ch 2",
          name: "ch2",
          checked: true
        }
      ]
    }
  ];

  function onSubmit() {
    const data = get(valuesForm);
    console.log("data.values", data.values);
  }

  // function onSelectItem(event) {
  //   console.log("event", event.detail);
  // }
</script>

<style>
  .custom-form {
    width: 500px;
  }
</style>

<form on:submit|preventDefault={onSubmit} class="custom-form">
  <Field {fields} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>

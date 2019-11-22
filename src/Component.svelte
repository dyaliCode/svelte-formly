<script>
  import { onMount, onDestroy } from "svelte";
  import { valuesForm } from "./Components/stores.js";
  import Field from "./Components/Field.svelte";

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

  let values;

  function onSubmit(evt) {
    var form = evt.target;
  }

  onMount(() => {
    valuesForm.subscribe(data => {
      values = data;
    });
  });

  onDestroy(valuesForm);
</script>

<style>
  .card {
    margin-top: 40px;
    background-color: #fafafa;
    border: solid 1px #e0e2e3;
  }
</style>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
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

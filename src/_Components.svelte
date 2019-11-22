<script>
  import { onMount, onDestroy } from "svelte";
  import { valuesForm } from "./Components/stores.js";
  import Field from "./Components/Field.svelte";

  const fields = [
    // {
    //   label: "Your first name",
    //   type: "text",
    //   id: "text",
    //   name: "first-name",
    //   // value: "sahmoud",
    //   placeholder: "your first name",
    //   required: true
    // },
    // {
    //   label: "Your last name",
    //   type: "text",
    //   id: "text",
    //   name: "last-name",
    //   value: "kamal",
    //   placeholder: "your last name",
    //   required: true
    // },
    // {
    //   label: "Ville",
    //   type: "select",
    //   id: "ville",
    //   name: "ville",
    //   options: [
    //     {
    //       title: "Agadir",
    //       value: 1
    //     },
    //     {
    //       title: "Rabat",
    //       value: 2
    //     }
    //   ]
    // },
    // {
    //   label: "Gender",
    //   type: "radio",
    //   id: "gender",
    //   name: "gender",
    //   radios: [
    //     {
    //       title: "Man",
    //       value: 1
    //     },
    //     {
    //       title: "Women",
    //       value: 2
    //     }
    //   ]
    // },
    {
      type: "textarea",
      id: "text",
      placeholder: "Tap your last name",
      description: "My description"
    },

    {
      label: "First Name",
      type: "text",
      id: "first_name",
      name: "first_name",
      placeholder: "First Name",
      required: true
    },
    {
      label: "Email",
      type: "email",
      id: "email",
      name: "email",
      placeholder: "E-mail",
      required: true
    },
    {
      label: "Telephone",
      type: "tel",
      id: "tel",
      name: "tel",
      placeholder: "+212600000000",
      required: true
    },
    {
      label: "Passowrd",
      type: "password",
      id: "password",
      name: "password",
      placeholder: "Password",
      required: true
    }
  ];

  let values;

  function onSubmit(evt) {
    var form = evt.target;
    if (form.checkValidity() === false) {
      console.log("Error");
    } else {
      console.log("values", values);
    }
    form.classList.add("was-validated");
  }

  onMount(() => {
    // var form = document.getElementsByTagName("form")[0];
    // form.classList.add("was-validated");
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

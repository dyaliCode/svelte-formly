<!-- <script>
  import { get } from "svelte/store";
  import { valuesForm, Step, Field } from "./index";

  // Fetch Users
  const fetchUsers = async () => {
    const res = await fetch(
      "https://jsonplaceholder.cypress.io/users?_limit=10"
    );
    const data = await res.json();
    return data.map((item) => ({ value: item.id, title: item.name }));
  };

  // Fetch posts
  const fetchPosts = async () => {
    const res = await fetch(
      "https://jsonplaceholder.cypress.io/posts?_limit=10"
    );
    const data = await res.json();
    return data.map((item) => ({ value: item.id, title: item.title }));
  };

  let loading = false;

  // Fields
  // const fields = [
  //   {
  //     type: "input",
  //     name: "x",
  //     attributes: {
  //       type: "number",
  //       classes: ["form-control"],
  //       label: "X",
  //     },
  //     rules: ["required"],
  //   },
  //   {
  //     type: "input",
  //     name: "y",
  //     attributes: {
  //       type: "number",
  //       classes: ["form-control"],
  //       label: "Y",
  //     },
  //   },
  //   {
  //     type: "input",
  //     name: "total",
  //     attributes: {
  //       type: "number",
  //       classes: ["form-control"],
  //       label: "X + Y",
  //     },
  //     preprocess: (field, fields, values) => {
  //       if (values.touched === "x" || values.touched === "y") {
  //         field.value = values.x + values.y;
  //       }
  //       return field;
  //     },
  //   },
  //   {
  //     type: "select",
  //     name: "city",
  //     value: 1,
  //     attributes: {
  //       classes: ["form-control"],
  //       label: "City",
  //     },
  //     rules: ["required"],
  //     extra: {
  //       multiple: true,
  //       options: [
  //         {
  //           value: null,
  //           title: "None",
  //         },
  //         {
  //           value: 1,
  //           title: "Agadir",
  //         },
  //         {
  //           value: 2,
  //           title: "Casablanca",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     type: "select",
  //     name: "category",
  //     value: 1,
  //     attributes: {
  //       classes: ["form-control"],
  //       label: "Category",
  //     },
  //     rules: ["required"],
  //     extra: {
  //       options: [
  //         {
  //           value: null,
  //           title: "None",
  //         },
  //         {
  //           value: 1,
  //           title: "Users",
  //         },
  //         {
  //           value: 2,
  //           title: "Posts",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     type: "select",
  //     name: "items",
  //     attributes: {
  //       classes: ["form-control"],
  //       label: "Items",
  //     },
  //     extra: {},
  //     preprocess: async (field, fields, values) => {
  //       if (values.touched === "category" || values.category) {
  //         loading = true;
  //         field.extra.options =
  //           values.category == 1 ? await fetchUsers() : await fetchPosts();
  //         field.value = null;
  //         loading = false;
  //       }
  //       return field;
  //     },
  //   },
  //   {
  //     type: "checkbox",
  //     name: "choose",
  //     attributes: {
  //       label: "Checkbox",
  //       id: "choose",
  //       classes: [""],
  //     },
  //     extra: {
  //       items: [
  //         {
  //           name: "item1",
  //           value: "value1",
  //           title: "Value 1",
  //         },
  //         {
  //           name: "item2",
  //           value: "value2",
  //           title: "Value 2",
  //         },
  //       ],
  //     },
  //   },
  //   {
  //     type: "file", // required
  //     name: "name_file", // require
  //     attributes: {
  //       id: "my-custom-field", // optional
  //       classes: ["form-control"], // optional
  //       label: "Image", // optional
  //     },
  //     extra: {
  //       multiple: true, // optional
  //       showPreview: true, // optional
  //     },
  //     rules: ["file"],
  //     file: {
  //       // need to add this attribute object if you need a file rule
  //       types: "jpg,gif,png",
  //       maxsize: 5,
  //     },
  //   },
  //   {
  //     type: "autocomplete", // required
  //     name: "name-field-autocomplete", // required
  //     value: [
  //       {
  //         value: 1,
  //         title: "item 1",
  //       },
  //     ],
  //     attributes: {
  //       id: "id-field-autocomplete", // required
  //     },
  //     extra: {
  //       multiple: true, // optional
  //       loadItemes: [
  //         // list items with id and title attributes.
  //         {
  //           value: 1,
  //           title: "item 1",
  //         },
  //         {
  //           value: 2,
  //           title: "item 2",
  //         },
  //         {
  //           value: 3,
  //           title: "item 3",
  //         },
  //         {
  //           value: 4,
  //           title: "item 4",
  //         },
  //       ],
  //     },
  //   },
  // ];

  // const fields = [
  //   {
  //     type: "select",
  //     name: "city",
  //     // default_value: [2],
  //     attributes: {
  //       classes: ["form-control"],
  //       label: "City",
  //     },
  //     rules: ["required"],
  //     extra: {
  //       multiple: true,
  //       options: [
  //         {
  //           value: null,
  //           title: "None",
  //         },
  //         {
  //           value: 1,
  //           title: "Agadir",
  //         },
  //         {
  //           value: 2,
  //           title: "Casablanca",
  //         },
  //       ],
  //     },
  //   },
  // ];

  const fields = [
    {
      title: "Group1",
      group: [
        {
          type: "input",
          name: "firstname",
          attributes: {
            type: "text",
            classes: ["form-control"],
            placeholder: "Tap your first name",
          },
          rules: ["required", "min:6"],
          messages: {
            required: "Firstname field is required!",
            min: "First name field must have more that 6 caracters!",
          },
        },
        {
          type: "input",
          name: "password",
          attributes: {
            type: "password",
            classes: ["form-control"],
            placeholder: "Tap your password",
          },
          rules: ["required", "min:6"],
          messages: {
            required: "password field is required!",
            min: "Password field must have more that 6 caracters!",
          },
        },
      ],
    },
    {
      title: "Group2",
      group: [
        {
          type: "input",
          name: "city",
          attributes: {
            type: "text",
            classes: ["form-control"],
            placeholder: "Tap your city",
          },
          rules: ["required", "min:6"],
          messages: {
            required: "city field is required!",
            min: "city field must have more that 6 caracters!",
          },
        },
      ],
    },
  ];

  let result = {};
  const onSubmit = async () => {
    console.log("onSubmit");
    result = $valuesForm;
    console.log("result", result);
  };
</script>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
    crossorigin="anonymous"
  />
</svelte:head>

<code>
  <pre>
    {JSON.stringify(
      $valuesForm.values.name_file
        ? $valuesForm.values.name_file[0].name
        : null,
      null,
      2
    )}
  </pre>
</code>
<div class="container">
  <div class="row">
    <h2>Svelte Formly 1.1.1</h2>
    <i>Preprocess</i>
  </div>

  <div class="row">
    <pre>
			<code>{JSON.stringify(result, null, 2)}</code>
		</pre>
  </div>

  <div class="row">
    <form on:submit|preventDefault={onSubmit} class="custom-form">
      <Field {fields} />
      <button type="button" on:click={onSubmit}>Submit</button>
    </form>
  </div>
</div>

<style>
  .row {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: solid 1px #ff3e00;
  }
  :global(.form-group) {
    margin-bottom: 20px;
  }
  :global(.invalid-feedback) {
    color: red;
    display: block !important;
  }
  .custom-form :global(.form-check) {
    padding-left: 0;
  }
</style> -->
<script>
  import Form1 from "./Form1.svelte";
  import Form2 from "./Form2.svelte";

  let values = {};

  function submitFormHandler(event) {
    values[event.detail.name] = event.detail.values;
  }
</script>

<!-- <svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
  />
</svelte:head> -->

<!-- <h2>Values</h2> -->
<!-- <pre>
  <code>{JSON.stringify(values, null, 2)}</code>
</pre> -->
<hr />
<Form1 />
<hr />
<Form2 />

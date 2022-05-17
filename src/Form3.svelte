<script>
  import { Field } from "./index";

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
  const form_name = "form3";
  const fields = [
    {
      type: "input",
      name: "x",
      attributes: {
        type: "number",
        classes: ["form-control"],
        label: "X",
      },
      rules: ["required"],
    },
    {
      type: "input",
      name: "y",
      attributes: {
        type: "number",
        classes: ["form-control"],
        label: "Y",
      },
    },
    {
      type: "input",
      name: "total",
      attributes: {
        type: "number",
        classes: ["form-control"],
        label: "X + Y",
      },
      preprocess: (field, fields, values) => {
        if (values.touched === "x" || values.touched === "y") {
          field.value = values.x + values.y;
        }
        return field;
      },
    },
    {
      type: "select",
      name: "city",
      value: [1],
      attributes: {
        classes: ["form-control"],
        label: "City",
      },
      rules: ["required"],
      extra: {
        multiple: true,
        options: [
          {
            value: null,
            title: "None",
          },
          {
            value: 1,
            title: "Agadir",
          },
          {
            value: 2,
            title: "Casablanca",
          },
        ],
      },
    },
    {
      type: "select",
      name: "category",
      value: 1,
      attributes: {
        classes: ["form-control"],
        label: "Category",
      },
      rules: ["required"],
      extra: {
        options: [
          {
            value: null,
            title: "None",
          },
          {
            value: 1,
            title: "Users",
          },
          {
            value: 2,
            title: "Posts",
          },
        ],
      },
    },
    {
      type: "select",
      name: "items",
      attributes: {
        classes: ["form-control"],
        label: "Items",
      },
      extra: {},
      preprocess: async (field, fields, values) => {
        if (values.touched === "category" || values.category) {
          loading = true;
          field.extra.options =
            values.category == 1 ? await fetchUsers() : await fetchPosts();
          field.value = null;
          loading = false;
        }
        return field;
      },
    },
    {
      type: "checkbox",
      name: "choose",
      attributes: {
        label: "Checkbox",
        id: "choose",
        classes: [""],
      },
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
    },
    {
      type: "file", // required
      name: "name_file", // require
      attributes: {
        id: "my-custom-field", // optional
        classes: ["form-control"], // optional
        label: "Image", // optional
      },
      extra: {
        multiple: true, // optional
        showPreview: true, // optional
      },
      rules: ["file"],
      file: {
        // need to add this attribute object if you need a file rule
        types: "jpg,gif,png",
        maxsize: 5,
      },
    },
    {
      type: "autocomplete", // required
      name: "name-field-autocomplete", // required
      value: [
        {
          value: 1,
          title: "item 1",
        },
      ],
      attributes: {
        id: "id-field-autocomplete", // required
      },
      extra: {
        multiple: true, // optional
        loadItemes: [
          // list items with id and title attributes.
          {
            value: 1,
            title: "item 1",
          },
          {
            value: 2,
            title: "item 2",
          },
          {
            value: 3,
            title: "item 3",
          },
          {
            value: 4,
            title: "item 4",
          },
        ],
      },
    },
  ];

  let message = "";
  let data = {};

  function getValuesForm(event) {
    data = event.detail.data;
  }

  function onSubmit() {
    if (data.valid) {
      message = JSON.stringify(data, null, 4);
    } else {
      message = "Your form is not valid!";
    }
  }
</script>

<h4>{form_name}</h4>

<pre>
  <code>
    {message}
  </code>
</pre>

<form on:submit|preventDefault={onSubmit} class="custom-form">
  <Field {fields} name={form_name} on:form_values={getValuesForm} />
  <button class="btn btn-primary" type="submit">Submit</button>
</form>

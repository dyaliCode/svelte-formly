<script>
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';

  // Fetch Users
  const fetchUsers = async () => {
    const res = await fetch(
      'https://jsonplaceholder.cypress.io/users?_limit=10'
    );
    const data = await res.json();
    return data.map((item) => ({ value: item.id, title: item.name }));
  };

  // Fetch posts
  const fetchPosts = async () => {
    const res = await fetch(
      'https://jsonplaceholder.cypress.io/posts?_limit=10'
    );
    const data = await res.json();
    return data.map((item) => ({ value: item.id, title: item.title }));
  };

  let loading = false;

  // Fields
  const fields = [
    {
      type: 'input',
      name: 'x',
      attributes: {
        type: 'number',
        classes: ['form-control'],
        label: 'X',
      },
      rules: ['required'],
    },
    {
      type: 'input',
      name: 'y',
      attributes: {
        type: 'number',
        classes: ['form-control'],
        label: 'Y',
      },
    },
    {
      type: 'input',
      name: 'total',
      attributes: {
        type: 'number',
        classes: ['form-control'],
        label: 'X + Y',
      },
      preprocess: (field, fields, values) => {
        if (values.touched === 'x' || values.touched === 'y') {
          field.value = values.x + values.y;
        }
        return field;
      },
    },
    {
      type: 'select',
      name: 'category',
      attributes: {
        classes: ['form-control'],
        label: 'Category',
      },
      rules: ['required'],
      extra: {
        options: [
          {
            value: null,
            title: 'None',
          },
          {
            value: 1,
            title: 'Users',
          },
          {
            value: 2,
            title: 'Posts',
          },
        ],
      },
    },
    {
      type: 'select',
      name: 'items',
      attributes: {
        classes: ['form-control'],
        label: 'Items',
      },
      extra: {},
      preprocess: async (field, fields, values) => {
        if (values.touched === 'category') {
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
      type: 'checkbox',
      name: 'choose',
      attributes: {
        label: 'Checkbox',
        id: 'choose',
        classes: [''],
      },
      extra: {
        items: [
          {
            name: 'item1',
            value: 'value1',
            title: 'Value 1',
          },
          {
            name: 'item2',
            value: 'value2',
            title: 'Value 2',
          },
        ],
      },
    },
    {
      type: 'file', // required
      name: 'name_file', // require
      attributes: {
        id: 'my-custom-field', // optional
        classes: ['form-control'], // optional
        label: 'Image', // optional
      },
      extra: {
        multiple: true, // optional
        showPreview: true, // optional
      },
      rules: ['file'],
      file: {
        // need to add this attribute object if you need a file rule
        types: 'jpg,gif,png',
        maxsize: 5,
      },
    },
  ];

  let result = {};
  const onSubmit = async () => {
    result = $valuesForm;
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
    {JSON.stringify($valuesForm.values.name_file ? $valuesForm.values.name_file[0].name : null, null, 2)}
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
      <button class="btn btn-primary" disabled={loading}
        >{loading ? 'loading...' : 'Create'}</button
      >
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
</style>

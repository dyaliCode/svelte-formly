<script>
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';

  const fetchUsers = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=2`
    );
    const items = await res.json();
    return items.map((item) => {
      return { value: item.id, title: item.username };
    });
  };

  const fetchPosts = async () => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=5&_limit=2`
    );
    const items = await res.json();
    return items.map((item) => {
      return { value: item.id, title: item.title };
    });
  };

  const settings = {
    style: 'bootstrap',
  };

  const fields = [
    {
      prefix: {
        class: ['form-group'],
      },
      value: 'email@email.com',
      type: 'input',
      name: 'email',
      rules: ['required', 'email'],
      // messages: {
      //   email: 'format email not correct',
      // },
      attributes: {
        type: 'email',
        class: ['form-control'],
        label: 'Email',
      },
    },
    {
      prefix: {
        class: ['form-group'],
      },
      type: 'input',
      name: 'a',
      value: 1,
      rules: ['required'],
      attributes: {
        type: 'number',
        class: ['form-control'],
        label: 'A',
      },
    },
    {
      prefix: {
        class: ['form-group'],
      },
      type: 'input',
      name: 'b',
      value: 1,
      rules: ['required'],
      attributes: {
        type: 'number',
        class: ['form-control'],
        label: 'B',
      },
    },
    {
      prefix: {
        class: ['form-group'],
      },
      type: 'input',
      name: 'total',
      rules: ['required'],
      attributes: {
        type: 'text',
        class: ['form-control'],
        label: 'Total',
      },
      preprocess: async (field, fields, values) => {
        console.log(`values`, values);
        const data = get(valuesForm);
        if (values.a && values.b) {
          field.value = `${parseInt(values.a) * parseInt(values.b)} MAD`;
        } else {
          // field.value = '0 MAD';
        }
        return field;
      },
    },
    {
      type: 'input', // required
      name: 'name-field-range', // required
      attributes: {
        type: 'range',
        id: 'id-field-range', // required
        class: ['form-range'], // optional
        label: 'Label field range', // optional
        min: 10, // required
        max: 100, // required
        step: 10, // required
      },
    },
    {
      type: 'select',
      name: 'country',
      attributes: {
        label: 'Country',
      },
      rules: ['required'],
      options: [
        {
          value: null,
          title: 'Any',
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
    {
      type: 'select',
      name: 'city',
      attributes: {
        label: 'City',
      },
      rules: ['required'],
      preprocess: async (field, fields, values) => {
        const value = values.country;

        let options = [];
        if (value == 1) {
          options = await fetchUsers();
        } else if (value == 2) {
          options = await fetchPosts();
        }

        options.unshift({
          value: null,
          title: 'SELECT',
        });

        field.options = options;
        field.value = value == 'null' ? null : field.value;
        return field;
      },
    },
    {
      type: 'input',
      name: 'category',
      rules: ['required'],
      value: '',
      attributes: {
        type: 'text',
        class: ['form-control'],
        label: 'Category',
        disabled: true,
      },
      preprocess: async (field, fields, values) => {
        const value = values.country;
        if (value == 1) {
          field.value = 'Fetching from users';
        } else if (value == 2) {
          field.value = 'Fetching from posts';
        }
        // field.value = '';
        return field;
      },
    },
  ];

  function onSubmit() {
    const data = get(valuesForm);
    console.log(`data.onSubmit`, data);
  }
</script>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <form on:submit|preventDefault={onSubmit}>
        <Field {fields} {settings} />
        <button class="btn btn-primary btn-lg btn-block" type="submit"
          >Submit</button
        >
      </form>
    </div>
  </div>
</div>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
    crossorigin="anonymous"
  />
</svelte:head>

<style>
  :global(.invalid-feedback) {
    display: block !important;
  }
  :global(.form-group) {
    margin-bottom: 20px;
    padding: 20px;
    border: solid 1px #ddd;
  }
</style>

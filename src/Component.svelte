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
      type: 'select',
      name: 'country',
      attributes: {
        type: 'text',
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
        type: 'text',
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
</style>

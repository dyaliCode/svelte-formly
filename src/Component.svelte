<script>
  import { afterUpdate } from 'svelte';
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';
  import { fieldsStore } from './lib/stores';

  let data = $valuesForm;
  $: values = data;

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
    console.log('fetch Posts');
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
    const items = await res.json();
    return items.map((item) => {
      return { value: item.id, title: item.title };
    });
  };

  const fields = [
    // {
    //   type: 'input',
    //   name: 'username',
    //   attributes: {
    //     label: 'Username',
    //     type: 'text',
    //     classes: ['form-control'],
    //   },
    //   rules: ['email'],
    // },
    // {
    //   type: 'radio', // required
    //   name: 'name-field', // required
    //   attributes: {
    //     id: 'id-field', // required
    //     classes: [], // optional
    //     label: 'Radio', // optional
    //   },
    //   extra: {
    //     items: [
    //       {
    //         id: 'radio-1',
    //         value: 1,
    //         title: 'radio 1',
    //       },
    //       {
    //         id: 'radio-2',
    //         value: 2,
    //         title: 'radio 2',
    //       },
    //     ],
    //   },
    //   rules: [], // optional
    //   preprocess: async (field, fields, values) => {
    //     console.log(`values.username`, values.username);
    //     // Hook to alter current field
    //     if (values.username == 'kamal') {
    //       const posts = await fetchPosts();
    //       field.attributes.label = 'Radio updated ' + posts.length;
    //       field.extra.items = [...field.extra.items, { id: 1, title: 'kamal' }];
    //     } else {
    //       field.attributes.label = 'LABEL';
    //     }
    //     return field;
    //   },
    // },
    // {
    //   type: 'file',
    //   name: 'name-file',
    //   attributes: {
    //     id: 'id-field', // required
    //     classes: ['form-control'], // optional
    //     label: 'Image', // optional
    //   },
    //   extra: {
    //     multiple: true,
    //   },
    //   rules: ['file'],
    //   file: {
    //     types: 'jpg,gif,png',
    //     maxsize: 5,
    //   },
    // },
    // {
    //   type: 'input',
    //   name: 'firstname',
    //   attributes: {
    //     type: 'text',
    //     id: 'username',
    //     classes: ['form-control'],
    //     placeholder: 'Tap your first name',
    //   },
    //   rules: ['required', 'min:6'],
    //   messages: {
    //     required: 'Firstname field is required!',
    //     min: 'First name field must have more that 6 caracters!',
    //   },
    // },
    // {
    //   type: 'input',
    //   name: 'password',
    //   attributes: {
    //     type: 'password',
    //     id: 'password',
    //     classes: ['form-control'],
    //     placeholder: 'Tap your password',
    //   },
    //   rules: ['required', 'min:6'],
    //   messages: {
    //     required: 'password field is required!',
    //     min: 'Password field must have more that 6 caracters!',
    //   },
    // },
  ];

  function onSubmit() {
    const data = get(valuesForm);
    console.log(`data.onSubmit`, data);
  }

  afterUpdate(() => {
    data = get(valuesForm);
  });
</script>

<div class="container">
  <div class="row">
    <div class="col-md-12">
      <form on:submit|preventDefault={onSubmit}>
        <Field {fields} />
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
    /* border: solid 1px var(--theme-color-border); */
  }
</style>

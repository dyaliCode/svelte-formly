<script>
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';

  const settings = {
    style: 'bootstrap',
  };

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
      `https://jsonplaceholder.typicode.com/posts?_limit=2`
    );
    const items = await res.json();
    return items.map((item) => {
      return { value: item.id, title: item.title };
    });
  };

  // onMount(async () => {
  //   const users = await fetchUsers();
  //   console.log(`users`, users);
  // });

  const fields = [
    // {
    //   type: 'input',
    //   name: 'total',
    //   attributes: {
    //     type: 'number',
    //     class: ['form-control'],
    //     placeholder: 'Tap your total',
    //     label: 'Total',
    //   },
    //   rules: ['required', 'min:6'],
    //   messages: {
    //     required: 'Total field is required!',
    //     min: 'Total field must have more that 6 caracters!',
    //   },
    //   preprocess: (field, fields) => {
    //     field.value = field.value ? field.value * 2 : field.value;
    //   },
    // },
    // {
    //   type: 'input',
    //   name: 'firstname',
    //   attributes: {
    //     type: 'text',
    //     class: ['form-control'],
    //     placeholder: 'Tap your first name',
    //     label: 'firstname',
    //   },
    //   rules: ['required', 'min:6'],
    //   messages: {
    //     required: 'Firstname field is required!',
    //     min: 'First name field must have more that 6 caracters!',
    //   },
    //   preprocess: (field, fields) => {
    //     field.value = field.value ? field.value.toUpperCase() : field.value;
    //   },
    // },
    {
      type: 'select',
      name: 'country',
      attributes: {
        type: 'text',
        label: 'Country',
      },
      value: null,
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
      preprocess: async (field, values) => {
        // let options = [];
        // if (values.country) {
        //   if (values.country == 1) {
        //     options = [
        //       {
        //         value: 'null',
        //         title: 'Any',
        //       },
        //       {
        //         value: '3',
        //         title: 'Agadir',
        //       },
        //       {
        //         value: '4',
        //         title: 'Casablanca',
        //       },
        //     ];
        //   } else if (values.country == 2) {
        //     console.log(`333`, 333);
        //     options = [
        //       {
        //         value: 'null',
        //         title: 'Any',
        //       },
        //       {
        //         value: '5',
        //         title: 'Seol',
        //       },
        //       {
        //         value: '6',
        //         title: 'Toyota',
        //       },
        //     ];
        //   }
        // } else {
        //   options = [];
        // }

        let options = [];
        if (values.country == 1) {
          options = await fetchUsers();
        } else if (values.country == 2) {
          options = await fetchPosts();
        }

        field.options = options;
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

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
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_start=5&_limit=2`
    );
    const items = await res.json();
    return items.map((item) => {
      return { value: item.id, title: item.title };
    });
  };

  const fields = [
    {
      type: 'autocomplete',
      name: 'gender',
      // attributes: {
      //   placeholder: 'Tap here...',
      // },
      extra: {
        loadItemes: [],
        multiple: true,
      },
      preprocess: async (field, fields, values) => {
        if (field.extra.loadItemes.length === 0) {
          field.extra.loadItemes = await fetchPosts();
        }
        return field;
      },
    },
  ];

  function onSubmit() {
    const data = get(valuesForm);
    console.log(`data.onSubmit`, data);
  }

  afterUpdate(() => {
    data = get(valuesForm);
  });
</script>

<pre>
  <code>
    {JSON.stringify(values, null, 2)}
  </code>
</pre>

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

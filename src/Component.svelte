<script>
  import { valuesForm, Field } from './index';

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
    // {
    //   type: 'input',
    //   name: 'total',
    //   attributes: {
    //     type: 'number',
    //     classes: ['form-control'],
    //     label: 'X * Y',
    //   },
    //   preprocess: (field, fields, values) => {
    //     if (values.touched === 'x' || values.touched === 'y') {
    //       field.value = values.x * values.y;
    //     }
    //     return field;
    //   },
    // },
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
<div class="container">
  <div class="row">
    <h2>Svelte Formly 2.0.0</h2>
    <i>Preprocess</i>
  </div>

  <div class="row">
    <code>
      <pre>
        {JSON.stringify($valuesForm, null, 2)}
      </pre>
    </code>
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

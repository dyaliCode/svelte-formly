<script>
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';

  let loading = false;

  // Fields
  const fields = [
    {
      type: 'checkbox',
      name: 'check',
      attributes: {
        type: 'checkbox',
        label:
          'Checkbox with some really long text to see if it will wrap at the end of the box',
        id: 'check',
        classes: ['form-check-input', 'checker'],
      },
      extra: {
        aligne: 'inline',
        ite,
      },
      prefix: {
        // classes: ['form-check'],
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

<div class="container">
  <div class="row">
    <h2>Svelte Formly 1.0.1</h2>
    <i>Preprocess</i>
  </div>

  <div class="row">
    <pre>
			<code>{JSON.stringify(result, null, 2)}</code>
		</pre>
  </div>

  <div class="row">
    <form on:submit|preventDefault={onSubmit}>
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
</style>

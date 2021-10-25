<script>
  import { get } from 'svelte/store';

  import { valuesForm, Field } from './index';
  const fields = [
    {
      type: 'input',
      name: 'First name',
      attributes: {
        type: 'text',
        label: 'First name',
        id: 'firstname',
        classes: ['form-control'],
      },
      prefix: {
        classes: ['form-group', 'col-4'],
      },
    },
    {
      type: 'input',
      name: 'lastname',
      attributes: {
        type: 'text',
        label: 'Last name',
        id: 'lastname',
        classes: ['form-control'],
      },
      prefix: {
        classes: ['form-group', 'col-4'],
      },
    },
    {
      type: 'checkbox',
      name: 'check',
      attributes: {
        label:
          'Checkbox with some really long text to see if it will wrap at the end of the box',
        id: 'check',
        classes: ['form-check-input', 'checker'],
      },
      extra: {
        // 					aligne: 'inline',
        items: [
          {
            name: 'name1',
            title: 'Name 1',
            value: 1,
          },
          {
            name: 'name2',
            title: 'Name 2',
            value: 2,
          },
        ],
      },
      prefix: {
        classes: ['mb-3', 'form-group'],
      },
    },
  ];

  let message = '';
  let values = {};
  let color = '#ff3e00';

  function onSubmit() {
    const data = get(valuesForm);
    if (data.valid) {
      message = JSON.stringify(data, null, 2);
    } else {
      message = 'Your form is not valid!';
    }
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
  />
</svelte:head>

<div class="container">
  <h1 style="--theme-color: {color}">Svelte Formly</h1>
  <h3>
    <code>
      <pre>
        {message}
      </pre>
    </code>
  </h3>
  <form
    on:submit|preventDefault={onSubmit}
    class="custom-form"
    style="--theme-color: {color}"
  >
    <Field {fields} />
    <button class="btn btn-primary" type="submit">Submit</button>
  </form>

  <span id="to-avoid-svelte-repl-errors" class="inline checker" />
</div>

<style>
  .inline {
    display: inline;
  }
  .checker {
    width: 20px !important;
    height: 20px !important;
  }
  .checker:before {
    display: inline;
  }
  .custom-form :global(.form-group) {
    padding: 10px;
    border: solid 1px var(--theme-color);
    margin-bottom: 10px;
  }
  .custom-form :global(.custom-form-group) {
    padding: 10px;
    background: var(--theme-color);
    color: white;
    margin-bottom: 10px;
  }
  .custom-form :global(.class-description) {
    color: var(--theme-color);
  }
</style>

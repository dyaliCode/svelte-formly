<script>
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';

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
      value: null,
      options: [
        {
          value: null,
          title: 'Any',
        },
        {
          value: 1,
          title: 'Morocco',
        },
        {
          value: 2,
          title: 'Japan',
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
      validation: ['required'],
      preprocess: (field, values) => {
        let options = [];
        if (values.country) {
          if (values.country == 1) {
            options = [
              {
                value: null,
                title: 'Any',
              },
              {
                value: 3,
                title: 'Agadir',
              },
              {
                value: 4,
                title: 'Casablanca',
              },
            ];
          } else {
            options = [
              {
                value: null,
                title: 'Any',
              },
              {
                value: 5,
                title: 'Seol',
              },
              {
                value: 6,
                title: 'Toyota',
              },
            ];
          }
          field.value = options[0].value;
        } else {
          field.value = null;
        }
        field.options = options;
        return field;
      },
    },
  ];

  function onSubmit() {
    const data = get(valuesForm);
    const values = data.values;
    console.log(`data`, data.values, data.isValidForm);
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

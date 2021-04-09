<script>
  import { get } from 'svelte/store';
  import { valuesForm, Field } from './index';

  const fields = [
    {
      container: {
        prefix:
          '<div class="row g-3" style="border: solid 1px blue; height: 100px">ss',
        suffix: '',
      },
      group: {
        type: 'icon',
        text: 'fa fa-user',
      },
      prefix: {
        class: ['input-group mb-3'],
      },
      type: 'text',
      name: 'firstname',
      id: 'id-firstname',
      // class: ['form-control'],
      placeholder: 'Tap your first name',
      validation: ['required', 'min:6'],
      messages: {
        required: 'Firstname field is required!',
        min: 'First name field must have more that 6 caracters!',
      },
    },
    {
      group: {
        type: 'icon',
        text: 'fas fa-lock',
      },
      prefix: {
        class: ['input-group mb-3'],
      },
      type: 'textarea',
      name: 'textarea',
      id: 'id-textarea',
      class: ['form-control'],
      placeholder: 'Tap your textarea',
      validation: ['required', 'min:6'],
      messages: {
        required: 'textarea field is required!',
        min: 'textarea field must have more that 6 caracters!',
      },
      container: {
        prefix: '',
        suffix: '</div>',
      },
    },
    {
      prefix: {
        class: ['input-group mb-3'],
      },
      type: 'file',
      name: 'file',
      id: 'id-file',
      class: ['form-control'],
      placeholder: 'Tap your file',
      validation: ['required'],
      messages: {
        required: 'file field is required!',
      },
      multiple: true,
      showPreview: true,
    },
  ];

  let message = '';
  let values = {};
  function onSubmit() {
    const data = get(valuesForm);
    values = data.values;
    if (data.isValidForm) {
      message = 'Congratulation! now your form is valid';
    } else {
      message = 'Your form is not valid!';
    }
  }

  const settings = {
    style: 'bootstrap'
  }
</script>

<svelte:head>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6"
    crossorigin="anonymous"
  />
  <!-- Font Awesome -->
  <link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.15.3/css/all.css"
    integrity="sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk"
    crossorigin="anonymous"
  />
</svelte:head>

<div class="container">
  <div class="row col-md-12">
    Message: {message}
    <br />
    Values: {JSON.stringify(values)}
    <hr />

    <form on:submit|preventDefault={onSubmit}>
      <Field fields={fields} {settings} />
      <button class="btn btn-primary btn-lg btn-block" type="submit"
        >Submit</button
      >
    </form>
  </div>
</div>

<style>
  :global(.invalid-feedback) {
    display: block !important;
  }
</style>

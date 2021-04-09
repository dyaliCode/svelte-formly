<script>
  import { onMount, afterUpdate } from 'svelte';
  import { validator } from './Validation/';
  import { valuesForm } from './lib/stores.js';

  let container;
  let values = [];
  let isValidForm = true;

  const fields = [
    {
      type: 'input',
      name: 'username',
      attributes: {
        required: true,
        type: 'text',
        id: 'id-username',
        class: ['classs-username'],
        name: 'username',
        placeholder: 'Your username',
      },
      validation: ['required', 'min:6'],
    },
    {
      type: 'input',
      name: 'password',
      attributes: {
        type: 'password',
        id: 'id-password',
        name: 'password',
        class: ['classs-password'],
        placeholder: 'Your password',
      },
    },
    {
      type: 'input',
      name: 'email',
      attributes: {
        type: 'email',
        id: 'id-email',
        name: 'email',
        class: ['classs-email'],
        placeholder: 'Your email',
        required: '',
      },
    },
  ];

  const setValuesForm = (isValidForm, values) => {
    valuesForm.set({
      isValidForm,
      values: { ...values },
    });
  };

  // Change values.
  const changeValueHander = (event) => {
    values[`${event.target.name}`] = event.target.value;
    fields.filter((field) => {
      if (field.name === event.target.name) {
        field.value = event.target.value;
      }
    });
    setValuesForm(isValidForm, values);
  };

  const submitHander = (event) => {
    event.preventDefault();
  };

  // Validation Form.
  let fieldsToValidate = {};
  const form = validator(() => {
    if (fields.length > 0) {
      fields.map((field) => {
        let { validation } = field;
        const value = field.value ? field.value : null;
        const fieldValidate = {
          [field.name]: {
            value: values[field.name] ? values[field.name] : value,
            validators: validation,
            file: field.type === 'file' ? field.file : null,
          },
        };
        fieldsToValidate = { ...fieldsToValidate, ...fieldValidate };
      });
    }
    return fieldsToValidate;
  });
  form.subscribe((data) => {
    isValidForm = data.valid;
    setValuesForm(isValidForm, values);

    if (!isValidForm) {
      fields.map((field) => {
        if ($form[field.name].validation.errors.length > 0) {
          $form[field.name].validation.errors.map((error) => {
            const el = document.getElementById(field.attributes.id);
            const parent = el.parentNode;
            console.log(`error`, error);
            const elError = document.createElement('span');
            elError.innerHTML = 'error';
            parent.querySelector('span').innerHTML(elError);
          });
        }
      });
    }
  });

  onMount(() => {
    $valuesForm;

    // Create fields.
    fields.map((field) => {
      const wraper = document.createElement('div');
      const el = document.createElement(field.type);
      el.setAttribute('type', 'text');
      el.setAttribute('name', field.attributes.name);
      el.setAttribute('id', field.attributes.id);
      el.setAttribute('placeholder', field.attributes.placeholder);
      el.addEventListener('input', changeValueHander);
      field.attributes.required ? (el.required = true) : (el.required = false);
      wraper.appendChild(el);
      container.appendChild(wraper);

      console.log(`field`, field);
    });

    // Add button submit
    const el = document.createElement('button');
    el.textContent = 'Save';
    el.setAttribute('type', 'submit');
    el.addEventListener('click', submitHander);
    container.appendChild(el);
  });

  afterUpdate(() => {});
</script>

<span>{JSON.stringify($valuesForm)}</span>
<hr />
<div>{JSON.stringify($form, 2, null)}</div>
<hr />
<form bind:this={container} />

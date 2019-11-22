<script>
  import { onMount, onDestroy } from "svelte";
  import { form } from "../Validation/";
  import { valuesForm } from "./stores.js";

  // Import components.
  import Input from "./Input.svelte";
  import Textarea from "./Textarea.svelte";
  import Select from "./Select.svelte";
  import Radio from "./Radio.svelte";

  // Declar variables;
  export let fields = [];
  let values = [];
  let isValidForm = true;

  // Set valeurs form and status validation.
  const setValuesForm = (isValidForm, values) => {
    valuesForm.set({
      isValidForm,
      values: { ...values }
    });
  };

  // Change value
  function changeValueHander(event) {
    values[`${event.detail.name}`] = event.detail.value;
    setValuesForm(isValidForm, values);
  }

  // Validation Form.
  let fieldsToValidate = {};
  const myForm = form(() => {
    if (fields.length > 0) {
      fields.map(field => {
        let { validation } = field;
        const fieldValidate = {
          [field.name]: {
            value: values[field.name] ? values[field.name] : "",
            validators: validation
          }
        };
        fieldsToValidate = { ...fieldsToValidate, ...fieldValidate };
      });
    }

    return fieldsToValidate;
  });
  myForm.subscribe(data => {
    isValidForm = data.valid;
    setValuesForm(isValidForm, values);
  });

  // Lifecycle mount to subscribe.
  onMount(() => {
    $valuesForm;
  });

  // Lifecycle destroy to unbscribe.
  onDestroy([valuesForm, myForm]);
</script>

<style>
  .form-group {
    margin-bottom: 10px;
  }
</style>

{#each fields as field}
  <div class="form-group">
    {#if field.label}
      <label for={field.id}>{field.label}</label>
    {/if}

    {#if field.type == 'text' || field.type == 'password' || field.type == 'email' || field.type == 'number' || field.type == 'tel'}
      <Input
        label={field.label}
        type={field.type}
        id={field.id}
        name={field.name}
        classe={field.class}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        required={field.required}
        disabled={field.disabled}
        value={field.value}
        on:changeValue={changeValueHander} />
    {:else if field.type == 'textarea'}
      <Textarea
        label={field.label}
        type={field.type}
        id={field.id}
        name={field.name}
        classe={field.class}
        placeholder={field.placeholder}
        required={field.required}
        disabled={field.disabled}
        on:changeValue={changeValueHander} />
    {:else if field.type == 'select'}
      <Select
        label={field.label}
        type={field.type}
        id={field.id}
        name={field.name}
        classe={field.class}
        options={field.options}
        on:changeValue={changeValueHander} />
    {:else if field.type == 'radio'}
      <Radio
        label={field.label}
        name={field.name}
        radios={field.radios}
        aligne={field.aligne}
        on:changeValue={changeValueHander} />
    {/if}

    {#if field.description}
      <small id={field.id} class="form-text text-muted">
        {field.description}
      </small>
    {/if}

    <!-- Error messages -->
    {#if $myForm[field.name].errors.length > 0}
      <div class="invalid-feedback" style="display:block">
        {#if $myForm[field.name].errors.includes('required')}
          {field.name} is required!
        {:else if $myForm[field.name].errors.includes('min')}
          {field.name} min
        {:else if $myForm[field.name].errors.includes('max')}
          {field.name} max
        {:else if $myForm[field.name].errors.includes('email')}
          {field.name} is invalid email
        {/if}
      </div>
    {:else}
      <div class="valid-feedback">Looks good!</div>
    {/if}

  </div>
{/each}

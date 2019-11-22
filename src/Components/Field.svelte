<script>
  import { onMount, onDestroy } from "svelte";
  import { form } from "../Validation/";
  import { valuesForm } from "./stores.js";

  //Import components.
  import Input from "./Input.svelte";
  import Textarea from "./Textarea.svelte";
  import Select from "./Select.svelte";
  import Radio from "./Radio.svelte";

  export let fields = [];
  let values = [];

  onMount(() => {
    $valuesForm;
  });

  // Change value
  function changeValueHander(event) {
    values[`${event.detail.name}`] = event.detail.value;
    valuesForm.set(values);
  }

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

  onDestroy([valuesForm, myForm]);
</script>

{#each fields as field (field.id)}
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
        on:changeValue={changeValueHander}
        myform={myForm} />
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
        options={field.options}
        on:changeValue={changeValueHander} />
    {:else if field.type == 'select'}
      <Select
        label={field.label}
        type={field.type}
        id={field.id}
        name={field.name}
        classe={field.class}
        placeholder={field.placeholder}
        required={field.required}
        disabled={field.disabled}
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
    <!-- <p>{JSON.stringify($myform[name].valid)}</p> -->
    {#if $myForm[field.name].errors.length > 0}
      <div class="invalid-feedback" style="display:block">
        <!-- <p>{JSON.stringify(fieldsToValidate[field.name].validators)}</p> -->
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

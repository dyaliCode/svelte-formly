<script>
  import Input from "./Input.svelte";
  import Textarea from "./Textarea.svelte";
  import Select from "./Select.svelte";
  import Radio from "./Radio.svelte";

  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { form } from "svelte-forms";
  import { valuesForm } from "./stores.js";

  export let fields = [];
  let values = [];

  function changeValueHander(event) {
    values[`${event.detail.name}`] = event.detail.value;
    valuesForm.set(values);
  }

  onMount(() => {
    $valuesForm;
    console.log("$valuesForm", $valuesForm);
  });

  let fieldsToValidate = {};
  if (fields.length > 0) {
    fields.map(field => {
      let { validation } = field;
      const fieldValidate = {
        [field.name]: {
          value: values[field.name] ? values[field.name] : "",
          validators: validation
        }
      };
      fieldsToValidate = fieldValidate;
    });
  }

  console.log("fieldsToValidate", fieldsToValidate);

  const myForm = form(() => fieldsToValidate);
</script>

{#each fields as field (field.id)}
  <div class="form-group">
    {#if field.label}
      <label for={field.id}>{field.label}</label>
    {/if}

    {#if $myForm.lastname.errors.includes('min')}
      <p>The name is invalid</p>
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
  </div>
{/each}

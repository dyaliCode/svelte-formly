<script>
  import { onMount, onDestroy } from "svelte";
  import clsx from "clsx";
  import { validator } from "../Validation/";
  import { valuesForm } from "./stores.js";

  // Import components.
  import Tag from "./Tag.svelte";
  import Input from "./Input.svelte";
  import Textarea from "./Textarea.svelte";
  import Select from "./Select.svelte";
  import Radio from "./Radio.svelte";
  import Message from "./Message.svelte";

  // Declar variables;
  export let fields = [];
  let values = [];
  let isValidForm = true;
  let defaultAttributes = {
    field: {
      prefix: {
        tag: "div",
        classes: ["default-field"]
      }
    },
    description: {
      tag: "div",
      classes: [""]
    }
  };

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
  const myForm = validator(() => {
    if (fields.length > 0) {
      fields.map(field => {
        let { validation } = field;
        const value = field.value ? field.value : "";
        const fieldValidate = {
          [field.name]: {
            value: values[field.name] ? values[field.name] : value,
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
  {field.wrapper.tag}
  <Tag tag="div" classes={clsx(field.wrapper.classes)}>
    <!-- Label -->
    {#if field.label}
      <label for={field.id}>{field.label}</label>
    {/if}
    <!-- Field -->
    {#if field.type == 'text' || field.type == 'password' || field.type == 'email' || field.type == 'number' || field.type == 'tel'}
      <Input
        type={field.type}
        id={field.id}
        name={field.name}
        value={field.value}
        classe={field.class}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        disabled={field.disabled}
        on:changeValue={changeValueHander} />
    {:else if field.type == 'textarea'}
      <Textarea
        id={field.id}
        name={field.name}
        value={field.value}
        classe={field.class}
        rows={field.rows}
        cols={field.cols}
        disabled={field.disabled}
        on:changeValue={changeValueHander} />
    {:else if field.type == 'select'}
      <Select
        id={field.id}
        name={field.name}
        classe={field.class}
        disabled={field.readonly}
        options={field.options}
        on:changeValue={changeValueHander} />
    {:else if field.type == 'radio'}
      <Radio
        name={field.name}
        radios={field.radios}
        aligne={field.aligne}
        on:changeValue={changeValueHander} />
    {/if}
    <!-- Description -->
    {#if field.description}
      <Tag tag={field.description.tag} classes={field.description.classes}>
        {field.description.text}
      </Tag>
    {/if}
    <!-- Error messages -->
    {#if !isValidForm}
      {#if $myForm[field.name].validation.errors.length > 0}
        <Message validation={$myForm[field.name].validation} {field} />
      {/if}
    {/if}
  </Tag>
{/each}

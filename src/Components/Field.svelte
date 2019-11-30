<script>
  import { onMount, onDestroy } from "svelte";
  import { get } from "svelte/store";
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

  const typeFielComponents = {
    text: Input,
    password: Input,
    email: Input,
    tel: Input,
    number: Input,
    range: Input,
    date: Input,
    color: Input,
    datetimelocal: Input,
    textarea: Textarea,
    select: Select,
    radio: Radio
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
  const form = validator(() => {
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
  form.subscribe(data => {
    isValidForm = data.valid;
    setValuesForm(isValidForm, values);
  });

  // Lifecycle mount to subscribe.
  onMount(() => {
    $valuesForm;
  });

  // Lifecycle destroy to unbscribe.
  onDestroy([valuesForm, form]);
</script>

{#each fields as field}
  <Tag
    tag={field.prefix ? (field.prefix.tag ? field.prefix.tag : 'div') : 'div'}
    classes={field.prefix ? (field.prefix.class ? field.prefix.class : 'form-group') : 'form-group'}>
    <!-- Label -->
    {#if field.label}
      <label for={field.id}>{field.label}</label>
    {/if}
    <!-- Field -->
    <svelte:component
      this={typeFielComponents[field.type]}
      type={field.type}
      id={field.id}
      name={field.name}
      value={field.value}
      classe={field.class}
      placeholder={field.placeholder}
      min={field.min}
      max={field.max}
      step={field.step}
      rows={field.rows}
      cols={field.cols}
      options={field.options}
      radios={field.radios}
      aligne={field.aligne}
      autocomplete={field.autocomplete}
      disabled={field.disabled}
      on:changeValue={changeValueHander} />
    <!-- Description -->
    {#if field.description}
      {#if field.description.text}
        <Tag tag={field.description.tag} classes={field.description.class}>
          {field.description.text}
        </Tag>
      {/if}
    {/if}
    <!-- Error messages -->
    {#if !isValidForm}
      {#if $form[field.name].validation.errors.length > 0}
        {#each $form[field.name].validation.errors as error}
          <Message {error} {field} />
        {/each}
      {/if}
    {/if}
  </Tag>
{/each}

<script>
  import { onMount } from 'svelte';
  import { validator } from '../Validation/';
  import { valuesForm } from './stores.js';
  import { isRequired } from './helpers.js';

  // Import components.
  import Tag from './Tag.svelte';
  import Input from './Input.svelte';
  import Textarea from './Textarea.svelte';
  import Select from './Select.svelte';
  import AutoComplete from './AutoComplete.svelte';
  import Radio from './Radio.svelte';
  import Checkbox from './Checkbox.svelte';
  import File from './File.svelte';
  import Message from './Message.svelte';

  // Declar variables;
  export let fields = [];
  let values = [];
  let isValidForm = true;

  // Set values form and status validation.
  const setValuesForm = (isValidForm, values) => {
    valuesForm.set({
      isValidForm,
      values: { ...values },
    });
  };

  // Change values.
  const changeValueHander = (event) => {
    values[`${event.detail.name}`] = event.detail.value;
    fields.filter((field) => {
      if (field.name === event.detail.name) {
        field.value = event.detail.value;
      }
    });
    setValuesForm(isValidForm, values);
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
  });

  // Lifecycle mount to start.
  onMount(() => {
    $valuesForm;
  });

  // Lifecycle destroy to unbscribe.
  // onDestroy([valuesForm]);
</script>

{#each fields as field (field.name)}
  <Tag
    tag={field.prefix ? (field.prefix.tag ? field.prefix.tag : 'div') : 'div'}
    classes={field.prefix
      ? field.prefix.class
        ? field.prefix.class
        : 'form-group'
      : 'form-group'}
  >
    {#if field.group}
      <span class="input-group-text" id="basic-addon1"
        >{@html field.group ? `<i class="${field.group.text}" />` : ''}</span
      >
    {/if}
    <!-- Label -->
    {#if field.label}
      <label for={field.id} class="label">{field.label}</label>
    {/if}
    <!-- Field -->
    {#if field.type === 'text' || field.type === 'password' || field.type === 'email' || field.type === 'tel' || field.type === 'number' || field.type === 'range' || field.type === 'date' || field.type === 'color' || field.type === 'datetimelocal'}
      <Input
        type={field.type}
        id={field.id}
        name={field.name}
        value={field.value}
        classe={field.class}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        autocomplete={field.autocomplete}
        disabled={field.disabled}
        readonly={field.readonly}
        required={isRequired(field)}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'textarea'}
      <Textarea
        id={field.id}
        name={field.name}
        value={field.value}
        classe={field.class}
        rows={field.rows}
        cols={field.cols}
        disabled={field.disabled}
        readonly={field.readonly}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'select'}
      <Select
        id={field.id}
        name={field.name}
        classe={field.class}
        options={field.options}
        disabled={field.disabled}
        multiple={field.multiple}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'autocomplete'}
      <AutoComplete
        id={field.id}
        name={field.name}
        classe={field.class}
        loadItemes={field.loadItemes}
        disabled={field.disabled}
        multiple={field.multiple}
        on:changeValue={changeValueHander}
        on:onSelectItem
      />
    {:else if field.type === 'radio'}
      <Radio
        name={field.name}
        classe={field.class}
        items={field.items}
        aligne={field.aligne}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'checkbox'}
      <Checkbox
        classe={field.class}
        items={field.items}
        aligne={field.aligne}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'file'}
      <File
        id={field.id}
        name={field.name}
        classe={field.class}
        disabled={field.disabled}
        multiple={field.multiple}
        showPreview={field.showPreview}
        on:changeValue={changeValueHander}
      />
    {/if}
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
        {#each $form[field.name].validation.errors as error, index}
          <Message {error} messages={field.messages} />
        {/each}
      {/if}
    {/if}
  </Tag>
{/each}

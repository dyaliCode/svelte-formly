<script>
  import { afterUpdate, beforeUpdate, onMount, tick } from 'svelte';
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
  let form = validator(() => {
    if (fields.length > 0) {
      fields.map((field) => {
        // Proprecess
        if (field.preprocess) {
          const fnc = field.preprocess;
          field = preprocess_field(field, values, fnc);
        }
        // console.log(`field`, field);
        // console.log(`field`, field.value);
        // console.log('======================');

        let { validation } = field;
        // const value = field.value ? field.value : null;
        const value = field.value;

        const fieldValidate = {
          [field.name]: {
            value: value, // values[field.name] ? values[field.name] : value,
            validators: validation,
            file: field.type === 'file' ? field.file : null,
          },
        };
        fieldsToValidate = { ...fieldsToValidate, ...fieldValidate };
      });
      fields = fields;
    }
    // console.log(`fieldsToValidate`, fieldsToValidate);
    return fieldsToValidate;
  });

  form.subscribe((data) => {
    // console.log(`data`, data);
    isValidForm = data.valid;
    setValuesForm(isValidForm, values);
  });

  // Lifecycle mount to start.
  onMount(() => {
    $valuesForm;
  });

  afterUpdate(() => {
    // console.log(`$valuesForm.values`, $valuesForm.values);
    const validform = validator(() => {
      if (fields.length > 0) {
        fields.map((field) => {
          // Proprecess
          if (field.preprocess) {
            const fnc = field.preprocess;
            field = preprocess_field(field, values, fnc);
          }
          // console.log(`field`, field);
          // console.log(`field`, field.value);
          // console.log('======================');

          let { validation } = field;
          // const value = field.value ? field.value : null;
          const value = field.value;

          const fieldValidate = {
            [field.name]: {
              value: value, // values[field.name] ? values[field.name] : value,
              validators: validation,
              file: field.type === 'file' ? field.file : null,
            },
          };
          fieldsToValidate = { ...fieldsToValidate, ...fieldValidate };
        });
        fields = fields;
      }
      // console.log(`fieldsToValidate`, fieldsToValidate);
      return fieldsToValidate;
    });
    validform.subscribe((data) => {
      console.log(`values subscribe`, values);
      isValidForm = data.valid;
      setValuesForm(isValidForm, values);
    });
    form = validform;
    // form.subscribe((data) => {
    //   // console.log(`datasss`, data);
    //   // console.log(`values subscribe22222222222222`, values);
    //   isValidForm = data.valid;
    //   setValuesForm(isValidForm, values);
    // });
  });

  const preprocess_field = (field, values, fnc) => {
    const newField = fnc.call(null, field, values);
    return newField;
  };

  // Lifecycle destroy to unbscribe.
  // onDestroy([valuesForm]);
</script>

<pre>
  <code>
    {JSON.stringify(fields, null, 2)}
  </code>
</pre>
<hr />
<pre>
  <h2>$FORM</h2>
  <code>
    {JSON.stringify($form, null, 2)}
  </code>
</pre>

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
    {#if field.attributes.label}
      <label for={field.id} class="label">{field.attributes.label}</label>
    {/if}
    <!-- Field -->
    {#if field.type === 'input'}
      <Input
        type={field.type}
        name={field.name}
        value={field.value}
        id={field.attributes.id}
        classe={field.attributes.class}
        placeholder={field.attributes.placeholder}
        min={field.attributes.min}
        max={field.attributes.max}
        step={field.attributes.step}
        autocomplete={field.attributes.autocomplete}
        disabled={field.attributes.disabled}
        readonly={field.attributes.readonly}
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
        id={field.attributes.id}
        name={field.name}
        value={field.value}
        options={field.options}
        classe={field.attributes.class}
        disabled={field.attributes.disabled}
        multiple={field.attributes.multiple}
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

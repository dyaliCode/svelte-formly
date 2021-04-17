<script>
  import { afterUpdate, beforeUpdate, onDestroy, onMount, tick } from 'svelte';
  import { get, writable } from 'svelte/store';

  import { validator, validateFields } from '../Validation/';
  import { valuesForm, fieldsStore } from '../lib/stores.js';
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
  $: listFields = fields;
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
    let values = $valuesForm;
    values = { ...values.values, [`${event.detail.name}`]: event.detail.value };
    fields.filter((field) => {
      if (field.name === event.detail.name) {
        field.value = event.detail.value;
      }
    });
    setValuesForm(isValidForm, values);
  };

  $: list = fields;
  let form = validator(() => {
    const items = get(fieldsStore);
    fields = items;
    // console.log(`fields`, fields);
    if (items.length > 0) {
      items.map(async (field, index) => {
        if (field.preprocess) {
          field = await preprocess_field(field, index, items);
        }
      });
      // console.log(`items`, items);
    }
    return items;
  });

  onMount(() => {
    fieldsStore.set(fields);
  });

  form.subscribe((data) => {
    console.log(`subscribe data:`, data);
    isValidForm = data.valid;
    fields = data.fields.length > 0 ? data.fields : fields;
    fieldsStore.set(data.fields);
    // console.log(`$fieldsStore`, $fieldsStore);
    setValuesForm(data.valid, data.values);
  });

  const preprocess_field = async (field, index, fields) => {
    const { values } = $valuesForm;
    const fnc = field.preprocess;
    const newField = await fnc.call(null, field, values);
    fields[index] = newField;
    fieldsStore.set(fields);
    return newField;
  };

  // beforeUpdate(() => {
  //   const newFields = get(fieldsStore);
  //   listFields.set(newFields);
  //   //   fields = get(fieldsStore);
  //   //   console.log(`fields111`, fields);
  //   //   // console.log(`listFields`, listFields);
  // });

  afterUpdate(() => {
    form.subscribe((data) => {
      listFields = data.fields.length > 0 ? data.fields : fields;
    });
    console.log(`$form`, $form);
  });
</script>

<h2>{JSON.stringify($form, null, 2)}</h2>
<!-- {#await fieldsStore}
  <p>...waiting</p>
{:then data}
  <pre>
  <code>
    {JSON.stringify(data, null, 2)}
  </code>
</pre>
{:catch error}
  <p style="color: red">err</p>
{/await} -->
<!--
<pre>
  <code>
    {JSON.stringify(list, null, 2)}
  </code>
</pre> -->
<hr />
{#each listFields as field (field.name)}
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
        type={field.attributes.type}
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
      <!-- {#if $form[field.name].validation.errors.length > 0}
        {#each $form[field.name].validation.errors as error, index}
          <Message {error} messages={field.messages} />
        {/each}
      {/if} -->
      {#await form}
        <p>...waiting</p>
      {:then data}
        <!-- <pre>
          <code>
            {JSON.stringify($form, null, 2)}
          </code>
        </pre> -->
      {:catch error}
        <p style="color: red">error</p>
      {/await}
    {/if}
  </Tag>
{/each}

<script>
  import { onMount } from 'svelte';
  import { validate } from '../Validation/index';
  import { valuesForm } from '../lib/stores.js';
  import { isRequired, preprocessField } from '../lib/helpers.js';

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
  let isValidForm = true;
  let values = [];
  let itemsField = [];
  $: listFields = itemsField;

  // Change values.
  const changeValueHander = async (event) => {
    values[`${event.detail.name}`] = event.detail.value;
    let mylist = await Promise.all(
      listFields.map(async (field) => {
        if (field.name == event.detail.name) {
          field.value = event.detail.value;
        }
        if (field.preprocess) {
          const fnc = field.preprocess;
          field = await preprocessField(field, listFields, values);
          values[`${field.name}`] = field.value;
        }
        field = await validate(field);
        return field;
      })
    );
    const dirty = mylist.find((item) => {
      if (item.validation) {
        return item.validation.dirty === true;
      }
    });
    isValidForm = dirty ? false : true;
    valuesForm.set({ values, valid: isValidForm });
    itemsField = mylist;
  };

  // Lifecycle.
  onMount(async () => {
    const mylist = await Promise.all(
      fields.map(async (field) => {
        values[`${field.name}`] = field.value;
        if (field.preprocess) {
          const fnc = field.preprocess;
          field = await preprocessField(field, fields, values);
        }
        field = await validate(field);
        itemsField = [...itemsField, field];
        values[`${field.name}`] = field.value;
        return field;
      })
    );
    const dirty = mylist.find((item) => {
      if (item.validation) {
        return item.validation.dirty === true;
      }
    });
    isValidForm = dirty ? false : true;
    valuesForm.set({ values, valid: isValidForm });
    itemsField = mylist;
  });
</script>

<!-- <pre>
  <code>
    {JSON.stringify(itemsField, null, 2)}
  </code>
</pre> -->
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
        name={field.name}
        value={field.value}
        id={field.attributes.id}
        classe={field.attributes.class}
        rows={field.attributes.rows}
        cols={field.attributes.cols}
        disabled={field.attributes.disabled}
        readonly={field.attributes.readonly}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'select'}
      <Select
        name={field.name}
        value={field.value}
        id={field.attributes.id}
        classe={field.attributes.class}
        options={field.options}
        disabled={field.attributes.disabled}
        multiple={field.attributes.multiple}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'autocomplete'}
      <AutoComplete
        name={field.name}
        id={field.attributes.id}
        classe={field.attributes.class}
        loadItemes={field.loadItemes}
        disabled={field.attributes.disabled}
        multiple={field.attributes.multiple}
        on:changeValue={changeValueHander}
        on:onSelectItem
      />
    {:else if field.type === 'radio'}
      <Radio
        name={field.name}
        value={field.value}
        classe={field.attributes.class}
        items={field.items}
        aligne={field.aligne}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'checkbox'}
      <Checkbox
        classe={field.attributes.class}
        items={field.items}
        aligne={field.attributes.aligne}
        on:changeValue={changeValueHander}
      />
    {:else if field.type === 'file'}
      <File
        name={field.name}
        id={field.attributes.id}
        classe={field.attributes.class}
        disabled={field.attributes.disabled}
        multiple={field.attributes.multiple}
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
      {#if field.validation.errors.length > 0}
        {#each field.validation.errors as error}
          <Message {error} messages={field.messages ? field.messages : []} />
        {/each}
      {/if}
    {/if}
  </Tag>
{/each}

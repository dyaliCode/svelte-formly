<script>
  import { onMount } from 'svelte';
  import { validate } from '../Validation/index';
  import { valuesForm } from '../lib/stores.js';
  import { preprocessField } from '../lib/helpers.js';

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
  let values = {};
  let itemsField = [];
  $: listFields = itemsField;

  // Change values.
  const changeValueHander = async (event) => {
    values = {
      ...values,
      [event.detail.name]: event.detail.value,
      touched: event.detail.name,
    };
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
        values = { ...values, [field.name]: field.value };
        if (field.preprocess) {
          const fnc = field.preprocess;
          field = await preprocessField(field, fields, values);
        }
        field = await validate(field);
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

{#each listFields as field (field.name)}
  <Tag
    tag={field.prefix ? (field.prefix.tag ? field.prefix.tag : 'div') : 'div'}
    classes={field.prefix
      ? field.prefix.classes
        ? field.prefix.classes
        : 'form-group'
      : 'form-group'}
  >
    <!-- Label -->
    {#if field.attributes}
      {#if field.attributes.label}
        <label for={field.id} class="label">{field.attributes.label}</label>
      {/if}
    {/if}

    <!-- Field -->
    {#if field.type === 'input'}
      <Input {field} on:changeValue={changeValueHander} />
    {:else if field.type === 'textarea'}
      <Textarea {field} on:changeValue={changeValueHander} />
    {:else if field.type === 'select'}
      <Select {field} on:changeValue={changeValueHander} />
    {:else if field.type === 'autocomplete'}
      <AutoComplete
        {field}
        on:changeValue={changeValueHander}
        on:onSelectItem
      />
    {:else if field.type === 'radio'}
      <Radio {field} on:changeValue={changeValueHander} />
    {:else if field.type == 'checkbox'}
      <Checkbox {field} on:changeValue={changeValueHander} />
    {:else if field.type === 'file'}
      <File {field} on:changeValue={changeValueHander} />
    {/if}

    <!-- Description -->
    {#if field.description}
      {#if field.description.text}
        <Tag
          tag={field.description.tag}
          classes={field.description.classes ? field.description.classes : ''}
        >
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

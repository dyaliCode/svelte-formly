<script>
  import { createEventDispatcher } from "svelte";
  import { validate } from "../Validation/index";
  import { values_form, fields_store } from "../lib/stores.js";
  import { preprocessField } from "../lib/helpers.js";

  // Import components.
  import Tag from "./Tag.svelte";
  import Input from "./Input.svelte";
  import Textarea from "./Textarea.svelte";
  import Select from "./Select.svelte";
  import AutoComplete from "./AutoComplete.svelte";
  import Radio from "./Radio.svelte";
  import Checkbox from "./Checkbox.svelte";
  import File from "./File.svelte";
  import Message from "./Message.svelte";

  // Declar variables;
  export let fields = [];
  export let name = "";
  let isValidForm = true;
  let values = [];
  let itemsField = [];
  $: listFields = itemsField;
  let form = { fields: [], values: null };

  // Dispatch.
  const dispatch = createEventDispatcher();

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
    itemsField = mylist;

    fields_store.update((data) => {
      if (!data.length || !data[name]) {
        data.push(itemsField);
      }
      return data;
    });

    values_form.update((data) => {
      data.map((item) => {
        if (item.form === name) {
          item = { form: name, values, valid: isValidForm };
        }
        return item;
      });
      form = {
        data: { form: name, values, valid: isValidForm },
      };

      // Dispatch.
      dispatch("form_values", form);
      return data;
    });
  };

  // Init.
  Promise.all(
    fields.map(async (field) => {
      values = { ...values, [field.name]: field.value };
      if (field.preprocess) {
        field = await preprocessField(field, fields, values);
      }
      field = await validate(field);
      values[`${field.name}`] = field.value;
      return field;
    })
  ).then(async (data) => {
    const isValid = await data.find((item) => {
      if (item.validation) {
        return item.validation.dirty === true;
      }
    });

    isValidForm = isValid ? false : true;
    itemsField = data;

    // Update fields store.
    fields_form_update();
    // Update values store.
    values_form_update();
  });

  // For SEO.
  itemsField = fields;

  // Update fields store.
  fields_form_update();
  // Update values store.
  values_form_update();

  // Update fields form
  function fields_form_update() {
    fields_store.update((data) => {
      if (!data.length || !data[name]) {
        data.push(itemsField);
      }
      return data;
    });
  }

  // Update values form.
  function values_form_update() {
    values_form.update((data) => {
      console.log("data", data);
      data.push({ form: name, values, valid: isValidForm });
      form = {
        data: { form: name, values, valid: isValidForm },
      };

      // Dispatch.
      dispatch("form_values", form);
      return data;
    });
  }
</script>

{#each itemsField as field (field.name)}
  <Tag
    tag={field.prefix ? (field.prefix.tag ? field.prefix.tag : "div") : "div"}
    classes={field.prefix
      ? field.prefix.classes
        ? field.prefix.classes
        : "form-group"
      : "form-group"}
  >
    <!-- Label -->
    {#if field.attributes}
      {#if field.attributes.label}
        <label for={field.id} class="label">{field.attributes.label}</label>
      {/if}
    {/if}
    <!-- Field -->
    {#if field.type === "input"}
      <Input {field} on:changeValue={changeValueHander} />
    {:else if field.type === "textarea"}
      <Textarea {field} on:changeValue={changeValueHander} />
    {:else if field.type === "select"}
      <Select {field} on:changeValue={changeValueHander} />
    {:else if field.type === "autocomplete"}
      <AutoComplete
        {field}
        on:changeValue={changeValueHander}
        on:onSelectItem
      />
    {:else if field.type === "radio"}
      <Radio {field} on:changeValue={changeValueHander} />
    {:else if field.type == "checkbox"}
      <Checkbox {field} on:changeValue={changeValueHander} />
    {:else if field.type === "file"}
      <File {field} on:changeValue={changeValueHander} />
    {/if}
    <!-- Description -->
    {#if field.description}
      {#if field.description.text}
        <Tag
          tag={field.description.tag}
          classes={field.description.classes ? field.description.classes : ""}
        >
          {field.description.text}
        </Tag>
      {/if}
    {/if}
    <!-- Error messages -->
    {#if !form.data.valid}
      {#if field.validation.errors.length > 0}
        {#each field.validation.errors as error}
          <Message {error} messages={field.messages ? field.messages : []} />
        {/each}
      {/if}
    {/if}
  </Tag>
{/each}

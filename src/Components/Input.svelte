<script>
  import { afterUpdate, createEventDispatcher } from 'svelte';
  import clsx from 'clsx';

  import { isRequired, scanValue } from '../lib/helpers';

  // Declar variables.
  export let field = {};
  const defaultAttributes = {
    type: 'text',
    id: '',
    classes: '',
    min: null,
    max: null,
    step: null,
    autocomplete: 'off',
    placeholder: '',
    disabled: false,
    readonly: false,
  };
  const fieldAttributes = field.attributes ? field.attributes : {};
  field.attributes = { ...defaultAttributes, ...fieldAttributes };

  let classe = null;
  let defaulClasses = null;

  // Dispatch.
  const dispatch = createEventDispatcher();

  // Change value field.
  function onChangerValue(event) {
    dispatch('changeValue', {
      name: field.name,
      value: scanValue(field.attributes.type, event.target.value),
    });
  }

  // Lifecycle.
  afterUpdate(() => {
    field.value = field.value == undefined ? null : field.value;
  });
</script>

<input
  type={field.attributes.type}
  name={field.name}
  value={field.value}
  id={field.attributes.id}
  class={clsx(field.attributes.classes)}
  placeholder={field.attributes.placeholder}
  required={isRequired(field)}
  disabled={field.attributes.disabled}
  readonly={field.attributes.readonly}
  min={field.attributes.min}
  max={field.attributes.max}
  step={field.attributes.step}
  autocomplete={field.attributes.autocomplete}
  on:input={onChangerValue}
/>

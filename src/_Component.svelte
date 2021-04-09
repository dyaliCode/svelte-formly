<script>
  import { onMount } from 'svelte';
  import { createDomElement, addDomElement } from './lib/Helper.js';

  // List fields
  const fields = [
    {
      type: 'input',
      attributes: {
        type: 'text',
        id: 'id-username',
        class: ['classs-username'],
        placeholder: 'Your username',
      },
    },
    {
      type: 'input',
      attributes: {
        type: 'password',
        id: 'id-password',
        class: ['classs-password'],
        placeholder: 'Your password',
      },
    },
    {
      type: 'textarea',
      attributes: {
        type: 'textarea',
        id: 'id-textarea',
        class: ['classs-textarea'],
        placeholder: 'Your textarea',
      },
    },
    {
      type: 'input',
      attributes: {
        type: 'file',
        id: 'id-file',
        class: 'classs-file',
        placeholder: 'Your file',
      },
    },
  ];

  // Conteiner
  let container;
  onMount(() => {
    fields.map((field) => {
      const prefix = createDomElement({
        type: 'div',
        attributes: { class: ['classs-username'] },
      });

      const fieldItem = createDomElement(field);
      const hr = createDomElement({ type: 'hr', attributes: {} });

      addDomElement(prefix, fieldItem);
      addDomElement(container, prefix);
      addDomElement(container, hr);
    });
  });
</script>

<form bind:this={container} />

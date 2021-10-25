<script>
  import { afterUpdate, createEventDispatcher, onMount } from 'svelte';
  import clsx from 'clsx';

  // Declar variables.
  export let field = {};
  const defaultAttributes = {
    id: '',
    classes: '',
    disabled: null,
  };
  const fieldAttributes = field.attributes ? field.attributes : {};
  field.attributes = { ...defaultAttributes, ...fieldAttributes };

  let classe = null;
  let defaulClasses = null;

  let multiple = false;
  let showPreview = false;

  let files = [];
  let inputFile;

  // Dispatch.
  const dispatch = createEventDispatcher();

  // Change value field.
  function onChangerValue(event) {
    files = Array.from(event.target.files);
    if (files.length > 0) {
      dispatch('changeValue', {
        name: field.name,
        value: files,
      });
    }
  }

  // Delete file.
  function deleteFile(file) {
    let newValue;
    files = files.filter((i) => i.name != file.name);
    if (files.length === 0) {
      inputFile.value = null;
      newValue = null;
    } else {
      newValue = files;
    }

    dispatch('changeValue', {
      name: field.name,
      value: newValue,
    });
  }

  onMount(() => {
    if (field.extra) {
      classe = clsx(field.attributes.classes, defaulClasses);
      multiple = field.extra.multiple ? field.extra.multiple : null;
      showPreview = field.extra.showPreview ? field.extra.showPreview : null;
    }
  });
</script>

<input
  type="file"
  name={field.name}
  id={field.attributes.id}
  class={classe}
  {multiple}
  on:input={onChangerValue}
  bind:this={inputFile}
/>

{#if field.file}
  <div class="file-rules">
    <ul>
      {#each Object.entries(field.file) as [rule, ruleValue]}
        <li><strong>{rule}</strong>: {ruleValue}</li>
      {/each}
    </ul>
  </div>
{/if}

{#if showPreview}
  {#if files}
    <div class="list-files">
      {#each files as file, i}
        <div class="file">
          <div class="img">
            <img src={window.URL.createObjectURL(file)} alt={file.name} />
          </div>
          <div class="infos">
            <ul>
              <li>Name: {file.name}</li>
              <li>Size: {file.size}</li>
              <li>Type: {file.type}</li>
              <li>
                <button
                  type="button"
                  on:click|preventDefault={() => {
                    deleteFile(file);
                  }}
                  class="btn"
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>
        </div>
      {/each}
    </div>
  {/if}
{/if}

<style>
  .list-files {
    margin-top: 10px;
  }
  .list-files .file {
    display: flex;
    margin-top: 10px;
    border: solid 4px #dddddd;
    padding: 10px;
  }
  .list-files .file .img,
  .list-files .file .infos {
    width: 50%;
    font-size: 0.75rem;
  }
  .list-files .file .img img {
    width: 100%;
  }
</style>

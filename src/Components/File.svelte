<script>
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let id = "";
  export let name = "";
  export let classe = "";
  export let disabled = null;
  export let multiple = false;
  export let showPreview = false;
  let files = [];
  const dispatch = createEventDispatcher();
  // Change value field.
  function onChangerValue(event) {
    files = Array.from(event.target.files);
    dispatch("changeValue", {
      name: name,
      value: files
    });
  }

  // Delete file.
  function deleteFile(file) {
    files = files.filter(i => i.name != file.name);
    dispatch("changeValue", {
      name: name,
      value: files
    });
  }
</script>

<style>
  .list-files .file {
    display: flex;
  }
  .list-files .file .img,
  .list-files .file .infos {
    width: 50%;
  }
  .list-files .file .img img {
    width: 100%;
  }
</style>

<input
  type="file"
  {id}
  {name}
  class={clsx(classe)}
  {disabled}
  {multiple}
  on:input={onChangerValue} />

{#if showPreview}
  {#if files}
    {#each files as file, i}
      <div class="list-files">
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
                  }}>
                  Remove
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    {/each}
  {/if}
{/if}

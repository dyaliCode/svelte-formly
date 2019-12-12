<script>
  import { createEventDispatcher } from "svelte";
  import clsx from "clsx";
  // Declar variables.
  export let id = "";
  export let name = "";
  export let classe = "";
  export let disabled = null;
  export let multiple = false;
  let files;
  const dispatch = createEventDispatcher();
  // Change value field.
  function onChangerValue(event) {
    files = event.target.files;
    // console.log("files", files);
    dispatch("changeValue", {
      name: name,
      value: event.target.files
    });

    if (files && files.length > 0) {
      const targetFile = files[0];
      try {
        const objectURL = window.URL.createObjectURL(targetFile);
        console.log("objectURL", objectURL);
        window.URL.revokeObjectURL(objectURL);
      } catch (e) {
        try {
          // Fallback if createObjectURL is not supported
          const fileReader = new FileReader();
          fileReader.onload = evt => {
            mediaElem.src = evt.target.result;
          };
          console.log(
            "fileReader.readAsDataURL(targetFile)",
            fileReader.readAsDataURL(targetFile)
          );
        } catch (e) {
          console.log(`File Upload not supported: ${e}`);
        }
      }
    }
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

{#if files}
  <!-- content here -->

  {#each files as file}
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
          </ul>
        </div>
      </div>
    </div>
  {/each}
{/if}

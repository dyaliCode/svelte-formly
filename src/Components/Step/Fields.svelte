<script>
  import { afterUpdate } from "svelte";

  import Field from "../Field.svelte";
  export let fields = [];
  $: listFields = fields;
  export let active_step = "";

  afterUpdate(() => {
    console.log("2222", 2222);
    // listFields = fields;
    console.log("active_step", active_step);
  });
</script>

{#each listFields as field (field.name)}
  {#if field.title === active_step}
    <Field fields={field.group} />
  {/if}
{/each}

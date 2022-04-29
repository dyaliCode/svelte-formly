<script>
  import Field from "../Field.svelte";
  import ProgressBar from "./ProgressBar.svelte";
  import { preprocessField } from "../../lib/helpers.js";
  import { validate } from "../../Validation/index";
  import { fieldsStore } from "../../lib/stores.js";
  import { get } from "svelte/store";

  export let fields = [];
  let steps = ["Group1", "Group2"],
    currentActive = 1,
    progressBar;

  export let active_step = steps[0];

  const handleProgress = async (stepIncrement) => {
    const mylist = await get(fieldsStore);

    const old_active_step = active_step;
    const current_group_fields = mylist.filter(async (field) => {
      if (field.title === old_active_step) {
        return field;
      }
    });

    if (current_group_fields.length) {
      let form_not_valid = [];
      await Promise.all(
        await current_group_fields.filter(async (item) => {
          if (item.validation.dirty) {
            form_not_valid.push(item);
          }
        })
      );

      // console.log("form_not_valid", form_not_valid);
      if (!form_not_valid.length) {
        console.log("111", 111);
        progressBar.handleProgress(stepIncrement);
        active_step = steps[currentActive - 1];
      } else {
        console.log("222", 222);
      }
    }
  };
</script>

<code>
  <pre>
    {JSON.stringify(fields, null, 2)}
  </pre>
</code>

<ProgressBar {steps} bind:currentActive bind:this={progressBar} />
<ul>
  {#each fields as field}
    {#if field.title === active_step}
      <Field fields={field.group} />
    {/if}
  {/each}
</ul>

<hr />

<div class="step-button">
  <button class="btn" on:click={() => handleProgress(-1)}>Prev</button>
  <button class="btn" on:click={() => handleProgress(+1)}>Next</button>
</div>

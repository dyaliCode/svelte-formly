<script>
  import Field from "../Field.svelte";
  import ProgressBar from "./ProgressBar.svelte";
  import { preprocessField } from "../../lib/helpers.js";
  import { validate } from "../../Validation/index";
  import { fieldsStore } from "../../lib/stores.js";
  import { get } from "svelte/store";
  import { onDestroy } from "svelte";

  export let fields = [];
  let steps = ["Group1", "Group2"],
    currentActive = 1,
    progressBar;

  export let active_step = steps[0];
  let listFields = [];

  const handleProgress = async (action, stepIncrement) => {
    listFields = await get(fieldsStore);

    if (action === "prev") {
      progressBar.handleProgress(stepIncrement);
      active_step = steps[currentActive - 1];
    } else {
      const old_active_step = active_step;
      const current_group_fields = listFields.filter(async (field) => {
        fields.map((item) => {
          if (item.name === field.name) {
            item.value = field.value;
          }
          return item;
        });

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

        if (!form_not_valid.length) {
          console.log("111", 111);
          progressBar.handleProgress(stepIncrement);
          active_step = steps[currentActive - 1];
        }
      }
    }

    fields = listFields;
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
  <button class="btn" on:click={() => handleProgress("prev", -1)}>Prev</button>
  <button class="btn" on:click={() => handleProgress("next", +1)}>Next</button>
</div>

<script>
  import { onMount } from "svelte";

  export let validation = [];
  export let field = {};

  // Liste rules with default message.
  const rules = {
    required: "This field is required",
    min: "This field must be more characters long",
    max: "This field must be more characters long",
    between: "This field must be between values defined",
    equal: "This field must be equal to value defined",
    email: "This email format is not valid",
    url: "This field must be an url valid"
  };

  // Get error message by rule.
  function displayError(rule) {
    let message = "";
    if (field.messages) {
      message += field.messages[rule] ? field.messages[rule] : rules[rule];
    } else {
      message += rules[rule];
    }
    return message;
  }
</script>

<div class="invalid-feedback">
  {#if validation.errors.includes('required')}
    {displayError('required')}
  {:else if validation.errors.includes('min')}
    {displayError('min')}
  {:else if validation.errors.includes('max')}
    {displayError('max')}
  {:else if validation.errors.includes('between')}
    {displayError('between')}
  {:else if validation.errors.includes('equal')}
    {displayError('equal')}
  {:else if validation.errors.includes('email')}
    {displayError('email')}
  {:else if validation.errors.includes('url')}{displayError('url')}{/if}
</div>

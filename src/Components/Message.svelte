<script>
  import { onMount } from "svelte";

  export let error;
  export let field = {};

  // Liste rules with default message.
  const rules = {
    required: "This field is required",
    min: "This field must be more characters long",
    max: "This field must be more characters long",
    between: "This field must be between values defined",
    equal: "This field must be equal to value defined",
    email: "This email format is not valid",
    url: "This field must be an url valid",
    custom_rule: "Error"
  };

  // Get error message by rule.
  function displayError(rule) {
    let message = "";
    if (field.messages) {
      message += field.messages[rule] ? field.messages[rule] : rules[rule];
      if (field.messages[rule]) {
        message = field.messages[rule];
      } else {
        message = rules[rule] ? rules[rule] : rules["custom_rule"];
      }
    } else {
      message += rules[rule] ? rules[rule] : rules["custom_rule"];
    }
    return message;
  }
</script>

<div class="invalid-feedback">
  {#if error === 'required'}
    {displayError('required')}
  {:else if error === 'min'}
    {displayError('min')}
  {:else if error === 'max'}
    {displayError('max')}
  {:else if error === 'between'}
    {displayError('between')}
  {:else if error === 'equal'}
    {displayError('equal')}
  {:else if error === 'email'}
    {displayError('email')}
  {:else if error === 'url'}
    {displayError('url')}
  {:else}{displayError(error)}{/if}
</div>

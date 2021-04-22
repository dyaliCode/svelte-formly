<script>
  // Declar variables.
  export let error;
  export let messages = {};

  // Liste rules with default message.
  const rules = {
    required: 'This field is required',
    min: 'This field must be more characters long',
    max: 'This field must be less characters long',
    between: 'This field must be between values defined',
    equal: 'This field must be equal to value defined',
    email: 'This email format is not valid',
    types: 'Must to allowed file types',
    maxsize: 'This file has size more than max size',
    custom_rule: 'Error',
  };

  // Get error message by rule.
  function displayError(rule) {
    let message = '';
    if (messages[rule]) {
      message += messages[rule] ? messages[rule] : rules['custom_rule'];
    } else {
      message += rules[rule] ? rules[rule] : rules['custom_rule'];
    }
    return message;
  }
</script>

<div class="invalid-feedback">
  {#if error}{displayError(error)}{/if}
</div>

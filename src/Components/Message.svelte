<script>
  export let validation = [];
  export let field = {};
</script>

<div class="invalid-feedback" style="display:block">
  {#if validation.errors.includes('required')}
    {field.messages['required'] ? field.messages['required'] : `This field is required`}
  {:else if validation.errors.includes('min')}
    {field.messages['min'] ? field.messages['min'] : `This field must be more characters long`}
  {:else if validation.errors.includes('max')}
    {field.messages['max'] ? field.messages['max'] : `This field must be more characters long`}
  {:else if validation.errors.includes('email')}
    {field.messages['email'] ? field.messages['email'] : `This email format is not valid`}
  {/if}
</div>

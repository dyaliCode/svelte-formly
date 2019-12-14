<script>
  import clsx from "clsx";
  // Declar variables.
  export let tag = "div";
  export let classes = [];
</script>

{#if tag === 'span'}
  <span class={classes.length > 0 ? clsx(classes) : null}>
    <slot />
  </span>
{:else if tag === 'small'}
  <small class={classes.length > 0 ? clsx(classes) : null}>
    <slot />
  </small>
{:else if tag === 'strong'}
  <strong class={classes.length > 0 ? clsx(classes) : null}>
    <slot />
  </strong>
{:else if tag === 'label'}
  <label class={classes.length > 0 ? clsx(classes) : null}>
    <slot />
  </label>
{:else}
  <div class={classes.length > 0 ? clsx(classes) : null}>
    <slot />
  </div>
{/if}

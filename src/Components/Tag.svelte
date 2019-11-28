<script>
  import clsx from "clsx";

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
{:else}
  <div class={classes.length > 0 ? clsx(classes) : null}>
    <slot />
  </div>
{/if}

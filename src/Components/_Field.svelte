<script>
  import { onMount } from 'svelte';
  import { settingStore } from './stores.js';

  // Import components.
  import WithStyleBootstrap from './WithStyleBootstrap.svelte';
  import WithStyleDefault from './WithStyleDefault.svelte';

  // Declar variables;
  export let settings = {};
  export let fields = [];

  // Lifecycle mount to start.
  onMount(() => {
    settingStore.set({
      style: settings.style ? settings.style : 'default',
    });
  });
</script>

{#if settings.style === 'bootstrap'}
  <h2>bootstrap</h2>
  <WithStyleBootstrap {fields} />
{:else}
  <h2>default</h2>
  <WithStyleDefault {fields} />
{/if}

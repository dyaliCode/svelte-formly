<script lang="ts">
	export let prefix: { tag?: string; classes?: string[] };
</script>

<svelte:element this={prefix.tag ?? 'div'} class={prefix.classes?.join(' ')}>
	<slot />
</svelte:element>

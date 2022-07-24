<script lang="ts">
	import type { IField } from '$lib/utils';
	import Message from './Message.svelte';

	export let field: IField;
</script>

{#if field.validation && field.validation.errors.length}
	{#each field.validation.errors as error}
		<Message {error} messages={field.messages ? field.messages : []} />
	{/each}
{/if}

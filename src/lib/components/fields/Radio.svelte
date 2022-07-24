<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { IField } from '../../utils';

	export let field: IField;

	// Dispatch.
	const dispatch = createEventDispatcher();

	const onInput = async (
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	): Promise<void> => {
		const value = event.currentTarget.value;

		dispatch('changeValue', {
			name: field.name,
			value
		});
	};
</script>

{#each field.extra.items as item, i}
	<input
		type={field.type}
		class={field.attributes.classes?.join(' ')}
		id={item.id}
		name={field.name}
		value={item.value}
		checked={item.value === field.value}
		on:input={onInput}
	/>
	<span>{item.title}</span>
{/each}

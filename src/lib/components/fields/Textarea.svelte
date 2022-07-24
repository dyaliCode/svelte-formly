<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isRequired, type IField } from '../../utils';

	export let field: IField;

	// Dispatch.
	const dispatch = createEventDispatcher();

	const onInput = async (
		event: Event & { currentTarget: EventTarget & HTMLTextAreaElement }
	): Promise<void> => {
		const value = event.currentTarget.value;

		dispatch('changeValue', {
			name: field.name,
			value
		});
	};
</script>

<textarea
	value={field.value ?? null}
	id={field.attributes.id}
	class={field.attributes.classes?.join(' ')}
	placeholder={field.attributes.placeholder}
	required={isRequired(field)}
	disabled={field.attributes.disabled}
	readonly={field.attributes.readonly}
	rows={field.attributes.rows}
	cols={field.attributes.cols}
	on:input={onInput}
/>

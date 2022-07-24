<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isRequired, type IField } from '../../utils';

	export let field: IField;

	// Dispatch.
	const dispatch = createEventDispatcher();

	const onInput = async (
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	): Promise<void> => {
		const value =
			field.attributes.type === 'number' || field.attributes.type === 'range'
				? parseInt(event.currentTarget.value)
				: event.currentTarget.value;

		dispatch('changeValue', {
			name: field.name,
			value
		});
	};
</script>

<input
	value={field.value ?? null}
	type={field.attributes.type}
	id={field.attributes.id}
	class={field.attributes.classes?.join(' ')}
	placeholder={field.attributes.placeholder}
	required={isRequired(field)}
	disabled={field.attributes.disabled}
	readonly={field.attributes.readonly}
	min={field.attributes.min}
	max={field.attributes.max}
	step={field.attributes.step}
	autocomplete={field.attributes.autocomplete}
	on:input={onInput}
/>

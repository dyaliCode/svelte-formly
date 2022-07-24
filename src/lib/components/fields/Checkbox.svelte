<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isRequired, type IField } from '../../utils';

	export let field: IField;

	// Dispatch.
	const dispatch = createEventDispatcher();

	let values: any[] = [];

	// Init.
	if (field.extra.items.length > 0) {
		field.extra.items.map((item: any) => {
			if (item.checked) {
				values = [...values, item.value];
				field.value = field.value ? [...field.value, item.value] : values;
			}
		});
		dispatch('changeValue', {
			name: field.name,
			value: values
		});
	}

	const onInput = async (
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	): Promise<void> => {
		const value = event.currentTarget.value;

		if (field.extra.items.length > 0) {
			field.extra.items.map((item: any) => {
				if (item.name === event.currentTarget.name) {
					if (event.currentTarget.checked) {
						values = [...values, item.value];
					} else {
						values = values.filter((value) => value !== item.value);
					}
				}
			});

			dispatch('changeValue', {
				name: field.name,
				value: values
			});
		}
	};
</script>

{#each field.extra.items as item}
	<input
		type={field.type}
		class={field.attributes.classes?.join(' ')}
		value={item.value}
		name={item.name}
		checked={item.checked ?? false}
		required={isRequired(field)}
		disabled={field.attributes.disabled}
		on:input={onInput}
	/>
	<span>{item.title}</span>
{/each}

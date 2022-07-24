<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isRequired, type IField } from '../../utils';

	export let field: IField;

	// Dispatch.
	const dispatch = createEventDispatcher();

	const is_multiple = field.extra.multiple ?? false;

	const onChangeValue = async (
		event: Event & { currentTarget: EventTarget & HTMLSelectElement }
	): Promise<void> => {
		let value;
		if (is_multiple) {
			let values: any = [];
			const selectedOptions = event.currentTarget.selectedOptions;
			for (let i = 0; i < selectedOptions.length; i++) {
				const value_item = selectedOptions[i].value;
				values = [...values, value_item];
			}
			value = values;
		} else {
			value = event.currentTarget.value;
		}
		// await storeForms.updateFieldValue(form_name, field.name, value);
		dispatch('changeValue', {
			name: field.name,
			value
		});
	};

	const checkSelected = (option_value: any, field_value: any): boolean => {
		if (is_multiple) {
			if (field_value && field_value.length) {
				const res = field_value.indexOf(option_value) != -1;
				return res;
			} else if (field.value && field.value.length) {
				const res = field.value.indexOf(option_value) != -1;
				return res;
			}
			return false;
		}
		return option_value === field_value;
	};
</script>

<select
	name={field.name}
	id={field.attributes.id}
	class={field.attributes.classes?.join(' ')}
	required={isRequired(field)}
	disabled={field.attributes.disabled}
	multiple={field.extra && field.extra.multiple ? field.extra.multiple : false}
	on:change={onChangeValue}
>
	{#if field.extra}
		{#if field.extra.options}
			{#each field.extra.options as option}
				<option value={option.value} selected={checkSelected(option.value, field.value)}>
					{option.title}
				</option>
			{/each}
		{/if}
	{/if}
</select>

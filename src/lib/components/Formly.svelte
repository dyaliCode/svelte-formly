<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import {
		isFieldDuplicated,
		storeForms,
		getValues,
		type IField,
		type IForm,
		preprocess_and_validate_field,
		type IBtnSubmit,
		type IBtnReset
	} from '../utils';

	// Import others components.
	import Tag from './Tag.svelte';
	import Error from './Error.svelte';
	import Dirty from './Dirty.svelte';

	// Import field components.
	import Input from './fields/Input.svelte';
	import Select from './fields/Select.svelte';
	import File from './fields/File.svelte';
	import Textarea from './fields/Textarea.svelte';
	import Checkbox from './fields/Checkbox.svelte';
	import Radio from './fields/Radio.svelte';
	import AutoComplete from './fields/AutoComplete.svelte';
	import Label from './Label.svelte';

	// List types of fields.
	const ListFieldType = [
		{
			type: 'input',
			component: Input
		},
		{
			type: 'select',
			component: Select
		},
		{
			type: 'file',
			component: File
		},
		{
			type: 'textarea',
			component: Textarea
		},
		{
			type: 'checkbox',
			component: Checkbox
		},
		{
			type: 'radio',
			component: Radio
		},
		{
			type: 'autocomplete',
			component: AutoComplete
		}
	];

	// Get field by type.
	const getFieldByType = ({ type }: IField) => {
		return ListFieldType.find((field) => field.type === type)?.component;
	};

	// Props.
	export let fields: IField[] = [];

	export let defaultButtons = true;
	export let btnSubmit: IBtnSubmit = {
		text: 'Submit'
	};
	export let btnReset: IBtnReset = {
		text: 'Reset'
	};

	export let form_name: string = '';
	export let realtime: boolean = false;
	let _formEl: HTMLFormElement;

	// Dispatch values.
	const dispatch = createEventDispatcher();

	// Init values.
	let values: any = {};
	let current_form: IForm = {
		form_name,
		fields,
		values,
		valid: true
	};

	// Check if name/id fields are duplicated.
	const is_duplicated: boolean = isFieldDuplicated(fields);

	// Init form.
	onMount(async () => {
		await Promise.all(
			fields.map(async (field: IField) => {
				values[`${field.name}`] = field.value ?? null;
				// Preprocess and validate field.
				field = await preprocess_and_validate_field(current_form, field, values);
				return field;
			})
		);
		// Find dirty in the current form.
		const dirty = fields.find((field: IField) => {
			if (field.validation) {
				return field.validation.dirty === true;
			}
		});

		current_form = { ...current_form, fields: fields, values, valid: dirty ? false : true };
	});

	// Init forms.
	storeForms.save(current_form);

	// On change value field.
	const onChangeValue = async (event: any): Promise<void> => {
		const values = current_form.values;

		const _fields = await Promise.all(
			current_form.fields.map(async (field: IField) => {
				if (field.name === event.detail.name) {
					values['touched'] = field.name;
					field.value = event.detail.value;
					values[`${field.name}`] = event.detail.value;
				}

				// Preprocess and validate field.
				field = await preprocess_and_validate_field(current_form, field, values);

				return field;
			})
		);

		// Find dirty in the current form.
		const dirty = _fields.find((field: IField) => {
			if (field.validation) {
				return field.validation.dirty === true;
			}
		});

		current_form = { ...current_form, fields: _fields, values, valid: dirty ? false : true };

		// Update form.
		storeForms.save(current_form);

		if (realtime) {
			dispatch('update', { ...current_form.values, valid: current_form.valid });
		}
	};

	// Submit form.
	const onSubmit = async (): Promise<void> => {
		const values = await getValues(form_name);
		dispatch('submit', { ...values, valid: current_form.valid });
	};

	// Reset form.
	const onReset = async (): Promise<void> => {
		Object.keys(values).forEach((key) => {
			values[key] = null;
		});
		await storeForms.resetValues(form_name);
		current_form.values = values;
	};
</script>

{#if current_form}
	{#if is_duplicated}
		<Error>
			<p>
				<code
					><b
						>Error! Detect duplicate fields(name or id attributes), make sure you put unique name
						and id for each field.</b
					></code
				>
			</p>
		</Error>
	{:else}
		<form bind:this={_formEl} on:submit|preventDefault={onSubmit} on:reset|preventDefault={onReset}>
			{#each current_form.fields as field}
				{#if field.prefix?.tag}
					<Tag prefix={field.prefix}>
						<Label {field} />
						<svelte:component this={getFieldByType(field)} {field} on:changeValue={onChangeValue} />
						<Dirty {field} />
					</Tag>
				{:else}
					<Label {field} />
					<svelte:component this={getFieldByType(field)} {field} on:changeValue={onChangeValue} />
					<Dirty {field} />
				{/if}
			{/each}
			{#if defaultButtons}
			<button
				type="submit"
				class={btnSubmit.classes && btnSubmit.classes?.length ? btnSubmit.classes?.join(' ') : null}
			>
				{btnSubmit.text}</button
			>
			<button
				type="reset"
				class={btnReset.classes && btnReset.classes?.length ? btnReset.classes?.join(' ') : null}
				>{btnReset.text}</button
			>
			{/if}
		</form>
	{/if}
{/if}

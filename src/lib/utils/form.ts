import { get } from 'svelte/store';
import { storeForms } from './stores';
import type { IField, IForm, IValue } from './types';
import { validate } from './validation';

export async function getFormByName(form_name: string): Promise<IForm | null> {
	const forms = await get(storeForms);
	const form = forms.find((form: IForm) => form.form_name === form_name);
	return form ?? null;
}

export async function preprocessField(
	field: IField,
	fields: IField[],
	values: any
): Promise<IField> {
	const fnc = field.preprocess;
	field = await fnc?.call(null, field, fields, values);
	return field;
}

export async function getValues(form_name: string): Promise<IValue> {
	const forms = await get(storeForms);
	const form = forms.find((form: IForm) => form.form_name === form_name);
	return form ? form?.values : {};
}

export async function preprocess_and_validate_field(
	form: IForm,
	field: IField,
	values: any
): Promise<IField> {
	// 1.preprocess
	if (field.preprocess) {
		field = await preprocessField(field, form.fields, values);
		values[`${field.name}`] = field.value ?? null;
	}

	// 2.validation
	if (field.rules) {
		field = await validate(field);
	}

	return field;
}

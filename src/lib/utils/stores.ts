import { writable } from 'svelte/store';
import type { IField, IForm } from './types';

export const formsStore = writable<IForm[]>([]);

function createForms() {
	const { subscribe, set, update } = writable<IForm[]>([]);

	return {
		subscribe,
		// add new form
		save: (newForm: IForm) =>
			update((forms: IForm[]) => {
				const form = forms.find((form: IForm) => form.form_name === newForm.form_name);

				if (!form) {
					forms = [...forms, newForm];
				} else {
					forms = forms.map((form: IForm) =>
						form.form_name === newForm.form_name ? newForm : form
					);
				}

				return forms;
			}),

		// remove forms.
		reset: () => set([]),

		// remove values form by name
		resetValues: (form_name: string) =>
			update((forms: IForm[]) => {
				forms.map((form: IForm) => {
					if (form.form_name === form_name) {
						form.fields.map((field: IField) => {
							field.value = null;
							form.values[field.name] = null;
						});
					}
					return form;
				});

				return forms;
			}),

		// update value field
		updateFieldValue: (form_name: string, field_name: string, field_value: any) =>
			update((forms: IForm[]) => {
				const _forms: any = forms.map((form: IForm) => {
					if (form.form_name === form_name) {
						form.fields.map((field: any) => {
							if (field.name === field_name) {
								field.value = field_value;
								form.values[field_name] = field_value;
								form.values['touched'] = field_name;
							}
							return field;
						});
					}

					return form;
				});

				return _forms;
			})
	};
}

export const storeForms = createForms();

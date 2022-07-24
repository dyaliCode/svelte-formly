import type { IField } from '../types';
import * as CoreRules from './rules/index';
const _coreRules: any = CoreRules;

/**
 * Validate field by rule.
 * @param {configs field} field
 */
export async function validate(_field: IField): Promise<IField> {
	let { value, rules } = _field;

	let valid = true;
	let rule;
	let errors: any[] = [];
	let validation: any;

	if (rules) {
		await Promise.all(
			rules.map(async (validator: any) => {
				// For file type.
				if (validator === 'file') {
					if (value) {
						Object.keys(value).map((i) => {
							if (_field.file) {
								Object.entries(_field.file).map(([key, val]) => {
									valid = _coreRules[key].call(null, value[i], val);
									if (!valid) {
										errors = [...errors, key];
									}
								});
							}
						});
					}
				} else {
					// For custom rule.
					if (typeof validator === 'function') {
						valid = await validator.call;
						rule = validator.name;
					} else if (typeof validator === 'object') {
						valid = await validator.fnc();
						rule = validator.name;
					} else {
						const args = validator.split(/:/g);
						rule = args.shift();
						valid = _coreRules[rule].call(null, value, args);
					}
					if (!valid) {
						errors = [...errors, rule];
					}
				}
			})
		);
		validation = { errors, dirty: errors.length > 0 };
	} else {
		validation = { errors, dirty: false };
	}

	_field.validation = validation;

	return _field;
}

import type { IField } from './types';

export function inArray(arr: Array<any>, element: any): boolean {
	if (arr.indexOf(element) != -1) {
		return true;
	}
	return false;
}

export function isRequired(field: IField): boolean {
	if (field.rules) {
		if (field.rules.length > 0) {
			return true;
		}
	}
	return false;
}

export function isFieldDuplicated(fields: IField[]): boolean {
	let seen: any = {};
	return fields.some(function (currentObject: any) {
		if (
			seen.hasOwnProperty(currentObject.name) ||
			seen.hasOwnProperty(currentObject.attributes.id)
		) {
			// Current name or id is already seen
			return true;
		}

		// Current name and id is being seen for the first time
		return (seen[currentObject.name] = false), (seen[currentObject.attributes.id] = false);
	});
}

export function clickOutside(node: any) {
	const handleClick = (event: any) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			node.dispatchEvent(new CustomEvent('click_outside', node));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
}

<script lang="ts">
	export let error: any;
	export let messages: any = {};

	const rules: any[] = [
		{ rule: 'required', message: 'This field is required' },
		{ rule: 'min', message: 'This field must be more characters long' },
		{ rule: 'max', message: 'This field must be less characters long' },
		{ rule: 'between', message: 'This field must be between values defined' },
		{ rule: 'equal', message: 'This field must be equal to value defined' },
		{ rule: 'email', message: 'This email format is not valid' },
		{ rule: 'extensions', message: 'Must to allowed file types' },
		{ rule: 'maxSize', message: 'This file has size more than max size' },
		{ rule: 'custom_rule', message: 'Error' }
	];

	const displayError = (rule: string) => {
		let message = '';
		if (messages[rule]) {
			message += messages[rule] ?? getMessageByRule(rule);
		} else {
			message += getMessageByRule(rule);
		}
		return message;
	};

	const getMessageByRule = (rule: string) => {
		const data = rules.find((r: any) => r.rule === rule);
		return data ? data.message : rules.find((r: any) => r.rule === 'custom_rule').message;
	};
</script>

{#if error}
	<div class="invalid-feedback error">{displayError(error)}</div>
{/if}

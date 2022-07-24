<script lang="ts">
	import { Formly, type IField } from '$lib';
	// import { Formly, type IField } from 'svelte-formly-light';

	const form_name = 'my_form_a';
	const fields: IField[] = [
		{
			type: 'autocomplete', // required
			name: 'name-field-autocomplete', // required
			attributes: {
				id: 'id-field-autocomplete',
				classes: ['class1', 'class2'],
				placeholder: 'Tap keyword...',
				autocomplete: 'off'
			},
			extra: {
				filter_length: 2,
				loadItemes: [
					// list items with id and title attributes.
					{
						value: 1,
						title: 'item 1'
					},
					{
						value: 2,
						title: 'item 2'
					},
					{
						value: 3,
						title: 'item 3'
					},
					{
						value: 4,
						title: 'item 4'
					}
				]
			}
		}
	];

	let data = {};
	const onSubmit = ({ detail }: any) => {
		console.log('detail onSubmit', detail);
		data = detail;
	};

	const onUpdate = ({ detail }: any) => {
		console.log('detail onUpdate', detail);
		data = detail;
	};
</script>

<!-- <pre><code>{JSON.stringify(data, null, 2)}</code></pre> -->

<div class="grid">
	<div class="col">
		<article>
			<hgroup>
				<h1>Sign in</h1>
				<h2>Nibh risus velit metus euismod vitae eu urna.</h2>
			</hgroup>
			<Formly {fields} {form_name} on:submit={onSubmit} on:update={onUpdate} realtime={false} />
		</article>
	</div>
</div>

<style lang="scss">
	:global(form .form-group) {
		margin-bottom: 1rem;
	}
</style>

<script lang="ts">
	import { Formly, type IField } from 'svelte-formly-light';

	let loading: boolean = false;
	const form_name = 'my_form_a';
	const fields: IField[] = [
		{
			type: 'file', // required
			name: 'name-file', // require
			attributes: {
				id: 'id-field', // optional
				classes: ['form-control'], // optional
				label: 'Image' // optional
			},
			extra: {
				multiple: true, // optional
				showPreview: true // optional
			},
			rules: ['file'],
			file: {
				// need to add this attribute object if you need a file rule
				types: 'jpg,gif',
				maxsize: 5
			}
		}
	];

	const form_name_b = 'my_form_b';
	const fields_b: IField[] = [
		{
			type: 'input',
			name: 'country',
			attributes: {
				type: 'text',
				id: 'country',
				classes: ['form-control'],
				placeholder: 'Tap your country'
			},
			rules: ['required'],
			messages: {
				required: 'The country is required'
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
			<p>
				<code
					><i>fetch: </i><u
						>{#if loading}
							loading...
						{:else}
							done
						{/if}</u
					></code
				>
			</p>
			<Formly {fields} {form_name} on:submit={onSubmit} on:update={onUpdate} realtime={true} />
		</article>
	</div>
	<div class="col">
		<article>
			<Formly
				fields={fields_b}
				form_name={form_name_b}
				on:submit={onSubmit}
				on:update={onUpdate}
				realtime={true}
			/>
		</article>
	</div>
</div>

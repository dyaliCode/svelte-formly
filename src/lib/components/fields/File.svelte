<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { IField } from '../../utils';

	export let field: IField;

	let files: any[] = [];
	let multiple = false;
	let showPreview = false;
	let inputFile: any;

	// Dispatch.
	const dispatch = createEventDispatcher();

	onMount(() => {
		if (field.extra) {
			multiple = field.extra.multiple ? field.extra.multiple : null;
			showPreview = field.extra.showPreview ? field.extra.showPreview : null;
		}
	});

	// Delete file.
	function deleteFile(file: File) {
		let newValue;
		files = files.filter((i) => i.name != file.name);
		if (files.length === 0) {
			inputFile.value = null;
			newValue = null;
		} else {
			newValue = files;
		}

		dispatch('changeValue', {
			name: field.name,
			value: newValue
		});
	}

	const onInput = async (
		event: Event & { currentTarget: EventTarget & HTMLInputElement }
	): Promise<void> => {
		files = Array.from(event.currentTarget.files as ArrayLike<File>);

		dispatch('changeValue', {
			name: field.name,
			value: files
		});
	};
</script>

<input
	type={field.type}
	name={field.name}
	id={field.attributes.id}
	class={field.attributes.classes?.join(' ')}
	{multiple}
	on:input={onInput}
	bind:this={inputFile}
/>

{#if field.file}
	<div class="file-rules">
		<ul>
			{#each Object.entries(field.file) as [rule, ruleValue]}
				<li><strong>{rule}</strong>: {ruleValue}</li>
			{/each}
		</ul>
	</div>
{/if}

{#if showPreview}
	{#if files}
		<div class="list-files">
			{#each files as file, i}
				<div class="file">
					<div class="img">
						<img src={window.URL.createObjectURL(file)} alt={file.name} />
					</div>
					<div class="infos">
						<ul>
							<li>Name: {file.name}</li>
							<li>Size: {file.size}</li>
							<li>Type: {file.type}</li>
							<li>
								<button
									type="button"
									on:click|preventDefault={() => {
										deleteFile(file);
									}}
									class="btn"
								>
									Remove
								</button>
							</li>
						</ul>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/if}

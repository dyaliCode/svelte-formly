<script lang="ts">
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import { clickOutside, type AutoCompleteItems, type IField } from '$lib/utils';

	export let field: IField;

	// Dispatch.
	const dispatch = createEventDispatcher();

	let value: any = null;
	let items: AutoCompleteItems[] = [];
	let itemsFiltered: AutoCompleteItems[] = [];
	let selectedItems: AutoCompleteItems[] = [];
	let showList: boolean = false;
	let filter_length: number = 0;

	if (field.extra) {
		if (field.extra.loadItemes) {
			items = field.extra.loadItemes;
		}
		if (field.extra.filter_length) {
			filter_length = field.extra.filter_length;
		}
	}

	const onFilter = (event: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		const keyword = event.currentTarget.value;
		if (keyword.length > filter_length) {
			const filtered = items.filter((item: any) => {
				return item.title.toLowerCase().includes(keyword.toLowerCase());
			});
			if (filtered.length) {
				itemsFiltered = filtered;
			} else {
				itemsFiltered = [];
			}
			itemsFiltered.length ? (showList = true) : (showList = false);
		} else {
			showList = false;
		}
	};

	const onSelectItem =
		(item: any) => (e: MouseEvent & { currentTarget: EventTarget & HTMLLIElement }) => {
			// showList = false;
			value = null;
			items = items.filter((_item) => _item.value !== item.value);
			itemsFiltered = itemsFiltered.filter((_item) => _item.value !== item.value);
			selectedItems = [...selectedItems, item];

			if (!items.length) {
				showList = false;
			}

			dispatch('changeValue', {
				name: field.name,
				value: selectedItems
			});
		};

	const onDeselectItem =
		(item: any) => async (e: MouseEvent & { currentTarget: EventTarget & HTMLSpanElement }) => {
			// showList = false;
			selectedItems = await selectedItems.filter((_item) => _item.value !== item.value);
			items = [...items, item];
			itemsFiltered = [...itemsFiltered, item];

			dispatch('changeValue', {
				name: field.name,
				value: selectedItems
			});
		};

	const onClickOutside = (e: any) => {
		showList = false;
	};
</script>

<div class="autocomplete-wrapper">
	<div class="selected-items">
		{#each selectedItems as item}
			<div class="item">
				<span>{item.title}</span>
				<span class="deselect" on:click={onDeselectItem(item)}>x</span>
			</div>
		{/each}
	</div>

	<input
		type="text"
		id={field.attributes.id}
		class={field.attributes.classes?.join(' ')}
		autocorrect={field.attributes.autocorrect}
		autocomplete={field.attributes.autocomplete}
		placeholder={field.attributes.placeholder}
		on:keyup={onFilter}
		bind:value
	/>

	{#if itemsFiltered.length && showList}
		<div class="list-items" use:clickOutside on:click_outside={onClickOutside}>
			<ul>
				{#each itemsFiltered as item}
					<li on:click={onSelectItem(item)}>{item.title}</li>
				{/each}
				<li
					class="done"
					on:click={() => {
						showList = false;
						value = null;
					}}
				>
					Close
				</li>
			</ul>
		</div>
	{/if}
</div>

<style lang="scss">
	.autocomplete-wrapper {
		position: relative;
		width: 100%;

		.selected-items {
			margin-bottom: 10px;
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-content: flex-start;
			gap: 10px;

			.item {
				// flex: auto;
				font-size: 0.75rem;
				padding: 0.5rem;
				background-color: #ff3e00;
				color: white;
				border-radius: 5px;

				.deselect {
					border-radius: 50%;
					width: 15px;
					height: 15px;
					padding: 2px 7px 3px 7px;
					font-size: 0.6rem;
					background-color: #333333;
					border: solid 1px rgba(255, 255, 255, 0.2);
					color: white;
					&:hover {
						box-shadow: 0px 0px 4px 1px rgba(255, 255, 255, 0.8);
					}
				}
			}

			.deselect {
				cursor: pointer;
			}
		}

		.list-items {
			box-shadow: 0 2px 3px 0 rgba(249, 251, 253, 0.24);
			margin-bottom: 20px;

			ul,
			li {
				list-style: none;
				padding: 0;
				margin: 0;
				color: black;
				background-color: rgb(201, 201, 201);
			}

			li {
				border-bottom: 1px dashed #999999;
				padding: 0.75rem;
				cursor: pointer;
			}
			li.done {
				background-color: #1f2d38 !important;
				border-bottom-color: transparent;
				color: white;
				text-align: center;
			}
			li.done:hover {
				border-bottom-color: transparent;
			}
			li:hover {
				background-color: #ff40009c;
				border-bottom: 1px dashed #ff3e00;
				color: white;
			}
		}
	}
</style>

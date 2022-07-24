<script lang="ts">
	import type { IField } from '../utils';
	export let field: IField;
</script>

{#if field.attributes}
	{#if field.attributes.label}
		<label for={field.attributes.id} class="label">{field.attributes.label}</label>
	{/if}
{/if}

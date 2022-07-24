<script>
	import '@picocss/pico/css/pico.css';
	import '@picocss/pico/docs/css/pico.docs.css';
	import '../_variables.scss';
</script>

<div class="container">
	<slot />
</div>

<style lang="scss">
	/* the props */
	/* @import 'open-props/style'; */

	/* optional imports that use the props */
	/* @import 'open-props/normalize';
	@import 'open-props/buttons'; */

	/* individual imports */
	/* @import 'open-props/indigo';
	@import 'open-props/easings';
	@import 'open-props/animations';
	@import 'open-props/sizes';
	@import 'open-props/gradients'; */
	/* see PropPacks for the full list */

	/* :global(article) {
		display: flex;
		flex-flow: row wrap;
		align-items: flex-start;
		justify-content: space-around;
		max-inline-size: calc(var(--size-content-1) * 6);
		gap: var(--size-2);
		padding: var(--size-2);
	}
	:global(article .col) {
		background-color: var(--blue-0);
		padding: var(--size-2);
	} */

	:global(form .error) {
		margin-bottom: 1rem;
		font-size: 0.75rem;
		color: rgb(247, 63, 63);
	}
</style>

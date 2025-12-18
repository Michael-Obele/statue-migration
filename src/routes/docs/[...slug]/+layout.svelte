<script lang="ts">
	import DocsContents from '$lib/components/DocsContents.svelte';

	const { data, children } = $props();
</script>

<div class="article-layout">
	<aside class="sidebar">
		<DocsContents contents={data.sidebar} />
	</aside>

	<div class="content">
		{@render children()}
	</div>
</div>

<style>
	.article-layout {
		--sidebar-width: 18rem;
		--page-padding: 1.5rem;
		--content-width: calc(680px + var(--page-padding));
		display: flex;
	}

	.sidebar {
		display: none;
	}

	.content {
		min-width: 0;
		max-width: var(--content-width);
		margin: var(--page-padding);
	}

	@media (min-width: 832px) {
		.sidebar {
			display: block;
			flex-shrink: 0;
			width: var(--sidebar-width);
			height: calc(100vh - var(--nav-height));
			overflow-y: auto;
			position: sticky;
			top: var(--nav-height);
		}
	}

	@media (min-width: 1200px) {
	}
</style>

<script lang="ts">
	import DocsContents from '$lib/components/DocsContents.svelte';

	const { data, children } = $props();
</script>

<div class="article-layout">
	<aside class="sidebar bg-fuchsia-300">
		<DocsContents contents={data.sidebar} />
	</aside>

	<div class="content bg-orange-300/50">
		{@render children()}
	</div>
</div>

<style>
	.article-layout {
		--sidebar-width: 16rem;
		--page-padding: 1.5rem;
		display: flex;
	}

	.sidebar {
		display: none;
	}

	.content {
		min-width: 0;
		margin: var(--page-padding);
	}

	@media (min-width: 832px) {
		.sidebar {
			display: block;
			flex-shrink: 0;
			width: 16rem;
			height: calc(100vh - var(--nav-height));
			overflow-y: auto;
			position: sticky;
			top: var(--nav-height);
		}
	}

	@media (min-width: 1200px) {
		.content {
			margin: 0 auto;
		}
	}
</style>

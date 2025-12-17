<script lang="ts">
	import DocsContents from '$lib/components/DocsContents.svelte';


    const {data, children} = $props();
    console.log("data", data.sidebar)
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
		--sidebar-width: 16rem;
		--content-width: 640px;
		--page-padding: 1.5rem;
	}

	.sidebar {
  display: none;
}

@media (min-width: 832px) {
  .sidebar {
    display: block;
    position: fixed;
    top: var(--nav-height);
    left: 0;
    width: var(--sidebar-width);
    height: calc(100vh - var(--nav-height));
    overflow-y: auto;
  }

  .content {
    padding-left: calc(var(--sidebar-width) + var(--page-padding));
  }
}

/* Content */
.content {
  max-width: var(--content-width);
  margin-inline: auto;
  padding: var(--page-padding);
  min-width: 0;
}

/* Wide screens: keep content centered */
@media (min-width: 1200px) {
  .layout {
    --sidebar-width: max(
      16rem,
      calc(0.5 * (100vw - var(--content-width)))
    );
  }
}
</style>

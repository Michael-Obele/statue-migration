<script>
	import OnThisPage from '$lib/components/OnThisPage.svelte';

	const { data } = $props();
</script>

<article>
	<main>
		<h1>{data.page.metadata.title}</h1>
		{#if data.page.metadata.description}
			<p class="description">{data.page.metadata.description}</p>
		{/if}

		<data.page.content />

		<OnThisPage sections={data.page.sections} />
	</main>
</article>

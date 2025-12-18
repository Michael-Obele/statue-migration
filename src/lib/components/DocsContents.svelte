<script lang="ts">
	import { page } from '$app/state';

	type Item = {
		title: string;
		url: string;
		order: number;
	};

	type Section = {
		title: string;
		isRoot: boolean;
		items: Item[];
	};

	const { contents } = $props<{ contents: Section[] }>();

	const pathname = page.url.pathname;

	function sortItems(items: Item[]) {
		return [...items].sort((a, b) => a.order - b.order);
	}
</script>

<aside class="sidebar">
	<nav class="nav">
		{#each contents as section (section.title)}
			<div class="section">
				{#if !section.isRoot}
					<h3 class="section-title">{section.title}</h3>
				{/if}

				<ul class="list">
					{#each sortItems(section.items) as item (item.url)}
						<li>
							<a href={item.url} class="link" class:active={pathname === item.url}>
								{item.title}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</nav>
</aside>

<style>
	.sidebar {
		background: var(--bg-2);
		color: var(--text);
		border-right: 1px solid var(--bg);
		height: 100vh;
		position: sticky;
		top: 0;
	}

	.nav {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.section-title {
		font-family: var(--font-text);
		font-size: 1rem;
		letter-spacing: 0.05em;
		color: var(--text-2);
		margin: 0.5rem 0;
	}

	.list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
	}

	.link {
		display: block;
		padding: 0.375rem 0.5rem;
		border-radius: 6px;
		text-decoration: none;
		color: var(--text);
		transition:
			background 120ms ease,
			color 120ms ease;
	}

	.link:hover {
		background: var(--bg);
		color: var(--text);
	}

	.link.active {
		background: var(--bg);
		color: var(--text);
		font-weight: 500;
	}
</style>

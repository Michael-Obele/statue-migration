<script>
	import { page } from '$app/state';
	import Button from '$lib/components/ui/Button.svelte';

	const { navbarItems = [], activePath = '' } = $props();

	const isHome = page.url.pathname === '/';

	let menu_button = $state();
</script>

<nav class={['fixed top-0 z-50 h-(--nav-height) w-full', isHome ? 'bg-(--bg)' : 'bg-(--bg-2)']}>
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<a href="/" class="flex items-center space-x-2">
					<div class="h-8 w-8 text-(--color-primary)">
						<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<rect
								x="3"
								y="3"
								width="18"
								height="18"
								rx="2"
								stroke="currentColor"
								stroke-width="2"
							/>
							<path d="M8 12H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
							<path d="M12 8L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						</svg>
					</div>
					<span class="text-xl font-bold">
						<span class="text-[var(--color-primary)]">Statue</span>SSG
					</span>
				</a>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden items-center space-x-4 md:flex">
				<Button href="/about" variant="link">About</Button>
				<Button href="/docs" variant="link">Documentation</Button>
			</div>

			<!-- Mobile menu button -->
			<div class="md:hidden">
				<label class="cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-primary)]">
					<input type="checkbox" class="peer hidden" bind:this={menu_button} />

					<!-- Hamburger icon -->
					<svg
						class="h-6 w-6 peer-checked:hidden"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>

					<!-- Close icon -->
					<svg
						class="hidden h-6 w-6 peer-checked:block"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>

					<!-- Mobile Menu - appears when checkbox is checked -->
					<div
						class="fixed top-16 right-0 left-0 hidden bg-[var(--color-background)] shadow-lg peer-checked:block md:hidden"
					>
						<div class="space-y-1 px-2 pt-2 pb-3">
							<a
								href="/"
								class="block rounded-md px-3 py-2 text-base font-medium {activePath === '/'
									? 'bg-surface text-white'
									: 'hover:bg-surface text-slate-300 hover:text-white'}"
							>
								Home
							</a>

							{#each navbarItems as item}
								{#if item.name !== 'legal'}
									<a
										href={item.url}
										class="block rounded-md px-3 py-2 text-base font-medium {activePath === item.url
											? 'bg-surface text-white'
											: 'hover:bg-surface text-slate-300 hover:text-white'}"
									>
										{item.title}
									</a>
								{/if}
							{/each}

							<a
								href="/docs"
								class="mt-3 block rounded-md bg-[var(--color-primary)] px-3 py-2 text-base font-medium text-[var(--color-on-primary)] hover:brightness-110"
							>
								Documentation
							</a>
						</div>
					</div>
				</label>
			</div>
		</div>
	</div>
</nav>

<svelte:window
	onkeydown={(e) => {
		if (menu_button?.checked && e.key === 'Escape') {
			menu_button.checked = false;
		}
	}}
/>

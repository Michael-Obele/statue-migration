<script>
  import { page } from '$app/state';
  import Button from "$lib/components/ui/Button.svelte";

  const { navbarItems = [], activePath = "" } = $props();

  const isHome = page.url.pathname === '/';

  console.log(page.url.pathname)
  let menu_button = $state();
</script>

<nav
    class={[
        "h-(--nav-height) fixed w-full top-0 z-50",
        isHome ? "bg-(--bg)" : "bg-(--bg-2)"
      ]}
>
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-16">
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <div class="text-[var(--color-primary)] w-8 h-8">
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
          <span class="font-bold text-xl">
            <span class="text-[var(--color-primary)]">Statue</span>SSG
          </span>
        </a>
      </div>

      <!-- Desktop Menu -->
      <div class="hidden md:flex items-center space-x-4">
        <Button href="/about" variant="link">About</Button>
        <Button href="/docs" variant="link">Documentation</Button>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <label class="cursor-pointer text-[var(--color-muted)] hover:text-[var(--color-primary)]">
          <input type="checkbox" class="peer hidden" bind:this={menu_button} />

          <!-- Hamburger icon -->
          <svg class="h-6 w-6 peer-checked:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>

          <!-- Close icon -->
          <svg class="h-6 w-6 hidden peer-checked:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>

          <!-- Mobile Menu - appears when checkbox is checked -->
          <div class="hidden peer-checked:block md:hidden fixed left-0 right-0 top-16 bg-[var(--color-background)] shadow-lg">
            <div class="px-2 pt-2 pb-3 space-y-1">
              <a
                href="/"
                class="block px-3 py-2 rounded-md text-base font-medium {activePath === '/'
                  ? 'bg-surface text-white'
                  : 'text-slate-300 hover:bg-surface hover:text-white'}"
              >
                Home
              </a>

              {#each navbarItems as item}
                {#if item.name !== 'legal'}
                  <a
                    href={item.url}
                    class="block px-3 py-2 rounded-md text-base font-medium {activePath === item.url
                      ? 'bg-surface text-white'
                      : 'text-slate-300 hover:bg-surface hover:text-white'}"
                  >
                    {item.title}
                  </a>
                {/if}
              {/each}

              <a
                href="/docs"
                class="block px-3 py-2 rounded-md text-base font-medium bg-[var(--color-primary)] hover:brightness-110 text-[var(--color-on-primary)] mt-3"
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

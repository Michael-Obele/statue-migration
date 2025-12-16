<script>
	import { resolve } from '$app/paths';

  const {data} = $props();
  console.log("Data", data.sidebar)
</script>

<div class="docs-layout">
  <!-- Sidebar -->
  <aside class="sidebar">
    {#each data.sidebar as group, i (i)}
      <div class="group">
        {#if !group.isRoot}
          <h3 class="group-title">{group.title}</h3>
        {/if}
        <ul class="group-items">
          {#each group.items as item (item.url)}
            <li>
              <a
                href={resolve(item.url)}
                class:active={data.currentPath === item.url}
              >
                {item.title}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/each}
  </aside>

  <!-- Content -->
  <main class="content">
    <h1>{data.page.metadata.title}</h1>
    {#if data.page.metadata.description}
      <p class="description">{data.page.metadata.description}</p>
    {/if}

    <!-- Render .svx content - FIXED -->
    <data.page.content/>
  </main>
</div>

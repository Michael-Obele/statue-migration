<!--
  DocsContent - Documentation content renderer with TOC extraction

  Usage:
  ```svelte
  <script>
    import { DocsContent } from 'statue-ssg';

    let headings = [];
  </script>

  <DocsContent
    content={htmlContent}
    title="Getting Started"
    description="Learn how to get started with our platform"
    bind:headings
  />
  ```

  Props:
  - content: HTML content string
  - title: Page title
  - description: Optional page description
  - lastUpdated: Optional last updated date
  - editUrl: Optional URL to edit this page on GitHub
  - bind:headings: Extracted headings for TOC (reactive output)
-->

<aside>
<p class="text-red-600">
    helloo hello
    helloo hello
        helloo hello
            helloo hello
                helloo hello
                    helloo hello
                        helloo hello
</p>
</aside>


<style>
    aside {
        width: var(--sidebar-width);
    }
</style>

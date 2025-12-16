<script>
	import Button from "$lib/components/ui/Button.svelte";

  // Hero component - Homepage hero section
  const badgeText = '<a href="https://github.com/accretional/statue" target="_blank">✨ Powered by Statue SSG</a>';
  const titleLine1 = 'Welcome!';
  const titleLine2 = 'To your website';
  const description = 'Create amazing static sites easily with Statue SSG using Markdown and Svelte. Fast, secure, and SEO-friendly sites ready in minutes.';
  const secondaryButtonText = 'Explore Content';
  const secondaryButtonLink = '#directories';
  const primaryButtonText = 'Documentation';
  const primaryButtonLink = '/docs';
</script>

<div class="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-20">
	<div class="max-w-5xl mx-auto text-center relative">
		<div>
			<h1 class=" tracking-tight mb-8">
				{titleLine1}
				<br />
				{titleLine2}
			</h1>

			<p class=" max-w-[50ch] mx-auto mb-6 leading-relaxed">
				{description}
			</p>

			<div class="space-x-2">
				<Button href={primaryButtonLink} variant="brand">
					{primaryButtonText}
				</Button>
				<Button href={secondaryButtonLink}>
					{secondaryButtonText}
				</Button>
			</div>
		</div>
	</div>
</div>

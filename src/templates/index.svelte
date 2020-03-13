<script>
  import SEO from './SEO';
</script>

<SEO setViewport charset="utf-8">
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <!-- <link rel="preconnect" href="https://fonts.googleapis.com/" /> -->
  <link
    rel="preload"
    href="/web_modules/svelte/internal.js"
    as="script"
    crossorigin />
  <link rel="preload" href="/templates/index.js" as="script" crossorigin />
  <link rel="preload" href="/templates/SEO.js" as="script" crossorigin />
  <link rel="preload" href="/components/Meta.js" as="script" crossorigin />

  <!-- Seems useless -->
  <!-- <link rel="preload" href="/styles/reset.css" as="style" crossorigin />
  <link rel="preload" href="/styles/sizes.css" as="style" crossorigin />
  <link rel="preload" href="/styles/typography.css" as="style" crossorigin />
  <link rel="preload" href="/styles/colors.css" as="style" crossorigin />
  <link rel="preload" href="/styles/layout.css" as="style" crossorigin />
  <link rel="preload" href="/styles/main.css" as="style" crossorigin /> -->
</SEO>
<!-- favicon="" -->

<nav class="stack horizontal">
  <a href="/">Home</a>
  <a href="/blog/">Blog</a>
  <a href="/tests/">Tests</a>
  <a href="/subscribe/">Subscribe</a>
</nav>
<slot />

<style>
  a {
    padding: var(--gap, 1rem) 0;
  }
</style>

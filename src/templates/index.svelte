<svelte:head>
  <html lang="en" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

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

<script>
  export let text;
</script>

<svelte:head>
  <html lang="en" />
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<nav>
  <a href="/">Home</a>
  <a href="/blog/">Blog</a>
  <a href="/tests/">Tests</a>
</nav>
<slot>
  <h1>{text}</h1>
</slot>

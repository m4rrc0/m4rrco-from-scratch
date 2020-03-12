<script>
  import SEO from './SEO';
</script>

<SEO setViewport charset="utf-8" />
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

<script>
  import SEO from '../templates/SEO';
  import Template from '../templates/index';
  // TODO: Should be done at build time only
  // import appInfo from '../../data/app-info.json';
</script>

<!-- no-js -->
<SEO
  lang="en"
  ogType="website"
  siteName=""
  title="Personal web space of m4rrc0"
  description="One perspective about the web and a workshop place to experiment
  with tooling to allow anyone to express its own"
  canonicalUrl="https://www.m4rr.co/" />

<Template>
  <div class="stack size-context-massive">
    <header>
      <h1>Hey, I'm m4rrc0</h1>
      <p class="color-palette-variation-funky h3">
        multipassionate - frontend dev - father
      </p>
    </header>
    <p>
      If you are not part of group 1. You might not enjoy properly what I am
      producing here. But don't worry, we can still be friends. ;)
    </p>
    <p>
      If you are wondering what is up with this website, I'd say it is a good
      example of what a pet project of a multipassionate can look like. The
      <a href="/blog/building-my-own-static-site-generator-for-svelte/">
        underlying tech
      </a>
      is borderline revolutionnary (and unfinished) but the end result is barely
      showable.
    </p>
    <p>Take care.</p>
  </div>
</Template>

<style>
  .stack {
    --gap: var(--gap-relative);
  }
</style>

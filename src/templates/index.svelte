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

  <!-- ### MANIFEST & ICONS ### -->
  <!-- General -->
  <!-- <link rel="manifest" href="/manifest.webmanifest"> -->

  <!-- <meta name="theme-color" content="#ffffff"> -->
  <!-- <meta name="application-name" content="My Site"> -->

  <link rel="shortcut icon" href="/assets/favicons/favicon.ico" />
  <link
    rel="icon"
    type="image/png"
    sizes="32x32"
    href="/assets/favicons/favicon-32x32.png" />
  <link
    rel="icon"
    type="image/png"
    sizes="16x16"
    href="/assets/favicons/favicon-16x16.png" />

  <!-- Apple -->
  <!-- <meta name="apple-mobile-web-app-title" content="My Site" /> -->

  <link
    rel="apple-touch-icon"
    sizes="180x180"
    href="/assets/favicons/apple-touch-icon.png" />
  <!-- <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="grey" /> -->

  <!-- Microsoft -->
  <!-- <meta name="msapplication-TileColor" content="grey" /> -->
  <!-- <meta name="msapplication-config" content="/favicons/browserconfig.xml" /> -->
  <!-- ### /MANIFEST & ICONS ### -->

</SEO>

<div id="template-global">
  <nav class="stack horizontal">
    <a href="/">Home</a>
    <a href="/blog/">Blog</a>
    <a href="/tests/">Tests</a>
    <a href="/subscribe/">Subscribe</a>
  </nav>
  <slot />
</div>

<style>
  a {
    padding: var(--gap, 1rem) 0;
  }

  #template-global {
    margin-bottom: var(--gap-xxl);
  }
</style>

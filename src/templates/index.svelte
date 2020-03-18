<script>
  import SEO from './SEO';
  // import FontFaceObserver from 'fontfaceobserver';

  // let fontClasses = '';

  if (typeof window !== 'undefined') {
    // Optimization for Repeat Views
    if (sessionStorage.criticalFoftFontsLoaded) {
      console.log('loading fonts from localstorage');
      document.documentElement.className += ' fonts-stage-1 fonts-stage-2';
      // return;
    } else {
      import('fontfaceobserver').then(({ default: FontFaceObserver }) => {
        // FontFaceObserver https://github.com/bramstein/fontfaceobserver
        var fontBodySubset = new FontFaceObserver('LiterataCritical');
        var fontHeadingSubset = new FontFaceObserver('JosefinSansCritical');
        var fontMonoSubset = new FontFaceObserver('FiraCodeCritical');

        Promise.all([
          fontBodySubset.load(),
          fontHeadingSubset.load(),
          fontMonoSubset.load(),
        ]).then(function() {
          // fontClasses = 'fonts-stage-1';
          document.documentElement.className += ' fonts-stage-1';

          var fontBody = new FontFaceObserver('Literata');
          var fontHeading = new FontFaceObserver('Josefin Sans');
          var fontMono = new FontFaceObserver('Fira Code');

          Promise.all([
            fontBody.load(),
            fontHeading.load(),
            fontMono.load(),
          ]).then(function() {
            console.log('ALL FONTS LOADED');
            // fontClasses = 'fonts-stage-1 fonts-stage-2';
            document.documentElement.className += ' fonts-stage-2';

            // Optimization for Repeat Views
            sessionStorage.criticalFoftFontsLoaded = true;
          });
        });
      });
    }
  }
</script>

<SEO setViewport charset="utf-8">
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <!-- <link rel="preconnect" href="https://fonts.googleapis.com/" /> -->

  <!-- We can do that if we are sure we load JS -->
  <link
    rel="preload"
    href="/web_modules/svelte/internal.js"
    as="script"
    crossorigin />
  <link
    rel="preload"
    href="/web_modules/fontfaceobserver.js"
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

  <!-- CRITICAL FONTS PRELOAD -->
  <link
    rel="preload"
    href="/assets/fonts/LiterataCritical.woff2"
    as="font"
    type="font/woff2"
    crossorigin />
  <link
    rel="preload"
    href="/assets/fonts/JosefinSansCritical.woff2"
    as="font"
    type="font/woff2"
    crossorigin />
  <link
    rel="preload"
    href="/assets/fonts/FiraCodeCritical.woff2"
    as="font"
    type="font/woff2"
    crossorigin />
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

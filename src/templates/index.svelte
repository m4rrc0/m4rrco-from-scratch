<script>
  import SEO from './SEO';
  // import FontFaceObserver from 'fontfaceobserver';

  let fontClasses = '';

  // // Optimization for Repeat Views
  // if( sessionStorage.criticalFoftFontsLoaded ) {
  // 	document.documentElement.className += " fonts-stage-1 fonts-stage-2";
  // 	return;
  // }

  if (typeof window !== 'undefined') {
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
        fontClasses = 'fonts-stage-1';
        // document.documentElement.className += " fonts-stage-1";

        var fontBody = new FontFaceObserver('Literata');
        var fontHeading = new FontFaceObserver('Josefin Sans');
        var fontMono = new FontFaceObserver('Fira Code');

        Promise.all([
          fontBody.load(),
          fontHeading.load(),
          fontMono.load(),
        ]).then(function() {
          console.log('ALL FONTS LOADED');
          fontClasses = 'fonts-stage-1 fonts-stage-2';
          // document.documentElement.className += ' fonts-stage-2';

          // Optimization for Repeat Views
          // sessionStorage.criticalFoftFontsLoaded = true;
        });
      });
    });
  }
</script>

<SEO setViewport charset="utf-8">
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <!-- <link rel="preconnect" href="https://fonts.googleapis.com/" /> -->

  <!-- We can do that if we are sure we load JS -->
  <!-- <link
    rel="preload"
    href="/web_modules/svelte/internal.js"
    as="script"
    crossorigin />
  <link rel="preload" href="/templates/index.js" as="script" crossorigin />
  <link rel="preload" href="/templates/SEO.js" as="script" crossorigin />
  <link rel="preload" href="/components/Meta.js" as="script" crossorigin /> -->

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

<div id="template-global" class={fontClasses}>
  <nav class="stack horizontal">
    <a href="/">Home</a>
    <a href="/blog/">Blog</a>
    <a href="/tests/">Tests</a>
    <a href="/subscribe/">Subscribe</a>
  </nav>
  <slot />
</div>

<style>
  /* critical fonts */
  @font-face {
    font-family: LiterataCritical;
    src: url('/assets/fonts/LiterataCritical.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    /* unicode-range: U+65-U+90, U+97-122; */
    font-display: swap;
  }
  @font-face {
    font-family: JosefinSansCritical;
    src: url('/assets/fonts/JosefinSansCritical.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    /* unicode-range: U+65-U+90, U+97-122; */
    font-display: swap;
  }
  @font-face {
    font-family: FiraCodeCritical;
    src: url('/assets/fonts/FiraCodeCritical.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    /* unicode-range: U+65-U+90, U+97-122; */
    font-display: swap;
  }

  /* full fonts */
  /* latin-ext */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 300 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v8/uU9NCBsR6Z2vfE9aq3bh09SDulI.woff2)
      format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
      U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 300 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/firacode/v8/uU9NCBsR6Z2vfE9aq3bh3dSD.woff2)
      format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }
  @font-face {
    font-family: 'Fira Code';
    font-style: normal;
    font-weight: 300 700;
    src: url(https://fonts.gstatic.com/l/font?kit=uU9NCBsR6Z2vfE9aq3bR38bWonK0UzM_0NgBGm3gDIej6XhBbt0HgnPsrJvf-K4xUVu5yh83kYRAvNWnyuxq0zk38gLTMaQbeLy9qHJByU7vRMI1wrmkDqfN2iB4wAAEoTE&skey=33bc0af28fd31bc7&v=v8)
      format('woff2');
  }
  /* latin-ext */
  @font-face {
    font-family: 'Josefin Sans';
    font-style: italic;
    font-weight: 300 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/josefinsans/v15/Qw3EZQNVED7rKGKxtqIqX5EUCEx0XHgciw.woff2)
      format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
      U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Josefin Sans';
    font-style: italic;
    font-weight: 300 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/josefinsans/v15/Qw3EZQNVED7rKGKxtqIqX5EUCEx6XHg.woff2)
      format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Josefin Sans';
    font-style: normal;
    font-weight: 300 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/josefinsans/v15/Qw3aZQNVED7rKGKxtqIqX5EUA3x4RHw.woff2)
      format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
      U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Josefin Sans';
    font-style: normal;
    font-weight: 300 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/josefinsans/v15/Qw3aZQNVED7rKGKxtqIqX5EUDXx4.woff2)
      format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Literata';
    font-style: italic;
    font-weight: 400 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/literata/v15/or3nQ6P12-iJxAIgLYT1FrkdmgPn.woff2)
      format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
      U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Literata';
    font-style: italic;
    font-weight: 400 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/literata/v15/or3nQ6P12-iJxAIgLYT1Frcdmg.woff2)
      format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Literata';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/literata/v15/or3hQ6P12-iJxAIgLYT-JrUFng.woff2)
      format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB,
      U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Literata';
    font-style: normal;
    font-weight: 400 700;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/literata/v15/or3hQ6P12-iJxAIgLYTwJrU.woff2)
      format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
      U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,
      U+2215, U+FEFF, U+FFFD;
  }

  a {
    padding: var(--gap, 1rem) 0;
  }

  #template-global {
    margin-bottom: var(--gap-xxl);
  }
</style>

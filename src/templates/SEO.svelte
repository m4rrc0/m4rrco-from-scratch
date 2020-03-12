<script>
  import Meta from '../components/Meta';

  export let setViewport = false;
  export let charset = '';
  export let lang = '';
  export let ogType = '';
  export let siteName = '';
  export let title = '';
  export let description = '';
  export let canonicalUrl = '';
  export let favicon = '';
  export let socialImage = '';
  // export let children;
</script>

<svelte:head>
  {#if lang}
    <html {lang} />
  {/if}
  {#if charset}
    <meta {charset} />
  {/if}
  {#if setViewport}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  {/if}
  {#if ogType}
    <Meta property="og:type" content={ogType} />
  {/if}

  {#if siteName}
    <Meta property="og:site_name" content={siteName} />
  {/if}

  {#if title && siteName}
    <title>{title} | {siteName}</title>
    <Meta property="og:title" content={`${title} | ${siteName}`} />
  {:else if title}
    <title>{title}</title>
    <Meta property="og:title" content={title} />
  {/if}

  {#if description}
    <Meta name="description" content={description} />
    <Meta property="og:description" content={description} />
  {/if}

  {#if canonicalUrl}
    <Meta tag="link" rel="canonical" href={canonicalUrl} />
    <Meta property="og:url" content={canonicalUrl} />
  {/if}

  {#if favicon}
    <Meta tag="link" rel="icon" type="image/png" sizes="32x32" href={favicon} />
  {/if}

  {#if socialImage}
    <Meta property="og:image" content={socialImage} />
  {/if}

  <slot />

</svelte:head>

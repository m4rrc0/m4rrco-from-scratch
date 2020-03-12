<script>
  export let tag = 'meta';
  export let name = '';
  export let property = '';
  export let content = '';
  export let rel = '';
  export let href = '';
  // export let inner = "";
  // less used properties for link tag
  export let sizes = '';
  export let type = '';
  export let media = '';
  export let as = '';
  export let crossorigin = '';
  export let disabled = '';
  export let hreflang = '';
  export let importance = '';
  export let integrity = '';
  export let referrerpolicy = '';
  export let title = '';

  const metaProps = {
    ...(name && { name }),
    ...(property && { property }),
    ...(content && { content }),
  };
  const linkProps = {
    ...(rel && { rel }),
    ...(href && { href }),
    ...(sizes && { sizes }),
    ...(type && { type }),
    ...(media && { media }),
    ...(as && { as }),
    ...(crossorigin && { crossorigin }),
    ...(disabled && { disabled }),
    ...(hreflang && { hreflang }),
    ...(importance && { importance }),
    ...(integrity && { integrity }),
    ...(referrerpolicy && { referrerpolicy }),
    ...(title && { title }),
  };
</script>

<!-- Docs about link element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link -->
{#if !content && !href}
  <!--  -->
{:else if tag === 'meta'}
  <meta {...metaProps} />
{:else if tag === 'link'}
  <link {...linkProps} />
{/if}

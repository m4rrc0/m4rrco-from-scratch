<script>
  import Template from '../../templates/index';
  import Paragraph from '../../partials/styleguide/paragraph';

  let list6 = [1, 2, 3, 4, 5, 6];
</script>

<Template>
  <div class="stack" style="--gap: 1em">
    <h1>Style guide</h1>
    <p>
      This is actually more a
      <em>work in progress</em>
      design system.
    </p>
    <section class="stack">
      <h2>Typography</h2>
      <h3>Headings</h3>
      <p class="h1">An h1 fox jumps over the fence or whatever</p>
      <p class="h2">An h2 fox jumps over the fence or whatever</p>
      <p class="h3">An h3 fox jumps over the fence or whatever</p>
      <p class="h4">An h4 fox jumps over the fence or whatever</p>
      <p class="h5">An h5 fox jumps over the fence or whatever</p>
      <p class="h6">An h6 fox jumps over the fence or whatever</p>
      <h3>Mix</h3>
      <p class="h1">An h1 fox jumps over the fence or whatever</p>
      <Paragraph />
      <p class="h2">An h2 fox jumps over the fence or whatever</p>
      <Paragraph />
      <p class="h3">An h3 fox jumps over the fence or whatever</p>
      <Paragraph />
      <p class="h4">An h4 fox jumps over the fence or whatever</p>
      <Paragraph />
      <p class="h5">An h5 fox jumps over the fence or whatever</p>
      <Paragraph />
      <p class="h6">An h6 fox jumps over the fence or whatever</p>
      <Paragraph />
    </section>

    <section class="stack">
      <h2>Blocks and boxes</h2>
      <h3>A code block</h3>
      <code class="code-block">
        <pre>
          {`<p class="h2">An h2 fox jumps over the fence or whatever</p>
<p class="h3">An h3 fox jumps over the fence or whatever</p>
<p class="h4">An h4 fox jumps over the fence or whatever</p>`}
        </pre>
      </code>
      <h3>A blockquote</h3>
      <blockquote>
        Alway pay attention to the coupling you are introducing in your code
        base when using specific tools. Ask yourself: "if I want to change this
        piece, how easy will it be?"
      </blockquote>
    </section>

    <section class="stack">
      <h2>Spacing</h2>
      <p class="size-h8">size-h8</p>
      <div
        class="color-palette-variation-contrast"
        style="height: var(--size-h8); display: flex; align-items: center;" />
      <p class="size-h7">size-h7</p>
      <div
        class="color-palette-variation-contrast"
        style="height: var(--size-h7); display: flex; align-items: center;" />
      <p class="size-h6">size-h6</p>
      <div
        class="color-palette-variation-contrast"
        style="height: var(--size-h6); display: flex; align-items: center;" />
      <p class="size-h5">size-h5</p>
      <div
        class="color-palette-variation-contrast"
        style="height: var(--size-h5); display: flex; align-items: center;" />
      <p class="size-h4">size-h4</p>
      <div
        class="color-palette-variation-contrast"
        style="height: var(--size-h4); display: flex; align-items: center;" />
    </section>

    <section class="stack">
      <h2>Grid</h2>
      <div
        class="grid no-gap"
        style="--width-column: calc(var(--measure) / 3);">
        <div>
          {#each list6 as i}
            <article
              class={`box no-border stack color-palette-${((i + 2) % 3) + 1}`}
              style="--padding: var(--size-h5); --gap: 1em;">
              <p class="h3">An h3 fox jumps over the fence or whatever</p>
              <Paragraph />
            </article>
          {/each}
        </div>
      </div>
    </section>

    <section class="stack">
      <h2>Colors</h2>
      {#each list6.filter(i => i < 4) as i}
        <div class={`box stack color-palette-${i}`}>
          <p class="h3">Color palette {i}</p>
          <Paragraph />
          <p>Don't forget to select some text to test colors</p>
          <code class="code-block">
            <pre>
              {`<p class="h2">An h2 fox jumps over the fence or whatever</p>
<p class="h3">An h3 fox jumps over the fence or whatever</p>
<p class="h4">An h4 fox jumps over the fence or whatever</p>`}
            </pre>
          </code>
          <blockquote>
            Alway pay attention to the coupling you are introducing in your code
            base when using specific tools. Ask yourself: "if I want to change
            this piece, how easy will it be?"
          </blockquote>
          <div class="cluster">
            <div>
              <button>Magnificent</button>
              <button class="color-palette-variation-contrast">Wondeful</button>
            </div>
          </div>
        </div>
      {/each}
    </section>
  </div>
</Template>

<style>
  h1,
  h2,
  h3 {
    border-bottom: solid 1px;
  }
</style>

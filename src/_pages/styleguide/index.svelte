<script>
  import Template from '../../templates/index';
  import Paragraph from '../../partials/styleguide/paragraph';
</script>

<Template>
  <div>
    <h1>Style guide</h1>
    <p>
      This is actually more a
      <em>work in progress</em>
      design system.
    </p>
    <section>
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

    <section>
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

    <section>
      <h2>Colors</h2>
      <div class="color-palette-1">
        <p class="h3">Color palette 1</p>
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
        <button>Magnificent</button>
      </div>
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

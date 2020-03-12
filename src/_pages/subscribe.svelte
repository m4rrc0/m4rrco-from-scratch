<script>
  import Template from '../templates/index';
  import SEO from '../templates/SEO';
</script>

<SEO
  lang="en"
  ogType="website"
  siteName="m4rr.co"
  title="Subscribe to the mailing list"
  description="Sent at an irregular pace whenever I get a chance to write
  something interesting"
  canonicalUrl="https://www.m4rr.co/subscribe/" />

<Template>
  <form
    class="stack"
    action="https://tinyletter.com/m4rrc0"
    method="post"
    target="popupwindow"
    onsubmit="window.open('https://tinyletter.com/m4rrc0', 'popupwindow',
    'scrollbars=yes,width=800,height=600');return true">
    <p>
      <label for="tlemail">Your email is all I need to keep you posted</label>
    </p>
    <p>
      <input type="text" name="email" id="tlemail" />
    </p>
    <input type="hidden" value="1" name="embed" />
    <input type="submit" value="Subscribe" />
    <p>
      <a href="https://tinyletter.com" target="_blank">powered by TinyLetter</a>
    </p>
  </form>
</Template>

<style>
  form {
    border: var(--size-border-l) solid currentcolor;
    padding: var(--gap);
    text-align: center;
    align-items: center;
  }

  #tlemail {
    width: 250px;
    max-width: 100%;
  }
</style>

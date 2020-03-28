<script>
  import Template from '../../templates/index';
  import Image from '../../svelte-image/src/Image';
</script>

<Template>
  <div class="grid">
    <div>
      <Image src="/assets/favicons/android-chrome-512x512.png" />
      <img
        src="/assets/favicons/android-chrome-512x512.png"
        style="width: 100%;"
        alt="" />
      <img
        src="/assets/favicon/android-chrome-512x512.png"
        style="width: 100%;"
        alt=""
        onerror="console.log('ERROR'); this.src =
        '/assets/favicons/android-chrome-512x512.png';" />
    </div>
  </div>
</Template>

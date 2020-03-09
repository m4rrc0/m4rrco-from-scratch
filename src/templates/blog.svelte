<script>
  import Template from "./index";
</script>

<Template>
  <div class="stack">
    <slot />
  </div>
</Template>

<style>
  .stack {
    --gap: 1em;
  }
</style>

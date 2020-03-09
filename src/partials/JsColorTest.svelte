<script>
  let color = "blue";

  const changeColor = () => {
    color = color === "blue" ? "red" : "blue";
  };
</script>

<div class="js-test-block" style={`color:${color}`}>
  <p>
    This website is built using svelte and inspired by svelvet. Static HTML
    files are hydrated with standard JS esm modules.
    <br />
    The button below allows me to test if JS is loaded properly. ;)
  </p>
  <button on:click={changeColor}>Change me with JS</button>
</div>

<style>
  .js-test-block {
    padding: 0.5rem;
    border: solid 1px currentcolor;
  }
</style>

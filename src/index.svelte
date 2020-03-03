<script>
  import Link from "./Link";
  import Route from "./Route";
  export let name;
</script>

<!-- Navigation goes here -->
<Link page={{ path: '/', name: 'Home' }} />
<Link page={{ path: '/about', name: 'About' }} />

<!-- Main container goes here -->
<Route />

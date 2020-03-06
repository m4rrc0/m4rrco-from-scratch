<script>
  // import { Router, Link, Route } from "../svelte-routing";
  import Router from "../svelte-routing/Router";
  import Link from "../svelte-routing/Link";
  import Route from "../svelte-routing/Route";
  import Home from "./Home";
  import About from "./About";

  export let url = "";
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="/about/">About</Link>
  </nav>
  <div>
    <Route path="/about/" component={About} />
    <Route path="/">
      <Home />
    </Route>
  </div>
</Router>

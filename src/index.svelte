<script>
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./pages/Home";
  import About from "./pages/About";

  export let url = "";
</script>

<Router {url}>
  <nav>
    <Link to="/">Home</Link>
    <Link to="about">About</Link>
  </nav>
  <div>
    <Route path="about" component={About} />
    <Route path="/">
      <Home />
    </Route>
  </div>
</Router>

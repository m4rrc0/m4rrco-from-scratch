<script>
  // import { Router, Link, Route } from "../svelte-routing";
  import Router from "../../../svelte-routing/Router";
  import Link from "../../../svelte-routing/Link";
  import Route from "../../../svelte-routing/Route";
  import Spa from "../../../templates/spa";
  import Template from "../../../templates/index";

  export let url = "";
</script>

<Template>
  <Router {url}>
    <nav>
      <Link to="/tests/spa/">SPA index</Link>
      <Link to="/tests/spa/one/">SPA page one</Link>
    </nav>
    <div>
      <Route path="/tests/spa/">
        <Spa text="SPA: Page index" />
      </Route>
      <Route path="/tests/spa/one/">
        <Spa text="SPA: Page one" />
      </Route>
    </div>
  </Router>
</Template>

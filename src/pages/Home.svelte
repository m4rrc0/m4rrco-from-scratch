<script>
  import ColorButton from "../components/ColorButton";

  let color = "blue";

  const changeColor = () => {
    color = color === "blue" ? "red" : "blue";
  };
</script>

<style>
  .js-test-block {
    padding: 0.5rem;
    border: solid 1px currentcolor;
  }
</style>

<div>
  <h1>Hey, I'm m4rrc0</h1>
  <p>This is my contribution to the web. Impressive, right?!</p>
  <p>As you can see there is not much here yet. Here is a story for you:</p>
  <p>
    I have been teaching myself web development for approximately 5 years now.
    Among other things I have been freelancing and creating a proto jamstack
    website builder.
  </p>
  <p>
    These wanderings lead me to a lot of reflexion about what I'll call the
    'personal web'. A place on the web for you, that belongs to you and that you
    can control entirely even if you are not a techie.
  </p>
  <p>
    This comes with a lot of challenges but I believe we have everything we need
    to make it happen. Sure, new protocols and big complicated tech could
    probably help but I will leave that to smarter people. In the meantime I
    truly believe that a more open web is just a splat of motivation away.
  </p>
  <p>
    Let's find some decent defaults and a way to customize everything techie.
    Let's use some comon sense low-tech stack. And let's start a small
    revolution where anyone can just easily creates its personal space on the
    web and connect with others.
  </p>

  <br />

  <p>
    The goal of this website is to build my personal space and to be the sandbox
    to create tooling for anyone to do the same
  </p>
  <p>
    I have got a lot of unfinished (and unstarted) articles and code snippets
    lying around. Hopefully there is value in it and taking the time to share
    will benefit everyone (including me).
  </p>
  <p>Feedbacks are greatly appreciated.</p>
</div>

<div class="js-test-block" style={`color:${color}`}>
  <p>
    This website is built using svelte and svelvet. Static HTML files are
    hydrated with standard JS esm modules.
    <br />
    The button below allows me to test if JS is loaded properly. ;)
  </p>
  <ColorButton onClick={changeColor} />
</div>

---
layout: ../../templates/blog.js

title: 'Building my own static site generator for Svelte'
slug: 'building-my-own-static-site-generator-for-svelte'
---

```js exec
import SEO from '../../templates/SEO';
```

```css style
p:last-of-type {
  display: none;
}
```

# { \_metadata.title }

I have been using GatsbyJS since early V2 Alpha. At the time [Jamstack](https://jamstack.org/) was barely a thing but for a newbie (like me at the time) coming into web development and interested in performance and developer experience it was a golden gate wide open and full of fun promises.

It has been so fulfilling to learn web development in the Jamstack communities we have today.

## What I have done since

I have been freelancing and doing web projects with React and Gatsby mostly.

A large portion of my time has been going in building [toile.io](https://www.toile.io/) and the [Gatsby site builder](https://github.com/toile-webstack/gatsby-site-builder) that it uses. To be honest I don't know if this project is good or bad. I have been told things like "it is not a 'real product' since you don't offer your own editing experience" (editing is done through Contentful). At the same time, clients are happy with the result and it allows me (and my graphic designer partner) to build customizable websites fairly quickly.

While there is a lot of things to improve I think I am reasonably proud of it considering 90% of the code has been written when I was 2-3 years into programming.

I have also done all the classic mistakes a beginner can do. That alone probably makes the experience worthy.

## The frustrations

Despite all the good stuff Gatsby was doing for me, frustrations arose. Gatsby is doing a lot of things under the hood. I would argue that it is mostly built for beginners. You can certainly build very big and complex projects with it but then you need a level of expertise that could make Gatsby useless.

The GraphQL layer is a good example of hidden complexity. It is a great way for beginners to be able to explore their data. As a beginner, you feel good using this shiny newish tech and understanding what happens to your data and pulling it in your components. So great...

Then you land on a "[bug](https://github.com/gatsbyjs/gatsby/issues/1517)"... except you are told "that is how GraphQL works...". You know there are clear solutions but you have no idea how to implement this with GraphQL. So you try to find a workaround because you want to stay focus on your project. And here you are 3 years later, still stuck with your workaround...

I am not going to expand on this point because I trust that you have either experienced the same kind of issue or are perfectly happy with your stack.

**Bottom line**: I have spent countless hours trying to figure out how to solve or work around problems that were very much Gatsby specific. I probably learned a few things from this but mostly it made me knowledgeable with Gatsby, not so much web development in general.

## Decoupling your code from the tools you use

The GraphQL layer has become a real burden in my Gatsby site builder. Every time a solution to one of my problems arise it brings new problems that I need to investigate. And every new Gatsby functionality makes the API and the ecosystem wider as well which probably makes it even harder for the Gatsby team to tackle the broad array of issues.

As an experiment, I tried removing usage of the GraphQL layer from my Gatsby site builder. I knew this would solve a bunch of issues I have been dragging for a long time. I didn't really evaluate the consequences of handling data manually but that is why it is an experiment. I wanted to find out.

The data fetching from Contentful took me an hour or so. I could just copy the interesting parts of the code from the `gatsby-source-contentful` plugin and the Contentful documentation is clear so it is a piece of cake.
Then I was doing a bunch of data transformations with Gatsby plugins like transforming markdown and creating some fields. Also a lot easier to do when you can just manipulate JSON instead of transforming a GraphQL schema...

In the end, I put my experiment on pause because I want to refactor core pieces of my app and some of these pieces were tightly coupled with the way I was handling data with GraphQL.

**Bottom line**: I cannot fully evaluate yet the benefits and costs of using specific tools but I know I want to pay more attention to spending time learning web development good practices and spend less time debugging specific tooling I have little control on.
We know we need to modularize but we don't really know how to do it until we are faced with our first deep refactoring. I guess that is one of those things that come with experience.

> Alway pay attention to the coupling you are introducing in your code base when using specific tools. Ask yourself: "if I want to change this piece, how easy will it be?"

## The trigger

Development has been slow on my Gatsby site builder. One reason is bad maintainability. Like I said before, I have probably done all the mistakes a rookie can do (at least I hope I have done most).

Between handling clients' requests, rewriting almost the whole app, implementing new features and improving scalability to be able to make it a business, setting priorities has been challenging to say the least.

One day, as I was disappointed by the loading time of the JS bundle on some clients' sites I re-discovered Rich Harris talk about Svelte _[Rethinking Reactivity](https://youtu.be/AdNJ3fydeao)_. That lead me to some explorations on (among others) [Svelte](https://svelte.dev/), [Sapper](https://sapper.svelte.dev/), [SSG](https://github.com/sw-yx/ssg), [Svelvet](https://github.com/jakedeichert/svelvet), ...

I also tried [Eleventy](https://www.11ty.dev/). It is super tempting to dig into and must be a delight to use for a personal site for example... I am just not sure I want to drop the 'framework feel' from my daily dev practice

One thought was haunting me:

> That would be great to have a super lightweight and fast static site generator that provides the developer experience of a framework while being able to generate an SPA, a PWA or a plain and simple HTML site.

These wanderings and reflexions lead to [this discussion](https://github.com/jakedeichert/svelvet/issues/31).

And finally to launching [this site](https://www.m4rr.co/) ([repo](https://github.com/MarcCoet/m4rrco-from-scratch)).

## Building an SSG

I am finally building my personal site.

I decided to try and build my own static site generator along the way and more generally, create the editing experience I would like to provide to my clients and everyone creating its own **_personal web space_**. I am fairly happy with this decision so far. I have been making steady progress and haven't encountered a major road block so far. To be honest I didn't think development would be so smooth especially since I am navigating in uncharted water. JS is my language of choice but all the tools I am using were unknown to me a few weeks back.

The principles I want to follow:

- sites must be fast to navigate and have a fast build time
- boilerplate is ok if it removes the "magic black box" effect
- use the simplest convenient tech possible / stay close to the platform
- development experience of a framework
- progressively enhance the sites on the principle of [Andy Bell's "minimum viable experience"](https://hankchizljaw.com/wrote/the-p-in-progressive-enhancement-stands-for-pragmatism/), meaning we can use all the shiny new tech available as long as we provide a viable experience for older browsers.
- no magic around Progressive Web App creation but sensible defaults

I should point out that the end goal is not simply a SSG but a **_portable website_ that is editable without code and customizable with code.**

## What does this SSG looks like so far

It is very much based on [svelvet](https://github.com/jakedeichert/svelvet) and [snowpack](https://www.snowpack.dev/). It is using Svelte only to compile JS and HTML files (no headless chrome or other prerendering engine).

1. It copies files with random extensions from the `src` folder to the `dist` folder
2. It compiles `.svelte` and `.js` files to the `dist` folder to be used as [web modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) directly in your application.
3. It compiles `.svelte` and `.js` files to the `build` folder as needed for server side rendering.
4. It generates hydratable HTML files for pages
   - based on folder structure (every svelte component in `src/_pages` gets its HTML equivalent)
   - programmatically with the `src/routes.js` file
5. It puts external dependencies in `dist/web_modules` as web modules thanks to snowpack

The result is a `dist` folder with HTML, JS and other assets files you can host on any static host. Files are not bundled so we get some kind of automatic code splitting.

### Caveats

Web modules are not supported in IE. It means IE clients will only see our HTML so we need to provide them with a minimum viable experience.

### Fun and interesting features

- dev server with hot reloading (a bit clumsy at the moment)
- CSS can be defined either globally in a CSS file or embedded in the HTML `<head>` (or inline on html elements if you need dynamic behavior)
- can build 2 types of nav experience: "HTML to single page application (SPA)" (like Gatsby) or "each page its JS" (like Eleventy). You can even mix in the same project some parts as individual pages and some groups of pages as SPAs.
- can write svelte components in markdown thanks to [MDsveX](https://github.com/pngwn/MDsveX).

### WIP roadmap

- RSS feed
- be able to not load JS at all if we only want HTML and/or our page does not generate any side effect anyway
- look into adding more preprocessors like sass, postCSS, ...
- design the site with _nuds_ (website design tooling that will be the subject of other articles)
- better handle external libraries
- make hot reloading work properly
- check how to safely remove CSS from JS components created with svelte (should be safe when an HTML page is created but not if it is a client-only route in SPA mode)
- looking at Progressive Web App creation
- looking at integrating IndieWeb functionalities
- incremental builds would be nice

If you are curious, please test it out but don't expect any kind of support until I experiment with it more and decide to release it in some fashion. Nonetheless I would greatly appreciate any constructive feedback or general opinion.

Get in touch on [Twitter](https://twitter.com/M4rrc0)<br/>
Subscribe to the [newsletter](https://www.m4rr.co/subscribe/)<br/>
Support my work on [Patreon](https://www.patreon.com/m4rrco/)

<SEO
    lang="en"
    ogType="article"
    siteName="m4rr.co"
    title="{_metadata.title}"
    description="A self-criticism about my development practices and early vision for my static site generator using SvelteJS"
    canonicalUrl="https://www.m4rr.co/blog/building-my-own-static-site-generator-for-svelte/" />

<!-- <meta property='article:author' content='https://www.facebook.com/YOUR-NAME' />
<meta property='article:publisher' content='https://www.facebook.com/YOUR-PAGE' />
<meta property='og:site_name' content='YOUR-SITE-NAME' /> -->

<!--
## Conclusion

I guess my conclusion is very broad, can apply to many more things than SSGs and is just common programmer's sense...

If you have a traditional use case in mind for a project and you have examples of successful usage of some tooling, it is probably not worth developing your own tooling from scratch. But at the very least, think about decoupling as much as you can every part of your code base.

If on the other hand you are thinking about creating an original product, you should strongly consider developing from scratch while testing existing tools and "stealing" open code when you like what they are doing.

I slowly come to think about open source more in terms of sharing ideas and showing your code (what "open source" really means in the end) than free software. -->

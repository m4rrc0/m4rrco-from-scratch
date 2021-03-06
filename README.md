# The web is full of sh\*t!

Our everyday life on the web is made of clunky, buggy, overloaded proprietary tools.

According to Google Research (and [this article](https://www.thinkwithgoogle.com/intl/en-ca/marketing-resources/data-measurement/mobile-page-speed-new-industry-benchmarks/)), in 2017

> the average time it takes to fully load a mobile landing page is 22 seconds.

[This article](https://kinsta.com/blog/zero-carbon-websites/) points out that according to [WebsiteCarbon.com](https://www.websitecarbon.com/)'s data

> The average website produces 6.8 grams of CO2 per page view. [...] An average website with 10,000 page views per month would produce 816kg of CO2 per year. That’s **more than the emissions produced by a flight from London to Tokyo**.

If you look for it on the web, you will see that more and more people are looking for (or would be open to) alternatives to facebook. [This article](https://www.vox.com/2018/9/5/17824116/delete-facebook-mark-zuckerberg-social-media-break-time-well-spent) for example highlights the decreasing trust of the general public towards facebook.

Note: More sources are welcome!

## What are you gonna do 'bout it?

**I am going to create a fµck\*ng easy way for anyone to create modern, sustainable websites for free (or very cheap) while owning their own data!!**

Anyone will be able to reclaim their identity on the web and create their own social circle with no strings attached (except with love ones of course ;) ).

## Yeah yeah... and I will be eating swedish sushis on the moon with the president tomorrow

Don't believe me? I am actually half way there!

3 years ago (I was approx. 2 years into programming) I built [toile.io](https://www.toile.io/) as a way for my clients to edit their own [jamstack](https://jamstack.org/) websites and for me to automate website creation a little bit. Now, the project is [free and open source](https://github.com/toile-webstack/gatsby-site-builder).

It is a prototype and it leaves a lot of space for improvement. The thing is that, even though this particular project has not evolved as much as I would have liked it to, I have been obsessed with this idea for 3 years! And I have got a lot of ideas and code snippets lying around waiting to find their rightful place in this project.

## A broader picture

What is the web (and cloud) to you? A way to:

- communicate?
- backup your data?
- follow your friends' news and whereabouts?
- get things done through web apps?
- express yourself through creative content or art?
- playing games?
- ...

Hopefully all of that. The web is a marvelous tool and we are only scratching the surface of what it can allow us to do.

Now think of the tools you are using for all these experiences. How much are you depending on there good will to keep your data safe? What happens if the company providing the service goes bankrupt or get hacked? What happens if the company management changes or shareholders decide that profitability could be improved by leveraging users' data?

## Hhmm... so what are you gonna build?

My plan is to re-start from scratch and [learn in public](https://www.swyx.io/writing/learn-in-public). The goal for my personal website is to be the sandbox to experiment with new features and a showcase of my peregrination.

My guiding principles for this 'website builder' project:

- non-tech users should be at ease creating their website (at some point)
- power users should be able to produce equivalent or higher quality websites as they would when coding them from scratch
- smart ejectable defaults for every part of the project from design to backend choices
- opinionated decisions with as much modularity as possible. I want to be able to replace some part of the code or some tech decision with something else easily
- being as low tech as convenient
- using as much open tech as convenient
- doing it for myself and for bringing something valuable to the world
- host your own or mutualize to make it easy and cheap
- write about it while I build
- content has to be separated from the code base
- themes should be separated as well
- ... (more will come as I build)

The moving parts, things to explore and build upon (in no particular order):

- service workers
- data structure for the web (and the brain?)
- simplify design choices
- on-page wysiwyg editing 2.0
- zero emission website
- personal hub on the web
- resource mutualization and data ownership
- indie web
- semantic web
- ...

Current roadmap:

- [ ] put this thing online
  - no style
  - basic html
- [ ] [mailing list](https://tinyletter.com/m4rrc0) and [Patreon](https://www.patreon.com/m4rrco)
  - embedded form for mailing list
- [ ] first article on "basic html setup"
- [ ] smallest setup to be productive
  - ? Eleventy ?
  - ? custom svelte compile to html ?
- [ ] research how I could have wysiwyg on-page edit. Can I code a POC in 1 day?
- [ ] should I use files or
- [ ] ...

## Cool!!!

Are you a developer? Do you want to join me on this trip, help me research and brainstorm? Drop me a line by email at join+SPAM@m4rr.co (remove the "+SPAM" unless you are a spammer ;) ).

Do you feel like a beta tester? You should join the mailing list to get all the news.

Do you earn a decent salary and want to help me build this thing and produce valuable content? You can [become a patron](https://www.patreon.com/m4rrco).

Are you a company wanting to sponsor this work? Contact me at contact+SPAM@m4rr.co (remove the "+SPAM").

Do you have questions? Feel free to ask at info+SPAM@m4rr.co (guess what you should remove...) or ping me [on twitter](https://twitter.com/m4rrc0).

---

## Notes on how to use this project

### How files are created

Every `.svelte`, `.js` and `.md` files in the `src` folder are converted to `.js` files automatically.
Every dependency is placed in a `web_modules` folder by snowpack.

### Pages

Every file in `src/pages` folder and sub-folders will get picked up and create an HTML equivalent starting at the root instead of the `pages` folder. Ex: `src/pages/blog/one.svelte` will create an html file at `dist/blog/one/index.html` (and will also create a `.js` file at `dist/pages/blog/one.js`).

There is also a programmatic way of creating pages. create a file at `src/routes.js` like so

```javascript
export default [
  {
    path: '/',
    name: 'Home',
    component: 'pages/index',
    data: {
      text: 'Home Page',
      whatever: 'you want',
    },
  },
  {
    path: '/about/',
    name: 'About',
    component: 'templates/index',
    data: {
      text: 'About Page',
    },
  },
]
```

The `component` property intentionally bares no reference to the 'root' folder it leaves in and the extension (`.svelte` for example).

Watch out because programmatic pages will replace implied pages from the `src/pages` folder

### MDsveX

This uses MDsveX to allow creation of pages in markdown.

You need to:

- use the `md` extension
- specify the layout in each md file's frontmatter as something like `layout: ../../layouts/index.js`
  - note the `.js` extension even though your layout is probably a `.svelte` file

### TODO

Generally, generating html files tend to trigger issues. We should evaluate using a more traditional build process with Rollup for example for the SSR files we need to generate HTML. The problem is we will end up with two different build setup and it may introduce inconsistencies... Maybe a more solid babel setup can prevent issues when resolving dependencies.

- ~~Look for creating an SPA that takes over after HTML instead of per-page js loading~~
- Avoid loading JS entirely if there is no JS needed on the page
- Look at the Babel config to customize the default svelvet/snowpack
  - the way paths to dependencies are modified is very rigid and we need to hack around so that they resolve as we expect

# A look at data structure for the web and beyond

Structured data is important for the web. It helps for SEO and as the web grows exponentially it is supposed to help us make sense of this fog of data.

Ironically, we don't really see this structured data as we browse the web. Sure, we sometimes get 'rich snippets' in google search but it's about it. A web page may be well structured but it does not make it structured data.

The result is that (from my observations) only SEO aficionados will care about structured data. It will often be a second thought when we start thinking about metadata and we will start duplicating the info on the page inside a JSON-LD script or add RFA or microdata attributes.

... devs don't care, designers don't care, content creators don't care

## What if we tried to consider structured data first?

After all, schema.org is a well thought beast (...structured map). People have spent countless hours putting this together by observing intent and practices on the web (?). Why not leverage that expertise and build upon it.

What if, when publishing a new event, my CMS suggested me to add a name, a startDate, endDate, location, images, description, performers, ...

[Example by Google](https://developers.google.com/search/docs/data-types/event) of JSON-LD structured data for an event.

```
{
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "The Adventures of Kira and Morrison",
      "startDate": "2025-07-21T19:00",
      "endDate": "2025-07-21T23:00",
      "location": {
        "@type": "Place",
        "name": "Snickerpark Stadium",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "100 West Snickerpark Dr",
          "addressLocality": "Snickertown",
          "postalCode": "19019",
          "addressRegion": "PA",
          "addressCountry": "US"
        }
      },
      "image": [
        "https://example.com/photos/1x1/photo.jpg",
        "https://example.com/photos/4x3/photo.jpg",
        "https://example.com/photos/16x9/photo.jpg"
       ],
      "description": "The Adventures of Kira and Morrison is coming to Snickertown in a can’t miss performance.",
      "offers": {
        "@type": "Offer",
        "url": "https://www.example.com/event_offer/12345_201803180430",
        "price": "30",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-05-21T12:00"
      },
      "performer": {
        "@type": "PerformingGroup",
        "name": "Kira and Morrison"
      }
    }
```

... but also reviews, sponsors, typicalAgeRange, a doorTime, ...
(See the [full list of schema.org properties for events](https://schema.org/Event) for more)

I don't know about you but I wouldn't have necessarily thought about all this. Yet knowing the most common properties I could have to handle can help me think about my design.

## What about creative content

I'd argue that free-form / creative content is how you make your data digestible... even enjoyable ideally. **Creative content is essential** as the web is still (and should remain) predominantly for humans. It is just the part you (as a developer or designer) have very little control over. Your first testimonial may be a one-liner and the second a love letter written in alexandrines.

## Throwing data into the view

From my experience with toile.io and other projects, there is usually 2 main ways we display a 'collection item' (for example an event, a blog post, a recipe, a testimonial, ...). One is the full view. If I display an event on its own page for example, I will show everything I know from this event. It will be the main source of info regarding this event. The second type of display is as a preview, for example in a list showing all the events happening of the coming month. A simple project will probably only need one type of preview while a more complex project may need a 'compact' preview and a more detailed preview of the same 'collection item' in different places.

[images]

(remember I am talking about websites. Apps with a lot of interactivity may be a different beast but I still think there is interesting things to consider)

The point is... your preview will most probably only need the structured data. That is good news because structured data is also easier to work with and get creative design wise.

As creative content is free-form, we generally need to put it in a kind of sandbox and apply general design rules. The more freedom we give to content (creators), the more this rule applies.

**The alternative is giving design powers to content creators!**

Interestingly, this idea has precedence. That is the old fight of CMS Vs website builder.

The former gives you a clean design with few surprises while the later gives you more freedom (and choices to make and ways to screw up the design).

## Free-form content as data

There are a few super interesting initiatives in this area:
[list]

- MDX, MDsveX
- Contentful ?

Instead of transforming a rich-text field (markdown or otherwise) straight to html, these libraries create a data structure mirroring the content.

The idea is generally to create an abstract syntax tree (AST) or JSON representation of the content. What is interesting to us with this approach is that suddenly we are not limited by html tags anymore. We can create any inline or block content we want.

A classic example is internal links. If we write classic markdown and we want to create an internal link to one of our articles, we will need to find its URL and 'hard write' it. Then if we decide to change the URL for some reason, we will need to find manually all instances of it in all our content and update it.
But if we can create custom inline elements and control both the UI for editing and displaying it, the becomes way easier. The UI for displaying can remain a simple link but the editing UI will be a relation to the article directly.

## Structured free-form content

Now I call creative content "free-form" because its structure is loosely defined. Practically though, editors will need tools and UIs to edit their content. It means we need to account for any type of content we want our editors to be able to create. If we don't provide a way for our editors to make the text bold, they just can't do it.

So what content does our editors may need to create?
By our own definition, free-form content is opposed to structured data. It means that everything that may be on a website and that is not structured data, should be part of the free-form content.

Let's see where this takes us:

- the classics
  - h1-6, p, strong, em, a, blockquote, ...
- forms
- images and galleries
- references to other pages -> links or preview components
- icons
- buttons
- ... what else?

The final check: does it make sense for all this to be composed freely across the whole site? I think it does.

We should also encourage good practice and account for common use cases to make them easily implementable.
In particular I am thinking about the usage of headings that is a common source of wrong markup. The usage of an image as the main heading of an index page is also a common pattern. Finally the usage of semantic markup instead of plain ol' divs is a common issue with site builders.

## Components

There is no suspense (?) anymore, the next decade of front-end development will be about components. Even the back-end is getting 'componentized' [source].

We have been designing with components for [X] years now but if you want to spark a conversation (who said argument?) with any font-end dev, ask them about **how** they split their code into components. You hear things like 'components should be small and reusable' [source] or 'components with too many variants is bad practice' [source].

At the end of the day, there will probably never be an universal answer to this problem but some guidelines would be nice.

---

I have created a prototype jamstack website builder 3 years ago and I have been thinking about website content a lot since then. At the end of the day, I have come to think about static content in only 2 ways. You are either creating creative content to make it enjoyable to browse your site or linking structured data together. The third thing you do is creating dynamic functionality (forms, calls to action, reservations and whatnot).

---

I should dive in my vision for components in another post. Let's just suggest a way to think about (part of) your component model and your layout composition.

Let's start with a simple blog. Each blog post has structured data and free-form content. Let's keep it simple: free-form content goes in the main body of the post dedicated page

I know that my event has structured data and free-form content

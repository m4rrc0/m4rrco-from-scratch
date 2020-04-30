---
id: 'testing'
refs:
  test1: testing1
  test2: testing2

layout: /templates/blog.js

title: 'Testing Blink source'
slug: 'testing-blink-source'
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

- { \_metadata.refs.test1 }
- { \_metadata.refs.test2 }

<SEO
    lang="en"
    ogType="article"
    siteName="m4rr.co"
    title="{_metadata.title}"
    description="Testing"
    canonicalUrl="https://www.m4rr.co/blog/{_metadata.slug}/" />

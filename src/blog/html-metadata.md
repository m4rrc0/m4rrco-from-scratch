---
layout: ../../templates/index.js
draft: true
---

# HTML metadata

```
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
```

Does not seem usful if we want to have only minimal support for older browsers

```
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Explainations:

- `width=device-width` adapts the width of the website to the screen size
- `initial-scale=1` starts with no zoom applied
- `viewport-fit=cover` extends the website under the notch on IOS affected devices. More details on this [CSS-Tricks article](https://css-tricks.com/the-notch-and-css/).

Seems enough. We could:

- prevent or control the min and max zoom on mobile devices but why would we? If the user needs to zoom, who are we to decide thay can't?!
- avoid an inconcsitency on IOS 9.0 through 9.2 with `shrink-to-fit=no`but [apparently](https://www.scottohara.me/blog/2018/12/11/shrink-to-fit.html) on January 8, 2019, usage was at 0.17%... I hope these poor souls have updated since then.

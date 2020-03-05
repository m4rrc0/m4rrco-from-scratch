---
layout: ../../templates/index.js
---

buttons have been designed with CSS for some time now and I don't really see how

```
<Button variant="contained" color="primary">
  Primary
</Button>
```

is clearer or more powerful than

```
<button class="contained primary">Primary</button>
```

for example.

Sure, a component like that is easy to compose and there are probably some very (few) good reasons to go that way but I'd argue that 99% of the time it is over-engineered, less practical and les maintainable.

---

should encapsulate a unit of meaning (like an object in OOP?)

# Absolute Positioning without Adding "top", "left", etc.

---

To preface, remember that if an element is given a `position: absolute` property, until it is given `top`, `left`, etc. properties, that element will be laid out according to how it would if it wasn't taken out of the flow in its containing block - even if the containing block is statically positioned, i.e. not given `position: relative | absolute | etc` (it will still exist as if it wasn't in flow, so other elements will not be aware of the space it takes up). If the absolutely positioned element _IS_ given `top` for example, then it will position itself according to the nearest containing block which is not statically positioned.

With this in mind, we could implement a tooltip that appears on hover of an `a` tag in such a manner:

```html
<div>
  <p>
    Some random text that I want to add a link to <a href="/asdf" class="tooltip-container">like this 
     <span class="tooltip">This is a tooltip</span>
    </a> and some text after the link!
  </p>
</div>
```
```css
.tooltip-container {
  display: inline-block; // want to have inline-block display so that the tooltip will actually sit beneath and align with the <a> tag. If the <a> container remains as `inline` the tooltip will not align with the containing <a> tag
  position: relative; // 
}

.tooltip {
  display: none; // by default, want to hide the tooltip when <a> tag is not being hovered over. Once hovered, give `.tooltip` display block (instead of keeping it as an inline span) so that it will actually sit below the <a>, rather than to the side
  position: absolute; // take the tooltip out of flow to be able to appear above text below the <a> tag
  min-width: 200px; // if not given a width/min-width, the tooltip text will try to be as small as possible due to the absolute positioning. Can add a width to make it longer horizontally
}

.tooltip-trigger:hover .tooltip { // selector to show the tooltip when the `.tooltip-container` element is hovered over
  display: block;
}
```

The key points here are the `position: absolute` on the tooltip, the tooltip appearing as a child of the <a> tag, the <a> tag having `display: inline-block`, and the tooltip having `display: block` when hovered over.

# Module 0

## Colors

Recommendation is to use `hsl` syntax for color - hue, saturation, and lightness

- hue is the actual pigment in the color, in units of degrees, e.g. `hsl(150deg, 100%, 50%)`
- saturation is how grayed out or vibrant the color is, in `%`. At `0%`, hue doesn't matter anymore and it is just "gray" because there is 0 pigmentation
- lightness is lighter or darker, in `%`. At `100%` lightness, the color is pure white

To specify transparency/alpha channel with `hsl`, can write as `hsl(150deg, 50%, 75% / 0.75)` where `0.75` is opacity and the `/` is a separator, not division

---

## Units

Pixels are pretty standard unit

The `em` unit is relative to font size of the current element - `1em` is same font size, `0.5em` is half, etc

- For example, "If a heading has a font-size of 24px, and we give it a bottom padding of 2em, we can expect that the element will have 48px of cushion underneath it (2 × 24px)."
- in general, `em` not that useful because "It can be very surprising when a tweak to font-size affects the spacing of descendant elements."

The `rem` unit is relative to the font size of the root element, the `html` tag

- "By default, the HTML tag has a font size of 16px, so 1rem will be equal to 16px."
- "Please note, You shouldn't actually set a px font size on the html tag. This will override a user's chosen default font size."
- "If you really want to change the baseline font size for rem units, you can do that using ems or rems:"

```css
html {
  /* 20% bigger `rem` values, app-wide! */
  font-size: 1.2em;
}
```

The percentage unit is often used with width/height, as a way to consume a portion of the available space.

General rules of thumb for units:

- For typography, generally use `rem`, because it has important accessibility benefits.
- When it comes to properties that relate to the box model — padding, border, margin — usually use pixels. It's more intuitive than rem, and there isn't a clear accessibility win.
- For `width/height`, it'll depend on whether I want the element to be a fixed size, or a relative size. I might want one div to always be 250px wide, while another one should be 50% of the available space.
- For color, preference is hsl
- Reserve `em` for the rare cases when I want one property to scale directly with font size.

---

## Typography

---

# Module 1

---

# Module 4 - Flexbox

Core idea with flexbox is that it is a way to control the distribution of space along a single axis

- almost as a secondary thought, there is functionality to control how items are distributed in the cross-axis

Summary points:

- `"Flexbox is most handy when we have a set of things, and we want to control their distribution along a primary axis, either horizontally or vertically."`
- `"Flexbox is still relevant, even with CSS Grid reaching wide browser support. It's a different tool for a different job: CSS Grid works best for two-dimensional layouts, while Flexbox offers more flexibility for working with a single dimension."`
- `"When we apply display: flex to an element, we toggle the "Flexbox" layout algorithm for the element's children. The parent element will still use Flow layout."`

## Directions and Alignment

`justify-content` is for primary axis, `align-items` for secondary axis

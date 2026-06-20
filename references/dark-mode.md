# Dark Mode Variant

Swap these token values when user asks for dark mode. Same SVG structure, same layout — only colors change.

## Invoke

`/visualcave dark — topic`

---

## Token Overrides

```
Page bg:         #0F1117
Card bg:         #1A1D27
Card border:     #2A2D3A

Panel fills (dark tints):
  Warm yellow:   bg #2A2310  border #F9A825  label #FDD835
  Warm orange:   bg #2A1A08  border #FB8C00  label #FFA726
  Cool blue:     bg #0A1929  border #1E88E5  label #42A5F5
  Soft green:    bg #0A1F0A  border #43A047  label #66BB6A
  Soft purple:   bg #1A0A2A  border #7B1FA2  label #AB47BC
  Soft teal:     bg #002A2A  border #00ACC1  label #26C6DA
  Neutral:       bg #1E2130  border #3A3D50  label #9E9E9E
  Code:          bg #1A1F2E  border #2D3250  label #E0E0E0

Node fill:       #1E2130
Node stroke:     #3A3D50
Node label:      #E8E8E8
Node sublabel:   #757575

Arrow default:   #4A4D60
Arrow label bg:  #1A1D27
Arrow label text:#9E9E9E

Title text:      #F5F5F5
Subtitle text:   #757575

Legend bg:       #1E2130
Legend border:   #2A2D3A
Legend text:     #9E9E9E
```

## CSS changes (replace in `<style>`)

```css
body {
  background: #0f1117;
}
.page {
  background: #1a1d27;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
}
h1 {
  color: #f5f5f5;
}
.sub {
  color: #757575;
}
.card {
  background: #1e2130;
  border-color: rgba(255, 255, 255, 0.06);
}
.card-eyebrow {
  color: #616161;
}
.card h3 {
  color: #e8e8e8;
}
.card ul {
  color: #9e9e9e;
}
```

## SVG background

```svg
<rect width="900" height="HEIGHT" fill="#1A1D27"/>
```

## Node — dark variant

```svg
<rect x="X" y="Y" width="W" height="H" rx="8" fill="#1E2130"/>
<rect x="X" y="Y" width="W" height="H" rx="8" fill="#1E2130" stroke="#3A3D50" stroke-width="1.5"/>
<text ... fill="#E8E8E8">Label</text>
<text ... fill="#757575">sublabel</text>
```

## Combined dark + animated

Fully supported — apply dark token overrides first, then layer animation classes. The animation CSS is color-agnostic and works unchanged on dark mode.

# Visual design system — carried over from TalentSpace/SGA

People Factory is a separate, simpler product (candidate personality
assessment → report → interview action items), but it should look like it
belongs to the same family as TalentSpace/SGA. This file is the design
handoff it was built from — kept verbatim for traceability.

## Colors

**Primary navy: `#19377C`.** Use this, not the `brand-primary: #3772ff` in
`design-tokens.ts`'s `brandPalette` — that one is flagged in the source
codebase as an invented color that never traced back to anything in the
real design system. `#19377C` is the one actually used everywhere (buttons,
active nav states, the sign-in illustration gradient) and traces back to a
real button in the Figma file. See `src/config/palette.ts` for the actual
palette this codebase renders with.

| Role | Hex | Used for |
|---|---|---|
| Primary navy | `#19377C` | Buttons, links, active/selected states |
| Primary navy (hover) | `#14295E` | Button hover |
| Primary navy (pale tint) | `#ECF1FE` | Selected-row backgrounds, notice boxes |
| Primary navy (pale border) | `#CED8F0` | Borders on the pale-tint backgrounds |
| Text — primary | `#353535` | Body text, headings |
| Text — secondary | `#817C7C` | Captions, muted labels |
| Surface — card fill | `#FFFFFF` | Cards, panels |
| Surface — variant fill | `#F5F5F5` | Input backgrounds, subtle panels |
| Surface — border | `#E3E3E3` | Card/input borders |
| Danger / destructive | `#AA0F12` | Error text |

Repurposed here as `clarityBandTokens` (`src/config/palette.ts`) — a
four-step scale for how clearly a candidate leans toward one pole of a
dichotomy, adapted from SGA's five-step gap-severity scale:

| Band | Fill | Border |
|---|---|---|
| slight | `#C5FFD3` | `#3FE266` |
| moderate | `#FFDEA9` | `#E0A23C` |
| clear | `#A9E8FF` | `#2BB8F0` |
| veryClear | `#00E339` | `#00A82A` |

## Fonts

Two fonts, both via `next/font/google`, loaded once in the root layout as
CSS variables — see `src/app/layout.tsx`.

- **DM Sans**, `--font-dm-sans` — wordmark/logo text only.
- **Inter**, `--font-inter` — everything else (body, buttons, labels, inputs).

Reference a font as `font-family: var(--font-inter), 'Inter', sans-serif;`
(keep the literal `'Inter'` fallback — matches the SGA codebase's own
convention, and guards against forgetting to load a font before referencing
it, which was a real bug there).

## Shape & spacing

- Card/panel radius: **16px**
- Button/input radius: **10px**
- Small chip/pill radius: **8px** (or `999px` for a fully round pill)
- Card shadow (used sparingly, e.g. the auth illustration's mock card):
  `box-shadow: 0 32px 64px -12px rgba(9, 20, 51, 0.45);`

## The auth shell (sign-in) pattern

`src/app/sign-in/sign-in.css` + `AuthIllustration.tsx` are the sign-in
screen split: a form on one side (`.auth-form-side`, max-width 360px,
centered) and a navy gradient illustration panel on the other
(`.auth-illustration-side`, hidden below 900px — mobile gets the form only).
The illustration is a lo-fi mock of *this product's own* report screen
(trait bars + a type chip), not stock art.

## What NOT carried over from SGA

People Factory doesn't use SGA's sidebar/dashboard chrome, its HR-specific
data model (employees, divisions, role profiles), or its gap-scoring engine.
Only the palette, fonts, shape/spacing, and the auth-shell pattern came over;
everything else — the question-flow UI, the report page, the four-dichotomy
data model — is original to this product.

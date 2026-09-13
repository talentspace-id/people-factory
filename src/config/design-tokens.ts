/**
 * Design tokens carried over verbatim from the TalentSpace/SGA codebase's
 * design handoff (see DESIGN.md at the repo root). Kept as-is for traceability
 * even where People Factory doesn't use a value directly — `brandPalette` in
 * particular is flagged there as an invented color that never traced back to
 * the real Figma file; use `src/config/palette.ts` for the palette People
 * Factory actually renders with.
 */

export interface DesignToken {
  readonly figmaName: string;
  readonly value: string;
}

export const gapChipTokens = {
  "gap-exceeds": { figmaName: "Chips & Progress Bar/<0%", value: "#a9e8ff" },
  "gap-met": { figmaName: "Chips & Progress Bar/0%", value: "#00e339" },
  "gap-minor": { figmaName: "Chips & Progress Bar/1-25%", value: "#c5ffd3" },
  "gap-moderate": { figmaName: "Chips & Progress Bar/26-50%", value: "#ffdea9" },
  "gap-severe": { figmaName: "Chips & Progress Bar/>50%", value: "#ff484b" },
} as const satisfies Record<string, DesignToken>;

export const gapChipBorderTokens = {
  "gap-exceeds": { value: "#2bb8f0", confirmed: false },
  "gap-met": { value: "#00a82a", confirmed: false },
  "gap-minor": { value: "#3fe266", confirmed: true },
  "gap-moderate": { value: "#e0a23c", confirmed: false },
  "gap-severe": { value: "#aa0f12", confirmed: true },
} as const satisfies Record<string, { value: string; confirmed: boolean }>;

export const surfaceTokens = {
  "surface-fill": { figmaName: "Surfaces/Main & Variant/Fill", value: "#ffffff" },
  "surface-variant-fill": { figmaName: "Surfaces/Main & Variant/Variant Fill", value: "#f5f5f5" },
  "surface-card-border": { figmaName: "Surfaces/Card/Border", value: "#e3e3e3" },
} as const satisfies Record<string, DesignToken>;

export const textTokens = {
  "text-primary": { figmaName: "Text/Primary", value: "#353535" },
  "text-secondary": { figmaName: "Text/Secondary", value: "#817c7c" },
} as const satisfies Record<string, DesignToken>;

/** Invented, never traced to the real design system — do not use; see palette.ts. */
export const brandPalette = {
  "brand-ink": "#353535",
  "brand-primary": "#3772ff",
  "brand-tint": "#cae5ff",
  "brand-tint-alt": "#ecf1fe",
  "brand-surface": "#ebf2fa",
} as const;

export type GapChipToken = keyof typeof gapChipTokens;

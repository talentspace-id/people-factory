/**
 * The palette People Factory actually renders with — per DESIGN.md, `#19377C`
 * (a real button color from the SGA Figma file), not `brandPalette` in
 * design-tokens.ts. CSS files hardcode these same hex values directly (matching
 * the SGA codebase's own convention); this module exists for the handful of
 * places JS needs a color value, e.g. picking a fill for a dichotomy bar.
 */

export const navy = {
  primary: "#19377C",
  primaryHover: "#14295E",
  paleTint: "#ECF1FE",
  paleBorder: "#CED8F0",
} as const;

export const text = {
  primary: "#353535",
  secondary: "#817C7C",
} as const;

export const surface = {
  card: "#FFFFFF",
  variant: "#F5F5F5",
  border: "#E3E3E3",
} as const;

export const danger = "#AA0F12" as const;

/**
 * Repurposed from SGA's `gapChipTokens` five-step scale (see DESIGN.md), remapped
 * from "how far below/above requirement" to "how clear a dichotomy preference is."
 * Four bands rather than five: there's no "exceeds" equivalent for a preference
 * clarity score — clarity only runs from barely-there to unmistakable.
 */
export const clarityBandTokens = {
  slight: { fill: "#C5FFD3", border: "#3FE266" },
  moderate: { fill: "#FFDEA9", border: "#E0A23C" },
  clear: { fill: "#A9E8FF", border: "#2BB8F0" },
  veryClear: { fill: "#00E339", border: "#00A82A" },
} as const;

export type ClarityBand = keyof typeof clarityBandTokens;

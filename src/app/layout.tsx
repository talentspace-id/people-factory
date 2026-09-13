/**
 * Root shell — carried over verbatim from the TalentSpace/SGA codebase's
 * font-loading pattern (see DESIGN.md, "Fonts"). DM Sans is the wordmark font;
 * Inter is the body font used everywhere else, both loaded once as CSS
 * variables so any component CSS can reference var(--font-dm-sans) /
 * var(--font-inter).
 */

import type { ReactNode } from "react";
import { DM_Sans, Inter } from "next/font/google";
import "./index.css";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "People Factory",
  description: "Candidate personality assessment, report, and interview action items",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${dmSans.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

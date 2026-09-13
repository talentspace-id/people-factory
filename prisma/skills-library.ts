/**
 * The v1 question bank and action-item content — original wording, not the
 * licensed Myers-Briggs instrument (see docs/PRODUCT-SPEC.md, "Question
 * bank"). 8 forced-choice items per dichotomy (32 total): thin for v1, but
 * data (this file feeds prisma/seed.ts, not application code), so growing it
 * toward the ~300-question target in DESIGN.md's brief is a seed change, not
 * a deploy.
 */

import type { Dichotomy } from "@prisma/client";

export interface SeedQuestion {
  dichotomy: Dichotomy;
  poleA: string;
  poleB: string;
  statementA: string;
  statementB: string;
}

export const SEED_QUESTIONS: SeedQuestion[] = [
  // --- EI ---
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "I like to think out loud, even before I've fully worked out my answer.", statementB: "I prefer to work through my thoughts privately before speaking." },
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "After a long week, I recharge by being around other people.", statementB: "After a long week, I recharge by spending time alone." },
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "In a meeting, I'll jump in with a half-formed idea to keep the conversation moving.", statementB: "In a meeting, I wait until I've organized my thoughts before speaking." },
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "I do my best thinking in conversation with others.", statementB: "I do my best thinking in quiet, uninterrupted focus time." },
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "I'm comfortable being the center of attention in a group.", statementB: "I'd rather stay out of the spotlight in a group setting." },
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "I make new contacts easily and enjoy networking.", statementB: "I prefer deepening a few existing relationships over meeting new people." },
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "A busy, buzzing office energizes me.", statementB: "A busy, buzzing office drains me by the end of the day." },
  { dichotomy: "EI", poleA: "E", poleB: "I", statementA: "I'd rather call someone to sort out a problem.", statementB: "I'd rather write an email and think it through first." },

  // --- SN ---
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I trust what I can directly observe and verify.", statementB: "I trust the patterns and connections I sense beneath the surface." },
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I focus on the practical details of how something works right now.", statementB: "I focus on where something could go or what it could become." },
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I prefer instructions that are specific and step-by-step.", statementB: "I prefer being given the goal and figuring out my own approach." },
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I describe things literally, with concrete detail.", statementB: "I describe things using analogies and metaphors." },
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I'm drawn to proven methods with a track record.", statementB: "I'm drawn to novel approaches, even if unproven." },
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I notice small factual errors quickly.", statementB: "I notice when the bigger picture doesn't add up." },
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I'd rather improve something that already works.", statementB: "I'd rather reinvent something, even if it currently works fine." },
  { dichotomy: "SN", poleA: "S", poleB: "N", statementA: "I learn best from hands-on practice.", statementB: "I learn best from exploring theory and concepts first." },

  // --- TF ---
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "When giving feedback, I lead with the honest assessment.", statementB: "When giving feedback, I lead with how it will land." },
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "I make decisions by weighing pros, cons, and logic.", statementB: "I make decisions by weighing how people will be affected." },
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "Fairness means applying the same rule to everyone.", statementB: "Fairness means accounting for each person's circumstances." },
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "I can set aside personal feelings to make a hard call.", statementB: "I find it hard to make a call that hurts someone, even if it's right." },
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "I value being right over being liked.", statementB: "I value harmony over winning an argument." },
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "In conflict, I focus on resolving the actual issue.", statementB: "In conflict, I focus on how everyone is feeling." },
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "I'd rather be seen as competent than warm.", statementB: "I'd rather be seen as warm than competent." },
  { dichotomy: "TF", poleA: "T", poleB: "F", statementA: "Criticism doesn't bother me if it's accurate.", statementB: "Criticism stings even when it's accurate." },

  // --- JP ---
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "I like having a plan and sticking to it.", statementB: "I like keeping my options open as long as possible." },
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "An unfinished task nags at me until it's done.", statementB: "I can leave a task open and come back to it later without stress." },
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "I make a to-do list and work through it in order.", statementB: "I work on whatever feels most relevant in the moment." },
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "I prefer to decide early and move on.", statementB: "I prefer to gather more information before deciding." },
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "A messy, unplanned schedule stresses me out.", statementB: "A rigid, over-scheduled day stresses me out." },
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "I like closing loops and checking things off.", statementB: "I like leaving room to adapt as things change." },
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "I pack for a trip days in advance.", statementB: "I pack for a trip at the last minute." },
  { dichotomy: "JP", poleA: "J", poleB: "P", statementA: "Deadlines motivate me to plan ahead.", statementB: "Deadlines motivate me right before they hit." },
];

interface PoleProfile {
  label: string;
  coreBehavior: string;
  interviewQuestion: string;
}

const POLE_PROFILES: Record<string, PoleProfile> = {
  E: {
    label: "Extraversion",
    coreBehavior: "This candidate thinks out loud and draws energy from interaction — expect them to process ideas verbally, in real time, rather than arriving with a fully-formed answer.",
    interviewQuestion: "Ask them to walk through a decision as they made it, not just the conclusion — you'll likely see the reasoning happen live.",
  },
  I: {
    label: "Introversion",
    coreBehavior: "This candidate reflects before speaking and recharges through solitude — a quick answer under pressure may understate what they actually think.",
    interviewQuestion: "Send a question in advance, or allow a pause after asking one, before reading silence as a lack of an answer.",
  },
  S: {
    label: "Sensing",
    coreBehavior: "This candidate anchors on concrete, verifiable detail and present reality over abstract possibility.",
    interviewQuestion: "Ask for a specific, detailed example from past work rather than a hypothetical — that's where they'll be most precise.",
  },
  N: {
    label: "Intuition",
    coreBehavior: "This candidate gravitates toward patterns, connections, and future implications over step-by-step specifics.",
    interviewQuestion: "Ask where they see a process heading in a year, not just how it runs today — and expect fewer procedural details in return.",
  },
  T: {
    label: "Thinking",
    coreBehavior: "This candidate decides on logical consistency and objective criteria, and may state a hard truth plainly.",
    interviewQuestion: "Probe how they've handled a decision that was correct but unpopular — that tension is where this trait shows up most.",
  },
  F: {
    label: "Feeling",
    coreBehavior: "This candidate weighs impact on people and values harmony alongside the objective merits of a decision.",
    interviewQuestion: "Ask how they've delivered difficult feedback — listen for how they balance honesty with the relationship.",
  },
  J: {
    label: "Judging",
    coreBehavior: "This candidate prefers structure, early closure, and a settled plan over lingering ambiguity.",
    interviewQuestion: "Ask how they react when a plan changes midway — this is where a strong preference for closure can show as rigidity.",
  },
  P: {
    label: "Perceiving",
    coreBehavior: "This candidate prefers flexibility and keeping options open, adapting as new information arrives.",
    interviewQuestion: "Ask how they keep a loosely-planned project on track — this is where flexibility can show as under-planning.",
  },
};

const BAND_PHRASE: Record<string, { title: string; qualifier: string }> = {
  SLIGHT: { title: "leans slightly toward", qualifier: "This is a weak signal from a small margin of answers — treat it as a hypothesis to probe, not a conclusion." },
  MODERATE: { title: "shows a moderate preference for", qualifier: "Expect this to show up in typical work situations, though not always." },
  CLEAR: { title: "shows a clear preference for", qualifier: "Plan interview questions and role expectations around this trait — it's a consistent pattern in their answers." },
  VERY_CLEAR: { title: "shows a very strong, consistent preference for", qualifier: "This is close to a defining trait for this candidate — worth explicitly validating against the role's actual day-to-day demands." },
};

export interface SeedActionItemTemplate {
  dichotomy: Dichotomy;
  pole: string;
  band: "SLIGHT" | "MODERATE" | "CLEAR" | "VERY_CLEAR";
  title: string;
  guidance: string;
  order: number;
}

export function buildActionItemTemplates(): SeedActionItemTemplate[] {
  const dichotomies: { dichotomy: Dichotomy; poles: [string, string] }[] = [
    { dichotomy: "EI", poles: ["E", "I"] },
    { dichotomy: "SN", poles: ["S", "N"] },
    { dichotomy: "TF", poles: ["T", "F"] },
    { dichotomy: "JP", poles: ["J", "P"] },
  ];
  const bands: SeedActionItemTemplate["band"][] = ["SLIGHT", "MODERATE", "CLEAR", "VERY_CLEAR"];

  const templates: SeedActionItemTemplate[] = [];
  let order = 0;
  for (const { dichotomy, poles } of dichotomies) {
    for (const pole of poles) {
      const profile = POLE_PROFILES[pole];
      for (const band of bands) {
        const phrase = BAND_PHRASE[band];
        templates.push({
          dichotomy,
          pole,
          band,
          title: `${profile.label} — ${phrase.title} this trait`,
          guidance: `${profile.coreBehavior} ${phrase.qualifier} ${profile.interviewQuestion}`,
          order: order++,
        });
      }
    }
  }
  return templates;
}

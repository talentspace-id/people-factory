import { POLE_LABELS, type DichotomyResult } from "@/lib/scoring/mbti";
import { clarityBandTokens, type ClarityBand } from "@/config/palette";

/** One split bar per dichotomy — poleA's share on the left, poleB's on the right. */
export function DichotomyBar({ result }: { result: DichotomyResult }) {
  const pctA = result.total === 0 ? 50 : Math.round((result.countA / result.total) * 100);
  const band = result.band as ClarityBand;

  return (
    <div className="pf-dichotomy-row">
      <div className="pf-dichotomy-labels">
        <span className={result.winner === result.poleA ? "pf-dichotomy-winner" : ""}>
          {result.poleA} · {POLE_LABELS[result.poleA] ?? result.poleA}
        </span>
        <span className={result.winner === result.poleB ? "pf-dichotomy-winner" : ""}>
          {POLE_LABELS[result.poleB] ?? result.poleB} · {result.poleB}
        </span>
      </div>
      <div className="pf-dichotomy-track">
        <div
          className="pf-dichotomy-fill"
          style={{
            width: `${pctA}%`,
            background: clarityBandTokens[band].fill,
            borderColor: clarityBandTokens[band].border,
          }}
        />
      </div>
      <div className="pf-dichotomy-caption">
        {result.clarityPct}% clarity ({band === "veryClear" ? "very clear" : band})
      </div>
    </div>
  );
}

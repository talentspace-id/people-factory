/**
 * Decorative lo-fi rendering of People Factory's own report screen — trait
 * bars plus a type chip, not stock art (see DESIGN.md). Purely presentational.
 */

const TRAIT_ROWS = [
  { label: "E", fill: 72 },
  { label: "N", fill: 58 },
  { label: "T", fill: 81 },
  { label: "J", fill: 64 },
];

export default function AuthIllustration() {
  return (
    <div className="auth-illustration-side" aria-hidden="true">
      <div className="auth-illustration-glow" />
      <div className="auth-illustration-content">
        <div className="auth-mock-card">
          <div className="auth-mock-card-header">
            <div className="auth-mock-avatar" />
            <div className="auth-mock-header-lines">
              <div className="auth-mock-line" style={{ width: "70%" }} />
              <div className="auth-mock-line" style={{ width: "45%" }} />
            </div>
            <div className="auth-mock-type-chip">ENTJ</div>
          </div>
          {TRAIT_ROWS.map((row) => (
            <div className="auth-mock-trait-row" key={row.label}>
              <span className="auth-mock-trait-label">{row.label}</span>
              <div className="auth-mock-trait-track">
                <div className="auth-mock-trait-fill" style={{ width: `${row.fill}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="auth-illustration-caption">
          <h2>See how a candidate thinks before the interview</h2>
          <p>A short assessment, a clear type breakdown, and interview action items ready to use.</p>
        </div>
      </div>
    </div>
  );
}

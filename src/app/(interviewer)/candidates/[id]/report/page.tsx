import { notFound } from "next/navigation";
import { getCurrentInterviewer } from "@/lib/auth/session";
import { getCandidateWithReport } from "@/lib/db/candidates";
import { DichotomyBar } from "@/components/DichotomyBar";
import { ActionItemList } from "@/components/ActionItemList";
import type { DichotomyResult } from "@/lib/scoring/mbti";
import type { RankedActionItem } from "@/lib/scoring/action-items";

export default async function CandidateReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const interviewer = await getCurrentInterviewer();
  if (!interviewer) return notFound();

  const candidate = await getCandidateWithReport(interviewer.accountId, id);
  const assessment = candidate?.assessments[0];
  const report = assessment?.report;
  if (!candidate || !report) return notFound();

  const dichotomyScores = report.dichotomyScores as unknown as DichotomyResult[];
  const actionItems = report.actionItems as unknown as RankedActionItem[];

  return (
    <>
      <div className="pf-page-header">
        <h1 className="pf-page-title">{candidate.fullName}</h1>
      </div>

      <div className="pf-report-header">
        <span className="pf-report-type-chip">{report.typeCode}</span>
      </div>
      <p className="pf-report-headline">{report.headline}</p>

      <div className="pf-report-grid">
        <div className="pf-card">
          <h2 className="pf-section-title">Dichotomy breakdown</h2>
          {dichotomyScores.map((result) => (
            <DichotomyBar key={result.dichotomy} result={result} />
          ))}
        </div>

        <div className="pf-card">
          <h2 className="pf-section-title">Interview action items</h2>
          <ActionItemList items={actionItems} />
        </div>
      </div>
    </>
  );
}

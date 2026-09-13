import { resolveInviteToken } from "@/lib/auth/candidate";
import { getAssessmentProgress } from "@/lib/db/assessment";
import { submitAnswer } from "./actions";
import "./assessment.css";

export default async function AssessmentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await resolveInviteToken(token);

  if (!invite) {
    return (
      <div className="assessment-shell">
        <div className="assessment-card assessment-notice">
          <h1>This link isn't valid</h1>
          <p>It may have expired. Ask your interviewer to send a new invite.</p>
        </div>
      </div>
    );
  }

  const progress = await getAssessmentProgress(invite.accountId, invite.assessmentId, invite.questionSetId);

  if (!progress.nextQuestion) {
    return (
      <div className="assessment-shell">
        <div className="assessment-card assessment-notice">
          <h1>You've already completed this</h1>
          <p>Thanks — your interviewer has your results.</p>
        </div>
      </div>
    );
  }

  const question = progress.nextQuestion;
  const pct = Math.round((progress.answeredCount / progress.totalQuestions) * 100);

  const chooseA = submitAnswer.bind(null, token, question.id, "A");
  const chooseB = submitAnswer.bind(null, token, question.id, "B");

  return (
    <div className="assessment-shell">
      <div className="assessment-card">
        <div className="assessment-progress-track">
          <div className="assessment-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="assessment-progress-caption">
          Question {progress.answeredCount + 1} of {progress.totalQuestions}
        </p>
        <p className="assessment-prompt">Which is closer to how you actually behave?</p>
        <div className="assessment-choices">
          <form action={chooseA}>
            <button className="assessment-choice-button" type="submit">
              {question.statementA}
            </button>
          </form>
          <form action={chooseB}>
            <button className="assessment-choice-button" type="submit">
              {question.statementB}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

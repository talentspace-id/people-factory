import Link from "next/link";
import { getCurrentInterviewer } from "@/lib/auth/session";
import { listCandidates } from "@/lib/db/candidates";

const STATUS_LABEL: Record<string, string> = {
  INVITED: "Invited",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const STATUS_CLASS: Record<string, string> = {
  INVITED: "invited",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export default async function DashboardPage() {
  const interviewer = await getCurrentInterviewer();
  const candidates = interviewer ? await listCandidates(interviewer.accountId) : [];

  return (
    <>
      <div className="pf-page-header">
        <h1 className="pf-page-title">Candidates</h1>
        <Link className="pf-button-primary" href="/candidates/new">
          Invite candidate
        </Link>
      </div>

      <div className="pf-card">
        {candidates.length === 0 ? (
          <div className="pf-empty-state">
            No candidates yet. Invite one to send them the assessment.
          </div>
        ) : (
          <table className="pf-candidate-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Invited</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id}>
                  <td>{candidate.fullName}</td>
                  <td>{candidate.email}</td>
                  <td>
                    <span className={`pf-status-chip ${STATUS_CLASS[candidate.status]}`}>
                      {STATUS_LABEL[candidate.status]}
                    </span>
                  </td>
                  <td>{candidate.createdAt.toLocaleDateString("en-ID")}</td>
                  <td>
                    {candidate.status === "COMPLETED" ? (
                      <Link href={`/candidates/${candidate.id}/report`}>View report</Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

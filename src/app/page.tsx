import { redirect } from "next/navigation";
import { getCurrentInterviewer } from "@/lib/auth/session";

export default async function RootPage() {
  const interviewer = await getCurrentInterviewer();
  redirect(interviewer ? "/dashboard" : "/sign-in");
}

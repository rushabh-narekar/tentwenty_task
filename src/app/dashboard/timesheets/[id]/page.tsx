import { TimesheetWeekView } from "@/components/timesheets/TimesheetWeekView";

interface TimesheetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TimesheetDetailPage({
  params,
}: TimesheetDetailPageProps) {
  const { id } = await params;

  return <TimesheetWeekView timesheetId={id} />;
}

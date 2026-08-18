import type { TimesheetStatus } from "@/types";

const statusStyles: Record<TimesheetStatus, string> = {
  completed: "bg-[#E6F4EA] text-[#1E7E34]",
  incomplete: "bg-[#FFF8E1] text-[#B8860B]",
  missing: "bg-[#FCE8EF] text-[#C2185B]",
};

const statusLabels: Record<TimesheetStatus, string> = {
  completed: "COMPLETED",
  incomplete: "INCOMPLETE",
  missing: "MISSING",
};

interface StatusBadgeProps {
  status: TimesheetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded px-2.5 py-1 text-xs font-semibold tracking-wide ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}

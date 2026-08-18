import type { TimesheetStatus } from "@/types";

export function deriveTimesheetStatus(
  totalHours: number,
  targetHours: number,
): TimesheetStatus {
  if (totalHours <= 0) {
    return "missing";
  }

  if (totalHours >= targetHours) {
    return "completed";
  }

  return "incomplete";
}

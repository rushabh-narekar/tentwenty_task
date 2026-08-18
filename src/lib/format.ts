import type { TimesheetStatus } from "@/types";

const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function parseDateParts(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseDateParts(startDate);
  const end = parseDateParts(endDate);

  const startMonth = MONTHS_LONG[start.month - 1];
  const endMonth = MONTHS_LONG[end.month - 1];

  if (startMonth === endMonth) {
    return `${start.day} - ${end.day} ${startMonth}, ${end.year}`;
  }

  return `${start.day} ${startMonth} - ${end.day} ${endMonth}, ${end.year}`;
}

export function formatShortDate(date: string): string {
  const { month, day } = parseDateParts(date);
  return `${MONTHS_SHORT[month - 1]} ${day}`;
}

export function getActionLabel(status: TimesheetStatus): string {
  if (status === "completed") {
    return "View";
  }
  if (status === "incomplete") {
    return "Update";
  }
  return "Create";
}

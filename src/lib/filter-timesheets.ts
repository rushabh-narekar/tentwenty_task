import type { Timesheet, TimesheetStatus } from "@/types";

export interface DateRangeOption {
  value: string;
  label: string;
  startDate: string;
  endDate: string;
}

export const dateRangeOptions: DateRangeOption[] = [
  {
    value: "2024-01-01:2024-01-31",
    label: "1 - 31 January, 2024",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
  },
  {
    value: "2024-01-01:2024-01-15",
    label: "1 - 15 January, 2024",
    startDate: "2024-01-01",
    endDate: "2024-01-15",
  },
  {
    value: "2024-01-15:2024-01-31",
    label: "15 - 31 January, 2024",
    startDate: "2024-01-15",
    endDate: "2024-01-31",
  },
  {
    value: "2024-01-22:2024-02-01",
    label: "22 January - 1 February, 2024",
    startDate: "2024-01-22",
    endDate: "2024-02-01",
  },
  {
    value: "2024-02-01:2024-02-29",
    label: "1 - 29 February, 2024",
    startDate: "2024-02-01",
    endDate: "2024-02-29",
  },
  {
    value: "2024-03-01:2024-03-31",
    label: "1 - 31 March, 2024",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
  },
  {
    value: "2024-01-01:2024-03-31",
    label: "January - March, 2024",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
  },
  {
    value: "2024-04-01:2024-04-30",
    label: "1 - 30 April, 2024",
    startDate: "2024-04-01",
    endDate: "2024-04-30",
  },
];

export function timesheetOverlapsRange(
  timesheet: Timesheet,
  rangeStart: string,
  rangeEnd: string,
): boolean {
  return timesheet.startDate <= rangeEnd && timesheet.endDate >= rangeStart;
}

export function filterTimesheets(
  timesheets: Timesheet[],
  options: {
    dateRange?: { startDate: string; endDate: string };
    status?: TimesheetStatus | "all";
  },
): Timesheet[] {
  return timesheets.filter((timesheet) => {
    if (options.dateRange) {
      const overlaps = timesheetOverlapsRange(
        timesheet,
        options.dateRange.startDate,
        options.dateRange.endDate,
      );
      if (!overlaps) {
        return false;
      }
    }

    if (options.status && options.status !== "all") {
      if (timesheet.status !== options.status) {
        return false;
      }
    }

    return true;
  });
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "ellipsis"> = [1];

  if (currentPage > 3) {
    items.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (currentPage < totalPages - 2) {
    items.push("ellipsis");
  }

  items.push(totalPages);
  return items;
}

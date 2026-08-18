import { deriveTimesheetStatus } from "@/lib/timesheet-status";
import {
  filterTimesheets,
  timesheetOverlapsRange,
} from "@/lib/filter-timesheets";
import type { Timesheet } from "@/types";
import { describe, expect, it } from "vitest";

describe("deriveTimesheetStatus", () => {
  it("returns missing when no hours are logged", () => {
    expect(deriveTimesheetStatus(0, 40)).toBe("missing");
  });

  it("returns incomplete when hours are below target", () => {
    expect(deriveTimesheetStatus(20, 40)).toBe("incomplete");
  });

  it("returns completed when target hours are met", () => {
    expect(deriveTimesheetStatus(40, 40)).toBe("completed");
  });
});

describe("filterTimesheets", () => {
  const timesheets: Timesheet[] = [
    {
      id: "ts-1",
      weekNumber: 1,
      startDate: "2024-01-01",
      endDate: "2024-01-05",
      status: "completed",
      totalHours: 40,
      targetHours: 40,
    },
    {
      id: "ts-5",
      weekNumber: 5,
      startDate: "2024-01-28",
      endDate: "2024-02-01",
      status: "missing",
      totalHours: 0,
      targetHours: 40,
    },
  ];

  it("includes all overlapping weeks for a date range", () => {
    const result = filterTimesheets(timesheets, {
      dateRange: { startDate: "2024-01-01", endDate: "2024-01-31" },
    });

    expect(result).toHaveLength(2);
  });

  it("filters by missing status", () => {
    const result = filterTimesheets(timesheets, { status: "missing" });

    expect(result).toHaveLength(1);
    expect(result[0].weekNumber).toBe(5);
  });
});

describe("timesheetOverlapsRange", () => {
  it("returns true when the week overlaps the selected range", () => {
    expect(
      timesheetOverlapsRange(
        {
          id: "ts-3",
          weekNumber: 3,
          startDate: "2024-01-15",
          endDate: "2024-01-19",
          status: "incomplete",
          totalHours: 20,
          targetHours: 40,
        },
        "2024-01-01",
        "2024-01-20",
      ),
    ).toBe(true);
  });
});

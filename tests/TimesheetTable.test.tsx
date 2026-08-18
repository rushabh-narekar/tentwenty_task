import { TimesheetTable } from "@/components/timesheets/TimesheetTable";
import { render, screen } from "@testing-library/react";
import type { Timesheet } from "@/types";

const mockTimesheets: Timesheet[] = [
  {
    id: "ts-1",
    weekNumber: 1,
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    status: "completed",
    totalHours: 40,
    targetHours: 40,
  },
];

describe("TimesheetTable", () => {
  it("renders timesheet rows from API data", () => {
    render(
      <TimesheetTable
        timesheets={mockTimesheets}
        isLoading={false}
        error=""
        onRetry={() => undefined}
        onAction={() => undefined}
      />,
    );

    expect(screen.getByText("Your Timesheets")).toBeInTheDocument();
    expect(screen.getAllByText("COMPLETED").length).toBeGreaterThan(0);
    expect(screen.getAllByText("View").length).toBeGreaterThan(0);
  });

  it("shows loading state", () => {
    render(
      <TimesheetTable
        timesheets={[]}
        isLoading
        error=""
        onRetry={() => undefined}
        onAction={() => undefined}
      />,
    );

    expect(screen.getByText("Loading timesheets...")).toBeInTheDocument();
  });
});

import { TimesheetModal } from "@/components/timesheets/TimesheetModal";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Timesheet } from "@/types";
import { vi } from "vitest";

vi.mock("@/lib/api/timesheets", () => ({
  updateTimesheet: vi.fn(),
}));

import { updateTimesheet } from "@/lib/api/timesheets";

const missingTimesheet: Timesheet = {
  id: "ts-5",
  weekNumber: 5,
  startDate: "2024-01-28",
  endDate: "2024-02-01",
  status: "missing",
  totalHours: 0,
  targetHours: 40,
};

describe("TimesheetModal", () => {
  it("opens create modal with form fields", () => {
    render(
      <TimesheetModal
        isOpen
        timesheet={missingTimesheet}
        onClose={() => undefined}
        onSuccess={() => undefined}
      />,
    );

    expect(screen.getByText("Create Timesheet")).toBeInTheDocument();
    expect(screen.getByLabelText(/week #/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
  });

  it("shows validation errors for invalid form", async () => {
    const user = userEvent.setup();

    render(
      <TimesheetModal
        isOpen
        timesheet={missingTimesheet}
        onClose={() => undefined}
        onSuccess={() => undefined}
      />,
    );

    await user.clear(screen.getByLabelText(/start date/i));
    await user.clear(screen.getByLabelText(/end date/i));
    await user.click(screen.getByRole("button", { name: /create timesheet/i }));

    expect(await screen.findByText("Start date is required")).toBeInTheDocument();
  });

  it("submits create form successfully", async () => {
    vi.mocked(updateTimesheet).mockResolvedValue({
      ...missingTimesheet,
      status: "incomplete",
    });

    const onSuccess = vi.fn();
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <TimesheetModal
        isOpen
        timesheet={missingTimesheet}
        onClose={onClose}
        onSuccess={onSuccess}
      />,
    );

    await user.click(screen.getByRole("button", { name: /create timesheet/i }));

    expect(updateTimesheet).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
});

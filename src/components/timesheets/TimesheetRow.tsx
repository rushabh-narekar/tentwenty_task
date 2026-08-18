import { StatusBadge } from "@/components/timesheets/StatusBadge";
import { formatDateRange, getActionLabel } from "@/lib/format";
import type { Timesheet } from "@/types";

interface TimesheetRowProps {
  timesheet: Timesheet;
  onAction: (timesheet: Timesheet) => void;
}

export function TimesheetRow({ timesheet, onAction }: TimesheetRowProps) {
  const actionLabel = getActionLabel(timesheet.status);

  return (
    <>
      <tr className="hidden border-b border-[#E5E7EB] last:border-b-0 md:table-row">
        <td className="bg-[#F9FAFB] px-6 py-4 text-sm text-[#1A1A1A]">
          {timesheet.weekNumber}
        </td>
        <td className="px-6 py-4 text-sm text-[#1A1A1A]">
          {formatDateRange(timesheet.startDate, timesheet.endDate)}
        </td>
        <td className="px-6 py-4">
          <StatusBadge status={timesheet.status} />
        </td>
        <td className="px-6 py-4">
          <button
            type="button"
            onClick={() => onAction(timesheet)}
            className="text-sm font-medium text-primary-600 hover:underline"
          >
            {actionLabel}
          </button>
        </td>
      </tr>

      <tr className="md:hidden">
        <td colSpan={4} className="border-b border-[#E5E7EB] p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  Week {timesheet.weekNumber}
                </p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  {formatDateRange(timesheet.startDate, timesheet.endDate)}
                </p>
              </div>
              <StatusBadge status={timesheet.status} />
            </div>
            <button
              type="button"
              onClick={() => onAction(timesheet)}
              className="self-start rounded-md px-1 py-1 text-sm font-medium text-primary-600 active:bg-[#EEF2FF] sm:active:bg-transparent"
            >
              {actionLabel}
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

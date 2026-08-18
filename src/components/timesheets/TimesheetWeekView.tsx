"use client";

import { EntryModal } from "@/components/timesheets/EntryModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  deleteTimesheetEntry,
  getTimesheet,
} from "@/lib/api/timesheets";
import { formatDateRange, formatShortDate } from "@/lib/format";
import { deriveTimesheetStatus } from "@/lib/timesheet-status";
import { useDropdownIdMenu } from "@/hooks/use-dropdown-menu";
import type { TimesheetEntry, TimesheetWithEntries } from "@/types";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface TimesheetWeekViewProps {
  timesheetId: string;
}

function getWeekDates(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function getTooltipPosition(percent: number): {
  left: string;
  transform: string;
  caretClassName: string;
} {
  if (percent >= 95) {
    return {
      left: "100%",
      transform: "translateX(-100%)",
      caretClassName: "right-3 translate-x-0",
    };
  }

  if (percent <= 5) {
    return {
      left: "0%",
      transform: "translateX(0)",
      caretClassName: "left-3 translate-x-0",
    };
  }

  return {
    left: `${percent}%`,
    transform: "translateX(-50%)",
    caretClassName: "left-1/2 -translate-x-1/2",
  };
}

function ProgressBarWithTooltip({
  totalHours,
  targetHours,
}: {
  totalHours: number;
  targetHours: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const progressPercent = Math.min(
    100,
    Math.round((totalHours / targetHours) * 100),
  );
  const tooltipPosition = getTooltipPosition(progressPercent);

  return (
    <div className="w-full sm:max-w-xs">
      <p className="mb-1.5 text-xs font-medium text-[#6B7280] sm:hidden">
        {totalHours}/{targetHours} hrs
      </p>
      <div className="flex items-center gap-3">
        <div
          className="relative flex-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <div
              className="pointer-events-none absolute bottom-full z-20 mb-2 hidden sm:block"
              style={{
                left: tooltipPosition.left,
                transform: tooltipPosition.transform,
              }}
            >
              <div className="relative rounded-md border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm font-medium whitespace-nowrap text-[#1A1A1A] shadow-[0px_1px_2px_rgba(0,0,0,0.08),0px_4px_8px_rgba(0,0,0,0.06)]">
                {totalHours}/{targetHours} hrs
                <span
                  className={`absolute top-full ${tooltipPosition.caretClassName} border-x-[6px] border-t-[6px] border-x-transparent border-t-[#E5E7EB]`}
                  aria-hidden="true"
                />
                <span
                  className={`absolute top-full ${tooltipPosition.caretClassName} -mt-px border-x-[5px] border-t-[5px] border-x-transparent border-t-white`}
                  aria-hidden="true"
                />
              </div>
            </div>
          )}

          <div className="h-2 cursor-pointer overflow-hidden rounded-full bg-[#E5E7EB]">
            <div
              className="h-full rounded-full bg-[#FF9800] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <span className="shrink-0 text-sm font-medium text-[#6B7280]">
          {progressPercent}%
        </span>
      </div>
    </div>
  );
}

export function TimesheetWeekView({ timesheetId }: TimesheetWeekViewProps) {
  const [timesheet, setTimesheet] = useState<TimesheetWithEntries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const {
    activeId: activeMenuId,
    containerRef: menuRef,
    toggle: toggleEntryMenu,
    close: closeEntryMenu,
  } = useDropdownIdMenu();
  const [entryDate, setEntryDate] = useState<string | null>(null);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<TimesheetEntry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    getTimesheet(timesheetId)
      .then((data) => {
        if (active) {
          setTimesheet(data);
        }
      })
      .catch((loadError) => {
        if (active) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : "Unable to load timesheet.";
          setError(message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [timesheetId]);

  const weekDates = useMemo(() => {
    if (!timesheet) {
      return [];
    }
    return getWeekDates(timesheet.startDate, timesheet.endDate);
  }, [timesheet]);

  const entriesByDate = useMemo(() => {
    const grouped: Record<string, TimesheetEntry[]> = {};
    weekDates.forEach((date) => {
      grouped[date] = [];
    });
    timesheet?.entries.forEach((entry) => {
      if (grouped[entry.date]) {
        grouped[entry.date].push(entry);
      }
    });
    return grouped;
  }, [timesheet, weekDates]);

  async function handleConfirmDelete() {
    if (!timesheet || !entryToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTimesheetEntry(timesheet.id, entryToDelete.id);
      applyEntryChange((entries) =>
        entries.filter((entry) => entry.id !== entryToDelete.id),
      );
      setEntryToDelete(null);
      closeEntryMenu();
    } catch {
      setError("Unable to delete entry.");
    } finally {
      setIsDeleting(false);
    }
  }

  function applyEntryChange(
    updater: (entries: TimesheetEntry[]) => TimesheetEntry[],
  ) {
    setTimesheet((current) => {
      if (!current) {
        return current;
      }
      const entries = updater(current.entries);
      const totalHours = entries.reduce(
        (sum, item) => sum + item.totalHours,
        0,
      );
      const status = deriveTimesheetStatus(totalHours, current.targetHours);
      return { ...current, entries, totalHours, status };
    });
  }

  function handleEntrySaved(entry: TimesheetEntry) {
    applyEntryChange((entries) => {
      const exists = entries.some((item) => item.id === entry.id);
      if (exists) {
        return entries.map((item) => (item.id === entry.id ? entry : item));
      }
      return [...entries, entry];
    });
  }

  if (isLoading) {
    return <LoadingState message="Loading timesheet..." />;
  }

  if (error || !timesheet) {
    return <ErrorState message={error || "Timesheet not found."} />;
  }

  return (
    <>
      <div className="mb-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          ← Back to timesheets
        </Link>
      </div>

      <div className="card-shadow overflow-visible rounded-lg border border-[#E5E7EB] bg-white">
        <div className="flex flex-col gap-4 overflow-visible border-b border-[#E5E7EB] px-4 pt-5 pb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pt-6 sm:pb-5">
          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A] sm:text-xl">
              This week&apos;s timesheet
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              {formatDateRange(timesheet.startDate, timesheet.endDate)}
            </p>
          </div>

          <ProgressBarWithTooltip
            totalHours={timesheet.totalHours}
            targetHours={timesheet.targetHours}
          />
        </div>

        <div className="divide-y divide-[#F0F0F0]">
          {weekDates.map((date) => (
            <div key={date} className="grid gap-3 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 md:grid-cols-[80px_1fr]">
              <p className="text-sm font-bold text-black">
                {formatShortDate(date)}
              </p>

              <div className="space-y-3">
                {entriesByDate[date].map((entry) => (
                  <div
                    key={entry.id}
                    className="card-shadow relative flex flex-col gap-3 rounded-md border border-[#E5E7EB] bg-white px-4 py-3 sm:flex-row sm:flex-wrap sm:items-center"
                  >
                    <div className="flex w-full items-start justify-between gap-2 sm:contents">
                      <p className="min-w-0 flex-1 text-sm font-medium text-[#1A1A1A]">
                        {entry.description}
                      </p>
                      <div
                        className="relative shrink-0 sm:order-last"
                        ref={activeMenuId === entry.id ? menuRef : undefined}
                      >
                        <button
                          type="button"
                          onClick={() => toggleEntryMenu(entry.id)}
                          className="px-2 text-[#9CA3AF] hover:text-[#1A1A1A]"
                          aria-label="Entry actions"
                        >
                          ···
                        </button>
                        {activeMenuId === entry.id && (
                          <div className="absolute right-0 z-10 mt-1 w-28 rounded-md border border-[#E5E5E5] bg-white py-1 shadow-lg">
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F5F5F5]"
                              onClick={() => {
                                setEditingEntry(entry);
                                closeEntryMenu();
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              onClick={() => {
                                setEntryToDelete(entry);
                                closeEntryMenu();
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <p className="text-sm text-[#6B7280]">{entry.totalHours} hrs</p>
                      <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-medium text-primary-600">
                        {entry.project}
                      </span>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setEntryDate(date)}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#D1D5DB] px-4 py-3 text-sm font-medium text-[#6B7280] transition hover:border-primary-600 hover:bg-[#EEF2FF] hover:text-primary-600"
                >
                  + Add new task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <EntryModal
        isOpen={!!entryDate}
        date={entryDate ?? ""}
        timesheetId={timesheet.id}
        onClose={() => setEntryDate(null)}
        onSuccess={handleEntrySaved}
      />

      <EntryModal
        isOpen={!!editingEntry}
        date={editingEntry?.date ?? ""}
        entry={editingEntry}
        timesheetId={timesheet.id}
        onClose={() => setEditingEntry(null)}
        onSuccess={handleEntrySaved}
      />

      <ConfirmModal
        isOpen={!!entryToDelete}
        title="Delete entry"
        message="Are you sure you want to delete this task entry? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isConfirming={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setEntryToDelete(null)}
      />
    </>
  );
}

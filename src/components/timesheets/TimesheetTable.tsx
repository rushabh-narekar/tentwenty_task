"use client";

import { TimesheetRow } from "@/components/timesheets/TimesheetRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import {
  dateRangeOptions,
  filterTimesheets,
  getPaginationItems,
} from "@/lib/filter-timesheets";
import type { Timesheet, TimesheetStatus } from "@/types";
import { useMemo, useState, type ReactNode } from "react";

interface TimesheetTableProps {
  timesheets: Timesheet[];
  isLoading: boolean;
  error: string;
  onRetry: () => void;
  onAction: (timesheet: Timesheet) => void;
}

type SortKey = "week" | "date" | "status";

const PAGE_SIZE_OPTIONS = [5, 10];

const filterSelectClassName =
  "select-filter w-full px-3 text-sm text-[#1A1A1A] outline-none sm:w-auto sm:min-w-[140px]";

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction: "asc" | "desc";
}) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      aria-hidden="true"
      className={`ml-1.5 shrink-0 ${active ? "text-[#1A1A1A]" : "text-[#9CA3AF]"}`}
      style={
        active && direction === "desc"
          ? { transform: "rotate(180deg)" }
          : undefined
      }
    >
      <path
        d="M4 1.5V8.5M1.5 6.5L4 9.5L6.5 6.5"
        stroke="currentColor"
        strokeWidth="1.25"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
  className = "",
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  className?: string;
}) {
  return (
    <th className={className}>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center text-xs font-semibold tracking-wide text-[#6B7280] uppercase"
      >
        {label}
        <SortIcon active={active} direction={direction} />
      </button>
    </th>
  );
}

function PaginationCell({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`border-r border-[#E5E7EB] px-3 py-2 text-sm last:border-r-0 ${
        active
          ? "bg-primary-50 font-medium text-primary-600"
          : "bg-[#F9FAFB] text-[#6B7280] hover:bg-[#F3F4F6]"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  );
}

export function TimesheetTable({
  timesheets,
  isLoading,
  error,
  onRetry,
  onAction,
}: TimesheetTableProps) {
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<TimesheetStatus | "all">(
    "all",
  );
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("week");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const selectedRange = dateRangeOptions.find(
    (option) => option.value === dateRangeFilter,
  );

  const filtered = useMemo(() => {
    return filterTimesheets(timesheets, {
      dateRange: selectedRange
        ? {
            startDate: selectedRange.startDate,
            endDate: selectedRange.endDate,
          }
        : undefined,
      status: statusFilter,
    });
  }, [timesheets, selectedRange, statusFilter]);

  const sorted = useMemo(() => {
    const items = [...filtered];
    items.sort((a, b) => {
      let comparison = 0;

      if (sortKey === "week") {
        comparison = a.weekNumber - b.weekNumber;
      } else if (sortKey === "date") {
        comparison = a.startDate.localeCompare(b.startDate);
      } else {
        comparison = a.status.localeCompare(b.status);
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return items;
  }, [filtered, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = sorted.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const paginationItems = getPaginationItems(safePage, totalPages);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
    setCurrentPage(1);
  }

  if (isLoading) {
    return <LoadingState message="Loading timesheets..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (timesheets.length === 0) {
    return (
      <EmptyState
        title="No timesheets yet"
        description="Your weekly timesheets will appear here once created."
      />
    );
  }

  return (
    <div className="card-shadow rounded-lg border border-[#E5E7EB] bg-white p-4 sm:p-6">
      <div>
        <h1 className="text-lg font-bold text-[#1A1A1A] sm:text-xl">
          Your Timesheets
        </h1>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
          <select
            aria-label="Date range filter"
            value={dateRangeFilter}
            onChange={(event) => {
              setDateRangeFilter(event.target.value);
              setCurrentPage(1);
            }}
            className={filterSelectClassName}
          >
            <option value="all">Date Range</option>
            {dateRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Status filter"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as TimesheetStatus | "all");
              setCurrentPage(1);
            }}
            className={filterSelectClassName}
          >
            <option value="all">Status</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
            <option value="missing">Missing</option>
          </select>
        </div>
      </div>

      <div className="card-shadow mt-5 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
        {pageItems.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-[#6B7280]">
            No timesheets match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="hidden border-b border-[#E5E7EB] bg-[#F9FAFB] md:table-header-group">
                <tr>
                  <SortableHeader
                    label="Week #"
                    active={sortKey === "week"}
                    direction={sortDirection}
                    onClick={() => handleSort("week")}
                    className="w-[152px] px-6 py-[13px] text-left"
                  />
                  <SortableHeader
                    label="Date"
                    active={sortKey === "date"}
                    direction={sortDirection}
                    onClick={() => handleSort("date")}
                    className="px-6 py-[13px] text-left"
                  />
                  <SortableHeader
                    label="Status"
                    active={sortKey === "status"}
                    direction={sortDirection}
                    onClick={() => handleSort("status")}
                    className="px-6 py-[13px] text-left"
                  />
                  <th className="px-6 py-[13px] text-left text-xs font-semibold tracking-wide text-[#6B7280] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {pageItems.map((timesheet) => (
                  <TimesheetRow
                    key={timesheet.id}
                    timesheet={timesheet}
                    onAction={onAction}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          aria-label="Rows per page"
          value={pageSize}
          onChange={(event) => {
            setPageSize(Number(event.target.value));
            setCurrentPage(1);
          }}
          className="select-field-muted w-full px-3 text-sm text-[#1A1A1A] outline-none sm:w-auto sm:min-w-[120px]"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>

        <div className="w-full overflow-x-auto sm:w-auto">
          <div className="inline-flex min-w-max overflow-hidden rounded-lg border border-[#E5E7EB]">
          <PaginationCell
            disabled={safePage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
          >
            Previous
          </PaginationCell>
          {paginationItems.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="border-r border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#6B7280] last:border-r-0"
              >
                ...
              </span>
            ) : (
              <PaginationCell
                key={item}
                active={item === safePage}
                onClick={() => setCurrentPage(item)}
              >
                {item}
              </PaginationCell>
            ),
          )}
          <PaginationCell
            disabled={safePage === totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
          >
            Next
          </PaginationCell>
          </div>
        </div>
      </div>
    </div>
  );
}

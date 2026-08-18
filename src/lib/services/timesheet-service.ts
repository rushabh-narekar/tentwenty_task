import {
  initialTimesheetEntries,
  initialTimesheetSeeds,
} from "@/lib/mock-data/timesheets";
import { deriveTimesheetStatus } from "@/lib/timesheet-status";
import { getEntryValidationError } from "@/lib/validation/entry";
import { getTimesheetValidationError } from "@/lib/validation/timesheet";
import type {
  Timesheet,
  TimesheetEntry,
  TimesheetEntryFormValues,
  TimesheetFormValues,
  TimesheetWithEntries,
} from "@/types";

let entries: TimesheetEntry[] = [...initialTimesheetEntries];
let timesheets: Timesheet[] = initialTimesheetSeeds.map(buildTimesheetFromSeed);

function sumEntryHours(timesheetId: string): number {
  return entries
    .filter((entry) => entry.timesheetId === timesheetId)
    .reduce((sum, entry) => sum + entry.totalHours, 0);
}

function buildTimesheetFromSeed(seed: (typeof initialTimesheetSeeds)[number]): Timesheet {
  const totalHours = sumEntryHours(seed.id);
  return {
    ...seed,
    totalHours,
    status: deriveTimesheetStatus(totalHours, seed.targetHours),
  };
}

function applyDerivedStatus(timesheet: Timesheet): Timesheet {
  const totalHours = sumEntryHours(timesheet.id);
  return {
    ...timesheet,
    totalHours,
    status: deriveTimesheetStatus(totalHours, timesheet.targetHours),
  };
}

function refreshTimesheetHours(timesheetId: string): void {
  timesheets = timesheets.map((item) =>
    item.id === timesheetId ? applyDerivedStatus(item) : item,
  );
}

function attachEntries(timesheet: Timesheet): TimesheetWithEntries {
  return {
    ...timesheet,
    entries: entries
      .filter((entry) => entry.timesheetId === timesheet.id)
      .sort((a, b) => a.date.localeCompare(b.date)),
  };
}

export function getAllTimesheets(): Timesheet[] {
  return timesheets.map(applyDerivedStatus).sort((a, b) => a.weekNumber - b.weekNumber);
}

export function getTimesheetById(id: string): TimesheetWithEntries | null {
  const timesheet = timesheets.find((item) => item.id === id);
  if (!timesheet) {
    return null;
  }
  return attachEntries(applyDerivedStatus(timesheet));
}

export function createTimesheet(data: TimesheetFormValues): Timesheet {
  const id = `ts-${Date.now()}`;
  const newTimesheet = buildTimesheetFromSeed({ id, ...data });
  timesheets = [...timesheets, newTimesheet];
  return newTimesheet;
}

export function updateTimesheet(
  id: string,
  data: TimesheetFormValues,
): Timesheet | null {
  const index = timesheets.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  const updated = applyDerivedStatus({
    ...timesheets[index],
    weekNumber: data.weekNumber,
    startDate: data.startDate,
    endDate: data.endDate,
    targetHours: data.targetHours,
  });
  timesheets[index] = updated;
  return updated;
}

export function deleteTimesheet(id: string): boolean {
  const exists = timesheets.some((item) => item.id === id);
  if (!exists) {
    return false;
  }

  timesheets = timesheets.filter((item) => item.id !== id);
  entries = entries.filter((entry) => entry.timesheetId !== id);
  return true;
}

export function createEntry(
  timesheetId: string,
  data: TimesheetEntryFormValues,
): TimesheetEntry | null {
  const timesheet = timesheets.find((item) => item.id === timesheetId);
  if (!timesheet) {
    return null;
  }

  const entry: TimesheetEntry = {
    id: `entry-${Date.now()}`,
    timesheetId,
    ...data,
  };

  entries = [...entries, entry];
  refreshTimesheetHours(timesheetId);

  return entry;
}

export function updateEntry(
  timesheetId: string,
  entryId: string,
  data: TimesheetEntryFormValues,
): TimesheetEntry | null {
  const index = entries.findIndex(
    (entry) => entry.id === entryId && entry.timesheetId === timesheetId,
  );

  if (index === -1) {
    return null;
  }

  const updated: TimesheetEntry = {
    ...entries[index],
    ...data,
  };

  entries = entries.map((entry) => (entry.id === entryId ? updated : entry));
  refreshTimesheetHours(timesheetId);

  return updated;
}

export function deleteEntry(timesheetId: string, entryId: string): boolean {
  const exists = entries.some(
    (entry) => entry.id === entryId && entry.timesheetId === timesheetId,
  );

  if (!exists) {
    return false;
  }

  entries = entries.filter((entry) => entry.id !== entryId);
  refreshTimesheetHours(timesheetId);
  return true;
}

export function validateTimesheetPayload(
  payload: Partial<TimesheetFormValues>,
): string | null {
  return getTimesheetValidationError(payload);
}

export function validateEntryPayload(
  payload: Partial<TimesheetEntryFormValues>,
): string | null {
  return getEntryValidationError(payload);
}

import type { TimesheetEntry, TimesheetEntryFormValues } from "@/types";

export type EntryFormErrors = Partial<
  Record<keyof TimesheetEntryFormValues, string>
>;

function collectEntryErrors(
  values: Partial<TimesheetEntryFormValues>,
): EntryFormErrors {
  const errors: EntryFormErrors = {};

  if (!values.project?.trim()) {
    errors.project = "Project is required";
  }

  if (!values.typeOfWork?.trim()) {
    errors.typeOfWork = "Type of work is required";
  }

  if (!values.description?.trim()) {
    errors.description = "Task description is required";
  }

  if (!values.date) {
    errors.date = "Date is required";
  }

  if (
    values.totalHours === undefined ||
    values.totalHours <= 0 ||
    values.totalHours > 24
  ) {
    errors.totalHours = "Hours must be between 1 and 24";
  }

  return errors;
}

export function validateEntryForm(
  values: TimesheetEntryFormValues,
): EntryFormErrors {
  return collectEntryErrors(values);
}

export function isEntryFormValid(
  values: Partial<TimesheetEntryFormValues>,
): boolean {
  return Object.keys(collectEntryErrors(values)).length === 0;
}

export function getEntryValidationError(
  payload: Partial<TimesheetEntryFormValues>,
): string | null {
  const errors = collectEntryErrors(payload);
  return Object.values(errors)[0] ?? null;
}

export function getDefaultEntryValues(date: string): TimesheetEntryFormValues {
  return {
    project: "",
    typeOfWork: "Bug fixes",
    description: "",
    totalHours: 1,
    date,
  };
}

export function getEntryValuesFromEntry(
  entry: TimesheetEntry,
): TimesheetEntryFormValues {
  return {
    project: entry.project,
    typeOfWork: entry.typeOfWork,
    description: entry.description,
    totalHours: entry.totalHours,
    date: entry.date,
  };
}

export const projectOptions = [
  "Project Name",
  "Client Portal",
  "Marketing Site",
  "Internal Tools",
];

export const workTypeOptions = [
  "Development",
  "Bug fixes",
  "Code review",
  "Design",
  "Meeting",
];

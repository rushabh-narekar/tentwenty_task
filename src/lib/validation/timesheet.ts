import type { TimesheetFormValues } from "@/types";

export type TimesheetFormErrors = Partial<
  Record<keyof TimesheetFormValues, string>
>;

function collectTimesheetErrors(
  values: Partial<TimesheetFormValues>,
): TimesheetFormErrors {
  const errors: TimesheetFormErrors = {};

  if (!values.weekNumber || values.weekNumber < 1 || values.weekNumber > 53) {
    errors.weekNumber = "Week number must be between 1 and 53";
  }

  if (!values.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!values.endDate) {
    errors.endDate = "End date is required";
  }

  if (
    values.startDate &&
    values.endDate &&
    new Date(values.startDate) > new Date(values.endDate)
  ) {
    errors.endDate = "End date must be after start date";
  }

  if (
    values.targetHours === undefined ||
    values.targetHours < 1 ||
    values.targetHours > 168
  ) {
    errors.targetHours = "Target hours must be between 1 and 168";
  }

  return errors;
}

export function validateTimesheetForm(
  values: TimesheetFormValues,
): TimesheetFormErrors {
  return collectTimesheetErrors(values);
}

export function getTimesheetValidationError(
  payload: Partial<TimesheetFormValues>,
): string | null {
  const errors = collectTimesheetErrors(payload);
  return Object.values(errors)[0] ?? null;
}

export function getDefaultTimesheetValues(): TimesheetFormValues {
  return {
    weekNumber: 1,
    startDate: "",
    endDate: "",
    targetHours: 40,
  };
}

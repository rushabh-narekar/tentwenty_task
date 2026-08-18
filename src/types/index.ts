export type TimesheetStatus = "completed" | "incomplete" | "missing";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface TimesheetEntry {
  id: string;
  timesheetId: string;
  date: string;
  project: string;
  typeOfWork: string;
  description: string;
  totalHours: number;
}

export interface Timesheet {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  totalHours: number;
  targetHours: number;
}

export interface TimesheetWithEntries extends Timesheet {
  entries: TimesheetEntry[];
}

export interface TimesheetFormValues {
  weekNumber: number;
  startDate: string;
  endDate: string;
  targetHours: number;
}

export interface TimesheetEntryFormValues {
  project: string;
  typeOfWork: string;
  description: string;
  totalHours: number;
  date: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
}

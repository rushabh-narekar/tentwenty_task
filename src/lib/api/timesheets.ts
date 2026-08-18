import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  Timesheet,
  TimesheetEntry,
  TimesheetEntryFormValues,
  TimesheetFormValues,
  TimesheetWithEntries,
} from "@/types";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse;

  if (!response.ok) {
    const message =
      "error" in payload ? payload.error : "Something went wrong";
    throw new Error(message);
  }

  return (payload as ApiSuccessResponse<T>).data;
}

export async function getTimesheets(): Promise<Timesheet[]> {
  const response = await fetch("/api/timesheets");
  return parseResponse<Timesheet[]>(response);
}

export async function getTimesheet(id: string): Promise<TimesheetWithEntries> {
  const response = await fetch(`/api/timesheets/${id}`);
  return parseResponse<TimesheetWithEntries>(response);
}

export async function updateTimesheet(
  id: string,
  data: TimesheetFormValues,
): Promise<Timesheet> {
  const response = await fetch(`/api/timesheets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<Timesheet>(response);
}

export async function createTimesheetEntry(
  timesheetId: string,
  data: TimesheetEntryFormValues,
): Promise<TimesheetEntry> {
  const response = await fetch(`/api/timesheets/${timesheetId}/entries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseResponse<TimesheetEntry>(response);
}

export async function updateTimesheetEntry(
  timesheetId: string,
  entryId: string,
  data: TimesheetEntryFormValues,
): Promise<TimesheetEntry> {
  const response = await fetch(
    `/api/timesheets/${timesheetId}/entries/${entryId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    },
  );
  return parseResponse<TimesheetEntry>(response);
}

export async function deleteTimesheetEntry(
  timesheetId: string,
  entryId: string,
): Promise<{ id: string }> {
  const response = await fetch(
    `/api/timesheets/${timesheetId}/entries/${entryId}`,
    { method: "DELETE" },
  );
  return parseResponse<{ id: string }>(response);
}

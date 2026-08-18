import { requireAuth } from "@/lib/auth/require-auth";
import {
  createTimesheet,
  getAllTimesheets,
  validateTimesheetPayload,
} from "@/lib/services/timesheet-service";
import type { TimesheetFormValues } from "@/types";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = getAllTimesheets();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Unable to load timesheets" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<TimesheetFormValues>;
    const validationError = validateTimesheetPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const data = createTimesheet(body as TimesheetFormValues);
    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create timesheet" },
      { status: 500 },
    );
  }
}

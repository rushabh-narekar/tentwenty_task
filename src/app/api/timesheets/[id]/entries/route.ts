import { requireAuth } from "@/lib/auth/require-auth";
import {
  createEntry,
  validateEntryPayload,
} from "@/lib/services/timesheet-service";
import type { TimesheetEntryFormValues } from "@/types";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as Partial<TimesheetEntryFormValues>;
    const validationError = validateEntryPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const data = createEntry(id, body as TimesheetEntryFormValues);

    if (!data) {
      return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create entry" },
      { status: 500 },
    );
  }
}

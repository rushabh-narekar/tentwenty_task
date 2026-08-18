import { requireAuth } from "@/lib/auth/require-auth";
import {
  deleteEntry,
  updateEntry,
  validateEntryPayload,
} from "@/lib/services/timesheet-service";
import type { TimesheetEntryFormValues } from "@/types";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string; entryId: string }>;
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, entryId } = await context.params;
    const body = (await request.json()) as Partial<TimesheetEntryFormValues>;
    const validationError = validateEntryPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const data = updateEntry(id, entryId, body as TimesheetEntryFormValues);

    if (!data) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Unable to update entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, entryId } = await context.params;
    const deleted = deleteEntry(id, entryId);

    if (!deleted) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { id: entryId } });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete entry" },
      { status: 500 },
    );
  }
}

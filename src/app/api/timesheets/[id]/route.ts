import { requireAuth } from "@/lib/auth/require-auth";
import {
  deleteTimesheet,
  getTimesheetById,
  updateTimesheet,
  validateTimesheetPayload,
} from "@/lib/services/timesheet-service";
import type { TimesheetFormValues } from "@/types";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const data = getTimesheetById(id);

    if (!data) {
      return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Unable to load timesheet" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as Partial<TimesheetFormValues>;
    const validationError = validateTimesheetPayload(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const data = updateTimesheet(id, body as TimesheetFormValues);

    if (!data) {
      return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
    }

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json(
      { error: "Unable to update timesheet" },
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

    const { id } = await context.params;
    const deleted = deleteTimesheet(id);

    if (!deleted) {
      return NextResponse.json({ error: "Timesheet not found" }, { status: 404 });
    }

    return NextResponse.json({ data: { id } });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete timesheet" },
      { status: 500 },
    );
  }
}

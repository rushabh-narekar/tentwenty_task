"use client";

import { Modal } from "@/components/ui/Modal";
import { updateTimesheet } from "@/lib/api/timesheets";
import {
  getDefaultTimesheetValues,
  validateTimesheetForm,
} from "@/lib/validation/timesheet";
import type { Timesheet, TimesheetFormValues } from "@/types";
import { useState, type FormEvent } from "react";

interface TimesheetModalProps {
  isOpen: boolean;
  timesheet?: Timesheet | null;
  onClose: () => void;
  onSuccess: (timesheet: Timesheet) => void;
}

function getInitialValues(timesheet?: Timesheet | null): TimesheetFormValues {
  if (timesheet) {
    return {
      weekNumber: timesheet.weekNumber,
      startDate: timesheet.startDate,
      endDate: timesheet.endDate,
      targetHours: timesheet.targetHours,
    };
  }

  return getDefaultTimesheetValues();
}

function TimesheetForm({
  timesheet,
  onClose,
  onSuccess,
}: Omit<TimesheetModalProps, "isOpen">) {
  const isCreate = timesheet?.status === "missing";
  const [values, setValues] = useState<TimesheetFormValues>(() =>
    getInitialValues(timesheet),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateTimesheetForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors as Record<string, string>);
      return;
    }

    if (!timesheet) {
      return;
    }

    setFieldErrors({});
    setFormError("");
    setIsSubmitting(true);

    try {
      const saved = await updateTimesheet(timesheet.id, values);
      onSuccess(saved);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save timesheet. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
      <div className="flex max-h-[min(55dvh,28rem)] flex-col gap-4 overflow-y-auto pr-1 sm:max-h-[min(50vh,28rem)]">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="weekNumber" className="mb-1.5 block text-sm font-medium">
            Week #
          </label>
          <input
            id="weekNumber"
            type="number"
            min={1}
            max={53}
            value={values.weekNumber}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                weekNumber: Number(event.target.value),
              }))
            }
            className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm outline-none focus:border-primary-600"
          />
          {fieldErrors.weekNumber && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.weekNumber}</p>
          )}
        </div>
        <div>
          <label htmlFor="targetHours" className="mb-1.5 block text-sm font-medium">
            Target Hours
          </label>
          <input
            id="targetHours"
            type="number"
            min={1}
            max={168}
            value={values.targetHours}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                targetHours: Number(event.target.value),
              }))
            }
            className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm outline-none focus:border-primary-600"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="startDate" className="mb-1.5 block text-sm font-medium">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={values.startDate}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
            className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm outline-none focus:border-primary-600"
          />
          {fieldErrors.startDate && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.startDate}</p>
          )}
        </div>
        <div>
          <label htmlFor="endDate" className="mb-1.5 block text-sm font-medium">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={values.endDate}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
            className="w-full rounded-md border border-[#D1D5DB] px-3 py-2 text-sm outline-none focus:border-primary-600"
          />
          {fieldErrors.endDate && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.endDate}</p>
          )}
        </div>
      </div>

      {formError && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {formError}
        </p>
      )}
      </div>

      <div className="mt-4 flex shrink-0 flex-col-reverse gap-3 border-t border-[#E5E5E5] pt-4 sm:flex-row">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : isCreate
              ? "Create timesheet"
              : "Save changes"}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 rounded-md border border-[#D1D5DB] px-4 py-2.5 text-sm font-medium hover:bg-[#F5F5F5]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function TimesheetModal({
  isOpen,
  timesheet,
  onClose,
  onSuccess,
}: TimesheetModalProps) {
  const isCreate = timesheet?.status === "missing";

  return (
    <Modal
      isOpen={isOpen}
      title={isCreate ? "Create Timesheet" : "Edit Timesheet"}
      onClose={onClose}
    >
      {isOpen && timesheet && (
        <TimesheetForm
          key={timesheet.id}
          timesheet={timesheet}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}

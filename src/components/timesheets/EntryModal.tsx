"use client";

import { Modal } from "@/components/ui/Modal";
import {
  createTimesheetEntry,
  updateTimesheetEntry,
} from "@/lib/api/timesheets";
import {
  getDefaultEntryValues,
  getEntryValuesFromEntry,
  isEntryFormValid,
  projectOptions,
  validateEntryForm,
  workTypeOptions,
} from "@/lib/validation/entry";
import type { TimesheetEntry, TimesheetEntryFormValues } from "@/types";
import { useState, type FormEvent } from "react";

interface EntryModalProps {
  isOpen: boolean;
  date: string;
  entry?: TimesheetEntry | null;
  onClose: () => void;
  onSuccess: (entry: TimesheetEntry) => void;
  timesheetId: string;
}

function InfoIcon() {
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E5E7EB] text-[10px] text-[#6B7280]"
      aria-hidden="true"
    >
      i
    </span>
  );
}

function TimesheetEntryForm({
  date,
  entry,
  timesheetId,
  onClose,
  onSuccess,
}: Omit<EntryModalProps, "isOpen">) {
  const isEditing = !!entry;
  const [values, setValues] = useState<TimesheetEntryFormValues>(() =>
    entry ? getEntryValuesFromEntry(entry) : getDefaultEntryValues(date),
  );
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canSubmit = isEntryFormValid(values);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateEntryForm(values);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors as Record<string, string>);
      return;
    }

    setFieldErrors({});
    setFormError("");
    setIsSubmitting(true);

    try {
      const saved = isEditing
        ? await updateTimesheetEntry(timesheetId, entry.id, values)
        : await createTimesheetEntry(timesheetId, values);
      onSuccess(saved);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isEditing
            ? "Unable to update entry. Please try again."
            : "Unable to add entry. Please try again.";
      setFormError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" noValidate>
      <div className="flex max-h-[min(55dvh,28rem)] flex-col gap-5 overflow-y-auto pr-1 sm:max-h-[min(50vh,28rem)]">
        <div>
        <label htmlFor="project" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
          Select Project <span className="text-red-500">*</span> <InfoIcon />
        </label>
        <select
          id="project"
          value={values.project}
          onChange={(event) =>
            setValues((current) => ({ ...current, project: event.target.value }))
          }
          className="w-full rounded-md border border-[#D1D5DB] px-3 py-2.5 text-sm outline-none focus:border-primary-600"
        >
          <option value="">Project Name</option>
          {projectOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldErrors.project && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.project}</p>
        )}
      </div>

      <div>
        <label htmlFor="typeOfWork" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold">
          Type of Work <span className="text-red-500">*</span> <InfoIcon />
        </label>
        <select
          id="typeOfWork"
          value={values.typeOfWork}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              typeOfWork: event.target.value,
            }))
          }
          className="w-full rounded-md border border-[#D1D5DB] px-3 py-2.5 text-sm outline-none focus:border-primary-600"
        >
          {workTypeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {fieldErrors.typeOfWork && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.typeOfWork}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="mb-1.5 block text-sm font-semibold">
          Task description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          rows={4}
          value={values.description}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          placeholder="Write text here ..."
          className="w-full rounded-md border border-[#D1D5DB] px-3 py-2.5 text-sm outline-none focus:border-primary-600"
        />
        <p className="mt-1 text-xs text-[#9CA3AF]">A note for extra Info</p>
        {fieldErrors.description && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="hours" className="mb-1.5 block text-sm font-semibold">
          Hours <span className="text-red-500">*</span>
        </label>
        <div className="flex w-36 overflow-hidden rounded-md border border-[#D1D5DB]">
          <button
            type="button"
            onClick={() =>
              setValues((current) => ({
                ...current,
                totalHours: Math.max(1, current.totalHours - 1),
              }))
            }
            className="flex w-10 items-center justify-center bg-[#F9FAFB] text-lg text-[#6B7280]"
          >
            −
          </button>
          <input
            id="hours"
            type="number"
            min={1}
            max={24}
            value={values.totalHours}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                totalHours: Number(event.target.value),
              }))
            }
            className="w-full border-x border-[#D1D5DB] px-2 py-2 text-center text-sm outline-none"
          />
          <button
            type="button"
            onClick={() =>
              setValues((current) => ({
                ...current,
                totalHours: Math.min(24, current.totalHours + 1),
              }))
            }
            className="flex w-10 items-center justify-center bg-[#F9FAFB] text-lg text-[#6B7280]"
          >
            +
          </button>
        </div>
        {fieldErrors.totalHours && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.totalHours}</p>
        )}
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
          disabled={isSubmitting || !canSubmit}
          className="flex-1 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
              ? "Save changes"
              : "Add entry"}
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

export function EntryModal({
  isOpen,
  date,
  entry,
  timesheetId,
  onClose,
  onSuccess,
}: EntryModalProps) {
  const isEditing = !!entry;

  return (
    <Modal
      isOpen={isOpen}
      title={isEditing ? "Edit Entry" : "Add New Entry"}
      onClose={onClose}
    >
      {isOpen && (
        <TimesheetEntryForm
          key={entry?.id ?? date}
          date={date}
          entry={entry}
          timesheetId={timesheetId}
          onClose={onClose}
          onSuccess={onSuccess}
        />
      )}
    </Modal>
  );
}

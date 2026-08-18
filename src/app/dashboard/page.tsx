"use client";

import { TimesheetModal } from "@/components/timesheets/TimesheetModal";
import { TimesheetTable } from "@/components/timesheets/TimesheetTable";
import { getTimesheets } from "@/lib/api/timesheets";
import type { Timesheet } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    getTimesheets()
      .then((data) => {
        if (active) {
          setTimesheets(data);
        }
      })
      .catch((fetchError) => {
        if (active) {
          const message =
            fetchError instanceof Error
              ? fetchError.message
              : "Unable to load timesheets.";
          setError(message);
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  async function fetchTimesheets() {
    setIsLoading(true);
    setError("");

    try {
      const data = await getTimesheets();
      setTimesheets(data);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Unable to load timesheets.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAction(timesheet: Timesheet) {
    if (timesheet.status === "missing") {
      setSelectedTimesheet(timesheet);
      setIsModalOpen(true);
      return;
    }

    router.push(`/dashboard/timesheets/${timesheet.id}`);
  }

  function handleModalSuccess(saved: Timesheet) {
    setTimesheets((current) =>
      current.map((item) => (item.id === saved.id ? saved : item)),
    );
    router.push(`/dashboard/timesheets/${saved.id}`);
  }

  return (
    <>
      <TimesheetTable
        timesheets={timesheets}
        isLoading={isLoading}
        error={error}
        onRetry={fetchTimesheets}
        onAction={handleAction}
      />

      <TimesheetModal
        isOpen={isModalOpen}
        timesheet={selectedTimesheet}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </>
  );
}

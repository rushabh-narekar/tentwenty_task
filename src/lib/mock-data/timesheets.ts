import type { TimesheetEntry } from "@/types";

export type TimesheetSeed = {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  targetHours: number;
};

export const initialTimesheetSeeds: TimesheetSeed[] = [
  { id: "ts-1", weekNumber: 1, startDate: "2024-01-01", endDate: "2024-01-05", targetHours: 40 },
  { id: "ts-2", weekNumber: 2, startDate: "2024-01-08", endDate: "2024-01-12", targetHours: 40 },
  { id: "ts-3", weekNumber: 3, startDate: "2024-01-15", endDate: "2024-01-19", targetHours: 40 },
  { id: "ts-4", weekNumber: 4, startDate: "2024-01-22", endDate: "2024-01-26", targetHours: 40 },
  { id: "ts-5", weekNumber: 5, startDate: "2024-01-28", endDate: "2024-02-01", targetHours: 40 },
  { id: "ts-6", weekNumber: 6, startDate: "2024-02-05", endDate: "2024-02-09", targetHours: 40 },
  { id: "ts-7", weekNumber: 7, startDate: "2024-02-12", endDate: "2024-02-16", targetHours: 40 },
  { id: "ts-8", weekNumber: 8, startDate: "2024-02-19", endDate: "2024-02-23", targetHours: 40 },
  { id: "ts-9", weekNumber: 9, startDate: "2024-02-26", endDate: "2024-03-01", targetHours: 40 },
  { id: "ts-10", weekNumber: 10, startDate: "2024-03-04", endDate: "2024-03-08", targetHours: 40 },
  { id: "ts-11", weekNumber: 11, startDate: "2024-03-11", endDate: "2024-03-15", targetHours: 40 },
  { id: "ts-12", weekNumber: 12, startDate: "2024-03-18", endDate: "2024-03-22", targetHours: 40 },
  { id: "ts-13", weekNumber: 13, startDate: "2024-03-25", endDate: "2024-03-29", targetHours: 40 },
  { id: "ts-14", weekNumber: 14, startDate: "2024-04-01", endDate: "2024-04-05", targetHours: 40 },
  { id: "ts-15", weekNumber: 15, startDate: "2024-04-08", endDate: "2024-04-12", targetHours: 40 },
  { id: "ts-16", weekNumber: 16, startDate: "2024-04-15", endDate: "2024-04-19", targetHours: 40 },
  { id: "ts-17", weekNumber: 17, startDate: "2024-04-22", endDate: "2024-04-26", targetHours: 40 },
  { id: "ts-18", weekNumber: 18, startDate: "2024-04-29", endDate: "2024-05-03", targetHours: 40 },
];

function getWeekDates(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function buildDailyEntries(
  timesheetId: string,
  startDate: string,
  endDate: string,
  hoursPerDay: number,
  idPrefix: string,
): TimesheetEntry[] {
  return getWeekDates(startDate, endDate).map((date, index) => ({
    id: `${idPrefix}-${index + 1}`,
    timesheetId,
    date,
    project: "Project Name",
    typeOfWork: "Development",
    description: "Development work",
    totalHours: hoursPerDay,
  }));
}

export const initialTimesheetEntries: TimesheetEntry[] = [
  ...buildDailyEntries("ts-1", "2024-01-01", "2024-01-05", 8, "entry-ts-1"),
  ...buildDailyEntries("ts-2", "2024-01-08", "2024-01-12", 8, "entry-ts-2"),
  {
    id: "entry-1",
    timesheetId: "ts-3",
    date: "2024-01-15",
    project: "Project Name",
    typeOfWork: "Development",
    description: "Homepage Development",
    totalHours: 4,
  },
  {
    id: "entry-2",
    timesheetId: "ts-3",
    date: "2024-01-16",
    project: "Project Name",
    typeOfWork: "Development",
    description: "Homepage Development",
    totalHours: 4,
  },
  {
    id: "entry-3",
    timesheetId: "ts-3",
    date: "2024-01-17",
    project: "Project Name",
    typeOfWork: "Development",
    description: "Homepage Development",
    totalHours: 4,
  },
  {
    id: "entry-4",
    timesheetId: "ts-3",
    date: "2024-01-18",
    project: "Project Name",
    typeOfWork: "Development",
    description: "Homepage Development",
    totalHours: 4,
  },
  {
    id: "entry-5",
    timesheetId: "ts-3",
    date: "2024-01-19",
    project: "Project Name",
    typeOfWork: "Development",
    description: "Homepage Development",
    totalHours: 4,
  },
  ...buildDailyEntries("ts-4", "2024-01-22", "2024-01-26", 8, "entry-ts-4"),
  ...buildDailyEntries("ts-6", "2024-02-05", "2024-02-09", 8, "entry-ts-6"),
  {
    id: "entry-6",
    timesheetId: "ts-7",
    date: "2024-02-12",
    project: "Client Portal",
    typeOfWork: "Bug fixes",
    description: "Fixed login redirect issue",
    totalHours: 6,
  },
  {
    id: "entry-7",
    timesheetId: "ts-7",
    date: "2024-02-13",
    project: "Client Portal",
    typeOfWork: "Development",
    description: "Dashboard widget updates",
    totalHours: 8,
  },
  {
    id: "entry-8",
    timesheetId: "ts-7",
    date: "2024-02-14",
    project: "Marketing Site",
    typeOfWork: "Design",
    description: "Landing page revisions",
    totalHours: 5,
  },
  {
    id: "entry-9",
    timesheetId: "ts-7",
    date: "2024-02-15",
    project: "Internal Tools",
    typeOfWork: "Meeting",
    description: "Sprint planning and review",
    totalHours: 5,
  },
  ...buildDailyEntries("ts-9", "2024-02-26", "2024-03-01", 8, "entry-ts-9"),
  {
    id: "entry-10",
    timesheetId: "ts-10",
    date: "2024-03-04",
    project: "Project Name",
    typeOfWork: "Development",
    description: "API integration work",
    totalHours: 8,
  },
  {
    id: "entry-11",
    timesheetId: "ts-10",
    date: "2024-03-05",
    project: "Project Name",
    typeOfWork: "Development",
    description: "Form validation updates",
    totalHours: 8,
  },
  {
    id: "entry-12",
    timesheetId: "ts-10",
    date: "2024-03-06",
    project: "Project Name",
    typeOfWork: "Code review",
    description: "Reviewed pull requests",
    totalHours: 8,
  },
  {
    id: "entry-13",
    timesheetId: "ts-10",
    date: "2024-03-07",
    project: "Project Name",
    typeOfWork: "Development",
    description: "Responsive layout fixes",
    totalHours: 8,
  },
  ...buildDailyEntries("ts-11", "2024-03-11", "2024-03-15", 8, "entry-ts-11"),
  {
    id: "entry-14",
    timesheetId: "ts-13",
    date: "2024-03-25",
    project: "Mobile App",
    typeOfWork: "Development",
    description: "Navigation refactor",
    totalHours: 8,
  },
  {
    id: "entry-15",
    timesheetId: "ts-13",
    date: "2024-03-26",
    project: "Mobile App",
    typeOfWork: "Bug fixes",
    description: "Crash fix on Android",
    totalHours: 8,
  },
  ...buildDailyEntries("ts-14", "2024-04-01", "2024-04-05", 8, "entry-ts-14"),
  {
    id: "entry-16",
    timesheetId: "ts-15",
    date: "2024-04-08",
    project: "Design System",
    typeOfWork: "Development",
    description: "Button component updates",
    totalHours: 7,
  },
  {
    id: "entry-17",
    timesheetId: "ts-15",
    date: "2024-04-09",
    project: "Design System",
    typeOfWork: "Development",
    description: "Modal component polish",
    totalHours: 7,
  },
  {
    id: "entry-18",
    timesheetId: "ts-15",
    date: "2024-04-10",
    project: "Design System",
    typeOfWork: "Development",
    description: "Table styling updates",
    totalHours: 7,
  },
  {
    id: "entry-19",
    timesheetId: "ts-15",
    date: "2024-04-11",
    project: "Design System",
    typeOfWork: "Meeting",
    description: "Design sync",
    totalHours: 7,
  },
  ...buildDailyEntries("ts-17", "2024-04-22", "2024-04-26", 8, "entry-ts-17"),
  {
    id: "entry-20",
    timesheetId: "ts-18",
    date: "2024-04-29",
    project: "Client Portal",
    typeOfWork: "Development",
    description: "Auth flow improvements",
    totalHours: 6,
  },
  {
    id: "entry-21",
    timesheetId: "ts-18",
    date: "2024-04-30",
    project: "Client Portal",
    typeOfWork: "Development",
    description: "Session handling updates",
    totalHours: 6,
  },
];

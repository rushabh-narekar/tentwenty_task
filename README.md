# ticktock — Timesheet App

Small timesheet app for the Tentwenty frontend assessment. Log in, see your weeks on a dashboard, open a week, and add/edit/delete task entries.

Figma: https://www.figma.com/design/WiVYDkslcyYux1T7lOZUsR/TenTwenty-Frontend-Exam-2025---Technical-Dashboard

## Getting started

You need Node 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Go to http://localhost:3000

In `.env.local`, set `AUTH_SECRET` to any random string (`openssl rand -base64 32` works). Keep `AUTH_URL` as `http://localhost:3000` for local dev.

**Login with:**
- Email: `demo@tentwenty.com`
- Password: `password123`

Other useful commands:

```bash
npm run build
npm run test
npm run lint
```

## What I used

- Next.js 16 (App Router)
- TypeScript
- React 19
- Tailwind CSS 4
- NextAuth v5 for login (credentials + JWT session)
- Vitest + React Testing Library for tests

No component library — UI is built to match the Figma file.

## What the app does

**Login** — email/password form with validation. On success you go to the dashboard. Session is handled by NextAuth.

**Dashboard** — table with Week #, Date, Status, and Actions. Filters for date range and status. Pagination at the bottom. On mobile the table becomes cards. Missing weeks have a "Create" button that opens a modal.

**Week page** — shows each day in the week. You can add a task (modal), edit one (three-dot menu), or delete one (with a confirm popup). Progress bar shows hours logged vs the 40hr target.

**API** — the browser never talks to mock data directly. Components call `/api/timesheets/*` routes, which run the service layer and return JSON. All routes need a logged-in session.

## How the code is organised

```
src/app/           pages and API routes
src/components/    UI pieces (login, table, modals, header)
src/lib/api/       fetch helpers used by components
src/lib/services/  business logic
src/lib/mock-data/ fake users and timesheet data (in memory)
src/lib/validation/ form validation
tests/             unit and component tests
```

Data path: `UI → lib/api → API route → service → mock data`

Restart the dev server and any changes you made to entries are gone — data is in memory, not a database.

## Notes / assumptions

**Status** is calculated from hours, not typed in manually:
- 0 hours = Missing
- 1–39 hours = Incomplete
- 40+ hours = Completed

**Create vs edit:** The dashboard modal is only for setting up a missing week. Adding and editing actual task entries happens on the week detail page.

**Filters** run on the client after fetching all weeks. Fine for mock data; would move to the server with a real DB.

**Login page** loads client-side only (`dynamic` with `ssr: false`) because browser extensions were causing hydration warnings on the login form.

**Not included:** database, hashed passwords, emails, toasts, multi-user support. Mock auth is enough for this task.

## Tests

```bash
npm test
```

Covers login form, timesheet modal, table, filters, and entry validation. 19 tests total.

## Time spent

Roughly 10 hours:
- Setup, auth, login — 2h
- Dashboard table, filters, pagination — 2h
- Week view, entries, modals — 2.5h
- Status logic, responsive tweaks — 2h
- Tests and readme — 1.5h

## Live demo

https://tentwenty-task-seven.vercel.app/login

Deploy to Vercel with the same env vars from `.env.local`.

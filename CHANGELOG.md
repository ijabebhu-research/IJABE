# Changelog

All notable project changes are recorded here at the milestone level so the implementation state can be compared against the codebase and project tracker.

## Milestone 6

### Added

- Verified Prisma migration and seed execution for the local development database
- Updated architecture, blueprint, implementation plan, and tracker documents to match the live repository state

### Changed

- Fixed the React 19 TypeScript typing in `frontend/src/components/admin/protected-admin-route.tsx` so the frontend builds cleanly
- Moved the admin hook and context into dedicated files so frontend fast-refresh linting passes cleanly
- Fixed the public site settings route to await Prisma-backed content before responding, resolving the frontend header crash on app load
- Reconciled milestone documentation to reflect that Prisma is active at runtime and the project has completed integration verification

### Verified

- Backend `npm install`
- Frontend `npm install`
- Backend `npm run prisma:generate`
- Backend `npx prisma migrate deploy`
- Backend `npm run prisma:seed`
- Frontend `npm run build`
- Frontend `npm run lint`
- Backend `npm run build`
- Backend `npm run lint`
- Backend `/api/health` runtime check

## Milestone 4

### Added

- Dedicated public route wiring for static content pages, issue browsing, archives, repository, publication detail, news, events, gallery, downloads, search, and contact
- Functional public search experience with keyword search, issue filtering, and live result summaries
- Public contact page with editable contact details, enquiry form submission, and success or failure feedback
- Backend contact submission endpoint with request validation
- `PROJECT_BLUEPRINT.md` as the repo-level product and milestone blueprint
- `CHANGELOG.md` as the repo-level milestone history

### Changed

- Updated `PROJECT_TRACKER.md` to match the actual implementation before continuing milestone work
- Updated homepage search behavior to open the search page with the current query
- Updated footer messaging to reflect the completed public experience milestone

### Verified

- Frontend `npm run build`
- Frontend `npm run lint`
- Backend `npm run build`
- Backend `npm run lint`

## Milestone 3

### Added

- Backend Express TypeScript application scaffold
- Prisma schema baseline for authentication, publications, issues, site settings, media, news, events, gallery, and downloads
- JWT-oriented auth route foundation with protected-route middleware
- API route composition, health endpoint, error handling, and not-found middleware

### Notes

- Prisma remains the schema source of truth while runtime data access is still using a compile-safe placeholder adapter

## Milestone 2

### Added

- Frontend Vite React TypeScript application scaffold
- Tailwind CSS v4 and shadcn/ui-compatible setup
- Public and admin layout shells
- Shared UI primitives and route scaffolding

## Milestone 1

### Added

- Initial planning, architecture direction, milestone breakdown, and project governance documents
- Repository structure for `frontend`, `backend`, `shared`, and `docs`

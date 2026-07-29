# IJABE Project Tracker

## Governing Rule

This project follows `MASTER_PROMPT.docx` as the source of truth unless the user explicitly overrides it.

The prompt requires:

1. Work in milestones.
2. Complete only one milestone at a time.
3. Update the tracker after each milestone.
4. Stop for user approval before continuing.

## Project Snapshot

- Project: IJABE Journal & Research Management System
- Product Type: Public journal website with an admin-managed content system
- Current Phase: Scope refinement completed
- Current Status: Core IJABE experience simplified; build verification in progress
- Stack Baseline: React + TypeScript + Vite + Tailwind CSS + shadcn/ui + React Router + Node.js + Express.js + PostgreSQL + Prisma + JWT

## Vision

Build a modern, minimal, responsive, and easy-to-manage journal and research management system for the International Journal of Accounting, Business Administration & Entrepreneurship (IJABE).

## July 2026 Scope Refinement

The user clarified that IJABE must remain a simple system, centered on:

- Reading publications online or downloading them.
- IJABE and Bingham University news.
- Conference announcements and public applications.
- A private admin route with only site details, publications, news, conferences, and applicants.
- Homepage management profiles for Prof. Haruna K. Ayuba, Prof. Orbunde B. Bemshima, and Dr Caleb Y. Yashim, using supplied images and the Bingham University logo.
- Applicant review with an email reply action; no public admin access.
- Leadership-first homepage redesign, Bingham University admin branding, school-logo browser icon, and direct admin PDF upload to the backend uploads folder.
- Mobile-first visual refinement: uncropped management portraits, black high-contrast admin text on the light university-themed interface, and direct image uploads for branding and management profiles.
- Site details refinement: removed manual image-address fields, duplicate journal-logo control, homepage metric controls, and all user-facing milestone wording.

## Article Publishing Update - July 26, 2026

IJABE will publish individual research articles alongside complete journal issues. Each article must be assigned to its journal issue and publicly available through:

- An issue page that lists its published articles.
- A searchable research repository that treats articles as first-class records.
- An individual article page with its title, authors, abstract, keywords, publication information, journal/issue relationship, and an online reading or download action when a file is available.

The admin workspace must let administrators assign every article to its appropriate issue and manage the article metadata and publication file without editing code.

### Implementation completed

- Public article cards and article detail pages now display the linked IJABE issue.
- Every published issue has a direct public page that lists its published articles.
- Archive issue cards link directly to their article lists.
- The admin publication workspace now presents its role as **Article management** and clearly requires an issue assignment for every article.

## Journal Issue and ISSN Update - July 26, 2026

- Journal issues must be directly available in the admin workspace so the administrator can create and edit the volume, issue number, title, date, and description for every edition.
- The journal ISSN is a journal-wide identifier, not an article field. It must be editable from Site details and shown on the public website in the journal information area.

### Implementation completed

- Added **Journal issues** to the admin navigation and dashboard so the existing editable Volume and Issue number controls are directly accessible.
- Added an editable Journal ISSN field to Site details and public ISSN display in the website footer.

Removed from the intended first-release navigation and admin focus: gallery, editorial board, generic downloads, and other unrelated CMS areas. The master prompt was updated to preserve this direction.

## Milestone Plan

| Milestone | Name | Scope | Status |
| --- | --- | --- | --- |
| 1 | Foundation and Planning | Analyze prompt, review platform patterns, create project tracker, define architecture, create folder structure, plan milestones | Completed |
| 2 | Frontend Foundation | Initialize Vite React app, configure Tailwind CSS, shadcn/ui, routing, layout shell, design tokens, shared UI primitives | Completed |
| 3 | Backend Foundation | Initialize Express app, Prisma schema baseline, PostgreSQL configuration, JWT auth foundation, admin API structure | Completed |
| 4 | Public Experience | Build public pages, publication browsing, search UI, issue/archive views, downloads, and contact flow | Completed |
| 5 | Admin CMS | Build admin login, dashboard, content management modules, media replacement workflows, publication management | Completed |
| 6 | Integration and Readiness | Connect frontend to backend, validation, QA, accessibility pass, deployment preparation, documentation polish | Completed |

## Actual State Audit

The codebase audit and verification pass confirmed that Milestone 6 is complete and the repository is now in a verified post-integration state.

### Post-launch account administration update - July 26, 2026

- Added a private **Administrator account** workspace in the admin area for transferring responsibility or rotating credentials.
- The administrator can update their name, sign-in email, and password after confirming the current password.
- Updating the sign-in email or password revokes all existing refresh sessions and signs the administrator out, so the new credentials must be used for the next sign-in.
- Removed displayed and pre-filled demo credentials from the sign-in screen.

### Implemented In The Current Codebase

- A working public layout with header, footer, homepage, and shared public UI components exists in `frontend/src/layouts`, `frontend/src/components/site`, and `frontend/src/components/public`.
- Dedicated public page components already exist for current issue, archives, repository, news, events, gallery, downloads, publication detail, and generic static content pages in `frontend/src/pages/public`.
- The frontend already consumes public API endpoints with graceful fallback content through `frontend/src/lib/api/public-api.ts` and `frontend/src/hooks/use-public-resource.ts`.
- The backend already serves public mock-backed data for publications, issues, static pages, news, events, gallery, downloads, and contact information in `backend/src/modules`.
- The homepage already displays live-or-fallback content for hero messaging, metrics, featured publications, current issue summary, and news.
- Admin authentication is fully implemented with JWT-based login, logout, and session management in `backend/src/modules/auth` and `frontend/src/pages/admin/admin-login-page.tsx`.
- Admin routing is complete with dedicated content manager pages for all CMS modules in `frontend/src/routes/app-router.tsx` and `frontend/src/pages/admin/admin-content-manager-page.tsx`.
- The admin dashboard displays live statistics, module navigation, and content snapshot summaries in `frontend/src/pages/admin/admin-dashboard-page.tsx`.
- Full CRUD operations for all content types are implemented through the admin content store in `backend/src/modules/admin/admin-content.store.ts` with Zod validation in `backend/src/modules/admin/admin.routes.ts`.
- The runtime backend uses the generated Prisma client in `backend/src/config/prisma.ts` and persists content in the local development database defined by `backend/.env`.
- Backend database migrations and seed data are operational through Prisma commands in `backend/package.json` and `backend/prisma/seed.ts`.
- Frontend and backend dependencies were refreshed with `npm install`, Prisma Client was regenerated, and both applications now pass build verification.
- The backend runtime was verified with a live `/api/health` response and the frontend dev server was started successfully for browser preview.

### Reconciliation Notes After Milestone 6

- Milestone 6 is now complete in the current codebase with verified install, build, seed, and runtime checks.
- Project documentation has been updated to reflect the live frontend and backend structure instead of the original intended scaffold wording.
- A post-verification hotfix corrected the async `/api/site-settings/public` response so public site content now resolves before serialization and the homepage header no longer crashes at runtime.
- `frontend/src/lib/navigation.ts` advertises issue, year, and author filtering for search, while the current UI exposes keyword and issue filtering only.
- The approved stack still names PostgreSQL as the production database target, while the checked-in local development environment currently runs Prisma against SQLite via `DATABASE_URL="file:./dev.db"`.
- Frontend and backend lint now complete with zero warnings and zero errors.

### Milestone 4 Completion In Prior Passes

- Wired dedicated public routes for static pages, issue browsing, archives, repository, publication detail, news, events, gallery, downloads, search, and contact.
- Replaced the placeholder search screen with a working publication search flow backed by existing public API filters.
- Added a public contact page with editable contact information display and enquiry form submission.
- Added a backend contact submission endpoint with request validation for the public enquiry flow.
- Updated project governance files so the tracked milestone status aligned with the public-facing implementation.

## Milestone 1 Deliverables

- Read and analyzed `MASTER_PROMPT.docx`
- Reviewed common journal platform patterns for navigation, archives, search, and content administration
- Defined implementation strategy and milestone breakdown
- Created project-management documents
- Created the initial folder structure for `frontend`, `backend`, `shared`, and `docs`

## Milestone 2 Deliverables

- Initialized the `frontend/` application with Vite, React, and TypeScript
- Added React Router and scaffolded the public and admin route structure
- Configured Tailwind CSS v4 styling and shadcn/ui-compatible setup
- Created reusable UI primitives for buttons, cards, badges, and inputs
- Built the public layout shell with header, footer, homepage, and page templates
- Built the admin layout shell with login and dashboard placeholders
- Added path aliases and project configuration for scalable frontend development

## Milestone 3 Deliverables

- Initialized the `backend/` application with TypeScript, Express, and development scripts
- Added environment configuration files for local development and deployment preparation
- Created the baseline Prisma schema for admin users, refresh tokens, publications, issues, site settings, media, news, events, gallery, and downloads
- Built the Express app bootstrap, API router, health endpoint, error handling, and not-found handling
- Added JWT-oriented auth foundations for login, logout, protected routes, and secure cookie names
- Added CMS-ready module route scaffolds for auth, issues, publications, and site settings
- Preserved Prisma as the database source of truth while using a compile-safe adapter placeholder until full Prisma client generation is completed in a later integration step

## Milestone 4 Deliverables

- Completed public route wiring so dedicated public page components are now used at their intended URLs.
- Connected publication detail routing from repository and search results.
- Implemented a functional search experience with keyword search, issue filtering, and result summaries.
- Implemented the public contact experience with contact details, enquiry form submission, and success or error feedback.
- Updated the homepage search CTA and footer messaging to reflect the completed public experience.
- Verified the frontend with `npm run build` and `npm run lint`.
- Verified the backend with `npm run build` and `npm run lint`.

## Milestone 5 Deliverables

- Implemented fully functional admin login with JWT authentication, credential submission, error handling, and session management.
- Built the admin dashboard with live statistics, module navigation cards, and content snapshot summaries.
- Created comprehensive content management editors for all CMS modules:
  - Homepage content (hero title, summary, metrics)
  - Static pages (title, eyebrow, summary, sections with bullet points)
  - Issues (title, slug, volume, issue number, publication date, description, current issue marking)
  - Publications (title, slug, abstract, authors, keywords, issue assignment, DOI, PDF URL, category)
  - News items (title, slug, excerpt, category, publication date)
  - Events (title, slug, summary, venue, start time, status)
  - Gallery items (title, category, image URL)
  - Downloads (title, description, category, file URL, file size)
  - Editorial board members (name, role, affiliation, summary, image URL)
  - Contact information (office name, emails, phone, address, office hours)
  - Branding (university logo, journal logo, hero banner)
  - Leadership profiles (vice chancellor, university management, research unit head)
- Implemented media replacement workflows through URL-based image/logo editing across all relevant content types.
- Built backend admin API with Zod validation for all content types in `backend/src/modules/admin/admin.routes.ts`.
- Created admin content store with full CRUD operations and snapshot management in `backend/src/modules/admin/admin-content.store.ts`.
- Wired all admin routes in `frontend/src/routes/app-router.tsx` with protected route middleware.
- Integrated admin provider context for authentication state and content management in `frontend/src/components/admin/admin-provider.tsx`.

## Milestone 6 Deliverables

- Refreshed frontend and backend dependencies with `npm install`.
- Regenerated Prisma Client with `npm run prisma:generate`.
- Applied the checked-in Prisma migration state with `npx prisma migrate deploy`.
- Seeded the local development database with admin credentials, sample journal content, and baseline site settings through `npm run prisma:seed`.
- Fixed the frontend React 19 TypeScript guard typing in `frontend/src/components/admin/protected-admin-route.tsx` so the application builds successfully.
- Verified the frontend with `npm run build`.
- Refactored the admin context and hook into dedicated files so frontend fast-refresh linting is clean.
- Verified the frontend with `npm run lint`.
- Verified the backend with `npm run build`.
- Verified the backend with `npm run lint`.
- Verified backend runtime startup and successful `/api/health` response.
- Updated project governance and architecture documents so they align with the current repository state.

## Project Structure

```text
docs/
  ARCHITECTURE.md
  IMPLEMENTATION_PLAN.md
  MASTER_PROMPT_REVIEW.md
frontend/
  public/
  src/
    components/
      public/
      site/
      ui/
    hooks/
    layouts/
    lib/
      api/
    pages/
      admin/
      public/
    routes/
backend/
  prisma/
    schema.prisma
  src/
    config/
    middleware/
    modules/
      auth/
      issues/
      public/
      publications/
      site-settings/
    routes/
shared/
```

## Recommendations Logged

1. Keep the first release admin-managed only, with no author registration or peer-review workflow, because the prompt limits roles to Admin and Public User.
2. Use secure JWT handling with `httpOnly` cookies or short-lived access tokens plus refresh tokens, instead of browser local storage.
3. Treat placeholder imagery as replaceable admin-managed assets in the CMS, not hard-coded static visuals.
4. Add SEO and metadata fields for publications and pages early, because journal discoverability is important and does not add much complexity.
5. Replace the temporary compile-safe Prisma adapter with the generated Prisma client during the integration milestone, once local Prisma CLI execution is stable.

## Notes On Prompt Interpretation

- The prompt asks for inspiration from platforms such as OJS and Springer-like journal sites, but it also restricts the system to only two roles. The recommended interpretation is to borrow their public information architecture and admin usability patterns without implementing full editorial workflow roles.
- The prompt requests simplicity while also requiring many manageable content areas. The recommended approach is a modular CMS with reusable content types and media management, rather than custom logic for every page.
- Placeholder images and leadership visuals should remain admin-replaceable in later milestones rather than becoming fixed frontend assets.

## Reliability and Admin Usability Update - July 26, 2026

- Fixed saving so removed articles, news items, and events are permanently removed from the database.
- Replaced comma-separated author entry with a clear one-author-per-line field, removed manual article-file address entry, and shortened confirmation messages.
- Extended administrator sessions from 15 minutes to 8 hours, with a 30-day secure refresh session.
- Fixed the conference form so successful applications no longer display a false failure message.
- Added delete actions for conference applications and added an Enquiries workspace for public contact-form submissions, replies, and deletion.
- Replaced remaining technical admin labels with plain-language wording.

### Follow-up fixes

- Replaced browser alert confirmations with in-page confirmation panels for deleting applications and enquiries.
- Verified the public enquiry endpoint live; enquiries now save correctly and appear in the admin workspace after the backend is restarted with the latest update.
- Added automatic session renewal using the secure refresh session, so active administrators remain signed in without needing to log in again.
- Replaced author and keyword separators with separate editable fields, and renamed the Site details section from University Management to Faculty Management.
- Fixed issue address edits so all linked articles follow the renamed issue, preventing the issue-management save error.
- Removed Editorial Board, Gallery, and Downloads from the public footer, and expanded local development CORS support so public enquiries submit successfully from the active local site port.
- Issue saving now automatically keeps one available issue marked as current, and the admin workspace signs out after 10 minutes without activity.
- Issue removal now deletes the issue permanently when saved and moves its attached articles to the remaining current issue, preventing accidental article loss.
- Admin collection pages now use click-to-open editor panels, while the public article repository shows 12 articles at a time with paging and a clear search route for older records.
- Added direct admin search for issues, articles, news, and conferences, plus visible Close controls for opened applications and enquiries.

## Next Priority Actions Before Launch

1. Move production data from the local SQLite development database to managed PostgreSQL.
2. Move uploaded PDFs and images from the local `backend/uploads` folder to persistent storage. This is required: ordinary hosting files can be temporary and may be deleted whenever the application is restarted or redeployed.
3. Recommended launch setup: Railway for the Express backend, PostgreSQL database, and a persistent volume; Vercel or Railway for the React frontend. For the strongest long-term file storage, use S3-compatible object storage instead of server-disk uploads.
4. Configure production environment variables, domain name, HTTPS, and a backup plan for the database and uploaded files.
5. Test the complete production workflow: admin sign-in, PDF/image upload, publication reading/downloading, conference application, and applicant email response.

## Production Deployment Readiness Update - July 27, 2026

- Added a production PostgreSQL schema and baseline migration without disturbing the local SQLite development database.
- Added Cloudflare R2 upload support. Production mode now refuses to start unless permanent R2 storage is configured, preventing accidental public use of the server's temporary upload folder.
- Added Railway deployment configuration, Vercel single-page-app routing, and separate production environment variable templates.
- Added safe local-content export, PostgreSQL import, and local-file-to-R2 migration commands for the existing journal records and uploads.
- Added a plain-language, step-by-step deployment guide at `docs/DEPLOYMENT.md` covering backup, R2, Railway, Vercel, domain setup, migration, and launch checks.

## Content Organisation and Discoverability Update - July 29, 2026

- Grouped administrator article management by journal volume and issue, with direct article creation inside the selected issue.
- Limited public article previews to four lines with a clear Read more action, and moved the About IJABE section before management profiles.
- Added editable Chief Editor, Managing Editor, and Secretary contact details to the public contact page and administrator workspace.
- Added crawler instructions, sitemap, and ScholarlyArticle structured data for publication pages to support search-engine discovery.

# IJABE Architecture Baseline

## Architectural Direction

The platform uses a separated frontend and backend:

- `frontend/` for the React application
- `backend/` for the Express API, authentication logic, and Prisma data layer
- `shared/` for future cross-app constants, schemas, or shared types if needed
- `docs/` for planning and governance materials

This keeps the system modular and aligns with the approved stack while avoiding unnecessary monorepo complexity.

## Frontend Structure

```text
frontend/
  public/
  src/
    components/   # shared UI plus public and admin component groups
    hooks/        # frontend data hooks
    layouts/      # public and admin layouts
    lib/          # API clients, navigation helpers, utility functions, fallback content
    pages/        # route-level page components
      admin/
      public/
    routes/       # router definitions and route guards
```

## Backend Structure

```text
backend/
  prisma/         # Prisma schema and migrations
  src/
    config/       # env, database, and app configuration
    middleware/   # auth, error handling, request middleware
    modules/      # feature modules such as admin, auth, public, issues, publications
    routes/       # route registration
```

## Runtime Notes

1. Prisma is active at runtime through `backend/src/config/prisma.ts`.
2. The checked-in local development environment currently points `DATABASE_URL` to the SQLite file in `backend/dev.db`.
3. The approved product direction still expects PostgreSQL for production deployment, so the current SQLite setup should be treated as the verified local development profile.

## Initial Domain Modules Planned

- Authentication
- Publications
- Issues
- Archives
- Pages and homepage sections
- Editorial board
- News
- Events
- Gallery
- Downloads
- Contact information
- Site branding and media assets
- Leadership and institutional profiles

## Content Management Principles

1. All editable public content should be stored in the database or managed media storage, not hard-coded in the UI.
2. Admin-managed images should be replaceable through the dashboard.
3. Reusable content models should be preferred over page-specific one-off implementations.
4. Search currently targets publication metadata with keyword and issue filtering, and can be extended later with additional facets if needed.

## Security Baseline

1. Use JWT-based authentication as required by the prompt.
2. Prefer secure cookie transport and refresh-token support for better security and session management.
3. Restrict admin endpoints with role-based middleware, even though only one authenticated role currently exists.
4. Validate incoming data on both client and server sides.

## UX Baseline

1. Keep public navigation simple and consistent.
2. Prioritize readability for abstracts, metadata, and downloadable files.
3. Use responsive layouts with strong mobile behavior.
4. Maintain accessible color contrast, semantic markup, keyboard navigation, and clear form feedback.

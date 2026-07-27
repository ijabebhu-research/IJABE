# IJABE Project Blueprint

## Purpose

This blueprint captures the intended product shape, repository structure, and milestone boundaries for the IJABE Journal & Research Management System.

It complements `MASTER_PROMPT.docx`, `PROJECT_TRACKER.md`, and the planning documents under `docs/`.

## Product Definition

IJABE is a journal and research management platform with two audiences only:

- Admin: manages journal content, publications, branding, media, and institutional information
- Public User: browses, searches, reads, and downloads content without authentication

The first release is not a multi-role editorial workflow system. It is a professional public journal experience with a CMS-ready administrative foundation.

## Product Principles

1. Keep the experience modern, minimal, responsive, and easy to use.
2. Make public content clear and discoverable.
3. Keep content CMS-manageable instead of hard-coded wherever practical.
4. Prefer reusable modules over page-specific custom implementations.
5. Avoid unnecessary complexity unless it creates clear long-term value.

## Approved Stack

- Frontend: React, TypeScript, Vite, React Router
- UI: Tailwind CSS, shadcn/ui-compatible primitives
- Backend: Node.js, Express.js, TypeScript
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT

## Repository Shape

```text
docs/
  ARCHITECTURE.md
  IMPLEMENTATION_PLAN.md
  MASTER_PROMPT_REVIEW.md
frontend/
  src/
    components/
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
  src/
    config/
    middleware/
    modules/
    routes/
shared/
```

## Domain Areas

### Public Domain

- Homepage
- About IJABE
- About Research Unit
- Editorial Board
- Current Issue
- Archives
- Research Repository
- Publication Detail
- News
- Events
- Gallery
- Downloads
- Contact
- Search

### Admin Domain

- Authentication
- Dashboard
- Homepage management
- Journal information management
- Issue and archive management
- Publication management
- Editorial board management
- News management
- Events management
- Gallery management
- Downloads management
- Contact information management
- Branding and replaceable media management

## Backend Content Model Direction

The backend schema and module structure are designed around:

- Admin users and refresh tokens
- Publications and issues
- Static pages and site settings
- News, events, gallery items, and downloads
- Replaceable media assets

The current implementation uses Prisma at runtime for the local development database, while preserving the approved direction toward PostgreSQL for production deployment.

## Milestone Boundaries

### Milestone 1

Planning, architecture, structure, and tracker setup.

### Milestone 2

Frontend foundation, public shell, admin shell, reusable UI primitives, and routing scaffold.

### Milestone 3

Backend foundation, Prisma schema baseline, auth foundation, and API module structure.

### Milestone 4

Public experience completion:

- functional public routing
- issue and archive browsing
- repository and publication detail browsing
- search experience
- downloads experience
- contact flow

### Milestone 5

Admin CMS implementation:

- login integration
- dashboard workflows
- content CRUD
- media replacement
- publication and issue management

### Milestone 6

Integration, verification, accessibility, deployment readiness, and documentation polish.

## Current Blueprint Status

The repository has completed Milestone 6 and is currently in a verified post-integration state:

- public browsing routes are wired to dedicated page components
- publication detail, issue browsing, archives, downloads, and search are available
- admin authentication, dashboard workflows, and CMS editing flows are operational
- Prisma migration, seed, build, lint, and backend runtime checks have been completed for local development

## Working Rule

Always complete one milestone at a time, update the project documents to reflect the actual implementation, and stop for approval before beginning the next milestone.

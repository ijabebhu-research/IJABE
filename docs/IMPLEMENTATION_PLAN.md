# IJABE Implementation Plan

## Project Vision

Create a professional journal and research management platform for IJABE that presents publications clearly to the public and allows administrators to manage all content without editing code.

## Project Objectives

1. Deliver a clean, modern, and responsive public-facing journal website.
2. Centralize administration of publications, issues, archives, institutional content, media, and informational pages.
3. Keep the architecture modular, maintainable, and easy to extend.
4. Avoid unnecessary complexity while preserving room for future growth.

## Approved Technology Stack

- Frontend: React, TypeScript, Vite, React Router
- UI: Tailwind CSS, shadcn/ui
- Backend: Node.js, Express.js
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JWT
- Deployment: Docker optional

## Required Features

### Public Features

- Homepage
- About IJABE page
- About Research Unit page
- Editorial Board page
- Current Issue page
- Archives page
- Research Repository page
- News page
- Events page
- Gallery page
- Downloads page
- Contact page
- Search page
- Publication detail viewing
- Publication downloading

### Admin Features

- Admin login
- Admin dashboard
- Homepage management
- Journal information management
- Current issues management
- Archives management
- Publication upload, edit, delete
- Editorial board management
- News management
- Events management
- Gallery management
- Downloads management
- Contact information management
- University logo management
- Journal logo management
- Vice Chancellor information management
- University management information management
- Research Unit Head management
- Banner and image replacement

## User Roles

### Admin

Full CMS-style management of site content, research content, branding assets, and institutional information.

### Public User

Open-access browsing, searching, reading, and downloading without registration.

## Platform Patterns Adopted

The implementation will borrow high-level best practices observed across established journal platforms:

- Clear top-level navigation with persistent access to current issue, archives, repository, and search
- Strong article discoverability through filters, metadata, and prominent search
- Rich content administration for logos, homepage sections, and institutional pages
- Structured archive and issue browsing rather than flat file lists
- Publication pages that foreground title, authors, abstract, metadata, and download access

## Implementation Strategy

1. Build the foundation first: docs, structure, design direction, and milestone sequencing.
2. Establish the frontend shell and design system before page-by-page implementation.
3. Establish the backend API and content model before wiring admin flows.
4. Deliver the public experience before the full admin CMS where practical, but keep backend models CMS-ready from the start.
5. Use reusable modules for content sections, media, and publications to reduce duplication.
6. Complete one milestone at a time and stop for approval after each milestone.

## Milestones

### Milestone 1

Foundation and planning.

### Milestone 2

Frontend scaffold, design system, routing, and page shells.

Status: Completed.

Delivered:

- Vite React TypeScript app initialization
- Tailwind CSS and shadcn/ui-compatible frontend setup
- Route shells for all required public pages plus admin login and dashboard
- Reusable UI primitives and layout components
- Successful build and lint verification

### Milestone 3

Backend scaffold, Prisma schema baseline, authentication foundation, and API module structure.

Status: Completed.

Delivered:

- Express TypeScript server bootstrap with app, server, middleware, and route composition
- Prisma schema baseline covering authentication and key CMS domain models
- Environment configuration and local development `.env.example`
- JWT-oriented auth route skeleton with secure cookie naming and protected-route middleware
- Backend build and lint verification

Note:

- Prisma remains the data-model source of truth through `schema.prisma`.
- The current backend uses a compile-safe adapter placeholder in `src/config/prisma.ts` until Prisma client generation is completed during the next backend integration step.

### Milestone 4

Public pages and publication browsing experience.

Status: Completed.

Delivered:

- Wired dedicated public routes for the public information pages, issue browsing, archives, repository, publication detail, news, events, gallery, downloads, search, and contact
- Replaced the placeholder search screen with a functional publication search and issue-filtering experience
- Added the public contact page and backend enquiry submission endpoint
- Connected the homepage search CTA to the search route with query handoff
- Verified frontend and backend build and lint checks

Note:

- Public content remains mock-backed for now, which keeps the milestone aligned with the planned sequence while preserving Prisma and CMS-ready structures for later milestones

### Milestone 5

Admin dashboard and content management modules.

Status: Completed.

Delivered:

- Admin login integration with JWT-backed session handling
- Admin dashboard summaries and protected admin routing
- CMS-style editing flows for homepage, static pages, issues, publications, news, events, gallery, downloads, contact, branding, and leadership content
- Prisma-backed content persistence for the verified local development environment

### Milestone 6

Integration, QA, accessibility review, and deployment readiness.

Status: Completed.

Delivered:

- Refreshed frontend and backend dependencies with `npm install`
- Regenerated Prisma Client, confirmed migrations, and seeded the development database
- Fixed the frontend route-guard typing issue blocking TypeScript compilation
- Verified frontend and backend build checks
- Verified frontend and backend lint checks
- Verified backend runtime startup and health endpoint response
- Updated architecture and governance documents to match the live repository structure and runtime state

Note:

- Local development is currently validated against the checked-in SQLite database, while PostgreSQL remains the approved production target from the master prompt

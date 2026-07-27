# Master Prompt Review

## Constitutional Summary

`MASTER_PROMPT.docx` defines the non-negotiable direction for this project:

- Build an IJABE journal and research management system
- Keep the product modern, elegant, responsive, and easy to manage
- Use the approved React, Express, PostgreSQL, Prisma, and JWT stack
- Support only two roles: Admin and Public User
- Make all content manageable without code edits
- Proceed one milestone at a time and stop for approval after each milestone

## Interpreted Scope

The prompt describes a journal website plus a content management system, not a full multi-role scholarly submission platform.

That means the first release should focus on:

- Public discovery and reading of publications
- Structured issue and archive browsing
- Institution and journal information pages
- Admin-managed content and media

It should not expand into:

- Author registration
- Reviewer workflows
- Multi-stage editorial task management
- Complex manuscript submission pipelines

unless the user explicitly requests that later.

## Ambiguities and Recommended Interpretation

### Ambiguity 1: Platform inspiration vs limited roles

The prompt asks for inspiration from OJS, Springer, Elsevier, MDPI, IEEE, and ACM, but it also restricts the system to only two roles.

Recommended interpretation:

- Reuse their strengths in information architecture, discoverability, and professionalism
- Do not copy their complete editorial workflow or role model

### Ambiguity 2: Simple system vs broad content management

The prompt asks for simplicity, but the admin must manage many content areas.

Recommended interpretation:

- Use a modular CMS structure with reusable content types
- Avoid custom one-off implementations for every page where a shared model can work

### Ambiguity 3: JWT requirement vs secure implementation

The prompt requires JWT authentication but does not define storage strategy.

Recommended interpretation:

- Use JWT in a secure, server-aware pattern
- Avoid storing tokens in browser local storage when possible

### Ambiguity 4: Placeholder images

The prompt requests placeholder imagery that can later be replaced from the dashboard.

Recommended interpretation:

- Use development-safe temporary assets and model them as replaceable media entries
- Do not hard-code visual assets in a way that prevents admin replacement

## Research Notes

The initial planning considered common journal platform patterns such as:

- Search-first publication discovery
- Clear access to current issues and archives
- Editorial board and journal information visibility
- Rich metadata on article or publication detail pages
- Admin control over site branding and informational sections

# GitHub Management Plan

## Suggested issues

### Issue 1

**Title:** Add contract tests for Swagger documentation

**Description:**
Expand automated coverage for the OpenAPI contract exposed by `/docs.json`. The goal is to validate documented response schemas, query parameters, and authentication requirements to reduce drift between implementation and documentation.

**Acceptance criteria:**
- validate critical paths from the OpenAPI spec
- cover `/users`, `/users/me`, `/auth/login`, and `/tasks`
- fail fast when documented parameters diverge from implementation

### Issue 2

**Title:** Improve JSON persistence resilience for concurrent writes

**Description:**
The MVP intentionally uses JSON file persistence, but this creates a known limitation around concurrent writes and test isolation. Investigate ways to reduce risk and document the trade-offs.

**Acceptance criteria:**
- document the concurrency limitation
- propose or implement a simple write-serialization strategy
- add at least one test or technical note demonstrating the risk

### Issue 3

**Title:** Add branch protection and CI merge policy for main

**Description:**
Now that the project has a GitHub Actions pipeline, the repository should adopt a safer merge flow around `main`.

**Acceptance criteria:**
- set `main` as the default branch
- require pull requests for changes to `main`
- require CI to pass before merge

## Suggested pull request sequence

### PR 1

**Branch:** `codex/api-foundation`  
**Title:** Initialize API foundation with health check

### PR 2

**Branch:** `codex/swagger-documentation`  
**Base:** `codex/api-foundation`  
**Title:** Add Swagger documentation for API endpoints

### PR 3

**Branch:** `codex/readme-and-env-setup`  
**Base:** `codex/swagger-documentation`  
**Title:** Add environment configuration and improve README

### PR 4

**Branch:** `codex/error-handling-refinement`  
**Base:** `codex/readme-and-env-setup`  
**Title:** Refine global error handling responses

### PR 5

**Branch:** `codex/ci-pipeline`  
**Base:** `codex/error-handling-refinement`  
**Title:** Add GitHub Actions test pipeline

### PR 6

**Branch:** `codex/release-readiness`  
**Base:** `codex/ci-pipeline`  
**Title:** Polish public project metadata and documentation

### PR 7

**Branch:** `codex/task-filters-and-search`  
**Base:** `codex/release-readiness`  
**Title:** Add task filters and search query support

### PR 8

**Branch:** `codex/sorting-and-pagination`  
**Base:** `codex/task-filters-and-search`  
**Title:** Add task sorting and pagination support

### PR 9

**Branch:** `codex/auth-me-endpoint`  
**Base:** `codex/sorting-and-pagination`  
**Title:** Add authenticated user profile endpoint

## Important note

If you prefer a shorter GitHub review flow, these changes can also be grouped into fewer PRs:

- foundation and auth
- documentation and CI
- task search, sorting, pagination, and authenticated user profile

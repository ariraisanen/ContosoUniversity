<!--
Sync Impact Report - Constitution v1.1.0
========================================
Version Change: 1.0.0 → 1.1.0 (MINOR)
Amendment Date: 2025-11-12

Bump Rationale: Added three new principles for API and frontend modernization
(VI. REST API Design, VII. React & Frontend Best Practices, VIII. Frontend-Backend Separation).
No existing principles modified. This is an additive change supporting Lab 2 (React SPA Migration).

Principles Added:
- VI. REST API Design (Mandatory)
- VII. React & Frontend Best Practices (Mandatory)
- VIII. Frontend-Backend Separation (Mandatory)

Principles Modified: None

Sections Modified:
- Core Principles (expanded from 5 to 8 principles)
- Technology Standards (added React, TypeScript, REST API requirements)

Templates Status:
✅ plan-template.md - Aligned with new API/React principles
✅ spec-template.md - Aligned with separation of concerns requirements
✅ tasks-template.md - Updated to include API and frontend task categories

Follow-up TODOs: None
-->

# Contoso University Constitution

## Core Principles

### I. Spec-Driven Development (Mandatory)

**Every feature MUST begin with a specification before implementation.**

- Specifications MUST be created in `.specify/specs/[###-feature-name]/` directory
- Each spec MUST include:
  - User scenarios with acceptance criteria (prioritized, independently testable)
  - Functional requirements (explicit, measurable)
  - Success criteria (technology-agnostic, verifiable)
- Implementation MUST NOT begin until spec is reviewed and approved
- Tasks MUST be generated from specifications using `/speckit.tasks` workflow
- All changes MUST reference their originating spec in commit messages

**Rationale**: This is a workshop/training project teaching Spec-Kit methodology. Spec-first development ensures clarity, enables AI assistance, provides living documentation, and demonstrates best practices to learners.

### II. Educational Clarity

**Code and documentation MUST prioritize learning and comprehension.**

- All code MUST be readable and well-commented for educational purposes
- Complex patterns MUST include explanatory comments explaining "why" not just "what"
- Lab instructions MUST be complete, accurate, and tested on both Mac and Windows
- Error messages and validation MUST be helpful and educational
- Architecture decisions MUST be documented with clear rationale
- Workshop facilitators MUST be able to explain any part of the codebase

**Rationale**: This project exists to teach cloud modernization and AI-assisted development. Code serves as both functional application and teaching material. Clarity and comprehension override performance optimization unless explicitly required.

### III. Cross-Platform Compatibility

**All functionality MUST work on both macOS and Windows without modification.**

- Database setup MUST support both Docker (Windows/Mac) and Podman (Mac)
- All scripts MUST have PowerShell versions (cross-platform)
- File paths MUST use platform-agnostic conventions
- Documentation MUST include platform-specific instructions where needed
- Testing MUST verify functionality on both platforms before release
- Container commands MUST provide both `docker` and `podman` alternatives

**Rationale**: Workshop participants use diverse platforms. Platform-specific failures disrupt learning flow and waste valuable workshop time. Cross-platform support is non-negotiable for successful workshop delivery.

### IV. AI-Assisted Development

**GitHub Copilot MUST be the primary development tool and methodology.**

- All labs MUST assume GitHub Copilot availability
- Feature development SHOULD leverage Copilot with spec context
- Complex implementations SHOULD use Copilot Chat with spec references
- Code reviews MUST verify Copilot could reasonably generate the solution
- Documentation MUST include Copilot usage patterns and prompts
- Workshop materials MUST demonstrate effective Copilot collaboration

**Rationale**: This workshop teaches AI-powered development. The application serves as a practical environment for learning GitHub Copilot workflows. Code complexity and patterns should be Copilot-friendly to maximize learning effectiveness.

### V. Incremental Modernization

**Changes MUST be incremental, testable, and independently deployable.**

- Each lab MUST deliver a complete, working feature or upgrade
- User stories MUST be independently testable (can be developed/deployed alone)
- Breaking changes MUST be avoided; when unavoidable, MUST include migration path
- Each feature MUST work alongside existing features without refactoring unrelated code
- Rollback MUST be possible for any feature
- Database migrations MUST be reversible

**Rationale**: The application demonstrates enterprise modernization patterns. Real-world migrations are incremental, not big-bang. Each lab represents a realistic modernization step that could be applied to legacy applications.

### VI. REST API Design (Mandatory)

**All REST APIs MUST follow industry-standard conventions and best practices.**

- API endpoints MUST use flat resource structure: `/api/students`, `/api/courses`, `/api/enrollments`
- Related data MUST be accessed via query parameters: `/api/enrollments?studentId={id}`
- HTTP verbs MUST be used correctly: GET (read), POST (create), PUT (update), DELETE (remove)
- Status codes MUST be semantic: 200 (OK), 201 (Created), 400 (Bad Request), 404 (Not Found), 409 (Conflict), 500 (Server Error)
- Responses MUST use JSON with proper `Content-Type: application/json` headers
- Pagination MUST use offset-based parameters: `pageNumber` (1-based), `pageSize` (default: 10, max: 100)
- Paginated responses MUST include metadata: `totalCount`, `pageNumber`, `pageSize`, `totalPages`
- Error responses MUST use consistent format: `{"error": "message", "field": "fieldName"}`
- Concurrency conflicts MUST use optimistic locking with version tokens/timestamps
- CORS MUST be configured to support cross-origin requests from frontend

**Rationale**: REST APIs enable frontend-backend separation, support mobile apps, and follow industry standards. Consistent API design reduces learning curve, enables reuse, and aligns with Microsoft's ASP.NET Core Web API best practices. These standards are essential for Lab 2 (React SPA Migration) and future mobile development.

### VII. React & Frontend Best Practices (Mandatory)

**React applications MUST follow modern patterns and TypeScript conventions.**

- Components MUST use functional components with React Hooks (useState, useEffect, useContext)
- TypeScript MUST be used for type safety with explicit interface definitions for props and state
- State management MUST use React Context API for global state, local useState for component state
- API calls MUST be centralized in service modules (`services/api/`)
- Components MUST be organized by feature/domain, not technical role
- Loading states MUST be shown during async operations with user feedback
- Error boundaries MUST handle runtime errors gracefully with user-friendly messages
- Form validation MUST provide immediate feedback (within 500ms)
- Components MUST be reusable and independently testable
- Performance optimizations MUST use `useMemo`, `useCallback`, and `React.memo` appropriately

**Project Structure MUST follow**:
```
src/
├── components/      # Reusable UI components
│   ├── common/     # Generic components
│   └── features/   # Feature-specific components
├── pages/          # Route/page components
├── hooks/          # Custom React hooks
├── context/        # React Context providers
├── services/       # API clients and business logic
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

**Rationale**: React is introduced in Lab 2 as the modern SPA framework. Following current best practices (functional components, hooks, TypeScript) ensures maintainable, performant code that leverages React's latest features. This structure supports GitHub Copilot code generation and demonstrates professional React development patterns to workshop participants.

### VIII. Frontend-Backend Separation (Mandatory)

**Frontend and backend MUST be independently deployable and loosely coupled.**

- Backend MUST expose complete functionality through REST API only (no server-side rendering of business logic in API context)
- Frontend MUST NOT contain business logic; all rules MUST be enforced in backend
- API MUST validate all incoming data; frontend validation is for UX only
- Frontend MUST handle all presentation concerns; backend MUST NOT generate HTML for API responses
- Authentication/authorization rules (when implemented) MUST be enforced in backend, not frontend
- Frontend and backend MUST be deployable to separate servers/services
- API versioning MUST be considered for breaking changes (future labs)
- Frontend MUST gracefully handle API errors and network failures
- Backend MUST NOT depend on specific frontend implementation
- Shared data contracts MUST be defined via TypeScript interfaces (frontend) and C# models (backend)

**Rationale**: Separation of concerns enables independent scaling, deployment, and development of frontend and backend. This architecture supports future mobile apps (reusing the same API), allows frontend technology changes without backend impact, and demonstrates modern cloud-native application patterns. This is a foundational principle for Lab 2 and all subsequent modernization labs.

## Technology Standards

### Required Stack

- **Backend Framework**: ASP.NET Core (currently .NET 6.0, upgradable via labs)
- **Backend UI** (Legacy): Razor Pages (maintained for comparison, being replaced by React SPA in Lab 2)
- **Frontend Framework** (Modern): React with TypeScript
- **API Style**: RESTful JSON APIs (ASP.NET Core Web API)
- **Database**: SQL Server (via Docker/Podman container)
- **ORM**: Entity Framework Core with Code-First migrations
- **State Management**: React Context API (for global state)
- **HTTP Client**: Fetch API (browser native) or Axios
- **Testing**: Built-in ASP.NET Core testing framework (when tests added)
- **AI Tools**: GitHub Copilot + GitHub Spec-Kit

### Technology Constraints

- Backend MUST maintain SQL Server compatibility (Microsoft.EntityFrameworkCore.SqlServer)
- Backend MUST support containerized database (Docker/Podman)
- Frontend MUST target modern evergreen browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Frontend MUST be responsive (768px tablet to 1920px desktop)
- MUST NOT introduce platform-specific dependencies
- SHOULD use stable packages: NuGet (Microsoft), npm (official React packages)
- MUST document any new technology additions in lab instructions
- TypeScript MUST use strict mode for maximum type safety

### API Conventions

- All API endpoints MUST be prefixed with `/api/`
- Resource naming MUST be plural: `/api/students`, `/api/courses`
- ID parameters MUST be part of URL path: `/api/students/{id}`
- Query parameters MUST be used for filtering: `/api/enrollments?studentId={id}`
- All requests/responses MUST use `application/json` content type
- Validation errors MUST return HTTP 400 with error details
- Concurrency conflicts MUST return HTTP 409 with conflict information
- Missing resources MUST return HTTP 404
- Server errors MUST return HTTP 500 with generic error (no internal details exposed)

### Data Management

- All schema changes MUST use EF Core migrations
- Migrations MUST be tested both forward (up) and backward (down)
- Seed data MUST be idempotent (can run multiple times safely)
- Connection strings MUST be configurable via appsettings.json
- Default password for SQL Server: `YourStrong@Passw0rd123` (documented in README)

## Development Workflow

### Lab Development Process

1. **Spec Creation**: Author spec in `.specify/specs/[lab-number]-[name]/spec.md`
2. **Plan Generation**: Run `/speckit.plan` to create implementation plan
3. **Task Breakdown**: Run `/speckit.tasks` to generate task list
4. **Implementation**: Use GitHub Copilot with spec context for development
5. **Validation**: Test on both macOS and Windows platforms
6. **Documentation**: Update lab instructions with learnings and gotchas
7. **Review**: Verify educational clarity and Copilot-friendliness

### Branch Strategy

- **main**: Stable, tested, workshop-ready code
- **feature/[lab-name]**: Individual lab development
- Feature branches MUST include complete spec in `.specify/specs/`
- Merge to main ONLY after cross-platform validation

### Quality Gates

Before merging to main, feature MUST:

- Build successfully on both Windows and macOS
- Include complete spec documentation
- Pass manual testing of all CRUD operations
- Update README.md if prerequisites change
- Include updated lab instructions if new lab
- Work with both Docker and Podman (where applicable)
- Be demonstrable in under 90 minutes (for core labs)
- Follow constitutional principles (API design, React patterns, separation of concerns)
- Validate TypeScript types compile without errors (for frontend features)
- Verify API endpoints return correct status codes and response formats
- Test responsive design on multiple screen sizes (for frontend features)

### Commit Message Standards

Format: `[type]: [description]`

Examples:

- `feat: add course scheduling functionality (Lab 7)`
- `fix: resolve Podman connection issue on macOS`
- `docs: update setup instructions for Windows users`
- `refactor: simplify Instructor model for clarity`

MUST reference spec: `Follows spec: specs/007-course-scheduling/spec.md`

## Governance

### Constitution Authority

This constitution supersedes all other development practices. When conflicts arise between this document and other guidance, this constitution takes precedence.

### Amendment Process

1. Propose amendment with clear rationale
2. Document impact on existing labs and specs
3. Update affected templates in `.specify/templates/`
4. Increment version number according to semantic versioning:
   - **MAJOR**: Breaking changes to core principles or workflow
   - **MINOR**: New principles added or significant guidance expansion
   - **PATCH**: Clarifications, typos, non-semantic refinements
5. Update `LAST_AMENDED_DATE` to date of change
6. Document amendment in sync impact report (HTML comment at top)

### Compliance Verification

- All feature branches MUST verify against constitution before PR
- Workshop facilitators MUST review constitution before delivering workshop
- Lab instructions MUST align with constitutional principles
- Code reviews MUST check constitutional compliance

### Complexity Justification

Any violation of principles MUST be explicitly justified in the implementation plan's "Complexity Tracking" section, including:

- What principle is being violated
- Why the violation is necessary
- What simpler alternative was rejected and why

**Version**: 1.1.0 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-12

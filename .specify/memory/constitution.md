<!--
Sync Impact Report - Constitution v1.0.0
========================================
Version Change: Initial → 1.0.0
Initial Constitution Creation: 2025-11-12

Principles Defined:
- I. Spec-Driven Development (Mandatory)
- II. Educational Clarity
- III. Cross-Platform Compatibility
- IV. AI-Assisted Development
- V. Incremental Modernization

Sections Added:
- Core Principles (5 principles)
- Technology Standards
- Development Workflow
- Governance

Templates Status:
✅ plan-template.md - Reviewed and aligned
✅ spec-template.md - Reviewed and aligned
✅ tasks-template.md - Reviewed and aligned

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

## Technology Standards

### Required Stack

- **Framework**: ASP.NET Core (currently .NET 6.0, upgradable via labs)
- **UI**: Razor Pages (Lab 2 introduces React modernization option)
- **Database**: SQL Server (via Docker/Podman container)
- **ORM**: Entity Framework Core with Code-First migrations
- **Testing**: Built-in ASP.NET Core testing framework (when tests added)
- **AI Tools**: GitHub Copilot + GitHub Spec-Kit

### Technology Constraints

- MUST maintain SQL Server compatibility (Microsoft.EntityFrameworkCore.SqlServer)
- MUST support containerized database (Docker/Podman)
- MUST NOT introduce platform-specific dependencies
- SHOULD use stable NuGet packages from official Microsoft sources
- MUST document any new technology additions in lab instructions

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

**Version**: 1.0.0 | **Ratified**: 2025-11-12 | **Last Amended**: 2025-11-12

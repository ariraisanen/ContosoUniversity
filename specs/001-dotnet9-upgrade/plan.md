# Implementation Plan: .NET 9 Framework Upgrade

**Branch**: `001-dotnet9-upgrade` | **Date**: 2025-11-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dotnet9-upgrade/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Upgrade Contoso University application from .NET 6.0 to .NET 9.0, ensuring all existing functionality remains intact while leveraging the latest framework improvements. This includes updating the target framework, migrating all package dependencies to .NET 9-compatible versions, addressing any breaking changes in ASP.NET Core and Entity Framework Core, and verifying cross-platform compatibility.

## Technical Context

**Language/Version**: C# / .NET 6.0 → .NET 9.0  
**Primary Dependencies**: 
- ASP.NET Core 6.0 (Razor Pages) → ASP.NET Core 9.0
- Entity Framework Core 6.0.2 → Entity Framework Core 9.0
- Microsoft.EntityFrameworkCore.SqlServer 6.0.2
- Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore 6.0.2
- Microsoft.VisualStudio.Web.CodeGeneration.Design 6.0.2

**Storage**: SQL Server 2022 (containerized via Docker/Podman)  
**Testing**: Manual testing only (no automated test framework in project - resolved in research.md)  
**Target Platform**: Cross-platform web application (macOS and Windows development environments)  
**Project Type**: Single web application (ASP.NET Core Razor Pages)  
**Performance Goals**: Maintain or improve current performance (page load times within 10% of baseline)  
**Constraints**: 
- Must maintain cross-platform compatibility (macOS/Windows)
- Must support both Docker and Podman for SQL Server
- Must maintain educational clarity (workshop/training project)
- Must preserve existing database schema and migrations

**Scale/Scope**: Educational application with ~10 Razor Pages, 6 entity models, 2 existing migrations, containerized database dependency

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Initial Evaluation (Pre-Research)

### I. Spec-Driven Development ✅
- Specification created at `specs/001-dotnet9-upgrade/spec.md`
- User scenarios with acceptance criteria defined
- Functional requirements documented
- Success criteria established
- **PASS**: All spec requirements met

### II. Educational Clarity ✅
- Feature is foundational to workshop (Lab 1: Introduction to Spec-Kit)
- Upgrade process demonstrates spec-driven approach
- Breaking changes will be documented for learning purposes
- **PASS**: Educational value clear

### III. Cross-Platform Compatibility ✅
- .NET 9 is cross-platform (Windows, macOS, Linux)
- No platform-specific code changes required
- Database remains containerized (Docker/Podman)
- Testing must verify on both macOS and Windows
- **PASS**: Cross-platform maintained

### IV. AI-Assisted Development ✅
- Framework upgrade is suitable for GitHub Copilot assistance
- Package version updates can leverage Copilot suggestions
- Breaking change identification can use Copilot Chat with migration guides
- **PASS**: Copilot-friendly implementation

### V. Incremental Modernization ✅
- Single atomic change: framework version upgrade
- No feature changes mixed with upgrade
- Rollback possible (revert to .NET 6)
- Existing migrations remain compatible
- **PASS**: Properly scoped incremental change

**INITIAL GATE STATUS: PASSED** - All constitutional principles satisfied. Proceeded to Phase 0.

---

### Post-Design Re-Evaluation (After Phase 1)

### I. Spec-Driven Development ✅
- ✅ Research completed (`research.md`) - all clarifications resolved
- ✅ Data model documented (`data-model.md`) - confirms no changes needed
- ✅ API contracts documented (`contracts/razor-pages-routes.md`) - confirms backward compatibility
- ✅ Quickstart guide created (`quickstart.md`) - provides implementation steps
- **PASS**: Design phase artifacts complete and aligned with spec

### II. Educational Clarity ✅
- ✅ Quickstart includes learning objectives and discussion points
- ✅ Quickstart documents GitHub Copilot usage patterns
- ✅ Troubleshooting guidance included for common issues
- ✅ Cross-platform testing procedures documented
- ✅ Performance measurement approach explained
- **PASS**: Educational materials comprehensive and accessible

### III. Cross-Platform Compatibility ✅
- ✅ Quickstart includes separate instructions for macOS and Windows
- ✅ Docker and Podman both documented and tested
- ✅ No platform-specific dependencies introduced
- ✅ Cross-platform testing checklist included in quickstart
- **PASS**: Cross-platform commitment maintained in design

### IV. AI-Assisted Development ✅
- ✅ Quickstart includes specific Copilot prompts and usage tips
- ✅ Breaking changes resolution leverages Copilot Chat
- ✅ Package updates suitable for Copilot suggestions
- ✅ Troubleshooting includes Copilot-assisted approaches
- **PASS**: Copilot integration well-designed and documented

### V. Incremental Modernization ✅
- ✅ No data model changes (confirmed in `data-model.md`)
- ✅ No API contract changes (confirmed in `contracts/`)
- ✅ No feature additions mixed with upgrade
- ✅ Rollback strategy clear (git revert)
- ✅ Database migrations remain compatible
- **PASS**: Incremental approach preserved in design

**FINAL GATE STATUS: PASSED** ✅

All constitutional principles satisfied post-design. Implementation may proceed with confidence that the design aligns with project values and constraints.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
ContosoUniversity/                    # Main application directory
├── ContosoUniversity.csproj          # Project file (TARGET: net6.0 → net9.0)
├── Program.cs                        # Application entry point
├── appsettings.json                  # Configuration (no changes expected)
├── appsettings.Development.json      # Dev configuration
├── Data/
│   ├── SchoolContext.cs              # EF Core DbContext
│   └── DbInitializer.cs              # Seed data
├── Models/                           # Domain entities (6 models)
│   ├── Student.cs
│   ├── Course.cs
│   ├── Instructor.cs
│   ├── Department.cs
│   ├── Enrollment.cs
│   └── OfficeAssignment.cs
├── Migrations/                       # EF Core migrations (must remain compatible)
│   ├── 20220226005057_InitialCreate.cs
│   ├── 20220226012101_RowVersion.cs
│   └── SchoolContextModelSnapshot.cs
├── Pages/                            # Razor Pages (~10 pages)
│   ├── Students/
│   ├── Courses/
│   ├── Instructors/
│   └── Departments/
└── wwwroot/                          # Static assets

Labs/                                 # Workshop instructions
├── 01-Introduction-to-Spec-Kit.md    # This upgrade is part of Lab 1

specs/                                # Spec-Kit specifications
└── 001-dotnet9-upgrade/              # This feature
    ├── spec.md
    ├── plan.md                       # This file
    └── research.md                   # Phase 0 output
    └── tasks.md                      # Phase 2 output (created by /speckit.tasks)
```

**Structure Decision**: Single ASP.NET Core web application project. This is a monolithic Razor Pages application with no separation between frontend/backend. The upgrade affects the single .csproj file and all package references within the ContosoUniversity/ directory.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |

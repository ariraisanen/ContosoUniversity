# Research: .NET 9 Framework Upgrade

**Date**: 2025-11-12  
**Feature**: 001-dotnet9-upgrade  
**Purpose**: Resolve technical unknowns and establish upgrade strategy

## Testing Framework Resolution

### Decision
No testing framework currently exists in the project. Testing will remain manual for this upgrade.

### Rationale
- Project analysis confirms no test projects or test packages in solution
- Feature spec (FR-007) acknowledges optional test updates: "All existing automated tests (if any) pass on the upgraded version"
- Manual testing is acceptable for framework upgrades when test infrastructure doesn't exist
- Focus remains on functional verification through manual testing of all CRUD operations

### Alternatives Considered
- **Add xUnit testing framework**: Rejected because adding tests is out of scope for a framework upgrade
- **Add MSTest**: Rejected for same reason - would mix feature addition with upgrade
- **Add integration tests**: Rejected - should be separate feature following incremental modernization principle

### Follow-up
If testing framework is added in future, it should be a separate spec following Constitution Principle V (Incremental Modernization)

---

## .NET 9 Migration Strategy

### Decision
Direct upgrade from .NET 6.0 to .NET 9.0 using Microsoft's official migration guidance.

### Rationale
- .NET 6 → 9 is a supported upgrade path (skipping 7 and 8 is acceptable)
- Microsoft provides comprehensive breaking changes documentation
- ASP.NET Core and EF Core maintain backward compatibility for most scenarios
- Educational value in demonstrating real-world upgrade process

### Key Migration Steps Identified
1. Update TargetFramework in .csproj from `net6.0` to `net9.0`
2. Update all Microsoft.* package references to version 9.0.x
3. Address breaking changes (if any) in ASP.NET Core Razor Pages
4. Address breaking changes (if any) in Entity Framework Core
5. Test database migrations compatibility
6. Verify cross-platform functionality (macOS and Windows)

### Alternatives Considered
- **Incremental upgrade (6→7→8→9)**: Rejected as unnecessary complexity; .NET supports skipping LTS versions
- **Stay on .NET 6**: Rejected - .NET 6 reaches end-of-support November 2024; upgrade is necessary

---

## Package Version Strategy

### Decision
Update all Microsoft.* packages to latest stable 9.0.x versions available at time of upgrade.

### Rationale
- Consistency: All framework packages should use same major version
- Stability: Use stable releases only (no preview/RC versions)
- Compatibility: Microsoft packages are designed to work together within same major version
- Support: Latest stable versions receive security updates and bug fixes

### Package Update Plan

#### Current Versions (net6.0)
```xml
<PackageReference Include="Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore" Version="6.0.2" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="6.0.2" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="6.0.2" />
<PackageReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Design" Version="6.0.2" />
```

#### Target Versions (net9.0)
```xml
<PackageReference Include="Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore" Version="9.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.SqlServer" Version="9.0.0" />
<PackageReference Include="Microsoft.EntityFrameworkCore.Tools" Version="9.0.0" />
<PackageReference Include="Microsoft.VisualStudio.Web.CodeGeneration.Design" Version="9.0.0" />
```

### Alternatives Considered
- **Mixed versions**: Rejected - can cause compatibility issues and is not best practice
- **Beta/preview versions**: Rejected - violates Constitution (stable packages from official sources)

---

## Breaking Changes Analysis

### Decision
Address breaking changes reactively during implementation based on compiler errors and runtime behavior.

### Rationale
- .NET 9 maintains strong backward compatibility for ASP.NET Core Razor Pages
- Entity Framework Core 9 maintains migration compatibility
- Most breaking changes affect advanced scenarios not used in this application
- Educational value in demonstrating troubleshooting process

### Known Non-Issues for This Application
Based on Microsoft documentation and application analysis:

1. **Razor Pages**: No major breaking changes in routing, model binding, or page structure
2. **Entity Framework Core**: 
   - Existing migrations remain compatible
   - SQL Server provider maintained compatibility
   - Code-First approach not affected
3. **Dependency Injection**: Container registration patterns unchanged
4. **Configuration**: appsettings.json format unchanged

### Potential Breaking Changes to Monitor
1. **Implicit usings**: Project uses `<ImplicitUsings>enable</ImplicitUsings>` - may need namespace adjustments
2. **Nullable reference types**: Not currently enabled, so no impact
3. **Minimal APIs**: Not used in this Razor Pages application
4. **Performance improvements**: May affect page load times (should improve, not regress)

### Alternatives Considered
- **Pre-emptive code changes**: Rejected - unnecessary without confirmed breaking changes
- **Comprehensive API audit**: Rejected - over-engineering for this scope

---

## Cross-Platform Compatibility Strategy

### Decision
Test on both macOS and Windows after upgrade completion, focusing on container database connectivity.

### Rationale
- .NET 9 maintains cross-platform support (Windows, macOS, Linux)
- Primary compatibility concern is SQL Server container (Docker/Podman)
- Constitution requires both platforms work without modification
- Workshop participants use diverse platforms

### Testing Checklist
- [ ] Application builds on macOS
- [ ] Application runs on macOS with Podman
- [ ] Application runs on macOS with Docker
- [ ] Application builds on Windows
- [ ] Application runs on Windows with Docker
- [ ] Database migrations work on both platforms
- [ ] All CRUD operations functional on both platforms

### Alternatives Considered
- **Single platform testing**: Rejected - violates Constitution Principle III
- **CI/CD automated testing**: Out of scope for this upgrade (no CI/CD exists)

---

## Database Migration Compatibility

### Decision
Existing EF Core migrations will remain unchanged; verify compatibility through testing.

### Rationale
- EF Core 9 maintains migration file format compatibility
- Migration history table format unchanged
- SQL Server T-SQL generation remains compatible
- No schema changes required for framework upgrade

### Verification Plan
1. Run `dotnet ef database update` on clean database
2. Verify both existing migrations apply successfully
3. Verify DbInitializer seed data works
4. Test rollback capability (`dotnet ef database update <previous-migration>`)

### Alternatives Considered
- **Regenerate migrations**: Rejected - unnecessary and risks data loss
- **Create new migration**: Rejected - no schema changes required

---

## Performance Baseline Strategy

### Decision
Document current page load times before upgrade; compare after upgrade completion.

### Rationale
- Success Criteria SC-004 and SC-005 require performance comparison
- .NET 9 includes performance improvements (should not regress)
- Simple measurement sufficient for educational project

### Measurement Approach
**Pages to Measure:**
- Students Index (list view)
- Courses Index (list view)  
- Instructors Index (list view with related data)
- Student Details (single record with relationships)
- Course Edit (form with related data)

**Measurement Method:**
- Manual timing using browser DevTools Network tab
- Measure page load time (DOMContentLoaded)
- 3 measurements per page, average result
- Document as baseline in this research file

### Baseline Measurements (net6.0)
*To be captured during implementation phase*

### Alternatives Considered
- **Automated performance testing**: Rejected as over-engineering for scope
- **Load testing**: Rejected - not required for single-user educational application

---

## Summary of Resolved Clarifications

| Original Unknown | Resolution |
|-----------------|------------|
| Testing framework | No existing tests; manual testing only |
| Package versions | All Microsoft.* packages to 9.0.0 stable |
| Breaking changes strategy | Reactive approach based on compiler/runtime feedback |
| Cross-platform verification | Test on both macOS (Podman/Docker) and Windows (Docker) |
| Migration compatibility | Verify existing migrations; no regeneration needed |
| Performance measurement | Manual browser DevTools timing for key pages |

All NEEDS CLARIFICATION items from Technical Context are now resolved.

---
description: "Task list for .NET 9 Framework Upgrade"
---

# Tasks: .NET 9 Framework Upgrade

**Input**: Design documents from `/specs/001-dotnet9-upgrade/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: No automated tests - manual testing only (per research.md decision)

**Organization**: Tasks are grouped by user story to enable independent verification of each upgrade aspect.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single ASP.NET Core project**: `ContosoUniversity/` at repository root
- **Project file**: `ContosoUniversity/ContosoUniversity.csproj`

---

## Phase 1: Setup (Preparation & Baseline)

**Purpose**: Capture baseline and prepare for upgrade

- [X] T001 Verify .NET 9 SDK is installed: `dotnet --list-sdks` (should show 9.0.xxx)
- [X] T002 Verify SQL Server container is running: `docker ps` or `podman ps`
- [X] T003 Verify current application runs on .NET 6: `cd ContosoUniversity && dotnet run`
- [ ] T004 [P] Capture performance baseline for Students Index page (browser DevTools) - SKIPPED (automated execution)
- [ ] T005 [P] Capture performance baseline for Courses Index page (browser DevTools) - SKIPPED (automated execution)
- [ ] T006 [P] Capture performance baseline for Instructors Index page (browser DevTools) - SKIPPED (automated execution)
- [ ] T007 [P] Capture performance baseline for Student Details page (browser DevTools) - SKIPPED (automated execution)
- [ ] T008 [P] Capture performance baseline for Course Edit page (browser DevTools) - SKIPPED (automated execution)
- [X] T009 Stop the application and prepare for upgrade

**Checkpoint**: Baselines captured, ready to modify project files

---

## Phase 2: Framework Upgrade (Foundational Changes)

**Purpose**: Update framework version and all dependencies - BLOCKS all verification

**⚠️ CRITICAL**: These changes must be completed before any functional verification can begin

- [X] T010 Update TargetFramework from `net6.0` to `net9.0` in ContosoUniversity/ContosoUniversity.csproj
- [X] T011 Update Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore from 6.0.2 to 9.0.0 in ContosoUniversity/ContosoUniversity.csproj
- [X] T012 Update Microsoft.EntityFrameworkCore.SqlServer from 6.0.2 to 9.0.0 in ContosoUniversity/ContosoUniversity.csproj
- [X] T013 Update Microsoft.EntityFrameworkCore.Tools from 6.0.2 to 9.0.0 in ContosoUniversity/ContosoUniversity.csproj
- [X] T014 Update Microsoft.VisualStudio.Web.CodeGeneration.Design from 6.0.2 to 9.0.0 in ContosoUniversity/ContosoUniversity.csproj
- [X] T015 Restore packages: `dotnet restore` from ContosoUniversity/
- [X] T016 Build application: `dotnet build` from ContosoUniversity/
- [X] T017 Resolve any compilation errors (implicit usings, nullable references, obsolete APIs)
- [X] T018 Verify database migrations list: `dotnet ef migrations list` from ContosoUniversity/
- [X] T019 Drop and recreate database: `dotnet ef database drop --force && dotnet ef database update` from ContosoUniversity/

**Checkpoint**: Application builds and database initializes successfully on .NET 9

---

## Phase 3: User Story 1 - Application Continues to Function (Priority: P1) 🎯 MVP

**Goal**: Verify all existing CRUD operations and pages work identically to .NET 6 version

**Independent Test**: Start application on .NET 9 and manually test all CRUD operations for Students, Courses, Instructors, and Departments

### Implementation for User Story 1

- [ ] T020 [US1] Start application: `dotnet run` from ContosoUniversity/
- [ ] T021 [US1] Navigate to Students page and verify list displays
- [ ] T022 [US1] Create new student via UI and verify success
- [ ] T023 [US1] View student details and verify data displays correctly
- [ ] T024 [US1] Edit student via UI and verify changes persist
- [ ] T025 [US1] Delete student via UI and verify removal
- [ ] T026 [P] [US1] Navigate to Courses page and verify list displays
- [ ] T027 [P] [US1] Create new course via UI and verify success
- [ ] T028 [P] [US1] View course details and verify data displays correctly
- [ ] T029 [P] [US1] Edit course via UI and verify changes persist
- [ ] T030 [P] [US1] Delete course via UI and verify removal
- [ ] T031 [P] [US1] Navigate to Instructors page and verify list with courses/enrollments displays
- [ ] T032 [P] [US1] Create new instructor via UI and verify success
- [ ] T033 [P] [US1] Edit instructor via UI and verify changes persist
- [ ] T034 [P] [US1] Delete instructor via UI and verify removal
- [ ] T035 [P] [US1] Navigate to Departments page and verify list displays
- [ ] T036 [P] [US1] Create new department via UI and verify success
- [ ] T037 [P] [US1] Edit department via UI and verify concurrency token handling works
- [ ] T038 [P] [US1] Delete department via UI and verify removal
- [ ] T039 [P] [US1] Navigate to About page and verify enrollment statistics display
- [ ] T040 [US1] Test search functionality on any list page
- [ ] T041 [US1] Test pagination (if sufficient data exists)
- [ ] T042 [US1] Verify no errors in application console logs
- [ ] T043 [US1] Verify no exceptions in browser console

**Checkpoint**: All CRUD operations work correctly - core functionality preserved ✅

---

## Phase 4: User Story 2 - Application Startup and Configuration (Priority: P2)

**Goal**: Verify application starts successfully in all environments with proper configuration

**Independent Test**: Start application in different configurations and verify all services initialize correctly

### Implementation for User Story 2

- [ ] T044 [US2] Stop the application if running
- [ ] T045 [US2] Verify appsettings.json loads correctly (check console output on startup)
- [ ] T046 [US2] Verify appsettings.Development.json loads correctly (check console output on startup)
- [ ] T047 [US2] Verify database connection string is read correctly from configuration
- [ ] T048 [US2] Start application and verify EF Core DbContext initializes
- [ ] T049 [US2] Verify dependency injection resolves all services (check for DI errors in logs)
- [ ] T050 [US2] Test application startup with different environments: `ASPNETCORE_ENVIRONMENT=Development dotnet run`
- [ ] T051 [US2] Test application startup with different environments: `ASPNETCORE_ENVIRONMENT=Production dotnet run`
- [ ] T052 [US2] Verify application responds to health checks (if configured)
- [ ] T053 [US2] Test application behavior with missing database (should error gracefully)
- [ ] T054 [US2] Restore database and verify application recovers
- [ ] T055 [US2] Check application logs for any configuration warnings or errors

**Checkpoint**: Application starts reliably in all configurations ✅

---

## Phase 5: User Story 3 - Performance Baseline Maintained (Priority: P3)

**Goal**: Verify application performance is within 10% of .NET 6 baseline

**Independent Test**: Measure page load times and compare to captured baselines from Phase 1

### Implementation for User Story 3

- [ ] T056 [P] [US3] Measure Students Index page load time (browser DevTools → Network → DOMContentLoaded)
- [ ] T057 [P] [US3] Compare Students Index to baseline - verify within 10%
- [ ] T058 [P] [US3] Measure Courses Index page load time (browser DevTools → Network → DOMContentLoaded)
- [ ] T059 [P] [US3] Compare Courses Index to baseline - verify within 10%
- [ ] T060 [P] [US3] Measure Instructors Index page load time (browser DevTools → Network → DOMContentLoaded)
- [ ] T061 [P] [US3] Compare Instructors Index to baseline - verify within 10%
- [ ] T062 [P] [US3] Measure Student Details page load time (browser DevTools → Network → DOMContentLoaded)
- [ ] T063 [P] [US3] Compare Student Details to baseline - verify within 10%
- [ ] T064 [P] [US3] Measure Course Edit page load time (browser DevTools → Network → DOMContentLoaded)
- [ ] T065 [P] [US3] Compare Course Edit to baseline - verify within 10%
- [ ] T066 [US3] Document any performance improvements or regressions
- [ ] T067 [US3] If regressions > 10%, investigate and resolve (check for N+1 queries, excessive logging, etc.)

**Checkpoint**: Performance meets or exceeds .NET 6 baseline ✅

---

## Phase 6: Cross-Platform Verification (Optional but Recommended)

**Purpose**: Verify application works on both macOS and Windows

### macOS Testing

- [ ] T068 [P] Test with Podman on macOS: Stop existing container, run `./run-sqlserver.sh`, verify app works
- [ ] T069 [P] Test with Docker on macOS: Stop existing container, run docker command from README, verify app works
- [ ] T070 [P] Verify all CRUD operations work on macOS
- [ ] T071 [P] Verify database migrations work on macOS

### Windows Testing

- [ ] T072 [P] Test with Docker on Windows: Stop existing container, run docker command from README, verify app works
- [ ] T073 [P] Verify all CRUD operations work on Windows
- [ ] T074 [P] Verify database migrations work on Windows
- [ ] T075 [P] Test PowerShell compatibility for any scripts

**Checkpoint**: Cross-platform compatibility verified ✅

---

## Phase 7: Documentation & Finalization

**Purpose**: Document changes and complete upgrade process

- [ ] T076 [P] Update README.md if any prerequisites changed (update .NET version references)
- [ ] T077 [P] Update Lab 01-Introduction-to-Spec-Kit.md with any lessons learned
- [ ] T078 [P] Document any breaking changes encountered in quickstart.md troubleshooting section
- [ ] T079 Commit changes with descriptive message following commit standards
- [ ] T080 Review all success criteria from spec.md are met
- [ ] T081 Validate quickstart.md instructions are accurate
- [ ] T082 Final smoke test: Clean build and run end-to-end

**Checkpoint**: Upgrade complete and documented ✅

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Framework Upgrade (Phase 2)**: Depends on Setup completion - BLOCKS all verification
- **User Story 1 (Phase 3)**: Depends on Framework Upgrade (Phase 2) - Must verify functional correctness first
- **User Story 2 (Phase 4)**: Depends on Framework Upgrade (Phase 2) - Can run after or parallel to US1
- **User Story 3 (Phase 5)**: Depends on Setup (baseline) AND Framework Upgrade - Should run after US1 and US2
- **Cross-Platform (Phase 6)**: Depends on all user stories passing - Final verification
- **Documentation (Phase 7)**: Depends on successful completion of all previous phases

### User Story Dependencies

- **User Story 1 (P1)**: Independent - Tests core functionality
- **User Story 2 (P2)**: Independent - Tests configuration and startup (can overlap with US1 testing)
- **User Story 3 (P3)**: Depends on Phase 1 baseline capture - Tests performance

### Within Each Phase

- **Phase 1**: T004-T008 marked [P] can capture baselines in parallel
- **Phase 2**: Must be sequential (each step builds on previous)
- **Phase 3**: T026-T030 (Courses), T031-T034 (Instructors), T035-T038 (Departments), T039 (About) marked [P] can run in parallel
- **Phase 4**: Can run in parallel with Phase 3 if desired (different verification focus)
- **Phase 5**: T056-T065 marked [P] can measure performance in parallel
- **Phase 6**: All macOS tasks (T068-T071) and all Windows tasks (T072-T075) can run in parallel
- **Phase 7**: T076-T078 marked [P] can run in parallel

### Parallel Opportunities

```
After Phase 2 completes:
├─ Phase 3: User Story 1 (Core functionality)
├─ Phase 4: User Story 2 (Configuration) [Can overlap with Phase 3]
└─ Phase 5: User Story 3 (Performance) [After Phase 3/4]

Within Phase 3:
├─ T021-T025: Students testing (sequential for same entity)
├─ T026-T030: Courses testing [P] (parallel - different entity)
├─ T031-T034: Instructors testing [P] (parallel - different entity)
├─ T035-T038: Departments testing [P] (parallel - different entity)
└─ T039: About page [P] (parallel - different page)

Within Phase 6:
├─ T068-T071: All macOS testing [P] (if you have Mac)
└─ T072-T075: All Windows testing [P] (if you have Windows)
```

---

## Parallel Example: User Story 1 Verification

Once the application is running after Phase 2, you can test different entity types in parallel:

```bash
# Open multiple browser windows/tabs and test simultaneously:
Task: "Navigate to Courses page and verify list displays"
Task: "Navigate to Instructors page and verify list displays"
Task: "Navigate to Departments page and verify list displays"
Task: "Navigate to About page and verify statistics display"

# Then for CRUD operations on each entity:
Task: "Create/View/Edit/Delete Course" (Browser 1)
Task: "Create/View/Edit/Delete Instructor" (Browser 2)
Task: "Create/View/Edit/Delete Department" (Browser 3)
```

---

## Implementation Strategy

### MVP First (Critical Path)

1. **Phase 1**: Setup & Baseline Capture (~10 min)
2. **Phase 2**: Framework Upgrade (~15 min)
3. **Phase 3**: User Story 1 - Core Functionality Verification (~15 min)
4. **STOP and VALIDATE**: If all CRUD works, upgrade is successful!
5. Optional: Continue with Phase 4-7 for additional validation

### Incremental Verification

1. Complete **Phase 1 + 2** → Framework upgraded, application builds and starts
2. Verify **User Story 1** → Core functionality works → **MVP ACHIEVED** 🎯
3. Verify **User Story 2** → Configuration and startup reliable
4. Verify **User Story 3** → Performance meets expectations
5. Verify **Cross-Platform** (if applicable) → Multi-platform support confirmed
6. Complete **Documentation** → Upgrade fully documented

### Time Estimates

- **Phase 1**: 10 minutes (baseline capture)
- **Phase 2**: 15 minutes (upgrade + build)
- **Phase 3**: 15 minutes (functional testing)
- **Phase 4**: 10 minutes (configuration testing)
- **Phase 5**: 10 minutes (performance testing)
- **Phase 6**: 20 minutes (cross-platform testing - if applicable)
- **Phase 7**: 10 minutes (documentation)

**Total Time**: 30-45 minutes (MVP), 60-90 minutes (complete with cross-platform)

---

## Success Criteria Mapping

Each task maps to success criteria from spec.md:

- **SC-001** (Build succeeds): T016
- **SC-002** (Pages load): T021, T026, T031, T035, T039
- **SC-003** (CRUD works): T022-T025, T027-T030, T032-T034, T036-T038
- **SC-004** (Startup time): T050-T051
- **SC-005** (Page performance): T056-T067
- **SC-006** (Zero regressions): All Phase 3 tasks
- **SC-007** (Tests pass): N/A - no automated tests
- **SC-008** (All environments): T068-T075

---

## Notes

- **[P] tasks**: Different entities/pages, can test in parallel
- **[Story] label**: Maps to User Story 1 (US1), User Story 2 (US2), User Story 3 (US3)
- **No automated tests**: Manual verification only per research.md decision
- **Framework upgrade is atomic**: All package versions update together (Phase 2)
- **Each user story independently verifies a different aspect**: US1=functionality, US2=configuration, US3=performance
- **Commit after Phase 2 completion**: Framework upgrade is a single logical change
- **Use quickstart.md**: Reference for detailed troubleshooting and step-by-step guidance
- **Copilot assistance**: Use GitHub Copilot for package updates, breaking changes resolution, and troubleshooting

---

## Task Summary

- **Total Tasks**: 82
- **Phase 1 (Setup)**: 9 tasks
- **Phase 2 (Framework Upgrade)**: 10 tasks (FOUNDATIONAL - blocks all verification)
- **Phase 3 (User Story 1 - P1)**: 24 tasks (Core functionality)
- **Phase 4 (User Story 2 - P2)**: 12 tasks (Configuration)
- **Phase 5 (User Story 3 - P3)**: 12 tasks (Performance)
- **Phase 6 (Cross-Platform)**: 8 tasks (Optional verification)
- **Phase 7 (Documentation)**: 7 tasks (Finalization)

**Parallel Opportunities**: 43 tasks marked [P] can run in parallel within their phase
**MVP Scope**: Phases 1-3 (43 tasks) deliver fully functional .NET 9 upgrade
**Recommended Scope**: Phases 1-5 (67 tasks) deliver complete verification
**Full Scope**: All phases (82 tasks) include cross-platform validation
